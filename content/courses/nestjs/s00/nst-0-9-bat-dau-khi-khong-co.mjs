/**
 * Bắt đầu tại đây (2/2) — khoá nestjs (soạn 24/11/2026).
 * Output: chạy THẬT trong container nst-run-* (Node v22.23.5, Nest 12.6.0, express 5.3.0, class-validator 0.15.1,
 * class-transformer 0.5.1), thư mục scratchpad/nst/lab/m09. Phát hiện lúc soạn: ValidationPipe có tuỳ chọn validator
 * mà không transform ⇒ trả classToPlain(entity) (validation.pipe.js) ⇒ trường DTO không gửi thành undefined ⇒ Object.assign
 * xoá email. Sửa bằng transformOptions.exposeUnsetFields=false (đã chạy lại).
 * Nguồn: GitHub Blog 04/03/2012 "Public Key Security Vulnerability and Mitigation"; GHSA-85cg-cmq5-qjm7 (CVE-2025-54782,
 * công bố 01/08/2025, @nestjs/devtools-integration ≤ 0.2.0, sửa 0.2.1); Socket blog. Lấy 24/11/2026.
 * Tình huống đồ án Express 2.000 dòng: MINH HOẠ (ghi rõ trong bài).
 */
import { nguon, lienKet } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-18-2-to-chuc-ma-nguon', title: 'Node.js 18.2 — Tổ chức theo tính năng, và cái file 3.607 dòng', sub: 'Cùng bài toán "mã lớn lên không có hình dáng" nhìn từ phía Express thuần.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-0-9-bat-dau-su-co', title: 'Authentication — Bắt đầu tại đây (2/2): sự cố', sub: 'Các vụ lộ tài khoản thật — phần xác thực ta chỉ dùng lại ở chương 7.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-0-9-bat-dau-khi-khong-co', title: 'API Design — Bắt đầu tại đây (2/2)', sub: 'Vì sao API thiếu thiết kế làm khổ cả bên gọi lẫn bên viết.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🐙', 'GitHub Blog (04/03/2012) — Public Key Security Vulnerability and Mitigation', 'Lỗ hổng mass-assignment ở form khoá công khai: một người dùng thêm khoá của mình vào tổ chức rails; vá sau khoảng một giờ.', 'https://github.blog/news-insights/the-library/public-key-security-vulnerability-and-mitigation/'),
  nguon('🛡️', 'GitHub Advisory GHSA-85cg-cmq5-qjm7 (CVE-2025-54782)', '@nestjs/devtools-integration ≤ 0.2.0: CSRF tới thoát sandbox, chạy mã tuỳ ý trên máy lập trình viên. Sửa ở 0.2.1.', 'https://github.com/advisories/GHSA-85cg-cmq5-qjm7'),
  nguon('🔎', 'Socket — NestJS RCE vulnerability write-up', 'Bài phân tích của nhóm phát hiện lỗ hổng.', 'https://socket.dev/blog/nestjs-rce-vuln'),
  nguon('📘', 'OWASP API Security Top 10 (2023) — API3: Broken Object Property Level Authorization', 'Mass assignment và lộ trường thừa được gộp vào mục này.', 'https://api-security.owasp.org/editions/2023/en/0xa3-broken-object-property-level-authorization/'),
].join('\n');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const MA_EXPRESS = `import express from 'express';

const nguoiDung = { id: 7, ten: 'Lan', email: 'lan@sv.fpt.edu.vn', vaiTro: 'SINH_VIEN' };

const app = express();
app.use(express.json());
// "Cập nhật hồ sơ": gán thẳng mọi thứ client gửi lên vào bản ghi
app.patch('/toi', (req, res) => {
  Object.assign(nguoiDung, req.body);
  res.json(nguoiDung);
});
app.listen(3000);`;

const OUT_EXPRESS = `$ curl -s -X PATCH localhost:3000/toi -H "Content-Type: application/json" -d '{"ten":"Lan Anh","vaiTro":"ADMIN"}'
{"id":7,"ten":"Lan Anh","email":"lan@sv.fpt.edu.vn","vaiTro":"ADMIN"}`;

const MA_NEST = `import { Body, Controller, Module, Patch, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

class CapNhatHoSoDto {
  @IsOptional() @IsString() @Length(1, 50)
  ten?: string;

  @IsOptional() @IsEmail()
  email?: string;
}

const nguoiDung = { id: 7, ten: 'Lan', email: 'lan@sv.fpt.edu.vn', vaiTro: 'SINH_VIEN' };

@Controller('toi')
class ToiController {
  @Patch()
  capNhat(@Body() dto: CapNhatHoSoDto) {
    Object.assign(nguoiDung, dto);
    return nguoiDung;
  }
}

@Module({ controllers: [ToiController] })
class AppModule {}

const app = await NestFactory.create(AppModule, { logger: false });
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
await app.listen(3000);`;

const OUT_NEST = `$ curl -s -i -X PATCH localhost:3000/toi -H "Content-Type: application/json" -d '{"ten":"Lan Anh","vaiTro":"ADMIN"}'
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 87

{"message":["property vaiTro should not exist"],"error":"Bad Request","statusCode":400}

$ curl -s -X PATCH localhost:3000/toi -H "Content-Type: application/json" -d '{"ten":"Lan Anh"}'
{"id":7,"ten":"Lan Anh","vaiTro":"SINH_VIEN"}`;

const OUT_FIELD = `$ node --input-type=module -e '
class A { ten; email; }
const a = new A(); a.ten = "Lan Anh";
console.log(Object.keys(a), JSON.stringify(Object.assign({ ten: "Lan", email: "lan@sv.fpt.edu.vn" }, a)));'
[ 'ten', 'email' ] {"ten":"Lan Anh"}`;

const MA_SUA = `app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: { exposeUnsetFields: false }, // trường không gửi thì KHÔNG xuất hiện
}));`;

const OUT_SUA = `$ curl -s -X PATCH localhost:3000/toi -H "Content-Type: application/json" -d '{"ten":"Lan Anh"}'
{"id":7,"ten":"Lan Anh","email":"lan@sv.fpt.edu.vn","vaiTro":"SINH_VIEN"}`;

export default {
  title: 'Start here (2/2) — Express without structure, and how to learn this course|||Bắt đầu tại đây (2/2) — Express không khuôn khổ lớn lên thành gì, và cách học khoá này',
  slug: 'nst-0-9-bat-dau-khi-khong-co',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đồ án Express không cấu trúc lớn lên thành gì (minh hoạ), mass assignment chạy thật trên Express và bị Nest chặn — kèm cái bẫy mất dữ liệu phát hiện lúc soạn, sự cố thật GitHub 2012 và CVE-2025-54782 của chính Nest, rồi lộ trình học tối thiểu/đầy đủ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>What happens without structure — and why structure alone does not make you safe</h2>
<p class="lead">Part 1 showed what Nest is. This part shows why teams adopt it: what an unstructured Express codebase turns into, a real attack that a single missing rule allows, how Nest blocks it by default — and a trap we hit while writing this very lesson, which proves you still have to understand what the framework does underneath. We finish with a study plan.</p>

<h3>An illustrative story (not a real team): the 2,000-line <code>server.js</code></h3>
<p>Week 1 of a student group project: one <code>server.js</code>, ten routes, everything readable. Week 6: 2,000 lines. Every route repeats "read token, check role, validate body, try/catch, format error" a little differently. Login has a rate limit; password reset does not. One member returns <code>{ error }</code>, another returns <code>{ message }</code>, the front end handles both badly. Testing a route means starting the whole server with a real database. Nothing here is a bug yet — it is the soil bugs grow in. Nest does not make anyone a better programmer, but it gives each of these concerns <strong>one named place</strong>: validation in a pipe, role checks in a guard, error format in a filter, timing and logging in an interceptor, and business logic in a provider you can test alone.</p>

<h3>The attack: mass assignment, run for real</h3>
<p>The "update my profile" endpoint below copies whatever the client sends into the user record. The front end only has fields for name and email — but an attacker does not use your front end. They send one extra field.</p>
<pre><code class="language-js">${esc(MA_EXPRESS)}</code></pre>
<div class="out">${esc(OUT_EXPRESS)}</div>
<p>A student just made themself an admin with one <code>curl</code>. This bug class is called <strong>mass assignment</strong>; OWASP's API Security Top 10 (2023) files it under <strong>API3 — Broken Object Property Level Authorization</strong>.</p>

<h3>A real incident: GitHub, 4 March 2012</h3>
<p>GitHub's own blog post that day reports that at 8:49 am Pacific time "a GitHub user exploited a security vulnerability in the public key update form in order to add his public key to the rails organization" — the organization of Ruby on Rails, one of the most popular web frameworks of the time — and then "was able to push a new file to the project as a demonstration". GitHub removed the key, suspended the user and rolled out a fix at 9:53 am, about an hour later. The post names the root cause precisely: "a failure to properly check incoming form parameters, a problem known as the mass-assignment vulnerability" — the same mistake as our <code>Object.assign</code>. GitHub then started a full audit of its code base for other instances. The lesson for every framework: the server, not the form, decides which fields a client may set.</p>

<h3>The same endpoint in Nest: a DTO and a whitelist</h3>
<pre><code class="language-ts">${esc(MA_NEST)}</code></pre>
<div class="out">${esc(OUT_NEST)}</div>
<p>The <strong>DTO</strong> (data transfer object) lists exactly what the client may send, and <code>ValidationPipe</code> with <code>whitelist</code> + <code>forbidNonWhitelisted</code> rejects anything else with a 400. The attack is gone. But look at the second response again: <strong>the email disappeared</strong>. We only wanted to change the name.</p>

<h3>The trap we hit while writing this lesson</h3>
<p>Two facts combine. First, our TypeScript target is ES2023, where a declared class field such as <code>email?: string</code> becomes a real property with value <code>undefined</code> on every instance:</p>
<div class="out">${esc(OUT_FIELD)}</div>
<p>Second, reading <code>validation.pipe.js</code> in Nest 12 shows that when you pass validator options (like <code>whitelist</code>) without <code>transform: true</code>, the pipe builds a DTO instance and returns <code>classToPlain(entity)</code> — which keeps those <code>undefined</code> fields. <code>Object.assign</code> then copies <code>email: undefined</code> over the real email, and <code>JSON.stringify</code> hides it. With a real database this becomes silent data loss. The fix is one option:</p>
<pre><code class="language-ts">${esc(MA_SUA)}</code></pre>
<div class="out">${esc(OUT_SUA)}</div>
<p>Chapter 4 covers this properly (and the other solid fix: never <code>Object.assign</code> a DTO into an entity — map fields explicitly). Keep the moral: <strong>a framework moves problems to one place; it does not remove the need to understand that place.</strong></p>

<h3>A real incident in Nest's own tooling: CVE-2025-54782 (2025)</h3>
<p>On 1 August 2025 a critical advisory was published for <code>@nestjs/devtools-integration</code> (versions up to 0.2.0, fixed in 0.2.1). When enabled, the package started a local development HTTP server whose endpoint <code>/inspector/graph/interact</code> executed submitted JavaScript inside a weak <code>vm</code> sandbox, without cross-origin protection. Step by step: a developer runs the app with devtools on → visits any malicious web page → that page sends a request to the local server → the code escapes the sandbox → the attacker runs commands on the developer's machine (source code, SSH keys, cloud credentials). Defences you can apply yourself: keep dev-only packages out of production builds, update dependencies (<code>npm audit</code>, Dependabot), and treat "it only listens on localhost" as <em>not</em> a security boundary against your own browser. Chapter 11 returns to this.</p>

<h3>How to learn this course without burning out</h3>
<table>
<thead><tr><th>Path</th><th>Lessons</th><th>For whom</th></tr></thead>
<tbody>
<tr><td><strong>Minimum (job-ready core)</strong></td><td>Section 0, Chapters 1–4, 6–8, capstone</td><td>You need Nest for an internship soon</td></tr>
<tr><td><strong>Full</strong></td><td>Everything, in order</td><td>You want to own a Nest backend end to end</td></tr>
</tbody>
</table>
<ul>
<li><strong>Rhythm:</strong> one lesson per study session (60–90 minutes): read 20 minutes, type every example yourself 40 minutes (do not paste), exercise 20 minutes. One chapter per week, ending with its project milestone.</li>
<li><strong>Keep an error notebook:</strong> each Nest error you meet → the message, the cause in one line, the fix. After a month you will read Nest errors faster than anyone on your team.</li>
<li><strong>Compare constantly:</strong> after each concept ask "how would I do this in Express? in Spring?" — the comparison is what makes it stick.</li>
</ul>

<h3>🧪 Practice (15 min) — spot the mass assignment</h3>
<div class="callout ok">
<p>Which of these Express handlers allow a client to set fields it should not? For each, name the dangerous field an attacker would send.</p>
<ol>
<li><code>await prisma.booking.update({ where: { id }, data: req.body })</code></li>
<li><code>const { note } = req.body; await prisma.booking.update({ where: { id }, data: { note } })</code></li>
<li><code>await prisma.user.create({ data: { ...req.body, role: 'STUDENT' } })</code></li>
<li><code>await prisma.user.create({ data: { role: 'STUDENT', ...req.body } })</code></li>
</ol>
<details><summary>Show answer</summary>
<p>1 — vulnerable: <code>status: "APPROVED"</code>, <code>userId</code>, <code>roomId</code>. 2 — safe: only <code>note</code> is copied. 3 — the role is safe because it is written last, but every other column (e.g. <code>emailVerified</code>) is still client-controlled. 4 — vulnerable: <code>req.body</code> spreads last and overrides <code>role</code> with <code>"ADMIN"</code>. Order of spreading matters — which is exactly why Nest moves the rule into a DTO whitelist instead of relying on each handler.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mass assignment</span><span class="v">Copying client input into a record wholesale, so the client can set fields it must not (role, status, owner).</span></div>
  <div class="kv"><span class="k">DTO</span><span class="v">Data transfer object: a class describing exactly the shape of data allowed in or out.</span></div>
  <div class="kv"><span class="k">ValidationPipe</span><span class="v">Nest pipe that turns the body into a DTO and validates it with class-validator rules.</span></div>
  <div class="kv"><span class="k">whitelist</span><span class="v">ValidationPipe option that strips (or, with forbidNonWhitelisted, rejects) properties without validation rules.</span></div>
  <div class="kv"><span class="k">CVE</span><span class="v">Common Vulnerabilities and Exposures: a public ID for a known security flaw.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Unstructured Express code repeats cross-cutting work slightly differently in every route; Nest gives each concern one named place.</li>
<li>Mass assignment lets a client set fields like <code>vaiTro</code>; GitHub was hit by exactly this in March 2012.</li>
<li>DTO + ValidationPipe whitelist blocks it — but optional DTO fields can arrive as <code>undefined</code> and wipe data; use <code>exposeUnsetFields: false</code> or map fields explicitly.</li>
<li>Even framework tooling has holes (CVE-2025-54782): keep dev tools out of production and update.</li>
<li>Study one lesson per session, type everything, keep an error notebook, compare with Express and Spring.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Không có cấu trúc thì sao — và vì sao có cấu trúc cũng chưa chắc an toàn</h2>
<p class="lead">Phần 1 cho thấy Nest là gì. Phần này cho thấy vì sao các đội chọn nó: một mã Express không cấu trúc lớn lên thành gì, một cú tấn công thật chỉ cần thiếu một quy tắc, Nest chặn nó mặc định ra sao — và một cái bẫy ta vấp ngay lúc soạn bài này, chứng minh rằng bạn vẫn phải hiểu framework làm gì bên dưới. Cuối bài là lộ trình học.</p>

<h3>Một câu chuyện minh hoạ (không phải nhóm có thật): tệp <code>server.js</code> 2.000 dòng</h3>
<p>Tuần 1 của đồ án nhóm: một tệp <code>server.js</code>, mười route, đọc rất dễ. Tuần 6: 2.000 dòng. Route nào cũng lặp lại "đọc token, kiểm vai trò, kiểm body, try/catch, định dạng lỗi", mỗi chỗ một kiểu hơi khác. Đăng nhập có giới hạn số lần thử; đặt lại mật khẩu thì không. Bạn này trả <code>{ error }</code>, bạn kia trả <code>{ message }</code>, giao diện xử lý cả hai đều dở. Muốn test một route thì phải bật cả server với cơ sở dữ liệu thật. Chưa có lỗi nào cả — nhưng đây là mảnh đất lỗi mọc lên. Nest không làm ai giỏi hơn, nhưng nó cho mỗi việc trên <strong>một chỗ có tên</strong>: kiểm dữ liệu ở pipe, kiểm vai trò ở guard, định dạng lỗi ở filter, đo thời gian và ghi log ở interceptor, còn logic nghiệp vụ ở provider test riêng được.</p>

<h3>Cú tấn công: mass assignment, chạy thật</h3>
<p>Endpoint "cập nhật hồ sơ của tôi" dưới đây chép mọi thứ client gửi lên vào bản ghi người dùng. Giao diện chỉ có ô tên và email — nhưng kẻ tấn công đâu cần dùng giao diện của bạn. Họ gửi thêm đúng một trường.</p>
<pre><code class="language-js">${esc(MA_EXPRESS)}</code></pre>
<div class="out">${esc(OUT_EXPRESS)}</div>
<p>Một sinh viên vừa tự phong mình làm admin bằng một lệnh <code>curl</code>. Loại lỗi này gọi là <strong>mass assignment</strong> (gán hàng loạt); OWASP API Security Top 10 (2023) xếp nó vào mục <strong>API3 — Broken Object Property Level Authorization</strong> (phân quyền sai ở mức thuộc tính).</p>

<h3>Sự cố thật: GitHub, 04/03/2012</h3>
<p>Bài blog của chính GitHub hôm đó kể: lúc 8 giờ 49 sáng giờ Thái Bình Dương, "một người dùng GitHub đã lợi dụng lỗ hổng ở form cập nhật khoá công khai để thêm khoá của mình vào tổ chức rails" — tổ chức của Ruby on Rails, một trong những framework web phổ biến nhất lúc đó — rồi "đẩy được một tệp mới lên dự án để chứng minh". GitHub gỡ khoá, khoá tài khoản kia và tung bản vá lúc 9 giờ 53, khoảng một giờ sau. Bài viết gọi đúng tên nguyên nhân gốc: "không kiểm đúng các tham số form gửi lên, vấn đề được biết với tên lỗ hổng mass-assignment" — đúng lỗi <code>Object.assign</code> của ta. Sau đó GitHub rà toàn bộ mã nguồn để tìm chỗ tương tự. Bài học cho mọi framework: server quyết định client được đặt trường nào, chứ không phải cái form.</p>

<h3>Cùng endpoint bằng Nest: DTO và whitelist</h3>
<pre><code class="language-ts">${esc(MA_NEST)}</code></pre>
<div class="out">${esc(OUT_NEST)}</div>
<p><strong>DTO</strong> (data transfer object — object chở dữ liệu) liệt kê đúng những gì client được gửi; <code>ValidationPipe</code> với <code>whitelist</code> + <code>forbidNonWhitelisted</code> từ chối mọi thứ khác bằng mã 400. Cú tấn công hết đường. Nhưng nhìn lại phản hồi thứ hai: <strong>email biến mất</strong>. Ta chỉ muốn đổi tên thôi mà.</p>

<h3>Cái bẫy ta vấp ngay lúc soạn bài</h3>
<p>Hai sự thật cộng lại. Một: TypeScript của dự án nhắm ES2023, ở đó một trường class khai báo như <code>email?: string</code> trở thành thuộc tính thật, mang giá trị <code>undefined</code>, trên mọi object:</p>
<div class="out">${esc(OUT_FIELD)}</div>
<p>Hai: đọc tệp <code>validation.pipe.js</code> của Nest 12 thấy rằng khi bạn truyền tuỳ chọn kiểm (như <code>whitelist</code>) mà không bật <code>transform: true</code>, pipe dựng một object DTO rồi trả về <code>classToPlain(entity)</code> — giữ nguyên các trường <code>undefined</code> đó. <code>Object.assign</code> liền chép <code>email: undefined</code> đè lên email thật, và <code>JSON.stringify</code> giấu nó đi. Với cơ sở dữ liệu thật, đây là mất dữ liệu trong im lặng. Sửa bằng một tuỳ chọn:</p>
<pre><code class="language-ts">${esc(MA_SUA)}</code></pre>
<div class="out">${esc(OUT_SUA)}</div>
<p>Chương 4 dạy kỹ phần này (và cách sửa chắc chắn còn lại: đừng bao giờ <code>Object.assign</code> DTO vào entity — chép từng trường rõ ràng). Nhớ lấy bài học: <strong>framework dồn vấn đề về một chỗ; nó không thay bạn hiểu chỗ đó.</strong></p>

<h3>Sự cố thật trong chính công cụ của Nest: CVE-2025-54782 (2025)</h3>
<p>Ngày 01/08/2025, một cảnh báo mức nghiêm trọng được công bố cho gói <code>@nestjs/devtools-integration</code> (bản tới 0.2.0, sửa ở 0.2.1). Khi bật, gói này mở một HTTP server phục vụ lúc phát triển; endpoint <code>/inspector/graph/interact</code> của nó chạy đoạn JavaScript gửi tới bên trong một sandbox <code>vm</code> yếu, lại không chặn request từ trang khác nguồn. Từng bước: lập trình viên chạy ứng dụng có bật devtools → ghé một trang web độc → trang đó gửi request tới server cục bộ → đoạn mã thoát khỏi sandbox → kẻ tấn công chạy lệnh trên máy lập trình viên (mã nguồn, khoá SSH, thông tin đăng nhập cloud). Cách phòng bạn tự làm được: để gói chỉ dùng lúc phát triển ngoài bản build production, cập nhật phụ thuộc (<code>npm audit</code>, Dependabot), và đừng coi "nó chỉ nghe ở localhost" là hàng rào an toàn trước chính trình duyệt của bạn. Chương 11 quay lại chuyện này.</p>

<h3>Học khoá này thế nào cho không nản</h3>
<table>
<thead><tr><th>Lộ trình</th><th>Bài</th><th>Dành cho ai</th></tr></thead>
<tbody>
<tr><td><strong>Tối thiểu (lõi để đi làm)</strong></td><td>Mục 0, chương 1–4, 6–8, dự án cuối</td><td>Bạn sắp cần Nest để đi thực tập</td></tr>
<tr><td><strong>Đầy đủ</strong></td><td>Tất cả, theo thứ tự</td><td>Bạn muốn tự làm chủ một backend Nest từ đầu tới cuối</td></tr>
</tbody>
</table>
<ul>
<li><strong>Nhịp học:</strong> mỗi buổi một bài (60–90 phút): đọc 20 phút, tự gõ lại mọi ví dụ 40 phút (không dán), bài tập 20 phút. Mỗi tuần một chương, kết thúc bằng mốc dự án của chương.</li>
<li><strong>Giữ một sổ lỗi:</strong> mỗi lỗi Nest bạn gặp → thông báo, nguyên nhân trong một dòng, cách sửa. Sau một tháng bạn sẽ đọc lỗi Nest nhanh nhất nhóm.</li>
<li><strong>Luôn so sánh:</strong> học xong một khái niệm thì hỏi "làm việc này bằng Express thế nào? bằng Spring thế nào?" — chính phép so sánh làm kiến thức đọng lại.</li>
</ul>

<h3>🧪 Thực hành (15 phút) — tìm chỗ mass assignment</h3>
<div class="callout ok">
<p>Hàm xử lý Express nào dưới đây cho client đặt những trường không được phép? Với mỗi hàm, chỉ ra trường nguy hiểm kẻ tấn công sẽ gửi.</p>
<ol>
<li><code>await prisma.booking.update({ where: { id }, data: req.body })</code></li>
<li><code>const { note } = req.body; await prisma.booking.update({ where: { id }, data: { note } })</code></li>
<li><code>await prisma.user.create({ data: { ...req.body, role: 'STUDENT' } })</code></li>
<li><code>await prisma.user.create({ data: { role: 'STUDENT', ...req.body } })</code></li>
</ol>
<details><summary>Xem đáp án</summary>
<p>1 — có lỗ hổng: <code>status: "APPROVED"</code>, <code>userId</code>, <code>roomId</code>. 2 — an toàn: chỉ chép <code>note</code>. 3 — vai trò an toàn vì được ghi sau cùng, nhưng mọi cột khác (vd <code>emailVerified</code>) vẫn do client quyết. 4 — có lỗ hổng: <code>req.body</code> trải sau cùng nên ghi đè <code>role</code> thành <code>"ADMIN"</code>. Thứ tự trải object quyết định kết quả — chính vì vậy Nest dời quy tắc vào whitelist của DTO thay vì trông vào từng hàm xử lý.</p>
</details>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mass assignment</span><span class="v">Gán hàng loạt: chép nguyên dữ liệu client gửi vào bản ghi, khiến client đặt được trường bị cấm (vai trò, trạng thái, chủ sở hữu).</span></div>
  <div class="kv"><span class="k">DTO</span><span class="v">Data transfer object: class mô tả đúng hình dạng dữ liệu được phép vào hoặc ra.</span></div>
  <div class="kv"><span class="k">ValidationPipe</span><span class="v">Pipe của Nest biến body thành DTO và kiểm theo luật của class-validator.</span></div>
  <div class="kv"><span class="k">whitelist</span><span class="v">Tuỳ chọn của ValidationPipe: bỏ đi (hoặc, với forbidNonWhitelisted, từ chối) thuộc tính không có luật kiểm.</span></div>
  <div class="kv"><span class="k">CVE</span><span class="v">Common Vulnerabilities and Exposures: mã công khai cho một lỗ hổng bảo mật đã biết.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mã Express không cấu trúc lặp lại việc dùng chung theo kiểu hơi khác ở mỗi route; Nest cho mỗi việc một chỗ có tên.</li>
<li>Mass assignment cho client đặt trường như <code>vaiTro</code>; GitHub dính đúng lỗi này tháng 3/2012.</li>
<li>DTO + whitelist của ValidationPipe chặn được — nhưng trường DTO tuỳ chọn có thể tới dưới dạng <code>undefined</code> và xoá dữ liệu; dùng <code>exposeUnsetFields: false</code> hoặc chép từng trường.</li>
<li>Công cụ của chính framework cũng có lỗ hổng (CVE-2025-54782): để công cụ dev ngoài production và cập nhật thường xuyên.</li>
<li>Mỗi buổi một bài, tự gõ hết, giữ sổ lỗi, so với Express và Spring.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
