/**
 * PRN232 — Building Cross-Platform Back-End Application With .NET.
 * Khung bài theo giáo trình FLM (Syllabus ID 13893): 8 chương + đánh giá.
 * Không có slide gốc → soạn từ syllabus + kiến thức, song ngữ, code ASP.NET Core
 * Web API .NET 8 thật, kèm BÀI TẬP (đề + lời giải). Giữ NGUYÊN slug. Tiên quyết: PRN212/PRN222.
 * ⚠️ Trong code mẫu: KHÔNG dùng backtick hay ${ } (vỡ template literal .mjs) — dùng nối chuỗi.
 */

const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
// title dạng 'EN|||VI' (gộp — tránh bug tách nhầm tham số)
const doc = (slug, title, desc, pairs) => ({
  title, slug, type: 'DOCUMENT', description: desc,
  content: pairs.map(([en, vi]) => bi(en, vi)).join('\n'),
});
const quiz = (slug, title, questions) => ({
  title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.',
  quiz: { timeLimitSeconds: 420, questions },
});

const intro = doc('prn232-0-1-overview', 'Course overview: PRN232 & how you are assessed|||Tổng quan môn: PRN232 & cách đánh giá',
  'Mục tiêu, 5 CLO (Web API architecture; Models/OData/EF/Media Formatters; Security; JS client/AJAX; WCF/gRPC/Microservices), 8 chương, và bảng đánh giá (Assignment 15% · Group 25% · Progress 5% · PE 25% · TE 30%).',
  [[
    `<span class="eyebrow">PRN232 · Lesson 0.1 · Overview</span>
<h2>Building Cross-Platform Back-End Applications With .NET</h2>
<p class="lead">PRN232 is the <strong>back-end / Web API</strong> course of the .NET track. You'll build <strong>RESTful services</strong> with ASP.NET Core Web API — models &amp; EF Core, content negotiation, model binding/validation/routing, <strong>security (JWT)</strong>, JavaScript/AJAX clients, and modern service styles (<strong>gRPC</strong>, an intro to <strong>microservices</strong>). Prerequisites: PRN212, PRN222.</p>
<h3>CLOs</h3>
<ul>
<li><strong>CLO1</strong> — .NET Core &amp; ASP.NET Web API architecture</li>
<li><strong>CLO2</strong> — Models, OData, EF Core, media formatters &amp; content negotiation</li>
<li><strong>CLO3</strong> — security in RESTful web services</li>
<li><strong>CLO4</strong> — JavaScript clients &amp; AJAX to a Web API</li>
<li><strong>CLO5</strong> — WCF/gRPC services &amp; intro to microservices architecture</li>
</ul>`,
    `<span class="eyebrow">PRN232 · Bài 0.1 · Tổng quan</span>
<h2>Xây ứng dụng back-end đa nền tảng với .NET</h2>
<p class="lead">PRN232 là môn <strong>back-end / Web API</strong> của nhánh .NET. Bạn sẽ xây <strong>dịch vụ RESTful</strong> bằng ASP.NET Core Web API — model &amp; EF Core, content negotiation, model binding/validation/routing, <strong>bảo mật (JWT)</strong>, client JavaScript/AJAX, và các kiểu dịch vụ hiện đại (<strong>gRPC</strong>, giới thiệu <strong>microservices</strong>). Tiên quyết: PRN212, PRN222.</p>
<h3>CLO</h3>
<ul>
<li><strong>CLO1</strong> — kiến trúc .NET Core &amp; ASP.NET Web API</li>
<li><strong>CLO2</strong> — Model, OData, EF Core, media formatter &amp; content negotiation</li>
<li><strong>CLO3</strong> — bảo mật trong dịch vụ RESTful</li>
<li><strong>CLO4</strong> — client JavaScript &amp; AJAX tới Web API</li>
<li><strong>CLO5</strong> — dịch vụ WCF/gRPC &amp; giới thiệu kiến trúc microservices</li>
</ul>`,
  ], [
    `<h3>How you're assessed</h3>
<table><thead><tr><th>Component</th><th>Weight</th></tr></thead><tbody>
<tr><td>Assignment</td><td>15%</td></tr>
<tr><td>Group Project</td><td>25%</td></tr>
<tr><td>Progress test</td><td>5%</td></tr>
<tr><td>Practical Exam (85′)</td><td>25%</td></tr>
<tr><td>Theoretical exam (60′, 50 MCQ)</td><td>30%</td></tr>
</tbody></table>
<p><strong>To pass:</strong> average ≥ 5, TE ≥ 4, PE &gt; 0. The Practical Exam asks you to build/extend a Web API — so practise controllers, DTOs, EF and JWT hands-on. Each chapter has a concept lesson, most have an exercise with a worked solution, and all have a quiz.</p>`,
    `<h3>Cách đánh giá</h3>
<table><thead><tr><th>Thành phần</th><th>Tỉ trọng</th></tr></thead><tbody>
<tr><td>Assignment</td><td>15%</td></tr>
<tr><td>Group Project</td><td>25%</td></tr>
<tr><td>Progress test</td><td>5%</td></tr>
<tr><td>Thi thực hành (85′)</td><td>25%</td></tr>
<tr><td>Thi lý thuyết (60′, 50 trắc nghiệm)</td><td>30%</td></tr>
</tbody></table>
<p><strong>Điều kiện qua môn:</strong> TB ≥ 5, TE ≥ 4, PE &gt; 0. Thi thực hành yêu cầu xây/mở rộng một Web API — nên luyện controller, DTO, EF và JWT thật tay. Mỗi chương có bài khái niệm, đa số có bài tập kèm lời giải, và tất cả có quiz.</p>`,
  ]]);

/* Ch1: Intro to ASP.NET Core & REST */
const c1 = doc('prn232-1-1-rest', '1.1 — ASP.NET Core Web API & REST|||1.1 — ASP.NET Core Web API & REST',
  'REST là gì (resource, HTTP verb, status code, stateless), tạo Web API tối giản, controller trả IActionResult/ActionResult<T>, và cấu trúc một API .NET 8.',
  [[
    `<span class="eyebrow">PRN232 · Chapter 1 · Lesson 1.1</span>
<h2>ASP.NET Core Web API &amp; REST</h2>
<p class="lead">A <strong>REST</strong> API exposes <strong>resources</strong> (e.g. products) addressed by URLs and manipulated with <strong>HTTP verbs</strong>: <code>GET</code> (read), <code>POST</code> (create), <code>PUT</code> (replace), <code>PATCH</code> (partial update), <code>DELETE</code>. Each response carries a meaningful <strong>status code</strong> (200 OK, 201 Created, 400 Bad Request, 404 Not Found). REST is <strong>stateless</strong> — every request stands alone.</p>
<pre><code class="language-csharp">[ApiController]
[Route("api/[controller]")]        // → /api/products
public class ProductsController : ControllerBase
{
    private readonly ShopContext _db;
    public ProductsController(ShopContext db) =&gt; _db = db;

    [HttpGet]                                   // GET /api/products
    public async Task&lt;ActionResult&lt;IEnumerable&lt;Product&gt;&gt;&gt; GetAll()
        =&gt; await _db.Products.ToListAsync();

    [HttpGet("{id}")]                           // GET /api/products/5
    public async Task&lt;ActionResult&lt;Product&gt;&gt; Get(int id)
    {
        var p = await _db.Products.FindAsync(id);
        return p is null ? NotFound() : Ok(p);
    }
}
</code></pre>
<p><code>[ApiController]</code> enables automatic model validation and clean 400 responses; <code>ControllerBase</code> (not <code>Controller</code>) is the API base with no View support.</p>`,
    `<span class="eyebrow">PRN232 · Chương 1 · Bài 1.1</span>
<h2>ASP.NET Core Web API &amp; REST</h2>
<p class="lead">Một API <strong>REST</strong> phơi bày <strong>resource</strong> (vd product) định địa chỉ bằng URL và thao tác bằng <strong>HTTP verb</strong>: <code>GET</code> (đọc), <code>POST</code> (tạo), <code>PUT</code> (thay), <code>PATCH</code> (sửa một phần), <code>DELETE</code>. Mỗi phản hồi mang một <strong>status code</strong> có nghĩa (200 OK, 201 Created, 400 Bad Request, 404 Not Found). REST <strong>stateless</strong> — mỗi request độc lập.</p>
<pre><code class="language-csharp">[ApiController]
[Route("api/[controller]")]        // → /api/products
public class ProductsController : ControllerBase
{
    private readonly ShopContext _db;
    public ProductsController(ShopContext db) =&gt; _db = db;

    [HttpGet]                                   // GET /api/products
    public async Task&lt;ActionResult&lt;IEnumerable&lt;Product&gt;&gt;&gt; GetAll()
        =&gt; await _db.Products.ToListAsync();

    [HttpGet("{id}")]                           // GET /api/products/5
    public async Task&lt;ActionResult&lt;Product&gt;&gt; Get(int id)
    {
        var p = await _db.Products.FindAsync(id);
        return p is null ? NotFound() : Ok(p);
    }
}
</code></pre>
<p><code>[ApiController]</code> bật tự động validate model và trả 400 sạch; <code>ControllerBase</code> (không phải <code>Controller</code>) là base cho API, không hỗ trợ View.</p>`,
  ]]);

const c1q = quiz('prn232-quiz-1', 'Quiz 1 — Web API & REST|||Quiz 1 — Web API & REST', [
  { id: 'q1', question: 'HTTP verb nào để TẠO resource mới?', options: ['GET', 'POST', 'DELETE', 'HEAD'], correctIndex: 1, explanation: 'POST tạo mới (thường trả 201 Created); GET đọc, PUT thay, DELETE xoá.' },
  { id: 'q2', question: 'Status code cho "không tìm thấy resource"?', options: ['200', '201', '404', '500'], correctIndex: 2, explanation: '404 Not Found.' },
  { id: 'q3', question: 'REST là stateless nghĩa là?', options: ['Không có DB', 'Mỗi request độc lập, server không nhớ phiên trước', 'Chỉ GET', 'Không bảo mật'], correctIndex: 1, explanation: 'Stateless: mỗi request tự chứa đủ thông tin; server không giữ state client giữa các request.' },
]);

/* Ch2: Models & DTO */
const c2 = doc('prn232-2-1-models', '2.1 — Models, DTOs & EF Core in Web API|||2.1 — Model, DTO & EF Core trong Web API',
  'Entity vs DTO (vì sao không phơi entity trực tiếp), mapping, EF Core trong API, và POST tạo resource trả 201 CreatedAtAction; giới thiệu OData cho truy vấn.',
  [[
    `<span class="eyebrow">PRN232 · Chapter 2 · Lesson 2.1</span>
<h2>Models, DTOs &amp; EF Core</h2>
<p class="lead">Don't expose your EF <strong>entities</strong> directly. Use <strong>DTOs</strong> (Data Transfer Objects) to control exactly what the API sends/accepts — hiding internal fields, preventing over-posting, and decoupling the API contract from the database schema.</p>
<pre><code class="language-csharp">public record ProductDto(int Id, string Name, decimal Price);
public record CreateProductDto(string Name, decimal Price);

[HttpPost]
public async Task&lt;ActionResult&lt;ProductDto&gt;&gt; Create(CreateProductDto dto)
{
    var p = new Product { Name = dto.Name, Price = dto.Price };
    _db.Products.Add(p);
    await _db.SaveChangesAsync();
    var result = new ProductDto(p.Id, p.Name, p.Price);
    return CreatedAtAction(nameof(Get), new { id = p.Id }, result);  // 201 + Location
}
</code></pre>
<p><code>CreatedAtAction</code> returns <strong>201 Created</strong> with a <code>Location</code> header pointing to the new resource — the RESTful way to answer a successful POST. <strong>OData</strong> can add <code>$filter</code>/<code>$orderby</code>/<code>$top</code> query support on top of a controller when you need flexible querying.</p>`,
    `<span class="eyebrow">PRN232 · Chương 2 · Bài 2.1</span>
<h2>Model, DTO &amp; EF Core</h2>
<p class="lead">Đừng phơi <strong>entity</strong> EF trực tiếp. Dùng <strong>DTO</strong> (Data Transfer Object) để kiểm soát chính xác cái API gửi/nhận — giấu trường nội bộ, chặn over-posting, và tách hợp đồng API khỏi schema database.</p>
<pre><code class="language-csharp">public record ProductDto(int Id, string Name, decimal Price);
public record CreateProductDto(string Name, decimal Price);

[HttpPost]
public async Task&lt;ActionResult&lt;ProductDto&gt;&gt; Create(CreateProductDto dto)
{
    var p = new Product { Name = dto.Name, Price = dto.Price };
    _db.Products.Add(p);
    await _db.SaveChangesAsync();
    var result = new ProductDto(p.Id, p.Name, p.Price);
    return CreatedAtAction(nameof(Get), new { id = p.Id }, result);  // 201 + Location
}
</code></pre>
<p><code>CreatedAtAction</code> trả <strong>201 Created</strong> kèm header <code>Location</code> trỏ tới resource mới — cách RESTful để trả lời POST thành công. <strong>OData</strong> có thể thêm hỗ trợ <code>$filter</code>/<code>$orderby</code>/<code>$top</code> trên một controller khi cần truy vấn linh hoạt.</p>`,
  ]]);

const c2e = doc('prn232-2-2-exercise', 'Exercise 1 — a full CRUD API|||Bài tập 1 — API CRUD đầy đủ',
  'Bài tập: viết action PUT (update) và DELETE cho ProductsController, trả đúng status code; kèm lời giải.',
  [[
    `<span class="eyebrow">PRN232 · Chapter 2 · Exercise</span>
<h2>Exercise 1 — complete the CRUD API</h2>
<div class="callout"><span class="badge">Đề</span> Add <code>PUT /api/products/{id}</code> (update) and <code>DELETE /api/products/{id}</code>. PUT returns 204 No Content on success, 404 if missing; DELETE returns 204 or 404.</div>
<h3>Worked solution</h3>
<pre><code class="language-csharp">[HttpPut("{id}")]
public async Task&lt;IActionResult&gt; Update(int id, CreateProductDto dto)
{
    var p = await _db.Products.FindAsync(id);
    if (p is null) return NotFound();
    p.Name = dto.Name; p.Price = dto.Price;
    await _db.SaveChangesAsync();
    return NoContent();                     // 204
}

[HttpDelete("{id}")]
public async Task&lt;IActionResult&gt; Delete(int id)
{
    var p = await _db.Products.FindAsync(id);
    if (p is null) return NotFound();
    _db.Products.Remove(p);
    await _db.SaveChangesAsync();
    return NoContent();                     // 204
}
</code></pre>
<p><strong>Why:</strong> update/delete that succeed have nothing to return, so <strong>204 No Content</strong> is the correct REST status; a missing id is <strong>404</strong>. Returning proper codes is what makes an API predictable to clients.</p>`,
    `<span class="eyebrow">PRN232 · Chương 2 · Bài tập</span>
<h2>Bài tập 1 — hoàn thiện API CRUD</h2>
<div class="callout"><span class="badge">Đề</span> Thêm <code>PUT /api/products/{id}</code> (update) và <code>DELETE /api/products/{id}</code>. PUT trả 204 No Content khi thành công, 404 nếu thiếu; DELETE trả 204 hoặc 404.</div>
<h3>Lời giải</h3>
<pre><code class="language-csharp">[HttpPut("{id}")]
public async Task&lt;IActionResult&gt; Update(int id, CreateProductDto dto)
{
    var p = await _db.Products.FindAsync(id);
    if (p is null) return NotFound();
    p.Name = dto.Name; p.Price = dto.Price;
    await _db.SaveChangesAsync();
    return NoContent();                     // 204
}

[HttpDelete("{id}")]
public async Task&lt;IActionResult&gt; Delete(int id)
{
    var p = await _db.Products.FindAsync(id);
    if (p is null) return NotFound();
    _db.Products.Remove(p);
    await _db.SaveChangesAsync();
    return NoContent();                     // 204
}
</code></pre>
<p><strong>Vì sao:</strong> update/delete thành công không có gì để trả, nên <strong>204 No Content</strong> là status REST đúng; id thiếu là <strong>404</strong>. Trả đúng mã là điều làm API dễ đoán với client.</p>`,
  ]]);

const c2q = quiz('prn232-quiz-2', 'Quiz 2 — Models & DTO|||Quiz 2 — Model & DTO', [
  { id: 'q1', question: 'Vì sao dùng DTO thay vì phơi entity EF?', options: ['Cho nhanh', 'Kiểm soát dữ liệu vào/ra, chặn over-posting, tách khỏi schema', 'Bắt buộc bởi EF', 'Để ít code hơn'], correctIndex: 1, explanation: 'DTO tách hợp đồng API khỏi DB, giấu trường nội bộ, chặn over-posting.' },
  { id: 'q2', question: 'POST tạo resource thành công nên trả?', options: ['200 OK', '201 Created (kèm Location)', '204 No Content', '404'], correctIndex: 1, explanation: 'CreatedAtAction → 201 + header Location tới resource mới.' },
  { id: 'q3', question: 'PUT/DELETE thành công (không có gì để trả) nên dùng?', options: ['200', '201', '204 No Content', '400'], correctIndex: 2, explanation: '204 No Content: thành công, không có body.' },
]);

/* Ch3: Media Formatters & Content Negotiation */
const c3 = doc('prn232-3-1-content-negotiation', '3.1 — Media formatters & content negotiation|||3.1 — Media formatter & content negotiation',
  'Content negotiation qua header Accept, JSON (mặc định) & XML formatter, cấu hình formatter, và Produces/Consumes.',
  [[
    `<span class="eyebrow">PRN232 · Chapter 3 · Lesson 3.1</span>
<h2>Media formatters &amp; content negotiation</h2>
<p class="lead"><strong>Content negotiation</strong> lets one endpoint serve multiple formats. The client sends an <code>Accept</code> header (e.g. <code>application/json</code> or <code>application/xml</code>) and ASP.NET Core picks the matching <strong>output formatter</strong>. JSON is on by default; XML must be added.</p>
<pre><code class="language-csharp">// Program.cs — enable XML alongside JSON
builder.Services.AddControllers()
       .AddXmlSerializerFormatters();

// declare what an action returns/accepts
[HttpGet]
[Produces("application/json", "application/xml")]
public IEnumerable&lt;ProductDto&gt; GetAll() =&gt; /* ... */;
</code></pre>
<p>Request with <code>Accept: application/xml</code> → XML; with <code>application/json</code> → JSON; from the <em>same</em> action. Input formatters do the reverse for request bodies (<code>Consumes</code>). This is how a single Web API serves clients that prefer different formats.</p>`,
    `<span class="eyebrow">PRN232 · Chương 3 · Bài 3.1</span>
<h2>Media formatter &amp; content negotiation</h2>
<p class="lead"><strong>Content negotiation</strong> cho một endpoint phục vụ nhiều định dạng. Client gửi header <code>Accept</code> (vd <code>application/json</code> hoặc <code>application/xml</code>) và ASP.NET Core chọn <strong>output formatter</strong> khớp. JSON bật mặc định; XML phải thêm.</p>
<pre><code class="language-csharp">// Program.cs — bật XML cùng JSON
builder.Services.AddControllers()
       .AddXmlSerializerFormatters();

// khai báo action trả/nhận gì
[HttpGet]
[Produces("application/json", "application/xml")]
public IEnumerable&lt;ProductDto&gt; GetAll() =&gt; /* ... */;
</code></pre>
<p>Request với <code>Accept: application/xml</code> → XML; với <code>application/json</code> → JSON; từ <em>cùng</em> một action. Input formatter làm chiều ngược cho body request (<code>Consumes</code>). Đây là cách một Web API phục vụ client ưa định dạng khác nhau.</p>`,
  ]]);

const c3q = quiz('prn232-quiz-3', 'Quiz 3 — Content negotiation|||Quiz 3 — Content negotiation', [
  { id: 'q1', question: 'Header nào client dùng để chọn định dạng phản hồi?', options: ['Content-Type', 'Accept', 'Authorization', 'Host'], correctIndex: 1, explanation: 'Accept khai báo định dạng client muốn nhận; server chọn output formatter khớp.' },
  { id: 'q2', question: 'Định dạng nào bật MẶC ĐỊNH trong ASP.NET Core Web API?', options: ['XML', 'JSON', 'YAML', 'CSV'], correctIndex: 1, explanation: 'JSON mặc định; XML phải AddXmlSerializerFormatters().' },
]);

/* Ch4: Binding, Validation & Routing */
const c4 = doc('prn232-4-1-binding-routing', '4.1 — Binding, validation & routing|||4.1 — Binding, validation & routing',
  'Nguồn binding ([FromBody]/[FromQuery]/[FromRoute]), data annotations & ModelState, attribute routing & tham số route, versioning ngắn gọn.',
  [[
    `<span class="eyebrow">PRN232 · Chapter 4 · Lesson 4.1</span>
<h2>Binding, validation &amp; routing</h2>
<h3>Where values come from</h3>
<pre><code class="language-csharp">// GET /api/products/search?q=book&amp;max=200000
[HttpGet("search")]
public IActionResult Search([FromQuery] string q, [FromQuery] decimal max) =&gt; /* ... */;

// POST body bound from JSON
[HttpPost]
public IActionResult Create([FromBody] CreateProductDto dto) =&gt; /* ... */;
</code></pre>
<h3>Validation with data annotations</h3>
<pre><code class="language-csharp">public class CreateProductDto
{
    [Required, StringLength(100)]
    public string Name { get; set; } = "";

    [Range(0, 1_000_000_000)]
    public decimal Price { get; set; }
}
// with [ApiController], invalid input auto-returns 400 with the errors
</code></pre>
<p><strong>Attribute routing</strong> (<code>[Route]</code>, <code>[HttpGet("{id}")]</code>) maps URLs to actions precisely; <code>{id:int}</code> adds a route constraint. With <code>[ApiController]</code>, failed validation returns a structured <strong>400</strong> automatically — you rarely check <code>ModelState</code> by hand.</p>`,
    `<span class="eyebrow">PRN232 · Chương 4 · Bài 4.1</span>
<h2>Binding, validation &amp; routing</h2>
<h3>Giá trị đến từ đâu</h3>
<pre><code class="language-csharp">// GET /api/products/search?q=book&amp;max=200000
[HttpGet("search")]
public IActionResult Search([FromQuery] string q, [FromQuery] decimal max) =&gt; /* ... */;

// body POST bind từ JSON
[HttpPost]
public IActionResult Create([FromBody] CreateProductDto dto) =&gt; /* ... */;
</code></pre>
<h3>Validation bằng data annotation</h3>
<pre><code class="language-csharp">public class CreateProductDto
{
    [Required, StringLength(100)]
    public string Name { get; set; } = "";

    [Range(0, 1_000_000_000)]
    public decimal Price { get; set; }
}
// với [ApiController], input sai tự trả 400 kèm lỗi
</code></pre>
<p><strong>Attribute routing</strong> (<code>[Route]</code>, <code>[HttpGet("{id}")]</code>) ánh xạ URL tới action chính xác; <code>{id:int}</code> thêm ràng buộc route. Với <code>[ApiController]</code>, validation fail tự trả <strong>400</strong> có cấu trúc — hiếm khi phải tự kiểm <code>ModelState</code>.</p>`,
  ]]);

const c4q = quiz('prn232-quiz-4', 'Quiz 4 — Binding & routing|||Quiz 4 — Binding & routing', [
  { id: 'q1', question: 'Attribute nào bind body JSON của request?', options: ['[FromQuery]', '[FromBody]', '[FromRoute]', '[FromHeader]'], correctIndex: 1, explanation: '[FromBody] deserialize body (JSON) vào tham số.' },
  { id: 'q2', question: 'Với [ApiController], input không hợp lệ sẽ?', options: ['Ném exception', 'Tự trả 400 kèm lỗi validation', 'Bỏ qua', 'Trả 500'], correctIndex: 1, explanation: '[ApiController] tự trả 400 có cấu trúc khi ModelState invalid.' },
]);

/* Ch5: Security (JWT) */
const c5 = doc('prn232-5-1-security', '5.1 — Security in RESTful services (JWT)|||5.1 — Bảo mật dịch vụ RESTful (JWT)',
  'Authentication vs authorization, JWT (bearer token) — cấu trúc & luồng, [Authorize]/[AllowAnonymous], role/policy; HTTPS & CORS ngắn gọn.',
  [[
    `<span class="eyebrow">PRN232 · Chapter 5 · Lesson 5.1</span>
<h2>Security: JWT authentication &amp; authorization</h2>
<p class="lead"><strong>Authentication</strong> = who are you; <strong>authorization</strong> = what may you do. Stateless REST APIs commonly use <strong>JWT</strong> (JSON Web Token): the client logs in once, gets a signed token, and sends it as <code>Authorization: Bearer &lt;token&gt;</code> on every request.</p>
<pre><code class="language-csharp">// Program.cs — enable JWT bearer auth
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(o =&gt; { o.TokenValidationParameters = /* issuer, audience, key */; });
builder.Services.AddAuthorization();
// app.UseAuthentication(); app.UseAuthorization();

[Authorize]                       // requires a valid token
[HttpGet]
public IActionResult GetSecret() =&gt; Ok("only for logged-in users");

[Authorize(Roles = "Admin")]      // requires the Admin role claim
[HttpDelete("{id}")]
public IActionResult Delete(int id) =&gt; /* ... */;

[AllowAnonymous]                  // opt a specific action back out
[HttpPost("login")]
public IActionResult Login(LoginDto dto) =&gt; /* issue JWT */;
</code></pre>
<p>A JWT has three parts (header.payload.signature); the server verifies the <strong>signature</strong> so it trusts the claims without a database lookup — that's what keeps REST stateless. Always serve over <strong>HTTPS</strong>, and configure <strong>CORS</strong> to control which browser origins may call the API.</p>`,
    `<span class="eyebrow">PRN232 · Chương 5 · Bài 5.1</span>
<h2>Bảo mật: xác thực &amp; phân quyền JWT</h2>
<p class="lead"><strong>Authentication</strong> = bạn là ai; <strong>authorization</strong> = bạn được làm gì. API REST stateless thường dùng <strong>JWT</strong> (JSON Web Token): client đăng nhập một lần, nhận token đã ký, và gửi kèm <code>Authorization: Bearer &lt;token&gt;</code> mỗi request.</p>
<pre><code class="language-csharp">// Program.cs — bật JWT bearer auth
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(o =&gt; { o.TokenValidationParameters = /* issuer, audience, key */; });
builder.Services.AddAuthorization();
// app.UseAuthentication(); app.UseAuthorization();

[Authorize]                       // cần token hợp lệ
[HttpGet]
public IActionResult GetSecret() =&gt; Ok("chỉ cho người đã đăng nhập");

[Authorize(Roles = "Admin")]      // cần claim role Admin
[HttpDelete("{id}")]
public IActionResult Delete(int id) =&gt; /* ... */;

[AllowAnonymous]                  // cho một action riêng thoát ràng buộc
[HttpPost("login")]
public IActionResult Login(LoginDto dto) =&gt; /* phát JWT */;
</code></pre>
<p>Một JWT có ba phần (header.payload.signature); server xác minh <strong>chữ ký</strong> nên tin các claim mà không cần tra database — chính điều giữ REST stateless. Luôn phục vụ qua <strong>HTTPS</strong>, và cấu hình <strong>CORS</strong> để kiểm soát origin trình duyệt nào được gọi API.</p>`,
  ]]);

const c5e = doc('prn232-5-2-exercise', 'Exercise 2 — protect an endpoint|||Bài tập 2 — bảo vệ một endpoint',
  'Bài tập: cho một API có Login trả JWT, hãy bảo vệ POST/DELETE chỉ cho Admin, để GET công khai; kèm lời giải.',
  [[
    `<span class="eyebrow">PRN232 · Chapter 5 · Exercise</span>
<h2>Exercise 2 — lock down the API</h2>
<div class="callout"><span class="badge">Đề</span> Given an API with a working <code>POST /login</code> that returns a JWT, make: <code>GET</code> endpoints public, <code>POST</code>/<code>PUT</code> require any logged-in user, and <code>DELETE</code> require the <em>Admin</em> role.</div>
<h3>Worked solution</h3>
<pre><code class="language-csharp">[ApiController]
[Route("api/[controller]")]
[Authorize]                       // default: everything needs a token
public class ProductsController : ControllerBase
{
    [AllowAnonymous]              // ...except reads
    [HttpGet] public IActionResult GetAll() =&gt; /* ... */;

    [AllowAnonymous]
    [HttpGet("{id}")] public IActionResult Get(int id) =&gt; /* ... */;

    [HttpPost] public IActionResult Create(CreateProductDto d) =&gt; /* logged-in */;
    [HttpPut("{id}")] public IActionResult Update(int id, CreateProductDto d) =&gt; /* logged-in */;

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")] public IActionResult Delete(int id) =&gt; /* admin only */;
}
</code></pre>
<p><strong>Why:</strong> put <code>[Authorize]</code> at the controller for a secure-by-default posture, then open specific reads with <code>[AllowAnonymous]</code> and tighten destructive actions with <code>[Authorize(Roles = ...)]</code>. Defense reads top-down: class attribute is the baseline, action attributes override it.</p>`,
    `<span class="eyebrow">PRN232 · Chương 5 · Bài tập</span>
<h2>Bài tập 2 — khoá API</h2>
<div class="callout"><span class="badge">Đề</span> Cho một API có <code>POST /login</code> trả JWT, hãy làm: các endpoint <code>GET</code> công khai, <code>POST</code>/<code>PUT</code> cần người đã đăng nhập, và <code>DELETE</code> cần role <em>Admin</em>.</div>
<h3>Lời giải</h3>
<pre><code class="language-csharp">[ApiController]
[Route("api/[controller]")]
[Authorize]                       // mặc định: mọi thứ cần token
public class ProductsController : ControllerBase
{
    [AllowAnonymous]              // ...trừ đọc
    [HttpGet] public IActionResult GetAll() =&gt; /* ... */;

    [AllowAnonymous]
    [HttpGet("{id}")] public IActionResult Get(int id) =&gt; /* ... */;

    [HttpPost] public IActionResult Create(CreateProductDto d) =&gt; /* đã đăng nhập */;
    [HttpPut("{id}")] public IActionResult Update(int id, CreateProductDto d) =&gt; /* đã đăng nhập */;

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")] public IActionResult Delete(int id) =&gt; /* chỉ admin */;
}
</code></pre>
<p><strong>Vì sao:</strong> đặt <code>[Authorize]</code> ở controller cho tư thế secure-by-default, rồi mở đọc bằng <code>[AllowAnonymous]</code> và siết hành động phá huỷ bằng <code>[Authorize(Roles = ...)]</code>. Đọc từ trên xuống: attribute class là nền, attribute action ghi đè.</p>`,
  ]]);

const c5q = quiz('prn232-quiz-5', 'Quiz 5 — Security (JWT)|||Quiz 5 — Bảo mật (JWT)', [
  { id: 'q1', question: 'JWT được gửi trong header nào?', options: ['Accept', 'Authorization: Bearer <token>', 'Content-Type', 'Cookie bắt buộc'], correctIndex: 1, explanation: 'Chuẩn là Authorization: Bearer <token>.' },
  { id: 'q2', question: 'Vì sao JWT giữ REST stateless?', options: ['Vì nó ngắn', 'Server xác minh chữ ký & tin claim, không cần tra DB phiên', 'Vì dùng cookie', 'Vì HTTPS'], correctIndex: 1, explanation: 'Chữ ký xác minh được cho phép tin claim mà không lưu state phiên trên server.' },
  { id: 'q3', question: 'Attribute nào cho một action thoát khỏi [Authorize] ở class?', options: ['[HttpGet]', '[AllowAnonymous]', '[FromBody]', '[Produces]'], correctIndex: 1, explanation: '[AllowAnonymous] ghi đè [Authorize] cho action đó.' },
]);

/* Ch6: JS Clients & AJAX */
const c6 = doc('prn232-6-1-ajax', '6.1 — JavaScript clients & AJAX|||6.1 — Client JavaScript & AJAX',
  'Gọi Web API từ trình duyệt bằng fetch (GET/POST JSON), gửi JWT, xử lý lỗi & CORS; async/await phía JS.',
  [[
    `<span class="eyebrow">PRN232 · Chapter 6 · Lesson 6.1</span>
<h2>JavaScript clients &amp; AJAX</h2>
<p class="lead">Browsers call your Web API with <strong>AJAX</strong> — asynchronous requests that update the page without a full reload. The modern API is <code>fetch</code>.</p>
<pre><code class="language-javascript">// GET
const res = await fetch("/api/products");
const products = await res.json();

// POST JSON with a JWT
const res2 = await fetch("/api/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  body: JSON.stringify({ name: "Book", price: 120000 })
});
if (!res2.ok) console.error("HTTP " + res2.status);
</code></pre>
<p>Set <code>Content-Type: application/json</code> and stringify the body; attach the JWT in the <code>Authorization</code> header; check <code>res.ok</code>/<code>res.status</code>. If the page origin differs from the API, the server must enable <strong>CORS</strong> for that origin or the browser blocks the call.</p>`,
    `<span class="eyebrow">PRN232 · Chương 6 · Bài 6.1</span>
<h2>Client JavaScript &amp; AJAX</h2>
<p class="lead">Trình duyệt gọi Web API bằng <strong>AJAX</strong> — request bất đồng bộ cập nhật trang mà không tải lại toàn bộ. API hiện đại là <code>fetch</code>.</p>
<pre><code class="language-javascript">// GET
const res = await fetch("/api/products");
const products = await res.json();

// POST JSON kèm JWT
const res2 = await fetch("/api/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  body: JSON.stringify({ name: "Book", price: 120000 })
});
if (!res2.ok) console.error("HTTP " + res2.status);
</code></pre>
<p>Đặt <code>Content-Type: application/json</code> và stringify body; gắn JWT vào header <code>Authorization</code>; kiểm <code>res.ok</code>/<code>res.status</code>. Nếu origin trang khác origin API, server phải bật <strong>CORS</strong> cho origin đó nếu không trình duyệt chặn.</p>`,
  ]]);

const c6q = quiz('prn232-quiz-6', 'Quiz 6 — JS clients & AJAX|||Quiz 6 — Client JS & AJAX', [
  { id: 'q1', question: 'Khi POST JSON bằng fetch, body phải?', options: ['Là object thô', 'JSON.stringify(...) + header Content-Type: application/json', 'Là FormData', 'Không cần header'], correctIndex: 1, explanation: 'Stringify body và đặt Content-Type application/json.' },
  { id: 'q2', question: 'Trang khác origin gọi API bị chặn trừ khi?', options: ['Dùng GET', 'Server bật CORS cho origin đó', 'Tắt JavaScript', 'Dùng cookie'], correctIndex: 1, explanation: 'CORS phải cho phép origin trình duyệt, nếu không bị chặn.' },
]);

/* Ch7-8: gRPC, WCF, Microservices */
const c7 = doc('prn232-7-1-grpc-micro', '7.1 — gRPC, WCF & microservices intro|||7.1 — gRPC, WCF & giới thiệu microservices',
  'REST vs gRPC (Protobuf, HTTP/2, hiệu năng); WCF (di sản) là gì; và ý tưởng microservices (tách dịch vụ nhỏ, giao tiếp qua HTTP/gRPC, ưu/nhược).',
  [[
    `<span class="eyebrow">PRN232 · Chapter 7 · Lesson 7.1</span>
<h2>gRPC, WCF &amp; microservices</h2>
<h3>gRPC vs REST</h3>
<p><strong>gRPC</strong> is a high-performance RPC framework: you define services and messages in a <code>.proto</code> file (Protocol Buffers), and it generates strongly-typed clients/servers that talk over <strong>HTTP/2</strong> with compact binary messages. Compared to REST/JSON it's faster and strongly-typed, but less human-readable and less browser-friendly — great for <strong>service-to-service</strong> calls.</p>
<pre><code class="language-protobuf">service ProductService {
  rpc GetProduct (ProductRequest) returns (ProductReply);
}
message ProductRequest { int32 id = 1; }
message ProductReply  { int32 id = 1; string name = 2; double price = 3; }
</code></pre>
<h3>WCF &amp; microservices</h3>
<p><strong>WCF</strong> (Windows Communication Foundation) is the legacy .NET Framework way to build SOAP/RPC services — you'll meet it in older systems, but new services use ASP.NET Core Web API or gRPC. <strong>Microservices</strong> split an app into small, independently-deployable services (each with its own data), communicating over HTTP/gRPC. Benefits: independent scaling &amp; deployment; costs: distributed-system complexity (networking, consistency, observability).</p>`,
    `<span class="eyebrow">PRN232 · Chương 7 · Bài 7.1</span>
<h2>gRPC, WCF &amp; microservices</h2>
<h3>gRPC vs REST</h3>
<p><strong>gRPC</strong> là framework RPC hiệu năng cao: bạn định nghĩa service và message trong file <code>.proto</code> (Protocol Buffers), nó sinh client/server strongly-typed giao tiếp qua <strong>HTTP/2</strong> với message nhị phân gọn. So với REST/JSON thì nhanh hơn và chặt kiểu, nhưng khó đọc bằng mắt và ít thân thiện trình duyệt — hợp gọi <strong>dịch vụ-tới-dịch vụ</strong>.</p>
<pre><code class="language-protobuf">service ProductService {
  rpc GetProduct (ProductRequest) returns (ProductReply);
}
message ProductRequest { int32 id = 1; }
message ProductReply  { int32 id = 1; string name = 2; double price = 3; }
</code></pre>
<h3>WCF &amp; microservices</h3>
<p><strong>WCF</strong> (Windows Communication Foundation) là cách cũ của .NET Framework để xây dịch vụ SOAP/RPC — bạn gặp nó ở hệ cũ, còn dịch vụ mới dùng ASP.NET Core Web API hoặc gRPC. <strong>Microservices</strong> tách app thành các dịch vụ nhỏ, triển khai độc lập (mỗi cái có dữ liệu riêng), giao tiếp qua HTTP/gRPC. Lợi: scale &amp; deploy độc lập; giá: phức tạp hệ phân tán (mạng, nhất quán, quan sát).</p>`,
  ]]);

const c7q = quiz('prn232-quiz-7', 'Quiz 7 — gRPC & microservices|||Quiz 7 — gRPC & microservices', [
  { id: 'q1', question: 'gRPC dùng định dạng message & giao thức nào?', options: ['JSON trên HTTP/1.1', 'Protocol Buffers (binary) trên HTTP/2', 'XML trên FTP', 'CSV trên TCP'], correctIndex: 1, explanation: 'gRPC = Protobuf nhị phân trên HTTP/2 → nhanh, chặt kiểu.' },
  { id: 'q2', question: 'Nhược điểm chính của microservices?', options: ['Không scale được', 'Phức tạp hệ phân tán (mạng, nhất quán, observability)', 'Không deploy được', 'Chỉ chạy Windows'], correctIndex: 1, explanation: 'Đổi lấy tính độc lập là độ phức tạp của hệ phân tán.' },
  { id: 'q3', question: 'Dịch vụ .NET mới nên ưu tiên?', options: ['WCF', 'ASP.NET Core Web API hoặc gRPC', 'Chỉ WCF', 'SOAP thuần'], correctIndex: 1, explanation: 'WCF là di sản; dịch vụ mới dùng Web API/gRPC.' },
]);

const taiLieu = doc('prn232-0-0-tai-lieu',
  '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">PRN232 · Lesson 0.0 · Resources</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for everything you need to master PRN232 beyond these lessons: the official FLM syllabus &amp; slides, reference books, free primary documentation, video channels, tools, and a four-step self-study path.</p>
<div class="callout"><span class="badge">Official</span> Log in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn">flm.fpt.edu.vn</a>) with your FPTU account — the full syllabus and every lecture slide live there, and they define exactly what the exam covers.</div>
<h3>📘 Official syllabus &amp; slides</h3>
<ul>
<li><strong>FLM — flm.fpt.edu.vn</strong>: sign in with your FPTU account for the complete syllabus, session plan, CLOs and all lecture slides — the authoritative, in-scope source of truth.</li>
</ul>
<h3>📗 Reference books</h3>
<ul>
<li><em>ASP.NET Core in Action (3rd ed.)</em> — Andrew Lock (Manning): <a href="https://www.manning.com/books/asp-net-core-in-action-third-edition">manning.com/books/asp-net-core-in-action-third-edition</a></li>
<li><em>.NET Microservices: Architecture for Containerized .NET Applications</em> — free official e-book (Microsoft): <a href="https://learn.microsoft.com/dotnet/architecture/microservices/">learn.microsoft.com/dotnet/architecture/microservices</a></li>
</ul>
<h3>🌐 Free primary documentation</h3>
<ul>
<li>ASP.NET Core Web API: <a href="https://learn.microsoft.com/aspnet/core/web-api">learn.microsoft.com/aspnet/core/web-api</a></li>
<li>Entity Framework Core: <a href="https://learn.microsoft.com/ef/core">learn.microsoft.com/ef/core</a></li>
<li>Security &amp; auth: <a href="https://learn.microsoft.com/aspnet/core/security">learn.microsoft.com/aspnet/core/security</a> · gRPC: <a href="https://learn.microsoft.com/aspnet/core/grpc">learn.microsoft.com/aspnet/core/grpc</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li>Microsoft Developer: <a href="https://www.youtube.com/@MicrosoftDeveloper">youtube.com/@MicrosoftDeveloper</a></li>
<li>.NET: <a href="https://www.youtube.com/@dotnet">youtube.com/@dotnet</a></li>
<li>Nick Chapsas: <a href="https://www.youtube.com/@nickchapsas">youtube.com/@nickchapsas</a></li>
<li>freeCodeCamp: <a href="https://www.youtube.com/@freecodecamp">youtube.com/@freecodecamp</a></li>
</ul>
<h3>🛠️ Tools for study &amp; practice</h3>
<ul>
<li>Visual Studio 2022: <a href="https://visualstudio.microsoft.com/">visualstudio.microsoft.com</a></li>
<li>.NET SDK: <a href="https://dotnet.microsoft.com/download">dotnet.microsoft.com/download</a></li>
<li>Postman (test REST endpoints): <a href="https://www.postman.com/">postman.com</a></li>
<li>JetBrains Rider: <a href="https://www.jetbrains.com/rider/">jetbrains.com/rider</a></li>
</ul>
<h3>🎯 A four-step self-study path</h3>
<ol>
<li><strong>Foundations / exam core</strong> — internalise REST, HTTP verbs and status codes, controllers vs. DTOs, and the EF Core CRUD cycle; these carry most of the theory exam.</li>
<li><strong>Practice on a small project</strong> — build one resource end-to-end (GET/POST/PUT/DELETE) with DTOs, validation and proper 201/400/404 responses, tested in Postman.</li>
<li><strong>Go deeper on real-world concerns</strong> — add JWT authentication and role/policy authorization, CORS for a JS/AJAX client, and paging/filtering; then try a gRPC service.</li>
<li><strong>Job-ready</strong> — split into small services, document with Swagger/OpenAPI, and be able to explain content negotiation, security and your API design in an interview.</li>
</ol>`,
    `<span class="eyebrow">PRN232 · Bài 0.0 · Tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom đủ thứ để học PRN232 vượt ngoài các bài trong khoá: giáo trình &amp; slide chính thức trên FLM, sách tham khảo, tài liệu gốc miễn phí, kênh video, công cụ, và lộ trình tự học 4 bước.</p>
<div class="callout"><span class="badge">Chính thức</span> Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn">flm.fpt.edu.vn</a>) bằng tài khoản FPTU — có giáo trình + slide đầy đủ, đúng phạm vi thi.</div>
<h3>📘 Giáo trình &amp; slide chính thức</h3>
<ul>
<li><strong>FLM — flm.fpt.edu.vn</strong>: đăng nhập bằng tài khoản FPTU để lấy giáo trình đầy đủ, lịch buổi, CLO và toàn bộ slide bài giảng — nguồn chuẩn, đúng phạm vi thi.</li>
</ul>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>ASP.NET Core in Action (tái bản 3)</em> — Andrew Lock (Manning): <a href="https://www.manning.com/books/asp-net-core-in-action-third-edition">manning.com/books/asp-net-core-in-action-third-edition</a></li>
<li><em>.NET Microservices: Architecture for Containerized .NET Applications</em> — e-book chính thức miễn phí (Microsoft): <a href="https://learn.microsoft.com/dotnet/architecture/microservices/">learn.microsoft.com/dotnet/architecture/microservices</a></li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li>ASP.NET Core Web API: <a href="https://learn.microsoft.com/aspnet/core/web-api">learn.microsoft.com/aspnet/core/web-api</a></li>
<li>Entity Framework Core: <a href="https://learn.microsoft.com/ef/core">learn.microsoft.com/ef/core</a></li>
<li>Bảo mật &amp; xác thực: <a href="https://learn.microsoft.com/aspnet/core/security">learn.microsoft.com/aspnet/core/security</a> · gRPC: <a href="https://learn.microsoft.com/aspnet/core/grpc">learn.microsoft.com/aspnet/core/grpc</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li>Microsoft Developer: <a href="https://www.youtube.com/@MicrosoftDeveloper">youtube.com/@MicrosoftDeveloper</a></li>
<li>.NET: <a href="https://www.youtube.com/@dotnet">youtube.com/@dotnet</a></li>
<li>Nick Chapsas: <a href="https://www.youtube.com/@nickchapsas">youtube.com/@nickchapsas</a></li>
<li>freeCodeCamp: <a href="https://www.youtube.com/@freecodecamp">youtube.com/@freecodecamp</a></li>
</ul>
<h3>🛠️ Công cụ học &amp; thực hành</h3>
<ul>
<li>Visual Studio 2022: <a href="https://visualstudio.microsoft.com/">visualstudio.microsoft.com</a></li>
<li>.NET SDK: <a href="https://dotnet.microsoft.com/download">dotnet.microsoft.com/download</a></li>
<li>Postman (thử endpoint REST): <a href="https://www.postman.com/">postman.com</a></li>
<li>JetBrains Rider: <a href="https://www.jetbrains.com/rider/">jetbrains.com/rider</a></li>
</ul>
<h3>🎯 Lộ trình tự học 4 bước</h3>
<ol>
<li><strong>Nền tảng / lõi thi</strong> — thuộc REST, HTTP verb và status code, phân biệt controller với DTO, và vòng CRUD của EF Core; phần này gánh phần lớn bài lý thuyết.</li>
<li><strong>Luyện qua project nhỏ</strong> — làm một resource đầu-cuối (GET/POST/PUT/DELETE) với DTO, validation và trả đúng 201/400/404, kiểm bằng Postman.</li>
<li><strong>Đào sâu thực tế</strong> — thêm xác thực JWT và phân quyền role/policy, CORS cho client JS/AJAX, và phân trang/lọc; rồi thử một dịch vụ gRPC.</li>
<li><strong>Sẵn sàng đi làm</strong> — tách thành các dịch vụ nhỏ, mô tả bằng Swagger/OpenAPI, và trình bày được content negotiation, bảo mật cùng thiết kế API khi phỏng vấn.</li>
</ol>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'PRN232',
    slug: 'prn232-building-cross-platform-back-end-application-with-net',
    title: 'Building Cross-Platform Back-End Application With .NET',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PRN232.webp',
    shortDescription: 'Build RESTful back-ends with ASP.NET Core Web API — REST, DTOs & EF Core, content negotiation, JWT security, AJAX clients, gRPC & microservices. Bilingual, with exercises.|||Xây back-end RESTful với ASP.NET Core Web API — REST, DTO & EF Core, content negotiation, bảo mật JWT, client AJAX, gRPC & microservices. Song ngữ, có bài tập.',
    description: 'Môn <strong>PRN232 — Xây ứng dụng back-end đa nền tảng với .NET</strong> (ngành Kỹ thuật phần mềm, kỳ 8). Môn back-end của nhánh .NET: dựng dịch vụ <strong>RESTful</strong> bằng ASP.NET Core Web API — model &amp; DTO, EF Core, content negotiation, binding/validation/routing, <strong>bảo mật JWT</strong>, client JavaScript/AJAX, và gRPC/microservices. Bám giáo trình FLM (8 chương, 5 CLO), song ngữ, code chạy được, mỗi chương có bài tập kèm lời giải.',
    whatYouLearn: 'REST & ASP.NET Core Web API; Model/DTO & EF Core; media formatters & content negotiation; binding, validation, attribute routing; bảo mật JWT ([Authorize]/role/policy); JavaScript client & AJAX (fetch, CORS); gRPC (Protobuf/HTTP2) & giới thiệu microservices.',
    requirements: 'Đã học PRN212, PRN222. Cần .NET 8 SDK + Visual Studio 2022; nên biết SQL cơ bản (DBI202).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mục tiêu, 5 CLO, cách đánh giá, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Web API & REST|||Chapter 1 — Web API & REST', description: 'REST, HTTP verb, controller ControllerBase.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Models, DTO & EF Core|||Chapter 2 — Models, DTO & EF Core', description: 'DTO, CRUD, 201 CreatedAtAction, OData.', lessons: [c2, c2e, c2q] },
    { title: 'Chương 3 — Content negotiation|||Chapter 3 — Content negotiation', description: 'Accept header, JSON/XML formatter.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Binding, validation & routing|||Chapter 4 — Binding, validation & routing', description: 'FromBody/FromQuery, data annotations, attribute routing.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Bảo mật (JWT)|||Chapter 5 — Security (JWT)', description: 'JWT, [Authorize], role/policy, CORS.', lessons: [c5, c5e, c5q] },
    { title: 'Chương 6 — Client JS & AJAX|||Chapter 6 — JS clients & AJAX', description: 'fetch, JWT, CORS.', lessons: [c6, c6q] },
    { title: 'Chương 7 — gRPC & microservices|||Chapter 7 — gRPC & microservices', description: 'gRPC/Protobuf, WCF di sản, microservices.', lessons: [c7, c7q] },
  ],
};
