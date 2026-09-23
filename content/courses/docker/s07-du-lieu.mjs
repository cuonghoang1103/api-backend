/**
 * Docker — Chương 7: dữ liệu (volume, bind mount, tmpfs).
 * Vì sao container quên · volume · bind mount · tmpfs & chỉ đọc · sao lưu/khôi phục · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 *
 * Nâng cấp 09/2026: bài 7.0 slide (deck dk-07, 32 slide) + slide/🧪/🗂/📌 + phần đào sâu "chạy thử từng bước"
 * trong 7.1–7.5; quiz 10 câu. Output MỚI chạy thật 23–24/09/2026 trên Docker Desktop 4.91 / Engine 29.8
 * (Mac M1, VirtioFS) và Docker Engine 29.6 (Fedora 44 amd64, SELinux Enforcing). Đã sửa các chỗ cũ SAI:
 * volume prune (Docker 23+ chỉ xoá vô danh), luật chép-vào-volume, docker cp vào tmpfs, docker exec -t với pg_dump,
 * tmpfs mất cả khi restart, SELinux trên Docker CE, output bịa (hash giả, head -4 của nginx, log script).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 7 — Data: volumes, bind mounts, tmpfs|||Chương 7 — Dữ liệu: volume, bind mount, tmpfs',
  description: 'Container quên mọi thứ khi bị xoá — trừ những gì bạn cố ý đặt ra ngoài. Ba cách gắn dữ liệu vào container, cách chọn đúng cái, cái bẫy node_modules và bẫy quyền UID, và cách sao lưu một volume Postgres mà không mất dữ liệu.',
  lessons: [
    /* ─────────────────────────── 7.0 ─────────────────────────── */
    {
      title: '7.0 — Chapter 7 slides: where your data really lives|||7.0 — Slide Chương 7: dữ liệu thật ra nằm ở đâu',
      slug: 'dk-7-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 7: ba kiểu gắn nối xuống ba chỗ lưu, luật chép-vào-volume, prune chỉ xoá volume vô danh, bốn cái bẫy của bind mount và sự cố gắn file đơn theo inode, tmpfs tính vào bộ nhớ, docker cp vào tmpfs, sao lưu – khôi phục Postgres thật và đếm hàng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">One picture carries this chapter: a container sees a single filesystem tree, but each path in that tree can live somewhere completely different on the host — a Docker-managed volume, a folder of yours, RAM, or the container's own writable layer that dies with it. Slide 3 draws that picture; every other slide is one consequence of it.</p>
<p>Slides 3–7 belong to Lesson 7.1, 8–12 to 7.2, 13–18 to 7.3, 19–23 to 7.4 and 24–29 to 7.5. The last three are the chapter's common mistakes, a cheat sheet and a 45-minute practice session. Every terminal on the slides is real output recorded in September 2026 on Docker Desktop 4.91 (Mac M1, VirtioFS) and Docker Engine 29.6 (Fedora, amd64) — including the measurements: bind mounts about twelve times slower than volumes on the Mac, a 500,000-row Postgres dumped in 0.49 s and restored with the row count checked, and a single-file mount that keeps serving the old nginx config after <code>sed -i</code>. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Một hình gánh cả chương này: container chỉ thấy MỘT cây thư mục, nhưng mỗi đường dẫn trong cây đó có thể nằm ở một chỗ hoàn toàn khác trên máy chủ — một volume do Docker quản, một thư mục của bạn, RAM, hoặc tầng ghi của chính container (chết theo nó). Slide 3 vẽ hình đó; mọi slide còn lại là một hệ quả của nó.</p>
<p>Slide 3–7 thuộc Bài 7.1, 8–12 thuộc 7.2, 13–18 thuộc 7.3, 19–23 thuộc 7.4 và 24–29 thuộc 7.5. Ba slide cuối là những sai lầm hay gặp, bảng tra nhanh và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi tháng 9/2026 trên Docker Desktop 4.91 (Mac M1, VirtioFS) và Docker Engine 29.6 (Fedora, amd64) — kể cả các phép đo: bind mount chậm hơn volume khoảng mười hai lần trên Mac, một CSDL Postgres 500 000 dòng dump trong 0,49 giây rồi khôi phục và đếm lại khớp, và một phép gắn file đơn vẫn phục vụ cấu hình nginx CŨ sau khi <code>sed -i</code>. Con số trên máy bạn có thể khác, quy luật thì không.</p>
</div>
${gallery('dk-07', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Ba kiểu gắn = ba chỗ lưu khác nhau'], [4, 'Container quên: tầng ghi chết theo rm'], [5, 'Đọc -v theo hình dạng bên trái dấu hai chấm'],
  [6, 'Volume rỗng được chép — bind mount thì che'], [7, 'Đặt tên volume: vô danh là mồ côi'],
  [8, 'Volume là một thư mục — trên Mac nằm trong máy ảo'], [9, 'Nhãn và dangling'], [10, 'volume prune chỉ xoá volume vô danh'],
  [11, 'Chia sẻ volume: một ghi, một đọc :ro'], [12, 'system df -v tìm volume 0 LINKS'],
  [13, 'Bind mount: sửa trên máy, container thấy ngay'], [14, 'Bẫy 1: node_modules biến mất'], [15, 'Bẫy 2 và 3: file root, SELinux'],
  [16, 'Sự cố thật: gắn một file là gắn theo inode'], [17, 'Cách sửa file nào container thấy'], [18, 'Bind mount trên Mac chậm ~12 lần'],
  [19, 'tmpfs là RAM, không size thì bằng nửa RAM'], [20, 'tmpfs tính vào --memory'], [21, '--read-only: để nó chết rồi khoét lỗ'],
  [22, 'Biến môi trường hiện nguyên trong inspect'], [23, 'docker cp vào tmpfs rơi xuống đĩa'],
  [24, 'Mẫu container phụ'], [25, 'tar khác pg_dump — số đo thật'], [26, 'Khôi phục rồi đếm hàng'],
  [27, 'docker exec -t làm hỏng bản dump'], [28, 'Chuyển volume sang máy khác'], [29, 'Script sao lưu hằng đêm'],
  [30, 'Sai lầm hay gặp'], [31, 'Bảng tra nhanh'], [32, 'Thực hành chương 7'],
])}
`,
    },
    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — Why containers forget, and the three ways to fix it|||7.1 — Vì sao container quên, và ba cách chữa',
      slug: 'dk-7-1-ba-cach-gan',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lớp ghi được biến mất cùng container, ba kiểu gắn dữ liệu (volume, bind mount, tmpfs), khác nhau ở đâu, chọn cái nào, và chuyện gì xảy ra khi bạn gắn đè lên một thư mục đã có sẵn trong ảnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Why containers forget, and the three ways to fix it</h2>
<p class="lead">You met the writable layer in Lesson 1.4: every container gets a thin read-write layer on top of the image, and that layer dies with the container. That is the right default — it is what makes containers disposable. But a database is not disposable, and neither are uploaded files. This chapter is about the deliberate holes you cut in that model.</p>

<h3>Watch a container forget</h3>
${slide('dk-07', 4, 'Container quên: tầng ghi chết theo docker rm')}
<pre><code>docker run --name forgetful -d alpine:3.20 sleep 300
docker exec forgetful sh -c 'echo "important" &gt; /data.txt; cat /data.txt'
docker rm -f forgetful &gt;/dev/null
docker run --rm alpine:3.20 cat /data.txt</code></pre>
<div class="out">important
cat: can't open '/data.txt': No such file or directory</div>
<p>Nothing was lost by accident. The file lived in the writable layer of a container that no longer exists; a new container from the same image starts from the same clean image layers. If you want a file to outlive the container, it must not live inside the container.</p>

<h3>The three mount types</h3>
${slide('dk-07', 3, 'Ba kiểu gắn = ba chỗ lưu khác nhau trên máy chủ')}
<p>Read the picture from the top. The process inside the container sees one ordinary tree — <code>/var/lib/postgresql/data</code>, <code>/app/src</code>, <code>/tmp</code> and everything else look the same to it. Docker decides, path by path, where the bytes really go: a directory Docker manages (volume), a directory <em>you</em> chose (bind mount), memory (tmpfs), or — for every path you did not mention — the writable layer that is deleted with the container. On a Mac or Windows laptop the bottom half of the picture lives inside Docker Desktop's Linux virtual machine, which is why some things behave differently there (Lesson 7.3).</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">volume</span><span class="lz-lnote">Docker owns the storage, in <code>/var/lib/docker/volumes/&lt;name&gt;/_data</code>. You refer to it by name, never by host path. The default choice for anything the application writes and must keep: databases, uploads, caches worth preserving.</span></div>
  <div class="lz-layer"><span class="lz-lname">bind mount</span><span class="lz-lnote">A specific host directory appears inside the container. You choose the exact path on both sides. The right tool for source code during development, for config files, and for the Docker socket — and the wrong tool for a database.</span></div>
  <div class="lz-layer"><span class="lz-lname">tmpfs</span><span class="lz-lnote">Memory, never disk. Vanishes when the container stops. For scratch space, and for anything sensitive that must not be written to a disk you may later forget to wipe.</span></div>
</div>
<pre><code><span class="tok-comment"># The same mount, in the two syntaxes you will meet</span>
docker run -v mydata:/var/lib/postgresql/data postgres:16          <span class="tok-comment"># short form</span>
docker run --mount type=volume,src=mydata,dst=/var/lib/postgresql/data postgres:16

<span class="tok-comment"># Bind mount: absolute host path on the left</span>
docker run -v "$PWD/src:/app/src" node:22-alpine
docker run --mount type=bind,src="$PWD/src",dst=/app/src,ro node:22-alpine</code></pre>
<div class="callout"><strong><code>-v</code> versus <code>--mount</code>.</strong> They do the same thing; <code>--mount</code> is explicit and fails loudly, <code>-v</code> is short and guesses. The one behaviour difference that bites: with <code>-v</code>, a host path that does not exist is silently <em>created as an empty directory</em>, so a typo in a config path gives you an empty directory instead of an error. <code>--mount type=bind</code> refuses to start. Use <code>-v</code> interactively, <code>--mount</code> in anything committed to a repository.</div>

<h3>Reading -v and --mount, part by part</h3>
${slide('dk-07', 5, 'Đọc -v theo hình dạng bên trái dấu hai chấm')}
<p><code>-v</code> packs up to three fields into one string, separated by colons: <code>SOURCE:TARGET:OPTIONS</code>. TARGET is always a path <em>inside</em> the container. Docker guesses the mount type from the <em>shape</em> of SOURCE — there is no keyword — so it is worth reading slowly once:</p>
<table>
<tr><th>You write</th><th>Docker understands</th><th>Why</th></tr>
<tr><td><code>-v pgdata:/var/lib/postgresql/data</code></td><td>Named volume <code>pgdata</code></td><td>Left side has no <code>/</code>: it is a name. Created on first use if missing.</td></tr>
<tr><td><code>-v "$PWD/src:/app/src"</code></td><td>Bind mount of that folder</td><td>Left side is an absolute path. Quote it — a space in the path breaks the command.</td></tr>
<tr><td><code>-v ./src:/app/src</code></td><td>Bind mount (relative)</td><td>A leading <code>./</code> marks a path. Accepted by current Docker; tested on Docker 29.</td></tr>
<tr><td><code>-v src:/app/src</code></td><td><strong>A new, empty volume called <code>src</code></strong></td><td>No slash, so it is a <em>name</em> — your folder is ignored. A classic typo.</td></tr>
<tr><td><code>-v /data</code></td><td>Anonymous volume</td><td>Only a target: Docker invents a 64-character name.</td></tr>
<tr><td><code>-v pgdata:/data:ro</code></td><td>Read-only</td><td>Third field = options (<code>ro</code>, and <code>z</code>/<code>Z</code> for SELinux).</td></tr>
</table>
<p>The typo in the fourth row is worth seeing with your own eyes, because nothing fails (course's Mac, Docker 29.8):</p>
<pre><code class="language-bash">mkdir -p src &amp;&amp; echo hi &gt; src/a.txt
docker run --rm -v ./src:/app/src alpine:3.20 ls /app/src    <span class="tok-comment"># bind: your folder</span>
docker run --rm -v src:/app/src alpine:3.20 ls /app/src      <span class="tok-comment"># volume named "src": empty</span>
docker volume ls -q --filter name=^src$</code></pre>
<div class="out">a.txt
src</div>
<p>The second command printed nothing (an empty volume) and quietly created a volume named <code>src</code>. Remove it with <code>docker volume rm src</code>.</p>
<p><code>--mount</code> says the same things with explicit keys, which is why it cannot guess wrong:</p>
<table>
<tr><th>Key</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>type</code></td><td><code>volume</code>, <code>bind</code> or <code>tmpfs</code></td><td><code>type=bind</code></td></tr>
<tr><td><code>src</code> (or <code>source</code>)</td><td>Volume name, or host path for a bind; omit for an anonymous volume or tmpfs</td><td><code>src=pgdata</code></td></tr>
<tr><td><code>dst</code> (or <code>target</code>)</td><td>Path inside the container</td><td><code>dst=/var/lib/postgresql/data</code></td></tr>
<tr><td><code>readonly</code> / <code>ro</code></td><td>Mount read-only</td><td><code>…,ro</code></td></tr>
<tr><td><code>volume-nocopy</code></td><td>Do not copy the image's files into an empty volume (see below)</td><td><code>…,volume-nocopy</code></td></tr>
<tr><td><code>volume-label</code></td><td>Put a label on the volume Docker creates</td><td><code>volume-label=app=blog</code></td></tr>
<tr><td><code>tmpfs-size</code> · <code>tmpfs-mode</code></td><td>Size cap and permissions of a tmpfs</td><td><code>tmpfs-size=64m,tmpfs-mode=1770</code></td></tr>
</table>

<h3>Run it step by step: the typo that creates a directory</h3>
<p>The callout above says <code>-v</code> creates a missing host path. Here is what that looks like — note the result is a <em>directory</em> named like your file (course's Mac):</p>
<pre><code class="language-bash">docker run --rm -v "$PWD/khong-co/app.conf:/etc/app.conf" alpine:3.20 ls -la /etc/app.conf
ls -la khong-co</code></pre>
<div class="out">total 4
drwxr-xr-x    2 root     root            64 Sep 23 18:19 .
drwxr-xr-x    1 root     root          4096 Sep 23 18:19 ..
total 0
drwxr-xr-x  3 admin  wheel  96 Sep 24 01:19 .
drwxr-xr-x@ 3 admin  wheel  96 Sep 24 01:19 ..
drwxr-xr-x  2 admin  wheel  64 Sep 24 01:19 app.conf</div>
<p>The application inside expected a file and got an empty directory — it will fail with something like "is a directory" or silently use defaults, far away from the real cause. The same command with <code>--mount</code> refuses to start:</p>
<pre><code class="language-bash">docker run --rm --mount type=bind,src="$PWD/khong-co2/app.conf",dst=/etc/app.conf alpine:3.20 ls /etc/app.conf</code></pre>
<div class="out">docker: Error response from daemon: invalid mount config for type "bind": bind source path does not exist: /host_mnt/private/tmp/…/khong-co2/app.conf</div>
<p>Notice <code>/host_mnt/…</code> in the error: on Docker Desktop that is how your Mac's folder is named inside the Linux VM. On Linux the error shows the plain path. Clean up with <code>rm -rf khong-co</code>.</p>

<h3>Named, anonymous, and the difference that matters</h3>
${slide('dk-07', 7, 'Đặt tên volume: volume vô danh = dữ liệu mồ côi')}
<pre><code>docker volume create app-uploads
docker run -d --name a1 -v app-uploads:/uploads alpine:3.20 sleep 60   <span class="tok-comment"># named</span>
docker run -d --name a2 -v /uploads alpine:3.20 sleep 60               <span class="tok-comment"># anonymous</span>
docker volume ls</code></pre>
<div class="out">DRIVER    VOLUME NAME
local     881502e212470938939f6b4fb7e459d9216a05cbd15b37fc6c77d1584a8fae67
local     app-uploads</div>
<p class="note-ct">Real output (course's Mac, Docker 29.8, 09/2026). An earlier version of this lesson printed a made-up hash; yours will differ every time — that randomness is the whole problem.</p>
<p>Both persist. Only one is findable six months later. An anonymous volume is created when a <code>VOLUME</code> instruction in a Dockerfile or a bare <code>-v /path</code> has nowhere to attach — it keeps your data safe and then hides it behind a 64-character name that means nothing. This is how people end up with 40GB of volumes they are afraid to delete. <strong>Name every volume you intend to keep</strong>, and prune the rest deliberately.</p>
<h3>Run it step by step: how Docker marks an anonymous volume, and who removes it</h3>
<pre><code class="language-bash">A=$(docker inspect -f '{{range .Mounts}}{{.Name}}{{end}}' a2)   <span class="tok-comment"># write the name down NOW</span>
docker volume inspect "$A" --format '{{json .Labels}}'
docker rm -f -v a2 a1                  <span class="tok-comment"># -v: also delete a2's anonymous volume</span>
docker volume ls -q --filter name="$A" | wc -l
docker volume ls -q --filter name=app-uploads</code></pre>
<div class="out">{"com.docker.volume.anonymous":""}
0
app-uploads</div>
<p>Since Docker 23 every anonymous volume carries the label <code>com.docker.volume.anonymous</code>. That label is how <code>docker volume prune</code> knows what it may remove by default (Lesson 7.2). Three things delete an anonymous volume for you: <code>docker rm -v</code>, <code>docker run --rm</code> (removes the container's anonymous volumes when it exits) and <code>docker volume prune</code>. A named volume is only deleted when you name it — <code>docker volume rm app-uploads</code> — or when you pass <code>-a</code> to prune, or <code>-v</code> to <code>compose down</code>.</p>
<div class="callout warn"><strong>Record the name before you remove the container.</strong> Once the container is gone, nothing links the random name to what it held. That is why the first line of the block above stores it in a variable — do the same whenever you experiment with images that declare <code>VOLUME</code> (postgres, mysql, mongo, redis).</div>

<h3>What happens when you mount over an existing directory</h3>
${slide('dk-07', 6, 'Volume RỖNG được chép nội dung ảnh — bind mount thì che')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Empty volume over a populated image directory</span><span class="lz-t">the image's files are COPIED into the volume — whenever the volume is empty at mount time</span><span class="lz-d">Only for volumes. In practice that happens once, because after the copy the volume is no longer empty. The copy includes the owner and permissions of the directory itself. (An earlier version of this lesson said this is what initialises a fresh <code>postgres</code> data directory — it is not: the postgres image's data directory is empty, so only its owner is copied; <code>initdb</code> is run by the image's entrypoint script when it finds no <code>PG_VERSION</code> file.)</span></div>
  <div class="lz-step"><span class="lz-k">Non-empty volume over an image directory</span><span class="lz-t">the volume wins; the image's files are hidden</span><span class="lz-d">Not deleted — still in the image layer, just shadowed by the mount. Restarting without the mount reveals them again, unchanged.</span></div>
  <div class="lz-step"><span class="lz-k">Bind mount over an image directory</span><span class="lz-t">the host wins, always, even if the host directory is empty</span><span class="lz-d">No copying, ever. This is the single most common source of "it worked in the image and broke when I mounted it" — see the node_modules trap in Lesson 7.3.</span></div>
</div>
<pre><code><span class="tok-comment"># Prove the copy-on-first-use behaviour</span>
docker run --rm -v demo-etc:/etc/nginx nginx:alpine ls /etc/nginx | head -4
docker run --rm -v demo-etc:/mnt alpine:3.20 ls /mnt | head -4</code></pre>
<div class="out">conf.d
fastcgi.conf
fastcgi_params
mime.types
conf.d
fastcgi.conf
fastcgi_params
mime.types</div>
<p>The nginx image's config landed in the volume on first use, and a completely different container can now read it. Useful, and occasionally surprising: if you later fix a config file inside the image, the volume still holds the old copy, and the new image's version never appears. A volume that shadows configuration is a trap; volumes are for data.</p>

<h3>The exact rule, measured</h3>
<p>The official wording is: <em>"By default, content at the target destination gets copied into a mounted volume if empty."</em> "If empty" — not "the first time". Four volumes prove the difference (course's Mac, <code>nginx:1.27-alpine</code>, whose <code>/etc/nginx</code> holds 8 entries):</p>
<pre><code class="language-bash"><span class="tok-comment"># 1. opt out of the copy</span>
docker run --rm --mount type=volume,src=etc2,dst=/etc/nginx,volume-nocopy nginx:1.27-alpine ls /etc/nginx | wc -l
<span class="tok-comment"># 2. the SAME volume, mounted again normally — it is still empty, so now it copies</span>
docker run --rm -v etc2:/etc/nginx nginx:1.27-alpine ls /etc/nginx | wc -l
<span class="tok-comment"># 3. a volume that was used and then emptied again</span>
docker run --rm -v etc3:/d alpine:3.20 sh -c 'echo x &gt; /d/f; rm /d/f'
docker run --rm -v etc3:/etc/nginx nginx:1.27-alpine ls /etc/nginx | wc -l
<span class="tok-comment"># 4. a volume that already holds one file</span>
docker run --rm -v etc4:/d alpine:3.20 sh -c 'echo "cua toi" &gt; /d/ghichu.txt'
docker run --rm -v etc4:/etc/nginx nginx:1.27-alpine ls /etc/nginx</code></pre>
<div class="out">0
8
8
ghichu.txt</div>
<p>Case 4 is the one that bites: one stray file in the volume and the image's eight config files never appear — nginx then fails to start because <code>nginx.conf</code> is "missing", although it is right there in the image. The copy also carries ownership, which you can see with an image whose directory is empty:</p>
<pre><code class="language-bash">docker run --rm -v own:/var/lib/postgresql/data --entrypoint ls postgres:16-alpine -ld /var/lib/postgresql/data
docker run --rm -v own:/x alpine:3.20 ls -ld /x          <span class="tok-comment"># same volume, seen from alpine</span>
docker run --rm -v own2:/x alpine:3.20 ls -ld /x         <span class="tok-comment"># a fresh volume first mounted by alpine</span></code></pre>
<div class="out">drwxrwxrwt    2 postgres postgres      4096 Jul  7 17:47 /var/lib/postgresql/data
drwxrwxrwt    2 70       70            4096 Jul  7 17:47 /x
drwxr-xr-x    2 root     root          4096 Sep 23 18:20 /x</div>
<p>The volume first mounted by postgres belongs to uid 70 (the <code>postgres</code> user of the Alpine image — alpine has no user with that number, so it prints 70). That inherited owner is what lets the postgres process write its data without running as root. A volume first mounted somewhere else stays <code>root</code>-owned, and the database then fails with <code>permission denied</code> — one more reason to give each database its own volume.</p>
<table>
<tr><th>Situation</th><th>Volume (named or anonymous)</th><th>Bind mount</th></tr>
<tr><td>Target is empty, image has files there</td><td>Image files copied in, with owner</td><td>Host folder shown as it is (maybe empty)</td></tr>
<tr><td>Target already has data</td><td>Its data wins; image files hidden</td><td>Host folder wins; image files hidden</td></tr>
<tr><td>You want to switch the copy off</td><td><code>volume-nocopy</code></td><td>(never copies)</td></tr>
<tr><td>The image later ships a new version of those files</td><td>You keep the old copy</td><td>You see whatever is on the host</td></tr>
</table>

<h3>When to use each — and when NOT to</h3>
<table>
<tr><th>Mount</th><th>Use it for</th><th>Do NOT use it for</th></tr>
<tr><td>Named volume</td><td>Databases, uploads, anything that must survive <code>rm</code> and deploys</td><td>Config files you edit (the image's newer copy will never replace it); source code you want to edit live</td></tr>
<tr><td>Bind mount</td><td>Source code in development, a config folder, the Docker socket (knowingly)</td><td>A database's data directory on Mac/Windows; anything a teammate on another OS must reproduce exactly</td></tr>
<tr><td>tmpfs</td><td>Scratch files, caches that may vanish, secrets while the process runs</td><td>Anything that must survive a restart; large data (it is RAM)</td></tr>
<tr><td>Nothing (writable layer)</td><td>Stateless web/API containers</td><td>Anything you would be sad to lose on the next deploy</td></tr>
</table>

<h3>Choosing, in one table</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Database files</span><span class="v"><strong>Volume.</strong> Docker manages permissions and the filesystem is one Docker knows works. A bind-mounted Postgres data directory on macOS or Windows is a well-known source of corruption and terrible performance.</span></div>
  <div class="kv"><span class="k">Your source code in dev</span><span class="v"><strong>Bind mount.</strong> The whole point is that editing on the host changes what the container sees, instantly.</span></div>
  <div class="kv"><span class="k">A config file</span><span class="v"><strong>Bind mount, read-only</strong> (<code>:ro</code>). Or bake it into the image. Never a volume — you want the image's copy to win when you update it.</span></div>
  <div class="kv"><span class="k">Uploads, generated media</span><span class="v"><strong>Volume</strong> in production, or object storage (R2/S3) if more than one machine will ever serve them.</span></div>
  <div class="kv"><span class="k">Scratch, temp, secrets in flight</span><span class="v"><strong>tmpfs.</strong> Fast, and it cannot leak onto a disk that outlives the container.</span></div>
  <div class="kv"><span class="k">The Docker socket</span><span class="v"><strong>Bind mount</strong> — <code>/var/run/docker.sock</code>. And understand exactly what you are granting: it is root on the host (Lesson 6.4).</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> in your SWP391 group, one teammate ran <code>docker compose down</code> and <code>up</code> and the test data "vanished"; another typed a config path wrong and the container got a folder instead of a file. Reproduce both on purpose, so you recognise them next time.</p><ol>
<li>Work in <code>~/thu-docker/ch07</code>. Write a file into the writable layer of one container and into a named volume <code>thu-data</code> of another; remove both containers; read both again from new containers (block below).</li>
<li>Before running it, predict: how many entries will <code>ls /etc/nginx | wc -l</code> print with an empty <strong>volume</strong> <code>thu-etc</code> over <code>/etc/nginx</code>, and how many with an empty <strong>folder</strong> <code>rong</code>? Then run both.</li>
<li>Reproduce the typo: <code>-v "$PWD/khong-co/app.conf:/etc/app.conf"</code>, then <code>ls -la khong-co</code>. Repeat with <code>--mount type=bind,…</code> and read the error.</li>
<li>Clean up: <code>docker volume rm thu-data thu-etc</code> and <code>rm -rf rong khong-co</code>.</li></ol>
<pre><code class="language-bash">mkdir -p ~/thu-docker/ch07 &amp;&amp; cd ~/thu-docker/ch07
docker run --name thu-a alpine:3.20 sh -c 'echo layer &gt; /note.txt'
docker run --name thu-b -v thu-data:/data alpine:3.20 sh -c 'echo volume &gt; /data/note.txt'
docker rm thu-a thu-b
docker run --rm alpine:3.20 cat /note.txt                    <span class="tok-comment"># ?</span>
docker run --rm -v thu-data:/data alpine:3.20 cat /data/note.txt   <span class="tok-comment"># ?</span></code></pre>
<p><strong>Done when:</strong> the first <code>cat</code> fails and the second prints <code>volume</code>; you got <strong>8</strong> and <strong>0</strong> in step 2 and can say why; you saw <code>app.conf</code> listed as a <em>directory</em>; and <code>docker volume ls --filter name=thu-</code> is empty at the end.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Writable layer</span><span class="v">The container's own top layer; every path you did not mount lands here, and it is deleted by <code>rm</code>.</span></div>
  <div class="kv"><span class="k">Mount</span><span class="v">Attaching some storage at a path inside the container, hiding whatever the image had there.</span></div>
  <div class="kv"><span class="k">Named volume</span><span class="v">Docker-managed storage you refer to by a name you chose; survives <code>rm</code> and deploys.</span></div>
  <div class="kv"><span class="k">Anonymous volume</span><span class="v">Same storage, random 64-hex name, label <code>com.docker.volume.anonymous</code>; easy to lose track of.</span></div>
  <div class="kv"><span class="k">Bind mount</span><span class="v">A host folder or file shown inside the container, byte for byte, no copying.</span></div>
  <div class="kv"><span class="k">tmpfs</span><span class="v">A mount that lives in RAM only and disappears when the container stops.</span></div>
  <div class="kv"><span class="k">Volume populate (copy-up)</span><span class="v">Docker copying the image's files and ownership into a volume that is empty when mounted.</span></div>
  <div class="kv"><span class="k"><code>volume-nocopy</code></span><span class="v">The <code>--mount</code> option that switches that copy off.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every path you do not mount lives in the writable layer and dies with <code>docker rm</code> — and every deploy is an <code>rm</code>.</li>
<li>Volume = Docker's folder, called by name; bind mount = your folder; tmpfs = RAM.</li>
<li><code>-v</code> guesses the type from the left side (<code>src</code> is a volume name, <code>./src</code> is a folder) and creates missing host paths as directories; <code>--mount</code> refuses instead.</li>
<li>An empty volume receives a copy of the image's files and owner; a bind mount never copies, it only hides.</li>
<li>Name volumes you keep; write down an anonymous volume's name before you remove its container.</li>
<li>Volumes are for data, not for config you will update in the image.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/engine/storage/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Storage overview</span><span class="lc-sub">The official comparison of volumes, bind mounts and tmpfs, with the mount-over-existing-directory rules spelled out. The diagram there is worth the visit on its own.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/run/#volume" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">docker run — the -v and --mount flags</span><span class="lc-sub">Every option both syntaxes accept, including <code>ro</code>, <code>z</code>/<code>Z</code> for SELinux, <code>bind-propagation</code>, and the volume options passed to the driver.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: pick the right mount</span><span class="lc-sub">Graded exercises: make a file survive <code>docker rm</code>, predict what a mount over a populated directory shows, and choose volume/bind/tmpfs for six real scenarios with a one-line justification each.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> assuming <code>docker rm</code> removes the container's data. It removes the writable layer, and it removes <em>anonymous</em> volumes only if you pass <code>-v</code>. Named volumes survive <code>docker rm</code>, <code>docker compose down</code>, a full <code>docker system prune</code>, and — since Docker 23 — even a plain <code>docker volume prune</code>, which only removes anonymous volumes; you have to ask for <code>docker volume rm &lt;name&gt;</code>, <code>docker volume prune -a</code>, or <code>docker compose down -v</code>, specifically. That asymmetry saves you far more often than it hurts, but it means "I removed everything and the old data came back" is a normal Tuesday, and it also means an unused volume can quietly hold 40GB for a year. Check with <code>docker system df -v</code> before assuming your disk problem is images.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The writable layer dies with the container, always — anything you want to keep goes into a volume, a bind mount or object storage, deliberately. An empty <em>volume</em> mounted over a populated image directory gets the image's files copied in once; a <em>bind mount</em> never does, and hides whatever was there. And name your volumes: an anonymous volume protects your data and then makes it impossible to find on purpose.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Vì sao container quên, và ba cách chữa</h2>
<p class="lead">Bạn đã gặp lớp ghi được ở Bài 1.4: mỗi container có một lớp đọc-ghi mỏng nằm trên cùng cái ảnh, và lớp đó chết theo container. Đó là mặc định đúng — chính nó khiến container trở thành thứ dùng xong vứt được. Nhưng một cơ sở dữ liệu thì không vứt được, file người dùng tải lên cũng vậy. Chương này nói về những cái lỗ bạn cố ý khoét vào mô hình đó.</p>

<h3>Nhìn một container quên</h3>
${slide('dk-07', 4, 'Container quên: tầng ghi chết theo docker rm')}
<pre><code>docker run --name forgetful -d alpine:3.20 sleep 300
docker exec forgetful sh -c 'echo "important" &gt; /data.txt; cat /data.txt'
docker rm -f forgetful &gt;/dev/null
docker run --rm alpine:3.20 cat /data.txt</code></pre>
<div class="out">important
cat: can't open '/data.txt': No such file or directory</div>
<p>Không có gì mất do sơ suất cả. File nằm trong lớp ghi được của một container không còn tồn tại; một container mới từ cùng cái ảnh khởi động lại từ đúng những lớp ảnh sạch đó. Muốn một file sống lâu hơn container thì nó không được nằm bên trong container.</p>

<h3>Ba kiểu gắn dữ liệu</h3>
${slide('dk-07', 3, 'Ba kiểu gắn = ba chỗ lưu khác nhau trên máy chủ')}
<p>Đọc hình từ trên xuống. Tiến trình bên trong container thấy MỘT cây thư mục bình thường — <code>/var/lib/postgresql/data</code>, <code>/app/src</code>, <code>/tmp</code> và mọi thứ khác với nó đều như nhau. Docker quyết định, theo từng đường dẫn, byte thật sự đi đâu: một thư mục Docker quản (volume), một thư mục <em>bạn</em> chọn (bind mount — gắn thư mục máy chủ), bộ nhớ (tmpfs), hoặc — với mọi đường dẫn bạn không nhắc tới — tầng ghi (writable layer) bị xoá cùng container. Trên laptop Mac hay Windows, nửa dưới của hình nằm BÊN TRONG máy ảo Linux của Docker Desktop, và đó là lý do vài thứ chạy khác đi ở đó (Bài 7.3).</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">volume</span><span class="lz-lnote">Docker sở hữu chỗ lưu, nằm ở <code>/var/lib/docker/volumes/&lt;tên&gt;/_data</code>. Bạn gọi nó bằng TÊN, không bao giờ bằng đường dẫn máy chủ. Lựa chọn mặc định cho mọi thứ ứng dụng ghi ra và phải giữ lại: cơ sở dữ liệu, file tải lên, cache đáng giữ.</span></div>
  <div class="lz-layer"><span class="lz-lname">bind mount</span><span class="lz-lnote">Một thư mục cụ thể trên máy chủ hiện ra bên trong container. Bạn tự chọn đường dẫn chính xác ở cả hai phía. Đúng cho mã nguồn lúc phát triển, cho file cấu hình, và cho socket Docker — và SAI cho một cơ sở dữ liệu.</span></div>
  <div class="lz-layer"><span class="lz-lname">tmpfs</span><span class="lz-lnote">Bộ nhớ, không bao giờ chạm đĩa. Biến mất khi container dừng. Dành cho chỗ nháp, và cho mọi thứ nhạy cảm không được phép ghi xuống một cái đĩa mà sau này bạn có thể quên xoá.</span></div>
</div>
<pre><code><span class="tok-comment"># Cùng một phép gắn, viết bằng hai cú pháp bạn sẽ gặp</span>
docker run -v mydata:/var/lib/postgresql/data postgres:16          <span class="tok-comment"># dạng ngắn</span>
docker run --mount type=volume,src=mydata,dst=/var/lib/postgresql/data postgres:16

<span class="tok-comment"># Bind mount: đường dẫn tuyệt đối trên máy chủ nằm bên trái</span>
docker run -v "$PWD/src:/app/src" node:22-alpine
docker run --mount type=bind,src="$PWD/src",dst=/app/src,ro node:22-alpine</code></pre>
<div class="callout"><strong><code>-v</code> so với <code>--mount</code>.</strong> Chúng làm cùng một việc; <code>--mount</code> nói rõ ràng và báo lỗi to, <code>-v</code> viết ngắn và tự đoán. Khác biệt hành vi duy nhất mà cắn bạn: với <code>-v</code>, một đường dẫn máy chủ không tồn tại sẽ được lặng lẽ <em>tạo ra thành thư mục rỗng</em>, nên gõ nhầm đường dẫn cấu hình cho bạn một thư mục rỗng thay vì một lỗi. <code>--mount type=bind</code> thì từ chối khởi động. Dùng <code>-v</code> khi gõ tay, dùng <code>--mount</code> trong mọi thứ commit vào kho.</div>

<h3>Đọc -v và --mount, từng phần một</h3>
${slide('dk-07', 5, 'Đọc -v theo hình dạng bên trái dấu hai chấm')}
<p><code>-v</code> nhét tối đa ba trường vào một chuỗi, ngăn bằng dấu hai chấm: <code>NGUỒN:ĐÍCH:TUỲ-CHỌN</code>. ĐÍCH luôn là đường dẫn <em>bên trong</em> container. Docker đoán kiểu gắn theo <em>hình dạng</em> của NGUỒN — không có từ khoá nào cả — nên đáng đọc chậm một lần:</p>
<table>
<tr><th>Bạn gõ</th><th>Docker hiểu là</th><th>Vì sao</th></tr>
<tr><td><code>-v pgdata:/var/lib/postgresql/data</code></td><td>Volume có tên <code>pgdata</code></td><td>Bên trái không có <code>/</code>: đó là một cái TÊN. Chưa có thì tự tạo.</td></tr>
<tr><td><code>-v "$PWD/src:/app/src"</code></td><td>Bind mount thư mục đó</td><td>Bên trái là đường dẫn tuyệt đối. Nhớ đặt trong nháy — đường dẫn có dấu cách sẽ làm hỏng lệnh.</td></tr>
<tr><td><code>-v ./src:/app/src</code></td><td>Bind mount (đường dẫn tương đối)</td><td>Có <code>./</code> đứng đầu = đường dẫn. Docker hiện nay nhận; đã thử trên Docker 29.</td></tr>
<tr><td><code>-v src:/app/src</code></td><td><strong>Một volume MỚI, RỖNG tên <code>src</code></strong></td><td>Không có gạch chéo nên nó là TÊN — thư mục của bạn bị bỏ qua. Lỗi gõ kinh điển.</td></tr>
<tr><td><code>-v /data</code></td><td>Volume vô danh</td><td>Chỉ có đích: Docker tự bịa một cái tên 64 ký tự.</td></tr>
<tr><td><code>-v pgdata:/data:ro</code></td><td>Chỉ đọc</td><td>Trường thứ ba = tuỳ chọn (<code>ro</code>, và <code>z</code>/<code>Z</code> cho SELinux).</td></tr>
</table>
<p>Lỗi gõ ở dòng thứ tư đáng tự nhìn tận mắt, vì chẳng có gì báo lỗi cả (máy Mac của khoá, Docker 29.8):</p>
<pre><code class="language-bash">mkdir -p src &amp;&amp; echo hi &gt; src/a.txt
docker run --rm -v ./src:/app/src alpine:3.20 ls /app/src    <span class="tok-comment"># bind: thư mục của bạn</span>
docker run --rm -v src:/app/src alpine:3.20 ls /app/src      <span class="tok-comment"># volume tên "src": rỗng</span>
docker volume ls -q --filter name=^src$</code></pre>
<div class="out">a.txt
src</div>
<p>Lệnh thứ hai không in gì (một volume rỗng) và lặng lẽ tạo ra một volume tên <code>src</code>. Xoá nó bằng <code>docker volume rm src</code>.</p>
<p><code>--mount</code> nói đúng những điều đó bằng các khoá tường minh, vì thế nó không thể đoán sai:</p>
<table>
<tr><th>Khoá</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>type</code></td><td><code>volume</code>, <code>bind</code> hoặc <code>tmpfs</code></td><td><code>type=bind</code></td></tr>
<tr><td><code>src</code> (hoặc <code>source</code>)</td><td>Tên volume, hoặc đường dẫn máy chủ với bind; bỏ trống cho volume vô danh hoặc tmpfs</td><td><code>src=pgdata</code></td></tr>
<tr><td><code>dst</code> (hoặc <code>target</code>)</td><td>Đường dẫn bên trong container</td><td><code>dst=/var/lib/postgresql/data</code></td></tr>
<tr><td><code>readonly</code> / <code>ro</code></td><td>Gắn chỉ đọc</td><td><code>…,ro</code></td></tr>
<tr><td><code>volume-nocopy</code></td><td>Không chép file của ảnh vào volume rỗng (xem dưới)</td><td><code>…,volume-nocopy</code></td></tr>
<tr><td><code>volume-label</code></td><td>Gắn nhãn cho volume mà Docker tạo ra</td><td><code>volume-label=app=blog</code></td></tr>
<tr><td><code>tmpfs-size</code> · <code>tmpfs-mode</code></td><td>Trần dung lượng và quyền của tmpfs</td><td><code>tmpfs-size=64m,tmpfs-mode=1770</code></td></tr>
</table>

<h3>Chạy thử từng bước: lỗi gõ sinh ra một thư mục</h3>
<p>Khung ở trên nói <code>-v</code> tự tạo đường dẫn máy chủ còn thiếu. Đây là hình dạng của nó — để ý kết quả là một THƯ MỤC mang tên file của bạn (máy Mac của khoá):</p>
<pre><code class="language-bash">docker run --rm -v "$PWD/khong-co/app.conf:/etc/app.conf" alpine:3.20 ls -la /etc/app.conf
ls -la khong-co</code></pre>
<div class="out">total 4
drwxr-xr-x    2 root     root            64 Sep 23 18:19 .
drwxr-xr-x    1 root     root          4096 Sep 23 18:19 ..
total 0
drwxr-xr-x  3 admin  wheel  96 Sep 24 01:19 .
drwxr-xr-x@ 3 admin  wheel  96 Sep 24 01:19 ..
drwxr-xr-x  2 admin  wheel  64 Sep 24 01:19 app.conf</div>
<p>Ứng dụng bên trong chờ một FILE và nhận một thư mục rỗng — nó sẽ chết với câu kiểu "is a directory" hoặc lặng lẽ dùng cấu hình mặc định, cách rất xa nguyên nhân thật. Cùng lệnh đó viết bằng <code>--mount</code> thì từ chối khởi động:</p>
<pre><code class="language-bash">docker run --rm --mount type=bind,src="$PWD/khong-co2/app.conf",dst=/etc/app.conf alpine:3.20 ls /etc/app.conf</code></pre>
<div class="out">docker: Error response from daemon: invalid mount config for type "bind": bind source path does not exist: /host_mnt/private/tmp/…/khong-co2/app.conf</div>
<p>Để ý <code>/host_mnt/…</code> trong thông báo lỗi: trên Docker Desktop đó là tên thư mục Mac của bạn khi nhìn từ BÊN TRONG máy ảo Linux. Trên Linux thông báo in đường dẫn trần. Dọn bằng <code>rm -rf khong-co</code>.</p>

<h3>Có tên, vô danh, và khác biệt thật sự quan trọng</h3>
${slide('dk-07', 7, 'Đặt tên volume: volume vô danh = dữ liệu mồ côi')}
<pre><code>docker volume create app-uploads
docker run -d --name a1 -v app-uploads:/uploads alpine:3.20 sleep 60   <span class="tok-comment"># có tên</span>
docker run -d --name a2 -v /uploads alpine:3.20 sleep 60               <span class="tok-comment"># vô danh</span>
docker volume ls</code></pre>
<div class="out">DRIVER    VOLUME NAME
local     881502e212470938939f6b4fb7e459d9216a05cbd15b37fc6c77d1584a8fae67
local     app-uploads</div>
<p class="note-ct">Output thật (máy Mac của khoá, Docker 29.8, 09/2026). Bản cũ của bài in một mã băm bịa; mã của bạn mỗi lần một khác — chính sự ngẫu nhiên đó là vấn đề.</p>
<p>Cả hai đều tồn tại lâu dài. Chỉ một cái tìm lại được sau sáu tháng. Volume vô danh được tạo ra khi một chỉ thị <code>VOLUME</code> trong Dockerfile hoặc một <code>-v /path</code> trơ trọi không có chỗ nào để gắn vào — nó giữ dữ liệu của bạn an toàn rồi giấu sau một cái tên 64 ký tự chẳng nói lên gì. Đây là cách người ta ôm 40GB volume mà không dám xoá. <strong>Hãy đặt tên cho mọi volume bạn định giữ</strong>, và dọn phần còn lại một cách có chủ đích.</p>
<h3>Chạy thử từng bước: Docker đánh dấu volume vô danh thế nào, và ai xoá nó</h3>
<pre><code class="language-bash">A=$(docker inspect -f '{{range .Mounts}}{{.Name}}{{end}}' a2)   <span class="tok-comment"># ghi tên lại NGAY</span>
docker volume inspect "$A" --format '{{json .Labels}}'
docker rm -f -v a2 a1                  <span class="tok-comment"># -v: xoá luôn volume vô danh của a2</span>
docker volume ls -q --filter name="$A" | wc -l
docker volume ls -q --filter name=app-uploads</code></pre>
<div class="out">{"com.docker.volume.anonymous":""}
0
app-uploads</div>
<p>Từ Docker 23, mỗi volume vô danh mang nhãn (label) <code>com.docker.volume.anonymous</code>. Nhãn đó là cách <code>docker volume prune</code> biết mặc định nó được xoá cái gì (Bài 7.2). Ba thứ xoá volume vô danh hộ bạn: <code>docker rm -v</code>, <code>docker run --rm</code> (xoá volume vô danh của container khi nó thoát) và <code>docker volume prune</code>. Volume có tên chỉ bị xoá khi bạn gọi đích danh — <code>docker volume rm app-uploads</code> — hoặc khi bạn thêm <code>-a</code> cho prune, hoặc <code>-v</code> cho <code>compose down</code>.</p>
<div class="callout warn"><strong>Ghi tên lại TRƯỚC khi xoá container.</strong> Container đi rồi thì không còn gì nối cái tên ngẫu nhiên với thứ nó chứa. Đó là lý do dòng đầu của khối trên cất tên vào một biến — hãy làm y vậy mỗi khi thử nghiệm với ảnh có khai <code>VOLUME</code> (postgres, mysql, mongo, redis).</div>

<h3>Chuyện gì xảy ra khi bạn gắn đè lên một thư mục đã có</h3>
${slide('dk-07', 6, 'Volume RỖNG được chép nội dung ảnh — bind mount thì che')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Volume RỖNG đè lên thư mục có sẵn trong ảnh</span><span class="lz-t">file của ảnh được CHÉP vào volume — mỗi khi volume còn RỖNG lúc gắn</span><span class="lz-d">Chỉ với volume. Thực tế thường chỉ xảy ra một lần, vì chép xong thì volume hết rỗng. Việc chép mang theo cả chủ sở hữu và quyền của chính thư mục đó. (Bản cũ của bài nói đây là thứ khởi tạo thư mục dữ liệu của một container <code>postgres</code> mới — SAI: thư mục data trong ảnh postgres rỗng, nên chỉ có chủ sở hữu được chép; <code>initdb</code> do script entrypoint của ảnh chạy khi nó không thấy file <code>PG_VERSION</code>.)</span></div>
  <div class="lz-step"><span class="lz-k">Volume KHÔNG rỗng đè lên thư mục của ảnh</span><span class="lz-t">volume thắng; file của ảnh bị che</span><span class="lz-d">Không bị xoá — vẫn nằm trong lớp ảnh, chỉ bị phép gắn che khuất. Khởi động lại mà không gắn thì chúng hiện ra nguyên vẹn.</span></div>
  <div class="lz-step"><span class="lz-k">Bind mount đè lên thư mục của ảnh</span><span class="lz-t">phía máy chủ thắng, luôn luôn, kể cả khi thư mục đó rỗng</span><span class="lz-d">Không bao giờ có chuyện chép. Đây là nguồn gốc phổ biến nhất của câu "trong ảnh chạy được, gắn vào là hỏng" — xem bẫy node_modules ở Bài 7.3.</span></div>
</div>
<pre><code><span class="tok-comment"># Chứng minh hành vi chép-ở-lần-dùng-đầu</span>
docker run --rm -v demo-etc:/etc/nginx nginx:alpine ls /etc/nginx | head -4
docker run --rm -v demo-etc:/mnt alpine:3.20 ls /mnt | head -4</code></pre>
<div class="out">conf.d
fastcgi.conf
fastcgi_params
mime.types
conf.d
fastcgi.conf
fastcgi_params
mime.types</div>
<p>Cấu hình của ảnh nginx đã rơi vào volume ở lần dùng đầu, và giờ một container hoàn toàn khác đọc được nó. Tiện, và thỉnh thoảng gây bất ngờ: nếu sau này bạn sửa một file cấu hình bên trong ảnh, volume vẫn giữ bản cũ, và bản mới của ảnh không bao giờ xuất hiện. Một volume che khuất cấu hình là một cái bẫy; volume là để chứa DỮ LIỆU.</p>

<h3>Luật chính xác, đo thật</h3>
<p>Câu chữ chính thức là: <em>"By default, content at the target destination gets copied into a mounted volume if empty"</em> — mặc định, nội dung ở đích được chép vào volume được gắn NẾU nó RỖNG. "Nếu rỗng" — chứ không phải "lần đầu tiên". Bốn volume chứng minh khác biệt đó (máy Mac của khoá, <code>nginx:1.27-alpine</code>, có 8 mục trong <code>/etc/nginx</code>):</p>
<pre><code class="language-bash"><span class="tok-comment"># 1. tắt việc chép</span>
docker run --rm --mount type=volume,src=etc2,dst=/etc/nginx,volume-nocopy nginx:1.27-alpine ls /etc/nginx | wc -l
<span class="tok-comment"># 2. CHÍNH volume đó, gắn lại bình thường — vẫn rỗng, nên giờ nó chép</span>
docker run --rm -v etc2:/etc/nginx nginx:1.27-alpine ls /etc/nginx | wc -l
<span class="tok-comment"># 3. một volume đã dùng rồi được dọn trống lại</span>
docker run --rm -v etc3:/d alpine:3.20 sh -c 'echo x &gt; /d/f; rm /d/f'
docker run --rm -v etc3:/etc/nginx nginx:1.27-alpine ls /etc/nginx | wc -l
<span class="tok-comment"># 4. một volume đã có sẵn một file</span>
docker run --rm -v etc4:/d alpine:3.20 sh -c 'echo "cua toi" &gt; /d/ghichu.txt'
docker run --rm -v etc4:/etc/nginx nginx:1.27-alpine ls /etc/nginx</code></pre>
<div class="out">0
8
8
ghichu.txt</div>
<p>Trường hợp 4 là cái cắn người: một file lạc trong volume là tám file cấu hình của ảnh không bao giờ hiện ra — nginx rồi không khởi động được vì "thiếu" <code>nginx.conf</code>, dù nó nằm ngay trong ảnh. Việc chép còn mang theo CHỦ SỞ HỮU, thấy rõ với một ảnh có thư mục rỗng:</p>
<pre><code class="language-bash">docker run --rm -v own:/var/lib/postgresql/data --entrypoint ls postgres:16-alpine -ld /var/lib/postgresql/data
docker run --rm -v own:/x alpine:3.20 ls -ld /x          <span class="tok-comment"># cùng volume, nhìn từ alpine</span>
docker run --rm -v own2:/x alpine:3.20 ls -ld /x         <span class="tok-comment"># volume mới, alpine gắn trước</span></code></pre>
<div class="out">drwxrwxrwt    2 postgres postgres      4096 Jul  7 17:47 /var/lib/postgresql/data
drwxrwxrwt    2 70       70            4096 Jul  7 17:47 /x
drwxr-xr-x    2 root     root          4096 Sep 23 18:20 /x</div>
<p>Volume do postgres gắn trước thuộc về uid 70 (người dùng <code>postgres</code> của ảnh Alpine — ảnh alpine không có người dùng mang số đó nên in ra 70). Chính chủ sở hữu được thừa kế đó cho phép tiến trình postgres ghi dữ liệu mà không cần chạy bằng root. Một volume được gắn ở chỗ khác trước thì vẫn thuộc <code>root</code>, và CSDL sau đó chết với <code>permission denied</code> — thêm một lý do để mỗi CSDL có volume riêng.</p>
<table>
<tr><th>Tình huống</th><th>Volume (có tên hay vô danh)</th><th>Bind mount</th></tr>
<tr><td>Đích đang rỗng, ảnh có file ở đó</td><td>File của ảnh được chép vào, kèm chủ sở hữu</td><td>Hiện đúng thư mục máy chủ (có thể rỗng)</td></tr>
<tr><td>Đích đã có dữ liệu</td><td>Dữ liệu của nó thắng; file của ảnh bị che</td><td>Thư mục máy chủ thắng; file của ảnh bị che</td></tr>
<tr><td>Muốn tắt việc chép</td><td><code>volume-nocopy</code></td><td>(không bao giờ chép)</td></tr>
<tr><td>Ảnh sau này mang bản mới của những file đó</td><td>Bạn vẫn giữ bản chép CŨ</td><td>Bạn thấy đúng thứ đang có trên máy</td></tr>
</table>

<h3>Khi nào dùng cái nào — và khi nào KHÔNG</h3>
<table>
<tr><th>Kiểu gắn</th><th>Dùng cho</th><th>ĐỪNG dùng cho</th></tr>
<tr><td>Volume có tên</td><td>CSDL, file tải lên, mọi thứ phải sống qua <code>rm</code> và deploy</td><td>File cấu hình bạn hay sửa (bản mới trong ảnh không bao giờ thay được nó); mã nguồn muốn sửa sống</td></tr>
<tr><td>Bind mount</td><td>Mã nguồn lúc dev, một thư mục cấu hình, socket Docker (khi hiểu rõ mình trao gì)</td><td>Thư mục data của CSDL trên Mac/Windows; thứ mà bạn cùng nhóm dùng hệ điều hành khác phải tái lập y hệt</td></tr>
<tr><td>tmpfs</td><td>File nháp, cache mất cũng được, bí mật trong lúc tiến trình chạy</td><td>Thứ phải sống qua restart; dữ liệu lớn (nó là RAM)</td></tr>
<tr><td>Không gắn gì (tầng ghi)</td><td>Container web/API không trạng thái</td><td>Bất cứ thứ gì bạn sẽ tiếc khi deploy lần sau</td></tr>
</table>

<h3>Chọn thế nào, gói trong một bảng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">File cơ sở dữ liệu</span><span class="v"><strong>Volume.</strong> Docker quản quyền và hệ thống file là thứ Docker biết chắc chạy được. Một thư mục dữ liệu Postgres bind-mount trên macOS hay Windows là nguồn hỏng dữ liệu và chậm kinh khủng ai cũng biết.</span></div>
  <div class="kv"><span class="k">Mã nguồn lúc phát triển</span><span class="v"><strong>Bind mount.</strong> Toàn bộ mục đích là sửa trên máy chủ thì container thấy đổi ngay lập tức.</span></div>
  <div class="kv"><span class="k">Một file cấu hình</span><span class="v"><strong>Bind mount, chỉ đọc</strong> (<code>:ro</code>). Hoặc nướng thẳng vào ảnh. Đừng bao giờ dùng volume — bạn muốn bản trong ảnh thắng khi bạn cập nhật nó.</span></div>
  <div class="kv"><span class="k">File tải lên, media sinh ra</span><span class="v"><strong>Volume</strong> trên production, hoặc lưu trữ đối tượng (R2/S3) nếu sẽ có nhiều hơn một máy phục vụ chúng.</span></div>
  <div class="kv"><span class="k">Chỗ nháp, tạm, bí mật đang luân chuyển</span><span class="v"><strong>tmpfs.</strong> Nhanh, và nó không thể rò ra một cái đĩa sống lâu hơn container.</span></div>
  <div class="kv"><span class="k">Socket Docker</span><span class="v"><strong>Bind mount</strong> — <code>/var/run/docker.sock</code>. Và hiểu rõ bạn đang trao cái gì: đó là quyền root trên máy chủ (Bài 6.4).</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trong nhóm SWP391, một bạn chạy <code>docker compose down</code> rồi <code>up</code> và dữ liệu thử "biến mất"; một bạn khác gõ nhầm đường dẫn file cấu hình và container nhận một thư mục thay vì một file. Hãy cố ý tái hiện cả hai để lần sau nhận ra ngay.</p><ol>
<li>Làm trong <code>~/thu-docker/ch07</code>. Ghi một file vào tầng ghi của một container và vào volume có tên <code>thu-data</code> của một container khác; xoá cả hai container; đọc lại cả hai từ container mới (khối lệnh bên dưới).</li>
<li>Trước khi chạy, đoán: <code>ls /etc/nginx | wc -l</code> in ra bao nhiêu khi gắn một <strong>volume</strong> rỗng <code>thu-etc</code> đè lên <code>/etc/nginx</code>, và bao nhiêu khi gắn một <strong>thư mục</strong> rỗng <code>rong</code>? Rồi chạy cả hai.</li>
<li>Tái hiện lỗi gõ: <code>-v "$PWD/khong-co/app.conf:/etc/app.conf"</code>, rồi <code>ls -la khong-co</code>. Làm lại bằng <code>--mount type=bind,…</code> và đọc thông báo lỗi.</li>
<li>Dọn: <code>docker volume rm thu-data thu-etc</code> và <code>rm -rf rong khong-co</code>.</li></ol>
<pre><code class="language-bash">mkdir -p ~/thu-docker/ch07 &amp;&amp; cd ~/thu-docker/ch07
docker run --name thu-a alpine:3.20 sh -c 'echo layer &gt; /note.txt'
docker run --name thu-b -v thu-data:/data alpine:3.20 sh -c 'echo volume &gt; /data/note.txt'
docker rm thu-a thu-b
docker run --rm alpine:3.20 cat /note.txt                    <span class="tok-comment"># ?</span>
docker run --rm -v thu-data:/data alpine:3.20 cat /data/note.txt   <span class="tok-comment"># ?</span></code></pre>
<p><strong>Đạt khi:</strong> lệnh <code>cat</code> đầu báo lỗi còn lệnh thứ hai in <code>volume</code>; bước 2 ra <strong>8</strong> và <strong>0</strong> và bạn nói được vì sao; bạn đã thấy <code>app.conf</code> hiện ra là một THƯ MỤC; và cuối cùng <code>docker volume ls --filter name=thu-</code> rỗng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Writable layer (tầng ghi)</span><span class="v">Tầng trên cùng của riêng container; mọi đường dẫn bạn không gắn đều rơi vào đây, và <code>rm</code> xoá nó.</span></div>
  <div class="kv"><span class="k">Mount (phép gắn)</span><span class="v">Gắn một chỗ lưu vào một đường dẫn trong container, che mất thứ ảnh có sẵn ở đó.</span></div>
  <div class="kv"><span class="k">Named volume (volume có tên)</span><span class="v">Chỗ lưu do Docker quản, gọi bằng cái tên bạn chọn; sống qua <code>rm</code> và deploy.</span></div>
  <div class="kv"><span class="k">Anonymous volume (volume vô danh)</span><span class="v">Cũng là chỗ lưu đó nhưng tên ngẫu nhiên 64 ký tự, nhãn <code>com.docker.volume.anonymous</code>; rất dễ thất lạc.</span></div>
  <div class="kv"><span class="k">Bind mount (gắn thư mục máy chủ)</span><span class="v">Một thư mục hay file của máy chủ hiện nguyên trong container, không chép gì.</span></div>
  <div class="kv"><span class="k">tmpfs (hệ thống file trong RAM)</span><span class="v">Phép gắn chỉ nằm trong bộ nhớ, biến mất khi container dừng.</span></div>
  <div class="kv"><span class="k">Populate / copy-up (chép vào volume)</span><span class="v">Docker chép file và chủ sở hữu của ảnh vào một volume đang rỗng lúc gắn.</span></div>
  <div class="kv"><span class="k"><code>volume-nocopy</code></span><span class="v">Tuỳ chọn của <code>--mount</code> để tắt việc chép đó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi đường dẫn bạn không gắn đều nằm ở tầng ghi và chết theo <code>docker rm</code> — mà mỗi lần deploy là một lần <code>rm</code>.</li>
<li>Volume = thư mục của Docker, gọi bằng tên; bind mount = thư mục của bạn; tmpfs = RAM.</li>
<li><code>-v</code> đoán kiểu theo vế trái (<code>src</code> là tên volume, <code>./src</code> là thư mục) và tự tạo đường dẫn máy chủ còn thiếu thành THƯ MỤC; <code>--mount</code> thì từ chối.</li>
<li>Volume rỗng được chép file và chủ sở hữu của ảnh vào; bind mount không bao giờ chép, chỉ che.</li>
<li>Đặt tên cho volume muốn giữ; ghi lại tên volume vô danh trước khi xoá container của nó.</li>
<li>Volume dành cho DỮ LIỆU, không dành cho cấu hình mà bạn sẽ cập nhật trong ảnh.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/engine/storage/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Tổng quan lưu trữ</span><span class="lc-sub">Bảng so sánh chính thức giữa volume, bind mount và tmpfs, với luật gắn-đè-thư-mục-có-sẵn viết rõ ra. Riêng cái sơ đồ ở đó đã đáng ghé.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/run/#volume" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">docker run — cờ -v và --mount</span><span class="lc-sub">Mọi tuỳ chọn cả hai cú pháp nhận, gồm <code>ro</code>, <code>z</code>/<code>Z</code> cho SELinux, <code>bind-propagation</code>, và các tuỳ chọn volume truyền xuống driver.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chọn đúng kiểu gắn</span><span class="lc-sub">Bài chấm điểm: làm cho một file sống sót qua <code>docker rm</code>, đoán trước một phép gắn đè lên thư mục có sẵn sẽ hiện ra gì, và chọn volume/bind/tmpfs cho sáu tình huống thật kèm một dòng lý do mỗi cái.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tưởng <code>docker rm</code> xoá luôn dữ liệu của container. Nó xoá lớp ghi được, và nó chỉ xoá volume <em>vô danh</em> nếu bạn truyền thêm <code>-v</code>. Volume CÓ TÊN sống sót qua <code>docker rm</code>, qua <code>docker compose down</code>, qua cả một lượt <code>docker system prune</code> đầy đủ, và — từ Docker 23 — qua cả <code>docker volume prune</code> trơn, vốn chỉ xoá volume vô danh; bạn phải gọi đích danh <code>docker volume rm &lt;tên&gt;</code>, <code>docker volume prune -a</code>, hoặc <code>docker compose down -v</code>. Sự bất đối xứng đó cứu bạn nhiều hơn hại bạn rất nhiều, nhưng nó cũng khiến câu "tôi xoá sạch rồi mà dữ liệu cũ vẫn quay lại" là chuyện thứ Ba bình thường, và nó cũng có nghĩa là một volume không ai dùng có thể lặng lẽ ôm 40GB suốt một năm. Kiểm bằng <code>docker system df -v</code> trước khi kết luận vấn đề đĩa của bạn nằm ở ảnh.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Lớp ghi được chết theo container, luôn luôn — thứ gì bạn muốn giữ thì phải cố ý đưa vào volume, bind mount hoặc lưu trữ đối tượng. Một <em>volume</em> rỗng gắn đè lên thư mục có sẵn của ảnh sẽ được chép file của ảnh vào một lần; một <em>bind mount</em> thì không bao giờ, và nó che mất thứ đang có ở đó. Và hãy đặt tên cho volume: volume vô danh bảo vệ dữ liệu của bạn rồi cố tình làm cho nó không thể tìm ra.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — Volumes in depth|||7.2 — Volume, đào sâu',
      slug: 'dk-7-2-volume',
      type: 'LESSON',
      description: 'Tạo, xem, đặt nhãn và dọn volume; chúng nằm thật ở đâu trên đĩa; chia sẻ một volume giữa nhiều container; volume chỉ đọc; driver local với tuỳ chọn NFS; và cách tìm ra volume nào đang ăn hết đĩa.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Volumes in depth</h2>
<p class="lead">A volume is a directory on the host that Docker manages for you, plus a name and some metadata. That is genuinely all it is — and knowing exactly where it lives and what <code>inspect</code> tells you turns "the data is somewhere in Docker" into an ordinary directory you can back up, copy and reason about.</p>

<h3>Create, inspect, find on disk</h3>
${slide('dk-07', 8, 'Volume chỉ là một thư mục — trên Mac nó nằm trong máy ảo')}
<pre><code>docker volume create --label app=blog --label env=prod blog-uploads
docker volume inspect blog-uploads</code></pre>
<div class="out">[
    {
        "CreatedAt": "2026-08-22T09:14:03Z",
        "Driver": "local",
        "Labels": { "app": "blog", "env": "prod" },
        "Mountpoint": "/var/lib/docker/volumes/blog-uploads/_data",
        "Name": "blog-uploads",
        "Options": null,
        "Scope": "local"
    }
]</div>
<pre><code><span class="tok-comment"># Mountpoint is a real directory — but it is root-owned and Docker-owned</span>
sudo ls -la /var/lib/docker/volumes/blog-uploads/_data | head -3
docker volume inspect -f '{{ .Mountpoint }}' blog-uploads</code></pre>
<div class="out">total 8
drwxr-xr-x 2 root root 4096 Aug 22 09:14 .
drwx-----x 3 root root 4096 Aug 22 09:14 ..
/var/lib/docker/volumes/blog-uploads/_data</div>
<div class="callout warn"><strong>Do not write into that path from the host.</strong> It works, and it is the wrong habit for three reasons: on Docker Desktop the path does not exist on your machine at all (it is inside a Linux VM), the ownership and SELinux labels you create by hand are frequently wrong, and any tooling that assumes Docker owns the directory can undo your edit. Read it for diagnostics; write through a container (Lesson 7.5).</div>

<h3>Reading docker volume inspect, field by field</h3>
<table>
<tr><th>Field</th><th>What it tells you</th></tr>
<tr><td><code>Name</code></td><td>The handle you use everywhere else. Anonymous volumes get 64 hex characters here.</td></tr>
<tr><td><code>Driver</code></td><td>Who stores the bytes. <code>local</code> = a directory on this host (or anything <code>mount</code> can attach, see below).</td></tr>
<tr><td><code>Mountpoint</code></td><td>The directory on the Docker host. On Linux that is your machine; on Docker Desktop it is inside the Linux VM.</td></tr>
<tr><td><code>Labels</code></td><td>Your own key=value tags, plus Docker's (<code>com.docker.volume.anonymous</code>, <code>com.docker.compose.project</code>…).</td></tr>
<tr><td><code>Options</code></td><td>What was passed with <code>--opt</code> (NFS address, mount type…). <code>null</code> for a plain volume.</td></tr>
<tr><td><code>CreatedAt</code></td><td>When it was created — your best clue when you meet a nameless volume months later.</td></tr>
<tr><td><code>Scope</code></td><td><code>local</code>: exists on this host only. Another machine has no idea this volume exists.</td></tr>
</table>

<h3>Run it step by step: where the directory really is — Linux and Mac</h3>
<p>The same two commands on the two machines this course uses (09/2026):</p>
<pre><code class="language-bash"><span class="tok-comment"># Mac, Docker Desktop 4.91</span>
docker volume inspect -f '{{ .Mountpoint }}' blog-uploads
ls /var/lib/docker/volumes</code></pre>
<div class="out">/var/lib/docker/volumes/blog-uploads/_data
ls: /var/lib/docker/volumes: No such file or directory</div>
<p>Docker reports a path that does not exist on the Mac: it exists inside Docker Desktop's VM. You cannot open it in Finder, and that is fine — you reach the data through a container. On the Linux machine the path is real, but your user cannot read it without <code>sudo</code>:</p>
<pre><code class="language-bash"><span class="tok-comment"># Linux, Docker Engine 29.6, user in the docker group, no sudo</span>
ls -la /var/lib/docker/volumes/blog-uploads/_data
docker run --rm -v /var/lib/docker/volumes/blog-uploads:/v:ro alpine ls -la /v/_data</code></pre>
<div class="out">ls: cannot access '/var/lib/docker/volumes/blog-uploads/_data': Permission denied
total 4
drwxr-xr-x    1 root     root            10 Sep 23 18:20 .
drwx-----x    1 root     root            10 Sep 23 18:20 ..
-rw-r--r--    1 root     root             3 Sep 23 18:20 a.txt</div>
<p>Read the second result carefully: the plain <code>ls</code> was refused, yet a container started by the same user read the root-only directory without any password. Anyone who can run <code>docker</code> can read (and write) anything root can. That is not a bug in volumes; it is what membership of the <code>docker</code> group means (Lesson 6.4). The simpler, portable way to look inside a volume is to mount it by <em>name</em>:</p>
<pre><code class="language-bash">docker run --rm -v blog-uploads:/d:ro alpine:3.20 ls -la /d</code></pre>
<p>That works the same on Linux, Mac and Windows, needs no path, and cannot damage the data because of <code>:ro</code>.</p>

<h3>Labels are how you stay sane at 40 volumes</h3>
${slide('dk-07', 9, 'Nhãn giúp tìm lại — dangling không có nghĩa là rác')}
<pre><code>docker volume ls --filter label=env=prod
docker volume ls --filter dangling=true --format '{{ .Name }}' | head -3
docker volume ls --format 'table {{ .Name }}\\t{{ .Labels }}' | head -4</code></pre>
<div class="out">DRIVER    VOLUME NAME
local     blog-uploads
local     pg-data
8c1d4e9f2a7b3c6d5e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d
NAME            LABELS
blog-uploads    app=blog,env=prod
pg-data         app=blog,env=prod
node-modules    com.docker.compose.project=blog</div>
<p><code>dangling=true</code> means "attached to no container right now" — which is <em>not</em> the same as "unused". A stopped-and-removed container that you are about to recreate leaves its named volume dangling, and it still holds your database. Compose adds its own labels automatically, which is why <code>docker compose down -v</code> can find exactly the volumes belonging to that project and leave everything else alone.</p>
<h3>The filters and format fields you will actually use</h3>
<table>
<tr><th>Flag</th><th>Keeps</th><th>Example</th></tr>
<tr><td><code>--filter name=</code></td><td>Names containing the text (a regex: <code>^</code> and <code>$</code> work)</td><td><code>--filter name=^pgdata$</code></td></tr>
<tr><td><code>--filter label=</code></td><td>Volumes with that label (any value), or that exact <code>key=value</code></td><td><code>--filter label=env=prod</code></td></tr>
<tr><td><code>--filter dangling=</code></td><td><code>true</code>: no container (running or stopped) references it; <code>false</code>: at least one does</td><td><code>--filter dangling=true</code></td></tr>
<tr><td><code>--filter driver=</code></td><td>Volumes of one driver</td><td><code>--filter driver=local</code></td></tr>
<tr><td><code>--format</code></td><td>Your own columns: <code>{{.Name}}</code>, <code>{{.Driver}}</code>, <code>{{.Labels}}</code>, <code>{{.Mountpoint}}</code>, <code>{{.Scope}}</code></td><td><code>--format 'table {{.Name}}\\t{{.Labels}}'</code></td></tr>
<tr><td><code>-q</code></td><td>Names only — for scripts</td><td><code>docker volume ls -q</code></td></tr>
</table>
<p>Several <code>--filter</code> flags are combined with AND. Real output on the course's Mac, filtered to this chapter's test volumes (all created with <code>--label dkhoc=07</code>; the lesson's names are shortened here):</p>
<pre><code class="language-bash">docker volume ls --filter label=dkhoc=07 --filter label=env=prod
docker volume ls --filter label=dkhoc=07 --format 'table {{.Name}}\\t{{.Labels}}'</code></pre>
<div class="out">DRIVER    VOLUME NAME
local     blog-uploads
local     pg-data
VOLUME NAME        LABELS
blog-uploads       app=blog,dkhoc=07,env=prod
pg-data            app=blog,dkhoc=07,env=prod
uploads            dkhoc=07
f23d3ceff2ac…      com.docker.volume.anonymous=,dkhoc=07</div>
<p>The last line is an anonymous volume created with <code>--mount type=volume,dst=/scratch,volume-label=dkhoc=07</code>: even a nameless volume can carry your label, which is the easiest way to find — and safely clean — the volumes an experiment leaves behind.</p>

<h3>Which volume is eating the disk</h3>
${slide('dk-07', 12, 'system df -v chỉ ra volume 0 LINKS')}
<pre><code>docker system df -v 2&gt;/dev/null | sed -n '/Local Volumes space usage/,+6p'</code></pre>
<div class="out">Local Volumes space usage:

VOLUME NAME                                          LINKS     SIZE
pg-data                                              1         3.107GB
blog-uploads                                         1         812.4MB
8c1d4e9f2a7b3c6d5e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c…  0         7.663GB
node-modules                                         1         241.9MB</div>
<div class="callout warn"><strong>That third line is the one to look at.</strong> 7.6GB, zero links, a name nobody can recognise. This is exactly the shape of the disk-full incident recorded in this project's own history — a build cache that grew onto the same disk as Postgres until a deploy died with <code>no space left on device</code>. An anonymous volume with 0 links is the same failure waiting to happen. <code>docker system df -v</code> is the first command to run whenever a server's disk is mysteriously full; <code>docker volume prune</code> removes <em>anonymous</em> volumes with no links (add <code>-a</code> for named ones too), and asks first.</div>
<h3>Run it step by step: reading system df on a real laptop</h3>
<p>The output above is an illustration. Here is the real thing from the course's own Mac (09/2026), which has been used for many projects — the summary first, then the volume section of <code>-v</code>:</p>
<pre><code class="language-bash">docker system df
docker system df -v</code></pre>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          90        19        42.97GB   30.29GB (70%)
Containers      34        7         882.5MB   553.7MB (62%)
Local Volumes   71        24        14.38GB   4.051GB (28%)
Build Cache     579       1         39.27GB   21.09GB
…
Local Volumes space usage:

VOLUME NAME                                                        LINKS     SIZE
…
d6ca5185fd050830fdb750794b8e025d0e714ac01ca7e339f9eae4a423933e58   0         1.765GB
…</div>
<table>
<tr><th>Column</th><th>Meaning</th></tr>
<tr><td><code>TOTAL</code> / <code>ACTIVE</code></td><td>How many exist / how many are used by a container right now</td></tr>
<tr><td><code>RECLAIMABLE</code></td><td>What a prune could free. For volumes: the size of volumes with no links</td></tr>
<tr><td><code>LINKS</code></td><td>How many containers (running <em>or stopped</em>) reference this volume</td></tr>
<tr><td><code>SIZE</code></td><td>Measured by walking the files — so <code>df -v</code> can take a while on a big machine</td></tr>
</table>
<p>That 1.765GB volume with 0 links is exactly the pattern of this lesson: a real anonymous volume, left behind by some old experiment, that nobody can identify by name. Before deciding, look — without touching it: <code>docker volume inspect &lt;name&gt; --format '{{.CreatedAt}} {{json .Labels}}'</code> for its age and labels, and <code>docker run --rm -v &lt;name&gt;:/d:ro alpine ls -la /d</code> for its contents (a <code>PG_VERSION</code> file means it is a Postgres data directory). Only then remove it, by name. (The course did not remove it: it belongs to another project on that laptop.)</p>

<h3>Sharing one volume between containers</h3>
${slide('dk-07', 11, 'Chia sẻ một volume: một bên ghi, bên kia đọc :ro')}
<pre><code><span class="tok-comment"># A writer and a reader on the same volume</span>
docker run -d --name writer -v shared:/data alpine:3.20 \\
  sh -c 'while true; do date &gt;&gt; /data/log.txt; sleep 2; done'
docker run --rm -v shared:/data:ro alpine:3.20 sh -c 'sleep 5; tail -2 /data/log.txt'</code></pre>
<div class="out">Fri Aug 22 09:22:11 UTC 2026
Fri Aug 22 09:22:13 UTC 2026</div>
<pre><code><span class="tok-comment"># The reader really is read-only</span>
docker run --rm -v shared:/data:ro alpine:3.20 touch /data/nope</code></pre>
<div class="out">touch: /data/nope: Read-only file system</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Sharing works, coordination does not</span><span class="v">Two containers writing the same file get exactly the behaviour two processes writing the same file get: whatever the filesystem gives you, with no locking added by Docker. Fine for append-only logs, dangerous for anything else.</span></div>
  <div class="kv"><span class="k">Never share a database directory</span><span class="v">Two Postgres instances on one data directory will corrupt it. Postgres has a lock file that usually stops this, and "usually" is doing a lot of work in that sentence.</span></div>
  <div class="kv"><span class="k"><code>:ro</code> is a good default</span><span class="v">If a container only reads, say so. It converts a class of bug into an immediate, obvious error rather than silent corruption discovered next week.</span></div>
  <div class="kv"><span class="k"><code>--volumes-from</code></span><span class="v">Inherits every mount of another container. Legacy, largely replaced by named volumes, but you will meet it in older backup recipes.</span></div>
</div>
<p class="note-ct">Re-run on the course's Mac, Docker 29.8 (09/2026): the reader printed <code>Wed Sep 23 18:21:31 UTC 2026</code> and <code>Wed Sep 23 18:21:33 UTC 2026</code> — two lines two seconds apart, and the <code>touch</code> failed with the same <code>Read-only file system</code>. The times are UTC because alpine has no time zone configured, whatever your laptop says.</p>

<h3>The local driver does more than local</h3>
<pre><code><span class="tok-comment"># An NFS share, as a volume, using only the built-in local driver</span>
docker volume create --driver local \\
  --opt type=nfs \\
  --opt o=addr=10.0.0.7,rw,nfsvers=4 \\
  --opt device=:/exports/media  media-nfs

<span class="tok-comment"># See the options Docker stored</span>
docker volume inspect -f '{{ json .Options }}' media-nfs</code></pre>
<div class="out">{"device":":/exports/media","o":"addr=10.0.0.7,rw,nfsvers=4","type":"nfs"}</div>
<p>The <code>local</code> driver passes its options straight to <code>mount(8)</code>, which means anything the host kernel can mount can be a volume: NFS, CIFS, a bind to another path, a loop-mounted image. That covers most of what people install third-party volume plugins for. For a single VPS, plain local volumes plus a backup job is the right amount of machinery.</p>
<h3>Run it step by step: creating succeeds, mounting fails later</h3>
<p>The block above has one trap the output does not show: <code>docker volume create</code> with NFS options does not contact the server at all. It only stores the options. The real mount happens when a container first uses the volume — and if the address is wrong, that is where it fails, slowly. Real run on the course's Mac with an address that does not exist:</p>
<pre><code class="language-bash">docker volume create --driver local --opt type=nfs \\
  --opt o=addr=10.0.0.7,rw,nfsvers=4 --opt device=:/exports/media media-nfs   <span class="tok-comment"># instant</span>
time docker run --rm -v media-nfs:/m alpine:3.20 ls /m</code></pre>
<div class="out">media-nfs
docker: Error response from daemon: error while mounting volume '/var/lib/docker/volumes/media-nfs/_data': failed to mount local volume: mount :/exports/media:/var/lib/docker/volumes/media-nfs/_data, data: addr=10.0.0.7,nfsvers=4: connection refused
… 2:30.15 total</div>
<p>Two and a half minutes before the error. In a compose stack that means a service "hangs on start" with nothing in its own logs — the problem is the volume, not the app. Test a network volume by hand with a throwaway container like this before you put it in a compose file.</p>

<h3>Removing volumes, safely</h3>
${slide('dk-07', 10, 'docker volume prune chỉ xoá volume VÔ DANH (từ Docker 23)')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">docker volume rm &lt;name&gt;</span><span class="lz-t">refuses while a container still references it</span><span class="lz-d">Including stopped containers. <code>docker ps -a --filter volume=&lt;name&gt;</code> tells you who is holding it.</span></div>
  <div class="lz-step"><span class="lz-k">docker volume prune</span><span class="lz-t">removes ANONYMOUS volumes with no links, after confirmation</span><span class="lz-d">Since Docker 23 (API 1.42) named volumes are left alone unless you add <code>-a</code>/<code>--all</code>. Add <code>--filter label!=keep</code> or <code>--all</code> deliberately. This is a real delete with no undo — read the list it prints before typing y.</span></div>
  <div class="lz-step"><span class="lz-k">docker rm -v &lt;container&gt;</span><span class="lz-t">also removes that container's ANONYMOUS volumes</span><span class="lz-d">Named volumes are untouched. This is the flag people forget, which is why anonymous volumes accumulate.</span></div>
  <div class="lz-step"><span class="lz-k">docker compose down -v</span><span class="lz-t">removes volumes declared in that compose file</span><span class="lz-d">Project-scoped, so it will not touch your other stacks. Still: this is the command that deletes a development database, and the flag is one character.</span></div>
</div>

<h3>Run it step by step: what prune really removes</h3>
<p>Never try prune on a machine with real data without a filter. With a label filter it is safe to watch (course's Mac; three named volumes and one anonymous volume, all labelled <code>dkhoc=07</code>, none used by a container):</p>
<pre><code class="language-bash">docker volume prune --filter label=dkhoc=07
docker volume ls --filter label=dkhoc=07 --format '{{.Name}}'
docker volume prune -a --filter label=dkhoc=07     <span class="tok-comment"># answered N</span></code></pre>
<div class="out">WARNING! This will remove anonymous local volumes not used by at least one container.
Are you sure you want to continue? [y/N] y
Deleted Volumes:
f23d3ceff2ace768139dfc44171513c7676a5e86c4d7f44fbb5d37c9c6788f1b

Total reclaimed space: 0B
blog-uploads
pg-data
uploads
WARNING! This will remove all local volumes not used by at least one container.
Are you sure you want to continue? [y/N]</div>
<p>The warning text itself tells you which mode you are in: <em>anonymous</em> local volumes, or <em>all</em> local volumes. And it never lists names before asking — only afterwards. That is why the habit is: <code>docker volume ls</code> with the same filters first, read the list, then prune.</p>
<p>And the refusal you will meet when something still holds a volume:</p>
<pre><code class="language-bash">docker volume rm pg-data
docker ps -a --filter volume=pg-data --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">Error response from daemon: remove pg-data: volume is in use - [9caba9dd585edb27ac891ca2a6fd00182c07e3f3fdf63e62b090bf199546ab81]
holder Up 22 seconds</div>
<p>The ID in brackets is the container holding it; <code>--filter volume=</code> turns that ID into a name. A <em>stopped</em> container holds a volume just as firmly as a running one.</p>
<table>
<tr><th>Command</th><th>Named volumes</th><th>Anonymous volumes</th><th>Asks first?</th></tr>
<tr><td><code>docker volume rm NAME</code></td><td>That one (refuses if in use)</td><td>That one</td><td>No</td></tr>
<tr><td><code>docker volume prune</code></td><td>Kept</td><td>Unused ones removed</td><td>Yes (<code>-f</code> skips)</td></tr>
<tr><td><code>docker volume prune -a</code></td><td>Unused ones removed</td><td>Unused ones removed</td><td>Yes</td></tr>
<tr><td><code>docker rm -v CONTAINER</code></td><td>Kept</td><td>That container's removed</td><td>No</td></tr>
<tr><td><code>docker run --rm …</code></td><td>Kept</td><td>Removed when the container exits</td><td>No</td></tr>
<tr><td><code>docker system prune --volumes</code></td><td>Kept</td><td>Unused ones removed</td><td>Yes</td></tr>
<tr><td><code>docker compose down -v</code></td><td>That project's removed</td><td>That project's removed</td><td>No</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the VPS for your group project reports <code>no space left on device</code>. You must find what is using the space and free it — without touching the Postgres volume the demo needs tomorrow.</p><ol>
<li>Set the scene: a labelled "database" volume held by a stopped container, a labelled cache volume, and an anonymous volume that carries your label (block below).</li>
<li>Find the space: <code>docker system df -v | grep -E "thu-|LINKS"</code> and <code>docker volume ls --filter label=nhom=swp</code>. Which volumes have 0 links?</li>
<li>Try <code>docker volume rm thu-db</code>. Read the error and name the container holding it with <code>docker ps -a --filter volume=thu-db</code>.</li>
<li>Run <code>docker volume ls --filter label=nhom=swp --filter dangling=true</code>, then <code>docker volume prune -f --filter label=nhom=swp</code>. Which volumes are gone, which are left, and why?</li>
<li>Clean up by name: <code>docker rm thu-giu</code>, then <code>docker volume rm thu-db thu-cache</code>.</li></ol>
<pre><code class="language-bash">docker volume create --label nhom=swp thu-db
docker volume create --label nhom=swp thu-cache
docker run --name thu-giu -v thu-db:/d alpine:3.20 sh -c 'dd if=/dev/zero of=/d/data bs=1M count=30'
docker run --rm -v thu-cache:/d alpine:3.20 sh -c 'dd if=/dev/zero of=/d/c bs=1M count=20'
docker run --name thu-anon --mount type=volume,dst=/tmp/x,volume-label=nhom=swp alpine:3.20 true
docker rm thu-anon            <span class="tok-comment"># its anonymous volume is now dangling</span></code></pre>
<p><strong>Done when:</strong> <code>volume rm thu-db</code> was refused and you named <code>thu-giu</code> as the holder; the prune removed exactly the anonymous volume while <code>thu-cache</code> (dangling but named) survived; and after cleanup <code>docker volume ls --filter label=nhom=swp</code> is empty.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mountpoint</span><span class="v">The real directory of a volume on the Docker host (inside the VM on Docker Desktop).</span></div>
  <div class="kv"><span class="k">Label</span><span class="v">A key=value tag on a volume, used to find and filter it later.</span></div>
  <div class="kv"><span class="k">Dangling</span><span class="v">No container, running or stopped, references the volume right now — not the same as "garbage".</span></div>
  <div class="kv"><span class="k">LINKS</span><span class="v">The <code>system df -v</code> column counting containers that reference a volume.</span></div>
  <div class="kv"><span class="k">Prune</span><span class="v">Bulk delete of unused objects; for volumes, anonymous only unless <code>-a</code>.</span></div>
  <div class="kv"><span class="k">Volume driver</span><span class="v">The component that stores a volume; <code>local</code> can also mount NFS/CIFS via <code>--opt</code>.</span></div>
  <div class="kv"><span class="k">Scope: local</span><span class="v">The volume exists on this host only; other machines cannot see it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A volume is a directory under <code>/var/lib/docker/volumes/</code> on the Docker host — inside the VM on a Mac; look inside with <code>docker run --rm -v NAME:/d:ro alpine ls /d</code>.</li>
<li>Labels plus <code>--filter</code> answer "what belongs to this app"; filters combine with AND.</li>
<li><code>dangling=true</code> means "no container references it now", which includes the database you are about to reattach.</li>
<li>Since Docker 23, <code>docker volume prune</code> removes only anonymous volumes; <code>-a</code> includes named ones — always filter and list first.</li>
<li><code>docker system df -v</code> finds the big 0-link volume; inspect its age and contents before deleting it by name.</li>
<li>Network volumes (NFS) are only mounted when a container starts — a wrong address shows up as a slow start failure.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/storage/volumes/" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Volumes</span><span class="lc-sub">Creation, sharing, read-only mounts, driver options including the NFS and CIFS recipes, and the backup/restore patterns expanded in Lesson 7.5.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/system/df/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">docker system df</span><span class="lc-sub">The <code>-v</code> flag breaks the total down by image, container and volume. The command to reach for before deleting anything to reclaim disk.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: manage volumes</span><span class="lc-sub">Graded exercises: label a volume and find it by filter, identify which volume holds 7GB and whether it is safe to delete, share one volume read-write and read-only, and explain why <code>docker volume rm</code> refused.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> reading <code>dangling=true</code> as "safe to delete". It means no <em>running or existing</em> container references the volume right now. Recreate a container from a compose file and the volume is instantly in use again with all your data — that is the normal upgrade path, not an accident. The volumes that are genuinely garbage have three properties together: no links, an anonymous 64-hex name, and a creation date you can trace to an experiment. Before pruning on a server with real data, run <code>docker volume ls --filter dangling=true</code>, read the list, and confirm each name. A prune that removes a named volume you were about to reattach is not recoverable, and Docker's confirmation prompt shows you a count, not the names. (Since Docker 23 that takes <code>docker volume prune -a</code> — a plain prune leaves named volumes alone — but old scripts and old tutorials still use the flag.)</div>
<p class="note-ct"><strong>Three things to remember.</strong> A volume is just a managed directory — <code>docker volume inspect -f '{{ .Mountpoint }}'</code> tells you exactly which one, which makes backups and diagnostics ordinary work. Label your volumes so <code>ls --filter</code> answers "what belongs to this app" six months later. And <code>docker system df -v</code> before you blame images for a full disk: an anonymous volume with zero links is a very common several-gigabyte surprise.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Volume, đào sâu</h2>
<p class="lead">Một volume là một thư mục trên máy chủ do Docker quản hộ bạn, cộng thêm một cái tên và ít siêu dữ liệu. Nó thật sự chỉ có thế — và biết chính xác nó nằm ở đâu cùng với việc <code>inspect</code> nói gì sẽ biến "dữ liệu nằm đâu đó trong Docker" thành một thư mục bình thường mà bạn sao lưu, chép và suy luận được.</p>

<h3>Tạo, xem, tìm trên đĩa</h3>
${slide('dk-07', 8, 'Volume chỉ là một thư mục — trên Mac nó nằm trong máy ảo')}
<pre><code>docker volume create --label app=blog --label env=prod blog-uploads
docker volume inspect blog-uploads</code></pre>
<div class="out">[
    {
        "CreatedAt": "2026-08-22T09:14:03Z",
        "Driver": "local",
        "Labels": { "app": "blog", "env": "prod" },
        "Mountpoint": "/var/lib/docker/volumes/blog-uploads/_data",
        "Name": "blog-uploads",
        "Options": null,
        "Scope": "local"
    }
]</div>
<pre><code><span class="tok-comment"># Mountpoint là một thư mục thật — nhưng root sở hữu, và Docker sở hữu</span>
sudo ls -la /var/lib/docker/volumes/blog-uploads/_data | head -3
docker volume inspect -f '{{ .Mountpoint }}' blog-uploads</code></pre>
<div class="out">total 8
drwxr-xr-x 2 root root 4096 Aug 22 09:14 .
drwx-----x 3 root root 4096 Aug 22 09:14 ..
/var/lib/docker/volumes/blog-uploads/_data</div>
<div class="callout warn"><strong>Đừng ghi vào đường dẫn đó từ máy chủ.</strong> Nó chạy được, và đó là thói quen sai vì ba lý do: trên Docker Desktop đường dẫn ấy không hề tồn tại trên máy bạn (nó nằm trong một máy ảo Linux), quyền sở hữu và nhãn SELinux bạn tự tạo bằng tay thường sai, và bất cứ công cụ nào mặc định Docker sở hữu thư mục đó đều có thể xoá sạch chỗ bạn vừa sửa. Hãy ĐỌC nó để chẩn đoán; còn GHI thì ghi qua một container (Bài 7.5).</div>

<h3>Đọc docker volume inspect, từng trường một</h3>
<table>
<tr><th>Trường</th><th>Nói với bạn điều gì</th></tr>
<tr><td><code>Name</code></td><td>Cái tên bạn dùng ở mọi lệnh khác. Volume vô danh thì ở đây là 64 ký tự hex.</td></tr>
<tr><td><code>Driver</code></td><td>Ai cất giữ byte. <code>local</code> = một thư mục trên máy này (hoặc bất cứ thứ gì <code>mount</code> gắn được, xem dưới).</td></tr>
<tr><td><code>Mountpoint</code></td><td>Thư mục trên máy chạy Docker. Trên Linux đó là máy bạn; trên Docker Desktop nó nằm TRONG máy ảo Linux.</td></tr>
<tr><td><code>Labels</code></td><td>Các nhãn key=value của bạn, cộng nhãn của Docker (<code>com.docker.volume.anonymous</code>, <code>com.docker.compose.project</code>…).</td></tr>
<tr><td><code>Options</code></td><td>Những gì truyền qua <code>--opt</code> (địa chỉ NFS, kiểu mount…). <code>null</code> với volume thường.</td></tr>
<tr><td><code>CreatedAt</code></td><td>Tạo lúc nào — manh mối tốt nhất khi vài tháng sau bạn gặp một volume không tên.</td></tr>
<tr><td><code>Scope</code></td><td><code>local</code>: chỉ tồn tại trên máy này. Máy khác không hề biết volume này có.</td></tr>
</table>

<h3>Chạy thử từng bước: thư mục thật nằm ở đâu — trên Linux và trên Mac</h3>
<p>Cùng hai lệnh, trên hai máy khoá học dùng (09/2026):</p>
<pre><code class="language-bash"><span class="tok-comment"># Mac, Docker Desktop 4.91</span>
docker volume inspect -f '{{ .Mountpoint }}' blog-uploads
ls /var/lib/docker/volumes</code></pre>
<div class="out">/var/lib/docker/volumes/blog-uploads/_data
ls: /var/lib/docker/volumes: No such file or directory</div>
<p>Docker báo một đường dẫn KHÔNG có trên máy Mac: nó nằm trong máy ảo của Docker Desktop. Bạn không mở được bằng Finder, và điều đó không sao — bạn đi tới dữ liệu qua một container. Trên máy Linux đường dẫn là thật, nhưng người dùng của bạn không đọc được nếu không có <code>sudo</code>:</p>
<pre><code class="language-bash"><span class="tok-comment"># Linux, Docker Engine 29.6, người dùng thuộc nhóm docker, không sudo</span>
ls -la /var/lib/docker/volumes/blog-uploads/_data
docker run --rm -v /var/lib/docker/volumes/blog-uploads:/v:ro alpine ls -la /v/_data</code></pre>
<div class="out">ls: cannot access '/var/lib/docker/volumes/blog-uploads/_data': Permission denied
total 4
drwxr-xr-x    1 root     root            10 Sep 23 18:20 .
drwx-----x    1 root     root            10 Sep 23 18:20 ..
-rw-r--r--    1 root     root             3 Sep 23 18:20 a.txt</div>
<p>Đọc kỹ kết quả thứ hai: lệnh <code>ls</code> thường bị từ chối, vậy mà một container do CHÍNH người dùng đó khởi động lại đọc được thư mục chỉ-root, không cần mật khẩu nào. Ai chạy được <code>docker</code> là đọc (và ghi) được mọi thứ root làm được. Đó không phải lỗi của volume; đó là ý nghĩa của việc thuộc nhóm <code>docker</code> (Bài 6.4). Cách đơn giản và chạy ở mọi nơi để nhìn vào một volume là gắn nó theo TÊN:</p>
<pre><code class="language-bash">docker run --rm -v blog-uploads:/d:ro alpine:3.20 ls -la /d</code></pre>
<p>Lệnh đó chạy y hệt trên Linux, Mac và Windows, không cần đường dẫn, và không làm hỏng dữ liệu được nhờ <code>:ro</code>.</p>

<h3>Nhãn là cách bạn còn tỉnh táo khi có 40 volume</h3>
${slide('dk-07', 9, 'Nhãn giúp tìm lại — dangling không có nghĩa là rác')}
<pre><code>docker volume ls --filter label=env=prod
docker volume ls --filter dangling=true --format '{{ .Name }}' | head -3
docker volume ls --format 'table {{ .Name }}\\t{{ .Labels }}' | head -4</code></pre>
<div class="out">DRIVER    VOLUME NAME
local     blog-uploads
local     pg-data
8c1d4e9f2a7b3c6d5e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d
NAME            LABELS
blog-uploads    app=blog,env=prod
pg-data         app=blog,env=prod
node-modules    com.docker.compose.project=blog</div>
<p><code>dangling=true</code> nghĩa là "hiện không gắn với container nào" — thứ <em>không</em> đồng nghĩa với "không dùng tới". Một container đã dừng và đã xoá mà bạn sắp dựng lại sẽ để volume có tên của nó ở trạng thái dangling, và nó vẫn đang ôm cơ sở dữ liệu của bạn. Compose tự thêm nhãn riêng, nên <code>docker compose down -v</code> tìm được đúng những volume thuộc dự án đó và để yên mọi thứ khác.</p>
<h3>Những bộ lọc và trường format bạn sẽ thật sự dùng</h3>
<table>
<tr><th>Cờ</th><th>Giữ lại</th><th>Ví dụ</th></tr>
<tr><td><code>--filter name=</code></td><td>Tên có chứa chuỗi đó (là regex: <code>^</code> và <code>$</code> dùng được)</td><td><code>--filter name=^pgdata$</code></td></tr>
<tr><td><code>--filter label=</code></td><td>Volume có nhãn đó (giá trị nào cũng được), hoặc đúng <code>key=value</code></td><td><code>--filter label=env=prod</code></td></tr>
<tr><td><code>--filter dangling=</code></td><td><code>true</code>: không container nào (đang chạy hay đã dừng) tham chiếu; <code>false</code>: có ít nhất một</td><td><code>--filter dangling=true</code></td></tr>
<tr><td><code>--filter driver=</code></td><td>Volume của một driver</td><td><code>--filter driver=local</code></td></tr>
<tr><td><code>--format</code></td><td>Cột tự chọn: <code>{{.Name}}</code>, <code>{{.Driver}}</code>, <code>{{.Labels}}</code>, <code>{{.Mountpoint}}</code>, <code>{{.Scope}}</code></td><td><code>--format 'table {{.Name}}\\t{{.Labels}}'</code></td></tr>
<tr><td><code>-q</code></td><td>Chỉ in tên — dùng trong script</td><td><code>docker volume ls -q</code></td></tr>
</table>
<p>Nhiều cờ <code>--filter</code> ghép với nhau theo kiểu VÀ (AND). Output thật trên máy Mac của khoá, lọc chỉ các volume thử của chương này (tạo kèm <code>--label dkhoc=07</code>; tên đã rút gọn như trong bài):</p>
<pre><code class="language-bash">docker volume ls --filter label=dkhoc=07 --filter label=env=prod
docker volume ls --filter label=dkhoc=07 --format 'table {{.Name}}\\t{{.Labels}}'</code></pre>
<div class="out">DRIVER    VOLUME NAME
local     blog-uploads
local     pg-data
VOLUME NAME        LABELS
blog-uploads       app=blog,dkhoc=07,env=prod
pg-data            app=blog,dkhoc=07,env=prod
uploads            dkhoc=07
f23d3ceff2ac…      com.docker.volume.anonymous=,dkhoc=07</div>
<p>Dòng cuối là một volume vô danh tạo bằng <code>--mount type=volume,dst=/scratch,volume-label=dkhoc=07</code>: kể cả volume không tên cũng mang được nhãn của bạn, và đó là cách dễ nhất để tìm — rồi dọn an toàn — những volume mà một lần thử nghiệm bỏ lại.</p>

<h3>Volume nào đang ăn hết đĩa</h3>
${slide('dk-07', 12, 'system df -v chỉ ra volume 0 LINKS')}
<pre><code>docker system df -v 2&gt;/dev/null | sed -n '/Local Volumes space usage/,+6p'</code></pre>
<div class="out">Local Volumes space usage:

VOLUME NAME                                          LINKS     SIZE
pg-data                                              1         3.107GB
blog-uploads                                         1         812.4MB
8c1d4e9f2a7b3c6d5e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c…  0         7.663GB
node-modules                                         1         241.9MB</div>
<div class="callout warn"><strong>Dòng thứ ba mới là dòng cần nhìn.</strong> 7,6GB, không link nào, một cái tên không ai nhận ra. Đây đúng hình dạng của sự cố hết đĩa ghi trong lịch sử chính dự án này — một cache dựng phình ra trên đúng cái đĩa chứa Postgres cho tới khi một lượt deploy chết với <code>no space left on device</code>. Một volume vô danh với 0 link là đúng thất bại đó đang chờ xảy ra. <code>docker system df -v</code> là lệnh đầu tiên phải chạy mỗi khi đĩa của một máy chủ đầy một cách khó hiểu; <code>docker volume prune</code> xoá những volume <em>vô danh</em> không có link (thêm <code>-a</code> thì xoá cả volume có tên), và có hỏi trước.</div>
<h3>Chạy thử từng bước: đọc system df trên một laptop thật</h3>
<p>Output ở trên là minh hoạ. Đây là bản thật từ chính máy Mac của khoá (09/2026), máy đã chạy rất nhiều dự án — phần tổng trước, rồi mục volume của <code>-v</code>:</p>
<pre><code class="language-bash">docker system df
docker system df -v</code></pre>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          90        19        42.97GB   30.29GB (70%)
Containers      34        7         882.5MB   553.7MB (62%)
Local Volumes   71        24        14.38GB   4.051GB (28%)
Build Cache     579       1         39.27GB   21.09GB
…
Local Volumes space usage:

VOLUME NAME                                                        LINKS     SIZE
…
d6ca5185fd050830fdb750794b8e025d0e714ac01ca7e339f9eae4a423933e58   0         1.765GB
…</div>
<table>
<tr><th>Cột</th><th>Nghĩa</th></tr>
<tr><td><code>TOTAL</code> / <code>ACTIVE</code></td><td>Có bao nhiêu cái / bao nhiêu cái đang được container dùng lúc này</td></tr>
<tr><td><code>RECLAIMABLE</code></td><td>Lượng prune có thể giải phóng. Với volume: dung lượng các volume không link</td></tr>
<tr><td><code>LINKS</code></td><td>Số container (đang chạy <em>hoặc đã dừng</em>) tham chiếu tới volume này</td></tr>
<tr><td><code>SIZE</code></td><td>Đo bằng cách duyệt từng file — nên <code>df -v</code> có thể chạy lâu trên máy lớn</td></tr>
</table>
<p>Cái volume 1,765GB với 0 link đó đúng là hình mẫu của bài này: một volume vô danh THẬT, bị một lần thử nghiệm cũ bỏ lại, không ai nhận ra nó qua tên. Trước khi quyết, hãy NHÌN — không đụng vào: <code>docker volume inspect &lt;tên&gt; --format '{{.CreatedAt}} {{json .Labels}}'</code> để biết tuổi và nhãn, và <code>docker run --rm -v &lt;tên&gt;:/d:ro alpine ls -la /d</code> để xem bên trong (thấy file <code>PG_VERSION</code> nghĩa là thư mục data của Postgres). Chỉ khi đó mới xoá, theo tên. (Khoá học không xoá nó: nó thuộc về một dự án khác trên laptop đó.)</p>

<h3>Chia sẻ một volume giữa nhiều container</h3>
${slide('dk-07', 11, 'Chia sẻ một volume: một bên ghi, bên kia đọc :ro')}
<pre><code><span class="tok-comment"># Một bên ghi và một bên đọc trên cùng volume</span>
docker run -d --name writer -v shared:/data alpine:3.20 \\
  sh -c 'while true; do date &gt;&gt; /data/log.txt; sleep 2; done'
docker run --rm -v shared:/data:ro alpine:3.20 sh -c 'sleep 5; tail -2 /data/log.txt'</code></pre>
<div class="out">Fri Aug 22 09:22:11 UTC 2026
Fri Aug 22 09:22:13 UTC 2026</div>
<pre><code><span class="tok-comment"># Bên đọc đúng là chỉ đọc thật</span>
docker run --rm -v shared:/data:ro alpine:3.20 touch /data/nope</code></pre>
<div class="out">touch: /data/nope: Read-only file system</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Chia sẻ thì được, phối hợp thì không</span><span class="v">Hai container cùng ghi một file nhận đúng hành vi của hai tiến trình cùng ghi một file: hệ thống file cho gì được nấy, Docker không thêm khoá nào cả. Ổn với log chỉ ghi nối, nguy hiểm với mọi thứ khác.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ chia sẻ thư mục cơ sở dữ liệu</span><span class="v">Hai instance Postgres trên cùng một thư mục dữ liệu sẽ làm hỏng nó. Postgres có file khoá thường thì chặn được chuyện này, và chữ "thường thì" ở đây đang gánh rất nặng.</span></div>
  <div class="kv"><span class="k"><code>:ro</code> là mặc định tốt</span><span class="v">Nếu một container chỉ đọc thì hãy nói ra. Nó biến cả một lớp lỗi thành một thông báo lỗi tức thì và rõ ràng, thay vì hỏng dữ liệu âm thầm và tuần sau mới phát hiện.</span></div>
  <div class="kv"><span class="k"><code>--volumes-from</code></span><span class="v">Kế thừa mọi phép gắn của một container khác. Cũ, phần lớn đã bị volume có tên thay thế, nhưng bạn sẽ gặp nó trong những công thức sao lưu đời trước.</span></div>
</div>
<p class="note-ct">Chạy lại trên máy Mac của khoá, Docker 29.8 (09/2026): bên đọc in <code>Wed Sep 23 18:21:31 UTC 2026</code> và <code>Wed Sep 23 18:21:33 UTC 2026</code> — hai dòng cách nhau hai giây, và <code>touch</code> thất bại với đúng <code>Read-only file system</code>. Giờ in theo UTC vì ảnh alpine không cài múi giờ, bất kể laptop của bạn đang ở múi nào.</p>

<h3>Driver local làm được nhiều hơn chữ "local"</h3>
<pre><code><span class="tok-comment"># Một chia sẻ NFS, dưới dạng volume, chỉ bằng driver local có sẵn</span>
docker volume create --driver local \\
  --opt type=nfs \\
  --opt o=addr=10.0.0.7,rw,nfsvers=4 \\
  --opt device=:/exports/media  media-nfs

<span class="tok-comment"># Xem tuỳ chọn đã lưu</span>
docker volume inspect -f '{{ json .Options }}' media-nfs</code></pre>
<div class="out">{"device":":/exports/media","o":"addr=10.0.0.7,rw,nfsvers=4","type":"nfs"}</div>
<p>Driver <code>local</code> truyền thẳng tuỳ chọn xuống <code>mount(8)</code>, nghĩa là bất cứ thứ gì nhân của máy chủ gắn được đều làm volume được: NFS, CIFS, bind sang một đường dẫn khác, một file ảnh gắn qua loop. Chừng đó bao phủ phần lớn lý do người ta đi cài plugin volume của bên thứ ba. Với một con VPS đơn lẻ, volume local thuần cộng một việc sao lưu là đúng lượng máy móc cần thiết.</p>
<h3>Chạy thử từng bước: tạo thì thành công, gắn thì hỏng sau</h3>
<p>Khối lệnh ở trên có một cái bẫy mà output không cho thấy: <code>docker volume create</code> với tuỳ chọn NFS không hề liên lạc với máy chủ NFS. Nó chỉ LƯU tuỳ chọn. Việc gắn thật xảy ra khi một container dùng volume lần đầu — và nếu địa chỉ sai, nó hỏng ở đó, rất chậm. Chạy thật trên máy Mac của khoá với một địa chỉ không tồn tại:</p>
<pre><code class="language-bash">docker volume create --driver local --opt type=nfs \\
  --opt o=addr=10.0.0.7,rw,nfsvers=4 --opt device=:/exports/media media-nfs   <span class="tok-comment"># tức thì</span>
time docker run --rm -v media-nfs:/m alpine:3.20 ls /m</code></pre>
<div class="out">media-nfs
docker: Error response from daemon: error while mounting volume '/var/lib/docker/volumes/media-nfs/_data': failed to mount local volume: mount :/exports/media:/var/lib/docker/volumes/media-nfs/_data, data: addr=10.0.0.7,nfsvers=4: connection refused
… 2:30.15 total</div>
<p>Hai phút rưỡi mới ra lỗi. Trong một stack compose, điều đó nghĩa là một dịch vụ "treo lúc khởi động" mà log của chính nó không có dòng nào — vấn đề nằm ở volume, không phải ở ứng dụng. Hãy thử một volume mạng bằng tay với một container dùng xong vứt như thế này trước khi đưa nó vào file compose.</p>

<h3>Xoá volume, an toàn</h3>
${slide('dk-07', 10, 'docker volume prune chỉ xoá volume VÔ DANH (từ Docker 23)')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">docker volume rm &lt;tên&gt;</span><span class="lz-t">từ chối khi còn container tham chiếu tới nó</span><span class="lz-d">Kể cả container đã dừng. <code>docker ps -a --filter volume=&lt;tên&gt;</code> cho bạn biết ai đang giữ.</span></div>
  <div class="lz-step"><span class="lz-k">docker volume prune</span><span class="lz-t">xoá volume VÔ DANH không có link, sau khi xác nhận</span><span class="lz-d">Từ Docker 23 (API 1.42) volume có tên được để yên trừ khi bạn thêm <code>-a</code>/<code>--all</code>. Thêm <code>--filter label!=keep</code> hoặc <code>--all</code> một cách có chủ đích. Đây là xoá thật và không hoàn tác được — hãy đọc danh sách nó in ra trước khi gõ y.</span></div>
  <div class="lz-step"><span class="lz-k">docker rm -v &lt;container&gt;</span><span class="lz-t">xoá luôn các volume VÔ DANH của container đó</span><span class="lz-d">Volume có tên không bị đụng tới. Đây là cái cờ người ta hay quên, và đó là lý do volume vô danh cứ tích lại.</span></div>
  <div class="lz-step"><span class="lz-k">docker compose down -v</span><span class="lz-t">xoá các volume khai trong file compose đó</span><span class="lz-d">Giới hạn trong phạm vi dự án, nên nó không đụng tới các stack khác của bạn. Dù vậy: đây chính là lệnh xoá một cơ sở dữ liệu phát triển, và cái cờ chỉ dài một ký tự.</span></div>
</div>

<h3>Chạy thử từng bước: prune thật ra xoá gì</h3>
<p>Đừng bao giờ thử prune trên máy có dữ liệu thật mà không có bộ lọc. Có bộ lọc nhãn thì xem an toàn (máy Mac của khoá; ba volume có tên và một volume vô danh, đều mang nhãn <code>dkhoc=07</code>, không container nào dùng):</p>
<pre><code class="language-bash">docker volume prune --filter label=dkhoc=07
docker volume ls --filter label=dkhoc=07 --format '{{.Name}}'
docker volume prune -a --filter label=dkhoc=07     <span class="tok-comment"># trả lời N</span></code></pre>
<div class="out">WARNING! This will remove anonymous local volumes not used by at least one container.
Are you sure you want to continue? [y/N] y
Deleted Volumes:
f23d3ceff2ace768139dfc44171513c7676a5e86c4d7f44fbb5d37c9c6788f1b

Total reclaimed space: 0B
blog-uploads
pg-data
uploads
WARNING! This will remove all local volumes not used by at least one container.
Are you sure you want to continue? [y/N]</div>
<p>Chính câu cảnh báo cho bạn biết mình đang ở chế độ nào: <em>anonymous</em> local volumes (volume vô danh), hay <em>all</em> local volumes (mọi volume). Và nó không bao giờ liệt kê tên TRƯỚC khi hỏi — chỉ in sau khi đã xoá. Vì thế thói quen đúng là: chạy <code>docker volume ls</code> với đúng bộ lọc đó trước, đọc danh sách, rồi mới prune.</p>
<p>Và lời từ chối bạn sẽ gặp khi còn thứ gì đang giữ một volume:</p>
<pre><code class="language-bash">docker volume rm pg-data
docker ps -a --filter volume=pg-data --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">Error response from daemon: remove pg-data: volume is in use - [9caba9dd585edb27ac891ca2a6fd00182c07e3f3fdf63e62b090bf199546ab81]
holder Up 22 seconds</div>
<p>Cái ID trong ngoặc vuông là container đang giữ nó; <code>--filter volume=</code> đổi ID đó thành tên. Một container <em>đã dừng</em> giữ volume chặt y như container đang chạy.</p>
<table>
<tr><th>Lệnh</th><th>Volume có tên</th><th>Volume vô danh</th><th>Hỏi trước?</th></tr>
<tr><td><code>docker volume rm TÊN</code></td><td>Đúng cái đó (từ chối nếu đang dùng)</td><td>Đúng cái đó</td><td>Không</td></tr>
<tr><td><code>docker volume prune</code></td><td>Giữ</td><td>Xoá cái không ai dùng</td><td>Có (<code>-f</code> bỏ qua)</td></tr>
<tr><td><code>docker volume prune -a</code></td><td>Xoá cái không ai dùng</td><td>Xoá cái không ai dùng</td><td>Có</td></tr>
<tr><td><code>docker rm -v CONTAINER</code></td><td>Giữ</td><td>Xoá cái của container đó</td><td>Không</td></tr>
<tr><td><code>docker run --rm …</code></td><td>Giữ</td><td>Xoá khi container thoát</td><td>Không</td></tr>
<tr><td><code>docker system prune --volumes</code></td><td>Giữ</td><td>Xoá cái không ai dùng</td><td>Có</td></tr>
<tr><td><code>docker compose down -v</code></td><td>Xoá cái của dự án đó</td><td>Xoá cái của dự án đó</td><td>Không</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> VPS của đồ án nhóm báo <code>no space left on device</code>. Bạn phải tìm ra thứ gì đang chiếm chỗ và giải phóng nó — mà không đụng vào volume Postgres mà buổi demo ngày mai cần.</p><ol>
<li>Dựng hiện trường: một volume "CSDL" có nhãn đang bị một container đã dừng giữ, một volume cache có nhãn, và một volume vô danh mang nhãn của bạn (khối lệnh bên dưới).</li>
<li>Tìm chỗ bị chiếm: <code>docker system df -v | grep -E "thu-|LINKS"</code> và <code>docker volume ls --filter label=nhom=swp</code>. Những volume nào có 0 link?</li>
<li>Thử <code>docker volume rm thu-db</code>. Đọc lỗi và gọi tên container đang giữ nó bằng <code>docker ps -a --filter volume=thu-db</code>.</li>
<li>Chạy <code>docker volume ls --filter label=nhom=swp --filter dangling=true</code>, rồi <code>docker volume prune -f --filter label=nhom=swp</code>. Volume nào mất, volume nào còn, và vì sao?</li>
<li>Dọn theo tên: <code>docker rm thu-giu</code>, rồi <code>docker volume rm thu-db thu-cache</code>.</li></ol>
<pre><code class="language-bash">docker volume create --label nhom=swp thu-db
docker volume create --label nhom=swp thu-cache
docker run --name thu-giu -v thu-db:/d alpine:3.20 sh -c 'dd if=/dev/zero of=/d/data bs=1M count=30'
docker run --rm -v thu-cache:/d alpine:3.20 sh -c 'dd if=/dev/zero of=/d/c bs=1M count=20'
docker run --name thu-anon --mount type=volume,dst=/tmp/x,volume-label=nhom=swp alpine:3.20 true
docker rm thu-anon            <span class="tok-comment"># volume vô danh của nó giờ thành dangling</span></code></pre>
<p><strong>Đạt khi:</strong> <code>volume rm thu-db</code> bị từ chối và bạn chỉ ra được <code>thu-giu</code> là kẻ giữ; lượt prune xoá đúng cái volume vô danh còn <code>thu-cache</code> (dangling nhưng có tên) vẫn sống; và sau khi dọn <code>docker volume ls --filter label=nhom=swp</code> rỗng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mountpoint (điểm gắn)</span><span class="v">Thư mục thật của volume trên máy chạy Docker (trong máy ảo với Docker Desktop).</span></div>
  <div class="kv"><span class="k">Label (nhãn)</span><span class="v">Một cặp key=value gắn lên volume để sau này tìm và lọc.</span></div>
  <div class="kv"><span class="k">Dangling (lơ lửng)</span><span class="v">Lúc này không container nào, chạy hay dừng, tham chiếu tới volume — KHÔNG đồng nghĩa với "rác".</span></div>
  <div class="kv"><span class="k">LINKS (số liên kết)</span><span class="v">Cột của <code>system df -v</code> đếm số container tham chiếu tới một volume.</span></div>
  <div class="kv"><span class="k">Prune (dọn hàng loạt)</span><span class="v">Xoá hàng loạt thứ không dùng; với volume, mặc định chỉ xoá volume vô danh, trừ khi thêm <code>-a</code>.</span></div>
  <div class="kv"><span class="k">Volume driver (trình điều khiển volume)</span><span class="v">Thành phần cất giữ volume; <code>local</code> còn gắn được NFS/CIFS qua <code>--opt</code>.</span></div>
  <div class="kv"><span class="k">Scope: local (phạm vi cục bộ)</span><span class="v">Volume chỉ có trên máy này; máy khác không thấy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Volume là một thư mục dưới <code>/var/lib/docker/volumes/</code> trên máy chạy Docker — trong máy ảo nếu dùng Mac; nhìn vào bằng <code>docker run --rm -v TÊN:/d:ro alpine ls /d</code>.</li>
<li>Nhãn cộng <code>--filter</code> trả lời câu "cái gì thuộc ứng dụng này"; các bộ lọc ghép theo kiểu VÀ.</li>
<li><code>dangling=true</code> nghĩa là "lúc này không container nào tham chiếu", kể cả cái CSDL bạn sắp gắn lại.</li>
<li>Từ Docker 23, <code>docker volume prune</code> chỉ xoá volume vô danh; <code>-a</code> xoá cả volume có tên — luôn lọc và liệt kê trước.</li>
<li><code>docker system df -v</code> tìm ra volume to có 0 link; xem tuổi và nội dung trước khi xoá theo tên.</li>
<li>Volume mạng (NFS) chỉ được gắn khi container khởi động — địa chỉ sai hiện ra thành một lần khởi động hỏng rất chậm.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/storage/volumes/" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Volumes</span><span class="lc-sub">Tạo, chia sẻ, gắn chỉ đọc, tuỳ chọn driver gồm cả công thức NFS và CIFS, và những mẫu sao lưu/khôi phục được khai triển ở Bài 7.5.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/system/df/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">docker system df</span><span class="lc-sub">Cờ <code>-v</code> tách tổng dung lượng theo ảnh, container và volume. Lệnh phải với tới trước khi xoá bất cứ thứ gì để lấy lại đĩa.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: quản lý volume</span><span class="lc-sub">Bài chấm điểm: gắn nhãn cho một volume rồi tìm lại bằng filter, xác định volume nào đang ôm 7GB và có xoá được không, chia sẻ một volume ở chế độ đọc-ghi và chỉ đọc, và giải thích vì sao <code>docker volume rm</code> từ chối.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đọc <code>dangling=true</code> thành "xoá được rồi". Nó chỉ có nghĩa là hiện không có container nào <em>đang chạy hoặc đang tồn tại</em> tham chiếu tới volume đó. Dựng lại container từ một file compose là volume lập tức được dùng lại với đủ dữ liệu của bạn — đó là đường nâng cấp bình thường, không phải tai nạn. Những volume thật sự là rác có đủ ba tính chất cùng lúc: không link, một cái tên vô danh 64 ký tự hex, và một ngày tạo mà bạn truy được về một lần thử nghiệm. Trước khi prune trên một máy chủ có dữ liệu thật, hãy chạy <code>docker volume ls --filter dangling=true</code>, đọc danh sách, và xác nhận từng cái tên. Một lượt prune xoá mất volume có tên mà bạn sắp gắn lại thì không cứu được, và hộp xác nhận của Docker chỉ cho bạn xem một con SỐ, không phải các cái tên. (Từ Docker 23 muốn vậy phải gõ <code>docker volume prune -a</code> — prune trơn để yên volume có tên — nhưng script cũ và bài hướng dẫn cũ vẫn còn dùng cờ đó.)</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Volume chỉ là một thư mục có người quản — <code>docker volume inspect -f '{{ .Mountpoint }}'</code> chỉ đích danh thư mục nào, và điều đó biến sao lưu với chẩn đoán thành việc bình thường. Hãy gắn nhãn cho volume để <code>ls --filter</code> trả lời được câu "cái nào thuộc ứng dụng này" sau sáu tháng. Và chạy <code>docker system df -v</code> trước khi đổ lỗi cho ảnh khi đĩa đầy: một volume vô danh không link là bất ngờ vài gigabyte rất hay gặp.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — Bind mounts, and the four traps|||7.3 — Bind mount, và bốn cái bẫy',
      slug: 'dk-7-3-bind-mount',
      type: 'LESSON',
      description: 'Quy trình phát triển với mã nguồn gắn từ máy chủ, bẫy node_modules và cách vá bằng anonymous volume, lệch UID làm file thành của root, :ro và :z cho SELinux, và vì sao bind mount trên macOS chậm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Bind mounts, and the four traps</h2>
<p class="lead">A bind mount is the most useful mount during development and the most trouble-prone everywhere else. The mechanism is simple — a host directory appears at a path inside the container — but four consequences of that simplicity account for most of the questions people ask about Docker volumes.</p>

<h3>The development loop it enables</h3>
${slide('dk-07', 13, 'Bind mount: sửa trên máy, container thấy ngay')}
<pre><code>docker run --rm -it \\
  -v "$PWD:/app" -w /app \\
  -p 3000:3000 \\
  node:22-alpine sh -c 'npm run dev'</code></pre>
<div class="out">&gt; blog@1.0.0 dev
&gt; next dev
   ▲ Next.js 15.1.0
   - Local:  http://localhost:3000
 ✓ Ready in 1841ms
 ○ Compiling / ...</div>
<p>Edit a file on the host, the container sees the change, the dev server rebuilds. No image rebuild, no restart, no copying. This is the whole reason bind mounts exist, and it is worth the traps below — as long as you know them.</p>
<h3>Run it step by step: a live-reload loop you can reproduce</h3>
<p>The Next.js output above is typical; here is a smaller loop that anyone can rebuild in two minutes, recorded on the course's Mac (Docker Desktop 4.91, VirtioFS). Three files in an empty folder:</p>
<pre><code class="language-bash"><span class="tok-comment"># package.json</span>
{ "name": "blog", "version": "1.0.0", "scripts": { "dev": "node --watch server.js" },
  "dependencies": { "express": "^4.21.2" } }
<span class="tok-comment"># server.js</span>
const express = require('express');
const app = express();
app.get('/', (req, res) =&gt; res.send('xin chao v1\\n'));
app.listen(3000, () =&gt; console.log('nghe o cong 3000'));
<span class="tok-comment"># Dockerfile</span>
FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .
CMD ["npm", "run", "dev"]</code></pre>
<pre><code class="language-bash">docker build -q -t app-dev .
docker run -d --name dev -p 18070:3000 -v "$PWD:/app" -v /app/node_modules app-dev
curl -s localhost:18070
echo '// lan 3' &gt;&gt; server.js          <span class="tok-comment"># edit on the HOST, in any editor</span>
docker logs dev | tail -2</code></pre>
<div class="out">xin chao v3 — sua tren Mac
Restarting 'server.js'
nghe o cong 3000</div>
<p>Flag by flag: <code>-v "$PWD:/app"</code> shows your project folder at <code>/app</code>; <code>-v /app/node_modules</code> is the fix for Trap 1 below; <code>-p 18070:3000</code> publishes the port; and <code>node --watch</code> restarts when a file changes. The restart happens because the Linux kernel inside the VM receives a file-change notification (<strong>inotify</strong>) through the mount. Two conditions for that notification to arrive:</p>
<ul>
<li><strong>Windows:</strong> the project must live inside the WSL2 filesystem (<code>~/project</code> in your Ubuntu shell), not under <code>/mnt/c/…</code>. Docker's own WSL guide says Linux containers only receive inotify events when the files are stored in the Linux filesystem.</li>
<li><strong>Any OS:</strong> the editor must change the file <em>in place</em>. Tools that write a new file and rename it (<code>sed -i</code>, some formatters) give the file a new identity, and the watcher can go deaf — measured below in "a single file mounted by inode".</li>
</ul>

<h3>Trap 1 — node_modules disappears</h3>
<pre><code><span class="tok-comment"># The image installed dependencies at build time…</span>
docker build -q -t app-dev . &amp;&amp; docker run --rm app-dev ls node_modules | wc -l
<span class="tok-comment"># …and the bind mount hides them</span>
docker run --rm -v "$PWD:/app" app-dev ls /app/node_modules 2&gt;&amp;1 | head -1</code></pre>
<div class="out">312
ls: /app/node_modules: No such file or directory</div>
<p>Nothing was deleted. <code>/app</code> now shows the host directory, and your host directory has no <code>node_modules</code> (or worse: it has one built for macOS while the container is Linux). Remember the rule from Lesson 7.1 — a bind mount never copies, and the host always wins.</p>
<pre><code><span class="tok-comment"># The fix: mount an anonymous volume OVER the subdirectory</span>
docker run --rm -v "$PWD:/app" -v /app/node_modules app-dev ls /app/node_modules | wc -l</code></pre>
<div class="out">312</div>
<div class="callout ok"><strong>Why that works.</strong> Mounts are applied in order of path depth: <code>/app</code> gets the bind mount, then the deeper <code>/app/node_modules</code> gets its own volume mount layered on top, which — being a <em>volume</em>, not a bind — receives a copy of the image's contents on first use. In compose the same trick reads much better:
<pre><code>services:
  web:
    build: .
    volumes:
      - .:/app                 <span class="tok-comment"># your source, live</span>
      - /app/node_modules      <span class="tok-comment"># keep the image's copy</span></code></pre>
<p>The same pattern applies to <code>.next/</code>, <code>target/</code>, <code>__pycache__/</code>, <code>vendor/</code> — anything the image builds that the host should not overwrite.</p></div>
<h3>Run it step by step: the trap on a real project, and its second half</h3>
${slide('dk-07', 14, 'Bẫy 1: bind che node_modules — volume gắn SÂU hơn cứu nó')}
<p>With the three files above (course's Mac, the image has 67 packages in <code>node_modules</code>):</p>
<pre><code class="language-bash">docker run --rm app-dev ls node_modules | wc -l
docker run --rm -v "$PWD:/app" app-dev ls /app/node_modules
docker run --rm -v "$PWD:/app" --entrypoint node app-dev server.js
docker run --rm -v "$PWD:/app" -v /app/node_modules app-dev ls /app/node_modules | wc -l
ls -la node_modules</code></pre>
<div class="out">67
ls: /app/node_modules: No such file or directory
node:internal/modules/cjs/loader:1433
  throw err;
  ^

Error: Cannot find module 'express'
Require stack:
…
67
total 0
drwxr-xr-x  2 admin  wheel   64 Sep 24 01:25 .
drwxr-xr-x@ 7 admin  wheel  224 Sep 24 01:25 ..</div>
<p>The last command shows a side effect: to mount something at <code>/app/node_modules</code>, Docker needs that directory to exist inside the bind, so it creates an <strong>empty <code>node_modules</code> folder on your host</strong>. Harmless, but keep <code>node_modules</code> in <code>.gitignore</code> and <code>.dockerignore</code>.</p>
<p>The second half of the trap appears a week later, when someone adds a dependency. Compose keeps the anonymous volume between runs — that is what makes it fast — so the <em>old</em> <code>node_modules</code> comes back even after a rebuild (course's Mac, Compose v5.5, <code>dayjs</code> added to <code>package.json</code>):</p>
<pre><code class="language-bash">docker compose up -d --build
docker compose logs web | grep -m1 "Cannot find"
docker compose exec web ls node_modules | grep -c dayjs
docker compose up -d --build -V        <span class="tok-comment"># -V = --renew-anon-volumes</span>
curl -s localhost:18073</code></pre>
<div class="out">web-1  | Error: Cannot find module 'dayjs'
0
xin chao 24/09/2026</div>
<p>The image was rebuilt with <code>dayjs</code>, but the container kept the previous anonymous volume, which was populated from the <em>previous</em> image. <code>-V</code> throws that volume away and populates a fresh one from the new image. One more real detail: the replaced volume is <em>not</em> deleted — <code>docker events</code> showed it created and never destroyed — so after a few rounds <code>docker volume ls -f dangling=true</code> is worth a look (Lesson 7.2).</p>

<h3>Trap 2 — files owned by root appear on your host</h3>
<pre><code>docker run --rm -v "$PWD/out:/out" alpine:3.20 sh -c 'echo hi &gt; /out/made-in-container.txt'
ls -la out/</code></pre>
<div class="out">total 12
drwxr-xr-x 2 cuong cuong 4096 Aug 22 09:41 .
-rw-r--r-- 1 root  root     3 Aug 22 09:41 made-in-container.txt</div>
<p>The container ran as root (uid 0), and a bind mount carries numeric IDs straight through — there is no translation layer. The file is genuinely owned by root on your host, and now your editor cannot save over it.</p>
<pre><code><span class="tok-comment"># Fix: run as your own uid/gid</span>
docker run --rm -u "$(id -u):$(id -g)" -v "$PWD/out:/out" alpine:3.20 \\
  sh -c 'echo hi &gt; /out/mine.txt'
ls -l out/mine.txt</code></pre>
<div class="out">-rw-r--r-- 1 cuong cuong 3 Aug 22 09:43 out/mine.txt</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Why <code>-u $(id -u)</code> is enough</span><span class="v">The kernel only compares numbers. The container has no user named <code>cuong</code>, and does not need one — the numeric uid is what lands on the file.</span></div>
  <div class="kv"><span class="k">Programs that dislike a nameless uid</span><span class="v">Some tools call <code>getpwuid()</code> and fail. Add <code>--user "$(id -u):$(id -g)"</code> plus a writable <code>HOME</code>, or add a matching user in a dev-stage of your Dockerfile.</span></div>
  <div class="kv"><span class="k">Rootless Docker sidesteps it</span><span class="v">Under rootless mode (Lesson 6.4) container root maps to your user on the host, so files land owned by you by default.</span></div>
  <div class="kv"><span class="k">Docker Desktop hides it</span><span class="v">On macOS and Windows the file-sharing layer rewrites ownership, so this trap does not appear — and then does appear the day the same compose file runs on a Linux CI runner.</span></div>
</div>
<h3>Run it step by step: the same command on Linux and on a Mac</h3>
${slide('dk-07', 15, 'Bẫy 2 &amp; 3: file thuộc root trên Linux, và SELinux')}
<p>On the Linux machine (Fedora, Docker Engine 29.6, no sudo), a build step that runs as root writes into your project:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD/out:/out" alpine sh -c "mkdir -p /out/build &amp;&amp; echo hi &gt; /out/build/app.js"
ls -la out/build
echo sua &gt;&gt; out/build/app.js
rm -rf out/build
docker run --rm -u "$(id -u):$(id -g)" -v "$PWD/out:/out" alpine sh -c 'echo hi &gt; /out/mine.txt; id; echo HOME=$HOME'</code></pre>
<div class="out">total 4
drwxr-xr-x. 2 root      root      60 Sep 24 01:29 .
drwxr-xr-x. 3 Cuong03dx Cuong03dx 60 Sep 24 01:29 ..
-rw-r--r--. 1 root      root       3 Sep 24 01:29 app.js
zsh:4: permission denied: out/build/app.js
rm: cannot remove 'out/build/app.js': Permission denied
uid=1000 gid=1000 groups=1000
HOME=/</div>
<p>You cannot edit it, and you cannot even delete it: the <em>directory</em> <code>build</code> was also created by root. The way out without sudo is to let a container (which is root) delete it: <code>docker run --rm -v "$PWD/out:/out" alpine rm -rf /out/build</code>. The <code>-u</code> run shows the price of running as your own uid: the container has no user 1000, so <code>HOME</code> is <code>/</code> — tools that want to write a cache in <code>$HOME</code> need <code>-e HOME=/tmp</code>.</p>
<p>The same first command on the course's Mac:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD/out:/out" alpine:3.20 sh -c 'echo hi &gt; /out/made-in-container.txt; ls -ln /out'
ls -la out/</code></pre>
<div class="out">total 4
-rw-r--r--    1 0        0                3 Sep 23 18:29 made-in-container.txt
total 8
drwxr-xr-x@  3 admin  wheel   96 Sep 24 01:29 .
drwxr-xr-x@ 10 admin  wheel  320 Sep 24 01:29 ..
-rw-r--r--   1 admin  wheel    3 Sep 24 01:29 made-in-container.txt</div>
<p>Inside, the file belongs to uid 0; on the Mac it belongs to you. Docker Desktop's file sharing maps ownership, so a Mac user never sees this trap — and then a teammate on Linux, or the CI runner, does. Windows with the project inside WSL2 behaves like Linux here, because it <em>is</em> a Linux filesystem.</p>

<h3>Trap 3 — SELinux says permission denied on a correct mount</h3>
<pre><code><span class="tok-comment"># On a host whose dockerd runs with --selinux-enabled (RHEL/CentOS builds, Podman) and SELinux enforcing</span>
docker run --rm -v "$PWD/conf:/etc/app" alpine:3.20 cat /etc/app/app.conf</code></pre>
<div class="out">cat: can't open '/etc/app/app.conf': Permission denied</div>
<pre><code><span class="tok-comment"># :z relabels shared (multiple containers), :Z private (this container only)</span>
docker run --rm -v "$PWD/conf:/etc/app:ro,z" alpine:3.20 cat /etc/app/app.conf</code></pre>
<div class="out">listen = 0.0.0.0:8080</div>
<div class="callout"><strong>Measured: on a Fedora machine this trap did NOT happen.</strong> The course's Linux box runs Fedora 44 with SELinux <code>Enforcing</code>, yet the mount above works without <code>:z</code>:
<pre><code class="language-bash">getenforce
docker info --format '{{.SecurityOptions}}'
docker run --rm -v "$PWD/conf:/etc/app" alpine cat /etc/app/app.conf</code></pre>
<div class="out">Enforcing
[name=seccomp,profile=builtin name=cgroupns]
listen = 0.0.0.0:8080</div>
<p>The reason is in the second line: there is no <code>name=selinux</code>. Docker CE from docker.com starts <code>dockerd</code> without <code>--selinux-enabled</code>, so containers are not confined by SELinux at all, and <code>:z</code> changes nothing (<code>ls -Z</code> showed the same label before and after). You meet the <code>Permission denied</code> above on hosts where the daemon has SELinux enabled — RHEL/CentOS builds, or Podman, which enables it by default. Check <code>docker info</code> first; then use <code>:z</code> only on folders made for the container.</p></div>
<div class="callout warn"><strong><code>:Z</code> relabels the host directory recursively and permanently.</strong> Point it at <code>$HOME</code> or <code>/usr</code> and you will spend an afternoon repairing SELinux labels on files other programs need. Use <code>:z</code> (lowercase, shared) on directories created for the container, and never on a directory that belongs to the system.</div>

<h3>One more trap, from a real outage: a single file is mounted by inode</h3>
${slide('dk-07', 16, 'Gắn MỘT FILE là gắn theo INODE — sự cố thật')}
<p>A student project ran nginx in Docker with one file bind-mounted: <code>./nginx/nginx.conf:/etc/nginx/nginx.conf:ro</code>. The deploy script updated that file on the server with <code>mv new.conf nginx.conf</code>, ran <code>nginx -t</code> and <code>nginx -s reload</code> — all green — and nothing changed. Twice. The config test even passed on a config that was never deployed. Here is why, rebuilt on the course's Linux machine:</p>
<pre><code class="language-bash">cat &gt; nginx.conf &lt;&lt;'EOF'
events {}
http { server { listen 80; location / { return 200 "phien ban 1\\n"; } } }
EOF
docker run -d --name ngx -p 18071:80 -v "$PWD/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:1.27-alpine
curl -s localhost:18071
ls -i nginx.conf; sed -i "s/phien ban 1/phien ban 2/" nginx.conf; ls -i nginx.conf
docker exec ngx grep return /etc/nginx/nginx.conf
docker exec ngx nginx -s reload; curl -s localhost:18071</code></pre>
<div class="out">phien ban 1
20266 nginx.conf
20269 nginx.conf
http { server { listen 80; location / { return 200 "phien ban 1\\n"; } } }
2026/09/23 18:28:44 [notice] 37#37: signal process started
phien ban 1</div>
<p>The number before the file name is the <strong>inode</strong>: the file's identity on disk. A name in a folder is only a pointer to an inode. When Docker bind-mounts a <em>single file</em>, the kernel attaches that inode, at container start. <code>sed -i</code> (like <code>mv</code>, <code>rsync</code>, many editors' "safe save") does not modify the file: it writes a new file with a new inode (20269) and renames it over the old name. The folder now points to 20269; the container still holds 20266 — the old content, kept alive because something still has it open. Nginx reloads the old config perfectly.</p>
${slide('dk-07', 17, 'Sửa file đã gắn đơn lẻ: cái nào container thấy')}
<p>Each way of editing, measured on both machines (the Mac uses Docker Desktop 4.91 with VirtioFS):</p>
<table>
<tr><th>How you change the host file</th><th>Inode</th><th>Linux: container sees</th><th>Mac: container sees</th></tr>
<tr><td><code>sed -i …</code></td><td>new</td><td>old content</td><td><code>No such file or directory</code></td></tr>
<tr><td><code>mv file.new file</code></td><td>new</td><td>old content</td><td><code>No such file or directory</code></td></tr>
<tr><td><code>cat file.new &gt; file</code> (overwrite in place)</td><td>same</td><td>new content (after reload)</td><td>new content (after reload)</td></tr>
<tr><td>vim 9.2 <code>:wq</code> (default settings)</td><td>same</td><td>new content</td><td>(not measured)</td></tr>
<tr><td>Mount the <strong>folder</strong>, then <code>sed -i</code></td><td>new</td><td>new content</td><td>new content</td></tr>
</table>
<p>Two details made the incident worse than a simple "old config". First, once the inode has changed, overwriting in place no longer helps — the container is still attached to the old inode until it is <strong>restarted</strong>. Second, on a Mac the failure is louder but stranger: <code>grep</code> in the container says the file does not exist, while <code>stat</code> still shows inode 72. And the same identity problem breaks file watchers even with a folder mount: after one <code>sed -i</code> on <code>server.js</code>, <code>node --watch</code> restarted once and then never again on Linux, and never restarted at all on the Mac.</p>
<div class="callout ok"><strong>The fixes, best first.</strong> (1) Mount the directory, not the file: <code>./nginx/conf.d:/etc/nginx/conf.d:ro</code> — a directory is looked up by name every time. (2) If a single file is unavoidable, overwrite it in place (<code>cat new.conf &gt; nginx.conf</code>), then verify from <em>inside</em>: <code>docker exec ngx sha256sum /etc/nginx/nginx.conf</code> must equal <code>sha256sum nginx.conf</code> on the host. A mismatch means restart the container. (3) With vim, <code>:set backupcopy=yes</code> guarantees an in-place write whatever the defaults.</div>
<pre><code class="language-bash"><span class="tok-comment"># the check that would have caught the incident (Linux, after an mv)</span>
echo v1 &gt; f.txt
docker run -d --name ftest -v "$PWD/f.txt:/f.txt:ro" alpine sleep 120
echo v2 &gt; f.moi; mv f.moi f.txt
docker exec ftest cat /f.txt
docker exec ftest sha256sum /f.txt; sha256sum f.txt</code></pre>
<div class="out">v1
2d27fbdf4e8ca207afbfa388ca9172fbcc6c70e534af2476b3b704f87debadcf  /f.txt
81db67b6a5702b9b68f0016f061c409bf3fb16d062fc854d1b424bb4e9c28c56  f.txt</div>
<p class="note-ct">A test file <code>f.txt</code> (content <code>v1</code>) mounted the same way and replaced with <code>mv</code>: the container still reads <code>v1</code>, and the two hashes differ — the container is not reading what the host has. For nginx the same check is <code>docker exec ngx sha256sum /etc/nginx/nginx.conf</code> against <code>sha256sum nginx.conf</code>. The general lesson: "written" and "the command returned 0" do not mean "in effect" — check from the side that uses it.</p>

<h3>Trap 4 — bind mounts are slow on macOS and Windows</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Linux</span><span class="lz-t">native speed — it is the same filesystem</span><span class="lz-d">A bind mount costs nothing; the kernel is showing the container a directory it already has. No copying, no protocol, no daemon in between.</span></div>
  <div class="lz-step"><span class="lz-k">macOS / Windows</span><span class="lz-t">crosses a VM boundary on every file operation</span><span class="lz-d">Docker Desktop runs a Linux VM; your files are on the host OS. Every stat and read is a round trip. A <code>node_modules</code> with 40,000 files feels it immediately.</span></div>
  <div class="lz-step"><span class="lz-k">Mitigation: VirtioFS</span><span class="lz-t">Docker Desktop → Settings → General</span><span class="lz-d">Several times faster than the older gRPC-FUSE. Enabled by default on recent versions; check it before concluding that Docker is slow.</span></div>
  <div class="lz-step"><span class="lz-k">Mitigation: keep dependencies off the bind</span><span class="lz-t">the anonymous-volume trick from Trap 1</span><span class="lz-d">Doubly worthwhile here: <code>node_modules</code> in a volume lives in the VM's own filesystem, at native speed, while your source stays live-editable.</span></div>
</div>
${slide('dk-07', 18, 'Bind mount trên Mac chậm ~12 lần — trên Linux thì như nhau')}
<h3>Measured: how slow, on which machine</h3>
<p>A small Node script that writes, stats, reads and deletes 2,000 files of 4 KB in 100 folders — the shape of a small <code>node_modules</code> — run in <code>node:22-alpine</code> three times on each target (median shown, 09/2026):</p>
<table>
<tr><th>Machine · target</th><th>write</th><th>stat</th><th>read</th><th>delete</th><th>total</th></tr>
<tr><td>Mac M1 · bind mount (VirtioFS)</td><td>1273 ms</td><td>149 ms</td><td>396 ms</td><td>422 ms</td><td><strong>2240 ms</strong></td></tr>
<tr><td>Mac M1 · named volume</td><td>92 ms</td><td>8 ms</td><td>31 ms</td><td>53 ms</td><td><strong>184 ms</strong></td></tr>
<tr><td>Linux · bind mount (btrfs)</td><td>30 ms</td><td>5 ms</td><td>13 ms</td><td>56 ms</td><td><strong>104 ms</strong></td></tr>
<tr><td>Linux · named volume</td><td>31 ms</td><td>4 ms</td><td>14 ms</td><td>61 ms</td><td><strong>110 ms</strong></td></tr>
</table>
<p>On the Mac the bind mount is about twelve times slower than a volume, and noisy — the write step ranged from 830 to 2,081 ms across the three runs. On Linux the two are the same, because a bind mount there is the same kernel showing the same disk. The volume on the Mac lives on the VM's own ext4 disk (<code>/dev/vda1 … ext4</code> in <code>/proc/mounts</code>), so it is fast too. The source was the following script; you can repeat it on your machine:</p>
<pre><code class="language-bash"><span class="tok-comment"># bench.js — run: docker run --rm -v "$PWD:/p" node:22-alpine node /p/bench.js /p</span>
<span class="tok-comment">#           and:  docker run --rm -v bench:/v -v "$PWD:/p:ro" node:22-alpine node /p/bench.js /v</span>
const fs = require('fs'), path = require('path');
const T = path.join(process.argv[2], 'bench'), buf = Buffer.alloc(4096, 97);
const files = []; for (let d = 0; d &lt; 100; d++) for (let f = 0; f &lt; 20; f++) files.push(path.join(T, 'd' + d, 'f' + f + '.js'));
let t = Date.now(); for (let d = 0; d &lt; 100; d++) fs.mkdirSync(path.join(T, 'd' + d), { recursive: true }); for (const f of files) fs.writeFileSync(f, buf); const w = Date.now() - t;
t = Date.now(); for (const f of files) fs.statSync(f); const s = Date.now() - t;
t = Date.now(); for (const f of files) fs.readFileSync(f); const r = Date.now() - t;
t = Date.now(); fs.rmSync(T, { recursive: true }); const x = Date.now() - t;
console.log('ghi ' + w + ' ms · stat ' + s + ' ms · doc ' + r + ' ms · xoa ' + x + ' ms');</code></pre>
<table>
<tr><th>Your machine</th><th>Where to keep what</th></tr>
<tr><td>Linux</td><td>Anywhere. A bind mount costs nothing; choose by lifecycle, not speed.</td></tr>
<tr><td>Mac</td><td>Source code on a bind mount (you need live edits); <code>node_modules</code>, <code>.next</code>, build caches and database files in volumes.</td></tr>
<tr><td>Windows + WSL2</td><td>Clone the project <em>inside</em> WSL2 (<code>\\\\wsl$\\Ubuntu\\home\\you\\project</code> in Explorer, <code>~/project</code> in the shell) and run <code>docker compose</code> from there. Not measured on the course's machines; Docker's WSL guide states that performance is "much higher" from the Linux filesystem than from <code>/mnt/c</code>, and that inotify only works there.</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate clones your project on their Mac and <code>docker compose up</code> dies with <code>Cannot find module 'express'</code>; another teammate edits the nginx config on the group VPS with <code>sed -i</code> and swears it "does not apply". Fix the first, prove the second.</p><ol>
<li>In <code>~/thu-docker/ch07/app</code>, create the three files from "a live-reload loop" above and <code>docker build -t thu-app .</code>.</li>
<li>Run <code>docker run --rm -v "$PWD:/app" thu-app</code> and read the error; then add <code>-v /app/node_modules</code>, <code>-p 18070:3000</code>, <code>-d --name thu-dev</code> and check <code>curl localhost:18070</code>.</li>
<li>Append a line to <code>server.js</code> with <code>echo … &gt;&gt;</code>, confirm the restart in <code>docker logs thu-dev</code>. Then run <code>sed -i.bak 's/v1/v2/' server.js</code> (works on Mac and Linux) and check whether it still restarts on the next edit.</li>
<li>In <code>~/thu-docker/ch07/ngx</code>, reproduce the single-file mount with the nginx block above (container <code>thu-ngx</code>, port 18071), change it with <code>sed -i.bak</code>, compare <code>sha256sum</code> inside and outside. Then remount the <em>folder</em> instead and repeat.</li>
<li>Clean up: <code>docker rm -f thu-dev thu-ngx</code>, <code>docker rmi thu-app</code>, delete the folders.</li></ol>
<p><strong>Done when:</strong> <code>curl</code> answers after the <code>node_modules</code> fix; you can show, for the single-file mount, sha256 values that do not match (on a Mac the inside command fails with <code>No such file or directory</code> instead) and, for the folder mount, a matching pair; and <code>docker ps -a --filter name=thu-</code> is empty.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Shadowing</span><span class="v">A mount hiding what the image had at that path; nothing is deleted.</span></div>
  <div class="kv"><span class="k">Inode</span><span class="v">A file's identity on disk; a name in a folder only points to one. A single-file bind mount is attached to the inode.</span></div>
  <div class="kv"><span class="k">inotify</span><span class="v">Linux's file-change notification, which watchers like <code>node --watch</code> and nodemon rely on.</span></div>
  <div class="kv"><span class="k">UID / GID</span><span class="v">The numbers the kernel compares for ownership; they cross a bind mount unchanged on Linux.</span></div>
  <div class="kv"><span class="k">VirtioFS</span><span class="v">Docker Desktop's way of sharing Mac folders into its Linux VM; convenient, and slower than a volume.</span></div>
  <div class="kv"><span class="k">WSL2</span><span class="v">The Linux environment inside Windows; keep projects in its own filesystem, not <code>/mnt/c</code>.</span></div>
  <div class="kv"><span class="k"><code>:z</code> / <code>:Z</code></span><span class="v">SELinux relabel options for bind mounts: shared / private. Only matter when the daemon enables SELinux.</span></div>
  <div class="kv"><span class="k"><code>-V</code> (<code>--renew-anon-volumes</code>)</span><span class="v">Compose flag that recreates anonymous volumes so a new image's <code>node_modules</code> is used.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A bind mount shows your folder as-is and never copies: it hides the image's <code>node_modules</code>; a deeper anonymous volume brings it back, and <code>compose up -V</code> refreshes it after dependency changes.</li>
<li>On Linux numeric UIDs pass straight through: run with <code>-u "$(id -u):$(id -g)"</code> or clean up root-owned files through a container.</li>
<li>SELinux denials need a daemon with SELinux enabled — check <code>docker info</code> before reaching for <code>:z</code>, and never <code>:Z</code> a system folder.</li>
<li>A single-file mount is attached by inode: <code>sed -i</code>/<code>mv</code> leave the container on the old content (Linux) or a missing file (Mac) until restart — mount folders, or overwrite in place and verify with sha256 inside.</li>
<li>On a Mac a bind mount was ~12× slower than a volume; on Linux they were equal — keep heavy directories in volumes on Mac/Windows.</li>
<li>On Windows keep the project inside WSL2, or you lose both speed and inotify.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/storage/bind-mounts/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Bind mounts</span><span class="lc-sub">The full option list including <code>ro</code>, <code>z</code>/<code>Z</code>, and bind propagation modes, plus the official warning about mounting over an existing container directory.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/desktop/settings-and-maintenance/settings/#file-sharing" target="_blank" rel="noopener">
  <span class="lc-ico">🍎</span>
  <span class="lc-body"><span class="lc-title">Docker Desktop — file sharing &amp; VirtioFS</span><span class="lc-sub">Which directories are shareable, how to switch the file-sharing implementation, and the performance characteristics of each. Read this before optimising anything else on a Mac.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: fix a broken dev mount</span><span class="lc-sub">Graded exercises: reproduce the vanished <code>node_modules</code> and fix it with an anonymous volume, make a container write files you own, and choose between <code>:ro</code>, <code>:z</code> and <code>:Z</code> for four scenarios.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> using a bind mount for a database data directory because it is easier to see the files. On Linux it mostly works and gives you a directory you will eventually <code>rm -rf</code> by accident; on macOS and Windows it goes through the file-sharing layer, where Postgres's assumptions about <code>fsync</code> ordering and file locking are not guaranteed — the documented result is data corruption, not slowness. The official Postgres image mounts a <em>volume</em> at <code>/var/lib/postgresql/data</code> for exactly this reason. If you want to look at the files, <code>docker run --rm -v pg-data:/d -v "$PWD:/out" alpine tar -C /d -cf /out/pg.tar .</code> gives you a copy without putting the live database on the wrong filesystem.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A bind mount always wins over the image's contents and never copies anything — that single rule explains the vanished <code>node_modules</code>, and an anonymous volume mounted deeper is the fix. Numeric uids pass straight through on Linux, so <code>-u "$(id -u):$(id -g)"</code> is what keeps root-owned files out of your working tree. And on macOS or Windows every file operation crosses a VM boundary: keep dependency directories in volumes, not on the bind.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Bind mount, và bốn cái bẫy</h2>
<p class="lead">Bind mount là kiểu gắn hữu ích nhất lúc phát triển và phiền phức nhất ở mọi chỗ khác. Cơ chế thì đơn giản — một thư mục máy chủ hiện ra ở một đường dẫn bên trong container — nhưng bốn hệ quả của chính sự đơn giản đó chiếm phần lớn những câu hỏi người ta hỏi về volume trong Docker.</p>

<h3>Vòng lặp phát triển mà nó mở ra</h3>
${slide('dk-07', 13, 'Bind mount: sửa trên máy, container thấy ngay')}
<pre><code>docker run --rm -it \\
  -v "$PWD:/app" -w /app \\
  -p 3000:3000 \\
  node:22-alpine sh -c 'npm run dev'</code></pre>
<div class="out">&gt; blog@1.0.0 dev
&gt; next dev
   ▲ Next.js 15.1.0
   - Local:  http://localhost:3000
 ✓ Ready in 1841ms
 ○ Compiling / ...</div>
<p>Sửa một file trên máy chủ, container thấy đổi, dev server dựng lại. Không dựng lại ảnh, không khởi động lại, không chép gì. Đây là toàn bộ lý do bind mount tồn tại, và nó đáng để chịu mấy cái bẫy dưới đây — miễn là bạn biết chúng.</p>
<h3>Chạy thử từng bước: một vòng tự-nạp-lại bạn làm lại được</h3>
<p>Output Next.js ở trên là điển hình; đây là một vòng nhỏ hơn ai cũng dựng lại được trong hai phút, ghi trên máy Mac của khoá (Docker Desktop 4.91, VirtioFS). Ba file trong một thư mục trống:</p>
<pre><code class="language-bash"><span class="tok-comment"># package.json</span>
{ "name": "blog", "version": "1.0.0", "scripts": { "dev": "node --watch server.js" },
  "dependencies": { "express": "^4.21.2" } }
<span class="tok-comment"># server.js</span>
const express = require('express');
const app = express();
app.get('/', (req, res) =&gt; res.send('xin chao v1\\n'));
app.listen(3000, () =&gt; console.log('nghe o cong 3000'));
<span class="tok-comment"># Dockerfile</span>
FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .
CMD ["npm", "run", "dev"]</code></pre>
<pre><code class="language-bash">docker build -q -t app-dev .
docker run -d --name dev -p 18070:3000 -v "$PWD:/app" -v /app/node_modules app-dev
curl -s localhost:18070
echo '// lan 3' &gt;&gt; server.js          <span class="tok-comment"># sửa TRÊN MÁY, bằng trình soạn thảo nào cũng được</span>
docker logs dev | tail -2</code></pre>
<div class="out">xin chao v3 — sua tren Mac
Restarting 'server.js'
nghe o cong 3000</div>
<p>Từng cờ một: <code>-v "$PWD:/app"</code> cho thư mục dự án hiện ra ở <code>/app</code>; <code>-v /app/node_modules</code> là cách vá Bẫy 1 bên dưới; <code>-p 18070:3000</code> mở cổng; và <code>node --watch</code> tự chạy lại khi file đổi. Việc chạy lại xảy ra vì nhân Linux trong máy ảo nhận được thông báo file thay đổi (<strong>inotify</strong>) đi qua phép gắn. Hai điều kiện để thông báo đó tới nơi:</p>
<ul>
<li><strong>Windows:</strong> dự án phải nằm TRONG hệ thống file của WSL2 (<code>~/project</code> trong shell Ubuntu), không phải dưới <code>/mnt/c/…</code>. Chính hướng dẫn WSL của Docker nói container Linux chỉ nhận sự kiện inotify khi file nằm trong hệ thống file Linux.</li>
<li><strong>Mọi hệ điều hành:</strong> trình soạn thảo phải sửa file <em>tại chỗ</em>. Công cụ nào ghi ra file mới rồi đổi tên (<code>sed -i</code>, vài trình định dạng mã) sẽ cho file một danh tính mới, và trình theo dõi có thể bị điếc — đo ở mục "một file gắn theo inode" bên dưới.</li>
</ul>

<h3>Bẫy 1 — node_modules biến mất</h3>
<pre><code><span class="tok-comment"># Cái ảnh đã cài gói phụ thuộc lúc dựng…</span>
docker build -q -t app-dev . &amp;&amp; docker run --rm app-dev ls node_modules | wc -l
<span class="tok-comment"># …và bind mount che chúng đi</span>
docker run --rm -v "$PWD:/app" app-dev ls /app/node_modules 2&gt;&amp;1 | head -1</code></pre>
<div class="out">312
ls: /app/node_modules: No such file or directory</div>
<p>Chẳng có gì bị xoá. <code>/app</code> giờ hiện thư mục của máy chủ, và thư mục máy chủ của bạn không có <code>node_modules</code> (hoặc tệ hơn: có một cái dựng cho macOS trong khi container là Linux). Nhớ lại luật ở Bài 7.1 — bind mount không bao giờ chép, và phía máy chủ luôn thắng.</p>
<pre><code><span class="tok-comment"># Cách vá: gắn một volume vô danh ĐÈ LÊN thư mục con</span>
docker run --rm -v "$PWD:/app" -v /app/node_modules app-dev ls /app/node_modules | wc -l</code></pre>
<div class="out">312</div>
<div class="callout ok"><strong>Vì sao cách đó chạy.</strong> Các phép gắn được áp theo độ sâu đường dẫn: <code>/app</code> nhận bind mount, rồi <code>/app/node_modules</code> sâu hơn nhận phép gắn volume riêng chồng lên trên, mà — vì là <em>volume</em> chứ không phải bind — nó được chép nội dung của ảnh vào ở lần dùng đầu. Viết trong compose thì dễ đọc hơn hẳn:
<pre><code>services:
  web:
    build: .
    volumes:
      - .:/app                 <span class="tok-comment"># mã nguồn của bạn, sống</span>
      - /app/node_modules      <span class="tok-comment"># giữ bản của ảnh</span></code></pre>
<p>Đúng mẫu đó áp dụng cho <code>.next/</code>, <code>target/</code>, <code>__pycache__/</code>, <code>vendor/</code> — mọi thứ ảnh dựng ra mà phía máy chủ không nên đè lên.</p></div>
<h3>Chạy thử từng bước: cái bẫy trên một dự án thật, và nửa sau của nó</h3>
${slide('dk-07', 14, 'Bẫy 1: bind che node_modules — volume gắn SÂU hơn cứu nó')}
<p>Với ba file ở trên (máy Mac của khoá, ảnh có 67 gói trong <code>node_modules</code>):</p>
<pre><code class="language-bash">docker run --rm app-dev ls node_modules | wc -l
docker run --rm -v "$PWD:/app" app-dev ls /app/node_modules
docker run --rm -v "$PWD:/app" --entrypoint node app-dev server.js
docker run --rm -v "$PWD:/app" -v /app/node_modules app-dev ls /app/node_modules | wc -l
ls -la node_modules</code></pre>
<div class="out">67
ls: /app/node_modules: No such file or directory
node:internal/modules/cjs/loader:1433
  throw err;
  ^

Error: Cannot find module 'express'
Require stack:
…
67
total 0
drwxr-xr-x  2 admin  wheel   64 Sep 24 01:25 .
drwxr-xr-x@ 7 admin  wheel  224 Sep 24 01:25 ..</div>
<p>Lệnh cuối cho thấy một tác dụng phụ: để gắn thứ gì đó vào <code>/app/node_modules</code>, Docker cần thư mục đó tồn tại bên trong phần bind, nên nó tạo sẵn <strong>một thư mục <code>node_modules</code> rỗng trên máy bạn</strong>. Vô hại, nhưng nhớ để <code>node_modules</code> trong <code>.gitignore</code> và <code>.dockerignore</code>.</p>
<p>Nửa sau của cái bẫy xuất hiện một tuần sau, khi có người thêm một thư viện. Compose giữ lại volume vô danh giữa các lần chạy — chính điều đó làm nó nhanh — nên <code>node_modules</code> <em>cũ</em> quay lại kể cả sau khi build lại (máy Mac của khoá, Compose v5.5, thêm <code>dayjs</code> vào <code>package.json</code>):</p>
<pre><code class="language-bash">docker compose up -d --build
docker compose logs web | grep -m1 "Cannot find"
docker compose exec web ls node_modules | grep -c dayjs
docker compose up -d --build -V        <span class="tok-comment"># -V = --renew-anon-volumes</span>
curl -s localhost:18073</code></pre>
<div class="out">web-1  | Error: Cannot find module 'dayjs'
0
xin chao 24/09/2026</div>
<p>Ảnh đã được build lại có <code>dayjs</code>, nhưng container giữ volume vô danh cũ, vốn được chép từ ảnh <em>trước</em>. <code>-V</code> vứt volume đó đi và chép một volume mới từ ảnh mới. Thêm một chi tiết thật: volume bị thay KHÔNG bị xoá — <code>docker events</code> cho thấy nó được tạo ra và không bao giờ bị huỷ — nên sau vài lượt, <code>docker volume ls -f dangling=true</code> đáng được nhìn qua (Bài 7.2).</p>

<h3>Bẫy 2 — file thuộc quyền root xuất hiện trên máy bạn</h3>
<pre><code>docker run --rm -v "$PWD/out:/out" alpine:3.20 sh -c 'echo hi &gt; /out/made-in-container.txt'
ls -la out/</code></pre>
<div class="out">total 12
drwxr-xr-x 2 cuong cuong 4096 Aug 22 09:41 .
-rw-r--r-- 1 root  root     3 Aug 22 09:41 made-in-container.txt</div>
<p>Container chạy bằng root (uid 0), và bind mount đưa thẳng ID dạng số đi qua — không có tầng dịch nào cả. File đúng là thuộc quyền root trên máy bạn, và giờ trình soạn thảo của bạn không lưu đè lên nó được.</p>
<pre><code><span class="tok-comment"># Vá: chạy bằng đúng uid/gid của bạn</span>
docker run --rm -u "$(id -u):$(id -g)" -v "$PWD/out:/out" alpine:3.20 \\
  sh -c 'echo hi &gt; /out/mine.txt'
ls -l out/mine.txt</code></pre>
<div class="out">-rw-r--r-- 1 cuong cuong 3 Aug 22 09:43 out/mine.txt</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Vì sao <code>-u $(id -u)</code> là đủ</span><span class="v">Nhân chỉ so sánh các con SỐ. Container không có người dùng tên <code>cuong</code>, và cũng không cần — thứ rơi xuống file là cái uid dạng số.</span></div>
  <div class="kv"><span class="k">Chương trình khó chịu với uid không tên</span><span class="v">Vài công cụ gọi <code>getpwuid()</code> rồi chết. Hãy thêm <code>--user "$(id -u):$(id -g)"</code> cộng một <code>HOME</code> ghi được, hoặc thêm một người dùng khớp trong tầng dev của Dockerfile.</span></div>
  <div class="kv"><span class="k">Docker rootless né được</span><span class="v">Ở chế độ rootless (Bài 6.4), root trong container ánh xạ thành chính người dùng của bạn trên máy chủ, nên file rơi xuống mặc định đã thuộc về bạn.</span></div>
  <div class="kv"><span class="k">Docker Desktop giấu chuyện này</span><span class="v">Trên macOS và Windows tầng chia sẻ file viết lại quyền sở hữu, nên cái bẫy này không lộ ra — rồi nó lộ ra đúng vào ngày file compose đó chạy trên một runner CI chạy Linux.</span></div>
</div>
<h3>Chạy thử từng bước: cùng một lệnh trên Linux và trên Mac</h3>
${slide('dk-07', 15, 'Bẫy 2 &amp; 3: file thuộc root trên Linux, và SELinux')}
<p>Trên máy Linux (Fedora, Docker Engine 29.6, không sudo), một bước build chạy bằng root ghi vào dự án của bạn:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD/out:/out" alpine sh -c "mkdir -p /out/build &amp;&amp; echo hi &gt; /out/build/app.js"
ls -la out/build
echo sua &gt;&gt; out/build/app.js
rm -rf out/build
docker run --rm -u "$(id -u):$(id -g)" -v "$PWD/out:/out" alpine sh -c 'echo hi &gt; /out/mine.txt; id; echo HOME=$HOME'</code></pre>
<div class="out">total 4
drwxr-xr-x. 2 root      root      60 Sep 24 01:29 .
drwxr-xr-x. 3 Cuong03dx Cuong03dx 60 Sep 24 01:29 ..
-rw-r--r--. 1 root      root       3 Sep 24 01:29 app.js
zsh:4: permission denied: out/build/app.js
rm: cannot remove 'out/build/app.js': Permission denied
uid=1000 gid=1000 groups=1000
HOME=/</div>
<p>Bạn không sửa được, và cũng không xoá được: cả <em>thư mục</em> <code>build</code> cũng do root tạo. Lối thoát không cần sudo là nhờ một container (vốn là root) xoá hộ: <code>docker run --rm -v "$PWD/out:/out" alpine rm -rf /out/build</code>. Lượt chạy có <code>-u</code> cho thấy cái giá của việc chạy bằng uid của chính bạn: container không có người dùng 1000, nên <code>HOME</code> là <code>/</code> — công cụ nào muốn ghi cache vào <code>$HOME</code> sẽ cần thêm <code>-e HOME=/tmp</code>.</p>
<p>Cùng lệnh đầu tiên trên máy Mac của khoá:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD/out:/out" alpine:3.20 sh -c 'echo hi &gt; /out/made-in-container.txt; ls -ln /out'
ls -la out/</code></pre>
<div class="out">total 4
-rw-r--r--    1 0        0                3 Sep 23 18:29 made-in-container.txt
total 8
drwxr-xr-x@  3 admin  wheel   96 Sep 24 01:29 .
drwxr-xr-x@ 10 admin  wheel  320 Sep 24 01:29 ..
-rw-r--r--   1 admin  wheel    3 Sep 24 01:29 made-in-container.txt</div>
<p>Bên trong, file thuộc uid 0; trên máy Mac nó thuộc về bạn. Cơ chế chia sẻ file của Docker Desktop đổi chủ sở hữu hộ bạn, nên người dùng Mac không bao giờ thấy cái bẫy này — rồi một bạn cùng nhóm dùng Linux, hoặc runner CI, thấy. Windows với dự án nằm trong WSL2 cư xử giống Linux ở điểm này, vì đó THẬT SỰ là một hệ thống file Linux.</p>

<h3>Bẫy 3 — SELinux báo permission denied trên một phép gắn đúng</h3>
<pre><code><span class="tok-comment"># Trên máy mà dockerd chạy với --selinux-enabled (bản RHEL/CentOS, Podman) và SELinux enforcing</span>
docker run --rm -v "$PWD/conf:/etc/app" alpine:3.20 cat /etc/app/app.conf</code></pre>
<div class="out">cat: can't open '/etc/app/app.conf': Permission denied</div>
<pre><code><span class="tok-comment"># :z gán nhãn dùng chung (nhiều container), :Z riêng cho container này</span>
docker run --rm -v "$PWD/conf:/etc/app:ro,z" alpine:3.20 cat /etc/app/app.conf</code></pre>
<div class="out">listen = 0.0.0.0:8080</div>
<div class="callout"><strong>Đo thật: trên máy Fedora, cái bẫy này KHÔNG xảy ra.</strong> Máy Linux của khoá chạy Fedora 44 với SELinux <code>Enforcing</code>, vậy mà phép gắn ở trên chạy được không cần <code>:z</code>:
<pre><code class="language-bash">getenforce
docker info --format '{{.SecurityOptions}}'
docker run --rm -v "$PWD/conf:/etc/app" alpine cat /etc/app/app.conf</code></pre>
<div class="out">Enforcing
[name=seccomp,profile=builtin name=cgroupns]
listen = 0.0.0.0:8080</div>
<p>Lý do nằm ở dòng thứ hai: không có <code>name=selinux</code>. Docker CE tải từ docker.com khởi động <code>dockerd</code> mà không có <code>--selinux-enabled</code>, nên container hoàn toàn không bị SELinux giam, và <code>:z</code> không đổi gì (<code>ls -Z</code> cho cùng một nhãn trước và sau). Bạn gặp lỗi <code>Permission denied</code> ở trên trên những máy mà tiến trình nền bật SELinux — bản đóng gói của RHEL/CentOS, hoặc Podman (bật sẵn). Kiểm <code>docker info</code> trước; rồi chỉ dùng <code>:z</code> trên thư mục tạo riêng cho container.</p></div>
<div class="callout warn"><strong><code>:Z</code> gán lại nhãn cho thư mục máy chủ theo cách đệ quy và vĩnh viễn.</strong> Trỏ nó vào <code>$HOME</code> hay <code>/usr</code> là bạn mất cả buổi chiều đi sửa lại nhãn SELinux cho những file chương trình khác cần. Hãy dùng <code>:z</code> (chữ thường, dùng chung) trên thư mục tạo riêng cho container, và đừng bao giờ dùng trên thư mục thuộc về hệ thống.</div>

<h3>Thêm một cái bẫy, từ một sự cố thật: một file đơn được gắn theo inode</h3>
${slide('dk-07', 16, 'Gắn MỘT FILE là gắn theo INODE — sự cố thật')}
<p>Một dự án sinh viên chạy nginx trong Docker với một file được bind mount: <code>./nginx/nginx.conf:/etc/nginx/nginx.conf:ro</code>. Script deploy cập nhật file đó trên máy chủ bằng <code>mv new.conf nginx.conf</code>, chạy <code>nginx -t</code> rồi <code>nginx -s reload</code> — tất cả xanh — và không có gì thay đổi. Hai lần liền. Bước kiểm cấu hình còn "đạt" trên một cấu hình chưa từng được deploy. Đây là lý do, dựng lại trên máy Linux của khoá:</p>
<pre><code class="language-bash">cat &gt; nginx.conf &lt;&lt;'EOF'
events {}
http { server { listen 80; location / { return 200 "phien ban 1\\n"; } } }
EOF
docker run -d --name ngx -p 18071:80 -v "$PWD/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:1.27-alpine
curl -s localhost:18071
ls -i nginx.conf; sed -i "s/phien ban 1/phien ban 2/" nginx.conf; ls -i nginx.conf
docker exec ngx grep return /etc/nginx/nginx.conf
docker exec ngx nginx -s reload; curl -s localhost:18071</code></pre>
<div class="out">phien ban 1
20266 nginx.conf
20269 nginx.conf
http { server { listen 80; location / { return 200 "phien ban 1\\n"; } } }
2026/09/23 18:28:44 [notice] 37#37: signal process started
phien ban 1</div>
<p>Con số đứng trước tên file là <strong>inode</strong> (nút chỉ mục): danh tính của file trên đĩa. Một cái tên trong thư mục chỉ là con trỏ tới một inode. Khi Docker bind mount MỘT FILE, nhân gắn chính inode đó, vào lúc container khởi động. <code>sed -i</code> (cũng như <code>mv</code>, <code>rsync</code>, chế độ "lưu an toàn" của nhiều trình soạn thảo) không sửa file: nó ghi ra một file mới có inode mới (20269) rồi đổi tên đè lên tên cũ. Thư mục giờ trỏ tới 20269; container vẫn cầm 20266 — nội dung CŨ, vẫn sống vì còn có kẻ đang mở nó. Nginx nạp lại cấu hình cũ một cách hoàn hảo.</p>
${slide('dk-07', 17, 'Sửa file đã gắn đơn lẻ: cái nào container thấy')}
<p>Từng cách sửa, đo trên cả hai máy (máy Mac dùng Docker Desktop 4.91 với VirtioFS):</p>
<table>
<tr><th>Cách bạn sửa file trên máy</th><th>Inode</th><th>Linux: container thấy</th><th>Mac: container thấy</th></tr>
<tr><td><code>sed -i …</code></td><td>mới</td><td>nội dung cũ</td><td><code>No such file or directory</code></td></tr>
<tr><td><code>mv file.moi file</code></td><td>mới</td><td>nội dung cũ</td><td><code>No such file or directory</code></td></tr>
<tr><td><code>cat file.moi &gt; file</code> (ghi đè tại chỗ)</td><td>giữ</td><td>nội dung mới (sau reload)</td><td>nội dung mới (sau reload)</td></tr>
<tr><td>vim 9.2 <code>:wq</code> (cấu hình mặc định)</td><td>giữ</td><td>nội dung mới</td><td>(chưa đo)</td></tr>
<tr><td>Gắn cả <strong>thư mục</strong>, rồi <code>sed -i</code></td><td>mới</td><td>nội dung mới</td><td>nội dung mới</td></tr>
</table>
<p>Hai chi tiết khiến sự cố tệ hơn một chữ "cấu hình cũ". Thứ nhất, một khi inode đã đổi, ghi đè tại chỗ cũng không cứu được nữa — container vẫn dính vào inode cũ cho tới khi được <strong>restart</strong>. Thứ hai, trên Mac lỗi to hơn nhưng lạ hơn: <code>grep</code> trong container nói file không tồn tại, trong khi <code>stat</code> vẫn báo inode 72. Và cùng vấn đề danh tính đó làm hỏng cả trình theo dõi file dù gắn cả thư mục: sau một lần <code>sed -i</code> trên <code>server.js</code>, <code>node --watch</code> chạy lại một lần rồi không bao giờ chạy lại nữa trên Linux, và không chạy lại lần nào trên Mac.</p>
<div class="callout ok"><strong>Cách chữa, cái tốt nhất trước.</strong> (1) Gắn THƯ MỤC, không gắn file: <code>./nginx/conf.d:/etc/nginx/conf.d:ro</code> — thư mục thì được tra theo TÊN mỗi lần. (2) Nếu buộc phải gắn một file, hãy ghi đè tại chỗ (<code>cat new.conf &gt; nginx.conf</code>), rồi kiểm từ BÊN TRONG: <code>docker exec ngx sha256sum /etc/nginx/nginx.conf</code> phải bằng <code>sha256sum nginx.conf</code> trên máy. Lệch nghĩa là phải restart container. (3) Với vim, <code>:set backupcopy=yes</code> bảo đảm ghi tại chỗ bất kể cấu hình mặc định.</div>
<pre><code class="language-bash"><span class="tok-comment"># phép kiểm lẽ ra đã bắt được sự cố (Linux, sau một lần mv)</span>
echo v1 &gt; f.txt
docker run -d --name ftest -v "$PWD/f.txt:/f.txt:ro" alpine sleep 120
echo v2 &gt; f.moi; mv f.moi f.txt
docker exec ftest cat /f.txt
docker exec ftest sha256sum /f.txt; sha256sum f.txt</code></pre>
<div class="out">v1
2d27fbdf4e8ca207afbfa388ca9172fbcc6c70e534af2476b3b704f87debadcf  /f.txt
81db67b6a5702b9b68f0016f061c409bf3fb16d062fc854d1b424bb4e9c28c56  f.txt</div>
<p class="note-ct">Một file thử <code>f.txt</code> (nội dung <code>v1</code>) gắn theo cùng cách rồi bị thay bằng <code>mv</code>: container vẫn đọc <code>v1</code>, và hai mã băm khác nhau — container không đọc thứ máy chủ đang có. Với nginx, phép kiểm tương ứng là <code>docker exec ngx sha256sum /etc/nginx/nginx.conf</code> so với <code>sha256sum nginx.conf</code>. Bài học chung: "đã ghi" và "lệnh trả về 0" không có nghĩa là "đã có hiệu lực" — hãy kiểm từ phía đang dùng nó.</p>

<h3>Bẫy 4 — bind mount chậm trên macOS và Windows</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Linux</span><span class="lz-t">tốc độ gốc — vẫn là cùng một hệ thống file</span><span class="lz-d">Bind mount không tốn gì; nhân chỉ đang cho container xem một thư mục nó vốn đã có. Không chép, không giao thức, không có tiến trình nền nào chen giữa.</span></div>
  <div class="lz-step"><span class="lz-k">macOS / Windows</span><span class="lz-t">vượt ranh giới máy ảo ở MỌI thao tác file</span><span class="lz-d">Docker Desktop chạy một máy ảo Linux; file của bạn nằm trên hệ điều hành chủ. Mỗi lần stat và read là một vòng đi-về. Một <code>node_modules</code> 40.000 file cảm nhận ngay lập tức.</span></div>
  <div class="lz-step"><span class="lz-k">Giảm nhẹ: VirtioFS</span><span class="lz-t">Docker Desktop → Settings → General</span><span class="lz-d">Nhanh gấp mấy lần gRPC-FUSE đời trước. Bản gần đây bật sẵn; hãy kiểm nó trước khi kết luận Docker chậm.</span></div>
  <div class="lz-step"><span class="lz-k">Giảm nhẹ: giữ gói phụ thuộc ra khỏi bind</span><span class="lz-t">mẹo volume vô danh ở Bẫy 1</span><span class="lz-d">Ở đây đáng gấp đôi: <code>node_modules</code> nằm trong volume tức là nằm trong hệ thống file của chính máy ảo, chạy ở tốc độ gốc, còn mã nguồn của bạn vẫn sửa sống được.</span></div>
</div>
${slide('dk-07', 18, 'Bind mount trên Mac chậm ~12 lần — trên Linux thì như nhau')}
<h3>Đo thật: chậm bao nhiêu, trên máy nào</h3>
<p>Một script Node nhỏ ghi, stat, đọc rồi xoá 2 000 file 4 KB trong 100 thư mục — hình dạng của một <code>node_modules</code> nhỏ — chạy trong <code>node:22-alpine</code> ba lần trên mỗi đích (lấy trung vị, 09/2026):</p>
<table>
<tr><th>Máy · đích</th><th>ghi</th><th>stat</th><th>đọc</th><th>xoá</th><th>tổng</th></tr>
<tr><td>Mac M1 · bind mount (VirtioFS)</td><td>1273 ms</td><td>149 ms</td><td>396 ms</td><td>422 ms</td><td><strong>2240 ms</strong></td></tr>
<tr><td>Mac M1 · volume có tên</td><td>92 ms</td><td>8 ms</td><td>31 ms</td><td>53 ms</td><td><strong>184 ms</strong></td></tr>
<tr><td>Linux · bind mount (btrfs)</td><td>30 ms</td><td>5 ms</td><td>13 ms</td><td>56 ms</td><td><strong>104 ms</strong></td></tr>
<tr><td>Linux · volume có tên</td><td>31 ms</td><td>4 ms</td><td>14 ms</td><td>61 ms</td><td><strong>110 ms</strong></td></tr>
</table>
<p>Trên Mac, bind mount chậm hơn volume khoảng mười hai lần, và dao động — bước ghi chạy từ 830 tới 2 081 ms qua ba lượt. Trên Linux hai cái như nhau, vì bind mount ở đó là cùng một nhân đang cho xem cùng một cái đĩa. Volume trên Mac nằm trên đĩa ext4 riêng của máy ảo (<code>/dev/vda1 … ext4</code> trong <code>/proc/mounts</code>), nên cũng nhanh. Nguồn đo là script sau; bạn chạy lại được trên máy mình:</p>
<pre><code class="language-bash"><span class="tok-comment"># bench.js — chạy: docker run --rm -v "$PWD:/p" node:22-alpine node /p/bench.js /p</span>
<span class="tok-comment">#            và:  docker run --rm -v bench:/v -v "$PWD:/p:ro" node:22-alpine node /p/bench.js /v</span>
const fs = require('fs'), path = require('path');
const T = path.join(process.argv[2], 'bench'), buf = Buffer.alloc(4096, 97);
const files = []; for (let d = 0; d &lt; 100; d++) for (let f = 0; f &lt; 20; f++) files.push(path.join(T, 'd' + d, 'f' + f + '.js'));
let t = Date.now(); for (let d = 0; d &lt; 100; d++) fs.mkdirSync(path.join(T, 'd' + d), { recursive: true }); for (const f of files) fs.writeFileSync(f, buf); const w = Date.now() - t;
t = Date.now(); for (const f of files) fs.statSync(f); const s = Date.now() - t;
t = Date.now(); for (const f of files) fs.readFileSync(f); const r = Date.now() - t;
t = Date.now(); fs.rmSync(T, { recursive: true }); const x = Date.now() - t;
console.log('ghi ' + w + ' ms · stat ' + s + ' ms · doc ' + r + ' ms · xoa ' + x + ' ms');</code></pre>
<table>
<tr><th>Máy của bạn</th><th>Để cái gì ở đâu</th></tr>
<tr><td>Linux</td><td>Đâu cũng được. Bind mount không tốn gì; chọn theo vòng đời, không theo tốc độ.</td></tr>
<tr><td>Mac</td><td>Mã nguồn để trên bind mount (cần sửa sống); <code>node_modules</code>, <code>.next</code>, cache build và file CSDL để trong volume.</td></tr>
<tr><td>Windows + WSL2</td><td>Clone dự án vào <em>bên trong</em> WSL2 (<code>\\\\wsl$\\Ubuntu\\home\\ban\\project</code> trong Explorer, <code>~/project</code> trong shell) và chạy <code>docker compose</code> từ đó. Khoá chưa đo được trên máy Windows; hướng dẫn WSL của Docker nói hiệu năng "cao hơn nhiều" khi ở hệ thống file Linux so với <code>/mnt/c</code>, và inotify chỉ chạy ở đó.</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn cùng nhóm clone dự án về máy Mac và <code>docker compose up</code> chết với <code>Cannot find module 'express'</code>; một bạn khác sửa cấu hình nginx trên VPS của nhóm bằng <code>sed -i</code> và thề là nó "không ăn". Hãy chữa cái đầu, chứng minh cái sau.</p><ol>
<li>Trong <code>~/thu-docker/ch07/app</code>, tạo ba file ở mục "một vòng tự-nạp-lại" phía trên và <code>docker build -t thu-app .</code>.</li>
<li>Chạy <code>docker run --rm -v "$PWD:/app" thu-app</code> và đọc lỗi; rồi thêm <code>-v /app/node_modules</code>, <code>-p 18070:3000</code>, <code>-d --name thu-dev</code> và kiểm <code>curl localhost:18070</code>.</li>
<li>Nối một dòng vào <code>server.js</code> bằng <code>echo … &gt;&gt;</code>, xác nhận việc chạy lại trong <code>docker logs thu-dev</code>. Rồi chạy <code>sed -i.bak 's/v1/v2/' server.js</code> (chạy được cả trên Mac lẫn Linux) và xem lần sửa kế tiếp nó còn tự chạy lại không.</li>
<li>Trong <code>~/thu-docker/ch07/ngx</code>, tái hiện phép gắn file đơn bằng khối lệnh nginx ở trên (container <code>thu-ngx</code>, cổng 18071), sửa bằng <code>sed -i.bak</code>, so <code>sha256sum</code> bên trong và bên ngoài. Rồi gắn cả <em>thư mục</em> thay vào và làm lại.</li>
<li>Dọn: <code>docker rm -f thu-dev thu-ngx</code>, <code>docker rmi thu-app</code>, xoá các thư mục.</li></ol>
<p><strong>Đạt khi:</strong> <code>curl</code> trả lời sau khi vá <code>node_modules</code>; với phép gắn file đơn, bạn đưa ra được hai giá trị sha256 không khớp (trên Mac lệnh bên trong báo <code>No such file or directory</code> thay vào đó) và với phép gắn thư mục, một cặp khớp nhau; và <code>docker ps -a --filter name=thu-</code> rỗng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Shadowing (che khuất)</span><span class="v">Một phép gắn che mất thứ ảnh có ở đường dẫn đó; không có gì bị xoá.</span></div>
  <div class="kv"><span class="k">Inode (nút chỉ mục)</span><span class="v">Danh tính của file trên đĩa; tên trong thư mục chỉ trỏ tới nó. Bind mount một file là gắn vào inode.</span></div>
  <div class="kv"><span class="k">inotify (thông báo đổi file)</span><span class="v">Cơ chế báo file thay đổi của Linux, thứ mà <code>node --watch</code>, nodemon dựa vào.</span></div>
  <div class="kv"><span class="k">UID / GID (mã người dùng / nhóm)</span><span class="v">Những con số nhân dùng để so quyền sở hữu; trên Linux chúng đi thẳng qua bind mount.</span></div>
  <div class="kv"><span class="k">VirtioFS (chia sẻ file vào máy ảo)</span><span class="v">Cách Docker Desktop đưa thư mục Mac vào máy ảo Linux; tiện, và chậm hơn volume.</span></div>
  <div class="kv"><span class="k">WSL2 (Linux trong Windows)</span><span class="v">Môi trường Linux bên trong Windows; để dự án trong hệ thống file của nó, không phải <code>/mnt/c</code>.</span></div>
  <div class="kv"><span class="k"><code>:z</code> / <code>:Z</code> (gán nhãn SELinux)</span><span class="v">Tuỳ chọn gán lại nhãn SELinux cho bind mount: dùng chung / riêng. Chỉ có tác dụng khi tiến trình nền bật SELinux.</span></div>
  <div class="kv"><span class="k"><code>-V</code> (<code>--renew-anon-volumes</code>)</span><span class="v">Cờ của compose tạo lại volume vô danh để <code>node_modules</code> của ảnh mới được dùng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bind mount cho thấy thư mục của bạn y nguyên và không bao giờ chép: nó che <code>node_modules</code> của ảnh; một volume vô danh gắn sâu hơn mang nó trở lại, và <code>compose up -V</code> làm mới nó sau khi đổi thư viện.</li>
<li>Trên Linux UID dạng số đi thẳng qua: chạy với <code>-u "$(id -u):$(id -g)"</code> hoặc dọn file của root qua một container.</li>
<li>Lỗi SELinux chỉ có khi tiến trình nền bật SELinux — kiểm <code>docker info</code> trước khi với tới <code>:z</code>, và đừng bao giờ <code>:Z</code> một thư mục hệ thống.</li>
<li>Gắn một file đơn là gắn theo inode: <code>sed -i</code>/<code>mv</code> để container lại với nội dung cũ (Linux) hoặc một file biến mất (Mac) cho tới khi restart — hãy gắn thư mục, hoặc ghi đè tại chỗ rồi kiểm sha256 từ bên trong.</li>
<li>Trên Mac bind mount chậm hơn volume ~12 lần; trên Linux như nhau — thư mục nặng để trong volume khi dùng Mac/Windows.</li>
<li>Trên Windows hãy để dự án trong WSL2, không thì mất cả tốc độ lẫn inotify.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/storage/bind-mounts/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Bind mounts</span><span class="lc-sub">Danh sách đầy đủ tuỳ chọn gồm <code>ro</code>, <code>z</code>/<code>Z</code>, và các chế độ bind propagation, cộng với cảnh báo chính thức về việc gắn đè lên một thư mục đã có trong container.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/desktop/settings-and-maintenance/settings/#file-sharing" target="_blank" rel="noopener">
  <span class="lc-ico">🍎</span>
  <span class="lc-body"><span class="lc-title">Docker Desktop — chia sẻ file &amp; VirtioFS</span><span class="lc-sub">Thư mục nào chia sẻ được, cách đổi cơ chế chia sẻ file, và đặc tính hiệu năng của từng cái. Hãy đọc trang này trước khi tối ưu bất cứ thứ gì khác trên máy Mac.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chữa một phép gắn dev hỏng</span><span class="lc-sub">Bài chấm điểm: tái hiện cảnh <code>node_modules</code> biến mất rồi vá bằng volume vô danh, bắt container ghi ra file thuộc quyền bạn, và chọn giữa <code>:ro</code>, <code>:z</code> và <code>:Z</code> cho bốn tình huống.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng bind mount cho thư mục dữ liệu của cơ sở dữ liệu chỉ vì nhìn thấy file cho tiện. Trên Linux nó phần lớn chạy được và cho bạn một thư mục mà sớm muộn bạn sẽ lỡ tay <code>rm -rf</code>; trên macOS và Windows nó đi qua tầng chia sẻ file, nơi những giả định của Postgres về thứ tự <code>fsync</code> và khoá file KHÔNG được bảo đảm — kết quả đã được ghi thành tài liệu là HỎNG DỮ LIỆU, không phải chậm. Ảnh Postgres chính thức gắn một <em>volume</em> vào <code>/var/lib/postgresql/data</code> đúng vì lý do này. Nếu bạn muốn nhìn file, lệnh <code>docker run --rm -v pg-data:/d -v "$PWD:/out" alpine tar -C /d -cf /out/pg.tar .</code> cho bạn một bản chép mà không đặt cơ sở dữ liệu đang sống lên nhầm hệ thống file.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Bind mount luôn thắng nội dung của ảnh và không bao giờ chép gì — riêng luật đó giải thích cảnh <code>node_modules</code> biến mất, và một volume vô danh gắn sâu hơn chính là cách vá. Trên Linux uid dạng số đi thẳng qua, nên <code>-u "$(id -u):$(id -g)"</code> là thứ giữ cho file thuộc quyền root không rơi vào cây làm việc của bạn. Và trên macOS hay Windows mọi thao tác file đều vượt ranh giới máy ảo: hãy giữ thư mục gói phụ thuộc trong volume, đừng để trên bind.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — tmpfs, read-only roots, and secrets|||7.4 — tmpfs, gốc chỉ đọc, và bí mật',
      slug: 'dk-7-4-tmpfs-bi-mat',
      type: 'LESSON',
      description: 'Gắn tmpfs trong bộ nhớ, chạy container với hệ thống file gốc chỉ đọc và những chỗ ghi được tối thiểu, /dev/shm, và bốn cách đưa bí mật vào container xếp theo mức độ rò rỉ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>tmpfs, read-only roots, and secrets</h2>
<p class="lead">Two ideas that pair naturally: make the container's filesystem read-only so nothing unexpected can be written, then punch small tmpfs holes exactly where the application genuinely needs to write. What you get is a container where an attacker cannot drop a binary, and where nothing sensitive touches a disk that outlives the process.</p>

<h3>A tmpfs mount is memory pretending to be a directory</h3>
${slide('dk-07', 19, 'tmpfs là RAM — không đặt size thì trần = nửa RAM máy')}
<pre><code>docker run --rm --tmpfs /scratch:rw,size=64m,mode=1777 alpine:3.20 \\
  sh -c 'df -h /scratch; dd if=/dev/zero of=/scratch/f bs=1M count=8 2&gt;&amp;1 | tail -1'</code></pre>
<div class="out">Filesystem                Size      Used Available Use% Mounted on
tmpfs                    64.0M         0     64.0M   0% /scratch
8+0 records in
8+0 records out
8388608 bytes (8.0MB) copied, 0.004291 seconds, 1.8GB/s</div>
<pre><code><span class="tok-comment"># The size cap is real — and it counts against the container's memory limit</span>
docker run --rm --tmpfs /scratch:size=8m alpine:3.20 \\
  dd if=/dev/zero of=/scratch/big bs=1M count=16 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">dd: writing '/scratch/big': No space left on device
8+0 records out</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Always set <code>size=</code></span><span class="v">An uncapped tmpfs can grow until it consumes the container's memory limit, and the OOM killer takes the main process, not the files. A cap turns a slow mystery into an immediate <code>ENOSPC</code>.</span></div>
  <div class="kv"><span class="k">It counts as memory</span><span class="v">A 512MB tmpfs inside a container with <code>-m 512m</code> is a container that can OOM by writing files. Budget them together.</span></div>
  <div class="kv"><span class="k">Linux containers only</span><span class="v"><code>--tmpfs</code> and <code>--mount type=tmpfs</code> do not exist for Windows containers. On Docker Desktop for Mac/Windows running Linux containers, it works normally — the memory is the VM's.</span></div>
  <div class="kv"><span class="k">Gone at stop — and at restart</span><span class="v">Stopping and starting the same container gives a fresh, empty tmpfs, and so does <code>docker restart</code> (measured below — an earlier version of this heading said "not at restart", which is wrong). Nothing survives; that is the feature.</span></div>
</div>
<h3>Run it step by step: default size, default options, restart, and the memory bill</h3>
<p>Four facts that are easy to get wrong, each measured on the course's Mac (Docker Desktop VM with 7.7 GiB of RAM):</p>
<pre><code class="language-bash"><span class="tok-comment"># 1. no size= : the cap is half of the machine's RAM, not the container's</span>
docker run --rm --tmpfs /scratch alpine:3.20 df -h /scratch
<span class="tok-comment"># 2. default mount options</span>
docker run --rm --tmpfs /x alpine:3.20 sh -c 'cp /bin/busybox /x/b; /x/b true; echo "exit=$?"; grep " /x " /proc/mounts'</code></pre>
<div class="out">Filesystem                Size      Used Available Use% Mounted on
tmpfs                     3.9G         0      3.9G   0% /scratch
sh: /x/b: Permission denied
exit=126
tmpfs /x tmpfs rw,nosuid,nodev,noexec,relatime 0 0</div>
<p>A tmpfs is mounted <code>noexec</code>: files there cannot be run (exit 126, "Permission denied"). That matters with <code>--read-only</code> below, because some tools unpack a helper binary into <code>/tmp</code> and run it. If yours does, add <code>exec</code>: <code>--tmpfs /tmp:exec,size=64m</code>.</p>
<pre><code class="language-bash"><span class="tok-comment"># 3. does restart keep it?</span>
docker run -d --name tmp --tmpfs /scratch:size=8m alpine:3.20 sleep 600
docker exec tmp sh -c 'echo "phien lam viec" &gt; /scratch/s.txt; echo x &gt; /layer.txt; ls /scratch'
docker restart tmp
docker exec tmp sh -c 'ls -la /scratch; cat /layer.txt'</code></pre>
<div class="out">s.txt
total 4
drwxr-xr-x    2 root     root            40 Sep 23 18:31 .
drwxr-xr-x    1 root     root          4096 Sep 23 18:31 ..
x</div>
<p>After <code>restart</code> the tmpfs is empty, while the file written to the writable layer (<code>/layer.txt</code>) is still there. A restart is a stop plus a start, and every start mounts a fresh tmpfs.</p>
${slide('dk-07', 20, 'tmpfs tính vào trần --memory: không đặt size ⇒ bị giết OOM')}
<pre><code class="language-bash"><span class="tok-comment"># 4. files in tmpfs are counted as the container's memory</span>
docker run --name tmpoom --memory 128m --memory-swap 128m --tmpfs /scratch alpine:3.20 \\
  sh -c 'dd if=/dev/zero of=/scratch/big bs=1M count=200; echo "dd xong, exit=$?"; df -h /scratch | tail -1'
docker inspect -f 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}' tmpoom
docker run --rm --memory 128m --memory-swap 128m --tmpfs /scratch:size=64m alpine:3.20 \\
  sh -c 'dd if=/dev/zero of=/scratch/big bs=1M count=200 2&gt;&amp;1 | head -1; echo "shell van song"'</code></pre>
<div class="out">Killed
dd xong, exit=137
tmpfs                     3.9G    125.6M      3.8G   3% /scratch
OOMKilled=true ExitCode=0
dd: error writing '/scratch/big': No space left on device
shell van song</div>
<p>Read it slowly. Without <code>size=</code> the tmpfs would have allowed 3.9G, but the container may only use 128 MB of memory, and the 125.6M of file data <em>is</em> memory. With no swap to push it to, the kernel's OOM killer picked a process — here <code>dd</code> (exit 137 = 128 + SIGKILL) — and Docker records <code>OOMKilled=true</code> even though the container's main shell exited 0. With <code>size=64m</code> the same write simply fails with "No space left on device" and everything else keeps running. Rule: <strong>size &lt; --memory</strong>, with room left for the application itself.</p>
<table>
<tr><th>Option</th><th><code>--tmpfs</code> form</th><th><code>--mount type=tmpfs</code> form</th><th>Default</th></tr>
<tr><td>Size cap</td><td><code>size=64m</code></td><td><code>tmpfs-size=64m</code></td><td>half of the host's RAM</td></tr>
<tr><td>Permissions of the mount point</td><td><code>mode=1777</code></td><td><code>tmpfs-mode=1777</code></td><td><code>755</code> (root-only write)</td></tr>
<tr><td>Allow running files</td><td><code>exec</code></td><td>(use <code>--tmpfs</code> for this)</td><td><code>noexec</code></td></tr>
</table>

<h3>Read-only root plus writable holes</h3>
${slide('dk-07', 21, '--read-only: bật lên, để nó chết, đọc lỗi, khoét đúng lỗ')}
<pre><code>docker run --rm --read-only alpine:3.20 sh -c 'touch /tmp/x'</code></pre>
<div class="out">touch: /tmp/x: Read-only file system</div>
<pre><code><span class="tok-comment"># Give it back exactly what it needs, and nothing more</span>
docker run --rm --read-only \\
  --tmpfs /tmp:rw,size=32m \\
  --tmpfs /run:rw,size=8m \\
  -v app-cache:/var/cache/app \\
  nginx:alpine sh -c 'touch /tmp/ok &amp;&amp; echo writable: /tmp; touch /etc/nope'</code></pre>
<div class="out">writable: /tmp
touch: /etc/nope: Read-only file system</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Turn it on and let it fail</span><span class="lz-t">--read-only, then read the errors</span><span class="lz-d">The application tells you exactly which paths it needs. That list is almost always shorter than you expect: a temp directory, a pid or socket directory, sometimes a cache.</span></div>
  <div class="lz-step"><span class="lz-k">2 · tmpfs for ephemeral paths</span><span class="lz-t">/tmp, /run, /var/run</span><span class="lz-d">These should not survive a restart anyway. Putting them in memory is both safer and faster than a writable layer.</span></div>
  <div class="lz-step"><span class="lz-k">3 · A volume for anything that must persist</span><span class="lz-t">caches, uploads, database files</span><span class="lz-d">If losing it on restart would be a bug, it is a volume, not a tmpfs. The distinction is the whole decision.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Verify with the app running, not at startup</span><span class="lz-t">exercise the write paths</span><span class="lz-d">Many programs only touch their temp directory under load — file uploads, session writes, log rotation. A container that starts cleanly can still fail on the first upload.</span></div>
</div>
<p>Combined with the non-root user from Lesson 6.4, a read-only root removes an entire category of post-exploitation step: an attacker with code execution cannot write a payload to disk, cannot modify a binary, and cannot persist anything across a restart. It is one flag, and it is one of the highest-value ones Docker has.</p>
<h3>Run it step by step: nginx under --read-only</h3>
<p>The four steps above, on the official nginx image (course's Mac, port 18072):</p>
<pre><code class="language-bash">docker run -d --name ro --read-only -p 18072:80 nginx:1.27-alpine
docker ps -a --filter name=ro --format '{{.Names}} {{.Status}}'
docker logs ro 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">ro Exited (1) 2 seconds ago
2026/09/23 18:31:58 [emerg] 1#1: mkdir() "/var/cache/nginx/client_temp" failed (30: Read-only file system)
nginx: [emerg] mkdir() "/var/cache/nginx/client_temp" failed (30: Read-only file system)</div>
<p>Step 1 done: nginx told us exactly one path. Fix only that one (<code>--tmpfs /var/cache/nginx:size=32m</code>) and the next attempt names the second: <code>nginx: [emerg] open() "/run/nginx.pid" failed (30: Read-only file system)</code> — the pid file. So step 2 is two small tmpfs mounts:</p>
<pre><code class="language-bash">docker rm ro
docker run -d --name ro --read-only \\
  --tmpfs /var/cache/nginx:size=32m --tmpfs /run:size=1m \\
  -p 18072:80 nginx:1.27-alpine
curl -s -o /dev/null -w '%{http_code}\\n' localhost:18072
docker logs ro 2&gt;&amp;1 | grep -i "read-only"
docker exec ro sh -c 'touch /etc/nginx/x; echo &gt; /usr/share/nginx/html/index.html'</code></pre>
<div class="out">200
10-listen-on-ipv6-by-default.sh: info: can not modify /etc/nginx/conf.d/default.conf (read-only file system?)
touch: /etc/nginx/x: Read-only file system
sh: can't create /usr/share/nginx/html/index.html: Read-only file system</div>
<p>The site answers 200. The one info line comes from an entrypoint script that wants to edit the default config to add IPv6 — harmless here, and a nice example of why you read the logs rather than trust "it started". The last command is the security benefit in one line: someone who gets a shell in this container cannot change the config or deface the page.</p>

<h3>/dev/shm, the mount you forget until Chrome crashes</h3>
<pre><code>docker run --rm alpine:3.20 df -h /dev/shm
docker run --rm --shm-size=1g alpine:3.20 df -h /dev/shm</code></pre>
<div class="out">Filesystem                Size      Used Available Use% Mounted on
shm                      64.0M         0     64.0M   0% /dev/shm
shm                       1.0G         0      1.0G   0% /dev/shm</div>
<p>Docker gives every container a 64MB <code>/dev/shm</code>. That is fine for most things and far too small for a headless browser — Chromium under Playwright or Puppeteer uses shared memory for renderer processes and dies with a confusing <code>Target closed</code> or a bare tab crash when it runs out. If you run browsers in containers, <code>--shm-size=1g</code> (or <code>shm_size: 1gb</code> in compose) is the fix, and the reason to know about it is that nothing in the error message mentions shared memory.</p>

<h3>Four ways to get a secret into a container, worst to best</h3>
${slide('dk-07', 22, 'Bí mật: biến môi trường hiện NGUYÊN trong docker inspect')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">❌ Baked into the image</span><span class="lz-lnote">An <code>ENV</code> or a copied <code>.env</code> in a layer. Anyone who can pull the image has the secret, forever, in a layer you cannot delete (Lesson 6.1). This is the one that ends up on a public registry.</span></div>
  <div class="lz-layer"><span class="lz-lname">⚠️ <code>-e SECRET=…</code> on the command line</span><span class="lz-lnote">Visible in <code>docker inspect</code>, in <code>ps</code> output on the host, and in your shell history. Workable for development, wrong for production.</span></div>
  <div class="lz-layer"><span class="lz-lname">✅ <code>--env-file</code> from a file the host protects</span><span class="lz-lnote">The values are not on the command line and not in shell history. Still visible in <code>docker inspect</code>. This is what this project uses: <code>/opt/cuonghoangdev/.env</code>, mode 600, loaded at deploy time and excluded from rsync so it survives.</span></div>
  <div class="lz-layer"><span class="lz-lname">✅✅ A file on tmpfs, or a real secrets manager</span><span class="lz-lnote">Mount the secret as a file into a tmpfs path, or use Swarm/Kubernetes secrets, or fetch it at startup from Vault or a cloud secrets manager. It never lands on disk, never appears in <code>inspect</code>, and can be rotated without rebuilding anything.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># what "visible in docker inspect" means, literally (course's Mac)</span>
docker run -d --name api -e DB_PASSWORD=matkhau-that-123 alpine:3.20 sleep 600
docker inspect -f '{{json .Config.Env}}' api</code></pre>
<div class="out">["DB_PASSWORD=matkhau-that-123","PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"]</div>
<p>No privilege beyond "can talk to the Docker socket" is needed, and <code>--env-file</code> ends up in exactly the same field. A note on the second row of the ladder: with <code>docker run -d</code> the CLI exits at once, so the command line is only briefly visible in the host's <code>ps</code>; the lasting leaks are <code>inspect</code> and your shell history (<code>~/.zsh_history</code>).</p>
<pre><code><span class="tok-comment"># The tmpfs-file pattern, without any extra infrastructure</span>
docker run -d --name api \\
  --tmpfs /run/secrets:rw,size=1m,mode=0700 \\
  --env-file /opt/app/.env \\
  api:1.4.2
docker exec -i api sh -c 'cat &gt; /run/secrets/jwt.key' &lt; /opt/app/jwt.key   <span class="tok-comment"># through the process: lands in the tmpfs (NOT docker cp — see below)</span>

<span class="tok-comment"># Confirm it is not on any disk the container can persist to</span>
docker exec api sh -c 'df -h /run/secrets | tail -1'</code></pre>
<div class="out">tmpfs                     1.0M      4.0K   1020.0K   0% /run/secrets</div>
<h3>Why not docker cp? It writes under the tmpfs, onto the disk</h3>
${slide('dk-07', 23, 'docker cp vào tmpfs báo thành công — nhưng file rơi xuống ĐĨA')}
<p>An earlier version of this lesson copied the key with <code>docker cp jwt.key api:/run/secrets/jwt.key</code>. It looks right, returns 0 — and does the opposite of what the pattern is for. Measured on the Mac and repeated on the Linux machine with the same result:</p>
<pre><code class="language-bash">docker run -d --name sec --tmpfs /run/secrets:rw,size=1m,mode=0700 alpine:3.20 sleep 600
docker cp jwt.key sec:/run/secrets/jwt.key; echo "cp exit=$?"
docker exec sec ls -la /run/secrets
docker exec sec df -h /run/secrets | tail -1
docker diff sec</code></pre>
<div class="out">cp exit=0
total 4
drwx------    2 root     root            40 Sep 23 18:32 .
drwxr-xr-x    1 root     root          4096 Sep 23 18:32 ..
tmpfs                     1.0M         0      1.0M   0% /run/secrets
C /run
A /run/secrets
A /run/secrets/jwt.key</div>
<p>The tmpfs is empty, and <code>docker diff</code> shows <code>A /run/secrets/jwt.key</code>: the file was written into the container's <em>writable layer</em>, underneath the tmpfs, where the process cannot see it and where it stays on disk until the container is removed. The <code>docker cp</code> reference says so in its corner cases: it cannot copy to tmpfs or to mounts created inside the container. Write through a process in the container instead:</p>
<pre><code class="language-bash">docker exec -i sec sh -c 'cat &gt; /run/secrets/jwt.key' &lt; jwt.key
docker exec sec df -h /run/secrets | tail -1
docker diff sec</code></pre>
<div class="out">tmpfs                     1.0M      4.0K   1020.0K   0% /run/secrets
C /run
A /run/secrets</div>
<p>(Fresh container for this second run.) 4.0K used in the tmpfs, and nothing under <code>/run/secrets</code> in the writable layer except the mount point itself. In compose, the <code>secrets:</code> key does the file-delivery part for you: each secret appears read-only at <code>/run/secrets/&lt;name&gt;</code>, taken from a file on the host — out of <code>inspect</code> and out of the image.</p>
<div class="callout warn"><strong>Build-time secrets are a separate problem with a separate answer.</strong> Never pass a token via <code>ARG</code> — it is recorded in the image history and readable with <code>docker history</code>. Use <code>RUN --mount=type=secret,id=npmrc</code> instead (Lesson 6.1): BuildKit mounts the file for that one instruction and it never enters a layer.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> before the group demo, your lecturer asks how you would stop an attacker who gets into the web container from changing files, and where the JWT signing key lives. Harden an nginx container and deliver a secret the right way — and prove both.</p><ol>
<li>Run <code>nginx:1.27-alpine</code> as <code>thu-ro</code> with <code>--read-only -p 18072:80</code>. It exits: find the path in <code>docker logs</code>.</li>
<li>Recreate it with <code>--tmpfs /var/cache/nginx:size=32m --tmpfs /run:size=1m</code>; check <code>curl -s -o /dev/null -w '%{http_code}\\n' localhost:18072</code> and that <code>docker exec thu-ro touch /etc/nginx/x</code> fails.</li>
<li>Memory bill: run the <code>dd</code> test above twice with <code>--memory 128m --memory-swap 128m</code> — once without <code>size=</code>, once with <code>size=64m</code>. Note <code>OOMKilled</code> for each.</li>
<li>Secret: start <code>thu-sec</code> with <code>--tmpfs /run/secrets:size=1m,mode=0700</code>, deliver <code>jwt.key</code> with <code>docker cp</code>, look at <code>docker diff</code>; then start a fresh one and deliver it with <code>docker exec -i … cat &gt;</code>.</li>
<li>Clean up: <code>docker rm -f thu-ro thu-sec</code> and any stopped test containers.</li></ol>
<p><strong>Done when:</strong> you got 200 from the read-only nginx; you have one run with <code>OOMKilled=true</code> and one with "No space left on device"; and you can show the <code>docker diff</code> line that proves <code>docker cp</code> put the key on disk and the clean diff after <code>exec -i</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tmpfs</span><span class="v">A RAM-backed filesystem; empty at every container start, charged to the container's memory.</span></div>
  <div class="kv"><span class="k">ENOSPC</span><span class="v">"No space left on device" — what a capped tmpfs returns when full; far better than an OOM kill.</span></div>
  <div class="kv"><span class="k">OOM kill</span><span class="v">The kernel killing a process because a memory limit was hit; exit 137, <code>OOMKilled=true</code>.</span></div>
  <div class="kv"><span class="k"><code>--read-only</code></span><span class="v">Makes the container's root filesystem read-only; mounts you add stay writable.</span></div>
  <div class="kv"><span class="k"><code>noexec</code></span><span class="v">Mount option forbidding running files from that mount; default for Docker's tmpfs.</span></div>
  <div class="kv"><span class="k"><code>/dev/shm</code></span><span class="v">Shared memory for processes; 64 MB by default, raise with <code>--shm-size</code> for browsers.</span></div>
  <div class="kv"><span class="k">Runtime secret</span><span class="v">A credential delivered when the container runs (file on tmpfs, compose <code>secrets:</code>), never baked into the image.</span></div>
  <div class="kv"><span class="k">Build secret</span><span class="v">A credential used only during <code>docker build</code> via <code>RUN --mount=type=secret</code>; never in a layer.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>tmpfs is RAM: without <code>size=</code> it may grow to half the host's RAM, and every byte counts against <code>--memory</code> — cap it below the memory limit.</li>
<li>A tmpfs is empty after stop <em>and</em> after restart, and is mounted <code>noexec</code> unless you add <code>exec</code>.</li>
<li><code>--read-only</code>: start it, let it fail, read the log, add the smallest tmpfs holes (<code>/tmp</code>, <code>/run</code>, caches) and volumes for real data.</li>
<li>Environment variables, including <code>--env-file</code>, are printed in full by <code>docker inspect</code>.</li>
<li>Deliver file secrets through the process (<code>docker exec -i … cat &gt;</code>) or compose <code>secrets:</code> — <code>docker cp</code> into a tmpfs writes the file to disk underneath it.</li>
<li>Build-time secrets use <code>RUN --mount=type=secret</code>, never <code>ARG</code> or <code>ENV</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/storage/tmpfs/" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">Docker docs — tmpfs mounts</span><span class="lc-sub">Options, limitations, and the difference between <code>--tmpfs</code> and <code>--mount type=tmpfs</code> (the latter accepts <code>tmpfs-size</code> and <code>tmpfs-mode</code> explicitly).</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/run/#read-only" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">docker run --read-only</span><span class="lc-sub">The flag, and how it composes with volumes and tmpfs mounts that stay writable. Pair it with <code>--cap-drop ALL</code> and a non-root user from Lesson 6.4.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/secrets/" target="_blank" rel="noopener">
  <span class="lc-ico">🗝️</span>
  <span class="lc-body"><span class="lc-title">BuildKit build secrets</span><span class="lc-sub">The correct way to use a private registry token, an SSH key or a licence file during a build without it reaching a layer. Covers <code>type=secret</code>, <code>type=ssh</code> and the CLI flags.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: lock a container down</span><span class="lc-sub">Graded exercises: run an app with <code>--read-only</code> and find the minimum set of writable paths, cap a tmpfs and trigger <code>ENOSPC</code> deliberately, and rank four secret-delivery methods by what <code>docker inspect</code> reveals.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> believing <code>docker inspect</code> hides environment variables. It prints every one, in full, to anyone who can reach the Docker socket — and so does <code>docker compose config</code>, and so do most container platform UIs. Treat <code>-e</code> and <code>--env-file</code> as "protected from the internet, not from anyone with host access". The practical consequence is that rotating a leaked key means rotating it at the provider, not just changing the env var; and that a support engineer pasting <code>docker inspect</code> output into a chat has just published your database password. When you need a secret that survives that kind of accident, it has to be a file on tmpfs or a real secrets manager, not an environment variable.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Always give a tmpfs a <code>size=</code>, because it spends the container's memory budget and an uncapped one turns into an OOM kill instead of a disk-full error. <code>--read-only</code> plus a couple of small tmpfs mounts is one of the cheapest real security wins available — turn it on, read the errors, and grant exactly what the app asks for. And environment variables are visible in <code>docker inspect</code> forever: for anything that must not leak, mount a file on tmpfs.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>tmpfs, gốc chỉ đọc, và bí mật</h2>
<p class="lead">Hai ý tưởng ghép với nhau rất tự nhiên: cho hệ thống file của container thành chỉ đọc để không có gì bất ngờ ghi được vào, rồi khoét vài lỗ tmpfs nhỏ đúng chỗ ứng dụng thật sự cần ghi. Thứ bạn nhận được là một container mà kẻ tấn công không thả được tệp nhị phân vào, và không có gì nhạy cảm chạm tới một cái đĩa sống lâu hơn tiến trình.</p>

<h3>tmpfs là bộ nhớ đóng vai một thư mục</h3>
${slide('dk-07', 19, 'tmpfs là RAM — không đặt size thì trần = nửa RAM máy')}
<pre><code>docker run --rm --tmpfs /scratch:rw,size=64m,mode=1777 alpine:3.20 \\
  sh -c 'df -h /scratch; dd if=/dev/zero of=/scratch/f bs=1M count=8 2&gt;&amp;1 | tail -1'</code></pre>
<div class="out">Filesystem                Size      Used Available Use% Mounted on
tmpfs                    64.0M         0     64.0M   0% /scratch
8+0 records in
8+0 records out
8388608 bytes (8.0MB) copied, 0.004291 seconds, 1.8GB/s</div>
<pre><code><span class="tok-comment"># Trần dung lượng là thật — và nó tính vào hạn mức bộ nhớ của container</span>
docker run --rm --tmpfs /scratch:size=8m alpine:3.20 \\
  dd if=/dev/zero of=/scratch/big bs=1M count=16 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">dd: writing '/scratch/big': No space left on device
8+0 records out</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Luôn đặt <code>size=</code></span><span class="v">Một tmpfs không có trần có thể phình tới khi ăn hết hạn mức bộ nhớ của container, và bộ giết OOM sẽ lấy tiến trình chính chứ không lấy đám file. Đặt trần biến một bí ẩn chậm chạp thành một lỗi <code>ENOSPC</code> tức thì.</span></div>
  <div class="kv"><span class="k">Nó tính là bộ nhớ</span><span class="v">Một tmpfs 512MB bên trong container có <code>-m 512m</code> là một container có thể chết OOM chỉ vì ghi file. Hãy tính hai thứ đó cùng nhau.</span></div>
  <div class="kv"><span class="k">Chỉ có ở container Linux</span><span class="v"><code>--tmpfs</code> và <code>--mount type=tmpfs</code> không tồn tại cho container Windows. Trên Docker Desktop cho Mac/Windows chạy container Linux thì vẫn bình thường — bộ nhớ là của máy ảo.</span></div>
  <div class="kv"><span class="k">Mất khi dừng — và cả khi restart</span><span class="v">Dừng rồi khởi động lại đúng container đó cho bạn một tmpfs mới tinh và rỗng, <code>docker restart</code> cũng vậy (đo ở dưới — bản cũ của tiêu đề này ghi "không phải khi khởi động lại", là SAI). Không gì sống sót; đó chính là tính năng.</span></div>
</div>
<h3>Chạy thử từng bước: dung lượng mặc định, tuỳ chọn mặc định, restart, và hoá đơn bộ nhớ</h3>
<p>Bốn sự thật rất dễ hiểu sai, mỗi cái đo trên máy Mac của khoá (máy ảo Docker Desktop có 7,7 GiB RAM):</p>
<pre><code class="language-bash"><span class="tok-comment"># 1. không size= : trần là nửa RAM của MÁY, không phải của container</span>
docker run --rm --tmpfs /scratch alpine:3.20 df -h /scratch
<span class="tok-comment"># 2. tuỳ chọn gắn mặc định</span>
docker run --rm --tmpfs /x alpine:3.20 sh -c 'cp /bin/busybox /x/b; /x/b true; echo "exit=$?"; grep " /x " /proc/mounts'</code></pre>
<div class="out">Filesystem                Size      Used Available Use% Mounted on
tmpfs                     3.9G         0      3.9G   0% /scratch
sh: /x/b: Permission denied
exit=126
tmpfs /x tmpfs rw,nosuid,nodev,noexec,relatime 0 0</div>
<p>tmpfs được gắn với <code>noexec</code>: file ở đó không chạy được (exit 126, "Permission denied"). Điều này quan trọng khi dùng <code>--read-only</code> ở dưới, vì vài công cụ giải nén một tệp nhị phân phụ vào <code>/tmp</code> rồi chạy nó. Nếu công cụ của bạn như vậy, thêm <code>exec</code>: <code>--tmpfs /tmp:exec,size=64m</code>.</p>
<pre><code class="language-bash"><span class="tok-comment"># 3. restart có giữ nó không?</span>
docker run -d --name tmp --tmpfs /scratch:size=8m alpine:3.20 sleep 600
docker exec tmp sh -c 'echo "phien lam viec" &gt; /scratch/s.txt; echo x &gt; /layer.txt; ls /scratch'
docker restart tmp
docker exec tmp sh -c 'ls -la /scratch; cat /layer.txt'</code></pre>
<div class="out">s.txt
total 4
drwxr-xr-x    2 root     root            40 Sep 23 18:31 .
drwxr-xr-x    1 root     root          4096 Sep 23 18:31 ..
x</div>
<p>Sau <code>restart</code> tmpfs rỗng, trong khi file ghi vào tầng ghi (<code>/layer.txt</code>) vẫn còn. Restart là stop cộng start, và mỗi lần start gắn một tmpfs mới tinh.</p>
${slide('dk-07', 20, 'tmpfs tính vào trần --memory: không đặt size ⇒ bị giết OOM')}
<pre><code class="language-bash"><span class="tok-comment"># 4. file trong tmpfs được tính là bộ nhớ của container</span>
docker run --name tmpoom --memory 128m --memory-swap 128m --tmpfs /scratch alpine:3.20 \\
  sh -c 'dd if=/dev/zero of=/scratch/big bs=1M count=200; echo "dd xong, exit=$?"; df -h /scratch | tail -1'
docker inspect -f 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}' tmpoom
docker run --rm --memory 128m --memory-swap 128m --tmpfs /scratch:size=64m alpine:3.20 \\
  sh -c 'dd if=/dev/zero of=/scratch/big bs=1M count=200 2&gt;&amp;1 | head -1; echo "shell van song"'</code></pre>
<div class="out">Killed
dd xong, exit=137
tmpfs                     3.9G    125.6M      3.8G   3% /scratch
OOMKilled=true ExitCode=0
dd: error writing '/scratch/big': No space left on device
shell van song</div>
<p>Đọc chậm. Không có <code>size=</code> thì tmpfs cho phép tới 3,9G, nhưng container chỉ được dùng 128 MB bộ nhớ, và 125,6M dữ liệu file ĐÓ CHÍNH LÀ bộ nhớ. Không có swap để đẩy ra, kẻ giết OOM của nhân chọn một tiến trình — ở đây là <code>dd</code> (exit 137 = 128 + SIGKILL) — và Docker ghi <code>OOMKilled=true</code> dù shell chính của container thoát 0. Có <code>size=64m</code> thì cùng lệnh ghi đó chỉ báo "No space left on device" và mọi thứ khác vẫn chạy. Luật: <strong>size &lt; --memory</strong>, chừa chỗ cho chính ứng dụng.</p>
<table>
<tr><th>Tuỳ chọn</th><th>Dạng <code>--tmpfs</code></th><th>Dạng <code>--mount type=tmpfs</code></th><th>Mặc định</th></tr>
<tr><td>Trần dung lượng</td><td><code>size=64m</code></td><td><code>tmpfs-size=64m</code></td><td>nửa RAM của máy</td></tr>
<tr><td>Quyền của điểm gắn</td><td><code>mode=1777</code></td><td><code>tmpfs-mode=1777</code></td><td><code>755</code> (chỉ root ghi)</td></tr>
<tr><td>Cho chạy file</td><td><code>exec</code></td><td>(dùng <code>--tmpfs</code> cho việc này)</td><td><code>noexec</code></td></tr>
</table>

<h3>Gốc chỉ đọc cộng những lỗ ghi được</h3>
${slide('dk-07', 21, '--read-only: bật lên, để nó chết, đọc lỗi, khoét đúng lỗ')}
<pre><code>docker run --rm --read-only alpine:3.20 sh -c 'touch /tmp/x'</code></pre>
<div class="out">touch: /tmp/x: Read-only file system</div>
<pre><code><span class="tok-comment"># Trả lại đúng thứ nó cần, không hơn</span>
docker run --rm --read-only \\
  --tmpfs /tmp:rw,size=32m \\
  --tmpfs /run:rw,size=8m \\
  -v app-cache:/var/cache/app \\
  nginx:alpine sh -c 'touch /tmp/ok &amp;&amp; echo writable: /tmp; touch /etc/nope'</code></pre>
<div class="out">writable: /tmp
touch: /etc/nope: Read-only file system</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bật lên và để nó chết</span><span class="lz-t">--read-only, rồi đọc lỗi</span><span class="lz-d">Ứng dụng sẽ nói cho bạn biết chính xác nó cần những đường dẫn nào. Danh sách đó hầu như luôn ngắn hơn bạn tưởng: một thư mục tạm, một thư mục pid hoặc socket, đôi khi một cache.</span></div>
  <div class="lz-step"><span class="lz-k">2 · tmpfs cho những đường dẫn phù du</span><span class="lz-t">/tmp, /run, /var/run</span><span class="lz-d">Đằng nào chúng cũng không nên sống qua một lần khởi động lại. Đặt vào bộ nhớ vừa an toàn hơn vừa nhanh hơn lớp ghi được.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Volume cho mọi thứ phải tồn tại lâu dài</span><span class="lz-t">cache, file tải lên, file cơ sở dữ liệu</span><span class="lz-d">Nếu mất nó khi khởi động lại là một cái lỗi, thì nó là volume chứ không phải tmpfs. Ranh giới đó chính là toàn bộ quyết định.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Kiểm khi ứng dụng đang chạy, đừng kiểm lúc khởi động</span><span class="lz-t">bắt nó đi qua các đường ghi</span><span class="lz-d">Nhiều chương trình chỉ chạm vào thư mục tạm khi có tải — tải file lên, ghi phiên, xoay log. Một container khởi động sạch sẽ vẫn có thể chết ở lần tải file đầu tiên.</span></div>
</div>
<p>Ghép với người dùng không phải root ở Bài 6.4, một hệ thống file gốc chỉ đọc xoá bỏ nguyên một nhóm bước hậu khai thác: kẻ tấn công có quyền chạy mã cũng không ghi được payload xuống đĩa, không sửa được tệp nhị phân, và không giữ được gì qua một lần khởi động lại. Chỉ một cái cờ, và là một trong những cái cờ đáng giá nhất Docker có.</p>
<h3>Chạy thử từng bước: nginx dưới --read-only</h3>
<p>Bốn bước ở trên, trên ảnh nginx chính thức (máy Mac của khoá, cổng 18072):</p>
<pre><code class="language-bash">docker run -d --name ro --read-only -p 18072:80 nginx:1.27-alpine
docker ps -a --filter name=ro --format '{{.Names}} {{.Status}}'
docker logs ro 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">ro Exited (1) 2 seconds ago
2026/09/23 18:31:58 [emerg] 1#1: mkdir() "/var/cache/nginx/client_temp" failed (30: Read-only file system)
nginx: [emerg] mkdir() "/var/cache/nginx/client_temp" failed (30: Read-only file system)</div>
<p>Xong bước 1: nginx nói ra đúng một đường dẫn. Chỉ vá đúng chỗ đó (<code>--tmpfs /var/cache/nginx:size=32m</code>) thì lần thử kế tiếp gọi tên chỗ thứ hai: <code>nginx: [emerg] open() "/run/nginx.pid" failed (30: Read-only file system)</code> — file pid. Nên bước 2 là hai phép gắn tmpfs nhỏ:</p>
<pre><code class="language-bash">docker rm ro
docker run -d --name ro --read-only \\
  --tmpfs /var/cache/nginx:size=32m --tmpfs /run:size=1m \\
  -p 18072:80 nginx:1.27-alpine
curl -s -o /dev/null -w '%{http_code}\\n' localhost:18072
docker logs ro 2&gt;&amp;1 | grep -i "read-only"
docker exec ro sh -c 'touch /etc/nginx/x; echo &gt; /usr/share/nginx/html/index.html'</code></pre>
<div class="out">200
10-listen-on-ipv6-by-default.sh: info: can not modify /etc/nginx/conf.d/default.conf (read-only file system?)
touch: /etc/nginx/x: Read-only file system
sh: can't create /usr/share/nginx/html/index.html: Read-only file system</div>
<p>Trang trả 200. Dòng info duy nhất đến từ một script entrypoint muốn sửa cấu hình mặc định để thêm IPv6 — ở đây vô hại, và là một ví dụ đẹp cho việc phải đọc log thay vì tin chữ "đã khởi động". Lệnh cuối là lợi ích bảo mật gói trong một dòng: ai chiếm được shell trong container này cũng không sửa được cấu hình hay bôi bẩn trang web.</p>

<h3>/dev/shm, phép gắn bạn quên cho tới khi Chrome chết</h3>
<pre><code>docker run --rm alpine:3.20 df -h /dev/shm
docker run --rm --shm-size=1g alpine:3.20 df -h /dev/shm</code></pre>
<div class="out">Filesystem                Size      Used Available Use% Mounted on
shm                      64.0M         0     64.0M   0% /dev/shm
shm                       1.0G         0      1.0G   0% /dev/shm</div>
<p>Docker cho mỗi container một <code>/dev/shm</code> 64MB. Chừng đó ổn với phần lớn thứ và nhỏ quá đáng với một trình duyệt không giao diện — Chromium dưới Playwright hay Puppeteer dùng bộ nhớ chia sẻ cho các tiến trình kết xuất, và nó chết với một dòng <code>Target closed</code> khó hiểu hoặc một cú sập tab trơ trọi khi hết chỗ. Nếu bạn chạy trình duyệt trong container, <code>--shm-size=1g</code> (hoặc <code>shm_size: 1gb</code> trong compose) là cách vá, và lý do phải biết chuyện này là vì trong thông báo lỗi chẳng có chữ nào nhắc tới bộ nhớ chia sẻ.</p>

<h3>Bốn cách đưa bí mật vào container, từ tệ nhất tới tốt nhất</h3>
${slide('dk-07', 22, 'Bí mật: biến môi trường hiện NGUYÊN trong docker inspect')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">❌ Nướng thẳng vào ảnh</span><span class="lz-lnote">Một dòng <code>ENV</code> hoặc một file <code>.env</code> chép vào một lớp. Ai kéo được cái ảnh là có bí mật, vĩnh viễn, nằm trong một lớp bạn không xoá được (Bài 6.1). Đây chính là cái rốt cuộc nằm trên một registry công khai.</span></div>
  <div class="lz-layer"><span class="lz-lname">⚠️ <code>-e SECRET=…</code> trên dòng lệnh</span><span class="lz-lnote">Nhìn thấy được trong <code>docker inspect</code>, trong kết quả <code>ps</code> trên máy chủ, và trong lịch sử shell của bạn. Chấp nhận được lúc phát triển, sai trên production.</span></div>
  <div class="lz-layer"><span class="lz-lname">✅ <code>--env-file</code> từ một file được máy chủ bảo vệ</span><span class="lz-lnote">Giá trị không nằm trên dòng lệnh và không vào lịch sử shell. Vẫn nhìn thấy được trong <code>docker inspect</code>. Đây là thứ chính dự án này dùng: <code>/opt/cuonghoangdev/.env</code>, quyền 600, nạp lúc deploy và bị loại khỏi rsync nên nó sống sót.</span></div>
  <div class="lz-layer"><span class="lz-lname">✅✅ Một file trên tmpfs, hoặc một trình quản bí mật thật</span><span class="lz-lnote">Gắn bí mật dưới dạng file vào một đường dẫn tmpfs, hoặc dùng secret của Swarm/Kubernetes, hoặc lấy về lúc khởi động từ Vault hay một dịch vụ quản bí mật trên đám mây. Nó không bao giờ chạm đĩa, không hiện trong <code>inspect</code>, và xoay vòng được mà không phải dựng lại thứ gì.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># "nhìn thấy trong docker inspect" nghĩa là gì, theo đúng nghĩa đen (máy Mac của khoá)</span>
docker run -d --name api -e DB_PASSWORD=matkhau-that-123 alpine:3.20 sleep 600
docker inspect -f '{{json .Config.Env}}' api</code></pre>
<div class="out">["DB_PASSWORD=matkhau-that-123","PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"]</div>
<p>Không cần quyền gì hơn "nói chuyện được với socket Docker", và <code>--env-file</code> rốt cuộc nằm đúng trong trường đó. Một ghi chú cho bậc thứ hai của cái thang: với <code>docker run -d</code> thì CLI thoát ngay, nên dòng lệnh chỉ thoáng hiện trong <code>ps</code> của máy chủ; chỗ rò lâu dài là <code>inspect</code> và lịch sử shell của bạn (<code>~/.zsh_history</code>).</p>
<pre><code><span class="tok-comment"># Mẫu file-trên-tmpfs, không cần thêm hạ tầng nào</span>
docker run -d --name api \\
  --tmpfs /run/secrets:rw,size=1m,mode=0700 \\
  --env-file /opt/app/.env \\
  api:1.4.2
docker exec -i api sh -c 'cat &gt; /run/secrets/jwt.key' &lt; /opt/app/jwt.key   <span class="tok-comment"># qua tiến trình: rơi vào tmpfs (KHÔNG dùng docker cp — xem dưới)</span>

<span class="tok-comment"># Xác nhận nó không nằm trên cái đĩa nào container giữ lại được</span>
docker exec api sh -c 'df -h /run/secrets | tail -1'</code></pre>
<div class="out">tmpfs                     1.0M      4.0K   1020.0K   0% /run/secrets</div>
<h3>Sao không dùng docker cp? Nó ghi xuống DƯỚI tmpfs, lên đĩa</h3>
${slide('dk-07', 23, 'docker cp vào tmpfs báo thành công — nhưng file rơi xuống ĐĨA')}
<p>Bản cũ của bài chép khoá bằng <code>docker cp jwt.key api:/run/secrets/jwt.key</code>. Trông đúng, trả về 0 — và làm ĐÚNG ĐIỀU NGƯỢC LẠI với mục đích của mẫu này. Đo trên Mac rồi lặp lại trên máy Linux, cùng kết quả:</p>
<pre><code class="language-bash">docker run -d --name sec --tmpfs /run/secrets:rw,size=1m,mode=0700 alpine:3.20 sleep 600
docker cp jwt.key sec:/run/secrets/jwt.key; echo "cp exit=$?"
docker exec sec ls -la /run/secrets
docker exec sec df -h /run/secrets | tail -1
docker diff sec</code></pre>
<div class="out">cp exit=0
total 4
drwx------    2 root     root            40 Sep 23 18:32 .
drwxr-xr-x    1 root     root          4096 Sep 23 18:32 ..
tmpfs                     1.0M         0      1.0M   0% /run/secrets
C /run
A /run/secrets
A /run/secrets/jwt.key</div>
<p>tmpfs trống trơn, còn <code>docker diff</code> báo <code>A /run/secrets/jwt.key</code>: file đã được ghi vào <em>tầng ghi</em> của container, NẰM DƯỚI tmpfs, nơi tiến trình không nhìn thấy và nơi nó nằm trên đĩa cho tới khi container bị xoá. Tài liệu <code>docker cp</code> nói rõ ở mục trường hợp đặc biệt: nó không chép được vào tmpfs hay vào các mount tạo bên trong container. Hãy ghi QUA một tiến trình trong container:</p>
<pre><code class="language-bash">docker exec -i sec sh -c 'cat &gt; /run/secrets/jwt.key' &lt; jwt.key
docker exec sec df -h /run/secrets | tail -1
docker diff sec</code></pre>
<div class="out">tmpfs                     1.0M      4.0K   1020.0K   0% /run/secrets
C /run
A /run/secrets</div>
<p>(Container mới cho lượt chạy thứ hai.) tmpfs đã dùng 4.0K, và tầng ghi không có gì dưới <code>/run/secrets</code> ngoài chính điểm gắn. Trong compose, khoá <code>secrets:</code> lo phần đưa file hộ bạn: mỗi bí mật hiện ra chỉ-đọc ở <code>/run/secrets/&lt;tên&gt;</code>, lấy từ một file trên máy chủ — không nằm trong <code>inspect</code>, không nằm trong ảnh.</p>
<div class="callout warn"><strong>Bí mật lúc DỰNG là một bài toán khác với lời giải khác.</strong> Đừng bao giờ truyền token qua <code>ARG</code> — nó được ghi vào lịch sử của ảnh và đọc được bằng <code>docker history</code>. Hãy dùng <code>RUN --mount=type=secret,id=npmrc</code> (Bài 6.1): BuildKit gắn file đó cho đúng một chỉ thị và nó không bao giờ vào một lớp nào.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trước buổi demo nhóm, giảng viên hỏi bạn chặn thế nào nếu kẻ tấn công vào được container web và định sửa file, và khoá ký JWT nằm ở đâu. Hãy siết một container nginx và đưa bí mật vào đúng cách — rồi chứng minh cả hai.</p><ol>
<li>Chạy <code>nginx:1.27-alpine</code> tên <code>thu-ro</code> với <code>--read-only -p 18072:80</code>. Nó thoát: tìm đường dẫn trong <code>docker logs</code>.</li>
<li>Tạo lại với <code>--tmpfs /var/cache/nginx:size=32m --tmpfs /run:size=1m</code>; kiểm <code>curl -s -o /dev/null -w '%{http_code}\\n' localhost:18072</code> và kiểm rằng <code>docker exec thu-ro touch /etc/nginx/x</code> thất bại.</li>
<li>Hoá đơn bộ nhớ: chạy phép thử <code>dd</code> ở trên hai lần với <code>--memory 128m --memory-swap 128m</code> — một lần không có <code>size=</code>, một lần có <code>size=64m</code>. Ghi lại <code>OOMKilled</code> của từng lần.</li>
<li>Bí mật: khởi động <code>thu-sec</code> với <code>--tmpfs /run/secrets:size=1m,mode=0700</code>, đưa <code>jwt.key</code> vào bằng <code>docker cp</code>, nhìn <code>docker diff</code>; rồi khởi động một cái mới và đưa vào bằng <code>docker exec -i … cat &gt;</code>.</li>
<li>Dọn: <code>docker rm -f thu-ro thu-sec</code> và các container thử đã dừng.</li></ol>
<p><strong>Đạt khi:</strong> nginx chỉ-đọc trả 200; bạn có một lượt <code>OOMKilled=true</code> và một lượt "No space left on device"; và bạn chỉ ra được dòng <code>docker diff</code> chứng minh <code>docker cp</code> đặt khoá lên đĩa, cùng bản diff sạch sau <code>exec -i</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tmpfs (hệ thống file trong RAM)</span><span class="v">Nằm trong bộ nhớ; rỗng mỗi lần container khởi động, tính vào bộ nhớ của container.</span></div>
  <div class="kv"><span class="k">ENOSPC (hết chỗ)</span><span class="v">"No space left on device" — thứ tmpfs có trần trả về khi đầy; tốt hơn hẳn một cú giết OOM.</span></div>
  <div class="kv"><span class="k">OOM kill (giết vì hết bộ nhớ)</span><span class="v">Nhân giết một tiến trình vì chạm trần bộ nhớ; exit 137, <code>OOMKilled=true</code>.</span></div>
  <div class="kv"><span class="k"><code>--read-only</code> (gốc chỉ đọc)</span><span class="v">Biến hệ thống file gốc của container thành chỉ đọc; các mount bạn thêm vẫn ghi được.</span></div>
  <div class="kv"><span class="k"><code>noexec</code> (cấm chạy file)</span><span class="v">Tuỳ chọn gắn cấm chạy file từ mount đó; mặc định với tmpfs của Docker.</span></div>
  <div class="kv"><span class="k"><code>/dev/shm</code> (bộ nhớ chia sẻ)</span><span class="v">Bộ nhớ dùng chung giữa các tiến trình; mặc định 64 MB, tăng bằng <code>--shm-size</code> cho trình duyệt.</span></div>
  <div class="kv"><span class="k">Runtime secret (bí mật lúc chạy)</span><span class="v">Thông tin đăng nhập đưa vào khi container chạy (file trên tmpfs, <code>secrets:</code> của compose), không bao giờ nướng vào ảnh.</span></div>
  <div class="kv"><span class="k">Build secret (bí mật lúc dựng)</span><span class="v">Thông tin chỉ dùng trong <code>docker build</code> qua <code>RUN --mount=type=secret</code>; không bao giờ vào tầng nào.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>tmpfs là RAM: không có <code>size=</code> thì nó phình được tới nửa RAM máy, và từng byte tính vào <code>--memory</code> — đặt trần thấp hơn trần bộ nhớ.</li>
<li>tmpfs rỗng sau stop <em>và cả</em> sau restart, và được gắn <code>noexec</code> trừ khi bạn thêm <code>exec</code>.</li>
<li><code>--read-only</code>: bật lên, để nó chết, đọc log, khoét những lỗ tmpfs nhỏ nhất (<code>/tmp</code>, <code>/run</code>, cache) và dùng volume cho dữ liệu thật.</li>
<li>Biến môi trường, kể cả <code>--env-file</code>, bị <code>docker inspect</code> in ra nguyên vẹn.</li>
<li>Đưa bí mật dạng file qua tiến trình (<code>docker exec -i … cat &gt;</code>) hoặc <code>secrets:</code> của compose — <code>docker cp</code> vào tmpfs ghi file xuống đĩa bên dưới nó.</li>
<li>Bí mật lúc dựng dùng <code>RUN --mount=type=secret</code>, không bao giờ <code>ARG</code> hay <code>ENV</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/storage/tmpfs/" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">Docker docs — tmpfs mounts</span><span class="lc-sub">Tuỳ chọn, giới hạn, và khác biệt giữa <code>--tmpfs</code> với <code>--mount type=tmpfs</code> (cái sau nhận <code>tmpfs-size</code> và <code>tmpfs-mode</code> một cách tường minh).</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/run/#read-only" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">docker run --read-only</span><span class="lc-sub">Cái cờ đó, và cách nó ghép với volume và tmpfs vẫn ghi được. Hãy dùng kèm <code>--cap-drop ALL</code> và người dùng không phải root ở Bài 6.4.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/secrets/" target="_blank" rel="noopener">
  <span class="lc-ico">🗝️</span>
  <span class="lc-body"><span class="lc-title">Bí mật lúc dựng của BuildKit</span><span class="lc-sub">Cách đúng để dùng token registry riêng, khoá SSH hay file bản quyền trong lúc dựng mà nó không rơi vào một lớp nào. Bao gồm <code>type=secret</code>, <code>type=ssh</code> và các cờ CLI.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: khoá chặt một container</span><span class="lc-sub">Bài chấm điểm: chạy một ứng dụng với <code>--read-only</code> rồi tìm tập đường dẫn ghi được tối thiểu, đặt trần cho một tmpfs và cố tình gây <code>ENOSPC</code>, và xếp hạng bốn cách đưa bí mật theo thứ mà <code>docker inspect</code> để lộ.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tin rằng <code>docker inspect</code> giấu biến môi trường. Nó in ra đủ từng biến, nguyên vẹn, cho bất cứ ai với tới được socket Docker — <code>docker compose config</code> cũng vậy, và phần lớn giao diện quản container cũng vậy. Hãy coi <code>-e</code> và <code>--env-file</code> là "được bảo vệ khỏi Internet, chứ không phải khỏi người có quyền vào máy chủ". Hệ quả thực tế là: xoay một cái khoá bị lộ nghĩa là xoay nó ở phía nhà cung cấp, chứ không phải chỉ đổi biến môi trường; và một kỹ sư hỗ trợ dán kết quả <code>docker inspect</code> vào một khung chat vừa công bố mật khẩu cơ sở dữ liệu của bạn. Khi bạn cần một bí mật sống sót qua kiểu tai nạn đó, nó buộc phải là một file trên tmpfs hoặc một trình quản bí mật thật, không phải một biến môi trường.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Luôn cho tmpfs một <code>size=</code>, vì nó tiêu vào hạn mức bộ nhớ của container và một cái không trần sẽ biến thành một cú giết OOM thay vì một lỗi hết đĩa. <code>--read-only</code> cộng vài phép gắn tmpfs nhỏ là một trong những cái lợi an toàn thật rẻ nhất bạn có — bật lên, đọc lỗi, và cấp đúng thứ ứng dụng xin. Và biến môi trường thì nhìn thấy được trong <code>docker inspect</code> mãi mãi: thứ gì không được rò thì hãy gắn thành file trên tmpfs.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.5 ─────────────────────────── */
    {
      title: '7.5 — Backup, restore, migrate|||7.5 — Sao lưu, khôi phục, di chuyển',
      slug: 'dk-7-5-sao-luu',
      type: 'LESSON',
      description: 'Sao lưu một volume bằng container phụ, vì sao pg_dump khác tar, khôi phục vào một volume mới, chuyển dữ liệu sang máy khác, và một script sao lưu hằng đêm thật sự chạy được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Backup, restore, migrate</h2>
<p class="lead">A volume you cannot restore is not a backup, it is a hope. This lesson covers the two genuinely different backup strategies — copy the files, or ask the application to export itself — when each is correct, and how to move a volume to another machine. The restore half gets more space than the backup half, because that is the half people skip.</p>

<h3>The helper-container pattern</h3>
${slide('dk-07', 24, 'Mẫu container phụ: volume :ro + thư mục máy + tar')}
<pre><code><span class="tok-comment"># Back a volume up to a tar file in the current directory</span>
docker run --rm \\
  -v blog-uploads:/from:ro \\
  -v "$PWD:/to" \\
  alpine:3.20 tar -C /from -czf /to/uploads-2026-08-22.tgz .
ls -lh uploads-2026-08-22.tgz</code></pre>
<div class="out">-rw-r--r-- 1 root root 611M Aug 22 10:02 uploads-2026-08-22.tgz</div>
<p>Nothing special is happening: a throwaway container mounts the volume read-only and a host directory read-write, and <code>tar</code> does the rest. This works for any volume, on any host, with no tooling beyond Docker — and because the source is <code>:ro</code>, a mistake in the command cannot damage the original.</p>
<pre><code><span class="tok-comment"># Restore into a NEW volume — never over the live one on the first attempt</span>
docker volume create blog-uploads-restored
docker run --rm \\
  -v blog-uploads-restored:/to \\
  -v "$PWD:/from:ro" \\
  alpine:3.20 tar -C /to -xzf /from/uploads-2026-08-22.tgz
docker run --rm -v blog-uploads-restored:/d alpine:3.20 sh -c 'ls /d | wc -l; du -sh /d'</code></pre>
<div class="out">4127
611.2M	/d</div>
<div class="callout ok"><strong>Restore into a new volume, then swap.</strong> It costs disk and nothing else, and it converts "restore the backup" from a terrifying one-way operation into something you can verify before it matters. Point a temporary container at the restored volume, check the data is what you expect, and only then stop the service and re-point it.</div>
<h3>Reading the helper command, part by part</h3>
<table>
<tr><th>Piece</th><th>What it does</th></tr>
<tr><td><code>docker run --rm</code></td><td>A throwaway container: deleted as soon as <code>tar</code> finishes, with its anonymous volumes</td></tr>
<tr><td><code>-v blog-uploads:/from:ro</code></td><td>The volume to back up, at <code>/from</code>, read-only — a typo cannot damage it</td></tr>
<tr><td><code>-v "$PWD:/to"</code></td><td>Your current host folder, at <code>/to</code>: where the archive lands</td></tr>
<tr><td><code>alpine:3.20</code></td><td>Any small image that has <code>tar</code></td></tr>
<tr><td><code>tar -C /from</code></td><td>Change into <code>/from</code> first, so paths in the archive start at the volume's root</td></tr>
<tr><td><code>-c</code> · <code>-x</code></td><td>Create an archive · extract one</td></tr>
<tr><td><code>-z</code></td><td>gzip compression (<code>.tgz</code>)</td></tr>
<tr><td><code>-f /to/uploads-….tgz</code></td><td>The archive file (<code>-f -</code> = stdout/stdin, used for streaming below)</td></tr>
<tr><td><code>.</code> (the last dot)</td><td>"Everything in the current directory", including hidden files — <code>*</code> would skip them</td></tr>
</table>
<p>The same pattern on a real Postgres volume (158 MB of data files for a 500,000-row table, database <em>stopped</em> first — see why below), timed on the course's Mac:</p>
<pre><code class="language-bash">docker stop pg
time docker run --rm -v pgdata:/from:ro -v "$PWD:/to" alpine:3.20 tar -C /from -czf /to/pgdata.tgz .
ls -lh pgdata.tgz
docker volume create pgdata3
time docker run --rm -v pgdata3:/to -v "$PWD:/from:ro" alpine:3.20 tar -C /to -xzf /from/pgdata.tgz</code></pre>
<div class="out">… 5.096 total
33M pgdata.tgz
pgdata3
… 1.467 total</div>

<h3>tar versus pg_dump: they are not the same backup</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tar of a running database</span><span class="v"><strong>Usually corrupt.</strong> You are copying files while the engine is writing them. What you get is the on-disk state at no single point in time — a torn snapshot that may restore, may restore wrong, or may refuse to start.</span></div>
  <div class="kv"><span class="k">tar of a STOPPED database</span><span class="v"><strong>Valid</strong>, and byte-exact. Fast to restore, but it only restores onto the same major version of the engine, and it means downtime for the duration of the copy.</span></div>
  <div class="kv"><span class="k"><code>pg_dump</code> / <code>mysqldump</code></span><span class="v"><strong>Valid on a live database</strong>, because the engine gives you a consistent transactional snapshot. Portable across versions and even across machines with different architectures. Slower to restore on a large database.</span></div>
  <div class="kv"><span class="k">Filesystem snapshot (LVM/ZFS/cloud)</span><span class="v"><strong>Valid and instant</strong>, if the snapshot is atomic and the engine is crash-safe. This is what managed database backups actually do. Requires the storage layer to support it.</span></div>
</div>
<pre><code><span class="tok-comment"># The right way for Postgres — logical dump, from a container, live</span>
docker exec cuonghoangdev_postgres \\
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --compress=9 \\
  &gt; "db-$(date +%F).dump"
ls -lh db-*.dump</code></pre>
<div class="out">-rw-r--r-- 1 cuong cuong 84M Aug 22 10:11 db-2026-08-22.dump</div>
<pre><code><span class="tok-comment"># Restore it into a scratch database first, and count something you recognise</span>
docker exec -i cuonghoangdev_postgres createdb -U "$POSTGRES_USER" restore_check
docker exec -i cuonghoangdev_postgres \\
  pg_restore -U "$POSTGRES_USER" -d restore_check --no-owner &lt; db-2026-08-22.dump
docker exec -t cuonghoangdev_postgres \\
  psql -U "$POSTGRES_USER" -d restore_check -c 'select count(*) from "User";'</code></pre>
<div class="out"> count
-------
  1284
(1 row)</div>
<div class="callout warn"><strong>A backup you have never restored has an unknown status.</strong> Not "probably fine" — unknown. The failures are mundane and total: a dump that was truncated because the disk filled, a file of zero bytes because the container name changed, an archive that restores but is missing a schema because <code>pg_dump</code> ran as a user without permission on it. Restoring into a scratch database and counting a table you know takes two minutes and is the entire difference between a backup and a hope.</div>
<div class="callout warn"><strong>Corrected: no <code>-t</code> on <code>pg_dump</code>.</strong> An earlier version of these commands used <code>docker exec -t … pg_dump … &gt; file</code>. <code>-t</code> gives the command a terminal, and a terminal rewrites line endings — which silently corrupts a binary <code>--format=custom</code> dump (measured below). Use <code>docker exec</code> with no flag to take data <em>out</em>, <code>-i</code> to feed data <em>in</em>. Also note that <code>"$POSTGRES_USER"</code> in these commands is expanded by <em>your</em> shell on the host, not inside the container — export it on the host (or write the user name) or it silently becomes an empty string.</div>

<h3>Run it step by step: back up a real Postgres, restore it, count</h3>
${slide('dk-07', 26, 'Khôi phục xong thì ĐẾM — 500 000 = 500 000')}
<p>Every number here is from the course's Mac (Postgres 16 Alpine, Docker 29.8, 09/2026). First a database worth backing up — a named volume, and half a million rows:</p>
<pre><code class="language-bash">docker volume create pgdata
docker run -d --name pg -e POSTGRES_PASSWORD=x -v pgdata:/var/lib/postgresql/data postgres:16-alpine
until docker exec pg pg_isready -U postgres -q; do sleep 1; done
docker exec pg psql -U postgres -q \\
  -c "create table don_hang(id serial primary key, khach text, tong numeric(12,0), tao_luc timestamptz default now());" \\
  -c "insert into don_hang(khach,tong) select 'khach-'||g, (random()*5000000)::int from generate_series(1,500000) g;"
docker exec pg psql -U postgres -At -c "select count(*), pg_size_pretty(pg_database_size('postgres')) from don_hang;"</code></pre>
<div class="out">500000|47 MB</div>
<p><strong>Logical dump, while the database is running:</strong></p>
<pre><code class="language-bash">time (docker exec pg pg_dump -U postgres -d postgres --format=custom &gt; db.dump)
ls -lh db.dump</code></pre>
<div class="out">… 0.489 total
-rw-r--r--@ 1 admin  wheel   4.4M Sep 24 01:32 db.dump</div>
<p><strong>Restore into a brand-new container and volume, then count:</strong></p>
<pre><code class="language-bash">docker run -d --name pg2 -e POSTGRES_PASSWORD=x -v pgdata2:/var/lib/postgresql/data postgres:16-alpine
until docker exec pg2 pg_isready -U postgres -q; do sleep 1; done
docker exec pg2 createdb -U postgres khoi_phuc
time (docker exec -i pg2 pg_restore -U postgres -d khoi_phuc --no-owner &lt; db.dump)
docker exec pg2 psql -U postgres -d khoi_phuc -c "select count(*), sum(tong) from don_hang;"
docker exec pg  psql -U postgres -c "select count(*), sum(tong) from don_hang;"</code></pre>
<div class="out">… 0.719 total
 count  |      sum
--------+---------------
 500000 | 1250008591454
(1 row)

 count  |      sum
--------+---------------
 500000 | 1250008591454
(1 row)</div>
<p>Same row count and same checksum-like <code>sum</code> on both sides: this backup has a <em>known good</em> status. The cold tar of the same volume (above) was restored into <code>pgdata3</code> and checked the same way:</p>
<pre><code class="language-bash">docker run -d --name pg3 -e POSTGRES_PASSWORD=x -v pgdata3:/var/lib/postgresql/data postgres:16-alpine
docker exec pg3 psql -U postgres -c "select count(*), sum(tong) from don_hang;"
docker logs pg3 2&gt;&amp;1 | grep -i skipping
docker run --rm -v pgdata3:/d:ro alpine:3.20 cat /d/PG_VERSION</code></pre>
<div class="out"> count  |      sum
--------+---------------
 500000 | 1250008591454
(1 row)

PostgreSQL Database directory appears to contain a database; Skipping initialization
16</div>
${slide('dk-07', 25, 'tar thư mục data ≠ pg_dump — số đo thật')}
<table>
<tr><th>Same 500,000 rows</th><th><code>pg_dump --format=custom</code></th><th><code>tar</code> of the stopped data directory</th></tr>
<tr><td>Backup time</td><td>0.49 s, database stays up</td><td>5.1 s, database must be <strong>down</strong></td></tr>
<tr><td>File size</td><td>4.4 MB (data only, compressed)</td><td>33 MB (data + indexes + WAL, gzip)</td></tr>
<tr><td>Restore time</td><td>0.72 s (indexes rebuilt)</td><td>1.5 s to unpack, then start</td></tr>
<tr><td>Restores into</td><td>Any newer Postgres, any CPU (tested: 16 arm64 → 18.6 amd64)</td><td>Same major version only (tested: 18 refuses 16's files)</td></tr>
</table>
<p>At this size the dump wins on every row. The file copy starts to earn its place on very large databases, where replaying a dump takes hours — and at that size you want real snapshots or continuous archiving (the PostgreSQL link below), not a nightly tar.</p>

<h3>docker exec -t corrupts a binary dump</h3>
${slide('dk-07', 27, 'docker exec -t làm hỏng bản dump nhị phân')}
<pre><code class="language-bash">docker exec    pg pg_dump -U postgres -d postgres --format=custom &gt; db.dump
docker exec -t pg pg_dump -U postgres -d postgres --format=custom &gt; db-tty.dump
ls -l db.dump db-tty.dump | awk '{print $5, $9}'
docker exec -i pg pg_restore -l &lt; db-tty.dump</code></pre>
<div class="out">4610442 db.dump
4631142 db-tty.dump
pg_restore: error: could not read from input file: end of file</div>
<p>20,700 bytes longer, and unreadable. <code>-t</code> allocates a pseudo-terminal; the terminal turns every <code>\\n</code> byte in the output into <code>\\r\\n</code>. For text you might never notice; a binary archive is destroyed — and both commands exit 0, even from a cron job with no terminal attached (this run was not interactive either). Rule of thumb: <code>-it</code> only when a <em>human</em> types (<code>psql</code>, <code>sh</code>); <code>-i</code> when you pipe data in; nothing when you pipe data out.</p>

<h3>Moving a volume to another machine</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Stop what writes to it</span><span class="lz-t">docker compose stop api worker</span><span class="lz-d">For a database, stop the engine too, or use a logical dump instead. Copying a live data directory across a network is the torn-snapshot problem with extra latency.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Stream it, do not stage it</span><span class="lz-t">tar to stdout, ssh, tar from stdin</span><span class="lz-d">No temporary file on either side, so a 40GB volume does not need 40GB free twice. Works on any pair of hosts with ssh.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Create the target volume first</span><span class="lz-t">docker volume create, explicitly</span><span class="lz-d">So it exists with the name and labels you meant, rather than being auto-created by the first container that references it.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Verify before you delete anything</span><span class="lz-t">file counts, sizes, a checksum of a sample</span><span class="lz-d">Then keep the source volume for a week. Disk is cheaper than the conversation about where the uploads went.</span></div>
</div>
<pre><code><span class="tok-comment"># One command, no intermediate file, source host → target host</span>
docker run --rm -v blog-uploads:/from:ro alpine:3.20 tar -C /from -cf - . \\
  | ssh deploy@newhost 'docker volume create blog-uploads &gt;/dev/null; \\
      docker run --rm -i -v blog-uploads:/to alpine:3.20 tar -C /to -xf -'

<span class="tok-comment"># Compare both sides</span>
docker run --rm -v blog-uploads:/d:ro alpine:3.20 sh -c 'find /d -type f | wc -l'
ssh deploy@newhost 'docker run --rm -v blog-uploads:/d:ro alpine:3.20 sh -c "find /d -type f | wc -l"'</code></pre>
<div class="out">4127
4127</div>
<h3>Measured: a Postgres volume from a Mac (arm64) to a Linux box (amd64)</h3>
${slide('dk-07', 28, 'Chuyển volume sang máy khác: tar | ssh | tar, rồi so md5')}
<p>The stopped <code>pgdata</code> volume from above, streamed with exactly the command in this section (the Linux machine is reached through a jump host, so the network is slow):</p>
<pre><code class="language-bash">time (docker run --rm -v pgdata:/from:ro alpine:3.20 tar -C /from -cf - . \\
  | ssh linux-nha 'docker volume create pgdata &gt;/dev/null; docker run --rm -i -v pgdata:/to alpine tar -C /to -xf -')
docker run --rm -v pgdata:/d:ro alpine:3.20 sh -c 'find /d -type f | wc -l; du -sh /d'
ssh linux-nha 'docker run --rm -v pgdata:/d:ro alpine sh -c "find /d -type f | wc -l; du -sh /d"'</code></pre>
<div class="out">… 37.252 total
982
158.2M	/d
982
158.1M	/d</div>
<p>Same file count, but <code>du</code> differs by 0.1M — two different filesystems round sizes differently. That is why the check that counts is a checksum over every file, sorted by name:</p>
<pre><code class="language-bash">docker run --rm -v pgdata:/d:ro alpine:3.20 sh -c 'cd /d &amp;&amp; find . -type f -exec md5sum {} + | sort -k2 | md5sum'
ssh linux-nha 'docker run --rm -v pgdata:/d:ro alpine sh -c "cd /d &amp;&amp; find . -type f -exec md5sum {} + | sort -k2 | md5sum"'</code></pre>
<div class="out">7b020c506e90772aa07c6907ea816405  -
7b020c506e90772aa07c6907ea816405  -</div>
<p>Identical. Postgres 16 on the amd64 machine then started on these arm64-made files and answered <code>500000|1250008591454</code> — this time it worked, because both CPUs are 64-bit little-endian, but PostgreSQL does not promise that for data files. What it definitely refuses is a different major version. Mounting the same volume in <code>postgres:18-alpine</code>:</p>
<div class="out">Error: in 18+, these Docker images are configured to store database data in a
       format which is compatible with "pg_ctlcluster" (specifically, using
       major-version-specific directory names).
…
FATAL:  database files are incompatible with server
DETAIL:  The data directory was initialized by PostgreSQL version 16, which is not compatible with this version 18.6.</div>
<p>(The first message is the image's own guard — from version 18 the image keeps data in <code>/var/lib/postgresql/18/docker</code> and expects the volume at <code>/var/lib/postgresql</code>; the second is Postgres itself, after forcing the old path with <code>-e PGDATA=…</code>.) The logical dump has no such limits: the same <code>db.dump</code>, piped over ssh into a fresh Postgres 18.6 on amd64, restored in 1.3 s and counted <code>500000|1250008591454</code>. To move a database across versions or machines, move a dump; move volume files only between identical versions.</p>

<h3>A nightly backup that actually runs</h3>
${slide('dk-07', 29, 'Script sao lưu hằng đêm: set -e + .part là thứ cứu bạn')}
<pre><code><span class="tok-comment"># /opt/backup/nightly.sh — kept deliberately boring</span>
#!/usr/bin/env bash
set -Eeuo pipefail
STAMP=$(date +%F)
DEST=/opt/backup/out
KEEP=14
log() { echo "$(date '+%F %T') · $*"; }

mkdir -p "$DEST"
docker exec cuonghoangdev_postgres \\
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --compress=9 \\
  &gt; "$DEST/db-$STAMP.dump.part"
mv "$DEST/db-$STAMP.dump.part" "$DEST/db-$STAMP.dump"   <span class="tok-comment"># atomic: no half-file is ever named .dump</span>
log "db-$STAMP.dump $(du -h "$DEST/db-$STAMP.dump" | cut -f1)"

docker run --rm -v blog-uploads:/from:ro -v "$DEST:/to" alpine:3.20 \\
  tar -C /from -czf "/to/uploads-$STAMP.tgz.part" .
mv "$DEST/uploads-$STAMP.tgz.part" "$DEST/uploads-$STAMP.tgz"
log "uploads-$STAMP.tgz $(du -h "$DEST/uploads-$STAMP.tgz" | cut -f1)"

find "$DEST" -name '*.dump' -mtime +$KEEP -delete
find "$DEST" -name '*.tgz'  -mtime +$KEEP -delete
log "xong · giữ $(ls "$DEST" | wc -l | tr -d ' ') file"
rclone copy "$DEST" r2:backups/cuongthai --max-age 48h   <span class="tok-comment"># off the machine, or it is not a backup</span></code></pre>
<div class="out">2026-09-24 01:35:15 · db-2026-09-24.dump 4.4M
2026-09-24 01:35:15 · uploads-2026-09-24.tgz  12M
2026-09-24 01:35:15 · xong · giữ 2 file</div>
<p class="note-ct">Real run of this script on the course's Mac (09/2026) against the test database and a 12 MB test volume, with the <code>rclone</code> line commented out because no R2 remote was configured there. An earlier version of this lesson showed log lines the script could never print; the <code>log</code> lines above were added so the script says what it did — and <code>docker exec -t</code> was removed (see "docker exec -t corrupts a binary dump").</p>
<p>What <code>set -Eeuo pipefail</code> is worth, measured: the same script with the container name mistyped.</p>
<pre><code class="language-bash"><span class="tok-comment"># with set -Eeuo pipefail</span>
bash nightly.sh; echo "exit=$?"; ls out/
<span class="tok-comment"># the same file with that line removed</span>
bash nightly-no-set-e.sh; echo "exit=$?"; ls -l out/ | awk '{print $5, $9}'</code></pre>
<div class="out">Error response from daemon: No such container: pg-sai
exit=1
db-2026-09-24.dump
db-2026-09-24.dump.part
uploads-2026-09-24.tgz
Error response from daemon: No such container: pg-sai
2026-09-24 01:35:22 · db-2026-09-24.dump   0B
2026-09-24 01:35:23 · uploads-2026-09-24.tgz  12M
2026-09-24 01:35:23 · xong · giữ 2 file
exit=0

0 db-2026-09-24.dump
12585059 uploads-2026-09-24.tgz</div>
<p>With <code>set -e</code> the script stops at the failed dump, exits 1 (so cron, or your monitoring, can notice), and leaves only an empty <code>.part</code> file next to the previous good dump. Without it, the script carries on, renames the empty file to <code>db-….dump</code>, prints a cheerful "done" and exits 0 — a zero-byte file with the name of a real backup, which is the worst possible outcome.</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>set -Eeuo pipefail</code></span><span class="v">Without it, a failed <code>pg_dump</code> in a pipeline still exits 0 and you keep a zero-byte file for two weeks. Chapter 7 of the Linux &amp; Bash course covers why each of those four letters matters.</span></div>
  <div class="kv"><span class="k">Write <code>.part</code>, then rename</span><span class="v">A rename on the same filesystem is atomic. An interrupted backup leaves a <code>.part</code> file that the retention rule ignores, instead of a truncated file that looks like a real backup.</span></div>
  <div class="kv"><span class="k">Off the machine</span><span class="v">A backup on the same disk as the database survives <code>rm -rf</code> and nothing else — not a failed disk, not a deleted VPS, not ransomware. R2/S3/B2 with a lifecycle rule is a few cents a month.</span></div>
  <div class="kv"><span class="k">Alert on absence, not on failure</span><span class="v">A cron job that dies silently produces no failure alert. Have the script touch a heartbeat URL on success and alert when the heartbeat stops — healthchecks.io, or a two-line check in your own monitoring.</span></div>
  <div class="kv"><span class="k">Restore on a schedule</span><span class="v">Once a month, restore last night's dump into a scratch database and count a table. Put it in the calendar; it is the only test that matters.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the night before your SWP391 defence, the team lead asks: "if the demo database dies tomorrow morning, how long until it is back — and are you <em>sure</em> the backup works?" Answer with numbers.</p><ol>
<li>Create <code>thu-pgdata</code>, start <code>thu-pg</code> on it (<code>postgres:16-alpine</code>), and insert 100,000 rows as in "back up a real Postgres" above.</li>
<li>Take a logical dump <strong>without</strong> <code>-t</code>, timed. Restore it into a new container <code>thu-pg2</code> (its own volume <code>thu-pgdata2</code>) and compare <code>count(*)</code> and <code>sum(tong)</code> on both sides.</li>
<li>Stop <code>thu-pg</code>, tar the volume with the helper container, restore into <code>thu-pgdata3</code>, start <code>thu-pg3</code> on it and count again.</li>
<li>Take a second dump <strong>with</strong> <code>docker exec -t</code> and run <code>pg_restore -l</code> on it. Compare the two file sizes.</li>
<li>Clean up by name: <code>docker rm -f thu-pg thu-pg2 thu-pg3</code>, <code>docker volume rm thu-pgdata thu-pgdata2 thu-pgdata3</code>, delete the files.</li></ol>
<p><strong>Done when:</strong> three identical counts and sums (original, dump restore, tar restore), two timings you can quote ("dump took … s, restore … s"), and a <code>pg_restore</code> error on the <code>-t</code> file; <code>docker volume ls --filter name=thu-</code> is empty at the end.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Logical dump</span><span class="v">The database exports its contents (<code>pg_dump</code>); consistent while running, portable across versions and CPUs.</span></div>
  <div class="kv"><span class="k">File-level (physical) backup</span><span class="v">A copy of the data files; only valid with the database stopped (or an atomic snapshot), same major version only.</span></div>
  <div class="kv"><span class="k">Torn snapshot</span><span class="v">Files copied while being written — no single point in time; may not restore.</span></div>
  <div class="kv"><span class="k">Custom format (<code>-Fc</code>)</span><span class="v"><code>pg_dump</code>'s compressed binary archive, restored with <code>pg_restore</code>.</span></div>
  <div class="kv"><span class="k">TTY (<code>-t</code>)</span><span class="v">A pseudo-terminal given to the command; it rewrites line endings, so never use it to pipe data out.</span></div>
  <div class="kv"><span class="k">Helper container</span><span class="v">A <code>--rm</code> container that mounts a volume plus a host folder just to run <code>tar</code>.</span></div>
  <div class="kv"><span class="k">Atomic rename</span><span class="v">Write <code>.part</code>, then <code>mv</code> on the same filesystem: a file with the final name is always complete.</span></div>
  <div class="kv"><span class="k">Off-site copy</span><span class="v">A backup on another machine or service (R2/S3); the only kind that survives losing the server.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A helper container (<code>-v vol:/from:ro -v "$PWD:/to"</code> + <code>tar</code>) backs up and restores any volume; always restore into a <em>new</em> volume first.</li>
<li>For a database, prefer <code>pg_dump</code>: measured 0.49 s and 4.4 MB for 500,000 rows while running, restorable into a newer version on another CPU.</li>
<li>A file-level copy needs the database stopped and the same major version (Postgres 18 refused 16's files).</li>
<li>Never <code>docker exec -t</code> when piping data out — it corrupts binary dumps and still exits 0.</li>
<li>After moving or restoring, verify by count + checksum (<code>count(*)</code>, <code>sum</code>, <code>md5sum</code> of all files), not by <code>du</code>.</li>
<li>A nightly script needs <code>set -Eeuo pipefail</code>, <code>.part</code> + rename, an off-site copy, and a restore test on a schedule.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/storage/volumes/#back-up-restore-or-migrate-data-volumes" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Back up, restore, or migrate volumes</span><span class="lc-sub">The official helper-container recipes this lesson expands on, including the <code>--volumes-from</code> variant for older setups.</span></span>
</a>
<a class="link-card" href="https://www.postgresql.org/docs/current/backup.html" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">PostgreSQL — Backup and Restore</span><span class="lc-sub">Why a file-level copy of a running cluster is unsafe, what <code>pg_dump --format=custom</code> gives you over plain SQL, and how continuous archiving (PITR) works when a nightly dump is not enough.</span></span>
</a>
<a class="link-card" href="https://rclone.org/docs/" target="_blank" rel="noopener">
  <span class="lc-ico">☁️</span>
  <span class="lc-body"><span class="lc-title">rclone</span><span class="lc-sub">One tool that talks to R2, S3, B2, Drive and forty other backends, with <code>--max-age</code>, server-side encryption and bandwidth limits. The simplest way to get backups off the machine.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: back up and restore for real</span><span class="lc-sub">Graded exercises: tar a volume and restore it into a new one, take a live <code>pg_dump</code> and verify it by row count, and explain why a nightly script writes <code>.part</code> before renaming.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> backing up the volume that holds the database by tarring it while Postgres is running, and finding out at 3am that it does not restore. The tar completes, the file is a plausible size, and everything looks fine — the corruption is invisible until you need it. The rule is simple: <em>file-level copies require the writer to be stopped, logical dumps do not.</em> For a container database that means <code>pg_dump</code>/<code>mysqldump</code> through <code>docker exec</code>, or a genuine filesystem snapshot, or accepting a minute of downtime for a cold tar. And whichever you pick, restore it into a scratch database once and count a row you recognise — the two minutes that turns an assumption into a fact.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A throwaway container with the volume mounted <code>:ro</code> and a host directory mounted read-write backs up anything, anywhere, with no extra tools. A file-level copy of a <em>running</em> database is not a backup — use a logical dump, a snapshot, or stop the engine. And restore into a new volume or a scratch database and verify, always: a backup that has never been restored has an unknown status, not a good one.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Sao lưu, khôi phục, di chuyển</h2>
<p class="lead">Một volume bạn không khôi phục được thì không phải bản sao lưu, đó là một niềm hy vọng. Bài này nói về hai chiến lược sao lưu thật sự khác nhau — chép file, hoặc bảo ứng dụng tự xuất dữ liệu ra — khi nào cái nào đúng, và cách chuyển một volume sang máy khác. Nửa KHÔI PHỤC được viết dài hơn nửa sao lưu, vì đó là nửa người ta hay bỏ qua.</p>

<h3>Mẫu container phụ</h3>
${slide('dk-07', 24, 'Mẫu container phụ: volume :ro + thư mục máy + tar')}
<pre><code><span class="tok-comment"># Sao lưu một volume thành file tar trong thư mục hiện tại</span>
docker run --rm \\
  -v blog-uploads:/from:ro \\
  -v "$PWD:/to" \\
  alpine:3.20 tar -C /from -czf /to/uploads-2026-08-22.tgz .
ls -lh uploads-2026-08-22.tgz</code></pre>
<div class="out">-rw-r--r-- 1 root root 611M Aug 22 10:02 uploads-2026-08-22.tgz</div>
<p>Không có gì đặc biệt xảy ra cả: một container dùng xong vứt gắn volume ở chế độ chỉ đọc và một thư mục máy chủ ở chế độ đọc-ghi, rồi <code>tar</code> làm phần còn lại. Cách này chạy với mọi volume, trên mọi máy chủ, không cần công cụ nào ngoài Docker — và vì nguồn là <code>:ro</code>, gõ sai lệnh cũng không làm hỏng được bản gốc.</p>
<pre><code><span class="tok-comment"># Khôi phục vào một volume MỚI — đừng bao giờ đè lên cái đang sống ở lần thử đầu</span>
docker volume create blog-uploads-restored
docker run --rm \\
  -v blog-uploads-restored:/to \\
  -v "$PWD:/from:ro" \\
  alpine:3.20 tar -C /to -xzf /from/uploads-2026-08-22.tgz
docker run --rm -v blog-uploads-restored:/d alpine:3.20 sh -c 'ls /d | wc -l; du -sh /d'</code></pre>
<div class="out">4127
611.2M	/d</div>
<div class="callout ok"><strong>Khôi phục vào volume mới, rồi mới tráo.</strong> Nó tốn ít đĩa và không tốn gì khác, và nó biến "khôi phục bản sao lưu" từ một thao tác một chiều đáng sợ thành thứ bạn kiểm được trước khi nó trở nên quan trọng. Trỏ một container tạm vào volume vừa khôi phục, kiểm dữ liệu đúng như bạn nghĩ, rồi mới dừng dịch vụ và trỏ lại.</div>
<h3>Đọc lệnh container phụ, từng phần một</h3>
<table>
<tr><th>Mẩu lệnh</th><th>Làm gì</th></tr>
<tr><td><code>docker run --rm</code></td><td>Container dùng xong vứt: bị xoá ngay khi <code>tar</code> xong, cùng volume vô danh của nó</td></tr>
<tr><td><code>-v blog-uploads:/from:ro</code></td><td>Volume cần sao lưu, ở <code>/from</code>, chỉ đọc — gõ sai cũng không làm hỏng được nó</td></tr>
<tr><td><code>-v "$PWD:/to"</code></td><td>Thư mục hiện tại trên máy bạn, ở <code>/to</code>: nơi file nén rơi xuống</td></tr>
<tr><td><code>alpine:3.20</code></td><td>Ảnh nhỏ nào có <code>tar</code> cũng được</td></tr>
<tr><td><code>tar -C /from</code></td><td>Vào <code>/from</code> trước, để đường dẫn trong file nén bắt đầu từ gốc volume</td></tr>
<tr><td><code>-c</code> · <code>-x</code></td><td>Tạo file nén · giải nén</td></tr>
<tr><td><code>-z</code></td><td>Nén gzip (<code>.tgz</code>)</td></tr>
<tr><td><code>-f /to/uploads-….tgz</code></td><td>Tên file nén (<code>-f -</code> = stdout/stdin, dùng để "chảy thẳng" ở dưới)</td></tr>
<tr><td><code>.</code> (dấu chấm cuối)</td><td>"Mọi thứ trong thư mục hiện tại", kể cả file ẩn — dùng <code>*</code> sẽ bỏ sót chúng</td></tr>
</table>
<p>Cùng mẫu đó trên một volume Postgres thật (158 MB file dữ liệu cho một bảng 500 000 dòng, CSDL đã được <em>dừng</em> trước — lý do ở dưới), bấm giờ trên máy Mac của khoá:</p>
<pre><code class="language-bash">docker stop pg
time docker run --rm -v pgdata:/from:ro -v "$PWD:/to" alpine:3.20 tar -C /from -czf /to/pgdata.tgz .
ls -lh pgdata.tgz
docker volume create pgdata3
time docker run --rm -v pgdata3:/to -v "$PWD:/from:ro" alpine:3.20 tar -C /to -xzf /from/pgdata.tgz</code></pre>
<div class="out">… 5.096 total
33M pgdata.tgz
pgdata3
… 1.467 total</div>

<h3>tar với pg_dump: chúng không phải cùng một bản sao lưu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tar một cơ sở dữ liệu ĐANG CHẠY</span><span class="v"><strong>Thường là hỏng.</strong> Bạn đang chép file trong lúc engine ghi vào chúng. Thứ bạn nhận được là trạng thái trên đĩa của không một thời điểm nào cả — một ảnh chụp rách, có thể khôi phục được, có thể khôi phục sai, hoặc có thể không chịu khởi động.</span></div>
  <div class="kv"><span class="k">tar một cơ sở dữ liệu ĐÃ DỪNG</span><span class="v"><strong>Hợp lệ</strong>, và đúng từng byte. Khôi phục nhanh, nhưng chỉ khôi phục được vào cùng phiên bản chính của engine, và nó đồng nghĩa với thời gian ngừng dịch vụ bằng đúng thời gian chép.</span></div>
  <div class="kv"><span class="k"><code>pg_dump</code> / <code>mysqldump</code></span><span class="v"><strong>Hợp lệ trên cơ sở dữ liệu đang sống</strong>, vì engine cho bạn một ảnh chụp nhất quán ở mức giao dịch. Mang đi được qua các phiên bản và thậm chí qua các máy khác kiến trúc. Khôi phục chậm hơn với cơ sở dữ liệu lớn.</span></div>
  <div class="kv"><span class="k">Ảnh chụp hệ thống file (LVM/ZFS/đám mây)</span><span class="v"><strong>Hợp lệ và tức thì</strong>, nếu ảnh chụp là nguyên tử và engine an toàn khi sập. Đây là thứ các dịch vụ cơ sở dữ liệu có quản thật sự làm. Đòi tầng lưu trữ hỗ trợ.</span></div>
</div>
<pre><code><span class="tok-comment"># Cách đúng cho Postgres — xuất logic, từ container, khi đang sống</span>
docker exec cuonghoangdev_postgres \\
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --compress=9 \\
  &gt; "db-$(date +%F).dump"
ls -lh db-*.dump</code></pre>
<div class="out">-rw-r--r-- 1 cuong cuong 84M Aug 22 10:11 db-2026-08-22.dump</div>
<pre><code><span class="tok-comment"># Khôi phục vào một cơ sở dữ liệu nháp trước, rồi đếm thứ bạn nhận ra</span>
docker exec -i cuonghoangdev_postgres createdb -U "$POSTGRES_USER" restore_check
docker exec -i cuonghoangdev_postgres \\
  pg_restore -U "$POSTGRES_USER" -d restore_check --no-owner &lt; db-2026-08-22.dump
docker exec -t cuonghoangdev_postgres \\
  psql -U "$POSTGRES_USER" -d restore_check -c 'select count(*) from "User";'</code></pre>
<div class="out"> count
-------
  1284
(1 row)</div>
<div class="callout warn"><strong>Một bản sao lưu bạn chưa từng khôi phục có trạng thái KHÔNG BIẾT.</strong> Không phải "chắc là ổn" — mà là không biết. Những kiểu hỏng đều tầm thường và toàn phần: một bản dump bị cắt cụt vì đĩa đầy, một file 0 byte vì tên container đã đổi, một kho lưu trữ khôi phục được nhưng thiếu mất một schema vì <code>pg_dump</code> chạy bằng một người dùng không có quyền trên schema đó. Khôi phục vào một cơ sở dữ liệu nháp rồi đếm một bảng bạn biết chỉ mất hai phút, và đó là toàn bộ khác biệt giữa một bản sao lưu và một niềm hy vọng.</div>
<div class="callout warn"><strong>Đã sửa: không dùng <code>-t</code> với <code>pg_dump</code>.</strong> Bản cũ của các lệnh này dùng <code>docker exec -t … pg_dump … &gt; file</code>. <code>-t</code> cấp cho lệnh một terminal, mà terminal thì viết lại ký tự xuống dòng — thứ âm thầm làm hỏng một bản dump nhị phân <code>--format=custom</code> (đo ở dưới). Lấy dữ liệu RA thì dùng <code>docker exec</code> không cờ, đưa dữ liệu VÀO thì <code>-i</code>. Để ý thêm: <code>"$POSTGRES_USER"</code> trong các lệnh này được shell của <em>máy bạn</em> thay giá trị, không phải bên trong container — hãy export nó trên máy (hoặc viết thẳng tên người dùng), không thì nó lặng lẽ thành chuỗi rỗng.</div>

<h3>Chạy thử từng bước: sao lưu một Postgres thật, khôi phục, rồi đếm</h3>
${slide('dk-07', 26, 'Khôi phục xong thì ĐẾM — 500 000 = 500 000')}
<p>Mọi con số ở đây lấy từ máy Mac của khoá (Postgres 16 Alpine, Docker 29.8, 09/2026). Trước hết một CSDL đáng để sao lưu — một volume có tên, và nửa triệu dòng:</p>
<pre><code class="language-bash">docker volume create pgdata
docker run -d --name pg -e POSTGRES_PASSWORD=x -v pgdata:/var/lib/postgresql/data postgres:16-alpine
until docker exec pg pg_isready -U postgres -q; do sleep 1; done
docker exec pg psql -U postgres -q \\
  -c "create table don_hang(id serial primary key, khach text, tong numeric(12,0), tao_luc timestamptz default now());" \\
  -c "insert into don_hang(khach,tong) select 'khach-'||g, (random()*5000000)::int from generate_series(1,500000) g;"
docker exec pg psql -U postgres -At -c "select count(*), pg_size_pretty(pg_database_size('postgres')) from don_hang;"</code></pre>
<div class="out">500000|47 MB</div>
<p><strong>Dump logic (xuất logic), trong lúc CSDL đang chạy:</strong></p>
<pre><code class="language-bash">time (docker exec pg pg_dump -U postgres -d postgres --format=custom &gt; db.dump)
ls -lh db.dump</code></pre>
<div class="out">… 0.489 total
-rw-r--r--@ 1 admin  wheel   4.4M Sep 24 01:32 db.dump</div>
<p><strong>Khôi phục vào một container và volume mới tinh, rồi đếm:</strong></p>
<pre><code class="language-bash">docker run -d --name pg2 -e POSTGRES_PASSWORD=x -v pgdata2:/var/lib/postgresql/data postgres:16-alpine
until docker exec pg2 pg_isready -U postgres -q; do sleep 1; done
docker exec pg2 createdb -U postgres khoi_phuc
time (docker exec -i pg2 pg_restore -U postgres -d khoi_phuc --no-owner &lt; db.dump)
docker exec pg2 psql -U postgres -d khoi_phuc -c "select count(*), sum(tong) from don_hang;"
docker exec pg  psql -U postgres -c "select count(*), sum(tong) from don_hang;"</code></pre>
<div class="out">… 0.719 total
 count  |      sum
--------+---------------
 500000 | 1250008591454
(1 row)

 count  |      sum
--------+---------------
 500000 | 1250008591454
(1 row)</div>
<p>Cùng số dòng và cùng tổng <code>sum</code> (đóng vai một mã kiểm) ở hai phía: bản sao lưu này có trạng thái <em>biết chắc là tốt</em>. Bản tar nguội (khi CSDL đã dừng) của cùng volume đó (ở trên) được khôi phục vào <code>pgdata3</code> và kiểm y như vậy:</p>
<pre><code class="language-bash">docker run -d --name pg3 -e POSTGRES_PASSWORD=x -v pgdata3:/var/lib/postgresql/data postgres:16-alpine
docker exec pg3 psql -U postgres -c "select count(*), sum(tong) from don_hang;"
docker logs pg3 2&gt;&amp;1 | grep -i skipping
docker run --rm -v pgdata3:/d:ro alpine:3.20 cat /d/PG_VERSION</code></pre>
<div class="out"> count  |      sum
--------+---------------
 500000 | 1250008591454
(1 row)

PostgreSQL Database directory appears to contain a database; Skipping initialization
16</div>
${slide('dk-07', 25, 'tar thư mục data ≠ pg_dump — số đo thật')}
<table>
<tr><th>Cùng 500 000 dòng</th><th><code>pg_dump --format=custom</code></th><th><code>tar</code> thư mục data đã dừng</th></tr>
<tr><td>Thời gian sao lưu</td><td>0,49 giây, CSDL vẫn chạy</td><td>5,1 giây, CSDL phải <strong>tắt</strong></td></tr>
<tr><td>Kích thước file</td><td>4,4 MB (chỉ dữ liệu, đã nén)</td><td>33 MB (dữ liệu + chỉ mục + WAL, gzip)</td></tr>
<tr><td>Thời gian khôi phục</td><td>0,72 giây (dựng lại chỉ mục)</td><td>1,5 giây giải nén, rồi khởi động</td></tr>
<tr><td>Khôi phục vào được</td><td>Mọi Postgres mới hơn, mọi CPU (đã thử: 16 arm64 → 18.6 amd64)</td><td>Chỉ đúng bản chính đó (đã thử: 18 từ chối file của 16)</td></tr>
</table>
<p>Ở cỡ này bản dump thắng mọi dòng. Chép file bắt đầu có chỗ đứng ở những CSDL rất lớn, nơi chạy lại một bản dump mất hàng giờ — và ở cỡ đó bạn cần snapshot thật hoặc lưu trữ liên tục (link PostgreSQL bên dưới), chứ không phải một lần tar mỗi đêm.</p>

<h3>docker exec -t làm hỏng bản dump nhị phân</h3>
${slide('dk-07', 27, 'docker exec -t làm hỏng bản dump nhị phân')}
<pre><code class="language-bash">docker exec    pg pg_dump -U postgres -d postgres --format=custom &gt; db.dump
docker exec -t pg pg_dump -U postgres -d postgres --format=custom &gt; db-tty.dump
ls -l db.dump db-tty.dump | awk '{print $5, $9}'
docker exec -i pg pg_restore -l &lt; db-tty.dump</code></pre>
<div class="out">4610442 db.dump
4631142 db-tty.dump
pg_restore: error: could not read from input file: end of file</div>
<p>Dài hơn 20 700 byte, và không đọc được. <code>-t</code> cấp một terminal ảo (pseudo-terminal); terminal biến mỗi byte <code>\\n</code> trong output thành <code>\\r\\n</code>. Với văn bản bạn có thể không bao giờ nhận ra; một file nén nhị phân thì bị phá huỷ — và cả hai lệnh đều thoát 0, kể cả từ một việc cron không có terminal nào (lượt chạy này cũng không tương tác). Mẹo nhớ: <code>-it</code> chỉ khi CON NGƯỜI gõ (<code>psql</code>, <code>sh</code>); <code>-i</code> khi bạn đổ dữ liệu vào; không cờ nào khi bạn lấy dữ liệu ra.</p>

<h3>Chuyển một volume sang máy khác</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Dừng thứ đang ghi vào nó</span><span class="lz-t">docker compose stop api worker</span><span class="lz-d">Với cơ sở dữ liệu thì dừng luôn engine, hoặc dùng bản xuất logic thay thế. Chép một thư mục dữ liệu đang sống qua mạng là bài toán ảnh chụp rách cộng thêm độ trễ.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Chảy thẳng, đừng dừng lại ở giữa</span><span class="lz-t">tar ra stdout, ssh, tar từ stdin</span><span class="lz-d">Không file tạm ở phía nào, nên một volume 40GB không cần 40GB trống ở hai nơi. Chạy được giữa mọi cặp máy có ssh.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Tạo volume đích trước</span><span class="lz-t">docker volume create, một cách tường minh</span><span class="lz-d">Để nó tồn tại với đúng cái tên và nhãn bạn muốn, thay vì được tự tạo bởi container đầu tiên tham chiếu tới nó.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Kiểm trước khi xoá bất cứ thứ gì</span><span class="lz-t">số file, kích thước, checksum một mẫu</span><span class="lz-d">Rồi giữ volume nguồn thêm một tuần. Đĩa rẻ hơn cuộc trao đổi về việc đám file tải lên đi đâu mất.</span></div>
</div>
<pre><code><span class="tok-comment"># Một lệnh, không file trung gian, máy nguồn → máy đích</span>
docker run --rm -v blog-uploads:/from:ro alpine:3.20 tar -C /from -cf - . \\
  | ssh deploy@newhost 'docker volume create blog-uploads &gt;/dev/null; \\
      docker run --rm -i -v blog-uploads:/to alpine:3.20 tar -C /to -xf -'

<span class="tok-comment"># Đối chiếu hai phía</span>
docker run --rm -v blog-uploads:/d:ro alpine:3.20 sh -c 'find /d -type f | wc -l'
ssh deploy@newhost 'docker run --rm -v blog-uploads:/d:ro alpine:3.20 sh -c "find /d -type f | wc -l"'</code></pre>
<div class="out">4127
4127</div>
<h3>Đo thật: một volume Postgres từ máy Mac (arm64) sang máy Linux (amd64)</h3>
${slide('dk-07', 28, 'Chuyển volume sang máy khác: tar | ssh | tar, rồi so md5')}
<p>Volume <code>pgdata</code> đã dừng ở trên, cho chảy qua đúng lệnh của mục này (máy Linux đi qua một máy trung gian nên mạng chậm):</p>
<pre><code class="language-bash">time (docker run --rm -v pgdata:/from:ro alpine:3.20 tar -C /from -cf - . \\
  | ssh linux-nha 'docker volume create pgdata &gt;/dev/null; docker run --rm -i -v pgdata:/to alpine tar -C /to -xf -')
docker run --rm -v pgdata:/d:ro alpine:3.20 sh -c 'find /d -type f | wc -l; du -sh /d'
ssh linux-nha 'docker run --rm -v pgdata:/d:ro alpine sh -c "find /d -type f | wc -l; du -sh /d"'</code></pre>
<div class="out">… 37.252 total
982
158.2M	/d
982
158.1M	/d</div>
<p>Cùng số file, nhưng <code>du</code> lệch 0,1M — hai hệ thống file khác nhau làm tròn kích thước khác nhau. Vì thế phép kiểm có giá trị là một mã kiểm trên từng file, xếp theo tên:</p>
<pre><code class="language-bash">docker run --rm -v pgdata:/d:ro alpine:3.20 sh -c 'cd /d &amp;&amp; find . -type f -exec md5sum {} + | sort -k2 | md5sum'
ssh linux-nha 'docker run --rm -v pgdata:/d:ro alpine sh -c "cd /d &amp;&amp; find . -type f -exec md5sum {} + | sort -k2 | md5sum"'</code></pre>
<div class="out">7b020c506e90772aa07c6907ea816405  -
7b020c506e90772aa07c6907ea816405  -</div>
<p>Giống hệt. Postgres 16 trên máy amd64 sau đó khởi động được trên những file tạo ra ở máy arm64 và trả lời <code>500000|1250008591454</code> — lần này chạy được vì cả hai CPU đều 64-bit little-endian, nhưng PostgreSQL không hứa điều đó với file dữ liệu. Thứ nó chắc chắn từ chối là khác phiên bản chính. Gắn cùng volume đó vào <code>postgres:18-alpine</code>:</p>
<div class="out">Error: in 18+, these Docker images are configured to store database data in a
       format which is compatible with "pg_ctlcluster" (specifically, using
       major-version-specific directory names).
…
FATAL:  database files are incompatible with server
DETAIL:  The data directory was initialized by PostgreSQL version 16, which is not compatible with this version 18.6.</div>
<p>(Thông báo đầu là chốt chặn của chính ảnh — từ bản 18 ảnh giữ dữ liệu ở <code>/var/lib/postgresql/18/docker</code> và chờ volume gắn ở <code>/var/lib/postgresql</code>; thông báo sau là của Postgres, sau khi ép đường dẫn cũ bằng <code>-e PGDATA=…</code>.) Bản dump logic không có giới hạn đó: cùng file <code>db.dump</code>, đổ qua ssh vào một Postgres 18.6 mới tinh trên amd64, khôi phục trong 1,3 giây và đếm ra <code>500000|1250008591454</code>. Muốn chuyển CSDL qua phiên bản hay qua máy khác, hãy chuyển bản dump; chỉ chuyển file volume giữa hai phiên bản giống hệt nhau.</p>

<h3>Một việc sao lưu hằng đêm thật sự chạy</h3>
${slide('dk-07', 29, 'Script sao lưu hằng đêm: set -e + .part là thứ cứu bạn')}
<pre><code><span class="tok-comment"># /opt/backup/nightly.sh — cố ý viết cho nhàm chán</span>
#!/usr/bin/env bash
set -Eeuo pipefail
STAMP=$(date +%F)
DEST=/opt/backup/out
KEEP=14
log() { echo "$(date '+%F %T') · $*"; }

mkdir -p "$DEST"
docker exec cuonghoangdev_postgres \\
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --compress=9 \\
  &gt; "$DEST/db-$STAMP.dump.part"
mv "$DEST/db-$STAMP.dump.part" "$DEST/db-$STAMP.dump"   <span class="tok-comment"># nguyên tử: không bao giờ có file dở mang tên .dump</span>
log "db-$STAMP.dump $(du -h "$DEST/db-$STAMP.dump" | cut -f1)"

docker run --rm -v blog-uploads:/from:ro -v "$DEST:/to" alpine:3.20 \\
  tar -C /from -czf "/to/uploads-$STAMP.tgz.part" .
mv "$DEST/uploads-$STAMP.tgz.part" "$DEST/uploads-$STAMP.tgz"
log "uploads-$STAMP.tgz $(du -h "$DEST/uploads-$STAMP.tgz" | cut -f1)"

find "$DEST" -name '*.dump' -mtime +$KEEP -delete
find "$DEST" -name '*.tgz'  -mtime +$KEEP -delete
log "xong · giữ $(ls "$DEST" | wc -l | tr -d ' ') file"
rclone copy "$DEST" r2:backups/cuongthai --max-age 48h   <span class="tok-comment"># ra khỏi máy, không thì chưa phải sao lưu</span></code></pre>
<div class="out">2026-09-24 01:35:15 · db-2026-09-24.dump 4.4M
2026-09-24 01:35:15 · uploads-2026-09-24.tgz  12M
2026-09-24 01:35:15 · xong · giữ 2 file</div>
<p class="note-ct">Lượt chạy thật của script này trên máy Mac của khoá (09/2026) với CSDL thử và một volume thử 12 MB, dòng <code>rclone</code> được tắt vì máy đó không cấu hình R2. Bản cũ của bài in ra những dòng log mà script không bao giờ in được; các dòng <code>log</code> ở trên được thêm vào để script nói ra việc nó đã làm — và <code>docker exec -t</code> đã được bỏ (xem "docker exec -t làm hỏng bản dump nhị phân").</p>
<p><code>set -Eeuo pipefail</code> đáng giá bao nhiêu, đo thật: cùng script, gõ sai tên container.</p>
<pre><code class="language-bash"><span class="tok-comment"># có set -Eeuo pipefail</span>
bash nightly.sh; echo "exit=$?"; ls out/
<span class="tok-comment"># cùng file đó, bỏ dòng set</span>
bash nightly-no-set-e.sh; echo "exit=$?"; ls -l out/ | awk '{print $5, $9}'</code></pre>
<div class="out">Error response from daemon: No such container: pg-sai
exit=1
db-2026-09-24.dump
db-2026-09-24.dump.part
uploads-2026-09-24.tgz
Error response from daemon: No such container: pg-sai
2026-09-24 01:35:22 · db-2026-09-24.dump   0B
2026-09-24 01:35:23 · uploads-2026-09-24.tgz  12M
2026-09-24 01:35:23 · xong · giữ 2 file
exit=0

0 db-2026-09-24.dump
12585059 uploads-2026-09-24.tgz</div>
<p>Có <code>set -e</code>, script dừng ngay ở lần dump hỏng, thoát 1 (để cron hay hệ giám sát của bạn nhận ra), và chỉ để lại một file <code>.part</code> rỗng bên cạnh bản dump tốt trước đó. Không có nó, script chạy tiếp, đổi tên file rỗng thành <code>db-….dump</code>, in một chữ "xong" vui vẻ rồi thoát 0 — một file 0 byte mang tên của một bản sao lưu thật, kết cục tệ nhất có thể.</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>set -Eeuo pipefail</code></span><span class="v">Không có nó thì một lệnh <code>pg_dump</code> chết trong đường ống vẫn thoát 0 và bạn giữ một file 0 byte suốt hai tuần. Chương 7 khoá Linux &amp; Bash giải thích vì sao từng chữ trong bốn chữ đó quan trọng.</span></div>
  <div class="kv"><span class="k">Ghi ra <code>.part</code>, rồi đổi tên</span><span class="v">Đổi tên trên cùng một hệ thống file là thao tác nguyên tử. Một lượt sao lưu bị ngắt để lại một file <code>.part</code> mà luật lưu giữ bỏ qua, thay vì một file cụt trông y như bản sao lưu thật.</span></div>
  <div class="kv"><span class="k">Ra khỏi máy</span><span class="v">Một bản sao lưu nằm cùng đĩa với cơ sở dữ liệu chỉ sống sót qua <code>rm -rf</code> chứ không qua gì khác — không qua đĩa hỏng, không qua VPS bị xoá, không qua mã tống tiền. R2/S3/B2 kèm luật vòng đời tốn vài xu mỗi tháng.</span></div>
  <div class="kv"><span class="k">Báo động khi VẮNG, đừng chỉ báo khi lỗi</span><span class="v">Một việc cron chết câm thì không sinh ra cảnh báo lỗi nào. Hãy để script chạm vào một URL nhịp tim khi thành công rồi báo động khi nhịp tim ngừng — healthchecks.io, hoặc một phép kiểm hai dòng trong hệ giám sát của chính bạn.</span></div>
  <div class="kv"><span class="k">Khôi phục theo lịch</span><span class="v">Mỗi tháng một lần, khôi phục bản dump đêm qua vào một cơ sở dữ liệu nháp rồi đếm một bảng. Hãy đặt nó vào lịch; đó là phép kiểm duy nhất có ý nghĩa.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối trước buổi bảo vệ SWP391, trưởng nhóm hỏi: "nếu sáng mai CSDL demo chết thì mất bao lâu để dựng lại — và em có <em>chắc</em> bản sao lưu chạy được không?" Hãy trả lời bằng con số.</p><ol>
<li>Tạo <code>thu-pgdata</code>, khởi động <code>thu-pg</code> trên nó (<code>postgres:16-alpine</code>), rồi chèn 100 000 dòng như mục "sao lưu một Postgres thật" ở trên.</li>
<li>Lấy một bản dump logic <strong>không có</strong> <code>-t</code>, có bấm giờ. Khôi phục vào container mới <code>thu-pg2</code> (volume riêng <code>thu-pgdata2</code>) và so <code>count(*)</code> với <code>sum(tong)</code> ở hai phía.</li>
<li>Dừng <code>thu-pg</code>, tar volume bằng container phụ, khôi phục vào <code>thu-pgdata3</code>, khởi động <code>thu-pg3</code> trên đó và đếm lại.</li>
<li>Lấy bản dump thứ hai <strong>có</strong> <code>docker exec -t</code> và chạy <code>pg_restore -l</code> trên nó. So kích thước hai file.</li>
<li>Dọn theo tên: <code>docker rm -f thu-pg thu-pg2 thu-pg3</code>, <code>docker volume rm thu-pgdata thu-pgdata2 thu-pgdata3</code>, xoá các file.</li></ol>
<p><strong>Đạt khi:</strong> ba lần đếm và ba tổng giống hệt nhau (bản gốc, khôi phục từ dump, khôi phục từ tar), hai con số thời gian bạn nói ra được ("dump mất … giây, khôi phục … giây"), và một lỗi <code>pg_restore</code> trên file <code>-t</code>; cuối cùng <code>docker volume ls --filter name=thu-</code> rỗng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Logical dump (xuất logic)</span><span class="v">CSDL tự xuất nội dung (<code>pg_dump</code>); nhất quán khi đang chạy, mang qua được phiên bản và CPU khác.</span></div>
  <div class="kv"><span class="k">File-level backup (sao lưu mức file)</span><span class="v">Bản chép các file dữ liệu; chỉ hợp lệ khi CSDL đã dừng (hoặc snapshot nguyên tử), và chỉ cùng phiên bản chính.</span></div>
  <div class="kv"><span class="k">Torn snapshot (ảnh chụp rách)</span><span class="v">File bị chép trong lúc đang được ghi — không thuộc một thời điểm nào; có thể không khôi phục được.</span></div>
  <div class="kv"><span class="k">Custom format (<code>-Fc</code>, định dạng riêng)</span><span class="v">File nén nhị phân của <code>pg_dump</code>, khôi phục bằng <code>pg_restore</code>.</span></div>
  <div class="kv"><span class="k">TTY (<code>-t</code>, terminal ảo)</span><span class="v">Terminal giả cấp cho lệnh; nó viết lại ký tự xuống dòng, nên đừng bao giờ dùng khi lấy dữ liệu ra.</span></div>
  <div class="kv"><span class="k">Helper container (container phụ)</span><span class="v">Container <code>--rm</code> gắn một volume và một thư mục máy chỉ để chạy <code>tar</code>.</span></div>
  <div class="kv"><span class="k">Atomic rename (đổi tên nguyên tử)</span><span class="v">Ghi ra <code>.part</code>, rồi <code>mv</code> trên cùng hệ thống file: file mang tên cuối cùng luôn trọn vẹn.</span></div>
  <div class="kv"><span class="k">Off-site copy (bản sao ngoài máy)</span><span class="v">Bản sao lưu ở máy hay dịch vụ khác (R2/S3); thứ duy nhất sống sót khi mất cả máy chủ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Container phụ (<code>-v vol:/from:ro -v "$PWD:/to"</code> + <code>tar</code>) sao lưu và khôi phục được mọi volume; luôn khôi phục vào một volume <em>mới</em> trước.</li>
<li>Với CSDL, ưu tiên <code>pg_dump</code>: đo được 0,49 giây và 4,4 MB cho 500 000 dòng khi đang chạy, khôi phục được vào phiên bản mới hơn trên CPU khác.</li>
<li>Chép mức file đòi CSDL đã dừng và cùng phiên bản chính (Postgres 18 từ chối file của 16).</li>
<li>Đừng bao giờ <code>docker exec -t</code> khi lấy dữ liệu ra — nó làm hỏng dump nhị phân mà vẫn thoát 0.</li>
<li>Sau khi chuyển hay khôi phục, kiểm bằng đếm + mã kiểm (<code>count(*)</code>, <code>sum</code>, <code>md5sum</code> mọi file), không bằng <code>du</code>.</li>
<li>Script hằng đêm cần <code>set -Eeuo pipefail</code>, <code>.part</code> + đổi tên, một bản ra khỏi máy, và lịch khôi phục thử.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/storage/volumes/#back-up-restore-or-migrate-data-volumes" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Sao lưu, khôi phục, di chuyển volume</span><span class="lc-sub">Những công thức container phụ chính thức mà bài này khai triển thêm, gồm cả biến thể <code>--volumes-from</code> cho các cấu hình đời cũ.</span></span>
</a>
<a class="link-card" href="https://www.postgresql.org/docs/current/backup.html" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">PostgreSQL — Backup and Restore</span><span class="lc-sub">Vì sao chép ở mức file một cụm đang chạy là không an toàn, <code>pg_dump --format=custom</code> cho bạn gì hơn SQL thuần, và lưu trữ liên tục (PITR) hoạt động ra sao khi một bản dump mỗi đêm là chưa đủ.</span></span>
</a>
<a class="link-card" href="https://rclone.org/docs/" target="_blank" rel="noopener">
  <span class="lc-ico">☁️</span>
  <span class="lc-body"><span class="lc-title">rclone</span><span class="lc-sub">Một công cụ nói chuyện được với R2, S3, B2, Drive và bốn chục backend khác, có <code>--max-age</code>, mã hoá phía máy chủ và giới hạn băng thông. Cách đơn giản nhất để đưa bản sao lưu ra khỏi máy.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: sao lưu và khôi phục cho thật</span><span class="lc-sub">Bài chấm điểm: tar một volume rồi khôi phục vào một volume mới, lấy một bản <code>pg_dump</code> khi đang sống rồi kiểm bằng số dòng, và giải thích vì sao script hằng đêm ghi ra <code>.part</code> trước khi đổi tên.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> sao lưu cái volume chứa cơ sở dữ liệu bằng cách tar nó trong lúc Postgres đang chạy, rồi 3 giờ sáng mới biết là nó không khôi phục được. Lệnh tar chạy xong, file có kích thước nghe hợp lý, và mọi thứ trông ổn — chỗ hỏng vô hình cho tới lúc bạn cần tới. Luật thì đơn giản: <em>chép ở mức file đòi hỏi bên ghi phải dừng, xuất logic thì không.</em> Với cơ sở dữ liệu trong container, điều đó nghĩa là <code>pg_dump</code>/<code>mysqldump</code> qua <code>docker exec</code>, hoặc một ảnh chụp hệ thống file thật, hoặc chấp nhận một phút ngừng dịch vụ để tar khi đã tắt. Và chọn cách nào thì cũng hãy khôi phục nó vào một cơ sở dữ liệu nháp một lần rồi đếm một dòng bạn nhận ra — hai phút biến một giả định thành một sự thật.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một container dùng xong vứt, gắn volume bằng <code>:ro</code> và một thư mục máy chủ đọc-ghi, sao lưu được mọi thứ, ở mọi nơi, không cần công cụ nào thêm. Chép ở mức file một cơ sở dữ liệu <em>đang chạy</em> KHÔNG phải là bản sao lưu — hãy dùng bản xuất logic, một ảnh chụp, hoặc dừng engine. Và luôn khôi phục vào volume mới hoặc cơ sở dữ liệu nháp rồi kiểm: một bản sao lưu chưa từng được khôi phục có trạng thái không biết, chứ không phải trạng thái tốt.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.6 ─────────────────────────── */
    {
      title: '7.6 — Quiz: data that survives|||7.6 — Trắc nghiệm: dữ liệu sống sót',
      slug: 'dk-7-6-quiz',
      type: 'QUIZ',
      description: 'Mười tình huống thật: -v src thành volume, volume rỗng mới được chép, prune chỉ xoá volume vô danh, volume bị container đã dừng giữ, node_modules cũ sau khi thêm thư viện, nginx.conf gắn theo inode, WSL2, tmpfs và OOM, docker cp vào tmpfs, và docker exec -t làm hỏng pg_dump.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Data that survives</h2>
<p class="lead">Ten situations from real projects — several of them reproduced on the course's machines while this chapter was written. Each one is decided by a rule you can now explain: where a path really lives, when Docker copies, what an inode is, and what a backup has to prove. Read the explanation after submitting, especially for the ones you guessed.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read <code>-v a:b:c</code> and say whether it makes a named volume, a bind mount or an anonymous volume — and why <code>-v src:/app</code> is not my folder.</li>
<li>I can predict what an empty volume and an empty bind mount show over a directory that has files in the image.</li>
<li>I know what <code>docker volume prune</code> removes since Docker 23, and how to find which container holds a volume.</li>
<li>I can fix the vanished <code>node_modules</code>, and I know why <code>sed -i</code> on a single mounted file does not reach the container.</li>
<li>I can size a tmpfs so it fails with "No space left" instead of an OOM kill, and deliver a secret without <code>docker cp</code>.</li>
<li>I can back up a Postgres volume two ways, restore it into a new container and prove it with a row count.</li>
</ul>
${slide('dk-07', 31, 'Bảng tra nhanh Chương 7')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Trắc nghiệm</span>
<h2>Dữ liệu sống sót</h2>
<p class="lead">Mười tình huống từ dự án thật — vài cái đã được dựng lại trên máy của khoá trong lúc viết chương này. Câu nào cũng được quyết định bởi một luật bạn giờ đã giải thích được: một đường dẫn thật ra nằm ở đâu, khi nào Docker chép, inode là gì, và một bản sao lưu phải chứng minh được điều gì. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được <code>-v a:b:c</code> và nói được nó tạo volume có tên, bind mount hay volume vô danh — và vì sao <code>-v src:/app</code> không phải thư mục của tôi.</li>
<li>Tôi đoán trước được một volume rỗng và một bind mount rỗng cho thấy gì khi gắn đè lên thư mục mà ảnh có file.</li>
<li>Tôi biết <code>docker volume prune</code> xoá gì từ Docker 23, và cách tìm container nào đang giữ một volume.</li>
<li>Tôi vá được vụ <code>node_modules</code> biến mất, và biết vì sao <code>sed -i</code> trên một file gắn đơn lẻ không tới được container.</li>
<li>Tôi đặt được trần cho tmpfs để nó báo "No space left" thay vì bị giết OOM, và đưa bí mật vào mà không dùng <code>docker cp</code>.</li>
<li>Tôi sao lưu được một volume Postgres theo hai cách, khôi phục vào container mới và chứng minh bằng số dòng.</li>
</ul>
${slide('dk-07', 31, 'Bảng tra nhanh Chương 7')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A teammate runs `docker run -d -v src:/app/src node:22-alpine npm run dev` from the project folder and the container sees an EMPTY /app/src. No error was printed. What happened?|||Một bạn cùng nhóm chạy `docker run -d -v src:/app/src node:22-alpine npm run dev` ngay trong thư mục dự án và container thấy /app/src RỖNG. Không có lỗi nào. Chuyện gì đã xảy ra?',
            options: [
              'Docker Desktop has not been given access to that folder in its File Sharing settings, so it mounts an empty placeholder|||Docker Desktop chưa được cấp quyền thư mục đó trong mục File Sharing, nên nó gắn một thư mục giữ chỗ rỗng',
              '`src` has no slash, so Docker treats it as a volume NAME and silently creates a new, empty named volume called src|||`src` không có dấu gạch chéo nên Docker coi nó là TÊN volume và lặng lẽ tạo một volume có tên src mới, rỗng',
              'Bind mounts start read-only and empty until you append :rw to the target path in the -v flag|||Bind mount khởi đầu ở chế độ chỉ đọc và rỗng cho tới khi bạn thêm :rw vào sau đường dẫn đích trong cờ -v',
              'The node:22-alpine image already has an /app/src layer that always wins over anything you mount there|||Ảnh node:22-alpine đã có sẵn tầng /app/src và tầng đó luôn thắng mọi thứ bạn gắn vào đó',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: -v decides the type from the left side: no slash = a volume name. Docker created a volume "src" (docker volume ls shows it) and it was empty. Write ./src or "$PWD/src" for a bind mount, or use --mount type=bind, which refuses instead of guessing. File Sharing problems produce an error or an empty mount of a real path, and image layers never win over a mount.|||VI: -v quyết định kiểu theo vế trái: không có gạch chéo = tên volume. Docker đã tạo volume "src" (docker volume ls thấy ngay) và nó rỗng. Viết ./src hoặc "$PWD/src" để có bind mount, hoặc dùng --mount type=bind, vốn báo lỗi thay vì đoán. Lỗi File Sharing sinh ra thông báo lỗi hoặc gắn rỗng một đường dẫn thật, và tầng ảnh không bao giờ thắng một phép gắn.',
          },
          {
            question: 'You mount a named volume `ngx-conf` over /etc/nginx. Yesterday it worked. Today, after someone ran a container that wrote a single notes.txt into ngx-conf, a NEW volume with that one file makes nginx fail: "open() /etc/nginx/nginx.conf failed". Why?|||Bạn gắn volume có tên `ngx-conf` đè lên /etc/nginx. Hôm qua chạy tốt. Hôm nay, với một volume MỚI chỉ chứa một file notes.txt (do ai đó ghi vào), nginx chết: "open() /etc/nginx/nginx.conf failed". Vì sao?',
            options: [
              'nginx deletes its configuration files at startup when it detects an unknown file inside /etc/nginx|||nginx xoá các file cấu hình của nó lúc khởi động khi phát hiện một file lạ trong /etc/nginx',
              'Volumes are mounted read-only on first use, so the image could not write its config files into it|||Volume được gắn chỉ-đọc ở lần dùng đầu, nên ảnh không ghi được file cấu hình vào đó',
              'Docker copies the image content only the very first time an image is run on a machine, never again after that|||Docker chỉ chép nội dung ảnh ở lần ĐẦU TIÊN ảnh được chạy trên một máy, sau đó không bao giờ chép nữa',
              'Docker copies the image’s files into a volume only if the volume is empty at mount time; one existing file blocks the copy and hides the config|||Docker chỉ chép file của ảnh vào volume nếu volume RỖNG lúc gắn; một file có sẵn là chặn việc chép và che mất cấu hình',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The rule is "copied if empty", measured in Lesson 7.1: an emptied volume is populated again, a volume holding one file is not, and the file then shadows the image’s eight config entries. "Only the first run" is a common but wrong simplification. nginx never deletes its config, and volumes are writable unless you add :ro.|||VI: Luật là "chép nếu rỗng", đã đo ở Bài 7.1: volume bị dọn trống lại được chép, volume đang có một file thì không, và file đó che mất tám mục cấu hình của ảnh. "Chỉ lần chạy đầu" là cách hiểu đơn giản hoá phổ biến nhưng SAI. nginx không bao giờ xoá cấu hình của nó, và volume ghi được trừ khi bạn thêm :ro.',
          },
          {
            question: 'The group VPS is almost full. `docker system df -v` shows a 3 GB named volume `old-uploads` with 0 LINKS. You run `docker volume prune -f`, it reports "Total reclaimed space: 0B", and old-uploads is still there. Why?|||VPS của nhóm gần đầy. `docker system df -v` cho thấy volume có tên `old-uploads` 3 GB với 0 LINKS. Bạn chạy `docker volume prune -f`, nó báo "Total reclaimed space: 0B", và old-uploads vẫn còn. Vì sao?',
            options: [
              'Since Docker 23 a plain volume prune removes only anonymous volumes; a named one needs docker volume rm or prune -a|||Từ Docker 23 volume prune trơn chỉ xoá volume vô danh; volume có tên cần docker volume rm hoặc prune -a',
              'Docker keeps dangling volumes for 24 hours before they become eligible for prune, as a safety net|||Docker giữ volume dangling 24 giờ rồi mới cho prune, như một tấm lưới an toàn',
              'Prune cannot remove anything while at least one container on the host is running, so you must stop them first|||Prune không xoá được gì khi còn ít nhất một container trên máy đang chạy, nên phải dừng chúng trước',
              'The -f flag means "filter" and without a filter value it matches nothing, so nothing was removed|||Cờ -f nghĩa là "filter" và không có giá trị lọc thì nó không khớp gì, nên không có gì bị xoá',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: The prompt itself says "This will remove anonymous local volumes". Named volumes are only removed by name (docker volume rm old-uploads) or with prune -a — after you have checked its age and contents. There is no 24-hour grace period, running containers do not block prune, and -f means "force" (no prompt).|||VI: Chính câu cảnh báo đã nói "This will remove anonymous local volumes". Volume có tên chỉ bị xoá khi gọi đích danh (docker volume rm old-uploads) hoặc với prune -a — sau khi bạn đã kiểm tuổi và nội dung của nó. Không có thời gian chờ 24 giờ, container đang chạy không chặn prune, và -f nghĩa là "force" (không hỏi).',
          },
          {
            question: '`docker volume rm pgdata` fails with "volume is in use - [9caba9dd…]", but `docker ps` lists nothing using it. What is the right next step?|||`docker volume rm pgdata` thất bại với "volume is in use - [9caba9dd…]", nhưng `docker ps` không liệt kê gì dùng nó. Bước tiếp theo đúng là gì?',
            options: [
              'Restart Docker Desktop or dockerd, because the daemon is holding a stale reference in memory|||Khởi động lại Docker Desktop hoặc dockerd, vì tiến trình nền đang giữ một tham chiếu cũ trong bộ nhớ',
              'Add --force to docker volume rm, which detaches the volume from whatever process still holds it|||Thêm --force cho docker volume rm, nó sẽ tách volume khỏi tiến trình nào còn đang giữ',
              'A stopped container still references it; find it with docker ps -a --filter volume=pgdata, then decide|||Một container ĐÃ DỪNG vẫn tham chiếu tới nó; tìm bằng docker ps -a --filter volume=pgdata, rồi mới quyết',
              'The volume is corrupt; run docker volume prune -a to clear the bad entry and recreate it|||Volume bị hỏng; chạy docker volume prune -a để xoá mục hỏng rồi tạo lại',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: docker ps shows only running containers. A stopped container holds a volume just as firmly; the ID in brackets is that container, and --filter volume= turns it into a name. Restarting the daemon changes nothing, --force does not detach volumes, and prune -a could delete other volumes you meant to keep.|||VI: docker ps chỉ hiện container đang chạy. Container đã dừng giữ volume chặt y như vậy; cái ID trong ngoặc là container đó, và --filter volume= đổi nó thành tên. Khởi động lại tiến trình nền không đổi gì, --force không tách volume, và prune -a có thể xoá mất những volume khác bạn muốn giữ.',
          },
          {
            question: 'Your compose file has `- .:/app` and `- /app/node_modules`. After adding dayjs to package.json you run `docker compose up -d --build`; the logs say "Cannot find module dayjs". What fixes it?|||File compose có `- .:/app` và `- /app/node_modules`. Sau khi thêm dayjs vào package.json bạn chạy `docker compose up -d --build`; log báo "Cannot find module dayjs". Cách nào chữa được?',
            options: [
              'Delete the empty node_modules folder on the host, because it shadows the one inside the image|||Xoá thư mục node_modules rỗng trên máy, vì nó che mất bản trong ảnh',
              'Run docker compose up -d --build -V so the anonymous volume is recreated and filled from the new image|||Chạy docker compose up -d --build -V để volume vô danh được tạo lại và chép từ ảnh mới',
              'Replace the line with - ./node_modules:/app/node_modules so the host’s packages are used|||Thay dòng đó bằng - ./node_modules:/app/node_modules để dùng các gói của máy chủ',
              'Add read_only: true to the service so Docker cannot keep an outdated copy of the dependencies|||Thêm read_only: true cho dịch vụ để Docker không giữ được bản thư viện cũ',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Compose reuses the anonymous volume from the previous container, and that volume was populated from the previous image — without dayjs (measured in Lesson 7.3). -V (--renew-anon-volumes) makes a fresh one from the new image. The empty host folder is only the mount point, binding host packages brings macOS/Windows builds into Linux, and read_only has nothing to do with it.|||VI: Compose dùng lại volume vô danh của container trước, mà volume đó được chép từ ảnh trước — chưa có dayjs (đã đo ở Bài 7.3). -V (--renew-anon-volumes) tạo một cái mới từ ảnh mới. Thư mục rỗng trên máy chỉ là điểm gắn, bind gói của máy chủ là đưa bản dựng cho macOS/Windows vào Linux, và read_only chẳng liên quan.',
          },
          {
            question: 'nginx runs with `-v ./nginx.conf:/etc/nginx/nginx.conf:ro`. The deploy script writes the new config with `mv new.conf nginx.conf`, then `nginx -t` and `nginx -s reload` both succeed — but the site behaves exactly as before. Why?|||nginx chạy với `-v ./nginx.conf:/etc/nginx/nginx.conf:ro`. Script deploy ghi cấu hình mới bằng `mv new.conf nginx.conf`, rồi `nginx -t` và `nginx -s reload` đều thành công — nhưng trang web y như cũ. Vì sao?',
            options: [
              'A single-file bind mount is attached to the file’s inode at start; mv makes a new inode, so the container still reads the old file|||Bind mount một file đơn gắn vào inode của file lúc khởi động; mv tạo inode mới, nên container vẫn đọc file cũ',
              'nginx keeps a compiled copy of its configuration and only rereads the file after the container restarts|||nginx giữ một bản cấu hình đã biên dịch và chỉ đọc lại file sau khi container được restart',
              'The :ro option freezes a snapshot of the file at container start, so host changes stay invisible until restart|||Tuỳ chọn :ro đóng băng một bản chụp của file lúc container khởi động, nên thay đổi trên máy vô hình tới khi restart',
              'nginx -s reload only reopens log files; applying new server blocks needs a full nginx restart|||nginx -s reload chỉ mở lại file log; muốn áp dụng khối server mới phải khởi động lại nginx hoàn toàn',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured in Lesson 7.3: after sed -i or mv the host name points to a new inode, the container keeps the old one, and nginx -t / reload happily use the old config. :ro only forbids writes — an in-place overwrite (cat new > file) is visible even with :ro. Reload does reread the config. Mount the folder, or overwrite in place and compare sha256 inside and outside.|||VI: Đã đo ở Bài 7.3: sau sed -i hay mv, tên trên máy trỏ tới inode mới, container giữ inode cũ, và nginx -t / reload vui vẻ dùng cấu hình cũ. :ro chỉ cấm ghi — ghi đè tại chỗ (cat new > file) vẫn thấy được kể cả khi có :ro. Reload có đọc lại cấu hình. Hãy gắn thư mục, hoặc ghi đè tại chỗ rồi so sha256 bên trong và bên ngoài.',
          },
          {
            question: 'A teammate on Windows keeps the project in C:\\Users\\an\\do-an and runs compose from WSL via /mnt/c/Users/an/do-an. Hot reload never fires and npm install is very slow. Best fix?|||Một bạn dùng Windows để dự án ở C:\\Users\\an\\do-an và chạy compose từ WSL qua /mnt/c/Users/an/do-an. Tự nạp lại không bao giờ chạy và npm install rất chậm. Cách chữa tốt nhất?',
            options: [
              'Switch Docker Desktop’s file sharing back to gRPC-FUSE, which forwards Windows file events more reliably|||Chuyển cơ chế chia sẻ file của Docker Desktop về gRPC-FUSE, nó chuyển sự kiện file của Windows ổn định hơn',
              'Add :z to the bind mount so the Linux VM relabels the Windows files and allows file watching|||Thêm :z vào bind mount để máy ảo Linux gán lại nhãn cho file Windows và cho phép theo dõi file',
              'Run the container as root with -u 0 so it has permission to receive change notifications|||Chạy container bằng root với -u 0 để nó có quyền nhận thông báo thay đổi file',
              'Clone the project inside the WSL2 filesystem (~/do-an) and run compose from there|||Clone dự án vào bên trong hệ thống file WSL2 (~/do-an) và chạy compose từ đó',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Docker’s WSL best-practices page: containers only receive inotify events when the files are in the Linux filesystem, and bind mounts from there are much faster than from /mnt/c. gRPC-FUSE is a macOS option, :z is for SELinux, and root has nothing to do with file events.|||VI: Trang hướng dẫn WSL của Docker: container chỉ nhận sự kiện inotify khi file nằm trong hệ thống file Linux, và bind mount từ đó nhanh hơn nhiều so với từ /mnt/c. gRPC-FUSE là tuỳ chọn của macOS, :z dành cho SELinux, và root chẳng liên quan gì tới sự kiện file.',
          },
          {
            question: 'The API runs with `--memory 256m --tmpfs /tmp`. While processing a large upload it writes a 300 MB temp file; the container dies and `docker inspect` shows OOMKilled=true. What explains it?|||API chạy với `--memory 256m --tmpfs /tmp`. Khi xử lý một file tải lên lớn, nó ghi một file tạm 300 MB; container chết và `docker inspect` báo OOMKilled=true. Điều gì giải thích chuyện này?',
            options: [
              'A tmpfs defaults to 64 MB, so the write failed with ENOSPC and Docker reports every write error as an OOM kill|||tmpfs mặc định 64 MB, nên lệnh ghi lỗi ENOSPC và Docker báo mọi lỗi ghi thành một cú giết OOM',
              'Files written to /tmp go to the writable layer on disk, and disk usage is counted in the memory limit|||File ghi vào /tmp đi xuống tầng ghi trên đĩa, và dung lượng đĩa được tính vào trần bộ nhớ',
              'tmpfs data is the container’s memory; with no size= it may grow past 256m, so the kernel OOM-kills a process|||Dữ liệu tmpfs là bộ nhớ của container; không có size= nó phình quá 256m, nên nhân giết một tiến trình vì OOM',
              '/dev/shm is only 64 MB by default, and large temporary files are always staged there before /tmp|||/dev/shm mặc định chỉ 64 MB, và file tạm lớn luôn được đặt tạm ở đó trước khi vào /tmp',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Measured in Lesson 7.4: an uncapped tmpfs showed 3.9G (half the host’s RAM), and 125.6M written under --memory 128m ended in exit 137 with OOMKilled=true. Set size= below the memory limit (e.g. size=64m) and the same write fails with "No space left on device" while the app survives. 64 MB is the default of /dev/shm, not of --tmpfs.|||VI: Đã đo ở Bài 7.4: tmpfs không trần báo 3,9G (nửa RAM máy), và 125,6M ghi dưới --memory 128m kết thúc bằng exit 137 với OOMKilled=true. Đặt size= thấp hơn trần bộ nhớ (vd size=64m) thì cùng lệnh ghi đó báo "No space left on device" còn ứng dụng sống. 64 MB là mặc định của /dev/shm, không phải của --tmpfs.',
          },
          {
            question: 'To keep a JWT key off the disk you start the API with `--tmpfs /run/secrets` and run `docker cp jwt.key api:/run/secrets/jwt.key` (exit 0). The app says the file does not exist, and an audit finds the key on the server’s disk. Why?|||Để khoá JWT không nằm trên đĩa, bạn chạy API với `--tmpfs /run/secrets` rồi `docker cp jwt.key api:/run/secrets/jwt.key` (exit 0). Ứng dụng báo file không tồn tại, và một đợt kiểm tra thấy khoá nằm trên đĩa máy chủ. Vì sao?',
            options: [
              'The tmpfs was created with mode 0700, so the non-root app user cannot see the file that was copied|||tmpfs được tạo với mode 0700, nên người dùng không phải root của ứng dụng không thấy file vừa chép',
              'docker cp cannot write into a tmpfs; it wrote into the writable layer under the mount — pipe it through docker exec -i instead|||docker cp không ghi được vào tmpfs; nó ghi vào tầng ghi nằm DƯỚI phép gắn — hãy đổ qua docker exec -i thay vào đó',
              'docker cp only works on stopped containers; on a running one it stages the file in a temporary area on disk|||docker cp chỉ chạy với container đã dừng; với container đang chạy nó đặt file tạm ở một vùng trên đĩa',
              'Every docker cp into a container clears its tmpfs mounts, so the key was erased right after being copied|||Mỗi lần docker cp vào container sẽ dọn sạch các tmpfs, nên khoá bị xoá ngay sau khi chép',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Reproduced on Mac and Linux in Lesson 7.4: the tmpfs stayed empty and docker diff showed "A /run/secrets/jwt.key" in the writable layer; the docker cp reference lists tmpfs as a case it cannot copy to. docker exec -i api sh -c "cat > /run/secrets/jwt.key" < jwt.key writes through the process into RAM. Mode 0700 would not hide the file from root, and docker cp works on running containers.|||VI: Đã dựng lại trên Mac và Linux ở Bài 7.4: tmpfs vẫn trống và docker diff báo "A /run/secrets/jwt.key" ở tầng ghi; tài liệu docker cp liệt kê tmpfs là trường hợp nó không chép vào được. docker exec -i api sh -c "cat > /run/secrets/jwt.key" < jwt.key ghi qua tiến trình vào RAM. Mode 0700 không giấu file khỏi root, và docker cp vẫn chạy với container đang chạy.',
          },
          {
            question: 'For months a cron job ran `docker exec -t db pg_dump -U app -Fc appdb > db.dump`. The files have plausible sizes, but the first real restore fails: "pg_restore: error: could not read from input file". What is the cause?|||Nhiều tháng liền một việc cron chạy `docker exec -t db pg_dump -U app -Fc appdb > db.dump`. File có kích thước nghe hợp lý, nhưng lần khôi phục thật đầu tiên thất bại: "pg_restore: error: could not read from input file". Nguyên nhân là gì?',
            options: [
              '-t gives pg_dump a pseudo-terminal, which turns \\n into \\r\\n and corrupts the binary archive; drop -t and test restores|||-t cấp cho pg_dump một terminal ảo, biến \\n thành \\r\\n và làm hỏng file nén nhị phân; bỏ -t và khôi phục thử định kỳ',
              'A custom-format dump can only be restored by exactly the same pg_restore version that created it|||File dump định dạng custom chỉ khôi phục được bằng đúng phiên bản pg_restore đã tạo ra nó',
              'The dump was taken while the database was running, so it is a torn snapshot of files in motion|||Bản dump được lấy khi CSDL đang chạy, nên nó là một ảnh chụp rách của các file đang thay đổi',
              'Custom-format dumps are gzip files and must be decompressed with gunzip before pg_restore reads them|||File dump custom là file gzip và phải giải nén bằng gunzip trước khi pg_restore đọc được',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured in Lesson 7.5: the -t file was 20,700 bytes longer and pg_restore -l failed, while the plain docker exec dump restored 500,000 rows. Torn snapshots are a problem of copying data FILES; pg_dump takes a consistent transactional snapshot of a live database. Newer pg_restore versions read older dumps, and -Fc is not a gzip file.|||VI: Đã đo ở Bài 7.5: file có -t dài hơn 20 700 byte và pg_restore -l thất bại, còn bản dump bằng docker exec không cờ khôi phục đủ 500 000 dòng. Ảnh chụp rách là vấn đề của việc chép FILE dữ liệu; pg_dump lấy một ảnh chụp nhất quán theo giao dịch từ CSDL đang chạy. pg_restore bản mới đọc được dump cũ, và -Fc không phải file gzip.',
          },
        ],
      },
    },
  ],
};
