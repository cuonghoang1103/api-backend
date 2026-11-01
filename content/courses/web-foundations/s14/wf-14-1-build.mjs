/**
 * Bài 14.1 — Bản dựng production thật ra làm gì (nâng cấp 01/11/2026). Output: Vite 8.3.5 / Node 22.23.3 + Chromium (Playwright),
 * chạy thật trong _demo/_t14. Deck: scripts/slides-src/wf-14-1.mjs (11 slide).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-14-1', 'What a production build does', 'Bản dựng production làm gì', [
  [1, 'What a production build does',
    '<p>This chapter is about the last step: getting your site onto the internet. It starts with a question beginners rarely ask — the files you edit are not the files your users download. Something transforms them in between. That something is the build.</p>',
    '<p>Chương này nói về bước cuối: đưa trang web lên Internet. Nó bắt đầu bằng một câu người mới hiếm khi hỏi — file bạn sửa không phải file người dùng tải về. Có một thứ biến đổi chúng ở giữa. Thứ đó là bản dựng (build).</p>'],
  [2, 'After this lesson you can…',
    '<p>Five skills: knowing what development and production modes are for, running a build and reading its size report, naming the four jobs a build does, previewing the result before deploying, and keeping the output out of git.</p>',
    '<p>Năm kỹ năng: biết chế độ phát triển và production dùng để làm gì, chạy build và đọc báo cáo dung lượng, gọi tên bốn việc một bản dựng làm, xem trước kết quả trước khi deploy, và giữ đầu ra ngoài git.</p>'],
  [3, 'Development vs production',
    '<p>The same tiny page, measured in Chromium. Served by the development server it needed six requests and about 225 KB, because it ships the hot-reload client and every module separately. The built version needed three requests and 1.4 KB. Development is optimised for you; production for your users.</p>',
    '<p>Cùng một trang nhỏ, đo trong Chromium. Do máy chủ phát triển phục vụ, nó cần sáu request và khoảng 225 KB, vì gửi kèm client nạp lại nóng và từng module riêng lẻ. Bản đã dựng cần ba request và 1,4 KB. Chế độ phát triển tối ưu cho bạn; production tối ưu cho người dùng.</p>'],
  [4, 'The project',
    '<p>A small Vite project: a page, a stylesheet, and two JavaScript modules. Three details matter for later: a log that should exist only in development, a public setting read from the environment, and an exported function that nothing uses.</p>',
    '<p>Một dự án Vite nhỏ: một trang, một stylesheet và hai module JavaScript. Ba chi tiết quan trọng cho phần sau: một dòng log chỉ nên có khi phát triển, một cấu hình công khai đọc từ môi trường, và một hàm được export mà không ai dùng.</p>'],
  [5, 'vite build',
    '<p>One command. Vite transforms six modules and writes three files into <code>dist/</code>, reporting each size twice: raw, and after gzip compression, which is roughly what travels over the network. These numbers are the first thing to check when a page feels heavy.</p>',
    '<p>Một lệnh. Vite biến đổi sáu module và ghi ba file vào <code>dist/</code>, báo mỗi dung lượng hai lần: thô, và sau khi nén gzip — gần với những gì thật sự đi qua mạng. Những con số này là thứ đầu tiên cần xem khi một trang có cảm giác nặng.</p>'],
  [6, 'Inside dist/',
    '<p>The HTML was rewritten to point at the new files. All JavaScript became one file whose name contains a hash of its content. Files in <code>public/</code> are copied unchanged. This folder is what you upload to a host.</p>',
    '<p>HTML được viết lại để trỏ tới các file mới. Toàn bộ JavaScript thành một file có tên chứa mã băm nội dung. File trong <code>public/</code> được chép nguyên. Thư mục này là thứ bạn tải lên máy chủ.</p>'],
  [7, 'Minified and tree-shaken',
    '<p>The end of the bundle is our own code, minified: <code>formatVnd</code> became <code>e</code>. Searching the bundle proves two removals — the unused function and the development log are gone — and two inclusions: the public API address and, as a warning for the next lesson, a secret that should never have been there.</p>',
    '<p>Phần cuối bundle là code của ta, đã thu gọn: <code>formatVnd</code> thành <code>e</code>. Tìm trong bundle chứng minh hai thứ bị xoá — hàm không dùng và dòng log phát triển đã biến mất — và hai thứ được đưa vào: địa chỉ API công khai và, như một lời cảnh báo cho bài sau, một bí mật lẽ ra không bao giờ được có mặt.</p>'],
  [8, 'The four jobs',
    '<p>Bundle, minify, tree-shake and hash — each one visible in this real build. A build also replaces environment references with values and deletes development-only branches. Knowing these four words lets you read any bundler’s documentation.</p>',
    '<p>Đóng gói, thu gọn, rung cây và băm tên — mỗi việc đều thấy được trong bản dựng thật này. Build còn thay các tham chiếu tới biến môi trường bằng giá trị và xoá những nhánh chỉ dành cho phát triển. Biết bốn từ này là đọc được tài liệu của mọi bundler.</p>'],
  [9, 'Why hashed names',
    '<p>Because the name changes whenever the content changes, browsers may cache these files for a year without risk: a new deploy produces new names, and the new HTML points at them. That is why only the HTML must never be cached for long.</p>',
    '<p>Vì tên đổi mỗi khi nội dung đổi, trình duyệt có thể lưu đệm các file này cả năm mà không có rủi ro: lần deploy mới sinh tên mới, và HTML mới trỏ tới chúng. Đó là lý do chỉ riêng HTML là không được lưu đệm lâu.</p>'],
  [10, 'Build traps',
    '<p>Three classic mistakes: committing the build output, testing only in development mode, and opening the built HTML by double-clicking it. The fixes: ignore <code>dist/</code>, always preview the build, and serve it over HTTP.</p>',
    '<p>Ba lỗi kinh điển: commit đầu ra của build, chỉ test ở chế độ phát triển, và mở file HTML đã dựng bằng cách nhấp đúp. Cách sửa: bỏ qua <code>dist/</code>, luôn xem trước bản dựng, và phục vụ nó qua HTTP.</p>'],
  [11, 'Summary & practice',
    '<p>The practice asks you to prove each job with your own eyes: grep for the removed code, and watch which hash changes when you edit one file. After that, a build stops being a black box.</p>',
    '<p>Bài luyện yêu cầu bạn tận mắt chứng minh từng việc: grep tìm phần code bị xoá, và xem mã băm nào đổi khi bạn sửa một file. Sau đó, build không còn là hộp đen nữa.</p>'],
]);

export default {
  title: '14.1 — What a production build actually does|||14.1 — Bản dựng production thật ra làm gì',
  slug: 'wf-14-1-build',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Dev và production khác nhau (đo thật: 6 request 225 KB so với 3 request 1,4 KB), vite build và báo cáo dung lượng gzip, bên trong dist/, bốn việc của build (đóng gói, thu gọn, tree-shaking, băm tên) chứng minh bằng grep, vì sao tên có mã băm, preview, bẫy thường gặp.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>The files you write are not the files you ship</h2>
<p class="lead">After this lesson you can explain the difference between development mode and a production build, run a build and read its size report, name the four jobs a build performs — bundling, minification, tree-shaking and content hashing — and check its output before deploying. Why it matters: every framework you will use (React with Vite, Next.js, Angular) has a build step, every deployment runs it, and a large share of "it works on my machine but not in production" bugs live exactly in the gap between <code>npm run dev</code> and <code>npm run build</code>. Every number below was measured on a real Vite 8 project.</p>

<h3>Step 1 — development and production are optimised for different people</h3>
${ma('javascript', CODE['_t14/count.mjs'])}
${ra(OUT['_t14/out/dev-vs-build'])}
<p>The same page, loaded in Chromium from two different servers. The <strong>development server</strong> (<code>npm run dev</code>) sends every module as a separate, readable file plus a hot-reload client that updates the page the instant you save — six requests, about 225&nbsp;KB, perfect for you at your desk. The <strong>production build</strong> sends three small files totalling 1.4&nbsp;KB — perfect for a user on a phone. Never judge the speed of your site from development mode.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Development (npm run dev)</span><span class="v">Fast to <em>start</em> and update; readable code; error overlays; source maps; dev-only logs.</span></div>
  <div class="kv"><span class="k">Production (npm run build)</span><span class="v">Fast to <em>download</em> and run; few small files; no dev tools; names that let browsers cache aggressively.</span></div>
</div>

<h3>Step 2 — the project</h3>
${ma('html', CODE['_t14/index.html'])}
${ma('javascript', CODE['_t14/src/main.js'])}
${ma('javascript', CODE['_t14/src/format.js'])}
<p>Three details to watch: a <code>console.log</code> that only runs when <code>import.meta.env.DEV</code> is true; a public setting <code>VITE_API_URL</code> read from the environment (lesson 14.2); and <code>unusedReportGenerator</code>, exported but imported by nobody. The last lines of <code>main.js</code> contain a deliberate mistake that lesson 14.2 is about.</p>

<h3>Step 3 — run the build and read the report</h3>
${ra(OUT['_t14/out/build'])}
${ra(OUT['_t14/out/dist-files'])}
<p>Six source modules became three files. Each line of the report shows the raw size and the size after <strong>gzip</strong> compression — servers compress text before sending it, so the gzip column is close to what the network carries. The second listing shows what landed in <code>dist/</code>: the rewritten <code>index.html</code>, one CSS file and one JS file in <code>assets/</code> with a fingerprint in their names, and <code>robots.txt</code> copied unchanged from <code>public/</code>. <code>dist/</code> is the folder a host serves.</p>

<h3>Step 4 — look inside the bundle</h3>
${ra(OUT['_t14/out/bundle-grep'])}
<p>The end of the bundle is our code, unrecognisable at first sight but identical in behaviour. Read the search results:</p>
<ul>
<li><strong>Tree-shaking:</strong> <code>GENERATED_REPORT_MARKER</code> (inside the unused function) is not in the bundle — exports nobody imports are dropped.</li>
<li><strong>Dead-code removal:</strong> the <code>[dev] app started</code> log is gone. At build time <code>import.meta.env.DEV</code> became <code>false</code>, so the whole <code>if</code> block was deleted.</li>
<li><strong>Environment replacement:</strong> <code>import.meta.env.VITE_API_URL</code> was replaced by the literal text <code>https://api.ctshop.example</code>. The value is now <em>baked into</em> the file — changing it later requires a new build.</li>
<li><strong>A leak:</strong> <code>demo-secret-not-real-0001</code> is also in the bundle, readable by anyone who opens DevTools. Why, and how to prevent it, is lesson 14.2. <code>demo-password</code> (from <code>DATABASE_URL</code>, which has no <code>VITE_</code> prefix) is <em>not</em> there: <code>window.__dbUrl=void 0</code>.</li>
</ul>

<h3>The four jobs of a build</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bundle</span><span class="lz-d">Follow every <code>import</code> from the entry point and combine the modules into a few files. Fewer requests, less overhead.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tree-shake</span><span class="lz-d">Drop exports that nothing imports — the dead branches of the dependency "tree".</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Minify</span><span class="lz-d">Remove spaces and comments, shorten local names (<code>formatVnd</code> → <code>e</code>), fold constants (<code>450000</code> → <code>45e4</code>).</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hash</span><span class="lz-d">Name each file after a fingerprint of its content: <code>index-27wt_Xcd.js</code>. Same content ⇒ same name; any change ⇒ new name.</span></div>
</div>
<p>Why hashing? It lets a host tell browsers "keep this file for a year" (lesson 14.3). When you deploy a new version, the changed files get new names and the new <code>index.html</code> points at them, so users never get a stale script — while unchanged files keep their names and stay cached.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "it works in dev".</strong> Some bugs only exist after a build: code that relied on a dev-only global, a file imported with the wrong letter case (macOS forgives <code>./Format.js</code>, the Linux build server does not), an environment variable that was set on your machine but not on the host. Before every deploy run <code>npm run build &amp;&amp; npm run preview</code>, which serves <code>dist/</code> exactly as a host would, and click through the main pages.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — committing <code>dist/</code>, or opening it by double-click.</strong> Build output is generated: committing it creates huge diffs and merge conflicts, and it goes stale the moment someone forgets to rebuild. Put <code>dist</code> in <code>.gitignore</code> and let the deploy pipeline build. And double-clicking <code>dist/index.html</code> opens it as <code>file://</code>, where absolute paths like <code>/assets/…</code> and ES modules do not work — you see a blank page and think the build is broken. Serve it over HTTP (<code>npm run preview</code>).</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (20 minutes)</strong></p>
<p>Create a Vite project (<code>npm create vite@latest my-shop -- --template vanilla</code>, then <code>npm install</code>). Add a module that exports two functions and import only one; add <code>if (import.meta.env.DEV) console.log('DEV ONLY')</code>. Run <code>npm run build</code>, then <code>npm run preview</code> and open the page. Search the bundle: <code>grep -c "DEV ONLY" dist/assets/*.js</code>.</p>
<p><strong>Done when:</strong> the preview page works; the grep prints 0 for both the dev log and a marker string inside the unused function; <code>dist/</code> is listed in <code>.gitignore</code>; and after changing one line in <code>main.js</code> and rebuilding, the JS file name changed while the CSS file name stayed the same. Code Lab module 14.1 checks your understanding of each job with a small simulated bundler.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">build / production build</span><span class="v">bản dựng — biến mã nguồn thành file để phát hành.</span></div>
  <div class="kv"><span class="k">dev server</span><span class="v">máy chủ phát triển — phục vụ code khi đang làm, có nạp lại nóng.</span></div>
  <div class="kv"><span class="k">bundle / bundler</span><span class="v">gói / công cụ đóng gói (Vite, webpack, esbuild…).</span></div>
  <div class="kv"><span class="k">minify</span><span class="v">thu gọn — bỏ khoảng trắng, rút tên biến.</span></div>
  <div class="kv"><span class="k">tree-shaking</span><span class="v">rung cây — bỏ phần export không ai dùng.</span></div>
  <div class="kv"><span class="k">content hash</span><span class="v">mã băm nội dung — dấu vân tay trong tên file.</span></div>
  <div class="kv"><span class="k">gzip</span><span class="v">nén — máy chủ nén chữ trước khi gửi.</span></div>
  <div class="kv"><span class="k">preview</span><span class="v">xem trước — phục vụ dist/ như máy chủ thật trên máy bạn.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Development mode is optimised for the developer (measured: 6 requests, 225&nbsp;KB); production for the user (3 requests, 1.4&nbsp;KB).</li>
  <li><code>npm run build</code> writes <code>dist/</code>; read the gzip column of the report.</li>
  <li>A build bundles, tree-shakes, minifies and hashes — and replaces <code>import.meta.env.*</code> with values.</li>
  <li>Hashed names make long caching safe; only the HTML must stay uncached.</li>
  <li>Preview the build over HTTP before deploying; never commit <code>dist/</code>.</li>
</ul>
${nguon('📗', 'Vite — Building for Production', 'What vite build does, and how to configure it', 'https://vite.dev/guide/build.html')}
${nguon('📘', 'MDN — Tree shaking', 'A short glossary entry with the ES module reasoning behind it', 'https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking')}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-20-1-build-vs-start', title: 'Next.js 20.1 — what deploying means: build vs start', sub: 'The same split in a framework with a server', cta: 'Open lesson' })}
${lienKet({ khoa: 'deploy-vps', bai: 'deploy-1-3-tao-tac-phai-dung', title: 'Deploy 1.3 — when the artifact must be BUILT', sub: 'Where the build runs in a real pipeline, and why it must be reproducible', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>File bạn viết không phải file bạn phát hành</h2>
<p class="lead">Học xong bài này bạn giải thích được khác biệt giữa chế độ phát triển và bản dựng production, chạy build và đọc báo cáo dung lượng, gọi tên bốn việc một bản dựng làm — đóng gói, thu gọn, tree-shaking và băm tên theo nội dung — và kiểm đầu ra trước khi deploy. Vì sao cần: mọi framework bạn sẽ dùng (React với Vite, Next.js, Angular) đều có bước build, mọi lần deploy đều chạy nó, và rất nhiều bug "máy tôi chạy được mà production thì không" sống đúng ở khoảng giữa <code>npm run dev</code> và <code>npm run build</code>. Mọi con số dưới đây đo trên một dự án Vite 8 thật.</p>

<h3>Bước 1 — phát triển và production tối ưu cho hai nhóm người khác nhau</h3>
${ma('javascript', CODE['_t14/count.mjs'])}
${ra(OUT['_t14/out/dev-vs-build'])}
<p>Cùng một trang, tải trong Chromium từ hai máy chủ khác nhau. <strong>Máy chủ phát triển</strong> (<code>npm run dev</code>) gửi từng module thành file riêng, dễ đọc, kèm client nạp lại nóng cập nhật trang ngay khi bạn lưu — sáu request, khoảng 225&nbsp;KB, hoàn hảo cho bạn khi ngồi code. <strong>Bản dựng production</strong> gửi ba file nhỏ tổng 1,4&nbsp;KB — hoàn hảo cho người dùng trên điện thoại. Đừng bao giờ đánh giá tốc độ trang web của bạn từ chế độ phát triển.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Phát triển (npm run dev)</span><span class="v">Nhanh để <em>khởi động</em> và cập nhật; code dễ đọc; lớp phủ báo lỗi; source map; log chỉ dành cho dev.</span></div>
  <div class="kv"><span class="k">Production (npm run build)</span><span class="v">Nhanh để <em>tải</em> và chạy; ít file nhỏ; không công cụ dev; tên file cho phép trình duyệt lưu đệm mạnh tay.</span></div>
</div>

<h3>Bước 2 — dự án</h3>
${ma('html', CODE['_t14/index.html'])}
${ma('javascript', CODE['_t14/src/main.js'])}
${ma('javascript', CODE['_t14/src/format.js'])}
<p>Ba chi tiết cần để ý: một <code>console.log</code> chỉ chạy khi <code>import.meta.env.DEV</code> là true; một cấu hình công khai <code>VITE_API_URL</code> đọc từ môi trường (bài 14.2); và <code>unusedReportGenerator</code>, được export nhưng không ai import. Mấy dòng cuối <code>main.js</code> chứa một lỗi cố ý — chủ đề của bài 14.2.</p>

<h3>Bước 3 — chạy build và đọc báo cáo</h3>
${ra(OUT['_t14/out/build'])}
${ra(OUT['_t14/out/dist-files'])}
<p>Sáu module nguồn thành ba file. Mỗi dòng báo cáo cho dung lượng thô và dung lượng sau khi nén <strong>gzip</strong> — máy chủ nén chữ trước khi gửi, nên cột gzip gần với những gì đi qua mạng. Danh sách thứ hai cho thấy thứ nằm trong <code>dist/</code>: <code>index.html</code> đã viết lại, một file CSS và một file JS trong <code>assets/</code> có dấu vân tay trong tên, và <code>robots.txt</code> chép nguyên từ <code>public/</code>. <code>dist/</code> là thư mục máy chủ phục vụ.</p>

<h3>Bước 4 — nhìn vào bên trong bundle</h3>
${ra(OUT['_t14/out/bundle-grep'])}
<p>Phần cuối bundle là code của ta, thoạt nhìn không nhận ra nhưng hành vi giữ nguyên. Đọc kết quả tìm kiếm:</p>
<ul>
<li><strong>Tree-shaking:</strong> <code>GENERATED_REPORT_MARKER</code> (nằm trong hàm không dùng) không có trong bundle — export không ai import bị bỏ.</li>
<li><strong>Xoá code chết:</strong> dòng log <code>[dev] app started</code> biến mất. Lúc build <code>import.meta.env.DEV</code> thành <code>false</code>, nên cả khối <code>if</code> bị xoá.</li>
<li><strong>Thay biến môi trường:</strong> <code>import.meta.env.VITE_API_URL</code> được thay bằng chữ <code>https://api.ctshop.example</code>. Giá trị giờ đã được <em>nướng vào</em> file — đổi nó sau này phải build lại.</li>
<li><strong>Một vụ rò rỉ:</strong> <code>demo-secret-not-real-0001</code> cũng nằm trong bundle, ai mở DevTools cũng đọc được. Vì sao, và cách ngăn, là bài 14.2. <code>demo-password</code> (từ <code>DATABASE_URL</code>, không có tiền tố <code>VITE_</code>) thì <em>không</em> có: <code>window.__dbUrl=void 0</code>.</li>
</ul>

<h3>Bốn việc của một bản dựng</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đóng gói (bundle)</span><span class="lz-d">Đi theo mọi <code>import</code> từ điểm vào và gộp các module thành vài file. Ít request, ít chi phí phụ.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Rung cây (tree-shake)</span><span class="lz-d">Bỏ các export không ai import — những nhánh chết của "cây" phụ thuộc.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thu gọn (minify)</span><span class="lz-d">Bỏ khoảng trắng và chú thích, rút tên biến cục bộ (<code>formatVnd</code> → <code>e</code>), gộp hằng (<code>450000</code> → <code>45e4</code>).</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Băm tên (hash)</span><span class="lz-d">Đặt tên file theo dấu vân tay nội dung: <code>index-27wt_Xcd.js</code>. Nội dung như cũ ⇒ tên như cũ; đổi gì ⇒ tên mới.</span></div>
</div>
<p>Vì sao băm tên? Nó cho máy chủ bảo trình duyệt "giữ file này một năm" (bài 14.3). Khi deploy bản mới, file nào đổi sẽ có tên mới và <code>index.html</code> mới trỏ tới chúng, nên người dùng không bao giờ nhận script cũ — còn file không đổi giữ nguyên tên và vẫn nằm trong bộ đệm.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "chạy được ở dev".</strong> Có những bug chỉ tồn tại sau khi build: code dựa vào một biến toàn cục chỉ có ở dev, một file import sai hoa/thường (macOS bỏ qua <code>./Format.js</code>, máy build Linux thì không), một biến môi trường có trên máy bạn mà không có trên máy chủ. Trước mỗi lần deploy hãy chạy <code>npm run build &amp;&amp; npm run preview</code> — lệnh phục vụ <code>dist/</code> y như máy chủ thật — và bấm qua các trang chính.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — commit <code>dist/</code>, hoặc mở nó bằng nhấp đúp.</strong> Đầu ra của build là thứ được sinh ra: commit nó tạo diff khổng lồ và xung đột khi gộp, và nó lỗi thời ngay khi ai đó quên build lại. Đưa <code>dist</code> vào <code>.gitignore</code> và để quy trình deploy tự build. Còn nhấp đúp <code>dist/index.html</code> sẽ mở nó dạng <code>file://</code>, nơi đường dẫn tuyệt đối như <code>/assets/…</code> và ES module không chạy — bạn thấy trang trắng và tưởng build hỏng. Hãy phục vụ qua HTTP (<code>npm run preview</code>).</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (20 phút)</strong></p>
<p>Tạo một dự án Vite (<code>npm create vite@latest my-shop -- --template vanilla</code>, rồi <code>npm install</code>). Thêm một module export hai hàm và chỉ import một; thêm <code>if (import.meta.env.DEV) console.log('DEV ONLY')</code>. Chạy <code>npm run build</code>, rồi <code>npm run preview</code> và mở trang. Tìm trong bundle: <code>grep -c "DEV ONLY" dist/assets/*.js</code>.</p>
<p><strong>Xong khi:</strong> trang preview chạy; grep in ra 0 cho cả dòng log dev lẫn một chuỗi đánh dấu trong hàm không dùng; <code>dist/</code> có trong <code>.gitignore</code>; và sau khi sửa một dòng trong <code>main.js</code> rồi build lại, tên file JS đổi còn tên file CSS giữ nguyên. Code Lab module 14.1 kiểm hiểu biết của bạn về từng việc bằng một bundler mô phỏng nhỏ.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">build / production build</span><span class="v">bản dựng — biến mã nguồn thành file để phát hành.</span></div>
  <div class="kv"><span class="k">dev server</span><span class="v">máy chủ phát triển — phục vụ code khi đang làm, có nạp lại nóng.</span></div>
  <div class="kv"><span class="k">bundle / bundler</span><span class="v">gói / công cụ đóng gói (Vite, webpack, esbuild…).</span></div>
  <div class="kv"><span class="k">minify</span><span class="v">thu gọn — bỏ khoảng trắng, rút tên biến.</span></div>
  <div class="kv"><span class="k">tree-shaking</span><span class="v">rung cây — bỏ phần export không ai dùng.</span></div>
  <div class="kv"><span class="k">content hash</span><span class="v">mã băm nội dung — dấu vân tay trong tên file.</span></div>
  <div class="kv"><span class="k">gzip</span><span class="v">nén — máy chủ nén chữ trước khi gửi.</span></div>
  <div class="kv"><span class="k">preview</span><span class="v">xem trước — phục vụ dist/ như máy chủ thật trên máy bạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Chế độ phát triển tối ưu cho lập trình viên (đo được: 6 request, 225&nbsp;KB); production tối ưu cho người dùng (3 request, 1,4&nbsp;KB).</li>
  <li><code>npm run build</code> ghi ra <code>dist/</code>; đọc cột gzip của báo cáo.</li>
  <li>Bản dựng đóng gói, rung cây, thu gọn và băm tên — và thay <code>import.meta.env.*</code> bằng giá trị.</li>
  <li>Tên có mã băm làm việc lưu đệm lâu trở nên an toàn; chỉ HTML là không được lưu đệm.</li>
  <li>Xem trước bản dựng qua HTTP trước khi deploy; không bao giờ commit <code>dist/</code>.</li>
</ul>
${nguon('📗', 'Vite — Building for Production', 'vite build làm gì, và cấu hình nó thế nào', 'https://vite.dev/guide/build.html')}
${nguon('📘', 'MDN — Tree shaking', 'Mục từ điển ngắn kèm lý do dựa trên ES module', 'https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking')}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-20-1-build-vs-start', title: 'Next.js 20.1 — deploy nghĩa là gì: build vs start', sub: 'Cùng sự tách đôi đó trong một framework có máy chủ', cta: 'Mở bài' })}
${lienKet({ khoa: 'deploy-vps', bai: 'deploy-1-3-tao-tac-phai-dung', title: 'Deploy 1.3 — khi tạo tác phải được DỰNG', sub: 'Bước build chạy ở đâu trong một quy trình thật, và vì sao phải tái lập được', cta: 'Mở bài' })}
</div>
`,
};
