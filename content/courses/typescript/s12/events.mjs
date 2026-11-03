/**
 * TypeScript · Chương 12 · 12.3 — Typing events. Slug giữ: typescript-12-3-events.
 * Code/output từ ./_ma-ts-12-3.mjs (demo12/ts-12-3, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026. Mô hình react.ts tự-chứa.
 */
import G from '../giang/ts-12-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-12-3.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>ChangeEvent</code></span><span class="v">A typed event — <code>e.target.value</code> is a string.</span></div>
  <div class="kv"><span class="k">wrong read</span><span class="v"><code>e.value</code> is TS2339 — the value is under <code>target</code>.</span></div>
  <div class="kv"><span class="k">always a string</span><span class="v">Assigning it to a number is TS2322 — parse with <code>Number()</code>.</span></div>
  <div class="kv"><span class="k">generic over the element</span><span class="v">The real <code>ChangeEvent&lt;HTMLInputElement&gt;</code> is what types <code>target</code>.</span></div>
  <div class="kv"><span class="k">inline infers</span><span class="v">In JSX you rarely write the type; a standalone handler needs it.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>ChangeEvent</code></span><span class="v">Một sự kiện có kiểu — <code>e.target.value</code> là một string.</span></div>
  <div class="kv"><span class="k">đọc sai</span><span class="v"><code>e.value</code> là TS2339 — value nằm dưới <code>target</code>.</span></div>
  <div class="kv"><span class="k">luôn là string</span><span class="v">Gán nó cho một number là TS2322 — phân tích bằng <code>Number()</code>.</span></div>
  <div class="kv"><span class="k">generic trên phần tử</span><span class="v"><code>ChangeEvent&lt;HTMLInputElement&gt;</code> thật là thứ gõ kiểu <code>target</code>.</span></div>
  <div class="kv"><span class="k">viết thẳng thì tự suy</span><span class="v">Trong JSX bạn hiếm khi viết kiểu; một handler riêng thì cần.</span></div>
</div>`;

export default {
  title: '12.3 — Typing events|||12.3 — Gõ kiểu sự kiện',
  slug: 'typescript-12-3-events',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Một handler nhận một sự kiện có kiểu. Với ChangeEvent, e.target.value là một string — e.target.value.toUpperCase() hợp lệ. Đọc e.value (thay vì e.target.value) là TS2339; gán e.target.value cho một number là TS2322 (value luôn là string, kể cả input số — phải Number()). Trong React thật, sự kiện generic trên phần tử: ChangeEvent<HTMLInputElement>, FormEvent<HTMLFormElement>. Có cảnh báo bẫy target vs currentTarget. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>Typing events</h2>
<p class="lead">A handler receives an event, and a typed event is where the frontend meets the DOM safely. In our model a <code>ChangeEvent</code> carries a <code>target</code> with a <code>value</code> — a string — the same shape the real React types give you, specialised in the full library by the element that fired the event.</p>

<h3>A change handler: e.target.value is a string</h3>
<p>Type the parameter as <code>ChangeEvent</code> and <code>e.target.value</code> is a string:</p>
${ma('ts', CODE.eventDemo)}
${ra(OUT['11-event'])}
<p>The value of an input is always a string; the type says so, and the handler is checked against it.</p>

<h3>The typed event refuses a wrong read</h3>
<p>Read <code>e.value</code> instead of <code>e.target.value</code>:</p>
${ma('ts', CODE.wrongevent)}
${ra(OUT['12-wrongevent'])}
<p><strong>TS2339</strong> — the value is nested under <code>target</code>, not on the event itself.</p>

<h3>The value is a string, even for numbers</h3>
<p>Assign <code>e.target.value</code> straight to a <code>number</code>:</p>
${ma('ts', CODE.asnumber)}
${ra(OUT['13-asnumber'])}
<p><strong>TS2322</strong> — the same lesson as the Express params in Chapter 11: an input’s value is a <code>string</code>, even for a number input, so you must parse it with <code>Number()</code> before treating it as a number.</p>

<h3>Events, at a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A handler returns <code>Number(e.value)</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Read <code>e.target.value</code> instead and it runs, returning the parsed number:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>Type a handler’s parameter as the event — <code>e.target.value</code> is then a checked string.</li>
<li>Reading <code>e.value</code> is TS2339; assigning the value to a number is TS2322 — parse it.</li>
<li>In the real library the event is generic over its element (<code>ChangeEvent&lt;HTMLInputElement&gt;</code>), which is what types <code>target</code>.</li>
<li>Inline handlers infer the type in JSX; a standalone handler needs the annotation.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'React — Responding to Events', 'How handlers receive events. Read 4 Nov 2026.', 'https://react.dev/learn/responding-to-events')}
${nguon('📘', 'React TypeScript Cheatsheets — Forms and Events', 'The real event types, generic over the element. Read 4 Nov 2026.', 'https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/')}
${lienKet({ khoa: 'react', bai: 'rx-2-2-su-kien', title: 'The events these types describe — React 2.2: Events', sub: 'Same: a handler reads an event and its <code>target</code>. Different: there you wire handlers onto live elements; here the event <em>type</em> checks the read — <code>e.value</code> is TS2339 and treating the string value as a number is TS2322, so you parse it before use.', cta: 'OPEN REACT LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Gõ kiểu sự kiện</h2>
<p class="lead">Một handler nhận một sự kiện, và một sự kiện có kiểu là nơi frontend gặp DOM một cách an toàn. Trong mô hình của ta, một <code>ChangeEvent</code> mang một <code>target</code> với một <code>value</code> — một string — đúng dáng mà kiểu React thật cho bạn, được chuyên biệt hoá trong thư viện đầy đủ theo phần tử phát ra sự kiện.</p>

<h3>Một handler thay đổi: e.target.value là một string</h3>
<p>Gõ kiểu tham số là <code>ChangeEvent</code> và <code>e.target.value</code> là một string:</p>
${ma('ts', CODE.eventDemo)}
${ra(OUT['11-event'])}
<p>Value của một input luôn là một string; kiểu nói vậy, và handler được kiểm dựa trên nó.</p>

<h3>Sự kiện có kiểu từ chối một phép đọc sai</h3>
<p>Đọc <code>e.value</code> thay vì <code>e.target.value</code>:</p>
${ma('ts', CODE.wrongevent)}
${ra(OUT['12-wrongevent'])}
<p><strong>TS2339</strong> — value nằm trong <code>target</code>, không ở trên chính sự kiện.</p>

<h3>Value là một string, kể cả với số</h3>
<p>Gán <code>e.target.value</code> thẳng cho một <code>number</code>:</p>
${ma('ts', CODE.asnumber)}
${ra(OUT['13-asnumber'])}
<p><strong>TS2322</strong> — cùng bài học với params Express ở Chương 11: value của một input là một <code>string</code>, kể cả với input số, nên bạn phải phân tích nó bằng <code>Number()</code> trước khi coi nó là số.</p>

<h3>Sự kiện, nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một handler trả <code>Number(e.value)</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Đọc <code>e.target.value</code> thay vào đó và nó chạy, trả về số đã phân tích:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Gõ kiểu tham số của handler là sự kiện — <code>e.target.value</code> khi đó là một string được kiểm.</li>
<li>Đọc <code>e.value</code> là TS2339; gán value cho một number là TS2322 — hãy phân tích nó.</li>
<li>Trong thư viện thật, sự kiện generic trên phần tử (<code>ChangeEvent&lt;HTMLInputElement&gt;</code>), là thứ gõ kiểu <code>target</code>.</li>
<li>Handler viết thẳng tự suy kiểu trong JSX; một handler riêng cần chú thích.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'React — Responding to Events', 'Handler nhận sự kiện ra sao. Đọc ngày 4/11/2026.', 'https://react.dev/learn/responding-to-events')}
${nguon('📘', 'React TypeScript Cheatsheets — Forms and Events', 'Các kiểu sự kiện thật, generic trên phần tử. Đọc ngày 4/11/2026.', 'https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/')}
${lienKet({ khoa: 'react', bai: 'rx-2-2-su-kien', title: 'Sự kiện mà các kiểu này tả — React 2.2: Sự kiện', sub: 'Giống: một handler đọc một sự kiện và <code>target</code> của nó. Khác: ở đó bạn nối handler vào phần tử sống; ở đây <em>kiểu</em> sự kiện kiểm phép đọc — <code>e.value</code> là TS2339 và coi value string là một số là TS2322, nên bạn phân tích nó trước khi dùng.', cta: 'MỞ BÀI REACT →' })}
</div>
`,
};
