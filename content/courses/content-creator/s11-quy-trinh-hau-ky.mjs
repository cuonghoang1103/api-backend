/**
 * Content Creator — Chương 11: Quy trình hậu kỳ & dữ liệu. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 *
 * Chương này KHÔNG dạy lại nguyên lý máy quay (Chương 5) hay cài đặt thiết bị cụ
 * thể (Chương 6) — nó bắt đầu ngay SAU khi thẻ nhớ đầy: đặt tên, sao chép có
 * kiểm toàn vẹn, sao lưu, chọn công cụ, và chuẩn bị file trước khi mở phần mềm
 * dựng. Bài 11.3/11.4 CHỈ nói ở mức chọn công cụ và chuẩn bị file — CapCut được
 * dạy sâu ở Chương 12, DaVinci Resolve (kể cả trên iPad và máy Linux) được dạy
 * sâu ở Chương 13 (đặc biệt Bài 13.4). Nhắc lại ở đây thì trỏ sang, không lặp.
 *
 * Nguồn số liệu chính (đầy đủ trong báo cáo bàn giao):
 *  - Giá phần mềm, đã kiểm 22/09/2026 bằng WebFetch trực tiếp trên trang chính
 *    thức: blackmagicdesign.com/products/davinciresolve (Free thật sự miễn phí,
 *    Studio 295 USD mua đứt) · apple.com/final-cut-pro (299,99 USD mua đứt Mac,
 *    hoặc gói Apple Creator Studio 12,99 USD/tháng · 129 USD/năm) ·
 *    apple.com/final-cut-pro-for-ipad (FCP cho iPad nay CHỈ bán qua Creator
 *    Studio) · adobe.com/products/premiere.html (gói 1 app từ 22,99 USD/tháng,
 *    trả theo năm) · apps.apple.com — LumaFusion (29,99 USD mua đứt; bản Mac
 *    giờ yêu cầu Apple Silicon) · capcut.com/help/how-much-does-capcut-pro-cost
 *    (chính trang CapCut nói giá "tuỳ khu vực/thiết bị", không niêm yết một mức
 *    USD chung — bài học không bịa số).
 *  - DaVinci Resolve trên Linux: Rocky Linux 8.6 là distro CHÍNH THỨC DUY NHẤT
 *    (kiểm 22/09/2026) — Fedora không nằm trong danh sách. Bản Free không giải
 *    mã H.264/HEVC/AAC trên Linux. Chi tiết trang/thiết bị đầy đủ đã có ở
 *    Chương 13 (Bài 13.4) và Chương 6 (Bài 6.3) — bài này chỉ nhắc lại 2 câu và
 *    trỏ sang, không lặp lại.
 *  - "Generate Proxy Media" / "Generate Optimized Media" là tên chức năng thật
 *    trong DaVinci Resolve. CapCut trên máy tính có "Proxy" trong Settings →
 *    Performance (hội tụ nhiều nguồn cộng đồng, không có một trang capcut.com
 *    đơn lẻ để dẫn — nêu tính năng, không gắn link-card riêng cho mục này).
 *  - MỌI lệnh bash/ffmpeg và MỌI số đo trong bài (cây thư mục, rsync --checksum,
 *    shasum -a 256, dung lượng & tốc độ giải mã của ProRes Proxy/DNxHR LB) đã
 *    CHẠY THẬT trên máy của phiên này — xem báo cáo bàn giao để có toàn bộ lệnh
 *    và output gốc không rút gọn. KHÔNG phải số liệu chính thức của DJI/Apple/
 *    Blackmagic.
 *  - rsync: man7.org/linux/man-pages/man1/rsync.1.html · ss64.com/mac/rsync.html
 *  - 3-2-1 backup: backblaze.com/blog/the-3-2-1-backup-strategy
 *  - H.265 Long-GOP / CRF: trac.ffmpeg.org/wiki/Encode/H.265 (đã dùng ở Ch5) ·
 *    ProRes all-intra: support.apple.com/en-us/109041 (đã dùng ở Ch5/Ch6).
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa chương'],
  [2, 'Bản đồ chương'],
  [3, 'Cấu trúc thư mục dự án'],
  [4, 'Sao chép có kiểm toàn vẹn'],
  [5, 'Quy trình đổ thẻ — bốn bước'],
  [6, 'Sao lưu 3-2-1'],
  [7, 'Giữ gì, xoá gì sau khi đăng'],
  [8, 'Bảng so sánh 5 phần mềm dựng'],
  [9, 'Khuyến nghị theo đồ nghề của bạn'],
  [10, 'Vì sao Long-GOP nặng khi dựng'],
  [11, 'Proxy khác Optimized Media'],
  [12, 'Dung lượng & tốc độ giải mã — đo thật'],
  [13, 'DaVinci Resolve free trên Linux'],
  [14, 'Bảng tra nhanh cả chương'],
  [15, 'Thực hành'],
];

export default {
  title: 'Chapter 11 — Post-production workflow and data|||Chương 11 — Quy trình hậu kỳ & dữ liệu',
  description: 'Đặt tên & sao chép có kiểm toàn vẹn, sao lưu 3-2-1, chọn phần mềm dựng đúng máy, và vì sao phải tạo proxy trước khi dựng — đo thật bằng ffmpeg, không đoán.',
  lessons: [
    /* ─────────────────── 11.0 slide bài giảng ─────────────────── */
    {
      title: '11.0 — Chapter 11 in 15 slides|||11.0 — Chương 11 trong 15 slide',
      slug: 'cr-11-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ quy trình hậu kỳ trong 15 slide: cấu trúc thư mục, sao chép có kiểm toàn vẹn, sao lưu 3-2-1, bảng 5 phần mềm dựng, và số đo thật ffmpeg cho proxy.',
      content: `
<div class="ml-en"><h2>📑 Chapter 11 in 15 slides</h2>
<p>This chapter starts the moment your card is full and ends the moment you open editing software with confidence — everything in between is boring on purpose: naming, copying, backing up, choosing a tool, preparing files. Boring here means nothing gets lost. Skim these 15 slides first — slide 4 and slide 12 both carry commands and numbers this course actually ran, not textbook claims.</p>
<p>Chapter 12 opens CapCut for real editing; Chapter 13 does the same for DaVinci Resolve, including the iPad and the Linux machine. This chapter only helps you choose between them and hand them clean, playable files.</p></div>
<div class="ml-vi"><h2>📑 Chương 11 trong 15 slide</h2>
<p>Chương này bắt đầu đúng lúc thẻ nhớ đầy và kết thúc đúng lúc bạn mở phần mềm dựng mà không lo lắng gì — mọi thứ ở giữa nhàm chán có chủ đích: đặt tên, sao chép, sao lưu, chọn công cụ, chuẩn bị file. Nhàm chán ở đây nghĩa là không mất gì cả. Lướt qua 15 slide này trước — slide 4 và slide 12 đều mang lệnh và con số khoá này đã CHẠY THẬT, không phải lý thuyết sách vở.</p>
<p>Chương 12 mở CapCut ra dựng thật; Chương 13 làm điều tương tự với DaVinci Resolve, kể cả trên iPad và máy Linux. Chương này chỉ giúp bạn chọn đúng giữa chúng và trao cho chúng file sạch, mở được.</p></div>
${gallery('cr-11', SLIDES)}
`,
    },

    /* ─────────────────── 11.1 nhập liệu & đặt tên ─────────────────── */
    {
      title: '11.1 — Ingest and naming: folders you can trust|||11.1 — Nhập liệu & đặt tên: thư mục bạn tin được',
      slug: 'cr-11-1-nhap-lieu-dat-ten',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Cấu trúc thư mục YYYY-MM-DD_slug, script bash tự tạo cây thư mục, và cách sao chép thẻ nhớ có kiểm toàn vẹn bằng rsync --checksum + shasum — chạy thật, kể cả tình huống một file bị hỏng âm thầm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>A folder name you will still understand in six months</h2>
<p class="lead">You shoot a Pocket 3 vlog on Tuesday, an iPhone interview on Thursday, and a screen-recorded lesson on Saturday. Dump all three onto one Desktop folder named "footage" and by next month you cannot tell which clip belongs to which project without opening every single one. This lesson gives you a folder structure that sorts itself, a script that builds it in one command, and a way to copy a card that actually proves nothing got corrupted — not just a progress bar that reached 100%.</p>

<h3>One folder per shoot, named so the filesystem sorts it for you</h3>
<p>The structure this course uses is <code>YYYY-MM-DD_slug</code> — a date first (so Finder/Explorer's default alphabetical sort is also a chronological sort, with zero extra clicks), then a short slug describing the shoot. Under it, five fixed subfolders: <code>01_footage</code> (camera-original files, never edited in place), <code>02_audio</code> (any separately-recorded sound, e.g. a DJI Mic), <code>03_project</code> (your editing-software project file), <code>04_export</code> (finished renders), <code>05_thumbnail</code> (the cover image). <code>01_footage</code> itself splits by camera — <code>A-cam</code> for your primary angle, <code>B-cam</code> for your second — which matters the moment you shoot Pocket 3 and iPhone at once for a multicam edit (Chapter 13.3).</p>
${slide('cr-11', 3, 'Cấu trúc thư mục dự án')}
<p>Why this exact shape and not something simpler? Because every part of it answers a real question you will ask yourself weeks later: "which shoot was this from" (the date), "what was this about" (the slug), "is this the camera original or something I already touched" (01_footage stays untouched, forever — anything you derive from it, like a proxy, lives in a different, disposable place you will meet in Lesson 11.4).</p>

<h3>A script that builds the tree in one command</h3>
<p>Typing eight <code>mkdir</code> commands by hand every single shoot is exactly the kind of friction that makes people skip organizing altogether. Here is a script — tested for real on this machine — that takes a date and a slug and builds the whole tree in one shot:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
# tao-du-an.sh — tạo cây thư mục dự án theo chuẩn YYYY-MM-DD_slug
set -euo pipefail
NGAY="\${1:?thiếu ngày, dạng YYYY-MM-DD}"
SLUG="\${2:?thiếu slug, chữ thường nối gạch ngang}"
GOC="\${NGAY}_\${SLUG}"

mkdir -p "$GOC"/01_footage/{A-cam,B-cam} "$GOC"/{02_audio,03_project,04_export,05_thumbnail}
echo "Đã tạo: $GOC"</code></pre>
<p>Real run, real output:</p>
<pre><code class="language-bash">./tao-du-an.sh "2026-09-22" "vlog-thu-vien-fptu"
find 2026-09-22_vlog-thu-vien-fptu | sort</code></pre>
<div class="out">Đã tạo: 2026-09-22_vlog-thu-vien-fptu
2026-09-22_vlog-thu-vien-fptu
2026-09-22_vlog-thu-vien-fptu/01_footage
2026-09-22_vlog-thu-vien-fptu/01_footage/A-cam
2026-09-22_vlog-thu-vien-fptu/01_footage/B-cam
2026-09-22_vlog-thu-vien-fptu/02_audio
2026-09-22_vlog-thu-vien-fptu/03_project
2026-09-22_vlog-thu-vien-fptu/04_export
2026-09-22_vlog-thu-vien-fptu/05_thumbnail</div>
<p>The <code>\${1:?message}</code> syntax is not decoration — run the script with a missing argument and bash refuses to guess:</p>
<div class="out">./tao-du-an.sh: line 5: 2: thiếu slug, chữ thường nối gạch ngang</div>
<p>That is <code>set -euo pipefail</code> plus a parameter default doing real work: a script that fails loudly on bad input beats one that silently creates a folder called an empty string.</p>

<h3>Copying with integrity checking — the step almost everyone skips</h3>
${slide('cr-11', 4, 'Sao chép có kiểm toàn vẹn')}
<p>A progress bar reaching the end tells you the copy <em>finished</em>. It does not tell you the copy is <em>correct</em> — a flaky USB cable, a failing card reader, or a drive with a bad sector can all flip a bit silently, with the file's size and modified-time left completely unchanged. So instead of trusting the finish, you check content:</p>
<pre><code class="language-bash">rsync -av --checksum "$PROJ/" "$BACKUP/"
( cd "$PROJ" && find . -type f | sort | xargs shasum -a 256 ) > checksum-goc.txt
( cd "$BACKUP" && find . -type f | sort | xargs shasum -a 256 ) > checksum-backup.txt
diff checksum-goc.txt checksum-backup.txt && echo "KHỚP TUYỆT ĐỐI"</code></pre>
<p><code>--checksum</code> tells rsync to compare files by hashing their actual content, not by the cheap "same size, same timestamp" guess it uses by default. <code>shasum -a 256</code> then gives you an independent, human-readable proof of that match. To show you this is not a theoretical warning, I deliberately corrupted one byte in a copied 1,057,547-byte test clip — same size, same modified-time as the original, exactly like real silent corruption would look:</p>
<pre><code class="language-bash"># rsync THƯỜNG (không --checksum) — chỉ so size + mtime
rsync -av "$PROJ/" "$BACKUP/"</code></pre>
<div class="out">sent 777 bytes  received 20 bytes  724545 bytes/sec
total size is 3080867  speedup is 3865.57</div>
<p>Zero content bytes were sent for the corrupted file — plain rsync saw matching size and timestamp and concluded, wrongly, that nothing needed copying. The corrupted backup stayed corrupted. Here is what <code>shasum -a 256</code> caught that the progress bar and plain rsync both missed:</p>
<div class="out">1c1
&lt; a6d7695cdfc02ead128e3d6e0492bbf105772223f2aa0bf36e3e599a17dfe6cf  ./01_footage/A-cam/A001_C001_0922XY.MP4
---
&gt; 8caad14ead7d76484abeed109c7895d003b2d5cb70809d44acbdebf99fa9f8e9  ./01_footage/A-cam/A001_C001_0922XY.MP4</div>
<p>Two completely different hashes for a file that "looked" identical by every metadata check. Running <code>rsync -av --checksum</code> one more time reads the actual bytes, notices the mismatch despite the matching size/mtime, and re-sends exactly that one file — 1,058,626 bytes, the size of the real clip — until the hashes match again. That is the entire value of <code>--checksum</code> in one demonstration: it is the only rsync mode that would have caught this.</p>
<div class="callout warn"><p><strong>Practical rule:</strong> use <code>--checksum</code> for the one-time move off a memory card (correctness matters far more than speed for a few gigabytes), and skip it for routine daily re-syncs of a huge archive where the default quick-check is normally good enough and the full-content hashing would take too long.</p></div>

<h3>Renaming in bulk, briefly</h3>
<p>Camera filenames like <code>A001_C001_0922XY.MP4</code> look cryptic, but resist the urge to rename every clip by hand: Resolve and CapCut both read the embedded timecode and creation date regardless of filename, and a consistent <em>folder</em> name (which you already have) matters far more than a pretty file name. If you do need batch renaming — say, prefixing every file in a folder with the shoot date — a short loop does it without any extra app: <code>for f in *.MP4; do mv "$f" "2026-09-22_$f"; done</code> run from inside the folder. Save real renaming tools for when you have hundreds of files across camera cards from the same day and need to interleave them by timestamp — that is a Chapter 13 multicam problem, not a Chapter 11 one.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — trusting "the copy finished" as proof of a good copy.</strong> The demonstration above is not a rare edge case invented for this lesson: USB-C hubs, cheap card readers, and aging cables all produce exactly this failure mode — a file that looks complete (right size, right name, plays the first few seconds fine) but has a corrupted frame or audio glitch buried somewhere inside. The only defense that actually catches it is comparing content hashes, not watching a progress bar.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 11.2 turns "one verified copy" into a full 3-2-1 backup plan — because even a perfectly verified copy on a single drive is still one dropped bag away from gone.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Write your own version of <code>tao-du-an.sh</code> (or copy the one above) and run it for a real upcoming shoot — confirm the tree with <code>find</code> or <code>tree</code>.</li>
<li>Copy a real card or folder of clips using <code>rsync -av --checksum</code> into a second location on a different drive.</li>
<li>Run <code>shasum -a 256</code> on both sides and diff the results — confirm you get "no differences," not just "it looks the same."</li>
<li>Optional but recommended once: deliberately flip a byte in a copy of a throwaway test file (<code>printf</code> + <code>dd</code>, exactly like this lesson did) and watch plain <code>rsync -av</code> miss it while <code>shasum</code> catches it.</li>
</ol><p><strong>Done when:</strong> you have a real folder tree built by your own script, and a real pair of copies whose SHA-256 hashes you have personally compared — not assumed.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Ingest (nhập liệu)</span><span class="v">The act of copying footage off a camera or memory card onto working storage.</span></div>
<div class="kv"><span class="k">Checksum / hash</span><span class="v">A short fingerprint computed from a file's exact content — two files with the same hash are byte-for-byte identical; a different hash proves they are not.</span></div>
<div class="kv"><span class="k">rsync --checksum</span><span class="v">A flag that forces rsync to compare file content by hash instead of its default, faster size+timestamp guess.</span></div>
<div class="kv"><span class="k">Silent corruption</span><span class="v">Data damage that changes a file's content without changing its size or modified-time — invisible to anything that only checks metadata.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>YYYY-MM-DD_slug</code> with five fixed subfolders sorts itself and answers "which shoot, what about it, touched or original" without opening a single file.</li>
<li>A short bash script with <code>\${1:?message}</code> parameter checks builds the tree in one command and fails loudly instead of guessing.</li>
<li>A finished progress bar is not proof of a correct copy — only comparing content hashes (<code>shasum -a 256</code>, or rsync's <code>--checksum</code> flag) is.</li>
<li>This lesson deliberately corrupted a file and proved, with real output, that plain <code>rsync -av</code> misses a same-size same-timestamp corruption that <code>--checksum</code> catches.</li>
<li>Don't rename every clip by hand — editing software reads embedded timecodes; a trustworthy folder name matters more than a pretty file name.</li>
</ul>
<div class="link-card"><a href="https://man7.org/linux/man-pages/man1/rsync.1.html" target="_blank" rel="noopener">man7.org — rsync manual page (the real meaning of --checksum)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Một cái tên thư mục mà sáu tháng sau bạn vẫn hiểu được</h2>
<p class="lead">Thứ Ba bạn quay vlog bằng Pocket 3, thứ Năm quay phỏng vấn bằng iPhone, thứ Bảy quay màn hình cho một bài giảng. Đổ cả ba vào một thư mục Desktop tên "footage" thì tháng sau bạn không phân biệt nổi clip nào của dự án nào nếu không mở từng file ra xem. Bài này cho bạn một cấu trúc thư mục tự sắp xếp, một script dựng nó bằng một lệnh, và một cách đổ thẻ THẬT SỰ chứng minh được không có gì hỏng dọc đường — không chỉ là một thanh tiến trình chạy tới 100%.</p>

<h3>Một thư mục cho mỗi buổi quay, đặt tên để hệ thống tự sắp xếp giúp bạn</h3>
<p>Cấu trúc khoá này dùng là <code>YYYY-MM-DD_slug</code> — ngày tháng đứng trước (để thứ tự chữ cái mặc định của Finder/Explorer cũng chính là thứ tự thời gian, không cần thêm thao tác nào), rồi tới một slug ngắn mô tả buổi quay. Bên trong là năm thư mục con cố định: <code>01_footage</code> (file gốc từ máy quay, KHÔNG BAO GIỜ sửa trực tiếp trong đó), <code>02_audio</code> (âm thanh ghi rời, vd DJI Mic), <code>03_project</code> (file dự án của phần mềm dựng), <code>04_export</code> (bản dựng cuối), <code>05_thumbnail</code> (ảnh đại diện). Bản thân <code>01_footage</code> lại chia theo máy quay — <code>A-cam</code> cho góc chính, <code>B-cam</code> cho góc phụ — điều này có ý nghĩa ngay khi bạn quay Pocket 3 và iPhone cùng lúc cho một bản dựng đa máy (Chương 13.3).</p>
${slide('cr-11', 3, 'Cấu trúc thư mục dự án')}
<p>Vì sao đúng hình dạng này chứ không phải cái gì đơn giản hơn? Vì mỗi phần của nó trả lời đúng một câu hỏi thật bạn sẽ tự hỏi mình vài tuần sau: "buổi quay này thuộc về đâu" (ngày tháng), "buổi quay này về cái gì" (slug), "đây là bản gốc hay thứ mình đã động vào rồi" (<code>01_footage</code> giữ nguyên mãi mãi — bất cứ thứ gì bạn tạo ra từ nó, như một bản proxy, sống ở một chỗ khác, có thể xoá được, bạn sẽ gặp ở Bài 11.4).</p>

<h3>Một script dựng cả cây thư mục bằng một lệnh</h3>
<p>Gõ tay tám lệnh <code>mkdir</code> mỗi buổi quay đúng là kiểu ma sát khiến người ta bỏ luôn việc sắp xếp. Đây là một script — đã chạy thử THẬT trên máy này — nhận vào một ngày và một slug rồi dựng cả cây chỉ trong một lệnh:</p>
<pre><code class="language-bash">#!/usr/bin/env bash
# tao-du-an.sh — tạo cây thư mục dự án theo chuẩn YYYY-MM-DD_slug
set -euo pipefail
NGAY="\${1:?thiếu ngày, dạng YYYY-MM-DD}"
SLUG="\${2:?thiếu slug, chữ thường nối gạch ngang}"
GOC="\${NGAY}_\${SLUG}"

mkdir -p "$GOC"/01_footage/{A-cam,B-cam} "$GOC"/{02_audio,03_project,04_export,05_thumbnail}
echo "Đã tạo: $GOC"</code></pre>
<p>Chạy thật, output thật:</p>
<pre><code class="language-bash">./tao-du-an.sh "2026-09-22" "vlog-thu-vien-fptu"
find 2026-09-22_vlog-thu-vien-fptu | sort</code></pre>
<div class="out">Đã tạo: 2026-09-22_vlog-thu-vien-fptu
2026-09-22_vlog-thu-vien-fptu
2026-09-22_vlog-thu-vien-fptu/01_footage
2026-09-22_vlog-thu-vien-fptu/01_footage/A-cam
2026-09-22_vlog-thu-vien-fptu/01_footage/B-cam
2026-09-22_vlog-thu-vien-fptu/02_audio
2026-09-22_vlog-thu-vien-fptu/03_project
2026-09-22_vlog-thu-vien-fptu/04_export
2026-09-22_vlog-thu-vien-fptu/05_thumbnail</div>
<p>Cú pháp <code>\${1:?thông báo}</code> không phải để trang trí — chạy script mà thiếu tham số, bash TỪ CHỐI đoán mò:</p>
<div class="out">./tao-du-an.sh: line 5: 2: thiếu slug, chữ thường nối gạch ngang</div>
<p>Đó là <code>set -euo pipefail</code> cộng với giá trị mặc định kiểu báo lỗi đang làm việc thật: một script BÁO LỖI TO khi dữ liệu vào sai còn hơn một script âm thầm tạo ra thư mục mang tên chuỗi rỗng.</p>

<h3>Sao chép có kiểm toàn vẹn — bước gần như ai cũng bỏ qua</h3>
${slide('cr-11', 4, 'Sao chép có kiểm toàn vẹn')}
<p>Một thanh tiến trình chạy tới cuối chỉ nói cho bạn biết việc sao chép đã XONG. Nó không nói cho bạn biết bản sao đó có ĐÚNG hay không — một sợi cáp USB chập chờn, một đầu đọc thẻ sắp hỏng, hay một ổ đĩa có sector lỗi đều có thể lật một bit dữ liệu một cách âm thầm, mà kích thước và ngày-giờ sửa đổi của file vẫn giữ nguyên y hệt. Nên thay vì tin vào "đã xong", ta kiểm NỘI DUNG:</p>
<pre><code class="language-bash">rsync -av --checksum "$PROJ/" "$BACKUP/"
( cd "$PROJ" && find . -type f | sort | xargs shasum -a 256 ) > checksum-goc.txt
( cd "$BACKUP" && find . -type f | sort | xargs shasum -a 256 ) > checksum-backup.txt
diff checksum-goc.txt checksum-backup.txt && echo "KHỚP TUYỆT ĐỐI"</code></pre>
<p><code>--checksum</code> bảo rsync so sánh file bằng cách băm (hash) đúng NỘI DUNG của nó, thay vì phép đoán rẻ tiền "cùng kích thước, cùng ngày-giờ" mà nó dùng mặc định. <code>shasum -a 256</code> sau đó cho bạn một bằng chứng độc lập, đọc được bằng mắt, rằng hai bên khớp nhau. Để bạn không phải tin lời tôi, tôi đã CỐ TÌNH làm hỏng một byte trong một clip thử đã copy, nặng 1.057.547 byte — cùng kích thước, cùng ngày-giờ sửa đổi với bản gốc, đúng y hệt cách một lỗi hỏng âm thầm thật sự trông như thế nào:</p>
<pre><code class="language-bash"># rsync THƯỜNG (không --checksum) — chỉ so size + mtime
rsync -av "$PROJ/" "$BACKUP/"</code></pre>
<div class="out">sent 777 bytes  received 20 bytes  724545 bytes/sec
total size is 3080867  speedup is 3865.57</div>
<p>Không có byte nội dung nào được gửi cho file đã hỏng — rsync thường thấy size và ngày-giờ khớp nhau và kết luận, SAI, rằng không cần copy gì thêm. Bản sao lưu bị hỏng vẫn tiếp tục hỏng. Đây là thứ <code>shasum -a 256</code> bắt được mà cả thanh tiến trình lẫn rsync thường đều bỏ lỡ:</p>
<div class="out">1c1
&lt; a6d7695cdfc02ead128e3d6e0492bbf105772223f2aa0bf36e3e599a17dfe6cf  ./01_footage/A-cam/A001_C001_0922XY.MP4
---
&gt; 8caad14ead7d76484abeed109c7895d003b2d5cb70809d44acbdebf99fa9f8e9  ./01_footage/A-cam/A001_C001_0922XY.MP4</div>
<p>Hai hash hoàn toàn khác nhau cho một file "trông" y hệt nếu chỉ kiểm metadata. Chạy lại đúng <code>rsync -av --checksum</code> một lần nữa sẽ đọc đúng từng byte, phát hiện lệch dù size/mtime vẫn khớp, và gửi lại CHÍNH XÁC file đó — 1.058.626 byte, đúng bằng kích thước clip thật — cho tới khi hash khớp lại. Đó là toàn bộ giá trị của <code>--checksum</code> gói trong một lần minh hoạ: nó là chế độ DUY NHẤT của rsync bắt được lỗi này.</p>
<div class="callout warn"><p><strong>Quy tắc thực dụng:</strong> dùng <code>--checksum</code> cho lần đổ thẻ nhớ MỘT LẦN (đúng quan trọng hơn nhanh, với vài chục GB thì chậm thêm vài giây không đáng gì), và bỏ qua nó cho việc đồng bộ lại hằng ngày một kho lưu trữ khổng lồ, nơi phép đoán nhanh mặc định thường đã đủ tốt còn băm toàn bộ nội dung mỗi lần sẽ quá chậm.</p></div>

<h3>Đổi tên hàng loạt, nói ngắn gọn</h3>
<p>Tên file máy quay kiểu <code>A001_C001_0922XY.MP4</code> trông rối mắt, nhưng đừng cố đổi tên từng clip bằng tay: cả Resolve lẫn CapCut đều đọc được timecode và ngày tạo nhúng sẵn trong file bất kể tên gọi, còn tên THƯ MỤC nhất quán (bạn đã có rồi) quan trọng hơn hẳn một cái tên file đẹp. Nếu thật sự cần đổi tên hàng loạt — ví dụ thêm tiền tố ngày quay vào mọi file trong một thư mục — một vòng lặp ngắn làm được việc mà không cần cài thêm app nào: <code>for f in *.MP4; do mv "$f" "2026-09-22_$f"; done</code> chạy từ bên trong thư mục đó. Để dành công cụ đổi tên thật sự cho lúc bạn có hàng trăm file từ nhiều thẻ nhớ cùng ngày và cần xen kẽ chúng theo dấu thời gian — đó là bài toán đa máy của Chương 13, không phải của Chương 11.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin "đã copy xong" là bằng chứng của một bản sao tốt.</strong> Minh hoạ ở trên không phải một tình huống hiếm bịa ra cho bài học: hub USB-C, đầu đọc thẻ rẻ tiền, và cáp cũ đều tạo ra đúng kiểu lỗi này — một file trông đầy đủ (đúng kích thước, đúng tên, phát vài giây đầu vẫn ổn) nhưng có một khung hình hỏng hoặc tiếng rè giấu đâu đó bên trong. Cách phòng thủ duy nhất bắt được nó là so sánh hash nội dung, không phải nhìn thanh tiến trình.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 11.2 biến "một bản sao đã kiểm" thành một kế hoạch sao lưu 3-2-1 đầy đủ — vì ngay cả một bản sao đã kiểm hoàn hảo trên MỘT ổ đĩa vẫn chỉ cách "mất trắng" đúng một lần làm rơi túi.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Viết phiên bản <code>tao-du-an.sh</code> của riêng bạn (hoặc chép lại script trên) và chạy cho một buổi quay sắp tới thật — xác nhận cây thư mục bằng <code>find</code> hoặc <code>tree</code>.</li>
<li>Đổ một thẻ nhớ thật hoặc một thư mục clip thật bằng <code>rsync -av --checksum</code> vào một chỗ khác, trên một ổ khác.</li>
<li>Chạy <code>shasum -a 256</code> cả hai bên rồi diff kết quả — xác nhận bạn thấy "không khác biệt gì", không chỉ "nhìn có vẻ giống".</li>
<li>Không bắt buộc nhưng nên làm một lần: cố tình lật một byte trong bản sao của một file thử bỏ đi (<code>printf</code> + <code>dd</code>, đúng cách bài này đã làm) và xem rsync thường bỏ sót còn shasum bắt được.</li>
</ol><p><strong>Đạt khi:</strong> bạn có một cây thư mục thật do chính script của mình dựng, và một cặp bản sao thật mà bạn đã TỰ TAY đối chiếu SHA-256 — không phải đoán.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Ingest (nhập liệu)</span><span class="v">Hành động sao chép cảnh quay từ máy quay hoặc thẻ nhớ vào ổ lưu trữ làm việc.</span></div>
<div class="kv"><span class="k">Checksum / hash</span><span class="v">Một "vân tay" ngắn tính từ đúng nội dung của file — hai file cùng hash là giống nhau tuyệt đối từng byte; hash khác nhau chứng minh chúng KHÔNG giống nhau.</span></div>
<div class="kv"><span class="k">rsync --checksum</span><span class="v">Cờ ép rsync so sánh nội dung file bằng hash, thay vì phép đoán nhanh mặc định dựa trên kích thước + ngày-giờ.</span></div>
<div class="kv"><span class="k">Lỗi hỏng âm thầm</span><span class="v">Dữ liệu bị hỏng mà không đổi kích thước hay ngày-giờ sửa đổi của file — vô hình với bất cứ thứ gì chỉ kiểm metadata.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>YYYY-MM-DD_slug</code> cùng năm thư mục con cố định tự sắp xếp và trả lời "buổi nào, về gì, gốc hay đã động vào" mà không cần mở một file nào.</li>
<li>Một script bash ngắn với kiểm tham số <code>\${1:?thông báo}</code> dựng cả cây bằng một lệnh, và báo lỗi to thay vì đoán mò.</li>
<li>Thanh tiến trình chạy xong KHÔNG phải bằng chứng của một bản sao đúng — chỉ so sánh hash nội dung (<code>shasum -a 256</code>, hay cờ <code>--checksum</code> của rsync) mới là bằng chứng thật.</li>
<li>Bài này cố tình làm hỏng một file và chứng minh, bằng output thật, rằng rsync thường bỏ sót lỗi hỏng cùng-kích-thước-cùng-ngày-giờ mà <code>--checksum</code> bắt được.</li>
<li>Đừng đổi tên từng clip bằng tay — phần mềm dựng đọc timecode nhúng sẵn; một tên THƯ MỤC đáng tin quan trọng hơn một tên file đẹp.</li>
</ul>
<div class="link-card"><a href="https://man7.org/linux/man-pages/man1/rsync.1.html" target="_blank" rel="noopener">man7.org — trang hướng dẫn rsync (ý nghĩa thật của --checksum)</a></div>
</div>
`,
    },

    /* ─────────────────── 11.2 sao lưu 3-2-1 ─────────────────── */
    {
      title: '11.2 — The 3-2-1 backup rule for your own gear|||11.2 — Luật sao lưu 3-2-1 cho đúng đồ nghề của bạn',
      slug: 'cr-11-2-sao-luu-3-2-1',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Luật sao lưu 3-2-1 áp vào đúng SSD, HDD và máy Linux ở nhà bạn đang có — giữ gì, xoá gì sau khi đăng, và cách kiểm tra một bản sao qua mạng mà KHÔNG cần chạy lệnh nguy hiểm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>3-2-1 is not a superstition — it is three specific failure modes, covered</h2>
<p class="lead">A verified copy from Lesson 11.1 protects you from one failure: a bad transfer. It does nothing for a stolen laptop, a dropped SSD, a dead drive, or a burglary. The 3-2-1 rule exists because storage fails in a small number of distinct ways, and each part of the rule blocks exactly one of them. Mapped onto the gear you already own, it costs you almost nothing extra to follow.</p>

<h3>Three numbers, three different failures</h3>
${slide('cr-11', 6, 'Sao lưu 3-2-1')}
<p><strong>3 copies</strong> means the original is never the only copy — one working copy plus at least two backups. <strong>2 different media types</strong> means not two SSDs from the same batch, because a manufacturing defect or a firmware bug can take out an entire model line at once; pairing an SSD with a spinning HDD (or a different brand/generation entirely) means a single flaw cannot kill both. <strong>1 copy offsite</strong> — physically somewhere else — is the one people skip, and the one that actually matters most: a fire, flood, or theft at your desk takes out every drive sitting next to each other, no matter how many of them there are.</p>
<p>Mapped onto your own kit: <strong>copy 1</strong> is your working SSD (fast, plugged into the Mac while you edit). <strong>Copy 2</strong> is a second drive of a different type — an HDD is the classic choice specifically because it is cheap per terabyte and a different failure profile than flash storage. <strong>Copy 3</strong> is the one that has to leave your desk: your home Linux machine, if it is not sitting on the exact same desk as the other two, or genuinely offsite cloud storage.</p>

<h3>What actually goes offsite, and how often</h3>
<p>You do not need to sync every single project to the Linux machine the moment you finish shooting — that is unrealistic and you will abandon it within a week. Be honest about your real rhythm: sync in batches (say, weekly, or right after you finish a project and are about to delete camera cards), and treat "copy 3 exists" as a checklist item at the end of each edit, not a background job you assume is running. A backup plan you do not actually follow is not a backup plan.</p>
<div class="callout warn"><p><strong>Copying to a machine over the network is out of scope for hands-on practice in this lesson</strong> — this course never runs SSH or network rsync against another machine from inside a lesson, for the same reason it never SSHes into the VPS without explicit intent: a command aimed at the wrong host is a mistake you cannot always undo. Here is the shape of the real command you would run to sync a project to a Linux machine on your home network, shown with <code>-n</code> (dry-run) so it only prints what it WOULD do:</p></div>
<pre><code class="language-bash">rsync -avn --checksum ./2026-09-22_vlog-thu-vien-fptu/ user@may-linux-nha:/data/backup/2026-09-22_vlog-thu-vien-fptu/</code></pre>
<p>Drop the <code>n</code> only once you have read the dry-run output and confirmed it lists exactly the files you expect — and only when you are actually on your home network with that machine actually reachable, not by habit.</p>

<h3>Keep or delete — a decision you make once per project, not per file</h3>
${slide('cr-11', 7, 'Giữ gì, xoá gì sau khi đăng')}
<p>Storage fills up, and "keep everything forever" is not a real plan on any of your drives. Once a video is published: keep the edit project file, the selected clips actually used in the final cut, the final export, any purchased music/SFX, and your own color LUTs/presets — these are small and hard to recreate. Reconsider deleting failed/duplicate/shaky takes, spent proxy files, and eventually the camera originals themselves — but only once you are certain at least one other verified copy exists; "I think it's backed up" is not certainty, a diffed <code>shasum</code> output like Lesson 11.1's is.</p>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 11.3 assumes you now have safely-stored footage and asks the next real question — which software actually opens it and turns it into a finished video.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Write down your own 3-2-1 mapping: which drive is copy 1, which is copy 2 (and what type is it — is it genuinely different from copy 1?), and what serves as copy 3.</li>
<li>If your home Linux machine is copy 3, write the real <code>rsync -n</code> dry-run command for your own setup (hostname, path) and read through what it would transfer — do not run it unless you are actually on that network right now.</li>
<li>Look at your very first finished project from this course and decide, item by item, what you would keep versus delete under the rule above.</li>
</ol><p><strong>Done when:</strong> you can name your copy 1, 2 and 3 out loud without checking, and you have never gone a week with only one copy of footage you cannot re-shoot.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">3-2-1 rule</span><span class="v">3 copies of your data, on 2 different types of media, with 1 copy offsite.</span></div>
<div class="kv"><span class="k">Offsite</span><span class="v">Ở nơi khác — physically separate from your main working location, so one disaster cannot destroy every copy at once.</span></div>
<div class="kv"><span class="k">Dry-run (-n)</span><span class="v">An rsync flag that prints what WOULD be transferred without actually copying anything — the safe way to preview a command before running it for real.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>3-2-1 blocks three separate failure modes: a bad copy (verification, Lesson 11.1), a single drive dying (2 copies), and a local disaster wiping every drive at once (1 offsite copy).</li>
<li>Two SSDs from the same batch are not "2 different media" in the spirit of the rule — pair flash storage with spinning storage, or at least a different brand/generation.</li>
<li>Your home Linux machine is a realistic copy 3 if it is genuinely not sitting next to your other drives.</li>
<li>Always preview a network copy with <code>rsync -n</code> (dry-run) before running it for real — and never aim rsync/SSH at another machine as a reflex.</li>
<li>Keep project files, selects, final exports, and licensed assets; reconsider camera originals only once a second verified copy genuinely exists.</li>
</ul>
<div class="link-card"><a href="https://www.backblaze.com/blog/the-3-2-1-backup-strategy/" target="_blank" rel="noopener">Backblaze — the 3-2-1 backup strategy explained</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>3-2-1 không phải mê tín — đó là ba kiểu hỏng cụ thể, mỗi kiểu có một lớp chắn</h2>
<p class="lead">Một bản sao đã kiểm ở Bài 11.1 bảo vệ bạn khỏi ĐÚNG MỘT kiểu hỏng: một lần copy lỗi. Nó không giúp gì nếu laptop bị mất trộm, SSD rơi vỡ, ổ đĩa chết, hay nhà bị trộm. Luật 3-2-1 tồn tại vì lưu trữ hỏng theo một số kiểu nhất định, và mỗi phần của luật chặn đúng một kiểu trong số đó. Áp vào đúng đồ nghề bạn đã có sẵn, nó gần như không tốn thêm chi phí nào.</p>

<h3>Ba con số, ba kiểu hỏng khác nhau</h3>
${slide('cr-11', 6, 'Sao lưu 3-2-1')}
<p><strong>3 bản sao</strong> nghĩa là bản gốc không bao giờ là bản DUY NHẤT — một bản làm việc cộng ít nhất hai bản sao lưu. <strong>2 loại ổ khác nhau</strong> nghĩa là KHÔNG phải hai SSD cùng lô hàng, vì một lỗi sản xuất hay lỗi firmware có thể "giết" cả một dòng máy cùng lúc; ghép một SSD với một HDD quay cơ (hoặc ít nhất khác hãng/thế hệ hẳn) nghĩa là một lỗi duy nhất không thể giết cả hai. <strong>1 bản ở nơi khác</strong> — thật sự khác về vị trí vật lý — là phần người ta hay bỏ qua nhất, và cũng là phần quan trọng nhất: cháy, ngập nước, hay trộm ở đúng chỗ bạn ngồi sẽ lấy đi MỌI ổ đĩa nằm cạnh nhau, dù bạn có bao nhiêu ổ đi nữa.</p>
<p>Áp vào đúng bộ đồ nghề của bạn: <strong>bản 1</strong> là SSD làm việc (nhanh, cắm vào Mac lúc dựng). <strong>Bản 2</strong> là một ổ khác LOẠI — HDD là lựa chọn kinh điển chính vì nó rẻ trên mỗi terabyte và có hồ sơ lỗi khác hẳn ổ flash. <strong>Bản 3</strong> là bản BẮT BUỘC phải rời khỏi bàn làm việc của bạn: máy Linux ở nhà, nếu nó không nằm chung một bàn với hai bản kia, hoặc một dịch vụ cloud thật sự ở nơi khác.</p>

<h3>Cái gì thật sự đi ra "nơi khác", và tần suất bao nhiêu</h3>
<p>Bạn không cần đồng bộ MỌI dự án tới máy Linux ngay lúc vừa quay xong — điều đó phi thực tế và bạn sẽ bỏ cuộc trong vòng một tuần. Hãy thành thật với nhịp thật của mình: đồng bộ theo đợt (ví dụ hằng tuần, hoặc ngay sau khi xong một dự án và chuẩn bị xoá thẻ nhớ), và coi "bản 3 đã tồn tại chưa" là một mục trong checklist cuối mỗi lần dựng, không phải một việc chạy nền bạn CHỈ GIẢ ĐỊNH là đang chạy. Một kế hoạch sao lưu bạn không thật sự làm theo không phải là kế hoạch sao lưu.</p>
<div class="callout warn"><p><strong>Sao chép tới một máy khác qua mạng nằm NGOÀI phạm vi thực hành của bài này</strong> — khoá này không bao giờ chạy SSH hay rsync qua mạng tới một máy khác từ bên trong một bài học, cùng lý do nó không bao giờ SSH vào VPS khi không có ý định rõ ràng: một lệnh nhắm sai máy là một lỗi không phải lúc nào cũng sửa lại được. Đây là hình dạng của lệnh thật bạn sẽ chạy để đồng bộ một dự án tới máy Linux trong mạng nhà mình, viết kèm <code>-n</code> (dry-run) để nó CHỈ IN RA những gì nó SẼ làm:</p></div>
<pre><code class="language-bash">rsync -avn --checksum ./2026-09-22_vlog-thu-vien-fptu/ user@may-linux-nha:/data/backup/2026-09-22_vlog-thu-vien-fptu/</code></pre>
<p>Chỉ bỏ chữ <code>n</code> khi bạn đã đọc kỹ output dry-run và xác nhận nó liệt kê đúng những file bạn mong đợi — và chỉ khi bạn thật sự đang ở mạng nhà với đúng máy đó đang bật, không phải làm theo thói quen.</p>

<h3>Giữ hay xoá — một quyết định cho cả dự án, không phải từng file</h3>
${slide('cr-11', 7, 'Giữ gì, xoá gì sau khi đăng')}
<p>Ổ đĩa đầy dần, và "giữ mọi thứ mãi mãi" không phải một kế hoạch thật trên bất kỳ ổ nào của bạn. Sau khi video đã đăng: giữ file dự án dựng, những clip ĐÃ CHỌN thật sự dùng trong bản cuối, bản xuất cuối cùng, nhạc/SFX đã mua bản quyền, và LUT/preset màu của riêng bạn — những thứ này nhỏ và khó tạo lại. Cân nhắc xoá cảnh hỏng/trùng/rung, file proxy đã hết cần dùng, và cuối cùng là chính footage gốc — nhưng CHỈ khi bạn chắc chắn có ít nhất một bản sao khác đã kiểm tồn tại; "chắc là có sao lưu rồi" không phải là chắc chắn, một output <code>shasum</code> đã diff như Bài 11.1 mới là chắc chắn.</p>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 11.3 giả định bạn giờ đã có cảnh quay được lưu trữ an toàn, và hỏi câu hỏi thật tiếp theo — phần mềm nào thật sự mở được nó và biến nó thành một video hoàn chỉnh.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết ra sơ đồ 3-2-1 của chính bạn: ổ nào là bản 1, ổ nào là bản 2 (và nó có THẬT SỰ khác loại với bản 1 không?), và cái gì đóng vai bản 3.</li>
<li>Nếu máy Linux ở nhà là bản 3, viết lệnh dry-run <code>rsync -n</code> thật cho đúng thiết lập của bạn (tên máy, đường dẫn) và đọc kỹ nó sẽ chuyển những gì — đừng chạy nó trừ khi bạn thật sự đang ở mạng đó ngay lúc này.</li>
<li>Nhìn lại dự án hoàn chỉnh đầu tiên của bạn từ khoá này và quyết định, từng mục một, cái gì giữ và cái gì xoá theo luật ở trên.</li>
</ol><p><strong>Đạt khi:</strong> bạn gọi tên được bản 1, 2, 3 của mình mà không cần kiểm tra lại, và chưa bao giờ để một tuần trôi qua mà cảnh quay không quay lại được chỉ tồn tại đúng một bản.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Luật 3-2-1</span><span class="v">3 bản sao dữ liệu, trên 2 loại ổ khác nhau, với 1 bản ở nơi khác.</span></div>
<div class="kv"><span class="k">Offsite</span><span class="v">Ở nơi khác — tách biệt vật lý khỏi vị trí làm việc chính, để một thảm hoạ không phá huỷ mọi bản cùng lúc.</span></div>
<div class="kv"><span class="k">Dry-run (-n)</span><span class="v">Cờ của rsync chỉ in ra những gì SẼ được chuyển mà không thật sự copy gì cả — cách an toàn để xem trước một lệnh trước khi chạy thật.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>3-2-1 chặn ba kiểu hỏng riêng biệt: một lần copy lỗi (kiểm toàn vẹn, Bài 11.1), một ổ đĩa chết (2 bản), và một thảm hoạ tại chỗ xoá sạch mọi ổ cùng lúc (1 bản offsite).</li>
<li>Hai SSD cùng lô hàng KHÔNG phải "2 loại ổ khác nhau" theo đúng tinh thần của luật — ghép ổ flash với ổ quay cơ, hoặc ít nhất khác hãng/thế hệ.</li>
<li>Máy Linux ở nhà là một bản 3 thực tế nếu nó thật sự không nằm cạnh các ổ khác của bạn.</li>
<li>Luôn xem trước một lần copy qua mạng bằng <code>rsync -n</code> (dry-run) trước khi chạy thật — và không bao giờ nhắm rsync/SSH vào một máy khác theo phản xạ.</li>
<li>Giữ file dự án, cảnh đã chọn, bản xuất cuối, và tài nguyên có bản quyền; chỉ cân nhắc xoá footage gốc khi một bản sao thứ hai đã kiểm thật sự tồn tại.</li>
</ul>
<div class="link-card"><a href="https://www.backblaze.com/blog/the-3-2-1-backup-strategy/" target="_blank" rel="noopener">Backblaze — giải thích chiến lược sao lưu 3-2-1</a></div>
</div>
`,
    },

    /* ─────────────────── 11.3 chọn phần mềm dựng ─────────────────── */
    {
      title: '11.3 — Choosing your editor: five tools, one decision|||11.3 — Chọn phần mềm dựng: năm lựa chọn, một quyết định',
      slug: 'cr-11-3-chon-phan-mem-dung',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'CapCut, DaVinci Resolve, Final Cut Pro, Premiere Pro, LumaFusion — giá đã kiểm 09/2026, máy nào chạy được, và khuyến nghị cụ thể cho đúng bộ đồ nghề Pocket 3/iPhone/iPad/Mac/Linux của bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Five real options — and you only need to seriously learn two of them</h2>
<p class="lead">"Which editing software should I use" has a different answer for a student with your exact kit than for a generic YouTube tutorial. This lesson is a decision, not a tutorial — pricing and platforms checked directly against official pages this month, then one clear recommendation. Chapter 12 teaches CapCut end to end; Chapter 13 teaches DaVinci Resolve end to end, including your iPad and your Linux machine. This lesson only tells you which one to open first.</p>

<h3>Five tools, checked against their own pricing pages (09/2026)</h3>
${slide('cr-11', 8, 'Bảng so sánh 5 phần mềm dựng')}
<p><strong>CapCut</strong> is free to edit and export in; CapCut Pro adds features like one-click filler-word removal and unlimited watermark-free exports, but CapCut's own help page is explicit that pricing "can vary depending on your region, device, and available promotions" — it does not publish one fixed number, and neither does this lesson. Check the price inside the app before assuming a figure you saw somewhere else is still current.</p>
<p><strong>DaVinci Resolve</strong> Free is, checked directly on Blackmagic's own product page, genuinely free — up to Ultra HD, up to 60fps, 8-bit, no watermark on ordinary exports (Chapter 13.1 covers exactly where its ceiling is). Studio is a one-time <strong>295 USD</strong> license, no subscription.</p>
<p><strong>Final Cut Pro</strong> for Mac is a one-time <strong>299.99 USD</strong> purchase on the Mac App Store — Apple's own page also now offers it bundled into a subscription called <strong>Apple Creator Studio</strong> (12.99 USD/month or 129 USD/year) alongside Logic Pro and Motion. Final Cut Pro for iPad, checked on Apple's own iPad page, is <strong>no longer sold as a separate app purchase</strong> — it is Apple Creator Studio only now (with a cheaper 2.99 USD/month student rate). If you see an older one-time iPad price mentioned anywhere, that page is out of date — re-check apple.com directly before trusting it.</p>
<p><strong>Premiere Pro</strong> starts at <strong>22.99 USD/month</strong> for the single-app plan, paid annually — checked on Adobe's own pricing page.</p>
<p><strong>LumaFusion</strong> is a one-time <strong>29.99 USD</strong> purchase, checked on its own App Store listing — and worth double-checking if you last looked a while ago: it now runs not just on iPad/iPhone/Android/ChromeOS but also natively on Mac, provided the Mac has Apple Silicon (your M1 Max qualifies).</p>
<div class="callout warn"><p><strong>Every price above has a "checked 09/2026" stamp on purpose.</strong> Software pricing moves — bundles get introduced (Apple Creator Studio did not exist a year before this was written), subscriptions replace one-time purchases, and regional pricing means the number you see may not match someone else's screenshot. Re-verify on the vendor's own page before you commit money, not from a course written months ago.</p></div>

<h3>The recommendation for your exact kit</h3>
${slide('cr-11', 9, 'Khuyến nghị theo đồ nghề của bạn')}
<p>You do not need to master five tools. Use <strong>CapCut</strong> when speed matters more than deep color control — short-form content for TikTok/Reels/Shorts, a quick same-day cut. Use <strong>DaVinci Resolve</strong> when a video is long-form and you actually want to grade color (Chapter 15) and mix audio properly (Chapter 16) — and because it is the one editor here that genuinely runs on all three of your non-phone machines: Mac, iPad (with real limits — Chapter 13.4), and your home Linux box (also with real limits — this lesson's Lesson 11.4 and Chapter 13.4 both cover them). Final Cut Pro and Premiere Pro are legitimate, industry-standard tools — worth knowing they exist and what they cost, in case a client or a future job uses them — but neither is required anywhere in this course's own path.</p>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 11.4 covers the one thing that applies no matter which of these five you pick — why your camera-original footage can feel heavy to scrub through, and how a proxy file fixes that.</p>

<h3>🎬 Practice (10 minutes)</h3>
<div class="callout ok"><ol>
<li>Open CapCut and DaVinci Resolve (both free) on your Mac and just look at the interface for two minutes each — do not edit anything yet.</li>
<li>Write one sentence for yourself: for your very next project, which of the two will you actually open, and why (speed vs. color/audio control)?</li>
<li>If you own an iPad, check whether DaVinci Resolve for iPad is installed and confirm which pages (Cut/Color/Deliver/Photo) show up in its interface.</li>
</ol><p><strong>Done when:</strong> you can say, out loud, which single tool you are committing to for your next real project — not "I'll decide later."</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">One-time purchase</span><span class="v">Mua đứt — pay once, own the license for that version's updates, no recurring fee.</span></div>
<div class="kv"><span class="k">Subscription bundle</span><span class="v">A recurring-payment plan that groups several apps together (e.g. Apple Creator Studio grouping Final Cut Pro with Logic Pro and Motion).</span></div>
<div class="kv"><span class="k">Apple Silicon</span><span class="v">Apple's own in-house Mac/iPad chips (M1 and newer) — a growing number of pro apps, including LumaFusion's Mac version, now require this rather than an Intel chip.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>CapCut: free to edit, Pro adds features at a region-dependent price — check in-app, not a remembered number.</li>
<li>DaVinci Resolve: genuinely free with a generous ceiling; Studio is 295 USD one-time.</li>
<li>Final Cut Pro: 299.99 USD one-time on Mac, or bundled into Apple Creator Studio (12.99 USD/mo); iPad is Creator-Studio-only now.</li>
<li>Premiere Pro: from 22.99 USD/month. LumaFusion: 29.99 USD one-time, now on Mac (Apple Silicon) too.</li>
<li>This course's own path: CapCut for short-form speed, DaVinci Resolve for long-form depth and because it alone runs on all three of your non-phone machines.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve" target="_blank" rel="noopener">Blackmagic Design — DaVinci Resolve product page (Free vs Studio pricing)</a></div>
<div class="link-card"><a href="https://www.capcut.com/help/how-much-does-capcut-pro-cost" target="_blank" rel="noopener">CapCut — official answer on why Pro pricing isn't one fixed number</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Năm lựa chọn thật — và bạn chỉ cần học nghiêm túc đúng hai trong số đó</h2>
<p class="lead">"Nên dùng phần mềm dựng nào" có câu trả lời khác nhau cho một sinh viên với đúng bộ đồ nghề như bạn so với một video hướng dẫn chung chung trên YouTube. Bài này là một QUYẾT ĐỊNH, không phải một hướng dẫn thao tác — giá và nền tảng đã kiểm trực tiếp trên trang chính thức tháng này, rồi một khuyến nghị rõ ràng. Chương 12 dạy CapCut từ A tới Z; Chương 13 dạy DaVinci Resolve từ A tới Z, kể cả iPad và máy Linux của bạn. Bài này chỉ nói cho bạn biết nên mở cái nào TRƯỚC.</p>

<h3>Năm công cụ, kiểm trực tiếp trên trang giá của chính họ (09/2026)</h3>
${slide('cr-11', 8, 'Bảng so sánh 5 phần mềm dựng')}
<p><strong>CapCut</strong> dựng và xuất miễn phí; CapCut Pro thêm tính năng như xoá từ đệm một-cú-bấm và xuất không giới hạn không watermark, nhưng chính trang trợ giúp của CapCut nói rõ giá "tuỳ khu vực, thiết bị, và khuyến mãi đang có" — họ KHÔNG niêm yết một mức USD cố định, và bài này cũng không. Kiểm giá ngay trong app trước khi tin vào một con số bạn thấy ở đâu đó khác có còn đúng hay không.</p>
<p><strong>DaVinci Resolve</strong> bản Free, kiểm trực tiếp trên trang sản phẩm của Blackmagic, thật sự miễn phí — tới Ultra HD, tới 60fps, màu 8-bit, không watermark trên bản xuất bình thường (Bài 13.1 nói đúng chỗ trần của nó nằm ở đâu). Studio là giấy phép mua đứt MỘT LẦN <strong>295 USD</strong>, không có thuê bao.</p>
<p><strong>Final Cut Pro</strong> cho Mac là mua đứt một lần <strong>299,99 USD</strong> trên Mac App Store — trang chính thức của Apple giờ cũng có gói thuê bao tên <strong>Apple Creator Studio</strong> (12,99 USD/tháng hoặc 129 USD/năm) gộp chung với Logic Pro và Motion. Final Cut Pro cho iPad, kiểm ngay trên trang iPad của Apple, <strong>KHÔNG còn bán riêng</strong> nữa — giờ chỉ có qua Apple Creator Studio (có mức sinh viên rẻ hơn, 2,99 USD/tháng). Nếu bạn thấy ở đâu đó nhắc tới một mức giá mua đứt cũ cho iPad, trang đó đã lỗi thời — kiểm lại trực tiếp trên apple.com trước khi tin.</p>
<p><strong>Premiere Pro</strong> khởi điểm <strong>22,99 USD/tháng</strong> cho gói một app, trả theo năm — kiểm trên chính trang giá của Adobe.</p>
<p><strong>LumaFusion</strong> mua đứt một lần <strong>29,99 USD</strong>, kiểm trên chính trang App Store của nó — và đáng kiểm lại nếu bạn từng xem trang này một thời gian trước: giờ nó không chỉ chạy trên iPad/iPhone/Android/ChromeOS mà còn chạy được thẳng trên Mac, miễn Mac đó dùng Apple Silicon (M1 Max của bạn đạt chuẩn).</p>
<div class="callout warn"><p><strong>Mọi mức giá ở trên đều có dấu "đã kiểm 09/2026" có chủ đích.</strong> Giá phần mềm thay đổi liên tục — gói mới ra đời (Apple Creator Studio còn chưa tồn tại một năm trước khi bài này được viết), thuê bao thay thế mua đứt, và giá theo khu vực nghĩa là con số bạn thấy có thể không khớp ảnh chụp màn hình của người khác. Kiểm lại trên trang của chính hãng trước khi bỏ tiền ra, đừng tin một khoá học viết từ nhiều tháng trước.</p></div>

<h3>Khuyến nghị cho đúng bộ đồ nghề của bạn</h3>
${slide('cr-11', 9, 'Khuyến nghị theo đồ nghề của bạn')}
<p>Bạn không cần thành thạo cả năm công cụ. Dùng <strong>CapCut</strong> khi tốc độ quan trọng hơn kiểm soát màu sâu — nội dung ngắn cho TikTok/Reels/Shorts, một bản dựng nhanh trong ngày. Dùng <strong>DaVinci Resolve</strong> khi video dài và bạn thật sự muốn chỉnh màu (Chương 15) và mix âm đàng hoàng (Chương 16) — và vì đây là công cụ DUY NHẤT ở đây thật sự chạy được trên cả ba máy không-phải-điện-thoại của bạn: Mac, iPad (có giới hạn thật — Chương 13.4), và máy Linux ở nhà (cũng có giới hạn thật — Bài 11.4 ngay sau đây và Chương 13.4 đều nói tới). Final Cut Pro và Premiere Pro là công cụ hợp lệ, chuẩn ngành — đáng biết chúng tồn tại và giá bao nhiêu, phòng khi một khách hàng hay công việc sau này dùng chúng — nhưng không công cụ nào trong hai cái đó bắt buộc ở bất cứ đâu trong lộ trình của khoá này.</p>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 11.4 nói về đúng MỘT thứ áp dụng bất kể bạn chọn công cụ nào trong năm cái này — vì sao cảnh quay gốc từ máy quay có thể nặng nề khi tua qua tua lại, và một file proxy sửa điều đó thế nào.</p>

<h3>🎬 Thực hành (10 phút)</h3>
<div class="callout ok"><ol>
<li>Mở CapCut và DaVinci Resolve (cả hai đều miễn phí) trên Mac và chỉ nhìn giao diện hai phút mỗi cái — chưa dựng gì cả.</li>
<li>Tự viết một câu: cho dự án sắp tới của bạn, bạn sẽ THẬT SỰ mở cái nào trong hai cái đó, và vì sao (tốc độ hay kiểm soát màu/âm)?</li>
<li>Nếu có iPad, kiểm xem DaVinci Resolve for iPad đã cài chưa và xác nhận đúng những trang nào (Cut/Color/Deliver/Photo) hiện ra trong giao diện của nó.</li>
</ol><p><strong>Đạt khi:</strong> bạn nói được thành lời, đúng MỘT công cụ bạn cam kết dùng cho dự án thật tiếp theo — không phải "để tính sau".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Mua đứt</span><span class="v">One-time purchase — trả một lần, sở hữu giấy phép cho các bản cập nhật của đúng phiên bản đó, không phí định kỳ.</span></div>
<div class="kv"><span class="k">Gói thuê bao</span><span class="v">Subscription bundle — gói trả phí định kỳ gộp nhiều app lại với nhau (vd Apple Creator Studio gộp Final Cut Pro với Logic Pro và Motion).</span></div>
<div class="kv"><span class="k">Apple Silicon</span><span class="v">Dòng chip Mac/iPad do chính Apple thiết kế (M1 trở lên) — ngày càng nhiều app chuyên nghiệp, kể cả bản Mac của LumaFusion, giờ yêu cầu đúng dòng chip này thay vì chip Intel.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>CapCut: dựng miễn phí, Pro thêm tính năng với giá tuỳ khu vực — kiểm ngay trong app, đừng tin một con số nhớ từ trước.</li>
<li>DaVinci Resolve: thật sự miễn phí với trần rất rộng rãi; Studio 295 USD mua đứt một lần.</li>
<li>Final Cut Pro: 299,99 USD mua đứt trên Mac, hoặc gộp trong Apple Creator Studio (12,99 USD/tháng); iPad giờ chỉ còn qua Creator Studio.</li>
<li>Premiere Pro: từ 22,99 USD/tháng. LumaFusion: 29,99 USD mua đứt, giờ có cả trên Mac (Apple Silicon).</li>
<li>Lộ trình của khoá này: CapCut cho tốc độ video ngắn, DaVinci Resolve cho chiều sâu video dài và vì nó là công cụ duy nhất chạy được trên cả ba máy không-điện-thoại của bạn.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve" target="_blank" rel="noopener">Blackmagic Design — trang sản phẩm DaVinci Resolve (giá Free vs Studio)</a></div>
<div class="link-card"><a href="https://www.capcut.com/help/how-much-does-capcut-pro-cost" target="_blank" rel="noopener">CapCut — câu trả lời chính thức vì sao giá Pro không phải một mức cố định</a></div>
</div>
`,
    },

    /* ─────────────────── 11.4 proxy, codec & máy Linux ─────────────────── */
    {
      title: '11.4 — Proxies, codecs, and the Linux machine|||11.4 — Proxy, codec, và máy Linux',
      slug: 'cr-11-4-proxy-codec-linux',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Vì sao dựng thẳng trên H.265 hay giật, proxy/optimized media là gì với tên chức năng thật, và số đo THẬT bằng ffmpeg cho ProRes Proxy/DNxHR LB — dung lượng lẫn tốc độ giải mã.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>"Heavy" does not mean what you think it means</h2>
<p class="lead">Your Pocket 3 footage plays back fine on the camera's own screen and stutters the moment you drop it on an editing timeline. That is not a broken app or a weak computer — it is a genuine mismatch between a codec built to be small on a memory card and a codec built to be fast to scrub through. This lesson measures the difference for real, with ffmpeg, on this machine — including one result that surprised even the numbers this course expected going in.</p>

<h3>Why Long-GOP footage fights your timeline</h3>
${slide('cr-11', 10, 'Vì sao Long-GOP nặng khi dựng')}
<p>H.264 and H.265/HEVC — what Pocket 3 and iPhone both record by default — use what is called <strong>Long-GOP</strong> compression (Group of Pictures): most frames are not complete pictures at all. A P-frame stores only what changed since the previous frame; a B-frame stores changes relative to frames both before and after it. This is exactly why the files from Chapter 5 measured so small — it is a genuinely efficient way to store video. The cost shows up only when you try to <em>edit</em>: jump the playhead to a frame in the middle of a GOP, and the software cannot just decode that one frame — it has to decode the nearest full frame before it and replay every frame in between to reconstruct the one you asked for. Scrub the timeline rapidly, the way editing actually works, and your CPU is repeating that chain constantly.</p>
<p><strong>All-intra</strong> codecs — ProRes and DNxHR, the two this lesson measures — solve this by making every single frame a complete, independently decodable picture. Jump anywhere, and the software decodes exactly one frame. This is not a claim to take on faith — it is measured below.</p>

<h3>Proxy and Optimized Media are not the same thing</h3>
${slide('cr-11', 11, 'Proxy khác Optimized Media')}
<p>Both terms describe "a lighter stand-in for editing," but they behave differently, and this is the real button name in each app, not a paraphrase. In DaVinci Resolve, <strong>Generate Proxy Media</strong> creates a separate, named file at a resolution/codec you choose — portable, shareable, something you can hand to a collaborator or move between machines (including the iPad, via Blackmagic Cloud project sync, per Chapter 13.4). <strong>Generate Optimized Media</strong> instead builds an internal cache file (<code>.dvcc</code>) tied to that exact project — faster to generate, but it does not travel with the project if you copy it to another machine; you would regenerate it there. CapCut on desktop has something similar but much lighter: a <strong>Proxy</strong> toggle under Settings → Performance that only lowers your <em>preview</em> resolution temporarily when the timeline gets heavy — your actual export still renders from the full-quality original, always.</p>

<h3>Measuring it for real: ProRes Proxy and DNxHR LB against an HEVC original</h3>
${slide('cr-11', 12, 'Dung lượng & tốc độ giải mã — đo thật')}
<p>To make this concrete, I generated a synthetic 5-second, 3840×2160, 25fps test clip encoded as H.265 at roughly 100 Mbps — deliberately below Pocket 3's official 130 Mbps ceiling (Chapter 5), to represent an ordinary shoot rather than the absolute maximum — then converted it to both ProRes Proxy and DNxHR LB:</p>
<pre><code class="language-bash">ffmpeg -f lavfi -i "testsrc2=size=3840x2160:rate=25" \\
  -f lavfi -i "sine=frequency=440:sample_rate=48000" \\
  -t 5 -c:v libx265 -preset medium -pix_fmt yuv420p \\
  -b:v 100M -maxrate 100M -bufsize 50M \\
  -c:a aac -b:a 192k -tag:v hvc1 canh-goc_hevc_4k25.mp4

ffmpeg -i canh-goc_hevc_4k25.mp4 -c:v prores_ks -profile:v 0 \\
  -pix_fmt yuv422p10le -c:a pcm_s16le canh-proxy_prores.mov

ffmpeg -i canh-goc_hevc_4k25.mp4 -c:v dnxhd -profile:v dnxhr_lb \\
  -pix_fmt yuv422p -c:a pcm_s16le canh-proxy_dnxhr_lb.mov</code></pre>
<p>Real sizes, measured with <code>ls -l</code> right after:</p>
<div class="out">62187095  canh-goc_hevc_4k25.mp4       (gốc — HEVC Long-GOP)
39472454  canh-proxy_prores.mov        (ProRes Proxy)
94179925  canh-proxy_dnxhr_lb.mov      (DNxHR LB)</div>
<p>Here is the honest, slightly counter-intuitive result: <strong>ProRes Proxy came out 36% lighter</strong> than the HEVC original, while <strong>DNxHR LB came out 51% heavier</strong>. There is no single rule that "proxies are always bigger" — ProRes Proxy is specifically engineered by Apple to be the smallest ProRes tier that still exists, so at a genuinely high camera bitrate it can beat a Long-GOP original on size alone. What is NOT ambiguous is decode speed — the actual reason proxies exist:</p>
<pre><code class="language-bash">/usr/bin/time -p ffmpeg -i canh-goc_hevc_4k25.mp4 -f null -</code></pre>
<div class="out">Gốc HEVC Long-GOP:   real 1.31s
ProRes Proxy:        real 0.56s  (nhanh 2,3×)
DNxHR LB:             real 0.35s  (nhanh 3,7×)</div>
<p>Both proxies decode over twice as fast as the Long-GOP original, exactly matching the mechanism explained above — this is the number that actually predicts a smooth timeline, not file size. Translated to a full hour of shooting at these measured bitrates: the HEVC original runs about 44.7 GB/hour, ProRes Proxy about 28.1 GB/hour, DNxHR LB about 67.4 GB/hour — budget your working drive accordingly, and delete proxies once you no longer need them (Lesson 11.2).</p>
<div class="callout ok"><p><strong>What actually matters when choosing a proxy codec:</strong> pick the one your editing software reads fastest and reads natively without a plugin — DaVinci Resolve and Final Cut Pro both handle ProRes and DNxHR natively on Mac; a lower-bitrate proxy profile (like DNxHR LB or ProRes Proxy) is the right default for a rough cut, reserving a higher-quality proxy tier only if you are judging fine detail.</p></div>

<h3>DaVinci Resolve Free on your Linux machine — the short version</h3>
<p>One specific case where this matters immediately: DaVinci Resolve's <strong>free</strong> edition on Linux cannot decode H.264 or HEVC at all, and AAC audio fails on both editions there (Chapter 6.3 already showed you one real transcode on this exact codec gap). <strong>Rocky Linux 8.6 is the only officially supported distribution</strong> as of this check (09/2026) — Fedora, which your home machine runs, is not on that list; it may still run, unofficially, but "runs" and "officially supported" are different claims. The fix is exactly the workflow measured above: transcode with ffmpeg to ProRes or DNxHR with PCM audio before editing on that machine. Chapter 13.4 covers the full requirement list (GPU, RAM) and the complete 10-step workflow across all three of your machines — this lesson only needed you to know the gap exists and how to route around it.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — assuming "proxy" always means "smaller file."</strong> This lesson's own measurement proves it does not: ProRes Proxy was lighter than the original here, DNxHR LB was heavier. Choosing a proxy codec by guessing at file size is choosing blind — the number that actually matters is decode speed, and the only way to know it is to measure it on your own footage, the way this lesson just did.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Chapter 12 opens CapCut and starts cutting for real; Chapter 13 does the same in DaVinci Resolve, including the full iPad and Linux workflow this lesson only previewed.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Generate your own short 4K test clip with ffmpeg (or use a real clip from your camera) and convert it to ProRes Proxy and DNxHR LB using the commands above.</li>
<li>Compare sizes with <code>ls -l</code> — do not assume this lesson's percentages apply to your own footage; measure your own.</li>
<li>Time the decode of all three files with <code>/usr/bin/time -p ffmpeg -i ten-file.mov -f null -</code> and confirm which one is fastest on your machine.</li>
<li>If you have DaVinci Resolve installed, right-click a clip in the Media Pool and locate both <strong>Generate Proxy Media</strong> and <strong>Generate Optimized Media</strong> — just find them, Chapter 13 teaches when to use each.</li>
</ol><p><strong>Done when:</strong> you can explain, without notes, why a proxy is not guaranteed to be a smaller file but is reliably faster to decode — and you have your own measured numbers to back it up.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Long-GOP</span><span class="v">A compression pattern where most frames only store what changed relative to neighboring frames — small files, expensive to seek within.</span></div>
<div class="kv"><span class="k">All-intra</span><span class="v">Nội khung — every frame is a complete, independently decodable picture (ProRes, DNxHR) — cheap to seek within, usually larger files.</span></div>
<div class="kv"><span class="k">Proxy media</span><span class="v">A separate, portable lightweight stand-in file generated for editing, distinct from the camera original.</span></div>
<div class="kv"><span class="k">Optimized Media</span><span class="v">DaVinci Resolve's internal, non-portable cache file — faster to create than a proxy, but tied to that specific project on that machine.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Long-GOP (H.264/HEVC) is efficient to store but expensive to seek within — most frames depend on neighboring frames to decode.</li>
<li>All-intra codecs (ProRes, DNxHR) make every frame independent — measured here at 2.3× to 3.7× faster to decode than the Long-GOP original.</li>
<li>File size is NOT a reliable predictor: this lesson's own ProRes Proxy came out smaller than the original, while DNxHR LB came out bigger.</li>
<li>Generate Proxy Media (portable file) and Generate Optimized Media (internal cache) are two different real Resolve features — pick based on whether the media needs to travel.</li>
<li>Rocky Linux 8.6 is DaVinci Resolve's only officially supported Linux distribution — Fedora is not on that list; transcode footage before editing on the Linux machine (full detail in Chapter 13.4).</li>
</ul>
<div class="link-card"><a href="https://trac.ffmpeg.org/wiki/Encode/H.265" target="_blank" rel="noopener">FFmpeg Wiki — H.265/HEVC encoding guide</a></div>
<div class="link-card"><a href="https://support.apple.com/en-us/109041" target="_blank" rel="noopener">Apple Support — ProRes on iPhone (all-intra, file size trade-offs)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>"Nặng" không có nghĩa như bạn tưởng</h2>
<p class="lead">Cảnh quay Pocket 3 của bạn phát mượt trên màn hình của chính máy quay, và giật ngay khi thả vào timeline dựng. Đó không phải app hỏng hay máy tính yếu — đó là một sự lệch pha thật giữa một codec sinh ra để NHỎ trên thẻ nhớ và một codec sinh ra để NHANH khi tua qua tua lại. Bài này đo sự khác biệt đó bằng ffmpeg thật, trên chính máy này — kể cả một kết quả khiến chính những con số khoá này dự đoán trước cũng phải bất ngờ.</p>

<h3>Vì sao cảnh quay Long-GOP "chống lại" timeline của bạn</h3>
${slide('cr-11', 10, 'Vì sao Long-GOP nặng khi dựng')}
<p>H.264 và H.265/HEVC — đúng thứ Pocket 3 và iPhone mặc định ghi ra — dùng kiểu nén gọi là <strong>Long-GOP</strong> (Group of Pictures — nhóm ảnh): phần lớn khung hình không phải một bức ảnh hoàn chỉnh. Một khung P chỉ lưu phần THAY ĐỔI so với khung trước; một khung B lưu phần thay đổi so với CẢ khung trước lẫn khung sau nó. Đây chính xác là lý do các file ở Chương 5 đo được nhỏ đến vậy — đó là một cách lưu video thật sự hiệu quả. Cái giá chỉ hiện ra khi bạn thử DỰNG: tua playhead tới một khung ở giữa một GOP, phần mềm không thể chỉ giải mã đúng khung đó — nó phải giải khung đầy đủ gần nhất trước đó rồi phát lại mọi khung ở giữa để dựng lại đúng khung bạn vừa yêu cầu. Tua timeline liên tục, đúng cách dựng phim thật sự diễn ra, và CPU của bạn lặp lại chuỗi đó không ngừng.</p>
<p>Codec <strong>all-intra (nội khung)</strong> — ProRes và DNxHR, hai cái bài này đo — giải quyết điều đó bằng cách biến MỖI khung hình thành một bức ảnh hoàn chỉnh, giải mã độc lập được. Tua tới đâu, phần mềm chỉ giải đúng một khung ở đó. Đây không phải một tuyên bố để tin suông — nó được đo ngay dưới đây.</p>

<h3>Proxy và Optimized Media KHÔNG phải một thứ</h3>
${slide('cr-11', 11, 'Proxy khác Optimized Media')}
<p>Cả hai từ đều mô tả "một bản thay thế nhẹ hơn để dựng", nhưng chúng hoạt động khác nhau, và đây là đúng tên nút bấm thật trong từng app, không phải diễn giải lại. Trong DaVinci Resolve, <strong>Generate Proxy Media</strong> tạo một file RIÊNG, có tên, ở độ phân giải/codec bạn tự chọn — di động được, chia sẻ được, thứ bạn có thể trao cho người cộng tác hay mang qua máy khác (kể cả iPad, qua đồng bộ dự án Blackmagic Cloud, theo Chương 13.4). <strong>Generate Optimized Media</strong> thay vào đó dựng một file cache NỘI BỘ (<code>.dvcc</code>) gắn chặt với đúng dự án đó — tạo nhanh hơn, nhưng không đi theo dự án nếu bạn copy nó sang máy khác; bạn sẽ phải tạo lại ở đó. CapCut trên máy tính có thứ tương tự nhưng nhẹ hơn nhiều: một công tắc <strong>Proxy</strong> trong Settings → Performance chỉ giảm độ phân giải XEM TRƯỚC tạm thời khi timeline nặng — bản xuất thật của bạn vẫn luôn dựng từ bản gốc full chất lượng.</p>

<h3>Đo thật: ProRes Proxy và DNxHR LB so với bản HEVC gốc</h3>
${slide('cr-11', 12, 'Dung lượng & tốc độ giải mã — đo thật')}
<p>Để cụ thể hoá điều này, tôi tạo một clip thử tổng hợp 5 giây, 3840×2160, 25fps, mã hoá H.265 ở khoảng 100 Mbps — cố tình đặt DƯỚI trần chính thức 130 Mbps của Pocket 3 (Chương 5), để mô phỏng một buổi quay bình thường chứ không phải mức tối đa tuyệt đối — rồi chuyển nó sang cả ProRes Proxy lẫn DNxHR LB:</p>
<pre><code class="language-bash">ffmpeg -f lavfi -i "testsrc2=size=3840x2160:rate=25" \\
  -f lavfi -i "sine=frequency=440:sample_rate=48000" \\
  -t 5 -c:v libx265 -preset medium -pix_fmt yuv420p \\
  -b:v 100M -maxrate 100M -bufsize 50M \\
  -c:a aac -b:a 192k -tag:v hvc1 canh-goc_hevc_4k25.mp4

ffmpeg -i canh-goc_hevc_4k25.mp4 -c:v prores_ks -profile:v 0 \\
  -pix_fmt yuv422p10le -c:a pcm_s16le canh-proxy_prores.mov

ffmpeg -i canh-goc_hevc_4k25.mp4 -c:v dnxhd -profile:v dnxhr_lb \\
  -pix_fmt yuv422p -c:a pcm_s16le canh-proxy_dnxhr_lb.mov</code></pre>
<p>Dung lượng thật, đo bằng <code>ls -l</code> ngay sau đó:</p>
<div class="out">62187095  canh-goc_hevc_4k25.mp4       (gốc — HEVC Long-GOP)
39472454  canh-proxy_prores.mov        (ProRes Proxy)
94179925  canh-proxy_dnxhr_lb.mov      (DNxHR LB)</div>
<p>Đây là kết quả thật, hơi ngược trực giác: <strong>ProRes Proxy nhẹ hơn bản gốc HEVC tới 36%</strong>, trong khi <strong>DNxHR LB nặng hơn tới 51%</strong>. KHÔNG có một luật duy nhất kiểu "proxy luôn nặng hơn" — ProRes Proxy được chính Apple thiết kế là bậc ProRes nhẹ nhất còn tồn tại, nên ở một bitrate máy quay thật sự cao, nó có thể thắng một bản gốc Long-GOP về dung lượng. Thứ KHÔNG mơ hồ chút nào là tốc độ giải mã — lý do THẬT SỰ proxy tồn tại:</p>
<pre><code class="language-bash">/usr/bin/time -p ffmpeg -i canh-goc_hevc_4k25.mp4 -f null -</code></pre>
<div class="out">Gốc HEVC Long-GOP:   real 1.31s
ProRes Proxy:        real 0.56s  (nhanh 2,3×)
DNxHR LB:             real 0.35s  (nhanh 3,7×)</div>
<p>Cả hai proxy đều giải mã nhanh hơn gấp đôi bản gốc Long-GOP, khớp chính xác với cơ chế đã giải thích ở trên — đây mới là con số thật sự dự đoán được một timeline mượt, không phải dung lượng file. Quy đổi ra một giờ quay ở đúng các bitrate đo được này: bản gốc HEVC tốn khoảng 44,7 GB/giờ, ProRes Proxy khoảng 28,1 GB/giờ, DNxHR LB khoảng 67,4 GB/giờ — tính chỗ trống ổ làm việc theo đúng con số này, và xoá proxy ngay khi hết cần (Bài 11.2).</p>
<div class="callout ok"><p><strong>Thứ thật sự quan trọng khi chọn codec proxy:</strong> chọn đúng cái phần mềm dựng của bạn đọc NHANH NHẤT và đọc được NGAY, không cần plugin — cả DaVinci Resolve lẫn Final Cut Pro đều đọc ProRes và DNxHR thẳng trên Mac; một bậc proxy bitrate thấp (như DNxHR LB hay ProRes Proxy) là mặc định đúng cho một bản dựng thô, để dành bậc proxy chất lượng cao hơn cho lúc bạn cần soi chi tiết nhỏ.</p></div>

<h3>DaVinci Resolve Free trên máy Linux của bạn — bản ngắn gọn</h3>
<p>Một trường hợp cụ thể mà điều này ảnh hưởng ngay lập tức: bản <strong>miễn phí</strong> của DaVinci Resolve trên Linux hoàn toàn không giải mã được H.264 hay HEVC, và audio AAC hỏng trên cả hai bản ở đó (Chương 6.3 đã cho bạn thấy một lần chuyển mã thật đúng lỗ hổng codec này rồi). <strong>Rocky Linux 8.6 là distro CHÍNH THỨC DUY NHẤT</strong> được hỗ trợ tính tới lần kiểm này (09/2026) — Fedora, thứ máy ở nhà bạn đang chạy, KHÔNG nằm trong danh sách đó; nó có thể vẫn chạy được, không chính thức, nhưng "chạy được" và "được hỗ trợ chính thức" là hai tuyên bố khác nhau. Cách sửa chính xác là đúng quy trình vừa đo ở trên: chuyển mã bằng ffmpeg sang ProRes hoặc DNxHR kèm audio PCM trước khi dựng trên máy đó. Chương 13.4 nói đầy đủ danh sách yêu cầu (GPU, RAM) và quy trình 10 bước trọn vẹn trên cả ba máy của bạn — bài này chỉ cần bạn biết lỗ hổng đó tồn tại và cách đi vòng qua nó.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — mặc định "proxy" luôn nghĩa là "file nhỏ hơn".</strong> Chính phép đo của bài này chứng minh điều ngược lại: ProRes Proxy ở đây nhẹ hơn bản gốc, DNxHR LB thì nặng hơn. Chọn codec proxy bằng cách ĐOÁN dung lượng file là chọn mù — con số thật sự quan trọng là tốc độ giải mã, và cách duy nhất để biết nó là ĐO trên chính cảnh quay của bạn, đúng cách bài này vừa làm.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Chương 12 mở CapCut ra và bắt đầu cắt dựng thật; Chương 13 làm điều tương tự trong DaVinci Resolve, kể cả quy trình đầy đủ trên iPad và máy Linux mà bài này mới chỉ xem trước.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Tự tạo một clip thử 4K ngắn bằng ffmpeg (hoặc dùng một clip thật từ máy quay của bạn) rồi chuyển sang ProRes Proxy và DNxHR LB bằng các lệnh ở trên.</li>
<li>So dung lượng bằng <code>ls -l</code> — đừng giả định phần trăm của bài này áp dụng cho cảnh quay của bạn; đo đúng của bạn.</li>
<li>Đo thời gian giải mã cả ba file bằng <code>/usr/bin/time -p ffmpeg -i ten-file.mov -f null -</code> và xác nhận cái nào nhanh nhất trên máy bạn.</li>
<li>Nếu đã cài DaVinci Resolve, chuột phải một clip trong Media Pool và tìm cả <strong>Generate Proxy Media</strong> lẫn <strong>Generate Optimized Media</strong> — chỉ cần tìm thấy chúng, Chương 13 dạy khi nào dùng cái nào.</li>
</ol><p><strong>Đạt khi:</strong> bạn giải thích được, không cần xem lại ghi chú, vì sao proxy không chắc chắn là file nhỏ hơn nhưng chắc chắn giải mã nhanh hơn — và bạn có con số đo được của chính mình để chứng minh.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Long-GOP</span><span class="v">Kiểu nén mà phần lớn khung hình chỉ lưu phần thay đổi so với khung lân cận — file nhỏ, tốn kém khi tua tới giữa chừng.</span></div>
<div class="kv"><span class="k">All-intra (nội khung)</span><span class="v">Mỗi khung hình là một bức ảnh hoàn chỉnh, giải mã độc lập (ProRes, DNxHR) — tua tới đâu cũng rẻ, thường file lớn hơn.</span></div>
<div class="kv"><span class="k">Proxy media</span><span class="v">Một file thay thế RIÊNG, nhẹ, di động được, tạo ra để dựng, tách biệt với bản gốc từ máy quay.</span></div>
<div class="kv"><span class="k">Optimized Media</span><span class="v">File cache NỘI BỘ của DaVinci Resolve, không di động được — tạo nhanh hơn proxy, nhưng gắn chặt với đúng dự án trên đúng máy đó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Long-GOP (H.264/HEVC) hiệu quả để LƯU nhưng tốn kém khi TUA — phần lớn khung hình phụ thuộc vào khung lân cận để giải mã.</li>
<li>Codec all-intra (ProRes, DNxHR) biến mỗi khung độc lập — đo được ở đây nhanh hơn 2,3× tới 3,7× so với bản gốc Long-GOP.</li>
<li>Dung lượng file KHÔNG phải chỉ báo đáng tin: ProRes Proxy của chính bài này nhẹ hơn bản gốc, còn DNxHR LB thì nặng hơn.</li>
<li>Generate Proxy Media (file di động) và Generate Optimized Media (cache nội bộ) là hai tính năng thật khác nhau của Resolve — chọn theo việc media có cần di chuyển hay không.</li>
<li>Rocky Linux 8.6 là distro Linux DUY NHẤT DaVinci Resolve hỗ trợ chính thức — Fedora không nằm trong danh sách; chuyển mã cảnh quay trước khi dựng trên máy Linux (chi tiết đầy đủ ở Chương 13.4).</li>
</ul>
<div class="link-card"><a href="https://trac.ffmpeg.org/wiki/Encode/H.265" target="_blank" rel="noopener">FFmpeg Wiki — hướng dẫn mã hoá H.265/HEVC</a></div>
<div class="link-card"><a href="https://support.apple.com/en-us/109041" target="_blank" rel="noopener">Apple Support — ProRes trên iPhone (all-intra, đánh đổi dung lượng)</a></div>
</div>
`,
    },

    /* ─────────────────── 11.5 Kiểm tra chương ─────────────────── */
    {
      title: '11.5 — Chapter 11 check|||11.5 — Kiểm tra chương 11',
      slug: 'cr-11-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: '10 câu tình huống: đặt tên & sao chép có kiểm toàn vẹn, luật 3-2-1, chọn phần mềm dựng, và vì sao/khi nào cần proxy.',
      content: `
<div class="ml-en">
<h2>📌 Chapter 11 recap</h2>
<p>Ingest and naming (<code>YYYY-MM-DD_slug</code>, a script to build it, copying verified by content hash, not a progress bar) → the 3-2-1 backup rule mapped onto your own SSD/HDD/Linux machine → choosing between five real editors with prices checked this month → why Long-GOP footage fights your timeline and how a proxy (measured, not assumed) fixes it.</p>
<h3>Self-check before Chapter 12</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Naming</span><span class="v">Can you name your own folder structure and explain why the date goes first?</span></div>
  <div class="kv"><span class="k">Integrity</span><span class="v">Can you explain, with the real numbers from this chapter, why a finished progress bar is not proof of a correct copy?</span></div>
  <div class="kv"><span class="k">3-2-1</span><span class="v">Can you name your own copy 1, 2 and 3 without checking?</span></div>
  <div class="kv"><span class="k">Tool choice</span><span class="v">Do you know which single editor you are opening for your next project, and why?</span></div>
  <div class="kv"><span class="k">Proxy</span><span class="v">Can you explain why a proxy is not guaranteed to be smaller, but is reliably faster to decode?</span></div>
</div>
</div>
<div class="ml-vi">
<h2>📌 Tóm tắt Chương 11</h2>
<p>Nhập liệu & đặt tên (<code>YYYY-MM-DD_slug</code>, một script dựng nó, sao chép được kiểm bằng hash nội dung chứ không phải thanh tiến trình) → luật sao lưu 3-2-1 áp vào đúng SSD/HDD/máy Linux của bạn → chọn giữa năm phần mềm dựng thật với giá đã kiểm tháng này → vì sao cảnh quay Long-GOP chống lại timeline và một proxy (đã đo, không đoán) sửa điều đó thế nào.</p>
<h3>Tự kiểm trước khi sang Chương 12</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đặt tên</span><span class="v">Bạn gọi tên được cấu trúc thư mục của chính mình và giải thích được vì sao ngày tháng đứng trước?</span></div>
  <div class="kv"><span class="k">Toàn vẹn</span><span class="v">Bạn giải thích được, bằng đúng số liệu thật của chương này, vì sao một thanh tiến trình chạy xong không phải bằng chứng của một bản sao đúng?</span></div>
  <div class="kv"><span class="k">3-2-1</span><span class="v">Bạn gọi tên được bản 1, 2, 3 của chính mình mà không cần kiểm tra lại?</span></div>
  <div class="kv"><span class="k">Chọn công cụ</span><span class="v">Bạn biết mình sẽ mở đúng phần mềm dựng nào cho dự án tiếp theo, và vì sao?</span></div>
  <div class="kv"><span class="k">Proxy</span><span class="v">Bạn giải thích được vì sao proxy không chắc nhẹ hơn nhưng chắc chắn giải mã nhanh hơn?</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Bạn quay nhiều buổi trong tuần: vlog bằng Pocket 3 thứ Ba, phỏng vấn bằng iPhone thứ Năm. Cách đặt tên thư mục dự án nào giúp bạn KHÔNG BAO GIỜ lẫn lộn giữa các buổi, kể cả sau vài tháng?|||You shoot several sessions a week: a Pocket 3 vlog on Tuesday, an iPhone interview on Thursday. Which folder-naming approach makes sure you never mix up sessions, even months later?',
            options: [
              'Chỉ theo tên dự án, ví dụ "VlogThuVien"|||Just the project name, e.g. "VlogThuVien"',
              'YYYY-MM-DD_slug, ví dụ "2026-09-22_vlog-thu-vien-fptu"|||YYYY-MM-DD_slug, e.g. "2026-09-22_vlog-thu-vien-fptu"',
              'Theo tên máy quay, ví dụ "Pocket3", "iPhone"|||By camera name, e.g. "Pocket3", "iPhone"',
              'Theo số thứ tự, ví dụ "Buoi1", "Buoi2"|||By sequence number, e.g. "Session1", "Session2"',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Only the date-first format sorts chronologically by default in Finder/Explorer AND tells you both "which shoot" and "what it was about" without opening a file. Project-name-only and sequence numbers both lose the date; camera-name folders mix multiple unrelated shoots together.|||VI: Chỉ có định dạng ngày-đứng-trước tự sắp xếp theo thời gian mặc định trong Finder/Explorer VÀ cho biết cả "buổi nào" lẫn "về gì" mà không cần mở file. Chỉ tên dự án hay số thứ tự đều mất thông tin ngày tháng; thư mục theo tên máy quay lại trộn lẫn nhiều buổi quay không liên quan.',
          },
          {
            question: 'Một file bị lỗi 1 byte khi sao chép, nhưng kích thước và ngày-giờ sửa đổi vẫn giữ nguyên y hệt bản gốc. Bạn chạy lại `rsync -a` (KHÔNG có --checksum) để đồng bộ. Điều gì xảy ra?|||A file gets corrupted by 1 byte during copying, but its size and modified-time stay identical to the original. You re-run `rsync -a` (WITHOUT --checksum) to sync. What happens?',
            options: [
              'rsync tự phát hiện lỗi vì nó luôn so sánh nội dung file|||rsync automatically catches it because it always compares file content',
              'rsync báo lỗi ngay và dừng lại|||rsync errors out immediately and stops',
              'rsync BỎ QUA file đó vì size và mtime vẫn khớp — file hỏng vẫn tiếp tục hỏng|||rsync SKIPS that file because size and mtime still match — the corrupted file stays corrupted',
              'rsync tự động xoá file hỏng đó|||rsync automatically deletes the corrupted file',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Without --checksum, rsync\'s default quick-check only compares size and modified-time — it never reads file content unless told to. A corruption that leaves both unchanged is invisible to it, exactly as this chapter\'s real demonstration showed (rsync sent 0 content bytes for the corrupted file).|||VI: Không có --checksum, phép kiểm nhanh mặc định của rsync chỉ so kích thước và ngày-giờ sửa đổi — nó không bao giờ đọc nội dung file trừ khi được yêu cầu. Một lỗi hỏng không đổi cả hai thứ đó là vô hình với nó, đúng như minh hoạ thật của chương này (rsync gửi 0 byte nội dung cho file đã hỏng).',
          },
          {
            question: 'Cách CHẮC CHẮN nhất để biết một bản sao lưu đã khớp 100% với bản gốc, không phải "chắc là ổn", là gì?|||The most CERTAIN way to know a backup copy matches the original 100%, not just "probably fine," is what?',
            options: [
              'So sánh shasum -a 256 của cả hai bên và xác nhận không có khác biệt|||Compare shasum -a 256 on both sides and confirm there is no difference',
              'Xem thanh tiến trình copy đã chạy tới 100%|||Watch the copy progress bar reach 100%',
              'So ngày-giờ sửa đổi (mtime) của hai file|||Compare the modified-time (mtime) of the two files',
              'Mở thử vài giây đầu của file xem có phát được không|||Play the first few seconds of the file to see if it works',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Only a content hash comparison proves byte-for-byte equality. A finished progress bar, matching mtime, or a working preview all describe symptoms that a good copy usually has — none of them are proof, and this chapter showed a real case where all three would have missed real corruption.|||VI: Chỉ có so sánh hash nội dung mới chứng minh được sự giống nhau tuyệt đối từng byte. Thanh tiến trình chạy xong, mtime khớp, hay xem thử vài giây đầu đều chỉ là triệu chứng một bản sao tốt THƯỜNG có — không cái nào là bằng chứng, và chương này đã cho thấy một trường hợp thật mà cả ba đều bỏ sót lỗi hỏng thật.',
          },
          {
            question: 'Theo đúng tinh thần của luật sao lưu 3-2-1, cách sắp xếp nào dưới đây là ĐÚNG?|||Following the real spirit of the 3-2-1 backup rule, which setup below is CORRECT?',
            options: [
              'Cả 3 bản trên cùng một ổ SSD, chia thành 3 thư mục khác nhau|||All 3 copies on the same SSD, split into 3 different folders',
              '3 bản, nhưng cả 3 đều là SSD cùng lô hàng, để chung một bàn làm việc|||3 copies, but all 3 are SSDs from the same batch, sitting on the same desk',
              '2 bản tại nhà trên hai ổ CÙNG loại, cộng 1 bản gửi bạn giữ hộ không bao giờ kiểm tra lại|||2 copies at home on two drives of the SAME type, plus 1 copy left with a friend and never checked again',
              'Ít nhất 3 bản, ít nhất 2 LOẠI ổ khác nhau, và ít nhất 1 bản ở một NƠI KHÁC thật sự|||At least 3 copies, at least 2 DIFFERENT media types, and at least 1 copy genuinely OFFSITE',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: All three wrong options miss one specific failure mode: same-drive "copies" fail together, same-batch drives can share a manufacturing defect, and an unverified offsite copy might already be dead. Only "3 copies, 2 media types, 1 offsite" blocks a bad transfer, a single drive dying, AND a local disaster all at once.|||VI: Cả ba phương án sai đều bỏ sót đúng một kiểu hỏng: "bản sao" trên cùng ổ hỏng cùng lúc, ổ cùng lô hàng có thể chung một lỗi sản xuất, và một bản offsite chưa từng kiểm lại có thể đã chết từ lâu. Chỉ có "3 bản, 2 loại ổ, 1 bản offsite" chặn được cả lỗi copy, ổ đĩa chết, VÀ thảm hoạ tại chỗ cùng lúc.',
          },
          {
            question: 'Bạn cần dựng xong 5 video ngắn cho TikTok/Reels trong một buổi tối, ưu tiên tốc độ hơn kiểm soát màu sâu. Theo khuyến nghị của chương này, công cụ nào hợp lý nhất?|||You need to finish 5 short videos for TikTok/Reels in one evening, prioritizing speed over deep color control. Per this chapter\'s recommendation, which tool makes the most sense?',
            options: [
              'DaVinci Resolve Studio|||DaVinci Resolve Studio',
              'CapCut|||CapCut',
              'Premiere Pro|||Premiere Pro',
              'Final Cut Pro cho iPad qua Apple Creator Studio|||Final Cut Pro for iPad via Apple Creator Studio',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: This chapter\'s own recommendation is explicit: CapCut for short-form speed, DaVinci Resolve for long-form depth (color, audio). The other three are legitimate tools but are either overkill for a fast short-form batch or not part of this course\'s recommended path.|||VI: Khuyến nghị của chính chương này nói rõ: CapCut cho tốc độ nội dung ngắn, DaVinci Resolve cho chiều sâu nội dung dài (màu, âm). Ba lựa chọn còn lại là công cụ hợp lệ nhưng hoặc thừa thãi cho một đợt dựng ngắn cần nhanh, hoặc không nằm trong lộ trình khuyến nghị của khoá này.',
          },
          {
            question: 'Vì sao dựng thẳng trên file H.265/HEVC gốc từ Pocket 3 hay bị giật khi tua timeline?|||Why does editing directly on Pocket 3\'s original H.265/HEVC file tend to stutter when you scrub the timeline?',
            options: [
              'Vì H.265 là định dạng lỗi thời, hiếm phần mềm nào đọc được|||Because H.265 is an outdated format that few programs can read',
              'Vì file quá nhỏ nên máy tính "xử lý dư thừa" gây giật|||Because the file is too small, causing the computer to "over-process" and stutter',
              'Vì phần lớn khung hình (P/B) chỉ lưu phần khác so với khung trước/sau — tua tới một khung giữa chừng phải giải cả chuỗi khung trước nó|||Because most frames (P/B) only store what differs from neighboring frames — jumping to a mid-sequence frame requires decoding the whole chain before it',
              'Vì Pocket 3 quay sai tỉ lệ khung hình so với timeline|||Because Pocket 3 shoots at the wrong aspect ratio for the timeline',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: This is exactly the Long-GOP mechanism this lesson explained and then measured: P/B frames depend on neighboring frames, so random access requires decoding a chain, not one frame — measured here as 2.3–3.7× slower than an all-intra proxy.|||VI: Đây chính xác là cơ chế Long-GOP bài này đã giải thích rồi đo được: khung P/B phụ thuộc khung lân cận, nên truy cập ngẫu nhiên phải giải cả một chuỗi chứ không phải một khung — đo được ở đây chậm hơn 2,3–3,7 lần so với một proxy all-intra.',
          },
          {
            question: 'Trong DaVinci Resolve, "Generate Proxy Media" khác "Generate Optimized Media" ở điểm cốt lõi nào?|||In DaVinci Resolve, what is the core difference between "Generate Proxy Media" and "Generate Optimized Media"?',
            options: [
              'Proxy tạo file RIÊNG, di động được sang máy khác; Optimized Media là cache NỘI BỘ, gắn chặt với đúng dự án đó|||Proxy creates a SEPARATE file, portable to another machine; Optimized Media is an INTERNAL cache tied to that exact project',
              'Proxy chỉ chạy được trên Mac; Optimized Media chỉ chạy được trên Windows|||Proxy only works on Mac; Optimized Media only works on Windows',
              'Đó là hai tên gọi khác nhau của đúng MỘT chức năng|||They are two different names for the exact SAME feature',
              'Optimized Media luôn nhẹ hơn Proxy về dung lượng|||Optimized Media is always smaller than Proxy in file size',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: This lesson named both as real, distinct Resolve features: Proxy Media is a separate, shareable file; Optimized Media is an internal cache (.dvcc) that does not travel with the project to another machine.|||VI: Bài này nêu đúng cả hai như hai tính năng thật, khác nhau của Resolve: Proxy Media là một file RIÊNG, chia sẻ được; Optimized Media là cache nội bộ (.dvcc) không đi theo dự án sang máy khác.',
          },
          {
            question: 'Số đo thật trong bài (ProRes Proxy và DNxHR LB so với một file HEVC gốc) cho thấy điều gì về dung lượng của proxy?|||What did this chapter\'s real measurement (ProRes Proxy and DNxHR LB against an HEVC original) show about proxy file size?',
            options: [
              'Proxy LUÔN nhẹ hơn bản gốc, không có ngoại lệ|||Proxy is ALWAYS lighter than the original, no exceptions',
              'Không có quy luật cố định — ProRes Proxy trong phép đo nhẹ hơn bản gốc, còn DNxHR LB lại nặng hơn; điều đáng tin cậy hơn là proxy NHẸ HƠN ĐỂ GIẢI MÃ|||There is no fixed rule — ProRes Proxy came out lighter than the original in this measurement, while DNxHR LB came out heavier; what is reliable instead is that proxies decode FASTER',
              'Proxy luôn nặng gấp đúng 2 lần bản gốc|||Proxy is always exactly 2× heavier than the original',
              'Dung lượng proxy không liên quan gì tới bitrate của bản gốc|||Proxy file size has nothing to do with the original\'s bitrate',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The chapter\'s own numbers: ProRes Proxy was 36% lighter, DNxHR LB was 51% heavier than the same HEVC original. File size is not the reliable signal — decode speed (measured at 2.3× and 3.7× faster) is what a proxy actually guarantees.|||VI: Đúng số liệu của chương: ProRes Proxy nhẹ hơn 36%, DNxHR LB nặng hơn 51% so với cùng một file HEVC gốc. Dung lượng file không phải tín hiệu đáng tin — tốc độ giải mã (đo được nhanh hơn 2,3× và 3,7×) mới là thứ một proxy thật sự đảm bảo.',
          },
          {
            question: 'Bạn định mở thẳng file gốc quay bằng Pocket 3 (H.265 + audio AAC) trong DaVinci Resolve bản MIỄN PHÍ trên máy Linux ở nhà. Điều gì nhiều khả năng xảy ra nhất?|||You try opening a raw Pocket 3 file (H.265 + AAC audio) directly in the FREE edition of DaVinci Resolve on your home Linux machine. What most likely happens?',
            options: [
              'Mở bình thường — Resolve đọc mọi codec như nhau trên mọi hệ điều hành|||It opens normally — Resolve reads every codec the same way on every OS',
              'Chỉ chậm hơn Mac một chút vì máy Linux yếu hơn|||It\'s just a bit slower than on Mac because the Linux machine is weaker',
              'Resolve tự động chuyển mã ngầm, người dùng không cần biết gì|||Resolve silently auto-transcodes it in the background, no user action needed',
              'Clip có thể hiện đen hoặc mất tiếng, vì bản Free trên Linux không giải mã được H.264/HEVC/AAC — cần chuyển mã bằng ffmpeg trước|||The clip may show black or lose audio, because the Free edition on Linux cannot decode H.264/HEVC/AAC — it needs transcoding with ffmpeg first',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: This is the exact codec gap the lesson named, already demonstrated in Chapter 6.3 with a real transcode: free Resolve on Linux cannot decode H.264/HEVC at all, and AAC fails on both editions there — the fix is transcoding to ProRes/DNxHR with PCM audio first.|||VI: Đây chính xác là lỗ hổng codec bài này nêu tên, đã minh hoạ thật ở Chương 6.3 bằng một lần chuyển mã thật: Resolve free trên Linux hoàn toàn không giải mã được H.264/HEVC, và AAC hỏng trên cả hai bản ở đó — cách sửa là chuyển mã sang ProRes/DNxHR kèm audio PCM trước.',
          },
          {
            question: 'Máy Linux ở nhà bạn chạy Fedora. Về việc DaVinci Resolve hỗ trợ Linux chính thức, điều nào ĐÚNG?|||Your home Linux machine runs Fedora. Regarding DaVinci Resolve\'s official Linux support, which is TRUE?',
            options: [
              'Fedora KHÔNG nằm trong danh sách distro được hỗ trợ chính thức — chỉ Rocky Linux 8.6 mới có; chạy được không đồng nghĩa được hỗ trợ|||Fedora is NOT on the list of officially supported distributions — only Rocky Linux 8.6 is; running does not mean officially supported',
              'Fedora là distro được Blackmagic khuyến nghị hàng đầu|||Fedora is Blackmagic\'s top-recommended distribution',
              'Mọi bản Linux đều được hỗ trợ như nhau|||Every Linux distribution is supported equally',
              'Chỉ Ubuntu mới chạy được DaVinci Resolve|||Only Ubuntu can run DaVinci Resolve',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Checked directly this chapter: Rocky Linux 8.6 is the only officially named distribution for DaVinci Resolve on Linux. Fedora and Ubuntu may run it unofficially, but that is a different claim from official support — exactly the distinction this lesson warned about.|||VI: Đã kiểm trực tiếp trong chương này: Rocky Linux 8.6 là distro DUY NHẤT được nêu tên hỗ trợ chính thức cho DaVinci Resolve trên Linux. Fedora và Ubuntu có thể chạy được không chính thức, nhưng đó là một tuyên bố khác hẳn "được hỗ trợ chính thức" — đúng sự phân biệt bài này đã cảnh báo.',
          },
        ],
      },
    },
  ],
};
