/**
 * PRN212 — Basic Cross-Platform Application Programming With .NET.
 * Dựng khung bài theo giáo trình FLM (Syllabus ID 13891): 11 chương + đánh giá.
 * KHÔNG có slide gốc của trường cho môn này → nội dung soạn từ syllabus (lịch
 * buổi, CLO, tasks) + kiến thức chuyên môn, song ngữ, có code C#/.NET thật.
 * Nguồn: FLM SyllabusDetails?sylID=13891. Giữ NGUYÊN slug để không mất tiến độ.
 *
 * Đây là môn MẪU cho đợt dựng 134 môn mới ngành SE trước (không slide).
 */

/* Song ngữ: hai khối .ml-en / .ml-vi để UI đổi ngôn ngữ toggle được. */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;

/* ── Giới thiệu môn ─────────────────────────────────────────────── */
const intro = {
  title: 'Course overview: PRN212 & how you are assessed|||Tổng quan môn: PRN212 & cách đánh giá',
  slug: 'prn212-0-1-overview',
  type: 'DOCUMENT',
  description: 'Mục tiêu môn, 6 CLO, cấu trúc 11 chương, và bảng đánh giá (Assignment 15% · Group Project 20% · Progress test 10% · Practical Exam 25% · Theoretical exam 30%) — cùng điều kiện qua môn.',
  content: [
    bi(
      `<span class="eyebrow">PRN212 · Lesson 0.1 · Overview</span>
<h2>Basic Cross-Platform Application Programming with .NET</h2>
<p class="lead">PRN212 teaches you to build cross-platform desktop applications in <strong>C#</strong> on the modern <strong>.NET (Core) platform</strong> — from language fundamentals through OOP, LINQ, design patterns, WPF user interfaces, Entity Framework Core data access, files, and concurrency. Prerequisites: <strong>PRO192</strong> (OOP in Java) and <strong>DBI202</strong> (databases).</p>
<h3>What you'll be able to do (CLOs)</h3>
<ul>
<li><strong>CLO1</strong> — describe the .NET Core platform and modern C# features</li>
<li><strong>CLO2</strong> — apply OOP, Generics, Delegates &amp; Events, LINQ and Design Patterns in C#</li>
<li><strong>CLO3</strong> — build Windows Presentation Foundation (WPF) applications</li>
<li><strong>CLO4</strong> — access databases with Entity Framework Core (ORM)</li>
<li><strong>CLO5</strong> — use concurrency programming and Stream I/O</li>
<li><strong>CLO6</strong> — apply Generative AI tools to support .NET development</li>
</ul>`,
      `<span class="eyebrow">PRN212 · Bài 0.1 · Tổng quan</span>
<h2>Lập trình ứng dụng đa nền tảng cơ bản với .NET</h2>
<p class="lead">PRN212 dạy bạn xây ứng dụng desktop đa nền tảng bằng <strong>C#</strong> trên nền <strong>.NET (Core) hiện đại</strong> — từ nền tảng ngôn ngữ qua OOP, LINQ, design pattern, giao diện WPF, truy cập dữ liệu Entity Framework Core, file, và lập trình đồng thời. Tiên quyết: <strong>PRO192</strong> (OOP với Java) và <strong>DBI202</strong> (cơ sở dữ liệu).</p>
<h3>Chuẩn đầu ra (CLO)</h3>
<ul>
<li><strong>CLO1</strong> — mô tả nền tảng .NET Core và các tính năng C# hiện đại</li>
<li><strong>CLO2</strong> — vận dụng OOP, Generics, Delegate &amp; Event, LINQ và Design Pattern trong C#</li>
<li><strong>CLO3</strong> — xây ứng dụng Windows Presentation Foundation (WPF)</li>
<li><strong>CLO4</strong> — truy cập cơ sở dữ liệu bằng Entity Framework Core (ORM)</li>
<li><strong>CLO5</strong> — dùng lập trình đồng thời và Stream I/O</li>
<li><strong>CLO6</strong> — dùng công cụ Generative AI hỗ trợ phát triển .NET</li>
</ul>`,
    ),
    bi(
      `<h3>How you're assessed</h3>
<table>
<thead><tr><th>Component</th><th>Weight</th><th>CLOs</th></tr></thead>
<tbody>
<tr><td>Assignment (ongoing, 12 slots)</td><td>15%</td><td>CLO2–CLO5</td></tr>
<tr><td>Group Project</td><td>20%</td><td>CLO2–CLO6</td></tr>
<tr><td>Progress test (30′, 20 MCQ)</td><td>10%</td><td>CLO1–CLO5</td></tr>
<tr><td><strong>Practical Exam (PE, 85′)</strong></td><td>25%</td><td>CLO1–CLO5</td></tr>
<tr><td><strong>Theoretical Exam (TE, 60′, 50 MCQ)</strong></td><td>30%</td><td>CLO1–CLO5</td></tr>
</tbody>
</table>
<p><strong>To pass:</strong> average mark ≥ 5, <strong>TE ≥ 4</strong>, and <strong>PE &gt; 0</strong>. The final exam is split into a hands-on Practical Exam (you code a small .NET app) and a Theoretical multiple-choice exam — both matter, so practise coding <em>and</em> review concepts.</p>
<div class="callout"><span class="badge">★ Mẹo</span> The 20%-weighted Group Project runs across ~20 sessions — pick your team and topic early (session 1) and build incrementally each chapter, rather than rushing at the end.</div>`,
      `<h3>Cách đánh giá</h3>
<table>
<thead><tr><th>Thành phần</th><th>Tỉ trọng</th><th>CLO</th></tr></thead>
<tbody>
<tr><td>Assignment (xuyên suốt, 12 slot)</td><td>15%</td><td>CLO2–CLO5</td></tr>
<tr><td>Group Project</td><td>20%</td><td>CLO2–CLO6</td></tr>
<tr><td>Progress test (30′, 20 trắc nghiệm)</td><td>10%</td><td>CLO1–CLO5</td></tr>
<tr><td><strong>Thi thực hành (PE, 85′)</strong></td><td>25%</td><td>CLO1–CLO5</td></tr>
<tr><td><strong>Thi lý thuyết (TE, 60′, 50 trắc nghiệm)</strong></td><td>30%</td><td>CLO1–CLO5</td></tr>
</tbody>
</table>
<p><strong>Điều kiện qua môn:</strong> điểm trung bình ≥ 5, <strong>TE ≥ 4</strong>, và <strong>PE &gt; 0</strong>. Thi cuối tách thành Thi thực hành (code một app .NET nhỏ) và Thi lý thuyết trắc nghiệm — cả hai đều tính, nên vừa luyện code vừa ôn khái niệm.</p>
<div class="callout"><span class="badge">★ Mẹo</span> Group Project 20% chạy suốt ~20 buổi — chọn nhóm và đề tài sớm (buổi 1) và xây tăng dần mỗi chương, đừng dồn cuối kỳ.</div>`,
    ),
    bi(
      `<h3>The 11 chapters</h3>
<ol>
<li>Introduction to the .NET Platform &amp; Visual Studio</li>
<li>C# Programming (types, flow, exceptions, functions)</li>
<li>Object-Oriented Programming with C#</li>
<li>Collections &amp; Generics</li>
<li>Design Patterns in .NET</li>
<li>Delegates, Events &amp; LINQ</li>
<li>Building WPF Applications</li>
<li>Databases with Entity Framework Core</li>
<li>Files &amp; System.IO</li>
<li>XML &amp; JSON</li>
<li>Concurrency Programming</li>
</ol>
<p>Each chapter below has focused lessons with runnable C# examples and a short quiz. Because PRN212's exam targets <strong>.NET 8 / C# 12</strong>, all code here uses modern syntax (top-level statements, records, nullable reference types where relevant).</p>`,
      `<h3>11 chương</h3>
<ol>
<li>Giới thiệu nền tảng .NET &amp; Visual Studio</li>
<li>Lập trình C# (kiểu, luồng, ngoại lệ, hàm)</li>
<li>Lập trình hướng đối tượng với C#</li>
<li>Collections &amp; Generics</li>
<li>Design Pattern trong .NET</li>
<li>Delegate, Event &amp; LINQ</li>
<li>Xây ứng dụng WPF</li>
<li>Cơ sở dữ liệu với Entity Framework Core</li>
<li>File &amp; System.IO</li>
<li>XML &amp; JSON</li>
<li>Lập trình đồng thời</li>
</ol>
<p>Mỗi chương dưới đây có các bài tập trung kèm ví dụ C# chạy được và một quiz ngắn. Vì đề PRN212 nhắm <strong>.NET 8 / C# 12</strong>, mọi code ở đây dùng cú pháp hiện đại (top-level statement, record, nullable reference type khi cần).</p>`,
    ),
  ].join('\n'),
};

/* Helper dựng quiz nhanh */
const quiz = (slug, titleEn, titleVi, questions) => ({
  title: `${titleEn}|||${titleVi}`,
  slug,
  type: 'QUIZ',
  description: 'Kiểm tra nhanh kiến thức chương.',
  quiz: { timeLimitSeconds: 420, questions },
});

/* ── Ch1: .NET Platform & Visual Studio ─────────────────────────── */
const c1 = {
  title: '1.1 — The .NET platform, CLR & Visual Studio|||1.1 — Nền tảng .NET, CLR & Visual Studio',
  slug: 'prn212-1-1-dotnet-platform',
  type: 'DOCUMENT',
  description: '.NET Core/.NET 5+ vs .NET Framework, CLR & IL, cấu trúc một chương trình .NET 8 (top-level statements), tạo project bằng Visual Studio và CLI (dotnet).',
  content: [
    bi(
      `<span class="eyebrow">PRN212 · Chapter 1 · Lesson 1.1</span>
<h2>The .NET platform, the CLR &amp; Visual Studio</h2>
<p class="lead">".NET" is a <strong>developer platform</strong>: a runtime (the CLR), a huge base class library, and languages (C#, F#, VB). Modern <strong>.NET</strong> (5, 6, 7, <strong>8</strong>…) is the cross-platform successor to the Windows-only <strong>.NET Framework</strong> — the same code runs on Windows, Linux and macOS.</p>
<h3>.NET Framework vs modern .NET</h3>
<ul>
<li><strong>.NET Framework (1.0–4.8)</strong> — Windows-only, in maintenance; still used by legacy WinForms/ASP.NET apps.</li>
<li><strong>.NET (Core → 5/6/7/8)</strong> — cross-platform, open-source, high-performance, unified. PRN212 targets <strong>.NET 8</strong> (LTS).</li>
</ul>
<h3>How C# runs: CLR &amp; IL</h3>
<p>Your C# is compiled by <strong>Roslyn</strong> into <strong>Intermediate Language (IL)</strong> stored in an assembly (a <code>.dll</code> or <code>.exe</code>). At runtime the <strong>CLR (Common Language Runtime)</strong> uses a <strong>JIT</strong> compiler to turn IL into native machine code, and provides garbage collection, type safety and exception handling. Because the CLR exists on each OS, the same IL runs everywhere — that's what "cross-platform" means.</p>`,
      `<span class="eyebrow">PRN212 · Chương 1 · Bài 1.1</span>
<h2>Nền tảng .NET, CLR &amp; Visual Studio</h2>
<p class="lead">".NET" là một <strong>nền tảng lập trình</strong>: một runtime (CLR), một thư viện lớp nền khổng lồ, và các ngôn ngữ (C#, F#, VB). <strong>.NET</strong> hiện đại (5, 6, 7, <strong>8</strong>…) là bản kế thừa đa nền tảng của <strong>.NET Framework</strong> (chỉ Windows) — cùng một code chạy trên Windows, Linux và macOS.</p>
<h3>.NET Framework vs .NET hiện đại</h3>
<ul>
<li><strong>.NET Framework (1.0–4.8)</strong> — chỉ Windows, đang bảo trì; vẫn dùng cho app WinForms/ASP.NET cũ.</li>
<li><strong>.NET (Core → 5/6/7/8)</strong> — đa nền tảng, mã nguồn mở, hiệu năng cao, hợp nhất. PRN212 nhắm <strong>.NET 8</strong> (LTS).</li>
</ul>
<h3>C# chạy thế nào: CLR &amp; IL</h3>
<p>C# của bạn được <strong>Roslyn</strong> biên dịch thành <strong>Intermediate Language (IL)</strong> lưu trong một assembly (<code>.dll</code> hoặc <code>.exe</code>). Khi chạy, <strong>CLR (Common Language Runtime)</strong> dùng trình <strong>JIT</strong> chuyển IL thành mã máy native, và cung cấp thu gom rác, an toàn kiểu và xử lý ngoại lệ. Vì CLR có trên mỗi OS, cùng một IL chạy khắp nơi — đó là ý nghĩa "đa nền tảng".</p>`,
    ),
    bi(
      `<h3>Your first .NET 8 program (top-level statements)</h3>
<p>Since C# 9, a console program needs no explicit <code>class</code> or <code>Main</code> — the compiler generates them:</p>
<pre><code class="language-csharp">// Program.cs — an entire .NET 8 console app
Console.WriteLine("Hello, PRN212!");

int a = 12, b = 30;
Console.WriteLine($"{a} + {b} = {a + b}");   // string interpolation
</code></pre>
<p>Create and run it from the <strong>CLI</strong>:</p>
<pre><code class="language-bash">dotnet new console -n HelloPrn
cd HelloPrn
dotnet run
</code></pre>
<p>Or in <strong>Visual Studio</strong>: File → New → Project → <em>Console App</em> → target <em>.NET 8.0</em> → F5 to run/debug. The <code>.csproj</code> file describes the project (target framework, package references); <code>dotnet build</code> restores NuGet packages and compiles.</p>
<div class="pitfall"><b>Đừng nhầm SDK với Runtime.</b> <code>dotnet --list-sdks</code> cho SDK (để BUILD), <code>dotnet --list-runtimes</code> cho runtime (để CHẠY). Máy thi thường có SDK; máy người dùng cuối chỉ cần runtime (hoặc bạn publish self-contained kèm runtime).</div>`,
      `<h3>Chương trình .NET 8 đầu tiên (top-level statements)</h3>
<p>Từ C# 9, chương trình console không cần <code>class</code> hay <code>Main</code> tường minh — trình biên dịch tự sinh:</p>
<pre><code class="language-csharp">// Program.cs — cả một app console .NET 8
Console.WriteLine("Hello, PRN212!");

int a = 12, b = 30;
Console.WriteLine($"{a} + {b} = {a + b}");   // nội suy chuỗi
</code></pre>
<p>Tạo và chạy bằng <strong>CLI</strong>:</p>
<pre><code class="language-bash">dotnet new console -n HelloPrn
cd HelloPrn
dotnet run
</code></pre>
<p>Hoặc trong <strong>Visual Studio</strong>: File → New → Project → <em>Console App</em> → chọn <em>.NET 8.0</em> → F5 để chạy/debug. File <code>.csproj</code> mô tả project (target framework, package reference); <code>dotnet build</code> khôi phục gói NuGet và biên dịch.</p>
<div class="pitfall"><b>Đừng nhầm SDK với Runtime.</b> <code>dotnet --list-sdks</code> liệt kê SDK (để BUILD), <code>dotnet --list-runtimes</code> liệt kê runtime (để CHẠY). Máy thi thường có SDK; máy người dùng cuối chỉ cần runtime (hoặc bạn publish self-contained kèm runtime).</div>`,
    ),
  ].join('\n'),
};

const c1q = quiz('prn212-quiz-1', 'Quiz 1 — .NET platform', 'Quiz 1 — Nền tảng .NET', [
  { id: 'q1', question: 'Thành phần nào biến IL thành mã máy native khi chạy?', options: ['Roslyn', 'CLR (JIT)', 'NuGet', 'MSBuild'], correctIndex: 1, explanation: 'CLR dùng JIT compiler biên dịch IL sang native lúc chạy; Roslyn biên dịch C#→IL lúc build.' },
  { id: 'q2', question: 'Khác biệt cốt lõi giữa .NET Framework và .NET 8?', options: ['.NET 8 chỉ chạy Windows', '.NET 8 đa nền tảng & mã nguồn mở', 'Framework nhanh hơn', 'Không khác gì'], correctIndex: 1, explanation: '.NET 5/6/7/8 là bản hợp nhất đa nền tảng; .NET Framework chỉ chạy Windows.' },
  { id: 'q3', question: 'Lệnh nào tạo project console mới?', options: ['dotnet build', 'dotnet new console', 'dotnet restore', 'dotnet publish'], correctIndex: 1, explanation: '`dotnet new console -n Ten` tạo project console.' },
]);

/* ── Ch2: C# Programming ────────────────────────────────────────── */
const c2 = {
  title: '2.1 — C# essentials: types, flow control & exceptions|||2.1 — C# cơ bản: kiểu, luồng & ngoại lệ',
  slug: 'prn212-2-1-csharp-basics',
  type: 'DOCUMENT',
  description: 'Kiểu giá trị vs tham chiếu, var, nullable, chuyển kiểu (implicit/explicit, Convert, TryParse), rẽ nhánh & vòng lặp (switch expression), và xử lý ngoại lệ try/catch/finally.',
  content: [
    bi(
      `<span class="eyebrow">PRN212 · Chapter 2 · Lesson 2.1</span>
<h2>C# essentials: types, flow &amp; exceptions</h2>
<h3>Value vs reference types</h3>
<p><strong>Value types</strong> (<code>int</code>, <code>double</code>, <code>bool</code>, <code>struct</code>, <code>enum</code>) hold their data directly and live on the stack/inline; assigning copies the value. <strong>Reference types</strong> (<code>class</code>, <code>string</code>, arrays) hold a reference to data on the heap; assigning copies the reference. <code>var</code> infers the compile-time type; nullable value types use <code>?</code> (e.g. <code>int? age = null;</code>).</p>
<h3>Type conversion</h3>
<pre><code class="language-csharp">int i = 42;
double d = i;                 // implicit widening
int j = (int)3.9;             // explicit cast → 3 (truncates)
int n = Convert.ToInt32("15");// throws on bad input
bool ok = int.TryParse("x", out int val); // ok=false, val=0 — no exception
</code></pre>
<p><strong>Prefer <code>TryParse</code> for user input</strong> — it reports failure via a bool instead of throwing.</p>`,
      `<span class="eyebrow">PRN212 · Chương 2 · Bài 2.1</span>
<h2>C# cơ bản: kiểu, luồng &amp; ngoại lệ</h2>
<h3>Kiểu giá trị vs tham chiếu</h3>
<p><strong>Kiểu giá trị</strong> (<code>int</code>, <code>double</code>, <code>bool</code>, <code>struct</code>, <code>enum</code>) chứa dữ liệu trực tiếp; gán là sao chép giá trị. <strong>Kiểu tham chiếu</strong> (<code>class</code>, <code>string</code>, mảng) chứa một tham chiếu tới dữ liệu trên heap; gán là sao chép tham chiếu. <code>var</code> suy ra kiểu lúc biên dịch; kiểu giá trị nullable dùng <code>?</code> (vd <code>int? age = null;</code>).</p>
<h3>Chuyển kiểu</h3>
<pre><code class="language-csharp">int i = 42;
double d = i;                 // ngầm, nới rộng
int j = (int)3.9;             // ép tường minh → 3 (cắt phần lẻ)
int n = Convert.ToInt32("15");// ném ngoại lệ nếu input sai
bool ok = int.TryParse("x", out int val); // ok=false, val=0 — không ném
</code></pre>
<p><strong>Ưu tiên <code>TryParse</code> cho input người dùng</strong> — báo lỗi bằng bool thay vì ném ngoại lệ.</p>`,
    ),
    bi(
      `<h3>Flow control &amp; the modern switch</h3>
<pre><code class="language-csharp">for (int k = 0; k &lt; 3; k++) Console.WriteLine(k);

string Grade(int score) =&gt; score switch   // switch expression (C# 8+)
{
    &gt;= 9 =&gt; "A",
    &gt;= 8 =&gt; "B",
    &gt;= 5 =&gt; "C",
    _    =&gt; "F"          // default arm
};
</code></pre>
<h3>Exception handling</h3>
<pre><code class="language-csharp">try
{
    int[] data = { 1, 2, 3 };
    Console.WriteLine(data[5]);     // throws IndexOutOfRangeException
}
catch (IndexOutOfRangeException ex)
{
    Console.WriteLine($"Bad index: {ex.Message}");
}
finally
{
    Console.WriteLine("Always runs — release resources here");
}
</code></pre>
<p>Catch the <strong>most specific</strong> exception first; <code>finally</code> always runs (even on return) and is where you close files/connections. Prefer <code>using</code> declarations for <code>IDisposable</code> resources (Chapter 9).</p>`,
      `<h3>Điều khiển luồng &amp; switch hiện đại</h3>
<pre><code class="language-csharp">for (int k = 0; k &lt; 3; k++) Console.WriteLine(k);

string Grade(int score) =&gt; score switch   // switch expression (C# 8+)
{
    &gt;= 9 =&gt; "A",
    &gt;= 8 =&gt; "B",
    &gt;= 5 =&gt; "C",
    _    =&gt; "F"          // nhánh mặc định
};
</code></pre>
<h3>Xử lý ngoại lệ</h3>
<pre><code class="language-csharp">try
{
    int[] data = { 1, 2, 3 };
    Console.WriteLine(data[5]);     // ném IndexOutOfRangeException
}
catch (IndexOutOfRangeException ex)
{
    Console.WriteLine($"Chỉ số sai: {ex.Message}");
}
finally
{
    Console.WriteLine("Luôn chạy — giải phóng tài nguyên ở đây");
}
</code></pre>
<p>Bắt ngoại lệ <strong>cụ thể nhất</strong> trước; <code>finally</code> luôn chạy (kể cả khi return) và là nơi đóng file/kết nối. Ưu tiên khai báo <code>using</code> cho tài nguyên <code>IDisposable</code> (Chương 9).</p>`,
    ),
  ].join('\n'),
};

const c2q = quiz('prn212-quiz-2', 'Quiz 2 — C# essentials', 'Quiz 2 — C# cơ bản', [
  { id: 'q1', question: 'Vì sao ưu tiên int.TryParse cho input người dùng?', options: ['Nhanh hơn Convert', 'Báo lỗi bằng bool thay vì ném ngoại lệ', 'Chỉ nó parse được số âm', 'Nó làm tròn'], correctIndex: 1, explanation: 'TryParse trả false khi thất bại, tránh ngoại lệ khi input xấu.' },
  { id: 'q2', question: 'Khối nào LUÔN chạy kể cả khi có return trong try?', options: ['catch', 'finally', 'else', 'default'], correctIndex: 1, explanation: 'finally luôn chạy — nơi giải phóng tài nguyên.' },
  { id: 'q3', question: 'string thuộc loại nào?', options: ['Kiểu giá trị', 'Kiểu tham chiếu', 'struct', 'enum'], correctIndex: 1, explanation: 'string là kiểu tham chiếu (dù bất biến và hành xử gần giá trị).' },
]);

/* ── Ch3: OOP with C# ───────────────────────────────────────────── */
const c3 = {
  title: '3.1 — OOP in C#: classes, inheritance, interfaces|||3.1 — OOP trong C#: class, kế thừa, interface',
  slug: 'prn212-3-1-oop',
  type: 'DOCUMENT',
  description: 'Class & object, encapsulation (property, access modifier), constructor; kế thừa & đa hình (virtual/override, abstract), interface, và record (C# 9) cho kiểu dữ liệu bất biến.',
  content: [
    bi(
      `<span class="eyebrow">PRN212 · Chapter 3 · Lesson 3.1</span>
<h2>Object-Oriented Programming in C#</h2>
<p class="lead">You know OOP from PRO192 (Java); C# has the same pillars — <strong>encapsulation, inheritance, polymorphism, abstraction</strong> — with nicer syntax (properties, records).</p>
<h3>Class, properties &amp; constructor</h3>
<pre><code class="language-csharp">public class Account
{
    public string Owner { get; init; }          // set once, at creation
    public decimal Balance { get; private set; } // read-only outside

    public Account(string owner, decimal opening)
    {
        Owner = owner;
        Balance = opening;
    }

    public void Deposit(decimal amount)
    {
        if (amount &lt;= 0) throw new ArgumentException("amount must be &gt; 0");
        Balance += amount;
    }
}
</code></pre>
<p><strong>Properties</strong> (<code>get/set</code>) replace Java getters/setters; <code>init</code> allows set only during object creation; <code>private set</code> encapsulates the balance so it changes only through <code>Deposit</code>.</p>`,
      `<span class="eyebrow">PRN212 · Chương 3 · Bài 3.1</span>
<h2>Lập trình hướng đối tượng trong C#</h2>
<p class="lead">Bạn đã biết OOP từ PRO192 (Java); C# có cùng bốn trụ — <strong>đóng gói, kế thừa, đa hình, trừu tượng</strong> — với cú pháp gọn hơn (property, record).</p>
<h3>Class, property &amp; constructor</h3>
<pre><code class="language-csharp">public class Account
{
    public string Owner { get; init; }          // đặt một lần, lúc tạo
    public decimal Balance { get; private set; } // chỉ đọc từ ngoài

    public Account(string owner, decimal opening)
    {
        Owner = owner;
        Balance = opening;
    }

    public void Deposit(decimal amount)
    {
        if (amount &lt;= 0) throw new ArgumentException("amount phải &gt; 0");
        Balance += amount;
    }
}
</code></pre>
<p><strong>Property</strong> (<code>get/set</code>) thay getter/setter kiểu Java; <code>init</code> chỉ cho gán lúc tạo đối tượng; <code>private set</code> đóng gói balance để nó chỉ đổi qua <code>Deposit</code>.</p>`,
    ),
    bi(
      `<h3>Inheritance, polymorphism &amp; interfaces</h3>
<pre><code class="language-csharp">public abstract class Shape
{
    public abstract double Area();               // must be overridden
    public virtual string Describe() =&gt; $"Area = {Area():F2}";
}

public class Circle : Shape
{
    public double R { get; init; }
    public override double Area() =&gt; Math.PI * R * R;
}

public interface IPrintable { void Print(); }

public class Circle2 : Circle, IPrintable
{
    public void Print() =&gt; Console.WriteLine(Describe());
}
</code></pre>
<p><code>abstract</code> = no body, subclass must <code>override</code>; <code>virtual</code> = has a default body a subclass <em>may</em> override. An <strong>interface</strong> is a contract of members with no state — a class can implement many interfaces but inherit only one base class.</p>
<h3>Records — concise immutable data (C# 9)</h3>
<pre><code class="language-csharp">public record Point(int X, int Y);        // value equality + ToString for free
var p1 = new Point(1, 2);
var p2 = p1 with { Y = 9 };               // non-destructive copy
Console.WriteLine(p1 == new Point(1, 2)); // True — compares by value
</code></pre>`,
      `<h3>Kế thừa, đa hình &amp; interface</h3>
<pre><code class="language-csharp">public abstract class Shape
{
    public abstract double Area();               // phải override
    public virtual string Describe() =&gt; $"Area = {Area():F2}";
}

public class Circle : Shape
{
    public double R { get; init; }
    public override double Area() =&gt; Math.PI * R * R;
}

public interface IPrintable { void Print(); }

public class Circle2 : Circle, IPrintable
{
    public void Print() =&gt; Console.WriteLine(Describe());
}
</code></pre>
<p><code>abstract</code> = không thân, lớp con phải <code>override</code>; <code>virtual</code> = có thân mặc định mà lớp con <em>có thể</em> override. Một <strong>interface</strong> là hợp đồng các thành viên không trạng thái — một class hiện thực được nhiều interface nhưng chỉ kế thừa một lớp cha.</p>
<h3>Record — kiểu dữ liệu bất biến gọn (C# 9)</h3>
<pre><code class="language-csharp">public record Point(int X, int Y);        // tự có so sánh giá trị + ToString
var p1 = new Point(1, 2);
var p2 = p1 with { Y = 9 };               // sao chép không phá huỷ
Console.WriteLine(p1 == new Point(1, 2)); // True — so theo giá trị
</code></pre>`,
    ),
  ].join('\n'),
};

const c3q = quiz('prn212-quiz-3', 'Quiz 3 — OOP', 'Quiz 3 — OOP', [
  { id: 'q1', question: 'Từ khoá nào bắt lớp con BẮT BUỘC hiện thực phương thức?', options: ['virtual', 'abstract', 'sealed', 'static'], correctIndex: 1, explanation: 'abstract không có thân → lớp con phải override.' },
  { id: 'q2', question: 'Một class trong C# có thể...', options: ['kế thừa nhiều lớp cha', 'hiện thực nhiều interface', 'không có constructor', 'không có property'], correctIndex: 1, explanation: 'Đơn kế thừa lớp, nhưng đa hiện thực interface.' },
  { id: 'q3', question: 'record khác class chủ yếu ở?', options: ['Không compile', 'So sánh theo giá trị & bất biến tiện', 'Chạy nhanh gấp đôi', 'Không có property'], correctIndex: 1, explanation: 'record cho value equality, ToString, và cú pháp `with` cho bản sao bất biến.' },
]);

/* ── Ch4: Collections & Generics ────────────────────────────────── */
const c4 = {
  title: '4.1 — Collections & Generics|||4.1 — Collections & Generics',
  slug: 'prn212-4-1-collections-generics',
  type: 'DOCUMENT',
  description: 'Generic là gì & vì sao (type-safe, không boxing); List<T>, Dictionary<TKey,TValue>, HashSet<T>, Queue/Stack; và viết class/method generic có ràng buộc (where T : ...).',
  content: [
    bi(
      `<span class="eyebrow">PRN212 · Chapter 4 · Lesson 4.1</span>
<h2>Collections &amp; Generics</h2>
<p class="lead">Generics let one class/method work with <strong>any type</strong> while staying <strong>type-safe</strong> and avoiding boxing. The generic collections in <code>System.Collections.Generic</code> are what you'll use daily.</p>
<h3>The everyday generic collections</h3>
<pre><code class="language-csharp">var names = new List&lt;string&gt; { "An", "Binh" };
names.Add("Cuong");
foreach (var n in names) Console.WriteLine(n);

var ages = new Dictionary&lt;string, int&gt; { ["An"] = 20 };
ages["Binh"] = 21;
if (ages.TryGetValue("An", out int a)) Console.WriteLine(a);  // 20

var unique = new HashSet&lt;int&gt; { 1, 2, 2, 3 };  // {1,2,3} — no duplicates
var queue = new Queue&lt;string&gt;();  queue.Enqueue("x");  // FIFO
var stack = new Stack&lt;string&gt;();  stack.Push("y");     // LIFO
</code></pre>
<p>Prefer <code>List&lt;T&gt;</code> over arrays when the size changes; use <code>Dictionary</code> for key→value lookups (O(1) average); <code>HashSet</code> for membership tests and de-duplication.</p>`,
      `<span class="eyebrow">PRN212 · Chương 4 · Bài 4.1</span>
<h2>Collections &amp; Generics</h2>
<p class="lead">Generic cho một class/method làm việc với <strong>mọi kiểu</strong> mà vẫn <strong>an toàn kiểu</strong> và tránh boxing. Các collection generic trong <code>System.Collections.Generic</code> là thứ bạn dùng hằng ngày.</p>
<h3>Các collection generic thường dùng</h3>
<pre><code class="language-csharp">var names = new List&lt;string&gt; { "An", "Binh" };
names.Add("Cuong");
foreach (var n in names) Console.WriteLine(n);

var ages = new Dictionary&lt;string, int&gt; { ["An"] = 20 };
ages["Binh"] = 21;
if (ages.TryGetValue("An", out int a)) Console.WriteLine(a);  // 20

var unique = new HashSet&lt;int&gt; { 1, 2, 2, 3 };  // {1,2,3} — không trùng
var queue = new Queue&lt;string&gt;();  queue.Enqueue("x");  // FIFO
var stack = new Stack&lt;string&gt;();  stack.Push("y");     // LIFO
</code></pre>
<p>Ưu tiên <code>List&lt;T&gt;</code> hơn mảng khi cỡ thay đổi; dùng <code>Dictionary</code> cho tra key→value (trung bình O(1)); <code>HashSet</code> cho kiểm tra thành viên và khử trùng.</p>`,
    ),
    bi(
      `<h3>Writing your own generic type</h3>
<pre><code class="language-csharp">public class Box&lt;T&gt;
{
    private T _item;
    public void Put(T item) =&gt; _item = item;
    public T Get() =&gt; _item;
}

// Constraint: T must implement IComparable&lt;T&gt;
public static T Max&lt;T&gt;(T a, T b) where T : IComparable&lt;T&gt;
    =&gt; a.CompareTo(b) &gt;= 0 ? a : b;

var box = new Box&lt;int&gt;();  box.Put(42);
Console.WriteLine(Max(3, 9));       // 9
Console.WriteLine(Max("a", "b"));   // b
</code></pre>
<p>The <code>where T : ...</code> clause constrains the type parameter (e.g. <code>class</code>, <code>new()</code>, an interface). Without generics you'd use <code>object</code> and lose compile-time type checking (and pay boxing costs for value types).</p>`,
      `<h3>Tự viết kiểu generic</h3>
<pre><code class="language-csharp">public class Box&lt;T&gt;
{
    private T _item;
    public void Put(T item) =&gt; _item = item;
    public T Get() =&gt; _item;
}

// Ràng buộc: T phải hiện thực IComparable&lt;T&gt;
public static T Max&lt;T&gt;(T a, T b) where T : IComparable&lt;T&gt;
    =&gt; a.CompareTo(b) &gt;= 0 ? a : b;

var box = new Box&lt;int&gt;();  box.Put(42);
Console.WriteLine(Max(3, 9));       // 9
Console.WriteLine(Max("a", "b"));   // b
</code></pre>
<p>Mệnh đề <code>where T : ...</code> ràng buộc tham số kiểu (vd <code>class</code>, <code>new()</code>, một interface). Không có generic bạn phải dùng <code>object</code> và mất kiểm tra kiểu lúc biên dịch (và tốn boxing với kiểu giá trị).</p>`,
    ),
  ].join('\n'),
};

const c4q = quiz('prn212-quiz-4', 'Quiz 4 — Collections & Generics', 'Quiz 4 — Collections & Generics', [
  { id: 'q1', question: 'Collection nào tra key→value trung bình O(1)?', options: ['List<T>', 'Dictionary<K,V>', 'Queue<T>', 'Array'], correctIndex: 1, explanation: 'Dictionary dùng bảng băm → tra trung bình O(1).' },
  { id: 'q2', question: 'Lợi ích chính của generic so với dùng object?', options: ['Ngắn hơn', 'An toàn kiểu lúc biên dịch & tránh boxing', 'Chạy trên Linux', 'Tự đa luồng'], correctIndex: 1, explanation: 'Generic giữ type-safety và tránh boxing/unboxing.' },
  { id: 'q3', question: 'HashSet<int>{1,2,2,3} có mấy phần tử?', options: ['4', '3', '2', 'Lỗi'], correctIndex: 1, explanation: 'HashSet khử trùng → {1,2,3} = 3 phần tử.' },
]);

/* ── Ch5: Design Patterns ───────────────────────────────────────── */
const c5 = {
  title: '5.1 — SOLID & design patterns in .NET|||5.1 — SOLID & design pattern trong .NET',
  slug: 'prn212-5-1-design-patterns',
  type: 'DOCUMENT',
  description: 'Nguyên tắc SOLID; ba pattern hay thi & hay dùng trong .NET: Singleton, Factory Method, Observer/Strategy — có code C# và khi nào dùng.',
  content: [
    bi(
      `<span class="eyebrow">PRN212 · Chapter 5 · Lesson 5.1</span>
<h2>SOLID &amp; design patterns</h2>
<p class="lead">Design patterns are proven solutions to recurring design problems. First internalise <strong>SOLID</strong>, then learn the patterns the exam and WPF/EF chapters rely on.</p>
<h3>SOLID in one line each</h3>
<ul>
<li><strong>S</strong>ingle Responsibility — a class has one reason to change.</li>
<li><strong>O</strong>pen/Closed — open to extension, closed to modification.</li>
<li><strong>L</strong>iskov Substitution — a subclass must be usable wherever its base is.</li>
<li><strong>I</strong>nterface Segregation — many small interfaces beat one fat one.</li>
<li><strong>D</strong>ependency Inversion — depend on abstractions, not concretions.</li>
</ul>
<h3>Singleton — one shared instance</h3>
<pre><code class="language-csharp">public sealed class Config
{
    private static readonly Config _instance = new();
    public static Config Instance =&gt; _instance;
    private Config() { }        // private ctor blocks 'new Config()'
    public string AppName { get; set; } = "PRN212App";
}
// usage: Config.Instance.AppName
</code></pre>`,
      `<span class="eyebrow">PRN212 · Chương 5 · Bài 5.1</span>
<h2>SOLID &amp; design pattern</h2>
<p class="lead">Design pattern là giải pháp đã kiểm chứng cho các vấn đề thiết kế lặp lại. Thấm <strong>SOLID</strong> trước, rồi học các pattern mà đề thi và chương WPF/EF dựa vào.</p>
<h3>SOLID mỗi cái một dòng</h3>
<ul>
<li><strong>S</strong>ingle Responsibility — một class chỉ một lý do để đổi.</li>
<li><strong>O</strong>pen/Closed — mở cho mở rộng, đóng cho sửa đổi.</li>
<li><strong>L</strong>iskov Substitution — lớp con dùng được ở mọi nơi lớp cha dùng.</li>
<li><strong>I</strong>nterface Segregation — nhiều interface nhỏ hơn một interface phình.</li>
<li><strong>D</strong>ependency Inversion — phụ thuộc vào trừu tượng, không vào cụ thể.</li>
</ul>
<h3>Singleton — một thể hiện dùng chung</h3>
<pre><code class="language-csharp">public sealed class Config
{
    private static readonly Config _instance = new();
    public static Config Instance =&gt; _instance;
    private Config() { }        // ctor private chặn 'new Config()'
    public string AppName { get; set; } = "PRN212App";
}
// dùng: Config.Instance.AppName
</code></pre>`,
    ),
    bi(
      `<h3>Factory Method — defer which class to create</h3>
<pre><code class="language-csharp">public interface IButton { void Render(); }
public class WinButton : IButton { public void Render() =&gt; Console.WriteLine("Win"); }
public class MacButton : IButton { public void Render() =&gt; Console.WriteLine("Mac"); }

public static class ButtonFactory
{
    public static IButton Create(string os) =&gt; os switch
    {
        "win" =&gt; new WinButton(),
        "mac" =&gt; new MacButton(),
        _     =&gt; throw new NotSupportedException(os)
    };
}
</code></pre>
<h3>Observer / Strategy</h3>
<p><strong>Observer</strong> — subjects notify subscribers of changes (C# <code>event</code> is built-in Observer; the WPF <code>INotifyPropertyChanged</code> in Chapter 7 is exactly this). <strong>Strategy</strong> — encapsulate interchangeable algorithms behind an interface and swap them at runtime (e.g. different sort/pricing strategies injected via a constructor — Dependency Inversion in action).</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> Trong .NET thực tế bạn hiếm khi tự viết Singleton — dùng <b>Dependency Injection container</b> (<code>services.AddSingleton&lt;Config&gt;()</code>) để quản vòng đời, dễ test hơn. Nhưng đề PRN212 vẫn hỏi Singleton "cổ điển", nên nắm cả hai.</div>`,
      `<h3>Factory Method — hoãn quyết định tạo class nào</h3>
<pre><code class="language-csharp">public interface IButton { void Render(); }
public class WinButton : IButton { public void Render() =&gt; Console.WriteLine("Win"); }
public class MacButton : IButton { public void Render() =&gt; Console.WriteLine("Mac"); }

public static class ButtonFactory
{
    public static IButton Create(string os) =&gt; os switch
    {
        "win" =&gt; new WinButton(),
        "mac" =&gt; new MacButton(),
        _     =&gt; throw new NotSupportedException(os)
    };
}
</code></pre>
<h3>Observer / Strategy</h3>
<p><strong>Observer</strong> — subject báo thay đổi cho các subscriber (C# <code>event</code> chính là Observer dựng sẵn; <code>INotifyPropertyChanged</code> của WPF ở Chương 7 đúng là cái này). <strong>Strategy</strong> — gói các thuật toán thay thế được sau một interface và đổi lúc chạy (vd các chiến lược sắp xếp/tính giá tiêm qua constructor — chính là Dependency Inversion).</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> Trong .NET thực tế bạn hiếm khi tự viết Singleton — dùng <b>Dependency Injection container</b> (<code>services.AddSingleton&lt;Config&gt;()</code>) để quản vòng đời, dễ test hơn. Nhưng đề PRN212 vẫn hỏi Singleton "cổ điển", nên nắm cả hai.</div>`,
    ),
  ].join('\n'),
};

const c5q = quiz('prn212-quiz-5', 'Quiz 5 — Design patterns', 'Quiz 5 — Design pattern', [
  { id: 'q1', question: 'Chữ "D" trong SOLID là?', options: ['Decorator', 'Dependency Inversion', 'Delegation', 'Data hiding'], correctIndex: 1, explanation: 'D = Dependency Inversion — phụ thuộc vào abstraction.' },
  { id: 'q2', question: 'Cơ chế C# dựng sẵn hiện thực Observer là?', options: ['event', 'struct', 'using', 'record'], correctIndex: 0, explanation: 'delegate + event chính là Observer built-in của C#.' },
  { id: 'q3', question: 'Constructor private trong Singleton để làm gì?', options: ['Tăng tốc', 'Chặn tạo thể hiện từ ngoài bằng new', 'Cho phép kế thừa', 'Bắt buộc async'], correctIndex: 1, explanation: 'ctor private ngăn `new`, buộc dùng thể hiện chung qua Instance.' },
]);

/* ── Ch6: Delegates, Events & LINQ ──────────────────────────────── */
const c6 = {
  title: '6.1 — Delegates, events & LINQ|||6.1 — Delegate, event & LINQ',
  slug: 'prn212-6-1-delegates-linq',
  type: 'DOCUMENT',
  description: 'Delegate (Func/Action), lambda, event (publisher/subscriber); và LINQ: cú pháp method & query, các phép lọc/chiếu/nhóm/sắp xếp, deferred execution.',
  content: [
    bi(
      `<span class="eyebrow">PRN212 · Chapter 6 · Lesson 6.1</span>
<h2>Delegates, events &amp; LINQ</h2>
<h3>Delegates &amp; lambdas</h3>
<p>A <strong>delegate</strong> is a type-safe reference to a method — a "function pointer". <code>Func&lt;...&gt;</code> returns a value, <code>Action&lt;...&gt;</code> returns void.</p>
<pre><code class="language-csharp">Func&lt;int, int, int&gt; add = (a, b) =&gt; a + b;
Action&lt;string&gt; log = msg =&gt; Console.WriteLine($"[LOG] {msg}");
Console.WriteLine(add(3, 4));   // 7
log("started");
</code></pre>
<h3>Events — the publisher/subscriber pattern</h3>
<pre><code class="language-csharp">public class Button
{
    public event EventHandler? Clicked;          // the event
    public void Press() =&gt; Clicked?.Invoke(this, EventArgs.Empty);
}

var b = new Button();
b.Clicked += (s, e) =&gt; Console.WriteLine("Handled!");  // subscribe
b.Press();                                            // fires → "Handled!"
</code></pre>
<p>An <code>event</code> is a delegate the outside world can only <code>+=</code>/<code>-=</code> (subscribe/unsubscribe), not invoke — encapsulation for callbacks. This is exactly how WPF buttons raise <code>Click</code>.</p>`,
      `<span class="eyebrow">PRN212 · Chương 6 · Bài 6.1</span>
<h2>Delegate, event &amp; LINQ</h2>
<h3>Delegate &amp; lambda</h3>
<p>Một <strong>delegate</strong> là tham chiếu an toàn kiểu tới một phương thức — một "con trỏ hàm". <code>Func&lt;...&gt;</code> trả về giá trị, <code>Action&lt;...&gt;</code> trả về void.</p>
<pre><code class="language-csharp">Func&lt;int, int, int&gt; add = (a, b) =&gt; a + b;
Action&lt;string&gt; log = msg =&gt; Console.WriteLine($"[LOG] {msg}");
Console.WriteLine(add(3, 4));   // 7
log("started");
</code></pre>
<h3>Event — mẫu publisher/subscriber</h3>
<pre><code class="language-csharp">public class Button
{
    public event EventHandler? Clicked;          // sự kiện
    public void Press() =&gt; Clicked?.Invoke(this, EventArgs.Empty);
}

var b = new Button();
b.Clicked += (s, e) =&gt; Console.WriteLine("Handled!");  // đăng ký
b.Press();                                            // bắn → "Handled!"
</code></pre>
<p>Một <code>event</code> là delegate mà bên ngoài chỉ <code>+=</code>/<code>-=</code> (đăng ký/huỷ), không invoke được — đóng gói cho callback. WPF button phát <code>Click</code> đúng theo cách này.</p>`,
    ),
    bi(
      `<h3>LINQ — query any collection</h3>
<p>LINQ (Language-INtegrated Query) queries collections, databases (EF Core), XML, etc. with the same operators. Two equivalent syntaxes:</p>
<pre><code class="language-csharp">var nums = new[] { 5, 2, 9, 1, 7, 4 };

// method syntax
var big = nums.Where(n =&gt; n &gt; 4).OrderBy(n =&gt; n).ToList();  // 5,7,9

// query syntax (same result)
var big2 = from n in nums where n &gt; 4 orderby n select n;

// projection + grouping + aggregation
var byParity = nums.GroupBy(n =&gt; n % 2 == 0 ? "even" : "odd")
                   .Select(g =&gt; new { Kind = g.Key, Sum = g.Sum() });
</code></pre>
<p>Common operators: <code>Where</code> (filter), <code>Select</code> (project), <code>OrderBy</code>, <code>GroupBy</code>, <code>First/FirstOrDefault</code>, <code>Any/All</code>, <code>Count/Sum/Average/Max</code>. LINQ uses <strong>deferred execution</strong> — the query runs when you enumerate it (<code>foreach</code>, <code>ToList()</code>), not when you declare it.</p>
<div class="pitfall"><b>Deferred execution bẫy người mới.</b> Nếu bạn đổi dữ liệu nguồn SAU khi khai báo query nhưng TRƯỚC khi enumerate, kết quả phản ánh dữ liệu mới. Gọi <code>.ToList()</code> để "chốt" kết quả ngay.</div>`,
      `<h3>LINQ — truy vấn mọi collection</h3>
<p>LINQ (Language-INtegrated Query) truy vấn collection, database (EF Core), XML… bằng cùng bộ toán tử. Hai cú pháp tương đương:</p>
<pre><code class="language-csharp">var nums = new[] { 5, 2, 9, 1, 7, 4 };

// method syntax
var big = nums.Where(n =&gt; n &gt; 4).OrderBy(n =&gt; n).ToList();  // 5,7,9

// query syntax (cùng kết quả)
var big2 = from n in nums where n &gt; 4 orderby n select n;

// chiếu + nhóm + tổng hợp
var byParity = nums.GroupBy(n =&gt; n % 2 == 0 ? "even" : "odd")
                   .Select(g =&gt; new { Kind = g.Key, Sum = g.Sum() });
</code></pre>
<p>Toán tử hay dùng: <code>Where</code> (lọc), <code>Select</code> (chiếu), <code>OrderBy</code>, <code>GroupBy</code>, <code>First/FirstOrDefault</code>, <code>Any/All</code>, <code>Count/Sum/Average/Max</code>. LINQ dùng <strong>deferred execution</strong> — query chạy khi bạn duyệt (<code>foreach</code>, <code>ToList()</code>), không phải lúc khai báo.</p>
<div class="pitfall"><b>Deferred execution bẫy người mới.</b> Nếu đổi dữ liệu nguồn SAU khi khai báo query nhưng TRƯỚC khi duyệt, kết quả phản ánh dữ liệu mới. Gọi <code>.ToList()</code> để "chốt" kết quả ngay.</div>`,
    ),
  ].join('\n'),
};

const c6q = quiz('prn212-quiz-6', 'Quiz 6 — Delegates & LINQ', 'Quiz 6 — Delegate & LINQ', [
  { id: 'q1', question: 'Func<int,int,int> trả về kiểu gì?', options: ['void', 'int (tham số cuối là kiểu trả về)', 'bool', 'không xác định'], correctIndex: 1, explanation: 'Trong Func<...>, tham số kiểu cuối cùng là kiểu trả về → int.' },
  { id: 'q2', question: 'LINQ chạy query khi nào (deferred execution)?', options: ['Lúc khai báo', 'Lúc enumerate (foreach/ToList)', 'Lúc biên dịch', 'Không bao giờ'], correctIndex: 1, explanation: 'Query chạy khi duyệt, không phải khi khai báo.' },
  { id: 'q3', question: 'Bên ngoài class chỉ được làm gì với một event?', options: ['Invoke nó', '+= / -= (đăng ký/huỷ)', 'Đặt = null', 'Gọi trực tiếp'], correctIndex: 1, explanation: 'event chỉ cho subscribe/unsubscribe từ ngoài, không invoke.' },
]);

/* ── Ch7: WPF ───────────────────────────────────────────────────── */
const c7 = {
  title: '7.1 — WPF: XAML, data binding & MVVM|||7.1 — WPF: XAML, data binding & MVVM',
  slug: 'prn212-7-1-wpf-mvvm',
  type: 'DOCUMENT',
  description: 'WPF & XAML, layout panel; data binding hai chiều với INotifyPropertyChanged; và mẫu MVVM (Model–View–ViewModel) với ICommand — nền để chấm Practical Exam.',
  content: [
    bi(
      `<span class="eyebrow">PRN212 · Chapter 7 · Lesson 7.1</span>
<h2>WPF: XAML, data binding &amp; MVVM</h2>
<p class="lead">WPF (Windows Presentation Foundation) builds rich desktop UIs. The UI is written in <strong>XAML</strong> (a declarative XML), and its power is <strong>data binding</strong> — the UI and your objects stay in sync automatically.</p>
<h3>A XAML window with binding</h3>
<pre><code class="language-xml">&lt;Window x:Class="Demo.MainWindow" ...&gt;
  &lt;StackPanel Margin="12"&gt;
    &lt;TextBox Text="{Binding Name, UpdateSourceTrigger=PropertyChanged}"/&gt;
    &lt;TextBlock Text="{Binding Greeting}"/&gt;
    &lt;Button Content="Greet" Command="{Binding GreetCommand}"/&gt;
  &lt;/StackPanel&gt;
&lt;/Window&gt;
</code></pre>
<p>Common layout panels: <code>StackPanel</code> (stack), <code>Grid</code> (rows/columns), <code>DockPanel</code>, <code>WrapPanel</code>. Controls: <code>TextBox</code>, <code>TextBlock</code>, <code>Button</code>, <code>ListView</code>, <code>DataGrid</code>, <code>ComboBox</code>.</p>`,
      `<span class="eyebrow">PRN212 · Chương 7 · Bài 7.1</span>
<h2>WPF: XAML, data binding &amp; MVVM</h2>
<p class="lead">WPF (Windows Presentation Foundation) xây UI desktop phong phú. UI viết bằng <strong>XAML</strong> (một dạng XML khai báo), và sức mạnh của nó là <strong>data binding</strong> — UI và đối tượng của bạn tự đồng bộ.</p>
<h3>Một cửa sổ XAML có binding</h3>
<pre><code class="language-xml">&lt;Window x:Class="Demo.MainWindow" ...&gt;
  &lt;StackPanel Margin="12"&gt;
    &lt;TextBox Text="{Binding Name, UpdateSourceTrigger=PropertyChanged}"/&gt;
    &lt;TextBlock Text="{Binding Greeting}"/&gt;
    &lt;Button Content="Greet" Command="{Binding GreetCommand}"/&gt;
  &lt;/StackPanel&gt;
&lt;/Window&gt;
</code></pre>
<p>Panel layout hay dùng: <code>StackPanel</code> (xếp chồng), <code>Grid</code> (hàng/cột), <code>DockPanel</code>, <code>WrapPanel</code>. Control: <code>TextBox</code>, <code>TextBlock</code>, <code>Button</code>, <code>ListView</code>, <code>DataGrid</code>, <code>ComboBox</code>.</p>`,
    ),
    bi(
      `<h3>MVVM &amp; INotifyPropertyChanged</h3>
<p><strong>MVVM</strong> separates the <strong>Model</strong> (data), <strong>View</strong> (XAML), and <strong>ViewModel</strong> (state + commands the View binds to). For the View to update when a property changes, the ViewModel implements <code>INotifyPropertyChanged</code> (the Observer pattern from Chapter 5):</p>
<pre><code class="language-csharp">public class MainViewModel : INotifyPropertyChanged
{
    private string _name = "";
    public string Name
    {
        get =&gt; _name;
        set { _name = value; OnChanged(nameof(Name)); OnChanged(nameof(Greeting)); }
    }
    public string Greeting =&gt; string.IsNullOrEmpty(Name) ? "" : $"Hello, {Name}!";

    public event PropertyChangedEventHandler? PropertyChanged;
    void OnChanged(string p) =&gt; PropertyChanged?.Invoke(this, new(p));
}
</code></pre>
<p>Bind the View to a ViewModel via <code>DataContext = new MainViewModel();</code>. Button actions bind to an <code>ICommand</code> (e.g. a <code>RelayCommand</code>) instead of code-behind click handlers — cleaner and testable. <strong>The Practical Exam usually asks for a small WPF CRUD app over a database — MVVM + binding + a DataGrid is the winning structure.</strong></p>`,
      `<h3>MVVM &amp; INotifyPropertyChanged</h3>
<p><strong>MVVM</strong> tách <strong>Model</strong> (dữ liệu), <strong>View</strong> (XAML), và <strong>ViewModel</strong> (trạng thái + lệnh mà View bind vào). Để View cập nhật khi một property đổi, ViewModel hiện thực <code>INotifyPropertyChanged</code> (mẫu Observer từ Chương 5):</p>
<pre><code class="language-csharp">public class MainViewModel : INotifyPropertyChanged
{
    private string _name = "";
    public string Name
    {
        get =&gt; _name;
        set { _name = value; OnChanged(nameof(Name)); OnChanged(nameof(Greeting)); }
    }
    public string Greeting =&gt; string.IsNullOrEmpty(Name) ? "" : $"Hello, {Name}!";

    public event PropertyChangedEventHandler? PropertyChanged;
    void OnChanged(string p) =&gt; PropertyChanged?.Invoke(this, new(p));
}
</code></pre>
<p>Gắn View với ViewModel qua <code>DataContext = new MainViewModel();</code>. Hành động nút bind vào một <code>ICommand</code> (vd <code>RelayCommand</code>) thay vì handler click trong code-behind — sạch và test được. <strong>Practical Exam thường yêu cầu một app WPF CRUD nhỏ trên database — MVVM + binding + DataGrid là cấu trúc thắng.</strong></p>`,
    ),
  ].join('\n'),
};

const c7q = quiz('prn212-quiz-7', 'Quiz 7 — WPF & MVVM', 'Quiz 7 — WPF & MVVM', [
  { id: 'q1', question: 'Ngôn ngữ khai báo UI trong WPF là?', options: ['HTML', 'XAML', 'JSON', 'Razor'], correctIndex: 1, explanation: 'WPF dùng XAML (XML khai báo) cho UI.' },
  { id: 'q2', question: 'Để View WPF cập nhật khi property đổi, ViewModel hiện thực?', options: ['IDisposable', 'INotifyPropertyChanged', 'IComparable', 'IEnumerable'], correctIndex: 1, explanation: 'INotifyPropertyChanged phát PropertyChanged để binding cập nhật.' },
  { id: 'q3', question: 'Trong MVVM, phần nào chứa lệnh & trạng thái mà View bind vào?', options: ['Model', 'View', 'ViewModel', 'Controller'], correctIndex: 2, explanation: 'ViewModel giữ state + ICommand cho View bind.' },
]);

/* ── Ch8: Entity Framework Core ─────────────────────────────────── */
const c8 = {
  title: '8.1 — Data access with Entity Framework Core|||8.1 — Truy cập dữ liệu với Entity Framework Core',
  slug: 'prn212-8-1-ef-core',
  type: 'DOCUMENT',
  description: 'ORM & EF Core, DbContext + DbSet, code-first vs database-first, CRUD với LINQ-to-Entities, và migration. Nền cho phần dữ liệu của Practical Exam.',
  content: [
    bi(
      `<span class="eyebrow">PRN212 · Chapter 8 · Lesson 8.1</span>
<h2>Entity Framework Core (ORM)</h2>
<p class="lead">EF Core is an <strong>Object-Relational Mapper</strong>: it maps C# classes to database tables so you work with objects and LINQ instead of raw SQL. It builds on your DBI202 knowledge.</p>
<h3>Model + DbContext</h3>
<pre><code class="language-csharp">public class Product
{
    public int Id { get; set; }             // convention: Id = primary key
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
}

public class ShopContext : DbContext
{
    public DbSet&lt;Product&gt; Products =&gt; Set&lt;Product&gt;();
    protected override void OnConfiguring(DbContextOptionsBuilder o) =&gt;
        o.UseSqlServer("Server=.;Database=Shop;Trusted_Connection=True;TrustServerCertificate=True");
}
</code></pre>
<p>A <code>DbContext</code> is a session with the database; each <code>DbSet&lt;T&gt;</code> is a table. <strong>Code-first</strong> generates the schema from your classes (via migrations); <strong>database-first</strong> scaffolds classes from an existing DB (<code>dotnet ef dbcontext scaffold</code>).</p>`,
      `<span class="eyebrow">PRN212 · Chương 8 · Bài 8.1</span>
<h2>Entity Framework Core (ORM)</h2>
<p class="lead">EF Core là một <strong>Object-Relational Mapper</strong>: ánh xạ class C# tới bảng database để bạn làm việc với đối tượng và LINQ thay vì SQL thô. Nó dựa trên kiến thức DBI202 của bạn.</p>
<h3>Model + DbContext</h3>
<pre><code class="language-csharp">public class Product
{
    public int Id { get; set; }             // quy ước: Id = khoá chính
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
}

public class ShopContext : DbContext
{
    public DbSet&lt;Product&gt; Products =&gt; Set&lt;Product&gt;();
    protected override void OnConfiguring(DbContextOptionsBuilder o) =&gt;
        o.UseSqlServer("Server=.;Database=Shop;Trusted_Connection=True;TrustServerCertificate=True");
}
</code></pre>
<p>Một <code>DbContext</code> là một phiên với database; mỗi <code>DbSet&lt;T&gt;</code> là một bảng. <strong>Code-first</strong> sinh schema từ class của bạn (qua migration); <strong>database-first</strong> scaffold class từ DB có sẵn (<code>dotnet ef dbcontext scaffold</code>).</p>`,
    ),
    bi(
      `<h3>CRUD with LINQ-to-Entities</h3>
<pre><code class="language-csharp">using var db = new ShopContext();

// CREATE
db.Products.Add(new Product { Name = "Book", Price = 120000 });
db.SaveChanges();

// READ (LINQ → SQL, runs on the server)
var cheap = db.Products.Where(p =&gt; p.Price &lt; 200000)
                       .OrderBy(p =&gt; p.Name).ToList();

// UPDATE
var p = db.Products.First(x =&gt; x.Name == "Book");
p.Price = 99000;
db.SaveChanges();

// DELETE
db.Products.Remove(p);
db.SaveChanges();
</code></pre>
<p>The same LINQ you learned in Chapter 6 is translated to SQL by EF Core (LINQ-to-Entities) and executed on the database. Migrations evolve the schema:</p>
<pre><code class="language-bash">dotnet ef migrations add InitialCreate
dotnet ef database update
</code></pre>
<div class="pitfall"><b>Đừng để chuỗi kết nối (mật khẩu DB) trong code khi nộp bài thật.</b> Đưa vào <code>appsettings.json</code> / biến môi trường. Trong Practical Exam thì theo yêu cầu đề, nhưng thói quen tốt là tách cấu hình khỏi code.</div>`,
      `<h3>CRUD với LINQ-to-Entities</h3>
<pre><code class="language-csharp">using var db = new ShopContext();

// CREATE
db.Products.Add(new Product { Name = "Book", Price = 120000 });
db.SaveChanges();

// READ (LINQ → SQL, chạy trên server)
var cheap = db.Products.Where(p =&gt; p.Price &lt; 200000)
                       .OrderBy(p =&gt; p.Name).ToList();

// UPDATE
var p = db.Products.First(x =&gt; x.Name == "Book");
p.Price = 99000;
db.SaveChanges();

// DELETE
db.Products.Remove(p);
db.SaveChanges();
</code></pre>
<p>Cùng LINQ đã học ở Chương 6 được EF Core dịch sang SQL (LINQ-to-Entities) và chạy trên database. Migration tiến hoá schema:</p>
<pre><code class="language-bash">dotnet ef migrations add InitialCreate
dotnet ef database update
</code></pre>
<div class="pitfall"><b>Đừng để chuỗi kết nối (mật khẩu DB) trong code khi nộp bài thật.</b> Đưa vào <code>appsettings.json</code> / biến môi trường. Trong Practical Exam thì theo yêu cầu đề, nhưng thói quen tốt là tách cấu hình khỏi code.</div>`,
    ),
  ].join('\n'),
};

const c8q = quiz('prn212-quiz-8', 'Quiz 8 — EF Core', 'Quiz 8 — EF Core', [
  { id: 'q1', question: 'EF Core là loại công cụ gì?', options: ['Trình biên dịch', 'ORM (ánh xạ đối tượng–quan hệ)', 'Trình debug', 'UI framework'], correctIndex: 1, explanation: 'EF Core ánh xạ class ↔ bảng, cho làm việc bằng đối tượng/LINQ.' },
  { id: 'q2', question: 'Phương thức nào lưu thay đổi xuống database?', options: ['db.Update()', 'db.SaveChanges()', 'db.Flush()', 'db.Commit()'], correctIndex: 1, explanation: 'SaveChanges() ghi các thay đổi đang theo dõi xuống DB.' },
  { id: 'q3', question: 'Lệnh tạo migration đầu tiên?', options: ['dotnet ef database update', 'dotnet ef migrations add InitialCreate', 'dotnet new ef', 'dotnet restore'], correctIndex: 1, explanation: '`migrations add <Ten>` tạo migration; `database update` áp nó.' },
]);

/* ── Ch9: Files & System.IO ─────────────────────────────────────── */
const c9 = {
  title: '9.1 — Files, streams & System.IO|||9.1 — File, stream & System.IO',
  slug: 'prn212-9-1-files-io',
  type: 'DOCUMENT',
  description: 'Đọc/ghi file (File, StreamReader/Writer), using để giải phóng, đường dẫn (Path), và stream nhị phân — cùng xử lý ngoại lệ IO.',
  content: [
    bi(
      `<span class="eyebrow">PRN212 · Chapter 9 · Lesson 9.1</span>
<h2>Files, streams &amp; System.IO</h2>
<pre><code class="language-csharp">// Simple whole-file helpers
File.WriteAllText("note.txt", "Hello PRN212");
string all = File.ReadAllText("note.txt");
string[] lines = File.ReadAllLines("note.txt");

// Streaming a large file line by line, disposed automatically
using (var reader = new StreamReader("big.csv"))
{
    string? line;
    while ((line = reader.ReadLine()) is not null)
        Console.WriteLine(line);
}   // reader.Dispose() called here — file handle released

// Build paths portably
string path = Path.Combine("data", "logs", "app.log");
</code></pre>
<p>The <code>using</code> statement/declaration guarantees <code>Dispose()</code> runs (closing the file) even if an exception is thrown — the disciplined way to release OS resources. Wrap IO in <code>try/catch (IOException)</code> because files can be missing, locked or unreadable.</p>`,
      `<span class="eyebrow">PRN212 · Chương 9 · Bài 9.1</span>
<h2>File, stream &amp; System.IO</h2>
<pre><code class="language-csharp">// Helper đọc/ghi cả file
File.WriteAllText("note.txt", "Hello PRN212");
string all = File.ReadAllText("note.txt");
string[] lines = File.ReadAllLines("note.txt");

// Đọc stream file lớn từng dòng, tự giải phóng
using (var reader = new StreamReader("big.csv"))
{
    string? line;
    while ((line = reader.ReadLine()) is not null)
        Console.WriteLine(line);
}   // reader.Dispose() gọi ở đây — trả lại handle file

// Ghép đường dẫn đa nền tảng
string path = Path.Combine("data", "logs", "app.log");
</code></pre>
<p>Câu lệnh/khai báo <code>using</code> bảo đảm <code>Dispose()</code> chạy (đóng file) kể cả khi có ngoại lệ — cách kỷ luật để trả tài nguyên OS. Bọc IO trong <code>try/catch (IOException)</code> vì file có thể thiếu, bị khoá hoặc không đọc được.</p>`,
    ),
  ].join('\n'),
};

const c9q = quiz('prn212-quiz-9', 'Quiz 9 — Files & IO', 'Quiz 9 — File & IO', [
  { id: 'q1', question: 'using (var r = new StreamReader(...)) bảo đảm điều gì?', options: ['File nhanh hơn', 'Dispose() (đóng file) luôn chạy dù có ngoại lệ', 'File không bao giờ lỗi', 'Tự đa luồng'], correctIndex: 1, explanation: 'using gọi Dispose() ở cuối khối, giải phóng handle kể cả khi ném ngoại lệ.' },
  { id: 'q2', question: 'Cách ghép đường dẫn đa nền tảng đúng?', options: ['"a" + "/" + "b"', 'Path.Combine("a","b")', 'string.Concat', '"a\\\\b"'], correctIndex: 1, explanation: 'Path.Combine dùng ký tự phân tách đúng theo OS.' },
]);

/* ── Ch10: XML & JSON ───────────────────────────────────────────── */
const c10 = {
  title: '10.1 — Working with XML & JSON|||10.1 — Làm việc với XML & JSON',
  slug: 'prn212-10-1-xml-json',
  type: 'DOCUMENT',
  description: 'Serialize/deserialize JSON bằng System.Text.Json; đọc/ghi XML bằng LINQ-to-XML (XDocument). Khi nào dùng cái nào.',
  content: [
    bi(
      `<span class="eyebrow">PRN212 · Chapter 10 · Lesson 10.1</span>
<h2>XML &amp; JSON</h2>
<h3>JSON with System.Text.Json</h3>
<pre><code class="language-csharp">using System.Text.Json;

var p = new Product { Id = 1, Name = "Book", Price = 120000 };
string json = JsonSerializer.Serialize(p);            // object → string
Product? back = JsonSerializer.Deserialize&lt;Product&gt;(json); // string → object

var opts = new JsonSerializerOptions { WriteIndented = true };
File.WriteAllText("product.json", JsonSerializer.Serialize(p, opts));
</code></pre>
<p><code>System.Text.Json</code> is the built-in, high-performance JSON library — prefer it for config, APIs and data files.</p>
<h3>XML with LINQ-to-XML</h3>
<pre><code class="language-csharp">using System.Xml.Linq;

var doc = new XDocument(
    new XElement("products",
        new XElement("product",
            new XAttribute("id", 1),
            new XElement("name", "Book"))));
doc.Save("products.xml");

var loaded = XDocument.Load("products.xml");
foreach (var name in loaded.Descendants("name"))
    Console.WriteLine(name.Value);   // Book
</code></pre>
<p>Use <strong>JSON</strong> for modern web/API data; you'll still meet <strong>XML</strong> in config files, SOAP services and legacy formats.</p>`,
      `<span class="eyebrow">PRN212 · Chương 10 · Bài 10.1</span>
<h2>XML &amp; JSON</h2>
<h3>JSON với System.Text.Json</h3>
<pre><code class="language-csharp">using System.Text.Json;

var p = new Product { Id = 1, Name = "Book", Price = 120000 };
string json = JsonSerializer.Serialize(p);            // đối tượng → chuỗi
Product? back = JsonSerializer.Deserialize&lt;Product&gt;(json); // chuỗi → đối tượng

var opts = new JsonSerializerOptions { WriteIndented = true };
File.WriteAllText("product.json", JsonSerializer.Serialize(p, opts));
</code></pre>
<p><code>System.Text.Json</code> là thư viện JSON dựng sẵn, hiệu năng cao — ưu tiên cho config, API và file dữ liệu.</p>
<h3>XML với LINQ-to-XML</h3>
<pre><code class="language-csharp">using System.Xml.Linq;

var doc = new XDocument(
    new XElement("products",
        new XElement("product",
            new XAttribute("id", 1),
            new XElement("name", "Book"))));
doc.Save("products.xml");

var loaded = XDocument.Load("products.xml");
foreach (var name in loaded.Descendants("name"))
    Console.WriteLine(name.Value);   // Book
</code></pre>
<p>Dùng <strong>JSON</strong> cho dữ liệu web/API hiện đại; bạn vẫn gặp <strong>XML</strong> trong file config, dịch vụ SOAP và định dạng cũ.</p>`,
    ),
  ].join('\n'),
};

const c10q = quiz('prn212-quiz-10', 'Quiz 10 — XML & JSON', 'Quiz 10 — XML & JSON', [
  { id: 'q1', question: 'Thư viện JSON dựng sẵn của .NET hiện đại là?', options: ['Newtonsoft.Json', 'System.Text.Json', 'System.Xml', 'JsonNet'], correctIndex: 1, explanation: 'System.Text.Json là thư viện built-in, hiệu năng cao.' },
  { id: 'q2', question: 'JsonSerializer.Deserialize<Product>(json) làm gì?', options: ['object → chuỗi', 'chuỗi JSON → đối tượng Product', 'xoá file', 'nén dữ liệu'], correctIndex: 1, explanation: 'Deserialize dựng lại đối tượng từ chuỗi JSON.' },
]);

/* ── Ch11: Concurrency ──────────────────────────────────────────── */
const c11 = {
  title: '11.1 — Concurrency: async/await & Task|||11.1 — Đồng thời: async/await & Task',
  slug: 'prn212-11-1-concurrency',
  type: 'DOCUMENT',
  description: 'Vì sao đồng thời (giữ UI không đơ, làm nhiều việc I/O); Task, async/await, Task.WhenAll; và bẫy thường gặp (không block .Result trên UI thread).',
  content: [
    bi(
      `<span class="eyebrow">PRN212 · Chapter 11 · Lesson 11.1</span>
<h2>Concurrency: async/await &amp; Task</h2>
<p class="lead">Long operations (network, disk, database) must not freeze the WPF UI thread. <strong>async/await</strong> lets you run them without blocking — the UI stays responsive while work happens.</p>
<pre><code class="language-csharp">public async Task&lt;string&gt; DownloadAsync(string url)
{
    using var http = new HttpClient();
    string body = await http.GetStringAsync(url);   // yields; UI thread free
    return body;
}

// run several in parallel and wait for all
var tasks = urls.Select(DownloadAsync);
string[] results = await Task.WhenAll(tasks);
</code></pre>
<p>An <code>async</code> method returns a <code>Task</code> (or <code>Task&lt;T&gt;</code>); <code>await</code> suspends until the awaited task finishes, then resumes — without blocking the thread. Use <code>Task.WhenAll</code> to run independent tasks concurrently.</p>
<div class="pitfall"><b>ĐỪNG gọi <code>.Result</code> hay <code>.Wait()</code> trên UI thread</b> — nó block và có thể gây <em>deadlock</em>, làm app đơ. Luôn <code>await</code>. Quy tắc: "async all the way".</div>`,
      `<span class="eyebrow">PRN212 · Chương 11 · Bài 11.1</span>
<h2>Đồng thời: async/await &amp; Task</h2>
<p class="lead">Thao tác dài (mạng, đĩa, database) không được làm đơ UI thread của WPF. <strong>async/await</strong> cho chạy chúng mà không block — UI vẫn mượt trong khi việc diễn ra.</p>
<pre><code class="language-csharp">public async Task&lt;string&gt; DownloadAsync(string url)
{
    using var http = new HttpClient();
    string body = await http.GetStringAsync(url);   // nhả; UI thread rảnh
    return body;
}

// chạy nhiều việc song song và đợi tất cả
var tasks = urls.Select(DownloadAsync);
string[] results = await Task.WhenAll(tasks);
</code></pre>
<p>Một phương thức <code>async</code> trả về <code>Task</code> (hoặc <code>Task&lt;T&gt;</code>); <code>await</code> tạm dừng tới khi task được đợi xong rồi tiếp tục — mà không block thread. Dùng <code>Task.WhenAll</code> để chạy các task độc lập đồng thời.</p>
<div class="pitfall"><b>ĐỪNG gọi <code>.Result</code> hay <code>.Wait()</code> trên UI thread</b> — nó block và có thể gây <em>deadlock</em>, làm app đơ. Luôn <code>await</code>. Quy tắc: "async all the way".</div>`,
    ),
  ].join('\n'),
};

const c11q = quiz('prn212-quiz-11', 'Quiz 11 — Concurrency', 'Quiz 11 — Đồng thời', [
  { id: 'q1', question: 'Vì sao dùng async/await trong app WPF?', options: ['Để code ngắn hơn', 'Để việc dài không làm đơ UI thread', 'Để chạy trên Linux', 'Bắt buộc bởi C#'], correctIndex: 1, explanation: 'async/await giữ UI thread rảnh trong khi I/O diễn ra → app không đơ.' },
  { id: 'q2', question: 'Điều KHÔNG nên làm trên UI thread?', options: ['await Task', 'Gọi .Result/.Wait() (block → có thể deadlock)', 'Task.WhenAll', 'Dùng HttpClient'], correctIndex: 1, explanation: '.Result/.Wait() block thread, có thể deadlock; luôn await.' },
  { id: 'q3', question: 'Task.WhenAll(tasks) dùng để?', options: ['Chạy tuần tự', 'Chạy nhiều task đồng thời và đợi tất cả xong', 'Huỷ task', 'Đo thời gian'], correctIndex: 1, explanation: 'WhenAll chạy song song và hoàn thành khi mọi task xong.' },
]);

// Muc "Tai lieu tham khao" — noi dung GOC (trich dan + link chinh thuc mien phi
// + tro giao trinh/slide day du tren FLM). KHONG upload PDF ban quyen len CDN.
const taiLieu = doc('prn212-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Tổng hợp tài liệu học môn: giáo trình & slide chính thức (trên FLM), sách tham khảo, tài liệu chính thức miễn phí và lộ trình tự học.',
  [[
    `<span class="eyebrow">PRN212 · Materials</span>
<h2>Course materials &amp; references</h2>
<p class="lead">Everything to study .NET / C# desktop programming, in one place. The full official slides &amp; textbook are on <strong>FLM</strong> (where FPTU students access them legitimately); below are free, legal resources.</p>
<h3>Official / free resources</h3>
<ul>
<li><a href="https://learn.microsoft.com/en-us/dotnet/csharp/" target="_blank" rel="noopener">Microsoft Learn — C# guide</a></li>
<li><a href="https://learn.microsoft.com/en-us/dotnet/" target="_blank" rel="noopener">.NET documentation</a></li>
<li><a href="https://learn.microsoft.com/en-us/dotnet/desktop/" target="_blank" rel="noopener">WPF / WinForms desktop docs</a></li>
</ul>
<h3>Reference book</h3>
<p><em>C# in Depth — Jon Skeet (Manning)</em>.</p>
<h3>Course textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for PRN212 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<div class="callout"><span class="badge">Study path</span> C# & OOP → collections/LINQ → WinForms/WPF UI → file & database access.</div>`,
    `<span class="eyebrow">PRN212 · Tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Mọi thứ cần để học lập trình desktop .NET / C#, gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong> (nơi SV FPTU truy cập hợp lệ); bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://learn.microsoft.com/en-us/dotnet/csharp/" target="_blank" rel="noopener">Microsoft Learn — C# guide</a></li>
<li><a href="https://learn.microsoft.com/en-us/dotnet/" target="_blank" rel="noopener">.NET documentation</a></li>
<li><a href="https://learn.microsoft.com/en-us/dotnet/desktop/" target="_blank" rel="noopener">WPF / WinForms desktop docs</a></li>
</ul>
<h3>Sách tham khảo</h3>
<p><em>C# in Depth — Jon Skeet (Manning)</em>.</p>
<h3>Giáo trình &amp; slide của môn</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của PRN212 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<div class="callout"><span class="badge">Lộ trình học</span> C# & OOP → collection/LINQ → giao diện WinForms/WPF → đọc file & database.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'PRN212',
    slug: 'prn212-basis-cross-platform-application-programming-with-net',
    title: 'Basis Cross-Platform Application Programming With .NET',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PRN212.webp',
    shortDescription: 'Build cross-platform desktop apps in C# on .NET 8 — C#, OOP, LINQ, design patterns, WPF, Entity Framework Core, files & concurrency. Bilingual, exam-aligned.|||Xây ứng dụng desktop đa nền tảng bằng C# trên .NET 8 — C#, OOP, LINQ, design pattern, WPF, Entity Framework Core, file & đồng thời. Song ngữ, bám đề thi.',
    description: 'Môn <strong>PRN212 — Lập trình ứng dụng đa nền tảng cơ bản với .NET</strong> (ngành Kỹ thuật phần mềm, kỳ 5). Nội dung dựng theo giáo trình chính thức FLM (11 chương, 6 CLO), song ngữ, kèm code C#/.NET 8 chạy được và quiz mỗi chương.<br><br>Bạn sẽ đi từ nền tảng .NET & C# → OOP → Collections/Generics → Design Pattern → Delegate/Event/LINQ → WPF (XAML, MVVM, data binding) → Entity Framework Core → File I/O → XML/JSON → lập trình đồng thời (async/await). Tiên quyết: PRO192, DBI202.',
    whatYouLearn: 'C# 12 & .NET 8; OOP trong C#; Collections & Generics; Design Pattern (SOLID, Singleton, Factory, Observer/Strategy); Delegate, Event & LINQ; WPF với XAML + MVVM + data binding; Entity Framework Core (ORM, CRUD, migration); File/Stream I/O; XML & JSON; async/await & Task.',
    requirements: 'Đã học PRO192 (OOP với Java) và DBI202 (cơ sở dữ liệu). Cần cài .NET 8 SDK + Visual Studio 2022 (hoặc VS Code + C# Dev Kit).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mục tiêu, CLO, cách đánh giá, lộ trình 11 chương.', lessons: [intro] },
    { title: 'Chương 1 — Nền tảng .NET & Visual Studio|||Chapter 1 — .NET platform & Visual Studio', description: '.NET Core vs Framework, CLR/IL, tạo & chạy project .NET 8.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Lập trình C#|||Chapter 2 — C# programming', description: 'Kiểu, chuyển kiểu, luồng điều khiển, xử lý ngoại lệ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — OOP với C#|||Chapter 3 — OOP with C#', description: 'Class, property, kế thừa, đa hình, interface, record.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Collections & Generics|||Chapter 4 — Collections & Generics', description: 'List/Dictionary/HashSet, viết kiểu generic có ràng buộc.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Design Pattern trong .NET|||Chapter 5 — Design patterns', description: 'SOLID, Singleton, Factory, Observer/Strategy.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Delegate, Event & LINQ|||Chapter 6 — Delegates, events & LINQ', description: 'Func/Action, lambda, event, LINQ (method & query).', lessons: [c6, c6q] },
    { title: 'Chương 7 — WPF|||Chapter 7 — WPF', description: 'XAML, layout, data binding, MVVM & INotifyPropertyChanged.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Entity Framework Core|||Chapter 8 — Entity Framework Core', description: 'ORM, DbContext, code-first, CRUD với LINQ, migration.', lessons: [c8, c8q] },
    { title: 'Chương 9 — File & System.IO|||Chapter 9 — Files & System.IO', description: 'Đọc/ghi file, stream, using, Path.', lessons: [c9, c9q] },
    { title: 'Chương 10 — XML & JSON|||Chapter 10 — XML & JSON', description: 'System.Text.Json, LINQ-to-XML.', lessons: [c10, c10q] },
    { title: 'Chương 11 — Lập trình đồng thời|||Chapter 11 — Concurrency', description: 'async/await, Task, Task.WhenAll, bẫy .Result.', lessons: [c11, c11q] },
  ],
};
