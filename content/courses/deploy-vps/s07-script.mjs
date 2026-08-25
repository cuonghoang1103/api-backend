const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';
/**
 * Deploy VPS — Chương 7: Cái script deploy.
 * Mọi số đo là ĐO THẬT trong hộp cát: bash 5.2 trên /srv/vps/kb, một ứng dụng
 * Node bốn route ở 127.0.0.1:3340, và script trien-khai.sh chạy hết mọi nhánh
 * hỏng của chính nó — kể cả hai con bọ mà việc chạy thử tìm ra.
 */

export default {
  title: 'Chapter 7 — The deploy script: failing loudly, and being safe to run twice|||Chương 7 — Script deploy: hỏng thật to, và chạy hai lần vẫn an toàn',
  slug: 'deploy-ch7-script',
  description: 'Một script deploy có bốn việc mà không việc nào là "deploy": DỪNG khi có gì sai, CHẠY LẠI ĐƯỢC, TỪ CHỐI khi điều kiện chưa đủ, và CHỨNG MINH nó đã chạy. Chương này đo từng cái, và tìm ra hai con bọ trong chính script của tôi bằng cách chạy thử các nhánh hỏng.',
  sortOrder: 8,
  lessons: [

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
<p>One script with three ways to fail — a broken pipe, an unset variable, and a command that returns non-zero — run under five combinations of flags:</p>

<pre><code>false | true               <span class="tok-comment"># can pipefail</span>
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

<pre><code><span class="tok-comment"># NUOT loi, bat ke co gi:</span>
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
<p>Một script với ba cách hỏng — một cái ống gãy, một biến chưa đặt, và một lệnh trả về khác không — chạy dưới năm tổ hợp cờ:</p>

<pre><code>false | true               <span class="tok-comment"># can pipefail</span>
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

<pre><code><span class="tok-comment"># NUOT loi, bat ke co gi:</span>
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

<pre><code>mkdir "\$D/ban-\$1"
echo "ban \$1" > "\$D/ban-\$1/README"
echo "PATH=/opt/ung-dung/bin:\\\$PATH" >> "\$D/moi-truong"
ln -s "\$D/ban-\$1" "\$D/hien-tai"</code></pre>

<div class="out">  lan 1: OK
mkdir: cannot create directory '/srv/vps/kb/idem/dich/ban-v1': File exists
  lan 2: HONG ma thoat 1</div>

<p>This is the good outcome. It stops immediately, names the reason, and exits non-zero. Annoying, but it tells you the truth and it changed nothing.</p>

<h3>The quiet failure</h3>
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
<pre><code>mkdir -p "\$D/ban-\$1"                                <span class="tok-comment"># -p: da co thi thoi</span>
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

<pre><code>mkdir "\$D/ban-\$1"
echo "ban \$1" > "\$D/ban-\$1/README"
echo "PATH=/opt/ung-dung/bin:\\\$PATH" >> "\$D/moi-truong"
ln -s "\$D/ban-\$1" "\$D/hien-tai"</code></pre>

<div class="out">  lan 1: OK
mkdir: cannot create directory '/srv/vps/kb/idem/dich/ban-v1': File exists
  lan 2: HONG ma thoat 1</div>

<p>Đây là kết cục TỐT. Nó dừng ngay, gọi tên lý do, và thoát khác không. Khó chịu, nhưng nó nói thật và nó không đổi gì cả.</p>

<h3>Kiểu hỏng IM LẶNG</h3>
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
<pre><code>mkdir -p "\$D/ban-\$1"                                <span class="tok-comment"># -p: da co thi thoi</span>
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

<pre><code>read -rp "Van deploy? [y/N] " tl
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
<pre><code>if [ ! -t 0 ]; then
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

<pre><code>read -rp "Van deploy? [y/N] " tl
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
<pre><code>if [ ! -t 0 ]; then
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
<p>Not correctness — you have tests for that, and they ran before the artifact was built. A smoke test answers one narrow question: <strong>is the thing that is running actually the thing I just deployed, and is all of it there?</strong> The failure it is built to catch is the partial or stale build, where the process starts, the health check passes, and one router was never mounted.</p>

<p>Measured, against a version with all four routes and a version missing one:</p>

<pre><code>for R in /health /api/v1/don /api/v1/gifs /api/v1/tin; do
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
<p>Here is the same check written with a tool that is not installed on this machine. The application is running perfectly on port 3330 throughout:</p>

<pre><code>for i in \$(seq 1 6); do
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
<pre><code>command -v xh >/dev/null || { echo "  bo kiem KHONG chay duoc: thieu xh" >&amp;2; exit 5; }</code></pre>

<div class="out">  bo kiem KHONG chay duoc: thieu xh
  ma thoat: 5 | mat 4 ms</div>

<p>Four milliseconds instead of 3,022, a message naming the actual problem, and a distinct exit code. And the fixed check, pointed at a genuinely dead port, still behaves correctly:</p>

<div class="out">--- cung script, tro vao cong CHET ---
  frontend KHONG len duoc sau 6 lan thu
  ma thoat: 6 | mat 3077 ms</div>

<p>Three seconds is the right cost <em>there</em> — it really was retrying a real connection to a real port. The 3,022 ms in the broken version was the same three seconds spent learning nothing.</p>

<h3>A log you can read afterwards</h3>
<p>The other half of proof is the record. Timestamping every line turns "the deploy was slow" into "step 2 took 900 ms":</p>

<pre><code>ghi() { printf '%s %s\\n' "\$(date +%H:%M:%S.%3N)" "\$*" | tee -a "\$LOG"; }</code></pre>

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
<p>Không phải để kiểm ĐÚNG SAI — bạn có bộ test cho việc đó rồi, và chúng chạy trước khi tạo tác được dựng. Kiểm khói trả lời một câu hẹp: <strong>cái đang chạy có đúng là cái tôi vừa deploy không, và nó có ĐỦ không?</strong> Cú hỏng nó sinh ra để bắt là bản dựng NỬA VỜI hoặc CŨ, khi tiến trình khởi động được, chốt kiểm sức khoẻ qua, và một cái router chưa bao giờ được gắn.</p>

<p>Đo thật, trên một bản đủ bốn route và một bản thiếu một route:</p>

<pre><code>for R in /health /api/v1/don /api/v1/gifs /api/v1/tin; do
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
<p>Đây là đúng phép kiểm đó viết bằng một công cụ KHÔNG được cài trên máy này. Ứng dụng chạy hoàn hảo ở cổng 3330 trong suốt thời gian đó:</p>

<pre><code>for i in \$(seq 1 6); do
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
<pre><code>command -v xh >/dev/null || { echo "  bo kiem KHONG chay duoc: thieu xh" >&amp;2; exit 5; }</code></pre>

<div class="out">  bo kiem KHONG chay duoc: thieu xh
  ma thoat: 5 | mat 4 ms</div>

<p>Bốn mili giây thay vì 3.022, một dòng gọi tên đúng vấn đề, và một mã thoát riêng. Và phép kiểm đã sửa, khi trỏ vào một cổng CHẾT thật, vẫn hành xử đúng:</p>

<div class="out">--- cung script, tro vao cong CHET ---
  frontend KHONG len duoc sau 6 lan thu
  ma thoat: 6 | mat 3077 ms</div>

<p>Ba giây là cái giá ĐÚNG ở <em>ĐÓ</em> — nó thật sự đang thử lại một kết nối thật tới một cổng thật. Còn 3.022 ms ở bản hỏng là đúng ba giây ấy dùng để học được con số không.</p>

<h3>Một cuốn nhật ký đọc lại được</h3>
<p>Nửa còn lại của việc chứng minh là BẢN GHI. Đóng dấu thời gian mọi dòng biến "lần deploy chậm" thành "bước 2 mất 900 ms":</p>

<pre><code>ghi() { printf '%s %s\\n' "\$(date +%H:%M:%S.%3N)" "\$*" | tee -a "\$LOG"; }</code></pre>

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
<pre><code>#!/bin/bash
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
<pre><code>#!/bin/bash
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
      description: 'Tám câu về cái cờ shell không bắt được ca phổ biến nhất, năm lần chạy sạch để lại năm dòng PATH, một lời hỏi thoát 0 khi không ai trả lời, một bộ kiểm đốt 3.022 mili giây để học con số không, và hai con bọ trong chính cái trap của tôi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.6</span>
<h2>Quiz: the deploy script</h2>
<p class="lead">Eight questions from the chapter where the script that reads correctly is broken, and the only way to find out is to break it on purpose.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> With no flags a script survived a broken pipe, an unset variable and a failing command and exited <strong>0</strong>; <code>set -euo pipefail</code> stopped it at the first — but <code>local x=\$(cmd)</code> exited 0 in <em>every</em> configuration measured, including with <code>inherit_errexit</code>, because <code>local</code> is itself a command whose status wins; splitting into <code>local x; x=\$(cmd)</code> fixed it (7.1). A script made half-idempotent ran five times cleanly and left five copies of the same PATH line, with no exit code reporting it, while a script that failed at step 3 of 4 left the symlink pointing at the old release so the site never went down (7.2). A confirmation prompt exited 0 without deploying whenever <code>read</code> was softened with <code>|| true</code> or a default — the exact behaviour this repository documents — and <code>[ ! -t 0 ]</code> plus a distinct exit code fixed it (7.3). A smoke test caught a missing route by treating 401 as a pass and 404 as a stale build, while the same check written with an uninstalled tool burned 3,022 ms, reported the app down while it was serving fine, and exited 0; a one-line <code>command -v</code> guard cut that to 4 ms and exit 5 (7.4). And running every failure branch of the finished script exposed two bugs in its own cleanup handler: it restored the symlink but not the process, leaving the site on the broken release in one case and on nothing at all in the other — because a running process does not follow a symlink that changes (7.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.6</span>
<h2>Quiz: script deploy</h2>
<p class="lead">Tám câu ra từ cái chương mà một script ĐỌC thì đúng lại đang hỏng, và cách duy nhất để biết là CỐ TÌNH làm nó hỏng.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Không cờ nào, một script sống sót qua một cái ống gãy, một biến chưa đặt và một lệnh hỏng rồi thoát <strong>0</strong>; <code>set -euo pipefail</code> chặn nó ở cái đầu tiên — nhưng <code>local x=\$(cmd)</code> thoát 0 trong <em>MỌI</em> cấu hình đã đo, kể cả khi có <code>inherit_errexit</code>, vì <code>local</code> tự nó là một lệnh và trạng thái của nó thắng; tách thành <code>local x; x=\$(cmd)</code> thì chữa được (7.1). Một script sửa nửa vời chạy năm lần sạch sẽ và để lại năm bản sao của cùng một dòng PATH, không mã thoát nào báo, trong khi một script hỏng ở bước 3 trên 4 để symlink trỏ vào bản cũ nên website không hề sập (7.2). Một lời hỏi xác nhận thoát 0 mà KHÔNG deploy mỗi khi <code>read</code> được làm mềm bằng <code>|| true</code> hay một giá trị mặc định — đúng hành vi mà kho này ghi lại — và <code>[ ! -t 0 ]</code> cộng một mã thoát riêng thì chữa được (7.3). Một bộ kiểm khói bắt được route thiếu bằng cách coi 401 là ĐẠT còn 404 là bản dựng cũ, trong khi đúng phép kiểm đó viết bằng một công cụ chưa cài thì đốt 3.022 ms, báo ứng dụng chết trong lúc nó chạy tốt, và thoát 0; một dòng chắn <code>command -v</code> cắt xuống còn 4 ms và thoát 5 (7.4). Và chạy MỌI nhánh hỏng của script hoàn chỉnh đã phơi ra hai con bọ trong chính cái trap dọn dẹp của nó: nó khôi phục symlink mà không khôi phục tiến trình, để website nằm ở bản HỎNG trong một ca và không phục vụ gì cả trong ca kia — vì một tiến trình đang chạy KHÔNG đi theo một symlink vừa đổi (7.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why does local x=$(lenh-hong) exit 0 even under set -euo pipefail with inherit_errexit?|||Vì sao local x=$(lenh-hong) vẫn thoát 0 kể cả dưới set -euo pipefail có inherit_errexit?',
            options: [
              'Command substitution always swallows errors|||Thay thế lệnh lúc nào cũng nuốt lỗi',
              'local is itself a command, and its own exit status — success, it declared a variable — overwrites the substitution result; splitting into local x; x=$(...) fixes it|||local tự nó là một LỆNH, và trạng thái thoát của chính nó — thành công, nó vừa khai báo một biến — ghi đè lên kết quả của phép thay thế; tách thành local x; x=$(...) thì chữa được',
              'inherit_errexit is only for subshells|||inherit_errexit chỉ dành cho shell con',
              'The variable is local so errors are local too|||Biến là cục bộ nên lỗi cũng cục bộ',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'What does -u (nounset) protect against that the other flags do not?|||Cờ -u (nounset) bảo vệ được cái gì mà các cờ kia không?',
            options: [
              'Failing commands inside pipelines|||Lệnh hỏng bên trong các ống',
              'An unset or mistyped variable expanding to nothing, so a constructed path like "$GOC/x" becomes "/x" — the script does something catastrophic and exits 0|||Một biến chưa đặt hoặc gõ sai khai triển thành rỗng, nên một đường dẫn ghép như "$GOC/x" thành "/x" — script làm một chuyện thảm hoạ rồi thoát 0',
              'Syntax errors|||Lỗi cú pháp',
              'Commands that do not exist|||Những lệnh không tồn tại',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A half-fixed script ran five times, exit 0 each time, and left five copies of the same PATH line. Why is that worse than the version that crashed on run two?|||Một script sửa nửa vời chạy năm lần, thoát 0 mỗi lần, và để lại năm bản sao của cùng một dòng PATH. Vì sao thế TỆ HƠN bản sập ngay lần hai?',
            options: [
              'It is not worse; both are equally bad|||Không tệ hơn; cả hai tệ như nhau',
              'The crash told the truth and changed nothing; the silent version reported success while corrupting a config file, and nothing surfaces it until something downstream chokes|||Cú sập nói THẬT và không đổi gì; bản im lặng báo thành công trong khi làm hỏng một tệp cấu hình, và không gì phơi nó ra cho tới lúc có thứ phía sau nghẹn vì nó',
              'The crash wastes more time|||Cú sập tốn thời gian hơn',
              'Five runs is slower than two|||Năm lần chạy chậm hơn hai lần',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A script failed at step 3 of 4 and the site never went down. Why?|||Một script hỏng ở bước 3 trên 4 và website không hề sập. Vì sao?',
            options: [
              'Luck|||May mắn',
              'The visible step — the symlink swap — comes last, so everything before it is preparation on the side that users cannot see|||Bước NHÌN THẤY ĐƯỢC — cú tráo symlink — nằm ở CUỐI, nên mọi thứ trước nó là chuẩn bị ở bên lề mà người dùng không thấy',
              'The health check kept the old version alive|||Chốt kiểm sức khoẻ giữ bản cũ sống',
              'set -e rolled back automatically|||set -e tự động lùi lại',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A confirmation prompt exited 0 without deploying when run with no terminal. What is the fix?|||Một lời hỏi xác nhận thoát 0 mà không deploy khi chạy không có terminal. Cách chữa là gì?',
            options: [
              'Remove the prompt entirely|||Bỏ hẳn lời hỏi',
              'Test [ ! -t 0 ] first and refuse with its own exit code, offering an explicit flag for automation to state its intent|||Kiểm [ ! -t 0 ] trước rồi TỪ CHỐI kèm mã thoát riêng, và mở một cờ tường minh để phía tự động hoá phát biểu ý định của nó',
              'Always answer y by default|||Luôn mặc định trả lời y',
              'Use read with a longer timeout|||Dùng read với hạn giờ dài hơn',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Why is 401 a passing result in a deploy smoke test?|||Vì sao 401 lại là kết quả ĐẠT trong một bộ kiểm khói lúc deploy?',
            options: [
              'It means the credentials are wrong but recoverable|||Nó nghĩa là thông tin đăng nhập sai nhưng cứu được',
              'A protected route returns 401 if it exists and 404 if it does not, so you can verify every route mounted without any credentials — 404 means a stale or partial build|||Một route được bảo vệ trả 401 NẾU nó tồn tại và 404 nếu không, nên bạn kiểm được MỌI route đã gắn mà không cần thông tin đăng nhập nào — 404 nghĩa là bản dựng cũ hoặc nửa vời',
              'Because authentication is checked after routing in every framework|||Vì mọi framework đều kiểm xác thực sau khi định tuyến',
              'It is not; only 200 should pass|||Không phải; chỉ 200 mới được tính là đạt',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A readiness check written with an uninstalled tool burned 3,022 ms, reported the app down while it was serving fine, and exited 0. What is the general lesson?|||Một phép kiểm sẵn sàng viết bằng một công cụ chưa cài đốt 3.022 ms, báo ứng dụng chết trong lúc nó chạy tốt, và thoát 0. Bài học tổng quát là gì?',
            options: [
              'Always install wget in every container|||Luôn cài wget trong mọi container',
              '"The check cannot run" is a third outcome that needs its own exit code — otherwise it is indistinguishable from "the check failed", and a check that always fails gets ignored|||"Phép kiểm KHÔNG CHẠY ĐƯỢC" là một kết cục THỨ BA cần mã thoát riêng — nếu không, nó không phân biệt được với "phép kiểm hỏng", và một phép kiểm lúc nào cũng hỏng thì bị làm ngơ',
              'Retry loops should be shorter|||Vòng lặp thử lại nên ngắn hơn',
              'Use the health endpoint instead|||Dùng endpoint sức khoẻ thay thế',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Running the failure branches showed the cleanup handler restoring the symlink while the site still served the broken release. What was the root cause?|||Chạy các nhánh hỏng cho thấy trap dọn dẹp khôi phục symlink trong khi website vẫn phục vụ bản hỏng. Nguyên nhân gốc là gì?',
            options: [
              'The symlink was not atomic|||Cú đổi symlink không nguyên tử',
              'A running process does not follow a symlink that changes — it opened the file at startup, so the rollback had to kill it and start the old release, not just move the pointer|||Một tiến trình ĐANG chạy không đi theo symlink khi symlink đổi — nó đã mở tệp lúc khởi động, nên cú lùi phải GIẾT nó rồi khởi động bản cũ, chứ không chỉ dời con trỏ',
              'The trap did not fire|||Cái trap không nổ',
              'The exit code was wrong|||Mã thoát bị sai',
            ],
            correctIndex: 1,
            points: 10,
          },
        ],
      },
    },
  ],
};
