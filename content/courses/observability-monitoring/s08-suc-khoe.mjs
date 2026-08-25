/**
 * Observability — Chương 8 — Phép kiểm sức khoẻ nói được điều gì đó.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${; < > → &lt; &gt;.
 */
const REF = '?ref=%2Fcourses%2Fobservability-monitoring%2Flearn&reflabel=Observability';

export default {
  title: 'Chapter 8 — Health checks that mean something|||Chương 8 — Phép kiểm sức khoẻ nói được điều gì đó',
  slug: 'obs-ch8-suc-khoe',
  description: 'Bốn loại thăm dò, liveness nói dối, readiness và cửa sổ deploy, kiểm phụ thuộc.',
  sortOrder: 9,
  lessons: [
    {
      title: '8.1 — Four probes, four different questions|||8.1 — Bốn lượt thăm dò, bốn câu hỏi khác nhau',
      slug: 'obs-8-1-bon-luot-tham-do',
      type: 'VIDEO',
      description: 'Kho này có bốn endpoint sức khoẻ, và hai trong số đó giống hệt nhau. Đó không phải sự thừa thãi vô hại.',
      isFreePreview: true,
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Four probes, four different questions</h2>
<p class="lead">Lesson 0.1 opened this course with a health check that returned <code>ok</code> while the site was broken. This chapter is about why that happens, and it starts with a distinction almost every codebase gets wrong — including this one, in a way you can verify in thirty seconds.</p>

<h3>What this repository has</h3>
<pre><code class="language-typescript">// src/index.ts:637
app.get('/health', async (_req, res) =&gt; {
  try {
    await prisma.$queryRaw&#96;SELECT 1&#96;;
    res.json({ status: 'ok', uptime: process.uptime(), database: 'connected', ... });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected', ... });
  }
});

// src/index.ts:659 — "chỉ kiểm tra process còn chạy"
app.get('/health/live', (_req, res) =&gt; res.json({ status: 'ok' }));

// src/index.ts:664 — comment says "kiểm tra DB + cache"
app.get('/health/ready', async (_req, res) =&gt; {
  try {
    await prisma.$queryRaw&#96;SELECT 1&#96;;
    res.json({ status: 'ready', database: 'ok' });
  } catch {
    res.status(503).json({ status: 'not ready', database: 'error' });
  }
});</code></pre>
<p>Read <code>/health</code> and <code>/health/ready</code> side by side: <strong>they run the same query and differ only in the JSON they return.</strong> And the comment on the readiness probe says it checks &quot;DB + cache&quot; — it does not touch Redis. Two facts, both checkable by reading forty lines, and both of which will matter in the next lesson.</p>

<h3>The four questions a probe can answer</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">LIVENESS — &quot;is this process wedged?&quot;</span><span class="lz-lnote">Failing means <strong>restart me</strong>. It must depend on nothing external: if the database is down, restarting your process does not help and makes things worse. <code>/health/live</code> here is correct — unconditional 200.</span></div>
  <div class="lz-layer"><span class="lz-lname">READINESS — &quot;should I get traffic right now?&quot;</span><span class="lz-lnote">Failing means <strong>take me out of the load balancer</strong>, do not restart me. This is where dependency checks belong, because a service that cannot reach Postgres should stop receiving requests but should keep running so it can recover.</span></div>
  <div class="lz-layer"><span class="lz-lname">STARTUP — &quot;have I finished booting?&quot;</span><span class="lz-lnote">Suppresses the other two until the app is up. Without it, a slow start looks like a liveness failure and you get a restart loop that never completes a boot.</span></div>
  <div class="lz-layer"><span class="lz-lname">DEEP / DIAGNOSTIC — &quot;what is the state of everything?&quot;</span><span class="lz-lnote">For humans and dashboards. Checks Redis, R2, the LLM gateway, disk. Never wired to an automatic action, because that is how one slow vendor restarts your whole fleet.</span></div>
</div>

<h3>Why the distinction is not pedantry</h3>
<pre><code>The two failing actions are OPPOSITE:

  liveness fails  → kill the container and start a new one
  readiness fails → stop sending traffic, leave it running

Now consider Postgres being briefly unreachable:

  With a liveness probe that checks the DB:
    · every backend container fails its probe
    · every one is killed and restarted
    · they all reconnect at once, thundering herd
    · Postgres, already struggling, now takes a
      connection storm from every restarting instance
    · restarts fail, the loop continues
    → a 20-second database hiccup becomes a 10-minute
      outage, caused entirely by the health check

  With liveness independent of the DB:
    · containers stay up
    · readiness fails, traffic stops
    · Postgres recovers
    · readiness passes, traffic resumes
    → a 20-second hiccup is a 20-second hiccup</code></pre>
<p>That is the entire reason the two exist separately. A liveness probe that checks a dependency converts every dependency blip into a self-inflicted outage.</p>

<h3>What each one should actually do</h3>
<pre><code class="language-typescript">// LIVENESS — no I/O, no dependencies, no awaits.
// The only correct failure is "the event loop is not turning".
app.get('/health/live', (_req, res) =&gt; {
  res.json({ status: 'ok' });
});

// READINESS — the dependencies you cannot serve a request without.
app.get('/health/ready', async (_req, res) =&gt; {
  const checks = await Promise.allSettled([
    withTimeout(prisma.$queryRaw&#96;SELECT 1&#96;, 2000),
    withTimeout(pingRedis(), 1000),        // ← the comment already claims this
  ]);
  const db = checks[0].status === 'fulfilled';
  const cache = checks[1].status === 'fulfilled';
  // Redis is a CACHE: degraded, not unready. Say so, do not fail on it.
  res.status(db ? 200 : 503).json({
    status: db ? (cache ? 'ready' : 'degraded') : 'not ready',
    database: db ? 'ok' : 'error',
    cache: cache ? 'ok' : 'error',
  });
});</code></pre>
<p>Note the timeouts. A readiness probe with no timeout inherits the dependency's hang: if Postgres accepts the connection and never answers, the probe never answers either, and the orchestrator's own timeout decides what happens — which is a decision you have accidentally delegated.</p>

<h3>The one thing every probe must NOT do</h3>
<pre><code>❌ Authentication. A probe that requires a token fails when
   the token expires, at 3am, for reasons unrelated to health.

❌ Writes. A probe that INSERTs to prove the database works
   writes once every 15 seconds forever, from every instance.
   That is 5,760 rows per day per container of pure noise.

❌ Anything slow. The probe interval here is 15s with a 5s
   timeout. A check that takes 4s leaves no margin, and a
   check that takes 6s marks a healthy service unhealthy.

❌ Cascading. If your readiness calls a downstream service's
   readiness, which calls another, one slow leaf marks the
   whole tree unready. Check what YOU need, not what your
   dependencies need.</code></pre>

<div class="pitfall">
<p><strong>Trap — a health check that returns 200 with <code>{"status": "error"}</code> in the body is invisible to every tool that reads it.</strong> Orchestrators, load balancers and uptime monitors branch on the HTTP <em>status code</em>; almost none of them parse the JSON. So a probe that carefully reports <code>database: 'disconnected'</code> while returning 200 is telling a human something true and telling the machine that everything is fine — traffic keeps arriving at an instance that cannot serve it. This repository gets it right, returning 503 on the failure path, and it is worth checking rather than assuming, because the mistake is easy to make in a refactor and produces no error anywhere. <strong>The status code is the interface; the body is documentation.</strong> Verify with <code>curl -o /dev/null -w "%{http_code}"</code>, not by reading the JSON.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/" target="_blank" rel="noopener">
  <span class="lc-ico">☸️</span>
  <span class="lc-body"><span class="lc-title">Kubernetes — liveness, readiness and startup probes</span><span class="lc-sub">Where this three-way distinction was standardised, including the explicit warning against checking dependencies in a liveness probe.</span></span>
</a>
<a class="link-card dl" href="https://docs.docker.com/reference/dockerfile/#healthcheck" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker — HEALTHCHECK</span><span class="lc-sub">The interval, timeout, retries and start_period options that lesson 8.2 does arithmetic on, and what Docker actually does when a check fails.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Bốn lượt thăm dò, bốn câu hỏi khác nhau</h2>
<p class="lead">Bài 0.1 mở đầu khoá học này bằng một phép kiểm sức khoẻ trả về <code>ok</code> trong khi trang thì hỏng. Chương này nói về vì sao chuyện đó xảy ra, và nó bắt đầu bằng một sự phân biệt mà gần như mọi kho mã đều làm sai — kể cả kho này, theo một cách bạn kiểm lại được trong ba mươi giây.</p>

<h3>Kho này có những gì</h3>
<pre><code class="language-typescript">// src/index.ts:637
app.get('/health', async (_req, res) =&gt; {
  try {
    await prisma.$queryRaw&#96;SELECT 1&#96;;
    res.json({ status: 'ok', uptime: process.uptime(), database: 'connected', ... });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected', ... });
  }
});

// src/index.ts:659 — "chỉ kiểm tra process còn chạy"
app.get('/health/live', (_req, res) =&gt; res.json({ status: 'ok' }));

// src/index.ts:664 — chú thích nói "kiểm tra DB + cache"
app.get('/health/ready', async (_req, res) =&gt; {
  try {
    await prisma.$queryRaw&#96;SELECT 1&#96;;
    res.json({ status: 'ready', database: 'ok' });
  } catch {
    res.status(503).json({ status: 'not ready', database: 'error' });
  }
});</code></pre>
<p>Hãy đọc <code>/health</code> và <code>/health/ready</code> cạnh nhau: <strong>chúng chạy cùng một truy vấn và chỉ khác nhau ở cái JSON trả về.</strong> Và dòng chú thích trên lượt thăm dò sẵn-sàng nói nó kiểm &quot;DB + cache&quot; — nó không đụng tới Redis. Hai sự thật, cả hai đều kiểm lại được bằng cách đọc bốn mươi dòng, và cả hai đều sẽ quan trọng ở bài kế tiếp.</p>

<h3>Bốn câu hỏi mà một lượt thăm dò trả lời được</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">LIVENESS — &quot;tiến trình này có kẹt cứng không?&quot;</span><span class="lz-lnote">Trượt nghĩa là <strong>KHỞI ĐỘNG LẠI TÔI</strong>. Nó phải không phụ thuộc vào bất cứ thứ gì bên ngoài: nếu cơ sở dữ liệu chết thì khởi động lại tiến trình của bạn chẳng giúp gì mà còn làm mọi thứ tệ hơn. <code>/health/live</code> ở đây là đúng — trả 200 vô điều kiện.</span></div>
  <div class="lz-layer"><span class="lz-lname">READINESS — &quot;ngay lúc này tôi có nên nhận lưu lượng không?&quot;</span><span class="lz-lnote">Trượt nghĩa là <strong>RÚT TÔI RA KHỎI bộ cân bằng tải</strong>, đừng khởi động lại tôi. Đây mới là chỗ các phép kiểm phụ thuộc thuộc về, vì một dịch vụ không với tới được Postgres thì nên ngừng nhận request nhưng nên tiếp tục chạy để còn phục hồi được.</span></div>
  <div class="lz-layer"><span class="lz-lname">STARTUP — &quot;tôi khởi động xong chưa?&quot;</span><span class="lz-lnote">Đè hai cái kia lại cho tới khi ứng dụng đứng dậy. Không có nó thì một lần khởi động chậm trông như một cú trượt liveness và bạn nhận được một vòng lặp khởi động lại không bao giờ hoàn tất được một lần boot.</span></div>
  <div class="lz-layer"><span class="lz-lname">SÂU / CHẨN ĐOÁN — &quot;tình trạng của mọi thứ ra sao?&quot;</span><span class="lz-lnote">Dành cho con người và bảng theo dõi. Kiểm Redis, R2, cổng LLM, đĩa. Không bao giờ nối vào một hành động tự động, vì đó là cách một nhà cung cấp chậm khởi động lại cả đội máy của bạn.</span></div>
</div>

<h3>Vì sao sự phân biệt này không phải chuyện câu nệ</h3>
<pre><code>Hai hành động khi trượt là NGƯỢC NHAU:

  liveness trượt  → giết container rồi khởi một cái mới
  readiness trượt → ngừng gửi lưu lượng, cứ để nó chạy

Giờ hãy xét chuyện Postgres tạm thời không với tới được:

  Với một lượt thăm dò liveness CÓ kiểm cơ sở dữ liệu:
    · mọi container backend đều trượt
    · mọi cái đều bị giết rồi khởi động lại
    · chúng cùng kết nối lại một lúc, đàn trâu húc cửa
    · Postgres, vốn đã khó thở, giờ nhận một cơn bão kết nối
      từ mọi thực thể đang khởi động lại
    · các lần khởi động lại thất bại, vòng lặp tiếp diễn
    → một cú nấc 20 giây của cơ sở dữ liệu thành một sự cố
      10 phút, gây ra hoàn toàn bởi phép kiểm sức khoẻ

  Với liveness ĐỘC LẬP với cơ sở dữ liệu:
    · container vẫn đứng
    · readiness trượt, lưu lượng dừng
    · Postgres hồi phục
    · readiness qua, lưu lượng chảy lại
    → một cú nấc 20 giây là một cú nấc 20 giây</code></pre>
<p>Đó là toàn bộ lý do hai cái ấy tồn tại riêng rẽ. Một lượt thăm dò liveness có kiểm một phụ thuộc sẽ biến mọi cái chớp mắt của phụ thuộc thành một sự cố do chính bạn tự gây ra.</p>

<h3>Mỗi cái thật ra nên làm gì</h3>
<pre><code class="language-typescript">// LIVENESS — không I/O, không phụ thuộc, không await.
// Cú trượt đúng đắn duy nhất là "vòng lặp sự kiện không quay nữa".
app.get('/health/live', (_req, res) =&gt; {
  res.json({ status: 'ok' });
});

// READINESS — những phụ thuộc mà thiếu chúng bạn không phục vụ nổi một request.
app.get('/health/ready', async (_req, res) =&gt; {
  const checks = await Promise.allSettled([
    withTimeout(prisma.$queryRaw&#96;SELECT 1&#96;, 2000),
    withTimeout(pingRedis(), 1000),        // ← chú thích vốn đã hứa cái này
  ]);
  const db = checks[0].status === 'fulfilled';
  const cache = checks[1].status === 'fulfilled';
  // Redis là một CACHE: suy giảm, chứ không phải chưa sẵn sàng. Nói ra, đừng trượt vì nó.
  res.status(db ? 200 : 503).json({
    status: db ? (cache ? 'ready' : 'degraded') : 'not ready',
    database: db ? 'ok' : 'error',
    cache: cache ? 'ok' : 'error',
  });
});</code></pre>
<p>Hãy để ý mấy cái ngưỡng thời gian. Một lượt thăm dò sẵn-sàng không có ngưỡng sẽ thừa hưởng luôn cú treo của phụ thuộc: nếu Postgres nhận kết nối rồi không bao giờ trả lời thì lượt thăm dò cũng không bao giờ trả lời, và ngưỡng thời gian của chính bộ điều phối sẽ quyết định chuyện gì xảy ra — một quyết định mà bạn đã vô tình uỷ thác đi.</p>

<h3>Thứ mà mọi lượt thăm dò tuyệt đối KHÔNG được làm</h3>
<pre><code>❌ Xác thực. Một lượt thăm dò đòi token sẽ trượt khi token hết
   hạn, vào 3 giờ sáng, vì những lý do chẳng liên quan tới sức khoẻ.

❌ Ghi dữ liệu. Một lượt thăm dò INSERT để chứng minh cơ sở dữ
   liệu chạy được thì ghi 15 giây một lần, mãi mãi, từ mọi thực
   thể. Đó là 5.760 hàng mỗi ngày mỗi container thuần tiếng ồn.

❌ Bất cứ thứ gì chậm. Chu kỳ thăm dò ở đây là 15s với ngưỡng 5s.
   Một phép kiểm mất 4s thì chẳng còn biên nào, và một phép kiểm
   mất 6s thì đánh dấu một dịch vụ khoẻ mạnh là không khoẻ.

❌ Dây chuyền. Nếu readiness của bạn gọi readiness của một dịch vụ
   hạ nguồn, mà cái đó lại gọi cái nữa, thì một cái lá chậm đánh
   dấu cả cây là chưa sẵn sàng. Hãy kiểm cái BẠN cần, không kiểm
   cái các phụ thuộc của bạn cần.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — một phép kiểm sức khoẻ trả về 200 kèm <code>{"status": "error"}</code> trong phần thân là VÔ HÌNH với mọi công cụ đọc nó.</strong> Bộ điều phối, bộ cân bằng tải và trình theo dõi thời gian sống đều rẽ nhánh theo <em>MÃ TRẠNG THÁI</em> HTTP; gần như không cái nào bóc cái JSON ra. Nên một lượt thăm dò cẩn thận báo <code>database: 'disconnected'</code> trong khi trả về 200 là đang nói cho một CON NGƯỜI một điều đúng và nói cho cái MÁY rằng mọi thứ vẫn ổn — lưu lượng cứ tiếp tục đổ vào một thực thể không phục vụ nổi. Kho này làm đúng, trả 503 ở nhánh hỏng, và điều đó đáng đi kiểm chứ đừng giả định, vì sai lầm này rất dễ mắc trong một lần tái cấu trúc và nó chẳng sinh ra lỗi ở đâu cả. <strong>Mã trạng thái là giao diện; phần thân là tài liệu.</strong> Hãy kiểm bằng <code>curl -o /dev/null -w "%{http_code}"</code>, đừng kiểm bằng cách đọc cái JSON.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/" target="_blank" rel="noopener">
  <span class="lc-ico">☸️</span>
  <span class="lc-body"><span class="lc-title">Kubernetes — thăm dò liveness, readiness và startup</span><span class="lc-sub">Nơi sự phân biệt ba đường này được chuẩn hoá, kèm lời cảnh báo tường minh chống lại việc kiểm phụ thuộc trong một lượt thăm dò liveness.</span></span>
</a>
<a class="link-card dl" href="https://docs.docker.com/reference/dockerfile/#healthcheck" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker — HEALTHCHECK</span><span class="lc-sub">Các tuỳ chọn interval, timeout, retries và start_period mà bài 8.2 đem ra tính toán, và Docker thật sự làm gì khi một phép kiểm trượt.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '8.2 — The liveness probe that restarts a healthy service|||8.2 — Lượt thăm dò liveness khởi động lại một dịch vụ khoẻ mạnh',
      slug: 'obs-8-2-tu-ban-vao-chan',
      type: 'VIDEO',
      description: 'Healthcheck của compose trong kho này trỏ vào /health, endpoint CÓ kiểm cơ sở dữ liệu. Đây là phép tính của cú tự bắn vào chân đó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>The liveness probe that restarts a healthy service</h2>
<p class="lead">Lesson 8.1 established that a liveness probe must not depend on anything external. This lesson checks whether this repository follows its own advice — and does the arithmetic on what happens when it does not.</p>

<h3>The three lines that matter</h3>
<pre><code class="language-yaml"># docker-compose.yml — the backend service
healthcheck:
  test: ["CMD-SHELL", "curl -sf http://localhost:3001/health || exit 1"]
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 30s</code></pre>
<pre><code>Follow the endpoint. From lesson 8.1:

  /health        →  await prisma.$queryRaw&#96;SELECT 1&#96;
                    503 if the database is unreachable

  /health/live   →  res.json({ status: 'ok' })
                    unconditional

Docker's healthcheck — whose ONLY consequence is marking the
container unhealthy, which restarts it under a restart policy —
is pointed at the endpoint that fails when POSTGRES is down.

The endpoint that exists precisely for this purpose,
/health/live, is not used by anything.</code></pre>

<h3>The arithmetic of the failure</h3>
<pre><code>interval 15s × retries 3, with a 5s timeout:

  t=0s    Postgres becomes unreachable (a checkpoint stall,
          a lock, a brief restart — 20 seconds of ordinary
          database life)
  t=0s    healthcheck #1 → SELECT 1 fails → unhealthy 1/3
  t=15s   healthcheck #2 → fails          → unhealthy 2/3
  t=30s   healthcheck #3 → fails          → UNHEALTHY
  t=30s   restart policy kills the container

  t=32s   new container boots
  t=32s   Prisma opens its pool: 9 connections at once
          (lesson 5.4's default)
  t=35s   Postgres, mid-recovery, receives a connection
          storm from every restarting backend

  t=45s   start_period expires; probes resume
  t=45s   still failing → the loop restarts

Meanwhile the actual application was FINE the whole time.
It was answering /health/live in under a millisecond. Nothing
about the Node process was wrong.</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The restart cannot fix the problem</span><span class="lz-d">Postgres is the thing that is unhappy. A fresh Node process has no more ability to reach it than the old one did.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The restart actively makes it worse</span><span class="lz-d">Every restart drops the existing pool and immediately opens nine new connections. Under a database that is already struggling, that is the opposite of what helps.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">In-flight requests are killed too</span><span class="lz-d">The container is stopped, so every request currently being served — including the ones that were succeeding on cached data — becomes a 502.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The evidence disappears with the container</span><span class="lz-d">Lesson 2.1: recreating a container starts a new, empty <code>-json.log</code>. The logs explaining the original database stall are attached to a container that no longer exists.</span></div>
</div>

<h3>The fix is one word</h3>
<pre><code class="language-yaml">healthcheck:
  test: ["CMD-SHELL", "curl -sf http://localhost:3001/health/live || exit 1"]
  #                                                        ^^^^^
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 30s</code></pre>
<pre><code>Now the semantics match the action:

  · Node process wedged, event loop stuck, out of memory
    → /health/live stops answering → restart. Correct: a
      restart is exactly what fixes a wedged process.

  · Postgres unreachable
    → /health/live still answers 200 → no restart. Correct:
      the container stays up, keeps its logs, and reconnects
      when Postgres returns.

The database check does not disappear — it moves to
/health/ready, where the consequence is "stop sending
traffic", which is the right consequence.</code></pre>

<h3>Making liveness mean something</h3>
<pre><code class="language-typescript">// An unconditional 200 catches only "the process is dead".
// A wedged event loop (lesson 5.1) still answers it — the HTTP
// server accepts the connection and the handler runs as soon as
// the loop frees up, which may be after the probe's timeout.
// So make liveness read the number that knows:

import { monitorEventLoopDelay } from 'node:perf_hooks';
const lag = monitorEventLoopDelay({ resolution: 20 });
lag.enable();

app.get('/health/live', (_req, res) =&gt; {
  const p99ms = lag.percentile(99) / 1e6;
  if (p99ms &gt; 5000) {                    // wedged for 5+ seconds
    return res.status(503).json({ status: 'wedged', eventLoopP99Ms: Math.round(p99ms) });
  }
  res.json({ status: 'ok', eventLoopP99Ms: Math.round(p99ms) });
});</code></pre>
<pre><code>Choosing that threshold honestly:

  · Lesson 5.1 measured normal p99 lag at ~1ms and a
    deliberate 200ms block at 201ms.
  · 5000ms is far above anything a healthy service produces,
    and far below "nobody noticed".
  · Too low and a GC pause or a big JSON.parse restarts a
    working container — you have rebuilt the original bug
    with a different dependency.

Set it where a human would say "that process is not coming
back on its own", and nowhere tighter.</code></pre>

<h3>What the other two probes are for here</h3>
<pre><code>/health         → nginx upstream check and external uptime
                  monitoring. It SHOULD check the database:
                  its consequence is "route traffic
                  elsewhere", not "restart".

/health/ready   → identical to /health today (lesson 8.1).
                  Once one of them checks Redis and reports
                  'degraded', they earn separate existence.

Right now three of the four endpoints have the same body and
one has no consumer. That is not a bug that causes an
outage — it is the kind of drift that means nobody can
predict what any of them does during one.</code></pre>

<div class="pitfall">
<p><strong>Trap — <code>restart: unless-stopped</code> plus a dependency-checking liveness probe is a machine for turning brief outages into long ones, and every part of it looks like good practice.</strong> The restart policy is standard, the health check is standard, and each is correct alone. Together they form a loop with positive feedback: the dependency struggles, containers restart, restarting containers hammer the dependency, it struggles more. <strong>The signature in your metrics is unmistakable once you know it — <code>time() - process_start_time_seconds</code> (lesson 5.5) sawtoothing every 30 to 45 seconds while error rate stays flat at 100%</strong> — and it is invisible if you are only watching request latency, because there are no successful requests to have latency. Before adding any restart automation, ask what the restart is supposed to fix, and confirm the probe can only fail for that reason.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.docker.com/compose/compose-file/05-services/#healthcheck" target="_blank" rel="noopener">
  <span class="lc-ico">🩺</span>
  <span class="lc-body"><span class="lc-title">Compose — healthcheck and restart policies</span><span class="lc-sub">How interval, retries and start_period combine, and exactly which restart policies act on an unhealthy container.</span></span>
</a>
<a class="link-card dl" href="https://sre.google/sre-book/addressing-cascading-failures/" target="_blank" rel="noopener">
  <span class="lc-ico">🌊</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — addressing cascading failures</span><span class="lc-sub">The general shape of the positive-feedback loop in the pitfall, including thundering herds and why restarts amplify them.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Lượt thăm dò liveness khởi động lại một dịch vụ khoẻ mạnh</h2>
<p class="lead">Bài 8.1 xác lập rằng một lượt thăm dò liveness không được phụ thuộc vào bất cứ thứ gì bên ngoài. Bài này đi kiểm xem kho này có theo đúng lời khuyên của chính nó không — và tính toán xem chuyện gì xảy ra khi nó không theo.</p>

<h3>Ba dòng đáng quan tâm</h3>
<pre><code class="language-yaml"># docker-compose.yml — dịch vụ backend
healthcheck:
  test: ["CMD-SHELL", "curl -sf http://localhost:3001/health || exit 1"]
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 30s</code></pre>
<pre><code>Hãy lần theo cái endpoint. Từ bài 8.1:

  /health        →  await prisma.$queryRaw&#96;SELECT 1&#96;
                    trả 503 nếu không với tới được cơ sở dữ liệu

  /health/live   →  res.json({ status: 'ok' })
                    vô điều kiện

Healthcheck của Docker — thứ mà hệ quả DUY NHẤT là đánh dấu
container không khoẻ, tức là khởi động lại nó dưới một chính sách
restart — lại đang trỏ vào cái endpoint trượt khi POSTGRES chết.

Còn cái endpoint tồn tại đúng cho mục đích này, /health/live,
thì chẳng có gì dùng tới.</code></pre>

<h3>Phép tính của cú hỏng</h3>
<pre><code>interval 15s × retries 3, với ngưỡng 5s:

  t=0s    Postgres không với tới được (một cú đứng checkpoint,
          một cái khoá, một lần khởi động lại ngắn — 20 giây đời
          sống bình thường của một cơ sở dữ liệu)
  t=0s    healthcheck #1 → SELECT 1 trượt → không khoẻ 1/3
  t=15s   healthcheck #2 → trượt          → không khoẻ 2/3
  t=30s   healthcheck #3 → trượt          → KHÔNG KHOẺ
  t=30s   chính sách restart giết container

  t=32s   container mới khởi động
  t=32s   Prisma mở bể của nó: 9 kết nối cùng lúc
          (mặc định ở bài 5.4)
  t=35s   Postgres, đang giữa lúc hồi phục, nhận một cơn bão kết
          nối từ mọi backend đang khởi động lại

  t=45s   start_period hết hạn; các lượt thăm dò chạy tiếp
  t=45s   vẫn trượt → vòng lặp khởi động lại

Trong lúc đó thì ứng dụng thật sự vẫn ỔN suốt cả quãng ấy. Nó vẫn
trả lời /health/live trong chưa tới một mili giây. Chẳng có gì ở
cái tiến trình Node ấy bị sai cả.</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Việc khởi động lại KHÔNG chữa được vấn đề</span><span class="lz-d">Postgres mới là thứ đang khó ở. Một tiến trình Node mới toanh cũng chẳng với tới nó giỏi hơn cái cũ.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Việc khởi động lại còn chủ động làm nó tệ hơn</span><span class="lz-d">Mỗi lần khởi động lại là vứt cái bể đang có rồi mở ngay chín kết nối mới. Với một cơ sở dữ liệu vốn đã khó thở, đó là điều ngược hẳn với thứ giúp được.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Các request đang bay cũng bị giết theo</span><span class="lz-d">Container bị dừng, nên mọi request đang được phục vụ — kể cả những cái vốn đang thành công nhờ dữ liệu đệm — trở thành mã 502.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Bằng chứng biến mất cùng với container</span><span class="lz-d">Bài 2.1: tạo lại một container là bắt đầu một file <code>-json.log</code> mới, rỗng. Cái log giải thích cú đứng của cơ sở dữ liệu ban đầu giờ gắn với một container không còn tồn tại.</span></div>
</div>

<h3>Cách chữa là một từ</h3>
<pre><code class="language-yaml">healthcheck:
  test: ["CMD-SHELL", "curl -sf http://localhost:3001/health/live || exit 1"]
  #                                                        ^^^^^
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 30s</code></pre>
<pre><code>Giờ ngữ nghĩa khớp với hành động:

  · Tiến trình Node kẹt cứng, vòng lặp sự kiện đứng, hết bộ nhớ
    → /health/live thôi trả lời → khởi động lại. Đúng: khởi động
      lại chính là thứ chữa được một tiến trình kẹt cứng.

  · Không với tới được Postgres
    → /health/live vẫn trả 200 → không khởi động lại. Đúng:
      container vẫn đứng, giữ được log của nó, và kết nối lại khi
      Postgres quay về.

Phép kiểm cơ sở dữ liệu không biến mất — nó CHUYỂN sang
/health/ready, nơi mà hệ quả là "ngừng gửi lưu lượng", và đó mới
là hệ quả đúng.</code></pre>

<h3>Làm cho liveness mang một ý nghĩa</h3>
<pre><code class="language-typescript">// Một cái 200 vô điều kiện chỉ bắt được "tiến trình đã chết".
// Một vòng lặp sự kiện kẹt cứng (bài 5.1) vẫn trả lời được nó —
// máy chủ HTTP nhận kết nối và handler chạy ngay khi vòng lặp rảnh
// ra, mà chuyện đó có thể là sau ngưỡng thời gian của lượt thăm dò.
// Nên hãy để liveness đọc con số biết chuyện:

import { monitorEventLoopDelay } from 'node:perf_hooks';
const lag = monitorEventLoopDelay({ resolution: 20 });
lag.enable();

app.get('/health/live', (_req, res) =&gt; {
  const p99ms = lag.percentile(99) / 1e6;
  if (p99ms &gt; 5000) {                    // kẹt từ 5 giây trở lên
    return res.status(503).json({ status: 'wedged', eventLoopP99Ms: Math.round(p99ms) });
  }
  res.json({ status: 'ok', eventLoopP99Ms: Math.round(p99ms) });
});</code></pre>
<pre><code>Chọn cái ngưỡng đó cho trung thực:

  · Bài 5.1 đo được độ trễ p99 bình thường ~1ms và một cú chặn
    có chủ ý 200ms cho ra 201ms.
  · 5000ms cao hơn hẳn mọi thứ mà một dịch vụ khoẻ mạnh sinh ra,
    và thấp hơn hẳn mức "chẳng ai để ý".
  · Đặt thấp quá thì một lần dừng GC hay một cú JSON.parse lớn
    sẽ khởi động lại một container đang chạy tốt — bạn vừa dựng
    lại đúng cái lỗi ban đầu với một phụ thuộc khác.

Hãy đặt nó ở chỗ mà một con người sẽ nói "cái tiến trình đó không
tự quay lại được đâu", và đừng chặt hơn.</code></pre>

<h3>Hai lượt thăm dò kia ở đây để làm gì</h3>
<pre><code>/health         → phép kiểm upstream của nginx và việc theo dõi
                  thời gian sống từ bên ngoài. Nó NÊN kiểm cơ sở
                  dữ liệu: hệ quả của nó là "định tuyến lưu lượng
                  đi chỗ khác", không phải "khởi động lại".

/health/ready   → hôm nay giống hệt /health (bài 8.1). Khi nào
                  một trong hai kiểm Redis và báo 'degraded' thì
                  chúng mới xứng đáng tồn tại riêng rẽ.

Ngay lúc này ba trong bốn endpoint có cùng một phần thân và một
cái thì không có ai dùng. Đó không phải một lỗi gây ra sự cố —
đó là kiểu trôi dạt khiến chẳng ai đoán trước được cái nào làm gì
TRONG một sự cố.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — <code>restart: unless-stopped</code> cộng một lượt thăm dò liveness có kiểm phụ thuộc là một cỗ máy biến những sự cố ngắn thành những sự cố dài, mà mọi bộ phận của nó đều trông như thông lệ tốt.</strong> Chính sách khởi động lại là chuẩn mực, phép kiểm sức khoẻ là chuẩn mực, và mỗi cái tách riêng đều đúng. Ghép lại, chúng tạo thành một vòng lặp có phản hồi dương: phụ thuộc khó thở, container khởi động lại, container khởi động lại nện vào phụ thuộc, nó khó thở thêm. <strong>Chữ ký của nó trong chỉ số thì không lẫn đi đâu được một khi bạn đã biết — <code>time() - process_start_time_seconds</code> (bài 5.5) răng cưa mỗi 30 tới 45 giây trong khi tỉ lệ lỗi nằm phẳng ở 100%</strong> — và nó vô hình nếu bạn chỉ đang nhìn độ trễ request, vì làm gì có request nào thành công để mà có độ trễ. Trước khi thêm bất cứ cơ chế tự khởi động lại nào, hãy hỏi cái việc khởi động lại ấy được cho là chữa cái gì, rồi xác nhận rằng lượt thăm dò chỉ có thể trượt vì đúng lý do đó.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.docker.com/compose/compose-file/05-services/#healthcheck" target="_blank" rel="noopener">
  <span class="lc-ico">🩺</span>
  <span class="lc-body"><span class="lc-title">Compose — healthcheck và chính sách restart</span><span class="lc-sub">interval, retries và start_period kết hợp thế nào, và chính xác những chính sách restart nào ra tay với một container không khoẻ.</span></span>
</a>
<a class="link-card dl" href="https://sre.google/sre-book/addressing-cascading-failures/" target="_blank" rel="noopener">
  <span class="lc-ico">🌊</span>
  <span class="lc-body"><span class="lc-title">Sách SRE của Google — xử lý hỏng hóc dây chuyền</span><span class="lc-sub">Hình dạng tổng quát của cái vòng phản hồi dương ở cái bẫy trên, kể cả đàn trâu húc cửa và vì sao việc khởi động lại khuếch đại chúng.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '8.3 — Readiness and the deploy window|||8.3 — Readiness và cửa sổ deploy',
      slug: 'obs-8-3-cua-so-deploy',
      type: 'VIDEO',
      description: 'Vì sao readiness quyết định deploy của bạn có mất request hay không, và cách tắt máy tử tế của kho này gần đúng nhưng chưa đúng hẳn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Readiness and the deploy window</h2>
<p class="lead">Readiness has a second job nobody documents: it is what makes a deploy invisible to users. Get it wrong and every deploy drops requests — a handful, so nobody files a bug, but reliably, forever, several times a week.</p>

<h3>The two windows where requests die</h3>
<pre><code>WINDOW 1 — starting up

  t=0.0s  container starts, node begins
  t=0.4s  express binds :3001  ← ACCEPTING CONNECTIONS
  t=0.4s  ...but Prisma has not connected
          ...but the config has not loaded
          ...but the routes are still being registered

  Requests arriving between 0.4s and ~2s hit a server that
  is listening but not working. They get 500s, or hang.

WINDOW 2 — shutting down

  t=0.0s  SIGTERM arrives
  t=0.0s  process begins exiting
  t=0.0s  ...but the load balancer still thinks you are up
          ...and keeps routing for another few seconds
          ...and every one of those becomes a 502</code></pre>
<p>Window 2 is the surprising one, and it is the reason the fix below is counter-intuitive.</p>

<h3>What this repository does</h3>
<pre><code class="language-typescript">// src/index.ts — the graceful shutdown, and it is mostly right
function setupGracefulShutdown(): void {
  const shutdown = async (signal: string) =&gt; {
    logger.info('shutdown signal received', { signal });

    // Ngừng nhận request mới
    server.close(async () =&gt; {
      logger.info('HTTP server closed');
      try {
        await prisma.$disconnect();
        logger.info('Database connections closed');
      } catch (err) { logger.error('Error during shutdown', { ... }); }
    });
  };
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✅</span><span class="lz-t"><code>server.close()</code> rather than <code>process.exit()</code></span><span class="lz-d">It stops accepting new connections and lets in-flight requests finish. This is the part most codebases get wrong, and this one gets right.</span></div>
  <div class="lz-step"><span class="lz-k">✅</span><span class="lz-t">Disconnects Prisma in the callback</span><span class="lz-d">After the server closes, so no request finds the pool gone mid-query.</span></div>
  <div class="lz-step"><span class="lz-k">✅</span><span class="lz-t">It logs, and the loop drains naturally</span><span class="lz-d">Which, per lesson 1.5's pitfall, is what lets buffered stdout actually reach disk before the process ends.</span></div>
  <div class="lz-step"><span class="lz-k">⚠️</span><span class="lz-t">It stops accepting <em>immediately</em></span><span class="lz-d">And that is window 2: nginx does not know yet. For several seconds it keeps routing to a socket that is no longer accepting, and each of those is a 502 for a user.</span></div>
</div>

<h3>The fix: fail readiness first, then wait, then close</h3>
<pre><code class="language-typescript">let shuttingDown = false;

app.get('/health/ready', async (_req, res) =&gt; {
  if (shuttingDown) {
    return res.status(503).json({ status: 'shutting down' });   // ← step 1
  }
  // ...normal dependency checks
});

const shutdown = async (signal: string) =&gt; {
  logger.info('shutdown signal received', { signal });

  shuttingDown = true;                    // 1. readiness starts failing NOW
  await sleep(LB_DRAIN_MS);               // 2. give the LB time to notice
  server.close(async () =&gt; {              // 3. only now stop accepting
    await prisma.$disconnect();
  });
  setTimeout(() =&gt; process.exit(1), HARD_LIMIT_MS).unref();   // 4. backstop
};</code></pre>
<pre><code>Why the sleep is not a hack — it is the only correct answer:

  The load balancer discovers you are unready by POLLING.
  There is no push. So the minimum honest wait is:

      readiness interval  +  (failure threshold × interval)
                          +  a margin

  nginx upstream checks, or a Docker healthcheck at 15s
  intervals with 3 retries, means up to 45 seconds before
  it stops routing to you.

  Choosing LB_DRAIN_MS shorter than that is choosing to
  drop requests. Choosing it longer costs deploy time and
  nothing else.

  For this repo: 5–10s is a reasonable compromise given
  nginx's proxy behaviour; 45s would be strictly correct
  and rarely worth the wait.</code></pre>

<h3>The startup side</h3>
<pre><code class="language-typescript">// Bind LAST, not first. Do not accept connections until
// everything a request needs is actually ready.
async function main() {
  await prisma.$connect();                    // 1. dependencies
  await loadConfig();                         // 2. config
  registerRoutes(app);                        // 3. routes
  server.listen(PORT, () =&gt; {                 // 4. NOW accept traffic
    logger.info('CuongHoangDev API running', { port: PORT });
  });
}</code></pre>
<pre><code>And the start_period that makes it safe:

  start_period: 30s   ← failures during this window do NOT
                        count toward the retry budget

  Without it, a boot that takes 35 seconds (a cold image, a
  slow migration check, a busy VPS) fails 3 probes and gets
  killed BEFORE it has ever finished starting. The container
  then restarts, takes 35 seconds again, and is killed again.

  A boot loop caused entirely by a probe that started asking
  too early. Set start_period to your worst observed boot
  time, doubled.</code></pre>

<h3>The whole deploy, with readiness doing its job</h3>
<pre><code>  OLD container                    NEW container
  ─────────────                    ─────────────
  serving traffic
                                   starts
                                   /health/ready → 503
                                   (LB does not route to it)
                                   connects DB, loads config
                                   binds :3001
                                   /health/ready → 200
                                   ← LB starts routing here
  SIGTERM
  ready → 503
  ← LB stops routing here
  (drain: in-flight finish)
  server.close()
  exit                             serving traffic

At no point is there a window where the load balancer routes
to a process that cannot serve. That is the entire purpose
of readiness, and it costs one boolean and one sleep.</code></pre>

<div class="pitfall">
<p><strong>Trap — <code>SIGKILL</code> arrives ten seconds after <code>SIGTERM</code>, and your graceful shutdown does not get a vote.</strong> Docker's default <code>stop_grace_period</code> is 10 seconds: after that the process is killed outright, in-flight requests are severed, and buffered stdout is discarded — lesson 1.5's missing final log lines, arriving on every single deploy. The arithmetic is unforgiving, because the drain sleep comes out of the same budget: a 10-second drain plus any request still finishing exceeds the grace period, so the very mechanism meant to make deploys clean is what runs you into the hard kill. <strong>Set <code>stop_grace_period</code> explicitly to comfortably exceed drain plus your slowest request</strong> — for this repo, with a 25-second LLM timeout, 40 seconds is the honest number — and add the <code>setTimeout(process.exit)</code> backstop above so a hung shutdown ends on your terms rather than the daemon's.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.docker.com/reference/compose-file/services/#stop_grace_period" target="_blank" rel="noopener">
  <span class="lc-ico">⏲️</span>
  <span class="lc-body"><span class="lc-title">Compose — stop_grace_period and stop_signal</span><span class="lc-sub">The 10-second default from the pitfall, and how to set the window your shutdown actually needs.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/http.html#serverclosecallback" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Node.js — server.close() and closeIdleConnections()</span><span class="lc-sub">What close() does and does not wait for, and the keep-alive connections that can hold a shutdown open indefinitely.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Readiness và cửa sổ deploy</h2>
<p class="lead">Readiness có một việc thứ hai chẳng ai ghi lại: nó là thứ làm cho một lần deploy trở nên vô hình với người dùng. Làm sai thì mọi lần deploy đều rơi mất request — vài cái thôi, nên chẳng ai mở phiếu lỗi, nhưng đều đặn, mãi mãi, vài lần mỗi tuần.</p>

<h3>Hai cửa sổ mà request chết</h3>
<pre><code>CỬA SỔ 1 — lúc khởi động

  t=0.0s  container khởi động, node bắt đầu chạy
  t=0.4s  express bind :3001  ← ĐANG NHẬN KẾT NỐI
  t=0.4s  ...nhưng Prisma chưa kết nối
          ...nhưng cấu hình chưa nạp xong
          ...nhưng các route vẫn đang được đăng ký

  Request tới trong khoảng 0,4s tới ~2s đập vào một máy chủ đang
  lắng nghe nhưng chưa chạy được. Chúng nhận 500, hoặc treo.

CỬA SỔ 2 — lúc tắt máy

  t=0.0s  SIGTERM tới
  t=0.0s  tiến trình bắt đầu thoát
  t=0.0s  ...nhưng bộ cân bằng tải vẫn tưởng bạn còn sống
          ...và vẫn định tuyến thêm vài giây nữa
          ...và mỗi cái trong số đó thành một mã 502</code></pre>
<p>Cửa sổ 2 mới là cái gây bất ngờ, và nó là lý do cách chữa bên dưới đi ngược trực giác.</p>

<h3>Kho này làm gì</h3>
<pre><code class="language-typescript">// src/index.ts — phần tắt máy tử tế, và nó phần lớn là đúng
function setupGracefulShutdown(): void {
  const shutdown = async (signal: string) =&gt; {
    logger.info('shutdown signal received', { signal });

    // Ngừng nhận request mới
    server.close(async () =&gt; {
      logger.info('HTTP server closed');
      try {
        await prisma.$disconnect();
        logger.info('Database connections closed');
      } catch (err) { logger.error('Error during shutdown', { ... }); }
    });
  };
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✅</span><span class="lz-t"><code>server.close()</code> chứ không phải <code>process.exit()</code></span><span class="lz-d">Nó ngừng nhận kết nối mới và để các request đang bay chạy xong. Đây là phần mà phần lớn kho mã làm sai, còn kho này làm đúng.</span></div>
  <div class="lz-step"><span class="lz-k">✅</span><span class="lz-t">Ngắt Prisma trong callback</span><span class="lz-d">Sau khi máy chủ đóng, nên không request nào thấy cái bể biến mất giữa lúc đang truy vấn.</span></div>
  <div class="lz-step"><span class="lz-k">✅</span><span class="lz-t">Nó có log, và vòng lặp cạn dần một cách tự nhiên</span><span class="lz-d">Mà theo cái bẫy ở bài 1.5, đó chính là thứ cho phép phần stdout đang đệm thật sự xuống được tới đĩa trước khi tiến trình kết thúc.</span></div>
  <div class="lz-step"><span class="lz-k">⚠️</span><span class="lz-t">Nó ngừng nhận NGAY LẬP TỨC</span><span class="lz-d">Và đó chính là cửa sổ 2: nginx chưa biết. Suốt vài giây nó vẫn định tuyến tới một socket không còn nhận nữa, và mỗi cái đó là một mã 502 với một người dùng.</span></div>
</div>

<h3>Cách chữa: cho readiness trượt TRƯỚC, rồi chờ, rồi mới đóng</h3>
<pre><code class="language-typescript">let shuttingDown = false;

app.get('/health/ready', async (_req, res) =&gt; {
  if (shuttingDown) {
    return res.status(503).json({ status: 'shutting down' });   // ← bước 1
  }
  // ...các phép kiểm phụ thuộc bình thường
});

const shutdown = async (signal: string) =&gt; {
  logger.info('shutdown signal received', { signal });

  shuttingDown = true;                    // 1. readiness bắt đầu trượt NGAY
  await sleep(LB_DRAIN_MS);               // 2. cho bộ cân bằng tải kịp nhận ra
  server.close(async () =&gt; {              // 3. tới giờ mới ngừng nhận
    await prisma.$disconnect();
  });
  setTimeout(() =&gt; process.exit(1), HARD_LIMIT_MS).unref();   // 4. chốt chặn
};</code></pre>
<pre><code>Vì sao cái lệnh sleep đó không phải một trò vặt — nó là câu trả
lời đúng duy nhất:

  Bộ cân bằng tải phát hiện bạn chưa sẵn sàng bằng cách HỎI ĐỀU.
  Không có cơ chế đẩy nào cả. Nên mức chờ tối thiểu trung thực là:

      chu kỳ kiểm readiness  +  (số lần trượt × chu kỳ)
                             +  một biên an toàn

  Phép kiểm upstream của nginx, hay một healthcheck Docker chu kỳ
  15s với 3 lần thử lại, nghĩa là có thể tới 45 giây trước khi nó
  thôi định tuyến tới bạn.

  Chọn LB_DRAIN_MS ngắn hơn thế là chọn đánh rơi request. Chọn nó
  dài hơn thì tốn thời gian deploy và không tốn gì khác.

  Với kho này: 5–10s là một sự thoả hiệp hợp lý xét theo hành vi
  proxy của nginx; 45s thì đúng chặt chẽ và hiếm khi đáng chờ.</code></pre>

<h3>Phía khởi động</h3>
<pre><code class="language-typescript">// Hãy bind SAU CÙNG, không phải đầu tiên. Đừng nhận kết nối cho tới
// khi mọi thứ mà một request cần đã thật sự sẵn sàng.
async function main() {
  await prisma.$connect();                    // 1. các phụ thuộc
  await loadConfig();                         // 2. cấu hình
  registerRoutes(app);                        // 3. các route
  server.listen(PORT, () =&gt; {                 // 4. TỚI GIỜ mới nhận lưu lượng
    logger.info('CuongHoangDev API running', { port: PORT });
  });
}</code></pre>
<pre><code>Và cái start_period làm cho nó an toàn:

  start_period: 30s   ← những lần trượt trong cửa sổ này KHÔNG
                        tính vào ngân sách thử lại

  Không có nó, một lần boot mất 35 giây (một ảnh nguội, một phép
  kiểm migration chậm, một cái VPS đang bận) sẽ trượt 3 lượt thăm
  dò và bị giết TRƯỚC KHI nó từng khởi động xong. Container rồi
  khởi động lại, lại mất 35 giây, rồi lại bị giết.

  Một vòng lặp boot gây ra hoàn toàn bởi một lượt thăm dò bắt đầu
  hỏi quá sớm. Hãy đặt start_period bằng thời gian boot tệ nhất
  bạn từng quan sát, nhân đôi.</code></pre>

<h3>Trọn một lần deploy, với readiness làm đúng việc của nó</h3>
<pre><code>  Container CŨ                     Container MỚI
  ────────────                     ─────────────
  đang phục vụ lưu lượng
                                   khởi động
                                   /health/ready → 503
                                   (bộ cân bằng tải không định tuyến tới)
                                   kết nối DB, nạp cấu hình
                                   bind :3001
                                   /health/ready → 200
                                   ← bộ cân bằng tải bắt đầu định tuyến tới đây
  SIGTERM
  ready → 503
  ← bộ cân bằng tải thôi định tuyến tới đây
  (rút cạn: các request đang bay chạy xong)
  server.close()
  thoát                            đang phục vụ lưu lượng

Không có lúc nào tồn tại một cửa sổ mà bộ cân bằng tải định tuyến
tới một tiến trình không phục vụ nổi. Đó là toàn bộ mục đích của
readiness, và nó tốn một biến luận lý cộng một lệnh sleep.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — <code>SIGKILL</code> tới mười giây sau <code>SIGTERM</code>, và cái đoạn tắt máy tử tế của bạn không có quyền bỏ phiếu.</strong> Mặc định <code>stop_grace_period</code> của Docker là 10 giây: sau đó tiến trình bị giết thẳng, các request đang bay bị cắt đứt, và phần stdout đang đệm bị vứt — chính mấy dòng log cuối bị mất ở bài 1.5, xuất hiện ở MỌI lần deploy. Phép tính thì không khoan nhượng, vì cái lệnh sleep rút cạn lấy ra từ cùng một ngân sách: một lần rút cạn 10 giây cộng bất cứ request nào còn đang chạy xong sẽ vượt quá thời gian ân hạn, nên chính cái cơ chế sinh ra để làm deploy sạch sẽ lại là thứ đẩy bạn vào cú giết cứng. <strong>Hãy đặt <code>stop_grace_period</code> một cách tường minh, vượt thoải mái quá thời gian rút cạn cộng request chậm nhất của bạn</strong> — với kho này, có ngưỡng LLM 25 giây, thì 40 giây là con số trung thực — và thêm cái chốt chặn <code>setTimeout(process.exit)</code> ở trên để một lần tắt máy bị treo kết thúc theo điều kiện của bạn chứ không theo điều kiện của daemon.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.docker.com/reference/compose-file/services/#stop_grace_period" target="_blank" rel="noopener">
  <span class="lc-ico">⏲️</span>
  <span class="lc-body"><span class="lc-title">Compose — stop_grace_period và stop_signal</span><span class="lc-sub">Cái mặc định 10 giây ở cái bẫy trên, và cách đặt đúng cửa sổ mà phần tắt máy của bạn thật sự cần.</span></span>
</a>
<a class="link-card dl" href="https://nodejs.org/docs/latest/api/http.html#serverclosecallback" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Node.js — server.close() và closeIdleConnections()</span><span class="lc-sub">close() chờ gì và không chờ gì, và những kết nối keep-alive có thể giữ một lần tắt máy mở vô thời hạn.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '8.4 — How deep to check, and the smoke test this repo already has|||8.4 — Kiểm sâu tới đâu, và bài kiểm khói kho này vốn đã có',
      slug: 'obs-8-4-kiem-sau-toi-dau',
      type: 'VIDEO',
      description: 'deploy.sh kiểm 52 route trên tổng 942 khai báo. Vì sao 52 là đủ, và cái nó bắt được mà không phép kiểm sức khoẻ nào bắt nổi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>How deep to check, and the smoke test this repo already has</h2>
<p class="lead">Lesson 0.1 opened with a failure no health check could have caught: <code>/health</code> returned <code>ok</code>, Postgres answered <code>SELECT 1</code>, and a route returned 404 because the build was stale. This lesson is about the class of check that <em>does</em> catch that — and this repository built one.</p>

<h3>The depth ladder</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Level 0 — the process answers</span><span class="lz-lnote"><code>/health/live</code>. Catches: crashed, wedged. Misses: everything else. Cost: nothing.</span></div>
  <div class="lz-layer"><span class="lz-lname">Level 1 — a dependency answers</span><span class="lz-lnote"><code>SELECT 1</code>. Catches: database down, network partition, credentials expired. Misses: a query that is slow, a table that is missing, a route that is not mounted.</span></div>
  <div class="lz-layer"><span class="lz-lname">Level 2 — the routes are mounted</span><span class="lz-lnote">An unauthenticated GET returning 401 or 200 rather than 404. <strong>Catches the stale-build failure from lesson 0.1</strong>, which every level below it misses entirely.</span></div>
  <div class="lz-layer"><span class="lz-lname">Level 3 — a real operation succeeds</span><span class="lz-lnote">Log in, create something, read it back. Catches almost everything. Costs a test account, writes to production, and is slow — so it belongs in synthetic monitoring, not in a probe.</span></div>
</div>

<h3>Level 2, as this repo implements it</h3>
<pre><code class="language-bash"># deploy.sh:855 — runs after every deploy, fails the deploy on 404
info "Smoke-testing core API routes are mounted..."
for route in \\
    gifs voice-mini/voices messages/threads messages/unread-count \\
    profile social/posts feed/posts friends notes notes-shares \\
    ai/chat/folders music/tracks courses hub/folders snippets \\
    ... ; do
  code=$(docker exec cuonghoangdev_backend \\
      sh -c "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/api/v1/\${route}")
  if [ "$code" = "404" ]; then
    smoke_failed=true
  fi
done</code></pre>
<div class="out">$ sed -n '857,908p' deploy.sh | grep -c '\\$'
52          # số route trong smoke-test

$ grep -rhoE "router\\.(get|post|put|patch|delete)\\(" src/ | wc -l
942         # tổng khai báo route</div>
<p><strong>Fifty-two of nine hundred and forty-two.</strong> That is 5.5% coverage, and it is the right number — because the smoke test is not testing routes. It is testing that <em>each router module got mounted</em>, and one route per module proves that. Adding the other 890 would multiply the runtime by eighteen and catch nothing new.</p>

<h3>The three rules it follows</h3>
<pre><code>1. NON-404 is the assertion, not 200.

   401 = mounted, requires auth      ✅ pass
   200 = mounted, public             ✅ pass
   404 = NOT MOUNTED                 ❌ fail

   This is what lets it check authenticated routes without
   any credentials at all. The check is "does the router
   exist", and 401 answers that as well as 200 does.

2. Only param-less, unauthenticated GETs.

   The project docs are explicit: do NOT add POST-only or
   param-required routes (/stickers, /auth/login), "or every
   deploy will false-fail". A smoke test that cries wolf is
   removed within a month.

3. One route per feature module.

   When you add a router, you add ONE of its routes here.
   That is a documented step in the project's checklist, and
   it is what keeps 5.5% coverage meaningful as the codebase
   grows.</code></pre>

<h3>Why this catches what probes cannot</h3>
<pre><code>The 2026-07-02 incident, from the project's own error log:

  · GIF picker dead, chats "disappearing"
  · Survived a re-login, so not an auth problem
  · Root cause: production ran a STALE dist/index.js that
    never mounted /api/v1/gifs

  What each level said at the time:

    /health/live       200   ✅ process is fine
    /health            200   ✅ SELECT 1 works
    /health/ready      200   ✅ same query
    GET /api/v1/gifs   404   ❌ ← only level 2 sees this

  Three probes green. The application broken. The difference
  between them is that levels 0 and 1 ask about the process
  and its dependencies, and level 2 asks about the BUILD.

The smoke test now runs on every deploy and fails it on a
404, which means this specific outage cannot recur silently.</code></pre>

<h3>The manual version, for diagnosing live</h3>
<pre><code class="language-bash"># From the project docs — the one-line route health check
curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/api/v1/&lt;route&gt;

#   401 → mounted, needs auth      (healthy)
#   200 → mounted, public          (healthy)
#   404 → NOT mounted / stale build (this is the bug)

# Do NOT diagnose this in a browser. A browser sends cookies,
# follows redirects, and renders an error page for a 404 that
# looks identical to a permissions problem.</code></pre>

<h3>Where to stop</h3>
<pre><code>Level 3 — "log in and create a note" — is genuinely more
thorough, and it belongs in synthetic monitoring (lesson
8.5), NOT in a health probe, for three reasons:

  · It writes. Every 15 seconds, from every container,
    forever. That is data you must then clean up.
  · It needs credentials. Which expire, at 3am, unrelated
    to health.
  · It is slow. A 5-second timeout cannot contain a login
    plus a write plus a read.

The rule: a probe answers "should traffic come here", and
must be fast, read-only and dependency-light. Anything
deeper is a TEST, and tests run on a schedule from outside,
not on the request path.</code></pre>

<div class="pitfall">
<p><strong>Trap — a check that runs inside the container it is checking cannot see the two failures most likely to take you down.</strong> Both the Docker healthcheck (<code>curl localhost:3001</code>) and the deploy smoke test (<code>docker exec … curl localhost:3001</code>) reach the app by bypassing nginx, TLS and DNS entirely. So they stay green through an expired certificate, a bad nginx <code>location</code> block, a DNS record pointing at the old VPS, and a firewall rule that drops 443 — every one of which is a total outage for users and invisible from inside. <strong>The smoke test proving all 52 routes are mounted and the certificate having expired an hour ago are perfectly compatible states.</strong> That is not an argument against the internal check, which correctly isolates &quot;is the app built right&quot; from &quot;is the network right&quot;; it is the argument for lesson 8.5, and for making at least one check hit the public hostname over TLS from somewhere else entirely.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — monitoring distributed systems</span><span class="lc-sub">White-box versus black-box monitoring, which is exactly the internal-versus-external distinction in the pitfall above.</span></span>
</a>
<a class="link-card dl" href="https://curl.se/docs/manpage.html#-w" target="_blank" rel="noopener">
  <span class="lc-ico">🌀</span>
  <span class="lc-body"><span class="lc-title">curl — the --write-out format</span><span class="lc-sub">%{http_code} and the other variables (time_connect, time_appconnect for TLS) that turn one curl into a layered diagnosis.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Kiểm sâu tới đâu, và bài kiểm khói kho này vốn đã có</h2>
<p class="lead">Bài 0.1 mở đầu bằng một cú hỏng mà không phép kiểm sức khoẻ nào bắt được: <code>/health</code> trả về <code>ok</code>, Postgres trả lời <code>SELECT 1</code>, và một route trả 404 vì bản dựng đã cũ. Bài này nói về cái loại phép kiểm <em>CÓ</em> bắt được chuyện đó — và kho này đã dựng ra một cái.</p>

<h3>Cái thang độ sâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Mức 0 — tiến trình có trả lời</span><span class="lz-lnote"><code>/health/live</code>. Bắt được: đã sập, đã kẹt. Bỏ sót: mọi thứ khác. Chi phí: không.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mức 1 — một phụ thuộc có trả lời</span><span class="lz-lnote"><code>SELECT 1</code>. Bắt được: cơ sở dữ liệu chết, mạng bị chia cắt, thông tin xác thực hết hạn. Bỏ sót: một truy vấn chậm, một cái bảng biến mất, một route không được gắn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mức 2 — các route đã được gắn</span><span class="lz-lnote">Một lệnh GET không xác thực trả về 401 hoặc 200 chứ không phải 404. <strong>Bắt được cú hỏng bản-dựng-cũ ở bài 0.1</strong>, thứ mà mọi mức bên dưới nó đều bỏ sót hoàn toàn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mức 3 — một thao tác thật chạy được</span><span class="lz-lnote">Đăng nhập, tạo một thứ gì đó, đọc lại. Bắt được gần như tất cả. Tốn một tài khoản thử, ghi dữ liệu lên production, và chậm — nên nó thuộc về việc theo dõi tổng hợp, không thuộc về một lượt thăm dò.</span></div>
</div>

<h3>Mức 2, theo cách kho này cài đặt</h3>
<pre><code class="language-bash"># deploy.sh:855 — chạy sau mọi lần deploy, làm HỎNG lần deploy nếu gặp 404
info "Smoke-testing core API routes are mounted..."
for route in \\
    gifs voice-mini/voices messages/threads messages/unread-count \\
    profile social/posts feed/posts friends notes notes-shares \\
    ai/chat/folders music/tracks courses hub/folders snippets \\
    ... ; do
  code=$(docker exec cuonghoangdev_backend \\
      sh -c "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/api/v1/\${route}")
  if [ "$code" = "404" ]; then
    smoke_failed=true
  fi
done</code></pre>
<div class="out">$ sed -n '857,908p' deploy.sh | grep -c '\\$'
52          # số route trong smoke-test

$ grep -rhoE "router\\.(get|post|put|patch|delete)\\(" src/ | wc -l
942         # tổng khai báo route</div>
<p><strong>Năm mươi hai trên chín trăm bốn mươi hai.</strong> Đó là độ phủ 5,5%, và đó là con số ĐÚNG — vì bài kiểm khói không kiểm các route. Nó kiểm rằng <em>mỗi module router đã được gắn</em>, và một route cho mỗi module chứng minh được điều đó. Thêm 890 cái còn lại thì nhân thời gian chạy lên mười tám lần và chẳng bắt được gì mới.</p>

<h3>Ba luật nó tuân theo</h3>
<pre><code>1. KHÔNG-404 mới là điều khẳng định, không phải 200.

   401 = đã gắn, cần xác thực       ✅ qua
   200 = đã gắn, công khai          ✅ qua
   404 = CHƯA ĐƯỢC GẮN              ❌ trượt

   Đây là thứ cho phép nó kiểm được các route cần xác thực mà
   không cần chút thông tin đăng nhập nào. Phép kiểm là "cái
   router có tồn tại không", và 401 trả lời được điều đó chẳng
   kém gì 200.

2. Chỉ những lệnh GET không tham số, không xác thực.

   Tài liệu dự án nói thẳng: ĐỪNG thêm những route chỉ-POST hay
   cần-tham-số (/stickers, /auth/login), "không thì mọi lần
   deploy sẽ trượt oan". Một bài kiểm khói hay báo động giả thì
   bị gỡ bỏ trong vòng một tháng.

3. Một route cho mỗi module tính năng.

   Khi bạn thêm một router, bạn thêm MỘT route của nó vào đây.
   Đó là một bước có ghi trong danh sách kiểm của dự án, và nó
   là thứ giữ cho độ phủ 5,5% vẫn có ý nghĩa khi kho mã lớn lên.</code></pre>

<h3>Vì sao cái này bắt được thứ mà các lượt thăm dò không bắt nổi</h3>
<pre><code>Sự cố ngày 02/07/2026, từ chính nhật ký lỗi của dự án:

  · Trình chọn GIF chết, các cuộc trò chuyện "biến mất"
  · Sống sót qua một lần đăng nhập lại, nên không phải lỗi xác thực
  · Nguyên nhân gốc: production chạy một dist/index.js CŨ chưa
    bao giờ gắn /api/v1/gifs

  Lúc đó mỗi mức nói gì:

    /health/live       200   ✅ tiến trình vẫn ổn
    /health            200   ✅ SELECT 1 chạy được
    /health/ready      200   ✅ cùng một truy vấn
    GET /api/v1/gifs   404   ❌ ← chỉ mức 2 thấy được cái này

  Ba lượt thăm dò xanh. Ứng dụng thì hỏng. Khác biệt giữa chúng
  là mức 0 và 1 hỏi về TIẾN TRÌNH và các PHỤ THUỘC của nó, còn
  mức 2 hỏi về BẢN DỰNG.

Bài kiểm khói giờ chạy ở mọi lần deploy và làm hỏng lần deploy khi
gặp 404, nghĩa là cái sự cố cụ thể ấy không thể tái diễn trong im
lặng nữa.</code></pre>

<h3>Bản thủ công, để chẩn đoán lúc đang chạy</h3>
<pre><code class="language-bash"># Từ tài liệu dự án — phép kiểm sức khoẻ route một dòng
curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/api/v1/&lt;route&gt;

#   401 → đã gắn, cần xác thực      (khoẻ)
#   200 → đã gắn, công khai         (khoẻ)
#   404 → CHƯA gắn / bản dựng cũ    (đây là cái lỗi)

# ĐỪNG chẩn đoán chuyện này trong trình duyệt. Trình duyệt gửi
# cookie, đi theo chuyển hướng, và vẽ ra một trang lỗi cho mã 404
# trông y hệt một vấn đề về quyền.</code></pre>

<h3>Dừng ở đâu</h3>
<pre><code>Mức 3 — "đăng nhập rồi tạo một ghi chú" — thật sự kỹ hơn, và nó
thuộc về việc theo dõi tổng hợp (bài 8.5), KHÔNG thuộc về một
lượt thăm dò sức khoẻ, vì ba lý do:

  · Nó GHI dữ liệu. Mười lăm giây một lần, từ mọi container,
    mãi mãi. Đó là dữ liệu mà sau đó bạn phải đi dọn.
  · Nó cần thông tin đăng nhập. Thứ sẽ hết hạn, vào 3 giờ sáng,
    chẳng liên quan gì tới sức khoẻ.
  · Nó chậm. Một ngưỡng 5 giây không chứa nổi một lần đăng nhập
    cộng một lần ghi cộng một lần đọc.

Luật: một lượt thăm dò trả lời câu "lưu lượng có nên tới đây
không", và phải nhanh, chỉ-đọc, và nhẹ phụ thuộc. Bất cứ thứ gì
sâu hơn là một BÀI KIỂM, mà bài kiểm thì chạy theo lịch từ bên
ngoài, không chạy trên đường request.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — một phép kiểm chạy BÊN TRONG chính cái container nó đang kiểm thì không thấy được hai cú hỏng dễ hạ gục bạn nhất.</strong> Cả healthcheck của Docker (<code>curl localhost:3001</code>) lẫn bài kiểm khói lúc deploy (<code>docker exec … curl localhost:3001</code>) đều với tới ứng dụng bằng cách đi vòng qua nginx, TLS và DNS hoàn toàn. Nên chúng vẫn xanh qua một chứng chỉ hết hạn, một khối <code>location</code> sai của nginx, một bản ghi DNS trỏ vào cái VPS cũ, và một luật tường lửa chặn cổng 443 — mỗi cái trong số đó là một sự cố toàn phần với người dùng và vô hình khi nhìn từ bên trong. <strong>Việc bài kiểm khói chứng minh cả 52 route đã được gắn và việc chứng chỉ đã hết hạn một giờ trước là hai trạng thái hoàn toàn tương thích với nhau.</strong> Đó không phải một lý lẽ chống lại phép kiểm nội bộ, thứ đang cách ly rất đúng &quot;ứng dụng có dựng đúng không&quot; khỏi &quot;mạng có đúng không&quot;; nó là lý lẽ cho bài 8.5, và cho việc bắt buộc phải có ít nhất một phép kiểm đập vào tên miền công khai qua TLS từ một nơi hoàn toàn khác.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Sách SRE của Google — theo dõi hệ thống phân tán</span><span class="lc-sub">Theo dõi hộp-trắng so với hộp-đen, đúng là sự phân biệt bên-trong so với bên-ngoài ở cái bẫy trên.</span></span>
</a>
<a class="link-card dl" href="https://curl.se/docs/manpage.html#-w" target="_blank" rel="noopener">
  <span class="lc-ico">🌀</span>
  <span class="lc-body"><span class="lc-title">curl — định dạng --write-out</span><span class="lc-sub">%{http_code} và các biến khác (time_connect, time_appconnect cho TLS) biến một lệnh curl thành một phép chẩn đoán theo tầng.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '8.5 — Checking from outside, where the users are|||8.5 — Kiểm từ bên ngoài, chỗ người dùng đứng',
      slug: 'obs-8-5-kiem-tu-ben-ngoai',
      type: 'VIDEO',
      description: 'Bảy tầng giữa người dùng và ứng dụng của bạn, và bốn tầng mà mọi phép kiểm bên trong đều mù.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>Checking from outside, where the users are</h2>
<p class="lead">Lesson 8.4 ended on a specific blind spot: every check in this repository runs inside the container. This lesson counts the layers those checks skip, and builds the smallest thing that covers them.</p>

<h3>The seven layers between a user and your code</h3>
<pre><code>  user's browser
       │  1. DNS resolution          ← cuongthai.com → which IP?
       │  2. Cloudflare / CDN        ← is the origin marked down?
       │  3. TCP to the VPS          ← firewall, port 443 open?
       │  4. TLS handshake           ← certificate valid? expired?
       │  5. nginx                   ← right location block? upstream up?
       │  6. Docker network          ← container reachable by name?
       │  7. Node / Express          ← ← ← every internal check
  your app                                starts HERE

Layers 1–5 are invisible to /health, /health/live, /health/ready
AND the deploy smoke test. All four of them begin at layer 7.</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">An expired certificate is a total outage</span><span class="lz-d">Every browser refuses to connect. Internally: 200 on everything. Let's Encrypt is 90 days, and a renewal cron that silently stopped is the classic version of this.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">A wrong nginx <code>location</code> block routes to nothing</span><span class="lz-d">The container is perfect. Requests never reach it. This is what a 502 with a clean backend log looks like — lesson 3.5's incident, in a different flavour.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">DNS still points at the old VPS</span><span class="lz-d">Your new deploy is flawless and nobody is talking to it. Internal checks pass on a machine receiving no traffic at all.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cloudflare has marked your origin down</span><span class="lz-d">It serves an error page. Your VPS sees zero requests, so every metric is green — the &quot;quiet Sunday&quot; failure from lesson 4.5, with a cause.</span></div>
</div>

<h3>The smallest useful external check</h3>
<pre><code class="language-yaml"># .github/workflows/uptime.yml — runs on GitHub's infra,
# which is the point: it is not your VPS.
name: External uptime check
on:
  schedule: [{ cron: '*/15 * * * *' }]     # every 15 minutes
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-24.04
    steps:
      - name: Public HTTPS reachable, cert valid, route mounted
        run: |
          # -f fails on 4xx/5xx, and curl fails on an invalid cert by default
          code=$(curl -sS -o /dev/null -w '%{http_code}' \\
                 --max-time 10 https://cuongthai.com/api/v1/courses)
          echo "courses → $code"
          [ "$code" = "200" ] || [ "$code" = "401" ] || exit 1

      - name: Certificate has more than 14 days left
        run: |
          end=$(echo | openssl s_client -servername cuongthai.com \\
                -connect cuongthai.com:443 2&gt;/dev/null \\
                | openssl x509 -noout -enddate | cut -d= -f2)
          left=$(( ($(date -d "$end" +%s) - $(date +%s)) / 86400 ))
          echo "cert expires in $left days"
          [ "$left" -gt 14 ] || exit 1</code></pre>
<pre><code>Why GitHub Actions rather than a monitoring vendor:

  ✅ Different infrastructure from the thing being watched —
     the only property that actually matters here
  ✅ Already configured in this repo, with secrets, and it
     already runs a weekly VPS cleanup cron
  ✅ Failure notifications go somewhere people read

  ⚠️ Scheduled workflows can be delayed by several minutes
     under load, and GitHub disables them on inactive repos.
     Fine for a 15-minute check; not a substitute for a
     real uptime service if minutes matter.</code></pre>

<h3>Layering the diagnosis into one command</h3>
<pre><code class="language-bash">curl -sS -o /dev/null -w \\
  'dns:%{time_namelookup}s tcp:%{time_connect}s tls:%{time_appconnect}s \\
   ttfb:%{time_starttransfer}s total:%{time_total}s code:%{http_code}\\n' \\
  https://cuongthai.com/api/v1/courses</code></pre>
<div class="out">dns:0.021s tcp:0.089s tls:0.198s ttfb:0.412s total:0.415s code:200</div>
<pre><code>Each number isolates a layer, so a single command tells you
WHERE the time went:

  time_namelookup high    → DNS. Resolver, or a low TTL
                             plus a slow authoritative server.
  time_connect high       → network path or the VPS is
                             refusing connections.
  time_appconnect high    → TLS handshake. Usually a slow
                             OCSP fetch or a long chain.
  ttfb − appconnect high  → nginx + your app. THIS is the
                             only part your internal checks
                             can see.
  total − ttfb high       → response body transfer. A large
                             payload, or a slow client link.

Run it during an incident before touching anything: it tells
you in one second whether the problem is even yours.</code></pre>

<h3>Synthetic monitoring: the level-3 check, safely</h3>
<pre><code>Lesson 8.4 ruled level 3 out of health probes. It belongs
HERE, run from outside, on a schedule, with a real account:

  1. POST /auth/login with a dedicated monitoring account
  2. GET  /api/v1/notes with the token
  3. POST /api/v1/notes  { title: 'synthetic-check' }
  4. GET  it back, verify the body
  5. DELETE it

Rules that keep this from becoming its own incident:

  · A DEDICATED account, marked as such, excluded from
    analytics and from business metrics (lesson 4.5 — it
    would otherwise inflate notes_created_total).
  · It CLEANS UP. A synthetic check that leaves rows behind
    is a slow-motion disk-fill.
  · Every 5 minutes, not every 30 seconds. This writes to
    production.
  · Its own alert channel. A synthetic failure means
    "a whole user journey is broken", which is more serious
    than a single probe and deserves different routing.</code></pre>

<h3>What to check, in priority order</h3>
<pre><code>1. The public homepage returns 200 over HTTPS.
   Covers layers 1–5 in one request. If you do exactly one
   external check, this is it.

2. Certificate expiry &gt; 14 days.
   Cheap, and the failure it prevents is total.

3. One authenticated API route returns 401 (not 404, not 502).
   Proves nginx routes to a live backend with routes mounted —
   lesson 8.4's assertion, from outside.

4. The full synthetic journey.
   Only after 1–3 exist and are stable.</code></pre>

<div class="pitfall">
<p><strong>Trap — an external check that runs from one place tells you about that place, not about your service.</strong> A single checker in one region goes red when its own network path has a problem, and the alert says your site is down when it is serving everyone else perfectly — a false alarm that, repeated, is exactly how a team learns to ignore uptime alerts. The failure runs the other way too, and it is quieter: a check from one region stays green through a routing problem that makes you unreachable from an entire country, and nothing tells you. <strong>The rule is to alert on agreement, not on any single failure</strong> — two or more locations failing before it pages anyone. If you only have one checker, say so out loud when it fires: &quot;GitHub's runner cannot reach us&quot; is a different claim from &quot;we are down&quot;, and confusing the two costs more trust than the outage would.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://letsencrypt.org/docs/expiration-emails/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Let's Encrypt — expiration and renewal</span><span class="lc-sub">The 90-day lifetime, why the expiry emails are being phased out, and why an active check beats relying on a notification.</span></span>
</a>
<a class="link-card dl" href="https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule" target="_blank" rel="noopener">
  <span class="lc-ico">⏰</span>
  <span class="lc-body"><span class="lc-title">GitHub Actions — scheduled workflows</span><span class="lc-sub">Cron syntax, the delay behaviour under load, and the inactivity rule that disables schedules — the caveats from this lesson.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Kiểm từ bên ngoài, chỗ người dùng đứng</h2>
<p class="lead">Bài 8.4 kết thúc ở một điểm mù cụ thể: mọi phép kiểm trong kho này đều chạy bên trong container. Bài này đếm những tầng mà các phép kiểm ấy bỏ qua, và dựng ra thứ nhỏ nhất phủ được chúng.</p>

<h3>Bảy tầng giữa một người dùng và mã của bạn</h3>
<pre><code>  trình duyệt người dùng
       │  1. Phân giải DNS           ← cuongthai.com → IP nào?
       │  2. Cloudflare / CDN        ← origin có bị đánh dấu chết không?
       │  3. TCP tới VPS             ← tường lửa, cổng 443 có mở không?
       │  4. Bắt tay TLS             ← chứng chỉ còn hạn không?
       │  5. nginx                   ← đúng khối location? upstream sống?
       │  6. Mạng Docker             ← với tới container theo tên được không?
       │  7. Node / Express          ← ← ← mọi phép kiểm nội bộ
  ứng dụng của bạn                         bắt đầu TỪ ĐÂY

Tầng 1–5 là vô hình với /health, /health/live, /health/ready VÀ
cả bài kiểm khói lúc deploy. Cả bốn thứ đó đều bắt đầu ở tầng 7.</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một chứng chỉ hết hạn là một sự cố toàn phần</span><span class="lz-d">Mọi trình duyệt đều từ chối kết nối. Nhìn từ bên trong: mọi thứ 200. Let's Encrypt là 90 ngày, và một cron gia hạn âm thầm ngừng chạy là phiên bản kinh điển của chuyện này.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Một khối <code>location</code> sai của nginx định tuyến vào hư vô</span><span class="lz-d">Container hoàn hảo. Request không bao giờ tới nó. Đây chính là bộ dạng của một mã 502 với log backend sạch bong — sự cố ở bài 3.5, ở một hương vị khác.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">DNS vẫn trỏ vào cái VPS cũ</span><span class="lz-d">Bản deploy mới của bạn hoàn mỹ và chẳng ai đang nói chuyện với nó. Các phép kiểm nội bộ đều qua, trên một cái máy không nhận được chút lưu lượng nào.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cloudflare đã đánh dấu origin của bạn là chết</span><span class="lz-d">Nó phục vụ một trang lỗi. VPS của bạn thấy không request nào, nên mọi chỉ số đều xanh — cú hỏng &quot;ngày Chủ nhật vắng vẻ&quot; ở bài 4.5, giờ có nguyên nhân.</span></div>
</div>

<h3>Phép kiểm bên ngoài nhỏ nhất mà hữu ích</h3>
<pre><code class="language-yaml"># .github/workflows/uptime.yml — chạy trên hạ tầng của GitHub,
# và đó chính là mấu chốt: nó không phải VPS của bạn.
name: External uptime check
on:
  schedule: [{ cron: '*/15 * * * *' }]     # mười lăm phút một lần
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-24.04
    steps:
      - name: HTTPS công khai với tới được, chứng chỉ hợp lệ, route đã gắn
        run: |
          # -f trượt khi gặp 4xx/5xx, và curl mặc định trượt khi chứng chỉ sai
          code=$(curl -sS -o /dev/null -w '%{http_code}' \\
                 --max-time 10 https://cuongthai.com/api/v1/courses)
          echo "courses → $code"
          [ "$code" = "200" ] || [ "$code" = "401" ] || exit 1

      - name: Chứng chỉ còn hơn 14 ngày
        run: |
          end=$(echo | openssl s_client -servername cuongthai.com \\
                -connect cuongthai.com:443 2&gt;/dev/null \\
                | openssl x509 -noout -enddate | cut -d= -f2)
          left=$(( ($(date -d "$end" +%s) - $(date +%s)) / 86400 ))
          echo "chứng chỉ hết hạn sau $left ngày"
          [ "$left" -gt 14 ] || exit 1</code></pre>
<pre><code>Vì sao dùng GitHub Actions chứ không phải một dịch vụ theo dõi:

  ✅ Hạ tầng KHÁC với cái thứ đang bị canh chừng — đó là tính
     chất duy nhất thật sự quan trọng ở đây
  ✅ Vốn đã cấu hình sẵn trong kho này, có sẵn bí mật, và nó vốn
     đã chạy một cron dọn dẹp VPS hằng tuần
  ✅ Thông báo khi trượt đi tới một chỗ người ta có đọc

  ⚠️ Workflow theo lịch có thể bị trễ vài phút khi tải cao, và
     GitHub tự tắt chúng trên những kho không hoạt động. Ổn với
     một phép kiểm 15 phút; không thay thế được một dịch vụ theo
     dõi thật nếu từng phút là quan trọng.</code></pre>

<h3>Xếp tầng phép chẩn đoán vào một lệnh</h3>
<pre><code class="language-bash">curl -sS -o /dev/null -w \\
  'dns:%{time_namelookup}s tcp:%{time_connect}s tls:%{time_appconnect}s \\
   ttfb:%{time_starttransfer}s total:%{time_total}s code:%{http_code}\\n' \\
  https://cuongthai.com/api/v1/courses</code></pre>
<div class="out">dns:0.021s tcp:0.089s tls:0.198s ttfb:0.412s total:0.415s code:200</div>
<pre><code>Mỗi con số cô lập một tầng, nên một lệnh duy nhất nói cho bạn
biết thời gian đi ĐÂU:

  time_namelookup cao     → DNS. Bộ phân giải, hoặc TTL thấp
                             cộng một máy chủ uỷ quyền chậm.
  time_connect cao        → đường mạng, hoặc VPS đang từ chối
                             kết nối.
  time_appconnect cao     → bắt tay TLS. Thường là một lượt lấy
                             OCSP chậm hoặc một chuỗi chứng chỉ dài.
  ttfb − appconnect cao   → nginx + ứng dụng của bạn. ĐÂY là
                             phần duy nhất mà các phép kiểm nội
                             bộ của bạn nhìn thấy được.
  total − ttfb cao        → truyền phần thân phản hồi. Payload
                             lớn, hoặc đường truyền client chậm.

Hãy chạy nó trong lúc sự cố TRƯỚC KHI đụng vào bất cứ thứ gì: nó
nói cho bạn trong một giây rằng vấn đề có phải của bạn không.</code></pre>

<h3>Theo dõi tổng hợp: phép kiểm mức 3, một cách an toàn</h3>
<pre><code>Bài 8.4 loại mức 3 khỏi các lượt thăm dò sức khoẻ. Nó thuộc về
CHỖ NÀY, chạy từ bên ngoài, theo lịch, với một tài khoản thật:

  1. POST /auth/login với một tài khoản chuyên để theo dõi
  2. GET  /api/v1/notes với cái token đó
  3. POST /api/v1/notes  { title: 'synthetic-check' }
  4. GET  đọc lại nó, kiểm phần thân
  5. DELETE xoá nó đi

Những luật giữ cho việc này khỏi trở thành sự cố của chính nó:

  · Một tài khoản RIÊNG, có đánh dấu rõ, loại khỏi phần phân
    tích và khỏi các chỉ số nghiệp vụ (bài 4.5 — không thì nó
    sẽ thổi phồng notes_created_total).
  · Nó DỌN DẸP. Một phép kiểm tổng hợp để lại hàng dữ liệu là
    một cú làm đầy đĩa quay chậm.
  · Năm phút một lần, không phải ba mươi giây một lần. Cái này
    GHI lên production.
  · Kênh cảnh báo riêng của nó. Một cú trượt tổng hợp nghĩa là
    "cả một hành trình người dùng đã hỏng", nghiêm trọng hơn một
    lượt thăm dò đơn lẻ và xứng đáng được định tuyến khác đi.</code></pre>

<h3>Kiểm cái gì, xếp theo thứ tự ưu tiên</h3>
<pre><code>1. Trang chủ công khai trả 200 qua HTTPS.
   Phủ tầng 1–5 trong một request. Nếu bạn chỉ làm đúng MỘT phép
   kiểm bên ngoài thì chính là cái này.

2. Chứng chỉ còn hạn hơn 14 ngày.
   Rẻ, và cú hỏng mà nó ngăn được là toàn phần.

3. Một route API cần xác thực trả về 401 (không phải 404, không
   phải 502). Chứng minh nginx định tuyến tới một backend còn
   sống với route đã gắn — điều khẳng định của bài 8.4, nhìn từ
   bên ngoài.

4. Trọn hành trình tổng hợp.
   Chỉ làm sau khi 1–3 đã có và đã ổn định.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — một phép kiểm bên ngoài chạy từ MỘT chỗ thì nói cho bạn về CHỖ ĐÓ, không nói về dịch vụ của bạn.</strong> Một bộ kiểm đơn lẻ ở một vùng sẽ đỏ khi chính đường mạng của nó có vấn đề, và cái cảnh báo nói rằng trang của bạn chết trong khi nó đang phục vụ mọi người khác một cách hoàn hảo — một báo động giả mà nếu lặp lại thì đó chính xác là cách một đội học được thói quen lờ đi các cảnh báo thời gian sống. Cú hỏng cũng chạy theo chiều ngược lại, và chiều đó lặng lẽ hơn: một phép kiểm từ một vùng vẫn xanh qua một sự cố định tuyến làm bạn không với tới được từ nguyên một quốc gia, và chẳng có gì báo cho bạn. <strong>Luật ở đây là cảnh báo theo SỰ ĐỒNG THUẬN, không theo một cú trượt đơn lẻ nào</strong> — hai vị trí trở lên cùng trượt thì mới gọi ai đó dậy. Nếu bạn chỉ có một bộ kiểm thì hãy nói thẳng điều đó ra khi nó nổ: &quot;runner của GitHub không với tới được chúng ta&quot; là một khẳng định khác với &quot;chúng ta đang chết&quot;, và lẫn lộn hai cái đó tốn nhiều lòng tin hơn cả cái sự cố.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://letsencrypt.org/docs/expiration-emails/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Let's Encrypt — hết hạn và gia hạn</span><span class="lc-sub">Vòng đời 90 ngày, vì sao email báo hết hạn đang bị bỏ dần, và vì sao một phép kiểm chủ động hơn hẳn việc trông chờ một cái thông báo.</span></span>
</a>
<a class="link-card dl" href="https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule" target="_blank" rel="noopener">
  <span class="lc-ico">⏰</span>
  <span class="lc-body"><span class="lc-title">GitHub Actions — workflow theo lịch</span><span class="lc-sub">Cú pháp cron, hành vi bị trễ khi tải cao, và cái luật không-hoạt-động làm tắt lịch chạy — những điều dè chừng ở bài này.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '8.6 — Chapter 8 quiz|||8.6 — Kiểm tra chương 8',
      slug: 'obs-8-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về liveness so với readiness, cửa sổ deploy, độ sâu phép kiểm và điểm mù từ bên trong.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 8 · Quiz</span><h2>Six questions on health checks</h2><p class="lead">Three of these describe a check that is green while the service is down. That combination is the entire subject of this chapter.</p></div><div class="ml-vi"><span class="eyebrow">Chương 8 · Kiểm tra</span><h2>Sáu câu về phép kiểm sức khoẻ</h2><p class="lead">Ba câu trong đây mô tả một phép kiểm màu xanh trong khi dịch vụ thì chết. Tổ hợp đó là toàn bộ chủ đề của chương này.</p></div>`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'Why must a liveness probe never check the database?|||Vì sao một lượt thăm dò liveness không bao giờ được kiểm cơ sở dữ liệu?',
            options: [
              'Because failing liveness means "restart me", and restarting cannot fix an unreachable database — it makes it worse: every container is killed, each restart opens nine new pool connections at once, and the database that was briefly struggling now takes a connection storm. A 20-second hiccup becomes a 10-minute outage caused by the health check.|||Vì trượt liveness nghĩa là "khởi động lại tôi", mà khởi động lại thì không chữa được một cơ sở dữ liệu không với tới — nó còn làm tệ hơn: mọi container đều bị giết, mỗi lần khởi động lại mở ngay chín kết nối bể mới, và cái cơ sở dữ liệu vốn chỉ hơi khó thở giờ nhận một cơn bão kết nối. Một cú nấc 20 giây thành một sự cố 10 phút do chính phép kiểm sức khoẻ gây ra.',
              'Because SELECT 1 is too slow for a 5-second timeout|||Vì SELECT 1 quá chậm so với ngưỡng 5 giây',
              'Because liveness probes cannot make async calls|||Vì lượt thăm dò liveness không gọi bất đồng bộ được',
              'It is fine to check it, as long as the timeout is short|||Kiểm nó cũng được, miễn là ngưỡng thời gian ngắn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repo\'s docker-compose healthcheck curls /health, not /health/live. What is the consequence?|||Healthcheck trong docker-compose của kho này gọi /health, không gọi /health/live. Hệ quả là gì?',
            options: [
              '/health runs SELECT 1, so a brief Postgres stall fails three probes in 30 seconds and Docker restarts a perfectly healthy Node process — killing in-flight requests and discarding the container log that explained the stall. /health/live, which exists for exactly this and returns unconditionally, has no consumer.|||/health chạy SELECT 1, nên một cú đứng ngắn của Postgres làm trượt ba lượt thăm dò trong 30 giây và Docker khởi động lại một tiến trình Node hoàn toàn khoẻ mạnh — giết các request đang bay và vứt luôn cái log container giải thích cú đứng ấy. Còn /health/live, thứ tồn tại đúng cho việc này và trả về vô điều kiện, thì không có ai dùng.',
              'None — the two endpoints return the same JSON|||Không có gì — hai endpoint trả về cùng một JSON',
              'The healthcheck runs slower, adding load to Postgres|||Healthcheck chạy chậm hơn, thêm tải cho Postgres',
              'Docker will refuse to start the container|||Docker sẽ từ chối khởi động container',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why should a graceful shutdown fail readiness and then WAIT before calling server.close()?|||Vì sao một lần tắt máy tử tế nên cho readiness trượt rồi CHỜ trước khi gọi server.close()?',
            options: [
              'Because the load balancer learns you are unready by polling, not by being told — so between SIGTERM and its next few failed checks it keeps routing to a socket that has stopped accepting, and every one of those is a 502. The honest wait is the readiness interval times the failure threshold, plus margin.|||Vì bộ cân bằng tải biết bạn chưa sẵn sàng bằng cách HỎI ĐỀU chứ không phải được báo — nên trong khoảng giữa SIGTERM và vài lượt kiểm trượt kế tiếp của nó, nó vẫn định tuyến tới một socket đã thôi nhận, và mỗi cái đó là một mã 502. Mức chờ trung thực là chu kỳ kiểm readiness nhân số lần trượt, cộng một biên.',
              'To give in-flight database transactions time to commit|||Để các giao dịch cơ sở dữ liệu đang bay kịp commit',
              'Because server.close() cannot be called from a signal handler|||Vì server.close() không gọi được từ một trình xử lý tín hiệu',
              'It should not wait — waiting delays the deploy for no benefit|||Không nên chờ — chờ chỉ làm chậm deploy mà chẳng được gì',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'deploy.sh smoke-tests 52 routes out of 942 declarations, asserting non-404. Why is 5.5% the right coverage?|||deploy.sh kiểm khói 52 route trên 942 khai báo, khẳng định không-404. Vì sao 5,5% là độ phủ đúng?',
            options: [
              'Because it is not testing routes — it is testing that each router MODULE got mounted, and one route per module proves that. Asserting non-404 rather than 200 lets it cover authenticated routes with no credentials, since 401 also proves the router exists. Adding the other 890 would multiply runtime by eighteen and catch nothing new.|||Vì nó không kiểm các route — nó kiểm rằng mỗi MODULE router đã được gắn, và một route cho mỗi module chứng minh được điều đó. Khẳng định không-404 thay vì 200 cho phép nó phủ cả những route cần xác thực mà không cần thông tin đăng nhập nào, vì 401 cũng chứng minh được router tồn tại. Thêm 890 cái còn lại thì nhân thời gian chạy lên mười tám lần và chẳng bắt được gì mới.',
              'Because testing more routes would slow the deploy past its timeout|||Vì kiểm nhiều route hơn sẽ làm deploy chậm quá ngưỡng',
              'Because the other 890 routes are all POST-only|||Vì 890 route còn lại đều chỉ nhận POST',
              'It is not the right coverage — every route should be checked|||Đó không phải độ phủ đúng — nên kiểm mọi route',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The smoke test says all 52 routes are mounted. The site is down for every user. What could be true?|||Bài kiểm khói nói cả 52 route đã được gắn. Trang thì chết với mọi người dùng. Điều gì có thể đang đúng?',
            options: [
              'Any of layers 1 to 5: an expired TLS certificate, a wrong nginx location block, DNS pointing at the old VPS, a firewall dropping 443, or Cloudflare marking the origin down. Every internal check — including the smoke test, which runs via docker exec against localhost — starts at layer 7 and bypasses all of them.|||Bất cứ tầng nào trong tầng 1 tới 5: một chứng chỉ TLS hết hạn, một khối location sai của nginx, DNS trỏ vào cái VPS cũ, một luật tường lửa chặn 443, hoặc Cloudflare đánh dấu origin là chết. Mọi phép kiểm nội bộ — kể cả bài kiểm khói, thứ chạy qua docker exec vào localhost — đều bắt đầu ở tầng 7 và đi vòng qua tất cả những tầng đó.',
              'Nothing — if the routes are mounted the site is up|||Không gì cả — route đã gắn thì trang phải sống',
              'The database must be down, which the smoke test does not check|||Cơ sở dữ liệu chắc chắn chết, thứ mà bài kiểm khói không kiểm',
              'The smoke test result is stale and should be re-run|||Kết quả kiểm khói đã cũ và nên chạy lại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A probe returns HTTP 200 with body {"status":"error","database":"disconnected"}. What happens?|||Một lượt thăm dò trả về HTTP 200 với phần thân {"status":"error","database":"disconnected"}. Chuyện gì xảy ra?',
            options: [
              'Nothing — traffic keeps arriving. Orchestrators, load balancers and uptime monitors branch on the status code and almost none parse the JSON, so the probe tells a human something true and tells the machine everything is fine. The status code is the interface; the body is documentation. Verify with curl -w "%{http_code}", not by reading the body.|||Không gì cả — lưu lượng vẫn tiếp tục đổ vào. Bộ điều phối, bộ cân bằng tải và trình theo dõi thời gian sống đều rẽ nhánh theo mã trạng thái và gần như không cái nào bóc JSON, nên lượt thăm dò ấy nói cho một con người một điều đúng và nói cho cái máy rằng mọi thứ vẫn ổn. Mã trạng thái là giao diện; phần thân là tài liệu. Hãy kiểm bằng curl -w "%{http_code}", đừng kiểm bằng cách đọc phần thân.',
              'The orchestrator parses the body and marks it unhealthy|||Bộ điều phối bóc phần thân ra và đánh dấu là không khoẻ',
              'Docker treats any body containing "error" as a failure|||Docker coi mọi phần thân có chữ "error" là một cú trượt',
              'The load balancer retries the probe until it returns 503|||Bộ cân bằng tải thử lại lượt thăm dò cho tới khi nó trả 503',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
