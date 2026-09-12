/**
 * PRU213 — Game Programming with C#. Giáo trình FLM. Không slide gốc → soạn từ
 * syllabus (Unity + C# scripting + objects/physics + UI/input + build game) +
 * kiến thức, song ngữ, code C# (Unity) thật, kèm BÀI TẬP. Giữ NGUYÊN slug.
 * ⚠️ code mẫu: KHÔNG backtick/${ }/\n literal.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 420, questions } });

const intro = doc('pru213-0-1-overview', 'Course overview: Game Programming with C#|||Tổng quan môn: Lập trình Game với C#',
  'Mục tiêu, 6 CLO (Unity & công cụ; C# script logic; game object/animation/physics; UI & input; làm game nhỏ; debug Unity), lộ trình, đánh giá.',
  [[
    `<span class="eyebrow">PRU213 · Lesson 0.1 · Overview</span>
<h2>Game Programming with C# (Unity)</h2>
<p class="lead">Build 2D/3D games in <strong>Unity</strong> using <strong>C#</strong>. You'll learn the Unity editor, script game logic on <code>GameObject</code>s, work with physics, animation, input and UI, and ship a small playable game.</p>
<h3>CLOs</h3>
<ul>
<li><strong>CLO1</strong> — the Unity interface &amp; basic tools</li>
<li><strong>CLO2</strong> — write C# scripts for game logic &amp; interactions</li>
<li><strong>CLO3</strong> — create &amp; manipulate game objects, animations, physics</li>
<li><strong>CLO4</strong> — design UIs and handle user input</li>
<li><strong>CLO5</strong> — develop small games &amp; interactive apps</li>
<li><strong>CLO6</strong> — troubleshoot &amp; debug common Unity issues</li>
</ul>
<h3>How Unity works</h3>
<p>A game is a <strong>Scene</strong> of <strong>GameObjects</strong>; each GameObject is a container of <strong>Components</strong> (Transform, Renderer, Rigidbody, your scripts). You compose behavior by adding components — a very different mindset from plain C# (this is the <em>Entity-Component</em> model). Prerequisite: C# from PRO192/PRN212.</p>`,
    `<span class="eyebrow">PRU213 · Bài 0.1 · Tổng quan</span>
<h2>Lập trình Game với C# (Unity)</h2>
<p class="lead">Xây game 2D/3D trong <strong>Unity</strong> bằng <strong>C#</strong>. Bạn học editor Unity, viết script logic trên <code>GameObject</code>, làm việc với physics, animation, input và UI, và ra một game nhỏ chơi được.</p>
<h3>CLO</h3>
<ul>
<li><strong>CLO1</strong> — giao diện &amp; công cụ Unity cơ bản</li>
<li><strong>CLO2</strong> — viết C# script cho logic &amp; tương tác game</li>
<li><strong>CLO3</strong> — tạo &amp; thao tác game object, animation, physics</li>
<li><strong>CLO4</strong> — thiết kế UI và xử lý input người dùng</li>
<li><strong>CLO5</strong> — làm game nhỏ &amp; app tương tác</li>
<li><strong>CLO6</strong> — gỡ &amp; debug lỗi Unity thường gặp</li>
</ul>
<h3>Unity hoạt động thế nào</h3>
<p>Một game là một <strong>Scene</strong> gồm các <strong>GameObject</strong>; mỗi GameObject là một hộp chứa <strong>Component</strong> (Transform, Renderer, Rigidbody, script của bạn). Bạn ghép hành vi bằng cách thêm component — tư duy khác hẳn C# thuần (đây là mô hình <em>Entity-Component</em>). Tiên quyết: C# từ PRO192/PRN212.</p>`,
  ]]);

const c1 = doc('pru213-1-1-unity-basics', '1.1 — The Unity editor: Scene, GameObject, Component|||1.1 — Editor Unity: Scene, GameObject, Component',
  'Cửa sổ Scene/Game/Hierarchy/Inspector/Project, GameObject & Component, Transform (position/rotation/scale), và Prefab (mẫu tái dùng).',
  [[
    `<span class="eyebrow">PRU213 · Chapter 1 · Lesson 1.1</span>
<h2>The Unity editor</h2>
<h3>The windows</h3>
<ul>
<li><strong>Scene</strong> — the 3D/2D workspace where you place objects.</li>
<li><strong>Game</strong> — what the player sees (the camera view) when you press Play.</li>
<li><strong>Hierarchy</strong> — the list of GameObjects in the current scene.</li>
<li><strong>Inspector</strong> — the components (and their properties) of the selected object.</li>
<li><strong>Project</strong> — all your assets (scripts, sprites, prefabs, scenes).</li>
</ul>
<h3>GameObject, Component &amp; Transform</h3>
<p>Every object has a <strong>Transform</strong> (position, rotation, scale). Add components — a <em>Sprite Renderer</em> to show an image, a <em>Rigidbody2D</em> for physics, a <em>script</em> for behavior. A <strong>Prefab</strong> is a saved, reusable GameObject template: build an enemy once, then spawn many.</p>`,
    `<span class="eyebrow">PRU213 · Chương 1 · Bài 1.1</span>
<h2>Editor Unity</h2>
<h3>Các cửa sổ</h3>
<ul>
<li><strong>Scene</strong> — không gian làm việc 3D/2D nơi bạn đặt object.</li>
<li><strong>Game</strong> — cái người chơi thấy (góc camera) khi bấm Play.</li>
<li><strong>Hierarchy</strong> — danh sách GameObject trong scene hiện tại.</li>
<li><strong>Inspector</strong> — các component (và thuộc tính) của object đang chọn.</li>
<li><strong>Project</strong> — mọi asset (script, sprite, prefab, scene).</li>
</ul>
<h3>GameObject, Component &amp; Transform</h3>
<p>Mọi object có một <strong>Transform</strong> (position, rotation, scale). Thêm component — <em>Sprite Renderer</em> để hiện ảnh, <em>Rigidbody2D</em> cho physics, một <em>script</em> cho hành vi. Một <strong>Prefab</strong> là một GameObject mẫu đã lưu, tái dùng: dựng một enemy một lần, rồi spawn nhiều.</p>`,
  ]]);

const c1q = quiz('pru213-quiz-1', 'Quiz 1 — Unity basics|||Quiz 1 — Unity cơ bản', [
  { id: 'q1', question: 'Component nào MỌI GameObject đều có?', options: ['Rigidbody', 'Transform', 'Sprite Renderer', 'Audio Source'], correctIndex: 1, explanation: 'Transform (vị trí/xoay/scale) luôn có; các component khác là tuỳ thêm.' },
  { id: 'q2', question: 'Prefab là gì?', options: ['Một cảnh', 'Một GameObject mẫu đã lưu, tái dùng/spawn', 'Một script', 'Một sprite'], correctIndex: 1, explanation: 'Prefab = template GameObject để tạo nhiều bản.' },
  { id: 'q3', question: 'Cửa sổ nào hiện component của object đang chọn?', options: ['Hierarchy', 'Inspector', 'Project', 'Console'], correctIndex: 1, explanation: 'Inspector hiển thị & chỉnh component/thuộc tính.' },
]);

const c2 = doc('pru213-2-1-scripting', '2.1 — C# scripting: MonoBehaviour, Start & Update|||2.1 — C# script: MonoBehaviour, Start & Update',
  'Script là Component (kế thừa MonoBehaviour), Start() (khởi tạo) vs Update() (mỗi frame), Time.deltaTime, truy cập component (GetComponent), và trường [SerializeField] hiện trong Inspector.',
  [[
    `<span class="eyebrow">PRU213 · Chapter 2 · Lesson 2.1</span>
<h2>C# scripting in Unity</h2>
<p class="lead">A script is a <strong>component</strong>: a C# class that inherits <code>MonoBehaviour</code>. Unity calls its <strong>lifecycle methods</strong> automatically.</p>
<pre><code class="language-csharp">using UnityEngine;

public class PlayerMover : MonoBehaviour
{
    [SerializeField] private float speed = 5f;   // shows in Inspector

    void Start()   // once, when the object is created
    {
        Debug.Log("Player ready");
    }

    void Update()  // every frame
    {
        float h = Input.GetAxis("Horizontal");   // -1..1 (A/D, arrows)
        transform.Translate(Vector3.right * h * speed * Time.deltaTime);
    }
}
</code></pre>
<p><code>Start()</code> runs once; <code>Update()</code> runs every frame. <strong>Multiply movement by <code>Time.deltaTime</code></strong> so speed is the same on fast and slow machines (frame-rate independence). Use <code>[SerializeField]</code> to tweak private fields in the Inspector, and <code>GetComponent&lt;T&gt;()</code> to reach another component on the same object.</p>`,
    `<span class="eyebrow">PRU213 · Chương 2 · Bài 2.1</span>
<h2>Viết C# trong Unity</h2>
<p class="lead">Một script là một <strong>component</strong>: một class C# kế thừa <code>MonoBehaviour</code>. Unity gọi các <strong>phương thức vòng đời</strong> tự động.</p>
<pre><code class="language-csharp">using UnityEngine;

public class PlayerMover : MonoBehaviour
{
    [SerializeField] private float speed = 5f;   // hiện trong Inspector

    void Start()   // một lần, khi object được tạo
    {
        Debug.Log("Player ready");
    }

    void Update()  // mỗi frame
    {
        float h = Input.GetAxis("Horizontal");   // -1..1 (A/D, phím mũi tên)
        transform.Translate(Vector3.right * h * speed * Time.deltaTime);
    }
}
</code></pre>
<p><code>Start()</code> chạy một lần; <code>Update()</code> chạy mỗi frame. <strong>Nhân chuyển động với <code>Time.deltaTime</code></strong> để tốc độ như nhau trên máy nhanh/chậm (độc lập frame-rate). Dùng <code>[SerializeField]</code> để chỉnh trường private trong Inspector, và <code>GetComponent&lt;T&gt;()</code> để lấy component khác trên cùng object.</p>`,
  ]]);

const c2q = quiz('pru213-quiz-2', 'Quiz 2 — Scripting|||Quiz 2 — Scripting', [
  { id: 'q1', question: 'Script Unity kế thừa lớp nào?', options: ['GameObject', 'MonoBehaviour', 'Component', 'Transform'], correctIndex: 1, explanation: 'Script kế thừa MonoBehaviour để nhận lifecycle của Unity.' },
  { id: 'q2', question: 'Update() được gọi khi nào?', options: ['Một lần lúc tạo', 'Mỗi frame', 'Khi va chạm', 'Không bao giờ'], correctIndex: 1, explanation: 'Update() chạy mỗi frame; Start() chạy một lần.' },
  { id: 'q3', question: 'Vì sao nhân với Time.deltaTime?', options: ['Cho đẹp', 'Để chuyển động độc lập frame-rate (như nhau trên máy nhanh/chậm)', 'Bắt buộc bởi C#', 'Để chạy nhanh hơn'], correctIndex: 1, explanation: 'deltaTime là thời gian giữa frame → chuyển động ổn định mọi FPS.' },
]);

const c3 = doc('pru213-3-1-objects-physics', '3.1 — GameObjects, prefabs & physics|||3.1 — GameObject, prefab & physics',
  'Instantiate/Destroy prefab, Rigidbody (khối lượng, trọng lực, lực), Collider & va chạm (OnCollisionEnter) vs trigger (OnTriggerEnter, isTrigger); ví dụ bắn đạn/nhặt vật phẩm.',
  [[
    `<span class="eyebrow">PRU213 · Chapter 3 · Lesson 3.1</span>
<h2>GameObjects, prefabs &amp; physics</h2>
<h3>Spawning &amp; destroying</h3>
<pre><code class="language-csharp">public GameObject bulletPrefab;   // assign in Inspector

void Fire()
{
    Instantiate(bulletPrefab, transform.position, Quaternion.identity);
}

// destroy after 3 seconds
void Start() { Destroy(gameObject, 3f); }
</code></pre>
<h3>Physics: Rigidbody &amp; Collider</h3>
<p>Add a <strong>Rigidbody</strong> to let Unity's physics move an object (gravity, forces); add a <strong>Collider</strong> to give it shape for collisions. Two ways objects interact:</p>
<pre><code class="language-csharp">// solid collision — objects bounce/block
void OnCollisionEnter2D(Collision2D c) { Debug.Log("hit " + c.gameObject.name); }

// trigger — pass through, just detect (Collider isTrigger = true)
void OnTriggerEnter2D(Collider2D other)
{
    if (other.CompareTag("Coin")) { score++; Destroy(other.gameObject); }
}
</code></pre>
<p><strong>Collision</strong> = physical block/bounce; <strong>Trigger</strong> = overlap detection without blocking (pickups, zones). Use <strong>tags</strong> to identify what you hit.</p>`,
    `<span class="eyebrow">PRU213 · Chương 3 · Bài 3.1</span>
<h2>GameObject, prefab &amp; physics</h2>
<h3>Sinh &amp; huỷ</h3>
<pre><code class="language-csharp">public GameObject bulletPrefab;   // gán trong Inspector

void Fire()
{
    Instantiate(bulletPrefab, transform.position, Quaternion.identity);
}

// huỷ sau 3 giây
void Start() { Destroy(gameObject, 3f); }
</code></pre>
<h3>Physics: Rigidbody &amp; Collider</h3>
<p>Thêm <strong>Rigidbody</strong> để physics của Unity di chuyển object (trọng lực, lực); thêm <strong>Collider</strong> để cho nó hình dạng va chạm. Hai cách object tương tác:</p>
<pre><code class="language-csharp">// va chạm rắn — object chặn/bật
void OnCollisionEnter2D(Collision2D c) { Debug.Log("trúng " + c.gameObject.name); }

// trigger — xuyên qua, chỉ phát hiện (Collider isTrigger = true)
void OnTriggerEnter2D(Collider2D other)
{
    if (other.CompareTag("Coin")) { score++; Destroy(other.gameObject); }
}
</code></pre>
<p><strong>Collision</strong> = chặn/bật vật lý; <strong>Trigger</strong> = phát hiện chồng lấn không chặn (nhặt đồ, vùng). Dùng <strong>tag</strong> để nhận diện cái vừa trúng.</p>`,
  ]]);

const c3e = doc('pru213-3-2-exercise', 'Exercise 1 — a coin collector|||Bài tập 1 — nhặt xu',
  'Bài tập: viết script để player nhặt coin (trigger) và tăng điểm, coin biến mất; kèm lời giải.',
  [[
    `<span class="eyebrow">PRU213 · Chapter 3 · Exercise</span>
<h2>Exercise 1 — collect coins</h2>
<div class="callout"><span class="badge">Đề</span> The player walks into coins (tagged "Coin", with isTrigger colliders). Each coin picked up adds 1 to the score and disappears. Write the player script.</div>
<h3>Worked solution</h3>
<pre><code class="language-csharp">using UnityEngine;

public class PlayerCollector : MonoBehaviour
{
    public int score = 0;

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Coin"))
        {
            score++;
            Destroy(other.gameObject);        // remove the coin
            Debug.Log("Score: " + score);
        }
    }
}
</code></pre>
<p><strong>Why:</strong> the coin's collider is a <em>trigger</em>, so the player passes through and <code>OnTriggerEnter2D</code> fires; <code>CompareTag</code> checks it's a coin (not a wall); <code>Destroy</code> removes it. Setup: give coins the tag "Coin" and tick <em>Is Trigger</em> on their Collider2D; give the player a Rigidbody2D so triggers fire.</p>`,
    `<span class="eyebrow">PRU213 · Chương 3 · Bài tập</span>
<h2>Bài tập 1 — nhặt xu</h2>
<div class="callout"><span class="badge">Đề</span> Player đi vào coin (tag "Coin", collider isTrigger). Mỗi coin nhặt được tăng 1 điểm và biến mất. Viết script cho player.</div>
<h3>Lời giải</h3>
<pre><code class="language-csharp">using UnityEngine;

public class PlayerCollector : MonoBehaviour
{
    public int score = 0;

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Coin"))
        {
            score++;
            Destroy(other.gameObject);        // xoá coin
            Debug.Log("Score: " + score);
        }
    }
}
</code></pre>
<p><strong>Vì sao:</strong> collider của coin là <em>trigger</em> nên player xuyên qua và <code>OnTriggerEnter2D</code> kích hoạt; <code>CompareTag</code> kiểm đúng là coin (không phải tường); <code>Destroy</code> xoá nó. Thiết lập: gán coin tag "Coin" và tick <em>Is Trigger</em> trên Collider2D; gán player một Rigidbody2D để trigger kích hoạt.</p>`,
  ]]);

const c3q = quiz('pru213-quiz-3', 'Quiz 3 — Objects & physics|||Quiz 3 — Object & physics', [
  { id: 'q1', question: 'Instantiate(prefab, pos, rot) làm gì?', options: ['Xoá object', 'Tạo một bản mới của prefab tại vị trí', 'Di chuyển camera', 'Load scene'], correctIndex: 1, explanation: 'Instantiate spawn một bản GameObject từ prefab.' },
  { id: 'q2', question: 'Collider có isTrigger=true kích hoạt callback nào?', options: ['OnCollisionEnter', 'OnTriggerEnter', 'Start', 'Update'], correctIndex: 1, explanation: 'Trigger (không chặn) gọi OnTriggerEnter; va chạm rắn gọi OnCollisionEnter.' },
  { id: 'q3', question: 'Component nào cho object chịu trọng lực/lực vật lý?', options: ['Collider', 'Rigidbody', 'Transform', 'Sprite Renderer'], correctIndex: 1, explanation: 'Rigidbody đưa object vào hệ physics (gravity, force).' },
]);

const c4 = doc('pru213-4-1-input-ui', '4.1 — Input & UI (Canvas, buttons)|||4.1 — Input & UI (Canvas, nút)',
  'Đọc input (Input.GetAxis/GetKeyDown/chuột), UI với Canvas (Text, Button, Image), gắn sự kiện nút (onClick), cập nhật điểm/HUD; và quản lý scene (SceneManager).',
  [[
    `<span class="eyebrow">PRU213 · Chapter 4 · Lesson 4.1</span>
<h2>Input &amp; UI</h2>
<h3>Reading input</h3>
<pre><code class="language-csharp">void Update()
{
    if (Input.GetKeyDown(KeyCode.Space)) Jump();
    float move = Input.GetAxis("Horizontal");        // smooth -1..1
    if (Input.GetMouseButtonDown(0)) Fire();         // left click
}
</code></pre>
<h3>UI: Canvas &amp; buttons</h3>
<p>UI lives on a <strong>Canvas</strong> (Text/TextMeshPro, Button, Image, Slider). Wire a button's <em>OnClick</em> to a public method, and update a score label from code:</p>
<pre><code class="language-csharp">using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class UIController : MonoBehaviour
{
    public Text scoreText;
    public void UpdateScore(int s) { scoreText.text = "Score: " + s; }
    public void Restart() { SceneManager.LoadScene("Game"); }   // button OnClick
}
</code></pre>
<p><code>SceneManager.LoadScene</code> switches levels/menus. Assign the <code>scoreText</code> reference in the Inspector; drag the UIController's <code>Restart</code> into the Button's OnClick list.</p>`,
    `<span class="eyebrow">PRU213 · Chương 4 · Bài 4.1</span>
<h2>Input &amp; UI</h2>
<h3>Đọc input</h3>
<pre><code class="language-csharp">void Update()
{
    if (Input.GetKeyDown(KeyCode.Space)) Jump();
    float move = Input.GetAxis("Horizontal");        // mượt -1..1
    if (Input.GetMouseButtonDown(0)) Fire();         // click trái
}
</code></pre>
<h3>UI: Canvas &amp; nút</h3>
<p>UI nằm trên một <strong>Canvas</strong> (Text/TextMeshPro, Button, Image, Slider). Nối <em>OnClick</em> của nút tới một phương thức public, và cập nhật nhãn điểm từ code:</p>
<pre><code class="language-csharp">using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class UIController : MonoBehaviour
{
    public Text scoreText;
    public void UpdateScore(int s) { scoreText.text = "Score: " + s; }
    public void Restart() { SceneManager.LoadScene("Game"); }   // OnClick của nút
}
</code></pre>
<p><code>SceneManager.LoadScene</code> chuyển level/menu. Gán tham chiếu <code>scoreText</code> trong Inspector; kéo <code>Restart</code> của UIController vào danh sách OnClick của Button.</p>`,
  ]]);

const c4q = quiz('pru213-quiz-4', 'Quiz 4 — Input & UI|||Quiz 4 — Input & UI', [
  { id: 'q1', question: 'Input.GetKeyDown(KeyCode.Space) trả true khi?', options: ['Space đang giữ', 'Đúng frame Space vừa được NHẤN', 'Space nhả ra', 'Luôn true'], correctIndex: 1, explanation: 'GetKeyDown true đúng frame nhấn; GetKey true khi đang giữ.' },
  { id: 'q2', question: 'UI của Unity đặt trên?', options: ['Rigidbody', 'Canvas', 'Collider', 'Transform gốc'], correctIndex: 1, explanation: 'Các phần tử UI là con của một Canvas.' },
  { id: 'q3', question: 'Chuyển sang scene khác dùng?', options: ['Instantiate', 'SceneManager.LoadScene', 'Destroy', 'GetComponent'], correctIndex: 1, explanation: 'SceneManager.LoadScene("Ten") tải scene khác.' },
]);

const c5 = doc('pru213-5-1-build-debug', '5.1 — Animation, building a game & debugging|||5.1 — Animation, dựng game & debug',
  'Animator & animation clip (state, transition, parameter), quản lý trạng thái game (GameManager), build ra nền tảng; và debug Unity (Console, Debug.Log, null reference, gán thiếu trong Inspector).',
  [[
    `<span class="eyebrow">PRU213 · Chapter 5 · Lesson 5.1</span>
<h2>Animation, building &amp; debugging</h2>
<h3>Animation</h3>
<p>An <strong>Animator</strong> component plays <strong>animation clips</strong> arranged in a state machine (Idle → Run → Jump) with <strong>parameters</strong> driving transitions. From code: <code>animator.SetBool("isRunning", true)</code>. (Note how this is the same state-machine idea as UML — states + transitions triggered by conditions.)</p>
<h3>Game state &amp; building</h3>
<p>A <strong>GameManager</strong> (often a Singleton) holds score, lives and game-over logic in one place. When done, <strong>File → Build Settings</strong> exports to Windows/WebGL/Android.</p>
<h3>Debugging Unity — the common issues</h3>
<ul>
<li><strong>NullReferenceException</strong> — a field wasn't assigned in the Inspector, or <code>GetComponent</code> returned null. Check the object really has that component and the reference is set.</li>
<li><strong>Nothing happens on collision</strong> — missing Rigidbody, or a Collider is/ isn't a trigger, or tags don't match.</li>
<li><strong>Read the Console</strong> — <code>Debug.Log</code> your values; the error's stack trace names the line.</li>
</ul>
<div class="callout"><span class="badge">★ Đồ án</span> Ghép tất cả: player di chuyển (Ch2) + physics/nhặt đồ (Ch3) + input/UI điểm &amp; restart (Ch4) + animation &amp; GameManager (Ch5) = một game nhỏ hoàn chỉnh. Bắt đầu nhỏ, chơi thử liên tục.</div>`,
    `<span class="eyebrow">PRU213 · Chương 5 · Bài 5.1</span>
<h2>Animation, dựng game &amp; debug</h2>
<h3>Animation</h3>
<p>Một component <strong>Animator</strong> phát các <strong>animation clip</strong> xếp thành một máy trạng thái (Idle → Run → Jump) với <strong>parameter</strong> điều khiển transition. Từ code: <code>animator.SetBool("isRunning", true)</code>. (Để ý đây đúng là ý máy trạng thái của UML — trạng thái + chuyển do điều kiện.)</p>
<h3>Trạng thái game &amp; build</h3>
<p>Một <strong>GameManager</strong> (thường là Singleton) giữ điểm, mạng và logic game-over ở một chỗ. Xong thì <strong>File → Build Settings</strong> xuất ra Windows/WebGL/Android.</p>
<h3>Debug Unity — các lỗi thường gặp</h3>
<ul>
<li><strong>NullReferenceException</strong> — một trường chưa gán trong Inspector, hoặc <code>GetComponent</code> trả null. Kiểm object thật sự có component đó và tham chiếu đã gán.</li>
<li><strong>Va chạm không phản ứng</strong> — thiếu Rigidbody, hoặc Collider là/không phải trigger, hoặc tag không khớp.</li>
<li><strong>Đọc Console</strong> — <code>Debug.Log</code> giá trị của bạn; stack trace của lỗi chỉ đúng dòng.</li>
</ul>
<div class="callout"><span class="badge">★ Đồ án</span> Ghép tất cả: player di chuyển (Ch2) + physics/nhặt đồ (Ch3) + input/UI điểm &amp; restart (Ch4) + animation &amp; GameManager (Ch5) = một game nhỏ hoàn chỉnh. Bắt đầu nhỏ, chơi thử liên tục.</div>`,
  ]]);

const c5q = quiz('pru213-quiz-5', 'Quiz 5 — Animation & debug|||Quiz 5 — Animation & debug', [
  { id: 'q1', question: 'NullReferenceException trong Unity thường do?', options: ['Máy yếu', 'Trường chưa gán trong Inspector / GetComponent trả null', 'Quá nhiều frame', 'Scene lớn'], correctIndex: 1, explanation: 'Tham chiếu chưa gán hoặc component không tồn tại → null.' },
  { id: 'q2', question: 'Animator điều khiển transition qua?', options: ['Physics', 'Parameter (bool/float/trigger)', 'Tag', 'Prefab'], correctIndex: 1, explanation: 'Parameter (SetBool/SetTrigger…) điều khiển chuyển state animation.' },
  { id: 'q3', question: 'Công cụ đầu tiên để debug logic?', options: ['Xoá script', 'Console + Debug.Log', 'Build lại', 'Đổi máy'], correctIndex: 1, explanation: 'Debug.Log giá trị và đọc Console/stack trace.' },
]);

const taiLieu = doc('pru213-0-0-tai-lieu',
  '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">PRU213 · Lesson 0.0 · Resources</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for everything you need to master PRU213 beyond these lessons: the official FLM syllabus &amp; slides, reference books, free primary documentation, video channels, tools, and a four-step self-study path.</p>
<div class="callout"><span class="badge">Official</span> Log in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn">flm.fpt.edu.vn</a>) with your FPTU account — the full syllabus and every lecture slide live there, and they define exactly what the exam covers.</div>
<h3>📘 Official syllabus &amp; slides</h3>
<ul>
<li><strong>FLM — flm.fpt.edu.vn</strong>: sign in with your FPTU account for the complete syllabus, session plan, CLOs and all lecture slides — the authoritative, in-scope source of truth.</li>
</ul>
<h3>📗 Reference books</h3>
<ul>
<li><em>Unity in Action (3rd ed.)</em> — Joe Hocking (Manning): <a href="https://www.manning.com/books/unity-in-action-third-edition">manning.com/books/unity-in-action-third-edition</a></li>
<li><em>Game Programming Patterns</em> — Robert Nystrom (free, read online): <a href="https://gameprogrammingpatterns.com/">gameprogrammingpatterns.com</a></li>
</ul>
<h3>🌐 Free primary documentation</h3>
<ul>
<li>Unity Manual: <a href="https://docs.unity3d.com/Manual/index.html">docs.unity3d.com/Manual</a></li>
<li>Unity Scripting API: <a href="https://docs.unity3d.com/ScriptReference/">docs.unity3d.com/ScriptReference</a></li>
<li>Unity Learn (free courses): <a href="https://learn.unity.com/">learn.unity.com</a> · C#: <a href="https://learn.microsoft.com/dotnet/csharp">learn.microsoft.com/dotnet/csharp</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li>Brackeys: <a href="https://www.youtube.com/@Brackeys">youtube.com/@Brackeys</a></li>
<li>Code Monkey: <a href="https://www.youtube.com/@CodeMonkeyUnity">youtube.com/@CodeMonkeyUnity</a></li>
<li>Unity (official): <a href="https://www.youtube.com/@unity">youtube.com/@unity</a></li>
<li>Sebastian Lague: <a href="https://www.youtube.com/@SebastianLague">youtube.com/@SebastianLague</a></li>
</ul>
<h3>🛠️ Tools for study &amp; practice</h3>
<ul>
<li>Unity Hub + Unity Editor (LTS): <a href="https://unity.com/download">unity.com/download</a></li>
<li>Visual Studio 2022: <a href="https://visualstudio.microsoft.com/">visualstudio.microsoft.com</a></li>
<li>JetBrains Rider: <a href="https://www.jetbrains.com/rider/">jetbrains.com/rider</a></li>
<li>Unity Asset Store (free assets): <a href="https://assetstore.unity.com/">assetstore.unity.com</a></li>
</ul>
<h3>🎯 A four-step self-study path</h3>
<ol>
<li><strong>Foundations / exam core</strong> — get fluent in the editor (Scene/GameObject/Component) and MonoBehaviour lifecycle (Start/Update, Time.deltaTime, GetComponent); everything else builds on these.</li>
<li><strong>Practice on a small project</strong> — make one tiny playable game: move a player with input, spawn objects with Instantiate, and detect hits with colliders/triggers.</li>
<li><strong>Go deeper on real-world concerns</strong> — add a UI (Canvas, buttons, score), scene switching with SceneManager, animation with the Animator, and a GameManager for state.</li>
<li><strong>Job-ready</strong> — build and debug a finished small game (fix NullReference errors via the Console), then be able to walk through your GameObject/Component design.</li>
</ol>`,
    `<span class="eyebrow">PRU213 · Bài 0.0 · Tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom đủ thứ để học PRU213 vượt ngoài các bài trong khoá: giáo trình &amp; slide chính thức trên FLM, sách tham khảo, tài liệu gốc miễn phí, kênh video, công cụ, và lộ trình tự học 4 bước.</p>
<div class="callout"><span class="badge">Chính thức</span> Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn">flm.fpt.edu.vn</a>) bằng tài khoản FPTU — có giáo trình + slide đầy đủ, đúng phạm vi thi.</div>
<h3>📘 Giáo trình &amp; slide chính thức</h3>
<ul>
<li><strong>FLM — flm.fpt.edu.vn</strong>: đăng nhập bằng tài khoản FPTU để lấy giáo trình đầy đủ, lịch buổi, CLO và toàn bộ slide bài giảng — nguồn chuẩn, đúng phạm vi thi.</li>
</ul>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Unity in Action (tái bản 3)</em> — Joe Hocking (Manning): <a href="https://www.manning.com/books/unity-in-action-third-edition">manning.com/books/unity-in-action-third-edition</a></li>
<li><em>Game Programming Patterns</em> — Robert Nystrom (miễn phí, đọc online): <a href="https://gameprogrammingpatterns.com/">gameprogrammingpatterns.com</a></li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li>Unity Manual: <a href="https://docs.unity3d.com/Manual/index.html">docs.unity3d.com/Manual</a></li>
<li>Unity Scripting API: <a href="https://docs.unity3d.com/ScriptReference/">docs.unity3d.com/ScriptReference</a></li>
<li>Unity Learn (khoá miễn phí): <a href="https://learn.unity.com/">learn.unity.com</a> · C#: <a href="https://learn.microsoft.com/dotnet/csharp">learn.microsoft.com/dotnet/csharp</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li>Brackeys: <a href="https://www.youtube.com/@Brackeys">youtube.com/@Brackeys</a></li>
<li>Code Monkey: <a href="https://www.youtube.com/@CodeMonkeyUnity">youtube.com/@CodeMonkeyUnity</a></li>
<li>Unity (chính thức): <a href="https://www.youtube.com/@unity">youtube.com/@unity</a></li>
<li>Sebastian Lague: <a href="https://www.youtube.com/@SebastianLague">youtube.com/@SebastianLague</a></li>
</ul>
<h3>🛠️ Công cụ học &amp; thực hành</h3>
<ul>
<li>Unity Hub + Unity Editor (LTS): <a href="https://unity.com/download">unity.com/download</a></li>
<li>Visual Studio 2022: <a href="https://visualstudio.microsoft.com/">visualstudio.microsoft.com</a></li>
<li>JetBrains Rider: <a href="https://www.jetbrains.com/rider/">jetbrains.com/rider</a></li>
<li>Unity Asset Store (asset miễn phí): <a href="https://assetstore.unity.com/">assetstore.unity.com</a></li>
</ul>
<h3>🎯 Lộ trình tự học 4 bước</h3>
<ol>
<li><strong>Nền tảng / lõi thi</strong> — thành thạo editor (Scene/GameObject/Component) và vòng đời MonoBehaviour (Start/Update, Time.deltaTime, GetComponent); mọi thứ khác dựng trên đây.</li>
<li><strong>Luyện qua project nhỏ</strong> — làm một game nhỏ chơi được: di chuyển nhân vật bằng input, sinh vật thể bằng Instantiate, và bắt va chạm bằng collider/trigger.</li>
<li><strong>Đào sâu thực tế</strong> — thêm UI (Canvas, nút, điểm), chuyển scene bằng SceneManager, animation bằng Animator, và một GameManager giữ trạng thái.</li>
<li><strong>Sẵn sàng đi làm</strong> — build và debug một game nhỏ hoàn chỉnh (sửa lỗi NullReference qua Console), rồi trình bày được thiết kế GameObject/Component của mình.</li>
</ol>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'PRU213',
    slug: 'pru213-game-programming-with-c',
    title: 'Game Programming with C#',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PRU213.webp',
    shortDescription: 'Build games in Unity with C# — the editor, MonoBehaviour scripting, prefabs & physics, input & UI, animation, and shipping a small game. Bilingual, with Unity C# code & exercises.|||Làm game trong Unity với C# — editor, script MonoBehaviour, prefab & physics, input & UI, animation, và ra một game nhỏ. Song ngữ, code C# (Unity) & bài tập.',
    description: 'Môn <strong>PRU213 — Lập trình Game với C#</strong> (ngành Kỹ thuật phần mềm, kỳ 7). Dùng <strong>Unity</strong> + <strong>C#</strong>: từ editor (Scene/GameObject/Component) → viết script <strong>MonoBehaviour</strong> (Start/Update, input, Time.deltaTime) → <strong>prefab &amp; physics</strong> (Rigidbody, Collider, collision vs trigger) → <strong>input &amp; UI</strong> (Canvas, button, SceneManager) → <strong>animation, GameManager, build &amp; debug</strong>. Bám giáo trình FLM (6 CLO), song ngữ, code Unity C# chạy được và bài tập kèm lời giải.',
    whatYouLearn: 'Editor Unity (Scene/Hierarchy/Inspector/Project); GameObject/Component/Transform/Prefab; script MonoBehaviour (Start/Update, GetComponent, SerializeField, Time.deltaTime); Instantiate/Destroy; physics (Rigidbody, Collider, OnCollision/OnTrigger, tag); input (GetAxis/GetKeyDown/chuột); UI (Canvas, Text, Button onClick) & SceneManager; Animator & animation; GameManager; build & debug (NullReference, Console).',
    requirements: 'Đã biết C# (PRO192/PRN212). Cần cài Unity Hub + Unity Editor (LTS) và một IDE (Visual Studio / Rider / VS Code).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Unity hoạt động thế nào, 6 CLO, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Editor Unity|||Chapter 1 — Unity editor', description: 'Scene/GameObject/Component/Transform/Prefab.', lessons: [c1, c1q] },
    { title: 'Chương 2 — C# scripting|||Chapter 2 — C# scripting', description: 'MonoBehaviour, Start/Update, input, deltaTime.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Object & physics|||Chapter 3 — Objects & physics', description: 'Instantiate/Destroy, Rigidbody, Collider, trigger.', lessons: [c3, c3e, c3q] },
    { title: 'Chương 4 — Input & UI|||Chapter 4 — Input & UI', description: 'Input, Canvas/Button, SceneManager.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Animation, build & debug|||Chapter 5 — Animation, build & debug', description: 'Animator, GameManager, build, debug Unity.', lessons: [c5, c5q] },
  ],
};
