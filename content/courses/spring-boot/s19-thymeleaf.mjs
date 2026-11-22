/**
 * Spring Boot — Chương 19: Trang dựng ở server — Spring MVC trả view và Thymeleaf (soạn 22/11/2026).
 * Phủ phần HSF302 mà khoá còn thiếu. Đặt CUỐI khoá (không chèn giữa, không đánh số lại); slug khớp khung trong
 * spring-boot.mjs (sb-19-N-…).
 * Mọi output chạy thật trên dự án mẫu "Kho thiết bị CLB" (gearloan) — Spring Boot 4.1.2, Spring Security 7.1.2,
 * Thymeleaf 3.1 (starter của Boot 4.1.2), Java 21.0.9, PostgreSQL 16 trong Docker. Cùng dự án với khung mẫu của các
 * mốc dự án (./_du-an-mau.mjs).
 * KHÔNG backtick trần trong content; mã mẫu đi qua java()/xml()/out() của _chung.mjs; ký hiệu Thymeleaf viết \${…}.
 */
import { java, xml, yml, out, tl } from './_chung.mjs';

const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });

/* ═════════════ 19.1 — Spring MVC trả view ═════════════ */
const C1_CTRL = java(`
@Controller
class AdminGearController {
    private final GearService gears;                    // CÙNG service mà REST API dùng
    AdminGearController(GearService gears) { this.gears = gears; }

    @GetMapping("/admin/gear")
    String list(Model model) {
        model.addAttribute("items", gears.list(null, 0).items());
        if (!model.containsAttribute("form")) model.addAttribute("form", new CreateGear("", ""));
        return "admin/gear-list";                       // tên view ⇒ templates/admin/gear-list.html
    }
}
`
  );
const C1_SAI = java(`
@RestController
class MistakeRest {
    @GetMapping("/admin/mistake/rest")
    String page() { return "admin/gear-list"; }          // @RestController: chuỗi này là BODY, không phải tên view
}

@Controller
class MistakeView {
    @GetMapping("/admin/mistake/missing")
    String page() { return "admin/gear-lst"; }           // gõ sai tên template
}
`
  );
const O1_SAI = out(`
$ curl -s -b cookies localhost:8090/admin/mistake/rest
admin/gear-list
$ curl -s -o /dev/null -w "%{http_code}" -b cookies localhost:8090/admin/mistake/missing
500
# trong log:
TemplateInputException: Error resolving template [admin/gear-lst]
`
  );
const L1_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 19 · Server-rendered pages</span>
<h2>19.1 — Spring MVC returning views: @Controller, Model and the view resolver</h2>
<p class="lead">Until now every controller in this course returned data — JSON for a React page or a mobile app to draw. Spring MVC can also draw the page itself: the controller fills a <strong>Model</strong>, returns the <strong>name of a view</strong>, and a template engine turns both into HTML. This is what FPT University’s HSF302 teaches, what PRJ301 did with JSP, and what many internal back offices still use because it needs no separate front-end project.</p>

<h3>Same DispatcherServlet, different last step</h3>
<p>The request walks exactly the pipeline of lesson 4.4 — filters, DispatcherServlet, handler mapping, your method. Only the last step differs. A <code>@RestController</code> method’s return value goes to an HTTP message converter (Jackson ⇒ JSON). A <code>@Controller</code> method that returns a <code>String</code> hands that string to the <strong>ViewResolver</strong>; with the Thymeleaf starter on the classpath, Boot auto-configures one that looks for <code>src/main/resources/templates/&lt;name&gt;.html</code>.</p>
${C1_CTRL}
<p>Two things to notice. The page controller calls the <em>same</em> <code>GearService</code> as the REST API from milestone 5 — rules are not copied into the web layer. And <code>Model</code> is just a map the template can read: whatever you put in it under <code>"items"</code> becomes <code>\${items}</code> in the template (lesson 19.2).</p>

<h3>The two mistakes everyone makes once</h3>
${C1_SAI}
${O1_SAI}
<p>The first is silent: <code>@RestController</code> is <code>@Controller</code> + <code>@ResponseBody</code>, so the view name is sent back as plain text. The second is loud but only at runtime: a typo in the view name compiles, starts, and fails on the first request with a 500. Neither is caught by the compiler — a page test (lesson 19.6 lab) is what catches them.</p>

<h3>When server-rendered pages are the better choice</h3>
<table>
<thead><tr><th></th><th>Thymeleaf (server)</th><th>React SPA + API</th></tr></thead>
<tbody>
<tr><td>Projects to build and deploy</td><td>One</td><td>Two (or one with a build step)</td></tr>
<tr><td>Authentication</td><td>Session cookie + form login + CSRF, all built into Spring Security</td><td>Tokens, refresh, CORS (Chapter 21)</td></tr>
<tr><td>Good for</td><td>Admin and staff screens, forms, reports, SEO-friendly public pages</td><td>Rich interactive apps, mobile + web sharing one API</td></tr>
<tr><td>Weak at</td><td>Very interactive screens (drag and drop, live updates)</td><td>Simple CRUD screens that now need a whole second project</td></tr>
</tbody>
</table>
<p>In your course project you use both: the public or member-facing part through the API (milestones 13 and 22), and a small staff back office in Thymeleaf (milestone 20).</p>

<h3>🧪 Practice (10 minutes)</h3>
<div class="callout ok"><ol>
<li>Add <code>spring-boot-starter-thymeleaf</code> to your project and create <code>templates/hello.html</code> containing one heading.</li>
<li>Write a <code>@Controller</code> that returns <code>"hello"</code>; open it in the browser.</li>
<li>Change the annotation to <code>@RestController</code> and reload. Then change it back and misspell the view name. Write down what each mistake looks like.</li>
</ol>
<p><strong>Done when:</strong> you can tell, from the response alone, whether a controller returned data or a view, and you have seen the TemplateInputException once.</p></div>

<h3>🎤 What interviewers ask</h3>
<ol>
<li><strong>“@Controller vs @RestController?”</strong> — <code>@RestController</code> adds <code>@ResponseBody</code> to every method, so return values are written to the body by a message converter. <code>@Controller</code> returns view names (or <code>ModelAndView</code>) resolved by a ViewResolver.</li>
<li><strong>“What is a ViewResolver?”</strong> — The component that maps a logical view name to a template; Boot configures Thymeleaf’s with prefix <code>classpath:/templates/</code> and suffix <code>.html</code>.</li>
</ol>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">View name</span><span class="v">The logical name a @Controller returns; the ViewResolver turns it into a template.</span></div>
  <div class="kv"><span class="k">Model</span><span class="v">A map of attributes the controller fills and the template reads.</span></div>
  <div class="kv"><span class="k">ViewResolver</span><span class="v">Maps view names to templates (Thymeleaf: templates/&lt;name&gt;.html).</span></div>
  <div class="kv"><span class="k">@ResponseBody</span><span class="v">Write the return value to the HTTP body instead of resolving a view.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A @Controller fills the Model and returns a view name; Thymeleaf renders templates/&lt;name&gt;.html.</li>
<li>@RestController returns the string as the body — the most common “my page shows its own name” bug.</li>
<li>Page controllers call the same services as the API; only the last step of the pipeline differs.</li>
</ul>
${tl('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller.html', '📘', 'Spring Framework reference — Annotated controllers', 'Return values of handler methods, Model, view names')}
</div>
`;
const L1_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 19 · Trang dựng ở server</span>
<h2>19.1 — Spring MVC trả view: @Controller, Model và view resolver</h2>
<p class="lead">Tới giờ mọi controller trong khoá đều trả dữ liệu — JSON để trang React hay app điện thoại tự vẽ. Spring MVC cũng có thể tự vẽ trang: controller điền <strong>Model</strong>, trả về <strong>tên một view</strong>, và một template engine biến cả hai thành HTML. Đây là thứ môn HSF302 của Đại học FPT dạy, là thứ PRJ301 làm bằng JSP, và là thứ nhiều trang quản trị nội bộ vẫn dùng vì không cần một dự án frontend riêng.</p>

<h3>Cùng DispatcherServlet, khác bước cuối</h3>
<p>Request đi đúng đường ống của bài 4.4 — filter, DispatcherServlet, handler mapping, hàm của bạn. Chỉ bước cuối khác. Giá trị trả về của hàm <code>@RestController</code> đi tới HTTP message converter (Jackson ⇒ JSON). Hàm <code>@Controller</code> trả về <code>String</code> thì chuỗi đó được trao cho <strong>ViewResolver</strong>; có starter Thymeleaf trong classpath, Boot tự cấu hình một resolver tìm <code>src/main/resources/templates/&lt;tên&gt;.html</code>.</p>
${C1_CTRL}
<p>Để ý hai điều. Controller trang gọi <em>cùng</em> <code>GearService</code> với REST API của mốc 5 — luật không bị chép sang tầng web. Và <code>Model</code> chỉ là một map mà template đọc được: thứ bạn đặt dưới khoá <code>"items"</code> sẽ thành <code>\${items}</code> trong template (bài 19.2).</p>

<h3>Hai lỗi ai cũng mắc một lần</h3>
${C1_SAI}
${O1_SAI}
<p>Lỗi đầu im lặng: <code>@RestController</code> là <code>@Controller</code> + <code>@ResponseBody</code>, nên tên view bị gửi về như chữ thường. Lỗi sau ồn ào nhưng chỉ lúc chạy: gõ sai tên view vẫn biên dịch, vẫn khởi động, rồi hỏng ở request đầu tiên với lỗi 500. Trình biên dịch không bắt được cả hai — test trang (lab bài 19.6) mới bắt được.</p>

<h3>Khi nào trang dựng ở server là lựa chọn tốt hơn</h3>
<table>
<thead><tr><th></th><th>Thymeleaf (server)</th><th>SPA React + API</th></tr></thead>
<tbody>
<tr><td>Số dự án phải dựng và deploy</td><td>Một</td><td>Hai (hoặc một kèm bước build)</td></tr>
<tr><td>Xác thực</td><td>Cookie phiên + form đăng nhập + CSRF, có sẵn trong Spring Security</td><td>Token, refresh, CORS (Chương 21)</td></tr>
<tr><td>Hợp với</td><td>Màn quản trị và nhân viên, form, báo cáo, trang công khai cần SEO</td><td>App tương tác nhiều, web và mobile dùng chung một API</td></tr>
<tr><td>Yếu ở</td><td>Màn rất tương tác (kéo thả, cập nhật trực tiếp)</td><td>Màn CRUD đơn giản mà giờ phải dựng cả một dự án thứ hai</td></tr>
</tbody>
</table>
<p>Trong dự án cuối khoá bạn dùng cả hai: phần công khai hoặc phần cho thành viên đi qua API (mốc 13 và 22), còn một trang quản trị nhỏ cho nhân viên làm bằng Thymeleaf (mốc 20).</p>

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm <code>spring-boot-starter-thymeleaf</code> vào dự án và tạo <code>templates/hello.html</code> có một tiêu đề.</li>
<li>Viết một <code>@Controller</code> trả <code>"hello"</code>; mở bằng trình duyệt.</li>
<li>Đổi annotation thành <code>@RestController</code> rồi tải lại. Sau đó đổi về và gõ sai tên view. Ghi lại mỗi lỗi trông thế nào.</li>
</ol>
<p><strong>Đạt khi:</strong> chỉ nhìn phản hồi là bạn biết controller trả dữ liệu hay trả view, và đã tự thấy TemplateInputException một lần.</p></div>

<h3>🎤 Người phỏng vấn hay hỏi</h3>
<ol>
<li><strong>“@Controller khác @RestController thế nào?”</strong> — <code>@RestController</code> gắn <code>@ResponseBody</code> cho mọi hàm, nên giá trị trả về được message converter ghi vào body. <code>@Controller</code> trả tên view (hoặc <code>ModelAndView</code>) để ViewResolver phân giải.</li>
<li><strong>“ViewResolver là gì?”</strong> — Thành phần ánh xạ tên view logic sang template; Boot cấu hình resolver của Thymeleaf với tiền tố <code>classpath:/templates/</code> và hậu tố <code>.html</code>.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tên view</span><span class="v">Tên logic mà @Controller trả về; ViewResolver biến nó thành template.</span></div>
  <div class="kv"><span class="k">Model</span><span class="v">Map thuộc tính controller điền vào và template đọc ra.</span></div>
  <div class="kv"><span class="k">ViewResolver</span><span class="v">Ánh xạ tên view sang template (Thymeleaf: templates/&lt;tên&gt;.html).</span></div>
  <div class="kv"><span class="k">@ResponseBody</span><span class="v">Ghi giá trị trả về vào body HTTP thay vì phân giải view.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>@Controller điền Model và trả tên view; Thymeleaf dựng templates/&lt;tên&gt;.html.</li>
<li>@RestController trả chuỗi làm body — lỗi “trang hiện đúng tên của chính nó” phổ biến nhất.</li>
<li>Controller trang gọi cùng service với API; chỉ bước cuối của đường ống là khác.</li>
</ul>
${tl('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller.html', '📘', 'Spring Framework reference — Annotated controllers', 'Giá trị trả về của handler, Model, tên view')}
</div>
`;

/* ═════════════ 19.2 — Thymeleaf cơ bản ═════════════ */
const C2_HTML = xml(`
<p>th:text  → <b th:text="\${g.name}">name</b></p>
<p>th:utext → <b th:utext="\${g.name}">name</b></p>
<p th:if="\${g.status.name() == 'AVAILABLE'}">Ready to lend</p>
<p th:unless="\${g.status.name() == 'AVAILABLE'}" th:text="|Not available: \${g.status}|">status</p>
<a th:href="@{/admin/gear/{id}(id=\${g.id}, ref='list')}">permalink</a>
`
  );
const C2_LIST = xml(`
<table>
  <tr><th>#</th><th>Name</th><th>Category</th><th>Status</th></tr>
  <tr th:each="g : \${items}">
    <td th:text="\${g.id}">1</td><td th:text="\${g.name}">name</td>
    <td th:text="\${g.category}">cat</td><td th:text="\${g.status}">AVAILABLE</td>
  </tr>
</table>
`
  );
const O2 = out(`
$ curl -s -X POST localhost:8090/api/gear -H "Authorization: Bearer $STAFF" -H "Content-Type: application/json" -d '{"name":"<script>alert(1)</script>","category":"test"}'
{"id":10,"name":"<script>alert(1)</script>","category":"test","status":"AVAILABLE"}
$ curl -s -b cookies localhost:8090/admin/gear/10 | grep -E '<p|<a '
<p>th:text  → <b>&lt;script&gt;alert(1)&lt;/script&gt;</b></p>
<p>th:utext → <b><script>alert(1)</script></b></p>
<p>Ready to lend</p>
<a href="/admin/gear/10?ref=list">permalink</a>
`
  );
const L2 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 19 · Server-rendered pages' : 'Chương 19 · Trang dựng ở server'}</span>
<h2>${en ? '19.2 — Thymeleaf basics: expressions, loops, conditions and safe output' : '19.2 — Thymeleaf cơ bản: biểu thức, vòng lặp, điều kiện và xuất an toàn'}</h2>
<p class="lead">${en
  ? 'A Thymeleaf template is a valid HTML file with extra <code>th:*</code> attributes. Open it straight from disk and you see the placeholder text; render it through Spring and every <code>th:</code> attribute replaces what is next to it. That “natural template” idea is why designers and back-end developers can share the same file.'
  : 'Template Thymeleaf là một file HTML hợp lệ có thêm các thuộc tính <code>th:*</code>. Mở thẳng từ ổ đĩa thì bạn thấy chữ giữ chỗ; dựng qua Spring thì mỗi thuộc tính <code>th:</code> thay phần bên cạnh nó. Ý tưởng “natural template” đó là lý do người thiết kế và lập trình viên backend dùng chung được một file.'}</p>

<h3>${en ? 'Five expressions cover almost everything' : 'Năm loại biểu thức phủ gần như mọi thứ'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">\${…}</span><span class="v">${en ? 'Variable from the Model (Spring EL): \${g.name}, \${items.size()}' : 'Biến lấy từ Model (Spring EL): \${g.name}, \${items.size()}'}</span></div>
  <div class="kv"><span class="k">*{…}</span><span class="v">${en ? 'Field of the th:object currently selected — used in forms (19.3)' : 'Trường của th:object đang được chọn — dùng trong form (19.3)'}</span></div>
  <div class="kv"><span class="k">@{…}</span><span class="v">${en ? 'URL with context path and parameters: @{/admin/gear/{id}(id=\${g.id})}' : 'URL có context path và tham số: @{/admin/gear/{id}(id=\${g.id})}'}</span></div>
  <div class="kv"><span class="k">#{…}</span><span class="v">${en ? 'Message from messages.properties — for Vietnamese/English labels' : 'Chuỗi lấy từ messages.properties — cho nhãn tiếng Việt/tiếng Anh'}</span></div>
  <div class="kv"><span class="k">~{…}</span><span class="v">${en ? 'Fragment reference — layouts (19.4)' : 'Tham chiếu fragment — layout (19.4)'}</span></div>
</div>

<h3>${en ? 'A loop over the Model' : 'Vòng lặp trên Model'}</h3>
${C2_LIST}
<p>${en ? 'The second <code>&lt;tr&gt;</code> is repeated once per element of <code>items</code>; the text <code>1</code>, <code>name</code>, <code>cat</code> is only a placeholder for whoever opens the raw file.' : 'Dòng <code>&lt;tr&gt;</code> thứ hai được lặp mỗi phần tử của <code>items</code> một lần; chữ <code>1</code>, <code>name</code>, <code>cat</code> chỉ là giữ chỗ cho người mở file thô.'}</p>

<h3>${en ? 'th:text escapes, th:utext does not — measured' : 'th:text thoát ký tự, th:utext thì không — đo thật'}</h3>
${C2_HTML}
${O2}
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Trap — th:utext on user data is stored XSS.' : 'Bẫy — th:utext trên dữ liệu người dùng là stored XSS.'}</strong> ${en
  ? 'The API accepted the name as data (correct — it is just text). The page decides how to print it: <code>th:text</code> turned the angle brackets into entities, <code>th:utext</code> inserted a live script tag that would run in the browser of every staff member who opens the page — with their session cookie. Use <code>th:utext</code> only for HTML you produced yourself and sanitised.'
  : 'API nhận cái tên như dữ liệu (đúng — nó chỉ là chữ). Trang quyết định in ra thế nào: <code>th:text</code> biến dấu ngoặc nhọn thành thực thể, <code>th:utext</code> chèn nguyên thẻ script sẽ chạy trong trình duyệt của mọi nhân viên mở trang — kèm cookie phiên của họ. Chỉ dùng <code>th:utext</code> cho HTML do chính bạn tạo và đã làm sạch.'}</p></div>

<h3>${en ? 'Conditions and literal substitution' : 'Điều kiện và chèn chuỗi'}</h3>
<p>${en
  ? '<code>th:if</code> / <code>th:unless</code> remove the element when the condition is false. <code>|Not available: \${g.status}|</code> is literal substitution — easier to read than string concatenation. <code>@{/admin/gear/{id}(id=\${g.id}, ref=\'list\')}</code> fills the path variable and turns the remaining arguments into a query string, as the output shows.'
  : '<code>th:if</code> / <code>th:unless</code> gỡ phần tử khi điều kiện sai. <code>|Not available: \${g.status}|</code> là chèn chuỗi trực tiếp — dễ đọc hơn nối chuỗi. <code>@{/admin/gear/{id}(id=\${g.id}, ref=\'list\')}</code> điền biến đường dẫn và biến các đối số còn lại thành query string, như output ở trên.'}</p>

<h3>${en ? '🧪 Practice (15 minutes)' : '🧪 Thực hành (15 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Render the list of your main resource with th:each, and a detail page with th:if for one state.' : 'Dựng danh sách tài nguyên chính bằng th:each, và trang chi tiết có th:if cho một trạng thái.'}</li>
<li>${en ? 'Create a record whose name is an HTML script tag through your API; open it with th:text, then with th:utext; view the page source both times.' : 'Tạo qua API một bản ghi có tên là thẻ script HTML; mở bằng th:text, rồi bằng th:utext; xem mã nguồn trang cả hai lần.'}</li>
<li>${en ? 'Change th:utext back and add a line to SECURITY.md (milestone 11).' : 'Đổi lại th:utext và thêm một dòng vào SECURITY.md (mốc 11).'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'the page source shows &amp;lt;script&amp;gt; for user data everywhere in your templates (grep templates/ for th:utext returns nothing you cannot justify).' : 'mã nguồn trang hiện &amp;lt;script&amp;gt; cho dữ liệu người dùng ở mọi template (grep templates/ tìm th:utext không ra chỗ nào bạn không giải thích được).'}</p></div>

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? '\${} reads the Model, *{} the form object, @{} builds URLs, #{} reads messages, ~{} points to fragments.' : '\${} đọc Model, *{} đọc đối tượng form, @{} dựng URL, #{} đọc chuỗi thông điệp, ~{} trỏ tới fragment.'}</li>
<li>${en ? 'th:text escapes HTML; th:utext does not — never on user data.' : 'th:text thoát HTML; th:utext thì không — không bao giờ dùng cho dữ liệu người dùng.'}</li>
<li>${en ? 'Templates stay valid HTML, so placeholders show when the file is opened raw.' : 'Template vẫn là HTML hợp lệ, nên mở file thô vẫn thấy chữ giữ chỗ.'}</li>
</ul>
${tl('https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html', '🍃', 'Tutorial: Using Thymeleaf (3.1)', en ? 'Standard expressions, iteration, conditionals' : 'Biểu thức chuẩn, vòng lặp, điều kiện')}
</div>
`;

/* ═════════════ 19.3 — Form ═════════════ */
const C3_CTRL = java(`
@PostMapping("/admin/gear")
String create(@Valid @ModelAttribute("form") CreateGear form, BindingResult errors, Model model, RedirectAttributes flash) {
    if (errors.hasErrors()) {                                       // ở lại trang, hiện lỗi cạnh ô nhập
        model.addAttribute("items", gears.list(null, 0).items());
        return "admin/gear-list";
    }
    var g = gears.create(form);                                     // cùng @Valid record CreateGear với API
    flash.addFlashAttribute("msg", "Added " + g.name());
    return "redirect:/admin/gear";                                  // Post/Redirect/Get: F5 không gửi lại form
}
`
  );
const C3_HTML = xml(`
<p th:if="\${msg}" class="flash" th:text="\${msg}">flash</p>
<form th:action="@{/admin/gear}" th:object="\${form}" method="post">
  <input th:field="*{name}" placeholder="Name">
  <span class="error" th:if="\${#fields.hasErrors('name')}" th:errors="*{name}">error</span>
  <input th:field="*{category}" placeholder="Category">
  <span class="error" th:if="\${#fields.hasErrors('category')}" th:errors="*{category}">error</span>
  <button>Add</button>
</form>
`
  );
const O3 = out(`
# gửi form thiếu tên ⇒ ở lại trang, lỗi hiện cạnh ô nhập, ô category giữ giá trị đã gõ
$ curl -s -b cookies -X POST localhost:8090/admin/gear --data-urlencode "name=" --data-urlencode "category=audio" --data-urlencode "_csrf=$CSRF" | grep -E 'class="error"|name="category"'
  <span class="error">must not be blank</span>
  <input placeholder="Category" id="category" name="category" value="audio">
# gửi form hợp lệ ⇒ 302 về danh sách (Post/Redirect/Get)
$ curl -s -o /dev/null -w "%{http_code} %{redirect_url}" -b cookies -X POST localhost:8090/admin/gear --data-urlencode "name=Shure SM58" --data-urlencode "category=audio" --data-urlencode "_csrf=$CSRF"
302 http://localhost:8090/admin/gear
`
  );
const O3_SAI = out(`
# đổi thứ tự tham số: (… CreateGear form, Model model, BindingResult errors, …)
$ curl -s -w " [%{http_code}] %{content_type}" -b cookies -X POST localhost:8090/admin/gear --data-urlencode "name=" --data-urlencode "category=audio" --data-urlencode "_csrf=$CSRF"
{"detail":"Request body is invalid","instance":"/admin/gear","status":400,"title":"Bad Request","errors":{"name":"must not be blank"}} [400] application/problem+json
`
  );
const C3_FIX = java(`
@RestControllerAdvice(annotations = RestController.class)   // chỉ cho API; trang Thymeleaf không nhận JSON
class ApiErrors { … }
`
  );
const L3 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 19 · Server-rendered pages' : 'Chương 19 · Trang dựng ở server'}</span>
<h2>${en ? '19.3 — Forms: th:object, th:field, BindingResult and Post/Redirect/Get' : '19.3 — Form: th:object, th:field, BindingResult và Post/Redirect/Get'}</h2>
<p class="lead">${en
  ? 'A server-rendered form has three jobs the API never had: show the errors next to the right input, keep what the user typed, and make sure pressing F5 after saving does not save twice. Spring MVC and Thymeleaf have one standard way to do all three.'
  : 'Form dựng ở server có ba việc mà API chưa từng phải làm: hiện lỗi cạnh đúng ô nhập, giữ lại những gì người dùng đã gõ, và bảo đảm bấm F5 sau khi lưu không lưu lần hai. Spring MVC và Thymeleaf có một cách chuẩn để làm cả ba.'}</p>

<h3>${en ? 'The controller' : 'Controller'}</h3>
${C3_CTRL}
<p>${en
  ? 'The form binds to the <em>same</em> validated record <code>CreateGear</code> as <code>POST /api/gear</code>: one set of rules (@NotBlank, @Size), two front doors. <code>BindingResult</code> receives the validation errors instead of an exception; when it has errors the method renders the page again with the same model attribute, so the inputs keep their values.'
  : 'Form gắn vào <em>cùng</em> record <code>CreateGear</code> có validation với <code>POST /api/gear</code>: một bộ luật (@NotBlank, @Size), hai cửa vào. <code>BindingResult</code> nhận lỗi validation thay cho exception; khi có lỗi, hàm dựng lại trang với đúng thuộc tính model đó, nên các ô giữ nguyên giá trị.'}</p>

<h3>${en ? 'The template' : 'Template'}</h3>
${C3_HTML}
<p>${en
  ? '<code>th:object</code> selects the form object; <code>th:field="*{name}"</code> writes the <code>id</code>, <code>name</code> and current <code>value</code> attributes for you; <code>th:errors</code> prints the message of that field. <code>th:action</code> also adds the hidden <code>_csrf</code> input (lesson 19.5).'
  : '<code>th:object</code> chọn đối tượng form; <code>th:field="*{name}"</code> tự viết thuộc tính <code>id</code>, <code>name</code> và <code>value</code> hiện tại; <code>th:errors</code> in thông báo của trường đó. <code>th:action</code> còn tự thêm ô ẩn <code>_csrf</code> (bài 19.5).'}</p>
${O3}

<h3>${en ? 'Post/Redirect/Get and flash attributes' : 'Post/Redirect/Get và flash attribute'}</h3>
<p>${en
  ? 'If a successful POST rendered the page directly, the browser’s last request would be that POST — F5 would resubmit it and create a duplicate. Returning <code>redirect:/admin/gear</code> makes the browser do a GET instead. The “Added …” message survives the redirect because <code>RedirectAttributes.addFlashAttribute</code> stores it in the session for exactly one request.'
  : 'Nếu POST thành công dựng trang trực tiếp, request cuối của trình duyệt là chính POST đó — F5 sẽ gửi lại và tạo bản trùng. Trả về <code>redirect:/admin/gear</code> buộc trình duyệt làm một lệnh GET. Thông báo “Added …” sống qua lần chuyển hướng vì <code>RedirectAttributes.addFlashAttribute</code> lưu nó trong session cho đúng một request.'}</p>

<h3>${en ? 'Measured: what one misplaced parameter does' : 'Đo thật: một tham số đặt sai chỗ làm gì'}</h3>
${O3_SAI}
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Trap — BindingResult must come right after the object it belongs to.' : 'Bẫy — BindingResult phải đứng ngay sau đối tượng nó thuộc về.'}</strong> ${en
  ? 'With <code>Model</code> in between, Spring no longer passes the errors to your method; it throws <code>MethodArgumentNotValidException</code>. In our sample the API’s error handler was registered for the whole package, so it caught that exception and the staff member saw raw JSON instead of the form. Two fixes, both applied: put <code>BindingResult</code> right after the form object, and scope the API advice to REST controllers:'
  : 'Có <code>Model</code> chen giữa thì Spring không còn đưa lỗi cho hàm của bạn; nó ném <code>MethodArgumentNotValidException</code>. Trong dự án mẫu, bộ xử lý lỗi của API đăng ký cho cả package, nên nó bắt exception đó và nhân viên thấy JSON thô thay cho form. Hai cách sửa, áp cả hai: đặt <code>BindingResult</code> ngay sau đối tượng form, và giới hạn advice của API chỉ cho REST controller:'}</p></div>
${C3_FIX}

<h3>${en ? '🧪 Practice (20 minutes)' : '🧪 Thực hành (20 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Build a create form for your main resource that reuses the request record of your API.' : 'Dựng form tạo mới cho tài nguyên chính, dùng lại record request của API.'}</li>
<li>${en ? 'Submit it empty, then with one valid field: check that the valid field keeps its value.' : 'Gửi form rỗng, rồi gửi với một trường hợp lệ: kiểm trường hợp lệ vẫn giữ giá trị.'}</li>
<li>${en ? 'Save successfully, press F5 and count the rows in the database.' : 'Lưu thành công, bấm F5 và đếm số dòng trong CSDL.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'errors appear beside inputs, values are kept, and F5 after saving creates no duplicate.' : 'lỗi hiện cạnh ô nhập, giá trị được giữ, và F5 sau khi lưu không tạo bản trùng.'}</p></div>

<h3>🎤 ${en ? 'What interviewers ask' : 'Người phỏng vấn hay hỏi'}</h3>
<ol>
<li><strong>${en ? '“What is the PRG pattern and why?”' : '“Mẫu PRG là gì và để làm gì?”'}</strong> — ${en ? 'Post/Redirect/Get: answer a successful POST with a redirect so a refresh repeats a harmless GET, not the POST.' : 'Post/Redirect/Get: trả lời POST thành công bằng một lần chuyển hướng, để tải lại trang chỉ lặp lệnh GET vô hại chứ không lặp POST.'}</li>
<li><strong>${en ? '“Where must BindingResult be declared?”' : '“BindingResult phải khai ở đâu?”'}</strong> — ${en ? 'Immediately after the @ModelAttribute (or @RequestBody) parameter it describes.' : 'Ngay sau tham số @ModelAttribute (hoặc @RequestBody) mà nó mô tả.'}</li>
</ol>

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'th:object + th:field + th:errors: errors beside inputs, values kept.' : 'th:object + th:field + th:errors: lỗi cạnh ô nhập, giá trị được giữ.'}</li>
<li>${en ? 'One validated record serves both the form and the API.' : 'Một record có validation phục vụ cả form lẫn API.'}</li>
<li>${en ? 'PRG + flash attributes: no duplicates on refresh, message survives the redirect.' : 'PRG + flash attribute: tải lại không tạo bản trùng, thông báo sống qua lần chuyển hướng.'}</li>
</ul>
${tl('https://www.thymeleaf.org/doc/tutorials/3.1/thymeleafspring.html', '🍃', 'Tutorial: Thymeleaf + Spring', en ? 'Forms, th:field, validation and error messages' : 'Form, th:field, validation và thông báo lỗi')}
</div>
`;

/* ═════════════ 19.4 — Layout & fragment ═════════════ */
const C4_FRAG = xml(`
<!-- templates/fragments/layout.html -->
<header th:fragment="header(title)">
  <nav><a th:href="@{/admin/gear}">Gear</a> · <a th:href="@{/admin/loans}">Loans</a></nav>
  <h1 th:text="\${title}">Page title</h1>
  <form th:action="@{/logout}" method="post" sec:authorize="isAuthenticated()">
    <span sec:authentication="name">user</span> <button>Sign out</button>
  </form>
</header>

<!-- templates/admin/gear-list.html -->
<header th:replace="~{fragments/layout :: header('Club gear')}">header</header>
`
  );
const O4 = out(`
$ curl -s -b cookies localhost:8090/admin/gear | sed -n '/<header>/,/<\\/header>/p'
<header>
  <nav><a href="/admin/gear">Gear</a> · <a href="/admin/loans">Loans</a></nav>
  <h1>Club gear</h1>
  <form action="/logout" method="post"><input type="hidden" name="_csrf" value="neIRjPYq…"/>
    <span>chi@club.test</span> <button>Sign out</button>
  </form>
</header>
`
  );
const L4 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 19 · Server-rendered pages' : 'Chương 19 · Trang dựng ở server'}</span>
<h2>${en ? '19.4 — Layouts, fragments and static resources' : '19.4 — Layout, fragment và tài nguyên tĩnh'}</h2>
<p class="lead">${en
  ? 'The third admin page is where copy-paste starts: the same menu, the same sign-out button, the same CSS link in every file. Fragments let one file own each shared piece; every page includes it.'
  : 'Tới trang quản trị thứ ba là bắt đầu chép dán: cùng menu, cùng nút đăng xuất, cùng link CSS ở mọi file. Fragment cho phép một file sở hữu từng phần dùng chung; mọi trang chỉ việc chèn nó vào.'}</p>
${C4_FRAG}
${O4}
<p>${en
  ? '<code>th:fragment="header(title)"</code> declares a fragment with a parameter; <code>th:replace="~{fragments/layout :: header(\'Club gear\')}"</code> replaces the host tag with it. Note three things in the output: the URL expressions became real paths, the sign-out form received its CSRF token automatically, and <code>sec:authentication="name"</code> (from <code>thymeleaf-extras-springsecurity6</code>) printed the logged-in user.'
  : '<code>th:fragment="header(title)"</code> khai báo fragment có tham số; <code>th:replace="~{fragments/layout :: header(\'Club gear\')}"</code> thay thẻ chủ bằng fragment đó. Để ý ba điều trong output: biểu thức URL thành đường dẫn thật, form đăng xuất tự nhận CSRF token, và <code>sec:authentication="name"</code> (từ <code>thymeleaf-extras-springsecurity6</code>) in ra người đang đăng nhập.'}</p>

<h3>${en ? 'th:replace vs th:insert' : 'th:replace và th:insert'}</h3>
<p>${en
  ? '<code>th:replace</code> removes the host element and puts the fragment in its place; <code>th:insert</code> keeps the host element and puts the fragment inside it. Use replace for whole blocks (header, footer), insert when the host tag carries its own classes.'
  : '<code>th:replace</code> gỡ phần tử chủ và đặt fragment vào chỗ đó; <code>th:insert</code> giữ phần tử chủ và đặt fragment vào bên trong. Dùng replace cho cả khối (header, footer), dùng insert khi thẻ chủ mang class riêng.'}</p>

<h3>${en ? 'Static files' : 'File tĩnh'}</h3>
<p>${en
  ? 'Anything under <code>src/main/resources/static/</code> is served as is: <code>static/css/admin.css</code> is reachable at <code>/css/admin.css</code> and referenced with <code>th:href="@{/css/admin.css}"</code>. If your admin chain requires a login for <code>/admin/**</code> only, static files stay public — keep secrets out of them.'
  : 'Mọi thứ dưới <code>src/main/resources/static/</code> được phục vụ nguyên trạng: <code>static/css/admin.css</code> có ở <code>/css/admin.css</code> và được tham chiếu bằng <code>th:href="@{/css/admin.css}"</code>. Nếu chuỗi bảo mật của trang quản trị chỉ đòi đăng nhập cho <code>/admin/**</code>, file tĩnh vẫn công khai — đừng để bí mật trong đó.'}</p>

<h3>${en ? '🧪 Practice (15 minutes)' : '🧪 Thực hành (15 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Move the header and menu of your admin pages into fragments/layout.html.' : 'Chuyển header và menu của các trang quản trị vào fragments/layout.html.'}</li>
<li>${en ? 'Give the fragment a title parameter and use it in two pages.' : 'Cho fragment một tham số tiêu đề và dùng ở hai trang.'}</li>
<li>${en ? 'Add a stylesheet under static/css and check it loads without logging in.' : 'Thêm một stylesheet dưới static/css và kiểm nó tải được khi chưa đăng nhập.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'changing the menu in one file changes it on every admin page.' : 'sửa menu ở một file là mọi trang quản trị đổi theo.'}</p></div>
<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'th:fragment declares, th:replace/th:insert includes; fragments can take parameters.' : 'th:fragment khai báo, th:replace/th:insert chèn vào; fragment nhận được tham số.'}</li>
<li>${en ? 'Forms inside fragments still get their CSRF token from th:action.' : 'Form bên trong fragment vẫn nhận CSRF token nhờ th:action.'}</li>
<li>${en ? 'static/ is served as is and is public unless you protect it.' : 'static/ được phục vụ nguyên trạng và công khai nếu bạn không bảo vệ.'}</li>
</ul>
</div>
`;

/* ═════════════ 19.5 — Form login + CSRF cạnh JWT ═════════════ */
const C5_SEC = java(`
/** Chuỗi 1 — trang quản trị Thymeleaf: phiên + form đăng nhập + CSRF (trình duyệt tự gửi cookie). */
@Bean @Order(1)
SecurityFilterChain admin(HttpSecurity http) throws Exception {
    http.securityMatcher("/admin/**", "/login", "/logout")
        .authorizeHttpRequests(a -> a.requestMatchers("/login").permitAll().anyRequest().hasRole("STAFF"))
        .formLogin(f -> f.loginPage("/login").defaultSuccessUrl("/admin/gear", true))
        .logout(Customizer.withDefaults());
    return http.build();
}

/** Chuỗi 2 — REST API: không phiên, JWT Bearer, không CSRF (không dùng cookie để xác thực). */
@Bean @Order(2)
SecurityFilterChain api(HttpSecurity http) throws Exception {
    http.securityMatcher("/api/**")
        .csrf(c -> c.disable())
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        // … như mốc 10
    return http.build();
}

/** Đăng nhập form của trang quản trị đọc chính bảng member. */
@Bean
UserDetailsService users(MemberRepository members) {
    return email -> members.findByEmailIgnoreCase(email)
            .map(m -> User.withUsername(m.getEmail()).password(m.getPasswordHash()).roles(m.getRole().name()).build())
            .orElseThrow(() -> new UsernameNotFoundException(email));
}
`
  );
const C5_LOGIN = xml(`
<p th:if="\${param.error}" class="error">Wrong email or password.</p>
<form th:action="@{/login}" method="post">
  <label>Email <input name="username" type="email" required></label>
  <label>Password <input name="password" type="password" required></label>
  <button>Sign in</button>
</form>
`
  );
const O5 = out(`
$ curl -s -o /dev/null -w "%{http_code} %{redirect_url}" localhost:8090/admin/gear
302 http://localhost:8090/login
# lấy _csrf từ form đăng nhập rồi đăng nhập bằng tài khoản STAFF
POST /login -> 302 http://localhost:8090/admin/gear
# cùng form thêm thiết bị nhưng KHÔNG có _csrf (trang lạ dụ admin bấm)
$ curl -s -o /dev/null -w "%{http_code}" -b cookies -X POST localhost:8090/admin/gear --data-urlencode "name=Hacked" --data-urlencode "category=x"
403
`
  );
const O5_SAI = out(`
# xoá securityMatcher(...) khỏi chuỗi admin rồi khởi động:
… Factory method 'springSecurityFilterChain' threw exception with message: A filter chain that matches any request [DefaultSecurityFilterChain defined as 'admin' … matching [any request] …] has already been configured, which means that this filter chain [DefaultSecurityFilterChain defined as 'api' …
APPLICATION FAILED TO START
`
  );
const L5 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 19 · Server-rendered pages' : 'Chương 19 · Trang dựng ở server'}</span>
<h2>${en ? '19.5 — Form login, sessions and CSRF next to a JWT API' : '19.5 — Form đăng nhập, session và CSRF bên cạnh API JWT'}</h2>
<p class="lead">${en
  ? 'Your API authenticates every request with a bearer token the JavaScript attaches by hand. A browser page works differently: after a form login, the browser sends the session cookie <em>by itself</em> on every request — including requests a hostile page triggers. That one difference is why the admin pages need CSRF protection and the API does not, and why one application ends up with two security filter chains.'
  : 'API của bạn xác thực mọi request bằng bearer token mà JavaScript tự gắn. Trang trình duyệt hoạt động khác: sau khi đăng nhập bằng form, trình duyệt <em>tự</em> gửi cookie phiên trong mọi request — kể cả request do một trang xấu kích hoạt. Chính khác biệt đó là lý do trang quản trị cần chống CSRF còn API thì không, và là lý do một ứng dụng có hai chuỗi filter bảo mật.'}</p>
${C5_SEC}
<h3>${en ? 'The login page' : 'Trang đăng nhập'}</h3>
${C5_LOGIN}
<p>${en
  ? 'Spring Security’s form login expects the fields <code>username</code> and <code>password</code> posted to <code>/login</code>; on failure it redirects to <code>/login?error</code>, which <code>\${param.error}</code> reads. The password check uses the same <code>PasswordEncoder</code> and the same BCrypt hashes as the API login of milestone 10.'
  : 'Form login của Spring Security chờ hai trường <code>username</code> và <code>password</code> POST tới <code>/login</code>; sai thì chuyển về <code>/login?error</code>, chỗ mà <code>\${param.error}</code> đọc được. Phép kiểm mật khẩu dùng cùng <code>PasswordEncoder</code> và cùng mã băm BCrypt với đăng nhập API của mốc 10.'}</p>
${O5}
<p>${en
  ? 'The last line is the point of CSRF: the request had a perfectly valid session cookie — exactly what a malicious page would ride on — but no token from <em>our</em> form, so it was refused.'
  : 'Dòng cuối là ý nghĩa của CSRF: request có cookie phiên hoàn toàn hợp lệ — đúng thứ một trang độc sẽ lợi dụng — nhưng không có token từ form <em>của chúng ta</em>, nên bị từ chối.'}</p>

<h3>${en ? 'Measured: two chains, one forgotten matcher' : 'Đo thật: hai chuỗi, quên một matcher'}</h3>
${O5_SAI}
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Trap — a chain without securityMatcher matches everything.' : 'Bẫy — chuỗi không có securityMatcher khớp mọi thứ.'}</strong> ${en
  ? 'Chains are tried in @Order; the first whose matcher fits handles the request. A chain with no matcher fits every request, so any chain after it could never run. Spring Security 7 detects that and refuses to start — far better than older setups where the API silently started redirecting JWT clients to /login.'
  : 'Các chuỗi được thử theo @Order; chuỗi đầu tiên có matcher khớp sẽ xử lý request. Chuỗi không có matcher khớp mọi request, nên chuỗi nào sau nó cũng không bao giờ chạy. Spring Security 7 phát hiện và từ chối khởi động — tốt hơn nhiều so với cấu hình cũ, nơi API lặng lẽ chuyển client JWT về /login.'}</p></div>

<h3>${en ? 'Showing parts of a page by role' : 'Hiện một phần trang theo vai trò'}</h3>
<p>${en
  ? '<code>sec:authorize="hasRole(\'STAFF\')"</code> removes an element for users without the role. It is a convenience for the interface only — the same check must exist on the server route (here: <code>anyRequest().hasRole("STAFF")</code>), because hiding a button does not stop a POST.'
  : '<code>sec:authorize="hasRole(\'STAFF\')"</code> gỡ phần tử với người không có vai trò đó. Nó chỉ là tiện ích giao diện — tuyến phía server phải có cùng phép kiểm (ở đây: <code>anyRequest().hasRole("STAFF")</code>), vì ẩn nút không chặn được một lệnh POST.'}</p>

<h3>${en ? '🧪 Practice (20 minutes)' : '🧪 Thực hành (20 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Add the admin chain with @Order(1) and securityMatcher; keep your JWT chain unchanged.' : 'Thêm chuỗi admin với @Order(1) và securityMatcher; giữ nguyên chuỗi JWT.'}</li>
<li>${en ? 'Log in through the form, then call your API with curl and a JWT: both must still work.' : 'Đăng nhập qua form, rồi gọi API bằng curl với JWT: cả hai đều phải chạy.'}</li>
<li>${en ? 'Replay an admin POST without _csrf and confirm 403.' : 'Gửi lại một lệnh POST của trang quản trị không có _csrf và xác nhận 403.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'the browser pages use sessions + CSRF, the API stays stateless, and neither breaks the other.' : 'trang trình duyệt dùng session + CSRF, API vẫn stateless, và không bên nào làm hỏng bên kia.'}</p></div>

<h3>🎤 ${en ? 'What interviewers ask' : 'Người phỏng vấn hay hỏi'}</h3>
<ol>
<li><strong>${en ? '“Why disable CSRF for the API but not for the pages?”' : '“Vì sao tắt CSRF cho API mà không tắt cho trang?”'}</strong> — ${en ? 'CSRF abuses credentials the browser sends automatically (cookies). A bearer token in a header is never sent automatically, so a forged request has no credentials.' : 'CSRF lợi dụng thông tin đăng nhập trình duyệt tự gửi (cookie). Bearer token trong header không bao giờ được tự gửi, nên request giả mạo không có thông tin đăng nhập.'}</li>
<li><strong>${en ? '“How do you combine form login and JWT in one app?”' : '“Kết hợp form login và JWT trong một app thế nào?”'}</strong> — ${en ? 'Two SecurityFilterChain beans with @Order and distinct securityMatcher paths, sharing the UserDetailsService and PasswordEncoder.' : 'Hai bean SecurityFilterChain có @Order và securityMatcher khác nhau, dùng chung UserDetailsService và PasswordEncoder.'}</li>
</ol>
<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Pages: session cookie + form login + CSRF. API: bearer JWT, stateless, no CSRF.' : 'Trang: cookie phiên + form login + CSRF. API: bearer JWT, stateless, không CSRF.'}</li>
<li>${en ? 'Every chain except the last needs a securityMatcher; Spring Security 7 refuses to start otherwise.' : 'Mọi chuỗi trừ chuỗi cuối đều cần securityMatcher; thiếu thì Spring Security 7 không chịu khởi động.'}</li>
<li>${en ? 'sec:authorize hides; the server route decides.' : 'sec:authorize để ẩn; tuyến phía server mới là nơi quyết định.'}</li>
</ul>
${tl('https://docs.spring.io/spring-security/reference/servlet/configuration/java.html#jc-httpsecurity-multiple-filter-chains', '🔐', 'Spring Security — Multiple SecurityFilterChain', en ? 'Ordering and matching of several chains' : 'Thứ tự và cách khớp của nhiều chuỗi')}
${tl('https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html', '🛡️', 'Spring Security — CSRF', en ? 'When CSRF protection is needed and how the token works' : 'Khi nào cần chống CSRF và token hoạt động thế nào')}
</div>
`;

/* ═════════════ 19.6 — Lab ═════════════ */
const L6 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 19 · Lab' : 'Chương 19 · Lab'}</span>
<h2>${en ? '19.6 — Chapter 19 lab + interview questions' : '19.6 — Lab chương 19 + câu hỏi phỏng vấn'}</h2>
<p class="lead">${en
  ? 'Build a small staff back office for the LabFlow API of this course (or for the sample “club gear” app): list, create with validation, a detail page, a shared layout, form login for staff only — next to the JWT API, which must keep working.'
  : 'Dựng một trang quản trị nhỏ cho nhân viên trên LabFlow API của khoá (hoặc app mẫu “kho thiết bị CLB”): danh sách, tạo mới có validation, trang chi tiết, layout dùng chung, form đăng nhập chỉ cho nhân viên — bên cạnh API JWT, thứ vẫn phải chạy bình thường.'}</p>
<h3>${en ? 'Tasks' : 'Nhiệm vụ'}</h3>
<ol>
<li>${en ? '<code>GET /admin/labs</code>: table of labs with th:each; status shown with th:if/th:unless.' : '<code>GET /admin/labs</code>: bảng phòng lab bằng th:each; trạng thái hiện bằng th:if/th:unless.'}</li>
<li>${en ? '<code>POST /admin/labs</code>: form reusing the API’s create record; errors beside inputs; PRG + flash message.' : '<code>POST /admin/labs</code>: form dùng lại record tạo mới của API; lỗi cạnh ô nhập; PRG + flash message.'}</li>
<li>${en ? '<code>GET /admin/labs/{id}</code>: detail page; a lab named with an HTML script tag must render as text.' : '<code>GET /admin/labs/{id}</code>: trang chi tiết; phòng lab tên là thẻ script HTML phải hiện như chữ.'}</li>
<li>${en ? 'fragments/layout.html with header(title), used by all three pages.' : 'fragments/layout.html có header(title), dùng ở cả ba trang.'}</li>
<li>${en ? 'Admin chain @Order(1) with form login (MANAGER role); the /api/** chain unchanged.' : 'Chuỗi admin @Order(1) có form login (vai trò MANAGER); chuỗi /api/** giữ nguyên.'}</li>
<li>${en ? 'A @WebMvcTest (or MockMvc in @SpringBootTest) that asserts: anonymous ⇒ 302 to /login; invalid form ⇒ 200 with an error message in the HTML; valid form ⇒ 302; POST without CSRF ⇒ 403.' : 'Một @WebMvcTest (hoặc MockMvc trong @SpringBootTest) khẳng định: chưa đăng nhập ⇒ 302 về /login; form sai ⇒ 200 kèm thông báo lỗi trong HTML; form đúng ⇒ 302; POST thiếu CSRF ⇒ 403.'}</li>
</ol>
<h3>${en ? 'Rubric (10 points)' : 'Rubric (10 điểm)'}</h3>
<table><thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr></thead><tbody>
<tr><td>${en ? 'List + detail render correct data, escaped' : 'Danh sách + chi tiết hiện đúng dữ liệu, có thoát ký tự'}</td><td>2</td></tr>
<tr><td>${en ? 'Form: validation beside inputs, values kept, PRG' : 'Form: validation cạnh ô nhập, giữ giá trị, PRG'}</td><td>3</td></tr>
<tr><td>${en ? 'Layout fragment shared by all pages' : 'Fragment layout dùng chung cho mọi trang'}</td><td>1</td></tr>
<tr><td>${en ? 'Two chains, CSRF on pages, API still stateless' : 'Hai chuỗi, CSRF ở trang, API vẫn stateless'}</td><td>2</td></tr>
<tr><td>${en ? 'Page tests for the four cases' : 'Test trang cho bốn trường hợp'}</td><td>2</td></tr>
</tbody></table>
<details><summary>${en ? 'Hint for the tests' : 'Gợi ý cho phần test'}</summary>
<p>${en
  ? 'Use <code>mockMvc.perform(post("/admin/labs").with(csrf()).with(user("m").roles("MANAGER")).param("name", ""))</code> and assert <code>status().isOk()</code> plus <code>content().string(containsString("must not be blank"))</code>. Drop <code>.with(csrf())</code> for the 403 case.'
  : 'Dùng <code>mockMvc.perform(post("/admin/labs").with(csrf()).with(user("m").roles("MANAGER")).param("name", ""))</code> rồi khẳng định <code>status().isOk()</code> cùng <code>content().string(containsString("must not be blank"))</code>. Bỏ <code>.with(csrf())</code> cho trường hợp 403.'}</p>
</details>
<h3>🎤 ${en ? 'Interview questions for this chapter' : 'Câu hỏi phỏng vấn của chương'}</h3>
<ol>
<li>${en ? 'What does a @Controller method return, and who turns it into HTML?' : 'Hàm @Controller trả về gì, và ai biến nó thành HTML?'}</li>
<li>${en ? 'th:text vs th:utext — when is th:utext acceptable?' : 'th:text khác th:utext thế nào — khi nào chấp nhận được th:utext?'}</li>
<li>${en ? 'Explain Post/Redirect/Get and flash attributes.' : 'Giải thích Post/Redirect/Get và flash attribute.'}</li>
<li>${en ? 'Why must BindingResult follow the model attribute directly? What happens otherwise?' : 'Vì sao BindingResult phải đứng ngay sau model attribute? Không thì sao?'}</li>
<li>${en ? 'How do form login and JWT coexist in one Spring Boot app?' : 'Form login và JWT cùng tồn tại trong một app Spring Boot thế nào?'}</li>
<li>${en ? 'Why does a session-based page need CSRF protection while a bearer-token API does not?' : 'Vì sao trang dùng session cần chống CSRF còn API dùng bearer token thì không?'}</li>
<li>${en ? 'Thymeleaf or a React SPA for an internal admin tool — and why?' : 'Thymeleaf hay SPA React cho một công cụ quản trị nội bộ — vì sao?'}</li>
</ol>
</div>
`;

const QUIZ19 = [
  Q('19-1', 'A method annotated @RestController returns the String "admin/gear-list". What does the browser receive?|||Một hàm trong @RestController trả về chuỗi "admin/gear-list". Trình duyệt nhận được gì?', [
    'The rendered admin/gear-list.html page|||Trang admin/gear-list.html đã được dựng',
    'The text admin/gear-list as the response body|||Chữ admin/gear-list làm body phản hồi',
    'A 404 because no template exists|||Lỗi 404 vì không có template',
    'A redirect to /admin/gear-list|||Chuyển hướng tới /admin/gear-list',
  ], 1, '@RestController = @Controller + @ResponseBody: the return value is written to the body, not resolved as a view.|||@RestController = @Controller + @ResponseBody: giá trị trả về được ghi vào body, không được phân giải thành view.'),
  Q('19-2', 'Where does Boot’s Thymeleaf ViewResolver look for the view "admin/gear-list" by default?|||Mặc định ViewResolver Thymeleaf của Boot tìm view "admin/gear-list" ở đâu?', [
    'src/main/webapp/WEB-INF/admin/gear-list.jsp|||src/main/webapp/WEB-INF/admin/gear-list.jsp',
    'src/main/resources/static/admin/gear-list.html|||src/main/resources/static/admin/gear-list.html',
    'src/main/resources/templates/admin/gear-list.html|||src/main/resources/templates/admin/gear-list.html',
    'The current working directory|||Thư mục làm việc hiện tại',
  ], 2, 'Prefix classpath:/templates/, suffix .html.|||Tiền tố classpath:/templates/, hậu tố .html.'),
  Q('19-3', 'A user names an item with a script tag. Which attribute prints it safely as text?|||Người dùng đặt tên một mục là thẻ script. Thuộc tính nào in nó ra an toàn dưới dạng chữ?', [
    'th:utext|||th:utext',
    'th:text|||th:text',
    'th:inline="javascript"|||th:inline="javascript"',
    'th:remove|||th:remove',
  ], 1, 'th:text escapes HTML special characters; th:utext inserts the raw HTML (stored XSS).|||th:text thoát ký tự đặc biệt của HTML; th:utext chèn HTML thô (stored XSS).'),
  Q('19-4', 'In a form, what does th:field="*{name}" generate?|||Trong form, th:field="*{name}" sinh ra gì?', [
    'Only the label of the field|||Chỉ nhãn của trường',
    'The id, name and current value attributes bound to the form object’s name property|||Thuộc tính id, name và value hiện tại, gắn với thuộc tính name của đối tượng form',
    'A validation annotation|||Một annotation validation',
    'A hidden CSRF input|||Một ô ẩn CSRF',
  ], 1, '*{} reads from the th:object; th:field writes id, name and value.|||*{} đọc từ th:object; th:field viết id, name và value.'),
  Q('19-5', 'The handler is create(@Valid @ModelAttribute("form") CreateGear form, Model model, BindingResult errors). An invalid form is posted. What happens?|||Handler là create(@Valid @ModelAttribute("form") CreateGear form, Model model, BindingResult errors). Gửi một form sai. Chuyện gì xảy ra?', [
    'The errors are available in BindingResult as usual|||Lỗi vẫn có trong BindingResult như thường',
    'The form is saved anyway|||Form vẫn được lưu',
    'MethodArgumentNotValidException is thrown because BindingResult is not directly after the model attribute|||Ném MethodArgumentNotValidException vì BindingResult không đứng ngay sau model attribute',
    'Thymeleaf shows a blank page|||Thymeleaf hiện trang trắng',
  ], 2, 'BindingResult must immediately follow the parameter it describes; measured in lesson 19.3 (the API error handler then returned JSON).|||BindingResult phải đứng ngay sau tham số nó mô tả; đo thật ở bài 19.3 (bộ xử lý lỗi API khi đó trả JSON).'),
  Q('19-6', 'Why return "redirect:/admin/gear" after a successful POST instead of rendering the list directly?|||Vì sao trả "redirect:/admin/gear" sau POST thành công thay vì dựng thẳng danh sách?', [
    'Redirects are faster|||Chuyển hướng nhanh hơn',
    'So that refreshing the page repeats a GET, not the POST that would create a duplicate|||Để tải lại trang chỉ lặp lệnh GET, không lặp POST gây bản trùng',
    'Thymeleaf cannot render after a POST|||Thymeleaf không dựng được trang sau POST',
    'To clear the CSRF token|||Để xoá CSRF token',
  ], 1, 'Post/Redirect/Get.|||Post/Redirect/Get.'),
  Q('19-7', 'How does the "Added …" message survive the redirect?|||Thông báo "Added …" sống qua lần chuyển hướng bằng cách nào?', [
    'It is put in the URL automatically|||Nó tự được đưa vào URL',
    'RedirectAttributes.addFlashAttribute keeps it in the session for exactly one request|||RedirectAttributes.addFlashAttribute giữ nó trong session cho đúng một request',
    'It is stored in the database|||Nó được lưu trong CSDL',
    'Model attributes always survive redirects|||Thuộc tính Model luôn sống qua chuyển hướng',
  ], 1, 'Flash attributes are stored before the redirect and removed after the next request.|||Flash attribute được lưu trước khi chuyển hướng và xoá sau request kế tiếp.'),
  Q('19-8', 'A logged-in staff member’s browser posts the admin form without the _csrf field. What does Spring Security return?|||Trình duyệt của một nhân viên đã đăng nhập gửi form quản trị không có trường _csrf. Spring Security trả về gì?', [
    '200 — the session cookie is valid|||200 — cookie phiên hợp lệ',
    '302 to /login|||302 về /login',
    '403 Forbidden|||403 Forbidden',
    '401 Unauthorized|||401 Unauthorized',
  ], 2, 'Measured in lesson 19.5: valid session, missing token ⇒ 403.|||Đo ở bài 19.5: phiên hợp lệ, thiếu token ⇒ 403.'),
  Q('19-9', 'Why can the /api/** chain disable CSRF safely?|||Vì sao chuỗi /api/** tắt CSRF mà vẫn an toàn?', [
    'Because APIs are never attacked|||Vì API không bao giờ bị tấn công',
    'Because it authenticates with a bearer token in a header that browsers never send automatically|||Vì nó xác thực bằng bearer token trong header mà trình duyệt không bao giờ tự gửi',
    'Because JSON cannot be forged|||Vì JSON không giả được',
    'Because CORS replaces CSRF|||Vì CORS thay thế CSRF',
  ], 1, 'CSRF rides on automatically sent credentials such as cookies.|||CSRF lợi dụng thông tin đăng nhập được tự gửi như cookie.'),
  Q('19-10', 'Two SecurityFilterChain beans: @Order(1) has no securityMatcher, @Order(2) has securityMatcher("/api/**"). What happens in Spring Security 7?|||Hai bean SecurityFilterChain: @Order(1) không có securityMatcher, @Order(2) có securityMatcher("/api/**"). Ở Spring Security 7 chuyện gì xảy ra?', [
    'Both chains apply to /api/** requests|||Cả hai chuỗi cùng áp cho request /api/**',
    'The API chain wins because it is more specific|||Chuỗi API thắng vì cụ thể hơn',
    'The application fails to start: a chain matching any request is followed by another chain|||Ứng dụng không khởi động: một chuỗi khớp mọi request lại đứng trước một chuỗi khác',
    'Spring merges them into one chain|||Spring gộp chúng thành một chuỗi',
  ], 2, 'Measured in lesson 19.5: "A filter chain that matches any request … has already been configured".|||Đo ở bài 19.5: "A filter chain that matches any request … has already been configured".'),
];

export default {
  title: 'Chapter 19 — Server-rendered pages: Spring MVC views and Thymeleaf|||Chương 19 — Trang dựng ở server: Spring MVC trả view và Thymeleaf',
  description: 'HSF302: @Controller trả view, Thymeleaf, form có validation, layout, form đăng nhập + CSRF cạnh API JWT.',
  lessons: [
    { title: '19.1 — Spring MVC returning views: @Controller, Model and the view resolver|||19.1 — Spring MVC trả view: @Controller, Model và view resolver', slug: 'sb-19-1-mvc-view', type: 'LESSON', isFreePreview: true, description: '@Controller vs @RestController đo thật, Model, ViewResolver, hai lỗi kinh điển, khi nào trang server tốt hơn SPA.', content: L1_EN + L1_VI },
    { title: '19.2 — Thymeleaf basics: expressions, loops, conditions and safe output|||19.2 — Thymeleaf cơ bản: biểu thức, vòng lặp, điều kiện và xuất an toàn', slug: 'sb-19-2-thymeleaf-co-ban', type: 'LESSON', isFreePreview: true, description: 'Năm loại biểu thức, th:each, th:if, @{} có tham số, th:text vs th:utext với một thẻ script thật.', content: L2(true) + L2(false) },
    { title: '19.3 — Forms: th:object, th:field, BindingResult and Post/Redirect/Get|||19.3 — Form: th:object, th:field, BindingResult và Post/Redirect/Get', slug: 'sb-19-3-form-validation', type: 'LESSON', isFreePreview: true, description: 'Form dùng chung record validation với API, lỗi cạnh ô nhập, PRG + flash, và lỗi đặt sai BindingResult đo thật.', content: L3(true) + L3(false) },
    { title: '19.4 — Layouts, fragments and static resources|||19.4 — Layout, fragment và tài nguyên tĩnh', slug: 'sb-19-4-layout-fragment', type: 'LESSON', isFreePreview: true, description: 'th:fragment có tham số, th:replace vs th:insert, sec:authentication, file tĩnh trong static/.', content: L4(true) + L4(false) },
    { title: '19.5 — Form login, sessions and CSRF next to a JWT API|||19.5 — Form đăng nhập, session và CSRF bên cạnh API JWT', slug: 'sb-19-5-form-login', type: 'LESSON', isFreePreview: true, description: 'Hai SecurityFilterChain, formLogin + UserDetailsService, 403 khi thiếu _csrf, và Spring Security 7 từ chối chuỗi thiếu matcher.', content: L5(true) + L5(false) },
    { title: '19.6 — Chapter 19 lab + interview questions|||19.6 — Lab chương 19 + câu hỏi phỏng vấn', slug: 'sb-19-6-lab-19', type: 'LESSON', isFreePreview: true, description: 'Trang quản trị LabFlow bằng Thymeleaf cạnh API JWT, rubric 10 điểm, 7 câu phỏng vấn.', content: L6(true) + L6(false) },
    {
      title: '19.7 — Chapter 19 quiz|||19.7 — Kiểm tra chương 19',
      slug: 'sb-19-7-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tiếng Anh về @Controller, Thymeleaf, form, PRG, CSRF và nhiều chuỗi filter — đều lấy từ thứ đã chạy thật trong chương.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 19 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from something you saw running in this chapter. If you miss one, the explanation names the lesson.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 19 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ thứ bạn đã thấy chạy thật trong chương. Sai câu nào thì lời giải nêu đúng bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ19 },
    },
  ],
};
