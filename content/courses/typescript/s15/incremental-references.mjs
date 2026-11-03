/**
 * TypeScript · Chương 15 · 15.2 — Incremental & project references. Slug giữ: typescript-15-2-incremental-references.
 * Code/output từ ./_ma-ts-15-2.mjs (demo15/ts-15-2, Node 22.23.3 + tsc 7.0.2; tsc -b --verbose, bỏ timestamp). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-15-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-15-2.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>tsc -b</code></span><span class="v">Builds projects in dependency order.</span></div>
  <div class="kv"><span class="k"><code>.tsbuildinfo</code></span><span class="v">Remembers the last build — a second run is near-instant.</span></div>
  <div class="kv"><span class="k">“up to date”</span><span class="v">No change ⇒ no work: only what you touched is rebuilt.</span></div>
  <div class="kv"><span class="k"><code>composite: true</code></span><span class="v">Each project emits its declarations; consumers check the built types.</span></div>
  <div class="kv"><span class="k">monorepo</span><span class="v">Build packages in order, in parallel where possible.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>tsc -b</code></span><span class="v">Build các dự án theo thứ tự phụ thuộc.</span></div>
  <div class="kv"><span class="k"><code>.tsbuildinfo</code></span><span class="v">Nhớ build lần trước — một lần chạy thứ hai gần như tức thời.</span></div>
  <div class="kv"><span class="k">“up to date”</span><span class="v">Không đổi ⇒ không việc: chỉ thứ bạn chạm được build lại.</span></div>
  <div class="kv"><span class="k"><code>composite: true</code></span><span class="v">Mỗi dự án phát khai báo; bên tiêu thụ kiểm kiểu đã build.</span></div>
  <div class="kv"><span class="k">monorepo</span><span class="v">Build các package theo thứ tự, song song khi được.</span></div>
</div>`;

export default {
  title: '15.2 — Incremental & project references|||15.2 — Incremental & project references',
  slug: 'typescript-15-2-incremental-references',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Việc rẻ nhất là việc không lặp lại. Một build incremental nhớ thứ đã kiểm trong một .tsbuildinfo, nên build thứ hai không đổi gần như tức thời ("up to date"). Project references (composite: true) tách một codebase thành các dự án build theo thứ tự phụ thuộc, mỗi dự án phát khai báo của nó, nên bên tiêu thụ kiểm với kiểu ĐÃ BUILD và tsc bỏ qua hẳn một dự án không đổi — nền tảng của build monorepo nhanh. Đo thật tsc 7.0.2 (tsc -b --verbose).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2</span>
<h2>Incremental &amp; project references</h2>
<p class="lead">The cheapest work is the work you do not repeat. An <em>incremental</em> build remembers what it checked last time in a <code>.tsbuildinfo</code> file, so a second build with no changes is near-instant. <em>Project references</em> split a big codebase into separate projects that build in dependency order and re-check only the ones that changed.</p>

<h3>A project with references</h3>
<p>A <code>core</code> project holds the model; an <code>app</code> project uses it and lists it in <code>references</code>:</p>
${ma('ts', CODE.coreSrc)}
${ma('json', CODE.appCfg)}

<h3>The first build does the work</h3>
<p><code>tsc -b --verbose</code> builds each project in order — the dependency first:</p>
${ra(OUT['11-build-first'])}
<p>Each project is “out of date” (no build info yet) and gets built, <code>core</code> before <code>app</code>.</p>

<h3>The second build is near-instant</h3>
<p>Run the same command again with nothing changed:</p>
${ra(OUT['12-build-second'])}
<p>Every project is “up to date” — tsc compares each file’s timestamp to the <code>.tsbuildinfo</code> and finds no work to do. This is the payoff on every edit-save-check cycle and in CI with a warm cache: you only pay for what you touched.</p>

<h3>Why references, not one big project</h3>
<p>Project references need <code>composite: true</code> and make each project emit its declaration files, so a consumer type-checks against the <em>built</em> types of its dependency, not its source. That is what lets tsc skip an unchanged project entirely — and lets a monorepo build its packages in the right order, in parallel where possible.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>📌 Summary</h3>
<ul>
<li><code>tsc -b</code> builds projects in dependency order and writes a <code>.tsbuildinfo</code>.</li>
<li>A second build with no changes reports every project “up to date” — near-instant.</li>
<li>Project references need <code>composite: true</code>; each project is checked against its dependencies’ built types.</li>
<li>Together they make a monorepo build fast: only changed projects are rebuilt.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Project References', 'composite, tsc -b and the build graph. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/project-references.html')}
${nguon('📘', 'TSConfig — incremental & tsBuildInfoFile', 'How the build cache works. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#incremental')}
${lienKet({ khoa: 'github-actions', bai: 'ga-5-1-cache-mua-gi', title: 'The same cache, in CI — GitHub Actions 5.1: What to cache', sub: 'Same: a build is fast when it reuses what the last build already did. Different: there you cache dependencies and build outputs between CI runs with a key; here <code>tsc</code>’s <code>.tsbuildinfo</code> is that cache for the type-check — restore it in CI and an unchanged project is “up to date” instead of rebuilt.', cta: 'OPEN GITHUB ACTIONS LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2</span>
<h2>Incremental &amp; project references</h2>
<p class="lead">Việc rẻ nhất là việc bạn không lặp lại. Một build <em>incremental</em> nhớ thứ nó đã kiểm lần trước trong một tệp <code>.tsbuildinfo</code>, nên một build thứ hai không thay đổi gần như tức thời. <em>Project references</em> tách một codebase lớn thành các dự án riêng build theo thứ tự phụ thuộc và kiểm lại chỉ những cái đã đổi.</p>

<h3>Một dự án có references</h3>
<p>Một dự án <code>core</code> giữ model; một dự án <code>app</code> dùng nó và liệt nó trong <code>references</code>:</p>
${ma('ts', CODE.coreSrc)}
${ma('json', CODE.appCfg)}

<h3>Build lần đầu làm việc</h3>
<p><code>tsc -b --verbose</code> build từng dự án theo thứ tự — dependency trước:</p>
${ra(OUT['11-build-first'])}
<p>Mỗi dự án “out of date” (chưa có build info) và được build, <code>core</code> trước <code>app</code>.</p>

<h3>Build lần hai gần như tức thời</h3>
<p>Chạy lại cùng lệnh mà không đổi gì:</p>
${ra(OUT['12-build-second'])}
<p>Mọi dự án “up to date” — tsc so timestamp mỗi tệp với <code>.tsbuildinfo</code> và thấy không có việc. Đây là phần thưởng ở mỗi vòng sửa-lưu-kiểm và trong CI với cache ấm: bạn chỉ trả cho thứ bạn chạm.</p>

<h3>Vì sao references, không phải một dự án lớn</h3>
<p>Project references cần <code>composite: true</code> và làm mỗi dự án phát ra các tệp khai báo của nó, nên một bên tiêu thụ kiểm kiểu với kiểu <em>đã build</em> của dependency, không phải source của nó. Đó là thứ cho tsc bỏ qua hẳn một dự án không đổi — và cho một monorepo build các package theo đúng thứ tự, song song khi được.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>tsc -b</code> build các dự án theo thứ tự phụ thuộc và ghi một <code>.tsbuildinfo</code>.</li>
<li>Một build thứ hai không đổi báo mọi dự án “up to date” — gần như tức thời.</li>
<li>Project references cần <code>composite: true</code>; mỗi dự án được kiểm với kiểu đã build của dependency.</li>
<li>Cùng nhau chúng làm một build monorepo nhanh: chỉ dự án đã đổi được build lại.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Project References', 'composite, tsc -b và đồ thị build. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/project-references.html')}
${nguon('📘', 'TSConfig — incremental & tsBuildInfoFile', 'Cache build hoạt động ra sao. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#incremental')}
${lienKet({ khoa: 'github-actions', bai: 'ga-5-1-cache-mua-gi', title: 'Cùng cache đó, trong CI — GitHub Actions 5.1: Cache cái gì', sub: 'Giống: một build nhanh khi nó dùng lại thứ build trước đã làm. Khác: ở đó bạn cache dependency và output build giữa các lượt CI bằng một khoá; ở đây <code>.tsbuildinfo</code> của <code>tsc</code> là cache đó cho lượt kiểm kiểu — khôi phục nó trong CI và một dự án không đổi “up to date” thay vì build lại.', cta: 'MỞ BÀI GITHUB ACTIONS →' })}
</div>
`,
};
