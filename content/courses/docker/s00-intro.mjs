/**
 * Docker — Mục 0: giới thiệu, Docker giải quyết vấn đề gì, cài đặt, năm phút đầu tiên.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 *
 * Nâng cấp 09/2026: hai bài "Bắt đầu tại đây" (dk-0-5, dk-0-6) đứng trước bài slide 0.0 (deck dk-00, 40 slide);
 * slide/🧪/🗂/📌 + phần đào sâu trong 0.1–0.3; sửa output cũ sai (số ABI Node, Compose v1 có profiles,
 * system prune, volume vô danh của Postgres); quiz 10 câu. Output MỚI chạy thật 23/09/2026 trên
 * Docker Desktop 4.91 / Engine 29.8 (Mac M1, arm64) và Docker Engine 29.6 (Fedora 44, amd64).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Section 0 — What Docker solves, and getting set up|||Mục 0 — Docker giải quyết gì, và cài đặt',
  description: 'Bắt đầu tại đây: Docker là gì, ra đời thế nào, vì sao quan trọng, sự cố thật khi thiếu nó và cách học không nản; rồi ba cú hỏng Docker chấm dứt, cái nó KHÔNG phải, lộ trình 17 phần, cài đặt trên Linux/macOS/Windows, và năm phút đầu tiên chạy một thứ có thật.',
  lessons: [
    /* ─────────────────── 0.5 · BẮT ĐẦU TẠI ĐÂY (1/2) ─────────────────── */
    {
      title: 'Start here (1/2) — What Docker is, where it came from, and why it matters to you|||Bắt đầu tại đây (1/2) — Docker là gì, ra đời thế nào, và vì sao nó quan trọng với bạn',
      slug: 'dk-0-5-bat-dau-tai-day',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bài mở cửa cho người chưa từng dùng Docker: Docker là gì (thùng hàng tiêu chuẩn trước, định nghĩa sau), image và container, sáu thứ cùng mang tên Docker, container so với máy ảo, lịch sử từ chroot 1979 tới OCI và Kubernetes, vì sao 71,1% lập trình viên dùng nó, và nó giúp gì cho đồ án, phỏng vấn, công việc của bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>Hello. Before your first docker command, know what you are learning — and why it is worth it</h2>
<p class="lead">Welcome. Maybe you have never touched Docker. Maybe you have — you copied a <code>docker-compose.yml</code> from a tutorial, typed <code>docker compose up</code>, it worked, and you had no idea why. Or it did not work, a wall of red text appeared, and you closed the terminal. Either way, this lesson is for you. There is nothing to memorise here. In about twenty-five minutes you will know what Docker is, what it is not, where it came from, why the whole industry adopted it in a few years, and what it will do for your team project, your internship and your first job.</p>
<p>This lesson and the next one are the front door of the course. The second one tells real stories of what goes wrong <em>without</em> Docker (and when Docker is used carelessly), then gives you a study plan that does not burn you out. After that, lesson 0.1 goes deeper into the three failures Docker ends, 0.2 installs it and explains what you installed, and 0.3 runs a web server and a database on your own machine in five minutes.</p>

<h3>What Docker is — an everyday picture first</h3>
${slide('dk-00', 3, 'Docker là “thùng hàng tiêu chuẩn” cho phần mềm')}
<p>Forget the textbook definition for a moment. Picture a port in 1950. Every ship is loaded by hand: barrels, sacks, pianos, crates of wine, each a different shape, each packed differently by each port. Loading one ship takes days; things break and go missing. Then, on 26 April 1956, a trucking businessman called Malcom McLean sent a converted tanker, the <em>Ideal-X</em>, from Newark to Houston carrying 58 identical steel boxes. Between 1968 and 1970 the sizes of those boxes were standardised internationally. From then on it did not matter what was inside a container: every crane, every ship, every truck in the world could move it the same way, without opening it.</p>
<p>Software had the same problem, and still does wherever Docker is not used. Your application is not just your code: it is your code <em>plus</em> a specific version of Node or Java, plus system libraries, plus configuration, plus a database of a certain version. Every machine it lands on — your laptop, your teammate's Windows laptop, the lecturer's machine at the demo, a server — has a slightly different set of those things. <strong>Docker is the standard shipping container for software</strong>: you pack your application together with everything it needs into one box, and every machine that has Docker runs that box the same way, without caring what is inside.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">📦 A shipping container</span><span class="v">Packed once, carried by any crane, ship or truck. In Docker, the packed box is called an <strong>image</strong>, and "any crane" means any laptop, CI runner or server with Docker installed.</span></div>
  <div class="kv"><span class="k">🍰 A cake tin and the cakes</span><span class="v">One tin, as many cakes as you like, each cake eaten separately. The tin is the <strong>image</strong>; each cake is a <strong>container</strong> — a running copy you can use and throw away while the tin stays unchanged.</span></div>
  <div class="kv"><span class="k">🏠 A furnished rental flat</span><span class="v">You move in with a suitcase; the kitchen, beds and wiring are already there and identical in every flat of the same type. A container starts with its whole environment ready — you bring only your data.</span></div>
</div>
<p>Now the proper definitions, and they will make sense:</p>
<ul>
  <li><strong>Image</strong> — a read-only package holding a filesystem (the operating-system files your app needs, the language runtime, your code) plus a note saying which command to run. You build it once and ship it anywhere.</li>
  <li><strong>Container</strong> — one running copy of an image. Under the hood it is an ordinary process on the machine, fenced off so that it sees only its own files, its own network and its own processes (Chapter 1 shows exactly how).</li>
  <li><strong>Docker</strong> — the set of tools that builds images, stores and shares them, and runs containers from them.</li>
</ul>
<div class="callout ok"><strong>One sentence to keep:</strong> Docker packs your application and its entire environment into an image, and runs that image as a container that behaves the same on every machine — your laptop, your teammate's, the CI server and production.</div>

<h3>Image and container — the mould and what comes out of it</h3>
${slide('dk-00', 4, 'Image là cái khuôn, container là bản đang chạy từ khuôn đó')}
<p>If you have studied Java or C#, you already know this relationship: an image is a <code>class</code>, a container is an object made with <code>new</code>. One image can start ten containers; each has its own scratch space, and deleting a container does not touch the image. You get images in two ways: you <strong>pull</strong> a ready-made one from a <strong>registry</strong> (an image store — Docker Hub is the default one, with official images for <code>nginx</code>, <code>postgres</code>, <code>node</code>, <code>python</code>…), or you <strong>build</strong> your own from a recipe file called a <code>Dockerfile</code> (Chapter 4). Three verbs cover most of daily life: <code>docker pull</code>, <code>docker build</code>, <code>docker run</code>.</p>

<h3>"Docker" is a family of things — do not mix up six names</h3>
${slide('dk-00', 5, '“Docker” là cả một họ — đừng nhầm sáu cái tên')}
<p>Much of the confusion beginners feel comes from one word meaning six different things. When someone says "install Docker" or "Docker is slow", ask yourself which of these they mean:</p>
<table>
  <tr><th>Name</th><th>What it really is</th><th>Where you meet it</th></tr>
  <tr><td><strong>Docker Engine</strong></td><td>The background program (<code>dockerd</code>) that actually creates and runs containers. Free and open source, runs on Linux.</td><td>Every server; inside Docker Desktop</td></tr>
  <tr><td><strong><code>docker</code> CLI</strong></td><td>The command you type. It is only a <em>client</em>: it sends requests to the Engine over a socket and prints the answers.</td><td>Your terminal</td></tr>
  <tr><td><strong>Docker Desktop</strong></td><td>An app for macOS and Windows: a small Linux virtual machine with the Engine inside, plus a graphical interface. Free for personal use, education and small companies; companies with 250 or more employees or 10 million US dollars or more in annual revenue need a paid plan (as of 09/2026).</td><td>Your Mac or Windows laptop</td></tr>
  <tr><td><strong>Docker Hub</strong></td><td>The default public registry — a website that stores images.</td><td><code>hub.docker.com</code>, every <code>docker pull</code></td></tr>
  <tr><td><strong>Docker Compose</strong></td><td>A tool that starts a whole system (web + API + database) from one YAML file.</td><td><code>docker compose up</code>, Chapter 9</td></tr>
  <tr><td><strong>Docker, Inc.</strong></td><td>The company. It was called dotCloud until 2013. It does <em>not</em> own "containers": the image and runtime formats are an open standard (OCI).</td><td>News, licences</td></tr>
</table>
<div class="callout warn"><strong>Beginner misunderstanding no. 1: "Docker is a small virtual machine".</strong> It leads people to SSH into containers, <code>apt install</code> things by hand inside a running container, and then lose all of it the moment the container is recreated. A container is a fenced-off <em>process</em>, and its contents come from the image. If you want something inside it permanently, you change the <em>recipe</em> (the Dockerfile) and rebuild — never the running copy.</div>

<h3>Container vs virtual machine — side by side</h3>
${slide('dk-00', 6, 'Container KHÔNG phải máy ảo thu nhỏ')}
<p>A virtual machine (VirtualBox, VMware, the VMs your cloud provider rents out) pretends to be a whole computer: virtual hardware, and on top of it a complete guest operating system with its own kernel that has to boot. A container skips all of that. It uses the <strong>host's</strong> kernel directly; only the files above the kernel (libraries, runtime, your app) come from the image. That single difference explains almost every number in this table:</p>
<table>
  <tr><th></th><th>Virtual machine</th><th>Container</th></tr>
  <tr><td>What it virtualises</td><td>Hardware — a guest OS boots on it</td><td>Nothing: a process with a restricted view of the host</td></tr>
  <tr><td>Start-up</td><td>Tens of seconds to minutes</td><td>Usually under a second</td></tr>
  <tr><td>Typical image size</td><td>Several GB</td><td>Tens to a few hundred MB</td></tr>
  <tr><td>Memory</td><td>Reserved up front for the whole guest OS</td><td>Only what the process actually uses</td></tr>
  <tr><td>Kernel</td><td>Its own</td><td>Shared with the host (on a Mac, with Docker Desktop's VM)</td></tr>
  <tr><td>Isolation</td><td>Strong — the standard for running strangers' code</td><td>Thinner (Chapters 1 and 6 show where it stops)</td></tr>
  <tr><td>Run Windows on a Linux host?</td><td>Yes</td><td>No — Linux containers need a Linux kernel</td></tr>
</table>
<p>They are not rivals. Cloud servers are usually VMs, and Docker runs <em>inside</em> them. On your Mac, Docker Desktop is itself a small VM with containers inside. Lesson 0.2 comes back to this, because it explains why a Mac shows less memory to Docker than it really has.</p>

<h3>How Docker was born — 45 years of groundwork</h3>
${slide('dk-00', 7, '45 năm dọn đường: từ chroot 1979 tới Docker 2013')}
<p>Docker did not invent the idea of isolating a process. It stands on a long line of operating-system features, each solving one piece of the puzzle:</p>
<ul>
  <li><strong>1979 — <code>chroot</code>.</strong> Added during the development of Version 7 Unix: it changes what a process sees as the root directory <code>/</code>. A process can be given its own little filesystem. That is still the core of what an image is.</li>
  <li><strong>March 2000 — FreeBSD jails.</strong> FreeBSD 4.0 (released 14 March 2000) extended the idea: a "jail" also restricts networking, users and processes, so a hosting company could give each customer a box that looked like a whole machine.</li>
  <li><strong>2002 — the first Linux namespace.</strong> Linux 2.4.19 added the mount namespace: a process can have its own view of mounted filesystems. More kinds followed over the next decade (process IDs, network, hostname, users — user namespaces were considered complete in Linux 3.8, 2013).</li>
  <li><strong>February 2004 — Solaris Zones.</strong> Sun's version of the same idea appeared in a beta of Solaris 10, and in the full release in 2005.</li>
  <li><strong>2006 → January 2008 — cgroups.</strong> Engineers at Google started "process containers" in 2006 to limit how much CPU and memory a group of processes may use; renamed "control groups", it was merged into Linux 2.6.24 in January 2008.</li>
  <li><strong>August 2008 — LXC.</strong> Linux Containers combined namespaces and cgroups into something you could actually run. It worked, but it was hard to use and there was no easy way to package and share what you had built.</li>
</ul>
<p><strong>March 2013 — Docker.</strong> A small platform-as-a-service company called dotCloud had built internal tooling to run its customers' apps in containers. On 21 March 2013, at the PyCon conference in Santa Clara, its founder Solomon Hykes gave a short lightning talk called "The future of Linux Containers" and showed the tool to the public for the first time; it was released as open source the same month. The recording is still on YouTube (link at the end of this lesson). What made the audience sit up was not a new kernel trick — it was <em>usability</em>: one command to run something, one file format for images, one place to share them. The first versions even used LXC underneath; version 0.9 (2014) replaced it with Docker's own library written in Go.</p>

<h3>After 2013 — from one company's tool to an industry standard</h3>
${slide('dk-00', 8, 'Sau 2013: container thành CHUẨN chung của cả ngành')}
<ul>
  <li><strong>2013</strong> — dotCloud renames itself Docker, Inc.</li>
  <li><strong>9 June 2014 — Docker 1.0</strong>, the first release the company called ready for production.</li>
  <li><strong>22 June 2015 — the Open Container Initiative (OCI).</strong> Docker and other companies announced a vendor-neutral standard for container images and runtimes. Docker donated <code>runc</code>, the low-level program that actually starts a container, as the reference implementation. This is why an image you build with Docker runs unchanged on Podman, containerd, Kubernetes and every cloud.</li>
  <li><strong>29 March 2017 — containerd joins the CNCF.</strong> Docker handed its core runtime to the Cloud Native Computing Foundation, the same home as Kubernetes. The same year it created the Moby project for open development.</li>
  <li><strong>13 November 2019</strong> — Mirantis bought Docker's enterprise business; Docker, Inc. refocused on developers (Desktop, Hub).</li>
  <li><strong>August 2021</strong> — Docker Desktop stopped being free for larger companies (the rule described above). Personal use and education stayed free — which is you.</li>
  <li><strong>May 2022 — Kubernetes 1.24 removes "dockershim".</strong> Kubernetes stopped talking to the Docker Engine and talks to containerd directly. Headlines said "Kubernetes drops Docker"; in practice nothing changed for images — images built with Docker are OCI images and run exactly as before.</li>
</ul>
<p>The lesson of this history for you: the <em>concepts</em> you learn in this course — image, layer, container, registry, volume — are not one company's product features. They are the shared vocabulary of the whole industry, and they will outlive any particular tool.</p>

<h3>Why it was born — the problem it solves</h3>
${slide('dk-00', 9, 'Vì sao nó ra đời: “máy em chạy được mà thầy!”')}
<p>Every developer has said it: <em>"but it works on my machine!"</em>. Here is the most common real cause, measured on the course's Mac. Native Node modules such as <code>sharp</code> or <code>bcrypt</code> are compiled for one specific Node "ABI number":</p>
<pre><code class="language-bash">docker run --rm node:18-alpine node -p process.versions.modules
docker run --rm node:20-alpine node -p process.versions.modules
docker run --rm node:22-alpine node -p process.versions.modules</code></pre>
<div class="out">108
115
127</div>
<p>A module built on a laptop with Node 22 carries the number 127. Copy it to a server running Node 18 (108) and it refuses to load. Nobody wrote a bug; the <em>environment</em> was different, and the environment was never part of what you shipped. Before Docker the answers were long README files ("install exactly Node 22.3, PostgreSQL 16, libvips…"), manual deployment by SSH, and hope. With Docker the Node version is one line at the top of a Dockerfile, and the image that passed your tests is byte-for-byte the image that runs in production. Lesson 0.1 walks through three such failures in detail.</p>

<h3>What Docker is used for</h3>
${slide('dk-00', 10, 'Ai dùng Docker, để làm gì?')}
<table>
  <tr><th>Job</th><th>In plain words</th><th>Where you learn it</th></tr>
  <tr><td>Run databases and services without installing them</td><td>PostgreSQL, MySQL, Redis, MongoDB — one command each, deleted cleanly afterwards</td><td>0.3, Ch 7, 14</td></tr>
  <tr><td>A shared dev environment for a team</td><td>Everyone runs <code>docker compose up</code> and gets the same versions</td><td>Ch 9, 10, 13</td></tr>
  <tr><td>Package your own app</td><td>Write a Dockerfile; the result runs anywhere</td><td>Ch 4–6</td></tr>
  <tr><td>CI (automatic testing)</td><td>GitHub Actions runs tests inside the same image that will be deployed</td><td>Ch 13, 16</td></tr>
  <tr><td>Deploy to a server</td><td>The VPS pulls an image and starts it; rolling back is starting the previous tag</td><td>Ch 11, 16</td></tr>
  <tr><td>Self-host useful tools</td><td>Uptime monitors, automation tools, password managers on a VPS or home machine</td><td>Ch 14</td></tr>
  <tr><td>AI and data work</td><td>Local LLMs, notebooks, GPU workloads in reproducible environments</td><td>Ch 14</td></tr>
  <tr><td>Try technologies safely</td><td>A throwaway Linux, Python or Go in seconds, nothing left behind</td><td>0.3, Ch 14</td></tr>
</table>

<h3>Does it really matter? The numbers</h3>
${slide('dk-00', 11, 'Quan trọng tới mức nào: 71,1% lập trình viên dùng Docker')}
<p>The Stack Overflow Developer Survey 2025 asked which cloud-development tools people had used in the past year; 24,473 people answered that question. <strong>Docker was number one: 71.1% of all respondents and 73.8% of professional developers</strong>. Even among people still <em>learning to code</em>, 52.5% already used it. In the 2024 survey the figure for all respondents was 53.9% — a jump of about 17 points in one year, which the survey itself calls the largest single-year increase of any technology it measured (it also notes that part of the jump comes from regrouping categories in 2025). For comparison, Kubernetes — the "big" orchestration tool you hear about — was at 28.5%.</p>
<p>In plain terms: Docker is no longer a DevOps speciality. It is a basic tool, like Git, that a backend or full-stack developer is simply expected to know.</p>

<h3>What it does for YOU</h3>
${slide('dk-00', 12, 'Docker giúp gì cho BẠN — từ đồ án tới đi làm')}
<div class="kv-grid">
  <div class="kv"><span class="k">SWP391 and other team projects</span><span class="v">Four or five people, three operating systems, one database. With a <code>compose.yaml</code> in the repository, a new teammate clones it, runs one command and has the web app, the API and a database with sample data — the same versions as everyone else. The demo on the lecturer's machine becomes "install Docker, run one command" instead of an afternoon of installing.</span></div>
  <div class="kv"><span class="k">Learning and experimenting</span><span class="v">Want to try MySQL for a database course, MongoDB for a side project, Redis for caching? Each is one command, and deleting the container leaves your laptop clean. No uninstallers, no leftover services eating RAM.</span></div>
  <div class="kv"><span class="k">Internship interviews</span><span class="v">Typical questions: "What is the difference between an image and a container?", "Why does data disappear when a container is removed, and how do you keep it?", "<code>CMD</code> vs <code>ENTRYPOINT</code>?", "How do two containers talk to each other?", "Your container exits with code 137 — what happened?". Every one is answered in this course, with the command that proves it.</span></div>
  <div class="kv"><span class="k">Putting your own product online</span><span class="v">A 5-dollar VPS can run a whole Next.js + API + PostgreSQL + nginx system from one Compose file. Updating is pulling a new image; rolling back is starting the old one. The student project that this course draws its incidents from runs exactly like that.</span></div>
  <div class="kv"><span class="k">Your first job</span><span class="v">Backend, DevOps, data and AI teams all start their projects from a Dockerfile or a Compose file. CI pipelines, Kubernetes and cloud platforms all consume images. Knowing Docker is what lets you read and run a new codebase on day one.</span></div>
</div>

<h3>Where this course takes you</h3>
${slide('dk-00', 13, 'Lộ trình toàn khoá — 17 phần')}
<p>Seventeen parts: this Section 0, then Chapters 1–3 (the model: what a container really is, running containers, images and registries), 4–6 (building images: Dockerfile, layers and cache, small and safe images), 7–10 (data, networking, Compose and a real full stack), 11–12 (production and diagnosis), and the four chapters added in 09/2026 — 13 (Docker in your daily dev loop), 14 (Docker for everything: tools, self-hosting, AI), 15 (advanced: BuildKit, rootless and Podman, Swarm, Kubernetes) and 16 (a capstone project that ends with the 20-question final exam). You do not need all of it for your first team project — the next lesson gives you a two-week minimum route.</p>

<div class="pitfall co-tieu-de"><strong>How beginners start in the wrong place.</strong> A new student installs Docker Desktop, finds a <code>docker-compose.yml</code> for "Node + MySQL" on a blog, runs it, and it works. Two weeks later the MySQL container is recreated after a small change and every table is empty; the port is taken by another project and nothing starts; the image is 1.5 GB and takes six minutes to build. None of these is hard — each is one idea from Chapters 1, 5, 7 or 8 — but without those ideas the student concludes "Docker is fragile" and goes back to installing everything by hand. Copying a working file is fine; <em>not knowing what each line does</em> is what hurts. This course explains every line you will copy.</div>

<h3>🧪 Practice (10 minutes — guaranteed to work)</h3>
<div class="callout ok"><ol>
<li>Open <code>hub.docker.com/_/postgres</code> — the official PostgreSQL image page. Find the list of <em>tags</em> and write down three of them (for example <code>16-alpine</code>). You have just seen a registry.</li>
<li>Watch the first two minutes of Solomon Hykes' 2013 lightning talk (link card below). Note the year, the conference, and the name of the company he worked for.</li>
<li>If Docker is already installed on your machine, open a terminal and run <code>docker run hello-world</code>. If it is not installed yet, skip this step and come back after lesson 0.2.</li>
<li>In one sentence of your own, write the difference between an image and a container. Use the cake-tin picture if it helps.</li>
</ol>
<pre><code class="language-bash">docker run hello-world</code></pre>
<div class="out">Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
58dee6a49ef1: Pull complete
Digest: sha256:5e23090353324d887c48ad5e5c56d294eab81588df9605b07d1afe895f9cc8f8
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
…</div>
<p>(Real output on the course's Mac, Docker Desktop 4.91, 23/09/2026 — the layer ID and digest on your machine may differ; the words "Hello from Docker!" will not.)</p>
<p><strong>Done when:</strong> you have three Postgres tags written down, you can say in which year and at which conference Docker was first shown (2013, PyCon), you have either seen "Hello from Docker!" or scheduled lesson 0.2, and your one-sentence definition does not say "a container is a small virtual machine".</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Image</span><span class="v">A read-only package: the filesystem an app needs plus the command to start it. Built once, run anywhere.</span></div>
  <div class="kv"><span class="k">Container</span><span class="v">One running copy of an image — really a fenced-off process on the host, with its own scratch layer.</span></div>
  <div class="kv"><span class="k">Registry</span><span class="v">A store for images. Docker Hub is the default; GitHub has GHCR; companies run their own.</span></div>
  <div class="kv"><span class="k">Docker Engine / daemon</span><span class="v">The background program (<code>dockerd</code>) that builds images and runs containers. The <code>docker</code> command only talks to it.</span></div>
  <div class="kv"><span class="k">Virtual machine (VM)</span><span class="v">Emulated hardware running its own full operating system and kernel. Heavier and more isolated than a container.</span></div>
  <div class="kv"><span class="k">Kernel</span><span class="v">The core of the operating system that talks to hardware. All containers on a host share one kernel.</span></div>
  <div class="kv"><span class="k">OCI (Open Container Initiative)</span><span class="v">The open standard for image and runtime formats, founded in 2015 — why Docker images run on Podman, containerd and Kubernetes.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Docker is the standard shipping container for software: it packs your app and its whole environment into an image that runs the same on every machine.</li>
<li>An image is the read-only mould; a container is a running copy of it — a fenced-off process, not a small virtual machine.</li>
<li>"Docker" means six things: Engine, CLI, Desktop, Hub, Compose and the company; the formats themselves are the open OCI standard.</li>
<li>Containers grew from chroot (1979), FreeBSD jails (2000), Linux namespaces (2002) and cgroups (2008); Docker (PyCon, 21/03/2013) made them easy to build, share and run.</li>
<li>71.1% of respondents to the Stack Overflow 2025 survey used Docker — number one among cloud-development tools; it is a baseline skill for backend work.</li>
<li>For you it means one-command team environments for SWP391, clean experiments, answers to common interview questions, and a simple way to put your own product online.</li>
</ul>

<a class="link-card" href="https://www.youtube.com/watch?v=wW9CAH9nSLs" target="_blank" rel="noopener">
  <span class="lc-ico">🎙️</span>
  <span class="lc-body"><span class="lc-title">Solomon Hykes — "The future of Linux Containers" (PyCon 2013)</span><span class="lc-sub">The lightning talk where Docker was first shown to the public. Watch it for the practice above.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Docker_(software)" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Wikipedia — Docker (software)</span><span class="lc-sub">dotCloud, PyCon 2013, LXC then libcontainer, OCI, Moby and the 2021 Desktop licence change.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Cgroups" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">Wikipedia — cgroups (and the linked pages on chroot, FreeBSD jail, Linux namespaces, LXC)</span><span class="lc-sub">The kernel features that existed before Docker, with their dates.</span></span>
</a>
<a class="link-card" href="https://opencontainers.org/about/overview/" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Open Container Initiative — overview</span><span class="lc-sub">Who defines the image and runtime standards that every container tool follows.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/get-started/docker-overview/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Docker docs — What is Docker?</span><span class="lc-sub">The official overview: client, daemon, images, containers and registries.</span></span>
</a>
<a class="link-card" href="https://survey.stackoverflow.co/2025/technology" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Stack Overflow Developer Survey 2025 — Technology</span><span class="lc-sub">"Cloud development": Docker 71.1% of all respondents, 73.8% of professional developers.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/subscription/desktop-license/" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">Docker Desktop licence agreement</span><span class="lc-sub">Who can use Docker Desktop free (personal, education, small business) and who must pay.</span></span>
</a>
<p class="note-ct"><strong>Next:</strong> lesson 2 of "Start here" — real incidents that happened without (and with careless) containers, the situations student teams hit every semester, and a study plan that keeps you going to the end.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Chào bạn. Trước lệnh docker đầu tiên, hãy biết mình đang học cái gì — và vì sao đáng học</h2>
<p class="lead">Chào mừng bạn. Có thể bạn chưa từng đụng tới Docker. Cũng có thể bạn đã đụng rồi — chép một file <code>docker-compose.yml</code> từ bài hướng dẫn nào đó, gõ <code>docker compose up</code>, nó chạy, và bạn không hiểu vì sao nó chạy. Hoặc nó không chạy, một bức tường chữ đỏ hiện ra, và bạn đóng terminal. Kiểu nào thì bài này cũng viết cho bạn. Ở đây không có gì phải học thuộc. Trong khoảng hai mươi lăm phút, bạn sẽ biết Docker là gì, KHÔNG phải là gì, ra đời từ đâu, vì sao cả ngành phần mềm dùng nó chỉ trong vài năm, và nó sẽ giúp gì cho đồ án nhóm, kỳ thực tập và công việc đầu tiên của bạn.</p>
<p>Bài này và bài kế tiếp là cửa vào của cả khoá. Bài thứ hai kể những chuyện có thật xảy ra khi <em>không có</em> Docker (và khi dùng Docker ẩu), rồi đưa bạn một kế hoạch học để không nản giữa chừng. Sau đó bài 0.1 đào sâu ba cú hỏng mà Docker chấm dứt, 0.2 cài đặt và giải thích bạn vừa cài những gì, và 0.3 chạy một web server cùng một cơ sở dữ liệu ngay trên máy bạn trong năm phút.</p>

<h3>Docker là gì — nói bằng hình ảnh đời thường trước</h3>
${slide('dk-00', 3, 'Docker là “thùng hàng tiêu chuẩn” cho phần mềm')}
<p>Tạm quên định nghĩa trong sách. Hãy hình dung một bến cảng năm 1950. Mọi con tàu được bốc xếp bằng tay: thùng phuy, bao tải, đàn piano, két rượu — mỗi món một hình dạng, mỗi cảng đóng gói một kiểu. Bốc xong một con tàu mất nhiều ngày; hàng thì vỡ, thì thất lạc. Rồi ngày 26/4/1956, một ông chủ công ty vận tải tên Malcom McLean cho con tàu chở dầu cải hoán <em>Ideal-X</em> đi từ Newark tới Houston, chở 58 chiếc thùng thép giống hệt nhau. Từ 1968 tới 1970, kích thước những chiếc thùng đó được chuẩn hoá quốc tế. Từ đó trở đi, bên trong thùng chứa gì không còn quan trọng: mọi cần cẩu, mọi con tàu, mọi xe tải trên thế giới đều bốc được nó theo cùng một cách, không cần mở ra.</p>
<p>Phần mềm cũng mắc đúng bài toán đó, và vẫn mắc ở bất cứ đâu không dùng Docker. Ứng dụng của bạn không chỉ là mã nguồn: nó là mã nguồn <em>cộng</em> một phiên bản Node hay Java cụ thể, cộng các thư viện hệ thống, cộng cấu hình, cộng một cơ sở dữ liệu ở một phiên bản nào đó. Mỗi cái máy nó đặt chân tới — laptop của bạn, laptop Windows của bạn cùng nhóm, máy của thầy lúc chấm demo, máy chủ — đều có một bộ những thứ đó hơi khác nhau. <strong>Docker chính là chiếc thùng hàng tiêu chuẩn cho phần mềm</strong>: bạn đóng gói ứng dụng cùng mọi thứ nó cần vào một chiếc thùng, và máy nào có Docker cũng chạy chiếc thùng đó theo cùng một cách, không cần biết bên trong có gì.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">📦 Thùng hàng container</span><span class="v">Đóng gói một lần, cần cẩu nào, tàu nào, xe tải nào cũng chở được. Trong Docker, chiếc thùng đã đóng gói gọi là <strong>image</strong> (ảnh), còn “cần cẩu nào cũng được” nghĩa là laptop nào, máy CI nào, máy chủ nào có cài Docker cũng được.</span></div>
  <div class="kv"><span class="k">🍰 Khuôn bánh và những chiếc bánh</span><span class="v">Một cái khuôn, đổ bao nhiêu bánh cũng được, mỗi chiếc ăn riêng. Cái khuôn là <strong>image</strong>; mỗi chiếc bánh là một <strong>container</strong> — một bản đang chạy mà bạn dùng rồi bỏ, còn cái khuôn thì vẫn nguyên.</span></div>
  <div class="kv"><span class="k">🏠 Căn hộ cho thuê có sẵn nội thất</span><span class="v">Bạn dọn vào với một chiếc vali; bếp, giường, điện nước đã có sẵn và giống hệt nhau ở mọi căn cùng loại. Một container khởi động với cả môi trường đã sẵn sàng — bạn chỉ mang dữ liệu của mình vào.</span></div>
</div>
<p>Giờ tới định nghĩa chuẩn, và bạn sẽ thấy nó dễ hiểu:</p>
<ul>
  <li><strong>Image</strong> (ảnh) — một gói chỉ-đọc chứa một hệ thống file (những file hệ điều hành mà ứng dụng cần, bộ chạy của ngôn ngữ, mã của bạn) cộng một ghi chú nói phải chạy lệnh gì. Dựng một lần, đem đi đâu cũng được.</li>
  <li><strong>Container</strong> — một bản đang chạy của một image. Bên dưới, nó là một tiến trình (process — chương trình đang chạy) bình thường của máy, bị rào lại để chỉ thấy file riêng, mạng riêng và tiến trình riêng của nó (Chương 1 chỉ ra chính xác rào bằng gì).</li>
  <li><strong>Docker</strong> — bộ công cụ dựng image, lưu và chia sẻ image, và chạy container từ image.</li>
</ul>
<div class="callout ok"><strong>Một câu để nhớ:</strong> Docker đóng gói ứng dụng cùng toàn bộ môi trường của nó vào một image, rồi chạy image đó thành một container cư xử giống hệt nhau trên mọi máy — laptop của bạn, của bạn cùng nhóm, máy CI và máy chủ production.</div>

<h3>Image và container — cái khuôn và thứ đổ ra từ khuôn</h3>
${slide('dk-00', 4, 'Image là cái khuôn, container là bản đang chạy từ khuôn đó')}
<p>Nếu bạn đã học Java hay C#, bạn biết sẵn quan hệ này rồi: image là một <code>class</code>, container là một đối tượng tạo bằng <code>new</code>. Một image khởi chạy được mười container; mỗi container có vùng nháp riêng, và xoá container không đụng gì tới image. Bạn có image theo hai cách: <strong>kéo về</strong> (pull) một image làm sẵn từ một <strong>registry</strong> (kho ảnh — Docker Hub là kho mặc định, có image “chính thức” cho <code>nginx</code>, <code>postgres</code>, <code>node</code>, <code>python</code>…), hoặc <strong>tự dựng</strong> (build) image của mình từ một file công thức tên là <code>Dockerfile</code> (Chương 4). Ba động từ gánh gần hết công việc hằng ngày: <code>docker pull</code>, <code>docker build</code>, <code>docker run</code>.</p>

<h3>“Docker” là cả một họ — đừng nhầm sáu cái tên</h3>
${slide('dk-00', 5, '“Docker” là cả một họ — đừng nhầm sáu cái tên')}
<p>Phần lớn cái rối của người mới đến từ việc một chữ mang sáu nghĩa. Khi ai đó nói “cài Docker đi” hay “Docker chậm quá”, hãy tự hỏi họ đang nói tới cái nào trong số này:</p>
<table>
  <tr><th>Tên</th><th>Thật ra là gì</th><th>Bạn gặp nó ở đâu</th></tr>
  <tr><td><strong>Docker Engine</strong></td><td>Chương trình chạy nền (<code>dockerd</code> — daemon, tiến trình nền) thật sự tạo và chạy container. Miễn phí, mã nguồn mở, chạy trên Linux.</td><td>Mọi máy chủ; bên trong Docker Desktop</td></tr>
  <tr><td><strong>Lệnh <code>docker</code></strong> (CLI — giao diện dòng lệnh)</td><td>Câu lệnh bạn gõ. Nó chỉ là <em>máy khách</em> (client): gửi yêu cầu tới Engine qua một socket (cổng giao tiếp nội bộ) rồi in câu trả lời ra.</td><td>Terminal của bạn</td></tr>
  <tr><td><strong>Docker Desktop</strong></td><td>Ứng dụng cho macOS và Windows: một máy ảo Linux nhỏ có Engine bên trong, cộng giao diện đồ hoạ. Miễn phí cho cá nhân, giáo dục và doanh nghiệp nhỏ; công ty từ 250 nhân viên trở lên hoặc doanh thu từ 10 triệu USD/năm trở lên phải mua gói trả phí (tính đến 09/2026).</td><td>Laptop Mac hoặc Windows của bạn</td></tr>
  <tr><td><strong>Docker Hub</strong></td><td>Kho ảnh công cộng mặc định — một trang web lưu image.</td><td><code>hub.docker.com</code>, mọi lần <code>docker pull</code></td></tr>
  <tr><td><strong>Docker Compose</strong></td><td>Công cụ khởi động cả một hệ thống (web + API + cơ sở dữ liệu) từ một file YAML.</td><td><code>docker compose up</code>, Chương 9</td></tr>
  <tr><td><strong>Docker, Inc.</strong></td><td>Công ty. Trước năm 2013 tên là dotCloud. Công ty này <em>không</em> sở hữu “container”: định dạng image và cách chạy container là một chuẩn mở (OCI).</td><td>Tin tức, giấy phép</td></tr>
</table>
<div class="callout warn"><strong>Hiểu lầm số 1 của người mới: “Docker là một cái máy ảo nhỏ”.</strong> Nó khiến người ta SSH vào container, <code>apt install</code> bằng tay bên trong một container đang chạy, rồi mất sạch khi container được tạo lại. Container là một <em>tiến trình</em> bị rào lại, và những gì bên trong nó đến từ image. Muốn thứ gì nằm trong đó lâu dài thì sửa <em>công thức</em> (Dockerfile) rồi dựng lại — đừng bao giờ sửa bản đang chạy.</div>

<h3>Container và máy ảo — đặt cạnh nhau</h3>
${slide('dk-00', 6, 'Container KHÔNG phải máy ảo thu nhỏ')}
<p>Một máy ảo (virtual machine — VirtualBox, VMware, những máy ảo mà nhà cung cấp đám mây cho thuê) giả làm cả một chiếc máy tính: phần cứng ảo, rồi bên trên là cả một hệ điều hành khách với <strong>nhân</strong> (kernel — phần lõi của hệ điều hành, nói chuyện với phần cứng) riêng phải khởi động. Container bỏ qua tất cả những thứ đó. Nó dùng thẳng nhân của <strong>máy chủ</strong> (host — máy thật đang chạy Docker); chỉ những file nằm trên nhân (thư viện, bộ chạy ngôn ngữ, ứng dụng) là đến từ image. Riêng khác biệt đó giải thích gần hết các con số trong bảng này:</p>
<table>
  <tr><th></th><th>Máy ảo</th><th>Container</th></tr>
  <tr><td>Ảo hoá cái gì</td><td>Phần cứng — một hệ điều hành khách khởi động trên đó</td><td>Không gì cả: một tiến trình bị giới hạn tầm nhìn trên máy chủ</td></tr>
  <tr><td>Khởi động</td><td>Hàng chục giây tới vài phút</td><td>Thường dưới một giây</td></tr>
  <tr><td>Kích thước ảnh thường gặp</td><td>Vài GB</td><td>Vài chục tới vài trăm MB</td></tr>
  <tr><td>Bộ nhớ</td><td>Giữ trước cho cả hệ điều hành khách</td><td>Chỉ phần tiến trình thật sự dùng</td></tr>
  <tr><td>Nhân hệ điều hành</td><td>Của riêng nó</td><td>Dùng chung với máy chủ (trên Mac là nhân của máy ảo Docker Desktop)</td></tr>
  <tr><td>Mức cô lập</td><td>Mạnh — chuẩn để chạy mã của người lạ</td><td>Mỏng hơn (Chương 1 và 6 chỉ ra nó dừng ở đâu)</td></tr>
  <tr><td>Chạy Windows trên máy Linux?</td><td>Được</td><td>Không — container Linux cần nhân Linux</td></tr>
</table>
<p>Hai thứ này không phải đối thủ. Máy chủ đám mây thường chính là máy ảo, và Docker chạy <em>bên trong</em> chúng. Trên máy Mac, bản thân Docker Desktop là một máy ảo nhỏ có container bên trong. Bài 0.2 quay lại chuyện này, vì nó giải thích vì sao Mac cho Docker thấy ít RAM hơn máy thật có.</p>

<h3>Docker ra đời thế nào — 45 năm dọn đường</h3>
${slide('dk-00', 7, '45 năm dọn đường: từ chroot 1979 tới Docker 2013')}
<p>Docker không phát minh ra ý tưởng cô lập một tiến trình. Nó đứng trên một chuỗi dài những tính năng của hệ điều hành, mỗi tính năng giải một mảnh của câu đố:</p>
<ul>
  <li><strong>1979 — <code>chroot</code>.</strong> Được thêm vào trong lúc phát triển Unix phiên bản 7: nó đổi thư mục mà một tiến trình coi là thư mục gốc <code>/</code>. Một tiến trình có thể được cấp một hệ thống file nhỏ của riêng nó. Tới giờ đó vẫn là cái lõi của một image.</li>
  <li><strong>Tháng 3/2000 — FreeBSD jails</strong> (nhà tù). FreeBSD 4.0 (phát hành 14/3/2000) mở rộng ý tưởng: một “jail” còn giới hạn cả mạng, người dùng và tiến trình, để một công ty cho thuê hosting giao cho mỗi khách một chiếc hộp trông như cả một cái máy.</li>
  <li><strong>2002 — namespace đầu tiên của Linux.</strong> Linux 2.4.19 thêm mount namespace (không gian tên cho điểm gắn ổ): một tiến trình có tầm nhìn riêng về các hệ thống file được gắn. Thập kỷ sau đó thêm dần các loại khác (số hiệu tiến trình, mạng, tên máy, người dùng — user namespace được coi là hoàn chỉnh ở Linux 3.8, năm 2013).</li>
  <li><strong>Tháng 2/2004 — Solaris Zones.</strong> Phiên bản cùng ý tưởng của hãng Sun xuất hiện trong bản beta Solaris 10, và trong bản chính thức năm 2005.</li>
  <li><strong>2006 → tháng 1/2008 — cgroups</strong> (control groups — nhóm kiểm soát). Kỹ sư Google khởi xướng “process containers” năm 2006 để giới hạn một nhóm tiến trình được dùng bao nhiêu CPU và bộ nhớ; đổi tên thành “control groups”, nó được nhập vào Linux 2.6.24 tháng 1/2008.</li>
  <li><strong>Tháng 8/2008 — LXC</strong> (Linux Containers). Ghép namespace và cgroup thành một thứ chạy được thật. Nó chạy được, nhưng khó dùng, và không có cách nào dễ để đóng gói rồi chia sẻ thứ bạn đã dựng.</li>
</ul>
<p><strong>Tháng 3/2013 — Docker.</strong> Một công ty nhỏ cung cấp nền tảng chạy ứng dụng (platform-as-a-service) tên dotCloud đã tự viết công cụ nội bộ để chạy ứng dụng của khách hàng trong container. Ngày 21/3/2013, tại hội nghị PyCon ở Santa Clara (Mỹ), nhà sáng lập Solomon Hykes có một bài nói ngắn (lightning talk) tên “The future of Linux Containers” (Tương lai của container Linux) và lần đầu cho công chúng xem công cụ đó; nó được mở mã nguồn ngay trong tháng. Bản ghi hình vẫn còn trên YouTube (thẻ liên kết cuối bài). Thứ khiến khán giả chú ý không phải một mánh mới của nhân Linux — mà là <em>sự dễ dùng</em>: một lệnh để chạy một thứ, một định dạng file cho image, một nơi để chia sẻ chúng. Các bản đầu tiên thậm chí còn dùng LXC bên dưới; bản 0.9 (2014) thay nó bằng thư viện riêng của Docker viết bằng Go.</p>

<h3>Sau 2013 — từ công cụ của một công ty thành chuẩn chung của cả ngành</h3>
${slide('dk-00', 8, 'Sau 2013: container thành CHUẨN chung của cả ngành')}
<ul>
  <li><strong>2013</strong> — dotCloud đổi tên thành Docker, Inc.</li>
  <li><strong>9/6/2014 — Docker 1.0</strong>, bản đầu tiên công ty tuyên bố đủ ổn cho production (môi trường chạy thật).</li>
  <li><strong>22/6/2015 — Open Container Initiative (OCI).</strong> Docker cùng nhiều công ty khác công bố một chuẩn trung lập cho image và cách chạy container. Docker tặng <code>runc</code> — chương trình cấp thấp thật sự khởi động container — làm bản cài đặt mẫu. Đó là lý do một image bạn dựng bằng Docker chạy nguyên vẹn trên Podman, containerd, Kubernetes và mọi đám mây.</li>
  <li><strong>29/3/2017 — containerd gia nhập CNCF.</strong> Docker trao phần lõi chạy container cho Cloud Native Computing Foundation, cũng là “nhà” của Kubernetes. Cùng năm đó Docker lập dự án Moby để phát triển mở.</li>
  <li><strong>13/11/2019</strong> — Mirantis mua mảng doanh nghiệp của Docker; Docker, Inc. tập trung lại vào lập trình viên (Desktop, Hub).</li>
  <li><strong>Tháng 8/2021</strong> — Docker Desktop thôi miễn phí cho công ty lớn (quy tắc ở trên). Dùng cá nhân và giáo dục vẫn miễn phí — tức là bạn.</li>
  <li><strong>Tháng 5/2022 — Kubernetes 1.24 bỏ “dockershim”.</strong> Kubernetes thôi nói chuyện với Docker Engine mà nói thẳng với containerd. Báo chí giật tít “Kubernetes bỏ Docker”; thực tế image không đổi gì — image dựng bằng Docker là image OCI và chạy y như trước.</li>
</ul>
<p>Bài học của lịch sử này dành cho bạn: những <em>khái niệm</em> bạn học trong khoá — image, tầng (layer), container, registry, volume — không phải tính năng sản phẩm của một công ty. Chúng là từ vựng chung của cả ngành, và sẽ sống lâu hơn bất cứ công cụ cụ thể nào.</p>

<h3>Vì sao nó ra đời — bài toán nó giải</h3>
${slide('dk-00', 9, 'Vì sao nó ra đời: “máy em chạy được mà thầy!”')}
<p>Lập trình viên nào cũng từng nói câu đó: <em>“máy em chạy được mà!”</em>. Đây là nguyên nhân thật hay gặp nhất, đo trên máy Mac của khoá. Các mô-đun native (mô-đun viết bằng C/C++ phải biên dịch) của Node như <code>sharp</code> hay <code>bcrypt</code> được biên dịch cho đúng một “số ABI” của Node:</p>
<pre><code class="language-bash">docker run --rm node:18-alpine node -p process.versions.modules
docker run --rm node:20-alpine node -p process.versions.modules
docker run --rm node:22-alpine node -p process.versions.modules</code></pre>
<div class="out">108
115
127</div>
<p>Một mô-đun dựng trên laptop Node 22 mang số 127. Chép nó sang máy chủ chạy Node 18 (108) là nó từ chối nạp. Không ai viết ra con bọ nào cả; <em>môi trường</em> khác nhau, và môi trường chưa bao giờ nằm trong thứ bạn đem đi. Trước Docker, câu trả lời là những file README dài dằng dặc (“cài đúng Node 22.3, PostgreSQL 16, libvips…”), deploy bằng tay qua SSH, và cầu may. Có Docker, phiên bản Node là một dòng ở đầu Dockerfile, và image đã qua được test của bạn giống tới từng byte với image chạy trên production. Bài 0.1 đi qua chi tiết ba cú hỏng kiểu này.</p>
<p>Để ý: ba lệnh trên chạy ba phiên bản Node khác nhau trên <em>cùng một</em> máy, không cài Node nào, không dùng nvm, và không để lại gì sau khi chạy xong (<code>--rm</code>). Đó là một ví dụ nhỏ của chữ “cô lập” mà bạn sẽ gặp suốt khoá.</p>

<h3>Docker dùng để làm gì</h3>
${slide('dk-00', 10, 'Ai dùng Docker, để làm gì?')}
<table>
  <tr><th>Việc</th><th>Nói nôm na</th><th>Học ở</th></tr>
  <tr><td>Chạy CSDL, dịch vụ mà không phải cài</td><td>PostgreSQL, MySQL, Redis, MongoDB — mỗi thứ một lệnh, xoá là sạch</td><td>0.3, Ch 7, 14</td></tr>
  <tr><td>Môi trường dev chung cho cả nhóm</td><td>Ai cũng <code>docker compose up</code> và có cùng phiên bản</td><td>Ch 9, 10, 13</td></tr>
  <tr><td>Đóng gói ứng dụng của chính bạn</td><td>Viết Dockerfile; kết quả chạy ở đâu cũng được</td><td>Ch 4–6</td></tr>
  <tr><td>CI (kiểm thử tự động)</td><td>GitHub Actions chạy test bên trong đúng image sẽ được deploy</td><td>Ch 13, 16</td></tr>
  <tr><td>Deploy lên máy chủ</td><td>VPS kéo image về rồi chạy; quay lui là chạy lại tag cũ</td><td>Ch 11, 16</td></tr>
  <tr><td>Tự host công cụ hữu ích</td><td>Theo dõi uptime, tự động hoá, quản lý mật khẩu trên VPS hoặc máy nhà</td><td>Ch 14</td></tr>
  <tr><td>AI và dữ liệu</td><td>Mô hình ngôn ngữ chạy cục bộ, notebook, việc dùng GPU trong môi trường tái lập được</td><td>Ch 14</td></tr>
  <tr><td>Thử công nghệ an toàn</td><td>Một Linux, Python hay Go vứt đi trong vài giây, không để lại gì</td><td>0.3, Ch 14</td></tr>
</table>

<h3>Có thật sự quan trọng không? Nhìn con số</h3>
${slide('dk-00', 11, 'Quan trọng tới mức nào: 71,1% lập trình viên dùng Docker')}
<p>Khảo sát lập trình viên của Stack Overflow năm 2025 hỏi mọi người đã dùng công cụ phát triển đám mây nào trong năm qua; có 24.473 người trả lời câu này. <strong>Docker đứng số một: 71,1% mọi người trả lời và 73,8% lập trình viên chuyên nghiệp</strong>. Ngay cả trong nhóm <em>đang học lập trình</em>, 52,5% đã dùng nó. Ở khảo sát 2024, con số cho mọi người trả lời là 53,9% — tăng khoảng 17 điểm phần trăm trong một năm, mà chính khảo sát gọi là mức tăng một năm lớn nhất của mọi công nghệ họ đo (họ cũng ghi rằng một phần mức tăng đến từ việc gộp lại các nhóm công nghệ năm 2025). Để so sánh, Kubernetes — công cụ điều phối “to tát” mà bạn hay nghe — ở mức 28,5%.</p>
<p>Nói gọn: Docker không còn là chuyên môn riêng của dân DevOps. Nó là công cụ cơ bản, giống Git, mà một lập trình viên backend hay full-stack mặc nhiên được kỳ vọng là biết.</p>

<h3>Docker giúp gì cho chính BẠN</h3>
${slide('dk-00', 12, 'Docker giúp gì cho BẠN — từ đồ án tới đi làm')}
<div class="kv-grid">
  <div class="kv"><span class="k">SWP391 và các đồ án nhóm</span><span class="v">Bốn, năm người, ba hệ điều hành, một cơ sở dữ liệu. Có một file <code>compose.yaml</code> trong kho mã, một thành viên mới clone về, chạy một lệnh là có web, API và cơ sở dữ liệu kèm dữ liệu mẫu — cùng phiên bản với mọi người. Buổi demo trên máy thầy trở thành “cài Docker, chạy một lệnh” thay vì cả buổi chiều cài đặt.</span></div>
  <div class="kv"><span class="k">Học và thử nghiệm</span><span class="v">Muốn thử MySQL cho môn cơ sở dữ liệu, MongoDB cho dự án phụ, Redis để làm cache? Mỗi thứ một lệnh, và xoá container là laptop sạch trở lại. Không trình gỡ cài đặt, không dịch vụ thừa ngốn RAM chạy ngầm.</span></div>
  <div class="kv"><span class="k">Phỏng vấn thực tập</span><span class="v">Câu hay gặp: “image khác container thế nào?”, “vì sao xoá container thì mất dữ liệu, giữ lại bằng cách nào?”, “<code>CMD</code> khác <code>ENTRYPOINT</code> ra sao?”, “hai container nói chuyện với nhau thế nào?”, “container thoát với mã 137 là chuyện gì?”. Câu nào cũng được trả lời trong khoá này, kèm lệnh chứng minh.</span></div>
  <div class="kv"><span class="k">Đưa sản phẩm của mình lên mạng</span><span class="v">Một VPS 5 USD chạy được cả hệ thống Next.js + API + PostgreSQL + nginx từ một file Compose. Cập nhật là kéo image mới; quay lui là chạy lại image cũ. Chính dự án sinh viên mà khoá này lấy các sự cố làm ví dụ đang chạy đúng như vậy.</span></div>
  <div class="kv"><span class="k">Công việc đầu tiên</span><span class="v">Các nhóm backend, DevOps, dữ liệu và AI đều bắt đầu dự án từ một Dockerfile hoặc một file Compose. Pipeline CI, Kubernetes và các nền tảng đám mây đều “ăn” image. Biết Docker là thứ cho phép bạn đọc hiểu và chạy được một kho mã lạ ngay ngày đầu đi làm.</span></div>
</div>

<h3>Khoá này sẽ đưa bạn đi tới đâu</h3>
${slide('dk-00', 13, 'Lộ trình toàn khoá — 17 phần')}
<p>Mười bảy phần: Mục 0 này, rồi Chương 1–3 (mô hình: container thật ra là gì, chạy container, image và registry), 4–6 (dựng image: Dockerfile, tầng và cache, image nhỏ và an toàn), 7–10 (dữ liệu, mạng, Compose và một hệ thống đầy đủ thật), 11–12 (production và chẩn đoán sự cố), và bốn chương thêm vào tháng 9/2026 — 13 (Docker trong vòng lặp phát triển hằng ngày), 14 (Docker cho mọi việc: công cụ, tự host, AI), 15 (nâng cao: BuildKit, rootless và Podman, Swarm, Kubernetes) và 16 (dự án cuối khoá, kết thúc bằng bài thi 20 câu). Bạn không cần học hết mới làm được đồ án nhóm đầu tiên — bài kế tiếp đưa bạn lộ trình tối thiểu hai tuần.</p>

<div class="pitfall co-tieu-de"><strong>Người mới hay bắt đầu sai chỗ thế này.</strong> Một bạn cài Docker Desktop, tìm được file <code>docker-compose.yml</code> “Node + MySQL” trên một blog, chạy thử, và nó chạy. Hai tuần sau, container MySQL được tạo lại sau một thay đổi nhỏ và mọi bảng trống trơn; cổng bị một dự án khác chiếm nên không gì khởi động; image nặng 1,5 GB và dựng mất sáu phút. Không cái nào khó — mỗi cái chỉ là một ý của Chương 1, 5, 7 hay 8 — nhưng thiếu những ý đó, bạn ấy kết luận “Docker mong manh quá” và quay về cài tay mọi thứ. Chép một file chạy được thì không sao; <em>không biết từng dòng làm gì</em> mới là thứ gây đau. Khoá này giải thích từng dòng bạn sẽ chép.</div>

<h3>🧪 Thực hành (10 phút — chắc chắn làm được)</h3>
<div class="callout ok"><ol>
<li>Mở <code>hub.docker.com/_/postgres</code> — trang image PostgreSQL chính thức. Tìm danh sách <em>tag</em> (nhãn phiên bản) và ghi lại ba cái (ví dụ <code>16-alpine</code>). Bạn vừa nhìn thấy một registry.</li>
<li>Xem hai phút đầu bài nói năm 2013 của Solomon Hykes (thẻ liên kết bên dưới). Ghi lại năm, tên hội nghị và tên công ty ông làm lúc đó.</li>
<li>Nếu máy bạn đã cài Docker, mở terminal và chạy <code>docker run hello-world</code>. Nếu chưa cài, bỏ qua bước này và quay lại sau bài 0.2.</li>
<li>Tự viết một câu, bằng lời của bạn, nói image khác container ở đâu. Dùng hình ảnh khuôn bánh nếu thấy dễ.</li>
</ol>
<pre><code class="language-bash">docker run hello-world</code></pre>
<div class="out">Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
58dee6a49ef1: Pull complete
Digest: sha256:5e23090353324d887c48ad5e5c56d294eab81588df9605b07d1afe895f9cc8f8
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
…</div>
<p>(Output thật trên máy Mac của khoá, Docker Desktop 4.91, 23/09/2026 — mã tầng và digest trên máy bạn có thể khác; dòng “Hello from Docker!” thì không.)</p>
<p><strong>Đạt khi:</strong> bạn đã ghi ba tag của Postgres, nói được Docker ra mắt năm nào ở hội nghị nào (2013, PyCon), đã thấy “Hello from Docker!” hoặc đã hẹn giờ học bài 0.2, và câu định nghĩa của bạn KHÔNG nói “container là một máy ảo nhỏ”.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Image (ảnh)</span><span class="v">Gói chỉ-đọc: hệ thống file ứng dụng cần cộng lệnh để khởi chạy. Dựng một lần, chạy ở đâu cũng được.</span></div>
  <div class="kv"><span class="k">Container (thùng chứa)</span><span class="v">Một bản đang chạy của image — thật ra là một tiến trình bị rào lại trên máy chủ, có tầng nháp riêng.</span></div>
  <div class="kv"><span class="k">Registry (kho ảnh)</span><span class="v">Nơi lưu image. Docker Hub là kho mặc định; GitHub có GHCR; công ty thường tự dựng kho riêng.</span></div>
  <div class="kv"><span class="k">Docker Engine / daemon (tiến trình nền)</span><span class="v">Chương trình chạy nền (<code>dockerd</code>) dựng image và chạy container. Lệnh <code>docker</code> chỉ nói chuyện với nó.</span></div>
  <div class="kv"><span class="k">Virtual machine — VM (máy ảo)</span><span class="v">Phần cứng giả lập chạy cả một hệ điều hành và nhân riêng. Nặng hơn và cô lập mạnh hơn container.</span></div>
  <div class="kv"><span class="k">Kernel (nhân)</span><span class="v">Lõi của hệ điều hành, nói chuyện với phần cứng. Mọi container trên một máy dùng chung một nhân.</span></div>
  <div class="kv"><span class="k">OCI — Open Container Initiative (Sáng kiến container mở)</span><span class="v">Chuẩn mở cho định dạng image và cách chạy container, lập năm 2015 — lý do image Docker chạy được trên Podman, containerd, Kubernetes.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Docker là chiếc thùng hàng tiêu chuẩn cho phần mềm: đóng gói ứng dụng cùng toàn bộ môi trường vào một image chạy giống nhau trên mọi máy.</li>
<li>Image là cái khuôn chỉ-đọc; container là một bản đang chạy của nó — một tiến trình bị rào lại, không phải máy ảo nhỏ.</li>
<li>“Docker” mang sáu nghĩa: Engine, CLI, Desktop, Hub, Compose và công ty; còn định dạng thì là chuẩn mở OCI.</li>
<li>Container lớn lên từ chroot (1979), FreeBSD jails (2000), namespace Linux (2002) và cgroups (2008); Docker (PyCon, 21/3/2013) làm chúng dễ dựng, dễ chia sẻ, dễ chạy.</li>
<li>71,1% người trả lời khảo sát Stack Overflow 2025 dùng Docker — số một trong nhóm công cụ phát triển đám mây; đó là kỹ năng nền của nghề backend.</li>
<li>Với bạn: môi trường nhóm chạy bằng một lệnh cho SWP391, thử nghiệm sạch sẽ, câu trả lời cho những câu phỏng vấn hay gặp, và một cách đơn giản để đưa sản phẩm của mình lên mạng.</li>
</ul>

<a class="link-card" href="https://www.youtube.com/watch?v=wW9CAH9nSLs" target="_blank" rel="noopener">
  <span class="lc-ico">🎙️</span>
  <span class="lc-body"><span class="lc-title">Solomon Hykes — “The future of Linux Containers” (PyCon 2013)</span><span class="lc-sub">Bài nói ngắn nơi Docker lần đầu ra mắt công chúng. Xem nó cho bài thực hành phía trên.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Docker_(software)" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Wikipedia — Docker (software)</span><span class="lc-sub">dotCloud, PyCon 2013, từ LXC sang libcontainer, OCI, Moby và thay đổi giấy phép Desktop 2021.</span></span>
</a>
<a class="link-card" href="https://en.wikipedia.org/wiki/Cgroups" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">Wikipedia — cgroups (và các trang chroot, FreeBSD jail, Linux namespaces, LXC)</span><span class="lc-sub">Những tính năng của nhân có trước Docker, kèm mốc thời gian.</span></span>
</a>
<a class="link-card" href="https://opencontainers.org/about/overview/" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Open Container Initiative — tổng quan</span><span class="lc-sub">Ai đặt ra chuẩn image và chuẩn chạy container mà mọi công cụ đều theo.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/get-started/docker-overview/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Tài liệu Docker — What is Docker?</span><span class="lc-sub">Bài tổng quan chính thức: client, daemon, image, container và registry.</span></span>
</a>
<a class="link-card" href="https://survey.stackoverflow.co/2025/technology" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Stack Overflow Developer Survey 2025 — Technology</span><span class="lc-sub">Mục “Cloud development”: Docker 71,1% mọi người trả lời, 73,8% lập trình viên chuyên nghiệp.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/subscription/desktop-license/" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">Giấy phép Docker Desktop</span><span class="lc-sub">Ai được dùng Docker Desktop miễn phí (cá nhân, giáo dục, doanh nghiệp nhỏ) và ai phải trả phí.</span></span>
</a>
<p class="note-ct"><strong>Bài kế tiếp:</strong> “Bắt đầu tại đây” phần 2 — những sự cố có thật khi không có (hoặc dùng ẩu) container, những tình huống nhóm sinh viên gặp mỗi học kỳ, và một kế hoạch học giúp bạn đi tới cùng.</p>
</div>
`,
    },
    /* ─────────────────── 0.6 · BẮT ĐẦU TẠI ĐÂY (2/2) ─────────────────── */
    {
      title: 'Start here (2/2) — Life without it: real disasters, and how to learn without giving up|||Bắt đầu tại đây (2/2) — Khi không có nó: những sự cố thật, và cách học để không bỏ cuộc',
      slug: 'dk-0-6-bat-dau-khi-khong-co',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một tuần đồ án nhóm không có Docker, ba sự cố có thật đã kiểm nguồn (Knight Capital 2012, sâu Graboid 2019, 17 image độc trên Docker Hub), bốn sự cố thật của một dự án sinh viên chạy Docker, vì sao người mới hay bỏ, cách đọc lỗi Docker từ cuối, lộ trình tối thiểu hai tuần và nhịp một buổi học.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>Life without it — real incidents, and how to learn Docker without giving up</h2>
<p class="lead">In the previous lesson you met Docker. This one answers the two questions every beginner quietly asks: "Is life really that bad without it?" and "Will I actually manage to learn this, or will I quit after the first wall of red error text?" First the stories — some documented by regulators and security researchers, some from the student project this course takes its examples from, some so typical of student teams that you have probably lived one already. Then a plan.</p>

<h3>One week of a team project without Docker</h3>
${slide('dk-00', 14, 'Một tuần đồ án nhóm: không Docker vs có Docker (minh hoạ)')}
<p><em>(An illustrative scenario, not a real team.)</em> Monday: An installs PostgreSQL 16 on her Mac, Bình installs version 14 on Ubuntu because that is what <code>apt</code> gave him, and Chi, on Windows, uses SQL Server "because that is what we used last semester". Tuesday: a migration that runs perfectly on An's machine fails on Bình's with a syntax error — a feature his older version does not have. They lose the evening. Wednesday: Chi's build script breaks on Windows paths with <code>\\</code>. Thursday: somebody finally gets everything running on one laptop and nobody dares touch it. Friday, demo day: the lecturer's machine has no Redis, the session code crashes, and the committee watches a white page.</p>
<p>Now the same week with Docker: a <code>compose.yaml</code> in the repository pins <code>postgres:16-alpine</code> and <code>redis:7-alpine</code>; every machine runs <code>docker compose up</code> and gets the same versions and the same sample data; Chi works inside WSL2, which is the same Linux as everyone else; and the demo has already run in CI on a machine none of them owns. Nothing about this is advanced — it is Chapters 9 and 10.</p>

<h3>Real incidents — checked against their sources</h3>
${slide('dk-00', 15, 'Ba sự cố có thật — đã kiểm nguồn')}
<p>Three stories that really happened, each with its source at the end of the lesson. Read them for the <em>lesson</em>, not the drama — and notice that one of them is a Docker disaster, not a disaster Docker prevents. Honesty about that is part of using the tool well.</p>
<div class="callout danger"><strong>💸 Knight Capital, 1 August 2012 — a manual deploy that missed one server.</strong><br><strong>What happened:</strong> according to the US Securities and Exchange Commission's order, Knight deployed new trading code by hand, server by server. A technician did not copy the new code to one of the eight servers, no second person reviewed the deployment, and there were no written deployment procedures. On that eighth server, a long-unused old function woke up when a flag was reused.<br><strong>Consequence:</strong> in about 45 minutes after the market opened, the system sent more than 4 million orders while trying to fill 212 customer orders; the SEC puts the loss at more than 460 million US dollars. Knight also paid a 12 million dollar penalty.<br><strong>How containers help (honestly):</strong> Docker alone would not have stopped a bad flag. What it removes is the "copy files to each server by hand" step: every server pulls <em>one</em> image by its exact tag or digest, and <code>docker ps</code> / <code>docker inspect</code> tells you in one command which version each server is actually running. "Seven servers new, one old" becomes something you can see. <strong>Learn it in:</strong> Chapter 3 (tags vs digests), Chapter 11 (deploying and verifying), Chapter 16.</div>
<div class="callout warn"><strong>🪱 Graboid, October 2019 — Docker used carelessly.</strong><br><strong>What happened:</strong> researchers at Palo Alto Networks' Unit 42 found a worm that spread through more than 2,000 Docker Engines whose API was exposed to the internet with no authentication. The worm told each exposed daemon to run its container, mined the Monero cryptocurrency, and used the machine to find the next victim.<br><strong>The lesson for you:</strong> whoever can talk to the Docker daemon controls the machine as root (lesson 0.2 shows this in two commands). Never open the daemon's TCP port (2375) to a network; talk to remote Docker over SSH instead. <strong>Learn it in:</strong> lesson 0.2 (the docker group), Chapter 11 (production), Chapter 15 (rootless).</div>
<div class="callout warn"><strong>☠️ 17 poisoned images on Docker Hub, 2017–2018.</strong><br><strong>What happened:</strong> one account uploaded 17 "handy" images that were pulled about 5 million times. Security firms Kromtech and Fortinet found that they installed cryptocurrency miners and backdoors; the attackers earned roughly 90,000 US dollars in Monero before Docker removed the images in 2018.<br><strong>The lesson for you:</strong> <code>docker pull</code> runs a stranger's software on your machine. Prefer <em>Docker Official Images</em> and verified publishers, pin versions, and read a Dockerfile before you trust an image from an unknown account. <strong>Learn it in:</strong> Chapter 3 (registries), Chapter 6 (scanning and safe images).</div>

<h3>Four real incidents from one student project</h3>
${slide('dk-00', 16, 'Bốn sự cố THẬT của một dự án sinh viên chạy Docker')}
<p>This course is written by and for a student who runs a real website — Next.js, an Express API, Prisma, PostgreSQL, Redis and nginx — with Docker Compose on one Ubuntu VPS. These four things actually happened to that project. Each one is ordinary, each one hurt, and each one is a lesson later in this course:</p>
<table>
  <tr><th>What happened</th><th>Consequence</th><th>Real cause</th><th>How Docker, used properly, prevents it</th><th>Chapter</th></tr>
  <tr><td>The API image was switched to an Alpine base "to make it smaller"</td><td>The API returned 502 for seven minutes after deploy; the build had been green</td><td>Alpine uses the musl C library; the Prisma engine shipped inside was built for glibc. It built fine and crashed on start.</td><td>Choose the base image to match native binaries, and test the <em>built image</em> before swapping it in</td><td>6, 12</td></tr>
  <tr><td>A deploy died half-way</td><td><code>no space left on device</code> on the disk that also held PostgreSQL</td><td>Docker's build cache had quietly grown to 7.6 GB on the server</td><td>Build elsewhere (or in CI), watch <code>docker system df</code>, prune cache with rules</td><td>5, 11</td></tr>
  <tr><td><code>next build</code> was killed</td><td>Exit code 137, failed deploy</td><td>Two image builds ran in parallel and ran out of the VPS's 6 GB of memory (OOM kill)</td><td>Know that 137 means "killed", check <code>OOMKilled</code>, set memory limits, build one at a time</td><td>1, 11</td></tr>
  <tr><td>An <code>nginx.conf</code> change was deployed "successfully"</td><td>Nothing changed, twice</td><td>The container bind-mounted a <em>single file</em>; the script replaced it with <code>mv</code>, so the container kept reading the old file</td><td>Bind-mount directories, or write files in place, and check from <em>inside</em> the container</td><td>7, lesson 0.3</td></tr>
</table>
<p>Notice the pattern: none of these was fixed by "learning more commands". Each was fixed in minutes once the <em>model</em> was clear — what an image contains, where the build cache lives, what exit 137 means, how a bind mount works. That is exactly why Chapter 1 comes first.</p>

<h3>Illustrative situations — probably your team</h3>
${slide('dk-00', 17, 'Tình huống minh hoạ — rất có thể là nhóm bạn')}
<p>These five are <em>illustrations</em>, not reports of real events — but ask any senior student and they will tell you their own version.</p>
<table>
  <tr><th>Situation</th><th>What it costs</th><th>How Docker (used properly) prevents it</th><th>Chapter</th></tr>
  <tr><td>"Installing PostgreSQL took the whole afternoon"</td><td>Wrong port, forgotten password, an uninstaller that leaves a service behind</td><td><code>docker run postgres:16-alpine</code> — ready in seconds, removed cleanly</td><td>0.3, 7</td></tr>
  <tr><td>The demo dies in front of the committee</td><td>The grading machine is missing one library</td><td>The image carries every library; you rehearse on another machine first</td><td>4, 10</td></tr>
  <tr><td>"It doesn't run on my Windows laptop"</td><td>One team member idle for a week</td><td>WSL2 + Compose: the same Linux, the same command</td><td>0.2, 13</td></tr>
  <tr><td>The server has a different version of a system library</td><td>The app fails on the server with a <code>libssl</code> error</td><td>Libraries live inside the image, independent of the host</td><td>0.1, 6</td></tr>
  <tr><td>A manual deploy skips one step</td><td>The site is down at midnight</td><td>Deploy = pull the image and <code>up -d</code>; if broken, start the previous tag</td><td>11, 16</td></tr>
</table>

<div class="pitfall co-tieu-de"><strong>Do not learn the wrong lesson from these stories.</strong> Two traps. First: "Docker keeps my data safe." It does the opposite by default — a container's own files disappear when it is removed, and a database is only safe in a <em>volume</em> that you back up (Chapter 7). Second: "Containers are isolated, so running any image is fine." Graboid and the poisoned images show that Docker is powerful precisely because it runs whatever it is told to, as root. Docker makes environments reproducible; it does not make careless choices safe.</div>

<h3>Why beginners give up on Docker</h3>
${slide('dk-00', 18, 'Vì sao người mới hay bỏ Docker — và cách chữa')}
<p>If you tried Docker before and gave up, you are in large company. It is rarely a lack of ability. It is usually one of these:</p>
<ul>
  <li><strong>English jargon everywhere.</strong> Image, layer, volume, bind mount, daemon, registry, tag, digest — ten new words before your first container. <em>Fix in this course:</em> every term gets its Vietnamese meaning right next to it, and every lesson ends with a 🗂 glossary.</li>
  <li><strong>Commands without the model.</strong> You memorise <code>docker run -d -p 8080:80 nginx</code>, and the first time something does not match the recipe, you are stuck. <em>Fix:</em> Chapter 1 teaches what a container really is (a process with namespaces and cgroups) and what an image really is (stacked read-only layers); every later command is explained in those terms.</li>
  <li><strong>Frightening error messages.</strong> Docker's errors are long and start with generic words. <em>Fix:</em> read them from the end — the next section shows how.</li>
  <li><strong>Fear of breaking the machine or losing data.</strong> <em>Fix:</em> a scratch folder <code>~/thu-docker</code>, containers you create on purpose and delete by name, and a clear rule for what survives a delete (Chapters 1 and 7).</li>
  <li><strong>Reading without doing.</strong> <em>Fix:</em> every lesson has a 🧪 practice you do right away, with a "done when" you can check.</li>
  <li><strong>A slow laptop.</strong> Docker Desktop on 8 GB of RAM can feel heavy. <em>Fix:</em> give its VM a sensible amount of memory, run only what you need, and clean images and cache (lesson 0.2, Chapter 13).</li>
</ul>

<h3>How to read a Docker error — start from the end</h3>
${slide('dk-00', 19, 'Đọc lỗi Docker: bỏ qua phần đầu, đọc cụm cuối')}
<p>Almost every Docker error has the same shape: <code>docker: Error response from daemon:</code> (meaning "the Engine refused"), then a chain of increasingly specific reasons separated by colons, and the <em>real</em> cause at the very end. Four real ones from the course's Mac, Docker 29.8:</p>
<pre><code class="language-bash">docker run -d -p 18000:80 nginx:1.27-alpine     <span class="tok-comment"># port 18000 already used by another container</span>
docker run -d --name web nginx:1.27-alpine        <span class="tok-comment"># a container named web already exists</span>
docker run --rm ngnix                             <span class="tok-comment"># typo in the image name</span>
docker ps                                         <span class="tok-comment"># with Docker Desktop not running (*)</span></code></pre>
<div class="out">docker: Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint …: Bind for 0.0.0.0:18000 failed: port is already allocated
docker: Error response from daemon: Conflict. The container name "/web" is already in use by container "3385dcee9a80…". You have to remove (or rename) that container to be able to reuse that name.
docker: Error response from daemon: pull access denied for ngnix, repository does not exist or may require 'docker login'
failed to connect to the docker API at unix:///…/docker.sock; check if the path is correct and if the daemon is running: dial unix …/docker.sock: connect: no such file or directory</div>
<p>(*) The last case was produced without shutting Docker Desktop down, by pointing the CLI at a socket that does not exist (<code>DOCKER_HOST=unix:///tmp/khong-co.sock docker ps</code>) — the CLI then reaches exactly the dead end it reaches when Desktop is stopped: no socket file to connect to.</p>
<table>
  <tr><th>Last phrase</th><th>What it really means</th><th>What to do</th></tr>
  <tr><td><code>port is already allocated</code></td><td>Something already holds that port on <em>your</em> machine</td><td><code>docker ps</code> to find it; or use another host port</td></tr>
  <tr><td><code>name … already in use</code></td><td>An old container — even a stopped one — keeps its name</td><td><code>docker ps -a</code>, then <code>docker rm -f web</code></td></tr>
  <tr><td><code>pull access denied … does not exist</code></td><td>Usually a typo (<code>ngnix</code>), rarely a private image</td><td>Check the name on Docker Hub</td></tr>
  <tr><td><code>failed to connect … daemon is running</code></td><td>The Engine is not running; the CLI is fine</td><td>Start Docker Desktop, or <code>sudo systemctl start docker</code></td></tr>
</table>
<p>A detail worth knowing now: the first command above did not just fail — it left a container behind in the <code>Created</code> state, holding its name. Lesson 0.3 and Chapter 1 explain why (<code>run</code> is really create + start). When a "name already in use" error surprises you, that is the usual reason.</p>
<p><strong>How to ask for help when stuck</strong> — to a teammate, a teacher or an AI: paste the exact command, the <em>full</em> output (not a screenshot of the last line), the output of <code>docker ps -a</code>, and, if a container is involved, <code>docker logs &lt;name&gt; | tail -30</code>; say which OS you are on and what you expected. "Docker is broken, help" gets no useful answer; those five things usually get a fix in minutes.</p>

<h3>Seven pieces of advice that keep you going</h3>
<ol>
  <li><strong>Learn the model before the commands.</strong> Give Chapter 1 an hour even if you are in a hurry. Fifteen commands you understand beat a hundred you copied.</li>
  <li><strong>Name everything you create.</strong> <code>--name web</code>, <code>-v pgdata:…</code>, <code>-p 8080:80</code>. Named things can be found, inspected and deleted precisely; random names pile up.</li>
  <li><strong>Look inside.</strong> <code>docker ps -a</code>, <code>docker logs</code>, <code>docker exec -it &lt;name&gt; sh</code> answer most questions faster than searching.</li>
  <li><strong>Break things on purpose in <code>~/thu-docker</code>.</strong> Fill a container's memory, delete a container with data in it, publish two containers on one port. Seeing each error once, calmly, makes it harmless later.</li>
  <li><strong>Read the error from the end.</strong> The last phrase is the cause.</li>
  <li><strong>Use the 🗂 box.</strong> When a word blocks you, look it up in that lesson's glossary before reading on.</li>
  <li><strong>Clean up by name, never "everything".</strong> Your machine may run other projects' containers and volumes. <code>docker rm -f web db</code> is safe; a blind prune is not.</li>
</ol>

<h3>A minimum route and a full route</h3>
${slide('dk-00', 20, 'Lộ trình: tối thiểu 2 tuần cho đồ án · đầy đủ 17 phần')}
<p><strong>Minimum route — enough for a team project, about two weeks (around 10 sittings of an hour):</strong></p>
<table>
  <tr><th>Week</th><th>Study</th><th>You can then…</th></tr>
  <tr><td>1</td><td>Section 0 (these two lessons + 0.1–0.3), Chapter 1 (the model), Chapter 2 (running containers), Chapter 4 (Dockerfile)</td><td>run and inspect containers, explain image vs container, write a Dockerfile for your API</td></tr>
  <tr><td>2</td><td>Chapter 7 (volumes), Chapter 8 (networking), Chapter 9 (Compose), Chapter 10 (a real stack)</td><td>keep database data safe, connect containers, run the whole project with one command</td></tr>
</table>
<p><strong>Full route:</strong> all 17 parts, one lesson per sitting, Chapters 1–10 in order. After your project deadline, come back for Chapter 3 (images and registries), 5 and 6 (fast builds, small and safe images) and — before you put anything on a server — Chapter 11. Chapter 12 is a cookbook you can open in the middle of any incident; Chapters 13–16 turn Docker into an everyday tool and end with a capstone project and the final exam.</p>

<h3>The rhythm of one sitting, and milestones to celebrate</h3>
${slide('dk-00', 21, 'Nhịp một buổi học (~60 phút) và các mốc “mình làm được”')}
<p>About an hour: <strong>look at the slides</strong> of the lesson (5 minutes — get the picture), <strong>read the lesson</strong> (about 20 minutes), <strong>type the commands yourself</strong> in <code>~/thu-docker</code> (do not copy-paste; your fingers need to learn too), do the <strong>🧪 practice</strong> (15–20 minutes), and at the end of each chapter take the <strong>10-question quiz</strong>, reading the explanation even for the questions you got right. Stop while you still want to continue — the next sitting will be easier.</p>
<p>Mark these milestones when you reach them. Each one is a real skill:</p>
<ul>
  <li><strong>Milestone 1:</strong> <code>hello-world</code> prints "Hello from Docker!" on your machine.</li>
  <li><strong>Milestone 2:</strong> you run PostgreSQL in a container and connect to it.</li>
  <li><strong>Milestone 3:</strong> you write a Dockerfile for your own app and it runs.</li>
  <li><strong>Milestone 4:</strong> your whole team runs the project with one <code>docker compose up</code>.</li>
  <li><strong>Milestone 5:</strong> your app runs on a VPS from an image you built.</li>
</ul>

<h3>🧪 Practice (10 minutes — your first container and your first error, today)</h3>
<div class="callout ok"><ol>
<li>Create the course's scratch folder: <code>mkdir -p ~/thu-docker &amp;&amp; cd ~/thu-docker</code>. (No Docker yet? Do lesson 0.2 first, then come back.)</li>
<li>Write your plan into <code>ke-hoach.md</code>: which route (minimum or full), which days of the week, how long each sitting. Three lines is enough.</li>
<li>Run your first container on purpose (block below). It prints a line and disappears (<code>--rm</code>).</li>
<li>Now make an error on purpose: <code>docker run --rm ngnix</code>. Read it from the end and write down, in your own words, what the last phrase means.</li>
<li>Run <code>docker ps -a</code> and check that neither command left a container behind.</li>
</ol>
<pre><code class="language-bash">mkdir -p ~/thu-docker &amp;&amp; cd ~/thu-docker
printf '# Kế hoạch học Docker\\nLộ trình: tối thiểu 2 tuần\\nBuổi học: tối T3, T5, T7 — 60 phút\\n' &gt; ke-hoach.md
docker run --rm alpine echo "Mốc 1: container đầu tiên của tôi — XONG"
docker run --rm alpine sh -c 'head -2 /etc/os-release; uname -m'
docker run --rm ngnix</code></pre>
<div class="out">Mốc 1: container đầu tiên của tôi — XONG
NAME="Alpine Linux"
ID=alpine
aarch64
Unable to find image 'ngnix:latest' locally
docker: Error response from daemon: pull access denied for ngnix, repository does not exist or may require 'docker login'

Run 'docker run --help' for more information</div>
<p>(Real output on the course's Mac, 23/09/2026. <code>aarch64</code> is the ARM processor of an Apple-silicon Mac; on most Windows laptops and servers you will see <code>x86_64</code>.)</p>
<p><strong>Done when:</strong> <code>~/thu-docker/ke-hoach.md</code> names a route and at least three study days, you saw your own "Mốc 1" line printed by a container, you can explain that <code>pull access denied … does not exist</code> here simply means "no image with that name" (a typo), and <code>docker ps -a</code> shows nothing from these commands. That is milestone 1 — congratulations.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Deploy</span><span class="v">Putting a new version of an application onto the machine where users reach it.</span></div>
  <div class="kv"><span class="k">Docker daemon API</span><span class="v">The interface through which anything — the CLI, a script, an attacker — tells the Engine what to do. Exposed without authentication, it hands over the machine.</span></div>
  <div class="kv"><span class="k">Official image</span><span class="v">An image curated by Docker and the upstream project (<code>nginx</code>, <code>postgres</code>…), as opposed to an image from an unknown account.</span></div>
  <div class="kv"><span class="k">Exit code 137</span><span class="v">The process was killed with SIGKILL — very often by the out-of-memory killer.</span></div>
  <div class="kv"><span class="k">OOM (out of memory)</span><span class="v">Running out of allowed memory; the kernel then kills a process to protect the machine.</span></div>
  <div class="kv"><span class="k">Bind mount</span><span class="v">Making a file or folder of the host appear inside a container (lesson 0.3, Chapter 7).</span></div>
  <div class="kv"><span class="k">Scratch folder</span><span class="v"><code>~/thu-docker</code> — the place where breaking things is safe during this course.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Without a shared environment, a student team loses days to version differences and demos fail on someone else's machine; a Compose file fixes that.</li>
<li>Knight Capital (2012) lost more than 460 million dollars in 45 minutes after a manual deploy missed one of eight servers — reproducible, verifiable deploys are the lesson.</li>
<li>Graboid (2019) and 17 poisoned Docker Hub images (2018) show the other side: an exposed daemon or an untrusted image hands attackers your machine.</li>
<li>A real student project hit a musl/glibc 502, a full disk from build cache, an exit-137 OOM kill and a single-file bind mount that ignored changes — each fixed quickly once the model was clear.</li>
<li>People quit Docker over jargon, recipes without a model and scary errors; read errors from the end, practise in <code>~/thu-docker</code>, and name what you create.</li>
<li>Minimum route: Section 0 → Ch 1, 2, 4 → Ch 7, 8, 9, 10 in about two weeks; one sitting = slides, lesson, typing, practice, quiz.</li>
</ul>

<a class="link-card" href="https://en.wikipedia.org/wiki/Knight_Capital_Group" target="_blank" rel="noopener">
  <span class="lc-ico">💸</span>
  <span class="lc-body"><span class="lc-title">Wikipedia — Knight Capital Group (2012 trading loss)</span><span class="lc-sub">The eight servers, the one that was not updated, and the SEC order it cites.</span></span>
</a>
<a class="link-card" href="https://unit42.paloaltonetworks.com/graboid-first-ever-cryptojacking-worm-found-in-images-on-docker-hub/" target="_blank" rel="noopener">
  <span class="lc-ico">🪱</span>
  <span class="lc-body"><span class="lc-title">Unit 42 — Graboid: first-ever cryptojacking worm found in images on Docker Hub</span><span class="lc-sub">How 2,000+ unauthenticated Docker Engines were taken over (2019).</span></span>
</a>
<a class="link-card" href="https://techcrunch.com/2018/06/15/tainted-crypto-mining-containers-pulled-from-docker-hub/" target="_blank" rel="noopener">
  <span class="lc-ico">☠️</span>
  <span class="lc-body"><span class="lc-title">TechCrunch — Tainted, crypto-mining containers pulled from Docker Hub (2018)</span><span class="lc-sub">17 images, 5 million pulls, about 90,000 dollars in Monero.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Docker Engine security</span><span class="lc-sub">Why the daemon's attack surface matters and who should be allowed to control it.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/get-started/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Docker — official Get Started guide</span><span class="lc-sub">A second voice beside this course for Section 0 and Chapters 1–4.</span></span>
</a>
<p class="note-ct"><strong>Next:</strong> lesson 0.0 has every Section 0 slide in one place, and lesson 0.1 looks closely at the three failures Docker ends. If you already did the practice above, you have run your first container and read your first error — the rest builds on that.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Khi không có nó — những sự cố thật, và cách học Docker mà không bỏ cuộc</h2>
<p class="lead">Bài trước bạn đã làm quen với Docker. Bài này trả lời hai câu hỏi mà người mới nào cũng thầm hỏi: “Không có nó thì tệ tới vậy thật à?” và “Liệu mình có học nổi không, hay lại bỏ sau bức tường chữ đỏ đầu tiên?”. Trước hết là những câu chuyện — có chuyện được cơ quan quản lý và giới nghiên cứu bảo mật ghi chép lại, có chuyện xảy ra với chính dự án sinh viên mà khoá này lấy làm ví dụ, có chuyện điển hình tới mức rất có thể bạn đã trải qua. Sau đó là một kế hoạch.</p>

<h3>Một tuần đồ án nhóm không có Docker</h3>
${slide('dk-00', 14, 'Một tuần đồ án nhóm: không Docker vs có Docker (minh hoạ)')}
<p><em>(Tình huống minh hoạ, không phải một nhóm có thật.)</em> Thứ Hai: An cài PostgreSQL 16 trên máy Mac, Bình cài bản 14 trên Ubuntu vì <code>apt</code> đưa cho bản đó, còn Chi dùng Windows nên xài SQL Server “cho quen như kỳ trước”. Thứ Ba: một migration (file đổi cấu trúc CSDL) chạy ngon trên máy An lại báo lỗi cú pháp trên máy Bình — bản cũ của Bình không có tính năng đó. Mất trọn buổi tối. Thứ Tư: script build của Chi vỡ vì đường dẫn Windows dùng <code>\\</code>. Thứ Năm: cuối cùng có người chạy được mọi thứ trên một chiếc laptop, và không ai dám đụng vào nó nữa. Thứ Sáu, ngày demo: máy của thầy không có Redis, phần xử lý phiên đăng nhập sập, và hội đồng ngồi nhìn một trang trắng.</p>
<p>Giờ là cùng tuần đó khi có Docker: một file <code>compose.yaml</code> trong kho mã ghim <code>postgres:16-alpine</code> và <code>redis:7-alpine</code>; máy nào cũng chạy <code>docker compose up</code> và có cùng phiên bản, cùng dữ liệu mẫu; Chi làm việc bên trong WSL2, tức cùng Linux với cả nhóm; và bản demo đã chạy thử ở CI trên một cái máy chẳng ai trong nhóm sở hữu. Không có gì cao siêu ở đây — đó là Chương 9 và 10.</p>

<h3>Những sự cố có thật — đã đối chiếu nguồn</h3>
${slide('dk-00', 15, 'Ba sự cố có thật — đã kiểm nguồn')}
<p>Ba chuyện đã thật sự xảy ra, mỗi chuyện có nguồn ở cuối bài. Hãy đọc chúng để lấy <em>bài học</em>, không phải để hóng kịch tính — và để ý rằng có chuyện là thảm hoạ DO Docker, chứ không phải thảm hoạ Docker ngăn được. Nói thật điều đó cũng là một phần của việc dùng công cụ cho giỏi.</p>
<div class="callout danger"><strong>💸 Knight Capital, 1/8/2012 — deploy tay sót một máy chủ.</strong><br><strong>Chuyện gì xảy ra:</strong> theo quyết định của Uỷ ban Chứng khoán Mỹ (SEC), Knight triển khai mã giao dịch mới bằng tay, từng máy chủ một. Một kỹ thuật viên không chép mã mới lên một trong tám máy chủ, không có người thứ hai kiểm lại, và công ty không có quy trình triển khai viết thành văn bản. Trên máy chủ thứ tám đó, một chức năng cũ bỏ không từ lâu bỗng “thức dậy” khi một cờ (flag) được dùng lại cho việc khác.<br><strong>Hậu quả:</strong> trong khoảng 45 phút sau khi thị trường mở cửa, hệ thống gửi đi hơn 4 triệu lệnh trong lúc cố khớp 212 lệnh của khách; SEC tính khoản lỗ là hơn 460 triệu USD. Knight còn nộp phạt 12 triệu USD.<br><strong>Container giúp được gì (nói thật):</strong> riêng Docker thì không cản được một cái cờ dùng sai. Thứ nó xoá bỏ là bước “chép file lên từng máy bằng tay”: mọi máy chủ kéo về <em>một</em> image theo đúng tag hoặc digest (mã băm nội dung), và <code>docker ps</code> / <code>docker inspect</code> cho bạn biết bằng một lệnh máy nào đang thật sự chạy phiên bản nào. Tình trạng “bảy máy mới, một máy cũ” trở thành thứ nhìn thấy được. <strong>Học ở:</strong> Chương 3 (tag và digest), Chương 11 (deploy và kiểm tra), Chương 16.</div>
<div class="callout warn"><strong>🪱 Graboid, tháng 10/2019 — dùng Docker ẩu.</strong><br><strong>Chuyện gì xảy ra:</strong> nhóm nghiên cứu Unit 42 của Palo Alto Networks phát hiện một con sâu (worm — mã độc tự lây lan) lan qua hơn 2.000 Docker Engine để API mở ra Internet mà không cần xác thực. Con sâu ra lệnh cho từng daemon bị lộ chạy container của nó, đào tiền ảo Monero, rồi dùng chính cái máy đó để tìm nạn nhân tiếp theo.<br><strong>Bài học cho bạn:</strong> ai nói chuyện được với Docker daemon là điều khiển được cái máy với quyền root (bài 0.2 chứng minh điều này bằng hai lệnh). Không bao giờ mở cổng TCP của daemon (2375) ra mạng; muốn điều khiển Docker từ xa thì đi qua SSH. <strong>Học ở:</strong> bài 0.2 (nhóm docker), Chương 11 (production), Chương 15 (rootless).</div>
<div class="callout warn"><strong>☠️ 17 image độc trên Docker Hub, 2017–2018.</strong><br><strong>Chuyện gì xảy ra:</strong> một tài khoản tải lên 17 image “tiện dụng”, được kéo về khoảng 5 triệu lần. Hai công ty bảo mật Kromtech và Fortinet phát hiện chúng cài máy đào tiền ảo và cửa hậu (backdoor); kẻ tấn công kiếm được khoảng 90.000 USD bằng Monero trước khi Docker gỡ các image đó năm 2018.<br><strong>Bài học cho bạn:</strong> <code>docker pull</code> là chạy phần mềm của người lạ trên máy mình. Ưu tiên <em>Docker Official Images</em> (image chính thức) và nhà phát hành đã xác minh, ghim phiên bản, và đọc Dockerfile trước khi tin một image từ tài khoản lạ. <strong>Học ở:</strong> Chương 3 (registry), Chương 6 (quét lỗ hổng và image an toàn).</div>

<h3>Bốn sự cố thật của một dự án sinh viên</h3>
${slide('dk-00', 16, 'Bốn sự cố THẬT của một dự án sinh viên chạy Docker')}
<p>Khoá này được viết bởi và cho một sinh viên đang tự chạy một trang web thật — Next.js, API Express, Prisma, PostgreSQL, Redis và nginx — bằng Docker Compose trên một VPS Ubuntu. Bốn chuyện dưới đây đã thật sự xảy ra với dự án đó. Chuyện nào cũng bình thường, chuyện nào cũng đau, và chuyện nào cũng là một bài học ở phía sau khoá:</p>
<table>
  <tr><th>Chuyện gì xảy ra</th><th>Hậu quả</th><th>Nguyên nhân thật</th><th>Docker, dùng đúng, ngăn nó thế nào</th><th>Chương</th></tr>
  <tr><td>Đổi image của API sang nền Alpine “cho nhẹ”</td><td>API trả 502 suốt bảy phút sau deploy; lúc build thì xanh hết</td><td>Alpine dùng thư viện C musl; engine của Prisma đóng gói bên trong lại dịch cho glibc. Build thì được, khởi động thì chết.</td><td>Chọn image nền khớp với các tệp nhị phân native, và chạy thử <em>đúng image đã build</em> trước khi tráo vào</td><td>6, 12</td></tr>
  <tr><td>Một lần deploy chết giữa chừng</td><td><code>no space left on device</code> trên đúng cái đĩa chứa PostgreSQL</td><td>Cache build của Docker âm thầm phình tới 7,6 GB trên máy chủ</td><td>Build ở chỗ khác (hoặc ở CI), theo dõi <code>docker system df</code>, dọn cache có quy tắc</td><td>5, 11</td></tr>
  <tr><td><code>next build</code> bị giết</td><td>Mã thoát 137, deploy hỏng</td><td>Hai lượt build image chạy song song, vượt 6 GB RAM của VPS (bị OOM giết)</td><td>Biết 137 nghĩa là “bị giết”, kiểm <code>OOMKilled</code>, đặt giới hạn bộ nhớ, build từng cái một</td><td>1, 11</td></tr>
  <tr><td>Sửa <code>nginx.conf</code> và deploy “thành công”</td><td>Không có gì thay đổi, hai lần liền</td><td>Container bind-mount (gắn từ máy chủ vào) <em>một file lẻ</em>; script thay file bằng <code>mv</code>, nên container vẫn đọc file cũ</td><td>Gắn cả thư mục, hoặc ghi đè file tại chỗ, và kiểm tra từ <em>bên trong</em> container</td><td>7, bài 0.3</td></tr>
</table>
<p>Để ý quy luật: không cái nào được chữa bằng cách “học thêm lệnh”. Cái nào cũng được chữa trong vài phút một khi <em>mô hình</em> đã rõ — image chứa gì, cache build nằm ở đâu, 137 nghĩa là gì, bind mount hoạt động ra sao. Đó chính là lý do Chương 1 đứng đầu.</p>

<h3>Tình huống minh hoạ — rất có thể là nhóm bạn</h3>
${slide('dk-00', 17, 'Tình huống minh hoạ — rất có thể là nhóm bạn')}
<p>Năm tình huống dưới đây là <em>minh hoạ</em>, không phải tường thuật sự việc có thật — nhưng hỏi bất kỳ anh chị khoá trên nào, họ cũng kể được phiên bản của riêng họ.</p>
<table>
  <tr><th>Tình huống</th><th>Cái giá</th><th>Docker (dùng đúng) ngăn thế nào</th><th>Chương</th></tr>
  <tr><td>“Cài PostgreSQL mất cả buổi chiều”</td><td>Sai cổng, quên mật khẩu, gỡ cài đặt xong vẫn còn một dịch vụ chạy ngầm</td><td><code>docker run postgres:16-alpine</code> — sẵn sàng sau vài giây, xoá là sạch</td><td>0.3, 7</td></tr>
  <tr><td>Demo chết trước hội đồng</td><td>Máy chấm thiếu đúng một thư viện</td><td>Image mang đủ thư viện; bạn tập dượt trên máy khác trước</td><td>4, 10</td></tr>
  <tr><td>“Máy Windows của em không chạy”</td><td>Một thành viên ngồi chơi cả tuần</td><td>WSL2 + Compose: cùng Linux, cùng lệnh</td><td>0.2, 13</td></tr>
  <tr><td>Máy chủ khác phiên bản thư viện hệ thống</td><td>Ứng dụng lên máy chủ là báo lỗi <code>libssl</code></td><td>Thư viện nằm trong image, không phụ thuộc máy chủ</td><td>0.1, 6</td></tr>
  <tr><td>Deploy tay quên một bước</td><td>Trang sập lúc nửa đêm</td><td>Deploy = kéo image rồi <code>up -d</code>; hỏng thì chạy lại tag cũ</td><td>11, 16</td></tr>
</table>

<div class="pitfall co-tieu-de"><strong>Đừng rút ra bài học sai từ những chuyện này.</strong> Hai cái bẫy. Một: “Docker giữ dữ liệu của mình an toàn.” Mặc định nó làm ngược lại — file riêng của một container biến mất khi container bị xoá, và một cơ sở dữ liệu chỉ an toàn khi nằm trong một <em>volume</em> (vùng lưu trữ bền) mà bạn có sao lưu (Chương 7). Hai: “Container được cô lập, nên chạy image nào cũng được.” Graboid và đám image độc cho thấy Docker mạnh chính vì nó chạy bất cứ thứ gì được ra lệnh, bằng quyền root. Docker làm môi trường tái lập được; nó không biến những lựa chọn ẩu thành an toàn.</div>

<h3>Vì sao người mới hay bỏ Docker</h3>
${slide('dk-00', 18, 'Vì sao người mới hay bỏ Docker — và cách chữa')}
<p>Nếu bạn từng thử Docker rồi bỏ, bạn có rất nhiều người đồng cảnh. Hiếm khi vì thiếu khả năng. Thường là vì một trong những lý do này:</p>
<ul>
  <li><strong>Thuật ngữ tiếng Anh dồn dập.</strong> Image, layer, volume, bind mount, daemon, registry, tag, digest — mười chữ mới trước khi có container đầu tiên. <em>Cách chữa trong khoá này:</em> mọi thuật ngữ có nghĩa tiếng Việt ngay bên cạnh, và cuối mỗi bài có ô 🗂 thuật ngữ.</li>
  <li><strong>Học lệnh mà không có mô hình.</strong> Bạn thuộc lòng <code>docker run -d -p 8080:80 nginx</code>, và lần đầu tiên tình huống không khớp công thức là bí. <em>Cách chữa:</em> Chương 1 dạy container thật ra là gì (một tiến trình có namespace và cgroup) và image thật ra là gì (các tầng chỉ-đọc chồng lên nhau); mọi lệnh về sau được giải thích bằng đúng những khái niệm đó.</li>
  <li><strong>Thông báo lỗi đáng sợ.</strong> Lỗi của Docker dài và mở đầu bằng những chữ chung chung. <em>Cách chữa:</em> đọc từ cuối lên — mục kế tiếp chỉ cách.</li>
  <li><strong>Sợ làm hỏng máy hoặc mất dữ liệu.</strong> <em>Cách chữa:</em> một thư mục sân tập <code>~/thu-docker</code>, những container bạn cố ý tạo rồi xoá theo tên, và một quy tắc rõ ràng về thứ gì sống sót sau khi xoá (Chương 1 và 7).</li>
  <li><strong>Đọc mà không làm.</strong> <em>Cách chữa:</em> bài nào cũng có một 🧪 thực hành làm ngay, với tiêu chí “Đạt khi” tự kiểm được.</li>
  <li><strong>Laptop yếu.</strong> Docker Desktop trên máy 8 GB RAM có thể thấy nặng. <em>Cách chữa:</em> cấp cho máy ảo của nó một lượng RAM hợp lý, chỉ chạy thứ cần, dọn image và cache (bài 0.2, Chương 13).</li>
</ul>

<h3>Đọc một lỗi Docker thế nào — bắt đầu từ cuối</h3>
${slide('dk-00', 19, 'Đọc lỗi Docker: bỏ qua phần đầu, đọc cụm cuối')}
<p>Gần như lỗi Docker nào cũng có cùng một hình dạng: <code>docker: Error response from daemon:</code> (nghĩa là “Engine từ chối”), rồi một chuỗi lý do ngày càng cụ thể ngăn nhau bởi dấu hai chấm, và nguyên nhân <em>thật</em> nằm ở tận cuối. Bốn lỗi thật trên máy Mac của khoá, Docker 29.8:</p>
<pre><code class="language-bash">docker run -d -p 18000:80 nginx:1.27-alpine     <span class="tok-comment"># cổng 18000 đã có container khác giữ</span>
docker run -d --name web nginx:1.27-alpine        <span class="tok-comment"># đã có container tên web</span>
docker run --rm ngnix                             <span class="tok-comment"># gõ sai tên image</span>
docker ps                                         <span class="tok-comment"># khi Docker Desktop chưa chạy (*)</span></code></pre>
<div class="out">docker: Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint …: Bind for 0.0.0.0:18000 failed: port is already allocated
docker: Error response from daemon: Conflict. The container name "/web" is already in use by container "3385dcee9a80…". You have to remove (or rename) that container to be able to reuse that name.
docker: Error response from daemon: pull access denied for ngnix, repository does not exist or may require 'docker login'
failed to connect to the docker API at unix:///…/docker.sock; check if the path is correct and if the daemon is running: dial unix …/docker.sock: connect: no such file or directory</div>
<p>(*) Trường hợp cuối được tạo ra mà không phải tắt Docker Desktop, bằng cách trỏ CLI tới một socket không tồn tại (<code>DOCKER_HOST=unix:///tmp/khong-co.sock docker ps</code>) — khi đó CLI rơi vào đúng ngõ cụt như lúc Desktop đang tắt: không có file socket nào để kết nối.</p>
<table>
  <tr><th>Cụm cuối</th><th>Thật ra nghĩa là</th><th>Làm gì</th></tr>
  <tr><td><code>port is already allocated</code></td><td>Có thứ đang giữ cổng đó trên máy <em>của bạn</em></td><td><code>docker ps</code> để tìm; hoặc dùng cổng máy khác</td></tr>
  <tr><td><code>name … already in use</code></td><td>Một container cũ — kể cả đã dừng — vẫn giữ cái tên</td><td><code>docker ps -a</code>, rồi <code>docker rm -f web</code></td></tr>
  <tr><td><code>pull access denied … does not exist</code></td><td>Thường là gõ sai (<code>ngnix</code>), hiếm khi là image riêng tư</td><td>Kiểm tên trên Docker Hub</td></tr>
  <tr><td><code>failed to connect … daemon is running</code></td><td>Engine chưa chạy; CLI không có lỗi gì</td><td>Mở Docker Desktop, hoặc <code>sudo systemctl start docker</code></td></tr>
</table>
<p>Một chi tiết đáng biết ngay từ giờ: lệnh đầu tiên ở trên không chỉ thất bại — nó còn để lại một container ở trạng thái <code>Created</code> (đã tạo, chưa chạy), giữ luôn cái tên. Bài 0.3 và Chương 1 giải thích vì sao (<code>run</code> thật ra là create + start). Khi lỗi “tên đã được dùng” làm bạn bất ngờ, đó thường là lý do.</p>
<p><strong>Cách hỏi khi bí</strong> — hỏi bạn cùng nhóm, thầy cô hay một AI: dán đúng câu lệnh, <em>toàn bộ</em> output (không phải ảnh chụp dòng cuối), kết quả <code>docker ps -a</code>, và nếu có container liên quan thì <code>docker logs &lt;tên&gt; | tail -30</code>; nói bạn dùng hệ điều hành nào và bạn mong đợi điều gì. “Docker hỏng rồi, cứu” thì không ai trả lời được; năm thứ trên thường đổi lại được cách sửa trong vài phút.</p>

<h3>Bảy lời khuyên để học không nản</h3>
<ol>
  <li><strong>Học mô hình trước câu lệnh.</strong> Cho Chương 1 một tiếng đồng hồ kể cả khi đang vội. Mười lăm lệnh bạn hiểu hơn trăm lệnh bạn chép.</li>
  <li><strong>Đặt tên cho mọi thứ bạn tạo.</strong> <code>--name web</code>, <code>-v pgdata:…</code>, <code>-p 8080:80</code>. Thứ có tên thì tìm được, soi được, xoá chính xác được; tên ngẫu nhiên thì chất đống.</li>
  <li><strong>Nhìn vào bên trong.</strong> <code>docker ps -a</code>, <code>docker logs</code>, <code>docker exec -it &lt;tên&gt; sh</code> trả lời phần lớn câu hỏi nhanh hơn đi tra mạng.</li>
  <li><strong>Cố ý làm hỏng trong <code>~/thu-docker</code>.</strong> Làm tràn bộ nhớ một container, xoá một container đang chứa dữ liệu, publish hai container lên cùng một cổng. Bình tĩnh nhìn mỗi lỗi một lần là lần sau nó hết đáng sợ.</li>
  <li><strong>Đọc lỗi từ cuối lên.</strong> Cụm cuối là nguyên nhân.</li>
  <li><strong>Dùng ô 🗂.</strong> Gặp chữ làm bạn khựng lại, tra ô thuật ngữ của bài đó trước khi đọc tiếp.</li>
  <li><strong>Dọn theo tên, đừng bao giờ dọn “tất cả”.</strong> Máy bạn có thể đang chạy container và volume của dự án khác. <code>docker rm -f web db</code> là an toàn; một lệnh prune (dọn) mù quáng thì không.</li>
</ol>

<h3>Lộ trình tối thiểu và lộ trình đầy đủ</h3>
${slide('dk-00', 20, 'Lộ trình: tối thiểu 2 tuần cho đồ án · đầy đủ 17 phần')}
<p><strong>Lộ trình tối thiểu — đủ cho đồ án nhóm, khoảng hai tuần (chừng 10 buổi, mỗi buổi một tiếng):</strong></p>
<table>
  <tr><th>Tuần</th><th>Học</th><th>Khi đó bạn làm được…</th></tr>
  <tr><td>1</td><td>Mục 0 (hai bài này + 0.1–0.3), Chương 1 (mô hình), Chương 2 (chạy container), Chương 4 (Dockerfile)</td><td>chạy và soi container, giải thích image khác container, viết Dockerfile cho API của mình</td></tr>
  <tr><td>2</td><td>Chương 7 (volume), Chương 8 (mạng), Chương 9 (Compose), Chương 10 (một hệ thống thật)</td><td>giữ an toàn dữ liệu CSDL, cho container nói chuyện với nhau, chạy cả đồ án bằng một lệnh</td></tr>
</table>
<p><strong>Lộ trình đầy đủ:</strong> cả 17 phần, mỗi buổi một bài, Chương 1–10 theo thứ tự. Qua hạn nộp đồ án thì quay lại Chương 3 (image và registry), 5 và 6 (build nhanh, image nhỏ và an toàn), và — trước khi đưa bất cứ thứ gì lên máy chủ — Chương 11. Chương 12 là sách công thức, mở ra giữa sự cố nào cũng được; Chương 13–16 biến Docker thành công cụ hằng ngày và kết thúc bằng dự án cuối khoá cùng bài thi.</p>

<h3>Nhịp một buổi học, và những mốc đáng ăn mừng</h3>
${slide('dk-00', 21, 'Nhịp một buổi học (~60 phút) và các mốc “mình làm được”')}
<p>Khoảng một tiếng: <strong>xem slide</strong> của bài (5 phút — nắm hình trước), <strong>đọc bài giảng</strong> (khoảng 20 phút), <strong>tự gõ lại lệnh</strong> trong <code>~/thu-docker</code> (đừng chép-dán; ngón tay cũng cần học), làm <strong>🧪 thực hành</strong> (15–20 phút), và cuối mỗi chương làm <strong>quiz 10 câu</strong>, đọc cả phần giải thích của những câu mình làm đúng. Dừng khi vẫn còn muốn học tiếp — buổi sau sẽ dễ hơn.</p>
<p>Đánh dấu những mốc này khi bạn chạm tới. Mỗi mốc là một kỹ năng thật:</p>
<ul>
  <li><strong>Mốc 1:</strong> <code>hello-world</code> in ra “Hello from Docker!” trên máy bạn.</li>
  <li><strong>Mốc 2:</strong> bạn chạy PostgreSQL trong container và kết nối được vào nó.</li>
  <li><strong>Mốc 3:</strong> bạn viết Dockerfile cho ứng dụng của chính mình và nó chạy.</li>
  <li><strong>Mốc 4:</strong> cả nhóm chạy đồ án bằng một lệnh <code>docker compose up</code>.</li>
  <li><strong>Mốc 5:</strong> ứng dụng của bạn chạy trên VPS từ image do bạn dựng.</li>
</ul>

<h3>🧪 Thực hành (10 phút — container đầu tiên và lỗi đầu tiên, ngay hôm nay)</h3>
<div class="callout ok"><ol>
<li>Tạo thư mục sân tập của khoá: <code>mkdir -p ~/thu-docker &amp;&amp; cd ~/thu-docker</code>. (Chưa có Docker? Làm bài 0.2 trước rồi quay lại.)</li>
<li>Viết kế hoạch vào <code>ke-hoach.md</code>: lộ trình nào (tối thiểu hay đầy đủ), học những ngày nào trong tuần, mỗi buổi bao lâu. Ba dòng là đủ.</li>
<li>Cố ý chạy container đầu tiên (khối lệnh bên dưới). Nó in ra một dòng rồi biến mất (<code>--rm</code>).</li>
<li>Giờ cố ý gây một lỗi: <code>docker run --rm ngnix</code>. Đọc nó từ cuối lên và viết ra, bằng lời của bạn, cụm cuối nghĩa là gì.</li>
<li>Chạy <code>docker ps -a</code> và kiểm rằng không lệnh nào để lại container.</li>
</ol>
<pre><code class="language-bash">mkdir -p ~/thu-docker &amp;&amp; cd ~/thu-docker
printf '# Kế hoạch học Docker\\nLộ trình: tối thiểu 2 tuần\\nBuổi học: tối T3, T5, T7 — 60 phút\\n' &gt; ke-hoach.md
docker run --rm alpine echo "Mốc 1: container đầu tiên của tôi — XONG"
docker run --rm alpine sh -c 'head -2 /etc/os-release; uname -m'
docker run --rm ngnix</code></pre>
<div class="out">Mốc 1: container đầu tiên của tôi — XONG
NAME="Alpine Linux"
ID=alpine
aarch64
Unable to find image 'ngnix:latest' locally
docker: Error response from daemon: pull access denied for ngnix, repository does not exist or may require 'docker login'

Run 'docker run --help' for more information</div>
<p>(Output thật trên máy Mac của khoá, 23/09/2026. <code>aarch64</code> là bộ xử lý ARM của Mac chip Apple; trên đa số laptop Windows và máy chủ bạn sẽ thấy <code>x86_64</code>.)</p>
<p><strong>Đạt khi:</strong> <code>~/thu-docker/ke-hoach.md</code> ghi rõ lộ trình và ít nhất ba ngày học, bạn đã thấy dòng “Mốc 1” của chính mình do một container in ra, bạn giải thích được rằng <code>pull access denied … does not exist</code> ở đây đơn giản là “không có image nào tên như vậy” (gõ sai), và <code>docker ps -a</code> không còn gì do các lệnh này để lại. Đó là mốc 1 — chúc mừng bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Deploy (triển khai)</span><span class="v">Đưa một phiên bản mới của ứng dụng lên cái máy mà người dùng truy cập.</span></div>
  <div class="kv"><span class="k">Docker daemon API (giao diện điều khiển Engine)</span><span class="v">Cửa mà mọi thứ — CLI, script, kẻ tấn công — dùng để ra lệnh cho Engine. Mở ra mạng không xác thực là trao luôn cái máy.</span></div>
  <div class="kv"><span class="k">Official image (image chính thức)</span><span class="v">Image do Docker và chính dự án gốc chăm sóc (<code>nginx</code>, <code>postgres</code>…), khác với image của một tài khoản lạ.</span></div>
  <div class="kv"><span class="k">Exit code 137 (mã thoát 137)</span><span class="v">Tiến trình bị giết bằng SIGKILL — rất hay là do cơ chế giết khi hết bộ nhớ.</span></div>
  <div class="kv"><span class="k">OOM — out of memory (hết bộ nhớ)</span><span class="v">Dùng quá bộ nhớ được phép; nhân Linux khi đó giết một tiến trình để bảo vệ cả máy.</span></div>
  <div class="kv"><span class="k">Bind mount (gắn thư mục máy chủ)</span><span class="v">Cho một file hay thư mục của máy chủ hiện ra bên trong container (bài 0.3, Chương 7).</span></div>
  <div class="kv"><span class="k">Scratch folder (sân tập)</span><span class="v"><code>~/thu-docker</code> — chỗ làm hỏng thoải mái trong suốt khoá học.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Không có môi trường chung, một nhóm sinh viên mất cả ngày vì lệch phiên bản và demo chết trên máy người khác; một file Compose chữa được chuyện đó.</li>
<li>Knight Capital (2012) mất hơn 460 triệu USD trong 45 phút sau một lần deploy tay sót một trong tám máy chủ — bài học là deploy tái lập được và kiểm chứng được.</li>
<li>Graboid (2019) và 17 image độc trên Docker Hub (2018) cho thấy mặt còn lại: daemon bị lộ hay image không đáng tin là trao máy cho kẻ tấn công.</li>
<li>Một dự án sinh viên thật đã dính 502 vì musl/glibc, đầy đĩa vì cache build, exit 137 vì OOM và bind mount file lẻ bỏ qua thay đổi — cái nào cũng sửa nhanh khi đã rõ mô hình.</li>
<li>Người ta bỏ Docker vì thuật ngữ, học công thức mà thiếu mô hình, và lỗi đáng sợ; hãy đọc lỗi từ cuối, tập trong <code>~/thu-docker</code>, và đặt tên cho thứ mình tạo.</li>
<li>Lộ trình tối thiểu: Mục 0 → Ch 1, 2, 4 → Ch 7, 8, 9, 10 trong khoảng hai tuần; một buổi = slide, bài giảng, tự gõ, thực hành, quiz.</li>
</ul>

<a class="link-card" href="https://en.wikipedia.org/wiki/Knight_Capital_Group" target="_blank" rel="noopener">
  <span class="lc-ico">💸</span>
  <span class="lc-body"><span class="lc-title">Wikipedia — Knight Capital Group (khoản lỗ 2012)</span><span class="lc-sub">Tám máy chủ, cái máy không được cập nhật, và quyết định của SEC mà trang này trích dẫn.</span></span>
</a>
<a class="link-card" href="https://unit42.paloaltonetworks.com/graboid-first-ever-cryptojacking-worm-found-in-images-on-docker-hub/" target="_blank" rel="noopener">
  <span class="lc-ico">🪱</span>
  <span class="lc-body"><span class="lc-title">Unit 42 — Graboid: con sâu đào tiền ảo đầu tiên lây qua image trên Docker Hub</span><span class="lc-sub">Hơn 2.000 Docker Engine không xác thực bị chiếm quyền như thế nào (2019).</span></span>
</a>
<a class="link-card" href="https://techcrunch.com/2018/06/15/tainted-crypto-mining-containers-pulled-from-docker-hub/" target="_blank" rel="noopener">
  <span class="lc-ico">☠️</span>
  <span class="lc-body"><span class="lc-title">TechCrunch — Container đào tiền ảo bị gỡ khỏi Docker Hub (2018)</span><span class="lc-sub">17 image, 5 triệu lượt kéo, khoảng 90.000 USD bằng Monero.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Tài liệu Docker — Bảo mật Docker Engine</span><span class="lc-sub">Vì sao bề mặt tấn công của daemon quan trọng và ai nên được quyền điều khiển nó.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/get-started/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Docker — hướng dẫn Get Started chính thức</span><span class="lc-sub">Một giọng nói thứ hai bên cạnh khoá này cho Mục 0 và Chương 1–4.</span></span>
</a>
<p class="note-ct"><strong>Bài kế tiếp:</strong> bài 0.0 gom mọi slide của Mục 0 vào một chỗ, và bài 0.1 soi kỹ ba cú hỏng mà Docker chấm dứt. Nếu bạn đã làm bài thực hành ở trên, bạn đã chạy container đầu tiên và đọc lỗi đầu tiên — phần còn lại dựng lên trên đó.</p>
</div>
`,
    },
    /* ─────────────────────────── 0.0 ─────────────────────────── */
    {
      title: '0.0 — Section 0 slides: Docker from the start, in pictures|||0.0 — Slide Mục 0: Docker từ đầu, bằng hình',
      slug: 'dk-0-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 40 slide của Mục 0: thùng hàng tiêu chuẩn, image và container, container so với máy ảo, dòng thời gian 1979→2022, số liệu Stack Overflow 2025, sự cố thật, lộ trình học, cài đặt, và năm phút đầu tiên — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Slides</span>
<h2>The whole of Section 0 in 40 slides</h2>
<p class="lead">Skim these before the lessons to see where Docker came from and what it does, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: the shipping-container comparison, the 1979 → 2022 timeline, container vs virtual machine, the anatomy of a <code>docker run</code> command, the single-file bind-mount trap.</p>
<p>Slides 3–13 belong to "Start here (1/2)", 14–21 to "Start here (2/2)", 22–25 to Lesson 0.1 (with slide 13, the 17-part roadmap), 26–31 to 0.2 and 32–37 to 0.3. The last three are the section's common mistakes, a cheat sheet and a 40-minute practice session. Every terminal on the slides is real output recorded on 23/09/2026 on Docker Desktop 4.91 / Engine 29.8 (Mac M1) and Docker Engine 29.6 (Linux), and every historical date was checked against its source. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Slide</span>
<h2>Cả Mục 0 trong 40 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy Docker từ đâu tới và làm được gì, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: phép so sánh thùng hàng, dòng thời gian 1979 → 2022, container so với máy ảo, giải phẫu một lệnh <code>docker run</code>, cái bẫy bind mount file lẻ.</p>
<p>Slide 3–13 thuộc bài “Bắt đầu tại đây (1/2)”, 14–21 thuộc “Bắt đầu tại đây (2/2)”, 22–25 thuộc Bài 0.1 (kèm slide 13, lộ trình 17 phần), 26–31 thuộc 0.2 và 32–37 thuộc 0.3. Ba slide cuối là những sai lầm hay gặp của Mục 0, bảng tra nhanh và một buổi thực hành 40 phút. Mọi terminal trên slide là output THẬT, ghi ngày 23/09/2026 trên Docker Desktop 4.91 / Engine 29.8 (Mac M1) và Docker Engine 29.6 (Linux), và mọi mốc lịch sử đều đã đối chiếu nguồn.</p>
</div>
${gallery('dk-00', [
  [1, 'Bìa'], [2, 'Bản đồ Mục 0'],
  [3, 'Docker là “thùng hàng tiêu chuẩn” cho phần mềm'], [4, 'Image là cái khuôn, container là bản đang chạy'], [5, '“Docker” là cả một họ — sáu cái tên'],
  [6, 'Container KHÔNG phải máy ảo thu nhỏ'], [7, 'Dòng thời gian 1979 → 2013'], [8, 'Sau 2013: OCI, containerd, Kubernetes'],
  [9, 'Vì sao nó ra đời: “máy em chạy được mà”'], [10, 'Ai dùng Docker, để làm gì'], [11, '71,1% lập trình viên dùng Docker (SO 2025)'],
  [12, 'Docker giúp gì cho BẠN'], [13, 'Lộ trình toàn khoá — 17 phần'],
  [14, 'Một tuần đồ án: không Docker vs có Docker'], [15, 'Ba sự cố có thật — đã kiểm nguồn'], [16, 'Bốn sự cố thật của một dự án sinh viên'],
  [17, 'Tình huống minh hoạ'], [18, 'Vì sao người mới hay bỏ Docker'], [19, 'Đọc lỗi Docker từ cụm cuối'],
  [20, 'Lộ trình tối thiểu 2 tuần · đầy đủ'], [21, 'Nhịp một buổi học và các mốc'],
  [22, 'Ba cú hỏng — ba cơ chế'], [23, 'Bốn thứ Docker cho — bốn thứ nó không phải'], [24, 'Image và container trong một hình'], [25, 'Đọc khoá này thế nào'],
  [26, 'Linux chạy thẳng; Mac/Windows có máy ảo'], [27, 'Năm gói và CLI chỉ là máy khách'], [28, 'docker version: hai chương trình'],
  [29, 'Nhóm docker = root'], [30, 'Mac: RAM máy ảo, file vượt biên, ARM'], [31, 'hello-world: năm bước'],
  [32, 'Giải phẫu một lệnh docker run'], [33, '-p máy:container'], [34, 'Vài tiến trình bên trong, một PID bên ngoài'],
  [35, 'Bind mount: gắn thư mục, đừng gắn file lẻ'], [36, 'Postgres và volume vô danh'], [37, 'Dùng một lần và dọn sạch thật sự'],
  [38, 'Sai lầm hay gặp ở Mục 0'], [39, 'Bảng tra nhanh Mục 0'], [40, 'Thực hành Mục 0'],
])}
`,
    },
    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — What Docker actually solves|||0.1 — Docker thật sự giải quyết cái gì',
      slug: 'dk-0-1-van-de',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba cú hỏng có thật mà container chấm dứt, bốn thứ Docker cho bạn, bốn thứ nó KHÔNG phải, khoá này dành cho ai, và bản đồ 13 mục.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>What Docker actually solves</h2>
<p class="lead">Every explanation of Docker starts with the word "container", which explains nothing to anyone who has not already understood it. So this course starts somewhere else: with three failures you have probably lived through, and the specific mechanism that makes each of them impossible.</p>

<h3>Failure 1 — "it works on my machine"</h3>
${slide('dk-00', 22, 'Ba cú hỏng quen thuộc — ba cơ chế chấm dứt chúng')}
<div class="out">$ npm run build
✓ built in 4.21s

$ ssh deploy@vps-1 'cd /srv/app &amp;&amp; npm run build'
ERROR: Cannot find module 'sharp'
Error: The module '/srv/app/node_modules/sharp/build/Release/sharp.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 127. This version requires NODE_MODULE_VERSION 108.</div>
<p>Your laptop has Node 22, the server has Node 18, and <code>sharp</code> is a native module compiled against whichever it found. Nobody wrote a bug. The code is identical. The <em>environments</em> are different, and the environment was never part of what you shipped.</p>
<p>An image fixes this by making the environment <strong>part of the artifact</strong>. The Node version, the system libraries, the compiled native modules and your code all travel together as one thing. If it built on your laptop, the same bytes run on the server.</p>
<div class="callout"><strong>Where the numbers come from.</strong> <code>NODE_MODULE_VERSION</code> is Node's ABI number — a native module only loads into the Node it was compiled for. Measured with official images on the course's Mac: Node 18 reports <code>108</code>, Node 20 <code>115</code>, Node 22 <code>127</code> (<code>docker run --rm node:22-alpine node -p process.versions.modules</code>). An earlier version of this block printed <code>115</code> for the laptop — that is Node 20's number, not Node 22's; it now says <code>127</code>.</div>

<h3>Run it step by step: see "the environment" with your own eyes</h3>
<p>"The environment" sounds abstract. It is not: it is concrete files and versions, and an image pins them. Four commands, no installation, nothing left behind (<code>--rm</code> deletes each container when it exits):</p>
<pre><code class="language-bash">docker run --rm node:18-alpine node -v
docker run --rm node:22-alpine node -v
docker run --rm alpine:3.20 sh -c 'cat /etc/alpine-release; apk info -v | grep ^libssl'
docker run --rm alpine:3.24 sh -c 'cat /etc/alpine-release; apk info -v | grep ^libssl'</code></pre>
<div class="out">v18.20.8
v22.23.2
3.20.10
libssl3-3.3.7-r0
3.24.2
libssl3-3.5.8-r0</div>
<p>(Real output, course Mac, Docker Desktop 4.91, 09/2026; the first run of each image also prints its download lines.) Read it line by line:</p>
<table>
<tr><th>Line</th><th>What it proves</th><th>Which failure it explains</th></tr>
<tr><td><code>v18.20.8</code> / <code>v22.23.2</code></td><td>Two Node versions on one machine, neither installed on it. The version is a property of the <em>image tag</em>.</td><td>Failure 1 — the version travels with the app</td></tr>
<tr><td><code>3.20.10</code> / <code>3.24.2</code></td><td>Each image carries its own Linux userland release, whatever the host runs.</td><td>Failure 2 — no "which distro do you have?"</td></tr>
<tr><td><code>libssl3-3.3.7</code> / <code>libssl3-3.5.8</code></td><td>Even the system TLS library comes from the image, so a host upgrade does not swap it under your app.</td><td>Failure 3 — the <code>libssl.so.3</code> surprise</td></tr>
</table>
<p>The flags, once: <code>run</code> creates and starts a container; <code>--rm</code> deletes it when the command finishes; <code>node:18-alpine</code> is <em>image name : tag</em>; everything after the image name is the command to run inside instead of the image's default one. Chapter 2 covers <code>run</code> in full.</p>

<h3>Failure 2 — the README that takes a day</h3>
<div class="out">## Getting started

1. Install Node 22 (nvm recommended)
2. Install PostgreSQL 16 and create a database &#96;app_dev&#96;
3. Install Redis 7
4. Install ImageMagick and libvips (macOS: brew, Ubuntu: apt, see below)
5. Copy .env.example to .env and ask someone for the values
6. Run the migrations (needs psql on PATH)
7. Seed the database
8. In three separate terminals: npm run dev, npm run worker, redis-server</div>
<p>Eight steps, four of which behave differently on macOS and Linux, and every one a chance for a new colleague to end up on a slightly different version than everyone else. Six months later nobody can reproduce a bug because no two machines are the same.</p>
<p>The Compose version of that README is one line — <code>docker compose up</code> — and it produces byte-identical PostgreSQL, Redis and libvips on every machine that runs it. Chapters 9 and 10 build exactly this.</p>

<h3>Failure 3 — the deploy that took the site down</h3>
<div class="out">$ ssh root@vps-1 'apt upgrade -y &amp;&amp; systemctl restart backend'
...
backend.service: Main process exited, code=exited, status=1/FAILURE
Error: libssl.so.3: cannot open shared object file: No such file or directory</div>
<p>An unrelated system upgrade replaced a shared library, and an application that had been running for months stopped starting. The machine drifted; the app was collateral damage.</p>
<p>A container carries its own userland — its own libssl, its own libc, its own everything above the kernel. Upgrading the host does not reach inside it. And when a deploy does go wrong, the previous image is still there, so rolling back is retagging one thing rather than reinstalling packages under pressure (Chapter 11).</p>

<h3>What Docker gives you, stated plainly</h3>
${slide('dk-00', 23, 'Bốn thứ Docker cho bạn — và bốn thứ nó KHÔNG phải')}
<div class="kv-grid">
  <div class="kv"><span class="k">Reproducibility</span><span class="v">The same image produces the same running environment on your laptop, in CI, and on the server. This is the whole point; everything else follows from it.</span></div>
  <div class="kv"><span class="k">Isolation</span><span class="v">Two projects can need Node 18 and Node 22, or PostgreSQL 14 and 16, on one machine, and never know about each other. No version managers, no conflicts, nothing to uninstall afterwards.</span></div>
  <div class="kv"><span class="k">Disposability</span><span class="v">Break a container and delete it; a new one is two seconds away, identical to the first. This changes how you experiment — "let me just try it" stops being risky.</span></div>
  <div class="kv"><span class="k">A unit you can ship</span><span class="v">One artifact, versioned and stored in a registry, that CI builds and a server pulls. Deployment becomes "run this exact thing" instead of "perform these steps and hope".</span></div>
</div>

<h3>What Docker is NOT</h3>
${slide('dk-00', 24, 'Image = file chỉ-đọc + cách chạy; container = bản đang chạy')}
<div class="kv-grid">
  <div class="kv"><span class="k">Not a virtual machine</span><span class="v">There is no guest kernel. A container is a normal Linux process with a restricted view of the system — you can see it in <code>ps</code> on the host. Chapter 1 shows exactly what the restriction consists of, and why it makes containers start in milliseconds while VMs take a minute.</span></div>
  <div class="kv"><span class="k">Not a security boundary you can lean on</span><span class="v">It is a real boundary and a useful one, but a container shares the host kernel. Running untrusted code from strangers needs more than the defaults — Chapter 6 covers what "more" means and which defaults matter.</span></div>
  <div class="kv"><span class="k">Not automatically faster or smaller</span><span class="v">A careless image is 1.4GB and rebuilds for four minutes on a one-line change. A careful one is 180MB and rebuilds in six seconds. The difference is Chapters 5 and 6, and it is entirely in your hands.</span></div>
  <div class="kv"><span class="k">Not a reason to containerise everything</span><span class="v">A static site on a CDN does not need a container. A one-off script does not need a container. The judgement of when NOT to reach for it is part of using it well, and this course says so where it applies.</span></div>
</div>
<div class="callout"><strong>The one-sentence version.</strong> An <strong>image</strong> is a read-only filesystem plus the metadata to start a process in it. A <strong>container</strong> is one running instance of that image with a writable scratch layer on top. Everything in this course — Dockerfiles, layers, volumes, networks, Compose — is machinery for building good images and running containers well. If you keep those two definitions straight, the rest composes.</div>

<h3>When to reach for Docker — and when not to</h3>
<p>"Not a reason to containerise everything" deserves a concrete rule, because beginners tend to swing from "never" to "everything":</p>
<table>
<tr><th>Situation</th><th>Docker?</th><th>Why</th></tr>
<tr><td>A team project with a database, a cache and an API</td><td>Yes</td><td>One <code>compose.yaml</code> replaces a day of setup per person and pins every version.</td></tr>
<tr><td>Trying PostgreSQL / MySQL / Redis for a course</td><td>Yes</td><td>One command, deleted cleanly, several versions side by side.</td></tr>
<tr><td>Deploying a backend to a VPS</td><td>Yes</td><td>The image that passed CI is the image that runs; rollback = previous tag.</td></tr>
<tr><td>A static site (HTML/CSS/JS only)</td><td>Usually no</td><td>A CDN or GitHub Pages serves it for free, faster, with nothing to operate.</td></tr>
<tr><td>A one-off script you run on your own laptop</td><td>No</td><td>The environment problem does not exist when there is only one environment.</td></tr>
<tr><td>A desktop GUI app, or anything needing a GPU on a Mac</td><td>No</td><td>Containers are Linux processes; macOS cannot pass its GPU into them (Chapter 14).</td></tr>
<tr><td>Running code from strangers (a judge system, student submissions)</td><td>Not by itself</td><td>The kernel is shared; you need a VM or a sandboxed runtime on top (Chapters 1, 6, 15).</td></tr>
</table>

<h3>Who this course is for</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">You have an app and no idea how to ship it</span><span class="v">Start at Chapter 1 and read in order. By Chapter 10 you will have a full stack running from one file, and by Chapter 11 it will be on a server.</span></div>
  <div class="kv"><span class="k">You copy-paste Dockerfiles that mostly work</span><span class="v">Chapters 4–6 are for you. They explain why the order of your <code>COPY</code> lines decides your build time, and how a 1.2GB image becomes 180MB without removing anything you need.</span></div>
  <div class="kv"><span class="k">You use Compose but do not trust it</span><span class="v">Chapters 7–10: what <code>depends_on</code> actually guarantees (less than you think), where your data really lives, and why one container cannot reach another by <code>localhost</code>.</span></div>
  <div class="kv"><span class="k">Something is broken right now</span><span class="v">Chapter 12 is a cookbook, readable out of order: exit 137, exit 127, a build that fails only in CI, a container that starts and immediately dies with no logs.</span></div>
</div>

<h3>The roadmap</h3>
${slide('dk-00', 13, 'Lộ trình toàn khoá — 17 phần')}
<div class="lz-map">
  <div class="lz-stage">Part 1 — The model (Ch 1–3)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Containers &amp; images: the mental model</div><div class="lz-nsub">Namespaces, cgroups and layers — what a container actually is, and the lifecycle every container follows</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Running containers</div><div class="lz-nsub"><code>run</code>, <code>exec</code>, <code>logs</code>, <code>inspect</code>, ports, environment, <code>--rm</code> — the flags you will use every day</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Images &amp; registries</div><div class="lz-nsub">Tags versus digests, Docker Hub and GHCR, pulling, pushing, and why <code>:latest</code> causes outages</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 2 — Building (Ch 4–6)</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Dockerfile, from basics to fluent</div><div class="lz-nsub">Every instruction, shell versus exec form, and the <code>CMD</code>/<code>ENTRYPOINT</code> distinction that trips up everyone once</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Layers, cache &amp; fast builds</div><div class="lz-nsub">Why <code>COPY package.json</code> comes before <code>COPY .</code> — turning a four-minute rebuild into six seconds</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Small and safe images</div><div class="lz-nsub">Multi-stage builds, alpine vs slim vs distroless, musl vs glibc, running as a non-root user, scanning</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 3 — Data, network, Compose (Ch 7–10)</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Data: volumes, bind mounts, tmpfs</div><div class="lz-nsub">Where your database actually lives, backing it up, and the file-permission problem every bind mount creates</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Networking</div><div class="lz-nsub">Bridge networks and built-in DNS, publish versus expose, why <code>localhost</code> means something different inside a container</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Docker Compose</div><div class="lz-nsub">One file for a whole stack: services, healthchecks, <code>depends_on</code>, environment, profiles, override files</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Compose in real life</div><div class="lz-nsub">A working stack — Next.js, a Node API, PostgreSQL, Redis, nginx — with migrations, seeds, and separate dev and prod files</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 4 — Production (Ch 11–12)</div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Running it in production</div><div class="lz-nsub">Restart policies, memory limits, log rotation, healthchecks, updating without downtime, CI/CD, and keeping the disk from filling</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Diagnosing containers</div><div class="lz-nsub">A cookbook: exit 137 and 127, builds that fail only in CI, containers that cannot reach each other, the wrong-architecture image</div></div></div>
</div>
<p><strong>Now 17 parts.</strong> In 09/2026 the course grew from Section 0 + 12 chapters to Section 0 + 16 chapters. Parts 1–4 above are unchanged; Part 5 turns Docker into an everyday tool and ends with a capstone project and the final exam:</p>
<div class="lz-map">
  <div class="lz-stage">Part 5 — Everyday, everything, advanced (Ch 13–16, new 09/2026)</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Docker in your daily dev loop</div><div class="lz-nsub">Dev Containers, hot reload and debugging inside containers, throwaway databases for tests, and how Docker really runs on Mac and Windows</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Docker for everything: tools, self-hosting &amp; AI</div><div class="lz-nsub">Run tools without installing them, any database in one command, self-host useful services behind HTTPS, GPUs and local AI</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Advanced: builds, security &amp; beyond one host</div><div class="lz-nsub">BuildKit and multi-platform builds, rootless Docker and Podman, Docker Swarm, and the step from Compose to Kubernetes</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Capstone: containerise and ship a real app</div><div class="lz-nsub">A clinic-booking team project from Dockerfile to CI, GHCR and a VPS, a week of production incidents — and the 20-question final exam</div></div></div>
</div>

<h3>How to read this course</h3>
${slide('dk-00', 25, 'Đọc khoá này thế nào: phần đầu theo thứ tự, phần sau để tra')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Chapters 1–3</span><span class="lz-t">In order, at a terminal</span><span class="lz-d">These build the model everything else assumes. Skipping them is why people find Docker confusing three months in — the commands work but nothing means anything.</span></div>
  <div class="lz-step"><span class="lz-k">Chapters 4–6</span><span class="lz-t">In order, with your own project open</span><span class="lz-d">Write the Dockerfile for something you actually have. The lessons are built so each one improves the file you are holding.</span></div>
  <div class="lz-step"><span class="lz-k">Chapters 7–10</span><span class="lz-t">In order — they build one stack together</span><span class="lz-d">Chapter 10 assembles what 7, 8 and 9 introduce separately. Reading 10 first is possible but you will be taking a lot on trust.</span></div>
  <div class="lz-step"><span class="lz-k">Chapters 11–12</span><span class="lz-t">Reference-shaped</span><span class="lz-d">Read 11 before you put anything on a server. Open 12 when something breaks; it is written to be searched, not studied.</span></div>
</div>
<p><strong>Chapters 13–16</strong> come after you can build and run your own stack: 13 and 14 in any order, whenever you need them; 15 when a project outgrows one machine or needs stronger isolation; 16 last, as the capstone that uses everything and ends with the final exam. If you arrived here from lesson "Start here (2/2)", its two-week minimum route (Section 0 → 1, 2, 4 → 7, 8, 9, 10) is the shortest path to a working team project.</p>

<h3>Conventions in this course</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Every output block is real</span><span class="v">The dark blocks are copied from actual runs on Docker Engine 27 / Ubuntu 24.04, including the ugly parts. Where a version matters, the lesson says so.</span></div>
  <div class="kv"><span class="k">Bilingual, side by side</span><span class="v">Every lesson exists in English and Vietnamese. The English half uses the exact terms you will meet in error messages and documentation; the Vietnamese half explains them.</span></div>
  <div class="kv"><span class="k">Diagrams, not decoration</span><span class="v">Each diagram exists to make one specific relationship visible — layers stacking, a request crossing a network boundary, a lifecycle. If a paragraph could say it as clearly, there is no diagram.</span></div>
  <div class="kv"><span class="k">A pitfall box per lesson</span><span class="v">The mistake that lesson's material actually causes, and how to recognise it from the error message. These are the parts worth re-reading.</span></div>
  <div class="kv"><span class="k">Graded practice on Code Lab</span><span class="v">Each lesson links to exercises for that chapter. Reading about layer caching and watching a rebuild go from four minutes to six seconds are different experiences.</span></div>
</div>
<div class="callout"><strong>About versions (09/2026).</strong> Outputs written with the first edition come from Docker Engine 27 on Ubuntu 24.04. Every output added in the 09/2026 upgrade was run again on Docker Desktop 4.91 / Engine 29.8 (Mac M1, arm64) and Docker Engine 29.6 (Linux, amd64), and says which machine it came from. Engine 29 stores images through containerd, so a few commands show different columns — the lessons point this out where it matters. Slides use the same real outputs.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your SWP391 teammate writes in the group chat: "The upload feature works on my laptop (Node 20) but crashes on the school server (Node 18) with <em>NODE_MODULE_VERSION</em>. The code is the same, so the server must be broken." Show them — with commands, not opinions — that the environment is the difference, and that an image pins it.</p><ol>
<li><code>mkdir -p ~/thu-docker/0-1 &amp;&amp; cd ~/thu-docker/0-1</code></li>
<li>Print the ABI number of Node 18, 20 and 22 with the three <code>node -p process.versions.modules</code> commands from the Start-here lesson. Which two numbers explain your teammate's crash?</li>
<li>Print the <code>libssl</code> package of <code>alpine:3.20</code> and <code>alpine:3.24</code> (block "Run it step by step" above). Which of the three failures does this pair explain?</li>
<li>Write a three-line <code>ghi-chu.md</code>: for each failure (1, 2, 3), one sentence saying which Docker mechanism ends it — image, Compose, or rollback to a previous image.</li>
<li>Check <code>docker ps -a</code>: thanks to <code>--rm</code> nothing should be left.</li>
</ol>
<p><strong>Done when:</strong> you can say "the module was built for 115 (Node 20) and the server offers 108 (Node 18)", your note maps each failure to one mechanism, and <code>docker ps -a</code> shows no container from this exercise.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Environment</span><span class="v">Everything around your code that it needs to run: language version, system libraries, OS files, configuration.</span></div>
  <div class="kv"><span class="k">Native module / ABI</span><span class="v">A compiled add-on (like <code>sharp</code>) that only loads into the runtime version it was built for; the ABI number identifies that version.</span></div>
  <div class="kv"><span class="k">Reproducibility</span><span class="v">Getting the same running result from the same artifact on any machine — Docker's core promise.</span></div>
  <div class="kv"><span class="k">Isolation</span><span class="v">Two projects' versions and files not seeing or disturbing each other on one machine.</span></div>
  <div class="kv"><span class="k">Userland</span><span class="v">The part of an OS above the kernel: libc, libssl, shell, tools. A container brings its own.</span></div>
  <div class="kv"><span class="k">Artifact</span><span class="v">The one versioned thing you ship — here, an image stored in a registry.</span></div>
  <div class="kv"><span class="k">Rollback</span><span class="v">Returning to the previous working version; with images, starting the previous tag.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>"Works on my machine", the day-long README and the upgrade that broke the app all have one cause: the environment was not part of what you shipped.</li>
<li>An image makes the environment part of the artifact — Node version, system libraries and native modules travel with the code.</li>
<li>Docker gives reproducibility, isolation, disposability and a shippable unit; it is not a VM, not a strong security boundary on its own, not automatically small, and not for everything.</li>
<li>An image is a read-only filesystem plus start-up metadata; a container is one running instance with a writable scratch layer.</li>
<li>Reach for Docker for team environments, databases and deployments; skip it for static sites, one-off local scripts and untrusted code on its own.</li>
<li>The course now has 17 parts: Section 0, Chapters 1–12 in four parts, and Chapters 13–16 on daily use, everything else, advanced topics and a capstone.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/get-started/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Docker — official Get Started guide</span><span class="lc-sub">The vendor's own introduction, kept current with each release. Useful as a second voice on Chapters 1–4, and the place to check when a flag in this course has changed.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/dockerfile/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Dockerfile reference</span><span class="lc-sub">Every instruction with its exact semantics. You will come back to this many times — bookmark it now rather than searching for it later.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: the Docker track on Code Lab</span><span class="lc-sub">Graded exercises for every chapter, in a real environment. Start here after Lesson 0.3 and keep the tab open as you read.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> learning the commands before the model. It is entirely possible to memorise <code>docker run -d -p 8080:80 nginx</code> and use it successfully for a year without knowing what any of it means — until the day a port does not publish, a volume does not persist, or a container cannot reach another one. Every question in Chapter 12 is answerable in seconds if you hold the model from Chapter 1, and unanswerable without it. Give Chapter 1 an hour; it repays it many times over.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Docker's actual product is <em>reproducibility</em> — the environment becomes part of what you ship, and the three failures at the top of this lesson all come from it not being. An image is a read-only filesystem plus start-up metadata; a container is one running instance of it. And a container is a process, not a virtual machine — that single fact explains the speed, the size, the sharing of the host kernel, and most of the surprises.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Docker thật sự giải quyết cái gì</h2>
<p class="lead">Mọi lời giải thích về Docker đều mở đầu bằng chữ "container", và chữ đó không giải thích được gì cho người chưa hiểu nó. Nên khoá này bắt đầu từ chỗ khác: từ ba cú hỏng mà rất có thể bạn đã sống qua, và từ cơ chế cụ thể khiến mỗi cú hỏng đó trở thành bất khả.</p>

<h3>Cú hỏng 1 — "máy tôi chạy được mà"</h3>
${slide('dk-00', 22, 'Ba cú hỏng quen thuộc — ba cơ chế chấm dứt chúng')}
<div class="out">$ npm run build
✓ built in 4.21s

$ ssh deploy@vps-1 'cd /srv/app &amp;&amp; npm run build'
ERROR: Cannot find module 'sharp'
Error: The module '/srv/app/node_modules/sharp/build/Release/sharp.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 127. This version requires NODE_MODULE_VERSION 108.</div>
<p>Laptop của bạn chạy Node 22, máy chủ chạy Node 18, và <code>sharp</code> là một mô-đun native được biên dịch theo cái nào nó tìm thấy. Không ai viết ra con bọ nào cả. Mã thì giống hệt. <em>MÔI TRƯỜNG</em> mới khác nhau, và môi trường thì chưa bao giờ nằm trong thứ bạn đem đi.</p>
<p>Một image chữa chuyện này bằng cách biến môi trường thành <strong>MỘT PHẦN CỦA CÁI ĐEM ĐI</strong>. Phiên bản Node, các thư viện hệ thống, những mô-đun native đã biên dịch và mã của bạn cùng đi chung như một thứ duy nhất. Dựng được trên laptop thì đúng những byte đó chạy trên máy chủ.</p>
<div class="callout"><strong>Những con số đó từ đâu ra.</strong> <code>NODE_MODULE_VERSION</code> là số ABI của Node — một mô-đun native chỉ nạp được vào đúng phiên bản Node mà nó được biên dịch cho. Đo bằng image chính thức trên máy Mac của khoá: Node 18 báo <code>108</code>, Node 20 báo <code>115</code>, Node 22 báo <code>127</code> (<code>docker run --rm node:22-alpine node -p process.versions.modules</code>). Bản trước của khối output này in <code>115</code> cho laptop — đó là số của Node 20, không phải Node 22; giờ đã sửa thành <code>127</code>.</div>

<h3>Chạy thử từng bước: tận mắt thấy “môi trường” là gì</h3>
<p>“Môi trường” nghe trừu tượng. Nó không trừu tượng: nó là những file và phiên bản cụ thể, và image ghim chúng lại. Bốn lệnh, không cài gì, không để lại gì (<code>--rm</code> xoá từng container khi nó chạy xong):</p>
<pre><code class="language-bash">docker run --rm node:18-alpine node -v
docker run --rm node:22-alpine node -v
docker run --rm alpine:3.20 sh -c 'cat /etc/alpine-release; apk info -v | grep ^libssl'
docker run --rm alpine:3.24 sh -c 'cat /etc/alpine-release; apk info -v | grep ^libssl'</code></pre>
<div class="out">v18.20.8
v22.23.2
3.20.10
libssl3-3.3.7-r0
3.24.2
libssl3-3.5.8-r0</div>
<p>(Output thật, máy Mac của khoá, Docker Desktop 4.91, 09/2026; lần chạy đầu của mỗi image còn in thêm các dòng tải về.) Đọc từng dòng:</p>
<table>
<tr><th>Dòng</th><th>Nó chứng minh điều gì</th><th>Giải thích cú hỏng nào</th></tr>
<tr><td><code>v18.20.8</code> / <code>v22.23.2</code></td><td>Hai phiên bản Node trên cùng một máy, không bản nào được cài lên máy. Phiên bản là thuộc tính của <em>tag image</em>.</td><td>Cú hỏng 1 — phiên bản đi theo ứng dụng</td></tr>
<tr><td><code>3.20.10</code> / <code>3.24.2</code></td><td>Mỗi image mang theo bản phát hành userland Linux của riêng nó, máy chủ chạy gì cũng mặc.</td><td>Cú hỏng 2 — hết câu “máy bạn bản phân phối nào?”</td></tr>
<tr><td><code>libssl3-3.3.7</code> / <code>libssl3-3.5.8</code></td><td>Đến cả thư viện TLS của hệ thống cũng đến từ image, nên nâng cấp máy chủ không tráo nó dưới chân ứng dụng.</td><td>Cú hỏng 3 — bất ngờ <code>libssl.so.3</code></td></tr>
</table>
<p>Các cờ, nói một lần: <code>run</code> tạo rồi khởi chạy một container; <code>--rm</code> xoá nó khi lệnh chạy xong; <code>node:18-alpine</code> là <em>tên image : tag</em>; mọi thứ sau tên image là lệnh chạy bên trong, thay cho lệnh mặc định của image. Chương 2 dạy trọn vẹn lệnh <code>run</code>.</p>

<h3>Cú hỏng 2 — cái README ngốn hết một ngày</h3>
<div class="out">## Bắt đầu

1. Cài Node 22 (nên dùng nvm)
2. Cài PostgreSQL 16 và tạo cơ sở dữ liệu &#96;app_dev&#96;
3. Cài Redis 7
4. Cài ImageMagick và libvips (macOS: brew, Ubuntu: apt, xem bên dưới)
5. Chép .env.example thành .env rồi hỏi ai đó xin giá trị
6. Chạy migration (cần psql nằm trên PATH)
7. Seed cơ sở dữ liệu
8. Mở ba terminal riêng: npm run dev, npm run worker, redis-server</div>
<p>Tám bước, bốn trong số đó hành xử khác nhau trên macOS và Linux, và mỗi bước là một cơ hội để một đồng nghiệp mới kết thúc ở một phiên bản hơi khác mọi người. Sáu tháng sau không ai tái hiện được một con bọ vì không có hai cái máy nào giống nhau.</p>
<p>Bản Compose của cái README đó dài một dòng — <code>docker compose up</code> — và nó tạo ra PostgreSQL, Redis và libvips giống nhau tới từng byte trên mọi máy chạy nó. Chương 9 và 10 dựng đúng cái này.</p>

<h3>Cú hỏng 3 — bản deploy làm sập trang</h3>
<div class="out">$ ssh root@vps-1 'apt upgrade -y &amp;&amp; systemctl restart backend'
...
backend.service: Main process exited, code=exited, status=1/FAILURE
Error: libssl.so.3: cannot open shared object file: No such file or directory</div>
<p>Một lần nâng cấp hệ thống chẳng liên quan đã thay một thư viện chia sẻ, và một ứng dụng chạy êm hàng tháng trời bỗng không khởi động được. Cái máy TRÔI DẠT; ứng dụng chỉ là thiệt hại kèm theo.</p>
<p>Một container mang theo phần userland của riêng nó — libssl riêng, libc riêng, mọi thứ phía trên nhân đều là của riêng nó. Nâng cấp máy chủ không với tới bên trong nó được. Và khi một bản deploy có hỏng thật thì ảnh cũ vẫn còn đó, nên quay lui chỉ là gắn lại một cái tag chứ không phải cài lại các gói trong lúc đang bị dồn ép (Chương 11).</p>

<h3>Docker cho bạn cái gì, nói thẳng</h3>
${slide('dk-00', 23, 'Bốn thứ Docker cho bạn — và bốn thứ nó KHÔNG phải')}
<div class="kv-grid">
  <div class="kv"><span class="k">Tái lập được</span><span class="v">Cùng một image tạo ra cùng một môi trường chạy trên laptop của bạn, trong CI, và trên máy chủ. Đây là toàn bộ điểm mấu chốt; mọi thứ khác đều suy ra từ đó.</span></div>
  <div class="kv"><span class="k">Cô lập</span><span class="v">Hai dự án có thể cùng cần Node 18 và Node 22, hoặc PostgreSQL 14 và 16, trên một cái máy, mà không biết tới nhau. Không cần trình quản lý phiên bản, không xung đột, không có gì phải gỡ về sau.</span></div>
  <div class="kv"><span class="k">Vứt đi được</span><span class="v">Phá một container rồi xoá nó đi; một cái mới cách bạn hai giây, giống hệt cái đầu. Điều đó đổi cách bạn thử nghiệm — "để tôi thử phát xem sao" thôi còn là chuyện rủi ro.</span></div>
  <div class="kv"><span class="k">Một đơn vị đem đi được</span><span class="v">Một hiện vật duy nhất, có phiên bản và nằm trong registry, do CI dựng và máy chủ kéo về. Triển khai trở thành "chạy đúng cái này" thay vì "làm theo mấy bước này rồi cầu may".</span></div>
</div>

<h3>Docker KHÔNG phải cái gì</h3>
${slide('dk-00', 24, 'Image = file chỉ-đọc + cách chạy; container = bản đang chạy')}
<div class="kv-grid">
  <div class="kv"><span class="k">Không phải máy ảo</span><span class="v">Không có nhân khách nào cả. Một container là một tiến trình Linux bình thường với tầm nhìn bị hạn chế về hệ thống — bạn thấy được nó trong <code>ps</code> ở máy chủ. Chương 1 chỉ ra chính xác cái hạn chế đó gồm những gì, và vì sao container khởi động trong mili giây còn máy ảo mất cả phút.</span></div>
  <div class="kv"><span class="k">Không phải một ranh giới an ninh để dựa hẳn vào</span><span class="v">Nó là một ranh giới thật và hữu ích, nhưng container DÙNG CHUNG nhân với máy chủ. Chạy mã không đáng tin của người lạ thì cần nhiều hơn mức mặc định — Chương 6 nói "nhiều hơn" nghĩa là gì và mặc định nào đáng quan tâm.</span></div>
  <div class="kv"><span class="k">Không tự động nhanh hơn hay nhẹ hơn</span><span class="v">Một cái ảnh làm cẩu thả nặng 1,4GB và dựng lại mất bốn phút chỉ vì đổi một dòng. Một cái làm cẩn thận nặng 180MB và dựng lại trong sáu giây. Khác biệt nằm ở Chương 5 và 6, và nó hoàn toàn trong tay bạn.</span></div>
  <div class="kv"><span class="k">Không phải lý do để đóng gói MỌI THỨ</span><span class="v">Một trang tĩnh trên CDN không cần container. Một script chạy một lần không cần container. Cái phán đoán biết KHI NÀO KHÔNG nên với tay tới nó cũng là một phần của việc dùng nó giỏi, và khoá này nói thẳng ở những chỗ có liên quan.</span></div>
</div>
<div class="callout"><strong>Bản một câu.</strong> Một <strong>IMAGE</strong> là một hệ thống file chỉ-đọc cộng với phần siêu dữ liệu để khởi chạy một tiến trình bên trong nó. Một <strong>CONTAINER</strong> là một bản đang chạy của cái image đó, có thêm một tầng nháp ghi được nằm trên. Mọi thứ trong khoá này — Dockerfile, tầng ảnh, volume, mạng, Compose — đều là bộ máy để dựng ảnh tốt và chạy container cho khéo. Giữ đúng hai định nghĩa đó thì phần còn lại tự ghép vào.</div>

<h3>Khi nào nên dùng Docker — và khi nào KHÔNG</h3>
<p>Câu “không phải lý do để đóng gói mọi thứ” đáng có một quy tắc cụ thể, vì người mới hay đi từ “không bao giờ” sang “mọi thứ”:</p>
<table>
<tr><th>Tình huống</th><th>Dùng Docker?</th><th>Vì sao</th></tr>
<tr><td>Đồ án nhóm có CSDL, cache và API</td><td>Có</td><td>Một <code>compose.yaml</code> thay cho cả ngày cài đặt của mỗi người và ghim mọi phiên bản.</td></tr>
<tr><td>Thử PostgreSQL / MySQL / Redis cho một môn học</td><td>Có</td><td>Một lệnh, xoá sạch sẽ, chạy song song nhiều phiên bản.</td></tr>
<tr><td>Deploy backend lên VPS</td><td>Có</td><td>Image đã qua CI chính là image chạy thật; quay lui = tag trước đó.</td></tr>
<tr><td>Trang web tĩnh (chỉ HTML/CSS/JS)</td><td>Thường là không</td><td>CDN hoặc GitHub Pages phục vụ miễn phí, nhanh hơn, không phải vận hành gì.</td></tr>
<tr><td>Script chạy một lần trên chính laptop của bạn</td><td>Không</td><td>Bài toán môi trường không tồn tại khi chỉ có đúng một môi trường.</td></tr>
<tr><td>Ứng dụng giao diện desktop, hoặc thứ cần GPU trên Mac</td><td>Không</td><td>Container là tiến trình Linux; macOS không cho GPU của nó vào container (Chương 14).</td></tr>
<tr><td>Chạy mã của người lạ (hệ thống chấm bài, bài nộp của sinh viên)</td><td>Không, nếu chỉ có nó</td><td>Nhân dùng chung; cần thêm máy ảo hoặc môi trường chạy có hộp cát (Chương 1, 6, 15).</td></tr>
</table>

<h3>Khoá này dành cho ai</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bạn có một ứng dụng và không biết đem nó lên mạng kiểu gì</span><span class="v">Hãy bắt đầu ở Chương 1 và đọc theo thứ tự. Tới Chương 10 bạn sẽ có cả một hệ thống chạy từ một file, và tới Chương 11 nó sẽ nằm trên máy chủ.</span></div>
  <div class="kv"><span class="k">Bạn chép Dockerfile của người khác và nó gần như chạy được</span><span class="v">Chương 4–6 dành cho bạn. Chúng giải thích vì sao thứ tự các dòng <code>COPY</code> quyết định thời gian dựng của bạn, và làm sao một ảnh 1,2GB thành 180MB mà không bỏ đi thứ gì bạn cần.</span></div>
  <div class="kv"><span class="k">Bạn dùng Compose mà không tin nó</span><span class="v">Chương 7–10: <code>depends_on</code> thật sự bảo đảm cái gì (ít hơn bạn tưởng), dữ liệu của bạn nằm ở đâu thật, và vì sao container này không gọi container kia bằng <code>localhost</code> được.</span></div>
  <div class="kv"><span class="k">Có thứ đang hỏng ngay lúc này</span><span class="v">Chương 12 là sách công thức, đọc lộn xộn được: exit 137, exit 127, một bản dựng chỉ hỏng trong CI, một container lên rồi chết ngay mà không có log nào.</span></div>
</div>

<h3>Lộ trình</h3>
${slide('dk-00', 13, 'Lộ trình toàn khoá — 17 phần')}
<div class="lz-map">
  <div class="lz-stage">Phần 1 — Mô hình (Chương 1–3)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Container &amp; image: mô hình tư duy</div><div class="lz-nsub">Namespace, cgroup và tầng ảnh — container THẬT RA là gì, và vòng đời mà mọi container đều đi qua</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Chạy container</div><div class="lz-nsub"><code>run</code>, <code>exec</code>, <code>logs</code>, <code>inspect</code>, cổng, biến môi trường, <code>--rm</code> — những cờ bạn sẽ dùng mỗi ngày</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Image &amp; registry</div><div class="lz-nsub">Tag so với digest, Docker Hub và GHCR, kéo, đẩy, và vì sao <code>:latest</code> gây sự cố</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 2 — Dựng ảnh (Chương 4–6)</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Dockerfile, từ cơ bản tới trôi chảy</div><div class="lz-nsub">Mọi chỉ thị, dạng shell so với dạng exec, và khác biệt <code>CMD</code>/<code>ENTRYPOINT</code> khiến ai cũng vấp đúng một lần</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Tầng ảnh, cache &amp; dựng nhanh</div><div class="lz-nsub">Vì sao <code>COPY package.json</code> phải đứng trước <code>COPY .</code> — biến bốn phút dựng lại thành sáu giây</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Ảnh nhỏ và an toàn</div><div class="lz-nsub">Dựng nhiều tầng, alpine với slim với distroless, musl với glibc, chạy dưới người dùng không phải root, quét lỗ hổng</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 3 — Dữ liệu, mạng, Compose (Chương 7–10)</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Dữ liệu: volume, bind mount, tmpfs</div><div class="lz-nsub">Cơ sở dữ liệu của bạn thật ra nằm ở đâu, sao lưu nó thế nào, và bài toán quyền file mà mọi bind mount đều tạo ra</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Mạng</div><div class="lz-nsub">Mạng bridge và DNS có sẵn, publish so với expose, vì sao <code>localhost</code> mang nghĩa khác bên trong container</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Docker Compose</div><div class="lz-nsub">Một file cho cả hệ thống: service, healthcheck, <code>depends_on</code>, biến môi trường, profile, file ghi đè</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Compose trong đời thật</div><div class="lz-nsub">Một hệ thống chạy được — Next.js, một API Node, PostgreSQL, Redis, nginx — kèm migration, seed, và file dev tách khỏi file prod</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 4 — Production (Chương 11–12)</div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Vận hành trên production</div><div class="lz-nsub">Chính sách khởi động lại, trần bộ nhớ, xoay vòng log, healthcheck, cập nhật không gián đoạn, CI/CD, và giữ cho đĩa khỏi đầy</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Chẩn đoán container</div><div class="lz-nsub">Sách công thức: exit 137 và 127, bản dựng chỉ hỏng trong CI, container không với tới nhau, ảnh sai kiến trúc</div></div></div>
</div>
<p><strong>Giờ là 17 phần.</strong> Tháng 9/2026 khoá lớn lên từ Mục 0 + 12 chương thành Mục 0 + 16 chương. Phần 1–4 ở trên giữ nguyên; Phần 5 biến Docker thành công cụ hằng ngày và kết thúc bằng dự án cuối khoá cùng bài thi:</p>
<div class="lz-map">
  <div class="lz-stage">Phần 5 — Hằng ngày, mọi việc, nâng cao (Chương 13–16, mới 09/2026)</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Docker trong vòng lặp phát triển hằng ngày</div><div class="lz-nsub">Dev Containers, sửa mã thấy ngay và gỡ lỗi bên trong container, CSDL dùng-một-lần cho test, và Docker thật ra chạy thế nào trên Mac và Windows</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Docker cho mọi việc: công cụ, tự host &amp; AI</div><div class="lz-nsub">Chạy công cụ không cần cài, mọi loại CSDL trong một lệnh, tự host dịch vụ hữu ích sau HTTPS, GPU và AI chạy cục bộ</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Nâng cao: build, bảo mật &amp; vượt khỏi một máy</div><div class="lz-nsub">BuildKit và build đa nền tảng, Docker rootless và Podman, Docker Swarm, và bước chuyển từ Compose sang Kubernetes</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Dự án cuối khoá: đóng gói và đưa một ứng dụng thật lên production</div><div class="lz-nsub">Đồ án nhóm đặt lịch phòng khám từ Dockerfile tới CI, GHCR và VPS, một tuần sự cố production — và bài thi cuối khoá 20 câu</div></div></div>
</div>

<h3>Đọc khoá này thế nào</h3>
${slide('dk-00', 25, 'Đọc khoá này thế nào: phần đầu theo thứ tự, phần sau để tra')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Chương 1–3</span><span class="lz-t">Theo thứ tự, ngồi trước một cái terminal</span><span class="lz-d">Mấy chương này dựng nên cái mô hình mà mọi thứ còn lại giả định là bạn đã có. Bỏ qua chúng là lý do ba tháng sau người ta thấy Docker rối rắm — lệnh thì chạy được mà chẳng cái gì có ý nghĩa.</span></div>
  <div class="lz-step"><span class="lz-k">Chương 4–6</span><span class="lz-t">Theo thứ tự, mở sẵn dự án của chính bạn</span><span class="lz-d">Hãy viết Dockerfile cho một thứ bạn thật sự có. Các bài được dựng sao cho mỗi bài cải thiện đúng cái file bạn đang cầm.</span></div>
  <div class="lz-step"><span class="lz-k">Chương 7–10</span><span class="lz-t">Theo thứ tự — chúng cùng dựng nên một hệ thống</span><span class="lz-d">Chương 10 lắp ráp những thứ mà 7, 8 và 9 giới thiệu riêng lẻ. Đọc 10 trước thì vẫn được nhưng bạn sẽ phải tin rất nhiều thứ mà chưa hiểu.</span></div>
  <div class="lz-step"><span class="lz-k">Chương 11–12</span><span class="lz-t">Dạng tra cứu</span><span class="lz-d">Hãy đọc 11 TRƯỚC KHI đưa bất cứ thứ gì lên máy chủ. Mở 12 khi có thứ hỏng; nó được viết để TÌM KIẾM, không phải để học thuộc.</span></div>
</div>
<p><strong>Chương 13–16</strong> đến sau khi bạn đã dựng và chạy được hệ thống của mình: 13 và 14 đọc theo thứ tự nào cũng được, lúc nào cần thì mở; 15 khi dự án vượt khỏi một máy hoặc cần cô lập chặt hơn; 16 để cuối cùng, như một dự án tổng hợp dùng mọi thứ và kết thúc bằng bài thi. Nếu bạn đến đây từ bài “Bắt đầu tại đây (2/2)”, lộ trình tối thiểu hai tuần của bài đó (Mục 0 → 1, 2, 4 → 7, 8, 9, 10) là đường ngắn nhất tới một đồ án nhóm chạy được.</p>

<h3>Quy ước trong khoá này</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mọi khối output đều là thật</span><span class="v">Những khối nền tối được chép từ những lượt chạy thật trên Docker Engine 27 / Ubuntu 24.04, kể cả những chỗ xấu xí. Chỗ nào phiên bản có ảnh hưởng thì bài học nói rõ.</span></div>
  <div class="kv"><span class="k">Song ngữ, đặt cạnh nhau</span><span class="v">Mọi bài đều có bản tiếng Anh và tiếng Việt. Nửa tiếng Anh dùng đúng những thuật ngữ bạn sẽ gặp trong thông báo lỗi và tài liệu; nửa tiếng Việt giải thích chúng.</span></div>
  <div class="kv"><span class="k">Sơ đồ, không phải trang trí</span><span class="v">Mỗi sơ đồ tồn tại để làm hiện ra MỘT quan hệ cụ thể — các tầng ảnh chồng lên nhau, một request vượt qua ranh giới mạng, một vòng đời. Nếu một đoạn văn nói được rõ như thế thì không có sơ đồ.</span></div>
  <div class="kv"><span class="k">Mỗi bài một hộp bẫy</span><span class="v">Đúng cái lỗi mà nội dung bài đó thật sự gây ra, và cách nhận ra nó từ thông báo lỗi. Đây là những phần đáng đọc lại.</span></div>
  <div class="kv"><span class="k">Bài chấm điểm trên Code Lab</span><span class="v">Mỗi bài đều dẫn tới bài luyện của chương đó. Đọc về cache theo tầng và TẬN MẮT nhìn một lượt dựng lại tụt từ bốn phút xuống sáu giây là hai trải nghiệm khác nhau.</span></div>
</div>
<div class="callout"><strong>Về phiên bản (09/2026).</strong> Output viết ở lần soạn đầu tiên đến từ Docker Engine 27 trên Ubuntu 24.04. Mọi output thêm vào trong đợt nâng cấp 09/2026 đều được chạy lại trên Docker Desktop 4.91 / Engine 29.8 (Mac M1, arm64) và Docker Engine 29.6 (Linux, amd64), và có ghi rõ máy nào. Engine 29 lưu image qua containerd, nên vài lệnh hiện cột khác đi — bài học chỉ ra chỗ nào điều đó quan trọng. Slide dùng đúng những output thật đó.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn cùng nhóm SWP391 nhắn vào nhóm chat: “Chức năng upload chạy ngon trên laptop mình (Node 20) mà lên máy chủ của trường (Node 18) thì sập, báo <em>NODE_MODULE_VERSION</em>. Mã y hệt, chắc máy chủ hỏng.” Hãy chỉ cho bạn ấy — bằng lệnh, không bằng ý kiến — rằng môi trường mới là chỗ khác nhau, và image ghim được nó.</p><ol>
<li><code>mkdir -p ~/thu-docker/0-1 &amp;&amp; cd ~/thu-docker/0-1</code></li>
<li>In số ABI của Node 18, 20 và 22 bằng ba lệnh <code>node -p process.versions.modules</code> trong bài “Bắt đầu tại đây”. Hai con số nào giải thích cú sập của bạn ấy?</li>
<li>In gói <code>libssl</code> của <code>alpine:3.20</code> và <code>alpine:3.24</code> (khối “Chạy thử từng bước” ở trên). Cặp này giải thích cú hỏng nào trong ba cú?</li>
<li>Viết một file <code>ghi-chu.md</code> ba dòng: với mỗi cú hỏng (1, 2, 3), một câu nói cơ chế nào của Docker chấm dứt nó — image, Compose, hay quay về image trước.</li>
<li>Kiểm <code>docker ps -a</code>: nhờ <code>--rm</code>, không được còn gì.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được “mô-đun được dịch cho 115 (Node 20) còn máy chủ chỉ có 108 (Node 18)”, ghi chú của bạn nối mỗi cú hỏng với đúng một cơ chế, và <code>docker ps -a</code> không còn container nào của bài này.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Environment (môi trường)</span><span class="v">Mọi thứ quanh mã nguồn mà nó cần để chạy: phiên bản ngôn ngữ, thư viện hệ thống, file hệ điều hành, cấu hình.</span></div>
  <div class="kv"><span class="k">Native module / ABI (mô-đun biên dịch / giao diện nhị phân)</span><span class="v">Phần bổ sung đã biên dịch (như <code>sharp</code>) chỉ nạp được vào đúng phiên bản runtime nó được dựng cho; số ABI định danh phiên bản đó.</span></div>
  <div class="kv"><span class="k">Reproducibility (tái lập được)</span><span class="v">Cùng một hiện vật cho ra cùng một kết quả chạy trên mọi máy — lời hứa cốt lõi của Docker.</span></div>
  <div class="kv"><span class="k">Isolation (cô lập)</span><span class="v">Phiên bản và file của hai dự án không thấy, không phá nhau trên cùng một máy.</span></div>
  <div class="kv"><span class="k">Userland (phần hệ điều hành trên nhân)</span><span class="v">Phần của hệ điều hành nằm trên nhân: libc, libssl, shell, công cụ. Container mang theo của riêng nó.</span></div>
  <div class="kv"><span class="k">Artifact (hiện vật)</span><span class="v">Thứ duy nhất, có phiên bản, mà bạn đem đi — ở đây là một image nằm trong registry.</span></div>
  <div class="kv"><span class="k">Rollback (quay lui)</span><span class="v">Trở về phiên bản chạy tốt trước đó; với image, là chạy lại tag trước.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>“Máy tôi chạy được”, cái README ngốn cả ngày và lần nâng cấp làm sập ứng dụng có chung một gốc: môi trường không nằm trong thứ bạn đem đi.</li>
<li>Image biến môi trường thành một phần của hiện vật — phiên bản Node, thư viện hệ thống và mô-đun native đi cùng mã nguồn.</li>
<li>Docker cho khả năng tái lập, cô lập, vứt đi được và một đơn vị đem đi được; nó không phải máy ảo, không tự nó là ranh giới an ninh mạnh, không tự động nhỏ, và không dành cho mọi thứ.</li>
<li>Image là hệ thống file chỉ-đọc cộng siêu dữ liệu khởi động; container là một bản đang chạy có thêm tầng nháp ghi được.</li>
<li>Dùng Docker cho môi trường nhóm, CSDL và deploy; bỏ qua với trang tĩnh, script chạy một lần trên máy mình và mã không đáng tin nếu chỉ có mỗi nó.</li>
<li>Khoá giờ có 17 phần: Mục 0, Chương 1–12 chia bốn phần, và Chương 13–16 về dùng hằng ngày, mọi việc khác, chủ đề nâng cao và dự án cuối khoá.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/get-started/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Docker — hướng dẫn Get Started chính thức</span><span class="lc-sub">Bài giới thiệu của chính nhà phát hành, cập nhật theo từng bản. Hữu ích như một giọng nói thứ hai cho Chương 1–4, và là chỗ để kiểm khi một cái cờ trong khoá này đã đổi.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/dockerfile/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Tài liệu tra cứu Dockerfile</span><span class="lc-sub">Mọi chỉ thị kèm ngữ nghĩa chính xác. Bạn sẽ quay lại đây nhiều lần — hãy đánh dấu nó ngay bây giờ thay vì đi tìm sau.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: track Docker trên Code Lab</span><span class="lc-sub">Bài chấm điểm cho mọi chương, trong một môi trường thật. Hãy bắt đầu ở đây sau Bài 0.3 và để tab đó mở suốt lúc đọc.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> học thuộc câu lệnh trước khi hiểu mô hình. Hoàn toàn có thể thuộc lòng <code>docker run -d -p 8080:80 nginx</code> rồi dùng nó trót lọt cả năm mà không biết một chữ nào trong đó nghĩa là gì — cho tới cái ngày một cổng không publish được, một volume không giữ được dữ liệu, hay một container không với tới được container khác. Mọi câu hỏi trong Chương 12 đều trả lời được trong vài giây nếu bạn giữ được mô hình của Chương 1, và không trả lời nổi nếu không có nó. Hãy cho Chương 1 một tiếng đồng hồ; nó trả lại nhiều lần con số đó.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Sản phẩm thật sự của Docker là <em>KHẢ NĂNG TÁI LẬP</em> — môi trường trở thành một phần của thứ bạn đem đi, và cả ba cú hỏng ở đầu bài này đều bắt nguồn từ việc nó KHÔNG như vậy. Một image là một hệ thống file chỉ-đọc cộng siêu dữ liệu khởi động; một container là một bản đang chạy của nó. Và một container là một TIẾN TRÌNH, không phải máy ảo — riêng sự thật đó giải thích được tốc độ, kích thước, việc dùng chung nhân với máy chủ, và phần lớn những bất ngờ.</p>
</div>
`,
    },
    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — Installing Docker, and what you actually installed|||0.2 — Cài Docker, và bạn vừa cài cái gì',
      slug: 'dk-0-2-cai-dat',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Engine với Desktop, cài trên Ubuntu bằng kho apt chính thức, nhóm docker và cái giá an ninh của nó, macOS và Windows/WSL2, kiểm tra bằng docker version, và hello-world giải thích từng dòng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Installing Docker, and what you actually installed</h2>
<p class="lead">Docker on Linux and "Docker" on macOS or Windows are not the same shape of thing, and knowing the difference explains several confusing behaviours later — why file access is slow on a Mac, why your Windows paths behave strangely, and why the same command needs <code>sudo</code> on one machine and not another.</p>

<h3>Engine, Desktop, and the alternatives</h3>
${slide('dk-00', 26, 'Linux chạy Docker thẳng; Mac và Windows có một máy ảo ở giữa')}
<div class="kv-grid">
  <div class="kv"><span class="k">Docker Engine (Linux)</span><span class="v">The real thing: a daemon (<code>dockerd</code>) running directly on your kernel plus a CLI that talks to it. Free, open source, no GUI. This is what runs on every server, and what this course's outputs come from.</span></div>
  <div class="kv"><span class="k">Docker Desktop (macOS / Windows)</span><span class="v">A Linux virtual machine with Engine inside it, plus a GUI and file-sharing glue. Containers are Linux processes, so a Linux kernel has to exist somewhere — on a Mac that is a VM. <strong>Requires a paid subscription for large companies</strong>; free for personal use, education and small businesses.</span></div>
  <div class="kv"><span class="k">Colima / OrbStack / Rancher Desktop</span><span class="v">macOS alternatives that provide the same VM-with-Engine without Docker Desktop's licence. <code>brew install colima docker</code> then <code>colima start</code> gives you a working <code>docker</code> CLI. OrbStack is notably faster at file sharing.</span></div>
  <div class="kv"><span class="k">Podman</span><span class="v">A daemonless, rootless-by-default alternative with a compatible CLI (<code>alias docker=podman</code> works for most of this course). Worth knowing about; the images and Dockerfiles are identical because both follow the OCI standard.</span></div>
</div>
<div class="callout"><strong>Everything in this course works on all of them</strong> except where a lesson says otherwise. Images are an open standard (OCI), so an image you build with Docker runs under Podman, containerd or Kubernetes without modification. Where the difference matters — file-sharing performance, rootless quirks — the lesson calls it out.</div>
<p><strong>The Docker Desktop licence, precisely (as of 09/2026):</strong> free for personal use, education, non-commercial open-source projects and businesses with <em>fewer than 250 employees and less than 10 million US dollars</em> in annual revenue. A company over either limit needs a paid plan (Pro, Team or Business). As a student learning or doing a school project, you are covered; when you join a company, ask which tool it licenses — many large companies use Docker Desktop under a Business plan, others standardise on Colima, OrbStack or Rancher Desktop.</p>

<h3>Ubuntu / Debian: the official repository</h3>
${slide('dk-00', 27, 'Bạn cài năm gói — và lệnh docker chỉ là MÁY KHÁCH')}
<p>Use the apt repository, not <code>apt install docker.io</code> (Ubuntu's own package lags by a lot) and not the <code>get.docker.com</code> script (convenient, but it pipes a remote script into your shell as root and gives you no upgrade path).</p>
<pre><code><span class="tok-comment"># 1. Remove anything old and conflicting</span>
for p in docker.io docker-doc docker-compose podman-docker containerd runc; do
  sudo apt remove -y \$p 2&gt;/dev/null
done

<span class="tok-comment"># 2. Add Docker's GPG key</span>
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

<span class="tok-comment"># 3. Add the repository (reads your Ubuntu codename automatically)</span>
echo "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \\
  https://download.docker.com/linux/ubuntu \$(. /etc/os-release &amp;&amp; echo \$VERSION_CODENAME) stable" \\
  | sudo tee /etc/apt/sources.list.d/docker.list &gt; /dev/null

<span class="tok-comment"># 4. Install</span>
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \\
  docker-buildx-plugin docker-compose-plugin</code></pre>
<div class="out">$ sudo docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
c1ec31eb5944: Pull complete
Digest: sha256:d211f485f2dd1dee407a80973c8f129f00d54604d2c90732e8e320e5038a0348
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">docker-ce</span><span class="v">The daemon, <code>dockerd</code>. This is the part that actually creates containers.</span></div>
  <div class="kv"><span class="k">docker-ce-cli</span><span class="v">The <code>docker</code> command. It is only a client — it sends HTTP requests to the daemon over a Unix socket. They can be on different machines.</span></div>
  <div class="kv"><span class="k">containerd.io</span><span class="v">The lower-level runtime the daemon delegates to. You will rarely touch it directly, but it is what actually supervises the container processes.</span></div>
  <div class="kv"><span class="k">docker-buildx-plugin</span><span class="v">The modern builder (BuildKit). Gives you build cache mounts, multi-platform builds and much better output. Chapter 5 uses it heavily — do not skip this package.</span></div>
  <div class="kv"><span class="k">docker-compose-plugin</span><span class="v">Provides <code>docker compose</code> (v2, a subcommand). Note the space: the old <code>docker-compose</code> with a hyphen is the deprecated Python v1 and behaves differently.</span></div>
</div>

<h3>The install script, flag by flag</h3>
<p>Copying those twelve lines works, but each one does something you will meet again. Read them once:</p>
<table>
<tr><th>Piece</th><th>What it does</th></tr>
<tr><td><code>apt remove … 2&gt;/dev/null</code></td><td>Removes Ubuntu's own <code>docker.io</code>, old Compose v1 and anything else that would conflict; <code>2&gt;/dev/null</code> hides "package not installed" noise.</td></tr>
<tr><td><code>install -m 0755 -d /etc/apt/keyrings</code></td><td>Creates the folder for signing keys with permissions <code>rwxr-xr-x</code> (<code>-d</code> = make a directory, <code>-m</code> = mode).</td></tr>
<tr><td><code>curl -fsSL URL -o file</code></td><td><code>-f</code> fail on HTTP errors instead of saving an error page, <code>-s</code> silent, <code>-S</code> but still show errors, <code>-L</code> follow redirects, <code>-o</code> write to a file.</td></tr>
<tr><td><code>signed-by=/etc/apt/keyrings/docker.asc</code></td><td>apt only trusts packages from this repository if they are signed by Docker's key — not any key on the system.</td></tr>
<tr><td><code>\$(dpkg --print-architecture)</code></td><td>Fills in <code>amd64</code> or <code>arm64</code>, so the same line works on a normal VPS and on an ARM server or Raspberry Pi.</td></tr>
<tr><td><code>\$(. /etc/os-release &amp;&amp; echo \$VERSION_CODENAME)</code></td><td>Reads your Ubuntu codename (for example <code>noble</code> for 24.04) so apt fetches packages built for your release.</td></tr>
<tr><td><code>tee /etc/apt/sources.list.d/docker.list &gt; /dev/null</code></td><td>Writes the repository line to a root-owned file (plain <code>&gt;</code> would run as you and fail); <code>&gt; /dev/null</code> stops <code>tee</code> echoing it.</td></tr>
</table>
<p><strong>Run it step by step: check a fresh Linux install.</strong> Three questions, in this order, answer almost every "Docker does not work" on Linux:</p>
<pre><code class="language-bash">systemctl is-active docker          <span class="tok-comment"># 1. is the daemon running?</span>
id -nG                              <span class="tok-comment"># 2. am I in the docker group?</span>
docker version --format 'Client {{.Client.Version}} {{.Client.Os}}/{{.Client.Arch}} · Server {{.Server.Version}} {{.Server.Os}}/{{.Server.Arch}}'   <span class="tok-comment"># 3. can the CLI reach it?</span></code></pre>
<div class="out">active
Cuong03dx wheel dialout docker
Client 29.6.2 linux/amd64 · Server 29.6.2 linux/amd64</div>
<p>(Real output on the course's Linux machine — Fedora 44, Docker Engine 29.6.2; on Ubuntu the group list differs but the three answers read the same.) <code>inactive</code> on line 1 means start it with <code>sudo systemctl enable --now docker</code>; no <code>docker</code> on line 2 means the next section; an error on line 3 after two good answers usually means you added yourself to the group but have not logged in again.</p>

<h3>Running without sudo — and what it costs</h3>
${slide('dk-00', 29, 'Vào nhóm docker = có quyền root, không cần mật khẩu')}
<pre><code>sudo usermod -aG docker \$USER      <span class="tok-comment"># -aG: append, never plain -G</span>
newgrp docker                      <span class="tok-comment"># or log out and back in</span>
docker run hello-world             <span class="tok-comment"># no sudo now</span>
id -nG</code></pre>
<div class="out">deploy adm cdrom sudo dip plugdev docker</div>
<div class="callout warn"><strong>Membership of the <code>docker</code> group is equivalent to root.</strong> This is not a warning about being careless — it is arithmetic. Anyone in that group can run <code>docker run -v /:/host -it alpine chroot /host sh</code> and get an unrestricted root shell on the machine, with no password and no <code>sudo</code> log entry. Add only people you would already give full <code>sudo</code>, and on a shared or production server prefer <code>sudo docker</code>, or set up <strong>rootless mode</strong> (<code>dockerd-rootless-setuptool.sh install</code>), which runs the whole daemon as your user inside a user namespace.</div>
<p>Do not take "equivalent to root" on trust — here is the proof, run on the course's Linux machine by an ordinary user who is in the <code>docker</code> group. It only <em>counts lines</em> of the password-hash file, so it is safe to try:</p>
<pre><code class="language-bash">wc -l /etc/shadow
docker run --rm -v /etc:/h:ro alpine sh -c 'id; wc -l /h/shadow'</code></pre>
<div class="out">wc: /etc/shadow: Permission denied
uid=0(root) gid=0(root) groups=0(root),0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
54 /h/shadow</div>
<p>The user cannot read <code>/etc/shadow</code>. One <code>docker run</code> later, a process running as <code>uid=0(root)</code> reads it through a bind mount. No password was asked, nothing went to the sudo log. The daemon runs as root and does what anyone in the group asks — which is also why an exposed Docker API is a disaster (the Graboid worm, lesson "Start here 2/2").</p>

<h3>macOS</h3>
${slide('dk-00', 30, 'Trên Mac: máy ảo có RAM riêng, và file phải vượt biên')}
<pre><code><span class="tok-comment"># Option A — Docker Desktop (GUI, easiest)</span>
brew install --cask docker         <span class="tok-comment"># then launch it once from Applications</span>

<span class="tok-comment"># Option B — Colima (no Desktop licence, CLI only)</span>
brew install colima docker docker-compose
colima start --cpu 4 --memory 8 --disk 60
docker run hello-world</code></pre>
<p>Either way, a Linux VM is doing the work. That has two consequences you will meet: the VM has its own CPU/memory/disk allocation (so <code>docker info</code> shows less RAM than your Mac has), and files shared from macOS into a container cross a virtualisation boundary, which is <strong>slow</strong> — noticeably so for a <code>node_modules</code> with 40,000 files. Chapter 7 covers how to avoid paying that cost.</p>
<p>What that looks like on the course's Mac M1 with 32 GB of RAM, Docker Desktop 4.91:</p>
<pre><code class="language-bash">docker info --format '{{.OperatingSystem}} · {{.Architecture}} · {{.NCPU}} CPU · {{.MemTotal}}'
docker run --rm alpine uname -m</code></pre>
<div class="out">Docker Desktop · aarch64 · 10 CPU · 8319504384
aarch64</div>
<p><code>8319504384</code> bytes is 7.7 GiB — the memory of Docker Desktop's VM, not the Mac's 32 GB. A <code>next build</code> or a big test suite that dies with exit 137 on a Mac often just needs more here: Docker Desktop → Settings → Resources. And <code>aarch64</code> (also written <code>arm64</code>) is the ARM processor of Apple silicon; most VPSs are <code>x86_64</code> (<code>amd64</code>). Official images are published for both, so everything in Chapters 0–12 works the same; building your <em>own</em> images for both is Chapter 15.</p>

<h3>Windows: use WSL2, and live inside it</h3>
<pre><code><span class="tok-comment"># In PowerShell as Administrator</span>
wsl --install -d Ubuntu-24.04
wsl --set-default-version 2
<span class="tok-comment"># Then install Docker Desktop and enable "Use the WSL 2 based engine"</span>
<span class="tok-comment"># Settings → Resources → WSL Integration → enable your distro</span></code></pre>
<pre><code><span class="tok-comment"># Inside the Ubuntu terminal, verify you are on the Linux filesystem</span>
pwd
docker run --rm alpine echo ok</code></pre>
<div class="out">/home/cuong/projects/app
ok</div>
<div class="pitfall"><strong>Pitfall:</strong> keeping your project on <code>C:\\Users\\…</code> and reaching it from WSL through <code>/mnt/c/</code>. Every file read then crosses the Windows–Linux filesystem bridge, and an <code>npm install</code> that takes 20 seconds natively can take four minutes. Symptoms include hot reload that never fires (inotify does not work across the bridge) and builds that are inexplicably slow. Keep the repository inside the WSL filesystem — <code>/home/&lt;you&gt;/projects/…</code>, which is what <code>pwd</code> above shows — and open it with VS Code's WSL remote extension. This single change is usually a 10× improvement.</div>

<h3>Verify, and read what it tells you</h3>
${slide('dk-00', 28, 'docker version in HAI phần vì có HAI chương trình')}
<pre><code>docker version
docker info | head -25
docker compose version
docker buildx version</code></pre>
<div class="out">Client: Docker Engine - Community
 Version:           27.3.1
 API version:       1.47
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          27.3.1
  API version:      1.47 (minimum version 1.24)
  OS/Arch:          linux/amd64
 containerd:
  Version:          1.7.22</div>
<p>Two sections, Client and Server, because they are two programs. If the Server section is missing and you see <code>Cannot connect to the Docker daemon at unix:///var/run/docker.sock</code>, the CLI is fine and the daemon is not running — <code>sudo systemctl status docker</code>, and on macOS/Windows, start Docker Desktop or <code>colima start</code>.</p>
<p>The same command on the course's Mac in 09/2026 (Go/Git lines cut) shows the two programs even more clearly, because they run on two different operating systems:</p>
<div class="out">Client:
 Version:           29.8.0
 API version:       1.56
 OS/Arch:           darwin/arm64
 Context:           desktop-linux

Server: Docker Desktop 4.91.0 (239619)
 Engine:
  Version:          29.8.0
  API version:      1.56 (minimum version 1.40)
  OS/Arch:          linux/arm64
 containerd:
  Version:          v2.3.4
 runc:
  Version:          1.4.3</div>
<table>
<tr><th>Field</th><th>How to read it</th></tr>
<tr><td><code>OS/Arch: darwin/arm64</code> (Client)</td><td>The <code>docker</code> command is a macOS program.</td></tr>
<tr><td><code>OS/Arch: linux/arm64</code> (Server)</td><td>The Engine runs on Linux — inside Docker Desktop's VM.</td></tr>
<tr><td><code>Context: desktop-linux</code></td><td>Which Engine the CLI is talking to. <code>docker context ls</code> lists them; a context can even point at a remote server over SSH.</td></tr>
<tr><td><code>API version: 1.56 (minimum version 1.40)</code></td><td>The HTTP API between CLI and Engine; an older CLI works as long as it speaks at least 1.40.</td></tr>
<tr><td><code>containerd</code> / <code>runc</code></td><td>The lower layers that actually supervise and start containers (Chapter 1.5).</td></tr>
</table>
<p>On the same Mac, <code>docker compose version</code> printed <code>Docker Compose version v5.5.1</code> and <code>docker buildx version</code> printed <code>v0.37.0</code> — Compose moved on from v2 to newer major versions; what matters is the space in <code>docker compose</code>, not the number.</p>
<pre><code>docker info --format '{{.OperatingSystem}} · {{.Architecture}} · {{.NCPU}} CPU · {{.MemTotal}}'
docker info --format '{{.DockerRootDir}}'      <span class="tok-comment"># where images and volumes live</span>
docker system df                               <span class="tok-comment"># how much space that is using</span></code></pre>
<div class="out">Ubuntu 24.04.1 LTS · x86_64 · 8 CPU · 16606552064
/var/lib/docker
TYPE            TOTAL   ACTIVE   SIZE      RECLAIMABLE
Images          12      3        4.211GB   3.102GB (73%)
Containers      5       2        112.4MB   98.11MB (87%)
Local Volumes   4       2        1.844GB   602.1MB (32%)
Build Cache     87      0        2.409GB   2.409GB</div>
<div class="callout ok"><strong>Note <code>DockerRootDir</code> now.</strong> Everything Docker stores — every image layer, every volume, every build cache entry — lives under that path, which on a default Linux install is <code>/var/lib/docker</code> on your root filesystem. It grows quietly and steadily; <code>docker system df</code> is the command that tells you how much, and Chapter 11 covers reclaiming it before a full disk takes a database down.</div>

<h3>hello-world, line by line</h3>
${slide('dk-00', 31, 'hello-world: năm bước gói trong một lệnh')}
<p>The output you ran above is a five-step story, and every step is something you will do deliberately later:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Unable to find image locally</span><span class="lz-t">the CLI asked the daemon; the daemon checked its local store</span><span class="lz-d">Images are cached on the machine. The second run of this command prints none of these lines because nothing needs fetching.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Pulling from library/hello-world</span><span class="lz-t">Docker Hub, the default registry</span><span class="lz-d"><code>hello-world</code> is shorthand for <code>docker.io/library/hello-world:latest</code>. Chapter 3 unpacks that name — it has four parts and every one matters.</span></div>
  <div class="lz-step"><span class="lz-k">3 · c1ec31eb5944: Pull complete</span><span class="lz-t">one layer downloaded</span><span class="lz-d">Images are made of stacked layers, each with its own hash. A bigger image prints many of these lines, and layers you already have are skipped — the mechanism behind Chapter 5's fast builds.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Digest: sha256:d211f485…</span><span class="lz-t">the content-addressable identity</span><span class="lz-d">This hash IS the image. Tags like <code>:latest</code> move; a digest never does. Chapter 3 explains why production should pin one.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Hello from Docker!</span><span class="lz-t">a container ran, printed, and exited</span><span class="lz-d">It still exists in a stopped state — <code>docker ps -a</code> shows it. Chapter 1 covers that lifecycle, and why stopped containers pile up if you never pass <code>--rm</code>.</span></div>
</div>
<pre><code>docker ps -a --format 'table {{.Names}}\\t{{.Image}}\\t{{.Status}}'
docker images
docker rm \$(docker ps -aq --filter ancestor=hello-world)    <span class="tok-comment"># clean up</span></code></pre>
<div class="out">NAMES              IMAGE         STATUS
elegant_darwin     hello-world   Exited (0) 2 minutes ago
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    d2c94e258dcb   14 months ago  13.3kB</div>
<p><strong>On Docker 29 the same commands look slightly different.</strong> Real output from the course's Mac, first pull, 23/09/2026 (the container was named with <code>--name</code>, so it has a readable name instead of a random one):</p>
<div class="out">Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
58dee6a49ef1: Pulling fs layer
58dee6a49ef1: Download complete
58dee6a49ef1: Pull complete
c3bdf82c34d1: Download complete
Digest: sha256:5e23090353324d887c48ad5e5c56d294eab81588df9605b07d1afe895f9cc8f8
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
…
NAMES        IMAGE         STATUS
dk00-hello   hello-world   Exited (0) Less than a second ago
IMAGE                ID             DISK USAGE   CONTENT SIZE   EXTRA
hello-world:latest   5e2309035332       22.6kB         10.3kB   U</div>
<p>Two differences are worth knowing. The pull shows more steps per layer (<code>Pulling fs layer</code> → <code>Download complete</code> → <code>Pull complete</code>) because Engine 29 stores images through containerd. And <code>docker images</code> has new columns: <strong>CONTENT SIZE</strong> is the compressed size you download, <strong>DISK USAGE</strong> adds the unpacked copy on disk, and <code>U</code> under EXTRA means the image is in use by a container. Chapter 1.2 explains both sizes. The digest also differs from the old output above: <code>hello-world:latest</code> has been rebuilt since — a live example of why Chapter 3 says a tag moves and a digest does not.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> tomorrow your team starts using Docker. Bình (Windows) says "Docker is installed but nothing works", An (Mac) says "my build keeps dying", and you are on Linux. Before helping anyone, prove your own setup is healthy and know what each piece is.</p><ol>
<li>Run <code>docker version</code> and point at the Client and the Server sections. Write down the two <code>OS/Arch</code> values — are they the same on your machine?</li>
<li>Run <code>docker info --format '{{.NCPU}} CPU · {{.MemTotal}}'</code> and convert the bytes to GiB (divide by 1073741824). On a Mac or Windows, compare with your real RAM.</li>
<li>Run <code>docker compose version</code> and <code>docker buildx version</code>. Both must answer; if <code>docker compose</code> is "not a docker command", the Compose plugin is missing.</li>
<li>Run <code>docker run --name thu-hello hello-world</code>, then <code>docker ps -a --filter name=thu-hello</code>. Explain why the container is still listed.</li>
<li>Remove exactly that container: <code>docker rm thu-hello</code>.</li>
</ol>
<p><strong>Done when:</strong> you can say which program the Client is and where the Server runs, you know how much memory your Engine really has, both plugin commands answer, and <code>docker ps -a --filter name=thu-hello</code> is empty again. Bonus for Windows teammates: <code>pwd</code> inside WSL prints a path under <code>/home/</code>, not <code>/mnt/c/</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Daemon</span><span class="v">A program running in the background; for Docker, <code>dockerd</code>, which does all the real work.</span></div>
  <div class="kv"><span class="k">Client (CLI)</span><span class="v">The <code>docker</code> command: it only sends requests to the daemon and prints the answers.</span></div>
  <div class="kv"><span class="k">Unix socket</span><span class="v">A file-like connection point (<code>/var/run/docker.sock</code>) through which the CLI talks to the daemon on the same machine.</span></div>
  <div class="kv"><span class="k">docker group</span><span class="v">The Linux group allowed to use that socket without <code>sudo</code> — effectively root access.</span></div>
  <div class="kv"><span class="k">Rootless mode</span><span class="v">Running the whole daemon as an ordinary user, so a container escape does not become root on the host.</span></div>
  <div class="kv"><span class="k">WSL2</span><span class="v">Windows Subsystem for Linux: a light VM running a real Linux on Windows — where Docker's containers and your code should live.</span></div>
  <div class="kv"><span class="k">Docker context</span><span class="v">A named target Engine for the CLI (local Desktop, a remote server over SSH…); <code>docker context ls</code>.</span></div>
  <div class="kv"><span class="k">arm64 / amd64</span><span class="v">The two processor families: Apple silicon and many ARM servers vs most PCs and VPSs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>On Linux, Docker Engine runs directly on your kernel; on macOS and Windows, Docker Desktop (or Colima/OrbStack, or WSL2) runs a Linux VM with the Engine inside.</li>
<li>Install on Ubuntu from Docker's apt repository: five packages — Engine, CLI, containerd, buildx and the Compose plugin.</li>
<li>The <code>docker</code> command is only a client; <code>docker version</code> shows Client and Server because they are two programs, possibly on two operating systems.</li>
<li>Being in the <code>docker</code> group is root without a password — proven by reading <code>/etc/shadow</code> through a container; use it on your laptop, think twice on a server.</li>
<li>On a Mac the Engine sees only the VM's memory (7.7 GiB of 32 GB here) and an ARM CPU; on Windows keep code inside WSL, not <code>/mnt/c</code>.</li>
<li>hello-world is five steps in one command: check locally, pull from Docker Hub, download layers, verify the digest, create and run a container that stays behind until you remove it.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/install/ubuntu/" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Install Docker Engine on Ubuntu</span><span class="lc-sub">The canonical instructions, kept current. If the commands above ever drift from reality, this page is the source of truth — and it has the equivalents for Debian, Fedora, RHEL and Arch.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/rootless/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Rootless mode</span><span class="lc-sub">Running the whole daemon as an unprivileged user. The right answer for shared machines and CI runners, with an honest list of the limitations (ports below 1024, some storage drivers).</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/filesystems" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">WSL — working across filesystems</span><span class="lc-sub">Microsoft's own explanation of why <code>/mnt/c</code> is slow and where to keep your files. Read it once if you develop on Windows; it saves hours a week.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: verify your setup</span><span class="lc-sub">Graded exercises: read a <code>docker version</code> output and say what is wrong, interpret <code>docker system df</code>, and explain why one machine needs <code>sudo</code> and another does not.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>docker-compose</code> (hyphen) versus <code>docker compose</code> (space). The hyphenated command is Compose v1, written in Python, unmaintained since 2023, and different in real ways — it names containers with underscores, does not support <code>include</code> or newer Compose features such as <code>develop.watch</code> (it only gained <code>profiles</code> in its last releases, 1.28, January 2021), and handles <code>depends_on</code> conditions differently. If a tutorial's Compose file "does not work", check which one you are running: <code>docker compose version</code> should say v2 or newer (the course's Mac printed v5.5.1 in 09/2026). On Ubuntu, installing <code>docker-compose-plugin</code> as above gives you v2 and you should delete any v1 binary you find.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The <code>docker</code> command is only a client — the daemon does the work, which is why <code>docker version</code> prints two sections and why "cannot connect to the Docker daemon" is never a CLI problem. Adding yourself to the <code>docker</code> group is granting root, so do it on your laptop and think twice on a server. And on macOS and Windows there is a Linux VM in the middle: keep your files on the Linux side of it, or you will pay for the crossing on every single file read.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cài Docker, và bạn vừa cài cái gì</h2>
<p class="lead">Docker trên Linux và "Docker" trên macOS hay Windows không cùng một hình hài, và biết được khác biệt đó giải thích được vài hành vi khó hiểu về sau — vì sao truy cập file chậm trên máy Mac, vì sao đường dẫn Windows của bạn cư xử lạ lùng, và vì sao cùng một câu lệnh mà máy này cần <code>sudo</code> còn máy kia thì không.</p>

<h3>Engine, Desktop, và các lựa chọn khác</h3>
${slide('dk-00', 26, 'Linux chạy Docker thẳng; Mac và Windows có một máy ảo ở giữa')}
<div class="kv-grid">
  <div class="kv"><span class="k">Docker Engine (Linux)</span><span class="v">Bản thật: một tiến trình nền (<code>dockerd</code>) chạy thẳng trên nhân của bạn cộng một CLI nói chuyện với nó. Miễn phí, mã nguồn mở, không giao diện đồ hoạ. Đây là thứ chạy trên mọi máy chủ, và là chỗ mọi output trong khoá này đến từ.</span></div>
  <div class="kv"><span class="k">Docker Desktop (macOS / Windows)</span><span class="v">Một máy ảo Linux có Engine bên trong, cộng giao diện đồ hoạ và phần keo chia sẻ file. Container là tiến trình Linux, nên phải có một cái nhân Linux ở đâu đó — trên máy Mac thì đó là một máy ảo. <strong>Cần thuê bao trả phí với công ty lớn</strong>; miễn phí cho cá nhân, giáo dục và doanh nghiệp nhỏ.</span></div>
  <div class="kv"><span class="k">Colima / OrbStack / Rancher Desktop</span><span class="v">Các lựa chọn trên macOS cho cùng mô hình máy-ảo-có-Engine mà không cần giấy phép của Docker Desktop. <code>brew install colima docker</code> rồi <code>colima start</code> là bạn có một CLI <code>docker</code> chạy được. OrbStack nhanh hơn hẳn ở khoản chia sẻ file.</span></div>
  <div class="kv"><span class="k">Podman</span><span class="v">Một lựa chọn không tiến trình nền, mặc định chạy không cần root, với CLI tương thích (<code>alias docker=podman</code> chạy được cho phần lớn khoá này). Đáng biết; ảnh và Dockerfile thì giống hệt vì cả hai đều theo chuẩn OCI.</span></div>
</div>
<div class="callout"><strong>Mọi thứ trong khoá này chạy được trên tất cả chúng</strong> trừ chỗ nào bài học nói khác. Image là một chuẩn mở (OCI), nên một ảnh bạn dựng bằng Docker chạy được dưới Podman, containerd hay Kubernetes mà không phải sửa gì. Chỗ nào khác biệt có ảnh hưởng — hiệu năng chia sẻ file, những chỗ khó chịu của chế độ không-root — bài học đều nói rõ.</div>
<p><strong>Giấy phép Docker Desktop, nói chính xác (tính đến 09/2026):</strong> miễn phí cho cá nhân, giáo dục, dự án mã nguồn mở phi thương mại và doanh nghiệp có <em>dưới 250 nhân viên và doanh thu dưới 10 triệu USD</em> mỗi năm. Công ty vượt một trong hai ngưỡng phải mua gói trả phí (Pro, Team hoặc Business). Là sinh viên đang học hay làm đồ án, bạn thuộc diện miễn phí; khi vào một công ty, hãy hỏi công ty dùng công cụ nào có giấy phép — nhiều công ty lớn dùng Docker Desktop theo gói Business, số khác chuẩn hoá sang Colima, OrbStack hay Rancher Desktop.</p>

<h3>Ubuntu / Debian: kho apt chính thức</h3>
${slide('dk-00', 27, 'Bạn cài năm gói — và lệnh docker chỉ là MÁY KHÁCH')}
<p>Hãy dùng kho apt, đừng dùng <code>apt install docker.io</code> (gói của chính Ubuntu tụt hậu rất xa) và cũng đừng dùng script <code>get.docker.com</code> (tiện, nhưng nó đổ một script từ xa vào shell của bạn dưới quyền root và không cho bạn đường nâng cấp nào).</p>
<pre><code><span class="tok-comment"># 1. Gỡ mọi thứ cũ và xung đột</span>
for p in docker.io docker-doc docker-compose podman-docker containerd runc; do
  sudo apt remove -y \$p 2&gt;/dev/null
done

<span class="tok-comment"># 2. Thêm khoá GPG của Docker</span>
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

<span class="tok-comment"># 3. Thêm kho (tự đọc tên mã bản Ubuntu của bạn)</span>
echo "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \\
  https://download.docker.com/linux/ubuntu \$(. /etc/os-release &amp;&amp; echo \$VERSION_CODENAME) stable" \\
  | sudo tee /etc/apt/sources.list.d/docker.list &gt; /dev/null

<span class="tok-comment"># 4. Cài</span>
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \\
  docker-buildx-plugin docker-compose-plugin</code></pre>
<div class="out">$ sudo docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
c1ec31eb5944: Pull complete
Digest: sha256:d211f485f2dd1dee407a80973c8f129f00d54604d2c90732e8e320e5038a0348
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">docker-ce</span><span class="v">Tiến trình nền, <code>dockerd</code>. Đây là phần thật sự tạo ra container.</span></div>
  <div class="kv"><span class="k">docker-ce-cli</span><span class="v">Câu lệnh <code>docker</code>. Nó chỉ là một MÁY KHÁCH — nó gửi yêu cầu HTTP tới tiến trình nền qua một socket Unix. Hai thứ đó có thể nằm trên hai máy khác nhau.</span></div>
  <div class="kv"><span class="k">containerd.io</span><span class="v">Bộ chạy ở tầng thấp hơn mà tiến trình nền uỷ thác cho. Bạn hiếm khi đụng thẳng vào nó, nhưng chính nó mới là thứ giám sát các tiến trình container.</span></div>
  <div class="kv"><span class="k">docker-buildx-plugin</span><span class="v">Bộ dựng hiện đại (BuildKit). Cho bạn cache mount lúc dựng, dựng đa nền tảng và output dễ đọc hơn nhiều. Chương 5 dùng nó rất nhiều — đừng bỏ gói này.</span></div>
  <div class="kv"><span class="k">docker-compose-plugin</span><span class="v">Cung cấp <code>docker compose</code> (v2, một lệnh con). Chú ý cái dấu cách: <code>docker-compose</code> cũ có dấu gạch nối là bản Python v1 đã ngừng phát triển và hành xử khác.</span></div>
</div>

<h3>Đọc script cài đặt, từng cờ một</h3>
<p>Chép mười hai dòng đó thì chạy được, nhưng dòng nào cũng làm một việc bạn sẽ còn gặp lại. Đọc qua một lần:</p>
<table>
<tr><th>Mảnh</th><th>Làm gì</th></tr>
<tr><td><code>apt remove … 2&gt;/dev/null</code></td><td>Gỡ gói <code>docker.io</code> của chính Ubuntu, Compose v1 cũ và mọi thứ sẽ xung đột; <code>2&gt;/dev/null</code> giấu đi lời báo “gói chưa được cài”.</td></tr>
<tr><td><code>install -m 0755 -d /etc/apt/keyrings</code></td><td>Tạo thư mục chứa khoá ký với quyền <code>rwxr-xr-x</code> (<code>-d</code> = tạo thư mục, <code>-m</code> = chế độ quyền).</td></tr>
<tr><td><code>curl -fsSL URL -o file</code></td><td><code>-f</code> báo lỗi khi HTTP hỏng thay vì lưu một trang lỗi, <code>-s</code> im lặng, <code>-S</code> nhưng vẫn in lỗi, <code>-L</code> đi theo chuyển hướng, <code>-o</code> ghi ra file.</td></tr>
<tr><td><code>signed-by=/etc/apt/keyrings/docker.asc</code></td><td>apt chỉ tin gói từ kho này nếu được ký bằng khoá của Docker — không phải bất kỳ khoá nào có trên máy.</td></tr>
<tr><td><code>\$(dpkg --print-architecture)</code></td><td>Tự điền <code>amd64</code> hoặc <code>arm64</code>, để cùng một dòng chạy được trên VPS thường lẫn máy chủ ARM hay Raspberry Pi.</td></tr>
<tr><td><code>\$(. /etc/os-release &amp;&amp; echo \$VERSION_CODENAME)</code></td><td>Đọc tên mã bản Ubuntu (ví dụ <code>noble</code> cho 24.04) để apt lấy đúng gói dựng cho bản của bạn.</td></tr>
<tr><td><code>tee /etc/apt/sources.list.d/docker.list &gt; /dev/null</code></td><td>Ghi dòng khai báo kho vào một file thuộc root (dùng <code>&gt;</code> trần thì chạy dưới quyền bạn và thất bại); <code>&gt; /dev/null</code> để <code>tee</code> khỏi in lại ra màn hình.</td></tr>
</table>
<p><strong>Chạy thử từng bước: kiểm một bản cài Linux mới.</strong> Ba câu hỏi, theo đúng thứ tự này, trả lời gần hết mọi ca “Docker không chạy” trên Linux:</p>
<pre><code class="language-bash">systemctl is-active docker          <span class="tok-comment"># 1. tiến trình nền có đang chạy không?</span>
id -nG                              <span class="tok-comment"># 2. mình có trong nhóm docker không?</span>
docker version --format 'Client {{.Client.Version}} {{.Client.Os}}/{{.Client.Arch}} · Server {{.Server.Version}} {{.Server.Os}}/{{.Server.Arch}}'   <span class="tok-comment"># 3. CLI có với tới nó không?</span></code></pre>
<div class="out">active
Cuong03dx wheel dialout docker
Client 29.6.2 linux/amd64 · Server 29.6.2 linux/amd64</div>
<p>(Output thật trên máy Linux của khoá — Fedora 44, Docker Engine 29.6.2; trên Ubuntu danh sách nhóm khác đi nhưng ba câu trả lời đọc y như vậy.) Dòng 1 báo <code>inactive</code> thì khởi động bằng <code>sudo systemctl enable --now docker</code>; dòng 2 không có <code>docker</code> thì xem mục kế tiếp; dòng 3 báo lỗi trong khi hai dòng trên ổn thì thường là bạn đã thêm mình vào nhóm nhưng chưa đăng nhập lại.</p>

<h3>Chạy không cần sudo — và cái giá của nó</h3>
${slide('dk-00', 29, 'Vào nhóm docker = có quyền root, không cần mật khẩu')}
<pre><code>sudo usermod -aG docker \$USER      <span class="tok-comment"># -aG: nối thêm, đừng bao giờ -G trần</span>
newgrp docker                      <span class="tok-comment"># hoặc đăng xuất rồi vào lại</span>
docker run hello-world             <span class="tok-comment"># giờ khỏi sudo</span>
id -nG</code></pre>
<div class="out">deploy adm cdrom sudo dip plugdev docker</div>
<div class="callout warn"><strong>Nằm trong nhóm <code>docker</code> TƯƠNG ĐƯƠNG với root.</strong> Đây không phải một lời nhắc nhở về sự cẩu thả — đây là phép tính. Bất cứ ai trong nhóm đó đều chạy được <code>docker run -v /:/host -it alpine chroot /host sh</code> và có ngay một shell root không hạn chế trên máy, không cần mật khẩu và không để lại dòng log <code>sudo</code> nào. Chỉ thêm những người mà bạn vốn đã sẵn sàng cấp <code>sudo</code> đầy đủ, và trên một máy chủ dùng chung hay production thì nên dùng <code>sudo docker</code>, hoặc dựng <strong>chế độ rootless</strong> (<code>dockerd-rootless-setuptool.sh install</code>) — nó chạy trọn tiến trình nền dưới danh nghĩa người dùng của bạn bên trong một user namespace.</div>
<p>Đừng tin câu “tương đương root” chỉ vì đọc thấy — đây là bằng chứng, chạy trên máy Linux của khoá bởi một người dùng thường có trong nhóm <code>docker</code>. Lệnh chỉ <em>đếm số dòng</em> của file chứa mã băm mật khẩu, nên thử an toàn:</p>
<pre><code class="language-bash">wc -l /etc/shadow
docker run --rm -v /etc:/h:ro alpine sh -c 'id; wc -l /h/shadow'</code></pre>
<div class="out">wc: /etc/shadow: Permission denied
uid=0(root) gid=0(root) groups=0(root),0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
54 /h/shadow</div>
<p>Người dùng không đọc nổi <code>/etc/shadow</code>. Một lệnh <code>docker run</code> sau, một tiến trình chạy bằng <code>uid=0(root)</code> đọc được nó qua bind mount. Không ai hỏi mật khẩu, không có dòng nào vào log của sudo. Tiến trình nền chạy bằng root và làm theo lời bất kỳ ai trong nhóm — đó cũng là lý do một Docker API bị lộ ra mạng là thảm hoạ (con sâu Graboid, bài “Bắt đầu tại đây 2/2”).</p>

<h3>macOS</h3>
${slide('dk-00', 30, 'Trên Mac: máy ảo có RAM riêng, và file phải vượt biên')}
<pre><code><span class="tok-comment"># Cách A — Docker Desktop (có giao diện, dễ nhất)</span>
brew install --cask docker         <span class="tok-comment"># rồi mở nó một lần từ Applications</span>

<span class="tok-comment"># Cách B — Colima (không cần giấy phép Desktop, chỉ dòng lệnh)</span>
brew install colima docker docker-compose
colima start --cpu 4 --memory 8 --disk 60
docker run hello-world</code></pre>
<p>Kiểu nào thì cũng có một máy ảo Linux đang làm việc. Điều đó dẫn tới hai hệ quả bạn sẽ gặp: máy ảo có phần CPU/bộ nhớ/đĩa được cấp riêng (nên <code>docker info</code> báo ít RAM hơn máy Mac của bạn có), và những file chia sẻ từ macOS vào container phải vượt một ranh giới ảo hoá, và điều đó <strong>CHẬM</strong> — chậm thấy rõ với một thư mục <code>node_modules</code> chứa 40.000 file. Chương 7 nói cách tránh trả cái giá đó.</p>
<p>Trên máy Mac M1 32 GB RAM của khoá, Docker Desktop 4.91, điều đó trông thế này:</p>
<pre><code class="language-bash">docker info --format '{{.OperatingSystem}} · {{.Architecture}} · {{.NCPU}} CPU · {{.MemTotal}}'
docker run --rm alpine uname -m</code></pre>
<div class="out">Docker Desktop · aarch64 · 10 CPU · 8319504384
aarch64</div>
<p><code>8319504384</code> byte là 7,7 GiB — bộ nhớ của máy ảo Docker Desktop, không phải 32 GB của máy Mac. Một lượt <code>next build</code> hay một bộ test lớn chết với exit 137 trên Mac thường chỉ cần tăng chỗ này: Docker Desktop → Settings → Resources. Còn <code>aarch64</code> (hay viết <code>arm64</code>) là bộ xử lý ARM của chip Apple; đa số VPS là <code>x86_64</code> (<code>amd64</code>). Image chính thức được phát hành cho cả hai, nên mọi thứ ở Chương 0–12 chạy giống nhau; tự dựng image <em>của mình</em> cho cả hai loại là Chương 15.</p>

<h3>Windows: dùng WSL2, và SỐNG bên trong nó</h3>
<pre><code><span class="tok-comment"># Trong PowerShell với quyền quản trị</span>
wsl --install -d Ubuntu-24.04
wsl --set-default-version 2
<span class="tok-comment"># Rồi cài Docker Desktop và bật "Use the WSL 2 based engine"</span>
<span class="tok-comment"># Settings → Resources → WSL Integration → bật bản phân phối của bạn</span></code></pre>
<pre><code><span class="tok-comment"># Trong terminal Ubuntu, kiểm rằng bạn đang ở hệ thống file Linux</span>
pwd
docker run --rm alpine echo ok</code></pre>
<div class="out">/home/cuong/projects/app
ok</div>
<div class="pitfall"><strong>Bẫy:</strong> để dự án ở <code>C:\\Users\\…</code> rồi với sang từ WSL qua <code>/mnt/c/</code>. Mỗi lần đọc file khi đó phải vượt cây cầu hệ thống file Windows–Linux, và một lệnh <code>npm install</code> vốn mất 20 giây khi chạy tự nhiên có thể ngốn bốn phút. Triệu chứng gồm cả hot reload không bao giờ nổ (inotify không hoạt động qua cây cầu đó) và những lượt dựng chậm khó hiểu. Hãy để kho mã BÊN TRONG hệ thống file WSL — <code>/home/&lt;bạn&gt;/projects/…</code>, đúng cái mà <code>pwd</code> ở trên hiện ra — và mở nó bằng tiện ích WSL remote của VS Code. Riêng thay đổi này thường cải thiện gấp 10 lần.</div>

<h3>Kiểm tra, và đọc xem nó nói gì</h3>
${slide('dk-00', 28, 'docker version in HAI phần vì có HAI chương trình')}
<pre><code>docker version
docker info | head -25
docker compose version
docker buildx version</code></pre>
<div class="out">Client: Docker Engine - Community
 Version:           27.3.1
 API version:       1.47
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          27.3.1
  API version:      1.47 (minimum version 1.24)
  OS/Arch:          linux/amd64
 containerd:
  Version:          1.7.22</div>
<p>Hai phần, Client và Server, vì chúng là HAI chương trình. Nếu phần Server biến mất và bạn thấy <code>Cannot connect to the Docker daemon at unix:///var/run/docker.sock</code> thì CLI vẫn ổn và tiến trình nền đang không chạy — hãy <code>sudo systemctl status docker</code>, còn trên macOS/Windows thì khởi động Docker Desktop hoặc <code>colima start</code>.</p>
<p>Cùng lệnh đó trên máy Mac của khoá tháng 9/2026 (đã cắt các dòng Go/Git) cho thấy hai chương trình còn rõ hơn, vì chúng chạy trên hai hệ điều hành khác nhau:</p>
<div class="out">Client:
 Version:           29.8.0
 API version:       1.56
 OS/Arch:           darwin/arm64
 Context:           desktop-linux

Server: Docker Desktop 4.91.0 (239619)
 Engine:
  Version:          29.8.0
  API version:      1.56 (minimum version 1.40)
  OS/Arch:          linux/arm64
 containerd:
  Version:          v2.3.4
 runc:
  Version:          1.4.3</div>
<table>
<tr><th>Trường</th><th>Đọc thế nào</th></tr>
<tr><td><code>OS/Arch: darwin/arm64</code> (Client)</td><td>Lệnh <code>docker</code> là một chương trình macOS.</td></tr>
<tr><td><code>OS/Arch: linux/arm64</code> (Server)</td><td>Engine chạy trên Linux — bên trong máy ảo Docker Desktop.</td></tr>
<tr><td><code>Context: desktop-linux</code></td><td>CLI đang nói chuyện với Engine nào. <code>docker context ls</code> liệt kê chúng; một context thậm chí có thể trỏ tới máy chủ ở xa qua SSH.</td></tr>
<tr><td><code>API version: 1.56 (minimum version 1.40)</code></td><td>API HTTP giữa CLI và Engine; một CLI cũ hơn vẫn dùng được miễn nó nói được ít nhất bản 1.40.</td></tr>
<tr><td><code>containerd</code> / <code>runc</code></td><td>Các tầng thấp hơn thật sự giám sát và khởi động container (Chương 1.5).</td></tr>
</table>
<p>Trên cùng máy Mac đó, <code>docker compose version</code> in ra <code>Docker Compose version v5.5.1</code> và <code>docker buildx version</code> in ra <code>v0.37.0</code> — Compose đã đi tiếp từ v2 lên các bản lớn mới hơn; điều quan trọng là dấu cách trong <code>docker compose</code>, không phải con số.</p>
<pre><code>docker info --format '{{.OperatingSystem}} · {{.Architecture}} · {{.NCPU}} CPU · {{.MemTotal}}'
docker info --format '{{.DockerRootDir}}'      <span class="tok-comment"># nơi image và volume nằm</span>
docker system df                               <span class="tok-comment"># chỗ đó đang ngốn bao nhiêu</span></code></pre>
<div class="out">Ubuntu 24.04.1 LTS · x86_64 · 8 CPU · 16606552064
/var/lib/docker
TYPE            TOTAL   ACTIVE   SIZE      RECLAIMABLE
Images          12      3        4.211GB   3.102GB (73%)
Containers      5       2        112.4MB   98.11MB (87%)
Local Volumes   4       2        1.844GB   602.1MB (32%)
Build Cache     87      0        2.409GB   2.409GB</div>
<div class="callout ok"><strong>Hãy ghi nhớ <code>DockerRootDir</code> ngay bây giờ.</strong> Mọi thứ Docker lưu — từng tầng ảnh, từng volume, từng mẩu cache dựng — đều nằm dưới đường dẫn đó, mà trên một bản cài Linux mặc định là <code>/var/lib/docker</code> nằm trên hệ thống file gốc của bạn. Nó phình lên âm thầm và đều đặn; <code>docker system df</code> là câu lệnh cho bạn biết bao nhiêu, và Chương 11 nói cách thu hồi nó TRƯỚC KHI một cái đĩa đầy kéo sập cơ sở dữ liệu.</div>

<h3>hello-world, từng dòng một</h3>
${slide('dk-00', 31, 'hello-world: năm bước gói trong một lệnh')}
<p>Cái output bạn vừa chạy ở trên là một câu chuyện năm bước, và mỗi bước đều là thứ bạn sẽ chủ động làm về sau:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Unable to find image locally</span><span class="lz-t">CLI hỏi tiến trình nền; tiến trình nền tra kho cục bộ</span><span class="lz-d">Image được lưu sẵn trên máy. Lần chạy thứ hai của câu lệnh này không in dòng nào trong số này vì chẳng còn gì phải tải.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Pulling from library/hello-world</span><span class="lz-t">Docker Hub, registry mặc định</span><span class="lz-d"><code>hello-world</code> là viết tắt của <code>docker.io/library/hello-world:latest</code>. Chương 3 mổ xẻ cái tên đó — nó có bốn phần và phần nào cũng quan trọng.</span></div>
  <div class="lz-step"><span class="lz-k">3 · c1ec31eb5944: Pull complete</span><span class="lz-t">một tầng đã tải xong</span><span class="lz-d">Image được ghép từ các TẦNG chồng lên nhau, mỗi tầng một mã băm riêng. Một ảnh lớn hơn in ra nhiều dòng kiểu này, và những tầng bạn đã có thì được bỏ qua — chính là cơ chế đứng sau những lượt dựng nhanh của Chương 5.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Digest: sha256:d211f485…</span><span class="lz-t">danh tính theo nội dung</span><span class="lz-d">Cái mã băm này CHÍNH LÀ cái ảnh. Những tag như <code>:latest</code> thì DI CHUYỂN; một digest thì không bao giờ. Chương 3 giải thích vì sao production nên ghim một cái.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Hello from Docker!</span><span class="lz-t">một container đã chạy, in ra, rồi thoát</span><span class="lz-d">Nó vẫn còn tồn tại ở trạng thái đã dừng — <code>docker ps -a</code> cho thấy nó. Chương 1 nói về vòng đời đó, và vì sao container đã dừng chất đống nếu bạn không bao giờ truyền <code>--rm</code>.</span></div>
</div>
<pre><code>docker ps -a --format 'table {{.Names}}\\t{{.Image}}\\t{{.Status}}'
docker images
docker rm \$(docker ps -aq --filter ancestor=hello-world)    <span class="tok-comment"># dọn dẹp</span></code></pre>
<div class="out">NAMES              IMAGE         STATUS
elegant_darwin     hello-world   Exited (0) 2 minutes ago
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    d2c94e258dcb   14 months ago  13.3kB</div>
<p><strong>Trên Docker 29, cùng các lệnh đó trông hơi khác.</strong> Output thật trên máy Mac của khoá, lần kéo đầu tiên, 23/09/2026 (container được đặt tên bằng <code>--name</code>, nên có tên dễ đọc thay vì tên ngẫu nhiên):</p>
<div class="out">Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
58dee6a49ef1: Pulling fs layer
58dee6a49ef1: Download complete
58dee6a49ef1: Pull complete
c3bdf82c34d1: Download complete
Digest: sha256:5e23090353324d887c48ad5e5c56d294eab81588df9605b07d1afe895f9cc8f8
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
…
NAMES        IMAGE         STATUS
dk00-hello   hello-world   Exited (0) Less than a second ago
IMAGE                ID             DISK USAGE   CONTENT SIZE   EXTRA
hello-world:latest   5e2309035332       22.6kB         10.3kB   U</div>
<p>Hai khác biệt đáng biết. Lúc kéo, mỗi tầng hiện nhiều bước hơn (<code>Pulling fs layer</code> → <code>Download complete</code> → <code>Pull complete</code>) vì Engine 29 lưu image qua containerd. Và <code>docker images</code> có cột mới: <strong>CONTENT SIZE</strong> là kích thước nén bạn phải tải về, <strong>DISK USAGE</strong> cộng thêm bản đã giải nén trên đĩa, còn chữ <code>U</code> ở cột EXTRA nghĩa là image đang được một container dùng. Chương 1.2 giải thích cả hai kích thước. Digest cũng khác output cũ ở trên: <code>hello-world:latest</code> đã được dựng lại kể từ đó — một ví dụ sống cho câu của Chương 3: tag thì di chuyển, digest thì không.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> ngày mai cả nhóm bắt đầu dùng Docker. Bình (Windows) bảo “cài Docker rồi mà chẳng cái gì chạy”, An (Mac) bảo “build của mình cứ chết giữa chừng”, còn bạn dùng Linux. Trước khi giúp ai, hãy chứng minh bản cài của chính mình khoẻ mạnh và biết từng mảnh là gì.</p><ol>
<li>Chạy <code>docker version</code> và chỉ ra phần Client và phần Server. Ghi lại hai giá trị <code>OS/Arch</code> — trên máy bạn chúng có giống nhau không?</li>
<li>Chạy <code>docker info --format '{{.NCPU}} CPU · {{.MemTotal}}'</code> và đổi số byte ra GiB (chia cho 1073741824). Trên Mac hay Windows, so với RAM thật của máy.</li>
<li>Chạy <code>docker compose version</code> và <code>docker buildx version</code>. Cả hai phải trả lời; nếu <code>docker compose</code> báo “not a docker command” thì máy thiếu plugin Compose.</li>
<li>Chạy <code>docker run --name thu-hello hello-world</code>, rồi <code>docker ps -a --filter name=thu-hello</code>. Giải thích vì sao container vẫn còn trong danh sách.</li>
<li>Xoá đúng container đó: <code>docker rm thu-hello</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được Client là chương trình nào và Server chạy ở đâu, biết Engine của mình thật sự có bao nhiêu bộ nhớ, cả hai lệnh plugin đều trả lời, và <code>docker ps -a --filter name=thu-hello</code> rỗng trở lại. Điểm cộng cho bạn cùng nhóm dùng Windows: <code>pwd</code> bên trong WSL in ra đường dẫn dưới <code>/home/</code>, không phải <code>/mnt/c/</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Daemon (tiến trình nền)</span><span class="v">Chương trình chạy ngầm; với Docker là <code>dockerd</code>, thứ làm toàn bộ việc thật.</span></div>
  <div class="kv"><span class="k">Client / CLI (máy khách / giao diện dòng lệnh)</span><span class="v">Lệnh <code>docker</code>: chỉ gửi yêu cầu tới daemon rồi in câu trả lời ra.</span></div>
  <div class="kv"><span class="k">Unix socket (cổng giao tiếp nội bộ)</span><span class="v">Một điểm kết nối trông như file (<code>/var/run/docker.sock</code>) để CLI nói chuyện với daemon trên cùng một máy.</span></div>
  <div class="kv"><span class="k">docker group (nhóm docker)</span><span class="v">Nhóm người dùng Linux được dùng socket đó mà không cần <code>sudo</code> — thực chất là quyền root.</span></div>
  <div class="kv"><span class="k">Rootless mode (chế độ không root)</span><span class="v">Chạy cả daemon dưới một người dùng thường, để container có thoát ra cũng không thành root trên máy chủ.</span></div>
  <div class="kv"><span class="k">WSL2 (Linux bên trong Windows)</span><span class="v">Windows Subsystem for Linux: một máy ảo nhẹ chạy Linux thật trên Windows — nơi container và mã nguồn của bạn nên ở.</span></div>
  <div class="kv"><span class="k">Docker context (ngữ cảnh)</span><span class="v">Một Engine đích có tên cho CLI (Desktop cục bộ, máy chủ ở xa qua SSH…); xem bằng <code>docker context ls</code>.</span></div>
  <div class="kv"><span class="k">arm64 / amd64 (kiến trúc bộ xử lý)</span><span class="v">Hai họ bộ xử lý: chip Apple và nhiều máy chủ ARM, so với đa số PC và VPS.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trên Linux, Docker Engine chạy thẳng trên nhân; trên macOS và Windows, Docker Desktop (hoặc Colima/OrbStack, hoặc WSL2) chạy một máy ảo Linux có Engine bên trong.</li>
<li>Cài trên Ubuntu từ kho apt của Docker: năm gói — Engine, CLI, containerd, buildx và plugin Compose.</li>
<li>Lệnh <code>docker</code> chỉ là máy khách; <code>docker version</code> in Client và Server vì đó là hai chương trình, có khi trên hai hệ điều hành.</li>
<li>Ở trong nhóm <code>docker</code> là có root không cần mật khẩu — chứng minh bằng việc đọc <code>/etc/shadow</code> qua một container; dùng trên laptop, nghĩ kỹ trên máy chủ.</li>
<li>Trên Mac, Engine chỉ thấy bộ nhớ của máy ảo (ở đây 7,7 GiB trên 32 GB) và một CPU ARM; trên Windows để mã trong WSL, không để ở <code>/mnt/c</code>.</li>
<li>hello-world là năm bước trong một lệnh: tìm ở máy, kéo từ Docker Hub, tải các tầng, kiểm digest, tạo và chạy một container còn nằm lại tới khi bạn xoá.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/install/ubuntu/" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Cài Docker Engine trên Ubuntu</span><span class="lc-sub">Hướng dẫn chuẩn, luôn được cập nhật. Nếu mấy câu lệnh ở trên có lệch khỏi thực tế thì trang này là nguồn sự thật — và nó có bản tương đương cho Debian, Fedora, RHEL và Arch.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/rootless/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Chế độ rootless</span><span class="lc-sub">Chạy trọn tiến trình nền dưới một người dùng không đặc quyền. Câu trả lời đúng cho máy dùng chung và máy chạy CI, kèm một danh sách trung thực các hạn chế (cổng dưới 1024, vài trình lưu trữ).</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/filesystems" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">WSL — làm việc xuyên hệ thống file</span><span class="lc-sub">Giải thích của chính Microsoft về việc vì sao <code>/mnt/c</code> chậm và nên để file ở đâu. Đọc một lần nếu bạn lập trình trên Windows; nó tiết kiệm cho bạn vài giờ mỗi tuần.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: kiểm lại bản cài của bạn</span><span class="lc-sub">Bài chấm điểm: đọc một output <code>docker version</code> rồi nói xem sai ở đâu, diễn giải <code>docker system df</code>, và giải thích vì sao máy này cần <code>sudo</code> còn máy kia thì không.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>docker-compose</code> (gạch nối) so với <code>docker compose</code> (dấu cách). Lệnh có gạch nối là Compose v1, viết bằng Python, ngừng bảo trì từ 2023, và khác biệt theo những cách có thật — nó đặt tên container bằng gạch dưới, không hỗ trợ <code>include</code> hay các tính năng Compose mới như <code>develop.watch</code> (nó chỉ kịp có <code>profiles</code> ở các bản cuối, 1.28, tháng 1/2021), và xử lý điều kiện <code>depends_on</code> khác đi. Nếu một file Compose trong bài hướng dẫn nào đó "không chạy", hãy kiểm xem bạn đang chạy cái nào: <code>docker compose version</code> phải nói v2 hoặc mới hơn (máy Mac của khoá báo v5.5.1 vào tháng 9/2026). Trên Ubuntu, cài <code>docker-compose-plugin</code> như ở trên là bạn có v2, và nên xoá mọi tệp nhị phân v1 bạn tìm thấy.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Câu lệnh <code>docker</code> chỉ là một máy khách — tiến trình nền mới làm việc, đó là lý do <code>docker version</code> in ra hai phần và là lý do "cannot connect to the Docker daemon" chưa bao giờ là lỗi của CLI. Thêm mình vào nhóm <code>docker</code> là cấp quyền root, nên cứ làm trên laptop và hãy nghĩ hai lần trên máy chủ. Và trên macOS với Windows thì có một máy ảo Linux nằm ở giữa: hãy giữ file của bạn ở phía Linux của nó, không thì bạn trả giá cho cú vượt biên đó ở MỌI lần đọc file.</p>
</div>
`,
    },
    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Your first five minutes: run something real|||0.3 — Năm phút đầu tiên: chạy một thứ có thật',
      slug: 'dk-0-3-nam-phut',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dựng một web server và một cơ sở dữ liệu trong hai câu lệnh, nhìn vào bên trong, thay nội dung nó phục vụ, xoá sạch dấu vết, và dùng container như một công cụ vứt đi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Your first five minutes: run something real</h2>
<p class="lead">Nothing about Docker makes sense in the abstract. This lesson is a guided tour with your hands on the keyboard: a real web server, a real database, a look inside both, and a clean machine at the end. Every command here is explained properly in Chapters 1–3 — right now the point is to see what the thing does.</p>

<h3>A web server, in one command</h3>
${slide('dk-00', 32, 'Giải phẫu một lệnh docker run')}
<pre><code>docker run -d --name web -p 8080:80 nginx:1.27-alpine
curl -s localhost:8080 | head -5</code></pre>
<div class="out">Unable to find image 'nginx:1.27-alpine' locally
1.27-alpine: Pulling from library/nginx
43c4264eed91: Pull complete
1ba4d4a91ce4: Pull complete
Digest: sha256:41523187cf7d7a2f2677a80609d9caa14388bf5c1fbca9c410ba3de602aaaab4
Status: Downloaded newer image for nginx:1.27-alpine
8c40e93b1a41d2f3c1bd7b6c2e6f4a9c9b8f2d1e5a3c7d9e0b1f2a3c4d5e6f70

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Welcome to nginx!&lt;/title&gt;</div>
<p>Roughly eight seconds, and you have a production-grade web server running. Notice what you did <em>not</em> do: no <code>apt install nginx</code>, no configuration file, no <code>systemctl</code>, no decision about which version your distribution happens to package. And the long hex string is the container's full ID — the machine is now running a process it did not have thirty seconds ago.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">-d</span><span class="v">Detached: run in the background and give me my prompt back. Without it, nginx's output takes over your terminal and Ctrl-C stops the container.</span></div>
  <div class="kv"><span class="k">--name web</span><span class="v">A name you choose, instead of the random one Docker generates (<code>elegant_darwin</code>). Every later command can use it, and names must be unique on the machine.</span></div>
  <div class="kv"><span class="k">-p 8080:80</span><span class="v">Publish: traffic arriving on <strong>host</strong> port 8080 is forwarded to port <strong>80 inside</strong> the container. The order is <code>host:container</code> and getting it backwards is Chapter 8's most common mistake.</span></div>
  <div class="kv"><span class="k">nginx:1.27-alpine</span><span class="v">The image name and its tag. Pinning <code>1.27-alpine</code> rather than taking <code>latest</code> means this command will still do the same thing next year — Chapter 3 explains why that matters more than it sounds.</span></div>
</div>
<p>A small real example of "tags move": on the course's Mac, the <code>alpine:latest</code> cached weeks ago is Alpine 3.24.1, while pulling <code>alpine:3.24</code> today gives 3.24.2. Docker never refreshes a cached tag by itself — two teammates can run "the same" <code>alpine:latest</code> and get different files. A precise tag like <code>1.27-alpine</code> narrows that; a digest removes it (Chapter 3).</p>

<h3>How -p works — and why the log shows a strange address</h3>
${slide('dk-00', 33, '-p MÁY:CONTAINER — gõ cửa máy, Docker chuyển vào trong')}
<p>Inside its own network namespace the container has its own IP address and its own port 80. Nobody outside can reach that directly. <code>-p 8080:80</code> tells Docker: "listen on port 8080 of <em>this machine</em>, and forward whatever arrives to port 80 of the container". Two commands show both halves (real output, course Mac, port 18000 instead of 8080):</p>
<pre><code class="language-bash">docker port web
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' web</code></pre>
<div class="out">80/tcp -&gt; 0.0.0.0:18000
80/tcp -&gt; [::]:18000
172.17.0.12</div>
<p>Read it as: container port <code>80/tcp</code> is published on every IPv4 address (<code>0.0.0.0</code>) and every IPv6 address (<code>[::]</code>) of the host, port 18000; inside, the container is <code>172.17.0.12</code> on Docker's private bridge network. Now the log line: the request reaches nginx <em>from</em> the forwarder, not from your browser. On a Linux host that address is the bridge gateway <code>172.17.0.1</code> (the course's Linux machine logged exactly that); on a Mac it is Docker Desktop's VM network, which is why the Mac logged <code>192.168.65.1</code>:</p>
<div class="out">192.168.65.1 - - [23/Sep/2026:14:04:08 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/8.7.1" "-"</div>
<table>
<tr><th>You write</th><th>What happens</th></tr>
<tr><td><code>-p 8080:80</code></td><td>host 8080 → container 80. The usual form.</td></tr>
<tr><td><code>-p 80:8080</code></td><td>host 80 → container 8080 — but nginx listens on 80, so the connection is refused. The classic mistake.</td></tr>
<tr><td><code>-p 127.0.0.1:8080:80</code></td><td>Only reachable from this machine, not from the network. Good for databases on a laptop (Chapter 8).</td></tr>
<tr><td><code>-p 8081:80</code> on a second container</td><td>Fine: two containers can both listen on 80 inside; only the <em>left</em> number must be unique on the host.</td></tr>
<tr><td>no <code>-p</code></td><td>The container runs, and other containers can reach it, but your browser cannot.</td></tr>
</table>

<h3>Look at what is running</h3>
<pre><code>docker ps
docker logs web | tail -3
docker stats --no-stream web</code></pre>
<div class="out">CONTAINER ID   IMAGE               COMMAND                  STATUS         PORTS                                   NAMES
8c40e93b1a41   nginx:1.27-alpine   "/docker-entrypoint.…"   Up 2 minutes   0.0.0.0:8080-&gt;80/tcp, [::]:8080-&gt;80/tcp   web

172.17.0.1 - - [22/Aug/2026:20:14:07 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/8.5.0"

CONTAINER ID   NAME   CPU %     MEM USAGE / LIMIT     MEM %     NET I/O       BLOCK I/O
8c40e93b1a41   web    0.00%     3.629MiB / 15.46GiB   0.02%     1.02kB/126B   0B/0B</div>
<p>3.6MB of memory for a running web server, and the log line from your own <code>curl</code>. Note the client address: <code>172.17.0.1</code>, not <code>127.0.0.1</code> — from inside the container, your host machine is a different computer on a small private network. That is Chapter 8, and it is the reason a container cannot reach your local database at <code>localhost</code>.</p>
<div class="callout"><strong>Docker 29 prints two more columns.</strong> The block above was shortened by hand: real <code>docker ps</code> always has a <code>CREATED</code> column, and <code>docker stats</code> ends with <code>PIDS</code>. The same three commands on the course's Mac, 09/2026:</div>
<div class="out">CONTAINER ID   IMAGE               COMMAND                  CREATED         STATUS        PORTS                                       NAMES
d9c3098effe2   nginx:1.27-alpine   "/docker-entrypoint.…"   2 seconds ago   Up 1 second   0.0.0.0:18000-&gt;80/tcp, [::]:18000-&gt;80/tcp   web

2026/09/23 14:04:06 [notice] 1#1: start worker process 38
2026/09/23 14:04:06 [notice] 1#1: start worker process 39
192.168.65.1 - - [23/Sep/2026:14:04:08 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/8.7.1" "-"

CONTAINER ID   NAME   CPU %     MEM USAGE / LIMIT     MEM %     NET I/O          BLOCK I/O     PIDS
d9c3098effe2   web    0.00%     8.336MiB / 7.748GiB   0.11%     1.3kB / 1.36kB   0B / 12.3kB   11</div>
<table>
<tr><th>Column</th><th>How to read it</th></tr>
<tr><td><code>CONTAINER ID</code></td><td>The first 12 characters of the full ID that <code>docker run -d</code> printed; any unique prefix works in commands.</td></tr>
<tr><td><code>COMMAND</code></td><td>What PID 1 runs — here the image's entrypoint script, cut with <code>…</code>. <code>--no-trunc</code> shows it all.</td></tr>
<tr><td><code>STATUS</code></td><td><code>Up …</code> running; <code>Exited (N) …</code> stopped with exit code N; <code>Created</code> never started (Chapter 1.3).</td></tr>
<tr><td><code>PORTS</code></td><td><code>host:port-&gt;container_port/tcp</code>. No arrow means "exposed but not published".</td></tr>
<tr><td><code>MEM USAGE / LIMIT</code></td><td>Memory used, and the most it may use — without <code>--memory</code>, the whole VM (7.7 GiB on this Mac).</td></tr>
<tr><td><code>PIDS</code></td><td>Processes and threads inside: 11 = one nginx master + 10 workers (one per CPU on this 10-CPU VM).</td></tr>
</table>

<h3>Go inside</h3>
${slide('dk-00', 34, 'Bên trong chỉ có vài tiến trình — và chúng hiện ra ở máy chủ')}
<pre><code>docker exec -it web sh</code></pre>
<div class="out">/ # ls /
bin  dev  docker-entrypoint.d  etc  home  lib  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
/ # cat /etc/os-release | head -2
NAME="Alpine Linux"
ID=alpine
/ # ps aux
PID   USER     TIME  COMMAND
    1 root      0:00 nginx: master process nginx -g daemon off;
   31 nginx     0:00 nginx: worker process
   39 root      0:00 sh
   45 root      0:00 ps aux
/ # exit</div>
<p>A complete Alpine Linux filesystem, and a process table with <strong>four entries</strong>. That is the single most illuminating output in this lesson. A virtual machine running nginx would show a hundred processes — an init system, a logger, a cron daemon, an SSH server. A container shows only the processes you asked for, because it is not a machine. It is a process (PID 1 here is nginx itself) with a private view of the filesystem, the network and the process table.</p>
<div class="callout warn"><strong>Your list may be longer — and that is fine.</strong> nginx starts one worker per CPU it can see. The four-line output above came from a one-CPU server. On the course's Mac, whose Docker VM has 10 CPUs, the same <code>ps aux</code> printed twelve lines: PID 1 (the master), ten <code>nginx: worker process</code> lines (PIDs 30–39), and <code>ps aux</code> itself. The point does not change: only nginx and your own commands, no init system, no logger, no SSH server.</div>
<p><strong>On a Mac or Windows, run this part on Linux — or use <code>docker top</code>.</strong> With Docker Desktop the "host" of the container is the Linux VM, so <code>ps</code> in your macOS terminal finds nothing (on the course's Mac, <code>grep</code> returned no line at all). <code>docker top web</code> asks the Engine instead and works everywhere. The course's Linux machine, real output:</p>
<div class="out">$ docker inspect -f '{{.State.Pid}}' web
388192
$ ps -o pid,user,args -p 388192
    PID USER     COMMAND
 388192 root     nginx: master process nginx -g daemon off;
$ docker exec web ps -o pid,args | head -2
PID   COMMAND
    1 nginx: master process nginx -g daemon off;</div>
<p>One process, two numbers: <code>388192</code> in the host's process table, <code>1</code> in the container's. (On the Mac, <code>docker top</code> shows the worker processes owned by a user called <code>statd</code>: nginx's user inside the container has UID 101, and the VM's own <code>/etc/passwd</code> happens to call UID 101 <code>statd</code>. Same number, different name book — Chapter 7 returns to UIDs.)</p>
<pre><code><span class="tok-comment"># From the HOST, the same process is visible — with a different PID</span>
ps -eo pid,comm,args | grep 'nginx: master' | head -2
docker top web</code></pre>
<div class="out">  40122 nginx           nginx: master process nginx -g daemon off;
UID     PID    PPID   C   STIME   TTY   TIME       CMD
root    40122  40100  0   20:12   ?     00:00:00   nginx: master process nginx -g daemon off;</div>
<div class="callout ok"><strong>This is the whole idea in one observation.</strong> PID 1 inside the container and PID 40122 on the host are <em>the same process</em>. Nothing is emulated, nothing is virtualised, and there is no second kernel — the process simply has its own view of what exists. Chapter 1 names the mechanism (namespaces) and shows you where the boundary is drawn.</div>

<h3>Change what it serves</h3>
${slide('dk-00', 35, 'Bind mount: gắn cả THƯ MỤC, đừng gắn một file lẻ')}
<pre><code>echo '&lt;h1&gt;Hello from a container&lt;/h1&gt;' &gt; index.html
docker rm -f web
docker run -d --name web -p 8080:80 \\
  -v "\$PWD/index.html:/usr/share/nginx/html/index.html:ro" \\
  nginx:1.27-alpine
curl -s localhost:8080</code></pre>
<div class="out">&lt;h1&gt;Hello from a container&lt;/h1&gt;</div>
<p><code>-v host_path:container_path:ro</code> is a <strong>bind mount</strong>: a file on your machine appears at that path inside the container, read-only. Edit <code>index.html</code> in your editor, refresh the browser, and the change is already there — no rebuild, no restart. This is how local development works, and Chapter 7 covers the details, including the file-permission problem it creates on Linux.</p>
<div class="pitfall co-tieu-de"><strong>Mount the folder, not a single file.</strong> The example above mounts one <em>file</em>, and that has a trap: Docker attaches a single-file bind mount to the file's inode, not its name. Many editors, and scripts using <code>mv</code>, save by writing a new file and renaming it over the old one — a new inode. Real output on the course's Mac right after such a save:</div>
<pre><code class="language-bash">echo '&lt;h1&gt;Bản mới&lt;/h1&gt;' &gt; index.new &amp;&amp; mv index.new index.html
curl -s localhost:8080 | head -2
docker exec web cat /usr/share/nginx/html/index.html</code></pre>
<div class="out">&lt;html&gt;
&lt;head&gt;&lt;title&gt;404 Not Found&lt;/title&gt;&lt;/head&gt;
cat: can't open '/usr/share/nginx/html/index.html': No such file or directory</div>
<p>On the Mac the file simply vanished from the container; on Linux the container keeps showing the <em>old</em> content forever. Both are silent. This is exactly the student-project incident from "Start here (2/2)": an <code>nginx.conf</code> "deployed successfully" twice with no effect. The fix is to mount the directory — then renames inside it are seen:</p>
<pre><code class="language-bash">mkdir -p site &amp;&amp; echo '&lt;h1&gt;Bản 1&lt;/h1&gt;' &gt; site/index.html
docker rm -f web
docker run -d --name web -p 8080:80 -v "\$PWD/site:/usr/share/nginx/html:ro" nginx:1.27-alpine
echo '&lt;h1&gt;Bản 2 — lưu kiểu mv&lt;/h1&gt;' &gt; site/tmp.html &amp;&amp; mv site/tmp.html site/index.html
curl -s localhost:8080
docker exec web sh -c 'echo x &gt; /usr/share/nginx/html/a.html'</code></pre>
<div class="out">&lt;h1&gt;Bản 2 — lưu kiểu mv&lt;/h1&gt;
sh: can't create /usr/share/nginx/html/a.html: Read-only file system</div>
<p>The last line shows what <code>:ro</code> buys you: the container cannot write into your folder. (Real output, course Mac, port 18000. Even an in-place edit is not always instant on a Mac: right after one, the course's Mac once served a half-updated page, and the full new content two seconds later — Docker Desktop's file sharing caches briefly — so refresh twice before assuming it failed.)</p>

<h3>A database, also in one command</h3>
${slide('dk-00', 36, 'Postgres một lệnh — nhưng dữ liệu nằm ở volume vô danh')}
<pre><code>docker run -d --name db \\
  -e POSTGRES_PASSWORD=devpass \\
  -e POSTGRES_DB=app_dev \\
  -p 5432:5432 \\
  postgres:16-alpine

sleep 5
docker exec -it db psql -U postgres -d app_dev -c 'select version();'</code></pre>
<div class="out">                                                 version
---------------------------------------------------------------------------------------------------------
 PostgreSQL 16.4 on x86_64-pc-linux-musl, compiled by gcc (Alpine 13.2.1_git20240309) 13.2.1 20240309, 64-bit
(1 row)</div>
<p>PostgreSQL 16, configured, initialised, with a database created and a password set — from one command, with nothing installed on your machine. Try that again with <code>postgres:14-alpine</code> and a different name and port, and you have two major versions running side by side without a version manager or a conflict. That is the isolation point from Lesson 0.1, demonstrated.</p>
<div class="callout warn"><strong>That database's data does not survive.</strong> Delete the container and everything in it is gone, because a container's writable layer dies with it. For a five-minute experiment that is exactly what you want. For anything you care about you need a <strong>volume</strong>, which is Chapter 7 — and forgetting it is the most expensive beginner mistake in this course, so it gets a whole chapter.</div>
<div class="callout"><strong>More precisely — and this matters.</strong> For PostgreSQL the data is not in the writable layer at all: the <code>postgres</code> image declares <code>VOLUME /var/lib/postgresql/data</code>, so Docker quietly creates an <strong>anonymous volume</strong> (a volume with a random name) for it. <code>docker rm -f db</code> removes the container but <em>not</em> that volume. The effect you feel is the same — a new <code>db</code> container gets a new, empty volume, so your tables are "gone" — but the old data is still on disk, orphaned, using space. Real output on the course's Mac (PostgreSQL 16.14 on arm64):</div>
<pre><code class="language-bash">docker inspect db --format '{{range .Mounts}}{{.Type}} {{.Name}} -&gt; {{.Destination}}{{end}}'
docker rm -f db
docker volume ls</code></pre>
<div class="out">volume 429a8358ea06b94dc4721786dc772ddce88600f80cc9e45cbe6f60bc60919518 -&gt; /var/lib/postgresql/data
db
DRIVER    VOLUME NAME
local     429a8358ea06b94dc4721786dc772ddce88600f80cc9e45cbe6f60bc60919518</div>
<p>Use <code>docker rm -fv db</code> to remove the container <em>and</em> its anonymous volumes when you really want it gone; name the volume (<code>-v pgdata:/var/lib/postgresql/data</code>, Chapter 7) when you want it kept. Chapter 1.4 shows how to reattach an orphaned volume and get the data back.</p>
<p>Two other things the course's Mac showed: PostgreSQL answered <code>select</code> about a second after <code>docker run</code> (the <code>sleep 5</code> is a safe margin, not a requirement — Chapter 9 replaces it with a healthcheck), and <code>postgres:14-alpine</code> started beside it on another host port reported <code>14.24</code> while the first reported <code>16.14</code>. Memory for the three containers running at that moment: nginx 8.5 MiB, PostgreSQL 16 24 MiB, PostgreSQL 14 21 MiB.</p>

<h3>Containers as disposable tools</h3>
<p>You do not need to install a language to use one. <code>--rm</code> deletes the container the moment it exits, so these leave nothing behind at all:</p>
<pre><code><span class="tok-comment"># Run a Node one-liner without Node installed</span>
docker run --rm node:22-alpine node -e 'console.log(process.version, 2**32)'

<span class="tok-comment"># A Python REPL, gone when you exit</span>
docker run --rm -it python:3.12-alpine python

<span class="tok-comment"># Format JSON with jq, on a machine that has no jq</span>
echo '{"b":2,"a":1}' | docker run --rm -i ghcr.io/jqlang/jq -S .

<span class="tok-comment"># A throwaway Linux shell to try something dangerous in</span>
docker run --rm -it alpine sh</code></pre>
<div class="out">v22.11.0 4294967296
{
  "a": 1,
  "b": 2
}</div>

<h3>Clean up completely</h3>
${slide('dk-00', 37, 'Container dùng một lần — rồi dọn sạch thật sự')}
<pre><code>docker rm -f web db                  <span class="tok-comment"># -f stops them first</span>
docker ps -a
docker images
docker system df</code></pre>
<div class="out">CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
REPOSITORY    TAG          IMAGE ID       CREATED       SIZE
nginx         1.27-alpine  b4e5c0a1d2f3   3 weeks ago   52.5MB
postgres      16-alpine    9a1c8e7d6b5a   3 weeks ago   274MB
hello-world   latest       d2c94e258dcb   14 months ago 13.3kB</div>
<p>No containers, and your machine is exactly as it was — except for the images, which stay cached so the next <code>docker run nginx:1.27-alpine</code> is instant. That cache is not free: it is the <code>/var/lib/docker</code> from Lesson 0.2, and Chapter 11 covers pruning it. For now, <code>docker system prune</code> reclaims everything not in use.</p>
<div class="callout warn"><strong>Two corrections to the paragraph above.</strong> First, "exactly as it was" is not quite true: <code>docker rm -f web db</code> left PostgreSQL's anonymous volume behind (previous section) — <code>docker rm -fv</code> would have removed it. Second, <code>docker system prune</code> does <em>not</em> reclaim everything not in use. By default it removes stopped containers, unused networks, <em>dangling</em> images (untagged leftovers) and unused build cache. Tagged images such as <code>nginx:1.27-alpine</code> stay unless you add <code>-a</code>, and volumes stay unless you add <code>--volumes</code>. And on a machine that also runs other projects, a machine-wide prune can delete things that are not yours; delete what you created, by name.</div>
<table>
<tr><th>Command</th><th>Removes</th><th>Leaves</th></tr>
<tr><td><code>docker run --rm …</code></td><td>the container, as soon as it exits</td><td>the image, for next time</td></tr>
<tr><td><code>docker rm -f web</code></td><td>the container (stopping it first)</td><td>its anonymous volumes</td></tr>
<tr><td><code>docker rm -fv db</code></td><td>the container and its anonymous volumes</td><td>named volumes, the image</td></tr>
<tr><td><code>docker image rm postgres:14-alpine</code></td><td>one image, if no container uses it</td><td>everything else</td></tr>
<tr><td><code>docker system prune</code></td><td>stopped containers, unused networks, dangling images, build cache</td><td>tagged images, volumes</td></tr>
</table>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">You installed nothing</span><span class="lz-t">no nginx, no PostgreSQL, no Node, no Python, no jq</span><span class="lz-d">All of them ran; none of them touched your system's package manager or left a config file behind.</span></div>
  <div class="lz-step"><span class="lz-k">You ran two servers</span><span class="lz-t">and they used about 40MB of memory between them</span><span class="lz-d">Because they are processes, not machines. There was no second operating system to boot.</span></div>
  <div class="lz-step"><span class="lz-k">You looked inside one</span><span class="lz-t">and found a full Linux filesystem with four processes</span><span class="lz-d">The filesystem comes from the image; the short process list is the boundary. That contrast is the mental model.</span></div>
  <div class="lz-step"><span class="lz-k">You changed what it served</span><span class="lz-t">with a bind mount, no rebuild</span><span class="lz-d">The development workflow of Chapters 7 and 10, in one flag.</span></div>
  <div class="lz-step"><span class="lz-k">You deleted it all</span><span class="lz-t">and the machine is clean</span><span class="lz-d">Disposability. This is what makes experimenting cheap, and it is worth doing deliberately while you learn.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your team needs a quick landing page for the SWP391 demo and a PostgreSQL to try the schema on — today, on your laptop, without installing anything, and your laptop must be clean afterwards because it also runs another course's database.</p><ol>
<li><code>mkdir -p ~/thu-docker/0-3/site &amp;&amp; cd ~/thu-docker/0-3</code> and write <code>site/index.html</code> with your team name in an <code>&lt;h1&gt;</code>.</li>
<li>Serve the <strong>folder</strong>: <code>docker run -d --name thu-web -p 8080:80 -v "\$PWD/site:/usr/share/nginx/html:ro" nginx:1.27-alpine</code>. Open <code>localhost:8080</code>, change the title in your editor, refresh.</li>
<li>Start PostgreSQL on a host port that cannot clash with a local one: <code>docker run -d --name thu-db -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=app_dev -p 15432:5432 postgres:16-alpine</code>, then <code>docker exec thu-db psql -U postgres -d app_dev -c 'create table nhom(ten text); insert into nhom values (\$\$SWP391\$\$); select * from nhom;'</code>.</li>
<li>Find the anonymous volume: <code>docker inspect thu-db --format '{{range .Mounts}}{{.Name}}{{end}}'</code>.</li>
<li>Clean up by name, volumes included: <code>docker rm -fv thu-web thu-db</code>, then <code>docker ps -a --filter name=thu-</code> and <code>docker volume ls</code> (the name from step 4 must be gone).</li>
</ol>
<p><strong>Done when:</strong> your edited title appeared after a refresh with no restart, <code>select</code> returned your row, you wrote down the volume name, and after step 5 neither the two containers nor that volume exist — while everything else on your machine is untouched.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Detached (-d)</span><span class="v">Running a container in the background and getting your prompt back.</span></div>
  <div class="kv"><span class="k">Publish (-p host:container)</span><span class="v">Forward a port of your machine to a port inside the container.</span></div>
  <div class="kv"><span class="k">Bind mount (-v /path:/path)</span><span class="v">Make a host file or folder appear inside the container; mount folders, not single files.</span></div>
  <div class="kv"><span class="k">Anonymous volume</span><span class="v">A volume with a random name that an image asks for (<code>VOLUME</code>); it survives <code>rm</code> unless you add <code>-v</code>.</span></div>
  <div class="kv"><span class="k">exec</span><span class="v">Run an extra command inside a running container — <code>docker exec -it web sh</code> opens a shell.</span></div>
  <div class="kv"><span class="k">--rm</span><span class="v">Delete the container automatically as soon as it exits.</span></div>
  <div class="kv"><span class="k">Dangling image</span><span class="v">An image with no tag left, usually an old build; the only kind <code>docker system prune</code> removes by default.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>docker run -d --name web -p 8080:80 nginx:1.27-alpine</code> pulls, creates and starts a web server; <code>-p</code> is always host:container.</li>
<li><code>docker ps</code>, <code>logs</code>, <code>stats</code>, <code>exec</code> and <code>top</code> show what runs; inside there are only nginx's own processes, visible on a Linux host under another PID.</li>
<li>Bind-mount a folder to serve your own files without rebuilding; a single-file mount silently breaks when an editor or <code>mv</code> replaces the file.</li>
<li>PostgreSQL runs in one command and several versions sit side by side; its data lives in an anonymous volume that <code>rm -f</code> leaves behind and a new container does not reuse.</li>
<li><code>--rm</code> makes tools disposable; clean up by name with <code>docker rm -fv</code>, and remember <code>system prune</code> keeps tagged images and volumes.</li>
</ul>

<a class="link-card" href="https://hub.docker.com/_/nginx" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">nginx on Docker Hub</span><span class="lc-sub">The official image's own documentation: available tags, where the config lives, how to mount your own. Every official image has a page like this and reading it saves guessing.</span></span>
</a>
<a class="link-card" href="https://hub.docker.com/_/postgres" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">postgres on Docker Hub</span><span class="lc-sub">Every <code>POSTGRES_*</code> environment variable, the initialisation-script directory, and exactly which path holds the data. You will come back to this in Chapter 7.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: your first containers</span><span class="lc-sub">Graded exercises: publish a port and prove it works, find the process on the host that corresponds to PID 1 inside, serve your own file with a bind mount, and leave the machine clean.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>docker: Error response from daemon: Bind for 0.0.0.0:8080 failed: port is already allocated</code>. It means something else already holds host port 8080 — usually a container you forgot, since a stopped container still owns its name and a running one still owns its port. <code>docker ps -a</code> to see it, <code>docker rm -f &lt;name&gt;</code> to remove it, or just publish a different host port: <code>-p 8081:80</code> works and changes nothing inside the container. If <code>docker ps -a</code> is empty, the port belongs to a normal process on your machine — <code>sudo ss -tlnp | grep 8080</code> names it.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>docker run</code> pulled an image, created a container and started it — three steps that Chapter 1 separates, and knowing they are separate explains most of the CLI. <code>docker exec -it &lt;name&gt; sh</code> is the command you will use most while learning, because looking inside answers questions no amount of reading will. And a container's writable layer dies with the container: fine for experiments, disastrous for a database, which is why Chapter 7 exists.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Năm phút đầu tiên: chạy một thứ có thật</h2>
<p class="lead">Không có gì về Docker có nghĩa khi nói trừu tượng. Bài này là một chuyến đi có hướng dẫn với tay bạn đặt lên bàn phím: một web server thật, một cơ sở dữ liệu thật, một cú nhìn vào bên trong cả hai, và một cái máy sạch sẽ ở cuối. Mọi câu lệnh ở đây đều được giải thích tử tế trong Chương 1–3 — ngay lúc này điểm mấu chốt là NHÌN THẤY cái thứ đó làm được gì.</p>

<h3>Một web server, bằng một câu lệnh</h3>
${slide('dk-00', 32, 'Giải phẫu một lệnh docker run')}
<pre><code>docker run -d --name web -p 8080:80 nginx:1.27-alpine
curl -s localhost:8080 | head -5</code></pre>
<div class="out">Unable to find image 'nginx:1.27-alpine' locally
1.27-alpine: Pulling from library/nginx
43c4264eed91: Pull complete
1ba4d4a91ce4: Pull complete
Digest: sha256:41523187cf7d7a2f2677a80609d9caa14388bf5c1fbca9c410ba3de602aaaab4
Status: Downloaded newer image for nginx:1.27-alpine
8c40e93b1a41d2f3c1bd7b6c2e6f4a9c9b8f2d1e5a3c7d9e0b1f2a3c4d5e6f70

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Welcome to nginx!&lt;/title&gt;</div>
<p>Khoảng tám giây, và bạn có một web server cấp production đang chạy. Hãy để ý những gì bạn <em>KHÔNG</em> làm: không <code>apt install nginx</code>, không file cấu hình, không <code>systemctl</code>, không phải quyết định xem bản phân phối của mình tình cờ đóng gói phiên bản nào. Còn cái chuỗi hex dài kia là ID đầy đủ của container — cái máy giờ đang chạy một tiến trình mà ba mươi giây trước nó chưa có.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">-d</span><span class="v">Tách rời: chạy ở nền và trả lại dấu nhắc cho tôi. Không có nó thì output của nginx chiếm luôn terminal của bạn và Ctrl-C sẽ dừng container.</span></div>
  <div class="kv"><span class="k">--name web</span><span class="v">Một cái tên do bạn chọn, thay cho cái tên ngẫu nhiên Docker tự sinh (<code>elegant_darwin</code>). Mọi câu lệnh về sau dùng được nó, và tên phải là DUY NHẤT trên máy.</span></div>
  <div class="kv"><span class="k">-p 8080:80</span><span class="v">Publish: lưu lượng tới cổng 8080 của <strong>MÁY CHỦ</strong> được chuyển tiếp tới cổng <strong>80 BÊN TRONG</strong> container. Thứ tự là <code>máy chủ:container</code> và viết ngược nó là lỗi phổ biến nhất của Chương 8.</span></div>
  <div class="kv"><span class="k">nginx:1.27-alpine</span><span class="v">Tên ảnh và tag của nó. Ghim <code>1.27-alpine</code> thay vì lấy <code>latest</code> nghĩa là câu lệnh này sang năm vẫn làm đúng như vậy — Chương 3 giải thích vì sao điều đó quan trọng hơn nghe có vẻ.</span></div>
</div>
<p>Một ví dụ nhỏ có thật cho câu “tag thì di chuyển”: trên máy Mac của khoá, image <code>alpine:latest</code> lưu từ vài tuần trước là Alpine 3.24.1, còn kéo <code>alpine:3.24</code> hôm nay thì được 3.24.2. Docker không bao giờ tự làm mới một tag đã lưu — hai người cùng nhóm có thể chạy “cùng” <code>alpine:latest</code> mà nhận file khác nhau. Một tag cụ thể như <code>1.27-alpine</code> thu hẹp khoảng lệch đó; một digest thì xoá hẳn (Chương 3).</p>

<h3>-p hoạt động thế nào — và vì sao log hiện một địa chỉ lạ</h3>
${slide('dk-00', 33, '-p MÁY:CONTAINER — gõ cửa máy, Docker chuyển vào trong')}
<p>Bên trong namespace mạng riêng, container có địa chỉ IP riêng và cổng 80 riêng. Không ai ở ngoài với thẳng tới đó được. <code>-p 8080:80</code> bảo Docker: “hãy nghe ở cổng 8080 của <em>cái máy này</em>, có gì tới thì chuyển tiếp vào cổng 80 của container”. Hai lệnh cho thấy cả hai nửa (output thật, máy Mac của khoá, cổng 18000 thay cho 8080):</p>
<pre><code class="language-bash">docker port web
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' web</code></pre>
<div class="out">80/tcp -&gt; 0.0.0.0:18000
80/tcp -&gt; [::]:18000
172.17.0.12</div>
<p>Đọc là: cổng <code>80/tcp</code> của container được publish trên mọi địa chỉ IPv4 (<code>0.0.0.0</code>) và mọi địa chỉ IPv6 (<code>[::]</code>) của máy, ở cổng 18000; bên trong, container là <code>172.17.0.12</code> trên mạng bridge riêng của Docker. Giờ tới dòng log: request tới nginx <em>từ</em> bộ chuyển tiếp, không phải từ trình duyệt của bạn. Trên máy Linux, địa chỉ đó là cổng ra của mạng bridge <code>172.17.0.1</code> (máy Linux của khoá ghi đúng như vậy); trên Mac nó là mạng của máy ảo Docker Desktop, vì thế máy Mac ghi <code>192.168.65.1</code>:</p>
<div class="out">192.168.65.1 - - [23/Sep/2026:14:04:08 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/8.7.1" "-"</div>
<table>
<tr><th>Bạn viết</th><th>Chuyện gì xảy ra</th></tr>
<tr><td><code>-p 8080:80</code></td><td>máy 8080 → container 80. Dạng thường dùng.</td></tr>
<tr><td><code>-p 80:8080</code></td><td>máy 80 → container 8080 — nhưng nginx nghe ở 80, nên kết nối bị từ chối. Lỗi kinh điển.</td></tr>
<tr><td><code>-p 127.0.0.1:8080:80</code></td><td>Chỉ gọi được từ chính máy này, không từ mạng. Hợp cho CSDL trên laptop (Chương 8).</td></tr>
<tr><td><code>-p 8081:80</code> cho container thứ hai</td><td>Ổn: hai container cùng nghe 80 bên trong được; chỉ con số <em>bên trái</em> là phải duy nhất trên máy.</td></tr>
<tr><td>không có <code>-p</code></td><td>Container vẫn chạy, container khác vẫn gọi được nó, nhưng trình duyệt của bạn thì không.</td></tr>
</table>

<h3>Nhìn xem cái gì đang chạy</h3>
<pre><code>docker ps
docker logs web | tail -3
docker stats --no-stream web</code></pre>
<div class="out">CONTAINER ID   IMAGE               COMMAND                  STATUS         PORTS                                   NAMES
8c40e93b1a41   nginx:1.27-alpine   "/docker-entrypoint.…"   Up 2 minutes   0.0.0.0:8080-&gt;80/tcp, [::]:8080-&gt;80/tcp   web

172.17.0.1 - - [22/Aug/2026:20:14:07 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/8.5.0"

CONTAINER ID   NAME   CPU %     MEM USAGE / LIMIT     MEM %     NET I/O       BLOCK I/O
8c40e93b1a41   web    0.00%     3.629MiB / 15.46GiB   0.02%     1.02kB/126B   0B/0B</div>
<p>3,6MB bộ nhớ cho một web server đang chạy, và dòng log từ chính lệnh <code>curl</code> của bạn. Chú ý địa chỉ máy khách: <code>172.17.0.1</code>, không phải <code>127.0.0.1</code> — từ BÊN TRONG container thì máy của bạn là một cái máy tính KHÁC trên một mạng riêng nhỏ. Đó là Chương 8, và đó là lý do một container không với tới được cơ sở dữ liệu cục bộ của bạn qua <code>localhost</code>.</p>
<div class="callout"><strong>Docker 29 in thêm hai cột.</strong> Khối output ở trên đã bị cắt tay: <code>docker ps</code> thật luôn có cột <code>CREATED</code>, và <code>docker stats</code> kết thúc bằng cột <code>PIDS</code>. Cùng ba lệnh đó trên máy Mac của khoá, tháng 9/2026:</div>
<div class="out">CONTAINER ID   IMAGE               COMMAND                  CREATED         STATUS        PORTS                                       NAMES
d9c3098effe2   nginx:1.27-alpine   "/docker-entrypoint.…"   2 seconds ago   Up 1 second   0.0.0.0:18000-&gt;80/tcp, [::]:18000-&gt;80/tcp   web

2026/09/23 14:04:06 [notice] 1#1: start worker process 38
2026/09/23 14:04:06 [notice] 1#1: start worker process 39
192.168.65.1 - - [23/Sep/2026:14:04:08 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/8.7.1" "-"

CONTAINER ID   NAME   CPU %     MEM USAGE / LIMIT     MEM %     NET I/O          BLOCK I/O     PIDS
d9c3098effe2   web    0.00%     8.336MiB / 7.748GiB   0.11%     1.3kB / 1.36kB   0B / 12.3kB   11</div>
<table>
<tr><th>Cột</th><th>Đọc thế nào</th></tr>
<tr><td><code>CONTAINER ID</code></td><td>12 ký tự đầu của ID đầy đủ mà <code>docker run -d</code> đã in; lệnh nào cũng nhận một đoạn đầu không trùng.</td></tr>
<tr><td><code>COMMAND</code></td><td>Thứ PID 1 đang chạy — ở đây là script entrypoint của image, bị cắt bằng <code>…</code>. Thêm <code>--no-trunc</code> để xem đủ.</td></tr>
<tr><td><code>STATUS</code></td><td><code>Up …</code> đang chạy; <code>Exited (N) …</code> đã dừng với mã thoát N; <code>Created</code> chưa từng chạy (Chương 1.3).</td></tr>
<tr><td><code>PORTS</code></td><td><code>máy:cổng-&gt;cổng_container/tcp</code>. Không có mũi tên nghĩa là “khai báo nhưng chưa publish”.</td></tr>
<tr><td><code>MEM USAGE / LIMIT</code></td><td>Bộ nhớ đang dùng, và mức tối đa được dùng — không có <code>--memory</code> thì là cả máy ảo (7,7 GiB trên Mac này).</td></tr>
<tr><td><code>PIDS</code></td><td>Số tiến trình và luồng bên trong: 11 = một nginx master + 10 worker (mỗi CPU một worker trên máy ảo 10 CPU này).</td></tr>
</table>

<h3>Đi vào bên trong</h3>
${slide('dk-00', 34, 'Bên trong chỉ có vài tiến trình — và chúng hiện ra ở máy chủ')}
<pre><code>docker exec -it web sh</code></pre>
<div class="out">/ # ls /
bin  dev  docker-entrypoint.d  etc  home  lib  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
/ # cat /etc/os-release | head -2
NAME="Alpine Linux"
ID=alpine
/ # ps aux
PID   USER     TIME  COMMAND
    1 root      0:00 nginx: master process nginx -g daemon off;
   31 nginx     0:00 nginx: worker process
   39 root      0:00 sh
   45 root      0:00 ps aux
/ # exit</div>
<p>Một hệ thống file Alpine Linux hoàn chỉnh, và một bảng tiến trình có <strong>BỐN dòng</strong>. Đó là output khai sáng nhất trong cả bài này. Một máy ảo chạy nginx sẽ cho thấy cả trăm tiến trình — một hệ khởi động, một bộ ghi log, một tiến trình cron, một máy chủ SSH. Một container chỉ cho thấy những tiến trình bạn yêu cầu, vì nó KHÔNG PHẢI một cái máy. Nó là một TIẾN TRÌNH (PID 1 ở đây chính là nginx) với một tầm nhìn riêng về hệ thống file, mạng và bảng tiến trình.</p>
<div class="callout warn"><strong>Danh sách của bạn có thể dài hơn — và thế là bình thường.</strong> nginx khởi động một worker cho mỗi CPU nó thấy. Output bốn dòng ở trên đến từ một máy chủ một CPU. Trên máy Mac của khoá, máy ảo Docker có 10 CPU, cùng lệnh <code>ps aux</code> in ra mười hai dòng: PID 1 (master), mười dòng <code>nginx: worker process</code> (PID 30–39), và chính <code>ps aux</code>. Điểm mấu chốt không đổi: chỉ có nginx và lệnh của bạn, không hệ khởi động, không bộ ghi log, không máy chủ SSH.</div>
<p><strong>Trên Mac hay Windows, phần này hãy chạy trên Linux — hoặc dùng <code>docker top</code>.</strong> Với Docker Desktop, “máy chủ” của container là máy ảo Linux, nên <code>ps</code> trong terminal macOS không tìm thấy gì (trên máy Mac của khoá, <code>grep</code> không trả về dòng nào). <code>docker top web</code> thì hỏi Engine nên chạy ở đâu cũng được. Máy Linux của khoá, output thật:</p>
<div class="out">$ docker inspect -f '{{.State.Pid}}' web
388192
$ ps -o pid,user,args -p 388192
    PID USER     COMMAND
 388192 root     nginx: master process nginx -g daemon off;
$ docker exec web ps -o pid,args | head -2
PID   COMMAND
    1 nginx: master process nginx -g daemon off;</div>
<p>Một tiến trình, hai con số: <code>388192</code> trong bảng tiến trình của máy chủ, <code>1</code> trong bảng của container. (Trên Mac, <code>docker top</code> hiện các worker thuộc một người dùng tên <code>statd</code>: người dùng của nginx trong container có UID 101, và file <code>/etc/passwd</code> của máy ảo tình cờ gọi UID 101 là <code>statd</code>. Cùng một con số, khác cuốn sổ tên — Chương 7 quay lại chuyện UID.)</p>
<pre><code><span class="tok-comment"># Từ MÁY CHỦ, vẫn thấy đúng cái tiến trình đó — với một PID khác</span>
ps -eo pid,comm,args | grep 'nginx: master' | head -2
docker top web</code></pre>
<div class="out">  40122 nginx           nginx: master process nginx -g daemon off;
UID     PID    PPID   C   STIME   TTY   TIME       CMD
root    40122  40100  0   20:12   ?     00:00:00   nginx: master process nginx -g daemon off;</div>
<div class="callout ok"><strong>Đây là toàn bộ ý tưởng gói trong một quan sát.</strong> PID 1 bên trong container và PID 40122 trên máy chủ là <em>CÙNG MỘT TIẾN TRÌNH</em>. Không có gì bị mô phỏng, không có gì bị ảo hoá, và không có cái nhân thứ hai nào — tiến trình chỉ đơn giản là có tầm nhìn riêng về những gì tồn tại. Chương 1 gọi tên cái cơ chế đó (namespace) và chỉ cho bạn thấy ranh giới được vẽ ở đâu.</div>

<h3>Đổi thứ nó phục vụ</h3>
${slide('dk-00', 35, 'Bind mount: gắn cả THƯ MỤC, đừng gắn một file lẻ')}
<pre><code>echo '&lt;h1&gt;Xin chào từ một container&lt;/h1&gt;' &gt; index.html
docker rm -f web
docker run -d --name web -p 8080:80 \\
  -v "\$PWD/index.html:/usr/share/nginx/html/index.html:ro" \\
  nginx:1.27-alpine
curl -s localhost:8080</code></pre>
<div class="out">&lt;h1&gt;Xin chào từ một container&lt;/h1&gt;</div>
<p><code>-v đường_dẫn_máy_chủ:đường_dẫn_container:ro</code> là một <strong>bind mount</strong>: một file trên máy bạn hiện ra ở đường dẫn đó bên trong container, ở chế độ chỉ đọc. Sửa <code>index.html</code> trong trình soạn thảo, tải lại trình duyệt, và thay đổi đã ở đó rồi — không dựng lại, không khởi động lại. Đây là cách phát triển cục bộ hoạt động, và Chương 7 nói chi tiết, gồm cả bài toán quyền file mà nó tạo ra trên Linux.</p>
<div class="pitfall co-tieu-de"><strong>Gắn cả thư mục, đừng gắn một file lẻ.</strong> Ví dụ ở trên gắn một <em>file</em>, và điều đó có một cái bẫy: Docker gắn bind mount file lẻ vào inode (mã định danh của file trên đĩa), không phải vào cái tên. Nhiều trình soạn thảo, và các script dùng <code>mv</code>, lưu bằng cách ghi một file mới rồi đổi tên đè lên file cũ — tức một inode mới. Output thật trên máy Mac của khoá ngay sau một lần lưu như vậy:</div>
<pre><code class="language-bash">echo '&lt;h1&gt;Bản mới&lt;/h1&gt;' &gt; index.new &amp;&amp; mv index.new index.html
curl -s localhost:8080 | head -2
docker exec web cat /usr/share/nginx/html/index.html</code></pre>
<div class="out">&lt;html&gt;
&lt;head&gt;&lt;title&gt;404 Not Found&lt;/title&gt;&lt;/head&gt;
cat: can't open '/usr/share/nginx/html/index.html': No such file or directory</div>
<p>Trên Mac, file đơn giản là biến mất khỏi container; trên Linux, container cứ hiện nội dung <em>cũ</em> mãi. Cả hai đều im lặng. Đây đúng là sự cố của dự án sinh viên trong bài “Bắt đầu tại đây (2/2)”: một file <code>nginx.conf</code> “deploy thành công” hai lần mà không có tác dụng. Cách sửa là gắn cả thư mục — khi đó đổi tên bên trong thư mục vẫn được thấy:</p>
<pre><code class="language-bash">mkdir -p site &amp;&amp; echo '&lt;h1&gt;Bản 1&lt;/h1&gt;' &gt; site/index.html
docker rm -f web
docker run -d --name web -p 8080:80 -v "\$PWD/site:/usr/share/nginx/html:ro" nginx:1.27-alpine
echo '&lt;h1&gt;Bản 2 — lưu kiểu mv&lt;/h1&gt;' &gt; site/tmp.html &amp;&amp; mv site/tmp.html site/index.html
curl -s localhost:8080
docker exec web sh -c 'echo x &gt; /usr/share/nginx/html/a.html'</code></pre>
<div class="out">&lt;h1&gt;Bản 2 — lưu kiểu mv&lt;/h1&gt;
sh: can't create /usr/share/nginx/html/a.html: Read-only file system</div>
<p>Dòng cuối cho thấy <code>:ro</code> mua được gì cho bạn: container không ghi được vào thư mục của bạn. (Output thật, máy Mac của khoá, cổng 18000. Ngay cả sửa tại chỗ trên Mac cũng không phải lúc nào cũng tức thì: ngay sau một lần sửa, máy Mac của khoá từng trả về một trang mới cập nhật một nửa, hai giây sau mới đủ nội dung mới — phần chia sẻ file của Docker Desktop có đệm ngắn — nên hãy tải lại hai lần trước khi kết luận là hỏng.)</p>

<h3>Một cơ sở dữ liệu, cũng bằng một câu lệnh</h3>
${slide('dk-00', 36, 'Postgres một lệnh — nhưng dữ liệu nằm ở volume vô danh')}
<pre><code>docker run -d --name db \\
  -e POSTGRES_PASSWORD=devpass \\
  -e POSTGRES_DB=app_dev \\
  -p 5432:5432 \\
  postgres:16-alpine

sleep 5
docker exec -it db psql -U postgres -d app_dev -c 'select version();'</code></pre>
<div class="out">                                                 version
---------------------------------------------------------------------------------------------------------
 PostgreSQL 16.4 on x86_64-pc-linux-musl, compiled by gcc (Alpine 13.2.1_git20240309) 13.2.1 20240309, 64-bit
(1 row)</div>
<p>PostgreSQL 16, đã cấu hình, đã khởi tạo, có sẵn một cơ sở dữ liệu được tạo và một mật khẩu được đặt — từ một câu lệnh, không cài gì lên máy bạn. Hãy thử lại lần nữa với <code>postgres:14-alpine</code> cùng một cái tên khác và một cổng khác, thế là bạn có hai phiên bản lớn chạy song song mà không cần trình quản lý phiên bản và không có xung đột nào. Đó chính là điểm CÔ LẬP ở Bài 0.1, được chứng minh.</p>
<div class="callout warn"><strong>Dữ liệu của cơ sở dữ liệu đó KHÔNG sống sót.</strong> Xoá container đi thì mọi thứ trong nó biến mất, vì tầng ghi được của một container chết cùng với nó. Với một thí nghiệm năm phút thì đó đúng là thứ bạn muốn. Với bất cứ thứ gì bạn quan tâm thì bạn cần một <strong>VOLUME</strong>, và đó là Chương 7 — quên nó là sai lầm đắt giá nhất của người mới trong khoá này, nên nó được cả một chương.</div>
<div class="callout"><strong>Nói chính xác hơn — và điều này quan trọng.</strong> Với PostgreSQL, dữ liệu hoàn toàn không nằm trong tầng ghi được: image <code>postgres</code> khai báo <code>VOLUME /var/lib/postgresql/data</code>, nên Docker lặng lẽ tạo một <strong>volume vô danh</strong> (volume mang tên ngẫu nhiên) cho nó. <code>docker rm -f db</code> xoá container nhưng <em>không</em> xoá volume đó. Cảm giác của bạn thì giống nhau — container <code>db</code> mới nhận một volume mới rỗng, nên bảng của bạn “mất” — nhưng dữ liệu cũ vẫn nằm trên đĩa, mồ côi, chiếm chỗ. Output thật trên máy Mac của khoá (PostgreSQL 16.14, arm64):</div>
<pre><code class="language-bash">docker inspect db --format '{{range .Mounts}}{{.Type}} {{.Name}} -&gt; {{.Destination}}{{end}}'
docker rm -f db
docker volume ls</code></pre>
<div class="out">volume 429a8358ea06b94dc4721786dc772ddce88600f80cc9e45cbe6f60bc60919518 -&gt; /var/lib/postgresql/data
db
DRIVER    VOLUME NAME
local     429a8358ea06b94dc4721786dc772ddce88600f80cc9e45cbe6f60bc60919518</div>
<p>Dùng <code>docker rm -fv db</code> để xoá container <em>và</em> các volume vô danh của nó khi bạn thật sự muốn bỏ; đặt tên cho volume (<code>-v pgdata:/var/lib/postgresql/data</code>, Chương 7) khi bạn muốn giữ. Chương 1.4 chỉ cách gắn lại một volume mồ côi để lấy dữ liệu về.</p>
<p>Hai điều nữa máy Mac của khoá cho thấy: PostgreSQL trả lời <code>select</code> chừng một giây sau <code>docker run</code> (lệnh <code>sleep 5</code> là khoảng đệm an toàn, không bắt buộc — Chương 9 thay nó bằng healthcheck), và <code>postgres:14-alpine</code> chạy song song ở một cổng máy khác báo <code>14.24</code> trong khi cái đầu báo <code>16.14</code>. Bộ nhớ của ba container đang chạy lúc đó: nginx 8,5 MiB, PostgreSQL 16 24 MiB, PostgreSQL 14 21 MiB.</p>

<h3>Container như những công cụ vứt đi</h3>
<p>Bạn không cần cài một ngôn ngữ để dùng nó. <code>--rm</code> xoá container ngay khoảnh khắc nó thoát, nên mấy lệnh này không để lại gì cả:</p>
<pre><code><span class="tok-comment"># Chạy một dòng Node mà không cài Node</span>
docker run --rm node:22-alpine node -e 'console.log(process.version, 2**32)'

<span class="tok-comment"># Một REPL Python, biến mất khi bạn thoát</span>
docker run --rm -it python:3.12-alpine python

<span class="tok-comment"># Định dạng JSON bằng jq, trên một cái máy không có jq</span>
echo '{"b":2,"a":1}' | docker run --rm -i ghcr.io/jqlang/jq -S .

<span class="tok-comment"># Một shell Linux vứt đi để thử một thứ nguy hiểm</span>
docker run --rm -it alpine sh</code></pre>
<div class="out">v22.11.0 4294967296
{
  "a": 1,
  "b": 2
}</div>

<h3>Dọn sạch hoàn toàn</h3>
${slide('dk-00', 37, 'Container dùng một lần — rồi dọn sạch thật sự')}
<pre><code>docker rm -f web db                  <span class="tok-comment"># -f dừng chúng trước</span>
docker ps -a
docker images
docker system df</code></pre>
<div class="out">CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
REPOSITORY    TAG          IMAGE ID       CREATED       SIZE
nginx         1.27-alpine  b4e5c0a1d2f3   3 weeks ago   52.5MB
postgres      16-alpine    9a1c8e7d6b5a   3 weeks ago   274MB
hello-world   latest       d2c94e258dcb   14 months ago 13.3kB</div>
<p>Không còn container nào, và cái máy của bạn y hệt như lúc đầu — trừ đám ảnh, chúng nằm lại trong bộ nhớ đệm để lần <code>docker run nginx:1.27-alpine</code> kế tiếp là tức thì. Bộ đệm đó không miễn phí: nó chính là <code>/var/lib/docker</code> ở Bài 0.2, và Chương 11 nói cách tỉa nó. Còn bây giờ thì <code>docker system prune</code> thu hồi mọi thứ không còn dùng.</p>
<div class="callout warn"><strong>Hai chỗ sửa cho đoạn văn ở trên.</strong> Một, “y hệt như lúc đầu” chưa đúng hẳn: <code>docker rm -f web db</code> để lại volume vô danh của PostgreSQL (mục trước) — <code>docker rm -fv</code> mới xoá nó. Hai, <code>docker system prune</code> <em>không</em> thu hồi mọi thứ không còn dùng. Mặc định nó xoá container đã dừng, mạng không dùng, image <em>treo</em> (dangling — bản thừa không còn tag) và cache build không dùng. Image có tag như <code>nginx:1.27-alpine</code> ở lại trừ khi thêm <code>-a</code>, và volume ở lại trừ khi thêm <code>--volumes</code>. Còn trên một máy đang chạy cả dự án khác, prune toàn máy có thể xoá thứ không phải của bạn; hãy xoá thứ mình tạo, theo tên.</div>
<table>
<tr><th>Lệnh</th><th>Xoá</th><th>Để lại</th></tr>
<tr><td><code>docker run --rm …</code></td><td>container, ngay khi nó thoát</td><td>image, để lần sau dùng</td></tr>
<tr><td><code>docker rm -f web</code></td><td>container (dừng nó trước)</td><td>các volume vô danh của nó</td></tr>
<tr><td><code>docker rm -fv db</code></td><td>container và các volume vô danh của nó</td><td>volume có tên, image</td></tr>
<tr><td><code>docker image rm postgres:14-alpine</code></td><td>một image, nếu không container nào dùng</td><td>mọi thứ khác</td></tr>
<tr><td><code>docker system prune</code></td><td>container dừng, mạng thừa, image treo, cache build</td><td>image có tag, volume</td></tr>
</table>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bạn không cài gì cả</span><span class="lz-t">không nginx, không PostgreSQL, không Node, không Python, không jq</span><span class="lz-d">Tất cả đều đã chạy; không cái nào đụng vào trình quản lý gói của hệ thống hay để lại một file cấu hình nào.</span></div>
  <div class="lz-step"><span class="lz-k">Bạn chạy hai máy chủ</span><span class="lz-t">và cả hai cộng lại ngốn khoảng 40MB bộ nhớ</span><span class="lz-d">Bởi vì chúng là TIẾN TRÌNH, không phải máy. Không có hệ điều hành thứ hai nào phải khởi động.</span></div>
  <div class="lz-step"><span class="lz-k">Bạn nhìn vào bên trong một cái</span><span class="lz-t">và thấy một hệ thống file Linux đầy đủ với bốn tiến trình</span><span class="lz-d">Hệ thống file đến từ IMAGE; danh sách tiến trình ngắn ngủi chính là RANH GIỚI. Sự tương phản đó chính là mô hình tư duy.</span></div>
  <div class="lz-step"><span class="lz-k">Bạn đổi thứ nó phục vụ</span><span class="lz-t">bằng một bind mount, không dựng lại</span><span class="lz-d">Quy trình phát triển của Chương 7 và 10, gói trong một cái cờ.</span></div>
  <div class="lz-step"><span class="lz-k">Bạn xoá sạch tất cả</span><span class="lz-t">và cái máy trở lại sạch sẽ</span><span class="lz-d">Tính vứt-đi-được. Đây là thứ khiến việc thử nghiệm trở nên rẻ, và đáng làm một cách có chủ ý trong lúc bạn học.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm bạn cần gấp một trang giới thiệu cho buổi demo SWP391 và một PostgreSQL để thử lược đồ — ngay hôm nay, trên laptop của bạn, không cài gì, và laptop phải sạch sau đó vì nó còn chạy CSDL của một môn khác.</p><ol>
<li><code>mkdir -p ~/thu-docker/0-3/site &amp;&amp; cd ~/thu-docker/0-3</code> rồi viết <code>site/index.html</code> có tên nhóm trong một thẻ <code>&lt;h1&gt;</code>.</li>
<li>Phục vụ cả <strong>thư mục</strong>: <code>docker run -d --name thu-web -p 8080:80 -v "\$PWD/site:/usr/share/nginx/html:ro" nginx:1.27-alpine</code>. Mở <code>localhost:8080</code>, sửa tiêu đề trong trình soạn thảo, tải lại trang.</li>
<li>Chạy PostgreSQL ở một cổng máy không thể đụng với bản cài sẵn: <code>docker run -d --name thu-db -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=app_dev -p 15432:5432 postgres:16-alpine</code>, rồi <code>docker exec thu-db psql -U postgres -d app_dev -c 'create table nhom(ten text); insert into nhom values (\$\$SWP391\$\$); select * from nhom;'</code>.</li>
<li>Tìm volume vô danh: <code>docker inspect thu-db --format '{{range .Mounts}}{{.Name}}{{end}}'</code>.</li>
<li>Dọn theo tên, kèm cả volume: <code>docker rm -fv thu-web thu-db</code>, rồi <code>docker ps -a --filter name=thu-</code> và <code>docker volume ls</code> (cái tên ở bước 4 phải biến mất).</li>
</ol>
<p><strong>Đạt khi:</strong> tiêu đề bạn sửa hiện ra sau khi tải lại mà không phải khởi động lại gì, <code>select</code> trả về dòng của bạn, bạn đã ghi lại tên volume, và sau bước 5 không còn hai container lẫn volume đó — trong khi mọi thứ khác trên máy vẫn nguyên.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Detached -d (chạy nền)</span><span class="v">Chạy container ở nền và trả lại dấu nhắc cho bạn.</span></div>
  <div class="kv"><span class="k">Publish -p máy:container (mở cổng)</span><span class="v">Chuyển tiếp một cổng của máy bạn vào một cổng bên trong container.</span></div>
  <div class="kv"><span class="k">Bind mount -v /đường:/đường (gắn thư mục máy chủ)</span><span class="v">Cho file hay thư mục của máy chủ hiện ra trong container; gắn thư mục, đừng gắn file lẻ.</span></div>
  <div class="kv"><span class="k">Anonymous volume (volume vô danh)</span><span class="v">Volume mang tên ngẫu nhiên mà image yêu cầu (<code>VOLUME</code>); nó sống qua <code>rm</code> trừ khi thêm <code>-v</code>.</span></div>
  <div class="kv"><span class="k">exec (chạy thêm lệnh)</span><span class="v">Chạy thêm một lệnh bên trong container đang chạy — <code>docker exec -it web sh</code> mở một shell.</span></div>
  <div class="kv"><span class="k">--rm (tự xoá)</span><span class="v">Tự xoá container ngay khi nó thoát.</span></div>
  <div class="kv"><span class="k">Dangling image (image treo)</span><span class="v">Image không còn tag nào, thường là bản build cũ; loại duy nhất mà <code>docker system prune</code> xoá theo mặc định.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>docker run -d --name web -p 8080:80 nginx:1.27-alpine</code> kéo, tạo và khởi chạy một web server; <code>-p</code> luôn là máy:container.</li>
<li><code>docker ps</code>, <code>logs</code>, <code>stats</code>, <code>exec</code> và <code>top</code> cho thấy thứ đang chạy; bên trong chỉ có tiến trình của nginx, và trên máy Linux chúng hiện ra với PID khác.</li>
<li>Bind mount một thư mục để phục vụ file của mình mà không phải dựng lại; gắn file lẻ sẽ hỏng âm thầm khi trình soạn thảo hay <code>mv</code> thay file.</li>
<li>PostgreSQL chạy bằng một lệnh và nhiều phiên bản chạy song song được; dữ liệu nằm trong một volume vô danh mà <code>rm -f</code> bỏ lại và container mới không dùng lại.</li>
<li><code>--rm</code> biến công cụ thành đồ dùng một lần; dọn theo tên bằng <code>docker rm -fv</code>, và nhớ <code>system prune</code> giữ lại image có tag và volume.</li>
</ul>

<a class="link-card" href="https://hub.docker.com/_/nginx" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">nginx trên Docker Hub</span><span class="lc-sub">Tài liệu của chính ảnh chính thức: các tag có sẵn, cấu hình nằm ở đâu, gắn cấu hình của bạn vào thế nào. Ảnh chính thức nào cũng có một trang như thế và đọc nó thì khỏi phải đoán.</span></span>
</a>
<a class="link-card" href="https://hub.docker.com/_/postgres" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">postgres trên Docker Hub</span><span class="lc-sub">Mọi biến môi trường <code>POSTGRES_*</code>, thư mục chứa script khởi tạo, và chính xác đường dẫn nào giữ dữ liệu. Bạn sẽ quay lại đây ở Chương 7.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: những container đầu tiên</span><span class="lc-sub">Bài chấm điểm: publish một cổng rồi chứng minh nó chạy, tìm tiến trình trên máy chủ ứng với PID 1 bên trong, phục vụ file của chính bạn bằng bind mount, và để lại một cái máy sạch.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>docker: Error response from daemon: Bind for 0.0.0.0:8080 failed: port is already allocated</code>. Nó nghĩa là có thứ khác đang giữ cổng 8080 của máy chủ — thường là một container bạn quên mất, vì một container đã dừng vẫn giữ TÊN của nó còn một container đang chạy vẫn giữ CỔNG của nó. <code>docker ps -a</code> để nhìn thấy nó, <code>docker rm -f &lt;tên&gt;</code> để gỡ, hoặc chỉ cần publish sang một cổng khác của máy chủ: <code>-p 8081:80</code> vẫn chạy và không đổi gì bên trong container. Nếu <code>docker ps -a</code> rỗng thì cái cổng thuộc về một tiến trình bình thường trên máy bạn — <code>sudo ss -tlnp | grep 8080</code> gọi tên nó ra.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> <code>docker run</code> đã kéo một ảnh, TẠO một container rồi KHỞI CHẠY nó — ba bước mà Chương 1 tách ra, và biết chúng tách rời được giải thích phần lớn cái CLI này. <code>docker exec -it &lt;tên&gt; sh</code> là câu lệnh bạn sẽ dùng nhiều nhất trong lúc học, vì nhìn vào bên trong trả lời được những câu hỏi mà đọc bao nhiêu cũng không xong. Và tầng ghi được của một container chết cùng container: ổn với thí nghiệm, thảm hoạ với một cơ sở dữ liệu, và đó là lý do Chương 7 tồn tại.</p>
</div>
`,
    },
    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — Quiz: getting oriented|||0.4 — Kiểm tra: định vị lại',
      slug: 'dk-0-4-quiz',
      type: 'QUIZ',
      description: 'Mười tình huống thật: container không phải máy ảo, NODE_MODULE_VERSION lệch giữa laptop và server, daemon chưa chạy, nhóm docker bằng root, RAM máy ảo Docker Desktop, thứ tự của -p, “Kubernetes bỏ Docker”, bind mount file lẻ, volume vô danh của Postgres, và dọn dẹp theo tên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations you will actually meet in your first weeks with Docker — in a team project, on a Mac or a Linux server, in an interview. Each one is decided by an idea from Section 0. Read the explanation after submitting, especially for questions you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain the difference between an image and a container, and why a container is a process rather than a small virtual machine.</li>
<li>I can name the six things people mean by "Docker" and say which one runs the containers.</li>
<li>I can read <code>docker version</code> and tell a missing daemon from a CLI problem, and I know why the <code>docker</code> group equals root.</li>
<li>I know why Docker Desktop shows less memory than my laptop has, and where to change it.</li>
<li>I can run nginx with <code>-p host:container</code>, look inside with <code>exec</code>, and serve my own folder with a bind mount.</li>
<li>I know what happens to PostgreSQL's data when I <code>rm -f</code> its container, and how to clean up by name without touching other projects.</li>
</ul>
${slide('dk-00', 39, 'Bảng tra nhanh Mục 0')}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống bạn sẽ thật sự gặp trong những tuần đầu với Docker — trong đồ án nhóm, trên máy Mac hay máy chủ Linux, lúc phỏng vấn. Câu nào cũng được quyết định bởi một ý của Mục 0. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được image khác container thế nào, và vì sao container là một tiến trình chứ không phải một máy ảo nhỏ.</li>
<li>Tôi gọi tên được sáu thứ mà người ta hay gọi chung là “Docker” và nói được cái nào thật sự chạy container.</li>
<li>Tôi đọc được <code>docker version</code> và phân biệt được daemon chưa chạy với lỗi của CLI, và biết vì sao nhóm <code>docker</code> ngang với root.</li>
<li>Tôi biết vì sao Docker Desktop báo ít bộ nhớ hơn laptop thật có, và chỉnh ở đâu.</li>
<li>Tôi chạy được nginx với <code>-p máy:container</code>, nhìn vào trong bằng <code>exec</code>, và phục vụ thư mục của mình bằng bind mount.</li>
<li>Tôi biết dữ liệu PostgreSQL ra sao khi <code>rm -f</code> container của nó, và cách dọn theo tên mà không đụng dự án khác.</li>
</ul>
${slide('dk-00', 39, 'Bảng tra nhanh Mục 0')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A teammate says: "A container is a small virtual machine, so I will SSH into our running api container and apt install the libraries we are missing." What should you tell them?|||Một bạn cùng nhóm nói: "Container là máy ảo nhỏ, nên mình sẽ SSH vào container api đang chạy rồi apt install mấy thư viện còn thiếu." Bạn nên nói gì?',
            options: [
              'Fine, but run apt upgrade too, because a container has its own kernel that needs updating separately|||Được, nhưng nhớ apt upgrade luôn, vì container có nhân riêng cần cập nhật riêng',
              'A container is a fenced-off process started from an image; changes made inside it are lost when it is recreated, so add the libraries to the Dockerfile and rebuild|||Container là một tiến trình bị rào lại, khởi động từ image; thứ sửa bên trong sẽ mất khi nó được tạo lại, nên hãy thêm thư viện vào Dockerfile rồi dựng lại',
              'It works and persists forever, because every container automatically saves its changes back into its image|||Làm vậy được và giữ mãi, vì mọi container tự động lưu thay đổi ngược vào image của nó',
              'It is impossible, because containers are read-only and no command can write anything inside them|||Không thể làm, vì container chỉ đọc và không lệnh nào ghi được gì vào bên trong',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: A container shares the host kernel and has a writable scratch layer that dies with it. Installing by hand works until the next deploy or recreate, then vanishes; the durable place is the recipe (Dockerfile). The tempting "saves back into its image" is false — an image never changes after it is built. And there is no separate kernel to upgrade.|||VI: Container dùng chung nhân với máy chủ và có một tầng nháp ghi được, chết cùng nó. Cài tay thì chạy được tới lần deploy hay tạo lại kế tiếp rồi biến mất; chỗ bền là công thức (Dockerfile). Phương án hấp dẫn “tự lưu ngược vào image” là sai — image không bao giờ đổi sau khi đã dựng. Và cũng không có nhân riêng nào để nâng cấp.',
          },
          {
            question: 'The upload feature works on a laptop with Node 20 but crashes on the school server: "was compiled against a different Node.js version using NODE_MODULE_VERSION 115. This version requires NODE_MODULE_VERSION 108." What is the lasting fix?|||Chức năng upload chạy trên laptop Node 20 nhưng sập trên máy chủ của trường: "was compiled against a different Node.js version using NODE_MODULE_VERSION 115. This version requires NODE_MODULE_VERSION 108." Cách sửa lâu dài là gì?',
            options: [
              'Copy the laptop’s node_modules folder to the server so the compiled module matches|||Chép thư mục node_modules của laptop lên máy chủ cho khớp mô-đun đã biên dịch',
              'Delete package-lock.json on the server and reinstall until the error disappears|||Xoá package-lock.json trên máy chủ rồi cài lại tới khi hết lỗi',
              'Ask everyone in the team to downgrade their laptops to Node 18 like the server|||Bảo cả nhóm hạ laptop về Node 18 cho giống máy chủ',
              'Build an image with a pinned Node version and run that same image on laptops, in CI and on the server|||Dựng một image ghim phiên bản Node và chạy đúng image đó trên laptop, trong CI và trên máy chủ',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: 115 is Node 20’s ABI and 108 is Node 18’s: the environment differs, not the code. Pinning Node inside an image makes the environment part of the artifact. Copying node_modules is the tempting shortcut, but it just moves a module compiled for 115 onto a runtime that needs 108 — the same error. Downgrading laptops only moves the drift somewhere else.|||VI: 115 là số ABI của Node 20, 108 là của Node 18: môi trường khác nhau, không phải mã. Ghim Node trong image biến môi trường thành một phần của hiện vật. Chép node_modules là lối tắt hấp dẫn, nhưng nó chỉ mang một mô-đun dịch cho 115 sang một runtime cần 108 — vẫn đúng lỗi đó. Hạ laptop thì chỉ dời chỗ lệch sang nơi khác.',
          },
          {
            question: 'On a Mac, docker version prints the Client section, then: "failed to connect to the docker API at unix:///…/docker.sock; check if the path is correct and if the daemon is running". What is wrong?|||Trên máy Mac, docker version in phần Client, rồi báo: "failed to connect to the docker API at unix:///…/docker.sock; check if the path is correct and if the daemon is running". Chuyện gì sai?',
            options: [
              'The Engine is not running — the CLI is fine; start Docker Desktop (on Linux: systemctl start docker)|||Engine chưa chạy — CLI không sao; mở Docker Desktop (trên Linux: systemctl start docker)',
              'The docker CLI is corrupted and must be reinstalled before any command can work|||CLI docker bị hỏng và phải cài lại thì lệnh nào mới chạy được',
              'You are not logged in to Docker Hub, so the daemon refuses every command|||Bạn chưa đăng nhập Docker Hub nên daemon từ chối mọi lệnh',
              'The Mac has no internet connection, so the Client cannot reach the Server|||Máy Mac mất mạng Internet nên Client không với tới được Server',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: docker version prints two sections because there are two programs. The Client section printing proves the CLI works; the error is about reaching the daemon’s socket. Reinstalling the CLI is the tempting wrong move. Docker Hub login and the internet are irrelevant — the socket is local.|||VI: docker version in hai phần vì có hai chương trình. Phần Client in ra được chứng tỏ CLI chạy tốt; lỗi là không với tới socket của daemon. Cài lại CLI là nước đi sai hấp dẫn nhất. Đăng nhập Docker Hub hay mạng Internet không liên quan — socket nằm ngay trên máy.',
          },
          {
            question: 'On a Linux server, an ordinary user in the docker group runs docker run --rm -v /etc:/h:ro alpine wc -l /h/shadow and gets "54 /h/shadow", although wc -l /etc/shadow gives "Permission denied". Why?|||Trên máy chủ Linux, một người dùng thường trong nhóm docker chạy docker run --rm -v /etc:/h:ro alpine wc -l /h/shadow và nhận "54 /h/shadow", dù wc -l /etc/shadow báo "Permission denied". Vì sao?',
            options: [
              'The :ro flag gives read access to any file, whatever its permissions|||Cờ :ro cấp quyền đọc mọi file, bất kể quyền của file đó',
              'Alpine ships its own /etc/shadow, so the count comes from the image, not the host|||Alpine có sẵn /etc/shadow riêng, nên con số đến từ image chứ không phải máy chủ',
              'The daemon runs as root and does what anyone in the docker group asks, so the group is effectively root|||Daemon chạy bằng root và làm theo bất kỳ ai trong nhóm docker, nên nhóm đó thực chất là root',
              'Docker temporarily adds the user to sudoers while the container is running|||Docker tạm thêm người dùng vào sudoers trong lúc container chạy',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: -v /etc:/h mounts the HOST’s /etc into the container, and the process inside runs as uid 0 because the daemon is root. That is why docker group membership equals passwordless root, and why an exposed Docker API gave the Graboid worm whole machines. :ro only makes the mount read-only; it grants nothing. The image’s own /etc is hidden by the mount.|||VI: -v /etc:/h gắn /etc của MÁY CHỦ vào container, và tiến trình bên trong chạy bằng uid 0 vì daemon là root. Đó là lý do ở trong nhóm docker bằng có root không cần mật khẩu, và vì sao Docker API bị lộ đã trao cả cái máy cho con sâu Graboid. :ro chỉ làm điểm gắn thành chỉ-đọc; nó không cấp quyền gì. /etc riêng của image bị điểm gắn che mất.',
          },
          {
            question: 'Your Mac has 32 GB of RAM, but docker info reports MemTotal 8319504384 and next build inside a container keeps dying with exit 137. What is the most likely explanation?|||Máy Mac của bạn có 32 GB RAM, nhưng docker info báo MemTotal 8319504384 và next build trong container cứ chết với exit 137. Giải thích nào hợp lý nhất?',
            options: [
              'docker info is buggy on macOS; the container really has 32 GB available|||docker info bị lỗi trên macOS; container thật ra có đủ 32 GB',
              'Containers run inside Docker Desktop’s Linux VM, which has about 7.7 GiB; raise it in Settings → Resources|||Container chạy trong máy ảo Linux của Docker Desktop, máy ảo đó có khoảng 7,7 GiB; tăng ở Settings → Resources',
              'Exit 137 means a syntax error in next.config.js, unrelated to memory|||Exit 137 nghĩa là lỗi cú pháp trong next.config.js, không liên quan bộ nhớ',
              'Apple silicon cannot run Node containers, so the build is killed on purpose|||Chip Apple không chạy được container Node, nên build bị giết có chủ đích',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: 8319504384 bytes is 7.7 GiB — the VM’s memory, not the Mac’s. Exit 137 = 128 + 9, killed by SIGKILL, usually the out-of-memory killer. Blaming docker info is tempting but wrong: it reports exactly what the Engine sees. Apple silicon runs arm64 Node images fine.|||VI: 8319504384 byte là 7,7 GiB — bộ nhớ của máy ảo, không phải của máy Mac. Exit 137 = 128 + 9, bị giết bằng SIGKILL, thường là do cơ chế giết khi hết bộ nhớ. Đổ lỗi cho docker info thì hấp dẫn nhưng sai: nó báo đúng những gì Engine thấy. Chip Apple chạy image Node arm64 bình thường.',
          },
          {
            question: 'docker run -d --name web -p 80:8080 nginx:1.27-alpine starts fine, but curl localhost:80 gets "connection refused" / an empty reply. What is wrong?|||docker run -d --name web -p 80:8080 nginx:1.27-alpine khởi động bình thường, nhưng curl localhost:80 bị từ chối kết nối / không có trả lời. Sai ở đâu?',
            options: [
              'The order is host:container, so this forwards host 80 to container port 8080, where nginx is not listening; use -p 8080:80|||Thứ tự là máy:container, nên lệnh này chuyển cổng 80 của máy vào cổng 8080 của container, nơi nginx không nghe; dùng -p 8080:80',
              'Port 80 is reserved on every machine, so Docker silently ignores any -p that uses it|||Cổng 80 bị giữ trên mọi máy, nên Docker lặng lẽ bỏ qua mọi -p dùng nó',
              'nginx needs a few minutes to start inside a container, so wait and try curl again|||nginx cần vài phút để khởi động trong container, hãy đợi rồi curl lại',
              'The -d flag hides the published port; run it without -d to make the port reachable|||Cờ -d giấu cổng đã publish; chạy không có -d thì cổng mới gọi được',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: -p is always host:container. nginx listens on 80 inside, so the right side must be 80. Waiting is the tempting answer, but nginx starts in well under a second — nothing will ever answer on container port 8080. -d only detaches your terminal.|||VI: -p luôn là máy:container. nginx nghe ở cổng 80 bên trong, nên vế phải phải là 80. Chờ thêm là câu trả lời hấp dẫn, nhưng nginx khởi động trong chưa tới một giây — sẽ chẳng bao giờ có ai trả lời ở cổng 8080 của container. -d chỉ tách terminal ra thôi.',
          },
          {
            question: 'A classmate reads the headline "Kubernetes drops Docker" (Kubernetes 1.24, 2022) and says your team must rebuild all its images with another tool before deploying to a Kubernetes cluster. Are they right?|||Một bạn cùng lớp đọc tít báo “Kubernetes bỏ Docker” (Kubernetes 1.24, 2022) và bảo nhóm phải dựng lại mọi image bằng công cụ khác trước khi deploy lên cụm Kubernetes. Bạn ấy đúng không?',
            options: [
              'Yes: images built by Docker use a private format that only the Docker Engine can run|||Đúng: image dựng bằng Docker dùng định dạng riêng mà chỉ Docker Engine chạy được',
              'Yes: Kubernetes now accepts only images built with Podman|||Đúng: Kubernetes giờ chỉ nhận image dựng bằng Podman',
              'No: Kubernetes never ran containers from images at all, only from source code|||Không: Kubernetes chưa bao giờ chạy container từ image, chỉ chạy từ mã nguồn',
              'No: Kubernetes removed dockershim and talks to containerd directly; Docker images are OCI images and run unchanged|||Không: Kubernetes bỏ dockershim và nói thẳng với containerd; image Docker là image OCI và chạy nguyên vẹn',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Since the Open Container Initiative (2015), the image format is an open standard. Kubernetes 1.24 removed the dockershim adapter for the Docker Engine as a runtime, not support for the images; the Kubernetes FAQ says so explicitly. The tempting "private format" answer describes the world before OCI.|||VI: Từ khi có Open Container Initiative (2015), định dạng image là một chuẩn mở. Kubernetes 1.24 bỏ bộ chuyển dockershim dùng Docker Engine làm runtime, chứ không bỏ hỗ trợ image; bản FAQ của Kubernetes nói rõ điều đó. Câu “định dạng riêng” hấp dẫn là mô tả thế giới trước khi có OCI.',
          },
          {
            question: 'nginx runs with -v "$PWD/nginx.conf:/etc/nginx/nginx.conf:ro". A deploy script writes nginx.conf.new, then mv nginx.conf.new nginx.conf, then reloads nginx. The script reports success, but nothing changes. What is going on?|||nginx chạy với -v "$PWD/nginx.conf:/etc/nginx/nginx.conf:ro". Một script deploy ghi nginx.conf.new, rồi mv nginx.conf.new nginx.conf, rồi reload nginx. Script báo thành công, nhưng không có gì thay đổi. Chuyện gì đang xảy ra?',
            options: [
              ':ro makes Docker ignore every change to the file until the host reboots|||:ro khiến Docker bỏ qua mọi thay đổi của file cho tới khi máy chủ khởi động lại',
              'nginx caches its config forever, so reload never re-reads the file|||nginx đệm cấu hình vĩnh viễn, nên reload không bao giờ đọc lại file',
              'A single-file bind mount follows the original inode; mv puts a new inode at that path, so the container still reads the old file — mount the directory or write in place|||Bind mount file lẻ bám theo inode ban đầu; mv đặt một inode mới vào đường dẫn đó, nên container vẫn đọc file cũ — hãy gắn thư mục hoặc ghi đè tại chỗ',
              'The container needs docker commit after every config change|||Container cần docker commit sau mỗi lần đổi cấu hình',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: This is the student project’s real incident. A file bind mount is attached to the inode at start; mv replaces the path with a new inode that the container never sees (on a Mac the file may even vanish, giving 404). Blaming :ro is tempting, but :ro only blocks writes from inside. Mount the folder, or overwrite in place and check from inside the container.|||VI: Đây là sự cố thật của dự án sinh viên. Bind mount file được gắn vào inode lúc khởi động; mv thay đường dẫn bằng một inode mới mà container không bao giờ thấy (trên Mac file còn có thể biến mất, trả 404). Đổ cho :ro thì hấp dẫn, nhưng :ro chỉ chặn ghi từ bên trong. Hãy gắn thư mục, hoặc ghi đè tại chỗ và kiểm tra từ bên trong container.',
          },
          {
            question: 'You ran postgres:16-alpine as db with no -v, created tables, then docker rm -f db and started a new db the same way. The tables are gone, yet docker volume ls lists a volume with a long random name. What happened?|||Bạn chạy postgres:16-alpine tên db, không có -v, tạo vài bảng, rồi docker rm -f db và chạy một db mới y như cũ. Các bảng biến mất, nhưng docker volume ls vẫn có một volume mang tên ngẫu nhiên dài. Chuyện gì đã xảy ra?',
            options: [
              'The data sits in the old anonymous volume that rm -f left behind; the new container got a new empty one — name your volume next time|||Dữ liệu nằm trong volume vô danh cũ mà rm -f bỏ lại; container mới nhận một volume rỗng mới — lần sau hãy đặt tên volume',
              'The tables were in the writable layer and are gone forever; the volume is just Docker’s cache|||Các bảng nằm ở tầng ghi và mất vĩnh viễn; volume kia chỉ là cache của Docker',
              'PostgreSQL deletes its data on every restart unless POSTGRES_DB is set|||PostgreSQL xoá dữ liệu mỗi lần khởi động lại trừ khi đặt POSTGRES_DB',
              'The volume belongs to Docker Hub and syncs your tables back after a few minutes|||Volume đó thuộc về Docker Hub và sẽ đồng bộ bảng về sau vài phút',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: The postgres image declares VOLUME /var/lib/postgresql/data, so each new container gets a fresh anonymous volume. rm -f removes the container but not that volume (rm -fv would). The tempting "writable layer" answer is true for most files, but not for this path. Chapter 1.4 shows how to reattach the old volume.|||VI: Image postgres khai báo VOLUME /var/lib/postgresql/data, nên mỗi container mới nhận một volume vô danh mới. rm -f xoá container nhưng không xoá volume đó (rm -fv mới xoá). Câu “tầng ghi” hấp dẫn thì đúng với phần lớn file, nhưng không đúng với đường dẫn này. Chương 1.4 chỉ cách gắn lại volume cũ.',
          },
          {
            question: 'After the Section 0 practice you want to remove the thu-web and thu-db containers and thu-db’s anonymous volume. The same laptop also runs another course’s database in Docker. Which command is right?|||Sau bài thực hành Mục 0, bạn muốn xoá container thu-web, thu-db và volume vô danh của thu-db. Cùng laptop đó còn chạy CSDL của một môn khác bằng Docker. Lệnh nào đúng?',
            options: [
              'docker system prune -a --volumes|||docker system prune -a --volumes',
              'docker rm -f $(docker ps -aq)|||docker rm -f $(docker ps -aq)',
              'docker rm -f thu-web thu-db, then docker volume prune|||docker rm -f thu-web thu-db, rồi docker volume prune',
              'docker rm -fv thu-web thu-db|||docker rm -fv thu-web thu-db',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Removing by name touches only what you created, and -v takes the containers’ anonymous volumes with them. The prune and "all containers" options also hit the other course’s database; volume prune is the tempting middle ground, but it deletes every unused volume on the machine — including stopped projects’ data.|||VI: Xoá theo tên chỉ đụng thứ bạn tạo, và -v mang theo các volume vô danh của những container đó. Các phương án prune và “mọi container” đều đụng tới CSDL của môn kia; volume prune là lựa chọn nửa vời hấp dẫn, nhưng nó xoá mọi volume không dùng trên máy — kể cả dữ liệu của những dự án đang tạm dừng.',
          },
        ],
      },
    },
  ],
};
