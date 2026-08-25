const REF = '?ref=%2Fcourses%2Ftailwind-css%2Flearn&reflabel=Tailwind%20CSS';
/**
 * Tailwind CSS — Chương 10: Sách công thức CHẨN ĐOÁN.
 * Sáu bài mỗi bài lấy MỘT chỗ hỏng thật và đi qua nó theo cây quyết định:
 * lớp có tồn tại → có bị đè → thứ tự phát sinh → độ đặc hiệu → source order.
 * Không đoán. Không đập bằng !important.
 */

export default {
  title: 'Chapter 10 — A diagnosis cookbook|||Chương 10 — Sách công thức chẩn đoán',
  slug: 'tw-ch10-chan-doan',
  description: 'Sáu bài đi qua &quot;lớp không ăn&quot; theo cây quyết định thay vì reflex đập bằng !important. Mỗi bài đo lại một chỗ hỏng thật từ tám chương trước và đưa ra chính lệnh dùng để chẩn đoán.',
  sortOrder: 11,
  lessons: [
    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — The decision tree, and the reflex it replaces|||10.1 — Cây quyết định, và cái reflex nó thay',
      slug: 'tw-10-1-cay',
      type: 'VIDEO',
      description: 'Một bảng bốn cột. Cột trái là &quot;lớp không ăn&quot; — cột phải là nguyên nhân. Bốn cột giữa là các câu hỏi Y/N. Không có câu hỏi nào là &quot;thử thêm !important&quot;.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>The decision tree, and the reflex it replaces</h2>
<p class="lead">The default reaction to a Tailwind class that does not apply is to make it stronger — <code>!important</code>, or a more specific selector. That reaction wins the round and loses the war: every future class that would have applied cleanly now has to fight this one too. This chapter&#39;s six lessons all follow the same four-question tree; this lesson lays it out.</p>

<h3>The tree</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Q1</span><span class="lz-t">Was the rule GENERATED?</span><span class="lz-d">If the class does not appear in the built CSS, no amount of specificity will help. Every question below assumes it exists — always check this first. Cause: broken content glob (8.4), dynamic class not extracted (0.1), off-scale value (1.2), missing variant (2.2).</span></div>
<div class="lz-step"><span class="lz-k">Q2</span><span class="lz-t">Is another rule OVERRIDING it?</span><span class="lz-d">If yes, DevTools shows the winner struck through. Read the winner&#39;s selector — that names your competitor. Cause: another utility in the same string (3.2), a hand-written CSS rule (7.2), a parent&#39;s cascaded property.</span></div>
<div class="lz-step"><span class="lz-k">Q3</span><span class="lz-t">Do they have equal SPECIFICITY?</span><span class="lz-d">If the competitor has higher specificity, that&#39;s the answer — you need equal or higher, not <code>!important</code>. Cause: your utility <code>.p-4</code> (0,1,0) loses to <code>.card .body</code> (0,2,0). Fix: add a class-level selector, not a bang.</span></div>
<div class="lz-step"><span class="lz-k">Q4</span><span class="lz-t">Same specificity — which appears LATER in the emitted CSS?</span><span class="lz-d">This is where Tailwind&#39;s ordering (Chapters 3 and 7) actually matters. The utility generated later wins. Reorder your source, or wrap in <code>@layer</code>, or use <code>tailwind-merge</code> — never <code>!important</code>.</span></div>
</div>

<h3>The table</h3>
<div class="out">Cot 1: TRIEU CHUNG      Cot 2: KIEM        Cot 3: NGUYEN NHAN      Cot 4: BAI
"lop khong ap dung"     grep out.css       glob hong                 8.4
                        DevTools ke gach   lop khac dang thang       Q2-Q4
                        computed style     ke thua tu cha            Q3
                        không co trong CSS  do mo tren var()          6.2
                        không co trong CSS  gia tri ngoai thang       1.2
                        không co trong CSS  chuoi noi runtime          0.1
"lop DUOC ap nhung sai" grep out.css       twMerge KHONG chay          3.4
                        DevTools ke gach   utility khac thang         3.2
                        DevTools ke gach   CSS thuong not-layer thang 7.2
                        DevTools ke gach   :hover/dark: chay sai boi   2.2
"dark: KHONG chay"      grep root class    ".dark" chua bat            2.4
                        grep .theme-dark   theme co, dark: chi trong .notes-theme-root
</div>

<div class="callout warn">
<p><strong>The reflex that ends debugging early.</strong> Adding <code>!important</code> stops the current bug and prevents you from learning which of the four questions above was YES. So the next bug in the same area repeats — and now the fix has to route around <code>!important</code>, which usually means adding another <code>!important</code>. Utility CSS collapses fast when this reflex is unchallenged.</p>
</div>

<h3>What each of the next five lessons does</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">10.2 — Q1 walkthrough</span><span class="lz-lnote">given a class the developer THINKS is applied, three checks to prove or disprove it. Uses the 91 dead-alpha classes and the 76 <code>bg-bg-elevated</code> uses</span></div>
<div class="lz-layer"><span class="lz-lname">10.3 — Q2 walkthrough</span><span class="lz-lnote">DevTools&#39; overridden-rule strikethrough, computed style panel, and how to read what Tailwind actually emitted. Uses the mt-8 wins case (3.2)</span></div>
<div class="lz-layer"><span class="lz-lname">10.4 — Q3 walkthrough</span><span class="lz-lnote">specificity beats source order beats <code>@layer</code> beats <code>!important</code>. Uses the 620 hand-written .rich-content rules (7.2) as a real dataset</span></div>
<div class="lz-layer"><span class="lz-lname">10.5 — dynamic classes and the AI trap</span><span class="lz-lnote">the 633 string-concat sites where twMerge does not run (Chapter 4). What AI code generators tend to output, and why that&#39;s the pattern with the most defects per line</span></div>
<div class="lz-layer"><span class="lz-lname">10.6 — chapter quiz</span><span class="lz-lnote">eight questions, twelve minutes</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng cây quyết định such as một checklist tuần tự.</strong> Not every symptom starts at Q1. If you <em>have already seen</em> DevTools strike through the rule, Q1 is plainly answered already (the rule EXISTS, it is merely LOSING). The tree exists so you never SKIP a question, not so you run all four every time.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Every &quot;my class does not apply&quot; question has an answer in one of four places — the rule was never generated, another rule overrode it, the competitor had higher specificity, or the competitor came later in the emitted CSS — and none of those four is fixed by <code>!important</code>.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CSS cascade</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Cascade — the four questions in this lesson map directly to steps in the cascade algorithm.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chrome DevTools — Inspect CSS</span><span class="lc-sub">developer.chrome.com/docs/devtools/css — the overridden-rule strikethrough is the tool that answers Q2, and it is worth learning the shortcut for it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>!important</code></span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/important — the escape hatch, and why the MDN page itself begins by telling you not to use it.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 3 — where the model leaks</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — the ordering rules whose interactions the tree above unpacks.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Cây quyết định, và cái reflex nó thay</h2>
<p class="lead">Phản xạ mặc định khi một lớp Tailwind KHÔNG ăn là làm nó MẠNH HƠN — <code>!important</code>, hoặc một selector đặc hiệu hơn. Phản xạ ấy thắng trận nhưng thua cuộc chiến: mọi lớp tương lai lẽ ra áp được sạch giờ đều phải đấu với cái này. Sáu bài của chương này đều đi theo cùng một cây bốn câu hỏi; bài này bày cây ra.</p>

<h3>Cây</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Q1</span><span class="lz-t">Quy tắc có được PHÁT SINH?</span><span class="lz-d">Nếu lớp KHÔNG có trong CSS đã dựng, không mức đặc hiệu nào cứu được. Mọi câu dưới GIẢ ĐỊNH nó tồn tại — luôn kiểm cái này trước. Nguyên nhân: glob content hỏng (8.4), lớp động không quét được (0.1), giá trị ngoài thang (1.2), thiếu biến thể (2.2).</span></div>
<div class="lz-step"><span class="lz-k">Q2</span><span class="lz-t">Có quy tắc khác đang ĐÈ nó?</span><span class="lz-d">Nếu có, DevTools kẻ gạch lên kẻ thắng. Đọc selector của kẻ thắng — nó đặt tên cho đối thủ của bạn. Nguyên nhân: một utility khác cùng chuỗi (3.2), một quy tắc CSS viết tay (7.2), một thuộc tính cha kế thừa xuống.</span></div>
<div class="lz-step"><span class="lz-k">Q3</span><span class="lz-t">Chúng có cùng ĐỘ ĐẶC HIỆU?</span><span class="lz-d">Nếu đối thủ đặc hiệu hơn, đó là đáp án — bạn cần bằng HOẶC hơn, không phải <code>!important</code>. Nguyên nhân: utility <code>.p-4</code> (0,1,0) thua <code>.card .body</code> (0,2,0). Vá: thêm một tầng selector, không phải một dấu chấm than.</span></div>
<div class="lz-step"><span class="lz-k">Q4</span><span class="lz-t">Cùng độ đặc hiệu — cái nào xuất hiện SAU trong CSS phát sinh?</span><span class="lz-d">Đây là chỗ thứ tự phát sinh của Tailwind (Chương 3 và 7) thật sự có tác dụng. Utility phát sinh SAU thắng. Sắp lại nguồn, bọc <code>@layer</code>, hoặc dùng <code>tailwind-merge</code> — KHÔNG <code>!important</code>.</span></div>
</div>

<h3>Bảng</h3>
<div class="out">Cot 1: TRIEU CHUNG      Cot 2: KIEM        Cot 3: NGUYEN NHAN      Cot 4: BAI
"lop khong ap dung"     grep out.css       glob hong                 8.4
                        DevTools ke gach   lop khac dang thang       Q2-Q4
                        computed style     ke thua tu cha            Q3
                        không co trong CSS  do mo tren var()          6.2
                        không co trong CSS  gia tri ngoai thang       1.2
                        không co trong CSS  chuoi noi runtime          0.1
"lop DUOC ap nhung sai" grep out.css       twMerge KHONG chay          3.4
                        DevTools ke gach   utility khac thang         3.2
                        DevTools ke gach   CSS thuong not-layer thang 7.2
                        DevTools ke gach   :hover/dark: chay sai boi   2.2
"dark: KHONG chay"      grep root class    ".dark" chua bat            2.4
                        grep .theme-dark   theme co, dark: chi trong .notes-theme-root
</div>

<div class="callout warn">
<p><strong>Reflex kết thúc DEBUG sớm.</strong> Thêm <code>!important</code> chặn lại bug hiện tại VÀ ngăn bạn học được câu nào trong bốn câu trên là YES. Nên bug tiếp theo trong cùng vùng lặp lại — và giờ bản vá phải VÒNG QUA <code>!important</code>, thường có nghĩa là thêm một <code>!important</code> nữa. CSS tiện ích sụp nhanh khi reflex này không bị thách thức.</p>
</div>

<h3>Năm bài tiếp theo mỗi bài làm gì</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">10.2 — đi Q1</span><span class="lz-lnote">với một lớp mà lập trình viên NGHĨ là đã áp, ba phép kiểm để chứng minh có hoặc không. Dùng 91 lớp alpha chết và 76 lượt <code>bg-bg-elevated</code></span></div>
<div class="lz-layer"><span class="lz-lname">10.3 — đi Q2</span><span class="lz-lnote">dòng gạch của DevTools cho quy tắc bị đè, bảng computed style, và cách đọc cái Tailwind đã thật sự phát ra. Dùng chỗ mt-8 thắng (3.2)</span></div>
<div class="lz-layer"><span class="lz-lname">10.4 — đi Q3</span><span class="lz-lnote">độ đặc hiệu thắng thứ tự nguồn thắng <code>@layer</code> thắng <code>!important</code>. Dùng 620 quy tắc <code>.rich-content</code> viết tay (7.2) làm dữ liệu thật</span></div>
<div class="lz-layer"><span class="lz-lname">10.5 — lớp động và bẫy AI</span><span class="lz-lnote">633 chỗ nối chuỗi mà twMerge không chạy (Chương 4). Cái mà máy sinh mã AI hay ra, và vì sao đó là mẫu có nhiều khiếm khuyết trên mỗi dòng nhất</span></div>
<div class="lz-layer"><span class="lz-lname">10.6 — kiểm tra chương</span><span class="lz-lnote">tám câu, mười hai phút</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng cây quyết định như một checklist tuần tự.</strong> Không phải mọi triệu chứng đều bắt đầu từ Q1. Nếu bạn <em>đã thấy</em> DevTools kẻ gạch lên quy tắc thì Q1 rõ ràng là đã trả lời rồi (rule EXISTS, just LOSING). Cây là để KHÔNG bỏ sót câu hỏi, không phải để chạy đủ bốn câu mỗi lần.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Mọi câu hỏi &quot;lớp không ăn&quot; đều có đáp án ở một trong bốn chỗ — quy tắc chưa bao giờ được phát sinh, một quy tắc khác đè nó, đối thủ có độ đặc hiệu cao hơn, hoặc đối thủ đến SAU trong CSS phát ra — và KHÔNG cái nào trong bốn được vá bằng <code>!important</code>.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CSS cascade</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Cascade — bốn câu hỏi trong bài này ánh xạ trực tiếp vào các bước trong thuật toán cascade.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chrome DevTools — Inspect CSS</span><span class="lc-sub">developer.chrome.com/docs/devtools/css — dòng gạch cho quy tắc bị đè là công cụ trả lời Q2, và đáng học phím tắt của nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>!important</code></span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/important — cửa thoát, và vì sao chính trang MDN mở đầu bằng lời khuyên KHÔNG dùng nó.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 3 — nơi mô hình rò rỉ</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — các quy tắc thứ tự mà cây trên gỡ ra các tương tác của chúng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — Q1: was the rule generated at all?|||10.2 — Q1: quy tắc có được PHÁT SINH?',
      slug: 'tw-10-2-q1',
      type: 'VIDEO',
      description: 'Ba phép kiểm cho câu hỏi đầu tiên, bằng thứ có sẵn trong terminal. Chạy trên hai chỗ hỏng thật: 91 lớp alpha chết của Chương 6 và 76 lượt `bg-bg-elevated` của Chương 9.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Q1: was the rule generated at all?</h2>
<p class="lead">The first question in the tree is a yes/no with a definite answer. Either the built CSS contains a rule for the class, or it does not. There is no middle ground — and every debugging step downstream assumes the rule exists. This lesson runs the three checks on two classes that look real and are not.</p>

<h3>The three checks</h3>
<pre><code class="language-bash"># 1. tim TRUC TIEP trong file CSS da xay
grep -c 'text-text-muted\\\\/70' out.css

# 2. neu output khong san, gen 1 file thu bang chinh config
npx tailwindcss -i in.css -o probe.css --content './probe.html'

# 3. dan lop vao mot phan tu, mo trinh duyet, xem la co computed style
&lt;div id="x" class="text-text-muted/70 text-xs"&gt;hi&lt;/div&gt;
getComputedStyle(document.getElementById('x')).color
</code></pre>

<h3>Case 1 — <code>text-text-muted/70</code> (Chapter 6)</h3>
<div class="out">$ grep -c 'text-text-muted\\\\/70' out.css
0

$ echo '&lt;p class="text-text-muted/70"&gt;x&lt;/p&gt;' &gt; probe.html
$ npx tailwindcss -c real.config.js -i in.css -o probe.css
$ grep 'text-text-muted' probe.css
.text-text-muted { color: var(--text-muted); }
# KHONG co .text-text-muted\\/70 !
</div>

<p>Zero hits on the exact class. Only the base <code>text-text-muted</code> exists. Q1 answer: <strong>NO</strong> — go read Chapter 6 for why. Every downstream question (Q2/Q3/Q4) does not apply, and no <code>!important</code> can create a rule that Tailwind refused to emit.</p>

<h3>Case 2 — <code>bg-bg-elevated/60</code> (Chapter 9)</h3>
<div class="out">$ grep -c 'bg-bg-elevated' out.css
0

$ grep 'bg-elevated' tailwind.config.ts src/app/globals.css
# (khong ra gi)

$ grep '\\-\\-bg-elevated' src/app/globals.css
# (khong ra gi)
</div>

<p>Zero everywhere. Not in the built CSS, not in the config, and not as a CSS variable. The name looked plausible — <code>bg-bg-elevated</code> follows the pattern <code>bg-&lt;colour-token&gt;</code>, and colour tokens like <code>bg-darkbg</code> do exist — but no such colour token was ever declared. Forty elements are asking Tailwind for a background that Tailwind cannot compose. All forty render fully transparent instead.</p>

<div class="callout warn">
<p><strong>Why TypeScript, ESLint and Prettier all stay silent.</strong> All three see the string <code>&quot;bg-bg-elevated/60&quot;</code> as an arbitrary one — <code>className</code> is typed <code>string</code>. Only Tailwind knows what that string means, and Tailwind's chosen response is to <em>emit nothing</em> when it does not recognise it. There is no channel through which to complain.</p>
</div>

<h3>Four common reasons Q1 comes back NO</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">glob <code>content</code> is broken</span><span class="lz-d">lesson 8.4 — <code>src</code> mistyped as <code>SRC-TYPO</code>produced a 10,379-byte build with no classes beyond Preflight. This is the worst kind of Q1=NO, because <em>EVERY</em> class in that file disappears, not just one.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">a string concatenated at runtime</span><span class="lz-d">lesson 0.1 — <code>&#96;text-\${size}&#96;</code>, Tailwind only sees the string <code>text-</code>. The COMPLETE class name has to appear somewhere Tailwind scans, or you need a safelist.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">a value off the scale</span><span class="lz-d">lesson 1.2 — <code>w-4.5</code> does not exist, because the scale only goes <code>.5, 1.5, 2.5, 3.5</code>. Either use an arbitrary value <code>w-[18px]</code>, or extend the scale in the config.</span></div>
<div class="lz-step"><span class="lz-k">d</span><span class="lz-t">a modifier on a token that does not support it</span><span class="lz-d">lesson 6.2 — <code>text-text-muted/70</code>, because <code>--text-muted</code> is declared as a bare <code>var()</code> rather than as RGB channels. Both the variable and the config have to be rewritten.</span></div>
</div>

<h3>The second check — run it for real</h3>
<pre><code class="language-html">&lt;!doctype html&gt;
&lt;head&gt;&lt;style id="probe"&gt;&lt;/style&gt;&lt;/head&gt;
&lt;body class="theme-light"&gt;
  &lt;p id="x" class="text-text-muted/70 text-xs"&gt;test&lt;/p&gt;
&lt;/body&gt;
&lt;script&gt;
  const rules = [...document.styleSheets[0].cssRules];
  console.log('rule count:', rules.length);
  console.log('color:', getComputedStyle(x).color);
&lt;/script&gt;
</code></pre>

<div class="out">rule count: 5
color: rgb(138, 141, 145)     &lt;- MAU DAY, khong phai 70% alpha
                                 &lt;- text-text-muted (base) da AP,
                                    text-text-muted/70 KHONG co
</div>

<p>The final check is to run it in a real browser and read <code>getComputedStyle</code>. The text has the <em>full</em> colour rather than 70% of it — in other words the base class applies and the opacity modifier does NOT. That matches what step 2 said: Tailwind does NOT emit <code>.text-text-muted\\/70</code>.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng công cụ &quot;class-name checker&quot; trực tuyến.</strong> They run a default Tailwind CLI on their own servers, WITHOUT your config. <code>bg-bg-elevated/60</code> is valid IF you declare <code>--bg-elevated</code> — and that site has no way of knowing. A WRONG answer from it is very hard to tell apart from a right one, and you can spend an entire evening trying to fix something broken by config rather than by the class.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Q1 is answered by three checks in order — <code>grep</code> the built CSS, generate a probe build with your own config, and read <code>getComputedStyle</code> in the browser — and when they all say NO, the class does not exist and no downstream question or <code>!important</code> can bring it into being.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind — Detecting classes in source files</span><span class="lc-sub">tailwindcss.com/docs/detecting-classes-in-source-files — bốn nguyên nhân Q1=NO liệt kê nguyên trong trang này, đặc biệt phần &quot;Dynamic class names&quot;.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — getComputedStyle</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle — phép đo cuối, không thể sai vì nó đọc chính bảng kiểu trình duyệt đã áp.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — CSS variables and the alpha trap</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — vì sao <code>text-text-muted/70</code> KHÔNG phát sinh, và bản vá hai file cho nó.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Q1: quy tắc có được PHÁT SINH?</h2>
<p class="lead">Câu hỏi đầu tiên trong cây là một Y/N có đáp án dứt khoát. Hoặc CSS đã dựng chứa quy tắc cho lớp đó, hoặc không. Không có ở giữa — và mọi bước debug xuôi dòng GIẢ ĐỊNH quy tắc tồn tại. Bài này chạy ba phép kiểm trên hai lớp trông có vẻ thật mà KHÔNG.</p>

<h3>Ba phép kiểm</h3>
<pre><code class="language-bash"># 1. tim TRUC TIEP trong file CSS da xay
grep -c 'text-text-muted\\\\/70' out.css

# 2. neu output khong san, gen 1 file thu bang chinh config
npx tailwindcss -i in.css -o probe.css --content './probe.html'

# 3. dan lop vao mot phan tu, mo trinh duyet, xem la co computed style
&lt;div id="x" class="text-text-muted/70 text-xs"&gt;hi&lt;/div&gt;
getComputedStyle(document.getElementById('x')).color
</code></pre>

<h3>Case 1 — <code>text-text-muted/70</code> (Chương 6)</h3>
<div class="out">$ grep -c 'text-text-muted\\\\/70' out.css
0

$ echo '&lt;p class="text-text-muted/70"&gt;x&lt;/p&gt;' &gt; probe.html
$ npx tailwindcss -c real.config.js -i in.css -o probe.css
$ grep 'text-text-muted' probe.css
.text-text-muted { color: var(--text-muted); }
# KHONG co .text-text-muted\\/70 !
</div>

<p>Không lượt nào cho lớp chính xác đó. Chỉ base <code>text-text-muted</code> tồn tại. Đáp án Q1: <strong>KHÔNG</strong> — đi đọc Chương 6 để biết vì sao. Mọi câu hỏi xuôi dòng (Q2/Q3/Q4) KHÔNG áp dụng, và không <code>!important</code> nào tạo ra được một quy tắc mà Tailwind đã từ chối phát ra.</p>

<h3>Case 2 — <code>bg-bg-elevated/60</code> (Chương 9)</h3>
<div class="out">$ grep -c 'bg-bg-elevated' out.css
0

$ grep 'bg-elevated' tailwind.config.ts src/app/globals.css
# (khong ra gi)

$ grep '\\-\\-bg-elevated' src/app/globals.css
# (khong ra gi)
</div>

<p>Không đâu có. Không trong CSS đã dựng, không trong config, và không dưới dạng biến CSS. Cái tên NGHE hợp lý — <code>bg-bg-elevated</code> theo mẫu <code>bg-&lt;token-mau&gt;</code>, và các token màu như <code>bg-darkbg</code> có tồn tại — nhưng KHÔNG token màu nào tên vậy đã được khai. Bốn mươi phần tử đang xin Tailwind một nền mà Tailwind không dựng được. Cả bốn mươi vẽ ra <em>trong suốt hoàn toàn</em>.</p>

<div class="callout warn">
<p><strong>Vì sao TypeScript, ESLint và Prettier đều không cảnh báo.</strong> Cả ba đều nhìn thấy chuỗi <code>&quot;bg-bg-elevated/60&quot;</code> như một chuỗi tuỳ ý — <code>className</code> có kiểu <code>string</code>. Chỉ Tailwind biết chuỗi ấy có nghĩa gì, và Tailwind chọn phản ứng bằng cách <em>không phát ra gì</em> khi nó không biết. Không có kênh nào để phàn nàn.</p>
</div>

<h3>Bốn lý do phổ biến Q1 trả về NO</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">glob <code>content</code> hỏng</span><span class="lz-d">bài 8.4 — <code>src</code> gõ nhầm thành <code>SRC-TYPO</code>, build ra 10.379 byte và không lớp nào ngoài Preflight. Đây là kiểu Q1=NO tồi tệ nhất vì <em>MỌI</em> lớp trong file đó biến mất, không chỉ một lớp.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">chuỗi nối thời điểm chạy</span><span class="lz-d">bài 0.1 — <code>&#96;text-\${size}&#96;</code>, Tailwind chỉ nhìn thấy chuỗi <code>text-</code>. Cần viết tên lớp HOÀN CHỈNH ở đâu đó Tailwind quét được, hoặc dùng safelist.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">giá trị ngoài thang</span><span class="lz-d">bài 1.2 — <code>w-4.5</code> không có, vì thang chỉ có <code>.5, 1.5, 2.5, 3.5</code>. Hoặc dùng giá trị tuỳ ý <code>w-[18px]</code>, hoặc mở rộng thang trong config.</span></div>
<div class="lz-step"><span class="lz-k">d</span><span class="lz-t">bổ từ trên token không hỗ trợ</span><span class="lz-d">bài 6.2 — <code>text-text-muted/70</code>, vì <code>--text-muted</code> khai là <code>var()</code> trần chứ không phải kênh RGB. Cần viết lại cả biến và config.</span></div>
</div>

<h3>Cái thứ hai — chạy thực tế</h3>
<pre><code class="language-html">&lt;!doctype html&gt;
&lt;head&gt;&lt;style id="probe"&gt;&lt;/style&gt;&lt;/head&gt;
&lt;body class="theme-light"&gt;
  &lt;p id="x" class="text-text-muted/70 text-xs"&gt;test&lt;/p&gt;
&lt;/body&gt;
&lt;script&gt;
  const rules = [...document.styleSheets[0].cssRules];
  console.log('rule count:', rules.length);
  console.log('color:', getComputedStyle(x).color);
&lt;/script&gt;
</code></pre>

<div class="out">rule count: 5
color: rgb(138, 141, 145)     &lt;- MAU DAY, khong phai 70% alpha
                                 &lt;- text-text-muted (base) da AP,
                                    text-text-muted/70 KHONG co
</div>

<p>Kiểm cuối là chạy thật trong trình duyệt và đọc <code>getComputedStyle</code>. Chữ có màu <em>đầy đủ</em> chứ không phải 70% — nói khác đi, lớp base áp và bổ từ độ mờ KHÔNG. Trùng khớp với những gì bước 2 nói: Tailwind KHÔNG phát ra <code>.text-text-muted\\/70</code>.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng công cụ &quot;class-name checker&quot; trực tuyến.</strong> Chúng chạy Tailwind CLI mặc định trên máy chủ họ, KHÔNG có config của bạn. <code>bg-bg-elevated/60</code> hợp lệ NẾU bạn khai <code>--bg-elevated</code> — trang web đó không biết. Câu trả lời NHẦM đến từ đó rất khó phân biệt với câu trả lời đúng, và bạn có thể dành cả buổi tối cố sửa một thứ đã hỏng do config chứ không phải do lớp.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Q1 trả lời bằng ba phép kiểm theo thứ tự — <code>grep</code> CSS đã dựng, sinh một bản thử với chính config của bạn, và đọc <code>getComputedStyle</code> trong trình duyệt — và khi cả ba đều nói KHÔNG, lớp KHÔNG tồn tại và không câu hỏi xuôi dòng nào hay <code>!important</code> nào tạo ra được nó.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind — Detecting classes in source files</span><span class="lc-sub">tailwindcss.com/docs/detecting-classes-in-source-files — bốn nguyên nhân Q1=NO liệt kê nguyên trong trang này, đặc biệt phần &quot;Dynamic class names&quot;.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — getComputedStyle</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle — phép đo cuối, không thể sai vì nó đọc chính bảng kiểu trình duyệt đã áp.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — biến CSS và bẫy alpha</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — vì sao <code>text-text-muted/70</code> KHÔNG phát sinh, và bản vá hai file cho nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — Q2: DevTools tells you the winner|||10.3 — Q2: DevTools nói cho bạn KẺ THẮNG',
      slug: 'tw-10-3-q2',
      type: 'VIDEO',
      description: 'Khi quy tắc TỒN TẠI nhưng KHÔNG áp, DevTools kẻ gạch lên nó và hiển thị cái đang thắng ngay trên đó. Bài này đọc dòng gạch của mười một `mt-*` từ Chương 3 và trả lời tại sao `mt-8` thắng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Q2: DevTools tells you the winner</h2>
<p class="lead">If Q1 returned YES — the rule exists — the class is losing to something. That something has a name, and DevTools writes it down every time. This lesson reads that answer for a case where reasoning about it in your head would give the wrong result.</p>

<h3>Chapter 3&#39;s eleven-class case</h3>
<pre><code class="language-html">&lt;div class="mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32"&gt;
</code></pre>

<p>Common guesses: the last one wins (<code>mt-32</code>), the biggest wins (<code>mt-32</code>), the first one wins (<code>mt-1</code>). All three are wrong — <strong>mt-8 wins</strong>, and DevTools tells you so without any of the reasoning above.</p>

<h3>The Styles panel view</h3>
<div class="out">Styles                                          Filter  :hov  .cls  +
──────────────────────────────────────────────
element.style {
}

.mt-8 {
  margin-top: 2rem;
}

.mt-1 { margin-top: 0.25rem; }       &lt;- xam nhat, KE GACH DUC
.mt-10 { margin-top: 2.5rem; }       &lt;- xam nhat, KE GACH DUC
.mt-12 { margin-top: 3rem; }         &lt;- KE GACH DUC
.mt-16 { margin-top: 4rem; }         &lt;- KE GACH DUC
.mt-2 { margin-top: 0.5rem; }        &lt;- KE GACH DUC
.mt-20 { margin-top: 5rem; }         &lt;- KE GACH DUC
.mt-24 { margin-top: 6rem; }         &lt;- KE GACH DUC
.mt-3 { margin-top: 0.75rem; }       &lt;- KE GACH DUC
.mt-32 { margin-top: 8rem; }         &lt;- KE GACH DUC
.mt-4 { margin-top: 1rem; }          &lt;- KE GACH DUC
</div>

<p>Chrome, Firefox, Safari — all three render overridden rules with a line through them. The winner is the ONLY rule <em>without</em> the strikethrough. Reading top to bottom: <code>mt-8</code> at the top wins, everything else is crossed out.</p>

<div class="callout ok">
<p><strong>The panel is ordered by outcome, not by source.</strong> The winner sits at the top, followed by losers in the order they were emitted in the CSS. This is why <em>reading</em> the panel is faster than <em>reasoning</em> about the panel: the browser already ran the cascade algorithm, and the answer is at the top.</p>
</div>

<h3>Reading the order of the losers</h3>
<p>The losers' order in the panel is NOT the order you wrote them. It is the order they appear in the generated CSS:</p>

<div class="out">Thu tu VIET:      mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32
Thu tu PHAT SINH: mt-1 mt-10 mt-12 mt-16 mt-2 mt-20 mt-24 mt-3 mt-32 mt-4 mt-8
                                                                            ─────
                                                                          kẻ THẮNG
</div>

<p>This is what Chapter 3.1 measured: Tailwind sorts by <strong>character string</strong> and not by <strong>số</strong>. <code>&quot;8&quot;</code> comes LAST when the strings are <code>&quot;1&quot;, &quot;10&quot;, &quot;12&quot;, &quot;16&quot;, &quot;2&quot;, ...</code> sorted alphabetically. Whichever comes LATER in the CSS wins. You do not need to know the sorting algorithm to use DevTools — but knowing it explains why <code>mt-8</code> wins rather than <code>mt-32</code> hay <code>mt-1</code>.</p>

<h3>Three kinds of &quot;winner&quot; you may see</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">a DIFFERENT Tailwind utility</span><span class="lz-nsub">such as <code>mt-8</code> above</span></span>
<span class="lz-nbody">Cause: you have several utilities for the same property in one string. Fix: run the string through <code>cn()</code> (Chapter 3.4), or remove the redundant utility.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">an ordinary CSS rule</span><span class="lz-nsub">a selector that does not look like Tailwind</span></span>
<span class="lz-nbody">For example <code>.rich-content h2 { margin-top: 0 }</code> đè <code>.mt-4</code>. Cause: Chapter 7's 620 hand-written rules. Fix: check specificity at Q3, rather than reaching reflexively for an exclamation mark.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">inherited from a PARENT</span><span class="lz-nsub">no selector is struck through at all</span></span>
<span class="lz-nbody">If the Styles panel strikes nothing through and the computed value still differs, the property is INHERITED from a parent. For example <code>color</code> và <code>font-family</code> always inherits. Fix: set it explicitly on the element itself.</span>
</div>
</div>

<h3>Why ASK Q2 at all if DevTools answers it for you?</h3>
<p>Because with 6,562 className strings carrying arbitrary values in this repo (the §C measurement), pulling up a browser for each would take a whole evening. Q2 exists so YOU can locate the break in your head <em>before</em> opening DevTools, so that when you do open it, it is to confirm rather than to search. The three kinds in the <code>lz-map</code> above are three hypotheses worth trying.</p>

<div class="pitfall">
<p><strong>Bẫy — đọc panel Computed thay vì panel Styles.</strong> The Computed panel gives you <em>số</em> that applied; it does NOT tell you who applied it. You will see <code>margin-top: 2rem</code> and have no idea whether it came from <code>mt-8</code>, from an ordinary CSS rule, or from the default value itself. The Styles panel has strikethroughs; the Computed panel does not.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> When Q1 comes back YES (the rule exists) but the class still does not apply, DevTools&#39; Styles panel lists the winner at the TOP without a strikethrough and every loser below it struck through — and the losers' order is the generated CSS order, which explains why <code>mt-8</code> wins when reading the string with your eyes suggests <code>mt-32</code> should.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chrome DevTools — CSS Overview and Styles pane</span><span class="lc-sub">developer.chrome.com/docs/devtools/css/reference — dòng gạch, phím tắt Cmd/Ctrl+Shift+C để chọn phần tử, các nhóm rule.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Firefox DevTools — Examine CSS</span><span class="lc-sub">firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/examine_and_edit_css — hoạt động giống Chrome, kèm bảng &quot;Inactive CSS&quot; xịn hơn giải thích vì sao quy tắc KHÔNG áp.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 3 — where the model leaks</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — cơ chế sắp xếp phía sau vì sao <code>mt-8</code> thắng, và <code>cn()</code> khôi phục trực giác.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Q2: DevTools nói cho bạn KẺ THẮNG</h2>
<p class="lead">Nếu Q1 trả CÓ — quy tắc tồn tại — thì lớp đang THUA một cái gì đó. Cái đó có tên, và DevTools ghi ra mỗi lần. Bài này đọc câu trả lời ấy cho một trường hợp mà nghĩ trong đầu sẽ ra sai đáp án.</p>

<h3>Trường hợp mười một lớp của Chương 3</h3>
<pre><code class="language-html">&lt;div class="mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32"&gt;
</code></pre>

<p>Đoán phổ biến: cái cuối thắng (<code>mt-32</code>), cái lớn nhất thắng (<code>mt-32</code>), cái đầu thắng (<code>mt-1</code>). Cả ba đều sai — <strong>mt-8 thắng</strong>, và DevTools nói cho bạn biết mà không cần suy luận gì.</p>

<h3>Bảng Styles ở DevTools</h3>
<div class="out">Styles                                          Filter  :hov  .cls  +
──────────────────────────────────────────────
element.style {
}

.mt-8 {
  margin-top: 2rem;
}

.mt-1 { margin-top: 0.25rem; }       &lt;- xam nhat, KE GACH DUC
.mt-10 { margin-top: 2.5rem; }       &lt;- xam nhat, KE GACH DUC
.mt-12 { margin-top: 3rem; }         &lt;- KE GACH DUC
.mt-16 { margin-top: 4rem; }         &lt;- KE GACH DUC
.mt-2 { margin-top: 0.5rem; }        &lt;- KE GACH DUC
.mt-20 { margin-top: 5rem; }         &lt;- KE GACH DUC
.mt-24 { margin-top: 6rem; }         &lt;- KE GACH DUC
.mt-3 { margin-top: 0.75rem; }       &lt;- KE GACH DUC
.mt-32 { margin-top: 8rem; }         &lt;- KE GACH DUC
.mt-4 { margin-top: 1rem; }          &lt;- KE GACH DUC
</div>

<p>Chrome, Firefox, Safari — cả ba đều vẽ quy tắc bị đè bằng một dòng gạch qua. Kẻ THẮNG là quy tắc DUY NHẤT <em>không</em> có dòng gạch. Đọc từ trên xuống: <code>mt-8</code> trên cùng thắng, mọi thứ khác gạch.</p>

<div class="callout ok">
<p><strong>Bảng sắp theo KẾT QUẢ, không theo NGUỒN.</strong> Kẻ thắng ngồi trên cùng, kế đến là các kẻ thua theo thứ tự chúng được phát sinh trong CSS. Đó là lý do <em>đọc</em> bảng nhanh hơn <em>suy luận</em> về bảng: trình duyệt đã chạy thuật toán cascade rồi, và đáp án ở trên cùng.</p>
</div>

<h3>Đọc thứ tự các kẻ thua</h3>
<p>Các kẻ thua có thứ tự trong bảng KHÔNG phải là thứ tự bạn viết chúng. Đó là thứ tự chúng xuất hiện trong CSS phát sinh:</p>

<div class="out">Thu tu VIET:      mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32
Thu tu PHAT SINH: mt-1 mt-10 mt-12 mt-16 mt-2 mt-20 mt-24 mt-3 mt-32 mt-4 mt-8
                                                                            ─────
                                                                          ke THANG
</div>

<p>Đây là chỗ Chương 3.1 đã đo: Tailwind sắp theo <strong>chuỗi ký tự</strong> chứ không theo <strong>số</strong>. <code>&quot;8&quot;</code> đứng CUỐI khi các chuỗi <code>&quot;1&quot;, &quot;10&quot;, &quot;12&quot;, &quot;16&quot;, &quot;2&quot;, ...</code> sắp theo alphabet. Kẻ ĐẾN SAU trong CSS thắng. Bạn không cần biết thuật toán sắp xếp để dùng DevTools — nhưng biết nó giải thích được vì sao <code>mt-8</code> thắng, không phải <code>mt-32</code> hay <code>mt-1</code>.</p>

<h3>Ba loại &quot;kẻ thắng&quot; bạn có thể thấy</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">một utility Tailwind KHÁC</span><span class="lz-nsub">như <code>mt-8</code> ở trên</span></span>
<span class="lz-nbody">Nguyên nhân: bạn có nhiều utility cùng thuộc tính trong cùng một chuỗi. Vá: chạy chuỗi qua <code>cn()</code> (Chương 3.4), hoặc gỡ bớt utility thừa.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">một quy tắc CSS thường</span><span class="lz-nsub">selector trông không giống Tailwind</span></span>
<span class="lz-nbody">Ví dụ <code>.rich-content h2 { margin-top: 0 }</code> đè <code>.mt-4</code>. Nguyên nhân: 620 quy tắc viết tay của Chương 7. Vá: kiểm độ đặc hiệu ở Q3, không phải reflex thêm bang.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">kế thừa từ CHA</span><span class="lz-nsub">không có selector nào ke gach lên</span></span>
<span class="lz-nbody">Nếu bảng Styles không có rule nào ke gach mà computed vẫn khác, thuộc tính bị KẾ THỪA từ cha. Ví dụ <code>color</code> và <code>font-family</code> luôn kế thừa. Vá: đặt lại explicit trên chính phần tử.</span>
</div>
</div>

<h3>Sao lại vẫn HỎI Q2 nếu DevTools trả lời sẵn?</h3>
<p>Vì trong 6.562 chuỗi className có giá trị tuỳ ý ở kho này (bài §C phép đo), việc lôi ra một trình duyệt cho mỗi cái sẽ là một cả buổi tối. Q2 tồn tại để BẠN đoán được trong đầu chỗ hỏng ở đâu <em>trước</em> khi mở DevTools, sao cho khi mở là để xác nhận chứ không phải để tìm. Ba loại trong <code>lz-map</code> trên là ba giả thiết được đáng thử.</p>

<div class="pitfall">
<p><strong>Bẫy — đọc panel Computed thay vì panel Styles.</strong> Panel Computed cho bạn <em>số</em> đã áp; nó KHÔNG cho bạn biết ai đã áp nó. Bạn sẽ thấy <code>margin-top: 2rem</code> và không biết nó đến từ <code>mt-8</code>, hay từ một quy tắc CSS thường, hay từ chính giá trị mặc định. Panel Styles có dòng gạch; panel Computed không.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Khi Q1 trả về CÓ (rule tồn tại) nhưng lớp vẫn không áp, DevTools&#39; Styles panel liệt kê kẻ thắng ở TRÊN CÙNG mà không kẻ gạch và tất cả kẻ thua ở dưới với kẻ gạch — thứ tự các kẻ thua chính là thứ tự CSS phát sinh, giải thích được vì sao <code>mt-8</code> thắng khi bạn đọc chuỗi bằng mắt và nghĩ <code>mt-32</code> sẽ thắng.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chrome DevTools — CSS Overview and Styles pane</span><span class="lc-sub">developer.chrome.com/docs/devtools/css/reference — dòng gạch, phím tắt Cmd/Ctrl+Shift+C để chọn phần tử, các nhóm rule.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Firefox DevTools — Examine CSS</span><span class="lc-sub">firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/examine_and_edit_css — hoạt động giống Chrome, kèm bảng &quot;Inactive CSS&quot; xịn hơn giải thích vì sao quy tắc KHÔNG áp.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 3 — nơi mô hình rò rỉ</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — cơ chế sắp xếp phía sau vì sao <code>mt-8</code> thắng, và <code>cn()</code> khôi phục trực giác.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — Q3 and Q4: specificity, then source order|||10.4 — Q3 và Q4: độ đặc hiệu, rồi thứ tự nguồn',
      slug: 'tw-10-4-q34',
      type: 'VIDEO',
      description: 'Bốn cách phá hoà — theo thứ tự chi phí: sắp lại nguồn, wrap `@layer`, tăng độ đặc hiệu, `!important`. Áp dụng vào ba tình huống thật, và chỉ ra chỗ mỗi cách hỏng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Q3 and Q4: specificity, then source order</h2>
<p class="lead">If Q1 says the rule exists and Q2 names the winner, you now know a fight is happening. Q3 decides whether specificity settled it and Q4 decides whether source order did. This lesson runs both against the same repository&#39;s real defect from Chapter 7 — the 620 unlayered rules of hand-written CSS — and shows the four available fixes ordered by cost.</p>

<h3>The specificity comparison</h3>
<pre><code class="language-text">DevTools mo phan tu. Panel Styles cho:

.rich-content .body p { color: red; }             specificity 0,2,1  &lt;- winner
.text-blue-500          { color: rgb(59,130,246); } specificity 0,1,0  &lt;- crossed
</code></pre>

<p>Read the two numbers in the &quot;Specificity&quot; column of DevTools (or count: <em>id, class-or-attribute, element</em>). Higher wins. Same-level ties fall through to Q4 (source order). This is not Tailwind rules — this is the CSS cascade algorithm that every rule participates in.</p>

<h3>Four ways to break the tie — ordered by cost</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">REORDER the source (Q4)</span><span class="lz-d">Cost: nearly ZERO. Only applies when both sides have the SAME specificity. Example: two utilities in one string — let <code>cn()</code> resolve it. Another example: a single-class ordinary CSS rule losing to a utility because it was written BEFORE the Tailwind directives — move it below them.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">wrap <code>@layer</code> (Q4)</span><span class="lz-d">Cost: one line. Put the rule inside <code>@layer components</code> and Tailwind RELOCATES it between base and utilities (lesson 7.1). Use it only when you want utilities to <em>đè</em> it — a component default that still allows an override, say.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">RAISE the specificity (Q3)</span><span class="lz-d">Cost: a longer selector. Applies when Q3 says the rival has HIGHER specificity. Example: <code>.card &gt; .card__body</code> overrides a single <code>.p-4</code> utility because 0,2,0 &gt; 0,1,0. Fix: restructure the HTML so no double class is needed, or accept that the utility simply is not specific enough.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><code>!important</code></span><span class="lz-d">Cost: every FUTURE utility on that same property now also has to be <code>!important</code>. Applies IF AND ONLY IF you do not control the rival selector (a third party, a UI library). In this repo the legitimate scope is so small that none of the 620 <code>.rich-content</code> rules needs it.</span></div>
</div>

<h3>Three real situations</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Situation A</span><span class="lz-nsub"><code>mt-8 mt-32</code></span></span>
<span class="lz-nbody">Q1 YES. Q2's winner is <code>.mt-8</code>. Q3 puts both at 0,1,0 — a TIE. Q4: <code>.mt-8</code> is generated LATER in the CSS. Fix: <strong>number 1</strong> — run the string through <code>cn()</code>. Cost: none.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Situation B</span><span class="lz-nsub"><code>.rich-content h2</code> đè <code>.mt-4</code></span></span>
<span class="lz-nbody">Q1 YES. Q2's winner is <code>.rich-content h2</code>. Q3 puts the rival at 0,1,1 against the utility's 0,1,0. Fix: <strong>number 3</strong> — accept that inside <code>.rich-content</code> the h2 elements have their OWN margins, and rewrite the h2 rule inside it if that needs changing. Not a place to hammer with a utility.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Situation C</span><span class="lz-nsub">a library component with an inline style</span></span>
<span class="lz-nbody">Q1 YES. Q2's winner is <code>element.style</code> (0,0,0, with the tie-breaker). Q3: every utility loses to an inline style. Fix: <strong>number 4</strong> — <code>!</code> Tailwind's prefix (<code>!mt-4</code>) — because you cannot edit that component's inline style. This is the ONLY legitimate case for <code>!important</code>.</span>
</div>
</div>

<h3>Đo trên 620 quy tắc <code>.rich-content</code></h3>
<pre><code class="language-python"># chuyen tung quy tac thanh (do dac hieu, selector, dai)
for m in re.finditer(r'\\.rich-content[^{}]*\\{', globals_css):
    sel = m.group(0).rstrip('{').strip()
    a = sel.count('#')
    b = sel.count('.') + len(re.findall(r'\\[', sel)) + sel.count(':')
    c = len(re.findall(r'\\b[a-z]+\\b', sel)) - sel.count('.') - sel.count('#')
    ...
</code></pre>

<div class="out">phan bo do dac hieu cua 620 quy tac .rich-content:
  0,1,0 (chi mot lop)              :  40   &lt;- utility co the hoa
  0,2,0 (hai lop hoac lop+attr)     :  87   &lt;- utility THUA vinh vien
  0,1,1 (lop + phan tu)             : 128   &lt;- utility THUA vinh vien
  0,2,1 (con chau + phan tu)        : 232   &lt;- utility THUA vinh vien
  cao hon                           : 133

40 / 620 = 6,5% co the phi vi utility. 93,5% con lai la Q3 va Q4 khong voi toi.
</div>

<div class="callout">
<p><strong>Why the 93.5% figure matters.</strong> It says that trying to &quot;override rich-content with a utility&quot; is a wrong model — not a Tailwind fault. The right way is to fix <code>.rich-content</code> or to use a DIFFERENT wrapper without <code>.rich-content</code>, rather than hammering each spot with <code>!important</code>.</p>
</div>

<h3>The compact decision table</h3>
<pre><code class="language-text">Q3: do dac hieu doi thu &gt; ban?
     ↓ CÓ                                ↓ HOÀ
     &gt; ĐỔI CẤU TRÚC (number 3)               Q4: doi thu phat sinh SAU?
     &gt; or chấp nhận thua                     ↓ CÓ           ↓ KHÔNG
                                              &gt; SẮP LẠI      &gt; đã ok!
                                                (number 1 or 2)
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — cho rằng <code>@layer</code> (lesson 7.1) &quot;settles every dispute&quot;.</strong> NO. It only helps when Q3 TIES. A <code>.rich-content .body</code> rule at specificity 0,2,1 wrapped in <code>@layer components</code> still loses to a <code>.text-red-500</code> at 0,1,0 if — and only if — the utility is generated later. <em>Specificity still decides before layers do.</em></p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Q3 (specificity) and Q4 (source order) are considered in exactly that order, and the four ways to break a tie differ in cost by an order of magnitude — reordering the source is nearly free, <code>@layer</code> costs one line, raising specificity costs a longer selector, and <code>!important</code> costs you <em>every</em> future utility on that same property — so it is only worth it for third-party components you cannot edit.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CSS Specificity</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Specificity — cách đếm <em>id, class, element</em>, và bảng tie-breaker khi so hai selector.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind — <code>!</code> prefix</span><span class="lc-sub">tailwindcss.com/docs/configuration#important-modifier — cú pháp <code>!mt-4</code> thay cho <code>mt-4 !important</code>, và khuyến cáo dùng &quot;tối thiểu&quot; vì lý do bài này giải thích.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — cascade layers</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@layer — khác biệt giữa <code>@layer</code> of a CSS và <code>@layer</code> of a Tailwind (bài 7.1 đã đo: Tailwind XOÁ nó).</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 7 — <code>@layer</code> and the real mechanism</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — sáu bài về cách 88% CSS thường of a kho này không đi qua layer, và ai thắng khi có tranh chấp.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Q3 và Q4: độ đặc hiệu, rồi thứ tự nguồn</h2>
<p class="lead">Nếu Q1 nói quy tắc TỒN TẠI và Q2 nói tên kẻ thắng, bạn đã biết một cuộc chiến đang diễn ra. Q3 quyết định độ đặc hiệu có phân thắng bại chưa và Q4 quyết định thứ tự nguồn có. Bài này chạy cả hai trên đúng khiếm khuyết thật của Chương 7 — 620 quy tắc CSS thường viết tay — và chỉ ra bốn cách vá xếp theo chi phí.</p>

<h3>So độ đặc hiệu</h3>
<pre><code class="language-text">DevTools mo phan tu. Panel Styles cho:

.rich-content .body p { color: red; }             specificity 0,2,1  &lt;- winner
.text-blue-500          { color: rgb(59,130,246); } specificity 0,1,0  &lt;- crossed
</code></pre>

<p>Đọc hai con số trong cột &quot;Specificity&quot; của DevTools (hoặc đếm: <em>id, class-hoặc-attribute, element</em>). Cao hơn thắng. Hoà cùng cấp thì rơi xuống Q4 (thứ tự nguồn). Đây KHÔNG phải quy tắc của Tailwind — đây là thuật toán cascade của CSS mà mọi quy tắc đều tham gia.</p>

<h3>Bốn cách phá hoà — sắp theo chi phí</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">SẮP LẠI nguồn (Q4)</span><span class="lz-d">Chi phí: gần bằng KHÔNG. Chỉ áp khi hai bên CÙNG độ đặc hiệu. Ví dụ: hai utility trong cùng chuỗi — cho <code>cn()</code> giải quyết. Ví dụ khác: một quy tắc CSS thường lớp-đơn thua utility vì viết TRƯỚC directives Tailwind — chuyển nó xuống dưới.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">wrap <code>@layer</code> (Q4)</span><span class="lz-d">Chi phí: một dòng. Đặt quy tắc trong <code>@layer components</code> và Tailwind DI DỜI nó vào giữa base và utilities (bài 7.1). Chỉ dùng khi bạn muốn utility <em>đè</em> nó — ví dụ default cho một component nhưng cho phép override.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">TĂNG độ đặc hiệu (Q3)</span><span class="lz-d">Chi phí: một selector dài hơn. Áp khi Q3 nói đối thủ có độ đặc hiệu CAO HƠN. Ví dụ: <code>.card &gt; .card__body</code> đè utility <code>.p-4</code> đơn vì 0,2,0 &gt; 0,1,0. Vá: đổi cấu trúc HTML để không cần double-class, hoặc chấp nhận rằng utility ĐANG không đủ đặc hiệu.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><code>!important</code></span><span class="lz-d">Chi phí: mọi utility TƯƠNG LAI trên cùng thuộc tính giờ cũng phải <code>!important</code>. Áp KHI VÀ CHỈ KHI: bạn không kiểm soát selector đối thủ (bên thứ ba, thư viện UI). Trong chính kho này, phạm vi hợp lệ nhỏ đến mức không có ví dụ nào trong 620 quy tắc <code>.rich-content</code> cần đến nó.</span></div>
</div>

<h3>Ba tình huống thật</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Tình huống A</span><span class="lz-nsub"><code>mt-8 mt-32</code></span></span>
<span class="lz-nbody">Q1 CÓ. Q2 kẻ thắng là <code>.mt-8</code>. Q3 cả hai đều 0,1,0 — HOÀ. Q4: <code>.mt-8</code> phát sinh SAU trong CSS. Vá: <strong>số 1</strong> — chạy chuỗi qua <code>cn()</code>. Chi phí: không có.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Tình huống B</span><span class="lz-nsub"><code>.rich-content h2</code> đè <code>.mt-4</code></span></span>
<span class="lz-nbody">Q1 CÓ. Q2 kẻ thắng là <code>.rich-content h2</code>. Q3 đối thủ 0,1,1 &gt; utility 0,1,0. Vá: <strong>số 3</strong> — chấp nhận rằng bên trong <code>.rich-content</code> thì các h2 có margin RIÊNG, viết lại quy tắc h2 bên trong nó nếu cần đổi. Không phải một chỗ nên đập bằng utility.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Tình huống C</span><span class="lz-nsub">component thư viện với inline style</span></span>
<span class="lz-nbody">Q1 CÓ. Q2 kẻ thắng là <code>element.style</code> (0,0,0,với tie-breaker). Q3 mọi utility đều thua inline style. Vá: <strong>số 4</strong> — <code>!</code> tiền tố của Tailwind (<code>!mt-4</code>) — vì bạn không sửa được inline style của component ấy. Đây là trường hợp DUY NHẤT hợp lệ cho <code>!important</code>.</span>
</div>
</div>

<h3>Đo trên 620 quy tắc <code>.rich-content</code></h3>
<pre><code class="language-python"># chuyen tung quy tac thanh (do dac hieu, selector, dai)
for m in re.finditer(r'\\.rich-content[^{}]*\\{', globals_css):
    sel = m.group(0).rstrip('{').strip()
    a = sel.count('#')
    b = sel.count('.') + len(re.findall(r'\\[', sel)) + sel.count(':')
    c = len(re.findall(r'\\b[a-z]+\\b', sel)) - sel.count('.') - sel.count('#')
    ...
</code></pre>

<div class="out">phan bo do dac hieu cua 620 quy tac .rich-content:
  0,1,0 (chi mot lop)              :  40   &lt;- utility co the hoa
  0,2,0 (hai lop hoac lop+attr)     :  87   &lt;- utility THUA vinh vien
  0,1,1 (lop + phan tu)             : 128   &lt;- utility THUA vinh vien
  0,2,1 (con chau + phan tu)        : 232   &lt;- utility THUA vinh vien
  cao hon                           : 133

40 / 620 = 6,5% co the phi vi utility. 93,5% con lai la Q3 va Q4 khong voi toi.
</div>

<div class="callout">
<p><strong>Vì sao con số 93,5% quan trọng.</strong> Nó nói rằng cố &quot;ghi đè lên rich-content bằng utility&quot; là một mô hình sai — không phải một lỗi Tailwind. Cách đúng là sửa <code>.rich-content</code> hoặc dùng một wrapper KHÁC không có <code>.rich-content</code>, không phải đập từng chỗ một bằng <code>!important</code>.</p>
</div>

<h3>Bảng ra quyết định gọn</h3>
<pre><code class="language-text">Q3: do dac hieu doi thu &gt; ban?
     ↓ CO                                ↓ HOA
     &gt; DOI CAU TRUC (so 3)               Q4: doi thu phat sinh SAU?
     &gt; hoac chap nhan thua                     ↓ CO           ↓ KHONG
                                              &gt; SAP LAI      &gt; da ok!
                                                (so 1 hoac 2)
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — cho rằng <code>@layer</code> (bài 7.1) &quot;giải quyết mọi tranh chấp&quot;.</strong> KHÔNG. Nó chỉ giúp khi Q3 HOÀ. Một quy tắc <code>.rich-content .body</code> ở specificity 0,2,1 bọc vào <code>@layer components</code> vẫn thua một <code>.text-red-500</code> ở specificity 0,1,0 nếu — và chỉ nếu — utility phát sinh sau. <em>Đặc hiệu vẫn quyết định trước layer.</em></p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Q3 (độ đặc hiệu) và Q4 (thứ tự nguồn) xét theo đúng thứ tự đó, và bốn cách phá hoà có chi phí khác nhau một bậc độ lớn — sắp lại nguồn thì gần miễn phí, <code>@layer</code> tốn một dòng, tăng độ đặc hiệu tốn một selector dài hơn, và <code>!important</code> tốn <em>mọi</em> utility tương lai trên cùng thuộc tính — nên nó chỉ xứng đáng cho các component bên thứ ba mà bạn không sửa được.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CSS Specificity</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Specificity — cách đếm <em>id, class, element</em>, và bảng tie-breaker khi so hai selector.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind — <code>!</code> prefix</span><span class="lc-sub">tailwindcss.com/docs/configuration#important-modifier — cú pháp <code>!mt-4</code> thay cho <code>mt-4 !important</code>, và khuyến cáo dùng &quot;tối thiểu&quot; vì lý do bài này giải thích.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — cascade layers</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@layer — khác biệt giữa <code>@layer</code> của CSS và <code>@layer</code> của Tailwind (bài 7.1 đã đo: Tailwind XOÁ nó).</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 7 — <code>@layer</code> và cơ chế thật</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — sáu bài về cách 88% CSS thường của kho này không đi qua layer, và ai thắng khi có tranh chấp.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.5 ─────────────────────────── */
    {
      title: '10.5 — Dynamic classes and the AI trap|||10.5 — Lớp động và bẫy AI',
      slug: 'tw-10-5-ai',
      type: 'VIDEO',
      description: 'Ba loại lớp mà máy sinh mã AI hay ra và tại sao mỗi loại đều dính ba lỗi khác nhau — đo trên 633 chuỗi mẫu và 197 lượt `cn()` của kho này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>Dynamic classes and the AI trap</h2>
<p class="lead">Chapter 4 measured that 76,3% of dynamic className strings in this repository bypass <code>twMerge</code>. That number is not accidental — it is the intersection of three habits that AI code generators inherited from public code samples. This lesson walks each habit, shows what breaks, and shows the two-line fix.</p>

<h3>Habit 1 — template concat, whole class names split across lines</h3>
<pre><code class="language-tsx">// pattern AI thuong ra
const cls = &#96;text-\${size} \${isPrimary ? &#39;text-blue-500&#39; : &#39;text-slate-500&#39;}&#96;

&lt;button className={&#96;btn \${cls} \${extra}&#96;}&gt;
</code></pre>

<p>Three different bugs in one string:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">Q1 fail — the class name is split</span><span class="lz-d"><code>text-\${size}</code> — Tailwind only sees the string <code>text-</code>and never <code>text-xs</code> or <code>text-sm</code>. Lesson 0.1 measured it, and this is the number-one cause of Q1=NO.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">Q4 fail — it never goes through <code>twMerge</code></span><span class="lz-d">If <code>extra</code> contains <code>text-red-500</code> và <code>cls</code> already has <code>text-blue-500</code>, both are generated and whichever comes LATER in the CSS wins — not whichever was written later in the string (lesson 3.2).</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">accessibility gap</span><span class="lz-d">There is no way to know whether the string contains <code>focus-visible:ring</code> when <code>outline-none</code> is present (lesson 9.4). A static grep misses it because <code>${'${'}extra}</code>.</span></div>
</div>

<h3>Fixed in two lines</h3>
<pre><code class="language-tsx">import { cn } from '~/lib/utils'   // twMerge(clsx(inputs))

const cls = cn(
  &#96;text-\${size}&#96;,                              // van bi Q1 fail
  isPrimary ? 'text-blue-500' : 'text-slate-500',
)
&lt;button className={cn('btn', cls, extra)}&gt;
</code></pre>

<p><code>cn()</code> calls <code>twMerge</code>, which settles the Q4 failure. But it does NOT rescue the Q1 failure — <code>text-\${size}</code> is still not scanned. One more step is needed:</p>

<pre><code class="language-tsx">// cai NAO ma AI thuong KHONG lam:
const SIZE = { xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg' }

const cls = cn(SIZE[size], isPrimary ? 'text-blue-500' : 'text-slate-500')
</code></pre>

<p>Every class name now appears IN FULL in the source file, Tailwind can scan them, and Q1 passes.</p>

<h3>Habit 2 — variant object nested</h3>
<pre><code class="language-tsx">// pattern AI thuong ra
const styles = {
  primary: 'bg-blue-500 text-white',
  danger:  'bg-red-500 text-white',
  ghost:   'bg-transparent text-blue-500',
}

&lt;button className={&#96;\${styles[variant]} \${size === 'lg' ? 'px-6 py-3' : 'px-3 py-1.5'}&#96;}&gt;
</code></pre>

<p>This structure has no Q1 bug, because the class names appear in full in the source. But it still has a Q4 bug when a consumer adds <code>className</code> to override:</p>

<pre><code class="language-tsx">&lt;Button variant="primary" className="bg-transparent" /&gt;
// mong doi: nen trong suot. Thuc te: bg-blue-500 thang neu ban khong dung cn()
</code></pre>

<div class="callout warn">
<p><strong>This is where Chapter 4's 76.3% matters MOST.</strong> It is not that 76.3% of strings &quot;have a bug&quot; — it is that 76.3% of components do NOT let consumers override the way they expect. Users of those components are surprised, add <code>!important</code>, and the disease spreads downward. Same cause: no <code>twMerge</code>.</p>
</div>

<h3>Habit 3 — <code>cva()</code> with several variants</h3>
<pre><code class="language-tsx">// pattern AI thuong ra
import { cva } from 'class-variance-authority'

const button = cva('inline-flex items-center gap-2 rounded-md', {
  variants: {
    variant: { primary: 'bg-blue-500 text-white', ghost: '...', ... },
    size:    { sm: 'px-2 py-1', md: 'px-3 py-2', lg: 'px-4 py-3' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

&lt;button className={button({ variant, size })}&gt; /* KO cn() */
</code></pre>

<p><code>cva()</code> runs <code>twMerge</code> on its own? The answer, from the official documentation: <em>NOT by default</em>. You have to configure it by wrapping it in <code>cn()</code>:</p>

<pre><code class="language-tsx">// dung
const button = cva('...', { ... })
&lt;button className={cn(button({ variant, size }), className)}&gt;
</code></pre>

<p>If you omit <code>cn()</code>, then when a consumer passes <code>className="p-8"</code> to override the <code>px-3 py-2</code> of a <code>size=md</code>, both are generated and whichever comes LATER in the CSS wins — usually NOT the one the consumer wrote. This bug is hard to reproduce because it depends on Tailwind's generation order, and it may only surface for certain property pairs.</p>

<h3>Why AI generators keep producing these three patterns</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">habit 1</span><span class="lz-lnote">most public code samples were written in early 2022, when <code>tailwind-merge</code> was not yet common. Models learned from those and write <code>&#96;text-\${size}&#96;</code> without thinking. Fix: add a <code>cn()</code> example to the system prompt or the project rules</span></div>
<div class="lz-layer"><span class="lz-lname">habit 2</span><span class="lz-lnote">the exemplar UI libraries (shadcn-ui) before v0.5 did NOT use <code>twMerge</code>. Many projects forked from that era. Fix: run a codemod to replace <code>className={A + " " + B}</code> → <code>className={cn(A, B)}</code></span></div>
<div class="lz-layer"><span class="lz-lname">habit 3</span><span class="lz-lnote"><code>cva()</code> has its own API and some examples in the official documentation do NOT wrap it in <code>cn()</code>. Models follow the sample. Fix: a comment at the top of <code>utils.ts</code> stating plainly that &quot;every <code>cva()</code> must be wrapped in <code>cn()</code>&quot;</span></div>
</div>

<h3>Đo trên kho này</h3>
<div class="out">Chuoi className co template literal (\${...}): 633
Loi Q1 tiem tang (class-name chè ngang)      : 41   (co \${size}, \${color}...)
Loi Q4 tiem tang (khong cn/twMerge quanh)    : 592  (76,3% - Chuong 4)
cva() KHONG bọc cn()                         : 12   file
</div>

<div class="pitfall">
<p><strong>Bẫy — cho rằng &quot;prompt engineering&quot; sẽ sửa được.</strong> You write &quot;always use <code>cn()</code>&quot; into the system prompt and the AI obeys in its first reply, then forgets by the third once the context window fills. A surer approach is an ESLint rule catching <code>className={&#96;...\${</code> without <code>cn(</code> — <em>and refusing the commit</em>— an enforcement, not a suggestion.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> AI code generators produce three dangerous patterns — template concatenation splitting class names (a Q1 failure), variant objects that do not let consumers override properly (a Q4 failure), and <code>cva()</code> not wrapped in <code>cn()</code> (a Q4 failure for consumers) — all three are fixed in two lines with <code>cn()</code> plus a lookup table, and an ESLint rule catching these three at commit time is surer than any instruction in a system prompt.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">tailwind-merge</span><span class="lc-sub">github.com/dcastil/tailwind-merge — thư viện làm việc Tailwind KHÔNG làm: hiểu quan hệ giữa các utility (<code>p</code> nuốt <code>px</code>, <code>my</code> nuốt <code>mt/mb</code>).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">class-variance-authority (cva)</span><span class="lc-sub">cva.style — API full, và ghi chú &quot;CVA does NOT perform any Tailwind-specific merging&quot; ở giữa trang, dễ bỏ qua.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">eslint-plugin-tailwindcss</span><span class="lc-sub">github.com/francoismassart/eslint-plugin-tailwindcss — rule <code>enforces-shorthand</code> và <code>classnames-order</code> chặn được nhiều biến thể of a Habit 1.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 3 — where the model leaks</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — cơ chế thứ tự phát sinh mà 76,3% chuỗi động dính, cùng bảng đo <code>cn()</code> khôi phục.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Lớp động và bẫy AI</h2>
<p class="lead">Chương 4 đo được 76,3% chuỗi className động trong kho này BỎ QUA <code>twMerge</code>. Con số đó không tình cờ — nó là giao của ba thói quen mà máy sinh mã AI thừa hưởng từ các mẫu mã công khai. Bài này đi qua từng thói quen, chỉ ra cái vỡ, và chỉ ra bản vá hai dòng.</p>

<h3>Thói quen 1 — template concat, tên lớp chẻ ngang</h3>
<pre><code class="language-tsx">// pattern AI thuong ra
const cls = &#96;text-\${size} \${isPrimary ? &#39;text-blue-500&#39; : &#39;text-slate-500&#39;}&#96;

&lt;button className={&#96;btn \${cls} \${extra}&#96;}&gt;
</code></pre>

<p>Ba lỗi khác nhau trong một chuỗi:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">Q1 fail — class-name chẻ ngang</span><span class="lz-d"><code>text-\${size}</code> — Tailwind chỉ thấy chuỗi <code>text-</code>, không thấy <code>text-xs</code> hoặc <code>text-sm</code>. Bài 0.1 đo được, và đây là nguyên nhân số một của Q1=NO.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">Q4 fail — không qua <code>twMerge</code></span><span class="lz-d">Nếu <code>extra</code> chứa <code>text-red-500</code> và <code>cls</code> đã có <code>text-blue-500</code>, cả hai đều phát sinh và cái đến SAU trong CSS thắng — không phải cái viết SAU trong chuỗi (bài 3.2).</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">accessibility gap</span><span class="lz-d">Không có cách nào biết chuỗi có chứa <code>focus-visible:ring</code> hay không nếu <code>outline-none</code> có mặt (bài 9.4). Static grep bỏ sót vì <code>${'${'}extra}</code>.</span></div>
</div>

<h3>Vá trong hai dòng</h3>
<pre><code class="language-tsx">import { cn } from '~/lib/utils'   // twMerge(clsx(inputs))

const cls = cn(
  &#96;text-\${size}&#96;,                              // van bi Q1 fail
  isPrimary ? 'text-blue-500' : 'text-slate-500',
)
&lt;button className={cn('btn', cls, extra)}&gt;
</code></pre>

<p><code>cn()</code> gọi <code>twMerge</code>, giải quyết Q4 fail. Nhưng nó KHÔNG cứu được Q1 fail — <code>text-\${size}</code> vẫn không được quét. Cần thêm bước:</p>

<pre><code class="language-tsx">// cai NAO ma AI thuong KHONG lam:
const SIZE = { xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg' }

const cls = cn(SIZE[size], isPrimary ? 'text-blue-500' : 'text-slate-500')
</code></pre>

<p>Tất cả các tên lớp bây giờ xuất hiện ĐẦY ĐỦ trong file nguồn, Tailwind quét được, Q1 pass.</p>

<h3>Thói quen 2 — variant object nested</h3>
<pre><code class="language-tsx">// pattern AI thuong ra
const styles = {
  primary: 'bg-blue-500 text-white',
  danger:  'bg-red-500 text-white',
  ghost:   'bg-transparent text-blue-500',
}

&lt;button className={&#96;\${styles[variant]} \${size === 'lg' ? 'px-6 py-3' : 'px-3 py-1.5'}&#96;}&gt;
</code></pre>

<p>Cấu trúc này không có lỗi Q1 vì tên lớp xuất hiện đầy đủ trong file nguồn. Nhưng vẫn có lỗi Q4 khi consumer thêm <code>className</code> ghi đè:</p>

<pre><code class="language-tsx">&lt;Button variant="primary" className="bg-transparent" /&gt;
// mong doi: nen trong suot. Thuc te: bg-blue-500 thang neu ban khong dung cn()
</code></pre>

<div class="callout warn">
<p><strong>Đây là chỗ 76,3% Chương 4 đo có ý nghĩa NHẤT.</strong> Không phải 76,3% chuỗi &quot;có bug&quot; — mà là 76,3% các component KHÔNG cho phép consumer override như kỳ vọng. Người dùng component ấy sẽ ngạc nhiên, thêm <code>!important</code>, và lây bệnh xuống bên dưới. Cùng nguyên nhân: không có <code>twMerge</code>.</p>
</div>

<h3>Thói quen 3 — <code>cva()</code> với đa variant</h3>
<pre><code class="language-tsx">// pattern AI thuong ra
import { cva } from 'class-variance-authority'

const button = cva('inline-flex items-center gap-2 rounded-md', {
  variants: {
    variant: { primary: 'bg-blue-500 text-white', ghost: '...', ... },
    size:    { sm: 'px-2 py-1', md: 'px-3 py-2', lg: 'px-4 py-3' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

&lt;button className={button({ variant, size })}&gt; /* KO cn() */
</code></pre>

<p><code>cva()</code> tự chạy <code>twMerge</code> KHÔNG? Câu trả lời trong tài liệu chính thức: <em>KHÔNG mặc định</em>. Bạn phải cấu hình bằng cách bọc trong <code>cn()</code>:</p>

<pre><code class="language-tsx">// dung
const button = cva('...', { ... })
&lt;button className={cn(button({ variant, size }), className)}&gt;
</code></pre>

<p>Nếu bỏ <code>cn()</code>, khi consumer truyền <code>className="p-8"</code> để phá <code>px-3 py-2</code> của <code>size=md</code>, cả hai đều phát sinh và kẻ đến SAU trong CSS thắng — thường là utility KHÔNG phải cái consumer viết. Bug này khó tái hiện vì phụ thuộc thứ tự phát sinh Tailwind, và có thể chỉ hiện ra ở một số cặp thuộc tính.</p>

<h3>Vì sao AI generators lại hay ra ba pattern này</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">thói quen 1</span><span class="lz-lnote">phần lớn code samples công cộng viết ở đầu 2022 khi <code>tailwind-merge</code> chưa phổ biến. Model học từ đó nên viết <code>&#96;text-\${size}&#96;</code> mà không nghĩ. Fix: thêm ví dụ <code>cn()</code> vào system prompt hoặc project rules</span></div>
<div class="lz-layer"><span class="lz-lname">thói quen 2</span><span class="lz-lnote">các thư viện UI mẫu (shadcn-ui) trước v0.5 KHÔNG dùng <code>twMerge</code>. Nhiều dự án fork từ thời điểm đó. Fix: chạy codemod thay <code>className={A + " " + B}</code> → <code>className={cn(A, B)}</code></span></div>
<div class="lz-layer"><span class="lz-lname">thói quen 3</span><span class="lz-lnote"><code>cva()</code> có API riêng và một số ví dụ trong tài liệu chính thức KHÔNG bọc <code>cn()</code>. Model theo mẫu. Fix: một comment ở đầu file <code>utils.ts</code> nói rõ &quot;mọi <code>cva()</code> phải bọc <code>cn()</code>&quot;</span></div>
</div>

<h3>Đo trên kho này</h3>
<div class="out">Chuoi className co template literal (\${...}): 633
Loi Q1 tiem tang (class-name chè ngang)      : 41   (co \${size}, \${color}...)
Loi Q4 tiem tang (khong cn/twMerge quanh)    : 592  (76,3% - Chuong 4)
cva() KHONG bọc cn()                         : 12   file
</div>

<div class="pitfall">
<p><strong>Bẫy — cho rằng &quot;prompt engineering&quot; sẽ sửa được.</strong> Bạn viết vào system prompt &quot;luôn dùng <code>cn()</code>&quot; và AI tuân theo trong lời hồi đáp đầu, rồi quên trong lời hồi đáp thứ ba khi context window đầy. Cách chắc chắn hơn là một ESLint rule bắt <code>className={&#96;...\${</code> mà không có <code>cn(</code> — <em>từ chối commit</em>, không phải khuyến nghị.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Máy sinh mã AI ra ba pattern nguy hiểm — template concat làm class-name chẻ ngang (Q1 fail), variant object không cho consumer override đúng cách (Q4 fail), và <code>cva()</code> không bọc <code>cn()</code> (Q4 fail cho consumers) — cả ba đều vá trong hai dòng bằng <code>cn()</code> plus một bảng lookup, và ESLint rule bắt được ba pattern này ở commit-time chắc chắn hơn mọi lời hướng dẫn trong system prompt.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">tailwind-merge</span><span class="lc-sub">github.com/dcastil/tailwind-merge — thư viện làm việc Tailwind KHÔNG làm: hiểu quan hệ giữa các utility (<code>p</code> nuốt <code>px</code>, <code>my</code> nuốt <code>mt/mb</code>).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">class-variance-authority (cva)</span><span class="lc-sub">cva.style — API đầy đủ, và ghi chú &quot;CVA does NOT perform any Tailwind-specific merging&quot; ở giữa trang, dễ bỏ qua.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">eslint-plugin-tailwindcss</span><span class="lc-sub">github.com/francoismassart/eslint-plugin-tailwindcss — rule <code>enforces-shorthand</code> và <code>classnames-order</code> chặn được nhiều biến thể của thói quen 1.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 3 — nơi mô hình rò rỉ</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — cơ chế thứ tự phát sinh mà 76,3% chuỗi động dính, cùng bảng đo <code>cn()</code> khôi phục.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.6 ─────────────────────────── */
    {
      title: '10.6 — Chapter 10 quiz|||10.6 — Kiểm tra Chương 10',
      slug: 'tw-10-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu, mười hai phút. Về chẩn đoán: cây bốn câu hỏi, DevTools kẻ gạch nói ai thắng, độ đặc hiệu vs thứ tự nguồn, và ba bẫy AI.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>What Chapter 10 measured</h2>
<p class="lead">Eight questions, twelve minutes. This chapter generates no new data; it PACKAGES the data of the previous eight chapters into a decision tree.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">10.1 — the four-question tree</span><span class="lz-lnote">Q1 rule generated · Q2 who overrides it · Q3 specificity · Q4 source order. None of them is &quot;try !important&quot;</span></div>
<div class="lz-layer"><span class="lz-lname">10.2 — Q1</span><span class="lz-lnote">three checks: grep out.css, generate a probe with your own config, read getComputedStyle. Four causes of Q1=NO</span></div>
<div class="lz-layer"><span class="lz-lname">10.3 — Q2</span><span class="lz-lnote">The DevTools Styles panel strikes through every loser; the winner sits at the top. The Computed panel does NOT tell you who won</span></div>
<div class="lz-layer"><span class="lz-lname">10.4 — Q3 and Q4</span><span class="lz-lnote">four ways to break a tie, ordered by cost: reorder the source, @layer, raise specificity, !important. 93.5% of the 620 .rich-content rules out-specify the utilities</span></div>
<div class="lz-layer"><span class="lz-lname">10.5 — the AI trap</span><span class="lz-lnote">three patterns: template concatenation splitting class names, variant objects without cn(), cva() not wrapped in cn(). An ESLint rule blocking the commit is surer than prompt engineering</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Chương 10 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Chương này không tạo dữ liệu mới; nó ĐÓNG GÓI dữ liệu của tám chương trước thành một cây quyết định.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">10.1 — cây bốn câu</span><span class="lz-lnote">Q1 rule generated · Q2 who overrides it · Q3 specificity · Q4 source order. Không câu nào là &quot;thử !important&quot;</span></div>
<div class="lz-layer"><span class="lz-lname">10.2 — Q1</span><span class="lz-lnote">ba phép kiểm: grep out.css, sinh probe với chính config, đọc getComputedStyle. Bốn nguyên nhân Q1=NO</span></div>
<div class="lz-layer"><span class="lz-lname">10.3 — Q2</span><span class="lz-lnote">DevTools Styles panel gạch mọi kẻ thua; kẻ thắng ở trên cùng. Panel Computed KHÔNG cho biết ai thắng</span></div>
<div class="lz-layer"><span class="lz-lname">10.4 — Q3 và Q4</span><span class="lz-lnote">bốn cách phá hoà xếp theo chi phí: sắp lại nguồn, @layer, tăng specificity, !important. 93,5% của 620 rule .rich-content ở specificity vượt utility</span></div>
<div class="lz-layer"><span class="lz-lname">10.5 — bẫy AI</span><span class="lz-lnote">ba pattern: template concat làm class-name chẻ ngang, variant object không cn(), cva() không bọc cn(). ESLint rule chặn commit chắc hơn prompt engineering</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which question in the four-question tree does NOT belong?|||Câu nào KHÔNG thuộc cây bốn câu hỏi?',
            options: [
              'Should I add <code>!important</code> to force it?|||Có nên thêm <code>!important</code> để ép không?',
              'Was the rule generated at all?|||Quy tắc có được phát sinh không?',
              'Is another rule overriding it?|||Có quy tắc khác đang đè nó không?',
              'Which appears later in the emitted CSS?|||Cái nào xuất hiện sau trong CSS phát sinh?',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: '<code>grep -c &quot;bg-bg-elevated&quot; out.css</code> returns 0. What has that told you?|||<code>grep -c &quot;bg-bg-elevated&quot; out.css</code> trả 0. Điều đó nói với bạn cái gì?',
            options: [
              'Q1 answered NO — the rule does not exist. Everything downstream (Q2/Q3/Q4/!important) is moot; the class needs a token declaration before anything else|||Q1 trả KHÔNG — quy tắc không tồn tại. Mọi thứ xuôi dòng (Q2/Q3/Q4/!important) đều vô nghĩa; lớp cần một khai báo token trước khi làm bất cứ điều gì khác',
              'The class needs !important to become visible|||Lớp cần !important để lộ ra',
              'The build cache is stale — clear and rebuild|||Bộ đệm dựng cũ — xoá và dựng lại',
              'Nothing — grep is unreliable for CSS|||Không gì — grep không đáng tin cho CSS',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You see <code>mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32</code> and want to know which applies. Where do you look?|||Bạn thấy <code>mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32</code> và muốn biết cái nào áp. Bạn nhìn ở đâu?',
            options: [
              'DevTools Styles panel — the winner is at the top without a strikethrough. In this case it is <code>mt-8</code>, because Tailwind sorts utilities as strings and &quot;8&quot; sits last alphabetically among {1,10,12,16,2,20,24,3,32,4,8}|||Bảng Styles của DevTools — kẻ thắng ở trên cùng không gạch. Ở đây là <code>mt-8</code>, vì Tailwind sắp utility theo chuỗi và &quot;8&quot; đứng cuối alphabet trong {1,10,12,16,2,20,24,3,32,4,8}',
              'The last one written wins, always — so <code>mt-32</code>|||Cái viết cuối luôn thắng — nên <code>mt-32</code>',
              'The largest value wins — so <code>mt-32</code>|||Giá trị lớn nhất thắng — nên <code>mt-32</code>',
              'DevTools Computed panel shows the winning class name|||Bảng Computed của DevTools cho tên lớp thắng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A rule in <code>@layer components</code> at specificity 0,2,1 is still overridden by a <code>.text-red-500</code> utility at 0,1,0. Why?|||Một quy tắc trong <code>@layer components</code> ở độ đặc hiệu 0,2,1 vẫn bị <code>.text-red-500</code> ở 0,1,0 đè. Vì sao?',
            options: [
              'It is NOT — <code>@layer</code> only decides ties on specificity. The 0,2,1 rule wins against the 0,1,0 utility regardless of which layer either sits in|||KHÔNG — <code>@layer</code> chỉ quyết định khi độ đặc hiệu HOÀ. Quy tắc 0,2,1 thắng utility 0,1,0 bất kể mỗi cái nằm ở layer nào',
              'Because Tailwind strips @layer at build time so it does nothing|||Vì Tailwind xoá @layer lúc dựng nên nó không làm gì',
              'Because utilities always win against custom CSS|||Vì utility luôn thắng CSS tuỳ biến',
              'Because <code>text-red-500</code> is emitted after the layer block|||Vì <code>text-red-500</code> phát sinh sau khối layer',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Of 620 hand-written <code>.rich-content</code> rules, how many can be tied by a single-class utility?|||Trong 620 quy tắc <code>.rich-content</code> viết tay, bao nhiêu cái có thể HOÀ với một utility lớp-đơn?',
            options: [
              '40 out of 620 (6,5%). The other 580 use descendant or double-class selectors that outrank a 0,1,0 utility on specificity from anywhere — utility cannot reach them|||40 trên 620 (6,5%). 580 cái còn lại dùng selector con cháu hoặc hai-lớp vượt utility 0,1,0 về độ đặc hiệu ở bất cứ đâu — utility không tới được',
              'All 620 — every rule can be tied by adding more utility classes|||Cả 620 — mọi quy tắc đều tie được bằng cách thêm utility',
              'None — utility can never override hand-written CSS|||Không cái nào — utility không bao giờ đè được CSS viết tay',
              '620 — that is what @layer is for|||620 — đó là chức năng của @layer',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'When is <code>!important</code> (or <code>!mt-4</code>) genuinely the right fix?|||Khi nào <code>!important</code> (hoặc <code>!mt-4</code>) thật sự là bản vá đúng?',
            options: [
              'Only when you do not control the competitor&#39;s selector — typically inline styles from a third-party UI library. Inside your own codebase, every other case has a cheaper fix|||Chỉ khi bạn không kiểm soát selector của đối thủ — thường là inline style từ thư viện UI bên thứ ba. Bên trong kho mã của bạn, mọi trường hợp khác đều có bản vá rẻ hơn',
              'Any time an override does not work on the first try|||Bất cứ khi nào override không chạy lần đầu',
              'When two utilities collide — it is the standard way to break ties|||Khi hai utility đụng nhau — đó là cách chuẩn phá hoà',
              'Never — !important should be removed entirely|||Không bao giờ — !important nên bị bỏ hoàn toàn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which of these AI-generated patterns creates the WORST class-name detection failure?|||Pattern nào máy sinh mã AI tạo ra hỏng phát-hiện-tên-lớp TỆ NHẤT?',
            options: [
              '<code>&#96;text-\${size}&#96;</code> — Tailwind sees only the prefix <code>text-</code>, and the class name is never scanned. Q1 fails and no utility exists to apply|||<code>&#96;text-\${size}&#96;</code> — Tailwind chỉ thấy tiền tố <code>text-</code>, và tên lớp không bao giờ được quét. Q1 fail và không utility nào tồn tại để áp',
              '<code>cva()</code> with three variants — this compiles fine|||<code>cva()</code> với ba variant — cái này biên dịch ổn',
              '<code>&#96;btn btn-primary&#96;</code> — literal names split by space|||<code>&#96;btn btn-primary&#96;</code> — tên literal chia bằng khoảng trắng',
              '<code>&#96;\${styles[variant]}&#96;</code> where <code>styles</code> is a full-name lookup|||<code>&#96;\${styles[variant]}&#96;</code> với <code>styles</code> là lookup tên đầy đủ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the more reliable way to keep AI-generated code using <code>cn()</code>?|||Cách nào ĐÁNG TIN hơn để giữ code AI dùng <code>cn()</code>?',
            options: [
              'An ESLint rule that rejects the commit — because instructions in a system prompt are followed on turn 1 and forgotten on turn 3 as the context window fills|||Một ESLint rule TỪ CHỐI commit — vì hướng dẫn trong system prompt được theo ở lượt 1 và quên ở lượt 3 khi context window đầy',
              'A warning comment in the README|||Một comment cảnh báo trong README',
              'A code review checklist item|||Một mục checklist review',
              'Nothing — future AI models will do this correctly by default|||Không cần — model AI tương lai sẽ mặc định làm đúng',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
