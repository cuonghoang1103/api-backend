/**
 * REL301m — Reinforcement Learning (Học tăng cường). Ngành Robotics & AI FPTU, Kỳ 8.
 * Khung chất lượng: 8 chương song ngữ (khái niệm + công thức + code Python/Gymnasium)
 * mỗi chương 1 DOCUMENT + 1 QUIZ. Sách chuẩn: Sutton & Barto "Reinforcement
 * Learning: An Introduction"; David Silver RL Course (DeepMind/UCL); OpenAI
 * Spinning Up; Gymnasium. Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick/${} lồng trong HTML; "&"→"&amp;" trong content; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('rel301m-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách Sutton & Barto, David Silver RL Course, OpenAI Spinning Up, Gymnasium, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">REL301m · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Reinforcement Learning</strong> — agents that learn by trial and reward — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are the free, canonical resources used worldwide.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for REL301m are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 The standard book</h3>
<ul>
<li><a href="http://incompleteideas.net/book/the-book-2nd.html" target="_blank" rel="noopener"><em>Reinforcement Learning: An Introduction</em> — Sutton &amp; Barto (2nd ed., free PDF)</a></li>
</ul>
<h3>🌐 Free courses &amp; docs</h3>
<ul>
<li><a href="https://www.davidsilver.uk/teaching/" target="_blank" rel="noopener">David Silver — RL Course (DeepMind/UCL, slides + video)</a></li>
<li><a href="https://spinningup.openai.com/" target="_blank" rel="noopener">OpenAI Spinning Up in Deep RL</a></li>
<li><a href="https://gymnasium.farama.org/" target="_blank" rel="noopener">Gymnasium documentation (the standard RL environments API)</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PLqYmG7hTraZDM-OYHWgPebj2MfCFzFObQ" target="_blank" rel="noopener">DeepMind x UCL — Reinforcement Learning lectures</a></li>
<li><a href="https://www.youtube.com/@HuggingFace" target="_blank" rel="noopener">Hugging Face — Deep RL Course</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://gymnasium.farama.org/" target="_blank" rel="noopener">Gymnasium</a> — CartPole, MountainCar, Atari, MuJoCo environments</li>
<li><a href="https://stable-baselines3.readthedocs.io/" target="_blank" rel="noopener">Stable-Baselines3</a> — production RL algorithms (DQN, A2C, PPO)</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the agent-environment loop, reward, MDPs, the Bellman equation.</li>
<li><strong>Tabular methods</strong> — dynamic programming, Monte Carlo &amp; TD, Q-Learning &amp; SARSA on small grids.</li>
<li><strong>Go deeper</strong> — function approximation, DQN, and policy gradients (REINFORCE, actor-critic, PPO).</li>
<li><strong>Job-ready</strong> — train agents on Gymnasium with Stable-Baselines3, then reason about reward shaping, sample efficiency and safety.</li>
</ol></div>`,
    `<span class="eyebrow">REL301m · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Học tăng cường</strong> — tác nhân học qua thử-sai và phần thưởng — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các nguồn miễn phí, kinh điển, được dùng khắp thế giới.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của REL301m có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách chuẩn</h3>
<ul>
<li><a href="http://incompleteideas.net/book/the-book-2nd.html" target="_blank" rel="noopener"><em>Reinforcement Learning: An Introduction</em> — Sutton &amp; Barto (ấn bản 2, PDF miễn phí)</a></li>
</ul>
<h3>🌐 Khoá học &amp; tài liệu miễn phí</h3>
<ul>
<li><a href="https://www.davidsilver.uk/teaching/" target="_blank" rel="noopener">David Silver — RL Course (DeepMind/UCL, slide + video)</a></li>
<li><a href="https://spinningup.openai.com/" target="_blank" rel="noopener">OpenAI Spinning Up in Deep RL</a></li>
<li><a href="https://gymnasium.farama.org/" target="_blank" rel="noopener">Gymnasium — API môi trường RL tiêu chuẩn</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PLqYmG7hTraZDM-OYHWgPebj2MfCFzFObQ" target="_blank" rel="noopener">DeepMind x UCL — bài giảng Reinforcement Learning</a></li>
<li><a href="https://www.youtube.com/@HuggingFace" target="_blank" rel="noopener">Hugging Face — Deep RL Course</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://gymnasium.farama.org/" target="_blank" rel="noopener">Gymnasium</a> — môi trường CartPole, MountainCar, Atari, MuJoCo</li>
<li><a href="https://stable-baselines3.readthedocs.io/" target="_blank" rel="noopener">Stable-Baselines3</a> — thuật toán RL sẵn sàng dùng (DQN, A2C, PPO)</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — vòng lặp tác nhân-môi trường, phần thưởng, MDP, phương trình Bellman.</li>
<li><strong>Phương pháp bảng</strong> — quy hoạch động, Monte Carlo &amp; TD, Q-Learning &amp; SARSA trên lưới nhỏ.</li>
<li><strong>Đào sâu</strong> — xấp xỉ hàm, DQN, và policy gradient (REINFORCE, actor-critic, PPO).</li>
<li><strong>Sẵn sàng đi làm</strong> — huấn luyện tác nhân trên Gymnasium với Stable-Baselines3, rồi lập luận về reward shaping, hiệu quả mẫu và an toàn.</li>
</ol></div>`,
  ]]);

const intro = doc('rel301m-0-1-overview', 'Course overview: Reinforcement Learning|||Tổng quan: Học tăng cường',
  'Học tăng cường là gì; vòng lặp tác nhân-môi trường-phần thưởng; lộ trình 4 bước: MDP & Bellman → phương pháp bảng (DP, MC, TD, Q-Learning) → Deep RL & policy gradient → ứng dụng.',
  [[
    `<span class="eyebrow">REL301m · Lesson 0.1 · Overview</span>
<h2>Reinforcement Learning</h2>
<p class="lead">Reinforcement Learning (RL) is how an <strong>agent learns to act by trial and reward</strong>. There is no answer key — the agent tries actions, sees a reward signal, and gradually discovers a strategy that earns the most reward over time. It is the family of methods behind game-playing AI (AlphaGo), robot control, and recommendation systems.</p>
<h3>The core loop</h3>
<pre><code>At each step t:
  agent observes state  S_t
  agent picks action    A_t   (following a policy pi)
  environment returns   R_{t+1}  and next state S_{t+1}
  goal: maximize the return  G_t = R_{t+1} + gamma*R_{t+2} + gamma^2*R_{t+3} + ...
</code></pre>
<h3>Roadmap</h3>
<p>Markov Decision Processes &amp; the Bellman equation → tabular methods (dynamic programming, Monte Carlo, temporal-difference, Q-Learning &amp; SARSA) → Deep RL (DQN) &amp; policy gradients (REINFORCE, actor-critic, PPO) → applications &amp; challenges. Bilingual, with runnable Python/Gymnasium code and a quiz per chapter.</p>`,
    `<span class="eyebrow">REL301m · Bài 0.1 · Tổng quan</span>
<h2>Học tăng cường</h2>
<p class="lead">Học tăng cường (RL) là cách một <strong>tác nhân học hành động qua thử-sai và phần thưởng</strong>. Không có đáp án mẫu — tác nhân thử hành động, nhận tín hiệu phần thưởng, và dần khám phá chiến lược thu về nhiều phần thưởng nhất theo thời gian. Đây là họ phương pháp đứng sau AI chơi game (AlphaGo), điều khiển robot, và hệ gợi ý.</p>
<h3>Vòng lặp lõi</h3>
<pre><code>Tại mỗi bước t:
  tác nhân quan sát trạng thái  S_t
  tác nhân chọn hành động       A_t   (theo chính sách pi)
  môi trường trả về             R_{t+1}  và trạng thái kế S_{t+1}
  mục tiêu: tối đa lợi tức  G_t = R_{t+1} + gamma*R_{t+2} + gamma^2*R_{t+3} + ...
</code></pre>
<h3>Lộ trình</h3>
<p>Quá trình quyết định Markov &amp; phương trình Bellman → phương pháp bảng (quy hoạch động, Monte Carlo, sai phân thời gian, Q-Learning &amp; SARSA) → Deep RL (DQN) &amp; policy gradient (REINFORCE, actor-critic, PPO) → ứng dụng &amp; thách thức. Song ngữ, có code Python/Gymnasium chạy được và một quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('rel301m-1-1-what-is-rl', '1.1 — What is Reinforcement Learning|||1.1 — Học tăng cường là gì',
  'Vòng lặp tác nhân-môi trường, phần thưởng & lợi tức; RL khác học có giám sát/không giám sát; ứng dụng (game, robot, gợi ý).',
  [[
    `<span class="eyebrow">REL301m · Chapter 1 · Lesson 1.1</span>
<h2>What is Reinforcement Learning</h2>
<h3>Agent and environment</h3>
<p>RL frames learning as an <strong>agent</strong> interacting with an <strong>environment</strong>. The agent takes an action, the environment moves to a new state and hands back a scalar <strong>reward</strong>. The agent has one aim: maximize total reward over the long run, not just the next step.</p>
<h3>RL vs supervised vs unsupervised</h3>
<ul>
<li><strong>Supervised</strong> — learns from labelled examples (input to correct output).</li>
<li><strong>Unsupervised</strong> — finds structure in unlabelled data (clusters, patterns).</li>
<li><strong>Reinforcement</strong> — learns from a <em>reward signal</em>, not labels. Feedback is delayed and evaluative ("that was good") rather than instructive ("the answer was X").</li>
</ul>
<h3>Two RL-specific challenges</h3>
<ul>
<li><strong>Delayed reward (credit assignment)</strong> — a reward now may be the payoff of an action many steps ago.</li>
<li><strong>Exploration vs exploitation</strong> — the agent must try new actions to learn, yet also use what it already knows.</li>
</ul>
<pre><code>import gymnasium as gym
env = gym.make("CartPole-v1")
state, info = env.reset(seed=0)
total = 0.0
for t in range(500):
    action = env.action_space.sample()   # random policy for now
    state, reward, terminated, truncated, info = env.step(action)
    total += reward
    if terminated or truncated:
        break
print("episode return:", total)
</code></pre>
<div class="callout"><span class="badge">Applications</span> Games (AlphaGo, Atari), robotics (locomotion, grasping), recommendation, ad bidding, datacenter cooling — anywhere a decision must be made now for a reward that arrives later.</div>`,
    `<span class="eyebrow">REL301m · Chương 1 · Bài 1.1</span>
<h2>Học tăng cường là gì</h2>
<h3>Tác nhân và môi trường</h3>
<p>RL mô hình hoá việc học như một <strong>tác nhân</strong> tương tác với một <strong>môi trường</strong>. Tác nhân thực hiện hành động, môi trường chuyển sang trạng thái mới và trả lại một <strong>phần thưởng</strong> vô hướng. Tác nhân có một mục tiêu: tối đa tổng phần thưởng về lâu dài, không chỉ bước kế tiếp.</p>
<h3>RL khác học có giám sát &amp; không giám sát</h3>
<ul>
<li><strong>Có giám sát</strong> — học từ ví dụ có nhãn (đầu vào ứng với đầu ra đúng).</li>
<li><strong>Không giám sát</strong> — tìm cấu trúc trong dữ liệu không nhãn (cụm, mẫu).</li>
<li><strong>Tăng cường</strong> — học từ <em>tín hiệu phần thưởng</em>, không phải nhãn. Phản hồi bị trễ và mang tính đánh giá ("vừa rồi tốt") chứ không chỉ dẫn ("đáp án là X").</li>
</ul>
<h3>Hai thách thức riêng của RL</h3>
<ul>
<li><strong>Phần thưởng trễ (gán công trạng)</strong> — phần thưởng bây giờ có thể là kết quả của hành động nhiều bước trước.</li>
<li><strong>Khám phá &amp; khai thác</strong> — tác nhân phải thử hành động mới để học, nhưng cũng phải dùng điều đã biết.</li>
</ul>
<pre><code>import gymnasium as gym
env = gym.make("CartPole-v1")
state, info = env.reset(seed=0)
total = 0.0
for t in range(500):
    action = env.action_space.sample()   # tạm dùng chính sách ngẫu nhiên
    state, reward, terminated, truncated, info = env.step(action)
    total += reward
    if terminated or truncated:
        break
print("loi tuc tap:", total)
</code></pre>
<div class="callout"><span class="badge">Ứng dụng</span> Game (AlphaGo, Atari), robot (di chuyển, gắp vật), gợi ý, đấu giá quảng cáo, làm mát trung tâm dữ liệu — bất cứ đâu phải ra quyết định bây giờ cho phần thưởng đến sau.</div>`,
  ]]);

const c1q = quiz('rel301m-quiz-1', 'Quiz 1 — What is RL|||Quiz 1 — RL là gì', [
  { id: 'q1', question: 'RL khác học có giám sát ở điểm cốt lõi nào?', options: ['Học từ nhãn đúng cho từng mẫu', 'Học từ tín hiệu phần thưởng, phản hồi trễ & đánh giá', 'Chỉ gom cụm dữ liệu', 'Không cần dữ liệu'], correctIndex: 1, explanation: 'RL học từ reward (đánh giá, trễ), không phải nhãn đúng như học có giám sát.' },
  { id: 'q2', question: 'Mục tiêu của tác nhân RL là?', options: ['Tối đa phần thưởng bước kế tiếp', 'Tối đa tổng phần thưởng (lợi tức) về lâu dài', 'Tối thiểu số hành động', 'Sao chép dữ liệu huấn luyện'], correctIndex: 1, explanation: 'Tác nhân tối đa lợi tức G_t = tổng phần thưởng có chiết khấu về lâu dài.' },
  { id: 'q3', question: 'Thế lưỡng nan "exploration vs exploitation" nghĩa là?', options: ['Chọn ngôn ngữ lập trình', 'Cân bằng thử hành động mới & dùng điều đã biết', 'Chọn learning rate', 'Nén dữ liệu'], correctIndex: 1, explanation: 'Phải thử cái mới để học, đồng thời khai thác cái đã biết là tốt.' },
]);

const c2 = doc('rel301m-2-1-mdp', '2.1 — Markov Decision Process|||2.1 — Quá trình quyết định Markov',
  'MDP: trạng thái/hành động/phần thưởng/chuyển tiếp; tính Markov; chiết khấu γ; chính sách π; hàm giá trị V(s) & Q(s,a).',
  [[
    `<span class="eyebrow">REL301m · Chapter 2 · Lesson 2.1</span>
<h2>Markov Decision Process (MDP)</h2>
<p>An <strong>MDP</strong> is the formal model of an RL problem. It is the tuple <code>(S, A, P, R, gamma)</code>:</p>
<ul>
<li><strong>S</strong> — the set of <strong>states</strong>.</li>
<li><strong>A</strong> — the set of <strong>actions</strong>.</li>
<li><strong>P</strong> — <strong>transition</strong> probability <code>p(s' | s, a)</code>.</li>
<li><strong>R</strong> — the <strong>reward</strong> function <code>r(s, a)</code>.</li>
<li><strong>gamma</strong> — the <strong>discount</strong> factor in [0, 1], how much future reward is worth now.</li>
</ul>
<h3>The Markov property</h3>
<p>The future depends only on the <em>current</em> state, not the full history: <code>P(S_{t+1} | S_t) = P(S_{t+1} | S_1, ..., S_t)</code>. The state summarizes all that matters.</p>
<h3>Policy and value</h3>
<ul>
<li><strong>Policy pi(a|s)</strong> — the agent's behavior: probability of taking action a in state s.</li>
<li><strong>State value V_pi(s)</strong> — expected return starting from s and following pi.</li>
<li><strong>Action value Q_pi(s,a)</strong> — expected return from taking a in s, then following pi.</li>
</ul>
<pre><code># A tiny MDP as tables
S = ["A", "B", "goal"]
A = ["left", "right"]
gamma = 0.9
# P[s][a] -> list of (prob, next_state, reward)
P = {
  "A": {"right": [(1.0, "B", 0.0)], "left": [(1.0, "A", 0.0)]},
  "B": {"right": [(1.0, "goal", 1.0)], "left": [(1.0, "A", 0.0)]},
}
# a policy pi that always goes right
pi = {"A": "right", "B": "right"}
</code></pre>
<div class="callout"><span class="badge">Why MDPs matter</span> Almost every RL algorithm assumes the problem is (or can be modelled as) an MDP. Getting the state, actions and reward right is most of the battle.</div>`,
    `<span class="eyebrow">REL301m · Chương 2 · Bài 2.1</span>
<h2>Quá trình quyết định Markov (MDP)</h2>
<p>Một <strong>MDP</strong> là mô hình hình thức của bài toán RL. Nó là bộ <code>(S, A, P, R, gamma)</code>:</p>
<ul>
<li><strong>S</strong> — tập <strong>trạng thái</strong>.</li>
<li><strong>A</strong> — tập <strong>hành động</strong>.</li>
<li><strong>P</strong> — xác suất <strong>chuyển tiếp</strong> <code>p(s' | s, a)</code>.</li>
<li><strong>R</strong> — hàm <strong>phần thưởng</strong> <code>r(s, a)</code>.</li>
<li><strong>gamma</strong> — hệ số <strong>chiết khấu</strong> trong [0, 1], phần thưởng tương lai đáng giá bao nhiêu ở hiện tại.</li>
</ul>
<h3>Tính Markov</h3>
<p>Tương lai chỉ phụ thuộc trạng thái <em>hiện tại</em>, không phụ thuộc toàn bộ lịch sử: <code>P(S_{t+1} | S_t) = P(S_{t+1} | S_1, ..., S_t)</code>. Trạng thái tóm tắt mọi thứ quan trọng.</p>
<h3>Chính sách và giá trị</h3>
<ul>
<li><strong>Chính sách pi(a|s)</strong> — hành vi tác nhân: xác suất chọn hành động a ở trạng thái s.</li>
<li><strong>Giá trị trạng thái V_pi(s)</strong> — lợi tức kỳ vọng khi xuất phát từ s và theo pi.</li>
<li><strong>Giá trị hành động Q_pi(s,a)</strong> — lợi tức kỳ vọng khi làm a ở s rồi theo pi.</li>
</ul>
<pre><code># Một MDP tí hon dạng bảng
S = ["A", "B", "goal"]
A = ["left", "right"]
gamma = 0.9
# P[s][a] -> danh sach (xac_suat, trang_thai_ke, phan_thuong)
P = {
  "A": {"right": [(1.0, "B", 0.0)], "left": [(1.0, "A", 0.0)]},
  "B": {"right": [(1.0, "goal", 1.0)], "left": [(1.0, "A", 0.0)]},
}
# chinh sach pi luon di phai
pi = {"A": "right", "B": "right"}
</code></pre>
<div class="callout"><span class="badge">Vì sao MDP quan trọng</span> Gần như mọi thuật toán RL giả định bài toán là (hoặc mô hình hoá được thành) MDP. Chọn đúng trạng thái, hành động và phần thưởng đã là phần lớn thắng lợi.</div>`,
  ]]);

const c2q = quiz('rel301m-quiz-2', 'Quiz 2 — MDP|||Quiz 2 — MDP', [
  { id: 'q1', question: 'MDP gồm những thành phần nào?', options: ['Chỉ trạng thái & hành động', '(S, A, P, R, gamma): trạng thái, hành động, chuyển tiếp, phần thưởng, chiết khấu', 'Chỉ phần thưởng', 'Trọng số mạng nơ-ron'], correctIndex: 1, explanation: 'MDP là bộ (S, A, P, R, gamma).' },
  { id: 'q2', question: 'Hệ số chiết khấu gamma dùng để?', options: ['Đặt tốc độ học', 'Cân giá trị phần thưởng tương lai so với hiện tại', 'Đếm số trạng thái', 'Chuẩn hoá đầu vào'], correctIndex: 1, explanation: 'gamma trong [0,1]: gần 0 chuộng thưởng gần, gần 1 coi trọng thưởng xa.' },
  { id: 'q3', question: 'Q(s,a) khác V(s) ở chỗ nào?', options: ['Không khác gì', 'Q gắn với một hành động cụ thể ở s, V trung bình theo chính sách', 'Q chỉ cho môi trường liên tục', 'V cần mạng nơ-ron còn Q thì không'], correctIndex: 1, explanation: 'Q(s,a) là giá trị khi làm a ở s rồi theo pi; V(s) là giá trị của s theo pi.' },
]);

const c3 = doc('rel301m-3-1-dynamic-programming', '3.1 — Dynamic Programming|||3.1 — Quy hoạch động',
  'Quy hoạch động khi biết mô hình: phương trình Bellman, đánh giá chính sách, policy iteration & value iteration.',
  [[
    `<span class="eyebrow">REL301m · Chapter 3 · Lesson 3.1</span>
<h2>Dynamic Programming (DP)</h2>
<p><strong>Dynamic programming</strong> solves an MDP <em>when the model (P and R) is known</em>. It computes optimal values by repeatedly applying the Bellman equation.</p>
<h3>The Bellman equation</h3>
<pre><code>Bellman expectation (value of a policy pi):
  V(s) = sum_a pi(a|s) * sum_s' p(s'|s,a) * [ r + gamma * V(s') ]

Bellman optimality (value of the best policy):
  V*(s) = max_a sum_s' p(s'|s,a) * [ r + gamma * V*(s') ]
</code></pre>
<h3>Two classic algorithms</h3>
<ul>
<li><strong>Policy iteration</strong> — alternate <em>policy evaluation</em> (compute V for the current pi) and <em>policy improvement</em> (make pi greedy w.r.t. V) until pi stops changing.</li>
<li><strong>Value iteration</strong> — apply the Bellman optimality update directly until V converges, then read off the greedy policy.</li>
</ul>
<pre><code>def value_iteration(S, A, P, R, gamma=0.9, theta=1e-6):
    V = {s: 0.0 for s in S}
    while True:
        delta = 0.0
        for s in S:
            q = [sum(p*(r + gamma*V[nx]) for (p, nx, r) in P[s][a]) for a in A]
            best = max(q)
            delta = max(delta, abs(best - V[s]))
            V[s] = best
        if delta &lt; theta:
            break
    return V
</code></pre>
<div class="callout"><span class="badge">Key idea</span> DP needs a full model, so it rarely scales to real problems — but it is the foundation. Monte Carlo and TD (next chapter) learn the same values <em>without</em> a model, from experience.</div>`,
    `<span class="eyebrow">REL301m · Chương 3 · Bài 3.1</span>
<h2>Quy hoạch động (DP)</h2>
<p><strong>Quy hoạch động</strong> giải MDP <em>khi đã biết mô hình (P và R)</em>. Nó tính giá trị tối ưu bằng cách áp dụng lặp lại phương trình Bellman.</p>
<h3>Phương trình Bellman</h3>
<pre><code>Bellman kỳ vọng (giá trị của chính sách pi):
  V(s) = sum_a pi(a|s) * sum_s' p(s'|s,a) * [ r + gamma * V(s') ]

Bellman tối ưu (giá trị của chính sách tốt nhất):
  V*(s) = max_a sum_s' p(s'|s,a) * [ r + gamma * V*(s') ]
</code></pre>
<h3>Hai thuật toán kinh điển</h3>
<ul>
<li><strong>Policy iteration</strong> — xen kẽ <em>đánh giá chính sách</em> (tính V cho pi hiện tại) và <em>cải thiện chính sách</em> (làm pi tham lam theo V) đến khi pi ngừng đổi.</li>
<li><strong>Value iteration</strong> — áp dụng thẳng cập nhật Bellman tối ưu đến khi V hội tụ, rồi đọc ra chính sách tham lam.</li>
</ul>
<pre><code>def value_iteration(S, A, P, R, gamma=0.9, theta=1e-6):
    V = {s: 0.0 for s in S}
    while True:
        delta = 0.0
        for s in S:
            q = [sum(p*(r + gamma*V[nx]) for (p, nx, r) in P[s][a]) for a in A]
            best = max(q)
            delta = max(delta, abs(best - V[s]))
            V[s] = best
        if delta &lt; theta:
            break
    return V
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> DP cần mô hình đầy đủ nên hiếm khi mở rộng ra bài toán thật — nhưng nó là nền móng. Monte Carlo và TD (chương sau) học đúng những giá trị này mà <em>không</em> cần mô hình, học từ kinh nghiệm.</div>`,
  ]]);

const c3q = quiz('rel301m-quiz-3', 'Quiz 3 — Dynamic Programming|||Quiz 3 — Quy hoạch động', [
  { id: 'q1', question: 'Quy hoạch động (DP) giải MDP với điều kiện gì?', options: ['Không cần biết gì', 'Đã biết mô hình (P và R)', 'Chỉ cần một tập ví dụ có nhãn', 'Chỉ chạy được với mạng nơ-ron'], correctIndex: 1, explanation: 'DP cần biết trước xác suất chuyển tiếp P và phần thưởng R.' },
  { id: 'q2', question: 'Phương trình Bellman tối ưu dùng phép toán nào trên các hành động?', options: ['Trung bình (mean)', 'Lấy max theo hành động', 'Lấy min theo hành động', 'Cộng dồn tất cả'], correctIndex: 1, explanation: 'V*(s) = max_a ... — lấy giá trị lớn nhất theo hành động.' },
  { id: 'q3', question: 'Policy iteration gồm hai bước xen kẽ nào?', options: ['Nạp & lưu', 'Đánh giá chính sách & cải thiện chính sách', 'Khám phá & khai thác', 'Nén & giải nén'], correctIndex: 1, explanation: 'Xen kẽ policy evaluation và policy improvement đến khi ổn định.' },
]);

const c4 = doc('rel301m-4-1-monte-carlo-td', '4.1 — Monte Carlo & Temporal Difference|||4.1 — Monte Carlo & sai phân thời gian',
  'Học không cần mô hình: Monte Carlo (dùng lợi tức trọn tập), TD & TD(0) (bootstrap từng bước), on-policy & off-policy.',
  [[
    `<span class="eyebrow">REL301m · Chapter 4 · Lesson 4.1</span>
<h2>Monte Carlo &amp; Temporal Difference</h2>
<p>These are the first <strong>model-free</strong> methods: they learn values from <em>experience</em>, without knowing P or R.</p>
<h3>Monte Carlo (MC)</h3>
<p>Wait until an episode ends, compute the actual return <code>G_t</code>, and average it. Simple and unbiased, but you must wait for the whole episode and it only works for episodic tasks.</p>
<pre><code>V(S_t) &lt;- V(S_t) + alpha * ( G_t - V(S_t) )     # G_t = full return
</code></pre>
<h3>Temporal Difference (TD)</h3>
<p>TD updates after <em>every step</em>, using its own estimate of the next state — this is <strong>bootstrapping</strong>. The one-step version is <strong>TD(0)</strong>:</p>
<pre><code>V(S_t) &lt;- V(S_t) + alpha * ( R_{t+1} + gamma*V(S_{t+1}) - V(S_t) )
#                             \____ TD target ____/   \_ TD error _/
</code></pre>
<h3>On-policy vs off-policy</h3>
<ul>
<li><strong>On-policy</strong> — learns the value of the policy it is actually following (e.g. SARSA).</li>
<li><strong>Off-policy</strong> — learns about one (target) policy while behaving with another (e.g. Q-Learning learns the greedy policy while exploring).</li>
</ul>
<div class="callout"><span class="badge">MC vs TD</span> MC waits for the true return (high variance, no bias); TD bootstraps every step (low variance, some bias) and can learn online, before an episode finishes. TD is what powers Q-Learning and SARSA next.</div>`,
    `<span class="eyebrow">REL301m · Chương 4 · Bài 4.1</span>
<h2>Monte Carlo &amp; sai phân thời gian</h2>
<p>Đây là các phương pháp <strong>không cần mô hình</strong> đầu tiên: học giá trị từ <em>kinh nghiệm</em>, không cần biết P hay R.</p>
<h3>Monte Carlo (MC)</h3>
<p>Chờ hết một tập (episode), tính lợi tức thực tế <code>G_t</code>, rồi lấy trung bình. Đơn giản và không lệch, nhưng phải chờ trọn tập và chỉ dùng cho bài toán có tập kết thúc.</p>
<pre><code>V(S_t) &lt;- V(S_t) + alpha * ( G_t - V(S_t) )     # G_t = loi tuc tron tap
</code></pre>
<h3>Sai phân thời gian (TD)</h3>
<p>TD cập nhật sau <em>mỗi bước</em>, dùng chính ước lượng của trạng thái kế — đó là <strong>bootstrap</strong>. Bản một bước là <strong>TD(0)</strong>:</p>
<pre><code>V(S_t) &lt;- V(S_t) + alpha * ( R_{t+1} + gamma*V(S_{t+1}) - V(S_t) )
#                             \___ dich TD ___/   \_ sai so TD _/
</code></pre>
<h3>On-policy &amp; off-policy</h3>
<ul>
<li><strong>On-policy</strong> — học giá trị của đúng chính sách đang theo (vd SARSA).</li>
<li><strong>Off-policy</strong> — học về một chính sách (mục tiêu) trong khi hành xử bằng chính sách khác (vd Q-Learning học chính sách tham lam trong lúc khám phá).</li>
</ul>
<div class="callout"><span class="badge">MC khác TD</span> MC chờ lợi tức thật (phương sai cao, không lệch); TD bootstrap mỗi bước (phương sai thấp, có chút lệch) và học online, trước khi tập kết thúc. TD chính là nền của Q-Learning và SARSA ở chương sau.</div>`,
  ]]);

const c4q = quiz('rel301m-quiz-4', 'Quiz 4 — MC & TD|||Quiz 4 — MC & TD', [
  { id: 'q1', question: 'Monte Carlo cập nhật giá trị khi nào?', options: ['Sau mỗi bước', 'Sau khi trọn một tập kết thúc, dùng lợi tức thật G_t', 'Trước khi tập bắt đầu', 'Không bao giờ cập nhật'], correctIndex: 1, explanation: 'MC chờ hết tập rồi dùng lợi tức thực tế G_t.' },
  { id: 'q2', question: '"Bootstrap" trong TD nghĩa là?', options: ['Khởi động máy chủ', 'Cập nhật ước lượng dựa trên ước lượng của trạng thái kế', 'Lấy mẫu dữ liệu có hoàn lại', 'Tăng learning rate dần'], correctIndex: 1, explanation: 'TD dùng chính ước lượng V(S_{t+1}) để cập nhật V(S_t).' },
  { id: 'q3', question: 'Q-Learning thuộc loại nào?', options: ['On-policy', 'Off-policy (học chính sách tham lam trong khi khám phá)', 'Học có giám sát', 'Quy hoạch động'], correctIndex: 1, explanation: 'Q-Learning off-policy: học chính sách tham lam dù đang hành xử khám phá.' },
]);

const c5 = doc('rel301m-5-1-qlearning-sarsa', '5.1 — Q-Learning & SARSA|||5.1 — Q-Learning & SARSA',
  'Điều khiển không mô hình: Q-Learning (off-policy) & SARSA (on-policy), khám phá ε-greedy, cân bằng exploration/exploitation. Có code.',
  [[
    `<span class="eyebrow">REL301m · Chapter 5 · Lesson 5.1</span>
<h2>Q-Learning &amp; SARSA</h2>
<p>These are the workhorse <strong>tabular control</strong> algorithms — they learn the action-value <code>Q(s,a)</code> and derive a policy from it.</p>
<h3>The two updates</h3>
<pre><code>Q-Learning (off-policy, uses the BEST next action):
  Q(s,a) &lt;- Q(s,a) + alpha * ( r + gamma*max_a' Q(s',a') - Q(s,a) )

SARSA (on-policy, uses the action ACTUALLY taken next, a'):
  Q(s,a) &lt;- Q(s,a) + alpha * ( r + gamma*Q(s',a')       - Q(s,a) )
</code></pre>
<h3>Exploration: epsilon-greedy</h3>
<p>To balance <strong>exploration vs exploitation</strong>, act greedily most of the time but pick a random action with probability epsilon (usually decayed over training).</p>
<pre><code>import numpy as np

def epsilon_greedy(Q, s, n_actions, epsilon):
    if np.random.random() &lt; epsilon:
        return np.random.randint(n_actions)   # explore
    return int(np.argmax(Q[s]))                # exploit

def q_learning(env, episodes=2000, alpha=0.1, gamma=0.99, epsilon=0.1):
    Q = np.zeros((env.observation_space.n, env.action_space.n))
    for _ in range(episodes):
        s, _ = env.reset()
        done = False
        while not done:
            a = epsilon_greedy(Q, s, env.action_space.n, epsilon)
            s2, r, term, trunc, _ = env.step(a)
            done = term or trunc
            Q[s, a] += alpha * (r + gamma*np.max(Q[s2]) - Q[s, a])
            s = s2
    return Q
</code></pre>
<div class="callout"><span class="badge">SARSA vs Q-Learning</span> On a cliff-walk, SARSA learns a safer path (it accounts for its own exploration), while Q-Learning learns the optimal but riskier path (it assumes greedy future actions). Same skeleton, one line different.</div>`,
    `<span class="eyebrow">REL301m · Chương 5 · Bài 5.1</span>
<h2>Q-Learning &amp; SARSA</h2>
<p>Đây là hai thuật toán <strong>điều khiển dạng bảng</strong> chủ lực — chúng học giá trị hành động <code>Q(s,a)</code> rồi suy ra chính sách từ đó.</p>
<h3>Hai công thức cập nhật</h3>
<pre><code>Q-Learning (off-policy, dùng hành động TỐT NHẤT kế tiếp):
  Q(s,a) &lt;- Q(s,a) + alpha * ( r + gamma*max_a' Q(s',a') - Q(s,a) )

SARSA (on-policy, dùng hành động THẬT SỰ chọn kế tiếp, a'):
  Q(s,a) &lt;- Q(s,a) + alpha * ( r + gamma*Q(s',a')       - Q(s,a) )
</code></pre>
<h3>Khám phá: epsilon-greedy</h3>
<p>Để cân bằng <strong>khám phá &amp; khai thác</strong>, phần lớn thời gian chọn tham lam nhưng với xác suất epsilon thì chọn ngẫu nhiên (thường giảm dần qua huấn luyện).</p>
<pre><code>import numpy as np

def epsilon_greedy(Q, s, n_actions, epsilon):
    if np.random.random() &lt; epsilon:
        return np.random.randint(n_actions)   # kham pha
    return int(np.argmax(Q[s]))                # khai thac

def q_learning(env, episodes=2000, alpha=0.1, gamma=0.99, epsilon=0.1):
    Q = np.zeros((env.observation_space.n, env.action_space.n))
    for _ in range(episodes):
        s, _ = env.reset()
        done = False
        while not done:
            a = epsilon_greedy(Q, s, env.action_space.n, epsilon)
            s2, r, term, trunc, _ = env.step(a)
            done = term or trunc
            Q[s, a] += alpha * (r + gamma*np.max(Q[s2]) - Q[s, a])
            s = s2
    return Q
</code></pre>
<div class="callout"><span class="badge">SARSA khác Q-Learning</span> Trên bài đi mép vực, SARSA học đường an toàn hơn (nó tính cả việc mình khám phá), còn Q-Learning học đường tối ưu nhưng liều hơn (giả định tương lai luôn tham lam). Cùng khung, chỉ khác một dòng.</div>`,
  ]]);

const c5q = quiz('rel301m-quiz-5', 'Quiz 5 — Q-Learning & SARSA|||Quiz 5 — Q-Learning & SARSA', [
  { id: 'q1', question: 'Khác biệt trong công thức cập nhật của Q-Learning so với SARSA là?', options: ['Q-Learning dùng max theo hành động kế; SARSA dùng giá trị của hành động thật sự chọn kế tiếp', 'Không khác gì', 'Q-Learning không dùng gamma', 'SARSA không dùng phần thưởng'], correctIndex: 0, explanation: 'Q-Learning dùng max (off-policy); SARSA dùng hành động kế thật sự (on-policy).' },
  { id: 'q2', question: 'Chiến lược epsilon-greedy dùng để?', options: ['Chuẩn hoá phần thưởng', 'Cân bằng khám phá & khai thác', 'Giảm số trạng thái', 'Tính gradient'], correctIndex: 1, explanation: 'Với xác suất epsilon chọn ngẫu nhiên (khám phá), còn lại chọn tham lam (khai thác).' },
  { id: 'q3', question: 'Bảng Q trong Q-Learning lưu gì?', options: ['Xác suất chuyển tiếp', 'Giá trị hành động Q(s,a) cho mỗi cặp trạng thái-hành động', 'Trọng số mạng nơ-ron', 'Danh sách phần thưởng thô'], correctIndex: 1, explanation: 'Q[s][a] là ước lượng giá trị của việc làm a tại s.' },
]);

const c6 = doc('rel301m-6-1-deep-rl', '6.1 — Deep Reinforcement Learning|||6.1 — Học tăng cường sâu',
  'Khi không gian trạng thái quá lớn: xấp xỉ hàm bằng mạng nơ-ron, DQN, experience replay, target network.',
  [[
    `<span class="eyebrow">REL301m · Chapter 6 · Lesson 6.1</span>
<h2>Deep Reinforcement Learning</h2>
<p>A Q-table cannot store every pixel-frame of an Atari game. <strong>Function approximation</strong> replaces the table with a neural network <code>Q(s,a; theta)</code> that generalizes across similar states.</p>
<h3>DQN — Deep Q-Network</h3>
<p>DQN (DeepMind, 2015) learned to play Atari from raw pixels. Naively training a network on RL data is unstable, so DQN adds two stabilizers:</p>
<ul>
<li><strong>Experience replay</strong> — store transitions <code>(s, a, r, s')</code> in a buffer and train on random minibatches, breaking the correlation between consecutive samples.</li>
<li><strong>Target network</strong> — a second, slowly-updated copy of the network provides the TD target, so the target does not chase the weights being trained.</li>
</ul>
<pre><code>loss = ( r + gamma * max_a' Q_target(s', a'; theta_minus)
         - Q(s, a; theta) )**2      # minimize by gradient descent on theta

# every C steps: theta_minus &lt;- theta   (refresh the target network)
</code></pre>
<pre><code># In practice you rarely hand-roll DQN:
from stable_baselines3 import DQN
model = DQN("MlpPolicy", "CartPole-v1", buffer_size=50000, verbose=0)
model.learn(total_timesteps=50000)
</code></pre>
<div class="callout"><span class="badge">Why the two tricks</span> Replay + a fixed target turn a moving, correlated regression problem into something close to stable supervised learning. Remove either and DQN often diverges.</div>`,
    `<span class="eyebrow">REL301m · Chương 6 · Bài 6.1</span>
<h2>Học tăng cường sâu</h2>
<p>Bảng Q không thể lưu mọi khung ảnh pixel của một game Atari. <strong>Xấp xỉ hàm</strong> thay bảng bằng một mạng nơ-ron <code>Q(s,a; theta)</code> khái quát hoá giữa các trạng thái tương tự.</p>
<h3>DQN — Deep Q-Network</h3>
<p>DQN (DeepMind, 2015) học chơi Atari từ pixel thô. Huấn luyện mạng thẳng trên dữ liệu RL rất bất ổn, nên DQN thêm hai cơ chế ổn định:</p>
<ul>
<li><strong>Experience replay</strong> — lưu các bước chuyển <code>(s, a, r, s')</code> vào bộ đệm và huấn luyện trên minibatch ngẫu nhiên, phá tương quan giữa các mẫu liên tiếp.</li>
<li><strong>Target network</strong> — một bản sao thứ hai của mạng, cập nhật chậm, cung cấp đích TD, để đích không chạy đuổi theo trọng số đang huấn luyện.</li>
</ul>
<pre><code>loss = ( r + gamma * max_a' Q_target(s', a'; theta_minus)
         - Q(s, a; theta) )**2      # cuc tieu bang gradient descent tren theta

# moi C buoc: theta_minus &lt;- theta   (lam moi target network)
</code></pre>
<pre><code># Thuc te hiem khi tu viet DQN:
from stable_baselines3 import DQN
model = DQN("MlpPolicy", "CartPole-v1", buffer_size=50000, verbose=0)
model.learn(total_timesteps=50000)
</code></pre>
<div class="callout"><span class="badge">Vì sao cần hai mẹo</span> Replay + đích cố định biến một bài hồi quy có tương quan, luôn dịch chuyển thành thứ gần với học có giám sát ổn định. Bỏ một trong hai, DQN thường phân kỳ.</div>`,
  ]]);

const c6q = quiz('rel301m-quiz-6', 'Quiz 6 — Deep RL|||Quiz 6 — Deep RL', [
  { id: 'q1', question: 'Vì sao cần xấp xỉ hàm (mạng nơ-ron) thay cho bảng Q?', options: ['Vì mạng luôn nhanh hơn', 'Vì không gian trạng thái quá lớn (vd pixel) không thể lập bảng', 'Vì bảng Q cần GPU', 'Vì mạng không cần phần thưởng'], correctIndex: 1, explanation: 'Với trạng thái khổng lồ/liên tục, bảng bất khả thi; mạng khái quát hoá được.' },
  { id: 'q2', question: 'Experience replay trong DQN giúp gì?', options: ['Tăng phần thưởng', 'Lưu & lấy mẫu ngẫu nhiên các bước chuyển, phá tương quan mẫu liên tiếp', 'Xoá bộ nhớ mỗi bước', 'Bỏ qua target network'], correctIndex: 1, explanation: 'Replay buffer phá tương quan, ổn định huấn luyện.' },
  { id: 'q3', question: 'Target network dùng để?', options: ['Sinh phần thưởng', 'Cung cấp đích TD ổn định, không chạy đuổi trọng số đang học', 'Nén ảnh đầu vào', 'Thay cho hàm mất mát'], correctIndex: 1, explanation: 'Bản sao cập nhật chậm giữ đích TD ổn định, tránh phân kỳ.' },
]);

const c7 = doc('rel301m-7-1-policy-gradient', '7.1 — Policy Gradient|||7.1 — Policy Gradient',
  'Học thẳng chính sách: REINFORCE, actor-critic (kết hợp giá trị & chính sách), tổng quan A2C & PPO.',
  [[
    `<span class="eyebrow">REL301m · Chapter 7 · Lesson 7.1</span>
<h2>Policy Gradient methods</h2>
<p>Instead of learning values and acting greedily, <strong>policy-gradient</strong> methods learn the policy <code>pi(a|s; theta)</code> directly by gradient ascent on expected return. They handle continuous actions and stochastic policies naturally.</p>
<h3>REINFORCE</h3>
<pre><code>grad J(theta) = E[ grad log pi(a|s; theta) * G_t ]
# push up the log-probability of actions that led to high return G_t
</code></pre>
<h3>Actor-Critic</h3>
<p>REINFORCE has high variance. <strong>Actor-critic</strong> pairs two networks: an <strong>actor</strong> (the policy) and a <strong>critic</strong> (a value estimate). The critic supplies a low-variance baseline — the <strong>advantage</strong> <code>A(s,a) = Q(s,a) - V(s)</code> — telling the actor how much better than average an action was.</p>
<h3>A2C and PPO</h3>
<ul>
<li><strong>A2C</strong> — Advantage Actor-Critic; a synchronous, batched actor-critic.</li>
<li><strong>PPO</strong> — Proximal Policy Optimization; clips each update so the new policy stays close to the old one. Stable, robust, and the default choice for most modern RL work.</li>
</ul>
<pre><code>from stable_baselines3 import PPO
model = PPO("MlpPolicy", "CartPole-v1", verbose=0)
model.learn(total_timesteps=50000)
obs, _ = model.get_env().reset()
action, _ = model.predict(obs, deterministic=True)
</code></pre>
<div class="callout"><span class="badge">Value vs policy</span> Value methods (DQN) shine on discrete actions; policy-gradient methods (PPO) shine on continuous control (robot joints). Actor-critic takes the best of both.</div>`,
    `<span class="eyebrow">REL301m · Chương 7 · Bài 7.1</span>
<h2>Phương pháp Policy Gradient</h2>
<p>Thay vì học giá trị rồi chọn tham lam, phương pháp <strong>policy gradient</strong> học thẳng chính sách <code>pi(a|s; theta)</code> bằng cách tăng gradient theo lợi tức kỳ vọng. Chúng xử lý hành động liên tục và chính sách ngẫu nhiên một cách tự nhiên.</p>
<h3>REINFORCE</h3>
<pre><code>grad J(theta) = E[ grad log pi(a|s; theta) * G_t ]
# nang xac suat log cua hanh dong dan toi loi tuc G_t cao
</code></pre>
<h3>Actor-Critic</h3>
<p>REINFORCE có phương sai cao. <strong>Actor-critic</strong> ghép hai mạng: một <strong>actor</strong> (chính sách) và một <strong>critic</strong> (ước lượng giá trị). Critic cấp một mốc nền phương sai thấp — <strong>lợi thế</strong> <code>A(s,a) = Q(s,a) - V(s)</code> — cho actor biết một hành động tốt hơn mức trung bình bao nhiêu.</p>
<h3>A2C và PPO</h3>
<ul>
<li><strong>A2C</strong> — Advantage Actor-Critic; actor-critic đồng bộ, theo lô.</li>
<li><strong>PPO</strong> — Proximal Policy Optimization; cắt (clip) mỗi lần cập nhật để chính sách mới không đi quá xa chính sách cũ. Ổn định, bền bỉ, và là lựa chọn mặc định cho phần lớn công việc RL hiện đại.</li>
</ul>
<pre><code>from stable_baselines3 import PPO
model = PPO("MlpPolicy", "CartPole-v1", verbose=0)
model.learn(total_timesteps=50000)
obs, _ = model.get_env().reset()
action, _ = model.predict(obs, deterministic=True)
</code></pre>
<div class="callout"><span class="badge">Giá trị & chính sách</span> Phương pháp giá trị (DQN) mạnh với hành động rời rạc; policy gradient (PPO) mạnh với điều khiển liên tục (khớp robot). Actor-critic lấy điểm mạnh của cả hai.</div>`,
  ]]);

const c7q = quiz('rel301m-quiz-7', 'Quiz 7 — Policy Gradient|||Quiz 7 — Policy Gradient', [
  { id: 'q1', question: 'Policy gradient học cái gì trực tiếp?', options: ['Bảng chuyển tiếp', 'Chính sách pi(a|s; theta) qua gradient ascent theo lợi tức', 'Chỉ hàm giá trị V(s)', 'Ma trận phần thưởng'], correctIndex: 1, explanation: 'Nó tối ưu tham số chính sách trực tiếp theo lợi tức kỳ vọng.' },
  { id: 'q2', question: 'Trong actor-critic, "critic" đóng vai trò gì?', options: ['Chọn hành động cuối', 'Ước lượng giá trị làm mốc nền, giảm phương sai cho actor', 'Sinh môi trường', 'Lưu experience replay'], correctIndex: 1, explanation: 'Critic ước lượng giá trị/lợi thế, cho actor tín hiệu phương sai thấp hơn.' },
  { id: 'q3', question: 'PPO ổn định nhờ cơ chế nào?', options: ['Xoá bộ nhớ định kỳ', 'Cắt (clip) cập nhật để chính sách mới không lệch xa chính sách cũ', 'Không dùng phần thưởng', 'Chỉ chạy trên GPU'], correctIndex: 1, explanation: 'PPO giới hạn bước cập nhật bằng clipping, giữ chính sách mới gần chính sách cũ.' },
]);

const c8 = doc('rel301m-8-1-applications-challenges', '8.1 — Applications & challenges|||8.1 — Ứng dụng & thách thức',
  'Ứng dụng thật (robot, AlphaGo); thách thức: reward shaping, hiệu quả mẫu (sample efficiency), an toàn RL.',
  [[
    `<span class="eyebrow">REL301m · Chapter 8 · Lesson 8.1</span>
<h2>Applications &amp; challenges</h2>
<h3>Where RL wins</h3>
<ul>
<li><strong>Games</strong> — <strong>AlphaGo</strong> beat the world Go champion by combining RL with self-play and tree search; AlphaZero learned chess, shogi and Go from scratch.</li>
<li><strong>Robotics</strong> — locomotion, grasping and dexterous manipulation, often trained in simulation then transferred to hardware (sim-to-real).</li>
<li><strong>Systems</strong> — recommendation, ad auctions, datacenter energy, chip layout, and RL from human feedback (RLHF) for aligning language models.</li>
</ul>
<h3>The hard problems</h3>
<ul>
<li><strong>Reward shaping</strong> — a badly designed reward is gamed. Agents exploit loopholes ("reward hacking") instead of doing the intended task.</li>
<li><strong>Sample efficiency</strong> — RL can need millions of interactions. On real robots that is slow and costly, driving the use of simulators and model-based RL.</li>
<li><strong>Safe RL</strong> — exploration on real hardware can break things or harm people; safety constraints and cautious exploration matter.</li>
</ul>
<pre><code># Sim-to-real in spirit: train cheaply in simulation, deploy carefully
from stable_baselines3 import PPO
model = PPO("MlpPolicy", "Pendulum-v1", verbose=0)
model.learn(total_timesteps=200000)   # millions of cheap simulated steps
model.save("pendulum_ppo")            # then evaluate under safety limits
</code></pre>
<div class="callout"><span class="badge">Takeaway</span> RL is powerful when a good simulator and a well-shaped reward exist. Real-world blockers are sample efficiency, reward design and safety — the frontier of current research.</div>`,
    `<span class="eyebrow">REL301m · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng &amp; thách thức</h2>
<h3>Nơi RL thắng lớn</h3>
<ul>
<li><strong>Game</strong> — <strong>AlphaGo</strong> đánh bại nhà vô địch cờ vây thế giới bằng cách kết hợp RL với tự chơi (self-play) và tìm kiếm cây; AlphaZero học cờ vua, shogi và cờ vây từ số không.</li>
<li><strong>Robot</strong> — di chuyển, gắp và thao tác khéo léo, thường huấn luyện trong mô phỏng rồi chuyển sang phần cứng (sim-to-real).</li>
<li><strong>Hệ thống</strong> — gợi ý, đấu giá quảng cáo, năng lượng trung tâm dữ liệu, bố trí chip, và RL từ phản hồi con người (RLHF) để căn chỉnh mô hình ngôn ngữ.</li>
</ul>
<h3>Các bài toán khó</h3>
<ul>
<li><strong>Reward shaping</strong> — phần thưởng thiết kế tồi sẽ bị lợi dụng. Tác nhân khai thác kẽ hở ("reward hacking") thay vì làm đúng việc mong muốn.</li>
<li><strong>Hiệu quả mẫu</strong> — RL có thể cần hàng triệu lần tương tác. Trên robot thật điều đó chậm và tốn kém, thúc đẩy dùng mô phỏng và RL dựa trên mô hình.</li>
<li><strong>An toàn RL</strong> — khám phá trên phần cứng thật có thể làm hỏng máy hoặc gây hại người; ràng buộc an toàn và khám phá thận trọng rất quan trọng.</li>
</ul>
<pre><code># Tinh than sim-to-real: huan luyen re trong mo phong, trien khai than trong
from stable_baselines3 import PPO
model = PPO("MlpPolicy", "Pendulum-v1", verbose=0)
model.learn(total_timesteps=200000)   # hang trieu buoc mo phong gia re
model.save("pendulum_ppo")            # roi danh gia trong gioi han an toan
</code></pre>
<div class="callout"><span class="badge">Điểm cốt lõi</span> RL mạnh khi có mô phỏng tốt và phần thưởng được định hình khéo. Rào cản thực tế là hiệu quả mẫu, thiết kế phần thưởng và an toàn — mặt trận của nghiên cứu hiện nay.</div>`,
  ]]);

const c8q = quiz('rel301m-quiz-8', 'Quiz 8 — Applications & challenges|||Quiz 8 — Ứng dụng & thách thức', [
  { id: 'q1', question: 'AlphaGo là ví dụ RL nổi bật ở lĩnh vực nào?', options: ['Nén ảnh', 'Chơi game/cờ vây bằng RL + tự chơi + tìm kiếm cây', 'Dịch máy', 'Cơ sở dữ liệu'], correctIndex: 1, explanation: 'AlphaGo kết hợp RL, self-play và tìm kiếm cây để chơi cờ vây.' },
  { id: 'q2', question: '"Reward hacking" là hiện tượng gì?', options: ['Tác nhân khai thác kẽ hở của phần thưởng thay vì làm đúng việc', 'Đánh cắp phần thưởng của người khác', 'Tăng learning rate quá cao', 'Lỗi tràn bộ nhớ'], correctIndex: 0, explanation: 'Phần thưởng định hình tồi khiến tác nhân tối đa điểm theo cách ngoài ý muốn.' },
  { id: 'q3', question: 'Vì sao "sample efficiency" là thách thức lớn với robot thật?', options: ['Vì robot không có cảm biến', 'Vì RL cần rất nhiều tương tác, tốn thời gian & chi phí trên phần cứng thật', 'Vì phần thưởng luôn âm', 'Vì mô phỏng bị cấm'], correctIndex: 1, explanation: 'RL thường cần hàng triệu bước; trên robot thật điều đó chậm và tốn kém.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'REL301m',
    slug: 'rel301m-reinforcement-learning',
    title: 'Reinforcement Learning',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/REL301m.webp',
    shortDescription: 'How agents learn by trial & reward — MDPs, dynamic programming, Monte Carlo & TD, Q-Learning & SARSA, Deep RL (DQN), policy gradients (REINFORCE, PPO) & real uses (robots, AlphaGo). Bilingual, Python/Gymnasium code & quizzes.|||Tác nhân học qua thử-sai & phần thưởng — MDP, quy hoạch động, Monte Carlo & TD, Q-Learning & SARSA, Deep RL (DQN), policy gradient (REINFORCE, PPO) & ứng dụng thật (robot, AlphaGo). Song ngữ, code Python/Gymnasium & quiz.',
    description: 'Môn <strong>REL301m — Reinforcement Learning</strong> (kỳ 8, ngành Robotics &amp; AI) dạy cách một <strong>tác nhân học hành động qua thử-sai và phần thưởng</strong>. Từ <strong>nền tảng</strong> (vòng lặp tác nhân-môi trường, MDP, phương trình Bellman) → <strong>phương pháp bảng</strong> (quy hoạch động, Monte Carlo &amp; TD, Q-Learning &amp; SARSA, ε-greedy) → <strong>Deep RL</strong> (xấp xỉ hàm, DQN, experience replay, target network) → <strong>policy gradient</strong> (REINFORCE, actor-critic, A2C/PPO) → <strong>ứng dụng &amp; thách thức</strong> (robot, AlphaGo, reward shaping, hiệu quả mẫu, an toàn). Bám sách Sutton &amp; Barto và David Silver RL Course, song ngữ, có công thức và code Python/Gymnasium chạy được, quiz mỗi chương.',
    whatYouLearn: 'Vòng lặp tác nhân-môi trường &amp; phần thưởng; MDP (S, A, P, R, γ), chính sách π, giá trị V(s) &amp; Q(s,a); phương trình Bellman &amp; quy hoạch động (policy/value iteration); Monte Carlo, TD(0), on/off-policy; Q-Learning &amp; SARSA với ε-greedy; xấp xỉ hàm, DQN, experience replay &amp; target network; policy gradient (REINFORCE, actor-critic, A2C/PPO); huấn luyện agent trên Gymnasium với Stable-Baselines3; reward shaping, hiệu quả mẫu &amp; an toàn RL.',
    requirements: 'Xác suất &amp; đại số tuyến tính cơ bản, Python. Nên biết mạng nơ-ron (cho chương Deep RL). Cài Gymnasium &amp; Stable-Baselines3 để chạy thử code.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, Sutton & Barto, David Silver, Spinning Up, Gymnasium, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'RL là gì, vòng lặp tác nhân-môi trường-phần thưởng, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — RL là gì|||Chapter 1 — What is RL', description: 'Tác nhân-môi trường, phần thưởng, RL vs supervised/unsupervised, ứng dụng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — MDP|||Chapter 2 — Markov Decision Process', description: 'State/action/reward/transition, γ, chính sách π, giá trị V & Q.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Quy hoạch động|||Chapter 3 — Dynamic Programming', description: 'Bellman, policy iteration, value iteration.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Monte Carlo & TD|||Chapter 4 — Monte Carlo & TD', description: 'Monte Carlo, TD(0), on/off-policy.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Q-Learning & SARSA|||Chapter 5 — Q-Learning & SARSA', description: 'Q-learning, SARSA, ε-greedy, khám phá/khai thác, code.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Deep RL|||Chapter 6 — Deep RL', description: 'Xấp xỉ hàm, DQN, experience replay, target network.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Policy Gradient|||Chapter 7 — Policy Gradient', description: 'REINFORCE, actor-critic, A2C/PPO.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng & thách thức|||Chapter 8 — Applications & challenges', description: 'Robot, AlphaGo, reward shaping, sample efficiency, an toàn RL.', lessons: [c8, c8q] },
  ],
};
