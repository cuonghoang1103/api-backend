const REF = '?ref=%2Fcourses%2Ftailwind-css%2Flearn&reflabel=Tailwind%20CSS';
/**
 * Tailwind CSS — Chương 1: Cái THANG, thứ đáng học thay vì tên lớp.
 * Số đo: thang mặc định trích thẳng từ resolveConfig của Tailwind 3.4.14,
 * đối chiếu với 6.562 giá trị tuỳ ý đo được trong frontend/ của kho này.
 */

export default {
  title: 'Chapter 1 — The scale, which is the thing worth learning|||Chương 1 — Cái THANG, thứ đáng học thay vì tên lớp',
  slug: 'tw-ch1-thang',
  description: 'Tên lớp Tailwind KHÔNG đáng học thuộc — chúng được SINH ra từ một cái thang nhỏ. Sáu bài dựng lại cái thang ấy từ số đo thật, chỉ ra chỗ nó HẾT, và đo xem một ứng dụng thật phải thoát ra ngoài nó bao nhiêu lần.',
  sortOrder: 2,
  lessons: [

    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — Every spacing value is the number times 4px|||1.1 — Mọi giá trị khoảng cách là con số nhân 4px',
      slug: 'tw-1-1-nhan-bon',
      type: 'VIDEO',
      description: 'Một luật duy nhất thay thế việc học thuộc 35 tên lớp: `p-4` = 16px vì 4 × 4 = 16. Trích thẳng từ resolveConfig của Tailwind, không đọc tài liệu mà đoán.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Every spacing value is the number times 4px</h2>
<p class="lead">People try to learn Tailwind by memorising class names, find there are thousands, and conclude it is a lot to learn. It is not. There is one arithmetic rule, and once you have it you can derive any spacing class you will ever need — including ones you have never seen.</p>

<div class="callout">
<p><strong>The rule.</strong> <code>p-4</code> is <code>1rem</code> is <strong>16px</strong>, because 4 × 4px = 16px. Every number in the spacing scale is <em>that number multiplied by 4 pixels</em>. <code>m-2</code> is 8px. <code>gap-6</code> is 24px. <code>mt-10</code> is 40px. There is nothing else to know.</p>
</div>

<h3>Verifying it rather than believing it</h3>
<p>The scale lives in Tailwind's own code, so read it from there rather than from a docs table that might be for a different version:</p>

<pre><code class="language-js">// scale.mjs
import resolveConfig from 'tailwindcss/resolveConfig.js';
const { theme } = resolveConfig({ content: [] });
for (const [k, v] of Object.entries(theme.spacing)) {
  const px = v.endsWith('rem') ? parseFloat(v) * 16 : v;
  console.log(k.padEnd(5), String(v).padEnd(10), px);
}
</code></pre>

<div class="out">$ node scale.mjs
0     0px        0
px    1px        1px
0.5   0.125rem   2
1     0.25rem    4
1.5   0.375rem   6
2     0.5rem     8
2.5   0.625rem   10
3     0.75rem    12
3.5   0.875rem   14
4     1rem       16
5     1.25rem    20
6     1.5rem     24
8     2rem       32
10    2.5rem     40
12    3rem       48
16    4rem       64
20    5rem       80
24    6rem       96
32    8rem       128
...
96    24rem      384
</div>

<p>Read the last column down. 0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48… Every one is its key × 4. The rule holds across all <strong>35 entries</strong> without exception, including the fractional keys — <code>1.5</code> × 4 = 6px, <code>2.5</code> × 4 = 10px.</p>

<div class="callout ok">
<p><strong>Why 4px and not something else.</strong> 4 is the largest number that divides evenly into the common design increments (8, 12, 16, 24, 32, 48) while still being small enough for fine adjustments. It is the standard grid unit in most design systems for the same reason — the scale is not a Tailwind invention, it is Tailwind adopting a convention that predates it.</p>
</div>

<h3>The two entries that break the pattern, on purpose</h3>
<p>Two keys are not numbers: <code>0</code> and <code>px</code>. <code>p-0</code> is zero, which needs no unit. <code>p-px</code> is exactly 1 pixel — the one value the × 4 rule cannot produce, and one you genuinely need for hairline borders and 1px offsets. It is spelled <code>px</code> rather than <code>0.25</code> because <code>0.25</code> × 4 = 1px would be a confusing way to write it.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">the number keys</span><span class="lz-nsub"><code>0.5</code> through <code>96</code></span></span>
<span class="lz-nbody">Multiply by 4 to get pixels. This covers 33 of the 35 entries and every spacing decision you will normally make.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">the two literals</span><span class="lz-nsub"><code>0</code> and <code>px</code></span></span>
<span class="lz-nbody"><code>0</code> = no space. <code>px</code> = exactly 1px, the sub-4px value the rule cannot express. Everything else is arithmetic.</span>
</div>
</div>

<h3>Why the scale uses <code>rem</code> and why that matters</h3>
<p>Notice the middle column: the emitted value is <code>1rem</code>, not <code>16px</code>. The pixel figure is the <em>result</em> of 1rem at the default root font size of 16px, not the stored value. That distinction has a real consequence: a user who raises their browser's base font size for readability scales your entire layout proportionally, not just the text.</p>

<pre><code class="language-css">/* what Tailwind emits */
.p-4 { padding: 1rem; }

/* what the user's browser computes, root font-size 16px */
padding: 16px;

/* same class, user set root font-size to 20px for accessibility */
padding: 20px;
</code></pre>

<p>This is the accessibility argument for <code>rem</code>-based scales, and it is why hardcoding <code>p-[16px]</code> "because it is the same thing" is not the same thing. Chapter 10 returns to this with the full accessibility picture; for now the takeaway is that the scale is relative by design, and the pixel numbers in this lesson are a convenience for reasoning, not the truth on the wire.</p>

<h3>What the rule buys you</h3>
<p>Being able to derive means you can go in both directions, which is what actually speeds you up day to day:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">design gives you a number</span><span class="lz-d">A mockup says 24px of padding. Divide by 4: the class is <code>p-6</code>. No lookup, no searching the docs.</span></div>
<div class="lz-step"><span class="lz-k">←</span><span class="lz-t">code gives you a class</span><span class="lz-d">You read <code>gap-3</code> in a review. Multiply by 4: 12px. You can now judge whether that is right without opening the browser.</span></div>
<div class="lz-step"><span class="lz-k">?</span><span class="lz-t">the number is not on the scale</span><span class="lz-d">A mockup says 30px. 30 ÷ 4 = 7.5, which is not a key. That is a signal — either round to <code>p-8</code> (32px) and keep the grid, or the design genuinely needs an escape hatch. Lesson 1.2 is about that decision.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — assuming the number is pixels.</strong> The single most common beginner error is reading <code>p-4</code> as "4 pixels". It is 16px. The mistake is self-correcting for anyone who checks once, but it produces a specific confusing hour first: layouts come out four times too tight, and because everything is uniformly wrong it looks like a different bug entirely. Read the middle column of the measurement above once and the error never recurs.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> There are not thousands of spacing classes to learn — there is one multiplication, <em>key × 4px</em>, holding across all 35 entries with two deliberate literals (<code>0</code> and <code>px</code>), and learning that one rule replaces every lookup you would otherwise make in both directions.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Theme: spacing</span><span class="lc-sub">tailwindcss.com/docs/theme#spacing — the official table. Worth comparing against the <code>resolveConfig</code> output above; reading it from the code is how you stay right across version changes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind source — the default theme</span><span class="lc-sub">github.com/tailwindlabs/tailwindcss/blob/main/stubs/config.full.js — the actual object the measurement above reads. This file is the ground truth; the docs are a rendering of it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CSS length units, rem versus px</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/length — why <code>rem</code> tracks the user's root font size and <code>px</code> does not. The accessibility consequence in this lesson follows entirely from that page.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — the box model the scale feeds</span><span class="lc-sub">/courses/web-foundations/learn${REF} — padding, margin, border and how they compose. The scale decides the numbers; the box model decides what they do.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Mọi giá trị khoảng cách là con số nhân 4px</h2>
<p class="lead">Người ta thử học Tailwind bằng cách học thuộc tên lớp, phát hiện có hàng nghìn cái, rồi kết luận nó nhiều thứ phải học. KHÔNG phải. Có MỘT luật số học, và một khi nắm được nó bạn suy ra được mọi lớp khoảng cách bạn sẽ cần — kể cả những cái chưa từng thấy.</p>

<div class="callout">
<p><strong>Cái luật.</strong> <code>p-4</code> là <code>1rem</code> là <strong>16px</strong>, vì 4 × 4px = 16px. Mọi con số trong thang khoảng cách đều là <em>con số ấy nhân 4 pixel</em>. <code>m-2</code> là 8px. <code>gap-6</code> là 24px. <code>mt-10</code> là 40px. Không còn gì khác để biết.</p>
</div>

<h3>XÁC MINH nó thay vì tin nó</h3>
<p>Cái thang sống trong chính mã của Tailwind, nên hãy đọc TỪ ĐÓ thay vì từ một bảng trong tài liệu có thể thuộc về một phiên bản khác:</p>

<pre><code class="language-js">// scale.mjs
import resolveConfig from 'tailwindcss/resolveConfig.js';
const { theme } = resolveConfig({ content: [] });
for (const [k, v] of Object.entries(theme.spacing)) {
  const px = v.endsWith('rem') ? parseFloat(v) * 16 : v;
  console.log(k.padEnd(5), String(v).padEnd(10), px);
}
</code></pre>

<div class="out">$ node scale.mjs
0     0px        0
px    1px        1px
0.5   0.125rem   2
1     0.25rem    4
1.5   0.375rem   6
2     0.5rem     8
2.5   0.625rem   10
3     0.75rem    12
3.5   0.875rem   14
4     1rem       16
5     1.25rem    20
6     1.5rem     24
8     2rem       32
10    2.5rem     40
12    3rem       48
16    4rem       64
20    5rem       80
24    6rem       96
32    8rem       128
...
96    24rem      384
</div>

<p>Đọc cột cuối từ trên xuống. 0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48… Mỗi cái là KHOÁ của nó × 4. Luật ĐÚNG trên cả <strong>35 mục</strong> không có ngoại lệ, kể cả các khoá phân số — <code>1.5</code> × 4 = 6px, <code>2.5</code> × 4 = 10px.</p>

<div class="callout ok">
<p><strong>Vì sao 4px chứ không phải cái khác.</strong> 4 là số lớn nhất chia hết cho các mức tăng thiết kế thông dụng (8, 12, 16, 24, 32, 48) mà vẫn đủ nhỏ để tinh chỉnh. Nó là đơn vị lưới chuẩn trong hầu hết hệ thiết kế vì cùng lý do — cái thang KHÔNG phải phát minh của Tailwind, nó là Tailwind nhận lấy một quy ước có TRƯỚC nó.</p>
</div>

<h3>Hai mục phá khuôn, CÓ CHỦ Ý</h3>
<p>Hai khoá không phải số: <code>0</code> và <code>px</code>. <code>p-0</code> là không, không cần đơn vị. <code>p-px</code> là đúng 1 pixel — giá trị duy nhất mà luật × 4 KHÔNG sinh ra được, và là cái bạn THẬT SỰ cần cho viền tóc và các dịch 1px. Nó được viết là <code>px</code> chứ không phải <code>0.25</code> vì <code>0.25</code> × 4 = 1px sẽ là một cách viết gây rối.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">các khoá SỐ</span><span class="lz-nsub"><code>0.5</code> tới <code>96</code></span></span>
<span class="lz-nbody">Nhân 4 để ra pixel. Cái này bao 33 trên 35 mục và mọi quyết định khoảng cách bạn thường phải ra.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">hai chữ NGUYÊN</span><span class="lz-nsub"><code>0</code> và <code>px</code></span></span>
<span class="lz-nbody"><code>0</code> = không khoảng cách. <code>px</code> = đúng 1px, giá trị dưới-4px mà luật không diễn đạt được. Còn lại toàn bộ là số học.</span>
</div>
</div>

<h3>Vì sao thang dùng <code>rem</code> và vì sao điều đó quan trọng</h3>
<p>Để ý cột giữa: giá trị PHÁT SINH là <code>1rem</code>, không phải <code>16px</code>. Con số pixel là <em>KẾT QUẢ</em> của 1rem ở cỡ chữ gốc mặc định 16px, không phải giá trị được LƯU. Sự phân biệt ấy có một hệ quả thật: một người dùng NÂNG cỡ chữ nền của trình duyệt cho dễ đọc sẽ phóng to TOÀN BỘ bố cục của bạn theo tỉ lệ, không chỉ phần chữ.</p>

<pre><code class="language-css">/* cai Tailwind phat sinh */
.p-4 { padding: 1rem; }

/* cai trinh duyet nguoi dung tinh ra, font-size goc 16px */
padding: 16px;

/* CUNG lop do, nguoi dung dat font-size goc 20px cho de doc */
padding: 20px;
</code></pre>

<p>Đây là lập luận về khả năng tiếp cận cho các thang dựa trên <code>rem</code>, và là lý do đóng cứng <code>p-[16px]</code> "vì nó cũng thế thôi" KHÔNG phải cũng thế thôi. Chương 10 quay lại chuyện này với bức tranh tiếp cận đầy đủ; giờ điều rút ra là cái thang TƯƠNG ĐỐI theo thiết kế, và các con số pixel trong bài này là tiện lợi để suy luận, không phải sự thật trên đường truyền.</p>

<h3>Cái luật mua cho bạn điều gì</h3>
<p>Suy ra được nghĩa là bạn đi được CẢ HAI CHIỀU, và đó mới là thứ thật sự làm bạn nhanh lên hằng ngày:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">thiết kế đưa bạn một con số</span><span class="lz-d">Bản mẫu ghi padding 24px. Chia 4: lớp là <code>p-6</code>. Không tra cứu, không lục tài liệu.</span></div>
<div class="lz-step"><span class="lz-k">←</span><span class="lz-t">mã đưa bạn một cái lớp</span><span class="lz-d">Bạn đọc thấy <code>gap-3</code> trong một cuộc review. Nhân 4: 12px. Giờ bạn phán được nó đúng hay sai mà không cần mở trình duyệt.</span></div>
<div class="lz-step"><span class="lz-k">?</span><span class="lz-t">con số KHÔNG có trên thang</span><span class="lz-d">Bản mẫu ghi 30px. 30 ÷ 4 = 7,5, không phải một khoá. Đó là một TÍN HIỆU — hoặc làm tròn về <code>p-8</code> (32px) và giữ lưới, hoặc thiết kế THẬT SỰ cần một cửa thoát. Bài 1.2 nói về quyết định đó.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — tưởng con số là pixel.</strong> Lỗi người mới phổ biến nhất là đọc <code>p-4</code> thành "4 pixel". Nó là 16px. Sai lầm này tự sửa với bất kỳ ai kiểm một lần, nhưng trước đó nó đẻ ra một giờ đồng hồ khó hiểu cụ thể: bố cục ra CHẬT gấp bốn lần, và vì mọi thứ sai ĐỀU nhau nên nó trông như một con bọ hoàn toàn khác. Đọc cột giữa của phép đo bên trên một lần thì lỗi này không bao giờ tái diễn.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> KHÔNG có hàng nghìn lớp khoảng cách phải học — có MỘT phép nhân, <em>khoá × 4px</em>, đúng trên cả 35 mục với hai chữ nguyên cố ý (<code>0</code> và <code>px</code>), và học một luật ấy thay thế mọi lần tra cứu bạn sẽ phải làm theo cả hai chiều.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Theme: spacing</span><span class="lc-sub">tailwindcss.com/docs/theme#spacing — bảng chính thức. Đáng đối chiếu với đầu ra <code>resolveConfig</code> bên trên; đọc nó TỪ MÃ là cách bạn giữ đúng qua các lần đổi phiên bản.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind source — theme mặc định</span><span class="lc-sub">github.com/tailwindlabs/tailwindcss/blob/main/stubs/config.full.js — chính cái object mà phép đo bên trên đọc. File này là sự thật gốc; tài liệu chỉ là một bản kết xuất của nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — đơn vị độ dài CSS, rem đối lập px</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/length — vì sao <code>rem</code> bám theo cỡ chữ gốc của người dùng còn <code>px</code> thì không. Hệ quả tiếp cận trong bài này suy ra hoàn toàn từ trang ấy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — mô hình hộp mà cái thang nuôi</span><span class="lc-sub">/courses/web-foundations/learn${REF} — padding, margin, viền và cách chúng ghép. Cái thang quyết định CON SỐ; mô hình hộp quyết định chúng LÀM GÌ.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — Where the scale runs out, measured|||1.2 — Chỗ cái thang HẾT, đo được',
      slug: 'tw-1-2-thang-het',
      type: 'VIDEO',
      description: 'Thang chữ nhảy từ 12px thẳng lên 14px và KHÔNG có gì dưới 12px. Kho này cần 10px và 11px — nên nó thoát ra ngoài thang đúng 1.398 lần. Một lỗ hổng trong thang giải thích lớp tuỳ ý được dùng nhiều nhất của cả ứng dụng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Where the scale runs out, measured</h2>
<p class="lead">A scale is a set of decisions someone else made about which values you should need. Most of the time those decisions are good. When they are not, the codebase records the disagreement — and you can go and count it.</p>

<h3>The font-size scale, read from the source</h3>
<pre><code class="language-js">import resolveConfig from 'tailwindcss/resolveConfig.js';
const { theme } = resolveConfig({ content: [] });
for (const [k, v] of Object.entries(theme.fontSize)) {
  const size = Array.isArray(v) ? v[0] : v;
  console.log(&#96;text-\${k}&#96;.padEnd(12), size, parseFloat(size) * 16 + 'px');
}
</code></pre>

<div class="out">text-xs      0.75rem    12px
text-sm      0.875rem   14px
text-base    1rem       16px
text-lg      1.125rem   18px
text-xl      1.25rem    20px
text-2xl     1.5rem     24px
text-3xl     1.875rem   30px
text-4xl     2.25rem    36px
text-5xl     3rem       48px
text-6xl     3.75rem    60px
text-7xl     4.5rem     72px
text-8xl     6rem       96px
text-9xl     8rem       128px
</div>

<p>Two facts about that list matter more than the rest. First, the bottom of the scale is <strong>12px</strong> — there is no <code>text-2xs</code>, no <code>text-3xs</code>, nothing smaller. Second, the step from <code>text-xs</code> to <code>text-sm</code> is 12px → 14px, so <strong>13px is not expressible</strong> either.</p>

<h3>What a real app does about it</h3>
<p>Now count what this repository's frontend actually reaches for. Every class using the arbitrary-value bracket syntax:</p>

<pre><code class="language-bash">$ grep -ho 'className="[^"]*"' -r src --include="*.tsx" \\
    | sed 's/className="//; s/"$//' | tr ' ' '\\n' \\
    | grep '\\[' | sort | uniq -c | sort -rn | head -8
</code></pre>

<div class="out">803 text-[11px]
595 text-[10px]
339 border-[var(--border-color)]
281 text-[var(--text-secondary)]
240 text-[13px]
185 text-[12px]
147 bg-[var(--bg-surface)]
134 bg-white/[0.02]
</div>

<p>The top two entries are <strong>1,398 uses of 10px and 11px text</strong> — sizes that do not exist on the scale at all. Add <code>text-[13px]</code> at 240 and you have <strong>1,638 escapes</strong> caused by exactly the two gaps identified above: nothing below 12px, and nothing between 12 and 14.</p>

<div class="callout ok">
<p><strong>Read this as data, not as failure.</strong> This is a dense information UI — badges, metadata rows, timestamps, table cells — and dense UIs legitimately need type below 12px. The scale's authors optimised for content sites, where 12px is a sensible floor. Neither party is wrong; the scale simply does not match this application's domain, and 1,638 arbitrary values is the measured size of that mismatch.</p>
</div>

<h3>The three responses, and when each is right</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">round to the scale</span><span class="lz-nsub">correct for one-off, low-stakes differences</span></span>
<span class="lz-nbody">The mockup says 30px padding; use <code>p-8</code> (32px). Nobody will see 2px, and the grid stays intact. Most "the design does not match the scale" cases are actually this, and reaching for an arbitrary value here is how a scale quietly stops meaning anything.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">use an arbitrary value</span><span class="lz-nsub">correct for genuinely one-off needs</span></span>
<span class="lz-nbody"><code>top-[37px]</code> to align with a third-party widget, <code>w-[calc(100%-2rem)]</code> for a specific layout. Used a handful of times, this is exactly what the bracket syntax is for.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">extend the scale</span><span class="lz-nsub">correct once the count passes ~10</span></span>
<span class="lz-nbody">803 uses of <code>text-[11px]</code> is not a one-off; it is an unnamed part of the design system. Adding <code>xxs: '0.6875rem'</code> to <code>theme.extend.fontSize</code> turns 803 magic numbers into 803 uses of <code>text-xxs</code>. Chapter 5 does this properly.</span>
</div>
</div>

<h3>The counting rule</h3>
<p>The decision between "arbitrary value" and "extend the scale" is not a matter of taste — it has a threshold you can measure. Count the uses:</p>

<pre><code class="language-bash"># how many times does this exact arbitrary value appear?
$ grep -rho 'text-\\[11px\\]' src --include="*.tsx" | wc -l
</code></pre>

<div class="out">803
</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1-3 uses</span><span class="lz-lnote">leave it arbitrary. Naming it costs more than it saves, and a name implies a design decision that has not actually been made</span></div>
<div class="lz-layer"><span class="lz-lname">4-10 uses</span><span class="lz-lnote">judgement call. If the uses are all in one feature, leave it. If they are spread across features, it is becoming a system value — name it</span></div>
<div class="lz-layer"><span class="lz-lname">10+ uses</span><span class="lz-lnote">extend the scale. At this point it IS part of your design system, it just does not have a name yet. The cost of not naming it is that changing it later means 803 find-and-replaces instead of one config line</span></div>
</div>

<div class="callout warn">
<p><strong>The cost of never crossing the threshold.</strong> Suppose the design team decides badge text should be 12px instead of 11px. With a named scale value that is one line in the config. With 803 arbitrary values it is a find-and-replace across 793 files — and a find-and-replace that cannot distinguish "11px because it is a badge" from "11px because of a one-off alignment". The 803 uses have lost the information about <em>why</em> they are 11px, and no tool can recover it.</p>
</div>

<h3>The same story in the colour column</h3>
<p>Look again at entries 3, 4, 6 and 7 of the measurement: <code>border-[var(--border-color)]</code>, <code>text-[var(--text-secondary)]</code>, <code>bg-[var(--bg-surface)]</code>. These are arbitrary values whose contents are CSS variables — 339 + 281 + 147 = 767 uses reaching into a theme system that lives outside Tailwind's config.</p>

<p>That is a different kind of gap: not "the scale lacks a value" but "the value must be resolved at runtime, per theme, so it cannot be a build-time constant". Tailwind's answer is to put the variable <em>in the config</em> so the class name is clean, and this repo does exactly that elsewhere — <code>text-text-primary</code> (1,389 uses) is configured as <code>primary: "var(--text-primary)"</code>. Chapter 6 is entirely about this technique, and the 767 bracket-syntax uses above are the parts that have not been migrated to it yet.</p>

<div class="pitfall">
<p><strong>Trap — treating arbitrary values as forbidden.</strong> The opposite error to over-using them is a team that bans them, and then rounds every value to the scale whether or not that is correct. That produces a codebase where a button is 2px off from the third-party widget it must align with, forever, because the scale had no 37px. The bracket syntax exists because escape hatches are necessary. The rule is not "never" — it is "count, and name the ones that recur".</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A scale encodes someone else's guess about which values you need, and where the guess is wrong your codebase records it as arbitrary values — so count them: one or two is a legitimate escape hatch, 803 is an unnamed part of your design system that should be a config line instead.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Adding custom styles: arbitrary values</span><span class="lc-sub">tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values — the bracket syntax, including the escaping rules for values containing spaces or slashes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Theme: font size</span><span class="lc-sub">tailwindcss.com/docs/font-size — the scale measured in this lesson, plus the line-height pairing each entry carries that the measurement above deliberately strips.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG 1.4.4 — Resize text</span><span class="lc-sub">w3.org/WAI/WCAG21/Understanding/resize-text — relevant to the 10px and 11px decision. Small type is permitted, but it interacts with zoom requirements; Chapter 10 measures this repo against the criterion.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 5 — extending the scale properly</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — turning a counted, recurring arbitrary value into a named config entry, including why <code>extend</code> rather than replacing <code>theme</code> wholesale.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Chỗ cái thang HẾT, đo được</h2>
<p class="lead">Một cái thang là một tập QUYẾT ĐỊNH mà người khác đã ra về những giá trị bạn NÊN cần. Phần lớn thời gian các quyết định ấy tốt. Khi chúng không tốt, kho mã GHI LẠI sự bất đồng — và bạn đi đếm được.</p>

<h3>Thang cỡ chữ, đọc từ mã nguồn</h3>
<pre><code class="language-js">import resolveConfig from 'tailwindcss/resolveConfig.js';
const { theme } = resolveConfig({ content: [] });
for (const [k, v] of Object.entries(theme.fontSize)) {
  const size = Array.isArray(v) ? v[0] : v;
  console.log(&#96;text-\${k}&#96;.padEnd(12), size, parseFloat(size) * 16 + 'px');
}
</code></pre>

<div class="out">text-xs      0.75rem    12px
text-sm      0.875rem   14px
text-base    1rem       16px
text-lg      1.125rem   18px
text-xl      1.25rem    20px
text-2xl     1.5rem     24px
text-3xl     1.875rem   30px
text-4xl     2.25rem    36px
text-5xl     3rem       48px
text-6xl     3.75rem    60px
text-7xl     4.5rem     72px
text-8xl     6rem       96px
text-9xl     8rem       128px
</div>

<p>Hai sự thật về danh sách đó quan trọng hơn phần còn lại. Thứ nhất, ĐÁY của thang là <strong>12px</strong> — không có <code>text-2xs</code>, không có <code>text-3xs</code>, không có gì nhỏ hơn. Thứ hai, bước từ <code>text-xs</code> sang <code>text-sm</code> là 12px → 14px, nên <strong>13px cũng KHÔNG diễn đạt được</strong>.</p>

<h3>Một ứng dụng thật làm gì với chuyện đó</h3>
<p>Giờ hãy đếm xem frontend của kho này THẬT SỰ với tay tới cái gì. Mọi lớp dùng cú pháp ngoặc vuông giá trị tuỳ ý:</p>

<pre><code class="language-bash">$ grep -ho 'className="[^"]*"' -r src --include="*.tsx" \\
    | sed 's/className="//; s/"$//' | tr ' ' '\\n' \\
    | grep '\\[' | sort | uniq -c | sort -rn | head -8
</code></pre>

<div class="out">803 text-[11px]
595 text-[10px]
339 border-[var(--border-color)]
281 text-[var(--text-secondary)]
240 text-[13px]
185 text-[12px]
147 bg-[var(--bg-surface)]
134 bg-white/[0.02]
</div>

<p>Hai mục đầu là <strong>1.398 lượt dùng chữ 10px và 11px</strong> — những cỡ KHÔNG hề tồn tại trên thang. Cộng thêm <code>text-[13px]</code> ở mức 240 thì bạn có <strong>1.638 cú thoát</strong> gây ra bởi đúng hai lỗ hổng đã chỉ ra bên trên: không có gì dưới 12px, và không có gì giữa 12 và 14.</p>

<div class="callout ok">
<p><strong>Hãy đọc cái này như DỮ LIỆU, không phải như thất bại.</strong> Đây là một giao diện thông tin DÀY ĐẶC — huy hiệu, hàng siêu dữ liệu, dấu thời gian, ô bảng — và giao diện dày đặc CHÍNH ĐÁNG cần chữ dưới 12px. Tác giả cái thang tối ưu cho trang nội dung, nơi 12px là một cái sàn hợp lý. Không bên nào sai; cái thang đơn giản là KHÔNG khớp lĩnh vực của ứng dụng này, và 1.638 giá trị tuỳ ý là ĐỘ LỚN ĐO ĐƯỢC của sự lệch ấy.</p>
</div>

<h3>Ba cách đáp lại, và khi nào cái nào đúng</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">làm tròn về thang</span><span class="lz-nsub">đúng cho khác biệt một-lần, ít rủi ro</span></span>
<span class="lz-nbody">Bản mẫu ghi padding 30px; dùng <code>p-8</code> (32px). Không ai thấy 2px, và cái lưới còn nguyên. PHẦN LỚN các ca "thiết kế không khớp thang" thực ra là ca này, và với tay tới giá trị tuỳ ý ở đây chính là cách một cái thang âm thầm thôi có nghĩa.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">dùng giá trị tuỳ ý</span><span class="lz-nsub">đúng cho nhu cầu THẬT SỰ một-lần</span></span>
<span class="lz-nbody"><code>top-[37px]</code> để canh với một widget bên thứ ba, <code>w-[calc(100%-2rem)]</code> cho một bố cục cụ thể. Dùng vài lần thì đây đúng là thứ cú pháp ngoặc sinh ra để làm.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">MỞ RỘNG cái thang</span><span class="lz-nsub">đúng một khi số đếm vượt ~10</span></span>
<span class="lz-nbody">803 lượt <code>text-[11px]</code> KHÔNG phải một-lần; nó là một phần CHƯA CÓ TÊN của hệ thiết kế. Thêm <code>xxs: '0.6875rem'</code> vào <code>theme.extend.fontSize</code> biến 803 con số ma thuật thành 803 lượt dùng <code>text-xxs</code>. Chương 5 làm việc này cho tử tế.</span>
</div>
</div>

<h3>Luật ĐẾM</h3>
<p>Quyết định giữa "giá trị tuỳ ý" và "mở rộng thang" KHÔNG phải chuyện gu — nó có một NGƯỠNG đo được. Hãy đếm số lượt dùng:</p>

<pre><code class="language-bash"># gia tri tuy y CHINH XAC nay xuat hien bao nhieu lan?
$ grep -rho 'text-\\[11px\\]' src --include="*.tsx" | wc -l
</code></pre>

<div class="out">803
</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1-3 lượt</span><span class="lz-lnote">để tuỳ ý. Đặt tên tốn hơn cái nó tiết kiệm, và một cái tên ngụ ý một quyết định thiết kế mà thực ra chưa ai ra</span></div>
<div class="lz-layer"><span class="lz-lname">4-10 lượt</span><span class="lz-lnote">tuỳ phán đoán. Nếu các lượt dùng đều trong MỘT tính năng, để nguyên. Nếu chúng trải qua nhiều tính năng, nó đang thành một giá trị HỆ THỐNG — hãy đặt tên</span></div>
<div class="lz-layer"><span class="lz-lname">10+ lượt</span><span class="lz-lnote">mở rộng thang. Tới đây nó ĐÃ LÀ một phần hệ thiết kế của bạn, chỉ là chưa có tên. Cái giá của việc không đặt tên là đổi nó về sau nghĩa là 803 lần tìm-và-thay thay vì MỘT dòng config</span></div>
</div>

<div class="callout warn">
<p><strong>Cái giá của việc không bao giờ vượt ngưỡng.</strong> Giả sử đội thiết kế quyết chữ huy hiệu nên là 12px thay vì 11px. Với một giá trị thang CÓ TÊN thì đó là MỘT dòng trong config. Với 803 giá trị tuỳ ý thì đó là một cú tìm-và-thay xuyên 793 file — và một cú tìm-và-thay KHÔNG phân biệt được "11px vì nó là huy hiệu" với "11px vì một cú canh một-lần". 803 lượt dùng đã ĐÁNH MẤT thông tin về <em>VÌ SAO</em> chúng là 11px, và không công cụ nào phục hồi được.</p>
</div>

<h3>Cùng câu chuyện ở cột MÀU</h3>
<p>Nhìn lại mục 3, 4, 6 và 7 của phép đo: <code>border-[var(--border-color)]</code>, <code>text-[var(--text-secondary)]</code>, <code>bg-[var(--bg-surface)]</code>. Đây là các giá trị tuỳ ý mà nội dung là BIẾN CSS — 339 + 281 + 147 = 767 lượt với tay vào một hệ theme sống NGOÀI config của Tailwind.</p>

<p>Đó là một loại lỗ hổng KHÁC: không phải "thang thiếu một giá trị" mà "giá trị phải được phân giải LÚC CHẠY, theo từng theme, nên nó không thể là hằng số lúc dựng". Câu trả lời của Tailwind là đặt cái biến <em>VÀO CONFIG</em> để tên lớp sạch sẽ, và kho này làm ĐÚNG thế ở chỗ khác — <code>text-text-primary</code> (1.389 lượt) được cấu hình là <code>primary: "var(--text-primary)"</code>. Chương 6 dành trọn cho kỹ thuật này, và 767 lượt dùng cú pháp ngoặc bên trên là những phần CHƯA được chuyển sang nó.</p>

<div class="pitfall">
<p><strong>Bẫy — coi giá trị tuỳ ý là CẤM.</strong> Lỗi ngược với lạm dụng chúng là một đội CẤM chúng, rồi làm tròn mọi giá trị về thang bất kể điều đó có đúng hay không. Nó đẻ ra một kho mã nơi một cái nút lệch 2px so với widget bên thứ ba mà nó phải canh cùng, MÃI MÃI, vì thang không có 37px. Cú pháp ngoặc tồn tại vì cửa thoát là CẦN THIẾT. Luật KHÔNG phải "không bao giờ" — nó là "ĐẾM, và đặt tên cho những cái LẶP LẠI".</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một cái thang mã hoá phỏng đoán của người khác về những giá trị bạn cần, và chỗ phỏng đoán ấy sai thì kho mã của bạn GHI LẠI dưới dạng giá trị tuỳ ý — nên hãy ĐẾM chúng: một hai cái là cửa thoát chính đáng, 803 cái là một phần CHƯA CÓ TÊN của hệ thiết kế mà lẽ ra phải là một dòng config.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Adding custom styles: arbitrary values</span><span class="lc-sub">tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values — cú pháp ngoặc, gồm cả luật thoát ký tự cho giá trị chứa khoảng trắng hay dấu gạch chéo.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Theme: font size</span><span class="lc-sub">tailwindcss.com/docs/font-size — cái thang được đo trong bài này, cộng thêm cặp line-height mà mỗi mục mang theo và phép đo bên trên cố ý lột bỏ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG 1.4.4 — Resize text</span><span class="lc-sub">w3.org/WAI/WCAG21/Understanding/resize-text — liên quan tới quyết định 10px và 11px. Chữ nhỏ được PHÉP, nhưng nó tương tác với yêu cầu phóng to; Chương 10 đo kho này đối chiếu tiêu chí ấy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 5 — mở rộng thang cho tử tế</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — biến một giá trị tuỳ ý đã ĐẾM và LẶP LẠI thành một mục config có tên, gồm cả vì sao dùng <code>extend</code> chứ không thay trọn <code>theme</code>.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — The colour scale, and the step where contrast passes|||1.3 — Thang màu, và cái bậc mà tương phản ĐẠT',
      slug: 'tw-1-3-thang-mau',
      type: 'VIDEO',
      description: '22 họ màu × 11 bậc, và một số đo quyết định: `slate-400` trên nền trắng cho tỉ lệ tương phản 2,56 — TRƯỢT WCAG AA. `slate-500` cho 4,76 — vừa đủ ĐẠT. Bậc 500 là cái sàn, và đó là một con số chứ không phải một cảm giác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>The colour scale, and the step where contrast passes</h2>
<p class="lead">The colour scale looks like a design decision and is mostly a physics one. Each step is a luminance, contrast is a ratio of luminances, and accessibility requirements are stated as ratios — so the question "which step is safe for body text" has an exact answer you can compute rather than eyeball.</p>

<h3>The shape of the scale</h3>
<pre><code class="language-js">import resolveConfig from 'tailwindcss/resolveConfig.js';
const { theme } = resolveConfig({ content: [] });
const families = Object.entries(theme.colors).filter(([, v]) =&gt; typeof v === 'object');
console.log('families:', families.length);
console.log('steps   :', Object.keys(theme.colors.slate).join(' '));
</code></pre>

<div class="out">families: 22
steps   : 50 100 200 300 400 500 600 700 800 900 950
flat    : inherit current transparent black white
</div>

<p>22 colour families, each with 11 steps, plus five keyword values that are not colours in the usual sense. The step numbering is deliberately not linear: it runs 50, then 100-900 in hundreds, then 950. The 50 and 950 endpoints were added because the original 100-900 range did not go light or dark enough for real interfaces.</p>

<div class="callout">
<p><strong>What the number means.</strong> Higher number = darker. This is the opposite of font-weight, where higher = heavier but also, in a sense, "more". Here the number tracks <em>ink</em>: <code>50</code> is nearly white, <code>950</code> is nearly black. Once you have that, <code>bg-slate-100 text-slate-900</code> reads instantly as "very light background, very dark text".</p>
</div>

<h3>Measuring what the steps actually are</h3>
<p>Relative luminance is defined by WCAG, so it can be computed rather than guessed:</p>

<pre><code class="language-js">function lum(hex) {
  const [r, g, b] = [1, 3, 5].map(i =&gt; parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v =&gt; v &lt;= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
</code></pre>

<div class="out">slate-50   #f8fafc  L=0.9536
slate-100  #f1f5f9  L=0.9085
slate-200  #e2e8f0  L=0.8017
slate-300  #cbd5e1  L=0.6572
slate-400  #94a3b8  L=0.3595
slate-500  #64748b  L=0.1706
slate-600  #475569  L=0.0886
slate-700  #334155  L=0.0514
slate-800  #1e293b  L=0.0218
slate-900  #0f172a  L=0.0088
slate-950  #020617  L=0.0021
</div>

<p>The luminance drops fast and non-linearly — 300 to 400 nearly halves it, 400 to 500 halves it again. That is intentional: human brightness perception is roughly logarithmic, so evenly-spaced <em>perceived</em> steps require accelerating luminance drops.</p>

<h3>The measurement that decides your defaults</h3>
<p>WCAG 2.1 level AA requires a contrast ratio of at least <strong>4.5:1</strong> for normal body text. Contrast ratio is <code>(L_lighter + 0.05) / (L_darker + 0.05)</code>. Compute it for the common case — grey text on a white background:</p>

<div class="out">slate-400 on white: 2.56    ← TRUOT (can 4.5)
slate-500 on white: 4.76    ← DAT, vua du
slate-600 on white: 7.58    ← DAT thoai mai
slate-700 on white: 10.35   ← DAT, kem ca AAA (7.0)
</div>

<p>That single table is worth more than any amount of advice about colour. <strong><code>slate-400</code> on white fails</strong> — at 2.56 it is not close, it is roughly half the required ratio. <strong><code>slate-500</code> is the first step that passes</strong>, and it passes by 0.26. Everything at 600 and above is comfortable.</p>

<div class="callout warn">
<p><strong>Why this matters more than it seems.</strong> <code>text-slate-400</code> looks <em>lovely</em> in a mockup on a bright laptop screen. It is the classic "muted secondary text" choice, and it is the single most common accessibility failure in modern interfaces. The designer's eye does not compute ratios, and the failure is invisible to anyone with typical vision in good light — which is exactly the condition under which design review happens.</p>
</div>

<h3>The rule that falls out</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">body text on white</span><span class="lz-lnote"><code>-500</code> is the floor and it is a tight pass; <code>-600</code> or darker is the safe default. Anything <code>-400</code> or lighter is decorative only</span></div>
<div class="lz-layer"><span class="lz-lname">large text (18.66px bold, or 24px)</span><span class="lz-lnote">AA drops to 3:1, so <code>-400</code> becomes legal for headings. This is why a light-grey heading can be fine while light-grey body text is not</span></div>
<div class="lz-layer"><span class="lz-lname">text on a dark background</span><span class="lz-lnote">the arithmetic mirrors: <code>-400</code> and lighter pass on <code>-900</code>, and the mid steps (<code>-500</code>, <code>-600</code>) are the dangerous ones because they are far from both ends</span></div>
<div class="lz-layer"><span class="lz-lname">borders and dividers</span><span class="lz-lnote">not text, so 4.5 does not apply. WCAG 1.4.11 asks 3:1 for meaningful UI boundaries; purely decorative rules have no requirement — which is why <code>border-slate-200</code> is fine</span></div>
</div>

<h3>What this repository did instead</h3>
<p>Notice that the repo's own most-used text classes are not scale steps at all:</p>

<div class="out">2114 text-text-muted
1389 text-text-primary
 801 text-text-secondary
</div>

<p>Those come from config entries pointing at CSS variables — <code>primary: "var(--text-primary)"</code>. The reason is in the config's own comment: a hardcoded light-theme hex made <code>text-text-primary</code> render near-black on a dark background, i.e. invisible text. The fix was to make the value resolve per theme rather than per class. Chapter 6 covers the technique; the point here is that a three-step semantic scale (primary / secondary / muted) can be a better interface than eleven numeric steps, because it encodes the <em>decision</em> rather than the pigment.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">numeric steps</span><span class="lz-nsub"><code>text-slate-600</code></span></span>
<span class="lz-nbody">Says what the colour IS. Good for one-off decisions and for building the scale. Bad as a system default, because every use re-decides the contrast question and 400-vs-500 is easy to get wrong.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">semantic names</span><span class="lz-nsub"><code>text-text-muted</code></span></span>
<span class="lz-nbody">Says what the colour is FOR. The contrast decision is made once, in config, by someone who computed it. 2,114 uses inherit that decision instead of re-making it.</span>
</div>
</div>

<div class="pitfall">
<p><strong>Trap — assuming the same step is safe across families.</strong> The ratios above are for <code>slate</code>. Luminance depends on hue: <code>yellow-500</code> is far brighter than <code>blue-500</code> because the green channel dominates the luminance formula (0.7152 weight versus 0.0722 for blue). <code>text-yellow-500</code> on white is unreadable while <code>text-blue-500</code> on white is fine, and both are "step 500". Compute per family; never generalise a step number across hues.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The colour scale is 22 families × 11 steps where higher means darker, and the only step number worth memorising is that <strong>500 is roughly where text on white starts passing WCAG AA</strong> — but that boundary shifts with hue, so compute the ratio rather than trusting the number, and prefer semantic names so the computation happens once instead of at every call site.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG 2.1 — Contrast (Minimum), 1.4.3</span><span class="lc-sub">w3.org/WAI/WCAG21/Understanding/contrast-minimum — the 4.5:1 and 3:1 thresholds, and the exact definition of "large text" that moves the boundary.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG — relative luminance definition</span><span class="lc-sub">w3.org/WAI/GL/wiki/Relative_luminance — the formula implemented in this lesson's <code>lum()</code>, including why the channel weights are 0.2126 / 0.7152 / 0.0722.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Customizing colors</span><span class="lc-sub">tailwindcss.com/docs/customizing-colors — the full 22-family palette with every hex, and the notes on the 50/950 endpoints being later additions.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 10 — measuring this app against WCAG</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — running the contrast computation across the real palette this repository ships, and what it finds.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Thang màu, và cái bậc mà tương phản ĐẠT</h2>
<p class="lead">Thang màu TRÔNG như một quyết định thiết kế và phần lớn là một quyết định VẬT LÝ. Mỗi bậc là một độ chói, tương phản là một TỈ SỐ của độ chói, và yêu cầu về khả năng tiếp cận được phát biểu bằng tỉ số — nên câu hỏi "bậc nào an toàn cho chữ thân bài" có một đáp án CHÍNH XÁC bạn TÍNH được chứ không phải ước lượng bằng mắt.</p>

<h3>Hình dạng cái thang</h3>
<pre><code class="language-js">import resolveConfig from 'tailwindcss/resolveConfig.js';
const { theme } = resolveConfig({ content: [] });
const families = Object.entries(theme.colors).filter(([, v]) =&gt; typeof v === 'object');
console.log('families:', families.length);
console.log('steps   :', Object.keys(theme.colors.slate).join(' '));
</code></pre>

<div class="out">families: 22
steps   : 50 100 200 300 400 500 600 700 800 900 950
flat    : inherit current transparent black white
</div>

<p>22 họ màu, mỗi họ 11 bậc, cộng năm giá trị từ khoá không phải màu theo nghĩa thông thường. Cách đánh số bậc CỐ Ý không tuyến tính: nó chạy 50, rồi 100-900 theo hàng trăm, rồi 950. Hai đầu 50 và 950 được thêm vào vì dải gốc 100-900 KHÔNG đủ sáng hoặc đủ tối cho giao diện thật.</p>

<div class="callout">
<p><strong>Con số nghĩa là gì.</strong> Số CAO hơn = TỐI hơn. Chuyện này NGƯỢC với font-weight, nơi cao hơn = nặng hơn nhưng theo nghĩa nào đó cũng là "nhiều hơn". Ở đây con số bám theo <em>MỰC</em>: <code>50</code> gần trắng, <code>950</code> gần đen. Có nó rồi thì <code>bg-slate-100 text-slate-900</code> đọc ra ngay lập tức là "nền rất sáng, chữ rất tối".</p>
</div>

<h3>Đo xem các bậc THẬT SỰ là gì</h3>
<p>Độ chói tương đối được WCAG định nghĩa, nên nó TÍNH được chứ không phải đoán:</p>

<pre><code class="language-js">function lum(hex) {
  const [r, g, b] = [1, 3, 5].map(i =&gt; parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v =&gt; v &lt;= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
</code></pre>

<div class="out">slate-50   #f8fafc  L=0.9536
slate-100  #f1f5f9  L=0.9085
slate-200  #e2e8f0  L=0.8017
slate-300  #cbd5e1  L=0.6572
slate-400  #94a3b8  L=0.3595
slate-500  #64748b  L=0.1706
slate-600  #475569  L=0.0886
slate-700  #334155  L=0.0514
slate-800  #1e293b  L=0.0218
slate-900  #0f172a  L=0.0088
slate-950  #020617  L=0.0021
</div>

<p>Độ chói tụt NHANH và PHI TUYẾN — 300 sang 400 gần như chia đôi, 400 sang 500 lại chia đôi lần nữa. Đó là chủ ý: cảm nhận độ sáng của con người xấp xỉ LÔ-GA-RÍT, nên các bậc cách đều nhau về <em>CẢM NHẬN</em> đòi hỏi độ chói tụt gia tốc.</p>

<h3>Phép đo quyết định giá trị mặc định của bạn</h3>
<p>WCAG 2.1 mức AA đòi tỉ lệ tương phản ít nhất <strong>4,5:1</strong> cho chữ thân bài thường. Tỉ lệ tương phản là <code>(L_sáng + 0,05) / (L_tối + 0,05)</code>. Tính nó cho ca thường gặp — chữ xám trên nền trắng:</p>

<div class="out">slate-400 on white: 2.56    ← TRUOT (can 4.5)
slate-500 on white: 4.76    ← DAT, vua du
slate-600 on white: 7.58    ← DAT thoai mai
slate-700 on white: 10.35   ← DAT, kem ca AAA (7.0)
</div>

<p>Một cái bảng ấy đáng giá hơn mọi lời khuyên về màu. <strong><code>slate-400</code> trên trắng TRƯỢT</strong> — ở mức 2,56 nó không hề sát, nó bằng khoảng MỘT NỬA tỉ lệ yêu cầu. <strong><code>slate-500</code> là bậc ĐẦU TIÊN đạt</strong>, và nó đạt dư 0,26. Mọi thứ từ 600 trở lên đều thoải mái.</p>

<div class="callout warn">
<p><strong>Vì sao chuyện này quan trọng hơn vẻ ngoài của nó.</strong> <code>text-slate-400</code> trông <em>ĐẸP</em> trong một bản mẫu trên màn laptop sáng. Nó là lựa chọn "chữ phụ mờ mờ" kinh điển, và nó là cú hỏng tiếp cận PHỔ BIẾN NHẤT trong giao diện hiện đại. Mắt nhà thiết kế KHÔNG tính tỉ số, và cú hỏng VÔ HÌNH với bất kỳ ai thị lực bình thường trong ánh sáng tốt — mà đó chính xác là điều kiện diễn ra buổi duyệt thiết kế.</p>
</div>

<h3>Cái luật rơi ra</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">chữ thân bài trên trắng</span><span class="lz-lnote"><code>-500</code> là cái SÀN và nó đạt sát nút; <code>-600</code> hoặc tối hơn là mặc định AN TOÀN. Bất cứ thứ gì <code>-400</code> hoặc nhạt hơn chỉ dùng để TRANG TRÍ</span></div>
<div class="lz-layer"><span class="lz-lname">chữ lớn (18,66px đậm, hoặc 24px)</span><span class="lz-lnote">AA hạ xuống 3:1, nên <code>-400</code> trở thành hợp lệ cho tiêu đề. Đây là lý do một tiêu đề xám nhạt có thể ổn trong khi chữ thân bài xám nhạt thì không</span></div>
<div class="lz-layer"><span class="lz-lname">chữ trên nền TỐI</span><span class="lz-lnote">số học phản chiếu: <code>-400</code> và nhạt hơn ĐẠT trên nền <code>-900</code>, và các bậc GIỮA (<code>-500</code>, <code>-600</code>) mới là nguy hiểm vì chúng xa cả hai đầu</span></div>
<div class="lz-layer"><span class="lz-lname">viền và đường phân cách</span><span class="lz-lnote">không phải chữ, nên 4,5 không áp. WCAG 1.4.11 đòi 3:1 cho ranh giới giao diện CÓ NGHĨA; đường thuần trang trí không có yêu cầu — đó là lý do <code>border-slate-200</code> ổn</span></div>
</div>

<h3>Kho này đã làm gì thay vào đó</h3>
<p>Để ý rằng những lớp chữ được dùng nhiều nhất của chính kho này KHÔNG phải bậc thang gì cả:</p>

<div class="out">2114 text-text-muted
1389 text-text-primary
 801 text-text-secondary
</div>

<p>Chúng đến từ các mục config trỏ vào BIẾN CSS — <code>primary: "var(--text-primary)"</code>. Lý do nằm trong chính comment của config: một mã hex theme sáng đóng cứng đã làm <code>text-text-primary</code> hiện ra gần-đen trên nền tối, tức chữ VÔ HÌNH. Cách vá là làm giá trị phân giải THEO TỪNG THEME chứ không theo từng lớp. Chương 6 bao kỹ thuật ấy; điểm ở đây là một thang NGỮ NGHĨA ba bậc (primary / secondary / muted) có thể là giao diện TỐT HƠN mười một bậc số, vì nó mã hoá <em>QUYẾT ĐỊNH</em> chứ không mã hoá SẮC TỐ.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bậc SỐ</span><span class="lz-nsub"><code>text-slate-600</code></span></span>
<span class="lz-nbody">Nói màu ấy LÀ GÌ. Tốt cho quyết định một-lần và cho việc dựng thang. TỆ làm mặc định hệ thống, vì mỗi lần dùng lại phải QUYẾT LẠI câu hỏi tương phản và 400-hay-500 rất dễ nhầm.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">tên NGỮ NGHĨA</span><span class="lz-nsub"><code>text-text-muted</code></span></span>
<span class="lz-nbody">Nói màu ấy ĐỂ LÀM GÌ. Quyết định tương phản được ra MỘT lần, trong config, bởi người đã TÍNH nó. 2.114 lượt dùng THỪA HƯỞNG quyết định ấy thay vì tự ra lại.</span>
</div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cho rằng cùng một bậc thì an toàn ở mọi họ màu.</strong> Các tỉ số bên trên là cho <code>slate</code>. Độ chói phụ thuộc SẮC: <code>yellow-500</code> sáng hơn <code>blue-500</code> rất nhiều vì kênh lục chi phối công thức độ chói (trọng số 0,7152 đối lập 0,0722 cho lam). <code>text-yellow-500</code> trên trắng không đọc nổi trong khi <code>text-blue-500</code> trên trắng thì ổn, và cả hai đều là "bậc 500". Hãy TÍNH theo từng họ; đừng bao giờ tổng quát hoá một con số bậc qua các sắc.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Thang màu là 22 họ × 11 bậc trong đó cao hơn nghĩa là tối hơn, và con số bậc DUY NHẤT đáng thuộc là <strong>500 xấp xỉ là chỗ chữ trên nền trắng bắt đầu ĐẠT WCAG AA</strong> — nhưng ranh giới ấy DỊCH theo sắc, nên hãy TÍNH tỉ số thay vì tin con số, và ưu tiên tên ngữ nghĩa để phép tính xảy ra MỘT lần thay vì ở mọi chỗ gọi.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG 2.1 — Contrast (Minimum), 1.4.3</span><span class="lc-sub">w3.org/WAI/WCAG21/Understanding/contrast-minimum — các ngưỡng 4,5:1 và 3:1, và định nghĩa CHÍNH XÁC của "chữ lớn" thứ làm dịch ranh giới.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG — định nghĩa độ chói tương đối</span><span class="lc-sub">w3.org/WAI/GL/wiki/Relative_luminance — công thức được cài trong hàm <code>lum()</code> của bài này, gồm cả vì sao trọng số kênh là 0,2126 / 0,7152 / 0,0722.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Customizing colors</span><span class="lc-sub">tailwindcss.com/docs/customizing-colors — bảng màu 22 họ đầy đủ với mọi mã hex, và ghi chú về hai đầu 50/950 là phần thêm vào sau.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 10 — đo ứng dụng này đối chiếu WCAG</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — chạy phép tính tương phản trên bảng màu THẬT mà kho này giao, và nó tìm ra gì.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — Layout: why flex outnumbers grid 9.7 to 1|||1.4 — Bố cục: vì sao flex nhiều hơn grid 9,7 lần',
      slug: 'tw-1-4-bo-cuc',
      type: 'VIDEO',
      description: 'Đo thật: `flex` 5.295 lượt, `grid` 547 lượt. Và 69% số thẻ có `flex` cũng có `items-center`. Hai con số ấy nói cho bạn biết bố cục giao diện thật SỰ trông ra sao — và vì sao một cặp lớp lại chiếm ưu thế đến vậy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Layout: why flex outnumbers grid 9.7 to 1</h2>
<p class="lead">Tailwind's layout utilities are a thin renaming of CSS flexbox and grid — <code>flex</code> is <code>display: flex</code> and nothing more. What is worth learning is not the renaming but the <em>usage distribution</em>, because it tells you which four or five classes carry almost all the weight.</p>

<h3>The distribution</h3>
<pre><code class="language-bash">$ for c in flex grid inline-flex block hidden absolute relative; do
    printf "%-14s %6d\\n" "$c" "$(grep -ho 'className="[^"]*"' -r src --include="*.tsx" \\
      | sed 's/className="//;s/"$//' | tr ' ' '\\n' | grep -cx "$c")"
  done
</code></pre>

<div class="out">flex             5295
inline-flex      1010
absolute          830
relative          614
grid              547
block             416
hidden            250
</div>

<p><strong><code>flex</code> beats <code>grid</code> 5,295 to 547</strong> — a ratio of 9.7 to 1. That is not because grid is worse. It is because most of what an interface does is arrange a <em>few</em> items along <em>one</em> axis: an icon next to a label, a title with a button pushed to the right, a row of tags. Grid earns its keep on two-dimensional page-level layouts, and a typical app has a handful of those and many thousands of one-dimensional rows.</p>

<h3>The pairing that dominates everything</h3>
<pre><code class="language-bash">$ grep -ho 'className="[^"]*"' -r src --include="*.tsx" | grep -c 'flex'
$ grep -ho 'className="[^"]*"' -r src --include="*.tsx" | grep 'flex' | grep -c 'items-center'
</code></pre>

<div class="out">7172    # thuoc tinh class co nhac 'flex'
4955    # trong so do, cung co 'items-center'  => 69,1%
</div>

<p>Sixty-nine percent. Recall from Section 0 that <code>flex</code> (5,295) and <code>items-center</code> (4,924) are the two most-used classes in the entire application, ahead of every colour, size and spacing class. They are effectively one idiom that happens to be spelled as two words.</p>

<div class="callout ok">
<p><strong>Why the pair is so common.</strong> <code>display: flex</code> alone stretches children to equal height (<code>align-items: stretch</code> is the default). That is almost never what you want when placing an icon beside text — the icon's box grows to the text's height and the icon floats at the top. <code>items-center</code> is the fix, and because the problem is universal so is the fix. If you write <code>flex</code> and the layout looks subtly off, the missing <code>items-center</code> is the first thing to check.</p>
</div>

<h3>The vocabulary that actually matters</h3>
<p>Given the distribution, the honest short list is small. These are worth knowing cold; everything else you can derive or look up:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>flex</code> + <code>items-center</code></span><span class="lz-lnote">the base idiom. Horizontal row, children vertically centred. 4,955 elements in this app</span></div>
<div class="lz-layer"><span class="lz-lname"><code>gap-2</code> / <code>gap-3</code></span><span class="lz-lnote">space between flex children. Replaces the old margin-on-every-child-but-the-last trick entirely — 2,111 + 880 uses here. Prefer it over margins; it cannot leave a stray edge margin</span></div>
<div class="lz-layer"><span class="lz-lname"><code>justify-between</code></span><span class="lz-lnote">660 uses. Title on the left, action on the right, space distributed between. The single most useful justify value in app UI</span></div>
<div class="lz-layer"><span class="lz-lname"><code>flex-1</code></span><span class="lz-lnote">887 uses. "This child takes the remaining space". The workhorse for a content area beside a fixed sidebar</span></div>
<div class="lz-layer"><span class="lz-lname"><code>shrink-0</code></span><span class="lz-lnote">987 uses — more than <code>grid</code>. Stops a flex child from being squeezed below its natural size. Almost always applied to icons, because a squashed icon is the classic flex bug</span></div>
<div class="lz-layer"><span class="lz-lname"><code>flex-wrap</code></span><span class="lz-lnote">646 uses. Lets a row become several rows. Without it, a long list of tags overflows its container instead of wrapping</span></div>
</div>

<h3>Reading <code>shrink-0</code>'s 987 uses as a bug report</h3>
<p>That number is worth pausing on. <code>shrink-0</code> is used more often than <code>grid</code>, <code>block</code> and <code>hidden</code> combined. It exists because flexbox's default is <code>flex-shrink: 1</code> — every child may be compressed below its content size when space is tight. For text that is usually fine. For a 16×16 icon it produces a squashed oval, and the failure only appears at narrow widths, which is why it survives desktop testing and shows up on phones.</p>

<pre><code class="language-jsx">{/* BUG: at narrow widths the icon compresses to an oval */}
&lt;div className="flex items-center gap-2"&gt;
  &lt;Icon className="h-4 w-4" /&gt;
  &lt;span&gt;A long label that will take all available space&lt;/span&gt;
&lt;/div&gt;

{/* FIXED: the icon keeps its 16x16 box no matter what */}
&lt;div className="flex items-center gap-2"&gt;
  &lt;Icon className="h-4 w-4 shrink-0" /&gt;
  &lt;span className="truncate"&gt;A long label …&lt;/span&gt;
&lt;/div&gt;
</code></pre>

<p>Note that <code>h-4 w-4</code> does <em>not</em> prevent the shrink. Width is a starting size, not a floor — flexbox is explicitly allowed to go below it. Only <code>shrink-0</code> (or a <code>min-w-</code>) makes it a floor. This surprises people the first time because "I set the width" feels like it should be binding, and it is not.</p>

<h3>Where grid is the right answer</h3>
<p>The 9.7:1 ratio is a description, not a recommendation. Grid wins whenever the two-dimensional relationship is the point:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">reach for flex</span><span class="lz-nsub">one axis, content-sized items</span></span>
<span class="lz-nbody">Rows, toolbars, an icon beside a label, a stack of cards. The item sizes come from their content and you are arranging along a line. This is 90% of app UI, hence 5,295 uses.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">reach for grid</span><span class="lz-nsub">two axes, or alignment ACROSS rows</span></span>
<span class="lz-nbody">A card gallery where every card must be the same width, a form where labels align in a column, a page shell with header/sidebar/content. Crucially: if things in <em>different</em> rows must line up, flex cannot do it and grid can.</span>
</div>
</div>

<div class="pitfall">
<p><strong>Trap — building a table-like layout out of nested flex rows.</strong> It looks fine with the sample data and breaks the moment one cell's content is longer, because each row computes its columns independently. Nothing aligns. This is the clearest signal that grid was the right tool: <em>alignment across siblings requires a shared coordinate system</em>, and rows of flex do not have one. Reach for <code>grid-cols-*</code> rather than adding fixed widths to every cell.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Layout utilities are a direct renaming of CSS, so what is worth learning is the distribution rather than the list — <code>flex</code> plus <code>items-center</code> is one idiom covering the majority of real UI, <code>shrink-0</code>'s 987 uses record that flex children compress below their set width by default, and grid earns its place exactly when things in different rows must align.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Basic concepts of flexbox</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox — the model Tailwind renames. The section on <code>flex-shrink</code> defaulting to 1 is the whole explanation for <code>shrink-0</code>'s 987 uses.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CSS Tricks — A Complete Guide to Flexbox</span><span class="lc-sub">css-tricks.com/snippets/css/a-guide-to-flexbox — the reference chart worth keeping open for a week. Every property on it maps to a Tailwind class by an obvious renaming.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Flex &amp; Grid</span><span class="lc-sub">tailwindcss.com/docs/flex-basis — the utility list. Skim rather than read; the distribution above says which entries you will actually use.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — flexbox and grid from first principles</span><span class="lc-sub">/courses/web-foundations/learn${REF} — the layout algorithms themselves, including why flex sizing is a negotiation between basis, grow and shrink rather than a fixed assignment.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Bố cục: vì sao flex nhiều hơn grid 9,7 lần</h2>
<p class="lead">Các tiện ích bố cục của Tailwind là một cú ĐỔI TÊN mỏng của flexbox và grid trong CSS — <code>flex</code> là <code>display: flex</code> và không gì hơn. Thứ đáng học KHÔNG phải cú đổi tên mà là <em>PHÂN BỐ SỬ DỤNG</em>, vì nó nói cho bạn biết bốn năm lớp nào gánh gần như toàn bộ sức nặng.</p>

<h3>Phân bố</h3>
<pre><code class="language-bash">$ for c in flex grid inline-flex block hidden absolute relative; do
    printf "%-14s %6d\\n" "$c" "$(grep -ho 'className="[^"]*"' -r src --include="*.tsx" \\
      | sed 's/className="//;s/"$//' | tr ' ' '\\n' | grep -cx "$c")"
  done
</code></pre>

<div class="out">flex             5295
inline-flex      1010
absolute          830
relative          614
grid              547
block             416
hidden            250
</div>

<p><strong><code>flex</code> thắng <code>grid</code> 5.295 đối 547</strong> — tỉ lệ 9,7 trên 1. Đó KHÔNG phải vì grid tệ hơn. Đó là vì phần lớn cái một giao diện làm là sắp <em>VÀI</em> món dọc <em>MỘT</em> trục: một biểu tượng cạnh một nhãn, một tiêu đề với một nút bị đẩy sang phải, một hàng thẻ. Grid xứng đáng chỗ đứng ở các bố cục HAI CHIỀU cấp trang, và một ứng dụng điển hình có một nhúm cái đó và hàng nghìn hàng một-chiều.</p>

<h3>Cái CẶP chi phối mọi thứ</h3>
<pre><code class="language-bash">$ grep -ho 'className="[^"]*"' -r src --include="*.tsx" | grep -c 'flex'
$ grep -ho 'className="[^"]*"' -r src --include="*.tsx" | grep 'flex' | grep -c 'items-center'
</code></pre>

<div class="out">7172    # thuoc tinh class co nhac 'flex'
4955    # trong so do, cung co 'items-center'  => 69,1%
</div>

<p>Sáu mươi chín phần trăm. Nhớ lại từ Mục 0 rằng <code>flex</code> (5.295) và <code>items-center</code> (4.924) là hai lớp được dùng nhiều nhất trong TOÀN BỘ ứng dụng, vượt trên mọi lớp màu, cỡ và khoảng cách. Chúng thực chất là MỘT thành ngữ tình cờ được viết thành hai từ.</p>

<div class="callout ok">
<p><strong>Vì sao cái cặp ấy phổ biến đến thế.</strong> Chỉ mình <code>display: flex</code> sẽ KÉO GIÃN các con tới chiều cao bằng nhau (<code>align-items: stretch</code> là mặc định). Đó gần như không bao giờ là cái bạn muốn khi đặt một biểu tượng cạnh chữ — cái hộp của biểu tượng nở tới chiều cao của chữ và biểu tượng trôi lên trên cùng. <code>items-center</code> là cú vá, và vì vấn đề PHỔ QUÁT nên cú vá cũng vậy. Nếu bạn viết <code>flex</code> mà bố cục trông lệch lệch, thiếu <code>items-center</code> là thứ đầu tiên cần kiểm.</p>
</div>

<h3>Vốn từ THẬT SỰ quan trọng</h3>
<p>Với phân bố ấy, danh sách ngắn trung thực rất nhỏ. Chừng này đáng thuộc nằm lòng; còn lại bạn suy ra hoặc tra được:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>flex</code> + <code>items-center</code></span><span class="lz-lnote">thành ngữ nền. Hàng ngang, các con căn giữa theo chiều dọc. 4.955 thẻ trong ứng dụng này</span></div>
<div class="lz-layer"><span class="lz-lname"><code>gap-2</code> / <code>gap-3</code></span><span class="lz-lnote">khoảng cách giữa các con flex. Thay thế HOÀN TOÀN mẹo cũ margin-cho-mọi-con-trừ-cái-cuối — 2.111 + 880 lượt ở đây. Ưu tiên nó hơn margin; nó KHÔNG thể để sót một margin mép thừa</span></div>
<div class="lz-layer"><span class="lz-lname"><code>justify-between</code></span><span class="lz-lnote">660 lượt. Tiêu đề bên trái, hành động bên phải, khoảng trống chia đều ở giữa. Giá trị justify hữu ích nhất trong giao diện ứng dụng</span></div>
<div class="lz-layer"><span class="lz-lname"><code>flex-1</code></span><span class="lz-lnote">887 lượt. "Đứa con này lấy phần không gian còn lại". Con ngựa thồ cho một vùng nội dung cạnh một thanh bên cố định</span></div>
<div class="lz-layer"><span class="lz-lname"><code>shrink-0</code></span><span class="lz-lnote">987 lượt — NHIỀU HƠN <code>grid</code>. Chặn một con flex bị bóp xuống dưới kích thước tự nhiên. Gần như luôn áp lên biểu tượng, vì một biểu tượng bị bẹp là con bọ flex kinh điển</span></div>
<div class="lz-layer"><span class="lz-lname"><code>flex-wrap</code></span><span class="lz-lnote">646 lượt. Cho phép một hàng trở thành nhiều hàng. Không có nó, một danh sách thẻ dài sẽ TRÀN ra khỏi vật chứa thay vì xuống dòng</span></div>
</div>

<h3>Đọc 987 lượt của <code>shrink-0</code> như một BÁO CÁO LỖI</h3>
<p>Con số ấy đáng dừng lại. <code>shrink-0</code> được dùng nhiều hơn <code>grid</code>, <code>block</code> và <code>hidden</code> CỘNG LẠI. Nó tồn tại vì mặc định của flexbox là <code>flex-shrink: 1</code> — mọi đứa con ĐỀU CÓ THỂ bị nén xuống dưới kích thước nội dung khi chật chỗ. Với chữ thì thường ổn. Với một biểu tượng 16×16 nó đẻ ra một hình bầu dục bẹp, và cú hỏng CHỈ hiện ra ở bề ngang hẹp, đó là lý do nó sống sót qua thử nghiệm trên desktop và hiện ra trên điện thoại.</p>

<pre><code class="language-jsx">{/* BO: o be ngang hep bieu tuong bi nen thanh hinh bau duc */}
&lt;div className="flex items-center gap-2"&gt;
  &lt;Icon className="h-4 w-4" /&gt;
  &lt;span&gt;Mot cai nhan dai se lay het cho trong&lt;/span&gt;
&lt;/div&gt;

{/* DA VA: bieu tuong giu nguyen hop 16x16 bat ke the nao */}
&lt;div className="flex items-center gap-2"&gt;
  &lt;Icon className="h-4 w-4 shrink-0" /&gt;
  &lt;span className="truncate"&gt;Mot cai nhan dai …&lt;/span&gt;
&lt;/div&gt;
</code></pre>

<p>Để ý rằng <code>h-4 w-4</code> <em>KHÔNG</em> ngăn được cú co lại. Chiều rộng là kích thước KHỞI ĐIỂM, không phải một cái SÀN — flexbox được PHÉP tường minh đi xuống dưới nó. Chỉ <code>shrink-0</code> (hoặc một <code>min-w-</code>) mới biến nó thành sàn. Chuyện này làm người ta bất ngờ lần đầu vì "tôi ĐÃ đặt chiều rộng rồi" có cảm giác phải là ràng buộc, mà nó không phải.</p>

<h3>Chỗ grid MỚI là câu trả lời đúng</h3>
<p>Tỉ lệ 9,7:1 là một MÔ TẢ, không phải một lời khuyên. Grid thắng bất cứ khi nào quan hệ HAI CHIỀU mới là trọng tâm:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">với tay tới flex</span><span class="lz-nsub">một trục, món cỡ-theo-nội-dung</span></span>
<span class="lz-nbody">Hàng, thanh công cụ, một biểu tượng cạnh nhãn, một chồng thẻ. Kích thước món đến TỪ nội dung của chúng và bạn đang sắp dọc một đường. Đây là 90% giao diện ứng dụng, nên mới có 5.295 lượt.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">với tay tới grid</span><span class="lz-nsub">hai trục, hoặc canh hàng XUYÊN QUA các hàng</span></span>
<span class="lz-nbody">Một thư viện thẻ nơi mọi thẻ phải cùng bề rộng, một biểu mẫu nơi nhãn thẳng cột, một khung trang với đầu/thanh bên/nội dung. Then chốt: nếu những thứ ở các hàng <em>KHÁC NHAU</em> phải thẳng hàng, flex KHÔNG làm được và grid làm được.</span>
</div>
</div>

<div class="pitfall">
<p><strong>Bẫy — dựng một bố cục kiểu BẢNG bằng các hàng flex lồng nhau.</strong> Nó trông ổn với dữ liệu mẫu và VỠ ngay khi nội dung một ô dài hơn, vì mỗi hàng TỰ tính cột của nó độc lập. Không gì thẳng hàng. Đây là tín hiệu rõ nhất rằng grid mới là công cụ đúng: <em>canh hàng xuyên qua các anh em đòi một hệ toạ độ CHUNG</em>, và các hàng flex không có cái đó. Với tay tới <code>grid-cols-*</code> thay vì thêm chiều rộng cố định cho mọi ô.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Tiện ích bố cục là một cú đổi tên trực tiếp của CSS, nên thứ đáng học là PHÂN BỐ chứ không phải danh sách — <code>flex</code> cộng <code>items-center</code> là MỘT thành ngữ bao phần lớn giao diện thật, 987 lượt của <code>shrink-0</code> GHI LẠI chuyện con flex mặc định co xuống dưới chiều rộng đã đặt, và grid giành được chỗ đứng đúng khi những thứ ở các hàng khác nhau phải thẳng hàng.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Basic concepts of flexbox</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox — cái mô hình mà Tailwind đổi tên. Mục về <code>flex-shrink</code> mặc định bằng 1 là toàn bộ lời giải thích cho 987 lượt của <code>shrink-0</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CSS Tricks — A Complete Guide to Flexbox</span><span class="lc-sub">css-tricks.com/snippets/css/a-guide-to-flexbox — bảng tra đáng mở suốt một tuần. Mọi thuộc tính trên đó ánh xạ sang một lớp Tailwind bằng một cú đổi tên hiển nhiên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Flex &amp; Grid</span><span class="lc-sub">tailwindcss.com/docs/flex-basis — danh sách tiện ích. LƯỚT chứ đừng đọc; phân bố bên trên đã nói mục nào bạn thật sự sẽ dùng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — flexbox và grid từ nguyên lý đầu</span><span class="lc-sub">/courses/web-foundations/learn${REF} — chính các thuật toán bố cục, gồm cả vì sao định cỡ flex là một cuộc THƯƠNG LƯỢNG giữa basis, grow và shrink chứ không phải một phép gán cố định.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — Sizing: the scale plus 35 things that are not lengths|||1.5 — Định cỡ: cái thang cộng 35 thứ KHÔNG phải độ dài',
      slug: 'tw-1-5-dinh-co',
      type: 'VIDEO',
      description: '`width` có 70 khoá: 35 khoá khoảng cách quen thuộc, cộng 35 khoá KHÁC HẲN — phân số, `full`, `screen`, `min`/`max`/`fit`. Nhóm thứ hai mới là nhóm quan trọng, vì chúng KHÔNG phải con số và không tuân luật nhân-bốn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Sizing: the scale plus 35 things that are not lengths</h2>
<p class="lead">Width and height reuse the spacing scale, so <code>w-4</code> is 16px by the rule from lesson 1.1. But the sizing scale is twice as large as the spacing scale, and the extra half is where the interesting behaviour lives — because those entries are not lengths at all.</p>

<h3>Counting the two halves</h3>
<pre><code class="language-js">const wk = Object.keys(theme.width);
console.log('width keys:', wk.length, '| spacing keys:', Object.keys(theme.spacing).length);
console.log(wk.filter(k =&gt; !(k in theme.spacing)).join(' '));
</code></pre>

<div class="out">width keys: 70 | spacing keys: 35

auto 1/2 1/3 2/3 1/4 2/4 3/4 1/5 2/5 3/5 4/5 1/6 2/6 3/6 4/6 5/6
1/12 2/12 3/12 4/12 5/12 6/12 7/12 8/12 9/12 10/12 11/12
full screen svw lvw dvw min max fit
</div>

<p>Exactly half the keys are the spacing scale, and the other 35 fall into three groups that behave completely differently from a fixed length.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">fractions</span><span class="lz-nsub"><code>1/2</code> … <code>11/12</code>, plus <code>full</code></span></span>
<span class="lz-nbody">Percentages of the <em>parent</em>. <code>w-1/2</code> emits <code>width: 50%</code>. The twelfths exist because 12 divides by 2, 3, 4 and 6 — the same reason CSS grid systems have used 12 columns for twenty years.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">viewport</span><span class="lz-nsub"><code>screen</code>, <code>svw</code>, <code>lvw</code>, <code>dvw</code></span></span>
<span class="lz-nbody">Relative to the window, not the parent. The three-letter ones are the newer small/large/dynamic viewport units that exist specifically because mobile browser chrome shrinks and grows as you scroll.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">content-driven</span><span class="lz-nsub"><code>min</code>, <code>max</code>, <code>fit</code>, <code>auto</code></span></span>
<span class="lz-nbody">The browser computes the size from the content. <code>w-fit</code> is "as wide as my contents need". These are the ones people forget exist and reimplement badly with fixed widths.</span>
</div>
</div>

<h3>The distinction that causes real bugs</h3>
<p>Percentages resolve against the <em>parent's</em> size; viewport units resolve against the <em>window</em>. Mixing them up produces layouts that look right in one container and wrong in another:</p>

<pre><code class="language-jsx">{/* inside a 400px sidebar */}
&lt;div className="w-full"&gt;   {/* 400px — fills the sidebar */}
&lt;div className="w-screen"&gt; {/* 1440px — bursts out of the sidebar */}
</code></pre>

<p><code>w-screen</code> inside a constrained container is the classic version of this bug. It does not error; the element simply overflows, and if the parent has <code>overflow-hidden</code> the excess is invisible, so the symptom is "my element is mysteriously cut off" rather than "my element is too wide".</p>

<div class="callout warn">
<p><strong>The mobile viewport trap, and why there are three units.</strong> On mobile browsers the address bar hides as you scroll, so the viewport height <em>changes during the scroll</em>. <code>h-screen</code> (<code>100vh</code>) resolves against the <em>largest</em> possible viewport, so a full-height element is taller than the visible area when the bar is showing — the bottom of your layout sits under the browser chrome. <code>dvh</code> tracks the current size, <code>svh</code> the smallest. If a full-screen mobile layout has content hidden behind the browser bar, this is the cause, and <code>h-dvh</code> is usually the fix.</p>
</div>

<h3>The content-driven trio, which people underuse</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>w-fit</code></span><span class="lz-lnote"><code>width: fit-content</code>. As wide as the content, but never wider than the parent. The right answer for a button or badge that should hug its label — instead of guessing a fixed width that breaks when the label is translated</span></div>
<div class="lz-layer"><span class="lz-lname"><code>w-min</code></span><span class="lz-lnote"><code>min-content</code>. As narrow as possible without overflowing — roughly the longest single word. Useful for forcing a wrap point</span></div>
<div class="lz-layer"><span class="lz-lname"><code>w-max</code></span><span class="lz-lnote"><code>max-content</code>. As wide as the content wants, ignoring the parent — so it CAN overflow. Useful inside a horizontally scrolling container, dangerous everywhere else</span></div>
<div class="lz-layer"><span class="lz-lname"><code>w-auto</code></span><span class="lz-lnote">the browser default. Means different things by display type: for a block element it fills the parent, for an inline-block it hugs the content. This context-dependence is why the explicit trio above is usually clearer</span></div>
</div>

<h3><code>maxWidth</code> carries an extra idea</h3>
<p>The <code>maxWidth</code> scale includes everything above plus a named typographic scale and one unusual entry:</p>

<div class="out">... none xs sm md lg xl 2xl 3xl 4xl 5xl 6xl 7xl full min max fit prose
    screen-sm screen-md screen-lg screen-xl screen-2xl
</div>

<p><code>max-w-prose</code> is <code>65ch</code> — sixty-five character widths, which is the typographic convention for comfortable reading line length. It is the only utility in the default config that encodes a readability rule rather than a measurement, and it is the correct default for any long-form text column. Most hand-rolled article layouts reinvent it as a magic pixel value.</p>

<h3>Breakpoints are a separate, smaller scale</h3>
<pre><code class="language-js">console.log(JSON.stringify(theme.screens));
</code></pre>

<div class="out">{"sm":"640px","md":"768px","lg":"1024px","xl":"1280px","2xl":"1536px"}
</div>

<p>Five values, and one property worth internalising: Tailwind's breakpoints are <strong>min-width</strong>. <code>md:flex</code> means "flex at 768px <em>and above</em>", not "flex on medium screens". The base class is the small case and each breakpoint overrides upward — which is why mobile-first is not a style choice here but the direction the system runs. Writing <code>md:</code> expecting it to mean "tablets only" produces styles that also apply on desktop, and that misunderstanding accounts for a large share of responsive bugs.</p>

<h3>Border radius, where this repo disagrees with the default</h3>
<div class="out">none=0px  sm=0.125rem  DEFAULT=0.25rem  md=0.375rem
lg=0.5rem  xl=0.75rem  2xl=1rem  3xl=1.5rem  full=9999px
</div>

<p>Note that plain <code>rounded</code> is 4px — quite subtle. This application's actual usage skews far larger: <code>rounded-xl</code> 1,579 uses, <code>rounded-lg</code> 1,500, <code>rounded-full</code> 1,208, <code>rounded-2xl</code> 815, while bare <code>rounded</code> barely registers. That is a house style visible in the numbers: this is a soft, heavily-rounded interface, and the default of 4px belongs to an earlier design era. Worth knowing because it means copying a snippet from the docs will produce corners noticeably sharper than the surrounding UI.</p>

<div class="pitfall">
<p><strong>Trap — using <code>h-screen</code> for a full-height app shell.</strong> It is the obvious choice and it is wrong twice: it breaks on mobile as described above, and it forces exactly the viewport height even when content is longer, so content is clipped rather than scrolled. For an app shell you usually want <code>min-h-screen</code> (at least full height, grows with content) or <code>h-dvh</code> for a genuinely fixed-height scrolling pane. The difference between <code>h-</code> and <code>min-h-</code> here is the difference between clipped content and correct content.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Sizing reuses the ×4 spacing scale for half its keys and adds 35 that are <em>not lengths</em> — fractions of the parent, units of the viewport, and content-driven values — and most sizing bugs come from confusing which reference frame a value resolves against, with <code>w-screen</code> inside a container and <code>h-screen</code> on mobile being the two classic cases.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CSS sizing: min-content, max-content, fit-content</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_sizing — the precise definitions of the content-driven trio. These are CSS keywords Tailwind renames; understanding them is not a Tailwind skill.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Viewport units: svh, lvh, dvh</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/length#viewport-percentage_lengths — why three sets of viewport units exist, written from the mobile-browser-chrome problem that created them.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Responsive design</span><span class="lc-sub">tailwindcss.com/docs/responsive-design — states the min-width direction explicitly, and has the worked example of why <code>md:</code> is not "tablets only".</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 2 — how a breakpoint prefix compiles</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — what <code>md:flex</code> actually emits, and why variant order in the output file matters for which one wins.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Định cỡ: cái thang cộng 35 thứ KHÔNG phải độ dài</h2>
<p class="lead">Chiều rộng và chiều cao DÙNG LẠI thang khoảng cách, nên <code>w-4</code> là 16px theo luật ở bài 1.1. Nhưng thang định cỡ LỚN GẤP ĐÔI thang khoảng cách, và nửa dôi ra mới là chỗ có hành vi thú vị — vì các mục ấy KHÔNG phải độ dài gì cả.</p>

<h3>Đếm hai nửa</h3>
<pre><code class="language-js">const wk = Object.keys(theme.width);
console.log('width keys:', wk.length, '| spacing keys:', Object.keys(theme.spacing).length);
console.log(wk.filter(k =&gt; !(k in theme.spacing)).join(' '));
</code></pre>

<div class="out">width keys: 70 | spacing keys: 35

auto 1/2 1/3 2/3 1/4 2/4 3/4 1/5 2/5 3/5 4/5 1/6 2/6 3/6 4/6 5/6
1/12 2/12 3/12 4/12 5/12 6/12 7/12 8/12 9/12 10/12 11/12
full screen svw lvw dvw min max fit
</div>

<p>Đúng một nửa số khoá là thang khoảng cách, và 35 khoá còn lại rơi vào ba nhóm hành xử HOÀN TOÀN khác một độ dài cố định.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">phân số</span><span class="lz-nsub"><code>1/2</code> … <code>11/12</code>, cộng <code>full</code></span></span>
<span class="lz-nbody">Phần trăm của thẻ <em>CHA</em>. <code>w-1/2</code> phát sinh <code>width: 50%</code>. Các phần mười hai tồn tại vì 12 chia hết cho 2, 3, 4 và 6 — cùng lý do các hệ lưới CSS đã dùng 12 cột suốt hai mươi năm.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">khung nhìn</span><span class="lz-nsub"><code>screen</code>, <code>svw</code>, <code>lvw</code>, <code>dvw</code></span></span>
<span class="lz-nbody">Tương đối với CỬA SỔ, không với thẻ cha. Ba cái ba-chữ là các đơn vị khung nhìn nhỏ/lớn/động mới hơn, tồn tại CHÍNH VÌ khung trình duyệt di động co và giãn khi bạn cuộn.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">theo nội dung</span><span class="lz-nsub"><code>min</code>, <code>max</code>, <code>fit</code>, <code>auto</code></span></span>
<span class="lz-nbody">Trình duyệt TÍNH kích thước từ nội dung. <code>w-fit</code> là "rộng đúng bằng cái nội dung tôi cần". Đây là nhóm người ta quên là nó tồn tại rồi tự cài lại một cách tệ bằng chiều rộng cố định.</span>
</div>
</div>

<h3>Sự phân biệt đẻ ra bọ THẬT</h3>
<p>Phần trăm phân giải theo kích thước của <em>THẺ CHA</em>; đơn vị khung nhìn phân giải theo <em>CỬA SỔ</em>. Lẫn lộn chúng đẻ ra những bố cục trông đúng trong một vật chứa và sai trong vật chứa khác:</p>

<pre><code class="language-jsx">{/* ben trong mot thanh ben 400px */}
&lt;div className="w-full"&gt;   {/* 400px — lap day thanh ben */}
&lt;div className="w-screen"&gt; {/* 1440px — vo tung ra khoi thanh ben */}
</code></pre>

<p><code>w-screen</code> bên trong một vật chứa bị ràng buộc là phiên bản kinh điển của con bọ này. Nó KHÔNG báo lỗi; thẻ chỉ đơn giản là TRÀN, và nếu thẻ cha có <code>overflow-hidden</code> thì phần dôi ra VÔ HÌNH, nên triệu chứng là "thẻ của tôi tự dưng bị cắt cụt" chứ không phải "thẻ của tôi quá rộng".</p>

<div class="callout warn">
<p><strong>Cái bẫy khung nhìn di động, và vì sao có tới ba đơn vị.</strong> Trên trình duyệt di động thanh địa chỉ ẨN ĐI khi bạn cuộn, nên chiều cao khung nhìn <em>ĐỔI TRONG LÚC CUỘN</em>. <code>h-screen</code> (<code>100vh</code>) phân giải theo khung nhìn <em>LỚN NHẤT</em> có thể, nên một thẻ cao-toàn-màn sẽ CAO HƠN vùng nhìn thấy khi thanh đang hiện — đáy bố cục của bạn nằm DƯỚI khung trình duyệt. <code>dvh</code> bám theo kích thước hiện tại, <code>svh</code> theo cái nhỏ nhất. Nếu một bố cục di động toàn màn có nội dung bị giấu sau thanh trình duyệt, đây là nguyên nhân, và <code>h-dvh</code> thường là cú vá.</p>
</div>

<h3>Bộ ba theo-nội-dung, thứ người ta dùng quá ít</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>w-fit</code></span><span class="lz-lnote"><code>width: fit-content</code>. Rộng bằng nội dung, nhưng KHÔNG BAO GIỜ rộng hơn thẻ cha. Câu trả lời đúng cho một cái nút hay huy hiệu cần ÔM lấy nhãn của nó — thay vì đoán một chiều rộng cố định rồi vỡ khi nhãn được dịch sang ngôn ngữ khác</span></div>
<div class="lz-layer"><span class="lz-lname"><code>w-min</code></span><span class="lz-lnote"><code>min-content</code>. Hẹp nhất có thể mà không tràn — xấp xỉ bằng từ đơn dài nhất. Hữu ích để ép một điểm xuống dòng</span></div>
<div class="lz-layer"><span class="lz-lname"><code>w-max</code></span><span class="lz-lnote"><code>max-content</code>. Rộng bằng cái nội dung muốn, LỜ ĐI thẻ cha — nên nó CÓ THỂ tràn. Hữu ích bên trong một vật chứa cuộn ngang, nguy hiểm ở mọi nơi khác</span></div>
<div class="lz-layer"><span class="lz-lname"><code>w-auto</code></span><span class="lz-lnote">mặc định của trình duyệt. Nghĩa KHÁC nhau tuỳ kiểu display: với thẻ block nó lấp đầy thẻ cha, với inline-block nó ôm nội dung. Chính sự phụ-thuộc-ngữ-cảnh này là lý do bộ ba tường minh bên trên thường rõ ràng hơn</span></div>
</div>

<h3><code>maxWidth</code> mang thêm một ý tưởng</h3>
<p>Thang <code>maxWidth</code> gồm mọi thứ bên trên cộng một thang kiểu chữ CÓ TÊN và một mục bất thường:</p>

<div class="out">... none xs sm md lg xl 2xl 3xl 4xl 5xl 6xl 7xl full min max fit prose
    screen-sm screen-md screen-lg screen-xl screen-2xl
</div>

<p><code>max-w-prose</code> là <code>65ch</code> — sáu mươi lăm bề rộng ký tự, chính là quy ước kiểu chữ cho độ dài dòng đọc thoải mái. Nó là tiện ích DUY NHẤT trong config mặc định mã hoá một LUẬT DỄ ĐỌC chứ không phải một phép đo, và nó là mặc định ĐÚNG cho bất kỳ cột chữ dài nào. Phần lớn bố cục bài viết tự chế đều phát minh lại nó dưới dạng một con số pixel ma thuật.</p>

<h3>Điểm ngắt là một cái thang RIÊNG, nhỏ hơn</h3>
<pre><code class="language-js">console.log(JSON.stringify(theme.screens));
</code></pre>

<div class="out">{"sm":"640px","md":"768px","lg":"1024px","xl":"1280px","2xl":"1536px"}
</div>

<p>Năm giá trị, và một tính chất đáng khắc vào đầu: điểm ngắt của Tailwind là <strong>min-width</strong>. <code>md:flex</code> nghĩa là "flex ở 768px <em>TRỞ LÊN</em>", KHÔNG phải "flex trên màn hình trung bình". Lớp nền là ca NHỎ và mỗi điểm ngắt đè lên theo chiều TĂNG — đó là lý do mobile-first ở đây không phải một lựa chọn phong cách mà là CHIỀU CHẠY của cả hệ. Viết <code>md:</code> mà trông đợi nó nghĩa "chỉ máy tính bảng" thì đẻ ra kiểu dáng áp CẢ trên desktop, và sự hiểu nhầm ấy chiếm một phần lớn số bọ responsive.</p>

<h3>Bo góc, chỗ kho này BẤT ĐỒNG với mặc định</h3>
<div class="out">none=0px  sm=0.125rem  DEFAULT=0.25rem  md=0.375rem
lg=0.5rem  xl=0.75rem  2xl=1rem  3xl=1.5rem  full=9999px
</div>

<p>Để ý <code>rounded</code> trần là 4px — khá kín đáo. Cách dùng THẬT của ứng dụng này lệch sang phía LỚN hơn nhiều: <code>rounded-xl</code> 1.579 lượt, <code>rounded-lg</code> 1.500, <code>rounded-full</code> 1.208, <code>rounded-2xl</code> 815, trong khi <code>rounded</code> trần gần như không xuất hiện. Đó là một phong cách nhà nhìn thấy được trong con số: đây là một giao diện MỀM, bo nhiều, và mặc định 4px thuộc về một thời thiết kế trước đó. Đáng biết vì nó có nghĩa chép một đoạn mã từ tài liệu sẽ cho ra góc SẮC hơn hẳn giao diện xung quanh.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng <code>h-screen</code> cho khung vỏ ứng dụng cao toàn màn.</strong> Nó là lựa chọn hiển nhiên và nó SAI hai lần: nó vỡ trên di động như mô tả bên trên, VÀ nó ép ĐÚNG BẰNG chiều cao khung nhìn kể cả khi nội dung dài hơn, nên nội dung bị CẮT chứ không được cuộn. Với khung vỏ ứng dụng bạn thường muốn <code>min-h-screen</code> (ít nhất cao toàn màn, giãn theo nội dung) hoặc <code>h-dvh</code> cho một khoang cuộn chiều-cao-cố-định thật sự. Khác biệt giữa <code>h-</code> và <code>min-h-</code> ở đây là khác biệt giữa nội dung bị cắt và nội dung đúng.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Định cỡ dùng lại thang khoảng cách ×4 cho một nửa số khoá và thêm 35 khoá <em>KHÔNG phải độ dài</em> — phân số của thẻ cha, đơn vị của khung nhìn, và giá trị theo nội dung — và phần lớn bọ định cỡ đến từ việc lẫn lộn một giá trị phân giải theo HỆ QUY CHIẾU nào, với <code>w-screen</code> bên trong vật chứa và <code>h-screen</code> trên di động là hai ca kinh điển.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CSS sizing: min-content, max-content, fit-content</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_sizing — định nghĩa chính xác của bộ ba theo-nội-dung. Đây là các từ khoá CSS mà Tailwind đổi tên; hiểu chúng không phải một kỹ năng Tailwind.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — đơn vị khung nhìn: svh, lvh, dvh</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/length#viewport-percentage_lengths — vì sao tồn tại BA bộ đơn vị khung nhìn, viết từ chính bài toán khung-trình-duyệt-di-động đã đẻ ra chúng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Responsive design</span><span class="lc-sub">tailwindcss.com/docs/responsive-design — nói TƯỜNG MINH về chiều min-width, và có ví dụ đã giải vì sao <code>md:</code> KHÔNG phải "chỉ máy tính bảng".</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 2 — một tiền tố điểm ngắt biên dịch ra sao</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — <code>md:flex</code> THẬT SỰ phát sinh ra gì, và vì sao thứ tự biến thể trong file đầu ra quyết định cái nào thắng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.6 ─────────────────────────── */
    {
      title: '1.6 — Chapter 1 quiz|||1.6 — Kiểm tra Chương 1',
      slug: 'tw-1-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu, mười hai phút. Về cái thang: luật nhân bốn, chỗ thang hết và 1.638 cú thoát đo được, bậc màu nào ĐẠT tương phản, và 35 khoá định cỡ không phải độ dài.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>What Chapter 1 measured</h2>
<p class="lead">Eight questions, twelve minutes. Every answer is derivable from a scale you can read out of <code>resolveConfig</code> — none of it is memorisation, and if a question feels like recall you are approaching it the wrong way.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1.1 — × 4px</span><span class="lz-lnote">one multiplication covers 33 of 35 spacing keys; <code>0</code> and <code>px</code> are the deliberate literals. The emitted value is <code>rem</code>, which is why the scale respects user font-size settings</span></div>
<div class="lz-layer"><span class="lz-lname">1.2 — where it runs out</span><span class="lz-lnote">no size below 12px and nothing between 12 and 14, so this app escaped 1,638 times. Count the uses: 1-3 leave arbitrary, 10+ name it in config</span></div>
<div class="lz-layer"><span class="lz-lname">1.3 — contrast</span><span class="lz-lnote"><code>slate-400</code> on white = 2.56, FAILS AA. <code>slate-500</code> = 4.76, passes narrowly. But luminance depends on hue, so never generalise a step across families</span></div>
<div class="lz-layer"><span class="lz-lname">1.4 — layout</span><span class="lz-lnote">flex beats grid 9.7:1; 69% of flex elements carry <code>items-center</code>; <code>shrink-0</code>'s 987 uses record that width is a starting size, not a floor</span></div>
<div class="lz-layer"><span class="lz-lname">1.5 — sizing</span><span class="lz-lnote">70 width keys: 35 lengths + 35 that are not. Percentages resolve against the parent, viewport units against the window, and breakpoints are min-width</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Chương 1 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Mọi đáp án đều SUY RA được từ một cái thang bạn đọc ra từ <code>resolveConfig</code> — không có gì phải học thuộc, và nếu một câu có cảm giác phải NHỚ thì bạn đang tiếp cận nó sai cách.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1.1 — × 4px</span><span class="lz-lnote">một phép nhân bao 33 trên 35 khoá khoảng cách; <code>0</code> và <code>px</code> là hai chữ nguyên cố ý. Giá trị phát sinh là <code>rem</code>, đó là lý do cái thang TÔN TRỌNG thiết lập cỡ chữ của người dùng</span></div>
<div class="lz-layer"><span class="lz-lname">1.2 — chỗ nó hết</span><span class="lz-lnote">không có cỡ nào dưới 12px và không có gì giữa 12 và 14, nên ứng dụng này thoát ra 1.638 lần. Hãy ĐẾM: 1-3 để tuỳ ý, 10+ đặt tên trong config</span></div>
<div class="lz-layer"><span class="lz-lname">1.3 — tương phản</span><span class="lz-lnote"><code>slate-400</code> trên trắng = 2,56, TRƯỢT AA. <code>slate-500</code> = 4,76, đạt sát nút. Nhưng độ chói phụ thuộc SẮC, nên đừng bao giờ tổng quát một bậc qua các họ</span></div>
<div class="lz-layer"><span class="lz-lname">1.4 — bố cục</span><span class="lz-lnote">flex thắng grid 9,7:1; 69% thẻ flex mang <code>items-center</code>; 987 lượt <code>shrink-0</code> ghi lại rằng chiều rộng là kích thước KHỞI ĐIỂM, không phải cái sàn</span></div>
<div class="lz-layer"><span class="lz-lname">1.5 — định cỡ</span><span class="lz-lnote">70 khoá width: 35 độ dài + 35 KHÔNG phải. Phần trăm phân giải theo thẻ cha, đơn vị khung nhìn theo cửa sổ, và điểm ngắt là min-width</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A mockup specifies 24px of padding. Which class, and how do you know without a lookup?|||Một bản mẫu ghi padding 24px. Lớp nào, và làm sao bạn biết mà không cần tra?',
            options: [
              '<code>p-6</code> — every spacing key is the number × 4px, so 24 ÷ 4 = 6|||<code>p-6</code> — mọi khoá khoảng cách là con số × 4px, nên 24 ÷ 4 = 6',
              '<code>p-24</code> — the class number is the pixel value|||<code>p-24</code> — con số trong lớp chính là giá trị pixel',
              '<code>p-12</code> — the scale is half the pixel value|||<code>p-12</code> — thang bằng một nửa giá trị pixel',
              '<code>p-[24px]</code> — 24 is not on the scale so it needs an arbitrary value|||<code>p-[24px]</code> — 24 không có trên thang nên phải dùng giá trị tuỳ ý',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Tailwind emits <code>.p-4 { padding: 1rem }</code> rather than <code>16px</code>. What does that buy?|||Tailwind phát sinh <code>.p-4 { padding: 1rem }</code> chứ không phải <code>16px</code>. Điều đó mua được gì?',
            options: [
              'A user who raises their browser root font size scales the whole layout proportionally, not just the text — so hardcoding <code>p-[16px]</code> is NOT equivalent|||Người dùng NÂNG cỡ chữ gốc của trình duyệt sẽ phóng to toàn bộ bố cục theo tỉ lệ, không chỉ phần chữ — nên đóng cứng <code>p-[16px]</code> KHÔNG tương đương',
              'Smaller CSS output, since rem values compress better|||Đầu ra CSS nhỏ hơn, vì giá trị rem nén tốt hơn',
              'Better browser support on older engines|||Hỗ trợ trình duyệt tốt hơn trên các engine cũ',
              'Nothing functional; it is a stylistic convention|||Không gì về chức năng; đó là một quy ước phong cách',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This app uses <code>text-[11px]</code> 803 times. What does the counting rule say to do?|||Ứng dụng này dùng <code>text-[11px]</code> 803 lần. Luật ĐẾM bảo phải làm gì?',
            options: [
              'Extend the scale — at 10+ uses it IS part of the design system without a name, and leaving it arbitrary means a future change is 803 find-and-replaces instead of one config line|||Mở rộng thang — ở mức 10+ lượt thì nó ĐÃ LÀ một phần hệ thiết kế mà chưa có tên, và để nó tuỳ ý nghĩa là một thay đổi tương lai tốn 803 lần tìm-và-thay thay vì một dòng config',
              'Round all 803 to <code>text-xs</code> to keep the scale pure|||Làm tròn cả 803 về <code>text-xs</code> để giữ thang thuần khiết',
              'Leave it — arbitrary values are the intended escape hatch at any count|||Để nguyên — giá trị tuỳ ý là cửa thoát được thiết kế sẵn ở mọi số lượng',
              'Replace them with inline styles so they are not scanned|||Thay chúng bằng inline style để chúng không bị quét',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does <code>text-slate-400</code> on a white background fail WCAG AA for body text?|||Vì sao <code>text-slate-400</code> trên nền trắng TRƯỢT WCAG AA cho chữ thân bài?',
            options: [
              'Its contrast ratio is 2.56 against the 4.5 requirement — roughly half. <code>slate-500</code> at 4.76 is the first step that passes|||Tỉ lệ tương phản của nó là 2,56 so với yêu cầu 4,5 — khoảng một nửa. <code>slate-500</code> ở mức 4,76 là bậc đầu tiên ĐẠT',
              'It fails only on low-quality displays|||Nó chỉ trượt trên màn hình chất lượng thấp',
              'Slate is a cool grey; warm greys pass at step 400|||Slate là xám lạnh; xám ấm đạt ở bậc 400',
              'It passes AA but fails AAA|||Nó đạt AA nhưng trượt AAA',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: '<code>text-blue-500</code> on white is readable but <code>text-yellow-500</code> on white is not. Both are step 500. Why?|||<code>text-blue-500</code> trên trắng đọc được nhưng <code>text-yellow-500</code> trên trắng thì không. Cả hai đều là bậc 500. Vì sao?',
            options: [
              'Relative luminance weights the green channel at 0.7152 versus blue at 0.0722, so yellow (high red+green) is far brighter than blue at the same step — never generalise a step number across hues|||Độ chói tương đối gán trọng số 0,7152 cho kênh lục đối lập 0,0722 cho lam, nên vàng (đỏ+lục cao) SÁNG hơn lam rất nhiều ở cùng bậc — đừng bao giờ tổng quát một con số bậc qua các sắc',
              'Yellow is not a real Tailwind color family|||Vàng không phải một họ màu Tailwind thật',
              'The yellow scale is offset by one step from the others|||Thang vàng lệch một bậc so với các thang khác',
              'Blue has higher saturation, which increases contrast|||Lam có độ bão hoà cao hơn, làm tăng tương phản',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'An icon with <code>h-4 w-4</code> inside a flex row squashes into an oval at narrow widths. Why does the set width not prevent it?|||Một biểu tượng có <code>h-4 w-4</code> bên trong một hàng flex bị bẹp thành hình bầu dục ở bề ngang hẹp. Vì sao chiều rộng đã đặt không ngăn được?',
            options: [
              'flex-shrink defaults to 1, so width is a STARTING size the browser may compress below — <code>shrink-0</code> (987 uses here) is what makes it a floor|||flex-shrink mặc định bằng 1, nên chiều rộng là kích thước KHỞI ĐIỂM mà trình duyệt được phép nén xuống dưới — <code>shrink-0</code> (987 lượt ở đây) mới là thứ biến nó thành cái sàn',
              'The icon SVG has no intrinsic aspect ratio|||SVG của biểu tượng không có tỉ lệ khung hình nội tại',
              '<code>h-4 w-4</code> sets max dimensions, not fixed ones|||<code>h-4 w-4</code> đặt kích thước TỐI ĐA, không phải cố định',
              '<code>items-center</code> is missing from the parent|||Thẻ cha thiếu <code>items-center</code>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A <code>w-screen</code> element inside a 400px sidebar appears cut off rather than too wide. Why?|||Một thẻ <code>w-screen</code> bên trong thanh bên 400px trông như bị CẮT CỤT chứ không phải quá rộng. Vì sao?',
            options: [
              '<code>w-screen</code> resolves against the WINDOW (e.g. 1440px), not the parent, so it overflows — and an <code>overflow-hidden</code> ancestor clips the excess, hiding the real symptom|||<code>w-screen</code> phân giải theo CỬA SỔ (ví dụ 1440px), không theo thẻ cha, nên nó TRÀN — và một tổ tiên có <code>overflow-hidden</code> cắt phần dôi ra, giấu đi triệu chứng thật',
              '<code>w-screen</code> is capped at the parent width by default|||<code>w-screen</code> mặc định bị chặn ở chiều rộng thẻ cha',
              'The sidebar needs <code>flex-wrap</code> to accommodate it|||Thanh bên cần <code>flex-wrap</code> để chứa nó',
              '<code>w-screen</code> is deprecated in favour of <code>w-dvw</code>|||<code>w-screen</code> đã bị bỏ, thay bằng <code>w-dvw</code>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A developer writes <code>md:hidden</code> expecting to hide an element on tablets only. What actually happens?|||Một lập trình viên viết <code>md:hidden</code> trông đợi ẩn một thẻ CHỈ trên máy tính bảng. Chuyện gì THẬT SỰ xảy ra?',
            options: [
              'It hides at 768px AND EVERYTHING ABOVE, including desktop — Tailwind breakpoints are min-width, so each one overrides upward from the base class|||Nó ẩn ở 768px VÀ MỌI THỨ TRÊN ĐÓ, gồm cả desktop — điểm ngắt Tailwind là min-width, nên mỗi cái đè lên theo chiều TĂNG từ lớp nền',
              'It hides only between 768px and 1024px|||Nó chỉ ẩn trong khoảng 768px tới 1024px',
              'It hides at 768px and below|||Nó ẩn ở 768px trở xuống',
              'It has no effect without a matching <code>lg:</code> class|||Nó không có tác dụng nếu không có lớp <code>lg:</code> đi kèm',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
