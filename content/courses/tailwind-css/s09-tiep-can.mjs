const REF = '?ref=%2Fcourses%2Ftailwind-css%2Flearn&reflabel=Tailwind%20CSS';
/**
 * Tailwind CSS — Chương 9: Khả năng tiếp cận, ĐO THẬT.
 * Ba khiếm khuyết SỐNG tìm được: --text-muted trượt AA ở 3/4 chỗ (2.537 lượt
 * dùng), token bg-bg-elevated KHÔNG tồn tại (76 lượt / 14 file), và 72 chỗ
 * outline-none không có vòng focus thay thế (58 trong đó là ô nhập liệu).
 * Hai vùng SẠCH: lưới chắn nền tối và lưới chắn chuyển động.
 */

export default {
  title: 'Chapter 9 — Accessibility, measured|||Chương 9 — Khả năng tiếp cận, ĐO THẬT',
  slug: 'tw-ch9-tiep-can',
  description: 'Sáu bài soát khả năng tiếp cận của CHÍNH kho này bằng số, không bằng cảm giác: tương phản của bảng màu thật, những lớp KHÔNG hề tồn tại, vòng focus bị gỡ, và chuyển động. Ba khiếm khuyết sống, hai vùng sạch — và một phép đo của tôi đã báo động giả.',
  sortOrder: 10,
  lessons: [

    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — Auditing the real palette for contrast|||9.1 — Soát tương phản trên bảng màu THẬT',
      slug: 'tw-9-1-tuong-phan',
      type: 'VIDEO',
      description: 'Mười hai tổ hợp chữ-trên-nền từ chính biến CSS của kho này. Chín cái đạt AA, ba cái trượt — và cả ba đều là `--text-muted`, token DUY NHẤT giữ NGUYÊN một mã hex ở cả hai theme. 2.537 lượt dùng, 694 trong số đó ở cỡ 12px.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Auditing the real palette for contrast</h2>
<p class="lead">Chapter 1 measured that <code>slate-400</code> on white gives 2.56 and fails AA, using Tailwind&#39;s default scale. This repository does not use that scale for text — it uses CSS variables, as Chapter 6 established. So the honest question is what <em>this</em> palette scores, and the answer is not the one the config comments imply.</p>

<h3>The tokens, read straight out of globals.css</h3>
<pre><code class="language-python">import re
css = open('src/app/globals.css').read()
def block(sel):
    i = css.find(sel); j = css.find('{', i); k = css.find('}', j)
    return dict(re.findall(r'(--[\\w-]+)\\s*:\\s*([^;]+);', css[j:k]))
light = block(':root {')
dark  = block('html.theme-dark')
</code></pre>

<div class="out">                   light theme   dark theme
--text-primary     #050505       #e4e6eb
--text-secondary   #65676b       #b0b3b8
--text-muted       #8a8d91       #8a8d91     &lt;- SAME hex, both themes
--bg-card          #ffffff       #242526
--bg-surface       #f0f2f5       #303031
</div>

<p>One line stands out before any arithmetic. Every other text token flips between a near-black and a near-white; <code>--text-muted</code> is <strong>the same grey in both themes</strong>. That is not automatically wrong — a mid-grey is the one value that can plausibly serve both — but it is the token to check first, because it is the only one that cannot have been tuned for both backgrounds.</p>

<h3>Twelve combinations, one formula</h3>
<p>The WCAG contrast ratio is defined on relative luminance, and it is short enough to implement rather than trust a website with:</p>

<pre><code class="language-python">def lum(h):
    r, g, b = (int(h[i:i+2], 16) / 255 for i in (1, 3, 5))
    f = lambda c: c/12.92 if c &lt;= 0.03928 else ((c + 0.055)/1.055) ** 2.4
    return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b)

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)
</code></pre>

<div class="out">theme  text        background        ratio  AA-normal  AA-large
light  primary     card    #ffffff   20,38  PASS       PASS
light  primary     surface #f0f2f5   18,17  PASS       PASS
light  secondary   card    #ffffff    5,67  PASS       PASS
light  secondary   surface #f0f2f5    5,05  PASS       PASS
light  muted       card    #ffffff    3,33  FAIL       PASS
light  muted       surface #f0f2f5    2,97  FAIL       FAIL
dark   primary     card    #242526   12,30  PASS       PASS
dark   primary     surface #303031   10,56  PASS       PASS
dark   secondary   card    #242526    7,30  PASS       PASS
dark   secondary   surface #303031    6,27  PASS       PASS
dark   muted       card    #242526    4,61  PASS       PASS
dark   muted       surface #303031    3,95  FAIL       PASS

12 combinations tested, 3 fail AA for normal text
</div>

<div class="callout warn">
<p><strong>All three failures are the same token.</strong> <code>--text-muted</code> fails on the light card (3,33), fails on the light surface (2,97), and fails on the dark surface (3,95). It passes in exactly one of its four placements. And the worst case, 2,97 on the light surface, is below even the 3,0 threshold that large text is allowed — so there is no font size at which that pairing conforms.</p>
</div>

<h3>Confirming it in a browser, not just in Python</h3>
<p>Arithmetic on hex strings assumes the hex strings are what actually renders. Chapter 6 found 91 classes in this repo that resolve to nothing, so that assumption deserves one check. Real Chromium, real generated CSS:</p>

<pre><code class="language-js">const rows = await page.evaluate(() =&gt; ['p1','p2','p3','p4'].map(id =&gt; {
  const e = document.getElementById(id), s = getComputedStyle(e);
  return { color: s.color, size: s.fontSize,
           bg: getComputedStyle(e.parentElement).backgroundColor };
}));
</code></pre>

<div class="out">--- theme: light ---
muted xs        rgb(138, 141, 145)  on rgb(240, 242, 245)  12px  ratio=2,97  FAIL
secondary sm    rgb(101, 103, 107)  on rgb(240, 242, 245)  14px  ratio=5,05  PASS
primary sm      rgb(5, 5, 5)        on rgb(240, 242, 245)  14px  ratio=18,17 PASS
--- theme: dark ---
muted xs        rgb(138, 141, 145)  on rgb(48, 48, 49)     12px  ratio=3,95  FAIL
secondary sm    rgb(176, 179, 184)  on rgb(48, 48, 49)     14px  ratio=6,27  PASS
primary sm      rgb(228, 230, 235)  on rgb(48, 48, 49)     14px  ratio=10,56 PASS
</div>

<p>The rendered numbers match the computed ones exactly. The palette is real and the failure is real.</p>

<h3>How much of the app is affected</h3>
<p>A failing token matters in proportion to how much it is used, so the next measurement is exposure:</p>

<div class="out">text-text-muted, occurrences inside a className : 2.537
  in a className that also names a small size    : 1.169  (46%)
  the sizes it co-occurs with:
      text-xs   (12px)  694
      text-sm   (14px)  476
      text-base (16px)    8
      text-lg              5
      text-xl              2
</div>

<div class="callout warn">
<p><strong>The large-text exemption does not apply here.</strong> WCAG relaxes the threshold from 4,5 to 3,0 for text at 24px, or 18,66px when bold. The two sizes this token is actually paired with are <strong>12px and 14px</strong> — 1.170 of the 1.169+ measured co-occurrences. Every one of those is normal text by the standard&#39;s own definition, so 4,5 is the number that applies.</p>
</div>

<h3>What value would pass</h3>
<p>Rather than guess a replacement, search the neutral greys for the closest one that clears 4,5 against each real background:</p>

<pre><code class="language-python">for v in range(256):
    h = '#%02x%02x%02x' % (v, v, v)
    if ratio(h, bg) &gt;= 4.5: best = h    # darkest that still passes, on light bg
</code></pre>

<div class="out">darkest neutral grey reaching 4,5 on #f0f2f5 (light surface) -> #6e6e6e  (4,55)
darkest neutral grey reaching 4,5 on #ffffff (light card)    -> #767676  (4,54)
lightest neutral grey reaching 4,5 on #303031 (dark surface) -> #979797  (4,51)

current #8a8d91:  on #f0f2f5 = 2,97      on #303031 = 3,95
</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">light theme: <code>#8a8d91</code> → <code>#6e6e6e</code></span><span class="lz-d">Chosen against the <em>surface</em>, not the card, because surface is the harder background — the same value then scores 5,4 on white. One value covers both placements.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">dark theme: <code>#8a8d91</code> → <code>#979797</code></span><span class="lz-d">The token stops being theme-independent, which is the actual defect. Its lightness has to move in opposite directions for the two backgrounds; one hex cannot do both.</span></div>
<div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">2.537 call sites, zero touched</span><span class="lz-d">This is Chapter 6&#39;s mechanism collecting its dividend: because every one of those uses reads <code>var(--text-muted)</code>, two lines in <code>globals.css</code> fix all of them, and no <code>.tsx</code> file changes.</span></div>
</div>

<div class="pitfall">
<p><strong>Pitfall — assuming a &quot;muted&quot; token is exempt because it is meant to look faint.</strong> That is the reasoning that produces this defect, and the standard does not recognise it. WCAG exempts <em>decorative</em> text and disabled controls; it does not exempt secondary information. Timestamps, counts, helper text under inputs and empty-state messages all carry meaning, and all of them in this repo are drawn in the one token that fails.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Of twelve real text-on-background combinations in this palette, nine pass AA and the three that fail are all <code>--text-muted</code> — the only text token holding the same hex in both themes — which is used 2.537 times, 1.169 of them at 12px or 14px, and is fixed by changing two lines rather than 2.537 call sites.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG 2.2 — Contrast (Minimum), 1.4.3</span><span class="lc-sub">w3.org/WAI/WCAG22/Understanding/contrast-minimum — the 4,5 and 3,0 thresholds, the definition of &quot;large&quot; text, and exactly which text is exempt.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG — relative luminance</span><span class="lc-sub">w3.org/WAI/GL/wiki/Relative_luminance — the formula implemented above, including why the 0,03928 branch exists.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — color contrast</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast — the practical version, with the failure modes.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — variables as the theme mechanism</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — why the two-line fix reaches 2.537 call sites, and what it costs when only half of it ships.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Soát tương phản trên bảng màu THẬT</h2>
<p class="lead">Chương 1 đã đo <code>slate-400</code> trên nền trắng cho 2,56 và trượt AA, dùng thang mặc định của Tailwind. Kho này KHÔNG dùng thang đó cho chữ — nó dùng biến CSS, như Chương 6 đã dựng. Nên câu hỏi trung thực là bảng màu NÀY chấm được bao nhiêu, và câu trả lời không phải cái mà chú thích trong config gợi ý.</p>

<h3>Các token, đọc thẳng từ globals.css</h3>
<pre><code class="language-python">import re
css = open('src/app/globals.css').read()
def block(sel):
    i = css.find(sel); j = css.find('{', i); k = css.find('}', j)
    return dict(re.findall(r'(--[\\w-]+)\\s*:\\s*([^;]+);', css[j:k]))
light = block(':root {')
dark  = block('html.theme-dark')
</code></pre>

<div class="out">                   theme SANG     theme TOI
--text-primary     #050505       #e4e6eb
--text-secondary   #65676b       #b0b3b8
--text-muted       #8a8d91       #8a8d91     &lt;- CUNG mot ma hex, ca hai theme
--bg-card          #ffffff       #242526
--bg-surface       #f0f2f5       #303031
</div>

<p>Một dòng nổi bật lên trước cả khi tính toán gì. Mọi token chữ khác đều lật giữa một màu gần-đen và một màu gần-trắng; <code>--text-muted</code> là <strong>CÙNG một màu xám ở cả hai theme</strong>. Việc đó không tự động sai — một màu xám giữa là giá trị DUY NHẤT có thể phục vụ cả hai một cách hợp lý — nhưng nó là token phải kiểm TRƯỚC, vì nó là cái duy nhất KHÔNG THỂ đã được tinh chỉnh cho cả hai nền.</p>

<h3>Mười hai tổ hợp, một công thức</h3>
<p>Tỉ số tương phản của WCAG định nghĩa trên độ chói tương đối, và nó đủ ngắn để TỰ VIẾT thay vì tin vào một trang web nào đó:</p>

<pre><code class="language-python">def lum(h):
    r, g, b = (int(h[i:i+2], 16) / 255 for i in (1, 3, 5))
    f = lambda c: c/12.92 if c &lt;= 0.03928 else ((c + 0.055)/1.055) ** 2.4
    return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b)

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)
</code></pre>

<div class="out">theme  chu         nen               ti so  AA-thuong  AA-lon
sang   primary     card    #ffffff   20,38  DAT        DAT
sang   primary     surface #f0f2f5   18,17  DAT        DAT
sang   secondary   card    #ffffff    5,67  DAT        DAT
sang   secondary   surface #f0f2f5    5,05  DAT        DAT
sang   muted       card    #ffffff    3,33  TRUOT      DAT
sang   muted       surface #f0f2f5    2,97  TRUOT      TRUOT
toi    primary     card    #242526   12,30  DAT        DAT
toi    primary     surface #303031   10,56  DAT        DAT
toi    secondary   card    #242526    7,30  DAT        DAT
toi    secondary   surface #303031    6,27  DAT        DAT
toi    muted       card    #242526    4,61  DAT        DAT
toi    muted       surface #303031    3,95  TRUOT      DAT

12 to hop da kiem, 3 truot AA cho chu thuong
</div>

<div class="callout warn">
<p><strong>Cả ba chỗ trượt đều là MỘT token.</strong> <code>--text-muted</code> trượt trên card sáng (3,33), trượt trên surface sáng (2,97), và trượt trên surface tối (3,95). Nó chỉ ĐẠT ở đúng MỘT trong bốn chỗ đặt. Và trường hợp tệ nhất, 2,97 trên surface sáng, nằm DƯỚI cả ngưỡng 3,0 vốn dành riêng cho chữ lớn — nên KHÔNG có cỡ chữ nào làm cặp đó hợp chuẩn được.</p>
</div>

<h3>Xác nhận trong TRÌNH DUYỆT, không chỉ trong Python</h3>
<p>Tính toán trên chuỗi hex GIẢ ĐỊNH rằng chuỗi hex ấy chính là thứ được vẽ ra. Chương 6 tìm được 91 lớp trong kho này phân giải thành KHÔNG GÌ, nên giả định ấy đáng được kiểm một lần. Chromium thật, CSS phát sinh thật:</p>

<pre><code class="language-js">const rows = await page.evaluate(() =&gt; ['p1','p2','p3','p4'].map(id =&gt; {
  const e = document.getElementById(id), s = getComputedStyle(e);
  return { color: s.color, size: s.fontSize,
           bg: getComputedStyle(e.parentElement).backgroundColor };
}));
</code></pre>

<div class="out">--- theme: sang ---
muted xs        rgb(138, 141, 145)  tren rgb(240, 242, 245)  12px  ti so=2,97  TRUOT
secondary sm    rgb(101, 103, 107)  tren rgb(240, 242, 245)  14px  ti so=5,05  DAT
primary sm      rgb(5, 5, 5)        tren rgb(240, 242, 245)  14px  ti so=18,17 DAT
--- theme: toi ---
muted xs        rgb(138, 141, 145)  tren rgb(48, 48, 49)     12px  ti so=3,95  TRUOT
secondary sm    rgb(176, 179, 184)  tren rgb(48, 48, 49)     14px  ti so=6,27  DAT
primary sm      rgb(228, 230, 235)  tren rgb(48, 48, 49)     14px  ti so=10,56 DAT
</div>

<p>Các con số vẽ ra khớp CHÍNH XÁC với các con số tính ra. Bảng màu là thật và chỗ trượt là thật.</p>

<h3>Bao nhiêu phần của ứng dụng bị ảnh hưởng</h3>
<p>Một token trượt chỉ quan trọng TỈ LỆ với mức nó được dùng, nên phép đo tiếp theo là ĐỘ PHƠI NHIỄM:</p>

<div class="out">text-text-muted, so lan xuat hien trong mot className : 2.537
  trong className co kem mot lop CO CHU nho            : 1.169  (46%)
  cac co no di kem:
      text-xs   (12px)  694
      text-sm   (14px)  476
      text-base (16px)    8
      text-lg              5
      text-xl              2
</div>

<div class="callout warn">
<p><strong>Miễn trừ cho &quot;chữ lớn&quot; KHÔNG áp dụng ở đây.</strong> WCAG nới ngưỡng từ 4,5 xuống 3,0 cho chữ 24px, hoặc 18,66px nếu in đậm. Hai cỡ mà token này THẬT SỰ đi kèm là <strong>12px và 14px</strong>. Mọi lượt trong số đó là chữ THƯỜNG theo đúng định nghĩa của chuẩn, nên 4,5 mới là con số áp dụng.</p>
</div>

<h3>Giá trị nào thì ĐẠT</h3>
<p>Thay vì ĐOÁN một giá trị thay thế, hãy quét dải xám trung tính tìm cái GẦN NHẤT còn vượt 4,5 trên từng nền thật:</p>

<pre><code class="language-python">for v in range(256):
    h = '#%02x%02x%02x' % (v, v, v)
    if ratio(h, bg) &gt;= 4.5: best = h    # dam nhat ma van dat, tren nen sang
</code></pre>

<div class="out">xam trung tinh DAM nhat dat 4,5 tren #f0f2f5 (surface sang) -> #6e6e6e  (4,55)
xam trung tinh DAM nhat dat 4,5 tren #ffffff (card sang)    -> #767676  (4,54)
xam trung tinh SANG nhat dat 4,5 tren #303031 (surface toi) -> #979797  (4,51)

hien tai #8a8d91:  tren #f0f2f5 = 2,97      tren #303031 = 3,95
</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">theme sáng: <code>#8a8d91</code> → <code>#6e6e6e</code></span><span class="lz-d">Chọn theo nền <em>surface</em> chứ không theo card, vì surface là nền KHÓ hơn — cùng giá trị ấy khi đặt trên nền trắng cho 5,4. Một giá trị phủ cả hai chỗ.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">theme tối: <code>#8a8d91</code> → <code>#979797</code></span><span class="lz-d">Token thôi độc-lập-với-theme, mà đó CHÍNH LÀ khiếm khuyết. Độ sáng của nó phải đi theo hai hướng NGƯỢC nhau cho hai nền; một mã hex không làm được cả hai.</span></div>
<div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">2.537 chỗ gọi, KHÔNG đụng cái nào</span><span class="lz-d">Đây là cơ chế của Chương 6 đang thu lãi: vì mọi lượt dùng đều đọc <code>var(--text-muted)</code>, hai dòng trong <code>globals.css</code> vá hết, và KHÔNG file <code>.tsx</code> nào phải đổi.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cho rằng token &quot;muted&quot; được miễn trừ vì nó vốn ĐỂ trông mờ.</strong> Đó chính là lối nghĩ sinh ra khiếm khuyết này, và chuẩn KHÔNG công nhận nó. WCAG miễn trừ chữ TRANG TRÍ và điều khiển bị vô hiệu hoá; nó KHÔNG miễn trừ thông tin phụ. Dấu thời gian, con số đếm, chữ hướng dẫn dưới ô nhập và thông báo trạng-thái-rỗng đều MANG NGHĨA, và trong kho này tất cả đều được vẽ bằng đúng cái token trượt chuẩn.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Trong mười hai tổ hợp chữ-trên-nền thật của bảng màu này, chín cái đạt AA và ba cái trượt đều là <code>--text-muted</code> — token chữ DUY NHẤT giữ nguyên một mã hex ở cả hai theme — vốn được dùng 2.537 lần, trong đó 1.169 lần ở cỡ 12px hoặc 14px, và được vá bằng cách đổi HAI DÒNG chứ không phải 2.537 chỗ gọi.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG 2.2 — Contrast (Minimum), 1.4.3</span><span class="lc-sub">w3.org/WAI/WCAG22/Understanding/contrast-minimum — ngưỡng 4,5 và 3,0, định nghĩa chữ &quot;lớn&quot;, và chính xác chữ nào được miễn trừ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG — độ chói tương đối</span><span class="lc-sub">w3.org/WAI/GL/wiki/Relative_luminance — công thức đã cài ở trên, kể cả lý do tồn tại nhánh 0,03928.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — color contrast</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast — bản thực dụng, kèm các kiểu hỏng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — biến CSS làm cơ chế theme</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — vì sao bản vá hai dòng với tới 2.537 chỗ gọi, và cái giá khi chỉ NỬA của nó lên production.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — The 1.16 incident, and the guard that held|||9.2 — Sự cố 1,16, và lưới chắn ĐÃ GIỮ ĐƯỢC',
      slug: 'tw-9-2-nen-toi',
      type: 'VIDEO',
      description: 'Ngày 08/08/2026 kho này có chữ tỉ số 1,16 trên production — chữ gần-đen trên nền gần-đen, 142 file / 622 lượt. Bản vá là một quy tắc CSS TỰ THI HÀNH. Bài này đo lại lưới chắn ấy hôm nay: 51 mã hex, KHÔNG chỗ hở.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>The 1.16 incident, and the guard that held</h2>
<p class="lead">Lesson 9.1&#39;s failure is a tuning mistake — a grey chosen slightly too light. This lesson is about the other kind, where every individual decision was defensible and the combination produced invisible text. It is recorded in this repo&#39;s own <code>globals.css</code>, with the measurement attached.</p>

<h3>What happened</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">decision one</span><span class="lz-nsub">a fixed dark surface</span></span>
<span class="lz-nbody">Large parts of the site paint a dark background <em>regardless of theme</em>, with <code>bg-darkbg</code> / <code>bg-darkcard</code> / <code>bg-darksurface</code> — hardcoded <code>#18191a</code> / <code>#242526</code> / <code>#303031</code> from the Tailwind config. Perfectly reasonable: some regions are meant to look like a console.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">decision two</span><span class="lz-nsub">theme-aware text</span></span>
<span class="lz-nbody">The text inside them uses <code>text-text-primary</code>, which Chapter 6 established maps to <code>var(--text-primary)</code> — a value that <em>changes with the theme</em>. Also perfectly reasonable, and in fact the rule the rest of the codebase is supposed to follow.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">the combination</span><span class="lz-nsub">1,16 in the light theme</span></span>
<span class="lz-nbody">Under the light theme <code>--text-primary</code> resolves to <code>#050505</code>. Near-black text on a <code>#18191a</code> surface. Measured on <code>/repos</code> before the fix: <strong>rgb(5,5,5) on rgb(24,25,26), ratio 1,16</strong>, against an AA minimum of 4,5.</span>
</div>
</div>

<div class="callout warn">
<p><strong>Neither half is wrong on its own.</strong> A fixed dark region is a legitimate design. Theme-aware text is the correct default. The defect lives in the <em>interaction</em>, which means no reviewer looking at either file in isolation would catch it — and no linter that checks classes one at a time can either. This is the failure mode utility CSS makes easy: the background comes from one component and the colour from a token defined three files away.</p>
</div>

<h3>How it was noticed, and how much of it there was</h3>
<div class="out">/repos, light theme, before the fix
  heading "Kho repo duoc binh chon"   rgb(5,5,5) on rgb(24,25,26)  ratio 1,16
  login form: "Welcome Back", the Username / Password labels — same

blast radius:  142 files / 622 usages
</div>

<p>It surfaced through the login form, which is the one screen every user meets. That is luck, not process: 142 files were affected and the ones behind a login could have stayed broken indefinitely.</p>

<h3>The fix, and why it is not &quot;edit 142 files&quot;</h3>
<p>The obvious repair is to change the text classes in every affected component. The repo did something else — it re-declared the theme variables <em>on the dark surfaces themselves</em>:</p>

<pre><code class="language-css">.dark-surface,
.bg-darkbg,
.bg-darkcard,
.bg-darksurface {
  /* values copied verbatim from html.theme-dark above */
  --text-primary:   #e4e6eb;
  --text-secondary: #b0b3b8;
  ...
}
</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">it is self-enforcing</span><span class="lz-lnote">any FUTURE <code>bg-darkbg</code> gets a readable palette automatically. There is no rule for the next person to remember and no 143rd file to miss — the invariant is enforced by the same class that creates the hazard</span></div>
<div class="lz-layer"><span class="lz-lname">blast radius on working code is zero</span><span class="lz-lnote">under the dark theme <code>html.theme-dark</code> already sets these exact values, so re-declaring them changes nothing. The ONLY behavioural difference is in the light theme, where those regions were unreadable</span></div>
<div class="lz-layer"><span class="lz-lname">it uses inheritance, which is free</span><span class="lz-lnote">custom properties inherit. Setting them on the container reaches every descendant at any depth without a single descendant selector — the one place CSS variables beat utilities outright</span></div>
<div class="lz-layer"><span class="lz-lname"><code>dark-surface</code> is the opt-in</span><span class="lz-lnote">for a dark region whose background comes from something other than those four tokens, adding one class joins the guarantee. That is the intended path for new code</span></div>
</div>

<h3>The part that is NOT self-enforcing</h3>
<p>Dark backgrounds also arrive as arbitrary hexes — <code>bg-[#0d1117]</code> and friends. Those cannot be caught by a token name, so the fix enumerates them, and the comment in <code>globals.css</code> says plainly that this list is a snapshot rather than an invariant. That is a claim with a shelf life, and this course&#39;s job is to check it:</p>

<pre><code class="language-python">guarded = set(re.findall(r'\\.bg-\\\\\\[\\\\\\#([0-9a-f]{3,8})\\\\\\]', css))
used    = scan every bg-[#hex] in src/**/*.tsx
dark    = {h for h in used if ratio(h, '#050505') &lt; 1.5}   # hides light-theme text
print(sorted(dark - guarded))
</code></pre>

<div class="out">hex duoc chan trong globals.css        : 51
bg-[#hex] khac nhau dung trong nguon   : 57
  trong do DU TOI de nuot chu #050505  : 50
hex TOI dung nhung KHONG duoc chan     : 0
hex duoc chan nhung khong con dung nua : 0
</div>

<div class="callout ok">
<p><strong>The guard is still complete.</strong> Zero gaps and zero stale entries, sixteen days after it was written. The one guarded hex that is not below 1,5 is <code>#1c2f52</code> at 1,53 — just over the line, and harmless to include. This is what a maintained snapshot looks like, and it is worth stating plainly: <em>the audit went looking for a hole and did not find one.</em></p>
</div>

<h3>Where it can still leak</h3>
<p>One structural gap remains, and it is worth naming precisely because it is invisible to the check above. The guard selector is <code>.bg-\\[\\#0e1218\\]</code>. An element written <code>lg:bg-[#0e1218]</code> compiles to a <em>different</em> class — <code>.lg\\:bg-\\[\\#0e1218\\]</code> — which that selector does not match:</p>

<div class="out">bg-[#hex] co tien to bien the, du toi   : 18 luot / 6 hex
  trong do  dark:  17    &lt;- ĐÚNG theo cau tao: chi song duoi .dark,
                             noi bang mau VON DA toi
  trong do  hover: 1     &lt;- cho HO that su
</div>

<p>Seventeen of the eighteen are <code>dark:</code>, which only apply inside the Notes region where the palette is already dark — correct by construction, not by luck. The single genuine escape is one <code>hover:bg-[#0c0f14]</code>: an element that turns dark on hover while its text palette does not follow. One occurrence, and worth fixing by adding <code>dark-surface</code> rather than by extending the hex list.</p>

<div class="pitfall">
<p><strong>Pitfall — enumerating values instead of naming them.</strong> Fifty-one arbitrary hexes had to be listed by hand because none of them has a name. Every one of them was a moment where someone typed a colour into a class attribute instead of adding a token to the config — Chapter 5&#39;s argument, arriving here as an accessibility cost. Had they been <code>bg-darkbg</code>, the self-enforcing branch would have covered them and the list would not exist.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A dark background from one file plus a theme-aware text token from another produced a 1,16 contrast ratio across 142 files, and the fix was not to edit those files but to re-declare the theme variables on the dark surfaces themselves — a self-enforcing rule that today still covers all 51 arbitrary dark hexes with zero gaps, leaking only where a variant prefix creates a class name the guard selector cannot match.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — using CSS custom properties</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties — the inheritance behaviour that makes re-declaring on a container reach every descendant.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG 2.2 — 1.4.3 Contrast (Minimum)</span><span class="lc-sub">w3.org/WAI/WCAG22/Understanding/contrast-minimum — the 4,5 threshold that 1,16 misses by a factor of nearly four.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">globals.css, the comment above <code>.dark-surface</code></span><span class="lc-sub">The primary source for this lesson: the incident, the measurement, the two candidate fixes and why the second was chosen — written at the time, in the file it fixes.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 5 — extending the config</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — the naming argument whose absence produced a 51-entry hand-maintained list.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Sự cố 1,16, và lưới chắn ĐÃ GIỮ ĐƯỢC</h2>
<p class="lead">Chỗ trượt ở bài 9.1 là một lỗi TINH CHỈNH — một màu xám chọn hơi nhạt quá. Bài này nói về kiểu KHÁC, nơi từng quyết định riêng lẻ đều bào chữa được mà tổ hợp lại cho ra chữ VÔ HÌNH. Nó được ghi lại trong chính <code>globals.css</code> của kho này, kèm số đo.</p>

<h3>Chuyện đã xảy ra</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">quyết định một</span><span class="lz-nsub">một nền tối CỐ ĐỊNH</span></span>
<span class="lz-nbody">Nhiều phần lớn của trang vẽ nền tối <em>bất kể theme</em>, bằng <code>bg-darkbg</code> / <code>bg-darkcard</code> / <code>bg-darksurface</code> — hex cứng <code>#18191a</code> / <code>#242526</code> / <code>#303031</code> trong config Tailwind. Hoàn toàn hợp lý: có những vùng CỐ Ý trông như một cửa sổ dòng lệnh.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">quyết định hai</span><span class="lz-nsub">chữ THEO theme</span></span>
<span class="lz-nbody">Chữ bên trong dùng <code>text-text-primary</code>, mà Chương 6 đã dựng rằng nó ánh xạ tới <code>var(--text-primary)</code> — một giá trị <em>ĐỔI theo theme</em>. Cũng hoàn toàn hợp lý, và thật ra đó chính là quy tắc phần còn lại của kho mã phải theo.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">tổ hợp lại</span><span class="lz-nsub">1,16 ở theme sáng</span></span>
<span class="lz-nbody">Ở theme sáng <code>--text-primary</code> phân giải thành <code>#050505</code>. Chữ gần-đen trên nền <code>#18191a</code>. Đo trên <code>/repos</code> trước khi vá: <strong>rgb(5,5,5) trên rgb(24,25,26), tỉ số 1,16</strong>, so với mức tối thiểu AA là 4,5.</span>
</div>
</div>

<div class="callout warn">
<p><strong>Không nửa nào SAI khi đứng riêng.</strong> Một vùng tối cố định là thiết kế chính đáng. Chữ theo theme là mặc định ĐÚNG. Khiếm khuyết nằm ở <em>TƯƠNG TÁC</em>, nghĩa là không người soát nào nhìn từng file riêng lẻ bắt được — và không bộ lint nào kiểm từng lớp một bắt được. Đây là kiểu hỏng mà CSS tiện ích làm cho DỄ xảy ra: nền đến từ một component còn màu chữ đến từ một token định nghĩa cách đó ba file.</p>
</div>

<h3>Nó bị phát hiện thế nào, và quy mô bao nhiêu</h3>
<div class="out">/repos, theme sang, TRUOC khi va
  tieu de "Kho repo duoc binh chon"   rgb(5,5,5) tren rgb(24,25,26)  ti so 1,16
  form dang nhap: "Welcome Back", nhan Username / Password — y het

pham vi anh huong:  142 file / 622 luot dung
</div>

<p>Nó lộ ra qua form đăng nhập, màn hình DUY NHẤT mà mọi người dùng đều gặp. Đó là MAY, không phải quy trình: 142 file bị ảnh hưởng và những chỗ nằm sau lớp đăng nhập lẽ ra có thể hỏng vô thời hạn.</p>

<h3>Bản vá, và vì sao nó KHÔNG phải &quot;sửa 142 file&quot;</h3>
<p>Cách sửa hiển nhiên là đổi lớp chữ ở mọi component bị ảnh hưởng. Kho này làm việc khác — nó KHAI LẠI các biến theme <em>ngay trên chính các bề mặt tối</em>:</p>

<pre><code class="language-css">.dark-surface,
.bg-darkbg,
.bg-darkcard,
.bg-darksurface {
  /* gia tri chep NGUYEN VAN tu html.theme-dark o tren */
  --text-primary:   #e4e6eb;
  --text-secondary: #b0b3b8;
  ...
}
</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">nó TỰ THI HÀNH</span><span class="lz-lnote">mọi <code>bg-darkbg</code> TƯƠNG LAI tự động có bảng màu đọc được. Không có quy tắc nào để người sau phải nhớ và không có file thứ 143 nào để bỏ sót — bất biến được thi hành bởi CHÍNH cái lớp tạo ra mối nguy</span></div>
<div class="lz-layer"><span class="lz-lname">phạm vi ảnh hưởng lên mã ĐANG CHẠY là KHÔNG</span><span class="lz-lnote">ở theme tối thì <code>html.theme-dark</code> vốn ĐÃ đặt đúng những giá trị ấy, nên khai lại chẳng đổi gì. Khác biệt hành vi DUY NHẤT nằm ở theme sáng, nơi các vùng đó vốn không đọc được</span></div>
<div class="lz-layer"><span class="lz-lname">nó dùng KẾ THỪA, thứ vốn miễn phí</span><span class="lz-lnote">thuộc tính tuỳ biến KẾ THỪA. Đặt chúng trên vùng chứa là với tới mọi con cháu ở mọi độ sâu mà không cần một selector con cháu nào — chỗ DUY NHẤT biến CSS thắng tiện ích dứt khoát</span></div>
<div class="lz-layer"><span class="lz-lname"><code>dark-surface</code> là cửa tự nguyện</span><span class="lz-lnote">với một vùng tối mà nền đến từ thứ khác bốn token kia, thêm MỘT lớp là gia nhập được bảo đảm. Đó là đường đi dành cho mã mới</span></div>
</div>

<h3>Phần KHÔNG tự thi hành</h3>
<p>Nền tối còn đến dưới dạng hex tuỳ ý — <code>bg-[#0d1117]</code> và đồng bọn. Những cái đó không bắt được bằng tên token, nên bản vá phải LIỆT KÊ chúng, và chú thích trong <code>globals.css</code> nói thẳng rằng danh sách ấy là một ẢNH CHỤP chứ không phải một bất biến. Đó là một lời khẳng định có HẠN DÙNG, và việc của khoá này là đi kiểm:</p>

<pre><code class="language-python">guarded = set(re.findall(r'\\.bg-\\\\\\[\\\\\\#([0-9a-f]{3,8})\\\\\\]', css))
used    = quet moi bg-[#hex] trong src/**/*.tsx
dark    = {h for h in used if ratio(h, '#050505') &lt; 1.5}   # nuot chu theme sang
print(sorted(dark - guarded))
</code></pre>

<div class="out">hex duoc chan trong globals.css        : 51
bg-[#hex] khac nhau dung trong nguon   : 57
  trong do DU TOI de nuot chu #050505  : 50
hex TOI dung nhung KHONG duoc chan     : 0
hex duoc chan nhung khong con dung nua : 0
</div>

<div class="callout ok">
<p><strong>Lưới chắn vẫn ĐẦY ĐỦ.</strong> Không chỗ hở, không mục thừa, mười sáu ngày sau khi nó được viết. Mã hex duy nhất được chắn mà không dưới 1,5 là <code>#1c2f52</code> ở 1,53 — vừa qua lằn ranh, và giữ lại thì vô hại. Đây là hình ảnh của một ảnh chụp ĐƯỢC BẢO TRÌ, và đáng nói thẳng: <em>cuộc soát đi tìm chỗ hở và KHÔNG tìm thấy.</em></p>
</div>

<h3>Chỗ nó VẪN có thể rò</h3>
<p>Còn đúng một khe hở cấu trúc, và đáng gọi tên chính xác vì nó VÔ HÌNH với phép kiểm ở trên. Selector chắn là <code>.bg-\\[\\#0e1218\\]</code>. Một phần tử viết <code>lg:bg-[#0e1218]</code> biên dịch thành một lớp <em>KHÁC</em> — <code>.lg\\:bg-\\[\\#0e1218\\]</code> — mà selector đó KHÔNG khớp:</p>

<div class="out">bg-[#hex] co tien to bien the, du toi   : 18 luot / 6 hex
  trong do  dark:  17    &lt;- DUNG theo cau tao: chi song duoi .dark,
                             noi bang mau VON DA toi
  trong do  hover: 1     &lt;- cho HO that su
</div>

<p>Mười bảy trên mười tám là <code>dark:</code>, vốn chỉ áp trong vùng Notes nơi bảng màu ĐÃ tối sẵn — đúng theo CẤU TẠO, không phải nhờ may. Chỗ thoát thật sự duy nhất là một <code>hover:bg-[#0c0f14]</code>: một phần tử hoá tối khi rê chuột trong khi bảng màu chữ của nó không đi theo. Một lượt, và nên vá bằng cách thêm <code>dark-surface</code> chứ KHÔNG phải nối dài danh sách hex.</p>

<div class="pitfall">
<p><strong>Bẫy — LIỆT KÊ giá trị thay vì ĐẶT TÊN cho chúng.</strong> Năm mươi mốt mã hex tuỳ ý phải liệt kê bằng tay vì KHÔNG cái nào có tên. Mỗi cái là một khoảnh khắc ai đó gõ một màu vào thuộc tính class thay vì thêm một token vào config — lập luận của Chương 5, xuất hiện ở đây dưới dạng một cái giá về khả năng tiếp cận. Nếu chúng đã là <code>bg-darkbg</code> thì nhánh tự-thi-hành đã phủ hết và danh sách kia đã không tồn tại.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một nền tối từ file này cộng một token chữ theo-theme từ file khác đã tạo ra tỉ số tương phản 1,16 trải khắp 142 file, và bản vá KHÔNG phải là sửa 142 file ấy mà là khai lại các biến theme ngay trên chính các bề mặt tối — một quy tắc tự thi hành mà hôm nay vẫn phủ đủ cả 51 mã hex tối tuỳ ý với KHÔNG chỗ hở, chỉ rò ở chỗ một tiền tố biến thể tạo ra tên lớp mà selector chắn không khớp nổi.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — dùng thuộc tính tuỳ biến CSS</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties — hành vi KẾ THỪA khiến việc khai lại trên vùng chứa với tới mọi con cháu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG 2.2 — 1.4.3 Contrast (Minimum)</span><span class="lc-sub">w3.org/WAI/WCAG22/Understanding/contrast-minimum — ngưỡng 4,5 mà 1,16 thiếu tới gần bốn lần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">globals.css, chú thích ngay trên <code>.dark-surface</code></span><span class="lc-sub">Nguồn gốc của bài này: sự cố, số đo, hai phương án vá và lý do chọn phương án hai — viết ngay lúc đó, trong chính file nó vá.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 5 — mở rộng cấu hình</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — lập luận về đặt tên mà sự vắng mặt của nó đẻ ra một danh sách 51 mục bảo trì bằng tay.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — The wider hunt: 326 classes that resolve to nothing|||9.3 — Cuộc soát rộng hơn: 326 lớp phân giải thành KHÔNG GÌ',
      slug: 'tw-9-3-lop-ma',
      type: 'VIDEO',
      description: 'Chương 6 tìm được 91 lớp opacity chết. Bài này quét lại HẾT: 118.511 lớp tĩnh, 326 lượt (0,28%) không có quy tắc nào. Phân theo LOẠI: 81 alpha trên var(), 76 lượt token `bg-elevated` chưa từng tồn tại, 13 lớp cần plugin, 18 lớp ngoài thang, 25 giá trị tuỳ ý viết sai, và 113 chỗ CÒN LẠI đáng nhìn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>The wider hunt: 326 classes that resolve to nothing</h2>
<p class="lead">Chapter 6 measured one specific failure — 91 opacity modifiers on bare-<code>var()</code> colours — and Chapter 4 measured the 76% of dynamic strings that bypass <code>tailwind-merge</code>. Both are subsets of a wider question: <em>how many class tokens in this codebase have no matching CSS rule anywhere?</em> This lesson answers it, and the answer decomposes into buckets that each mean something different.</p>

<h3>The audit, in one pass</h3>
<pre><code class="language-python">import re, os
present = set()
def harvest(css):
    for m in re.finditer(r'\\.((?:\\\\[0-9a-fA-F]{1,6} ?|\\\\.|[A-Za-z0-9_-])+)', css):
        raw = m.group(1)
        c = re.sub(r'\\\\([0-9a-fA-F]{1,6}) ?', lambda x: chr(int(x.group(1),16)), raw)
        present.add(re.sub(r'\\\\(.)', r'\\1', c))

# every rule Tailwind emitted, PLUS every rule the 4 hand-written CSS files add
harvest(open('out.css').read())          # 4.193 class names (Tailwind)
for p in ('globals.css','exam.css','code-lab.css','cyber.css'):
    harvest(open(p).read())              # + 508 hand-written names
# =&gt; 4.701 distinct class names known to exist
</code></pre>

<p>The key trick is unescaping CSS numeric escapes. A shadow selector like <code>.shadow-\\[0_24px_80px_rgba\\(0\\2c 0\\2c 0\\2c 0\\.6\\)\\]</code> encodes the commas as <code>\\2c </code> — six characters, one comma. Missing that turns a first-pass audit into a false alarm: my first run reported that <em>every</em> arbitrary shadow was &quot;missing&quot;, when the real problem was my extraction pattern. Kept here in full because the same trap kills any homegrown audit.</p>

<div class="out">Ket qua quet:
  className strings kiem tra    : 34.128
  ma tuc (token tinh)           : 118.511
  KHONG co quy tac o dau ca     : 326 luot / 119 ten  (0,28%)
</div>

<h3>Sorted by CAUSE — four groups that mean something</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">A · an opacity modifier on a <code>var()</code> bare</span><span class="lz-nsub">81 uses / 12 names · Chapter 6</span></span>
<span class="lz-nbody">Carried over from Chapter 6 and re-measured today. The worst offender: <code>text-text-muted/70</code> (15), <code>text-text-muted/30</code> (15), <code>text-text-muted/50</code> (12). That is <em>exactly</em> Chapter 6's group of 91, matching within a commit's worth of drift — nine of them now live in a dynamic className (<code>\${...}</code>) and five in <code>cva()</code>.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">B · token <code>bg-elevated</code> never existed at all</span><span class="lz-nsub">76 uses / 9 names · 14 files</span></span>
<span class="lz-nbody">This repo does NOT declare <code>--bg-elevated</code> anywhere — not in <code>tailwind.config.ts</code>, not in any of the four hand-written CSS files. And yet <code>bg-bg-elevated/60</code> appears 40 times, <code>bg-bg-elevated/40</code> sixteen, <code>hover:bg-bg-elevated/80</code> five. Not one of those classes is generated — every one of those elements is fully transparent instead of carrying a raised surface. This is the class of error that TypeScript's and ESLint's static linting cannot see.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">C · classes that need an uninstalled plugin</span><span class="lz-nsub">13 uses / 4 names</span></span>
<span class="lz-nbody"><code>prose-invert</code> (6), <code>dark:prose-invert</code> (4), <code>prose-cl</code> (2), <code>prose-language</code> (1) — all of which need <code>@tailwindcss/typography</code>. Section 0 measured <code>plugins: []</code>, so that plugin is NOT present. Four lines of non-existent CSS are being placed into JSX quite harmlessly.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">D · values off the scale</span><span class="lz-nsub">18 uses / 5 names · Chapter 1</span></span>
<span class="lz-nbody"><code>w-4.5</code> (7), <code>h-4.5</code> (7), <code>w-5.5</code>, <code>h-5.5</code>, <code>prose-code:py-0.5</code>. Precisely where Chapter 1 said the scale only steps <code>.5</code> to <code>3.5</code>; <code>4.5</code> has never existed, and Tailwind silently emits nothing. Seven matched <code>w</code>/<code>h</code> pairs across six files suggest somebody wanted an 18px icon and Tailwind handed back an icon of <em>no size at all</em>.</span>
</div>
</div>

<h3>Group E — arbitrary values with the SYNTAX WRONG</h3>
<pre><code class="language-text">border-white/12                    5  &lt;- opacity phai la buoc chuan: 10 hoac /[12%]
to-neon-purple                     4  &lt;- to-* can gradient CO cai to-color
prose-strong:text-[var(--...)]     2  &lt;- variant prose-* chi ton tai voi plugin
placeholder:text-text-muted/60     7  &lt;- variant placeholder: chay chuong 6
</code></pre>

<p>Twenty-five uses, eighteen names. What they share is being <em>almost right</em> — <code>border-white/12</code> differs from <code>border-white/10</code> by exactly one digit, and no 12 exists in Tailwind's default scale, so it generates NOTHING; for 12% you write <code>border-white/[12%]</code>. The same mistake appears as <code>duration-3000</code> (3 uses): the scale only has <code>duration-1000</code>.</p>

<h3>Group F — the remainder</h3>
<div class="out">113 luot / 71 ten — nhung cai KHONG rot vao 5 nhom tren:
   khong-in            6   &lt;- lop cua RIENG UNG DUNG, dinh boi CSS in
   markdown-body       5   &lt;- kieu github-markdown-css, KHONG cai
   scrollbar-hide      4   &lt;- tailwind-scrollbar-hide, KHONG cai
   scrollbar-thin      3   &lt;- tailwind-scrollbar, KHONG cai
   hljs                3   &lt;- highlight.js, KHONG cai
   text-bg-base        4   &lt;- token DaisyUI-style, KHONG khai
</div>

<p>Most of group F is the memory of <em>other tools</em> — a print library, a syntax-highlighting library, a scroll plugin — whose class names somebody remembered without installing them. None of these is a Tailwind bug; every one is a bug of <em>assumption</em>.</p>

<div class="callout ok">
<p><strong>0.28% sounds small, but it is SELECTIVE.</strong> Against 118,511 tokens, 326 is under three in a thousand. But ninety percent of those uses concentrate into the three groups A/B/C — each one a defect spread across dozens of files. That is why a coarse counter (&quot;99.72% of classes work&quot;) understates everything here.</p>
</div>

<h3>What LINTING could catch, starting tomorrow</h3>
<pre><code class="language-js">// eslint-plugin-tailwindcss/no-custom-classname
{
  rules: {
    'tailwindcss/no-custom-classname': ['error', {
      whitelist: [           // hoac thay theo cai tay ban DINH khai
        'khong-in', 'markdown-body', 'scrollbar-hide',
        'exam-.*', 'cl-.*', 'notes-.*',
      ],
    }],
  },
}
</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">enable the rule</span><span class="lz-d">catches A, B, D and most of E right at the keyboard, before any build. C and F need a whitelist for the repo's own prefixes.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">cross-check in CI</span><span class="lz-d">run the very script from the top of this lesson as a CI step. It also catches the places where a dynamic template literal slips past ESLint's AST.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">measure the FLOOR, not the CEILING</span><span class="lz-d">just like Chapter 8: fail the build when the count rises, not when it crosses an absolute threshold. Thresholds get forgotten; a jump gets noticed.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — assuming a &quot;class with NO rule&quot; is harmless because nothing errors.</strong> None of this makes Tailwind complain, JSX refuse, or TypeScript break. That IS the problem — there is no signal to respond to. Compensate with a periodic measurement, or a linter, or both; do not rely on spotting it while browsing the site.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> 0.28% of the static classes in this repo resolve to NOTHING, but that small number hides a concentrated structure: 81 uses are the alpha-on-a-bare- <code>var()</code> group Chapter 6 measured, 76 uses are a <code>bg-elevated</code> token that was never declared, 13 uses need an uninstalled plugin, 18 uses are off-scale values, and 25 uses are Tailwind syntax wrong by a single digit — each group a defect spread across many files with no signal to respond to.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">eslint-plugin-tailwindcss</span><span class="lc-sub">github.com/francoismassart/eslint-plugin-tailwindcss — rule <code>no-custom-classname</code> bắt A/B/D/E ở IDE, cùng vài rule differs from đáng bật như <code>classnames-order</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind — Detecting classes in source files</span><span class="lc-sub">tailwindcss.com/docs/detecting-classes-in-source-files — tài liệu chính thức về khi nào one lớp KHÔNG được phát sinh, kể cả trường hợp template literal chẻ chuỗi ngang mà bài 0.1 đã đo.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CSS Escapes — CSS Syntax Module Level 3</span><span class="lc-sub">w3.org/TR/css-syntax-3/#escaping — quy tắc thoát chuỗi mà bài này must cài để NOT báo động giả về mọi shadow tuỳ ý.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — CSS variables and the alpha trap</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — nguồn gốc của nhóm A và bản vá hai file cho nó.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Cuộc soát rộng hơn: 326 lớp phân giải thành KHÔNG GÌ</h2>
<p class="lead">Chương 6 đo một chỗ hỏng CỤ THỂ — 91 bổ từ độ mờ trên màu <code>var()</code> trần — và Chương 4 đo 76% chuỗi động vượt qua <code>tailwind-merge</code>. Cả hai là tập con của một câu hỏi rộng hơn: <em>bao nhiêu token lớp trong kho này KHÔNG có quy tắc CSS nào khớp?</em> Bài này trả lời, và câu trả lời tách thành các nhóm mỗi cái mang một ý nghĩa khác nhau.</p>

<h3>Phép soát, trong một lượt quét</h3>
<pre><code class="language-python">import re, os
present = set()
def harvest(css):
    for m in re.finditer(r'\\.((?:\\\\[0-9a-fA-F]{1,6} ?|\\\\.|[A-Za-z0-9_-])+)', css):
        raw = m.group(1)
        c = re.sub(r'\\\\([0-9a-fA-F]{1,6}) ?', lambda x: chr(int(x.group(1),16)), raw)
        present.add(re.sub(r'\\\\(.)', r'\\1', c))

# moi quy tac Tailwind phat ra, CONG moi quy tac 4 file CSS viet tay them
harvest(open('out.css').read())          # 4.193 ten lop (Tailwind)
for p in ('globals.css','exam.css','code-lab.css','cyber.css'):
    harvest(open(p).read())              # + 508 ten viet tay
# =&gt; 4.701 ten lop KHAC NHAU biet chac ton tai
</code></pre>

<p>Chỗ then chốt là <strong>gỡ thoát các mã hex CSS</strong>. Selector bóng như <code>.shadow-\\[0_24px_80px_rgba\\(0\\2c 0\\2c 0\\2c 0\\.6\\)\\]</code> mã hoá dấu phẩy thành <code>\\2c </code> — sáu ký tự, một dấu phẩy. Bỏ qua bước đó là biến một lượt soát đầu tiên thành BÁO ĐỘNG GIẢ: lượt chạy đầu tôi báo <em>MỌI</em> shadow tuỳ ý &quot;thiếu&quot;, trong khi vấn đề thật là mẫu tách của tôi. Giữ nguyên ở đây vì cùng cái bẫy sẽ giết bất kỳ phép soát tự viết nào.</p>

<div class="out">Ket qua quet:
  className strings kiem tra    : 34.128
  ma tuc (token tinh)           : 118.511
  KHONG co quy tac o dau ca     : 326 luot / 119 ten  (0,28%)
</div>

<h3>Phân loại theo NGUYÊN NHÂN — bốn nhóm có ý nghĩa</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">A · bổ từ độ mờ trên <code>var()</code> trần</span><span class="lz-nsub">81 lượt / 12 tên · Chương 6</span></span>
<span class="lz-nbody">Nhắc lại từ Chương 6, đo lại hôm nay. Cao nhất: <code>text-text-muted/70</code> (15), <code>text-text-muted/30</code> (15), <code>text-text-muted/50</code> (12). Đây là <em>đúng</em> nhóm 91 lượt của Chương 6, khớp trong sai số của một đợt commit — chín trong số đó nay ở className động (<code>\${...}</code>) và năm trong <code>cva()</code>.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">B · token <code>bg-elevated</code> chưa từng tồn tại</span><span class="lz-nsub">76 lượt / 9 tên · 14 file</span></span>
<span class="lz-nbody">Kho này KHÔNG khai <code>--bg-elevated</code> ở đâu — không trong <code>tailwind.config.ts</code>, không trong bốn file CSS viết tay. Vậy mà <code>bg-bg-elevated/60</code> xuất hiện 40 lần, <code>bg-bg-elevated/40</code> mười sáu, <code>hover:bg-bg-elevated/80</code> năm. Không lớp nào phát sinh cả — mọi phần tử ấy đều đang trong suốt hoàn toàn thay vì có một bề mặt nâng lên. Đây là loại lỗi mà lint tĩnh của TypeScript và ESLint không nhìn thấy được.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">C · lớp cần plugin không cài</span><span class="lz-nsub">13 lượt / 4 tên</span></span>
<span class="lz-nbody"><code>prose-invert</code> (6), <code>dark:prose-invert</code> (4), <code>prose-cl</code> (2), <code>prose-language</code> (1) — tất cả cần <code>@tailwindcss/typography</code>. Mục 0 đo được <code>plugins: []</code>, nên plugin ấy KHÔNG có mặt. Bốn dòng CSS không tồn tại đang được đặt vào JSX một cách vô hại.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">D · giá trị ngoài thang</span><span class="lz-nsub">18 lượt / 5 tên · Chương 1</span></span>
<span class="lz-nbody"><code>w-4.5</code> (7), <code>h-4.5</code> (7), <code>w-5.5</code>, <code>h-5.5</code>, <code>prose-code:py-0.5</code>. Đúng chỗ Chương 1 nói thang chỉ có bước <code>.5</code> đến <code>3.5</code>; <code>4.5</code> chưa từng có, và Tailwind âm thầm không phát ra gì. Bảy cặp <code>w</code>/<code>h</code> khớp nhau ở sáu file gợi ra ai đó muốn một icon 18px và Tailwind trả lại icon <em>không cỡ nào cả</em>.</span>
</div>
</div>

<h3>Nhóm E — giá trị tuỳ ý viết SAI CÚ PHÁP</h3>
<pre><code class="language-text">border-white/12                    5  &lt;- opacity phai la buoc chuan: 10 hoac /[12%]
to-neon-purple                     4  &lt;- to-* can gradient CO cai to-color
prose-strong:text-[var(--...)]     2  &lt;- variant prose-* chi ton tai voi plugin
placeholder:text-text-muted/60     7  &lt;- variant placeholder: chay chuong 6
</code></pre>

<p>Hai mươi lăm lượt, mười tám tên. Cái chung là <em>gần như đúng</em> — <code>border-white/12</code> khác <code>border-white/10</code> đúng một chữ số và không chữ số 12 nào có trong thang mặc định của Tailwind, nên nó phát sinh KHÔNG GÌ; muốn 12% thì viết <code>border-white/[12%]</code>. Cùng lỗi ở dạng <code>duration-3000</code> (3 lượt): thang chỉ có <code>duration-1000</code>.</p>

<h3>Nhóm F — còn lại</h3>
<div class="out">113 luot / 71 ten — nhung cai KHONG rot vao 5 nhom tren:
   khong-in            6   &lt;- lop cua RIENG UNG DUNG, dinh boi CSS in
   markdown-body       5   &lt;- kieu github-markdown-css, KHONG cai
   scrollbar-hide      4   &lt;- tailwind-scrollbar-hide, KHONG cai
   scrollbar-thin      3   &lt;- tailwind-scrollbar, KHONG cai
   hljs                3   &lt;- highlight.js, KHONG cai
   text-bg-base        4   &lt;- token DaisyUI-style, KHONG khai
</div>

<p>Phần lớn nhóm F là ký ức của các <em>công cụ khác</em> — thư viện in ấn, thư viện tô mã, plugin cuộn — mà ai đó nhớ tên lớp nhưng không cài. Không cái nào là bug của Tailwind; tất cả đều là bug của <em>giả định</em>.</p>

<div class="callout ok">
<p><strong>0,28% nghe nhỏ, nhưng nó CHỌN LỌC.</strong> 118.511 token nhìn tổng thể thì 326 là dưới ba phần nghìn. Nhưng chín mươi phần trăm số lượt ấy tập trung vào ba nhóm A/B/C — mỗi cái là một khiếm khuyết trải khắp hàng chục file. Đó là lý do một bộ đếm rừng rú (&quot;99,72% lớp đều hoạt động&quot;) sẽ đánh giá thấp mọi thứ ở đây.</p>
</div>

<h3>Cái LINT có thể bắt, ngày mai</h3>
<pre><code class="language-js">// eslint-plugin-tailwindcss/no-custom-classname
{
  rules: {
    'tailwindcss/no-custom-classname': ['error', {
      whitelist: [           // hoac thay theo cai tay ban DINH khai
        'khong-in', 'markdown-body', 'scrollbar-hide',
        'exam-.*', 'cl-.*', 'notes-.*',
      ],
    }],
  },
}
</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">bật rule</span><span class="lz-d">bắt A, B, D và phần lớn E ngay ở chỗ gõ, trước cả khi build. C và F cần whitelist các tiền tố kho tự dùng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">đối chứng bằng CI</span><span class="lz-d">chạy chính script kiểm ở đầu bài như một bước CI. Nó bắt được cả những chỗ mà template literal động qua mặt AST của ESLint.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">tính SÀN chứ không tính TRẦN</span><span class="lz-d">giống Chương 8: chặn build khi số lượt tăng, không chặn khi vượt một ngưỡng tuyệt đối. Ngưỡng bị lãng quên; tăng đột biến bị chú ý.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cho rằng &quot;lớp không có quy tắc&quot; là vô hại vì nó KHÔNG lỗi.</strong> Không cái nào ở đây làm Tailwind kêu, JSX từ chối, hay TypeScript hỏng. Đó là VẤN ĐỀ — không có tín hiệu nào để đáp lại. Bù đắp bằng một phép đo có định kỳ, hoặc bằng linter, hoặc cả hai; đừng dựa vào việc thấy nó xảy ra trong duyệt web.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> 0,28% các lớp tĩnh trong kho này phân giải thành KHÔNG GÌ, nhưng con số nhỏ ấy che một cấu trúc tập trung: 81 lượt là nhóm alpha trên <code>var()</code> mà Chương 6 đã đo, 76 lượt là một token <code>bg-elevated</code> chưa bao giờ khai, 13 lượt cần một plugin không cài, 18 lượt là giá trị ngoài thang, và 25 lượt là cú pháp Tailwind viết sai một chữ số — mỗi nhóm là một khiếm khuyết trải khắp nhiều file mà không có tín hiệu nào để đáp lại.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">eslint-plugin-tailwindcss</span><span class="lc-sub">github.com/francoismassart/eslint-plugin-tailwindcss — rule <code>no-custom-classname</code> bắt A/B/D/E ở IDE, cùng vài rule khác đáng bật như <code>classnames-order</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind — Detecting classes in source files</span><span class="lc-sub">tailwindcss.com/docs/detecting-classes-in-source-files — tài liệu chính thức về khi nào một lớp KHÔNG được phát sinh, kể cả trường hợp template literal chẻ chuỗi ngang mà bài 0.1 đã đo.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CSS Escapes — CSS Syntax Module Level 3</span><span class="lc-sub">w3.org/TR/css-syntax-3/#escaping — quy tắc thoát chuỗi mà bài này phải cài để không báo động giả về mọi shadow tuỳ ý.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — biến CSS và cái bẫy alpha</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — nguồn gốc của nhóm A và bản vá hai file cho nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — Focus rings: 72 outlines removed with nothing put back|||9.4 — Vòng focus: 72 chỗ gỡ outline mà KHÔNG đặt lại gì',
      slug: 'tw-9-4-focus',
      type: 'VIDEO',
      description: '526 chuỗi className có `outline-none`. Trong đó 454 (86%) có sẵn `focus:*` hoặc `focus-visible:*` thay thế. 72 cái CÒN LẠI thì không — và 58 trong 72 là `<input>` hoặc `<textarea>`, đúng chỗ bàn phím cần thấy để dùng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Focus rings: 72 outlines removed with nothing put back</h2>
<p class="lead">A focus ring is how a keyboard user sees where they are on the page. Browsers draw one by default; <code>outline-none</code> removes it. The utility exists because designers want to replace the default with something that matches the palette, not to remove the ring entirely — but the class does not know that intent. This lesson measures how often the intent survived the trip to the JSX file.</p>

<h3>The measurement</h3>
<pre><code class="language-python">import re, os
CLS   = re.compile(r'className=(?:&quot;([^&quot;]*)&quot;|\\{&#96;([^&#96;]*)&#96;\\})', re.S)
FOCUS = re.compile(r'\\bfocus(-visible|-within)?:(ring|outline|border|shadow|bg)')

tot = 0; replaced = 0; missing = []
for path in walk('src', suffix='.tsx'):
    src = read(path)
    for m in CLS.finditer(src):
        s = m.group(1) or m.group(2) or ''
        if 'outline-none' not in s: continue
        tot += 1
        if FOCUS.search(s): replaced += 1
        else: missing.append((path, s, nearest_tag_before(src, m.start())))
</code></pre>

<div class="out">className co outline-none          : 526
  co focus:* thay the trong CUNG chuoi:  454   (86%)
  KHONG co gi thay the                :   72   (14%)   trong 48 file
</div>

<p>Fourteen percent is a number you have to place next to <em>where</em> it happens — not every input is equally worrying:</p>

<div class="out">72 chuoi KHONG co ring thay the, theo the:
   input             39     &lt;- o nhap text/email/mat khau
   textarea          13     &lt;- o soan van dai
   select             6
   div                5
   Command.Input      1
   khong xac dinh     8     &lt;- ham helper, cva()
</div>

<div class="callout warn">
<p><strong>Fifty-eight of them are input fields.</strong> <code>input</code>, <code>textarea</code>, <code>select</code>, <code>Command.Input</code> — exactly where keyboard users <em>must</em> know where they are typing in order to work at all. A gap on a <code>div</code> is merely an eyesore; a gap on an <code>input</code> means tabbing through a three-field form gives you no three blinking lights at all.</p>
</div>

<h3>Why <code>outline-none</code> gets typed in the first place</h3>
<p>Nobody here is being careless on purpose. The browser's default focus ring is a 2px old-Windows-blue frame, usually hugging the input's border, and in many designs it genuinely fights the aesthetic. The correct move is to remove it and draw a replacement that matches the palette:</p>

<pre><code class="language-tsx">// dung — 86% cua kho lam nhu vay
&lt;input className=&quot;outline-none focus:ring-2 focus:ring-blue-500&quot; /&gt;

// sai — 14% cua kho, va tuyet dai da so la o nhap
&lt;input className=&quot;outline-none&quot; /&gt;
</code></pre>

<h3>Why <code>focus-visible:</code> rather than <code>focus:</code></h3>
<p>The difference is not small, and this repo gets it right in the vast majority of cases. Recounting across every file, <code>.tsx</code>:</p>

<div class="out">focus:            854 luot   (chua duoc chuot moi ban ha xuong)
focus-visible:    211 luot   (chi hien khi vao BANG BAN PHIM)
</div>

<p><code>focus-visible:</code> is the finer choice — it draws no ring when a mouse user clicks a button (they do not need to see one) but does draw one when they tab to it. This repo uses it robustly in 211 places; the remainder still uses <code>focus:</code>, which still works fine — an extra ring on a mouse click is not an accessibility defect, just a little unpolished.</p>

<h3>And <code>ring-offset-*</code>?</h3>
<div class="out">ring-offset*  : 5 luot trong toan bo .tsx
</div>

<p>Only FIVE uses. <code>ring-offset</code> separates the focus ring from the element's edge, letting it stand out against a same-coloured background — which matters when ring and background sit in the same low-contrast band. Not a hole, just a piece of available polish the repo barely touches.</p>

<h3>Fixing the 72 — a proposal</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">one shared MIXIN</span><span class="lz-d">create a constant in <code>frontend/src/lib/</code>:  <code>export const inputFocus = 'outline-none focus-visible:ring-2 focus-visible:ring-cat-ai-icon focus-visible:ring-offset-2'</code>. Every new <code>input</code> appends it through <code>cn()</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">patch the 58 inputs first</span><span class="lz-d">find the 58 files with the script at the top of this lesson and replace <code>&quot;outline-none&quot;</code> with <code>cn(&quot;...&quot;, inputFocus)</code>. The blast radius is ZERO — it touches no non-input element and changes nothing about the unfocused appearance.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">turn on a rule</span><span class="lz-d">ESLint ships no rule for this, but a single regex (<code>eslint-plugin-regex</code>) suffices: match <code>className=&quot;.*outline-none.*&quot;</code> with NO <code>focus(-visible)?:</code> in the same string. The maintenance boundary closes, and from then on 72 can only fall.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — thinking keyboard accessibility is ONLY for blind users.</strong> Anyone driving the machine from the keyboard — someone with sore wrists who moved to shortcuts, an iPad user with a physical keyboard, a fast typist tabbing through a form — needs to see the focus ring to keep their place. This is accessibility measured in keyboard users, not only in screen-reader users.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> 86% of the places using <code>outline-none</code> in this repo do draw a replacement focus ring matching the palette, but the remaining 72 do not — and 58 of those 72 are <code>input</code>/<code>textarea</code>/<code>select</code>inputs, exactly where keyboard users NEED the focus ring most, and they can be patched with one shared <code>inputFocus</code> constant without touching anything else.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG 2.2 — 2.4.7 Focus Visible</span><span class="lc-sub">w3.org/WAI/WCAG22/Understanding/focus-visible — mỗi thao tác focus được with bàn phím must để lại one chỉ báo THẤY được. Tiêu chuẩn nói chính xác 72 where trên là trượt.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>:focus-visible</code></span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible — cách nó differs from <code>:focus</code>, và vì sao heuristic của trình duyệt bỏ ring cho click chuột lại là hành vi ĐÚNG.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind — <code>ring</code> utilities</span><span class="lc-sub">tailwindcss.com/docs/ring-width — <code>ring-2</code>, <code>ring-offset-*</code>, <code>ring-inset</code> — mọi thứ cần biết để vẽ lại exactly phần bị <code>outline-none</code> gỡ.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 4 — <code>cn()</code> and shared mixins</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — cấu trúc để chèn <code>inputFocus</code> vào 58 ô nhập mà NOT sao chép chuỗi bảy lần.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Vòng focus: 72 chỗ gỡ outline mà KHÔNG đặt lại gì</h2>
<p class="lead">Vòng focus là cách người dùng bàn phím biết mình đang ở đâu trên trang. Trình duyệt vẽ sẵn một cái; <code>outline-none</code> gỡ nó đi. Tiện ích ấy tồn tại vì các nhà thiết kế muốn thay vòng mặc định bằng một cái khớp bảng màu chứ KHÔNG phải để bỏ hẳn — nhưng cái lớp không biết ý đồ ấy. Bài này đo xem ý đồ có sống sót được đến file JSX bao nhiêu lần.</p>

<h3>Phép đo</h3>
<pre><code class="language-python">import re, os
CLS   = re.compile(r'className=(?:&quot;([^&quot;]*)&quot;|\\{&#96;([^&#96;]*)&#96;\\})', re.S)
FOCUS = re.compile(r'\\bfocus(-visible|-within)?:(ring|outline|border|shadow|bg)')

tot = 0; replaced = 0; missing = []
for path in walk('src', suffix='.tsx'):
    src = read(path)
    for m in CLS.finditer(src):
        s = m.group(1) or m.group(2) or ''
        if 'outline-none' not in s: continue
        tot += 1
        if FOCUS.search(s): replaced += 1
        else: missing.append((path, s, nearest_tag_before(src, m.start())))
</code></pre>

<div class="out">className co outline-none          : 526
  co focus:* thay the trong CUNG chuoi:  454   (86%)
  KHONG co gi thay the                :   72   (14%)   trong 48 file
</div>

<p>Mười bốn phần trăm là con số cần đặt kề <em>chỗ</em> nó xảy ra — không phải mọi ô nhập đều đáng lo bằng nhau:</p>

<div class="out">72 chuoi KHONG co ring thay the, theo the:
   input             39     &lt;- o nhap text/email/mat khau
   textarea          13     &lt;- o soan van dai
   select             6
   div                5
   Command.Input      1
   khong xac dinh     8     &lt;- ham helper, cva()
</div>

<div class="callout warn">
<p><strong>Năm mươi tám trong số đó là ô nhập.</strong> <code>input</code>, <code>textarea</code>, <code>select</code>, <code>Command.Input</code> — đúng những chỗ người dùng bàn phím <em>phải</em> biết mình đang gõ ở đâu để làm việc nổi. Một chỗ hở trên <code>div</code> chỉ là nhức mắt; một chỗ hở trên <code>input</code> là nếu bạn tab qua một form ba trường thì không có ba đèn nhấp nháy nào cả.</p>
</div>

<h3>Vì sao <code>outline-none</code> lại BỊ gõ vào</h3>
<p>Không phải ai cũng có ý xấu. Vòng focus mặc định của trình duyệt là một khung xanh Windows cũ 2px dày, thường sát viền input, và ở nhiều thiết kế nó CẢN thẩm mỹ. Cú thao tác đúng là gỡ nó rồi vẽ lại một cái khớp bảng màu:</p>

<pre><code class="language-tsx">// dung — 86% cua kho lam nhu vay
&lt;input className=&quot;outline-none focus:ring-2 focus:ring-blue-500&quot; /&gt;

// sai — 14% cua kho, va tuyet dai da so la o nhap
&lt;input className=&quot;outline-none&quot; /&gt;
</code></pre>

<h3>Sao lại là <code>focus-visible:</code> chứ không <code>focus:</code></h3>
<p>Sự khác biệt không nhỏ, và kho này đã đúng ở đại đa số. Đếm lại toàn bộ file <code>.tsx</code>:</p>

<div class="out">focus:            854 luot   (chua duoc chuot moi ban ha xuong)
focus-visible:    211 luot   (chi hien khi vao BANG BAN PHIM)
</div>

<p><code>focus-visible:</code> là lựa chọn tinh hơn — nó không vẽ vòng khi người dùng chuột bấm vào một nút (họ đâu cần thấy) nhưng có vẽ khi họ tab tới. Kho này đã bật đủ mạnh mẽ ở 211 chỗ; nhưng phần còn lại vẫn dùng <code>focus:</code>, thứ vẫn hoạt động ổn — có vòng thừa lúc chuột bấm không phải khiếm khuyết trợ năng, chỉ là hơi tuềnh toàng.</p>

<h3>Còn <code>ring-offset-*</code>?</h3>
<div class="out">ring-offset*  : 5 luot trong toan bo .tsx
</div>

<p>Chỉ NĂM lượt. <code>ring-offset</code> tách vòng focus khỏi cạnh phần tử, giúp nó nổi lên trên nền cùng màu — quan trọng khi ring và nền cùng nằm trong một dải tương phản thấp. Không phải lỗ hổng, chỉ là chi tiết đánh bóng có sẵn mà kho gần như không dùng đến.</p>

<h3>Sửa 72 chỗ — đề xuất</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">một MIXIN dùng chung</span><span class="lz-d">tạo một hằng ở <code>frontend/src/lib/</code>:  <code>export const inputFocus = 'outline-none focus-visible:ring-2 focus-visible:ring-cat-ai-icon focus-visible:ring-offset-2'</code>. Mọi <code>input</code> mới nối thêm nó qua <code>cn()</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">vá 58 ô nhập trước</span><span class="lz-d">tìm 58 file bằng script ở đầu bài, thay <code>&quot;outline-none&quot;</code> bằng <code>cn(&quot;...&quot;, inputFocus)</code>. Blast radius bằng KHÔNG — không đụng phần tử không phải input, không đổi hình thức khi không focus.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">bật một rule</span><span class="lz-d">ESLint không có rule sẵn cho việc này, nhưng một regex đơn (<code>eslint-plugin-regex</code>) đủ: khớp <code>className=&quot;.*outline-none.*&quot;</code> mà KHÔNG có <code>focus(-visible)?:</code> trong cùng chuỗi. Lằn ranh bảo trì đóng, sau đó số 72 chỉ có thể giảm.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — nghĩ trợ năng bàn phím CHỈ dành cho người khiếm thị.</strong> Bất kỳ ai điều khiển máy bằng bàn phím — người mỏi cổ tay chuyển sang phím tắt, người dùng iPad có bàn phím vật lý, thao tác viên gõ nhanh dùng Tab để dồn form — đều phải thấy vòng focus để không lạc chỗ. Đây là trợ năng tính bằng số người dùng bàn phím, không chỉ số người dùng trình đọc màn hình.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> 86% chỗ dùng <code>outline-none</code> trong kho này có vẽ lại một vòng focus khớp bảng màu, nhưng 72 chỗ còn lại không — và 58 trong 72 là các ô nhập <code>input</code>/<code>textarea</code>/<code>select</code>, đúng chỗ người dùng bàn phím CẦN thấy vòng focus nhất, có thể vá bằng một hằng <code>inputFocus</code> chung mà không đụng phần còn lại.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG 2.2 — 2.4.7 Focus Visible</span><span class="lc-sub">w3.org/WAI/WCAG22/Understanding/focus-visible — mỗi thao tác focus được bằng bàn phím phải để lại một chỉ báo THẤY được. Tiêu chuẩn nói chính xác 72 chỗ trên là trượt.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>:focus-visible</code></span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible — cách nó khác <code>:focus</code>, và vì sao heuristic của trình duyệt bỏ ring cho click chuột lại là hành vi ĐÚNG.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind — <code>ring</code> utilities</span><span class="lc-sub">tailwindcss.com/docs/ring-width — <code>ring-2</code>, <code>ring-offset-*</code>, <code>ring-inset</code> — mọi thứ cần biết để vẽ lại đúng phần bị <code>outline-none</code> gỡ.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 4 — <code>cn()</code> và các mixin chung</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — cấu trúc để chèn <code>inputFocus</code> vào 58 ô nhập mà không sao chép chuỗi bảy lần.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — Motion: the guard actually is complete|||9.5 — Chuyển động: lưới chắn THẬT SỰ đầy đủ',
      slug: 'tw-9-5-chuyen-dong',
      type: 'VIDEO',
      description: 'Chín khối `prefers-reduced-motion: reduce` trong globals.css chắn từng animation ambient một. Bài này đọc từng khối, đối chiếu với 675 lượt `animate-*` trong .tsx, và tìm ra cái duy nhất còn hở — trong Notes, nơi Chương 2 cho biết luật khác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Motion: the guard actually is complete</h2>
<p class="lead">Reduced-motion respect is a WCAG requirement, and it is exactly the kind of thing an audit tool can only tell you is <em>probably</em> in place. This lesson closes it by matching every animation in this codebase against the CSS blocks that turn it off, and by naming the one gap that the check does not close.</p>

<h3>The animations declared, and where they run</h3>
<div class="out">tailwind.config.ts / animation:  13 khai bao
   fade-in, slide-up, slide-down, float, glow, pulse-slow,
   aurora-drift-slow, aurora-drift-slower, shimmer-sweep,
   caret-blink, scroll-cue-pulse, reel-spin, projector-pulse
</div>

<div class="out">luot dung animate-* trong .tsx     : 675
   animate-spin                  551      &lt;- Lucide Loader2, HandThumbUp v.v.
   animate-pulse                 102      &lt;- Tailwind mac dinh
   animate-ping                    7
   animate-none                    5
   animate-aurora-drift-slow       4
   animate-aurora-drift-slower     2
   animate-projector-pulse         1
   animate-reel-spin (ngam)       nhieu   &lt;- ap qua CSS, khong qua Tailwind
   animate-levelup, laser-complete 3      &lt;- animation cua tinh nang cu the
</div>

<p>The first three — <code>animate-spin</code>, <code>animate-pulse</code>, <code>animate-ping</code> — are <em>infrastructure</em>. Users only see them while the machine is busy (a loading spinner, a pulsing dot while data is fetched). They are short, purposeful, and <em>NOT</em> on the list of things to suppress — stopping the spinner while the machine waits on the network is worse for someone with vestibular disorders, because they will assume the machine has frozen.</p>

<h3>Ambient motion — what SHOULD be suppressed</h3>
<p>The other seven animations (aurora-drift-slow/slower, shimmer-sweep, caret-blink, scroll-cue-pulse, reel-spin, projector-pulse) run for NO reason — they are decorative background detail. For those, WCAG 2.3.3 &quot;Animation from Interactions&quot; recommends the user be able to switch them off, and <code>@media (prefers-reduced-motion: reduce)</code> is the standard mechanism.</p>

<h3>Reading the 9 suppression blocks in globals.css</h3>
<pre><code class="language-python"># dem theo KHOP NGOAC, khong theo dong (bai hoc tu bai 7.1)
for m in re.finditer(r'@media \\(prefers-reduced-motion: reduce\\)\\s*\\{', css):
    i = m.end(); depth = 1
    while depth:
        i += 1
        if css[i-1] == '{': depth += 1
        elif css[i-1] == '}': depth -= 1
    body = css[m.end():i-1]
    selectors = re.findall(r'([^{}\\n][^{}]*)\\{', body)
</code></pre>

<div class="out">9 khoi @media (prefers-reduced-motion: reduce):
   dong  344    .skeleton-shimmer::after
   dong 2509    .animate-aurora-drift-slow, .animate-aurora-drift-slower,
                .shimmer-track::after, .scroll-cue, .hero-caret,
                .eyebrow-chip .dot, .noise-overlay::after, .film-grain::after,
                .animate-reel-spin, .animate-projector-pulse
                .premium-tilt (transform: none)
                .reel-spin      (animation: none)
   dong 3214    .flashcard (flip animation)
   dong 3370    .shimmer
   dong 3573    .exphub-blob-a, .exphub-blob-b
   dong 3684    #app-splash img, #app-splash .app-splash__bar::after
   dong 3778    html.chrome-hidden .app-top-nav, ...bottom-nav (nav slide)
   dong 3786    .ptr-panda (pull-to-refresh)
   dong 4395    .chat-studio *, .chat-studio *::before, .chat-studio *::after (dap dai tra)
</div>

<div class="callout ok">
<p><strong>All seven ambient animations DECLARED in the config are suppressed.</strong> The large block at line 2509 (seven selectors plus <code>.reel-spin</code> + <code>.animate-projector-pulse</code>) covers exactly the list that needs suppressing. <code>caret-blink</code> is suppressed through the <code>.hero-caret</code> selector (the only place that uses it). Beyond Tailwind, the plain-CSS animations — flashcard, shimmer, exphub blob, app-splash, pull-to-refresh — each get their own suppression block, scoped appropriately.</p>
</div>

<h3>A measurement I GOT WRONG — told in full</h3>
<p>On my first pass I grepped <em>at the element level</em> — <code>grep -c 'motion-reduce:' src</code> — and got 10 uses for 13 animations. I nearly wrote &quot;this repo does NOT guard motion&quot;. That was a false alarm:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">I assumed</span><span class="lz-d">the guard lived in a <em>utility Tailwind</em> <code>motion-reduce:animate-none</code> attached to the element itself. Tailwind's documentation presents it that way, so it sounded reasonable.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">I overlooked</span><span class="lz-d">that it could equally live in <em>ordinary CSS</em> — one <code>@media (prefers-reduced-motion: reduce) { .animate-aurora-drift-slow { animation: none } }</code> block gathering many selectors in <em>one</em> place.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">this repo chose the SECOND WAY</span><span class="lz-d">— and it is the BETTER one: centralised suppression in one file can be audited in a single read, whereas <code>motion-reduce:</code> scattered through .tsx files has to be grepped in full at every review.</span></div>
</div>

<p>I nearly turned a GOOD design decision into a WCAG failure in the lesson. Cross-checking by reading the <code>@media</code> blocks, rather than counting utilities in JSX, is the only way not to be fooled.</p>

<h3>The one remaining GAP</h3>
<div class="out">.chat-studio * { animation: none; transition: none; ... }   &lt;- khoi 4395
</div>

<p>The last block uses <code>* { animation: none !important }</code> — the sledgehammer that clears everything in that region. Good for the chat area, but it is also the only one NOT present in the Notes region. Chapter 2 measured this: <code>notes-theme-root</code> is the exception to <code>dark:</code>, and it is the exception for <em>several</em> other effects too. If somebody adds an ambient animation inside Notes, no suppression block covers it automatically. It has not happened yet — I grepped and found nothing. But it is the one gap worth knowing about.</p>

<div class="callout warn">
<p><strong>Trap — using <code>* { animation: none !important }</code> at the scope of <code>html</code>.</strong> It sounds like a solution of dubious appetite — suppress EVERYTHING. It would also suppress <code>animate-spin</code>, and the spinner would freeze while the machine waits on the network. Right for chat-studio, because chat-studio has NO spinner; wrong for the whole app.</p>
</div>

<h3>What about motion-driven libraries?</h3>
<pre><code class="language-tsx">// framer-motion, dung o vai cho
useReducedMotion()   // -&gt; true khi user co bat
</code></pre>

<div class="out">grep -c 'useReducedMotion' src/**/*.tsx   :  0
grep -c 'framer-motion' src/**/*.tsx     : 34   (34 file dung, khong ai kiem tra)
</div>

<p>This repo uses <code>framer-motion</code> in 34 files — <code>motion.div</code>, enter/exit animations when a modal opens, page transitions. NOWHERE does it call <code>useReducedMotion()</code>. In most cases that is fine — these animations are short (150-400ms) and meaningful (they tell the user a modal just opened). But if somebody adds an infinitely looping <code>motion.div</code> , nothing switches it off automatically.</p>

<div class="pitfall">
<p><strong>Trap — believing that &quot;we use framer-motion, and framer-motion respects prefers-reduced-motion on its own&quot;.</strong> Wrong. Framer only supplies the <em>tool</em> (<code>useReducedMotion</code>) so that you can CHECK and DECIDE for yourself — it does not disable your animations on your behalf. If you write an infinite <code>animate={{ opacity: [0, 1] }}</code> , it will run forever whether <code>prefers-reduced-motion</code> is on or off.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The seven ambient animations in <code>tailwind.config.ts</code> are all suppressed by <code>@media (prefers-reduced-motion: reduce)</code> blocks in globals.css — and my initial element-level measurement reporting &quot;NOT SUPPRESSED&quot; was wrong, because the repo suppresses CENTRALLY in CSS rather than scattering utilities through JSX; the real remaining gap is the 34 files using <code>framer-motion</code> where nobody calls <code>useReducedMotion</code>, plus the possibility that someone adds an animation inside Notes with no suppression block covering it automatically.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG 2.2 — 2.3.3 Animation from Interactions</span><span class="lc-sub">w3.org/WAI/WCAG22/Understanding/animation-from-interactions — người dùng must tắt được animation phi thiết yếu. Bảy animation ambient của kho này rơi vào định nghĩa &quot;phi thiết yếu&quot;.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — prefers-reduced-motion</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — cách trình duyệt phơi sở thích, và cả <code>reduce</code> lẫn <code>no-preference</code> là gì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Framer Motion — useReducedMotion</span><span class="lc-sub">framer.com/motion/use-reduced-motion — hook cần gọi ở 34 file để đóng lỗ hổng còn lại.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 2 — variants and the Notes region</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — cấu trúc CSS lồng nhau ở vùng Notes, và vì sao nó là where duy nhất mà lưới chắn ambient KHÔNG tự động phủ.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Chuyển động: lưới chắn THẬT SỰ đầy đủ</h2>
<p class="lead">Tôn trọng chuyển động giảm là một yêu cầu của WCAG, và nó thuộc đúng loại việc mà một công cụ soát chỉ có thể cho bạn biết là <em>có lẽ</em> đang có. Bài này khép nó lại bằng cách đối chiếu từng animation trong kho này với các khối CSS tắt chúng, và bằng cách gọi tên chỗ hở duy nhất mà phép kiểm KHÔNG khép được.</p>

<h3>Các animation được khai, và chúng chạy ở đâu</h3>
<div class="out">tailwind.config.ts / animation:  13 khai bao
   fade-in, slide-up, slide-down, float, glow, pulse-slow,
   aurora-drift-slow, aurora-drift-slower, shimmer-sweep,
   caret-blink, scroll-cue-pulse, reel-spin, projector-pulse
</div>

<div class="out">luot dung animate-* trong .tsx     : 675
   animate-spin                  551      &lt;- Lucide Loader2, HandThumbUp v.v.
   animate-pulse                 102      &lt;- Tailwind mac dinh
   animate-ping                    7
   animate-none                    5
   animate-aurora-drift-slow       4
   animate-aurora-drift-slower     2
   animate-projector-pulse         1
   animate-reel-spin (ngam)       nhieu   &lt;- ap qua CSS, khong qua Tailwind
   animate-levelup, laser-complete 3      &lt;- animation cua tinh nang cu the
</div>

<p>Ba dòng đầu — <code>animate-spin</code>, <code>animate-pulse</code>, <code>animate-ping</code> — là <em>hạ tầng</em>. Người dùng chỉ thấy chúng khi máy đang bận (spinner tải, chấm điểm nhấp nháy trong khi lấy dữ liệu). Chúng ngắn, có mục đích, và <em>không</em> nằm trong danh sách cần chặn — chặn spinner khi máy đang chờ mạng là tệ hơn cho người bị chóng mặt tiền đình, vì họ sẽ tưởng máy đã đơ.</p>

<h3>Chuyển động NỀN — cái ĐÁNG chặn</h3>
<p>Bảy animation còn lại (aurora-drift-slow/slower, shimmer-sweep, caret-blink, scroll-cue-pulse, reel-spin, projector-pulse) chạy KHÔNG có lý do — chúng là chi tiết nền thẩm mỹ. Với chúng, WCAG 2.3.3 &quot;Animation from Interactions&quot; khuyến nghị người dùng phải tắt được, và <code>@media (prefers-reduced-motion: reduce)</code> là cơ chế chuẩn.</p>

<h3>Đọc 9 khối chặn trong globals.css</h3>
<pre><code class="language-python"># dem theo KHOP NGOAC, khong theo dong (bai hoc tu bai 7.1)
for m in re.finditer(r'@media \\(prefers-reduced-motion: reduce\\)\\s*\\{', css):
    i = m.end(); depth = 1
    while depth:
        i += 1
        if css[i-1] == '{': depth += 1
        elif css[i-1] == '}': depth -= 1
    body = css[m.end():i-1]
    selectors = re.findall(r'([^{}\\n][^{}]*)\\{', body)
</code></pre>

<div class="out">9 khoi @media (prefers-reduced-motion: reduce):
   dong  344    .skeleton-shimmer::after
   dong 2509    .animate-aurora-drift-slow, .animate-aurora-drift-slower,
                .shimmer-track::after, .scroll-cue, .hero-caret,
                .eyebrow-chip .dot, .noise-overlay::after, .film-grain::after,
                .animate-reel-spin, .animate-projector-pulse
                .premium-tilt (transform: none)
                .reel-spin      (animation: none)
   dong 3214    .flashcard (flip animation)
   dong 3370    .shimmer
   dong 3573    .exphub-blob-a, .exphub-blob-b
   dong 3684    #app-splash img, #app-splash .app-splash__bar::after
   dong 3778    html.chrome-hidden .app-top-nav, ...bottom-nav (nav slide)
   dong 3786    .ptr-panda (pull-to-refresh)
   dong 4395    .chat-studio *, .chat-studio *::before, .chat-studio *::after (dap dai tra)
</div>

<div class="callout ok">
<p><strong>Bảy animation ambient KHAI trong config đều được chặn.</strong> Khối lớn ở dòng 2509 (bảy selector + <code>.reel-spin</code> + <code>.animate-projector-pulse</code>) phủ đúng danh sách cần chặn. <code>caret-blink</code> chặn qua selector <code>.hero-caret</code> (nơi duy nhất dùng nó). Ngoài Tailwind, các animation CSS thuần — flashcard, shimmer, exphub blob, app-splash, pull-to-refresh — mỗi cái có khối chặn riêng, phù hợp phạm vi.</p>
</div>

<h3>Phép đo TÔI đã LÀM SAI — kể lại đầy đủ</h3>
<p>Trong lượt soát đầu tôi grep <em>ở cấp phần tử</em> — <code>grep -c 'motion-reduce:' src</code> — và ra 10 lượt cho 13 animation. Tôi suýt viết &quot;kho này KHÔNG bảo vệ chuyển động&quot;. Đó là báo động sai:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">tôi giả định</span><span class="lz-d">rằng lưới chắn nằm ở <em>utility Tailwind</em> <code>motion-reduce:animate-none</code> gắn trên chính phần tử. Tài liệu Tailwind trình bày cách đó nên nó nghe hợp lý.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">tôi bỏ qua</span><span class="lz-d">rằng nó cũng có thể ở <em>CSS thường</em> — một khối <code>@media (prefers-reduced-motion: reduce) { .animate-aurora-drift-slow { animation: none } }</code> gộp nhiều selector trong <em>một</em> chỗ.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">kho này chọn CÁCH THỨ HAI</span><span class="lz-d">— và nó ĐÚNG HƠN: chặn tập trung ở một file thì soát được trong một lượt đọc, còn <code>motion-reduce:</code> rải khắp .tsx thì phải grep hết mỗi lần review.</span></div>
</div>

<p>Tôi đã suýt biến một quyết định thiết kế TỐT thành một chỗ trượt WCAG trong bài học. Đối chiếu bằng cách đọc <code>@media</code> block, không bằng đếm utility trên JSX, là cách duy nhất KHÔNG bị đánh lừa.</p>

<h3>Chỗ duy nhất còn HỞ</h3>
<div class="out">.chat-studio * { animation: none; transition: none; ... }   &lt;- khoi 4395
</div>

<p>Khối cuối dùng <code>* { animation: none !important }</code> — cách gõ búa xoá tất cả trong vùng đó. Tốt cho vùng chat, nhưng đây cũng là cái duy nhất KHÔNG có trong vùng Notes. Chương 2 đã đo: <code>notes-theme-root</code> là ngoại lệ với <code>dark:</code>, và cũng là ngoại lệ cho <em>một số</em> hiệu ứng khác. Nếu ai đó thêm một animation ambient trong Notes, không có khối chặn nào phủ nó tự động. Chưa xảy ra — tôi grep xong không thấy. Nhưng đây là chỗ hở duy nhất cần biết.</p>

<div class="callout warn">
<p><strong>Bẫy — dùng <code>* { animation: none !important }</code> ở phạm vi <code>html</code>.</strong> Nghe như một giải pháp cỡ trứng vịt lộn — chặn TẤT. Nó sẽ chặn cả <code>animate-spin</code>, và spinner sẽ đứng im khi máy chờ mạng. Đúng cho chat-studio vì chat-studio KHÔNG có spinner; sai cho toàn app.</p>
</div>

<h3>Còn hàm dựa chuyển động?</h3>
<pre><code class="language-tsx">// framer-motion, dung o vai cho
useReducedMotion()   // -&gt; true khi user co bat
</code></pre>

<div class="out">grep -c 'useReducedMotion' src/**/*.tsx   :  0
grep -c 'framer-motion' src/**/*.tsx     : 34   (34 file dung, khong ai kiem tra)
</div>

<p>Kho này dùng <code>framer-motion</code> ở 34 file — <code>motion.div</code>, các animation vào-ra khi mở modal, các chuyển trang. KHÔNG chỗ nào gọi <code>useReducedMotion()</code>. Trong hầu hết trường hợp không sao — các animation này ngắn (150–400ms) và có nghĩa (báo cho người dùng biết modal vừa mở). Nhưng nếu ai đó thêm một <code>motion.div</code> lặp vô hạn, không có gì tắt nó tự động.</p>

<div class="pitfall">
<p><strong>Bẫy — nghĩ rằng &quot;chúng tôi dùng framer-motion, framer-motion tự tôn trọng prefers-reduced-motion&quot;.</strong> Sai. Framer chỉ cung cấp <em>công cụ</em> (<code>useReducedMotion</code>) để bạn KIỂM và tự QUYẾT — nó không tự tắt animation của bạn. Nếu bạn viết một <code>animate={{ opacity: [0, 1] }}</code> vô hạn, nó sẽ chạy vô hạn dù <code>prefers-reduced-motion</code> bật hay tắt.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Bảy animation ambient trong <code>tailwind.config.ts</code> đều được chặn bởi các khối <code>@media (prefers-reduced-motion: reduce)</code> trong globals.css — và một phép đo cấp-phần-tử của tôi ban đầu báo &quot;KHÔNG CHẶN&quot; đã sai vì kho chọn chặn TẬP TRUNG ở CSS chứ không rải utility trên JSX; chỗ hở thực sự còn lại là 34 file dùng <code>framer-motion</code> không ai gọi <code>useReducedMotion</code>, và một khả năng người ta có thể thêm animation vào Notes mà không có khối chặn nào tự động phủ.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG 2.2 — 2.3.3 Animation from Interactions</span><span class="lc-sub">w3.org/WAI/WCAG22/Understanding/animation-from-interactions — người dùng phải tắt được animation phi thiết yếu. Bảy animation ambient của kho này rơi vào định nghĩa &quot;phi thiết yếu&quot;.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — prefers-reduced-motion</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — cách trình duyệt phơi sở thích, và cả <code>reduce</code> lẫn <code>no-preference</code> là gì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Framer Motion — useReducedMotion</span><span class="lc-sub">framer.com/motion/use-reduced-motion — hook cần gọi ở 34 file để đóng lỗ hổng còn lại.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 2 — biến thể và vùng Notes</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — cấu trúc CSS lồng nhau ở vùng Notes, và vì sao nó là chỗ duy nhất mà lưới chắn ambient KHÔNG tự động phủ.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.6 ─────────────────────────── */
    {
      title: '9.6 — Chapter 9 quiz|||9.6 — Kiểm tra Chương 9',
      slug: 'tw-9-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu, mười hai phút. Về trợ năng: tương phản trên bảng màu THẬT, sự cố 1,16 và cơ chế tự thi hành, 326 lớp phân giải thành không gì, 72 vòng focus bị gỡ, và cách lưới chắn chuyển động của kho này thật sự hoạt động.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>What Chapter 9 measured</h2>
<p class="lead">Eight questions, twelve minutes. Every number here comes straight from THIS repo — not from the documentation, and not from a sample project.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">9.1 — the failure that fits in one token</span><span class="lz-lnote">of 12 real text-on-background pairs, 3 fail AA. All three are <code>--text-muted</code> — the ONLY text token holding the same hex in both themes. 2.537 uses, fixed by changing 2 lines</span></div>
<div class="lz-layer"><span class="lz-lname">9.2 — the 1,16 incident</span><span class="lz-lnote">near-black text on a fixed dark surface, 142 files / 622 uses. The fix re-declares the theme variables on the dark surfaces themselves — self-enforcing, blast radius zero</span></div>
<div class="lz-layer"><span class="lz-lname">9.3 — the wider hunt</span><span class="lz-lnote">326 static class tokens (0,28%) resolve to nothing. 90% concentrate in three buckets: dead alpha (81), a token that never existed (76), missing plugin (13)</span></div>
<div class="lz-layer"><span class="lz-lname">9.4 — focus rings</span><span class="lz-lnote">526 outline-none uses, 86% replace the ring. 72 do not, and 58 of those are input/textarea/select — the places keyboard users need it</span></div>
<div class="lz-layer"><span class="lz-lname">9.5 — motion, corrected</span><span class="lz-lnote">7 ambient animations all guarded, in 9 <code>@media (prefers-reduced-motion: reduce)</code> blocks. My element-level grep reported NO GUARDS — false alarm, and worth keeping in the record</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Chương 9 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Mọi con số ở đây rút thẳng từ CHÍNH kho này — không phải từ tài liệu, và không phải từ một dự án mẫu.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">9.1 — chỗ hỏng gói trong một token</span><span class="lz-lnote">trong 12 cặp chữ-trên-nền thật, 3 cái trượt AA. Cả ba đều là <code>--text-muted</code> — token chữ DUY NHẤT giữ cùng mã hex ở hai theme. 2.537 lượt dùng, sửa bằng cách đổi 2 dòng</span></div>
<div class="lz-layer"><span class="lz-lname">9.2 — sự cố 1,16</span><span class="lz-lnote">chữ gần-đen trên nền tối cố định, 142 file / 622 lượt. Bản vá khai lại các biến theme ngay trên các bề mặt tối — tự thi hành, phạm vi ảnh hưởng KHÔNG</span></div>
<div class="lz-layer"><span class="lz-lname">9.3 — cuộc soát rộng hơn</span><span class="lz-lnote">326 lớp tĩnh (0,28%) phân giải thành không gì. 90% tập trung ở ba nhóm: alpha chết (81), một token chưa bao giờ tồn tại (76), thiếu plugin (13)</span></div>
<div class="lz-layer"><span class="lz-lname">9.4 — vòng focus</span><span class="lz-lnote">526 lượt outline-none, 86% có vẽ lại. 72 cái không, và 58 trong 72 là input/textarea/select — đúng chỗ người dùng bàn phím cần</span></div>
<div class="lz-layer"><span class="lz-lname">9.5 — chuyển động, đã sửa</span><span class="lz-lnote">7 animation ambient đều được chắn, trong 9 khối <code>@media (prefers-reduced-motion: reduce)</code>. Grep cấp-phần-tử của tôi báo KHÔNG CÓ LƯỚI — báo động sai, đáng giữ trong hồ sơ</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Of twelve tested text-on-background combinations in this palette, three fail WCAG AA. Which pattern do they share?|||Trong mười hai tổ hợp chữ-trên-nền đã kiểm của bảng màu này, ba cái trượt AA. Chúng có ĐIỂM CHUNG gì?',
            options: [
              'They are all uses of <code>--text-muted</code>, the ONE text token holding the same hex in both themes — so it cannot have been tuned for both, and it fails on the harder background of each|||Tất cả đều là <code>--text-muted</code>, TOKEN CHỮ duy nhất giữ cùng mã hex ở cả hai theme — nên nó không thể đã được tinh chỉnh cho cả hai, và trượt trên nền khó hơn của mỗi bên',
              'They are all in the dark theme, because dark backgrounds always fail contrast|||Tất cả đều ở theme tối, vì nền tối luôn trượt tương phản',
              'They all involve arbitrary hex colours, not tokens|||Tất cả đều dùng mã hex tuỳ ý, không phải token',
              'They are all under 12px, and WCAG never grants small text a pass|||Tất cả đều dưới 12px, và WCAG không bao giờ cho chữ nhỏ đạt',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The fix for the failing <code>--text-muted</code> touches how many <code>.tsx</code> files, and why?|||Bản vá cho <code>--text-muted</code> trượt chuẩn đụng bao nhiêu file <code>.tsx</code>, và vì sao?',
            options: [
              'Zero — every one of the 2.537 call sites reads <code>var(--text-muted)</code>, so changing two lines in <code>globals.css</code> reaches all of them. Chapter 6&#39;s variable mechanism collecting its dividend|||KHÔNG — mỗi trong 2.537 chỗ gọi đều đọc <code>var(--text-muted)</code>, nên đổi hai dòng trong <code>globals.css</code> tới hết. Cơ chế biến của Chương 6 thu lãi',
              '2.537 — every call site needs a new class name|||2.537 — mỗi chỗ gọi cần một tên lớp mới',
              '48 — one per file that uses the token|||48 — mỗi file dùng token cần một sửa',
              'Only the config file needs to change|||Chỉ file config phải đổi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The 08/08/2026 &quot;1,16 incident&quot; put near-black text on a fixed dark surface across 142 files. Why is the fix NOT &quot;edit 142 files&quot;?|||Sự cố &quot;1,16&quot; ngày 08/08/2026 đặt chữ gần-đen trên nền tối cố định trải 142 file. Vì sao bản vá KHÔNG phải &quot;sửa 142 file&quot;?',
            options: [
              'Because the fix RE-DECLARES the theme variables on the dark-surface selectors themselves — so any future use of <code>bg-darkbg</code> automatically gets a readable palette, with zero blast radius on the working dark theme|||Vì bản vá KHAI LẠI các biến theme ngay trên chính các selector bề mặt tối — nên mọi lượt dùng <code>bg-darkbg</code> tương lai tự có bảng màu đọc được, không ảnh hưởng gì lên theme tối đang chạy',
              'Because ESLint enforces the rule at commit time|||Vì ESLint áp quy tắc lúc commit',
              'Because Prisma migrates 142 files atomically|||Vì Prisma di trú 142 file như một khối',
              'Because <code>!important</code> was added to the text colour utility|||Vì <code>!important</code> đã được thêm vào tiện ích màu chữ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The wider audit found 326 static tokens with no matching rule — 0,28% of all class tokens. Why does the small percentage still matter?|||Cuộc soát rộng tìm được 326 token tĩnh không có quy tắc khớp — 0,28% tổng số. Vì sao con số nhỏ vẫn đáng quan tâm?',
            options: [
              'Because 90% concentrate in three buckets — dead alpha modifiers, a token that never existed, missing plugin classes — each a defect spread across many files with NO signal to respond to|||Vì 90% tập trung ở ba nhóm — bổ từ độ mờ chết, một token chưa bao giờ tồn tại, các lớp cần plugin không cài — mỗi cái là một khiếm khuyết trải nhiều file mà KHÔNG có tín hiệu nào để đáp lại',
              'Because 0,28% means 300+ TypeScript compile errors|||Vì 0,28% có nghĩa là 300+ lỗi biên dịch TypeScript',
              'Because Tailwind cannot generate more than 3.683 utilities|||Vì Tailwind không sinh nổi quá 3.683 tiện ích',
              'Because ESLint blocks any push over 0,1%|||Vì ESLint chặn mọi push vượt 0,1%',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A first audit missed <code>shadow-[0_24px_80px_rgba(0,0,0,0.6)]</code> — it was actually built. What did the audit script get wrong?|||Lượt soát đầu bỏ qua <code>shadow-[0_24px_80px_rgba(0,0,0,0.6)]</code> — thật ra nó CÓ được dựng. Script đã sai chỗ nào?',
            options: [
              'It read the selector <em>escaped</em> — Tailwind writes <code>\\2c </code> (six characters) for a comma, so an audit that does not unescape those thinks every arbitrary shadow is missing|||Nó đọc selector đang <em>thoát</em> — Tailwind ghi <code>\\2c </code> (sáu ký tự) cho một dấu phẩy, nên phép soát nào không gỡ thoát sẽ tưởng mọi shadow tuỳ ý đều thiếu',
              'It searched only <code>.tsx</code> files, not <code>.ts</code>|||Nó chỉ tìm file <code>.tsx</code>, không tìm <code>.ts</code>',
              'It missed dynamic className strings|||Nó bỏ qua các chuỗi className động',
              'It ran against a stale build of <code>out.css</code>|||Nó chạy trên một bản dựng cũ của <code>out.css</code>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Of 526 <code>outline-none</code> uses, 86% replace the ring and 72 do not. Which type of element is the concentration of the 72?|||Trong 526 lượt <code>outline-none</code>, 86% có vẽ lại vòng và 72 không. Nhóm 72 tập trung ở LOẠI phần tử nào?',
            options: [
              'Input elements — 39 <code>input</code>, 13 <code>textarea</code>, 6 <code>select</code>, one Command.Input. 58 of 72 are exactly the places keyboard users need to see focus|||Ô nhập — 39 <code>input</code>, 13 <code>textarea</code>, 6 <code>select</code>, một Command.Input. 58 trên 72 đúng chỗ người dùng bàn phím cần thấy vòng focus',
              'Buttons — because designers dislike the browser&#39;s default ring on buttons|||Nút — vì thiết kế không thích vòng mặc định của trình duyệt trên nút',
              'Icons and decorative <code>div</code>s|||Icon và <code>div</code> trang trí',
              'Modal wrappers — because modals steal focus programmatically|||Wrapper modal — vì modal đoạt focus bằng mã',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A grep for <code>motion-reduce:</code> on <code>.tsx</code> files returned only 10 uses. Why is that not evidence the repo ignores reduced-motion?|||Grep <code>motion-reduce:</code> trên file <code>.tsx</code> chỉ ra 10 lượt. Vì sao đó KHÔNG là bằng chứng kho này bỏ qua chuyển động giảm?',
            options: [
              'Because the guard lives in CSS — 9 <code>@media (prefers-reduced-motion: reduce)</code> blocks in <code>globals.css</code> that together cover every ambient animation. Centralised guarding is auditable in one read, unlike utilities scattered across .tsx|||Vì lưới chắn nằm ở CSS — 9 khối <code>@media (prefers-reduced-motion: reduce)</code> trong <code>globals.css</code> phủ hết mọi animation ambient. Chắn tập trung soát được trong một lượt đọc, không như utility rải khắp .tsx',
              'Because Tailwind auto-injects the guards at build time|||Vì Tailwind tự chèn lưới chắn lúc dựng',
              'Because <code>animate-spin</code> and <code>animate-pulse</code> are the only animations that matter|||Vì <code>animate-spin</code> và <code>animate-pulse</code> là animation duy nhất đáng kể',
              'Because the browser respects the preference regardless of code|||Vì trình duyệt tôn trọng sở thích bất kể mã nào',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which of these accessibility measures is HARDEST to audit statically in this codebase?|||Trong các phép đo trợ năng dưới đây, cái nào KHÓ soát tĩnh nhất trong kho này?',
            options: [
              'Whether <code>framer-motion</code> callers respect reduced motion — 34 files import it but <code>useReducedMotion</code> is never called, and a static grep cannot tell whether any given <code>motion.div</code> is infinite or one-shot|||Người gọi <code>framer-motion</code> có tôn trọng chuyển động giảm không — 34 file import nó nhưng <code>useReducedMotion</code> không được gọi, và grep tĩnh không phân biệt được một <code>motion.div</code> là vô hạn hay một-lần',
              'Whether <code>--text-muted</code> passes AA — that&#39;s just arithmetic on hex values|||<code>--text-muted</code> có đạt AA không — chỉ là số học trên hex',
              'Whether <code>bg-bg-elevated</code> exists — grep for <code>--bg-elevated</code>|||<code>bg-bg-elevated</code> có tồn tại không — grep <code>--bg-elevated</code>',
              'Whether the dark-hex guard list is complete — the audit is a simple set difference|||Danh sách chắn hex tối có đầy đủ không — phép soát là một hiệu tập hợp đơn',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
