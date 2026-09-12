/**
 * PRN222 — Advanced Cross-Platform Application Programming With .NET.
 * Dựng khung bài theo giáo trình FLM (Syllabus ID 13892): 8 chương + đánh giá.
 * Không có slide gốc → nội dung soạn từ syllabus (lịch buổi, CLO, tasks) +
 * kiến thức chuyên môn, song ngữ, code C#/ASP.NET Core .NET 8 thật, KÈM BÀI TẬP
 * (đề + lời giải) mỗi chương. Giữ NGUYÊN slug. Tiên quyết: PRN212.
 */

const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const quiz = (slug, en, vi, questions) => ({
  title: `${en}|||${vi}`, slug, type: 'QUIZ',
  description: 'Kiểm tra nhanh kiến thức chương.',
  quiz: { timeLimitSeconds: 420, questions },
});

/* ── Giới thiệu ─────────────────────────────────────────────────── */
const intro = {
  title: 'Course overview: PRN222 & how you are assessed|||Tổng quan môn: PRN222 & cách đánh giá',
  slug: 'prn222-0-1-overview',
  type: 'DOCUMENT',
  description: 'Mục tiêu, 5 CLO (async/parallel & DI, MVC, Razor Pages, Blazor, real-time & worker service), 8 chương, và bảng đánh giá (Assignment 10% · Group 25% · Progress 10% · PE 25% · TE 30%).',
  content: [
    bi(
      `<span class="eyebrow">PRN222 · Lesson 0.1 · Overview</span>
<h2>Advanced Cross-Platform Application Programming With .NET</h2>
<p class="lead">PRN222 takes you from desktop (PRN212) to the <strong>web and services</strong> tier of .NET 8: networking, deep async/parallel programming, dependency injection, then three ways to build web UIs — <strong>ASP.NET Core MVC</strong>, <strong>Razor Pages</strong> and <strong>Blazor</strong> — plus <strong>real-time (SignalR)</strong> and <strong>background Worker Services</strong>. Prerequisite: PRN212.</p>
<h3>What you'll be able to do (CLOs)</h3>
<ul>
<li><strong>CLO1</strong> — asynchronous &amp; parallel programming; dependency injection</li>
<li><strong>CLO2</strong> — Model-View-Controller in ASP.NET Core</li>
<li><strong>CLO3</strong> — Razor Pages in ASP.NET Core</li>
<li><strong>CLO4</strong> — web applications with Blazor</li>
<li><strong>CLO5</strong> — real-time communication and Worker Service</li>
</ul>`,
      `<span class="eyebrow">PRN222 · Bài 0.1 · Tổng quan</span>
<h2>Lập trình ứng dụng đa nền tảng nâng cao với .NET</h2>
<p class="lead">PRN222 đưa bạn từ desktop (PRN212) sang tầng <strong>web và dịch vụ</strong> của .NET 8: networking, lập trình async/parallel sâu, dependency injection, rồi ba cách xây web UI — <strong>ASP.NET Core MVC</strong>, <strong>Razor Pages</strong> và <strong>Blazor</strong> — cộng <strong>real-time (SignalR)</strong> và <strong>Worker Service</strong> chạy nền. Tiên quyết: PRN212.</p>
<h3>Chuẩn đầu ra (CLO)</h3>
<ul>
<li><strong>CLO1</strong> — lập trình bất đồng bộ &amp; song song; dependency injection</li>
<li><strong>CLO2</strong> — Model-View-Controller trong ASP.NET Core</li>
<li><strong>CLO3</strong> — Razor Pages trong ASP.NET Core</li>
<li><strong>CLO4</strong> — ứng dụng web với Blazor</li>
<li><strong>CLO5</strong> — giao tiếp real-time và Worker Service</li>
</ul>`,
    ),
    bi(
      `<h3>How you're assessed</h3>
<table>
<thead><tr><th>Component</th><th>Weight</th></tr></thead>
<tbody>
<tr><td>Assignment (ongoing)</td><td>10%</td></tr>
<tr><td>Group Project</td><td>25%</td></tr>
<tr><td>Progress test</td><td>10%</td></tr>
<tr><td>Practical Exam (85′, code problems)</td><td>25%</td></tr>
<tr><td>Theoretical exam (60′, 50 MCQ)</td><td>30%</td></tr>
</tbody>
</table>
<p><strong>To pass:</strong> average ≥ 5, TE ≥ 4, PE &gt; 0. The Group Project (25%) is the biggest single piece — build a real ASP.NET Core web app across the term. Each chapter below has a <strong>concept lesson</strong>, a <strong>hands-on exercise with a worked solution</strong>, and a <strong>quiz</strong>.</p>`,
      `<h3>Cách đánh giá</h3>
<table>
<thead><tr><th>Thành phần</th><th>Tỉ trọng</th></tr></thead>
<tbody>
<tr><td>Assignment (xuyên suốt)</td><td>10%</td></tr>
<tr><td>Group Project</td><td>25%</td></tr>
<tr><td>Progress test</td><td>10%</td></tr>
<tr><td>Thi thực hành (85′, code)</td><td>25%</td></tr>
<tr><td>Thi lý thuyết (60′, 50 trắc nghiệm)</td><td>30%</td></tr>
</tbody>
</table>
<p><strong>Điều kiện qua môn:</strong> TB ≥ 5, TE ≥ 4, PE &gt; 0. Group Project (25%) là mảng lớn nhất — xây một app web ASP.NET Core thật suốt kỳ. Mỗi chương dưới đây có <strong>bài khái niệm</strong>, một <strong>bài tập có lời giải</strong>, và một <strong>quiz</strong>.</p>`,
    ),
  ].join('\n'),
};

/* Helpers rút gọn cho concept + exercise */
const doc = (slug, titleEn, titleVi, desc, contentPairs) => ({
  title: `${titleEn}|||${titleVi}`, slug, type: 'DOCUMENT', description: desc,
  content: contentPairs.map(([en, vi]) => bi(en, vi)).join('\n'),
});

/* ── Ch1: Networking ────────────────────────────────────────────── */
const c1 = doc('prn222-1-1-networking', '1.1 — Networking programming in .NET', '1.1 — Lập trình mạng trong .NET',
  'TCP/UDP với Socket & TcpClient/TcpListener, HttpClient cho HTTP, và mô hình client–server; gửi/nhận dữ liệu qua NetworkStream.',
  [[
    `<span class="eyebrow">PRN222 · Chapter 1 · Lesson 1.1</span>
<h2>Networking programming</h2>
<p class="lead">.NET exposes networking at several levels: high-level <strong>HttpClient</strong> for HTTP, and lower-level <strong>TcpListener/TcpClient</strong> (and <code>Socket</code>) for custom TCP/UDP protocols. Understanding both helps you build clients, servers and the real-time features later in the course.</p>
<h3>HTTP with HttpClient</h3>
<pre><code class="language-csharp">using var http = new HttpClient();
string json = await http.GetStringAsync("https://api.example.com/products");
var resp = await http.PostAsJsonAsync("https://api.example.com/products",
                                      new { Name = "Book", Price = 120000 });
resp.EnsureSuccessStatusCode();
</code></pre>
<p>Reuse a single <code>HttpClient</code> (or <code>IHttpClientFactory</code>) — creating one per request exhausts sockets.</p>
<h3>A minimal TCP echo server &amp; client</h3>
<pre><code class="language-csharp">// Server
var listener = new TcpListener(IPAddress.Loopback, 9000);
listener.Start();
using var client = await listener.AcceptTcpClientAsync();
using var stream = client.GetStream();
var buf = new byte[1024];
int n = await stream.ReadAsync(buf);
await stream.WriteAsync(buf.AsMemory(0, n));   // echo back
</code></pre>`,
    `<span class="eyebrow">PRN222 · Chương 1 · Bài 1.1</span>
<h2>Lập trình mạng</h2>
<p class="lead">.NET cung cấp mạng ở nhiều mức: cấp cao <strong>HttpClient</strong> cho HTTP, và cấp thấp <strong>TcpListener/TcpClient</strong> (và <code>Socket</code>) cho giao thức TCP/UDP tuỳ biến. Hiểu cả hai giúp bạn xây client, server và các tính năng real-time về sau.</p>
<h3>HTTP với HttpClient</h3>
<pre><code class="language-csharp">using var http = new HttpClient();
string json = await http.GetStringAsync("https://api.example.com/products");
var resp = await http.PostAsJsonAsync("https://api.example.com/products",
                                      new { Name = "Book", Price = 120000 });
resp.EnsureSuccessStatusCode();
</code></pre>
<p>Tái dùng một <code>HttpClient</code> (hoặc <code>IHttpClientFactory</code>) — tạo mới mỗi request làm cạn socket.</p>
<h3>Server &amp; client TCP echo tối giản</h3>
<pre><code class="language-csharp">// Server
var listener = new TcpListener(IPAddress.Loopback, 9000);
listener.Start();
using var client = await listener.AcceptTcpClientAsync();
using var stream = client.GetStream();
var buf = new byte[1024];
int n = await stream.ReadAsync(buf);
await stream.WriteAsync(buf.AsMemory(0, n));   // dội lại
</code></pre>`,
  ]]);

const c1e = doc('prn222-1-2-exercise', 'Exercise 1 — a tiny HTTP client', 'Bài tập 1 — client HTTP nhỏ', 'Bài tập: viết chương trình gọi API công khai và in kết quả, xử lý lỗi mạng; kèm lời giải.',
  [[
    `<span class="eyebrow">PRN222 · Chapter 1 · Exercise</span>
<h2>Exercise 1 — a tiny HTTP client</h2>
<div class="callout"><span class="badge">Đề</span> Write a console app that GETs <code>https://jsonplaceholder.typicode.com/todos/1</code>, deserializes the JSON into a <code>Todo</code> record (<code>userId</code>, <code>id</code>, <code>title</code>, <code>completed</code>), prints the title, and prints a friendly message if the network fails.</div>
<h3>Worked solution</h3>
<pre><code class="language-csharp">using System.Net.Http.Json;

record Todo(int userId, int id, string title, bool completed);

try
{
    using var http = new HttpClient();
    var todo = await http.GetFromJsonAsync&lt;Todo&gt;(
        "https://jsonplaceholder.typicode.com/todos/1");
    Console.WriteLine($"#{todo!.id}: {todo.title} (done={todo.completed})");
}
catch (HttpRequestException ex)
{
    Console.WriteLine($"Network error: {ex.Message}");
}
</code></pre>
<p><strong>Why:</strong> <code>GetFromJsonAsync&lt;T&gt;</code> does the GET + JSON deserialize in one call; wrapping it in <code>try/catch (HttpRequestException)</code> handles DNS/connection failures gracefully.</p>
<div class="callout"><span class="badge">Thử thêm</span> Đổi sang gọi <code>/todos</code> (trả mảng) và in 5 todo đầu bằng LINQ <code>.Take(5)</code>.</div>`,
    `<span class="eyebrow">PRN222 · Chương 1 · Bài tập</span>
<h2>Bài tập 1 — client HTTP nhỏ</h2>
<div class="callout"><span class="badge">Đề</span> Viết app console GET <code>https://jsonplaceholder.typicode.com/todos/1</code>, deserialize JSON vào record <code>Todo</code> (<code>userId</code>, <code>id</code>, <code>title</code>, <code>completed</code>), in title, và in thông báo thân thiện nếu mạng lỗi.</div>
<h3>Lời giải</h3>
<pre><code class="language-csharp">using System.Net.Http.Json;

record Todo(int userId, int id, string title, bool completed);

try
{
    using var http = new HttpClient();
    var todo = await http.GetFromJsonAsync&lt;Todo&gt;(
        "https://jsonplaceholder.typicode.com/todos/1");
    Console.WriteLine($"#{todo!.id}: {todo.title} (done={todo.completed})");
}
catch (HttpRequestException ex)
{
    Console.WriteLine($"Lỗi mạng: {ex.Message}");
}
</code></pre>
<p><strong>Vì sao:</strong> <code>GetFromJsonAsync&lt;T&gt;</code> gộp GET + deserialize JSON trong một lời gọi; bọc <code>try/catch (HttpRequestException)</code> xử lý lỗi DNS/kết nối gọn gàng.</p>
<div class="callout"><span class="badge">Thử thêm</span> Đổi sang gọi <code>/todos</code> (trả mảng) và in 5 todo đầu bằng LINQ <code>.Take(5)</code>.</div>`,
  ]]);

const c1q = quiz('prn222-quiz-1', 'Quiz 1 — Networking', 'Quiz 1 — Mạng', [
  { id: 'q1', question: 'Vì sao nên tái dùng một HttpClient?', options: ['Cho đẹp code', 'Tạo mới mỗi request làm cạn socket', 'Bắt buộc bởi C#', 'Để chạy nhanh gấp đôi'], correctIndex: 1, explanation: 'HttpClient tạo liên tục gây cạn kiệt socket (socket exhaustion); tái dùng hoặc IHttpClientFactory.' },
  { id: 'q2', question: 'Lớp nào lắng nghe kết nối TCP đến ở phía server?', options: ['TcpClient', 'TcpListener', 'HttpClient', 'UdpClient'], correctIndex: 1, explanation: 'TcpListener.Start()/AcceptTcpClientAsync() nhận kết nối server.' },
  { id: 'q3', question: 'GetFromJsonAsync<T> làm gì?', options: ['Chỉ GET', 'GET + deserialize JSON thành T', 'POST dữ liệu', 'Mở socket TCP'], correctIndex: 1, explanation: 'Gộp tải HTTP và deserialize JSON sang kiểu T.' },
]);

/* ── Ch2: Async & Parallel ──────────────────────────────────────── */
const c2 = doc('prn222-2-1-async-parallel', '2.1 — Asynchronous & parallel programming', '2.1 — Lập trình bất đồng bộ & song song',
  'async/await sâu, Task vs Thread, Task.WhenAll/WhenAny, CancellationToken; Parallel.For/ForEach & PLINQ cho CPU-bound; phân biệt I/O-bound vs CPU-bound.',
  [[
    `<span class="eyebrow">PRN222 · Chapter 2 · Lesson 2.1</span>
<h2>Asynchronous &amp; parallel programming</h2>
<p class="lead">Two different goals: <strong>async</strong> keeps a thread free during <em>I/O waits</em> (network, disk); <strong>parallelism</strong> uses <em>many cores</em> for <em>CPU-bound</em> work. Choose by the bottleneck.</p>
<h3>Async for I/O-bound work</h3>
<pre><code class="language-csharp">var t1 = http.GetStringAsync(url1);
var t2 = http.GetStringAsync(url2);
string[] both = await Task.WhenAll(t1, t2);   // run concurrently

// cancellation
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
await LongOpAsync(cts.Token);   // throws OperationCanceledException on timeout
</code></pre>
<h3>Parallelism for CPU-bound work</h3>
<pre><code class="language-csharp">Parallel.For(0, items.Length, i =&gt; Process(items[i]));  // splits across cores

// PLINQ
var results = numbers.AsParallel()
                     .Where(IsPrime)
                     .ToArray();
</code></pre>
<p><strong>Rule of thumb:</strong> <em>I/O-bound → async/await</em>; <em>CPU-bound → Parallel/PLINQ</em>. Don't wrap CPU work in <code>Task.Run</code> on a web server carelessly — it steals thread-pool threads.</p>`,
    `<span class="eyebrow">PRN222 · Chương 2 · Bài 2.1</span>
<h2>Lập trình bất đồng bộ &amp; song song</h2>
<p class="lead">Hai mục tiêu khác nhau: <strong>async</strong> giữ thread rảnh khi <em>chờ I/O</em> (mạng, đĩa); <strong>song song</strong> dùng <em>nhiều nhân</em> cho việc <em>CPU-bound</em>. Chọn theo nút thắt.</p>
<h3>Async cho việc I/O-bound</h3>
<pre><code class="language-csharp">var t1 = http.GetStringAsync(url1);
var t2 = http.GetStringAsync(url2);
string[] both = await Task.WhenAll(t1, t2);   // chạy đồng thời

// huỷ
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
await LongOpAsync(cts.Token);   // ném OperationCanceledException khi hết giờ
</code></pre>
<h3>Song song cho việc CPU-bound</h3>
<pre><code class="language-csharp">Parallel.For(0, items.Length, i =&gt; Process(items[i]));  // chia qua các nhân

// PLINQ
var results = numbers.AsParallel()
                     .Where(IsPrime)
                     .ToArray();
</code></pre>
<p><strong>Nguyên tắc:</strong> <em>I/O-bound → async/await</em>; <em>CPU-bound → Parallel/PLINQ</em>. Đừng bọc việc CPU trong <code>Task.Run</code> tuỳ tiện trên web server — nó ăn thread của thread-pool.</p>`,
  ]]);

const c2e = doc('prn222-2-2-exercise', 'Exercise 2 — parallel prime count', 'Bài tập 2 — đếm số nguyên tố song song', 'Bài tập: đếm số nguyên tố trong [2, N] tuần tự rồi song song, so thời gian; kèm lời giải.',
  [[
    `<span class="eyebrow">PRN222 · Chapter 2 · Exercise</span>
<h2>Exercise 2 — count primes, sequential vs parallel</h2>
<div class="callout"><span class="badge">Đề</span> Count primes in [2, 500000] first with LINQ, then with PLINQ. Time both with <code>Stopwatch</code> and print the speed-up.</div>
<h3>Worked solution</h3>
<pre><code class="language-csharp">static bool IsPrime(int n)
{
    if (n &lt; 2) return false;
    for (int i = 2; (long)i * i &lt;= n; i++)
        if (n % i == 0) return false;
    return true;
}

var range = Enumerable.Range(2, 499_999);
var sw = System.Diagnostics.Stopwatch.StartNew();
int seq = range.Count(IsPrime);
sw.Stop(); var tSeq = sw.ElapsedMilliseconds;

sw.Restart();
int par = range.AsParallel().Count(IsPrime);
sw.Stop(); var tPar = sw.ElapsedMilliseconds;

Console.WriteLine($"seq={seq} in {tSeq}ms · par={par} in {tPar}ms · x{(double)tSeq/tPar:F1}");
</code></pre>
<p><strong>Why:</strong> primality testing is CPU-bound and each number is independent — a perfect fit for <code>AsParallel()</code>, which splits the range across cores. On a quad-core you'll see roughly a 3–4× speed-up.</p>`,
    `<span class="eyebrow">PRN222 · Chương 2 · Bài tập</span>
<h2>Bài tập 2 — đếm số nguyên tố, tuần tự vs song song</h2>
<div class="callout"><span class="badge">Đề</span> Đếm số nguyên tố trong [2, 500000] bằng LINQ rồi PLINQ. Đo cả hai bằng <code>Stopwatch</code> và in mức tăng tốc.</div>
<h3>Lời giải</h3>
<pre><code class="language-csharp">static bool IsPrime(int n)
{
    if (n &lt; 2) return false;
    for (int i = 2; (long)i * i &lt;= n; i++)
        if (n % i == 0) return false;
    return true;
}

var range = Enumerable.Range(2, 499_999);
var sw = System.Diagnostics.Stopwatch.StartNew();
int seq = range.Count(IsPrime);
sw.Stop(); var tSeq = sw.ElapsedMilliseconds;

sw.Restart();
int par = range.AsParallel().Count(IsPrime);
sw.Stop(); var tPar = sw.ElapsedMilliseconds;

Console.WriteLine($"seq={seq} in {tSeq}ms · par={par} in {tPar}ms · x{(double)tSeq/tPar:F1}");
</code></pre>
<p><strong>Vì sao:</strong> kiểm nguyên tố là CPU-bound và mỗi số độc lập — quá hợp cho <code>AsParallel()</code>, chia dải qua các nhân. Trên quad-core bạn thấy tăng tốc ~3–4×.</p>`,
  ]]);

const c2q = quiz('prn222-quiz-2', 'Quiz 2 — Async & Parallel', 'Quiz 2 — Async & Song song', [
  { id: 'q1', question: 'Việc CPU-bound nên dùng gì?', options: ['async/await', 'Parallel/PLINQ', 'HttpClient', 'try/catch'], correctIndex: 1, explanation: 'CPU-bound → Parallel.For/PLINQ để dùng nhiều nhân; async cho I/O-bound.' },
  { id: 'q2', question: 'CancellationTokenSource(TimeSpan) dùng để?', options: ['Đo thời gian', 'Tự huỷ tác vụ sau khoảng thời gian', 'Chạy song song', 'Ghi log'], correctIndex: 1, explanation: 'Nó phát cancel sau timeout → task ném OperationCanceledException.' },
  { id: 'q3', question: 'Task.WhenAll(t1, t2) nghĩa là?', options: ['Chạy t1 rồi t2', 'Chạy đồng thời, đợi cả hai', 'Chỉ chạy t1', 'Huỷ t2'], correctIndex: 1, explanation: 'Hai task chạy đồng thời; await hoàn thành khi cả hai xong.' },
]);

/* ── Ch3: Dependency Injection ──────────────────────────────────── */
const c3 = doc('prn222-3-1-di', '3.1 — Dependency Injection in .NET', '3.1 — Dependency Injection trong .NET',
  'DI là gì & vì sao (loose coupling, testable); IServiceCollection, đăng ký Transient/Scoped/Singleton, constructor injection; DI dựng sẵn trong ASP.NET Core.',
  [[
    `<span class="eyebrow">PRN222 · Chapter 3 · Lesson 3.1</span>
<h2>Dependency Injection (DI)</h2>
<p class="lead">DI is the practical form of the "D" in SOLID: a class receives its dependencies (via constructor) instead of creating them. .NET has a built-in DI container that ASP.NET Core uses everywhere.</p>
<h3>Register &amp; inject</h3>
<pre><code class="language-csharp">public interface IGreeter { string Greet(string name); }
public class Greeter : IGreeter { public string Greet(string n) =&gt; $"Hi {n}"; }

// Program.cs
builder.Services.AddScoped&lt;IGreeter, Greeter&gt;();

// constructor injection — the container supplies IGreeter
public class HomeController : Controller
{
    private readonly IGreeter _greeter;
    public HomeController(IGreeter greeter) =&gt; _greeter = greeter;
}
</code></pre>
<h3>Lifetimes</h3>
<ul>
<li><strong>Transient</strong> — a new instance every time it's requested.</li>
<li><strong>Scoped</strong> — one instance per request (the norm for EF <code>DbContext</code>).</li>
<li><strong>Singleton</strong> — one instance for the whole app.</li>
</ul>
<div class="pitfall"><b>Đừng inject một Scoped vào một Singleton</b> — captured dependency sống sai vòng đời (bug khó thấy). EF DbContext là Scoped; đừng để một Singleton giữ nó.</div>`,
    `<span class="eyebrow">PRN222 · Chương 3 · Bài 3.1</span>
<h2>Dependency Injection (DI)</h2>
<p class="lead">DI là dạng thực hành của chữ "D" trong SOLID: một class nhận phụ thuộc (qua constructor) thay vì tự tạo. .NET có container DI dựng sẵn mà ASP.NET Core dùng khắp nơi.</p>
<h3>Đăng ký &amp; tiêm</h3>
<pre><code class="language-csharp">public interface IGreeter { string Greet(string name); }
public class Greeter : IGreeter { public string Greet(string n) =&gt; $"Hi {n}"; }

// Program.cs
builder.Services.AddScoped&lt;IGreeter, Greeter&gt;();

// constructor injection — container cấp IGreeter
public class HomeController : Controller
{
    private readonly IGreeter _greeter;
    public HomeController(IGreeter greeter) =&gt; _greeter = greeter;
}
</code></pre>
<h3>Vòng đời</h3>
<ul>
<li><strong>Transient</strong> — thể hiện mới mỗi lần yêu cầu.</li>
<li><strong>Scoped</strong> — một thể hiện mỗi request (chuẩn cho EF <code>DbContext</code>).</li>
<li><strong>Singleton</strong> — một thể hiện cho cả app.</li>
</ul>
<div class="pitfall"><b>Đừng inject Scoped vào Singleton</b> — phụ thuộc bị "giữ" sống sai vòng đời (bug khó thấy). EF DbContext là Scoped; đừng để Singleton giữ nó.</div>`,
  ]]);

const c3e = doc('prn222-3-2-exercise', 'Exercise 3 — refactor to DI', 'Bài tập 3 — refactor sang DI', 'Bài tập: gỡ new cứng thành DI với interface + đăng ký Scoped; kèm lời giải.',
  [[
    `<span class="eyebrow">PRN222 · Chapter 3 · Exercise</span>
<h2>Exercise 3 — refactor tight coupling to DI</h2>
<div class="callout"><span class="badge">Đề</span> A controller creates <code>new EmailSender()</code> directly. Introduce an <code>IEmailSender</code> interface, register it as Scoped, and inject it — so it can be swapped/mocked in tests.</div>
<h3>Worked solution</h3>
<pre><code class="language-csharp">public interface IEmailSender { Task SendAsync(string to, string body); }

public class SmtpEmailSender : IEmailSender
{
    public Task SendAsync(string to, string body) { /* ... */ return Task.CompletedTask; }
}

// Program.cs
builder.Services.AddScoped&lt;IEmailSender, SmtpEmailSender&gt;();

public class OrderController : Controller
{
    private readonly IEmailSender _email;
    public OrderController(IEmailSender email) =&gt; _email = email;   // injected

    public async Task&lt;IActionResult&gt; Confirm(string to)
    {
        await _email.SendAsync(to, "Order confirmed");
        return Ok();
    }
}
</code></pre>
<p><strong>Why:</strong> depending on the <code>IEmailSender</code> abstraction (not the concrete SMTP class) lets a unit test inject a fake sender and verify the call — the essence of Dependency Inversion.</p>`,
    `<span class="eyebrow">PRN222 · Chương 3 · Bài tập</span>
<h2>Bài tập 3 — refactor coupling chặt sang DI</h2>
<div class="callout"><span class="badge">Đề</span> Một controller tạo <code>new EmailSender()</code> trực tiếp. Đưa vào interface <code>IEmailSender</code>, đăng ký Scoped, và tiêm nó — để thay/mock được trong test.</div>
<h3>Lời giải</h3>
<pre><code class="language-csharp">public interface IEmailSender { Task SendAsync(string to, string body); }

public class SmtpEmailSender : IEmailSender
{
    public Task SendAsync(string to, string body) { /* ... */ return Task.CompletedTask; }
}

// Program.cs
builder.Services.AddScoped&lt;IEmailSender, SmtpEmailSender&gt;();

public class OrderController : Controller
{
    private readonly IEmailSender _email;
    public OrderController(IEmailSender email) =&gt; _email = email;   // tiêm

    public async Task&lt;IActionResult&gt; Confirm(string to)
    {
        await _email.SendAsync(to, "Order confirmed");
        return Ok();
    }
}
</code></pre>
<p><strong>Vì sao:</strong> phụ thuộc vào abstraction <code>IEmailSender</code> (không phải lớp SMTP cụ thể) cho phép unit test tiêm một sender giả và kiểm lời gọi — chính là Dependency Inversion.</p>`,
  ]]);

const c3q = quiz('prn222-quiz-3', 'Quiz 3 — Dependency Injection', 'Quiz 3 — Dependency Injection', [
  { id: 'q1', question: 'EF DbContext nên đăng ký vòng đời nào?', options: ['Singleton', 'Scoped (một per request)', 'Transient', 'Không đăng ký'], correctIndex: 1, explanation: 'DbContext là Scoped — một thể hiện mỗi request.' },
  { id: 'q2', question: 'Lợi ích chính của DI?', options: ['Code chạy nhanh hơn', 'Loose coupling & dễ test (mock)', 'Ít file hơn', 'Bắt buộc bởi .NET'], correctIndex: 1, explanation: 'DI cho phụ thuộc vào abstraction → dễ thay/mock, dễ test.' },
  { id: 'q3', question: 'Lỗi phổ biến về vòng đời?', options: ['Inject Transient vào Transient', 'Inject Scoped vào Singleton', 'Đăng ký interface', 'Dùng constructor injection'], correctIndex: 1, explanation: 'Scoped bị Singleton "giữ" → sống sai vòng đời (captive dependency).' },
]);

/* ── Ch4: ASP.NET Core MVC ──────────────────────────────────────── */
const c4 = doc('prn222-4-1-mvc', '4.1 — ASP.NET Core MVC', '4.1 — ASP.NET Core MVC',
  'Kiến trúc MVC, routing, Controller & action, Model binding & validation, Razor View, và luồng request; dựng CRUD với EF Core.',
  [[
    `<span class="eyebrow">PRN222 · Chapter 4 · Lesson 4.1</span>
<h2>Building web apps with ASP.NET Core MVC</h2>
<p class="lead">MVC splits a web app into <strong>Model</strong> (data + logic), <strong>View</strong> (Razor HTML), and <strong>Controller</strong> (handles requests, returns results). A request is <strong>routed</strong> to a controller action, which returns a View or data.</p>
<h3>A controller &amp; action</h3>
<pre><code class="language-csharp">public class ProductsController : Controller
{
    private readonly ShopContext _db;
    public ProductsController(ShopContext db) =&gt; _db = db;   // DI

    // GET /Products
    public async Task&lt;IActionResult&gt; Index()
        =&gt; View(await _db.Products.ToListAsync());

    // POST /Products/Create
    [HttpPost]
    public async Task&lt;IActionResult&gt; Create(Product p)
    {
        if (!ModelState.IsValid) return View(p);   // validation
        _db.Products.Add(p);
        await _db.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }
}
</code></pre>
<h3>A Razor view (Views/Products/Index.cshtml)</h3>
<pre><code class="language-html">@model IEnumerable&lt;Product&gt;
&lt;table&gt;
@foreach (var p in Model)
{
  &lt;tr&gt;&lt;td&gt;@p.Name&lt;/td&gt;&lt;td&gt;@p.Price&lt;/td&gt;&lt;/tr&gt;
}
&lt;/table&gt;
</code></pre>
<p><strong>Model binding</strong> maps form/query/route values onto action parameters; data-annotation attributes (<code>[Required]</code>, <code>[Range]</code>) drive <code>ModelState</code> validation.</p>`,
    `<span class="eyebrow">PRN222 · Chương 4 · Bài 4.1</span>
<h2>Xây web app với ASP.NET Core MVC</h2>
<p class="lead">MVC tách web app thành <strong>Model</strong> (dữ liệu + logic), <strong>View</strong> (Razor HTML), và <strong>Controller</strong> (xử lý request, trả kết quả). Một request được <strong>route</strong> tới một action của controller, action trả về View hoặc dữ liệu.</p>
<h3>Controller &amp; action</h3>
<pre><code class="language-csharp">public class ProductsController : Controller
{
    private readonly ShopContext _db;
    public ProductsController(ShopContext db) =&gt; _db = db;   // DI

    // GET /Products
    public async Task&lt;IActionResult&gt; Index()
        =&gt; View(await _db.Products.ToListAsync());

    // POST /Products/Create
    [HttpPost]
    public async Task&lt;IActionResult&gt; Create(Product p)
    {
        if (!ModelState.IsValid) return View(p);   // validation
        _db.Products.Add(p);
        await _db.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }
}
</code></pre>
<h3>Một Razor view (Views/Products/Index.cshtml)</h3>
<pre><code class="language-html">@model IEnumerable&lt;Product&gt;
&lt;table&gt;
@foreach (var p in Model)
{
  &lt;tr&gt;&lt;td&gt;@p.Name&lt;/td&gt;&lt;td&gt;@p.Price&lt;/td&gt;&lt;/tr&gt;
}
&lt;/table&gt;
</code></pre>
<p><strong>Model binding</strong> ánh xạ giá trị form/query/route vào tham số action; các attribute data-annotation (<code>[Required]</code>, <code>[Range]</code>) điều khiển validation qua <code>ModelState</code>.</p>`,
  ]]);

const c4e = doc('prn222-4-2-exercise', 'Exercise 4 — a CRUD controller', 'Bài tập 4 — controller CRUD', 'Bài tập: viết action Edit (GET+POST) cho Product với validation; kèm lời giải.',
  [[
    `<span class="eyebrow">PRN222 · Chapter 4 · Exercise</span>
<h2>Exercise 4 — the Edit action (GET + POST)</h2>
<div class="callout"><span class="badge">Đề</span> Add <code>Edit(int id)</code> (GET, shows the form) and <code>Edit(Product p)</code> (POST, saves) to <code>ProductsController</code>. Return 404 when the id doesn't exist; re-show the form when validation fails.</div>
<h3>Worked solution</h3>
<pre><code class="language-csharp">// GET /Products/Edit/5
public async Task&lt;IActionResult&gt; Edit(int id)
{
    var p = await _db.Products.FindAsync(id);
    return p is null ? NotFound() : View(p);
}

// POST /Products/Edit
[HttpPost]
public async Task&lt;IActionResult&gt; Edit(Product p)
{
    if (!ModelState.IsValid) return View(p);
    _db.Products.Update(p);
    await _db.SaveChangesAsync();
    return RedirectToAction(nameof(Index));
}
</code></pre>
<p><strong>Why:</strong> the GET loads the entity (or <code>NotFound()</code>), the POST validates then <code>Update</code> + <code>SaveChangesAsync</code>. <code>RedirectToAction</code> after a successful POST implements the <em>Post/Redirect/Get</em> pattern, preventing duplicate submits on refresh.</p>`,
    `<span class="eyebrow">PRN222 · Chương 4 · Bài tập</span>
<h2>Bài tập 4 — action Edit (GET + POST)</h2>
<div class="callout"><span class="badge">Đề</span> Thêm <code>Edit(int id)</code> (GET, hiện form) và <code>Edit(Product p)</code> (POST, lưu) vào <code>ProductsController</code>. Trả 404 khi id không tồn tại; hiện lại form khi validation fail.</div>
<h3>Lời giải</h3>
<pre><code class="language-csharp">// GET /Products/Edit/5
public async Task&lt;IActionResult&gt; Edit(int id)
{
    var p = await _db.Products.FindAsync(id);
    return p is null ? NotFound() : View(p);
}

// POST /Products/Edit
[HttpPost]
public async Task&lt;IActionResult&gt; Edit(Product p)
{
    if (!ModelState.IsValid) return View(p);
    _db.Products.Update(p);
    await _db.SaveChangesAsync();
    return RedirectToAction(nameof(Index));
}
</code></pre>
<p><strong>Vì sao:</strong> GET nạp entity (hoặc <code>NotFound()</code>), POST validate rồi <code>Update</code> + <code>SaveChangesAsync</code>. <code>RedirectToAction</code> sau POST thành công là mẫu <em>Post/Redirect/Get</em>, tránh gửi trùng khi refresh.</p>`,
  ]]);

const c4q = quiz('prn222-quiz-4', 'Quiz 4 — ASP.NET Core MVC', 'Quiz 4 — ASP.NET Core MVC', [
  { id: 'q1', question: 'Trong MVC, phần nào xử lý request và trả kết quả?', options: ['Model', 'View', 'Controller', 'Router'], correctIndex: 2, explanation: 'Controller nhận request, gọi model, trả View/dữ liệu.' },
  { id: 'q2', question: 'ModelState.IsValid dùng để?', options: ['Kiểm kết nối DB', 'Kiểm dữ liệu bind có hợp lệ (theo data annotations)', 'Đo hiệu năng', 'Route request'], correctIndex: 1, explanation: 'ModelState phản ánh kết quả validation của model binding.' },
  { id: 'q3', question: 'Vì sao RedirectToAction sau POST thành công?', options: ['Cho nhanh', 'Mẫu Post/Redirect/Get — tránh gửi trùng khi refresh', 'Bắt buộc', 'Để log'], correctIndex: 1, explanation: 'PRG ngăn resubmit form khi người dùng F5.' },
]);

/* ── Ch5: Razor Pages ───────────────────────────────────────────── */
const c5 = doc('prn222-5-1-razor-pages', '5.1 — ASP.NET Core Razor Pages', '5.1 — ASP.NET Core Razor Pages',
  'Razor Pages (page-based) vs MVC; PageModel với OnGet/OnPost, binding & handler; khi nào chọn Razor Pages.',
  [[
    `<span class="eyebrow">PRN222 · Chapter 5 · Lesson 5.1</span>
<h2>Razor Pages</h2>
<p class="lead">Razor Pages is a simpler, <strong>page-focused</strong> model: each page pairs a <code>.cshtml</code> view with a <code>PageModel</code> class that has <code>OnGet</code>/<code>OnPost</code> handlers. Great for form-driven, page-per-feature apps.</p>
<pre><code class="language-csharp">// Pages/Products/Create.cshtml.cs
public class CreateModel : PageModel
{
    private readonly ShopContext _db;
    public CreateModel(ShopContext db) =&gt; _db = db;

    [BindProperty] public Product Product { get; set; } = new();

    public void OnGet() { }

    public async Task&lt;IActionResult&gt; OnPostAsync()
    {
        if (!ModelState.IsValid) return Page();
        _db.Products.Add(Product);
        await _db.SaveChangesAsync();
        return RedirectToPage("Index");
    }
}
</code></pre>
<pre><code class="language-html">@page
@model CreateModel
&lt;form method="post"&gt;
  &lt;input asp-for="Product.Name" /&gt;
  &lt;button type="submit"&gt;Save&lt;/button&gt;
&lt;/form&gt;
</code></pre>
<p><strong>Razor Pages vs MVC:</strong> Razor Pages keeps the handler next to its page (less ceremony) — ideal for CRUD/forms; MVC's controllers suit APIs and apps with many shared actions.</p>`,
    `<span class="eyebrow">PRN222 · Chương 5 · Bài 5.1</span>
<h2>Razor Pages</h2>
<p class="lead">Razor Pages là mô hình đơn giản, <strong>hướng trang</strong>: mỗi trang ghép một <code>.cshtml</code> với một class <code>PageModel</code> có handler <code>OnGet</code>/<code>OnPost</code>. Rất hợp app hướng form, mỗi feature một trang.</p>
<pre><code class="language-csharp">// Pages/Products/Create.cshtml.cs
public class CreateModel : PageModel
{
    private readonly ShopContext _db;
    public CreateModel(ShopContext db) =&gt; _db = db;

    [BindProperty] public Product Product { get; set; } = new();

    public void OnGet() { }

    public async Task&lt;IActionResult&gt; OnPostAsync()
    {
        if (!ModelState.IsValid) return Page();
        _db.Products.Add(Product);
        await _db.SaveChangesAsync();
        return RedirectToPage("Index");
    }
}
</code></pre>
<pre><code class="language-html">@page
@model CreateModel
&lt;form method="post"&gt;
  &lt;input asp-for="Product.Name" /&gt;
  &lt;button type="submit"&gt;Save&lt;/button&gt;
&lt;/form&gt;
</code></pre>
<p><strong>Razor Pages vs MVC:</strong> Razor Pages giữ handler ngay cạnh trang (ít nghi thức) — lý tưởng cho CRUD/form; controller MVC hợp API và app có nhiều action dùng chung.</p>`,
  ]]);

const c5q = quiz('prn222-quiz-5', 'Quiz 5 — Razor Pages', 'Quiz 5 — Razor Pages', [
  { id: 'q1', question: 'Handler xử lý POST trong PageModel tên gì?', options: ['OnGet', 'OnPost/OnPostAsync', 'OnSubmit', 'Post'], correctIndex: 1, explanation: 'OnPost/OnPostAsync xử lý form POST; OnGet xử lý GET.' },
  { id: 'q2', question: '[BindProperty] để làm gì?', options: ['Đăng ký DI', 'Bind dữ liệu form vào property của PageModel', 'Route', 'Validate DB'], correctIndex: 1, explanation: '[BindProperty] cho model binding gán giá trị form vào property.' },
  { id: 'q3', question: 'Razor Pages hợp nhất với?', options: ['API thuần', 'App hướng form/trang (CRUD)', 'Game', 'Machine learning'], correctIndex: 1, explanation: 'Razor Pages tối ưu cho app hướng trang/form.' },
]);

/* ── Ch6: Blazor ────────────────────────────────────────────────── */
const c6 = doc('prn222-6-1-blazor', '6.1 — Building web apps with Blazor', '6.1 — Xây web app với Blazor',
  'Blazor là gì (C# chạy trên trình duyệt qua WebAssembly / hoặc Server), component .razor, data binding & event, tham số component; Blazor Server vs WASM.',
  [[
    `<span class="eyebrow">PRN222 · Chapter 6 · Lesson 6.1</span>
<h2>Blazor — C# in the browser</h2>
<p class="lead">Blazor lets you build interactive web UIs in <strong>C# instead of JavaScript</strong>. A <strong>component</strong> (<code>.razor</code>) mixes HTML with C# and reacts to events. Two hosting models: <strong>Blazor Server</strong> (UI events over a SignalR connection) and <strong>Blazor WebAssembly</strong> (C# runs in the browser via WASM).</p>
<pre><code class="language-html">@* Counter.razor *@
&lt;h3&gt;Count: @count&lt;/h3&gt;
&lt;button @onclick="Increment"&gt;+1&lt;/button&gt;

@code {
    private int count = 0;
    private void Increment() =&gt; count++;   // re-renders automatically
}
</code></pre>
<p>Bind an input with <code>@bind</code>; pass data into a child component via <code>[Parameter]</code> properties. Blazor re-renders the component when its state changes — like a C# version of the reactive UI ideas from React.</p>
<div class="callout"><span class="badge">★ Chọn model</span> <b>Server</b>: tải nhẹ, cần kết nối liên tục (độ trễ ảnh hưởng UX). <b>WASM</b>: chạy offline được, tải app .NET runtime lần đầu nặng hơn. Chọn theo yêu cầu mạng &amp; offline.</div>`,
    `<span class="eyebrow">PRN222 · Chương 6 · Bài 6.1</span>
<h2>Blazor — C# trên trình duyệt</h2>
<p class="lead">Blazor cho bạn xây UI web tương tác bằng <strong>C# thay vì JavaScript</strong>. Một <strong>component</strong> (<code>.razor</code>) trộn HTML với C# và phản ứng sự kiện. Hai mô hình host: <strong>Blazor Server</strong> (sự kiện UI qua kết nối SignalR) và <strong>Blazor WebAssembly</strong> (C# chạy trong trình duyệt qua WASM).</p>
<pre><code class="language-html">@* Counter.razor *@
&lt;h3&gt;Count: @count&lt;/h3&gt;
&lt;button @onclick="Increment"&gt;+1&lt;/button&gt;

@code {
    private int count = 0;
    private void Increment() =&gt; count++;   // tự re-render
}
</code></pre>
<p>Bind input bằng <code>@bind</code>; truyền dữ liệu vào component con qua property <code>[Parameter]</code>. Blazor re-render component khi state đổi — như phiên bản C# của tư duy UI reactive kiểu React.</p>
<div class="callout"><span class="badge">★ Chọn model</span> <b>Server</b>: tải nhẹ, cần kết nối liên tục (độ trễ ảnh hưởng UX). <b>WASM</b>: chạy offline được, tải .NET runtime lần đầu nặng hơn. Chọn theo yêu cầu mạng &amp; offline.</div>`,
  ]]);

const c6q = quiz('prn222-quiz-6', 'Quiz 6 — Blazor', 'Quiz 6 — Blazor', [
  { id: 'q1', question: 'Blazor cho phép viết UI web bằng?', options: ['Chỉ JavaScript', 'C#', 'Python', 'Ruby'], correctIndex: 1, explanation: 'Blazor dùng C# (và Razor) thay cho JavaScript.' },
  { id: 'q2', question: 'Blazor WebAssembly chạy C# ở đâu?', options: ['Trên server', 'Trong trình duyệt qua WASM', 'Trên database', 'Không chạy'], correctIndex: 1, explanation: 'WASM cho C# chạy client-side trong trình duyệt.' },
  { id: 'q3', question: '@onclick="Increment" làm gì?', options: ['Bind giá trị', 'Gắn handler C# cho sự kiện click', 'Route', 'Inject DI'], correctIndex: 1, explanation: 'Gắn phương thức C# xử lý sự kiện click; state đổi → re-render.' },
]);

/* ── Ch7: Real-Time (SignalR) ───────────────────────────────────── */
const c7 = doc('prn222-7-1-signalr', '7.1 — Real-time communication with SignalR', '7.1 — Giao tiếp real-time với SignalR',
  'Vì sao real-time (chat, thông báo, dashboard live); Hub, gửi từ server→client (Clients.All), gọi từ client→server; WebSocket bên dưới.',
  [[
    `<span class="eyebrow">PRN222 · Chapter 7 · Lesson 7.1</span>
<h2>Real-time communication with SignalR</h2>
<p class="lead">Normal HTTP is request/response — the server can't push. <strong>SignalR</strong> gives you a persistent connection (WebSockets under the hood) so the server can push messages to clients instantly: chat, live dashboards, notifications, multiplayer.</p>
<pre><code class="language-csharp">// ChatHub.cs — the server hub
public class ChatHub : Hub
{
    public async Task Send(string user, string message)
        =&gt; await Clients.All.SendAsync("received", user, message);
}

// Program.cs
builder.Services.AddSignalR();
app.MapHub&lt;ChatHub&gt;("/chat");
</code></pre>
<pre><code class="language-javascript">// browser client
const conn = new signalR.HubConnectionBuilder().withUrl("/chat").build();
conn.on("received", (user, msg) =&gt; append(user + ": " + msg));
await conn.start();
await conn.invoke("Send", "An", "hello");
</code></pre>
<p><code>Clients.All</code> broadcasts to everyone; <code>Clients.Caller</code>, <code>Clients.Group(name)</code> and <code>Clients.User(id)</code> target subsets. SignalR negotiates the best transport (WebSockets → Server-Sent Events → long polling).</p>`,
    `<span class="eyebrow">PRN222 · Chương 7 · Bài 7.1</span>
<h2>Giao tiếp real-time với SignalR</h2>
<p class="lead">HTTP thường là request/response — server không đẩy được. <strong>SignalR</strong> cho một kết nối bền (WebSocket bên dưới) để server đẩy tin tới client tức thì: chat, dashboard live, thông báo, multiplayer.</p>
<pre><code class="language-csharp">// ChatHub.cs — hub phía server
public class ChatHub : Hub
{
    public async Task Send(string user, string message)
        =&gt; await Clients.All.SendAsync("received", user, message);
}

// Program.cs
builder.Services.AddSignalR();
app.MapHub&lt;ChatHub&gt;("/chat");
</code></pre>
<pre><code class="language-javascript">// client trình duyệt
const conn = new signalR.HubConnectionBuilder().withUrl("/chat").build();
conn.on("received", (user, msg) =&gt; append(user + ": " + msg));
await conn.start();
await conn.invoke("Send", "An", "hello");
</code></pre>
<p><code>Clients.All</code> phát cho mọi người; <code>Clients.Caller</code>, <code>Clients.Group(name)</code> và <code>Clients.User(id)</code> nhắm nhóm con. SignalR tự thương lượng transport tốt nhất (WebSocket → Server-Sent Events → long polling).</p>`,
  ]]);

const c7q = quiz('prn222-quiz-7', 'Quiz 7 — SignalR', 'Quiz 7 — SignalR', [
  { id: 'q1', question: 'SignalR giải quyết hạn chế nào của HTTP thường?', options: ['Chậm', 'Server không tự đẩy tin cho client', 'Không bảo mật', 'Không nén'], correctIndex: 1, explanation: 'HTTP là request/response; SignalR cho server push qua kết nối bền.' },
  { id: 'q2', question: 'Clients.All.SendAsync(...) làm gì?', options: ['Gửi cho một client', 'Phát tin cho MỌI client đang kết nối', 'Lưu DB', 'Đóng kết nối'], correctIndex: 1, explanation: 'Clients.All broadcast tới tất cả client.' },
  { id: 'q3', question: 'Transport ưu tiên của SignalR là?', options: ['Long polling', 'WebSockets', 'FTP', 'SMTP'], correctIndex: 1, explanation: 'SignalR ưu tiên WebSockets, lùi dần khi không có.' },
]);

/* ── Ch8: Worker Service ────────────────────────────────────────── */
const c8 = doc('prn222-8-1-worker', '8.1 — Background tasks with Worker Service', '8.1 — Tác vụ nền với Worker Service',
  'BackgroundService/IHostedService cho công việc chạy nền định kỳ (gửi mail, dọn dữ liệu, poll); ExecuteAsync với vòng lặp + delay + CancellationToken.',
  [[
    `<span class="eyebrow">PRN222 · Chapter 8 · Lesson 8.1</span>
<h2>Background tasks with Worker Service</h2>
<p class="lead">Some work must run <strong>outside a request</strong> — sending queued emails, cleaning old data, polling an API. .NET's <strong>Worker Service</strong> (a <code>BackgroundService</code>) runs a long-lived loop hosted by the same generic host.</p>
<pre><code class="language-csharp">public class CleanupWorker : BackgroundService
{
    private readonly ILogger&lt;CleanupWorker&gt; _log;
    public CleanupWorker(ILogger&lt;CleanupWorker&gt; log) =&gt; _log = log;

    protected override async Task ExecuteAsync(CancellationToken stopToken)
    {
        while (!stopToken.IsCancellationRequested)
        {
            _log.LogInformation("Cleaning up at {time}", DateTimeOffset.Now);
            // ... do periodic work ...
            await Task.Delay(TimeSpan.FromMinutes(10), stopToken);
        }
    }
}

// Program.cs
builder.Services.AddHostedService&lt;CleanupWorker&gt;();
</code></pre>
<p><code>ExecuteAsync</code> loops until the host signals shutdown via the <code>CancellationToken</code>; <code>Task.Delay(..., stopToken)</code> both paces the loop and exits promptly on shutdown. Inject a <strong>scoped</strong> service by creating a scope inside the loop (a BackgroundService is a Singleton).</p>`,
    `<span class="eyebrow">PRN222 · Chương 8 · Bài 8.1</span>
<h2>Tác vụ nền với Worker Service</h2>
<p class="lead">Có việc phải chạy <strong>ngoài một request</strong> — gửi mail trong hàng đợi, dọn dữ liệu cũ, poll API. <strong>Worker Service</strong> của .NET (một <code>BackgroundService</code>) chạy một vòng lặp sống lâu do generic host quản.</p>
<pre><code class="language-csharp">public class CleanupWorker : BackgroundService
{
    private readonly ILogger&lt;CleanupWorker&gt; _log;
    public CleanupWorker(ILogger&lt;CleanupWorker&gt; log) =&gt; _log = log;

    protected override async Task ExecuteAsync(CancellationToken stopToken)
    {
        while (!stopToken.IsCancellationRequested)
        {
            _log.LogInformation("Dọn dẹp lúc {time}", DateTimeOffset.Now);
            // ... làm việc định kỳ ...
            await Task.Delay(TimeSpan.FromMinutes(10), stopToken);
        }
    }
}

// Program.cs
builder.Services.AddHostedService&lt;CleanupWorker&gt;();
</code></pre>
<p><code>ExecuteAsync</code> lặp tới khi host báo tắt qua <code>CancellationToken</code>; <code>Task.Delay(..., stopToken)</code> vừa giãn nhịp vừa thoát ngay khi tắt. Muốn inject service <strong>scoped</strong> thì tạo một scope bên trong vòng lặp (BackgroundService là Singleton).</p>`,
  ]]);

const c8e = doc('prn222-8-2-exercise', 'Exercise 5 — a heartbeat worker', 'Bài tập 5 — worker nhịp tim', 'Bài tập: viết BackgroundService in "alive" mỗi 5 giây, dừng sạch khi app tắt; kèm lời giải.',
  [[
    `<span class="eyebrow">PRN222 · Chapter 8 · Exercise</span>
<h2>Exercise 5 — a heartbeat worker</h2>
<div class="callout"><span class="badge">Đề</span> Write a <code>BackgroundService</code> that logs "alive #N" every 5 seconds (N counting up) and stops cleanly when the app shuts down (Ctrl+C).</div>
<h3>Worked solution</h3>
<pre><code class="language-csharp">public class Heartbeat : BackgroundService
{
    private readonly ILogger&lt;Heartbeat&gt; _log;
    public Heartbeat(ILogger&lt;Heartbeat&gt; log) =&gt; _log = log;

    protected override async Task ExecuteAsync(CancellationToken stop)
    {
        int n = 0;
        try
        {
            while (!stop.IsCancellationRequested)
            {
                _log.LogInformation("alive #{n}", ++n);
                await Task.Delay(TimeSpan.FromSeconds(5), stop);
            }
        }
        catch (OperationCanceledException) { /* normal shutdown */ }
        _log.LogInformation("stopped after {n} beats", n);
    }
}
// builder.Services.AddHostedService&lt;Heartbeat&gt;();
</code></pre>
<p><strong>Why:</strong> passing <code>stop</code> into <code>Task.Delay</code> makes shutdown immediate (it throws <code>OperationCanceledException</code>, which we swallow as a normal stop) instead of waiting out the full 5 seconds.</p>`,
    `<span class="eyebrow">PRN222 · Chương 8 · Bài tập</span>
<h2>Bài tập 5 — worker nhịp tim</h2>
<div class="callout"><span class="badge">Đề</span> Viết một <code>BackgroundService</code> ghi log "alive #N" mỗi 5 giây (N tăng dần) và dừng sạch khi app tắt (Ctrl+C).</div>
<h3>Lời giải</h3>
<pre><code class="language-csharp">public class Heartbeat : BackgroundService
{
    private readonly ILogger&lt;Heartbeat&gt; _log;
    public Heartbeat(ILogger&lt;Heartbeat&gt; log) =&gt; _log = log;

    protected override async Task ExecuteAsync(CancellationToken stop)
    {
        int n = 0;
        try
        {
            while (!stop.IsCancellationRequested)
            {
                _log.LogInformation("alive #{n}", ++n);
                await Task.Delay(TimeSpan.FromSeconds(5), stop);
            }
        }
        catch (OperationCanceledException) { /* tắt bình thường */ }
        _log.LogInformation("dừng sau {n} nhịp", n);
    }
}
// builder.Services.AddHostedService&lt;Heartbeat&gt;();
</code></pre>
<p><strong>Vì sao:</strong> truyền <code>stop</code> vào <code>Task.Delay</code> làm việc tắt tức thì (ném <code>OperationCanceledException</code> mà ta nuốt như một lần dừng bình thường) thay vì phải đợi hết 5 giây.</p>`,
  ]]);

const c8q = quiz('prn222-quiz-8', 'Quiz 8 — Worker Service', 'Quiz 8 — Worker Service', [
  { id: 'q1', question: 'Lớp nền để viết tác vụ chạy nền là?', options: ['Controller', 'BackgroundService', 'PageModel', 'DbContext'], correctIndex: 1, explanation: 'Kế thừa BackgroundService và override ExecuteAsync.' },
  { id: 'q2', question: 'Vì sao truyền CancellationToken vào Task.Delay?', options: ['Cho đẹp', 'Để vòng lặp thoát ngay khi app tắt', 'Bắt buộc', 'Để đo giờ'], correctIndex: 1, explanation: 'Token cho Delay huỷ ngay khi shutdown, không phải đợi hết.' },
  { id: 'q3', question: 'BackgroundService có vòng đời DI nào?', options: ['Transient', 'Scoped', 'Singleton (tạo scope thủ công nếu cần Scoped)', 'Không đăng ký'], correctIndex: 2, explanation: 'Là Singleton; muốn dùng service Scoped thì tự tạo scope trong vòng lặp.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'PRN222',
    slug: 'prn222-advanced-cross-platform-application-programming-with-',
    title: 'Advanced Cross-Platform Application Programming With .NET',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PRN222.webp',
    shortDescription: 'The web & services tier of .NET 8 — networking, async/parallel, DI, ASP.NET Core MVC, Razor Pages, Blazor, SignalR & Worker Services. Bilingual, with exercises.|||Tầng web & dịch vụ của .NET 8 — networking, async/parallel, DI, ASP.NET Core MVC, Razor Pages, Blazor, SignalR & Worker Service. Song ngữ, có bài tập.',
    description: 'Môn <strong>PRN222 — Lập trình ứng dụng đa nền tảng nâng cao với .NET</strong> (ngành Kỹ thuật phần mềm, kỳ 7). Nối tiếp PRN212, đưa bạn sang tầng web & dịch vụ của .NET 8: networking, lập trình async/parallel sâu, dependency injection, và ba cách xây web (ASP.NET Core MVC, Razor Pages, Blazor), cộng real-time (SignalR) và Worker Service. Nội dung bám giáo trình FLM (8 chương, 5 CLO), song ngữ, code chạy được, <strong>mỗi chương có bài tập kèm lời giải</strong>.',
    whatYouLearn: 'Networking (HttpClient, TCP); async/await & parallel (Task, PLINQ, cancellation); Dependency Injection (vòng đời Transient/Scoped/Singleton); ASP.NET Core MVC (routing, model binding, validation, CRUD với EF); Razor Pages; Blazor (Server & WASM, component); SignalR real-time; Worker Service (BackgroundService).',
    requirements: 'Đã học PRN212 (C#/.NET desktop). Cần .NET 8 SDK + Visual Studio 2022 (hoặc VS Code + C# Dev Kit).',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mục tiêu, 5 CLO, cách đánh giá, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Lập trình mạng|||Chapter 1 — Networking', description: 'HttpClient, TCP client/server.', lessons: [c1, c1e, c1q] },
    { title: 'Chương 2 — Async & Parallel|||Chapter 2 — Async & Parallel', description: 'async/await, Task, PLINQ, cancellation.', lessons: [c2, c2e, c2q] },
    { title: 'Chương 3 — Dependency Injection|||Chapter 3 — Dependency Injection', description: 'IServiceCollection, vòng đời, constructor injection.', lessons: [c3, c3e, c3q] },
    { title: 'Chương 4 — ASP.NET Core MVC|||Chapter 4 — ASP.NET Core MVC', description: 'Routing, controller/action, model binding, CRUD.', lessons: [c4, c4e, c4q] },
    { title: 'Chương 5 — Razor Pages|||Chapter 5 — Razor Pages', description: 'PageModel, OnGet/OnPost, binding.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Blazor|||Chapter 6 — Blazor', description: 'Component, binding, Server vs WASM.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Real-time (SignalR)|||Chapter 7 — Real-time (SignalR)', description: 'Hub, push server→client, WebSocket.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Worker Service|||Chapter 8 — Worker Service', description: 'BackgroundService, ExecuteAsync, cancellation.', lessons: [c8, c8e, c8q] },
  ],
};
