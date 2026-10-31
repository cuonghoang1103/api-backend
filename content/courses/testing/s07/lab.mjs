/**
 * Testing · Chương 7 · Lab 7 — Hành trình đầu-cuối: diệt 8 đột biến. BÀI MỚI 01/11/2026, slug tst-7-5-lab-e2e.
 * Máy chấm scripts/dot-bien-7.mjs (8 bug ở web/app/App.jsx, web/app/LoginForm.jsx, e2e/server.js; mỗi con: build web + bật server + Chromium).
 * Output thật: bộ yếu 3 test xanh diệt 2/8; lời giải 7 test (+2 setup) diệt 8/8, xanh cả với --repeat-each=3; unit 85 + web 16 vẫn xanh.
 */
import G from '../giang/tst-lab-7.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |✓|✘|passed|failed$|Running|mutants|killed|SURVIVED/.test(l)).join('\n');
const UNIT = OUT['lab7-unit'].split('\n').filter((l) => /^\$ |Tests |Test Files/.test(l)).join('\n');
const LAP = OUT['lab7-lap'].split('\n').filter((l) => /^\$ |Running|passed \(|failed$|flaky$/.test(l)).join('\n');
const GIO = OUT['lab7-thoi-gian'].split('\n').filter((l) => /^\$ |mutants killed|^real/.test(l)).join('\n');

const BUG_EN = `<table>
<thead><tr><th>#</th><th>File</th><th>Planted bug</th><th>What a user would notice</th></tr></thead>
<tbody>
<tr><td>1</td><td>App.jsx</td><td><code>role === 'LECTURER'</code> chooses the admin screen</td><td>the admin gets a booking form; lecturers get the admin list</td></tr>
<tr><td>2</td><td>App.jsx</td><td>Sign out no longer clears <code>localStorage</code></td><td>after signing out, a reload signs you in again — dangerous on a shared library PC</td></tr>
<tr><td>3</td><td>App.jsx</td><td>the saved session is never read back</td><td>every reload signs you out</td></tr>
<tr><td>4</td><td>e2e/server.js</td><td>any password is accepted</td><td>anyone can sign in as anyone</td></tr>
<tr><td>5</td><td>App.jsx</td><td>the user id is sent instead of the token</td><td>every booking fails</td></tr>
<tr><td>6</td><td>LoginForm.jsx</td><td>the error has no <code>role="alert"</code></td><td>a screen-reader user hears nothing after a wrong password</td></tr>
<tr><td>7</td><td>LoginForm.jsx</td><td>the username is sent as the password</td><td>nobody can sign in</td></tr>
<tr><td>8</td><td>e2e/server.js</td><td>boss is no longer an ADMIN</td><td>the admin account gets the booking form</td></tr>
</tbody></table>`;
const BUG_VI = `<table>
<thead><tr><th>#</th><th>File</th><th>Bug được cài</th><th>Người dùng sẽ thấy gì</th></tr></thead>
<tbody>
<tr><td>1</td><td>App.jsx</td><td><code>role === 'LECTURER'</code> chọn màn hình admin</td><td>admin nhận form đặt phòng; giảng viên lại nhận danh sách admin</td></tr>
<tr><td>2</td><td>App.jsx</td><td>Sign out không còn xoá <code>localStorage</code></td><td>đăng xuất xong, tải lại trang là đăng nhập lại — nguy hiểm trên máy dùng chung ở thư viện</td></tr>
<tr><td>3</td><td>App.jsx</td><td>phiên đã lưu không bao giờ được đọc lại</td><td>mỗi lần tải lại là bị đăng xuất</td></tr>
<tr><td>4</td><td>e2e/server.js</td><td>mật khẩu nào cũng được nhận</td><td>ai cũng đăng nhập được bằng tài khoản của bất kỳ ai</td></tr>
<tr><td>5</td><td>App.jsx</td><td>gửi id người dùng thay cho token</td><td>mọi lượt đặt đều hỏng</td></tr>
<tr><td>6</td><td>LoginForm.jsx</td><td>lỗi không có <code>role="alert"</code></td><td>người dùng trình đọc màn hình không nghe thấy gì sau khi sai mật khẩu</td></tr>
<tr><td>7</td><td>LoginForm.jsx</td><td>gửi username làm mật khẩu</td><td>không ai đăng nhập được</td></tr>
<tr><td>8</td><td>e2e/server.js</td><td>boss không còn là ADMIN</td><td>tài khoản admin nhận form đặt phòng</td></tr>
</tbody></table>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>Mutants killed</td><td>4 (0.5 each)</td><td><code>node scripts/dot-bien-7.mjs</code></td></tr>
<tr><td>Journeys, not details: sign-in errors, reload and sign-out, roles, booking outcomes, one cross-user journey</td><td>2</td><td>read the tests</td></tr>
<tr><td>Web-first assertions only — no <code>waitForTimeout</code>, no <code>isVisible()</code> or <code>textContent()</code> inside <code>expect</code>; locators by role and label</td><td>2</td><td>read the tests</td></tr>
<tr><td>Own data per test (<code>freshLab</code>); green with <code>--repeat-each=3</code></td><td>1</td><td>run it</td></tr>
<tr><td>Saved session where login is not the subject; login tests start signed out</td><td>1</td><td>read the tests</td></tr>
</tbody></table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>Số đột biến bị diệt</td><td>4 (0,5 mỗi con)</td><td><code>node scripts/dot-bien-7.mjs</code></td></tr>
<tr><td>Hành trình, không phải chi tiết: lỗi đăng nhập, tải lại và đăng xuất, vai trò, kết cục đặt phòng, một hành trình giữa hai người</td><td>2</td><td>đọc test</td></tr>
<tr><td>Chỉ assertion web-first — không <code>waitForTimeout</code>, không <code>isVisible()</code> hay <code>textContent()</code> trong <code>expect</code>; locator theo role và label</td><td>2</td><td>đọc test</td></tr>
<tr><td>Mỗi test dữ liệu riêng (<code>freshLab</code>); xanh với <code>--repeat-each=3</code></td><td>1</td><td>chạy thử</td></tr>
<tr><td>Phiên lưu sẵn ở chỗ không phải test đăng nhập; test đăng nhập bắt đầu khi chưa đăng nhập</td><td>1</td><td>đọc test</td></tr>
</tbody></table>`;

const DIET_EN = `<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">a wrong password is refused with an alert</span><span class="lz-lnote">#4 any password · #6 silent error</span></div>
  <div class="lz-layer"><span class="lz-lname">a session survives a reload; signing out ends it</span><span class="lz-lnote">#2 sign-out keeps the session · #3 reload signs out</span></div>
  <div class="lz-layer"><span class="lz-lname">an admin sees the list, not the form</span><span class="lz-lnote">#1 roles mixed up · #8 boss lost ADMIN</span></div>
  <div class="lz-layer"><span class="lz-lname">booking journeys (confirmed, pending, taken)</span><span class="lz-lnote">#5 wrong token · #3 again (saved session not read)</span></div>
  <div class="lz-layer"><span class="lz-lname">auth.setup.js — signing in at all</span><span class="lz-lnote">#7 username sent as password</span></div>
</div>`;
const DIET_VI = `<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">a wrong password is refused with an alert</span><span class="lz-lnote">#4 mật khẩu nào cũng nhận · #6 lỗi im lặng</span></div>
  <div class="lz-layer"><span class="lz-lname">a session survives a reload; signing out ends it</span><span class="lz-lnote">#2 đăng xuất vẫn giữ phiên · #3 tải lại bị đăng xuất</span></div>
  <div class="lz-layer"><span class="lz-lname">an admin sees the list, not the form</span><span class="lz-lnote">#1 nhầm vai trò · #8 boss mất ADMIN</span></div>
  <div class="lz-layer"><span class="lz-lname">hành trình đặt phòng (xác nhận, chờ duyệt, bị chiếm)</span><span class="lz-lnote">#5 sai token · #3 lần nữa (phiên lưu không được đọc)</span></div>
  <div class="lz-layer"><span class="lz-lname">auth.setup.js — đăng nhập được hay không</span><span class="lz-lnote">#7 gửi username làm mật khẩu</span></div>
</div>`;

export default {
  title: 'Lab 7 — End-to-end journeys: kill 8 mutants in the app, the login and the server|||Lab 7 — Hành trình đầu-cuối: diệt 8 đột biến trong app, form đăng nhập và server',
  slug: 'tst-7-5-lab-e2e',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 7, thang chấm 10 điểm: viết e2e/dang-nhap.spec.js và e2e/dat-phong.spec.js bằng Playwright; script dot-bien-7.mjs cài 8 bug ở chỗ nối mà không unit test nào chạm tới (nhầm vai trò, đăng xuất không xoá phiên, tải lại mất phiên, nhận mọi mật khẩu, sai token, lỗi đăng nhập không phải alert, gửi username làm mật khẩu, admin mất vai trò), mỗi con build lại app + bật server + Chromium. Output thật: bộ yếu 3 test xanh diệt 2/8; lời giải 7 hành trình diệt 8/8 và xanh với --repeat-each=3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lab 7</span>
<h2>End-to-end journeys: kill 8 mutants</h2>
<p class="lead">About 90 minutes. Same grading idea as Labs 1–6, now for the whole app: a script plants eight bugs, one at a time, and your browser tests must turn red for each. This time the bugs live in the <em>wiring</em> — where the session is stored, which screen a role gets, what the login form sends — places that every unit, API and component test of Chapters 1–6 passes straight over.</p>
<p><strong>After this lab you can</strong> design a small e2e suite from the journeys of an app, prove its strength with mutants instead of a feeling, and keep it fast and repeatable. <strong>Why it is useful:</strong> this is the shape of a real task — “we keep breaking sign-in and roles when we release, add some e2e tests” — and the grader tells you, objectively, whether your tests would have caught the last eight incidents.</p>

<h3>Setup</h3>
<ol>
<li>LabFlow Lite as it is after lesson 7.4: <code>web/app/</code>, <code>e2e/server.js</code>, <code>e2e/helpers.js</code> (<code>signIn</code>, <code>book</code>, <code>freshLab</code>), <code>e2e/auth.setup.js</code> and <code>playwright.config.js</code> with the setup project. Port 4173 must be free.</li>
<li>Create <code>scripts/dot-bien-7.mjs</code>:
${ma('javascript', CODE.dotBien7)}</li>
</ol>
<p>Each mutant changes one line, runs <code>npx playwright test e2e/ --project=chromium</code> — which builds the app, starts the server and a browser — and puts the file back in <code>finally</code>, even if you stop it halfway. The <code>reuseExistingServer: false</code> of lesson 7.1 matters here: a server left running from an earlier run would serve the <em>unmutated</em> app and every mutant would “survive”.</p>
${BUG_EN}

<h3>Your task</h3>
<p>Write <code>e2e/dang-nhap.spec.js</code> (signing in and out) and <code>e2e/dat-phong.spec.js</code> (booking journeys) so that <code>npm run test:e2e</code> is green, also with <code>--repeat-each=3</code>, and <code>node scripts/dot-bien-7.mjs</code> prints <strong>8/8</strong>. Change no app code. Start from the journeys of the app — what must a student, a lecturer and an admin be able to do? — not from the bug table; the table only tells you how strong your suite turned out.</p>

<h3>What a first attempt usually looks like</h3>
${ma('javascript', CODE.weak7)}
${ra(gon(OUT['lab7-weak-run']))}
${ra(gon(OUT['lab7-mut-weak']))}
<p>Three green tests, two bugs noticed — the two that break <em>everything</em>: with the wrong token (#5) no booking ever says “Booked”, and with the username sent as the password (#7) nobody can sign in. The other six survive, and each survival has a reason you can read in the code:</p>
<ul>
<li><code>expect(page.url()).toContain('localhost')</code> is true for every page, signed in or not, admin or not (#1, #8).</li>
<li>Nothing reloads the page or signs out (#2, #3).</li>
<li>Nobody types a wrong password (#4, #6).</li>
<li><code>waitForTimeout(500)</code> + <code>textContent('body')</code> happened to work here, but it is the one-shot pattern lesson 7.1 measured failing on a slower server.</li>
</ul>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}
<p>Mutants are only 4 of the 10 points. A suite can kill 8/8 and still be poor — a single giant test, sleeps that happen to be long enough, one hard-coded lab that collides on the second run. The rest of the rubric checks the habits of the chapter.</p>

<h3>Hints — open one at a time</h3>
<ol>
<li>Type a wrong password: expect an <code>alert</code> with the exact text, and the “Sign in” heading still there.</li>
<li>Sign in, reload, expect to be still signed in; sign out, reload, expect the sign-in form.</li>
<li>Sign in as boss: expect the “All bookings” heading and <em>no</em> Book button (<code>toHaveCount(0)</code>).</li>
<li>Book as an in one context, open a second context as boss and find the row by the lab code.</li>
<li>Run with <code>--repeat-each=3</code> before calling it done.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('javascript', CODE.dangNhap)}
${ma('javascript', CODE.datPhong)}
<p>Plus <code>e2e/auth.setup.js</code> and <code>e2e/helpers.js</code> from lesson 7.2. The login tests start signed out on purpose; the booking tests reuse the saved session; every booking uses <code>freshLab</code>.</p>
${ra(gon(OUT['lab7-ref']))}
${ra(gon(OUT['lab7-mut-strong']))}
${ra(LAP)}
${ra(GIO)}
${ra(UNIT)}
<p>Seven journeys in about four seconds, 8/8, still green when every test runs three times against one server, and the 85 unit and 16 component tests untouched. The whole grading run took the time shown above — each of the eight mutants rebuilds the app and starts a server and a browser. That cost is exactly why e2e suites stay small.</p>
${DIET_EN}

<h3>Before you call it done</h3>
<ul>
<li><code>npm run test:e2e</code> green, also with <code>-- --repeat-each=3</code>.</li>
<li><code>node scripts/dot-bien-7.mjs</code> prints <strong>8/8 mutants killed</strong>.</li>
<li><code>npm run test:unit</code> (85) and <code>npm run test:web</code> (16) still green.</li>
<li>No <code>waitForTimeout</code>, no <code>isVisible()</code> inside <code>expect</code>, no CSS selectors in your tests.</li>
<li><code>git status</code>: no <code>playwright/.auth/</code>, <code>dist-web/</code> or <code>test-results/</code>. Commit: <code>test: LabFlow Lite journeys end to end (Lab 7, 8/8)</code>.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Lab 7</span>
<h2>Hành trình đầu-cuối: diệt 8 đột biến</h2>
<p class="lead">Khoảng 90 phút. Cùng ý tưởng chấm như Lab 1–6, giờ cho cả ứng dụng: một script cài tám bug, mỗi lần một con, và test trình duyệt của bạn phải đỏ với từng con. Lần này bug nằm ở <em>chỗ nối</em> — phiên được lưu ở đâu, vai trò nào nhận màn hình nào, form đăng nhập gửi gì đi — những chỗ mà mọi unit test, test API và test component của Chương 1–6 đều đi lướt qua.</p>
<p><strong>Sau lab này bạn có thể</strong> thiết kế một bộ e2e nhỏ từ các hành trình của ứng dụng, chứng minh độ mạnh của nó bằng đột biến thay vì cảm giác, và giữ nó nhanh, lặp lại được. <strong>Vì sao hữu ích:</strong> đây chính là dạng việc thật — “lần phát hành nào bọn mình cũng làm hỏng đăng nhập và phân quyền, thêm test e2e đi” — và máy chấm cho bạn biết, một cách khách quan, bộ test của bạn có bắt được tám sự cố gần nhất hay không.</p>

<h3>Chuẩn bị</h3>
<ol>
<li>LabFlow Lite như sau bài 7.4: <code>web/app/</code>, <code>e2e/server.js</code>, <code>e2e/helpers.js</code> (<code>signIn</code>, <code>book</code>, <code>freshLab</code>), <code>e2e/auth.setup.js</code> và <code>playwright.config.js</code> có setup project. Cổng 4173 phải trống.</li>
<li>Tạo <code>scripts/dot-bien-7.mjs</code>:
${ma('javascript', CODE.dotBien7)}</li>
</ol>
<p>Mỗi đột biến đổi một dòng, chạy <code>npx playwright test e2e/ --project=chromium</code> — lệnh này build app, bật server và trình duyệt — rồi trả file về trong <code>finally</code>, kể cả khi bạn dừng giữa chừng. <code>reuseExistingServer: false</code> của bài 7.1 quan trọng ở đây: một server còn chạy từ lần trước sẽ phục vụ app <em>chưa bị đột biến</em> và con đột biến nào cũng “sống”.</p>
${BUG_VI}

<h3>Nhiệm vụ</h3>
<p>Viết <code>e2e/dang-nhap.spec.js</code> (đăng nhập và đăng xuất) và <code>e2e/dat-phong.spec.js</code> (hành trình đặt phòng) sao cho <code>npm run test:e2e</code> xanh, cả khi chạy với <code>--repeat-each=3</code>, và <code>node scripts/dot-bien-7.mjs</code> in <strong>8/8</strong>. Không sửa code ứng dụng. Bắt đầu từ các hành trình của ứng dụng — sinh viên, giảng viên và admin phải làm được gì? — chứ không từ bảng bug; bảng chỉ cho bạn biết bộ test cuối cùng mạnh tới đâu.</p>

<h3>Lần thử đầu thường trông thế này</h3>
${ma('javascript', CODE.weak7)}
${ra(gon(OUT['lab7-weak-run']))}
${ra(gon(OUT['lab7-mut-weak']))}
<p>Ba test xanh, hai bug bị phát hiện — hai con làm hỏng <em>tất cả</em>: sai token (#5) thì không lượt đặt nào báo “Booked”, gửi username làm mật khẩu (#7) thì không ai đăng nhập được. Sáu con còn lại sống, và con nào sống cũng có lý do đọc được ngay trong code:</p>
<ul>
<li><code>expect(page.url()).toContain('localhost')</code> đúng với mọi trang, đăng nhập hay chưa, admin hay không (#1, #8).</li>
<li>Không có gì tải lại trang hay đăng xuất (#2, #3).</li>
<li>Không ai gõ sai mật khẩu (#4, #6).</li>
<li><code>waitForTimeout(500)</code> + <code>textContent('body')</code> tình cờ chạy được ở đây, nhưng đó là mẫu kiểm-một-lần mà bài 7.1 đã đo thấy đỏ khi server chậm hơn.</li>
</ul>

<h3>Thang chấm (10 điểm, đạt từ 7)</h3>
${RUBRIC_VI}
<p>Đột biến chỉ chiếm 4 trên 10 điểm. Một bộ test có thể diệt 8/8 mà vẫn kém — một test khổng lồ duy nhất, những lần sleep tình cờ đủ dài, một phòng cố định đụng nhau ở lần chạy thứ hai. Phần còn lại của thang chấm kiểm các thói quen của chương.</p>

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Gõ sai mật khẩu: mong một <code>alert</code> đúng câu chữ, và tiêu đề “Sign in” vẫn còn đó.</li>
<li>Đăng nhập, tải lại, mong vẫn còn đăng nhập; đăng xuất, tải lại, mong thấy form đăng nhập.</li>
<li>Đăng nhập bằng boss: mong tiêu đề “All bookings” và <em>không có</em> nút Book (<code>toHaveCount(0)</code>).</li>
<li>Đặt phòng bằng an trong một context, mở context thứ hai bằng boss và tìm dòng theo mã phòng.</li>
<li>Chạy với <code>--repeat-each=3</code> trước khi coi là xong.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã thử)</h3>
${ma('javascript', CODE.dangNhap)}
${ma('javascript', CODE.datPhong)}
<p>Cộng <code>e2e/auth.setup.js</code> và <code>e2e/helpers.js</code> từ bài 7.2. Test đăng nhập cố ý bắt đầu khi chưa đăng nhập; test đặt phòng dùng lại phiên đã lưu; mọi lượt đặt đều dùng <code>freshLab</code>.</p>
${ra(gon(OUT['lab7-ref']))}
${ra(gon(OUT['lab7-mut-strong']))}
${ra(LAP)}
${ra(GIO)}
${ra(UNIT)}
<p>Bảy hành trình trong khoảng bốn giây, 8/8, vẫn xanh khi mọi test chạy ba lần trên cùng một server, và 85 unit test cùng 16 test component không bị đụng tới. Cả lượt chấm mất đúng thời gian in ở trên — mỗi con trong tám đột biến đều build lại app, bật server và trình duyệt. Cái giá đó chính là lý do bộ e2e luôn được giữ nhỏ.</p>
${DIET_VI}

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run test:e2e</code> xanh, cả với <code>-- --repeat-each=3</code>.</li>
<li><code>node scripts/dot-bien-7.mjs</code> in <strong>8/8 mutants killed</strong>.</li>
<li><code>npm run test:unit</code> (85) và <code>npm run test:web</code> (16) vẫn xanh.</li>
<li>Không <code>waitForTimeout</code>, không <code>isVisible()</code> trong <code>expect</code>, không bộ chọn CSS trong test.</li>
<li><code>git status</code>: không có <code>playwright/.auth/</code>, <code>dist-web/</code> hay <code>test-results/</code>. Commit: <code>test: LabFlow Lite journeys end to end (Lab 7, 8/8)</code>.</li>
</ul>
</div>
`,
};
