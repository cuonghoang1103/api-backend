/**
 * FGU301 — Fundamental Game Development (Unity). Giáo trình FLM (syl): môi trường
 * Unity, game 3D (rendering/lighting/animation/physics), game object, UI. Song
 * ngữ, code C# MonoBehaviour thật + bài tập. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ code: KHÔNG backtick, KHÔNG ${ }; "\n" literal viết \\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('fgu301-0-1-overview', 'Course overview: Fundamental Game Dev|||Tổng quan: Phát triển game cơ bản',
  'Unity là gì, kiến trúc GameObject–Component, vòng đời MonoBehaviour; lộ trình: môi trường Unity → transform & script → physics → animation → UI & build.',
  [[
    `<span class="eyebrow">FGU301 · Lesson 0.1 · Overview</span>
<h2>Fundamental Game Development with Unity</h2>
<p class="lead">This course equips you to create engaging <strong>2D and 3D games in Unity</strong>. Building on C#, you'll learn the engine itself — the editor, GameObjects and components, physics, animation, and user interfaces — through hands-on labs.</p>
<h3>The core mental model: GameObject + Component</h3>
<p>Everything in a Unity scene is a <strong>GameObject</strong> (an empty container). What it <em>does</em> comes from the <strong>Components</strong> attached to it: a <code>Transform</code> (position/rotation/scale, always present), a <code>MeshRenderer</code> (looks), a <code>Rigidbody</code> (physics), a <code>Collider</code> (shape for collisions), and your own C# scripts (behaviour). <strong>Composition over inheritance</strong> — you build entities by combining components.</p>
<h3>Roadmap</h3>
<ul>
<li>The Unity editor: Scene, Hierarchy, Inspector, Project, Game view</li>
<li>Transform &amp; the MonoBehaviour lifecycle (scripting movement)</li>
<li>Physics: Rigidbody, Collider, triggers</li>
<li>Animation &amp; the Animator state machine</li>
<li>UI (Canvas), and building/running the game</li>
</ul>
<div class="callout"><span class="badge">Prerequisite</span> Basic C#. Bilingual, with C# scripts you can drop onto GameObjects, and exercises.</div>`,
    `<span class="eyebrow">FGU301 · Bài 0.1 · Tổng quan</span>
<h2>Phát triển game cơ bản với Unity</h2>
<p class="lead">Môn này trang bị để bạn tạo <strong>game 2D và 3D trong Unity</strong>. Dựa trên C#, bạn học chính cái engine — trình soạn, GameObject và component, vật lý, hoạt ảnh, và giao diện — qua các bài lab thực hành.</p>
<h3>Mô hình cốt lõi: GameObject + Component</h3>
<p>Mọi thứ trong scene Unity là một <strong>GameObject</strong> (hộp chứa rỗng). Nó <em>làm gì</em> đến từ các <strong>Component</strong> gắn vào: một <code>Transform</code> (vị trí/xoay/tỉ lệ, luôn có), một <code>MeshRenderer</code> (hình thức), một <code>Rigidbody</code> (vật lý), một <code>Collider</code> (hình để va chạm), và các script C# của bạn (hành vi). <strong>Ghép hơn kế thừa</strong> — bạn dựng thực thể bằng cách kết hợp component.</p>
<h3>Lộ trình</h3>
<ul>
<li>Trình soạn Unity: Scene, Hierarchy, Inspector, Project, Game view</li>
<li>Transform &amp; vòng đời MonoBehaviour (script chuyển động)</li>
<li>Vật lý: Rigidbody, Collider, trigger</li>
<li>Hoạt ảnh &amp; máy trạng thái Animator</li>
<li>UI (Canvas), và build/chạy game</li>
</ul>
<div class="callout"><span class="badge">Điều kiện</span> C# cơ bản. Song ngữ, có script C# thả vào GameObject, và bài tập.</div>`,
  ]]);

const c1 = doc('fgu301-1-1-editor-transform', '1.1 — The editor, transform & scripting|||1.1 — Trình soạn, transform & script',
  'Các cửa sổ Unity (Scene/Hierarchy/Inspector/Project), Transform (position/rotation/scale), vòng đời MonoBehaviour (Start/Update), di chuyển bằng Time.deltaTime.',
  [[
    `<span class="eyebrow">FGU301 · Chapter 1 · Lesson 1.1</span>
<h2>The editor, transform &amp; scripting</h2>
<h3>The Unity windows</h3>
<ul>
<li><strong>Hierarchy</strong> — every GameObject in the current scene.</li>
<li><strong>Scene</strong> — edit the world; <strong>Game</strong> — what the player sees.</li>
<li><strong>Inspector</strong> — the components of the selected object (tweak values here).</li>
<li><strong>Project</strong> — your assets (scripts, models, textures, prefabs).</li>
</ul>
<h3>Moving an object with a script</h3>
<pre><code class="language-csharp">using UnityEngine;
public class Mover : MonoBehaviour {
    public float speed = 5f;
    void Start() {                 // once, when the object wakes
        Debug.Log("Mover ready");
    }
    void Update() {                // every frame
        float h = Input.GetAxis("Horizontal");   // -1..1 (A/D, arrows)
        transform.Translate(Vector3.right * h * speed * Time.deltaTime);
    }
}
</code></pre>
<p><strong>Start()</strong> runs once; <strong>Update()</strong> runs every frame. Multiply movement by <strong>Time.deltaTime</strong> (seconds since last frame) so speed is the same on a 30fps phone and a 144fps PC — otherwise faster machines move faster. Change position via <code>transform</code>.</p>`,
    `<span class="eyebrow">FGU301 · Chương 1 · Bài 1.1</span>
<h2>Trình soạn, transform &amp; script</h2>
<h3>Các cửa sổ Unity</h3>
<ul>
<li><strong>Hierarchy</strong> — mọi GameObject trong scene hiện tại.</li>
<li><strong>Scene</strong> — sửa thế giới; <strong>Game</strong> — thứ người chơi thấy.</li>
<li><strong>Inspector</strong> — các component của object đang chọn (chỉnh giá trị ở đây).</li>
<li><strong>Project</strong> — tài nguyên (script, model, texture, prefab).</li>
</ul>
<h3>Di chuyển object bằng script</h3>
<pre><code class="language-csharp">using UnityEngine;
public class Mover : MonoBehaviour {
    public float speed = 5f;
    void Start() {                 // một lần, khi object thức
        Debug.Log("Mover ready");
    }
    void Update() {                // mỗi khung hình
        float h = Input.GetAxis("Horizontal");   // -1..1 (A/D, mũi tên)
        transform.Translate(Vector3.right * h * speed * Time.deltaTime);
    }
}
</code></pre>
<p><strong>Start()</strong> chạy một lần; <strong>Update()</strong> chạy mỗi khung hình. Nhân chuyển động với <strong>Time.deltaTime</strong> (giây từ khung trước) để tốc độ như nhau trên điện thoại 30fps và PC 144fps — nếu không, máy nhanh sẽ di chuyển nhanh hơn. Đổi vị trí qua <code>transform</code>.</p>`,
  ]]);

const c1q = quiz('fgu301-quiz-1', 'Quiz 1 — Editor & scripting|||Quiz 1 — Trình soạn & script', [
  { id: 'q1', question: 'Trong Unity, mọi thực thể là GameObject; hành vi/hình thức đến từ?', options: ['Chỉ Transform', 'Các Component gắn vào (composition)', 'Kế thừa nhiều tầng', 'File JSON'], correctIndex: 1, explanation: 'GameObject là hộp chứa; Component quyết định nó làm gì.' },
  { id: 'q2', question: 'Nhân chuyển động với Time.deltaTime để?', options: ['Chạy nhanh hơn', 'Tốc độ ổn định bất kể FPS', 'Tiết kiệm RAM', 'Bắt buộc của C#'], correctIndex: 1, explanation: 'deltaTime chuẩn hoá theo thời gian → độc lập tốc độ khung.' },
  { id: 'q3', question: 'Hàm chạy MỖI KHUNG HÌNH trong MonoBehaviour?', options: ['Start()', 'Awake()', 'Update()', 'OnDestroy()'], correctIndex: 2, explanation: 'Update() gọi mỗi khung; Start() một lần lúc đầu.' },
]);

const c2 = doc('fgu301-2-1-physics', '2.1 — Physics: Rigidbody & Collider|||2.1 — Vật lý: Rigidbody & Collider',
  'Rigidbody (trọng lực, lực), Collider (hình va chạm), va chạm vs trigger, callback OnCollisionEnter/OnTriggerEnter.',
  [[
    `<span class="eyebrow">FGU301 · Chapter 2 · Lesson 2.1</span>
<h2>Physics — Rigidbody &amp; Collider</h2>
<h3>Making things fall &amp; collide</h3>
<p>Add a <strong>Rigidbody</strong> to let Unity's physics engine move an object (gravity, forces, momentum). Add a <strong>Collider</strong> (Box/Sphere/Capsule/Mesh) to give it a shape that can hit things. Physics only happens when the moving object has a Rigidbody.</p>
<pre><code class="language-csharp">public class Jumper : MonoBehaviour {
    Rigidbody rb;
    void Start() =&gt; rb = GetComponent&lt;Rigidbody&gt;();
    void Update() {
        if (Input.GetKeyDown(KeyCode.Space))
            rb.AddForce(Vector3.up * 6f, ForceMode.Impulse);
    }
}
</code></pre>
<h3>Collision vs Trigger</h3>
<pre><code class="language-csharp">// Solid collision — objects bounce off each other
void OnCollisionEnter(Collision c) {
    if (c.gameObject.CompareTag("Enemy")) TakeDamage();
}
// Trigger — pass through, just detect (coins, checkpoints)
void OnTriggerEnter(Collider other) {
    if (other.CompareTag("Coin")) { Collect(); Destroy(other.gameObject); }
}
</code></pre>
<p>A normal <strong>collision</strong> makes objects push against each other. Tick a collider's <strong>Is Trigger</strong> and it becomes a pass-through zone that only <em>notifies</em> — perfect for pickups, checkpoints, and detection volumes.</p>`,
    `<span class="eyebrow">FGU301 · Chương 2 · Bài 2.1</span>
<h2>Vật lý — Rigidbody &amp; Collider</h2>
<h3>Cho vật rơi &amp; va chạm</h3>
<p>Thêm <strong>Rigidbody</strong> để engine vật lý của Unity điều khiển object (trọng lực, lực, quán tính). Thêm <strong>Collider</strong> (Box/Sphere/Capsule/Mesh) để nó có hình va chạm được. Vật lý chỉ xảy ra khi vật đang chuyển động có Rigidbody.</p>
<pre><code class="language-csharp">public class Jumper : MonoBehaviour {
    Rigidbody rb;
    void Start() =&gt; rb = GetComponent&lt;Rigidbody&gt;();
    void Update() {
        if (Input.GetKeyDown(KeyCode.Space))
            rb.AddForce(Vector3.up * 6f, ForceMode.Impulse);
    }
}
</code></pre>
<h3>Collision vs Trigger</h3>
<pre><code class="language-csharp">// Va chạm cứng — vật đẩy nhau
void OnCollisionEnter(Collision c) {
    if (c.gameObject.CompareTag("Enemy")) TakeDamage();
}
// Trigger — xuyên qua, chỉ phát hiện (coin, checkpoint)
void OnTriggerEnter(Collider other) {
    if (other.CompareTag("Coin")) { Collect(); Destroy(other.gameObject); }
}
</code></pre>
<p>Một <strong>va chạm</strong> thường làm vật đẩy nhau. Tích <strong>Is Trigger</strong> cho collider thì nó thành vùng xuyên qua chỉ <em>báo tin</em> — hoàn hảo cho vật phẩm, checkpoint, vùng phát hiện.</p>`,
  ]]);

const c2q = quiz('fgu301-quiz-2', 'Quiz 2 — Physics|||Quiz 2 — Vật lý', [
  { id: 'q1', question: 'Để engine vật lý điều khiển object (trọng lực/lực) cần thêm?', options: ['Chỉ Collider', 'Rigidbody', 'MeshRenderer', 'Canvas'], correctIndex: 1, explanation: 'Rigidbody đưa object vào mô phỏng vật lý.' },
  { id: 'q2', question: 'Nhặt coin (xuyên qua, chỉ phát hiện) nên dùng?', options: ['Va chạm cứng', 'Collider bật Is Trigger + OnTriggerEnter', 'Không collider', 'AddForce'], correctIndex: 1, explanation: 'Is Trigger cho vùng xuyên qua chỉ báo tin.' },
  { id: 'q3', question: 'Callback khi hai vật cứng chạm nhau?', options: ['OnTriggerEnter', 'OnCollisionEnter', 'Update', 'Start'], correctIndex: 1, explanation: 'OnCollisionEnter cho va chạm cứng; OnTriggerEnter cho trigger.' },
]);

const c3 = doc('fgu301-3-1-animation-ui', '3.1 — Animation & UI|||3.1 — Hoạt ảnh & UI',
  'Animator (clip + state machine + parameter/transition), điều khiển animation từ script; UI Canvas (Button/Text), bắt sự kiện nút.',
  [[
    `<span class="eyebrow">FGU301 · Chapter 3 · Lesson 3.1</span>
<h2>Animation &amp; UI</h2>
<h3>The Animator state machine</h3>
<p>Animation clips (Idle, Run, Jump) live in an <strong>Animator Controller</strong> — a state machine. States connect with <strong>transitions</strong> guarded by <strong>parameters</strong> (a bool <code>isRunning</code>, a trigger <code>jump</code>). Your script sets the parameters; the Animator handles blending.</p>
<pre><code class="language-csharp">Animator anim;
void Start() =&gt; anim = GetComponent&lt;Animator&gt;();
void Update() {
    float speed = Mathf.Abs(Input.GetAxis("Horizontal"));
    anim.SetFloat("speed", speed);           // drives Idle &lt;-&gt; Run
    if (Input.GetKeyDown(KeyCode.Space)) anim.SetTrigger("jump");
}
</code></pre>
<h3>User interface (Canvas)</h3>
<p>UI lives on a <strong>Canvas</strong>. Add a <strong>Button</strong>, a <strong>Text</strong>/TextMeshPro, an <strong>Image</strong>. Wire a button's OnClick either in the Inspector or from code:</p>
<pre><code class="language-csharp">public Button startButton;
public Text scoreText;
void Start() =&gt; startButton.onClick.AddListener(StartGame);
void StartGame() { scoreText.text = "Score: 0"; /* ... */ }
</code></pre>
<div class="callout"><span class="badge">Tip</span> Keep animation logic (parameters) and game logic separate: the script decides "should run"; the Animator decides "how the run looks." UI Text updates should read from your game state, not the other way around.</div>`,
    `<span class="eyebrow">FGU301 · Chương 3 · Bài 3.1</span>
<h2>Hoạt ảnh &amp; UI</h2>
<h3>Máy trạng thái Animator</h3>
<p>Các clip hoạt ảnh (Idle, Run, Jump) nằm trong một <strong>Animator Controller</strong> — một máy trạng thái. Các trạng thái nối nhau bằng <strong>transition</strong> canh bởi <strong>parameter</strong> (bool <code>isRunning</code>, trigger <code>jump</code>). Script của bạn đặt parameter; Animator lo trộn (blend).</p>
<pre><code class="language-csharp">Animator anim;
void Start() =&gt; anim = GetComponent&lt;Animator&gt;();
void Update() {
    float speed = Mathf.Abs(Input.GetAxis("Horizontal"));
    anim.SetFloat("speed", speed);           // điều khiển Idle &lt;-&gt; Run
    if (Input.GetKeyDown(KeyCode.Space)) anim.SetTrigger("jump");
}
</code></pre>
<h3>Giao diện (Canvas)</h3>
<p>UI nằm trên một <strong>Canvas</strong>. Thêm <strong>Button</strong>, <strong>Text</strong>/TextMeshPro, <strong>Image</strong>. Gắn OnClick của nút trong Inspector hoặc từ code:</p>
<pre><code class="language-csharp">public Button startButton;
public Text scoreText;
void Start() =&gt; startButton.onClick.AddListener(StartGame);
void StartGame() { scoreText.text = "Score: 0"; /* ... */ }
</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Tách logic hoạt ảnh (parameter) khỏi logic game: script quyết "có nên chạy"; Animator quyết "chạy trông thế nào". Text UI nên đọc từ trạng thái game, không phải ngược lại.</div>`,
  ]]);

const c3q = quiz('fgu301-quiz-3', 'Quiz 3 — Animation & UI|||Quiz 3 — Hoạt ảnh & UI', [
  { id: 'q1', question: 'Chuyển giữa Idle/Run/Jump trong Unity dùng?', options: ['Nhiều if trong Update', 'Animator Controller (state machine + parameter)', 'Rigidbody', 'Canvas'], correctIndex: 1, explanation: 'Animator là máy trạng thái; script chỉ set parameter.' },
  { id: 'q2', question: 'UI (nút, chữ) trong Unity đặt trên?', options: ['Rigidbody', 'Canvas', 'Collider', 'Prefab bất kỳ'], correctIndex: 1, explanation: 'Mọi phần tử UI nằm dưới một Canvas.' },
  { id: 'q3', question: 'Gắn hành động khi bấm nút từ code dùng?', options: ['button.onClick.AddListener(...)', 'Update()', 'SetTrigger', 'AddForce'], correctIndex: 0, explanation: 'onClick.AddListener đăng ký callback cho Button.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'FGU301',
    slug: 'fgu301-fundamental-game-development',
    title: 'Fundamental Game Development',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FGU301.webp',
    shortDescription: 'Build 2D/3D games in Unity — the editor, GameObject/Component model, transform & scripting, physics (Rigidbody/Collider), animation (Animator) and UI (Canvas). Bilingual, with C# scripts & quizzes.|||Dựng game 2D/3D trong Unity — trình soạn, mô hình GameObject/Component, transform & script, vật lý (Rigidbody/Collider), hoạt ảnh (Animator) và UI (Canvas). Song ngữ, có script C# & quiz.',
    description: 'Môn <strong>FGU301 — Fundamental Game Development</strong> (kỳ 5) dạy tạo <strong>game 2D/3D trong Unity</strong>. Từ <strong>mô hình GameObject–Component</strong> và trình soạn → <strong>Transform &amp; vòng đời MonoBehaviour</strong> (Start/Update, Time.deltaTime, điều khiển nhập) → <strong>vật lý</strong> (Rigidbody, Collider, collision vs trigger) → <strong>hoạt ảnh</strong> (Animator state machine) &amp; <strong>UI</strong> (Canvas, Button). Bám giáo trình FLM, song ngữ, script C# thả vào GameObject và quiz mỗi chương.',
    whatYouLearn: 'Trình soạn Unity (Scene/Hierarchy/Inspector/Project); GameObject–Component (composition); Transform; MonoBehaviour (Start/Update) & Time.deltaTime; Input; Rigidbody & lực; Collider, collision vs trigger (OnCollisionEnter/OnTriggerEnter); Animator (parameter/transition, SetFloat/SetTrigger); UI Canvas (Button.onClick, Text).',
    requirements: 'C# cơ bản. Cần cài Unity Hub + Unity Editor.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Unity, GameObject–Component.', lessons: [intro] },
    { title: 'Chương 1 — Trình soạn & script|||Chapter 1 — Editor & scripting', description: 'Cửa sổ Unity, Transform, MonoBehaviour.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Vật lý|||Chapter 2 — Physics', description: 'Rigidbody, Collider, trigger.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Hoạt ảnh & UI|||Chapter 3 — Animation & UI', description: 'Animator, Canvas, Button.', lessons: [c3, c3q] },
  ],
};
