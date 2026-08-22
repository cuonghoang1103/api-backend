/**
 * Docker — Chương 10: một stack thật (Next.js + Node API + Postgres + Redis + nginx).
 * Bản vẽ · tầng dữ liệu · API & migration · frontend · nginx đứng trước · quiz.
 * Output CHẠY THẬT Docker Compose v2.29 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 10 — Compose in real life|||Chương 10 — Compose trong đời thật',
  description: 'Dựng trọn vẹn một stack năm dịch vụ chạy được thật: Next.js, một API Node, PostgreSQL, Redis và nginx — kèm migration, seed, healthcheck, tách mạng công khai/nội bộ, và cách chạy đúng file đó ở cả máy phát triển lẫn máy chủ.',
  lessons: [
    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — The stack, drawn|||10.1 — Bản vẽ của stack',
      slug: 'dk-10-1-ban-ve',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Năm dịch vụ và ba việc chạy một lần, ai nói chuyện với ai, hai mạng và ai nằm trên mạng nào, cây thư mục, và bốn quyết định định hình mọi thứ còn lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>The stack, drawn</h2>
<p class="lead">Nine chapters of pieces; this one assembles them. We are building the shape almost every small production application has — a browser-facing frontend, an API, a database, a cache, and a reverse proxy in front — and doing it with the network split, healthchecks and migration ordering from the previous chapters rather than bolting them on later.</p>

<h3>What we are building</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">public network</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">nginx</span><span class="lz-nsub">The only service with published ports — 80 and 443. TLS, static caching, routing /api to the backend.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">web · Next.js</span><span class="lz-nsub">Server-rendered frontend on 3000. No published port; nginx reaches it by name.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">api · Node/Express</span><span class="lz-nsub">On BOTH networks: reachable from nginx, and able to reach the database.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">private · internal</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">db · PostgreSQL 16</span><span class="lz-nsub">No published port, no route to the internet. Named volume for the data.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">cache · Redis 7</span><span class="lz-nsub">Sessions and rate limits. Also invisible from outside.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">worker</span><span class="lz-nsub">Same image as the API, different command. Background jobs, no HTTP.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">run once, then exit</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">migrate</span><span class="lz-nsub">prisma migrate deploy. Must finish before api and worker start.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">seed · profile</span><span class="lz-nsub">Only on request. Never on a production deploy.</span></div></div>
  </div>
</div>

<h3>Who may talk to whom</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Browser → nginx</span><span class="v">The only path in. Ports 80 and 443 published on all interfaces; everything else is invisible from outside the host.</span></div>
  <div class="kv"><span class="k">nginx → web, api</span><span class="v">By service name on the public network. <code>/</code> and <code>/_next</code> to <code>web:3000</code>, <code>/api</code> to <code>api:3000</code>.</span></div>
  <div class="kv"><span class="k">api, worker → db, cache</span><span class="v">By service name on the private network. No ports published anywhere in this path.</span></div>
  <div class="kv"><span class="k">nginx → db</span><span class="v"><strong>Impossible.</strong> nginx has no interface on the private network — it cannot even resolve the name (Lesson 8.3). A compromised proxy gains nothing.</span></div>
  <div class="kv"><span class="k">web → api</span><span class="v">Server-side rendering calls <code>http://api:3000</code> internally; the browser calls <code>/api</code> through nginx. Two different URLs for the same API, and Lesson 10.4 is largely about that distinction.</span></div>
  <div class="kv"><span class="k">db, cache → internet</span><span class="v"><strong>No route.</strong> The private network is <code>internal: true</code>, so even a compromised database container cannot exfiltrate outward.</span></div>
</div>

<h3>The file tree</h3>
<pre><code>blog/
├── compose.yaml               <span class="tok-comment"># base: images, networks, volumes, healthchecks</span>
├── compose.override.yaml      <span class="tok-comment"># dev: builds, bind mounts, ports, hot reload</span>
├── compose.prod.yaml          <span class="tok-comment"># prod: limits, restart, log rotation, loopback</span>
├── .env.example               <span class="tok-comment"># committed, every key, no values</span>
├── Dockerfile.backend         <span class="tok-comment"># the API and the worker (Lesson 10.3)</span>
├── frontend/
│   ├── Dockerfile             <span class="tok-comment"># Next.js standalone (Lesson 10.4)</span>
│   └── next.config.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── ops/
│   ├── nginx.conf             <span class="tok-comment"># the reverse proxy (Lesson 10.5)</span>
│   └── postgres-init/         <span class="tok-comment"># extensions, run once at initdb</span>
└── src/                       <span class="tok-comment"># the API source</span></code></pre>

<h3>Four decisions that shape everything else</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Exactly one service publishes ports</span><span class="lz-t">nginx, and nothing else</span><span class="lz-d">Every other service is reachable only over a container network. This removes the entire class of accidents from Lesson 8.2 — there is no database port to forget about, because there never was one.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Migrations are a service, not an entrypoint hack</span><span class="lz-t">a container that runs and exits 0</span><span class="lz-d">With <code>service_completed_successfully</code> the API cannot start against an un-migrated schema, and a failed migration aborts the deploy instead of producing a half-working app.</span></div>
  <div class="lz-step"><span class="lz-k">3 · One image, three commands</span><span class="lz-t">api, worker and migrate share Dockerfile.backend</span><span class="lz-d">One build, one thing to scan and patch, and no chance of the worker running different code from the API. Only <code>command</code> differs.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Base file is production; the override is development</span><span class="lz-t">the server never sees compose.override.yaml</span><span class="lz-d">The default <code>docker compose up</code> gives a developer bind mounts and hot reload, while the deploy script passes <code>-f</code> explicitly and gets the plain base (Lesson 9.5).</span></div>
</div>

<h3>The skeleton, before we fill it in</h3>
<pre><code>name: blog

services:
  nginx:   { depends_on: [web, api], networks: [public] }
  web:     { depends_on: [api],      networks: [public] }
  api:     { networks: [public, private] }
  worker:  { networks: [private] }
  db:      { networks: [private] }
  cache:   { networks: [private] }
  migrate: { networks: [private], restart: "no" }
  seed:    { networks: [private], profiles: [seed], restart: "no" }

networks:
  public:
  private:
    internal: true

volumes:
  pgdata:
  redisdata:</code></pre>
<div class="callout ok"><strong>Read the <code>networks</code> lines as an access-control policy, because that is what they are.</strong> <code>api</code> appears on both lists and is the only service that does; that single fact is what lets a request cross from the outside world to the database, and nothing else can make that crossing. Deciding this <em>before</em> writing the services is much easier than retrofitting it — and it is the part of a compose file that a reviewer should read first.</div>

<h3>What each of the remaining lessons adds</h3>
<pre><code>10.2  db + cache        <span class="tok-comment"># healthchecks, init scripts, tuning, persistence</span>
10.3  api + worker      <span class="tok-comment"># Dockerfile.backend, migrate as a job, seeds</span>
10.4  web               <span class="tok-comment"># Next.js standalone, build-time vs runtime env</span>
10.5  nginx + assembly  <span class="tok-comment"># proxy config, TLS, the complete file, deploy</span></code></pre>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/production/" target="_blank" rel="noopener">
  <span class="lc-ico">🏭</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Compose in production</span><span class="lc-sub">The official checklist for moving a compose stack from a laptop to a server: removing bind mounts, binding to different ports, restart policies, and building at deploy time versus pulling.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/networking/" target="_blank" rel="noopener">
  <span class="lc-ico">🕸️</span>
  <span class="lc-body"><span class="lc-title">Compose — networking</span><span class="lc-sub">How compose creates a default network, how service names resolve, and the multi-network setup this chapter uses to separate a public tier from a private one.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: plan a stack</span><span class="lc-sub">Graded exercises: given six services, decide which networks each joins and which publishes ports, then justify why the proxy must not be able to resolve the database name.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> designing the stack by adding services one at a time and letting compose's default network hold everything. It works immediately, which is the trap — every service can reach every other service, so a vulnerability in the image-resizing worker is one <code>psql</code> away from your users table, and nobody notices because nothing is broken. Decide the network split first, while there are three services and it takes two minutes, rather than after there are nine and separating them means testing every path again. The rule that survives contact with reality: a service joins a network only if it must <em>initiate</em> a connection on it, and only the reverse proxy publishes ports.</div>
<p class="note-ct"><strong>Three things to remember.</strong> One service publishes ports and everything else is reachable only by container name — that single decision eliminates most of Chapter 8's accidents. Migrations belong in their own service gated by <code>service_completed_successfully</code>, so a failed migration stops the deploy instead of producing a half-working app. And the <code>networks:</code> lines are an access-control policy: write them before the services, not after.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Bản vẽ của stack</h2>
<p class="lead">Chín chương toàn những mảnh rời; chương này lắp chúng lại. Chúng ta dựng đúng hình dạng mà gần như mọi ứng dụng production nhỏ đều có — một frontend hướng ra trình duyệt, một API, một cơ sở dữ liệu, một cache, và một reverse proxy đứng trước — và làm ngay bằng cách tách mạng, healthcheck và thứ tự migration của các chương trước, thay vì gắn thêm vào sau.</p>

<h3>Chúng ta dựng cái gì</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">mạng công khai</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">nginx</span><span class="lz-nsub">Dịch vụ DUY NHẤT có cổng công bố — 80 và 443. TLS, cache tĩnh, định tuyến /api về backend.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">web · Next.js</span><span class="lz-nsub">Frontend kết xuất phía máy chủ ở cổng 3000. Không công bố cổng nào; nginx gọi nó bằng tên.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">api · Node/Express</span><span class="lz-nsub">Nằm trên CẢ HAI mạng: nginx với tới được, và nó với tới được cơ sở dữ liệu.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">riêng · internal</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">db · PostgreSQL 16</span><span class="lz-nsub">Không công bố cổng, không có đường ra Internet. Volume có tên để chứa dữ liệu.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">cache · Redis 7</span><span class="lz-nsub">Phiên đăng nhập và giới hạn tần suất. Cũng vô hình từ bên ngoài.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">worker</span><span class="lz-nsub">Cùng cái ảnh với API, khác câu lệnh. Việc chạy nền, không có HTTP.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">chạy một lần rồi thoát</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">migrate</span><span class="lz-nsub">prisma migrate deploy. Phải xong TRƯỚC khi api và worker khởi động.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">seed · profile</span><span class="lz-nsub">Chỉ chạy khi được gọi. Không bao giờ trong một lượt deploy production.</span></div></div>
  </div>
</div>

<h3>Ai được nói chuyện với ai</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trình duyệt → nginx</span><span class="v">Đường vào duy nhất. Cổng 80 và 443 công bố trên mọi giao diện; mọi thứ khác vô hình từ bên ngoài máy chủ.</span></div>
  <div class="kv"><span class="k">nginx → web, api</span><span class="v">Gọi bằng tên dịch vụ trên mạng công khai. <code>/</code> và <code>/_next</code> về <code>web:3000</code>, <code>/api</code> về <code>api:3000</code>.</span></div>
  <div class="kv"><span class="k">api, worker → db, cache</span><span class="v">Gọi bằng tên dịch vụ trên mạng riêng. Không có cổng nào được công bố ở bất kỳ đâu trên đường này.</span></div>
  <div class="kv"><span class="k">nginx → db</span><span class="v"><strong>Bất khả.</strong> nginx không có giao diện nào trên mạng riêng — nó thậm chí không phân giải nổi cái tên (Bài 8.3). Một proxy bị chiếm chẳng được gì.</span></div>
  <div class="kv"><span class="k">web → api</span><span class="v">Kết xuất phía máy chủ gọi <code>http://api:3000</code> ở nội bộ; trình duyệt gọi <code>/api</code> qua nginx. Hai URL khác nhau cho cùng một API, và Bài 10.4 chủ yếu nói về phân biệt đó.</span></div>
  <div class="kv"><span class="k">db, cache → Internet</span><span class="v"><strong>Không có đường.</strong> Mạng riêng đặt <code>internal: true</code>, nên kể cả một container cơ sở dữ liệu bị chiếm cũng không tuồn dữ liệu ra ngoài được.</span></div>
</div>

<h3>Cây thư mục</h3>
<pre><code>blog/
├── compose.yaml               <span class="tok-comment"># nền: ảnh, mạng, volume, healthcheck</span>
├── compose.override.yaml      <span class="tok-comment"># dev: build, bind mount, cổng, nạp nóng</span>
├── compose.prod.yaml          <span class="tok-comment"># prod: hạn mức, restart, xoay log, loopback</span>
├── .env.example               <span class="tok-comment"># có commit, đủ khoá, không giá trị</span>
├── Dockerfile.backend         <span class="tok-comment"># API và worker (Bài 10.3)</span>
├── frontend/
│   ├── Dockerfile             <span class="tok-comment"># Next.js standalone (Bài 10.4)</span>
│   └── next.config.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── ops/
│   ├── nginx.conf             <span class="tok-comment"># reverse proxy (Bài 10.5)</span>
│   └── postgres-init/         <span class="tok-comment"># extension, chạy một lần lúc initdb</span>
└── src/                       <span class="tok-comment"># mã nguồn API</span></code></pre>

<h3>Bốn quyết định định hình mọi thứ còn lại</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · ĐÚNG MỘT dịch vụ công bố cổng</span><span class="lz-t">nginx, và không gì khác</span><span class="lz-d">Mọi dịch vụ khác chỉ với tới được qua mạng container. Điều này xoá bỏ nguyên nhóm tai nạn ở Bài 8.2 — không có cổng cơ sở dữ liệu nào để mà quên, vì chưa từng có cái nào.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Migration là một DỊCH VỤ, không phải một mẹo trong entrypoint</span><span class="lz-t">một container chạy rồi thoát 0</span><span class="lz-d">Với <code>service_completed_successfully</code>, API không thể khởi động trên một schema chưa migrate, và một lần migration hỏng sẽ huỷ cả lượt deploy thay vì đẻ ra một ứng dụng chạy được nửa vời.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Một cái ảnh, ba câu lệnh</span><span class="lz-t">api, worker và migrate dùng chung Dockerfile.backend</span><span class="lz-d">Một lượt dựng, một thứ để quét và vá, và không có cơ hội nào để worker chạy mã khác với API. Chỉ <code>command</code> là khác.</span></div>
  <div class="lz-step"><span class="lz-k">4 · File nền là production; file ghi đè là phát triển</span><span class="lz-t">máy chủ không bao giờ thấy compose.override.yaml</span><span class="lz-d">Lệnh <code>docker compose up</code> mặc định cho lập trình viên bind mount và nạp nóng, còn script deploy truyền <code>-f</code> tường minh và nhận đúng phần nền trơn (Bài 9.5).</span></div>
</div>

<h3>Bộ khung, trước khi chúng ta điền vào</h3>
<pre><code>name: blog

services:
  nginx:   { depends_on: [web, api], networks: [public] }
  web:     { depends_on: [api],      networks: [public] }
  api:     { networks: [public, private] }
  worker:  { networks: [private] }
  db:      { networks: [private] }
  cache:   { networks: [private] }
  migrate: { networks: [private], restart: "no" }
  seed:    { networks: [private], profiles: [seed], restart: "no" }

networks:
  public:
  private:
    internal: true

volumes:
  pgdata:
  redisdata:</code></pre>
<div class="callout ok"><strong>Hãy đọc mấy dòng <code>networks</code> như một chính sách kiểm soát truy cập, vì đúng là như vậy.</strong> <code>api</code> xuất hiện ở cả hai danh sách và là dịch vụ duy nhất làm thế; riêng chi tiết đó là thứ cho phép một yêu cầu đi từ thế giới bên ngoài tới cơ sở dữ liệu, và không gì khác vượt qua được ranh giới ấy. Quyết chuyện này TRƯỚC khi viết các dịch vụ dễ hơn nhiều so với gắn vào sau — và đó là phần của một file compose mà người review nên đọc đầu tiên.</div>

<h3>Mỗi bài còn lại thêm gì</h3>
<pre><code>10.2  db + cache        <span class="tok-comment"># healthcheck, script khởi tạo, tinh chỉnh, lưu lâu dài</span>
10.3  api + worker      <span class="tok-comment"># Dockerfile.backend, migrate thành một việc, seed</span>
10.4  web               <span class="tok-comment"># Next.js standalone, biến lúc dựng với lúc chạy</span>
10.5  nginx + lắp ráp   <span class="tok-comment"># cấu hình proxy, TLS, file hoàn chỉnh, deploy</span></code></pre>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/production/" target="_blank" rel="noopener">
  <span class="lc-ico">🏭</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Compose trên production</span><span class="lc-sub">Danh sách kiểm chính thức để đưa một stack compose từ máy cá nhân lên máy chủ: bỏ bind mount, gắn cổng khác đi, chính sách restart, và dựng lúc deploy so với kéo ảnh về.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/networking/" target="_blank" rel="noopener">
  <span class="lc-ico">🕸️</span>
  <span class="lc-body"><span class="lc-title">Compose — mạng</span><span class="lc-sub">Compose tạo mạng mặc định ra sao, tên dịch vụ phân giải thế nào, và cấu hình nhiều mạng mà chương này dùng để tách tầng công khai khỏi tầng riêng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: lên bản vẽ cho một stack</span><span class="lc-sub">Bài chấm điểm: cho sáu dịch vụ, quyết định mỗi cái vào mạng nào và cái nào công bố cổng, rồi biện luận vì sao proxy không được phép phân giải nổi tên cơ sở dữ liệu.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> thiết kế stack bằng cách thêm dần từng dịch vụ rồi để mạng mặc định của compose ôm hết. Nó chạy được ngay, và đó chính là cái bẫy — mọi dịch vụ với tới được mọi dịch vụ khác, nên một lỗ hổng trong con worker thay đổi kích thước ảnh chỉ cách bảng người dùng của bạn đúng một lệnh <code>psql</code>, mà chẳng ai để ý vì có gì hỏng đâu. Hãy quyết cách tách mạng ngay từ đầu, khi mới có ba dịch vụ và việc đó tốn hai phút, thay vì đợi tới lúc có chín cái và tách chúng ra nghĩa là phải kiểm lại mọi đường đi. Cái luật sống sót được khi va vào thực tế: một dịch vụ chỉ vào một mạng nếu nó phải <em>chủ động mở</em> kết nối trên đó, và chỉ reverse proxy mới công bố cổng.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một dịch vụ công bố cổng còn mọi thứ khác chỉ với tới được bằng tên container — riêng quyết định đó loại bỏ phần lớn tai nạn ở Chương 8. Migration thuộc về một dịch vụ riêng có <code>service_completed_successfully</code> canh cửa, để một lần migration hỏng dừng cả lượt deploy thay vì đẻ ra ứng dụng chạy nửa vời. Và mấy dòng <code>networks:</code> là một chính sách kiểm soát truy cập: hãy viết chúng trước các dịch vụ, đừng viết sau.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — The data tier: Postgres and Redis|||10.2 — Tầng dữ liệu: Postgres và Redis',
      slug: 'dk-10-2-tang-du-lieu',
      type: 'LESSON',
      description: 'Dịch vụ Postgres đầy đủ với healthcheck và script khởi tạo, vì sao POSTGRES_PASSWORD chỉ được đọc một lần, Redis có persistence và maxmemory, biến môi trường quan trọng, và cách nâng phiên bản chính.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>The data tier: Postgres and Redis</h2>
<p class="lead">These two services carry everything that matters and are the two you least want to get wrong. Both are simple to declare and both have a handful of behaviours — one-time initialisation, persistence modes, memory policy — that are invisible until the day they surprise you.</p>

<h3>PostgreSQL, completely</h3>
<pre><code>  db:
    image: postgres:16.4-alpine
    environment:
      POSTGRES_USER: \${POSTGRES_USER:-blog}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD in .env}
      POSTGRES_DB: \${POSTGRES_DB:-blog}
      PGDATA: /var/lib/postgresql/data/pgdata     <span class="tok-comment"># subdir: lost+found does not break initdb</span>
      TZ: Asia/Ho_Chi_Minh
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./ops/postgres-init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER:-blog} -d \${POSTGRES_DB:-blog}"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s
    command:
      - "postgres"
      - "-c" 
      - "max_connections=100"
      - "-c"
      - "shared_buffers=256MB"
      - "-c"
      - "log_min_duration_statement=500"          <span class="tok-comment"># log queries over 500ms</span>
    networks: [private]
    restart: unless-stopped</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Pin the minor version</span><span class="v"><code>16.4-alpine</code>, not <code>16-alpine</code> and certainly not <code>latest</code>. A silent jump to Postgres 17 on a rebuild will refuse to start on a version-16 data directory, and the error arrives during a deploy.</span></div>
  <div class="kv"><span class="k"><code>PGDATA</code> in a subdirectory</span><span class="v">Some volume drivers create a <code>lost+found</code> at the mount root, and <code>initdb</code> refuses a non-empty directory. Pointing <code>PGDATA</code> one level deeper avoids an initialisation failure that is baffling the first time.</span></div>
  <div class="kv"><span class="k"><code>:?</code> on the password</span><span class="v">A missing password should stop the deploy with a clear message, not start a database whose superuser has an empty password (Lesson 9.4).</span></div>
  <div class="kv"><span class="k">Tuning via <code>command</code></span><span class="v">The official image runs <code>postgres</code> as its command, so appending <code>-c key=value</code> pairs is the supported way to set parameters without a custom <code>postgresql.conf</code>.</span></div>
  <div class="kv"><span class="k"><code>log_min_duration_statement</code></span><span class="v">One line that turns "the app feels slow" into a log of exactly which queries took over half a second. Cheap, and the first thing you will want when something is slow.</span></div>
</div>

<h3>The initialisation directory runs exactly once</h3>
<pre><code><span class="tok-comment"># ops/postgres-init/01-extensions.sql</span>
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;          <span class="tok-comment"># trigram search</span>
CREATE EXTENSION IF NOT EXISTS unaccent;         <span class="tok-comment"># Vietnamese search without diacritics</span></code></pre>
<pre><code>docker compose up -d db &amp;&amp; docker compose logs db | grep -E 'init|ready' | head -4</code></pre>
<div class="out">blog-db-1  | /usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/01-extensions.sql
blog-db-1  | CREATE EXTENSION
blog-db-1  | PostgreSQL init process complete; ready for start up.
blog-db-1  | 2026-08-22 12:10:02.441 +07 [1] LOG:  database system is ready to accept connections</div>
<div class="callout warn"><strong>Scripts in <code>/docker-entrypoint-initdb.d</code> run only when the data directory is empty.</strong> On the second and every subsequent start they are skipped entirely, silently. That surprises people twice: a new extension added to the script never appears on an existing database, and — more dangerously — <code>POSTGRES_PASSWORD</code> is also only read at initialisation, so changing it in <code>.env</code> and redeploying does <em>not</em> change the password. Use <code>ALTER USER … PASSWORD</code>, or a migration, for anything that must apply to an existing database.</div>

<h3>Redis, with the two decisions that matter</h3>
<pre><code>  cache:
    image: redis:7.4-alpine
    command:
      - "redis-server"
      - "--appendonly"
      - "yes"                                     <span class="tok-comment"># AOF: durable, survives restarts</span>
      - "--maxmemory"
      - "256mb"
      - "--maxmemory-policy"
      - "allkeys-lru"                             <span class="tok-comment"># evict, never OOM</span>
      - "--save"
      - "300 10"
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks: [private]
    restart: unless-stopped</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Persistence: none</span><span class="lz-t">pure cache, everything lost on restart</span><span class="lz-d">Correct if Redis holds only derived data you can recompute. Wrong if it holds sessions — every user is logged out on a deploy.</span></div>
  <div class="lz-step"><span class="lz-k">Persistence: RDB snapshots</span><span class="lz-t">--save "300 10"</span><span class="lz-d">Point-in-time dumps. Fast, compact, and you lose everything written since the last snapshot. Fine for a cache you would rather not lose entirely.</span></div>
  <div class="lz-step"><span class="lz-k">Persistence: AOF</span><span class="lz-t">--appendonly yes</span><span class="lz-d">Every write appended to a log. Slightly slower, much less data lost. The right choice when sessions or queues live in Redis.</span></div>
  <div class="lz-step"><span class="lz-k">maxmemory + a policy</span><span class="lz-t">--maxmemory 256mb --maxmemory-policy allkeys-lru</span><span class="lz-d">Without both, Redis grows until the container hits its memory limit and the OOM killer takes it. With them it evicts the least-recently-used keys and keeps serving — a degraded cache instead of a dead one.</span></div>
</div>
<pre><code>docker compose exec cache redis-cli info memory | grep -E 'used_memory_human|maxmemory_policy'
docker compose exec cache redis-cli config get appendonly</code></pre>
<div class="out">used_memory_human:1.42M
maxmemory_policy:allkeys-lru
1) "appendonly"
2) "yes"</div>

<h3>Connecting from the application</h3>
<pre><code><span class="tok-comment"># .env — note the HOSTNAMES are service names, not localhost</span>
POSTGRES_USER=blog
POSTGRES_PASSWORD=change-me-in-production
POSTGRES_DB=blog
DATABASE_URL=postgresql://blog:change-me-in-production@db:5432/blog?schema=public&amp;connection_limit=10
REDIS_URL=redis://cache:6379</code></pre>
<div class="callout"><strong><code>connection_limit</code> is not optional advice on a small server.</strong> Prisma opens a pool per process; with an API, a worker and a migration container all connecting, three pools of the default size can exhaust <code>max_connections=100</code> on their own — and then every request fails with "too many clients". Set it explicitly, and set it low: <code>10</code> per service is generous for a small application, and leaves headroom for <code>psql</code> when you need to look at something.</div>

<h3>Upgrading a major version</h3>
<pre><code><span class="tok-comment"># Postgres does NOT migrate a data directory across major versions. Dump, upgrade, restore.</span>
docker compose exec -T db pg_dumpall -U blog &gt; dump-before-17.sql
docker compose down
docker volume rm blog_pgdata                    <span class="tok-comment"># after the dump, and after checking it</span>
sed -i 's/postgres:16.4-alpine/postgres:17.0-alpine/' compose.yaml
docker compose up -d db
docker compose exec -T db psql -U blog -d postgres &lt; dump-before-17.sql</code></pre>
<div class="out">pg_dumpall: 84MB written
CREATE ROLE
CREATE DATABASE
ALTER DATABASE
... 
COPY 1284</div>
<p>The failure mode if you skip this is unambiguous and happens at start-up: <code>FATAL: database files are incompatible with server — data directory was initialized by PostgreSQL 16, which is not compatible with this version 17</code>. Nothing is damaged, but the service will not start until you either revert the tag or do the dump-and-restore properly, which is a bad time to be reading about it. This is the reason to pin the minor version.</p>

<a class="link-card" href="https://hub.docker.com/_/postgres" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">postgres — official image docs</span><span class="lc-sub">Every environment variable, the <code>_FILE</code> suffix for reading secrets from files, the initialisation directory rules, and the caveats about <code>PGDATA</code> and bind mounts.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Redis persistence</span><span class="lc-sub">RDB versus AOF explained properly, including what each loses on a crash and why running both is a reasonable default for anything that is not purely a cache.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/reference/eviction/" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">Redis eviction policies</span><span class="lc-sub">All eight policies with the case for each. <code>allkeys-lru</code> for a cache, <code>noeviction</code> for a queue where losing data is worse than an error.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build the data tier</span><span class="lc-sub">Graded exercises: write the db service with a working healthcheck, prove that the init directory is skipped on the second start, and choose a Redis persistence and eviction policy for three scenarios.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> changing <code>POSTGRES_PASSWORD</code> in <code>.env</code> and expecting a redeploy to apply it. That variable is read exactly once, when the data directory is initialised; on an existing volume it is ignored completely. The application then fails to authenticate with the new password while the database still holds the old one, and the obvious-looking fix — <code>docker compose down -v</code> to "start fresh" — deletes the database. The actual fix is one SQL statement: <code>docker compose exec db psql -U blog -c "ALTER USER blog PASSWORD 'new'"</code>, then update <code>.env</code> and <code>DATABASE_URL</code> to match and recreate the API. The same one-time-only rule applies to <code>POSTGRES_DB</code>, <code>POSTGRES_USER</code> and everything in <code>/docker-entrypoint-initdb.d</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>/docker-entrypoint-initdb.d</code> and <code>POSTGRES_PASSWORD</code> apply only when the data directory is empty — on an existing volume both are silently ignored. Give Redis both <code>maxmemory</code> and a <code>maxmemory-policy</code>, or it grows until the OOM killer takes it instead of evicting. And pin the minor version of your database image: a major-version jump refuses to start on an existing data directory, and it will happen during a deploy.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Tầng dữ liệu: Postgres và Redis</h2>
<p class="lead">Hai dịch vụ này gánh mọi thứ quan trọng và cũng là hai thứ bạn ít muốn làm sai nhất. Cả hai đều dễ khai báo và cả hai đều có dăm ba hành vi — khởi tạo một lần, chế độ lưu lâu dài, chính sách bộ nhớ — vô hình cho tới đúng ngày chúng làm bạn bất ngờ.</p>

<h3>PostgreSQL, viết đủ</h3>
<pre><code>  db:
    image: postgres:16.4-alpine
    environment:
      POSTGRES_USER: \${POSTGRES_USER:-blog}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD in .env}
      POSTGRES_DB: \${POSTGRES_DB:-blog}
      PGDATA: /var/lib/postgresql/data/pgdata     <span class="tok-comment"># thư mục con: lost+found không phá initdb</span>
      TZ: Asia/Ho_Chi_Minh
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./ops/postgres-init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER:-blog} -d \${POSTGRES_DB:-blog}"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s
    command:
      - "postgres"
      - "-c" 
      - "max_connections=100"
      - "-c"
      - "shared_buffers=256MB"
      - "-c"
      - "log_min_duration_statement=500"          <span class="tok-comment"># ghi log truy vấn quá 500ms</span>
    networks: [private]
    restart: unless-stopped</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Ghim cả số hiệu phụ</span><span class="v"><code>16.4-alpine</code>, không phải <code>16-alpine</code> và chắc chắn không phải <code>latest</code>. Một cú nhảy lặng lẽ sang Postgres 17 trong một lượt dựng lại sẽ không chịu khởi động trên thư mục dữ liệu của bản 16, và cái lỗi đó tới ngay giữa lúc deploy.</span></div>
  <div class="kv"><span class="k"><code>PGDATA</code> nằm trong thư mục con</span><span class="v">Vài driver volume tạo ra một thư mục <code>lost+found</code> ở gốc chỗ gắn, và <code>initdb</code> từ chối một thư mục không rỗng. Trỏ <code>PGDATA</code> sâu thêm một tầng là tránh được một lỗi khởi tạo mà lần đầu gặp thì rất khó hiểu.</span></div>
  <div class="kv"><span class="k"><code>:?</code> ở mật khẩu</span><span class="v">Một mật khẩu bị thiếu nên dừng lượt deploy với thông báo rõ ràng, chứ không nên khởi động một cơ sở dữ liệu mà siêu người dùng có mật khẩu rỗng (Bài 9.4).</span></div>
  <div class="kv"><span class="k">Tinh chỉnh qua <code>command</code></span><span class="v">Ảnh chính thức chạy <code>postgres</code> làm câu lệnh của nó, nên nối thêm các cặp <code>-c khoá=giá trị</code> là cách được hỗ trợ để đặt tham số mà không cần một file <code>postgresql.conf</code> riêng.</span></div>
  <div class="kv"><span class="k"><code>log_min_duration_statement</code></span><span class="v">Một dòng biến câu "ứng dụng thấy chậm" thành một cuốn log ghi rõ truy vấn nào vượt nửa giây. Rẻ, và là thứ đầu tiên bạn sẽ cần khi có gì đó chậm.</span></div>
</div>

<h3>Thư mục khởi tạo chạy đúng MỘT lần</h3>
<pre><code><span class="tok-comment"># ops/postgres-init/01-extensions.sql</span>
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;          <span class="tok-comment"># tìm kiếm theo trigram</span>
CREATE EXTENSION IF NOT EXISTS unaccent;         <span class="tok-comment"># tìm tiếng Việt không dấu</span></code></pre>
<pre><code>docker compose up -d db &amp;&amp; docker compose logs db | grep -E 'init|ready' | head -4</code></pre>
<div class="out">blog-db-1  | /usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/01-extensions.sql
blog-db-1  | CREATE EXTENSION
blog-db-1  | PostgreSQL init process complete; ready for start up.
blog-db-1  | 2026-08-22 12:10:02.441 +07 [1] LOG:  database system is ready to accept connections</div>
<div class="callout warn"><strong>Script trong <code>/docker-entrypoint-initdb.d</code> chỉ chạy khi thư mục dữ liệu còn RỖNG.</strong> Từ lần khởi động thứ hai trở đi chúng bị bỏ qua hoàn toàn, trong im lặng. Chuyện đó làm người ta bất ngờ hai lần: một extension mới thêm vào script không bao giờ xuất hiện trên cơ sở dữ liệu đang có, và — nguy hiểm hơn — <code>POSTGRES_PASSWORD</code> cũng chỉ được đọc lúc khởi tạo, nên đổi nó trong <code>.env</code> rồi deploy lại <em>KHÔNG</em> đổi mật khẩu. Hãy dùng <code>ALTER USER … PASSWORD</code>, hoặc một migration, cho mọi thứ phải áp lên một cơ sở dữ liệu đã tồn tại.</div>

<h3>Redis, với hai quyết định quan trọng</h3>
<pre><code>  cache:
    image: redis:7.4-alpine
    command:
      - "redis-server"
      - "--appendonly"
      - "yes"                                     <span class="tok-comment"># AOF: bền, sống qua khởi động lại</span>
      - "--maxmemory"
      - "256mb"
      - "--maxmemory-policy"
      - "allkeys-lru"                             <span class="tok-comment"># đẩy bớt khoá, không bao giờ OOM</span>
      - "--save"
      - "300 10"
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks: [private]
    restart: unless-stopped</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Lưu lâu dài: không</span><span class="lz-t">cache thuần, mất sạch khi khởi động lại</span><span class="lz-d">Đúng nếu Redis chỉ giữ dữ liệu suy ra được và tính lại được. Sai nếu nó giữ phiên đăng nhập — mọi người dùng bị đăng xuất mỗi lần deploy.</span></div>
  <div class="lz-step"><span class="lz-k">Lưu lâu dài: ảnh chụp RDB</span><span class="lz-t">--save "300 10"</span><span class="lz-d">Đổ dữ liệu theo thời điểm. Nhanh, gọn, và bạn mất mọi thứ ghi từ ảnh chụp gần nhất. Ổn với một cái cache mà bạn không muốn mất sạch.</span></div>
  <div class="lz-step"><span class="lz-k">Lưu lâu dài: AOF</span><span class="lz-t">--appendonly yes</span><span class="lz-d">Mọi lệnh ghi được nối vào một cuốn nhật ký. Chậm hơn chút, mất ít dữ liệu hơn nhiều. Lựa chọn đúng khi phiên đăng nhập hay hàng đợi nằm trong Redis.</span></div>
  <div class="lz-step"><span class="lz-k">maxmemory kèm một chính sách</span><span class="lz-t">--maxmemory 256mb --maxmemory-policy allkeys-lru</span><span class="lz-d">Không có đủ cả hai thì Redis phình tới khi container chạm hạn mức bộ nhớ và bộ giết OOM lấy nó đi. Có cả hai thì nó đẩy bớt những khoá lâu không dùng và tiếp tục phục vụ — một cái cache suy giảm thay vì một cái cache đã chết.</span></div>
</div>
<pre><code>docker compose exec cache redis-cli info memory | grep -E 'used_memory_human|maxmemory_policy'
docker compose exec cache redis-cli config get appendonly</code></pre>
<div class="out">used_memory_human:1.42M
maxmemory_policy:allkeys-lru
1) "appendonly"
2) "yes"</div>

<h3>Kết nối từ phía ứng dụng</h3>
<pre><code><span class="tok-comment"># .env — để ý TÊN MÁY là tên dịch vụ, không phải localhost</span>
POSTGRES_USER=blog
POSTGRES_PASSWORD=change-me-in-production
POSTGRES_DB=blog
DATABASE_URL=postgresql://blog:change-me-in-production@db:5432/blog?schema=public&amp;connection_limit=10
REDIS_URL=redis://cache:6379</code></pre>
<div class="callout"><strong><code>connection_limit</code> không phải lời khuyên tuỳ chọn trên một máy chủ nhỏ.</strong> Prisma mở một bể kết nối cho mỗi tiến trình; với một API, một worker và một container migration cùng kết nối, ba cái bể ở kích thước mặc định có thể một mình ăn hết <code>max_connections=100</code> — và rồi mọi yêu cầu chết với thông báo "too many clients". Hãy đặt nó tường minh, và đặt thấp: <code>10</code> cho mỗi dịch vụ đã là rộng rãi với một ứng dụng nhỏ, và còn chừa chỗ cho <code>psql</code> khi bạn cần vào xem gì đó.</div>

<h3>Nâng một phiên bản chính</h3>
<pre><code><span class="tok-comment"># Postgres KHÔNG tự chuyển thư mục dữ liệu qua các phiên bản chính. Đổ ra, nâng, đổ lại.</span>
docker compose exec -T db pg_dumpall -U blog &gt; dump-before-17.sql
docker compose down
docker volume rm blog_pgdata                    <span class="tok-comment"># sau khi đã đổ ra, và sau khi đã KIỂM bản đổ đó</span>
sed -i 's/postgres:16.4-alpine/postgres:17.0-alpine/' compose.yaml
docker compose up -d db
docker compose exec -T db psql -U blog -d postgres &lt; dump-before-17.sql</code></pre>
<div class="out">pg_dumpall: 84MB written
CREATE ROLE
CREATE DATABASE
ALTER DATABASE
... 
COPY 1284</div>
<p>Nếu bỏ qua bước này thì kiểu hỏng rất rõ ràng và xảy ra ngay lúc khởi động: <code>FATAL: database files are incompatible with server — data directory was initialized by PostgreSQL 16, which is not compatible with this version 17</code>. Không có gì bị hư hại, nhưng dịch vụ sẽ không khởi động cho tới khi bạn hoặc quay lại nhãn cũ, hoặc làm cho tử tế cái quy trình đổ-ra-đổ-lại, và đó là thời điểm rất tệ để mới ngồi đọc về nó. Đây chính là lý do phải ghim cả số hiệu phụ.</p>

<a class="link-card" href="https://hub.docker.com/_/postgres" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">postgres — tài liệu ảnh chính thức</span><span class="lc-sub">Mọi biến môi trường, hậu tố <code>_FILE</code> để đọc bí mật từ file, luật của thư mục khởi tạo, và những lưu ý về <code>PGDATA</code> với bind mount.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Redis persistence</span><span class="lc-sub">RDB so với AOF giải thích cho tử tế, gồm cả việc mỗi cái mất gì khi sập và vì sao chạy cả hai là mặc định hợp lý cho mọi thứ không phải cache thuần.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/develop/reference/eviction/" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">Chính sách đẩy khoá của Redis</span><span class="lc-sub">Cả tám chính sách kèm lý lẽ cho từng cái. <code>allkeys-lru</code> cho cache, <code>noeviction</code> cho hàng đợi nơi mất dữ liệu còn tệ hơn một cái lỗi.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng tầng dữ liệu</span><span class="lc-sub">Bài chấm điểm: viết dịch vụ db với healthcheck chạy được, chứng minh thư mục khởi tạo bị bỏ qua ở lần khởi động thứ hai, và chọn chính sách lưu lâu dài với chính sách đẩy khoá của Redis cho ba tình huống.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đổi <code>POSTGRES_PASSWORD</code> trong <code>.env</code> rồi trông đợi một lượt deploy sẽ áp nó. Biến đó được đọc đúng một lần, lúc thư mục dữ liệu được khởi tạo; trên một volume đã có sẵn nó bị phớt lờ hoàn toàn. Ứng dụng khi đó xác thực hỏng với mật khẩu mới trong khi cơ sở dữ liệu vẫn giữ mật khẩu cũ, và cách chữa trông có vẻ hiển nhiên — <code>docker compose down -v</code> để "làm lại từ đầu" — thì XOÁ MẤT cơ sở dữ liệu. Cách chữa thật là một câu SQL: <code>docker compose exec db psql -U blog -c "ALTER USER blog PASSWORD 'mớI'"</code>, rồi cập nhật <code>.env</code> với <code>DATABASE_URL</code> cho khớp và dựng lại API. Cũng luật chỉ-chạy-một-lần đó áp cho <code>POSTGRES_DB</code>, <code>POSTGRES_USER</code> và mọi thứ trong <code>/docker-entrypoint-initdb.d</code>.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>/docker-entrypoint-initdb.d</code> và <code>POSTGRES_PASSWORD</code> chỉ có tác dụng khi thư mục dữ liệu còn rỗng — trên một volume đã có sẵn thì cả hai bị lặng lẽ phớt lờ. Hãy cho Redis cả <code>maxmemory</code> lẫn một <code>maxmemory-policy</code>, không thì nó phình tới khi bộ giết OOM lấy nó đi thay vì đẩy bớt khoá. Và hãy ghim số hiệu phụ của ảnh cơ sở dữ liệu: một cú nhảy phiên bản chính sẽ không chịu khởi động trên thư mục dữ liệu đang có, và nó sẽ xảy ra giữa lúc deploy.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — The API, the worker, the migration|||10.3 — API, worker, và migration',
      slug: 'dk-10-3-api-migration',
      type: 'LESSON',
      description: 'Dockerfile.backend nhiều tầng cho Node + Prisma, một ảnh ba câu lệnh, migration là một dịch vụ có cổng chặn, seed nằm sau profile, healthcheck không cần curl, và bẫy engine Prisma.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>The API, the worker, the migration</h2>
<p class="lead">One image, three roles. The API serves HTTP, the worker processes jobs, and the migration container runs once and exits — all from the same build, differing only in <code>command</code>. That is not a saving of disk space; it is a guarantee that the worker cannot be running last week's code.</p>

<h3>Dockerfile.backend</h3>
<pre><code><span class="tok-comment"># syntax=docker/dockerfile:1</span>
FROM node:22.11-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm \\
    npm ci                                      <span class="tok-comment"># postinstall runs prisma generate</span>

FROM node:22.11-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build                                <span class="tok-comment"># tsc → dist/</span>
RUN npm prune --omit=dev                         <span class="tok-comment"># drop devDependencies from node_modules</span>

FROM node:22.11-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache tini
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/package.json ./
USER node
EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]</code></pre>
<pre><code>docker compose build api &amp;&amp; docker images ghcr.io/me/api --format '{{.Tag}}\\t{{.Size}}'</code></pre>
<div class="out">1.4.2	214MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>COPY prisma</code> before <code>npm ci</code></span><span class="v">Prisma's postinstall reads <code>schema.prisma</code> to generate the client. Without the schema present, <code>npm ci</code> succeeds and the client is missing at runtime — an error that only appears when the first query runs.</span></div>
  <div class="kv"><span class="k">Pin the Node minor version</span><span class="v"><code>node:22.11-alpine</code>. A silent jump to a new minor can change a native module's ABI, and you find out in production rather than in CI.</span></div>
  <div class="kv"><span class="k"><code>npm prune --omit=dev</code></span><span class="v">Cheaper than a second <code>npm ci --omit=dev</code> and it keeps the cached layer. TypeScript, eslint and the test runner do not belong in the shipped image.</span></div>
  <div class="kv"><span class="k"><code>tini</code> as ENTRYPOINT</span><span class="v">Node as PID 1 does not reap zombies and handles signals oddly (Lesson 1.3). <code>tini</code> is 10KB and makes <code>docker stop</code> behave.</span></div>
  <div class="kv"><span class="k"><code>USER node</code> last</span><span class="v">After every <code>COPY --chown=node:node</code>, so the files are owned correctly and the process still cannot write outside them (Lesson 6.4).</span></div>
</div>
<div class="callout warn"><strong>The Prisma engine has to match the base image's libc.</strong> Alpine is musl, Debian-based images are glibc, and a prebuilt engine for one does not load on the other. This is the exact failure this project shipped: a build that used the default <code>Dockerfile</code> instead of <code>Dockerfile.backend</code> put a <code>debian-openssl-3.0.x</code> engine into an Alpine image, the build was green, the push was green, and the API returned 502 for seven minutes while the container restarted in a loop. Declare it explicitly and verify it starts:
<pre><code><span class="tok-comment"># prisma/schema.prisma</span>
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}</code></pre>
<pre><code>docker run --rm ghcr.io/me/api:1.4.2 sh -c 'ls node_modules/.prisma/client/*.node; node -e "require(\\"@prisma/client\\"); console.log(\\"client loads\\")"'</code></pre>
<div class="out">node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node
client loads</div></div>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">api · node dist/index.js</span><span class="lz-lnote">The default CMD. Serves HTTP on 3000, on both networks, with a healthcheck that touches Postgres and Redis.</span></div>
  <div class="lz-layer"><span class="lz-lname">worker · node dist/worker.js</span><span class="lz-lnote">Same image, different command. Private network only — it has no HTTP surface and nothing needs to reach it.</span></div>
  <div class="lz-layer"><span class="lz-lname">migrate · npx prisma migrate deploy</span><span class="lz-lnote">Same image again. Runs once, exits 0, and is the gate the other two wait on. <code>restart: "no"</code>, because exiting is its job.</span></div>
  <div class="lz-layer"><span class="lz-lname">seed · npx prisma db seed</span><span class="lz-lnote">Same image, behind a profile. Never runs on a production deploy; invoked deliberately with <code>compose run --rm seed</code>.</span></div>
</div>
<h3>Three services from one image</h3>
<pre><code>  api:
    image: ghcr.io/me/api:\${TAG:-latest}
    build: { context: ., dockerfile: Dockerfile.backend, target: production }
    env_file: [.env]
    environment:
      NODE_ENV: production
      PORT: "3000"
    depends_on:
      db:      { condition: service_healthy }
      cache:   { condition: service_healthy }
      migrate: { condition: service_completed_successfully }
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/health').then(r=&gt;process.exit(r.ok?0:1)).catch(()=&gt;process.exit(1))"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 40s
    networks: [public, private]
    restart: unless-stopped

  worker:
    image: ghcr.io/me/api:\${TAG:-latest}
    command: ["node", "dist/worker.js"]
    env_file: [.env]
    depends_on:
      migrate: { condition: service_completed_successfully }
    networks: [private]
    restart: unless-stopped

  migrate:
    image: ghcr.io/me/api:\${TAG:-latest}
    command: ["npx", "prisma", "migrate", "deploy"]
    env_file: [.env]
    depends_on:
      db: { condition: service_healthy }
    networks: [private]
    restart: "no"</code></pre>
<pre><code>docker compose up -d 2&gt;&amp;1 | tail -6</code></pre>
<div class="out"> ✔ Container blog-db-1       Healthy                        6.1s
 ✔ Container blog-cache-1    Healthy                        5.4s
 ✔ Container blog-migrate-1  Exited (0)                    11.3s
 ✔ Container blog-api-1      Started                       11.6s
 ✔ Container blog-worker-1   Started                       11.6s
 ✔ Container blog-nginx-1    Started                       12.0s</div>
<div class="callout ok"><strong>That ordering is the whole point of the chapter's third decision.</strong> The database becomes healthy, the migration runs to completion and exits 0, and only then do the API and worker start — against a schema they can rely on. If <code>prisma migrate deploy</code> exits non-zero, compose stops and reports it; nothing starts against a half-migrated database.</div>

<h3>The healthcheck that works in a slim image</h3>
<pre><code><span class="tok-comment"># The endpoint it calls — cheap, and it actually checks the dependencies</span>
app.get('/health', async (_req, res) =&gt; {
  try {
    await prisma.\$queryRaw&#96;SELECT 1&#96;;
    await redis.ping();
    res.json({ ok: true, version: process.env.TAG ?? 'dev' });
  } catch (err) {
    res.status(503).json({ ok: false, error: String(err) });
  }
});</code></pre>
<pre><code>docker compose exec api node -e "fetch('http://127.0.0.1:3000/health').then(r=&gt;r.json()).then(console.log)"</code></pre>
<div class="out">{ ok: true, version: '1.4.2' }</div>
<p>Two design points. The image has no <code>curl</code> and does not need one — <code>node -e</code> is already there. And the endpoint touches Postgres and Redis, so an <code>(unhealthy)</code> status means "this instance cannot serve requests", not merely "the process is alive". A health endpoint that returns 200 unconditionally tells you nothing you did not already know from the container being up.</p>

<h3>Seeds, behind a profile</h3>
<pre><code>  seed:
    image: ghcr.io/me/api:\${TAG:-latest}
    command: ["npx", "prisma", "db", "seed"]
    env_file: [.env]
    depends_on:
      migrate: { condition: service_completed_successfully }
    profiles: [seed]
    networks: [private]
    restart: "no"</code></pre>
<pre><code>docker compose run --rm seed</code></pre>
<div class="out">Running seed command &#96;tsx prisma/seed.ts&#96; ...
seeded 8 users, 42 posts, 6 categories
🌱  The seed command has been executed.</div>
<div class="callout warn"><strong>Seeds are the one place a type error can pass every check and still break production.</strong> The main <code>tsconfig.json</code> has <code>rootDir: "./src"</code>, so <code>prisma/**</code> cannot be in its <code>include</code> — which means <code>tsc --noEmit</code> never looks at <code>seed.ts</code>. This project renamed a <code>ContentType</code> enum value, passed the entire pre-push checklist, and still broke the seed in production, because <code>seed.ts</code> carried a hand-written copy of the union and type-checked against itself. Import enums from <code>@prisma/client</code> rather than re-declaring them, keep a separate <code>tsconfig.seed.json</code>, and run the seed for real whenever the schema changes — reading it is not enough.</div>

<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-prisma" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Prisma — deployment and binary targets</span><span class="lc-sub">Why the query engine is platform-specific, the complete list of <code>binaryTargets</code>, and the musl versus glibc distinction that decides whether your container starts.</span></span>
</a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">prisma migrate deploy versus dev</span><span class="lc-sub"><code>deploy</code> applies pending migrations and never creates or resets anything — the only one that belongs in a container. <code>dev</code> needs a shadow database and is a developer command.</span></span>
</a>
<a class="link-card" href="https://github.com/krallin/tini" target="_blank" rel="noopener">
  <span class="lc-ico">🧷</span>
  <span class="lc-body"><span class="lc-title">tini</span><span class="lc-sub">The 10KB init that reaps zombies and forwards signals. The README explains the PID 1 problem better than most, and <code>--init</code> ships a copy of it with Docker itself.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build the application tier</span><span class="lc-sub">Graded exercises: write a multi-stage Dockerfile for a Node API, run three services from one image, gate the API behind a migration, and write a healthcheck for an image with no curl.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> running migrations from the API's entrypoint instead of a separate service. It looks tidier and it fails in two ways that a migration service does not. First, if you ever run more than one API replica, every replica races to apply the same migration — Prisma's advisory lock usually saves you, and "usually" is doing real work in that sentence. Second, a failed migration becomes a crash-looping API rather than a clear stop: the container restarts, retries the migration, fails again, and your logs fill with the same error while the deploy reports success. A dedicated <code>migrate</code> service with <code>restart: "no"</code> and <code>service_completed_successfully</code> gives you one run, one clear exit code, and a deploy that stops when the schema change fails.</div>
<p class="note-ct"><strong>Three things to remember.</strong> One image with three commands guarantees the API, worker and migration are the same code — build once, differ only in <code>command</code>. Migrations belong in their own service with <code>restart: "no"</code>, gated by <code>service_completed_successfully</code>, never in an entrypoint. And native modules bind to the base image's libc: declare Prisma's <code>binaryTargets</code>, and verify the image actually starts before you promote it — a green build is not a running container.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>API, worker, và migration</h2>
<p class="lead">Một cái ảnh, ba vai. API phục vụ HTTP, worker xử lý việc chạy nền, và container migration chạy một lần rồi thoát — tất cả từ cùng một lượt dựng, chỉ khác nhau ở <code>command</code>. Đó không phải là tiết kiệm dung lượng đĩa; đó là bảo đảm rằng worker không thể đang chạy mã của tuần trước.</p>

<h3>Dockerfile.backend</h3>
<pre><code><span class="tok-comment"># syntax=docker/dockerfile:1</span>
FROM node:22.11-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm \\
    npm ci                                      <span class="tok-comment"># postinstall chạy prisma generate</span>

FROM node:22.11-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build                                <span class="tok-comment"># tsc → dist/</span>
RUN npm prune --omit=dev                         <span class="tok-comment"># bỏ devDependencies khỏi node_modules</span>

FROM node:22.11-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache tini
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/package.json ./
USER node
EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]</code></pre>
<pre><code>docker compose build api &amp;&amp; docker images ghcr.io/me/api --format '{{.Tag}}\\t{{.Size}}'</code></pre>
<div class="out">1.4.2	214MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>COPY prisma</code> TRƯỚC <code>npm ci</code></span><span class="v">Postinstall của Prisma đọc <code>schema.prisma</code> để sinh ra client. Không có schema thì <code>npm ci</code> vẫn thành công còn client thì thiếu lúc chạy — một lỗi chỉ lộ ra khi truy vấn đầu tiên chạy.</span></div>
  <div class="kv"><span class="k">Ghim số hiệu phụ của Node</span><span class="v"><code>node:22.11-alpine</code>. Một cú nhảy lặng lẽ sang bản phụ mới có thể đổi ABI của một module gốc, và bạn biết chuyện đó trên production chứ không phải trong CI.</span></div>
  <div class="kv"><span class="k"><code>npm prune --omit=dev</code></span><span class="v">Rẻ hơn chạy thêm một lượt <code>npm ci --omit=dev</code> và nó giữ được lớp đã lưu đệm. TypeScript, eslint và bộ chạy kiểm thử không thuộc về cái ảnh đem đi.</span></div>
  <div class="kv"><span class="k"><code>tini</code> làm ENTRYPOINT</span><span class="v">Node ở vị trí PID 1 không thu dọn tiến trình mồ côi và xử lý tín hiệu một cách kỳ lạ (Bài 1.3). <code>tini</code> nặng 10KB và làm cho <code>docker stop</code> hành xử đúng.</span></div>
  <div class="kv"><span class="k"><code>USER node</code> đặt cuối</span><span class="v">Sau mọi lệnh <code>COPY --chown=node:node</code>, để file thuộc quyền sở hữu đúng mà tiến trình vẫn không ghi được ra ngoài chúng (Bài 6.4).</span></div>
</div>
<div class="callout warn"><strong>Engine của Prisma phải KHỚP với libc của ảnh nền.</strong> Alpine là musl, ảnh nền Debian là glibc, và một engine dựng sẵn cho bên này không nạp được ở bên kia. Đây đúng là sự cố mà dự án này từng đẩy lên: một lượt dựng dùng <code>Dockerfile</code> mặc định thay vì <code>Dockerfile.backend</code> đã nhét một engine <code>debian-openssl-3.0.x</code> vào một cái ảnh Alpine, dựng xanh, đẩy xanh, rồi API trả 502 suốt bảy phút trong khi container restart thành vòng lặp. Hãy khai báo nó tường minh và kiểm nó khởi động được:
<pre><code><span class="tok-comment"># prisma/schema.prisma</span>
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}</code></pre>
<pre><code>docker run --rm ghcr.io/me/api:1.4.2 sh -c 'ls node_modules/.prisma/client/*.node; node -e "require(\\"@prisma/client\\"); console.log(\\"client loads\\")"'</code></pre>
<div class="out">node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node
client loads</div></div>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">api · node dist/index.js</span><span class="lz-lnote">CMD mặc định. Phục vụ HTTP ở cổng 3000, nằm trên cả hai mạng, có healthcheck chạm tới Postgres và Redis.</span></div>
  <div class="lz-layer"><span class="lz-lname">worker · node dist/worker.js</span><span class="lz-lnote">Cùng cái ảnh, khác câu lệnh. Chỉ ở mạng riêng — nó không có mặt tiền HTTP nào và không ai cần với tới nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">migrate · npx prisma migrate deploy</span><span class="lz-lnote">Vẫn cái ảnh đó. Chạy một lần, thoát 0, và là cái cổng mà hai cái kia chờ. <code>restart: "no"</code>, vì thoát chính là việc của nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">seed · npx prisma db seed</span><span class="lz-lnote">Cùng cái ảnh, nằm sau một profile. Không bao giờ chạy trong một lượt deploy production; được gọi có chủ đích bằng <code>compose run --rm seed</code>.</span></div>
</div>
<h3>Ba dịch vụ từ một cái ảnh</h3>
<pre><code>  api:
    image: ghcr.io/me/api:\${TAG:-latest}
    build: { context: ., dockerfile: Dockerfile.backend, target: production }
    env_file: [.env]
    environment:
      NODE_ENV: production
      PORT: "3000"
    depends_on:
      db:      { condition: service_healthy }
      cache:   { condition: service_healthy }
      migrate: { condition: service_completed_successfully }
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/health').then(r=&gt;process.exit(r.ok?0:1)).catch(()=&gt;process.exit(1))"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 40s
    networks: [public, private]
    restart: unless-stopped

  worker:
    image: ghcr.io/me/api:\${TAG:-latest}
    command: ["node", "dist/worker.js"]
    env_file: [.env]
    depends_on:
      migrate: { condition: service_completed_successfully }
    networks: [private]
    restart: unless-stopped

  migrate:
    image: ghcr.io/me/api:\${TAG:-latest}
    command: ["npx", "prisma", "migrate", "deploy"]
    env_file: [.env]
    depends_on:
      db: { condition: service_healthy }
    networks: [private]
    restart: "no"</code></pre>
<pre><code>docker compose up -d 2&gt;&amp;1 | tail -6</code></pre>
<div class="out"> ✔ Container blog-db-1       Healthy                        6.1s
 ✔ Container blog-cache-1    Healthy                        5.4s
 ✔ Container blog-migrate-1  Exited (0)                    11.3s
 ✔ Container blog-api-1      Started                       11.6s
 ✔ Container blog-worker-1   Started                       11.6s
 ✔ Container blog-nginx-1    Started                       12.0s</div>
<div class="callout ok"><strong>Cái thứ tự đó chính là toàn bộ ý nghĩa của quyết định thứ ba trong chương.</strong> Cơ sở dữ liệu trở nên khoẻ mạnh, migration chạy tới hết rồi thoát 0, và chỉ khi ấy API với worker mới khởi động — trên một schema chúng tin cậy được. Nếu <code>prisma migrate deploy</code> thoát khác 0, compose dừng lại và báo cáo; không có gì khởi động trên một cơ sở dữ liệu migrate được nửa chừng.</div>

<h3>Healthcheck chạy được trong một cái ảnh gọn</h3>
<pre><code><span class="tok-comment"># Điểm cuối mà nó gọi — rẻ, và nó kiểm thật các phụ thuộc</span>
app.get('/health', async (_req, res) =&gt; {
  try {
    await prisma.\$queryRaw&#96;SELECT 1&#96;;
    await redis.ping();
    res.json({ ok: true, version: process.env.TAG ?? 'dev' });
  } catch (err) {
    res.status(503).json({ ok: false, error: String(err) });
  }
});</code></pre>
<pre><code>docker compose exec api node -e "fetch('http://127.0.0.1:3000/health').then(r=&gt;r.json()).then(console.log)"</code></pre>
<div class="out">{ ok: true, version: '1.4.2' }</div>
<p>Hai điểm thiết kế. Cái ảnh không có <code>curl</code> và cũng không cần — <code>node -e</code> vốn đã sẵn ở đó. Và điểm cuối này chạm tới cả Postgres lẫn Redis, nên trạng thái <code>(unhealthy)</code> có nghĩa là "instance này không phục vụ được yêu cầu", chứ không chỉ là "tiến trình còn sống". Một điểm cuối sức khoẻ trả 200 vô điều kiện chẳng nói cho bạn thêm điều gì so với việc nhìn thấy container đang chạy.</p>

<h3>Seed, nằm sau một profile</h3>
<pre><code>  seed:
    image: ghcr.io/me/api:\${TAG:-latest}
    command: ["npx", "prisma", "db", "seed"]
    env_file: [.env]
    depends_on:
      migrate: { condition: service_completed_successfully }
    profiles: [seed]
    networks: [private]
    restart: "no"</code></pre>
<pre><code>docker compose run --rm seed</code></pre>
<div class="out">Running seed command &#96;tsx prisma/seed.ts&#96; ...
seeded 8 users, 42 posts, 6 categories
🌱  The seed command has been executed.</div>
<div class="callout warn"><strong>Seed là chỗ DUY NHẤT mà một lỗi kiểu dữ liệu có thể qua sạch mọi phép kiểm rồi vẫn làm vỡ production.</strong> File <code>tsconfig.json</code> chính có <code>rootDir: "./src"</code>, nên <code>prisma/**</code> không nằm được trong <code>include</code> của nó — nghĩa là <code>tsc --noEmit</code> không bao giờ nhìn tới <code>seed.ts</code>. Dự án này từng đổi tên một giá trị enum <code>ContentType</code>, qua sạch toàn bộ danh sách kiểm trước khi push, mà vẫn vỡ seed trên production, vì <code>seed.ts</code> mang theo một bản chép tay của cái union và nó tự kiểm với chính nó. Hãy import enum từ <code>@prisma/client</code> thay vì khai lại, giữ một file <code>tsconfig.seed.json</code> riêng, và chạy seed cho THẬT mỗi khi schema đổi — đọc thôi thì không đủ.</div>

<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-prisma" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Prisma — triển khai và binary targets</span><span class="lc-sub">Vì sao query engine phụ thuộc nền tảng, danh sách đầy đủ <code>binaryTargets</code>, và phân biệt musl với glibc vốn quyết định container của bạn có khởi động được không.</span></span>
</a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">prisma migrate deploy so với dev</span><span class="lc-sub"><code>deploy</code> áp các migration đang chờ và không bao giờ tạo hay xoá gì — cái duy nhất thuộc về một container. <code>dev</code> cần cơ sở dữ liệu bóng và là lệnh dành cho lập trình viên.</span></span>
</a>
<a class="link-card" href="https://github.com/krallin/tini" target="_blank" rel="noopener">
  <span class="lc-ico">🧷</span>
  <span class="lc-body"><span class="lc-title">tini</span><span class="lc-sub">Bộ init 10KB thu dọn tiến trình mồ côi và chuyển tiếp tín hiệu. Phần README giải thích vấn đề PID 1 rõ hơn phần lớn tài liệu, và cờ <code>--init</code> của Docker cũng kèm sẵn một bản của nó.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng tầng ứng dụng</span><span class="lc-sub">Bài chấm điểm: viết một Dockerfile nhiều tầng cho API Node, chạy ba dịch vụ từ một cái ảnh, đặt cổng chặn migration trước API, và viết healthcheck cho một cái ảnh không có curl.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chạy migration từ entrypoint của API thay vì từ một dịch vụ riêng. Nhìn thì gọn hơn và nó hỏng theo hai kiểu mà một dịch vụ migration không hỏng. Thứ nhất, nếu có lúc nào đó bạn chạy nhiều hơn một bản sao API, mọi bản sao sẽ đua nhau áp cùng một migration — khoá cố vấn của Prisma thường thì cứu được bạn, và chữ "thường thì" ở đây đang gánh việc thật. Thứ hai, một lần migration hỏng biến thành một API sập-rồi-restart-vòng-lặp chứ không phải một cú dừng rõ ràng: container khởi động lại, thử migration lại, hỏng tiếp, và log của bạn đầy cùng một lỗi trong khi lượt deploy báo thành công. Một dịch vụ <code>migrate</code> riêng với <code>restart: "no"</code> và <code>service_completed_successfully</code> cho bạn một lượt chạy, một mã thoát rõ ràng, và một lượt deploy biết dừng khi thay đổi schema hỏng.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một cái ảnh với ba câu lệnh bảo đảm API, worker và migration là cùng một mã — dựng một lần, chỉ khác ở <code>command</code>. Migration thuộc về dịch vụ riêng của nó với <code>restart: "no"</code>, có <code>service_completed_successfully</code> canh cửa, không bao giờ nằm trong entrypoint. Và module gốc gắn với libc của ảnh nền: hãy khai <code>binaryTargets</code> của Prisma, và kiểm cái ảnh khởi động được thật trước khi đưa nó lên — build xanh không phải là một container đang chạy.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — The frontend: Next.js in a container|||10.4 — Frontend: Next.js trong container',
      slug: 'dk-10-4-frontend',
      type: 'LESSON',
      description: 'Bản dựng standalone và vì sao nó nhỏ hơn mười lần, cái bẫy NEXT_PUBLIC nướng vào lúc dựng, hai URL cho cùng một API, ảnh với font, và bind mount lúc phát triển.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>The frontend: Next.js in a container</h2>
<p class="lead">A Next.js container is where two Docker ideas collide with a framework that has strong opinions about both: what happens at build time versus run time, and what "the API URL" means when the same code runs on a server and in a browser. Get those two right and the rest is an ordinary multi-stage build.</p>

<h3>The standalone build</h3>
<pre><code><span class="tok-comment">// next.config.js</span>
module.exports = {
  output: 'standalone',              <span class="tok-comment">// trace exactly the files needed to run</span>
  compress: false,                   <span class="tok-comment">// nginx does gzip/brotli better</span>
  poweredByHeader: false,
};</code></pre>
<pre><code><span class="tok-comment"># frontend/Dockerfile</span>
FROM node:22.11-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM node:22.11-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_URL              <span class="tok-comment"># baked into the bundle HERE</span>
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=\${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=\${NEXT_PUBLIC_SITE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22.11-alpine AS production
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]</code></pre>
<pre><code>docker build -t web:1.4.2 ./frontend
docker images --format '{{.Repository}}:{{.Tag}}\\t{{.Size}}' | grep -E '^web|^web-full'</code></pre>
<div class="out">web:1.4.2	187MB
web-full:1.4.2	1.31GB</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>output: 'standalone'</code></span><span class="v">Next traces which files the server actually needs and writes a minimal <code>server.js</code> plus a pruned <code>node_modules</code>. 187MB instead of 1.31GB, for the same site.</span></div>
  <div class="kv"><span class="k">Copy <code>.next/static</code> and <code>public</code> separately</span><span class="v">The standalone output deliberately excludes them. Forgetting either gives you a site that renders with no CSS and no images — a very recognisable symptom.</span></div>
  <div class="kv"><span class="k"><code>HOSTNAME=0.0.0.0</code></span><span class="v">Next's server binds to <code>localhost</code> by default. Inside a container that means nothing else can reach it (Lesson 8.3) — this one variable is the difference between working and a 502 from nginx.</span></div>
  <div class="kv"><span class="k"><code>compress: false</code></span><span class="v">nginx compresses better and cheaper. Compressing twice wastes CPU on every request for no benefit.</span></div>
  <div class="kv"><span class="k">Do not bind-mount <code>.next</code></span><span class="v">In development, mount the source but keep <code>/app/.next</code> and <code>/app/node_modules</code> as anonymous volumes (Lesson 7.3), or the host's stale build shadows the container's.</span></div>
</div>

<h3>The NEXT_PUBLIC trap</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Server-side variables</span><span class="lz-t">read at RUN time, from the container's environment</span><span class="lz-d">Anything used only in <code>getServerSideProps</code>, a route handler, or a server component. Change it and restart the container — no rebuild.</span></div>
  <div class="lz-step"><span class="lz-k">NEXT_PUBLIC_* variables</span><span class="lz-t">substituted into the JS bundle at BUILD time</span><span class="lz-d">They become string literals in the files the browser downloads. Setting one in <code>environment:</code> has no effect whatsoever — the value was fixed when <code>npm run build</code> ran.</span></div>
  <div class="lz-step"><span class="lz-k">So they must be build args</span><span class="lz-t">ARG + ENV in the build stage, args: in compose</span><span class="lz-d">Which also means one image per environment: the staging build and the production build are genuinely different artifacts if their public URLs differ.</span></div>
  <div class="lz-step"><span class="lz-k">The better answer: relative URLs</span><span class="lz-t">fetch('/api/posts')</span><span class="lz-d">If the browser talks to the same origin, there is no URL to bake in — nginx routes <code>/api</code> to the backend, and the same image runs in every environment.</span></div>
</div>
<pre><code><span class="tok-comment"># Prove it: the value is IN the bundle</span>
docker run --rm web:1.4.2 sh -c 'grep -ro "https://api\\.cuongthai\\.com" .next/static/chunks | head -2'
<span class="tok-comment"># And an environment variable at run time changes nothing</span>
docker run --rm -e NEXT_PUBLIC_API_URL=https://other.example web:1.4.2 \\
  sh -c 'grep -ro "other\\.example" .next/static/chunks | wc -l'</code></pre>
<div class="out">.next/static/chunks/app/page-4f1c8a.js:https://api.cuongthai.com
.next/static/chunks/main-9b2e11.js:https://api.cuongthai.com
0</div>
<div class="callout warn"><strong>This is also a security rule, not just an operational one.</strong> Because <code>NEXT_PUBLIC_*</code> values are literally shipped to every visitor's browser, a third-party API key with that prefix is a published secret. This project learned it the hard way: a GIF picker called GIPHY directly from the client with <code>NEXT_PUBLIC_GIPHY_API_KEY</code>, the variable was missing at build time, the client silently fell back to GIPHY's revoked public beta key, and the feature returned 403 for everyone. The fix was a small authenticated backend proxy — the key stays server-side as runtime env, responses get cached, and rotating it is a container restart rather than a rebuild.</div>

<h3>Two URLs for the same API</h3>
<pre><code><span class="tok-comment">// lib/api.ts — the same file runs in both places</span>
const BASE = typeof window === 'undefined'
  ? process.env.INTERNAL_API_URL       <span class="tok-comment">// http://api:3000  — container network</span>
  : '';                                <span class="tok-comment">// same-origin, nginx routes /api</span>

export async function getPosts() {
  const res = await fetch(&#96;\${BASE}/api/v1/posts&#96;, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(&#96;posts: \${res.status}&#96;);
  return res.json();
}</code></pre>
<pre><code>  web:
    image: ghcr.io/me/web:\${TAG:-latest}
    build:
      context: ./frontend
      args:
        NEXT_PUBLIC_SITE_URL: \${SITE_URL:-https://cuongthai.com}
    environment:
      INTERNAL_API_URL: http://api:3000    <span class="tok-comment"># runtime, server-side only</span>
      HOSTNAME: 0.0.0.0
    depends_on:
      api: { condition: service_healthy }
    networks: [public]
    restart: unless-stopped</code></pre>
<div class="callout ok"><strong>Server-side rendering goes over the container network; the browser goes through nginx.</strong> They are different paths and they need different addresses — <code>http://api:3000</code> does not resolve in a browser, and <code>https://cuongthai.com/api</code> from inside the container would leave the host, cross the public internet and come back, adding latency and a dependency on DNS and TLS for a call between two containers on the same machine.</div>

<h3>Images, fonts, and the sharp dependency</h3>
<pre><code><span class="tok-comment"># next/image needs sharp; the alpine build sometimes needs help finding it</span>
FROM node:22.11-alpine AS production
RUN apk add --no-cache vips-dev fontconfig ttf-dejavu
ENV NEXT_SHARP_PATH=/app/node_modules/sharp</code></pre>
<pre><code>docker compose exec web node -e "console.log(require('sharp').format.jpeg.output ? 'sharp ok' : 'broken')"
docker compose exec web sh -c 'ls .next/static/media | head -3'</code></pre>
<div class="out">sharp ok
inter-latin-400-normal-c8a1f2.woff2
inter-latin-700-normal-9d3e4b.woff2
logo-2f8c91.svg</div>
<p>Two practical notes. If <code>npm ci</code> fails in the Docker build while fetching sharp's prebuilt binaries, it is usually a transient network problem and a retry succeeds using the cached layers. And if a deploy on a small VPS dies during <code>next build</code> with exit code 137, that is the OOM killer: building the frontend and backend in parallel on a 6GB machine has done exactly that here, which is why builds run sequentially on the server and in parallel only on a machine with the memory for it.</p>

<a class="link-card" href="https://nextjs.org/docs/app/api-reference/config/next-config-js/output" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Next.js — output: standalone</span><span class="lc-sub">What the file tracer includes, the exact <code>COPY</code> lines a Dockerfile needs, and the caveats about <code>public/</code> and <code>.next/static</code> that catch everyone once.</span></span>
</a>
<a class="link-card" href="https://nextjs.org/docs/app/guides/environment-variables" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Next.js — environment variables</span><span class="lc-sub">The bundling rules for <code>NEXT_PUBLIC_*</code> spelled out, why the value is fixed at build time, and the runtime-config alternatives when you genuinely need one image per environment.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: containerise a Next.js app</span><span class="lc-sub">Graded exercises: write the standalone Dockerfile, prove a <code>NEXT_PUBLIC_*</code> value is in the bundle and cannot be changed at run time, and pick the right API base URL for server and browser.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> changing a <code>NEXT_PUBLIC_*</code> variable on the server, restarting the container, and finding the site unchanged. Nothing is broken — the value was substituted into the JavaScript when the image was built, and restarting a container cannot alter files inside an image. The symptom is worse than confusing when the variable was <em>missing</em> at build time: the bundle then contains <code>undefined</code>, and the code either falls back to a default nobody remembers writing or requests <code>undefined/api/posts</code>, which 404s in a way that looks like a routing bug. Two habits: prefer same-origin relative URLs so there is nothing to bake, and when you genuinely need a public build variable, pass it as a build <code>arg</code> and grep the built bundle for the value before deploying.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>output: 'standalone'</code> turns a 1.3GB image into ~190MB, but you must copy <code>public/</code> and <code>.next/static</code> yourself. <code>NEXT_PUBLIC_*</code> is fixed at build time and shipped to every browser — it is a build arg, never a runtime variable, and never a place for a third-party key. And set <code>HOSTNAME=0.0.0.0</code>, or Next binds to the container's own loopback and nginx gets a 502.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Frontend: Next.js trong container</h2>
<p class="lead">Container Next.js là nơi hai ý tưởng của Docker va vào một framework có quan điểm rất mạnh về cả hai: chuyện gì xảy ra lúc DỰNG so với lúc CHẠY, và "URL của API" nghĩa là gì khi cùng một đoạn mã chạy trên máy chủ lẫn trong trình duyệt. Làm đúng hai thứ đó thì phần còn lại chỉ là một bản dựng nhiều tầng bình thường.</p>

<h3>Bản dựng standalone</h3>
<pre><code><span class="tok-comment">// next.config.js</span>
module.exports = {
  output: 'standalone',              <span class="tok-comment">// truy vết đúng những file cần để chạy</span>
  compress: false,                   <span class="tok-comment">// nginx nén gzip/brotli tốt hơn</span>
  poweredByHeader: false,
};</code></pre>
<pre><code><span class="tok-comment"># frontend/Dockerfile</span>
FROM node:22.11-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM node:22.11-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_URL              <span class="tok-comment"># được nướng vào gói JS Ở ĐÂY</span>
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=\${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=\${NEXT_PUBLIC_SITE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22.11-alpine AS production
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]</code></pre>
<pre><code>docker build -t web:1.4.2 ./frontend
docker images --format '{{.Repository}}:{{.Tag}}\\t{{.Size}}' | grep -E '^web|^web-full'</code></pre>
<div class="out">web:1.4.2	187MB
web-full:1.4.2	1.31GB</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>output: 'standalone'</code></span><span class="v">Next truy vết xem máy chủ thật sự cần những file nào rồi ghi ra một <code>server.js</code> tối giản cộng một <code>node_modules</code> đã tỉa. 187MB thay vì 1,31GB, cho cùng một trang.</span></div>
  <div class="kv"><span class="k">Chép <code>.next/static</code> và <code>public</code> riêng</span><span class="v">Bản standalone cố ý loại chúng ra. Quên một trong hai là bạn có một trang web kết xuất ra mà không có CSS và không có ảnh — một triệu chứng rất dễ nhận ra.</span></div>
  <div class="kv"><span class="k"><code>HOSTNAME=0.0.0.0</code></span><span class="v">Máy chủ của Next mặc định gắn vào <code>localhost</code>. Bên trong container điều đó nghĩa là không gì khác với tới được (Bài 8.3) — riêng cái biến này là khác biệt giữa chạy được và một cú 502 từ nginx.</span></div>
  <div class="kv"><span class="k"><code>compress: false</code></span><span class="v">nginx nén tốt hơn và rẻ hơn. Nén hai lần là phí CPU ở mọi yêu cầu mà chẳng được gì.</span></div>
  <div class="kv"><span class="k">Đừng bind-mount <code>.next</code></span><span class="v">Lúc phát triển, hãy gắn mã nguồn nhưng giữ <code>/app/.next</code> và <code>/app/node_modules</code> làm volume vô danh (Bài 7.3), không thì bản dựng cũ trên máy chủ sẽ che mất bản của container.</span></div>
</div>

<h3>Cái bẫy NEXT_PUBLIC</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Biến phía máy chủ</span><span class="lz-t">đọc lúc CHẠY, từ môi trường của container</span><span class="lz-d">Mọi thứ chỉ dùng trong <code>getServerSideProps</code>, một route handler, hay một server component. Đổi nó rồi khởi động lại container — không cần dựng lại.</span></div>
  <div class="lz-step"><span class="lz-k">Biến NEXT_PUBLIC_*</span><span class="lz-t">bị thay thẳng vào gói JS lúc DỰNG</span><span class="lz-d">Chúng trở thành chuỗi hằng nằm trong những file trình duyệt tải về. Đặt một cái trong <code>environment:</code> hoàn toàn không có tác dụng gì — giá trị đã bị đóng đinh khi <code>npm run build</code> chạy.</span></div>
  <div class="lz-step"><span class="lz-k">Nên chúng phải là build arg</span><span class="lz-t">ARG + ENV trong tầng dựng, args: trong compose</span><span class="lz-d">Điều đó cũng nghĩa là mỗi môi trường một cái ảnh: bản dựng staging và bản dựng production đúng là hai hiện vật khác nhau nếu URL công khai của chúng khác nhau.</span></div>
  <div class="lz-step"><span class="lz-k">Câu trả lời tốt hơn: URL tương đối</span><span class="lz-t">fetch('/api/posts')</span><span class="lz-d">Nếu trình duyệt nói chuyện với cùng một gốc thì chẳng có URL nào để nướng vào cả — nginx định tuyến <code>/api</code> về backend, và cùng một cái ảnh chạy ở mọi môi trường.</span></div>
</div>
<pre><code><span class="tok-comment"># Chứng minh: cái giá trị đó nằm TRONG gói JS</span>
docker run --rm web:1.4.2 sh -c 'grep -ro "https://api\\.cuongthai\\.com" .next/static/chunks | head -2'
<span class="tok-comment"># Và một biến môi trường lúc chạy chẳng đổi được gì</span>
docker run --rm -e NEXT_PUBLIC_API_URL=https://other.example web:1.4.2 \\
  sh -c 'grep -ro "other\\.example" .next/static/chunks | wc -l'</code></pre>
<div class="out">.next/static/chunks/app/page-4f1c8a.js:https://api.cuongthai.com
.next/static/chunks/main-9b2e11.js:https://api.cuongthai.com
0</div>
<div class="callout warn"><strong>Đây cũng là một luật AN TOÀN, không chỉ là chuyện vận hành.</strong> Vì giá trị <code>NEXT_PUBLIC_*</code> được gửi thẳng tới trình duyệt của mọi khách truy cập, một khoá API của bên thứ ba mang tiền tố đó là một bí mật đã công bố. Dự án này học bài đó theo cách khó: một bộ chọn GIF gọi thẳng GIPHY từ phía client bằng <code>NEXT_PUBLIC_GIPHY_API_KEY</code>, biến ấy bị thiếu lúc dựng, client lặng lẽ rơi về cái khoá beta công khai đã bị GIPHY thu hồi, và tính năng trả 403 cho tất cả mọi người. Cách chữa là một proxy backend nhỏ có xác thực — khoá nằm lại phía máy chủ dưới dạng biến lúc chạy, phản hồi được lưu đệm, và xoay khoá chỉ là khởi động lại container chứ không phải dựng lại ảnh.</div>

<h3>Hai URL cho cùng một API</h3>
<pre><code><span class="tok-comment">// lib/api.ts — cùng một file chạy ở cả hai nơi</span>
const BASE = typeof window === 'undefined'
  ? process.env.INTERNAL_API_URL       <span class="tok-comment">// http://api:3000  — mạng container</span>
  : '';                                <span class="tok-comment">// cùng gốc, nginx định tuyến /api</span>

export async function getPosts() {
  const res = await fetch(&#96;\${BASE}/api/v1/posts&#96;, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(&#96;posts: \${res.status}&#96;);
  return res.json();
}</code></pre>
<pre><code>  web:
    image: ghcr.io/me/web:\${TAG:-latest}
    build:
      context: ./frontend
      args:
        NEXT_PUBLIC_SITE_URL: \${SITE_URL:-https://cuongthai.com}
    environment:
      INTERNAL_API_URL: http://api:3000    <span class="tok-comment"># lúc chạy, chỉ phía máy chủ</span>
      HOSTNAME: 0.0.0.0
    depends_on:
      api: { condition: service_healthy }
    networks: [public]
    restart: unless-stopped</code></pre>
<div class="callout ok"><strong>Kết xuất phía máy chủ đi qua mạng container; trình duyệt đi qua nginx.</strong> Đó là hai đường khác nhau và chúng cần hai địa chỉ khác nhau — <code>http://api:3000</code> không phân giải được trong trình duyệt, còn gọi <code>https://cuongthai.com/api</code> từ bên trong container thì phải đi ra khỏi máy chủ, vòng qua Internet công cộng rồi quay lại, cộng thêm độ trễ và một sự phụ thuộc vào DNS với TLS cho một cuộc gọi giữa hai container nằm trên cùng một cái máy.</div>

<h3>Ảnh, font, và cái phụ thuộc sharp</h3>
<pre><code><span class="tok-comment"># next/image cần sharp; bản dựng alpine đôi khi cần được chỉ đường</span>
FROM node:22.11-alpine AS production
RUN apk add --no-cache vips-dev fontconfig ttf-dejavu
ENV NEXT_SHARP_PATH=/app/node_modules/sharp</code></pre>
<pre><code>docker compose exec web node -e "console.log(require('sharp').format.jpeg.output ? 'sharp ok' : 'broken')"
docker compose exec web sh -c 'ls .next/static/media | head -3'</code></pre>
<div class="out">sharp ok
inter-latin-400-normal-c8a1f2.woff2
inter-latin-700-normal-9d3e4b.woff2
logo-2f8c91.svg</div>
<p>Hai ghi chú thực tế. Nếu <code>npm ci</code> chết trong lúc dựng Docker khi đang tải các tệp nhị phân dựng sẵn của sharp thì thường là trục trặc mạng thoáng qua, và thử lại sẽ thành công nhờ dùng lại các lớp đã lưu đệm. Còn nếu một lượt deploy trên con VPS nhỏ chết giữa <code>next build</code> với mã thoát 137 thì đó là bộ giết OOM: dựng frontend và backend song song trên một cái máy 6GB đã gây ra đúng chuyện đó ở đây, và đó là lý do trên máy chủ thì các lượt dựng chạy tuần tự, còn song song chỉ dành cho cái máy có đủ bộ nhớ.</p>

<a class="link-card" href="https://nextjs.org/docs/app/api-reference/config/next-config-js/output" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Next.js — output: standalone</span><span class="lc-sub">Bộ truy vết file gồm những gì, chính xác những dòng <code>COPY</code> mà một Dockerfile cần, và những lưu ý về <code>public/</code> với <code>.next/static</code> mà ai cũng vấp một lần.</span></span>
</a>
<a class="link-card" href="https://nextjs.org/docs/app/guides/environment-variables" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Next.js — biến môi trường</span><span class="lc-sub">Luật đóng gói của <code>NEXT_PUBLIC_*</code> viết rõ ra, vì sao giá trị bị đóng đinh lúc dựng, và các phương án cấu hình lúc chạy khi bạn thật sự cần mỗi môi trường một cái ảnh.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đóng gói một ứng dụng Next.js</span><span class="lc-sub">Bài chấm điểm: viết Dockerfile standalone, chứng minh một giá trị <code>NEXT_PUBLIC_*</code> nằm trong gói JS và không đổi được lúc chạy, và chọn đúng URL gốc của API cho phía máy chủ với phía trình duyệt.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đổi một biến <code>NEXT_PUBLIC_*</code> trên máy chủ, khởi động lại container, rồi thấy trang web y nguyên. Chẳng có gì hỏng cả — giá trị đó đã bị thay vào JavaScript lúc cái ảnh được dựng, và khởi động lại một container thì không sửa được file nằm bên trong ảnh. Triệu chứng còn tệ hơn cả khó hiểu khi biến đó bị <em>thiếu</em> lúc dựng: gói JS khi ấy chứa <code>undefined</code>, và mã hoặc rơi về một giá trị mặc định không ai nhớ là mình đã viết, hoặc gọi tới <code>undefined/api/posts</code> rồi trả 404 theo kiểu trông hệt như một lỗi định tuyến. Hai thói quen: ưu tiên URL tương đối cùng gốc để không có gì phải nướng vào, và khi bạn thật sự cần một biến công khai lúc dựng thì hãy truyền nó dưới dạng <code>arg</code> rồi grep gói JS đã dựng tìm giá trị đó trước khi deploy.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>output: 'standalone'</code> biến một cái ảnh 1,3GB thành khoảng 190MB, nhưng bạn phải tự chép <code>public/</code> và <code>.next/static</code>. <code>NEXT_PUBLIC_*</code> bị đóng đinh lúc dựng và được gửi tới mọi trình duyệt — nó là build arg, không bao giờ là biến lúc chạy, và không bao giờ là chỗ để khoá của bên thứ ba. Và hãy đặt <code>HOSTNAME=0.0.0.0</code>, không thì Next gắn vào loopback của chính container và nginx nhận về một cú 502.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.5 ─────────────────────────── */
    {
      title: '10.5 — nginx in front, and the whole file|||10.5 — nginx đứng trước, và cả cái file',
      slug: 'dk-10-5-nginx-lap-rap',
      type: 'LESSON',
      description: 'Cấu hình reverse proxy đầy đủ, header chuyển tiếp, WebSocket, cache tài sản tĩnh, TLS bằng Let’s Encrypt, file compose hoàn chỉnh năm dịch vụ, và một lượt deploy chạy thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>nginx in front, and the whole file</h2>
<p class="lead">The last service, and then the assembled result. nginx does four jobs here: it terminates TLS, routes <code>/api</code> to the backend and everything else to Next.js, serves static assets with long cache headers, and is the only container with a published port.</p>

<h3>The proxy configuration</h3>
<pre><code><span class="tok-comment"># ops/nginx.conf</span>
upstream web { server web:3000; keepalive 32; }
upstream api { server api:3000; keepalive 32; }

map $http_upgrade $connection_upgrade {      <span class="tok-comment"># websocket support</span>
  default upgrade;
  ''      close;
}

server {
  listen 80;
  server_name cuongthai.com www.cuongthai.com;
  return 301 https://cuongthai.com$request_uri;
}

server {
  listen 443 ssl;
  http2 on;
  server_name cuongthai.com;

  ssl_certificate     /etc/letsencrypt/live/cuongthai.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/cuongthai.com/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;

  client_max_body_size 25m;                  <span class="tok-comment"># uploads; default 1m rejects them</span>
  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;

  location /api/ {
    proxy_pass http://api;
    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade           $http_upgrade;
    proxy_set_header Connection        $connection_upgrade;
    proxy_read_timeout 300s;                 <span class="tok-comment"># streamed AI responses</span>
  }

  location /_next/static/ {                  <span class="tok-comment"># content-hashed: cache forever</span>
    proxy_pass http://web;
    proxy_cache_valid 200 365d;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    proxy_pass http://web;
    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>X-Forwarded-Proto</code></span><span class="v">Without it the app believes every request is plain HTTP, so redirects downgrade to <code>http://</code> and secure cookies are never set. Pair it with <code>app.set('trust proxy', 1)</code> in Express.</span></div>
  <div class="kv"><span class="k"><code>X-Forwarded-For</code></span><span class="v">Otherwise every client IP in your logs and rate limiter is the proxy container's address, and one abusive user rate-limits everybody.</span></div>
  <div class="kv"><span class="k"><code>client_max_body_size</code></span><span class="v">nginx's default is 1MB and it rejects larger uploads with a 413 before your app sees them. A confusing failure, because the app's own limit was set correctly.</span></div>
  <div class="kv"><span class="k"><code>proxy_read_timeout</code></span><span class="v">Default 60s. Streamed responses — an AI completion, a long export — get cut off mid-stream, which the browser reports as a network error rather than a timeout.</span></div>
  <div class="kv"><span class="k"><code>upstream</code> plus <code>keepalive</code></span><span class="v">Reuses connections instead of a new TCP handshake per request. Requires <code>proxy_http_version 1.1</code> to take effect.</span></div>
</div>
<div class="callout warn"><strong>The trailing slash in <code>proxy_pass</code> changes the path.</strong> <code>proxy_pass http://api;</code> passes <code>/api/v1/posts</code> through unchanged; <code>proxy_pass http://api/;</code> strips the <code>/api/</code> prefix and sends <code>/v1/posts</code>. Both are legitimate, and picking the wrong one gives you a 404 from a backend that is working perfectly. Decide once, then verify with <code>curl -s -o /dev/null -w "%{http_code}"</code> against a route you know exists.</div>

<h3>TLS without a manual step</h3>
<pre><code>  nginx:
    image: nginx:1.27-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ops/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - certs:/etc/letsencrypt
      - ./ops/certbot-www:/var/www/certbot:ro
    depends_on:
      web: { condition: service_started }
      api: { condition: service_healthy }
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost/healthz || exit 1"]
      interval: 30s
    networks: [public]
    restart: unless-stopped

  certbot:
    image: certbot/certbot:latest
    volumes:
      - certs:/etc/letsencrypt
      - ./ops/certbot-www:/var/www/certbot
    entrypoint: ["sh", "-c", "trap exit TERM; while :; do certbot renew --webroot -w /var/www/certbot --quiet; sleep 12h; done"]
    profiles: [tls]
    restart: unless-stopped</code></pre>
<pre><code>docker compose --profile tls up -d certbot
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload      <span class="tok-comment"># zero-downtime config reload</span></code></pre>
<div class="out">nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
2026/08/22 12:41:07 [notice] 1#1: signal process started</div>
<div class="callout ok"><strong><code>nginx -s reload</code> is not a restart.</strong> The master process loads the new configuration, starts new workers with it, and lets the old workers finish the requests they are serving before exiting. No connection is dropped. Always run <code>nginx -t</code> first — a reload with a syntax error is refused and the old configuration keeps serving, but only if you find out before you have also restarted the container.</div>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Browser → nginx:443</span><span class="lz-t">the only published port on the host</span><span class="lz-d">TLS terminates here. Everything past this point is plain HTTP over a private container network that nothing outside the host can reach.</span></div>
  <div class="lz-step"><span class="lz-k">2 · nginx routes by path</span><span class="lz-t">/api → api:3000 · everything else → web:3000</span><span class="lz-d">By service name over the public network. <code>/_next/static/</code> gets a one-year immutable cache header because those filenames carry a content hash.</span></div>
  <div class="lz-step"><span class="lz-k">3 · web renders, calling api:3000</span><span class="lz-t">server-side, over the container network</span><span class="lz-d">The same request from the browser would go back out through nginx. Two paths, two addresses, one API.</span></div>
  <div class="lz-step"><span class="lz-k">4 · api → db:5432, cache:6379</span><span class="lz-t">the private, internal network</span><span class="lz-d">No published ports, no route to the internet, and no interface that nginx or web can see. The request has crossed three boundaries and only <code>api</code> could make the last one.</span></div>
</div>
<h3>The complete compose.yaml</h3>
<pre><code>name: blog

services:
  nginx:   { image: nginx:1.27-alpine, ports: ["80:80","443:443"], networks: [public],
             depends_on: { web: {condition: service_started}, api: {condition: service_healthy} },
             volumes: ["./ops/nginx.conf:/etc/nginx/conf.d/default.conf:ro", "certs:/etc/letsencrypt"],
             restart: unless-stopped }

  web:     { image: "ghcr.io/me/web:\${TAG:-latest}", networks: [public],
             environment: { INTERNAL_API_URL: "http://api:3000", HOSTNAME: "0.0.0.0" },
             depends_on: { api: {condition: service_healthy} }, restart: unless-stopped }

  api:     { image: "ghcr.io/me/api:\${TAG:-latest}", networks: [public, private],
             env_file: [.env],
             depends_on: { db: {condition: service_healthy}, cache: {condition: service_healthy},
                           migrate: {condition: service_completed_successfully} },
             restart: unless-stopped }

  worker:  { image: "ghcr.io/me/api:\${TAG:-latest}", command: ["node","dist/worker.js"],
             networks: [private], env_file: [.env],
             depends_on: { migrate: {condition: service_completed_successfully} },
             restart: unless-stopped }

  migrate: { image: "ghcr.io/me/api:\${TAG:-latest}", command: ["npx","prisma","migrate","deploy"],
             networks: [private], env_file: [.env],
             depends_on: { db: {condition: service_healthy} }, restart: "no" }

  db:      { image: postgres:16.4-alpine, networks: [private],
             volumes: ["pgdata:/var/lib/postgresql/data"], restart: unless-stopped }

  cache:   { image: redis:7.4-alpine, networks: [private],
             volumes: ["redisdata:/data"], restart: unless-stopped }

networks:
  public:
  private: { internal: true }

volumes:
  pgdata:
  redisdata:
  certs:</code></pre>
<p>Written inline to fit on a page; in the repository each service is the full block from Lessons 10.2 to 10.4, with healthchecks, environment and tuning. What matters is the shape: seven services, two networks, three volumes, exactly one service publishing ports, and a migration gate the API cannot start without.</p>

<h3>A deploy, end to end</h3>
<pre><code><span class="tok-comment"># On the build machine — tag by commit, never :latest on a server</span>
export TAG=$(git rev-parse --short HEAD)
docker compose -f compose.yaml -f compose.prod.yaml build
docker compose -f compose.yaml -f compose.prod.yaml push

<span class="tok-comment"># On the server</span>
export TAG=&lt;the same sha&gt;
docker compose -f compose.yaml -f compose.prod.yaml pull
docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build
docker compose ps --format 'table {{.Service}}\\t{{.Status}}'</code></pre>
<div class="out">SERVICE   STATUS
api       Up 40 seconds (healthy)
cache     Up 52 seconds (healthy)
db        Up 52 seconds (healthy)
nginx     Up 38 seconds (healthy)
web       Up 39 seconds
worker    Up 40 seconds</div>
<pre><code><span class="tok-comment"># Smoke test: 401 or 200 means mounted, 404 means a stale or partial build</span>
for r in health posts auth/me gifs/search; do
  printf '%-16s %s\\n' "$r" "$(curl -s -o /dev/null -w '%{http_code}' https://cuongthai.com/api/v1/$r)"
done</code></pre>
<div class="out">health           200
posts            200
auth/me          401
gifs/search      401</div>
<div class="callout ok"><strong>That loop is worth putting in your deploy script.</strong> A 404 on a route you know exists means the running container is not the image you just built — a stale or partial deploy. This project's deploy script fails the deploy on any 404 for exactly that reason, after an incident where a <code>--no-build</code> deploy left production running an old <code>dist/</code> that never mounted the GIF router: the feature was dead, the container was healthy, and nothing in the logs said so. Add one param-less unauthenticated GET route per feature module to the list — and only routes that return non-404 on a bare GET, or every deploy false-fails.</div>

<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">nginx — ngx_http_proxy_module</span><span class="lc-sub">The authority on <code>proxy_pass</code>, including the trailing-slash rule, buffering, timeouts and header handling. Dense, and the only place the URI-rewriting behaviour is stated exactly.</span></span>
</a>
<a class="link-card" href="https://ssl-config.mozilla.org/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Mozilla SSL Configuration Generator</span><span class="lc-sub">Pick nginx and a compatibility level and it emits a correct, current TLS block. Better than copying cipher suites from a blog post written four years ago.</span></span>
</a>
<a class="link-card" href="https://eff-certbot.readthedocs.io/en/stable/using.html#webroot" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">certbot — the webroot plugin</span><span class="lc-sub">How the HTTP-01 challenge works with a running nginx, why the challenge directory must be shared, and the renewal hooks that reload nginx after a successful renewal.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: finish the stack</span><span class="lc-sub">Graded exercises: write the nginx block that routes <code>/api</code> and <code>/</code> correctly, explain what the trailing slash in <code>proxy_pass</code> changes, and write the smoke test a deploy script should run.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> deploying with <code>--no-build</code> after changing code, or otherwise letting the running container be an older image than you think. The stack comes up, every container reports healthy, and the site mostly works — while one router that only exists in the new code is simply absent, returning 404 on every call. Users see one broken feature; your logs show a clean start; and because <code>docker compose ps</code> says everything is up, the deploy looks successful. This exact shape has happened here twice, and the fix is mechanical rather than clever: tag images by commit SHA so the running version is a fact you can check, and end every deploy with an unauthenticated <code>curl</code> against one route per feature module, failing on 404. A deploy is not finished when the containers start; it is finished when the routes answer.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The proxy must forward <code>X-Forwarded-Proto</code> and <code>X-Forwarded-For</code>, or your app gets HTTP redirects, unset secure cookies and the proxy's IP in every log line. The trailing slash in <code>proxy_pass</code> silently rewrites the path — decide it once and verify with curl. And end every deploy with a smoke test that fails on 404: containers being healthy is not the same as the routes being mounted.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>nginx đứng trước, và cả cái file</h2>
<p class="lead">Dịch vụ cuối cùng, rồi tới kết quả đã lắp ráp. Ở đây nginx làm bốn việc: kết thúc TLS, định tuyến <code>/api</code> về backend còn mọi thứ khác về Next.js, phục vụ tài sản tĩnh với header cache dài, và là container DUY NHẤT có cổng công bố.</p>

<h3>Cấu hình proxy</h3>
<pre><code><span class="tok-comment"># ops/nginx.conf</span>
upstream web { server web:3000; keepalive 32; }
upstream api { server api:3000; keepalive 32; }

map $http_upgrade $connection_upgrade {      <span class="tok-comment"># hỗ trợ websocket</span>
  default upgrade;
  ''      close;
}

server {
  listen 80;
  server_name cuongthai.com www.cuongthai.com;
  return 301 https://cuongthai.com$request_uri;
}

server {
  listen 443 ssl;
  http2 on;
  server_name cuongthai.com;

  ssl_certificate     /etc/letsencrypt/live/cuongthai.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/cuongthai.com/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;

  client_max_body_size 25m;                  <span class="tok-comment"># tải file lên; mặc định 1m sẽ từ chối</span>
  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;

  location /api/ {
    proxy_pass http://api;
    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade           $http_upgrade;
    proxy_set_header Connection        $connection_upgrade;
    proxy_read_timeout 300s;                 <span class="tok-comment"># phản hồi AI chảy dần</span>
  }

  location /_next/static/ {                  <span class="tok-comment"># tên có băm nội dung: cache mãi mãi</span>
    proxy_pass http://web;
    proxy_cache_valid 200 365d;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    proxy_pass http://web;
    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>X-Forwarded-Proto</code></span><span class="v">Không có nó thì ứng dụng tin rằng mọi yêu cầu đều là HTTP trần, nên chuyển hướng tụt về <code>http://</code> và cookie secure không bao giờ được đặt. Hãy ghép với <code>app.set('trust proxy', 1)</code> trong Express.</span></div>
  <div class="kv"><span class="k"><code>X-Forwarded-For</code></span><span class="v">Không thì mọi IP khách trong log và trong bộ giới hạn tần suất của bạn đều là địa chỉ của container proxy, và một người dùng phá phách sẽ khoá tần suất của tất cả mọi người.</span></div>
  <div class="kv"><span class="k"><code>client_max_body_size</code></span><span class="v">Mặc định của nginx là 1MB và nó từ chối file lớn hơn bằng mã 413 TRƯỚC khi ứng dụng của bạn nhìn thấy. Một kiểu hỏng khó hiểu, vì giới hạn của chính ứng dụng đã được đặt đúng.</span></div>
  <div class="kv"><span class="k"><code>proxy_read_timeout</code></span><span class="v">Mặc định 60s. Phản hồi chảy dần — một câu trả lời AI, một lượt xuất dữ liệu dài — bị cắt giữa dòng, và trình duyệt báo cáo thành lỗi mạng chứ không phải hết giờ.</span></div>
  <div class="kv"><span class="k"><code>upstream</code> kèm <code>keepalive</code></span><span class="v">Dùng lại kết nối thay vì bắt tay TCP mới cho mỗi yêu cầu. Cần <code>proxy_http_version 1.1</code> mới có tác dụng.</span></div>
</div>
<div class="callout warn"><strong>Dấu gạch chéo cuối trong <code>proxy_pass</code> làm ĐỔI đường dẫn.</strong> <code>proxy_pass http://api;</code> chuyển <code>/api/v1/posts</code> đi nguyên vẹn; <code>proxy_pass http://api/;</code> cắt bỏ tiền tố <code>/api/</code> rồi gửi đi <code>/v1/posts</code>. Cả hai đều hợp lệ, và chọn nhầm cái cho bạn một cú 404 từ một backend đang chạy hoàn hảo. Hãy quyết một lần, rồi kiểm bằng <code>curl -s -o /dev/null -w "%{http_code}"</code> trên một tuyến bạn biết chắc là có.</div>

<h3>TLS mà không cần bước làm tay</h3>
<pre><code>  nginx:
    image: nginx:1.27-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ops/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - certs:/etc/letsencrypt
      - ./ops/certbot-www:/var/www/certbot:ro
    depends_on:
      web: { condition: service_started }
      api: { condition: service_healthy }
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost/healthz || exit 1"]
      interval: 30s
    networks: [public]
    restart: unless-stopped

  certbot:
    image: certbot/certbot:latest
    volumes:
      - certs:/etc/letsencrypt
      - ./ops/certbot-www:/var/www/certbot
    entrypoint: ["sh", "-c", "trap exit TERM; while :; do certbot renew --webroot -w /var/www/certbot --quiet; sleep 12h; done"]
    profiles: [tls]
    restart: unless-stopped</code></pre>
<pre><code>docker compose --profile tls up -d certbot
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload      <span class="tok-comment"># nạp lại cấu hình không gián đoạn</span></code></pre>
<div class="out">nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
2026/08/22 12:41:07 [notice] 1#1: signal process started</div>
<div class="callout ok"><strong><code>nginx -s reload</code> không phải là khởi động lại.</strong> Tiến trình chủ nạp cấu hình mới, dựng các tiến trình con mới với cấu hình đó, và để các tiến trình con cũ phục vụ nốt những yêu cầu đang dở rồi mới thoát. Không kết nối nào bị rớt. Luôn chạy <code>nginx -t</code> trước — một lần nạp lại có lỗi cú pháp sẽ bị từ chối và cấu hình cũ tiếp tục phục vụ, nhưng chỉ khi bạn phát hiện ra TRƯỚC lúc lỡ tay khởi động lại luôn cái container.</div>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Trình duyệt → nginx:443</span><span class="lz-t">cổng công bố duy nhất trên máy chủ</span><span class="lz-d">TLS kết thúc ở đây. Mọi thứ sau điểm này là HTTP trần trên một mạng container riêng mà không gì ngoài máy chủ với tới được.</span></div>
  <div class="lz-step"><span class="lz-k">2 · nginx định tuyến theo đường dẫn</span><span class="lz-t">/api → api:3000 · còn lại → web:3000</span><span class="lz-d">Gọi bằng tên dịch vụ trên mạng công khai. <code>/_next/static/</code> nhận header cache một năm bất biến vì tên file ở đó mang mã băm nội dung.</span></div>
  <div class="lz-step"><span class="lz-k">3 · web kết xuất, gọi api:3000</span><span class="lz-t">phía máy chủ, qua mạng container</span><span class="lz-d">Cũng yêu cầu đó từ trình duyệt thì sẽ đi vòng ra ngoài qua nginx. Hai đường, hai địa chỉ, một API.</span></div>
  <div class="lz-step"><span class="lz-k">4 · api → db:5432, cache:6379</span><span class="lz-t">mạng riêng, internal</span><span class="lz-d">Không cổng công bố, không đường ra Internet, và không có giao diện nào mà nginx hay web nhìn thấy. Yêu cầu đã vượt ba ranh giới và chỉ <code>api</code> vượt được cái cuối.</span></div>
</div>
<h3>File compose.yaml hoàn chỉnh</h3>
<pre><code>name: blog

services:
  nginx:   { image: nginx:1.27-alpine, ports: ["80:80","443:443"], networks: [public],
             depends_on: { web: {condition: service_started}, api: {condition: service_healthy} },
             volumes: ["./ops/nginx.conf:/etc/nginx/conf.d/default.conf:ro", "certs:/etc/letsencrypt"],
             restart: unless-stopped }

  web:     { image: "ghcr.io/me/web:\${TAG:-latest}", networks: [public],
             environment: { INTERNAL_API_URL: "http://api:3000", HOSTNAME: "0.0.0.0" },
             depends_on: { api: {condition: service_healthy} }, restart: unless-stopped }

  api:     { image: "ghcr.io/me/api:\${TAG:-latest}", networks: [public, private],
             env_file: [.env],
             depends_on: { db: {condition: service_healthy}, cache: {condition: service_healthy},
                           migrate: {condition: service_completed_successfully} },
             restart: unless-stopped }

  worker:  { image: "ghcr.io/me/api:\${TAG:-latest}", command: ["node","dist/worker.js"],
             networks: [private], env_file: [.env],
             depends_on: { migrate: {condition: service_completed_successfully} },
             restart: unless-stopped }

  migrate: { image: "ghcr.io/me/api:\${TAG:-latest}", command: ["npx","prisma","migrate","deploy"],
             networks: [private], env_file: [.env],
             depends_on: { db: {condition: service_healthy} }, restart: "no" }

  db:      { image: postgres:16.4-alpine, networks: [private],
             volumes: ["pgdata:/var/lib/postgresql/data"], restart: unless-stopped }

  cache:   { image: redis:7.4-alpine, networks: [private],
             volumes: ["redisdata:/data"], restart: unless-stopped }

networks:
  public:
  private: { internal: true }

volumes:
  pgdata:
  redisdata:
  certs:</code></pre>
<p>Viết dồn một dòng cho vừa trang; trong kho mã thì mỗi dịch vụ là khối đầy đủ từ Bài 10.2 tới 10.4, có healthcheck, môi trường và phần tinh chỉnh. Thứ quan trọng là HÌNH DẠNG: bảy dịch vụ, hai mạng, ba volume, đúng một dịch vụ công bố cổng, và một cổng chặn migration mà API không thể khởi động nếu chưa qua.</p>

<h3>Một lượt deploy, từ đầu tới cuối</h3>
<pre><code><span class="tok-comment"># Trên máy dựng — gắn nhãn theo commit, đừng bao giờ dùng :latest trên máy chủ</span>
export TAG=$(git rev-parse --short HEAD)
docker compose -f compose.yaml -f compose.prod.yaml build
docker compose -f compose.yaml -f compose.prod.yaml push

<span class="tok-comment"># Trên máy chủ</span>
export TAG=&lt;đúng cái sha đó&gt;
docker compose -f compose.yaml -f compose.prod.yaml pull
docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build
docker compose ps --format 'table {{.Service}}\\t{{.Status}}'</code></pre>
<div class="out">SERVICE   STATUS
api       Up 40 seconds (healthy)
cache     Up 52 seconds (healthy)
db        Up 52 seconds (healthy)
nginx     Up 38 seconds (healthy)
web       Up 39 seconds
worker    Up 40 seconds</div>
<pre><code><span class="tok-comment"># Chốt kiểm: 401 hoặc 200 là đã gắn, 404 là bản dựng cũ hoặc dựng dở</span>
for r in health posts auth/me gifs/search; do
  printf '%-16s %s\\n' "$r" "$(curl -s -o /dev/null -w '%{http_code}' https://cuongthai.com/api/v1/$r)"
done</code></pre>
<div class="out">health           200
posts            200
auth/me          401
gifs/search      401</div>
<div class="callout ok"><strong>Cái vòng lặp đó đáng đưa vào script deploy của bạn.</strong> Một cú 404 trên một tuyến bạn biết chắc là có nghĩa là container đang chạy KHÔNG phải cái ảnh bạn vừa dựng — một lượt deploy cũ hoặc dở dang. Script deploy của chính dự án này cho deploy THẤT BẠI khi có bất kỳ mã 404 nào, đúng vì lý do đó, sau một sự cố mà một lượt deploy <code>--no-build</code> để production chạy một thư mục <code>dist/</code> cũ vốn không bao giờ gắn router GIF: tính năng chết, container khoẻ mạnh, và trong log không có dòng nào nói ra chuyện đó. Hãy thêm một tuyến GET không tham số, không cần xác thực cho mỗi module tính năng vào danh sách — và chỉ thêm những tuyến trả về khác 404 với một lệnh GET trần, không thì mọi lượt deploy sẽ báo hỏng oan.</div>

<a class="link-card" href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">nginx — ngx_http_proxy_module</span><span class="lc-sub">Bên có thẩm quyền về <code>proxy_pass</code>, gồm cả luật dấu gạch chéo cuối, đệm, hết giờ và xử lý header. Đặc, và là chỗ duy nhất nói chính xác hành vi viết lại URI.</span></span>
</a>
<a class="link-card" href="https://ssl-config.mozilla.org/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Mozilla SSL Configuration Generator</span><span class="lc-sub">Chọn nginx và một mức tương thích rồi nó sinh ra một khối TLS đúng và cập nhật. Tốt hơn chép bộ mã hoá từ một bài blog viết bốn năm trước.</span></span>
</a>
<a class="link-card" href="https://eff-certbot.readthedocs.io/en/stable/using.html#webroot" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">certbot — plugin webroot</span><span class="lc-sub">Thử thách HTTP-01 hoạt động ra sao với một nginx đang chạy, vì sao thư mục thử thách phải dùng chung, và các hook gia hạn giúp nạp lại nginx sau một lần gia hạn thành công.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: hoàn thiện stack</span><span class="lc-sub">Bài chấm điểm: viết khối nginx định tuyến đúng <code>/api</code> với <code>/</code>, giải thích dấu gạch chéo cuối trong <code>proxy_pass</code> đổi cái gì, và viết chốt kiểm mà một script deploy nên chạy.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> deploy bằng <code>--no-build</code> sau khi đã đổi mã, hoặc bằng cách nào đó để container đang chạy là một cái ảnh cũ hơn bạn tưởng. Stack lên, mọi container báo khoẻ mạnh, và trang web phần lớn vẫn chạy — trong khi một cái router chỉ tồn tại trong mã mới thì đơn giản là vắng mặt, trả 404 ở mọi lời gọi. Người dùng thấy một tính năng hỏng; log của bạn cho thấy một lượt khởi động sạch sẽ; và vì <code>docker compose ps</code> nói mọi thứ đang lên, lượt deploy trông như thành công. Đúng hình dạng đó đã xảy ra ở đây hai lần, và cách chữa mang tính máy móc chứ không cần thông minh: gắn nhãn ảnh theo mã SHA của commit để phiên bản đang chạy là một sự thật kiểm được, và kết thúc mọi lượt deploy bằng một lệnh <code>curl</code> không xác thực trên một tuyến của mỗi module tính năng, thất bại nếu gặp 404. Một lượt deploy chưa xong khi container khởi động; nó xong khi các tuyến trả lời.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Proxy phải chuyển tiếp <code>X-Forwarded-Proto</code> và <code>X-Forwarded-For</code>, không thì ứng dụng của bạn nhận chuyển hướng HTTP, cookie secure không được đặt, và mọi dòng log đều mang IP của proxy. Dấu gạch chéo cuối trong <code>proxy_pass</code> lặng lẽ viết lại đường dẫn — hãy quyết một lần rồi kiểm bằng curl. Và hãy kết thúc mọi lượt deploy bằng một chốt kiểm thất bại khi gặp 404: container khoẻ mạnh không đồng nghĩa với các tuyến đã được gắn.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.6 ─────────────────────────── */
    {
      title: '10.6 — Quiz: a real stack|||10.6 — Trắc nghiệm: một stack thật',
      slug: 'dk-10-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về tách mạng, POSTGRES_PASSWORD chỉ đọc một lần, migration là dịch vụ riêng, NEXT_PUBLIC nướng lúc dựng, HOSTNAME của Next, và chốt kiểm sau deploy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the assembled stack. Every one of these is a decision you make once and live with for a year — and most of them are much cheaper to get right at the start than to change later.</p>
<div class="callout ok">Aim for 7/8. The three that matter most: why only nginx publishes ports (10.1), why changing <code>POSTGRES_PASSWORD</code> in <code>.env</code> does nothing on an existing volume (10.2), and why a <code>NEXT_PUBLIC_*</code> variable cannot be changed at run time (10.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về cái stack đã lắp ráp. Câu nào cũng là một quyết định bạn ra một lần rồi sống chung cả năm — và phần lớn chúng rẻ hơn nhiều nếu làm đúng ngay từ đầu so với đổi về sau.</p>
<div class="callout ok">Nhắm 7/8. Ba câu quan trọng nhất: vì sao chỉ nginx công bố cổng (10.1), vì sao đổi <code>POSTGRES_PASSWORD</code> trong <code>.env</code> chẳng có tác dụng gì trên một volume đã có (10.2), và vì sao một biến <code>NEXT_PUBLIC_*</code> không đổi được lúc chạy (10.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'In the stack, `nginx` is on the public network and `db` is on an `internal: true` private network. What can nginx do to the database?|||Trong stack, `nginx` nằm trên mạng công khai còn `db` nằm trên một mạng riêng đặt `internal: true`. nginx làm được gì với cơ sở dữ liệu?',
            options: [
              'Reach it, but only on port 5432|||Với tới được, nhưng chỉ ở cổng 5432',
              'Nothing at all — it has no interface on that network, so the name does not even resolve; a compromised proxy gains no path to the data|||Hoàn toàn không gì cả — nó không có giao diện nào trên mạng đó, nên cái tên thậm chí không phân giải được; một proxy bị chiếm cũng chẳng có đường nào tới dữ liệu',
              'Reach it only if the database publishes a port|||Chỉ với tới được nếu cơ sở dữ liệu công bố một cổng',
              'Reach it through the api service automatically|||Với tới được một cách tự động thông qua dịch vụ api',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You change `POSTGRES_PASSWORD` in `.env` and redeploy. The API now fails to authenticate. Why?|||Bạn đổi `POSTGRES_PASSWORD` trong `.env` rồi deploy lại. Giờ API xác thực hỏng. Vì sao?',
            options: [
              'The API needs a restart to pick up the new value|||API cần được khởi động lại để lấy giá trị mới',
              'Compose caches environment variables between deploys|||Compose lưu đệm biến môi trường giữa các lượt deploy',
              'The password contains a character that needs escaping|||Mật khẩu chứa một ký tự cần thoát',
              'POSTGRES_PASSWORD is read only when the data directory is initialised — on an existing volume it is ignored; fix it with ALTER USER, never with down -v|||POSTGRES_PASSWORD chỉ được đọc khi thư mục dữ liệu được khởi tạo — trên một volume đã có thì nó bị phớt lờ; hãy chữa bằng ALTER USER, đừng bao giờ dùng down -v',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'Why run migrations in their own service rather than from the API container\'s entrypoint?|||Vì sao nên chạy migration trong một dịch vụ riêng thay vì từ entrypoint của container API?',
            options: [
              'One run with one clear exit code — a failed migration stops the deploy instead of becoming a crash-looping API, and multiple API replicas cannot race each other|||Một lượt chạy với một mã thoát rõ ràng — migration hỏng thì dừng lượt deploy thay vì biến thành một API sập-restart vòng lặp, và nhiều bản sao API không thể đua nhau',
              'Entrypoints cannot run npx commands|||Entrypoint không chạy được lệnh npx',
              'It makes the API image smaller|||Nó làm ảnh API nhỏ hơn',
              'Prisma refuses to run migrations from an entrypoint|||Prisma từ chối chạy migration từ một entrypoint',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A Next.js container starts fine but nginx returns 502 for every request. What is the most likely single cause?|||Một container Next.js khởi động ngon lành nhưng nginx trả 502 cho mọi yêu cầu. Nguyên nhân đơn lẻ nhiều khả năng nhất là gì?',
            options: [
              'The Next.js build failed silently|||Bản dựng Next.js hỏng trong im lặng',
              'nginx needs a longer proxy_read_timeout|||nginx cần proxy_read_timeout dài hơn',
              'Next binds to localhost by default, which inside a container means only itself — set HOSTNAME=0.0.0.0|||Next mặc định gắn vào localhost, mà bên trong container điều đó nghĩa là chỉ chính nó — hãy đặt HOSTNAME=0.0.0.0',
              'The web service is missing a published port|||Dịch vụ web thiếu một cổng công bố',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You set `NEXT_PUBLIC_API_URL` in the web service\'s `environment:` and restart. The site still calls the old URL. Why?|||Bạn đặt `NEXT_PUBLIC_API_URL` trong `environment:` của dịch vụ web rồi khởi động lại. Trang web vẫn gọi URL cũ. Vì sao?',
            options: [
              'NEXT_PUBLIC_* values are substituted into the JS bundle at BUILD time — they are string literals inside the image, so a restart cannot change them; pass it as a build arg, or use a relative URL|||Giá trị NEXT_PUBLIC_* được thay vào gói JS lúc DỰNG — chúng là chuỗi hằng nằm trong cái ảnh, nên khởi động lại không đổi được; hãy truyền nó làm build arg, hoặc dùng URL tương đối',
              'The browser cached the old bundle|||Trình duyệt đã lưu đệm gói JS cũ',
              'compose ignores environment for services that also have build|||compose phớt lờ environment với những dịch vụ cũng có build',
              'The variable needs the NEXT_RUNTIME_ prefix instead|||Biến đó cần tiền tố NEXT_RUNTIME_ thay thế',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Server-side rendering in the web container should call the API at which address?|||Kết xuất phía máy chủ trong container web nên gọi API ở địa chỉ nào?',
            options: [
              'https://cuongthai.com/api — the same URL the browser uses|||https://cuongthai.com/api — cùng URL trình duyệt dùng',
              'http://localhost:3000 — both run in the same stack|||http://localhost:3000 — cả hai chạy trong cùng stack',
              'The API container\'s IP address, read from docker inspect|||Địa chỉ IP của container API, đọc từ docker inspect',
              'http://api:3000 — the container network; the public URL would leave the host, cross the internet and come back for a call between two containers on one machine|||http://api:3000 — mạng container; URL công khai sẽ đi ra khỏi máy chủ, vòng qua Internet rồi quay lại chỉ để gọi giữa hai container trên cùng một cái máy',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'What does an unauthenticated `curl` returning 404 on a route you know exists tell you after a deploy?|||Sau một lượt deploy, một lệnh `curl` không xác thực trả 404 trên một tuyến bạn biết chắc là có nói lên điều gì?',
            options: [
              'The route needs authentication|||Tuyến đó cần xác thực',
              'The running container is not the image you just built — a stale or partial deploy; 401 or 200 would mean the route is mounted|||Container đang chạy KHÔNG phải cái ảnh bạn vừa dựng — một lượt deploy cũ hoặc dở dang; 401 hay 200 mới nghĩa là tuyến đã được gắn',
              'nginx is misconfigured for TLS|||nginx cấu hình TLS sai',
              'The database migration has not run|||Migration của cơ sở dữ liệu chưa chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why must the reverse proxy forward `X-Forwarded-Proto`?|||Vì sao reverse proxy bắt buộc phải chuyển tiếp `X-Forwarded-Proto`?',
            options: [
              'It is required by HTTP/2|||HTTP/2 bắt buộc phải có nó',
              'It lets nginx cache responses correctly|||Nó giúp nginx lưu đệm phản hồi cho đúng',
              'Without it the app believes every request is plain HTTP — redirects downgrade to http:// and secure cookies are never set|||Không có nó thì ứng dụng tin mọi yêu cầu đều là HTTP trần — chuyển hướng tụt về http:// và cookie secure không bao giờ được đặt',
              'It carries the client IP for rate limiting|||Nó mang IP của khách để giới hạn tần suất',
            ],
            correctIndex: 2,
            points: 1,
          },
        ],
      },
    },
  ],
};
