/**
 * AGU301 — Advanced Game Development (Unity). Giáo trình FLM (syl): SOLID, design
 * pattern (Command/Strategy/Factory/Decorator/State…), Unity Netcode/Relay
 * multiplayer, tối ưu hiệu năng, AI. Nối tiếp PRU221m/FGU301. Song ngữ + code C#
 * + bài tập. Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('agu301-0-1-overview', 'Course overview: Advanced Game Dev|||Tổng quan: Phát triển game nâng cao',
  'Từ "chạy được" tới "chuyên nghiệp": SOLID & design pattern cho code sạch, multiplayer với Netcode, tối ưu hiệu năng, AI. Nối tiếp PRU221m/FGU301.',
  [[
    `<span class="eyebrow">AGU301 · Lesson 0.1 · Overview</span>
<h2>Advanced Game Development with Unity</h2>
<p class="lead">This course takes you from "the game works" to "the game is professional and high-performance." You'll write <strong>clean, scalable code</strong> with SOLID principles and design patterns, build <strong>multiplayer</strong> with Unity Netcode, and <strong>optimize performance</strong> and AI to ship polished games.</p>
<h3>What you'll master</h3>
<ul>
<li><strong>SOLID principles</strong> — five rules for modular, maintainable code</li>
<li><strong>Design patterns</strong> — Command, Strategy, Factory, Decorator, State (beyond the basics)</li>
<li><strong>Networking</strong> — Unity Netcode &amp; Relay for real-time multiplayer</li>
<li><strong>Performance</strong> — profiling, the frame budget, common Unity pitfalls</li>
</ul>
<div class="callout"><span class="badge">Prerequisite</span> PRU221m / FGU301 (C# + Unity, basic OOP patterns). This course goes deeper into architecture. Bilingual, with C# and exercises.</div>`,
    `<span class="eyebrow">AGU301 · Bài 0.1 · Tổng quan</span>
<h2>Phát triển game nâng cao với Unity</h2>
<p class="lead">Môn này đưa bạn từ "game chạy được" tới "game chuyên nghiệp, hiệu năng cao". Bạn viết <strong>mã sạch, mở rộng được</strong> với SOLID và design pattern, dựng <strong>multiplayer</strong> bằng Unity Netcode, và <strong>tối ưu hiệu năng</strong> lẫn AI để ra game chỉn chu.</p>
<h3>Bạn sẽ thành thạo</h3>
<ul>
<li><strong>Nguyên tắc SOLID</strong> — năm quy tắc cho mã module hoá, dễ bảo trì</li>
<li><strong>Design pattern</strong> — Command, Strategy, Factory, Decorator, State (vượt cơ bản)</li>
<li><strong>Mạng</strong> — Unity Netcode &amp; Relay cho multiplayer thời gian thực</li>
<li><strong>Hiệu năng</strong> — profiling, ngân sách khung hình, bẫy Unity phổ biến</li>
</ul>
<div class="callout"><span class="badge">Điều kiện</span> PRU221m / FGU301 (C# + Unity, pattern OOP cơ bản). Môn này đào sâu kiến trúc. Song ngữ, có C# và bài tập.</div>`,
  ]]);

const c1 = doc('agu301-1-1-solid', '1.1 — SOLID principles|||1.1 — Nguyên tắc SOLID',
  'Năm nguyên tắc SOLID (SRP, OCP, LSP, ISP, DIP) với ví dụ Unity: vì sao code game dễ rối và SOLID gỡ thế nào.',
  [[
    `<span class="eyebrow">AGU301 · Chapter 1 · Lesson 1.1</span>
<h2>SOLID — five principles for clean code</h2>
<ul>
<li><strong>S — Single Responsibility.</strong> A class does one thing. A <code>Player</code> that handles input AND health AND UI is three classes fighting; split them.</li>
<li><strong>O — Open/Closed.</strong> Open for extension, closed for modification. Add a new weapon by adding a class, not by editing a giant <code>switch</code>.</li>
<li><strong>L — Liskov Substitution.</strong> A subclass must work anywhere its base does. If <code>Penguin : Bird</code> can't <code>Fly()</code>, the hierarchy is wrong.</li>
<li><strong>I — Interface Segregation.</strong> Many small interfaces beat one fat one. <code>IDamageable</code>, <code>IInteractable</code> — a chest needs one, not both.</li>
<li><strong>D — Dependency Inversion.</strong> Depend on abstractions, not concretes. A <code>Weapon</code> talks to an <code>IAudio</code> interface, not directly to Unity's audio.</li>
</ul>
<pre><code class="language-csharp">// DIP: the enemy doesn't care HOW damage is dealt
public interface IDamageable { void TakeDamage(int amount); }

public class Sword {
    public void Hit(IDamageable target) =&gt; target.TakeDamage(25);
}
// Sword works on ANY IDamageable: Enemy, DestructibleWall, Boss...
</code></pre>
<div class="callout"><span class="badge">Why it matters in games</span> Game code grows fast and messy — one <code>GameManager</code> ends up doing everything. SOLID keeps classes small and swappable, so a new feature is a new file, not a risky edit to a 2000-line monster.</div>`,
    `<span class="eyebrow">AGU301 · Chương 1 · Bài 1.1</span>
<h2>SOLID — năm nguyên tắc cho mã sạch</h2>
<ul>
<li><strong>S — Single Responsibility.</strong> Một lớp làm một việc. Một <code>Player</code> vừa xử lý nhập, vừa máu, vừa UI là ba lớp đánh nhau; tách ra.</li>
<li><strong>O — Open/Closed.</strong> Mở để mở rộng, đóng với sửa đổi. Thêm vũ khí mới bằng cách thêm lớp, không sửa một <code>switch</code> khổng lồ.</li>
<li><strong>L — Liskov Substitution.</strong> Lớp con phải chạy được ở mọi nơi lớp cha chạy. Nếu <code>Penguin : Bird</code> không <code>Fly()</code> được thì cây kế thừa sai.</li>
<li><strong>I — Interface Segregation.</strong> Nhiều interface nhỏ hơn một cái phình to. <code>IDamageable</code>, <code>IInteractable</code> — một cái rương cần một, không cần cả hai.</li>
<li><strong>D — Dependency Inversion.</strong> Phụ thuộc vào abstraction, không vào cụ thể. Một <code>Weapon</code> nói chuyện với interface <code>IAudio</code>, không trực tiếp với audio của Unity.</li>
</ul>
<pre><code class="language-csharp">// DIP: kẻ địch không quan tâm sát thương gây RA SAO
public interface IDamageable { void TakeDamage(int amount); }

public class Sword {
    public void Hit(IDamageable target) =&gt; target.TakeDamage(25);
}
// Sword chạy trên MỌI IDamageable: Enemy, DestructibleWall, Boss...
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng trong game</span> Mã game lớn nhanh và rối — một <code>GameManager</code> cuối cùng ôm hết. SOLID giữ lớp nhỏ và thay được, nên tính năng mới là một file mới, không phải sửa liều một quái vật 2000 dòng.</div>`,
  ]]);

const c1q = quiz('agu301-quiz-1', 'Quiz 1 — SOLID|||Quiz 1 — SOLID', [
  { id: 'q1', question: '"Thêm vũ khí mới bằng cách thêm lớp, không sửa switch khổng lồ" thể hiện nguyên tắc?', options: ['Single Responsibility', 'Open/Closed', 'Liskov', 'Interface Segregation'], correctIndex: 1, explanation: 'Open/Closed: mở để mở rộng, đóng với sửa đổi.' },
  { id: 'q2', question: 'Weapon nói chuyện qua interface IAudio thay vì audio cụ thể là?', options: ['Dependency Inversion', 'Single Responsibility', 'Liskov', 'DRY'], correctIndex: 0, explanation: 'DIP: phụ thuộc abstraction, không phụ thuộc cụ thể.' },
  { id: 'q3', question: 'Một lớp Player ôm cả input, máu, UI vi phạm nguyên tắc?', options: ['Open/Closed', 'Single Responsibility (nên tách)', 'Liskov', 'Interface Segregation'], correctIndex: 1, explanation: 'SRP: mỗi lớp một trách nhiệm.' },
]);

const c2 = doc('agu301-2-1-patterns', '2.1 — Advanced design patterns|||2.1 — Design pattern nâng cao',
  'Command (undo/input rebinding), Strategy (đổi thuật toán/AI), Factory (tạo đối tượng), State & Decorator — vấn đề game cụ thể và mẫu giải.',
  [[
    `<span class="eyebrow">AGU301 · Chapter 2 · Lesson 2.1</span>
<h2>Advanced design patterns</h2>
<h3>Command — actions as objects</h3>
<pre><code class="language-csharp">public interface ICommand { void Execute(); void Undo(); }

public class MoveCommand : ICommand {
    Transform t; Vector3 delta;
    public MoveCommand(Transform t, Vector3 d) { this.t = t; delta = d; }
    public void Execute() =&gt; t.position += delta;
    public void Undo()    =&gt; t.position -= delta;
}
// Store executed commands in a stack -&gt; free undo/redo, replays, input rebinding
</code></pre>
<h3>Strategy — swap an algorithm at runtime</h3>
<pre><code class="language-csharp">public interface IAttackStrategy { void Attack(); }
class MeleeAttack : IAttackStrategy { public void Attack() =&gt; /* swing */; }
class RangedAttack : IAttackStrategy { public void Attack() =&gt; /* shoot */; }

class Enemy { public IAttackStrategy strategy; void DoAttack() =&gt; strategy.Attack(); }
// change enemy.strategy to switch behaviour without touching Enemy
</code></pre>
<h3>The others</h3>
<ul>
<li><strong>Factory</strong> — a method that creates objects, so creation logic lives in one place (spawn the right enemy by difficulty).</li>
<li><strong>State</strong> — a state machine for character/AI behaviour (Chapter reference: PRU221m).</li>
<li><strong>Decorator</strong> — wrap an object to add behaviour (a weapon + fire damage + poison, stacked without subclass explosion).</li>
</ul>
<div class="callout"><span class="badge">Use with judgment</span> Patterns are tools, not trophies. Reach for Command when you need undo/replays, Strategy when behaviour must swap at runtime, Factory when creation gets complex — not because a checklist says so.</div>`,
    `<span class="eyebrow">AGU301 · Chương 2 · Bài 2.1</span>
<h2>Design pattern nâng cao</h2>
<h3>Command — hành động là đối tượng</h3>
<pre><code class="language-csharp">public interface ICommand { void Execute(); void Undo(); }

public class MoveCommand : ICommand {
    Transform t; Vector3 delta;
    public MoveCommand(Transform t, Vector3 d) { this.t = t; delta = d; }
    public void Execute() =&gt; t.position += delta;
    public void Undo()    =&gt; t.position -= delta;
}
// Lưu các command đã chạy vào stack -&gt; undo/redo, replay, đổi phím miễn phí
</code></pre>
<h3>Strategy — đổi thuật toán lúc chạy</h3>
<pre><code class="language-csharp">public interface IAttackStrategy { void Attack(); }
class MeleeAttack : IAttackStrategy { public void Attack() =&gt; /* chém */; }
class RangedAttack : IAttackStrategy { public void Attack() =&gt; /* bắn */; }

class Enemy { public IAttackStrategy strategy; void DoAttack() =&gt; strategy.Attack(); }
// đổi enemy.strategy để đổi hành vi mà không đụng vào Enemy
</code></pre>
<h3>Những cái khác</h3>
<ul>
<li><strong>Factory</strong> — một method tạo đối tượng, để logic tạo nằm một chỗ (spawn đúng kẻ địch theo độ khó).</li>
<li><strong>State</strong> — máy trạng thái cho hành vi nhân vật/AI (tham chiếu: PRU221m).</li>
<li><strong>Decorator</strong> — bọc một đối tượng để thêm hành vi (vũ khí + sát thương lửa + độc, chồng lên nhau mà không nổ số lớp con).</li>
</ul>
<div class="callout"><span class="badge">Dùng có suy xét</span> Pattern là công cụ, không phải cúp. Dùng Command khi cần undo/replay, Strategy khi hành vi phải đổi lúc chạy, Factory khi việc tạo phức tạp — không phải vì một danh sách bảo thế.</div>`,
  ]]);

const c2q = quiz('agu301-quiz-2', 'Quiz 2 — Patterns|||Quiz 2 — Pattern', [
  { id: 'q1', question: 'Cần undo/redo, replay, đổi phím điều khiển nên dùng pattern?', options: ['Command (hành động là đối tượng)', 'Singleton', 'Factory', 'Decorator'], correctIndex: 0, explanation: 'Command đóng gói hành động + Undo, lưu vào stack.' },
  { id: 'q2', question: 'Đổi cách tấn công (melee/ranged) lúc chạy mà không sửa lớp Enemy dùng?', options: ['State', 'Strategy (đổi thuật toán runtime)', 'Singleton', 'Command'], correctIndex: 1, explanation: 'Strategy cho phép hoán đổi thuật toán qua interface.' },
  { id: 'q3', question: 'Thêm hiệu ứng (lửa+độc) chồng lên vũ khí mà tránh nổ số lớp con dùng?', options: ['Decorator (bọc thêm hành vi)', 'Factory', 'Singleton', 'SRP'], correctIndex: 0, explanation: 'Decorator bọc đối tượng để thêm hành vi linh hoạt.' },
]);

const c3 = doc('agu301-3-1-networking-performance', '3.1 — Multiplayer & performance|||3.1 — Multiplayer & hiệu năng',
  'Unity Netcode (server-authoritative, NetworkVariable, RPC), Relay/matchmaking; và tối ưu: profiler, ngân sách khung, giảm GC/draw call, object pooling.',
  [[
    `<span class="eyebrow">AGU301 · Chapter 3 · Lesson 3.1</span>
<h2>Multiplayer &amp; performance</h2>
<h3>Networking with Unity Netcode</h3>
<p><strong>Netcode for GameObjects</strong> lets multiple players share a game state. Key ideas:</p>
<ul>
<li><strong>Server-authoritative</strong> — the server owns the truth; clients send inputs, the server decides outcomes (prevents cheating).</li>
<li><strong>NetworkVariable</strong> — a value automatically synced to all clients (health, position).</li>
<li><strong>RPC</strong> (Remote Procedure Call) — call a method on the server (<code>ServerRpc</code>) or on clients (<code>ClientRpc</code>).</li>
<li><strong>Relay</strong> — Unity's service to connect players behind NAT/firewalls without a dedicated server IP.</li>
</ul>
<h3>Performance — respect the frame budget</h3>
<p>At 60 fps you have <strong>~16.6 ms per frame</strong> for everything. Blow it and the game stutters. Use the <strong>Unity Profiler</strong> to find the real cost, then:</p>
<ul>
<li>Avoid per-frame allocations (they trigger <strong>GC spikes</strong>) — cache, and use <strong>object pooling</strong> instead of Instantiate/Destroy.</li>
<li>Cache <code>GetComponent</code> in <code>Start</code>, never in <code>Update</code>.</li>
<li>Reduce <strong>draw calls</strong> (batching, atlases); keep physics/AI updates at sensible rates (not everything every frame).</li>
</ul>
<div class="callout"><span class="badge">Golden rule</span> Measure, don't guess. Optimize what the Profiler shows is slow — premature optimization wastes time on code that was never the bottleneck.</div>`,
    `<span class="eyebrow">AGU301 · Chương 3 · Bài 3.1</span>
<h2>Multiplayer &amp; hiệu năng</h2>
<h3>Mạng với Unity Netcode</h3>
<p><strong>Netcode for GameObjects</strong> cho nhiều người chơi chung một trạng thái game. Ý chính:</p>
<ul>
<li><strong>Server-authoritative</strong> — máy chủ giữ sự thật; client gửi input, server quyết kết quả (chống gian lận).</li>
<li><strong>NetworkVariable</strong> — một giá trị tự đồng bộ tới mọi client (máu, vị trí).</li>
<li><strong>RPC</strong> (gọi thủ tục từ xa) — gọi method trên server (<code>ServerRpc</code>) hoặc trên client (<code>ClientRpc</code>).</li>
<li><strong>Relay</strong> — dịch vụ của Unity nối người chơi sau NAT/tường lửa mà không cần IP máy chủ riêng.</li>
</ul>
<h3>Hiệu năng — tôn trọng ngân sách khung</h3>
<p>Ở 60 fps bạn có <strong>~16,6 ms mỗi khung</strong> cho tất cả. Vượt là game giật. Dùng <strong>Unity Profiler</strong> để tìm chi phí thật, rồi:</p>
<ul>
<li>Tránh cấp phát mỗi khung (gây <strong>GC giật</strong>) — cache, và dùng <strong>object pooling</strong> thay vì Instantiate/Destroy.</li>
<li>Cache <code>GetComponent</code> trong <code>Start</code>, không bao giờ trong <code>Update</code>.</li>
<li>Giảm <strong>draw call</strong> (batching, atlas); cập nhật vật lý/AI ở nhịp hợp lý (không mọi thứ mỗi khung).</li>
</ul>
<div class="callout"><span class="badge">Quy tắc vàng</span> Đo, đừng đoán. Tối ưu thứ Profiler cho thấy chậm — tối ưu sớm phí công vào mã vốn không phải nút cổ chai.</div>`,
  ]]);

const c3q = quiz('agu301-quiz-3', 'Quiz 3 — Networking & performance|||Quiz 3 — Mạng & hiệu năng', [
  { id: 'q1', question: 'Chống gian lận trong multiplayer bằng mô hình?', options: ['Client quyết mọi thứ', 'Server-authoritative (máy chủ giữ sự thật)', 'Không cần server', 'P2P không kiểm'], correctIndex: 1, explanation: 'Server-authoritative: server quyết kết quả từ input client.' },
  { id: 'q2', question: 'Ở 60 fps, ngân sách mỗi khung hình khoảng?', options: ['1 giây', '~16,6 ms', '100 ms', 'Không giới hạn'], correctIndex: 1, explanation: '1000ms/60 ≈ 16,6ms; vượt là giật.' },
  { id: 'q3', question: 'Cách đúng để quyết định tối ưu chỗ nào?', options: ['Đoán rồi sửa', 'Đo bằng Profiler rồi tối ưu chỗ thật sự chậm', 'Tối ưu mọi dòng', 'Xoá tính năng'], correctIndex: 1, explanation: 'Đo trước; tránh tối ưu sớm.' },
]);

const taiLieu = doc('agu301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">AGU301 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for professional Unity development: the official syllabus &amp; slides, books, free official docs, video channels, tools, and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official AGU301 syllabus and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://gameprogrammingpatterns.com/" target="_blank" rel="noopener">Game Programming Patterns</a> — Robert Nystrom: patterns for game code (free to read online).</li>
<li><a href="https://www.packtpub.com/en-us/product/hands-on-game-development-patterns-with-unity-2021-9781800200814" target="_blank" rel="noopener">Hands-On Game Development Patterns with Unity 2021</a> — David Baron, Packt.</li>
</ul>
<h3>🌐 Free official docs</h3>
<ul>
<li><a href="https://docs.unity3d.com/Manual/index.html" target="_blank" rel="noopener">Unity Manual</a> — engine internals, scripting, performance.</li>
<li><a href="https://docs-multiplayer.unity3d.com/" target="_blank" rel="noopener">Unity Netcode for GameObjects</a> — official multiplayer docs.</li>
<li><a href="https://learn.unity.com/" target="_blank" rel="noopener">Unity Learn</a> — free official tutorials &amp; pathways.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Tarodev" target="_blank" rel="noopener">Tarodev</a> — clean architecture &amp; patterns in Unity.</li>
<li><a href="https://www.youtube.com/@Jasonaweimann" target="_blank" rel="noopener">Jason Weimann</a> — SOLID, patterns, multiplayer.</li>
<li><a href="https://www.youtube.com/@unity" target="_blank" rel="noopener">Unity</a> — the official channel.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://unity.com/download" target="_blank" rel="noopener">Unity Hub + Editor</a> — with the Netcode for GameObjects package.</li>
<li><a href="https://docs.unity3d.com/Manual/Profiler.html" target="_blank" rel="noopener">Unity Profiler</a> — measure frame budget, GC, draw calls.</li>
<li><a href="https://www.jetbrains.com/rider/" target="_blank" rel="noopener">JetBrains Rider / Visual Studio</a> — refactoring-grade C# IDE.</li>
<li><a href="https://git-scm.com/" target="_blank" rel="noopener">Git</a> — version control for larger projects.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — SOLID and the core patterns, following the lessons here.</li>
<li><strong>Practice on a project</strong> — refactor a small game to apply one pattern (Command, State) cleanly.</li>
<li><strong>Go deeper</strong> — add multiplayer with Netcode/Relay and profile the frame budget under load.</li>
<li><strong>Job-ready</strong> — ship one performant, well-architected game and document your design choices.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">AGU301 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để phát triển Unity chuyên nghiệp: giáo trình &amp; slide chính thức, sách, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của AGU301.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://gameprogrammingpatterns.com/" target="_blank" rel="noopener">Game Programming Patterns</a> — Robert Nystrom: mẫu thiết kế cho code game (đọc online miễn phí).</li>
<li><a href="https://www.packtpub.com/en-us/product/hands-on-game-development-patterns-with-unity-2021-9781800200814" target="_blank" rel="noopener">Hands-On Game Development Patterns with Unity 2021</a> — David Baron, Packt.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://docs.unity3d.com/Manual/index.html" target="_blank" rel="noopener">Unity Manual</a> — nội bộ engine, script, hiệu năng.</li>
<li><a href="https://docs-multiplayer.unity3d.com/" target="_blank" rel="noopener">Unity Netcode for GameObjects</a> — tài liệu multiplayer chính thức.</li>
<li><a href="https://learn.unity.com/" target="_blank" rel="noopener">Unity Learn</a> — hướng dẫn &amp; lộ trình chính thức, miễn phí.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Tarodev" target="_blank" rel="noopener">Tarodev</a> — kiến trúc sạch &amp; pattern trong Unity.</li>
<li><a href="https://www.youtube.com/@Jasonaweimann" target="_blank" rel="noopener">Jason Weimann</a> — SOLID, pattern, multiplayer.</li>
<li><a href="https://www.youtube.com/@unity" target="_blank" rel="noopener">Unity</a> — kênh chính thức.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://unity.com/download" target="_blank" rel="noopener">Unity Hub + Editor</a> — kèm gói Netcode for GameObjects.</li>
<li><a href="https://docs.unity3d.com/Manual/Profiler.html" target="_blank" rel="noopener">Unity Profiler</a> — đo ngân sách khung, GC, draw call.</li>
<li><a href="https://www.jetbrains.com/rider/" target="_blank" rel="noopener">JetBrains Rider / Visual Studio</a> — IDE C# mạnh về refactor.</li>
<li><a href="https://git-scm.com/" target="_blank" rel="noopener">Git</a> — quản lý phiên bản cho dự án lớn.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — SOLID và các pattern cốt lõi, theo đúng các bài ở đây.</li>
<li><strong>Luyện qua project</strong> — refactor một game nhỏ để áp một pattern (Command, State) cho gọn.</li>
<li><strong>Đào sâu</strong> — thêm multiplayer bằng Netcode/Relay và profile ngân sách khung khi tải nặng.</li>
<li><strong>Sẵn sàng đi làm</strong> — hoàn thiện một game hiệu năng tốt, kiến trúc rõ và ghi lại lựa chọn thiết kế.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'AGU301',
    slug: 'agu301-advanced-game-development',
    title: 'Advanced Game Development',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/AGU301.webp',
    shortDescription: 'Professional Unity — SOLID principles, advanced design patterns (Command/Strategy/Factory/Decorator/State), multiplayer with Netcode/Relay, and performance optimization. Bilingual, with C# & quizzes.|||Unity chuyên nghiệp — nguyên tắc SOLID, design pattern nâng cao (Command/Strategy/Factory/Decorator/State), multiplayer với Netcode/Relay, và tối ưu hiệu năng. Song ngữ, có C# & quiz.',
    description: 'Môn <strong>AGU301 — Advanced Game Development</strong> (kỳ 7), nối tiếp PRU221m/FGU301, nâng từ "game chạy được" lên "chuyên nghiệp, hiệu năng cao". Gồm <strong>SOLID</strong> (5 nguyên tắc cho mã module) → <strong>design pattern nâng cao</strong> (Command, Strategy, Factory, State, Decorator) → <strong>multiplayer</strong> (Unity Netcode: server-authoritative, NetworkVariable, RPC, Relay) → <strong>tối ưu hiệu năng</strong> (Profiler, ngân sách khung, GC/draw call, pooling). Bám giáo trình FLM, song ngữ, code C# và quiz mỗi chương.',
    whatYouLearn: 'SOLID (SRP/OCP/LSP/ISP/DIP) áp vào code Unity; design pattern Command (undo/rebind), Strategy (đổi AI runtime), Factory, State, Decorator; Unity Netcode (server-authoritative, NetworkVariable, ServerRpc/ClientRpc, Relay); tối ưu hiệu năng (đo bằng Profiler, ngân sách 16,6ms, tránh GC spike, cache GetComponent, object pooling, giảm draw call).',
    requirements: 'Đã học PRU221m/FGU301 hoặc thành thạo C# + Unity cơ bản. Cần Unity + gói Netcode for GameObjects.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Từ chạy được tới chuyên nghiệp.', lessons: [intro] },
    { title: 'Chương 1 — SOLID|||Chapter 1 — SOLID principles', description: '5 nguyên tắc cho mã sạch.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Design pattern nâng cao|||Chapter 2 — Advanced patterns', description: 'Command/Strategy/Factory/State/Decorator.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Multiplayer & hiệu năng|||Chapter 3 — Networking & performance', description: 'Netcode/Relay, Profiler, tối ưu.', lessons: [c3, c3q] },
  ],
};
