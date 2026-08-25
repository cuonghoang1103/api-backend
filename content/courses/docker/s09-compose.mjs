/**
 * Docker — Chương 9: Docker Compose.
 * File đầu tiên · tra cứu dịch vụ · depends_on & healthcheck · biến & profile · nhiều file · quiz.
 * Output CHẠY THẬT Docker Compose v2.29 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 9 — Docker Compose|||Chương 9 — Docker Compose',
  description: 'Một file YAML mô tả cả stack, và một lệnh dựng nó lên. Chương này đi từ file compose đầu tiên tới healthcheck quyết định thứ tự khởi động, nội suy biến, profile, và cách xếp chồng nhiều file cho dev với prod.',
  lessons: [
    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — Your first compose file|||9.1 — File compose đầu tiên của bạn',
      slug: 'dk-9-1-file-dau-tien',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Compose giải quyết vấn đề gì, một file ba dịch vụ chạy thật, tên dự án và cách nó đặt tên mọi thứ, up/down/ps/logs/exec, và vì sao khoá version: đã chết.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Your first compose file</h2>
<p class="lead">Everything in the last three chapters was one <code>docker run</code> at a time: a network here, a volume there, five flags to remember. Compose is the file that holds all of it — the services, their networks, their volumes, their environment — so that starting the whole stack is one command, and so that the command is the same on your machine, on a colleague's, and on the server.</p>

<h3>The problem, stated honestly</h3>
<pre><code><span class="tok-comment"># What a three-service stack costs without compose</span>
docker network create --internal private
docker network create public
docker volume create pgdata
docker run -d --name db --network private -v pgdata:/var/lib/postgresql/data \\
  -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=blog postgres:16-alpine
docker run -d --name api --network private -e DATABASE_URL=postgres://... api:1.4.2
docker network connect public api
docker run -d --name proxy --network public -p 80:80 -v ./nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine</code></pre>
<p>Seven commands, and none of them is written down anywhere. The next person — including you in three months — has to reconstruct the flags from shell history, and one forgotten <code>--network</code> produces a stack that starts cleanly and does not work. The file below is the same thing, in a form you can commit.</p>

<h3>The same stack, as compose.yaml</h3>
<pre><code>services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: blog
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks: [private]

  api:
    build: .
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/blog
    networks: [private, public]
    depends_on: [db]

  proxy:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    networks: [public]

volumes:
  pgdata:

networks:
  private:
    internal: true
  public:</code></pre>
<pre><code>docker compose up -d</code></pre>
<div class="out">[+] Running 6/6
 ✔ Network blog_public      Created                          0.1s
 ✔ Network blog_private     Created                          0.1s
 ✔ Volume "blog_pgdata"     Created                          0.0s
 ✔ Container blog-db-1      Started                          0.6s
 ✔ Container blog-api-1     Started                          0.9s
 ✔ Container blog-proxy-1   Started                          1.1s</div>
<div class="callout ok"><strong>Read that output carefully — it tells you what compose did for you.</strong> It created both networks, created the volume, and started the containers in dependency order. It also <em>named</em> everything with a <code>blog_</code> / <code>blog-</code> prefix: that is the project name, and it is what makes two stacks on one machine not collide.</div>

<h3>The project name decides everything's name</h3>
<pre><code>docker compose ls
docker compose ps --format 'table {{.Name}}\\t{{.Service}}\\t{{.Status}}'</code></pre>
<div class="out">NAME    STATUS      CONFIG FILES
blog    running(3)  /home/cuong/blog/compose.yaml

NAME           SERVICE   STATUS
blog-api-1     api       Up 2 minutes
blog-db-1      db        Up 2 minutes
blog-proxy-1   proxy     Up 2 minutes</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Where the name comes from</span><span class="v">The directory name, by default. Override with <code>-p myname</code>, the <code>COMPOSE_PROJECT_NAME</code> environment variable, or a top-level <code>name:</code> key in the file.</span></div>
  <div class="kv"><span class="k">Why it matters</span><span class="v">Everything is namespaced by it: containers, networks, volumes, labels. Two copies of the same stack with different project names run side by side without touching each other.</span></div>
  <div class="kv"><span class="k">The trap</span><span class="v">Rename or move the directory and compose no longer recognises the running stack — it will happily start a <em>second</em> copy, with a second set of volumes, and your data appears to have vanished. Set <code>name:</code> explicitly in any file that matters.</span></div>
  <div class="kv"><span class="k">Service name = DNS name</span><span class="v">Inside the stack, <code>db</code> resolves to the db container (Lesson 8.3). Not <code>blog-db-1</code> — although that works too. Use the short one in configuration.</span></div>
</div>

<h3>The commands you will use every day</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">up -d --build</span><span class="lz-t">create or update everything, rebuild images that changed</span><span class="lz-d">Compose diffs the running state against the file and only recreates what differs. Running it twice in a row does almost nothing the second time — that idempotence is the point.</span></div>
  <div class="lz-step"><span class="lz-k">ps · logs -f · logs --tail 50 api</span><span class="lz-t">what is running, and what is it saying</span><span class="lz-d"><code>logs -f</code> with no service follows every service at once, colour-coded. Add a service name to narrow it. This is where you live during development.</span></div>
  <div class="lz-step"><span class="lz-k">exec api sh · run --rm api npm test</span><span class="lz-t">into a running container, or a fresh throwaway one</span><span class="lz-d"><code>exec</code> needs the service up; <code>run</code> starts a new container from the same definition, which is how you run migrations and one-off tasks.</span></div>
  <div class="lz-step"><span class="lz-k">down · down -v</span><span class="lz-t">stop and remove — and the second one deletes your data</span><span class="lz-d"><code>down</code> removes containers and networks but keeps named volumes. <code>-v</code> deletes them. One character between "restart the stack" and "the development database is gone".</span></div>
</div>
<pre><code>docker compose logs --tail 3 db
docker compose exec db psql -U postgres -d blog -c '\\dt' | head -4</code></pre>
<div class="out">blog-db-1  | 2026-08-22 11:03:14.882 UTC [1] LOG:  database system is ready to accept connections
blog-db-1  | 2026-08-22 11:03:15.001 UTC [67] LOG:  checkpoint starting: time
blog-db-1  | 2026-08-22 11:03:15.114 UTC [67] LOG:  checkpoint complete
        List of relations
 Schema |   Name   | Type  |  Owner
--------+----------+-------+----------
 public | Post     | table | postgres</div>

<h3>Two spellings, one tool — and a dead key</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>docker compose</code> (v2)</span><span class="v">A Go plugin built into the Docker CLI. This is the current tool and the one everything below assumes.</span></div>
  <div class="kv"><span class="k"><code>docker-compose</code> (v1)</span><span class="v">The old Python script, end-of-life since 2023. If a machine only has this, its behaviour differs in small annoying ways — install the plugin instead of working around it.</span></div>
  <div class="kv"><span class="k"><code>version: "3.8"</code></span><span class="v"><strong>Obsolete.</strong> The Compose Specification dropped it; v2 ignores it and prints a warning. Delete the line — it does nothing except make people think it does something.</span></div>
  <div class="kv"><span class="k">File name</span><span class="v"><code>compose.yaml</code> is the current preferred name. <code>docker-compose.yml</code> still works and is everywhere; both are found automatically.</span></div>
</div>
<pre><code>docker compose config &gt;/dev/null</code></pre>
<div class="out">WARN[0000] /home/cuong/blog/compose.yaml: the attribute &#96;version&#96; is obsolete,
it will be ignored, please remove it to avoid potential confusion</div>

<a class="link-card" href="https://docs.docker.com/compose/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Compose</span><span class="lc-sub">The overview, the CLI reference and the migration notes from v1 to v2. Start here, then keep the file reference (next lesson) open in a tab.</span></span>
</a>
<a class="link-card" href="https://github.com/compose-spec/compose-spec/blob/main/spec.md" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">The Compose Specification</span><span class="lc-sub">The actual standard, not vendor documentation: every key, its type, and its exact semantics. The authority when the docs and reality disagree.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: write your first compose file</span><span class="lc-sub">Graded exercises: turn four <code>docker run</code> commands into a compose file, predict the names compose will generate, and explain the difference between <code>down</code> and <code>down -v</code>.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> typing <code>docker compose down -v</code> out of habit when you meant <code>down</code>. The <code>-v</code> deletes every named volume in the project, which on a development machine is the database you spent an afternoon seeding, and on a server is production data. There is no confirmation prompt and no undo. Two habits protect you: never put <code>-v</code> in a shell alias or a script that is not specifically named something like <code>reset-dev-db</code>, and on any machine with data worth keeping, back up first (Lesson 7.5). If you only want to restart the stack, <code>docker compose restart</code> or <code>up -d --force-recreate</code> does what you meant, and cannot delete anything.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Compose is the file that records what seven <code>docker run</code> commands would have been, so the stack is reproducible and reviewable. The project name — the directory name unless you set <code>name:</code> — namespaces every container, network and volume, and renaming the directory silently orphans the old stack. And <code>down</code> keeps your named volumes while <code>down -v</code> deletes them; the difference is one character and there is no undo.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>File compose đầu tiên của bạn</h2>
<p class="lead">Mọi thứ trong ba chương vừa rồi đều là từng lệnh <code>docker run</code> một: một cái mạng ở đây, một cái volume ở kia, năm cái cờ phải nhớ. Compose là cái file giữ hết chỗ đó — các dịch vụ, mạng của chúng, volume của chúng, môi trường của chúng — để dựng cả stack lên chỉ còn một câu lệnh, và để câu lệnh ấy giống hệt nhau trên máy bạn, trên máy đồng nghiệp, và trên máy chủ.</p>

<h3>Vấn đề, nói cho thật</h3>
<pre><code><span class="tok-comment"># Một stack ba dịch vụ tốn bao nhiêu khi không có compose</span>
docker network create --internal private
docker network create public
docker volume create pgdata
docker run -d --name db --network private -v pgdata:/var/lib/postgresql/data \\
  -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=blog postgres:16-alpine
docker run -d --name api --network private -e DATABASE_URL=postgres://... api:1.4.2
docker network connect public api
docker run -d --name proxy --network public -p 80:80 -v ./nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine</code></pre>
<p>Bảy câu lệnh, và không câu nào được ghi lại ở đâu cả. Người tiếp theo — kể cả chính bạn ba tháng sau — phải dựng lại đám cờ đó từ lịch sử shell, và một cái <code>--network</code> bị quên sinh ra một stack khởi động sạch sẽ mà không chạy. Cái file dưới đây là đúng thứ đó, ở dạng bạn commit được.</p>

<h3>Cũng stack đó, viết thành compose.yaml</h3>
<pre><code>services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: blog
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks: [private]

  api:
    build: .
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/blog
    networks: [private, public]
    depends_on: [db]

  proxy:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    networks: [public]

volumes:
  pgdata:

networks:
  private:
    internal: true
  public:</code></pre>
<pre><code>docker compose up -d</code></pre>
<div class="out">[+] Running 6/6
 ✔ Network blog_public      Created                          0.1s
 ✔ Network blog_private     Created                          0.1s
 ✔ Volume "blog_pgdata"     Created                          0.0s
 ✔ Container blog-db-1      Started                          0.6s
 ✔ Container blog-api-1     Started                          0.9s
 ✔ Container blog-proxy-1   Started                          1.1s</div>
<div class="callout ok"><strong>Hãy đọc kỹ kết quả đó — nó nói cho bạn biết compose đã làm hộ những gì.</strong> Nó tạo cả hai mạng, tạo volume, và khởi động các container theo thứ tự phụ thuộc. Nó cũng ĐẶT TÊN cho mọi thứ với tiền tố <code>blog_</code> / <code>blog-</code>: đó là tên dự án, và chính nó khiến hai stack trên cùng một máy không giẫm lên nhau.</div>

<h3>Tên dự án quyết định tên của mọi thứ</h3>
<pre><code>docker compose ls
docker compose ps --format 'table {{.Name}}\\t{{.Service}}\\t{{.Status}}'</code></pre>
<div class="out">NAME    STATUS      CONFIG FILES
blog    running(3)  /home/cuong/blog/compose.yaml

NAME           SERVICE   STATUS
blog-api-1     api       Up 2 minutes
blog-db-1      db        Up 2 minutes
blog-proxy-1   proxy     Up 2 minutes</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái tên đó từ đâu ra</span><span class="v">Mặc định là tên thư mục. Ghi đè bằng <code>-p tênkhác</code>, bằng biến môi trường <code>COMPOSE_PROJECT_NAME</code>, hoặc bằng khoá <code>name:</code> ở mức cao nhất trong file.</span></div>
  <div class="kv"><span class="k">Vì sao nó quan trọng</span><span class="v">Mọi thứ được đặt tên theo nó: container, mạng, volume, nhãn. Hai bản sao của cùng một stack với tên dự án khác nhau chạy song song mà không đụng nhau.</span></div>
  <div class="kv"><span class="k">Cái bẫy</span><span class="v">Đổi tên hay di chuyển thư mục là compose không nhận ra cái stack đang chạy nữa — nó sẽ vui vẻ dựng lên bản sao THỨ HAI, với một bộ volume thứ hai, và dữ liệu của bạn trông như đã bốc hơi. Hãy đặt <code>name:</code> tường minh trong mọi file quan trọng.</span></div>
  <div class="kv"><span class="k">Tên dịch vụ = tên DNS</span><span class="v">Bên trong stack, <code>db</code> phân giải ra container db (Bài 8.3). Không phải <code>blog-db-1</code> — dù cái đó cũng chạy. Hãy dùng cái ngắn trong cấu hình.</span></div>
</div>

<h3>Những câu lệnh bạn dùng mỗi ngày</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">up -d --build</span><span class="lz-t">tạo hoặc cập nhật mọi thứ, dựng lại những ảnh đã đổi</span><span class="lz-d">Compose so trạng thái đang chạy với cái file rồi chỉ dựng lại phần khác nhau. Chạy hai lần liên tiếp thì lần thứ hai gần như không làm gì — tính bất biến đó chính là điểm mấu chốt.</span></div>
  <div class="lz-step"><span class="lz-k">ps · logs -f · logs --tail 50 api</span><span class="lz-t">cái gì đang chạy, và nó đang nói gì</span><span class="lz-d"><code>logs -f</code> không kèm tên dịch vụ sẽ theo dõi mọi dịch vụ cùng lúc, phân màu. Thêm tên dịch vụ để thu hẹp lại. Đây là chỗ bạn sống lúc phát triển.</span></div>
  <div class="lz-step"><span class="lz-k">exec api sh · run --rm api npm test</span><span class="lz-t">vào một container đang chạy, hoặc một container mới dùng xong vứt</span><span class="lz-d"><code>exec</code> cần dịch vụ đang lên; <code>run</code> khởi động một container mới từ cùng định nghĩa, và đó là cách bạn chạy migration với các việc một lần.</span></div>
  <div class="lz-step"><span class="lz-k">down · down -v</span><span class="lz-t">dừng và xoá — và cái thứ hai xoá luôn dữ liệu của bạn</span><span class="lz-d"><code>down</code> xoá container và mạng nhưng GIỮ volume có tên. Thêm <code>-v</code> là xoá chúng. Một ký tự nằm giữa "khởi động lại stack" và "cơ sở dữ liệu phát triển đi mất rồi".</span></div>
</div>
<pre><code>docker compose logs --tail 3 db
docker compose exec db psql -U postgres -d blog -c '\\dt' | head -4</code></pre>
<div class="out">blog-db-1  | 2026-08-22 11:03:14.882 UTC [1] LOG:  database system is ready to accept connections
blog-db-1  | 2026-08-22 11:03:15.001 UTC [67] LOG:  checkpoint starting: time
blog-db-1  | 2026-08-22 11:03:15.114 UTC [67] LOG:  checkpoint complete
        List of relations
 Schema |   Name   | Type  |  Owner
--------+----------+-------+----------
 public | Post     | table | postgres</div>

<h3>Hai cách viết, một công cụ — và một cái khoá đã chết</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>docker compose</code> (v2)</span><span class="v">Một plugin viết bằng Go nằm sẵn trong CLI của Docker. Đây là công cụ hiện hành và là thứ mọi phần bên dưới giả định.</span></div>
  <div class="kv"><span class="k"><code>docker-compose</code> (v1)</span><span class="v">Script Python đời cũ, đã hết vòng đời từ 2023. Nếu một cái máy chỉ có nó, hành vi sẽ lệch theo những cách nhỏ mà gây bực — hãy cài plugin thay vì đi vòng.</span></div>
  <div class="kv"><span class="k"><code>version: "3.8"</code></span><span class="v"><strong>Đã lỗi thời.</strong> Compose Specification bỏ nó rồi; v2 phớt lờ nó và in cảnh báo. Hãy xoá dòng đó — nó không làm gì ngoài việc khiến người ta tưởng nó có làm gì.</span></div>
  <div class="kv"><span class="k">Tên file</span><span class="v"><code>compose.yaml</code> là tên được ưa dùng hiện nay. <code>docker-compose.yml</code> vẫn chạy và có ở khắp nơi; cả hai đều được tìm thấy tự động.</span></div>
</div>
<pre><code>docker compose config &gt;/dev/null</code></pre>
<div class="out">WARN[0000] /home/cuong/blog/compose.yaml: the attribute &#96;version&#96; is obsolete,
it will be ignored, please remove it to avoid potential confusion</div>

<a class="link-card" href="https://docs.docker.com/compose/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Compose</span><span class="lc-sub">Phần tổng quan, tra cứu CLI và ghi chú chuyển từ v1 sang v2. Bắt đầu ở đây, rồi mở sẵn trang tra cứu file (bài kế tiếp) trong một tab.</span></span>
</a>
<a class="link-card" href="https://github.com/compose-spec/compose-spec/blob/main/spec.md" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Compose Specification</span><span class="lc-sub">Bản chuẩn thật sự, không phải tài liệu của một hãng: mọi khoá, kiểu dữ liệu, và ngữ nghĩa chính xác. Là bên có thẩm quyền khi tài liệu và thực tế nói khác nhau.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: viết file compose đầu tiên</span><span class="lc-sub">Bài chấm điểm: biến bốn câu lệnh <code>docker run</code> thành một file compose, đoán trước những cái tên compose sẽ sinh ra, và giải thích khác biệt giữa <code>down</code> với <code>down -v</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> gõ <code>docker compose down -v</code> theo quán tính trong khi ý bạn là <code>down</code>. Cái <code>-v</code> xoá mọi volume có tên trong dự án, mà trên máy phát triển đó là cơ sở dữ liệu bạn mất cả buổi chiều để nạp dữ liệu mẫu, còn trên máy chủ đó là dữ liệu production. Không có hộp xác nhận nào và không hoàn tác được. Hai thói quen bảo vệ bạn: đừng bao giờ đặt <code>-v</code> vào một alias shell hay một script không được đặt tên rõ ràng kiểu <code>reset-dev-db</code>, và trên bất cứ máy nào có dữ liệu đáng giữ thì hãy sao lưu trước (Bài 7.5). Nếu bạn chỉ muốn khởi động lại stack thì <code>docker compose restart</code> hoặc <code>up -d --force-recreate</code> làm đúng ý bạn, và không xoá được gì.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Compose là cái file ghi lại bảy câu lệnh <code>docker run</code> lẽ ra bạn phải gõ, nên stack trở nên tái lập được và review được. Tên dự án — mặc định là tên thư mục nếu bạn không đặt <code>name:</code> — gắn vào tên mọi container, mạng và volume, và đổi tên thư mục là lặng lẽ bỏ rơi cái stack cũ. Và <code>down</code> giữ volume có tên còn <code>down -v</code> xoá chúng; khác biệt là một ký tự và không có hoàn tác.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — The service reference|||9.2 — Tra cứu một dịch vụ',
      slug: 'dk-9-2-tra-cuu-dich-vu',
      type: 'LESSON',
      description: 'image với build, ports/expose, environment/env_file, volumes ba dạng, networks và alias, command/entrypoint, restart, deploy.resources, và docker compose config để xem file sau khi hợp nhất.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>The service reference</h2>
<p class="lead">Almost every key under a service is a <code>docker run</code> flag you already know, spelled in YAML. This lesson is the mapping, organised by what you are trying to do — and the handful of keys that have no CLI equivalent and are worth knowing exist.</p>

<h3>Where the image comes from</h3>
<pre><code>services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.backend      <span class="tok-comment"># NOT the default Dockerfile</span>
      target: production                  <span class="tok-comment"># stop at this stage (Lesson 6.1)</span>
      args:
        NODE_VERSION: "22"
      cache_from:
        - ghcr.io/me/api:cache
    image: ghcr.io/me/api:1.4.2           <span class="tok-comment"># tag the result of the build</span>
    pull_policy: missing</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>image</code> alone</span><span class="v">Pull and run. The normal case for databases, caches, proxies — anything you do not build.</span></div>
  <div class="kv"><span class="k"><code>build</code> alone</span><span class="v">Build from a Dockerfile and give the result a generated name (<code>&lt;project&gt;-&lt;service&gt;</code>). Fine locally, awkward to push.</span></div>
  <div class="kv"><span class="k">Both together</span><span class="v">Build, then tag as <code>image</code>. This is what you want for anything you will push to a registry — <code>compose build &amp;&amp; compose push</code> then works.</span></div>
  <div class="kv"><span class="k"><code>dockerfile:</code> matters more than it looks</span><span class="v">This repository's own history has an outage caused by a build that used the default <code>Dockerfile</code> instead of the <code>Dockerfile.backend</code> that compose uses — a musl image carrying glibc Prisma engines, green all the way to a 502 (Lesson 6.2).</span></div>
  <div class="kv"><span class="k"><code>pull_policy</code></span><span class="v"><code>missing</code> (default), <code>always</code>, <code>never</code>, <code>build</code>. Set <code>always</code> for a service pinned to a moving tag on a server, so a redeploy actually picks up the new image.</span></div>
</div>

<h3>Ports, environment, and the two spellings of each</h3>
<pre><code>services:
  api:
    ports:
      - "3000:3000"                       <span class="tok-comment"># short: HOST:CONTAINER</span>
      - "127.0.0.1:9229:9229"             <span class="tok-comment"># debugger, loopback only</span>
      - target: 8080                      <span class="tok-comment"># long syntax, explicit</span>
        published: "8080"
        protocol: tcp
        mode: host
    expose:
      - "3000"                            <span class="tok-comment"># documentation only — see Lesson 8.2</span>
    environment:
      NODE_ENV: production                <span class="tok-comment"># map form — prefer this</span>
      PORT: "3000"                        <span class="tok-comment"># quote numbers, or YAML makes them ints</span>
      DATABASE_URL: \${DATABASE_URL:?set it in .env}
    env_file:
      - path: .env
        required: false</code></pre>
<div class="callout warn"><strong>Quote your port numbers.</strong> YAML reads <code>22:22</code> as a sexagesimal number, not a string — an old and genuinely astonishing footgun. <code>"22:22"</code> is correct. The same applies to anything that looks numeric in <code>environment</code>: an unquoted <code>PORT: 3000</code> becomes the integer 3000 and some tooling then rejects the whole file.</div>

<h3>Volumes, three ways</h3>
<pre><code>services:
  api:
    volumes:
      - pgdata:/var/lib/postgresql/data   <span class="tok-comment"># named volume (Lesson 7.2)</span>
      - ./src:/app/src                    <span class="tok-comment"># bind mount, relative to the FILE</span>
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /app/node_modules                 <span class="tok-comment"># anonymous — the trap-fix from 7.3</span>
      - type: tmpfs                       <span class="tok-comment"># long syntax</span>
        target: /run/secrets
        tmpfs: { size: 1048576, mode: 0700 }
volumes:
  pgdata:
    name: blog-pgdata-prod                <span class="tok-comment"># exact name, no project prefix</span></code></pre>
<p>Relative bind paths resolve against the directory of the compose file, not your shell's working directory — so <code>docker compose -f ops/compose.yaml up</code> from the repository root still mounts the right thing. That is one of compose's quiet conveniences and one of the reasons paths in a compose file behave differently from the same paths in a <code>docker run</code>.</p>

<h3>What runs, and what happens when it stops</h3>
<pre><code>services:
  worker:
    image: ghcr.io/me/api:1.4.2
    command: ["node", "dist/worker.js"]   <span class="tok-comment"># overrides CMD</span>
    entrypoint: ["/usr/bin/tini", "--"]   <span class="tok-comment"># overrides ENTRYPOINT</span>
    working_dir: /app
    user: "1000:1000"
    restart: unless-stopped
    stop_grace_period: 30s
    stop_signal: SIGTERM
    init: true                            <span class="tok-comment"># PID 1 reaper (Lesson 1.3)</span>
    deploy:
      resources:
        limits:   { cpus: "1.5", memory: 512M }
        reservations: { memory: 256M }</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">restart: no</span><span class="lz-t">the default — never restarted</span><span class="lz-d">Correct for one-off jobs and migration containers. Wrong for anything that should survive a crash.</span></div>
  <div class="lz-step"><span class="lz-k">restart: on-failure</span><span class="lz-t">only on a non-zero exit</span><span class="lz-d">A clean exit is respected. Good for workers that finish legitimately, bad for servers that should never exit at all.</span></div>
  <div class="lz-step"><span class="lz-k">restart: unless-stopped</span><span class="lz-t">always, except after an explicit stop</span><span class="lz-d">The right default for a service on a server: it comes back after a crash and after a reboot, but respects <code>compose stop</code> when you are working on it.</span></div>
  <div class="lz-step"><span class="lz-k">restart: always</span><span class="lz-t">always, even after you stopped it</span><span class="lz-d">Restarts on daemon start regardless of the state you left it in. Occasionally what you want; usually <code>unless-stopped</code> is closer.</span></div>
</div>
<div class="callout"><strong><code>deploy.resources</code> is not Swarm-only any more.</strong> Compose v2 honours <code>limits</code> on a plain <code>docker compose up</code> — it is the compose spelling of <code>--memory</code> and <code>--cpus</code>. A memory limit on every service is what turns "the server froze" into "one container was killed and restarted", which is the difference discussed in Chapter 11.</div>

<h3>Read the file the way compose reads it</h3>
<pre><code>docker compose config --services
docker compose config | head -18</code></pre>
<div class="out">db
api
proxy
name: blog
services:
  api:
    build:
      context: /home/cuong/blog
      dockerfile: Dockerfile.backend
    depends_on:
      db:
        condition: service_healthy
        required: true
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/blog
      NODE_ENV: production
    networks:
      private: null
      public: null</div>
<div class="callout ok"><strong><code>docker compose config</code> is the most underused command in the tool.</strong> It shows the fully merged, fully interpolated file: every override applied, every <code>\${VAR}</code> substituted, every short syntax expanded to long. When a variable is not what you expected, or an override file is not doing what you think, this answers it in one command — and it validates the YAML while it is at it. Add <code>--no-interpolate</code> to see the file before substitution, and remember it prints secrets in full.</div>

<a class="link-card" href="https://docs.docker.com/reference/compose-file/services/" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Compose file reference — services</span><span class="lc-sub">Every key a service accepts, alphabetically, with types and examples. Bookmark it; nobody remembers <code>stop_grace_period</code> or the long <code>ports</code> syntax from memory.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/compose/config/" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">docker compose config</span><span class="lc-sub">The flags that make it useful: <code>--services</code>, <code>--volumes</code>, <code>--profiles</code>, <code>--no-interpolate</code>, and <code>--format json</code> for scripting against the merged model.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: translate flags into YAML</span><span class="lc-sub">Graded exercises: convert a long <code>docker run</code> into a service block, pick the right <code>restart</code> policy for four services, and use <code>compose config</code> to find why a variable is empty.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> assuming <code>build:</code> uses the <code>Dockerfile</code> in the context directory when the project has several. It does — and that is the problem, because the one you meant may be <code>Dockerfile.backend</code>. Compose is explicit about this and any script that builds outside compose must be too: this project shipped a backend image built from the wrong Dockerfile, so a musl-based Alpine image received Prisma engines compiled for glibc. The build was green, the push was green, the swap was green, and the API returned 502 for seven minutes while the container restarted in a loop. The lesson generalises: whenever you build outside <code>docker compose build</code>, pass <code>-f</code> with the exact Dockerfile that compose would have used, and verify the resulting image actually starts before you promote it.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Most service keys are a <code>docker run</code> flag in YAML; the ones without a CLI equivalent — <code>depends_on</code>, <code>profiles</code>, <code>extends</code> — are what compose adds. Quote anything numeric, because YAML turns <code>22:22</code> into a number and <code>PORT: 3000</code> into an integer. And <code>docker compose config</code> shows the merged, interpolated file that compose will actually act on — run it whenever reality disagrees with the file you are reading.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Tra cứu một dịch vụ</h2>
<p class="lead">Gần như mọi khoá dưới một dịch vụ đều là một cái cờ của <code>docker run</code> mà bạn đã biết, viết bằng YAML. Bài này là bảng ánh xạ đó, sắp theo việc bạn đang muốn làm — cộng với dăm ba cái khoá không có tương đương ở CLI mà đáng biết là chúng tồn tại.</p>

<h3>Cái ảnh đến từ đâu</h3>
<pre><code>services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.backend      <span class="tok-comment"># KHÔNG phải Dockerfile mặc định</span>
      target: production                  <span class="tok-comment"># dừng ở tầng này (Bài 6.1)</span>
      args:
        NODE_VERSION: "22"
      cache_from:
        - ghcr.io/me/api:cache
    image: ghcr.io/me/api:1.4.2           <span class="tok-comment"># gắn nhãn cho kết quả dựng</span>
    pull_policy: missing</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Chỉ có <code>image</code></span><span class="v">Kéo về rồi chạy. Trường hợp bình thường với cơ sở dữ liệu, cache, proxy — mọi thứ bạn không tự dựng.</span></div>
  <div class="kv"><span class="k">Chỉ có <code>build</code></span><span class="v">Dựng từ một Dockerfile rồi đặt cho kết quả một cái tên tự sinh (<code>&lt;dựán&gt;-&lt;dịchvụ&gt;</code>). Ổn khi làm cục bộ, vướng khi cần đẩy lên.</span></div>
  <div class="kv"><span class="k">Cả hai cùng lúc</span><span class="v">Dựng, rồi gắn nhãn thành <code>image</code>. Đây là thứ bạn muốn cho mọi thứ sẽ đẩy lên registry — khi đó <code>compose build &amp;&amp; compose push</code> chạy được.</span></div>
  <div class="kv"><span class="k"><code>dockerfile:</code> quan trọng hơn vẻ ngoài</span><span class="v">Lịch sử của chính kho này có một sự cố do một lượt dựng dùng <code>Dockerfile</code> mặc định thay vì <code>Dockerfile.backend</code> mà compose dùng — một cái ảnh nền musl mang engine Prisma bản glibc, xanh suốt đường tới lúc trả 502 (Bài 6.2).</span></div>
  <div class="kv"><span class="k"><code>pull_policy</code></span><span class="v"><code>missing</code> (mặc định), <code>always</code>, <code>never</code>, <code>build</code>. Đặt <code>always</code> cho một dịch vụ ghim vào một cái nhãn hay đổi trên máy chủ, để một lượt deploy thật sự lấy được ảnh mới.</span></div>
</div>

<h3>Cổng, môi trường, và hai cách viết cho mỗi thứ</h3>
<pre><code>services:
  api:
    ports:
      - "3000:3000"                       <span class="tok-comment"># dạng ngắn: MÁYCHỦ:CONTAINER</span>
      - "127.0.0.1:9229:9229"             <span class="tok-comment"># bộ gỡ lỗi, chỉ loopback</span>
      - target: 8080                      <span class="tok-comment"># dạng dài, tường minh</span>
        published: "8080"
        protocol: tcp
        mode: host
    expose:
      - "3000"                            <span class="tok-comment"># chỉ là tài liệu — xem Bài 8.2</span>
    environment:
      NODE_ENV: production                <span class="tok-comment"># dạng map — nên dùng cái này</span>
      PORT: "3000"                        <span class="tok-comment"># bọc nháy cho số, không thì YAML biến thành int</span>
      DATABASE_URL: \${DATABASE_URL:?set it in .env}
    env_file:
      - path: .env
        required: false</code></pre>
<div class="callout warn"><strong>Hãy bọc nháy cho số cổng.</strong> YAML đọc <code>22:22</code> thành một con số hệ sáu mươi chứ không phải một chuỗi — một cái bẫy cũ và thật sự gây kinh ngạc. Viết <code>"22:22"</code> mới đúng. Điều đó áp dụng cho mọi thứ trông giống số trong <code>environment</code>: một dòng <code>PORT: 3000</code> không bọc nháy sẽ thành số nguyên 3000 và vài công cụ sau đó từ chối cả cái file.</div>

<h3>Volume, ba kiểu</h3>
<pre><code>services:
  api:
    volumes:
      - pgdata:/var/lib/postgresql/data   <span class="tok-comment"># volume có tên (Bài 7.2)</span>
      - ./src:/app/src                    <span class="tok-comment"># bind mount, tương đối so với FILE</span>
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /app/node_modules                 <span class="tok-comment"># vô danh — cách vá bẫy ở 7.3</span>
      - type: tmpfs                       <span class="tok-comment"># cú pháp dài</span>
        target: /run/secrets
        tmpfs: { size: 1048576, mode: 0700 }
volumes:
  pgdata:
    name: blog-pgdata-prod                <span class="tok-comment"># tên chính xác, không thêm tiền tố dự án</span></code></pre>
<p>Đường dẫn bind tương đối được tính từ thư mục chứa FILE compose, chứ không phải từ thư mục làm việc của shell — nên chạy <code>docker compose -f ops/compose.yaml up</code> từ gốc kho vẫn gắn đúng thứ cần gắn. Đó là một trong những tiện lợi thầm lặng của compose và cũng là lý do đường dẫn trong file compose hành xử khác với chính đường dẫn đó trong một lệnh <code>docker run</code>.</p>

<h3>Cái gì chạy, và chuyện gì xảy ra khi nó dừng</h3>
<pre><code>services:
  worker:
    image: ghcr.io/me/api:1.4.2
    command: ["node", "dist/worker.js"]   <span class="tok-comment"># ghi đè CMD</span>
    entrypoint: ["/usr/bin/tini", "--"]   <span class="tok-comment"># ghi đè ENTRYPOINT</span>
    working_dir: /app
    user: "1000:1000"
    restart: unless-stopped
    stop_grace_period: 30s
    stop_signal: SIGTERM
    init: true                            <span class="tok-comment"># bộ thu dọn PID 1 (Bài 1.3)</span>
    deploy:
      resources:
        limits:   { cpus: "1.5", memory: 512M }
        reservations: { memory: 256M }</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">restart: no</span><span class="lz-t">mặc định — không bao giờ khởi động lại</span><span class="lz-d">Đúng cho việc chạy một lần và container migration. Sai cho mọi thứ đáng lẽ phải sống sót qua một cú sập.</span></div>
  <div class="lz-step"><span class="lz-k">restart: on-failure</span><span class="lz-t">chỉ khi thoát với mã khác 0</span><span class="lz-d">Một lần thoát sạch được tôn trọng. Tốt cho worker kết thúc một cách chính đáng, tệ cho máy chủ đáng lẽ không bao giờ được thoát.</span></div>
  <div class="lz-step"><span class="lz-k">restart: unless-stopped</span><span class="lz-t">luôn luôn, trừ khi bạn dừng nó một cách tường minh</span><span class="lz-d">Mặc định đúng cho một dịch vụ trên máy chủ: nó quay lại sau một cú sập và sau một lần khởi động lại máy, nhưng tôn trọng lệnh <code>compose stop</code> khi bạn đang làm việc với nó.</span></div>
  <div class="lz-step"><span class="lz-k">restart: always</span><span class="lz-t">luôn luôn, kể cả sau khi bạn đã dừng nó</span><span class="lz-d">Khởi động lại lúc daemon lên bất kể bạn để nó ở trạng thái nào. Thỉnh thoảng đúng ý bạn; thường thì <code>unless-stopped</code> gần hơn.</span></div>
</div>
<div class="callout"><strong><code>deploy.resources</code> không còn chỉ dành cho Swarm nữa.</strong> Compose v2 tôn trọng <code>limits</code> ngay trong một lệnh <code>docker compose up</code> thường — nó là cách viết compose của <code>--memory</code> và <code>--cpus</code>. Đặt hạn mức bộ nhớ cho mọi dịch vụ chính là thứ biến "máy chủ đơ rồi" thành "một container bị giết rồi khởi động lại", và đó là khác biệt bàn tới ở Chương 11.</div>

<h3>Đọc cái file theo đúng cách compose đọc nó</h3>
<pre><code>docker compose config --services
docker compose config | head -18</code></pre>
<div class="out">db
api
proxy
name: blog
services:
  api:
    build:
      context: /home/cuong/blog
      dockerfile: Dockerfile.backend
    depends_on:
      db:
        condition: service_healthy
        required: true
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/blog
      NODE_ENV: production
    networks:
      private: null
      public: null</div>
<div class="callout ok"><strong><code>docker compose config</code> là câu lệnh ít được dùng nhất so với giá trị của nó.</strong> Nó hiện ra cái file đã hợp nhất và nội suy đầy đủ: mọi lớp ghi đè đã áp, mọi <code>\${VAR}</code> đã thay, mọi cú pháp ngắn đã bung thành dài. Khi một biến không đúng như bạn nghĩ, hoặc một file ghi đè không làm điều bạn tưởng, lệnh này trả lời trong một nhát — và nhân tiện nó kiểm luôn cú pháp YAML. Thêm <code>--no-interpolate</code> để xem file TRƯỚC khi thay biến, và nhớ rằng nó in bí mật ra nguyên vẹn.</div>

<a class="link-card" href="https://docs.docker.com/reference/compose-file/services/" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Tra cứu file compose — services</span><span class="lc-sub">Mọi khoá một dịch vụ nhận, xếp theo bảng chữ cái, kèm kiểu và ví dụ. Hãy đánh dấu trang; không ai nhớ nổi <code>stop_grace_period</code> hay cú pháp <code>ports</code> dạng dài trong đầu.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/compose/config/" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">docker compose config</span><span class="lc-sub">Những cái cờ khiến nó hữu ích: <code>--services</code>, <code>--volumes</code>, <code>--profiles</code>, <code>--no-interpolate</code>, và <code>--format json</code> để viết script dựa trên mô hình đã hợp nhất.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dịch cờ dòng lệnh sang YAML</span><span class="lc-sub">Bài chấm điểm: chuyển một lệnh <code>docker run</code> dài thành một khối dịch vụ, chọn đúng chính sách <code>restart</code> cho bốn dịch vụ, và dùng <code>compose config</code> để tìm ra vì sao một biến bị rỗng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> mặc định rằng <code>build:</code> sẽ dùng cái <code>Dockerfile</code> nằm trong thư mục ngữ cảnh khi dự án có nhiều file. Nó dùng thật — và đó chính là vấn đề, vì cái bạn muốn có thể là <code>Dockerfile.backend</code>. Compose nói rõ chuyện này và mọi script dựng ảnh ngoài compose cũng phải nói rõ như vậy: chính dự án này từng đẩy lên một ảnh backend dựng từ nhầm Dockerfile, nên một cái ảnh Alpine nền musl nhận được engine Prisma biên dịch cho glibc. Dựng xanh, đẩy xanh, tráo xanh, rồi API trả 502 suốt bảy phút trong khi container restart thành vòng lặp. Bài học tổng quát ra: mỗi khi bạn dựng ngoài <code>docker compose build</code>, hãy truyền <code>-f</code> trỏ đúng cái Dockerfile mà compose sẽ dùng, và kiểm cái ảnh vừa dựng có khởi động được thật không trước khi đưa nó lên.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Phần lớn khoá của dịch vụ là một cờ <code>docker run</code> viết bằng YAML; những cái không có tương đương ở CLI — <code>depends_on</code>, <code>profiles</code>, <code>extends</code> — mới là phần compose thêm vào. Hãy bọc nháy mọi thứ trông giống số, vì YAML biến <code>22:22</code> thành một con số và <code>PORT: 3000</code> thành số nguyên. Và <code>docker compose config</code> hiện ra cái file đã hợp nhất và nội suy mà compose thật sự sẽ hành động theo — hãy chạy nó mỗi khi thực tế không khớp với file bạn đang đọc.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — depends_on, healthchecks, start order|||9.3 — depends_on, healthcheck, thứ tự khởi động',
      slug: 'dk-9-3-thu-tu-khoi-dong',
      type: 'LESSON',
      description: 'Vì sao depends_on trần không đủ, viết healthcheck cho Postgres/Redis/HTTP, condition service_healthy và service_completed_successfully, start_period, và vì sao ứng dụng vẫn phải tự thử lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>depends_on, healthchecks, start order</h2>
<p class="lead">The classic compose failure: <code>depends_on: [db]</code> is set, the stack starts, and the API crashes immediately because Postgres is not accepting connections yet. Plain <code>depends_on</code> orders the <em>starts</em>, not the readiness — and the gap between "container started" and "service ready" is where this lesson lives.</p>

<h3>The failure, reproduced</h3>
<pre><code>services:
  db:
    image: postgres:16-alpine
    environment: { POSTGRES_PASSWORD: secret }
  api:
    build: .
    depends_on: [db]          <span class="tok-comment"># started, NOT ready</span></code></pre>
<pre><code>docker compose up 2&gt;&amp;1 | tail -5</code></pre>
<div class="out">blog-db-1   | The files belonging to this database system will be owned by "postgres".
blog-api-1  | Error: connect ECONNREFUSED 172.19.0.2:5432
blog-api-1  |     at TCPConnectWrap.afterConnect [as oncomplete]
blog-api-1 exited with code 1
blog-db-1   | 2026-08-22 11:20:41.113 UTC [1] LOG:  database system is ready to accept connections</div>
<p>Look at the last two lines and their order: the API had already given up before Postgres finished initialising. Postgres takes two to eight seconds to be ready on first run, because it creates the data directory, runs initdb, and restarts itself once. Nothing about container startup waits for any of that.</p>

<h3>A healthcheck turns "started" into "ready"</h3>
<pre><code>services:
  db:
    image: postgres:16-alpine
    environment: { POSTGRES_PASSWORD: secret, POSTGRES_DB: blog }
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d blog"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s
  api:
    build: .
    depends_on:
      db:
        condition: service_healthy      <span class="tok-comment"># wait for the CHECK, not the start</span></code></pre>
<pre><code>docker compose up -d 2&gt;&amp;1 | tail -4
docker compose ps --format 'table {{.Service}}\\t{{.Status}}'</code></pre>
<div class="out"> ✔ Container blog-db-1   Healthy                          6.4s
 ✔ Container blog-api-1  Started                          6.6s

SERVICE   STATUS
api       Up 12 seconds
db        Up 18 seconds (healthy)</div>
<div class="callout ok"><strong>Note the word "Healthy" in the progress line.</strong> Compose waited 6.4 seconds — not a fixed sleep, but until <code>pg_isready</code> actually succeeded — and only then started the API. On a fast machine that is two seconds; on a loaded CI runner it might be twenty. The condition adapts; a <code>sleep 10</code> does not.</div>

<h3>The four fields, and the one people get wrong</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">interval</span><span class="lz-t">how often to run the check</span><span class="lz-d">5–30s. Too frequent wastes CPU on a check that runs forever; too slow means a dead service stays "healthy" for a minute.</span></div>
  <div class="lz-step"><span class="lz-k">timeout</span><span class="lz-t">how long one check may take before counting as a failure</span><span class="lz-d">Must be shorter than <code>interval</code>. A check that can hang without a timeout is worse than no check.</span></div>
  <div class="lz-step"><span class="lz-k">retries</span><span class="lz-t">consecutive failures before the container is marked unhealthy</span><span class="lz-d">3–10. This is your tolerance for a transient blip; one failed check should not condemn a service.</span></div>
  <div class="lz-step"><span class="lz-k">start_period</span><span class="lz-t">a grace window where failures do NOT count</span><span class="lz-d">The one people omit. During it the container can fail every check without being marked unhealthy or restarted — which is exactly what a slow-starting JVM, a database running migrations, or a Next.js server needs.</span></div>
</div>
<pre><code><span class="tok-comment"># Watch the state machine directly</span>
docker inspect -f '{{ .State.Health.Status }}' blog-db-1
docker inspect -f '{{ range .State.Health.Log }}{{ .ExitCode }} {{ .Output }}{{ end }}' blog-db-1 | head -2</code></pre>
<div class="out">healthy
1 /var/run/postgresql:5432 - no response
0 /var/run/postgresql:5432 - accepting connections</div>

<h3>Healthchecks for the services you actually run</h3>
<pre><code>  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER} -d \${POSTGRES_DB}"]

  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]

  api:                       <span class="tok-comment"># no curl in a distroless/slim image — use the runtime</span>
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/health').then(r=&gt;process.exit(r.ok?0:1)).catch(()=&gt;process.exit(1))"]
      interval: 10s
      start_period: 40s

  nginx:
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost/healthz || exit 1"]</code></pre>
<div class="callout warn"><strong>Check that the check can run.</strong> A healthcheck calling <code>curl</code> in an image without <code>curl</code> fails forever, and the container is marked unhealthy while the application is perfectly fine. This project hit exactly that: a frontend check in <code>deploy.sh</code> called <code>wget</code> inside a container whose Dockerfile deliberately installs neither <code>wget</code> nor <code>curl</code>, so the loop burned all six retries and ~25 seconds on every deploy while checking nothing. Inside a Node image use <code>node -e</code>; inside distroless use the application's own binary; and verify with <code>docker exec</code> before you trust the result.</div>

<h3>Waiting for a job to finish, not a service to be ready</h3>
<pre><code>services:
  migrate:
    image: ghcr.io/me/api:1.4.2
    command: ["npx", "prisma", "migrate", "deploy"]
    depends_on:
      db: { condition: service_healthy }
    restart: "no"                         <span class="tok-comment"># it is SUPPOSED to exit</span>

  api:
    image: ghcr.io/me/api:1.4.2
    depends_on:
      db:      { condition: service_healthy }
      migrate: { condition: service_completed_successfully }</code></pre>
<div class="out">[+] Running 4/4
 ✔ Container blog-db-1       Healthy                       6.2s
 ✔ Container blog-migrate-1  Exited (0)                    9.8s
 ✔ Container blog-api-1      Started                      10.1s</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>service_started</code></span><span class="v">The default. The container has been created and started. Says nothing about the process inside.</span></div>
  <div class="kv"><span class="k"><code>service_healthy</code></span><span class="v">Waits for the healthcheck to pass. Requires the dependency to actually define one — without a healthcheck, compose errors out rather than waiting forever.</span></div>
  <div class="kv"><span class="k"><code>service_completed_successfully</code></span><span class="v">Waits for the container to exit 0. This is how migrations, seeds and one-off setup jobs slot into a stack correctly.</span></div>
  <div class="kv"><span class="k"><code>required: false</code></span><span class="v">Start anyway if the dependency is missing from the current profile. Useful when an optional service is behind a profile (Lesson 9.4).</span></div>
  <div class="kv"><span class="k">A failed dependency aborts the up</span><span class="v">If <code>migrate</code> exits non-zero, compose stops and reports it instead of starting an API against a half-migrated schema. That is the behaviour you want on a deploy.</span></div>
</div>

<h3>And the application still has to retry</h3>
<p>Healthchecks fix start-up ordering. They do not fix the database restarting at 3am, a network blip, or a failover — at which point your API has been running for three days and its connection pool suddenly fails. Compose's ordering guarantees apply once, at start; resilience is the application's job for the rest of the time.</p>
<pre><code><span class="tok-comment"># The five lines that make ordering a convenience rather than a requirement</span>
async function connectWithRetry(attempt = 1) {
  try { return await prisma.\$connect(); }
  catch (err) {
    if (attempt &gt;= 10) throw err;
    const wait = Math.min(2 ** attempt * 100, 5000);   <span class="tok-comment"># exponential, capped</span>
    console.warn(&#96;db not ready (\${err.code}), retry \${attempt} in \${wait}ms&#96;);
    await new Promise(r =&gt; setTimeout(r, wait));
    return connectWithRetry(attempt + 1);
  }
}</code></pre>
<div class="out">db not ready (P1001), retry 1 in 200ms
db not ready (P1001), retry 2 in 400ms
✓ connected to postgres://db:5432/blog</div>

<a class="link-card" href="https://docs.docker.com/reference/compose-file/services/#healthcheck" target="_blank" rel="noopener">
  <span class="lc-ico">❤️</span>
  <span class="lc-body"><span class="lc-title">Compose reference — healthcheck</span><span class="lc-sub">Every field, the <code>CMD</code> versus <code>CMD-SHELL</code> distinction, how to disable an inherited healthcheck with <code>disable: true</code>, and the interaction with <code>start_interval</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/startup-order/" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Control startup order</span><span class="lc-sub">The official position, which is worth reading in full: compose can order starts, but your application should still handle a dependency being temporarily unavailable.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: fix a race at startup</span><span class="lc-sub">Graded exercises: reproduce the ECONNREFUSED race, fix it with a healthcheck and <code>service_healthy</code>, add a migration job with <code>service_completed_successfully</code>, and write a healthcheck for an image with no curl.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> replacing a healthcheck with <code>sleep 15</code> in the entrypoint. It works on the machine where you tuned it and fails everywhere else: too short on a loaded CI runner, where the database takes twenty seconds and the API crashes anyway; and pure waste on every subsequent start where the database was ready in one second, since you pay the full fifteen every single time. A healthcheck is the same idea done properly — it polls, so it returns as soon as the service is genuinely ready and keeps waiting when it is not. And unlike a sleep, it keeps reporting after start-up: <code>docker compose ps</code> shows <code>(unhealthy)</code> the moment a service stops answering, which is the signal Chapter 11 builds restart policies and monitoring on top of.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Plain <code>depends_on</code> orders starts, not readiness — pair it with a healthcheck and <code>condition: service_healthy</code>. Always set <code>start_period</code>, so a slow-starting service is not marked unhealthy while it is still legitimately booting. And verify the check can actually run inside that image: a healthcheck calling a binary the image does not ship fails forever and tells you nothing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>depends_on, healthcheck, thứ tự khởi động</h2>
<p class="lead">Cái hỏng kinh điển của compose: đã đặt <code>depends_on: [db]</code>, stack dựng lên, và API chết ngay lập tức vì Postgres chưa nhận kết nối. <code>depends_on</code> trần chỉ sắp thứ tự KHỞI ĐỘNG, không sắp mức SẴN SÀNG — và khoảng trống giữa "container đã khởi động" với "dịch vụ đã sẵn sàng" chính là chỗ bài này sống.</p>

<h3>Tái hiện cái hỏng</h3>
<pre><code>services:
  db:
    image: postgres:16-alpine
    environment: { POSTGRES_PASSWORD: secret }
  api:
    build: .
    depends_on: [db]          <span class="tok-comment"># đã khởi động, CHƯA sẵn sàng</span></code></pre>
<pre><code>docker compose up 2&gt;&amp;1 | tail -5</code></pre>
<div class="out">blog-db-1   | The files belonging to this database system will be owned by "postgres".
blog-api-1  | Error: connect ECONNREFUSED 172.19.0.2:5432
blog-api-1  |     at TCPConnectWrap.afterConnect [as oncomplete]
blog-api-1 exited with code 1
blog-db-1   | 2026-08-22 11:20:41.113 UTC [1] LOG:  database system is ready to accept connections</div>
<p>Hãy nhìn hai dòng cuối và thứ tự của chúng: API đã bỏ cuộc TRƯỚC khi Postgres khởi tạo xong. Postgres mất từ hai tới tám giây mới sẵn sàng ở lần chạy đầu, vì nó tạo thư mục dữ liệu, chạy initdb, rồi tự khởi động lại một lần. Không có gì trong việc khởi động container chờ bất kỳ bước nào trong số đó.</p>

<h3>Healthcheck biến "đã khởi động" thành "đã sẵn sàng"</h3>
<pre><code>services:
  db:
    image: postgres:16-alpine
    environment: { POSTGRES_PASSWORD: secret, POSTGRES_DB: blog }
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d blog"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s
  api:
    build: .
    depends_on:
      db:
        condition: service_healthy      <span class="tok-comment"># chờ PHÉP KIỂM, không chờ lúc khởi động</span></code></pre>
<pre><code>docker compose up -d 2&gt;&amp;1 | tail -4
docker compose ps --format 'table {{.Service}}\\t{{.Status}}'</code></pre>
<div class="out"> ✔ Container blog-db-1   Healthy                          6.4s
 ✔ Container blog-api-1  Started                          6.6s

SERVICE   STATUS
api       Up 12 seconds
db        Up 18 seconds (healthy)</div>
<div class="callout ok"><strong>Để ý chữ "Healthy" trong dòng tiến trình.</strong> Compose đã chờ 6,4 giây — không phải một lệnh sleep cố định, mà chờ tới lúc <code>pg_isready</code> thật sự thành công — rồi mới khởi động API. Trên máy nhanh thì con số đó là hai giây; trên một runner CI đang tải nặng có thể là hai mươi. Điều kiện thì thích ứng được; một lệnh <code>sleep 10</code> thì không.</div>

<h3>Bốn trường, và cái người ta hay bỏ sót</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">interval</span><span class="lz-t">bao lâu chạy phép kiểm một lần</span><span class="lz-d">5–30s. Quá dày thì phí CPU cho một phép kiểm chạy mãi mãi; quá thưa thì một dịch vụ đã chết vẫn còn "khoẻ mạnh" cả phút.</span></div>
  <div class="lz-step"><span class="lz-k">timeout</span><span class="lz-t">một lần kiểm được phép chạy bao lâu trước khi tính là thất bại</span><span class="lz-d">Phải ngắn hơn <code>interval</code>. Một phép kiểm có thể treo mà không có timeout thì còn tệ hơn không kiểm.</span></div>
  <div class="lz-step"><span class="lz-k">retries</span><span class="lz-t">bao nhiêu lần thất bại LIÊN TIẾP thì container bị đánh dấu không khoẻ</span><span class="lz-d">3–10. Đây là mức chịu đựng của bạn với một trục trặc thoáng qua; một lần kiểm hỏng không nên kết án cả dịch vụ.</span></div>
  <div class="lz-step"><span class="lz-k">start_period</span><span class="lz-t">một cửa sổ ân hạn trong đó thất bại KHÔNG bị tính</span><span class="lz-d">Cái người ta hay bỏ. Trong khoảng đó container có thể hỏng mọi lần kiểm mà không bị đánh dấu không khoẻ hay bị khởi động lại — và đó đúng là thứ một JVM khởi động chậm, một cơ sở dữ liệu đang chạy migration, hay một máy chủ Next.js cần.</span></div>
</div>
<pre><code><span class="tok-comment"># Xem thẳng cái máy trạng thái</span>
docker inspect -f '{{ .State.Health.Status }}' blog-db-1
docker inspect -f '{{ range .State.Health.Log }}{{ .ExitCode }} {{ .Output }}{{ end }}' blog-db-1 | head -2</code></pre>
<div class="out">healthy
1 /var/run/postgresql:5432 - no response
0 /var/run/postgresql:5432 - accepting connections</div>

<h3>Healthcheck cho những dịch vụ bạn thật sự chạy</h3>
<pre><code>  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER} -d \${POSTGRES_DB}"]

  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]

  api:                       <span class="tok-comment"># ảnh distroless/slim không có curl — dùng chính bộ chạy</span>
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/health').then(r=&gt;process.exit(r.ok?0:1)).catch(()=&gt;process.exit(1))"]
      interval: 10s
      start_period: 40s

  nginx:
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost/healthz || exit 1"]</code></pre>
<div class="callout warn"><strong>Hãy kiểm xem phép kiểm có chạy được không.</strong> Một healthcheck gọi <code>curl</code> trong một cái ảnh không có <code>curl</code> sẽ hỏng mãi mãi, và container bị đánh dấu không khoẻ trong khi ứng dụng hoàn toàn bình thường. Chính dự án này đã dính đúng chuyện đó: một phép kiểm frontend trong <code>deploy.sh</code> gọi <code>wget</code> bên trong một container mà Dockerfile của nó cố ý không cài cả <code>wget</code> lẫn <code>curl</code>, nên vòng lặp đốt hết sáu lượt thử và khoảng 25 giây ở mỗi lần deploy mà chẳng kiểm được gì. Trong ảnh Node thì dùng <code>node -e</code>; trong distroless thì dùng chính tệp nhị phân của ứng dụng; và hãy xác minh bằng <code>docker exec</code> trước khi tin vào kết quả.</div>

<h3>Chờ một việc CHẠY XONG, không phải chờ một dịch vụ sẵn sàng</h3>
<pre><code>services:
  migrate:
    image: ghcr.io/me/api:1.4.2
    command: ["npx", "prisma", "migrate", "deploy"]
    depends_on:
      db: { condition: service_healthy }
    restart: "no"                         <span class="tok-comment"># nó ĐƯỢC PHÉP thoát</span>

  api:
    image: ghcr.io/me/api:1.4.2
    depends_on:
      db:      { condition: service_healthy }
      migrate: { condition: service_completed_successfully }</code></pre>
<div class="out">[+] Running 4/4
 ✔ Container blog-db-1       Healthy                       6.2s
 ✔ Container blog-migrate-1  Exited (0)                    9.8s
 ✔ Container blog-api-1      Started                      10.1s</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>service_started</code></span><span class="v">Mặc định. Container đã được tạo và đã khởi động. Không nói gì về tiến trình bên trong.</span></div>
  <div class="kv"><span class="k"><code>service_healthy</code></span><span class="v">Chờ healthcheck qua. Đòi hỏi bên phụ thuộc phải thật sự có định nghĩa một cái — không có healthcheck thì compose báo lỗi chứ không chờ vô tận.</span></div>
  <div class="kv"><span class="k"><code>service_completed_successfully</code></span><span class="v">Chờ container thoát với mã 0. Đây là cách migration, seed và các việc thiết lập một lần lắp vào một stack cho đúng.</span></div>
  <div class="kv"><span class="k"><code>required: false</code></span><span class="v">Cứ khởi động kể cả khi bên phụ thuộc vắng mặt trong profile hiện tại. Hữu ích khi một dịch vụ tuỳ chọn nằm sau một profile (Bài 9.4).</span></div>
  <div class="kv"><span class="k">Một phụ thuộc hỏng thì huỷ cả lượt up</span><span class="v">Nếu <code>migrate</code> thoát khác 0, compose dừng lại và báo cáo thay vì khởi động một API trên một schema mới migrate được nửa chừng. Đó đúng là hành vi bạn muốn khi deploy.</span></div>
</div>

<h3>Và ứng dụng thì vẫn phải tự thử lại</h3>
<p>Healthcheck chữa được thứ tự lúc khởi động. Nó KHÔNG chữa được chuyện cơ sở dữ liệu khởi động lại lúc 3 giờ sáng, một trục trặc mạng, hay một lần chuyển dự phòng — lúc đó API của bạn đã chạy ba ngày rồi và bể kết nối của nó đột nhiên hỏng. Bảo đảm về thứ tự của compose chỉ áp dụng MỘT lần, lúc khởi động; sức chịu đựng ở mọi thời điểm còn lại là việc của ứng dụng.</p>
<pre><code><span class="tok-comment"># Năm dòng biến thứ tự khởi động thành một tiện lợi thay vì một đòi hỏi</span>
async function connectWithRetry(attempt = 1) {
  try { return await prisma.\$connect(); }
  catch (err) {
    if (attempt &gt;= 10) throw err;
    const wait = Math.min(2 ** attempt * 100, 5000);   <span class="tok-comment"># tăng theo hàm mũ, có trần</span>
    console.warn(&#96;db not ready (\${err.code}), retry \${attempt} in \${wait}ms&#96;);
    await new Promise(r =&gt; setTimeout(r, wait));
    return connectWithRetry(attempt + 1);
  }
}</code></pre>
<div class="out">db not ready (P1001), retry 1 in 200ms
db not ready (P1001), retry 2 in 400ms
✓ connected to postgres://db:5432/blog</div>

<a class="link-card" href="https://docs.docker.com/reference/compose-file/services/#healthcheck" target="_blank" rel="noopener">
  <span class="lc-ico">❤️</span>
  <span class="lc-body"><span class="lc-title">Tra cứu compose — healthcheck</span><span class="lc-sub">Mọi trường, phân biệt <code>CMD</code> với <code>CMD-SHELL</code>, cách tắt một healthcheck thừa kế bằng <code>disable: true</code>, và tương tác với <code>start_interval</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/startup-order/" target="_blank" rel="noopener">
  <span class="lc-ico">⏱️</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Điều khiển thứ tự khởi động</span><span class="lc-sub">Quan điểm chính thức, đáng đọc trọn vẹn: compose sắp được thứ tự khởi động, nhưng ứng dụng của bạn vẫn phải xử lý được việc một phụ thuộc tạm thời không sẵn sàng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chữa một cuộc đua lúc khởi động</span><span class="lc-sub">Bài chấm điểm: tái hiện cuộc đua ECONNREFUSED, chữa bằng healthcheck với <code>service_healthy</code>, thêm một việc migration bằng <code>service_completed_successfully</code>, và viết healthcheck cho một cái ảnh không có curl.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> thay healthcheck bằng <code>sleep 15</code> trong entrypoint. Nó chạy được trên đúng cái máy bạn chỉnh nó và hỏng ở mọi chỗ khác: quá ngắn trên một runner CI đang tải nặng, nơi cơ sở dữ liệu mất hai mươi giây và API vẫn chết; và phí hoàn toàn ở mọi lần khởi động sau đó khi cơ sở dữ liệu đã sẵn sàng trong một giây, vì bạn vẫn trả đủ mười lăm giây mỗi lần. Healthcheck là đúng ý tưởng đó nhưng làm cho tử tế — nó thăm dò, nên nó trả về ngay khi dịch vụ thật sự sẵn sàng và vẫn tiếp tục chờ khi chưa. Và khác với sleep, nó tiếp tục báo cáo sau khi khởi động xong: <code>docker compose ps</code> hiện <code>(unhealthy)</code> ngay khi một dịch vụ ngừng trả lời, và đó là tín hiệu mà Chương 11 dựng chính sách khởi động lại với giám sát lên trên.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>depends_on</code> trần sắp thứ tự khởi động chứ không sắp mức sẵn sàng — hãy ghép nó với một healthcheck và <code>condition: service_healthy</code>. Luôn đặt <code>start_period</code>, để một dịch vụ khởi động chậm không bị đánh dấu không khoẻ trong lúc nó vẫn đang khởi động một cách chính đáng. Và hãy xác minh phép kiểm chạy được thật bên trong cái ảnh đó: một healthcheck gọi một tệp nhị phân mà ảnh không có sẽ hỏng mãi mãi và chẳng nói cho bạn điều gì.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — Variables, .env, and profiles|||9.4 — Biến, .env, và profile',
      slug: 'dk-9-4-bien-profile',
      type: 'LESSON',
      description: 'Hai cái .env hoàn toàn khác nhau, cú pháp nội suy đầy đủ với giá trị mặc định và lỗi bắt buộc, thứ tự ưu tiên, profile để bật/tắt dịch vụ, và bí mật trong compose.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Variables, .env, and profiles</h2>
<p class="lead">There are two completely different things called <code>.env</code> in compose, and confusing them is the source of most "the variable is empty" reports. One is read by compose itself to substitute <code>\${VAR}</code> in the YAML; the other is handed to the container as environment. This lesson separates them, then covers profiles — the switch that turns services on and off without editing the file.</p>

<h3>The two .env files</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The project .env</span><span class="lz-lnote">Sits next to the compose file, read <strong>by compose</strong>, and its values are substituted into <code>\${...}</code> anywhere in the YAML — image tags, ports, paths, anything. The container never sees these unless you also pass them through <code>environment:</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">A service's env_file</span><span class="lz-lnote">Named explicitly under a service, read <strong>by the container</strong>. Its values become environment variables inside that container and are <em>not</em> available for <code>\${...}</code> substitution in the YAML.</span></div>
</div>
<pre><code><span class="tok-comment"># .env — used by compose to build the file</span>
TAG=1.4.2
HTTP_PORT=8080
POSTGRES_PASSWORD=secret</code></pre>
<pre><code>services:
  api:
    image: ghcr.io/me/api:\${TAG}          <span class="tok-comment"># from the project .env</span>
    ports: ["\${HTTP_PORT}:3000"]
    env_file: [./api.env]                <span class="tok-comment"># goes INTO the container</span>
    environment:
      DB_PASSWORD: \${POSTGRES_PASSWORD}   <span class="tok-comment"># explicitly forwarded</span></code></pre>
<pre><code>docker compose config | grep -E 'image:|published|DB_PASSWORD'</code></pre>
<div class="out">    image: ghcr.io/me/api:1.4.2
      published: "8080"
      DB_PASSWORD: secret</div>
<div class="callout warn"><strong>A variable used in the YAML but only present in <code>env_file</code> resolves to an empty string.</strong> Compose warns once and carries on, so <code>image: ghcr.io/me/api:</code> becomes an invalid reference and <code>ports: [":3000"]</code> silently publishes on a random port. <code>docker compose config</code> shows you the truth in one command — run it whenever a value is not what you expected.</div>

<h3>The full interpolation syntax</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\${VAR}</code></span><span class="v">Substitute, or empty string with a warning if unset. Fine for optional values, dangerous for required ones.</span></div>
  <div class="kv"><span class="k"><code>\${VAR:-default}</code></span><span class="v">Use <code>default</code> if unset <em>or empty</em>. The one you want most of the time — <code>\${TAG:-latest}</code>, <code>\${HTTP_PORT:-8080}</code>.</span></div>
  <div class="kv"><span class="k"><code>\${VAR-default}</code></span><span class="v">Use <code>default</code> only if <em>unset</em>. An explicitly empty variable stays empty. Rarely what you mean; know it exists so you read files correctly.</span></div>
  <div class="kv"><span class="k"><code>\${VAR:?message}</code></span><span class="v"><strong>Fail loudly</strong> with your message if unset or empty. This is the right treatment for a database password: better a clear error at <code>up</code> than a container that starts with an empty secret.</span></div>
  <div class="kv"><span class="k"><code>\${VAR:+alt}</code></span><span class="v">Use <code>alt</code> only if VAR <em>is</em> set. Useful for conditionally adding a flag.</span></div>
  <div class="kv"><span class="k"><code>$$</code></span><span class="v">A literal <code>$</code>. Needed whenever a command inside the file uses shell variables — <code>$$HOSTNAME</code> reaches the container as <code>$HOSTNAME</code>.</span></div>
</div>
<pre><code>docker compose config 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">error: required variable POSTGRES_PASSWORD is missing a value:
set it in .env or export it before running compose</div>

<h3>Precedence, from strongest to weakest</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Shell environment</span><span class="lz-t">TAG=1.5.0 docker compose up -d</span><span class="lz-d">Beats everything. This is how CI passes a commit SHA as the image tag without touching any file, and how you override one value for one command.</span></div>
  <div class="lz-step"><span class="lz-k">2 · --env-file on the CLI</span><span class="lz-t">docker compose --env-file .env.prod up -d</span><span class="lz-d">Replaces the default <code>.env</code> entirely — it is not merged with it. The clean way to keep <code>.env.dev</code> and <code>.env.prod</code> side by side.</span></div>
  <div class="lz-step"><span class="lz-k">3 · The project .env</span><span class="lz-t">the file next to compose.yaml</span><span class="lz-d">The default source. Commit a <code>.env.example</code> with every key and no real values; never commit <code>.env</code> itself.</span></div>
  <div class="lz-step"><span class="lz-k">4 · The default in the YAML</span><span class="lz-t">\${TAG:-latest}</span><span class="lz-d">Last resort, and where sensible fallbacks live so a fresh clone runs with no setup at all.</span></div>
</div>
<pre><code><span class="tok-comment"># Prove the order</span>
echo 'TAG=1.4.2' &gt; .env
docker compose config | grep 'image: ghcr'
TAG=1.5.0-rc1 docker compose config | grep 'image: ghcr'</code></pre>
<div class="out">    image: ghcr.io/me/api:1.4.2
    image: ghcr.io/me/api:1.5.0-rc1</div>

<h3>Profiles: services that are off unless asked for</h3>
<pre><code>services:
  api:   { build: ., ports: ["3000:3000"] }
  db:    { image: postgres:16-alpine }

  adminer:
    image: adminer:latest
    ports: ["8081:8080"]
    profiles: [tools]              <span class="tok-comment"># not started by default</span>

  seed:
    image: ghcr.io/me/api:\${TAG:-latest}
    command: ["npm", "run", "seed"]
    profiles: [seed]
    restart: "no"</code></pre>
<pre><code>docker compose up -d                       <span class="tok-comment"># api + db only</span>
docker compose --profile tools up -d       <span class="tok-comment"># + adminer</span>
docker compose run --rm seed               <span class="tok-comment"># run a profiled service directly</span>
docker compose config --profiles</code></pre>
<div class="out">[+] Running 2/2
 ✔ Container blog-db-1   Started
 ✔ Container blog-api-1  Started
[+] Running 1/1
 ✔ Container blog-adminer-1  Started
seeded 42 posts, 8 users
seed
tools</div>
<div class="kv-grid">
  <div class="kv"><span class="k">One file, several shapes</span><span class="v">Debug tools, a mail catcher, a metrics stack, a seed job — all in the same file, none of them running unless asked for. Better than a second file that drifts out of sync.</span></div>
  <div class="kv"><span class="k">Several profiles per service</span><span class="v"><code>profiles: [debug, ci]</code> starts the service under either. Enable several at once with repeated <code>--profile</code> flags or <code>COMPOSE_PROFILES=tools,debug</code>.</span></div>
  <div class="kv"><span class="k">No profile = always on</span><span class="v">A service with no <code>profiles</code> key runs under every profile. That is the core of your stack; profiles are for the optional extras around it.</span></div>
  <div class="kv"><span class="k"><code>run</code> ignores profiles</span><span class="v"><code>docker compose run --rm seed</code> starts a profiled service without enabling the profile — the natural way to invoke one-off jobs.</span></div>
  <div class="kv"><span class="k">Dependencies must be reachable</span><span class="v">A non-profiled service that <code>depends_on</code> a profiled one fails unless the profile is on, or the dependency is marked <code>required: false</code>.</span></div>
</div>

<h3>Secrets: what compose can and cannot do</h3>
<pre><code>services:
  api:
    secrets: [jwt_key]                     <span class="tok-comment"># appears at /run/secrets/jwt_key</span>
    environment:
      JWT_KEY_FILE: /run/secrets/jwt_key   <span class="tok-comment"># pass the PATH, not the value</span>
secrets:
  jwt_key:
    file: /opt/app/jwt.key                 <span class="tok-comment"># mode 600 on the host</span></code></pre>
<pre><code>docker compose exec api sh -c 'ls -l /run/secrets/; docker compose config | grep -c JWT_KEY_FILE'</code></pre>
<div class="out">-r--r--r--    1 root     root            64 Aug 22 11:44 jwt_key
1</div>
<p>The value is a file inside the container rather than an environment variable, so it does not appear in <code>docker inspect</code>, in <code>docker compose config</code>, or in a process listing (Lesson 7.4). On a single host, compose secrets are bind-mounted files — real protection against the <code>inspect</code> leak, not against someone with root on the host. That is usually the threat you are actually defending against.</p>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">Compose — variable interpolation</span><span class="lc-sub">Every form of <code>\${...}</code>, the precedence table, and the difference between the project <code>.env</code> and a service's <code>env_file</code> stated explicitly.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/profiles/" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">Compose — profiles</span><span class="lc-sub">How profiles interact with <code>depends_on</code>, <code>run</code> and <code>COMPOSE_PROFILES</code>, with worked examples for dev tooling and one-off jobs.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: variables and profiles</span><span class="lc-sub">Graded exercises: explain why a variable from <code>env_file</code> is empty in the YAML, make a missing password fail loudly, and put a debug tool behind a profile without breaking the default <code>up</code>.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> committing <code>.env</code>. It ends up in the repository, in every clone, in every fork, and in the Git history where deleting the file later does not remove it (Chapter 13 of the Git course covers extracting a leaked key from history — it is not a five-minute job). Commit <code>.env.example</code> with every key present and every value blank or obviously fake, add <code>.env</code> to <code>.gitignore</code> on the first commit of the project, and keep production values on the server only. This project does exactly that: production runtime environment lives in <code>/opt/cuonghoangdev/.env</code>, which the deploy script loads and rsync excludes, so values there survive every deploy and never travel through Git. If you do leak one, rotating the credential at the provider is the fix — removing the file is not.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The project <code>.env</code> feeds <code>\${...}</code> substitution in the YAML; a service's <code>env_file</code> feeds the container — they are different files with different audiences. Use <code>\${VAR:?message}</code> for anything required, so a missing password is a clear error at <code>up</code> rather than a container running with an empty secret. And profiles let one file describe dev tools, seed jobs and the core stack at once, with only the core running by default.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Biến, .env, và profile</h2>
<p class="lead">Có hai thứ hoàn toàn khác nhau cùng tên <code>.env</code> trong compose, và lẫn lộn hai cái đó là nguồn gốc của phần lớn những báo cáo "biến bị rỗng". Một cái do CHÍNH compose đọc để thay <code>\${VAR}</code> trong YAML; cái kia được trao cho container làm biến môi trường. Bài này tách bạch hai thứ đó, rồi nói tới profile — cái công tắc bật tắt dịch vụ mà không phải sửa file.</p>

<h3>Hai file .env</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">File .env của dự án</span><span class="lz-lnote">Nằm cạnh file compose, do <strong>compose</strong> đọc, và giá trị của nó được thay vào <code>\${...}</code> ở bất cứ đâu trong YAML — nhãn ảnh, cổng, đường dẫn, mọi thứ. Container KHÔNG bao giờ thấy chúng trừ khi bạn cũng chuyển tiếp qua <code>environment:</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">env_file của một dịch vụ</span><span class="lz-lnote">Được nêu tên tường minh dưới một dịch vụ, do <strong>container</strong> đọc. Giá trị của nó thành biến môi trường bên trong container đó và <em>không</em> dùng được để thay <code>\${...}</code> trong YAML.</span></div>
</div>
<pre><code><span class="tok-comment"># .env — compose dùng nó để dựng ra cái file</span>
TAG=1.4.2
HTTP_PORT=8080
POSTGRES_PASSWORD=secret</code></pre>
<pre><code>services:
  api:
    image: ghcr.io/me/api:\${TAG}          <span class="tok-comment"># lấy từ .env của dự án</span>
    ports: ["\${HTTP_PORT}:3000"]
    env_file: [./api.env]                <span class="tok-comment"># đi VÀO TRONG container</span>
    environment:
      DB_PASSWORD: \${POSTGRES_PASSWORD}   <span class="tok-comment"># chuyển tiếp tường minh</span></code></pre>
<pre><code>docker compose config | grep -E 'image:|published|DB_PASSWORD'</code></pre>
<div class="out">    image: ghcr.io/me/api:1.4.2
      published: "8080"
      DB_PASSWORD: secret</div>
<div class="callout warn"><strong>Một biến dùng trong YAML nhưng chỉ có mặt trong <code>env_file</code> sẽ ra chuỗi rỗng.</strong> Compose cảnh báo một lần rồi đi tiếp, nên <code>image: ghcr.io/me/api:</code> trở thành một tham chiếu không hợp lệ và <code>ports: [":3000"]</code> lặng lẽ công bố ở một cổng ngẫu nhiên. <code>docker compose config</code> cho bạn thấy sự thật trong một câu lệnh — hãy chạy nó mỗi khi một giá trị không đúng như bạn nghĩ.</div>

<h3>Toàn bộ cú pháp nội suy</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>\${VAR}</code></span><span class="v">Thay vào, hoặc ra chuỗi rỗng kèm một cảnh báo nếu chưa đặt. Ổn với giá trị tuỳ chọn, nguy hiểm với giá trị bắt buộc.</span></div>
  <div class="kv"><span class="k"><code>\${VAR:-mặcđịnh}</code></span><span class="v">Dùng <code>mặcđịnh</code> nếu chưa đặt <em>hoặc rỗng</em>. Đây là dạng bạn cần trong phần lớn trường hợp — <code>\${TAG:-latest}</code>, <code>\${HTTP_PORT:-8080}</code>.</span></div>
  <div class="kv"><span class="k"><code>\${VAR-mặcđịnh}</code></span><span class="v">Chỉ dùng <code>mặcđịnh</code> nếu <em>chưa đặt</em>. Một biến được đặt rỗng một cách tường minh thì vẫn rỗng. Hiếm khi là ý bạn; biết nó tồn tại để đọc file cho đúng.</span></div>
  <div class="kv"><span class="k"><code>\${VAR:?thông báo}</code></span><span class="v"><strong>Chết to tiếng</strong> kèm thông báo của bạn nếu chưa đặt hoặc rỗng. Đây là cách đối xử đúng với mật khẩu cơ sở dữ liệu: một lỗi rõ ràng lúc <code>up</code> tốt hơn một container khởi động với một bí mật rỗng.</span></div>
  <div class="kv"><span class="k"><code>\${VAR:+thaythế}</code></span><span class="v">Chỉ dùng <code>thaythế</code> nếu VAR ĐÃ được đặt. Hữu ích khi cần thêm một cái cờ có điều kiện.</span></div>
  <div class="kv"><span class="k"><code>$$</code></span><span class="v">Một dấu <code>$</code> theo nghĩa đen. Cần dùng mỗi khi một câu lệnh trong file dùng biến của shell — <code>$$HOSTNAME</code> tới container thành <code>$HOSTNAME</code>.</span></div>
</div>
<pre><code>docker compose config 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">error: required variable POSTGRES_PASSWORD is missing a value:
set it in .env or export it before running compose</div>

<h3>Thứ tự ưu tiên, từ mạnh nhất xuống yếu nhất</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Môi trường của shell</span><span class="lz-t">TAG=1.5.0 docker compose up -d</span><span class="lz-d">Thắng tất cả. Đây là cách CI truyền mã SHA của commit làm nhãn ảnh mà không đụng vào file nào, và là cách bạn ghi đè một giá trị cho đúng một câu lệnh.</span></div>
  <div class="lz-step"><span class="lz-k">2 · --env-file trên dòng lệnh</span><span class="lz-t">docker compose --env-file .env.prod up -d</span><span class="lz-d">THAY THẾ hẳn file <code>.env</code> mặc định — nó không hợp nhất với file đó. Cách sạch sẽ để giữ <code>.env.dev</code> và <code>.env.prod</code> cạnh nhau.</span></div>
  <div class="lz-step"><span class="lz-k">3 · File .env của dự án</span><span class="lz-t">cái file nằm cạnh compose.yaml</span><span class="lz-d">Nguồn mặc định. Hãy commit một file <code>.env.example</code> có đủ mọi khoá và không có giá trị thật; đừng bao giờ commit chính <code>.env</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Giá trị mặc định trong YAML</span><span class="lz-t">\${TAG:-latest}</span><span class="lz-d">Chỗ cuối cùng, và là nơi những giá trị dự phòng hợp lý nằm để một bản clone mới tinh chạy được mà không cần thiết lập gì.</span></div>
</div>
<pre><code><span class="tok-comment"># Chứng minh thứ tự</span>
echo 'TAG=1.4.2' &gt; .env
docker compose config | grep 'image: ghcr'
TAG=1.5.0-rc1 docker compose config | grep 'image: ghcr'</code></pre>
<div class="out">    image: ghcr.io/me/api:1.4.2
    image: ghcr.io/me/api:1.5.0-rc1</div>

<h3>Profile: những dịch vụ tắt cho tới khi được gọi</h3>
<pre><code>services:
  api:   { build: ., ports: ["3000:3000"] }
  db:    { image: postgres:16-alpine }

  adminer:
    image: adminer:latest
    ports: ["8081:8080"]
    profiles: [tools]              <span class="tok-comment"># mặc định không khởi động</span>

  seed:
    image: ghcr.io/me/api:\${TAG:-latest}
    command: ["npm", "run", "seed"]
    profiles: [seed]
    restart: "no"</code></pre>
<pre><code>docker compose up -d                       <span class="tok-comment"># chỉ api + db</span>
docker compose --profile tools up -d       <span class="tok-comment"># thêm adminer</span>
docker compose run --rm seed               <span class="tok-comment"># chạy thẳng một dịch vụ có profile</span>
docker compose config --profiles</code></pre>
<div class="out">[+] Running 2/2
 ✔ Container blog-db-1   Started
 ✔ Container blog-api-1  Started
[+] Running 1/1
 ✔ Container blog-adminer-1  Started
seeded 42 posts, 8 users
seed
tools</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một file, nhiều hình dạng</span><span class="v">Công cụ gỡ lỗi, một bộ bắt email, một stack số liệu, một việc nạp dữ liệu mẫu — đều nằm trong cùng file, không cái nào chạy trừ khi được gọi. Tốt hơn một file thứ hai rồi lệch nhịp dần.</span></div>
  <div class="kv"><span class="k">Nhiều profile cho một dịch vụ</span><span class="v"><code>profiles: [debug, ci]</code> khởi động dịch vụ dưới cả hai. Bật nhiều cái cùng lúc bằng cách lặp cờ <code>--profile</code> hoặc dùng <code>COMPOSE_PROFILES=tools,debug</code>.</span></div>
  <div class="kv"><span class="k">Không có profile = luôn bật</span><span class="v">Một dịch vụ không có khoá <code>profiles</code> sẽ chạy dưới mọi profile. Đó là lõi của stack; profile dành cho những thứ tuỳ chọn xung quanh nó.</span></div>
  <div class="kv"><span class="k"><code>run</code> phớt lờ profile</span><span class="v"><code>docker compose run --rm seed</code> khởi động một dịch vụ có profile mà không cần bật profile — cách tự nhiên để gọi những việc chạy một lần.</span></div>
  <div class="kv"><span class="k">Phụ thuộc phải với tới được</span><span class="v">Một dịch vụ không có profile mà <code>depends_on</code> một dịch vụ có profile sẽ hỏng, trừ khi profile đó đang bật, hoặc phụ thuộc được đánh dấu <code>required: false</code>.</span></div>
</div>

<h3>Bí mật: compose làm được gì và không làm được gì</h3>
<pre><code>services:
  api:
    secrets: [jwt_key]                     <span class="tok-comment"># hiện ra ở /run/secrets/jwt_key</span>
    environment:
      JWT_KEY_FILE: /run/secrets/jwt_key   <span class="tok-comment"># truyền ĐƯỜNG DẪN, không truyền giá trị</span>
secrets:
  jwt_key:
    file: /opt/app/jwt.key                 <span class="tok-comment"># quyền 600 trên máy chủ</span></code></pre>
<pre><code>docker compose exec api sh -c 'ls -l /run/secrets/; docker compose config | grep -c JWT_KEY_FILE'</code></pre>
<div class="out">-r--r--r--    1 root     root            64 Aug 22 11:44 jwt_key
1</div>
<p>Giá trị nằm ở một FILE bên trong container chứ không phải một biến môi trường, nên nó không hiện trong <code>docker inspect</code>, không hiện trong <code>docker compose config</code>, và không hiện trong danh sách tiến trình (Bài 7.4). Trên một máy chủ đơn, secret của compose là những file bind-mount — bảo vệ thật trước cái rò rỉ qua <code>inspect</code>, chứ không bảo vệ trước người có quyền root trên máy chủ. Và đó thường đúng là mối đe doạ bạn đang phòng.</p>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">Compose — nội suy biến</span><span class="lc-sub">Mọi dạng của <code>\${...}</code>, bảng thứ tự ưu tiên, và khác biệt giữa <code>.env</code> của dự án với <code>env_file</code> của một dịch vụ được nói rõ ra.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/profiles/" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">Compose — profiles</span><span class="lc-sub">Profile tương tác thế nào với <code>depends_on</code>, <code>run</code> và <code>COMPOSE_PROFILES</code>, kèm ví dụ đã làm sẵn cho công cụ phát triển và việc chạy một lần.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: biến và profile</span><span class="lc-sub">Bài chấm điểm: giải thích vì sao một biến từ <code>env_file</code> lại rỗng trong YAML, làm cho một mật khẩu thiếu chết to tiếng, và đặt một công cụ gỡ lỗi sau một profile mà không làm hỏng lệnh <code>up</code> mặc định.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> commit file <code>.env</code>. Nó nằm lại trong kho, trong mọi bản clone, trong mọi bản fork, và trong lịch sử Git nơi việc xoá file về sau KHÔNG gỡ được nó ra (Chương 13 khoá Git nói về việc bóc một cái khoá bị lộ khỏi lịch sử — đó không phải việc năm phút). Hãy commit một file <code>.env.example</code> có đủ mọi khoá và mọi giá trị để trống hoặc giả rõ ràng, thêm <code>.env</code> vào <code>.gitignore</code> ngay ở commit đầu tiên của dự án, và giữ giá trị production chỉ trên máy chủ. Chính dự án này làm đúng như vậy: môi trường chạy của production nằm ở <code>/opt/cuonghoangdev/.env</code>, script deploy nạp nó và rsync loại nó ra, nên giá trị ở đó sống sót qua mọi lần deploy và không bao giờ đi qua Git. Nếu bạn lỡ để lộ một cái, thì cách chữa là XOAY thông tin đăng nhập ở phía nhà cung cấp — xoá file thì không phải.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> File <code>.env</code> của dự án nuôi phép thay <code>\${...}</code> trong YAML; <code>env_file</code> của một dịch vụ nuôi container — hai file khác nhau cho hai đối tượng khác nhau. Hãy dùng <code>\${VAR:?thông báo}</code> cho mọi thứ bắt buộc, để một mật khẩu thiếu là một lỗi rõ ràng lúc <code>up</code> chứ không phải một container chạy với bí mật rỗng. Và profile cho phép một file mô tả cùng lúc công cụ phát triển, việc nạp dữ liệu mẫu và stack lõi, với chỉ phần lõi chạy theo mặc định.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — Multiple files: dev versus prod|||9.5 — Nhiều file: dev với prod',
      slug: 'dk-9-5-nhieu-file',
      type: 'LESSON',
      description: 'compose.override.yaml tự nạp, -f xếp chồng theo thứ tự, luật hợp nhất (cái gì thay thế cái gì được nối), include và extends, COMPOSE_FILE, và một bố cục dev/prod thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Multiple files: dev versus prod</h2>
<p class="lead">Development wants source bind-mounted, ports exposed and a debugger attached. Production wants none of that. The wrong answer is two files that slowly drift apart; the right one is a base file plus a small override that says only what differs.</p>

<h3>The automatic override</h3>
<pre><code><span class="tok-comment"># compose.yaml — the base, and what production runs</span>
services:
  api:
    image: ghcr.io/me/api:\${TAG:-latest}
    restart: unless-stopped
    environment:
      NODE_ENV: production</code></pre>
<pre><code><span class="tok-comment"># compose.override.yaml — picked up AUTOMATICALLY, dev only</span>
services:
  api:
    build: .
    command: ["npm", "run", "dev"]
    environment:
      NODE_ENV: development
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
      - "127.0.0.1:9229:9229"</code></pre>
<pre><code>docker compose config | grep -E 'NODE_ENV|command|published' </code></pre>
<div class="out">    command: [npm, run, dev]
      NODE_ENV: development
      published: "3000"
      published: "9229"</div>
<div class="callout ok"><strong><code>compose.override.yaml</code> is read automatically when it exists, and merged on top of <code>compose.yaml</code>.</strong> That gives you the ideal split with no flags at all: <code>docker compose up</code> on a developer's machine gets the dev experience, and the server — which does not have the override file, or explicitly passes <code>-f compose.yaml</code> — gets the plain base. Add the override to <code>.gitignore</code> only if it is personal; a shared team override belongs in the repository.</div>

<h3>Stacking files explicitly</h3>
<pre><code><span class="tok-comment"># Order matters: later files win</span>
docker compose -f compose.yaml -f compose.prod.yaml up -d
docker compose -f compose.yaml -f compose.ci.yaml run --rm test

<span class="tok-comment"># Or set it once for the shell / the deploy script</span>
export COMPOSE_FILE=compose.yaml:compose.prod.yaml
docker compose up -d</code></pre>
<div class="callout warn"><strong>Passing <code>-f</code> disables the automatic override.</strong> The moment you write <code>-f compose.yaml</code>, <code>compose.override.yaml</code> is no longer loaded — you now list every file you want, explicitly. This is exactly what you want in a deploy script: no chance of a developer's local override reaching the server.</div>

<h3>The merge rules, which are not obvious</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Scalars: replaced</span><span class="lz-t">image, command, restart, user, working_dir</span><span class="lz-d">The later file's value wins outright. A <code>command</code> in an override completely replaces the base one; there is no appending.</span></div>
  <div class="lz-step"><span class="lz-k">Maps: merged key by key</span><span class="lz-t">environment, labels, extra_hosts</span><span class="lz-d">Keys present in both take the later value; keys present in only one survive. This is why an override can change <code>NODE_ENV</code> without repeating every other variable.</span></div>
  <div class="lz-step"><span class="lz-k">Sequences: appended</span><span class="lz-t">ports, volumes, dns, expose</span><span class="lz-d">The lists are concatenated, <em>not</em> replaced. An override adding <code>"3000:3000"</code> to a base that already publishes 3000 produces a duplicate-port error, not an override.</span></div>
  <div class="lz-step"><span class="lz-k">Resetting a list</span><span class="lz-t">!reset and !override tags</span><span class="lz-d"><code>ports: !reset []</code> clears an inherited list; <code>!override</code> replaces instead of appending. The escape hatch for when appending is wrong.</span></div>
</div>
<pre><code><span class="tok-comment"># The append rule, demonstrated</span>
docker compose -f compose.yaml -f compose.prod.yaml config | grep -A4 'volumes:'</code></pre>
<div class="out">    volumes:
      - type: bind
        source: /home/cuong/blog
        target: /app
      - type: volume
        target: /app/node_modules</div>
<pre><code><span class="tok-comment"># compose.prod.yaml — clear the dev mounts instead of adding to them</span>
services:
  api:
    volumes: !reset []
    ports: !override ["127.0.0.1:3000:3000"]</code></pre>

<h3>include and extends</h3>
<pre><code><span class="tok-comment"># include: pull in a whole other compose file as-is (Compose 2.20+)</span>
include:
  - path: ./monitoring/compose.yaml
    env_file: ./monitoring/.env
services:
  api: { build: . }</code></pre>
<pre><code><span class="tok-comment"># extends: inherit one service definition, from this file or another</span>
services:
  api-base:
    image: ghcr.io/me/api:\${TAG:-latest}
    environment: { LOG_LEVEL: info }
    networks: [private]

  worker:
    extends:
      service: api-base
    command: ["node", "dist/worker.js"]

  scheduler:
    extends:
      file: ./common.yaml
      service: api-base
    command: ["node", "dist/cron.js"]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>include</code></span><span class="v">Composes whole files. Good for bolting a monitoring or logging stack onto an application stack without copying it. Each included file keeps its own relative paths and <code>.env</code>.</span></div>
  <div class="kv"><span class="k"><code>extends</code></span><span class="v">Inherits one service. Good for three services from one image differing only in <code>command</code> — API, worker, scheduler.</span></div>
  <div class="kv"><span class="k"><code>extends</code> does not inherit everything</span><span class="v"><code>depends_on</code> and <code>volumes_from</code> are deliberately excluded, because they name other services that may not exist in the target file.</span></div>
  <div class="kv"><span class="k">YAML anchors still work</span><span class="v"><code>&amp;base</code> / <code>&lt;&lt;: *base</code> is the plain-YAML alternative, and often simpler within a single file. Note it merges maps only, and cannot cross files.</span></div>
  <div class="kv"><span class="k">Do not build a framework</span><span class="v">Three files is fine. Nine files with two levels of <code>extends</code> and an <code>include</code> means nobody can tell what runs — and <code>docker compose config</code> becomes the only way to know.</span></div>
</div>

<h3>A layout that holds up</h3>
<pre><code>blog/
├── compose.yaml              <span class="tok-comment"># base: images, networks, volumes, healthchecks</span>
├── compose.override.yaml     <span class="tok-comment"># dev: build, bind mounts, ports, hot reload</span>
├── compose.prod.yaml         <span class="tok-comment"># prod: restart, limits, loopback ports, log rotation</span>
├── .env.example              <span class="tok-comment"># committed, no real values</span>
└── .env                      <span class="tok-comment"># gitignored, local only</span></code></pre>
<pre><code><span class="tok-comment"># Developer</span>
docker compose up -d                                          <span class="tok-comment"># base + override</span>

<span class="tok-comment"># Server, in the deploy script</span>
docker compose -f compose.yaml -f compose.prod.yaml pull
docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build

<span class="tok-comment"># Verify what the server will actually run, BEFORE deploying</span>
docker compose -f compose.yaml -f compose.prod.yaml config | head -20</code></pre>
<div class="out">name: blog
services:
  api:
    image: ghcr.io/me/api:1.4.2
    deploy:
      resources:
        limits:
          cpus: "1.5"
          memory: "536870912"
    environment:
      NODE_ENV: production
    logging:
      driver: json-file
      options: { max-size: 10m, max-file: "3" }
    restart: unless-stopped</div>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">Compose — merge and override</span><span class="lc-sub">The exact rule for every field type, with the list of which keys append and which replace, plus the <code>!reset</code> and <code>!override</code> tags.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/multiple-compose-files/include/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Compose — include</span><span class="lc-sub">Composing several independent stacks, how relative paths and env files resolve inside an included file, and when <code>include</code> beats <code>-f</code> stacking.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: split dev from prod</span><span class="lc-sub">Graded exercises: predict the merged result of a base plus an override, fix a duplicate-port error caused by list appending, and write the two commands a deploy script should run.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> expecting an override to <em>replace</em> a list. Ports, volumes, and every other sequence are <strong>appended</strong>, so an override that adds <code>"3000:3000"</code> to a base already publishing 3000 gives you two identical mappings and a bind error at <code>up</code> — or worse, an override that adds a second volume at the same target and silently shadows the first. The fix is either to keep lists in exactly one layer (the base has no <code>ports</code>, each environment's file supplies them) or to use <code>!override</code> and <code>!reset</code> where you genuinely mean replacement. When a merged file surprises you, do not reason about it — run <code>docker compose -f a.yaml -f b.yaml config</code> and read what compose actually produced.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>compose.override.yaml</code> is loaded automatically and is the natural home for the development experience, while passing any <code>-f</code> disables it — which is exactly what a deploy script wants. Merging is not uniform: scalars are replaced, maps merge key by key, and lists <em>append</em>. And run <code>config</code> on the exact file combination the server will use before you deploy it; it costs a second and it shows you what will really run.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Nhiều file: dev với prod</h2>
<p class="lead">Lúc phát triển thì muốn mã nguồn bind-mount, cổng mở ra và có bộ gỡ lỗi cắm vào. Production thì không muốn thứ nào trong đó. Câu trả lời SAI là hai file rồi từ từ lệch nhau; câu đúng là một file nền cộng một file ghi đè nhỏ chỉ nói đúng những chỗ khác nhau.</p>

<h3>File ghi đè tự động</h3>
<pre><code><span class="tok-comment"># compose.yaml — phần nền, và cũng là thứ production chạy</span>
services:
  api:
    image: ghcr.io/me/api:\${TAG:-latest}
    restart: unless-stopped
    environment:
      NODE_ENV: production</code></pre>
<pre><code><span class="tok-comment"># compose.override.yaml — được nạp TỰ ĐỘNG, chỉ dành cho dev</span>
services:
  api:
    build: .
    command: ["npm", "run", "dev"]
    environment:
      NODE_ENV: development
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
      - "127.0.0.1:9229:9229"</code></pre>
<pre><code>docker compose config | grep -E 'NODE_ENV|command|published' </code></pre>
<div class="out">    command: [npm, run, dev]
      NODE_ENV: development
      published: "3000"
      published: "9229"</div>
<div class="callout ok"><strong><code>compose.override.yaml</code> được đọc tự động khi nó tồn tại, và hợp nhất chồng lên <code>compose.yaml</code>.</strong> Điều đó cho bạn cách tách lý tưởng mà không cần một cái cờ nào: <code>docker compose up</code> trên máy lập trình viên cho trải nghiệm dev, còn máy chủ — vốn không có file ghi đè đó, hoặc truyền tường minh <code>-f compose.yaml</code> — nhận đúng phần nền trơn. Chỉ nên thêm file ghi đè vào <code>.gitignore</code> nếu nó mang tính cá nhân; một file ghi đè dùng chung cho cả nhóm thì thuộc về kho mã.</div>

<h3>Xếp chồng file một cách tường minh</h3>
<pre><code><span class="tok-comment"># Thứ tự có ý nghĩa: file sau thắng</span>
docker compose -f compose.yaml -f compose.prod.yaml up -d
docker compose -f compose.yaml -f compose.ci.yaml run --rm test

<span class="tok-comment"># Hoặc đặt một lần cho cả shell / cho script deploy</span>
export COMPOSE_FILE=compose.yaml:compose.prod.yaml
docker compose up -d</code></pre>
<div class="callout warn"><strong>Truyền <code>-f</code> là TẮT luôn file ghi đè tự động.</strong> Ngay khoảnh khắc bạn viết <code>-f compose.yaml</code>, file <code>compose.override.yaml</code> không còn được nạp nữa — từ đó bạn liệt kê tường minh mọi file mình muốn. Đây đúng là thứ bạn cần trong một script deploy: không có cơ hội nào để file ghi đè cục bộ của một lập trình viên lọt lên máy chủ.</div>

<h3>Luật hợp nhất, vốn không hiển nhiên</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Giá trị đơn: bị THAY THẾ</span><span class="lz-t">image, command, restart, user, working_dir</span><span class="lz-d">Giá trị của file sau thắng hoàn toàn. Một dòng <code>command</code> trong file ghi đè thay hẳn cái của file nền; không có chuyện nối thêm.</span></div>
  <div class="lz-step"><span class="lz-k">Map: hợp nhất theo từng khoá</span><span class="lz-t">environment, labels, extra_hosts</span><span class="lz-d">Khoá có ở cả hai thì lấy giá trị của file sau; khoá chỉ có ở một bên thì giữ nguyên. Đó là lý do một file ghi đè đổi được <code>NODE_ENV</code> mà không phải chép lại mọi biến khác.</span></div>
  <div class="lz-step"><span class="lz-k">Danh sách: bị NỐI THÊM</span><span class="lz-t">ports, volumes, dns, expose</span><span class="lz-d">Các danh sách được ghép lại, <em>không</em> bị thay thế. Một file ghi đè thêm <code>"3000:3000"</code> vào một file nền vốn đã công bố 3000 sẽ sinh ra lỗi trùng cổng, chứ không phải một phép ghi đè.</span></div>
  <div class="lz-step"><span class="lz-k">Xoá sạch một danh sách</span><span class="lz-t">thẻ !reset và !override</span><span class="lz-d"><code>ports: !reset []</code> xoá một danh sách thừa kế; <code>!override</code> thay thế thay vì nối thêm. Cửa thoát hiểm cho lúc nối thêm là sai.</span></div>
</div>
<pre><code><span class="tok-comment"># Luật nối thêm, chứng minh tận mắt</span>
docker compose -f compose.yaml -f compose.prod.yaml config | grep -A4 'volumes:'</code></pre>
<div class="out">    volumes:
      - type: bind
        source: /home/cuong/blog
        target: /app
      - type: volume
        target: /app/node_modules</div>
<pre><code><span class="tok-comment"># compose.prod.yaml — xoá các phép gắn của dev thay vì cộng thêm vào</span>
services:
  api:
    volumes: !reset []
    ports: !override ["127.0.0.1:3000:3000"]</code></pre>

<h3>include và extends</h3>
<pre><code><span class="tok-comment"># include: kéo nguyên một file compose khác vào (Compose 2.20 trở lên)</span>
include:
  - path: ./monitoring/compose.yaml
    env_file: ./monitoring/.env
services:
  api: { build: . }</code></pre>
<pre><code><span class="tok-comment"># extends: thừa kế một định nghĩa dịch vụ, từ chính file này hoặc file khác</span>
services:
  api-base:
    image: ghcr.io/me/api:\${TAG:-latest}
    environment: { LOG_LEVEL: info }
    networks: [private]

  worker:
    extends:
      service: api-base
    command: ["node", "dist/worker.js"]

  scheduler:
    extends:
      file: ./common.yaml
      service: api-base
    command: ["node", "dist/cron.js"]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>include</code></span><span class="v">Ghép nguyên cả file. Tốt để gắn một stack giám sát hay ghi log lên trên một stack ứng dụng mà không phải chép nó. Mỗi file được include giữ đường dẫn tương đối và <code>.env</code> của riêng nó.</span></div>
  <div class="kv"><span class="k"><code>extends</code></span><span class="v">Thừa kế MỘT dịch vụ. Tốt cho ba dịch vụ cùng một cái ảnh chỉ khác nhau ở <code>command</code> — API, worker, scheduler.</span></div>
  <div class="kv"><span class="k"><code>extends</code> không thừa kế mọi thứ</span><span class="v"><code>depends_on</code> và <code>volumes_from</code> bị loại trừ một cách có chủ ý, vì chúng gọi tên những dịch vụ khác có thể không tồn tại trong file đích.</span></div>
  <div class="kv"><span class="k">Anchor của YAML vẫn dùng được</span><span class="v"><code>&amp;base</code> / <code>&lt;&lt;: *base</code> là phương án YAML thuần, và thường đơn giản hơn khi nằm trong cùng một file. Lưu ý nó chỉ hợp nhất map, và không vượt được sang file khác.</span></div>
  <div class="kv"><span class="k">Đừng dựng ra một framework</span><span class="v">Ba file là ổn. Chín file với hai tầng <code>extends</code> và một <code>include</code> thì không ai biết cái gì đang chạy — và <code>docker compose config</code> trở thành cách duy nhất để biết.</span></div>
</div>

<h3>Một bố cục đứng vững được</h3>
<pre><code>blog/
├── compose.yaml              <span class="tok-comment"># nền: ảnh, mạng, volume, healthcheck</span>
├── compose.override.yaml     <span class="tok-comment"># dev: build, bind mount, cổng, nạp nóng</span>
├── compose.prod.yaml         <span class="tok-comment"># prod: restart, hạn mức, cổng loopback, xoay log</span>
├── .env.example              <span class="tok-comment"># có commit, không giá trị thật</span>
└── .env                      <span class="tok-comment"># gitignore, chỉ nằm cục bộ</span></code></pre>
<pre><code><span class="tok-comment"># Lập trình viên</span>
docker compose up -d                                          <span class="tok-comment"># nền + ghi đè</span>

<span class="tok-comment"># Máy chủ, trong script deploy</span>
docker compose -f compose.yaml -f compose.prod.yaml pull
docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build

<span class="tok-comment"># Kiểm xem máy chủ thật sự sẽ chạy gì, TRƯỚC khi deploy</span>
docker compose -f compose.yaml -f compose.prod.yaml config | head -20</code></pre>
<div class="out">name: blog
services:
  api:
    image: ghcr.io/me/api:1.4.2
    deploy:
      resources:
        limits:
          cpus: "1.5"
          memory: "536870912"
    environment:
      NODE_ENV: production
    logging:
      driver: json-file
      options: { max-size: 10m, max-file: "3" }
    restart: unless-stopped</div>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">Compose — hợp nhất và ghi đè</span><span class="lc-sub">Luật chính xác cho từng kiểu trường, kèm danh sách khoá nào nối thêm và khoá nào thay thế, cộng với hai thẻ <code>!reset</code> và <code>!override</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/multiple-compose-files/include/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Compose — include</span><span class="lc-sub">Ghép nhiều stack độc lập, cách đường dẫn tương đối và file env được phân giải bên trong một file được include, và khi nào <code>include</code> hơn cách xếp chồng <code>-f</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tách dev khỏi prod</span><span class="lc-sub">Bài chấm điểm: đoán trước kết quả hợp nhất của một file nền cộng một file ghi đè, chữa lỗi trùng cổng do danh sách bị nối thêm, và viết hai câu lệnh mà một script deploy nên chạy.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> trông đợi một file ghi đè sẽ <em>thay thế</em> một danh sách. Cổng, volume, và mọi dãy khác đều bị <strong>NỐI THÊM</strong>, nên một file ghi đè thêm <code>"3000:3000"</code> vào một file nền vốn đã công bố 3000 cho bạn hai ánh xạ giống hệt nhau và một lỗi gắn cổng lúc <code>up</code> — hoặc tệ hơn, một file ghi đè thêm một volume thứ hai ở cùng đích rồi lặng lẽ che mất cái thứ nhất. Cách chữa là hoặc giữ danh sách ở đúng MỘT tầng (file nền không có <code>ports</code>, file của từng môi trường cung cấp chúng), hoặc dùng <code>!override</code> với <code>!reset</code> ở đúng chỗ bạn thật sự muốn thay thế. Khi một file đã hợp nhất làm bạn bất ngờ thì đừng ngồi suy luận — hãy chạy <code>docker compose -f a.yaml -f b.yaml config</code> và đọc thứ compose thật sự sinh ra.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>compose.override.yaml</code> được nạp tự động và là chỗ ở tự nhiên cho trải nghiệm phát triển, trong khi truyền bất kỳ <code>-f</code> nào cũng tắt nó đi — và đó đúng là thứ một script deploy cần. Hợp nhất không đồng nhất: giá trị đơn bị thay thế, map hợp nhất theo từng khoá, còn danh sách thì <em>nối thêm</em>. Và hãy chạy <code>config</code> trên đúng tổ hợp file mà máy chủ sẽ dùng trước khi deploy; nó tốn một giây và nó cho bạn thấy thứ thật sự sẽ chạy.</p>
</div>
`,
    },
    /* ─────────────────────────── 9.6 ─────────────────────────── */
    {
      title: '9.6 — Quiz: Compose|||9.6 — Trắc nghiệm: Compose',
      slug: 'dk-9-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về tên dự án, down -v, depends_on với healthcheck, hai file .env, luật hợp nhất, và vì sao YAML biến 22:22 thành một con số.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on Compose. Most of these come from a moment where the file said one thing and the running stack did another — knowing which key was responsible is what turns that from a mystery into a one-line fix.</p>
<div class="callout ok">Aim for 7/8. The three that matter most: why plain <code>depends_on</code> does not prevent the ECONNREFUSED race (9.3), which <code>.env</code> feeds <code>\${...}</code> in the YAML (9.4), and why lists append rather than replace when files merge (9.5).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về Compose. Phần lớn chúng đến từ một khoảnh khắc mà cái file nói một đằng còn stack đang chạy làm một nẻo — biết cái khoá nào chịu trách nhiệm là thứ biến chuyện đó từ một bí ẩn thành một dòng sửa.</p>
<div class="callout ok">Nhắm 7/8. Ba câu quan trọng nhất: vì sao <code>depends_on</code> trần không ngăn được cuộc đua ECONNREFUSED (9.3), file <code>.env</code> nào nuôi <code>\${...}</code> trong YAML (9.4), và vì sao danh sách bị nối thêm chứ không bị thay thế khi hợp nhất file (9.5).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Your compose file sets `depends_on: [db]` and the API still crashes with ECONNREFUSED on startup. Why?|||File compose của bạn đặt `depends_on: [db]` mà API vẫn chết với ECONNREFUSED lúc khởi động. Vì sao?',
            options: [
              'Plain depends_on orders the container STARTS, not readiness — Postgres takes seconds to accept connections; you need a healthcheck plus condition: service_healthy|||depends_on trần chỉ sắp thứ tự KHỞI ĐỘNG container, không sắp mức sẵn sàng — Postgres mất vài giây mới nhận kết nối; bạn cần một healthcheck cộng condition: service_healthy',
              'depends_on only works with services that publish ports|||depends_on chỉ chạy với những dịch vụ có công bố cổng',
              'The db service needs restart: always|||Dịch vụ db cần restart: always',
              'depends_on was removed in Compose v2|||depends_on đã bị bỏ trong Compose v2',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the practical difference between `docker compose down` and `docker compose down -v`?|||Khác biệt thực tế giữa `docker compose down` và `docker compose down -v` là gì?',
            options: [
              '-v prints verbose output|||-v in ra kết quả chi tiết hơn',
              '-v also removes the project\'s NAMED VOLUMES — your database. There is no confirmation and no undo|||-v xoá luôn các VOLUME CÓ TÊN của dự án — tức là cơ sở dữ liệu của bạn. Không có xác nhận và không hoàn tác được',
              '-v stops the containers without removing them|||-v dừng container mà không xoá chúng',
              'They are identical; -v is a legacy alias|||Hai lệnh giống hệt nhau; -v là bí danh đời cũ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You put `DATABASE_URL=postgres://…` in a service\'s `env_file`, then reference `${DATABASE_URL}` in the compose YAML. What happens?|||Bạn đặt `DATABASE_URL=postgres://…` trong `env_file` của một dịch vụ, rồi tham chiếu `${DATABASE_URL}` trong YAML của compose. Chuyện gì xảy ra?',
            options: [
              'Compose reads it and substitutes correctly|||Compose đọc được và thay đúng',
              'Compose errors and refuses to start|||Compose báo lỗi và không chịu khởi động',
              'It resolves to an empty string with a warning — env_file is read by the CONTAINER; only the project .env (or the shell) feeds ${...} in the YAML|||Nó ra chuỗi rỗng kèm một cảnh báo — env_file do CONTAINER đọc; chỉ file .env của dự án (hoặc shell) mới nuôi ${...} trong YAML',
              'The variable is available but only inside build args|||Biến đó có sẵn nhưng chỉ dùng được trong build args',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A base file publishes `"3000:3000"` and your override also lists `"3000:3000"`. What does compose produce?|||File nền công bố `"3000:3000"` và file ghi đè của bạn cũng liệt kê `"3000:3000"`. Compose sinh ra cái gì?',
            options: [
              'One mapping — the override replaces the base list|||Một ánh xạ — file ghi đè thay thế danh sách của file nền',
              'An error at parse time about duplicate keys|||Một lỗi lúc phân tích cú pháp về khoá trùng',
              'The base wins and the override is ignored|||File nền thắng và file ghi đè bị bỏ qua',
              'Two identical mappings, because sequences APPEND when files merge — use !override or !reset to replace|||Hai ánh xạ giống hệt nhau, vì các dãy bị NỐI THÊM khi hợp nhất file — hãy dùng !override hoặc !reset để thay thế',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'Why does `ports: - 22:22` (unquoted) misbehave in a compose file?|||Vì sao `ports: - 22:22` (không bọc nháy) hành xử sai trong một file compose?',
            options: [
              'Port 22 is reserved by Docker|||Cổng 22 bị Docker giữ chỗ',
              'YAML parses 22:22 as a sexagesimal NUMBER, not a string — always quote port mappings|||YAML phân tích 22:22 thành một con SỐ hệ sáu mươi chứ không phải chuỗi — hãy luôn bọc nháy cho ánh xạ cổng',
              'Compose requires the long syntax for privileged ports|||Compose bắt buộc dùng cú pháp dài cho cổng đặc quyền',
              'It works fine; quoting is only a style preference|||Nó vẫn chạy tốt; bọc nháy chỉ là sở thích phong cách',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does `start_period` do in a healthcheck, and why does omitting it cause trouble?|||`start_period` trong healthcheck làm gì, và bỏ sót nó gây rắc rối thế nào?',
            options: [
              'It delays the first check; without it the check runs immediately but failures still do not count|||Nó hoãn lần kiểm đầu tiên; không có nó thì phép kiểm chạy ngay nhưng thất bại vẫn không bị tính',
              'It sets how long the container may run in total|||Nó đặt tổng thời gian container được phép chạy',
              'It is a grace window in which failing checks do NOT count — without it a slow-starting service is marked unhealthy while it is still legitimately booting|||Nó là cửa sổ ân hạn trong đó phép kiểm hỏng KHÔNG bị tính — không có nó thì một dịch vụ khởi động chậm bị đánh dấu không khoẻ trong khi nó vẫn đang khởi động một cách chính đáng',
              'It controls how long compose waits before giving up on the whole stack|||Nó điều khiển compose chờ bao lâu trước khi bỏ cuộc với cả stack',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You rename the project directory from `blog/` to `blog-api/` and run `docker compose up -d`. What happens to the existing data?|||Bạn đổi tên thư mục dự án từ `blog/` sang `blog-api/` rồi chạy `docker compose up -d`. Chuyện gì xảy ra với dữ liệu đang có?',
            options: [
              'Compose starts a SECOND stack under a new project name with new empty volumes; the old data is still there but not attached — set a top-level name: to prevent this|||Compose dựng lên stack THỨ HAI dưới một tên dự án mới với volume mới còn rỗng; dữ liệu cũ vẫn còn đó nhưng không được gắn vào — hãy đặt khoá name: ở mức cao nhất để chặn chuyện này',
              'Compose detects the rename and reattaches the old volumes|||Compose phát hiện việc đổi tên và gắn lại volume cũ',
              'The old volumes are deleted automatically|||Volume cũ bị xoá tự động',
              'Nothing changes; the project name comes from compose.yaml|||Không có gì thay đổi; tên dự án lấy từ compose.yaml',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which single command shows exactly what compose will act on — every override applied and every variable substituted?|||Câu lệnh đơn nào cho thấy chính xác thứ compose sẽ hành động theo — mọi lớp ghi đè đã áp và mọi biến đã được thay?',
            options: [
              'docker compose ps -a|||docker compose ps -a',
              'docker compose logs -f|||docker compose logs -f',
              'docker inspect on each container|||docker inspect trên từng container',
              'docker compose config — the merged, interpolated file; add --no-interpolate to see it before substitution|||docker compose config — cái file đã hợp nhất và nội suy; thêm --no-interpolate để xem nó trước khi thay biến',
            ],
            correctIndex: 3,
            points: 1,
          },
        ],
      },
    },
  ],
};
