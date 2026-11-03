/**
 * TypeScript · Chương 8 · 8.3 — Record. Slug giữ: typescript-8-3-record.
 * Code/output từ ./_ma-ts-08-3.mjs (demo8/ts-08-3, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-08-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-08-3.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>Record&lt;K, V&gt;</code></span><span class="v">An object with one entry of type <code>V</code> for every key in <code>K</code>.</span></div>
  <div class="kv"><span class="k">closed mode</span><span class="v">Keys are a union ⇒ the table must be complete (a missing key is TS2741).</span></div>
  <div class="kv"><span class="k">open mode</span><span class="v">Keys are <code>string</code> ⇒ a lookup is <code>V | undefined</code> (noUncheckedIndexedAccess).</span></div>
  <div class="kv"><span class="k">a mapped type</span><span class="v"><code>Record&lt;K, V&gt;</code> is <code>{ [P in K]: V }</code> from 7.1.</span></div>
  <div class="kv"><span class="k">choose on purpose</span><span class="v">Union keys for a checked table; string keys for an open dictionary.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>Record&lt;K, V&gt;</code></span><span class="v">Một object với một mục kiểu <code>V</code> cho mỗi khoá trong <code>K</code>.</span></div>
  <div class="kv"><span class="k">chế độ đóng</span><span class="v">Khoá là một union ⇒ bảng phải đầy đủ (thiếu một khoá là TS2741).</span></div>
  <div class="kv"><span class="k">chế độ mở</span><span class="v">Khoá là <code>string</code> ⇒ một lần tra là <code>V | undefined</code> (noUncheckedIndexedAccess).</span></div>
  <div class="kv"><span class="k">một mapped type</span><span class="v"><code>Record&lt;K, V&gt;</code> là <code>{ [P in K]: V }</code> của 7.1.</span></div>
  <div class="kv"><span class="k">chọn có chủ ý</span><span class="v">Khoá union cho một bảng được kiểm; khoá string cho một từ điển mở.</span></div>
</div>`;

export default {
  title: '8.3 — Record|||8.3 — Record',
  slug: 'typescript-8-3-record',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Record<K,V> dựng một bảng: một mục kiểu V cho mỗi khoá. Hai chế độ rất khác: khoá là một union (Record<LabCode,number>) ⇒ bảng phải đầy đủ, thiếu một khoá là TS2741, và đọc một mã đã biết là number thuần; khoá là string (Record<string,number>) ⇒ một lần tra là number|undefined dưới noUncheckedIndexedAccess, dùng không guard là TS2322. Record chính là mapped type { [P in K]: V } của Chương 7. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Record</h2>
<p class="lead"><code>Record&lt;K, V&gt;</code> builds a table — an object with one entry of type <code>V</code> for every key in <code>K</code>. You met it as a mapped type in 7.1; here it is the everyday tool for a lookup. Its value comes from two very different modes, depending on whether the keys are a <strong>closed union</strong> or <strong>open strings</strong>.</p>

<h3>A table that must be complete</h3>
<p>With a union of keys, <code>Record&lt;LabCode, number&gt;</code> demands an entry for every lab, and reading a known code is a plain <code>number</code> — no <code>undefined</code>:</p>
${ma('ts', CODE.recordSeats)}
${ra(OUT['11-record'])}
<p>This is the closed table of 4.4 and 5.4, now named. The keys are finite, so the compiler can require all of them — and give you a precise type back when you read one.</p>

<h3>Leave one out and it is an error</h3>
<p>Drop a lab from the literal and the table is incomplete:</p>
${ma('ts', CODE.recordmissSeats)}
${ra(OUT['12-record-miss'])}
<p><strong>TS2741</strong>: the table must cover every key in the union. This is the guarantee you want for a status-label map or a translation table — the compiler will not let you forget a case, the same safety as the exhaustive <code>switch</code> in 5.4, from the data side.</p>

<h3>The open mode: string keys</h3>
<p>With <code>Record&lt;string, number&gt;</code> the keys are open — any string — so a lookup may be missing. Under <code>noUncheckedIndexedAccess</code> the compiler types it as <code>number | undefined</code>, which is honest:</p>
${ma('ts', CODE.openCache)}
${ra(OUT['13-open'])}
<p>A dictionary you did not build cannot promise a key exists. Guard with <code>??</code> and it reads cleanly.</p>

<h3>The open mode refuses an unchecked read</h3>
<p>Use an open lookup as a <code>number</code> without a guard and it is refused:</p>
${ma('ts', CODE.openbadCache)}
${ra(OUT['14-open-bad'])}
<p><strong>TS2322</strong>: <code>number | undefined</code> is not a <code>number</code>. This is the <code>noUncheckedIndexedAccess</code> rule from 4.4, and it is the price of an open table — the completeness a closed <code>Record</code> gives you for free, you earn with a guard here.</p>

<h3>Record’s two modes</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A label map typed as a plain object forgot <code>CANCELLED</code>, and at run time it silently returns the raw code:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['15-pr-start'])}
<p>Make it <code>Record&lt;Status, string&gt;</code> so the missing label is a compile error — and once fixed, it returns the real label:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['16-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>Record&lt;K, V&gt;</code> is an object with one entry of type <code>V</code> per key in <code>K</code> — a mapped type named.</li>
<li>Over a <strong>union</strong>, the table must be complete (a missing key is TS2741) and a read is a plain <code>V</code>.</li>
<li>Over <strong>string</strong>, a lookup is <code>V | undefined</code> — an unchecked read is TS2322.</li>
<li>Reach for the union form whenever the keys are known, so a missing entry is caught at compile time.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Record', 'Record<Keys, Type> in the utility-types reference. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type')}
${nguon('📘', 'TypeScript — noUncheckedIndexedAccess', 'Why an open lookup is V | undefined. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess')}
${lienKet({ khoa: 'api-design', bai: 'api-2-4-i18n', title: 'The table behind the message keys — API Design 2.4: Internationalised messages', sub: 'Same: a lookup with a value for every key, so a missing one is caught, not shipped. Different: 7.4 built the key <em>type</em> (a template literal); 8.3 builds the <em>table</em> — <code>Record&lt;Status, string&gt;</code> over a union forces a value for every status, exactly the completeness a translation catalogue needs.', cta: 'OPEN API DESIGN LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Record</h2>
<p class="lead"><code>Record&lt;K, V&gt;</code> dựng một bảng — một object với một mục kiểu <code>V</code> cho mỗi khoá trong <code>K</code>. Bạn đã gặp nó như một mapped type ở 7.1; ở đây nó là công cụ hằng ngày cho một bảng tra. Giá trị của nó đến từ hai chế độ rất khác, tuỳ khoá là một <strong>union đóng</strong> hay <strong>chuỗi mở</strong>.</p>

<h3>Một bảng phải đầy đủ</h3>
<p>Với một union khoá, <code>Record&lt;LabCode, number&gt;</code> đòi một mục cho mỗi lab, và đọc một mã đã biết là một <code>number</code> thuần — không <code>undefined</code>:</p>
${ma('ts', CODE.recordSeats)}
${ra(OUT['11-record'])}
<p>Đây là bảng đóng của 4.4 và 5.4, giờ có tên. Các khoá hữu hạn, nên trình biên dịch đòi được đủ — và trả lại bạn một kiểu chính xác khi đọc một mục.</p>

<h3>Bỏ sót một cái là một lỗi</h3>
<p>Bỏ một lab khỏi literal và bảng không đầy đủ:</p>
${ma('ts', CODE.recordmissSeats)}
${ra(OUT['12-record-miss'])}
<p><strong>TS2741</strong>: bảng phải phủ mọi khoá trong union. Đây là bảo đảm bạn muốn cho một bản đồ nhãn trạng thái hay một bảng dịch — trình biên dịch không cho bạn quên một trường hợp, cùng độ an toàn như <code>switch</code> vét cạn ở 5.4, từ phía dữ liệu.</p>

<h3>Chế độ mở: khoá string</h3>
<p>Với <code>Record&lt;string, number&gt;</code> các khoá mở — chuỗi bất kỳ — nên một lần tra có thể thiếu. Dưới <code>noUncheckedIndexedAccess</code> trình biên dịch gán kiểu <code>number | undefined</code>, điều đó trung thực:</p>
${ma('ts', CODE.openCache)}
${ra(OUT['13-open'])}
<p>Một từ điển bạn không tự dựng không hứa được một khoá tồn tại. Chặn bằng <code>??</code> thì đọc gọn.</p>

<h3>Chế độ mở từ chối một lần đọc chưa kiểm</h3>
<p>Dùng một lần tra mở như một <code>number</code> mà không chặn và nó bị từ chối:</p>
${ma('ts', CODE.openbadCache)}
${ra(OUT['14-open-bad'])}
<p><strong>TS2322</strong>: <code>number | undefined</code> không phải một <code>number</code>. Đây là luật <code>noUncheckedIndexedAccess</code> của 4.4, và là cái giá của một bảng mở — tính đầy đủ mà một <code>Record</code> đóng cho bạn miễn phí, ở đây bạn phải trả bằng một guard.</p>

<h3>Hai chế độ của Record</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một bản đồ nhãn kiểu object thường quên <code>CANCELLED</code>, và lúc chạy nó âm thầm trả mã thô:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['15-pr-start'])}
<p>Làm nó <code>Record&lt;Status, string&gt;</code> để nhãn thiếu là một lỗi biên dịch — và khi sửa xong, nó trả nhãn thật:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['16-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>Record&lt;K, V&gt;</code> là một object với một mục kiểu <code>V</code> mỗi khoá trong <code>K</code> — một mapped type có tên.</li>
<li>Trên một <strong>union</strong>, bảng phải đầy đủ (thiếu một khoá là TS2741) và một lần đọc là một <code>V</code> thuần.</li>
<li>Trên <strong>string</strong>, một lần tra là <code>V | undefined</code> — một lần đọc chưa kiểm là TS2322.</li>
<li>Dùng dạng union mỗi khi các khoá đã biết, để một mục thiếu bị bắt lúc biên dịch.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Record', 'Record<Keys, Type> trong tham khảo utility types. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type')}
${nguon('📘', 'TypeScript — noUncheckedIndexedAccess', 'Vì sao một lần tra mở là V | undefined. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess')}
${lienKet({ khoa: 'api-design', bai: 'api-2-4-i18n', title: 'Cái bảng đằng sau các khoá câu chữ — API Design 2.4: Thông điệp đa ngôn ngữ', sub: 'Giống: một bảng tra với một giá trị cho mỗi khoá, nên khoá thiếu bị bắt chứ không lên sản phẩm. Khác: 7.4 dựng <em>kiểu</em> khoá (một template literal); 8.3 dựng <em>cái bảng</em> — <code>Record&lt;Status, string&gt;</code> trên một union ép một giá trị cho mọi trạng thái, đúng tính đầy đủ mà một danh mục bản dịch cần.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
