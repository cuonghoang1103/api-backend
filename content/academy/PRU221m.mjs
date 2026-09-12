/**
 * PRU221m — Object-Oriented Programming for Unity Games. Giáo trình FLM (syl):
 * nối tiếp PRU211m — C# nâng cao trong Unity: file I/O, kế thừa/đa hình, event
 * handling, cấu trúc dữ liệu & design pattern. Song ngữ, code C# thật + bài tập.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ code: KHÔNG backtick, KHÔNG ${ }; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('pru221m-0-1-overview', 'Course overview: OOP for Unity|||Tổng quan: OOP cho Unity',
  'Vì sao OOP nâng cao quan trọng trong game, nối tiếp PRU211m; lộ trình: kế thừa/đa hình → file I/O → event → cấu trúc dữ liệu → design pattern.',
  [[
    `<span class="eyebrow">PRU221m · Lesson 0.1 · Overview</span>
<h2>Object-Oriented Programming for Unity Games</h2>
<p class="lead">This course builds on your foundational C#/Unity knowledge (PRU211m) to write <strong>more robust games with better object-oriented designs</strong>: file input/output, inheritance and polymorphism, event handling, data structures, and design patterns.</p>
<p>These ideas aren't game-only — data structures and design patterns span <em>all</em> software (a web app in ASP.NET, a tool in WinForms). You'll learn them in the game domain but carry them everywhere.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Inheritance &amp; polymorphism</strong> — model families of game entities cleanly</li>
<li><strong>File I/O</strong> — save/load game data (JSON, PlayerPrefs)</li>
<li><strong>Event handling</strong> — decouple systems with C# events / UnityEvents</li>
<li><strong>Data structures</strong> — pick the right collection for the job</li>
<li><strong>Design patterns</strong> — Singleton, Observer, State, Object Pool in Unity</li>
</ul>
<div class="callout"><span class="badge">Prerequisite</span> PRU211m (C# for Unity basics). Bilingual, with C# examples in a Unity (MonoBehaviour) context and exercises.</div>`,
    `<span class="eyebrow">PRU221m · Bài 0.1 · Tổng quan</span>
<h2>Lập trình hướng đối tượng cho game Unity</h2>
<p class="lead">Môn này nối tiếp nền C#/Unity (PRU211m) để viết <strong>game bền hơn với thiết kế hướng đối tượng tốt hơn</strong>: đọc/ghi file, kế thừa và đa hình, xử lý sự kiện, cấu trúc dữ liệu, và design pattern.</p>
<p>Những ý này không chỉ dành cho game — cấu trúc dữ liệu và design pattern trải khắp <em>mọi</em> phần mềm (web ASP.NET, công cụ WinForms). Bạn học trong bối cảnh game nhưng mang đi khắp nơi.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Kế thừa &amp; đa hình</strong> — mô hình hoá các họ thực thể game gọn gàng</li>
<li><strong>File I/O</strong> — lưu/tải dữ liệu game (JSON, PlayerPrefs)</li>
<li><strong>Xử lý sự kiện</strong> — tách rời các hệ thống bằng C# event / UnityEvent</li>
<li><strong>Cấu trúc dữ liệu</strong> — chọn đúng collection cho từng việc</li>
<li><strong>Design pattern</strong> — Singleton, Observer, State, Object Pool trong Unity</li>
</ul>
<div class="callout"><span class="badge">Điều kiện</span> PRU211m (C# cho Unity cơ bản). Song ngữ, ví dụ C# trong bối cảnh Unity (MonoBehaviour) và bài tập.</div>`,
  ]]);

const c1 = doc('pru221m-1-1-inheritance-polymorphism', '1.1 — Inheritance & polymorphism|||1.1 — Kế thừa & đa hình',
  'Lớp cha/con, virtual/override, abstract class & interface trong Unity; đa hình để xử lý nhiều loại kẻ địch bằng một danh sách.',
  [[
    `<span class="eyebrow">PRU221m · Chapter 1 · Lesson 1.1</span>
<h2>Inheritance &amp; polymorphism</h2>
<h3>A family of enemies</h3>
<pre><code class="language-csharp">public abstract class Enemy : MonoBehaviour {
    public int health = 100;
    public abstract void Attack();          // each enemy must define
    public virtual void TakeDamage(int dmg) // shared, overridable
    {
        health -= dmg;
        if (health &lt;= 0) Destroy(gameObject);
    }
}

public class Zombie : Enemy {
    public override void Attack() =&gt; Debug.Log("Bite!");
}
public class Archer : Enemy {
    public override void Attack() =&gt; Debug.Log("Shoot arrow");
    public override void TakeDamage(int dmg) =&gt; base.TakeDamage(dmg * 2); // fragile
}
</code></pre>
<h3>Why polymorphism pays off</h3>
<pre><code class="language-csharp">List&lt;Enemy&gt; enemies = FindObjectsOfType&lt;Enemy&gt;().ToList();
foreach (Enemy e in enemies) e.Attack();   // each runs ITS OWN Attack
</code></pre>
<p><strong>Polymorphism</strong> lets one loop drive many types — the runtime calls the right <code>Attack()</code> for each object. Use <strong>abstract</strong> for a method every subclass must implement, <strong>virtual</strong> for a default a subclass may override, and <strong>interface</strong> (e.g. <code>IDamageable</code>) when unrelated classes share a capability.</p>`,
    `<span class="eyebrow">PRU221m · Chương 1 · Bài 1.1</span>
<h2>Kế thừa &amp; đa hình</h2>
<h3>Một họ kẻ địch</h3>
<pre><code class="language-csharp">public abstract class Enemy : MonoBehaviour {
    public int health = 100;
    public abstract void Attack();          // mỗi kẻ địch phải định nghĩa
    public virtual void TakeDamage(int dmg) // dùng chung, ghi đè được
    {
        health -= dmg;
        if (health &lt;= 0) Destroy(gameObject);
    }
}

public class Zombie : Enemy {
    public override void Attack() =&gt; Debug.Log("Bite!");
}
public class Archer : Enemy {
    public override void Attack() =&gt; Debug.Log("Shoot arrow");
    public override void TakeDamage(int dmg) =&gt; base.TakeDamage(dmg * 2);
}
</code></pre>
<h3>Vì sao đa hình đáng giá</h3>
<pre><code class="language-csharp">List&lt;Enemy&gt; enemies = FindObjectsOfType&lt;Enemy&gt;().ToList();
foreach (Enemy e in enemies) e.Attack();   // mỗi cái chạy Attack CỦA NÓ
</code></pre>
<p><strong>Đa hình</strong> cho một vòng lặp điều khiển nhiều loại — runtime gọi đúng <code>Attack()</code> cho từng đối tượng. Dùng <strong>abstract</strong> cho method mọi lớp con phải hiện thực, <strong>virtual</strong> cho bản mặc định lớp con có thể ghi đè, và <strong>interface</strong> (vd <code>IDamageable</code>) khi các lớp không liên quan chia sẻ một khả năng.</p>`,
  ]]);

const c1q = quiz('pru221m-quiz-1', 'Quiz 1 — Inheritance & polymorphism|||Quiz 1 — Kế thừa & đa hình', [
  { id: 'q1', question: 'Method mà MỌI lớp con bắt buộc phải hiện thực nên khai?', options: ['virtual', 'abstract', 'private', 'static'], correctIndex: 1, explanation: 'abstract không có thân, buộc lớp con override.' },
  { id: 'q2', question: 'foreach(Enemy e in list) e.Attack() gọi đúng Attack của từng loại nhờ?', options: ['Kế thừa đơn thuần', 'Đa hình (polymorphism)', 'static', 'overload'], correctIndex: 1, explanation: 'Đa hình: runtime chọn override phù hợp với kiểu thật.' },
  { id: 'q3', question: 'Các lớp KHÔNG liên quan cùng có khả năng "bị gây sát thương" nên dùng?', options: ['Kế thừa chung một lớp cha', 'Interface (vd IDamageable)', 'Copy code', 'static class'], correctIndex: 1, explanation: 'Interface mô tả khả năng chung mà không cần cùng cây kế thừa.' },
]);

const c2 = doc('pru221m-2-1-fileio-events', '2.1 — File I/O & event handling|||2.1 — File I/O & xử lý sự kiện',
  'Lưu/tải game bằng JSON (JsonUtility) & PlayerPrefs; C# event/delegate & UnityEvent để tách rời hệ thống (vd điểm số nghe sự kiện "kẻ địch chết").',
  [[
    `<span class="eyebrow">PRU221m · Chapter 2 · Lesson 2.1</span>
<h2>File I/O &amp; event handling</h2>
<h3>Saving &amp; loading</h3>
<pre><code class="language-csharp">[System.Serializable]
public class SaveData { public int level; public int score; }

// Save as JSON to disk
string json = JsonUtility.ToJson(new SaveData { level = 3, score = 900 });
File.WriteAllText(Application.persistentDataPath + "/save.json", json);

// Load
var data = JsonUtility.FromJson&lt;SaveData&gt;(
    File.ReadAllText(Application.persistentDataPath + "/save.json"));
</code></pre>
<p>Use <code>Application.persistentDataPath</code> (a writable folder per platform). For a couple of values, <code>PlayerPrefs.SetInt("hi", 900)</code> is enough; for structured saves, serialize to JSON.</p>
<h3>Events — decoupling systems</h3>
<pre><code class="language-csharp">public class Enemy : MonoBehaviour {
    public static event System.Action&lt;int&gt; OnDied;   // broadcasts points
    void Die() { OnDied?.Invoke(50); Destroy(gameObject); }
}

public class ScoreUI : MonoBehaviour {
    void OnEnable()  =&gt; Enemy.OnDied += AddScore;
    void OnDisable() =&gt; Enemy.OnDied -= AddScore;    // ALWAYS unsubscribe
    void AddScore(int pts) { /* update score */ }
}
</code></pre>
<p>An <strong>event</strong> lets a publisher (Enemy) notify subscribers (ScoreUI, SoundManager) <em>without knowing who they are</em>. This keeps systems independent. Rule: subscribe in <code>OnEnable</code>, <strong>unsubscribe in OnDisable</strong> — a dangling subscription to a destroyed object leaks and crashes.</p>`,
    `<span class="eyebrow">PRU221m · Chương 2 · Bài 2.1</span>
<h2>File I/O &amp; xử lý sự kiện</h2>
<h3>Lưu &amp; tải</h3>
<pre><code class="language-csharp">[System.Serializable]
public class SaveData { public int level; public int score; }

// Lưu JSON ra đĩa
string json = JsonUtility.ToJson(new SaveData { level = 3, score = 900 });
File.WriteAllText(Application.persistentDataPath + "/save.json", json);

// Tải
var data = JsonUtility.FromJson&lt;SaveData&gt;(
    File.ReadAllText(Application.persistentDataPath + "/save.json"));
</code></pre>
<p>Dùng <code>Application.persistentDataPath</code> (thư mục ghi được theo từng nền tảng). Vài giá trị thì <code>PlayerPrefs.SetInt("hi", 900)</code> là đủ; lưu có cấu trúc thì tuần tự hoá sang JSON.</p>
<h3>Sự kiện — tách rời hệ thống</h3>
<pre><code class="language-csharp">public class Enemy : MonoBehaviour {
    public static event System.Action&lt;int&gt; OnDied;   // phát điểm
    void Die() { OnDied?.Invoke(50); Destroy(gameObject); }
}

public class ScoreUI : MonoBehaviour {
    void OnEnable()  =&gt; Enemy.OnDied += AddScore;
    void OnDisable() =&gt; Enemy.OnDied -= AddScore;    // LUÔN huỷ đăng ký
    void AddScore(int pts) { /* cập nhật điểm */ }
}
</code></pre>
<p>Một <strong>event</strong> cho bên phát (Enemy) báo cho bên nghe (ScoreUI, SoundManager) <em>mà không cần biết họ là ai</em>. Nhờ đó các hệ thống độc lập. Quy tắc: đăng ký ở <code>OnEnable</code>, <strong>huỷ ở OnDisable</strong> — đăng ký treo vào đối tượng đã huỷ sẽ rò rỉ và gây lỗi.</p>`,
  ]]);

const c2q = quiz('pru221m-quiz-2', 'Quiz 2 — File I/O & events|||Quiz 2 — File I/O & sự kiện', [
  { id: 'q1', question: 'Lưu dữ liệu game có cấu trúc ra đĩa trong Unity nên?', options: ['Ghi thẳng biến vào RAM', 'Tuần tự hoá JSON (JsonUtility) vào persistentDataPath', 'Không lưu được', 'In ra Console'], correctIndex: 1, explanation: 'JsonUtility + persistentDataPath cho save có cấu trúc.' },
  { id: 'q2', question: 'Sau khi đăng ký sự kiện ở OnEnable, phải làm gì ở OnDisable?', options: ['Đăng ký lại', 'HUỶ đăng ký (-=)', 'Không làm gì', 'Destroy scene'], correctIndex: 1, explanation: 'Không huỷ đăng ký → rò rỉ, gọi vào object đã huỷ → lỗi.' },
  { id: 'q3', question: 'Lợi ích của dùng event giữa Enemy và ScoreUI?', options: ['Nhanh hơn CPU', 'Tách rời: bên phát không cần biết bên nghe', 'Bắt buộc của Unity', 'Giảm dung lượng'], correctIndex: 1, explanation: 'Event giúp hệ thống độc lập, dễ mở rộng.' },
]);

const c3 = doc('pru221m-3-1-data-structures', '3.1 — Data structures in games|||3.1 — Cấu trúc dữ liệu trong game',
  'Chọn collection: List (thứ tự), Dictionary (tra theo key nhanh), HashSet, Queue (spawn/hàng đợi), Stack; ứng dụng thực tế trong game.',
  [[
    `<span class="eyebrow">PRU221m · Chapter 3 · Lesson 3.1</span>
<h2>Data structures — picking the right collection</h2>
<table><thead><tr><th>Collection</th><th>Best for</th><th>Lookup</th></tr></thead><tbody>
<tr><td><code>List&lt;T&gt;</code></td><td>ordered items, iterate all (enemies, inventory)</td><td>O(n)</td></tr>
<tr><td><code>Dictionary&lt;K,V&gt;</code></td><td>look up by key (itemId → Item, player → score)</td><td>O(1) avg</td></tr>
<tr><td><code>HashSet&lt;T&gt;</code></td><td>unique membership ("has this tile been visited?")</td><td>O(1) avg</td></tr>
<tr><td><code>Queue&lt;T&gt;</code></td><td>FIFO — spawn waves, message queue</td><td>—</td></tr>
<tr><td><code>Stack&lt;T&gt;</code></td><td>LIFO — undo, backtracking</td><td>—</td></tr>
</tbody></table>
<pre><code class="language-csharp">// Fast lookup by id instead of scanning a List every frame
Dictionary&lt;int, Item&gt; items = new();
items[42] = new Item("Sword");
if (items.TryGetValue(42, out Item it)) Use(it);   // O(1)

// Spawn enemies in waves
Queue&lt;Enemy&gt; spawnQueue = new();
spawnQueue.Enqueue(zombie);
Enemy next = spawnQueue.Dequeue();                  // FIFO
</code></pre>
<p><strong>The wrong structure costs frames.</strong> Searching a <code>List</code> by id every update is O(n); a <code>Dictionary</code> makes it O(1). In a game running 60 times per second, that difference is the gap between smooth and stuttering.</p>`,
    `<span class="eyebrow">PRU221m · Chương 3 · Bài 3.1</span>
<h2>Cấu trúc dữ liệu — chọn đúng collection</h2>
<table><thead><tr><th>Collection</th><th>Hợp cho</th><th>Tra cứu</th></tr></thead><tbody>
<tr><td><code>List&lt;T&gt;</code></td><td>phần tử có thứ tự, duyệt hết (kẻ địch, túi đồ)</td><td>O(n)</td></tr>
<tr><td><code>Dictionary&lt;K,V&gt;</code></td><td>tra theo key (itemId → Item, player → điểm)</td><td>O(1) TB</td></tr>
<tr><td><code>HashSet&lt;T&gt;</code></td><td>thành viên duy nhất ("ô này đã thăm chưa?")</td><td>O(1) TB</td></tr>
<tr><td><code>Queue&lt;T&gt;</code></td><td>FIFO — spawn theo đợt, hàng đợi tin</td><td>—</td></tr>
<tr><td><code>Stack&lt;T&gt;</code></td><td>LIFO — undo, quay lui</td><td>—</td></tr>
</tbody></table>
<pre><code class="language-csharp">// Tra nhanh theo id thay vì quét List mỗi khung
Dictionary&lt;int, Item&gt; items = new();
items[42] = new Item("Sword");
if (items.TryGetValue(42, out Item it)) Use(it);   // O(1)

// Spawn kẻ địch theo đợt
Queue&lt;Enemy&gt; spawnQueue = new();
spawnQueue.Enqueue(zombie);
Enemy next = spawnQueue.Dequeue();                  // FIFO
</code></pre>
<p><strong>Chọn sai cấu trúc là mất khung hình.</strong> Quét một <code>List</code> theo id mỗi update là O(n); <code>Dictionary</code> đưa về O(1). Trong game chạy 60 lần/giây, khác biệt đó là ranh giới giữa mượt và giật.</p>`,
  ]]);

const c3q = quiz('pru221m-quiz-3', 'Quiz 3 — Data structures|||Quiz 3 — Cấu trúc dữ liệu', [
  { id: 'q1', question: 'Tra nhanh Item theo itemId mỗi khung hình nên dùng?', options: ['List rồi quét', 'Dictionary<int,Item> (O(1))', 'Stack', 'string'], correctIndex: 1, explanation: 'Dictionary tra O(1); List là O(n) mỗi lần.' },
  { id: 'q2', question: 'Spawn kẻ địch lần lượt theo thứ tự vào trước ra trước dùng?', options: ['Stack (LIFO)', 'Queue (FIFO)', 'HashSet', 'Dictionary'], correctIndex: 1, explanation: 'Queue là FIFO, hợp hàng đợi spawn.' },
  { id: 'q3', question: 'Kiểm "ô này đã được thăm chưa" hiệu quả nhất?', options: ['List.Contains', 'HashSet (O(1))', 'Queue', 'Stack'], correctIndex: 1, explanation: 'HashSet cho kiểm thành viên duy nhất O(1) trung bình.' },
]);

const c4 = doc('pru221m-4-1-design-patterns', '4.1 — Design patterns in Unity|||4.1 — Design pattern trong Unity',
  'Singleton (GameManager), Observer (đã gặp qua event), State (máy trạng thái nhân vật), Object Pool (tái dùng đạn/kẻ địch) — vấn đề & giải pháp.',
  [[
    `<span class="eyebrow">PRU221m · Chapter 4 · Lesson 4.1</span>
<h2>Design patterns in Unity</h2>
<p>A <strong>design pattern</strong> is a reusable solution to a recurring problem. Four that appear in almost every game:</p>
<h3>1. Singleton — one global manager</h3>
<pre><code class="language-csharp">public class GameManager : MonoBehaviour {
    public static GameManager Instance { get; private set; }
    void Awake() {
        if (Instance != null) { Destroy(gameObject); return; }
        Instance = this; DontDestroyOnLoad(gameObject);
    }
}
// anywhere: GameManager.Instance.AddScore(10);
</code></pre>
<h3>2. Observer</h3>
<p>Publishers notify subscribers via events (Chapter 2) — the score UI reacts to "enemy died" without coupling.</p>
<h3>3. State — a state machine</h3>
<p>Model a character as states (Idle, Run, Attack, Dead) with clear transitions, instead of a tangle of booleans. Each state knows how to <code>Enter</code>, <code>Update</code>, <code>Exit</code>.</p>
<h3>4. Object Pool — reuse instead of create/destroy</h3>
<pre><code class="language-csharp">// Instantiating &amp; Destroying bullets every shot causes GC spikes.
// Pool: keep a Queue of inactive bullets, reuse them.
Bullet b = pool.Count &gt; 0 ? pool.Dequeue() : Instantiate(prefab);
b.gameObject.SetActive(true);
// on hit: b.gameObject.SetActive(false); pool.Enqueue(b);
</code></pre>
<div class="callout"><span class="badge">Why patterns</span> They give teammates a shared vocabulary and avoid reinventing fragile solutions. But don't force them — use a pattern when it removes real pain (GC spikes → Object Pool; boolean spaghetti → State), not for its own sake.</div>`,
    `<span class="eyebrow">PRU221m · Chương 4 · Bài 4.1</span>
<h2>Design pattern trong Unity</h2>
<p>Một <strong>design pattern</strong> là giải pháp tái dùng cho một vấn đề lặp lại. Bốn cái xuất hiện gần như trong mọi game:</p>
<h3>1. Singleton — một manager toàn cục</h3>
<pre><code class="language-csharp">public class GameManager : MonoBehaviour {
    public static GameManager Instance { get; private set; }
    void Awake() {
        if (Instance != null) { Destroy(gameObject); return; }
        Instance = this; DontDestroyOnLoad(gameObject);
    }
}
// bất cứ đâu: GameManager.Instance.AddScore(10);
</code></pre>
<h3>2. Observer</h3>
<p>Bên phát báo cho bên nghe qua event (Chương 2) — UI điểm phản ứng với "kẻ địch chết" mà không dính chặt.</p>
<h3>3. State — máy trạng thái</h3>
<p>Mô hình nhân vật bằng các trạng thái (Idle, Run, Attack, Dead) với chuyển tiếp rõ ràng, thay cho mớ boolean rối. Mỗi trạng thái biết cách <code>Enter</code>, <code>Update</code>, <code>Exit</code>.</p>
<h3>4. Object Pool — tái dùng thay vì tạo/huỷ</h3>
<pre><code class="language-csharp">// Instantiate &amp; Destroy đạn mỗi phát gây giật do GC.
// Pool: giữ một Queue đạn đang tắt, tái dùng.
Bullet b = pool.Count &gt; 0 ? pool.Dequeue() : Instantiate(prefab);
b.gameObject.SetActive(true);
// khi trúng: b.gameObject.SetActive(false); pool.Enqueue(b);
</code></pre>
<div class="callout"><span class="badge">Vì sao pattern</span> Chúng cho đồng đội một từ vựng chung và tránh phát minh lại giải pháp dễ vỡ. Nhưng đừng ép — dùng pattern khi nó gỡ đau thật (GC giật → Object Pool; rối boolean → State), không dùng cho có.</div>`,
  ]]);

const c4q = quiz('pru221m-quiz-4', 'Quiz 4 — Design patterns|||Quiz 4 — Design pattern', [
  { id: 'q1', question: 'Cần MỘT GameManager truy cập mọi nơi, tồn tại qua các scene dùng pattern?', options: ['Observer', 'Singleton', 'State', 'Object Pool'], correctIndex: 1, explanation: 'Singleton: một instance toàn cục (+DontDestroyOnLoad).' },
  { id: 'q2', question: 'Bắn đạn liên tục gây giật do Instantiate/Destroy nên dùng?', options: ['Singleton', 'Object Pool (tái dùng)', 'State', 'Interface'], correctIndex: 1, explanation: 'Object Pool tái dùng object, tránh GC spike.' },
  { id: 'q3', question: 'Thay mớ boolean điều khiển nhân vật (Idle/Run/Attack) bằng?', options: ['State pattern (máy trạng thái)', 'Nhiều if lồng', 'Singleton', 'Dictionary'], correctIndex: 0, explanation: 'State pattern: mỗi trạng thái Enter/Update/Exit rõ ràng.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'PRU221m',
    slug: 'pru221m-object-oriented-programming-for-unity-games',
    title: 'Object-Oriented Programming for Unity Games',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PRU221m.webp',
    shortDescription: 'Advanced C# OOP for Unity — inheritance & polymorphism, file I/O (JSON/PlayerPrefs), event handling, data structures and design patterns (Singleton/Observer/State/Object Pool). Bilingual, with Unity C# & quizzes.|||C# OOP nâng cao cho Unity — kế thừa & đa hình, file I/O (JSON/PlayerPrefs), xử lý sự kiện, cấu trúc dữ liệu và design pattern (Singleton/Observer/State/Object Pool). Song ngữ, có C# Unity & quiz.',
    description: 'Môn <strong>PRU221m — OOP for Unity Games</strong> (kỳ 8), nối tiếp PRU211m, nâng kỹ năng viết game <strong>bền hơn bằng thiết kế hướng đối tượng tốt hơn</strong>: <strong>kế thừa &amp; đa hình</strong> (abstract/virtual/interface, họ kẻ địch) → <strong>file I/O</strong> (lưu/tải JSON, PlayerPrefs) → <strong>xử lý sự kiện</strong> (C# event, tách rời hệ thống) → <strong>cấu trúc dữ liệu</strong> (List/Dictionary/HashSet/Queue/Stack và chi phí) → <strong>design pattern</strong> (Singleton, Observer, State, Object Pool). Bám giáo trình FLM, song ngữ, code C# trong bối cảnh Unity và quiz mỗi chương.',
    whatYouLearn: 'abstract/virtual/override & interface; đa hình qua danh sách kiểu cha; lưu/tải JSON (JsonUtility, persistentDataPath) & PlayerPrefs; C# event/delegate (đăng ký ở OnEnable, huỷ ở OnDisable); chọn collection đúng (List/Dictionary/HashSet/Queue/Stack) theo chi phí; design pattern Singleton/Observer/State/Object Pool và khi nào dùng.',
    requirements: 'Đã học PRU211m (C# cho Unity cơ bản) hoặc tương đương. Cần Unity + Visual Studio/Rider.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao OOP nâng cao trong game.', lessons: [intro] },
    { title: 'Chương 1 — Kế thừa & đa hình|||Chapter 1 — Inheritance & polymorphism', description: 'abstract/virtual/interface, họ thực thể.', lessons: [c1, c1q] },
    { title: 'Chương 2 — File I/O & sự kiện|||Chapter 2 — File I/O & events', description: 'JSON/PlayerPrefs, C# event.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Cấu trúc dữ liệu|||Chapter 3 — Data structures', description: 'List/Dictionary/HashSet/Queue/Stack.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Design pattern|||Chapter 4 — Design patterns', description: 'Singleton/Observer/State/Object Pool.', lessons: [c4, c4q] },
  ],
};
