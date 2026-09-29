const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';
/**
 * Deploy VPS — Chương 7: Cái script deploy.
 * Mọi số đo là ĐO THẬT trong hộp cát: bash 5.2 trên /srv/vps/kb, một ứng dụng
 * Node bốn route ở 127.0.0.1:3340, và script trien-khai.sh chạy hết mọi nhánh
 * hỏng của chính nó — kể cả hai con bọ mà việc chạy thử tìm ra.
 *
 * Nâng cấp 29/09/2026: bài 7.0 slide (deck dv-07, 32 slide) + slide/🧪/🗂/📌 trong 7.1–7.5; đào sâu: SHA rỗng do
 * local x=$() + ShellCheck SC2155, bảng khai triển ${X:?}, CRLF từ Windows, macOS bash 3.2; bảng thao tác chạy lại
 * (useradd 9, git clone 128), ảnh chụp trạng thái + diff, khi nào sinh/chắn/kiểm trước, mv -T/sed -i trên Mac;
 * echo y | không phải đồng ý + read -p không in lời hỏi + ssh không -t, ba chốt git (10/11/12), df -BG làm tròn lên,
 * flock -n/-w, kill -9 với khoá tệp và fd thừa hưởng, pgrep -f tự khớp, sysexits 75; curl từng cờ (000/7/28, -f
 * biến 401 thành 22), đọc danh sách kiểm bằng git show "$SHA:tệp", date %N trên Mac; ghi mốc production bằng SHA
 * đã khoá (push HEAD vs $SHA), sửa script đang chạy (bash đọc theo byte), khi nào bash là đúng công cụ; quiz 10 câu.
 * Output MỚI chạy thật trong container ubuntu:24.04 (dv07-vps, bash 5.2.21) và trên Mac M1 (macOS 27).
 * LUẬT: backtick → &#96;; ${ của bash → \${; < > & trong code → &lt; &gt; &amp;; gạch chéo ngược viết đôi.
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 7 — The deploy script: failing loudly, and being safe to run twice|||Chương 7 — Script deploy: hỏng thật to, và chạy hai lần vẫn an toàn',
  slug: 'deploy-ch7-script',
  description: 'Một script deploy có bốn việc mà không việc nào là "deploy": DỪNG khi có gì sai, CHẠY LẠI ĐƯỢC, TỪ CHỐI khi điều kiện chưa đủ, và CHỨNG MINH nó đã chạy. Chương này đo từng cái, và tìm ra hai con bọ trong chính script của tôi bằng cách chạy thử các nhánh hỏng.',
  sortOrder: 8,
  lessons: [

    /* ─────────────────────────── 7.0 ─────────────────────────── */
    {
      title: '7.0 — Chapter 7 slides: the deploy script in pictures|||7.0 — Slide Chương 7: script deploy bằng hình',
      slug: 'deploy-7-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 7: cờ shell và SHA rỗng, chạy hai lần rồi so trạng thái máy, từ chối khi không có terminal, ba chốt git, df -BG làm tròn lên, khoá flock và vòng chờ pgrep tự khớp, kiểm khói 401/404/000, trap lùi cả tiến trình, ghi mốc production bằng SHA đã khoá.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">A deploy script has four jobs and none of them is "deploy": stop when something is wrong, be safe to run again, refuse when a precondition is missing, and prove what it did. These slides show each job as a measurement — the run that exits 0 while shipping an empty commit ID, the <code>diff</code> that catches a config file growing on every run, the disk check that lets 1.1 GB pass as "2G", the waiting loop that waits for itself.</p>
<p>Slides 3–6 belong to Lesson 7.1 (what each shell flag catches, <code>local x=$(…)</code>, <code>\${X:?}</code>, CRLF), 7–11 to 7.2 (loud and quiet re-run failures, generating instead of editing, preparing on the side, diffing the machine), 12–17 to 7.3 (refusing without a terminal, the three git gates, <code>df -BG</code>, <code>flock</code>, a killed lock holder, <code>pgrep -f</code>), 18–22 to 7.4 (401/404/000, curl flag by flag, the checker that cannot run, reading the checklist from the right commit, logs) and 23–28 to 7.5 (the five steps and their exit codes, the cleanup trap, every failure branch, symlink versus process, the deployed marker, editing a running script). The last four are the common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 29/09/2026 on the "lab VPS" — an Ubuntu 24.04 container with sshd that the Mac reaches over SSH like a rented server — plus three measurements on a Mac M1.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Một script deploy có bốn việc mà không việc nào là "deploy": DỪNG khi có gì sai, CHẠY LẠI được, TỪ CHỐI khi thiếu điều kiện, và CHỨNG MINH nó đã làm gì. Bộ slide này cho thấy từng việc dưới dạng một phép đo — lần chạy thoát 0 trong khi đem một mã commit RỖNG đi deploy, cái <code>diff</code> bắt được tệp cấu hình to dần sau mỗi lần chạy, chốt đĩa cho 1,1 GB qua như thể "2G", vòng chờ ngồi chờ chính nó.</p>
<p>Slide 3–6 thuộc Bài 7.1 (mỗi cờ shell bắt được gì, <code>local x=$(…)</code>, <code>\${X:?}</code>, CRLF), 7–11 thuộc 7.2 (hỏng ồn ào và hỏng im lặng khi chạy lại, sinh thay vì sửa, chuẩn bị ở bên lề, so trạng thái máy), 12–17 thuộc 7.3 (từ chối khi không có terminal, ba chốt git, <code>df -BG</code>, <code>flock</code>, kẻ giữ khoá bị giết, <code>pgrep -f</code>), 18–22 thuộc 7.4 (401/404/000, curl từng cờ, bộ kiểm không chạy được, đọc danh sách kiểm từ đúng commit, nhật ký) và 23–28 thuộc 7.5 (năm bước và mã thoát, trap dọn dẹp, mọi nhánh hỏng, symlink với tiến trình, mốc đã lên production, sửa script đang chạy). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal là output THẬT, ghi ngày 29/09/2026 trên "VPS thí nghiệm" — một container Ubuntu 24.04 có sshd mà máy Mac SSH vào như một máy chủ thuê — cộng ba phép đo trên Mac M1.</p>
</div>
${gallery('dv-07', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Không cờ nào: ba cú hỏng, vẫn thoát 0'], [4, 'local x=$(…): không cờ nào cứu nổi'], [5, 'Biến rỗng: $GOC/ban-cu thành /ban-cu'], [6, 'Đầu tệp deploy và tệp CRLF'],
  [7, 'Chạy lại: hỏng ồn ào hay im lặng'], [8, 'Năm lần sạch, năm dòng PATH'], [9, 'Idempotent: trạng thái cuối chỉ theo tham số'], [10, 'Chuẩn bị ở bên lề, tráo ở cuối'], [11, 'Chạy hai lần rồi so trạng thái máy'],
  [12, '[y/N] không terminal: từ chối'], [13, 'Ba chốt git'], [14, 'df -BG làm tròn lên'], [15, 'Hai deploy cùng lúc: flock'], [16, 'kill -9 và cái khoá'], [17, 'Vòng chờ pgrep tự khớp'],
  [18, '401 đạt · 404 bản cũ · 000'], [19, 'Vòng kiểm khói, từng cờ curl'], [20, 'Bộ kiểm không chạy được'], [21, 'Danh sách kiểm từ đúng commit'], [22, 'Nhật ký có giờ, set -x có số dòng'],
  [23, 'Năm bước và mã thoát'], [24, 'trap don_dep lùi cả tiến trình'], [25, 'Chạy từng nhánh hỏng A–E'], [26, 'Symlink đã về, tiến trình thì chưa'], [27, 'Ghi mốc production bằng SHA đã khoá'], [28, 'Đừng sửa script đang chạy'],
  [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh (1/2)'], [31, 'Bảng tra nhanh (2/2)'], [32, 'Thực hành chương 7'],
])}
`,
    },

    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — What each shell flag actually catches|||7.1 — Mỗi cờ của shell THẬT SỰ bắt được gì',
      slug: 'deploy-7-1-co-shell',
      type: 'VIDEO',
      description: 'Bốn cách một script bash đi tiếp sau khi hỏng, đo từng cái với từng tổ hợp cờ. Rồi cái bảng cho thấy set -euo pipefail VẪN nuốt một ca — và đúng ca đó nằm trong mọi script bash có hàm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>What each shell flag actually catches</h2>
<p class="lead">A deploy script that keeps going after a failed step is worse than no script, because it produces a confident success message on top of a broken machine. Bash keeps going by default. Here is exactly what it takes to stop it, measured flag by flag.</p>

<h3>The three failures, and which flag sees which</h3>
${slide('dv-07', 3, 'Không cờ nào: ba cú hỏng, vẫn thoát 0')}
<p>One script with three ways to fail — a broken pipe, an unset variable, and a command that returns non-zero — run under five combinations of flags:</p>

<pre><code class="language-bash">false | true               <span class="tok-comment"># can pipefail</span>
echo -n "ong:qua "
: \${CHUA_DAT}              <span class="tok-comment"># can -u</span>
echo -n "bien:qua "
ls /khong-co 2>/dev/null   <span class="tok-comment"># can -e</span>
echo -n "lenh:qua "</code></pre>

<div class="out">set (khong co)    → ong:qua bien:qua lenh:qua  | ma thoat: 0
set -e            → ong:qua bien:qua  | ma thoat: 2
set -u            → ong:qua t.sh: line 5: CHUA_DAT: unbound variable | ma thoat: 1
set -e -o pipefail→  | ma thoat: 1
set -euo pipefail →  | ma thoat: 1</div>

<p>Read the first line: with no flags, all three failures pass straight through and the script exits <strong>0</strong>. Anything checking the exit code — CI, a wrapper script, a human looking at a green tick — concludes the deploy succeeded.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">-e (errexit)</span><span class="lz-lnote">stop when a command returns non-zero. Does not see failures inside a pipe, and is suspended inside <code>if</code>, <code>&amp;&amp;</code>, <code>||</code> and <code>!</code></span></div>
<div class="lz-layer"><span class="lz-lname">-u (nounset)</span><span class="lz-lnote">stop when an unset variable is expanded. This is the flag that prevents <code>rm -rf "\$GOC/x"</code> becoming <code>rm -rf /x</code></span></div>
<div class="lz-layer"><span class="lz-lname">-o pipefail</span><span class="lz-lnote">a pipeline returns the first non-zero status, not the last command&#39;s. Without it, <code>tar … | ssh …</code> reports success when tar died</span></div>
<div class="lz-layer"><span class="lz-lname">-x (xtrace)</span><span class="lz-lnote">print each command as it runs — not a safety flag, a diagnosis flag (7.4)</span></div>
</div>

<h3>The unset variable is the one that deletes things</h3>
<p>The second flag deserves its own demonstration, because its failure mode is not "the script stops early", it is "the script does something catastrophic and reports success":</p>

<div class="out">4) bien chua dat thanh chuoi rong: rm -rf '\$GOC/xxx' → 'rm -rf /xxx'
   GOC chua dat, duong dan tinh ra: '/xxx'
  ma thoat: 0</div>

<p>A typo in a variable name, or a variable set in a different branch of an <code>if</code>, and the path you built is rooted at <code>/</code>. Exit code 0. This is the single most famous class of shell disaster, and <code>-u</code> is the one-word fix.</p>

<div class="pitfall">
<p><strong>Trap — <code>-u</code> alone does not protect an interpolation you guarded wrongly.</strong> <code>\${GOC:-}</code> explicitly defaults to empty and silences <code>-u</code>, which is correct when you mean it and a disaster when you copied it from somewhere. For a path you are about to delete, use <code>\${GOC:?}</code> instead — it aborts with a message naming the variable. That is why the rollback script in 6.5 wrote <code>rm -rf "\${BO_DEM:?}"/*</code> and not <code>rm -rf "\$BO_DEM"/*</code>.</p>
</div>

<h3>The case that survives all four flags</h3>
<p>Here is where it gets uncomfortable. Run the same failing command five ways, with and without <code>shopt -s inherit_errexit</code>:</p>

<div class="out">--- KHONG co inherit_errexit ---
x=\$(...) o cap tren            → ma 2
local x=\$(...) trong ham       → ma 0   QUA
x=\$(...) trong ham             → ma 2
\$( ) co nhieu lenh             → ma 0   QUA
--- CO inherit_errexit ---
x=\$(...) o cap tren            → ma 2
local x=\$(...) trong ham       → ma 0   QUA
x=\$(...) trong ham             → ma 2
\$( ) co nhieu lenh             → ma 2
--- cach chac chan: tach local va gan ---
local x; x=\$(...)              → ma 2</div>

<p>Three things to take from that table. First, <code>x=\$(cmd)</code> <em>does</em> propagate the failure — the folklore that command substitution always swallows errors is wrong, and I believed it until I measured. Second, <code>inherit_errexit</code> fixes the multi-command case <code>y=\$(cmd; echo hi)</code>, which is a real improvement. Third, and this is the one that matters: <strong><code>local x=\$(cmd)</code> exits 0 in every configuration.</strong></p>

<p>The reason is that <code>local</code> is itself a command, and its exit status — success, it declared a variable — overwrites the substitution&#39;s. There is no flag for this. The fix is to split the declaration from the assignment:</p>

<pre><code class="language-bash"><span class="tok-comment"># NUOT loi, bat ke co gi:</span>
f() { local x=\$(lenh-co-the-hong); }
<span class="tok-comment"># BAO loi:</span>
f() { local x; x=\$(lenh-co-the-hong); }</code></pre>

<div class="callout warn">
<p><strong>Why this matters more than it looks.</strong> Every non-trivial deploy script has functions, and inside functions people write <code>local</code> by reflex — correctly, because it prevents variables leaking between functions. So the single most common line shape in a well-written bash script is also the one place <code>set -euo pipefail</code> silently stops working. Search your deploy script for <code>local .*=\$(</code> right now.</p>
</div>

<h3>The other suspension: conditions</h3>
<p><code>set -e</code> is deliberately turned off inside anything the shell treats as a test:</p>

<div class="out">3) VAN CHAY — set -e bi treo trong dieu kien if</div>

<p>That is correct behaviour — <code>if grep -q x file; then</code> would be unusable otherwise — but it means a command that <em>fails for the wrong reason</em> inside a condition looks like a plain false. <code>if curl -sf "\$URL"; then</code> is false when the URL returns 500, and equally false when <code>curl</code> is not installed. 7.4 measures what that costs.</p>

<h3>The line to put at the top</h3>
${slide('dv-07', 6, 'Đầu tệp deploy — và tệp CRLF từ Windows')}
<pre><code>#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit 2>/dev/null || true   <span class="tok-comment"># bash>=4.4; may cu thi bo qua</span>
IFS=\$'\\n\\t'                                     <span class="tok-comment"># tuy chon: tach truong khong theo dau cach</span></code></pre>

<p>The <code>2>/dev/null || true</code> on the third line is not decoration: <code>inherit_errexit</code> arrived in bash 4.4, and macOS still ships bash 3.2 as <code>/bin/bash</code>. Without the guard, a script that is trying to be careful dies on line 3 on the developer machine.</p>

<div class="kv-grid">
<div class="kv"><span class="k">-e</span><span class="v">stops on a failing command; suspended inside conditions</span></div>
<div class="kv"><span class="k">-u</span><span class="v">stops on an unset variable; use <code>\${X:?}</code> for paths you delete</span></div>
<div class="kv"><span class="k">-o pipefail</span><span class="v">a pipeline fails if any stage fails</span></div>
<div class="kv"><span class="k">inherit_errexit</span><span class="v">covers <code>y=\$(cmd; cmd)</code>; does NOT cover <code>local x=\$(cmd)</code></span></div>
</div>

<h3>Run it yourself: the empty SHA that ships</h3>
${slide('dv-07', 4, 'local x=$(…): không cờ nào cứu nổi — đo trên VPS thí nghiệm')}
<p>The <code>local</code> case above is abstract until you see what it does inside a deploy script. The most common function in any deploy script reads the commit it is about to ship. Here it is, with every flag turned on, run on the lab VPS in a directory that is not a git repository — the same thing that happens when the script is started from the wrong folder, or when a CI runner checks out a tarball instead of a clone:</p>
<pre><code class="language-bash">#!/bin/bash
set -euo pipefail
lay_ban() {
  local sha=$(git rev-parse HEAD)
  echo "$sha"
}
lay_ban</code></pre>
<div class="out">$ bash sc.sh; echo "ma thoat: $?"
fatal: not a git repository (or any of the parent directories): .git

ma thoat: 0</div>
<ul>
<li><strong>Read the empty line.</strong> <code>git</code> failed with exit 128 and printed to stderr; <code>local</code> succeeded; the function printed an empty SHA and the script finished with 0. In a real deploy the next lines would build an image tagged <code>app:</code>, push it, and record "production is running <em>(nothing)</em>".</li>
<li><strong>ShellCheck finds it in a second.</strong> <code>shellcheck sc.sh</code> prints <code>SC2155 (warning): Declare and assign separately to avoid masking return values.</code> and exits 1 — cheap enough to run on every save.</li>
<li><strong>Split the line and the flag works again.</strong> With <code>local sha</code> on one line and <code>sha=$(git rev-parse HEAD)</code> on the next, the same run stops at the <code>git</code> call with <strong>exit 128</strong>, and ShellCheck exits 0.</li>
</ul>

<h3>Parameter expansion for paths you are about to delete</h3>
${slide('dv-07', 5, 'Biến rỗng: $GOC/ban-cu thành /ban-cu — \${:?} chặn lại')}
<p>Five ways to write the same variable, and what each does when it is unset or empty. This is the table to have in your head whenever a deploy script builds a path it will pass to <code>rm</code>, <code>rsync --delete</code> or <code>mv</code>:</p>
<table>
<thead><tr><th>Written as</th><th>Unset</th><th>Set but empty</th><th>Use it for</th></tr></thead>
<tbody>
<tr><td><code>$GOC</code> with <code>set -u</code></td><td>stops</td><td>continues with ""</td><td>ordinary values</td></tr>
<tr><td><code>\${GOC:-}</code></td><td>""</td><td>""</td><td>deliberately optional values — it silences <code>-u</code></td></tr>
<tr><td><code>\${GOC:-/srv/app}</code></td><td>default</td><td>default</td><td>a safe default exists</td></tr>
<tr><td><code>\${GOC:?message}</code></td><td>stops, prints message</td><td>stops, prints message</td><td><strong>every path you delete or overwrite</strong></td></tr>
<tr><td><code>\${1:?usage: deploy.sh &lt;release&gt;}</code></td><td>stops</td><td>stops</td><td>required arguments</td></tr>
</tbody></table>
<p>Measured on the lab VPS, with the variable copied from somewhere else in its "optional" form:</p>
<pre><code class="language-bash">GOC="\${GOC_DEPLOY:-}"          # chép từ đâu đó: mặc định RỖNG
echo "se xoa: \${GOC}/ban-cu"
rm -rf "\${GOC:?GOC chua dat — tu choi xoa}/ban-cu"</code></pre>
<div class="out">se xoa: /ban-cu
goc.sh: line 5: GOC: GOC chua dat — tu choi xoa
ma thoat: 1</div>
<p>The echo shows the path the script <em>would</em> have used — <code>/ban-cu</code>, at the root of the machine — and the <code>:?</code> refuses on the very next line. Notice that <code>set -u</code> was on the whole time and did nothing: <code>:-</code> had already turned "unset" into "empty", and empty is a value.</p>

<h3>On macOS and Windows</h3>
<ul>
<li><strong>macOS ships bash 3.2 as <code>/bin/bash</code></strong> (measured on this Mac: <code>GNU bash, version 3.2.57</code>). A deploy script that runs <em>on your laptop</em> should start with <code>#!/usr/bin/env bash</code> so it picks up the bash 5 from Homebrew when it is installed, and keep the <code>shopt -s inherit_errexit 2&gt;/dev/null || true</code> guard for when it is not. The part that runs on the VPS gets Ubuntu&#39;s bash 5.2 either way.</li>
<li><strong>A teammate on Windows saves the script with CRLF line endings.</strong> Measured on the lab VPS with a three-line script saved that way:
<div class="out">$ bash crlf.sh 2&gt;&amp;1 | cat -A
crlf.sh: line 2: set: pipefail^M: invalid option name$
$ ./crlf.sh 2&gt;&amp;1 | cat -A
bash: line 1: ./crlf.sh: cannot execute: required file not found$</div>
The first error is the invisible <code>\\r</code> (shown as <code>^M</code>) glued to <code>pipefail</code>. The second is worse because it names nothing useful: the kernel looked for an interpreter called <code>/bin/bash\\r</code>. Fix the file with <code>sed -i 's/\\r$//' deploy.sh</code>, and fix the cause once with a line in <code>.gitattributes</code>: <code>*.sh text eol=lf</code>.</li>
<li><strong>ShellCheck</strong> is <code>brew install shellcheck</code> on the Mac and <code>apt install shellcheck</code> on Ubuntu or inside WSL. Two commands before every run of an edited deploy script: <code>bash -n deploy.sh</code> (syntax only) and <code>shellcheck deploy.sh</code>.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the night before your SWP391 defence, a teammate&#39;s deploy script "finished successfully" and the demo site is still on yesterday&#39;s version. You suspect the script is lying. Build the lab VPS once — the whole chapter reuses it:</p>
<pre><code class="language-bash">mkdir -p ~/dv-lab7 &amp;&amp; cd ~/dv-lab7
ssh-keygen -t ed25519 -N "" -f ./khoa -q          # khoá CHỈ cho phòng thí nghiệm
cat &gt; Dockerfile &lt;&lt;'EOF'
FROM ubuntu:24.04
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends openssh-server curl git \\
    ca-certificates procps nodejs shellcheck iproute2 \\
 &amp;&amp; mkdir -p /run/sshd &amp;&amp; useradd -m -s /bin/bash deploy &amp;&amp; mkdir -p /home/deploy/.ssh
COPY khoa.pub /home/deploy/.ssh/authorized_keys
RUN chown -R deploy /home/deploy/.ssh &amp;&amp; chmod 700 /home/deploy/.ssh \\
 &amp;&amp; mkdir -p /srv/app &amp;&amp; chown deploy /srv/app
CMD ["/usr/sbin/sshd", "-D", "-e"]
EOF
docker build -t dv07-img .
docker run -d --name dv07-vps --memory 512m --tmpfs /srv/dia:size=1300m,uid=1000 \\
  -p 127.0.0.1:19072:22 dv07-img
alias vps='ssh -i ./khoa -o UserKnownHostsFile=./known_hosts -p 19072 deploy@127.0.0.1'
vps 'bash --version | head -1'</code></pre>
<div class="out">GNU bash, version 5.2.21(1)-release (aarch64-unknown-linux-gnu)</div>
<ol>
<li>On the VPS, create <code>sc.sh</code> from this lesson and run it from your home directory (not a git repository): <code>vps 'bash sc.sh; echo "ma thoat: $?"'</code>. Write down the exit code.</li>
<li>Run <code>vps 'shellcheck sc.sh'</code>. Split the <code>local</code> line in two as ShellCheck suggests and run the script again.</li>
<li>Create <code>goc.sh</code> from this lesson and run it. Then confirm nothing was deleted: <code>vps 'ls -d /ban-cu'</code>.</li>
<li>Make a CRLF copy: <code>vps 'printf "#!/bin/bash\\r\\nset -euo pipefail\\r\\necho xin chao\\r\\n" &gt; crlf.sh; bash crlf.sh 2&gt;&amp;1 | cat -A'</code>, then repair it with <code>sed -i 's/\\r$//' crlf.sh</code> and run it again.</li>
</ol>
<p><strong>Done when:</strong> you have four facts written down — the broken <code>sc.sh</code> exits <strong>0</strong> and the fixed one exits <strong>128</strong>; <code>goc.sh</code> exits 1 with the message naming <code>GOC</code> and <code>/ban-cu</code> does not exist; and the CRLF script shows <code>pipefail^M</code> before the repair and prints <code>xin chao</code> after it.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">errexit (<code>-e</code>)</span><span class="v">Stop the script when a command returns non-zero — suspended inside conditions.</span></div>
  <div class="kv"><span class="k">nounset (<code>-u</code>)</span><span class="v">Stop when an unset variable is expanded.</span></div>
  <div class="kv"><span class="k">pipefail</span><span class="v">A pipeline fails if any stage fails, not only the last one.</span></div>
  <div class="kv"><span class="k">Command substitution <code>$(…)</code></span><span class="v">Run a command and use its output as a value; its exit status can be masked by <code>local</code>.</span></div>
  <div class="kv"><span class="k">Parameter expansion <code>\${X:?}</code></span><span class="v">Use a variable, but abort with a message if it is unset or empty.</span></div>
  <div class="kv"><span class="k">ShellCheck / SC2155</span><span class="v">A static checker for shell scripts; SC2155 is the warning for <code>local x=$(cmd)</code>.</span></div>
  <div class="kv"><span class="k">CRLF</span><span class="v">Windows line ending <code>\\r\\n</code>; bash reads the <code>\\r</code> as part of the word.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>With no flags, a broken pipe, an unset variable and a failing command all pass and the script exits 0.</li>
<li><code>set -euo pipefail</code> stops most of them — but <code>local x=$(cmd)</code> exits 0 under every flag; split declaration and assignment.</li>
<li>In a deploy script that bug ships an empty commit SHA with a green result; ShellCheck SC2155 finds it in a second.</li>
<li><code>\${X:-}</code> silences <code>-u</code>; every path you delete should be written <code>\${X:?}</code>.</li>
<li>macOS runs bash 3.2 as <code>/bin/bash</code>; use <code>#!/usr/bin/env bash</code> and keep the <code>inherit_errexit</code> guard.</li>
<li>CRLF from Windows breaks a script with confusing errors; <code>*.sh text eol=lf</code> in <code>.gitattributes</code> prevents it.</li>
</ul>


<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bash Reference Manual — The Set Builtin</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#The-Set-Builtin — the normative list of when <code>-e</code> is suspended. It is longer than most people expect; worth reading the whole paragraph.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bash Reference Manual — The Shopt Builtin, inherit_errexit</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#The-Shopt-Builtin — added in bash 4.4, which is why the guard above exists.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">BashFAQ 105 — Why does set -e not do what I expected?</span><span class="lc-sub">mywiki.wooledge.org/BashFAQ/105 — the canonical catalogue of errexit surprises, including the <code>local</code> case measured above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ShellCheck</span><span class="lc-sub">shellcheck.net — SC2155 is exactly the <code>local x=\$(cmd)</code> warning. Running it over a deploy script takes seconds and is the cheapest review in this course.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — exit codes, pipes and quoting</span><span class="lc-sub">/courses/linux-bash/learn${REF} — where the pipeline exit status comes from, and why unquoted expansion is the other half of this problem.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Mỗi cờ của shell THẬT SỰ bắt được gì</h2>
<p class="lead">Một script deploy cứ đi tiếp sau một bước hỏng thì tệ hơn là không có script, vì nó đẻ ra một dòng báo thành công đầy tự tin đặt lên trên một cái máy đang hỏng. Bash MẶC ĐỊNH là đi tiếp. Đây là chính xác những gì cần để bắt nó dừng, đo từng cờ một.</p>

<h3>Ba kiểu hỏng, và cờ nào thấy cái nào</h3>
${slide('dv-07', 3, 'Không cờ nào: ba cú hỏng, vẫn thoát 0')}
<p>Một script với ba cách hỏng — một cái ống gãy, một biến chưa đặt, và một lệnh trả về khác không — chạy dưới năm tổ hợp cờ:</p>

<pre><code class="language-bash">false | true               <span class="tok-comment"># can pipefail</span>
echo -n "ong:qua "
: \${CHUA_DAT}              <span class="tok-comment"># can -u</span>
echo -n "bien:qua "
ls /khong-co 2>/dev/null   <span class="tok-comment"># can -e</span>
echo -n "lenh:qua "</code></pre>

<div class="out">set (khong co)    → ong:qua bien:qua lenh:qua  | ma thoat: 0
set -e            → ong:qua bien:qua  | ma thoat: 2
set -u            → ong:qua t.sh: line 5: CHUA_DAT: unbound variable | ma thoat: 1
set -e -o pipefail→  | ma thoat: 1
set -euo pipefail →  | ma thoat: 1</div>

<p>Đọc dòng đầu: không cờ nào, cả ba cú hỏng đi thẳng qua và script thoát <strong>0</strong>. Bất cứ thứ gì kiểm mã thoát — CI, một script bọc ngoài, một con người nhìn dấu tích xanh — đều kết luận là deploy thành công.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">-e (errexit)</span><span class="lz-lnote">dừng khi một lệnh trả khác không. Không thấy được cú hỏng bên trong ống, và bị TREO trong <code>if</code>, <code>&amp;&amp;</code>, <code>||</code> và <code>!</code></span></div>
<div class="lz-layer"><span class="lz-lname">-u (nounset)</span><span class="lz-lnote">dừng khi khai triển một biến chưa đặt. Đây là cái cờ ngăn <code>rm -rf "\$GOC/x"</code> thành <code>rm -rf /x</code></span></div>
<div class="lz-layer"><span class="lz-lname">-o pipefail</span><span class="lz-lnote">một ống trả về trạng thái khác-không ĐẦU TIÊN, không phải của lệnh cuối. Thiếu nó, <code>tar … | ssh …</code> báo thành công trong khi tar đã chết</span></div>
<div class="lz-layer"><span class="lz-lname">-x (xtrace)</span><span class="lz-lnote">in ra từng lệnh khi nó chạy — không phải cờ an toàn, mà là cờ chẩn đoán (7.4)</span></div>
</div>

<h3>Biến chưa đặt mới là cái đi XOÁ đồ</h3>
<p>Cờ thứ hai xứng đáng có màn trình diễn riêng, vì kiểu hỏng của nó không phải "script dừng sớm", mà là "script làm một chuyện thảm hoạ RỒI báo thành công":</p>

<div class="out">4) bien chua dat thanh chuoi rong: rm -rf '\$GOC/xxx' → 'rm -rf /xxx'
   GOC chua dat, duong dan tinh ra: '/xxx'
  ma thoat: 0</div>

<p>Một lỗi gõ trong tên biến, hoặc một biến được đặt ở nhánh KHÁC của một câu <code>if</code>, và cái đường dẫn bạn ghép ra cắm gốc ở <code>/</code>. Mã thoát 0. Đây là lớp thảm hoạ shell nổi tiếng nhất, và <code>-u</code> là cách chữa một chữ.</p>

<div class="pitfall">
<p><strong>Bẫy — riêng <code>-u</code> KHÔNG bảo vệ được một chỗ nội suy bạn đã chắn SAI.</strong> <code>\${GOC:-}</code> mặc định về rỗng một cách tường minh và làm câm <code>-u</code>, đúng khi bạn CỐ Ý và là thảm hoạ khi bạn chép nó từ đâu đó về. Với một đường dẫn sắp bị xoá, hãy dùng <code>\${GOC:?}</code> — nó bỏ dở kèm một dòng gọi tên cái biến. Đó là lý do script lùi bản ở 6.5 viết <code>rm -rf "\${BO_DEM:?}"/*</code> chứ không phải <code>rm -rf "\$BO_DEM"/*</code>.</p>
</div>

<h3>Cái ca sống sót qua CẢ BỐN cờ</h3>
<p>Đây là chỗ bắt đầu khó chịu. Chạy cùng một lệnh hỏng theo năm cách, có và không có <code>shopt -s inherit_errexit</code>:</p>

<div class="out">--- KHONG co inherit_errexit ---
x=\$(...) o cap tren            → ma 2
local x=\$(...) trong ham       → ma 0   QUA
x=\$(...) trong ham             → ma 2
\$( ) co nhieu lenh             → ma 0   QUA
--- CO inherit_errexit ---
x=\$(...) o cap tren            → ma 2
local x=\$(...) trong ham       → ma 0   QUA
x=\$(...) trong ham             → ma 2
\$( ) co nhieu lenh             → ma 2
--- cach chac chan: tach local va gan ---
local x; x=\$(...)              → ma 2</div>

<p>Ba điều rút ra từ bảng đó. Thứ nhất, <code>x=\$(cmd)</code> <em>CÓ</em> truyền lỗi ra — cái truyền miệng rằng thay thế lệnh luôn nuốt lỗi là SAI, và tôi tin nó cho tới lúc đem đo. Thứ hai, <code>inherit_errexit</code> chữa được ca nhiều lệnh <code>y=\$(cmd; echo hi)</code>, và đó là một cải thiện thật. Thứ ba, và đây mới là cái quan trọng: <strong><code>local x=\$(cmd)</code> thoát 0 trong MỌI cấu hình.</strong></p>

<p>Lý do là <code>local</code> tự nó là một LỆNH, và trạng thái thoát của nó — thành công, nó vừa khai báo một biến — ghi đè lên trạng thái của phép thay thế. Không có cờ nào cho chuyện này. Cách chữa là tách khai báo khỏi phép gán:</p>

<pre><code class="language-bash"><span class="tok-comment"># NUOT loi, bat ke co gi:</span>
f() { local x=\$(lenh-co-the-hong); }
<span class="tok-comment"># BAO loi:</span>
f() { local x; x=\$(lenh-co-the-hong); }</code></pre>

<div class="callout warn">
<p><strong>Vì sao chuyện này quan trọng hơn vẻ ngoài của nó.</strong> Mọi script deploy không tầm thường đều có hàm, và trong hàm thì người ta viết <code>local</code> theo phản xạ — ĐÚNG, vì nó ngăn biến rò rỉ giữa các hàm. Nên cái hình dạng dòng phổ biến nhất trong một script bash viết tốt cũng chính là chỗ duy nhất mà <code>set -euo pipefail</code> âm thầm thôi hoạt động. Hãy tìm <code>local .*=\$(</code> trong script deploy của bạn NGAY BÂY GIỜ.</p>
</div>

<h3>Chỗ treo còn lại: các điều kiện</h3>
<p><code>set -e</code> bị TẮT có chủ đích bên trong bất cứ thứ gì shell coi là một phép thử:</p>

<div class="out">3) VAN CHAY — set -e bi treo trong dieu kien if</div>

<p>Đó là hành vi ĐÚNG — nếu không thì <code>if grep -q x file; then</code> không dùng được — nhưng nó có nghĩa là một lệnh <em>HỎNG VÌ LÝ DO KHÁC</em> bên trong một điều kiện thì trông y hệt một cái sai bình thường. <code>if curl -sf "\$URL"; then</code> là sai khi URL trả 500, và sai y như thế khi <code>curl</code> chưa được cài. Bài 7.4 đo xem chuyện đó tốn bao nhiêu.</p>

<h3>Dòng cần đặt ở đầu tệp</h3>
${slide('dv-07', 6, 'Đầu tệp deploy — và tệp CRLF từ Windows')}
<pre><code>#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit 2>/dev/null || true   <span class="tok-comment"># bash>=4.4; may cu thi bo qua</span>
IFS=\$'\\n\\t'                                     <span class="tok-comment"># tuy chon: tach truong khong theo dau cach</span></code></pre>

<p>Cái <code>2>/dev/null || true</code> ở dòng thứ ba không phải trang trí: <code>inherit_errexit</code> tới từ bash 4.4, mà macOS tới giờ vẫn kèm bash 3.2 ở <code>/bin/bash</code>. Thiếu cái chắn đó, một script đang cố cẩn thận sẽ chết ở dòng 3 ngay trên máy của lập trình viên.</p>

<div class="kv-grid">
<div class="kv"><span class="k">-e</span><span class="v">dừng khi một lệnh hỏng; bị treo bên trong các điều kiện</span></div>
<div class="kv"><span class="k">-u</span><span class="v">dừng khi gặp biến chưa đặt; dùng <code>\${X:?}</code> cho đường dẫn bạn sắp xoá</span></div>
<div class="kv"><span class="k">-o pipefail</span><span class="v">một cái ống hỏng nếu BẤT KỲ chặng nào hỏng</span></div>
<div class="kv"><span class="k">inherit_errexit</span><span class="v">che được <code>y=\$(cmd; cmd)</code>; KHÔNG che được <code>local x=\$(cmd)</code></span></div>
</div>

<h3>Tự chạy: cái SHA rỗng được đem đi deploy</h3>
${slide('dv-07', 4, 'local x=$(…): không cờ nào cứu nổi — đo trên VPS thí nghiệm')}
<p>Ca <code>local</code> ở trên còn trừu tượng cho tới lúc bạn thấy nó làm gì bên trong một script deploy. Hàm phổ biến nhất trong mọi script deploy là đọc commit sắp gửi đi. Đây là nó, bật đủ cả ba cờ, chạy trên VPS thí nghiệm trong một thư mục KHÔNG phải kho git — đúng chuyện xảy ra khi script được chạy nhầm thư mục, hoặc khi runner CI (máy chạy việc của CI) lấy mã về dạng tệp nén thay vì clone:</p>
<pre><code class="language-bash">#!/bin/bash
set -euo pipefail
lay_ban() {
  local sha=$(git rev-parse HEAD)
  echo "$sha"
}
lay_ban</code></pre>
<div class="out">$ bash sc.sh; echo "ma thoat: $?"
fatal: not a git repository (or any of the parent directories): .git

ma thoat: 0</div>
<ul>
<li><strong>Đọc cái dòng trống.</strong> <code>git</code> hỏng với mã 128 và in ra stderr; <code>local</code> thành công; hàm in ra một SHA RỖNG và script kết thúc với 0. Trong một lần deploy thật, mấy dòng kế tiếp sẽ dựng một ảnh gắn thẻ <code>app:</code>, đẩy nó đi, rồi ghi "production đang chạy <em>(không gì cả)</em>".</li>
<li><strong>ShellCheck (bộ soi script tĩnh) bắt được trong một giây.</strong> <code>shellcheck sc.sh</code> in <code>SC2155 (warning): Declare and assign separately to avoid masking return values.</code> ("khai báo và gán riêng để khỏi che mất mã trả về") và thoát 1 — rẻ tới mức chạy được mỗi lần lưu tệp.</li>
<li><strong>Tách dòng ra thì cờ lại có tác dụng.</strong> <code>local sha</code> một dòng, <code>sha=$(git rev-parse HEAD)</code> dòng sau: cùng lần chạy đó dừng ngay ở lệnh <code>git</code> với <strong>mã 128</strong>, và ShellCheck thoát 0.</li>
</ul>

<h3>Khai triển tham số cho những đường dẫn sắp bị xoá</h3>
${slide('dv-07', 5, 'Biến rỗng: $GOC/ban-cu thành /ban-cu — \${:?} chặn lại')}
<p>Năm cách viết cùng một biến, và mỗi cách làm gì khi biến chưa đặt hoặc rỗng. Đây là cái bảng cần nằm sẵn trong đầu mỗi khi script deploy ghép một đường dẫn để đưa cho <code>rm</code>, <code>rsync --delete</code> hay <code>mv</code>:</p>
<table>
<thead><tr><th>Viết</th><th>Chưa đặt</th><th>Đặt mà rỗng</th><th>Dùng cho</th></tr></thead>
<tbody>
<tr><td><code>$GOC</code> kèm <code>set -u</code></td><td>dừng</td><td>đi tiếp với ""</td><td>giá trị thường</td></tr>
<tr><td><code>\${GOC:-}</code></td><td>""</td><td>""</td><td>giá trị CỐ Ý tuỳ chọn — nó làm câm <code>-u</code></td></tr>
<tr><td><code>\${GOC:-/srv/app}</code></td><td>mặc định</td><td>mặc định</td><td>có sẵn một mặc định an toàn</td></tr>
<tr><td><code>\${GOC:?thông báo}</code></td><td>dừng, in thông báo</td><td>dừng, in thông báo</td><td><strong>mọi đường dẫn bạn xoá hoặc ghi đè</strong></td></tr>
<tr><td><code>\${1:?dùng: deploy.sh &lt;bản&gt;}</code></td><td>dừng</td><td>dừng</td><td>tham số bắt buộc</td></tr>
</tbody></table>
<p>Đo trên VPS thí nghiệm, với cái biến được chép từ chỗ khác về ở dạng "tuỳ chọn":</p>
<pre><code class="language-bash">GOC="\${GOC_DEPLOY:-}"          # chép từ đâu đó: mặc định RỖNG
echo "se xoa: \${GOC}/ban-cu"
rm -rf "\${GOC:?GOC chua dat — tu choi xoa}/ban-cu"</code></pre>
<div class="out">se xoa: /ban-cu
goc.sh: line 5: GOC: GOC chua dat — tu choi xoa
ma thoat: 1</div>
<p>Dòng echo cho thấy đường dẫn script <em>SẼ</em> dùng — <code>/ban-cu</code>, ở gốc cái máy — và <code>:?</code> từ chối ngay ở dòng kế. Để ý là <code>set -u</code> bật suốt từ đầu và KHÔNG làm gì: <code>:-</code> đã biến "chưa đặt" thành "rỗng", mà rỗng là một giá trị.</p>

<h3>Trên macOS và Windows</h3>
<ul>
<li><strong>macOS kèm bash 3.2 ở <code>/bin/bash</code></strong> (đo trên chính máy Mac này: <code>GNU bash, version 3.2.57</code>). Script deploy chạy <em>trên laptop</em> nên mở đầu bằng <code>#!/usr/bin/env bash</code> để lấy bash 5 của Homebrew khi có, và giữ cái chắn <code>shopt -s inherit_errexit 2&gt;/dev/null || true</code> cho lúc không có. Phần chạy trên VPS thì đằng nào cũng là bash 5.2 của Ubuntu.</li>
<li><strong>Bạn cùng nhóm dùng Windows lưu script với kiểu xuống dòng CRLF</strong> (Windows để <code>\\r\\n</code> cuối dòng, Linux chỉ <code>\\n</code>). Đo trên VPS thí nghiệm với một script ba dòng lưu kiểu đó:
<div class="out">$ bash crlf.sh 2&gt;&amp;1 | cat -A
crlf.sh: line 2: set: pipefail^M: invalid option name$
$ ./crlf.sh 2&gt;&amp;1 | cat -A
bash: line 1: ./crlf.sh: cannot execute: required file not found$</div>
Lỗi đầu là ký tự <code>\\r</code> vô hình (hiện thành <code>^M</code>) dính vào <code>pipefail</code>. Lỗi thứ hai tệ hơn vì nó chẳng gọi tên gì hữu ích: nhân hệ điều hành đi tìm một trình thông dịch tên là <code>/bin/bash\\r</code>. Chữa tệp bằng <code>sed -i 's/\\r$//' deploy.sh</code>, và chữa tận gốc một lần bằng một dòng trong <code>.gitattributes</code>: <code>*.sh text eol=lf</code>.</li>
<li><strong>ShellCheck</strong> cài bằng <code>brew install shellcheck</code> trên Mac và <code>apt install shellcheck</code> trên Ubuntu hoặc trong WSL. Hai lệnh trước mỗi lần chạy một script deploy vừa sửa: <code>bash -n deploy.sh</code> (chỉ kiểm cú pháp) và <code>shellcheck deploy.sh</code>.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối trước hôm bảo vệ SWP391, script deploy của bạn cùng nhóm "chạy xong thành công" mà trang demo vẫn là bản hôm qua. Bạn nghi script đang NÓI DỐI. Dựng VPS thí nghiệm một lần — cả chương dùng lại nó:</p>
<pre><code class="language-bash">mkdir -p ~/dv-lab7 &amp;&amp; cd ~/dv-lab7
ssh-keygen -t ed25519 -N "" -f ./khoa -q          # khoá CHỈ cho phòng thí nghiệm
cat &gt; Dockerfile &lt;&lt;'EOF'
FROM ubuntu:24.04
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends openssh-server curl git \\
    ca-certificates procps nodejs shellcheck iproute2 \\
 &amp;&amp; mkdir -p /run/sshd &amp;&amp; useradd -m -s /bin/bash deploy &amp;&amp; mkdir -p /home/deploy/.ssh
COPY khoa.pub /home/deploy/.ssh/authorized_keys
RUN chown -R deploy /home/deploy/.ssh &amp;&amp; chmod 700 /home/deploy/.ssh \\
 &amp;&amp; mkdir -p /srv/app &amp;&amp; chown deploy /srv/app
CMD ["/usr/sbin/sshd", "-D", "-e"]
EOF
docker build -t dv07-img .
docker run -d --name dv07-vps --memory 512m --tmpfs /srv/dia:size=1300m,uid=1000 \\
  -p 127.0.0.1:19072:22 dv07-img
alias vps='ssh -i ./khoa -o UserKnownHostsFile=./known_hosts -p 19072 deploy@127.0.0.1'
vps 'bash --version | head -1'</code></pre>
<div class="out">GNU bash, version 5.2.21(1)-release (aarch64-unknown-linux-gnu)</div>
<ol>
<li>Trên VPS, tạo <code>sc.sh</code> như trong bài rồi chạy từ thư mục nhà (KHÔNG phải kho git): <code>vps 'bash sc.sh; echo "ma thoat: $?"'</code>. Ghi lại mã thoát.</li>
<li>Chạy <code>vps 'shellcheck sc.sh'</code>. Tách dòng <code>local</code> làm hai như ShellCheck gợi ý rồi chạy lại script.</li>
<li>Tạo <code>goc.sh</code> như trong bài và chạy. Rồi xác nhận không có gì bị xoá: <code>vps 'ls -d /ban-cu'</code>.</li>
<li>Làm một bản CRLF: <code>vps 'printf "#!/bin/bash\\r\\nset -euo pipefail\\r\\necho xin chao\\r\\n" &gt; crlf.sh; bash crlf.sh 2&gt;&amp;1 | cat -A'</code>, rồi sửa bằng <code>sed -i 's/\\r$//' crlf.sh</code> và chạy lại.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn ghi được bốn điều — <code>sc.sh</code> bản hỏng thoát <strong>0</strong> còn bản sửa thoát <strong>128</strong>; <code>goc.sh</code> thoát 1 kèm dòng gọi tên <code>GOC</code> và <code>/ban-cu</code> không tồn tại; script CRLF hiện <code>pipefail^M</code> trước khi sửa và in <code>xin chao</code> sau khi sửa.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">errexit (dừng khi lỗi, <code>-e</code>)</span><span class="v">Script dừng khi một lệnh trả khác 0 — bị treo bên trong các điều kiện.</span></div>
  <div class="kv"><span class="k">nounset (cấm biến chưa đặt, <code>-u</code>)</span><span class="v">Script dừng khi khai triển một biến chưa được đặt.</span></div>
  <div class="kv"><span class="k">pipefail (ống hỏng thì hỏng)</span><span class="v">Một cái ống hỏng nếu BẤT KỲ chặng nào hỏng, không chỉ chặng cuối.</span></div>
  <div class="kv"><span class="k">Command substitution (thay thế lệnh, <code>$(…)</code>)</span><span class="v">Chạy một lệnh và lấy output làm giá trị; mã thoát của nó có thể bị <code>local</code> che mất.</span></div>
  <div class="kv"><span class="k">Parameter expansion (khai triển tham số, <code>\${X:?}</code>)</span><span class="v">Dùng biến, nhưng bỏ dở kèm thông báo nếu biến chưa đặt hoặc rỗng.</span></div>
  <div class="kv"><span class="k">ShellCheck / SC2155</span><span class="v">Bộ soi script shell tĩnh; SC2155 là cảnh báo cho <code>local x=$(cmd)</code>.</span></div>
  <div class="kv"><span class="k">CRLF (xuống dòng kiểu Windows)</span><span class="v">Hai ký tự <code>\\r\\n</code> cuối dòng; bash đọc <code>\\r</code> như một phần của chữ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Không cờ nào thì một ống gãy, một biến chưa đặt và một lệnh hỏng đều đi qua, và script thoát 0.</li>
<li><code>set -euo pipefail</code> chặn được phần lớn — nhưng <code>local x=$(cmd)</code> thoát 0 dưới mọi cờ; hãy tách khai báo khỏi phép gán.</li>
<li>Trong script deploy, con bọ đó đem một SHA commit RỖNG đi deploy với kết quả xanh; ShellCheck SC2155 bắt được trong một giây.</li>
<li><code>\${X:-}</code> làm câm <code>-u</code>; mọi đường dẫn bạn xoá nên viết <code>\${X:?}</code>.</li>
<li>macOS chạy bash 3.2 ở <code>/bin/bash</code>; dùng <code>#!/usr/bin/env bash</code> và giữ cái chắn <code>inherit_errexit</code>.</li>
<li>CRLF từ Windows làm hỏng script với những lỗi khó hiểu; <code>*.sh text eol=lf</code> trong <code>.gitattributes</code> chặn từ gốc.</li>
</ul>


<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bash Reference Manual — The Set Builtin</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#The-Set-Builtin — danh sách chuẩn tắc về những lúc <code>-e</code> bị treo. Nó dài hơn phần lớn người ta tưởng; đáng đọc hết cả đoạn.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bash Reference Manual — The Shopt Builtin, inherit_errexit</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#The-Shopt-Builtin — thêm vào từ bash 4.4, và đó là lý do cái chắn ở trên tồn tại.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">BashFAQ 105 — Why does set -e not do what I expected?</span><span class="lc-sub">mywiki.wooledge.org/BashFAQ/105 — cuốn danh mục kinh điển về những bất ngờ của errexit, kể cả ca <code>local</code> đo ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ShellCheck</span><span class="lc-sub">shellcheck.net — SC2155 đúng là cảnh báo <code>local x=\$(cmd)</code>. Chạy nó qua một script deploy mất vài giây và là lần soi rẻ nhất trong cả khoá này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — mã thoát, ống và dấu nháy</span><span class="lc-sub">/courses/linux-bash/learn${REF} — trạng thái thoát của một cái ống tới từ đâu, và vì sao khai triển không đặt trong nháy là nửa còn lại của vấn đề này.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — Safe to run twice|||7.2 — Chạy hai lần vẫn an toàn',
      slug: 'deploy-7-2-chay-lai-duoc',
      type: 'VIDEO',
      description: 'Một script deploy hỏng giữa chừng thì việc đầu tiên bạn làm là chạy lại nó. Đo thật ba kiểu: bản hỏng ngay lần hai, bản chạy sạch năm lần rồi lặp PATH năm lần, và bản chạy ba lần cho ra đúng một kết quả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Safe to run twice</h2>
<p class="lead">The first thing anybody does when a deploy fails halfway is run it again. That is the correct instinct, and it is only safe if the script was written for it — which most are not, in one of two ways: the loud way, and the quiet one.</p>

<h3>The loud failure</h3>
<p>A script built from the obvious commands, run twice with the same argument:</p>

<pre><code class="language-bash">mkdir "\$D/ban-\$1"
echo "ban \$1" > "\$D/ban-\$1/README"
echo "PATH=/opt/ung-dung/bin:\\\$PATH" >> "\$D/moi-truong"
ln -s "\$D/ban-\$1" "\$D/hien-tai"</code></pre>

<div class="out">  lan 1: OK
mkdir: cannot create directory '/srv/vps/kb/idem/dich/ban-v1': File exists
  lan 2: HONG ma thoat 1</div>

<p>This is the good outcome. It stops immediately, names the reason, and exits non-zero. Annoying, but it tells you the truth and it changed nothing.</p>

<h3>The quiet failure</h3>
${slide('dv-07', 8, 'Năm lần chạy sạch, năm dòng PATH — và ba cờ của grep')}
<p>Now fix the obvious problem — <code>mkdir -p</code>, <code>ln -sfn</code> — and leave the append alone. Run it five times:</p>

<div class="out">  lan 1: OK (khong loi gi)
  lan 2: OK (khong loi gi)
  lan 3: OK (khong loi gi)
  lan 4: OK (khong loi gi)
  lan 5: OK (khong loi gi)
  moi-truong bay gio:
     1	PATH=/opt/ung-dung/bin:\$PATH
     2	PATH=/opt/ung-dung/bin:\$PATH
     3	PATH=/opt/ung-dung/bin:\$PATH
     4	PATH=/opt/ung-dung/bin:\$PATH
     5	PATH=/opt/ung-dung/bin:\$PATH
  → 5 lan chay SACH, va PATH bi lap 5 lan. Khong co ma thoat nao bao dieu do.</div>

<p>Five clean runs, exit code 0 every time, and a config file that has accumulated five copies of the same line. Nothing reported it. This is worse than the crash, because the damage is invisible until something downstream chokes on it — a duplicated <code>server</code> block in nginx, a cron entry that now runs five times, a PATH long enough to hit <code>E2BIG</code>.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">mkdir</span><span class="lz-t">fails loudly</span><span class="lz-d">→ <code>mkdir -p</code>: exists is fine</span></div>
<div class="lz-step"><span class="lz-k">ln -s</span><span class="lz-t">fails loudly</span><span class="lz-d">→ <code>ln -sfn</code> + <code>mv -Tf</code>: replaces atomically (6.1)</span></div>
<div class="lz-step"><span class="lz-k">&gt;&gt; append</span><span class="lz-t">FAILS QUIETLY</span><span class="lz-d">→ <code>grep -qxF … || echo …</code>, or generate the whole file with <code>&gt;</code></span></div>
<div class="lz-step"><span class="lz-k">useradd, createdb</span><span class="lz-t">fails loudly</span><span class="lz-d">→ check first, or accept the specific "already exists" exit code</span></div>
</div>

<h3>The version that survives</h3>
${slide('dv-07', 9, 'Idempotent: trạng thái cuối chỉ theo tham số')}
<pre><code class="language-bash">mkdir -p "\$D/ban-\$1"                                <span class="tok-comment"># -p: da co thi thoi</span>
echo "ban \$1" > "\$D/ban-\$1/README"                  <span class="tok-comment"># &gt; : ghi de, khong noi them</span>
grep -qxF 'PATH=/opt/ung-dung/bin:\\\$PATH' "\$D/moi-truong" 2>/dev/null \\
  || echo 'PATH=/opt/ung-dung/bin:\\\$PATH' >> "\$D/moi-truong"
ln -sfn "\$D/ban-\$1" "\$D/ht.moi" &amp;&amp; mv -Tf "\$D/ht.moi" "\$D/hien-tai"</code></pre>

<div class="out">=== co idempotent: chay 3 lan ===
  lan 1: OK
  lan 2: OK
  lan 3: OK
  moi-truong co 1 dong
  hien-tai → /srv/vps/kb/idem/dich/ban-v1
  doi sang v2: OK → /srv/vps/kb/idem/dich/ban-v2</div>

<p>Three runs, one line, and switching to a different version still works — which is the property people forget to test. Idempotent does not mean "does nothing the second time", it means <strong>the end state depends only on the arguments, not on how many times you ran it</strong>.</p>

<div class="pitfall">
<p><strong>Trap — <code>grep -q … || echo …</code> quietly needs three flags.</strong> <code>-q</code> for quiet, <code>-x</code> to match the <em>whole line</em> (without it, a line that merely contains your string counts as present), and <code>-F</code> to treat the pattern as a fixed string (without it, every <code>.</code>, <code>$</code> and <code>[</code> in your config line is a regex metacharacter). Get any of the three wrong and the guard either never fires or always fires. The <code>2>/dev/null</code> matters too: on the first run the file does not exist yet, and <code>grep</code> printing an error would be the only sign.</p>
</div>

<h3>The stronger version: generate, do not edit</h3>
<p>Every append-guard above is a workaround for a deeper problem — you are editing a file whose current contents you did not write. The version with no failure modes at all is to generate the whole file from the script every time:</p>

<pre><code><span class="tok-comment"># khong dieu kien, khong grep, khong nghi ngo: tep nay do script SO HUU</span>
cat > "\$D/moi-truong" &lt;&lt;EOF
PATH=/opt/ung-dung/bin:\\\$PATH
NODE_ENV=production
BAN=\$1
EOF</code></pre>

<p>Run it once or fifty times, the file is identical. The constraint is that the script must own the file completely — if a human also edits it, you have just built a machine that overwrites their work on every deploy. That is a real trade, and the right answer is usually: machine-owned files get generated, human-owned files get left alone, and nothing is both.</p>

<h3>Order the steps so a failure is harmless</h3>
${slide('dv-07', 10, 'Chuẩn bị ở bên lề, tráo ở cuối cùng')}
<p>Idempotence handles the re-run. The other half is making the interrupted run itself harmless. Measured, with a script that fails at step 3 of 4:</p>

<div class="out">=== trang thai NUA CHUNG: script hong o buoc 3 tren 4 ===
  1) tao thu muc
  2) viet README
  ma thoat: 1
  thu muc co ton tai?  CO
  symlink da tro chua? CHUA — con tro ban CU</div>

<p>The directory is half-built and the symlink still points at the old release, so <strong>the site kept working through the entire failure</strong>. That is not luck; it is the consequence of putting the visible step last. Everything before the swap is preparation on the side, invisible to users; the swap is one atomic operation; anything after it is verification.</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">preparation</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">unpack, install, build, warm</div><div class="lz-nsub">failing here changes nothing a user can see</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">the swap</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">rename(2) on one symlink</div><div class="lz-nsub">atomic; no moment where nothing is pointed at</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">verification</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">readiness, smoke test, front-door check</div><div class="lz-nsub">failing here triggers the rollback (7.5)</div></div></div>
</div>
</div>

<div class="callout ok">
<p><strong>The test that proves it.</strong> Run your deploy script twice in a row with no changes and diff the machine state before and after the second run. If anything differs, the script is not idempotent, and you have just found the thing that will surprise you during an incident. It costs two minutes, and it is the only way to know.</p>
</div>

<h3>The operations a deploy script repeats, measured on a second run</h3>
${slide('dv-07', 7, 'Chạy lại: hỏng ồn ào hay hỏng im lặng — bảng thao tác')}
<p>Two more commands that every first deploy script contains, each run twice on the lab VPS:</p>
<div class="out"># useradd hai lần (chạy bằng root trong container)
lan 1: 0
useradd: user 'ungdung' already exists
lan 2: 9
ban an toan: 0          # id -u ungdung &gt;/dev/null 2&gt;&amp;1 || useradd ungdung
# git clone hai lần
clone lan 1: 0
fatal: destination path 'kho' already exists and is not an empty directory.
clone lan 2: 128</div>
<table>
<thead><tr><th>Operation</th><th>Second run</th><th>Re-runnable form</th></tr></thead>
<tbody>
<tr><td><code>mkdir dir</code></td><td>loud: <code>File exists</code>, exit 1</td><td><code>mkdir -p dir</code></td></tr>
<tr><td><code>ln -s target link</code></td><td>loud: <code>File exists</code></td><td><code>ln -sfn target link.new &amp;&amp; mv -Tf link.new link</code></td></tr>
<tr><td><code>echo line &gt;&gt; file</code></td><td><strong>quiet</strong>: exit 0, one more line</td><td><code>grep -qxF line file || echo line &gt;&gt; file</code>, or generate the whole file</td></tr>
<tr><td><code>useradd u</code></td><td>loud: exit 9</td><td><code>id -u u &gt;/dev/null 2&gt;&amp;1 || useradd u</code></td></tr>
<tr><td><code>git clone repo dir</code></td><td>loud: exit 128</td><td><code>[ -d dir/.git ] || git clone repo dir</code>, then <code>git -C dir fetch</code></td></tr>
<tr><td><code>cat &gt; file &lt;&lt;EOF</code></td><td>identical every time</td><td>already re-runnable — the script owns the file</td></tr>
<tr><td><code>systemctl enable app</code></td><td>exit 0, nothing to do</td><td>already re-runnable</td></tr>
</tbody></table>
<p>Look at which column the danger is in. The loud rows stop the script — annoying, honest, and they changed nothing. The single quiet row is the one that gets into production, because nothing about a green run tells you it happened.</p>

<h3>Run it yourself: prove it by diffing the machine</h3>
${slide('dv-07', 11, 'Phép thử: chạy hai lần rồi so trạng thái máy')}
<p>The callout above says "diff the machine state before and after the second run". Here is the smallest tool that does it, and the result on a script that <em>reads</em> correctly. First the deploy script under test — one line still appends:</p>
<pre><code class="language-bash">#!/bin/bash
set -euo pipefail
D=/srv/app; BAN="\${1:?ten ban}"
mkdir -p "$D/ban/$BAN" "$D/nhat-ky"
echo "ban $BAN" &gt; "$D/ban/$BAN/README"
echo "NODE_ENV=production" &gt;&gt; "$D/moi-truong"                 # &lt;- noi them
echo "$(date +%s%N) $BAN" &gt; "$D/nhat-ky/$(date +%s%N).log"  # &lt;- moi lan mot tep
ln -sfn "$D/ban/$BAN" "$D/ht.moi" &amp;&amp; mv -Tf "$D/ht.moi" "$D/hien-tai"</code></pre>
<p>Then a snapshot script: every path under <code>/srv/app</code> with its size, permissions, symlink target and the first 12 characters of a SHA-256 of its content. The log folder is pruned on purpose — a log that grows on every run is <em>correct</em>, and a test that fails on correct behaviour gets ignored:</p>
<pre><code class="language-bash"># chup trang thai: duong dan, kich thuoc, quyen, dich cua symlink, ma bam noi dung
cd /srv/app &amp;&amp; find . -path ./nhat-ky -prune -o -printf "%p %s %m %l\\n" | sort |
  while read -r p rest; do
    [ -f "$p" ] &amp;&amp; h=$(sha256sum &lt; "$p" | cut -c1-12) || h=-
    echo "$p $rest $h"
  done</code></pre>
<div class="out">$ bash dk.sh v1; bash chup.sh &gt; truoc.txt
$ bash dk.sh v1; bash chup.sh &gt; sau.txt
$ diff truoc.txt sau.txt; echo "diff ma: $?"
6c6
&lt; ./moi-truong 20 664 628b969b1041
---
&gt; ./moi-truong 40 664 8b0b250e2953
diff ma: 1</div>
<p>One line of output, and it says exactly what changed: <code>moi-truong</code> went from 20 bytes to 40. Change <code>&gt;&gt;</code> to <code>&gt;</code> on that line, wipe <code>/srv/app</code>, and run the same pair again:</p>
<div class="out">$ diff truoc.txt sau.txt; echo "diff ma: $?"
diff ma: 0
$ cat sau.txt
. 4096 755 -
./ban 4096 775 -
./ban/v1 4096 775 -
./ban/v1/README 7 664 ceabc178b4f6
./hien-tai 15 777 /srv/app/ban/v1 -
./moi-truong 20 664 628b969b1041</div>
<ul>
<li><strong>Why hash the content and not just compare sizes:</strong> a config that changes <code>PORT=3000</code> to <code>PORT=3001</code> keeps the same size. The hash catches it; the size does not.</li>
<li><strong>Why <code>%l</code>:</strong> a symlink that silently flips to a different release is exactly the kind of state change a deploy makes. <code>./hien-tai 15 777 /srv/app/ban/v1</code> records where it points.</li>
<li><strong>Extend it to what your script touches:</strong> <code>crontab -l</code>, <code>systemctl list-unit-files --state=enabled</code>, <code>docker ps --format '{{.Names}} {{.Image}}'</code>. The principle is the same — capture, run again, diff, expect nothing.</li>
</ul>

<h3>When to use which fix</h3>
<table>
<thead><tr><th>Situation</th><th>Use</th><th>Do not use it when</th></tr></thead>
<tbody>
<tr><td>The script is the only writer of the file (systemd unit, <code>.env</code> it renders, nginx upstream file)</td><td><strong>Generate</strong> the whole file with <code>&gt;</code></td><td>a human also edits it — you will overwrite their change on every deploy</td></tr>
<tr><td>One line must exist in a file someone else owns (<code>/etc/hosts</code>, a shared profile)</td><td><strong>Guard</strong> with <code>grep -qxF … ||</code></td><td>the line has variants (spaces, comments) — the guard misses them and you get two lines that differ</td></tr>
<tr><td>A thing must exist (user, directory, database, clone)</td><td><strong>Check first</strong>, create only if missing</td><td>its <em>content</em> can drift — "exists" is not "is correct"; compare or regenerate</td></tr>
<tr><td>A tool has a documented "already exists" exit code</td><td>Accept exactly that code</td><td>you are tempted to write <code>|| true</code> — that also swallows the real failures</td></tr>
</tbody></table>

<h3>On macOS and Windows</h3>
<p>The re-runnable forms above are GNU coreutils. The half of your deploy that runs on the Mac uses the BSD tools, and two of them fail — loudly, at least:</p>
<div class="out">$ mv -Tf l.moi l          # macOS 27
mv: illegal option -- T
usage: mv [-f | -i | -n] [-hv] source target
       mv [-f | -i | -n] [-v] source ... directory
mv ma: 64
$ sed -i 's/x/y/' f
sed: 1: "f
": invalid command code f</div>
<p><code>mv -T</code> does not exist on macOS (exit 64 is <code>EX_USAGE</code>, the conventional "you called me wrong"), and BSD <code>sed -i</code> takes the next word as a backup suffix, so it needs <code>sed -i '' 's/x/y/' f</code>. The robust rule: file operations on the server run <em>on the server</em> (<code>ssh vps 'bash -s' &lt; buoc.sh</code>), not as a mix of Mac commands pointed at remote paths. WSL on Windows is Ubuntu, so it behaves like the VPS.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the demo deploy failed halfway because the VPS ran out of memory, and your teammate&#39;s instinct is to "just run it again". Before that is safe you want proof that a second run changes nothing. On the lab VPS from Lesson 7.1:</p>
<ol>
<li>Copy <code>dk.sh</code> and <code>chup.sh</code> from this lesson to the VPS (<code>scp -i khoa -P 19072 -o UserKnownHostsFile=./known_hosts dk.sh chup.sh deploy@127.0.0.1:</code>).</li>
<li>Run <code>vps 'bash dk.sh v1; bash chup.sh &gt; truoc.txt; bash dk.sh v1; bash chup.sh &gt; sau.txt; diff truoc.txt sau.txt; echo "diff ma: $?"'</code>.</li>
<li>Fix the <code>&gt;&gt;</code> line so the script owns <code>moi-truong</code>, clear the state with <code>vps 'rm -rf /srv/app/*'</code>, and repeat step 2.</li>
<li>Run <code>vps 'bash dk.sh v2; readlink /srv/app/hien-tai'</code> — idempotent must still mean "a different argument gives a different state".</li>
</ol>
<p><strong>Done when:</strong> the first diff shows the <code>moi-truong</code> line going from 20 to 40 bytes with <code>diff ma: 1</code>, the second shows <code>diff ma: 0</code>, and <code>hien-tai</code> points at <code>/srv/app/ban/v2</code> after step 4.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Idempotent</span><span class="v">Running it once or many times with the same arguments leaves the same end state.</span></div>
  <div class="kv"><span class="k">Loud failure</span><span class="v">The re-run stops with an error and changes nothing — honest and cheap.</span></div>
  <div class="kv"><span class="k">Quiet failure</span><span class="v">The re-run exits 0 and accumulates damage (duplicated lines, extra cron entries).</span></div>
  <div class="kv"><span class="k">Machine-owned file</span><span class="v">A file only the script writes; regenerate it whole every time.</span></div>
  <div class="kv"><span class="k">State snapshot</span><span class="v">A listing of paths, sizes, permissions, link targets and content hashes to diff between runs.</span></div>
  <div class="kv"><span class="k">Atomic swap</span><span class="v">One <code>rename(2)</code> that switches the live symlink — the only step users see, placed last.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The first thing anyone does after a half-failed deploy is run it again; the script must be written for that.</li>
<li>Loud re-run failures (<code>mkdir</code>, <code>useradd</code> exit 9, <code>git clone</code> exit 128) are the good kind; the appending <code>&gt;&gt;</code> is the dangerous quiet kind.</li>
<li>Idempotent means the end state depends only on the arguments — a new argument must still change it.</li>
<li>Files the script owns are generated whole; files people own get a guarded single line or are left alone.</li>
<li>The proof is mechanical: snapshot, run again, <code>diff</code>, expect nothing — reading the script cannot tell you.</li>
<li>GNU-only flags (<code>mv -T</code>, <code>sed -i</code> without a suffix) fail on the Mac; run server-side steps on the server.</li>
</ul>


<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">mkdir(1), ln(1), mv(1) — GNU coreutils</span><span class="lc-sub">gnu.org/software/coreutils/manual/ — specifically <code>mkdir -p</code>, <code>ln -sfn</code> and <code>mv -T</code>. The <code>-T</code> is the flag that stops <code>mv</code> putting the link <em>inside</em> the target directory when the target already exists.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">grep(1) — the -q, -x and -F flags</span><span class="lc-sub">gnu.org/software/grep/manual/grep.html — the three flags the append-guard needs, and what goes wrong with each one missing.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Ansible — desired state and idempotency</span><span class="lc-sub">docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html — worth reading even if you never use Ansible: the whole tool is an argument that deploy steps should declare an end state rather than a sequence of edits.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — here-documents and redirection</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the <code>cat &gt; file &lt;&lt;EOF</code> form above, including when <code>EOF</code> should be quoted to stop expansion.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Chạy hai lần vẫn an toàn</h2>
<p class="lead">Việc đầu tiên ai cũng làm khi một lần deploy hỏng giữa chừng là CHẠY LẠI nó. Đó là phản xạ ĐÚNG, và nó chỉ an toàn nếu cái script được viết cho chuyện đó — mà phần lớn thì không, theo một trong hai kiểu: kiểu ỒN ÀO, và kiểu IM LẶNG.</p>

<h3>Kiểu hỏng ỒN ÀO</h3>
<p>Một script dựng từ những lệnh hiển nhiên, chạy hai lần cùng tham số:</p>

<pre><code class="language-bash">mkdir "\$D/ban-\$1"
echo "ban \$1" > "\$D/ban-\$1/README"
echo "PATH=/opt/ung-dung/bin:\\\$PATH" >> "\$D/moi-truong"
ln -s "\$D/ban-\$1" "\$D/hien-tai"</code></pre>

<div class="out">  lan 1: OK
mkdir: cannot create directory '/srv/vps/kb/idem/dich/ban-v1': File exists
  lan 2: HONG ma thoat 1</div>

<p>Đây là kết cục TỐT. Nó dừng ngay, gọi tên lý do, và thoát khác không. Khó chịu, nhưng nó nói thật và nó không đổi gì cả.</p>

<h3>Kiểu hỏng IM LẶNG</h3>
${slide('dv-07', 8, 'Năm lần chạy sạch, năm dòng PATH — và ba cờ của grep')}
<p>Giờ chữa cái vấn đề hiển nhiên — <code>mkdir -p</code>, <code>ln -sfn</code> — và để nguyên cái lệnh nối thêm. Chạy năm lần:</p>

<div class="out">  lan 1: OK (khong loi gi)
  lan 2: OK (khong loi gi)
  lan 3: OK (khong loi gi)
  lan 4: OK (khong loi gi)
  lan 5: OK (khong loi gi)
  moi-truong bay gio:
     1	PATH=/opt/ung-dung/bin:\$PATH
     2	PATH=/opt/ung-dung/bin:\$PATH
     3	PATH=/opt/ung-dung/bin:\$PATH
     4	PATH=/opt/ung-dung/bin:\$PATH
     5	PATH=/opt/ung-dung/bin:\$PATH
  → 5 lan chay SACH, va PATH bi lap 5 lan. Khong co ma thoat nao bao dieu do.</div>

<p>Năm lần chạy sạch, mã thoát 0 mỗi lần, và một tệp cấu hình đã tích lại năm bản sao của cùng một dòng. Không có gì báo cả. Chuyện này TỆ HƠN cú sập, vì thiệt hại vô hình cho tới lúc có thứ gì đó phía sau nghẹn vì nó — một khối <code>server</code> lặp trong nginx, một mục cron giờ chạy năm lần, một cái PATH dài đủ để chạm <code>E2BIG</code>.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">mkdir</span><span class="lz-t">hỏng ồn ào</span><span class="lz-d">→ <code>mkdir -p</code>: đã có thì thôi</span></div>
<div class="lz-step"><span class="lz-k">ln -s</span><span class="lz-t">hỏng ồn ào</span><span class="lz-d">→ <code>ln -sfn</code> + <code>mv -Tf</code>: thay nguyên tử (6.1)</span></div>
<div class="lz-step"><span class="lz-k">&gt;&gt; nối thêm</span><span class="lz-t">HỎNG IM LẶNG</span><span class="lz-d">→ <code>grep -qxF … || echo …</code>, hoặc sinh cả tệp bằng <code>&gt;</code></span></div>
<div class="lz-step"><span class="lz-k">useradd, createdb</span><span class="lz-t">hỏng ồn ào</span><span class="lz-d">→ kiểm trước, hoặc chấp nhận đúng cái mã thoát "đã tồn tại"</span></div>
</div>

<h3>Bản sống sót được</h3>
${slide('dv-07', 9, 'Idempotent: trạng thái cuối chỉ theo tham số')}
<pre><code class="language-bash">mkdir -p "\$D/ban-\$1"                                <span class="tok-comment"># -p: da co thi thoi</span>
echo "ban \$1" > "\$D/ban-\$1/README"                  <span class="tok-comment"># &gt; : ghi de, khong noi them</span>
grep -qxF 'PATH=/opt/ung-dung/bin:\\\$PATH' "\$D/moi-truong" 2>/dev/null \\
  || echo 'PATH=/opt/ung-dung/bin:\\\$PATH' >> "\$D/moi-truong"
ln -sfn "\$D/ban-\$1" "\$D/ht.moi" &amp;&amp; mv -Tf "\$D/ht.moi" "\$D/hien-tai"</code></pre>

<div class="out">=== co idempotent: chay 3 lan ===
  lan 1: OK
  lan 2: OK
  lan 3: OK
  moi-truong co 1 dong
  hien-tai → /srv/vps/kb/idem/dich/ban-v1
  doi sang v2: OK → /srv/vps/kb/idem/dich/ban-v2</div>

<p>Ba lần chạy, một dòng, và chuyển sang một phiên bản KHÁC vẫn chạy — đó là tính chất người ta quên đem đi kiểm. Bất biến theo số lần chạy KHÔNG có nghĩa là "lần hai thì không làm gì", nó có nghĩa là <strong>trạng thái cuối chỉ phụ thuộc vào THAM SỐ, không phụ thuộc vào việc bạn chạy bao nhiêu lần</strong>.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>grep -q … || echo …</code> âm thầm cần tới BA cờ.</strong> <code>-q</code> cho im lặng, <code>-x</code> để khớp <em>CẢ DÒNG</em> (thiếu nó, một dòng chỉ CHỨA chuỗi của bạn cũng bị tính là đã có), và <code>-F</code> để coi mẫu là chuỗi cố định (thiếu nó, mọi dấu <code>.</code>, <code>$</code> và <code>[</code> trong dòng cấu hình của bạn đều là siêu ký tự biểu thức chính quy). Sai một trong ba thì cái chắn hoặc KHÔNG BAO GIỜ bật, hoặc LÚC NÀO CŨNG bật. Cái <code>2>/dev/null</code> cũng quan trọng: ở lần chạy đầu tệp chưa tồn tại, và <code>grep</code> in ra một dòng lỗi sẽ là dấu hiệu duy nhất.</p>
</div>

<h3>Bản mạnh hơn: SINH RA, đừng SỬA</h3>
<p>Mọi cái chắn nối-thêm ở trên đều là cách đi vòng quanh một vấn đề sâu hơn — bạn đang sửa một tệp mà nội dung hiện tại của nó không do bạn viết. Bản không có kiểu hỏng nào cả là SINH RA cả tệp từ script, mỗi lần:</p>

<pre><code><span class="tok-comment"># khong dieu kien, khong grep, khong nghi ngo: tep nay do script SO HUU</span>
cat > "\$D/moi-truong" &lt;&lt;EOF
PATH=/opt/ung-dung/bin:\\\$PATH
NODE_ENV=production
BAN=\$1
EOF</code></pre>

<p>Chạy một lần hay năm mươi lần, tệp vẫn y hệt. Ràng buộc là script phải SỞ HỮU cái tệp hoàn toàn — nếu có một con người cũng sửa nó, thì bạn vừa dựng ra một cỗ máy ghi đè lên công sức của họ mỗi lần deploy. Đó là một đánh đổi thật, và câu trả lời đúng thường là: tệp do MÁY sở hữu thì được sinh ra, tệp do NGƯỜI sở hữu thì để yên, và không tệp nào vừa cái này vừa cái kia.</p>

<h3>Sắp thứ tự các bước sao cho một cú hỏng là vô hại</h3>
${slide('dv-07', 10, 'Chuẩn bị ở bên lề, tráo ở cuối cùng')}
<p>Tính chạy-lại-được lo phần chạy lại. Nửa còn lại là làm cho chính lần chạy bị đứt đoạn trở nên vô hại. Đo thật, với một script hỏng ở bước 3 trên 4:</p>

<div class="out">=== trang thai NUA CHUNG: script hong o buoc 3 tren 4 ===
  1) tao thu muc
  2) viet README
  ma thoat: 1
  thu muc co ton tai?  CO
  symlink da tro chua? CHUA — con tro ban CU</div>

<p>Thư mục dựng dở và symlink vẫn trỏ vào bản cũ, nên <strong>website chạy suốt cả cú hỏng</strong>. Đó không phải may; đó là hệ quả của việc đặt bước NHÌN THẤY ĐƯỢC ở CUỐI. Mọi thứ trước bước tráo là chuẩn bị ở bên lề, người dùng không thấy; bước tráo là MỘT thao tác nguyên tử; mọi thứ sau nó là kiểm chứng.</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">chuẩn bị</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">bung, cài, dựng, hâm nóng</div><div class="lz-nsub">hỏng ở đây thì không đổi gì mà người dùng thấy được</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">bước tráo</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">rename(2) trên một symlink</div><div class="lz-nsub">nguyên tử; không có khoảnh khắc nào không trỏ vào đâu cả</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">kiểm chứng</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">sẵn sàng, kiểm khói, kiểm cửa trước</div><div class="lz-nsub">hỏng ở đây thì kích hoạt cú lùi (7.5)</div></div></div>
</div>
</div>

<div class="callout ok">
<p><strong>Phép kiểm chứng minh điều đó.</strong> Chạy script deploy của bạn HAI lần liên tiếp mà không đổi gì, rồi so trạng thái cái máy trước và sau lần chạy thứ hai. Nếu có gì khác, script không bất biến theo số lần chạy, và bạn vừa tìm ra đúng cái thứ sẽ làm bạn bất ngờ giữa lúc có sự cố. Nó tốn hai phút, và là cách DUY NHẤT để biết.</p>
</div>

<h3>Những thao tác một script deploy lặp lại, đo ở lần chạy thứ hai</h3>
${slide('dv-07', 7, 'Chạy lại: hỏng ồn ào hay hỏng im lặng — bảng thao tác')}
<p>Thêm hai lệnh mà script deploy đầu tay nào cũng có, mỗi lệnh chạy hai lần trên VPS thí nghiệm:</p>
<div class="out"># useradd hai lần (chạy bằng root trong container)
lan 1: 0
useradd: user 'ungdung' already exists
lan 2: 9
ban an toan: 0          # id -u ungdung &gt;/dev/null 2&gt;&amp;1 || useradd ungdung
# git clone hai lần
clone lan 1: 0
fatal: destination path 'kho' already exists and is not an empty directory.
clone lan 2: 128</div>
<table>
<thead><tr><th>Thao tác</th><th>Lần chạy thứ hai</th><th>Dạng chạy lại được</th></tr></thead>
<tbody>
<tr><td><code>mkdir dir</code></td><td>ồn ào: <code>File exists</code>, thoát 1</td><td><code>mkdir -p dir</code></td></tr>
<tr><td><code>ln -s đích link</code></td><td>ồn ào: <code>File exists</code></td><td><code>ln -sfn đích link.moi &amp;&amp; mv -Tf link.moi link</code></td></tr>
<tr><td><code>echo dòng &gt;&gt; tệp</code></td><td><strong>im lặng</strong>: thoát 0, thêm một dòng</td><td><code>grep -qxF dòng tệp || echo dòng &gt;&gt; tệp</code>, hoặc sinh cả tệp</td></tr>
<tr><td><code>useradd u</code></td><td>ồn ào: thoát 9</td><td><code>id -u u &gt;/dev/null 2&gt;&amp;1 || useradd u</code></td></tr>
<tr><td><code>git clone kho dir</code></td><td>ồn ào: thoát 128</td><td><code>[ -d dir/.git ] || git clone kho dir</code>, rồi <code>git -C dir fetch</code></td></tr>
<tr><td><code>cat &gt; tệp &lt;&lt;EOF</code></td><td>y hệt mỗi lần</td><td>vốn đã chạy lại được — script SỞ HỮU tệp</td></tr>
<tr><td><code>systemctl enable app</code></td><td>thoát 0, không có gì để làm</td><td>vốn đã chạy lại được</td></tr>
</tbody></table>
<p>Nhìn xem nguy hiểm nằm ở cột nào. Các dòng ồn ào dừng script — khó chịu, thành thật, và không đổi gì. Dòng im lặng DUY NHẤT mới là thứ lọt được lên production, vì một lần chạy xanh chẳng cho bạn biết gì về nó.</p>

<h3>Tự chạy: chứng minh bằng cách so trạng thái máy</h3>
${slide('dv-07', 11, 'Phép thử: chạy hai lần rồi so trạng thái máy')}
<p>Khối chú ý ở trên nói "so trạng thái cái máy trước và sau lần chạy thứ hai". Đây là công cụ nhỏ nhất làm được việc đó, và kết quả trên một script ĐỌC thì đúng. Trước hết là script deploy đem đi thử — còn đúng một dòng nối thêm:</p>
<pre><code class="language-bash">#!/bin/bash
set -euo pipefail
D=/srv/app; BAN="\${1:?ten ban}"
mkdir -p "$D/ban/$BAN" "$D/nhat-ky"
echo "ban $BAN" &gt; "$D/ban/$BAN/README"
echo "NODE_ENV=production" &gt;&gt; "$D/moi-truong"                 # &lt;- noi them
echo "$(date +%s%N) $BAN" &gt; "$D/nhat-ky/$(date +%s%N).log"  # &lt;- moi lan mot tep
ln -sfn "$D/ban/$BAN" "$D/ht.moi" &amp;&amp; mv -Tf "$D/ht.moi" "$D/hien-tai"</code></pre>
<p>Rồi một script chụp trạng thái (snapshot — ảnh chụp): mọi đường dẫn dưới <code>/srv/app</code> kèm cỡ, quyền, đích của symlink và 12 ký tự đầu của mã băm SHA-256 nội dung. Thư mục log bị bỏ qua CÓ CHỦ ĐÍCH — log lớn dần sau mỗi lần chạy là hành vi <em>ĐÚNG</em>, và một phép thử hỏng vì hành vi đúng sẽ bị làm ngơ:</p>
<pre><code class="language-bash"># chup trang thai: duong dan, kich thuoc, quyen, dich cua symlink, ma bam noi dung
cd /srv/app &amp;&amp; find . -path ./nhat-ky -prune -o -printf "%p %s %m %l\\n" | sort |
  while read -r p rest; do
    [ -f "$p" ] &amp;&amp; h=$(sha256sum &lt; "$p" | cut -c1-12) || h=-
    echo "$p $rest $h"
  done</code></pre>
<div class="out">$ bash dk.sh v1; bash chup.sh &gt; truoc.txt
$ bash dk.sh v1; bash chup.sh &gt; sau.txt
$ diff truoc.txt sau.txt; echo "diff ma: $?"
6c6
&lt; ./moi-truong 20 664 628b969b1041
---
&gt; ./moi-truong 40 664 8b0b250e2953
diff ma: 1</div>
<p>Một dòng output, và nó nói chính xác cái gì đã đổi: <code>moi-truong</code> từ 20 byte lên 40. Đổi <code>&gt;&gt;</code> thành <code>&gt;</code> ở dòng đó, xoá sạch <code>/srv/app</code>, rồi chạy lại đúng cặp lệnh ấy:</p>
<div class="out">$ diff truoc.txt sau.txt; echo "diff ma: $?"
diff ma: 0
$ cat sau.txt
. 4096 755 -
./ban 4096 775 -
./ban/v1 4096 775 -
./ban/v1/README 7 664 ceabc178b4f6
./hien-tai 15 777 /srv/app/ban/v1 -
./moi-truong 20 664 628b969b1041</div>
<ul>
<li><strong>Vì sao băm nội dung chứ không chỉ so cỡ:</strong> một cấu hình đổi <code>PORT=3000</code> thành <code>PORT=3001</code> vẫn giữ nguyên cỡ. Mã băm bắt được; cỡ thì không.</li>
<li><strong>Vì sao có <code>%l</code>:</strong> một symlink âm thầm lật sang bản phát hành khác chính là loại thay đổi trạng thái mà deploy tạo ra. <code>./hien-tai 15 777 /srv/app/ban/v1</code> ghi lại nó đang trỏ đi đâu.</li>
<li><strong>Mở rộng tới mọi thứ script của bạn đụng vào:</strong> <code>crontab -l</code>, <code>systemctl list-unit-files --state=enabled</code>, <code>docker ps --format '{{.Names}} {{.Image}}'</code>. Nguyên tắc vẫn vậy — chụp, chạy lại, <code>diff</code>, mong đợi RỖNG.</li>
</ul>

<h3>Khi nào dùng cách sửa nào</h3>
<table>
<thead><tr><th>Tình huống</th><th>Dùng</th><th>ĐỪNG dùng khi</th></tr></thead>
<tbody>
<tr><td>Script là thứ DUY NHẤT ghi tệp (unit systemd, <code>.env</code> nó tự sinh, tệp upstream của nginx)</td><td><strong>Sinh</strong> cả tệp bằng <code>&gt;</code></td><td>có con người cũng sửa tệp đó — mỗi lần deploy bạn sẽ ghi đè công sức của họ</td></tr>
<tr><td>Một dòng phải có mặt trong tệp của người khác (<code>/etc/hosts</code>, profile dùng chung)</td><td><strong>Chắn</strong> bằng <code>grep -qxF … ||</code></td><td>dòng đó có nhiều biến thể (dấu cách, chú thích) — cái chắn trượt và bạn có hai dòng khác nhau</td></tr>
<tr><td>Một thứ phải tồn tại (người dùng, thư mục, CSDL, bản clone)</td><td><strong>Kiểm trước</strong>, thiếu mới tạo</td><td><em>NỘI DUNG</em> của nó có thể trôi — "có" không phải "đúng"; hãy so hoặc sinh lại</td></tr>
<tr><td>Công cụ có mã thoát "đã tồn tại" được ghi trong tài liệu</td><td>Chấp nhận đúng mã đó</td><td>bạn đang muốn viết <code>|| true</code> — nó nuốt luôn cả những cú hỏng thật</td></tr>
</tbody></table>

<h3>Trên macOS và Windows</h3>
<p>Các dạng chạy-lại-được ở trên là của GNU coreutils. Nửa deploy chạy trên máy Mac dùng công cụ BSD, và hai trong số đó hỏng — may là hỏng ồn ào:</p>
<div class="out">$ mv -Tf l.moi l          # macOS 27
mv: illegal option -- T
usage: mv [-f | -i | -n] [-hv] source target
       mv [-f | -i | -n] [-v] source ... directory
mv ma: 64
$ sed -i 's/x/y/' f
sed: 1: "f
": invalid command code f</div>
<p><code>mv -T</code> không có trên macOS (mã 64 là <code>EX_USAGE</code>, quy ước cho "bạn gọi tôi sai cách"), còn <code>sed -i</code> của BSD coi chữ tiếp theo là đuôi tệp sao lưu, nên phải viết <code>sed -i '' 's/x/y/' f</code>. Luật bền: thao tác tệp trên máy chủ thì chạy <em>TRÊN máy chủ</em> (<code>ssh vps 'bash -s' &lt; buoc.sh</code>), đừng trộn lệnh của Mac trỏ vào đường dẫn ở xa. WSL trên Windows chính là Ubuntu, nên nó cư xử như VPS.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> lần deploy bản demo hỏng giữa chừng vì VPS hết RAM, và phản xạ của bạn cùng nhóm là "chạy lại là xong". Trước khi chuyện đó an toàn, bạn muốn có BẰNG CHỨNG rằng lần chạy thứ hai không đổi gì. Trên VPS thí nghiệm của Bài 7.1:</p>
<ol>
<li>Chép <code>dk.sh</code> và <code>chup.sh</code> của bài này lên VPS (<code>scp -i khoa -P 19072 -o UserKnownHostsFile=./known_hosts dk.sh chup.sh deploy@127.0.0.1:</code>).</li>
<li>Chạy <code>vps 'bash dk.sh v1; bash chup.sh &gt; truoc.txt; bash dk.sh v1; bash chup.sh &gt; sau.txt; diff truoc.txt sau.txt; echo "diff ma: $?"'</code>.</li>
<li>Sửa dòng <code>&gt;&gt;</code> để script SỞ HỮU <code>moi-truong</code>, xoá trạng thái bằng <code>vps 'rm -rf /srv/app/*'</code>, rồi làm lại bước 2.</li>
<li>Chạy <code>vps 'bash dk.sh v2; readlink /srv/app/hien-tai'</code> — idempotent vẫn phải có nghĩa là "tham số khác thì trạng thái khác".</li>
</ol>
<p><strong>Đạt khi:</strong> lần diff đầu cho thấy dòng <code>moi-truong</code> từ 20 lên 40 byte kèm <code>diff ma: 1</code>, lần thứ hai là <code>diff ma: 0</code>, và <code>hien-tai</code> trỏ vào <code>/srv/app/ban/v2</code> sau bước 4.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Idempotent (bất biến theo số lần chạy)</span><span class="v">Chạy một hay nhiều lần với cùng tham số đều để lại cùng một trạng thái cuối.</span></div>
  <div class="kv"><span class="k">Loud failure (hỏng ồn ào)</span><span class="v">Lần chạy lại dừng kèm lỗi và không đổi gì — thành thật và rẻ.</span></div>
  <div class="kv"><span class="k">Quiet failure (hỏng im lặng)</span><span class="v">Lần chạy lại thoát 0 và tích dần thiệt hại (dòng lặp, mục cron thừa).</span></div>
  <div class="kv"><span class="k">Machine-owned file (tệp do máy sở hữu)</span><span class="v">Tệp chỉ script ghi; mỗi lần sinh lại nguyên cả tệp.</span></div>
  <div class="kv"><span class="k">State snapshot (ảnh chụp trạng thái)</span><span class="v">Danh sách đường dẫn, cỡ, quyền, đích link và mã băm nội dung để so giữa hai lần chạy.</span></div>
  <div class="kv"><span class="k">Atomic swap (tráo nguyên tử)</span><span class="v">Một phép <code>rename(2)</code> đổi symlink đang chạy — bước DUY NHẤT người dùng thấy, đặt ở cuối.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Việc đầu tiên ai cũng làm sau một lần deploy hỏng nửa chừng là chạy lại; script phải được viết cho chuyện đó.</li>
<li>Hỏng ồn ào khi chạy lại (<code>mkdir</code>, <code>useradd</code> mã 9, <code>git clone</code> mã 128) là loại TỐT; <code>&gt;&gt;</code> nối thêm là loại im lặng nguy hiểm.</li>
<li>Idempotent nghĩa là trạng thái cuối chỉ phụ thuộc tham số — tham số mới vẫn phải đổi được trạng thái.</li>
<li>Tệp script sở hữu thì sinh lại nguyên tệp; tệp con người sở hữu thì chắn một dòng hoặc để yên.</li>
<li>Bằng chứng là cơ học: chụp, chạy lại, <code>diff</code>, mong đợi rỗng — đọc script không nói được điều đó.</li>
<li>Cờ chỉ có ở GNU (<code>mv -T</code>, <code>sed -i</code> không đuôi) hỏng trên Mac; bước phía máy chủ thì chạy trên máy chủ.</li>
</ul>


<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">mkdir(1), ln(1), mv(1) — GNU coreutils</span><span class="lc-sub">gnu.org/software/coreutils/manual/ — cụ thể là <code>mkdir -p</code>, <code>ln -sfn</code> và <code>mv -T</code>. Cái <code>-T</code> là cờ ngăn <code>mv</code> đặt liên kết vào BÊN TRONG thư mục đích khi đích đã tồn tại.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">grep(1) — ba cờ -q, -x và -F</span><span class="lc-sub">gnu.org/software/grep/manual/grep.html — ba cái cờ mà chắn nối-thêm cần, và thiếu từng cái thì hỏng ra sao.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Ansible — trạng thái mong muốn và tính bất biến</span><span class="lc-sub">docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html — đáng đọc kể cả khi bạn không bao giờ dùng Ansible: cả công cụ đó là một lập luận rằng các bước deploy nên KHAI BÁO trạng thái cuối thay vì liệt kê một chuỗi thao tác sửa.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — here-document và chuyển hướng</span><span class="lc-sub">/courses/linux-bash/learn${REF} — dạng <code>cat &gt; file &lt;&lt;EOF</code> ở trên, kể cả lúc nào cần đặt <code>EOF</code> trong nháy để chặn khai triển.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — Refusing to run|||7.3 — TỪ CHỐI chạy',
      slug: 'deploy-7-3-tu-choi',
      type: 'VIDEO',
      description: 'Cái hỏng đắt nhất của một script deploy không phải là sập — mà là hỏi một câu rồi thoát 0 khi không ai trả lời. Đo thật ba biến thể của cùng lời hỏi đó, và biến thể im lặng chính là biến thể mà kho này đã gặp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Refusing to run</h2>
<p class="lead">The most valuable thing a deploy script does is often nothing at all — stopping before it starts, because a precondition is not met. The hard part is stopping in a way that anybody notices.</p>

<h3>The prompt that reports success</h3>
<p>A script that asks for confirmation when the working tree is dirty. Reasonable, common, and this repository&#39;s own deploy script does exactly it. Here it is under three conditions:</p>

<pre><code class="language-bash">read -rp "Van deploy? [y/N] " tl
[[ "\$tl" == "y" ]] || { echo "huy."; exit 0; }
echo "=== DANG DEPLOY ==="</code></pre>

<div class="out">--- chay co terminal, tra loi y ---   → DANG DEPLOY | ma thoat: 0
--- chay co terminal, tra loi n ---   → huy.        | ma thoat: 0
--- chay NEN (stdin la /dev/null) --- → (im lang)   | ma thoat: 1</div>

<p>Three different outcomes, two of which report 0. Answering <em>no</em> and deploying successfully are indistinguishable to anything reading the exit code. And notice the third line: with <code>set -euo pipefail</code>, <code>read</code> hitting end-of-file returns non-zero and errexit kills the script — exit 1, which is at least honest.</p>

<h3>The variant that is genuinely silent</h3>
<p>But that third result depends on a detail. Add the <code>|| true</code> that people write to stop <code>read</code> from killing the script — or set a default, or put the read inside a condition — and errexit is suspended:</p>

<div class="out">=== bien the A: read dung mot minh, co set -e ===
  ma thoat: 1

=== bien the B: read co '|| true' — set -e bi treo ===
huy.
  ma thoat: 0
  → thoat 0 va IM LANG. Day la bien the nguy hiem: CI ket luan deploy XONG.

=== bien the C: read co mac dinh, van im lang ===
huy.
  ma thoat: 0</div>

<p>Variants B and C exit 0 without deploying. Run from cron, from CI, from a background job, from an agent — anything without a terminal — and the deploy never happens while every indicator says it did. This repository&#39;s own notes record exactly this, in Vietnamese: <em>"run it in the background and you must pipe <code>echo y</code> into it, or it stops silently with exit 0."</em></p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">the deploy ran</span><span class="lz-t">exit 0</span><span class="lz-d">correct</span></div>
<div class="lz-step"><span class="lz-k">a human answered NO</span><span class="lz-t">exit 0</span><span class="lz-d">indistinguishable from success</span></div>
<div class="lz-step"><span class="lz-k">nobody could answer</span><span class="lz-t">exit 0</span><span class="lz-d">the dangerous one: nothing deployed, everything green</span></div>
</div>

<h3>Two lines fix it</h3>
${slide('dv-07', 12, '[y/N] không terminal: đừng đoán, TỪ CHỐI — echo y và --dong-y')}
<pre><code class="language-bash">if [ ! -t 0 ]; then
  echo "khong co terminal de hoi — TU CHOI deploy. Dung --dong-y de bo qua." >&amp;2
  exit 4
fi
read -rp "Van deploy? [y/N] " tl
[[ "\$tl" == "y" ]] || { echo "huy theo yeu cau nguoi dung."; exit 3; }</code></pre>

<div class="out">cay lam viec con thay doi chua commit.
khong co terminal de hoi — TU CHOI deploy. Dung --dong-y de bo qua.
  ma thoat: 4</div>

<p><code>[ -t 0 ]</code> asks whether standard input is a terminal. If it is not, there is nobody to answer, and the script says so on stderr with its own exit code rather than guessing. The <code>--dong-y</code> escape hatch is what makes this workable in automation: the caller states its intent explicitly instead of the script inferring it from silence.</p>

<div class="callout ok">
<p><strong>Give every refusal its own exit code.</strong> The script in 7.5 uses 2 for "no such release", 3 for "user said no", 4 for "no terminal", 5 for "a required tool is missing", 6 for "the artifact is malformed", 7 for "it did not come up", 8 for "smoke test failed", 9 for "the front door disagrees". A wrapper can then treat 3 as normal and 7 as an alert. A script that returns 1 for everything forces whoever calls it to parse English.</p>
</div>

<h3>The other preconditions worth checking</h3>
<p>Each of these is cheap, and each one has ruined somebody&#39;s afternoon:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">required tools present</span><span class="lz-lnote"><code>command -v curl >/dev/null || exit 5</code> — 7.4 measures what happens without this</span></div>
<div class="lz-layer"><span class="lz-lname">the release exists</span><span class="lz-lnote">and the error lists the ones that do, so the human does not have to go looking</span></div>
<div class="lz-layer"><span class="lz-lname">the working tree is clean</span><span class="lz-lnote">because a build from a dirty tree ships something no commit describes (Chapter 1)</span></div>
<div class="lz-layer"><span class="lz-lname">not behind the remote</span><span class="lz-lnote">deploying an older commit than <code>origin/main</code> silently reverts a colleague&#39;s work</span></div>
<div class="lz-layer"><span class="lz-lname">no other deploy running</span><span class="lz-lnote"><code>flock</code>, with the fd closed in children — see the pitfall below</span></div>
<div class="lz-layer"><span class="lz-lname">enough disk</span><span class="lz-lnote">a build that fills the disk takes the database down with it (Chapter 8)</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — <code>flock</code> plus a background process is a self-inflicted deadlock.</strong> Lesson 3.5 measured this on my own swap script: <code>exec 9>/var/lock/x</code> takes the lock on file descriptor 9, then the app is started in the background and <em>inherits fd 9</em>. The script exits, the lock is not released — the long-lived app is still holding it — and the next deploy waits forever on a lock owned by a process that has no idea it has one. The fix is <code>9>&amp;-</code> on the background command, closing that descriptor in the child. Diagnose it with <code>ls -l /proc/&lt;pid&gt;/fd</code> or <code>fuser /var/lock/x</code>.</p>
</div>

<h3>Refusing is not the same as failing</h3>
<p>There is a real distinction between "I will not do this" and "I tried and it broke", and the exit code should carry it. A refusal means the machine is untouched — it is safe to fix the precondition and run again immediately. A failure means something has already changed and you should look before re-running. In the script in 7.5 every refusal happens <em>before</em> the lock is taken and before any file is written, which is what makes that promise true rather than aspirational.</p>

<div class="kv-grid">
<div class="kv"><span class="k">refusal</span><span class="v">nothing changed; fix the condition, run again</span></div>
<div class="kv"><span class="k">failure</span><span class="v">something changed; the rollback in the trap should have handled it (7.5)</span></div>
<div class="kv"><span class="k">the ordering rule</span><span class="v">every check that can refuse goes before the first write</span></div>
<div class="kv"><span class="k">the test</span><span class="v">run each refusal path and confirm the machine is byte-identical afterwards</span></div>
</div>

<h3>What <code>echo y |</code> actually does</h3>
<p>This repository&#39;s notes give the workaround for the silent prompt: pipe <code>echo y</code> into the script. It works — and it is worth measuring what it means. Two versions of the prompt, run five ways on the lab VPS. <code>hoi-cu.sh</code> has the shape of the real deploy script; <code>hoi-moi.sh</code> has the two-line fix from above plus the explicit flag:</p>
<pre><code class="language-bash"># hoi-cu.sh — dạng của script deploy thật trong kho này
read -r -p "Van deploy? [y/N] " tl || tl=""
[[ "$tl" =~ ^[Yy]$ ]] || { echo "Dung theo yeu cau."; exit 0; }

# hoi-moi.sh
DONG_Y=0; [ "\${1:-}" = "--dong-y" ] &amp;&amp; DONG_Y=1
if [ "$DONG_Y" != 1 ]; then
  [ -t 0 ] || { echo "stdin khong phai terminal — TU CHOI. Dung --dong-y." &gt;&amp;2; exit 4; }
  read -r -p "Van deploy? [y/N] " tl
  [[ "$tl" =~ ^[Yy]$ ]] || { echo "huy theo yeu cau."; exit 3; }
fi</code></pre>
<div class="out">$ bash hoi-cu.sh &lt;/dev/null
  cay lam viec con thay doi chua commit.
  Dung theo yeu cau.
  ma thoat: 0
$ echo y | bash hoi-cu.sh
  cay lam viec con thay doi chua commit.
  === DANG DEPLOY ===
  ma thoat: 0
$ bash hoi-moi.sh &lt;/dev/null
  cay lam viec con thay doi chua commit.
  stdin khong phai terminal — TU CHOI. Dung --dong-y.
  ma thoat: 4
$ echo y | bash hoi-moi.sh
  cay lam viec con thay doi chua commit.
  stdin khong phai terminal — TU CHOI. Dung --dong-y.
  ma thoat: 4
$ bash hoi-moi.sh --dong-y &lt;/dev/null
  cay lam viec con thay doi chua commit.
  === DANG DEPLOY ===
  ma thoat: 0</div>
<ul>
<li><strong><code>echo y |</code> is answering on the human&#39;s behalf.</strong> The old script cannot tell a person typing <code>y</code> from a pipe that says <code>y</code> to every question — including a question you add next month, such as "the database migration will drop a column, continue?". The fixed script treats a pipe as "nobody is there" (exit 4) and makes automation say what it means with <code>--dong-y</code>.</li>
<li><strong>The question never appears in the log.</strong> Look for <code>Van deploy? [y/N]</code> in the output above: it is not there. The bash manual says <code>read -p</code> displays its prompt "only if input is coming from a terminal". A background run leaves no trace that a question was ever asked — only "Dung theo yeu cau." and a 0.</li>
<li><strong>SSH without <code>-t</code> is also "not a terminal".</strong> If the confirmation lives in a script that runs <em>on the VPS</em>, the result depends on how you connected:</li>
</ul>
<div class="out">$ vps '[ -t 0 ] &amp;&amp; echo "stdin: terminal" || echo "stdin: KHONG phai terminal"'
stdin: KHONG phai terminal
$ ssh -tt -i ./khoa -o UserKnownHostsFile=./known_hosts -p 19072 deploy@127.0.0.1 \\
    '[ -t 0 ] &amp;&amp; echo "stdin: terminal" || echo "stdin: KHONG phai terminal"'
stdin: terminal
Connection to 127.0.0.1 closed.</div>
<p>So a remote script with the <code>[ -t 0 ]</code> guard refuses under a plain <code>ssh … 'bash deploy.sh'</code> — correct, since nobody can type into it — and asks normally under <code>ssh -t</code>.</p>

<h3>The three git gates, measured</h3>
${slide('dv-07', 13, 'Ba chốt git: nhánh · cây bẩn · đứng sau')}
<p>The list above names the preconditions; here are three of them as code, run on a throw-away repository on the lab VPS whose "origin" is a bare repository standing in for GitHub. A teammate has just pushed commit c2:</p>
<pre><code class="language-bash">#!/bin/bash
set -euo pipefail
tu_choi() { echo "  ✗ $2" &gt;&amp;2; exit "$1"; }
NHANH=$(git rev-parse --abbrev-ref HEAD)
[ "$NHANH" = main ] || tu_choi 10 "dang o nhanh '$NHANH', chi deploy tu main"
BAN=$(git status --porcelain --untracked-files=no)
[ -z "$BAN" ] || tu_choi 11 "cay lam viec ban: $(echo "$BAN" | wc -l) tep chua commit"
git fetch -q origin
SAU=$(git rev-list --count HEAD..origin/main)
[ "$SAU" = 0 ] || tu_choi 12 "dung SAU origin/main $SAU commit — git pull truoc"
SHA=$(git rev-parse HEAD)
echo "  ✓ qua ca ba chot — se deploy \${SHA:0:8}"</code></pre>
<div class="out">--- 1) dung sau origin
  ✗ dung SAU origin/main 1 commit — git pull truoc
  ma thoat: 12
--- 2) sau khi pull
  ✓ qua ca ba chot — se deploy 8e1f5b45
  ma thoat: 0
$ echo x &gt;&gt; a; bash chot.sh
  ✗ cay lam viec ban: 1 tep chua commit
  ma thoat: 11
--- 4) tren nhanh khac
  ✗ dang o nhanh 'thu-nghiem', chi deploy tu main
  ma thoat: 10
# (khôi phục a) thêm tệp moi.txt CHƯA theo dõi — ?? — rồi chạy lại:
  ✓ qua ca ba chot — se deploy 8e1f5b45
  ma thoat: 0</div>
<table>
<thead><tr><th>Command</th><th>What it answers</th><th>Why it matters for a deploy</th></tr></thead>
<tbody>
<tr><td><code>git rev-parse --abbrev-ref HEAD</code></td><td>which branch is checked out</td><td>production becomes <em>exactly</em> the branch you deploy — everything that exists only elsewhere disappears</td></tr>
<tr><td><code>git status --porcelain --untracked-files=no</code></td><td>tracked files changed but not committed (empty = clean)</td><td>a build from uncommitted edits ships something no commit describes; untracked <code>??</code> files are deliberately ignored</td></tr>
<tr><td><code>git rev-list --count HEAD..origin/main</code></td><td>commits on origin that you do not have</td><td>deploying while behind silently reverts a teammate&#39;s work on the server</td></tr>
<tr><td><code>git rev-parse HEAD</code></td><td>the full commit ID</td><td>read it <strong>once</strong>, here, and use that value for everything after (Lesson 7.5)</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><strong>Real incident — three deploys, three branches, one morning.</strong> In a student project where several coding sessions worked on one repository in parallel, three deploys in a row went out from three different branches, each split off at a different point. Each deploy removed the other branches&#39; work from production — shop, points wallet, LLM gateway. Nothing complained: build green, push green, swap green, and the smoke test was clean because it only knew the routes of the branch being deployed. The gate that finally held was not in the script at all (every branch carried its own old copy of the script) but a <code>pre-receive</code> hook on the repository the deploys pushed to — something every deploy passes through.</div>

<h3>The disk check that passes with 1.1 GB free</h3>
${slide('dv-07', 14, 'df -BG làm tròn LÊN: 1,1G hiện thành 2G')}
<p>A full disk during a build is how this project nearly lost its database (Chapter 8), so "enough disk" is a gate worth having. The obvious way to write it has a trap. Measured on the lab VPS with a 1,300 MB tmpfs standing in for the disk, after writing 180 MB to it, and a gate that demands at least 2 GB:</p>
<div class="out">$ df -h /srv/dia
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           1.3G  180M  1.1G  14% /srv/dia
$ df -BG --output=avail /srv/dia
Avail
   2G
$ df -BM --output=avail /srv/dia
Avail
1120M
$ df -B1 --output=avail /srv/dia
     Avail
1174405120
CON=2
QUA chot &gt;=2G (con 2G)
MB=1120
TU CHOI: chi con 1120M, can 2048M</div>
<p><code>df -h</code> says 1.1G free, <code>-BM</code> says 1120M, and <code>-BG</code> says <strong>2G</strong>. With <code>-B</code>, GNU <code>df</code> rounds sizes <em>up</em> to the next whole unit, so a "≥ 2G" gate written in gigabytes lets 1.1 GB through. The error can be almost a whole unit: with a "≥ 20G" threshold, 19.1 GB passes. This project&#39;s own script checks its build machine with exactly <code>df -BG --output=avail / … -lt 20</code>. Count in megabytes instead — the rounding error shrinks to 1 MB:</p>
<pre><code class="language-bash">MB=$(df -BM --output=avail /var/lib/docker | tail -1 | tr -dc '0-9')
[ "\${MB:-0}" -ge 5120 ] || { echo "chi con \${MB}M tren /var/lib/docker, can 5120M" &gt;&amp;2; exit 5; }</code></pre>
<ul>
<li><strong>Check the filesystem that fills up</strong>, not <code>/</code> by habit: images and build cache live in <code>/var/lib/docker</code>, which may be a separate volume.</li>
<li><strong><code>\${MB:-0}</code></strong> makes "could not read the number" fail the gate rather than crash the comparison — an unreadable disk is a reason to refuse, not to continue.</li>
</ul>

<h3>Two deploys at once: what the lock must do</h3>
${slide('dv-07', 15, 'Hai deploy cùng lúc: flock -n hay -w')}
<p>Lesson 3.5 introduced <code>flock</code> for the swap. For a deploy script the question is policy: when a second deploy starts while the first is running, should it give up or wait? Both, measured with a script that holds the lock for 2 seconds, and a second copy started 0.2 seconds later:</p>
<pre><code class="language-bash">#!/bin/bash
set -euo pipefail
T0=$(date +%s%3N); t() { echo "$(( $(date +%s%3N) - T0 ))ms"; }
TEN=$1; CHE=\${2:--n}
exec 9&gt;/tmp/trien-khai.lock
if ! flock $CHE 9; then echo "  [$TEN $(t)] co lan deploy khac dang chay — thoat 75"; exit 75; fi
echo "  [$TEN $(t)] giu khoa, dang trao..."; sleep 2; echo "  [$TEN $(t)] xong"</code></pre>
<div class="out">--- flock -n (khong cho)
  [A 3ms] giu khoa, dang trao...
  [B 3ms] co lan deploy khac dang chay — thoat 75
  B ma thoat: 75
  [A 2008ms] xong
--- flock -w 5 (cho toi 5 giay)
  [A 5ms] giu khoa, dang trao...
  [A 2010ms] xong
  [B 1813ms] giu khoa, dang trao...
  [B 3816ms] xong
  B ma thoat: 0</div>
<table>
<thead><tr><th>Flag</th><th>Behaviour measured</th><th>Use it when</th></tr></thead>
<tbody>
<tr><td><code>flock -n 9</code></td><td>B gave up in 3 ms with exit 75</td><td>a human runs the deploy: they learn immediately that someone else is deploying</td></tr>
<tr><td><code>flock -w 5 9</code></td><td>B waited 1.8 s, then ran after A</td><td>automation queues deploys; give the wait a ceiling larger than one deploy</td></tr>
<tr><td>no lock</td><td>—</td><td>never, once more than one person or session can deploy</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><strong>Real incident — four deploys at once.</strong> Four coding sessions started the same deploy script within 13 minutes. The images built fine in parallel; at the swap step three of them stopped with <code>EXIT=75</code> ("another session is swapping on the VPS"). That was the <em>good</em> outcome: the lock refused before anything was changed. On another day, two sessions without that lock collided one step earlier, pushing to the same branch of the build machine&#39;s repository: <code>cannot lock ref 'refs/heads/deploy': reference already exists</code>. The right response in both cases was the same: do not delete the lock or the ref, wait for the others to finish, then measure what production is running before deciding to deploy again.</div>

<h3>When the lock holder dies</h3>
${slide('dv-07', 16, 'kill -9: khoá tệp kẹt mãi, flock thì không')}
<p>A deploy can be killed — an SSH connection drops, someone presses Ctrl-C twice, the OOM killer steps in. What happens to the lock depends on how it was made. Measured: A takes the lock, is killed with <code>kill -9</code> half a second later, and B tries.</p>
<div class="out">--- khoa bang TEP: A bi kill -9, roi B chay
  [A] giu khoa tep, dang trao...
--- 3 giay sau, khong con tien trinh nao
  [B] co tep /tmp/dang-deploy — thoat 75
  B ma thoat: 75
  (khong con sleep nao)

--- A bi kill -9 giua chung, roi B chay
  [A 2ms] giu khoa, dang trao...
  [B 2ms] co lan deploy khac dang chay — thoat 75
  B ma thoat: 75
# lan do 2: lai kill -9 A, roi hoi ai giu khoa
$ ai dang giu /tmp/trien-khai.lock?
    508 sleep           sleep 2
--- 2 giay sau (sleep da thoat)
  [B 2ms] giu khoa, dang trao...
  [B 2007ms] xong
  B ma thoat: 0</div>
<ul>
<li><strong>A lock <em>file</em> outlives its owner.</strong> <code>trap … EXIT</code> does not run on SIGKILL, so <code>/tmp/dang-deploy</code> stays, and every later deploy refuses until a human deletes it — and that human has to be sure nothing is really running.</li>
<li><strong><code>flock</code> is released by the kernel when the last descriptor closes</strong> — which is not necessarily when the script dies. Here A&#39;s child <code>sleep 2</code> inherited fd 9 and kept the lock for two more seconds. Replace <code>sleep</code> with an application started in the background and it keeps the lock <em>forever</em> — the deadlock Lesson 3.5 measured. <code>9&gt;&amp;-</code> on every background command closes it in the child.</li>
<li><strong>Diagnose it by looking</strong>: <code>ls -l /proc/*/fd</code> filtered for the lock file, or <code>fuser -v /tmp/trien-khai.lock</code>, names the process that holds it.</li>
</ul>

<h3>Waiting for the other deploy without waiting forever</h3>
${slide('dv-07', 17, 'Vòng chờ pgrep -f tự khớp chính nó')}
<p>When a deploy refuses because another is running, the natural next step is a loop: "wait until it is gone, then run mine". This is the loop two sessions wrote on the same day — and both waited forever while nothing was deploying. Reproduced on the lab VPS:</p>
<div class="out">$ pgrep -af deploy-nha.sh        # khong co deploy nao chay
  ma: 1
$ timeout 5 bash -c "while pgrep -f deploy-nha.sh &gt;/dev/null; do sleep 1; done; bash deploy-nha.sh"
  ma: 124
$ bash -c "pgrep -af deploy-nha.sh; true"   # vong cho thay AI?
631 bash -c pgrep -af deploy-nha.sh; true
$ bash -c "pgrep -af \\"^bash deploy-nha\\"; echo ma: \\$?"
  ma: 1
$ bash deploy-nha.sh &amp;   # mot lan deploy THAT dang chay
$ bash -c "pgrep -af \\"^bash deploy-nha\\"; true"
648 bash deploy-nha.sh
  vong cho thoat sau 2888ms — den luot minh</div>
<p><code>pgrep -f</code> matches against the <strong>whole command line</strong> of every process. The shell running the loop has <code>deploy-nha.sh</code> in its own command line (it is the text of the loop), so <code>pgrep</code> always finds at least one match: itself. <code>timeout 5</code> had to kill it (exit 124). Anchoring the pattern to the start of the command line, <code>^bash deploy-nha</code>, matches a real deploy (<code>648 bash deploy-nha.sh</code>) and not the loop. Better still, wait on the thing the deploy actually holds: <code>flock -w 1800 /tmp/trien-khai.lock true</code> returns as soon as the lock is free, with a 30-minute ceiling, and cannot match itself.</p>

<h3>Exit codes worth borrowing</h3>
<p>The numbers 2–9 in this chapter are this script&#39;s own convention. When you want a number that other tools already understand, <code>sysexits.h</code> (BSD, also on Linux) defines a few that fit deploy scripts well:</p>
<table>
<thead><tr><th>Code</th><th>Name</th><th>Fits</th></tr></thead>
<tbody>
<tr><td>64</td><td><code>EX_USAGE</code></td><td>called with wrong arguments — what macOS <code>mv -T</code> returned in 7.2</td></tr>
<tr><td>69</td><td><code>EX_UNAVAILABLE</code></td><td>a required service (the registry, the build machine) is unreachable</td></tr>
<tr><td>75</td><td><code>EX_TEMPFAIL</code></td><td>"try again later" — the lock is held; this repository&#39;s deploy script uses it for exactly that</td></tr>
<tr><td>78</td><td><code>EX_CONFIG</code></td><td>a configuration error — a missing variable in the production <code>.env</code></td></tr>
</tbody></table>

<h3>On macOS and Windows</h3>
<div class="out">$ command -v flock || echo "flock: khong co tren macOS"
flock: khong co tren macOS
$ df -BG /
df: invalid option -- B
usage: df [--libxo] [-b | -g | -H | -h | -k | -m | -P] [-acIilnY] [-,] [-T type] [-t type]</div>
<ul>
<li><strong>There is no <code>flock</code> command on macOS</strong>, and <code>df</code> is the BSD one (<code>-g</code>, <code>-m</code>; no <code>-B</code>, no <code>--output</code>). Both gates belong on the machine where the swap and the disk are — the VPS — run over SSH.</li>
<li><strong>A lock on your laptop protects nothing</strong> when a teammate deploys from theirs. The lock has to live on the shared machine.</li>
<li><strong>Git Bash on Windows</strong> runs the git gates fine; for the rest, use WSL (Ubuntu), which has <code>flock</code>, GNU <code>df</code> and <code>pgrep</code> like the VPS.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the evening before the defence, two teammates both type "deploy" within a minute of each other, and a third one is behind <code>origin/main</code>. Your gates should turn all of that into clear refusals. On the lab VPS:</p>
<ol>
<li>Build the practice repository: <code>vps 'mkdir -p g &amp;&amp; cd g &amp;&amp; git init -q --bare goc.git &amp;&amp; git clone -q goc.git may &amp;&amp; git clone -q goc.git ban'</code>, make one commit in <code>may</code>, push, then one in <code>ban</code>, push, and <code>git fetch</code> in <code>may</code>. Run <code>chot.sh</code> in <code>may</code>, then <code>git pull</code> and run it again; then dirty a file; then switch to a new branch.</li>
<li>Run <code>hoi-moi.sh</code> three ways: <code>&lt;/dev/null</code>, <code>echo y |</code>, and <code>--dong-y</code>.</li>
<li>On the tmpfs "disk": <code>vps 'head -c 180M /dev/zero &gt; /srv/dia/rac.bin; df -BG --output=avail /srv/dia; df -BM --output=avail /srv/dia'</code>.</li>
<li>Run two copies of <code>khoa.sh</code> 0.2 s apart, first with <code>-n</code>, then with <code>"-w 5"</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>chot.sh</code> produced 12, 0, 11 and 10 in that order; <code>hoi-moi.sh</code> produced 4, 4 and 0; <code>-BG</code> showed <code>2G</code> while <code>-BM</code> showed about <code>1120M</code>; and the second <code>khoa.sh</code> exited 75 with <code>-n</code> and 0 with <code>-w 5</code>. Finish with <code>vps 'rm /srv/dia/rac.bin'</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Precondition / gate</span><span class="v">A check that must pass before the script changes anything.</span></div>
  <div class="kv"><span class="k">Refusal</span><span class="v">Stopping before the first write, with its own exit code — safe to fix and re-run.</span></div>
  <div class="kv"><span class="k">TTY (<code>[ -t 0 ]</code>)</span><span class="v">Whether standard input is a terminal a human can type into.</span></div>
  <div class="kv"><span class="k">Porcelain status</span><span class="v"><code>git status --porcelain</code>: stable, script-friendly output; empty means clean.</span></div>
  <div class="kv"><span class="k">Advisory lock (<code>flock</code>)</span><span class="v">A kernel lock on an open file, released when the last descriptor closes.</span></div>
  <div class="kv"><span class="k">EX_TEMPFAIL (75)</span><span class="v">Conventional exit code for "temporary failure, try again later".</span></div>
  <div class="kv"><span class="k">Self-match</span><span class="v"><code>pgrep -f</code> finding the command line of the very shell that is searching.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A prompt with nobody to answer must refuse with its own code; <code>echo y |</code> answers on someone&#39;s behalf, and <code>read -p</code> does not even print the question.</li>
<li>Three git gates — on <code>main</code>, clean tree, not behind <code>origin</code> — each measured as a distinct refusal (10, 11, 12).</li>
<li><code>df -BG</code> rounds up (1.1 GB shown as 2G); count free space in megabytes on the filesystem that fills.</li>
<li><code>flock -n</code> refuses at once, <code>-w</code> queues; the lock belongs on the shared machine, not the laptop.</li>
<li>A lock file survives <code>kill -9</code> forever; <code>flock</code> is freed when the last descriptor closes — including in children.</li>
<li><code>while pgrep -f name</code> matches itself; anchor with <code>^bash name</code> or wait on the lock with a ceiling.</li>
</ul>


<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bash Reference Manual — Bash Conditional Expressions</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#Bash-Conditional-Expressions — <code>-t fd</code>, the one-character test behind the fix above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">flock(1)</span><span class="lc-sub">man 1 flock — the <code>-w</code> timeout and the file-descriptor form used here, plus the inheritance behaviour across <code>fork</code> that causes the deadlock in the pitfall.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sysexits.h — conventional exit codes</span><span class="lc-sub">man 3 sysexits — BSD&#39;s attempt at standard exit codes (<code>EX_USAGE</code> 64, <code>EX_UNAVAILABLE</code> 69…). Not widely followed, but worth reading before you invent your own numbering.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — porcelain status and scripting git</span><span class="lc-sub">/courses/git/learn${REF} — <code>git status --porcelain</code> and <code>git rev-list --count</code>, the two commands behind the clean-tree and not-behind checks.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>TỪ CHỐI chạy</h2>
<p class="lead">Thứ giá trị nhất một script deploy làm được thường là KHÔNG LÀM GÌ CẢ — dừng lại trước khi bắt đầu, vì một điều kiện tiên quyết chưa đủ. Phần khó là dừng theo cách mà có ai đó NHẬN RA.</p>

<h3>Lời hỏi báo cáo THÀNH CÔNG</h3>
<p>Một script hỏi xác nhận khi cây làm việc còn thay đổi chưa commit. Hợp lý, phổ biến, và chính script deploy của kho này làm đúng thế. Đây là nó dưới ba điều kiện:</p>

<pre><code class="language-bash">read -rp "Van deploy? [y/N] " tl
[[ "\$tl" == "y" ]] || { echo "huy."; exit 0; }
echo "=== DANG DEPLOY ==="</code></pre>

<div class="out">--- chay co terminal, tra loi y ---   → DANG DEPLOY | ma thoat: 0
--- chay co terminal, tra loi n ---   → huy.        | ma thoat: 0
--- chay NEN (stdin la /dev/null) --- → (im lang)   | ma thoat: 1</div>

<p>Ba kết cục khác nhau, hai trong số đó báo 0. Trả lời <em>KHÔNG</em> và deploy THÀNH CÔNG là không phân biệt được với bất cứ thứ gì đọc mã thoát. Và để ý dòng thứ ba: với <code>set -euo pipefail</code>, <code>read</code> chạm hết-tệp thì trả khác không và errexit giết script — thoát 1, ít nhất thì cái đó thành thật.</p>

<h3>Biến thể IM LẶNG thật sự</h3>
<p>Nhưng kết quả thứ ba đó phụ thuộc vào một chi tiết. Thêm cái <code>|| true</code> mà người ta viết để <code>read</code> khỏi giết script — hoặc đặt một giá trị mặc định, hoặc đưa lệnh read vào trong một điều kiện — và errexit bị treo:</p>

<div class="out">=== bien the A: read dung mot minh, co set -e ===
  ma thoat: 1

=== bien the B: read co '|| true' — set -e bi treo ===
huy.
  ma thoat: 0
  → thoat 0 va IM LANG. Day la bien the nguy hiem: CI ket luan deploy XONG.

=== bien the C: read co mac dinh, van im lang ===
huy.
  ma thoat: 0</div>

<p>Biến thể B và C thoát 0 mà KHÔNG deploy. Chạy từ cron, từ CI, từ một tác vụ nền, từ một agent — bất cứ thứ gì không có terminal — và lần deploy không bao giờ xảy ra trong khi mọi chỉ báo đều nói là đã xảy ra. Chính ghi chú của kho này ghi lại đúng chuyện đó: <em>"Chạy nền thì phải <code>echo y | bash deploy-nha.sh</code>, không thì nó dừng im với exit 0."</em></p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">deploy chạy</span><span class="lz-t">thoát 0</span><span class="lz-d">đúng</span></div>
<div class="lz-step"><span class="lz-k">người trả lời KHÔNG</span><span class="lz-t">thoát 0</span><span class="lz-d">không phân biệt được với thành công</span></div>
<div class="lz-step"><span class="lz-k">không ai trả lời được</span><span class="lz-t">thoát 0</span><span class="lz-d">cái nguy hiểm: chẳng deploy gì, mọi thứ đều xanh</span></div>
</div>

<h3>Hai dòng chữa được</h3>
${slide('dv-07', 12, '[y/N] không terminal: đừng đoán, TỪ CHỐI — echo y và --dong-y')}
<pre><code class="language-bash">if [ ! -t 0 ]; then
  echo "khong co terminal de hoi — TU CHOI deploy. Dung --dong-y de bo qua." >&amp;2
  exit 4
fi
read -rp "Van deploy? [y/N] " tl
[[ "\$tl" == "y" ]] || { echo "huy theo yeu cau nguoi dung."; exit 3; }</code></pre>

<div class="out">cay lam viec con thay doi chua commit.
khong co terminal de hoi — TU CHOI deploy. Dung --dong-y de bo qua.
  ma thoat: 4</div>

<p><code>[ -t 0 ]</code> hỏi xem đầu vào chuẩn có phải một terminal không. Nếu không, thì chẳng có ai để trả lời, và script nói thẳng điều đó ra stderr kèm mã thoát riêng thay vì đoán mò. Cái cửa thoát <code>--dong-y</code> là thứ làm cho chuyện này dùng được trong tự động hoá: bên gọi PHÁT BIỂU ý định của mình một cách tường minh thay vì để script suy ra từ sự im lặng.</p>

<div class="callout ok">
<p><strong>Cho MỖI lời từ chối một mã thoát riêng.</strong> Script ở bài 7.5 dùng 2 cho "không có bản đó", 3 cho "người dùng nói không", 4 cho "không có terminal", 5 cho "thiếu một công cụ bắt buộc", 6 cho "tạo tác dị dạng", 7 cho "nó không lên được", 8 cho "kiểm khói hỏng", 9 cho "cửa trước không đồng ý". Một script bọc ngoài khi đó coi 3 là bình thường còn 7 là báo động. Một script trả về 1 cho mọi thứ buộc người gọi nó phải đi phân tích tiếng Anh.</p>
</div>

<h3>Những điều kiện tiên quyết khác đáng kiểm</h3>
<p>Cái nào cũng rẻ, và cái nào cũng từng phá hỏng buổi chiều của ai đó:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">công cụ bắt buộc có mặt</span><span class="lz-lnote"><code>command -v curl >/dev/null || exit 5</code> — bài 7.4 đo xem thiếu cái này thì sao</span></div>
<div class="lz-layer"><span class="lz-lname">bản phát hành tồn tại</span><span class="lz-lnote">và dòng lỗi liệt kê những bản CÓ, để con người khỏi phải đi tìm</span></div>
<div class="lz-layer"><span class="lz-lname">cây làm việc sạch</span><span class="lz-lnote">vì dựng từ cây bẩn là gửi đi một thứ không commit nào mô tả (Chương 1)</span></div>
<div class="lz-layer"><span class="lz-lname">không đứng sau kho từ xa</span><span class="lz-lnote">deploy một commit cũ hơn <code>origin/main</code> là âm thầm cuộn ngược công sức của đồng nghiệp</span></div>
<div class="lz-layer"><span class="lz-lname">không có lần deploy nào khác đang chạy</span><span class="lz-lnote"><code>flock</code>, kèm việc đóng fd trong tiến trình con — xem cái bẫy ngay dưới</span></div>
<div class="lz-layer"><span class="lz-lname">đủ đĩa</span><span class="lz-lnote">một bản dựng làm đầy đĩa sẽ kéo cả cơ sở dữ liệu chết theo (Chương 8)</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>flock</code> cộng một tiến trình nền là một cú tự kẹt.</strong> Bài 3.5 đã đo chuyện này trên chính script tráo của tôi: <code>exec 9>/var/lock/x</code> lấy khoá trên mô tả tệp số 9, rồi ứng dụng được khởi động ở nền và <em>THỪA KẾ fd 9</em>. Script thoát, cái khoá KHÔNG được nhả — cái ứng dụng sống lâu vẫn đang giữ nó — và lần deploy sau chờ vô hạn trên một cái khoá thuộc về một tiến trình chẳng biết là mình đang giữ. Cách chữa là <code>9>&amp;-</code> trên lệnh chạy nền, đóng cái mô tả đó trong tiến trình con. Chẩn đoán bằng <code>ls -l /proc/&lt;pid&gt;/fd</code> hoặc <code>fuser /var/lock/x</code>.</p>
</div>

<h3>TỪ CHỐI không giống HỎNG</h3>
<p>Có một khác biệt thật giữa "tôi sẽ KHÔNG làm chuyện này" và "tôi đã thử và nó vỡ", và mã thoát nên mang được khác biệt đó. Một lời từ chối nghĩa là cái máy KHÔNG bị đụng tới — sửa điều kiện rồi chạy lại ngay là an toàn. Một cú hỏng nghĩa là đã có thứ gì đó thay đổi và bạn nên NHÌN trước khi chạy lại. Trong script ở bài 7.5, MỌI lời từ chối xảy ra <em>TRƯỚC</em> khi lấy khoá và trước khi ghi bất kỳ tệp nào, và đó là thứ làm cho lời hứa kia thành sự thật chứ không phải nguyện vọng.</p>

<div class="kv-grid">
<div class="kv"><span class="k">từ chối</span><span class="v">không gì thay đổi; sửa điều kiện, chạy lại</span></div>
<div class="kv"><span class="k">hỏng</span><span class="v">có thứ đã thay đổi; cú lùi trong trap lẽ ra đã lo (7.5)</span></div>
<div class="kv"><span class="k">quy tắc thứ tự</span><span class="v">mọi phép kiểm có thể từ chối đều đứng TRƯỚC lần ghi đầu tiên</span></div>
<div class="kv"><span class="k">phép thử</span><span class="v">chạy từng nhánh từ chối rồi xác nhận cái máy sau đó giống hệt từng byte</span></div>
</div>

<h3><code>echo y |</code> thật ra làm gì</h3>
<p>Ghi chú của kho này đưa ra cách đi vòng cho lời hỏi im lặng: bơm <code>echo y</code> vào script. Nó chạy được — và đáng đem đo xem nó NGHĨA là gì. Hai bản của lời hỏi, chạy năm cách trên VPS thí nghiệm. <code>hoi-cu.sh</code> có hình dạng của script deploy thật; <code>hoi-moi.sh</code> có hai dòng chữa ở trên cộng cờ tường minh:</p>
<pre><code class="language-bash"># hoi-cu.sh — dạng của script deploy thật trong kho này
read -r -p "Van deploy? [y/N] " tl || tl=""
[[ "$tl" =~ ^[Yy]$ ]] || { echo "Dung theo yeu cau."; exit 0; }

# hoi-moi.sh
DONG_Y=0; [ "\${1:-}" = "--dong-y" ] &amp;&amp; DONG_Y=1
if [ "$DONG_Y" != 1 ]; then
  [ -t 0 ] || { echo "stdin khong phai terminal — TU CHOI. Dung --dong-y." &gt;&amp;2; exit 4; }
  read -r -p "Van deploy? [y/N] " tl
  [[ "$tl" =~ ^[Yy]$ ]] || { echo "huy theo yeu cau."; exit 3; }
fi</code></pre>
<div class="out">$ bash hoi-cu.sh &lt;/dev/null
  cay lam viec con thay doi chua commit.
  Dung theo yeu cau.
  ma thoat: 0
$ echo y | bash hoi-cu.sh
  cay lam viec con thay doi chua commit.
  === DANG DEPLOY ===
  ma thoat: 0
$ bash hoi-moi.sh &lt;/dev/null
  cay lam viec con thay doi chua commit.
  stdin khong phai terminal — TU CHOI. Dung --dong-y.
  ma thoat: 4
$ echo y | bash hoi-moi.sh
  cay lam viec con thay doi chua commit.
  stdin khong phai terminal — TU CHOI. Dung --dong-y.
  ma thoat: 4
$ bash hoi-moi.sh --dong-y &lt;/dev/null
  cay lam viec con thay doi chua commit.
  === DANG DEPLOY ===
  ma thoat: 0</div>
<ul>
<li><strong><code>echo y |</code> là trả lời HỘ con người.</strong> Script cũ không phân biệt được một người gõ <code>y</code> với một cái ống nói <code>y</code> cho MỌI câu hỏi — kể cả câu bạn thêm vào tháng sau, kiểu "migration sẽ xoá một cột, tiếp tục không?". Script đã sửa coi ống là "không có ai ở đó" (mã 4) và bắt phía tự động hoá nói rõ ý định bằng <code>--dong-y</code>.</li>
<li><strong>Câu hỏi không bao giờ hiện trong log.</strong> Tìm <code>Van deploy? [y/N]</code> trong output ở trên: không có. Tài liệu bash ghi <code>read -p</code> chỉ in lời nhắc "khi đầu vào đến từ một terminal". Một lần chạy nền không để lại dấu vết nào cho thấy đã từng có câu hỏi — chỉ có "Dung theo yeu cau." và một số 0.</li>
<li><strong>SSH không có <code>-t</code> cũng là "không phải terminal".</strong> Nếu lời xác nhận nằm trong một script chạy <em>TRÊN VPS</em>, kết quả tuỳ vào cách bạn kết nối:</li>
</ul>
<div class="out">$ vps '[ -t 0 ] &amp;&amp; echo "stdin: terminal" || echo "stdin: KHONG phai terminal"'
stdin: KHONG phai terminal
$ ssh -tt -i ./khoa -o UserKnownHostsFile=./known_hosts -p 19072 deploy@127.0.0.1 \\
    '[ -t 0 ] &amp;&amp; echo "stdin: terminal" || echo "stdin: KHONG phai terminal"'
stdin: terminal
Connection to 127.0.0.1 closed.</div>
<p>Nên một script ở xa có cái chắn <code>[ -t 0 ]</code> sẽ từ chối dưới <code>ssh … 'bash deploy.sh'</code> thường — ĐÚNG, vì chẳng ai gõ được vào đó — và hỏi bình thường dưới <code>ssh -t</code> (<code>-t</code>: xin cấp một terminal giả ở phía máy chủ).</p>

<h3>Ba chốt git, đo thật</h3>
${slide('dv-07', 13, 'Ba chốt git: nhánh · cây bẩn · đứng sau')}
<p>Danh sách ở trên gọi tên các điều kiện tiên quyết; đây là ba trong số đó viết thành mã, chạy trên một kho thử trên VPS thí nghiệm với "origin" là một kho trần (bare repository — kho chỉ chứa lịch sử, không có cây làm việc) đóng vai GitHub. Một bạn cùng nhóm vừa push commit c2:</p>
<pre><code class="language-bash">#!/bin/bash
set -euo pipefail
tu_choi() { echo "  ✗ $2" &gt;&amp;2; exit "$1"; }
NHANH=$(git rev-parse --abbrev-ref HEAD)
[ "$NHANH" = main ] || tu_choi 10 "dang o nhanh '$NHANH', chi deploy tu main"
BAN=$(git status --porcelain --untracked-files=no)
[ -z "$BAN" ] || tu_choi 11 "cay lam viec ban: $(echo "$BAN" | wc -l) tep chua commit"
git fetch -q origin
SAU=$(git rev-list --count HEAD..origin/main)
[ "$SAU" = 0 ] || tu_choi 12 "dung SAU origin/main $SAU commit — git pull truoc"
SHA=$(git rev-parse HEAD)
echo "  ✓ qua ca ba chot — se deploy \${SHA:0:8}"</code></pre>
<div class="out">--- 1) dung sau origin
  ✗ dung SAU origin/main 1 commit — git pull truoc
  ma thoat: 12
--- 2) sau khi pull
  ✓ qua ca ba chot — se deploy 8e1f5b45
  ma thoat: 0
$ echo x &gt;&gt; a; bash chot.sh
  ✗ cay lam viec ban: 1 tep chua commit
  ma thoat: 11
--- 4) tren nhanh khac
  ✗ dang o nhanh 'thu-nghiem', chi deploy tu main
  ma thoat: 10
# (khôi phục a) thêm tệp moi.txt CHƯA theo dõi — ?? — rồi chạy lại:
  ✓ qua ca ba chot — se deploy 8e1f5b45
  ma thoat: 0</div>
<table>
<thead><tr><th>Lệnh</th><th>Trả lời câu gì</th><th>Vì sao quan trọng với deploy</th></tr></thead>
<tbody>
<tr><td><code>git rev-parse --abbrev-ref HEAD</code></td><td>đang đứng ở nhánh nào</td><td>production trở thành <em>ĐÚNG</em> nhánh bạn deploy — mọi thứ chỉ có ở nơi khác đều biến mất</td></tr>
<tr><td><code>git status --porcelain --untracked-files=no</code></td><td>tệp đã theo dõi bị sửa mà chưa commit (rỗng = sạch)</td><td>dựng từ phần chưa commit là gửi đi thứ không commit nào mô tả; tệp chưa theo dõi <code>??</code> cố ý bỏ qua</td></tr>
<tr><td><code>git rev-list --count HEAD..origin/main</code></td><td>số commit origin có mà bạn chưa có</td><td>deploy khi đang đứng sau là âm thầm cuộn ngược công sức của đồng đội trên máy chủ</td></tr>
<tr><td><code>git rev-parse HEAD</code></td><td>mã commit đầy đủ</td><td>đọc nó MỘT lần, ở đây, rồi dùng đúng giá trị đó cho mọi thứ phía sau (Bài 7.5)</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><strong>Sự cố thật — ba lần deploy, ba nhánh, một buổi sáng.</strong> Trong một dự án sinh viên có nhiều phiên lập trình cùng làm song song trên một kho, ba lần deploy liền nhau đi ra từ ba nhánh khác nhau, mỗi nhánh tách ra ở một điểm khác nhau. Mỗi lần deploy xoá phần việc của các nhánh kia khỏi production — cửa hàng, ví điểm, cổng LLM. Không có gì kêu: build xanh, đẩy xanh, tráo xanh, và smoke-test sạch vì nó chỉ biết các route của đúng nhánh đang deploy. Cái chốt cuối cùng giữ được KHÔNG nằm trong script (mỗi nhánh mang theo bản chép cũ của script) mà là một hook <code>pre-receive</code> (móc chạy trước khi kho nhận push) trên cái kho mà mọi lần deploy đều push vào — thứ mọi lần deploy bắt buộc đi qua.</div>

<h3>Chốt đĩa cho qua khi chỉ còn 1,1 GB</h3>
${slide('dv-07', 14, 'df -BG làm tròn LÊN: 1,1G hiện thành 2G')}
<p>Đĩa đầy giữa lúc build là cách dự án này suýt mất cơ sở dữ liệu (Chương 8), nên "đủ đĩa" là một chốt đáng có. Cách viết hiển nhiên của nó có bẫy. Đo trên VPS thí nghiệm với một tmpfs 1.300 MB đóng vai đĩa, sau khi ghi 180 MB vào, và một cái chốt đòi ít nhất 2 GB:</p>
<div class="out">$ df -h /srv/dia
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           1.3G  180M  1.1G  14% /srv/dia
$ df -BG --output=avail /srv/dia
Avail
   2G
$ df -BM --output=avail /srv/dia
Avail
1120M
$ df -B1 --output=avail /srv/dia
     Avail
1174405120
CON=2
QUA chot &gt;=2G (con 2G)
MB=1120
TU CHOI: chi con 1120M, can 2048M</div>
<p><code>df -h</code> nói còn 1.1G, <code>-BM</code> nói 1120M, còn <code>-BG</code> nói <strong>2G</strong>. Với <code>-B</code>, <code>df</code> của GNU làm tròn LÊN tới đơn vị nguyên kế tiếp, nên một chốt "≥ 2G" viết theo gigabyte cho 1,1 GB đi qua. Sai số có thể gần trọn một đơn vị: ngưỡng "≥ 20G" thì 19,1 GB vẫn qua. Chính script của dự án này kiểm máy build bằng đúng <code>df -BG --output=avail / … -lt 20</code>. Hãy đếm theo megabyte — sai số làm tròn co lại còn 1 MB:</p>
<pre><code class="language-bash">MB=$(df -BM --output=avail /var/lib/docker | tail -1 | tr -dc '0-9')
[ "\${MB:-0}" -ge 5120 ] || { echo "chi con \${MB}M tren /var/lib/docker, can 5120M" &gt;&amp;2; exit 5; }</code></pre>
<ul>
<li><strong>Kiểm đúng hệ tệp sẽ đầy</strong>, đừng kiểm <code>/</code> theo thói quen: ảnh và cache build nằm ở <code>/var/lib/docker</code>, có thể là một ổ riêng.</li>
<li><strong><code>\${MB:-0}</code></strong> biến "không đọc được con số" thành TRƯỢT chốt thay vì làm phép so sánh sập — đĩa không đọc được là lý do để từ chối, không phải để đi tiếp.</li>
</ul>

<h3>Hai lần deploy cùng lúc: cái khoá phải làm gì</h3>
${slide('dv-07', 15, 'Hai deploy cùng lúc: flock -n hay -w')}
<p>Bài 3.5 đã giới thiệu <code>flock</code> cho bước tráo. Với script deploy, câu hỏi là CHÍNH SÁCH: khi lần deploy thứ hai bắt đầu trong lúc lần thứ nhất đang chạy, nó nên bỏ cuộc hay chờ? Cả hai, đo bằng một script giữ khoá 2 giây, và bản thứ hai khởi động sau 0,2 giây:</p>
<pre><code class="language-bash">#!/bin/bash
set -euo pipefail
T0=$(date +%s%3N); t() { echo "$(( $(date +%s%3N) - T0 ))ms"; }
TEN=$1; CHE=\${2:--n}
exec 9&gt;/tmp/trien-khai.lock
if ! flock $CHE 9; then echo "  [$TEN $(t)] co lan deploy khac dang chay — thoat 75"; exit 75; fi
echo "  [$TEN $(t)] giu khoa, dang trao..."; sleep 2; echo "  [$TEN $(t)] xong"</code></pre>
<div class="out">--- flock -n (khong cho)
  [A 3ms] giu khoa, dang trao...
  [B 3ms] co lan deploy khac dang chay — thoat 75
  B ma thoat: 75
  [A 2008ms] xong
--- flock -w 5 (cho toi 5 giay)
  [A 5ms] giu khoa, dang trao...
  [A 2010ms] xong
  [B 1813ms] giu khoa, dang trao...
  [B 3816ms] xong
  B ma thoat: 0</div>
<table>
<thead><tr><th>Cờ</th><th>Hành vi đo được</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td><code>flock -n 9</code></td><td>B bỏ cuộc sau 3 ms với mã 75</td><td>con người chạy deploy: họ biết NGAY là có người khác đang deploy</td></tr>
<tr><td><code>flock -w 5 9</code></td><td>B chờ 1,8 s rồi chạy sau A</td><td>tự động hoá xếp hàng các lần deploy; cho thời gian chờ một cái trần lớn hơn một lần deploy</td></tr>
<tr><td>không khoá</td><td>—</td><td>không bao giờ, một khi có hơn một người hoặc một phiên deploy được</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><strong>Sự cố thật — bốn lần deploy cùng lúc.</strong> Bốn phiên lập trình khởi động cùng một script deploy trong vòng 13 phút. Ảnh build song song vẫn ổn; tới bước tráo, ba phiên dừng với <code>EXIT=75</code> ("có phiên khác đang tráo trên VPS"). Đó là kết cục <em>TỐT</em>: khoá từ chối TRƯỚC khi đổi bất cứ thứ gì. Vào một ngày khác, hai phiên không có cái khoá đó va nhau sớm hơn một bước, khi cùng push vào một nhánh của kho trên máy build: <code>cannot lock ref 'refs/heads/deploy': reference already exists</code>. Phản ứng đúng ở cả hai lần là một: đừng xoá khoá hay ref, chờ các phiên kia xong, rồi ĐO xem production đang chạy gì trước khi quyết định deploy lại.</div>

<h3>Khi kẻ giữ khoá chết</h3>
${slide('dv-07', 16, 'kill -9: khoá tệp kẹt mãi, flock thì không')}
<p>Một lần deploy có thể bị giết — mất kết nối SSH, ai đó bấm Ctrl-C hai lần, bộ diệt-khi-hết-RAM (OOM killer) ra tay. Chuyện gì xảy ra với cái khoá tuỳ vào cách nó được làm. Đo thật: A lấy khoá, bị <code>kill -9</code> nửa giây sau, rồi B thử:</p>
<div class="out">--- khoa bang TEP: A bi kill -9, roi B chay
  [A] giu khoa tep, dang trao...
--- 3 giay sau, khong con tien trinh nao
  [B] co tep /tmp/dang-deploy — thoat 75
  B ma thoat: 75
  (khong con sleep nao)

--- A bi kill -9 giua chung, roi B chay
  [A 2ms] giu khoa, dang trao...
  [B 2ms] co lan deploy khac dang chay — thoat 75
  B ma thoat: 75
# lan do 2: lai kill -9 A, roi hoi ai giu khoa
$ ai dang giu /tmp/trien-khai.lock?
    508 sleep           sleep 2
--- 2 giay sau (sleep da thoat)
  [B 2ms] giu khoa, dang trao...
  [B 2007ms] xong
  B ma thoat: 0</div>
<ul>
<li><strong>Một TỆP khoá sống lâu hơn chủ của nó.</strong> <code>trap … EXIT</code> không chạy khi bị SIGKILL, nên <code>/tmp/dang-deploy</code> nằm lại, và mọi lần deploy sau đều từ chối cho tới khi có người xoá tay — mà người đó phải CHẮC là không có gì đang chạy thật.</li>
<li><strong><code>flock</code> được nhân nhả khi mô tả tệp CUỐI CÙNG đóng</strong> — không nhất thiết là lúc script chết. Ở đây tiến trình con <code>sleep 2</code> của A thừa hưởng fd 9 và giữ khoá thêm hai giây. Thay <code>sleep</code> bằng một ứng dụng chạy nền là nó giữ khoá <em>MÃI MÃI</em> — đúng cú kẹt mà Bài 3.5 đã đo. <code>9&gt;&amp;-</code> trên mọi lệnh chạy nền đóng fd đó trong tiến trình con.</li>
<li><strong>Chẩn đoán bằng cách NHÌN</strong>: <code>ls -l /proc/*/fd</code> lọc theo tệp khoá, hoặc <code>fuser -v /tmp/trien-khai.lock</code>, gọi tên tiến trình đang giữ nó.</li>
</ul>

<h3>Chờ lượt deploy kia mà không chờ mãi</h3>
${slide('dv-07', 17, 'Vòng chờ pgrep -f tự khớp chính nó')}
<p>Khi một lần deploy từ chối vì lần khác đang chạy, bước tự nhiên tiếp theo là một vòng lặp: "chờ tới khi nó xong, rồi chạy của mình". Đây là vòng lặp mà hai phiên viết ra trong cùng một ngày — và cả hai chờ mãi trong khi CHẲNG CÓ GÌ đang deploy. Tái hiện trên VPS thí nghiệm:</p>
<div class="out">$ pgrep -af deploy-nha.sh        # khong co deploy nao chay
  ma: 1
$ timeout 5 bash -c "while pgrep -f deploy-nha.sh &gt;/dev/null; do sleep 1; done; bash deploy-nha.sh"
  ma: 124
$ bash -c "pgrep -af deploy-nha.sh; true"   # vong cho thay AI?
631 bash -c pgrep -af deploy-nha.sh; true
$ bash -c "pgrep -af \\"^bash deploy-nha\\"; echo ma: \\$?"
  ma: 1
$ bash deploy-nha.sh &amp;   # mot lan deploy THAT dang chay
$ bash -c "pgrep -af \\"^bash deploy-nha\\"; true"
648 bash deploy-nha.sh
  vong cho thoat sau 2888ms — den luot minh</div>
<p><code>pgrep -f</code> so khớp với <strong>CẢ dòng lệnh</strong> của mọi tiến trình. Cái shell đang chạy vòng lặp có <code>deploy-nha.sh</code> ngay trong dòng lệnh của chính nó (đó là chữ của vòng lặp), nên <code>pgrep</code> luôn tìm thấy ít nhất một kết quả: CHÍNH NÓ. <code>timeout 5</code> phải giết nó (mã 124). Neo mẫu vào đầu dòng lệnh, <code>^bash deploy-nha</code>, thì khớp lần deploy thật (<code>648 bash deploy-nha.sh</code>) mà không khớp vòng lặp. Tốt hơn nữa, hãy chờ đúng cái thứ mà lần deploy giữ: <code>flock -w 1800 /tmp/trien-khai.lock true</code> trả về ngay khi khoá rảnh, có trần 30 phút, và không thể tự khớp chính nó.</p>

<h3>Những mã thoát đáng mượn</h3>
<p>Các số 2–9 trong chương này là quy ước riêng của script này. Khi bạn muốn một con số mà công cụ khác đã hiểu sẵn, <code>sysexits.h</code> (của BSD, có cả trên Linux) định nghĩa vài số hợp với script deploy:</p>
<table>
<thead><tr><th>Mã</th><th>Tên</th><th>Hợp với</th></tr></thead>
<tbody>
<tr><td>64</td><td><code>EX_USAGE</code></td><td>gọi sai tham số — đúng số mà <code>mv -T</code> của macOS trả về ở 7.2</td></tr>
<tr><td>69</td><td><code>EX_UNAVAILABLE</code></td><td>một dịch vụ bắt buộc (registry, máy build) không với tới được</td></tr>
<tr><td>75</td><td><code>EX_TEMPFAIL</code></td><td>"thử lại sau" — khoá đang bị giữ; script deploy của kho này dùng đúng số này cho đúng việc đó</td></tr>
<tr><td>78</td><td><code>EX_CONFIG</code></td><td>lỗi cấu hình — thiếu một biến trong <code>.env</code> production</td></tr>
</tbody></table>

<h3>Trên macOS và Windows</h3>
<div class="out">$ command -v flock || echo "flock: khong co tren macOS"
flock: khong co tren macOS
$ df -BG /
df: invalid option -- B
usage: df [--libxo] [-b | -g | -H | -h | -k | -m | -P] [-acIilnY] [-,] [-T type] [-t type]</div>
<ul>
<li><strong>macOS không có lệnh <code>flock</code></strong>, và <code>df</code> là bản BSD (<code>-g</code>, <code>-m</code>; không có <code>-B</code>, không có <code>--output</code>). Cả hai chốt thuộc về cái máy nơi có bước tráo và có cái đĩa — VPS — chạy qua SSH.</li>
<li><strong>Khoá trên laptop của bạn chẳng bảo vệ gì</strong> khi bạn cùng nhóm deploy từ máy họ. Khoá phải nằm trên cái máy DÙNG CHUNG.</li>
<li><strong>Git Bash trên Windows</strong> chạy được ba chốt git; phần còn lại dùng WSL (Ubuntu), có <code>flock</code>, <code>df</code> của GNU và <code>pgrep</code> như VPS.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối trước hôm bảo vệ, hai bạn cùng nhóm gõ "deploy" cách nhau chưa tới một phút, và bạn thứ ba đang đứng sau <code>origin/main</code>. Các chốt của bạn phải biến tất cả chuyện đó thành những lời từ chối rõ ràng. Trên VPS thí nghiệm:</p>
<ol>
<li>Dựng kho thử: <code>vps 'mkdir -p g &amp;&amp; cd g &amp;&amp; git init -q --bare goc.git &amp;&amp; git clone -q goc.git may &amp;&amp; git clone -q goc.git ban'</code>, tạo một commit trong <code>may</code> rồi push, một commit trong <code>ban</code> rồi push, và <code>git fetch</code> trong <code>may</code>. Chạy <code>chot.sh</code> trong <code>may</code>, rồi <code>git pull</code> và chạy lại; rồi làm bẩn một tệp; rồi chuyển sang một nhánh mới.</li>
<li>Chạy <code>hoi-moi.sh</code> ba cách: <code>&lt;/dev/null</code>, <code>echo y |</code>, và <code>--dong-y</code>.</li>
<li>Trên "đĩa" tmpfs: <code>vps 'head -c 180M /dev/zero &gt; /srv/dia/rac.bin; df -BG --output=avail /srv/dia; df -BM --output=avail /srv/dia'</code>.</li>
<li>Chạy hai bản <code>khoa.sh</code> cách nhau 0,2 s, lần đầu với <code>-n</code>, lần sau với <code>"-w 5"</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>chot.sh</code> cho ra 12, 0, 11 và 10 theo đúng thứ tự; <code>hoi-moi.sh</code> cho 4, 4 và 0; <code>-BG</code> hiện <code>2G</code> trong khi <code>-BM</code> hiện khoảng <code>1120M</code>; và <code>khoa.sh</code> thứ hai thoát 75 với <code>-n</code>, thoát 0 với <code>-w 5</code>. Dọn bằng <code>vps 'rm /srv/dia/rac.bin'</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Precondition / gate (điều kiện tiên quyết / chốt)</span><span class="v">Phép kiểm phải qua trước khi script đổi bất cứ thứ gì.</span></div>
  <div class="kv"><span class="k">Refusal (từ chối)</span><span class="v">Dừng TRƯỚC lần ghi đầu tiên, kèm mã thoát riêng — sửa điều kiện rồi chạy lại là an toàn.</span></div>
  <div class="kv"><span class="k">TTY (terminal, <code>[ -t 0 ]</code>)</span><span class="v">Đầu vào chuẩn có phải một terminal mà con người gõ vào được không.</span></div>
  <div class="kv"><span class="k">Porcelain status (trạng thái dạng cho máy đọc)</span><span class="v"><code>git status --porcelain</code>: output ổn định, dễ cho script; rỗng nghĩa là sạch.</span></div>
  <div class="kv"><span class="k">Advisory lock (khoá tư vấn, <code>flock</code>)</span><span class="v">Khoá của nhân trên một tệp đang mở, được nhả khi mô tả tệp cuối cùng đóng.</span></div>
  <div class="kv"><span class="k">EX_TEMPFAIL (75)</span><span class="v">Mã thoát theo quy ước cho "hỏng tạm thời, thử lại sau".</span></div>
  <div class="kv"><span class="k">Self-match (tự khớp)</span><span class="v"><code>pgrep -f</code> tìm thấy dòng lệnh của chính cái shell đang đi tìm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một lời hỏi không có ai trả lời phải từ chối kèm mã riêng; <code>echo y |</code> là trả lời hộ, và <code>read -p</code> còn không in câu hỏi ra.</li>
<li>Ba chốt git — đang ở <code>main</code>, cây sạch, không đứng sau <code>origin</code> — mỗi cái đo ra một lời từ chối riêng (10, 11, 12).</li>
<li><code>df -BG</code> làm tròn lên (1,1 GB hiện thành 2G); đếm chỗ trống theo megabyte trên đúng hệ tệp sẽ đầy.</li>
<li><code>flock -n</code> từ chối ngay, <code>-w</code> xếp hàng; khoá thuộc về máy dùng chung, không phải laptop.</li>
<li>Tệp khoá sống sót qua <code>kill -9</code> mãi mãi; <code>flock</code> được nhả khi fd cuối cùng đóng — kể cả fd trong tiến trình con.</li>
<li><code>while pgrep -f tên</code> tự khớp chính nó; neo bằng <code>^bash tên</code> hoặc chờ khoá có trần.</li>
</ul>


<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bash Reference Manual — Bash Conditional Expressions</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#Bash-Conditional-Expressions — <code>-t fd</code>, phép thử một ký tự nằm sau cách chữa ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">flock(1)</span><span class="lc-sub">man 1 flock — cờ hạn giờ <code>-w</code> và dạng dùng mô tả tệp như ở đây, cộng hành vi thừa kế qua <code>fork</code> gây ra cú kẹt trong cái bẫy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">sysexits.h — mã thoát theo quy ước</span><span class="lc-sub">man 3 sysexits — nỗ lực của BSD về mã thoát chuẩn (<code>EX_USAGE</code> 64, <code>EX_UNAVAILABLE</code> 69…). Không được theo rộng rãi, nhưng đáng đọc trước khi bạn tự bịa cách đánh số riêng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — porcelain status và viết script với git</span><span class="lc-sub">/courses/git/learn${REF} — <code>git status --porcelain</code> và <code>git rev-list --count</code>, hai lệnh nằm sau phép kiểm cây-sạch và không-đứng-sau.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — Proving it worked, and checking the checker|||7.4 — Chứng minh nó chạy, và KIỂM LẠI CHÍNH BỘ KIỂM',
      slug: 'deploy-7-4-kiem-khoi',
      type: 'VIDEO',
      description: 'Một bộ kiểm khói bắt được bản dựng nửa vời trong 40 mili giây. Rồi cùng bộ kiểm đó, viết bằng một công cụ không có trên máy: nó quay sáu vòng, tốn 3.022 mili giây, báo "KHÔNG lên được" trong khi ứng dụng chạy tốt — và thoát 0.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Proving it worked, and checking the checker</h2>
<p class="lead">Chapter 6 established that a rollback must be verified through the front door. A deploy is the same problem: the script knows what it <em>did</em>, and a smoke test is the only thing that knows what <em>happened</em>.</p>

<h3>What a smoke test is for</h3>
${slide('dv-07', 18, '401 ĐẠT · 404 bản cũ · 000 không ai nghe')}
<p>Not correctness — you have tests for that, and they ran before the artifact was built. A smoke test answers one narrow question: <strong>is the thing that is running actually the thing I just deployed, and is all of it there?</strong> The failure it is built to catch is the partial or stale build, where the process starts, the health check passes, and one router was never mounted.</p>

<p>Measured, against a version with all four routes and a version missing one:</p>

<pre><code class="language-bash">for R in /health /api/v1/don /api/v1/gifs /api/v1/tin; do
  MA=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 "http://127.0.0.1:\$CONG\$R")
  case "\$MA" in
    404) echo "  ✗ \$R → 404  (KHONG gan — ban cu/dung nua voi)"; LOI=1 ;;
    200|401) echo "  ✓ \$R → \$MA" ;;
    *) echo "  ? \$R → \$MA (khong ro)"; LOI=1 ;;
  esac
done
exit \$LOI</code></pre>

<div class="out">=== ban DU route ===
  ✓ /health → 200
  ✓ /api/v1/don → 401
  ✓ /api/v1/gifs → 401
  ✓ /api/v1/tin → 401
  ma thoat: 0
=== ban THIEU mot route (mo phong dung cu) ===
  ✓ /health → 200
  ✓ /api/v1/don → 401
  ✗ /api/v1/gifs → 404  (KHONG gan — ban cu/dung nua voi)
  ✓ /api/v1/tin → 401
  ma thoat: 1</div>

<div class="callout ok">
<p><strong>The key insight is that 401 is a pass.</strong> An unauthenticated request to a protected route returns 401 <em>if the route exists</em>, and 404 if it does not. So you can smoke-test every authenticated endpoint in your app without a single credential — you are not testing the handler, you are testing that the router mounted it. This repository&#39;s own deploy script does exactly this, and its notes are blunt about the diagnosis: <strong>401 = mounted (needs auth), 200 = mounted (public), 404 = NOT mounted / stale build.</strong></p>
</div>

<div class="pitfall">
<p><strong>Trap — only list routes that answer a bare unauthenticated GET.</strong> Add a POST-only route or one that requires a path parameter and every deploy fails on a route that was never going to return anything else. This repository learned that one the same way everybody does; its note now reads: <em>do NOT add POST-only or param-required routes, or every deploy will false-fail.</em> A smoke test that cries wolf gets commented out within a week, and then it is not protecting anything.</p>
</div>

<h3>Now the part everybody skips</h3>
${slide('dv-07', 20, 'Bộ kiểm KHÔNG CHẠY ĐƯỢC: kết cục thứ ba')}
<p>Here is the same check written with a tool that is not installed on this machine. The application is running perfectly on port 3330 throughout:</p>

<pre><code class="language-bash">for i in \$(seq 1 6); do
  if xh -q http://127.0.0.1:3330/health 2>/dev/null; then echo "  san sang"; exit 0; fi
  sleep 0.5
done
echo "  KHONG len duoc sau 6 lan thu"; exit 0</code></pre>

<div class="out">  wget     CO
  curl     CO
  httpie   KHONG
  xh       KHONG

  KHONG len duoc sau 6 lan thu
  ma thoat: 0 | mat 3022 ms
  → ung dung dang CHAY TOT o 3330. Bo kiem quay 6 vong, ton 3 giay, roi bao
    'KHONG len duoc' — va thoat 0.</div>

<p>Three seconds burned on every deploy, a false report that the app is down, and exit code 0 so nothing acts on it. Two failures stacked: the check cannot run, and the check that cannot run says nothing.</p>

<p>This is not hypothetical. This repository&#39;s notes record the identical shape: a frontend readiness check called <code>wget</code> <em>inside the frontend container</em>, and that image deliberately ships with neither <code>wget</code> nor <code>curl</code> — its compose healthcheck uses node&#39;s http module instead. The loop ran its full six iterations on every single deploy, cost about 25 seconds, and verified nothing.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">the check runs and passes</span><span class="lz-t">exit 0</span><span class="lz-d">the only outcome most people ever see</span></div>
<div class="lz-step"><span class="lz-k">the check runs and fails</span><span class="lz-t">exit ≠ 0</span><span class="lz-d">what you wrote it for</span></div>
<div class="lz-step"><span class="lz-k">the check cannot run</span><span class="lz-t">must be its own code</span><span class="lz-d">indistinguishable from failure unless you make it distinguishable</span></div>
</div>

<h3>One line at the top, measured</h3>
<pre><code class="language-bash">command -v xh >/dev/null || { echo "  bo kiem KHONG chay duoc: thieu xh" >&amp;2; exit 5; }</code></pre>

<div class="out">  bo kiem KHONG chay duoc: thieu xh
  ma thoat: 5 | mat 4 ms</div>

<p>Four milliseconds instead of 3,022, a message naming the actual problem, and a distinct exit code. And the fixed check, pointed at a genuinely dead port, still behaves correctly:</p>

<div class="out">--- cung script, tro vao cong CHET ---
  frontend KHONG len duoc sau 6 lan thu
  ma thoat: 6 | mat 3077 ms</div>

<p>Three seconds is the right cost <em>there</em> — it really was retrying a real connection to a real port. The 3,022 ms in the broken version was the same three seconds spent learning nothing.</p>

<h3>A log you can read afterwards</h3>
${slide('dv-07', 22, 'Nhật ký có giờ, set -x có số dòng')}
<p>The other half of proof is the record. Timestamping every line turns "the deploy was slow" into "step 2 took 900 ms":</p>

<pre><code class="language-bash">ghi() { printf '%s %s\\n' "\$(date +%H:%M:%S.%3N)" "\$*" | tee -a "\$LOG"; }</code></pre>

<div class="out">22:09:14.463 ── 1/4 dung tao tac ──
22:09:14.867 ── 2/4 chuyen len may ──
22:09:15.767 ── 3/4 chay migration ──
22:09:15.967 ── 4/4 trao va kiem ──
22:09:16.271 XONG</div>

<div class="pitfall">
<p><strong>Trap — <code>exec &gt; &gt;(…)</code> reorders your last line.</strong> The elegant way to timestamp everything is <code>exec &gt; &gt;(while read -r d; do printf '%s %s\\n' "\$(date …)" "\$d"; done) 2&gt;&amp;1</code>. It works, and it has a race: the process substitution is a separate process that keeps draining after the script exits. Measured three times out of three, the final <code>XONG</code> appeared <em>after</em> the calling shell had already moved on to the next command. If anything greps the log&#39;s last line to decide whether the deploy finished, that is a genuine race. The per-line <code>ghi()</code> function above has no such gap — I measured it three times and the ordering held.</p>
</div>

<p>And when a log is not enough, <code>set -x</code> with a useful <code>PS4</code> shows every command that actually ran, with line numbers:</p>

<pre><code>PS4='+ \${BASH_SOURCE##*/}:\${LINENO}: '
set -x</code></pre>

<div class="out">  + x.sh:5: BAN=v7
  + x.sh:6: DICH=/srv/vps/kb/idem/dich
  + x.sh:7: mkdir -p /srv/vps/kb/idem/dich/ban-v7
  + x.sh:8: ln -sfn /srv/vps/kb/idem/dich/ban-v7 /srv/vps/kb/idem/dich/ht.moi</div>

<p>Note that the variables are expanded — you see the path the script actually used, not the one you thought it would build. That is precisely the information you want when <code>-u</code> was missing and something got rooted at <code>/</code>.</p>

<div class="callout warn">
<p><strong>Never leave <code>set -x</code> on in a script that touches secrets.</strong> It prints expanded values, so a line like <code>curl -H "Authorization: Bearer \$TOKEN"</code> writes the token into your deploy log — where it sits in CI output, in log aggregation, and in whatever backups those have. Turn it on around the section you are debugging and off again with <code>set +x</code>, and read Chapter 4 on where secrets are allowed to appear.</p>
</div>

<h3>curl, flag by flag, for a smoke test</h3>
${slide('dv-07', 19, 'Vòng kiểm khói, từng cờ của curl')}
<p>The smoke test is one <code>curl</code> call per route, and every flag on it is doing a job. Measured against the lab app (<code>/health</code> 200, <code>/api/v1/don</code> 401, everything else 404, <code>/cham</code> answering after 5 seconds) and a port nobody listens on:</p>
<pre><code class="language-javascript">// app.mjs — ứng dụng thử của bài: bốn kiểu trả lời
import http from 'node:http';
const R = { '/health': 200, '/api/v1/don': 401, '/api/v1/tin': 401 };
http.createServer((q, s) =&gt; {
  if (q.url === '/ban') { s.end(process.env.BAN || 'v1'); return; }
  if (q.url === '/cham') { setTimeout(() =&gt; s.end('ok'), 5000); return; }
  const c = R[q.url] || 404; s.statusCode = c; s.end(String(c));
}).listen(+process.env.CONG || 3340, '127.0.0.1');</code></pre>
<div class="out"># mỗi dòng: printf "%-14s" $U; curl -s -o /dev/null -w "%{http_code}" --max-time 2 URL; echo "  exit=$?"
/health       200  exit=0
/api/v1/don   401  exit=0
/api/v1/gifs  404  exit=0
cong chet     000  exit=7
/cham (5s)    000  exit=28
-f /api/v1/don401  exit=22</div>
<table>
<thead><tr><th>Flag</th><th>What it does</th><th>Why the smoke test needs it</th></tr></thead>
<tbody>
<tr><td><code>-s</code></td><td>silent: no progress bar, no error text</td><td>the loop prints its own line; add <code>-S</code> if you want curl&#39;s error text back</td></tr>
<tr><td><code>-o /dev/null</code></td><td>throw the body away</td><td>you are testing that the route is mounted, not its content</td></tr>
<tr><td><code>-w '%{http_code}'</code></td><td>print only the status code</td><td>turns the answer into one comparable token — <code>000</code> when there was no HTTP answer at all</td></tr>
<tr><td><code>--max-time 2</code></td><td>ceiling for the whole transfer</td><td>a hung route (<code>/cham</code>) gives <code>000</code> and exit 28 after 2 s instead of hanging the deploy</td></tr>
<tr><td><code>--connect-timeout N</code></td><td>ceiling for the connection phase only</td><td>useful across a network; on <code>127.0.0.1</code> a dead port is refused at once (exit 7)</td></tr>
<tr><td><code>-f</code></td><td>HTTP status ≥ 400 becomes exit 22</td><td><strong>do not use here</strong>: it turns the 401 you want to pass into a failure</td></tr>
<tr><td><code>--retry N --retry-connrefused</code></td><td>retry transient errors, including "refused"</td><td>for a readiness wait; a smoke test runs <em>after</em> readiness and should not retry</td></tr>
</tbody></table>
<p>Two readings to keep. <code>000</code> is not a status code — it is curl saying "no HTTP answer", and the exit code tells you why: 7 refused, 28 timed out. And the <code>*)</code> branch in the loop exists for exactly those: anything that is not 200, 401 or 404 is "unknown", which must fail the check rather than pass it.</p>

<h3>Read the checklist from the commit you are deploying</h3>
${slide('dv-07', 21, 'Đọc danh sách kiểm từ ĐÚNG commit đang deploy')}
<p>A smoke test has configuration too: the list of routes. Where the script reads that list from decides whether it tests the right thing. Measured with a list kept in the repository, a deploy of commit <code>c1</code>, and a working tree that has already moved on to <code>c2</code>, which added a route that <code>c1</code>&#39;s image does not have:</p>
<pre><code class="language-bash">git init -q smk &amp;&amp; cd smk
printf '/health\\n/api/v1/don\\n' &gt; smoke-routes.txt; git add .; git commit -qm "c1"
SHA=$(git rev-parse --short HEAD)               # commit DANG deploy (anh dung tu day)
printf '/api/v1/llm-keys\\n' &gt;&gt; smoke-routes.txt; git commit -qam "c2: route moi"   # phien khac, chua deploy
kiem() { while read -r R; do printf '  %-18s %s\\n' "$R" "$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 "http://127.0.0.1:3340$R")"; done; }</code></pre>
<div class="out">$ kiem &lt; smoke-routes.txt              # doc CAY LAM VIEC
  /health            200
  /api/v1/don        401
  /api/v1/llm-keys   404
$ git show "06d33ee:smoke-routes.txt" | kiem   # doc DUNG commit dang deploy
  /health            200
  /api/v1/don        401</div>
<p>The image is correct for <code>c1</code>. Read from the working tree, the checker compares it with <code>c2</code>&#39;s list and reports a 404 — a false alarm about a healthy deploy. <code>git show "$SHA:smoke-routes.txt"</code> reads the list <em>as it was in the commit being deployed</em>, and the same image passes.</p>
<div class="pitfall co-tieu-de"><strong>Real incident — the list "from the future".</strong> In this project&#39;s deploy script the smoke routes were extracted from another script in the working tree. One session added a new route to the list at the same moment it wrote the route, exactly as the project&#39;s own instructions say. A deploy of an older commit then ran and read that list: <code>HONG llm-keys/info -&gt; 404</code>, <code>Có route 404 — ảnh có thể cũ/thiếu</code>. The deploy was healthy. Because the smoke test runs after the swap and before the push, the false failure did not break production — it skipped the push to GitHub and the "deployed" marker, two silent consequences nobody sees until they need them.</div>

<h3>On macOS: timestamps and tools</h3>
<div class="out">$ date +%H:%M:%S.%3N          # macOS 27, date của BSD
12:49:48.3N</div>
<ul>
<li><strong>BSD <code>date</code> has no <code>%N</code></strong>, so the <code>ghi()</code> function above prints a literal <code>3N</code> when the script runs on a Mac. Either install GNU coreutils (<code>brew install coreutils</code>, then <code>gdate</code>) or put the timestamps on the VPS side, where the steps actually run.</li>
<li><strong>curl behaves the same</strong> on macOS, Linux and Windows 10+ (which ships <code>curl.exe</code>); <code>-w '%{http_code}'</code> is portable. In PowerShell, quote with double quotes or use <code>curl.exe</code> explicitly — <code>curl</code> there may be an alias for <code>Invoke-WebRequest</code>.</li>
<li><strong>The check-the-checker rule applies across machines:</strong> a readiness loop that works on your Mac can call a tool the container does not have. Run <code>command -v</code> for every tool <em>where the check runs</em>.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> after tonight&#39;s deploy the team chat says "the new comments route returns 404". Is the image stale, or is the checker wrong? You will build a smoke test that can tell the difference. On the lab VPS:</p>
<ol>
<li>Copy <code>app.mjs</code> from this lesson to the VPS and start it: <code>vps '(setsid nohup node app.mjs &gt;/dev/null 2&gt;&amp;1 &lt;/dev/null &amp;)'</code>.</li>
<li>Run the six <code>curl</code> lines from this lesson and write down each code and exit code — including the dead port <code>3399</code> and <code>/cham</code>.</li>
<li>Write the smoke loop from slide 19 with <code>case</code> branches for 200/401, 404 and everything else; run it, then add <code>/api/v1/gifs</code> to the list and run it again.</li>
<li>Reproduce the <code>smk</code> repository from this lesson and compare <code>kiem &lt; smoke-routes.txt</code> with <code>git show "$SHA:smoke-routes.txt" | kiem</code>.</li>
</ol>
<p><strong>Done when:</strong> your table has 200/0, 401/0, 404/0, 000/7, 000/28 and 401/22 (with <code>-f</code>); the loop exits 0 for the three listed routes and non-zero once <code>/api/v1/gifs</code> is listed; and the working-tree read shows a 404 that the <code>git show</code> read does not.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Smoke test</span><span class="v">A quick check after deploy that the running build is the one you shipped, and complete.</span></div>
  <div class="kv"><span class="k">Mounted route</span><span class="v">A route the router actually registered; answers 200 or 401, never 404.</span></div>
  <div class="kv"><span class="k"><code>000</code> (curl)</span><span class="v">No HTTP answer at all; the exit code says why — 7 refused, 28 timed out.</span></div>
  <div class="kv"><span class="k">Readiness check</span><span class="v">Waiting until the new process answers <code>/health</code>, before any smoke test.</span></div>
  <div class="kv"><span class="k">Checker that cannot run</span><span class="v">A third outcome (missing tool) that needs its own exit code.</span></div>
  <div class="kv"><span class="k">Front door</span><span class="v">The public URL through the proxy — where the verdict must come from.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A smoke test answers "is the running build mine, and complete?" — not "is it correct?".</li>
<li>401 passes (the route exists), 404 fails (stale or partial build), <code>000</code> fails with a reason in the exit code.</li>
<li><code>curl -f</code> turns a passing 401 into exit 22; use <code>-w '%{http_code}'</code> with <code>--max-time</code>.</li>
<li>A check that cannot run must say so with its own code — a missing <code>xh</code> cost 3,022 ms and a false "down".</li>
<li>Read the checker&#39;s configuration from the commit being deployed (<code>git show "$SHA:file"</code>), not the working tree.</li>
<li>Timestamps and tools differ on the Mac (<code>date +%N</code>); run checks where the thing is.</li>
</ul>


<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl(1) — --write-out and --fail</span><span class="lc-sub">curl.se/docs/manpage.html — <code>-w '%{http_code}'</code> is the whole smoke test; <code>-sf</code> is the form that makes an HTTP error an exit code rather than a body.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bash Reference Manual — Bourne Shell Variables (PS4)</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#Bourne-Shell-Variables — <code>PS4</code> and <code>BASH_SOURCE</code>/<code>LINENO</code>, which turn <code>set -x</code> from noise into a trace.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bash Reference Manual — Process Substitution</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#Process-Substitution — the documentation notes the shell does not wait for the substituted process, which is the race measured in the pitfall above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — reading status codes, and what 404 means at the proxy</span><span class="lc-sub">/courses/nginx/learn${REF} — why a missing route and a missing upstream produce different codes, which is what makes the 401-is-a-pass trick reliable.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Chứng minh nó chạy, và KIỂM LẠI CHÍNH BỘ KIỂM</h2>
<p class="lead">Chương 6 đã xác lập rằng một cú lùi phải được kiểm qua cửa trước. Một lần deploy cũng đúng vấn đề đó: script biết nó đã <em>LÀM GÌ</em>, còn một bộ kiểm khói là thứ DUY NHẤT biết chuyện gì đã <em>XẢY RA</em>.</p>

<h3>Kiểm khói để làm gì</h3>
${slide('dv-07', 18, '401 ĐẠT · 404 bản cũ · 000 không ai nghe')}
<p>Không phải để kiểm ĐÚNG SAI — bạn có bộ test cho việc đó rồi, và chúng chạy trước khi tạo tác được dựng. Kiểm khói trả lời một câu hẹp: <strong>cái đang chạy có đúng là cái tôi vừa deploy không, và nó có ĐỦ không?</strong> Cú hỏng nó sinh ra để bắt là bản dựng NỬA VỜI hoặc CŨ, khi tiến trình khởi động được, chốt kiểm sức khoẻ qua, và một cái router chưa bao giờ được gắn.</p>

<p>Đo thật, trên một bản đủ bốn route và một bản thiếu một route:</p>

<pre><code class="language-bash">for R in /health /api/v1/don /api/v1/gifs /api/v1/tin; do
  MA=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 "http://127.0.0.1:\$CONG\$R")
  case "\$MA" in
    404) echo "  ✗ \$R → 404  (KHONG gan — ban cu/dung nua voi)"; LOI=1 ;;
    200|401) echo "  ✓ \$R → \$MA" ;;
    *) echo "  ? \$R → \$MA (khong ro)"; LOI=1 ;;
  esac
done
exit \$LOI</code></pre>

<div class="out">=== ban DU route ===
  ✓ /health → 200
  ✓ /api/v1/don → 401
  ✓ /api/v1/gifs → 401
  ✓ /api/v1/tin → 401
  ma thoat: 0
=== ban THIEU mot route (mo phong dung cu) ===
  ✓ /health → 200
  ✓ /api/v1/don → 401
  ✗ /api/v1/gifs → 404  (KHONG gan — ban cu/dung nua voi)
  ✓ /api/v1/tin → 401
  ma thoat: 1</div>

<div class="callout ok">
<p><strong>Ý tưởng cốt lõi là 401 được tính là ĐẠT.</strong> Một request không xác thực vào một route được bảo vệ trả về 401 <em>NẾU route đó tồn tại</em>, và 404 nếu không. Nên bạn kiểm khói được MỌI endpoint cần xác thực trong ứng dụng mà không cần một cái thông tin đăng nhập nào — bạn không kiểm cái handler, bạn kiểm rằng router ĐÃ GẮN nó. Chính script deploy của kho này làm đúng thế, và ghi chú của nó nói thẳng cách chẩn đoán: <strong>401 = đã gắn (cần auth), 200 = đã gắn (công khai), 404 = CHƯA gắn / bản dựng cũ.</strong></p>
</div>

<div class="pitfall">
<p><strong>Bẫy — chỉ liệt kê những route trả lời được một lệnh GET trần không xác thực.</strong> Thêm một route chỉ nhận POST hoặc một route đòi tham số đường dẫn, thế là mọi lần deploy đều hỏng vì một route vốn dĩ chẳng bao giờ trả về thứ gì khác. Kho này học bài đó theo đúng cách ai cũng học; ghi chú của nó giờ viết: <em>ĐỪNG thêm route chỉ-POST hay đòi-tham-số, không thì mọi lần deploy sẽ hỏng oan.</em> Một bộ kiểm khói hay kêu oan sẽ bị chú thích đi trong vòng một tuần, và khi đó nó chẳng bảo vệ cái gì nữa.</p>
</div>

<h3>Giờ tới phần ai cũng bỏ qua</h3>
${slide('dv-07', 20, 'Bộ kiểm KHÔNG CHẠY ĐƯỢC: kết cục thứ ba')}
<p>Đây là đúng phép kiểm đó viết bằng một công cụ KHÔNG được cài trên máy này. Ứng dụng chạy hoàn hảo ở cổng 3330 trong suốt thời gian đó:</p>

<pre><code class="language-bash">for i in \$(seq 1 6); do
  if xh -q http://127.0.0.1:3330/health 2>/dev/null; then echo "  san sang"; exit 0; fi
  sleep 0.5
done
echo "  KHONG len duoc sau 6 lan thu"; exit 0</code></pre>

<div class="out">  wget     CO
  curl     CO
  httpie   KHONG
  xh       KHONG

  KHONG len duoc sau 6 lan thu
  ma thoat: 0 | mat 3022 ms
  → ung dung dang CHAY TOT o 3330. Bo kiem quay 6 vong, ton 3 giay, roi bao
    'KHONG len duoc' — va thoat 0.</div>

<p>Ba giây đốt đi ở MỖI lần deploy, một báo cáo SAI rằng ứng dụng đang chết, và mã thoát 0 nên chẳng có gì hành động theo nó. Hai cú hỏng chồng lên nhau: phép kiểm không chạy được, và cái phép kiểm không chạy được đó thì không nói gì.</p>

<p>Chuyện này không phải giả định. Ghi chú của kho này lưu lại đúng cái hình dạng ấy: một phép kiểm sẵn-sàng của frontend gọi <code>wget</code> <em>BÊN TRONG container frontend</em>, mà cái image đó cố ý không kèm cả <code>wget</code> lẫn <code>curl</code> — healthcheck của compose dùng module http của node thay thế. Vòng lặp quay đủ sáu lượt ở MỌI lần deploy, tốn khoảng 25 giây, và kiểm chứng được con số không.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">phép kiểm chạy và ĐẠT</span><span class="lz-t">thoát 0</span><span class="lz-d">kết cục duy nhất phần lớn người ta từng thấy</span></div>
<div class="lz-step"><span class="lz-k">phép kiểm chạy và HỎNG</span><span class="lz-t">thoát ≠ 0</span><span class="lz-d">thứ bạn viết nó ra để làm</span></div>
<div class="lz-step"><span class="lz-k">phép kiểm KHÔNG CHẠY ĐƯỢC</span><span class="lz-t">phải có mã riêng</span><span class="lz-d">không phân biệt được với "hỏng", trừ khi bạn làm cho nó phân biệt được</span></div>
</div>

<h3>Một dòng ở đầu, đo thật</h3>
<pre><code class="language-bash">command -v xh >/dev/null || { echo "  bo kiem KHONG chay duoc: thieu xh" >&amp;2; exit 5; }</code></pre>

<div class="out">  bo kiem KHONG chay duoc: thieu xh
  ma thoat: 5 | mat 4 ms</div>

<p>Bốn mili giây thay vì 3.022, một dòng gọi tên đúng vấn đề, và một mã thoát riêng. Và phép kiểm đã sửa, khi trỏ vào một cổng CHẾT thật, vẫn hành xử đúng:</p>

<div class="out">--- cung script, tro vao cong CHET ---
  frontend KHONG len duoc sau 6 lan thu
  ma thoat: 6 | mat 3077 ms</div>

<p>Ba giây là cái giá ĐÚNG ở <em>ĐÓ</em> — nó thật sự đang thử lại một kết nối thật tới một cổng thật. Còn 3.022 ms ở bản hỏng là đúng ba giây ấy dùng để học được con số không.</p>

<h3>Một cuốn nhật ký đọc lại được</h3>
${slide('dv-07', 22, 'Nhật ký có giờ, set -x có số dòng')}
<p>Nửa còn lại của việc chứng minh là BẢN GHI. Đóng dấu thời gian mọi dòng biến "lần deploy chậm" thành "bước 2 mất 900 ms":</p>

<pre><code class="language-bash">ghi() { printf '%s %s\\n' "\$(date +%H:%M:%S.%3N)" "\$*" | tee -a "\$LOG"; }</code></pre>

<div class="out">22:09:14.463 ── 1/4 dung tao tac ──
22:09:14.867 ── 2/4 chuyen len may ──
22:09:15.767 ── 3/4 chay migration ──
22:09:15.967 ── 4/4 trao va kiem ──
22:09:16.271 XONG</div>

<div class="pitfall">
<p><strong>Bẫy — <code>exec &gt; &gt;(…)</code> làm ĐẢO thứ tự dòng cuối của bạn.</strong> Cách thanh lịch để đóng dấu thời gian mọi thứ là <code>exec &gt; &gt;(while read -r d; do printf '%s %s\\n' "\$(date …)" "\$d"; done) 2&gt;&amp;1</code>. Nó chạy được, và nó có một cuộc đua: phép thay thế tiến trình là một tiến trình RIÊNG vẫn tiếp tục rút dữ liệu sau khi script đã thoát. Đo ba lần trên ba, dòng <code>XONG</code> cuối cùng xuất hiện <em>SAU</em> khi cái shell gọi nó đã đi tiếp sang lệnh kế. Nếu có thứ gì grep dòng cuối của nhật ký để quyết định lần deploy đã xong chưa, thì đó là một cuộc đua thật. Hàm <code>ghi()</code> theo-từng-dòng ở trên không có khe hở đó — tôi đo ba lần và thứ tự luôn đúng.</p>
</div>

<p>Và khi nhật ký chưa đủ, <code>set -x</code> kèm một <code>PS4</code> hữu dụng cho xem MỌI lệnh thật sự đã chạy, kèm số dòng:</p>

<pre><code>PS4='+ \${BASH_SOURCE##*/}:\${LINENO}: '
set -x</code></pre>

<div class="out">  + x.sh:5: BAN=v7
  + x.sh:6: DICH=/srv/vps/kb/idem/dich
  + x.sh:7: mkdir -p /srv/vps/kb/idem/dich/ban-v7
  + x.sh:8: ln -sfn /srv/vps/kb/idem/dich/ban-v7 /srv/vps/kb/idem/dich/ht.moi</div>

<p>Để ý là các biến ĐÃ ĐƯỢC KHAI TRIỂN — bạn thấy cái đường dẫn script thật sự dùng, chứ không phải cái bạn TƯỞNG nó sẽ ghép ra. Đó chính xác là thông tin bạn cần khi thiếu <code>-u</code> và có thứ gì đó bị cắm gốc ở <code>/</code>.</p>

<div class="callout warn">
<p><strong>ĐỪNG BAO GIỜ để <code>set -x</code> bật trong một script chạm tới bí mật.</strong> Nó in ra GIÁ TRỊ đã khai triển, nên một dòng như <code>curl -H "Authorization: Bearer \$TOKEN"</code> sẽ ghi cái token vào nhật ký deploy của bạn — nơi nó nằm lại trong output của CI, trong hệ gom log, và trong mọi bản sao lưu của những chỗ đó. Hãy bật nó quanh đúng đoạn bạn đang gỡ rồi tắt lại bằng <code>set +x</code>, và đọc lại Chương 4 về chỗ nào bí mật được phép xuất hiện.</p>
</div>

<h3>curl, từng cờ một, cho một bộ kiểm khói</h3>
${slide('dv-07', 19, 'Vòng kiểm khói, từng cờ của curl')}
<p>Bộ kiểm khói (smoke test) là một lệnh <code>curl</code> cho mỗi route, và mỗi cờ trên đó đều đang làm một việc. Đo trên ứng dụng thí nghiệm (<code>/health</code> 200, <code>/api/v1/don</code> 401, mọi thứ khác 404, <code>/cham</code> trả lời sau 5 giây) và một cổng không ai nghe:</p>
<pre><code class="language-javascript">// app.mjs — ứng dụng thử của bài: bốn kiểu trả lời
import http from 'node:http';
const R = { '/health': 200, '/api/v1/don': 401, '/api/v1/tin': 401 };
http.createServer((q, s) =&gt; {
  if (q.url === '/ban') { s.end(process.env.BAN || 'v1'); return; }
  if (q.url === '/cham') { setTimeout(() =&gt; s.end('ok'), 5000); return; }
  const c = R[q.url] || 404; s.statusCode = c; s.end(String(c));
}).listen(+process.env.CONG || 3340, '127.0.0.1');</code></pre>
<div class="out"># mỗi dòng: printf "%-14s" $U; curl -s -o /dev/null -w "%{http_code}" --max-time 2 URL; echo "  exit=$?"
/health       200  exit=0
/api/v1/don   401  exit=0
/api/v1/gifs  404  exit=0
cong chet     000  exit=7
/cham (5s)    000  exit=28
-f /api/v1/don401  exit=22</div>
<table>
<thead><tr><th>Cờ</th><th>Làm gì</th><th>Vì sao bộ kiểm khói cần</th></tr></thead>
<tbody>
<tr><td><code>-s</code></td><td>im lặng: không thanh tiến độ, không chữ báo lỗi</td><td>vòng lặp tự in dòng của nó; thêm <code>-S</code> nếu muốn lấy lại chữ báo lỗi của curl</td></tr>
<tr><td><code>-o /dev/null</code></td><td>vứt phần thân</td><td>bạn đang kiểm route ĐÃ GẮN, không kiểm nội dung</td></tr>
<tr><td><code>-w '%{http_code}'</code></td><td>chỉ in mã trạng thái</td><td>biến câu trả lời thành một chữ so sánh được — <code>000</code> khi không có câu trả lời HTTP nào</td></tr>
<tr><td><code>--max-time 2</code></td><td>trần cho cả lần truyền</td><td>một route treo (<code>/cham</code>) cho <code>000</code> và mã 28 sau 2 s thay vì treo luôn cả lần deploy</td></tr>
<tr><td><code>--connect-timeout N</code></td><td>trần chỉ cho pha kết nối</td><td>hữu ích khi đi qua mạng; trên <code>127.0.0.1</code> cổng chết bị từ chối ngay (mã 7)</td></tr>
<tr><td><code>-f</code></td><td>mã HTTP ≥ 400 thành mã thoát 22</td><td><strong>ĐỪNG dùng ở đây</strong>: nó biến cái 401 bạn muốn cho qua thành hỏng</td></tr>
<tr><td><code>--retry N --retry-connrefused</code></td><td>thử lại lỗi tạm thời, kể cả "bị từ chối"</td><td>cho vòng chờ sẵn sàng; kiểm khói chạy <em>SAU</em> khi đã sẵn sàng và không nên thử lại</td></tr>
</tbody></table>
<p>Hai cách đọc cần giữ. <code>000</code> không phải mã trạng thái — đó là curl nói "không có câu trả lời HTTP", và mã thoát cho biết vì sao: 7 là bị từ chối, 28 là quá giờ. Và nhánh <code>*)</code> trong vòng lặp tồn tại đúng cho mấy thứ đó: cái gì không phải 200, 401 hay 404 thì là "không rõ", và phải làm HỎNG phép kiểm chứ không được cho qua.</p>

<h3>Đọc danh sách kiểm từ đúng commit đang deploy</h3>
${slide('dv-07', 21, 'Đọc danh sách kiểm từ ĐÚNG commit đang deploy')}
<p>Bộ kiểm khói cũng có cấu hình: danh sách route. Script đọc danh sách đó TỪ ĐÂU quyết định nó có kiểm đúng thứ không. Đo với một danh sách nằm trong kho, một lần deploy commit <code>c1</code>, và một cây làm việc đã đi tiếp tới <code>c2</code> — commit thêm một route mà ảnh của <code>c1</code> không có:</p>
<pre><code class="language-bash">git init -q smk &amp;&amp; cd smk
printf '/health\\n/api/v1/don\\n' &gt; smoke-routes.txt; git add .; git commit -qm "c1"
SHA=$(git rev-parse --short HEAD)               # commit DANG deploy (anh dung tu day)
printf '/api/v1/llm-keys\\n' &gt;&gt; smoke-routes.txt; git commit -qam "c2: route moi"   # phien khac, chua deploy
kiem() { while read -r R; do printf '  %-18s %s\\n' "$R" "$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 "http://127.0.0.1:3340$R")"; done; }</code></pre>
<div class="out">$ kiem &lt; smoke-routes.txt              # doc CAY LAM VIEC
  /health            200
  /api/v1/don        401
  /api/v1/llm-keys   404
$ git show "06d33ee:smoke-routes.txt" | kiem   # doc DUNG commit dang deploy
  /health            200
  /api/v1/don        401</div>
<p>Ảnh đúng cho <code>c1</code>. Đọc từ cây làm việc, bộ kiểm so nó với danh sách của <code>c2</code> và báo 404 — một báo động GIẢ về một lần deploy lành. <code>git show "$SHA:smoke-routes.txt"</code> đọc danh sách <em>đúng như nó nằm trong commit đang deploy</em>, và cùng cái ảnh đó qua.</p>
<div class="pitfall co-tieu-de"><strong>Sự cố thật — danh sách "từ tương lai".</strong> Trong script deploy của dự án này, danh sách route smoke được bóc ra từ một script khác trong cây làm việc. Một phiên thêm route mới vào danh sách đúng lúc nó viết route đó, y như hướng dẫn của dự án dặn. Rồi một lượt deploy commit CŨ HƠN chạy và đọc phải danh sách ấy: <code>HONG llm-keys/info -&gt; 404</code>, <code>Có route 404 — ảnh có thể cũ/thiếu</code>. Lần deploy đó lành. Vì kiểm khói chạy SAU bước tráo và TRƯỚC bước push, cú hỏng giả không làm hỏng production — nó bỏ qua bước push lên GitHub và bước ghi mốc "đã lên production", hai hậu quả im lặng không ai thấy cho tới lúc cần tới.</div>

<h3>Trên macOS: mốc giờ và công cụ</h3>
<div class="out">$ date +%H:%M:%S.%3N          # macOS 27, date của BSD
12:49:48.3N</div>
<ul>
<li><strong><code>date</code> của BSD không có <code>%N</code></strong>, nên hàm <code>ghi()</code> ở trên in ra nguyên chữ <code>3N</code> khi script chạy trên Mac. Hoặc cài GNU coreutils (<code>brew install coreutils</code>, rồi dùng <code>gdate</code>), hoặc đặt mốc giờ ở phía VPS, nơi các bước thật sự chạy.</li>
<li><strong>curl cư xử như nhau</strong> trên macOS, Linux và Windows 10 trở lên (có sẵn <code>curl.exe</code>); <code>-w '%{http_code}'</code> dùng được mọi nơi. Trong PowerShell, dùng nháy kép hoặc gọi thẳng <code>curl.exe</code> — <code>curl</code> ở đó có thể là bí danh của <code>Invoke-WebRequest</code>.</li>
<li><strong>Luật "kiểm chính bộ kiểm" áp dụng xuyên máy:</strong> một vòng chờ chạy tốt trên Mac có thể gọi một công cụ mà container không có. Chạy <code>command -v</code> cho mọi công cụ <em>ở ĐÚNG nơi phép kiểm chạy</em>.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> sau lần deploy tối nay, nhóm chat báo "route bình luận mới trả 404". Ảnh cũ, hay bộ kiểm sai? Bạn sẽ dựng một bộ kiểm khói phân biệt được hai chuyện đó. Trên VPS thí nghiệm:</p>
<ol>
<li>Chép <code>app.mjs</code> của bài lên VPS và chạy: <code>vps '(setsid nohup node app.mjs &gt;/dev/null 2&gt;&amp;1 &lt;/dev/null &amp;)'</code>.</li>
<li>Chạy sáu dòng <code>curl</code> của bài và ghi lại từng mã HTTP và mã thoát — kể cả cổng chết <code>3399</code> và <code>/cham</code>.</li>
<li>Viết vòng kiểm khói của slide 19 với các nhánh <code>case</code> cho 200/401, 404 và mọi thứ khác; chạy, rồi thêm <code>/api/v1/gifs</code> vào danh sách và chạy lại.</li>
<li>Dựng lại kho <code>smk</code> của bài và so <code>kiem &lt; smoke-routes.txt</code> với <code>git show "$SHA:smoke-routes.txt" | kiem</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn có 200/0, 401/0, 404/0, 000/7, 000/28 và 401/22 (với <code>-f</code>); vòng lặp thoát 0 với ba route trong danh sách và khác 0 khi có <code>/api/v1/gifs</code>; và lần đọc từ cây làm việc có một cái 404 mà lần đọc bằng <code>git show</code> không có.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Smoke test (kiểm khói)</span><span class="v">Phép kiểm nhanh sau deploy: bản đang chạy có đúng là bản bạn gửi đi, và có đủ không.</span></div>
  <div class="kv"><span class="k">Mounted route (route đã gắn)</span><span class="v">Route mà router thật sự đăng ký; trả 200 hoặc 401, không bao giờ 404.</span></div>
  <div class="kv"><span class="k"><code>000</code> (của curl)</span><span class="v">Không có câu trả lời HTTP nào; mã thoát nói vì sao — 7 bị từ chối, 28 quá giờ.</span></div>
  <div class="kv"><span class="k">Readiness check (kiểm sẵn sàng)</span><span class="v">Chờ tới khi tiến trình mới trả lời <code>/health</code>, trước mọi phép kiểm khói.</span></div>
  <div class="kv"><span class="k">Checker that cannot run (bộ kiểm không chạy được)</span><span class="v">Kết cục thứ ba (thiếu công cụ) cần mã thoát riêng.</span></div>
  <div class="kv"><span class="k">Front door (cửa trước)</span><span class="v">URL công khai đi qua proxy — nơi phán quyết phải đến từ đó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Kiểm khói trả lời "bản đang chạy có phải của tôi, và có đủ không?" — không phải "nó có đúng không?".</li>
<li>401 là ĐẠT (route có), 404 là HỎNG (bản cũ hoặc dựng nửa vời), <code>000</code> là HỎNG kèm lý do trong mã thoát.</li>
<li><code>curl -f</code> biến cái 401 đáng qua thành mã 22; dùng <code>-w '%{http_code}'</code> kèm <code>--max-time</code>.</li>
<li>Phép kiểm không chạy được phải nói ra bằng mã riêng — thiếu <code>xh</code> tốn 3.022 ms và một câu "chết" giả.</li>
<li>Đọc cấu hình của bộ kiểm từ commit đang deploy (<code>git show "$SHA:tệp"</code>), không từ cây làm việc.</li>
<li>Mốc giờ và công cụ khác nhau trên Mac (<code>date +%N</code>); chạy phép kiểm ở nơi có thứ cần kiểm.</li>
</ul>


<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl(1) — --write-out và --fail</span><span class="lc-sub">curl.se/docs/manpage.html — <code>-w '%{http_code}'</code> chính là toàn bộ bộ kiểm khói; <code>-sf</code> là dạng biến một lỗi HTTP thành mã thoát thay vì thành phần thân.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bash Reference Manual — Bourne Shell Variables (PS4)</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#Bourne-Shell-Variables — <code>PS4</code> cùng <code>BASH_SOURCE</code>/<code>LINENO</code>, thứ biến <code>set -x</code> từ tiếng ồn thành một vết chạy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bash Reference Manual — Process Substitution</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#Process-Substitution — tài liệu ghi rõ shell KHÔNG chờ tiến trình được thay thế, mà đó chính là cuộc đua đo trong cái bẫy ở trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — đọc mã trạng thái, và 404 nghĩa là gì ở chỗ proxy</span><span class="lc-sub">/courses/nginx/learn${REF} — vì sao một route thiếu và một upstream thiếu cho ra mã khác nhau, và đó là thứ làm cho mẹo 401-là-đạt đáng tin.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.5 ─────────────────────────── */
    {
      title: '7.5 — The whole script, and the two bugs testing found in it|||7.5 — Cả cái script, và HAI con bọ mà việc chạy thử tìm ra trong nó',
      slug: 'deploy-7-5-ca-script',
      type: 'VIDEO',
      description: 'Script đầy đủ, chạy thật: deploy thành công trong 196 ms, rồi năm nhánh HỎNG chạy từng cái một. Hai trong số đó phơi ra bọ trong chính cái trap dọn dẹp của tôi — một cái để website nằm ở bản HỎNG, cái kia để nó không phục vụ gì cả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>The whole script, and the two bugs testing found in it</h2>
<p class="lead">Everything from 7.1 to 7.4 assembled into one file, run against a real application on a real port. Then every failure branch exercised — which is how I found out my own cleanup handler was broken in two different ways.</p>

<h3>The script</h3>
${slide('dv-07', 23, 'Năm bước, và mã thoát nói bước nào hỏng')}
${slide('dv-07', 24, 'trap don_dep: lùi cả tiến trình, không chỉ con trỏ')}
<pre><code class="language-bash">#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit 2>/dev/null || true

GOC=/srv/vps/kb/tk; CONG=3340; CUA_TRUOC=http://127.0.0.1:3340
DONG_Y=0; [ "\${1:-}" = "--dong-y" ] &amp;&amp; { DONG_Y=1; shift; }
BAN="\${1:?dung: trien-khai.sh [--dong-y] &lt;ten-ban&gt;}"

NK="\$GOC/nhat-ky/\$(date +%Y%m%d-%H%M%S)-\$BAN.log"
ghi() { printf '%s %s\\n' "\$(date +%H:%M:%S.%3N)" "\$*" | tee -a "\$NK"; }
loi() { printf '%s ✗ %s\\n' "\$(date +%H:%M:%S.%3N)" "\$*" | tee -a "\$NK" >&amp;2; }

TAM=""; TRUOC=""
don_dep() {
  local ma=\$?
  [ -n "\$TAM" ] &amp;&amp; rm -rf "\$TAM"
  if [ \$ma -ne 0 ] &amp;&amp; [ -n "\$TRUOC" ]; then
    loi "hong (ma \$ma) — dua symlink ve '\$TRUOC' VA khoi dong lai"
    ln -sfn "\$GOC/ban/\$TRUOC" "\$GOC/ht.moi" &amp;&amp; mv -Tf "\$GOC/ht.moi" "\$GOC/hien-tai"
    <span class="tok-comment"># symlink KHONG phai tien trinh — phai giet ban hong roi dung lai ban cu</span>
    for p in \$(ss -ltnp 2>/dev/null|grep ":\$CONG "|grep -o 'pid=[0-9]*'|cut -d= -f2); do kill -TERM "\$p" 2>/dev/null||true; done
    CONG=\$CONG setsid nohup node "\$GOC/hien-tai/app.mjs" >>"\$NK" 2>&amp;1 &lt;/dev/null 9>&amp;- &amp;
    for i in \$(seq 1 100); do
      [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 "\$CUA_TRUOC/health" 2>/dev/null)" = "200" ] &amp;&amp; { loi "da khoi phuc '\$TRUOC' sau \$((i*20))ms"; break; }
      sleep 0.02
    done
  fi
  return \$ma
}
trap don_dep EXIT

<span class="tok-comment"># ── 0. TIEN KIEM: kiem chinh bo kiem truoc da (7.3, 7.4) ──</span>
for c in curl ss node ln mv; do
  command -v "\$c" >/dev/null || { loi "thieu cong cu '\$c' — khong deploy duoc"; exit 5; }
done
[ -d "\$GOC/ban/\$BAN" ] || { loi "khong co ban '\$BAN'. Co: \$(ls "\$GOC/ban"|tr '\\n' ' ')"; exit 2; }
if [ "\$DONG_Y" != 1 ]; then
  [ -t 0 ] || { loi "khong co terminal de hoi — dung --dong-y neu that su muon"; exit 4; }
  read -rp "Deploy '\$BAN'? [y/N] " tl || tl=""
  [ "\$tl" = "y" ] || { ghi "huy theo yeu cau nguoi dung"; exit 3; }
fi

exec 9>/var/lock/trien-khai.lock
flock -w 30 9 || { loi "co lan deploy khac dang chay"; exit 1; }

TRUOC=\$(basename "\$(readlink -f "\$GOC/hien-tai" 2>/dev/null || echo none)")
ghi "── deploy '\$BAN' (dang chay: \$TRUOC) ──"

<span class="tok-comment"># ── 1-2. chuan bi o ben le; hong o day thi nguoi dung khong thay gi (7.2) ──</span>
TAM=\$(mktemp -d "\$GOC/tam.XXXXXX")
ghi "1/5 dung tao tac trong \$TAM"
cp -r "\$GOC/ban/\$BAN/." "\$TAM/"
[ -f "\$TAM/app.mjs" ] || { loi "tao tac thieu app.mjs"; exit 6; }
ghi "2/5 dat ban vao \$GOC/ban/\$BAN"; mkdir -p "\$GOC/ban/\$BAN"

<span class="tok-comment"># ── 3. TRAO — buoc DUY NHAT nguoi dung thay, va no o CUOI (6.1) ──</span>
ghi "3/5 trao symlink"
ln -sfn "\$GOC/ban/\$BAN" "\$GOC/ht.moi" &amp;&amp; mv -Tf "\$GOC/ht.moi" "\$GOC/hien-tai"
for p in \$(ss -ltnp 2>/dev/null|grep ":\$CONG "|grep -o 'pid=[0-9]*'|cut -d= -f2); do kill -TERM "\$p" 2>/dev/null||true; done
CONG=\$CONG setsid nohup node "\$GOC/hien-tai/app.mjs" >>"\$NK" 2>&amp;1 &lt;/dev/null 9>&amp;- &amp;

<span class="tok-comment"># ── 4. cho no THAT SU tra loi, khong phai cho tien trinh ton tai ──</span>
san=0; for i in \$(seq 1 150); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 "\$CUA_TRUOC/health" 2>/dev/null)" = "200" ] &amp;&amp; { san=1; ghi "4/5 san sang sau \$((i*20))ms"; break; }
  sleep 0.02
done
[ "\$san" = 1 ] || { loi "ban '\$BAN' KHONG len duoc"; exit 7; }

<span class="tok-comment"># ── 5. KIEM KHOI + KIEM PHIEN BAN qua cua truoc (7.4, 6.5) ──</span>
ghi "5/5 kiem khoi"; KL=0
for R in /health /api/v1/don /api/v1/tin; do
  MA=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 "\$CUA_TRUOC\$R")
  case "\$MA" in 200|401) ghi "    ✓ \$R → \$MA";; *) loi "    \$R → \$MA"; KL=1;; esac
done
[ "\$KL" = 0 ] || { loi "kiem khoi HONG — ban dung nua voi"; exit 8; }
BAN_THAY=\$(curl -s --max-time 2 "\$CUA_TRUOC/ban" | tr -d '\\n')
[ "\$BAN_THAY" = "\$BAN" ] || { loi "cua truoc tra '\$BAN_THAY', khong phai '\$BAN'"; exit 9; }
ghi "✓ XONG — cua truoc xac nhan '\$BAN_THAY'. Nhat ky: \$NK"
TRUOC=""     <span class="tok-comment"># thanh cong: khong lui nua</span></code></pre>

<h3>The happy path</h3>
<div class="out">22:09:55.287 ── deploy 'v1' (dang chay: hien-tai) ──
22:09:55.291 1/5 dung tao tac trong /srv/vps/kb/tk/tam.DcEK6T
22:09:55.295 2/5 dat ban vao /srv/vps/kb/tk/ban/v1
22:09:55.298 3/5 trao symlink
22:09:55.442 4/5 san sang sau 100ms
22:09:55.444 5/5 kiem khoi
22:09:55.455     ✓ /health → 200
22:09:55.464     ✓ /api/v1/don → 401
22:09:55.473     ✓ /api/v1/tin → 401
22:09:55.483 ✓ XONG — cua truoc xac nhan 'v1'
  ma thoat: 0</div>

<p>196 milliseconds end to end, 100 of them waiting for Node to bind a port. Now the interesting part.</p>

<h3>Running every failure branch</h3>
${slide('dv-07', 25, 'Chạy từng nhánh hỏng: A–E')}
<div class="out">=== A. ban khong ton tai ===
✗ khong co ban 'v9'. Co: v1 v2         → ma thoat: 2

=== B. khong co terminal, khong --dong-y ===
✗ khong co terminal de hoi — dung --dong-y neu that su muon   → ma thoat: 4

=== C. tao tac hong (thieu app.mjs) ===
✗ tao tac thieu app.mjs
✗ hong (ma 6) — dua symlink ve 'v2'    → ma thoat: 6
  → dang phuc vu: v2</div>

<p>Case C is what the design was for: a malformed artifact, caught during preparation, the symlink put back, and the site served v2 throughout. Then two more:</p>

<div class="out">=== D. ban THIEU mot route (dung nua voi) ===
✗     /api/v1/tin → 404
✗ kiem khoi HONG — ban dung nua voi
✗ hong (ma 8) — dua symlink ve 'v2'    → ma thoat: 8
  → dang phuc vu: v4          ← ???

=== E. ban KHONG len duoc (app vo ngay) ===
✗ ban 'v5' KHONG len duoc
✗ hong (ma 7) — dua symlink ve 'v2'    → ma thoat: 7
  → dang phuc vu:             ← ??? (rong)</div>

<div class="callout warn">
<p><strong>Both of those are bugs in my script, and I only found them because I ran the failure branches.</strong> In case D the script says it rolled back to v2, and the site is serving <strong>v4</strong> — the broken release. In case E it says the same thing and the site is serving <strong>nothing at all</strong>. The exit codes are right, the log is right, and the machine is wrong in two different directions.</p>
</div>

<h3>The diagnosis</h3>
${slide('dv-07', 26, 'Symlink đã về, tiến trình thì chưa')}
<p>One cause for both. My cleanup handler moved the symlink back and stopped there — but Lesson 6.1 measured this exact thing: <strong>a running process does not follow the symlink when the symlink changes.</strong> Node opened <code>app.mjs</code> at startup and has been running that code ever since; repointing the link is invisible to it.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">case D</span><span class="lz-t">v4 still serving</span><span class="lz-d">the broken v4 process was never killed, so it kept answering</span></div>
<div class="lz-step"><span class="lz-k">case E</span><span class="lz-t">nothing serving</span><span class="lz-d">v2 was killed at step 3, v5 crashed, and nothing restarted v2</span></div>
<div class="lz-step"><span class="lz-k">shared cause</span><span class="lz-t">symlink ≠ process</span><span class="lz-d">the rollback restored the pointer and not the thing the pointer is for</span></div>
</div>

<p>The fix is the four lines already visible in the script above — kill whatever holds the port, start the old release, and wait for it to answer:</p>

<div class="out">=== D lai: ban thieu route ===
✗ kiem khoi HONG — ban dung nua voi
✗ hong (ma 8) — dua symlink ve 'v2' VA khoi dong lai
✗ da khoi phuc 'v2' sau 100ms          → ma thoat: 8
  → dang phuc vu: v2
=== E lai: ban vo ngay ===
✗ ban 'v5' KHONG len duoc
✗ hong (ma 7) — dua symlink ve 'v2' VA khoi dong lai
✗ da khoi phuc 'v2' sau 100ms          → ma thoat: 7
  → dang phuc vu: v2</div>

<p>100 milliseconds to recover, correct in both cases, and the exit codes still carry which failure it was.</p>

<div class="pitfall">
<p><strong>Trap — a rollback path that has never run is not a rollback path.</strong> My cleanup handler read correctly, was written by someone who had just spent a chapter measuring rollbacks, and was wrong. Nothing about reading it would have told me — I found it by deliberately deploying a broken artifact and then asking the front door what it was serving. Every failure branch in a deploy script needs that treatment: cause the failure on purpose, then check the machine, not the log. The log said &#39;dua symlink ve v2&#39; in both broken cases, and it was telling the truth about what it did.</p>
</div>

<h3>The three properties that survived testing</h3>
<div class="kv-grid">
<div class="kv"><span class="k">refuse before you write</span><span class="v">every check that can exit 2/3/4/5 runs before the lock and before the first file is created (7.3)</span></div>
<div class="kv"><span class="k">the swap is last and atomic</span><span class="v">so a failure during preparation is invisible to users (7.2)</span></div>
<div class="kv"><span class="k">verify through the front door</span><span class="v">comparing the version served, not the status code (6.5) — this is what caught case D</span></div>
</div>

<p>And one property that only exists because the failure branches were run: <strong>the cleanup handler restores the process, not just the pointer.</strong></p>

<div class="callout ok">
<p><strong>Idempotent to the end.</strong> Running the finished script three times in a row against the same release: three successes, no leftover temporary directories, and one log file per run. The <code>trap don_dep EXIT</code> removes <code>\$TAM</code> on every path, success or failure — measured in 7.2 as 5.8 MB of debris after three failed runs without it, and zero with it.</p>
</div>

<h3>Recording what production runs — with the SHA you locked</h3>
${slide('dv-07', 27, 'Ghi mốc production bằng SHA đã khoá')}
<p>The script above ends by proving the front door serves <code>$BAN</code>. A deploy that ships from git has two more records to write: push the commit to the shared remote, and mark "this is what production runs". Both go wrong the same way — by reading <code>HEAD</code> at the <em>end</em> of a long deploy instead of the commit that was built at the start. Reproduced on the lab VPS with a bare repository standing in for GitHub; commit <code>c3</code> lands in the local <code>main</code> while "deploying" <code>c2</code>:</p>
<div class="out">  [deploy] bat dau: build 4e4e6d1 ... (30 phut)
  [deploy] trao xong, production chay 4e4e6d1
$ git push origin HEAD:main              # ban CU
  origin/main = 16761ce  (c3: phien KHAC commit giua chung)
$ git push origin "$SHA:refs/heads/main"  # ban SUA
  origin/main = 4e4e6d1  (c2: ban se deploy)
$ git push origin "$SHA:refs/heads/da-len-prod"   # moc: production dang chay gi
$ git log --oneline origin/da-len-prod..main   # co gi CHUA len production?
16761ce c3: phien KHAC commit giua chung</div>
<p>(Between the two pushes the lab reset <code>origin/main</code> to <code>c1</code> so both versions start from the same situation.) The old form pushed <code>c3</code> — a commit that never ran anywhere — to the branch everyone treats as "what is deployed". The fixed form pushes exactly what was built. The marker branch <code>da-len-prod</code> then gives a one-line answer to "what is on GitHub that is not on production yet?", which is the question to ask before anyone&#39;s next deploy.</p>
<div class="pitfall co-tieu-de"><strong>Real incident — GitHub 26 commits ahead of production.</strong> A deploy in this project ran from 16:18 to 16:50. In the middle, another session merged a branch of 26 commits, including a schema change and a hand-written migration, into the local <code>main</code>. The final step, <code>git push origin HEAD:main</code>, pushed <code>HEAD</code> as it was at 16:50. Production was still correct — the script compares image hashes — but GitHub now claimed 26 commits that had never run, and the next deploy by anyone would have carried them, migration and all. The fix is the one above: read <code>SHA=$(git rev-parse HEAD)</code> once, at the top, and push <code>"$SHA:refs/heads/main"</code>. Never force-push to "correct" it afterwards; report it.</div>
<ul>
<li><strong>Write the marker last.</strong> In this project the marker is written only after the script has compared the running container&#39;s image hash with the one it swapped in. Writing it straight after the swap is too early: another session can swap over you, and the marker would then describe something that is not running.</li>
<li><strong>A failed marker write must not fail the deploy.</strong> The image is already live; the marker being one deploy old only makes the next gate stricter, not dangerous.</li>
</ul>

<h3>Never edit a deploy script while it runs</h3>
${slide('dv-07', 28, 'Đừng sửa script deploy lúc nó đang chạy')}
<p>Bash does not load a script into memory and then run it. It reads it in chunks, tracking a byte offset into the file. Change the file under it and the offset now points somewhere else. Measured on the lab VPS: a four-step script with <code>sleep 1</code> after step 1, and a comment line added to the top of the file during that second — once by overwriting the file in place, once with <code>sed -i</code>:</p>
<div class="out">=== A) sua TAI CHO (ghi de cung inode) luc dang chay ===
  buoc 1: build
  dep.sh: line 3: au: command not found
  buoc 1: build
  buoc 2: trao
  buoc 3: kiem khoi
  buoc 4: push
  bash -n dep.sh: sach
=== B) sua bang sed -i (tep MOI, inode moi) luc dang chay ===
  buoc 1: build
  buoc 2: trao
  buoc 3: kiem khoi
  buoc 4: push</div>
<ul>
<li><strong>In place (same inode):</strong> bash resumed at its old byte offset, which now fell inside the new comment line — it read <code>au tep</code> (the tail of "dau tep") as a command, then ran <strong>step 1 again</strong>. <code>bash -n</code> on the file afterwards says it is fine, because it is.</li>
<li><strong><code>sed -i</code> (new file, new inode):</strong> bash kept reading the old file it had open; the run finished unaffected. Many editors save in place, and this is why "I only added a comment" can break a running deploy.</li>
<li><strong>The rule:</strong> wait for the deploy to finish, or edit a copy and <code>mv</code> it over the original. Ironically, <code>mv</code> — the operation that once made a real <code>nginx.conf</code> change in this project silently do nothing, because a single-file bind mount keeps the old inode — is exactly what protects a running script, for the same reason (Lesson 1 measured the inode numbers).</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Real incident — the syntax error on a healthy line.</strong> During a deploy in this project, a session edited the migration step at line 384 of the running script. The deploy died at line 462 with <code>syntax error near unexpected token '('</code>, on a line nobody had touched and <code>bash -n</code> confirmed was valid. The images had already been swapped and the migration applied, so production was fine; but the tail of the script — smoke test, nginx sync, image cleanup and the automatic push — was skipped, and GitHub fell behind production with no sign anywhere.</div>

<h3>When a shell script is the right tool, and when it is not</h3>
<table>
<thead><tr><th>Stay in bash when</th><th>Move to something else when</th></tr></thead>
<tbody>
<tr><td>the script mostly runs other programs (<code>git</code>, <code>docker</code>, <code>ssh</code>, <code>curl</code>)</td><td>it mostly manipulates data — parsing JSON, building lists, comparing versions</td></tr>
<tr><td>one machine, one person or a small team</td><td>many servers to keep in the same state → a configuration tool (Ansible) or a platform</td></tr>
<tr><td>under a few hundred lines, every branch exercised on a lab machine</td><td>branches nobody has ever run — the rollback in 7.5 read correctly and was wrong twice</td></tr>
<tr><td>you need it to run anywhere SSH reaches</td><td>deploys should be triggered by merges → CI/CD (Chapter 13, and the GitHub Actions course)</td></tr>
</tbody></table>
<p>For scale: this project&#39;s own deploy script is over a thousand lines (1,098 when counted for this lesson) and is still bash, because almost every line calls another program. The Google Shell Style Guide&#39;s threshold is a hundred lines; treat it as the point where you start asking the question, not an automatic rewrite.</p>
<div class="callout warn"><p><strong>One thing to change in the script above, in your own copy.</strong> Its lock failure exits <code>1</code> — the same code as any unexpected error. Following Lesson 7.3, give it <code>75</code> (<code>EX_TEMPFAIL</code>) so a wrapper can tell "someone else is deploying, try later" from "something broke".</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> you are handing the deploy over to a teammate for the week of exams, and you want every failure branch to have been run at least once, and the "what is deployed" record to be trustworthy. On the lab VPS:</p>
<ol>
<li>Reproduce the push experiment: a bare <code>github.git</code>, a clone, commits <code>c1</code> (pushed) and <code>c2</code>; set <code>SHA=$(git rev-parse HEAD)</code>; commit <code>c3</code>; then compare <code>git push origin HEAD:main</code> with <code>git push origin "$SHA:refs/heads/main"</code> (reset <code>origin/main</code> to <code>c1</code> between them).</li>
<li>Push the marker with <code>git push origin "$SHA:refs/heads/da-len-prod"</code> and list what is not deployed: <code>git log --oneline origin/da-len-prod..main</code>.</li>
<li>Reproduce the running-script experiment: start <code>bash dep.sh</code> in the background, and during its <code>sleep 1</code> overwrite it in place with a version that has one extra line at the top. Then repeat using <code>sed -i</code>.</li>
<li>Take the full script from this lesson, change the lock failure to <code>exit 75</code>, and list which of your exit codes mean "refused" and which mean "failed after writing".</li>
</ol>
<p><strong>Done when:</strong> the old push leaves <code>origin/main</code> at <code>c3</code> and the fixed one at <code>c2</code>; <code>git log origin/da-len-prod..main</code> prints exactly the <code>c3</code> line; the in-place edit prints a <code>command not found</code> and runs step 1 twice while the <code>sed -i</code> run prints each step once; and your exit-code list separates 2–5 (and 75) from 6–9.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>trap … EXIT</code></span><span class="v">A handler that runs whenever the script exits, normally or through errexit (not on SIGKILL).</span></div>
  <div class="kv"><span class="k">Rollback path</span><span class="v">The code that restores the previous release — only trustworthy once it has been run on purpose.</span></div>
  <div class="kv"><span class="k">Locked SHA</span><span class="v">The commit ID read once at the start and used for build, push and marker.</span></div>
  <div class="kv"><span class="k">Deployed marker</span><span class="v">A ref such as <code>da-len-prod</code> that records what production runs, written after verification.</span></div>
  <div class="kv"><span class="k">Inode</span><span class="v">The file itself, as opposed to its name; a running bash keeps reading the inode it opened.</span></div>
  <div class="kv"><span class="k">Failure branch</span><span class="v">Each way the script can exit non-zero; each needs to be triggered deliberately and checked on the machine.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The script&#39;s shape is: refuse (2–5) → lock → prepare (6) → swap → wait (7) → verify (8, 9) → record; exit codes tell you which step broke.</li>
<li>The cleanup trap must restore the process, not just the symlink — found only by running every failure branch.</li>
<li>Read the commit SHA once at the top; push and mark <code>"$SHA"</code>, never <code>HEAD</code> at the end of a long deploy.</li>
<li>Write the "deployed" marker only after the running container has been verified.</li>
<li>Editing a running script in place makes bash read from the wrong byte offset; wait, or edit a copy and <code>mv</code> it.</li>
<li>Bash stays the right tool while it mostly calls other programs and every branch has been exercised.</li>
</ul>


<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bash Reference Manual — the trap builtin</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#Bourne-Shell-Builtins — <code>trap … EXIT</code> fires on normal exit and on errexit alike, which is what makes one handler enough.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">mktemp(1)</span><span class="lc-sub">man 1 mktemp — <code>-d</code> and the <code>XXXXXX</code> template. Creating the directory in the destination filesystem is what lets the later move be a rename rather than a copy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google Shell Style Guide</span><span class="lc-sub">google.github.io/styleguide/shellguide.html — on when a shell script has outgrown shell. Its rule of thumb: past a hundred lines or any real data structure, rewrite in something else.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.service(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.service.html — the alternative to the kill-and-restart block above: <code>Restart=</code>, <code>ExecStartPre=</code> and a unit that supervises the process for you.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — signals, process groups and setsid</span><span class="lc-sub">/courses/linux-bash/learn${REF} — why <code>setsid nohup … &lt;/dev/null &amp;</code> is the incantation that survives the script exiting, and what each part of it is doing.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Cả cái script, và HAI con bọ mà việc chạy thử tìm ra trong nó</h2>
<p class="lead">Mọi thứ từ 7.1 tới 7.4 ráp thành một tệp, chạy trên một ứng dụng thật ở một cổng thật. Rồi CHẠY TỪNG nhánh hỏng — và đó là cách tôi phát hiện chính cái trap dọn dẹp của mình hỏng theo hai kiểu khác nhau.</p>

<h3>Cái script</h3>
${slide('dv-07', 23, 'Năm bước, và mã thoát nói bước nào hỏng')}
${slide('dv-07', 24, 'trap don_dep: lùi cả tiến trình, không chỉ con trỏ')}
<pre><code class="language-bash">#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit 2>/dev/null || true

GOC=/srv/vps/kb/tk; CONG=3340; CUA_TRUOC=http://127.0.0.1:3340
DONG_Y=0; [ "\${1:-}" = "--dong-y" ] &amp;&amp; { DONG_Y=1; shift; }
BAN="\${1:?dung: trien-khai.sh [--dong-y] &lt;ten-ban&gt;}"

NK="\$GOC/nhat-ky/\$(date +%Y%m%d-%H%M%S)-\$BAN.log"
ghi() { printf '%s %s\\n' "\$(date +%H:%M:%S.%3N)" "\$*" | tee -a "\$NK"; }
loi() { printf '%s ✗ %s\\n' "\$(date +%H:%M:%S.%3N)" "\$*" | tee -a "\$NK" >&amp;2; }

TAM=""; TRUOC=""
don_dep() {
  local ma=\$?
  [ -n "\$TAM" ] &amp;&amp; rm -rf "\$TAM"
  if [ \$ma -ne 0 ] &amp;&amp; [ -n "\$TRUOC" ]; then
    loi "hong (ma \$ma) — dua symlink ve '\$TRUOC' VA khoi dong lai"
    ln -sfn "\$GOC/ban/\$TRUOC" "\$GOC/ht.moi" &amp;&amp; mv -Tf "\$GOC/ht.moi" "\$GOC/hien-tai"
    <span class="tok-comment"># symlink KHONG phai tien trinh — phai giet ban hong roi dung lai ban cu</span>
    for p in \$(ss -ltnp 2>/dev/null|grep ":\$CONG "|grep -o 'pid=[0-9]*'|cut -d= -f2); do kill -TERM "\$p" 2>/dev/null||true; done
    CONG=\$CONG setsid nohup node "\$GOC/hien-tai/app.mjs" >>"\$NK" 2>&amp;1 &lt;/dev/null 9>&amp;- &amp;
    for i in \$(seq 1 100); do
      [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 "\$CUA_TRUOC/health" 2>/dev/null)" = "200" ] &amp;&amp; { loi "da khoi phuc '\$TRUOC' sau \$((i*20))ms"; break; }
      sleep 0.02
    done
  fi
  return \$ma
}
trap don_dep EXIT

<span class="tok-comment"># ── 0. TIEN KIEM: kiem chinh bo kiem truoc da (7.3, 7.4) ──</span>
for c in curl ss node ln mv; do
  command -v "\$c" >/dev/null || { loi "thieu cong cu '\$c' — khong deploy duoc"; exit 5; }
done
[ -d "\$GOC/ban/\$BAN" ] || { loi "khong co ban '\$BAN'. Co: \$(ls "\$GOC/ban"|tr '\\n' ' ')"; exit 2; }
if [ "\$DONG_Y" != 1 ]; then
  [ -t 0 ] || { loi "khong co terminal de hoi — dung --dong-y neu that su muon"; exit 4; }
  read -rp "Deploy '\$BAN'? [y/N] " tl || tl=""
  [ "\$tl" = "y" ] || { ghi "huy theo yeu cau nguoi dung"; exit 3; }
fi

exec 9>/var/lock/trien-khai.lock
flock -w 30 9 || { loi "co lan deploy khac dang chay"; exit 1; }

TRUOC=\$(basename "\$(readlink -f "\$GOC/hien-tai" 2>/dev/null || echo none)")
ghi "── deploy '\$BAN' (dang chay: \$TRUOC) ──"

<span class="tok-comment"># ── 1-2. chuan bi o ben le; hong o day thi nguoi dung khong thay gi (7.2) ──</span>
TAM=\$(mktemp -d "\$GOC/tam.XXXXXX")
ghi "1/5 dung tao tac trong \$TAM"
cp -r "\$GOC/ban/\$BAN/." "\$TAM/"
[ -f "\$TAM/app.mjs" ] || { loi "tao tac thieu app.mjs"; exit 6; }
ghi "2/5 dat ban vao \$GOC/ban/\$BAN"; mkdir -p "\$GOC/ban/\$BAN"

<span class="tok-comment"># ── 3. TRAO — buoc DUY NHAT nguoi dung thay, va no o CUOI (6.1) ──</span>
ghi "3/5 trao symlink"
ln -sfn "\$GOC/ban/\$BAN" "\$GOC/ht.moi" &amp;&amp; mv -Tf "\$GOC/ht.moi" "\$GOC/hien-tai"
for p in \$(ss -ltnp 2>/dev/null|grep ":\$CONG "|grep -o 'pid=[0-9]*'|cut -d= -f2); do kill -TERM "\$p" 2>/dev/null||true; done
CONG=\$CONG setsid nohup node "\$GOC/hien-tai/app.mjs" >>"\$NK" 2>&amp;1 &lt;/dev/null 9>&amp;- &amp;

<span class="tok-comment"># ── 4. cho no THAT SU tra loi, khong phai cho tien trinh ton tai ──</span>
san=0; for i in \$(seq 1 150); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 "\$CUA_TRUOC/health" 2>/dev/null)" = "200" ] &amp;&amp; { san=1; ghi "4/5 san sang sau \$((i*20))ms"; break; }
  sleep 0.02
done
[ "\$san" = 1 ] || { loi "ban '\$BAN' KHONG len duoc"; exit 7; }

<span class="tok-comment"># ── 5. KIEM KHOI + KIEM PHIEN BAN qua cua truoc (7.4, 6.5) ──</span>
ghi "5/5 kiem khoi"; KL=0
for R in /health /api/v1/don /api/v1/tin; do
  MA=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 "\$CUA_TRUOC\$R")
  case "\$MA" in 200|401) ghi "    ✓ \$R → \$MA";; *) loi "    \$R → \$MA"; KL=1;; esac
done
[ "\$KL" = 0 ] || { loi "kiem khoi HONG — ban dung nua voi"; exit 8; }
BAN_THAY=\$(curl -s --max-time 2 "\$CUA_TRUOC/ban" | tr -d '\\n')
[ "\$BAN_THAY" = "\$BAN" ] || { loi "cua truoc tra '\$BAN_THAY', khong phai '\$BAN'"; exit 9; }
ghi "✓ XONG — cua truoc xac nhan '\$BAN_THAY'. Nhat ky: \$NK"
TRUOC=""     <span class="tok-comment"># thanh cong: khong lui nua</span></code></pre>

<h3>Đường thuận</h3>
<div class="out">22:09:55.287 ── deploy 'v1' (dang chay: hien-tai) ──
22:09:55.291 1/5 dung tao tac trong /srv/vps/kb/tk/tam.DcEK6T
22:09:55.295 2/5 dat ban vao /srv/vps/kb/tk/ban/v1
22:09:55.298 3/5 trao symlink
22:09:55.442 4/5 san sang sau 100ms
22:09:55.444 5/5 kiem khoi
22:09:55.455     ✓ /health → 200
22:09:55.464     ✓ /api/v1/don → 401
22:09:55.473     ✓ /api/v1/tin → 401
22:09:55.483 ✓ XONG — cua truoc xac nhan 'v1'
  ma thoat: 0</div>

<p>196 mili giây từ đầu tới cuối, 100 trong số đó là chờ Node gắn vào cổng. Giờ tới phần thú vị.</p>

<h3>Chạy TỪNG nhánh hỏng</h3>
${slide('dv-07', 25, 'Chạy từng nhánh hỏng: A–E')}
<div class="out">=== A. ban khong ton tai ===
✗ khong co ban 'v9'. Co: v1 v2         → ma thoat: 2

=== B. khong co terminal, khong --dong-y ===
✗ khong co terminal de hoi — dung --dong-y neu that su muon   → ma thoat: 4

=== C. tao tac hong (thieu app.mjs) ===
✗ tao tac thieu app.mjs
✗ hong (ma 6) — dua symlink ve 'v2'    → ma thoat: 6
  → dang phuc vu: v2</div>

<p>Ca C đúng là thứ cái thiết kế này sinh ra để làm: một tạo tác dị dạng, bắt được ngay lúc chuẩn bị, symlink được đưa về, và website phục vụ v2 xuyên suốt. Rồi hai ca nữa:</p>

<div class="out">=== D. ban THIEU mot route (dung nua voi) ===
✗     /api/v1/tin → 404
✗ kiem khoi HONG — ban dung nua voi
✗ hong (ma 8) — dua symlink ve 'v2'    → ma thoat: 8
  → dang phuc vu: v4          ← ???

=== E. ban KHONG len duoc (app vo ngay) ===
✗ ban 'v5' KHONG len duoc
✗ hong (ma 7) — dua symlink ve 'v2'    → ma thoat: 7
  → dang phuc vu:             ← ??? (rong)</div>

<div class="callout warn">
<p><strong>Cả hai cái đó đều là BỌ trong script của tôi, và tôi chỉ tìm ra vì đã chạy các nhánh hỏng.</strong> Ở ca D script nói nó đã lùi về v2, còn website đang phục vụ <strong>v4</strong> — cái bản HỎNG. Ở ca E nó nói y hệt vậy và website đang phục vụ <strong>KHÔNG GÌ CẢ</strong>. Mã thoát thì đúng, nhật ký thì đúng, và cái máy thì sai theo hai hướng khác nhau.</p>
</div>

<h3>Chẩn đoán</h3>
${slide('dv-07', 26, 'Symlink đã về, tiến trình thì chưa')}
<p>Một nguyên nhân cho cả hai. Cái trap dọn dẹp của tôi dời symlink về rồi DỪNG ở đó — nhưng Bài 6.1 đã đo đúng chuyện này: <strong>một tiến trình ĐANG chạy KHÔNG đi theo symlink khi symlink đổi.</strong> Node mở <code>app.mjs</code> lúc khởi động và chạy đúng cái mã ấy từ đó tới giờ; dời con trỏ là chuyện vô hình với nó.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">ca D</span><span class="lz-t">v4 vẫn phục vụ</span><span class="lz-d">tiến trình v4 hỏng chưa bao giờ bị giết, nên nó cứ tiếp tục trả lời</span></div>
<div class="lz-step"><span class="lz-k">ca E</span><span class="lz-t">không gì phục vụ</span><span class="lz-d">v2 bị giết ở bước 3, v5 vỡ, và không có gì khởi động lại v2</span></div>
<div class="lz-step"><span class="lz-k">nguyên nhân chung</span><span class="lz-t">symlink ≠ tiến trình</span><span class="lz-d">cú lùi khôi phục CON TRỎ mà không khôi phục cái thứ con trỏ ấy trỏ tới</span></div>
</div>

<p>Cách chữa là bốn dòng đã thấy trong script ở trên — giết cái gì đang giữ cổng, khởi động bản cũ, và chờ nó trả lời:</p>

<div class="out">=== D lai: ban thieu route ===
✗ kiem khoi HONG — ban dung nua voi
✗ hong (ma 8) — dua symlink ve 'v2' VA khoi dong lai
✗ da khoi phuc 'v2' sau 100ms          → ma thoat: 8
  → dang phuc vu: v2
=== E lai: ban vo ngay ===
✗ ban 'v5' KHONG len duoc
✗ hong (ma 7) — dua symlink ve 'v2' VA khoi dong lai
✗ da khoi phuc 'v2' sau 100ms          → ma thoat: 7
  → dang phuc vu: v2</div>

<p>100 mili giây để khôi phục, đúng ở cả hai ca, và mã thoát vẫn mang được thông tin đó là cú hỏng nào.</p>

<div class="pitfall">
<p><strong>Bẫy — một đường lùi chưa bao giờ chạy thì KHÔNG phải một đường lùi.</strong> Cái trap dọn dẹp của tôi ĐỌC thì đúng, do một người vừa dành cả một chương đi đo các cú lùi viết ra, và nó SAI. Chẳng có gì trong việc đọc nó nói cho tôi biết điều đó — tôi tìm ra bằng cách CỐ TÌNH deploy một tạo tác hỏng rồi đi hỏi cửa trước xem nó đang phục vụ cái gì. Mọi nhánh hỏng trong một script deploy đều cần cách đối xử ấy: gây ra cú hỏng có chủ đích, rồi kiểm CÁI MÁY, không phải kiểm nhật ký. Nhật ký ghi &#39;dua symlink ve v2&#39; ở cả hai ca hỏng, và nó nói THẬT về việc nó đã làm.</p>
</div>

<h3>Ba tính chất sống sót qua việc chạy thử</h3>
<div class="kv-grid">
<div class="kv"><span class="k">từ chối TRƯỚC khi ghi</span><span class="v">mọi phép kiểm có thể thoát 2/3/4/5 đều chạy trước cái khoá và trước khi tệp đầu tiên được tạo (7.3)</span></div>
<div class="kv"><span class="k">bước tráo ở CUỐI và nguyên tử</span><span class="v">để một cú hỏng lúc chuẩn bị là vô hình với người dùng (7.2)</span></div>
<div class="kv"><span class="k">kiểm qua cửa trước</span><span class="v">so PHIÊN BẢN được phục vụ, không so mã trạng thái (6.5) — đây là thứ bắt được ca D</span></div>
</div>

<p>Và một tính chất chỉ tồn tại vì các nhánh hỏng đã được chạy: <strong>trap dọn dẹp khôi phục cả TIẾN TRÌNH, không chỉ con trỏ.</strong></p>

<div class="callout ok">
<p><strong>Bất biến tới tận cùng.</strong> Chạy script hoàn chỉnh ba lần liên tiếp trên cùng một bản: ba lần thành công, không còn thư mục tạm nào sót, và một tệp nhật ký cho mỗi lần chạy. Cái <code>trap don_dep EXIT</code> xoá <code>\$TAM</code> trên MỌI đường đi, thành công hay hỏng — bài 7.2 đo được 5,8 MB rác sau ba lần chạy hỏng khi không có nó, và bằng không khi có.</p>
</div>

<h3>Ghi lại production đang chạy gì — bằng SHA đã khoá</h3>
${slide('dv-07', 27, 'Ghi mốc production bằng SHA đã khoá')}
<p>Script ở trên kết thúc bằng việc chứng minh cửa trước đang phục vụ <code>$BAN</code>. Một lần deploy đi ra từ git còn hai bản ghi nữa phải viết: push commit lên kho chung, và đánh dấu "đây là thứ production đang chạy". Cả hai hỏng theo cùng một kiểu — đọc <code>HEAD</code> ở <em>CUỐI</em> một lần deploy dài thay vì đọc commit đã được build ở ĐẦU. Tái hiện trên VPS thí nghiệm với một kho trần đóng vai GitHub; commit <code>c3</code> rơi vào <code>main</code> ở máy trong lúc đang "deploy" <code>c2</code>:</p>
<div class="out">  [deploy] bat dau: build 4e4e6d1 ... (30 phut)
  [deploy] trao xong, production chay 4e4e6d1
$ git push origin HEAD:main              # ban CU
  origin/main = 16761ce  (c3: phien KHAC commit giua chung)
$ git push origin "$SHA:refs/heads/main"  # ban SUA
  origin/main = 4e4e6d1  (c2: ban se deploy)
$ git push origin "$SHA:refs/heads/da-len-prod"   # moc: production dang chay gi
$ git log --oneline origin/da-len-prod..main   # co gi CHUA len production?
16761ce c3: phien KHAC commit giua chung</div>
<p>(Giữa hai lần push, phòng thí nghiệm đặt lại <code>origin/main</code> về <code>c1</code> để hai bản xuất phát từ cùng một tình huống.) Bản cũ đẩy <code>c3</code> — một commit chưa từng chạy ở đâu — lên đúng cái nhánh mà ai cũng coi là "thứ đã deploy". Bản sửa đẩy ĐÚNG thứ đã build. Nhánh mốc <code>da-len-prod</code> sau đó trả lời trong một dòng câu hỏi "trên GitHub có gì mà production chưa có?", câu cần hỏi trước lần deploy kế tiếp của bất kỳ ai.</p>
<div class="pitfall co-tieu-de"><strong>Sự cố thật — GitHub đi trước production 26 commit.</strong> Một lần deploy trong dự án này chạy từ 16:18 tới 16:50. Giữa chừng, một phiên khác merge một nhánh 26 commit, có cả thay đổi lược đồ và một migration viết tay, vào <code>main</code> ở máy. Bước cuối, <code>git push origin HEAD:main</code>, đẩy <code>HEAD</code> như nó là lúc 16:50. Production vẫn đúng — script so mã băm ảnh — nhưng GitHub giờ tuyên bố có 26 commit chưa từng chạy, và lần deploy kế tiếp của bất kỳ ai sẽ mang chúng lên, cả migration. Cách chữa là cái ở trên: đọc <code>SHA=$(git rev-parse HEAD)</code> một lần, ở đầu, và push <code>"$SHA:refs/heads/main"</code>. Đừng bao giờ force-push để "sửa" lại sau đó; hãy BÁO.</div>
<ul>
<li><strong>Ghi mốc ở CUỐI.</strong> Trong dự án này, mốc chỉ được ghi sau khi script đã so mã băm ảnh của container đang chạy với ảnh nó vừa tráo vào. Ghi ngay sau bước tráo là quá sớm: một phiên khác có thể tráo đè lên bạn, và khi đó mốc mô tả một thứ KHÔNG đang chạy.</li>
<li><strong>Ghi mốc hỏng không được làm hỏng lần deploy.</strong> Ảnh đã lên rồi; mốc cũ hơn một lượt chỉ làm cái chốt kế tiếp CHẶT hơn, không nguy hiểm.</li>
</ul>

<h3>Đừng bao giờ sửa script deploy lúc nó đang chạy</h3>
${slide('dv-07', 28, 'Đừng sửa script deploy lúc nó đang chạy')}
<p>Bash không nạp cả script vào bộ nhớ rồi mới chạy. Nó đọc từng đoạn, nhớ một VỊ TRÍ BYTE trong tệp. Đổi tệp bên dưới nó là cái vị trí đó trỏ sang chỗ khác. Đo trên VPS thí nghiệm: một script bốn bước có <code>sleep 1</code> sau bước 1, và một dòng chú thích được thêm vào đầu tệp trong đúng giây đó — một lần bằng cách ghi đè tệp tại chỗ, một lần bằng <code>sed -i</code>:</p>
<div class="out">=== A) sua TAI CHO (ghi de cung inode) luc dang chay ===
  buoc 1: build
  dep.sh: line 3: au: command not found
  buoc 1: build
  buoc 2: trao
  buoc 3: kiem khoi
  buoc 4: push
  bash -n dep.sh: sach
=== B) sua bang sed -i (tep MOI, inode moi) luc dang chay ===
  buoc 1: build
  buoc 2: trao
  buoc 3: kiem khoi
  buoc 4: push</div>
<ul>
<li><strong>Ghi đè tại chỗ (cùng inode — cùng "bản thân tệp"):</strong> bash đọc tiếp ở vị trí byte cũ, giờ rơi vào giữa dòng chú thích mới — nó đọc <code>au tep</code> (đuôi của "dau tep") thành một lệnh, rồi chạy <strong>LẠI bước 1</strong>. <code>bash -n</code> trên tệp sau đó bảo là ổn, vì nó ổn thật.</li>
<li><strong><code>sed -i</code> (tệp mới, inode mới):</strong> bash vẫn đọc cái tệp cũ mà nó đang mở; lần chạy xong không bị ảnh hưởng. Nhiều trình soạn thảo lưu tại chỗ, và đó là lý do "tôi chỉ thêm một dòng chú thích" có thể làm vỡ một lần deploy đang chạy.</li>
<li><strong>Luật:</strong> đợi lần deploy xong, hoặc sửa một bản chép rồi <code>mv</code> đè lên bản gốc. Trớ trêu là <code>mv</code> — thao tác từng làm một lần sửa <code>nginx.conf</code> thật của dự án này âm thầm không có tác dụng, vì bind-mount một tệp đơn giữ inode cũ — lại chính là thứ bảo vệ một script đang chạy, vì cùng một lý do (Chương 1 đã đo số inode).</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Sự cố thật — lỗi cú pháp trên một dòng lành.</strong> Trong một lần deploy của dự án này, một phiên sửa bước migration ở dòng 384 của script đang chạy. Lần deploy chết ở dòng 462 với <code>syntax error near unexpected token '('</code>, trên một dòng không ai đụng tới và <code>bash -n</code> xác nhận là hợp lệ. Ảnh đã tráo và migration đã áp, nên production không sao; nhưng đoạn đuôi của script — kiểm khói, đồng bộ nginx, dọn ảnh và bước tự push — bị bỏ, và GitHub tụt lại sau production mà không có dấu hiệu nào ở đâu cả.</div>

<h3>Khi nào script shell là đúng công cụ, và khi nào không</h3>
<table>
<thead><tr><th>Ở lại với bash khi</th><th>Chuyển sang thứ khác khi</th></tr></thead>
<tbody>
<tr><td>script chủ yếu gọi chương trình khác (<code>git</code>, <code>docker</code>, <code>ssh</code>, <code>curl</code>)</td><td>nó chủ yếu xử lý dữ liệu — phân tích JSON, dựng danh sách, so phiên bản</td></tr>
<tr><td>một máy, một người hoặc một nhóm nhỏ</td><td>nhiều máy chủ phải giữ cùng một trạng thái → công cụ cấu hình (Ansible) hoặc một nền tảng</td></tr>
<tr><td>dưới vài trăm dòng, mọi nhánh đã chạy thử trên máy thí nghiệm</td><td>có những nhánh chưa ai từng chạy — cú lùi ở 7.5 đọc thì đúng mà sai tới hai lần</td></tr>
<tr><td>bạn cần nó chạy ở mọi nơi SSH với tới</td><td>deploy nên được kích hoạt bởi việc merge → CI/CD (Chương 13, và khoá GitHub Actions)</td></tr>
</tbody></table>
<p>Để hình dung cỡ: chính script deploy của dự án này dài hơn một nghìn dòng (1.098 dòng lúc đếm cho bài này) mà vẫn là bash, vì gần như mọi dòng đều gọi một chương trình khác. Ngưỡng của Google Shell Style Guide là một trăm dòng; hãy coi nó là lúc BẮT ĐẦU đặt câu hỏi, không phải lệnh viết lại tự động.</p>
<div class="callout warn"><p><strong>Một chỗ nên đổi trong script ở trên, ở bản chép của riêng bạn.</strong> Khi không lấy được khoá, nó thoát <code>1</code> — cùng mã với mọi lỗi bất ngờ. Theo Bài 7.3, hãy cho nó <code>75</code> (<code>EX_TEMPFAIL</code>) để một script bọc ngoài phân biệt được "có người khác đang deploy, thử lại sau" với "có thứ vừa hỏng".</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn sắp bàn giao việc deploy cho bạn cùng nhóm trong tuần thi, và muốn mọi nhánh hỏng đều đã được chạy ít nhất một lần, và bản ghi "cái gì đang được deploy" là đáng tin. Trên VPS thí nghiệm:</p>
<ol>
<li>Tái hiện phép thử push: một <code>github.git</code> trần, một bản clone, commit <code>c1</code> (đã push) và <code>c2</code>; đặt <code>SHA=$(git rev-parse HEAD)</code>; commit <code>c3</code>; rồi so <code>git push origin HEAD:main</code> với <code>git push origin "$SHA:refs/heads/main"</code> (đặt lại <code>origin/main</code> về <code>c1</code> giữa hai lần).</li>
<li>Đẩy mốc bằng <code>git push origin "$SHA:refs/heads/da-len-prod"</code> rồi liệt kê cái chưa lên: <code>git log --oneline origin/da-len-prod..main</code>.</li>
<li>Tái hiện phép thử script đang chạy: chạy nền <code>bash dep.sh</code>, và trong lúc nó <code>sleep 1</code> thì ghi đè tại chỗ bằng một bản có thêm một dòng ở đầu. Rồi làm lại bằng <code>sed -i</code>.</li>
<li>Lấy script hoàn chỉnh của bài, đổi chỗ không lấy được khoá thành <code>exit 75</code>, và liệt kê mã nào của bạn nghĩa là "từ chối" còn mã nào nghĩa là "hỏng sau khi đã ghi".</li>
</ol>
<p><strong>Đạt khi:</strong> bản push cũ để <code>origin/main</code> ở <code>c3</code> còn bản sửa ở <code>c2</code>; <code>git log origin/da-len-prod..main</code> in đúng dòng <code>c3</code>; lần ghi đè tại chỗ in một dòng <code>command not found</code> và chạy bước 1 hai lần trong khi lần <code>sed -i</code> in mỗi bước một lần; và danh sách mã thoát của bạn tách 2–5 (và 75) khỏi 6–9.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>trap … EXIT</code> (bẫy lúc thoát)</span><span class="v">Hàm chạy mỗi khi script thoát, bình thường hay do errexit (không chạy khi bị SIGKILL).</span></div>
  <div class="kv"><span class="k">Rollback path (đường lùi)</span><span class="v">Đoạn mã khôi phục bản trước — chỉ đáng tin khi đã được CỐ TÌNH chạy thử.</span></div>
  <div class="kv"><span class="k">Locked SHA (SHA đã khoá)</span><span class="v">Mã commit đọc MỘT lần ở đầu và dùng cho build, push và ghi mốc.</span></div>
  <div class="kv"><span class="k">Deployed marker (mốc đã lên production)</span><span class="v">Một ref như <code>da-len-prod</code> ghi lại production đang chạy gì, viết sau khi đã kiểm.</span></div>
  <div class="kv"><span class="k">Inode (bản thân tệp)</span><span class="v">Chính cái tệp, khác với tên của nó; bash đang chạy cứ đọc inode mà nó đã mở.</span></div>
  <div class="kv"><span class="k">Failure branch (nhánh hỏng)</span><span class="v">Mỗi cách script có thể thoát khác 0; cái nào cũng cần được gây ra có chủ đích và kiểm trên máy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hình dạng của script: từ chối (2–5) → khoá → chuẩn bị (6) → tráo → chờ (7) → kiểm (8, 9) → ghi mốc; mã thoát cho biết bước nào vỡ.</li>
<li>Trap dọn dẹp phải khôi phục cả tiến trình, không chỉ symlink — chỉ tìm ra được khi chạy MỌI nhánh hỏng.</li>
<li>Đọc SHA commit một lần ở đầu; push và ghi mốc <code>"$SHA"</code>, không bao giờ <code>HEAD</code> ở cuối một lần deploy dài.</li>
<li>Chỉ ghi mốc "đã lên production" sau khi container đang chạy đã được kiểm.</li>
<li>Sửa tại chỗ một script đang chạy làm bash đọc sai vị trí byte; hãy đợi, hoặc sửa bản chép rồi <code>mv</code>.</li>
<li>Bash còn là đúng công cụ khi nó chủ yếu gọi chương trình khác và mọi nhánh đã được chạy thử.</li>
</ul>


<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bash Reference Manual — lệnh dựng sẵn trap</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#Bourne-Shell-Builtins — <code>trap … EXIT</code> nổ cả khi thoát bình thường lẫn khi errexit giết script, và đó là thứ làm cho MỘT handler là đủ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">mktemp(1)</span><span class="lc-sub">man 1 mktemp — cờ <code>-d</code> và khuôn <code>XXXXXX</code>. Tạo thư mục NGAY TRONG hệ tệp đích là thứ cho phép cú dời sau đó là một phép đổi tên chứ không phải một lần chép.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google Shell Style Guide</span><span class="lc-sub">google.github.io/styleguide/shellguide.html — về lúc một script shell đã lớn quá cỡ của shell. Quy tắc ngón tay cái của họ: quá một trăm dòng hoặc có cấu trúc dữ liệu thật thì viết lại bằng thứ khác.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.service(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.service.html — lựa chọn thay thế cho khối giết-rồi-khởi-động-lại ở trên: <code>Restart=</code>, <code>ExecStartPre=</code> và một unit tự giám sát tiến trình giúp bạn.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — tín hiệu, nhóm tiến trình và setsid</span><span class="lc-sub">/courses/linux-bash/learn${REF} — vì sao <code>setsid nohup … &lt;/dev/null &amp;</code> là câu thần chú sống sót qua việc script thoát, và từng phần của nó làm gì.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.6 ─────────────────────────── */
    {
      title: '7.6 — Quiz: the deploy script|||7.6 — Quiz: script deploy',
      slug: 'deploy-7-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống: SHA rỗng thoát 0, chạy hai lần rồi so trạng thái máy, echo y vào một lời hỏi, df -BG làm tròn lên, khoá bị tiến trình con giữ, vòng chờ pgrep tự khớp, curl -f với 401, danh sách kiểm đọc nhầm commit, push HEAD thay vì SHA đã deploy, và sửa script lúc nó đang chạy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.6</span>
<h2>Quiz: the deploy script</h2>
<p class="lead">Eight questions from the chapter where the script that reads correctly is broken, and the only way to find out is to break it on purpose.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why <code>local x=$(cmd)</code> exits 0 under <code>set -euo pipefail</code>, and fix it.</li>
<li>I can prove a deploy script is idempotent by snapshotting the machine and diffing two runs.</li>
<li>I can write gates that refuse — no terminal, wrong branch, dirty tree, behind origin, low disk — each with its own exit code.</li>
<li>I can choose between <code>flock -n</code> and <code>-w</code>, and explain why a lock file is worse than <code>flock</code>.</li>
<li>I can read a smoke test&#39;s 200/401/404/000 and say why <code>curl -f</code> is wrong there.</li>
<li>I can explain why the push at the end must use the SHA read at the start.</li>
</ul>
${slide('dv-07', 30, 'Bảng tra nhanh Chương 7')}
<div class="callout">
<p><strong>What this chapter established.</strong> With no flags a script survived a broken pipe, an unset variable and a failing command and exited <strong>0</strong>; <code>set -euo pipefail</code> stopped it at the first — but <code>local x=\$(cmd)</code> exited 0 in <em>every</em> configuration measured, including with <code>inherit_errexit</code>, because <code>local</code> is itself a command whose status wins; splitting into <code>local x; x=\$(cmd)</code> fixed it (7.1). A script made half-idempotent ran five times cleanly and left five copies of the same PATH line, with no exit code reporting it, while a script that failed at step 3 of 4 left the symlink pointing at the old release so the site never went down (7.2). A confirmation prompt exited 0 without deploying whenever <code>read</code> was softened with <code>|| true</code> or a default — the exact behaviour this repository documents — and <code>[ ! -t 0 ]</code> plus a distinct exit code fixed it (7.3). A smoke test caught a missing route by treating 401 as a pass and 404 as a stale build, while the same check written with an uninstalled tool burned 3,022 ms, reported the app down while it was serving fine, and exited 0; a one-line <code>command -v</code> guard cut that to 4 ms and exit 5 (7.4). And running every failure branch of the finished script exposed two bugs in its own cleanup handler: it restored the symlink but not the process, leaving the site on the broken release in one case and on nothing at all in the other — because a running process does not follow a symlink that changes (7.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.6</span>
<h2>Quiz: script deploy</h2>
<p class="lead">Tám câu ra từ cái chương mà một script ĐỌC thì đúng lại đang hỏng, và cách duy nhất để biết là CỐ TÌNH làm nó hỏng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao <code>local x=$(cmd)</code> thoát 0 dưới <code>set -euo pipefail</code>, và sửa được.</li>
<li>Tôi chứng minh được một script deploy là idempotent bằng cách chụp trạng thái máy và so hai lần chạy.</li>
<li>Tôi viết được các chốt TỪ CHỐI — không terminal, sai nhánh, cây bẩn, đứng sau origin, thiếu đĩa — mỗi cái một mã thoát riêng.</li>
<li>Tôi chọn được giữa <code>flock -n</code> và <code>-w</code>, và giải thích vì sao tệp khoá tệ hơn <code>flock</code>.</li>
<li>Tôi đọc được 200/401/404/000 của bộ kiểm khói và nói được vì sao <code>curl -f</code> sai ở đó.</li>
<li>Tôi giải thích được vì sao bước push ở cuối phải dùng SHA đọc ở đầu.</li>
</ul>
${slide('dv-07', 30, 'Bảng tra nhanh Chương 7')}
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Không cờ nào, một script sống sót qua một cái ống gãy, một biến chưa đặt và một lệnh hỏng rồi thoát <strong>0</strong>; <code>set -euo pipefail</code> chặn nó ở cái đầu tiên — nhưng <code>local x=\$(cmd)</code> thoát 0 trong <em>MỌI</em> cấu hình đã đo, kể cả khi có <code>inherit_errexit</code>, vì <code>local</code> tự nó là một lệnh và trạng thái của nó thắng; tách thành <code>local x; x=\$(cmd)</code> thì chữa được (7.1). Một script sửa nửa vời chạy năm lần sạch sẽ và để lại năm bản sao của cùng một dòng PATH, không mã thoát nào báo, trong khi một script hỏng ở bước 3 trên 4 để symlink trỏ vào bản cũ nên website không hề sập (7.2). Một lời hỏi xác nhận thoát 0 mà KHÔNG deploy mỗi khi <code>read</code> được làm mềm bằng <code>|| true</code> hay một giá trị mặc định — đúng hành vi mà kho này ghi lại — và <code>[ ! -t 0 ]</code> cộng một mã thoát riêng thì chữa được (7.3). Một bộ kiểm khói bắt được route thiếu bằng cách coi 401 là ĐẠT còn 404 là bản dựng cũ, trong khi đúng phép kiểm đó viết bằng một công cụ chưa cài thì đốt 3.022 ms, báo ứng dụng chết trong lúc nó chạy tốt, và thoát 0; một dòng chắn <code>command -v</code> cắt xuống còn 4 ms và thoát 5 (7.4). Và chạy MỌI nhánh hỏng của script hoàn chỉnh đã phơi ra hai con bọ trong chính cái trap dọn dẹp của nó: nó khôi phục symlink mà không khôi phục tiến trình, để website nằm ở bản HỎNG trong một ca và không phục vụ gì cả trong ca kia — vì một tiến trình đang chạy KHÔNG đi theo một symlink vừa đổi (7.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your deploy script runs under set -euo pipefail. Started from the wrong folder, its function local sha=$(git rev-parse HEAD) prints "fatal: not a git repository", the log shows an empty line, and the script exits 0. What happened?|||Script deploy của bạn chạy dưới set -euo pipefail. Chạy nhầm thư mục, hàm có local sha=$(git rev-parse HEAD) in "fatal: not a git repository", log hiện một dòng trống, và script thoát 0. Chuyện gì đã xảy ra?',
            options: [
              'git exited 0 because it only printed a warning|||git thoát 0 vì nó chỉ in một cảnh báo',
              '-u should have stopped it, because sha is empty|||-u lẽ ra phải chặn, vì sha rỗng',
              'local is itself a command; its success overwrote git’s exit 128, so errexit never fired — split it into local sha; sha=$(…)|||local tự nó là một lệnh; nó thành công và ghi đè mã 128 của git, nên errexit không bao giờ nổ — tách thành local sha; sha=$(…)',
              'pipefail is off inside functions|||pipefail bị tắt bên trong hàm',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured on the lab VPS: exit 0 with the combined line, exit 128 once split. ShellCheck reports it as SC2155. -u is tempting but wrong: sha is SET (to an empty string), and -u only fires on unset variables.|||VI: Đo trên VPS thí nghiệm: dòng gộp thoát 0, tách ra thì thoát 128. ShellCheck báo đúng lỗi này là SC2155. -u nghe hợp lý nhưng sai: sha ĐÃ ĐƯỢC ĐẶT (thành chuỗi rỗng), còn -u chỉ nổ với biến CHƯA đặt.',
          },
          {
            question: 'A disk gate reads CON=$(df -BG --output=avail /srv | tail -1 | tr -dc "0-9") and refuses when CON is below 2. df -h shows 1.1G free, and the gate passes. Why, and what is the fix?|||Một chốt đĩa đọc CON=$(df -BG --output=avail /srv | tail -1 | tr -dc "0-9") và từ chối khi CON nhỏ hơn 2. df -h báo còn 1.1G, và chốt vẫn cho qua. Vì sao, và sửa thế nào?',
            options: [
              'df -B rounds sizes UP to the next unit, so 1.1 GB prints as 2G — count in megabytes with -BM and compare against 2048|||df -B làm tròn LÊN tới đơn vị kế tiếp, nên 1,1 GB in ra 2G — đếm theo megabyte bằng -BM và so với 2048',
              'tr -dc "0-9" turns 1.1 into 11|||tr -dc "0-9" biến 1.1 thành 11',
              'df counts space reserved for root as free|||df tính cả phần dành riêng cho root là còn trống',
              'tmpfs reports double its real size|||tmpfs báo gấp đôi cỡ thật',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured on a 1,300 MB tmpfs with 180 MB written: -h 1.1G, -BM 1120M, -BG 2G. The tr answer is the attractive one, but -BG never prints a decimal point — the rounding happened inside df. The error can be almost a whole unit: with a 20G threshold, 19.1 GB passes.|||VI: Đo trên tmpfs 1.300 MB đã ghi 180 MB: -h 1.1G, -BM 1120M, -BG 2G. Đáp án tr nghe hấp dẫn nhưng -BG không bao giờ in dấu chấm thập phân — việc làm tròn xảy ra ngay trong df. Sai số có thể gần trọn một đơn vị: ngưỡng 20G thì 19,1 GB vẫn qua.',
          },
          {
            question: 'A teammate runs the fixed deploy script (it checks [ -t 0 ] before asking "[y/N]") from a background job as echo y | bash deploy.sh. It exits 4 without deploying. What is going on?|||Một bạn chạy bản script deploy đã sửa (có kiểm [ -t 0 ] trước khi hỏi "[y/N]") từ một tác vụ nền bằng echo y | bash deploy.sh. Nó thoát 4 mà không deploy. Chuyện gì đang xảy ra?',
            options: [
              'echo adds a newline, so read receives "y\\n" and the comparison fails|||echo thêm dấu xuống dòng nên read nhận "y\\n" và phép so sánh trượt',
              'read -p cannot run without printing its prompt|||read -p không chạy được nếu không in được lời nhắc',
              'set -e kills read when stdin is a pipe|||set -e giết read khi stdin là một cái ống',
              'stdin is a pipe, not a terminal, so the script refuses on purpose; automation must say --dong-y instead of answering for a human|||stdin là một cái ống, không phải terminal, nên script CỐ Ý từ chối; phía tự động hoá phải nói --dong-y thay vì trả lời hộ con người',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured: echo y | hoi-moi.sh → exit 4, --dong-y </dev/null → deploys. The fix treats a pipe as "nobody is there". The newline answer is wrong: read strips the trailing newline, which is why the OLD script deploys under echo y.|||VI: Đo thật: echo y | hoi-moi.sh → thoát 4, --dong-y </dev/null → deploy. Bản sửa coi cái ống là "không có ai". Đáp án dấu xuống dòng sai: read tự bỏ dấu xuống dòng ở cuối, và đó là lý do script CŨ vẫn deploy khi được echo y.',
          },
          {
            question: 'You run your deploy script twice with the same argument and diff a snapshot of /srv/app between the runs: the only change is moi-truong growing from 20 to 40 bytes. Which change makes the script idempotent?|||Bạn chạy script deploy hai lần cùng tham số và diff ảnh chụp /srv/app giữa hai lần: thay đổi duy nhất là moi-truong lớn từ 20 lên 40 byte. Sửa gì để script idempotent?',
            options: [
              'Replace mkdir with mkdir -p|||Thay mkdir bằng mkdir -p',
              'The script owns moi-truong, so write it whole with > (or guard the line with grep -qxF … ||); then the same diff must come back empty|||Script SỞ HỮU moi-truong, nên ghi nguyên tệp bằng > (hoặc chắn dòng đó bằng grep -qxF … ||); rồi đúng phép diff đó phải ra rỗng',
              'Add set -e so the second run stops|||Thêm set -e để lần chạy thứ hai dừng lại',
              'Use flock so the script can only run once|||Dùng flock để script chỉ chạy được một lần',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The append >> is the quiet failure: exit 0, one more line per run. After changing it to >, the measured diff returned "diff ma: 0". mkdir -p is a real fix but for a LOUD failure that the diff did not show; flock stops concurrent runs, not repeated ones.|||VI: Dòng nối thêm >> là kiểu hỏng im lặng: thoát 0, thêm một dòng mỗi lần. Đổi thành > rồi đo lại, diff trả "diff ma: 0". mkdir -p là cách chữa thật nhưng cho một cú hỏng ỒN ÀO mà diff không hề thấy; flock chặn chạy CÙNG LÚC, không chặn chạy LẶP LẠI.',
          },
          {
            question: 'Deploy A holds flock on fd 9 and is killed with kill -9. Deploy B, started right after, still exits 75 "another deploy is running". Two seconds later it succeeds. What held the lock?|||Lần deploy A giữ flock trên fd 9 và bị kill -9. Lần deploy B chạy ngay sau đó vẫn thoát 75 "có lần deploy khác đang chạy". Hai giây sau thì nó qua. Cái gì đã giữ khoá?',
            options: [
              'A child of A (here sleep 2) inherited fd 9; flock is released only when the last descriptor closes — so background commands need 9>&-|||Một tiến trình con của A (ở đây là sleep 2) thừa hưởng fd 9; flock chỉ được nhả khi mô tả tệp cuối cùng đóng — nên lệnh chạy nền cần 9>&-',
              'The kernel keeps a flock for a grace period after the owner dies|||Nhân giữ flock thêm một khoảng ân hạn sau khi chủ chết',
              'trap EXIT did not run, so the lock file was never removed|||trap EXIT không chạy nên tệp khoá không bao giờ bị xoá',
              'flock -n caches the previous answer|||flock -n nhớ đệm câu trả lời trước',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured: after kill -9, the only process holding /tmp/trien-khai.lock was "sleep 2"; once it exited, B got the lock. The trap answer describes a LOCK FILE, which really does stay forever after SIGKILL — but a flock has no file to remove; it lives on open descriptors.|||VI: Đo thật: sau kill -9, tiến trình duy nhất giữ /tmp/trien-khai.lock là "sleep 2"; nó thoát là B lấy được khoá. Đáp án trap mô tả TỆP KHOÁ, thứ thật sự nằm lại mãi sau SIGKILL — còn flock không có tệp nào để xoá; nó sống trên các mô tả tệp đang mở.',
          },
          {
            question: 'Two sessions both wait with while pgrep -f deploy-nha.sh >/dev/null; do sleep 20; done; bash deploy-nha.sh. No deploy is running, yet both wait forever. Why?|||Hai phiên cùng chờ bằng while pgrep -f deploy-nha.sh >/dev/null; do sleep 20; done; bash deploy-nha.sh. Không có lần deploy nào đang chạy, vậy mà cả hai chờ mãi. Vì sao?',
            options: [
              'pgrep returns 0 when it finds nothing|||pgrep trả 0 khi không tìm thấy gì',
              'A zombie deploy process is still in the process table|||Một tiến trình deploy zombie vẫn còn trong bảng tiến trình',
              'pgrep -f matches whole command lines, and the waiting shell’s own command line contains "deploy-nha.sh" — anchor with "^bash deploy-nha" or wait on the lock with flock -w|||pgrep -f so khớp CẢ dòng lệnh, và dòng lệnh của chính cái shell đang chờ có chứa "deploy-nha.sh" — neo bằng "^bash deploy-nha" hoặc chờ khoá bằng flock -w',
              'sleep 20 is longer than the deploy, so the loop never sees it end|||sleep 20 dài hơn lần deploy nên vòng lặp không bao giờ thấy nó kết thúc',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Reproduced: pgrep -af found "631 bash -c pgrep -af deploy-nha.sh; true" — the searcher itself — and timeout had to kill the loop (exit 124). The anchored pattern found only the real "648 bash deploy-nha.sh". pgrep actually returns 1 when nothing matches, which is why the first option is wrong.|||VI: Tái hiện: pgrep -af tìm thấy "631 bash -c pgrep -af deploy-nha.sh; true" — chính kẻ đi tìm — và timeout phải giết vòng lặp (mã 124). Mẫu có neo chỉ tìm thấy lần deploy thật "648 bash deploy-nha.sh". pgrep thật ra trả 1 khi không khớp gì, nên phương án đầu sai.',
          },
          {
            question: 'Your smoke test runs curl -sf URL and treats any non-zero exit as a failure. After every deploy it reports /api/v1/don as broken, although the route works for logged-in users. What is wrong?|||Bộ kiểm khói của bạn chạy curl -sf URL và coi mọi mã thoát khác 0 là hỏng. Sau mỗi lần deploy nó báo /api/v1/don hỏng, dù route đó chạy tốt với người đã đăng nhập. Sai ở đâu?',
            options: [
              'The route only accepts POST|||Route đó chỉ nhận POST',
              '-s hides the response, so curl cannot see the status|||-s giấu câu trả lời nên curl không thấy mã trạng thái',
              '--max-time is too short for authenticated routes|||--max-time quá ngắn cho route cần xác thực',
              '-f turns any status ≥ 400 — including the 401 that proves the route is mounted — into exit 22; use -w "%{http_code}" and pass 200 and 401|||-f biến mọi mã ≥ 400 — kể cả cái 401 chứng minh route đã gắn — thành mã thoát 22; hãy dùng -w "%{http_code}" và cho 200 lẫn 401 qua',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured: curl -sf on /api/v1/don printed 401 and exited 22; without -f it exited 0. An unauthenticated request to a protected route answers 401 only if the route exists, so 401 is a pass. -s only silences progress and error text; it does not affect -w output.|||VI: Đo thật: curl -sf vào /api/v1/don in 401 và thoát 22; bỏ -f thì thoát 0. Một request không xác thực vào route được bảo vệ chỉ trả 401 NẾU route tồn tại, nên 401 là ĐẠT. -s chỉ làm im thanh tiến độ và chữ báo lỗi; nó không ảnh hưởng output của -w.',
          },
          {
            question: 'A deploy of an older commit fails its smoke test with "llm-keys/info -> 404". The route list was read from a file in the working tree, where another session had just added that route. What is the right conclusion?|||Một lần deploy commit cũ hơn trượt kiểm khói với "llm-keys/info -> 404". Danh sách route được đọc từ một tệp trong cây làm việc, nơi một phiên khác vừa thêm route đó. Kết luận đúng là gì?',
            options: [
              'The image is stale; rebuild without cache|||Ảnh đã cũ; dựng lại không dùng cache',
              'The deploy is probably healthy — the checker compared the image with a list "from the future"; read the list from the deployed commit with git show "$SHA:file"|||Lần deploy nhiều khả năng lành — bộ kiểm so ảnh với một danh sách "từ tương lai"; hãy đọc danh sách từ commit đang deploy bằng git show "$SHA:tệp"',
              'The new route is broken; roll back immediately|||Route mới bị hỏng; lùi bản ngay',
              'nginx is caching an old 404|||nginx đang cache một cái 404 cũ',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Reproduced: reading the working tree gave /api/v1/llm-keys 404; git show "06d33ee:smoke-routes.txt" gave only the routes that commit has, and all passed. 404 normally means "stale build", which is why the rebuild option is tempting — here the build was not stale, the checklist was newer than the build.|||VI: Tái hiện: đọc cây làm việc ra /api/v1/llm-keys 404; git show "06d33ee:smoke-routes.txt" chỉ ra các route mà commit đó có, và tất cả đều qua. 404 thường nghĩa là "bản dựng cũ", nên phương án dựng lại nghe hợp lý — ở đây bản dựng không cũ, danh sách kiểm mới HƠN bản dựng.',
          },
          {
            question: 'A 30-minute deploy of c2 ends with git push origin HEAD:main. Meanwhile c3 was committed to the local main. Production correctly runs c2. What does GitHub show, and what should the script do?|||Một lần deploy c2 kéo dài 30 phút kết thúc bằng git push origin HEAD:main. Trong lúc đó c3 được commit vào main ở máy. Production chạy đúng c2. GitHub hiện gì, và script nên làm gì?',
            options: [
              'GitHub shows c2 — git push always sends the commit that was built|||GitHub hiện c2 — git push luôn gửi commit đã được build',
              'Nothing is pushed because HEAD moved|||Không có gì được push vì HEAD đã di chuyển',
              'GitHub shows c3, a commit that never ran; read SHA=$(git rev-parse HEAD) at the start and push "$SHA:refs/heads/main"|||GitHub hiện c3, một commit chưa từng chạy; đọc SHA=$(git rev-parse HEAD) ở đầu và push "$SHA:refs/heads/main"',
              'GitHub shows c3; fix it afterwards with git push --force origin c2:main|||GitHub hiện c3; sửa lại sau bằng git push --force origin c2:main',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured with a bare repository as "GitHub": HEAD:main left origin/main at c3; "$SHA:refs/heads/main" left it at c2, and git log origin/da-len-prod..main listed exactly c3 as not deployed. The force-push option "fixes" history by rewriting a shared branch — the project rules forbid it; report instead.|||VI: Đo với một kho trần đóng vai "GitHub": HEAD:main để origin/main ở c3; "$SHA:refs/heads/main" để nó ở c2, và git log origin/da-len-prod..main liệt kê đúng c3 là chưa deploy. Phương án force-push "sửa" lịch sử bằng cách viết lại một nhánh dùng chung — luật của dự án cấm; hãy báo thay vì làm vậy.',
          },
          {
            question: 'While a long deploy script runs, you add one comment line near its top and save. The deploy dies later with "syntax error near unexpected token" on a line nobody touched, and bash -n says the file is fine. Why?|||Trong lúc một script deploy dài đang chạy, bạn thêm một dòng chú thích gần đầu tệp rồi lưu. Lần deploy chết về sau với "syntax error near unexpected token" trên một dòng không ai đụng, và bash -n bảo tệp vẫn ổn. Vì sao?',
            options: [
              'Bash reads a running script by byte offset; the in-place save shifted everything after its position, so it resumed mid-line — wait, or edit a copy and mv it over|||Bash đọc script đang chạy theo vị trí byte; lần lưu tại chỗ làm mọi thứ sau vị trí đó dịch đi, nên nó đọc tiếp từ giữa một dòng — hãy đợi, hoặc sửa bản chép rồi mv đè lên',
              'The editor saved the file with CRLF line endings|||Trình soạn thảo lưu tệp với kiểu xuống dòng CRLF',
              'Bash caches the old file, and line numbers no longer match|||Bash nhớ đệm tệp cũ, và số dòng không còn khớp',
              'set -u fired on a variable defined in the comment|||set -u nổ vì một biến được định nghĩa trong dòng chú thích',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Reproduced: overwriting the file in place during sleep 1 printed "au: command not found" (the tail of the new comment) and ran step 1 twice; the same edit made with sed -i, which writes a new file, left the run unaffected. CRLF is tempting, but it would also make bash -n fail, and a comment cannot introduce it into untouched lines.|||VI: Tái hiện: ghi đè tệp tại chỗ trong lúc sleep 1 in ra "au: command not found" (đuôi của dòng chú thích mới) và chạy bước 1 hai lần; cùng lần sửa đó làm bằng sed -i, thứ ghi ra tệp MỚI, không ảnh hưởng lần chạy. CRLF nghe hợp lý, nhưng nó cũng làm bash -n hỏng, và một dòng chú thích không thể đưa CRLF vào những dòng không bị đụng.',
          },
        ],
      },
    },
  ],
};
