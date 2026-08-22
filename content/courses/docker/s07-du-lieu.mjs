/**
 * Docker — Chương 7: dữ liệu (volume, bind mount, tmpfs).
 * Vì sao container quên · volume · bind mount · tmpfs & chỉ đọc · sao lưu/khôi phục · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 7 — Data: volumes, bind mounts, tmpfs|||Chương 7 — Dữ liệu: volume, bind mount, tmpfs',
  description: 'Container quên mọi thứ khi bị xoá — trừ những gì bạn cố ý đặt ra ngoài. Ba cách gắn dữ liệu vào container, cách chọn đúng cái, cái bẫy node_modules và bẫy quyền UID, và cách sao lưu một volume Postgres mà không mất dữ liệu.',
  lessons: [
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
<pre><code>docker run --name forgetful -d alpine:3.20 sleep 300
docker exec forgetful sh -c 'echo "important" &gt; /data.txt; cat /data.txt'
docker rm -f forgetful &gt;/dev/null
docker run --rm alpine:3.20 cat /data.txt</code></pre>
<div class="out">important
cat: can't open '/data.txt': No such file or directory</div>
<p>Nothing was lost by accident. The file lived in the writable layer of a container that no longer exists; a new container from the same image starts from the same clean image layers. If you want a file to outlive the container, it must not live inside the container.</p>

<h3>The three mount types</h3>
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

<h3>Named, anonymous, and the difference that matters</h3>
<pre><code>docker volume create app-uploads
docker run -d --name a1 -v app-uploads:/uploads alpine:3.20 sleep 60   <span class="tok-comment"># named</span>
docker run -d --name a2 -v /uploads alpine:3.20 sleep 60               <span class="tok-comment"># anonymous</span>
docker volume ls</code></pre>
<div class="out">DRIVER    VOLUME NAME
local     app-uploads
local     8c1d4e9f2a7b3c6d5e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d</div>
<p>Both persist. Only one is findable six months later. An anonymous volume is created when a <code>VOLUME</code> instruction in a Dockerfile or a bare <code>-v /path</code> has nowhere to attach — it keeps your data safe and then hides it behind a 64-character name that means nothing. This is how people end up with 40GB of volumes they are afraid to delete. <strong>Name every volume you intend to keep</strong>, and prune the rest deliberately.</p>

<h3>What happens when you mount over an existing directory</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Empty volume over a populated image directory</span><span class="lz-t">the image's files are COPIED into the volume, once</span><span class="lz-d">First run only, and only for volumes — this is why a fresh <code>postgres</code> container initialises its data directory correctly, and why the initialisation never happens again on later runs.</span></div>
  <div class="lz-step"><span class="lz-k">Non-empty volume over an image directory</span><span class="lz-t">the volume wins; the image's files are hidden</span><span class="lz-d">Not deleted — still in the image layer, just shadowed by the mount. Restarting without the mount reveals them again, unchanged.</span></div>
  <div class="lz-step"><span class="lz-k">Bind mount over an image directory</span><span class="lz-t">the host wins, always, even if the host directory is empty</span><span class="lz-d">No copying, ever. This is the single most common source of "it worked in the image and broke when I mounted it" — see the node_modules trap in Lesson 7.3.</span></div>
</div>
<pre><code><span class="tok-comment"># Prove the copy-on-first-use behaviour</span>
docker run --rm -v demo-etc:/etc/nginx nginx:alpine ls /etc/nginx | head -4
docker run --rm -v demo-etc:/mnt alpine:3.20 ls /mnt | head -4</code></pre>
<div class="out">conf.d
fastcgi_params
mime.types
nginx.conf
conf.d
fastcgi_params
mime.types
nginx.conf</div>
<p>The nginx image's config landed in the volume on first use, and a completely different container can now read it. Useful, and occasionally surprising: if you later fix a config file inside the image, the volume still holds the old copy, and the new image's version never appears. A volume that shadows configuration is a trap; volumes are for data.</p>

<h3>Choosing, in one table</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Database files</span><span class="v"><strong>Volume.</strong> Docker manages permissions and the filesystem is one Docker knows works. A bind-mounted Postgres data directory on macOS or Windows is a well-known source of corruption and terrible performance.</span></div>
  <div class="kv"><span class="k">Your source code in dev</span><span class="v"><strong>Bind mount.</strong> The whole point is that editing on the host changes what the container sees, instantly.</span></div>
  <div class="kv"><span class="k">A config file</span><span class="v"><strong>Bind mount, read-only</strong> (<code>:ro</code>). Or bake it into the image. Never a volume — you want the image's copy to win when you update it.</span></div>
  <div class="kv"><span class="k">Uploads, generated media</span><span class="v"><strong>Volume</strong> in production, or object storage (R2/S3) if more than one machine will ever serve them.</span></div>
  <div class="kv"><span class="k">Scratch, temp, secrets in flight</span><span class="v"><strong>tmpfs.</strong> Fast, and it cannot leak onto a disk that outlives the container.</span></div>
  <div class="kv"><span class="k">The Docker socket</span><span class="v"><strong>Bind mount</strong> — <code>/var/run/docker.sock</code>. And understand exactly what you are granting: it is root on the host (Lesson 6.4).</span></div>
</div>

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

<div class="pitfall"><strong>Pitfall:</strong> assuming <code>docker rm</code> removes the container's data. It removes the writable layer, and it removes <em>anonymous</em> volumes only if you pass <code>-v</code>. Named volumes survive <code>docker rm</code>, <code>docker compose down</code>, and a full <code>docker system prune</code> — you have to ask for <code>docker volume prune</code>, or <code>docker compose down -v</code>, specifically. That asymmetry saves you far more often than it hurts, but it means "I removed everything and the old data came back" is a normal Tuesday, and it also means an unused volume can quietly hold 40GB for a year. Check with <code>docker system df -v</code> before assuming your disk problem is images.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The writable layer dies with the container, always — anything you want to keep goes into a volume, a bind mount or object storage, deliberately. An empty <em>volume</em> mounted over a populated image directory gets the image's files copied in once; a <em>bind mount</em> never does, and hides whatever was there. And name your volumes: an anonymous volume protects your data and then makes it impossible to find on purpose.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Vì sao container quên, và ba cách chữa</h2>
<p class="lead">Bạn đã gặp lớp ghi được ở Bài 1.4: mỗi container có một lớp đọc-ghi mỏng nằm trên cùng cái ảnh, và lớp đó chết theo container. Đó là mặc định đúng — chính nó khiến container trở thành thứ dùng xong vứt được. Nhưng một cơ sở dữ liệu thì không vứt được, file người dùng tải lên cũng vậy. Chương này nói về những cái lỗ bạn cố ý khoét vào mô hình đó.</p>

<h3>Nhìn một container quên</h3>
<pre><code>docker run --name forgetful -d alpine:3.20 sleep 300
docker exec forgetful sh -c 'echo "important" &gt; /data.txt; cat /data.txt'
docker rm -f forgetful &gt;/dev/null
docker run --rm alpine:3.20 cat /data.txt</code></pre>
<div class="out">important
cat: can't open '/data.txt': No such file or directory</div>
<p>Không có gì mất do sơ suất cả. File nằm trong lớp ghi được của một container không còn tồn tại; một container mới từ cùng cái ảnh khởi động lại từ đúng những lớp ảnh sạch đó. Muốn một file sống lâu hơn container thì nó không được nằm bên trong container.</p>

<h3>Ba kiểu gắn dữ liệu</h3>
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

<h3>Có tên, vô danh, và khác biệt thật sự quan trọng</h3>
<pre><code>docker volume create app-uploads
docker run -d --name a1 -v app-uploads:/uploads alpine:3.20 sleep 60   <span class="tok-comment"># có tên</span>
docker run -d --name a2 -v /uploads alpine:3.20 sleep 60               <span class="tok-comment"># vô danh</span>
docker volume ls</code></pre>
<div class="out">DRIVER    VOLUME NAME
local     app-uploads
local     8c1d4e9f2a7b3c6d5e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d</div>
<p>Cả hai đều tồn tại lâu dài. Chỉ một cái tìm lại được sau sáu tháng. Volume vô danh được tạo ra khi một chỉ thị <code>VOLUME</code> trong Dockerfile hoặc một <code>-v /path</code> trơ trọi không có chỗ nào để gắn vào — nó giữ dữ liệu của bạn an toàn rồi giấu sau một cái tên 64 ký tự chẳng nói lên gì. Đây là cách người ta ôm 40GB volume mà không dám xoá. <strong>Hãy đặt tên cho mọi volume bạn định giữ</strong>, và dọn phần còn lại một cách có chủ đích.</p>

<h3>Chuyện gì xảy ra khi bạn gắn đè lên một thư mục đã có</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Volume RỖNG đè lên thư mục có sẵn trong ảnh</span><span class="lz-t">file của ảnh được CHÉP vào volume, đúng một lần</span><span class="lz-d">Chỉ ở lần chạy đầu, và chỉ với volume — đây là lý do một container <code>postgres</code> mới tinh khởi tạo thư mục dữ liệu đúng cách, và cũng là lý do lần khởi tạo đó không bao giờ xảy ra lại ở những lần chạy sau.</span></div>
  <div class="lz-step"><span class="lz-k">Volume KHÔNG rỗng đè lên thư mục của ảnh</span><span class="lz-t">volume thắng; file của ảnh bị che</span><span class="lz-d">Không bị xoá — vẫn nằm trong lớp ảnh, chỉ bị phép gắn che khuất. Khởi động lại mà không gắn thì chúng hiện ra nguyên vẹn.</span></div>
  <div class="lz-step"><span class="lz-k">Bind mount đè lên thư mục của ảnh</span><span class="lz-t">phía máy chủ thắng, luôn luôn, kể cả khi thư mục đó rỗng</span><span class="lz-d">Không bao giờ có chuyện chép. Đây là nguồn gốc phổ biến nhất của câu "trong ảnh chạy được, gắn vào là hỏng" — xem bẫy node_modules ở Bài 7.3.</span></div>
</div>
<pre><code><span class="tok-comment"># Chứng minh hành vi chép-ở-lần-dùng-đầu</span>
docker run --rm -v demo-etc:/etc/nginx nginx:alpine ls /etc/nginx | head -4
docker run --rm -v demo-etc:/mnt alpine:3.20 ls /mnt | head -4</code></pre>
<div class="out">conf.d
fastcgi_params
mime.types
nginx.conf
conf.d
fastcgi_params
mime.types
nginx.conf</div>
<p>Cấu hình của ảnh nginx đã rơi vào volume ở lần dùng đầu, và giờ một container hoàn toàn khác đọc được nó. Tiện, và thỉnh thoảng gây bất ngờ: nếu sau này bạn sửa một file cấu hình bên trong ảnh, volume vẫn giữ bản cũ, và bản mới của ảnh không bao giờ xuất hiện. Một volume che khuất cấu hình là một cái bẫy; volume là để chứa DỮ LIỆU.</p>

<h3>Chọn thế nào, gói trong một bảng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">File cơ sở dữ liệu</span><span class="v"><strong>Volume.</strong> Docker quản quyền và hệ thống file là thứ Docker biết chắc chạy được. Một thư mục dữ liệu Postgres bind-mount trên macOS hay Windows là nguồn hỏng dữ liệu và chậm kinh khủng ai cũng biết.</span></div>
  <div class="kv"><span class="k">Mã nguồn lúc phát triển</span><span class="v"><strong>Bind mount.</strong> Toàn bộ mục đích là sửa trên máy chủ thì container thấy đổi ngay lập tức.</span></div>
  <div class="kv"><span class="k">Một file cấu hình</span><span class="v"><strong>Bind mount, chỉ đọc</strong> (<code>:ro</code>). Hoặc nướng thẳng vào ảnh. Đừng bao giờ dùng volume — bạn muốn bản trong ảnh thắng khi bạn cập nhật nó.</span></div>
  <div class="kv"><span class="k">File tải lên, media sinh ra</span><span class="v"><strong>Volume</strong> trên production, hoặc lưu trữ đối tượng (R2/S3) nếu sẽ có nhiều hơn một máy phục vụ chúng.</span></div>
  <div class="kv"><span class="k">Chỗ nháp, tạm, bí mật đang luân chuyển</span><span class="v"><strong>tmpfs.</strong> Nhanh, và nó không thể rò ra một cái đĩa sống lâu hơn container.</span></div>
  <div class="kv"><span class="k">Socket Docker</span><span class="v"><strong>Bind mount</strong> — <code>/var/run/docker.sock</code>. Và hiểu rõ bạn đang trao cái gì: đó là quyền root trên máy chủ (Bài 6.4).</span></div>
</div>

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

<div class="pitfall"><strong>Bẫy:</strong> tưởng <code>docker rm</code> xoá luôn dữ liệu của container. Nó xoá lớp ghi được, và nó chỉ xoá volume <em>vô danh</em> nếu bạn truyền thêm <code>-v</code>. Volume CÓ TÊN sống sót qua <code>docker rm</code>, qua <code>docker compose down</code>, và qua cả một lượt <code>docker system prune</code> đầy đủ — bạn phải gọi đích danh <code>docker volume prune</code>, hoặc <code>docker compose down -v</code>. Sự bất đối xứng đó cứu bạn nhiều hơn hại bạn rất nhiều, nhưng nó cũng khiến câu "tôi xoá sạch rồi mà dữ liệu cũ vẫn quay lại" là chuyện thứ Ba bình thường, và nó cũng có nghĩa là một volume không ai dùng có thể lặng lẽ ôm 40GB suốt một năm. Kiểm bằng <code>docker system df -v</code> trước khi kết luận vấn đề đĩa của bạn nằm ở ảnh.</div>
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

<h3>Labels are how you stay sane at 40 volumes</h3>
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

<h3>Which volume is eating the disk</h3>
<pre><code>docker system df -v 2&gt;/dev/null | sed -n '/Local Volumes space usage/,+6p'</code></pre>
<div class="out">Local Volumes space usage:

VOLUME NAME                                          LINKS     SIZE
pg-data                                              1         3.107GB
blog-uploads                                         1         812.4MB
8c1d4e9f2a7b3c6d5e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c…  0         7.663GB
node-modules                                         1         241.9MB</div>
<div class="callout warn"><strong>That third line is the one to look at.</strong> 7.6GB, zero links, a name nobody can recognise. This is exactly the shape of the disk-full incident recorded in this project's own history — a build cache that grew onto the same disk as Postgres until a deploy died with <code>no space left on device</code>. An anonymous volume with 0 links is the same failure waiting to happen. <code>docker system df -v</code> is the first command to run whenever a server's disk is mysteriously full; <code>docker volume prune</code> removes what has no links, and asks first.</div>

<h3>Sharing one volume between containers</h3>
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

<h3>The local driver does more than local</h3>
<pre><code><span class="tok-comment"># An NFS share, as a volume, using only the built-in local driver</span>
docker volume create --driver local \\
  --opt type=nfs \\
  --opt o=addr=10.0.0.7,rw,nfsvers=4 \\
  --opt device=:/exports/media  media-nfs

<span class="tok-comment"># A size-capped volume, backed by a loop file (Linux only)</span>
docker volume inspect -f '{{ json .Options }}' media-nfs</code></pre>
<div class="out">{"device":":/exports/media","o":"addr=10.0.0.7,rw,nfsvers=4","type":"nfs"}</div>
<p>The <code>local</code> driver passes its options straight to <code>mount(8)</code>, which means anything the host kernel can mount can be a volume: NFS, CIFS, a bind to another path, a loop-mounted image. That covers most of what people install third-party volume plugins for. For a single VPS, plain local volumes plus a backup job is the right amount of machinery.</p>

<h3>Removing volumes, safely</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">docker volume rm &lt;name&gt;</span><span class="lz-t">refuses while a container still references it</span><span class="lz-d">Including stopped containers. <code>docker ps -a --filter volume=&lt;name&gt;</code> tells you who is holding it.</span></div>
  <div class="lz-step"><span class="lz-k">docker volume prune</span><span class="lz-t">removes volumes with no links, after confirmation</span><span class="lz-d">Add <code>--filter label!=keep</code> or <code>--all</code> deliberately. This is a real delete with no undo — read the list it prints before typing y.</span></div>
  <div class="lz-step"><span class="lz-k">docker rm -v &lt;container&gt;</span><span class="lz-t">also removes that container's ANONYMOUS volumes</span><span class="lz-d">Named volumes are untouched. This is the flag people forget, which is why anonymous volumes accumulate.</span></div>
  <div class="lz-step"><span class="lz-k">docker compose down -v</span><span class="lz-t">removes volumes declared in that compose file</span><span class="lz-d">Project-scoped, so it will not touch your other stacks. Still: this is the command that deletes a development database, and the flag is one character.</span></div>
</div>

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

<div class="pitfall"><strong>Pitfall:</strong> reading <code>dangling=true</code> as "safe to delete". It means no <em>running or existing</em> container references the volume right now. Recreate a container from a compose file and the volume is instantly in use again with all your data — that is the normal upgrade path, not an accident. The volumes that are genuinely garbage have three properties together: no links, an anonymous 64-hex name, and a creation date you can trace to an experiment. Before pruning on a server with real data, run <code>docker volume ls --filter dangling=true</code>, read the list, and confirm each name. A prune that removes a named volume you were about to reattach is not recoverable, and Docker's confirmation prompt shows you a count, not the names.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A volume is just a managed directory — <code>docker volume inspect -f '{{ .Mountpoint }}'</code> tells you exactly which one, which makes backups and diagnostics ordinary work. Label your volumes so <code>ls --filter</code> answers "what belongs to this app" six months later. And <code>docker system df -v</code> before you blame images for a full disk: an anonymous volume with zero links is a very common several-gigabyte surprise.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Volume, đào sâu</h2>
<p class="lead">Một volume là một thư mục trên máy chủ do Docker quản hộ bạn, cộng thêm một cái tên và ít siêu dữ liệu. Nó thật sự chỉ có thế — và biết chính xác nó nằm ở đâu cùng với việc <code>inspect</code> nói gì sẽ biến "dữ liệu nằm đâu đó trong Docker" thành một thư mục bình thường mà bạn sao lưu, chép và suy luận được.</p>

<h3>Tạo, xem, tìm trên đĩa</h3>
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

<h3>Nhãn là cách bạn còn tỉnh táo khi có 40 volume</h3>
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

<h3>Volume nào đang ăn hết đĩa</h3>
<pre><code>docker system df -v 2&gt;/dev/null | sed -n '/Local Volumes space usage/,+6p'</code></pre>
<div class="out">Local Volumes space usage:

VOLUME NAME                                          LINKS     SIZE
pg-data                                              1         3.107GB
blog-uploads                                         1         812.4MB
8c1d4e9f2a7b3c6d5e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c…  0         7.663GB
node-modules                                         1         241.9MB</div>
<div class="callout warn"><strong>Dòng thứ ba mới là dòng cần nhìn.</strong> 7,6GB, không link nào, một cái tên không ai nhận ra. Đây đúng hình dạng của sự cố hết đĩa ghi trong lịch sử chính dự án này — một cache dựng phình ra trên đúng cái đĩa chứa Postgres cho tới khi một lượt deploy chết với <code>no space left on device</code>. Một volume vô danh với 0 link là đúng thất bại đó đang chờ xảy ra. <code>docker system df -v</code> là lệnh đầu tiên phải chạy mỗi khi đĩa của một máy chủ đầy một cách khó hiểu; <code>docker volume prune</code> xoá những cái không có link, và có hỏi trước.</div>

<h3>Chia sẻ một volume giữa nhiều container</h3>
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

<h3>Xoá volume, an toàn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">docker volume rm &lt;tên&gt;</span><span class="lz-t">từ chối khi còn container tham chiếu tới nó</span><span class="lz-d">Kể cả container đã dừng. <code>docker ps -a --filter volume=&lt;tên&gt;</code> cho bạn biết ai đang giữ.</span></div>
  <div class="lz-step"><span class="lz-k">docker volume prune</span><span class="lz-t">xoá volume không có link, sau khi xác nhận</span><span class="lz-d">Thêm <code>--filter label!=keep</code> hoặc <code>--all</code> một cách có chủ đích. Đây là xoá thật và không hoàn tác được — hãy đọc danh sách nó in ra trước khi gõ y.</span></div>
  <div class="lz-step"><span class="lz-k">docker rm -v &lt;container&gt;</span><span class="lz-t">xoá luôn các volume VÔ DANH của container đó</span><span class="lz-d">Volume có tên không bị đụng tới. Đây là cái cờ người ta hay quên, và đó là lý do volume vô danh cứ tích lại.</span></div>
  <div class="lz-step"><span class="lz-k">docker compose down -v</span><span class="lz-t">xoá các volume khai trong file compose đó</span><span class="lz-d">Giới hạn trong phạm vi dự án, nên nó không đụng tới các stack khác của bạn. Dù vậy: đây chính là lệnh xoá một cơ sở dữ liệu phát triển, và cái cờ chỉ dài một ký tự.</span></div>
</div>

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

<div class="pitfall"><strong>Bẫy:</strong> đọc <code>dangling=true</code> thành "xoá được rồi". Nó chỉ có nghĩa là hiện không có container nào <em>đang chạy hoặc đang tồn tại</em> tham chiếu tới volume đó. Dựng lại container từ một file compose là volume lập tức được dùng lại với đủ dữ liệu của bạn — đó là đường nâng cấp bình thường, không phải tai nạn. Những volume thật sự là rác có đủ ba tính chất cùng lúc: không link, một cái tên vô danh 64 ký tự hex, và một ngày tạo mà bạn truy được về một lần thử nghiệm. Trước khi prune trên một máy chủ có dữ liệu thật, hãy chạy <code>docker volume ls --filter dangling=true</code>, đọc danh sách, và xác nhận từng cái tên. Một lượt prune xoá mất volume có tên mà bạn sắp gắn lại thì không cứu được, và hộp xác nhận của Docker chỉ cho bạn xem một con SỐ, không phải các cái tên.</div>
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

<h3>Trap 3 — SELinux says permission denied on a correct mount</h3>
<pre><code><span class="tok-comment"># On Fedora/RHEL/CentOS with SELinux enforcing</span>
docker run --rm -v "$PWD/conf:/etc/app" alpine:3.20 cat /etc/app/app.conf</code></pre>
<div class="out">cat: can't open '/etc/app/app.conf': Permission denied</div>
<pre><code><span class="tok-comment"># :z relabels shared (multiple containers), :Z private (this container only)</span>
docker run --rm -v "$PWD/conf:/etc/app:ro,z" alpine:3.20 cat /etc/app/app.conf</code></pre>
<div class="out">listen = 0.0.0.0:8080</div>
<div class="callout warn"><strong><code>:Z</code> relabels the host directory recursively and permanently.</strong> Point it at <code>$HOME</code> or <code>/usr</code> and you will spend an afternoon repairing SELinux labels on files other programs need. Use <code>:z</code> (lowercase, shared) on directories created for the container, and never on a directory that belongs to the system.</div>

<h3>Trap 4 — bind mounts are slow on macOS and Windows</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Linux</span><span class="lz-t">native speed — it is the same filesystem</span><span class="lz-d">A bind mount costs nothing; the kernel is showing the container a directory it already has. No copying, no protocol, no daemon in between.</span></div>
  <div class="lz-step"><span class="lz-k">macOS / Windows</span><span class="lz-t">crosses a VM boundary on every file operation</span><span class="lz-d">Docker Desktop runs a Linux VM; your files are on the host OS. Every stat and read is a round trip. A <code>node_modules</code> with 40,000 files feels it immediately.</span></div>
  <div class="lz-step"><span class="lz-k">Mitigation: VirtioFS</span><span class="lz-t">Docker Desktop → Settings → General</span><span class="lz-d">Several times faster than the older gRPC-FUSE. Enabled by default on recent versions; check it before concluding that Docker is slow.</span></div>
  <div class="lz-step"><span class="lz-k">Mitigation: keep dependencies off the bind</span><span class="lz-t">the anonymous-volume trick from Trap 1</span><span class="lz-d">Doubly worthwhile here: <code>node_modules</code> in a volume lives in the VM's own filesystem, at native speed, while your source stays live-editable.</span></div>
</div>

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

<h3>Bẫy 3 — SELinux báo permission denied trên một phép gắn đúng</h3>
<pre><code><span class="tok-comment"># Trên Fedora/RHEL/CentOS với SELinux ở chế độ enforcing</span>
docker run --rm -v "$PWD/conf:/etc/app" alpine:3.20 cat /etc/app/app.conf</code></pre>
<div class="out">cat: can't open '/etc/app/app.conf': Permission denied</div>
<pre><code><span class="tok-comment"># :z gán nhãn dùng chung (nhiều container), :Z riêng cho container này</span>
docker run --rm -v "$PWD/conf:/etc/app:ro,z" alpine:3.20 cat /etc/app/app.conf</code></pre>
<div class="out">listen = 0.0.0.0:8080</div>
<div class="callout warn"><strong><code>:Z</code> gán lại nhãn cho thư mục máy chủ theo cách đệ quy và vĩnh viễn.</strong> Trỏ nó vào <code>$HOME</code> hay <code>/usr</code> là bạn mất cả buổi chiều đi sửa lại nhãn SELinux cho những file chương trình khác cần. Hãy dùng <code>:z</code> (chữ thường, dùng chung) trên thư mục tạo riêng cho container, và đừng bao giờ dùng trên thư mục thuộc về hệ thống.</div>

<h3>Bẫy 4 — bind mount chậm trên macOS và Windows</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Linux</span><span class="lz-t">tốc độ gốc — vẫn là cùng một hệ thống file</span><span class="lz-d">Bind mount không tốn gì; nhân chỉ đang cho container xem một thư mục nó vốn đã có. Không chép, không giao thức, không có tiến trình nền nào chen giữa.</span></div>
  <div class="lz-step"><span class="lz-k">macOS / Windows</span><span class="lz-t">vượt ranh giới máy ảo ở MỌI thao tác file</span><span class="lz-d">Docker Desktop chạy một máy ảo Linux; file của bạn nằm trên hệ điều hành chủ. Mỗi lần stat và read là một vòng đi-về. Một <code>node_modules</code> 40.000 file cảm nhận ngay lập tức.</span></div>
  <div class="lz-step"><span class="lz-k">Giảm nhẹ: VirtioFS</span><span class="lz-t">Docker Desktop → Settings → General</span><span class="lz-d">Nhanh gấp mấy lần gRPC-FUSE đời trước. Bản gần đây bật sẵn; hãy kiểm nó trước khi kết luận Docker chậm.</span></div>
  <div class="lz-step"><span class="lz-k">Giảm nhẹ: giữ gói phụ thuộc ra khỏi bind</span><span class="lz-t">mẹo volume vô danh ở Bẫy 1</span><span class="lz-d">Ở đây đáng gấp đôi: <code>node_modules</code> nằm trong volume tức là nằm trong hệ thống file của chính máy ảo, chạy ở tốc độ gốc, còn mã nguồn của bạn vẫn sửa sống được.</span></div>
</div>

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
  <div class="kv"><span class="k">Gone at stop, not at restart</span><span class="v">Stopping and starting the same container gives a fresh, empty tmpfs. Nothing survives; that is the feature.</span></div>
</div>

<h3>Read-only root plus writable holes</h3>
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

<h3>/dev/shm, the mount you forget until Chrome crashes</h3>
<pre><code>docker run --rm alpine:3.20 df -h /dev/shm
docker run --rm --shm-size=1g alpine:3.20 df -h /dev/shm</code></pre>
<div class="out">Filesystem                Size      Used Available Use% Mounted on
shm                      64.0M         0     64.0M   0% /dev/shm
shm                       1.0G         0      1.0G   0% /dev/shm</div>
<p>Docker gives every container a 64MB <code>/dev/shm</code>. That is fine for most things and far too small for a headless browser — Chromium under Playwright or Puppeteer uses shared memory for renderer processes and dies with a confusing <code>Target closed</code> or a bare tab crash when it runs out. If you run browsers in containers, <code>--shm-size=1g</code> (or <code>shm_size: 1gb</code> in compose) is the fix, and the reason to know about it is that nothing in the error message mentions shared memory.</p>

<h3>Four ways to get a secret into a container, worst to best</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">❌ Baked into the image</span><span class="lz-lnote">An <code>ENV</code> or a copied <code>.env</code> in a layer. Anyone who can pull the image has the secret, forever, in a layer you cannot delete (Lesson 6.1). This is the one that ends up on a public registry.</span></div>
  <div class="lz-layer"><span class="lz-lname">⚠️ <code>-e SECRET=…</code> on the command line</span><span class="lz-lnote">Visible in <code>docker inspect</code>, in <code>ps</code> output on the host, and in your shell history. Workable for development, wrong for production.</span></div>
  <div class="lz-layer"><span class="lz-lname">✅ <code>--env-file</code> from a file the host protects</span><span class="lz-lnote">The values are not on the command line and not in shell history. Still visible in <code>docker inspect</code>. This is what this project uses: <code>/opt/cuonghoangdev/.env</code>, mode 600, loaded at deploy time and excluded from rsync so it survives.</span></div>
  <div class="lz-layer"><span class="lz-lname">✅✅ A file on tmpfs, or a real secrets manager</span><span class="lz-lnote">Mount the secret as a file into a tmpfs path, or use Swarm/Kubernetes secrets, or fetch it at startup from Vault or a cloud secrets manager. It never lands on disk, never appears in <code>inspect</code>, and can be rotated without rebuilding anything.</span></div>
</div>
<pre><code><span class="tok-comment"># The tmpfs-file pattern, without any extra infrastructure</span>
docker run -d --name api \\
  --tmpfs /run/secrets:rw,size=1m,mode=0700 \\
  --env-file /opt/app/.env \\
  api:1.4.2
docker cp /opt/app/jwt.key api:/run/secrets/jwt.key   <span class="tok-comment"># lands in memory only</span>

<span class="tok-comment"># Confirm it is not on any disk the container can persist to</span>
docker exec api sh -c 'df -h /run/secrets | tail -1'</code></pre>
<div class="out">tmpfs                     1.0M      4.0K   1020.0K   0% /run/secrets</div>
<div class="callout warn"><strong>Build-time secrets are a separate problem with a separate answer.</strong> Never pass a token via <code>ARG</code> — it is recorded in the image history and readable with <code>docker history</code>. Use <code>RUN --mount=type=secret,id=npmrc</code> instead (Lesson 6.1): BuildKit mounts the file for that one instruction and it never enters a layer.</div>

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
  <div class="kv"><span class="k">Mất khi dừng, không phải khi khởi động lại</span><span class="v">Dừng rồi khởi động lại đúng container đó cho bạn một tmpfs mới tinh và rỗng. Không gì sống sót; đó chính là tính năng.</span></div>
</div>

<h3>Gốc chỉ đọc cộng những lỗ ghi được</h3>
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

<h3>/dev/shm, phép gắn bạn quên cho tới khi Chrome chết</h3>
<pre><code>docker run --rm alpine:3.20 df -h /dev/shm
docker run --rm --shm-size=1g alpine:3.20 df -h /dev/shm</code></pre>
<div class="out">Filesystem                Size      Used Available Use% Mounted on
shm                      64.0M         0     64.0M   0% /dev/shm
shm                       1.0G         0      1.0G   0% /dev/shm</div>
<p>Docker cho mỗi container một <code>/dev/shm</code> 64MB. Chừng đó ổn với phần lớn thứ và nhỏ quá đáng với một trình duyệt không giao diện — Chromium dưới Playwright hay Puppeteer dùng bộ nhớ chia sẻ cho các tiến trình kết xuất, và nó chết với một dòng <code>Target closed</code> khó hiểu hoặc một cú sập tab trơ trọi khi hết chỗ. Nếu bạn chạy trình duyệt trong container, <code>--shm-size=1g</code> (hoặc <code>shm_size: 1gb</code> trong compose) là cách vá, và lý do phải biết chuyện này là vì trong thông báo lỗi chẳng có chữ nào nhắc tới bộ nhớ chia sẻ.</p>

<h3>Bốn cách đưa bí mật vào container, từ tệ nhất tới tốt nhất</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">❌ Nướng thẳng vào ảnh</span><span class="lz-lnote">Một dòng <code>ENV</code> hoặc một file <code>.env</code> chép vào một lớp. Ai kéo được cái ảnh là có bí mật, vĩnh viễn, nằm trong một lớp bạn không xoá được (Bài 6.1). Đây chính là cái rốt cuộc nằm trên một registry công khai.</span></div>
  <div class="lz-layer"><span class="lz-lname">⚠️ <code>-e SECRET=…</code> trên dòng lệnh</span><span class="lz-lnote">Nhìn thấy được trong <code>docker inspect</code>, trong kết quả <code>ps</code> trên máy chủ, và trong lịch sử shell của bạn. Chấp nhận được lúc phát triển, sai trên production.</span></div>
  <div class="lz-layer"><span class="lz-lname">✅ <code>--env-file</code> từ một file được máy chủ bảo vệ</span><span class="lz-lnote">Giá trị không nằm trên dòng lệnh và không vào lịch sử shell. Vẫn nhìn thấy được trong <code>docker inspect</code>. Đây là thứ chính dự án này dùng: <code>/opt/cuonghoangdev/.env</code>, quyền 600, nạp lúc deploy và bị loại khỏi rsync nên nó sống sót.</span></div>
  <div class="lz-layer"><span class="lz-lname">✅✅ Một file trên tmpfs, hoặc một trình quản bí mật thật</span><span class="lz-lnote">Gắn bí mật dưới dạng file vào một đường dẫn tmpfs, hoặc dùng secret của Swarm/Kubernetes, hoặc lấy về lúc khởi động từ Vault hay một dịch vụ quản bí mật trên đám mây. Nó không bao giờ chạm đĩa, không hiện trong <code>inspect</code>, và xoay vòng được mà không phải dựng lại thứ gì.</span></div>
</div>
<pre><code><span class="tok-comment"># Mẫu file-trên-tmpfs, không cần thêm hạ tầng nào</span>
docker run -d --name api \\
  --tmpfs /run/secrets:rw,size=1m,mode=0700 \\
  --env-file /opt/app/.env \\
  api:1.4.2
docker cp /opt/app/jwt.key api:/run/secrets/jwt.key   <span class="tok-comment"># chỉ rơi vào bộ nhớ</span>

<span class="tok-comment"># Xác nhận nó không nằm trên cái đĩa nào container giữ lại được</span>
docker exec api sh -c 'df -h /run/secrets | tail -1'</code></pre>
<div class="out">tmpfs                     1.0M      4.0K   1020.0K   0% /run/secrets</div>
<div class="callout warn"><strong>Bí mật lúc DỰNG là một bài toán khác với lời giải khác.</strong> Đừng bao giờ truyền token qua <code>ARG</code> — nó được ghi vào lịch sử của ảnh và đọc được bằng <code>docker history</code>. Hãy dùng <code>RUN --mount=type=secret,id=npmrc</code> (Bài 6.1): BuildKit gắn file đó cho đúng một chỉ thị và nó không bao giờ vào một lớp nào.</div>

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

<h3>tar versus pg_dump: they are not the same backup</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tar of a running database</span><span class="v"><strong>Usually corrupt.</strong> You are copying files while the engine is writing them. What you get is the on-disk state at no single point in time — a torn snapshot that may restore, may restore wrong, or may refuse to start.</span></div>
  <div class="kv"><span class="k">tar of a STOPPED database</span><span class="v"><strong>Valid</strong>, and byte-exact. Fast to restore, but it only restores onto the same major version of the engine, and it means downtime for the duration of the copy.</span></div>
  <div class="kv"><span class="k"><code>pg_dump</code> / <code>mysqldump</code></span><span class="v"><strong>Valid on a live database</strong>, because the engine gives you a consistent transactional snapshot. Portable across versions and even across machines with different architectures. Slower to restore on a large database.</span></div>
  <div class="kv"><span class="k">Filesystem snapshot (LVM/ZFS/cloud)</span><span class="v"><strong>Valid and instant</strong>, if the snapshot is atomic and the engine is crash-safe. This is what managed database backups actually do. Requires the storage layer to support it.</span></div>
</div>
<pre><code><span class="tok-comment"># The right way for Postgres — logical dump, from a container, live</span>
docker exec -t cuonghoangdev_postgres \\
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

<h3>A nightly backup that actually runs</h3>
<pre><code><span class="tok-comment"># /opt/backup/nightly.sh — kept deliberately boring</span>
#!/usr/bin/env bash
set -Eeuo pipefail
STAMP=$(date +%F)
DEST=/opt/backup/out
KEEP=14

mkdir -p "$DEST"
docker exec -t cuonghoangdev_postgres \\
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --compress=9 \\
  &gt; "$DEST/db-$STAMP.dump.part"
mv "$DEST/db-$STAMP.dump.part" "$DEST/db-$STAMP.dump"   <span class="tok-comment"># atomic: no half-file is ever named .dump</span>

docker run --rm -v blog-uploads:/from:ro -v "$DEST:/to" alpine:3.20 \\
  tar -C /from -czf "/to/uploads-$STAMP.tgz.part" .
mv "$DEST/uploads-$STAMP.tgz.part" "$DEST/uploads-$STAMP.tgz"

find "$DEST" -name '*.dump' -mtime +$KEEP -delete
find "$DEST" -name '*.tgz'  -mtime +$KEEP -delete
rclone copy "$DEST" r2:backups/cuongthai --max-age 48h   <span class="tok-comment"># off the machine, or it is not a backup</span></code></pre>
<div class="out">2026-08-22 03:00:04 · db-2026-08-22.dump 84M · uploads-2026-08-22.tgz 611M
2026-08-22 03:04:41 · Transferred: 695.412 MiB / 695.412 MiB, 100%, 2.812 MiB/s
2026-08-22 03:04:41 · Checks: 28 / 28, 100% · Transferred: 2 / 2, 100%</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>set -Eeuo pipefail</code></span><span class="v">Without it, a failed <code>pg_dump</code> in a pipeline still exits 0 and you keep a zero-byte file for two weeks. Chapter 7 of the Linux &amp; Bash course covers why each of those four letters matters.</span></div>
  <div class="kv"><span class="k">Write <code>.part</code>, then rename</span><span class="v">A rename on the same filesystem is atomic. An interrupted backup leaves a <code>.part</code> file that the retention rule ignores, instead of a truncated file that looks like a real backup.</span></div>
  <div class="kv"><span class="k">Off the machine</span><span class="v">A backup on the same disk as the database survives <code>rm -rf</code> and nothing else — not a failed disk, not a deleted VPS, not ransomware. R2/S3/B2 with a lifecycle rule is a few cents a month.</span></div>
  <div class="kv"><span class="k">Alert on absence, not on failure</span><span class="v">A cron job that dies silently produces no failure alert. Have the script touch a heartbeat URL on success and alert when the heartbeat stops — healthchecks.io, or a two-line check in your own monitoring.</span></div>
  <div class="kv"><span class="k">Restore on a schedule</span><span class="v">Once a month, restore last night's dump into a scratch database and count a table. Put it in the calendar; it is the only test that matters.</span></div>
</div>

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

<h3>tar với pg_dump: chúng không phải cùng một bản sao lưu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tar một cơ sở dữ liệu ĐANG CHẠY</span><span class="v"><strong>Thường là hỏng.</strong> Bạn đang chép file trong lúc engine ghi vào chúng. Thứ bạn nhận được là trạng thái trên đĩa của không một thời điểm nào cả — một ảnh chụp rách, có thể khôi phục được, có thể khôi phục sai, hoặc có thể không chịu khởi động.</span></div>
  <div class="kv"><span class="k">tar một cơ sở dữ liệu ĐÃ DỪNG</span><span class="v"><strong>Hợp lệ</strong>, và đúng từng byte. Khôi phục nhanh, nhưng chỉ khôi phục được vào cùng phiên bản chính của engine, và nó đồng nghĩa với thời gian ngừng dịch vụ bằng đúng thời gian chép.</span></div>
  <div class="kv"><span class="k"><code>pg_dump</code> / <code>mysqldump</code></span><span class="v"><strong>Hợp lệ trên cơ sở dữ liệu đang sống</strong>, vì engine cho bạn một ảnh chụp nhất quán ở mức giao dịch. Mang đi được qua các phiên bản và thậm chí qua các máy khác kiến trúc. Khôi phục chậm hơn với cơ sở dữ liệu lớn.</span></div>
  <div class="kv"><span class="k">Ảnh chụp hệ thống file (LVM/ZFS/đám mây)</span><span class="v"><strong>Hợp lệ và tức thì</strong>, nếu ảnh chụp là nguyên tử và engine an toàn khi sập. Đây là thứ các dịch vụ cơ sở dữ liệu có quản thật sự làm. Đòi tầng lưu trữ hỗ trợ.</span></div>
</div>
<pre><code><span class="tok-comment"># Cách đúng cho Postgres — xuất logic, từ container, khi đang sống</span>
docker exec -t cuonghoangdev_postgres \\
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

<h3>Một việc sao lưu hằng đêm thật sự chạy</h3>
<pre><code><span class="tok-comment"># /opt/backup/nightly.sh — cố ý viết cho nhàm chán</span>
#!/usr/bin/env bash
set -Eeuo pipefail
STAMP=$(date +%F)
DEST=/opt/backup/out
KEEP=14

mkdir -p "$DEST"
docker exec -t cuonghoangdev_postgres \\
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --compress=9 \\
  &gt; "$DEST/db-$STAMP.dump.part"
mv "$DEST/db-$STAMP.dump.part" "$DEST/db-$STAMP.dump"   <span class="tok-comment"># nguyên tử: không bao giờ có file dở mang tên .dump</span>

docker run --rm -v blog-uploads:/from:ro -v "$DEST:/to" alpine:3.20 \\
  tar -C /from -czf "/to/uploads-$STAMP.tgz.part" .
mv "$DEST/uploads-$STAMP.tgz.part" "$DEST/uploads-$STAMP.tgz"

find "$DEST" -name '*.dump' -mtime +$KEEP -delete
find "$DEST" -name '*.tgz'  -mtime +$KEEP -delete
rclone copy "$DEST" r2:backups/cuongthai --max-age 48h   <span class="tok-comment"># ra khỏi máy, không thì chưa phải sao lưu</span></code></pre>
<div class="out">2026-08-22 03:00:04 · db-2026-08-22.dump 84M · uploads-2026-08-22.tgz 611M
2026-08-22 03:04:41 · Transferred: 695.412 MiB / 695.412 MiB, 100%, 2.812 MiB/s
2026-08-22 03:04:41 · Checks: 28 / 28, 100% · Transferred: 2 / 2, 100%</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>set -Eeuo pipefail</code></span><span class="v">Không có nó thì một lệnh <code>pg_dump</code> chết trong đường ống vẫn thoát 0 và bạn giữ một file 0 byte suốt hai tuần. Chương 7 khoá Linux &amp; Bash giải thích vì sao từng chữ trong bốn chữ đó quan trọng.</span></div>
  <div class="kv"><span class="k">Ghi ra <code>.part</code>, rồi đổi tên</span><span class="v">Đổi tên trên cùng một hệ thống file là thao tác nguyên tử. Một lượt sao lưu bị ngắt để lại một file <code>.part</code> mà luật lưu giữ bỏ qua, thay vì một file cụt trông y như bản sao lưu thật.</span></div>
  <div class="kv"><span class="k">Ra khỏi máy</span><span class="v">Một bản sao lưu nằm cùng đĩa với cơ sở dữ liệu chỉ sống sót qua <code>rm -rf</code> chứ không qua gì khác — không qua đĩa hỏng, không qua VPS bị xoá, không qua mã tống tiền. R2/S3/B2 kèm luật vòng đời tốn vài xu mỗi tháng.</span></div>
  <div class="kv"><span class="k">Báo động khi VẮNG, đừng chỉ báo khi lỗi</span><span class="v">Một việc cron chết câm thì không sinh ra cảnh báo lỗi nào. Hãy để script chạm vào một URL nhịp tim khi thành công rồi báo động khi nhịp tim ngừng — healthchecks.io, hoặc một phép kiểm hai dòng trong hệ giám sát của chính bạn.</span></div>
  <div class="kv"><span class="k">Khôi phục theo lịch</span><span class="v">Mỗi tháng một lần, khôi phục bản dump đêm qua vào một cơ sở dữ liệu nháp rồi đếm một bảng. Hãy đặt nó vào lịch; đó là phép kiểm duy nhất có ý nghĩa.</span></div>
</div>

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
      description: 'Tám câu về luật gắn đè, volume vô danh, bẫy node_modules, lệch UID, tmpfs có trần, và vì sao tar một cơ sở dữ liệu đang chạy không phải là sao lưu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Data that survives</h2>
<p class="lead">Eight questions on persistence. The mount rules in particular are worth knowing by heart — they explain most of the surprises in this chapter, and predicting them correctly is the difference between a five-minute fix and an afternoon.</p>
<div class="callout ok">Aim for 7/8. The three that matter most: what an empty volume does over a populated directory versus what a bind mount does (7.1), why <code>node_modules</code> vanishes and what fixes it (7.3), and why a <code>tar</code> of a live database is not a backup (7.5).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Trắc nghiệm</span>
<h2>Dữ liệu sống sót</h2>
<p class="lead">Tám câu về việc giữ dữ liệu. Riêng mấy luật gắn thì đáng thuộc lòng — chúng giải thích phần lớn những bất ngờ trong chương này, và đoán đúng chúng là khác biệt giữa năm phút sửa và cả một buổi chiều.</p>
<div class="callout ok">Nhắm 7/8. Ba câu quan trọng nhất: một volume RỖNG làm gì khi đè lên thư mục có sẵn so với một bind mount (7.1), vì sao <code>node_modules</code> biến mất và cách vá (7.3), và vì sao <code>tar</code> một cơ sở dữ liệu đang sống không phải là sao lưu (7.5).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'You mount an EMPTY named volume over `/etc/nginx` in the `nginx:alpine` image. What does the container see at that path on the first run?|||Bạn gắn một volume có tên còn RỖNG đè lên `/etc/nginx` trong ảnh `nginx:alpine`. Ở lần chạy đầu, container thấy gì tại đường dẫn đó?',
            options: [
              'An empty directory — the image files are hidden|||Một thư mục rỗng — file của ảnh bị che',
              'The image\'s own /etc/nginx files, copied into the volume once on first use — which is exactly why a fresh postgres container can initialise its data directory|||Chính đám file /etc/nginx của ảnh, được chép vào volume một lần ở lần dùng đầu — và đó đúng là lý do một container postgres mới tinh khởi tạo được thư mục dữ liệu của nó',
              'An error, because you cannot mount over a non-empty image directory|||Một lỗi, vì bạn không được gắn đè lên một thư mục không rỗng của ảnh',
              'The host\'s /etc/nginx directory|||Thư mục /etc/nginx của máy chủ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You mount an EMPTY host directory as a bind mount over `/app` in an image that has files there. What does the container see?|||Bạn gắn một thư mục máy chủ còn RỖNG dưới dạng bind mount đè lên `/app` trong một cái ảnh vốn có file ở đó. Container thấy gì?',
            options: [
              'The image files, copied into the host directory|||File của ảnh, được chép vào thư mục máy chủ',
              'A merge of both sides|||Một bản trộn của cả hai phía',
              'An empty directory — a bind mount NEVER copies and the host always wins, which is the whole explanation for the vanished node_modules|||Một thư mục rỗng — bind mount KHÔNG BAO GIỜ chép và phía máy chủ luôn thắng, và đó là toàn bộ lời giải thích cho vụ node_modules biến mất',
              'The image files, because the host directory is empty|||File của ảnh, vì thư mục máy chủ đang rỗng',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'In a compose file you have `- .:/app` and your dependencies keep disappearing. Which extra line fixes it, and why?|||Trong file compose bạn có `- .:/app` và gói phụ thuộc cứ biến mất. Dòng nào thêm vào sẽ chữa được, và vì sao?',
            options: [
              '`- /app/node_modules` — an anonymous VOLUME mounted deeper than the bind, so it wins at that path and (being a volume) receives the image\'s copy on first use|||`- /app/node_modules` — một VOLUME vô danh gắn sâu hơn cái bind, nên nó thắng ở đường dẫn đó và (vì là volume) được chép bản của ảnh vào ở lần dùng đầu',
              '`- ./node_modules:/app/node_modules` — bind the host copy in|||`- ./node_modules:/app/node_modules` — bind bản của máy chủ vào',
              '`read_only: true` on the service|||`read_only: true` trên dịch vụ',
              'Nothing in compose can fix it; you must run npm install inside the container every time|||Không có gì trong compose chữa được; bạn phải chạy npm install bên trong container mỗi lần',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'On Linux, a container writes a file into a bind-mounted host directory and the file ends up owned by root. What is the cleanest fix?|||Trên Linux, một container ghi một file vào thư mục máy chủ được bind mount và file đó rốt cuộc thuộc quyền root. Cách vá sạch nhất là gì?',
            options: [
              'chown the directory after every run|||chown lại thư mục sau mỗi lần chạy',
              'Use a named volume instead|||Dùng volume có tên thay thế',
              'chmod 777 the host directory|||chmod 777 cho thư mục máy chủ',
              'Run the container as your own ids: `-u "$(id -u):$(id -g)"` — bind mounts pass numeric uids straight through with no translation layer|||Chạy container bằng chính id của bạn: `-u "$(id -u):$(id -g)"` — bind mount đưa thẳng uid dạng số đi qua, không có tầng dịch nào',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'What does `docker volume ls --filter dangling=true` actually list?|||`docker volume ls --filter dangling=true` thật ra liệt kê cái gì?',
            options: [
              'Volumes no container references right now — which includes the volume of a stopped-and-removed container you are about to recreate, still holding your database|||Những volume hiện không container nào tham chiếu tới — trong đó có cả volume của một container đã dừng và đã xoá mà bạn sắp dựng lại, vẫn đang ôm cơ sở dữ liệu của bạn',
              'Volumes that are corrupt and should be deleted|||Những volume bị hỏng và nên xoá',
              'Volumes that have never been written to|||Những volume chưa từng được ghi vào',
              'Anonymous volumes only|||Chỉ những volume vô danh',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why should a tmpfs mount always be given `size=`?|||Vì sao một phép gắn tmpfs luôn nên được đặt `size=`?',
            options: [
              'Docker refuses to start the container without it|||Docker từ chối khởi động container nếu không có nó',
              'Without a cap it can grow until it consumes the container\'s memory limit, and the OOM killer then takes the main process — a cap turns that into an immediate ENOSPC instead|||Không có trần thì nó phình tới khi ăn hết hạn mức bộ nhớ của container, rồi bộ giết OOM lấy mất tiến trình chính — đặt trần biến chuyện đó thành một lỗi ENOSPC tức thì',
              'It makes the mount faster|||Nó làm phép gắn nhanh hơn',
              'The size determines how long the data survives after the container stops|||Kích thước quyết định dữ liệu sống được bao lâu sau khi container dừng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You tar the `/var/lib/postgresql/data` volume nightly while Postgres runs. The tar always succeeds and the file size looks right. What is the status of that backup?|||Bạn tar volume `/var/lib/postgresql/data` mỗi đêm trong lúc Postgres đang chạy. Lệnh tar luôn thành công và kích thước file trông đúng. Trạng thái của bản sao lưu đó là gì?',
            options: [
              'Valid, because tar reads the files atomically|||Hợp lệ, vì tar đọc file một cách nguyên tử',
              'Valid only if the volume is mounted :ro|||Chỉ hợp lệ nếu volume được gắn :ro',
              'Likely a torn snapshot: files were copied while the engine wrote them, so it may restore, restore wrong, or refuse to start — use pg_dump on a live database, or stop the engine first|||Nhiều khả năng là một ảnh chụp rách: file bị chép trong lúc engine ghi vào chúng, nên nó có thể khôi phục được, khôi phục sai, hoặc không chịu khởi động — hãy dùng pg_dump trên cơ sở dữ liệu đang sống, hoặc dừng engine trước',
              'Valid, because Postgres is crash-safe|||Hợp lệ, vì Postgres an toàn khi sập',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A colleague pastes `docker inspect api` output into a support chat. What have they just published?|||Một đồng nghiệp dán kết quả `docker inspect api` vào một khung chat hỗ trợ. Họ vừa công bố cái gì?',
            options: [
              'Nothing sensitive; Docker redacts environment variables|||Không có gì nhạy cảm; Docker che biến môi trường',
              'Only the variables marked secret in compose|||Chỉ những biến được đánh dấu là bí mật trong compose',
              'Only the image name and mounts|||Chỉ tên ảnh và các phép gắn',
              'Every environment variable in full, including anything passed by -e or --env-file — which is why a secret that must not leak belongs in a file on tmpfs or a secrets manager, not in an env var|||Đủ từng biến môi trường nguyên vẹn, kể cả những cái truyền bằng -e hay --env-file — và đó là lý do một bí mật không được rò thì phải nằm trong một file trên tmpfs hoặc một trình quản bí mật, chứ không phải trong biến môi trường',
            ],
            correctIndex: 3,
            points: 1,
          },
        ],
      },
    },
  ],
};
