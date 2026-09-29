/**
 * Deploy lên VPS — Mục 0: Một lần deploy thật ra là cái gì.
 * Song ngữ EN/VI qua .ml-en / .ml-vi (số khối phải bằng nhau).
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;. Không <svg> trong bài — hình đi qua slide.
 *
 * Nâng cấp 09/2026: hai bài "Bắt đầu tại đây" (0.5, 0.6) + bài 0.0 slide (deck dv-00, 39 slide) + slide/🧪/🗂/📌 và
 * phần "Đào sâu" trong 0.1–0.4 + quiz 0.7 (10 câu). Output MỚI chạy thật 29/09/2026 trên VPS thí nghiệm (container
 * ubuntu:24.04, OpenSSH 9.6p1, rsync 3.2.7, coreutils 9.4, SSH vào từ Mac M1) và trên Mac (openrsync, curl 8.7.1).
 * Câu cũ đã SỬA vì sai (đo thật): 0.2 "OpenSSH đời mới in prohibit-password" (9.6 vẫn in without-password);
 * 0.3 pkill -f "node src/server.js" trong ssh '…' tự giết shell ⇒ neo "^node …"; 0.4 "ln -sfn = gỡ rồi tạo" chỉ đúng
 * với BusyBox, GNU ln đã đổi tên nguyên tử. Mốc lịch sử / sự cố / giá: kiểm nguồn 29/09/2026, link-card trong bài.
 */
import { gallery, slide } from './_slides.mjs';
const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: 'Section 0 — What a deploy actually is|||Mục 0 — Một lần deploy thật ra là cái gì',
  description: 'Bốn bước, và mỗi bước có kiểu hỏng âm thầm riêng. Mục này đo ba đường vận chuyển mã lên máy chủ bằng byte và giây, rồi đo cái giá của cách tráo phiên bản đơn giản nhất — trên hai ứng dụng chỉ khác nhau đúng một tính chất.',
  lessons: [

    /* ─────────────────── 0.5 · BẮT ĐẦU TẠI ĐÂY (1/2) ─────────────────── */
    {
      title: 'Start here (1/2) — What deploying is, how it evolved, and why it matters to you|||Bắt đầu tại đây (1/2) — Deploy là gì, đã tiến hoá thế nào, và vì sao nó quan trọng với bạn',
      slug: 'deploy-0-5-bat-dau-tai-day',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bài mở cửa cho người chưa từng deploy: deploy, VPS, máy chủ, tên miền là gì (bằng hình ảnh dọn nhà trước), một request thật đi từ tên tới IP tới máy chủ, bảy chỗ chạy web và giá thật 09/2026, ba mươi lăm năm lịch sử từ FTP 1985 tới Vercel 2020 (mọi mốc có nguồn), và deploy giúp gì cho đồ án, CV, phỏng vấn, công việc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>Hello. Before your first deploy, know what it actually is — and why it is worth learning properly</h2>
<p class="lead">Welcome. Maybe you have built a web app that only ever ran on <code>localhost:3000</code>. Maybe your group's project "works on my machine" and nobody else's. Or maybe you have deployed once — pasted commands from a tutorial onto a server, watched a wall of text scroll past, and the site came up without you knowing why, which also means you will not know why when it goes down. This lesson is the front door. Nothing to memorise: in about twenty-five minutes you will know what deploying, a VPS, a server and a domain are, where you can run a website and what each option costs you, how thirty-five years of history got us here, and what this skill does for you — at school, in interviews and at work.</p>
<p>This lesson and the next are the start of the course. The next one tells real stories of deploys that went wrong — with official sources — and gives you a way to practise where breaking things costs nothing. After that, lessons 0.1–0.4 measure the four steps of every deploy on a real SSH server.</p>

<h3>An everyday picture first: moving into a rented apartment</h3>
${slide('dv-00', 3, 'Deploy giống dọn nhà sang căn hộ thuê')}
<p>Forget the jargon for a minute. You live in a small room: your laptop. Your furniture is your code. Only you can walk in, and when you close the laptop, the room disappears. Now you want friends — hundreds of them, at any hour — to visit. They cannot come into your room. So you rent an apartment that is open all day and night, pack your things into labelled boxes, hire a truck, carry the boxes in, set everything up, and then check that the lights actually turn on before you hand out the address.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">📦 The labelled boxes</span><span class="v">The <strong>artifact</strong>: exactly the things you decided to move — a git commit, a tarball, a container image. Not "whatever happened to be on the floor".</span></div>
  <div class="kv"><span class="k">🚚 The truck</span><span class="v"><strong>Transport</strong>: <code>rsync</code>, <code>git</code>, <code>scp</code>, <code>docker pull</code> — how the boxes reach the new place.</span></div>
  <div class="kv"><span class="k">🏢 The rented apartment</span><span class="v">A <strong>server</strong>: a computer that is always on and always connected. A <strong>VPS</strong> (virtual private server) is a slice of a big physical machine that behaves like your own computer, rented by the month.</span></div>
  <div class="kv"><span class="k">🪧 The street address</span><span class="v">A <strong>domain name</strong> such as <code>example.com</code>. People remember names; the network needs numbers (IP addresses). <strong>DNS</strong> is the phone book that turns one into the other.</span></div>
</div>
<p>Now the definition, and it will make sense: <strong>deploying</strong> is taking a new version of your software from the machine where you wrote it to a machine that is always on, making it the version that answers requests, and proving that it does. The last clause is the one people skip, and most of this course is about why you cannot.</p>
<div class="callout ok"><strong>One sentence to keep:</strong> a deploy is four steps — decide what ships (artifact), move it (transport), make it live (swap), prove it works (verify). Every tool you will ever meet, from a ten-line script to a thousand-line CI pipeline, is doing these four things.</div>

<h3>Follow one real request</h3>
${slide('dv-00', 4, 'Một request thật đi qua tên miền, IP, máy chủ')}
<p>Here is what happens when a browser opens <code>https://example.com</code>, recorded on a Mac on a school network in September 2026:</p>
<pre><code class="language-bash">dig example.com A +noall +answer
curl -sI https://example.com | head -4
curl -s -o /dev/null -w 'dns %{time_namelookup}s | tcp %{time_connect}s | tls %{time_appconnect}s | tong %{time_total}s | ma %{http_code} | ip %{remote_ip}\\n' https://example.com</code></pre>
<div class="out">example.com.		7	IN	A	104.20.23.154
example.com.		7	IN	A	172.66.147.243
HTTP/2 200
date: Tue, 29 Sep 2026 01:07:25 GMT
content-type: text/html; charset=utf-8
server: cloudflare
dns 0.003685s | tcp 0.038726s | tls 0.099313s | tong 0.140719s | ma 200 | ip 104.20.23.154</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Name → number</span><span class="v">DNS answered with two IP addresses. The <code>7</code> is the TTL: the answer may be cached for 7 seconds. When someone says "I changed the DNS and nothing happened", this number is usually why (Chapter 12).</span></div>
  <div class="kv"><span class="k">Connection</span><span class="v">TCP was open after 39 ms and encryption (TLS) after 99 ms. None of this is your application yet.</span></div>
  <div class="kv"><span class="k">The answer</span><span class="v"><code>HTTP/2 200</code> — success. The <code>server: cloudflare</code> header says a CDN answered, not the origin machine.</span></div>
  <div class="kv"><span class="k">Where your deploy lives</span><span class="v">Behind all of that, on one machine, a process listens on a port. Your deploy changes that process. If DNS, TLS or the proxy in front is broken, users still see "the site is down" — which is why this course eventually covers all of them.</span></div>
</div>

<h3>Seven places a website can run</h3>
${slide('dv-00', 5, 'Bảy chỗ chạy web: càng cao càng ít việc, ít quyền')}
<p>"Where should we deploy?" has seven common answers. The honest way to compare them is not by brand but by one question: <em>what do you still have to look after, and what does someone else look after for you?</em></p>
<table>
  <tr><th>Option</th><th>You manage</th><th>They manage</th><th>Entry price (checked 09/2026)</th><th>Good for</th></tr>
  <tr><td><strong>Shared hosting</strong></td><td>Your PHP/HTML files</td><td>The machine, web server, PHP version</td><td>Cheapest; you share one server with many sites</td><td>Blogs, simple sites</td></tr>
  <tr><td><strong>VPS</strong></td><td>Everything from the operating system up</td><td>Hardware, power, network</td><td>DigitalOcean from $4/month (512 MiB); Hetzner CX23 €5.49/month (excl. VAT, IPv4)</td><td>Learning deploys, group projects, small products</td></tr>
  <tr><td><strong>Dedicated server</strong></td><td>A whole physical machine</td><td>The data centre</td><td>The most expensive per month</td><td>Large, steady load</td></tr>
  <tr><td><strong>Cloud IaaS</strong> (AWS EC2…)</td><td>Like a VPS, plus networks and permissions</td><td>Hardware, APIs</td><td>Per hour/second</td><td>When you need to scale or use the provider's other services</td></tr>
  <tr><td><strong>PaaS</strong> (Heroku, Render, Vercel…)</td><td>Your code and settings</td><td>Machines, OS, build, swap</td><td>Vercel Hobby $0; Render has a free 512 MB web service</td><td>Fast demos, frontends</td></tr>
  <tr><td><strong>Serverless</strong> (AWS Lambda…)</td><td>Individual functions</td><td>Everything else</td><td>Lambda: 1 million requests/month free</td><td>Occasional, event-driven work</td></tr>
  <tr><td><strong>Kubernetes</strong></td><td>Manifests (and the cluster, if you run it yourself)</td><td>(managed) the control plane</td><td>Costly and complex for one app</td><td>Many services, many machines</td></tr>
</table>
<p>Moving down the table you do less work and see less. On a PaaS you <code>git push</code> and a URL appears — until something breaks and there is no machine to look at. On a VPS every step is yours, which is exactly why it is the right place to <em>learn</em>: once you have done the four steps by hand, every higher option becomes "someone automated steps 2 and 3 for me", and you can tell what they automated. Chapter 14 comes back to choosing between them with real prices.</p>
<div class="note-ct">Prices change often. The figures above were read from the providers' official pages on 29 September 2026: DigitalOcean's pricing page, Hetzner's price-adjustment notice (new prices from 15 June 2026), Vercel's and Render's pricing pages, and AWS Lambda's pricing page. Always check before you pay.</div>

<h3>Thirty-five years in one picture</h3>
${slide('dv-00', 6, 'Dòng thời gian 1985 → 2020')}
<p>Deploying did not start with Docker. Every milestone below removed one manual chore — and each one is still in use somewhere today:</p>
<ul>
<li><strong>1985 — FTP.</strong> RFC 959 (October 1985) standardised the File Transfer Protocol (the first FTP spec, RFC 114, dates from April 1971). For two decades "deploying" meant dragging files onto a server with an FTP client.</li>
<li><strong>1996 — cPanel.</strong> A web control panel made <em>shared hosting</em> — hundreds of sites on one machine — something non-experts could manage.</li>
<li><strong>1999 — VMware Workstation</strong> (VMware was founded in 1998) made virtualisation on ordinary x86 PCs practical: one physical machine, several "machines" inside it.</li>
<li><strong>2003 — Xen and Linode.</strong> Xen's first public release came out in 2003 (its paper, "Xen and the Art of Virtualization", appeared at SOSP that October). Linode, founded the same year, rented VPSes from launch — your own root on a slice of someone else's hardware.</li>
<li><strong>2005–2006 — SwitchTower, renamed Capistrano.</strong> Jamis Buck announced SwitchTower on 5 August 2005; it became Capistrano in March 2006. It popularised the <code>releases/</code> + <code>current</code> layout that Lesson 0.4 measures.</li>
<li><strong>2006 — Amazon EC2</strong> opened as a limited beta in August 2006: machines rented by the hour through an API.</li>
<li><strong>2007 — KVM and Heroku.</strong> KVM was merged into Linux 2.6.20 (released 5 February 2007), putting a hypervisor inside the kernel itself — most VPSes today run on it. Heroku was founded the same year and made "deploy = <code>git push</code>" normal; Salesforce bought it in December 2010.</li>
<li><strong>2011 — DigitalOcean and the Twelve-Factor App.</strong> DigitalOcean was founded in June 2011 (beta January 2012) and made cheap SSD VPSes mainstream. Adam Wiggins of Heroku published the Twelve-Factor App around 2011 — still the clearest statement of how an app should be built to be deployable.</li>
<li><strong>2013 — Docker</strong> was released as open source in March 2013. The artifact became an <em>image</em> that carries its own system libraries.</li>
<li><strong>2014 — Kubernetes, AWS Lambda, Netlify.</strong> Google announced Kubernetes in June 2014 (1.0 in July 2015); AWS announced Lambda on 13 November 2014; Netlify was founded in 2014.</li>
<li><strong>2015 — Let's Encrypt</strong> entered public beta on 3 December 2015: free HTTPS certificates, valid for 90 days by default, issued automatically.</li>
<li><strong>2019 — GitHub Actions</strong> gained CI/CD and became generally available on 13 November 2019: the machine that builds and deploys is now someone else's, triggered by a push.</li>
<li><strong>2020 — Vercel.</strong> ZEIT (founded 2015) renamed itself Vercel in April 2020; "deploy on every push, a preview URL per branch" became the default for frontends.</li>
</ul>
<div class="callout"><strong>What did not change in thirty-five years:</strong> the four steps. FTP did all four by hand. Capistrano scripted the swap. Heroku hid the build and the swap. Docker changed what the artifact is. CI moved the whole thing to another machine. Every tool automated one step and hid it — and a hidden step is exactly where a beginner gets stuck when it breaks.</div>

<h3>Why each step forward happened</h3>
${slide('dv-00', 7, 'Mỗi bước tiến lịch sử bỏ đi một việc làm tay')}
<p>Each generation fixed the most painful failure of the one before. With FTP there was no "version": halfway through an upload the site ran half old code, half new. Capistrano fixed that with one directory per release and a symlink flip. Heroku removed the need to own a server at all, at the price of not being able to see it. Docker attacked "it works on my machine" by shipping the machine's libraries along with the code. CI removed "it only deploys when Cường's laptop is on". Knowing <em>which</em> pain each tool removes is what lets you pick one — and notice when a tool is solving a problem you do not have.</p>

<h3>Why it matters: code is worth something only when someone else can use it</h3>
${slide('dv-00', 8, 'Học deploy giúp gì cho bạn')}
<p>A project on <code>localhost</code> is a private draft. The moment it has a URL, it becomes something a teacher, a recruiter or a user can touch. Concretely, this course pays off in four places:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">🎓 Group projects (SWP391 and friends)</span><span class="v">The committee clicks a real link instead of watching a screen recording. And you stop being the team that says "it worked on my laptop" the night before the defence while the home page is blank.</span></div>
  <div class="kv"><span class="k">📄 Your CV</span><span class="v">"Built and runs X — domain, HTTPS, deployed by script, rolled back twice" is worth more than a list of frameworks, because it proves you finished something and kept it alive.</span></div>
  <div class="kv"><span class="k">💬 Interviews</span><span class="v">Questions such as "how do you deploy?", "how would you roll back?", "when does the migration run?", "the disk is full at 2 a.m. — what do you do?" are common for backend and DevOps roles. This course gives you measured answers, not memorised ones.</span></div>
  <div class="kv"><span class="k">🛠 Work</span><span class="v">Backend, DevOps and SRE engineers deploy daily. The person who understands the four steps is the person who can fix the deploy that just failed — and the one who is trusted to push the button.</span></div>
</div>

<h3>Where this course takes you: 16 parts</h3>
${slide('dv-00', 9, 'Lộ trình 16 phần, bốn cung')}
<p>Section 0 (you are here) → Chapters 1–3: the artifact, transport and the swap, done properly → Chapters 4–7: configuration and secrets, database migrations, rollback, and a deploy script that fails loudly → Chapters 8–11: living on a small machine, monitoring, backups you have actually restored, diagnosis and the core exam → Chapters 12–15, added in September 2026: from a domain name to HTTPS, deploying with containers, a registry and CI, several environments and more than one server, and a capstone where you ship a whole app end to end. The course points to the Linux &amp; Bash, Docker, Nginx and GitHub Actions courses instead of re-teaching them.</p>

<div class="pitfall co-tieu-de"><strong>Two ideas that trip beginners up.</strong> First: "A PaaS means I never need to understand this." It means you do not need to understand it <em>until something breaks</em> — and then you need all of it at once, with less visibility. Second: "Deploying is a one-off chore at the end of the project." It is the thing you will do most often in the project's life. Doing it once by hand, then turning it into a script you trust, is the most time-saving hour of any group project.</div>

<h3>🧪 Practice (10 minutes — guaranteed to work)</h3>
<div class="callout ok"><p><strong>Situation:</strong> before deploying anything, look at a deploy that already works from the outside, and name its pieces. Everything here is read-only and works on macOS, Linux and WSL.</p><ol>
<li>Turn a name into numbers: <code>dig example.com A +noall +answer</code> (Windows without WSL: <code>nslookup example.com</code>). Write down one IP and the TTL.</li>
<li>Ask for only the headers: <code>curl -sI https://example.com | head -4</code>. Note the status line and the <code>server</code> header.</li>
<li>Time the phases with <code>curl -w</code> (the third command in "Follow one real request"). Which phase is the largest on your network?</li>
<li>Repeat steps 1–3 for your school's website or your group's current demo URL, if it has one.</li>
<li>For each site, write one line: "name → IP → who answers (server header) → status code".</li></ol>
<p><strong>Done when:</strong> you have two lines like <code>example.com → 104.20.23.154 → cloudflare → 200</code>, and you can point at which part of that line a deploy of <em>your</em> code would change (only the last hop — the process behind the server).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Deploy</span><span class="v">Taking a new version from your machine to an always-on machine, making it live and proving it works.</span></div>
  <div class="kv"><span class="k">Server</span><span class="v">A computer that is always on and connected, waiting to answer requests.</span></div>
  <div class="kv"><span class="k">VPS (virtual private server)</span><span class="v">A virtual machine with its own OS and root access, carved out of a larger physical server and rented monthly.</span></div>
  <div class="kv"><span class="k">Domain name / DNS</span><span class="v">A human-readable name, and the system that translates it into an IP address.</span></div>
  <div class="kv"><span class="k">Artifact</span><span class="v">The exact bytes that ship: a commit, a tarball, an image.</span></div>
  <div class="kv"><span class="k">PaaS</span><span class="v">Platform as a service: you give it code, it builds, runs and swaps it for you.</span></div>
  <div class="kv"><span class="k">Hypervisor</span><span class="v">The software (Xen, KVM, VMware) that runs several virtual machines on one physical machine.</span></div>
  <div class="kv"><span class="k">CI/CD</span><span class="v">Continuous integration / delivery: another machine builds, tests and deploys your code on every push.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Deploying is four steps — artifact, transport, swap, verify — whatever tool performs them.</li>
<li>A request travels name → IP → connection → your process; your deploy changes only the last hop, but users feel all of them.</li>
<li>Shared hosting, VPS, dedicated, IaaS, PaaS, serverless and Kubernetes differ in what <em>you</em> still manage; a VPS shows you every step, which makes it the place to learn.</li>
<li>From FTP (1985) to Vercel (2020), each tool automated one step and hid it; the four steps themselves never changed.</li>
<li>Code is worth something only when others can use it: a real link for your project, a live product for your CV, measured answers for interviews.</li>
<li>The course has 16 parts: the four steps (0–3), what breaks deploys (4–7), keeping it alive (8–11), and putting it on the internet with containers, CI and several machines (12–15).</li>
</ul>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc959" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">RFC 959 — File Transfer Protocol (October 1985)</span><span class="lc-sub">The FTP standard that "deploying" meant for twenty years.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Xen" target="_blank" rel="noopener">
  <span class="lc-ico">🖥</span>
  <span class="lc-body"><span class="lc-title">Xen — Wikipedia</span><span class="lc-sub">First public release 2003, the SOSP 2003 paper, and how paravirtualisation made cheap VPSes possible.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Kernel-based_Virtual_Machine" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">KVM — Wikipedia</span><span class="lc-sub">Merged into Linux 2.6.20, released 5 February 2007.</span></span>
</a>
<a class="link-card" href="https://aws.amazon.com/about-aws/whats-new/2006/08/24/announcing-amazon-elastic-compute-cloud-amazon-ec2---beta/" target="_blank" rel="noopener">
  <span class="lc-ico">☁️</span>
  <span class="lc-body"><span class="lc-title">Announcing Amazon EC2 (beta) — AWS, August 2006</span><span class="lc-sub">The original announcement of renting machines by the hour.</span></span>
</a>
<a class="link-card" href="https://weblog.jamisbuck.org/2005/8/5/introducing-switchtower.html" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Introducing SwitchTower — Jamis Buck, 5 August 2005</span><span class="lc-sub">The tool that became Capistrano in 2006 and gave us releases/ + current.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Heroku" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">Heroku — Wikipedia</span><span class="lc-sub">Founded 2007, acquired by Salesforce on 8 December 2010.</span></span>
</a>
<a class="link-card" href="https://12factor.net/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">The Twelve-Factor App — Adam Wiggins</span><span class="lc-sub">Twelve short pages on building an app so that it can be deployed; the course returns to factors III, V and XI.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Docker_(software)" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker — Wikipedia</span><span class="lc-sub">Open-sourced in March 2013 after its PyCon debut.</span></span>
</a>
<a class="link-card" href="https://github.blog/news-insights/product-news/github-actions-now-supports-ci-cd/" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">GitHub Actions now supports CI/CD — GitHub Blog</span><span class="lc-sub">Announced August 2019, generally available on 13 November 2019.</span></span>
</a>
<a class="link-card" href="https://www.digitalocean.com/pricing/droplets" target="_blank" rel="noopener">
  <span class="lc-ico">💵</span>
  <span class="lc-body"><span class="lc-title">DigitalOcean — Droplet pricing</span><span class="lc-sub">The $4/month, 512 MiB entry droplet quoted in the table (checked 29/09/2026).</span></span>
</a>
<a class="link-card" href="https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/" target="_blank" rel="noopener">
  <span class="lc-ico">💶</span>
  <span class="lc-body"><span class="lc-title">Hetzner — price adjustment (from 15 June 2026)</span><span class="lc-sub">Where the CX23 figure of €5.49/month comes from.</span></span>
</a>
<a class="link-card" href="https://vercel.com/pricing" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Vercel — pricing</span><span class="lc-sub">The free Hobby plan; Render's pricing page (render.com/pricing) lists a free 512 MB web service.</span></span>
</a>
<a class="link-card" href="https://aws.amazon.com/lambda/pricing/" target="_blank" rel="noopener">
  <span class="lc-ico">λ</span>
  <span class="lc-body"><span class="lc-title">AWS Lambda — pricing</span><span class="lc-sub">One million requests and 400,000 GB-seconds per month in the free tier.</span></span>
</a>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — the machine you are deploying onto</span><span class="lc-sub">/courses/linux-bash/learn${REF} — shell, SSH, permissions and systemd, taught properly so this course does not have to.</span></span></div>
<p class="note-ct"><strong>Next:</strong> "Start here (2/2)" — real deploys that went wrong, from a trading firm that lost more than $460 million in about 45 minutes to a student project whose API returned 502 for seven minutes, and a way to practise where every mistake costs nothing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>Chào bạn. Trước lần deploy đầu tiên, hãy biết nó thật ra là gì — và vì sao đáng học cho đàng hoàng</h2>
<p class="lead">Chào mừng bạn. Có thể bạn đã làm một ứng dụng web chỉ từng chạy trên <code>localhost:3000</code>. Có thể đồ án nhóm của bạn "chạy trên máy em" mà không chạy trên máy ai khác. Hoặc bạn đã từng deploy một lần — dán lệnh từ một bài hướng dẫn lên máy chủ, nhìn một tràng chữ chạy qua, rồi web lên mà bạn không biết vì sao; mà không biết vì sao nó lên thì cũng sẽ không biết vì sao nó sập. Bài này là cửa chính. Không có gì phải học thuộc: trong khoảng hai mươi lăm phút bạn sẽ biết deploy, VPS, máy chủ, tên miền là gì; có thể chạy một website ở những đâu và mỗi lựa chọn bắt bạn trả giá gì; ba mươi lăm năm lịch sử đã đưa chúng ta tới đây ra sao; và kỹ năng này giúp gì cho bạn — ở trường, lúc phỏng vấn và khi đi làm.</p>
<p>Bài này và bài sau là phần mở đầu của khoá. Bài sau kể những lần deploy hỏng CÓ THẬT — kèm nguồn chính thức — và đưa bạn một cách luyện tập mà làm hỏng chẳng tốn gì. Sau đó, bài 0.1–0.4 đo bốn bước của mọi lần deploy trên một máy chủ SSH thật.</p>

<h3>Hình dung trước đã: dọn nhà sang một căn hộ thuê</h3>
${slide('dv-00', 3, 'Deploy giống dọn nhà sang căn hộ thuê')}
<p>Tạm quên thuật ngữ đi. Bạn đang ở một phòng trọ nhỏ: cái laptop. Đồ đạc trong phòng là mã nguồn. Chỉ mình bạn vào được, và gập máy lại là căn phòng biến mất. Giờ bạn muốn bạn bè — hàng trăm người, vào bất cứ giờ nào — ghé chơi. Họ không vào phòng bạn được. Thế là bạn thuê một căn hộ mở cửa cả ngày lẫn đêm, đóng đồ vào những thùng có dán nhãn, thuê xe tải, khiêng thùng vào, bày biện, rồi BẬT THỬ ĐÈN xem có sáng không trước khi đưa địa chỉ cho mọi người.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">📦 Những thùng có dán nhãn</span><span class="v"><strong>Tạo tác (artifact — thứ được gửi đi)</strong>: đúng những thứ bạn ĐÃ QUYẾT ĐỊNH mang theo — một commit git, một tệp nén, một ảnh container. Không phải "thứ gì đang vương vãi trên sàn".</span></div>
  <div class="kv"><span class="k">🚚 Chiếc xe tải</span><span class="v"><strong>Vận chuyển (transport)</strong>: <code>rsync</code>, <code>git</code>, <code>scp</code>, <code>docker pull</code> — cách những cái thùng tới được nhà mới.</span></div>
  <div class="kv"><span class="k">🏢 Căn hộ thuê</span><span class="v">Một <strong>máy chủ (server)</strong>: một cái máy tính luôn bật và luôn nối mạng. <strong>VPS (virtual private server — máy chủ ảo riêng)</strong> là một lát cắt của một máy vật lý lớn, cư xử y như máy của riêng bạn, thuê theo tháng.</span></div>
  <div class="kv"><span class="k">🪧 Địa chỉ nhà</span><span class="v"><strong>Tên miền (domain name)</strong> như <code>example.com</code>. Người nhớ tên; mạng cần số (địa chỉ IP). <strong>DNS (hệ thống tên miền)</strong> là cuốn danh bạ đổi cái này sang cái kia.</span></div>
</div>
<p>Giờ mới tới định nghĩa, và nó sẽ dễ hiểu: <strong>deploy (triển khai)</strong> là đưa một phiên bản mới của phần mềm từ cái máy bạn viết ra nó sang một cái máy luôn bật, làm cho nó thành phiên bản đang trả lời request, và CHỨNG MINH rằng nó đang trả lời. Vế cuối là vế người ta hay bỏ qua, và phần lớn khoá này là về lý do bạn không được bỏ.</p>
<div class="callout ok"><strong>Một câu để nhớ:</strong> deploy là bốn bước — quyết định gửi cái gì (tạo tác), chuyển nó đi (vận chuyển), làm nó thành bản sống (tráo — swap), chứng minh nó chạy (kiểm — verify). Mọi công cụ bạn sẽ gặp, từ script mười dòng tới đường ống CI cả nghìn dòng, đều đang làm đúng bốn việc này.</div>

<h3>Đi theo một request thật</h3>
${slide('dv-00', 4, 'Một request thật đi qua tên miền, IP, máy chủ')}
<p>Đây là chuyện xảy ra khi trình duyệt mở <code>https://example.com</code>, ghi lại trên một máy Mac ở mạng trường tháng 9/2026:</p>
<pre><code class="language-bash">dig example.com A +noall +answer
curl -sI https://example.com | head -4
curl -s -o /dev/null -w 'dns %{time_namelookup}s | tcp %{time_connect}s | tls %{time_appconnect}s | tong %{time_total}s | ma %{http_code} | ip %{remote_ip}\\n' https://example.com</code></pre>
<div class="out">example.com.		7	IN	A	104.20.23.154
example.com.		7	IN	A	172.66.147.243
HTTP/2 200
date: Tue, 29 Sep 2026 01:07:25 GMT
content-type: text/html; charset=utf-8
server: cloudflare
dns 0.003685s | tcp 0.038726s | tls 0.099313s | tong 0.140719s | ma 200 | ip 104.20.23.154</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Tên → số</span><span class="v">DNS trả về hai địa chỉ IP. Số <code>7</code> là TTL (time to live — thời gian được nhớ): câu trả lời được phép lưu đệm 7 giây. Khi ai đó kêu "đổi DNS rồi mà chưa ăn", con số này thường là thủ phạm (Chương 12).</span></div>
  <div class="kv"><span class="k">Kết nối</span><span class="v">TCP mở xong sau 39 ms, lớp mã hoá (TLS) xong sau 99 ms. Chưa có tí nào là ứng dụng của bạn cả.</span></div>
  <div class="kv"><span class="k">Câu trả lời</span><span class="v"><code>HTTP/2 200</code> — thành công. Header <code>server: cloudflare</code> nói rằng một CDN (mạng phân phối nội dung) đã trả lời, không phải máy gốc.</span></div>
  <div class="kv"><span class="k">Lần deploy của bạn nằm ở đâu</span><span class="v">Sau tất cả những thứ đó, trên một cái máy, có một tiến trình nghe ở một cổng. Deploy là thay tiến trình đó. Nếu DNS, TLS hay cái proxy đứng trước hỏng, người dùng vẫn thấy "web sập" — nên cuối cùng khoá này dạy cả chúng.</span></div>
</div>

<h3>Bảy chỗ có thể chạy một website</h3>
${slide('dv-00', 5, 'Bảy chỗ chạy web: càng cao càng ít việc, ít quyền')}
<p>"Deploy lên đâu bây giờ?" có bảy câu trả lời phổ biến. Cách so sánh trung thực không phải theo tên hãng mà theo MỘT câu hỏi: <em>bạn còn phải tự trông cái gì, và người khác trông giúp bạn cái gì?</em></p>
<table>
  <tr><th>Lựa chọn</th><th>BẠN quản</th><th>HỌ quản</th><th>Giá khởi điểm (kiểm 09/2026)</th><th>Hợp với</th></tr>
  <tr><td><strong>Shared hosting (hosting dùng chung)</strong></td><td>Tệp PHP/HTML của bạn</td><td>Cái máy, web server, bản PHP</td><td>Rẻ nhất; một máy chủ chia cho rất nhiều website</td><td>Blog, web đơn giản</td></tr>
  <tr><td><strong>VPS</strong></td><td>Mọi thứ từ hệ điều hành trở lên</td><td>Phần cứng, điện, mạng</td><td>DigitalOcean từ 4 USD/tháng (512 MiB); Hetzner CX23 5,49 €/tháng (chưa VAT, chưa IPv4)</td><td>Học deploy, đồ án nhóm, sản phẩm nhỏ</td></tr>
  <tr><td><strong>Máy chủ riêng (dedicated)</strong></td><td>Cả một máy vật lý</td><td>Trung tâm dữ liệu</td><td>Đắt nhất theo tháng</td><td>Tải lớn, đều đặn</td></tr>
  <tr><td><strong>Cloud IaaS</strong> (AWS EC2…)</td><td>Như VPS, thêm mạng và phân quyền</td><td>Phần cứng, API</td><td>Tính theo giờ/giây</td><td>Cần co giãn hoặc dùng dịch vụ khác của hãng</td></tr>
  <tr><td><strong>PaaS</strong> (Heroku, Render, Vercel…)</td><td>Mã và cấu hình</td><td>Máy, hệ điều hành, build, tráo</td><td>Vercel Hobby 0 USD; Render có web service miễn phí 512 MB</td><td>Demo nhanh, frontend</td></tr>
  <tr><td><strong>Serverless</strong> (AWS Lambda…)</td><td>Từng hàm</td><td>Mọi thứ còn lại</td><td>Lambda: 1 triệu request/tháng miễn phí</td><td>Việc lẻ, chạy theo sự kiện</td></tr>
  <tr><td><strong>Kubernetes</strong></td><td>Manifest (và cả cụm máy, nếu tự dựng)</td><td>(bản managed) phần điều khiển</td><td>Đắt và phức tạp cho một ứng dụng</td><td>Nhiều dịch vụ, nhiều máy</td></tr>
</table>
<p>Càng đi xuống bảng, bạn càng làm ít và càng thấy ít. Trên PaaS bạn <code>git push</code> là có URL — cho tới khi có gì đó hỏng mà chẳng có cái máy nào để nhìn vào. Trên VPS mọi bước là của bạn, và đó chính là lý do nó là chỗ đúng để <em>HỌC</em>: làm bốn bước bằng tay một lần rồi, thì mọi lựa chọn cao hơn đều chỉ còn là "ai đó đã tự động hoá bước 2 và 3 giùm mình", và bạn biết được họ đã tự động hoá cái gì. Chương 14 quay lại chuyện chọn giữa chúng với giá thật.</p>
<div class="note-ct">Giá thay đổi thường xuyên. Các con số ở trên đọc từ trang chính thức của từng hãng ngày 29/09/2026: trang giá của DigitalOcean, thông báo điều chỉnh giá của Hetzner (giá mới từ 15/06/2026), trang giá của Vercel và Render, trang giá AWS Lambda. Luôn kiểm lại trước khi trả tiền.</div>

<h3>Ba mươi lăm năm trong một hình</h3>
${slide('dv-00', 6, 'Dòng thời gian 1985 → 2020')}
<p>Deploy không bắt đầu từ Docker. Mỗi mốc dưới đây gỡ bỏ MỘT việc làm tay — và cái nào cũng vẫn đang được dùng ở đâu đó hôm nay:</p>
<ul>
<li><strong>1985 — FTP.</strong> RFC 959 (tháng 10/1985) chuẩn hoá giao thức truyền tệp FTP (bản đặc tả FTP đầu tiên, RFC 114, có từ tháng 4/1971). Suốt hai thập kỷ, "deploy" nghĩa là kéo thả tệp lên máy chủ bằng một trình FTP.</li>
<li><strong>1996 — cPanel.</strong> Một bảng điều khiển trên web làm cho <em>shared hosting</em> — hàng trăm website trên một máy — thành thứ người không chuyên cũng quản được.</li>
<li><strong>1999 — VMware Workstation</strong> (VMware thành lập năm 1998) làm ảo hoá (virtualization) trên máy x86 thường thành thứ dùng được: một máy vật lý, nhiều "máy" bên trong.</li>
<li><strong>2003 — Xen và Linode.</strong> Xen ra bản công khai đầu tiên năm 2003 (bài báo "Xen and the Art of Virtualization" trình bày ở hội nghị SOSP tháng 10 năm đó). Linode, thành lập cùng năm, cho thuê VPS ngay từ đầu — quyền root của riêng bạn trên một lát phần cứng của người khác.</li>
<li><strong>2005–2006 — SwitchTower, rồi đổi tên thành Capistrano.</strong> Jamis Buck công bố SwitchTower ngày 5/8/2005; tháng 3/2006 nó thành Capistrano. Nó phổ biến bố cục <code>releases/</code> + <code>current</code> mà bài 0.4 đo.</li>
<li><strong>2006 — Amazon EC2</strong> mở bản beta giới hạn tháng 8/2006: thuê máy theo giờ qua một API.</li>
<li><strong>2007 — KVM và Heroku.</strong> KVM được gộp vào Linux 2.6.20 (phát hành 5/2/2007), đặt bộ ảo hoá (hypervisor) ngay trong nhân — phần lớn VPS ngày nay chạy trên nó. Heroku thành lập cùng năm và biến "deploy = <code>git push</code>" thành chuyện bình thường; Salesforce mua lại nó tháng 12/2010.</li>
<li><strong>2011 — DigitalOcean và Twelve-Factor App.</strong> DigitalOcean thành lập tháng 6/2011 (beta tháng 1/2012) và làm VPS ổ SSD giá rẻ thành phổ thông. Adam Wiggins (Heroku) công bố Twelve-Factor App khoảng năm 2011 — tới giờ vẫn là bản phát biểu rõ nhất về cách viết một ứng dụng để deploy được.</li>
<li><strong>2013 — Docker</strong> ra mã nguồn mở tháng 3/2013. Tạo tác trở thành một <em>ảnh (image)</em> mang theo cả thư viện hệ thống của nó.</li>
<li><strong>2014 — Kubernetes, AWS Lambda, Netlify.</strong> Google công bố Kubernetes tháng 6/2014 (bản 1.0 tháng 7/2015); AWS công bố Lambda ngày 13/11/2014; Netlify thành lập năm 2014.</li>
<li><strong>2015 — Let's Encrypt</strong> vào beta công khai ngày 3/12/2015: chứng chỉ HTTPS miễn phí, mặc định sống 90 ngày, cấp tự động.</li>
<li><strong>2019 — GitHub Actions</strong> có CI/CD và chính thức phát hành ngày 13/11/2019: cái máy dựng và deploy giờ là máy của người khác, bấm cò bằng một lần push.</li>
<li><strong>2020 — Vercel.</strong> ZEIT (thành lập 2015) đổi tên thành Vercel tháng 4/2020; "deploy ở mỗi lần push, mỗi nhánh một URL xem trước" thành mặc định cho frontend.</li>
</ul>
<div class="callout"><strong>Thứ KHÔNG đổi suốt ba mươi lăm năm:</strong> bốn bước. FTP làm cả bốn bằng tay. Capistrano viết script cho bước tráo. Heroku giấu bước dựng và bước tráo. Docker đổi bản chất của tạo tác. CI chuyển cả quy trình sang một cái máy khác. Mỗi công cụ tự động hoá một bước rồi GIẤU nó đi — và một bước bị giấu chính là chỗ người mới bị kẹt khi nó hỏng.</div>

<h3>Vì sao từng bước tiến lại xảy ra</h3>
${slide('dv-00', 7, 'Mỗi bước tiến lịch sử bỏ đi một việc làm tay')}
<p>Mỗi thế hệ sửa cái hỏng đau nhất của thế hệ trước. Với FTP chẳng có khái niệm "phiên bản": đang tải lên được nửa chừng thì web chạy nửa mã cũ nửa mã mới. Capistrano sửa bằng mỗi bản phát hành một thư mục và một cú lật symlink. Heroku bỏ luôn việc phải sở hữu máy chủ, đổi lại là không nhìn thấy nó. Docker tấn công câu "máy tôi chạy được" bằng cách gửi luôn thư viện của cái máy đi cùng với mã. CI xoá câu "chỉ deploy được khi laptop của Cường đang bật". Biết mỗi công cụ gỡ đi <em>CÁI ĐAU NÀO</em> là thứ cho phép bạn chọn nó — và nhận ra khi một công cụ đang giải một bài toán bạn không hề có.</p>

<h3>Vì sao quan trọng: mã chỉ có giá trị khi người khác dùng được</h3>
${slide('dv-00', 8, 'Học deploy giúp gì cho bạn')}
<p>Một dự án trên <code>localhost</code> là một bản nháp riêng tư. Khoảnh khắc nó có URL, nó thành thứ mà thầy cô, nhà tuyển dụng hay người dùng chạm vào được. Cụ thể, khoá này trả công ở bốn chỗ:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">🎓 Đồ án nhóm (SWP391 và các môn tương tự)</span><span class="v">Hội đồng bấm một đường link thật thay vì xem video quay màn hình. Và bạn thôi là cái nhóm nói "trên máy em chạy mà" vào tối trước hôm bảo vệ, trong lúc trang chủ trắng xoá.</span></div>
  <div class="kv"><span class="k">📄 CV</span><span class="v">"Tự dựng và vận hành X — có tên miền, HTTPS, deploy bằng script, đã lùi bản hai lần" đáng giá hơn một danh sách framework, vì nó chứng minh bạn làm XONG một thứ và giữ được nó sống.</span></div>
  <div class="kv"><span class="k">💬 Phỏng vấn</span><span class="v">Những câu như "em deploy thế nào?", "lùi bản ra sao?", "migration chạy lúc nào?", "2 giờ sáng đĩa đầy — em làm gì?" rất hay gặp ở vị trí backend và DevOps. Khoá này cho bạn câu trả lời ĐÃ ĐO, không phải câu trả lời học thuộc.</span></div>
  <div class="kv"><span class="k">🛠 Công việc</span><span class="v">Kỹ sư backend, DevOps, SRE (kỹ sư độ tin cậy hệ thống) deploy hằng ngày. Người hiểu bốn bước là người sửa được lần deploy vừa hỏng — và là người được tin giao cái nút bấm.</span></div>
</div>

<h3>Khoá này đưa bạn tới đâu: 16 phần</h3>
${slide('dv-00', 9, 'Lộ trình 16 phần, bốn cung')}
<p>Mục 0 (bạn đang ở đây) → Chương 1–3: tạo tác, vận chuyển và bước tráo, làm cho đúng → Chương 4–7: cấu hình và bí mật, migration cơ sở dữ liệu, lùi bản, và một script deploy biết "hỏng thật to" → Chương 8–11: sống trên một cái máy nhỏ, giám sát, sao lưu đã từng phục hồi thật, chẩn đoán và bài thi phần cốt lõi → Chương 12–15, thêm vào tháng 9/2026: từ tên miền tới HTTPS, deploy bằng container + registry + CI, nhiều môi trường và nhiều hơn một máy chủ, và một dự án cuối khoá đưa trọn một ứng dụng lên từ đầu tới cuối. Khoá trỏ sang các khoá Linux &amp; Bash, Docker, Nginx và GitHub Actions thay vì dạy lại chúng.</p>

<div class="pitfall co-tieu-de"><strong>Hai ý nghĩ làm người mới vấp.</strong> Thứ nhất: "Dùng PaaS là khỏi cần hiểu mấy thứ này." Nghĩa là bạn không cần hiểu nó <em>CHO TỚI KHI có gì đó hỏng</em> — và lúc ấy bạn cần hiểu tất cả cùng một lúc, với ít khả năng nhìn thấy hơn. Thứ hai: "Deploy là việc vặt làm một lần lúc cuối dự án." Nó là việc bạn sẽ làm NHIỀU LẦN NHẤT trong đời một dự án. Làm bằng tay một lần, rồi biến nó thành một script mình tin được, là giờ đồng hồ tiết kiệm thời gian nhất của bất kỳ đồ án nhóm nào.</div>

<h3>🧪 Thực hành (10 phút — chắc chắn làm được)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trước khi deploy thứ gì, hãy nhìn một lần deploy ĐANG chạy từ bên ngoài và gọi tên từng mảnh của nó. Mọi thứ ở đây chỉ đọc, chạy được trên macOS, Linux và WSL.</p><ol>
<li>Đổi tên thành số: <code>dig example.com A +noall +answer</code> (Windows không có WSL: <code>nslookup example.com</code>). Ghi lại một IP và TTL.</li>
<li>Chỉ xin phần header: <code>curl -sI https://example.com | head -4</code>. Ghi dòng trạng thái và header <code>server</code>.</li>
<li>Bấm giờ từng pha bằng <code>curl -w</code> (lệnh thứ ba ở mục "Đi theo một request thật"). Pha nào dài nhất trên mạng của bạn?</li>
<li>Lặp lại bước 1–3 với website của trường bạn, hoặc URL demo hiện tại của nhóm nếu có.</li>
<li>Với mỗi trang, viết một dòng: "tên → IP → ai trả lời (header server) → mã trạng thái".</li></ol>
<p><strong>Đạt khi:</strong> bạn có hai dòng kiểu <code>example.com → 104.20.23.154 → cloudflare → 200</code>, và chỉ ra được phần nào trên dòng đó sẽ thay đổi khi bạn deploy mã CỦA MÌNH (chỉ chặng cuối — cái tiến trình đứng sau máy chủ).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Deploy (triển khai)</span><span class="v">Đưa phiên bản mới từ máy bạn sang một máy luôn bật, làm nó thành bản sống và chứng minh nó chạy.</span></div>
  <div class="kv"><span class="k">Server (máy chủ)</span><span class="v">Một máy tính luôn bật, luôn nối mạng, chờ trả lời request.</span></div>
  <div class="kv"><span class="k">VPS (máy chủ ảo riêng)</span><span class="v">Một máy ảo có hệ điều hành và quyền root riêng, cắt ra từ một máy vật lý lớn, thuê theo tháng.</span></div>
  <div class="kv"><span class="k">Domain name / DNS (tên miền / hệ thống tên miền)</span><span class="v">Cái tên người đọc được, và hệ thống dịch nó ra địa chỉ IP.</span></div>
  <div class="kv"><span class="k">Artifact (tạo tác — thứ được gửi đi)</span><span class="v">Chính xác những byte được gửi: một commit, một tệp nén, một ảnh.</span></div>
  <div class="kv"><span class="k">PaaS (nền tảng dạng dịch vụ)</span><span class="v">Bạn đưa mã, nó tự dựng, chạy và tráo giùm bạn.</span></div>
  <div class="kv"><span class="k">Hypervisor (bộ ảo hoá)</span><span class="v">Phần mềm (Xen, KVM, VMware) chạy nhiều máy ảo trên một máy vật lý.</span></div>
  <div class="kv"><span class="k">CI/CD (tích hợp / phân phối liên tục)</span><span class="v">Một máy khác tự dựng, kiểm thử và deploy mã của bạn ở mỗi lần push.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Deploy là bốn bước — tạo tác, vận chuyển, tráo, kiểm — bất kể công cụ nào làm chúng.</li>
<li>Một request đi tên → IP → kết nối → tiến trình của bạn; deploy chỉ đổi chặng cuối, nhưng người dùng cảm nhận được mọi chặng.</li>
<li>Shared hosting, VPS, máy riêng, IaaS, PaaS, serverless và Kubernetes khác nhau ở chỗ BẠN còn phải trông cái gì; VPS cho bạn thấy mọi bước, nên nó là chỗ để học.</li>
<li>Từ FTP (1985) tới Vercel (2020), mỗi công cụ tự động hoá một bước rồi giấu nó đi; bản thân bốn bước chưa từng đổi.</li>
<li>Mã chỉ có giá trị khi người khác dùng được: link thật cho đồ án, sản phẩm đang chạy cho CV, câu trả lời đã đo cho phỏng vấn.</li>
<li>Khoá có 16 phần: bốn bước (0–3), những thứ làm deploy sập (4–7), giữ nó sống (8–11), và đưa nó ra Internet bằng container, CI và nhiều máy (12–15).</li>
</ul>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc959" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">RFC 959 — File Transfer Protocol (tháng 10/1985)</span><span class="lc-sub">Chuẩn FTP — thứ mà "deploy" từng mang nghĩa suốt hai mươi năm.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Xen" target="_blank" rel="noopener">
  <span class="lc-ico">🖥</span>
  <span class="lc-body"><span class="lc-title">Xen — Wikipedia</span><span class="lc-sub">Bản công khai đầu tiên năm 2003, bài báo SOSP 2003, và cách ảo hoá song song (paravirtualization) làm VPS giá rẻ thành hiện thực.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Kernel-based_Virtual_Machine" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">KVM — Wikipedia</span><span class="lc-sub">Được gộp vào Linux 2.6.20, phát hành ngày 5/2/2007.</span></span>
</a>
<a class="link-card" href="https://aws.amazon.com/about-aws/whats-new/2006/08/24/announcing-amazon-elastic-compute-cloud-amazon-ec2---beta/" target="_blank" rel="noopener">
  <span class="lc-ico">☁️</span>
  <span class="lc-body"><span class="lc-title">Announcing Amazon EC2 (beta) — AWS, tháng 8/2006</span><span class="lc-sub">Thông báo gốc về việc thuê máy theo giờ.</span></span>
</a>
<a class="link-card" href="https://weblog.jamisbuck.org/2005/8/5/introducing-switchtower.html" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Introducing SwitchTower — Jamis Buck, 5/8/2005</span><span class="lc-sub">Công cụ trở thành Capistrano năm 2006 và để lại cho chúng ta bố cục releases/ + current.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Heroku" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">Heroku — Wikipedia</span><span class="lc-sub">Thành lập 2007, Salesforce mua lại ngày 8/12/2010.</span></span>
</a>
<a class="link-card" href="https://12factor.net/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">The Twelve-Factor App — Adam Wiggins</span><span class="lc-sub">Mười hai trang ngắn về cách viết một ứng dụng để deploy được; khoá này quay lại các yếu tố III, V và XI.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Docker_(software)" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker — Wikipedia</span><span class="lc-sub">Ra mã nguồn mở tháng 3/2013 sau lần ra mắt ở PyCon.</span></span>
</a>
<a class="link-card" href="https://github.blog/news-insights/product-news/github-actions-now-supports-ci-cd/" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">GitHub Actions now supports CI/CD — GitHub Blog</span><span class="lc-sub">Công bố tháng 8/2019, chính thức phát hành ngày 13/11/2019.</span></span>
</a>
<a class="link-card" href="https://www.digitalocean.com/pricing/droplets" target="_blank" rel="noopener">
  <span class="lc-ico">💵</span>
  <span class="lc-body"><span class="lc-title">DigitalOcean — giá Droplet</span><span class="lc-sub">Gói 4 USD/tháng, 512 MiB trong bảng (kiểm 29/09/2026).</span></span>
</a>
<a class="link-card" href="https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/" target="_blank" rel="noopener">
  <span class="lc-ico">💶</span>
  <span class="lc-body"><span class="lc-title">Hetzner — điều chỉnh giá (từ 15/06/2026)</span><span class="lc-sub">Nguồn của con số CX23 5,49 €/tháng.</span></span>
</a>
<a class="link-card" href="https://vercel.com/pricing" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Vercel — bảng giá</span><span class="lc-sub">Gói Hobby miễn phí; trang giá của Render (render.com/pricing) có web service miễn phí 512 MB.</span></span>
</a>
<a class="link-card" href="https://aws.amazon.com/lambda/pricing/" target="_blank" rel="noopener">
  <span class="lc-ico">λ</span>
  <span class="lc-body"><span class="lc-title">AWS Lambda — bảng giá</span><span class="lc-sub">Một triệu request và 400.000 GB-giây mỗi tháng trong gói miễn phí.</span></span>
</a>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — cái máy mà bạn deploy lên</span><span class="lc-sub">/courses/linux-bash/learn${REF} — shell, SSH, quyền và systemd, dạy đầy đủ ở đó để khoá này khỏi phải dạy lại.</span></span></div>
<p class="note-ct"><strong>Tiếp theo:</strong> "Bắt đầu tại đây (2/2)" — những lần deploy hỏng có thật, từ một công ty giao dịch mất hơn 460 triệu USD trong khoảng 45 phút tới một dự án sinh viên có API trả 502 suốt bảy phút, và một cách luyện tập mà mọi sai lầm đều chẳng tốn gì.</p>
</div>
`,
    },

    /* ─────────────────── 0.6 · BẮT ĐẦU TẠI ĐÂY (2/2) ─────────────────── */
    {
      title: 'Start here (2/2) — When deploys go wrong: real disasters, and how to learn this without fear|||Bắt đầu tại đây (2/2) — Khi deploy hỏng: những sự cố thật, và cách học mà không sợ',
      slug: 'deploy-0-6-bat-dau-khi-khong-co',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Năm sự cố có thật và kiểm được nguồn (Knight Capital 2012, GitLab 2017, Cloudflare 2019, Facebook 2021, CrowdStrike 2024) cùng sáu sự cố của một dự án sinh viên — mỗi cái một thói quen deploy — rồi vì sao người mới sợ deploy, bốn câu hỏi khi deploy hỏng, và một VPS thí nghiệm dựng lại trong 1,6 giây.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>When deploys go wrong: real disasters, and how to learn this without fear</h2>
<p class="lead">Every story in this lesson really happened, and every one is checked against the organisation's own account or a regulator's findings — links at the end. They are not here to scare you. Each one is a deploy that <em>reported success</em>, or a change pushed everywhere at once, and each one is prevented by a habit this course teaches. After the stories comes the part that matters more: why beginners are afraid of deploying, and a practice setup where breaking a server costs you 1.6 seconds.</p>

<h3>Knight Capital, 1 August 2012: seven servers right, one wrong</h3>
${slide('dv-00', 10, 'Knight Capital 2012: bảy máy đúng, một máy sai')}
<p>Knight Capital was one of the largest traders on the US stock market. For a new exchange programme it deployed new code to SMARS, its order-routing system, which ran on eight servers. According to the U.S. Securities and Exchange Commission's order (Release No. 70694, October 2013), a technician copied the new code by hand and <strong>did not copy it to one of the eight servers</strong>; nobody reviewed the deployment, and there was no written procedure requiring it. The new code reused a flag that, on the one stale server, switched on long-dead logic called Power Peg.</p>
<p>When the market opened on 1 August 2012, that one server began sending orders it was never meant to send. In about 45 minutes Knight executed about 4 million trades in 154 stocks, and — in the SEC's words — "lost more than $460 million". The SEC later fined the firm $12 million.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">What went wrong</span><span class="v">A deploy done by hand, server by server, without a check that every server ended up with the same version.</span></div>
  <div class="kv"><span class="k">What would have prevented it</span><span class="v">The same scripted deploy on every machine; a post-deploy check <em>per server</em> ("which version are you running?"); and a way to stop quickly. None of these is exotic.</span></div>
  <div class="kv"><span class="k">Where this course teaches it</span><span class="v">Chapter 1 (knowing exactly which artifact is live), Chapter 7 (a script that fails loudly), Chapter 14 (deploying to several machines one at a time).</span></div>
</div>

<h3>Four more, each teaching one deploy habit</h3>
${slide('dv-00', 11, 'Bốn sự cố lớn, mỗi cái một bài học deploy')}
<p><strong>GitLab.com, 31 January 2017.</strong> While fighting a database replication problem late at night, an engineer ran a deletion on the <em>primary</em> database server, believing he was on the secondary. According to GitLab's own post-mortem, about 300 GB of data was gone before he stopped it. Then the backups failed one after another: the scheduled dumps had not been working, and disk snapshots were not enabled for the database servers. The data was restored from a copy taken about six hours earlier, so roughly six hours of data — around 5,000 projects, 5,000 comments and 700 new accounts — was lost. <em>Habit:</em> a backup you have never restored is a hope, not a backup (Chapter 10), and know which machine you are on before a destructive command.</p>
<p><strong>Cloudflare, 2 July 2019.</strong> A new rule for Cloudflare's web application firewall contained a regular expression that backtracked enormously. It was deployed to every server worldwide at once, CPU usage jumped to nearly 100%, and Cloudflare's network went down for 27 minutes. Cloudflare's write-up notes that its procedure allowed a non-emergency rule change "to go globally into production without a staged rollout". <em>Habit:</em> roll out in stages and watch between them (Chapters 3 and 14).</p>
<p><strong>Facebook, 4 October 2021.</strong> During routine maintenance, a command meant to assess the capacity of Facebook's backbone network took down every backbone connection. An audit tool that should have blocked the command had a bug. With the data centres unreachable, Facebook's DNS servers withdrew their BGP routes, so the whole company vanished from the internet — including the tools engineers needed to fix it. Wikipedia puts the outage at six to seven hours. <em>Habit:</em> the checker must be checked too; a gate that silently passes is worse than no gate (Chapter 7).</p>
<p><strong>CrowdStrike, 19 July 2024.</strong> At 04:09 UTC CrowdStrike released a content configuration update for its Falcon sensor on Windows; it was reverted at 05:27 UTC. In between, affected machines crashed and could not boot back normally. Microsoft estimated 8.5 million Windows devices were affected. CrowdStrike's own review commits to "a staggered deployment strategy … starting with a canary deployment". <em>Habit:</em> never push a change to everyone at once, and make rollback fast (Chapters 6 and 14).</p>

<h3>The pattern: pushing to everyone at once</h3>
${slide('dv-00', 12, 'Cùng một kiểu hỏng: đẩy ra tất cả cùng lúc')}
<p>Cloudflare and CrowdStrike are the same failure at different scales: a change that went to 100% of machines in one step. The alternative has a name borrowed from coal mines — a <strong>canary</strong> (miners carried a canary; if it stopped singing, they left). You give the new version to a small slice first — one server, one percent of users — watch for errors, and only then continue. If the first step fails, 99% of users never saw it. Your group project on one VPS can do a small version of this: run the new version next to the old one on another port, check it, and only then switch traffic. Chapter 3 builds exactly that.</p>

<h3>Real incidents from one student project</h3>
${slide('dv-00', 13, 'Sự cố thật của một dự án sinh viên')}
<p>Big companies are not the only ones. These come from one student-run site — Next.js, Express, PostgreSQL and nginx in Docker on a 6 GB Ubuntu VPS — deployed almost daily in 2026. Every one of them was a deploy whose log said "success":</p>
<table>
  <tr><th>Date</th><th>What users saw</th><th>Why the deploy "succeeded"</th><th>Chapter</th></tr>
  <tr><td>02/07</td><td>A new route returned 404</td><td>A <code>--no-build</code> deploy copied files but never rebuilt the image; the container kept running the old one</td><td>2, 7</td></tr>
  <tr><td>03/07</td><td>The feed returned 500</td><td>Two deploy workflows triggered by the same push raced each other; the database schema and the running image disagreed</td><td>5, 13</td></tr>
  <tr><td>06/07</td><td><code>Exited(137)</code> and orphan containers</td><td>Two container swaps ran at the same time</td><td>3, 7</td></tr>
  <tr><td>18/08</td><td>Disk full in the middle of a build</td><td>7.6 GB of Docker build cache on the same disk as PostgreSQL</td><td>8</td></tr>
  <tr><td>18/08</td><td>API returned 502 for seven minutes</td><td>The image was built from the wrong Dockerfile: an Alpine (musl) base carrying a Prisma engine built for glibc. Built green, pushed green, swapped green — then restarted forever</td><td>1, 13</td></tr>
  <tr><td>23–25/08</td><td>An nginx change "deployed" but did nothing</td><td><code>nginx.conf</code> is a bind mount outside the image; then it was replaced with <code>mv</code>, and the container kept reading the old inode</td><td>4, 13</td></tr>
</table>
<p>What each one taught became a line in the project's deploy script: a smoke test that fails on 404, a lock against concurrent deploys, a C-library check before pushing an image, a checksum comparison from <em>inside</em> the container. That is the real lesson: incidents are how a deploy script earns its lines.</p>

<h3>Why beginners are afraid of deploying — and the cure for each fear</h3>
${slide('dv-00', 14, 'Vì sao người mới sợ deploy — và cách chữa')}
<div class="kv-grid">
  <div class="kv"><span class="k">💥 "I'll break the real thing"</span><span class="v">Then do not practise on the real thing. The practice below gives you a disposable "VPS" in a container that you can destroy and rebuild in seconds.</span></div>
  <div class="kv"><span class="k">🔍 "The errors make no sense"</span><span class="v">They make sense in a fixed order. Ask four questions — does a request get an answer, is the process alive, is the port open, what does the log say — and one of them always names the problem.</span></div>
  <div class="kv"><span class="k">🧩 "There are too many pieces"</span><span class="v">There are four steps. Every failure belongs to exactly one of them. Name the step before touching anything.</span></div>
  <div class="kv"><span class="k">❓ "I can't tell if it worked"</span><span class="v">"Worked" has one definition in this course: a real route returned the right status code. Not "the script exited 0".</span></div>
</div>

<h3>Reading a failed deploy: four questions, in order</h3>
${slide('dv-00', 15, 'Deploy hỏng: hỏi bốn câu, theo thứ tự')}
<p>A deploy has just "finished" and the site is down. Recorded on the course's practice VPS:</p>
<pre><code class="language-bash">curl -sS http://127.0.0.1:3000/health
pgrep -af "^node"
ss -tlnp | grep :3000
tail -n 3 ~/app.log</code></pre>
<div class="out">curl: (7) Failed to connect to 127.0.0.1 port 3000 after 0 ms: Couldn't connect to server
  (ma thoat curl: 7)
  (ma thoat pgrep: 1)
  (ma thoat grep: 1)
[khoi dong] LOI: thieu bien DATABASE_URL — dung lai</div>
<div class="kv-grid">
  <div class="kv"><span class="k">1. Request</span><span class="v"><code>curl</code> exit 7, "Couldn't connect": nothing is listening. (A 5xx would mean the app is up but failing — a different branch.)</span></div>
  <div class="kv"><span class="k">2. Process</span><span class="v"><code>pgrep</code> finds nothing (exit 1): the application is not running. It started and died.</span></div>
  <div class="kv"><span class="k">3. Port</span><span class="v">Nobody holds port 3000 — consistent with 2.</span></div>
  <div class="kv"><span class="k">4. Log</span><span class="v">The last line is the answer: the <code>DATABASE_URL</code> variable is missing. The fix is configuration (Chapter 4), not code.</span></div>
</div>
<div class="callout ok"><strong>The last line of the log is usually the answer.</strong> Beginners scroll to the top of a log and drown. Programs print the fatal error last, just before they exit. Read from the bottom up.</div>

<h3>A safe place to practise: a "VPS" you can rebuild in 1.6 seconds</h3>
${slide('dv-00', 16, 'Sân tập an toàn: một “VPS” dựng lại trong 1,6 giây')}
<p>You do not need to pay for a server to learn this, and you should not learn it on your group's real one. A container running Ubuntu 24.04 with an SSH server behaves like a fresh VPS: you log in with a key, as a normal user, and nothing you do inside it can touch your laptop. The course calls it the <strong>practice VPS</strong>. Measured on a Mac M1 with Docker Desktop: 59 seconds from nothing to a working SSH login, and — after taking a snapshot of the clean state with <code>docker commit</code> — 1.63 seconds to throw a broken machine away and get a clean one back.</p>
<div class="pitfall co-tieu-de"><strong>"REMOTE HOST IDENTIFICATION HAS CHANGED" — normal here, alarming anywhere else.</strong> Rebuild the practice VPS from scratch and SSH will refuse to connect with a wall of <code>@</code> signs, because the new machine has a new host key. In the sandbox that is expected: remove the old entry with <code>ssh-keygen -R '[127.0.0.1]:2222' -f ./known_hosts</code>. On a real server, the same message means "this is not the machine you connected to last time" — stop and find out why before typing anything. (Rebuilding from the snapshot keeps the same host key, which is one more reason to take the snapshot.)</div>
<p>A rhythm that works: 30–45 minutes per session, one lesson at a time; type every command yourself; break something on purpose in each session and use the four questions to find it; keep a notebook of every error message you have seen and what it meant. Milestones you can tick off: <em>first SSH login with a key</em> → <em>first hand deploy returning 200</em> → <em>first rollback under a minute</em> → <em>first deploy script that stops itself on a failed check</em> → <em>first restore of a backup, timed</em>.</p>

<div class="pitfall co-tieu-de"><strong>Do not learn the wrong lesson from these stories.</strong> The lesson is not "deploying is dangerous, let the platform do it". Every incident above happened to experienced engineers with good tools, and every one is prevented by a small, learnable habit: script the deploy, check every machine, roll out in stages, restore your backups, make checks that can fail. The people who have these habits did not get them from reading — they broke practice servers until the habits were automatic.</div>

<h3>🧪 Practice (10 minutes — build your practice VPS)</h3>
<div class="callout ok"><p><strong>Situation:</strong> you need a server you are allowed to break. Build it, log in, break it on purpose, and get it back. Needs Docker (Docker Desktop on Mac/Windows; on Windows run the commands inside WSL).</p><ol>
<li>Make a folder and a key used only for practice: <code>mkdir -p ~/dv-lab &amp;&amp; cd ~/dv-lab</code>, then <code>ssh-keygen -t ed25519 -N "" -f ./khoa -C lab</code>.</li>
<li>Start the "VPS" and install an SSH server and a <code>deploy</code> user (block below, about one minute).</li>
<li>Take a snapshot of the clean state: <code>docker commit lab-vps lab-sach</code>, then start SSH and log in.</li>
<li>Break it: <code>docker exec lab-vps rm -rf /home/deploy/.ssh</code>, then try to log in again. Read the error.</li>
<li>Rebuild from the snapshot and log in again.</li></ol>
<pre><code class="language-bash">docker run -d --name lab-vps -p 127.0.0.1:2222:22 ubuntu:24.04 sleep infinity
docker exec lab-vps bash -c 'apt-get update -qq &amp;&amp; DEBIAN_FRONTEND=noninteractive apt-get install -y -qq openssh-server &gt;/dev/null &amp;&amp; mkdir -p /run/sshd &amp;&amp; useradd -m -s /bin/bash deploy &amp;&amp; mkdir -p /home/deploy/.ssh'
docker cp ./khoa.pub lab-vps:/home/deploy/.ssh/authorized_keys
docker exec lab-vps bash -c 'chown -R deploy:deploy /home/deploy/.ssh &amp;&amp; chmod 700 /home/deploy/.ssh &amp;&amp; chmod 600 /home/deploy/.ssh/authorized_keys'
docker commit lab-vps lab-sach
docker exec -d lab-vps /usr/sbin/sshd -D
ssh -i ./khoa -p 2222 -o UserKnownHostsFile=./known_hosts -o StrictHostKeyChecking=accept-new deploy@127.0.0.1 'echo "vao duoc: $(whoami)@$(hostname)"'

<span class="tok-comment"># pha xong? dung lai tu anh sach:</span>
docker rm -f lab-vps &amp;&amp; docker run -d --name lab-vps -p 127.0.0.1:2222:22 lab-sach /usr/sbin/sshd -D</code></pre>
<div class="out">vao duoc: deploy@8e9e28ec7a81
== pha 1: xoa khoa
Permission denied, please try again.
Permission denied, please try again.
deploy@127.0.0.1: Permission denied (publickey,password).
ma thoat: 255
dung lai tu anh sach: 1.63 giay
lai vao duoc: deploy</div>
<p>Real output from the course machine (a Mac M1; the container name and port there were different). The two "please try again" lines are SSH falling back to a password prompt it could not show — a hint for Lesson 0.2, which switches passwords off.</p>
<p>To make later lessons shorter, save this as <code>~/dv-lab/ssh.cfg</code> and use <code>ssh -F ~/dv-lab/ssh.cfg vps</code> from now on — it does not touch your real <code>~/.ssh/config</code>:</p>
<pre><code class="language-ini">Host vps
    HostName 127.0.0.1
    Port 2222
    User deploy
    IdentityFile ~/dv-lab/khoa
    IdentitiesOnly yes
    UserKnownHostsFile ~/dv-lab/known_hosts
    StrictHostKeyChecking accept-new</code></pre>
<p><strong>Done when:</strong> <code>ssh -F ~/dv-lab/ssh.cfg vps whoami</code> prints <code>deploy</code>; after step 4 the same command fails with <code>Permission denied</code>; and after step 5 it prints <code>deploy</code> again — with the rebuild taking a few seconds, not a minute.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Post-mortem</span><span class="v">A written account of an incident after it is over: timeline, cause, what will change. The good ones blame the process, not a person.</span></div>
  <div class="kv"><span class="k">Staged rollout / canary</span><span class="v">Giving a new version to a small slice of servers or users first and continuing only if it stays healthy.</span></div>
  <div class="kv"><span class="k">Rollback</span><span class="v">Returning to the previous version, ideally in seconds and without needing the network.</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">A quick request to a few real routes right after a deploy, whose failure stops or reverts the deploy.</span></div>
  <div class="kv"><span class="k">Host key</span><span class="v">A server's identity for SSH; if it changes unexpectedly, you may not be talking to the machine you think.</span></div>
  <div class="kv"><span class="k">Practice VPS</span><span class="v">A container with Ubuntu and an SSH server that behaves like a fresh VPS and can be rebuilt in seconds.</span></div>
  <div class="kv"><span class="k">Snapshot (<code>docker commit</code>)</span><span class="v">A saved copy of a container's filesystem, used here as a clean starting point.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Knight Capital lost more than $460 million in about 45 minutes because one of eight servers did not receive the new code and nobody checked.</li>
<li>GitLab (backups never restored), Cloudflare (a global push, 27 minutes), Facebook (a checker with a bug, hours offline) and CrowdStrike (an update to everyone, 8.5 million machines) each teach one deploy habit.</li>
<li>Pushing to 100% in one step is the common thread; canary and staged rollouts are the cure, and even one VPS can do a small version.</li>
<li>A student project hit six real incidents in two months, and every one was a deploy that reported success.</li>
<li>When a deploy fails, ask four questions in order — request, process, port, log — and read the log from the bottom.</li>
<li>Practise on a disposable container "VPS": 59 seconds to build, 1.6 seconds to reset from a snapshot, nothing real at risk.</li>
</ul>

<a class="link-card" href="https://www.sec.gov/litigation/admin/2013/34-70694.pdf" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">SEC — In the Matter of Knight Capital Americas LLC (Release No. 70694, 2013)</span><span class="lc-sub">The regulator's findings: the eighth server, the reused flag, 45 minutes, more than $460 million, the $12 million penalty.</span></span>
</a>
<a class="link-card" href="https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/" target="_blank" rel="noopener">
  <span class="lc-ico">🗄</span>
  <span class="lc-body"><span class="lc-title">GitLab — Postmortem of database outage of January 31</span><span class="lc-sub">The deletion on the wrong server, the backups that failed, and the six hours of data that were lost.</span></span>
</a>
<a class="link-card" href="https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Cloudflare — Details of the Cloudflare outage on July 2, 2019</span><span class="lc-sub">The backtracking regular expression, the global push, 27 minutes.</span></span>
</a>
<a class="link-card" href="https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Engineering at Meta — More details about the October 4 outage</span><span class="lc-sub">The maintenance command, the buggy audit tool, and why DNS disappeared with it.</span></span>
</a>
<a class="link-card" href="https://www.crowdstrike.com/en-us/blog/falcon-content-update-preliminary-post-incident-report/" target="_blank" rel="noopener">
  <span class="lc-ico">🖥</span>
  <span class="lc-body"><span class="lc-title">CrowdStrike — Preliminary Post Incident Review</span><span class="lc-sub">04:09 → 05:27 UTC, and the commitment to staggered, canary-first deployment.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/2024_CrowdStrike-related_IT_outages" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">2024 CrowdStrike-related IT outages — Wikipedia</span><span class="lc-sub">Microsoft's estimate of about 8.5 million affected Windows machines, with references.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/2021_Facebook_outage" target="_blank" rel="noopener">
  <span class="lc-ico">⏱</span>
  <span class="lc-body"><span class="lc-title">2021 Facebook outage — Wikipedia</span><span class="lc-sub">The timeline, and the six-to-seven-hour duration the Meta post does not state.</span></span>
</a>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — containers, images and docker commit</span><span class="lc-sub">/courses/docker/learn${REF} — what the practice VPS actually is, and why rebuilding it is so cheap.</span></span></div>
<p class="note-ct"><strong>Next:</strong> the Section 0 slides, then Lesson 0.1 — the four steps of a deploy, each measured in bytes and milliseconds on a real SSH server.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Khi deploy hỏng: những sự cố thật, và cách học mà không sợ</h2>
<p class="lead">Mọi câu chuyện trong bài này đều có thật, và cái nào cũng đã đối chiếu với lời kể của chính tổ chức đó hoặc kết luận của cơ quan quản lý — link ở cuối bài. Chúng không ở đây để doạ bạn. Mỗi cái là một lần deploy <em>BÁO THÀNH CÔNG</em>, hoặc một thay đổi đẩy ra mọi nơi cùng lúc, và cái nào cũng được ngăn bởi một thói quen mà khoá này dạy. Sau các câu chuyện là phần quan trọng hơn: vì sao người mới sợ deploy, và một chỗ tập mà làm hỏng máy chủ chỉ tốn của bạn 1,6 giây.</p>

<h3>Knight Capital, 01/08/2012: bảy máy đúng, một máy sai</h3>
${slide('dv-00', 10, 'Knight Capital 2012: bảy máy đúng, một máy sai')}
<p>Knight Capital từng là một trong những nhà giao dịch lớn nhất thị trường chứng khoán Mỹ. Để tham gia một chương trình mới của sàn, họ deploy mã mới lên SMARS — hệ thống định tuyến lệnh — chạy trên tám máy chủ. Theo quyết định của Uỷ ban Chứng khoán và Giao dịch Hoa Kỳ (SEC, Release No. 70694, tháng 10/2013), một kỹ thuật viên chép mã mới bằng tay và <strong>KHÔNG chép lên một trong tám máy</strong>; không ai rà lại lần deploy đó, và cũng không có quy trình viết thành văn nào đòi phải rà. Mã mới dùng lại một cái cờ (flag) mà trên cái máy cũ còn sót kia lại bật một đoạn logic đã chết từ lâu tên là Power Peg.</p>
<p>Khi thị trường mở cửa sáng 01/08/2012, đúng cái máy đó bắt đầu gửi đi những lệnh không bao giờ lẽ ra được gửi. Trong khoảng 45 phút, Knight khớp khoảng 4 triệu giao dịch trên 154 mã cổ phiếu và — theo chữ của SEC — "lỗ hơn 460 triệu USD". Sau đó SEC phạt công ty 12 triệu USD.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Hỏng ở đâu</span><span class="v">Một lần deploy làm bằng tay, từng máy một, không có phép kiểm nào xác nhận MỌI máy đều chạy cùng một phiên bản.</span></div>
  <div class="kv"><span class="k">Điều gì lẽ ra ngăn được</span><span class="v">Cùng một script deploy chạy trên mọi máy; một phép kiểm sau deploy <em>CHO TỪNG MÁY</em> ("mày đang chạy bản nào?"); và một cách dừng thật nhanh. Chẳng cái nào cao siêu.</span></div>
  <div class="kv"><span class="k">Khoá này dạy nó ở đâu</span><span class="v">Chương 1 (biết chính xác tạo tác nào đang sống), Chương 7 (script hỏng thì la thật to), Chương 14 (deploy lên nhiều máy, lần lượt từng máy).</span></div>
</div>

<h3>Bốn sự cố nữa, mỗi cái dạy một thói quen deploy</h3>
${slide('dv-00', 11, 'Bốn sự cố lớn, mỗi cái một bài học deploy')}
<p><strong>GitLab.com, 31/01/2017.</strong> Đang vật lộn với sự cố sao chép cơ sở dữ liệu lúc khuya, một kỹ sư chạy lệnh xoá trên máy cơ sở dữ liệu <em>CHÍNH</em> vì tưởng mình đang ở máy phụ. Theo bản post-mortem (báo cáo sau sự cố) của chính GitLab, khoảng 300 GB dữ liệu đã mất trước khi anh kịp dừng. Rồi các bản sao lưu lần lượt thất bại: các bản dump định kỳ hoá ra không chạy, còn snapshot đĩa thì chưa từng được bật cho máy cơ sở dữ liệu. Dữ liệu được phục hồi từ một bản chụp khoảng sáu giờ trước đó, nên chừng sáu giờ dữ liệu — khoảng 5.000 dự án, 5.000 bình luận và 700 tài khoản mới — mất hẳn. <em>Thói quen:</em> bản sao lưu chưa từng phục hồi thử là một niềm hy vọng, không phải bản sao lưu (Chương 10); và biết mình đang ở máy nào trước khi gõ một lệnh phá huỷ.</p>
<p><strong>Cloudflare, 02/07/2019.</strong> Một luật mới cho tường lửa ứng dụng web (WAF) của Cloudflare chứa một biểu thức chính quy (regex) quay lui cực nhiều. Nó được đẩy lên mọi máy chủ trên toàn thế giới CÙNG MỘT LÚC, CPU vọt lên gần 100%, và mạng của Cloudflare sập 27 phút. Bài viết của Cloudflare nói rõ quy trình của họ khi đó cho phép một thay đổi luật không khẩn cấp "đi thẳng ra production toàn cầu mà không triển khai theo từng bậc". <em>Thói quen:</em> triển khai từng bậc và quan sát giữa các bậc (Chương 3 và 14).</p>
<p><strong>Facebook, 04/10/2021.</strong> Trong một đợt bảo trì thường lệ, một lệnh dùng để đánh giá dung lượng mạng xương sống (backbone) của Facebook đã cắt MỌI kết nối của mạng đó. Một công cụ kiểm (audit) lẽ ra phải chặn lệnh ấy thì lại có lỗi. Khi các trung tâm dữ liệu không còn liên lạc được, máy chủ DNS của Facebook tự rút các tuyến BGP của mình, nên cả công ty biến mất khỏi Internet — kể cả những công cụ kỹ sư cần để sửa. Wikipedia ghi nhận sự cố kéo dài sáu đến bảy giờ. <em>Thói quen:</em> bộ kiểm cũng phải được kiểm; một cái cổng lặng lẽ cho qua còn tệ hơn không có cổng (Chương 7).</p>
<p><strong>CrowdStrike, 19/07/2024.</strong> Lúc 04:09 UTC, CrowdStrike phát hành một bản cập nhật cấu hình nội dung cho cảm biến Falcon trên Windows; tới 05:27 UTC thì gỡ lại. Trong khoảng đó, các máy bị ảnh hưởng sập và không khởi động lại bình thường được. Microsoft ước tính 8,5 triệu thiết bị Windows bị ảnh hưởng. Bản đánh giá của chính CrowdStrike cam kết "một chiến lược triển khai so le … bắt đầu bằng triển khai canary". <em>Thói quen:</em> đừng bao giờ đẩy một thay đổi tới tất cả mọi người cùng lúc, và làm cho việc lùi bản (rollback) thật nhanh (Chương 6 và 14).</p>

<h3>Mẫu chung: đẩy ra tất cả cùng một lúc</h3>
${slide('dv-00', 12, 'Cùng một kiểu hỏng: đẩy ra tất cả cùng lúc')}
<p>Cloudflare và CrowdStrike là cùng một kiểu hỏng ở hai cỡ khác nhau: một thay đổi đi tới 100% số máy trong MỘT bước. Cách làm ngược lại có cái tên mượn từ mỏ than — <strong>canary (chim hoàng yến)</strong>: thợ mỏ mang theo một con chim, chim ngừng hót là họ rút. Bạn đưa bản mới cho một lát nhỏ trước — một máy, một phần trăm người dùng — theo dõi lỗi, rồi mới đi tiếp. Nếu bậc đầu hỏng, 99% người dùng chưa từng thấy nó. Đồ án nhóm của bạn trên một VPS cũng làm được phiên bản nhỏ của việc này: chạy bản mới cạnh bản cũ ở một cổng khác, kiểm nó, rồi mới chuyển lưu lượng sang. Chương 3 dựng đúng cái đó.</p>

<h3>Sự cố thật của một dự án sinh viên</h3>
${slide('dv-00', 13, 'Sự cố thật của một dự án sinh viên')}
<p>Không chỉ công ty lớn mới gặp. Những chuyện dưới đây đến từ một website do sinh viên tự vận hành — Next.js, Express, PostgreSQL và nginx chạy Docker trên một VPS Ubuntu 6 GB — deploy gần như mỗi ngày trong năm 2026. Cái nào cũng là một lần deploy mà log ghi "thành công":</p>
<table>
  <tr><th>Ngày</th><th>Người dùng thấy gì</th><th>Vì sao deploy "thành công"</th><th>Chương</th></tr>
  <tr><td>02/07</td><td>Một tuyến mới trả 404</td><td>Deploy kiểu <code>--no-build</code> chép tệp mà không dựng lại ảnh; container vẫn chạy ảnh CŨ</td><td>2, 7</td></tr>
  <tr><td>03/07</td><td>Trang feed trả 500</td><td>Hai workflow deploy cùng chạy từ một lần push, đua nhau; lược đồ cơ sở dữ liệu và ảnh đang chạy lệch nhau</td><td>5, 13</td></tr>
  <tr><td>06/07</td><td><code>Exited(137)</code> và container mồ côi</td><td>Hai lần tráo container chạy chồng lên nhau</td><td>3, 7</td></tr>
  <tr><td>18/08</td><td>Đầy đĩa ngay giữa lúc build</td><td>7,6 GB cache build Docker nằm trên chính cái đĩa của PostgreSQL</td><td>8</td></tr>
  <tr><td>18/08</td><td>API trả 502 suốt bảy phút</td><td>Ảnh được dựng từ nhầm Dockerfile: nền Alpine (musl) mang engine Prisma dựng cho glibc. Build xanh, đẩy xanh, tráo xanh — rồi restart vô tận</td><td>1, 13</td></tr>
  <tr><td>23–25/08</td><td>Sửa nginx "đã deploy" mà không có tác dụng</td><td><code>nginx.conf</code> là bind-mount nằm NGOÀI ảnh; rồi nó bị thay bằng <code>mv</code>, và container vẫn đọc inode cũ</td><td>4, 13</td></tr>
</table>
<p>Mỗi bài học trở thành một dòng trong script deploy của dự án: một smoke test (phép thử nhanh sau deploy) hỏng khi gặp 404, một cái khoá chống hai lần deploy chạy chồng, một chốt kiểm thư viện C trước khi đẩy ảnh, một phép so checksum từ <em>BÊN TRONG</em> container. Đó mới là bài học thật: sự cố là cách một script deploy "kiếm" được từng dòng của nó.</p>

<h3>Vì sao người mới sợ deploy — và cách chữa từng nỗi sợ</h3>
${slide('dv-00', 14, 'Vì sao người mới sợ deploy — và cách chữa')}
<div class="kv-grid">
  <div class="kv"><span class="k">💥 "Mình sẽ làm sập đồ thật"</span><span class="v">Vậy thì đừng tập trên đồ thật. Phần thực hành dưới đây cho bạn một "VPS" dùng-xong-vứt trong một container, phá rồi dựng lại trong vài giây.</span></div>
  <div class="kv"><span class="k">🔍 "Lỗi chẳng hiểu gì cả"</span><span class="v">Chúng dễ hiểu nếu hỏi theo một thứ tự cố định. Hỏi bốn câu — request có được trả lời không, tiến trình còn sống không, cổng có mở không, log nói gì — và luôn có một câu gọi đúng tên vấn đề.</span></div>
  <div class="kv"><span class="k">🧩 "Nhiều mảnh ghép quá"</span><span class="v">Chỉ có bốn bước. Mọi cái hỏng đều thuộc ĐÚNG MỘT bước. Gọi tên bước trước khi đụng vào bất cứ thứ gì.</span></div>
  <div class="kv"><span class="k">❓ "Không biết thế là xong chưa"</span><span class="v">"Xong" trong khoá này chỉ có một định nghĩa: một tuyến THẬT trả đúng mã trạng thái. Không phải "script thoát ra 0".</span></div>
</div>

<h3>Đọc một lần deploy hỏng: bốn câu hỏi, theo thứ tự</h3>
${slide('dv-00', 15, 'Deploy hỏng: hỏi bốn câu, theo thứ tự')}
<p>Một lần deploy vừa "xong" và web sập. Ghi lại trên VPS thí nghiệm của khoá:</p>
<pre><code class="language-bash">curl -sS http://127.0.0.1:3000/health
pgrep -af "^node"
ss -tlnp | grep :3000
tail -n 3 ~/app.log</code></pre>
<div class="out">curl: (7) Failed to connect to 127.0.0.1 port 3000 after 0 ms: Couldn't connect to server
  (ma thoat curl: 7)
  (ma thoat pgrep: 1)
  (ma thoat grep: 1)
[khoi dong] LOI: thieu bien DATABASE_URL — dung lai</div>
<div class="kv-grid">
  <div class="kv"><span class="k">1. Request</span><span class="v"><code>curl</code> thoát mã 7, "Couldn't connect": chẳng có ai nghe cả. (Nếu là 5xx thì app ĐANG chạy nhưng trả lỗi — một nhánh khác.)</span></div>
  <div class="kv"><span class="k">2. Tiến trình</span><span class="v"><code>pgrep</code> không tìm thấy gì (mã 1): ứng dụng không chạy. Nó đã khởi động rồi chết.</span></div>
  <div class="kv"><span class="k">3. Cổng</span><span class="v">Không ai giữ cổng 3000 — khớp với câu 2.</span></div>
  <div class="kv"><span class="k">4. Log</span><span class="v">Dòng cuối là câu trả lời: thiếu biến <code>DATABASE_URL</code>. Cách sửa nằm ở cấu hình (Chương 4), không nằm ở mã.</span></div>
</div>
<div class="callout ok"><strong>Dòng CUỐI của log thường là câu trả lời.</strong> Người mới cuộn lên đầu log rồi chết đuối trong đó. Chương trình in lỗi chí mạng SAU CÙNG, ngay trước khi thoát. Đọc từ dưới lên.</div>

<h3>Một chỗ tập an toàn: "VPS" dựng lại trong 1,6 giây</h3>
${slide('dv-00', 16, 'Sân tập an toàn: một “VPS” dựng lại trong 1,6 giây')}
<p>Bạn không cần trả tiền thuê máy chủ để học chuyện này, và KHÔNG nên học nó trên máy thật của nhóm. Một container chạy Ubuntu 24.04 có máy chủ SSH cư xử y như một VPS mới tinh: bạn đăng nhập bằng khoá, dưới một người dùng thường, và chẳng việc gì bạn làm bên trong nó chạm được tới laptop của bạn. Khoá gọi nó là <strong>VPS thí nghiệm</strong>. Đo trên Mac M1 với Docker Desktop: 59 giây từ con số 0 tới lần đăng nhập SSH đầu tiên, và — sau khi chụp trạng thái sạch bằng <code>docker commit</code> — 1,63 giây để vứt một cái máy đã hỏng đi và có lại một cái sạch.</p>
<div class="pitfall co-tieu-de"><strong>"REMOTE HOST IDENTIFICATION HAS CHANGED" — ở đây là bình thường, ở chỗ khác là báo động.</strong> Dựng lại VPS thí nghiệm TỪ ĐẦU là SSH sẽ từ chối kết nối kèm một bức tường dấu <code>@</code>, vì máy mới có khoá máy chủ (host key) mới. Trong sân tập, chuyện đó là đương nhiên: xoá mục cũ bằng <code>ssh-keygen -R '[127.0.0.1]:2222' -f ./known_hosts</code>. Trên một máy chủ THẬT, cùng thông báo đó nghĩa là "đây không phải cái máy bạn kết nối lần trước" — dừng lại và tìm hiểu vì sao trước khi gõ bất cứ thứ gì. (Dựng lại từ ảnh chụp thì giữ nguyên khoá máy chủ — thêm một lý do để chụp.)</div>
<p>Một nhịp học hiệu quả: mỗi buổi 30–45 phút, mỗi lần một bài; tự gõ mọi lệnh; mỗi buổi cố tình làm hỏng một thứ rồi dùng bốn câu hỏi để tìm ra nó; giữ một cuốn sổ ghi mọi thông báo lỗi đã gặp và ý nghĩa của nó. Những mốc bạn đánh dấu được: <em>lần đầu SSH bằng khoá</em> → <em>lần đầu deploy tay ra 200</em> → <em>lần đầu lùi bản dưới một phút</em> → <em>lần đầu script deploy tự dừng vì một phép kiểm hỏng</em> → <em>lần đầu phục hồi một bản sao lưu, có bấm giờ</em>.</p>

<div class="pitfall co-tieu-de"><strong>Đừng rút ra bài học sai từ những câu chuyện này.</strong> Bài học không phải "deploy nguy hiểm, để nền tảng làm cho". Mọi sự cố ở trên đều xảy ra với kỹ sư giàu kinh nghiệm dùng công cụ tốt, và cái nào cũng được ngăn bởi một thói quen nhỏ, học được: viết script cho deploy, kiểm từng máy, triển khai từng bậc, phục hồi thử bản sao lưu, làm những phép kiểm CÓ THỂ hỏng. Người có những thói quen này không có được chúng nhờ đọc — họ làm hỏng máy tập cho tới khi thói quen thành phản xạ.</div>

<h3>🧪 Thực hành (10 phút — dựng VPS thí nghiệm của bạn)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn cần một máy chủ mà mình ĐƯỢC PHÉP phá. Dựng nó, đăng nhập, cố tình phá, rồi lấy lại. Cần Docker (Docker Desktop trên Mac/Windows; trên Windows chạy các lệnh trong WSL).</p><ol>
<li>Tạo thư mục và một khoá chỉ dùng để tập: <code>mkdir -p ~/dv-lab &amp;&amp; cd ~/dv-lab</code>, rồi <code>ssh-keygen -t ed25519 -N "" -f ./khoa -C lab</code>.</li>
<li>Bật "VPS" và cài máy chủ SSH cùng người dùng <code>deploy</code> (khối lệnh dưới, mất khoảng một phút).</li>
<li>Chụp trạng thái sạch: <code>docker commit lab-vps lab-sach</code>, rồi bật SSH và đăng nhập.</li>
<li>Phá nó: <code>docker exec lab-vps rm -rf /home/deploy/.ssh</code>, rồi thử đăng nhập lại. Đọc thông báo lỗi.</li>
<li>Dựng lại từ ảnh chụp và đăng nhập lại.</li></ol>
<pre><code class="language-bash">docker run -d --name lab-vps -p 127.0.0.1:2222:22 ubuntu:24.04 sleep infinity
docker exec lab-vps bash -c 'apt-get update -qq &amp;&amp; DEBIAN_FRONTEND=noninteractive apt-get install -y -qq openssh-server &gt;/dev/null &amp;&amp; mkdir -p /run/sshd &amp;&amp; useradd -m -s /bin/bash deploy &amp;&amp; mkdir -p /home/deploy/.ssh'
docker cp ./khoa.pub lab-vps:/home/deploy/.ssh/authorized_keys
docker exec lab-vps bash -c 'chown -R deploy:deploy /home/deploy/.ssh &amp;&amp; chmod 700 /home/deploy/.ssh &amp;&amp; chmod 600 /home/deploy/.ssh/authorized_keys'
docker commit lab-vps lab-sach
docker exec -d lab-vps /usr/sbin/sshd -D
ssh -i ./khoa -p 2222 -o UserKnownHostsFile=./known_hosts -o StrictHostKeyChecking=accept-new deploy@127.0.0.1 'echo "vao duoc: $(whoami)@$(hostname)"'

<span class="tok-comment"># pha xong? dung lai tu anh sach:</span>
docker rm -f lab-vps &amp;&amp; docker run -d --name lab-vps -p 127.0.0.1:2222:22 lab-sach /usr/sbin/sshd -D</code></pre>
<div class="out">vao duoc: deploy@8e9e28ec7a81
== pha 1: xoa khoa
Permission denied, please try again.
Permission denied, please try again.
deploy@127.0.0.1: Permission denied (publickey,password).
ma thoat: 255
dung lai tu anh sach: 1.63 giay
lai vao duoc: deploy</div>
<p>Output thật từ máy của khoá (Mac M1; tên container và cổng ở đó khác). Hai dòng "please try again" là SSH lùi về hỏi mật khẩu mà không có chỗ để hỏi — một gợi ý cho bài 0.2, nơi mật khẩu bị tắt hẳn.</p>
<p>Để các bài sau ngắn hơn, lưu khối dưới đây thành <code>~/dv-lab/ssh.cfg</code> và từ giờ dùng <code>ssh -F ~/dv-lab/ssh.cfg vps</code> — nó không đụng tới <code>~/.ssh/config</code> thật của bạn:</p>
<pre><code class="language-ini">Host vps
    HostName 127.0.0.1
    Port 2222
    User deploy
    IdentityFile ~/dv-lab/khoa
    IdentitiesOnly yes
    UserKnownHostsFile ~/dv-lab/known_hosts
    StrictHostKeyChecking accept-new</code></pre>
<p><strong>Đạt khi:</strong> <code>ssh -F ~/dv-lab/ssh.cfg vps whoami</code> in ra <code>deploy</code>; sau bước 4 cùng lệnh đó hỏng với <code>Permission denied</code>; và sau bước 5 nó lại in <code>deploy</code> — với việc dựng lại mất vài giây chứ không phải một phút.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Post-mortem (báo cáo sau sự cố)</span><span class="v">Bản ghi lại một sự cố sau khi nó kết thúc: dòng thời gian, nguyên nhân, cái gì sẽ thay đổi. Bản tốt đổ lỗi cho quy trình, không cho một con người.</span></div>
  <div class="kv"><span class="k">Staged rollout / canary (triển khai từng bậc / chim hoàng yến)</span><span class="v">Đưa bản mới cho một phần nhỏ máy hoặc người dùng trước, chỉ đi tiếp khi nó vẫn khoẻ.</span></div>
  <div class="kv"><span class="k">Rollback (lùi bản)</span><span class="v">Quay về phiên bản trước, lý tưởng là trong vài giây và không cần tới mạng.</span></div>
  <div class="kv"><span class="k">Smoke test (phép thử nhanh sau deploy)</span><span class="v">Vài request nhanh vào những tuyến thật ngay sau deploy; hỏng là dừng hoặc lùi lần deploy đó.</span></div>
  <div class="kv"><span class="k">Host key (khoá máy chủ)</span><span class="v">Danh tính của máy chủ đối với SSH; đổi bất ngờ nghĩa là có thể bạn không nói chuyện với cái máy mình tưởng.</span></div>
  <div class="kv"><span class="k">VPS thí nghiệm</span><span class="v">Một container Ubuntu có máy chủ SSH, cư xử như một VPS mới và dựng lại được trong vài giây.</span></div>
  <div class="kv"><span class="k">Snapshot / <code>docker commit</code> (ảnh chụp)</span><span class="v">Bản lưu hệ thống tệp của một container, ở đây dùng làm điểm xuất phát sạch.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Knight Capital lỗ hơn 460 triệu USD trong khoảng 45 phút vì một trong tám máy không nhận được mã mới và không ai kiểm.</li>
<li>GitLab (sao lưu chưa từng phục hồi thử), Cloudflare (đẩy toàn cầu một lần, 27 phút), Facebook (bộ kiểm có lỗi, mất mạng hàng giờ) và CrowdStrike (cập nhật tới mọi máy, 8,5 triệu máy) mỗi cái dạy một thói quen deploy.</li>
<li>Đẩy ra 100% trong một bước là sợi chỉ chung; canary và triển khai từng bậc là thuốc chữa, và một VPS cũng làm được phiên bản nhỏ.</li>
<li>Một dự án sinh viên gặp sáu sự cố thật trong hai tháng, và cái nào cũng là một lần deploy BÁO THÀNH CÔNG.</li>
<li>Khi deploy hỏng, hỏi bốn câu theo thứ tự — request, tiến trình, cổng, log — và đọc log từ dưới lên.</li>
<li>Tập trên một "VPS" container dùng-xong-vứt: 59 giây để dựng, 1,6 giây để làm lại từ ảnh chụp, không có gì thật bị đe doạ.</li>
</ul>

<a class="link-card" href="https://www.sec.gov/litigation/admin/2013/34-70694.pdf" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">SEC — In the Matter of Knight Capital Americas LLC (Release No. 70694, 2013)</span><span class="lc-sub">Kết luận của cơ quan quản lý: máy chủ thứ tám, cái cờ bị dùng lại, 45 phút, hơn 460 triệu USD, khoản phạt 12 triệu USD.</span></span>
</a>
<a class="link-card" href="https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/" target="_blank" rel="noopener">
  <span class="lc-ico">🗄</span>
  <span class="lc-body"><span class="lc-title">GitLab — Postmortem of database outage of January 31</span><span class="lc-sub">Lệnh xoá trên nhầm máy, những bản sao lưu thất bại, và sáu giờ dữ liệu đã mất.</span></span>
</a>
<a class="link-card" href="https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/" target="_blank" rel="noopener">
  <span class="lc-ico">🧮</span>
  <span class="lc-body"><span class="lc-title">Cloudflare — Details of the Cloudflare outage on July 2, 2019</span><span class="lc-sub">Biểu thức chính quy quay lui, lần đẩy toàn cầu, 27 phút.</span></span>
</a>
<a class="link-card" href="https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Engineering at Meta — More details about the October 4 outage</span><span class="lc-sub">Lệnh bảo trì, công cụ kiểm có lỗi, và vì sao DNS biến mất theo.</span></span>
</a>
<a class="link-card" href="https://www.crowdstrike.com/en-us/blog/falcon-content-update-preliminary-post-incident-report/" target="_blank" rel="noopener">
  <span class="lc-ico">🖥</span>
  <span class="lc-body"><span class="lc-title">CrowdStrike — Preliminary Post Incident Review</span><span class="lc-sub">04:09 → 05:27 UTC, và cam kết triển khai so le, canary trước.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/2024_CrowdStrike-related_IT_outages" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">2024 CrowdStrike-related IT outages — Wikipedia</span><span class="lc-sub">Ước tính khoảng 8,5 triệu máy Windows bị ảnh hưởng của Microsoft, kèm tham chiếu.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/2021_Facebook_outage" target="_blank" rel="noopener">
  <span class="lc-ico">⏱</span>
  <span class="lc-body"><span class="lc-title">2021 Facebook outage — Wikipedia</span><span class="lc-sub">Dòng thời gian, và thời lượng sáu đến bảy giờ mà bài của Meta không nêu.</span></span>
</a>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — container, ảnh và docker commit</span><span class="lc-sub">/courses/docker/learn${REF} — VPS thí nghiệm thật ra là gì, và vì sao dựng lại nó rẻ tới vậy.</span></span></div>
<p class="note-ct"><strong>Tiếp theo:</strong> bộ slide Mục 0, rồi bài 0.1 — bốn bước của một lần deploy, bước nào cũng đo bằng byte và mili giây trên một máy chủ SSH thật.</p>
</div>
`,
    },

    /* ─────────────────── 0.0 ─────────────────── */
    {
      title: '0.0 — Section 0 slides: what a deploy is, in pictures|||0.0 — Slide Mục 0: deploy là gì, bằng hình',
      slug: 'deploy-0-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 39 slide của Mục 0: dọn nhà sang căn hộ thuê, một request thật, bảy chỗ chạy web, dòng thời gian 1985→2020, năm sự cố thật, sân tập dựng lại trong 1,6 giây, bốn bước đo bằng byte và mili giây, sshd -T, pkill tự giết shell, ln -sfn dưới strace — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Slides</span>
<h2>The whole of Section 0 in 39 slides</h2>
<p class="lead">Skim these before the lessons to get the shape of things, then come back to them as a revision sheet. Every picture reappears inside the lesson that explains it: the move into a rented apartment, one real request from name to IP to server, the seven places a website can run, thirty-five years of deploy history, eight servers at Knight Capital, the four checks that pass a broken deploy, the <code>pkill</code> that kills its own deploy, and <code>strace</code> showing which <code>ln</code> is atomic.</p>
<p>Slides 3–9 belong to "Start here (1/2)", 10–16 to "Start here (2/2)", 17–22 to Lesson 0.1, 23–27 to 0.2, 28–32 to 0.3 and 33–35 to 0.4. The last four are the section's common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal on the slides is real output, recorded in September 2026 on the course's practice VPS (an Ubuntu 24.04 container with OpenSSH 9.6, reached over SSH from a Mac M1) and on the Mac itself; figures from the original lessons are quoted as measured there. Dates, prices and incident figures come from the sources linked in the two "Start here" lessons. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Slide</span>
<h2>Cả Mục 0 trong 39 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để nắm hình dạng mọi thứ, rồi quay lại như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: chuyện dọn nhà sang căn hộ thuê, một request thật đi từ tên tới IP tới máy chủ, bảy chỗ có thể chạy một website, ba mươi lăm năm lịch sử deploy, tám máy chủ của Knight Capital, bốn phép kiểm cho qua một lần deploy hỏng, cái <code>pkill</code> tự giết chính lần deploy, và <code>strace</code> chỉ ra <code>ln</code> nào là nguyên tử.</p>
<p>Slide 3–9 thuộc "Bắt đầu tại đây (1/2)", 10–16 thuộc "Bắt đầu tại đây (2/2)", 17–22 thuộc Bài 0.1, 23–27 thuộc 0.2, 28–32 thuộc 0.3 và 33–35 thuộc 0.4. Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi tháng 9/2026 trên VPS thí nghiệm của khoá (một container Ubuntu 24.04 có OpenSSH 9.6, SSH vào từ Mac M1) và trên chính máy Mac; số liệu từ các bài gốc được dẫn đúng như đã đo ở đó. Mốc thời gian, giá và số liệu sự cố lấy từ các nguồn có link trong hai bài "Bắt đầu tại đây" — con số trên máy bạn có thể khác, quy luật thì không.</p>
</div>
${gallery('dv-00', [
  [1, 'Bìa'], [2, 'Bản đồ Mục 0'],
  [3, 'Deploy giống dọn nhà sang căn hộ thuê'], [4, 'Một request thật: tên → IP → máy chủ'], [5, 'Bảy chỗ chạy web'],
  [6, 'Dòng thời gian 1985 → 2020'], [7, 'Mỗi bước tiến bỏ đi một việc làm tay'], [8, 'Deploy giúp gì cho bạn'], [9, 'Lộ trình 16 phần'],
  [10, 'Knight Capital 2012'], [11, 'Bốn sự cố lớn'], [12, 'Đẩy ra tất cả cùng lúc'], [13, 'Sự cố của một dự án sinh viên'],
  [14, 'Vì sao người mới sợ deploy'], [15, 'Deploy hỏng: bốn câu hỏi'], [16, 'Sân tập dựng lại trong 1,6 giây'],
  [17, 'Bốn bước, bốn kiểu hỏng'], [18, 'rsync gửi cả tệp gõ dở'], [19, 'rsync và git chỉ gửi phần chênh'],
  [20, 'Đọc một lần chạy thử -i'], [21, 'Tráo ngây thơ: gián đoạn = khởi động'], [22, 'Bốn mức “nó chạy rồi”'],
  [23, 'sshd -T và thứ tự drop-in'], [24, '“Sẽ thế” và “đang thế”'], [25, 'Khoá chỉ-deploy'],
  [26, 'ControlMaster: 134 → 15 ms'], [27, 'rsync bằng root đổi chủ tệp'],
  [28, 'Deploy tay: bốn lệnh'], [29, 'pkill -f tự giết shell'], [30, 'ssh treo vì tiến trình nền'],
  [31, 'Ba bản deploy, bốn phép kiểm'], [32, 'Liveness và readiness'],
  [33, 'Lùi bản bằng symlink'], [34, 'ln -sfn: GNU và BusyBox'], [35, 'Năm lỗ hổng → năm chương'],
  [36, 'Sai lầm hay gặp'], [37, 'Bảng tra nhanh (1/2)'], [38, 'Bảng tra nhanh (2/2)'], [39, 'Thực hành Mục 0'],
])}
`,
    },

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — Four steps, and four ways to fail|||0.1 — Bốn bước, và bốn kiểu hỏng',
      slug: 'deploy-0-1-bon-buoc',
      type: 'LESSON',
      description: 'Mọi lần deploy — script mười dòng hay hệ thống CI cả nghìn dòng — đều là cùng bốn bước. Tách chúng ra là điều kiện cần để biết bước nào đang hỏng, và bài này mở đầu bằng một phép đo cho thấy hai lần deploy trông giống hệt nhau lại gửi đi hai thứ khác nhau.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Four steps, and four ways to fail</h2>
<p class="lead">Every deploy is the same four steps, whether it is a ten-line shell script or a thousand-line pipeline: make an artifact, move it to the server, swap it in, and prove it works. Naming them separately is what lets you answer "which step broke" instead of "the deploy failed".</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Artifact — decide exactly what is being shipped</span><span class="lz-d">A directory of files, a git commit, a tarball, a container image. The question this step answers is <em>which bytes</em>, and it is the step people skip. Skipping it is how a half-written file reaches production.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Transport — get it onto the machine</span><span class="lz-d"><code>rsync</code>, <code>git pull</code>, <code>docker pull</code>, <code>scp</code>. Measured below: the three main options differ by more than taste, but not in the way most people assume.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Swap — make the new version the live one</span><span class="lz-d">Stop and start, or something smarter. The cost of the naive version is measured at the end of this lesson, and it depends almost entirely on one property of your application.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Verify — prove the new version actually serves traffic</span><span class="lz-d">Not "the script exited 0". An HTTP request, against a real route, with the answer checked. Every incident in this repository's own history was a deploy that reported success.</span></div>
</div>
<div class="callout"><strong>The four steps are independent.</strong> You can change transport without touching the swap, or add verification to a deploy that has none. Treating "deploy" as one indivisible thing is what makes it feel unfixable — there is no single knob, but there are four small ones.</div>

<h3>The four steps at a glance</h3>
${slide('dv-00', 17, 'Bốn bước, bốn câu hỏi, bốn kiểu hỏng')}
<p>Each step answers one question, and each has its own typical way of failing. Keep this picture in mind for the rest of the course: when something breaks, the first job is to say which of the four boxes it broke in.</p>
<h3>Step 1 is not optional: what an artifact excludes</h3>
${slide('dv-00', 18, 'rsync cây làm việc gửi luôn cả tệp gõ dở')}
<p>Two deploys of the same project, at the same moment, from the same directory. One uses <code>rsync</code> of the working tree; the other pushes a git commit. In between, a file is being edited and is not finished:</p>
<div class="out">  cay lam viec bay gio CO mot tep hong, CHUA commit:
     M src/server.js
    node --check: /tmp/duan/src/server.js:5

=== rsync (day CAY LAM VIEC) ===
    tren VPS: /srv/vps/app/src/server.js:5
=== git push (day thu DA COMMIT) ===
    tren VPS: cu phap HOP LE</div>
<p>The file has a syntax error — <code>node --check</code> names line 5 locally. After the <code>rsync</code>, <code>node --check</code> on the server names the same line 5: the broken file is now on the server. After the <code>git push</code>, the server still has valid syntax, because the broken edit was never committed and therefore was never part of the artifact.</p>
<div class="pitfall"><strong>Trap — rsync of a working tree ships whatever you happen to be typing.</strong> This is not a hypothetical: this project's own <code>deploy.sh</code> caught a half-written file from a parallel editing session three separate times, which is why the standard path was changed to build from committed code only. The failure is invisible at deploy time — <code>rsync</code> succeeds, the script exits 0 — and shows up as a crash loop minutes later.</div>
<p>That is the whole argument for step 1. An artifact is a decision about which bytes ship, made once, deliberately. "Whatever is in the directory right now" is not a decision; it is the absence of one.</p>

<h3>Step 2, measured: rsync versus git</h3>
${slide('dv-00', 19, 'rsync và git đều chỉ gửi phần chênh lệch')}
<p>A 42-file project, 176 KB, deployed over real SSH to a real server. First the bytes actually sent:</p>
<div class="out">=== rsync ===
  lan dau:    Total file size: 108,720 bytes
              Total bytes sent: 85,318
  sua 1 tep:  Literal data: 435 bytes
              Total bytes sent: 1,228

=== git push ===
  sua 1 tep:  Enumerating objects: 7, done.
              Writing objects: 100% (4/4), 569 bytes | 569.00 KiB/s, done.
              Total 4 (delta 2), reused 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Both send only the delta</span><span class="v">1,228 bytes for rsync, 569 for git, to change one file in a 176 KB tree. Neither re-sends the project. The common belief that "rsync copies everything" is wrong — that is <code>scp</code>.</span></div>
  <div class="kv"><span class="k">Git sends less over the wire</span><span class="v">Roughly half here, because it ships compressed objects and a delta against what the remote already has, rather than a file-level diff.</span></div>
  <div class="kv"><span class="k">Git costs more on disk</span><span class="v">The bare repository on the server measured 556 KB against 176 KB for the rsync tree, and a clone added 608 KB of history — because git brings every version, forever.</span></div>
  <div class="kv"><span class="k">Neither difference is why you choose</span><span class="v">At this size both are under a second and under two kilobytes. The measurement above about the uncommitted file is what actually decides it.</span></div>
</div>

<p>The commands behind those numbers, so you can run them against your own project:</p>
<pre><code><span class="tok-comment"># rsync: xem CHINH XAC no gui bao nhieu byte</span>
rsync -az --delete --stats --exclude .git ./ vps:/srv/app/ | grep -E 'bytes sent|Literal'

<span class="tok-comment"># rsync: xem no dinh dong vao nhung TEP nao, ma KHONG gui gi (chay thu)</span>
rsync -azin --delete --exclude .git ./ vps:/srv/app/

<span class="tok-comment"># git: xem mot lan day gui bao nhieu</span>
git push --progress 2&gt;&amp;1 | grep -E 'Writing|Total'</code></pre>
<div class="note-ct">The <code>-n</code> in the second command is <code>--dry-run</code> and the <code>-i</code> is <code>--itemize-changes</code>. Together they answer "what would this deploy change?" without changing anything — the single most useful habit to build before running a deploy against production for the first time.</div>
<h3>Deep dive: reading a dry run, flag by flag</h3>
${slide('dv-00', 20, 'Chạy thử trước: đọc từng dòng -i')}
<p>A dry run is only useful if you can read what it prints. Here it is for real, from a Mac to the course's practice VPS: the first run into an empty directory, then again after editing one file.</p>
<pre><code class="language-bash">rsync -azin --delete --exclude .git ./ vps:app/
<span class="tok-comment"># ... rsync that for real (drop -n), edit src/server.js, then dry-run again:</span>
rsync -azin --delete --exclude .git ./ vps:app/</code></pre>
<div class="out">created directory app
cd+++++++ ./
&lt;f+++++++ README.md
cd+++++++ public/
&lt;f+++++++ public/index.html
cd+++++++ src/
&lt;f+++++++ src/server.js

&lt;f.s..... src/server.js</div>
<div class="kv-grid">
  <div class="kv"><span class="k">First character</span><span class="v"><code>&lt;</code> = a file is being <em>sent</em> to the other side; <code>c</code> = something is being <em>created</em> (here directories); <code>*deleting</code> would appear for files that <code>--delete</code> removes — read those lines twice.</span></div>
  <div class="kv"><span class="k">Second character</span><span class="v"><code>f</code> file, <code>d</code> directory, <code>L</code> symlink.</span></div>
  <div class="kv"><span class="k">The rest</span><span class="v"><code>+++++++</code> = brand-new item. Otherwise each position is a reason: <code>s</code> size differs, <code>t</code> modification time differs, <code>p</code> permissions, <code>o</code>/<code>g</code> owner/group. <code>.</code> means "unchanged".</span></div>
  <div class="kv"><span class="k">What to look for</span><span class="v">Files you did not expect (<code>.env</code>, <code>node_modules</code>, a build folder), and any <code>*deleting</code> line. If the list surprises you, the deploy would have surprised you too.</span></div>
</div>
<table>
  <tr><th>Flag</th><th>Meaning</th><th>Why a deploy uses it</th></tr>
  <tr><td><code>-a</code></td><td>archive: recurse, keep permissions, times, symlinks</td><td>the server gets the same tree, not a flattened copy</td></tr>
  <tr><td><code>-z</code></td><td>compress while sending</td><td>cheap on slow links; pointless on a LAN</td></tr>
  <tr><td><code>-n</code> (<code>--dry-run</code>)</td><td>show, change nothing</td><td>the habit to build before every first deploy to a machine</td></tr>
  <tr><td><code>-i</code> (<code>--itemize-changes</code>)</td><td>one line per change, with the reason</td><td>turns "rsync did something" into a list you can read</td></tr>
  <tr><td><code>--delete</code></td><td>remove files on the far side that are gone locally</td><td>keeps the server identical — and deletes the wrong directory if the path is wrong</td></tr>
  <tr><td><code>--exclude .git</code></td><td>skip matching paths</td><td>history does not belong on the server; add <code>.env</code>, <code>node_modules</code> as needed</td></tr>
  <tr><td><code>--stats</code></td><td>totals at the end</td><td>the byte counts measured above</td></tr>
</table>
<div class="callout warn"><strong>On macOS, <code>rsync</code> is not the rsync the rest of this lesson used.</strong> Recent macOS ships <em>openrsync</em>: <code>rsync --version</code> prints <code>openrsync: protocol version 29</code>. Its <code>--stats</code> output uses different words — measured on the course Mac: <code>Number of files transferred: 1</code> and <code>Total sent: 669 B</code>, with no "Literal data" line — so the <code>grep -E 'bytes sent|Literal'</code> above prints nothing there. It also rejects some flags outright: <code>rsync: unrecognized option &#96;--chown=deploy:deploy'</code>, and the same for <code>--info=stats2</code>. If a deploy script must run on a Mac, install GNU rsync (<code>brew install rsync</code>) or run it inside Linux. On Windows there is no built-in rsync at all: run the deploy from WSL, and keep the script's line endings as LF — a script saved with Windows CRLF endings fails on the server with errors like <code>$'\\r': command not found</code>.</div>

<h3>The number that surprises people</h3>
<div class="out">=== rsync: lan dau (cay rong)      → 280 ms
=== rsync: lan hai (khong doi gi)  → 286 ms
=== rsync: sau khi sua DUNG MOT tep → 280 ms</div>
<p>Transferring 176 KB, transferring nothing, and transferring one small file all took about the same time. The work is not the transfer — it is the SSH connection: key exchange, authentication, session setup. At this project size the payload is free and the handshake is the whole cost.</p>
<div class="callout ok"><strong>This is why deploy scripts should reuse one SSH connection.</strong> A script that runs eight separate <code>ssh</code> commands pays that ~280 ms eight times before doing any work. OpenSSH solves it with <code>ControlMaster</code> — one connection, many commands — and Lesson 0.2 measures exactly what that saves.</div>

<h3>Step 3, measured: what the simplest swap costs</h3>
${slide('dv-00', 21, 'Tráo ngây thơ: gián đoạn dài bằng lúc khởi động')}
<p>The most common swap is: kill the old process, start the new one. Measured by polling <code>/health</code> every 50 ms across the swap, on a trivial Node application:</p>
<div class="out">=== TRIEN KHAI 'dung roi khoi dong lai' ===
  tong 200 phep do, 1 cai HONG
  gian doan: 0 ms  (1 request truot)
  200 dau tien sau khi dung: +94 ms</div>
<p>One failed request, and 94 ms until the new version answered. That is genuinely small — small enough that for a hobby project on a quiet evening, stop-and-start is a defensible strategy.</p>
<p>Now the identical deploy, on an application that differs in exactly one respect — it takes three seconds to become ready, which is what an application that reads config, connects to a database and warms a cache actually does:</p>
<div class="out">=== cung mot kieu trien khai, ung dung khoi dong mat 3s ===
  tong 200 phep do, 49 cai HONG
  gian doan: 2983 ms  (49 request truot)
  200 dau tien sau khi dung: +3070 ms</div>
<div class="callout warn"><strong>One request became forty-nine; 94 ms became 2,983 ms.</strong> Thirty-two times worse, from a property of the application that no deploy script can see. The startup time you never measured is the length of every outage you deploy. Chapter 3 is about making the swap independent of it.</div>
<div class="note-ct">Read the resolution honestly: polling every 50 ms means a single failure could represent anywhere from a moment to about 100 ms of downtime. That is why the second figure — <em>time until the first 200 after the kill</em> — is the more trustworthy of the two, and it is the one that grew from 94 ms to 3,070 ms.</div>

<h3>Step 4: what "it worked" has to mean</h3>
${slide('dv-00', 22, '“Nó chạy rồi” có bốn mức — chỉ mức 3 đáng tin')}
<p>The failure mode that matters most is a deploy that <em>reports success</em> and leaves the site broken. Every incident in this project's history is one of those: an image that built green, pushed green, swapped green, and then restarted forever because its Prisma engine was built for a different C library. A script exiting 0 proves the script ran, not that the site works.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Weakest: the script exited 0</span><span class="lz-lnote">Proves the commands ran. Says nothing about the application, which may not have started, or may be crash-looping.</span></div>
  <div class="lz-layer"><span class="lz-lname">Better: the process is running</span><span class="lz-lnote">A PID exists, or the port is listening. Better, and still passes while the app returns 500 to everything.</span></div>
  <div class="lz-layer"><span class="lz-lname">Right: a real route answers correctly</span><span class="lz-lnote">An HTTP request to a route the application actually serves, with the status checked. <code>401</code> and <code>200</code> both prove the route is mounted; <code>404</code> means it is not — a stale build, or a router that never registered.</span></div>
  <div class="lz-layer"><span class="lz-lname">Best: the deploy fails when that check fails</span><span class="lz-lnote">A verification whose result is ignored is decoration. If the smoke test cannot stop the deploy or trigger a rollback, it is not a gate.</span></div>
</div>
<div class="callout"><strong>Where these four steps lead.</strong> The course now has sixteen parts, not twelve. Chapters 1–11 take each step and each way it fails in turn; four chapters added in September 2026 take the same four steps onto the open internet: Chapter 12 (from a domain name to HTTPS), Chapter 13 (deploying with containers, a registry and CI), Chapter 14 (several environments, and growing beyond one server) and Chapter 15 (a capstone that ships a whole application end to end). Lesson 0.4 shows the full map.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate wants to deploy by <code>rsync</code>-ing the project folder straight to the group server, "because it is faster than git". Prove on the practice VPS (from "Start here (2/2)") what that would ship.</p><ol>
<li>In <code>~/dv-lab</code>, make a tiny project and commit it: a <code>src/server.js</code>, a <code>README.md</code>, a <code>public/index.html</code>; <code>git init &amp;&amp; git add . &amp;&amp; git commit -m "ban 1"</code>.</li>
<li>Dry-run the deploy and read every line: <code>rsync -azin --delete --exclude .git -e "ssh -F ~/dv-lab/ssh.cfg" ./ vps:app/</code>. Then run it for real (drop <code>-n</code>).</li>
<li>Append a half-written line to <code>src/server.js</code> without committing: <code>echo '// DANG GO DO — chua xong' &gt;&gt; src/server.js</code>. Dry-run again: exactly one line should appear.</li>
<li>Deploy both ways — <code>rsync</code> into <code>app/</code>, and the committed version with <code>git archive --format=tar HEAD | ssh -F ~/dv-lab/ssh.cfg vps 'mkdir -p ~/app2 &amp;&amp; tar x -C ~/app2'</code> — then count the half-written line on the server (block below).</li>
<li>Restore your file with <code>git checkout -- src/server.js</code>.</li></ol>
<pre><code class="language-bash">ssh -F ~/dv-lab/ssh.cfg vps 'echo "ban rsync:       $(grep -c "DANG GO DO" ~/app/src/server.js)"; echo "ban git archive: $(grep -c "DANG GO DO" ~/app2/src/server.js)"'</code></pre>
<div class="out">ban rsync:       1
ban git archive: 0</div>
<p><strong>Done when:</strong> your dry run after step 3 shows a single <code>&lt;f.s…</code> (or <code>&lt;f.st…</code>) line for <code>src/server.js</code>, and the server shows <code>1</code> for the rsync copy and <code>0</code> for the git-archive copy — so you can tell your teammate, with evidence, which one ships the file you are still typing.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Artifact</span><span class="v">The exact set of bytes a deploy ships, decided once and on purpose.</span></div>
  <div class="kv"><span class="k">Working tree</span><span class="v">The files in your project folder right now, including edits you have not committed.</span></div>
  <div class="kv"><span class="k">Transport</span><span class="v">How the artifact reaches the server: rsync, git, scp, a registry pull.</span></div>
  <div class="kv"><span class="k">Swap</span><span class="v">The moment the new version becomes the one answering requests.</span></div>
  <div class="kv"><span class="k">Dry run (<code>-n</code>)</span><span class="v">Running a command so that it reports what it would do without doing it.</span></div>
  <div class="kv"><span class="k">Delta transfer</span><span class="v">Sending only what differs from what the other side already has.</span></div>
  <div class="kv"><span class="k">SSH handshake</span><span class="v">Key exchange and authentication at the start of every SSH connection — the fixed cost of each one.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every deploy is artifact → transport → swap → verify, and every failure belongs to one of the four.</li>
<li><code>rsync</code> of a working tree ships whatever you are typing; an artifact built from a commit cannot.</li>
<li>rsync and git both send only the delta; the SSH handshake, not the payload, is the cost at small sizes.</li>
<li>Read a dry run (<code>rsync -azin</code>) before the first real deploy to any machine — on a Mac, know that <code>rsync</code> is openrsync with different output and fewer flags.</li>
<li>Stop-and-start costs as much downtime as your application's startup: 1 failed request became 49 when startup took 3 seconds.</li>
<li>"It worked" means a real route answered correctly, and a check that cannot stop the deploy is decoration.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — V. Build, release, run</span><span class="lc-sub">12factor.net/build-release-run — the clearest short statement of why the artifact must be separated from the release, which is step 1 above.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — the --stats and --itemize-changes flags</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — the two flags that produced the byte counts above, and the fastest way to see what a deploy is really sending.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — what a commit actually contains</span><span class="lc-sub">/courses/git/learn${REF} — the artifact in step 1, when the artifact is a commit.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — processes, signals and what kill really does</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the mechanism under step 3, and why a process does not die the instant you ask it to.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bốn bước, và bốn kiểu hỏng</h2>
<p class="lead">Mọi lần deploy đều là cùng bốn bước, dù nó là một script shell mười dòng hay một đường ống CI cả nghìn dòng: tạo ra một tạo tác, chuyển nó lên máy chủ, tráo nó vào, và chứng minh nó chạy. Gọi tên từng bước riêng ra chính là thứ cho phép bạn trả lời "bước nào hỏng" thay vì "deploy thất bại".</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tạo tác — quyết định CHÍNH XÁC thứ gì được gửi đi</span><span class="lz-d">Một thư mục tệp, một commit git, một tệp nén, một ảnh container. Câu hỏi bước này trả lời là <em>những byte nào</em>, và đây là bước người ta hay bỏ qua. Bỏ qua nó chính là cách một tệp viết dở lên tới production.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Vận chuyển — đưa nó lên máy</span><span class="lz-d"><code>rsync</code>, <code>git pull</code>, <code>docker pull</code>, <code>scp</code>. Đo ngay dưới đây: ba lựa chọn chính khác nhau nhiều hơn chuyện sở thích, nhưng không khác theo cái cách mà phần lớn người ta tưởng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tráo — làm cho phiên bản mới thành phiên bản đang sống</span><span class="lz-d">Dừng rồi khởi động lại, hoặc một cách khôn hơn. Cái giá của cách ngây thơ được đo ở cuối bài này, và nó phụ thuộc gần như hoàn toàn vào MỘT tính chất của ứng dụng bạn.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Kiểm — chứng minh phiên bản mới thật sự đang phục vụ</span><span class="lz-d">Không phải "script thoát ra 0". Một request HTTP, vào một tuyến thật, có kiểm câu trả lời. Mọi sự cố trong lịch sử của chính kho mã này đều là một lần deploy đã BÁO THÀNH CÔNG.</span></div>
</div>
<div class="callout"><strong>Bốn bước đó độc lập với nhau.</strong> Bạn đổi được cách vận chuyển mà không đụng tới cách tráo, hoặc thêm bước kiểm vào một quy trình vốn chẳng có. Coi "deploy" là một khối không chia được chính là thứ làm nó có cảm giác không sửa nổi — không có một cái núm duy nhất, nhưng có bốn cái núm nhỏ.</div>

<h3>Bốn bước trong một hình</h3>
${slide('dv-00', 17, 'Bốn bước, bốn câu hỏi, bốn kiểu hỏng')}
<p>Mỗi bước trả lời một câu hỏi, và mỗi bước có kiểu hỏng quen thuộc của riêng nó. Giữ hình này trong đầu suốt khoá: khi có gì hỏng, việc đầu tiên là nói được nó hỏng ở ô nào trong bốn ô.</p>
<h3>Bước 1 không phải tuỳ chọn: một tạo tác LOẠI TRỪ cái gì</h3>
${slide('dv-00', 18, 'rsync cây làm việc gửi luôn cả tệp gõ dở')}
<p>Hai lần deploy cùng một dự án, cùng một thời điểm, từ cùng một thư mục. Một cái dùng <code>rsync</code> cây làm việc; cái kia đẩy một commit git. Ở giữa, có một tệp đang được sửa và chưa xong:</p>
<div class="out">  cay lam viec bay gio CO mot tep hong, CHUA commit:
     M src/server.js
    node --check: /tmp/duan/src/server.js:5

=== rsync (day CAY LAM VIEC) ===
    tren VPS: /srv/vps/app/src/server.js:5
=== git push (day thu DA COMMIT) ===
    tren VPS: cu phap HOP LE</div>
<p>Cái tệp đó có lỗi cú pháp — <code>node --check</code> chỉ đích danh dòng 5 ở máy local. Sau lệnh <code>rsync</code>, <code>node --check</code> chạy TRÊN MÁY CHỦ cũng chỉ đúng dòng 5 ấy: tệp hỏng bây giờ đã nằm trên máy chủ. Sau lệnh <code>git push</code>, máy chủ vẫn có cú pháp hợp lệ, vì cái sửa dở kia chưa từng được commit nên chưa từng là một phần của tạo tác.</p>
<div class="pitfall"><strong>Bẫy — rsync một cây làm việc thì gửi đi bất cứ thứ gì bạn đang gõ dở.</strong> Đây không phải chuyện giả định: chính <code>deploy.sh</code> của dự án này đã ba lần chộp trúng một tệp viết dở từ một phiên soạn thảo song song, và đó là lý do đường chuẩn được đổi sang chỉ dựng từ mã ĐÃ COMMIT. Kiểu hỏng này vô hình ngay lúc deploy — <code>rsync</code> thành công, script thoát ra 0 — rồi hiện ra thành một vòng lặp sập vài phút sau đó.</div>
<p>Đó là toàn bộ lý lẽ cho bước 1. Một tạo tác là một QUYẾT ĐỊNH về việc những byte nào được gửi đi, ra quyết định một lần, một cách có chủ ý. "Bất cứ thứ gì đang có trong thư mục lúc này" không phải một quyết định; nó là sự vắng mặt của quyết định.</p>

<h3>Bước 2, đo thật: rsync so với git</h3>
${slide('dv-00', 19, 'rsync và git đều chỉ gửi phần chênh lệch')}
<p>Một dự án 42 tệp, 176 KB, deploy qua SSH thật lên một máy chủ thật. Trước hết là số byte thật sự được gửi:</p>
<div class="out">=== rsync ===
  lan dau:    Total file size: 108,720 bytes
              Total bytes sent: 85,318
  sua 1 tep:  Literal data: 435 bytes
              Total bytes sent: 1,228

=== git push ===
  sua 1 tep:  Enumerating objects: 7, done.
              Writing objects: 100% (4/4), 569 bytes | 569.00 KiB/s, done.
              Total 4 (delta 2), reused 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Cả hai đều chỉ gửi phần CHÊNH LỆCH</span><span class="v">1.228 byte với rsync, 569 byte với git, để đổi một tệp trong cây 176 KB. Không cái nào gửi lại cả dự án. Cái niềm tin phổ biến rằng "rsync chép hết" là SAI — cái chép hết là <code>scp</code>.</span></div>
  <div class="kv"><span class="k">Git gửi ít hơn qua đường truyền</span><span class="v">Ở đây khoảng một nửa, vì nó gửi các đối tượng đã nén cùng một delta so với thứ máy kia đã có, chứ không phải một bản khác biệt ở mức tệp.</span></div>
  <div class="kv"><span class="k">Git tốn nhiều hơn trên ĐĨA</span><span class="v">Kho trần trên máy chủ đo được 556 KB so với 176 KB của cây rsync, và một lần clone thêm 608 KB lịch sử — vì git mang theo MỌI phiên bản, mãi mãi.</span></div>
  <div class="kv"><span class="k">Không khác biệt nào ở trên là lý do để chọn</span><span class="v">Ở cỡ dự án này thì cả hai đều dưới một giây và dưới hai kilobyte. Chính phép đo về cái tệp chưa commit ở trên mới là thứ quyết định.</span></div>
</div>

<p>Mấy lệnh đứng sau những con số đó, để bạn chạy được trên chính dự án của mình:</p>
<pre><code><span class="tok-comment"># rsync: xem CHINH XAC no gui bao nhieu byte</span>
rsync -az --delete --stats --exclude .git ./ vps:/srv/app/ | grep -E 'bytes sent|Literal'

<span class="tok-comment"># rsync: xem no dinh dong vao nhung TEP nao, ma KHONG gui gi (chay thu)</span>
rsync -azin --delete --exclude .git ./ vps:/srv/app/

<span class="tok-comment"># git: xem mot lan day gui bao nhieu</span>
git push --progress 2&gt;&amp;1 | grep -E 'Writing|Total'</code></pre>
<div class="note-ct">Chữ <code>-n</code> ở lệnh thứ hai là <code>--dry-run</code> còn <code>-i</code> là <code>--itemize-changes</code>. Ghép lại chúng trả lời câu "lần deploy này sẽ đổi những gì?" mà không đổi bất cứ thứ gì — đây là thói quen hữu ích nhất cần rèn trước khi lần đầu chạy một lệnh deploy vào production.</div>
<h3>Đào sâu: đọc một lần chạy thử, từng cờ một</h3>
${slide('dv-00', 20, 'Chạy thử trước: đọc từng dòng -i')}
<p>Chạy thử chỉ có ích khi bạn đọc được thứ nó in ra. Đây là output thật, từ một máy Mac sang VPS thí nghiệm của khoá: lần đầu vào một thư mục trống, rồi chạy lại sau khi sửa một tệp.</p>
<pre><code class="language-bash">rsync -azin --delete --exclude .git ./ vps:app/
<span class="tok-comment"># ... rsync that (bo -n), sua src/server.js, roi chay thu lai:</span>
rsync -azin --delete --exclude .git ./ vps:app/</code></pre>
<div class="out">created directory app
cd+++++++ ./
&lt;f+++++++ README.md
cd+++++++ public/
&lt;f+++++++ public/index.html
cd+++++++ src/
&lt;f+++++++ src/server.js

&lt;f.s..... src/server.js</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Ký tự đầu</span><span class="v"><code>&lt;</code> = một tệp đang được <em>GỬI</em> sang bên kia; <code>c</code> = có thứ đang được <em>TẠO</em> (ở đây là thư mục); dòng <code>*deleting</code> sẽ hiện ra cho những tệp mà <code>--delete</code> sắp xoá — đọc những dòng đó hai lần.</span></div>
  <div class="kv"><span class="k">Ký tự thứ hai</span><span class="v"><code>f</code> tệp, <code>d</code> thư mục, <code>L</code> symlink.</span></div>
  <div class="kv"><span class="k">Phần còn lại</span><span class="v"><code>+++++++</code> = mục mới tinh. Còn không thì mỗi vị trí là một LÝ DO: <code>s</code> khác kích thước, <code>t</code> khác giờ sửa, <code>p</code> quyền, <code>o</code>/<code>g</code> chủ/nhóm. <code>.</code> nghĩa là "không đổi".</span></div>
  <div class="kv"><span class="k">Cần soi cái gì</span><span class="v">Những tệp bạn không ngờ tới (<code>.env</code>, <code>node_modules</code>, một thư mục build), và mọi dòng <code>*deleting</code>. Nếu danh sách làm bạn bất ngờ, thì lần deploy thật cũng sẽ làm bạn bất ngờ.</span></div>
</div>
<table>
  <tr><th>Cờ</th><th>Nghĩa</th><th>Vì sao deploy dùng nó</th></tr>
  <tr><td><code>-a</code></td><td>archive: đệ quy, giữ quyền, giờ, symlink</td><td>máy chủ nhận đúng cái cây, không phải một bản bị làm phẳng</td></tr>
  <tr><td><code>-z</code></td><td>nén khi gửi</td><td>rẻ trên đường truyền chậm; vô ích trong mạng LAN</td></tr>
  <tr><td><code>-n</code> (<code>--dry-run</code>)</td><td>chỉ cho xem, không đổi gì</td><td>thói quen phải có trước lần deploy ĐẦU TIÊN lên bất kỳ máy nào</td></tr>
  <tr><td><code>-i</code> (<code>--itemize-changes</code>)</td><td>mỗi thay đổi một dòng, kèm lý do</td><td>biến "rsync đã làm gì đó" thành một danh sách đọc được</td></tr>
  <tr><td><code>--delete</code></td><td>xoá bên kia những tệp bên này không còn</td><td>giữ máy chủ giống hệt — và xoá nhầm cả thư mục nếu đường dẫn sai</td></tr>
  <tr><td><code>--exclude .git</code></td><td>bỏ qua đường dẫn khớp mẫu</td><td>lịch sử không thuộc về máy chủ; thêm <code>.env</code>, <code>node_modules</code> khi cần</td></tr>
  <tr><td><code>--stats</code></td><td>tổng kết ở cuối</td><td>chính là mấy con số byte đo ở trên</td></tr>
</table>
<div class="callout warn"><strong>Trên macOS, <code>rsync</code> KHÔNG phải cái rsync mà phần còn lại của bài dùng.</strong> macOS đời mới đi kèm <em>openrsync</em>: <code>rsync --version</code> in ra <code>openrsync: protocol version 29</code>. Output của <code>--stats</code> dùng chữ khác — đo trên máy Mac của khoá: <code>Number of files transferred: 1</code> và <code>Total sent: 669 B</code>, không có dòng "Literal data" — nên lệnh <code>grep -E 'bytes sent|Literal'</code> ở trên chẳng in ra gì ở đó. Nó còn từ chối thẳng một số cờ: <code>rsync: unrecognized option &#96;--chown=deploy:deploy'</code>, và y như vậy với <code>--info=stats2</code>. Nếu script deploy phải chạy trên Mac, cài GNU rsync (<code>brew install rsync</code>) hoặc chạy nó bên trong Linux. Trên Windows thì không có rsync sẵn: chạy deploy từ WSL, và giữ kiểu xuống dòng của script là LF — một script lưu bằng CRLF của Windows sẽ hỏng trên máy chủ với lỗi kiểu <code>$'\\r': command not found</code>.</div>

<h3>Con số làm người ta bất ngờ</h3>
<div class="out">=== rsync: lan dau (cay rong)      → 280 ms
=== rsync: lan hai (khong doi gi)  → 286 ms
=== rsync: sau khi sua DUNG MOT tep → 280 ms</div>
<p>Chuyển 176 KB, chuyển KHÔNG GÌ CẢ, và chuyển một tệp nhỏ đều mất chừng ấy thời gian như nhau. Công việc không nằm ở phần truyền — nó nằm ở KẾT NỐI SSH: trao đổi khoá, xác thực, dựng phiên. Ở cỡ dự án này thì phần tải là miễn phí còn cái bắt tay là toàn bộ chi phí.</p>
<div class="callout ok"><strong>Đây là lý do script deploy nên TÁI DÙNG một kết nối SSH.</strong> Một script chạy tám lệnh <code>ssh</code> riêng lẻ thì trả cái giá ~280 ms đó tám lần trước khi làm được việc gì. OpenSSH giải quyết bằng <code>ControlMaster</code> — một kết nối, nhiều lệnh — và Bài 0.2 đo chính xác nó tiết kiệm được bao nhiêu.</div>

<h3>Bước 3, đo thật: cách tráo đơn giản nhất tốn bao nhiêu</h3>
${slide('dv-00', 21, 'Tráo ngây thơ: gián đoạn dài bằng lúc khởi động')}
<p>Cách tráo phổ biến nhất là: giết tiến trình cũ, khởi động cái mới. Đo bằng cách hỏi <code>/health</code> mỗi 50 ms xuyên qua lần tráo, trên một ứng dụng Node tầm thường:</p>
<div class="out">=== TRIEN KHAI 'dung roi khoi dong lai' ===
  tong 200 phep do, 1 cai HONG
  gian doan: 0 ms  (1 request truot)
  200 dau tien sau khi dung: +94 ms</div>
<p>Một request hỏng, và 94 ms cho tới khi phiên bản mới trả lời. Con số đó THẬT SỰ nhỏ — nhỏ tới mức với một dự án cá nhân vào một buổi tối vắng khách thì dừng-rồi-khởi-động-lại là một chiến lược bảo vệ được.</p>
<p>Giờ vẫn đúng lần deploy ấy, trên một ứng dụng chỉ khác đúng một điểm — nó mất BA GIÂY để sẵn sàng, mà đó chính là thứ một ứng dụng phải đọc cấu hình, kết nối cơ sở dữ liệu và dựng bộ đệm sẽ làm:</p>
<div class="out">=== cung mot kieu trien khai, ung dung khoi dong mat 3s ===
  tong 200 phep do, 49 cai HONG
  gian doan: 2983 ms  (49 request truot)
  200 dau tien sau khi dung: +3070 ms</div>
<div class="callout warn"><strong>Một request thành bốn mươi chín; 94 ms thành 2.983 ms.</strong> Tệ hơn ba mươi hai lần, chỉ vì một tính chất của ứng dụng mà không script deploy nào nhìn thấy được. Cái thời gian khởi động bạn chưa bao giờ đo chính là độ dài của mọi lần gián đoạn bạn deploy ra. Chương 3 nói về chuyện làm cho bước tráo ĐỘC LẬP với nó.</div>
<div class="note-ct">Hãy đọc độ phân giải cho trung thực: hỏi mỗi 50 ms nghĩa là MỘT lần hỏng có thể ứng với bất cứ đâu từ một khoảnh khắc tới khoảng 100 ms gián đoạn. Đó là lý do con số thứ hai — <em>thời gian tới cú 200 đầu tiên sau khi giết</em> — mới là con số đáng tin hơn, và chính nó tăng từ 94 ms lên 3.070 ms.</div>

<h3>Bước 4: "nó chạy rồi" phải có nghĩa là gì</h3>
${slide('dv-00', 22, '“Nó chạy rồi” có bốn mức — chỉ mức 3 đáng tin')}
<p>Kiểu hỏng đáng sợ nhất là một lần deploy <em>BÁO THÀNH CÔNG</em> mà để lại một website hỏng. Mọi sự cố trong lịch sử dự án này đều thuộc loại đó: một ảnh dựng xanh, đẩy xanh, tráo xanh, rồi restart vô tận vì engine Prisma của nó được dựng cho một thư viện C khác. Một script thoát ra 0 chứng minh rằng SCRIPT đã chạy, không chứng minh rằng WEBSITE chạy.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Yếu nhất: script thoát ra 0</span><span class="lz-lnote">Chứng minh các lệnh đã chạy. Không nói gì về ứng dụng, thứ có thể chưa khởi động nổi, hoặc đang sập đi sập lại.</span></div>
  <div class="lz-layer"><span class="lz-lname">Khá hơn: tiến trình đang chạy</span><span class="lz-lnote">Có một PID, hoặc cổng đang được lắng nghe. Khá hơn, và vẫn qua được trong lúc ứng dụng trả 500 cho tất cả mọi thứ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đúng: một tuyến THẬT trả lời đúng</span><span class="lz-lnote">Một request HTTP vào một tuyến mà ứng dụng thật sự phục vụ, có kiểm mã trạng thái. <code>401</code> và <code>200</code> đều chứng minh tuyến đã được gắn; <code>404</code> nghĩa là chưa — bản dựng cũ, hoặc bộ định tuyến chưa đăng ký.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tốt nhất: phép kiểm đó HỎNG thì deploy phải HỎNG</span><span class="lz-lnote">Một phép kiểm mà kết quả bị bỏ qua thì chỉ là đồ trang trí. Nếu smoke test không dừng được lần deploy hay không kích hoạt được lùi lại, thì nó không phải một cái cổng.</span></div>
</div>
<div class="callout"><strong>Bốn bước này dẫn tới đâu.</strong> Khoá nay có mười sáu phần, không còn là mười hai. Chương 1–11 lần lượt đi qua từng bước và từng kiểu hỏng của nó; bốn chương thêm vào tháng 9/2026 đưa cũng bốn bước đó ra Internet thật: Chương 12 (từ tên miền tới HTTPS), Chương 13 (deploy bằng container, registry và CI), Chương 14 (nhiều môi trường, và vượt khỏi một máy chủ) và Chương 15 (dự án cuối khoá: đưa trọn một ứng dụng lên từ đầu tới cuối). Bài 0.4 có bản đồ đầy đủ.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn trong nhóm muốn deploy bằng cách <code>rsync</code> thẳng thư mục dự án lên máy chủ của nhóm, "vì nhanh hơn git". Hãy chứng minh trên VPS thí nghiệm (dựng ở "Bắt đầu tại đây (2/2)") xem cách đó sẽ gửi đi những gì.</p><ol>
<li>Trong <code>~/dv-lab</code>, tạo một dự án nhỏ rồi commit: một <code>src/server.js</code>, một <code>README.md</code>, một <code>public/index.html</code>; <code>git init &amp;&amp; git add . &amp;&amp; git commit -m "ban 1"</code>.</li>
<li>Chạy thử lần deploy và đọc từng dòng: <code>rsync -azin --delete --exclude .git -e "ssh -F ~/dv-lab/ssh.cfg" ./ vps:app/</code>. Rồi chạy thật (bỏ <code>-n</code>).</li>
<li>Thêm một dòng gõ dở vào <code>src/server.js</code> mà KHÔNG commit: <code>echo '// DANG GO DO — chua xong' &gt;&gt; src/server.js</code>. Chạy thử lại: phải hiện đúng một dòng.</li>
<li>Deploy cả hai cách — <code>rsync</code> vào <code>app/</code>, và bản đã commit bằng <code>git archive --format=tar HEAD | ssh -F ~/dv-lab/ssh.cfg vps 'mkdir -p ~/app2 &amp;&amp; tar x -C ~/app2'</code> — rồi đếm dòng gõ dở trên máy chủ (khối dưới).</li>
<li>Trả tệp về như cũ bằng <code>git checkout -- src/server.js</code>.</li></ol>
<pre><code class="language-bash">ssh -F ~/dv-lab/ssh.cfg vps 'echo "ban rsync:       $(grep -c "DANG GO DO" ~/app/src/server.js)"; echo "ban git archive: $(grep -c "DANG GO DO" ~/app2/src/server.js)"'</code></pre>
<div class="out">ban rsync:       1
ban git archive: 0</div>
<p><strong>Đạt khi:</strong> lần chạy thử sau bước 3 chỉ hiện đúng một dòng <code>&lt;f.s…</code> (hoặc <code>&lt;f.st…</code>) cho <code>src/server.js</code>, và máy chủ báo <code>1</code> với bản rsync, <code>0</code> với bản git archive — để bạn nói được với bạn cùng nhóm, có bằng chứng, cách nào gửi đi cái tệp mình còn đang gõ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Artifact (tạo tác — thứ được gửi đi)</span><span class="v">Chính xác tập byte mà lần deploy gửi đi, được quyết định một lần và có chủ ý.</span></div>
  <div class="kv"><span class="k">Working tree (cây làm việc)</span><span class="v">Các tệp trong thư mục dự án ngay lúc này, kể cả những chỗ sửa chưa commit.</span></div>
  <div class="kv"><span class="k">Transport (vận chuyển)</span><span class="v">Cách tạo tác tới máy chủ: rsync, git, scp, kéo từ registry.</span></div>
  <div class="kv"><span class="k">Swap (tráo)</span><span class="v">Khoảnh khắc bản mới trở thành bản đang trả lời request.</span></div>
  <div class="kv"><span class="k">Dry run (chạy thử — <code>-n</code>)</span><span class="v">Chạy một lệnh sao cho nó báo SẼ làm gì mà không làm thật.</span></div>
  <div class="kv"><span class="k">Delta transfer (chỉ gửi phần chênh)</span><span class="v">Chỉ gửi những gì khác với thứ bên kia đã có.</span></div>
  <div class="kv"><span class="k">SSH handshake (bắt tay SSH)</span><span class="v">Trao đổi khoá và xác thực ở đầu mỗi kết nối SSH — chi phí cố định của từng kết nối.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi lần deploy là tạo tác → vận chuyển → tráo → kiểm, và mọi cái hỏng đều thuộc về một trong bốn bước.</li>
<li><code>rsync</code> một cây làm việc là gửi đi bất cứ thứ gì bạn đang gõ; một tạo tác dựng từ commit thì không thể.</li>
<li>rsync và git đều chỉ gửi phần chênh; ở cỡ nhỏ, cái giá là cú bắt tay SSH chứ không phải dữ liệu.</li>
<li>Đọc một lần chạy thử (<code>rsync -azin</code>) trước lần deploy thật đầu tiên lên bất kỳ máy nào — trên Mac, nhớ rằng <code>rsync</code> là openrsync, output khác và thiếu cờ.</li>
<li>Dừng-rồi-khởi-động tốn gián đoạn đúng bằng thời gian khởi động của ứng dụng: 1 request rơi thành 49 khi khởi động mất 3 giây.</li>
<li>"Chạy rồi" nghĩa là một tuyến thật trả lời đúng, và một phép kiểm không dừng được deploy chỉ là đồ trang trí.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — V. Build, release, run</span><span class="lc-sub">12factor.net/build-release-run — phát biểu ngắn gọn và rõ nhất về việc vì sao phải tách tạo tác khỏi bản phát hành, tức là bước 1 ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — hai cờ --stats và --itemize-changes</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — hai cái cờ đã sinh ra mấy con số byte ở trên, và là cách nhanh nhất để thấy một lần deploy thật sự gửi đi cái gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — một commit thật ra chứa cái gì</span><span class="lc-sub">/courses/git/learn${REF} — chính là cái tạo tác ở bước 1, khi tạo tác là một commit.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — tiến trình, tín hiệu và kill thật ra làm gì</span><span class="lc-sub">/courses/linux-bash/learn${REF} — cơ chế nằm dưới bước 3, và vì sao một tiến trình không chết ngay khoảnh khắc bạn bảo nó chết.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — The machine that receives the deploy|||0.2 — Cái máy nhận lần deploy',
      slug: 'deploy-0-2-may-nhan',
      type: 'LESSON',
      description: 'Bốn thay đổi trên máy chủ, mỗi cái đo bằng thứ kẻ tấn công nhìn thấy hoặc bằng thời gian tiết kiệm được. Trong đó có một khoá SSH không thể biến thành shell, và một lỗi quyền sở hữu tệp mà mọi hướng dẫn rsync đều bỏ qua.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>The machine that receives the deploy</h2>
<p class="lead">A fresh VPS is reachable from the entire internet within seconds of being created, and the automated login attempts start about as fast. This lesson makes four changes and measures each one — not by quoting a checklist, but by looking at what an attacker actually sees before and after.</p>

<h3>First, read what is actually in effect</h3>
${slide('dv-00', 23, 'Đọc cấu hình ĐANG hiệu lực, đừng đọc tệp')}
<p>Do not read <code>/etc/ssh/sshd_config</code> to find out what SSH allows. That file is a wish; it has commented-out defaults, <code>Include</code> directives pulling in <code>sshd_config.d/*.conf</code>, and settings that a later line silently overrides. <code>sshd -T</code> prints the values the daemon will actually use:</p>
<div class="out">$ sshd -T | grep -iE 'permitroot|password|pubkey|maxauth|forwarding'

  maxauthtries 6
  permitrootlogin without-password
  pubkeyauthentication yes
  passwordauthentication yes
  kbdinteractiveauthentication no
  x11forwarding yes
  permitemptypasswords no
  allowtcpforwarding yes
  permittunnel no</div>
<div class="note-ct">Two things worth noticing in a default install. <code>passwordauthentication yes</code> — passwords are accepted, which is the single setting most worth changing. And <code>permitrootlogin without-password</code>, which despite its name does <em>not</em> mean "no password needed"; it means "any method except a password", so key-based root login is allowed. The clearer synonym is <code>prohibit-password</code> — but even OpenSSH 9.6 (Ubuntu 24.04) still prints <code>without-password</code> in <code>sshd -T</code>, whichever of the two names you wrote in the file (measured below). They are two names for one value.</div>

<h3>Deep dive: drop-in files, and why the first value wins</h3>
<p>Ubuntu's <code>sshd_config</code> starts with <code>Include /etc/ssh/sshd_config.d/*.conf</code>, so the usual way to harden SSH is to drop a small file into that directory. Two rules decide whether it works: files are read in alphabetical order, and for most keywords <strong>sshd keeps the first value it reads</strong> and ignores later ones. Cloud images often ship a <code>50-cloud-init.conf</code> that says <code>PasswordAuthentication yes</code>. Measured on the practice VPS (Ubuntu 24.04, OpenSSH 9.6):</p>
<pre><code class="language-bash">ls /etc/ssh/sshd_config.d/
sudo sshd -t &amp;&amp; echo "sshd -t: cu phap OK"
sudo sshd -T | grep -E "^(passwordauthentication|kbdinteractiveauthentication|permitrootlogin)"</code></pre>
<div class="out">50-cloud-init.conf
70-gia-co.conf
sshd -t: cu phap OK
permitrootlogin without-password
passwordauthentication yes
kbdinteractiveauthentication no</div>
<p>The hardening file says <code>PasswordAuthentication no</code>, the syntax check passes — and passwords are still on, because <code>50-</code> was read before <code>70-</code>. Rename the same file to <code>01-gia-co.conf</code> and nothing else changes:</p>
<div class="out">01-gia-co.conf
50-cloud-init.conf
permitrootlogin without-password
passwordauthentication no
kbdinteractiveauthentication no</div>
<div class="pitfall co-tieu-de"><strong>"The command returned 0" is not "the setting is in effect".</strong> <code>sshd -t</code> only checks syntax. A file that loses the ordering race is perfectly valid and does nothing. Name your drop-in so it sorts first (<code>01-</code>), and verify with <code>sshd -T</code> — the effective value — never with <code>cat</code> of the file you just wrote. The same file also set <code>PermitRootLogin prohibit-password</code>, and <code>sshd -T</code> still prints <code>without-password</code>: the same value under its older name.</div>
<table>
  <tr><th>Directive</th><th>Safe value</th><th>What it stops</th></tr>
  <tr><td><code>PasswordAuthentication</code></td><td><code>no</code></td><td>password guessing — the single most valuable line</td></tr>
  <tr><td><code>KbdInteractiveAuthentication</code></td><td><code>no</code></td><td>the second road to the same password, via PAM</td></tr>
  <tr><td><code>PermitRootLogin</code></td><td><code>prohibit-password</code> or <code>no</code></td><td>root by password; <code>no</code> also blocks root by key</td></tr>
  <tr><td><code>MaxAuthTries</code></td><td><code>3</code></td><td>many guesses per connection</td></tr>
  <tr><td><code>AllowTcpForwarding</code> / <code>AllowAgentForwarding</code></td><td><code>no</code> (if unused)</td><td>using the server as a tunnel into the network behind it</td></tr>
  <tr><td><code>X11Forwarding</code></td><td><code>no</code></td><td>graphical forwarding nobody needs on a server</td></tr>
</table>
<h3>What an attacker sees, before and after</h3>
${slide('dv-00', 24, 'sshd -T nói “sẽ thế”; máy khách nói “đang thế”')}
<p>Two daemons, one default and one hardened, asked for a password login by a user that does not exist:</p>
<div class="out">=== cong 2222 (mac dinh) ===
  Permission denied, please try again.
  Permission denied, please try again.
  Permission denied (publickey,password).

=== cong 2223 (da gia co) ===
  Permission denied (publickey).</div>
<p>The default gave three password prompts and then named both accepted methods. The hardened one refused immediately and named only <code>publickey</code>.</p>
<div class="callout warn"><strong>That parenthesis is reconnaissance.</strong> <code>(publickey,password)</code> tells a scanner that guessing is worth its time, and the three prompts tell it how many guesses it gets per connection. <code>(publickey)</code> tells it there is nothing to guess — no password exists that will work, however weak, however many attempts. It is the difference between a lock that can be picked slowly and a door with no keyhole.</div>
<pre><code><span class="tok-comment"># /etc/ssh/sshd_config.d/10-gia-co.conf</span>
PermitRootLogin prohibit-password    <span class="tok-comment"># khoa duoc, mat khau thi khong</span>
PasswordAuthentication no            <span class="tok-comment"># thay doi quan trong nhat</span>
KbdInteractiveAuthentication no      <span class="tok-comment"># cua sau cua mat khau — dong luon</span>
PermitEmptyPasswords no
MaxAuthTries 3
X11Forwarding no
AllowTcpForwarding no                <span class="tok-comment"># chi tat neu ban khong dung tunnel</span>
AllowAgentForwarding no</code></pre>
<div class="pitfall"><strong>Trap — <code>PasswordAuthentication no</code> without <code>KbdInteractiveAuthentication no</code> is a half-closed door.</strong> Keyboard-interactive is a separate mechanism that on many distributions ends up asking for the same password through PAM. Turning off one and leaving the other is a configuration that reads as hardened and measures as open. The <code>sshd -T</code> output above is how you check which state you are actually in — and always test the new setting from a second terminal <em>before</em> closing the first, because a locked-out root on a VPS means a console rescue session.</div>

<h3>Deep dive: <code>sshd -T</code> says "will be", the client says "is"</h3>
<p><code>sshd -T</code> reads the files on disk. The daemon that is already running read them when it started. Until you reload it, the two can disagree — measured on the practice VPS, with the fixed <code>01-</code> file already in place and <code>sshd -T</code> already printing <code>no</code>:</p>
<pre><code class="language-bash"><span class="tok-comment"># tu MAY KHACH: dong dang nhap bang khoa de xem may chu CON cho cach nao</span>
ssh -o BatchMode=yes -o PubkeyAuthentication=no khongcoai@vps true
sudo systemctl reload ssh      <span class="tok-comment"># (trong container: kill -HUP 1)</span>
ssh -o BatchMode=yes -o PubkeyAuthentication=no khongcoai@vps true</code></pre>
<div class="out">khongcoai@127.0.0.1: Permission denied (publickey,password).
khongcoai@127.0.0.1: Permission denied (publickey).</div>
<p>Before the reload the running server still offered passwords; after it, only keys. The client's view is the truth, because it is the attacker's view. Two habits follow: always reload after editing, and always confirm from a second terminal that you can still log in <em>before</em> closing the first one.</p>
<div class="callout warn"><strong>On Ubuntu 24.04, <code>ssh.socket</code> changes the rules for <code>Port</code>.</strong> SSH there is started by socket activation: systemd holds port 22 and hands connections to sshd. A <code>Port</code> line in <code>sshd_config</code> therefore does not take effect with a plain reload — systemd has to regenerate the socket (<code>systemctl daemon-reload</code> and a restart of <code>ssh.socket</code>). Check <code>systemctl is-enabled ssh.socket</code> before changing ports, and keep a second session open. The Linux &amp; Bash course (Chapter 9) walks through it.</div>
<h3>A key that cannot become a shell</h3>
${slide('dv-00', 25, 'Một khoá deploy không thể biến thành shell')}
<p>A deploy key lives in CI, or in a script, or on a laptop. If it is stolen, the default outcome is a full shell on the server. It does not have to be. Prefixing the key in <code>authorized_keys</code> with a forced command means that key runs one program and nothing else:</p>
<pre><code><span class="tok-comment"># ~/.ssh/authorized_keys — tat ca tren MOT dong</span>
command="/srv/vps/chi-duoc-deploy.sh",no-agent-forwarding,no-port-forwarding,\\
no-pty,no-X11-forwarding ssh-ed25519 AAAAC3Nza... deploy@ci</code></pre>
<p>Three attempts with that key — one legitimate, two not:</p>
<div class="out">=== 1) khoa deploy chay dung viec cua no ===
  [deploy] lenh client YEU CAU: deploy
  [deploy] dang trien khai...
=== 2) cung khoa do, nhung doi lay mot SHELL ===
  [deploy] lenh client YEU CAU: &lt;khong co&gt;
  [deploy] dang trien khai...
=== 3) cung khoa do, doi doc /etc/shadow ===
  [deploy] lenh client YEU CAU: cat /etc/shadow
  [deploy] dang trien khai...</div>
<div class="callout ok"><strong>All three ran the deploy script.</strong> Asking for a shell got the deploy script. Asking to read the shadow password file got the deploy script. What the client requested is not discarded — it arrives in <code>\$SSH_ORIGINAL_COMMAND</code>, which is how a forced-command script can offer a small menu of allowed actions, and also how you log exactly what a stolen key tried to do.</div>
<p><code>no-pty</code> is what stops an interactive terminal being allocated at all, and the three <code>no-*-forwarding</code> options stop the key being used to tunnel into the private network behind the server. Together they turn a credential worth stealing into one worth much less.</p>
<div class="note-ct">Since OpenSSH 7.2 there is a shorter, safer spelling: <code>restrict,command="/srv/vps/chi-duoc-deploy.sh" ssh-ed25519 …</code>. <code>restrict</code> switches off every forwarding and the terminal in one word — including any new kind of forwarding a future OpenSSH version adds — so you do not have to list them. Inside the forced-command script, log <code>$SSH_ORIGINAL_COMMAND</code> with a timestamp: if the key is ever stolen, that log is the record of what the thief tried.</div>

<h3>Reuse the connection: 228 ms becomes 8 ms</h3>
${slide('dv-00', 26, 'Dùng chung một kết nối SSH: 134 → 15 ms/lệnh')}
<p>Lesson 0.1 measured that an <code>rsync</code> takes about 280 ms regardless of payload, because the SSH handshake is the cost. A deploy script runs many SSH commands, and each one pays it again. OpenSSH can multiplex them over a single connection:</p>
<div class="out">=== 8 lenh ssh RIENG LE (moi cai mot ket noi) ===
  1830 ms  (228 ms/lenh)
=== 8 lenh ssh dung CHUNG mot ket noi (ControlMaster) ===
  71 ms  (8 ms/lenh)</div>
<pre><code><span class="tok-comment"># ~/.ssh/config</span>
Host vps
    HostName 203.0.113.10
    User trienkhai
    ControlMaster auto
    ControlPath  ~/.ssh/cm-%r@%h:%p
    ControlPersist 60          <span class="tok-comment"># giu ket noi song them 60s sau lenh cuoi</span></code></pre>
<p>Twenty-six times faster per command, and the saving grows with every step a deploy script adds. It costs one block in <code>~/.ssh/config</code> and nothing on the server.</p>
<div class="note-ct">Close a persistent connection deliberately with <code>ssh -O exit vps</code>. Two things to know: the socket path is a real file, so a stale one after a crash produces a confusing "control socket already exists" — delete it. And a multiplexed session inherits the master connection, so changing <code>~/.ssh/config</code> has no effect until the master exits.</div>
<h3>Deep dive: the same measurement on the practice VPS, and a limit nobody mentions</h3>
<p>Repeated on the course's practice VPS (a container on the same Mac, so the network is local and faster than a real server): eight separate <code>ssh vps true</code> commands took 1,042–1,073 ms, about 130 ms each; with <code>ControlMaster</code> the same eight took 121 ms, about 15 ms each. The ratio holds even when the absolute numbers are smaller.</p>
<p>The first attempt, however, failed with this:</p>
<div class="out">ControlPath too long ('/private/tmp/…/scratchpad/dv-00/cm-deploy@127.0.0.1:19002' &gt;= 104 bytes)</div>
<p>A control socket is a Unix-domain socket, and its path has a hard length limit (104 bytes on macOS). A <code>ControlPath</code> built from <code>%r@%h:%p</code> inside a deep directory crosses it, and <em>every</em> ssh command using that config then fails. The fix is the <code>%C</code> token — a fixed-length hash of user, host and port: <code>ControlPath ~/.ssh/cm-%C</code>. Check a running master with <code>ssh -O check vps</code> (it prints <code>Master running (pid=…)</code>) and close it with <code>ssh -O exit vps</code>.</p>
<div class="callout warn"><strong>Windows:</strong> the OpenSSH client built into Windows does not support connection multiplexing, so <code>ControlMaster</code> does nothing useful there. Run deploy scripts from WSL, where the normal Linux OpenSSH is used.</div>

<h3>The ownership bug every rsync guide skips</h3>
${slide('dv-00', 27, 'rsync bằng root: tệp đổi chủ, app hết ghi được')}
<p>The application should not run as root, so it gets its own user. The directory is created and given to that user. Then the deploy runs — as root, because that is who has the SSH key — and this happens:</p>
<div class="out">  /srv/vps/app2 thuoc: trienkhai:trienkhai
=== rsync bang root vao thu muc cua trienkhai ===
  sau rsync: root:root
  → ung dung chay duoi trienkhai co doc duoc khong: CO
  → co GHI de duoc khong (log, cache, upload): KHONG</div>
<div class="pitfall"><strong>Trap — the files land owned by whoever ran the deploy, not by whoever owns the directory.</strong> The application can still <em>read</em> everything, because the files are world-readable, so the site comes up and almost every route works. What breaks is anything that writes into the tree: a log file, a cache directory, an upload folder, a SQLite database, a framework build cache. It fails with a permission error on one code path, hours later, and the deploy that caused it reported success.</div>
<p>Three fixes, in order of preference. Deploy <em>as</em> the application user, so the question never arises. Or tell rsync who should own the result — <code>rsync --chown=trienkhai:trienkhai</code>, which needs root on the receiving side. Or keep the writable directories out of the deployed tree entirely, which is the direction Chapter 4 argues for anyway: an artifact should be read-only, and everything that changes at runtime should live somewhere the deploy never touches.</p>
<div class="note-ct">The second fix, <code>--chown</code>, is one of the flags macOS's built-in openrsync does not have: on the course Mac it failed with <code>rsync: unrecognized option &#96;--chown=deploy:deploy'</code>. Deploying from a Mac with that flag needs GNU rsync from Homebrew — another reason the first fix, deploying as the application user, is the better one.</div>
<h3>Hardening the machine, from most to least valuable</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Key-only SSH, no password auth</span><span class="lz-lnote">One line in <code>sshd_config</code> removes the entire class of credential-guessing attacks the logs are full of. Everything below matters less than this.</span></div>
  <div class="lz-layer"><span class="lz-lname">A non-root deploy user</span><span class="lz-lnote">So a compromised deploy key gets a shell with the permissions of one account, not the machine. It also makes the audit trail readable.</span></div>
  <div class="lz-layer"><span class="lz-lname">A firewall that names its open ports</span><span class="lz-lnote"><code>ufw</code> with 22, 80 and 443. The value is not the blocking — it is that anything else listening becomes visible when you read the rules.</span></div>
  <div class="lz-layer"><span class="lz-lname">Unattended security upgrades</span><span class="lz-lnote">The vulnerability that gets exploited is almost never a new one. Automatic patching removes the class where the fix existed for months.</span></div>
</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the group has just been given a fresh VPS and the auth log is already full of login attempts. Harden SSH on your practice VPS, and prove each change from the outside — the way an attacker would see it.</p><ol>
<li>Open a root shell in the practice VPS: <code>docker exec -it lab-vps bash</code>. Check what a password login would get today, from the Mac: <code>ssh -F ~/dv-lab/ssh.cfg -o BatchMode=yes -o PubkeyAuthentication=no khongcoai@vps true</code>.</li>
<li>Simulate a cloud image: <code>echo "PasswordAuthentication yes" &gt; /etc/ssh/sshd_config.d/50-cloud-init.conf</code>. Write your hardening block to <code>/etc/ssh/sshd_config.d/70-gia-co.conf</code>, run <code>sshd -t</code>, then <code>sshd -T | grep ^passwordauth</code>. Explain the result.</li>
<li>Rename it to <code>01-gia-co.conf</code>, check <code>sshd -T</code> again, then reload (<code>kill -HUP 1</code> in the container; <code>systemctl reload ssh</code> on a real server).</li>
<li>Repeat the client test from step 1 and confirm the key login still works: <code>ssh -F ~/dv-lab/ssh.cfg vps whoami</code>.</li>
<li>Add <code>ControlMaster auto</code>, <code>ControlPath /tmp/cm-%C</code> and <code>ControlPersist 60</code> to <code>~/dv-lab/ssh.cfg</code>; time eight commands with and without it: <code>time (for i in 1 2 3 4 5 6 7 8; do ssh -F ~/dv-lab/ssh.cfg vps true; done)</code>.</li></ol>
<p><strong>Done when:</strong> <code>sshd -T</code> prints <code>passwordauthentication no</code>, the client test ends in <code>Permission denied (publickey).</code> with no <code>password</code> in the parenthesis, <code>ssh … vps whoami</code> still prints <code>deploy</code>, and the eight multiplexed commands take at most a third of the time of the eight separate ones.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>sshd -T</code></span><span class="v">Prints the settings sshd would use, after every file and default is resolved.</span></div>
  <div class="kv"><span class="k">Drop-in file</span><span class="v">A small config file in a <code>.d/</code> directory that is included by the main config; order is alphabetical.</span></div>
  <div class="kv"><span class="k">Reload</span><span class="v">Telling a running daemon to re-read its configuration without dropping existing sessions.</span></div>
  <div class="kv"><span class="k">Forced command</span><span class="v"><code>command="…"</code> in <code>authorized_keys</code>: the key can only ever run that program.</span></div>
  <div class="kv"><span class="k">Multiplexing (<code>ControlMaster</code>)</span><span class="v">Running many SSH sessions over one already-authenticated connection.</span></div>
  <div class="kv"><span class="k">Socket activation</span><span class="v">systemd listening on a port and starting the service when a connection arrives (<code>ssh.socket</code> on Ubuntu 24.04).</span></div>
  <div class="kv"><span class="k">Least privilege</span><span class="v">Giving each user or key only the access its job needs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Trust <code>sshd -T</code> and the client's error message, not the file you just wrote.</li>
<li>Drop-in files are read alphabetically and the first value wins — name hardening files <code>01-</code>, and reload after editing.</li>
<li><code>(publickey,password)</code> invites guessing; <code>(publickey)</code> leaves nothing to guess.</li>
<li>A forced command (or <code>restrict,command=…</code>) turns a stolen deploy key into a key that can only deploy.</li>
<li><code>ControlMaster</code> cut per-command cost from about 130 ms to 15 ms on the practice VPS; use <code>%C</code> in <code>ControlPath</code>, and WSL on Windows.</li>
<li>Deploying as root leaves files owned by root; deploy as the application user, and keep writable data outside the release.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sshd_config(5) — every option in the hardening block</span><span class="lc-sub">man.openbsd.org/sshd_config — the authority on what <code>prohibit-password</code> means and why keyboard-interactive is separate from password auth.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sshd(8) — the AUTHORIZED_KEYS FILE FORMAT section</span><span class="lc-sub">man.openbsd.org/sshd#AUTHORIZED_KEYS_FILE_FORMAT — the full list of key restrictions, including <code>command=</code>, <code>from=</code> and <code>restrict</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ssh_config(5) — ControlMaster, ControlPath, ControlPersist</span><span class="lc-sub">man.openbsd.org/ssh_config — the three settings behind the 26× measurement, and the tokens available in a control path.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — users, groups and the permission bits</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the mechanism under the ownership bug, including why read works and write does not.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cái máy nhận lần deploy</h2>
<p class="lead">Một con VPS mới toanh có thể được cả internet với tới chỉ vài giây sau khi tạo, và mấy cú thử đăng nhập tự động bắt đầu cũng nhanh chừng ấy. Bài này thực hiện bốn thay đổi và ĐO từng cái — không phải bằng cách chép lại một danh mục kiểm, mà bằng cách nhìn xem kẻ tấn công thật sự thấy gì trước và sau.</p>

<h3>Trước hết, hãy đọc thứ ĐANG THỰC SỰ có hiệu lực</h3>
${slide('dv-00', 23, 'Đọc cấu hình ĐANG hiệu lực, đừng đọc tệp')}
<p>Đừng đọc <code>/etc/ssh/sshd_config</code> để biết SSH đang cho phép cái gì. Tệp đó là một điều ước; nó đầy giá trị mặc định bị chú thích, những chỉ thị <code>Include</code> kéo vào <code>sshd_config.d/*.conf</code>, và những thiết lập bị một dòng phía sau âm thầm ghi đè. <code>sshd -T</code> in ra đúng những giá trị mà daemon sẽ dùng thật:</p>
<div class="out">$ sshd -T | grep -iE 'permitroot|password|pubkey|maxauth|forwarding'

  maxauthtries 6
  permitrootlogin without-password
  pubkeyauthentication yes
  passwordauthentication yes
  kbdinteractiveauthentication no
  x11forwarding yes
  permitemptypasswords no
  allowtcpforwarding yes
  permittunnel no</div>
<div class="note-ct">Có hai chỗ đáng để ý trong một bản cài mặc định. <code>passwordauthentication yes</code> — mật khẩu ĐƯỢC chấp nhận, và đây là thiết lập đáng đổi nhất. Và <code>permitrootlogin without-password</code>, cái tên nghe như "không cần mật khẩu" nhưng <em>KHÔNG</em> có nghĩa đó; nó nghĩa là "mọi phương thức TRỪ mật khẩu", tức là đăng nhập root bằng khoá vẫn được phép. Từ đồng nghĩa rõ hơn là <code>prohibit-password</code> — nhưng ngay cả OpenSSH 9.6 (Ubuntu 24.04) vẫn in <code>without-password</code> trong <code>sshd -T</code>, dù bạn viết tên nào trong hai tên vào tệp (đo ở dưới). Chúng là hai cái tên của CÙNG một giá trị.</div>

<h3>Đào sâu: tệp drop-in, và vì sao giá trị ĐẦU TIÊN thắng</h3>
<p><code>sshd_config</code> của Ubuntu mở đầu bằng <code>Include /etc/ssh/sshd_config.d/*.conf</code>, nên cách gia cố SSH thường thấy là thả một tệp nhỏ vào thư mục đó. Hai luật quyết định nó có ăn hay không: các tệp được đọc theo thứ tự chữ cái, và với phần lớn từ khoá <strong>sshd giữ giá trị đọc được ĐẦU TIÊN</strong>, bỏ qua các giá trị sau. Ảnh máy của các nhà cung cấp cloud hay có sẵn một tệp <code>50-cloud-init.conf</code> ghi <code>PasswordAuthentication yes</code>. Đo trên VPS thí nghiệm (Ubuntu 24.04, OpenSSH 9.6):</p>
<pre><code class="language-bash">ls /etc/ssh/sshd_config.d/
sudo sshd -t &amp;&amp; echo "sshd -t: cu phap OK"
sudo sshd -T | grep -E "^(passwordauthentication|kbdinteractiveauthentication|permitrootlogin)"</code></pre>
<div class="out">50-cloud-init.conf
70-gia-co.conf
sshd -t: cu phap OK
permitrootlogin without-password
passwordauthentication yes
kbdinteractiveauthentication no</div>
<p>Tệp gia cố ghi <code>PasswordAuthentication no</code>, phép kiểm cú pháp qua — mà mật khẩu vẫn BẬT, vì <code>50-</code> được đọc trước <code>70-</code>. Đổi tên đúng tệp đó thành <code>01-gia-co.conf</code>, không đổi gì khác:</p>
<div class="out">01-gia-co.conf
50-cloud-init.conf
permitrootlogin without-password
passwordauthentication no
kbdinteractiveauthentication no</div>
<div class="pitfall co-tieu-de"><strong>"Lệnh trả về 0" không có nghĩa là "thiết lập đã có hiệu lực".</strong> <code>sshd -t</code> chỉ kiểm cú pháp. Một tệp thua cuộc đua thứ tự vẫn hoàn toàn hợp lệ và chẳng làm gì cả. Đặt tên drop-in sao cho nó đứng đầu (<code>01-</code>), và nghiệm thu bằng <code>sshd -T</code> — giá trị ĐANG hiệu lực — đừng bao giờ bằng cách <code>cat</code> cái tệp vừa ghi. Cùng tệp đó cũng đặt <code>PermitRootLogin prohibit-password</code>, và <code>sshd -T</code> vẫn in <code>without-password</code>: cùng một giá trị dưới cái tên cũ của nó.</div>
<table>
  <tr><th>Chỉ thị</th><th>Giá trị an toàn</th><th>Chặn được gì</th></tr>
  <tr><td><code>PasswordAuthentication</code></td><td><code>no</code></td><td>đoán mật khẩu — dòng đáng giá nhất</td></tr>
  <tr><td><code>KbdInteractiveAuthentication</code></td><td><code>no</code></td><td>con đường thứ hai tới cùng cái mật khẩu, qua PAM</td></tr>
  <tr><td><code>PermitRootLogin</code></td><td><code>prohibit-password</code> hoặc <code>no</code></td><td>root bằng mật khẩu; <code>no</code> chặn luôn root bằng khoá</td></tr>
  <tr><td><code>MaxAuthTries</code></td><td><code>3</code></td><td>đoán nhiều lần trong một kết nối</td></tr>
  <tr><td><code>AllowTcpForwarding</code> / <code>AllowAgentForwarding</code></td><td><code>no</code> (nếu không dùng)</td><td>biến máy chủ thành đường hầm vào mạng phía sau nó</td></tr>
  <tr><td><code>X11Forwarding</code></td><td><code>no</code></td><td>chuyển tiếp đồ hoạ mà máy chủ chẳng ai cần</td></tr>
</table>
<h3>Kẻ tấn công thấy gì, trước và sau</h3>
${slide('dv-00', 24, 'sshd -T nói “sẽ thế”; máy khách nói “đang thế”')}
<p>Hai daemon, một cái mặc định và một cái đã gia cố, cùng bị đòi đăng nhập bằng mật khẩu bởi một người dùng không tồn tại:</p>
<div class="out">=== cong 2222 (mac dinh) ===
  Permission denied, please try again.
  Permission denied, please try again.
  Permission denied (publickey,password).

=== cong 2223 (da gia co) ===
  Permission denied (publickey).</div>
<p>Bản mặc định cho ba lượt hỏi mật khẩu rồi nêu tên cả hai phương thức được chấp nhận. Bản gia cố từ chối NGAY và chỉ nêu <code>publickey</code>.</p>
<div class="callout warn"><strong>Cái ngoặc đơn đó là trinh sát.</strong> <code>(publickey,password)</code> nói với một con dò rằng việc đoán là đáng bỏ công, và ba lượt hỏi kia nói cho nó biết mỗi kết nối được đoán mấy lần. <code>(publickey)</code> nói với nó rằng chẳng có gì để đoán cả — không tồn tại mật khẩu nào chạy được, dù yếu tới đâu, dù thử bao nhiêu lần. Đó là khác biệt giữa một ổ khoá có thể cạy từ từ và một cánh cửa KHÔNG CÓ lỗ khoá.</div>
<pre><code><span class="tok-comment"># /etc/ssh/sshd_config.d/10-gia-co.conf</span>
PermitRootLogin prohibit-password    <span class="tok-comment"># khoa duoc, mat khau thi khong</span>
PasswordAuthentication no            <span class="tok-comment"># thay doi quan trong nhat</span>
KbdInteractiveAuthentication no      <span class="tok-comment"># cua sau cua mat khau — dong luon</span>
PermitEmptyPasswords no
MaxAuthTries 3
X11Forwarding no
AllowTcpForwarding no                <span class="tok-comment"># chi tat neu ban khong dung tunnel</span>
AllowAgentForwarding no</code></pre>
<div class="pitfall"><strong>Bẫy — <code>PasswordAuthentication no</code> mà thiếu <code>KbdInteractiveAuthentication no</code> là một cánh cửa mới khép một nửa.</strong> Keyboard-interactive là một cơ chế RIÊNG mà trên nhiều bản phân phối rốt cuộc vẫn đi hỏi đúng cái mật khẩu đó qua PAM. Tắt một cái và bỏ cái kia là một cấu hình ĐỌC thì thấy đã gia cố còn ĐO thì thấy vẫn mở. Kết quả <code>sshd -T</code> ở trên chính là cách kiểm xem bạn đang ở trạng thái nào — và LUÔN thử thiết lập mới từ một cửa sổ terminal thứ hai <em>TRƯỚC KHI</em> đóng cửa sổ đầu, vì một con VPS mà root bị khoá ngoài nghĩa là phải vào phiên cứu hộ qua console.</div>

<h3>Đào sâu: <code>sshd -T</code> nói "sẽ thế", máy khách nói "đang thế"</h3>
<p><code>sshd -T</code> đọc các tệp trên đĩa. Còn daemon đang chạy thì đã đọc chúng lúc NÓ khởi động. Chừng nào chưa nạp lại, hai bên có thể lệch nhau — đo trên VPS thí nghiệm, khi tệp <code>01-</code> đã sửa xong và <code>sshd -T</code> đã in <code>no</code>:</p>
<pre><code class="language-bash"><span class="tok-comment"># tu MAY KHACH: dong dang nhap bang khoa de xem may chu CON cho cach nao</span>
ssh -o BatchMode=yes -o PubkeyAuthentication=no khongcoai@vps true
sudo systemctl reload ssh      <span class="tok-comment"># (trong container: kill -HUP 1)</span>
ssh -o BatchMode=yes -o PubkeyAuthentication=no khongcoai@vps true</code></pre>
<div class="out">khongcoai@127.0.0.1: Permission denied (publickey,password).
khongcoai@127.0.0.1: Permission denied (publickey).</div>
<p>Trước khi nạp lại, máy chủ đang chạy vẫn mời mật khẩu; sau đó thì chỉ còn khoá. Góc nhìn của máy khách mới là sự thật, vì đó chính là góc nhìn của kẻ tấn công. Hai thói quen rút ra: luôn nạp lại sau khi sửa, và luôn xác nhận từ một terminal THỨ HAI rằng mình vẫn đăng nhập được <em>TRƯỚC KHI</em> đóng terminal thứ nhất.</p>
<div class="callout warn"><strong>Trên Ubuntu 24.04, <code>ssh.socket</code> đổi luật chơi với <code>Port</code>.</strong> SSH ở đó được khởi động theo kiểu socket activation (kích hoạt theo socket): systemd giữ cổng 22 rồi trao kết nối cho sshd. Vì thế một dòng <code>Port</code> trong <code>sshd_config</code> không có hiệu lực chỉ bằng một lần reload — systemd phải sinh lại socket (<code>systemctl daemon-reload</code> rồi restart <code>ssh.socket</code>). Kiểm <code>systemctl is-enabled ssh.socket</code> trước khi đổi cổng, và giữ một phiên thứ hai mở sẵn. Khoá Linux &amp; Bash (Chương 9) đi qua chuyện này từng bước.</div>
<h3>Một cái khoá không thể biến thành shell</h3>
${slide('dv-00', 25, 'Một khoá deploy không thể biến thành shell')}
<p>Khoá deploy sống trong CI, hoặc trong một script, hoặc trên một cái laptop. Nếu nó bị trộm thì kết cục mặc định là kẻ trộm có nguyên một shell trên máy chủ. Không nhất thiết phải như vậy. Thêm tiền tố forced command cho cái khoá đó trong <code>authorized_keys</code> nghĩa là khoá ấy chạy đúng MỘT chương trình và không gì khác:</p>
<pre><code><span class="tok-comment"># ~/.ssh/authorized_keys — tat ca tren MOT dong</span>
command="/srv/vps/chi-duoc-deploy.sh",no-agent-forwarding,no-port-forwarding,\\
no-pty,no-X11-forwarding ssh-ed25519 AAAAC3Nza... deploy@ci</code></pre>
<p>Ba lần thử với cái khoá đó — một lần chính đáng, hai lần không:</p>
<div class="out">=== 1) khoa deploy chay dung viec cua no ===
  [deploy] lenh client YEU CAU: deploy
  [deploy] dang trien khai...
=== 2) cung khoa do, nhung doi lay mot SHELL ===
  [deploy] lenh client YEU CAU: &lt;khong co&gt;
  [deploy] dang trien khai...
=== 3) cung khoa do, doi doc /etc/shadow ===
  [deploy] lenh client YEU CAU: cat /etc/shadow
  [deploy] dang trien khai...</div>
<div class="callout ok"><strong>Cả ba lần đều chạy script deploy.</strong> Đòi một shell thì nhận được script deploy. Đòi đọc tệp mật khẩu bóng thì nhận được script deploy. Thứ client YÊU CẦU không bị vứt đi — nó tới trong biến <code>\$SSH_ORIGINAL_COMMAND</code>, và đó là cách một script forced-command có thể mở ra một thực đơn nhỏ các hành động được phép, và cũng là cách bạn ghi lại chính xác một cái khoá bị trộm đã thử làm gì.</div>
<p><code>no-pty</code> là thứ ngăn hẳn việc cấp phát một terminal tương tác, còn ba tuỳ chọn <code>no-*-forwarding</code> ngăn cái khoá bị dùng để đào hầm vào mạng riêng nằm sau máy chủ. Cộng lại, chúng biến một tín vật đáng trộm thành một thứ đáng trộm ít hơn hẳn.</p>
<div class="note-ct">Từ OpenSSH 7.2 có một cách viết ngắn và an toàn hơn: <code>restrict,command="/srv/vps/chi-duoc-deploy.sh" ssh-ed25519 …</code>. <code>restrict</code> tắt MỌI kiểu chuyển tiếp lẫn terminal chỉ bằng một chữ — kể cả kiểu chuyển tiếp mới nào mà OpenSSH đời sau thêm vào — nên bạn khỏi phải liệt kê từng cái. Bên trong script forced-command, hãy ghi log <code>$SSH_ORIGINAL_COMMAND</code> kèm thời gian: nếu cái khoá có ngày bị lấy cắp, log đó là biên bản những gì kẻ trộm đã thử.</div>

<h3>Tái dùng kết nối: 228 ms thành 8 ms</h3>
${slide('dv-00', 26, 'Dùng chung một kết nối SSH: 134 → 15 ms/lệnh')}
<p>Bài 0.1 đã đo rằng một lệnh <code>rsync</code> mất chừng 280 ms bất kể tải nặng nhẹ, vì cái bắt tay SSH mới là chi phí. Một script deploy chạy nhiều lệnh SSH, và mỗi lệnh lại trả cái giá đó một lần nữa. OpenSSH ghép được tất cả chúng lên MỘT kết nối:</p>
<div class="out">=== 8 lenh ssh RIENG LE (moi cai mot ket noi) ===
  1830 ms  (228 ms/lenh)
=== 8 lenh ssh dung CHUNG mot ket noi (ControlMaster) ===
  71 ms  (8 ms/lenh)</div>
<pre><code><span class="tok-comment"># ~/.ssh/config</span>
Host vps
    HostName 203.0.113.10
    User trienkhai
    ControlMaster auto
    ControlPath  ~/.ssh/cm-%r@%h:%p
    ControlPersist 60          <span class="tok-comment"># giu ket noi song them 60s sau lenh cuoi</span></code></pre>
<p>Nhanh hơn hai mươi sáu lần trên mỗi lệnh, và mức tiết kiệm còn tăng theo từng bước mà script deploy thêm vào. Nó tốn đúng một khối trong <code>~/.ssh/config</code> và không tốn gì trên máy chủ.</p>
<div class="note-ct">Đóng một kết nối bền vững một cách có chủ ý bằng <code>ssh -O exit vps</code>. Có hai điều nên biết: đường dẫn socket là một tệp THẬT, nên một cái socket cũ còn sót sau khi sập sẽ sinh ra thông báo khó hiểu "control socket already exists" — hãy xoá nó đi. Và một phiên ghép kênh kế thừa kết nối chủ, nên sửa <code>~/.ssh/config</code> sẽ KHÔNG có tác dụng gì cho tới khi kết nối chủ thoát.</div>
<h3>Đào sâu: cùng phép đo trên VPS thí nghiệm, và một giới hạn chẳng ai nhắc</h3>
<p>Đo lại trên VPS thí nghiệm của khoá (một container trên chính máy Mac, nên mạng là cục bộ và nhanh hơn máy chủ thật): tám lệnh <code>ssh vps true</code> riêng lẻ mất 1.042–1.073 ms, khoảng 130 ms mỗi lệnh; có <code>ControlMaster</code> thì tám lệnh đó mất 121 ms, khoảng 15 ms mỗi lệnh. Tỉ lệ vẫn giữ nguyên dù con số tuyệt đối nhỏ hơn.</p>
<p>Tuy vậy, lần thử đầu tiên hỏng với dòng này:</p>
<div class="out">ControlPath too long ('/private/tmp/…/scratchpad/dv-00/cm-deploy@127.0.0.1:19002' &gt;= 104 bytes)</div>
<p>Socket điều khiển là một Unix-domain socket, và đường dẫn của nó có giới hạn độ dài cứng (104 byte trên macOS). Một <code>ControlPath</code> ghép từ <code>%r@%h:%p</code> nằm trong một thư mục sâu sẽ vượt giới hạn đó, và khi ấy <em>MỌI</em> lệnh ssh dùng cấu hình đó đều hỏng. Cách sửa là token <code>%C</code> — một mã băm độ dài cố định của người dùng, máy và cổng: <code>ControlPath ~/.ssh/cm-%C</code>. Kiểm một kết nối chủ đang chạy bằng <code>ssh -O check vps</code> (nó in <code>Master running (pid=…)</code>) và đóng nó bằng <code>ssh -O exit vps</code>.</p>
<div class="callout warn"><strong>Windows:</strong> trình khách OpenSSH có sẵn trong Windows không hỗ trợ ghép kênh kết nối (multiplexing), nên <code>ControlMaster</code> ở đó chẳng làm được gì có ích. Chạy script deploy từ WSL, nơi dùng OpenSSH Linux bình thường.</div>

<h3>Lỗi quyền sở hữu mà mọi hướng dẫn rsync đều bỏ qua</h3>
${slide('dv-00', 27, 'rsync bằng root: tệp đổi chủ, app hết ghi được')}
<p>Ứng dụng không nên chạy dưới root, nên nó có người dùng riêng. Thư mục được tạo và giao cho người dùng đó. Rồi lần deploy chạy — dưới quyền root, vì root mới là bên giữ khoá SSH — và chuyện này xảy ra:</p>
<div class="out">  /srv/vps/app2 thuoc: trienkhai:trienkhai
=== rsync bang root vao thu muc cua trienkhai ===
  sau rsync: root:root
  → ung dung chay duoi trienkhai co doc duoc khong: CO
  → co GHI de duoc khong (log, cache, upload): KHONG</div>
<div class="pitfall"><strong>Bẫy — tệp rơi xuống thuộc về NGƯỜI CHẠY DEPLOY, không thuộc về người sở hữu thư mục.</strong> Ứng dụng vẫn <em>ĐỌC</em> được mọi thứ, vì tệp cho cả thế giới đọc, nên website vẫn lên và gần như mọi tuyến vẫn chạy. Thứ vỡ là bất cứ cái gì GHI vào trong cây: một tệp log, một thư mục cache, một thư mục upload, một cơ sở dữ liệu SQLite, một cache dựng của framework. Nó hỏng bằng một lỗi quyền trên đúng một nhánh mã, vài giờ sau, và lần deploy gây ra nó thì đã báo thành công.</div>
<p>Ba cách sửa, xếp theo mức ưu tiên. Deploy <em>DƯỚI QUYỀN</em> người dùng của ứng dụng, để câu hỏi này không bao giờ phát sinh. Hoặc bảo rsync ai nên sở hữu kết quả — <code>rsync --chown=trienkhai:trienkhai</code>, cái này cần quyền root ở phía nhận. Hoặc đưa hẳn những thư mục có ghi ra ngoài cây được deploy, và đó cũng chính là hướng mà Chương 4 sẽ lập luận: một tạo tác nên CHỈ ĐỌC, còn mọi thứ thay đổi lúc chạy thì nên sống ở một chỗ mà lần deploy không bao giờ đụng tới.</p>
<div class="note-ct">Cách sửa thứ hai, <code>--chown</code>, là một trong những cờ mà openrsync có sẵn của macOS KHÔNG có: trên máy Mac của khoá nó hỏng với <code>rsync: unrecognized option &#96;--chown=deploy:deploy'</code>. Deploy từ Mac bằng cờ đó cần GNU rsync từ Homebrew — thêm một lý do để cách sửa thứ nhất, deploy dưới quyền người dùng của ứng dụng, là cách tốt hơn.</div>
<h3>Làm cứng cái máy, từ giá trị cao nhất xuống thấp nhất</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">SSH chỉ bằng khoá, tắt xác thực mật khẩu</span><span class="lz-lnote">Một dòng trong <code>sshd_config</code> gỡ bỏ cả một họ tấn công dò mật khẩu mà log lúc nào cũng đầy. Mọi thứ bên dưới đều ít quan trọng hơn cái này.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một người dùng deploy không phải root</span><span class="lz-lnote">Để một khoá deploy bị lộ chỉ mở ra một shell với quyền của một tài khoản, chứ không phải quyền của cả máy. Nó cũng làm dấu vết kiểm toán đọc được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một tường lửa gọi tên các cổng đang mở</span><span class="lz-lnote"><code>ufw</code> với 22, 80 và 443. Giá trị không nằm ở việc chặn — mà ở chỗ mọi thứ khác đang lắng nghe sẽ lộ ra khi bạn đọc các luật.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tự động cập nhật bản vá an ninh</span><span class="lz-lnote">Lỗ hổng bị khai thác gần như chẳng bao giờ là lỗ hổng mới. Vá tự động gỡ bỏ cái họ mà bản sửa đã có sẵn từ mấy tháng trước.</span></div>
</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm vừa được cấp một VPS mới toanh và log xác thực đã đầy những lần thử đăng nhập. Gia cố SSH trên VPS thí nghiệm của bạn, và chứng minh từng thay đổi TỪ BÊN NGOÀI — đúng cách kẻ tấn công nhìn thấy.</p><ol>
<li>Mở một shell root trong VPS thí nghiệm: <code>docker exec -it lab-vps bash</code>. Từ Mac, xem hôm nay một lần đăng nhập bằng mật khẩu nhận được gì: <code>ssh -F ~/dv-lab/ssh.cfg -o BatchMode=yes -o PubkeyAuthentication=no khongcoai@vps true</code>.</li>
<li>Giả lập ảnh máy cloud: <code>echo "PasswordAuthentication yes" &gt; /etc/ssh/sshd_config.d/50-cloud-init.conf</code>. Ghi khối gia cố của bạn vào <code>/etc/ssh/sshd_config.d/70-gia-co.conf</code>, chạy <code>sshd -t</code>, rồi <code>sshd -T | grep ^passwordauth</code>. Giải thích kết quả.</li>
<li>Đổi tên nó thành <code>01-gia-co.conf</code>, kiểm lại <code>sshd -T</code>, rồi nạp lại (<code>kill -HUP 1</code> trong container; <code>systemctl reload ssh</code> trên máy thật).</li>
<li>Lặp lại phép thử phía máy khách ở bước 1, và xác nhận đăng nhập bằng khoá vẫn chạy: <code>ssh -F ~/dv-lab/ssh.cfg vps whoami</code>.</li>
<li>Thêm <code>ControlMaster auto</code>, <code>ControlPath /tmp/cm-%C</code> và <code>ControlPersist 60</code> vào <code>~/dv-lab/ssh.cfg</code>; bấm giờ tám lệnh khi có và không có nó: <code>time (for i in 1 2 3 4 5 6 7 8; do ssh -F ~/dv-lab/ssh.cfg vps true; done)</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>sshd -T</code> in <code>passwordauthentication no</code>, phép thử máy khách kết thúc bằng <code>Permission denied (publickey).</code> và trong ngoặc không còn chữ <code>password</code>, <code>ssh … vps whoami</code> vẫn in <code>deploy</code>, và tám lệnh dùng chung kết nối mất tối đa một phần ba thời gian của tám lệnh riêng lẻ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>sshd -T</code> (in cấu hình hiệu lực)</span><span class="v">In ra các thiết lập sshd SẼ dùng, sau khi đã gộp mọi tệp và giá trị mặc định.</span></div>
  <div class="kv"><span class="k">Drop-in file (tệp cấu hình thả vào)</span><span class="v">Một tệp cấu hình nhỏ trong thư mục <code>.d/</code> được tệp chính kéo vào; thứ tự theo chữ cái.</span></div>
  <div class="kv"><span class="k">Reload (nạp lại)</span><span class="v">Bảo một daemon đang chạy đọc lại cấu hình mà không cắt các phiên đang mở.</span></div>
  <div class="kv"><span class="k">Forced command (lệnh bị ép)</span><span class="v"><code>command="…"</code> trong <code>authorized_keys</code>: cái khoá đó chỉ bao giờ chạy được đúng chương trình ấy.</span></div>
  <div class="kv"><span class="k">Multiplexing / <code>ControlMaster</code> (ghép kênh)</span><span class="v">Chạy nhiều phiên SSH trên một kết nối đã xác thực sẵn.</span></div>
  <div class="kv"><span class="k">Socket activation (kích hoạt theo socket)</span><span class="v">systemd nghe sẵn ở một cổng và bật dịch vụ khi có kết nối tới (<code>ssh.socket</code> trên Ubuntu 24.04).</span></div>
  <div class="kv"><span class="k">Least privilege (quyền tối thiểu)</span><span class="v">Cho mỗi người dùng hay mỗi khoá chỉ đúng quyền mà việc của nó cần.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tin <code>sshd -T</code> và thông báo lỗi phía máy khách, đừng tin cái tệp vừa ghi.</li>
<li>Tệp drop-in được đọc theo chữ cái và giá trị ĐẦU TIÊN thắng — đặt tên tệp gia cố là <code>01-</code>, và nạp lại sau khi sửa.</li>
<li><code>(publickey,password)</code> mời người ta đoán; <code>(publickey)</code> không chừa gì để đoán.</li>
<li>Một forced command (hoặc <code>restrict,command=…</code>) biến một khoá deploy bị lộ thành một khoá chỉ deploy được.</li>
<li><code>ControlMaster</code> hạ chi phí mỗi lệnh từ khoảng 130 ms xuống 15 ms trên VPS thí nghiệm; dùng <code>%C</code> trong <code>ControlPath</code>, và dùng WSL trên Windows.</li>
<li>Deploy bằng root để lại tệp thuộc root; hãy deploy dưới quyền người dùng của ứng dụng và để dữ liệu ghi được ở NGOÀI bản phát hành.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sshd_config(5) — mọi tuỳ chọn trong khối gia cố</span><span class="lc-sub">man.openbsd.org/sshd_config — nguồn chính thống về việc <code>prohibit-password</code> nghĩa là gì và vì sao keyboard-interactive tách khỏi xác thực mật khẩu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sshd(8) — mục AUTHORIZED_KEYS FILE FORMAT</span><span class="lc-sub">man.openbsd.org/sshd#AUTHORIZED_KEYS_FILE_FORMAT — danh sách đầy đủ các ràng buộc đặt lên khoá, trong đó có <code>command=</code>, <code>from=</code> và <code>restrict</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ssh_config(5) — ControlMaster, ControlPath, ControlPersist</span><span class="lc-sub">man.openbsd.org/ssh_config — ba thiết lập nằm sau phép đo 26 lần, và các ký hiệu thay thế dùng được trong đường dẫn control path.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — người dùng, nhóm và các bit quyền</span><span class="lc-sub">/courses/linux-bash/learn${REF} — cơ chế nằm dưới lỗi quyền sở hữu, kể cả chuyện vì sao đọc thì được mà ghi thì không.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — The first deploy, done by hand|||0.3 — Lần deploy đầu tiên, làm bằng tay',
      slug: 'deploy-0-3-lan-dau-lam-tay',
      type: 'LESSON',
      description: 'Bốn bước chạy bằng tay trên một máy chủ thật, ba lần: một bản tốt, một bản chết hẳn, và một bản KHỞI ĐỘNG ĐƯỢC nhưng hỏng. Bản thứ ba qua được ba trong bốn phép kiểm — và đó là toàn bộ lý do bước 4 phải là một request HTTP thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The first deploy, done by hand</h2>
<p class="lead">Before automating anything, do it once by hand and watch each step. The script you write afterwards is only worth having if you already know what it is supposed to check — and the measurement below shows that the obvious checks are the ones that do not work.</p>

<h3>The four steps, as commands</h3>
${slide('dv-00', 28, 'Deploy bằng tay: bốn bước thành bốn lệnh')}
<pre><code><span class="tok-comment"># BUOC 1 — tao tac: chi lay thu DA COMMIT (bai 0.1)</span>
git archive --format=tar HEAD | gzip &gt; /tmp/ban-phat-hanh.tar.gz

<span class="tok-comment"># BUOC 2 — van chuyen</span>
scp /tmp/ban-phat-hanh.tar.gz vps:/srv/vps/phat-hanh/

<span class="tok-comment"># BUOC 3 — trao</span>
ssh vps 'cd /srv/vps/app &amp;&amp; tar xzf ../phat-hanh/ban-phat-hanh.tar.gz &amp;&amp; \\
         pkill -f "^node src/server.js"; sleep 0.3; \\
         setsid nohup node src/server.js &gt;/srv/vps/app.log 2&gt;&amp;1 &lt;/dev/null &amp;'

<span class="tok-comment"># BUOC 4 — kiem</span>
ssh vps 'curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/health'</code></pre>
<div class="pitfall"><strong>Trap — a remote command that leaves a stream open makes <code>ssh</code> hang forever.</strong> Writing the step-3 line without <code>&lt;/dev/null</code> is the classic version of this: the background process inherits SSH's stdin, SSH waits for the channel to close, and the deploy script sits there until something kills it. It looks like a slow server. It is a file descriptor. Redirect all three streams — <code>&gt;log 2&gt;&amp;1 &lt;/dev/null</code> — and use <code>setsid</code> so the process survives the session ending.</div>
<p><code>git archive</code> is worth knowing: it writes a tarball of exactly one commit, with no <code>.git</code> directory and no working-tree changes. It is the smallest honest answer to "which bytes are we shipping" — an artifact, in one command, with no build system involved.</p>

<h3>Deep dive: the pattern that makes <code>pkill</code> kill the deploy itself</h3>
${slide('dv-00', 29, 'pkill -f tự giết luôn cái shell đang deploy')}
<p>The step-3 line above anchors its pattern: <code>pkill -f "^node src/server.js"</code>. An earlier version of this lesson printed it without the <code>^</code>, and on the practice VPS that version fails in a way worth seeing. <code>-f</code> matches against the <em>whole command line</em> of every process. When you run <code>ssh vps '…'</code>, the server starts <code>bash -c '…'</code> — and that shell's command line contains the very text you are searching for:</p>
<pre><code class="language-bash">ssh vps 'echo "shell cua lenh nay: PID $$"; pgrep -af "node src/server.js"; echo "---"; pgrep -af "^node src/server.js"; true'</code></pre>
<div class="out">shell cua lenh nay: PID 1037
991 node src/server.js
1037 bash -c echo "shell cua lenh nay: PID $$"; pgrep -af "node src/server.js"; echo "---"; pgrep -af "^node src/server.js"; true
---
991 node src/server.js</div>
<p>Without the anchor, the search finds two processes: the old application (991) and the deploying shell itself (1037). <code>pkill</code> excludes only its own process, not its parent shell, so it kills both. The result, measured:</p>
<div class="out">== buoc 3 (ban cu, pkill -f "node src/server.js")
ssh ma thoat: 255
khong co tien trinh node nao
== buoc 3 (da sua, pkill -f "^node src/server.js")
ssh ma thoat: 0
196 node src/server.js
[khoi dong] nghe cong 3000</div>
<div class="pitfall co-tieu-de"><strong>Half a deploy, and a success-looking silence.</strong> With the unanchored pattern the archive was extracted and the old process killed — then the shell died before starting the new one. Nothing is running, and the only clue is <code>ssh</code> exiting with 255 (which a script without <code>set -e</code> ignores). Anchor the pattern with <code>^</code>, or better: write the PID to a file when starting and kill that PID, or let a service manager own the process (Chapter 3). The same trap catches <code>pgrep</code>-based "is it running?" checks, which then see the checking shell and report success.</div>
<div class="note-ct">One detail you may notice when experimenting: when the <em>last</em> command in <code>bash -c '…'</code> is a simple command, bash replaces itself with it instead of forking, so the self-match can disappear. That is why the demonstration above ends with <code>; true</code> — and why this bug comes and goes as you edit the line.</div>

<h3>Measured: how long ssh hangs without <code>&lt;/dev/null</code></h3>
${slide('dv-00', 30, 'Quên chuyển hướng /dev/null: ssh treo theo tiến trình nền')}
<p>The trap described above, measured on the practice VPS with a background <code>sleep 5</code> standing in for the application:</p>
<pre><code class="language-bash">time ssh vps 'setsid nohup sleep 5 &amp;'
time ssh vps 'setsid nohup sleep 5 &gt;/dev/null 2&gt;&amp;1 &lt;/dev/null &amp;'
time ssh vps true</code></pre>
<div class="out">khong chuyen huong: ssh tra ve sau 5.16 s
chuyen huong ca 3 dong: ssh tra ve sau .14 s
ssh vps true: .15 s</div>
<p>Without redirection <code>ssh</code> waited the full five seconds, because the background process still held the session's output streams. With all three redirected it returned in 0.14 s — the same as doing nothing. A real application never exits, so the unredirected deploy never returns. A subtler variant, also measured: <code>ssh vps 'cd ~/app &amp;&amp; setsid nohup node src/server.js &gt;~/app.log 2&gt;&amp;1 &lt;/dev/null &amp;'</code> was <em>still</em> hanging after 8 seconds, although node's streams are redirected. The <code>&amp;</code> applies to the whole <code>cd … &amp;&amp; setsid …</code> list, so bash forks a subshell for it; <code>ps</code> on the server showed that subshell (<code>bash -c cd ~/app &amp;&amp; setsid nohup node …</code>) alive as the parent of <code>node</code>, holding the session's streams. With the <code>cd</code> on its own — <code>cd ~/app; setsid nohup node … &amp;</code> — ssh returned in 0.18 s.</p>
<h3>Step 4, measured on three deploys</h3>
${slide('dv-00', 31, 'Ba bản deploy, bốn phép kiểm: chỉ một cái bắt đủ')}
<p>The same deploy script, with four levels of verification in it, run three times: once on a good build, once on a build whose entry file does not exist, and once on a build that starts perfectly and is nonetheless broken.</p>
<div class="out">════ A) trien khai mot ban TOT ════
  a) script thoat ra 0?          → 0
  b) tien trinh dang chay?       → 32689
  c) cong 3000 co ai nghe?       → CO
  d) tuyen THAT tra loi dung?    → 200
  ✅ DEPLOY THANH CONG

════ B) trien khai mot ban HONG (thieu tep) ════
  a) script thoat ra 0?          → 0
  b) tien trinh dang chay?       → KHONG CO
  c) cong 3000 co ai nghe?       → KHONG
  d) tuyen THAT tra loi dung?    → 000
  ❌ DEPLOY HONG

════ C) ban ung dung KHOI DONG DUOC nhung moi request tra 500 ════
  a) script thoat ra 0?          → 0
  b) tien trinh dang chay?       → 710
  c) cong 3000 co ai nghe?       → CO
  d) tuyen THAT tra loi dung?    → 500
  ❌ DEPLOY HONG</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Check (a) — exit code</span><span class="v">Returned <code>0</code> on all three, including the deploy that shipped nothing runnable. It proves the commands ran. It is the check almost every hand-rolled deploy stops at.</span></div>
  <div class="kv"><span class="k">Check (b) and (c) — process, port</span><span class="v">Caught case B. Both <em>passed</em> case C — there is a process, the port is bound, everything looks alive.</span></div>
  <div class="kv"><span class="k">Check (d) — a real request</span><span class="v">The only one that caught all three. It is also the only one that costs a round trip.</span></div>
</div>
<p>Case C is the one worth staring at. The application started, bound its port and holds a healthy-looking PID. Three of the four checks say the deploy succeeded. What it actually returns is this:</p>
<div class="out">$ curl http://127.0.0.1:3000/health
     Loi cau hinh: thieu DATABASE_URL</div>
<div class="callout warn"><strong>A missing environment variable is the most common shape of case C.</strong> The code is fine, the artifact is fine, the transport worked, the swap worked. One value that lives on the server rather than in the repository was not set, and every request fails — while the process list, the port table and the exit code all report health. Chapter 4 is entirely about where that value should live so this cannot happen.</div>

<h3>What a health endpoint should and should not do</h3>
${slide('dv-00', 32, 'Health: “còn sống” khác “sẵn sàng nhận khách”')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">It must exercise the thing that breaks</span><span class="lz-d">A <code>/health</code> that returns a hardcoded <code>200</code> passes case C. If your application needs a database, the health check should touch the database — otherwise it is checking that Node can serve a string.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">It must not be expensive</span><span class="lz-d">A load balancer polls it every second forever. A <code>SELECT 1</code> is right; counting rows in a large table is a self-inflicted outage waiting for traffic.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Separate "alive" from "ready"</span><span class="lz-d">Two endpoints. <em>Alive</em> means the process is not wedged — restart me if this fails. <em>Ready</em> means it can serve traffic — send me requests only if this passes. During the three-second startup measured in Lesson 0.1, an application is alive but not ready, and conflating them is what makes a restart loop.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">It must not require authentication</span><span class="lz-d">Or the check cannot run. Keep it free of anything sensitive: no version numbers, no dependency names, no connection strings in the error text. The 500 above is fine for a private port and too talkative for a public one.</span></div>
</div>

<h3>Now count what the hand deploy did not do</h3>
<p>The four commands work. Run them a few times and the gaps appear, and each one is a chapter of this course:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">There is no way back</span><span class="lz-lnote"><code>tar xzf</code> overwrote the old version in place. When check (d) says 500, there is nothing to return to — the previous release no longer exists on the machine. Chapter 6.</span></div>
  <div class="lz-layer"><span class="lz-lname">The outage is as long as the startup</span><span class="lz-lnote">The old process is killed before the new one is known to work. Lesson 0.1 measured 3,070 ms for a realistic application. Chapter 3.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nothing stops a half-failed deploy</span><span class="lz-lnote">If <code>tar</code> fails, the <code>pkill</code> still runs. A shell script without <code>set -euo pipefail</code> marches straight past errors into the next destructive step. Chapter 7.</span></div>
  <div class="lz-layer"><span class="lz-lname">The database is not in the picture</span><span class="lz-lnote">Code changed; the schema did not. The ordering of those two is where the worst deploy outages come from, including one in this repository. Chapter 5.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nothing survives a reboot</span><span class="lz-lnote"><code>nohup</code> keeps the process alive when the session ends, not when the machine restarts. Chapter 3 replaces it with a service manager.</span></div>
</div>
<div class="callout ok"><strong>The hand deploy is still worth doing first.</strong> Every line of the deploy script you eventually write exists to close one of these gaps, and reading it will make sense only if you have felt the gap. It is also the fallback when the automation itself is what broke.</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the night before the defence, the group's API "deployed fine" but returns 500. Rebuild that evening on the practice VPS: a good deploy, a broken one, and the check that tells them apart.</p><ol>
<li>Give the practice VPS what the app needs, as root: <code>docker exec lab-vps bash -c 'apt-get update -qq &amp;&amp; apt-get install -y -qq nodejs curl'</code>. Put a small <code>src/server.js</code> in your <code>~/dv-lab</code> project whose <code>/health</code> returns 500 with <code>Loi cau hinh: thieu DATABASE_URL</code> when that variable is missing, and 200 otherwise; commit it.</li>
<li>Run the four steps with <code>ssh -F ~/dv-lab/ssh.cfg vps</code>, starting the app with <code>DATABASE_URL=postgres://thu setsid nohup node src/server.js &gt;~/app.log 2&gt;&amp;1 &lt;/dev/null &amp;</code>. Step 4 must print <code>200</code>.</li>
<li>Deploy again without <code>DATABASE_URL</code>. Run all four checks from the lesson: exit code, <code>pgrep -af "^node"</code>, <code>ss -tlnp | grep :3000</code>, <code>curl</code>. Which ones lie?</li>
<li>Deploy once with the <em>unanchored</em> <code>pkill -f "node src/server.js"</code> and print <code>echo $?</code> right after the <code>ssh</code>. Then look for a node process.</li>
<li>Fix everything and finish on a <code>200</code>.</li></ol>
<pre><code class="language-bash">ssh -F ~/dv-lab/ssh.cfg vps 'curl -s -o /dev/null -w "%{http_code}\\n" http://127.0.0.1:3000/health; curl -s http://127.0.0.1:3000/'</code></pre>
<div class="out">200
&lt;h1&gt;Dat lich phong kham — ban 1&lt;/h1&gt;</div>
<p><strong>Done when:</strong> you have seen <code>200</code> for the good deploy, <code>500</code> for the one without <code>DATABASE_URL</code> while <code>pgrep</code> and <code>ss</code> both said "running", <code>255</code> from ssh with the unanchored <code>pkill</code> and no node process afterwards — and you finished on <code>200</code> again.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>git archive</code></span><span class="v">Writes a tarball of exactly one commit — no <code>.git</code>, no uncommitted edits.</span></div>
  <div class="kv"><span class="k"><code>setsid</code> / <code>nohup</code></span><span class="v">Start a process in its own session so it survives the SSH session ending.</span></div>
  <div class="kv"><span class="k">File descriptor / stream</span><span class="v">stdin, stdout, stderr; a background process that keeps them open keeps <code>ssh</code> waiting.</span></div>
  <div class="kv"><span class="k"><code>pkill -f</code> / <code>pgrep -f</code></span><span class="v">Find processes by matching the whole command line — including, unless anchored, the shell running the command.</span></div>
  <div class="kv"><span class="k">Health endpoint</span><span class="v">A route that reports whether the application can do its job.</span></div>
  <div class="kv"><span class="k">Liveness vs readiness</span><span class="v">"Not stuck, do not restart me" versus "able to serve, send me traffic".</span></div>
  <div class="kv"><span class="k">Exit code 255 (ssh)</span><span class="v">ssh itself failed or the remote side died — not a code your command returned.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A hand deploy is four commands: <code>git archive</code>, <code>scp</code>, extract-and-restart over ssh, <code>curl</code>.</li>
<li>Redirect all three streams and use <code>setsid</code>, or <code>ssh</code> waits for your background process forever.</li>
<li><code>pkill -f</code> inside <code>ssh '…'</code> can match and kill the deploying shell; anchor with <code>^</code> or use a PID file.</li>
<li>Exit code, process and port checks all passed a deploy that answered 500 to everything; only a real request caught it.</li>
<li>A health endpoint must touch what breaks, stay cheap, need no login, and separate "alive" from "ready".</li>
<li>The hand deploy has no rollback, no zero-downtime swap, no protection from half-failure and no reboot survival — the next chapters close each gap.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-archive(1)</span><span class="lc-sub">git-scm.com/docs/git-archive — producing a tarball of exactly one commit, which is the simplest possible artifact.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kubernetes — liveness, readiness and startup probes</span><span class="lc-sub">kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes — the clearest write-up of the alive/ready distinction, and it applies just as well to a single VPS.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">curl — the -w write-out variables</span><span class="lc-sub">everything.curl.dev/usingcurl/verbose/writeout — <code>%{http_code}</code> and friends, which is what turns curl into a deploy gate rather than a debugging tool.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — diagnosing a 502 that is not the backend</span><span class="lc-sub">/courses/nginx/learn${REF} — when a deploy looks healthy from the server but not from the proxy in front of it.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Lần deploy đầu tiên, làm bằng tay</h2>
<p class="lead">Trước khi tự động hoá bất cứ thứ gì, hãy làm nó một lần bằng tay và nhìn từng bước. Cái script bạn viết sau đó chỉ đáng có nếu bạn đã biết trước nó PHẢI kiểm cái gì — và phép đo dưới đây cho thấy chính những phép kiểm hiển nhiên nhất mới là những cái không hoạt động.</p>

<h3>Bốn bước, viết thành lệnh</h3>
${slide('dv-00', 28, 'Deploy bằng tay: bốn bước thành bốn lệnh')}
<pre><code><span class="tok-comment"># BUOC 1 — tao tac: chi lay thu DA COMMIT (bai 0.1)</span>
git archive --format=tar HEAD | gzip &gt; /tmp/ban-phat-hanh.tar.gz

<span class="tok-comment"># BUOC 2 — van chuyen</span>
scp /tmp/ban-phat-hanh.tar.gz vps:/srv/vps/phat-hanh/

<span class="tok-comment"># BUOC 3 — trao</span>
ssh vps 'cd /srv/vps/app &amp;&amp; tar xzf ../phat-hanh/ban-phat-hanh.tar.gz &amp;&amp; \\
         pkill -f "^node src/server.js"; sleep 0.3; \\
         setsid nohup node src/server.js &gt;/srv/vps/app.log 2&gt;&amp;1 &lt;/dev/null &amp;'

<span class="tok-comment"># BUOC 4 — kiem</span>
ssh vps 'curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/health'</code></pre>
<div class="pitfall"><strong>Bẫy — một lệnh chạy từ xa mà để hở một luồng thì làm <code>ssh</code> TREO mãi mãi.</strong> Viết dòng bước 3 mà thiếu <code>&lt;/dev/null</code> chính là phiên bản kinh điển của lỗi này: tiến trình nền thừa hưởng stdin của SSH, SSH ngồi chờ kênh đóng lại, và script deploy nằm im ở đó cho tới khi có thứ gì giết nó. Nó TRÔNG như một máy chủ chậm. Thật ra nó là một cái file descriptor. Hãy chuyển hướng cả ba luồng — <code>&gt;log 2&gt;&amp;1 &lt;/dev/null</code> — và dùng <code>setsid</code> để tiến trình sống sót khi phiên kết thúc.</div>
<p><code>git archive</code> đáng để biết: nó viết ra một tệp nén của ĐÚNG một commit, không kèm thư mục <code>.git</code> và không kèm thay đổi trong cây làm việc. Nó là câu trả lời trung thực nhỏ gọn nhất cho câu "chúng ta đang gửi những byte nào" — một tạo tác, trong một lệnh, không dính tới hệ thống build nào.</p>

<h3>Đào sâu: cái mẫu làm <code>pkill</code> giết luôn chính lần deploy</h3>
${slide('dv-00', 29, 'pkill -f tự giết luôn cái shell đang deploy')}
<p>Dòng bước 3 ở trên có neo mẫu: <code>pkill -f "^node src/server.js"</code>. Một phiên bản trước của bài này in nó KHÔNG có dấu <code>^</code>, và trên VPS thí nghiệm bản đó hỏng theo một kiểu rất đáng xem. <code>-f</code> so với <em>TOÀN BỘ dòng lệnh</em> của mọi tiến trình. Khi bạn chạy <code>ssh vps '…'</code>, máy chủ khởi động <code>bash -c '…'</code> — và dòng lệnh của chính cái shell đó chứa đúng chuỗi bạn đang tìm:</p>
<pre><code class="language-bash">ssh vps 'echo "shell cua lenh nay: PID $$"; pgrep -af "node src/server.js"; echo "---"; pgrep -af "^node src/server.js"; true'</code></pre>
<div class="out">shell cua lenh nay: PID 1037
991 node src/server.js
1037 bash -c echo "shell cua lenh nay: PID $$"; pgrep -af "node src/server.js"; echo "---"; pgrep -af "^node src/server.js"; true
---
991 node src/server.js</div>
<p>Không có neo, phép tìm ra HAI tiến trình: ứng dụng cũ (991) và chính cái shell đang deploy (1037). <code>pkill</code> chỉ chừa tiến trình của chính nó, không chừa shell cha, nên nó giết cả hai. Kết quả, đo thật:</p>
<div class="out">== buoc 3 (ban cu, pkill -f "node src/server.js")
ssh ma thoat: 255
khong co tien trinh node nao
== buoc 3 (da sua, pkill -f "^node src/server.js")
ssh ma thoat: 0
196 node src/server.js
[khoi dong] nghe cong 3000</div>
<div class="pitfall co-tieu-de"><strong>Deploy được một nửa, và một sự im lặng trông như thành công.</strong> Với mẫu không neo, tệp nén đã được giải ra và tiến trình cũ đã bị giết — rồi cái shell chết trước khi kịp khởi động bản mới. Chẳng có gì đang chạy, và manh mối duy nhất là <code>ssh</code> thoát với mã 255 (mà một script không có <code>set -e</code> sẽ lờ đi). Neo mẫu bằng <code>^</code>, hoặc tốt hơn: ghi PID ra tệp lúc khởi động rồi giết đúng PID đó, hoặc để một trình quản lý dịch vụ giữ tiến trình (Chương 3). Cùng cái bẫy này bắt luôn những phép kiểm "nó còn chạy không?" dựa trên <code>pgrep</code>: chúng thấy chính cái shell đang kiểm và báo thành công.</div>
<div class="note-ct">Một chi tiết bạn có thể gặp khi thử: khi lệnh <em>CUỐI CÙNG</em> trong <code>bash -c '…'</code> là một lệnh đơn, bash thay chính nó bằng lệnh đó thay vì tách tiến trình, nên chuyện tự khớp có thể biến mất. Đó là lý do phép minh hoạ ở trên kết thúc bằng <code>; true</code> — và là lý do lỗi này lúc có lúc không khi bạn sửa dòng lệnh.</div>

<h3>Đo thật: ssh treo bao lâu khi thiếu <code>&lt;/dev/null</code></h3>
${slide('dv-00', 30, 'Quên chuyển hướng /dev/null: ssh treo theo tiến trình nền')}
<p>Cái bẫy mô tả ở trên, đo trên VPS thí nghiệm, với một <code>sleep 5</code> chạy nền đóng vai ứng dụng:</p>
<pre><code class="language-bash">time ssh vps 'setsid nohup sleep 5 &amp;'
time ssh vps 'setsid nohup sleep 5 &gt;/dev/null 2&gt;&amp;1 &lt;/dev/null &amp;'
time ssh vps true</code></pre>
<div class="out">khong chuyen huong: ssh tra ve sau 5.16 s
chuyen huong ca 3 dong: ssh tra ve sau .14 s
ssh vps true: .15 s</div>
<p>Không chuyển hướng thì <code>ssh</code> chờ trọn năm giây, vì tiến trình nền vẫn giữ các luồng output của phiên. Chuyển hướng cả ba thì nó trả về sau 0,14 giây — bằng với việc không làm gì. Một ứng dụng thật không bao giờ tự thoát, nên lần deploy không chuyển hướng không bao giờ trả về. Một biến thể khó thấy hơn, cũng đo thật: <code>ssh vps 'cd ~/app &amp;&amp; setsid nohup node src/server.js &gt;~/app.log 2&gt;&amp;1 &lt;/dev/null &amp;'</code> sau 8 giây <em>VẪN</em> treo, dù các luồng của node đã được chuyển hướng. Dấu <code>&amp;</code> áp lên CẢ chuỗi <code>cd … &amp;&amp; setsid …</code>, nên bash tách một subshell cho chuỗi đó; <code>ps</code> trên máy chủ cho thấy subshell ấy (<code>bash -c cd ~/app &amp;&amp; setsid nohup node …</code>) vẫn sống, làm cha của <code>node</code>, và giữ các luồng của phiên. Tách <code>cd</code> ra riêng — <code>cd ~/app; setsid nohup node … &amp;</code> — thì ssh trả về sau 0,18 giây.</p>
<h3>Bước 4, đo trên ba lần deploy</h3>
${slide('dv-00', 31, 'Ba bản deploy, bốn phép kiểm: chỉ một cái bắt đủ')}
<p>Cùng một script deploy, bên trong có bốn mức kiểm, chạy ba lần: một lần trên bản dựng tốt, một lần trên bản dựng mà tệp khởi động không tồn tại, và một lần trên bản dựng KHỞI ĐỘNG hoàn hảo mà vẫn hỏng.</p>
<div class="out">════ A) trien khai mot ban TOT ════
  a) script thoat ra 0?          → 0
  b) tien trinh dang chay?       → 32689
  c) cong 3000 co ai nghe?       → CO
  d) tuyen THAT tra loi dung?    → 200
  ✅ DEPLOY THANH CONG

════ B) trien khai mot ban HONG (thieu tep) ════
  a) script thoat ra 0?          → 0
  b) tien trinh dang chay?       → KHONG CO
  c) cong 3000 co ai nghe?       → KHONG
  d) tuyen THAT tra loi dung?    → 000
  ❌ DEPLOY HONG

════ C) ban ung dung KHOI DONG DUOC nhung moi request tra 500 ════
  a) script thoat ra 0?          → 0
  b) tien trinh dang chay?       → 710
  c) cong 3000 co ai nghe?       → CO
  d) tuyen THAT tra loi dung?    → 500
  ❌ DEPLOY HONG</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Kiểm (a) — mã thoát</span><span class="v">Trả về <code>0</code> ở cả BA lần, kể cả lần deploy chẳng gửi được thứ gì chạy được. Nó chứng minh các lệnh đã chạy. Và nó là phép kiểm mà gần như mọi script deploy tự chế dừng lại ở đó.</span></div>
  <div class="kv"><span class="k">Kiểm (b) và (c) — tiến trình, cổng</span><span class="v">Bắt được ca B. Cả hai đều <em>QUA</em> ở ca C — có tiến trình, cổng đã gắn, mọi thứ trông như đang sống.</span></div>
  <div class="kv"><span class="k">Kiểm (d) — một request THẬT</span><span class="v">Cái duy nhất bắt được cả ba. Nó cũng là cái duy nhất tốn một vòng đi-về.</span></div>
</div>
<p>Ca C mới là cái đáng nhìn chằm chằm. Ứng dụng đã khởi động, đã gắn cổng và đang giữ một PID trông rất khoẻ mạnh. Ba trong bốn phép kiểm nói rằng lần deploy thành công. Còn thứ nó thật sự trả về là thế này:</p>
<div class="out">$ curl http://127.0.0.1:3000/health
     Loi cau hinh: thieu DATABASE_URL</div>
<div class="callout warn"><strong>Một biến môi trường bị thiếu là hình dạng phổ biến nhất của ca C.</strong> Mã thì ổn, tạo tác thì ổn, vận chuyển chạy tốt, tráo cũng chạy tốt. Một giá trị vốn sống trên MÁY CHỦ chứ không sống trong kho mã đã không được đặt, và mọi request đều hỏng — trong khi danh sách tiến trình, bảng cổng và mã thoát đều báo khoẻ mạnh. Chương 4 dành trọn cho chuyện cái giá trị đó nên sống ở đâu để điều này không thể xảy ra.</div>

<h3>Một endpoint health nên và KHÔNG nên làm gì</h3>
${slide('dv-00', 32, 'Health: “còn sống” khác “sẵn sàng nhận khách”')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó phải ĐỘNG tới đúng cái thứ hay hỏng</span><span class="lz-d">Một <code>/health</code> trả về <code>200</code> cứng thì QUA được ca C. Nếu ứng dụng của bạn cần cơ sở dữ liệu, phép kiểm sức khoẻ nên chạm vào cơ sở dữ liệu — không thì nó chỉ đang kiểm rằng Node phục vụ được một chuỗi ký tự.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó không được đắt</span><span class="lz-d">Một bộ cân bằng tải hỏi nó mỗi giây, mãi mãi. Một câu <code>SELECT 1</code> là đúng; đếm số dòng trong một bảng lớn là một sự cố tự gây ra đang nằm chờ lưu lượng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tách "còn sống" khỏi "sẵn sàng"</span><span class="lz-d">Hai endpoint. <em>Còn sống</em> nghĩa là tiến trình chưa kẹt cứng — hỏng cái này thì hãy khởi động lại tôi. <em>Sẵn sàng</em> nghĩa là nó phục vụ được lưu lượng — chỉ gửi request cho tôi khi cái này qua. Trong ba giây khởi động đo ở Bài 0.1, một ứng dụng đang CÒN SỐNG mà CHƯA SẴN SÀNG, và trộn hai thứ đó vào nhau chính là thứ tạo ra một vòng lặp khởi động lại.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nó không được đòi đăng nhập</span><span class="lz-d">Không thì phép kiểm chạy không nổi. Hãy giữ nó sạch mọi thứ nhạy cảm: không số phiên bản, không tên thư viện, không chuỗi kết nối trong chữ báo lỗi. Cú 500 ở trên thì ổn cho một cổng nội bộ và quá nhiều lời cho một cổng công khai.</span></div>
</div>

<h3>Giờ hãy đếm những gì lần deploy bằng tay KHÔNG làm</h3>
<p>Bốn lệnh đó chạy được. Chạy vài lần thì mấy lỗ hổng hiện ra, và mỗi cái là một chương của khoá này:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Không có đường lùi</span><span class="lz-lnote"><code>tar xzf</code> ghi đè bản cũ ngay tại chỗ. Khi phép kiểm (d) báo 500 thì chẳng còn gì để quay về — bản phát hành trước đó không còn tồn tại trên máy nữa. Chương 6.</span></div>
  <div class="lz-layer"><span class="lz-lname">Gián đoạn dài đúng bằng thời gian khởi động</span><span class="lz-lnote">Tiến trình cũ bị giết TRƯỚC KHI biết cái mới có chạy được không. Bài 0.1 đo được 3.070 ms với một ứng dụng thực tế. Chương 3.</span></div>
  <div class="lz-layer"><span class="lz-lname">Không có gì chặn một lần deploy hỏng NỬA CHỪNG</span><span class="lz-lnote">Nếu <code>tar</code> hỏng thì lệnh <code>pkill</code> vẫn cứ chạy. Một script shell thiếu <code>set -euo pipefail</code> sẽ đi thẳng qua lỗi để bước vào bước phá huỷ kế tiếp. Chương 7.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cơ sở dữ liệu không có mặt trong bức tranh</span><span class="lz-lnote">Mã đổi; lược đồ thì không. Thứ tự giữa hai thứ đó chính là nơi sinh ra những sự cố deploy tệ nhất, trong đó có một sự cố của chính kho mã này. Chương 5.</span></div>
  <div class="lz-layer"><span class="lz-lname">Không thứ gì sống sót qua một lần khởi động lại máy</span><span class="lz-lnote"><code>nohup</code> giữ tiến trình sống khi PHIÊN kết thúc, chứ không phải khi MÁY khởi động lại. Chương 3 thay nó bằng một trình quản lý dịch vụ.</span></div>
</div>
<div class="callout ok"><strong>Lần deploy bằng tay vẫn đáng làm trước tiên.</strong> Mọi dòng trong cái script deploy mà rốt cuộc bạn sẽ viết đều tồn tại để bịt một trong những lỗ hổng này, và đọc nó chỉ có nghĩa nếu bạn đã CẢM được cái lỗ hổng ấy. Nó cũng là đường lùi cho đúng cái tình huống mà chính phần tự động hoá mới là thứ bị hỏng.</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối trước hôm bảo vệ, API của nhóm "deploy ngon lành" mà lại trả 500. Dựng lại buổi tối đó trên VPS thí nghiệm: một lần deploy tốt, một lần hỏng, và phép kiểm phân biệt được hai lần.</p><ol>
<li>Cho VPS thí nghiệm thứ ứng dụng cần, dưới quyền root: <code>docker exec lab-vps bash -c 'apt-get update -qq &amp;&amp; apt-get install -y -qq nodejs curl'</code>. Đặt vào dự án <code>~/dv-lab</code> một <code>src/server.js</code> nhỏ có <code>/health</code> trả 500 kèm <code>Loi cau hinh: thieu DATABASE_URL</code> khi thiếu biến đó, còn không thì 200; commit lại.</li>
<li>Chạy bốn bước với <code>ssh -F ~/dv-lab/ssh.cfg vps</code>, khởi động app bằng <code>DATABASE_URL=postgres://thu setsid nohup node src/server.js &gt;~/app.log 2&gt;&amp;1 &lt;/dev/null &amp;</code>. Bước 4 phải in <code>200</code>.</li>
<li>Deploy lại mà KHÔNG có <code>DATABASE_URL</code>. Chạy cả bốn phép kiểm trong bài: mã thoát, <code>pgrep -af "^node"</code>, <code>ss -tlnp | grep :3000</code>, <code>curl</code>. Phép nào nói dối?</li>
<li>Deploy một lần với <code>pkill -f "node src/server.js"</code> <em>KHÔNG neo</em> và in <code>echo $?</code> ngay sau lệnh <code>ssh</code>. Rồi đi tìm tiến trình node.</li>
<li>Sửa hết và kết thúc bằng một cái <code>200</code>.</li></ol>
<pre><code class="language-bash">ssh -F ~/dv-lab/ssh.cfg vps 'curl -s -o /dev/null -w "%{http_code}\\n" http://127.0.0.1:3000/health; curl -s http://127.0.0.1:3000/'</code></pre>
<div class="out">200
&lt;h1&gt;Dat lich phong kham — ban 1&lt;/h1&gt;</div>
<p><strong>Đạt khi:</strong> bạn đã thấy <code>200</code> ở lần deploy tốt, <code>500</code> ở lần thiếu <code>DATABASE_URL</code> trong lúc cả <code>pgrep</code> lẫn <code>ss</code> đều nói "đang chạy", <code>255</code> từ ssh với <code>pkill</code> không neo và không còn tiến trình node nào sau đó — rồi kết thúc lại bằng <code>200</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>git archive</code> (đóng gói một commit)</span><span class="v">Ghi ra một tệp nén của đúng một commit — không <code>.git</code>, không có chỗ sửa chưa commit.</span></div>
  <div class="kv"><span class="k"><code>setsid</code> / <code>nohup</code> (tách phiên / bỏ qua tín hiệu treo)</span><span class="v">Khởi động tiến trình trong phiên riêng để nó sống sót khi phiên SSH kết thúc.</span></div>
  <div class="kv"><span class="k">File descriptor / stream (luồng vào–ra)</span><span class="v">stdin, stdout, stderr; tiến trình nền còn giữ chúng thì <code>ssh</code> còn chờ.</span></div>
  <div class="kv"><span class="k"><code>pkill -f</code> / <code>pgrep -f</code> (tìm theo dòng lệnh)</span><span class="v">Tìm tiến trình bằng cách khớp cả dòng lệnh — kể cả, nếu không neo, cái shell đang chạy lệnh.</span></div>
  <div class="kv"><span class="k">Health endpoint (tuyến kiểm sức khoẻ)</span><span class="v">Một tuyến báo ứng dụng có làm được việc của nó hay không.</span></div>
  <div class="kv"><span class="k">Liveness vs readiness (còn sống / sẵn sàng)</span><span class="v">"Không bị kẹt, đừng restart tôi" so với "phục vụ được rồi, gửi request cho tôi".</span></div>
  <div class="kv"><span class="k">Exit code 255 (mã thoát 255 của ssh)</span><span class="v">Chính ssh hỏng hoặc phía bên kia chết — không phải mã do lệnh của bạn trả về.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Deploy tay là bốn lệnh: <code>git archive</code>, <code>scp</code>, giải nén-và-khởi-động-lại qua ssh, <code>curl</code>.</li>
<li>Chuyển hướng cả ba luồng và dùng <code>setsid</code>, không thì <code>ssh</code> chờ tiến trình nền mãi mãi.</li>
<li><code>pkill -f</code> bên trong <code>ssh '…'</code> có thể khớp và giết chính shell đang deploy; neo bằng <code>^</code> hoặc dùng tệp PID.</li>
<li>Mã thoát, tiến trình và cổng đều "qua" ở một lần deploy trả 500 cho mọi thứ; chỉ một request thật bắt được nó.</li>
<li>Endpoint health phải chạm vào thứ hay hỏng, rẻ, không cần đăng nhập, và tách "còn sống" khỏi "sẵn sàng".</li>
<li>Deploy tay không có đường lùi, không tráo mà không gián đoạn, không chống hỏng nửa chừng và không sống qua reboot — các chương sau bịt từng lỗ.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-archive(1)</span><span class="lc-sub">git-scm.com/docs/git-archive — tạo một tệp nén của đúng một commit, tức là cái tạo tác đơn giản nhất có thể có.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kubernetes — liveness, readiness và startup probe</span><span class="lc-sub">kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes — bài viết rõ nhất về phân biệt còn-sống/sẵn-sàng, và nó áp dụng y hệt cho một con VPS đơn lẻ.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">curl — các biến của -w (write-out)</span><span class="lc-sub">everything.curl.dev/usingcurl/verbose/writeout — <code>%{http_code}</code> và các anh em, thứ biến curl từ một công cụ gỡ lỗi thành một cái CỔNG cho deploy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — chẩn đoán cú 502 không phải lỗi của backend</span><span class="lc-sub">/courses/nginx/learn${REF} — khi một lần deploy trông khoẻ mạnh từ phía máy chủ mà không khoẻ từ phía proxy đứng trước nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — What you have not solved yet|||0.4 — Những gì bạn CHƯA giải quyết',
      slug: 'deploy-0-4-chua-giai-quyet',
      type: 'LESSON',
      description: 'Bản đồ của cả khoá, neo vào một phép đo: cùng một cú lùi bản, làm theo hai cách, trên hai cỡ dự án. Một cách mất 5 mili giây bất kể dự án to cỡ nào; cách kia mất 590 mili giây và còn tăng tiếp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>What you have not solved yet</h2>
<p class="lead">The four commands in Lesson 0.3 are a working deploy. They are also a deploy with no way back, an outage as long as your startup time, no protection against half-failing, and nothing that survives a reboot. This lesson measures the first of those, because the measurement explains the shape of everything that follows.</p>

<h3>One decision changes the cost of every rollback</h3>
${slide('dv-00', 33, 'Lùi bản: đổi symlink 4,8 ms, giải nén lại 590 ms')}
<p>The hand deploy extracted the new version <em>over</em> the old one. There is an alternative: give every release its own directory and point a symlink at the live one. Rolling back is then moving the symlink. Both approaches measured, on two project sizes:</p>
<div class="out">═══ du an nho: 42 tep, 176 KB ═══
  doi symlink:      6.330 micro giay  (6,3 ms)
  giai nen lai:    13.372 micro giay  (13,4 ms)

═══ du an that: 12.000 tep, 48 MB (nen con 11 MB) ═══
  doi symlink:      4.796 micro giay  (4,8 ms)
  giai nen lai:       590 mili giay</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The symlink swap does not grow</span><span class="v">6.3 ms on a 176 KB project, 4.8 ms on a 48 MB one — the difference is noise. Moving a symlink is one filesystem operation whatever it points at.</span></div>
  <div class="kv"><span class="k">Extraction grows with the project</span><span class="v">13 ms became 590 ms: forty-five times slower, because there were 12,000 files to write instead of 42. A real application with <code>node_modules</code> is larger still.</span></div>
  <div class="kv"><span class="k">123× at a realistic size</span><span class="v">And the gap keeps widening. The interesting part is that one number is a constant and the other is a function of your codebase.</span></div>
  <div class="kv"><span class="k">The speed is not even the main point</span><span class="v">See below — the structural difference matters more than the milliseconds.</span></div>
</div>
<div class="callout ok"><strong>The releases layout, in three lines.</strong> Every release lands in its own directory; a symlink names the current one; rolling back moves the symlink. Nothing is ever overwritten, so the previous version is still sitting on disk, complete, when you need it at two in the morning.</div>
<pre><code>/srv/app/
├── phat-hanh/
│   ├── 2026-08-23-1930-a3f1c9/     <span class="tok-comment"># moi ban phat hanh mot thu muc</span>
│   ├── 2026-08-23-2114-b8e402/
│   └── 2026-08-24-0902-c1d773/
├── hien-tai -> phat-hanh/2026-08-24-0902-c1d773
└── chung/                          <span class="tok-comment"># thu KHONG thuoc ban phat hanh nao</span>
    ├── .env                        <span class="tok-comment">#   → Chuong 4</span>
    ├── tai-len/
    └── log/</code></pre>
<div class="pitfall"><strong>Trap — <code>ln -sfn</code> alone is not guaranteed to be atomic.</strong> In some implementations of <code>ln</code> — BusyBox, the one inside Alpine-based images, measured below — replacing an existing symlink is internally an unlink followed by a create, and for a moment the path does not exist. (GNU <code>ln</code> on Ubuntu already uses a temporary name and a rename; you cannot count on which one a given machine has.) A request arriving in that window sees nothing. The atomic form creates the new link under a temporary name and renames it over the old one — <code>ln -sfn &lt;dich&gt; hien-tai.moi &amp;&amp; mv -T hien-tai.moi hien-tai</code> — because <code>rename(2)</code> is atomic and <code>mv -T</code> uses it. That is the form measured above, and the two extra words are the difference between a rollback and a brief outage during a rollback.</div>
<p>The structural difference matters more than the timing. Rolling back by re-extracting needs the old artifact to still exist somewhere — the tarball, the git tag, the registry image, the network to fetch it. Rolling back by symlink needs nothing but a directory that is already on the disk. The moment you most need to roll back is often the moment something else is also broken, and a rollback that depends on the network is a rollback you may not get.</p>

<h3>Deep dive: is <code>ln -sfn</code> atomic? Ask strace</h3>
${slide('dv-00', 34, 'ln -sfn có nguyên tử không? Tuỳ bản ln')}
<p>"Atomic" means another process can never see a half-finished state: at every instant, <code>hien-tai</code> either points to the old release or to the new one, never to nothing. The way to find out what a command really does is to watch its system calls. On the practice VPS (GNU coreutils 9.4), and in an Alpine container (BusyBox 1.36.1), replacing an existing link:</p>
<pre><code class="language-bash">strace -e trace=symlink,symlinkat,unlink,unlinkat,rename,renameat,renameat2 ln -sfn phat-hanh/b2 hien-tai</code></pre>
<div class="out"># GNU coreutils 9.4 (Ubuntu 24.04) — 8.32 on Ubuntu 22.04 printed the same pattern
symlinkat("phat-hanh/b2", AT_FDCWD, "hien-tai") = -1 EEXIST (File exists)
symlinkat("phat-hanh/b2", AT_FDCWD, "Cu1B21aY") = 0
renameat(AT_FDCWD, "Cu1B21aY", AT_FDCWD, "hien-tai") = 0

# BusyBox v1.36.1 (alpine:3.20)
unlinkat(AT_FDCWD, "cur", 0)            = 0
symlinkat("b", AT_FDCWD, "cur")         = 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">GNU <code>ln</code></span><span class="v">Tries to create the link, gets <code>EEXIST</code>, creates it under a random temporary name, then <code>renameat</code>s it over the old one. That is the safe pattern, done for you.</span></div>
  <div class="kv"><span class="k">BusyBox <code>ln</code></span><span class="v"><code>unlinkat</code> first, <code>symlinkat</code> second: between the two calls <code>cur</code> does not exist, and a request arriving then gets "No such file or directory".</span></div>
  <div class="kv"><span class="k">What to write</span><span class="v"><code>ln -sfn &lt;dich&gt; hien-tai.moi &amp;&amp; mv -T hien-tai.moi hien-tai</code> behaves the same on every system that has <code>mv -T</code>, because you perform the rename yourself. On macOS, BSD <code>mv</code> has no <code>-T</code>; use <code>mv -h</code> there, or run the deploy step on Linux.</span></div>
</div>
<p>Measured on the practice VPS with two releases made by <code>git archive</code> of two commits, the rollback itself:</p>
<div class="out">dang chay: phat-hanh/a13a968
lui ban xong: phat-hanh/f04662d — mat 2486 micro giay</div>
<h3>The rest of the course, and what each chapter closes</h3>
${slide('dv-00', 35, 'Năm lỗ hổng của deploy tay → năm chương')}
${slide('dv-00', 9, 'Lộ trình 16 phần, bốn cung')}
<p>Since September 2026 the course has sixteen parts: the twelve described below, plus Chapters 12–15, which are added at the end of the same list.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1–2</span><span class="lz-t">The artifact, and getting it there</span><span class="lz-d">What exactly ships, and the three transports compared properly — rsync, git, and a container registry — including what changes when the artifact has to be <em>built</em> rather than copied, and where that build should happen.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The swap, without the outage</span><span class="lz-d">The releases layout above, a service manager instead of <code>nohup</code>, and starting the new version <em>before</em> stopping the old one — which is what makes the 3,070 ms measured in Lesson 0.1 go to zero.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Configuration and secrets</span><span class="lz-d">Where the missing <code>DATABASE_URL</code> from Lesson 0.3 should live so that a deploy cannot lose it, why build-time and run-time values are different things, and what makes a secret in a git history unrecoverable.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">The database</span><span class="lz-d">The chapter with the worst outages in it. Schema changes and code changes deploy at different moments, and the window between them is where a site breaks. Includes the failed-migration state this repository has actually been in.</span></div>
  <div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Rollback, and what cannot be rolled back</span><span class="lz-d">The symlink is the easy half. Data written by the bad version, a migration that dropped a column, an email already sent — none of those come back. Knowing which changes are one-way is what makes a deploy safe to attempt.</span></div>
  <div class="lz-step"><span class="lz-k">7</span><span class="lz-t">The deploy script itself</span><span class="lz-d">Failing loudly instead of continuing, running twice without harm, refusing to run against a dirty tree, and a smoke test whose failure actually stops the deploy.</span></div>
  <div class="lz-step"><span class="lz-k">8</span><span class="lz-t">Living on a small machine</span><span class="lz-d">Memory, swap, the OOM killer and the build cache. This repository has filled the disk that Postgres was sitting on and had a build killed with exit 137; both are measured here.</span></div>
  <div class="lz-step"><span class="lz-k">9–10</span><span class="lz-t">Watching it, and getting it back</span><span class="lz-d">The handful of things worth alerting on, and backups — specifically the difference between having backups and having restored one, measured with a stopwatch.</span></div>
  <div class="lz-step"><span class="lz-k">11</span><span class="lz-t">Diagnosis</span><span class="lz-d">A procedure for the deploy that just failed, and a final exam over everything.</span></div>
  <div class="lz-step"><span class="lz-k">12</span><span class="lz-t">From a domain name to HTTPS (new, 09/2026)</span><span class="lz-d">DNS records and TTLs, a reverse proxy in front of the app, certificates from an ACME authority renewed automatically, only the right ports open — and how Docker can publish a database port straight past the firewall.</span></div>
  <div class="lz-step"><span class="lz-k">13</span><span class="lz-t">Containers, a registry and CI (new)</span><span class="lz-d">The artifact becomes an image pinned by tag, built on a bigger machine or in CI, checked before it is pushed, pulled and swapped by the server without dropping requests — including why the build-green-swap-green-502 incident happened.</span></div>
  <div class="lz-step"><span class="lz-k">14</span><span class="lz-t">Several environments, and more than one server (new)</span><span class="lz-d">Staging and preview environments, two machines behind a load balancer, rolling and canary deploys, choosing between a VPS, a PaaS and Kubernetes with real prices, and moving to a new provider without losing data.</span></div>
  <div class="lz-step"><span class="lz-k">15</span><span class="lz-t">Capstone (new)</span><span class="lz-d">One group-project-sized application shipped end to end on a practice server: domain, HTTPS, a release pipeline with a deliberate failure, a timed rollback and restore, and a first-week runbook.</span></div>
</div>

<h3>A note on what this course is not</h3>
<p>It is not about Kubernetes, or a platform-as-a-service, or any system that hides the four steps from you. Those are reasonable choices and they solve real problems; they also make it impossible to see what is happening, which is exactly the thing worth learning first. Everything here runs on one machine you can SSH into, and every mechanism is one you could implement in a shell script — because at the bottom, that is what the large systems are doing too.</p>
<div class="note-ct">Update, September 2026: Chapter 14 now puts a VPS side by side with a PaaS, serverless and Kubernetes — with real prices — so that you can <em>choose</em> between them. It still does not teach Kubernetes itself; that has its own course. The point above stands: learn the four steps where you can see them, and every platform becomes a set of choices about which steps to hand over.</div>
<div class="note-ct">If you already run Docker, almost nothing changes conceptually. The artifact becomes an image instead of a directory, the transport becomes <code>docker pull</code> instead of <code>rsync</code>, and the swap becomes <code>docker compose up -d</code> instead of a symlink. The four steps are the same, the failure modes are the same, and Chapter 2 measures the container path alongside the others rather than treating it as a different subject.</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> version 2 of the group's app has just gone out and the home page is blank. The teacher arrives in ten minutes. Build the layout that lets you go back to version 1 in seconds — and do it.</p><ol>
<li>Make two commits in your <code>~/dv-lab</code> project ("ban 1", "ban 2").</li>
<li>Ship each commit into its own release directory on the practice VPS: <code>for c in $(git rev-list --reverse --abbrev-commit HEAD); do git archive --format=tar $c | ssh -F ~/dv-lab/ssh.cfg vps "mkdir -p ~/srv/phat-hanh/$c &amp;&amp; tar x -C ~/srv/phat-hanh/$c"; done</code></li>
<li>Log in with <code>ssh -F ~/dv-lab/ssh.cfg vps</code>. Point <code>hien-tai</code> at the newest: <code>ln -sfn phat-hanh/&lt;moi-nhat&gt; hien-tai</code>, and check with <code>readlink hien-tai</code>.</li>
<li>Roll back with the atomic form, timed (block below), and read <code>readlink</code> again.</li>
<li>Optional: in an <code>alpine</code> container, run <code>strace</code> on <code>ln -sfn</code> and find the <code>unlinkat</code> for yourself.</li></ol>
<pre><code class="language-bash">cd ~/srv
bd=$(date +%s%N); ln -sfn phat-hanh/&lt;ban-cu&gt; hien-tai.moi &amp;&amp; mv -T hien-tai.moi hien-tai; kt=$(date +%s%N)
echo "lui ban xong: $(readlink hien-tai) — mat $(( (kt-bd)/1000 )) micro giay"</code></pre>
<div class="out">dang chay: phat-hanh/a13a968
lui ban xong: phat-hanh/f04662d — mat 2486 micro giay</div>
<p><strong>Done when:</strong> <code>~/srv/phat-hanh/</code> holds two release directories, <code>readlink hien-tai</code> names the older one after step 4, the rollback took milliseconds, and you can explain why no request could ever have seen <code>hien-tai</code> missing.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Release directory</span><span class="v">One directory per deployed version, never overwritten.</span></div>
  <div class="kv"><span class="k">Symlink (<code>current</code> / <code>hien-tai</code>)</span><span class="v">A name that points at the live release; moving it is the swap and the rollback.</span></div>
  <div class="kv"><span class="k">Atomic</span><span class="v">Happens all at once: other processes see the old state or the new one, never something in between.</span></div>
  <div class="kv"><span class="k"><code>rename(2)</code></span><span class="v">The system call that replaces one name with another atomically; <code>mv -T</code> uses it.</span></div>
  <div class="kv"><span class="k"><code>strace</code></span><span class="v">Prints the system calls a program makes — the fastest way to see what a command really does.</span></div>
  <div class="kv"><span class="k">Shared directory</span><span class="v">Data that outlives every release (<code>.env</code>, uploads, logs), kept outside the release directories.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Extracting over the old version leaves nothing to roll back to; one directory per release keeps every version on disk.</li>
<li>Moving a symlink costs about the same at any project size (4.8 ms); re-extracting grows with the project (590 ms at 12,000 files).</li>
<li>GNU <code>ln -sfn</code> already renames atomically, BusyBox's unlinks first — write <code>ln -sfn … .moi &amp;&amp; mv -T</code> so it does not matter.</li>
<li>A symlink rollback needs only the disk, not the network or the old artifact — which is exactly what you have when things are on fire.</li>
<li>The hand deploy still lacks a zero-downtime swap, protection from half-failure, the database, and reboot survival; each is a chapter.</li>
<li>The course now runs to 16 parts; Chapters 12–15 take the same four steps onto the internet, into containers and CI, and across several machines.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">rename(2) — why mv -T is atomic and ln -sfn is not guaranteed to be</span><span class="lc-sub">man7.org/linux/man-pages/man2/rename.2.html — the guarantee the releases layout depends on, stated in one paragraph.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Capistrano — the releases/current layout</span><span class="lc-sub">capistranorb.com/documentation/getting-started/structure — the tool that popularised this directory structure; the layout is worth stealing even if the tool is not.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App</span><span class="lc-sub">12factor.net — twelve short pages. Factors III (Config), V (Build/release/run) and XI (Logs) are the ones this course keeps returning to.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — images, and what a swap means when the artifact is an image</span><span class="lc-sub">/courses/docker/learn${REF} — the container version of the releases layout, where the image tag plays the part of the symlink.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Những gì bạn CHƯA giải quyết</h2>
<p class="lead">Bốn lệnh ở Bài 0.3 là một lần deploy CHẠY ĐƯỢC. Chúng cũng là một lần deploy không có đường lùi, gián đoạn dài đúng bằng thời gian khởi động, không có gì bảo vệ khi hỏng nửa chừng, và chẳng thứ gì sống sót qua một lần khởi động lại máy. Bài này đo cái đầu tiên trong số đó, vì chính phép đo ấy giải thích hình dạng của mọi thứ theo sau.</p>

<h3>Một quyết định làm thay đổi cái giá của MỌI lần lùi bản</h3>
${slide('dv-00', 33, 'Lùi bản: đổi symlink 4,8 ms, giải nén lại 590 ms')}
<p>Lần deploy bằng tay đã giải nén bản mới ĐÈ LÊN bản cũ. Có một cách khác: cho mỗi bản phát hành một thư mục riêng, rồi trỏ một symlink vào cái đang sống. Lùi bản khi đó là DI CHUYỂN cái symlink. Đo cả hai cách, trên hai cỡ dự án:</p>
<div class="out">═══ du an nho: 42 tep, 176 KB ═══
  doi symlink:      6.330 micro giay  (6,3 ms)
  giai nen lai:    13.372 micro giay  (13,4 ms)

═══ du an that: 12.000 tep, 48 MB (nen con 11 MB) ═══
  doi symlink:      4.796 micro giay  (4,8 ms)
  giai nen lai:       590 mili giay</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Đổi symlink thì KHÔNG tăng</span><span class="v">6,3 ms trên dự án 176 KB, 4,8 ms trên dự án 48 MB — chênh lệch chỉ là nhiễu. Di chuyển một symlink là MỘT thao tác hệ tệp, bất kể nó trỏ vào cái gì.</span></div>
  <div class="kv"><span class="k">Giải nén thì tăng theo dự án</span><span class="v">13 ms thành 590 ms: chậm hơn bốn mươi lăm lần, vì có 12.000 tệp phải ghi thay vì 42. Một ứng dụng thật có <code>node_modules</code> còn lớn hơn nữa.</span></div>
  <div class="kv"><span class="k">Gấp 123 lần ở cỡ thực tế</span><span class="v">Và khoảng cách còn tiếp tục doãng ra. Điểm thú vị là một con số là HẰNG SỐ còn con số kia là một HÀM của kho mã bạn.</span></div>
  <div class="kv"><span class="k">Tốc độ thậm chí còn chưa phải điểm chính</span><span class="v">Xem bên dưới — khác biệt về CẤU TRÚC quan trọng hơn mấy phần nghìn giây.</span></div>
</div>
<div class="callout ok"><strong>Bố cục "releases", gói trong ba dòng.</strong> Mỗi bản phát hành rơi vào thư mục riêng của nó; một symlink gọi tên cái đang hiện hành; lùi bản là di chuyển cái symlink. Không có gì bị ghi đè, nên bản trước đó vẫn còn nằm nguyên vẹn trên đĩa vào cái lúc bạn cần nó lúc hai giờ sáng.</div>
<pre><code>/srv/app/
├── phat-hanh/
│   ├── 2026-08-23-1930-a3f1c9/     <span class="tok-comment"># moi ban phat hanh mot thu muc</span>
│   ├── 2026-08-23-2114-b8e402/
│   └── 2026-08-24-0902-c1d773/
├── hien-tai -> phat-hanh/2026-08-24-0902-c1d773
└── chung/                          <span class="tok-comment"># thu KHONG thuoc ban phat hanh nao</span>
    ├── .env                        <span class="tok-comment">#   → Chuong 4</span>
    ├── tai-len/
    └── log/</code></pre>
<div class="pitfall"><strong>Bẫy — riêng <code>ln -sfn</code> thì KHÔNG được bảo đảm nguyên tử.</strong> Ở một số bản <code>ln</code> — BusyBox, bản nằm trong các ảnh dựa trên Alpine, đo ở dưới — thay một symlink đang tồn tại thực chất là gỡ liên kết rồi tạo lại, và trong một khoảnh khắc thì đường dẫn đó KHÔNG tồn tại. (<code>ln</code> của GNU trên Ubuntu đã dùng tên tạm rồi đổi tên; bạn không thể trông vào việc một máy cụ thể đang có bản nào.) Một request rơi vào đúng cửa sổ ấy sẽ chẳng thấy gì. Dạng nguyên tử là tạo liên kết mới dưới một cái tên tạm rồi đổi tên nó đè lên cái cũ — <code>ln -sfn &lt;dich&gt; hien-tai.moi &amp;&amp; mv -T hien-tai.moi hien-tai</code> — vì <code>rename(2)</code> là nguyên tử và <code>mv -T</code> dùng đúng nó. Đó chính là dạng đã đo ở trên, và hai chữ thêm vào đó là khác biệt giữa MỘT CÚ LÙI BẢN và MỘT CÚ GIÁN ĐOẠN trong lúc lùi bản.</div>
<p>Khác biệt về cấu trúc còn quan trọng hơn con số thời gian. Lùi bản bằng cách giải nén lại thì CẦN cái tạo tác cũ vẫn còn tồn tại ở đâu đó — tệp nén, cái tag git, ảnh trong registry, và mạng để tải nó về. Lùi bản bằng symlink thì chẳng cần gì ngoài một thư mục ĐÃ NẰM SẴN trên đĩa. Cái lúc bạn cần lùi bản nhất thường cũng là cái lúc có thứ khác đang hỏng, và một cú lùi bản phụ thuộc vào mạng là một cú lùi bản bạn có thể sẽ không có được.</p>

<h3>Đào sâu: <code>ln -sfn</code> có nguyên tử không? Hỏi strace</h3>
${slide('dv-00', 34, 'ln -sfn có nguyên tử không? Tuỳ bản ln')}
<p>"Nguyên tử" (atomic) nghĩa là không tiến trình nào khác thấy được một trạng thái làm dở: ở mọi khoảnh khắc, <code>hien-tai</code> hoặc trỏ vào bản cũ, hoặc trỏ vào bản mới, không bao giờ trỏ vào hư không. Cách biết một lệnh thật sự làm gì là nhìn các lời gọi hệ thống (system call) của nó. Trên VPS thí nghiệm (GNU coreutils 9.4) và trong một container Alpine (BusyBox 1.36.1), thay một liên kết đang tồn tại:</p>
<pre><code class="language-bash">strace -e trace=symlink,symlinkat,unlink,unlinkat,rename,renameat,renameat2 ln -sfn phat-hanh/b2 hien-tai</code></pre>
<div class="out"># GNU coreutils 9.4 (Ubuntu 24.04) — 8.32 tren Ubuntu 22.04 in ra dung kieu nay
symlinkat("phat-hanh/b2", AT_FDCWD, "hien-tai") = -1 EEXIST (File exists)
symlinkat("phat-hanh/b2", AT_FDCWD, "Cu1B21aY") = 0
renameat(AT_FDCWD, "Cu1B21aY", AT_FDCWD, "hien-tai") = 0

# BusyBox v1.36.1 (alpine:3.20)
unlinkat(AT_FDCWD, "cur", 0)            = 0
symlinkat("b", AT_FDCWD, "cur")         = 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>ln</code> của GNU</span><span class="v">Thử tạo liên kết, nhận <code>EEXIST</code>, tạo nó dưới một tên tạm ngẫu nhiên, rồi <code>renameat</code> đè lên cái cũ. Đó là mẫu an toàn, được làm sẵn cho bạn.</span></div>
  <div class="kv"><span class="k"><code>ln</code> của BusyBox</span><span class="v"><code>unlinkat</code> trước, <code>symlinkat</code> sau: giữa hai lời gọi đó <code>cur</code> không tồn tại, và một request rơi đúng lúc ấy nhận "No such file or directory".</span></div>
  <div class="kv"><span class="k">Nên viết gì</span><span class="v"><code>ln -sfn &lt;dich&gt; hien-tai.moi &amp;&amp; mv -T hien-tai.moi hien-tai</code> chạy giống nhau trên mọi hệ có <code>mv -T</code>, vì chính bạn thực hiện cú đổi tên. Trên macOS, <code>mv</code> kiểu BSD không có <code>-T</code>; ở đó dùng <code>mv -h</code>, hoặc chạy bước deploy trên Linux.</span></div>
</div>
<p>Đo trên VPS thí nghiệm, với hai bản phát hành tạo bằng <code>git archive</code> từ hai commit, chính cú lùi bản:</p>
<div class="out">dang chay: phat-hanh/a13a968
lui ban xong: phat-hanh/f04662d — mat 2486 micro giay</div>
<h3>Phần còn lại của khoá, và mỗi chương bịt lỗ hổng nào</h3>
${slide('dv-00', 35, 'Năm lỗ hổng của deploy tay → năm chương')}
${slide('dv-00', 9, 'Lộ trình 16 phần, bốn cung')}
<p>Từ tháng 9/2026 khoá có mười sáu phần: mười hai phần mô tả dưới đây, cộng Chương 12–15 được nối vào cuối cùng danh sách này.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1–2</span><span class="lz-t">Cái tạo tác, và đưa nó lên máy</span><span class="lz-d">Chính xác thứ gì được gửi đi, và ba đường vận chuyển so sánh cho đầy đủ — rsync, git, và một registry container — kể cả chuyện gì thay đổi khi tạo tác phải được <em>DỰNG</em> chứ không phải chép, và việc dựng đó nên xảy ra ở đâu.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bước tráo, mà không có gián đoạn</span><span class="lz-d">Bố cục releases ở trên, một trình quản lý dịch vụ thay cho <code>nohup</code>, và khởi động bản mới <em>TRƯỚC KHI</em> dừng bản cũ — đó là thứ đưa con số 3.070 ms đo ở Bài 0.1 về không.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cấu hình và bí mật</span><span class="lz-d">Cái <code>DATABASE_URL</code> bị thiếu ở Bài 0.3 nên sống ở đâu để một lần deploy không thể làm mất nó, vì sao giá trị lúc DỰNG và giá trị lúc CHẠY là hai thứ khác nhau, và điều gì làm một bí mật lỡ nằm trong lịch sử git thành không thu hồi được.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Cơ sở dữ liệu</span><span class="lz-d">Chương chứa những sự cố tệ nhất. Thay đổi lược đồ và thay đổi mã được deploy ở hai thời điểm khác nhau, và cái cửa sổ giữa hai thời điểm ấy là nơi website vỡ. Có kèm cả cái trạng thái migration hỏng mà chính kho mã này đã từng rơi vào.</span></div>
  <div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Lùi bản, và những gì KHÔNG lùi được</span><span class="lz-d">Cái symlink mới là nửa dễ. Dữ liệu do bản hỏng ghi ra, một migration đã xoá mất một cột, một email đã gửi đi — chẳng cái nào quay lại được. Biết thay đổi nào là MỘT CHIỀU chính là thứ làm cho một lần deploy an toàn để thử.</span></div>
  <div class="lz-step"><span class="lz-k">7</span><span class="lz-t">Chính cái script deploy</span><span class="lz-d">Hỏng thì phải la lên chứ không đi tiếp, chạy hai lần không gây hại, từ chối chạy khi cây làm việc còn bẩn, và một smoke test mà việc nó hỏng THẬT SỰ dừng được lần deploy.</span></div>
  <div class="lz-step"><span class="lz-k">8</span><span class="lz-t">Sống trên một cái máy nhỏ</span><span class="lz-d">Bộ nhớ, swap, kẻ giết OOM và cache dựng. Chính kho mã này đã từng làm đầy cái đĩa mà Postgres đang ngồi trên đó, và từng bị một lần dựng giết chết với mã thoát 137; cả hai đều được đo lại ở đây.</span></div>
  <div class="lz-step"><span class="lz-k">9–10</span><span class="lz-t">Trông chừng nó, và lấy lại nó</span><span class="lz-d">Một nhúm thứ đáng đặt cảnh báo, và sao lưu — cụ thể là khác biệt giữa CÓ bản sao lưu và ĐÃ TỪNG phục hồi một bản, đo bằng đồng hồ bấm giây.</span></div>
  <div class="lz-step"><span class="lz-k">11</span><span class="lz-t">Chẩn đoán</span><span class="lz-d">Một quy trình cho cái lần deploy vừa mới hỏng, cộng một bài thi cuối khoá trên toàn bộ nội dung.</span></div>
  <div class="lz-step"><span class="lz-k">12</span><span class="lz-t">Từ tên miền tới HTTPS (mới, 09/2026)</span><span class="lz-d">Bản ghi DNS và TTL, một reverse proxy đứng trước ứng dụng, chứng chỉ từ một nhà cấp ACME tự gia hạn, chỉ mở đúng những cổng cần mở — và cách Docker có thể mở cổng cơ sở dữ liệu vượt thẳng qua tường lửa.</span></div>
  <div class="lz-step"><span class="lz-k">13</span><span class="lz-t">Container, registry và CI (mới)</span><span class="lz-d">Tạo tác thành một ảnh ghim theo tag, dựng trên máy mạnh hơn hoặc trong CI, kiểm TRƯỚC khi đẩy, rồi máy chủ kéo về và tráo mà không rơi request — kể cả lý do vì sao sự cố build-xanh-tráo-xanh-mà-502 đã xảy ra.</span></div>
  <div class="lz-step"><span class="lz-k">14</span><span class="lz-t">Nhiều môi trường, và nhiều hơn một máy chủ (mới)</span><span class="lz-d">Môi trường staging và preview, hai máy sau một bộ cân bằng tải, deploy cuốn chiếu và canary, chọn giữa VPS, PaaS và Kubernetes với giá thật, và chuyển sang nhà cung cấp mới mà không mất dữ liệu.</span></div>
  <div class="lz-step"><span class="lz-k">15</span><span class="lz-t">Dự án cuối khoá (mới)</span><span class="lz-d">Một ứng dụng cỡ đồ án nhóm được đưa lên trọn vẹn trên máy tập: tên miền, HTTPS, một đường ống phát hành có một lần cố tình hỏng, lùi bản và phục hồi có bấm giờ, và một runbook cho tuần đầu tiên.</span></div>
</div>

<h3>Một ghi chú về việc khoá này KHÔNG phải cái gì</h3>
<p>Nó không nói về Kubernetes, hay một nền tảng dạng dịch vụ, hay bất kỳ hệ thống nào GIẤU bốn bước đó khỏi bạn. Đó đều là những lựa chọn hợp lý và chúng giải quyết vấn đề có thật; chúng cũng làm bạn không thể nhìn thấy chuyện gì đang diễn ra, mà đó lại đúng là thứ đáng học TRƯỚC TIÊN. Mọi thứ ở đây chạy trên MỘT cái máy mà bạn SSH vào được, và mọi cơ chế đều là thứ bạn tự cài đặt được bằng một script shell — vì ở tầng đáy, mấy hệ thống lớn cũng đang làm đúng như vậy.</p>
<div class="note-ct">Cập nhật tháng 9/2026: Chương 14 giờ đặt VPS cạnh PaaS, serverless và Kubernetes — với giá thật — để bạn <em>CHỌN</em> giữa chúng. Nó vẫn không dạy bản thân Kubernetes; cái đó có khoá riêng. Ý ở trên vẫn đứng vững: học bốn bước ở chỗ bạn nhìn thấy được chúng, rồi mọi nền tảng chỉ còn là những lựa chọn về việc giao bước nào cho người khác.</div>
<div class="note-ct">Nếu bạn đã dùng Docker thì gần như không có gì thay đổi về mặt khái niệm. Tạo tác trở thành một cái ảnh thay vì một thư mục, vận chuyển trở thành <code>docker pull</code> thay vì <code>rsync</code>, và bước tráo trở thành <code>docker compose up -d</code> thay vì một cái symlink. Bốn bước vẫn thế, các kiểu hỏng vẫn thế, và Chương 2 đo đường container SONG SONG với các đường khác chứ không coi nó là một môn học riêng.</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bản 2 của ứng dụng nhóm vừa lên và trang chủ trắng xoá. Mười phút nữa thầy tới. Dựng bố cục cho phép quay về bản 1 trong vài giây — rồi quay về thật.</p><ol>
<li>Tạo hai commit trong dự án <code>~/dv-lab</code> ("ban 1", "ban 2").</li>
<li>Đưa mỗi commit vào một thư mục phát hành riêng trên VPS thí nghiệm: <code>for c in $(git rev-list --reverse --abbrev-commit HEAD); do git archive --format=tar $c | ssh -F ~/dv-lab/ssh.cfg vps "mkdir -p ~/srv/phat-hanh/$c &amp;&amp; tar x -C ~/srv/phat-hanh/$c"; done</code></li>
<li>Đăng nhập bằng <code>ssh -F ~/dv-lab/ssh.cfg vps</code>. Trỏ <code>hien-tai</code> vào bản mới nhất: <code>ln -sfn phat-hanh/&lt;moi-nhat&gt; hien-tai</code>, rồi kiểm bằng <code>readlink hien-tai</code>.</li>
<li>Lùi bản bằng dạng nguyên tử, có bấm giờ (khối dưới), rồi đọc lại <code>readlink</code>.</li>
<li>Tuỳ chọn: trong một container <code>alpine</code>, chạy <code>strace</code> với <code>ln -sfn</code> và tự tìm ra cái <code>unlinkat</code>.</li></ol>
<pre><code class="language-bash">cd ~/srv
bd=$(date +%s%N); ln -sfn phat-hanh/&lt;ban-cu&gt; hien-tai.moi &amp;&amp; mv -T hien-tai.moi hien-tai; kt=$(date +%s%N)
echo "lui ban xong: $(readlink hien-tai) — mat $(( (kt-bd)/1000 )) micro giay"</code></pre>
<div class="out">dang chay: phat-hanh/a13a968
lui ban xong: phat-hanh/f04662d — mat 2486 micro giay</div>
<p><strong>Đạt khi:</strong> <code>~/srv/phat-hanh/</code> có hai thư mục phát hành, sau bước 4 <code>readlink hien-tai</code> gọi tên bản cũ hơn, cú lùi bản mất vài mili giây, và bạn giải thích được vì sao không request nào có thể thấy <code>hien-tai</code> biến mất.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Release directory (thư mục phát hành)</span><span class="v">Mỗi phiên bản đã deploy một thư mục, không bao giờ bị ghi đè.</span></div>
  <div class="kv"><span class="k">Symlink (liên kết mềm — <code>current</code> / <code>hien-tai</code>)</span><span class="v">Một cái tên trỏ vào bản đang sống; di chuyển nó chính là tráo và lùi bản.</span></div>
  <div class="kv"><span class="k">Atomic (nguyên tử)</span><span class="v">Xảy ra trọn trong một lần: tiến trình khác thấy trạng thái cũ hoặc mới, không bao giờ thấy thứ ở giữa.</span></div>
  <div class="kv"><span class="k"><code>rename(2)</code> (lời gọi đổi tên)</span><span class="v">System call thay một cái tên bằng cái khác một cách nguyên tử; <code>mv -T</code> dùng nó.</span></div>
  <div class="kv"><span class="k"><code>strace</code> (theo dõi lời gọi hệ thống)</span><span class="v">In ra các system call mà một chương trình thực hiện — cách nhanh nhất để thấy một lệnh thật sự làm gì.</span></div>
  <div class="kv"><span class="k">Shared directory (thư mục dùng chung)</span><span class="v">Dữ liệu sống lâu hơn mọi bản phát hành (<code>.env</code>, tệp tải lên, log), để ngoài các thư mục phát hành.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Giải nén đè lên bản cũ là chẳng còn gì để lùi về; mỗi bản phát hành một thư mục thì mọi phiên bản còn nằm trên đĩa.</li>
<li>Di chuyển một symlink tốn gần như nhau ở mọi cỡ dự án (4,8 ms); giải nén lại thì tăng theo dự án (590 ms với 12.000 tệp).</li>
<li><code>ln -sfn</code> của GNU đã đổi tên nguyên tử, của BusyBox thì xoá trước — viết <code>ln -sfn … .moi &amp;&amp; mv -T</code> để chuyện đó không còn quan trọng.</li>
<li>Lùi bản bằng symlink chỉ cần cái đĩa, không cần mạng hay tạo tác cũ — đúng thứ bạn còn có khi mọi thứ đang cháy.</li>
<li>Deploy tay vẫn thiếu bước tráo không gián đoạn, chống hỏng nửa chừng, cơ sở dữ liệu, và sống qua reboot; mỗi cái là một chương.</li>
<li>Khoá nay dài 16 phần; Chương 12–15 đưa cũng bốn bước đó ra Internet, vào container và CI, và trải trên nhiều máy.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">rename(2) — vì sao mv -T nguyên tử còn ln -sfn thì không chắc</span><span class="lc-sub">man7.org/linux/man-pages/man2/rename.2.html — cái bảo đảm mà bố cục releases dựa vào, phát biểu gọn trong một đoạn.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Capistrano — bố cục releases/current</span><span class="lc-sub">capistranorb.com/documentation/getting-started/structure — công cụ đã làm cho cấu trúc thư mục này phổ biến; cái bố cục đáng lấy về dùng kể cả khi bạn không dùng công cụ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App</span><span class="lc-sub">12factor.net — mười hai trang ngắn. Các yếu tố III (Config), V (Build/release/run) và XI (Logs) là mấy cái khoá này quay lại nhiều nhất.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — ảnh, và bước tráo có nghĩa gì khi tạo tác là một cái ảnh</span><span class="lc-sub">/courses/docker/learn${REF} — phiên bản container của bố cục releases, nơi cái tag ảnh đóng vai của cái symlink.</span></span></div>
</div>
`,
    },
    /* ─────────────────────────── 0.7 · QUIZ ─────────────────────────── */
    {
      title: '0.7 — Section 0 check|||0.7 — Kiểm tra Mục 0',
      slug: 'deploy-0-7-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật: một máy trong ba chạy bản cũ, rsync gửi tệp gõ dở, deploy trả 500 mà mọi phép kiểm đều xanh, ssh treo, pkill tự giết shell, drop-in sshd thua thứ tự, sshd chưa nạp lại, lùi bản khi mất mạng, cảnh báo host key ở sân tập, và đẩy thay đổi ra nhiều máy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations you will meet in your first real deploys — each one decided by something in this section. Read the explanation after submitting, especially for the questions you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can name the four steps of a deploy and say which step a given failure belongs to.</li>
<li>I can explain why an artifact built from a commit cannot ship a half-written file, and read an <code>rsync -azin</code> dry run.</li>
<li>I can show, with real output, a deploy that passes exit-code, process and port checks and still returns 500.</li>
<li>I can harden SSH with a drop-in that actually wins, confirm it with <code>sshd -T</code> and from the client, and reload safely.</li>
<li>I can start a remote process that neither hangs <code>ssh</code> nor gets killed by its own <code>pkill</code>.</li>
<li>I can roll back by moving a symlink atomically, and I have a practice VPS I can rebuild in seconds.</li>
</ul>
${slide('dv-00', 37, 'Bảng tra nhanh Mục 0 (1/2)')}
${slide('dv-00', 38, 'Bảng tra nhanh Mục 0 (2/2)')}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống bạn sẽ gặp trong những lần deploy thật đầu tiên — câu nào cũng được quyết định bởi một điều trong mục này. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi gọi tên được bốn bước của một lần deploy và nói được một cái hỏng cụ thể thuộc bước nào.</li>
<li>Tôi giải thích được vì sao tạo tác dựng từ commit không thể gửi đi một tệp gõ dở, và đọc được một lần chạy thử <code>rsync -azin</code>.</li>
<li>Tôi chỉ ra được, bằng output thật, một lần deploy qua cả phép kiểm mã thoát, tiến trình và cổng mà vẫn trả 500.</li>
<li>Tôi gia cố được SSH bằng một drop-in THẬT SỰ thắng, xác nhận bằng <code>sshd -T</code> và từ phía máy khách, và nạp lại an toàn.</li>
<li>Tôi khởi động được một tiến trình từ xa mà không làm <code>ssh</code> treo và không bị chính <code>pkill</code> của mình giết.</li>
<li>Tôi lùi bản được bằng cách di chuyển symlink một cách nguyên tử, và có một VPS thí nghiệm dựng lại được trong vài giây.</li>
</ul>
${slide('dv-00', 37, 'Bảng tra nhanh Mục 0 (1/2)')}
${slide('dv-00', 38, 'Bảng tra nhanh Mục 0 (2/2)')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your group deploys by hand to three servers behind a load balancer. After the deploy, about a third of users still see the old checkout page and some orders fail. Every step of the deploy printed no errors. What check would have caught this right after the deploy?|||Nhóm bạn deploy bằng tay lên ba máy chủ đứng sau một bộ cân bằng tải. Sau lần deploy, khoảng một phần ba người dùng vẫn thấy trang thanh toán cũ và một số đơn hàng hỏng. Mọi bước deploy đều không in ra lỗi nào. Phép kiểm nào lẽ ra bắt được chuyện này ngay sau deploy?',
            options: [
              'Checking that the deploy script exited 0 on the laptop that ran it|||Kiểm rằng script deploy thoát ra 0 trên cái laptop đã chạy nó',
              'Checking the load balancer’s health check, which returns 200 for all three servers|||Kiểm phép health check của bộ cân bằng tải, vốn đang trả 200 cho cả ba máy',
              'Asking EACH server which version it runs (a /version route, or readlink of the current release) and comparing all three with the commit you meant to ship|||Hỏi TỪNG máy xem nó đang chạy bản nào (một tuyến /version, hoặc readlink của bản đang sống) rồi so cả ba với commit mình định gửi',
              'Running the same deploy commands a second time on every server to be sure|||Chạy lại cùng các lệnh deploy thêm lần nữa trên mọi máy cho chắc',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: This is Knight Capital in miniature: one of eight servers never received the new code and nobody checked per server. Only a per-server version check detects "two right, one stale". The health check (the most tempting option) passes, because the stale server is healthy — it is just running the wrong version. An exit code on the laptop says nothing about the servers, and repeating a manual deploy repeats the same blind spot.|||VI: Đây là Knight Capital thu nhỏ: một trong tám máy chưa bao giờ nhận mã mới và không ai kiểm theo từng máy. Chỉ phép kiểm phiên bản TỪNG MÁY mới phát hiện được "hai máy đúng, một máy cũ". Health check (phương án hấp dẫn nhất) vẫn qua, vì máy cũ vẫn khoẻ — nó chỉ đang chạy nhầm phiên bản. Mã thoát trên laptop không nói gì về các máy chủ, còn lặp lại một lần deploy làm tay là lặp lại đúng điểm mù đó.',
          },
          {
            question: 'A teammate deploys with rsync -az --delete ./ vps:app/ while another teammate is still editing src/server.js in the same folder. Ten minutes later the API crash-loops with a SyntaxError. What would have prevented this?|||Một bạn deploy bằng rsync -az --delete ./ vps:app/ trong lúc một bạn khác vẫn đang sửa src/server.js trong cùng thư mục. Mười phút sau API sập đi sập lại với SyntaxError. Điều gì lẽ ra ngăn được chuyện này?',
            options: [
              'Building the artifact from a commit (git archive, or a push to a bare repo) so that uncommitted edits cannot be part of it|||Dựng tạo tác từ một commit (git archive, hoặc push vào một kho trần) để chỗ sửa chưa commit không thể nằm trong nó',
              'Adding -z so that rsync compresses the files and sends them faster|||Thêm -z để rsync nén tệp và gửi nhanh hơn',
              'Removing --delete so that old files stay on the server|||Bỏ --delete để các tệp cũ ở lại trên máy chủ',
              'Switching from rsync to scp, which copies whole files instead of deltas|||Đổi từ rsync sang scp, thứ chép nguyên tệp thay vì phần chênh',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: The problem is step 1, the artifact: rsync of a working tree ships whatever is on disk at that moment, half-written edits included. An artifact made from a commit excludes them by construction. Switching to scp (tempting because it "copies whole files") only changes the transport — it still copies the broken file. Compression and --delete are about how bytes move, not which bytes.|||VI: Vấn đề nằm ở bước 1, tạo tác: rsync một cây làm việc gửi đi bất cứ thứ gì đang có trên đĩa lúc đó, kể cả chỗ sửa dở. Tạo tác dựng từ commit thì tự loại chúng ra. Đổi sang scp (hấp dẫn vì nó "chép nguyên tệp") chỉ đổi cách vận chuyển — nó vẫn chép cái tệp hỏng. Nén và --delete là chuyện byte đi thế nào, không phải byte NÀO được đi.',
          },
          {
            question: 'After a deploy: the script exited 0, pgrep -af "^node" shows a PID, ss -tlnp shows port 3000 listening — and users get 500 on every page. Which check tells you the truth, and what is the most likely cause?|||Sau một lần deploy: script thoát ra 0, pgrep -af "^node" có PID, ss -tlnp cho thấy cổng 3000 đang nghe — mà người dùng nhận 500 ở mọi trang. Phép kiểm nào nói thật, và nguyên nhân khả dĩ nhất là gì?',
            options: [
              'pgrep, because a running process proves the new code started; the 500s are a browser cache problem|||pgrep, vì tiến trình đang chạy chứng minh mã mới đã lên; lỗi 500 là do cache trình duyệt',
              'ss, because a listening port proves the app is serving; the 500s come from the load balancer|||ss, vì cổng đang nghe chứng minh app đang phục vụ; lỗi 500 đến từ bộ cân bằng tải',
              'The exit code, because it covers every command in the script; the 500s must be from the previous version|||Mã thoát, vì nó bao trọn mọi lệnh trong script; lỗi 500 hẳn là của phiên bản trước',
              'A real request (curl -w "%{http_code}" to a real route): it shows 500, and a missing runtime value such as DATABASE_URL is the usual cause|||Một request thật (curl -w "%{http_code}" vào một tuyến thật): nó cho thấy 500, và một giá trị lúc chạy bị thiếu như DATABASE_URL là nguyên nhân thường gặp',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: This is case C from Lesson 0.3: the process started, bound its port and answers every request with an error. Exit code, process and port all "pass" — only a real request sees the 500, and the body names the missing DATABASE_URL. The pgrep option is the most tempting because a PID feels like proof, but a process can be alive and useless.|||VI: Đây là trường hợp C ở Bài 0.3: tiến trình đã lên, đã giữ cổng và trả lỗi cho mọi request. Mã thoát, tiến trình và cổng đều "qua" — chỉ một request thật mới thấy 500, và phần thân phản hồi gọi đúng tên DATABASE_URL bị thiếu. Phương án pgrep hấp dẫn nhất vì có PID nghe như bằng chứng, nhưng một tiến trình có thể sống mà vô dụng.',
          },
          {
            question: 'Your deploy step is: ssh vps \'cd ~/app && setsid nohup node src/server.js >~/app.log 2>&1 </dev/null &\'. The app starts, but the ssh command never returns and the CI job times out. Why?|||Bước deploy của bạn là: ssh vps \'cd ~/app && setsid nohup node src/server.js >~/app.log 2>&1 </dev/null &\'. App có lên, nhưng lệnh ssh không bao giờ trả về và job CI hết giờ. Vì sao?',
            options: [
              'nohup does not work over SSH, so node is still attached to the terminal and must be run with screen instead|||nohup không chạy qua SSH, nên node vẫn gắn vào terminal và phải chạy bằng screen thay thế',
              'The & applies to the whole cd … && setsid … list, so bash forks a subshell whose streams were never redirected; it stays alive as node’s parent and holds the session open|||Dấu & áp lên CẢ chuỗi cd … && setsid …, nên bash tách một subshell mà các luồng của nó chưa hề được chuyển hướng; subshell đó sống làm cha của node và giữ phiên mở',
              'Port 3000 is still held by the old process, so node waits for it to be released|||Cổng 3000 vẫn bị tiến trình cũ giữ, nên node ngồi chờ nó được nhả',
              'setsid needs root, so the command is waiting for a sudo password that never arrives|||setsid cần quyền root, nên lệnh đang chờ một mật khẩu sudo không bao giờ tới',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Measured on the practice VPS: this exact line was still hanging after 8 seconds, and ps showed "bash -c cd ~/app && setsid nohup node …" alive as node’s parent. With "cd ~/app; setsid nohup node … &" ssh returned in 0.18 s. The "nohup does not work" option is tempting because hangs look like terminal problems, but node’s own streams were already redirected; the open streams belong to the subshell.|||VI: Đo trên VPS thí nghiệm: đúng dòng này sau 8 giây vẫn treo, và ps cho thấy "bash -c cd ~/app && setsid nohup node …" vẫn sống làm cha của node. Viết "cd ~/app; setsid nohup node … &" thì ssh trả về sau 0,18 giây. Phương án "nohup không chạy" hấp dẫn vì treo trông như lỗi terminal, nhưng luồng của chính node đã được chuyển hướng rồi; các luồng còn mở là của cái subshell.',
          },
          {
            question: 'Step 3 of a deploy runs: ssh vps \'cd ~/app && tar xzf ../ban.tar.gz && pkill -f "node src/server.js"; sleep 0.3; setsid nohup node src/server.js >~/app.log 2>&1 </dev/null &\'. Right after it, echo $? prints 255 and no node process is running. What happened?|||Bước 3 của một lần deploy chạy: ssh vps \'cd ~/app && tar xzf ../ban.tar.gz && pkill -f "node src/server.js"; sleep 0.3; setsid nohup node src/server.js >~/app.log 2>&1 </dev/null &\'. Ngay sau đó echo $? in 255 và không có tiến trình node nào chạy. Chuyện gì đã xảy ra?',
            options: [
              'The SSH connection dropped because the network is unstable; retrying will work|||Kết nối SSH bị rớt vì mạng chập chờn; chạy lại là được',
              'tar failed, so nothing after && ran and ssh reports the tar error as 255|||tar hỏng, nên chẳng gì sau && được chạy và ssh báo lỗi của tar thành 255',
              'pkill -f matched the command line of the remote bash -c shell, which contains the same text, and killed it before it could start the new node|||pkill -f khớp dòng lệnh của chính shell bash -c ở máy chủ — vốn chứa đúng chuỗi đó — và giết nó trước khi nó kịp khởi động node mới',
              'node crashed on startup and took the ssh session down with it|||node sập ngay khi khởi động và kéo phiên ssh sập theo',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: -f matches whole command lines, and the remote shell’s command line includes "node src/server.js". pkill spares only itself, not its parent shell, so the shell dies mid-deploy: old version killed, new one never started, ssh exits 255. Anchor the pattern ("^node src/server.js") or use a PID file. "The network dropped" is tempting because 255 is ssh’s generic failure code — but it is reproducible every time, which a flaky network is not.|||VI: -f khớp cả dòng lệnh, và dòng lệnh của shell phía máy chủ chứa "node src/server.js". pkill chỉ chừa chính nó, không chừa shell cha, nên shell chết giữa chừng: bản cũ bị giết, bản mới chưa bao giờ chạy, ssh thoát 255. Neo mẫu ("^node src/server.js") hoặc dùng tệp PID. "Mạng rớt" hấp dẫn vì 255 là mã hỏng chung của ssh — nhưng lỗi này lặp lại lần nào cũng y hệt, điều mà mạng chập chờn không làm.',
          },
          {
            question: 'On a fresh cloud VPS you add /etc/ssh/sshd_config.d/70-harden.conf with PasswordAuthentication no. sshd -t is silent, but sudo sshd -T | grep ^passwordauth still prints "passwordauthentication yes". Why?|||Trên một VPS cloud mới, bạn thêm /etc/ssh/sshd_config.d/70-harden.conf ghi PasswordAuthentication no. sshd -t im lặng, nhưng sudo sshd -T | grep ^passwordauth vẫn in "passwordauthentication yes". Vì sao?',
            options: [
              'An earlier drop-in such as 50-cloud-init.conf sets it to yes; files are read alphabetically and sshd keeps the FIRST value, so name yours 01-…|||Một drop-in đứng trước như 50-cloud-init.conf đặt nó là yes; các tệp đọc theo chữ cái và sshd giữ giá trị ĐẦU TIÊN, nên đặt tên tệp của bạn là 01-…',
              'sshd -T shows the defaults compiled into OpenSSH, not your files|||sshd -T in giá trị mặc định biên dịch sẵn trong OpenSSH, không phải từ tệp của bạn',
              'The daemon has not been reloaded yet; sshd -T will show "no" after systemctl reload ssh|||Daemon chưa được nạp lại; sshd -T sẽ in "no" sau khi systemctl reload ssh',
              'Drop-in files only apply to Match blocks, so the setting must go into the main sshd_config|||Tệp drop-in chỉ áp dụng cho khối Match, nên thiết lập phải nằm trong sshd_config chính',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured on the practice VPS: with 50-cloud-init.conf (yes) and 70-gia-co.conf (no), sshd -T printed yes; renaming the same file to 01-gia-co.conf printed no. The reload option is tempting, but sshd -T reads the files on disk and does not depend on the running daemon — that is exactly why it showed the ordering problem before any reload.|||VI: Đo trên VPS thí nghiệm: có 50-cloud-init.conf (yes) và 70-gia-co.conf (no) thì sshd -T in yes; đổi tên đúng tệp đó thành 01-gia-co.conf thì in no. Phương án nạp lại nghe hấp dẫn, nhưng sshd -T đọc các tệp trên đĩa và không phụ thuộc daemon đang chạy — chính vì thế nó cho thấy vấn đề thứ tự trước cả khi nạp lại.',
          },
          {
            question: 'You fixed the drop-in order and sudo sshd -T now prints "passwordauthentication no". From your laptop, ssh -o PubkeyAuthentication=no nobody@vps still answers "Permission denied (publickey,password)". What is going on?|||Bạn đã sửa thứ tự drop-in và sudo sshd -T giờ in "passwordauthentication no". Từ laptop, ssh -o PubkeyAuthentication=no nobody@vps vẫn trả "Permission denied (publickey,password)". Chuyện gì đang diễn ra?',
            options: [
              'The laptop caches the list of methods; delete ~/.ssh/known_hosts to refresh it|||Laptop lưu đệm danh sách phương thức; xoá ~/.ssh/known_hosts để làm mới',
              'The running sshd still uses the configuration it read at start-up; reload it (systemctl reload ssh), then test again from a second terminal|||sshd đang chạy vẫn dùng cấu hình nó đọc lúc khởi động; nạp lại nó (systemctl reload ssh), rồi thử lại từ một terminal thứ hai',
              'KbdInteractiveAuthentication is still yes, and it is printed as "password" in the error|||KbdInteractiveAuthentication vẫn là yes, và nó được in thành "password" trong thông báo lỗi',
              'sshd -T is wrong on Ubuntu 24.04 because of ssh.socket; only the client can be trusted|||sshd -T sai trên Ubuntu 24.04 vì ssh.socket; chỉ tin được phía máy khách',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: sshd -T says what WILL be in effect; the client shows what IS in effect. On the practice VPS the client saw (publickey,password) until the daemon was reloaded, then (publickey). The ssh.socket option is tempting because socket activation does change how Port behaves, but PasswordAuthentication is applied by a normal reload; known_hosts stores host keys, not auth methods.|||VI: sshd -T nói cái SẼ có hiệu lực; máy khách cho thấy cái ĐANG có hiệu lực. Trên VPS thí nghiệm, máy khách thấy (publickey,password) cho tới khi daemon được nạp lại, rồi mới thành (publickey). Phương án ssh.socket hấp dẫn vì socket activation đúng là đổi cách Port hoạt động, nhưng PasswordAuthentication được áp dụng bằng một lần reload bình thường; còn known_hosts lưu khoá máy chủ, không lưu phương thức xác thực.',
          },
          {
            question: 'Version 2 just went live and breaks the home page. The VPS cannot reach the internet right now (the provider has a network incident), so nothing can be downloaded. Which rollback still works in seconds?|||Bản 2 vừa lên và làm hỏng trang chủ. Lúc này VPS không ra được Internet (nhà cung cấp đang gặp sự cố mạng), nên không tải được gì. Cách lùi bản nào vẫn làm được trong vài giây?',
            options: [
              'git fetch the previous tag on the server and check it out|||git fetch cái tag trước đó trên máy chủ rồi checkout nó',
              'docker pull the previous image tag from the registry and restart|||docker pull tag ảnh trước từ registry rồi khởi động lại',
              're-upload the previous tarball from your laptop with scp and extract it over the current code|||tải lại tệp nén bản trước từ laptop bằng scp rồi giải nén đè lên mã hiện tại',
              'point the current symlink back at the previous release directory already on disk (ln -sfn … current.new && mv -T current.new current)|||trỏ symlink hiện-tại về thư mục phát hành trước ĐÃ NẰM SẴN trên đĩa (ln -sfn … current.new && mv -T current.new current)',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The releases layout keeps every version on the disk, so rolling back needs no network and no old artifact — just an atomic rename (measured at 2.5–6 ms). scp from your laptop is tempting because it avoids the provider’s outbound network, but it still depends on the network path to the server, and extracting over the current tree is slow and not atomic. git fetch and docker pull both need a reachable remote.|||VI: Bố cục releases giữ mọi phiên bản trên đĩa, nên lùi bản không cần mạng và không cần tạo tác cũ — chỉ một cú đổi tên nguyên tử (đo được 2,5–6 ms). scp từ laptop hấp dẫn vì nó né được mạng đi ra của nhà cung cấp, nhưng vẫn phụ thuộc đường mạng tới máy chủ, và giải nén đè lên cây hiện tại vừa chậm vừa không nguyên tử. git fetch và docker pull đều cần một nơi từ xa với tới được.',
          },
          {
            question: 'You rebuilt your practice VPS container from scratch (not from the snapshot). Now ssh -F ~/dv-lab/ssh.cfg vps prints "WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!" and refuses. What is the right move?|||Bạn dựng lại container VPS thí nghiệm từ đầu (không phải từ ảnh chụp). Giờ ssh -F ~/dv-lab/ssh.cfg vps in "WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!" và từ chối. Làm gì mới đúng?',
            options: [
              'Set StrictHostKeyChecking no in your real ~/.ssh/config so the warning never appears again|||Đặt StrictHostKeyChecking no trong ~/.ssh/config thật để cảnh báo không bao giờ hiện lại',
              'Regenerate your own key pair with ssh-keygen, because your key has changed|||Sinh lại cặp khoá của mình bằng ssh-keygen, vì khoá của bạn đã đổi',
              'Here it is expected (a new machine has a new host key): remove the old entry with ssh-keygen -R \'[127.0.0.1]:2222\' -f ~/dv-lab/known_hosts; on a real server, stop and find out why first|||Ở đây là bình thường (máy mới có khoá máy chủ mới): xoá mục cũ bằng ssh-keygen -R \'[127.0.0.1]:2222\' -f ~/dv-lab/known_hosts; còn trên máy chủ thật thì dừng lại và tìm hiểu vì sao trước đã',
              'Delete the practice VPS and use the real group server instead, which does not have this problem|||Xoá VPS thí nghiệm và chuyển sang dùng máy chủ thật của nhóm, nơi không có vấn đề này',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The warning is about the SERVER’s host key, which is regenerated when openssh-server is installed on a new container; the fix is to forget the old entry — only in the sandbox’s own known_hosts. Turning off StrictHostKeyChecking is tempting because it "makes it go away", but it also disables the protection that matters on real servers, where this message can mean you are not talking to your machine. Your own key pair did not change.|||VI: Cảnh báo nói về khoá của MÁY CHỦ, thứ được sinh mới khi cài openssh-server trên một container mới; cách sửa là quên mục cũ — chỉ trong known_hosts riêng của sân tập. Tắt StrictHostKeyChecking hấp dẫn vì nó "làm cảnh báo biến mất", nhưng nó tắt luôn lớp bảo vệ quan trọng trên máy chủ thật, nơi thông báo này có thể nghĩa là bạn không nói chuyện với máy của mình. Cặp khoá của bạn không hề đổi.',
          },
          {
            question: 'You need to roll out an nginx configuration change to the four servers behind your load balancer. Remembering Cloudflare (July 2019) and CrowdStrike (July 2024), what is the safest plan?|||Bạn cần đẩy một thay đổi cấu hình nginx lên bốn máy chủ sau bộ cân bằng tải. Nhớ tới Cloudflare (7/2019) và CrowdStrike (7/2024), kế hoạch an toàn nhất là gì?',
            options: [
              'Push to all four at once with a parallel SSH loop, so every user gets the same version at the same moment|||Đẩy lên cả bốn cùng lúc bằng một vòng SSH song song, để mọi người dùng nhận cùng một bản vào cùng một thời điểm',
              'Apply it to one server, check nginx -t and real requests through that server, watch errors for a while, then continue one server at a time — ready to put the old file back|||Áp dụng cho một máy, kiểm nginx -t và request thật đi qua máy đó, theo dõi lỗi một lúc, rồi đi tiếp từng máy một — sẵn sàng trả tệp cũ về',
              'Apply it to all four at night, when traffic is lowest, and check in the morning|||Áp dụng cho cả bốn vào ban đêm, lúc ít người dùng nhất, sáng ra thì kiểm',
              'Run nginx -t on your laptop against the new file; if it passes, the change is safe everywhere|||Chạy nginx -t trên laptop với tệp mới; nếu qua thì thay đổi an toàn ở mọi nơi',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Both incidents were changes that reached 100% of machines in one step; a staged (canary) rollout lets the first step fail while the rest never see it. Pushing everywhere at once is tempting because it keeps servers consistent, but consistency is exactly what turns one bad change into a total outage. A syntax check on a laptop cannot catch a valid config that behaves badly — Cloudflare’s regex was valid too.|||VI: Cả hai sự cố đều là thay đổi đi tới 100% số máy trong một bước; triển khai từng bậc (canary) cho phép bậc đầu hỏng mà phần còn lại không hề thấy. Đẩy mọi nơi cùng lúc hấp dẫn vì giữ các máy đồng nhất, nhưng chính sự đồng nhất đó biến một thay đổi hỏng thành một lần sập toàn bộ. Kiểm cú pháp trên laptop không bắt được một cấu hình hợp lệ mà chạy tệ — biểu thức chính quy của Cloudflare cũng hợp lệ.',
          },
        ],
      },
    },
  ],
};
