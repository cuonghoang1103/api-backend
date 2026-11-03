/**
 * Testing · Chương 6 · 6.1 — Testing Library: tìm phần tử theo thứ người dùng thấy. Slug giữ từ khung: tst-6-1-testing-library.
 * Chạy thật: React 19.3.1, @testing-library/react 16.3.3, jsdom 30.1.3 / happy-dom 21.0.3, Vitest 5.0.5.
 * Đo: bỏ afterEach(cleanup) ⇒ "Found multiple elements"; 16 test web/: jsdom 1.60 s, happy-dom 1.17 s; happy-dom gửi preflight OPTIONS.
 */
import G from '../giang/tst-06-1.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |✓|×|Tests |Duration/.test(l)).join('\n');
const DON_DEP = OUT['61-don-dep'].split('\n').filter((l) => /^\$ |^planted|✓|×|Found multiple/.test(l)).join('\n');
const HAPPY = OUT['61-happy-msw'].split('\n').filter((l) => /^\$ |\[MSW\]|OPTIONS|×|Expected element|Only admins|Could not load/.test(l)).join('\n');
const DO = [OUT['61-jsdom'], OUT['61-happy']].map((t) => t.split('\n').filter((l) => /^\$ |Tests |Duration/.test(l)).join('\n')).join('\n\n');
const F = CODE.form.split('\n');
const iField = F.findIndex((l) => l.startsWith('function Field'));
const iForm = F.findIndex((l) => l.startsWith('export function BookingForm'));
const iRet = F.findIndex((l, i) => i > iForm && l === '  return (');
const FORM_UI = [...F.slice(iField, iForm), F[iForm], '  // … state and handleSubmit: lesson 6.2 …', ...F.slice(iRet)].join('\n');
const CAI = 'npm install --save-exact react@19.3.1 react-dom@19.3.1\nnpm install --save-dev --save-exact @testing-library/react@16.3.3 @testing-library/dom@10.4.2 \\\n  @testing-library/user-event@14.6.8 @testing-library/jest-dom@7.0.1 jsdom@30.1.3 happy-dom@21.0.3';
const SCRIPTS = CODE.pkg.split('\n').filter((l) => /"scripts"|"test|^  \},?$/.test(l)).slice(0, 7).join('\n');

const UU_TIEN_EN = `<table>
<thead><tr><th>Priority</th><th>Query</th><th>Finds an element by</th><th>In LabFlow</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>getByRole</code></td><td>its role and accessible name</td><td><code>getByRole('button', { name: 'Book' })</code></td></tr>
<tr><td>2</td><td><code>getByLabelText</code></td><td>the label of a form field</td><td><code>getByLabelText('Date')</code></td></tr>
<tr><td>3</td><td><code>getByPlaceholderText</code>, <code>getByText</code></td><td>text a user reads</td><td><code>getByText('No bookings yet.')</code></td></tr>
<tr><td>4</td><td><code>getByDisplayValue</code>, <code>getByAltText</code>, <code>getByTitle</code></td><td>other visible hints</td><td>rare</td></tr>
<tr><td>5</td><td><code>getByTestId</code></td><td><code>data-testid</code> — invisible to users</td><td>not used in this course</td></tr>
</tbody></table>`;
const UU_TIEN_VI = `<table>
<thead><tr><th>Ưu tiên</th><th>Truy vấn</th><th>Tìm phần tử theo</th><th>Trong LabFlow</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>getByRole</code></td><td>role và tên truy cập được</td><td><code>getByRole('button', { name: 'Book' })</code></td></tr>
<tr><td>2</td><td><code>getByLabelText</code></td><td>label của trường trong form</td><td><code>getByLabelText('Date')</code></td></tr>
<tr><td>3</td><td><code>getByPlaceholderText</code>, <code>getByText</code></td><td>chữ người dùng đọc thấy</td><td><code>getByText('No bookings yet.')</code></td></tr>
<tr><td>4</td><td><code>getByDisplayValue</code>, <code>getByAltText</code>, <code>getByTitle</code></td><td>các gợi ý nhìn thấy khác</td><td>hiếm khi</td></tr>
<tr><td>5</td><td><code>getByTestId</code></td><td><code>data-testid</code> — người dùng không thấy</td><td>khoá này không dùng</td></tr>
</tbody></table>`;

const HO_EN = `<table>
<thead><tr><th></th><th>0 matches</th><th>1 match</th><th>2 or more</th><th>Waits?</th></tr></thead>
<tbody>
<tr><td><code>getBy…</code></td><td>throws</td><td>the element</td><td>throws</td><td>no</td></tr>
<tr><td><code>queryBy…</code></td><td><code>null</code></td><td>the element</td><td>throws</td><td>no</td></tr>
<tr><td><code>findBy…</code></td><td>rejects after 1 s</td><td>the element</td><td>rejects</td><td>yes — returns a promise</td></tr>
<tr><td><code>getAllBy…</code> / <code>queryAllBy…</code> / <code>findAllBy…</code></td><td>throws / <code>[]</code> / rejects</td><td>array</td><td>array</td><td>as above</td></tr>
</tbody></table>`;
const HO_VI = `<table>
<thead><tr><th></th><th>0 kết quả</th><th>1 kết quả</th><th>từ 2 trở lên</th><th>Có chờ?</th></tr></thead>
<tbody>
<tr><td><code>getBy…</code></td><td>ném lỗi</td><td>phần tử</td><td>ném lỗi</td><td>không</td></tr>
<tr><td><code>queryBy…</code></td><td><code>null</code></td><td>phần tử</td><td>ném lỗi</td><td>không</td></tr>
<tr><td><code>findBy…</code></td><td>reject sau 1 giây</td><td>phần tử</td><td>reject</td><td>có — trả về promise</td></tr>
<tr><td><code>getAllBy…</code> / <code>queryAllBy…</code> / <code>findAllBy…</code></td><td>ném lỗi / <code>[]</code> / reject</td><td>mảng</td><td>mảng</td><td>như trên</td></tr>
</tbody></table>`;

export default {
  title: '6.1 — Testing Library: query by what users see|||6.1 — Testing Library: tìm phần tử theo thứ người dùng thấy',
  slug: 'tst-6-1-testing-library',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cài React 19 + Testing Library + jsdom cho LabFlow Lite (vitest.web.config.js, npm run test:web); form đặt phòng có label đúng chuẩn; thứ tự ưu tiên truy vấn (role → label → text → test id); getBy/queryBy/findBy; đo thật: bỏ cleanup ⇒ "Found multiple elements", jsdom 1.60 s so với happy-dom 1.17 s trên 16 test, happy-dom gửi preflight CORS làm MSW từ chối.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Testing Library: query by what users see</h2>
<p class="lead">Chapters 1–5 tested functions and HTTP. Users, however, meet LabFlow through a screen: a booking form and, for admins, a list. This chapter adds that screen to LabFlow Lite as two React components and tests them the way a person uses them. You need no React experience beyond JSX and <code>useState</code>; the components are short and fully shown.</p>

<h3>Setup</h3>
${ma('bash', CAI)}
<p>Component tests need a DOM, which Node does not have. <strong>jsdom</strong> is a DOM written in JavaScript; Vitest loads it when a file runs in the <code>jsdom</code> environment. The web tests get their own config so the unit suite stays DOM-free and fast:</p>
${ma('javascript', CODE.webConfig)}
${ma('javascript', CODE.setup)}
${ma('json', SCRIPTS)}
<p><code>npm run test:web</code> runs the reference tests in <code>web/</code>; the experiments of this chapter live in <code>demo6/</code> and are run one by one with <code>npx vitest run --config vitest.web.config.js demo6/&lt;file&gt;</code>. The main <code>vitest.config.js</code> now excludes <code>web/**</code> and <code>demo6/**</code>, so <code>npm run test:unit</code> is unchanged. No Babel or React plugin is needed: Vitest 5 compiles <code>.jsx</code> out of the box (measured — the Next.js guide adds <code>@vitejs/plugin-react</code>, which you will want for a real app).</p>

<h3>The component under test</h3>
${ma('javascript', FORM_UI)}
<p>Two details matter for testing. Every input is linked to its label through <code>htmlFor</code> and <code>id</code>, and an error is attached to its field with <code>aria-invalid</code> and <code>aria-describedby</code>. Those attributes exist for screen-reader users; Testing Library reads the page through the same accessibility information, so a test that finds “the Seats field” works exactly when a blind user can find it too. <code>'use client'</code> at the top marks it as a client component for Next.js (lesson 6.4); in tests it is just a string.</p>

<h3>Queries in priority order</h3>
${UU_TIEN_EN}
<p>The order comes from the Testing Library documentation and follows what users perceive. A CSS selector such as <code>container.querySelector('input[name=seats]')</code> is not on the list: it finds the input even when its label is broken, so the test stays green while the page fails users. Lab 6 plants exactly that bug.</p>

${ma('javascript', CODE.truyVan)}
${ra(gon(OUT['61-truy-van']))}
<p>Roles you will meet in this chapter: <code>textbox</code> (text input), <code>spinbutton</code> (number input), <code>button</code>, <code>form</code> (only when the form has a name — hence <code>aria-label="Book a lab"</code>), <code>table</code> and <code>row</code>, <code>status</code> and <code>alert</code>. Date and time inputs have no ARIA role, so their label is the right handle.</p>

<h3>getBy, queryBy, findBy</h3>
${HO_EN}
<p>Choose the family by what you expect: <em>must be there now</em> (<code>getBy</code>), <em>must not be there</em> (<code>queryBy</code> + <code>toBeNull()</code>), <em>will appear later</em> (<code>await findBy</code>, lesson 6.2). Two matches always fail — usually a duplicated element or, as the next section shows, a leftover from another test.</p>

<h3>Pitfall, measured: no cleanup between tests</h3>
${ma('javascript', CODE.donDep)}
${ra(DON_DEP)}
<p>With <code>afterEach(cleanup)</code> removed from the setup file, the first test’s form is still in the document when the second test renders its own: two Book buttons. Testing Library cleans up by itself only if a global <code>afterEach</code> exists — true in Jest or with Vitest’s <code>globals: true</code>, false in our setup. Even sneakier: <code>getByLabelText('Date')</code> did <em>not</em> fail in the same situation, because both labels point to the same <code>id</code> and resolve to the first input — the test would silently check the wrong form. One line in the setup file avoids all of this.</p>

<h3>jsdom or happy-dom? Measured</h3>
<p>Vitest supports two fake DOMs. Running the same 16 reference tests in each:</p>
${ra(DO)}
<p>happy-dom was about 25% faster here (three runs each: 1.60–1.64 s against 1.17–1.25 s). But running the MSW tests of lesson 6.3 under happy-dom turned five green tests red:</p>
${ra(HAPPY)}
<p>happy-dom implements <code>fetch</code> like a browser, including CORS: a request from the test page (<code>http://localhost:3000</code>) to another origin (<code>http://api.test</code>) with an <code>Authorization</code> header first sends an <code>OPTIONS</code> preflight. MSW, told to fail on unknown requests, refused it. Under jsdom the test uses Node’s <code>fetch</code>, which has no CORS. Calling the same origin, or answering <code>OPTIONS</code> in MSW, fixes it (verified). This course stays on jsdom — the environment the Next.js testing guide configures.</p>

${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-a2-1-testing', title: 'Also in FER202 — A2.1: Jest & React Testing Library', sub: 'Same: render, screen, getByRole first, user-event. Different: here with Vitest, a real form and list from LabFlow, and measured pitfalls (cleanup, jsdom vs happy-dom).', cta: 'OPEN FER202 LESSON →' })}
${lienKet({ khoa: 'react', bai: 'rx-9-1-testing-library', title: 'Also in the React course — 9.1: Testing Library', sub: 'The React side of the same tool; this chapter grows it into a test suite graded by mutants.', cta: 'OPEN LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>A stub client that never answers: the admin list shows “Loading bookings…” and no table.</li>
<li>A stub client with one booking: the five column headers are Lab, Date, Time, Seats, Status, in that order.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th61)}
${ra(gon(OUT['61-th']))}
<p>The stub is a plain object with one method — Chapter 3’s simplest double. <code>new Promise(() =&gt; {})</code> never settles, which freezes the screen in its first state.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DOM / jsdom</span><span class="v">The tree of elements a browser builds from HTML / a DOM implemented in JavaScript for Node.</span></div>
  <div class="kv"><span class="k">accessible name</span><span class="v">What assistive technology announces for an element: a label’s text, a button’s text, an <code>aria-label</code>.</span></div>
  <div class="kv"><span class="k">role</span><span class="v">What kind of thing an element is for assistive technology: button, textbox, alert…</span></div>
  <div class="kv"><span class="k">cleanup</span><span class="v">Unmounting what a test rendered so the next test starts from an empty page.</span></div>
  <div class="kv"><span class="k">CORS preflight</span><span class="v">An <code>OPTIONS</code> request a browser sends before some cross-origin requests to ask for permission.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 How Testing Library finds an element</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">render</div><div class="lz-d">the component into jsdom</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Accessibility tree</div><div class="lz-d">roles and names, as a screen reader sees them</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">getByRole</div><div class="lz-d">button “Book”, textbox “Lab”</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">getByLabelText</div><div class="lz-d">date and time fields</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Assert</div><div class="lz-d">jest-dom matchers: toBeEnabled, toHaveValue</div></div>
</div>
<div class="pitfall"><strong>No cleanup between tests.</strong> Without Vitest globals, Testing Library cannot unmount on its own: the second test found two Book buttons. Worse, <code>getByLabelText</code> did not fail — both labels pointed to the first form — so a test could silently check the wrong element. Register <code>afterEach(cleanup)</code> once.</div>
<h3>📌 Summary</h3>
<ul>
<li>Component tests run in a fake DOM; keep them in their own config.</li>
<li>Query by role and label — what users perceive — and never by CSS selector.</li>
<li><code>getBy</code> must be there, <code>queryBy</code> may be absent, <code>findBy</code> will appear.</li>
<li>Register <code>afterEach(cleanup)</code> once; leftovers can make tests check the wrong element.</li>
<li>jsdom here; happy-dom is faster but adds CORS to <code>fetch</code>.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Testing Library: tìm phần tử theo thứ người dùng thấy</h2>
<p class="lead">Chương 1–5 test hàm và HTTP. Nhưng người dùng gặp LabFlow qua màn hình: một form đặt phòng và, với admin, một danh sách. Chương này thêm màn hình đó vào LabFlow Lite dưới dạng hai component React và test chúng theo cách một người sử dụng. Bạn không cần biết React ngoài JSX và <code>useState</code>; các component ngắn và được in đầy đủ.</p>

<h3>Chuẩn bị</h3>
${ma('bash', CAI)}
<p>Test component cần một DOM, mà Node không có. <strong>jsdom</strong> là một DOM viết bằng JavaScript; Vitest nạp nó khi file chạy trong môi trường <code>jsdom</code>. Test web có config riêng để bộ unit test vẫn không có DOM và vẫn nhanh:</p>
${ma('javascript', CODE.webConfig)}
${ma('javascript', CODE.setup)}
${ma('json', SCRIPTS)}
<p><code>npm run test:web</code> chạy các test tham khảo trong <code>web/</code>; các thí nghiệm của chương nằm ở <code>demo6/</code> và chạy từng file bằng <code>npx vitest run --config vitest.web.config.js demo6/&lt;file&gt;</code>. <code>vitest.config.js</code> chính giờ loại <code>web/**</code> và <code>demo6/**</code>, nên <code>npm run test:unit</code> không đổi. Không cần Babel hay plugin React: Vitest 5 tự biên dịch <code>.jsx</code> (đã đo — hướng dẫn của Next.js có thêm <code>@vitejs/plugin-react</code>, thứ bạn sẽ cần cho app thật).</p>

<h3>Component được test</h3>
${ma('javascript', FORM_UI)}
<p>Hai chi tiết quan trọng cho việc test. Mỗi input nối với label qua <code>htmlFor</code> và <code>id</code>, và lỗi được gắn vào trường bằng <code>aria-invalid</code> và <code>aria-describedby</code>. Các thuộc tính đó tồn tại cho người dùng trình đọc màn hình; Testing Library đọc trang qua đúng thông tin trợ năng đó, nên một test tìm được “ô Seats” thì cũng đúng lúc người khiếm thị tìm được nó. <code>'use client'</code> ở đầu file đánh dấu đây là client component của Next.js (bài 6.4); trong test nó chỉ là một chuỗi.</p>

<h3>Thứ tự ưu tiên truy vấn</h3>
${UU_TIEN_VI}
<p>Thứ tự này lấy từ tài liệu Testing Library và đi theo thứ người dùng cảm nhận. Bộ chọn CSS như <code>container.querySelector('input[name=seats]')</code> không có trong danh sách: nó vẫn tìm thấy input ngay cả khi label đã hỏng, nên test vẫn xanh trong khi trang làm khó người dùng. Lab 6 cài đúng con bug đó.</p>

${ma('javascript', CODE.truyVan)}
${ra(gon(OUT['61-truy-van']))}
<p>Các role sẽ gặp trong chương: <code>textbox</code> (ô chữ), <code>spinbutton</code> (ô số), <code>button</code>, <code>form</code> (chỉ khi form có tên — vì thế có <code>aria-label="Book a lab"</code>), <code>table</code> và <code>row</code>, <code>status</code> và <code>alert</code>. Ô ngày và giờ không có role ARIA, nên label là tay cầm đúng.</p>

<h3>getBy, queryBy, findBy</h3>
${HO_VI}
<p>Chọn họ truy vấn theo điều bạn mong đợi: <em>phải có ngay</em> (<code>getBy</code>), <em>không được có</em> (<code>queryBy</code> + <code>toBeNull()</code>), <em>sẽ xuất hiện sau</em> (<code>await findBy</code>, bài 6.2). Hai kết quả khớp luôn là lỗi — thường là phần tử bị lặp hoặc, như mục sau cho thấy, phần còn sót từ test khác.</p>

<h3>Bẫy đo được: không dọn dẹp giữa các test</h3>
${ma('javascript', CODE.donDep)}
${ra(DON_DEP)}
<p>Bỏ <code>afterEach(cleanup)</code> khỏi file setup, form của test đầu vẫn nằm trong document khi test thứ hai render form của nó: hai nút Book. Testing Library chỉ tự dọn khi có <code>afterEach</code> toàn cục — đúng với Jest hoặc Vitest bật <code>globals: true</code>, sai với setup của ta. Còn lắt léo hơn: <code>getByLabelText('Date')</code> <em>không</em> hỏng trong cùng tình huống, vì cả hai label trỏ cùng một <code>id</code> và đều dẫn tới input đầu tiên — test sẽ lặng lẽ kiểm nhầm form. Một dòng trong file setup tránh được tất cả.</p>

<h3>jsdom hay happy-dom? Đo thật</h3>
<p>Vitest hỗ trợ hai DOM giả. Chạy cùng 16 test tham khảo trong từng cái:</p>
${ra(DO)}
<p>happy-dom nhanh hơn khoảng 25% (mỗi bên ba lần: 1,60–1,64 giây so với 1,17–1,25 giây). Nhưng chạy các test MSW của bài 6.3 dưới happy-dom làm năm test xanh thành đỏ:</p>
${ra(HAPPY)}
<p>happy-dom cài <code>fetch</code> giống trình duyệt, gồm cả CORS: request từ trang test (<code>http://localhost:3000</code>) sang origin khác (<code>http://api.test</code>) có header <code>Authorization</code> sẽ gửi preflight <code>OPTIONS</code> trước. MSW, được dặn đánh đỏ request lạ, đã từ chối nó. Dưới jsdom, test dùng <code>fetch</code> của Node, không có CORS. Gọi cùng origin, hoặc trả lời <code>OPTIONS</code> trong MSW, là sửa được (đã kiểm). Khoá này dùng jsdom — môi trường mà hướng dẫn test của Next.js cấu hình.</p>

${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-a2-1-testing', title: 'Đã gặp ở FER202 — A2.1: Jest & React Testing Library', sub: 'Giống: render, screen, getByRole trước, user-event. Khác: ở đây dùng Vitest, form và danh sách thật của LabFlow, và các bẫy đo được (dọn dẹp, jsdom so với happy-dom).', cta: 'MỞ BÀI FER202 →' })}
${lienKet({ khoa: 'react', bai: 'rx-9-1-testing-library', title: 'Gặp lại ở khoá React — 9.1: Testing Library', sub: 'Cùng công cụ nhìn từ phía React; chương này phát triển nó thành bộ test được chấm bằng đột biến.', cta: 'MỞ BÀI →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Một client stub không bao giờ trả lời: danh sách admin hiện “Loading bookings…” và không có bảng.</li>
<li>Một client stub có một lượt đặt: năm tiêu đề cột là Lab, Date, Time, Seats, Status, đúng thứ tự.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th61)}
${ra(gon(OUT['61-th']))}
<p>Stub là một object thường với một phương thức — test double đơn giản nhất của Chương 3. <code>new Promise(() =&gt; {})</code> không bao giờ hoàn tất, nên màn hình đứng yên ở trạng thái đầu.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DOM / jsdom</span><span class="v">Cây phần tử trình duyệt dựng từ HTML / một DOM viết bằng JavaScript cho Node.</span></div>
  <div class="kv"><span class="k">accessible name (tên truy cập được)</span><span class="v">Thứ công nghệ hỗ trợ đọc lên cho một phần tử: chữ của label, chữ trên nút, <code>aria-label</code>.</span></div>
  <div class="kv"><span class="k">role (vai trò)</span><span class="v">Phần tử là loại gì đối với công nghệ hỗ trợ: button, textbox, alert…</span></div>
  <div class="kv"><span class="k">cleanup (dọn dẹp)</span><span class="v">Gỡ những gì test đã render để test sau bắt đầu từ trang trống.</span></div>
  <div class="kv"><span class="k">CORS preflight</span><span class="v">Request <code>OPTIONS</code> trình duyệt gửi trước một số request khác origin để xin phép.</span></div>
</div>

<h3>🗺 Testing Library tìm phần tử thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">render</div><div class="lz-d">component vào jsdom</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Cây trợ năng</div><div class="lz-d">role và tên, như trình đọc màn hình thấy</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">getByRole</div><div class="lz-d">button “Book”, textbox “Lab”</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">getByLabelText</div><div class="lz-d">ô ngày và giờ</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Khẳng định</div><div class="lz-d">matcher jest-dom: toBeEnabled, toHaveValue</div></div>
</div>
<div class="pitfall"><strong>Không dọn dẹp giữa các test.</strong> Không có globals của Vitest, Testing Library không tự gỡ: test thứ hai thấy hai nút Book. Tệ hơn, <code>getByLabelText</code> không hỏng — cả hai label đều trỏ về form đầu — nên test có thể lặng lẽ kiểm nhầm phần tử. Đăng ký <code>afterEach(cleanup)</code> một lần.</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Test component chạy trong DOM giả; để chúng trong config riêng.</li>
<li>Truy vấn theo role và label — thứ người dùng cảm nhận — không bao giờ bằng bộ chọn CSS.</li>
<li><code>getBy</code> phải có, <code>queryBy</code> có thể vắng, <code>findBy</code> sẽ xuất hiện.</li>
<li>Đăng ký <code>afterEach(cleanup)</code> một lần; phần sót lại có thể khiến test kiểm nhầm phần tử.</li>
<li>Ở đây dùng jsdom; happy-dom nhanh hơn nhưng thêm CORS vào <code>fetch</code>.</li>
</ul>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-13-3-testing-library" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 13.3 — Testing UI the way users see it</span><span class="lc-sub">Queries by role, getBy/queryBy/findBy and user-event, run with jsdom</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-13-3-testing-library" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 13.3 — Kiểm thử giao diện như người dùng thấy</span><span class="lc-sub">Truy vấn theo vai trò, getBy/queryBy/findBy và user-event, chạy với jsdom</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-2-3-semantic-html" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 2.3 — why roles exist</span><span class="lc-sub">The accessibility tree that getByRole queries, measured on two identical-looking pages</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-2-3-semantic-html" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 2.3 — vai trò từ đâu mà có</span><span class="lc-sub">Cây trợ năng mà getByRole truy vấn, đo trên hai trang trông giống hệt nhau</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>
`,
};
