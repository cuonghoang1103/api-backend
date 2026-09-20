/**
 * RAI101 — Introduction to Robotics and Artificial Intelligence (ngành Robotics
 * & AI, FPTU). Khung 8 chương: tổng quan robot & AI, thành phần robot, hệ toạ độ
 * & động học, cảm biến & nhận thức, điều khiển & vận động, nhập môn AI, AI cho
 * robot, ứng dụng & đạo đức. Sách: Siegwart (Autonomous Mobile Robots),
 * Russell & Norvig (AIMA), Craig (Introduction to Robotics), ROS docs.
 * Song ngữ VI+EN + quiz mỗi chương. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${ lồng; "&"→"&amp;" trong HTML; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('rai101-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Siegwart, AIMA, Craig), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">RAI101 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to start in Robotics &amp; Artificial Intelligence — robot anatomy, kinematics, sensing, control, and the AI that makes robots think — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for RAI101 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (international standard)</h3>
<ul>
<li>Siegwart, Nourbakhsh &amp; Scaramuzza — <em>Introduction to Autonomous Mobile Robots</em> (locomotion, sensing, localization, navigation)</li>
<li>Russell &amp; Norvig — <em>Artificial Intelligence: A Modern Approach (AIMA)</em> (agents, search, learning)</li>
<li>Craig — <em>Introduction to Robotics: Mechanics and Control</em> (frames, kinematics, control)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.ros.org/" target="_blank" rel="noopener">ROS documentation (docs.ros.org)</a> — the standard robot middleware</li>
<li><a href="https://ocw.mit.edu/" target="_blank" rel="noopener">MIT OpenCourseWare</a> — robotics &amp; AI lecture material</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ArtOfTheProblem" target="_blank" rel="noopener">Art of the Problem</a> — how machines learn, clearly explained</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — the maths behind neural networks &amp; vectors</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.ros.org/" target="_blank" rel="noopener">ROS (Robot Operating System)</a> — nodes, topics, message passing</li>
<li><a href="https://gazebosim.org/" target="_blank" rel="noopener">Gazebo</a> — physics-based robot simulation</li>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — simulate sensors &amp; actuators with Arduino</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — what a robot is, its components (sensors, actuators, controller), coordinate frames &amp; degrees of freedom, and what an AI agent is.</li>
<li><strong>Practice</strong> — model a simple robot in simulation (Gazebo/Tinkercad); read sensor values and drive actuators.</li>
<li><strong>Go deeper</strong> — kinematics, control loops (PID), search &amp; planning, and machine learning for perception.</li>
<li><strong>Job-ready</strong> — build a small mobile robot, wire it in ROS, and apply an AI method to a real task.</li>
</ol></div>`,
    `<span class="eyebrow">RAI101 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để bắt đầu với Robotics &amp; Trí tuệ nhân tạo — cấu tạo robot, động học, cảm biến, điều khiển, và phần AI giúp robot "suy nghĩ" — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của RAI101 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (chuẩn quốc tế)</h3>
<ul>
<li>Siegwart, Nourbakhsh &amp; Scaramuzza — <em>Introduction to Autonomous Mobile Robots</em> (vận động, cảm biến, định vị, dẫn đường)</li>
<li>Russell &amp; Norvig — <em>Artificial Intelligence: A Modern Approach (AIMA)</em> (agent, tìm kiếm, học máy)</li>
<li>Craig — <em>Introduction to Robotics: Mechanics and Control</em> (hệ toạ độ, động học, điều khiển)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.ros.org/" target="_blank" rel="noopener">Tài liệu ROS (docs.ros.org)</a> — middleware robot chuẩn</li>
<li><a href="https://ocw.mit.edu/" target="_blank" rel="noopener">MIT OpenCourseWare</a> — tài liệu bài giảng robotics &amp; AI</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ArtOfTheProblem" target="_blank" rel="noopener">Art of the Problem</a> — máy học ra sao, giảng rõ ràng</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — toán sau mạng nơ-ron &amp; vector</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.ros.org/" target="_blank" rel="noopener">ROS (Robot Operating System)</a> — node, topic, truyền tin nhắn</li>
<li><a href="https://gazebosim.org/" target="_blank" rel="noopener">Gazebo</a> — mô phỏng robot theo vật lý</li>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — mô phỏng cảm biến &amp; cơ cấu chấp hành với Arduino</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — robot là gì, các thành phần (cảm biến, cơ cấu chấp hành, bộ điều khiển), hệ toạ độ &amp; bậc tự do, và agent AI là gì.</li>
<li><strong>Luyện tập</strong> — mô phỏng một robot đơn giản (Gazebo/Tinkercad); đọc giá trị cảm biến và điều khiển cơ cấu chấp hành.</li>
<li><strong>Đào sâu</strong> — động học, vòng điều khiển (PID), tìm kiếm &amp; lập kế hoạch, và học máy cho nhận thức.</li>
<li><strong>Sẵn sàng đi làm</strong> — ráp một robot di động nhỏ, nối trong ROS, và áp dụng một phương pháp AI vào bài toán thật.</li>
</ol></div>`,
  ]]);

const intro = doc('rai101-0-1-overview', 'Course overview: Robotics & Artificial Intelligence|||Tổng quan: Robotics & Trí tuệ nhân tạo',
  'Robot & AI là gì, vì sao đi cùng nhau; vòng sense–think–act; lộ trình: thành phần → động học → cảm biến → điều khiển → AI → AI cho robot → ứng dụng & đạo đức.',
  [[
    `<span class="eyebrow">RAI101 · Lesson 0.1 · Overview</span>
<h2>Robotics &amp; Artificial Intelligence</h2>
<p class="lead">This course introduces <strong>how robots work</strong> and <strong>how AI makes them intelligent</strong>. A robot is a machine that can <em>sense</em> its environment, <em>decide</em> what to do, and <em>act</em> on the physical world — Artificial Intelligence is the "decide" part done well.</p>
<h3>The sense–think–act loop</h3>
<ul>
<li><strong>Sense</strong> — sensors (camera, lidar, encoders) turn the world into data.</li>
<li><strong>Think</strong> — a controller or AI agent decides the next action from that data and a goal.</li>
<li><strong>Act</strong> — actuators (motors, wheels, grippers) change the world.</li>
</ul>
<p>Every autonomous system — a self-driving car, a warehouse robot, a robot arm — is just this loop, running fast.</p>
<h3>Why robotics and AI belong together</h3>
<p>Mechanics and electronics give a robot a <strong>body</strong>; AI gives it a <strong>brain</strong>. A robot without AI only repeats fixed motions; AI lets it perceive, plan, and adapt to a changing world.</p>
<h3>Roadmap</h3>
<p>Overview → robot components → coordinate frames &amp; kinematics → sensors &amp; perception → control &amp; motion → introduction to AI → AI for robots → applications &amp; ethics. Bilingual, with real robots and systems as examples and a quiz each chapter.</p>`,
    `<span class="eyebrow">RAI101 · Bài 0.1 · Tổng quan</span>
<h2>Robotics &amp; Trí tuệ nhân tạo</h2>
<p class="lead">Môn này giới thiệu <strong>robot hoạt động thế nào</strong> và <strong>AI làm robot thông minh ra sao</strong>. Robot là cỗ máy có thể <em>cảm nhận</em> môi trường, <em>quyết định</em> làm gì, và <em>hành động</em> lên thế giới vật lý — Trí tuệ nhân tạo chính là phần "quyết định" được làm tốt.</p>
<h3>Vòng cảm nhận – suy nghĩ – hành động (sense–think–act)</h3>
<ul>
<li><strong>Cảm nhận (sense)</strong> — cảm biến (camera, lidar, encoder) biến thế giới thành dữ liệu.</li>
<li><strong>Suy nghĩ (think)</strong> — bộ điều khiển hoặc agent AI quyết định hành động kế tiếp từ dữ liệu đó và một mục tiêu.</li>
<li><strong>Hành động (act)</strong> — cơ cấu chấp hành (động cơ, bánh xe, tay kẹp) thay đổi thế giới.</li>
</ul>
<p>Mọi hệ tự hành — xe tự lái, robot kho hàng, cánh tay robot — đều chỉ là vòng lặp này chạy thật nhanh.</p>
<h3>Vì sao robotics và AI đi cùng nhau</h3>
<p>Cơ khí và điện tử cho robot một <strong>thân xác</strong>; AI cho nó một <strong>bộ não</strong>. Robot không có AI chỉ lặp lại các chuyển động cố định; AI giúp nó nhận thức, lập kế hoạch, và thích nghi với thế giới thay đổi.</p>
<h3>Lộ trình</h3>
<p>Tổng quan → thành phần robot → hệ toạ độ &amp; động học → cảm biến &amp; nhận thức → điều khiển &amp; vận động → nhập môn AI → AI cho robot → ứng dụng &amp; đạo đức. Song ngữ, lấy robot và hệ thống thật làm ví dụ, có quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('rai101-1-1-overview', '1.1 — Overview of Robotics & AI|||1.1 — Tổng quan Robotics & AI',
  'Định nghĩa robot & AI, lịch sử ngắn, các loại robot (công nghiệp, di động, phỏng sinh, dịch vụ), mối liên hệ robot–AI.',
  [[
    `<span class="eyebrow">RAI101 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of Robotics &amp; AI</h2>
<h3>Definitions</h3>
<ul>
<li><strong>Robot</strong> — a programmable machine that senses, computes, and acts physically to perform tasks, with some degree of autonomy.</li>
<li><strong>Artificial Intelligence</strong> — the study of building systems that perform tasks normally needing human intelligence: perceiving, reasoning, learning, and deciding.</li>
</ul>
<h3>A short history</h3>
<p>From the first industrial arm <strong>Unimate</strong> (1961) on car assembly lines, to mobile robots and today's AI-driven autonomous systems. Two threads — mechanical automation and machine intelligence — that increasingly merge.</p>
<h3>Types of robots</h3>
<ul>
<li><strong>Industrial</strong> — fixed arms welding/assembling in factories (e.g. KUKA, FANUC).</li>
<li><strong>Mobile</strong> — wheeled, legged or flying robots that move through space (warehouse AGVs, drones).</li>
<li><strong>Humanoid / biomimetic</strong> — mimic human or animal form (Boston Dynamics Atlas, Spot).</li>
<li><strong>Service</strong> — robots that assist people (vacuum, delivery, surgical).</li>
</ul>
<div class="callout"><span class="badge">Robot + AI</span> Classic robots follow pre-programmed motions. Adding AI — perception, planning, learning — turns a repeating machine into one that adapts to a world it has never seen exactly before.</div>`,
    `<span class="eyebrow">RAI101 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan Robotics &amp; AI</h2>
<h3>Định nghĩa</h3>
<ul>
<li><strong>Robot</strong> — cỗ máy lập trình được, biết cảm nhận, tính toán và hành động vật lý để thực hiện nhiệm vụ, với một mức tự chủ nhất định.</li>
<li><strong>Trí tuệ nhân tạo</strong> — ngành xây dựng hệ thống làm được những việc thường cần trí thông minh con người: nhận thức, suy luận, học, và ra quyết định.</li>
</ul>
<h3>Lịch sử ngắn</h3>
<p>Từ cánh tay công nghiệp đầu tiên <strong>Unimate</strong> (1961) trên dây chuyền lắp ráp ô tô, đến robot di động và các hệ tự hành dẫn dắt bởi AI ngày nay. Hai dòng chảy — tự động hoá cơ khí và trí thông minh máy — ngày càng hoà vào nhau.</p>
<h3>Các loại robot</h3>
<ul>
<li><strong>Công nghiệp</strong> — cánh tay cố định hàn/lắp ráp trong nhà máy (vd KUKA, FANUC).</li>
<li><strong>Di động</strong> — robot bánh xe, chân hoặc bay di chuyển trong không gian (AGV kho hàng, drone).</li>
<li><strong>Phỏng người / phỏng sinh</strong> — mô phỏng hình dáng người hoặc động vật (Atlas, Spot của Boston Dynamics).</li>
<li><strong>Dịch vụ</strong> — robot hỗ trợ con người (hút bụi, giao hàng, phẫu thuật).</li>
</ul>
<div class="callout"><span class="badge">Robot + AI</span> Robot cổ điển đi theo chuyển động lập trình sẵn. Thêm AI — nhận thức, lập kế hoạch, học — biến cỗ máy lặp lại thành cỗ máy thích nghi với thế giới nó chưa từng gặp y hệt trước đó.</div>`,
  ]]);

const c1q = quiz('rai101-quiz-1', 'Quiz 1 — Overview|||Quiz 1 — Tổng quan', [
  { id: 'q1', question: 'Robot khác với máy tự động thuần cơ khí ở chỗ nào?', options: ['Luôn có hình người', 'Biết cảm nhận, tính toán và hành động với mức tự chủ', 'Không cần điện', 'Chỉ chạy trong nhà máy'], correctIndex: 1, explanation: 'Robot = sense + compute + act, có tự chủ ở mức nào đó.' },
  { id: 'q2', question: 'Robot công nghiệp đầu tiên trên dây chuyền ô tô là?', options: ['Atlas', 'Spot', 'Unimate', 'ASIMO'], correctIndex: 2, explanation: 'Unimate (1961) là cánh tay công nghiệp đầu tiên.' },
  { id: 'q3', question: 'AI thêm vào robot điều gì so với robot lập trình sẵn?', options: ['Chỉ chạy nhanh hơn', 'Khả năng nhận thức, lập kế hoạch và thích nghi', 'Nhiều động cơ hơn', 'Bỏ được cảm biến'], correctIndex: 1, explanation: 'AICho robot khả năng thích nghi thay vì lặp chuyển động cố định.' },
]);

const c2 = doc('rai101-2-1-components', '2.1 — Robot components|||2.1 — Thành phần robot',
  'Các khối của robot: cảm biến (đầu vào), cơ cấu chấp hành (đầu ra), bộ điều khiển (não), nguồn, kiến trúc kết nối các khối.',
  [[
    `<span class="eyebrow">RAI101 · Chapter 2 · Lesson 2.1</span>
<h2>Robot components</h2>
<p>Every robot, from a toy to a Mars rover, is built from the same functional blocks.</p>
<ul>
<li><strong>Sensors (input)</strong> — measure the world and the robot's own state: cameras, lidar, ultrasonic, encoders, IMU.</li>
<li><strong>Actuators (output)</strong> — do physical work: DC/servo/stepper motors, wheels, joints, grippers.</li>
<li><strong>Controller (brain)</strong> — a microcontroller or computer that reads sensors, runs the program, and commands actuators.</li>
<li><strong>Power</strong> — batteries or mains supply; often the limiting factor on how far/long a robot works.</li>
</ul>
<h3>Architecture ties them together</h3>
<pre><code>Sensors -> Controller -> Actuators
   ^                          |
   +------ physical world <---+
</code></pre>
<p>The <strong>architecture</strong> is how these are wired and how data flows — commonly the <em>sense–plan–act</em> pipeline, sometimes reactive (sensor straight to actuator) for fast reflexes.</p>
<div class="callout"><span class="badge">Real example</span> A robot vacuum: bump &amp; cliff sensors + wheel encoders (sense) → an MCU deciding turn/continue (controller) → drive motors + brush (act) → LiPo battery (power).</div>`,
    `<span class="eyebrow">RAI101 · Chương 2 · Bài 2.1</span>
<h2>Thành phần robot</h2>
<p>Mọi robot, từ đồ chơi đến xe tự hành trên sao Hoả, đều dựng từ cùng những khối chức năng.</p>
<ul>
<li><strong>Cảm biến (đầu vào)</strong> — đo thế giới và trạng thái của chính robot: camera, lidar, siêu âm, encoder, IMU.</li>
<li><strong>Cơ cấu chấp hành (đầu ra)</strong> — làm việc vật lý: động cơ DC/servo/bước, bánh xe, khớp, tay kẹp.</li>
<li><strong>Bộ điều khiển (não)</strong> — vi điều khiển hoặc máy tính đọc cảm biến, chạy chương trình, và ra lệnh cho cơ cấu chấp hành.</li>
<li><strong>Nguồn</strong> — pin hoặc điện lưới; thường là yếu tố giới hạn robot chạy xa/lâu bao nhiêu.</li>
</ul>
<h3>Kiến trúc gắn chúng lại</h3>
<pre><code>Cảm biến -> Bộ điều khiển -> Cơ cấu chấp hành
   ^                              |
   +-------- thế giới vật lý <----+
</code></pre>
<p><strong>Kiến trúc</strong> là cách nối các khối và cách dữ liệu chảy — phổ biến là mạch <em>cảm nhận–lập kế hoạch–hành động</em>, đôi khi phản xạ (cảm biến nối thẳng chấp hành) để phản ứng nhanh.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Robot hút bụi: cảm biến va chạm &amp; vực + encoder bánh (cảm nhận) → MCU quyết định rẽ/đi tiếp (điều khiển) → động cơ dẫn động + chổi (hành động) → pin LiPo (nguồn).</div>`,
  ]]);

const c2q = quiz('rai101-quiz-2', 'Quiz 2 — Components|||Quiz 2 — Thành phần', [
  { id: 'q1', question: 'Thành phần nào biến thế giới thành dữ liệu cho robot?', options: ['Cơ cấu chấp hành', 'Cảm biến', 'Nguồn', 'Khung cơ khí'], correctIndex: 1, explanation: 'Cảm biến là đầu vào: đo môi trường và trạng thái robot.' },
  { id: 'q2', question: 'Cơ cấu chấp hành (actuator) làm gì?', options: ['Đọc môi trường', 'Thực hiện công việc vật lý (động cơ, khớp, tay kẹp)', 'Lưu chương trình', 'Cấp điện'], correctIndex: 1, explanation: 'Actuator là đầu ra: động cơ, bánh xe, tay kẹp.' },
  { id: 'q3', question: 'Mạch xử lý phổ biến của robot là?', options: ['Act–sense–power', 'Sense–plan–act (cảm nhận–lập kế hoạch–hành động)', 'Power–act–sense', 'Chỉ act'], correctIndex: 1, explanation: 'Kiến trúc kinh điển: sense → plan → act.' },
]);

const c3 = doc('rai101-3-1-frames-kinematics', '3.1 — Coordinate frames & kinematics|||3.1 — Hệ toạ độ & động học',
  'Frame & phép biến đổi, bậc tự do (DOF), động học thuận (khớp→vị trí) và động học ngược (vị trí→khớp) cơ bản.',
  [[
    `<span class="eyebrow">RAI101 · Chapter 3 · Lesson 3.1</span>
<h2>Coordinate frames &amp; kinematics</h2>
<h3>Frames &amp; transformations</h3>
<p>To describe where anything is, robotics attaches a <strong>coordinate frame</strong> (x, y, z axes) to the world, to the robot base, and to each joint. A <strong>transformation</strong> (rotation + translation) converts a point from one frame to another — the maths that lets the controller reason about "where the gripper is" in world coordinates.</p>
<h3>Degrees of freedom (DOF)</h3>
<p><strong>DOF</strong> = the number of independent movements a robot has. A robot arm with 6 DOF can reach any position AND orientation in its workspace — that's why industrial arms usually have 6 joints.</p>
<h3>Forward vs inverse kinematics</h3>
<ul>
<li><strong>Forward kinematics</strong> — given the joint angles, compute where the end-effector (hand) is. Always has one answer.</li>
<li><strong>Inverse kinematics</strong> — given a desired hand position, compute the joint angles needed. Harder: may have several solutions or none.</li>
</ul>
<pre><code>Forward:  joint angles ---> end-effector pose   (direct)
Inverse:  end-effector pose ---> joint angles   (solve, may be multi/none)
</code></pre>
<div class="callout"><span class="badge">Real example</span> To make a robot arm pick a cup at a known spot, the controller solves inverse kinematics for the joint angles, then commands the motors to those angles.</div>`,
    `<span class="eyebrow">RAI101 · Chương 3 · Bài 3.1</span>
<h2>Hệ toạ độ &amp; động học</h2>
<h3>Frame &amp; phép biến đổi</h3>
<p>Để mô tả một vật ở đâu, robotics gắn một <strong>hệ toạ độ (frame)</strong> (trục x, y, z) vào thế giới, vào thân robot, và vào từng khớp. Một <strong>phép biến đổi</strong> (xoay + tịnh tiến) đổi một điểm từ frame này sang frame khác — phần toán giúp bộ điều khiển hiểu "tay kẹp đang ở đâu" theo toạ độ thế giới.</p>
<h3>Bậc tự do (DOF)</h3>
<p><strong>DOF (bậc tự do)</strong> = số chuyển động độc lập của robot. Cánh tay 6 DOF có thể tới mọi vị trí VÀ hướng trong vùng làm việc — vì thế cánh tay công nghiệp thường có 6 khớp.</p>
<h3>Động học thuận và ngược</h3>
<ul>
<li><strong>Động học thuận (forward)</strong> — biết góc các khớp, tính ra đầu công tác (bàn tay) ở đâu. Luôn có một đáp án.</li>
<li><strong>Động học ngược (inverse)</strong> — biết vị trí tay mong muốn, tính ra góc khớp cần đặt. Khó hơn: có thể nhiều nghiệm hoặc không nghiệm.</li>
</ul>
<pre><code>Thuận:  góc khớp ---> tư thế đầu công tác   (trực tiếp)
Ngược:  tư thế đầu công tác ---> góc khớp   (giải, có thể nhiều/không)
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Để cánh tay robot gắp cốc ở vị trí đã biết, bộ điều khiển giải động học ngược ra góc khớp, rồi lệnh động cơ về đúng các góc đó.</div>`,
  ]]);

const c3q = quiz('rai101-quiz-3', 'Quiz 3 — Frames & kinematics|||Quiz 3 — Frame & động học', [
  { id: 'q1', question: 'Bậc tự do (DOF) của robot là?', options: ['Số cảm biến', 'Số chuyển động độc lập', 'Số pin', 'Số dòng lệnh'], correctIndex: 1, explanation: 'DOF = số chuyển động độc lập robot có thể thực hiện.' },
  { id: 'q2', question: 'Động học thuận (forward kinematics) tính gì?', options: ['Góc khớp từ vị trí tay', 'Vị trí đầu công tác từ góc khớp', 'Lực từ dòng điện', 'Vận tốc từ điện áp'], correctIndex: 1, explanation: 'Forward: góc khớp → tư thế đầu công tác (một đáp án).' },
  { id: 'q3', question: 'Vì sao động học ngược khó hơn thuận?', options: ['Cần nhiều pin hơn', 'Có thể có nhiều nghiệm hoặc không có nghiệm', 'Không dùng toán', 'Chỉ chạy trên mô phỏng'], correctIndex: 1, explanation: 'Inverse: một vị trí tay có thể ứng nhiều bộ góc khớp, hoặc không đạt được.' },
]);

const c4 = doc('rai101-4-1-sensors-perception', '4.1 — Sensors & perception|||4.1 — Cảm biến & nhận thức',
  'Các loại cảm biến (encoder, IMU, lidar, camera, siêu âm); nội cảm vs ngoại cảm; nhận thức = biến dữ liệu thô thành hiểu biết môi trường.',
  [[
    `<span class="eyebrow">RAI101 · Chapter 4 · Lesson 4.1</span>
<h2>Sensors &amp; perception</h2>
<h3>Common sensors</h3>
<ul>
<li><strong>Encoder</strong> — measures how far a wheel/joint has turned (odometry, position feedback).</li>
<li><strong>IMU</strong> — accelerometer + gyroscope: measures acceleration and rotation, so the robot knows its orientation.</li>
<li><strong>Lidar</strong> — fires laser pulses and times the echo to build a precise distance map of surroundings.</li>
<li><strong>Camera</strong> — rich 2D images; the input to computer vision.</li>
<li><strong>Ultrasonic / IR</strong> — cheap distance sensing for obstacle detection.</li>
</ul>
<h3>Proprioceptive vs exteroceptive</h3>
<ul>
<li><strong>Proprioceptive</strong> (internal) — encoders, IMU: sense the robot's own state.</li>
<li><strong>Exteroceptive</strong> (external) — lidar, camera: sense the outside world.</li>
</ul>
<h3>From data to perception</h3>
<p><strong>Perception</strong> is turning raw sensor data into useful understanding: "there is a wall 0.5 m ahead", "that is a person". Because sensors are noisy, robots often <strong>fuse</strong> several sensors (e.g. IMU + encoders + lidar) for a reliable estimate.</p>
<div class="callout"><span class="badge">Real example</span> A self-driving car fuses camera (what) + lidar (how far) + IMU/GPS (where am I) — no single sensor is trusted alone.</div>`,
    `<span class="eyebrow">RAI101 · Chương 4 · Bài 4.1</span>
<h2>Cảm biến &amp; nhận thức</h2>
<h3>Các cảm biến thường gặp</h3>
<ul>
<li><strong>Encoder</strong> — đo bánh/khớp đã quay bao nhiêu (đo hành trình, phản hồi vị trí).</li>
<li><strong>IMU</strong> — gia tốc kế + con quay hồi chuyển: đo gia tốc và xoay, để robot biết hướng của mình.</li>
<li><strong>Lidar</strong> — bắn xung laser và đo thời gian phản hồi để dựng bản đồ khoảng cách chính xác quanh mình.</li>
<li><strong>Camera</strong> — ảnh 2D giàu thông tin; đầu vào của thị giác máy tính.</li>
<li><strong>Siêu âm / hồng ngoại</strong> — đo khoảng cách rẻ để phát hiện vật cản.</li>
</ul>
<h3>Nội cảm và ngoại cảm</h3>
<ul>
<li><strong>Nội cảm (proprioceptive)</strong> — encoder, IMU: cảm nhận trạng thái của chính robot.</li>
<li><strong>Ngoại cảm (exteroceptive)</strong> — lidar, camera: cảm nhận thế giới bên ngoài.</li>
</ul>
<h3>Từ dữ liệu đến nhận thức</h3>
<p><strong>Nhận thức (perception)</strong> là biến dữ liệu cảm biến thô thành hiểu biết hữu ích: "có tường cách 0,5 m phía trước", "kia là một người". Vì cảm biến nhiễu, robot thường <strong>hợp nhất (fuse)</strong> nhiều cảm biến (vd IMU + encoder + lidar) để có ước lượng tin cậy.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Xe tự lái hợp nhất camera (là gì) + lidar (cách bao xa) + IMU/GPS (mình ở đâu) — không tin cậy riêng một cảm biến nào.</div>`,
  ]]);

const c4q = quiz('rai101-quiz-4', 'Quiz 4 — Sensors & perception|||Quiz 4 — Cảm biến & nhận thức', [
  { id: 'q1', question: 'Cảm biến nào dựng bản đồ khoảng cách bằng xung laser?', options: ['Encoder', 'IMU', 'Lidar', 'Micro'], correctIndex: 2, explanation: 'Lidar đo thời gian phản hồi laser → bản đồ khoảng cách.' },
  { id: 'q2', question: 'Cảm biến nội cảm (proprioceptive) đo gì?', options: ['Thế giới bên ngoài', 'Trạng thái của chính robot (vd encoder, IMU)', 'Nhiệt độ phòng', 'Ánh sáng mặt trời'], correctIndex: 1, explanation: 'Nội cảm = trạng thái của robot; ngoại cảm = môi trường ngoài.' },
  { id: 'q3', question: 'Vì sao robot thường hợp nhất (fuse) nhiều cảm biến?', options: ['Để tốn pin hơn', 'Vì mỗi cảm biến nhiễu; hợp nhất cho ước lượng tin cậy', 'Để bớt dây', 'Vì luật bắt buộc'], correctIndex: 1, explanation: 'Cảm biến nhiễu; sensor fusion cho ước lượng ổn định hơn.' },
]);

const c5 = doc('rai101-5-1-control-motion', '5.1 — Control & motion|||5.1 — Điều khiển & vận động',
  'Vòng điều khiển kín (feedback), bộ điều khiển PID cơ bản, vận động (locomotion: bánh/chân), dẫn đường (navigation) từ A tới B tránh vật cản.',
  [[
    `<span class="eyebrow">RAI101 · Chapter 5 · Lesson 5.1</span>
<h2>Control &amp; motion</h2>
<h3>The closed control loop</h3>
<p>To move accurately, a robot compares where it <em>is</em> to where it <em>should be</em> and corrects — a <strong>feedback loop</strong>. The gap is the <strong>error</strong>; the controller drives error toward zero.</p>
<pre><code>setpoint -> [ + ] -> Controller -> Actuator -> Plant -> output
              ^-------------- sensor feedback -----------+
</code></pre>
<h3>PID — the workhorse controller</h3>
<ul>
<li><strong>P (proportional)</strong> — push harder the bigger the error.</li>
<li><strong>I (integral)</strong> — remove small steady leftover error over time.</li>
<li><strong>D (derivative)</strong> — damp overshoot by reacting to how fast the error changes.</li>
</ul>
<p>PID keeps a motor at target speed, a drone level, a line-follower on the line.</p>
<h3>Locomotion &amp; navigation</h3>
<ul>
<li><strong>Locomotion</strong> — how a robot moves: wheels (efficient, flat ground), legs (rough terrain), rotors (flight).</li>
<li><strong>Navigation</strong> — getting from A to B: know where you are (localization), where things are (map), plan a path, and avoid obstacles.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> A warehouse robot uses PID to hold wheel speed while a navigation stack plans a path around shelves and re-plans when a person steps in front.</div>`,
    `<span class="eyebrow">RAI101 · Chương 5 · Bài 5.1</span>
<h2>Điều khiển &amp; vận động</h2>
<h3>Vòng điều khiển kín</h3>
<p>Để chuyển động chính xác, robot so sánh vị trí <em>đang</em> ở với vị trí <em>cần</em> ở và tự chỉnh — một <strong>vòng phản hồi (feedback loop)</strong>. Khoảng chênh là <strong>sai số (error)</strong>; bộ điều khiển đưa sai số về 0.</p>
<pre><code>đặt -> [ + ] -> Bộ điều khiển -> Chấp hành -> Đối tượng -> đầu ra
          ^--------------- phản hồi cảm biến --------------+
</code></pre>
<h3>PID — bộ điều khiển chủ lực</h3>
<ul>
<li><strong>P (tỉ lệ)</strong> — sai số càng lớn thì đẩy càng mạnh.</li>
<li><strong>I (tích phân)</strong> — khử phần sai số nhỏ còn tồn dư theo thời gian.</li>
<li><strong>D (vi phân)</strong> — giảm vọt lố bằng cách phản ứng với tốc độ thay đổi của sai số.</li>
</ul>
<p>PID giữ động cơ đúng tốc độ, giữ drone thăng bằng, giữ robot dò line trên vạch.</p>
<h3>Vận động &amp; dẫn đường</h3>
<ul>
<li><strong>Vận động (locomotion)</strong> — cách robot di chuyển: bánh xe (hiệu quả, nền phẳng), chân (địa hình gồ ghề), cánh quạt (bay).</li>
<li><strong>Dẫn đường (navigation)</strong> — đi từ A tới B: biết mình ở đâu (định vị), biết vật ở đâu (bản đồ), lập đường đi, và tránh vật cản.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Robot kho dùng PID giữ tốc độ bánh trong khi bộ dẫn đường lập đường vòng qua kệ và lập lại đường khi có người bước ra trước mặt.</div>`,
  ]]);

const c5q = quiz('rai101-quiz-5', 'Quiz 5 — Control & motion|||Quiz 5 — Điều khiển & vận động', [
  { id: 'q1', question: 'Vòng điều khiển kín dùng đại lượng nào để tự chỉnh?', options: ['Màu sắc', 'Sai số giữa vị trí thực và đặt (feedback)', 'Số cảm biến', 'Điện áp pin'], correctIndex: 1, explanation: 'Feedback loop lấy sai số (error) và đưa về 0.' },
  { id: 'q2', question: 'Thành phần "D" trong PID có tác dụng chính là?', options: ['Đẩy mạnh theo sai số', 'Khử sai số tồn dư', 'Giảm vọt lố theo tốc độ đổi của sai số', 'Cấp nguồn'], correctIndex: 2, explanation: 'D (vi phân) phản ứng với tốc độ thay đổi sai số → giảm overshoot.' },
  { id: 'q3', question: 'Dẫn đường (navigation) KHÔNG bao gồm việc nào?', options: ['Định vị (mình ở đâu)', 'Lập đường đi', 'Tránh vật cản', 'Hàn kim loại'], correctIndex: 3, explanation: 'Navigation = localization + map + path planning + tránh vật cản.' },
]);

const c6 = doc('rai101-6-1-intro-ai', '6.1 — Introduction to AI|||6.1 — Nhập môn AI',
  'Agent thông minh (percept→action), tìm kiếm (search) giải bài toán, biểu diễn tri thức, phân loại AI (hẹp/tổng quát), tổng quan học máy.',
  [[
    `<span class="eyebrow">RAI101 · Chapter 6 · Lesson 6.1</span>
<h2>Introduction to AI</h2>
<h3>The intelligent agent</h3>
<p>AIMA frames AI around the <strong>agent</strong>: something that perceives its environment through sensors and acts through actuators to achieve goals. A <strong>rational agent</strong> chooses the action expected to best achieve its goal — exactly the robot's "think" step.</p>
<h3>Search — solving problems</h3>
<p><strong>Search</strong> explores possible action sequences to reach a goal (BFS, DFS, A*). A robot planning a route or a game solving a maze both use search over a state space.</p>
<h3>Knowledge representation</h3>
<p>To reason, an agent needs to <strong>represent knowledge</strong> about the world (facts, rules) in a form it can compute over — logic, graphs, or learned models.</p>
<h3>Classifying AI</h3>
<ul>
<li><strong>Narrow AI</strong> — good at ONE task (chess, spam filtering, driving). All AI today.</li>
<li><strong>General AI</strong> — human-level across any task. Still hypothetical.</li>
</ul>
<h3>Machine learning in one line</h3>
<p><strong>Machine learning</strong> = programs that improve from data instead of being fully hand-coded. Three families: <strong>supervised</strong> (learn from labeled examples), <strong>unsupervised</strong> (find structure), <strong>reinforcement</strong> (learn from reward).</p>
<div class="callout"><span class="badge">Robot link</span> A robot IS a physical agent: its perception feeds the "think" (search/learning), and its actuators are the "act".</div>`,
    `<span class="eyebrow">RAI101 · Chương 6 · Bài 6.1</span>
<h2>Nhập môn AI</h2>
<h3>Agent thông minh</h3>
<p>AIMA đặt AI quanh khái niệm <strong>agent</strong>: thứ cảm nhận môi trường qua cảm biến và hành động qua cơ cấu chấp hành để đạt mục tiêu. Một <strong>agent duy lý (rational)</strong> chọn hành động kỳ vọng đạt mục tiêu tốt nhất — chính là bước "suy nghĩ" của robot.</p>
<h3>Tìm kiếm — giải bài toán</h3>
<p><strong>Tìm kiếm (search)</strong> duyệt các chuỗi hành động khả dĩ để tới đích (BFS, DFS, A*). Robot lập lộ trình hay trò chơi giải mê cung đều dùng tìm kiếm trên không gian trạng thái.</p>
<h3>Biểu diễn tri thức</h3>
<p>Để suy luận, agent cần <strong>biểu diễn tri thức</strong> về thế giới (sự kiện, luật) dưới dạng tính toán được — logic, đồ thị, hoặc mô hình học được.</p>
<h3>Phân loại AI</h3>
<ul>
<li><strong>AI hẹp (narrow)</strong> — giỏi MỘT việc (cờ, lọc spam, lái xe). Toàn bộ AI hiện nay.</li>
<li><strong>AI tổng quát (general)</strong> — ngang người ở mọi việc. Vẫn giả định.</li>
</ul>
<h3>Học máy trong một câu</h3>
<p><strong>Học máy (machine learning)</strong> = chương trình cải thiện từ dữ liệu thay vì viết tay toàn bộ. Ba nhánh: <strong>có giám sát</strong> (học từ ví dụ có nhãn), <strong>không giám sát</strong> (tìm cấu trúc), <strong>tăng cường</strong> (học từ phần thưởng).</p>
<div class="callout"><span class="badge">Liên hệ robot</span> Robot LÀ một agent vật lý: nhận thức nạp cho bước "suy nghĩ" (tìm kiếm/học), và cơ cấu chấp hành là bước "hành động".</div>`,
  ]]);

const c6q = quiz('rai101-quiz-6', 'Quiz 6 — Introduction to AI|||Quiz 6 — Nhập môn AI', [
  { id: 'q1', question: 'Trong AIMA, "agent" là gì?', options: ['Một loại pin', 'Thứ cảm nhận môi trường và hành động để đạt mục tiêu', 'Một ngôn ngữ lập trình', 'Một cảm biến'], correctIndex: 1, explanation: 'Agent: perceive qua cảm biến, act qua chấp hành, hướng tới mục tiêu.' },
  { id: 'q2', question: 'AI hẹp (narrow AI) là?', options: ['AI ngang người ở mọi việc', 'AI giỏi một việc cụ thể (toàn bộ AI hiện nay)', 'AI không cần dữ liệu', 'AI chỉ chạy trên robot'], correctIndex: 1, explanation: 'Narrow AI giỏi một tác vụ; general AI (ngang người mọi việc) còn giả định.' },
  { id: 'q3', question: 'Nhánh học máy học từ phần thưởng là?', options: ['Có giám sát', 'Không giám sát', 'Tăng cường (reinforcement)', 'Tìm kiếm A*'], correctIndex: 2, explanation: 'Reinforcement learning: học từ tín hiệu thưởng/phạt.' },
]);

const c7 = doc('rai101-7-1-ai-for-robots', '7.1 — AI for robots|||7.1 — AI cho robot',
  'Nhận thức bằng ML (thị giác máy tính), lập đường đi (path planning), ra quyết định, và học tăng cường cho robot học kỹ năng.',
  [[
    `<span class="eyebrow">RAI101 · Chapter 7 · Lesson 7.1</span>
<h2>AI for robots</h2>
<p>Chapter 6 introduced AI in general; here it meets the robot's body.</p>
<h3>Perception with machine learning</h3>
<p>Raw camera pixels mean nothing until interpreted. <strong>Computer vision</strong> models (e.g. neural networks) detect and classify objects — "pedestrian", "cup", "stop sign" — turning images into decisions. This is how a robot recognizes what it sees.</p>
<h3>Path planning</h3>
<p><strong>Path planning</strong> uses search/graph algorithms (like A*) to find a collision-free route from start to goal on a map, then re-plans as the world changes.</p>
<h3>Decision making</h3>
<p>Given perception + a goal, the robot must <strong>decide</strong> the next action — via rules, planning, or a learned policy. Trade-offs: safety, speed, energy.</p>
<h3>Reinforcement learning (overview)</h3>
<p><strong>Reinforcement learning (RL)</strong> lets a robot <em>learn skills by trial and error</em>: it acts, gets a reward, and adjusts its policy to earn more reward. Used to teach grasping, walking, balancing — often trained in simulation first for safety.</p>
<div class="callout"><span class="badge">Real example</span> A robot dog learning to walk: RL in simulation rewards forward progress and staying upright; the learned policy transfers to the real robot.</div>`,
    `<span class="eyebrow">RAI101 · Chương 7 · Bài 7.1</span>
<h2>AI cho robot</h2>
<p>Chương 6 giới thiệu AI nói chung; ở đây AI gặp thân xác robot.</p>
<h3>Nhận thức bằng học máy</h3>
<p>Pixel camera thô vô nghĩa cho tới khi được diễn giải. Các mô hình <strong>thị giác máy tính</strong> (vd mạng nơ-ron) phát hiện và phân loại vật thể — "người đi bộ", "cái cốc", "biển dừng" — biến ảnh thành quyết định. Đây là cách robot nhận ra thứ nó thấy.</p>
<h3>Lập đường đi (path planning)</h3>
<p><strong>Lập đường đi</strong> dùng thuật toán tìm kiếm/đồ thị (như A*) để tìm đường không va chạm từ điểm đầu tới đích trên bản đồ, rồi lập lại khi thế giới đổi.</p>
<h3>Ra quyết định</h3>
<p>Có nhận thức + mục tiêu, robot phải <strong>quyết định</strong> hành động kế tiếp — bằng luật, lập kế hoạch, hoặc chính sách học được. Đánh đổi: an toàn, tốc độ, năng lượng.</p>
<h3>Học tăng cường (tổng quan)</h3>
<p><strong>Học tăng cường (RL)</strong> cho robot <em>học kỹ năng bằng thử–sai</em>: nó hành động, nhận phần thưởng, và điều chỉnh chính sách để được thưởng nhiều hơn. Dùng để dạy gắp, đi, giữ thăng bằng — thường huấn luyện trong mô phỏng trước cho an toàn.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Robot chó tập đi: RL trong mô phỏng thưởng cho tiến về trước và giữ đứng vững; chính sách học được chuyển sang robot thật.</div>`,
  ]]);

const c7q = quiz('rai101-quiz-7', 'Quiz 7 — AI for robots|||Quiz 7 — AI cho robot', [
  { id: 'q1', question: 'Robot "nhận ra" vật trong ảnh camera nhờ?', options: ['Encoder', 'Thị giác máy tính (mô hình ML phát hiện/phân loại)', 'Pin', 'PID'], correctIndex: 1, explanation: 'Computer vision biến pixel thành nhãn vật thể → quyết định.' },
  { id: 'q2', question: 'Thuật toán như A* trong robot dùng để?', options: ['Sạc pin', 'Lập đường đi không va chạm tới đích', 'Đo nhiệt độ', 'Quay động cơ'], correctIndex: 1, explanation: 'A* là tìm kiếm/đồ thị dùng cho path planning.' },
  { id: 'q3', question: 'Học tăng cường (RL) cho robot học kỹ năng bằng cách?', options: ['Chép từ người', 'Thử–sai và điều chỉnh theo phần thưởng', 'Đọc datasheet', 'Nối thêm cảm biến'], correctIndex: 1, explanation: 'RL: hành động → thưởng → chỉnh chính sách để được thưởng nhiều hơn.' },
]);

const c8 = doc('rai101-8-1-applications-ethics', '8.1 — Applications & ethics|||8.1 — Ứng dụng & đạo đức',
  'Ứng dụng robot (công nghiệp, dịch vụ, tự hành); an toàn robot–người; các vấn đề đạo đức AI/robot (thiên lệch, việc làm, trách nhiệm, tự chủ).',
  [[
    `<span class="eyebrow">RAI101 · Chapter 8 · Lesson 8.1</span>
<h2>Applications &amp; ethics</h2>
<h3>Where robots &amp; AI are used</h3>
<ul>
<li><strong>Industrial</strong> — welding, assembly, painting; fast, precise, tireless.</li>
<li><strong>Service</strong> — vacuuming, delivery, surgery assistance, elder care.</li>
<li><strong>Autonomous</strong> — self-driving vehicles, drones, warehouse fleets, Mars rovers.</li>
</ul>
<h3>Safety</h3>
<p>Robots share space with people, so <strong>safety</strong> is central: emergency stops, speed/force limits, safety zones, and "collaborative" robots (cobots) designed to work beside humans without cages.</p>
<h3>Ethics of AI &amp; robots</h3>
<ul>
<li><strong>Bias</strong> — an AI trained on skewed data makes unfair decisions.</li>
<li><strong>Jobs</strong> — automation displaces some work while creating other work.</li>
<li><strong>Accountability</strong> — when an autonomous system causes harm, who is responsible?</li>
<li><strong>Autonomy &amp; control</strong> — how much decision power should a machine hold, especially where lives are at stake?</li>
<li><strong>Privacy</strong> — sensing robots collect data about people around them.</li>
</ul>
<div class="callout"><span class="badge">Takeaway</span> Building robots that are capable is an engineering problem; building robots that are safe, fair and trustworthy is an engineering AND ethical one — engineers own both.</div>`,
    `<span class="eyebrow">RAI101 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng &amp; đạo đức</h2>
<h3>Robot &amp; AI được dùng ở đâu</h3>
<ul>
<li><strong>Công nghiệp</strong> — hàn, lắp ráp, sơn; nhanh, chính xác, không mệt.</li>
<li><strong>Dịch vụ</strong> — hút bụi, giao hàng, hỗ trợ phẫu thuật, chăm sóc người già.</li>
<li><strong>Tự hành</strong> — xe tự lái, drone, đội robot kho, xe thám hiểm sao Hoả.</li>
</ul>
<h3>An toàn</h3>
<p>Robot dùng chung không gian với con người, nên <strong>an toàn</strong> là trọng tâm: nút dừng khẩn, giới hạn tốc độ/lực, vùng an toàn, và robot "cộng tác" (cobot) thiết kế để làm việc cạnh người mà không cần lồng chắn.</p>
<h3>Đạo đức AI &amp; robot</h3>
<ul>
<li><strong>Thiên lệch (bias)</strong> — AI học từ dữ liệu lệch sẽ ra quyết định bất công.</li>
<li><strong>Việc làm</strong> — tự động hoá thay thế một số việc trong khi tạo ra việc khác.</li>
<li><strong>Trách nhiệm</strong> — khi hệ tự hành gây hại, ai chịu trách nhiệm?</li>
<li><strong>Tự chủ &amp; kiểm soát</strong> — máy nên nắm bao nhiêu quyền quyết định, nhất là nơi liên quan tính mạng?</li>
<li><strong>Riêng tư</strong> — robot cảm biến thu thập dữ liệu về người xung quanh.</li>
</ul>
<div class="callout"><span class="badge">Điểm cốt lõi</span> Làm robot có năng lực là bài toán kỹ thuật; làm robot an toàn, công bằng và đáng tin là bài toán kỹ thuật LẪN đạo đức — kỹ sư gánh cả hai.</div>`,
  ]]);

const c8q = quiz('rai101-quiz-8', 'Quiz 8 — Applications & ethics|||Quiz 8 — Ứng dụng & đạo đức', [
  { id: 'q1', question: 'Robot "cộng tác" (cobot) được thiết kế để?', options: ['Chỉ chạy trong lồng chắn', 'Làm việc an toàn cạnh con người', 'Bay ngoài trời', 'Thay pin tự động'], correctIndex: 1, explanation: 'Cobot làm việc cạnh người không cần lồng, có giới hạn lực/tốc độ.' },
  { id: 'q2', question: 'Thiên lệch (bias) trong AI thường bắt nguồn từ?', options: ['Động cơ yếu', 'Dữ liệu huấn luyện lệch', 'Cảm biến đắt', 'Pin nhỏ'], correctIndex: 1, explanation: 'AI học dữ liệu lệch → quyết định bất công.' },
  { id: 'q3', question: 'Câu hỏi đạo đức "khi hệ tự hành gây hại, ai chịu trách nhiệm?" thuộc về?', options: ['Trách nhiệm (accountability)', 'Động học ngược', 'PID', 'Sensor fusion'], correctIndex: 0, explanation: 'Đây là vấn đề trách nhiệm/accountability của AI–robot.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'RAI101',
    slug: 'rai101-introduction-to-robotics-and-artificial-intelligence',
    title: 'Introduction to Robotics and Artificial Intelligence',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/RAI101.webp',
    shortDescription: 'How robots work & how AI makes them intelligent — components, frames & kinematics, sensors & perception, control (PID) & navigation, AI agents, search & ML, path planning & RL, applications & ethics. Bilingual, with quizzes.|||Robot hoạt động thế nào & AI làm chúng thông minh ra sao — thành phần, hệ toạ độ & động học, cảm biến & nhận thức, điều khiển (PID) & dẫn đường, agent AI, tìm kiếm & học máy, lập đường đi & học tăng cường, ứng dụng & đạo đức. Song ngữ, có quiz.',
    description: 'Môn <strong>RAI101 — Introduction to Robotics and Artificial Intelligence</strong> (kỳ 1, ngành Robotics &amp; AI) giúp hiểu <strong>robot hoạt động thế nào và AI làm chúng thông minh ra sao</strong>. Từ <strong>tổng quan &amp; thành phần robot</strong> (cảm biến, cơ cấu chấp hành, bộ điều khiển) → <strong>hệ toạ độ &amp; động học</strong> (frame, DOF, forward/inverse) → <strong>cảm biến &amp; nhận thức</strong> → <strong>điều khiển &amp; vận động</strong> (PID, dẫn đường) → <strong>nhập môn AI</strong> (agent, tìm kiếm, học máy) → <strong>AI cho robot</strong> (thị giác, path planning, RL) → <strong>ứng dụng &amp; đạo đức</strong>. Bám sách chuẩn Siegwart, Russell &amp; Norvig, Craig; song ngữ, có ví dụ robot thật, quiz mỗi chương.',
    whatYouLearn: 'Robot &amp; AI là gì, vòng sense–think–act; các loại robot; thành phần (cảm biến, cơ cấu chấp hành, bộ điều khiển, nguồn); hệ toạ độ, bậc tự do, động học thuận/ngược; cảm biến (encoder/IMU/lidar/camera) &amp; nhận thức, sensor fusion; vòng điều khiển kín &amp; PID, locomotion, navigation; agent AI, tìm kiếm (A*), học máy; thị giác máy tính, lập đường đi, học tăng cường; ứng dụng, an toàn robot–người &amp; đạo đức AI.',
    requirements: 'Toán/tin học phổ thông, tư duy logic. Không cần kinh nghiệm robot trước; nên thử một công cụ mô phỏng (Gazebo/Tinkercad) để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide FLM, sách chuẩn (Siegwart/AIMA/Craig), ROS, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Robot & AI, vòng sense–think–act, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan Robotics & AI|||Chapter 1 — Overview of Robotics & AI', description: 'Định nghĩa, lịch sử, loại robot, liên hệ robot–AI.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thành phần robot|||Chapter 2 — Robot components', description: 'Cảm biến, chấp hành, điều khiển, nguồn, kiến trúc.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Hệ toạ độ & động học|||Chapter 3 — Frames & kinematics', description: 'Frame, biến đổi, DOF, forward/inverse kinematics.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Cảm biến & nhận thức|||Chapter 4 — Sensors & perception', description: 'Encoder/IMU/lidar/camera, nội/ngoại cảm, sensor fusion.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Điều khiển & vận động|||Chapter 5 — Control & motion', description: 'Vòng điều khiển kín, PID, locomotion, navigation.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nhập môn AI|||Chapter 6 — Introduction to AI', description: 'Agent, tìm kiếm, tri thức, phân loại AI, học máy.', lessons: [c6, c6q] },
    { title: 'Chương 7 — AI cho robot|||Chapter 7 — AI for robots', description: 'Thị giác ML, path planning, ra quyết định, RL.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng & đạo đức|||Chapter 8 — Applications & ethics', description: 'Ứng dụng, an toàn robot–người, đạo đức AI/robot.', lessons: [c8, c8q] },
  ],
};
