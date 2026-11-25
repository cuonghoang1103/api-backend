/**
 * 9.3 — Lỗi hồi quy do thư viện: diff lockfile, npm ls, mvn dependency:tree (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: npm 10.9.7 + Verdaccio 6 (registry nội bộ 127.0.0.1:44873, gói @labflow/tien-te 1.0.0…1.7.0, @labflow/loi 1.0.0/2.0.0 tự phát hành),
 * Maven 3.9.11 + JDK 25 offline (commons-lang3 3.16.0 / 3.18.0) — scratchpad/dbg/lab/ch9/c93 (o-93-*.txt).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { REGISTRY, VERDACCIO, TAO_GOI, C93_CHUAN_BI, CHIA_DOI, C93_NPM, APP_PKG, APP_HOA_DON, APP_XU_LY, APP_TEST, POM_TK, POM_APP, TIM_KIEM, MAIN_J, C93_MVN } from './_ma-9.mjs';
import { TU_NANG, DIEU_TRA, CHIA_DOI as CD_RA, HAI_BAN, CI_LECH, MVN, MVN_SUA } from './_ra-9.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const BANG_SEMVER = `<table>
<thead><tr><th>In package.json / Trong package.json</th><th>Allows / Cho phép</th><th>Example / Ví dụ</th></tr></thead>
<tbody>
<tr><td><code>"^1.2.0"</code> (npm default / mặc định của npm)</td><td>&gt;=1.2.0 &lt;2.0.0</td><td>1.4.1, 1.5.0, 1.7.0 …</td></tr>
<tr><td><code>"~1.4.1"</code></td><td>&gt;=1.4.1 &lt;1.5.0</td><td>1.4.1, 1.4.9</td></tr>
<tr><td><code>"1.4.1"</code></td><td>exactly / đúng 1.4.1</td><td>1.4.1</td></tr>
<tr><td><code>"^0.3.0"</code></td><td>&gt;=0.3.0 &lt;0.4.0</td><td>0.x: minor = breaking</td></tr>
<tr><td>Maven <code>&lt;version&gt;3.16.0&lt;/version&gt;</code></td><td>"soft" 3.16.0 — conflict resolution may pick another / "mềm" — giải xung đột có thể chọn bản khác</td><td>nearest wins</td></tr>
</tbody></table>`;

const BANG_CI_EN = `<table>
<thead><tr><th></th><th><code>npm install</code></th><th><code>npm ci</code></th></tr></thead>
<tbody>
<tr><td>Reads</td><td>package.json, then lockfile if compatible</td><td>lockfile only (must match package.json)</td></tr>
<tr><td>Can change the lockfile</td><td>yes</td><td>never — mismatch is an error</td></tr>
<tr><td>node_modules</td><td>updates in place</td><td>deletes and reinstalls</td></tr>
<tr><td>Use for</td><td>adding/upgrading a dependency on purpose</td><td>CI, Docker images, a fresh clone, bisect</td></tr>
</tbody></table>`;
const BANG_CI_VI = `<table>
<thead><tr><th></th><th><code>npm install</code></th><th><code>npm ci</code></th></tr></thead>
<tbody>
<tr><td>Đọc</td><td>package.json, rồi lockfile nếu khớp</td><td>chỉ lockfile (phải khớp package.json)</td></tr>
<tr><td>Có thể đổi lockfile</td><td>có</td><td>không bao giờ — lệch là lỗi</td></tr>
<tr><td>node_modules</td><td>cập nhật tại chỗ</td><td>xoá rồi cài lại</td></tr>
<tr><td>Dùng khi</td><td>chủ động thêm/nâng một thư viện</td><td>CI, ảnh Docker, clone mới, bisect</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📘', 'npm ci — tài liệu npm', 'Cài đúng theo lockfile; lệch package.json là lỗi.', 'https://docs.npmjs.com/cli/v10/commands/npm-ci'),
  nguon('📘', 'package.json — dependencies, overrides, peerDependencies, engines', 'Cú pháp range ^ ~, ghi đè phiên bản trong cây.', 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json'),
  nguon('📘', 'Maven — Introduction to the Dependency Mechanism', 'Dependency mediation: "nearest definition"; dependencyManagement.', 'https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html'),
  nguon('📘', 'Verdaccio — registry npm riêng', 'Registry nội bộ nhẹ, proxy npmjs — dùng cho lab.', 'https://www.verdaccio.org/docs/what-is-verdaccio'),
  nguon('🛡', 'aws-cdk #18322 (08/01/2022): cannot deploy due to colors dependency', 'colors 1.4.x tự phá: in "LIBERTY" vô tận; CDK kéo về qua range ^.', 'https://github.com/aws/aws-cdk/issues/18322'),
  nguon('🛡', 'GitHub Advisory GHSA-pjwm-rvh2-c87w — ua-parser-js (CVE-2021-4229)', '0.7.29, 0.8.0, 1.0.0 bị chèn mã độc (10/2021).', 'https://github.com/advisories/GHSA-pjwm-rvh2-c87w'),
  nguon('🛡', 'npm Blog — Details about the event-stream incident (11/2018)', 'Người bảo trì mới thêm flatmap-stream 0.1.1 nhắm ví Copay.', 'https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident'),
  nguon('🛡', 'oss-security 29/03/2024 — backdoor in upstream xz/liblzma (CVE-2024-3094)', 'Phát hiện vì đăng nhập ssh chậm đi và lỗi valgrind.', 'https://www.openwall.com/lists/oss-security/2024/03/29/4'),
  nguon('🛡', 'GitHub Blog 22/09/2025 — Our plan for a more secure npm supply chain', 'Sâu Shai-Hulud (14/09/2025) qua tài khoản người bảo trì bị chiếm.', 'https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/'),
  nguon('📰', 'npm Blog — kik, left-pad, and npm (03/2016)', 'Gỡ một gói nhỏ làm hỏng build khắp nơi.', 'https://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-9-1-bisect-run', title: 'Bài 9.1 — git bisect run', sub: 'Cùng ý tưởng chia đôi, áp lên lịch sử commit.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '9.3 — Dependency regressions: lockfile diffs, npm ls, mvn dependency:tree|||9.3 — Lỗi hồi quy do thư viện: diff lockfile, npm ls, mvn dependency:tree',
  slug: 'dbg-9-3-phu-thuoc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Không ai sửa mã mà ứng dụng vẫn đổi: thư viện đã đổi. Dựng registry npm riêng (Verdaccio, như Nexus ở công ty) và phát hành thật @labflow/tien-te 1.0.0…1.7.0. Máy An npm ci ⇒ xanh; máy Bình "xoá lock cho hết xung đột" ⇒ ^1.2.0 tự nâng lên 1.7.0 ⇒ test đỏ mà hai chuỗi trông y hệt (byte a0 NBSP của Intl so với 20). Điều tra bằng git diff package-lock.json, npm ls, mã điểm Unicode; chia đôi phiên bản bằng script (2 lượt ⇒ 1.5.0 "perf: dùng Intl.NumberFormat"); npm ci báo lệch lockfile. Hai bản cùng một gói: @labflow/loi 2.0.0 ở gốc, 1.0.0 lồng trong tien-te ⇒ instanceof sai ⇒ 500 thay vì 400; npm explain, overrides ⇒ deduped ⇒ 400. Maven: biên dịch xanh, chạy NoClassDefFoundError org/apache/commons/lang3/Strings vì app khai báo 3.16.0 gần hơn 3.18.0 (nearest wins); sửa bằng dependencyManagement. Góc hacker: left-pad 2016, event-stream 2018, ua-parser-js 2021, colors 2022, xz 2024, Shai-Hulud 2025.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Nobody changed the code — the libraries changed</h2>
<p class="lead">Bisect in lesson 9.1 searches <em>your</em> history. But your application is mostly code you did not write: a modest Node API pulls in hundreds of packages, a Spring Boot service a hundred JARs. They change too — sometimes because someone upgraded them on purpose, often because a version range or a missing lockfile let them change silently. This lesson reproduces both cases for real, on npm and on Maven, and gives you the three tools that answer "which library, which version, since when": the lockfile diff, the dependency tree, and bisecting versions.</p>

<h3>An everyday picture: the supplier changed the flour</h3>
<p>The bakery's recipe has not changed in a year, but this week's bread is different. The supplier "improved" the flour and printed it in small letters on page three of a leaflet nobody read. The baker who wrote down <em>"flour, brand X, batch 2024-11"</em> can prove it in a minute; the one who wrote <em>"any flour from X"</em> cannot. A lockfile is the batch number.</p>

<h3>1. Ranges and lockfiles in one table</h3>
${BANG_SEMVER}
<p><code>npm install some-lib</code> writes <code>"^x.y.z"</code> by default: "any later version with the same major". Semantic versioning <em>promises</em> that minor and patch releases do not break you; it cannot enforce it. The lockfile (<code>package-lock.json</code>) records the exact version, URL and integrity hash that were installed, so every machine gets the same tree — as long as everyone installs from it.</p>
${BANG_CI_EN}

<h3>2. Setting up a private registry (like the one at your company)</h3>
<p>To reproduce "a library released a new minor version" without depending on strangers, the lab runs its own npm registry with Verdaccio — the same role Nexus or Artifactory play in outsourcing companies — and publishes a fake internal package, <code>@labflow/tien-te</code> (money formatting), version by version. The team created its lockfile when 1.4.1 was the latest; 1.5.0 to 1.7.0 were published afterwards.</p>
<details><summary>registry.sh · verdaccio-config.yaml · c93/chuan-bi.sh</summary>${ma(REGISTRY, 'bash')}${ma(VERDACCIO, 'yaml')}${ma(C93_CHUAN_BI, 'bash')}</details>
<details><summary>c93/goi/tao-goi.mjs — the versions and their changelog</summary>${ma(TAO_GOI)}</details>
<details><summary>c93/app — package.json, src/hoa-don.mjs, src/xu-ly.mjs, test</summary>${ma(APP_PKG, 'json')}${ma(APP_HOA_DON)}${ma(APP_XU_LY)}${ma(APP_TEST)}</details>

<h3>3. "Delete the lockfile to fix the conflict"</h3>
${ra(TU_NANG)}
<p>An's machine installs from the lockfile: green. Bình hit a merge conflict in <code>package-lock.json</code> and did what many students do — deleted it with <code>node_modules</code> and ran <code>npm install</code>. npm resolved <code>^1.2.0</code> again, picked the newest 1.7.0, and the test failed with the strangest message you will ever see: <strong>expected and actual look identical</strong>. When a diff shows two equal-looking strings, stop reading the strings and read the bytes.</p>
${ra(DIEU_TRA)}
<p>Four commands, four facts. <code>git diff package-lock.json</code>: tien-te went from 1.4.1 to 1.7.0, and a new package (<code>@labflow/loi@1.0.0</code>) appeared. <code>npm ls</code> confirms what is installed now. <code>npm view … versions</code> lists the candidates. And the code points settle the mystery: the library now returns <code>a0</code> (U+00A0, no-break space) before "₫" where the test has <code>20</code>, a normal space — <code>Intl.NumberFormat('vi-VN')</code> uses NBSP. Nobody wrote "space changed" in a changelog.</p>

<h3>4. Bisect the versions, then read the changelog</h3>
${ma(CHIA_DOI)}
${ra(CD_RA)}
<p>The same idea as <code>git bisect</code>, applied to the version list: install a version with <code>--no-save</code> (package.json and the lockfile stay untouched), run the check, halve. Three candidates between the last good and first bad: two runs. The changelog of 1.5.0 says only <em>"perf: use Intl.NumberFormat instead of regex (≈3× faster)"</em> — a performance change that silently changed output. That is normal: breaking changes hide in "perf", "refactor", "improve", "align with standard". Now you can choose a fix on purpose:</p>
<ul>
<li><strong>Stay</strong> on 1.4.x (<code>"~1.4.1"</code> or exact) and open an issue upstream with your two-line reproduction.</li>
<li><strong>Adapt</strong>: accept 1.5+ and fix your code and test (compare after normalising spaces, or assert on the number and format separately).</li>
<li>Either way, keep the lockfile, review lockfile changes in PRs, and let a bot (Renovate, Dependabot) propose upgrades one by one — each upgrade then has its own CI run, and bisecting becomes trivial.</li>
</ul>

<h3>5. Two copies of the same package</h3>
${ra(HAI_BAN)}
<p>The team upgrades on purpose to use the new <code>tong()</code>. Invalid input should give 400 (<code>LoiNghiepVu</code>), it gives 500. <code>npm ls @labflow/loi</code> shows why: the application uses <code>loi@2.0.0</code>, but tien-te 1.7.0 asks for <code>^1.0.0</code>, so npm nested a second copy inside <code>node_modules/@labflow/tien-te/node_modules</code>. Two copies means two different <code>LoiNghiepVu</code> classes; <code>e instanceof LoiNghiepVu</code> compares against the wrong one and returns false. <code>npm explain</code> prints who requires which version. React's "Invalid hook call" has the same cause when two copies of React end up in one bundle.</p>
<p><code>overrides</code> forces one version for the whole tree (<code>deduped</code>, then 400). It is a decision, not a fix: you now run tien-te against a major version it was not tested with — here it only uses the constructor, so it is safe; read the library before overriding. The proper fix belongs to the library author: declare <code>@labflow/loi</code> as a <code>peerDependency</code>, so the application provides the single copy. In your own code, prefer checking a stable field (<code>e.name === 'LoiNghiepVu'</code> or an error <code>code</code>) across package boundaries.</p>
${ra(CI_LECH)}
<p>And the guard that protects CI: <code>npm ci</code> refuses to run when <code>package.json</code> and the lockfile disagree. If your Dockerfile or CI script uses <code>npm install</code>, you lose that guard — the lab in 9.4 is exactly that bug.</p>
<details><summary>c93/c93-npm.sh — every npm command of this lesson</summary>${ma(C93_NPM, 'bash')}</details>

<h3>6. Maven: compiles, then <code>NoClassDefFoundError</code></h3>
<p>A two-module Maven build: <code>tim-kiem</code> (another team's module) uses <code>Strings.CI.contains</code>, which exists from commons-lang3 <strong>3.18.0</strong>; <code>app</code> depends on <code>tim-kiem</code> and also declares commons-lang3 <strong>3.16.0</strong> directly, added last year for <code>StringUtils.isBlank</code>.</p>
<details><summary>tim-kiem/pom.xml · TimKiem.java · app/pom.xml · Main.java</summary>${ma(POM_TK, 'xml')}${ma(TIM_KIEM, 'java')}${ma(POM_APP, 'xml')}${ma(MAIN_J, 'java')}</details>
${ra(MVN)}
<p>Everything compiles — each module is compiled against its own declared version. At run time there is only one classpath, and Maven's rule for conflicts is <strong>"nearest wins"</strong>: the version declared closest to the application in the dependency tree is chosen, not the highest. <code>app</code> declares 3.16.0 at depth 1; 3.18.0 sits at depth 2 under <code>tim-kiem</code>. Result: <code>NoClassDefFoundError: org/apache/commons/lang3/Strings</code> at the first search. The same mechanism gives <code>NoSuchMethodError</code> when a method (not a class) is missing. Comparing the tree of each module shows the conflict; on this machine <code>-Dverbose</code> of maven-dependency-plugin 3.7.0 did not print the omitted node, so do not rely on it — compare trees, or check the JAR (<code>unzip -l … | grep</code>).</p>
${ra(MVN_SUA)}
<p>Fix: remove the stale direct declaration and manage one version for the whole build in the parent's <code>&lt;dependencyManagement&gt;</code>. In Spring Boot projects the Boot BOM already manages hundreds of versions; overriding one of them (<code>&lt;jackson.version&gt;</code>…) is exactly how this bug is created — do it only with a reason written in the PR. For a stricter build, the Maven Enforcer rule <code>dependencyConvergence</code> fails the build when two versions of one library meet.</p>
<details><summary>c93/c93-mvn.sh</summary>${ma(C93_MVN, 'bash')}</details>

<h3>7. 🛡 Hacker's corner: when the "new version" is an attack</h3>
<p>A version range does not only let bugs in. It is also the door for supply-chain attacks, and every case below reached victims through automatic upgrades or unpinned installs:</p>
<ul>
<li><strong>left-pad, March 2016</strong> — an author unpublished 273 packages after a naming dispute; the tiny left-pad package disappeared and builds broke worldwide. Availability is part of security; companies now proxy registries (Verdaccio, Nexus).</li>
<li><strong>event-stream, November 2018</strong> — a new maintainer added <code>flatmap-stream@0.1.1</code> as a dependency of event-stream 3.3.6; the payload targeted the Copay bitcoin wallet's build.</li>
<li><strong>ua-parser-js, October 2021</strong> — versions 0.7.29, 0.8.0 and 1.0.0 were published with malware after the maintainer's account was taken over (CVE-2021-4229).</li>
<li><strong>colors / faker, January 2022</strong> — the author published colors 1.4.x that prints "LIBERTY" in an endless loop; AWS CDK users could not deploy because CDK's range pulled it in (aws-cdk issue #18322).</li>
<li><strong>xz utils, March 2024</strong> — a backdoor in liblzma reached Linux distributions; it was discovered because ssh logins became noticeably slower and valgrind showed errors — a performance regression investigated to the end (CVE-2024-3094).</li>
<li><strong>Shai-Hulud, September 2025</strong> — a self-replicating worm spread through npm via compromised maintainer accounts and post-install scripts.</li>
</ul>
<p>The defences are the same tools as for debugging: a committed lockfile, <code>npm ci</code> in CI and Docker, reviewing lockfile diffs ("why did 40 packages change in a PR that adds one?"), a private proxy registry, <code>npm install --ignore-scripts</code> where possible, and a dependency scanner (OWASP Dependency-Check, <code>npm audit</code>) in the pipeline.</p>

<h3>On the job</h3>
<p>The PR that touches 3,000 lines of <code>package-lock.json</code> and nothing else is the one everybody approves without reading. Read it the smart way: <code>git diff main -- package-lock.json | grep '"version"'</code>, or <code>npm ls</code> on both branches, and ask "which of these did we intend?". Outsourcing customers (banks, insurers) often require a list of approved libraries and a scan report per release — an upgrade you did not intend is a compliance problem, not only a bug. And when a regression appears after a dependency PR, bisect the versions before you debug the code: two installs can save an afternoon.</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>chuan-bi.sh</code> and <code>c93-npm.sh</code>. Explain to a classmate, using the code points, why the two strings in the failing test are different.</li>
<li>In your own project, run <code>npm ls --all | wc -l</code> and <code>npm ls</code> for one library you import directly. How many copies are there?</li>
<li>Write a three-line check and use <code>chia-doi-phien-ban.mjs</code> on any public package whose behaviour you know changed between two versions.</li>
<li>Maven: in a Spring Boot project, run <code>mvn dependency:tree -Dincludes=com.fasterxml.jackson.core</code> (or <code>tools.jackson</code> on Boot 4). Which versions come from the Boot BOM?</li>
<li>Find the lockfile-only PR in your group project's history and summarise in three lines which versions changed.</li>
</ol>
<p><strong>Done when:</strong> for "it broke after a reinstall" you can name the library, the first bad version, the line of its changelog and the fix you chose.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Version range ^ / ~</span><span class="v">Lets a newer minor/patch be installed without changing package.json.</span></div>
  <div class="kv"><span class="k">Lockfile</span><span class="v">Exact versions, URLs and hashes of the whole tree.</span></div>
  <div class="kv"><span class="k">npm ci</span><span class="v">Install exactly the lockfile; fail if it does not match package.json.</span></div>
  <div class="kv"><span class="k">npm ls / npm explain</span><span class="v">What is installed, and who required it.</span></div>
  <div class="kv"><span class="k">overrides / peerDependencies</span><span class="v">Force one version in the tree / let the app provide the single copy.</span></div>
  <div class="kv"><span class="k">Nearest wins</span><span class="v">Maven picks the version declared closest to the root, not the highest.</span></div>
  <div class="kv"><span class="k">dependencyManagement</span><span class="v">One version decided in one place for a multi-module build.</span></div>
  <div class="kv"><span class="k">Supply-chain attack</span><span class="v">Malicious code delivered as a dependency update.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>"Nobody changed the code" ⇒ diff the lockfile and the dependency tree first.</li>
<li>Equal-looking strings that are not equal ⇒ print code points.</li>
<li>Bisect versions with <code>--no-save</code> installs, then read the changelog of the first bad one.</li>
<li>Two copies of one package break <code>instanceof</code>; fix with peerDependencies, overrides only with care.</li>
<li>Maven compiles per module but runs with one classpath: nearest wins ⇒ <code>NoClassDefFoundError</code>/<code>NoSuchMethodError</code>.</li>
<li>Lockfile + <code>npm ci</code> + reviewed upgrades are both debugging tools and security controls.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Không ai sửa mã — thư viện đã đổi</h2>
<p class="lead">Bisect ở bài 9.1 tìm trong lịch sử của <em>bạn</em>. Nhưng ứng dụng của bạn phần lớn là mã bạn không viết: một API Node khiêm tốn kéo về hàng trăm gói, một dịch vụ Spring Boot cả trăm tệp JAR. Chúng cũng thay đổi — có khi vì ai đó chủ động nâng cấp, thường hơn là vì một khoảng phiên bản hoặc việc thiếu lockfile cho phép chúng đổi trong im lặng. Bài này tái hiện thật cả hai trường hợp, trên npm và trên Maven, và đưa cho bạn ba công cụ trả lời câu "thư viện nào, bản nào, từ khi nào": diff lockfile, cây phụ thuộc, và chia đôi phiên bản.</p>

<h3>Liên tưởng đời thường: nhà cung cấp đổi bột</h3>
<p>Công thức của tiệm bánh cả năm không đổi, mà bánh tuần này khác hẳn. Nhà cung cấp đã "cải tiến" bột và in việc đó bằng chữ nhỏ ở trang ba một tờ rơi không ai đọc. Người thợ ghi <em>"bột hiệu X, lô 2024-11"</em> chứng minh được trong một phút; người ghi <em>"bột nào của X cũng được"</em> thì chịu. Lockfile chính là số lô.</p>

<h3>1. Khoảng phiên bản và lockfile trong một bảng</h3>
${BANG_SEMVER}
<p><code>npm install mot-thu-vien</code> mặc định ghi <code>"^x.y.z"</code>: "bản nào mới hơn cũng được, miễn cùng số chính". Semantic versioning <em>hứa</em> rằng bản minor và patch không làm hỏng bạn; nó không ép được ai giữ lời. Lockfile (<code>package-lock.json</code>) ghi đúng phiên bản, URL và mã băm integrity đã cài, để mọi máy có cùng một cây — miễn là mọi người cài theo nó.</p>
${BANG_CI_VI}

<h3>2. Dựng registry riêng (giống ở công ty)</h3>
<p>Để tái hiện chuyện "thư viện vừa ra bản minor mới" mà không phụ thuộc người lạ, lab chạy registry npm riêng bằng Verdaccio — đúng vai trò của Nexus hay Artifactory ở các công ty outsourcing — và phát hành một gói nội bộ giả, <code>@labflow/tien-te</code> (định dạng tiền), từng bản một. Nhóm tạo lockfile khi bản mới nhất là 1.4.1; 1.5.0 tới 1.7.0 được phát hành sau đó.</p>
<details><summary>registry.sh · verdaccio-config.yaml · c93/chuan-bi.sh</summary>${ma(REGISTRY, 'bash')}${ma(VERDACCIO, 'yaml')}${ma(C93_CHUAN_BI, 'bash')}</details>
<details><summary>c93/goi/tao-goi.mjs — các phiên bản và nhật ký thay đổi</summary>${ma(TAO_GOI)}</details>
<details><summary>c93/app — package.json, src/hoa-don.mjs, src/xu-ly.mjs, test</summary>${ma(APP_PKG, 'json')}${ma(APP_HOA_DON)}${ma(APP_XU_LY)}${ma(APP_TEST)}</details>

<h3>3. "Xoá lockfile cho hết xung đột"</h3>
${ra(TU_NANG)}
<p>Máy An cài theo lockfile: xanh. Bình gặp xung đột merge trong <code>package-lock.json</code> và làm điều nhiều sinh viên hay làm — xoá nó cùng <code>node_modules</code> rồi chạy <code>npm install</code>. npm giải lại <code>^1.2.0</code>, chọn bản mới nhất 1.7.0, và test trượt với thông báo kỳ lạ nhất bạn từng thấy: <strong>expected và actual trông y hệt nhau</strong>. Khi diff cho thấy hai chuỗi trông bằng nhau, hãy thôi đọc chữ mà đọc byte.</p>
${ra(DIEU_TRA)}
<p>Bốn lệnh, bốn sự thật. <code>git diff package-lock.json</code>: tien-te từ 1.4.1 lên 1.7.0, và xuất hiện một gói mới (<code>@labflow/loi@1.0.0</code>). <code>npm ls</code> xác nhận thứ đang được cài. <code>npm view … versions</code> liệt kê các ứng viên. Và mã điểm Unicode giải đáp bí ẩn: thư viện giờ trả <code>a0</code> (U+00A0, khoảng trắng không ngắt) trước "₫" trong khi test có <code>20</code>, khoảng trắng thường — <code>Intl.NumberFormat('vi-VN')</code> dùng NBSP. Chẳng ai ghi "đổi khoảng trắng" trong changelog.</p>

<h3>4. Chia đôi phiên bản, rồi đọc changelog</h3>
${ma(CHIA_DOI)}
${ra(CD_RA)}
<p>Cùng ý tưởng với <code>git bisect</code>, áp lên danh sách phiên bản: cài một bản bằng <code>--no-save</code> (package.json và lockfile không bị đụng), chạy phép kiểm, chia đôi. Ba ứng viên giữa bản tốt cuối và bản xấu đầu: hai lượt. Changelog của 1.5.0 chỉ ghi <em>"perf: dùng Intl.NumberFormat thay cho regex (nhanh hơn ~3 lần)"</em> — một thay đổi hiệu năng lặng lẽ đổi output. Chuyện đó bình thường: thay đổi phá vỡ hay trốn trong "perf", "refactor", "cải tiến", "theo chuẩn". Giờ bạn chọn cách sửa một cách có chủ đích:</p>
<ul>
<li><strong>Ở lại</strong> 1.4.x (<code>"~1.4.1"</code> hoặc ghim đúng bản) và mở issue cho thư viện kèm hai dòng tái hiện.</li>
<li><strong>Thích nghi</strong>: chấp nhận 1.5+ và sửa mã cùng test (so sau khi chuẩn hoá khoảng trắng, hoặc kiểm riêng con số và định dạng).</li>
<li>Cách nào cũng vậy: giữ lockfile, review thay đổi lockfile trong PR, để bot (Renovate, Dependabot) đề xuất nâng từng thư viện một — mỗi lần nâng có một lượt CI riêng, và chia đôi trở nên dễ dàng.</li>
</ul>

<h3>5. Hai bản của cùng một gói</h3>
${ra(HAI_BAN)}
<p>Nhóm chủ động nâng cấp để dùng hàm <code>tong()</code> mới. Đầu vào sai lẽ ra cho 400 (<code>LoiNghiepVu</code>), lại cho 500. <code>npm ls @labflow/loi</code> chỉ ra lý do: ứng dụng dùng <code>loi@2.0.0</code>, nhưng tien-te 1.7.0 đòi <code>^1.0.0</code>, nên npm lồng một bản thứ hai vào <code>node_modules/@labflow/tien-te/node_modules</code>. Hai bản nghĩa là hai lớp <code>LoiNghiepVu</code> khác nhau; <code>e instanceof LoiNghiepVu</code> so với nhầm lớp và trả false. <code>npm explain</code> in ra ai đòi bản nào. Lỗi "Invalid hook call" của React có cùng nguyên nhân khi hai bản React lọt vào một bundle.</p>
<p><code>overrides</code> ép một bản cho cả cây (<code>deduped</code>, rồi 400). Đó là một quyết định, không phải bản sửa: giờ bạn chạy tien-te với một bản chính nó chưa từng được thử — ở đây nó chỉ gọi hàm khởi tạo nên an toàn; hãy đọc mã thư viện trước khi ghi đè. Cách sửa đúng thuộc về tác giả thư viện: khai báo <code>@labflow/loi</code> là <code>peerDependency</code>, để ứng dụng cung cấp bản duy nhất. Trong mã của bạn, khi bắt lỗi xuyên ranh giới gói, ưu tiên kiểm một trường ổn định (<code>e.name === 'LoiNghiepVu'</code> hoặc <code>code</code> của lỗi).</p>
${ra(CI_LECH)}
<p>Và lớp bảo vệ cho CI: <code>npm ci</code> từ chối chạy khi <code>package.json</code> và lockfile không khớp. Nếu Dockerfile hay script CI của bạn dùng <code>npm install</code>, bạn mất lớp bảo vệ đó — lab 9.4 chính là lỗi này.</p>
<details><summary>c93/c93-npm.sh — mọi lệnh npm của bài</summary>${ma(C93_NPM, 'bash')}</details>

<h3>6. Maven: biên dịch xanh, chạy thì <code>NoClassDefFoundError</code></h3>
<p>Một bản build Maven hai module: <code>tim-kiem</code> (module của nhóm khác) dùng <code>Strings.CI.contains</code>, có từ commons-lang3 <strong>3.18.0</strong>; <code>app</code> phụ thuộc <code>tim-kiem</code> và còn tự khai báo commons-lang3 <strong>3.16.0</strong>, thêm từ năm ngoái để dùng <code>StringUtils.isBlank</code>.</p>
<details><summary>tim-kiem/pom.xml · TimKiem.java · app/pom.xml · Main.java</summary>${ma(POM_TK, 'xml')}${ma(TIM_KIEM, 'java')}${ma(POM_APP, 'xml')}${ma(MAIN_J, 'java')}</details>
${ra(MVN)}
<p>Mọi thứ biên dịch được — mỗi module biên dịch với bản nó tự khai báo. Lúc chạy chỉ có một classpath, và luật giải xung đột của Maven là <strong>"gần nhất thắng"</strong> (nearest wins): chọn bản khai báo gần ứng dụng nhất trong cây phụ thuộc, không phải bản cao nhất. <code>app</code> khai báo 3.16.0 ở độ sâu 1; 3.18.0 nằm ở độ sâu 2 dưới <code>tim-kiem</code>. Kết quả: <code>NoClassDefFoundError: org/apache/commons/lang3/Strings</code> ngay lần tìm đầu. Cùng cơ chế sinh ra <code>NoSuchMethodError</code> khi thiếu một hàm (không phải cả lớp). So cây của từng module là thấy xung đột; trên máy này <code>-Dverbose</code> của maven-dependency-plugin 3.7.0 không in nút bị loại, nên đừng trông vào nó — hãy so các cây, hoặc soi chính JAR (<code>unzip -l … | grep</code>).</p>
${ra(MVN_SUA)}
<p>Cách sửa: bỏ khai báo trực tiếp đã cũ và quản lý một phiên bản cho cả bản build trong <code>&lt;dependencyManagement&gt;</code> của pom cha. Ở dự án Spring Boot, BOM của Boot đã quản lý sẵn hàng trăm phiên bản; ghi đè một cái (<code>&lt;jackson.version&gt;</code>…) chính là cách tạo ra lỗi này — chỉ làm khi có lý do ghi rõ trong PR. Muốn chặt hơn, luật <code>dependencyConvergence</code> của Maven Enforcer làm hỏng bản build khi hai phiên bản của một thư viện gặp nhau.</p>
<details><summary>c93/c93-mvn.sh</summary>${ma(C93_MVN, 'bash')}</details>

<h3>7. 🛡 Góc hacker: khi "bản mới" là một cuộc tấn công</h3>
<p>Khoảng phiên bản không chỉ cho lỗi lọt vào. Nó còn là cánh cửa cho tấn công chuỗi cung ứng, và mọi vụ dưới đây đều tới nạn nhân qua nâng cấp tự động hoặc cài không ghim:</p>
<ul>
<li><strong>left-pad, tháng 3/2016</strong> — một tác giả gỡ 273 gói sau tranh chấp tên; gói nhỏ xíu left-pad biến mất và build hỏng khắp thế giới. Tính sẵn sàng cũng là bảo mật; nay các công ty đều dựng registry proxy (Verdaccio, Nexus).</li>
<li><strong>event-stream, tháng 11/2018</strong> — một người bảo trì mới thêm <code>flatmap-stream@0.1.1</code> làm phụ thuộc của event-stream 3.3.6; mã độc nhắm vào quy trình build của ví bitcoin Copay.</li>
<li><strong>ua-parser-js, tháng 10/2021</strong> — các bản 0.7.29, 0.8.0 và 1.0.0 được phát hành kèm mã độc sau khi tài khoản người bảo trì bị chiếm (CVE-2021-4229).</li>
<li><strong>colors / faker, tháng 1/2022</strong> — tác giả phát hành colors 1.4.x in "LIBERTY" trong vòng lặp vô tận; người dùng AWS CDK không deploy được vì khoảng phiên bản của CDK kéo nó về (issue aws-cdk #18322).</li>
<li><strong>xz utils, tháng 3/2024</strong> — một backdoor trong liblzma lọt vào các bản phân phối Linux; nó bị phát hiện vì đăng nhập ssh chậm đi thấy rõ và valgrind báo lỗi — một lỗi hiệu năng được điều tra tới tận cùng (CVE-2024-3094).</li>
<li><strong>Shai-Hulud, tháng 9/2025</strong> — một con sâu tự nhân bản lan qua npm bằng tài khoản người bảo trì bị chiếm và script post-install.</li>
</ul>
<p>Cách phòng thủ chính là các công cụ gỡ lỗi ở trên: lockfile được commit, <code>npm ci</code> trong CI và Docker, review diff lockfile ("sao PR thêm một thư viện mà đổi 40 gói?"), registry proxy riêng, <code>npm install --ignore-scripts</code> khi có thể, và một công cụ quét phụ thuộc (OWASP Dependency-Check, <code>npm audit</code>) trong pipeline.</p>

<h3>Đi làm thật</h3>
<p>PR đổi 3.000 dòng <code>package-lock.json</code> và không gì khác là PR ai cũng approve mà không đọc. Hãy đọc nó cho khôn: <code>git diff main -- package-lock.json | grep '"version"'</code>, hoặc <code>npm ls</code> trên cả hai nhánh, rồi hỏi "trong số này cái nào mình chủ định?". Khách hàng outsourcing (ngân hàng, bảo hiểm) thường đòi danh sách thư viện được duyệt và báo cáo quét cho mỗi bản phát hành — một lần nâng cấp ngoài ý muốn là vấn đề tuân thủ, không chỉ là lỗi. Và khi lỗi hồi quy xuất hiện sau một PR phụ thuộc, hãy chia đôi phiên bản trước khi gỡ mã: hai lần cài có thể cứu cả buổi chiều.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>chuan-bi.sh</code> và <code>c93-npm.sh</code>. Dùng mã điểm Unicode để giải thích cho bạn cùng lớp vì sao hai chuỗi trong test trượt là khác nhau.</li>
<li>Trong dự án của bạn, chạy <code>npm ls --all | wc -l</code> và <code>npm ls</code> cho một thư viện bạn import trực tiếp. Có mấy bản?</li>
<li>Viết một phép kiểm ba dòng và dùng <code>chia-doi-phien-ban.mjs</code> cho một gói công khai mà bạn biết hành vi đã đổi giữa hai phiên bản.</li>
<li>Maven: trong một dự án Spring Boot, chạy <code>mvn dependency:tree -Dincludes=com.fasterxml.jackson.core</code> (hoặc <code>tools.jackson</code> với Boot 4). Những bản nào đến từ BOM của Boot?</li>
<li>Tìm PR chỉ đổi lockfile trong lịch sử đồ án nhóm và tóm tắt trong ba dòng những phiên bản nào đã đổi.</li>
</ol>
<p><strong>Đạt khi:</strong> với "cài lại xong thì hỏng", bạn chỉ ra được thư viện, bản xấu đầu tiên, dòng changelog tương ứng và cách sửa bạn chọn.</p>
</div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Khoảng phiên bản ^ / ~</span><span class="v">Cho phép cài bản minor/patch mới hơn mà không đổi package.json.</span></div>
  <div class="kv"><span class="k">Lockfile</span><span class="v">Phiên bản, URL và mã băm chính xác của cả cây.</span></div>
  <div class="kv"><span class="k">npm ci</span><span class="v">Cài đúng lockfile; hỏng nếu không khớp package.json.</span></div>
  <div class="kv"><span class="k">npm ls / npm explain</span><span class="v">Đang cài gì, và ai đòi nó.</span></div>
  <div class="kv"><span class="k">overrides / peerDependencies</span><span class="v">Ép một bản trong cây / để ứng dụng cung cấp bản duy nhất.</span></div>
  <div class="kv"><span class="k">Nearest wins</span><span class="v">Maven chọn bản khai báo gần gốc nhất, không phải bản cao nhất.</span></div>
  <div class="kv"><span class="k">dependencyManagement</span><span class="v">Một phiên bản quyết định ở một chỗ cho bản build nhiều module.</span></div>
  <div class="kv"><span class="k">Tấn công chuỗi cung ứng</span><span class="v">Mã độc đến dưới dạng một bản cập nhật thư viện.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>"Không ai sửa mã" ⇒ diff lockfile và cây phụ thuộc trước tiên.</li>
<li>Hai chuỗi trông bằng nhau mà không bằng ⇒ in mã điểm Unicode.</li>
<li>Chia đôi phiên bản bằng cài <code>--no-save</code>, rồi đọc changelog của bản xấu đầu tiên.</li>
<li>Hai bản một gói làm hỏng <code>instanceof</code>; sửa bằng peerDependencies, chỉ dùng overrides khi đã cân nhắc.</li>
<li>Maven biên dịch theo từng module nhưng chạy với một classpath: nearest wins ⇒ <code>NoClassDefFoundError</code>/<code>NoSuchMethodError</code>.</li>
<li>Lockfile + <code>npm ci</code> + nâng cấp có review vừa là công cụ gỡ lỗi vừa là lớp bảo mật.</li>
</ul>
${NGUON}
</div>
`,
};
