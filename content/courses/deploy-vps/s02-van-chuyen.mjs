/**
 * Deploy lên VPS — Chương 2: Vận chuyển (rsync · git push · registry · chọn đường · hỏng nửa chừng).
 * LUẬT: backtick → &#96;; ${ của bash → \${; < > & trong code → &lt; &gt; &amp;; gạch chéo ngược viết đôi.
 * Nâng cấp 29/09/2026: bài 2.0 slide (deck dv-02, 31 slide) + slide/🧪/🗂/📌 trong 2.1–2.5; đào sâu: mã kiểm tra cuộn
 * và --whole-file, dấu / cuối nguồn, bảng cờ rsync đo từng cờ (-z, -c, --chown bị lặng lẽ bỏ qua), openrsync trên Mac,
 * danh sách loại trừ (3 tai nạn thật), chỉ-thứ-đã-commit đo bằng tệp gõ dở (chuyện deploy.sh → deploy-nha.sh),
 * post-receive vs pre-receive (đã SỬA câu "hook hỏng in cảnh báo" — đo thật: không in gì), hook thiếu x và hook CRLF,
 * push/pull qua registry:2 đo bằng byte ở card mạng, COPY . . sai chỗ, dời tag, ba đường trên cùng thay đổi một dòng,
 * dựng cho amd64 từ Mac M1 (exec format error), rsync đứt giữa chừng bằng tc netem, flock trên máy chủ, --partial-dir,
 * --timeout; quiz 10 câu có giải thích. Output MỚI chạy thật trong container ubuntu:24.04 (VPS thí nghiệm), docker:27-dind,
 * registry:2, trên Mac M1 (macOS 27) và Fedora 44.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: 'Chapter 2 — Transport: getting the artifact onto the machine|||Chương 2 — Vận chuyển: đưa tạo tác lên máy',
  description: 'Ba đường đưa mã lên máy chủ, đo bằng byte, giây và bằng thứ chúng để lại khi bị cắt ngang giữa chừng. Trong đó có một thuật toán gửi 18 KB để đồng bộ một tệp 20 MB đã bị dịch chuyển toàn bộ, và một lệnh xoá sạch ảnh người dùng tải lên mà không hỏi.',
  lessons: [

    /* ─────────────────────────── 2.0 ─────────────────────────── */
    {
      title: '2.0 — Chapter 2 slides: three ways to ship bytes, in pictures|||2.0 — Slide Chương 2: ba đường chở byte lên máy chủ, bằng hình',
      slug: 'deploy-2-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 31 slide của Chương 2: mã kiểm tra cuộn của rsync, dấu / cuối, bảng cờ và --delete, openrsync trên Mac, kho trần + hook, chỉ thứ đã commit mới đi qua, pre-receive với post-receive, CRLF, lớp ảnh qua registry, tag với digest, ba đường đo trên cùng một thay đổi, dựng ở đâu, đứt giữa chừng, flock, --partial-dir và --timeout.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Slides</span>
<h2>The whole chapter in 31 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: the rolling checksum finding blocks that moved, the trailing slash that silently adds a directory level, <code>--delete</code> listing a user's photo for deletion, a bare repository and its twelve-line hook, the half-typed file that rsync ships and git does not, image layers crossing a registry, and a deploy cut in half by a dropped network.</p>
<p>Slides 3–8 belong to Lesson 2.1 (rsync), 9–13 to 2.2 (git push, including hooks that fail silently and a hook broken by Windows line endings), 14–18 to 2.3 (images and registries), 19–22 to 2.4 (the three transports measured side by side, and where to build) and 23–27 to 2.5 (failures halfway, locks, resuming and timeouts). The last four are the chapter's common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 29/09/2026 in a lab: Ubuntu 24.04 containers acting as a laptop and a VPS, two Docker-in-Docker machines with a <code>registry:2</code> between them, a Mac M1 and a Fedora 44 machine. Because both ends of the lab share one computer, the milliseconds are smaller than on a real VPS; the bytes are the same. The slides are in Vietnamese; the diagrams and code read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Slide</span>
<h2>Cả chương trong 31 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: mã kiểm tra cuộn tìm ra những khối đã dời chỗ, dấu / cuối lặng lẽ thêm một tầng thư mục, <code>--delete</code> liệt kê ảnh của người dùng để xoá, một kho trần cùng cái hook mười hai dòng, tệp gõ dở mà rsync chở lên còn git thì không, các lớp ảnh đi qua registry, và một lần deploy bị cắt làm đôi vì rớt mạng.</p>
<p>Slide 3–8 thuộc Bài 2.1 (rsync), 9–13 thuộc 2.2 (git push, gồm những hook hỏng mà không ai biết và một hook bị kiểu xuống dòng của Windows làm hỏng), 14–18 thuộc 2.3 (ảnh và registry), 19–22 thuộc 2.4 (ba đường đo cạnh nhau, và dựng ở đâu), 23–27 thuộc 2.5 (hỏng nửa chừng, khoá, đi tiếp và giới hạn chờ). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi ngày 29/09/2026 trong một phòng thí nghiệm: các container Ubuntu 24.04 đóng vai laptop và VPS, hai máy Docker-trong-Docker với một <code>registry:2</code> ở giữa, một chiếc Mac M1 và một máy Fedora 44. Vì hai đầu của phòng thí nghiệm nằm chung một máy tính, số mili giây nhỏ hơn trên VPS thật; số byte thì y như vậy.</p>
</div>
${gallery('dv-02', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'rsync chỉ gửi những khối đã đổi'], [4, 'Đường rsync: thư mục mới rồi mới tráo'], [5, 'Dấu / cuối nguồn'],
  [6, 'Bảng cờ rsync và phép đo -z'], [7, '--delete xoá cả ảnh người dùng'], [8, 'openrsync trên Mac, WSL trên Windows'],
  [9, 'Kho trần và hook'], [10, 'Hook post-receive từng dòng'], [11, 'Chỉ thứ đã commit mới đi qua'],
  [12, 'post-receive hỏng, push vẫn xanh'], [13, 'Hook mang CRLF'],
  [14, 'Ảnh là danh sách lớp'], [15, 'Push v2: 27 KB thay vì 63 MB'], [16, 'COPY . . đặt sai chỗ'],
  [17, 'Tag đổi được, digest thì không'], [18, 'Registry cục bộ và GHCR'],
  [19, 'Ba đường trên cùng một thay đổi'], [20, 'Đừng so lần đầu với lần chênh lệch'], [21, 'Chọn đường theo tạo tác'], [22, 'Dựng ở đâu'],
  [23, 'Đứt giữa chừng: mớ trộn hai bản'], [24, 'Hai lần deploy chồng nhau'], [25, 'flock -n và flock -w'],
  [26, '--partial-dir và --timeout'], [27, 'Bước nào chạy lại được an toàn'],
  [28, 'Sai lầm hay gặp'], [29, 'Bảng tra nhanh (1/2): rsync'], [30, 'Bảng tra nhanh (2/2): git, registry, khoá'], [31, 'Thực hành chương 2'],
])}
`,
    },

    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — rsync: the delta algorithm, and its two dangers|||2.1 — rsync: thuật toán chênh lệch, và hai mối nguy của nó',
      slug: 'deploy-2-1-rsync-va-hai-moi-nguy',
      type: 'LESSON',
      description: 'Chèn 100 byte vào ĐẦU một tệp 20 MB làm lệch mọi byte phía sau — rsync vẫn chỉ gửi 18 KB. Rồi hai phép đo cho thấy nó xoá mất ảnh người dùng, và để lại một thư mục trộn lẫn hai bản phát hành khi bị cắt ngang.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>rsync: the delta algorithm, and its two dangers</h2>
<p class="lead">rsync is the default answer for moving files to a server, and it deserves to be — the algorithm is genuinely clever. It is also the transport with the sharpest edges, and both of them are silent.</p>

<h3>The algorithm, measured</h3>
${slide('dv-02', 3, 'rsync chỉ gửi những khối đã đổi — kể cả khi mọi byte đã dời chỗ')}
<p>A single 20 MB file, synced three times: fresh, after changing 100 bytes in the middle, and after inserting 100 bytes at the very start — which shifts every byte in the file.</p>
<div class="out">=== lan dau: 20 MB ===
  Literal data:     20,000,000 bytes
  Matched data:              0 bytes
  Total bytes sent: 20,004,983

=== doi 100 BYTE o GIUA tep 20 MB ===
  Literal data:          4,472 bytes
  Matched data:     19,995,528 bytes
  Total bytes sent:     22,466

=== CHEN 100 byte o DAU (day lech toan bo phan con lai) ===
  Literal data:            100 bytes
  Matched data:     20,000,000 bytes
  Total bytes sent:     18,099</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Changing the middle: 0.11% sent</span><span class="v">22 KB instead of 20 MB. rsync divides the destination file into blocks, and only the blocks that actually changed are sent.</span></div>
  <div class="kv"><span class="k">Inserting at the front: <em>less</em> sent</span><span class="v">18 KB, and only <strong>100 bytes</strong> of literal data — the exact size of the insertion. Every byte moved, and rsync still recognised the whole 20 MB as already present.</span></div>
  <div class="kv"><span class="k">That is the clever part</span><span class="v">A naive block comparison fails completely here: block 1 no longer matches block 1, block 2 no longer matches block 2, nothing lines up. rsync uses a <em>rolling</em> checksum that can be advanced one byte at a time, so it finds the same blocks at their new offsets.</span></div>
  <div class="kv"><span class="k">Matched data can exceed the file</span><span class="v">20,000,000 matched in a file that is now 20,000,100 bytes — every original block was found, and only the new 100 bytes had to travel.</span></div>
</div>
<div class="note-ct">This is why rsync is worth using even for a large single artifact, and why the "rsync copies everything" belief is wrong. Two caveats keep it honest: the delta only helps when a version of the file is <em>already there</em> — the first sync always sends everything — and for a compressed artifact it helps much less, because changing one source byte changes most of the compressed bytes.</div>

<h3>How the rolling checksum finds a block that moved</h3>
<p>The numbers above deserve a step-by-step reading, because the same four steps explain both why rsync is cheap and exactly when it stops being cheap.</p>
<ol>
<li><strong>The receiver cuts its OLD copy into blocks</strong> — rsync picks the block size from the file size, from a few hundred bytes to a few kilobytes — and sends two checksums per block to the sender: a weak one that is cheap to compute, and a strong one that is expensive but reliable.</li>
<li><strong>The sender slides a window over its NEW copy, one byte at a time.</strong> The weak checksum is "rolling": moving the window by one byte updates it with one subtraction and one addition instead of re-reading the whole block. That is what makes checking <em>every</em> offset affordable.</li>
<li><strong>When the weak checksum matches a known block</strong>, the sender confirms with the strong one. Confirmed means it sends "put your block N here" — a few bytes — instead of the block itself.</li>
<li><strong>Bytes that match no block travel literally.</strong> After a 100-byte insertion only those 100 bytes match nothing, which is precisely the <code>Literal data: 100 bytes</code> line.</li>
</ol>
<p>Re-run on 29/09/2026 in the lab (laptop container → VPS container, GNU rsync 3.2.7), the numbers came out identical to the ones above, and one more line shows what the algorithm is worth — the same insertion with the algorithm switched off:</p>
<div class="out">=== chen o dau, nhung --whole-file (tat thuat toan) ===
  thoi gian: 0.44 s
Literal data: 20,000,200 bytes
Matched data: 0 bytes
Total bytes sent: 20,005,198</div>
<p>Twenty megabytes again instead of eighteen kilobytes. rsync turns the algorithm off by itself when source and destination are both local paths, because reading the whole destination to compute checksums costs more than simply copying. Across a network it is on by default, and that is the case that matters for deploying.</p>

<h3>Danger one: <code>--delete</code> deletes</h3>
${slide('dv-02', 7, '--delete xoá cả ảnh người dùng — chạy thử để thấy trước')}
<p><code>--delete</code> is the flag that makes the destination match the source, which is what you want for a release directory. It is also indiscriminate:</p>
<div class="out">  tren VPS truoc khi deploy:
    /srv/vps/dg/tai-len/quan-trong.jpg

=== rsync --delete tu mot thu muc KHONG co tai-len/ ===
  sau deploy:
    /srv/vps/dg/app.js
    ❌ anh nguoi dung DA BI XOA</div>
<div class="pitfall"><strong>Trap — <code>--delete</code> removes anything on the server that is not in your source, including things the server created.</strong> User uploads, generated files, a SQLite database, log files. There is no confirmation and no error; the deploy reports success. This is category 3 from Lesson 1.1 — runtime state — and it is the reason that category must live <em>outside</em> the directory a deploy writes to. Without <code>--delete</code> the problem inverts: files deleted from your repository stay on the server forever, so an old route or an old asset is still being served months after it was removed.</div>
<pre><code><span class="tok-comment"># TRUOC KHI chay that: xem no SE lam gi, ma khong lam gi ca</span>
rsync -avn --delete ./ vps:/srv/app/          <span class="tok-comment"># -n = --dry-run</span>

<span class="tok-comment"># bao ve theo tung duong dan — luat nay o phia NHAN</span>
rsync -a --delete --filter='protect tai-len/***' \\
                  --filter='protect log/***' ./ vps:/srv/app/</code></pre>
<p><code>--dry-run</code> before a first real deploy is the cheapest habit in this course. It prints every file it would send and every file it would delete, and changes nothing. The <code>protect</code> filter is the belt to that braces: it marks paths the receiving side must never delete, even when they are absent from the source.</p>

<h3>Danger two: it is atomic per file, not per deploy</h3>
${slide('dv-02', 4, 'Đường rsync: chép vào thư mục mới rồi mới tráo')}
<p>A directory of 400 files, all on version 1. An rsync of version 2, killed six seconds in:</p>
<div class="out">=== rsync bi giet giua chung ===
  con PHIEN BAN 1:      310 tep
  da thanh PHIEN BAN 2:  90 tep
  tep tam con sot lai:    0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">No partial files</span><span class="v">Zero temporary files left behind, and no file containing half of one version and half of another. rsync writes each file to a hidden temporary name and renames it into place, so a file is either fully old or fully new.</span></div>
  <div class="kv"><span class="k">But the directory is a mixture</span><span class="v">310 files from one release and 90 from another, running together. Every individual file is valid; the combination is a version that was never tested and never existed anywhere else.</span></div>
  <div class="kv"><span class="k">This is the worst failure shape</span><span class="v">Not a crash, not a syntax error. A running application where one module expects the new database column and another module still writes the old one. The bug reports make no sense because the code they describe does not exist in any commit.</span></div>
  <div class="kv"><span class="k">And it does not need a kill</span><span class="v">A dropped connection, a laptop lid closing, a CI job timing out, a network hiccup mid-deploy. Every one of them produces this state.</span></div>
</div>
<div class="callout ok"><strong>The fix is the releases layout from Lesson 0.4, and this is the strongest argument for it.</strong> rsync into a <em>new</em> directory that nothing is serving from, then move the symlink. An interrupted transfer leaves a half-populated directory that no one is using; the live release is untouched. The swap itself is one <code>rename(2)</code>, which cannot be interrupted halfway.</div>
<pre><code><span class="tok-comment"># chuyen vao thu muc MOI, dung cham vao ban dang chay</span>
BAN="/srv/app/phat-hanh/\$(date -u +%Y-%m-%d-%H%M%S)-\$(git rev-parse --short HEAD)"
rsync -a --delete --link-dest=/srv/app/hien-tai/ ./ "vps:\$BAN/"

<span class="tok-comment"># chi khi da xong, va da kiem, moi trao — mot thao tac nguyen tu</span>
ssh vps "ln -sfn '\$BAN' /srv/app/ht.moi &amp;&amp; mv -T /srv/app/ht.moi /srv/app/hien-tai"</code></pre>

<h3>The flags worth knowing</h3>
${slide('dv-02', 6, 'Bảng cờ rsync và phép đo -z')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">-a</span><span class="lz-lnote">Archive: recursive, preserves symlinks, permissions, times, group and owner. Almost always what you want, and it is <em>not</em> the default.</span></div>
  <div class="lz-layer"><span class="lz-lname">-z</span><span class="lz-lnote">Compress in transit. Worth it over a slow link, pointless over a fast one, and actively wasteful for already-compressed files.</span></div>
  <div class="lz-layer"><span class="lz-lname">-n and -i</span><span class="lz-lnote"><code>--dry-run</code> and <code>--itemize-changes</code>. Together they answer "what would this do" exactly, and cost nothing. Use them before every first-time deploy.</span></div>
  <div class="lz-layer"><span class="lz-lname">--link-dest</span><span class="lz-lnote">Hardlink unchanged files against a reference directory — Lesson 1.5 measured 4.8× less disk for five releases.</span></div>
  <div class="lz-layer"><span class="lz-lname">--chown / --chmod</span><span class="lz-lnote">Set ownership and permissions at the destination, which fixes the root-owned-files problem measured in Lesson 0.2. Needs privilege on the receiving side.</span></div>
  <div class="lz-layer"><span class="lz-lname">--inplace</span><span class="lz-lnote">Write directly into the destination file instead of a temp-and-rename. It breaks the per-file atomicity above <em>and</em> corrupts hardlinked releases. Use only when you know why you want it.</span></div>
</div>
<h3>The trailing slash on the source, measured</h3>
${slide('dv-02', 5, 'Dấu / cuối NGUỒN đổi cả cây thư mục')}
<p>One character decides the shape of the tree on the server, and nothing warns you when it is the wrong one:</p>
<div class="out">$ rsync -a dist vps:/srv/app/s1/
$ rsync -a dist/ vps:/srv/app/s2/
$ ssh vps "cd /srv/app; find s1 s2 -type f | sort"
s1/dist/assets/app.css
s1/dist/index.html
s2/assets/app.css
s2/index.html</div>
<p>Without the slash, rsync copies the directory <em>itself</em> into the destination; with it, rsync copies the directory's <em>contents</em>. A slash on the destination changes nothing. The dangerous part is the failure shape: the first form succeeds, exits 0, and leaves <code>/srv/app/s1/index.html</code> — the file nginx actually serves — exactly as it was. Your new version is sitting one level deeper, unused. Adopt one convention and never vary it: <strong>source and destination both end in <code>/</code></strong>, as in every command in this course.</p>

<h3>The flag table, with what each flag did in the lab</h3>
<table>
<tr><th>Flag</th><th>What it does</th><th>Measured / observed</th></tr>
<tr><td><code>-a</code></td><td>Archive = <code>-rlptgoD</code>: recurse, keep symlinks, permissions, times, group, owner, devices</td><td>The baseline for every deploy command here</td></tr>
<tr><td><code>-z</code></td><td>Compress on the wire</td><td>App of 627 files: 2,334,579 → 649,089 bytes (3.6× less). A 3 MB <code>.gz</code>: 3,019,243 → 3,019,971 bytes — 728 bytes <em>more</em></td></tr>
<tr><td><code>--delete</code></td><td>Remove anything at the destination that the source lacks</td><td>Listed <code>tai-len/quan-trong.jpg</code> and <code>.env</code> for deletion, exit 0</td></tr>
<tr><td><code>-n</code> / <code>--dry-run</code></td><td>Print the plan, change nothing</td><td>Free. Run before any first deploy and after any change to the command</td></tr>
<tr><td><code>-i</code> / <code>--itemize-changes</code></td><td>One code per item: <code>&lt;</code> sent, <code>f</code>/<code>d</code> file/dir, <code>c</code>/<code>s</code>/<code>t</code> content/size/time, <code>*deleting</code></td><td>Turns the dry run into something you can read line by line</td></tr>
<tr><td><code>--partial</code> / <code>--partial-dir=DIR</code></td><td>Keep a half-transferred file so the next run resumes it</td><td>Lesson 2.5: a resumed 8 MB transfer took 8.5 s instead of 17.0 s</td></tr>
<tr><td><code>-c</code> / <code>--checksum</code></td><td>Compare file contents instead of size + modification time</td><td>Same size, same second, different content: skipped without <code>-c</code>, sent with it</td></tr>
<tr><td><code>--chown</code> / <code>--chmod</code></td><td>Set owner / mode at the destination</td><td><code>--chmod=F640</code> worked as a normal user; <code>--chown=root:root</code> was <em>silently ignored</em> — exit 0, owner still <code>deploy</code></td></tr>
</table>
<div class="out"># index.html doi v1 → v9: CUNG co, CUNG giay sua
$ rsync -an -i dist/ vps:/srv/app/web/
$ rsync -an -i --checksum dist/ vps:/srv/app/web/
&lt;fc........ index.html</div>
<p>The first command prints nothing at all: rsync's default "quick check" sees the same size and the same modification time and decides the file is unchanged. That is fine for a build that always rewrites timestamps, and wrong after <code>git clone</code>, a CI checkout or a <code>touch -d</code>, all of which can produce a changed file with an unchanged time. <code>-c</code> reads every file on both sides to hash it, so it costs disk I/O on a large tree — use it when correctness beats speed, such as the final sync before a release.</p>
<div class="pitfall co-tieu-de"><strong>Trap — the exclude list is part of your artifact, and this repository has three real accidents to prove it.</strong> On 05/08/2026 an exclude rule written as <code>frontend/.next/</code> did not match a development build directory called <code>.next-dev-isolated</code>, and rsync shipped 245 MB of it to the VPS and into the Docker build context. For weeks <code>secrets.h</code> — the robot firmware's Wi-Fi and API keys — travelled to the server on every deploy because it did not match <code>.env*</code>. And <code>deploy.sh</code> carries a warning never to put a <code>#</code> line inside the backslash-continued rsync command: the comment would swallow every flag after it, including <code>--exclude='.env'</code>, and the production secrets would ship. Read your exclude list as carefully as your code, and read the dry-run output after every change to it.</div>

<h3>On macOS, and on Windows/WSL</h3>
${slide('dv-02', 8, 'Mac có openrsync, Windows không có rsync')}
<p>The machine you deploy <em>from</em> may not have the rsync this lesson describes. Measured on 29/09/2026 from a Mac M1 (macOS 27) into the lab VPS, flag by flag:</p>
<div class="out">$ /usr/bin/rsync --version | head -2
openrsync: protocol version 29
rsync version 2.6.9 compatible
$ rsync -a --info=progress2 -e "$E" macdist/ deploy@127.0.0.1:/srv/app/mac/
rsync: unrecognized option &#96;--info=progress2'
$ rsync -ai --delete "--filter=protect tai-len/" -e "$E" macdist/ deploy@127.0.0.1:/srv/app/mac/
.d..tp... ./
&lt;f+++++++ index.html
cd+++++++ assets/
&lt;f+++++++ assets/a.css</div>
<ul>
<li><strong>macOS</strong> ships <strong>openrsync</strong>, a separate implementation. <code>-a -z -n -i --delete --checksum --partial --partial-dir --link-dest --filter --max-delete --timeout</code> all worked; <code>--info=progress2</code>, <code>--append-verify</code> and <code>--chown</code> failed with <code>unrecognized option</code>; its itemize codes are 9 characters instead of 11, and its <code>--stats</code> says <code>Unmatched data</code> where GNU rsync says <code>Literal data</code> — so a script that parses either breaks. The <code>protect</code> filter did keep <code>tai-len/a.jpg</code>. For a deploy script, install GNU rsync (<code>brew install rsync</code>) or run the script inside Linux.</li>
<li><strong>Ubuntu 24.04</strong> has GNU rsync 3.2.7 and <strong>Fedora 44</strong> 3.4.4 — every flag in this lesson behaves identically on both.</li>
<li><strong>Windows</strong> has no rsync at all. Git for Windows brings <code>git</code> and <code>ssh</code>, not rsync; run deploys from WSL2, where GNU rsync is one <code>apt install</code> away. Files under <code>/mnt/c/…</code> show mode <code>777</code> from inside WSL, so add <code>--chmod=D755,F644</code> or everything on the server becomes world-writable.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the night before your SWP391 defence, the group deploys the front end with rsync into <code>/srv/app/web</code> on the VPS — the same directory that holds users' uploads in <code>tai-len/</code> and the production <code>.env</code>. You must ship the new build without losing a single photo. Build the lab VPS once (you will reuse it all chapter):</p>
<pre><code class="language-bash">mkdir -p ~/dv-lab &amp;&amp; cd ~/dv-lab
ssh-keygen -t ed25519 -N "" -f ./khoa -q      # a key ONLY for the lab
cat &gt; Dockerfile &lt;&lt;'EOF'
FROM ubuntu:24.04
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends openssh-server rsync git \\
 &amp;&amp; mkdir -p /run/sshd &amp;&amp; useradd -m -s /bin/bash deploy \\
 &amp;&amp; mkdir -p /srv/app /home/deploy/.ssh &amp;&amp; chown deploy /srv/app
COPY khoa.pub /home/deploy/.ssh/authorized_keys
RUN chown -R deploy /home/deploy/.ssh &amp;&amp; chmod 700 /home/deploy/.ssh
CMD ["/usr/sbin/sshd", "-D", "-e"]
EOF
cat &gt; cfg &lt;&lt;EOF
Host vps
    HostName 127.0.0.1
    Port 2222
    User deploy
    IdentityFile $PWD/khoa
    UserKnownHostsFile $PWD/known_hosts
    StrictHostKeyChecking accept-new
EOF
docker build -t vps-thu . &amp;&amp; docker run -d --name vps-thu -p 127.0.0.1:2222:22 vps-thu
export RSYNC_RSH="ssh -F $PWD/cfg" GIT_SSH_COMMAND="ssh -F $PWD/cfg"
ssh -F cfg vps hostname</code></pre>
<ol>
<li>On the VPS create <code>/srv/app/web/tai-len/anh.jpg</code> and <code>/srv/app/web/.env</code>; locally create <code>dist/index.html</code> and <code>dist/assets/app.css</code>.</li>
<li>Run <code>rsync -ain --delete dist/ vps:/srv/app/web/</code> and count the <code>*deleting</code> lines you did not want.</li>
<li>Add <code>--filter='protect tai-len/'</code> and <code>--filter='protect .env'</code>, dry-run again until no <code>*deleting</code> line remains, then run it for real.</li>
<li>Change one line of <code>index.html</code> and run with <code>-i</code> again: only <code>index.html</code> should be listed. Then try <code>rsync -a dist vps:/srv/app/web/</code> (no slash) and find where your file went.</li>
</ol>
<p><strong>Done when:</strong> <code>anh.jpg</code> and <code>.env</code> still exist on the VPS after the real run, the last dry run printed no <code>*deleting</code> line, and you can show the stray <code>web/dist/</code> directory the missing slash created (then delete it).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Delta transfer</span><span class="v">Sending only the blocks that differ between the old copy at the destination and the new copy at the source.</span></div>
  <div class="kv"><span class="k">Rolling checksum</span><span class="v">A checksum that can be updated cheaply as a window slides one byte, which is how rsync finds blocks that moved.</span></div>
  <div class="kv"><span class="k">Literal data</span><span class="v">The bytes rsync really had to send because they matched no block at the destination.</span></div>
  <div class="kv"><span class="k">Dry run</span><span class="v"><code>-n</code>: print what would happen, change nothing.</span></div>
  <div class="kv"><span class="k">Itemize changes</span><span class="v"><code>-i</code>: one code per item — direction, type, which attribute changed, or <code>*deleting</code>.</span></div>
  <div class="kv"><span class="k">Mirror</span><span class="v">A destination made identical to the source, deletions included — the job of <code>--delete</code>.</span></div>
  <div class="kv"><span class="k">Protect filter</span><span class="v">A receiver-side rule naming paths that must never be deleted.</span></div>
  <div class="kv"><span class="k">Hard link</span><span class="v">Two names for the same data on disk; <code>--link-dest</code> uses them so unchanged files cost no extra space per release.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>rsync sends only what changed, even when every byte moved: a 100-byte insertion into a 20 MB file cost 18 KB — but a first sync and an already-compressed file get no benefit.</li>
<li>A trailing slash on the SOURCE means "the contents of"; without it you get an extra directory level and no error.</li>
<li><code>--delete</code> removes whatever the source lacks, uploads and <code>.env</code> included, and exits 0 — dry-run with <code>-n -i</code> first and <code>protect</code> what the server creates.</li>
<li>rsync is atomic per file, never per deploy: copy into a new release directory, then swap the symlink.</li>
<li><code>-z</code> pays off on text (3.6× here) and not at all on compressed files; <code>-c</code> catches same-size, same-time changes that the quick check misses.</li>
<li>macOS ships openrsync with missing flags and Windows has no rsync — write deploy scripts for GNU rsync and run them in Linux or WSL.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The rsync algorithm — Tridgell &amp; Mackerras, 1996</span><span class="lc-sub">rsync.samba.org/tech_report — eight pages describing the rolling checksum that produced the 100-byte result above. Unusually readable for a technical report.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — FILTER RULES and --delete variants</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — <code>protect</code>, and the difference between <code>--delete-before</code>, <code>--delete-during</code> and <code>--delete-after</code>.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — rename, temp files and atomic writes</span><span class="lc-sub">/courses/linux-bash/learn${REF} — why write-then-rename is the standard way to update a file safely, which is what rsync does per file.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — serving from a directory that is being replaced</span><span class="lc-sub">/courses/nginx/learn${REF} — what the web server does with a file that changes underneath it, and why the symlink swap is safe from its point of view.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>rsync: thuật toán chênh lệch, và hai mối nguy của nó</h2>
<p class="lead">rsync là câu trả lời mặc định cho việc chuyển tệp lên máy chủ, và nó xứng đáng như vậy — cái thuật toán thật sự thông minh. Nó cũng là đường vận chuyển có những lưỡi dao sắc nhất, và cả hai lưỡi đều CÂM.</p>

<h3>Thuật toán, đo thật</h3>
${slide('dv-02', 3, 'rsync chỉ gửi những khối đã đổi — kể cả khi mọi byte đã dời chỗ')}
<p>Một tệp 20 MB duy nhất, đồng bộ ba lần: lần đầu, sau khi đổi 100 byte ở GIỮA, và sau khi CHÈN 100 byte vào đúng đầu tệp — việc này làm dịch chuyển MỌI byte trong tệp.</p>
<div class="out">=== lan dau: 20 MB ===
  Literal data:     20,000,000 bytes
  Matched data:              0 bytes
  Total bytes sent: 20,004,983

=== doi 100 BYTE o GIUA tep 20 MB ===
  Literal data:          4,472 bytes
  Matched data:     19,995,528 bytes
  Total bytes sent:     22,466

=== CHEN 100 byte o DAU (day lech toan bo phan con lai) ===
  Literal data:            100 bytes
  Matched data:     20,000,000 bytes
  Total bytes sent:     18,099</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Đổi ở giữa: gửi 0,11%</span><span class="v">22 KB thay vì 20 MB. rsync chia tệp ở phía đích thành các khối, và chỉ những khối thật sự thay đổi mới được gửi đi.</span></div>
  <div class="kv"><span class="k">Chèn vào đầu: gửi còn ÍT HƠN</span><span class="v">18 KB, và chỉ <strong>100 byte</strong> dữ liệu nguyên bản — đúng bằng kích thước phần chèn vào. Mọi byte đều đã dịch chuyển, mà rsync vẫn nhận ra cả 20 MB là đã có sẵn.</span></div>
  <div class="kv"><span class="k">Đó mới là chỗ thông minh</span><span class="v">Một phép so khối ngây thơ thì THẤT BẠI HOÀN TOÀN ở đây: khối 1 không còn khớp khối 1, khối 2 không còn khớp khối 2, chẳng có gì thẳng hàng. rsync dùng một mã kiểm tra kiểu CUỘN, tiến được từng byte một, nên nó tìm ra đúng những khối cũ ở vị trí mới của chúng.</span></div>
  <div class="kv"><span class="k">Dữ liệu khớp có thể LỚN HƠN cả tệp</span><span class="v">20.000.000 byte khớp trong một tệp giờ nặng 20.000.100 byte — mọi khối gốc đều được tìm thấy, và chỉ 100 byte mới phải đi qua đường truyền.</span></div>
</div>
<div class="note-ct">Đây là lý do rsync đáng dùng ngay cả với một tạo tác đơn lẻ cỡ lớn, và là lý do niềm tin "rsync chép hết" là sai. Hai điều kiện giữ cho lời này trung thực: phần chênh lệch chỉ giúp được khi ĐÃ CÓ SẴN một phiên bản của tệp ở đó — lần đồng bộ đầu tiên luôn gửi tất cả — và với một tạo tác ĐÃ NÉN thì nó giúp ít hơn nhiều, vì đổi một byte nguồn làm đổi phần lớn số byte đã nén.</div>

<h3>Mã kiểm tra CUỘN tìm ra một khối đã dời chỗ như thế nào</h3>
<p>Mấy con số ở trên đáng được đọc từng bước, vì đúng bốn bước này giải thích cả lý do rsync rẻ lẫn chính xác lúc nào nó thôi rẻ.</p>
<ol>
<li><strong>Phía nhận cắt bản CŨ của nó thành từng khối</strong> — rsync tự chọn cỡ khối theo cỡ tệp, từ vài trăm byte tới vài KB — rồi gửi cho phía gửi hai mã kiểm tra cho mỗi khối: một mã YẾU tính rất rẻ, và một mã MẠNH tính đắt nhưng tin được.</li>
<li><strong>Phía gửi trượt một cửa sổ trên bản MỚI của nó, mỗi lần MỘT byte.</strong> Mã yếu là loại "cuộn": dời cửa sổ một byte chỉ cần một phép trừ và một phép cộng, không phải đọc lại cả khối. Nhờ vậy mới đủ sức kiểm <em>MỌI</em> vị trí.</li>
<li><strong>Khi mã yếu khớp một khối đã biết</strong>, phía gửi xác nhận bằng mã mạnh. Khớp thật thì nó gửi câu "đặt khối số N của anh vào đây" — vài byte — thay vì gửi cả khối.</li>
<li><strong>Byte nào không khớp khối nào thì đi nguyên bản.</strong> Sau khi chèn 100 byte, chỉ đúng 100 byte đó không khớp gì, và đó chính là dòng <code>Literal data: 100 bytes</code>.</li>
</ol>
<p>Chạy lại ngày 29/09/2026 trong phòng thí nghiệm (container laptop → container VPS, GNU rsync 3.2.7), các con số ra y hệt ở trên, và thêm một dòng cho thấy thuật toán đáng giá bao nhiêu — cùng cú chèn đó nhưng TẮT thuật toán:</p>
<div class="out">=== chen o dau, nhung --whole-file (tat thuat toan) ===
  thoi gian: 0.44 s
Literal data: 20,000,200 bytes
Matched data: 0 bytes
Total bytes sent: 20,005,198</div>
<p>Lại hai mươi megabyte thay vì mười tám kilobyte. rsync tự TẮT thuật toán khi cả nguồn lẫn đích đều là đường dẫn cục bộ, vì đọc hết tệp đích để tính mã kiểm tra còn tốn hơn chép thẳng. Qua mạng thì nó BẬT mặc định — và đó mới là trường hợp của deploy.</p>

<h3>Mối nguy thứ nhất: <code>--delete</code> thì XOÁ THẬT</h3>
${slide('dv-02', 7, '--delete xoá cả ảnh người dùng — chạy thử để thấy trước')}
<p><code>--delete</code> là cờ làm cho phía đích khớp với phía nguồn, và đó là thứ bạn muốn cho một thư mục bản phát hành. Nó cũng không phân biệt gì cả:</p>
<div class="out">  tren VPS truoc khi deploy:
    /srv/vps/dg/tai-len/quan-trong.jpg

=== rsync --delete tu mot thu muc KHONG co tai-len/ ===
  sau deploy:
    /srv/vps/dg/app.js
    ❌ anh nguoi dung DA BI XOA</div>
<div class="pitfall"><strong>Bẫy — <code>--delete</code> gỡ bỏ bất cứ thứ gì trên máy chủ mà không có trong nguồn của bạn, kể cả những thứ do chính máy chủ tạo ra.</strong> Tệp người dùng tải lên, tệp sinh ra lúc chạy, một cơ sở dữ liệu SQLite, các tệp log. Không có xác nhận và không có lỗi; lần deploy báo thành công. Đây là loại 3 ở Bài 1.1 — trạng thái lúc chạy — và nó là lý do loại đó phải sống ở <em>NGOÀI</em> cái thư mục mà deploy ghi vào. Không có <code>--delete</code> thì vấn đề lật ngược: những tệp đã xoá khỏi kho mã của bạn sẽ nằm lại trên máy chủ MÃI MÃI, nên một tuyến cũ hay một tài nguyên cũ vẫn được phục vụ nhiều tháng sau khi bị gỡ.</div>
<pre><code><span class="tok-comment"># TRUOC KHI chay that: xem no SE lam gi, ma khong lam gi ca</span>
rsync -avn --delete ./ vps:/srv/app/          <span class="tok-comment"># -n = --dry-run</span>

<span class="tok-comment"># bao ve theo tung duong dan — luat nay o phia NHAN</span>
rsync -a --delete --filter='protect tai-len/***' \\
                  --filter='protect log/***' ./ vps:/srv/app/</code></pre>
<p><code>--dry-run</code> trước lần deploy thật đầu tiên là thói quen rẻ nhất trong cả khoá này. Nó in ra mọi tệp nó SẼ gửi và mọi tệp nó SẼ xoá, mà không đổi gì cả. Bộ lọc <code>protect</code> là cái dây lưng đi kèm quần treo: nó đánh dấu những đường dẫn mà phía nhận KHÔNG BAO GIỜ được xoá, kể cả khi chúng vắng mặt ở nguồn.</p>

<h3>Mối nguy thứ hai: nó nguyên tử theo TỪNG TỆP, không phải theo LẦN DEPLOY</h3>
${slide('dv-02', 4, 'Đường rsync: chép vào thư mục mới rồi mới tráo')}
<p>Một thư mục 400 tệp, tất cả đang ở phiên bản 1. Một lệnh rsync phiên bản 2, bị giết sau sáu giây:</p>
<div class="out">=== rsync bi giet giua chung ===
  con PHIEN BAN 1:      310 tep
  da thanh PHIEN BAN 2:  90 tep
  tep tam con sot lai:    0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Không có tệp dở dang</span><span class="v">Không sót tệp tạm nào, và không tệp nào chứa nửa phiên bản này nửa phiên bản kia. rsync ghi mỗi tệp ra một cái tên tạm ẩn rồi đổi tên vào chỗ, nên một tệp hoặc là CŨ HOÀN TOÀN hoặc MỚI HOÀN TOÀN.</span></div>
  <div class="kv"><span class="k">Nhưng cả thư mục là một MỚ TRỘN</span><span class="v">310 tệp từ một bản phát hành và 90 tệp từ bản khác, chạy chung với nhau. Từng tệp riêng lẻ đều hợp lệ; cái TỔ HỢP đó là một phiên bản chưa từng được kiểm thử và chưa từng tồn tại ở đâu khác.</span></div>
  <div class="kv"><span class="k">Đây là kiểu hỏng TỆ NHẤT</span><span class="v">Không sập, không lỗi cú pháp. Một ứng dụng đang chạy mà một module trông đợi cột cơ sở dữ liệu mới còn một module khác vẫn ghi theo kiểu cũ. Các báo cáo lỗi trở nên vô nghĩa vì cái mã mà chúng mô tả KHÔNG tồn tại trong bất kỳ commit nào.</span></div>
  <div class="kv"><span class="k">Và nó không cần tới một lệnh giết</span><span class="v">Một kết nối rớt, một cái nắp laptop gập xuống, một job CI hết giờ, một cú nghẽn mạng giữa lúc deploy. Mỗi thứ trong đó đều sinh ra đúng trạng thái này.</span></div>
</div>
<div class="callout ok"><strong>Cách sửa là bố cục releases ở Bài 0.4, và đây là lý lẽ MẠNH NHẤT cho nó.</strong> rsync vào một thư mục MỚI mà chẳng ai đang phục vụ từ đó, rồi di chuyển symlink. Một lần chuyển bị cắt ngang để lại một thư mục đầy dở dang mà không ai đang dùng; bản phát hành đang sống thì không hề bị đụng tới. Bản thân bước tráo là MỘT lời gọi <code>rename(2)</code>, thứ không thể bị cắt ngang giữa chừng.</div>
<pre><code><span class="tok-comment"># chuyen vao thu muc MOI, dung cham vao ban dang chay</span>
BAN="/srv/app/phat-hanh/\$(date -u +%Y-%m-%d-%H%M%S)-\$(git rev-parse --short HEAD)"
rsync -a --delete --link-dest=/srv/app/hien-tai/ ./ "vps:\$BAN/"

<span class="tok-comment"># chi khi da xong, va da kiem, moi trao — mot thao tac nguyen tu</span>
ssh vps "ln -sfn '\$BAN' /srv/app/ht.moi &amp;&amp; mv -T /srv/app/ht.moi /srv/app/hien-tai"</code></pre>

<h3>Những cờ đáng biết</h3>
${slide('dv-02', 6, 'Bảng cờ rsync và phép đo -z')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">-a</span><span class="lz-lnote">Archive: đệ quy, giữ liên kết mềm, quyền, thời gian, nhóm và chủ sở hữu. Gần như luôn là thứ bạn muốn, và nó KHÔNG phải mặc định.</span></div>
  <div class="lz-layer"><span class="lz-lname">-z</span><span class="lz-lnote">Nén trên đường truyền. Đáng giá qua một đường chậm, vô nghĩa qua một đường nhanh, và LÃNG PHÍ thật sự với những tệp vốn đã nén.</span></div>
  <div class="lz-layer"><span class="lz-lname">-n và -i</span><span class="lz-lnote"><code>--dry-run</code> và <code>--itemize-changes</code>. Ghép lại chúng trả lời chính xác câu "cái này sẽ làm gì", và chẳng tốn gì. Dùng chúng trước mọi lần deploy đầu tiên.</span></div>
  <div class="lz-layer"><span class="lz-lname">--link-dest</span><span class="lz-lnote">Liên kết cứng những tệp không đổi so với một thư mục tham chiếu — Bài 1.5 đo được ít hơn 4,8 lần dung lượng đĩa cho năm bản phát hành.</span></div>
  <div class="lz-layer"><span class="lz-lname">--chown / --chmod</span><span class="lz-lnote">Đặt chủ sở hữu và quyền ngay ở phía đích, sửa được lỗi tệp-thuộc-về-root đo ở Bài 0.2. Cần đặc quyền ở phía nhận.</span></div>
  <div class="lz-layer"><span class="lz-lname">--inplace</span><span class="lz-lnote">Ghi thẳng vào tệp đích thay vì ghi-tạm-rồi-đổi-tên. Nó PHÁ tính nguyên tử theo từng tệp ở trên <em>VÀ</em> làm hỏng các bản phát hành dùng liên kết cứng. Chỉ dùng khi bạn biết mình muốn nó để làm gì.</span></div>
</div>
<h3>Dấu / cuối ở NGUỒN, đo thật</h3>
${slide('dv-02', 5, 'Dấu / cuối NGUỒN đổi cả cây thư mục')}
<p>Một ký tự quyết định hình dạng cả cây thư mục trên máy chủ, và không gì cảnh báo bạn khi nó sai:</p>
<div class="out">$ rsync -a dist vps:/srv/app/s1/
$ rsync -a dist/ vps:/srv/app/s2/
$ ssh vps "cd /srv/app; find s1 s2 -type f | sort"
s1/dist/assets/app.css
s1/dist/index.html
s2/assets/app.css
s2/index.html</div>
<p>Không có dấu /, rsync chép <em>CHÍNH</em> thư mục đó vào đích; có dấu /, rsync chép <em>NỘI DUNG</em> của nó. Dấu / ở đích thì không đổi gì. Cái nguy hiểm nằm ở kiểu hỏng: dạng thứ nhất chạy thành công, thoát 0, và để nguyên <code>/srv/app/s1/index.html</code> — đúng cái tệp nginx đang phục vụ. Bản mới của bạn nằm sâu thêm một tầng, chẳng ai dùng. Chọn một quy ước và không bao giờ đổi: <strong>nguồn và đích đều kết thúc bằng <code>/</code></strong>, như mọi lệnh trong khoá này.</p>

<h3>Bảng cờ, kèm những gì mỗi cờ đã làm trong phòng thí nghiệm</h3>
<table>
<tr><th>Cờ</th><th>Làm gì</th><th>Đo được / thấy được</th></tr>
<tr><td><code>-a</code></td><td>Archive = <code>-rlptgoD</code>: đệ quy, giữ liên kết mềm, quyền, thời gian, nhóm, chủ, tệp thiết bị</td><td>Nền của mọi lệnh deploy ở đây</td></tr>
<tr><td><code>-z</code></td><td>Nén trên đường truyền</td><td>App 627 tệp: 2.334.579 → 649.089 byte (ít hơn 3,6 lần). Một tệp <code>.gz</code> 3 MB: 3.019.243 → 3.019.971 byte — <em>NHIỀU hơn</em> 728 byte</td></tr>
<tr><td><code>--delete</code></td><td>Xoá ở đích mọi thứ nguồn không có</td><td>Liệt kê <code>tai-len/quan-trong.jpg</code> và <code>.env</code> để xoá, thoát 0</td></tr>
<tr><td><code>-n</code> / <code>--dry-run</code></td><td>In kế hoạch, không đổi gì</td><td>Miễn phí. Chạy trước mọi lần deploy đầu và sau mọi lần sửa lệnh</td></tr>
<tr><td><code>-i</code> / <code>--itemize-changes</code></td><td>Mỗi mục một mã: <code>&lt;</code> gửi đi, <code>f</code>/<code>d</code> tệp/thư mục, <code>c</code>/<code>s</code>/<code>t</code> nội dung/cỡ/giờ, <code>*deleting</code></td><td>Biến lần chạy thử thành thứ đọc được từng dòng</td></tr>
<tr><td><code>--partial</code> / <code>--partial-dir=DIR</code></td><td>Giữ tệp chuyển dở để lần sau đi tiếp</td><td>Bài 2.5: tệp 8 MB đi tiếp mất 8,5 s thay vì 17,0 s</td></tr>
<tr><td><code>-c</code> / <code>--checksum</code></td><td>So NỘI DUNG thay vì cỡ + giờ sửa</td><td>Cùng cỡ, cùng giây, khác nội dung: không <code>-c</code> thì bỏ qua, có <code>-c</code> thì gửi</td></tr>
<tr><td><code>--chown</code> / <code>--chmod</code></td><td>Đặt chủ / quyền ở phía đích</td><td><code>--chmod=F640</code> chạy được với người dùng thường; <code>--chown=root:root</code> bị <em>LẶNG LẼ bỏ qua</em> — thoát 0, chủ vẫn là <code>deploy</code></td></tr>
</table>
<div class="out"># index.html doi v1 → v9: CUNG co, CUNG giay sua
$ rsync -an -i dist/ vps:/srv/app/web/
$ rsync -an -i --checksum dist/ vps:/srv/app/web/
&lt;fc........ index.html</div>
<p>Lệnh đầu tiên không in gì cả: "phép so nhanh" mặc định của rsync thấy cùng cỡ, cùng giờ sửa và kết luận tệp không đổi. Điều đó ổn với một bản dựng luôn ghi lại dấu thời gian, và SAI sau <code>git clone</code>, một lần checkout trong CI hay một lệnh <code>touch -d</code> — những thứ đều có thể cho ra một tệp đổi nội dung mà giờ không đổi. <code>-c</code> đọc hết mọi tệp ở cả hai phía để băm, nên tốn đĩa với cây lớn — dùng khi đúng quan trọng hơn nhanh, như lần đồng bộ cuối trước một bản phát hành.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — danh sách loại trừ là MỘT PHẦN của tạo tác, và kho mã này có ba tai nạn thật để chứng minh.</strong> Ngày 05/08/2026, một luật loại trừ viết là <code>frontend/.next/</code> không khớp thư mục dựng thử tên <code>.next-dev-isolated</code>, và rsync chở 245 MB của nó lên VPS rồi vào luôn build context của Docker. Suốt nhiều tuần, <code>secrets.h</code> — khoá Wi-Fi và khoá API của firmware con robot — theo mỗi lần deploy lên máy chủ vì nó không khớp mẫu <code>.env*</code>. Và <code>deploy.sh</code> mang một lời cảnh báo: đừng bao giờ chèn dòng <code>#</code> vào giữa lệnh rsync nối bằng dấu gạch chéo ngược, vì chú thích sẽ nuốt mọi cờ phía sau nó, kể cả <code>--exclude='.env'</code>, và bí mật production sẽ bị chở đi. Đọc danh sách loại trừ kỹ như đọc mã, và đọc output chạy thử sau MỖI lần sửa nó.</div>

<h3>Trên macOS, và trên Windows/WSL</h3>
${slide('dv-02', 8, 'Mac có openrsync, Windows không có rsync')}
<p>Cái máy bạn deploy <em>TỪ</em> đó có thể không có con rsync mà bài này mô tả. Đo ngày 29/09/2026 từ một chiếc Mac M1 (macOS 27) vào VPS thí nghiệm, từng cờ một:</p>
<div class="out">$ /usr/bin/rsync --version | head -2
openrsync: protocol version 29
rsync version 2.6.9 compatible
$ rsync -a --info=progress2 -e "$E" macdist/ deploy@127.0.0.1:/srv/app/mac/
rsync: unrecognized option &#96;--info=progress2'
$ rsync -ai --delete "--filter=protect tai-len/" -e "$E" macdist/ deploy@127.0.0.1:/srv/app/mac/
.d..tp... ./
&lt;f+++++++ index.html
cd+++++++ assets/
&lt;f+++++++ assets/a.css</div>
<ul>
<li><strong>macOS</strong> mang theo <strong>openrsync</strong>, một bản cài đặt khác hẳn. <code>-a -z -n -i --delete --checksum --partial --partial-dir --link-dest --filter --max-delete --timeout</code> đều chạy; <code>--info=progress2</code>, <code>--append-verify</code> và <code>--chown</code> hỏng với <code>unrecognized option</code>; mã itemize của nó dài 9 ký tự thay vì 11, và <code>--stats</code> của nó in <code>Unmatched data</code> ở chỗ GNU rsync in <code>Literal data</code> — nên script nào phân tích một trong hai thứ đó sẽ vỡ. Bộ lọc <code>protect</code> thì vẫn giữ được <code>tai-len/a.jpg</code>. Với script deploy, hãy cài GNU rsync (<code>brew install rsync</code>) hoặc chạy script bên trong Linux.</li>
<li><strong>Ubuntu 24.04</strong> có GNU rsync 3.2.7 và <strong>Fedora 44</strong> có 3.4.4 — mọi cờ trong bài chạy y hệt nhau trên cả hai.</li>
<li><strong>Windows</strong> hoàn toàn không có rsync. Git for Windows mang theo <code>git</code> và <code>ssh</code>, không có rsync; hãy deploy từ WSL2, nơi GNU rsync chỉ cách một lệnh <code>apt install</code>. Tệp nằm dưới <code>/mnt/c/…</code> nhìn từ WSL có quyền <code>777</code>, nên thêm <code>--chmod=D755,F644</code>, không thì mọi thứ trên máy chủ thành ai-cũng-ghi-được.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối trước buổi bảo vệ SWP391, nhóm deploy front end bằng rsync vào <code>/srv/app/web</code> trên VPS — chính thư mục đang giữ ảnh người dùng trong <code>tai-len/</code> và tệp <code>.env</code> của production. Bạn phải đưa bản dựng mới lên mà không mất một tấm ảnh nào. Dựng VPS thí nghiệm một lần (dùng lại cho cả chương):</p>
<pre><code class="language-bash">mkdir -p ~/dv-lab &amp;&amp; cd ~/dv-lab
ssh-keygen -t ed25519 -N "" -f ./khoa -q      # khoá CHỈ dành cho phòng thí nghiệm
cat &gt; Dockerfile &lt;&lt;'EOF'
FROM ubuntu:24.04
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends openssh-server rsync git \\
 &amp;&amp; mkdir -p /run/sshd &amp;&amp; useradd -m -s /bin/bash deploy \\
 &amp;&amp; mkdir -p /srv/app /home/deploy/.ssh &amp;&amp; chown deploy /srv/app
COPY khoa.pub /home/deploy/.ssh/authorized_keys
RUN chown -R deploy /home/deploy/.ssh &amp;&amp; chmod 700 /home/deploy/.ssh
CMD ["/usr/sbin/sshd", "-D", "-e"]
EOF
cat &gt; cfg &lt;&lt;EOF
Host vps
    HostName 127.0.0.1
    Port 2222
    User deploy
    IdentityFile $PWD/khoa
    UserKnownHostsFile $PWD/known_hosts
    StrictHostKeyChecking accept-new
EOF
docker build -t vps-thu . &amp;&amp; docker run -d --name vps-thu -p 127.0.0.1:2222:22 vps-thu
export RSYNC_RSH="ssh -F $PWD/cfg" GIT_SSH_COMMAND="ssh -F $PWD/cfg"
ssh -F cfg vps hostname</code></pre>
<ol>
<li>Trên VPS tạo <code>/srv/app/web/tai-len/anh.jpg</code> và <code>/srv/app/web/.env</code>; ở máy bạn tạo <code>dist/index.html</code> và <code>dist/assets/app.css</code>.</li>
<li>Chạy <code>rsync -ain --delete dist/ vps:/srv/app/web/</code> và đếm những dòng <code>*deleting</code> mà bạn không hề muốn.</li>
<li>Thêm <code>--filter='protect tai-len/'</code> và <code>--filter='protect .env'</code>, chạy thử lại tới khi không còn dòng <code>*deleting</code> nào, rồi chạy thật.</li>
<li>Đổi một dòng trong <code>index.html</code> rồi chạy lại với <code>-i</code>: chỉ được hiện đúng <code>index.html</code>. Sau đó thử <code>rsync -a dist vps:/srv/app/web/</code> (không dấu /) và tìm xem tệp của bạn đã đi đâu.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>anh.jpg</code> và <code>.env</code> vẫn còn trên VPS sau lần chạy thật, lần chạy thử cuối không in dòng <code>*deleting</code> nào, và bạn chỉ ra được thư mục lạc <code>web/dist/</code> do thiếu dấu / sinh ra (rồi xoá nó).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Delta transfer (truyền phần chênh lệch)</span><span class="v">Chỉ gửi những khối khác nhau giữa bản cũ ở đích và bản mới ở nguồn.</span></div>
  <div class="kv"><span class="k">Rolling checksum (mã kiểm tra cuộn)</span><span class="v">Mã kiểm tra tính lại được rất rẻ khi cửa sổ trượt một byte — nhờ đó rsync tìm ra khối đã dời chỗ.</span></div>
  <div class="kv"><span class="k">Literal data (dữ liệu nguyên bản)</span><span class="v">Phần byte rsync buộc phải gửi thật vì không khớp khối nào ở đích.</span></div>
  <div class="kv"><span class="k">Dry run (chạy thử)</span><span class="v"><code>-n</code>: in ra việc sẽ làm, không đổi gì.</span></div>
  <div class="kv"><span class="k">Itemize changes (liệt kê thay đổi)</span><span class="v"><code>-i</code>: mỗi mục một mã — chiều đi, loại, thuộc tính nào đổi, hoặc <code>*deleting</code>.</span></div>
  <div class="kv"><span class="k">Mirror (bản gương)</span><span class="v">Đích giống hệt nguồn, kể cả việc xoá — việc của <code>--delete</code>.</span></div>
  <div class="kv"><span class="k">Protect filter (luật bảo vệ)</span><span class="v">Luật ở phía nhận, nêu những đường dẫn không bao giờ được xoá.</span></div>
  <div class="kv"><span class="k">Hard link (liên kết cứng)</span><span class="v">Hai cái tên cho cùng một dữ liệu trên đĩa; <code>--link-dest</code> dùng nó để tệp không đổi không tốn thêm chỗ ở mỗi bản phát hành.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>rsync chỉ gửi phần đã đổi, kể cả khi mọi byte dời chỗ: chèn 100 byte vào tệp 20 MB tốn 18 KB — nhưng lần đồng bộ đầu và tệp đã nén thì chẳng được lợi gì.</li>
<li>Dấu / cuối ở NGUỒN nghĩa là "nội dung của"; thiếu nó bạn có thêm một tầng thư mục mà không lỗi nào báo.</li>
<li><code>--delete</code> xoá mọi thứ nguồn không có, kể cả ảnh tải lên và <code>.env</code>, rồi thoát 0 — chạy thử với <code>-n -i</code> trước và <code>protect</code> những gì máy chủ tự tạo.</li>
<li>rsync nguyên tử theo TỪNG TỆP, không bao giờ theo lần deploy: chép vào thư mục bản phát hành mới rồi mới tráo symlink.</li>
<li><code>-z</code> có lời với chữ (3,6 lần ở đây) và vô ích với tệp đã nén; <code>-c</code> bắt được thay đổi cùng cỡ cùng giờ mà phép so nhanh bỏ sót.</li>
<li>macOS mang openrsync thiếu cờ, Windows không có rsync — viết script deploy cho GNU rsync và chạy trong Linux hoặc WSL.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Thuật toán rsync — Tridgell &amp; Mackerras, 1996</span><span class="lc-sub">rsync.samba.org/tech_report — tám trang mô tả cái mã kiểm tra kiểu cuộn đã sinh ra kết quả 100 byte ở trên. Dễ đọc một cách khác thường so với một báo cáo kỹ thuật.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — mục FILTER RULES và các biến thể của --delete</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — <code>protect</code>, và khác biệt giữa <code>--delete-before</code>, <code>--delete-during</code> và <code>--delete-after</code>.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — rename, tệp tạm và ghi nguyên tử</span><span class="lc-sub">/courses/linux-bash/learn${REF} — vì sao ghi-rồi-đổi-tên là cách chuẩn để cập nhật một tệp an toàn, và đó chính là thứ rsync làm với từng tệp.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — phục vụ từ một thư mục đang bị thay thế</span><span class="lc-sub">/courses/nginx/learn${REF} — máy chủ web làm gì với một tệp đang đổi ngay dưới chân nó, và vì sao cú tráo symlink là an toàn dưới góc nhìn của nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — Deploying with a git push|||2.2 — Deploy bằng một lệnh git push',
      slug: 'deploy-2-2-git-push-de-deploy',
      type: 'LESSON',
      description: 'Một kho trần trên máy chủ cộng mười lăm dòng hook, và lệnh deploy trở thành git push. Đo thật từ đầu tới cuối — kèm ba chỗ mà cách này lặng lẽ khác hẳn rsync.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Deploying with a git push</h2>
<p class="lead">Lesson 0.1 measured the reason to prefer git over rsync: a push carries only committed work, so the half-written file in your editor cannot reach production. This lesson turns that into a working deploy — a bare repository on the server, and a hook that runs when you push to it.</p>

<h3>The bare repository</h3>
${slide('dv-02', 9, 'git push vào kho trần — hook làm phần còn lại')}
<pre><code><span class="tok-comment"># tren MAY CHU</span>
git init --bare /srv/app/kho.git

<span class="tok-comment"># tren MAY BAN</span>
git remote add vps ssh://trienkhai@203.0.113.10/srv/app/kho.git
git push vps master</code></pre>
<p>A bare repository has no working tree — just the object database. It is a place to push to, and nothing runs from it. Everything below happens because of one hook file.</p>

<h3>The hook</h3>
${slide('dv-02', 10, 'Hook post-receive, từng dòng, và output thật')}
<pre><code><span class="tok-comment">#!/bin/bash — /srv/app/kho.git/hooks/post-receive</span>
set -euo pipefail
DICH=/srv/app
while read -r cu moi ref; do
  [ "\$ref" = "refs/heads/master" ] || { echo "  [hook] bo qua \$ref"; continue; }

  BAN="\$DICH/phat-hanh/\$(date -u +%Y-%m-%d-%H%M%S)-\$(echo "\$moi" | cut -c1-7)"
  mkdir -p "\$BAN"
  git --work-tree="\$BAN" --git-dir=/srv/app/kho.git checkout -f master
  echo "  [hook] da giai nen ban \$(basename "\$BAN")"

  ln -sfn "\$BAN" "\$DICH/ht.moi" &amp;&amp; mv -T "\$DICH/ht.moi" "\$DICH/hien-tai"
  echo "  [hook] hien-tai → \$(basename "\$(readlink "\$DICH/hien-tai")")"
done</code></pre>
<p>Run against a real push:</p>
<div class="out">$ git push vps master

  [hook] da giai nen ban 2026-08-23-202418-0e8117e
  [hook] hien-tai → 2026-08-23-202418-0e8117e</div>
<div class="callout ok"><strong>That is a complete deploy in fifteen lines.</strong> It produces a timestamped release directory named after the commit (Lesson 1.4), checks the commit out into it, and swaps the symlink atomically with <code>mv -T</code> (Lesson 0.4). Anything printed by the hook is streamed back to your terminal prefixed with <code>remote:</code>, so the deploy log appears where you ran the command.</div>

<h3>Four details in that hook that are not decoration</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">It reads from stdin, in a loop</span><span class="lz-d">A <code>post-receive</code> hook is given one line per updated ref — <code>&lt;old&gt; &lt;new&gt; &lt;ref&gt;</code>. A single push can update several refs, so it is a loop, not a single read. The old and new hashes are also exactly what you need to compute what changed.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">It filters by branch</span><span class="lz-d">Without the <code>refs/heads/master</code> check, pushing <em>any</em> branch or tag deploys it. That is how a feature branch reaches production: someone typed <code>git push vps</code> without naming a branch and the default pushed everything matching.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>--work-tree</code> plus <code>checkout -f</code></span><span class="lz-d">This is how a bare repository writes files somewhere. <code>-f</code> discards whatever is in the target directory, which is safe here only because the directory is brand new. Pointing this at a shared directory would silently overwrite local changes.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Swap last, and separately</span><span class="lz-d">Extract fully, then swap. If <code>checkout</code> fails halfway the symlink still points at the previous release and the site is unaffected — the same argument as Lesson 2.1, arriving by a different transport.</span></div>
</div>

<h3>Where this differs from rsync, quietly</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Only committed work ships</span><span class="v">The advantage, measured in Lesson 0.1. It is also a constraint: you cannot deploy an experiment without committing it, which people work around by committing junk to master. Consider that a feature.</span></div>
  <div class="kv"><span class="k">The history lives on the server</span><span class="v">Lesson 0.1 measured 556 KB of bare repository against 176 KB of working tree, and it grows forever. On a large repository with binary assets that gap is the deciding factor.</span></div>
  <div class="kv"><span class="k">Untracked files simply do not exist</span><span class="v">Anything in <code>.gitignore</code> is not in the artifact — which is what you want for <code>node_modules</code> and <code>.env</code>, and is a problem if your build produces files you never committed. The hook has to build them, on the server.</span></div>
  <div class="kv"><span class="k">The hook runs as the SSH user</span><span class="v">Whatever ran <code>git push</code> decides what the hook can do. It is worth pairing with the forced-command key from Lesson 0.2 — although a hook is already a kind of forced command, since a push can only trigger the hook.</span></div>
</div>
<div class="pitfall"><strong>Trap — a hook that fails does not fail the push, unless you make it.</strong> <code>post-receive</code> runs <em>after</em> the objects have been accepted; git has already stored them and the push reports success whatever the hook does. A non-zero exit produces nothing on the client at all — measured on git 2.43: no warning, no error line, exit code 0; the only trace is whatever the hook itself printed. So a deploy that broke halfway through leaves you with a push that looked fine — the <code>set -euo pipefail</code> at the top of the hook stops the damage spreading, but it cannot undo the push. If you need to <em>reject</em> a push, that is <code>pre-receive</code>, which runs before anything is stored and whose exit code does decide the outcome.</div>

<h3>Adding the build and the verification</h3>
<pre><code>  <span class="tok-comment"># ... sau khi checkout, TRUOC khi trao symlink</span>
  cd "\$BAN"
  npm ci --omit=dev --no-audit          <span class="tok-comment"># Bai 1.3: ci, khong phai install</span>
  npm run build

  ln -sfn /srv/app/chung/.env    "\$BAN/.env"        <span class="tok-comment"># Chuong 4</span>
  ln -sfn /srv/app/chung/tai-len "\$BAN/tai-len"     <span class="tok-comment"># Bai 1.1, loai 3</span>

  ln -sfn "\$BAN" "\$DICH/ht.moi" &amp;&amp; mv -T "\$DICH/ht.moi" "\$DICH/hien-tai"
  systemctl --user restart app                       <span class="tok-comment"># Chuong 3</span>

  sleep 2
  MA=\$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/health)
  [ "\$MA" = "200" ] || { echo "  [hook] KIEM HONG (\$MA) — dang lui lai" &gt;&amp;2; exit 1; }</code></pre>
<div class="note-ct">Note the order: build first, then link the shared paths in, then swap, then restart, then verify. Every step before the swap can fail without affecting the running site. Everything after it is committed — which is why the verification at the end has to be paired with an actual rollback, not just an <code>exit 1</code>. Chapter 6 writes that part.</div>

<h3>When to choose this over rsync</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Choose git push when the artifact is source</span><span class="lz-lnote">Interpreted languages, a modest repository, one or two servers. The committed-only guarantee is worth more than the disk it costs, and the whole deploy fits in one hook you can read.</span></div>
  <div class="lz-layer"><span class="lz-lname">Choose rsync when the artifact is built</span><span class="lz-lnote">Build on a machine that has the CPU for it, ship the result. Also the answer when the repository is large, or when the server should not have the history at all.</span></div>
  <div class="lz-layer"><span class="lz-lname">Choose a registry when the artifact is an image</span><span class="lz-lnote">The runtime is part of what you are shipping, or several servers pull the same thing. Lesson 2.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">Do not choose "git pull on the server"</span><span class="lz-lnote">A working clone on the server can develop local changes — an edited config, a hotfix, a merge conflict — and then a deploy fails with a message about uncommitted work on a machine nobody was editing. A bare repository plus a checkout into a fresh directory has none of that surface.</span></div>
</div>
<h3>Committed work only, measured with a half-typed file</h3>
${slide('dv-02', 11, 'Chỉ thứ ĐÃ COMMIT mới đi qua git push')}
<p>The same working tree, two transports. <code>src/app.js</code> has an uncommitted edit with a <code>TODO</code> in it, and <code>src/dat-lich.js</code> is a new file with half a function typed — exactly what a teammate's editor looks like mid-thought:</p>
<div class="out">$ git status --short
 M src/app.js
?? src/dat-lich.js
$ rsync -az --exclude=.git ./ vps:/srv/app/rs/    # kieu deploy.sh cu
$ git push vps master                            # kieu deploy-nha.sh
  Everything up-to-date
$ ssh vps "ls /srv/app/rs/src /srv/app/hien-tai/src; grep -c TODO …"
rs/src:        app.js dat-lich.js
hien-tai/src:  app.js
/srv/app/rs/src/app.js:1
/srv/app/hien-tai/src/app.js:0</div>
<p>rsync shipped both unfinished files. git shipped neither, and said so: <code>Everything up-to-date</code> — there was no new commit, so there was nothing to send and the hook did not even run. This is the whole argument of this lesson in eleven lines.</p>
<div class="callout warn"><strong>This repository learned it the expensive way.</strong> On 13/08/2026 the old <code>deploy.sh</code>, which rsyncs the working tree to the VPS and builds there, three times shipped files that another editing session was halfway through — a function not yet written, a variable left over — and the build on the VPS failed although the committed code was clean. <code>deploy-nha.sh</code> was written to make that impossible: it takes the code with git, never from the disk. Its first version ran <code>git archive HEAD</code>, which for this repository is 272 MB on every deploy; the current one does a <code>git push</code> into a bare repository on the home build machine — about 150 MB the first time, then a few tens of kilobytes. The deliberate price: an uncommitted change never reaches production, and the script asks <code>[y/N]</code> when the tree is dirty so nobody is surprised.</div>

<h3>A failing hook, measured — and the hook that can say no</h3>
${slide('dv-02', 12, 'post-receive hỏng, git push vẫn xanh; pre-receive mới chặn được')}
<div class="out"># hooks/post-receive: echo "build HONG" &gt;&amp;2; exit 1
$ git push thu master; echo "exit=$?"
remote:   [post-receive] build HONG
To ssh://vps/srv/app/kho2.git
 * [new branch]      master -&gt; master
exit=0

# hooks/pre-receive: tu choi neu src/app.js con TODO
$ git push thu master; echo "exit=$?"
remote:   [pre-receive] TU CHOI: con TODO trong src/app.js
To ssh://vps/srv/app/kho2.git
 ! [remote rejected] master -&gt; master (pre-receive hook declined)
error: failed to push some refs to 'ssh://vps/srv/app/kho2.git'
exit=1</div>
<table>
<tr><th>Hook</th><th>Runs</th><th>Input</th><th>Non-zero exit means</th></tr>
<tr><td><code>pre-receive</code></td><td>once, BEFORE any ref is updated</td><td>every <code>&lt;old&gt; &lt;new&gt; &lt;ref&gt;</code> on stdin</td><td>the whole push is rejected, nothing stored</td></tr>
<tr><td><code>update</code></td><td>once per ref, before that ref moves</td><td>three arguments</td><td>that one ref is rejected</td></tr>
<tr><td><code>post-receive</code></td><td>once, AFTER every ref is updated</td><td>same stdin as pre-receive</td><td>nothing — the push already succeeded</td></tr>
</table>
<p>The practical split: anything you can check <em>before</em> accepting the code — branch name, a forbidden <code>TODO</code>, a syntax check of a config file — belongs in <code>pre-receive</code>, where a failure keeps the bad commit out entirely. Building and swapping belong in <code>post-receive</code> with <code>set -euo pipefail</code>, so a failure stops before the swap and the old release keeps serving. And because <code>exit=0</code> proves nothing, the person pushing must read the <code>remote:</code> lines — or, better, the deploy command ends with a <code>curl</code> against the new release.</p>
<div class="pitfall co-tieu-de"><strong>Trap — a hook without the execute bit is skipped with a hint, not an error.</strong> Measured: a <code>post-receive</code> file copied onto the server without <code>chmod +x</code> produced <code>hint: The 'hooks/post-receive' hook was ignored because it's not set as executable.</code>, the push printed <code>* [new branch]</code> and exited 0, and nothing was deployed. The hint is easy to lose among other output, and it can be silenced by <code>advice.ignoredHook false</code>. After installing a hook, <code>ls -l hooks/post-receive</code> must show an <code>x</code>.</div>

<h3>Running it step by step on the lab VPS</h3>
<pre><code class="language-bash"># 1. may chu: kho tran + thu muc ban phat hanh
ssh -F cfg vps 'git init -q --bare /srv/app/kho.git &amp;&amp; mkdir -p /srv/app/phat-hanh'

# 2. dat hook (12 dong o tren, luu thanh ./post-receive voi ket thuc dong LF)
scp -F cfg post-receive vps:/srv/app/kho.git/hooks/
ssh -F cfg vps 'chmod +x /srv/app/kho.git/hooks/post-receive'

# 3. laptop: remote + push
git remote add vps vps:/srv/app/kho.git
git push vps master
ssh -F cfg vps 'readlink /srv/app/hien-tai; ls /srv/app/hien-tai/'</code></pre>
<div class="out">remote: Already on 'master'
remote:   [hook] da giai nen ban 2026-09-29-013104-3949c86
remote:   [hook] hien-tai → 2026-09-29-013104-3949c86
To vps:/srv/app/kho.git
   7c4259e..3949c86  master -&gt; master
index.html
/srv/app/phat-hanh/2026-09-29-013104-3949c86</div>
<p>Run from the Mac against the lab VPS of Lesson 2.1. The first line, <code>Already on 'master'</code>, is <code>git checkout</code> talking on stderr — harmless, and a good reminder that everything the hook prints, from any command, comes back to your terminal. The release directory carries the commit it was built from, which is what makes "what is running?" answerable with one <code>readlink</code>.</p>

<h3>On Windows: a hook saved with CRLF never runs</h3>
${slide('dv-02', 13, 'Hook mang CRLF từ Windows thì không bao giờ chạy')}
<div class="out">$ od -c hooks/post-receive | head -1
0000000   #   !   /   b   i   n   /   b   a   s   h  \\r  \\n   e   c   h
$ git push crlf master; echo "exit=$?"
fatal: cannot exec 'hooks/post-receive': No such file or directory
To ssh://vps/srv/app/kho3.git
 * [new branch]      master -&gt; master
exit=0</div>
<p>A teammate writes the hook in a Windows editor, which saves lines ending in <code>\\r\\n</code>. The first line now names an interpreter called <code>/bin/bash\\r</code>, which does not exist, so the kernel reports "No such file or directory" — about a file that is plainly there. The push still succeeds and nothing deploys. Three fixes, from best to last resort: tell the repository that scripts are always LF (<code>printf '*.sh text eol=lf\\nhooks/* text eol=lf\\n' &gt;&gt; .gitattributes</code>); on Windows set <code>git config --global core.autocrlf input</code> so git never converts LF to CRLF on checkout; and on a file that is already broken, <code>sed -i 's/\\r$//' hooks/post-receive</code>. <code>file hooks/post-receive</code> says "with CRLF line terminators" while it is still broken. Git for Windows gives you <code>git</code> and <code>ssh</code>, so the push itself works from PowerShell; it is the files you create there that need watching.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your group wants "deploy = <code>git push</code>" for its static site. On the lab VPS from Lesson 2.1, install a bare repository and the hook, then prove two things to a sceptical teammate: an uncommitted file never ships, and a broken <code>post-receive</code> does not turn the push red.</p><ol>
<li>Create <code>/srv/app/kho.git</code> and <code>/srv/app/phat-hanh</code>, install the 12-line hook with <code>scp</code>, and <code>chmod +x</code> it.</li>
<li>In a local repository (<code>git init -b master</code>), commit an <code>index.html</code>, add the remote and push — you should see two <code>[hook]</code> lines.</li>
<li>Create an uncommitted file and push again: read <code>Everything up-to-date</code>, then confirm with <code>ssh -F cfg vps ls /srv/app/hien-tai/</code> that the file is not there.</li>
<li>Append <code>exit 1</code> to the hook, commit a change, push, and record the exit code. Then add a <code>pre-receive</code> that rejects any commit whose <code>index.html</code> contains <code>TODO</code>, and push such a commit.</li>
</ol>
<p><strong>Done when:</strong> <code>readlink /srv/app/hien-tai</code> ends in the short hash of your latest pushed commit, and you have both outputs side by side — <code>exit=0</code> for the failing <code>post-receive</code>, and <code>[remote rejected] … (pre-receive hook declined)</code> with <code>exit=1</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bare repository</span><span class="v">A git repository with only the object database and no working tree — somewhere to push to.</span></div>
  <div class="kv"><span class="k">Hook</span><span class="v">An executable file in <code>hooks/</code> that git runs at a fixed moment of an operation.</span></div>
  <div class="kv"><span class="k">post-receive</span><span class="v">Runs after the push has been stored; its exit code changes nothing for the pusher.</span></div>
  <div class="kv"><span class="k">pre-receive</span><span class="v">Runs before anything is stored; a non-zero exit rejects the whole push.</span></div>
  <div class="kv"><span class="k">Ref</span><span class="v">A name pointing at a commit, such as <code>refs/heads/master</code>; the hook filters on it.</span></div>
  <div class="kv"><span class="k">Working tree</span><span class="v">The checked-out files you edit — exactly what rsync reads and a push never does.</span></div>
  <div class="kv"><span class="k">CRLF / LF</span><span class="v">Windows / Unix line endings; a script with CRLF fails with "No such file or directory".</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A bare repository plus a <code>post-receive</code> hook turns <code>git push</code> into a complete deploy into a fresh, commit-named release directory.</li>
<li>Only committed work crosses a push — measured: the half-typed file rsync shipped never reached the server through git.</li>
<li><code>post-receive</code> runs after the push is stored, so its failure is invisible in the exit code; <code>pre-receive</code> is the hook that can reject.</li>
<li>A hook without the execute bit is skipped with a hint; a hook with CRLF endings fails with "No such file" — and the push is green in both cases.</li>
<li>Filter on the branch, extract into a new directory, swap last, and verify with an HTTP request, not with <code>exit=0</code>.</li>
<li>This repository moved from rsyncing the working tree to pushing commits after the working tree shipped half-typed files three times in one day.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">githooks(5) — post-receive, pre-receive, update</span><span class="lc-sub">git-scm.com/docs/githooks — what each hook receives on stdin and whether its exit code can reject the push.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-checkout(1) with --work-tree</span><span class="lc-sub">git-scm.com/docs/git-checkout — writing a commit into an arbitrary directory from a bare repository, which is the mechanism the hook depends on.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-push(1) — the push.default setting</span><span class="lc-sub">git-scm.com/docs/git-push — why a bare <code>git push</code> can send more branches than you intended, which is what the branch filter defends against.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — bare repositories, refs and hooks</span><span class="lc-sub">/courses/git/learn${REF} — what a bare repository actually contains, and where hooks live.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Deploy bằng một lệnh git push</h2>
<p class="lead">Bài 0.1 đã đo lý do nên chọn git thay vì rsync: một lần push chỉ chở theo phần việc ĐÃ COMMIT, nên cái tệp viết dở trong trình soạn thảo của bạn không thể lên tới production. Bài này biến điều đó thành một quy trình deploy chạy được — một kho trần trên máy chủ, và một cái hook chạy khi bạn push vào nó.</p>

<h3>Kho trần</h3>
${slide('dv-02', 9, 'git push vào kho trần — hook làm phần còn lại')}
<pre><code><span class="tok-comment"># tren MAY CHU</span>
git init --bare /srv/app/kho.git

<span class="tok-comment"># tren MAY BAN</span>
git remote add vps ssh://trienkhai@203.0.113.10/srv/app/kho.git
git push vps master</code></pre>
<p>Một kho trần không có cây làm việc — chỉ có cơ sở dữ liệu đối tượng. Nó là một chỗ để ĐẨY VÀO, và không có gì chạy từ đó. Mọi thứ bên dưới xảy ra là nhờ MỘT tệp hook.</p>

<h3>Cái hook</h3>
${slide('dv-02', 10, 'Hook post-receive, từng dòng, và output thật')}
<pre><code><span class="tok-comment">#!/bin/bash — /srv/app/kho.git/hooks/post-receive</span>
set -euo pipefail
DICH=/srv/app
while read -r cu moi ref; do
  [ "\$ref" = "refs/heads/master" ] || { echo "  [hook] bo qua \$ref"; continue; }

  BAN="\$DICH/phat-hanh/\$(date -u +%Y-%m-%d-%H%M%S)-\$(echo "\$moi" | cut -c1-7)"
  mkdir -p "\$BAN"
  git --work-tree="\$BAN" --git-dir=/srv/app/kho.git checkout -f master
  echo "  [hook] da giai nen ban \$(basename "\$BAN")"

  ln -sfn "\$BAN" "\$DICH/ht.moi" &amp;&amp; mv -T "\$DICH/ht.moi" "\$DICH/hien-tai"
  echo "  [hook] hien-tai → \$(basename "\$(readlink "\$DICH/hien-tai")")"
done</code></pre>
<p>Chạy thật với một lệnh push:</p>
<div class="out">$ git push vps master

  [hook] da giai nen ban 2026-08-23-202418-0e8117e
  [hook] hien-tai → 2026-08-23-202418-0e8117e</div>
<div class="callout ok"><strong>Đó là một quy trình deploy hoàn chỉnh gói trong mười lăm dòng.</strong> Nó tạo ra một thư mục bản phát hành có dấu thời gian và mang tên commit (Bài 1.4), giải nén commit đó vào trong, rồi tráo symlink một cách nguyên tử bằng <code>mv -T</code> (Bài 0.4). Bất cứ thứ gì hook in ra đều được truyền ngược về terminal của bạn kèm tiền tố <code>remote:</code>, nên log deploy hiện ra ngay chỗ bạn gõ lệnh.</div>

<h3>Bốn chi tiết trong cái hook đó không phải đồ trang trí</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó đọc từ stdin, trong một vòng lặp</span><span class="lz-d">Một hook <code>post-receive</code> được đưa MỘT DÒNG cho mỗi ref được cập nhật — <code>&lt;cu&gt; &lt;moi&gt; &lt;ref&gt;</code>. Một lần push có thể cập nhật nhiều ref, nên nó là vòng lặp chứ không phải một lần đọc. Hai mã băm cũ và mới cũng chính là thứ bạn cần để tính ra cái gì đã thay đổi.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó LỌC theo nhánh</span><span class="lz-d">Thiếu phép kiểm <code>refs/heads/master</code> thì push <em>BẤT KỲ</em> nhánh hay tag nào cũng deploy nó. Đó là cách một nhánh tính năng lên tới production: có người gõ <code>git push vps</code> mà không nêu tên nhánh và cấu hình mặc định đẩy đi mọi thứ khớp.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>--work-tree</code> cộng <code>checkout -f</code></span><span class="lz-d">Đây là cách một kho TRẦN ghi tệp ra một chỗ nào đó. Cờ <code>-f</code> vứt bỏ bất cứ thứ gì đang có trong thư mục đích, và ở đây nó an toàn CHỈ VÌ thư mục đó là hoàn toàn mới. Trỏ cái này vào một thư mục dùng chung là âm thầm ghi đè lên những thay đổi tại chỗ.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tráo SAU CÙNG, và tách riêng</span><span class="lz-d">Giải nén cho xong, rồi mới tráo. Nếu <code>checkout</code> hỏng giữa chừng thì symlink vẫn trỏ vào bản phát hành trước và website không hề bị ảnh hưởng — đúng cái lý lẽ ở Bài 2.1, chỉ là tới bằng một đường vận chuyển khác.</span></div>
</div>

<h3>Chỗ nó khác rsync, một cách lặng lẽ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chỉ phần việc ĐÃ COMMIT đi qua</span><span class="v">Đó là ưu điểm, đã đo ở Bài 0.1. Nó cũng là một RÀNG BUỘC: bạn không deploy được một thử nghiệm mà không commit nó, và người ta lách chuyện đó bằng cách commit rác vào master. Hãy coi ràng buộc đó là một tính năng.</span></div>
  <div class="kv"><span class="k">Lịch sử sống trên máy chủ</span><span class="v">Bài 0.1 đo được 556 KB kho trần so với 176 KB cây làm việc, và nó tăng MÃI MÃI. Với một kho lớn có tài nguyên nhị phân thì khoảng cách đó là yếu tố quyết định.</span></div>
  <div class="kv"><span class="k">Tệp không được theo dõi thì đơn giản là KHÔNG tồn tại</span><span class="v">Mọi thứ trong <code>.gitignore</code> đều không nằm trong tạo tác — đó là thứ bạn muốn với <code>node_modules</code> và <code>.env</code>, và là VẤN ĐỀ nếu bước dựng của bạn sinh ra những tệp bạn chưa từng commit. Cái hook phải tự dựng chúng, trên máy chủ.</span></div>
  <div class="kv"><span class="k">Hook chạy dưới quyền người dùng SSH</span><span class="v">Ai chạy <code>git push</code> thì người đó quyết định hook làm được gì. Đáng ghép nó với cái khoá forced-command ở Bài 0.2 — dù bản thân một cái hook đã là một dạng forced command rồi, vì một lần push chỉ kích hoạt được đúng cái hook.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — một hook hỏng KHÔNG làm lần push hỏng theo, trừ khi bạn tự bắt nó phải thế.</strong> <code>post-receive</code> chạy SAU KHI các đối tượng đã được chấp nhận; git đã lưu chúng rồi và lần push báo thành công bất kể hook làm gì. Một mã thoát khác 0 KHÔNG sinh ra gì ở phía client cả — đo thật trên git 2.43: không cảnh báo, không dòng lỗi, mã thoát 0; dấu vết duy nhất là những gì chính cái hook tự in ra. Nên một lần deploy vỡ nửa chừng để lại cho bạn một lần push TRÔNG NHƯ ỔN — dòng <code>set -euo pipefail</code> ở đầu hook ngăn thiệt hại lan rộng, nhưng nó không hoàn tác được lần push. Nếu bạn cần TỪ CHỐI một lần push thì đó là <code>pre-receive</code>, hook chạy trước khi có gì được lưu và mã thoát của nó thật sự quyết định kết cục.</div>

<h3>Thêm bước dựng và bước kiểm</h3>
<pre><code>  <span class="tok-comment"># ... sau khi checkout, TRUOC khi trao symlink</span>
  cd "\$BAN"
  npm ci --omit=dev --no-audit          <span class="tok-comment"># Bai 1.3: ci, khong phai install</span>
  npm run build

  ln -sfn /srv/app/chung/.env    "\$BAN/.env"        <span class="tok-comment"># Chuong 4</span>
  ln -sfn /srv/app/chung/tai-len "\$BAN/tai-len"     <span class="tok-comment"># Bai 1.1, loai 3</span>

  ln -sfn "\$BAN" "\$DICH/ht.moi" &amp;&amp; mv -T "\$DICH/ht.moi" "\$DICH/hien-tai"
  systemctl --user restart app                       <span class="tok-comment"># Chuong 3</span>

  sleep 2
  MA=\$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/health)
  [ "\$MA" = "200" ] || { echo "  [hook] KIEM HONG (\$MA) — dang lui lai" &gt;&amp;2; exit 1; }</code></pre>
<div class="note-ct">Để ý THỨ TỰ: dựng trước, rồi liên kết các đường dẫn dùng chung vào, rồi tráo, rồi khởi động lại, rồi kiểm. Mọi bước TRƯỚC bước tráo đều có thể hỏng mà không ảnh hưởng tới website đang chạy. Mọi thứ SAU nó thì đã được cam kết — và đó là lý do phép kiểm ở cuối phải đi kèm một cú LÙI BẢN thật sự, chứ không chỉ một lệnh <code>exit 1</code>. Chương 6 viết phần đó.</div>

<h3>Khi nào chọn cách này thay vì rsync</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chọn git push khi tạo tác là MÃ NGUỒN</span><span class="lz-lnote">Ngôn ngữ thông dịch, một kho mã cỡ vừa, một hai máy chủ. Cái bảo đảm chỉ-lấy-thứ-đã-commit đáng giá hơn phần đĩa nó tốn, và cả quy trình deploy gói gọn trong một cái hook bạn đọc hết được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chọn rsync khi tạo tác là thứ ĐÃ DỰNG</span><span class="lz-lnote">Dựng trên một cái máy có đủ CPU cho việc đó, rồi gửi kết quả đi. Cũng là câu trả lời khi kho mã lớn, hoặc khi máy chủ hoàn toàn không nên có lịch sử.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chọn registry khi tạo tác là một cái ẢNH</span><span class="lz-lnote">Khi runtime cũng là một phần của thứ bạn gửi đi, hoặc khi nhiều máy chủ cùng kéo về một thứ. Bài 2.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">ĐỪNG chọn "git pull trên máy chủ"</span><span class="lz-lnote">Một bản clone có cây làm việc trên máy chủ có thể mọc ra thay đổi tại chỗ — một tệp cấu hình bị sửa, một cú vá nóng, một xung đột gộp nhánh — rồi một lần deploy hỏng kèm thông báo về "thay đổi chưa commit" trên một cái máy chẳng ai ngồi soạn thảo. Một kho trần cộng một lần checkout vào thư mục mới toanh thì không có bề mặt đó.</span></div>
</div>
<h3>Chỉ thứ ĐÃ COMMIT, đo bằng một tệp đang gõ dở</h3>
${slide('dv-02', 11, 'Chỉ thứ ĐÃ COMMIT mới đi qua git push')}
<p>Cùng một cây làm việc, hai đường vận chuyển. <code>src/app.js</code> có một chỗ sửa chưa commit kèm dòng <code>TODO</code>, còn <code>src/dat-lich.js</code> là tệp mới mới gõ được nửa hàm — đúng hình dạng trình soạn thảo của một bạn cùng nhóm lúc đang nghĩ dở:</p>
<div class="out">$ git status --short
 M src/app.js
?? src/dat-lich.js
$ rsync -az --exclude=.git ./ vps:/srv/app/rs/    # kieu deploy.sh cu
$ git push vps master                            # kieu deploy-nha.sh
  Everything up-to-date
$ ssh vps "ls /srv/app/rs/src /srv/app/hien-tai/src; grep -c TODO …"
rs/src:        app.js dat-lich.js
hien-tai/src:  app.js
/srv/app/rs/src/app.js:1
/srv/app/hien-tai/src/app.js:0</div>
<p>rsync chở cả hai tệp dở dang lên. git không chở tệp nào, và nói rõ: <code>Everything up-to-date</code> — không có commit mới thì chẳng có gì để gửi, và hook còn không chạy. Đó là toàn bộ lý lẽ của bài này gói trong mười một dòng.</p>
<div class="callout warn"><strong>Kho mã này đã học điều đó bằng cái giá đắt.</strong> Ngày 13/08/2026, <code>deploy.sh</code> cũ — thứ rsync CÂY LÀM VIỆC lên VPS rồi dựng ở đó — ba lần chở lên những tệp mà một phiên soạn thảo khác đang làm dở — một hàm chưa viết xong, một biến thừa — và bước dựng trên VPS đổ, dù mã đã commit hoàn toàn sạch. <code>deploy-nha.sh</code> ra đời để biến chuyện đó thành không thể: nó lấy mã bằng git, không bao giờ đọc từ đĩa. Bản đầu dùng <code>git archive HEAD</code>, với kho này là 272 MB mỗi lần deploy; bản hiện tại <code>git push</code> vào một kho trần trên máy dựng ở nhà — khoảng 150 MB lần đầu, sau đó vài chục KB. Cái giá có chủ ý: thay đổi chưa commit không bao giờ lên production, và script hỏi <code>[y/N]</code> khi cây làm việc còn bẩn để không ai bị bất ngờ.</div>

<h3>Một hook hỏng, đo thật — và cái hook biết nói "không"</h3>
${slide('dv-02', 12, 'post-receive hỏng, git push vẫn xanh; pre-receive mới chặn được')}
<div class="out"># hooks/post-receive: echo "build HONG" &gt;&amp;2; exit 1
$ git push thu master; echo "exit=$?"
remote:   [post-receive] build HONG
To ssh://vps/srv/app/kho2.git
 * [new branch]      master -&gt; master
exit=0

# hooks/pre-receive: tu choi neu src/app.js con TODO
$ git push thu master; echo "exit=$?"
remote:   [pre-receive] TU CHOI: con TODO trong src/app.js
To ssh://vps/srv/app/kho2.git
 ! [remote rejected] master -&gt; master (pre-receive hook declined)
error: failed to push some refs to 'ssh://vps/srv/app/kho2.git'
exit=1</div>
<table>
<tr><th>Hook</th><th>Chạy lúc</th><th>Nhận gì</th><th>Thoát khác 0 nghĩa là</th></tr>
<tr><td><code>pre-receive</code></td><td>một lần, TRƯỚC khi ref nào đổi</td><td>mọi dòng <code>&lt;cũ&gt; &lt;mới&gt; &lt;ref&gt;</code> trên stdin</td><td>cả lần push bị từ chối, không lưu gì</td></tr>
<tr><td><code>update</code></td><td>mỗi ref một lần, trước khi ref đó dời</td><td>ba tham số</td><td>chỉ ref đó bị từ chối</td></tr>
<tr><td><code>post-receive</code></td><td>một lần, SAU khi mọi ref đã đổi</td><td>stdin giống pre-receive</td><td>không gì cả — push đã thành công</td></tr>
</table>
<p>Cách chia việc thực tế: thứ gì kiểm được <em>TRƯỚC</em> khi nhận mã — tên nhánh, một dòng <code>TODO</code> bị cấm, kiểm cú pháp một tệp cấu hình — thì đặt vào <code>pre-receive</code>, nơi hỏng là commit xấu bị chặn hẳn ở cửa. Dựng và tráo thì đặt vào <code>post-receive</code> với <code>set -euo pipefail</code>, để hỏng là dừng trước bước tráo và bản cũ vẫn phục vụ. Và vì <code>exit=0</code> chẳng chứng minh gì, người push phải đọc các dòng <code>remote:</code> — hoặc tốt hơn, lệnh deploy kết thúc bằng một <code>curl</code> vào bản mới.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — hook thiếu quyền chạy bị BỎ QUA kèm một dòng gợi ý, không phải một lỗi.</strong> Đo thật: tệp <code>post-receive</code> chép lên máy chủ mà quên <code>chmod +x</code> sinh ra <code>hint: The 'hooks/post-receive' hook was ignored because it's not set as executable.</code>, lần push in <code>* [new branch]</code> và thoát 0, và không có gì được deploy. Dòng hint rất dễ lẫn giữa output khác, và có thể bị tắt bằng <code>advice.ignoredHook false</code>. Cài hook xong, <code>ls -l hooks/post-receive</code> phải có chữ <code>x</code>.</div>

<h3>Chạy thử từng bước trên VPS thí nghiệm</h3>
<pre><code class="language-bash"># 1. may chu: kho tran + thu muc ban phat hanh
ssh -F cfg vps 'git init -q --bare /srv/app/kho.git &amp;&amp; mkdir -p /srv/app/phat-hanh'

# 2. dat hook (12 dong o tren, luu thanh ./post-receive voi ket thuc dong LF)
scp -F cfg post-receive vps:/srv/app/kho.git/hooks/
ssh -F cfg vps 'chmod +x /srv/app/kho.git/hooks/post-receive'

# 3. laptop: remote + push
git remote add vps vps:/srv/app/kho.git
git push vps master
ssh -F cfg vps 'readlink /srv/app/hien-tai; ls /srv/app/hien-tai/'</code></pre>
<div class="out">remote: Already on 'master'
remote:   [hook] da giai nen ban 2026-09-29-013104-3949c86
remote:   [hook] hien-tai → 2026-09-29-013104-3949c86
To vps:/srv/app/kho.git
   7c4259e..3949c86  master -&gt; master
index.html
/srv/app/phat-hanh/2026-09-29-013104-3949c86</div>
<p>Chạy từ Mac vào VPS thí nghiệm của Bài 2.1. Dòng đầu, <code>Already on 'master'</code>, là <code>git checkout</code> nói trên stderr — vô hại, và là lời nhắc tốt rằng mọi thứ hook in ra, từ bất kỳ lệnh nào, đều quay về terminal của bạn. Thư mục bản phát hành mang mã commit mà nó được dựng từ đó, nên câu "đang chạy cái gì?" trả lời được bằng đúng một lệnh <code>readlink</code>.</p>

<h3>Trên Windows: hook lưu với CRLF thì không bao giờ chạy</h3>
${slide('dv-02', 13, 'Hook mang CRLF từ Windows thì không bao giờ chạy')}
<div class="out">$ od -c hooks/post-receive | head -1
0000000   #   !   /   b   i   n   /   b   a   s   h  \\r  \\n   e   c   h
$ git push crlf master; echo "exit=$?"
fatal: cannot exec 'hooks/post-receive': No such file or directory
To ssh://vps/srv/app/kho3.git
 * [new branch]      master -&gt; master
exit=0</div>
<p>Một bạn cùng nhóm viết hook trong trình soạn thảo trên Windows, thứ lưu dòng kết thúc bằng <code>\\r\\n</code>. Dòng đầu giờ gọi tên một trình thông dịch là <code>/bin/bash\\r</code> — không hề tồn tại — nên nhân báo "No such file or directory" về một tệp rõ ràng đang nằm đó. Lần push vẫn thành công và không có gì được deploy. Ba cách sửa, từ tốt nhất tới cùng đường: bảo kho mã rằng script luôn là LF (<code>printf '*.sh text eol=lf\\nhooks/* text eol=lf\\n' &gt;&gt; .gitattributes</code>); trên Windows đặt <code>git config --global core.autocrlf input</code> để git không bao giờ đổi LF thành CRLF khi checkout; và với tệp đã hỏng, <code>sed -i 's/\\r$//' hooks/post-receive</code>. <code>file hooks/post-receive</code> còn in "with CRLF line terminators" nghĩa là vẫn còn hỏng. Git for Windows cho bạn <code>git</code> và <code>ssh</code>, nên bản thân lệnh push chạy tốt từ PowerShell; chính những tệp bạn TẠO ở đó mới là thứ cần canh.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm bạn muốn "deploy = <code>git push</code>" cho trang web tĩnh của nhóm. Trên VPS thí nghiệm của Bài 2.1, hãy cài một kho trần cùng cái hook, rồi chứng minh hai điều cho một bạn còn nghi ngờ: tệp chưa commit không bao giờ lên, và một <code>post-receive</code> hỏng không làm lần push đỏ lên.</p><ol>
<li>Tạo <code>/srv/app/kho.git</code> và <code>/srv/app/phat-hanh</code>, cài hook 12 dòng bằng <code>scp</code>, rồi <code>chmod +x</code> nó.</li>
<li>Trong một kho cục bộ (<code>git init -b master</code>), commit một <code>index.html</code>, thêm remote và push — bạn phải thấy hai dòng <code>[hook]</code>.</li>
<li>Tạo một tệp chưa commit rồi push lại: đọc dòng <code>Everything up-to-date</code>, rồi xác nhận bằng <code>ssh -F cfg vps ls /srv/app/hien-tai/</code> rằng tệp đó không có ở đấy.</li>
<li>Thêm <code>exit 1</code> vào cuối hook, commit một thay đổi, push, và ghi lại mã thoát. Rồi thêm một <code>pre-receive</code> từ chối mọi commit mà <code>index.html</code> chứa <code>TODO</code>, và push một commit như thế.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>readlink /srv/app/hien-tai</code> kết thúc bằng mã băm ngắn của commit bạn push gần nhất, và bạn có hai output đặt cạnh nhau — <code>exit=0</code> của <code>post-receive</code> hỏng, và <code>[remote rejected] … (pre-receive hook declined)</code> kèm <code>exit=1</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bare repository (kho trần)</span><span class="v">Kho git chỉ có cơ sở dữ liệu đối tượng, không có cây làm việc — một chỗ để đẩy vào.</span></div>
  <div class="kv"><span class="k">Hook (móc sự kiện)</span><span class="v">Tệp chạy được trong <code>hooks/</code> mà git gọi ở một thời điểm cố định của một thao tác.</span></div>
  <div class="kv"><span class="k">post-receive (sau khi nhận)</span><span class="v">Chạy sau khi lần push đã được lưu; mã thoát của nó không đổi gì với người push.</span></div>
  <div class="kv"><span class="k">pre-receive (trước khi nhận)</span><span class="v">Chạy trước khi có gì được lưu; thoát khác 0 là từ chối cả lần push.</span></div>
  <div class="kv"><span class="k">Ref (tham chiếu)</span><span class="v">Một cái tên trỏ vào commit, như <code>refs/heads/master</code>; hook lọc theo nó.</span></div>
  <div class="kv"><span class="k">Working tree (cây làm việc)</span><span class="v">Các tệp đã checkout mà bạn đang sửa — đúng thứ rsync đọc và lệnh push không bao giờ đọc.</span></div>
  <div class="kv"><span class="k">CRLF / LF (kết thúc dòng)</span><span class="v">Kiểu xuống dòng của Windows / Unix; script mang CRLF hỏng với "No such file or directory".</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một kho trần cộng một hook <code>post-receive</code> biến <code>git push</code> thành một lần deploy trọn vẹn vào thư mục bản phát hành mới mang tên commit.</li>
<li>Chỉ phần đã commit đi qua một lần push — đo thật: tệp gõ dở mà rsync chở lên không bao giờ tới máy chủ qua git.</li>
<li><code>post-receive</code> chạy sau khi push đã lưu, nên nó hỏng thì mã thoát không hề cho thấy; <code>pre-receive</code> mới là hook từ chối được.</li>
<li>Hook thiếu quyền chạy bị bỏ qua kèm một dòng hint; hook mang CRLF hỏng với "No such file" — và lần push đều XANH trong cả hai trường hợp.</li>
<li>Lọc theo nhánh, giải nén vào thư mục mới, tráo sau cùng, và kiểm bằng một request HTTP chứ không bằng <code>exit=0</code>.</li>
<li>Kho mã này bỏ rsync cây làm việc để chuyển sang đẩy commit sau khi cây làm việc chở tệp gõ dở lên ba lần trong một ngày.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">githooks(5) — post-receive, pre-receive, update</span><span class="lc-sub">git-scm.com/docs/githooks — mỗi hook nhận gì trên stdin và mã thoát của nó có từ chối được lần push hay không.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-checkout(1) với --work-tree</span><span class="lc-sub">git-scm.com/docs/git-checkout — ghi một commit ra một thư mục bất kỳ từ một kho trần, chính là cơ chế mà cái hook dựa vào.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-push(1) — thiết lập push.default</span><span class="lc-sub">git-scm.com/docs/git-push — vì sao một lệnh <code>git push</code> trơ trọi có thể gửi đi nhiều nhánh hơn bạn định, và đó là thứ mà bộ lọc nhánh phòng ngừa.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — kho trần, ref và hook</span><span class="lc-sub">/courses/git/learn${REF} — một kho trần thật ra chứa gì, và hook nằm ở đâu.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — The artifact as a container image|||2.3 — Tạo tác là một ảnh container',
      slug: 'deploy-2-3-tao-tac-la-anh-container',
      type: 'LESSON',
      description: 'Hai ảnh 29 MB, xuất ra cùng một tệp, vẫn là 29 MB. Đo mã băm từng lớp để thấy vì sao — và vì sao đẩy phiên bản thứ hai lên registry chỉ tốn 857 byte thay vì 30 triệu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>The artifact as a container image</h2>
<p class="lead">The third transport ships the runtime along with the code. It is the path this repository uses in production, and its economics are entirely explained by one property: an image is not a file, it is a list of content-addressed layers.</p>

<h3>Two images, measured</h3>
${slide('dv-02', 14, 'Ảnh là danh sách lớp — lớp trùng không đi lại')}
<p>A base image, a 30 MB dependency layer, and a source layer of a few hundred bytes. Built twice, changing only the source:</p>
<div class="out">=== ma bam lop ===
  app2:v1
    402f1f706d767a4c      ← nen
    a64469e94491df8f      ← phu thuoc (30 MB)
    70fa5ac32e485e24      ← ma nguon

  app2:v2
    402f1f706d767a4c      ← Y HET
    a64469e94491df8f      ← Y HET
    2524aa7f2ab843de      ← KHAC</div>
<p>The base layer and the dependency layer are byte-identical between the two builds — same digest, not merely same content. Only the source layer differs. And the consequence shows up when you package them:</p>
<div class="out">=== kich thuoc xuat ra tep ===
  w1     29M      ← chi anh v1
  w2     29M      ← chi anh v2
  w12    29M      ← CA HAI anh

=== kich thuoc tung blob trong anh v2 ===
      30.049.338 byte   ← lop phu thuoc
           1.019 byte   ← cau hinh
             857 byte   ← lop ma nguon</div>
<div class="callout ok"><strong>Two 29 MB images packaged together are 29 MB.</strong> Not 58. The dependency layer exists once and both images point at it. A registry does exactly this: it stores blobs by digest, so pushing <code>v2</code> to a registry that already holds <code>v1</code> uploads the 857-byte source layer and the 1 KB config, and skips the 30 MB it already has.</div>
<div class="note-ct"><strong>What was and was not measured here.</strong> The layer digests, the blob sizes and the shared package size are real measurements from a real Docker daemon. An actual <code>docker push</code> over a network was <em>not</em> measured — the registries were unreachable from this sandbox — so the "857 bytes on the wire" figure follows from the digests rather than from a captured transfer. The mechanism is the digest comparison, and that part is measured.</div>

<h3>The push, measured this time — through a real registry</h3>
${slide('dv-02', 15, 'Đẩy v2 lên registry: 27 KB thay vì 63 MB')}
<p>The note above was honest about a gap: in the original sandbox no registry was reachable, so the transfer was inferred from the digests. On 29/09/2026 the gap was closed in the lab: a build machine and a "VPS with Docker" (two <code>docker:27-dind</code> containers) and a <code>registry:2</code> between them, all on one private Docker network. The app is the small Express app used across this chapter, built with the correctly ordered Dockerfile below; bytes are counted on each machine's network card, so they include TCP and HTTP overhead.</p>
<div class="out">  push v1 (registry rong)          4890 ms  gui   63462090  nhan     305903  rc=0
  push v2 (doi 1 dong)               79 ms  gui      27420  nhan      18019  rc=0
      7           1 Layer already exists
      2           1 Pushed
  pull v1 (VPS chua co gi)         2559 ms  gui      72870  nhan   63118329  rc=0
  pull v2 (doi 1 dong)               80 ms  gui       5067  nhan      15395  rc=0
      7 Already exists
      2 Download complete</div>
<div class="kv-grid">
  <div class="kv"><span class="k">First push: 63 MB, 4.9 s</span><span class="v">Everything travels once — the <code>node:22-alpine</code> base, the dependencies, the code. Every new registry, and every new server, pays this once.</span></div>
  <div class="kv"><span class="k">Second push: 27 KB, 79 ms</span><span class="v">Seven layers answered "already exists" and never left the build machine. The pull on the VPS was the mirror image: seven "Already exists", 15 KB received.</span></div>
  <div class="kv"><span class="k">Two layers, not one</span><span class="v">Only <code>src/app.js</code> changed, yet <code>COPY public/</code> also got a new digest: listing both layers with <code>tar -tv</code> shows identical files and one difference — the <code>app/</code> directory entry, stamped 01:11:50 in the first build and 01:12:31 in the second. Once one layer changes, every layer after it is rebuilt — here that costs 40 bytes; the order of your Dockerfile decides what it costs you.</span></div>
  <div class="kv"><span class="k">No SSH handshake</span><span class="v">The registry speaks HTTP, so the second push finished in 79 ms — faster than a bare <code>ssh vps true</code> in the same lab (183 ms). Lesson 2.4 puts the three transports side by side.</span></div>
</div>

<h3>Why layer order decides your deploy time</h3>
${slide('dv-02', 16, 'Một dòng COPY . . đặt sai chỗ — đo thật')}
<pre><code>FROM node:22-slim
WORKDIR /app

<span class="tok-comment"># 1. thu it doi nhat, len TRUOC</span>
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

<span class="tok-comment"># 2. thu doi MOI LAN, xuong duoi cung</span>
COPY src/ ./src/
CMD ["node", "src/app.js"]</code></pre>
<div class="pitfall"><strong>Trap — one <code>COPY . .</code> before <code>npm ci</code> destroys every bit of this.</strong> A layer is invalidated when its inputs change, and every layer below it is rebuilt too. Copy the whole project first and the dependency install sits <em>after</em> a layer that changes on every commit — so <code>npm ci</code> re-runs on every build, and the 30 MB layer gets a new digest every time, and every deploy pushes and pulls 30 MB instead of 857 bytes. The Dockerfile still works. It is just thirty thousand times more expensive per deploy, and nothing warns you.</div>
<p>Measured on the same app, changing one line each time: with the dependency install ordered first, the second push sent <strong>27,420 bytes</strong> and the rebuild took 789 ms. With <code>COPY . .</code> before <code>npm ci</code>, the second push sent <strong>1,997,645 bytes</strong> — the whole compressed dependency layer again, 73 times more — and the rebuild took 1,539 ms because <code>npm ci</code> ran from scratch. Express is small; on an app with Prisma and Next.js the dependency layer is hundreds of megabytes, and the same mistake costs minutes on every deploy.</p>

<h3>Tags lie; digests do not</h3>
${slide('dv-02', 17, 'Tag đổi được, digest thì không')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">A tag is a mutable pointer</span><span class="lz-d"><code>app:v2</code> can be moved to different content tomorrow, by anyone with push access. Two servers pulling <code>app:v2</code> a week apart can legitimately be running different code. So can the same server after a restart.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>:latest</code> is the worst of them</span><span class="lz-d">It means nothing — just the tag applied when none was given. A deploy that pulls <code>:latest</code> has no defined version, cannot be rolled back to a previous one, and cannot answer "what is running?" from Lesson 1.4.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">A digest is the content</span><span class="lz-d"><code>app@sha256:2524aa7f…</code> names exactly one set of bytes, forever. Pull that and you get that, on every machine, in a year. It is the container equivalent of the reproducible artifact from Lesson 1.2.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tag for humans, deploy by digest</span><span class="lz-d">Push both — <code>app:2026-08-23-0e8117e</code> to read, and record the digest to deploy. Then rollback is redeploying a digest you already have, which is the container form of the symlink swap.</span></div>
</div>
<pre><code><span class="tok-comment"># lay digest THAT SU sau khi day</span>
docker buildx imagetools inspect ghcr.io/ban/app:2026-08-23-0e8117e \\
  --format '{{.Manifest.Digest}}'

<span class="tok-comment"># tren may chu: keo dung nhung byte do, khong phai "cai gi dang mang the do"</span>
docker pull ghcr.io/ban/app@sha256:2524aa7f...
docker compose up -d --no-build app</code></pre>

<h3>What this transport actually buys, and what it costs</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">The runtime ships with the code</span><span class="v">Node version, system libraries, locale, timezone data. The class of bug where the server has a different Node than your laptop stops existing — which is most of what "works on my machine" means.</span></div>
  <div class="kv"><span class="k">The build happens once, not per server</span><span class="v">Ten servers pull the same image. With rsync or git, each one builds, and each build is a chance to differ.</span></div>
  <div class="kv"><span class="k">The server needs no build tools</span><span class="v">No compiler, no npm, no source. This repository moved to it partly for that: builds on the VPS filled the disk that Postgres was sitting on, which Chapter 8 measures.</span></div>
  <div class="kv"><span class="k">The cost is a registry and a build machine</span><span class="v">Another moving part, another set of credentials, another thing that is down when you need to deploy urgently. And the base image is a dependency you now maintain — an unpinned <code>node:22-slim</code> changes underneath you.</span></div>
</div>
<div class="callout warn"><strong>A green build still does not mean a runnable image.</strong> This repository shipped an image built <code>FROM node:22-alpine</code> — musl — carrying a Prisma engine compiled for glibc. Build green, push green, swap green, then a restart loop and seven minutes of 502. The fix afterwards was a check comparing the image's libc against its engine build <em>before</em> the push. Chapter 7 is about gates like that; the point here is that the container path does not remove the need for them, it just moves where they belong.</div>

<h3>The same four steps, renamed</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Artifact → <code>docker build</code></span><span class="lz-lnote">The image, identified by its digest. Same role as the tarball in Lesson 1.2, with the same requirement: it must be built from committed source only.</span></div>
  <div class="lz-layer"><span class="lz-lname">Transport → <code>docker push</code> and <code>docker pull</code></span><span class="lz-lnote">Layer deduplication is the delta algorithm of this transport — the equivalent of rsync's rolling checksum, doing the same job with different mechanics.</span></div>
  <div class="lz-layer"><span class="lz-lname">Swap → <code>docker compose up -d</code></span><span class="lz-lnote">The image tag or digest in the compose file plays the part of the symlink. Rolling back is naming the previous digest — and the old image is usually still on disk, which is why it is as fast as the symlink move.</span></div>
  <div class="lz-layer"><span class="lz-lname">Verify → identical</span><span class="lz-lnote">An HTTP request against a real route. Nothing about containers changes Lesson 0.3: a running container proves as little as a running process.</span></div>
</div>
<h3>Moving a tag under a server, measured</h3>
<div class="out"># may dung: gan tag prod cho v1 roi day
$ docker pull dv02-reg:5000/dat-lich:prod        # VPS, lan 1
dv02-reg:5000/dat-lich@sha256:dd73b24b820188e8bd661477facbeb13641699bfd8e2c0af02f4178e6b486234
# may dung: gan tag prod cho v2 roi day — CUNG TEN
$ docker pull dv02-reg:5000/dat-lich:prod        # VPS, lan 2
Status: Downloaded newer image for dv02-reg:5000/dat-lich:prod
$ docker run --rm dv02-reg:5000/dat-lich:prod node -e "…BAN…"
v2
$ docker pull dv02-reg:5000/dat-lich@sha256:dd73b24b820188e8bd661477facbeb13641699bfd8e2c0af02f4178e6b486234
dv02-reg:5000/dat-lich@sha256:dd73b24b820188e8bd661477facbeb13641699bfd8e2c0af02f4178e6b486234</div>
<p>Same command, same name, different code a minute later — and nothing on the server said "your version changed", only "Downloaded newer image". The pull by digest returned the original bytes. That is the whole case for recording the digest of every deploy: a restart, a second server or a rollback then means exactly what it says.</p>

<h3>Practising with a local registry, and what changes for GHCR</h3>
${slide('dv-02', 18, 'Tập với registry cục bộ — GHCR chỉ khác địa chỉ')}
<pre><code class="language-bash"># registry thu, chi nghe loopback (tranh cong 5000: tren Mac, AirPlay dang giu no)
docker run -d --name reg -p 127.0.0.1:5055:5000 registry:2
TAG=$(date -u +%F)-$(git rev-parse --short HEAD)
docker build -t localhost:5055/dat-lich:$TAG .
docker push localhost:5055/dat-lich:$TAG
docker buildx imagetools inspect localhost:5055/dat-lich:$TAG --format '{{.Manifest.Digest}}'

# that: GHCR — chi doi ten anh va dang nhap bang token (chi IN ra, khong chay o day)
echo "$CR_PAT" | docker login ghcr.io -u USER --password-stdin
docker push ghcr.io/USER/dat-lich:$TAG</code></pre>
<div class="out">$ docker push localhost:19025/dat-lich:mac-v1
…
mac-v1: digest: sha256:401de05a22539efa507a3bbbfd0defbb9cb99ea9023fc00ce14cda6f359cfea8 size: 856
$ docker buildx imagetools inspect localhost:19025/dat-lich:mac-v1 --format '{{.Manifest.Digest}}'
sha256:401de05a22539efa507a3bbbfd0defbb9cb99ea9023fc00ce14cda6f359cfea8</div>
<p>Run from a Mac M1 with Docker Desktop (the lab used port 19025). A registry without TLS is accepted for <code>localhost</code> automatically; any other name — like <code>dv02-reg:5000</code> in the measurements above — has to be declared as an insecure registry in the daemon's configuration, which is fine in a lab and never acceptable anywhere else. For GHCR the commands are identical apart from the image name and a login with a personal access token that has the <code>write:packages</code> scope; Chapter 13 builds that path end to end, with CI. The token goes in on stdin so it never appears in <code>ps</code> or the shell history.</p>

<h3>What a push actually does, step by step</h3>
<ol>
<li><strong>For each layer, the client asks "do you have this digest?"</strong> — an HTTP <code>HEAD</code> on the blob. A yes is the "Layer already exists" line, and costs a few hundred bytes.</li>
<li><strong>Only missing layers are uploaded</strong>, compressed, and the registry checks that what arrived hashes to the digest it was promised.</li>
<li><strong>Last, the manifest is uploaded under the tag</strong> — the small JSON document listing the layers. This is the only step that moves the tag, and it is why a half-finished push never leaves a tag pointing at missing layers.</li>
<li><strong>A pull runs the same list backwards</strong>: read the manifest, download only the layers the local store lacks, verify each against its digest.</li>
</ol>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate claims "Docker deploys are slow, every deploy uploads the whole image". Settle it with numbers, using a local registry and your group's app (or any small Node app with a <code>package-lock.json</code>).</p><ol>
<li>Start <code>registry:2</code> on <code>127.0.0.1:5055</code>. Build the app with the ordered Dockerfile as <code>localhost:5055/app:v1</code> and push it; count the <code>Pushed</code> lines.</li>
<li>Change one line of source, build <code>v2</code>, push, and count <code>Layer already exists</code> against <code>Pushed</code>.</li>
<li>Build the same two versions with <code>COPY . .</code> before <code>npm ci</code> under another name and compare what the second push uploads. Use <code>docker history</code> to name the layer responsible.</li>
<li>Record the digest of <code>v1</code>, then re-tag <code>v2</code> as <code>v1</code> and push it. Pull <code>v1</code> by tag and by digest, and explain the difference.</li>
</ol>
<p><strong>Done when:</strong> you can show the second push of the ordered Dockerfile uploading only the source layers, name the layer that the <code>COPY . .</code> version re-uploads and its size, and pull the original <code>v1</code> by digest after its tag was moved. Clean up with <code>docker rm -f reg</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Layer</span><span class="v">One filesystem change produced by one Dockerfile instruction, stored and shipped as a compressed blob.</span></div>
  <div class="kv"><span class="k">Digest</span><span class="v">The sha256 of some content; the same bytes always have the same digest, so it names content permanently.</span></div>
  <div class="kv"><span class="k">Tag</span><span class="v">A movable, human-readable name for a manifest, such as <code>app:v2</code> or <code>:latest</code>.</span></div>
  <div class="kv"><span class="k">Manifest</span><span class="v">The small document listing an image's config and layers by digest; pushing it last is what moves the tag.</span></div>
  <div class="kv"><span class="k">Registry</span><span class="v">A server storing blobs and manifests by digest — Docker Hub, GHCR, or <code>registry:2</code> in a lab.</span></div>
  <div class="kv"><span class="k">Build cache</span><span class="v">Layers reused because their instruction and inputs did not change; one changed layer invalidates every layer after it.</span></div>
  <div class="kv"><span class="k">Insecure registry</span><span class="v">A registry reached over plain HTTP — allowed for <code>localhost</code>, to be declared explicitly anywhere else, only in a lab.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An image is a list of content-addressed layers, and a registry stores each layer once, whatever number of images use it.</li>
<li>Measured through <code>registry:2</code>: the first push was 63 MB and 4.9 s; the one-line change was 27 KB and 79 ms, and the pull on the VPS 15 KB.</li>
<li>Order the Dockerfile from least to most frequently changing: <code>COPY . .</code> before <code>npm ci</code> made every deploy re-ship the dependency layer (2.0 MB instead of 27 KB here).</li>
<li>A tag can be moved under a running server; deploy by digest and keep tags for humans.</li>
<li>A local <code>registry:2</code> behaves like GHCR apart from the address and the login — practise there, never with production credentials.</li>
<li>The push uploads only missing layers and moves the tag last, so a broken push never leaves a tag pointing at nothing.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OCI Image Specification — layers and descriptors</span><span class="lc-sub">github.com/opencontainers/image-spec/blob/main/spec.md — what a digest addresses and why the same layer in two images is stored once.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OCI Distribution Specification — the push protocol</span><span class="lc-sub">github.com/opencontainers/distribution-spec — the HEAD-by-digest request that lets a client skip uploading a layer the registry already has.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — build cache and layer invalidation</span><span class="lc-sub">docs.docker.com/build/cache — the rule behind the COPY-ordering pitfall, stated precisely.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — the full course</span><span class="lc-sub">/courses/docker/learn${REF} — layers, Dockerfiles, multi-stage builds and Compose in depth. This lesson is only the deploy-shaped slice of it.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Tạo tác là một ảnh container</h2>
<p class="lead">Đường vận chuyển thứ ba gửi đi cả RUNTIME kèm với mã. Đó là đường mà kho mã này đang dùng trên production, và toàn bộ bài toán kinh tế của nó được giải thích bằng đúng một tính chất: một cái ảnh KHÔNG phải một tệp, nó là một danh sách các LỚP được định địa chỉ theo nội dung.</p>

<h3>Hai cái ảnh, đo thật</h3>
${slide('dv-02', 14, 'Ảnh là danh sách lớp — lớp trùng không đi lại')}
<p>Một ảnh nền, một lớp phụ thuộc 30 MB, và một lớp mã nguồn vài trăm byte. Dựng hai lần, chỉ đổi phần mã nguồn:</p>
<div class="out">=== ma bam lop ===
  app2:v1
    402f1f706d767a4c      ← nen
    a64469e94491df8f      ← phu thuoc (30 MB)
    70fa5ac32e485e24      ← ma nguon

  app2:v2
    402f1f706d767a4c      ← Y HET
    a64469e94491df8f      ← Y HET
    2524aa7f2ab843de      ← KHAC</div>
<p>Lớp nền và lớp phụ thuộc giống nhau tới từng byte giữa hai lần dựng — cùng mã băm, chứ không phải chỉ cùng nội dung. Chỉ lớp mã nguồn là khác. Và hệ quả lộ ra khi bạn đóng gói chúng lại:</p>
<div class="out">=== kich thuoc xuat ra tep ===
  w1     29M      ← chi anh v1
  w2     29M      ← chi anh v2
  w12    29M      ← CA HAI anh

=== kich thuoc tung blob trong anh v2 ===
      30.049.338 byte   ← lop phu thuoc
           1.019 byte   ← cau hinh
             857 byte   ← lop ma nguon</div>
<div class="callout ok"><strong>Hai cái ảnh 29 MB đóng gói chung lại vẫn là 29 MB.</strong> Không phải 58. Cái lớp phụ thuộc tồn tại MỘT LẦN và cả hai ảnh cùng trỏ vào nó. Một registry làm đúng như vậy: nó lưu blob theo mã băm, nên đẩy <code>v2</code> lên một registry vốn đã có <code>v1</code> chỉ tải lên lớp mã nguồn 857 byte cộng phần cấu hình 1 KB, và BỎ QUA 30 MB nó đã có.</div>
<div class="note-ct"><strong>Cái gì được đo và cái gì thì không.</strong> Mã băm các lớp, kích thước từng blob và kích thước gói dùng chung đều là phép đo THẬT từ một Docker daemon thật. Một lệnh <code>docker push</code> thật qua mạng thì <em>KHÔNG</em> được đo — các registry không với tới được từ sandbox này — nên con số "857 byte trên đường truyền" là SUY RA từ mã băm chứ không phải từ một lần chuyển đã ghi lại. Cơ chế nằm ở phép so mã băm, và phần đó thì đã đo.</div>

<h3>Lần push, lần này ĐO THẬT — qua một registry thật</h3>
${slide('dv-02', 15, 'Đẩy v2 lên registry: 27 KB thay vì 63 MB')}
<p>Ghi chú ở trên đã thành thật về một lỗ hổng: trong sandbox ban đầu không với tới registry nào, nên phần chuyển được SUY RA từ mã băm. Ngày 29/09/2026 lỗ hổng đó được lấp trong phòng thí nghiệm: một máy dựng và một "VPS có Docker" (hai container <code>docker:27-dind</code>) cùng một <code>registry:2</code> ở giữa, tất cả trên một mạng Docker riêng. App là app Express nhỏ dùng suốt chương này, dựng bằng Dockerfile xếp đúng thứ tự ở dưới; byte được đếm ở card mạng của từng máy, nên đã gồm cả phần đầu TCP và HTTP.</p>
<div class="out">  push v1 (registry rong)          4890 ms  gui   63462090  nhan     305903  rc=0
  push v2 (doi 1 dong)               79 ms  gui      27420  nhan      18019  rc=0
      7           1 Layer already exists
      2           1 Pushed
  pull v1 (VPS chua co gi)         2559 ms  gui      72870  nhan   63118329  rc=0
  pull v2 (doi 1 dong)               80 ms  gui       5067  nhan      15395  rc=0
      7 Already exists
      2 Download complete</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Push lần đầu: 63 MB, 4,9 s</span><span class="v">Mọi thứ đi qua một lần — nền <code>node:22-alpine</code>, thư viện, mã. Mỗi registry mới, và mỗi máy chủ mới, đều trả cái giá này một lần.</span></div>
  <div class="kv"><span class="k">Push lần hai: 27 KB, 79 ms</span><span class="v">Bảy lớp trả lời "already exists" và không bao giờ rời máy dựng. Lần pull trên VPS là ảnh gương: bảy dòng "Already exists", nhận về 15 KB.</span></div>
  <div class="kv"><span class="k">Hai lớp, không phải một</span><span class="v">Chỉ <code>src/app.js</code> đổi, vậy mà <code>COPY public/</code> cũng nhận mã băm mới: liệt kê hai lớp bằng <code>tar -tv</code> thấy tệp y hệt và đúng một chỗ khác — mục thư mục <code>app/</code>, mang giờ 01:11:50 ở lần dựng đầu và 01:12:31 ở lần sau. Một lớp đã đổi thì MỌI lớp sau nó bị dựng lại — ở đây tốn 40 byte; thứ tự Dockerfile của bạn quyết định nó tốn bao nhiêu với bạn.</span></div>
  <div class="kv"><span class="k">Không có bắt tay SSH</span><span class="v">Registry nói HTTP, nên lần push thứ hai xong trong 79 ms — nhanh hơn cả một lệnh <code>ssh vps true</code> trơn trong cùng phòng thí nghiệm (183 ms). Bài 2.4 đặt ba đường cạnh nhau.</span></div>
</div>

<h3>Vì sao thứ tự các lớp quyết định thời gian deploy của bạn</h3>
${slide('dv-02', 16, 'Một dòng COPY . . đặt sai chỗ — đo thật')}
<pre><code>FROM node:22-slim
WORKDIR /app

<span class="tok-comment"># 1. thu it doi nhat, len TRUOC</span>
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

<span class="tok-comment"># 2. thu doi MOI LAN, xuong duoi cung</span>
COPY src/ ./src/
CMD ["node", "src/app.js"]</code></pre>
<div class="pitfall"><strong>Bẫy — một dòng <code>COPY . .</code> đặt TRƯỚC <code>npm ci</code> phá sạch mọi thứ vừa nói.</strong> Một lớp bị vô hiệu khi đầu vào của nó thay đổi, và MỌI lớp bên dưới nó cũng bị dựng lại. Chép cả dự án vào trước thì bước cài phụ thuộc nằm <em>SAU</em> một lớp thay đổi ở mọi commit — nên <code>npm ci</code> chạy lại ở mọi lần dựng, và cái lớp 30 MB nhận một mã băm mới mỗi lần, và mỗi lần deploy đẩy đi rồi kéo về 30 MB thay vì 857 byte. Cái Dockerfile vẫn CHẠY. Nó chỉ đắt hơn ba mươi nghìn lần cho mỗi lần deploy, và chẳng có gì cảnh báo bạn.</div>
<p>Đo trên cùng app, mỗi lần đổi một dòng: xếp bước cài thư viện lên trước thì lần push thứ hai gửi <strong>27.420 byte</strong> và lần dựng lại mất 789 ms. Đặt <code>COPY . .</code> trước <code>npm ci</code> thì lần push thứ hai gửi <strong>1.997.645 byte</strong> — lại cả lớp thư viện đã nén, gấp 73 lần — và lần dựng lại mất 1.539 ms vì <code>npm ci</code> chạy lại từ đầu. Express còn nhỏ; với một app có Prisma và Next.js, lớp thư viện nặng hàng trăm megabyte, và cùng lỗi đó tốn hàng phút ở MỖI lần deploy.</p>

<h3>Tag thì nói dối; digest thì không</h3>
${slide('dv-02', 17, 'Tag đổi được, digest thì không')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một cái tag là một con trỏ CÓ THỂ ĐỔI</span><span class="lz-d"><code>app:v2</code> có thể bị chuyển sang nội dung khác vào ngày mai, bởi bất cứ ai có quyền đẩy. Hai máy chủ kéo <code>app:v2</code> cách nhau một tuần có thể đang chạy hai đoạn mã khác nhau một cách hoàn toàn hợp lệ. Cùng một máy chủ sau một lần khởi động lại cũng vậy.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>:latest</code> là cái tệ nhất trong đám</span><span class="lz-d">Nó chẳng có nghĩa gì — chỉ là cái tag được gán khi không ai nêu tag nào. Một lần deploy kéo <code>:latest</code> thì không có phiên bản xác định, không lùi về bản trước được, và không trả lời nổi câu "đang chạy cái gì?" ở Bài 1.4.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Một digest CHÍNH LÀ nội dung</span><span class="lz-d"><code>app@sha256:2524aa7f…</code> gọi tên đúng một bộ byte, mãi mãi. Kéo cái đó về là bạn nhận đúng cái đó, trên mọi máy, sau một năm. Nó là phiên bản container của cái tạo tác tái lập được ở Bài 1.2.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Gắn tag cho NGƯỜI đọc, deploy theo DIGEST</span><span class="lz-d">Đẩy cả hai — <code>app:2026-08-23-0e8117e</code> để đọc, và ghi lại digest để deploy. Khi đó lùi bản là deploy lại một digest bạn vốn đã có, tức là dạng container của cú tráo symlink.</span></div>
</div>
<pre><code><span class="tok-comment"># lay digest THAT SU sau khi day</span>
docker buildx imagetools inspect ghcr.io/ban/app:2026-08-23-0e8117e \\
  --format '{{.Manifest.Digest}}'

<span class="tok-comment"># tren may chu: keo dung nhung byte do, khong phai "cai gi dang mang the do"</span>
docker pull ghcr.io/ban/app@sha256:2524aa7f...
docker compose up -d --no-build app</code></pre>

<h3>Đường này mua được gì, và tốn gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Runtime đi kèm với mã</span><span class="v">Phiên bản Node, thư viện hệ thống, ngôn ngữ hệ thống, dữ liệu múi giờ. Cái loại lỗi mà máy chủ có Node khác laptop của bạn THÔI TỒN TẠI — mà đó là phần lớn ý nghĩa của câu "trên máy tôi thì chạy".</span></div>
  <div class="kv"><span class="k">Bước dựng xảy ra MỘT lần, không phải mỗi máy chủ một lần</span><span class="v">Mười máy chủ kéo về cùng một cái ảnh. Với rsync hay git thì mỗi máy tự dựng, và mỗi lần dựng là một cơ hội để khác nhau.</span></div>
  <div class="kv"><span class="k">Máy chủ không cần công cụ dựng</span><span class="v">Không trình biên dịch, không npm, không mã nguồn. Kho mã này chuyển sang đường đó một phần vì lý do ấy: dựng ngay trên VPS đã làm đầy cái đĩa mà Postgres đang ngồi trên đó, chuyện Chương 8 sẽ đo.</span></div>
  <div class="kv"><span class="k">Cái giá là một registry và một máy dựng</span><span class="v">Thêm một bộ phận chuyển động, thêm một bộ thông tin đăng nhập, thêm một thứ có thể đang chết đúng lúc bạn cần deploy gấp. Và cái ảnh nền giờ là một phụ thuộc bạn phải bảo trì — một <code>node:22-slim</code> không ghim chặt sẽ đổi ngay dưới chân bạn.</span></div>
</div>
<div class="callout warn"><strong>Một bản dựng xanh VẪN không có nghĩa là một cái ảnh chạy được.</strong> Kho mã này từng gửi đi một cái ảnh dựng <code>FROM node:22-alpine</code> — musl — mang theo một engine Prisma biên dịch cho glibc. Dựng xanh, đẩy xanh, tráo xanh, rồi một vòng lặp khởi động lại và bảy phút trả 502. Cách sửa sau đó là một phép kiểm so libc của cái ảnh với bản dựng của engine <em>TRƯỚC KHI</em> đẩy. Chương 7 nói về những cái cổng như thế; điểm ở đây là đường container KHÔNG loại bỏ nhu cầu có chúng, nó chỉ đổi chỗ chúng thuộc về.</div>

<h3>Vẫn bốn bước ấy, đổi tên</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tạo tác → <code>docker build</code></span><span class="lz-lnote">Cái ảnh, định danh bằng digest của nó. Cùng vai trò với tệp nén ở Bài 1.2, và cùng một đòi hỏi: nó phải được dựng CHỈ từ mã đã commit.</span></div>
  <div class="lz-layer"><span class="lz-lname">Vận chuyển → <code>docker push</code> và <code>docker pull</code></span><span class="lz-lnote">Khử trùng lặp theo lớp chính là thuật toán chênh lệch của đường này — tương đương với mã kiểm tra cuộn của rsync, làm cùng một việc bằng cơ chế khác.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tráo → <code>docker compose up -d</code></span><span class="lz-lnote">Cái tag hay digest trong tệp compose đóng vai của symlink. Lùi bản là gọi tên digest trước đó — và cái ảnh cũ thường vẫn còn trên đĩa, nên nó nhanh ngang cú di chuyển symlink.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kiểm → y hệt</span><span class="lz-lnote">Một request HTTP vào một tuyến thật. Chuyện container không thay đổi gì ở Bài 0.3: một container đang chạy chứng minh được ít y như một tiến trình đang chạy.</span></div>
</div>
<h3>Dời một cái tag ngay dưới chân máy chủ, đo thật</h3>
<div class="out"># may dung: gan tag prod cho v1 roi day
$ docker pull dv02-reg:5000/dat-lich:prod        # VPS, lan 1
dv02-reg:5000/dat-lich@sha256:dd73b24b820188e8bd661477facbeb13641699bfd8e2c0af02f4178e6b486234
# may dung: gan tag prod cho v2 roi day — CUNG TEN
$ docker pull dv02-reg:5000/dat-lich:prod        # VPS, lan 2
Status: Downloaded newer image for dv02-reg:5000/dat-lich:prod
$ docker run --rm dv02-reg:5000/dat-lich:prod node -e "…BAN…"
v2
$ docker pull dv02-reg:5000/dat-lich@sha256:dd73b24b820188e8bd661477facbeb13641699bfd8e2c0af02f4178e6b486234
dv02-reg:5000/dat-lich@sha256:dd73b24b820188e8bd661477facbeb13641699bfd8e2c0af02f4178e6b486234</div>
<p>Cùng một lệnh, cùng một cái tên, một phút sau là mã khác — và trên máy chủ không có gì nói "phiên bản của bạn đã đổi", chỉ có "Downloaded newer image". Kéo theo digest thì nhận lại đúng bộ byte ban đầu. Đó là toàn bộ lý do để ghi lại digest của MỖI lần deploy: khi đó một lần khởi động lại, một máy chủ thứ hai hay một cú lùi bản mới có đúng nghĩa như tên gọi của nó.</p>

<h3>Tập với registry cục bộ, và GHCR khác gì</h3>
${slide('dv-02', 18, 'Tập với registry cục bộ — GHCR chỉ khác địa chỉ')}
<pre><code class="language-bash"># registry thu, chi nghe loopback (tranh cong 5000: tren Mac, AirPlay dang giu no)
docker run -d --name reg -p 127.0.0.1:5055:5000 registry:2
TAG=$(date -u +%F)-$(git rev-parse --short HEAD)
docker build -t localhost:5055/dat-lich:$TAG .
docker push localhost:5055/dat-lich:$TAG
docker buildx imagetools inspect localhost:5055/dat-lich:$TAG --format '{{.Manifest.Digest}}'

# that: GHCR — chi doi ten anh va dang nhap bang token (chi IN ra, khong chay o day)
echo "$CR_PAT" | docker login ghcr.io -u USER --password-stdin
docker push ghcr.io/USER/dat-lich:$TAG</code></pre>
<div class="out">$ docker push localhost:19025/dat-lich:mac-v1
…
mac-v1: digest: sha256:401de05a22539efa507a3bbbfd0defbb9cb99ea9023fc00ce14cda6f359cfea8 size: 856
$ docker buildx imagetools inspect localhost:19025/dat-lich:mac-v1 --format '{{.Manifest.Digest}}'
sha256:401de05a22539efa507a3bbbfd0defbb9cb99ea9023fc00ce14cda6f359cfea8</div>
<p>Chạy từ Mac M1 với Docker Desktop (phòng thí nghiệm dùng cổng 19025). Registry không TLS được Docker chấp nhận sẵn cho <code>localhost</code>; mọi tên khác — như <code>dv02-reg:5000</code> trong các phép đo ở trên — phải khai là "insecure registry" trong cấu hình daemon, điều ổn trong phòng thí nghiệm và không bao giờ chấp nhận được ở chỗ nào khác. Với GHCR các lệnh y hệt, chỉ khác tên ảnh và một lần đăng nhập bằng personal access token có quyền <code>write:packages</code>; Chương 13 dựng trọn đường đó, có CI. Token đi vào qua stdin nên không bao giờ hiện trong <code>ps</code> hay lịch sử shell.</p>

<h3>Một lần push thật ra làm gì, từng bước</h3>
<ol>
<li><strong>Với mỗi lớp, client hỏi "anh có digest này chưa?"</strong> — một request HTTP <code>HEAD</code> vào blob. Trả lời "có" chính là dòng "Layer already exists", và chỉ tốn vài trăm byte.</li>
<li><strong>Chỉ lớp còn thiếu mới được tải lên</strong>, dạng nén, và registry kiểm rằng thứ nhận được băm ra đúng digest đã hứa.</li>
<li><strong>Cuối cùng manifest được tải lên dưới cái tag</strong> — tài liệu JSON nhỏ liệt kê các lớp. Đây là bước DUY NHẤT dời tag, và là lý do một lần push dở dang không bao giờ để lại một tag trỏ vào lớp không tồn tại.</li>
<li><strong>Một lần pull chạy danh sách ấy theo chiều ngược</strong>: đọc manifest, chỉ tải những lớp kho cục bộ còn thiếu, kiểm từng lớp theo digest của nó.</li>
</ol>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn trong nhóm khẳng định "deploy bằng Docker chậm lắm, lần nào cũng tải cả cái ảnh lên". Hãy phân xử bằng con số, dùng một registry cục bộ và app của nhóm (hoặc bất kỳ app Node nhỏ nào có <code>package-lock.json</code>).</p><ol>
<li>Chạy <code>registry:2</code> ở <code>127.0.0.1:5055</code>. Dựng app bằng Dockerfile xếp đúng thứ tự thành <code>localhost:5055/app:v1</code> rồi push; đếm các dòng <code>Pushed</code>.</li>
<li>Đổi một dòng mã nguồn, dựng <code>v2</code>, push, và đếm số dòng <code>Layer already exists</code> so với <code>Pushed</code>.</li>
<li>Dựng hai phiên bản đó bằng Dockerfile có <code>COPY . .</code> trước <code>npm ci</code> dưới một tên khác và so xem lần push thứ hai tải lên cái gì. Dùng <code>docker history</code> để gọi tên lớp gây ra chuyện đó.</li>
<li>Ghi lại digest của <code>v1</code>, rồi gắn tag <code>v1</code> cho <code>v2</code> và push. Kéo <code>v1</code> theo tag và theo digest, rồi giải thích chỗ khác nhau.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được lần push thứ hai của Dockerfile đúng thứ tự chỉ tải lên các lớp mã nguồn, gọi đúng tên lớp mà bản <code>COPY . .</code> tải lại cùng cỡ của nó, và kéo về được <code>v1</code> gốc theo digest sau khi tag của nó đã bị dời. Dọn bằng <code>docker rm -f reg</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Layer (lớp)</span><span class="v">Một thay đổi hệ thống tệp do một chỉ thị Dockerfile sinh ra, lưu và gửi đi dưới dạng một blob đã nén.</span></div>
  <div class="kv"><span class="k">Digest (mã băm nội dung)</span><span class="v">sha256 của một nội dung; cùng bộ byte luôn cùng digest, nên nó gọi tên nội dung mãi mãi.</span></div>
  <div class="kv"><span class="k">Tag (nhãn)</span><span class="v">Cái tên dễ đọc, dời được, gắn cho một manifest, như <code>app:v2</code> hay <code>:latest</code>.</span></div>
  <div class="kv"><span class="k">Manifest (bản kê)</span><span class="v">Tài liệu nhỏ liệt kê cấu hình và các lớp của ảnh theo digest; tải nó lên SAU CÙNG là bước dời tag.</span></div>
  <div class="kv"><span class="k">Registry (kho ảnh)</span><span class="v">Máy chủ lưu blob và manifest theo digest — Docker Hub, GHCR, hay <code>registry:2</code> trong phòng thí nghiệm.</span></div>
  <div class="kv"><span class="k">Build cache (bộ đệm dựng)</span><span class="v">Các lớp được dùng lại vì chỉ thị và đầu vào không đổi; một lớp đổi làm vô hiệu mọi lớp sau nó.</span></div>
  <div class="kv"><span class="k">Insecure registry (registry không TLS)</span><span class="v">Registry nói HTTP trơn — được phép với <code>localhost</code>, chỗ khác phải khai báo rõ, và chỉ trong phòng thí nghiệm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một cái ảnh là danh sách các lớp định địa chỉ theo nội dung, và registry lưu mỗi lớp đúng một lần dù bao nhiêu ảnh dùng nó.</li>
<li>Đo qua <code>registry:2</code>: push lần đầu 63 MB và 4,9 s; thay đổi một dòng là 27 KB và 79 ms, còn lần pull trên VPS là 15 KB.</li>
<li>Xếp Dockerfile từ thứ ít đổi tới thứ hay đổi: <code>COPY . .</code> trước <code>npm ci</code> làm mọi lần deploy chở lại lớp thư viện (2,0 MB thay vì 27 KB ở đây).</li>
<li>Một cái tag có thể bị dời ngay dưới chân máy chủ đang chạy; deploy theo digest, để tag cho con người đọc.</li>
<li><code>registry:2</code> cục bộ cư xử như GHCR, chỉ khác địa chỉ và bước đăng nhập — hãy tập ở đó, không bao giờ bằng thông tin đăng nhập production.</li>
<li>Lần push chỉ tải những lớp còn thiếu và dời tag sau cùng, nên một lần push hỏng không bao giờ để lại một tag trỏ vào hư không.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Đặc tả ảnh OCI — lớp và descriptor</span><span class="lc-sub">github.com/opencontainers/image-spec/blob/main/spec.md — một digest định địa chỉ cái gì và vì sao cùng một lớp nằm trong hai ảnh chỉ được lưu một lần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Đặc tả OCI Distribution — giao thức đẩy</span><span class="lc-sub">github.com/opencontainers/distribution-spec — cái request HEAD theo digest cho phép client bỏ qua việc tải lên một lớp mà registry đã có.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — cache dựng và việc vô hiệu lớp</span><span class="lc-sub">docs.docker.com/build/cache — cái luật nằm sau bẫy thứ-tự-COPY, phát biểu chính xác.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — khoá đầy đủ</span><span class="lc-sub">/courses/docker/learn${REF} — lớp, Dockerfile, bản dựng nhiều tầng và Compose ở mức sâu. Bài này chỉ là lát cắt hình-dạng-deploy của nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Choosing a transport, and where to build|||2.4 — Chọn đường vận chuyển, và dựng ở đâu',
      slug: 'deploy-2-4-chon-duong-va-dung-o-dau',
      type: 'LESSON',
      description: 'Ba đường đặt cạnh nhau trên cùng một thay đổi một dòng — và phép so sánh đầu tiên của tôi SAI, vì hai bên không hề gửi đi cùng một thứ. Bài này sửa lại phép đo rồi rút ra luật chọn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Choosing a transport, and where to build</h2>
<p class="lead">Three transports, measured in the previous three lessons. Putting them side by side is harder than it looks, because the obvious comparison is not a comparison at all — and getting that wrong is how people end up with strong opinions built on a bad benchmark.</p>

<h3>The comparison, done wrong first</h3>
${slide('dv-02', 20, 'Đừng so lần đồng bộ ĐẦU với lần CHÊNH LỆCH')}
<div class="out">  rsync        310 ms    1.497.754 byte
  git push     293 ms          586 bytes</div>
<p>rsync looked 2,500 times worse. It was not: the rsync destination directory was empty, so it did a <em>first</em> sync, while git pushed a delta against a repository that already had the history. Two different operations, one table.</p>
<div class="out">════ CONG BANG: ca hai deu la lan thu HAI, chi doi mot dong ════
  rsync (dich DA co)   295 ms       15.499 byte
  git push             305 ms          565 bytes</div>
<div class="callout warn"><strong>Even the corrected table is not apples to apples, and it is worth saying why.</strong> The working tree here is 3.8 MB, of which 3.1 MB is <code>node_modules</code>. rsync is syncing that; git is not, because it is gitignored. So the two are shipping <em>different artifacts</em> — 27× more bytes for rsync partly reflects that it has 800 more files to account for. Any benchmark of these two transports has this problem baked in, and a number that ignores it is measuring the exclude list, not the transport.</div>
<p>What the corrected table does establish is the thing worth taking away: <strong>both took about 300 milliseconds</strong>. Lesson 0.1 measured why — the SSH handshake dominates at this scale, and the payload is free. For a project of this size, transport speed is not a reason to choose anything.</p>

<h3>So choose on the properties that differ</h3>
${slide('dv-02', 21, 'Chọn đường theo tạo tác, không theo tốc độ')}
<div class="kv-grid">
  <div class="kv"><span class="k">What can reach production</span><span class="v">rsync: whatever is in the directory, including a file you are mid-edit (Lesson 0.1). git: committed work only. Registry: whatever was built, which is committed work if the build is honest.</span></div>
  <div class="kv"><span class="k">What the server needs installed</span><span class="v">rsync: rsync. git: git, plus a build toolchain if the artifact is source. Registry: a container runtime, and nothing else — no compiler, no npm, no source.</span></div>
  <div class="kv"><span class="k">What the server accumulates</span><span class="v">rsync: only the tree. git: the full history, growing forever (556 KB against 176 KB in Lesson 0.1). Registry: image layers, which need their own pruning.</span></div>
  <div class="kv"><span class="k">What a rollback needs</span><span class="v">All three are the same if you use the releases layout: a directory or an image that is already on disk. Without it, all three need the network.</span></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">rsync</span><span class="lz-t">When you are shipping something already built</span><span class="lz-d">A compiled binary, a bundled front end, a tree assembled by CI. Also the pragmatic choice for an existing setup — it works with anything and needs nothing on the far side. Pair it with <code>--link-dest</code> and a releases directory, and honour the two dangers from Lesson 2.1.</span></div>
  <div class="lz-step"><span class="lz-k">git push</span><span class="lz-t">When the artifact is source and the repository is modest</span><span class="lz-d">Interpreted languages, one or two servers. The committed-only guarantee is the real value, and the whole deploy fits in a hook you can read in one screen. Cost: the history lives on the server, and the build has to happen there.</span></div>
  <div class="lz-step"><span class="lz-k">registry</span><span class="lz-t">When the runtime is part of what you ship, or there are several servers</span><span class="lz-d">The strongest reproducibility of the three, and the only one where the server needs no build tools at all. Cost: a registry and a build machine, both of which can be down when you need to deploy urgently.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Not: scp, FTP, or editing files over SSH</span><span class="lz-d"><code>scp</code> re-sends everything and has no delta and no delete. Editing in place is the failure mode where the server's code exists nowhere else, and the next deploy silently reverts the fix nobody wrote down.</span></div>
</div>

<h3>Where the build happens is a separate question</h3>
${slide('dv-02', 22, 'Dựng ở đâu là câu hỏi riêng')}
<p>Transport and build location are often conflated, and they are independent. You can build anywhere and ship by any transport — the constraint is only that the build must produce something that runs on the target.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Build on the server</span><span class="lz-lnote">Simplest, and the platform matches by definition. Costs CPU, memory and disk on the machine that is also serving traffic — and Chapter 8 measures a build being killed by the OOM killer and a deploy dying with <em>no space left on device</em> on the disk holding the database.</span></div>
  <div class="lz-layer"><span class="lz-lname">Build in CI, ship the result</span><span class="lz-lnote">The server stays a server. Requires the CI environment to match the target — same OS, same architecture, same libc, same runtime — and that match is a thing that drifts silently.</span></div>
  <div class="lz-layer"><span class="lz-lname">Build on your own machine, ship the result</span><span class="lz-lnote">Fast and free, and it is the path this repository uses: <code>deploy-nha.sh</code> builds at home, pushes to a registry, and the VPS only swaps. Roughly three times faster than building on the VPS, and it keeps a build cache off the server's disk entirely.</span></div>
  <div class="lz-layer"><span class="lz-lname">Build inside an image built for the target</span><span class="lz-lnote">The version that makes "build anywhere" actually safe, because the build environment <em>is</em> the runtime environment. It is the only one of these four where a platform mismatch is structurally impossible rather than merely unlikely.</span></div>
</div>
<div class="pitfall"><strong>Trap — building somewhere else means the build must be the target, not merely resemble it.</strong> The failure in this repository was exactly this: the build ran against the wrong Dockerfile, producing a musl base carrying a glibc engine. Everything matched except the one thing that mattered, and nothing checked. If you build off the server, add one assertion that compares the built artifact against the runtime it is going to — a libc check, a Node version check, an architecture check. One line, run before the push, is what turns "it should match" into "it does".</div>

<h3>A rule that survives contact with reality</h3>
<div class="callout ok"><strong>Ship what you tested, not instructions for producing it.</strong> Every transport is fine when the thing crossing the wire is the same thing that was verified. The failures in this chapter are all cases where it was not: an uncommitted file added at the last moment, a dependency resolved differently on the far side, a base image that moved. Choose the transport that makes the artifact hardest to change between test and production, and the rest of the differences stop mattering.</div>
<pre><code><span class="tok-comment"># cau hoi quyet dinh, theo thu tu</span>
1. Tao tac cua toi la NGUON hay la thu DA DUNG?          → nguon: git · da dung: rsync/registry
2. May chu co nen co bo cong cu dung khong?              → khong: registry hoac dung o CI
3. Co bao nhieu may chu?                                  → nhieu hon mot: registry
4. Kho ma co lon khong (tai nguyen nhi phan, lich su dai)? → co: tranh git push
5. Runtime co phai thu toi can ghim khong?                → co: registry</code></pre>
<div class="note-ct">One more thing all three share: none of them is the swap. Every measurement in this chapter stops the moment the bytes are on the server, and at that point nothing has changed for a single user — the old version is still running. Getting the new one to serve traffic without dropping a request is Chapter 3, and it is where the 3,070 ms outage from Lesson 0.1 finally goes away.</div>
<h3>All three transports on the same one-line change, re-measured</h3>
${slide('dv-02', 19, 'Ba đường, đo trên cùng một thay đổi một dòng')}
<p>On 29/09/2026 the comparison was run again, with all three transports this time, in the lab: a laptop container and a VPS container on one Docker network (rsync and git over SSH), and two <code>docker:27-dind</code> machines with a <code>registry:2</code> between them. Bytes are counted on the network card, so every number includes SSH, TCP and HTTP overhead:</p>
<div class="out">── LAN DAU (may chu chua co gi) ──
  rsync -az (ca node_modules)           312 ms   gui     648999 byte   nhan    24359 byte  rc=0
  git push (chi ma da commit)           222 ms   gui      14581 byte   nhan     6611 byte  rc=0
── LAN HAI (doi MOT dong) ──
  rsync -az (dich DA co)                233 ms   gui      21621 byte   nhan     6669 byte  rc=0
  git push                              204 ms   gui       6125 byte   nhan     6545 byte  rc=0
── khong doi gi, chay lai ──
  rsync -az (khong doi gi)              233 ms   gui      21255 byte   nhan     6527 byte  rc=0
  ssh vps true (chi bat tay)            183 ms   gui       5121 byte   nhan     5491 byte  rc=0

  push v1 (registry rong)          4890 ms  gui   63462090  nhan     305903  rc=0
  push v2 (doi 1 dong)               79 ms  gui      27420  nhan      18019  rc=0
  pull v1 (VPS chua co gi)         2559 ms  gui      72870  nhan   63118329  rc=0
  pull v2 (doi 1 dong)               80 ms  gui       5067  nhan      15395  rc=0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The floor is the handshake</span><span class="v">An SSH connection that does nothing costs 183 ms and about 5 KB each way. The one-line git push (204 ms) and rsync (233 ms) are 80–90% handshake.</span></div>
  <div class="kv"><span class="k">rsync pays for the file list</span><span class="v">Even with nothing changed, rsync sent 21 KB: it lists 627 files with sizes and times so the far side can compare. git sends only new objects, which is why its "nothing changed" is literally <code>Everything up-to-date</code>.</span></div>
  <div class="kv"><span class="k">The registry has no SSH at all</span><span class="v">79 ms for the second push, 80 ms for the pull — faster than an empty SSH login — but 4.9 s and 63 MB the first time, because the runtime travels too.</span></div>
  <div class="kv"><span class="k">Three different artifacts</span><span class="v">rsync ships the built tree with <code>node_modules</code>; git ships source and leaves the build to the server; the image ships the runtime. Comparing bytes across rows compares artifacts, not transports.</span></div>
</div>
<div class="note-ct"><strong>What these numbers are not.</strong> Both ends lived on one Mac, so there is no Internet round trip: on a real VPS every line gains tens to hundreds of milliseconds per round trip, and the SSH handshake — several round trips — grows the most. The byte counts carry over unchanged. And the conclusion survives the difference: for a project this size, speed does not separate the transports; what may reach production, and what the server must have installed, do.</div>

<h3>When to use each — and when not to</h3>
<table>
<tr><th>Transport</th><th>Use when</th><th>Do NOT use when</th><th>Server needs</th></tr>
<tr><td><code>rsync</code> into a release dir</td><td>the artifact is already built (static site, bundled front end, compiled binary); an existing setup with nothing to install</td><td>the tree may hold uncommitted or secret files and there is no exclude discipline; the target is a live directory</td><td>rsync, SSH</td></tr>
<tr><td><code>git push</code> + hook</td><td>the artifact is source in an interpreted language; one or two servers; you want "only committed work" enforced by the transport</td><td>the repository is large or binary-heavy; the server must not hold source or history; builds are heavy</td><td>git, plus the whole build toolchain</td></tr>
<tr><td>image + registry</td><td>the runtime must match exactly; several servers; the server should hold no compiler and no source</td><td>you have no build machine and no registry you trust; a tiny static site where Docker adds only moving parts</td><td>Docker, and nothing else</td></tr>
</table>

<h3>Building on an M1 Mac for an x86 VPS, measured</h3>
<div class="out">$ uname -m
arm64
$ docker build --platform linux/amd64 -t dv02-amd .
#8 [4/6] RUN npm ci --omit=dev --no-audit --no-fund
#8 0.245 exec /bin/sh: exec format error
ERROR: failed to build: failed to solve: process "/bin/sh -c npm ci --omit=dev --no-audit --no-fund" did not complete successfully: exit code: 255
$ docker run --rm --platform linux/amd64 alpine uname -m
exec /bin/uname: exec format error</div>
<p>"Build on your own machine" hides a trap when that machine is a Mac with Apple silicon and the VPS is x86-64. Measured on 29/09/2026: this Mac's Docker had no amd64 emulation enabled, so an <code>--platform linux/amd64</code> build failed at the first <code>RUN</code> with <code>exec format error</code> — the kernel refusing to execute a binary for another CPU. That is the good outcome. The bad one is building <em>without</em> <code>--platform</code>: the build succeeds, the image is arm64, it pushes and pulls fine, and on the x86 VPS the container dies instantly with the same <code>exec format error</code>. Either enable emulation (Docker Desktop's Rosetta/QEMU option) and always pass <code>--platform linux/amd64</code>, or build on an x86 machine or in CI — and in every case check <code>docker image inspect -f '{{.Os}}/{{.Architecture}}'</code> before pushing. It is the same lesson as the Alpine/glibc outage: a green build proves the build ran, not that the result runs where it is going.</p>

<h3>Where this repository builds, and why it moved</h3>
<ul>
<li><strong>On the VPS (the old <code>deploy.sh</code>):</strong> rsync the tree, build there. The 6 GB VPS had to build the two images <em>one after the other</em> — about 15 minutes — because building both at once had the <code>next build</code> killed with exit 137 by the out-of-memory killer (06/07/2026). Its build cache grew to 7.6 GB on the disk that also holds Postgres, and on 18/08/2026 a deploy died with <code>no space left on device</code> in the middle of <code>next build</code>.</li>
<li><strong>At home (<code>deploy-nha.sh</code>, the standard path since 18/08/2026):</strong> a 12-core, 31 GB machine builds both images in parallel in 3–6 minutes, pushes them to GHCR, and the VPS only pulls and swaps. No build cache on the VPS any more, and the code arrives by git, so only committed work is built.</li>
<li><strong>The fallback stays:</strong> if the home machine is off or unreachable, <code>deploy.sh</code> still works, slower, building on the VPS. A second path you have actually run is worth more than a perfect path you cannot use tonight.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your group argues about how to deploy the SWP391 project: one teammate wants rsync "because it's fastest", another wants Docker "because it's professional". Replace opinions with your own measurements on the lab VPS from Lesson 2.1, then decide.</p><ol>
<li>Measure the floor: <code>time ssh -F cfg vps true</code>, three times, and keep the middle value.</li>
<li>rsync your project into <code>/srv/app/rs/</code> twice — once on an empty directory, once after changing one line — with <code>time</code> and <code>-i</code>.</li>
<li>Push the same one-line change through the bare repository from Lesson 2.2 and time it.</li>
<li>Answer the five decision questions of this lesson for your project (source or built? build tools on the server? how many servers? large repository? runtime pinned?) and write one paragraph choosing a transport and a build location.</li>
</ol>
<p><strong>Done when:</strong> you have a table with the SSH floor, the first and second rsync and the second git push in milliseconds, and a decision whose reasons are "what may reach production" and "what the server must have" — not the speed difference, which your table will show is mostly the handshake.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Benchmark</span><span class="v">A measurement meant for comparison — valid only if both sides do the same operation on the same thing.</span></div>
  <div class="kv"><span class="k">Handshake</span><span class="v">The round trips that open an SSH or TLS connection before any payload moves; at small sizes it dominates the time.</span></div>
  <div class="kv"><span class="k">Build location</span><span class="v">Where the artifact is produced — server, CI, your machine, or inside an image of the target — independent of the transport.</span></div>
  <div class="kv"><span class="k">Target platform</span><span class="v">The OS, CPU architecture and libc the artifact will run on, such as <code>linux/amd64</code> with glibc.</span></div>
  <div class="kv"><span class="k">Exec format error</span><span class="v">The kernel's refusal to run a binary built for another CPU architecture.</span></div>
  <div class="kv"><span class="k">OOM killer</span><span class="v">The kernel mechanism that kills a process when memory runs out; a build killed this way exits with 137.</span></div>
  <div class="kv"><span class="k">Fallback path</span><span class="v">A second, slower deploy route kept working for when the main one is unavailable.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A fair comparison runs the same operation on the same artifact; a first sync against a delta, or a tree with <code>node_modules</code> against source, is not a benchmark.</li>
<li>Re-measured on one line of change: git push 204 ms, rsync 233 ms, registry push 79 ms — against an SSH floor of 183 ms.</li>
<li>Choose on what may reach production and what the server must have installed, not on transport speed.</li>
<li>Where you build is a separate decision; building off the server needs a check that the artifact matches the target platform.</li>
<li>From an M1 Mac, build with <code>--platform linux/amd64</code> and verify the architecture — without it, an arm64 image fails on an x86 VPS with <code>exec format error</code>.</li>
<li>This repository moved its builds from the 6 GB VPS to a home machine after an OOM kill and a full disk, and kept the old path as a tested fallback.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — V. Build, release, run</span><span class="lc-sub">12factor.net/build-release-run — the separation this whole chapter rests on: build produces the artifact, release combines it with config, run executes it.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1), git-push(1), docker-push(1)</span><span class="lc-sub">The three manual pages behind the three transports. Reading the FILTER RULES section of the first is the highest-value hour of the three.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — where to build, and multi-stage builds</span><span class="lc-sub">/courses/docker/learn${REF} — the build-inside-the-target-image pattern, and how to keep build tools out of what you ship.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — what a push actually transfers</span><span class="lc-sub">/courses/git/learn${REF} — packfiles and deltas, which is why the git column of the table above is so small.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Chọn đường vận chuyển, và dựng ở đâu</h2>
<p class="lead">Ba đường vận chuyển, đã đo ở ba bài trước. Đặt chúng cạnh nhau khó hơn vẻ ngoài của nó, vì phép so sánh hiển nhiên thật ra KHÔNG phải một phép so sánh — và làm sai chuyện đó chính là cách người ta có những ý kiến rất chắc chắn dựng trên một phép đo hỏng.</p>

<h3>Phép so sánh, làm SAI trước đã</h3>
${slide('dv-02', 20, 'Đừng so lần đồng bộ ĐẦU với lần CHÊNH LỆCH')}
<div class="out">  rsync        310 ms    1.497.754 byte
  git push     293 ms          586 bytes</div>
<p>rsync trông tệ hơn 2.500 lần. Không phải vậy: thư mục đích của rsync lúc đó RỖNG, nên nó làm một lần đồng bộ ĐẦU TIÊN, còn git thì đẩy một phần chênh lệch vào một kho vốn đã có lịch sử. Hai thao tác khác nhau, nhét chung một bảng.</p>
<div class="out">════ CONG BANG: ca hai deu la lan thu HAI, chi doi mot dong ════
  rsync (dich DA co)   295 ms       15.499 byte
  git push             305 ms          565 bytes</div>
<div class="callout warn"><strong>Ngay cả cái bảng đã sửa cũng KHÔNG phải so táo với táo, và điều đó đáng nói rõ.</strong> Cây làm việc ở đây nặng 3,8 MB, trong đó 3,1 MB là <code>node_modules</code>. rsync đang đồng bộ cả đống đó; git thì không, vì nó nằm trong gitignore. Nên hai bên đang gửi đi <em>HAI TẠO TÁC KHÁC NHAU</em> — con số nhiều byte hơn 27 lần của rsync một phần phản ánh việc nó có thêm 800 tệp phải tính tới. Mọi phép đo hai đường này đều mang sẵn vấn đề đó bên trong, và một con số bỏ qua nó là đang đo CÁI DANH SÁCH LOẠI TRỪ chứ không đo đường vận chuyển.</div>
<p>Thứ mà cái bảng đã sửa THẬT SỰ xác lập lại là điều đáng mang đi: <strong>cả hai đều mất khoảng 300 mili giây</strong>. Bài 0.1 đã đo lý do — cái bắt tay SSH chiếm phần lớn ở quy mô này, còn phần tải thì miễn phí. Với một dự án cỡ này, TỐC ĐỘ vận chuyển không phải lý do để chọn bất cứ thứ gì.</p>

<h3>Vậy hãy chọn theo những tính chất thật sự KHÁC nhau</h3>
${slide('dv-02', 21, 'Chọn đường theo tạo tác, không theo tốc độ')}
<div class="kv-grid">
  <div class="kv"><span class="k">Cái gì CÓ THỂ lên tới production</span><span class="v">rsync: bất cứ thứ gì trong thư mục, kể cả tệp bạn đang sửa dở (Bài 0.1). git: chỉ phần đã commit. Registry: bất cứ thứ gì đã được dựng, mà đó là phần đã commit nếu bước dựng trung thực.</span></div>
  <div class="kv"><span class="k">Máy chủ cần cài sẵn gì</span><span class="v">rsync: rsync. git: git, cộng bộ công cụ dựng nếu tạo tác là mã nguồn. Registry: một runtime container, và không gì khác — không trình biên dịch, không npm, không mã nguồn.</span></div>
  <div class="kv"><span class="k">Máy chủ TÍCH TỤ cái gì</span><span class="v">rsync: chỉ cái cây. git: toàn bộ lịch sử, tăng mãi mãi (556 KB so với 176 KB ở Bài 0.1). Registry: các lớp ảnh, và chúng cần bộ dọn dẹp riêng.</span></div>
  <div class="kv"><span class="k">Một cú lùi bản cần gì</span><span class="v">Cả ba như nhau NẾU bạn dùng bố cục releases: một thư mục hoặc một cái ảnh đã nằm sẵn trên đĩa. Không có nó thì cả ba đều cần MẠNG.</span></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">rsync</span><span class="lz-t">Khi bạn gửi đi thứ ĐÃ DỰNG XONG</span><span class="lz-d">Một tệp nhị phân đã biên dịch, một front end đã đóng gói, một cây do CI lắp ráp. Cũng là lựa chọn thực dụng cho một hệ thống đang chạy sẵn — nó làm việc với mọi thứ và không đòi gì ở phía bên kia. Hãy ghép nó với <code>--link-dest</code> và một thư mục releases, và tôn trọng hai mối nguy ở Bài 2.1.</span></div>
  <div class="lz-step"><span class="lz-k">git push</span><span class="lz-t">Khi tạo tác là MÃ NGUỒN và kho mã cỡ vừa</span><span class="lz-d">Ngôn ngữ thông dịch, một hai máy chủ. Cái bảo đảm chỉ-lấy-thứ-đã-commit mới là giá trị thật, và cả quy trình deploy gói trong một cái hook đọc hết trong một màn hình. Cái giá: lịch sử sống trên máy chủ, và bước dựng phải xảy ra ở đó.</span></div>
  <div class="lz-step"><span class="lz-k">registry</span><span class="lz-t">Khi runtime cũng là thứ bạn gửi đi, hoặc khi có nhiều máy chủ</span><span class="lz-d">Tính tái lập mạnh nhất trong ba đường, và là đường duy nhất mà máy chủ hoàn toàn không cần công cụ dựng. Cái giá: một registry và một máy dựng, mà cả hai đều có thể đang chết đúng lúc bạn cần deploy gấp.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">KHÔNG phải: scp, FTP, hay sửa tệp thẳng qua SSH</span><span class="lz-d"><code>scp</code> gửi lại toàn bộ, không có chênh lệch và không có xoá. Sửa tại chỗ là kiểu hỏng mà mã trên máy chủ KHÔNG tồn tại ở đâu khác, và lần deploy kế tiếp lặng lẽ xoá mất cái sửa mà chẳng ai ghi lại.</span></div>
</div>

<h3>Dựng ở đâu là một câu hỏi RIÊNG</h3>
${slide('dv-02', 22, 'Dựng ở đâu là câu hỏi riêng')}
<p>Đường vận chuyển và nơi dựng hay bị gộp làm một, và chúng độc lập với nhau. Bạn dựng ở đâu cũng được rồi gửi bằng đường nào cũng được — ràng buộc duy nhất là bước dựng phải cho ra thứ CHẠY ĐƯỢC trên máy đích.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Dựng trên máy chủ</span><span class="lz-lnote">Đơn giản nhất, và nền tảng khớp theo định nghĩa. Tốn CPU, bộ nhớ và đĩa trên chính cái máy đang phục vụ lưu lượng — và Chương 8 đo một lần dựng bị kẻ giết OOM giết chết cùng một lần deploy chết với <em>no space left on device</em> trên đúng cái đĩa chứa cơ sở dữ liệu.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dựng trong CI, gửi kết quả đi</span><span class="lz-lnote">Máy chủ vẫn chỉ là máy chủ. Đòi môi trường CI phải KHỚP máy đích — cùng hệ điều hành, cùng kiến trúc, cùng libc, cùng runtime — và cái sự khớp đó là thứ trôi lệch một cách lặng lẽ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dựng trên máy của chính bạn, gửi kết quả đi</span><span class="lz-lnote">Nhanh và miễn phí, và đó là đường mà kho mã này đang dùng: <code>deploy-nha.sh</code> dựng ở nhà, đẩy lên registry, còn VPS chỉ tráo. Nhanh hơn dựng trên VPS khoảng ba lần, và nó giữ cho cache dựng nằm hẳn ngoài đĩa của máy chủ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dựng BÊN TRONG một cái ảnh dựng cho máy đích</span><span class="lz-lnote">Phiên bản làm cho "dựng ở đâu cũng được" thật sự an toàn, vì môi trường dựng CHÍNH LÀ môi trường chạy. Nó là cái duy nhất trong bốn cái mà lệch nền tảng là chuyện KHÔNG THỂ về mặt cấu trúc, chứ không phải chỉ là khó xảy ra.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — dựng ở chỗ khác nghĩa là chỗ dựng phải LÀ máy đích, chứ không phải chỉ GIỐNG nó.</strong> Sự cố của kho mã này đúng là chuyện đó: bước dựng chạy với nhầm Dockerfile, cho ra một nền musl mang theo một engine glibc. Mọi thứ đều khớp trừ đúng cái thứ quan trọng, và chẳng có gì kiểm. Nếu bạn dựng ngoài máy chủ, hãy thêm MỘT phép khẳng định so tạo tác vừa dựng với cái runtime nó sắp chạy vào — kiểm libc, kiểm phiên bản Node, kiểm kiến trúc. Một dòng, chạy trước khi đẩy, là thứ biến "chắc là nó khớp" thành "nó khớp".</div>

<h3>Một cái luật sống sót được khi va vào thực tế</h3>
<div class="callout ok"><strong>Hãy gửi đi THỨ BẠN ĐÃ KIỂM THỬ, đừng gửi đi CÔNG THỨC để tạo ra nó.</strong> Mọi đường vận chuyển đều ổn khi thứ băng qua đường truyền chính là thứ đã được kiểm chứng. Mọi kiểu hỏng trong chương này đều là những ca mà điều đó KHÔNG đúng: một tệp chưa commit lọt vào phút chót, một phụ thuộc được giải khác đi ở phía bên kia, một cái ảnh nền đã bị di chuyển. Hãy chọn đường vận chuyển làm cho tạo tác KHÓ THAY ĐỔI NHẤT giữa lúc kiểm thử và lúc lên production, rồi mọi khác biệt còn lại sẽ thôi quan trọng.</div>
<pre><code><span class="tok-comment"># cau hoi quyet dinh, theo thu tu</span>
1. Tao tac cua toi la NGUON hay la thu DA DUNG?          → nguon: git · da dung: rsync/registry
2. May chu co nen co bo cong cu dung khong?              → khong: registry hoac dung o CI
3. Co bao nhieu may chu?                                  → nhieu hon mot: registry
4. Kho ma co lon khong (tai nguyen nhi phan, lich su dai)? → co: tranh git push
5. Runtime co phai thu toi can ghim khong?                → co: registry</code></pre>
<div class="note-ct">Còn một điều nữa mà cả ba đường đều giống nhau: KHÔNG cái nào là bước TRÁO. Mọi phép đo trong chương này dừng lại đúng khoảnh khắc các byte đã nằm trên máy chủ, và ở thời điểm đó chưa có gì thay đổi với một người dùng nào cả — bản cũ vẫn đang chạy. Đưa bản mới vào phục vụ lưu lượng mà không rơi một request nào là Chương 3, và đó là chỗ cái gián đoạn 3.070 ms ở Bài 0.1 rốt cuộc biến mất.</div>
<h3>Cả ba đường trên cùng một thay đổi một dòng, đo lại</h3>
${slide('dv-02', 19, 'Ba đường, đo trên cùng một thay đổi một dòng')}
<p>Ngày 29/09/2026 phép so được chạy lại, lần này đủ cả ba đường, trong phòng thí nghiệm: một container laptop và một container VPS trên cùng một mạng Docker (rsync và git đi qua SSH), cùng hai máy <code>docker:27-dind</code> với một <code>registry:2</code> ở giữa. Byte được đếm ở card mạng, nên mọi con số đã gồm phần đầu SSH, TCP và HTTP:</p>
<div class="out">── LAN DAU (may chu chua co gi) ──
  rsync -az (ca node_modules)           312 ms   gui     648999 byte   nhan    24359 byte  rc=0
  git push (chi ma da commit)           222 ms   gui      14581 byte   nhan     6611 byte  rc=0
── LAN HAI (doi MOT dong) ──
  rsync -az (dich DA co)                233 ms   gui      21621 byte   nhan     6669 byte  rc=0
  git push                              204 ms   gui       6125 byte   nhan     6545 byte  rc=0
── khong doi gi, chay lai ──
  rsync -az (khong doi gi)              233 ms   gui      21255 byte   nhan     6527 byte  rc=0
  ssh vps true (chi bat tay)            183 ms   gui       5121 byte   nhan     5491 byte  rc=0

  push v1 (registry rong)          4890 ms  gui   63462090  nhan     305903  rc=0
  push v2 (doi 1 dong)               79 ms  gui      27420  nhan      18019  rc=0
  pull v1 (VPS chua co gi)         2559 ms  gui      72870  nhan   63118329  rc=0
  pull v2 (doi 1 dong)               80 ms  gui       5067  nhan      15395  rc=0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái sàn là cú bắt tay</span><span class="v">Một kết nối SSH không làm gì tốn 183 ms và khoảng 5 KB mỗi chiều. Lần git push một dòng (204 ms) và rsync (233 ms) là 80–90% bắt tay.</span></div>
  <div class="kv"><span class="k">rsync trả giá cho danh sách tệp</span><span class="v">Không đổi gì mà rsync vẫn gửi 21 KB: nó liệt kê 627 tệp kèm cỡ và giờ để phía bên kia so. git chỉ gửi đối tượng mới, nên "không đổi gì" của nó đúng nghĩa đen là <code>Everything up-to-date</code>.</span></div>
  <div class="kv"><span class="k">Registry không có SSH nào cả</span><span class="v">79 ms cho lần push thứ hai, 80 ms cho lần pull — nhanh hơn một lần đăng nhập SSH trống — nhưng 4,9 s và 63 MB ở lần đầu, vì runtime cũng đi theo.</span></div>
  <div class="kv"><span class="k">Ba tạo tác khác nhau</span><span class="v">rsync chở cây đã dựng kèm <code>node_modules</code>; git chở mã nguồn và để máy chủ tự dựng; cái ảnh chở cả runtime. So byte giữa các hàng là so TẠO TÁC, không phải so đường truyền.</span></div>
</div>
<div class="note-ct"><strong>Những con số này KHÔNG phải là gì.</strong> Hai đầu cùng nằm trên một chiếc Mac, nên không có vòng đi–về qua Internet: trên VPS thật mỗi dòng thêm vài chục tới vài trăm mili giây cho mỗi vòng đi–về, và cú bắt tay SSH — vài vòng — tăng nhiều nhất. Số byte thì giữ nguyên. Và kết luận sống sót qua khác biệt đó: với dự án cỡ này, tốc độ không phân biệt được các đường; thứ phân biệt là cái gì được phép lên production, và máy chủ phải cài sẵn những gì.</div>

<h3>Khi nào dùng từng đường — và khi nào KHÔNG</h3>
<table>
<tr><th>Đường</th><th>Dùng khi</th><th>KHÔNG dùng khi</th><th>Máy chủ cần</th></tr>
<tr><td><code>rsync</code> vào thư mục bản phát hành</td><td>tạo tác đã dựng xong (web tĩnh, front end đã đóng gói, tệp nhị phân); hệ thống sẵn có, không muốn cài thêm gì</td><td>cây thư mục có thể chứa tệp chưa commit hay tệp bí mật mà không có kỷ luật loại trừ; đích là thư mục đang chạy</td><td>rsync, SSH</td></tr>
<tr><td><code>git push</code> + hook</td><td>tạo tác là mã nguồn ngôn ngữ thông dịch; một hai máy chủ; muốn chính đường vận chuyển ép "chỉ thứ đã commit"</td><td>kho lớn hoặc nhiều tệp nhị phân; máy chủ không được giữ mã nguồn hay lịch sử; bước dựng nặng</td><td>git, cộng cả bộ công cụ dựng</td></tr>
<tr><td>ảnh + registry</td><td>runtime phải khớp tuyệt đối; nhiều máy chủ; máy chủ không nên có trình biên dịch lẫn mã nguồn</td><td>không có máy dựng và registry nào bạn tin được; một web tĩnh tí hon mà Docker chỉ thêm bộ phận chuyển động</td><td>Docker, và không gì khác</td></tr>
</table>

<h3>Dựng trên Mac M1 cho một VPS x86, đo thật</h3>
<div class="out">$ uname -m
arm64
$ docker build --platform linux/amd64 -t dv02-amd .
#8 [4/6] RUN npm ci --omit=dev --no-audit --no-fund
#8 0.245 exec /bin/sh: exec format error
ERROR: failed to build: failed to solve: process "/bin/sh -c npm ci --omit=dev --no-audit --no-fund" did not complete successfully: exit code: 255
$ docker run --rm --platform linux/amd64 alpine uname -m
exec /bin/uname: exec format error</div>
<p>"Dựng trên máy của chính bạn" giấu một cái bẫy khi máy đó là Mac chip Apple còn VPS là x86-64. Đo ngày 29/09/2026: Docker trên chiếc Mac này chưa bật giả lập amd64, nên lần dựng <code>--platform linux/amd64</code> hỏng ngay ở lệnh <code>RUN</code> đầu tiên với <code>exec format error</code> — nhân từ chối chạy một tệp nhị phân dành cho CPU khác. Đó là kết cục TỐT. Kết cục xấu là dựng <em>KHÔNG</em> có <code>--platform</code>: dựng thành công, ảnh là arm64, đẩy và kéo đều ổn, và trên VPS x86 container chết ngay tức khắc với đúng dòng <code>exec format error</code>. Hoặc bật giả lập (tuỳ chọn Rosetta/QEMU của Docker Desktop) và luôn truyền <code>--platform linux/amd64</code>, hoặc dựng trên máy x86 hay trong CI — và trường hợp nào cũng kiểm <code>docker image inspect -f '{{.Os}}/{{.Architecture}}'</code> trước khi đẩy. Đó là cùng một bài học với sự cố Alpine/glibc: bản dựng xanh chứng minh bước dựng đã chạy, không chứng minh kết quả chạy được ở nơi nó sắp tới.</p>

<h3>Kho mã này dựng ở đâu, và vì sao nó dời đi</h3>
<ul>
<li><strong>Trên VPS (<code>deploy.sh</code> cũ):</strong> rsync cây thư mục, dựng ngay trên đó. VPS 6 GB buộc phải dựng hai ảnh <em>LẦN LƯỢT</em> — khoảng 15 phút — vì dựng song song thì <code>next build</code> bị kẻ giết OOM kết liễu với mã thoát 137 (06/07/2026). Cache dựng của nó phình tới 7,6 GB trên chính cái đĩa chứa Postgres, và ngày 18/08/2026 một lần deploy chết với <code>no space left on device</code> giữa lúc <code>next build</code>.</li>
<li><strong>Ở nhà (<code>deploy-nha.sh</code>, đường chuẩn từ 18/08/2026):</strong> một máy 12 nhân, 31 GB dựng hai ảnh SONG SONG trong 3–6 phút, đẩy lên GHCR, còn VPS chỉ kéo về và tráo. VPS không còn cache dựng nào, và mã tới bằng git, nên chỉ thứ đã commit mới được dựng.</li>
<li><strong>Đường lùi vẫn giữ:</strong> máy nhà tắt hay mất mạng thì <code>deploy.sh</code> vẫn chạy được, chậm hơn, dựng trên VPS. Một đường thứ hai bạn ĐÃ thật sự chạy đáng giá hơn một đường hoàn hảo mà tối nay bạn không dùng được.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm bạn tranh cãi cách deploy đồ án SWP391: một bạn muốn rsync "vì nhanh nhất", một bạn muốn Docker "vì chuyên nghiệp". Hãy thay ý kiến bằng phép đo của chính bạn trên VPS thí nghiệm của Bài 2.1, rồi quyết định.</p><ol>
<li>Đo cái sàn: <code>time ssh -F cfg vps true</code>, ba lần, giữ giá trị ở giữa.</li>
<li>rsync dự án của bạn vào <code>/srv/app/rs/</code> hai lần — một lần vào thư mục rỗng, một lần sau khi đổi một dòng — kèm <code>time</code> và <code>-i</code>.</li>
<li>Đẩy đúng thay đổi một dòng đó qua kho trần của Bài 2.2 và bấm giờ.</li>
<li>Trả lời năm câu hỏi quyết định của bài này cho dự án của bạn (nguồn hay đã dựng? máy chủ có công cụ dựng không? bao nhiêu máy chủ? kho có lớn không? runtime có cần ghim không?) và viết một đoạn chọn đường vận chuyển cùng nơi dựng.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một bảng gồm sàn SSH, rsync lần đầu và lần hai, git push lần hai tính bằng mili giây, và một quyết định có lý do là "cái gì được lên production" và "máy chủ phải có gì" — chứ không phải chênh lệch tốc độ, thứ mà chính bảng của bạn sẽ cho thấy phần lớn là cú bắt tay.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Benchmark (phép đo so sánh)</span><span class="v">Phép đo để so — chỉ hợp lệ khi hai bên làm cùng một thao tác trên cùng một thứ.</span></div>
  <div class="kv"><span class="k">Handshake (bắt tay)</span><span class="v">Các vòng đi–về mở một kết nối SSH hay TLS trước khi có byte dữ liệu nào đi; ở cỡ nhỏ nó chiếm gần hết thời gian.</span></div>
  <div class="kv"><span class="k">Build location (nơi dựng)</span><span class="v">Chỗ tạo tác được sinh ra — máy chủ, CI, máy bạn, hay trong ảnh của máy đích — độc lập với đường vận chuyển.</span></div>
  <div class="kv"><span class="k">Target platform (nền tảng đích)</span><span class="v">Hệ điều hành, kiến trúc CPU và libc mà tạo tác sẽ chạy trên đó, như <code>linux/amd64</code> với glibc.</span></div>
  <div class="kv"><span class="k">Exec format error (lỗi định dạng thực thi)</span><span class="v">Nhân từ chối chạy một tệp nhị phân dựng cho kiến trúc CPU khác.</span></div>
  <div class="kv"><span class="k">OOM killer (kẻ giết khi hết bộ nhớ)</span><span class="v">Cơ chế của nhân giết một tiến trình khi cạn RAM; bước dựng bị giết kiểu này thoát với mã 137.</span></div>
  <div class="kv"><span class="k">Fallback path (đường lùi)</span><span class="v">Một đường deploy thứ hai, chậm hơn, luôn được giữ chạy được cho lúc đường chính không dùng được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Phép so công bằng chạy cùng một thao tác trên cùng một tạo tác; đồng bộ lần đầu đấu với phần chênh lệch, hay cây có <code>node_modules</code> đấu với mã nguồn, không phải phép đo so sánh.</li>
<li>Đo lại trên một dòng thay đổi: git push 204 ms, rsync 233 ms, registry push 79 ms — so với cái sàn SSH 183 ms.</li>
<li>Chọn theo thứ gì được phép lên production và máy chủ phải cài gì, không theo tốc độ đường truyền.</li>
<li>Dựng ở đâu là một quyết định riêng; dựng ngoài máy chủ thì cần một phép kiểm tạo tác khớp nền tảng đích.</li>
<li>Từ Mac M1, hãy dựng với <code>--platform linux/amd64</code> và kiểm kiến trúc — thiếu nó, ảnh arm64 chết trên VPS x86 với <code>exec format error</code>.</li>
<li>Kho mã này dời việc dựng từ VPS 6 GB về một máy ở nhà sau một lần bị OOM giết và một lần đầy đĩa, và giữ đường cũ làm đường lùi đã kiểm.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — V. Build, release, run</span><span class="lc-sub">12factor.net/build-release-run — sự tách bạch mà cả chương này dựa lên: dựng sinh ra tạo tác, phát hành ghép nó với cấu hình, chạy thì thực thi nó.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1), git-push(1), docker-push(1)</span><span class="lc-sub">Ba trang man đứng sau ba đường vận chuyển. Đọc mục FILTER RULES của cái đầu tiên là một giờ đáng giá nhất trong ba cái.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — dựng ở đâu, và bản dựng nhiều tầng</span><span class="lc-sub">/courses/docker/learn${REF} — khuôn dựng-bên-trong-ảnh-đích, và cách giữ cho công cụ dựng không lọt vào thứ bạn gửi đi.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — một lần push thật ra chuyển đi cái gì</span><span class="lc-sub">/courses/git/learn${REF} — packfile và delta, và đó là lý do cột git trong bảng ở trên nhỏ tới vậy.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.5 ─────────────────────────── */
    {
      title: '2.5 — When the transport fails halfway|||2.5 — Khi đường vận chuyển hỏng nửa chừng',
      slug: 'deploy-2-5-hong-nua-chung',
      type: 'LESSON',
      description: 'Hai lần deploy chạy chồng nhau: cái bắt đầu SAU lại xong TRƯỚC, rồi cái cũ ghi đè lên nó — production chạy bản cũ hơn. Đo cả sự cố lẫn hai kiểu khoá sửa được nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>When the transport fails halfway</h2>
<p class="lead">Lesson 2.1 measured what an interrupted rsync leaves behind: 310 files from one release and 90 from another. This lesson covers the rest of the ways a transport goes wrong — and the one that produces the strangest outcome, where the deploy you started second is not the one that ends up running.</p>

<h3>Cutting the connection mid-transfer, re-measured</h3>
${slide('dv-02', 23, 'Đứt giữa chừng: 325 tệp mới trộn 75 tệp cũ')}
<p>Lesson 2.1's 310/90 figure was re-run on 29/09/2026 with a more honest cause than a plain kill: the laptop container's network was slowed to 4 Mbit/s with <code>tc qdisc … netem</code>, 400 files of version 2 were rsynced over 400 files of version 1, and the transfer was cut after four seconds — the shape of a Wi-Fi drop in the middle of a deploy. Then the same cut, but into a fresh release directory:</p>
<div class="out">$ sudo tc qdisc add dev eth0 root netem rate 4mbit   # gia lap mang cham
$ timeout -s KILL 4 rsync -a rel/ vps:/srv/app/song/
rsync rc=137 sau 4005 ms
  con PHIEN BAN 1: 75 tep
  da thanh PHIEN BAN 2: 325 tep
  tep tam con sot: 0

$ timeout -s KILL 4 rsync -a --link-dest=../b1 rel/ vps:/srv/app/r/phat-hanh/b2/
rc=137
hien-tai -&gt; /srv/app/r/phat-hanh/b1
  ban dang song co PHIEN BAN 2: 0 tep
  b2 (do dang) co: 365 tep
$ rsync -a --link-dest=../b1 rel/ vps:/srv/app/r/phat-hanh/b2/   # chay lai
rc=0
  b2: 400 tep PHIEN BAN 2
hien-tai -&gt; /srv/app/r/phat-hanh/b2</div>
<p>Straight into the live directory: 325 new files, 75 old ones, no temporary files — every file whole, the directory a version that never existed. Into a release directory: the cut left 365 files in <code>b2</code> that nothing was serving, the live release still had zero version-2 files, and simply running the same command again completed <code>b2</code> before the swap. The same shape appears from a Mac with openrsync, slowing the transfer with <code>--bwlimit</code> instead of <code>tc</code>:</p>
<div class="out">$ rsync -a --bwlimit=100 rel/ vps:/srv/app/bw/ &amp; sleep 3; kill $!; wait $!; echo "rc=$?"
rc=20
$ ssh -F cfg vps 'cd /srv/app/bw; for b in 2 3; do echo "ban $b: $(grep -l "PHIEN BAN $b" m*.js | wc -l)"; done'
ban 2: 126
ban 3: 74</div>
<p>Exit code 20 is rsync's "killed by a signal". The split differs run to run — 126 against 74 here — but a mixture is guaranteed whenever the cut lands in the middle.</p>

<h3>Two deploys at once</h3>
${slide('dv-02', 24, 'Hai lần deploy chồng nhau: bản CŨ thắng')}
<p>Two deploys of different versions, started 150 ms apart. The first is slower; the second finishes first:</p>
<div class="out">════ HAI lan deploy chay chong nhau, KHONG co khoa ════
  [B] xong, hien-tai → B
  [A] xong, hien-tai → A
  KET QUA: hien-tai → A
  noi dung dang duoc phuc vu: A</div>
<div class="callout warn"><strong>B was pushed second, completed first, and then A overwrote it.</strong> Production is running A — the <em>older</em> deploy — and the person who deployed B watched their deploy succeed. Nothing failed. Both scripts exited 0, both printed a success line, and the result is that the most recent change is not live. It will stay that way until someone deploys again, which is usually the next morning when someone notices the fix is missing.</div>
<p>This is not a rare shape. It happens when two people deploy at once, when a CI job overlaps a manual deploy, or when someone re-runs a deploy they thought had failed. This repository has a measured instance: eleven version bumps in four and a half hours from several sessions, of which <em>one was never released at all</em> — the version number moved, everyone believed it had shipped, and users stayed on the previous build with nothing anywhere comparing the two.</p>

<h3>One lock fixes it, and the flag decides the semantics</h3>
${slide('dv-02', 25, 'flock -n bỏ cuộc, flock -w chờ tới lượt')}
<pre><code><span class="tok-comment"># mo mot mo ta tep tren tep khoa, roi giu khoa suot ca lan deploy</span>
exec 9&gt;/var/lock/deploy.lock
if ! flock -n 9; then
  echo "co lan deploy khac dang chay — DUNG" &gt;&amp;2
  exit 1
fi</code></pre>
<div class="out">════ cung tinh huong, nhung CO flock ════
  [B] co lan deploy khac dang chay — DUNG
  [A] xong, hien-tai → A
  KET QUA: hien-tai → A

════ va neu B CHO thay vi bo cuoc (flock -w 10) ════
  [A] xong, hien-tai → A
  [B] xong, hien-tai → B
  KET QUA: hien-tai → B</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>flock -n</code> — fail immediately</span><span class="v">B refuses to start and says why. Only one deploy ever runs, and the rejected one exits non-zero so CI marks it failed rather than silently doing nothing.</span></div>
  <div class="kv"><span class="k"><code>flock -w 10</code> — wait, then give up</span><span class="v">B waits for A to finish, then deploys. The result is B — the newest change wins, which is almost always what you actually want.</span></div>
  <div class="kv"><span class="k">The lock releases itself</span><span class="v">It is held on a file descriptor, so the kernel drops it when the process exits — including a crash, a kill, or a dropped SSH session. A lock file you create and delete by hand does not have that property, and a stale one blocks deploys until someone removes it.</span></div>
  <div class="kv"><span class="k">Lock on the server, not the client</span><span class="v">A lock on your laptop does not know about the deploy running from CI. The file must live on the machine being deployed to.</span></div>
</div>
<div class="pitfall"><strong>Trap — <code>flock file cmd</code> and <code>exec 9&gt;file; flock 9</code> are not the same.</strong> The first holds the lock only for the duration of <code>cmd</code>; if your deploy is several commands, each one locks and unlocks and the gaps between them are unprotected. The file-descriptor form holds it for the life of the shell, which is what a multi-step deploy needs. And put the lock file somewhere that survives — <code>/var/lock</code> or <code>/run</code> — not inside the release directory you are about to replace.</div>

<h3>Which failures are safe to retry</h3>
${slide('dv-02', 27, 'Bước nào chạy lại được an toàn')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Transport into a new release directory</span><span class="lz-d">Fully safe. The target is a fresh directory nothing is serving, and re-running overwrites a partial copy with a complete one. Run it as many times as you like. This is the single largest benefit of the releases layout, beyond rollback.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">The symlink swap</span><span class="lz-d">Idempotent by nature — pointing a symlink at the directory it already points at changes nothing, and <code>rename(2)</code> cannot half-happen.</span></div>
  <div class="lz-step"><span class="lz-k">⚠</span><span class="lz-t">Transport directly over a live directory</span><span class="lz-d">Retrying makes the mixed state from Lesson 2.1 <em>more</em> mixed while it runs. It converges if it completes; it is dangerous every second it does not. Another reason not to deploy this way.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Database migrations</span><span class="lz-d">Not generally safe to retry, and the failure mode is worse than anything in this chapter. Chapter 5 is about exactly this — including the state where a migration is recorded as neither applied nor rolled back, and every subsequent deploy refuses to run.</span></div>
</div>
<div class="callout ok"><strong>Design the transport step so retrying is always correct.</strong> Then a network blip, a timeout, or a laptop lid becomes an inconvenience instead of an incident: run it again. The property you want is that the operation can be repeated any number of times with the same end state, and the releases layout gives it to you almost for free — every deploy writes to a name nothing else uses.</div>

<h3>Resuming rather than restarting</h3>
${slide('dv-02', 26, '--partial nối tiếp, --timeout biến treo thành lỗi')}
<pre><code><span class="tok-comment"># giu phan da chuyen duoc, lan sau di tiep tu do</span>
rsync -a --partial --partial-dir=.rsync-tam ./ vps:/srv/app/phat-hanh/&lt;ban&gt;/

<span class="tok-comment"># tu thu lai khi mang chap chon — 3 lan, cach nhau vai giay</span>
for i in 1 2 3; do
  rsync -a --partial ./ vps:"\$BAN/" &amp;&amp; break
  echo "lan \$i hong, cho \$((i * 5))s roi thu lai" &gt;&amp;2
  sleep \$((i * 5))
done</code></pre>
<div class="note-ct"><code>--partial</code> keeps a partially transferred file instead of deleting it, and <code>--partial-dir</code> keeps it somewhere that is not the destination path — so a resumed transfer picks up where it stopped without ever exposing a half-written file at the real name. Worth having on a slow or unreliable link, and unnecessary on a fast one where restarting costs a second.</div>
<div class="pitfall"><strong>Trap — a retry loop with no limit is worse than no retry loop.</strong> A deploy that retries forever against a server that is genuinely down does not fail; it hangs, holding the lock from earlier in this lesson, until someone notices. Bound the attempts, bound the total time, and make sure the final failure is loud. A deploy that fails clearly after thirty seconds is a better outcome than one that is still trying an hour later.</div>

<h3>What a transport can and cannot promise</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">It can promise per-file atomicity</span><span class="lz-lnote">rsync and git both write-then-rename, so no file is ever half-old and half-new. Measured in Lesson 2.1: zero partial files after a kill.</span></div>
  <div class="lz-layer"><span class="lz-lname">It cannot promise per-deploy atomicity</span><span class="lz-lnote">That has to come from the structure around it — a new directory plus a symlink swap. No transport flag gives it to you.</span></div>
  <div class="lz-layer"><span class="lz-lname">It cannot promise ordering</span><span class="lz-lnote">Measured above: the second deploy finished first. Ordering comes from a lock, not from the transport.</span></div>
  <div class="lz-layer"><span class="lz-lname">It cannot tell you whether the result works</span><span class="lz-lnote">A completed transfer means the bytes arrived. Lesson 0.3 measured three deploys where the bytes arrived perfectly and the site was broken.</span></div>
</div>
<h3>--partial-dir and --timeout, measured</h3>
<div class="out"># tep 8 MB · netem rate 4mbit · lan 1 bi giet sau 6 s, roi chay lai
  che do [mac dinh]: lan 1 bi giet sau 2761411 byte; lan 2 gui 9388456 byte, 17045 ms
-rw-r--r-- 1 deploy deploy 4096000 Sep 29 01:09 to.bin      # trong .rsync-tam/ luc bi giet
  che do [--partial-dir=.rsync-tam]: lan 1 bi giet sau 2705507 byte; lan 2 gui 5407864 byte, 8527 ms

# 30 MB dang chuyen thi mang mat 100% goi (netem loss 100%)
$ rsync -a --timeout=5 /tmp/lon.bin vps:/srv/app/t/
[sender] io timeout after 6 seconds -- exiting
rsync error: timeout in data send/receive (code 30) at io.c(201) [sender=3.2.7]
rc=30 sau 17 s
$ timeout 25 rsync -a /tmp/lon.bin vps:/srv/app/t2/          # KHONG co --timeout
rsync error: unexplained error (code 255) at rsync.c(716) [sender=3.2.7]
rc=124 sau 25 s</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Default: the half file is thrown away</span><span class="v">After the kill, nothing of <code>to.bin</code> remained on the server, and the second run sent the full 8 MB again: 17.0 s.</span></div>
  <div class="kv"><span class="k"><code>--partial-dir</code>: resumed</span><span class="v">4,096,000 bytes survived in <code>.rsync-tam/</code>, never under the real name; the second run used them as a basis and finished in 8.5 s — half the time.</span></div>
  <div class="kv"><span class="k"><code>--timeout=5</code>: a loud failure</span><span class="v">When every packet started vanishing, rsync gave up with exit 30 after 17 s in total — the timeout counts from the last data rsync managed to hand over, and the kernel's buffers kept accepting data for a while after the network died.</span></div>
  <div class="kv"><span class="k">No timeout: silence</span><span class="v">The same cut without <code>--timeout</code> was still waiting when <code>timeout 25</code> killed it — and without that outer limit it would have waited much longer, holding the deploy lock the whole time.</span></div>
</div>

<h3>Where the lock lives when you deploy from a laptop</h3>
<p>A lock only orders deploys if every deploy takes the <em>same</em> lock for the <em>whole</em> critical section — and the critical section is on the server. A lock file on your laptop does not see your teammate's laptop or the CI runner; a lock taken in one <code>ssh</code> call is released when that call ends, before the next <code>ssh</code> call swaps. The pattern that works: move bytes into a uniquely named release directory first (safe without a lock, since nobody else uses that name), then run the check-and-swap on the server in <strong>one</strong> SSH session that holds the lock from start to finish:</p>
<pre><code class="language-bash"># trao.sh — chay TREN may chu, trong MOT phien SSH, giu khoa tu dau toi cuoi
set -euo pipefail
BAN=$1
exec 9&gt;/var/lock/deploy.lock
flock -w 10 9 || { echo "[$BAN] cho 10 s van ban — DUNG" &gt;&amp;2; exit 1; }
echo "[$BAN] da giu khoa luc $(date +%T.%N | cut -c1-12)"
sleep 1                                   # gia lap: kiem + migration
ln -sfn "/srv/app/phat-hanh/$BAN" /srv/app/ht.moi &amp;&amp; mv -T /srv/app/ht.moi /srv/app/hien-tai
echo "[$BAN] tra khoa, hien-tai → $(basename "$(readlink /srv/app/hien-tai)")"</code></pre>
<div class="out">$ ssh vps "bash -s -- A" &lt; trao.sh &amp; sleep 0.2; ssh vps "bash -s -- B" &lt; trao.sh &amp; wait
[A] da giu khoa luc 01:33:06.591
[A] tra khoa, hien-tai → A
[B] da giu khoa luc 01:33:07.605
[B] tra khoa, hien-tai → B</div>
<p>Measured in the lab with two deploys started 200 ms apart: B waited for A's lock, took it a second later, and the newer release won. <code>/var/lock</code> on Ubuntu is <code>/run/lock</code>, a world-writable tmpfs, so the deploy user can create the file and a reboot clears it — and since the kernel drops an <code>flock</code> when the process dies, a crashed deploy never leaves a stale lock behind.</p>

<h3>Rehearse a broken network on purpose</h3>
<pre><code class="language-bash"># "laptop" rieng co quyen chinh mang (NET_ADMIN), cung mang Docker voi VPS
docker network create lab-net &amp;&amp; docker network connect lab-net vps-thu
docker run -d --name lap-thu --cap-add NET_ADMIN --network lab-net vps-thu
docker exec lap-thu sh -c 'apt-get update -qq &amp;&amp; apt-get install -y -qq iproute2; mkdir -p /root/.ssh'
docker cp khoa lap-thu:/root/.ssh/id_ed25519
docker exec lap-thu tc qdisc add dev eth0 root netem rate 4mbit      # mang cham
docker exec lap-thu sh -c 'head -c 2000000 /dev/urandom &gt; /tmp/a.bin; rsync -a \\
  -e "ssh -o StrictHostKeyChecking=accept-new" /tmp/a.bin deploy@vps-thu:/srv/app/'   # ~4,4 s
docker exec lap-thu tc qdisc change dev eth0 root netem loss 100%    # mang chet
docker exec lap-thu tc qdisc del dev eth0 root                       # tra lai

# tren Mac khong co tc: ham bang rsync, roi tu cat
rsync -a --bwlimit=100 rel/ vps:/srv/app/song/ &amp; sleep 3; kill $!</code></pre>
<p>A deploy you have only ever run on a perfect network is a deploy you have not tested. <code>netem</code> can also add delay (<code>delay 200ms</code>) or random loss (<code>loss 5%</code>), which is a cheap way to see how your script behaves on a school network before you depend on it there.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> during last week's deploy the Wi-Fi dropped, and afterwards the group's site threw errors nobody could reproduce locally. Rebuild that incident on the lab VPS, then make the next one harmless.</p><ol>
<li>Create 200 files marked <code>PHIEN BAN 1</code> in <code>rel/</code>, sync them to <code>/srv/app/song/</code>, then regenerate them as <code>PHIEN BAN 2</code>.</li>
<li>Run <code>rsync -a --bwlimit=100 rel/ vps:/srv/app/song/ &amp; sleep 3; kill $!</code> and count version-1 and version-2 files on the server with <code>grep -l</code>.</li>
<li>Repeat into <code>/srv/app/phat-hanh/b2/</code> with <code>--link-dest=../b1</code> while <code>hien-tai</code> points at <code>b1</code>; kill it the same way, check what <code>hien-tai</code> serves, run it again, then swap with <code>ln -sfn</code> + <code>mv -T</code>.</li>
<li>Copy <code>trao.sh</code> to your machine and run two deploys 200 ms apart, first with the <code>flock</code> lines removed, then with them.</li>
</ol>
<p><strong>Done when:</strong> you have a count showing the live directory as a mixture, proof that <code>hien-tai</code> never pointed at the half-filled <code>b2</code>, and two runs of the double deploy — the older release winning without the lock and the newer one winning with <code>flock -w</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Atomic operation</span><span class="v">One that either happens completely or not at all — <code>rename(2)</code> is, a directory-wide rsync is not.</span></div>
  <div class="kv"><span class="k">Race condition</span><span class="v">A result that depends on which of two concurrent actions finishes last, like two overlapping deploys.</span></div>
  <div class="kv"><span class="k">File lock (flock)</span><span class="v">A kernel-held lock on an open file descriptor, released automatically when the process exits.</span></div>
  <div class="kv"><span class="k">Idempotent</span><span class="v">Safe to repeat: running it again gives the same end state.</span></div>
  <div class="kv"><span class="k">Resume</span><span class="v">Continuing a transfer from what already arrived, which <code>--partial-dir</code> makes possible.</span></div>
  <div class="kv"><span class="k">Timeout</span><span class="v">A limit after which waiting becomes an error — <code>--timeout</code> for rsync, <code>timeout N</code> around anything.</span></div>
  <div class="kv"><span class="k">netem</span><span class="v">The Linux traffic-control module that fakes a slow, lossy or dead network for testing.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A transfer cut in the middle leaves every file whole and the directory mixed — 325 new files with 75 old ones when the network dropped after four seconds.</li>
<li>Transfer into a new release directory and swap afterwards: the cut becomes harmless, and "run it again" becomes the whole recovery procedure.</li>
<li>Two overlapping deploys can leave the older one live; a lock held on the server for the whole check-and-swap, with <code>flock -w</code>, makes the newest win.</li>
<li><code>--partial-dir</code> halved a resumed transfer (17.0 s → 8.5 s) without ever exposing a half-written file under its real name.</li>
<li><code>--timeout</code> turns a dead network into exit 30; without it the deploy just waits, lock and all.</li>
<li>Rehearse failures on purpose — <code>tc netem</code> in a container, or <code>--bwlimit</code> plus <code>kill</code> on a Mac.</li>
</ul>

<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">flock(1) and flock(2)</span><span class="lc-sub">man7.org/linux/man-pages/man1/flock.1.html — both forms, and the sentence explaining that the lock is released when the file descriptor closes.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — --partial, --partial-dir, --timeout</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — resumption, and the timeout that turns a hung transfer into a failed one.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Idempotence in operations</span><span class="lc-sub">en.wikipedia.org/wiki/Idempotence — the property that makes "just run it again" a safe instruction, and the reason it is worth designing for deliberately.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — file locks, traps and cleaning up on exit</span><span class="lc-sub">/courses/linux-bash/learn${REF} — how a shell script holds a resource safely and gives it back even when it is killed.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Khi đường vận chuyển hỏng nửa chừng</h2>
<p class="lead">Bài 2.1 đã đo thứ mà một lệnh rsync bị cắt ngang để lại: 310 tệp từ bản này và 90 tệp từ bản kia. Bài này nói nốt những cách khác mà một đường vận chuyển đi sai — và cái cách sinh ra kết cục kỳ lạ nhất, khi lần deploy bạn khởi động SAU lại không phải cái rốt cuộc đang chạy.</p>

<h3>Cắt đứt kết nối giữa chừng, đo lại</h3>
${slide('dv-02', 23, 'Đứt giữa chừng: 325 tệp mới trộn 75 tệp cũ')}
<p>Con số 310/90 của Bài 2.1 được chạy lại ngày 29/09/2026 với một nguyên nhân thật thà hơn một lệnh giết trơn: mạng của container laptop bị hãm còn 4 Mbit/s bằng <code>tc qdisc … netem</code>, 400 tệp phiên bản 2 được rsync đè lên 400 tệp phiên bản 1, và lần chuyển bị cắt sau bốn giây — đúng hình dạng một lần rớt Wi-Fi giữa lúc deploy. Rồi cùng cú cắt đó, nhưng vào một thư mục bản phát hành mới:</p>
<div class="out">$ sudo tc qdisc add dev eth0 root netem rate 4mbit   # gia lap mang cham
$ timeout -s KILL 4 rsync -a rel/ vps:/srv/app/song/
rsync rc=137 sau 4005 ms
  con PHIEN BAN 1: 75 tep
  da thanh PHIEN BAN 2: 325 tep
  tep tam con sot: 0

$ timeout -s KILL 4 rsync -a --link-dest=../b1 rel/ vps:/srv/app/r/phat-hanh/b2/
rc=137
hien-tai -&gt; /srv/app/r/phat-hanh/b1
  ban dang song co PHIEN BAN 2: 0 tep
  b2 (do dang) co: 365 tep
$ rsync -a --link-dest=../b1 rel/ vps:/srv/app/r/phat-hanh/b2/   # chay lai
rc=0
  b2: 400 tep PHIEN BAN 2
hien-tai -&gt; /srv/app/r/phat-hanh/b2</div>
<p>Thẳng vào thư mục đang chạy: 325 tệp mới, 75 tệp cũ, không tệp tạm nào — từng tệp nguyên vẹn, cả thư mục là một phiên bản chưa từng tồn tại. Vào thư mục bản phát hành: cú cắt để lại 365 tệp trong <code>b2</code> mà không ai đang phục vụ, bản đang sống vẫn có đúng 0 tệp phiên bản 2, và chỉ cần chạy lại đúng lệnh đó là <code>b2</code> đủ trước khi tráo. Hình dạng y hệt hiện ra từ một chiếc Mac dùng openrsync, hãm tốc độ bằng <code>--bwlimit</code> thay cho <code>tc</code>:</p>
<div class="out">$ rsync -a --bwlimit=100 rel/ vps:/srv/app/bw/ &amp; sleep 3; kill $!; wait $!; echo "rc=$?"
rc=20
$ ssh -F cfg vps 'cd /srv/app/bw; for b in 2 3; do echo "ban $b: $(grep -l "PHIEN BAN $b" m*.js | wc -l)"; done'
ban 2: 126
ban 3: 74</div>
<p>Mã thoát 20 là "bị một tín hiệu giết" của rsync. Tỉ lệ khác nhau mỗi lần chạy — 126 so với 74 ở đây — nhưng cứ cú cắt rơi vào giữa là chắc chắn có mớ trộn.</p>

<h3>Hai lần deploy cùng lúc</h3>
${slide('dv-02', 24, 'Hai lần deploy chồng nhau: bản CŨ thắng')}
<p>Hai lần deploy hai phiên bản khác nhau, khởi động cách nhau 150 ms. Cái thứ nhất chậm hơn; cái thứ hai xong trước:</p>
<div class="out">════ HAI lan deploy chay chong nhau, KHONG co khoa ════
  [B] xong, hien-tai → B
  [A] xong, hien-tai → A
  KET QUA: hien-tai → A
  noi dung dang duoc phuc vu: A</div>
<div class="callout warn"><strong>B được đẩy sau, xong trước, rồi A ghi đè lên nó.</strong> Production đang chạy A — lần deploy CŨ HƠN — và cái người đã deploy B thì đã nhìn thấy lần deploy của mình thành công. Không có gì hỏng cả. Cả hai script đều thoát ra 0, cả hai đều in một dòng thành công, và kết quả là thay đổi MỚI NHẤT không hề lên sóng. Nó sẽ ở nguyên như vậy cho tới khi có người deploy lại, mà thường là sáng hôm sau khi có ai đó phát hiện cái sửa lỗi bị thiếu.</div>
<p>Đây không phải một hình dạng hiếm. Nó xảy ra khi hai người cùng deploy, khi một job CI chồng lên một lần deploy tay, hoặc khi ai đó chạy lại một lần deploy mà họ tưởng đã hỏng. Kho mã này có một ca đo được: mười một lần bump phiên bản trong bốn tiếng rưỡi từ nhiều phiên làm việc, trong đó <em>MỘT bản chưa từng được phát hành</em> — con số phiên bản đã nhích lên, mọi người đều tin là đã ship, và người dùng nằm lại ở bản trước mà chẳng có chỗ nào đối chiếu hai thứ đó.</p>

<h3>Một cái khoá sửa được nó, và cái cờ quyết định ngữ nghĩa</h3>
${slide('dv-02', 25, 'flock -n bỏ cuộc, flock -w chờ tới lượt')}
<pre><code><span class="tok-comment"># mo mot mo ta tep tren tep khoa, roi giu khoa suot ca lan deploy</span>
exec 9&gt;/var/lock/deploy.lock
if ! flock -n 9; then
  echo "co lan deploy khac dang chay — DUNG" &gt;&amp;2
  exit 1
fi</code></pre>
<div class="out">════ cung tinh huong, nhung CO flock ════
  [B] co lan deploy khac dang chay — DUNG
  [A] xong, hien-tai → A
  KET QUA: hien-tai → A

════ va neu B CHO thay vi bo cuoc (flock -w 10) ════
  [A] xong, hien-tai → A
  [B] xong, hien-tai → B
  KET QUA: hien-tai → B</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>flock -n</code> — hỏng ngay lập tức</span><span class="v">B từ chối khởi động và nói rõ vì sao. Chỉ đúng MỘT lần deploy từng chạy, và cái bị từ chối thoát ra khác 0 nên CI đánh dấu nó là THẤT BẠI thay vì lặng lẽ chẳng làm gì.</span></div>
  <div class="kv"><span class="k"><code>flock -w 10</code> — chờ, rồi mới bỏ cuộc</span><span class="v">B chờ A xong rồi mới deploy. Kết quả là B — thay đổi mới nhất thắng, và đó gần như luôn là thứ bạn THẬT SỰ muốn.</span></div>
  <div class="kv"><span class="k">Cái khoá tự nhả</span><span class="v">Nó được giữ trên một mô tả tệp, nên nhân hệ điều hành nhả nó khi tiến trình thoát — kể cả khi sập, bị giết, hay rớt phiên SSH. Một tệp khoá bạn tự tạo và tự xoá thì KHÔNG có tính chất đó, và một cái còn sót lại sẽ chặn mọi lần deploy cho tới khi có người gỡ nó.</span></div>
  <div class="kv"><span class="k">Khoá trên MÁY CHỦ, không phải trên máy client</span><span class="v">Một cái khoá trên laptop của bạn không biết gì về lần deploy đang chạy từ CI. Tệp khoá phải sống trên chính cái máy đang được deploy vào.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — <code>flock file cmd</code> và <code>exec 9&gt;file; flock 9</code> KHÔNG giống nhau.</strong> Cái đầu chỉ giữ khoá trong đúng thời gian <code>cmd</code> chạy; nếu lần deploy của bạn gồm nhiều lệnh thì mỗi lệnh khoá rồi mở khoá, và những khoảng trống giữa chúng KHÔNG được bảo vệ. Dạng dùng mô tả tệp giữ khoá suốt vòng đời của shell, và đó mới là thứ một lần deploy nhiều bước cần. Và hãy đặt tệp khoá ở chỗ SỐNG SÓT được — <code>/var/lock</code> hoặc <code>/run</code> — chứ đừng đặt trong chính thư mục bản phát hành mà bạn sắp thay.</div>

<h3>Kiểu hỏng nào THỬ LẠI được an toàn</h3>
${slide('dv-02', 27, 'Bước nào chạy lại được an toàn')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Vận chuyển vào một thư mục bản phát hành MỚI</span><span class="lz-d">Hoàn toàn an toàn. Đích là một thư mục mới tinh chẳng ai đang phục vụ từ đó, và chạy lại sẽ ghi đè một bản chép dở bằng một bản đầy đủ. Chạy bao nhiêu lần tuỳ thích. Đây là ích lợi LỚN NHẤT của bố cục releases, ngoài chuyện lùi bản.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Cú tráo symlink</span><span class="lz-d">Tự nó đã bất biến khi lặp lại — trỏ một symlink vào đúng thư mục nó đang trỏ thì chẳng đổi gì, và <code>rename(2)</code> không thể xảy ra một nửa.</span></div>
  <div class="lz-step"><span class="lz-k">⚠</span><span class="lz-t">Vận chuyển thẳng đè lên thư mục ĐANG SỐNG</span><span class="lz-d">Thử lại làm cái trạng thái trộn lẫn ở Bài 2.1 <em>TRỘN THÊM</em> trong lúc nó chạy. Nó hội tụ NẾU chạy xong; nó nguy hiểm mỗi giây nó chưa xong. Thêm một lý do nữa để không deploy theo kiểu này.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Migration cơ sở dữ liệu</span><span class="lz-d">Nói chung KHÔNG an toàn để thử lại, và kiểu hỏng của nó tệ hơn mọi thứ trong chương này. Chương 5 nói đúng về chuyện đó — kể cả cái trạng thái mà một migration được ghi nhận là KHÔNG áp dụng cũng KHÔNG lùi lại, và mọi lần deploy sau đó đều từ chối chạy.</span></div>
</div>
<div class="callout ok"><strong>Hãy thiết kế bước vận chuyển sao cho THỬ LẠI luôn đúng.</strong> Khi đó một cú nghẽn mạng, một lần hết giờ, hay một cái nắp laptop trở thành phiền toái chứ không phải sự cố: chạy lại thôi. Tính chất bạn muốn là thao tác đó lặp lại bao nhiêu lần cũng cho ra cùng một trạng thái cuối, và bố cục releases đem lại điều đó gần như miễn phí — mọi lần deploy đều ghi vào một cái tên mà không ai khác dùng.</div>

<h3>Đi tiếp thay vì làm lại từ đầu</h3>
${slide('dv-02', 26, '--partial nối tiếp, --timeout biến treo thành lỗi')}
<pre><code><span class="tok-comment"># giu phan da chuyen duoc, lan sau di tiep tu do</span>
rsync -a --partial --partial-dir=.rsync-tam ./ vps:/srv/app/phat-hanh/&lt;ban&gt;/

<span class="tok-comment"># tu thu lai khi mang chap chon — 3 lan, cach nhau vai giay</span>
for i in 1 2 3; do
  rsync -a --partial ./ vps:"\$BAN/" &amp;&amp; break
  echo "lan \$i hong, cho \$((i * 5))s roi thu lai" &gt;&amp;2
  sleep \$((i * 5))
done</code></pre>
<div class="note-ct"><code>--partial</code> giữ lại một tệp chuyển dở thay vì xoá nó đi, còn <code>--partial-dir</code> giữ nó ở một chỗ KHÔNG phải đường dẫn đích — nên một lần chuyển tiếp tục sẽ nối vào chỗ nó dừng mà không bao giờ phơi ra một tệp viết dở mang đúng cái tên thật. Đáng có trên một đường truyền chậm hoặc chập chờn, và không cần thiết trên một đường nhanh mà làm lại từ đầu chỉ tốn một giây.</div>
<div class="pitfall"><strong>Bẫy — một vòng thử lại KHÔNG có giới hạn còn tệ hơn không có vòng thử lại nào.</strong> Một lần deploy cứ thử lại mãi mãi vào một máy chủ đang chết thật thì KHÔNG hỏng; nó TREO, giữ nguyên cái khoá ở phần trên bài này, cho tới khi có người phát hiện. Hãy chặn số lần, chặn tổng thời gian, và bảo đảm cú hỏng cuối cùng phải ỒN ÀO. Một lần deploy hỏng rõ ràng sau ba mươi giây là kết cục TỐT HƠN một lần vẫn còn đang thử sau một tiếng.</div>

<h3>Một đường vận chuyển hứa được gì và KHÔNG hứa được gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nó hứa được tính nguyên tử theo TỪNG TỆP</span><span class="lz-lnote">rsync và git đều ghi-rồi-đổi-tên, nên không tệp nào từng ở trạng thái nửa cũ nửa mới. Đo ở Bài 2.1: không sót tệp dở dang nào sau khi bị giết.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG hứa được tính nguyên tử theo LẦN DEPLOY</span><span class="lz-lnote">Cái đó phải tới từ CẤU TRÚC bao quanh nó — một thư mục mới cộng một cú tráo symlink. Không cờ vận chuyển nào đem lại cho bạn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG hứa được THỨ TỰ</span><span class="lz-lnote">Đo ở trên: lần deploy thứ hai xong trước. Thứ tự tới từ một cái KHOÁ, không tới từ đường vận chuyển.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG cho bạn biết kết quả có CHẠY không</span><span class="lz-lnote">Một lần chuyển hoàn tất nghĩa là các byte đã tới nơi. Bài 0.3 đã đo ba lần deploy mà các byte tới nơi hoàn hảo còn website thì hỏng.</span></div>
</div>
<h3>--partial-dir và --timeout, đo thật</h3>
<div class="out"># tep 8 MB · netem rate 4mbit · lan 1 bi giet sau 6 s, roi chay lai
  che do [mac dinh]: lan 1 bi giet sau 2761411 byte; lan 2 gui 9388456 byte, 17045 ms
-rw-r--r-- 1 deploy deploy 4096000 Sep 29 01:09 to.bin      # trong .rsync-tam/ luc bi giet
  che do [--partial-dir=.rsync-tam]: lan 1 bi giet sau 2705507 byte; lan 2 gui 5407864 byte, 8527 ms

# 30 MB dang chuyen thi mang mat 100% goi (netem loss 100%)
$ rsync -a --timeout=5 /tmp/lon.bin vps:/srv/app/t/
[sender] io timeout after 6 seconds -- exiting
rsync error: timeout in data send/receive (code 30) at io.c(201) [sender=3.2.7]
rc=30 sau 17 s
$ timeout 25 rsync -a /tmp/lon.bin vps:/srv/app/t2/          # KHONG co --timeout
rsync error: unexplained error (code 255) at rsync.c(716) [sender=3.2.7]
rc=124 sau 25 s</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Mặc định: tệp dở bị vứt đi</span><span class="v">Sau cú giết, trên máy chủ không còn gì của <code>to.bin</code>, và lần chạy thứ hai gửi lại đủ 8 MB: 17,0 s.</span></div>
  <div class="kv"><span class="k"><code>--partial-dir</code>: đi tiếp</span><span class="v">4.096.000 byte sống sót trong <code>.rsync-tam/</code>, không bao giờ mang tên thật; lần chạy thứ hai dùng chúng làm nền và xong trong 8,5 s — một nửa thời gian.</span></div>
  <div class="kv"><span class="k"><code>--timeout=5</code>: hỏng ỒN ÀO</span><span class="v">Khi mọi gói tin bắt đầu biến mất, rsync bỏ cuộc với mã 30 sau tổng cộng 17 s — thời hạn tính từ lần cuối rsync còn đẩy được dữ liệu đi, mà bộ đệm của nhân vẫn còn nhận thêm một lúc sau khi mạng đã chết.</span></div>
  <div class="kv"><span class="k">Không timeout: im lặng</span><span class="v">Cùng cú cắt mà không có <code>--timeout</code> thì vẫn còn đang chờ khi <code>timeout 25</code> giết nó — và nếu không có giới hạn bên ngoài đó, nó còn chờ lâu hơn nhiều, ôm cái khoá deploy suốt thời gian ấy.</span></div>
</div>

<h3>Cái khoá nằm ở đâu khi bạn deploy từ laptop</h3>
<p>Một cái khoá chỉ xếp được thứ tự các lần deploy nếu MỌI lần deploy lấy <em>CÙNG</em> một khoá cho <em>TOÀN BỘ</em> đoạn quan trọng — và đoạn quan trọng nằm trên máy chủ. Tệp khoá trên laptop của bạn không nhìn thấy laptop của bạn cùng nhóm hay máy chạy CI; khoá lấy trong một lệnh <code>ssh</code> bị nhả khi lệnh đó kết thúc, trước khi lệnh <code>ssh</code> kế tiếp làm bước tráo. Khuôn chạy được: chuyển byte vào một thư mục bản phát hành mang tên duy nhất trước (an toàn không cần khoá, vì không ai khác dùng tên đó), rồi chạy phần kiểm-và-tráo trên máy chủ trong <strong>MỘT</strong> phiên SSH giữ khoá từ đầu tới cuối:</p>
<pre><code class="language-bash"># trao.sh — chay TREN may chu, trong MOT phien SSH, giu khoa tu dau toi cuoi
set -euo pipefail
BAN=$1
exec 9&gt;/var/lock/deploy.lock
flock -w 10 9 || { echo "[$BAN] cho 10 s van ban — DUNG" &gt;&amp;2; exit 1; }
echo "[$BAN] da giu khoa luc $(date +%T.%N | cut -c1-12)"
sleep 1                                   # gia lap: kiem + migration
ln -sfn "/srv/app/phat-hanh/$BAN" /srv/app/ht.moi &amp;&amp; mv -T /srv/app/ht.moi /srv/app/hien-tai
echo "[$BAN] tra khoa, hien-tai → $(basename "$(readlink /srv/app/hien-tai)")"</code></pre>
<div class="out">$ ssh vps "bash -s -- A" &lt; trao.sh &amp; sleep 0.2; ssh vps "bash -s -- B" &lt; trao.sh &amp; wait
[A] da giu khoa luc 01:33:06.591
[A] tra khoa, hien-tai → A
[B] da giu khoa luc 01:33:07.605
[B] tra khoa, hien-tai → B</div>
<p>Đo trong phòng thí nghiệm với hai lần deploy khởi động cách nhau 200 ms: B chờ khoá của A, lấy được một giây sau, và bản mới hơn thắng. <code>/var/lock</code> trên Ubuntu chính là <code>/run/lock</code>, một tmpfs ai cũng ghi được, nên người dùng deploy tạo được tệp và khởi động lại là sạch — và vì nhân nhả <code>flock</code> khi tiến trình chết, một lần deploy sập không bao giờ để lại khoá mồ côi.</p>

<h3>Cố tình diễn tập một mạng hỏng</h3>
<pre><code class="language-bash"># "laptop" rieng co quyen chinh mang (NET_ADMIN), cung mang Docker voi VPS
docker network create lab-net &amp;&amp; docker network connect lab-net vps-thu
docker run -d --name lap-thu --cap-add NET_ADMIN --network lab-net vps-thu
docker exec lap-thu sh -c 'apt-get update -qq &amp;&amp; apt-get install -y -qq iproute2; mkdir -p /root/.ssh'
docker cp khoa lap-thu:/root/.ssh/id_ed25519
docker exec lap-thu tc qdisc add dev eth0 root netem rate 4mbit      # mang cham
docker exec lap-thu sh -c 'head -c 2000000 /dev/urandom &gt; /tmp/a.bin; rsync -a \\
  -e "ssh -o StrictHostKeyChecking=accept-new" /tmp/a.bin deploy@vps-thu:/srv/app/'   # ~4,4 s
docker exec lap-thu tc qdisc change dev eth0 root netem loss 100%    # mang chet
docker exec lap-thu tc qdisc del dev eth0 root                       # tra lai

# tren Mac khong co tc: ham bang rsync, roi tu cat
rsync -a --bwlimit=100 rel/ vps:/srv/app/song/ &amp; sleep 3; kill $!</code></pre>
<p>Một quy trình deploy bạn mới chỉ chạy trên mạng hoàn hảo là một quy trình bạn CHƯA kiểm. <code>netem</code> còn thêm được độ trễ (<code>delay 200ms</code>) hay mất gói ngẫu nhiên (<code>loss 5%</code>) — cách rẻ để xem script của bạn cư xử thế nào ở mạng trường trước khi phải trông vào nó ở đó.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trong lần deploy tuần trước Wi-Fi bị rớt, và sau đó web của nhóm báo những lỗi không ai tái hiện được trên máy mình. Hãy dựng lại sự cố đó trên VPS thí nghiệm, rồi làm cho lần sau vô hại.</p><ol>
<li>Tạo 200 tệp đánh dấu <code>PHIEN BAN 1</code> trong <code>rel/</code>, đồng bộ vào <code>/srv/app/song/</code>, rồi sinh lại chúng thành <code>PHIEN BAN 2</code>.</li>
<li>Chạy <code>rsync -a --bwlimit=100 rel/ vps:/srv/app/song/ &amp; sleep 3; kill $!</code> và đếm số tệp bản 1 và bản 2 trên máy chủ bằng <code>grep -l</code>.</li>
<li>Làm lại vào <code>/srv/app/phat-hanh/b2/</code> với <code>--link-dest=../b1</code> trong khi <code>hien-tai</code> đang trỏ vào <code>b1</code>; giết nó y như vậy, kiểm <code>hien-tai</code> đang phục vụ gì, chạy lại, rồi tráo bằng <code>ln -sfn</code> + <code>mv -T</code>.</li>
<li>Chép <code>trao.sh</code> về máy và chạy hai lần deploy cách nhau 200 ms, lần đầu bỏ các dòng <code>flock</code>, lần sau giữ chúng.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có con số cho thấy thư mục đang chạy thành mớ trộn, bằng chứng <code>hien-tai</code> chưa bao giờ trỏ vào <code>b2</code> đang dở, và hai lần chạy deploy kép — bản cũ hơn thắng khi không khoá, bản mới hơn thắng với <code>flock -w</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Atomic operation (thao tác nguyên tử)</span><span class="v">Thao tác hoặc xảy ra trọn vẹn hoặc không xảy ra — <code>rename(2)</code> là vậy, rsync cả thư mục thì không.</span></div>
  <div class="kv"><span class="k">Race condition (tình trạng đua)</span><span class="v">Kết quả phụ thuộc việc nào trong hai việc chạy đồng thời xong SAU CÙNG, như hai lần deploy chồng nhau.</span></div>
  <div class="kv"><span class="k">File lock — flock (khoá tệp)</span><span class="v">Khoá do nhân giữ trên một mô tả tệp đang mở, tự nhả khi tiến trình thoát.</span></div>
  <div class="kv"><span class="k">Idempotent (lặp lại an toàn)</span><span class="v">Chạy lại bao nhiêu lần cũng ra cùng một trạng thái cuối.</span></div>
  <div class="kv"><span class="k">Resume (đi tiếp)</span><span class="v">Chuyển nối từ phần đã tới nơi, điều <code>--partial-dir</code> làm cho khả thi.</span></div>
  <div class="kv"><span class="k">Timeout (giới hạn chờ)</span><span class="v">Mốc mà quá nó thì chờ đợi trở thành lỗi — <code>--timeout</code> của rsync, <code>timeout N</code> bọc quanh bất cứ lệnh nào.</span></div>
  <div class="kv"><span class="k">netem (giả lập mạng)</span><span class="v">Mô-đun điều khiển lưu lượng của Linux, giả một mạng chậm, mất gói hay chết hẳn để thử nghiệm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một lần chuyển bị cắt giữa chừng để mọi tệp nguyên vẹn còn thư mục thì trộn — 325 tệp mới với 75 tệp cũ khi mạng rớt sau bốn giây.</li>
<li>Chuyển vào thư mục bản phát hành mới rồi mới tráo: cú cắt trở nên vô hại, và "chạy lại đi" trở thành toàn bộ quy trình phục hồi.</li>
<li>Hai lần deploy chồng nhau có thể để bản CŨ lên sóng; một cái khoá giữ trên máy chủ cho trọn phần kiểm-và-tráo, với <code>flock -w</code>, làm bản mới nhất thắng.</li>
<li><code>--partial-dir</code> rút một lần chuyển nối tiếp còn một nửa (17,0 s → 8,5 s) mà không bao giờ phơi tệp viết dở dưới tên thật.</li>
<li><code>--timeout</code> biến một mạng chết thành mã thoát 30; thiếu nó, lần deploy cứ chờ, ôm theo cả cái khoá.</li>
<li>Diễn tập hỏng hóc có chủ đích — <code>tc netem</code> trong container, hoặc <code>--bwlimit</code> cộng <code>kill</code> trên Mac.</li>
</ul>

<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">flock(1) và flock(2)</span><span class="lc-sub">man7.org/linux/man-pages/man1/flock.1.html — cả hai dạng, và cái câu giải thích rằng khoá được nhả khi mô tả tệp đóng lại.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — --partial, --partial-dir, --timeout</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — chuyện đi tiếp, và cái timeout biến một lần chuyển bị treo thành một lần chuyển hỏng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tính bất biến khi lặp lại trong vận hành</span><span class="lc-sub">en.wikipedia.org/wiki/Idempotence — cái tính chất làm cho câu "cứ chạy lại đi" thành một chỉ dẫn an toàn, và lý do nó đáng được thiết kế một cách có chủ ý.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — khoá tệp, trap và dọn dẹp lúc thoát</span><span class="lc-sub">/courses/linux-bash/learn${REF} — một script shell giữ một tài nguyên an toàn thế nào và trả lại nó ra sao ngay cả khi bị giết.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.6 ─────────────────────────── */
    {
      title: '2.6 — Quiz: transport|||2.6 — Quiz: vận chuyển',
      slug: 'deploy-2-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống: 100 byte chèn vào đầu tệp 20 MB, --delete liệt kê ảnh người dùng, dấu / cuối bị quên, post-receive hỏng mà push vẫn thoát 0, hook mang CRLF, COPY . . đặt sai chỗ, tag bị dời, ba đường đo cạnh nhau, rsync đứt giữa chừng và hai lần deploy chồng nhau.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.6</span>
<h2>Quiz: transport</h2>
<p class="lead">Ten situations taken from the chapter's lab — every output quoted in these questions was recorded on 29/09/2026 on Ubuntu 24.04 containers, Docker-in-Docker machines with a local registry, and a Mac. Most ask what an output means or which fix is right; reading output is the skill this chapter builds.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> rsync's rolling checksum sent 22 KB to sync a 20 MB file after a 100-byte change in the middle, and only <strong>18 KB with 100 literal bytes</strong> after inserting 100 bytes at the front — which shifts every byte and defeats a naive block comparison (2.1). Its two dangers are silent: <code>--delete</code> removed a user's uploaded image without asking, and a killed transfer left 310 files on one release and 90 on another — atomic per file, never per deploy (2.1). A bare repository plus a fifteen-line <code>post-receive</code> hook is a complete deploy, but the hook runs <em>after</em> the objects are accepted, so a failing hook does not fail the push (2.2). Container layers are content-addressed: two 29 MB images packaged together are 29 MB, because only the 857-byte source layer differed — and one <code>COPY . .</code> before <code>npm ci</code> destroys that entirely (2.3). Both transports took about 300 ms because the SSH handshake dominates, and the first attempt at comparing them was wrong: it timed a first sync against a delta (2.4). And two overlapping deploys produced the worst outcome of the chapter — the one started second finished first, the older one overwrote it, and production ran the older code while both deploys reported success (2.5).</p>
</div>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain from <code>--stats</code> output why rsync sent 18 KB for a 20 MB file whose every byte moved, and when that saving disappears.</li>
<li>I can read a <code>-n -i --delete</code> plan, spot a <code>*deleting</code> line I did not intend, and fix it with <code>protect</code> or by moving runtime state out of the deploy directory.</li>
<li>I can set up a bare repository with a <code>post-receive</code> hook and say which hook can reject a push and which cannot.</li>
<li>I can explain why a one-line change pushed 27 KB to a registry, and what a misplaced <code>COPY . .</code> costs.</li>
<li>I can compare transports fairly and choose one by what may reach production and what the server needs.</li>
<li>I can make an interrupted transfer harmless (new directory + symlink) and two concurrent deploys safe (<code>flock -w</code> on the server).</li>
</ul>
${slide('dv-02', 29, 'Bảng tra nhanh Chương 2 (1/2): rsync')}
${slide('dv-02', 30, 'Bảng tra nhanh Chương 2 (2/2): git, registry, khoá')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.6</span>
<h2>Quiz: vận chuyển</h2>
<p class="lead">Mười tình huống lấy từ phòng thí nghiệm của chương — mọi output trích trong câu hỏi đều được ghi ngày 29/09/2026 trên container Ubuntu 24.04, các máy Docker-trong-Docker có registry cục bộ, và một chiếc Mac. Phần lớn hỏi một output nghĩa là gì hoặc cách sửa nào đúng; đọc output là kỹ năng chương này xây cho bạn.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Mã kiểm tra kiểu cuộn của rsync gửi 22 KB để đồng bộ một tệp 20 MB sau khi đổi 100 byte ở giữa, và chỉ <strong>18 KB với đúng 100 byte nguyên bản</strong> sau khi CHÈN 100 byte vào đầu — việc làm dịch chuyển mọi byte và đánh bại một phép so khối ngây thơ (2.1). Hai mối nguy của nó đều CÂM: <code>--delete</code> gỡ mất một tấm ảnh người dùng đã tải lên mà không hỏi han, và một lần chuyển bị giết để lại 310 tệp của bản này và 90 tệp của bản kia — nguyên tử theo TỪNG TỆP, không bao giờ theo lần deploy (2.1). Một kho trần cộng một hook <code>post-receive</code> mười lăm dòng là một quy trình deploy hoàn chỉnh, nhưng hook chạy <em>SAU KHI</em> các đối tượng đã được nhận, nên một hook hỏng KHÔNG làm lần push hỏng theo (2.2). Các lớp container được định địa chỉ theo nội dung: hai cái ảnh 29 MB đóng gói chung vẫn là 29 MB, vì chỉ lớp mã nguồn 857 byte là khác — và một dòng <code>COPY . .</code> đặt trước <code>npm ci</code> phá sạch chuyện đó (2.3). Cả hai đường vận chuyển đều mất khoảng 300 ms vì cái bắt tay SSH chiếm phần lớn, và lần đầu đem chúng ra so là SAI: nó bấm giờ một lần đồng bộ ĐẦU TIÊN đấu với một phần CHÊNH LỆCH (2.4). Và hai lần deploy chồng nhau sinh ra kết cục tệ nhất chương — cái khởi động sau lại xong trước, cái cũ hơn ghi đè lên nó, và production chạy mã cũ trong khi CẢ HAI lần deploy đều báo thành công (2.5).</p>
</div>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được từ output <code>--stats</code> vì sao rsync chỉ gửi 18 KB cho một tệp 20 MB mà mọi byte đã dời chỗ, và khi nào khoản tiết kiệm đó biến mất.</li>
<li>Tôi đọc được một kế hoạch <code>-n -i --delete</code>, nhận ra dòng <code>*deleting</code> mình không định, và sửa bằng <code>protect</code> hoặc bằng cách đưa trạng thái lúc chạy ra ngoài thư mục deploy.</li>
<li>Tôi dựng được một kho trần với hook <code>post-receive</code> và nói được hook nào từ chối được lần push, hook nào không.</li>
<li>Tôi giải thích được vì sao một thay đổi một dòng chỉ đẩy 27 KB lên registry, và một dòng <code>COPY . .</code> đặt sai chỗ tốn bao nhiêu.</li>
<li>Tôi so được các đường vận chuyển cho công bằng và chọn theo thứ gì được lên production cùng thứ máy chủ phải có.</li>
<li>Tôi biến được một lần chuyển bị cắt thành vô hại (thư mục mới + symlink) và hai lần deploy đồng thời thành an toàn (<code>flock -w</code> trên máy chủ).</li>
</ul>
${slide('dv-02', 29, 'Bảng tra nhanh Chương 2 (1/2): rsync')}
${slide('dv-02', 30, 'Bảng tra nhanh Chương 2 (2/2): git, registry, khoá')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You insert 100 bytes at the very start of a 20 MB file and rsync it to the VPS. --stats prints "Literal data: 100 bytes" and "Total bytes sent: 18,115". What made that possible?|||Bạn chèn 100 byte vào đúng đầu một tệp 20 MB rồi rsync lên VPS. --stats in "Literal data: 100 bytes" và "Total bytes sent: 18,115". Điều gì làm được chuyện đó?',
            options: [
              'rsync saw the same modification time and skipped the old part of the file|||rsync thấy cùng giờ sửa nên bỏ qua phần cũ của tệp',
              'The -z compression shrank the shifted data to 18 KB|||Nén -z thu phần dữ liệu bị dời chỗ xuống còn 18 KB',
              'A rolling weak checksum tested every byte offset of the new file, found each old block at its new position, and confirmed it with a strong checksum|||Một mã kiểm tra yếu kiểu cuộn thử MỌI vị trí byte của tệp mới, tìm ra từng khối cũ ở vị trí mới của nó, rồi xác nhận bằng mã kiểm tra mạnh',
              'rsync detected an insertion at the front and sent a diff patch like git does|||rsync phát hiện một đoạn chèn ở đầu và gửi một bản vá diff như git',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: A block comparison at fixed positions would match nothing after the shift; the rolling checksum slides one byte at a time, so every original block is found at offset +100 and only the 100 new bytes travel literally. Compression is the tempting answer, but -z was not used — and the same insertion with --whole-file (algorithm off) sent 20,005,198 bytes.|||VI: So khối ở vị trí cố định thì sau khi dời chỗ không khớp được khối nào; mã kiểm tra cuộn trượt từng byte, nên mọi khối gốc được tìm thấy ở vị trí +100 và chỉ 100 byte mới phải đi nguyên bản. Nén là đáp án hấp dẫn, nhưng lệnh không hề dùng -z — và cùng cú chèn đó với --whole-file (tắt thuật toán) đã gửi 20.005.198 byte.',
          },
          {
            question: 'Before a deploy you run rsync -an --delete --itemize-changes dist/ vps:/srv/app/web/ and see "*deleting tai-len/quan-trong.jpg", "*deleting .env" and "exit=0". What is the right fix?|||Trước khi deploy bạn chạy rsync -an --delete --itemize-changes dist/ vps:/srv/app/web/ và thấy "*deleting tai-len/quan-trong.jpg", "*deleting .env" và "exit=0". Cách sửa đúng là gì?',
            options: [
              'Protect what the server creates (--filter="protect tai-len/", --filter="protect .env"), and better still, move uploads and .env out of the directory a deploy writes to|||Bảo vệ những gì máy chủ tự tạo (--filter="protect tai-len/", --filter="protect .env"), và tốt hơn nữa, đưa ảnh tải lên và .env ra ngoài thư mục mà deploy ghi vào',
              'Nothing — a dry run exaggerates; the real run skips files it did not create|||Không cần gì — chạy thử hay phóng đại; lần chạy thật bỏ qua những tệp nó không tạo ra',
              'Add -z so rsync compares the files more carefully|||Thêm -z để rsync so sánh tệp kỹ hơn',
              'Replace --delete with --checksum, which keeps extra files|||Thay --delete bằng --checksum, cờ này giữ lại tệp thừa',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: --delete makes the destination match the source, so anything the source lacks is listed for deletion — the dry run is exactly what the real run will do, and exit 0 means "plan made", not "plan safe". protect rules stop the receiver deleting those paths; keeping runtime state outside the deploy directory removes the risk altogether. --checksum only changes how files are compared, not what is deleted.|||VI: --delete làm đích khớp nguồn, nên mọi thứ nguồn không có đều bị liệt kê để xoá — lần chạy thử chính là việc lần chạy thật sẽ làm, và exit 0 nghĩa là "đã lập kế hoạch", không phải "kế hoạch an toàn". Luật protect ngăn phía nhận xoá những đường dẫn đó; đưa trạng thái lúc chạy ra ngoài thư mục deploy thì dẹp hẳn rủi ro. --checksum chỉ đổi cách so tệp, không đổi thứ bị xoá.',
          },
          {
            question: 'A teammate deploys with rsync -a dist vps:/srv/app/web/, the command exits 0, yet nginx (root /srv/app/web) still serves yesterday’s index.html. Why?|||Một bạn deploy bằng rsync -a dist vps:/srv/app/web/, lệnh thoát 0, vậy mà nginx (root /srv/app/web) vẫn phục vụ index.html của hôm qua. Vì sao?',
            options: [
              'nginx caches index.html until it is reloaded|||nginx giữ index.html trong bộ đệm cho tới khi được nạp lại',
              'rsync skipped index.html because size and time were unchanged|||rsync bỏ qua index.html vì cỡ và giờ không đổi',
              'The deploy user has no permission to overwrite index.html|||Người dùng deploy không có quyền ghi đè index.html',
              'Without a trailing slash on the source, rsync copied the directory itself, so the new file is at web/dist/index.html and web/index.html is untouched|||Thiếu dấu / cuối ở nguồn, rsync chép chính cái thư mục, nên tệp mới nằm ở web/dist/index.html còn web/index.html không hề bị đụng tới',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured in the lab: "rsync -a dist vps:/srv/app/s1/" produced s1/dist/index.html, while "dist/" produced s1/index.html. The quick-check answer is tempting, but a rebuilt file almost always has a new modification time; and a permission problem would make rsync print an error and exit non-zero, not 0.|||VI: Đo trong phòng thí nghiệm: "rsync -a dist vps:/srv/app/s1/" cho ra s1/dist/index.html, còn "dist/" cho ra s1/index.html. Đáp án "so nhanh" nghe hấp dẫn, nhưng tệp dựng lại gần như luôn có giờ sửa mới; còn lỗi quyền thì rsync sẽ in lỗi và thoát khác 0, không phải 0.',
          },
          {
            question: 'git push prints "remote:   [post-receive] build HONG", then " * [new branch] master -> master", and echo $? prints 0. What happened?|||git push in "remote:   [post-receive] build HONG", rồi " * [new branch] master -> master", và echo $? in 0. Chuyện gì đã xảy ra?',
            options: [
              'The push was rejected; git only prints the ref line for information|||Lần push bị từ chối; git chỉ in dòng ref để tham khảo',
              'The commit was stored and the branch updated; post-receive runs afterwards, so its failure cannot reject anything — a check that must block belongs in pre-receive|||Commit đã được lưu và nhánh đã cập nhật; post-receive chạy SAU đó nên nó hỏng cũng không từ chối được gì — phép kiểm cần chặn phải nằm trong pre-receive',
              'git will retry the hook on the next push automatically|||git sẽ tự chạy lại hook ở lần push kế tiếp',
              'The repository is half-updated and must be repaired with git fsck|||Kho đang cập nhật dở và phải sửa bằng git fsck',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured: a post-receive that exits 1 produced no warning at all, the ref line, and exit code 0. The same check in pre-receive produced "! [remote rejected] … (pre-receive hook declined)" and exit 1. Git does not retry hooks — a second push of the same commit says "Everything up-to-date" and the hook does not run again.|||VI: Đo thật: post-receive thoát 1 không sinh cảnh báo nào, vẫn in dòng ref, và mã thoát 0. Cùng phép kiểm đó đặt trong pre-receive sinh ra "! [remote rejected] … (pre-receive hook declined)" và mã thoát 1. Git không tự chạy lại hook — push lại đúng commit đó chỉ in "Everything up-to-date" và hook không chạy nữa.',
          },
          {
            question: 'A teammate on Windows writes the post-receive hook and uploads it. ls -l shows it executable, yet every push prints "fatal: cannot exec ’hooks/post-receive’: No such file or directory" and nothing deploys. Most likely cause?|||Một bạn dùng Windows viết hook post-receive rồi tải lên. ls -l cho thấy nó có quyền chạy, vậy mà lần push nào cũng in "fatal: cannot exec ’hooks/post-receive’: No such file or directory" và không có gì được deploy. Nguyên nhân khả dĩ nhất?',
            options: [
              'The hook is not executable; git ignores it|||Hook không có quyền chạy; git bỏ qua nó',
              'bash is not installed on the VPS|||VPS chưa cài bash',
              'The file has CRLF line endings, so the kernel looks for an interpreter named "/bin/bash\\r"; fix with .gitattributes eol=lf or sed -i "s/\\r$//"|||Tệp có kết thúc dòng CRLF, nên nhân đi tìm trình thông dịch tên "/bin/bash\\r"; sửa bằng .gitattributes eol=lf hoặc sed -i "s/\\r$//"',
              'The bare repository path in the remote URL is wrong|||Đường dẫn kho trần trong URL remote bị sai',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Reproduced in the lab: od -c showed "\\r \\n" after "#!/bin/bash", and the push printed exactly that fatal line and still exited 0. A missing execute bit gives a different message — "hint: The ’hooks/post-receive’ hook was ignored because it’s not set as executable" — and a wrong repository path would fail the push itself.|||VI: Dựng lại trong phòng thí nghiệm: od -c cho thấy "\\r \\n" sau "#!/bin/bash", và lần push in đúng dòng fatal đó mà vẫn thoát 0. Thiếu quyền chạy cho câu khác hẳn — "hint: The ’hooks/post-receive’ hook was ignored because it’s not set as executable" — còn sai đường dẫn kho thì chính lần push sẽ hỏng.',
          },
          {
            question: 'With COPY . . placed before RUN npm ci, pushing a one-line change sent 1,997,645 bytes; with package*.json copied and installed first, the same change sent 27,420 bytes. Why?|||Với COPY . . đặt trước RUN npm ci, đẩy một thay đổi một dòng tốn 1.997.645 byte; khi chép package*.json và cài thư viện trước, cùng thay đổi đó chỉ tốn 27.420 byte. Vì sao?',
            options: [
              'Any changed file invalidates the COPY . . layer and every layer after it, so npm ci re-runs and the dependency layer gets a new digest the registry does not have|||Bất kỳ tệp nào đổi cũng làm vô hiệu lớp COPY . . và mọi lớp sau nó, nên npm ci chạy lại và lớp thư viện nhận một digest mới mà registry chưa có',
              'The registry does not deduplicate layers that come from npm|||Registry không khử trùng lặp các lớp sinh ra từ npm',
              'The node:22-alpine base image is re-uploaded on every push|||Ảnh nền node:22-alpine bị tải lên lại ở mỗi lần push',
              'COPY . . compresses worse than COPY src/|||COPY . . nén kém hơn COPY src/',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Layers are content-addressed; once one layer changes, every later layer is rebuilt. In the measured push the base layers still answered "Layer already exists" — the extra ~2 MB was the re-built npm ci layer. Blaming the base image is the tempting mistake: it is shared and never travels twice.|||VI: Lớp được định địa chỉ theo nội dung; một lớp đổi thì mọi lớp sau nó bị dựng lại. Trong lần push đã đo, các lớp nền vẫn trả lời "Layer already exists" — khoảng 2 MB thêm ra là lớp npm ci vừa dựng lại. Đổ lỗi cho ảnh nền là cái sai hấp dẫn: nó được dùng chung và không bao giờ đi hai lần.',
          },
          {
            question: 'Last week the VPS pulled dat-lich:prod. Today someone pushed a new build under the same tag; docker pull prints "Downloaded newer image" and the app now reports v2. How do you make deploys reproducible and rollbacks exact?|||Tuần trước VPS kéo dat-lich:prod. Hôm nay có người đẩy một bản dựng mới dưới đúng tag đó; docker pull in "Downloaded newer image" và app giờ báo v2. Làm sao để deploy tái lập được và lùi bản chính xác?',
            options: [
              'Use :latest everywhere so every server always gets the newest build|||Dùng :latest mọi nơi để máy nào cũng luôn nhận bản mới nhất',
              'Deploy by digest (image@sha256:…) and record it per deploy; keep readable tags for humans|||Deploy theo digest (image@sha256:…) và ghi lại nó cho mỗi lần deploy; giữ tag dễ đọc cho con người',
              'Stop pulling and copy the image files over with rsync|||Thôi kéo ảnh, chép tệp ảnh sang bằng rsync',
              'Turn off the registry cache so tags cannot change|||Tắt bộ đệm registry để tag không đổi được nữa',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: A tag is a movable pointer — measured in the lab: the same "docker pull …:prod" returned v1, then v2 a minute later, while the pull by @sha256:dd73… returned the original bytes. :latest is the worst version of the problem, since it names no version at all; registries have no setting that freezes tags.|||VI: Tag là con trỏ dời được — đo trong phòng thí nghiệm: cùng lệnh "docker pull …:prod" trả về v1, rồi v2 một phút sau, còn kéo theo @sha256:dd73… thì nhận lại đúng bộ byte ban đầu. :latest là dạng tệ nhất của vấn đề, vì nó chẳng gọi tên phiên bản nào; registry cũng không có thiết lập nào đóng băng tag.',
          },
          {
            question: 'Measured on a one-line change: git push 204 ms, rsync 233 ms, while ssh vps true alone takes 183 ms. What should the group conclude?|||Đo trên một thay đổi một dòng: git push 204 ms, rsync 233 ms, còn chỉ riêng ssh vps true đã mất 183 ms. Nhóm nên kết luận gì?',
            options: [
              'git is 12% faster, so it should always be preferred|||git nhanh hơn 12%, nên lúc nào cũng nên chọn git',
              'rsync is slower because -z costs CPU|||rsync chậm hơn vì -z tốn CPU',
              'A registry would be slowest because the image is 63 MB|||Registry sẽ chậm nhất vì ảnh nặng 63 MB',
              'Most of the time is the SSH handshake, so speed does not separate them; choose by what may reach production and what the server must have|||Phần lớn thời gian là cú bắt tay SSH, nên tốc độ không phân biệt được chúng; hãy chọn theo thứ gì được lên production và máy chủ phải có gì',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: 183 of 204 ms and 183 of 233 ms are the handshake alone — 80–90%. The registry answer is tempting but wrong for the second deploy: only missing layers travel, and the measured one-line push took 79 ms with 27 KB. Speed differences at this scale are noise next to what each transport lets reach production.|||VI: 183 trên 204 ms và 183 trên 233 ms chỉ là cú bắt tay — 80–90%. Đáp án registry nghe hấp dẫn nhưng sai với lần deploy thứ hai: chỉ các lớp còn thiếu mới đi, và lần push một dòng đã đo mất 79 ms với 27 KB. Chênh lệch tốc độ ở quy mô này chỉ là nhiễu so với việc mỗi đường cho phép thứ gì lên production.',
          },
          {
            question: 'An rsync straight into the live /srv/app/song is cut after 4 s by a network drop. On the server: "con PHIEN BAN 1: 75 tep", "da thanh PHIEN BAN 2: 325 tep", "tep tam con sot: 0". Which statement is correct?|||Một lệnh rsync thẳng vào thư mục đang chạy /srv/app/song bị cắt sau 4 s vì rớt mạng. Trên máy chủ: "con PHIEN BAN 1: 75 tep", "da thanh PHIEN BAN 2: 325 tep", "tep tam con sot: 0". Câu nào đúng?',
            options: [
              'The 75 old files are half-written and will fail to parse|||75 tệp cũ đang bị viết dở và sẽ lỗi cú pháp',
              'rsync rolled the directory back to version 1 when the connection dropped|||rsync đã lùi thư mục về phiên bản 1 khi mất kết nối',
              'Every file is whole, but together they form a version that never existed; transfer into a new release directory and swap the symlink afterwards|||Từng tệp đều nguyên vẹn, nhưng gộp lại là một phiên bản chưa từng tồn tại; hãy chuyển vào một thư mục bản phát hành mới rồi mới tráo symlink',
              'The temporary files must be removed by hand before the site works again|||Phải xoá tay các tệp tạm thì web mới chạy lại',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: rsync writes each file to a temporary name and renames it into place, so no file is half-written and no temporary file survived (0) — but the directory is a mixture. The same cut into phat-hanh/b2 left hien-tai on b1 with zero version-2 files, and re-running completed b2 before the swap. There is no automatic rollback.|||VI: rsync ghi mỗi tệp ra một tên tạm rồi đổi tên vào chỗ, nên không tệp nào viết dở và không tệp tạm nào sót lại (0) — nhưng cả thư mục là một mớ trộn. Cùng cú cắt đó vào phat-hanh/b2 thì hien-tai vẫn ở b1 với 0 tệp phiên bản 2, và chạy lại là b2 đủ trước khi tráo. Không hề có lùi bản tự động.',
          },
          {
            question: 'Deploy A starts; deploy B (newer) starts 150 ms later and finishes first; then A swaps the symlink and production runs A. Which change makes the newest deploy win every time?|||Deploy A khởi động; deploy B (mới hơn) khởi động sau 150 ms và xong trước; rồi A tráo symlink và production chạy A. Thay đổi nào làm lần deploy mới nhất luôn thắng?',
            options: [
              'flock -n on each developer’s laptop|||flock -n trên laptop của từng người',
              'On the server, exec 9>/var/lock/deploy.lock; flock -w 10 9 around the whole check-and-swap, so B waits for A and swaps after it|||Trên máy chủ, exec 9>/var/lock/deploy.lock; flock -w 10 9 bao trọn phần kiểm-và-tráo, để B chờ A rồi tráo sau nó',
              'Add --partial so the slower deploy resumes faster|||Thêm --partial để lần deploy chậm hơn đi tiếp nhanh hơn',
              'Wrap each deploy in a retry loop|||Bọc mỗi lần deploy trong một vòng thử lại',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured: without a lock A won; with flock -w 10 on the server A finished first and B swapped after it, so B was live. flock -n also prevents the overlap, but B is refused and A stays live. A lock on a laptop cannot see the other laptop or CI, and retries or --partial change nothing about ordering.|||VI: Đo thật: không khoá thì A thắng; có flock -w 10 trên máy chủ thì A xong trước và B tráo sau nó, nên B lên sóng. flock -n cũng ngăn được chuyện chồng nhau, nhưng B bị từ chối và A vẫn ở lại. Khoá trên laptop không nhìn thấy laptop kia hay CI, còn thử lại hay --partial chẳng đổi gì về thứ tự.',
          },
        ],
      },
    },
  ],
};
