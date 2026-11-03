/**
 * TypeScript · Chương 16 · 16.2 — any, unknown & never. Slug giữ: typescript-16-2-any-unknown-never.
 * Code/output từ ./_ma-ts-16-2.mjs (demo16/ts-16-2, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-16-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-16-2.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>any</code></span><span class="v">Checking off — a wrong call compiles and crashes at run time.</span></div>
  <div class="kv"><span class="k"><code>unknown</code></span><span class="v">The safe top type — narrow before use (else TS18046).</span></div>
  <div class="kv"><span class="k"><code>never</code></span><span class="v">The empty type — an unhandled case fails <code>assertNever</code> (TS2345).</span></div>
  <div class="kv"><span class="k">at a boundary</span><span class="v">Prefer <code>unknown</code>, then narrow.</span></div>
  <div class="kv"><span class="k">in a switch</span><span class="v">Use <code>never</code> to prove exhaustiveness.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>any</code></span><span class="v">Tắt kiểm — một lời gọi sai biên dịch và sập lúc chạy.</span></div>
  <div class="kv"><span class="k"><code>unknown</code></span><span class="v">Top type an toàn — thu hẹp trước khi dùng (không thì TS18046).</span></div>
  <div class="kv"><span class="k"><code>never</code></span><span class="v">Kiểu rỗng — một case chưa xử lý trượt <code>assertNever</code> (TS2345).</span></div>
  <div class="kv"><span class="k">ở một biên</span><span class="v">Ưu tiên <code>unknown</code>, rồi thu hẹp.</span></div>
  <div class="kv"><span class="k">trong một switch</span><span class="v">Dùng <code>never</code> để chứng minh vét cạn.</span></div>
</div>`;

export default {
  title: '16.2 — any, unknown & never|||16.2 — any, unknown & never',
  slug: 'typescript-16-2-any-unknown-never',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Ba kiểu đặc biệt ở rìa hệ thống. any tắt kiểm — một lời gọi sai biên dịch và sập lúc chạy (Cannot read properties of undefined). unknown là bản an toàn — nhận gì cũng được nhưng phải thu hẹp trước khi dùng (đọc .length trên unknown ⇒ TS18046). never là kiểu rỗng — ở cuối một switch vét cạn, assertNever(x: never) bắt một case chưa xử lý (⇒ TS2345). Ưu tiên unknown ở mọi biên; dùng never để một switch chứng minh vét cạn. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.2</span>
<h2>any, unknown &amp; never</h2>
<p class="lead">Three special types sit at the edges of the system. <code>any</code> switches checking off — anything goes, and so do the bugs. <code>unknown</code> is the safe version — it accepts anything but makes you narrow before you use it. <code>never</code> is the empty type — a value that cannot exist, exactly what you want at the end of an exhaustive check.</p>

<h3>unknown: accept anything, then narrow</h3>
<p>Data from outside is <code>unknown</code>, not <code>any</code>; reading it before narrowing is refused:</p>
${ma('ts', CODE.unknown)}
${ra(OUT['11-unknown'])}
<p><strong>TS18046</strong> — you must prove what <code>raw</code> is (<code>typeof raw === 'string'</code>) before you touch it. This is the honest top type: it remembers that you do not yet know.</p>

<h3>never: the exhaustiveness check</h3>
<p>At the end of a <code>switch</code> over a union, the default should be unreachable:</p>
${ma('ts', CODE.never)}
${ra(OUT['12-never'])}
<p><strong>TS2345</strong> — <code>'held'</code> is not handled, so the value reaching <code>assertNever</code> is not <code>never</code>. Handle every case and it compiles; add a union member later and the check lights up exactly where you must handle it.</p>

<h3>any: the switch you turn off on purpose, rarely</h3>
<p><code>any</code> compiles anything — including a call that crashes at run time:</p>
${ma('ts', CODE.anyrun)}
${ra(OUT['13-anyrun'])}
<p>It passes tsc and throws <code>Cannot read properties of undefined</code> when you run it. Every error the whole course taught you to catch, <code>any</code> lets through. Reach for <code>unknown</code> instead, and narrow.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A function reads <code>raw[0]</code> on an <code>unknown</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Narrow with <code>typeof raw === 'string'</code> and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>any</code> turns checking off — a wrong call compiles and crashes at run time.</li>
<li><code>unknown</code> is the safe top type — reading it before narrowing is TS18046.</li>
<li><code>never</code> is the empty type — an unhandled union member fails the <code>assertNever</code> check (TS2345).</li>
<li>Prefer <code>unknown</code> at every boundary; use <code>never</code> to make a <code>switch</code> prove it is exhaustive.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — The unknown type', 'The safe top type and narrowing. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown')}
${nguon('📘', 'TypeScript Handbook — never & exhaustiveness', 'assertNever and exhaustive switches. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking')}
${lienKet({ khoa: 'typescript', bai: 'typescript-6-4-generics-in-practice', title: 'Why not any — TypeScript 6.4: Generics in practice', sub: 'Same: a type on incoming data proves nothing if it is not validated. Different: there a return-only generic is a cast in disguise, fixed by returning <code>unknown</code> and narrowing; here that is the rule for every boundary — <code>unknown</code> makes you prove what the data is, while <code>any</code> lets a crash through.', cta: 'OPEN TYPESCRIPT LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.2</span>
<h2>any, unknown &amp; never</h2>
<p class="lead">Ba kiểu đặc biệt nằm ở rìa của hệ thống. <code>any</code> tắt kiểm — gì cũng được, và bug cũng vậy. <code>unknown</code> là bản an toàn — nó nhận gì cũng được nhưng bắt bạn thu hẹp trước khi dùng. <code>never</code> là kiểu rỗng — một giá trị không thể tồn tại, đúng thứ bạn muốn ở cuối một phép kiểm vét cạn.</p>

<h3>unknown: nhận gì cũng được, rồi thu hẹp</h3>
<p>Dữ liệu từ ngoài là <code>unknown</code>, không phải <code>any</code>; đọc nó trước khi thu hẹp bị từ chối:</p>
${ma('ts', CODE.unknown)}
${ra(OUT['11-unknown'])}
<p><strong>TS18046</strong> — bạn phải chứng minh <code>raw</code> là gì (<code>typeof raw === 'string'</code>) trước khi chạm nó. Đây là top type trung thực: nó nhớ rằng bạn chưa biết.</p>

<h3>never: phép kiểm vét cạn</h3>
<p>Ở cuối một <code>switch</code> trên một union, nhánh default nên không với tới được:</p>
${ma('ts', CODE.never)}
${ra(OUT['12-never'])}
<p><strong>TS2345</strong> — <code>'held'</code> chưa được xử lý, nên giá trị tới <code>assertNever</code> không phải <code>never</code>. Xử lý mọi case và nó biên dịch; thêm một thành viên union về sau và phép kiểm sáng lên đúng chỗ bạn phải xử lý.</p>

<h3>any: công tắc bạn cố ý tắt, hiếm khi</h3>
<p><code>any</code> biên dịch bất cứ gì — kể cả một lời gọi sập lúc chạy:</p>
${ma('ts', CODE.anyrun)}
${ra(OUT['13-anyrun'])}
<p>Nó qua tsc và ném <code>Cannot read properties of undefined</code> khi bạn chạy. Mọi lỗi cả khoá dạy bạn bắt, <code>any</code> cho lọt. Hãy dùng <code>unknown</code> thay vào đó, và thu hẹp.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một hàm đọc <code>raw[0]</code> trên một <code>unknown</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Thu hẹp bằng <code>typeof raw === 'string'</code> và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>any</code> tắt kiểm — một lời gọi sai biên dịch và sập lúc chạy.</li>
<li><code>unknown</code> là top type an toàn — đọc nó trước khi thu hẹp là TS18046.</li>
<li><code>never</code> là kiểu rỗng — một thành viên union chưa xử lý trượt phép kiểm <code>assertNever</code> (TS2345).</li>
<li>Ưu tiên <code>unknown</code> ở mọi biên; dùng <code>never</code> để một <code>switch</code> chứng minh nó vét cạn.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — The unknown type', 'Top type an toàn và thu hẹp. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown')}
${nguon('📘', 'TypeScript Handbook — never & exhaustiveness', 'assertNever và switch vét cạn. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking')}
${lienKet({ khoa: 'typescript', bai: 'typescript-6-4-generics-in-practice', title: 'Vì sao không any — TypeScript 6.4: Generics thực chiến', sub: 'Giống: một cái kiểu lên dữ liệu đến không chứng minh gì nếu không validate. Khác: ở đó một generic chỉ-trả-về là một phép ép trá hình, sửa bằng trả <code>unknown</code> rồi thu hẹp; ở đây đó là luật cho mọi biên — <code>unknown</code> bắt bạn chứng minh dữ liệu là gì, còn <code>any</code> cho một cú sập lọt.', cta: 'MỞ BÀI TYPESCRIPT →' })}
</div>
`,
};
