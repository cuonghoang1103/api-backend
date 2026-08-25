const REF = '?ref=%2Fcourses%2Ftailwind-css%2Flearn&reflabel=Tailwind%20CSS';
/**
 * Tailwind CSS — Chương 11: Ôn thi.
 * Hai bài: (1) &quot;những gì SỐNG QUA đo lường&quot; — ba cột (đúng bao giờ / chỉ khi đo /
 * sai bao giờ) rút từ mười chương đầu, (2) đề thi cuối — 12 câu, 1080s.
 */

export default {
  title: 'Chapter 11 — What survived measurement, and a final exam|||Chương 11 — Cái sống qua đo lường, và đề thi cuối',
  slug: 'tw-ch11-on-thi',
  description: 'Hai bài. Bài 11.1 sắp mọi phát hiện thành ba cột — luôn đúng, chỉ đúng khi đo, luôn sai — để bạn biết chỗ nào tin, chỗ nào phải kiểm lại. Bài 11.2 là đề thi cuối, 12 câu, 1080s.',
  sortOrder: 12,
  lessons: [
    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — What survived measurement|||11.1 — Cái SỐNG QUA đo lường',
      slug: 'tw-11-1-song-qua',
      type: 'VIDEO',
      description: 'Ba cột. Cột A: những gì luôn đúng, không cần đo lại. Cột B: những gì chỉ đúng khi bạn đo — số của kho khác sẽ khác. Cột C: những gì trực giác nói, nhưng đo cho ra sai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>What survived measurement</h2>
<p class="lead">Ten chapters generated numbers. Some of them are properties of Tailwind and hold in any project. Some of them are properties of <em>this</em> codebase and would change in yours. And some were things I believed at the start of the course that measuring proved wrong. This lesson sorts everything into those three columns, so the next reader knows which is which.</p>

<h3>Column A — ALWAYS TRUE (no re-measurement needed)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Tailwind is a CSS generator</span><span class="lz-lnote">It SCANS your source, emits CSS for the classes it finds, and emits nothing for the ones it does not. Lesson 0.1. As firm as a law of physics — every strange behaviour follows from it</span></div>
<div class="lz-layer"><span class="lz-lname">Tailwind sorts utilities as STRINGS, not as NUMBERS</span><span class="lz-lnote">Lesson 3.1 measured this with CLI 3.4.14. <code>mt-8</code> comes last in <code>{mt-1, mt-10, mt-12, ..., mt-8}</code>, and therefore wins. This is the mechanism, not a bug</span></div>
<div class="lz-layer"><span class="lz-lname">Layers do NOT change specificity</span><span class="lz-lnote">Lesson 10.4 · MDN. <code>@layer</code> only decides when specificity TIES. 93.5% of the <code>.rich-content</code> rules in this repo out-specify the utilities — the utility never reaches, and no layer saves it</span></div>
<div class="lz-layer"><span class="lz-lname">Tailwind 3 STRIPS <code>@layer</code> from the output</span><span class="lz-lnote">Lesson 7.1 · grepping out.css returns 0 <code>@layer</code>. It is a build-time RELOCATION directive, NOT a CSS cascade layer. Saying &quot;layer&quot; in the CSS sense in a Tailwind 3 context is wrong</span></div>
<div class="lz-layer"><span class="lz-lname">CSS variables INHERIT; utilities do not</span><span class="lz-lnote">Lesson 6.1 · MDN. Setting <code>--text-primary</code> on a parent makes it READABLE by every descendant, at any depth. This is where CSS variables beat utilities OUTRIGHT — it is not a matter of style preference</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@apply</code> does NOT reduce CSS size</span><span class="lz-lnote">Lesson 4.2 · verified with a real build. It COPIES the declarations into your rule — 0% deduplication. This repo has 0 uses of <code>@apply</code> in globals.css. Hard evidence that the right tool was chosen</span></div>
</div>

<h3>Column B — ONLY TRUE ONCE MEASURED (your numbers will differ)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">3,683 unique classes / 26,343 uses / 793 .tsx files</span><span class="lz-lnote">All the &quot;repo scale&quot; figures from the Section A measurement. Another repo gives other numbers — lower for a small SPA, higher for a component-heavy dashboard</span></div>
<div class="lz-layer"><span class="lz-lname">371,550 B / 45,242 B gzipped / 3,664 rules</span><span class="lz-lnote">Lesson 8.1. These three scale WITH the utilities you use. Measure again; lesson 8.1's explanation holds whatever the numbers say. If you land under 100 KB gzipped, lesson 8.5's conclusion (stop after step 2) still stands</span></div>
<div class="lz-layer"><span class="lz-lname">91 dead alpha classes / 76 uses of bg-bg-elevated / 465 with no rule at all</span><span class="lz-lnote">Lessons 6.2 and 9.3. These are defects of THIS REPO, not of Tailwind. Measure with lesson 9.3's script on your own repo. The three cause groups (A/B/C) will most likely hold; the numbers will not</span></div>
<div class="lz-layer"><span class="lz-lname"><code>--text-muted</code> = <code>#8a8d91</code> identical across both themes</span><span class="lz-lnote">Lesson 9.1 · a tuning error specific to this repo. Your palette differs — but a text token holding the SAME hex across both themes is always suspicious and always worth checking with a contrast ratio</span></div>
<div class="lz-layer"><span class="lz-lname">76.3% of dynamic strings bypass twMerge</span><span class="lz-lnote">Lessons 3.4 and 10.5. The figure depends on the repo's age and when shadcn-ui was adopted. The underlying pattern (3 AI habits) holds in every repo</span></div>
</div>

<h3>Column C — ALWAYS FALSE (intuition says one thing, measurement another)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">INTUITION: &quot;the class written last wins&quot;</span><span class="lz-lnote">FALSE. Lesson 3.2. <code>text-red-500 text-blue-500</code> → <code>text-red-500</code> wins because <code>b</code> sorts before <code>r</code> as a string. The one written FIRST wins</span></div>
<div class="lz-layer"><span class="lz-lname">INTUITION: &quot;the larger number wins&quot;</span><span class="lz-lnote">FALSE. Lesson 3.1. <code>mt-32</code> does NOT beat <code>mt-8</code> in a chain of 11 classes; <code>mt-8</code> wins because &quot;8&quot; sorts last</span></div>
<div class="lz-layer"><span class="lz-lname">INTUITION: &quot;<code>@layer utilities</code> guarantees a utility overrides&quot;</span><span class="lz-lnote">FALSE. Lesson 10.4. Layers only matter on a tie; a higher-specificity rival wins regardless of layer</span></div>
<div class="lz-layer"><span class="lz-lname">INTUITION: &quot;<code>@apply</code> reduces duplicated code&quot;</span><span class="lz-lnote">FALSE. Lesson 4.2 · the measurement shows <code>@apply</code> COPIES declarations and never dedupes. The right approach is a React component with raw utilities</span></div>
<div class="lz-layer"><span class="lz-lname">INTUITION: &quot;Tailwind does NOT respect prefers-reduced-motion&quot;</span><span class="lz-lnote">I GOT THIS WRONG. Lesson 9.5. My element-level measurement (grepping <code>motion-reduce:</code>) reported 10 uses. The truth: the repo suppresses centrally in 9 CSS @media blocks, covering all 7 ambient animations. Cross-check in the CSS, do not count utilities in JSX</span></div>
<div class="lz-layer"><span class="lz-lname">INTUITION: &quot;<code>outline-none</code> is always a bug&quot;</span><span class="lz-lnote">FALSE. Lesson 9.4. 86% of its uses DO draw a replacement focus ring matching the palette — which is the correct way to get good keyboard UX. Only 14% (72 places) are genuine bugs, most of them on input fields</span></div>
</div>

<h3>Three measurements I GOT WRONG — retold so they do not recur</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">lesson 7.1 · layer line offsets</span><span class="lz-nsub">4,143 lines instead of 219</span></span>
<span class="lz-nbody">I took the distance between consecutive <code>@layer</code> markers and assumed the final layer ran to the end of the file. Off by a factor of 18.9. <strong>Lesson:</strong> measuring a nested structure means MATCHING BRACES, not counting lines.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">lesson 2.4 · the dark: grep returned 0</span><span class="lz-nsub">baseline 786</span></span>
<span class="lz-nbody"><code>grep -o 'dark:[a-z0-9/\\[\\]#.-]*'</code> — the <code>[</code> <code>]</code> escape inside a character class broke the class and matched nothing. The baseline of 786 exposed it immediately. <strong>Lesson:</strong> a measurement returning 0 must be checked against a baseline BEFORE you believe it.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">lesson 9.5 · the motion-reduce grep</span><span class="lz-nsub">10 hits, concluding &quot;not suppressed&quot;</span></span>
<span class="lz-nbody">Grep <code>motion-reduce:</code> across .tsx, assuming the guard lived in a utility. The truth: the repo suppresses CENTRALLY in CSS. <strong>Lesson:</strong> ask yourself &quot;what other form could the guard take?&quot; BEFORE declaring something broken.</span>
</div>
</div>

<div class="callout ok">
<p><strong>Why those three errors were NOT removed.</strong> Keeping them in the course is deliberate — each is a common measurement trap, and learning how the stumble happens is learning not to stumble again. This three-column table exists so every claim in the course carries a provenance note: A = a law, B = this repo, C = intuition that lost to measurement.</p>
</div>

<h3>How to use this table on YOUR repo</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Column A applies directly</span><span class="lz-d">No measurement needed. As long as Tailwind 3 is the tool in use, every line in column A holds for your repo.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Column B needs re-measuring</span><span class="lz-d">Run the scripts from the corresponding lessons on your own repo: section A (counting scale), lesson 8.1 (build and weigh), lesson 9.3 (audit classes with no rule), lesson 9.1 (palette contrast). Your numbers will differ; your conclusions may or may not.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Column C is the checklist for when you are unsure</span><span class="lz-d">Whenever you write a mental model of Tailwind into a PR description, check it against column C. If it matches a line there, measure again; do not ship a PR resting on intuition that has already been disproved.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — treating this course as a &quot;licence&quot; to stop measuring.</strong> This repo's numbers are not your numbers. Column A transfers; column B does NOT. If you read lesson 9.1 and conclude your palette also has 3 AA failures, you have missed the spirit of the course. Run the measurement on your own repo; that is the entire point.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The six items in column A are Tailwind laws that apply to any repo; the five in column B are this repo's measurements, which you must re-run on yours; the six in column C are intuitions that lost to measurement — including three false alarms of my own, kept as lessons — and the three columns give you three different ways in when you meet a new Tailwind question.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind CSS documentation</span><span class="lc-sub">tailwindcss.com/docs — nguồn chính cho mọi câu ở cột A. Đọc &quot;Core concepts&quot; trước, phần khác đọc khi cần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chrome DevTools — Rendering pane</span><span class="lc-sub">developer.chrome.com/docs/devtools/rendering — công cụ để giả lập <code>prefers-reduced-motion</code>, <code>prefers-color-scheme</code>, và các mode khác — kiểm được cột B (bảng màu, chuyển động) trên kho của bạn mà không cần thay đổi hệ điều hành.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">github.com/dcastil/tailwind-merge</span><span class="lc-sub">Đọc README một lần. Sáu chương của khoá này dựa trên hiểu tại sao nó tồn tại.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Track Tailwind CSS — Code Lab</span><span class="lc-sub">/code-lab/tracks/tailwind-css${REF} — chín thử thách thực hành áp cây quyết định của Chương 10 vào từng phép đo của Cột B.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Cái SỐNG QUA đo lường</h2>
<p class="lead">Mười chương đã tạo ra các con số. Một số là thuộc tính của Tailwind và đúng ở mọi dự án. Một số là thuộc tính của <em>kho này</em> và sẽ khác ở kho của bạn. Và một số là những gì tôi tin từ đầu khoá học mà đo lường chứng minh sai. Bài này sắp mọi thứ vào ba cột đó, để người đọc sau biết cái nào là cái nào.</p>

<h3>Cột A — LUÔN ĐÚNG (không cần đo lại)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Tailwind là một trình sinh CSS</span><span class="lz-lnote">Nó QUÉT mã nguồn, phát ra CSS cho các lớp tìm thấy, và không phát ra cho các lớp không thấy. Bài 0.1. Cứng như một quy luật vật lý — mọi hành vi lạ đều suy ra từ đây</span></div>
<div class="lz-layer"><span class="lz-lname">Tailwind sắp utility theo CHUỖI ký tự, không theo SỐ</span><span class="lz-lnote">Bài 3.1 đo bằng CLI 3.4.14. <code>mt-8</code> đứng cuối trong <code>{mt-1, mt-10, mt-12, ..., mt-8}</code>, do đó thắng. Đây là cơ chế, không phải bug</span></div>
<div class="lz-layer"><span class="lz-lname">Layer KHÔNG thay đổi độ đặc hiệu</span><span class="lz-lnote">Bài 10.4 · MDN. <code>@layer</code> chỉ quyết định khi độ đặc hiệu HOÀ. 93,5% quy tắc <code>.rich-content</code> ở kho này vượt utility về specificity — utility không tới được, layer không cứu</span></div>
<div class="lz-layer"><span class="lz-lname">Tailwind 3 XOÁ <code>@layer</code> khỏi đầu ra</span><span class="lz-lnote">Bài 7.1 · grep out.css cho 0 <code>@layer</code>. Nó là chỉ thị DI DỜI lúc dựng, KHÔNG phải cascade layer của CSS. Nói &quot;layer&quot; ở nghĩa CSS trong bối cảnh Tailwind 3 là sai</span></div>
<div class="lz-layer"><span class="lz-lname">CSS variable KẾ THỪA, utility không</span><span class="lz-lnote">Bài 6.1 · MDN. Đặt <code>--text-primary</code> trên một cha là mọi con cháu ĐỌC được, ở bất kỳ độ sâu. Đây là chỗ CSS variable thắng utility DỨT KHOÁT, không phải một lựa chọn phong cách</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@apply</code> KHÔNG giảm kích thước CSS</span><span class="lz-lnote">Bài 4.2 · kiểm bằng build thật. Nó CHÉP các declaration vào rule của bạn — 0% deduplication. Kho này có 0 lượt <code>@apply</code> trong globals.css. Bằng chứng cứng rằng công cụ đúng</span></div>
</div>

<h3>Cột B — CHỈ ĐÚNG KHI ĐO (số của bạn sẽ khác)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">3.683 lớp duy nhất / 26.343 lượt / 793 file .tsx</span><span class="lz-lnote">Mọi &quot;quy mô repo&quot; ở phép đo Mục A. Kho khác cho số khác — thấp hơn cho một app SPA nhỏ, cao hơn cho một dashboard nhiều component</span></div>
<div class="lz-layer"><span class="lz-lname">371.550 B / 45.242 B gzip / 3.664 quy tắc</span><span class="lz-lnote">Bài 8.1. Ba con số này TỈ LỆ với utility bạn dùng. Đo lại; giải thích trong bài 8.1 vẫn đúng bất kể số ra sao. Nếu &lt; 100 KB gzip thì kết luận của bài 8.5 (dừng sau bước 2) vẫn giữ nguyên</span></div>
<div class="lz-layer"><span class="lz-lname">91 lớp alpha chết / 76 lượt bg-bg-elevated / 465 tổng không có rule</span><span class="lz-lnote">Bài 6.2 và 9.3. Đây là khiếm khuyết của KHO NÀY, không phải của Tailwind. Đo bằng script ở bài 9.3 trên kho của bạn. Ba nhóm nguyên nhân (A/B/C) khả năng cao đúng, con số khác nhau</span></div>
<div class="lz-layer"><span class="lz-lname"><code>--text-muted</code> = <code>#8a8d91</code> giữ nguyên hai theme</span><span class="lz-lnote">Bài 9.1 · lỗi tinh chỉnh cụ thể của kho này. Bảng màu của bạn khác — nhưng token chữ giữ CÙNG hex cho hai theme thì luôn đáng ngờ, luôn nên kiểm bằng contrast ratio</span></div>
<div class="lz-layer"><span class="lz-lname">76,3% chuỗi động không qua twMerge</span><span class="lz-lnote">Bài 3.4 và 10.5. Số phụ thuộc vào tuổi kho và thời điểm shadcn-ui được adopt. Pattern chung (3 thói quen AI) đúng ở mọi kho</span></div>
</div>

<h3>Cột C — LUÔN SAI (trực giác nói, đo cho ra khác)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;lớp viết cuối thắng&quot;</span><span class="lz-lnote">SAI. Bài 3.2. <code>text-red-500 text-blue-500</code> → <code>text-red-500</code> thắng vì <code>b</code> đứng trước <code>r</code> theo chuỗi. Cái viết ĐẦU thắng</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;số lớn hơn thắng&quot;</span><span class="lz-lnote">SAI. Bài 3.1. <code>mt-32</code> KHÔNG thắng <code>mt-8</code> trong chuỗi 11 lớp; <code>mt-8</code> thắng vì &quot;8&quot; đứng cuối alphabet</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;<code>@layer utilities</code> bảo đảm utility đè&quot;</span><span class="lz-lnote">SAI. Bài 10.4. Chỉ hoà mới cần layer; đối thủ specificity cao hơn thắng bất kể layer</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;<code>@apply</code> giảm code trùng lặp&quot;</span><span class="lz-lnote">SAI. Bài 4.2 · đo cho ra: <code>@apply</code> CHÉP declaration, không dedup. Cách đúng là dùng React component với utility raw</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;Tailwind KHÔNG tôn trọng prefers-reduced-motion&quot;</span><span class="lz-lnote">TÔI ĐÃ NÓI SAI. Bài 9.5. Phép đo cấp-phần-tử của tôi (grep <code>motion-reduce:</code>) chỉ ra 10 lượt. Sự thật: kho chặn tập trung ở 9 khối CSS @media, phủ đủ 7 animation ambient. Đối chiếu ở CSS, không đếm utility trên JSX</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;<code>outline-none</code> luôn là bug&quot;</span><span class="lz-lnote">SAI. Bài 9.4. 86% chỗ dùng nó CÓ vẽ lại vòng focus khớp bảng màu — đó là cách đúng để có UX bàn phím đẹp. Chỉ 14% (72 chỗ) là bug thật, phần lớn ở các ô nhập</span></div>
</div>

<h3>Ba phép đo TÔI đã LÀM SAI — kể lại để không tái</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bài 7.1 · line-offset layer</span><span class="lz-nsub">4.143 dòng thay vì 219</span></span>
<span class="lz-nbody">Lấy khoảng cách giữa các <code>@layer</code> liên tiếp, giả định layer cuối kéo đến hết file. Sai 18,9 lần. <strong>Bài học:</strong> đo cấu trúc lồng nhau thì phải KHỚP NGOẶC, không đếm dòng.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bài 2.4 · dark: grep trả 0</span><span class="lz-nsub">baseline 786</span></span>
<span class="lz-nbody"><code>grep -o 'dark:[a-z0-9/\\[\\]#.-]*'</code> — dấu <code>[</code> <code>]</code> thoát bên trong lớp ký tự làm lớp ký tự vỡ, khớp rỗng. Baseline 786 lộ ngay là sai. <strong>Bài học:</strong> phép đo trả 0 phải đối chiếu với baseline TRƯỚC khi tin.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bài 9.5 · motion-reduce grep</span><span class="lz-nsub">10 hits, kết luận &quot;không chặn&quot;</span></span>
<span class="lz-nbody">Grep <code>motion-reduce:</code> trên .tsx, giả định lưới chắn nằm ở utility. Sự thật: kho chọn chặn TẬP TRUNG ở CSS. <strong>Bài học:</strong> tự hỏi &quot;còn cách khác nào lưới chắn có thể tồn tại&quot; TRƯỚC khi công bố hỏng.</span>
</div>
</div>

<div class="callout ok">
<p><strong>Vì sao ba lỗi ấy KHÔNG bị bỏ.</strong> Giữ chúng trong khoá học là cố ý — mỗi cái là một cạm bẫy đo lường phổ biến, và học cách vấp là học cách không vấp nữa. Bảng ba cột này tồn tại để mọi phát biểu trong khoá đều có ghi chú xuất xứ: A = quy luật, B = kho này, C = trực giác thua đo lường.</p>
</div>

<h3>Cách dùng bảng này ở kho CỦA BẠN</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cột A áp thẳng</span><span class="lz-d">Không cần đo. Nếu Tailwind 3 vẫn là công cụ đang dùng, mọi câu trong cột A đúng cho kho của bạn.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cột B cần đo lại</span><span class="lz-d">Chạy các script ở các bài tương ứng trên kho của bạn: mục A (đếm quy mô), bài 8.1 (build và cân), bài 9.3 (audit lớp không rule), bài 9.1 (contrast bảng màu). Con số của bạn khác; kết luận có thể giống hoặc khác.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cột C là danh sách kiểm khi hoài nghi</span><span class="lz-d">Mỗi khi bạn viết một mô hình tinh thần về Tailwind vào PR description, đối chiếu với cột C. Nếu nó khớp một dòng ở đó, đo lại; đừng gửi PR dựa trên trực giác đã được chứng minh sai.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi khoá học là một &quot;giấy phép&quot; không cần đo nữa.</strong> Con số của kho này khác con số của bạn. Cột A áp thẳng; cột B thì KHÔNG. Nếu bạn đọc bài 9.1 và tin bảng màu của bạn cũng có 3 chỗ trượt AA thì bạn đã bỏ qua tinh thần của khoá học. Chạy phép đo trên kho bạn; đó là cả điểm.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Sáu điều trong cột A là quy luật của Tailwind áp cho mọi kho; năm điều trong cột B là phép đo của kho này mà bạn phải chạy lại trên kho của bạn; sáu điều trong cột C là trực giác thua đo lường — bao gồm ba báo động sai của chính tôi được giữ lại làm bài học — và cách dùng ba cột là ba lối vào khác nhau khi tiếp cận một câu hỏi Tailwind mới.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tài liệu Tailwind CSS</span><span class="lc-sub">tailwindcss.com/docs — nguồn chính cho mọi câu ở cột A. Đọc &quot;Core concepts&quot; trước, phần khác đọc khi cần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chrome DevTools — Rendering pane</span><span class="lc-sub">developer.chrome.com/docs/devtools/rendering — công cụ để giả lập <code>prefers-reduced-motion</code>, <code>prefers-color-scheme</code>, và các mode khác — kiểm được cột B (bảng màu, chuyển động) trên kho của bạn mà không cần thay đổi hệ điều hành.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">github.com/dcastil/tailwind-merge</span><span class="lc-sub">Đọc README một lần. Sáu chương của khoá này dựa trên hiểu tại sao nó tồn tại.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Track Tailwind CSS — Code Lab</span><span class="lc-sub">/code-lab/tracks/tailwind-css${REF} — chín thử thách thực hành áp cây quyết định của Chương 10 vào từng phép đo của Cột B.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — Final exam|||11.2 — Đề thi cuối',
      slug: 'tw-11-2-de-thi',
      type: 'QUIZ',
      description: 'Mười hai câu, mười tám phút. Rút từ mười chương đầu — sáu câu về cơ chế (cột A), bốn câu về đo lường (cột B), hai câu về trực giác thua đo lường (cột C).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Final exam</span>
<h2>Twelve questions, eighteen minutes</h2>
<p class="lead">The final exam draws on the first ten chapters in the proportions of columns A / B / C. No question is a repeat; every one turns on a real decision you will face working with Tailwind.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">6 mechanism questions (column A)</span><span class="lz-lnote">Tailwind laws that apply to any repo — CSS generation, string sorting, layers, alpha-value, Q ordering</span></div>
<div class="lz-layer"><span class="lz-lname">4 measurement questions (column B)</span><span class="lz-lnote">the measurements you will run on your own repo — size, contrast, dead classes, twMerge coverage</span></div>
<div class="lz-layer"><span class="lz-lname">2 intuition-loses questions (column C)</span><span class="lz-lnote">the places where familiar CSS intuition betrays you in Tailwind — read the DevTools result instead of guessing</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Đề thi cuối</span>
<h2>Mười hai câu, mười tám phút</h2>
<p class="lead">Đề thi cuối rút từ mười chương đầu theo tỉ lệ cột A / B / C. Không câu nào là câu lặp; mọi câu đều xoay quanh một quyết định thật bạn sẽ gặp khi làm việc với Tailwind.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">6 câu cơ chế (cột A)</span><span class="lz-lnote">quy luật Tailwind áp cho mọi kho — sinh CSS, sắp chuỗi, layer, alpha-value, thứ tự Q</span></div>
<div class="lz-layer"><span class="lz-lname">4 câu đo lường (cột B)</span><span class="lz-lnote">các phép đo bạn sẽ chạy trên kho của mình — kích thước, contrast, dead classes, twMerge coverage</span></div>
<div class="lz-layer"><span class="lz-lname">2 câu trực giác thua đo (cột C)</span><span class="lz-lnote">những chỗ trực giác CSS quen thuộc phản bội bạn trong Tailwind — đọc kết quả DevTools thay vì đoán</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 1080,
        questions: [
          {
            question: 'You add a Tailwind class to a component but it does not apply. What is the first thing to check?|||Bạn thêm một lớp Tailwind vào một component nhưng nó không áp. Kiểm gì TRƯỚC?',
            options: [
              'Whether the rule was generated at all — <code>grep -c &quot;that-class&quot; out.css</code>. If zero, nothing downstream matters, and the fix depends on WHY it was not generated (dynamic name, off-scale value, unsupported modifier, broken glob)|||Xem quy tắc có được phát sinh không — <code>grep -c &quot;that-class&quot; out.css</code>. Nếu 0, mọi thứ xuôi dòng vô nghĩa, và bản vá phụ thuộc TẠI SAO nó không được sinh (tên động, giá trị ngoài thang, bổ từ không hỗ trợ, glob hỏng)',
              'Add <code>!important</code> to force it|||Thêm <code>!important</code> để ép',
              'Restart the dev server — Tailwind caching|||Khởi động lại dev server — Tailwind cache',
              'Check whether Tailwind is installed|||Xem Tailwind đã cài chưa',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You write <code>&lt;div class=&quot;mt-8 mt-32&quot;&gt;</code>. Which utility applies, and why?|||Bạn viết <code>&lt;div class=&quot;mt-8 mt-32&quot;&gt;</code>. Utility nào áp, và tại sao?',
            options: [
              '<code>mt-8</code> — Tailwind sorts utilities as strings, and &quot;8&quot; sorts after &quot;32&quot;. The later-emitted utility wins the tie. Written order in the class attribute plays no role|||<code>mt-8</code> — Tailwind sắp utility theo chuỗi, và &quot;8&quot; đứng sau &quot;32&quot;. Utility phát sinh sau thắng khi hoà. Thứ tự viết trong thuộc tính class không có vai trò',
              '<code>mt-32</code> — the larger value always wins|||<code>mt-32</code> — giá trị lớn hơn luôn thắng',
              '<code>mt-32</code> — written last, so applied last|||<code>mt-32</code> — viết cuối nên áp cuối',
              '<code>mt-8</code> — the smaller value beats the larger|||<code>mt-8</code> — giá trị nhỏ hơn thắng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Where does <code>@layer components</code> live in the built Tailwind 3 CSS?|||<code>@layer components</code> nằm ở đâu trong CSS Tailwind 3 đã dựng?',
            options: [
              'Nowhere — Tailwind 3 STRIPS <code>@layer</code> from output entirely. It is a build-time relocation instruction, not a real CSS cascade layer. <code>grep -c &quot;@layer&quot; out.css</code> returns 0|||Không đâu — Tailwind 3 XOÁ <code>@layer</code> khỏi đầu ra hoàn toàn. Nó là chỉ thị DI DỜI lúc dựng, không phải cascade layer CSS thật. <code>grep -c &quot;@layer&quot; out.css</code> trả 0',
              'Between <code>@layer base</code> and <code>@layer utilities</code>|||Giữa <code>@layer base</code> và <code>@layer utilities</code>',
              'Wrapped in a real <code>@layer components</code> rule|||Bọc trong một quy tắc <code>@layer components</code> thật',
              'At the top of the file as a comment|||Ở đầu file như một chú thích',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your config has <code>text: { muted: &quot;var(--text-muted)&quot; }</code>. What happens when someone writes <code>text-text-muted/70</code>?|||Config của bạn có <code>text: { muted: &quot;var(--text-muted)&quot; }</code>. Chuyện gì xảy ra khi ai đó viết <code>text-text-muted/70</code>?',
            options: [
              'Nothing — the class is not generated at all. Opacity modifiers only work when the token uses the <code>&lt;alpha-value&gt;</code> placeholder or bare RGB channels. Text renders at 100% opacity, silently|||Không gì — lớp không được sinh ra. Bổ từ độ mờ chỉ chạy khi token dùng placeholder <code>&lt;alpha-value&gt;</code> hoặc kênh RGB trần. Chữ vẽ ở 100% độ mờ, âm thầm',
              'It renders at 70% opacity as expected|||Nó vẽ ở 70% độ mờ đúng như kỳ vọng',
              'Tailwind throws a build error|||Tailwind báo lỗi build',
              'It renders at 30% opacity (inverted)|||Nó vẽ ở 30% (đảo ngược)',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A rule at specificity 0,2,1 is wrapped in <code>@layer components</code>. A utility at 0,1,0 sits in <code>@layer utilities</code>. Which wins?|||Một quy tắc ở độ đặc hiệu 0,2,1 bọc trong <code>@layer components</code>. Một utility ở 0,1,0 nằm trong <code>@layer utilities</code>. Cái nào thắng?',
            options: [
              'The 0,2,1 rule — layering only decides TIES on specificity. Higher specificity always wins, regardless of layer|||Quy tắc 0,2,1 — layer chỉ quyết định khi độ đặc hiệu HOÀ. Cao hơn luôn thắng, bất kể layer',
              'The utility — <code>@layer utilities</code> is emitted last|||Utility — <code>@layer utilities</code> phát sinh cuối',
              'Neither — they conflict and browser picks randomly|||Không cái nào — xung đột và trình duyệt chọn ngẫu nhiên',
              'The utility — utilities always beat layered rules|||Utility — utility luôn thắng quy tắc trong layer',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Setting <code>--text-primary</code> on a container reaches every descendant. Why is that the mechanism CSS variables win against utilities?|||Đặt <code>--text-primary</code> trên một vùng chứa với tới mọi con cháu. Vì sao đó là cơ chế biến CSS thắng utility?',
            options: [
              'Because custom properties INHERIT — one declaration on the container reaches every descendant at any depth without a single descendant selector. Utilities cannot do this without touching each child|||Vì thuộc tính tuỳ biến KẾ THỪA — một khai báo trên vùng chứa với tới mọi con cháu ở bất kỳ độ sâu mà không cần selector con cháu nào. Utility không làm được vậy nếu không đụng từng con',
              'Because <code>!important</code> is applied automatically to CSS variables|||Vì <code>!important</code> tự áp cho biến CSS',
              'Because CSS variables have higher specificity than utilities|||Vì biến CSS có độ đặc hiệu cao hơn utility',
              'Because Tailwind resolves variables at build time|||Vì Tailwind giải variable lúc dựng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You build the CSS: 371 KB raw, 45 KB gzipped, 3.664 rules. What is the practical next step for size?|||Bạn dựng CSS: 371 KB thô, 45 KB gzip, 3.664 quy tắc. Bước thực dụng tiếp theo cho kích thước là gì?',
            options: [
              'Enable compression and cache-immutable headers (two config lines), then STOP. At 45 KB the remaining leverage is in fonts and images, not CSS. Compression is 99% of the available win|||Bật nén và header cache-immutable (hai dòng cấu hình), rồi DỪNG. Ở 45 KB thì đòn bẩy còn lại nằm ở font và ảnh, không phải CSS. Nén là 99% cái lợi có sẵn',
              'Disable Preflight to recover 6,5%|||Tắt Preflight để lấy lại 6,5%',
              'Split CSS per route to reduce initial payload|||Chẻ CSS theo route để giảm payload đầu',
              'Add a safelist so classes are not accidentally purged|||Thêm safelist để lớp không bị purge nhầm',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your CI reports the CSS build got 36× faster overnight. Which measurement do you check FIRST?|||CI báo bản dựng CSS đột nhiên nhanh gấp 36 lần qua đêm. Bạn kiểm phép đo NÀO trước?',
            options: [
              'The rule count and byte total — a broken <code>content</code> glob emits ~10 KB and ZERO rules, matching Preflight alone. Fast is the symptom; scanning nothing is the cause|||Số quy tắc và tổng byte — một glob <code>content</code> hỏng phát ra ~10 KB và KHÔNG quy tắc, chỉ bằng Preflight. Nhanh là triệu chứng; không quét gì mới là nguyên nhân',
              'Nothing — a faster build is unambiguously good news|||Không gì — build nhanh hơn là tin tốt không cần bàn',
              'Whether the CI machine got a hardware upgrade|||Xem máy CI có nâng cấp phần cứng không',
              'The npm cache — a warm cache runs faster|||Cache npm — cache ấm chạy nhanh hơn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You audit the palette: 12 text-on-background combinations, 3 fail AA. The three failures share what?|||Bạn soát bảng màu: 12 tổ hợp chữ-trên-nền, 3 cái trượt AA. Ba chỗ trượt có ĐIỂM CHUNG gì?',
            options: [
              'All three are the ONE text token that keeps the same hex in both themes — so it cannot have been tuned for either background, and it fails on the harder background of each|||Cả ba đều là token chữ DUY NHẤT giữ nguyên hex ở cả hai theme — nên nó không thể đã được tinh chỉnh cho nền nào, và trượt trên nền khó hơn của mỗi bên',
              'All three are in the dark theme|||Cả ba đều ở theme tối',
              'All three use arbitrary hex values, not tokens|||Cả ba đều dùng hex tuỳ ý, không phải token',
              'All three use <code>text-xs</code> — small text always fails|||Cả ba đều dùng <code>text-xs</code> — chữ nhỏ luôn trượt',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: '76% of dynamic className strings bypass <code>twMerge</code>. What does that mean when a consumer passes <code>className</code> to a component?|||76% chuỗi className động bỏ qua <code>twMerge</code>. Nghĩa gì khi consumer truyền <code>className</code> vào một component?',
            options: [
              'The consumer&#39;s override often loses — both classes are emitted, and Tailwind&#39;s emission order (not source order) decides which wins. The component looks like it accepts overrides but does not, reliably|||Override của consumer thường THUA — cả hai lớp đều được phát ra, và thứ tự phát sinh của Tailwind (không phải thứ tự viết) quyết định. Component nhìn như nhận override nhưng không, một cách ổn định',
              'The consumer&#39;s override always wins — <code>className</code> is applied last|||Override của consumer luôn thắng — <code>className</code> áp cuối cùng',
              'Nothing — <code>twMerge</code> is a nice-to-have, not required|||Không gì — <code>twMerge</code> là nên-có, không bắt buộc',
              'The component throws a runtime error|||Component ném lỗi runtime',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Reduced-motion respect requires... where should you look FIRST to audit it in a codebase?|||Tôn trọng chuyển động giảm đòi hỏi... bạn nhìn ở đâu TRƯỚC để soát nó trong một kho?',
            options: [
              'The CSS <code>@media (prefers-reduced-motion: reduce)</code> blocks — many codebases guard motion centrally there, not via <code>motion-reduce:</code> utilities scattered on JSX. Auditing utilities alone gives false negatives|||Các khối CSS <code>@media (prefers-reduced-motion: reduce)</code> — nhiều kho chặn chuyển động tập trung ở đó, không qua utility <code>motion-reduce:</code> rải trên JSX. Soát chỉ utility cho ra âm tính giả',
              'The <code>tailwind.config.ts</code> — animations declared without a guard|||<code>tailwind.config.ts</code> — animation khai mà không có lưới chắn',
              'The <code>package.json</code> — for the <code>framer-motion</code> version|||<code>package.json</code> — xem version <code>framer-motion</code>',
              'The <code>meta</code> tag in <code>&lt;head&gt;</code>|||Thẻ <code>meta</code> trong <code>&lt;head&gt;</code>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Sixty of the 526 <code>outline-none</code> uses do NOT replace the focus ring. Which element type dominates that count?|||Sáu mươi trong 526 lượt <code>outline-none</code> KHÔNG vẽ lại vòng focus. Loại phần tử nào chiếm ưu thế trong con số ấy?',
            options: [
              'Inputs (<code>input</code>/<code>textarea</code>/<code>select</code>) — 58 of the 72, which is exactly where keyboard users must see focus to know where they are typing|||Ô nhập (<code>input</code>/<code>textarea</code>/<code>select</code>) — 58 trong 72, đúng chỗ người dùng bàn phím phải thấy focus để biết đang gõ ở đâu',
              'Icons and decorative <code>div</code>s|||Icon và <code>div</code> trang trí',
              'Buttons — designers dislike browser default rings|||Nút — thiết kế không thích vòng mặc định trình duyệt',
              'Modal wrappers — modals steal focus programmatically|||Wrapper modal — modal đoạt focus bằng mã',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
