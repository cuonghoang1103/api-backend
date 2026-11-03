/**
 * TypeScript · Chương 10 · 10.3 — Global & module augmentation. Slug giữ: typescript-10-3-augmentation.
 * Code/output từ ./_ma-ts-10-3.mjs (demo10/ts-10-3, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-10-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-10-3.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">declaration merging</span><span class="v">Two interfaces with the same name join into one with all the fields.</span></div>
  <div class="kv"><span class="k"><code>declare global</code></span><span class="v">Extend a global interface (e.g. <code>NodeJS.ProcessEnv</code>) from a module.</span></div>
  <div class="kv"><span class="k">module augmentation</span><span class="v">Add a field to a library’s type — the <code>Request.user</code> pattern.</span></div>
  <div class="kv"><span class="k">rules</span><span class="v">Match name + kind · be in a module · type-only.</span></div>
  <div class="kv"><span class="k">why</span><span class="v">Record a guarantee the types cannot infer — one small file, not a fork.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">gộp khai báo</span><span class="v">Hai interface cùng tên nối thành một với tất cả các trường.</span></div>
  <div class="kv"><span class="k"><code>declare global</code></span><span class="v">Mở rộng một interface toàn cục (vd <code>NodeJS.ProcessEnv</code>) từ một module.</span></div>
  <div class="kv"><span class="k">bổ sung module</span><span class="v">Thêm một trường vào kiểu của một thư viện — mẫu <code>Request.user</code>.</span></div>
  <div class="kv"><span class="k">luật</span><span class="v">Khớp tên + loại · nằm trong một module · chỉ-kiểu.</span></div>
  <div class="kv"><span class="k">vì sao</span><span class="v">Ghi một bảo đảm kiểu không suy được — một tệp nhỏ, không phải một fork.</span></div>
</div>`;

export default {
  title: '10.3 — Global & module augmentation|||10.3 — Bổ sung toàn cục & bổ sung module',
  slug: 'typescript-10-3-augmentation',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Thêm một trường vào một kiểu bạn không sở hữu — một env var đã biết trên process.env, một user trên Express Request — mà không sửa thư viện. Động cơ là gộp khai báo: hai interface cùng tên gộp thành một. declare global mở rộng một interface toàn cục (khai NodeJS.ProcessEnv.LABFLOW_PORT: string ⇒ process.env.LABFLOW_PORT là string, không undefined; bỏ đi ⇒ TS2322). Luật: khớp tên+loại, nằm trong module, chỉ-kiểu. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Global &amp; module augmentation</h2>
<p class="lead">Sometimes you need to add a field to a type you do not own — a known env var on <code>process.env</code>, a <code>user</code> on an Express <code>Request</code>. <strong>Augmentation</strong> lets you extend an existing interface from your own file, without editing the library. It works because TypeScript merges two declarations of the same interface into one.</p>

<h3>Declaration merging: the mechanism</h3>
<p>Two interfaces with the same name merge into one with all the fields:</p>
${ma('ts', CODE.mergeLab)}
${ra(OUT['13-merge'])}
<p>A <code>Lab</code> declared twice — once with <code>code</code>, once with <code>seats</code> — is a single <code>Lab</code> that must have both. This merging is the engine under every augmentation: you are adding a second declaration that joins the first.</p>

<h3>declare global: extend a global type</h3>
<p>Wrap the merge in <code>declare global</code> and you extend a global interface from a module:</p>
${ma('ts', CODE.globalaugEnv)}
${ma('ts', CODE.globalaugApp)}
${ra(OUT['11-globalaug'])}
<p>Declaring <code>NodeJS.ProcessEnv</code> with a <code>LABFLOW_PORT: string</code> makes <code>process.env.LABFLOW_PORT</code> a <code>string</code> everywhere — not <code>string | undefined</code>. You have told the compiler a fact about the environment it could not infer.</p>

<h3>Without the augmentation</h3>
<p>Remove the declaration and the same read is <code>string | undefined</code> again:</p>
${ma('ts', CODE.noaugApp)}
${ra(OUT['12-noaug'])}
<p><strong>TS2322</strong>. That contrast is the whole point: augmentation is how you record a guarantee the types cannot know on their own, like “this env var is always set” or “every request has a <code>user</code>”. The Express <code>Request.user</code> pattern is exactly this, applied to a library interface instead of a global.</p>

<h3>Augmentation: the rules that make it work</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p><code>process.env.DATABASE_URL</code> is <code>string | undefined</code>, so returning it as a <code>string</code> is TS2322:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Add a <code>declare global</code> that declares <code>DATABASE_URL: string</code> and it compiles:</p>
${ma('ts', CODE.prSolEnv)}
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>Declaration merging joins two same-named interfaces into one with all the fields.</li>
<li><code>declare global</code> extends a global type (e.g. <code>NodeJS.ProcessEnv</code>) from a module file.</li>
<li>Module augmentation adds a field to a library’s type — the <code>Request.user</code> pattern.</li>
<li>The rules: match name and kind, be in a module, keep it type-only — one small file, not a fork.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Declaration Merging', 'Merging interfaces, and declare global. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-merging.html')}
${nguon('📘', 'TypeScript Handbook — Module Augmentation', 'Extending a library’s types from your own file. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Bổ sung toàn cục &amp; bổ sung module</h2>
<p class="lead">Đôi khi bạn cần thêm một trường vào một kiểu bạn không sở hữu — một env var đã biết trên <code>process.env</code>, một <code>user</code> trên Express <code>Request</code>. <strong>Bổ sung</strong> cho bạn mở rộng một interface có sẵn từ tệp của chính bạn, mà không sửa thư viện. Nó chạy được vì TypeScript gộp hai khai báo của cùng một interface thành một.</p>

<h3>Gộp khai báo: cơ chế</h3>
<p>Hai interface cùng tên gộp thành một với tất cả các trường:</p>
${ma('ts', CODE.mergeLab)}
${ra(OUT['13-merge'])}
<p>Một <code>Lab</code> khai hai lần — một với <code>code</code>, một với <code>seats</code> — là một <code>Lab</code> duy nhất phải có cả hai. Phép gộp này là động cơ dưới mọi bổ sung: bạn đang thêm một khai báo thứ hai nối vào cái đầu.</p>

<h3>declare global: mở rộng một kiểu toàn cục</h3>
<p>Bọc phép gộp trong <code>declare global</code> và bạn mở rộng một interface toàn cục từ một module:</p>
${ma('ts', CODE.globalaugEnv)}
${ma('ts', CODE.globalaugApp)}
${ra(OUT['11-globalaug'])}
<p>Khai <code>NodeJS.ProcessEnv</code> với một <code>LABFLOW_PORT: string</code> làm <code>process.env.LABFLOW_PORT</code> thành một <code>string</code> ở mọi nơi — không phải <code>string | undefined</code>. Bạn đã nói với trình biên dịch một sự thật về môi trường mà nó không suy được.</p>

<h3>Không có bổ sung</h3>
<p>Bỏ khai báo và cùng lần đọc đó lại là <code>string | undefined</code>:</p>
${ma('ts', CODE.noaugApp)}
${ra(OUT['12-noaug'])}
<p><strong>TS2322</strong>. Tương phản đó chính là mấu chốt: bổ sung là cách bạn ghi lại một bảo đảm mà kiểu không tự biết, như “env var này luôn được đặt” hay “mọi request đều có một <code>user</code>”. Mẫu Express <code>Request.user</code> đúng là cái này, áp cho một interface thư viện thay vì một toàn cục.</p>

<h3>Bổ sung: những luật làm nó chạy được</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p><code>process.env.DATABASE_URL</code> là <code>string | undefined</code>, nên trả nó như một <code>string</code> là TS2322:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Thêm một <code>declare global</code> khai <code>DATABASE_URL: string</code> và nó biên dịch:</p>
${ma('ts', CODE.prSolEnv)}
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Gộp khai báo nối hai interface cùng tên thành một với tất cả các trường.</li>
<li><code>declare global</code> mở rộng một kiểu toàn cục (vd <code>NodeJS.ProcessEnv</code>) từ một tệp module.</li>
<li>Bổ sung module thêm một trường vào kiểu của một thư viện — mẫu <code>Request.user</code>.</li>
<li>Luật: khớp tên và loại, nằm trong một module, giữ chỉ-kiểu — một tệp nhỏ, không phải một fork.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Declaration Merging', 'Gộp interface, và declare global. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-merging.html')}
${nguon('📘', 'TypeScript Handbook — Module Augmentation', 'Mở rộng kiểu của một thư viện từ tệp của chính bạn. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation')}
</div>
`,
};
