/**
 * TypeScript · Chương 11 · 11.4 — Services & config. Slug giữ: typescript-11-4-services-and-config.
 * Code/output từ ./_ma-ts-11-4.mjs (demo11/ts-11-4, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-11-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-11-4.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">typed config</span><span class="v">Built once from the environment; a <code>readonly</code> value trusted everywhere.</span></div>
  <div class="kv"><span class="k"><code>readonly</code></span><span class="v">Reassigning a config field is TS2540 — it cannot drift at run time.</span></div>
  <div class="kv"><span class="k">honest service</span><span class="v">A lookup that may miss returns <code>T | undefined</code>, not a lie.</span></div>
  <div class="kv"><span class="k">the layers</span><span class="v">Config → service → handler, each a contract the next relies on.</span></div>
  <div class="kv"><span class="k">Chapter 8 again</span><span class="v"><code>Readonly</code> doing one specific, important job.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">config có kiểu</span><span class="v">Dựng một lần từ môi trường; một giá trị <code>readonly</code> tin ở mọi nơi.</span></div>
  <div class="kv"><span class="k"><code>readonly</code></span><span class="v">Gán lại một trường config là TS2540 — nó không trôi lúc chạy.</span></div>
  <div class="kv"><span class="k">service trung thực</span><span class="v">Một lần tra có thể trượt trả <code>T | undefined</code>, không nói dối.</span></div>
  <div class="kv"><span class="k">các tầng</span><span class="v">Config → service → handler, mỗi cái một hợp đồng tầng sau dựa vào.</span></div>
  <div class="kv"><span class="k">Chương 8 lần nữa</span><span class="v"><code>Readonly</code> làm một việc cụ thể, quan trọng.</span></div>
</div>`;

export default {
  title: '11.4 — Services & config|||11.4 — Service & config',
  slug: 'typescript-11-4-services-and-config',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Dưới các handler là hai tầng có kiểu: config (đọc một lần từ môi trường, các trường readonly ⇒ gán lại là TS2540, không trôi lúc chạy) và service (kiểu trả về trung thực — một lần tra có thể trượt trả T | undefined; hứa T mà trả undefined ⇒ TS2322). Config dựng ở một chỗ thay vì chọc process.env khắp nơi. Kiểu của mỗi tầng là một hợp đồng tầng sau dựa vào. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>Services &amp; config</h2>
<p class="lead">Below the handlers sit two typed layers: configuration, read once from the environment, and services, where the real work happens. Typing both keeps a handler honest — it reads a config it cannot mutate and calls a service whose result it must handle.</p>

<h3>A read-only config, built once</h3>
<p><code>loadConfig</code> reads the environment once and returns a <code>Config</code> whose fields are <code>readonly</code>:</p>
${ma('ts', CODE.configConfig)}
${ra(OUT['11-config'])}
<p>Building it in one place means every other module reads a typed, immutable value instead of poking at <code>process.env</code>. The env is messy and stringly-typed; the <code>Config</code> is clean and final.</p>

<h3>Read-only means it cannot drift at run time</h3>
<p>Reassign <code>cfg.port</code>:</p>
${ma('ts', CODE.frozenConfig)}
${ra(OUT['12-frozen'])}
<p><strong>TS2540</strong> — the config is frozen at the type level, so no module can quietly change it after startup. A config that cannot be mutated is a config you can trust everywhere it is read. This is <code>Readonly</code> from Chapter 8, doing one specific, important job.</p>

<h3>A service returns, it does not lie</h3>
<p>A service that looks a booking up may not find one — so its return type must say so. A <code>bookingById</code> that promises a <code>Booking</code> but can return <code>undefined</code> is a lie the compiler catches (see Practice): the honest type is <code>Booking | undefined</code>, and the caller handles the miss. A typed service is one whose signature matches what it really does.</p>

<h3>The layers, at a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A service returns <code>store.find(...)</code> as a <code>Booking</code>, but <code>find</code> can return <code>undefined</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Make the return type <code>Booking | undefined</code> and the caller guards it:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>A typed config is built once and is <code>readonly</code> — reassigning a field is TS2540, so it cannot drift.</li>
<li>Build it in one place; every module reads a typed, immutable value instead of <code>process.env</code>.</li>
<li>A service’s return type must match reality — a lookup that may miss returns <code>T | undefined</code>.</li>
<li>Config → service → handler: each layer’s type is a contract the next relies on.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Readonly', 'Freezing a config at the type level. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype')}
${nguon('📘', 'The Twelve-Factor App — Config', 'Why config comes from the environment, once. Read 4 Nov 2026.', 'https://12factor.net/config')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Service &amp; config</h2>
<p class="lead">Dưới các handler là hai tầng có kiểu: cấu hình, đọc một lần từ môi trường, và service, nơi việc thật xảy ra. Gõ kiểu cả hai giữ một handler trung thực — nó đọc một config không sửa được và gọi một service mà kết quả nó phải xử lý.</p>

<h3>Một config chỉ-đọc, dựng một lần</h3>
<p><code>loadConfig</code> đọc môi trường một lần và trả một <code>Config</code> mà các trường là <code>readonly</code>:</p>
${ma('ts', CODE.configConfig)}
${ra(OUT['11-config'])}
<p>Dựng nó ở một chỗ nghĩa là mọi module khác đọc một giá trị có kiểu, bất biến thay vì chọc vào <code>process.env</code>. env thì bừa và kiểu-chuỗi; <code>Config</code> thì sạch và chốt.</p>

<h3>Chỉ-đọc nghĩa là nó không trôi lúc chạy</h3>
<p>Gán lại <code>cfg.port</code>:</p>
${ma('ts', CODE.frozenConfig)}
${ra(OUT['12-frozen'])}
<p><strong>TS2540</strong> — config bị đóng băng ở tầng kiểu, nên không module nào đổi nó âm thầm sau khởi động. Một config không sửa được là một config bạn tin ở mọi nơi nó được đọc. Đây là <code>Readonly</code> của Chương 8, làm một việc cụ thể, quan trọng.</p>

<h3>Một service trả về, nó không nói dối</h3>
<p>Một service tra một booking có thể không thấy — nên kiểu trả về của nó phải nói vậy. Một <code>bookingById</code> hứa một <code>Booking</code> mà có thể trả <code>undefined</code> là một lời nói dối trình biên dịch bắt (xem Luyện tập): kiểu trung thực là <code>Booking | undefined</code>, và người gọi xử lý trường hợp trượt. Một service có kiểu là service mà chữ ký khớp việc nó thật sự làm.</p>

<h3>Các tầng, nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một service trả <code>store.find(...)</code> như một <code>Booking</code>, nhưng <code>find</code> có thể trả <code>undefined</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Làm kiểu trả về <code>Booking | undefined</code> và người gọi chặn nó:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một config có kiểu dựng một lần và <code>readonly</code> — gán lại một trường là TS2540, nên nó không trôi.</li>
<li>Dựng nó ở một chỗ; mọi module đọc một giá trị có kiểu, bất biến thay vì <code>process.env</code>.</li>
<li>Kiểu trả về của một service phải khớp thực tế — một lần tra có thể trượt trả <code>T | undefined</code>.</li>
<li>Config → service → handler: kiểu của mỗi tầng là một hợp đồng tầng sau dựa vào.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Readonly', 'Đóng băng một config ở tầng kiểu. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype')}
${nguon('📘', 'The Twelve-Factor App — Config', 'Vì sao config đến từ môi trường, một lần. Đọc ngày 4/11/2026.', 'https://12factor.net/config')}
</div>
`,
};
