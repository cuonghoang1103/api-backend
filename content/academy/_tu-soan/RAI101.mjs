// Khoá TỰ SOẠN cho RAI101 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Khung bám giáo trình chuẩn nhập môn: Russell & Norvig "Artificial Intelligence: A Modern Approach" (4e),
// Lynch & Park "Modern Robotics" (Cambridge 2017, bản PDF miễn phí), Craig "Introduction to Robotics" (4e),
// Siegwart/Nourbakhsh/Scaramuzza "Introduction to Autonomous Mobile Robots" (2e), tài liệu chính thức ROS 2.
// Mọi đoạn code Python đã chạy thật bằng python3, output dán nguyên văn. Mọi link ngoài đã mở thử.
// ⚠️ File này KHÔNG dùng chuỗi nội suy (dấu đô-la + ngoặc nhọn) và không backtick lồng; nội dung ghép bằng toán tử +.

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
const QZ = (ch, title, description, questions) => ({
  title, slug: 'rai101-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions },
});

// ───────────────────────────── Mục 0 ─────────────────────────────
const m01 = L('rai101-ts-0-1',
  '0.1 — Welcome to RAI101: what Robotics & AI is and why you study it|||0.1 — Giới thiệu RAI101: Robotics & AI học gì, để làm gì',
  'RAI101 học gì, dùng vào đâu (đồ án robot, AI, đi làm), 8 chuẩn đầu ra tự soạn, bản đồ 11 chương, cách học, cảnh báo: trường chưa công bố syllabus trên FLM.',
  `<span class="eyebrow">RAI101 · Section 0 · Lesson 0.1</span>
<h2>Welcome to Introduction to Robotics and Artificial Intelligence</h2>
<p class="lead">A robot is a machine that <strong>senses</strong> the world, <strong>thinks</strong> about what to do and <strong>acts</strong> on the physical world. Artificial Intelligence is the science of making the “think” step good. RAI101 gives you the first map of both fields — enough mathematics, programming and vocabulary to start building real robots in later semesters.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the RAI101 syllabus on FLM</strong> (we searched the course code, its variants and the course name on 09/11/2026). This course framework is therefore <strong>self-authored</strong>, following the standard introductory textbooks (Russell &amp; Norvig <em>Artificial Intelligence: A Modern Approach</em>, Lynch &amp; Park <em>Modern Robotics</em>, Craig <em>Introduction to Robotics</em>, Siegwart et al. <em>Introduction to Autonomous Mobile Robots</em>) and the official ROS 2 documentation. <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline your lecturer gives in class.</p></div>
<h3>What is this course about?</h3>
<p>Robotics and AI grew up as two separate disciplines. Robotics came from mechanical and electrical engineering: motors, gears, sensors, kinematics and feedback control. AI came from computer science: search, logic, probability and machine learning. Modern systems — a warehouse robot, a self-driving car, a delivery drone, a robot vacuum — need both. The robot body without AI can only repeat a fixed program; AI without a body can only work with data on a screen. This course walks around the whole <strong>sense–think–act loop</strong> once, at an introductory level, so that every later course has a place to hang on.</p>
<h3>Why does a Robotics &amp; AI student need it?</h3>
<ul>
<li><strong>Projects and capstone:</strong> almost every robot project uses the same building blocks — sensors, motors, a microcontroller or computer, coordinate frames, a PID loop, a path planner and some perception. You will meet each of them here.</li>
<li><strong>Industry:</strong> factories, logistics, agriculture and healthcare deploy industrial robots, collaborative robots (cobots) and autonomous mobile robots; companies need engineers who can talk to both the mechanical team and the software/AI team.</li>
<li><strong>AI careers:</strong> search, agents, machine learning and computer vision are the core of AI engineering, whether or not a robot is involved.</li>
<li><strong>Software skills:</strong> every algorithm in this course is shown as short Python code that really runs, with its real output — so you learn to test ideas by computation, not just by reading.</li>
<li><strong>Responsibility:</strong> robots and AI act in the real world. Safety standards and AI ethics are part of the job, not an optional extra.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<p>After this course you should be able to:</p>
<ol>
<li>Explain what a robot is, describe the sense–think–act loop, and outline the history and main types of robots and AI systems.</li>
<li>Identify the main components of a robot — sensors, actuators, controllers, power — and do basic calculations (encoder resolution, gear ratio, power budget).</li>
<li>Describe positions and orientations with coordinate frames, rotation matrices and homogeneous transformations.</li>
<li>Compute forward and inverse kinematics of a planar two-link arm and the odometry of a differential-drive mobile robot.</li>
<li>Distinguish open-loop and closed-loop control and explain, simulate and roughly tune a PID controller.</li>
<li>Describe intelligent agents and their environments, formulate problems as state spaces, and apply BFS and A* to robot path planning.</li>
<li>Explain the basic ideas of machine learning (regression, classification, neural networks, reinforcement learning) and of computer vision and probabilistic localization.</li>
<li>Describe the structure of ROS 2 (nodes, topics, services, actions, tf2) and discuss robot safety standards and the ethical and social questions of AI.</li>
</ol>
<h3>Course map</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Ch. 1–2</span><span class="v">What a robot is, history, types; sensors, actuators, controllers, power</span></div>
<div class="kv"><span class="k">Ch. 3–4</span><span class="v">Frames, rotations, transforms; degrees of freedom, forward/inverse kinematics, odometry</span></div>
<div class="kv"><span class="k">Ch. 5</span><span class="v">Feedback control and PID</span></div>
<div class="kv"><span class="k">Ch. 6–8</span><span class="v">AI and agents; search and path planning (A*); machine learning basics</span></div>
<div class="kv"><span class="k">Ch. 9</span><span class="v">Perception: images, edges, CNNs, localization under uncertainty</span></div>
<div class="kv"><span class="k">Ch. 10–11</span><span class="v">ROS 2; safety, ethics and society</span></div>
</div>
<h3>Related courses at FPTU</h3>
<p>RAI101 sits in <strong>semester 1</strong> of the Robotics &amp; AI programme, so it has <strong>no prerequisite</strong> beyond high-school mathematics (algebra, trigonometry, vectors) and logical thinking. It works best alongside the first-semester foundation courses of your programme — programming (Python), discrete/calculus mathematics and computer-science fundamentals; check your own curriculum on FAP/FLM for the exact list. Everything you start here — kinematics, control, search, learning, vision, ROS — is developed in depth in later robotics and AI courses and in the capstone project.</p>
<h3>How to study this course</h3>
<ul>
<li>Each lesson has objectives, a lecture, worked examples, common mistakes, a 📌 summary, 🔗 further learning and 🧪 practice with hidden answers. Each chapter ends with a quiz (8–10 questions).</li>
<li><strong>Type and run the Python code yourself</strong> (Python 3 + numpy). Change a number, predict the result, then run it — that is how intuition is built.</li>
<li>Do the practice on paper first, then open the answer. For the maths chapters (3–4) draw the frames and angles; for the AI chapters trace the algorithm by hand on a small example.</li>
<li>About 4–6 hours per chapter: lesson → textbook section or linked video → practice → quiz.</li>
</ul>`,
  `<span class="eyebrow">RAI101 · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với Nhập môn Robotics và Trí tuệ nhân tạo</h2>
<p class="lead">Robot là cỗ máy <strong>cảm nhận</strong> thế giới, <strong>suy nghĩ</strong> xem nên làm gì và <strong>hành động</strong> lên thế giới vật lý. Trí tuệ nhân tạo (AI) là khoa học làm cho bước “suy nghĩ” trở nên giỏi. RAI101 cho bạn tấm bản đồ đầu tiên của cả hai lĩnh vực — đủ toán, lập trình và thuật ngữ để bắt đầu làm robot thật ở các kỳ sau.</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường <strong>chưa công bố syllabus của RAI101 trên FLM</strong> (đã dò mã môn, mã biến thể và tên môn ngày 09/11/2026). Vì vậy khung môn này là <strong>khung tự soạn</strong>, bám các giáo trình nhập môn chuẩn quốc tế (Russell &amp; Norvig <em>Artificial Intelligence: A Modern Approach</em>, Lynch &amp; Park <em>Modern Robotics</em>, Craig <em>Introduction to Robotics</em>, Siegwart và cộng sự <em>Introduction to Autonomous Mobile Robots</em>) và tài liệu chính thức của ROS 2. <strong>Cách tính điểm, hình thức đánh giá và lịch thi theo giảng viên</strong> — luôn theo đề cương giảng viên phát trên lớp.</p></div>
<h3>Môn này học gì?</h3>
<p>Robotics và AI vốn lớn lên thành hai ngành riêng. Robotics đi ra từ cơ khí và điện – điện tử: động cơ, bánh răng, cảm biến, động học và điều khiển phản hồi. AI đi ra từ khoa học máy tính: tìm kiếm, logic, xác suất và học máy. Hệ thống hiện đại — robot kho hàng, xe tự lái, drone giao hàng, robot hút bụi — cần cả hai. Thân robot không có AI chỉ lặp lại một chương trình cố định; AI không có thân chỉ làm việc với dữ liệu trên màn hình. Môn này đi trọn một vòng <strong>cảm nhận – suy nghĩ – hành động</strong> (sense–think–act) ở mức nhập môn, để mọi môn học sau đều có chỗ “bám” vào.</p>
<h3>Sinh viên Robotics &amp; AI cần nó để làm gì?</h3>
<ul>
<li><strong>Đồ án và capstone:</strong> gần như mọi đồ án robot dùng chung một bộ khối: cảm biến, động cơ, vi điều khiển hoặc máy tính, hệ toạ độ, vòng PID, bộ lập đường đi và một phần nhận thức. Bạn sẽ gặp từng khối ở đây.</li>
<li><strong>Đi làm:</strong> nhà máy, logistics, nông nghiệp, y tế đang triển khai robot công nghiệp, robot cộng tác (cobot) và robot di động tự hành; doanh nghiệp cần kỹ sư nói chuyện được với cả đội cơ khí lẫn đội phần mềm/AI.</li>
<li><strong>Nghề AI:</strong> tìm kiếm, tác tử (agent), học máy và thị giác máy tính là lõi của kỹ sư AI, dù có robot hay không.</li>
<li><strong>Kỹ năng phần mềm:</strong> mọi thuật toán trong môn đều có đoạn Python ngắn đã chạy thật, kèm output thật — bạn học cách kiểm ý tưởng bằng tính toán, không chỉ bằng đọc.</li>
<li><strong>Trách nhiệm:</strong> robot và AI hành động trong thế giới thật. Tiêu chuẩn an toàn và đạo đức AI là một phần công việc, không phải phần phụ.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<p>Học xong môn, bạn cần làm được:</p>
<ol>
<li>Giải thích robot là gì, mô tả vòng sense–think–act, nêu sơ lược lịch sử và các loại robot, hệ thống AI chính.</li>
<li>Nhận diện các thành phần chính của robot — cảm biến, cơ cấu chấp hành, bộ điều khiển, nguồn — và tính toán cơ bản (độ phân giải encoder, tỉ số truyền, ngân sách năng lượng).</li>
<li>Mô tả vị trí và hướng bằng hệ toạ độ, ma trận quay và phép biến đổi thuần nhất.</li>
<li>Tính động học thuận và ngược của cánh tay phẳng hai khâu và odometry của robot di động vi sai.</li>
<li>Phân biệt điều khiển vòng hở, vòng kín; giải thích, mô phỏng và chỉnh sơ bộ bộ điều khiển PID.</li>
<li>Mô tả tác tử thông minh và môi trường, mô hình hoá bài toán thành không gian trạng thái, áp dụng BFS và A* cho lập đường đi của robot.</li>
<li>Giải thích ý tưởng cơ bản của học máy (hồi quy, phân loại, mạng nơ-ron, học tăng cường), thị giác máy tính và định vị xác suất.</li>
<li>Mô tả cấu trúc ROS 2 (node, topic, service, action, tf2), thảo luận tiêu chuẩn an toàn robot và các câu hỏi đạo đức – xã hội của AI.</li>
</ol>
<h3>Bản đồ môn học</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Ch. 1–2</span><span class="v">Robot là gì, lịch sử, các loại; cảm biến, cơ cấu chấp hành, bộ điều khiển, nguồn</span></div>
<div class="kv"><span class="k">Ch. 3–4</span><span class="v">Hệ toạ độ, phép quay, phép biến đổi; bậc tự do, động học thuận/ngược, odometry</span></div>
<div class="kv"><span class="k">Ch. 5</span><span class="v">Điều khiển phản hồi và PID</span></div>
<div class="kv"><span class="k">Ch. 6–8</span><span class="v">AI và tác tử; tìm kiếm và lập đường đi (A*); học máy cơ bản</span></div>
<div class="kv"><span class="k">Ch. 9</span><span class="v">Nhận thức: ảnh số, biên, CNN, định vị trong bất định</span></div>
<div class="kv"><span class="k">Ch. 10–11</span><span class="v">ROS 2; an toàn, đạo đức và xã hội</span></div>
</div>
<h3>Môn liên quan trong khung FPTU</h3>
<p>RAI101 nằm ở <strong>kỳ 1</strong> ngành Robotics &amp; AI, nên <strong>không có môn tiên quyết</strong> ngoài toán phổ thông (đại số, lượng giác, vectơ) và tư duy logic. Môn học hiệu quả nhất khi đi cùng các môn nền kỳ 1 của ngành — lập trình (Python), toán (rời rạc/giải tích) và nhập môn khoa học máy tính; xem đúng danh sách trong chương trình của bạn trên FAP/FLM. Mọi thứ bắt đầu ở đây — động học, điều khiển, tìm kiếm, học máy, thị giác, ROS — sẽ được học sâu ở các môn robotics và AI sau và trong đồ án tốt nghiệp.</p>
<h3>Học môn này thế nào cho hiệu quả</h3>
<ul>
<li>Mỗi bài có mục tiêu, bài giảng, ví dụ giải từng bước, lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm và 🧪 tự luyện có đáp án ẩn. Cuối mỗi chương có quiz 8–10 câu.</li>
<li><strong>Tự gõ và chạy code Python</strong> (Python 3 + numpy). Đổi một con số, đoán kết quả, rồi chạy — trực giác được xây như vậy.</li>
<li>Làm tự luyện ra giấy trước rồi mới mở đáp án. Chương toán (3–4) thì vẽ hệ toạ độ và góc; chương AI thì dò thuật toán bằng tay trên ví dụ nhỏ.</li>
<li>Khoảng 4–6 giờ mỗi chương: bài học → mục sách hoặc video được dẫn → tự luyện → quiz.</li>
</ul>`);

const m02 = L('rai101-ts-0-2',
  '0.2 — Textbooks & learning resources (verified)|||0.2 — Giáo trình & tài liệu học (đã kiểm)',
  'Giáo trình chuẩn kèm ISBN đã kiểm (Russell & Norvig AIMA 4e, Lynch & Park Modern Robotics, Craig 4e, Siegwart 2e, Siciliano), khoá mở MIT OCW/Coursera/edX/CS50 AI, tài liệu ROS 2, video và công cụ.',
  `<span class="eyebrow">RAI101 · Section 0 · Lesson 0.2</span>
<h2>Textbooks &amp; learning resources</h2>
<p class="lead">This course follows the standard introductory textbooks below. You do <strong>not</strong> need to buy all of them: <em>Modern Robotics</em> has a free preprint PDF from its authors, and the AI book has a free companion website with code. Every lesson also links to free videos and notes for its topic.</p>
<h3>📘 Main textbooks</h3>
<ol>
<li><strong>Stuart Russell, Peter Norvig — <em>Artificial Intelligence: A Modern Approach</em>, 4th edition.</strong> Pearson, 2020 (US hardcover). ISBN 978-0-13-461099-3; Global Edition (Pearson, 2021): ISBN 978-1-292-40113-3. <a href="https://aima.cs.berkeley.edu/" target="_blank" rel="noopener">Book website</a> · <a href="https://www.pearson.com/en-us/subject-catalog/p/artificial-intelligence-a-modern-approach/P200000003500/9780134610993" target="_blank" rel="noopener">Publisher page</a>. The most widely used AI textbook, adopted by over 1500 schools; our Chapters 6–9 and 11 follow its chapters on agents, search, machine learning, perception, robotics and ethics.</li>
<li><strong>Kevin M. Lynch, Frank C. Park — <em>Modern Robotics: Mechanics, Planning, and Control</em>.</strong> Cambridge University Press, 2017. ISBN 978-1-107-15630-2 (hardback); 978-1-316-60984-2 (paperback). <a href="https://hades.mech.northwestern.edu/index.php/Modern_Robotics" target="_blank" rel="noopener">Free preprint PDF, videos and software from the authors</a>. Our Chapters 3–5 (frames, transforms, degrees of freedom, kinematics, control) follow it.</li>
<li><strong>John J. Craig — <em>Introduction to Robotics: Mechanics and Control</em>, 4th edition.</strong> Pearson, 2017. ISBN 978-0-13-348979-8. The classic manipulator textbook: spatial descriptions, transformations, forward/inverse kinematics, control.</li>
<li><strong>Roland Siegwart, Illah R. Nourbakhsh, Davide Scaramuzza — <em>Introduction to Autonomous Mobile Robots</em>, 2nd edition.</strong> MIT Press, 2011. ISBN 978-0-262-01535-6. Mobile robots: locomotion, wheel kinematics, sensors, perception, localization and navigation.</li>
</ol>
<p><strong>Further reference:</strong> Bruno Siciliano, Lorenzo Sciavicco, Luigi Villani, Giuseppe Oriolo — <em>Robotics: Modelling, Planning and Control</em>, Springer, 2009, ISBN 978-1-84628-641-4 (more advanced; good for later courses). Sebastian Thrun, Wolfram Burgard, Dieter Fox — <em>Probabilistic Robotics</em>, MIT Press, 2005 (the reference for localization and SLAM).</p>
<h3>🎓 Open courses</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/2-12-introduction-to-robotics-fall-2005/" target="_blank" rel="noopener">MIT OpenCourseWare 2.12 — Introduction to Robotics</a>: lecture notes on kinematics, actuators and control.</li>
<li><a href="https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/" target="_blank" rel="noopener">MIT OpenCourseWare 6.034 — Artificial Intelligence (Patrick Winston)</a>: full lecture videos on search, learning and more.</li>
<li><a href="https://www.coursera.org/specializations/modernrobotics" target="_blank" rel="noopener">Coursera — Modern Robotics specialization (Northwestern University)</a>: the online course of the Lynch &amp; Park book.</li>
<li><a href="https://cs50.harvard.edu/ai/" target="_blank" rel="noopener">Harvard CS50's Introduction to Artificial Intelligence with Python</a> (free; also on <a href="https://www.edx.org/learn/artificial-intelligence/harvard-university-cs50-s-introduction-to-artificial-intelligence-with-python" target="_blank" rel="noopener">edX</a>): search, knowledge, uncertainty, optimisation, learning, neural networks — in Python.</li>
<li><a href="https://www.edx.org/learn/robotics/columbia-university-robotics" target="_blank" rel="noopener">edX — ColumbiaX: Robotics</a>.</li>
<li><a href="https://developers.google.com/machine-learning/crash-course" target="_blank" rel="noopener">Google Machine Learning Crash Course</a>: free, interactive introduction to ML.</li>
</ul>
<h3>▶️ Video series</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PLggLP4f-rq02vX0OQQ5vrCxbJrzamYDfx" target="_blank" rel="noopener">Northwestern Robotics — Modern Robotics, all videos</a> (short videos for every section of the book).</li>
<li><a href="https://www.youtube.com/playlist?list=PL8dPuuaLjXtO65LeD2p4_Sb5XQ51par_b" target="_blank" rel="noopener">CrashCourse — Artificial Intelligence</a> (beginner-friendly overview).</li>
<li><a href="https://www.youtube.com/playlist?list=PLn8PRpmsu08pQBgjxYFXSsODEF3Jqmm-y" target="_blank" rel="noopener">MATLAB — Understanding PID Control</a>.</li>
<li><a href="https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi" target="_blank" rel="noopener">3Blue1Brown — Neural networks</a>.</li>
</ul>
<h3>🛠️ Software &amp; documentation</h3>
<ul>
<li><a href="https://github.com/ros2/ros2_documentation/blob/jazzy/source/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Py-Publisher-And-Subscriber.rst" target="_blank" rel="noopener">ROS 2 Jazzy documentation (source on GitHub)</a> — the official tutorials; the rendered site is docs.ros.org.</li>
<li><a href="https://numpy.org/doc/stable/user/absolute_beginners.html" target="_blank" rel="noopener">NumPy for absolute beginners</a> — the only library our code examples need besides the Python standard library.</li>
<li><a href="https://github.com/petercorke/robotics-toolbox-python" target="_blank" rel="noopener">Robotics Toolbox for Python (Peter Corke)</a> — kinematics and planning in Python, for when you want to go further.</li>
<li><a href="https://emanual.robotis.com/docs/en/platform/turtlebot3/overview/" target="_blank" rel="noopener">TurtleBot3 e-Manual</a> — a popular low-cost ROS teaching robot, with simulation instructions.</li>
</ul>
<div class="meo"><p><strong>Study plan.</strong> For each lesson: read the lesson here → watch one linked video or read the matching textbook section → run and modify the Python code → do the 🧪 practice → take the chapter quiz. If a textbook is not available, the free resources above cover every topic of the course.</p></div>`,
  `<span class="eyebrow">RAI101 · Mục 0 · Bài 0.2</span>
<h2>Giáo trình &amp; tài liệu học</h2>
<p class="lead">Khoá này bám các giáo trình nhập môn chuẩn dưới đây. Bạn <strong>không</strong> cần mua tất cả: <em>Modern Robotics</em> có bản PDF tiền in miễn phí do chính tác giả phát hành, sách AI có trang web đi kèm miễn phí với mã nguồn. Mỗi bài học cũng dẫn tới video và ghi chú miễn phí đúng chủ đề.</p>
<h3>📘 Giáo trình chính</h3>
<ol>
<li><strong>Stuart Russell, Peter Norvig — <em>Artificial Intelligence: A Modern Approach</em>, tái bản lần 4.</strong> Pearson, 2020 (bìa cứng, bản Mỹ). ISBN 978-0-13-461099-3; Global Edition (Pearson, 2021): ISBN 978-1-292-40113-3. <a href="https://aima.cs.berkeley.edu/" target="_blank" rel="noopener">Trang web của sách</a> · <a href="https://www.pearson.com/en-us/subject-catalog/p/artificial-intelligence-a-modern-approach/P200000003500/9780134610993" target="_blank" rel="noopener">Trang nhà xuất bản</a>. Giáo trình AI được dùng nhiều nhất, hơn 1500 trường đã chọn; các chương 6–9 và 11 của khoá bám các chương về tác tử, tìm kiếm, học máy, nhận thức, robotics và đạo đức của sách.</li>
<li><strong>Kevin M. Lynch, Frank C. Park — <em>Modern Robotics: Mechanics, Planning, and Control</em>.</strong> Cambridge University Press, 2017. ISBN 978-1-107-15630-2 (bìa cứng); 978-1-316-60984-2 (bìa mềm). <a href="https://hades.mech.northwestern.edu/index.php/Modern_Robotics" target="_blank" rel="noopener">PDF tiền in miễn phí, video và phần mềm của tác giả</a>. Các chương 3–5 của khoá (hệ toạ độ, phép biến đổi, bậc tự do, động học, điều khiển) bám sách này.</li>
<li><strong>John J. Craig — <em>Introduction to Robotics: Mechanics and Control</em>, tái bản lần 4.</strong> Pearson, 2017. ISBN 978-0-13-348979-8. Giáo trình kinh điển về tay máy: mô tả không gian, phép biến đổi, động học thuận/ngược, điều khiển.</li>
<li><strong>Roland Siegwart, Illah R. Nourbakhsh, Davide Scaramuzza — <em>Introduction to Autonomous Mobile Robots</em>, tái bản lần 2.</strong> MIT Press, 2011. ISBN 978-0-262-01535-6. Robot di động: cơ chế di chuyển, động học bánh xe, cảm biến, nhận thức, định vị và dẫn đường.</li>
</ol>
<p><strong>Tham khảo thêm:</strong> Bruno Siciliano, Lorenzo Sciavicco, Luigi Villani, Giuseppe Oriolo — <em>Robotics: Modelling, Planning and Control</em>, Springer, 2009, ISBN 978-1-84628-641-4 (nâng cao hơn; hợp cho các môn sau). Sebastian Thrun, Wolfram Burgard, Dieter Fox — <em>Probabilistic Robotics</em>, MIT Press, 2005 (sách tham chiếu về định vị và SLAM).</p>
<h3>🎓 Khoá học mở</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/2-12-introduction-to-robotics-fall-2005/" target="_blank" rel="noopener">MIT OpenCourseWare 2.12 — Introduction to Robotics</a>: bài giảng về động học, cơ cấu chấp hành, điều khiển.</li>
<li><a href="https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/" target="_blank" rel="noopener">MIT OpenCourseWare 6.034 — Artificial Intelligence (Patrick Winston)</a>: trọn bộ video bài giảng về tìm kiếm, học máy…</li>
<li><a href="https://www.coursera.org/specializations/modernrobotics" target="_blank" rel="noopener">Coursera — chuỗi khoá Modern Robotics (Northwestern University)</a>: khoá trực tuyến của chính sách Lynch &amp; Park.</li>
<li><a href="https://cs50.harvard.edu/ai/" target="_blank" rel="noopener">Harvard CS50's Introduction to Artificial Intelligence with Python</a> (miễn phí; cũng có trên <a href="https://www.edx.org/learn/artificial-intelligence/harvard-university-cs50-s-introduction-to-artificial-intelligence-with-python" target="_blank" rel="noopener">edX</a>): tìm kiếm, tri thức, bất định, tối ưu, học máy, mạng nơ-ron — bằng Python.</li>
<li><a href="https://www.edx.org/learn/robotics/columbia-university-robotics" target="_blank" rel="noopener">edX — ColumbiaX: Robotics</a>.</li>
<li><a href="https://developers.google.com/machine-learning/crash-course" target="_blank" rel="noopener">Google Machine Learning Crash Course</a>: nhập môn học máy miễn phí, có tương tác.</li>
</ul>
<h3>▶️ Chuỗi video</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PLggLP4f-rq02vX0OQQ5vrCxbJrzamYDfx" target="_blank" rel="noopener">Northwestern Robotics — Modern Robotics, toàn bộ video</a> (video ngắn cho từng mục của sách).</li>
<li><a href="https://www.youtube.com/playlist?list=PL8dPuuaLjXtO65LeD2p4_Sb5XQ51par_b" target="_blank" rel="noopener">CrashCourse — Artificial Intelligence</a> (tổng quan dễ hiểu cho người mới).</li>
<li><a href="https://www.youtube.com/playlist?list=PLn8PRpmsu08pQBgjxYFXSsODEF3Jqmm-y" target="_blank" rel="noopener">MATLAB — Understanding PID Control</a>.</li>
<li><a href="https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi" target="_blank" rel="noopener">3Blue1Brown — Neural networks</a>.</li>
</ul>
<h3>🛠️ Phần mềm &amp; tài liệu</h3>
<ul>
<li><a href="https://github.com/ros2/ros2_documentation/blob/jazzy/source/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Py-Publisher-And-Subscriber.rst" target="_blank" rel="noopener">Tài liệu ROS 2 Jazzy (mã nguồn trên GitHub)</a> — bộ hướng dẫn chính thức; bản hiển thị đẹp ở docs.ros.org.</li>
<li><a href="https://numpy.org/doc/stable/user/absolute_beginners.html" target="_blank" rel="noopener">NumPy cho người mới bắt đầu</a> — thư viện duy nhất các ví dụ code cần, ngoài thư viện chuẩn của Python.</li>
<li><a href="https://github.com/petercorke/robotics-toolbox-python" target="_blank" rel="noopener">Robotics Toolbox for Python (Peter Corke)</a> — động học và lập kế hoạch bằng Python, khi bạn muốn đi xa hơn.</li>
<li><a href="https://emanual.robotis.com/docs/en/platform/turtlebot3/overview/" target="_blank" rel="noopener">TurtleBot3 e-Manual</a> — robot dạy ROS giá rẻ phổ biến, có hướng dẫn mô phỏng.</li>
</ul>
<div class="meo"><p><strong>Kế hoạch học.</strong> Mỗi bài: đọc bài ở đây → xem một video được dẫn hoặc đọc mục sách tương ứng → chạy và sửa code Python → làm 🧪 tự luyện → làm quiz chương. Nếu không có sách giấy, các tài liệu miễn phí ở trên đủ phủ mọi chủ đề của môn.</p></div>`);

const muc0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu môn, chuẩn đầu ra tự soạn, bản đồ 11 chương, giáo trình chuẩn kèm ISBN và tài liệu mở. Trường chưa công bố syllabus RAI101 trên FLM — điểm/lịch thi theo giảng viên.',
  lessons: [m01, m02],
};


// ───────────────────────────── Chương 1 — Robot & AI: định nghĩa, lịch sử, phân loại ─────────────────────────────
const r11 = L('rai101-ts-1-1',
  '1.1 — What is a robot? The sense–think–act loop|||1.1 — Robot là gì? Vòng lặp cảm nhận – suy nghĩ – hành động',
  'Định nghĩa robot (ISO 8373, định nghĩa làm việc), phân biệt robot – máy tự động – phần mềm AI, vòng sense–think–act và mức độ tự chủ, ví dụ robot hút bụi.',
  `<span class="eyebrow">RAI101 · Chapter 1 · Lesson 1.1</span>
<h2>What is a robot? The sense–think–act loop</h2>
<p class="lead">Everyone “knows” what a robot is until they try to define it. Is a dishwasher a robot? A self-driving car? A chatbot? This lesson gives you a precise working definition and the single most important picture in the whole course: the <strong>sense–think–act loop</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>State a working definition of a robot and the formal ISO definition of an industrial robot.</li><li>Explain the sense–think–act loop and name the hardware/software behind each stage.</li><li>Distinguish a robot from a fixed automatic machine and from pure AI software.</li><li>Describe levels of autonomy, from teleoperation to full autonomy.</li></ul>
<h3>📖 Lecture</h3>
<p>The word comes from the Czech <em>robota</em> (“forced labour”), first used in Karel Čapek's 1920 play <em>R.U.R.</em> Today engineers use a functional definition:</p>
<div class="formula"><span class="lbl">Working definition</span>A robot is a <strong>physical</strong> machine that <strong>senses</strong> its environment, <strong>decides</strong> what to do with some degree of autonomy, and <strong>acts</strong> on the physical world through motion.</div>
<p>Three words matter: <em>physical</em> (it has a body in the real world), <em>senses</em> (it measures something), and <em>acts</em> (it moves itself or moves objects). The standard ISO 8373 gives a narrower definition for factories: an industrial robot is an automatically controlled, reprogrammable, multipurpose manipulator, programmable in three or more axes. “Reprogrammable” and “multipurpose” are what separate a robot arm from a single-purpose machine such as a bottle-capping press.</p>
<h4>The sense–think–act loop</h4>
<div class="formula"><span class="lbl">Loop</span>SENSE (sensors → data) → THINK (computer: perception, planning, control) → ACT (actuators → motion) → the world changes → SENSE again …</div>
<ul><li><strong>Sense</strong> — sensors turn physical quantities into numbers: wheel encoders (how far the wheels turned), an IMU (rotation and acceleration), a lidar or camera (what is around).</li><li><strong>Think</strong> — software turns data into decisions: <em>perception</em> (“there is a wall 0.5 m ahead”), <em>planning</em> (“turn left, then go to the kitchen”), <em>control</em> (“send 60 % power to the right motor”). This is where AI lives.</li><li><strong>Act</strong> — actuators (electric motors, pneumatic cylinders, hydraulic pistons) convert commands into force and motion.</li></ul>
<p>The loop runs continuously — a motor controller may close its loop 1000 times per second, a path planner a few times per second. Because the robot acts, the world changes, and the next measurement is different: this <strong>feedback</strong> is why robots can handle situations a fixed program cannot.</p>
<h4>Robot vs automation vs AI</h4>
<ul><li>A <strong>fixed automatic machine</strong> (a traffic light, a washing machine) follows a timed sequence; it barely senses and never adapts its motion to the world.</li><li><strong>AI software</strong> (a chatbot, a recommendation engine) “thinks” but has no body and does not act physically.</li><li>A <strong>robot</strong> combines both: a body that moves plus software that decides. Robotics + AI is sometimes called <em>embodied AI</em> or <em>physical AI</em>.</li></ul>
<h4>Levels of autonomy</h4>
<p>Autonomy is a spectrum: <strong>teleoperated</strong> (a human drives every motion, e.g. a bomb-disposal robot), <strong>supervised / shared</strong> (the robot executes, the human approves or corrects — a surgical robot is teleoperated, a warehouse robot is supervised), and <strong>autonomous</strong> (the robot chooses its own actions to reach a goal, e.g. a robot vacuum).</p>
<h3>✍️ Worked example — a robot vacuum</h3>
<div class="callout"><p><b>Sense:</b> bumper switches (contact), cliff infrared sensors (stairs), wheel encoders (distance), gyroscope (heading), on many models a lidar or camera (map).</p>
<p><b>Think:</b> build a map, estimate its own position on it, plan a coverage path row by row, decide to return to the dock when the battery is low.</p>
<p><b>Act:</b> two drive motors (differential drive), brush and suction motors.</p>
<p><b>Verdict:</b> physical ✓, senses ✓, decides ✓, acts ✓ — a robot, and an autonomous one.</p></div>
<div class="callout"><p><b>Classify:</b> (a) an automatic door with a motion sensor — senses and acts, but its “decision” is one fixed rule: borderline, usually called <em>automation</em>. (b) A chess program — thinks, no body: <em>AI, not a robot</em>. (c) A drone that holds its position against wind using GPS and an IMU — <em>a robot</em>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking a robot must look human. Most robots are arms, carts or drones.</li><li>Calling any software “a bot” a robot. Without a body acting in the physical world it is software, not a robot.</li><li>Forgetting the loop: a robot that acts without sensing (open loop) fails as soon as the world differs from the plan.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Robot = physical machine that senses, decides and acts.</li><li>ISO 8373: industrial robot = reprogrammable, multipurpose manipulator with ≥ 3 programmable axes.</li><li>Sense → think → act → (world changes) → sense: feedback is the heart of robotics.</li><li>AI is the “think” part; robotics adds a body.</li><li>Autonomy ranges from teleoperation to full autonomy.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://robots.ieee.org/learn/" target="_blank" rel="noopener">IEEE ROBOTS — Learn About Robotics</a></li><li><a href="https://en.wikipedia.org/wiki/Robot" target="_blank" rel="noopener">Wikipedia — Robot</a></li><li><a href="https://en.wikipedia.org/wiki/Intelligent_agent" target="_blank" rel="noopener">Wikipedia — Intelligent agent</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>For a self-driving car, list two sensors, two “think” tasks and two actuators.</li><li>Is a 3D printer a robot under the working definition? Under ISO 8373?</li><li>Why does a robot need feedback? Give one concrete failure of an open-loop robot.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Sensors: cameras, lidar, radar, GPS, IMU, wheel speed sensors. Think: detect pedestrians, localise on the map, plan a lane change, control speed. Actuators: steering motor, throttle (drive motor), brakes. 2) It moves a tool in 3 axes and is reprogrammable, but it barely senses its environment and does one job; most engineers call it a machine tool (automation), not a robot, and it is not a <em>manipulator</em> in the ISO sense. 3) Without feedback the robot cannot notice errors: a vacuum told “drive 2 m forward” will crash into a chair that was moved, or will end up in the wrong place if a wheel slips.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 1 · Bài 1.1</span>
<h2>Robot là gì? Vòng lặp cảm nhận – suy nghĩ – hành động</h2>
<p class="lead">Ai cũng “biết” robot là gì cho tới khi phải định nghĩa nó. Máy rửa bát có phải robot không? Xe tự lái? Chatbot? Bài này đưa ra một định nghĩa làm việc chính xác và bức tranh quan trọng nhất của cả môn: <strong>vòng lặp sense–think–act</strong> (cảm nhận – suy nghĩ – hành động).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định nghĩa làm việc của robot và định nghĩa ISO của robot công nghiệp.</li><li>Giải thích vòng sense–think–act và kể tên phần cứng/phần mềm ở từng khâu.</li><li>Phân biệt robot với máy tự động cố định và với phần mềm AI thuần tuý.</li><li>Mô tả các mức tự chủ, từ điều khiển từ xa đến tự chủ hoàn toàn.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Từ “robot” bắt nguồn từ tiếng Séc <em>robota</em> (“lao động cưỡng bức”), xuất hiện lần đầu trong vở kịch <em>R.U.R.</em> (1920) của Karel Čapek. Ngày nay kỹ sư dùng định nghĩa theo chức năng:</p>
<div class="formula"><span class="lbl">Định nghĩa làm việc</span>Robot là một cỗ máy <strong>vật lý</strong> biết <strong>cảm nhận</strong> môi trường, <strong>tự quyết định</strong> làm gì ở một mức tự chủ nào đó, và <strong>tác động</strong> lên thế giới thật bằng chuyển động.</div>
<p>Ba từ khoá: <em>vật lý</em> (có thân thể trong thế giới thật), <em>cảm nhận</em> (đo được một đại lượng nào đó), <em>tác động</em> (tự di chuyển hoặc di chuyển vật). Tiêu chuẩn ISO 8373 cho định nghĩa hẹp hơn dùng trong nhà máy: robot công nghiệp là tay máy được điều khiển tự động, lập trình lại được, đa năng, lập trình được theo ba trục trở lên. “Lập trình lại được” và “đa năng” là điểm phân biệt cánh tay robot với máy chuyên dụng một việc như máy đóng nắp chai.</p>
<h4>Vòng lặp sense–think–act</h4>
<div class="formula"><span class="lbl">Vòng lặp</span>CẢM NHẬN (cảm biến → dữ liệu) → SUY NGHĨ (máy tính: nhận thức, lập kế hoạch, điều khiển) → HÀNH ĐỘNG (cơ cấu chấp hành → chuyển động) → thế giới thay đổi → CẢM NHẬN lại …</div>
<ul><li><strong>Cảm nhận</strong> — cảm biến biến đại lượng vật lý thành con số: encoder bánh xe (bánh đã quay bao nhiêu), IMU (góc quay, gia tốc), lidar hay camera (xung quanh có gì).</li><li><strong>Suy nghĩ</strong> — phần mềm biến dữ liệu thành quyết định: <em>nhận thức</em> (“có bức tường cách 0,5 m phía trước”), <em>lập kế hoạch</em> (“rẽ trái rồi đi vào bếp”), <em>điều khiển</em> (“cấp 60 % công suất cho động cơ phải”). Đây là chỗ AI làm việc.</li><li><strong>Hành động</strong> — cơ cấu chấp hành (động cơ điện, xi-lanh khí nén, piston thuỷ lực) biến lệnh thành lực và chuyển động.</li></ul>
<p>Vòng lặp chạy liên tục — bộ điều khiển động cơ có thể khép vòng 1000 lần mỗi giây, bộ lập đường đi vài lần mỗi giây. Vì robot hành động nên thế giới thay đổi, và lần đo kế tiếp sẽ khác: chính <strong>phản hồi</strong> này giúp robot xử lý được những tình huống mà một chương trình cố định không xử lý nổi.</p>
<h4>Robot, tự động hoá và AI khác nhau thế nào</h4>
<ul><li><strong>Máy tự động cố định</strong> (đèn giao thông, máy giặt) chạy theo trình tự định sẵn; hầu như không cảm nhận và không bao giờ điều chỉnh chuyển động theo thế giới.</li><li><strong>Phần mềm AI</strong> (chatbot, hệ gợi ý) “suy nghĩ” nhưng không có thân thể, không tác động vật lý.</li><li><strong>Robot</strong> kết hợp cả hai: thân thể biết chuyển động cộng phần mềm biết quyết định. Robotics + AI đôi khi được gọi là <em>AI hiện thân</em> (embodied AI) hay <em>AI vật lý</em>.</li></ul>
<h4>Các mức tự chủ</h4>
<p>Tự chủ là một dải liên tục: <strong>điều khiển từ xa</strong> (con người lái từng chuyển động, vd robot gỡ bom), <strong>giám sát / chia sẻ</strong> (robot thực hiện, người duyệt hoặc chỉnh — robot phẫu thuật là điều khiển từ xa, robot kho hàng là giám sát), và <strong>tự chủ</strong> (robot tự chọn hành động để đạt mục tiêu, vd robot hút bụi).</p>
<h3>✍️ Ví dụ — robot hút bụi</h3>
<div class="callout"><p><b>Cảm nhận:</b> công tắc va chạm (bumper), cảm biến hồng ngoại chống rơi (cầu thang), encoder bánh xe (quãng đường), con quay hồi chuyển (hướng), nhiều mẫu có thêm lidar hoặc camera (lập bản đồ).</p>
<p><b>Suy nghĩ:</b> dựng bản đồ, ước lượng vị trí của chính nó trên bản đồ, lập đường quét phủ từng hàng, quyết định về trạm sạc khi pin yếu.</p>
<p><b>Hành động:</b> hai động cơ bánh (dẫn động vi sai), động cơ chổi và động cơ hút.</p>
<p><b>Kết luận:</b> vật lý ✓, cảm nhận ✓, quyết định ✓, hành động ✓ — là robot, và là robot tự chủ.</p></div>
<div class="callout"><p><b>Phân loại:</b> (a) cửa tự động có cảm biến chuyển động — có cảm nhận và hành động, nhưng “quyết định” chỉ là một luật cố định: nằm ở ranh giới, thường gọi là <em>tự động hoá</em>. (b) Chương trình chơi cờ — có suy nghĩ, không có thân: <em>AI, không phải robot</em>. (c) Drone tự giữ vị trí khi có gió nhờ GPS và IMU — <em>là robot</em>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ robot phải trông giống người. Phần lớn robot là cánh tay, xe đẩy hoặc drone.</li><li>Gọi mọi phần mềm “bot” là robot. Không có thân thể tác động lên thế giới vật lý thì đó là phần mềm, không phải robot.</li><li>Quên vòng lặp: robot hành động mà không cảm nhận (vòng hở) sẽ hỏng ngay khi thế giới khác với kế hoạch.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Robot = cỗ máy vật lý biết cảm nhận, quyết định và hành động.</li><li>ISO 8373: robot công nghiệp = tay máy lập trình lại được, đa năng, có ≥ 3 trục lập trình được.</li><li>Cảm nhận → suy nghĩ → hành động → (thế giới đổi) → cảm nhận: phản hồi là trái tim của robotics.</li><li>AI là phần “suy nghĩ”; robotics thêm vào một thân thể.</li><li>Mức tự chủ trải từ điều khiển từ xa đến tự chủ hoàn toàn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://robots.ieee.org/learn/" target="_blank" rel="noopener">IEEE ROBOTS — Tìm hiểu về robotics</a></li><li><a href="https://en.wikipedia.org/wiki/Robot" target="_blank" rel="noopener">Wikipedia — Robot</a></li><li><a href="https://en.wikipedia.org/wiki/Intelligent_agent" target="_blank" rel="noopener">Wikipedia — Tác tử thông minh (Intelligent agent)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với xe tự lái, kể hai cảm biến, hai việc “suy nghĩ” và hai cơ cấu chấp hành.</li><li>Máy in 3D có phải robot theo định nghĩa làm việc không? Theo ISO 8373 thì sao?</li><li>Vì sao robot cần phản hồi? Nêu một thất bại cụ thể của robot chạy vòng hở.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Cảm biến: camera, lidar, radar, GPS, IMU, cảm biến tốc độ bánh. Suy nghĩ: phát hiện người đi bộ, định vị trên bản đồ, lập kế hoạch chuyển làn, điều khiển tốc độ. Chấp hành: động cơ lái, ga (động cơ kéo), phanh. 2) Nó di chuyển đầu in theo 3 trục và lập trình lại được, nhưng gần như không cảm nhận môi trường và chỉ làm một việc; đa số kỹ sư xếp nó là máy công cụ (tự động hoá), không phải robot, và nó không phải <em>tay máy</em> theo nghĩa ISO. 3) Không có phản hồi thì robot không phát hiện được sai lệch: robot hút bụi được lệnh “đi thẳng 2 m” sẽ đâm vào chiếc ghế vừa bị dời chỗ, hoặc dừng sai chỗ nếu bánh bị trượt.</p></div>`);

const r12 = L('rai101-ts-1-2',
  '1.2 — A short history of robotics and AI|||1.2 — Lược sử robotics và trí tuệ nhân tạo',
  'Các mốc chính: R.U.R. 1920, Asimov 1942, Turing 1950, Dartmouth 1956, Unimate 1961, Shakey và A*, mùa đông AI, Deep Blue, DARPA Grand Challenge, ROS, học sâu, mô hình ngôn ngữ lớn.',
  `<span class="eyebrow">RAI101 · Chapter 1 · Lesson 1.2</span>
<h2>A short history of robotics and AI</h2>
<p class="lead">Robotics and AI grew up as two separate fields — one from mechanical and control engineering, the other from logic and computer science — and keep meeting again. Knowing the milestones tells you <em>why</em> today's tools look the way they do.</p>
<h3>🎯 Objectives</h3>
<ul><li>Place the main milestones of robotics and AI on a timeline.</li><li>Explain why Shakey the robot is a landmark for both fields.</li><li>Describe the cycles of hype and “AI winters”, and what ended them.</li><li>Connect history to the tools you will use in this course (A*, ROS, deep learning).</li></ul>
<h3>📖 Lecture</h3>
<h4>1. Ideas before machines (1920–1950)</h4>
<ul><li><strong>1920</strong> — Karel Čapek's play <em>R.U.R.</em> introduces the word “robot”.</li><li><strong>1942</strong> — Isaac Asimov's story <em>Runaround</em> states the <strong>Three Laws of Robotics</strong>. They are fiction, not engineering rules, but they started the public debate on robot safety.</li><li><strong>1948</strong> — Norbert Wiener publishes <em>Cybernetics</em>: control and communication through <strong>feedback</strong> in animals and machines — the mathematical root of robot control.</li><li><strong>1950</strong> — Alan Turing asks “Can machines think?” and proposes the imitation game (the <strong>Turing test</strong>).</li></ul>
<h4>2. Birth of both fields (1954–1972)</h4>
<ul><li><strong>1954</strong> — George Devol files the patent for a programmable transfer arm; with Joseph Engelberger he founds Unimation.</li><li><strong>1956</strong> — The <strong>Dartmouth workshop</strong> (McCarthy, Minsky, Shannon, Rochester) coins the term “artificial intelligence”.</li><li><strong>1961</strong> — The first <strong>Unimate</strong> arm starts work on a General Motors line in New Jersey, handling hot die-cast parts — the first industrial robot.</li><li><strong>1966–1972</strong> — <strong>Shakey</strong> at SRI (Stanford Research Institute) is the first mobile robot that reasons about its own actions: camera + range finder, a world model, a planner. The <strong>A* search algorithm</strong> (1968), which you will code in Chapter 7, was invented for Shakey.</li></ul>
<h4>3. Industry booms, AI winters (1970s–1990s)</h4>
<p>Industrial arms spread through car factories (the electric Stanford Arm 1969, the PUMA 1978, SCARA arms 1981). Meanwhile AI promised too much: early programs worked on toy problems but failed on real ones, funding collapsed in the <strong>AI winters</strong> (mid-1970s, late 1980s). Expert systems (rules written by hand) had a commercial boom in the 1980s and then hit the same wall: the real world has too many exceptions to write down. Robotics researchers like Rodney Brooks (1986) answered with <em>behaviour-based</em> robots that react quickly to sensors instead of planning everything.</p>
<h4>4. Probability, data and open source (1990s–2010s)</h4>
<ul><li><strong>1997</strong> — IBM's Deep Blue beats world chess champion Garry Kasparov — search plus hand-tuned evaluation.</li><li><strong>1990s–2000s</strong> — <strong>Probabilistic robotics</strong>: robots represent uncertainty explicitly (Kalman and particle filters, SLAM). This made reliable mobile robots possible.</li><li><strong>2002</strong> — the Roomba brings robots into homes.</li><li><strong>2005</strong> — Stanford's car <em>Stanley</em> wins the DARPA Grand Challenge, driving 212 km of desert autonomously — the start of self-driving cars.</li><li><strong>2007–2010</strong> — Willow Garage develops <strong>ROS</strong>, the open-source Robot Operating System (Chapter 10). ROS 2 followed from 2017.</li><li><strong>2012</strong> — AlexNet wins the ImageNet competition with a deep convolutional network: the <strong>deep learning</strong> era begins (Chapter 9).</li><li><strong>2016</strong> — AlphaGo beats Lee Sedol at Go, combining deep learning, search and reinforcement learning.</li></ul>
<h4>5. Today: foundation models meet robots (2020s)</h4>
<p>Large language and vision models (ChatGPT, 2022) can now describe scenes and plan tasks in natural language. Researchers connect them to robot bodies (“physical AI”), while collaborative robots and warehouse robots are mainstream products. The hard problems that remain are exactly the ones in this course: reliable perception, safe control, and acting under uncertainty.</p>
<h3>✍️ Worked example — reading the timeline</h3>
<div class="callout"><p><b>Question:</b> A* was invented for a robot, so why is it taught in AI courses?</p>
<p><b>Step 1:</b> Shakey needed to plan routes through rooms — a <em>search</em> problem over possible positions. <b>Step 2:</b> Hart, Nilsson and Raphael added a <em>heuristic</em> (straight-line distance to the goal) to Dijkstra's search so it explores fewer positions. <b>Step 3:</b> The idea is general — any problem written as states + actions + goal can use it (puzzles, games, route finding). <b>Conclusion:</b> robotics produced a core AI algorithm; the two fields feed each other.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Treating Asimov's laws as real safety standards — real robot safety uses standards such as ISO 10218 (Chapter 11).</li><li>Believing AI started with ChatGPT: the field is 70 years old and most ideas in this course predate 2010.</li><li>Assuming progress is steady: both fields moved in bursts, often triggered by new hardware (cheap sensors, GPUs) and new data.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>1920 word “robot”; 1942 Asimov's laws; 1950 Turing test; 1956 Dartmouth names AI.</li><li>1961 Unimate = first industrial robot; 1966–72 Shakey = first reasoning mobile robot (A*).</li><li>AI winters followed over-promising; probability and data revived the field.</li><li>2005 DARPA Grand Challenge, 2007+ ROS, 2012 deep learning, 2020s foundation models.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.ifr.org/robot-history" target="_blank" rel="noopener">International Federation of Robotics — Robot history</a></li><li><a href="https://en.wikipedia.org/wiki/Shakey_the_robot" target="_blank" rel="noopener">Wikipedia — Shakey the robot</a></li><li><a href="https://en.wikipedia.org/wiki/Timeline_of_artificial_intelligence" target="_blank" rel="noopener">Wikipedia — Timeline of artificial intelligence</a></li><li><a href="https://en.wikipedia.org/wiki/DARPA_Grand_Challenge" target="_blank" rel="noopener">Wikipedia — DARPA Grand Challenge</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Put in order: ROS, Unimate, Dartmouth workshop, AlexNet, Shakey.</li><li>Name one technical reason for the AI winters and one reason AI came back.</li><li>Which of the milestones above were driven by a <em>competition</em>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Dartmouth (1956) → Unimate (1961) → Shakey (1966–72) → ROS (2007+) → AlexNet (2012). 2) Winters: methods worked on toy problems but did not scale (combinatorial explosion, too many hand-written rules), and computers were slow. Return: probabilistic methods, much more data, cheap computing power (GPUs) and machine learning. 3) The DARPA Grand Challenge (2004–2005) and the ImageNet challenge (AlexNet, 2012); chess and Go matches were also public challenges.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 1 · Bài 1.2</span>
<h2>Lược sử robotics và trí tuệ nhân tạo</h2>
<p class="lead">Robotics và AI lớn lên như hai ngành riêng — một từ cơ khí và điều khiển, một từ logic và khoa học máy tính — rồi liên tục gặp lại nhau. Biết các mốc lịch sử giúp bạn hiểu <em>vì sao</em> công cụ hôm nay lại có hình dạng như vậy.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đặt các mốc chính của robotics và AI lên trục thời gian.</li><li>Giải thích vì sao robot Shakey là cột mốc của cả hai ngành.</li><li>Mô tả các chu kỳ thổi phồng và “mùa đông AI”, và điều gì chấm dứt chúng.</li><li>Nối lịch sử với công cụ bạn sẽ dùng trong môn (A*, ROS, học sâu).</li></ul>
<h3>📖 Bài giảng</h3>
<h4>1. Ý tưởng đi trước máy móc (1920–1950)</h4>
<ul><li><strong>1920</strong> — Vở kịch <em>R.U.R.</em> của Karel Čapek đưa ra từ “robot”.</li><li><strong>1942</strong> — Truyện <em>Runaround</em> của Isaac Asimov phát biểu <strong>Ba định luật robot</strong>. Đó là văn chương, không phải quy tắc kỹ thuật, nhưng mở ra cuộc tranh luận công khai về an toàn robot.</li><li><strong>1948</strong> — Norbert Wiener xuất bản <em>Cybernetics</em>: điều khiển và truyền tin bằng <strong>phản hồi</strong> ở động vật và máy móc — gốc toán học của điều khiển robot.</li><li><strong>1950</strong> — Alan Turing hỏi “Máy có thể suy nghĩ không?” và đề xuất trò chơi bắt chước (<strong>phép thử Turing</strong>).</li></ul>
<h4>2. Hai ngành ra đời (1954–1972)</h4>
<ul><li><strong>1954</strong> — George Devol nộp bằng sáng chế cánh tay chuyển phôi lập trình được; cùng Joseph Engelberger lập ra công ty Unimation.</li><li><strong>1956</strong> — <strong>Hội thảo Dartmouth</strong> (McCarthy, Minsky, Shannon, Rochester) đặt ra thuật ngữ “trí tuệ nhân tạo”.</li><li><strong>1961</strong> — Cánh tay <strong>Unimate</strong> đầu tiên làm việc trên dây chuyền General Motors ở New Jersey, gắp chi tiết đúc nóng — robot công nghiệp đầu tiên.</li><li><strong>1966–1972</strong> — <strong>Shakey</strong> ở SRI (Viện nghiên cứu Stanford) là robot di động đầu tiên biết suy luận về hành động của chính nó: camera + máy đo xa, mô hình thế giới, bộ lập kế hoạch. <strong>Thuật toán tìm kiếm A*</strong> (1968) — bạn sẽ tự viết ở Chương 7 — được phát minh cho Shakey.</li></ul>
<h4>3. Công nghiệp bùng nổ, AI vào mùa đông (1970–1990)</h4>
<p>Cánh tay công nghiệp lan khắp nhà máy ô tô (Stanford Arm chạy điện 1969, PUMA 1978, tay SCARA 1981). Trong khi đó AI hứa quá nhiều: chương trình đầu tiên chạy được trên bài toán đồ chơi nhưng thất bại với bài toán thật, kinh phí sụp trong các <strong>mùa đông AI</strong> (giữa thập niên 1970, cuối thập niên 1980). Hệ chuyên gia (luật viết tay) bùng nổ thương mại thập niên 1980 rồi đụng cùng bức tường: thế giới thật có quá nhiều ngoại lệ để viết hết ra. Nhà nghiên cứu robot như Rodney Brooks (1986) đáp lại bằng robot <em>dựa trên hành vi</em>, phản ứng nhanh theo cảm biến thay vì lập kế hoạch mọi thứ.</p>
<h4>4. Xác suất, dữ liệu và mã nguồn mở (1990–2010)</h4>
<ul><li><strong>1997</strong> — Deep Blue của IBM thắng nhà vô địch cờ vua thế giới Garry Kasparov — tìm kiếm cộng hàm đánh giá chỉnh tay.</li><li><strong>1990–2000</strong> — <strong>Robotics xác suất</strong>: robot biểu diễn độ bất định một cách tường minh (bộ lọc Kalman, bộ lọc hạt, SLAM). Nhờ đó mới có robot di động đáng tin cậy.</li><li><strong>2002</strong> — Roomba đưa robot vào gia đình.</li><li><strong>2005</strong> — Xe <em>Stanley</em> của Stanford thắng DARPA Grand Challenge, tự lái 212 km qua sa mạc — khởi đầu xe tự lái.</li><li><strong>2007–2010</strong> — Willow Garage phát triển <strong>ROS</strong>, “hệ điều hành robot” mã nguồn mở (Chương 10). ROS 2 tiếp nối từ 2017.</li><li><strong>2012</strong> — AlexNet thắng cuộc thi ImageNet bằng mạng tích chập sâu: kỷ nguyên <strong>học sâu</strong> bắt đầu (Chương 9).</li><li><strong>2016</strong> — AlphaGo thắng Lee Sedol ở cờ vây, kết hợp học sâu, tìm kiếm và học tăng cường.</li></ul>
<h4>5. Hôm nay: mô hình nền tảng gặp robot (2020s)</h4>
<p>Mô hình ngôn ngữ và thị giác lớn (ChatGPT, 2022) đã mô tả được cảnh vật và lập kế hoạch việc bằng ngôn ngữ tự nhiên. Các nhóm nghiên cứu nối chúng với thân robot (“AI vật lý”), còn robot cộng tác và robot kho hàng đã là sản phẩm phổ biến. Những bài toán khó còn lại chính là nội dung của môn này: nhận thức tin cậy, điều khiển an toàn, và hành động khi không chắc chắn.</p>
<h3>✍️ Ví dụ — đọc trục thời gian</h3>
<div class="callout"><p><b>Câu hỏi:</b> A* được phát minh cho một robot, vậy sao nó lại được dạy trong môn AI?</p>
<p><b>Bước 1:</b> Shakey cần lập lộ trình qua các phòng — một bài toán <em>tìm kiếm</em> trên các vị trí có thể. <b>Bước 2:</b> Hart, Nilsson và Raphael thêm một <em>hàm heuristic</em> (khoảng cách đường chim bay tới đích) vào thuật toán Dijkstra để nó duyệt ít vị trí hơn. <b>Bước 3:</b> Ý tưởng mang tính tổng quát — bài toán nào viết được dưới dạng trạng thái + hành động + đích đều dùng được (câu đố, trò chơi, tìm đường). <b>Kết luận:</b> robotics sinh ra một thuật toán cốt lõi của AI; hai ngành nuôi dưỡng nhau.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Coi ba định luật Asimov là tiêu chuẩn an toàn thật — an toàn robot thực tế dùng tiêu chuẩn như ISO 10218 (Chương 11).</li><li>Tin rằng AI bắt đầu từ ChatGPT: ngành đã 70 tuổi và phần lớn ý tưởng trong môn này có trước 2010.</li><li>Cho rằng tiến bộ diễn ra đều đặn: cả hai ngành tiến theo từng đợt, thường do phần cứng mới (cảm biến rẻ, GPU) và dữ liệu mới kích hoạt.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>1920 từ “robot”; 1942 định luật Asimov; 1950 phép thử Turing; 1956 Dartmouth đặt tên AI.</li><li>1961 Unimate = robot công nghiệp đầu tiên; 1966–72 Shakey = robot di động biết suy luận đầu tiên (A*).</li><li>Mùa đông AI đến sau những lời hứa quá đà; xác suất và dữ liệu hồi sinh ngành.</li><li>2005 DARPA Grand Challenge, 2007+ ROS, 2012 học sâu, 2020s mô hình nền tảng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.ifr.org/robot-history" target="_blank" rel="noopener">Liên đoàn Robot Quốc tế (IFR) — Lịch sử robot</a></li><li><a href="https://en.wikipedia.org/wiki/Shakey_the_robot" target="_blank" rel="noopener">Wikipedia — Robot Shakey</a></li><li><a href="https://en.wikipedia.org/wiki/Timeline_of_artificial_intelligence" target="_blank" rel="noopener">Wikipedia — Dòng thời gian của trí tuệ nhân tạo</a></li><li><a href="https://en.wikipedia.org/wiki/DARPA_Grand_Challenge" target="_blank" rel="noopener">Wikipedia — DARPA Grand Challenge</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Sắp xếp theo thời gian: ROS, Unimate, hội thảo Dartmouth, AlexNet, Shakey.</li><li>Nêu một lý do kỹ thuật gây ra mùa đông AI và một lý do AI quay trở lại.</li><li>Những mốc nào ở trên được thúc đẩy bởi một <em>cuộc thi</em>?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Dartmouth (1956) → Unimate (1961) → Shakey (1966–72) → ROS (2007+) → AlexNet (2012). 2) Mùa đông: phương pháp chạy được trên bài toán đồ chơi nhưng không mở rộng được (bùng nổ tổ hợp, quá nhiều luật viết tay), và máy tính còn chậm. Quay lại: phương pháp xác suất, dữ liệu nhiều hơn hẳn, sức tính toán rẻ (GPU) và học máy. 3) DARPA Grand Challenge (2004–2005) và cuộc thi ImageNet (AlexNet, 2012); các trận cờ vua và cờ vây cũng là thử thách công khai.</p></div>`);

const r13 = L('rai101-ts-1-3',
  '1.3 — Types of robots and where they are used|||1.3 — Các loại robot và nơi chúng được sử dụng',
  'Phân loại robot theo kết cấu (tay máy khớp nối, SCARA, delta, Đề-các), theo khả năng di chuyển (bánh, chân, bay, dưới nước), robot cộng tác, robot dịch vụ, nhân hình; chọn loại robot cho một nhiệm vụ.',
  `<span class="eyebrow">RAI101 · Chapter 1 · Lesson 1.3</span>
<h2>Types of robots and where they are used</h2>
<p class="lead">There is no single “robot”. An engineer first asks: <em>what must be moved, where, how fast, how precisely, and next to whom?</em> The answer picks the robot type. This lesson gives you the map of robot families used in industry and research.</p>
<h3>🎯 Objectives</h3>
<ul><li>Classify robots by structure, mobility and application.</li><li>Compare the four common industrial arm types: articulated, SCARA, delta, Cartesian.</li><li>Describe mobile robot families: wheeled, legged, aerial, underwater.</li><li>Choose a suitable robot type for a given task and justify it.</li></ul>
<h3>📖 Lecture</h3>
<h4>1. Fixed-base manipulators (industrial arms)</h4>
<ul><li><strong>Articulated arm</strong> — 6 rotary joints like a human arm (shoulder, elbow, wrist). Most flexible: welding, painting, assembly, machine tending. Large workspace, but more complex kinematics (Chapter 4).</li><li><strong>SCARA</strong> (Selective Compliance Assembly Robot Arm) — two horizontal rotary joints + one vertical axis. Stiff vertically, fast horizontally: pick-and-place, screwing, electronics assembly.</li><li><strong>Delta (parallel) robot</strong> — three light arms joined at one platform. Extremely fast (food packaging, sorting on conveyors), small payload.</li><li><strong>Cartesian / gantry</strong> — three linear axes X, Y, Z. Simple to program and very precise; CNC-like machines, large gantries in warehouses.</li></ul>
<p>The <strong>collaborative robot (cobot)</strong> is a manipulator designed to work <em>next to people</em> without a cage: limited speed and force, torque sensing in the joints, rounded shape. Cobots made robots affordable for small factories.</p>
<h4>2. Mobile robots</h4>
<ul><li><strong>Wheeled</strong> — simplest and most efficient on flat floors: robot vacuums, AGVs (follow lines or markers) and AMRs (autonomous mobile robots that plan their own paths) in warehouses, delivery robots, self-driving cars. Typical drive: differential drive (two wheels + caster), car-like (Ackermann) steering, or omni-wheels.</li><li><strong>Legged</strong> — walk on stairs and rough terrain: quadrupeds for inspection, bipedal humanoids. Harder to control because balance must be maintained actively.</li><li><strong>Aerial</strong> — multirotor drones (inspection, mapping, agriculture spraying, delivery) and fixed-wing UAVs for long range.</li><li><strong>Underwater / surface</strong> — ROVs (tethered) and AUVs (autonomous) for offshore and pipeline inspection, ocean science.</li><li><strong>Mobile manipulators</strong> — an arm on a mobile base: picking items from shelves, hospital logistics.</li></ul>
<h4>3. By application</h4>
<div class="kv-grid"><div class="kv"><span class="k">Industrial</span><span class="v">welding, painting, assembly, palletising (automotive, electronics)</span></div><div class="kv"><span class="k">Logistics</span><span class="v">AMRs moving shelves, sorting, picking</span></div><div class="kv"><span class="k">Medical</span><span class="v">surgical robots (e.g. da Vinci, teleoperated), rehabilitation, hospital delivery</span></div><div class="kv"><span class="k">Domestic &amp; service</span><span class="v">vacuums, lawn mowers, reception, cleaning</span></div><div class="kv"><span class="k">Field</span><span class="v">agriculture, mining, construction, space rovers</span></div><div class="kv"><span class="k">Research &amp; education</span><span class="v">TurtleBot, small arms, humanoids</span></div></div>
<h3>✍️ Worked example — choose the robot</h3>
<div class="callout"><p><b>Task A:</b> place 120 chocolates per minute from a conveyor into boxes, each 20 g.<br><b>Reasoning:</b> tiny payload, very high speed, small area above a conveyor → <b>delta robot</b>.</p>
<p><b>Task B:</b> weld car body panels along 3D seams, 10 kg welding torch.<br><b>Reasoning:</b> tool must reach any position <em>and</em> orientation in a large space → <b>6-axis articulated arm</b>.</p>
<p><b>Task C:</b> move parts between machines in a factory where workers walk around.<br><b>Reasoning:</b> needs mobility, path planning around people, safety sensors → <b>AMR</b> (wheeled, with lidar).</p>
<p><b>Task D:</b> a small workshop wants a robot to hand screws to a worker on the same bench.<br><b>Reasoning:</b> shared space with a human, no room for a fence → <b>cobot</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Choosing a humanoid because it looks impressive: for a defined task a specialised robot is cheaper, faster and more reliable.</li><li>Confusing AGV and AMR: an AGV follows fixed guides; an AMR builds a map and plans its own route.</li><li>Assuming “cobot” means safe in every application — a cobot holding a knife is still dangerous; safety depends on the whole application (Chapter 11).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Fixed manipulators: articulated (flexible), SCARA (fast planar), delta (fastest, light), Cartesian (simple, precise).</li><li>Cobots work beside people with limited force and speed.</li><li>Mobile robots: wheeled, legged, aerial, underwater, mobile manipulators.</li><li>Pick the robot from the task: payload, speed, workspace, precision, environment, people nearby.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://robotsguide.com/learn/types-of-robots" target="_blank" rel="noopener">IEEE ROBOTS Guide — Types of robots</a></li><li><a href="https://en.wikipedia.org/wiki/Industrial_robot" target="_blank" rel="noopener">Wikipedia — Industrial robot (arm types)</a></li><li><a href="https://en.wikipedia.org/wiki/Cobot" target="_blank" rel="noopener">Wikipedia — Cobot</a></li><li><a href="https://www.ifr.org/worldrobotics/" target="_blank" rel="noopener">IFR — World Robotics statistics</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Which arm type for inserting electronic components into a circuit board at high speed? Why?</li><li>Give one advantage and one disadvantage of legged robots compared with wheeled robots.</li><li>A farm wants to monitor crop health over 50 hectares every week. Suggest a robot type.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) SCARA: fast horizontal motion, stiff vertical insertion, compact — the classic electronics assembly robot. 2) Advantage: climbs stairs and crosses rough terrain. Disadvantage: more motors, more energy and a harder balance-control problem, so it is more expensive and less efficient on flat ground. 3) An aerial robot (drone) with a camera — covers large areas quickly; a ground robot would be slow.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 1 · Bài 1.3</span>
<h2>Các loại robot và nơi chúng được sử dụng</h2>
<p class="lead">Không có một “con robot” chung chung. Kỹ sư luôn hỏi trước: <em>cần di chuyển cái gì, ở đâu, nhanh cỡ nào, chính xác cỡ nào, và làm cạnh ai?</em> Câu trả lời quyết định loại robot. Bài này cho bạn bản đồ các họ robot dùng trong công nghiệp và nghiên cứu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân loại robot theo kết cấu, khả năng di chuyển và ứng dụng.</li><li>So sánh bốn kiểu tay máy công nghiệp phổ biến: khớp nối, SCARA, delta, Đề-các.</li><li>Mô tả các họ robot di động: bánh xe, chân, bay, dưới nước.</li><li>Chọn loại robot phù hợp cho một nhiệm vụ và giải thích lý do.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>1. Tay máy đế cố định (cánh tay công nghiệp)</h4>
<ul><li><strong>Tay máy khớp nối (articulated)</strong> — 6 khớp quay như tay người (vai, khuỷu, cổ tay). Linh hoạt nhất: hàn, sơn, lắp ráp, cấp phôi cho máy. Vùng làm việc lớn, nhưng động học phức tạp hơn (Chương 4).</li><li><strong>SCARA</strong> (Selective Compliance Assembly Robot Arm) — hai khớp quay nằm ngang + một trục thẳng đứng. Cứng theo phương đứng, nhanh theo phương ngang: gắp-đặt, vặn vít, lắp ráp điện tử.</li><li><strong>Robot delta (song song)</strong> — ba cánh tay nhẹ nối chung một bệ. Cực nhanh (đóng gói thực phẩm, phân loại trên băng chuyền), tải nhỏ.</li><li><strong>Robot Đề-các / gantry</strong> — ba trục tịnh tiến X, Y, Z. Dễ lập trình, rất chính xác; máy kiểu CNC, giàn lớn trong kho.</li></ul>
<p><strong>Robot cộng tác (cobot)</strong> là tay máy được thiết kế để làm việc <em>cạnh con người</em> không cần hàng rào: giới hạn tốc độ và lực, cảm biến mô-men ở khớp, hình dáng bo tròn. Cobot giúp xưởng nhỏ cũng mua được robot.</p>
<h4>2. Robot di động</h4>
<ul><li><strong>Bánh xe</strong> — đơn giản và tiết kiệm năng lượng nhất trên sàn phẳng: robot hút bụi, AGV (đi theo vạch hoặc mốc) và AMR (robot di động tự chủ, tự lập đường đi) trong kho, robot giao hàng, xe tự lái. Kiểu dẫn động thường gặp: vi sai (hai bánh + bánh tự lựa), lái kiểu ô tô (Ackermann), bánh đa hướng.</li><li><strong>Chân</strong> — đi được cầu thang và địa hình gồ ghề: robot bốn chân đi kiểm tra, robot hai chân dạng người. Khó điều khiển hơn vì phải chủ động giữ thăng bằng.</li><li><strong>Bay</strong> — drone nhiều cánh quạt (kiểm tra, lập bản đồ, phun thuốc nông nghiệp, giao hàng) và UAV cánh cố định cho tầm xa.</li><li><strong>Dưới nước / mặt nước</strong> — ROV (có dây) và AUV (tự hành) kiểm tra giàn khoan, đường ống, nghiên cứu đại dương.</li><li><strong>Tay máy di động</strong> — cánh tay gắn trên đế di động: lấy hàng từ kệ, hậu cần bệnh viện.</li></ul>
<h4>3. Theo ứng dụng</h4>
<div class="kv-grid"><div class="kv"><span class="k">Công nghiệp</span><span class="v">hàn, sơn, lắp ráp, xếp pallet (ô tô, điện tử)</span></div><div class="kv"><span class="k">Hậu cần</span><span class="v">AMR chở kệ, phân loại, lấy hàng</span></div><div class="kv"><span class="k">Y tế</span><span class="v">robot phẫu thuật (vd da Vinci, điều khiển từ xa), phục hồi chức năng, vận chuyển trong bệnh viện</span></div><div class="kv"><span class="k">Gia đình &amp; dịch vụ</span><span class="v">hút bụi, cắt cỏ, lễ tân, lau dọn</span></div><div class="kv"><span class="k">Thực địa</span><span class="v">nông nghiệp, khai mỏ, xây dựng, xe tự hành vũ trụ</span></div><div class="kv"><span class="k">Nghiên cứu &amp; giáo dục</span><span class="v">TurtleBot, tay máy nhỏ, robot dạng người</span></div></div>
<h3>✍️ Ví dụ — chọn robot</h3>
<div class="callout"><p><b>Việc A:</b> xếp 120 viên sô-cô-la mỗi phút từ băng chuyền vào hộp, mỗi viên 20 g.<br><b>Lập luận:</b> tải rất nhỏ, tốc độ rất cao, vùng nhỏ phía trên băng chuyền → <b>robot delta</b>.</p>
<p><b>Việc B:</b> hàn tấm thân xe theo đường hàn 3D, mỏ hàn nặng 10 kg.<br><b>Lập luận:</b> dụng cụ phải tới mọi vị trí <em>và</em> mọi hướng trong không gian lớn → <b>tay máy khớp nối 6 trục</b>.</p>
<p><b>Việc C:</b> chở chi tiết giữa các máy trong nhà xưởng có công nhân đi lại.<br><b>Lập luận:</b> cần di chuyển, lập đường tránh người, cảm biến an toàn → <b>AMR</b> (bánh xe, có lidar).</p>
<p><b>Việc D:</b> xưởng nhỏ muốn robot đưa ốc vít cho công nhân trên cùng một bàn.<br><b>Lập luận:</b> chung không gian với người, không có chỗ đặt hàng rào → <b>cobot</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chọn robot dạng người vì trông ấn tượng: với một nhiệm vụ xác định, robot chuyên dụng rẻ hơn, nhanh hơn, tin cậy hơn.</li><li>Nhầm AGV với AMR: AGV đi theo dẫn hướng cố định; AMR tự dựng bản đồ và tự lập lộ trình.</li><li>Cho rằng “cobot” thì ứng dụng nào cũng an toàn — cobot cầm dao vẫn nguy hiểm; an toàn phụ thuộc toàn bộ ứng dụng (Chương 11).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tay máy cố định: khớp nối (linh hoạt), SCARA (nhanh trong mặt phẳng), delta (nhanh nhất, tải nhẹ), Đề-các (đơn giản, chính xác).</li><li>Cobot làm việc cạnh người với lực và tốc độ giới hạn.</li><li>Robot di động: bánh xe, chân, bay, dưới nước, tay máy di động.</li><li>Chọn robot theo nhiệm vụ: tải trọng, tốc độ, vùng làm việc, độ chính xác, môi trường, có người ở gần hay không.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://robotsguide.com/learn/types-of-robots" target="_blank" rel="noopener">IEEE ROBOTS Guide — Các loại robot</a></li><li><a href="https://en.wikipedia.org/wiki/Industrial_robot" target="_blank" rel="noopener">Wikipedia — Robot công nghiệp (các kiểu tay máy)</a></li><li><a href="https://en.wikipedia.org/wiki/Cobot" target="_blank" rel="noopener">Wikipedia — Cobot</a></li><li><a href="https://www.ifr.org/worldrobotics/" target="_blank" rel="noopener">IFR — Thống kê World Robotics</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Kiểu tay máy nào để cắm linh kiện điện tử lên bo mạch tốc độ cao? Vì sao?</li><li>Nêu một ưu điểm và một nhược điểm của robot chân so với robot bánh xe.</li><li>Một trang trại muốn theo dõi sức khoẻ cây trồng trên 50 ha mỗi tuần. Đề xuất loại robot.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) SCARA: chuyển động ngang nhanh, cắm theo phương đứng cứng vững, gọn — robot lắp ráp điện tử kinh điển. 2) Ưu điểm: leo cầu thang, vượt địa hình gồ ghề. Nhược điểm: nhiều động cơ hơn, tốn năng lượng hơn và bài toán giữ thăng bằng khó hơn, nên đắt hơn và kém hiệu quả trên nền phẳng. 3) Robot bay (drone) gắn camera — phủ diện tích lớn nhanh; robot mặt đất sẽ rất chậm.</p></div>`);

const q1 = QZ(1, 'Quiz — Chapter 1: Robots & AI — definitions, history, types|||Quiz — Chương 1: Robot & AI — định nghĩa, lịch sử, phân loại', 'Kiểm tra chương 1: định nghĩa robot, vòng sense–think–act, mốc lịch sử, các loại robot và cách chọn.', [
  Q('q1', 'Which three capabilities define a robot in the working definition of this course?|||Ba khả năng nào định nghĩa robot theo định nghĩa làm việc của môn?',
    ['Speak, see, walk|||Nói, nhìn, đi', 'Sense, decide (think), act physically|||Cảm nhận, quyết định (suy nghĩ), tác động vật lý', 'Compute, store, display|||Tính toán, lưu trữ, hiển thị', 'Learn, remember, predict|||Học, nhớ, dự đoán'], 1,
    'A robot is a physical machine that senses, decides and acts on the world.|||Robot là cỗ máy vật lý biết cảm nhận, quyết định và tác động lên thế giới.'),
  Q('q2', 'In a robot vacuum, the wheel encoders belong to which stage of the loop?|||Trong robot hút bụi, encoder bánh xe thuộc khâu nào của vòng lặp?',
    ['Sense|||Cảm nhận', 'Think|||Suy nghĩ', 'Act|||Hành động', 'None of them|||Không khâu nào'], 0,
    'Encoders measure how far the wheels turned — a sensor.|||Encoder đo bánh đã quay bao nhiêu — đó là cảm biến.'),
  Q('q3', 'A chess-playing program on a laptop is best described as|||Chương trình chơi cờ trên laptop nên được mô tả là',
    ['an industrial robot|||robot công nghiệp', 'a mobile robot|||robot di động', 'AI software, not a robot (no physical action)|||phần mềm AI, không phải robot (không tác động vật lý)', 'a cobot|||cobot'], 2,
    'It thinks but has no body acting in the physical world.|||Nó suy nghĩ nhưng không có thân thể tác động lên thế giới vật lý.'),
  Q('q4', 'Where does the word “robot” come from?|||Từ “robot” bắt nguồn từ đâu?',
    ['Asimov’s story Runaround (1942)|||Truyện Runaround của Asimov (1942)', 'Čapek’s play R.U.R. (1920)|||Vở kịch R.U.R. của Čapek (1920)', 'The Dartmouth workshop (1956)|||Hội thảo Dartmouth (1956)', 'The Unimate patent (1954)|||Bằng sáng chế Unimate (1954)'], 1,
    'Czech “robota” = forced labour, used in R.U.R. in 1920.|||Tiếng Séc “robota” = lao động cưỡng bức, dùng trong R.U.R. năm 1920.'),
  Q('q5', 'The first industrial robot, Unimate, started work in 1961 at|||Robot công nghiệp đầu tiên Unimate bắt đầu làm việc năm 1961 tại',
    ['a General Motors plant|||một nhà máy General Motors', 'NASA|||NASA', 'Stanford Research Institute|||Viện nghiên cứu Stanford', 'IBM|||IBM'], 0,
    'It handled hot die-cast parts on a GM line in New Jersey.|||Nó gắp chi tiết đúc nóng trên dây chuyền GM ở New Jersey.'),
  Q('q6', 'Which algorithm was invented for the Shakey robot project?|||Thuật toán nào được phát minh cho dự án robot Shakey?',
    ['Backpropagation|||Lan truyền ngược', 'A* search|||Tìm kiếm A*', 'PID control|||Điều khiển PID', 'k-means|||k-means'], 1,
    'A* (Hart, Nilsson, Raphael, 1968) was created at SRI for Shakey’s route planning.|||A* (Hart, Nilsson, Raphael, 1968) ra đời ở SRI để Shakey lập lộ trình.'),
  Q('q7', 'The term “artificial intelligence” was coined at|||Thuật ngữ “trí tuệ nhân tạo” được đặt ra tại',
    ['the Dartmouth workshop, 1956|||hội thảo Dartmouth, 1956', 'the DARPA Grand Challenge, 2005|||DARPA Grand Challenge, 2005', 'Turing’s 1950 paper|||bài báo 1950 của Turing', 'the ImageNet challenge, 2012|||cuộc thi ImageNet, 2012'], 0,
    'McCarthy, Minsky, Shannon and Rochester proposed the 1956 workshop.|||McCarthy, Minsky, Shannon và Rochester đề xuất hội thảo năm 1956.'),
  Q('q8', 'Best robot type to pick 120 light items per minute from a conveyor:|||Loại robot phù hợp nhất để gắp 120 vật nhẹ mỗi phút từ băng chuyền:',
    ['Cartesian gantry|||Robot Đề-các (gantry)', 'Humanoid|||Robot dạng người', 'Delta (parallel) robot|||Robot delta (song song)', 'Quadruped|||Robot bốn chân'], 2,
    'Delta robots are the fastest for light pick-and-place.|||Robot delta nhanh nhất cho việc gắp-đặt vật nhẹ.'),
  Q('q9', 'What is the key difference between an AGV and an AMR?|||Khác biệt chính giữa AGV và AMR là gì?',
    ['AGVs fly, AMRs drive|||AGV bay, AMR chạy', 'An AGV follows fixed guides; an AMR maps and plans its own route|||AGV đi theo dẫn hướng cố định; AMR tự lập bản đồ và lộ trình', 'An AMR has no sensors|||AMR không có cảm biến', 'There is no difference|||Không có khác biệt'], 1,
    'Autonomous mobile robots plan around obstacles; AGVs follow lines or markers.|||Robot di động tự chủ tự lập đường tránh vật cản; AGV đi theo vạch hoặc mốc.'),
  Q('q10', 'A cobot is|||Cobot là',
    ['a robot that must always work inside a safety cage|||robot luôn phải làm việc trong lồng an toàn', 'a manipulator designed to work beside people with limited speed and force|||tay máy được thiết kế làm việc cạnh người với tốc độ và lực giới hạn', 'a software bot for chatting|||phần mềm bot để trò chuyện', 'a robot with no motors|||robot không có động cơ'], 1,
    'Collaborative robots share the workspace with humans; safety still depends on the whole application.|||Robot cộng tác chia sẻ không gian với người; an toàn vẫn phụ thuộc toàn bộ ứng dụng.'),
]);

const ch1 = {
  title: 'Chapter 1 — Robots and AI: definitions, history, types|||Chương 1 — Robot và AI: định nghĩa, lịch sử, phân loại',
  description: 'Robot là gì, vòng sense–think–act, mức tự chủ; lược sử robotics và AI từ R.U.R. tới mô hình nền tảng; các loại robot và cách chọn theo nhiệm vụ (Craig ch.1 · Siegwart ch.1 · AIMA ch.1).',
  lessons: [r11, r12, r13, q1],
};


// ───────────────────────────── Chương 2 — Giải phẫu robot: cảm biến, cơ cấu chấp hành, bộ điều khiển ─────────────────────────────
const r21 = L('rai101-ts-2-1',
  '2.1 — Sensors: how a robot measures itself and the world|||2.1 — Cảm biến: robot đo chính nó và thế giới thế nào',
  'Cảm biến nội/ngoại, chủ động/thụ động; encoder, IMU, siêu âm, lidar, camera; độ phân giải, độ chính xác, độ chụm, nhiễu; tính độ phân giải encoder và khoảng cách thời-gian-bay bằng Python.',
  `<span class="eyebrow">RAI101 · Chapter 2 · Lesson 2.1</span>
<h2>Sensors: how a robot measures itself and the world</h2>
<p class="lead">Everything a robot “knows” comes from its sensors. A planner can only be as good as the data it receives, so choosing sensors and understanding their limits is the first engineering skill in robotics.</p>
<h3>🎯 Objectives</h3>
<ul><li>Classify sensors as proprioceptive/exteroceptive and active/passive.</li><li>Explain how encoders, IMUs, ultrasonic sensors, lidar and cameras work.</li><li>Compute encoder resolution and time-of-flight distance.</li><li>Use the terms range, resolution, accuracy, precision, update rate and noise correctly.</li></ul>
<h3>📖 Lecture</h3>
<h4>Two ways to classify sensors</h4>
<ul><li><strong>Proprioceptive</strong> sensors measure the robot's <em>own</em> state: joint angles, wheel rotation, motor current, battery voltage, orientation. <strong>Exteroceptive</strong> sensors measure the <em>environment</em>: distances to walls, images, sounds, contact.</li><li><strong>Passive</strong> sensors only receive energy that is already there (a camera receives light). <strong>Active</strong> sensors emit energy and measure the return (ultrasonic, lidar, structured-light depth cameras). Active sensors work in the dark but can interfere with each other.</li></ul>
<h4>The sensors you will meet most</h4>
<ul><li><strong>Encoder</strong> (proprioceptive) — a disc with slots on a motor or wheel shaft. An <em>incremental</em> encoder outputs pulses as it turns; two channels A and B shifted by 90° (<em>quadrature</em>) also give the direction, and counting every edge gives 4 counts per line. An <em>absolute</em> encoder outputs the angle directly, even after power-up.</li><li><strong>IMU</strong> (inertial measurement unit) — accelerometers (linear acceleration, including gravity) + gyroscopes (angular velocity), often a magnetometer. Fast and self-contained, but integrating gyro rate to get an angle accumulates <strong>drift</strong>.</li><li><strong>Ultrasonic range sensor</strong> — sends a sound ping and times the echo. Cheap, but wide beam and poor on soft or angled surfaces.</li><li><strong>Lidar</strong> — the same time-of-flight idea with laser light; a spinning lidar gives hundreds of distance points per revolution: the main sensor for mapping.</li><li><strong>Camera</strong> — rich information (colour, texture, objects) but needs heavy processing (Chapter 9). Depth cameras add a distance per pixel.</li><li><strong>Contact / force</strong> — bumper switches, force-torque sensors in a robot wrist, tactile skins.</li></ul>
<div class="formula"><span class="lbl">Time of flight</span>d = v · t / 2     (v = speed of sound ≈ 343 m/s in air at 20 °C, or speed of light c ≈ 3·10<sup>8</sup> m/s; divide by 2 because the signal goes there and back)</div>
<div class="formula"><span class="lbl">Encoder resolution on a wheel</span>counts per revolution = 4 · PPR (quadrature)     distance per count = π · D / counts per revolution</div>
<h4>Describing sensor quality</h4>
<div class="kv-grid"><div class="kv"><span class="k">Range</span><span class="v">minimum and maximum measurable value (e.g. 0.02–4 m)</span></div><div class="kv"><span class="k">Resolution</span><span class="v">smallest change the sensor can report</span></div><div class="kv"><span class="k">Accuracy</span><span class="v">how close the average reading is to the true value (no bias)</span></div><div class="kv"><span class="k">Precision</span><span class="v">how close repeated readings are to each other (low spread)</span></div><div class="kv"><span class="k">Update rate</span><span class="v">readings per second (Hz)</span></div><div class="kv"><span class="k">Noise</span><span class="v">random variation; reduced by filtering and sensor fusion</span></div></div>
<h3>✍️ Worked example — encoder and range computations</h3>
<div class="callout"><p>A wheel of diameter 65 mm carries a 500-line quadrature encoder. An ultrasonic sensor hears its echo after 5.83 ms; a lidar pulse returns after 66.7 ns. Compute the resolution and the distances.</p></div>
<pre><code class="language-python">import math

# 1) Incremental quadrature encoder on a wheel
ppr = 500                 # lines (pulses) per revolution of the encoder disc
counts_per_rev = 4 * ppr  # quadrature decoding counts every edge of A and B
wheel_d = 0.065           # wheel diameter in metres
circumference = math.pi * wheel_d
res = circumference / counts_per_rev
print("counts per revolution:", counts_per_rev)
print("wheel circumference  : %.4f m" % circumference)
print("distance per count   : %.3f mm" % (res * 1000))
ticks = 12000
print("12000 counts -&gt; %.3f m travelled" % (ticks * res))

# 2) Time-of-flight range sensors: d = v * t / 2
v_sound = 343.0           # m/s in air at about 20 °C
t_echo = 5.83e-3          # seconds between ping and echo
print("ultrasonic: echo %.2f ms -&gt; %.3f m" % (t_echo * 1000, v_sound * t_echo / 2))
c = 299_792_458.0         # speed of light, m/s
t_lidar = 66.7e-9         # seconds
print("lidar: echo %.1f ns -&gt; %.3f m" % (t_lidar * 1e9, c * t_lidar / 2))
</code></pre>
<div class="out">counts per revolution: 2000
wheel circumference  : 0.2042 m
distance per count   : 0.102 mm
12000 counts -&gt; 1.225 m travelled
ultrasonic: echo 5.83 ms -&gt; 1.000 m
lidar: echo 66.7 ns -&gt; 9.998 m</div>
<p>Note the lidar numbers: 10 m corresponds to only 66.7 nanoseconds, so a 1 cm error is about 0.07 ns of timing — lidar electronics must be extremely fast.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the factor 1/2 in time-of-flight (the signal travels twice the distance).</li><li>Confusing resolution with accuracy: an encoder can report 0.1 mm steps, yet the robot's position is wrong by centimetres if the wheel slips.</li><li>Trusting a gyroscope-integrated angle for minutes — drift grows with time; it must be corrected by another sensor.</li><li>Mixing units (ms vs s, mm vs m) — always convert to SI before computing.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Proprioceptive = own state; exteroceptive = environment. Active sensors emit energy, passive ones do not.</li><li>Encoders measure rotation; quadrature gives direction and 4× counts.</li><li>Ultrasonic and lidar measure distance by time of flight: d = v·t/2.</li><li>IMUs are fast but drift; cameras are rich but need processing.</li><li>Specify sensors by range, resolution, accuracy, precision, update rate and noise.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Rotary_encoder" target="_blank" rel="noopener">Wikipedia — Rotary encoder (incremental, quadrature, absolute)</a></li><li><a href="https://en.wikipedia.org/wiki/Inertial_measurement_unit" target="_blank" rel="noopener">Wikipedia — Inertial measurement unit (drift)</a></li><li><a href="https://en.wikipedia.org/wiki/Lidar" target="_blank" rel="noopener">Wikipedia — Lidar</a></li><li><a href="https://en.wikipedia.org/wiki/Accuracy_and_precision" target="_blank" rel="noopener">Wikipedia — Accuracy and precision</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A 1024-line quadrature encoder sits on a wheel of diameter 100 mm. Distance per count?</li><li>An ultrasonic echo returns after 2.0 ms. How far is the obstacle?</li><li>Classify: GPS receiver, wheel encoder, depth camera, battery voltage monitor (proprio/extero, active/passive).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 4 · 1024 = 4096 counts/rev; π · 0.1 / 4096 ≈ 0.0767 mm per count. 2) d = 343 · 0.002 / 2 = 0.343 m. 3) GPS: exteroceptive, passive (receives satellite signals). Wheel encoder: proprioceptive (it shines light through its own disc, but it measures the robot itself). Depth camera: exteroceptive, usually active (projects infrared). Battery monitor: proprioceptive, passive.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 2 · Bài 2.1</span>
<h2>Cảm biến: robot đo chính nó và thế giới thế nào</h2>
<p class="lead">Mọi thứ robot “biết” đều đến từ cảm biến. Bộ lập kế hoạch giỏi tới đâu cũng chỉ bằng chất lượng dữ liệu nó nhận được, nên chọn cảm biến và hiểu giới hạn của chúng là kỹ năng kỹ thuật đầu tiên của robotics.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân loại cảm biến nội/ngoại (proprioceptive/exteroceptive) và chủ động/thụ động.</li><li>Giải thích cách encoder, IMU, cảm biến siêu âm, lidar và camera hoạt động.</li><li>Tính độ phân giải encoder và khoảng cách theo thời gian bay.</li><li>Dùng đúng các thuật ngữ dải đo, độ phân giải, độ chính xác, độ chụm, tần số cập nhật, nhiễu.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Hai cách phân loại cảm biến</h4>
<ul><li>Cảm biến <strong>nội (proprioceptive)</strong> đo trạng thái <em>của chính</em> robot: góc khớp, vòng quay bánh, dòng điện động cơ, điện áp pin, hướng. Cảm biến <strong>ngoại (exteroceptive)</strong> đo <em>môi trường</em>: khoảng cách tới tường, hình ảnh, âm thanh, va chạm.</li><li>Cảm biến <strong>thụ động</strong> chỉ thu năng lượng sẵn có (camera thu ánh sáng). Cảm biến <strong>chủ động</strong> phát năng lượng rồi đo phần phản hồi (siêu âm, lidar, camera độ sâu ánh sáng cấu trúc). Cảm biến chủ động chạy được trong bóng tối nhưng có thể gây nhiễu lẫn nhau.</li></ul>
<h4>Các cảm biến bạn sẽ gặp nhiều nhất</h4>
<ul><li><strong>Encoder</strong> (nội) — đĩa có khe gắn trên trục động cơ hay bánh xe. Encoder <em>tương đối (incremental)</em> phát xung khi quay; hai kênh A và B lệch nhau 90° (<em>quadrature</em>) cho biết thêm chiều quay, và đếm mọi sườn xung cho 4 lần đếm mỗi vạch. Encoder <em>tuyệt đối</em> xuất thẳng góc quay, kể cả ngay khi vừa bật nguồn.</li><li><strong>IMU</strong> (khối đo quán tính) — gia tốc kế (gia tốc thẳng, gồm cả trọng lực) + con quay hồi chuyển (vận tốc góc), thường kèm từ kế. Nhanh và độc lập, nhưng tích phân vận tốc góc để ra góc sẽ tích luỹ <strong>trôi (drift)</strong>.</li><li><strong>Cảm biến siêu âm</strong> — phát một xung âm và đo thời gian tiếng vọng. Rẻ, nhưng chùm tia rộng, đo kém trên bề mặt mềm hoặc nghiêng.</li><li><strong>Lidar</strong> — cùng nguyên lý thời gian bay nhưng dùng tia laser; lidar quay cho hàng trăm điểm khoảng cách mỗi vòng: cảm biến chính để lập bản đồ.</li><li><strong>Camera</strong> — thông tin phong phú (màu, kết cấu, vật thể) nhưng cần xử lý nặng (Chương 9). Camera độ sâu cho thêm khoảng cách tại mỗi điểm ảnh.</li><li><strong>Tiếp xúc / lực</strong> — công tắc va chạm, cảm biến lực-mô-men ở cổ tay robot, da xúc giác.</li></ul>
<div class="formula"><span class="lbl">Thời gian bay</span>d = v · t / 2     (v = tốc độ âm ≈ 343 m/s trong không khí 20 °C, hoặc tốc độ ánh sáng c ≈ 3·10<sup>8</sup> m/s; chia 2 vì tín hiệu đi rồi về)</div>
<div class="formula"><span class="lbl">Độ phân giải encoder trên bánh xe</span>số đếm mỗi vòng = 4 · PPR (quadrature)     quãng đường mỗi lần đếm = π · D / số đếm mỗi vòng</div>
<h4>Mô tả chất lượng cảm biến</h4>
<div class="kv-grid"><div class="kv"><span class="k">Dải đo</span><span class="v">giá trị nhỏ nhất và lớn nhất đo được (vd 0,02–4 m)</span></div><div class="kv"><span class="k">Độ phân giải</span><span class="v">thay đổi nhỏ nhất cảm biến báo được</span></div><div class="kv"><span class="k">Độ chính xác (accuracy)</span><span class="v">giá trị đo trung bình gần giá trị thật cỡ nào (không lệch)</span></div><div class="kv"><span class="k">Độ chụm (precision)</span><span class="v">các lần đo lặp lại gần nhau cỡ nào (ít phân tán)</span></div><div class="kv"><span class="k">Tần số cập nhật</span><span class="v">số lần đo mỗi giây (Hz)</span></div><div class="kv"><span class="k">Nhiễu</span><span class="v">dao động ngẫu nhiên; giảm bằng lọc và hợp nhất cảm biến</span></div></div>
<h3>✍️ Ví dụ — tính encoder và khoảng cách</h3>
<div class="callout"><p>Bánh xe đường kính 65 mm gắn encoder quadrature 500 vạch. Cảm biến siêu âm nghe tiếng vọng sau 5,83 ms; xung lidar quay về sau 66,7 ns. Tính độ phân giải và các khoảng cách.</p></div>
<pre><code class="language-python">import math

# 1) Incremental quadrature encoder on a wheel
ppr = 500                 # lines (pulses) per revolution of the encoder disc
counts_per_rev = 4 * ppr  # quadrature decoding counts every edge of A and B
wheel_d = 0.065           # wheel diameter in metres
circumference = math.pi * wheel_d
res = circumference / counts_per_rev
print("counts per revolution:", counts_per_rev)
print("wheel circumference  : %.4f m" % circumference)
print("distance per count   : %.3f mm" % (res * 1000))
ticks = 12000
print("12000 counts -&gt; %.3f m travelled" % (ticks * res))

# 2) Time-of-flight range sensors: d = v * t / 2
v_sound = 343.0           # m/s in air at about 20 °C
t_echo = 5.83e-3          # seconds between ping and echo
print("ultrasonic: echo %.2f ms -&gt; %.3f m" % (t_echo * 1000, v_sound * t_echo / 2))
c = 299_792_458.0         # speed of light, m/s
t_lidar = 66.7e-9         # seconds
print("lidar: echo %.1f ns -&gt; %.3f m" % (t_lidar * 1e9, c * t_lidar / 2))
</code></pre>
<div class="out">counts per revolution: 2000
wheel circumference  : 0.2042 m
distance per count   : 0.102 mm
12000 counts -&gt; 1.225 m travelled
ultrasonic: echo 5.83 ms -&gt; 1.000 m
lidar: echo 66.7 ns -&gt; 9.998 m</div>
<p>Để ý con số của lidar: 10 m chỉ ứng với 66,7 nano giây, nên sai 1 cm tương đương sai khoảng 0,07 ns về thời gian — mạch điện tử của lidar phải cực nhanh.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên hệ số 1/2 trong công thức thời gian bay (tín hiệu đi quãng đường gấp đôi).</li><li>Nhầm độ phân giải với độ chính xác: encoder báo được bước 0,1 mm, nhưng vị trí robot vẫn sai hàng xăng-ti-mét nếu bánh trượt.</li><li>Tin góc tích phân từ con quay hồi chuyển trong nhiều phút — sai số trôi tăng theo thời gian, phải được cảm biến khác hiệu chỉnh.</li><li>Lẫn đơn vị (ms với s, mm với m) — luôn đổi về SI trước khi tính.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cảm biến nội đo trạng thái bản thân; cảm biến ngoại đo môi trường. Cảm biến chủ động phát năng lượng, thụ động thì không.</li><li>Encoder đo góc quay; quadrature cho chiều quay và gấp 4 số đếm.</li><li>Siêu âm và lidar đo khoảng cách bằng thời gian bay: d = v·t/2.</li><li>IMU nhanh nhưng trôi; camera giàu thông tin nhưng cần xử lý.</li><li>Đặc tả cảm biến bằng dải đo, độ phân giải, độ chính xác, độ chụm, tần số cập nhật và nhiễu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Rotary_encoder" target="_blank" rel="noopener">Wikipedia — Encoder quay (tương đối, quadrature, tuyệt đối)</a></li><li><a href="https://en.wikipedia.org/wiki/Inertial_measurement_unit" target="_blank" rel="noopener">Wikipedia — Khối đo quán tính IMU (hiện tượng trôi)</a></li><li><a href="https://en.wikipedia.org/wiki/Lidar" target="_blank" rel="noopener">Wikipedia — Lidar</a></li><li><a href="https://en.wikipedia.org/wiki/Accuracy_and_precision" target="_blank" rel="noopener">Wikipedia — Độ chính xác và độ chụm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Encoder quadrature 1024 vạch gắn trên bánh đường kính 100 mm. Quãng đường mỗi lần đếm?</li><li>Tiếng vọng siêu âm quay về sau 2,0 ms. Vật cản cách bao xa?</li><li>Phân loại: bộ thu GPS, encoder bánh xe, camera độ sâu, mạch đo điện áp pin (nội/ngoại, chủ động/thụ động).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 4 · 1024 = 4096 lần đếm/vòng; π · 0,1 / 4096 ≈ 0,0767 mm mỗi lần đếm. 2) d = 343 · 0,002 / 2 = 0,343 m. 3) GPS: ngoại, thụ động (thu tín hiệu vệ tinh). Encoder bánh: nội (nó chiếu sáng qua đĩa của chính nó, nhưng đo bản thân robot). Camera độ sâu: ngoại, thường là chủ động (chiếu hồng ngoại). Mạch đo pin: nội, thụ động.</p></div>`);

const r22 = L('rai101-ts-2-2',
  '2.2 — Actuators and drives: motors, gears, torque and speed|||2.2 — Cơ cấu chấp hành và truyền động: động cơ, hộp số, mô-men và tốc độ',
  'Động cơ DC chổi than, BLDC, bước, servo; thuỷ lực, khí nén; hộp giảm tốc đổi tốc độ lấy mô-men, hiệu suất, công suất P = τω; tính tốc độ bánh, lực kéo, độ phân giải động cơ bước bằng Python.',
  `<span class="eyebrow">RAI101 · Chapter 2 · Lesson 2.2</span>
<h2>Actuators and drives: motors, gears, torque and speed</h2>
<p class="lead">Actuators are the robot's muscles. Most robots use electric motors, but a motor alone spins too fast and too weakly — so it is almost always paired with a gearbox. This lesson teaches you to pick a motor type and to compute what reaches the wheel or joint.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compare brushed DC, brushless DC (BLDC), stepper and servo motors, plus hydraulic and pneumatic actuators.</li><li>Use the gear-ratio relations between speed and torque, including efficiency.</li><li>Relate torque, angular speed and power (P = τω), and wheel torque to linear speed and force.</li><li>Compute the resolution of a stepper motor with microstepping.</li></ul>
<h3>📖 Lecture</h3>
<h4>Actuator families</h4>
<ul><li><strong>Brushed DC motor</strong> — cheap and simple: speed roughly proportional to voltage, torque proportional to current. Brushes wear out. Used in toys, small robots, wipers.</li><li><strong>Brushless DC (BLDC)</strong> — electronic commutation instead of brushes: efficient, long life, high power density. Needs a dedicated controller (ESC/driver). Used in drones, robot joints, e-scooters.</li><li><strong>Stepper motor</strong> — moves in fixed steps (typically 1.8° = 200 steps per revolution). Precise positioning without an encoder (open loop) as long as it does not skip steps under overload. Used in 3D printers, CNC, small gantries.</li><li><strong>Servo</strong> — any motor + sensor + controller that holds a commanded position. The hobby “RC servo” takes a pulse-width command and turns to an angle; industrial servos are BLDC motors with encoders and closed-loop drives.</li><li><strong>Hydraulic</strong> — pressurised oil: huge forces (excavators, heavy legged robots) but heavy and leak-prone. <strong>Pneumatic</strong> — compressed air: fast, cheap, compliant grippers, but hard to control precisely.</li></ul>
<h4>Gearboxes trade speed for torque</h4>
<div class="formula"><span class="lbl">Gear ratio N : 1 (reduction)</span>ω<sub>out</sub> = ω<sub>in</sub> / N     τ<sub>out</sub> = N · η · τ<sub>in</sub>     (η = efficiency, 0 &lt; η ≤ 1)</div>
<div class="formula"><span class="lbl">Power, speed, force</span>P = τ · ω (watts, with ω in rad/s)     ω = rpm · 2π / 60     v = ω · r     F = τ / r</div>
<p>Without losses (η = 1) power is conserved: the gearbox divides speed by N and multiplies torque by N. Real gearboxes lose energy as heat (η ≈ 0.6–0.95 depending on type and number of stages). Gearing also reduces the effect of the load on the motor, but adds <strong>backlash</strong> (play between teeth) that hurts precision.</p>
<h3>✍️ Worked example — from motor to wheel</h3>
<div class="callout"><p>A DC motor gives 0.05 N·m at 6000 rpm. It drives a wheel of radius 5 cm through a 30:1 gearbox with efficiency 80 %. Find the wheel speed, robot speed, torque, traction force and power. Then find the resolution of a 1.8° stepper driven with 16 microsteps.</p></div>
<pre><code class="language-python">import math

motor_torque = 0.05     # N·m at the motor shaft
motor_rpm = 6000        # rpm at the motor shaft
N = 30                  # gear ratio 30:1 (reduction)
eff = 0.80              # gearbox efficiency
r = 0.05                # wheel radius in metres

out_rpm = motor_rpm / N
out_torque = motor_torque * N * eff
omega = out_rpm * 2 * math.pi / 60          # rad/s
v = omega * r                                # m/s
force = out_torque / r                       # N at the tyre
p_in = motor_torque * motor_rpm * 2 * math.pi / 60
p_out = out_torque * omega
print("output speed : %.0f rpm = %.2f rad/s" % (out_rpm, omega))
print("output torque: %.2f N·m" % out_torque)
print("wheel speed  : %.3f m/s" % v)
print("traction force at wheel: %.0f N" % force)
print("power in %.1f W, power out %.1f W" % (p_in, p_out))

# Stepper motor resolution
step_angle = 1.8
full_steps = 360 / step_angle
micro = 16
print("stepper: %d full steps/rev, %d microsteps/rev, %.4f deg per microstep"
      % (full_steps, full_steps * micro, step_angle / micro))
</code></pre>
<div class="out">output speed : 200 rpm = 20.94 rad/s
output torque: 1.20 N·m
wheel speed  : 1.047 m/s
traction force at wheel: 24 N
power in 31.4 W, power out 25.1 W
stepper: 200 full steps/rev, 3200 microsteps/rev, 0.1125 deg per microstep</div>
<p><b>Reading the result:</b> the gearbox turned a fast, weak shaft (6000 rpm, 0.05 N·m) into a slow, strong one (200 rpm, 1.2 N·m). The 20 % of power lost (31.4 → 25.1 W) becomes heat. A robot of 10 kg needs about 10 · 9.81 · sin(5°) ≈ 8.6 N to climb a 5° ramp, so 24 N per wheel is plenty.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using rpm directly in P = τω — ω must be in rad/s.</li><li>Multiplying speed by N instead of dividing (a reduction gearbox makes the output <em>slower</em>).</li><li>Ignoring efficiency and stall torque: a motor sized with no margin overheats on ramps.</li><li>Assuming a stepper always knows its position — under overload it skips steps silently unless an encoder checks it.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Brushed DC: simple, cheap; BLDC: efficient, needs a driver; stepper: open-loop positioning; servo: motor + sensor + closed loop.</li><li>Hydraulics give force, pneumatics give speed and compliance.</li><li>Gearbox N:1 divides speed by N and multiplies torque by N·η.</li><li>P = τω; v = ωr; F = τ/r.</li><li>Stepper resolution = step angle / microsteps.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Brushed_DC_electric_motor" target="_blank" rel="noopener">Wikipedia — Brushed DC electric motor</a></li><li><a href="https://en.wikipedia.org/wiki/Stepper_motor" target="_blank" rel="noopener">Wikipedia — Stepper motor</a></li><li><a href="https://en.wikipedia.org/wiki/Servomotor" target="_blank" rel="noopener">Wikipedia — Servomotor</a></li><li><a href="https://en.wikipedia.org/wiki/Gear_train" target="_blank" rel="noopener">Wikipedia — Gear train (gear ratio, torque)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A motor gives 0.1 N·m at 3000 rpm through a 50:1 gearbox with η = 0.9. Output torque and speed?</li><li>What linear speed does a 100 rpm wheel of radius 0.1 m give?</li><li>Which actuator would you choose for (a) a drone propeller, (b) the gripper of a fruit-picking robot that must not bruise fruit?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) τ = 0.1 · 50 · 0.9 = 4.5 N·m; speed = 3000/50 = 60 rpm. 2) ω = 100 · 2π/60 ≈ 10.47 rad/s; v = 10.47 · 0.1 ≈ 1.05 m/s. 3) (a) BLDC motor — high speed, high efficiency, long life. (b) A soft pneumatic gripper (naturally compliant) or a servo gripper with force control.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 2 · Bài 2.2</span>
<h2>Cơ cấu chấp hành và truyền động: động cơ, hộp số, mô-men và tốc độ</h2>
<p class="lead">Cơ cấu chấp hành là cơ bắp của robot. Phần lớn robot dùng động cơ điện, nhưng riêng động cơ thì quay quá nhanh và quá yếu — nên gần như luôn đi kèm hộp giảm tốc. Bài này dạy bạn chọn loại động cơ và tính xem cái gì thực sự tới được bánh xe hay khớp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>So sánh động cơ DC chổi than, DC không chổi than (BLDC), động cơ bước và servo, cùng cơ cấu thuỷ lực và khí nén.</li><li>Dùng quan hệ tỉ số truyền giữa tốc độ và mô-men, có tính hiệu suất.</li><li>Liên hệ mô-men, tốc độ góc và công suất (P = τω), và mô-men bánh xe với tốc độ thẳng và lực.</li><li>Tính độ phân giải của động cơ bước có vi bước.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Các họ cơ cấu chấp hành</h4>
<ul><li><strong>Động cơ DC chổi than</strong> — rẻ và đơn giản: tốc độ gần tỉ lệ với điện áp, mô-men tỉ lệ với dòng điện. Chổi than bị mòn. Dùng trong đồ chơi, robot nhỏ, cần gạt nước.</li><li><strong>Động cơ DC không chổi than (BLDC)</strong> — đảo chiều bằng điện tử thay cho chổi than: hiệu suất cao, bền, mật độ công suất lớn. Cần bộ điều khiển riêng (ESC/driver). Dùng trong drone, khớp robot, xe điện nhỏ.</li><li><strong>Động cơ bước</strong> — quay theo từng bước cố định (thường 1,8° = 200 bước mỗi vòng). Định vị chính xác không cần encoder (vòng hở) miễn là không bị trượt bước khi quá tải. Dùng trong máy in 3D, CNC, giàn nhỏ.</li><li><strong>Servo</strong> — bất kỳ động cơ + cảm biến + bộ điều khiển nào giữ được vị trí đã ra lệnh. “Servo RC” nghiệp dư nhận lệnh độ rộng xung và quay tới một góc; servo công nghiệp là động cơ BLDC có encoder và bộ điều khiển vòng kín.</li><li><strong>Thuỷ lực</strong> — dầu áp suất cao: lực cực lớn (máy xúc, robot chân hạng nặng) nhưng nặng và dễ rò rỉ. <strong>Khí nén</strong> — khí nén: nhanh, rẻ, tay kẹp mềm mại, nhưng khó điều khiển chính xác.</li></ul>
<h4>Hộp số đổi tốc độ lấy mô-men</h4>
<div class="formula"><span class="lbl">Tỉ số truyền N : 1 (giảm tốc)</span>ω<sub>ra</sub> = ω<sub>vào</sub> / N     τ<sub>ra</sub> = N · η · τ<sub>vào</sub>     (η = hiệu suất, 0 &lt; η ≤ 1)</div>
<div class="formula"><span class="lbl">Công suất, tốc độ, lực</span>P = τ · ω (oát, với ω tính bằng rad/s)     ω = vòng/phút · 2π / 60     v = ω · r     F = τ / r</div>
<p>Nếu không có tổn hao (η = 1) thì công suất bảo toàn: hộp số chia tốc độ cho N và nhân mô-men lên N. Hộp số thật mất năng lượng thành nhiệt (η ≈ 0,6–0,95 tuỳ loại và số cấp). Hộp số cũng giảm ảnh hưởng của tải lên động cơ, nhưng thêm <strong>độ rơ (backlash)</strong> giữa các răng làm giảm độ chính xác.</p>
<h3>✍️ Ví dụ — từ động cơ tới bánh xe</h3>
<div class="callout"><p>Một động cơ DC cho 0,05 N·m ở 6000 vòng/phút. Nó kéo bánh xe bán kính 5 cm qua hộp số 30:1 hiệu suất 80 %. Tìm tốc độ bánh, tốc độ robot, mô-men, lực kéo và công suất. Sau đó tìm độ phân giải của động cơ bước 1,8° chạy 16 vi bước.</p></div>
<pre><code class="language-python">import math

motor_torque = 0.05     # N·m at the motor shaft
motor_rpm = 6000        # rpm at the motor shaft
N = 30                  # gear ratio 30:1 (reduction)
eff = 0.80              # gearbox efficiency
r = 0.05                # wheel radius in metres

out_rpm = motor_rpm / N
out_torque = motor_torque * N * eff
omega = out_rpm * 2 * math.pi / 60          # rad/s
v = omega * r                                # m/s
force = out_torque / r                       # N at the tyre
p_in = motor_torque * motor_rpm * 2 * math.pi / 60
p_out = out_torque * omega
print("output speed : %.0f rpm = %.2f rad/s" % (out_rpm, omega))
print("output torque: %.2f N·m" % out_torque)
print("wheel speed  : %.3f m/s" % v)
print("traction force at wheel: %.0f N" % force)
print("power in %.1f W, power out %.1f W" % (p_in, p_out))

# Stepper motor resolution
step_angle = 1.8
full_steps = 360 / step_angle
micro = 16
print("stepper: %d full steps/rev, %d microsteps/rev, %.4f deg per microstep"
      % (full_steps, full_steps * micro, step_angle / micro))
</code></pre>
<div class="out">output speed : 200 rpm = 20.94 rad/s
output torque: 1.20 N·m
wheel speed  : 1.047 m/s
traction force at wheel: 24 N
power in 31.4 W, power out 25.1 W
stepper: 200 full steps/rev, 3200 microsteps/rev, 0.1125 deg per microstep</div>
<p><b>Đọc kết quả:</b> hộp số biến một trục nhanh mà yếu (6000 vòng/phút, 0,05 N·m) thành trục chậm mà khoẻ (200 vòng/phút, 1,2 N·m). 20 % công suất bị mất (31,4 → 25,1 W) biến thành nhiệt. Robot 10 kg cần khoảng 10 · 9,81 · sin(5°) ≈ 8,6 N để leo dốc 5°, nên 24 N mỗi bánh là dư sức.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng thẳng vòng/phút trong P = τω — ω phải là rad/s.</li><li>Nhân tốc độ với N thay vì chia (hộp giảm tốc làm đầu ra <em>chậm hơn</em>).</li><li>Bỏ qua hiệu suất và mô-men kẹt: động cơ chọn không có dự trữ sẽ quá nhiệt khi lên dốc.</li><li>Tưởng động cơ bước luôn biết vị trí — khi quá tải nó trượt bước âm thầm nếu không có encoder kiểm tra.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>DC chổi than: đơn giản, rẻ; BLDC: hiệu suất cao, cần driver; động cơ bước: định vị vòng hở; servo: động cơ + cảm biến + vòng kín.</li><li>Thuỷ lực cho lực lớn, khí nén cho tốc độ và độ mềm.</li><li>Hộp số N:1 chia tốc độ cho N và nhân mô-men lên N·η.</li><li>P = τω; v = ωr; F = τ/r.</li><li>Độ phân giải động cơ bước = góc bước / số vi bước.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Brushed_DC_electric_motor" target="_blank" rel="noopener">Wikipedia — Động cơ DC chổi than</a></li><li><a href="https://en.wikipedia.org/wiki/Stepper_motor" target="_blank" rel="noopener">Wikipedia — Động cơ bước</a></li><li><a href="https://en.wikipedia.org/wiki/Servomotor" target="_blank" rel="noopener">Wikipedia — Động cơ servo</a></li><li><a href="https://en.wikipedia.org/wiki/Gear_train" target="_blank" rel="noopener">Wikipedia — Bộ truyền bánh răng (tỉ số truyền, mô-men)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Động cơ cho 0,1 N·m ở 3000 vòng/phút qua hộp số 50:1, η = 0,9. Mô-men và tốc độ đầu ra?</li><li>Bánh xe bán kính 0,1 m quay 100 vòng/phút cho tốc độ thẳng bao nhiêu?</li><li>Chọn cơ cấu chấp hành cho (a) cánh quạt drone, (b) tay kẹp robot hái quả không được làm dập quả.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) τ = 0,1 · 50 · 0,9 = 4,5 N·m; tốc độ = 3000/50 = 60 vòng/phút. 2) ω = 100 · 2π/60 ≈ 10,47 rad/s; v = 10,47 · 0,1 ≈ 1,05 m/s. 3) (a) Động cơ BLDC — tốc độ cao, hiệu suất cao, bền. (b) Tay kẹp mềm khí nén (mềm tự nhiên) hoặc tay kẹp servo có điều khiển lực.</p></div>`);

const r23 = L('rai101-ts-2-3',
  '2.3 — Controllers, power and robot system architecture|||2.3 — Bộ điều khiển, nguồn điện và kiến trúc hệ thống robot',
  'Vi điều khiển, máy tính nhúng, máy tính có GPU; kiến trúc phân tầng theo tần số; PWM, mạch cầu H, giao tiếp UART/I2C/SPI/CAN/Ethernet; ngân sách năng lượng và thời gian chạy pin tính bằng Python.',
  `<span class="eyebrow">RAI101 · Chapter 2 · Lesson 2.3</span>
<h2>Controllers, power and robot system architecture</h2>
<p class="lead">Sensors and motors need a “nervous system”: computers that read sensors and command motors at the right rate, wires and buses that connect them, and a battery that keeps everything alive. This lesson puts the pieces together into one architecture.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compare microcontrollers, single-board computers and GPU computers, and say which loop runs where.</li><li>Explain PWM and the H-bridge motor driver.</li><li>Name the common communication buses and their typical uses.</li><li>Compute a power budget and battery runtime.</li></ul>
<h3>📖 Lecture</h3>
<h4>Three kinds of computer</h4>
<div class="kv-grid"><div class="kv"><span class="k">Microcontroller (MCU)</span><span class="v">e.g. Arduino / STM32 / ESP32: one chip, no operating system, microsecond-level timing. Reads encoders, generates PWM, runs the motor control loop at 1–10 kHz.</span></div><div class="kv"><span class="k">Single-board computer</span><span class="v">e.g. Raspberry Pi: Linux, Wi-Fi, camera input, runs ROS 2 nodes, mapping and path planning at 1–50 Hz. Not hard real-time.</span></div><div class="kv"><span class="k">GPU computer</span><span class="v">e.g. NVIDIA Jetson or a laptop with a GPU: deep-learning perception (object detection) at 10–60 Hz.</span></div></div>
<p>This gives the classic <strong>layered architecture</strong>: a fast, simple, <em>real-time</em> low level (motor current and speed loops), a middle level (odometry, local obstacle avoidance), and a slow, smart high level (mapping, planning, AI). Each layer runs as fast as its job needs; a crash in the high level must never leave motors running — the low level has its own safety stop and watchdog.</p>
<h4>Driving a motor: PWM and the H-bridge</h4>
<p>A computer pin gives milliamps; a motor needs amps. A <strong>motor driver</strong> sits between them. Speed is set with <strong>pulse-width modulation (PWM)</strong>: the supply is switched on and off thousands of times per second, and the motor “sees” the average voltage.</p>
<div class="formula"><span class="lbl">PWM average voltage</span>V<sub>avg</sub> = duty cycle · V<sub>supply</sub>     (duty = on-time / period; 60 % of 12 V → 7.2 V)</div>
<p>An <strong>H-bridge</strong> is four switches arranged like the letter H around the motor; closing one diagonal pair drives current one way, the other pair reverses it — forward and reverse from a single supply.</p>
<h4>Communication buses</h4>
<ul><li><strong>UART (serial)</strong> — two wires, point to point: MCU ↔ Raspberry Pi, GPS modules.</li><li><strong>I2C</strong> — two wires, many slow devices on one bus with addresses: IMUs, small sensors.</li><li><strong>SPI</strong> — faster, short distance: displays, fast ADCs, some IMUs.</li><li><strong>CAN bus</strong> — robust differential bus used in cars and industrial robot joints; tolerant of electrical noise.</li><li><strong>Ethernet / USB</strong> — high bandwidth: lidars, cameras, links between computers (ROS 2 traffic).</li></ul>
<h4>Power</h4>
<p>Mobile robots usually run on lithium-ion or LiPo packs. Capacity in watt-hours is E = V · Ah. Runtime ≈ usable energy / average power. Keep a margin: draining a lithium pack completely damages it, and voltage sags under load.</p>
<h3>✍️ Worked example — power budget of a small mobile robot</h3>
<div class="callout"><p>A robot carries a 14.8 V, 5 Ah pack and uses only 80 % of it. Loads: two drive motors at 15 W average each, a single-board computer at 10 W, lidar + camera + IMU at 5 W. How long does it run, and what current does the pack supply?</p></div>
<pre><code class="language-python"># Power budget of a small mobile robot
battery_v = 14.8        # 4-cell Li-ion / LiPo pack, nominal volts
battery_ah = 5.0        # amp-hours
usable = 0.8            # do not drain below ~20 % to protect the cells

loads_w = {
    "2 drive motors (average)": 2 * 15.0,
    "computer (single-board)": 10.0,
    "lidar + camera + IMU": 5.0,
}
energy_wh = battery_v * battery_ah
total_w = sum(loads_w.values())
for name, w in loads_w.items():
    print("%-26s %5.1f W" % (name, w))
print("total load                 %5.1f W" % total_w)
print("battery energy: %.1f Wh, usable %.1f Wh" % (energy_wh, energy_wh * usable))
hours = energy_wh * usable / total_w
print("estimated runtime: %.2f h = %.0f min" % (hours, hours * 60))
print("average current from pack: %.2f A" % (total_w / battery_v))
</code></pre>
<div class="out">2 drive motors (average)    30.0 W
computer (single-board)     10.0 W
lidar + camera + IMU         5.0 W
total load                  45.0 W
battery energy: 74.0 Wh, usable 59.2 Wh
estimated runtime: 1.32 h = 79 min
average current from pack: 3.04 A</div>
<p><b>Interpretation:</b> the motors take two thirds of the energy, so driving style (smooth acceleration, fewer stops) matters more than a faster computer. Adding a 30 W GPU computer would cut the runtime to 59.2 / 75 ≈ 0.79 h — a design trade-off you must make consciously.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Driving a motor directly from a microcontroller pin — it will burn the pin; always use a driver.</li><li>Running the motor control loop on Linux “because it is faster” — without real-time guarantees the loop timing jitters.</li><li>Sizing the battery from average power only — peak currents (start-up, stall) must also be within the pack and driver limits.</li><li>Sharing a noisy motor supply with sensitive electronics without filtering or a separate regulator.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>MCU = fast real-time low level; single-board computer = ROS 2, planning; GPU = deep perception.</li><li>Layered architecture: each loop at the rate it needs; safety stop at the lowest level.</li><li>PWM sets average voltage; an H-bridge allows both directions.</li><li>UART, I2C, SPI, CAN, Ethernet/USB each fit a bandwidth and distance.</li><li>Runtime ≈ V · Ah · usable fraction / average power.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Pulse-width_modulation" target="_blank" rel="noopener">Wikipedia — Pulse-width modulation</a></li><li><a href="https://en.wikipedia.org/wiki/H-bridge" target="_blank" rel="noopener">Wikipedia — H-bridge</a></li><li><a href="https://en.wikipedia.org/wiki/Real-time_computing" target="_blank" rel="noopener">Wikipedia — Real-time computing</a></li><li><a href="https://en.wikipedia.org/wiki/CAN_bus" target="_blank" rel="noopener">Wikipedia — CAN bus</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A 24 V supply drives a motor through PWM at 25 % duty cycle. Average voltage?</li><li>A drone has a 11.1 V, 2.2 Ah pack and draws 120 W hovering. Flight time using 80 % of the pack?</li><li>Which computer would run (a) the wheel speed PID at 1 kHz, (b) a neural-network pedestrian detector?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0.25 · 24 = 6 V. 2) E = 11.1 · 2.2 = 24.42 Wh; usable 19.54 Wh; 19.54 / 120 ≈ 0.163 h ≈ 9.8 min. 3) (a) A microcontroller (hard real-time). (b) A GPU computer such as a Jetson.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 2 · Bài 2.3</span>
<h2>Bộ điều khiển, nguồn điện và kiến trúc hệ thống robot</h2>
<p class="lead">Cảm biến và động cơ cần một “hệ thần kinh”: máy tính đọc cảm biến và ra lệnh cho động cơ đúng nhịp, dây và bus nối chúng lại, và pin giữ cho mọi thứ sống. Bài này ghép các mảnh thành một kiến trúc hoàn chỉnh.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>So sánh vi điều khiển, máy tính nhúng một bo mạch và máy tính có GPU, và biết vòng lặp nào chạy ở đâu.</li><li>Giải thích PWM và mạch cầu H điều khiển động cơ.</li><li>Kể tên các bus giao tiếp phổ biến và công dụng điển hình.</li><li>Tính ngân sách năng lượng và thời gian chạy của pin.</li></ul>
<h3>📖 Bài giảng</h3>
<h4>Ba loại máy tính</h4>
<div class="kv-grid"><div class="kv"><span class="k">Vi điều khiển (MCU)</span><span class="v">vd Arduino / STM32 / ESP32: một chip, không hệ điều hành, định thời cỡ micro giây. Đọc encoder, phát PWM, chạy vòng điều khiển động cơ 1–10 kHz.</span></div><div class="kv"><span class="k">Máy tính một bo mạch</span><span class="v">vd Raspberry Pi: Linux, Wi-Fi, nhận camera, chạy node ROS 2, lập bản đồ và lập đường đi ở 1–50 Hz. Không đảm bảo thời gian thực cứng.</span></div><div class="kv"><span class="k">Máy tính có GPU</span><span class="v">vd NVIDIA Jetson hoặc laptop có GPU: nhận thức bằng học sâu (phát hiện vật thể) ở 10–60 Hz.</span></div></div>
<p>Từ đó có <strong>kiến trúc phân tầng</strong> kinh điển: tầng thấp nhanh, đơn giản, <em>thời gian thực</em> (vòng dòng điện và tốc độ động cơ), tầng giữa (odometry, tránh vật cản cục bộ), và tầng cao chậm mà “khôn” (lập bản đồ, lập kế hoạch, AI). Mỗi tầng chạy nhanh đúng bằng mức công việc cần; tầng cao bị treo thì tuyệt đối không được để động cơ chạy tiếp — tầng thấp có nút dừng an toàn và bộ giám sát (watchdog) riêng.</p>
<h4>Lái động cơ: PWM và mạch cầu H</h4>
<p>Chân vi điều khiển chỉ cho vài mi-li-ampe; động cơ cần hàng ampe. <strong>Mạch điều khiển động cơ (driver)</strong> đứng giữa hai bên. Tốc độ được chỉnh bằng <strong>điều chế độ rộng xung (PWM)</strong>: nguồn được đóng ngắt hàng nghìn lần mỗi giây, và động cơ “thấy” điện áp trung bình.</p>
<div class="formula"><span class="lbl">Điện áp trung bình PWM</span>V<sub>tb</sub> = hệ số làm việc · V<sub>nguồn</sub>     (hệ số = thời gian bật / chu kỳ; 60 % của 12 V → 7,2 V)</div>
<p><strong>Mạch cầu H</strong> gồm bốn khoá xếp như chữ H quanh động cơ; đóng một cặp chéo thì dòng chạy một chiều, đóng cặp kia thì đảo chiều — quay thuận và nghịch chỉ với một nguồn.</p>
<h4>Các bus giao tiếp</h4>
<ul><li><strong>UART (nối tiếp)</strong> — hai dây, điểm nối điểm: MCU ↔ Raspberry Pi, mô-đun GPS.</li><li><strong>I2C</strong> — hai dây, nhiều thiết bị chậm trên một bus, phân biệt bằng địa chỉ: IMU, cảm biến nhỏ.</li><li><strong>SPI</strong> — nhanh hơn, khoảng cách ngắn: màn hình, ADC nhanh, một số IMU.</li><li><strong>CAN bus</strong> — bus vi sai bền bỉ dùng trong ô tô và khớp robot công nghiệp; chịu nhiễu điện tốt.</li><li><strong>Ethernet / USB</strong> — băng thông cao: lidar, camera, kết nối giữa các máy tính (lưu lượng ROS 2).</li></ul>
<h4>Nguồn điện</h4>
<p>Robot di động thường chạy pin lithium-ion hoặc LiPo. Dung lượng tính bằng oát-giờ là E = V · Ah. Thời gian chạy ≈ năng lượng dùng được / công suất trung bình. Luôn chừa biên: xả cạn pin lithium sẽ làm hỏng pin, và điện áp tụt khi tải nặng.</p>
<h3>✍️ Ví dụ — ngân sách năng lượng của robot di động nhỏ</h3>
<div class="callout"><p>Robot mang pin 14,8 V, 5 Ah và chỉ dùng 80 % dung lượng. Tải: hai động cơ bánh trung bình 15 W mỗi cái, máy tính một bo mạch 10 W, lidar + camera + IMU 5 W. Robot chạy được bao lâu, và pin cấp dòng bao nhiêu?</p></div>
<pre><code class="language-python"># Power budget of a small mobile robot
battery_v = 14.8        # 4-cell Li-ion / LiPo pack, nominal volts
battery_ah = 5.0        # amp-hours
usable = 0.8            # do not drain below ~20 % to protect the cells

loads_w = {
    "2 drive motors (average)": 2 * 15.0,
    "computer (single-board)": 10.0,
    "lidar + camera + IMU": 5.0,
}
energy_wh = battery_v * battery_ah
total_w = sum(loads_w.values())
for name, w in loads_w.items():
    print("%-26s %5.1f W" % (name, w))
print("total load                 %5.1f W" % total_w)
print("battery energy: %.1f Wh, usable %.1f Wh" % (energy_wh, energy_wh * usable))
hours = energy_wh * usable / total_w
print("estimated runtime: %.2f h = %.0f min" % (hours, hours * 60))
print("average current from pack: %.2f A" % (total_w / battery_v))
</code></pre>
<div class="out">2 drive motors (average)    30.0 W
computer (single-board)     10.0 W
lidar + camera + IMU         5.0 W
total load                  45.0 W
battery energy: 74.0 Wh, usable 59.2 Wh
estimated runtime: 1.32 h = 79 min
average current from pack: 3.04 A</div>
<p><b>Diễn giải:</b> động cơ ăn hai phần ba năng lượng, nên cách lái (tăng tốc êm, ít dừng) quan trọng hơn một máy tính nhanh hơn. Thêm máy tính GPU 30 W thì thời gian chạy còn 59,2 / 75 ≈ 0,79 h — một đánh đổi thiết kế mà bạn phải chọn có ý thức.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cấp điện động cơ thẳng từ chân vi điều khiển — sẽ cháy chân; luôn dùng driver.</li><li>Chạy vòng điều khiển động cơ trên Linux “vì nó nhanh hơn” — không có đảm bảo thời gian thực thì nhịp vòng lặp bị chập chờn.</li><li>Chọn pin chỉ theo công suất trung bình — dòng đỉnh (khởi động, kẹt) cũng phải nằm trong giới hạn của pin và driver.</li><li>Dùng chung nguồn động cơ nhiễu với mạch điện tử nhạy mà không lọc hoặc không có bộ ổn áp riêng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>MCU = tầng thấp thời gian thực nhanh; máy tính một bo mạch = ROS 2, lập kế hoạch; GPU = nhận thức học sâu.</li><li>Kiến trúc phân tầng: mỗi vòng chạy đúng nhịp cần thiết; dừng an toàn ở tầng thấp nhất.</li><li>PWM chỉnh điện áp trung bình; cầu H cho quay hai chiều.</li><li>UART, I2C, SPI, CAN, Ethernet/USB mỗi loại hợp một mức băng thông và khoảng cách.</li><li>Thời gian chạy ≈ V · Ah · phần dùng được / công suất trung bình.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Pulse-width_modulation" target="_blank" rel="noopener">Wikipedia — Điều chế độ rộng xung (PWM)</a></li><li><a href="https://en.wikipedia.org/wiki/H-bridge" target="_blank" rel="noopener">Wikipedia — Mạch cầu H</a></li><li><a href="https://en.wikipedia.org/wiki/Real-time_computing" target="_blank" rel="noopener">Wikipedia — Tính toán thời gian thực</a></li><li><a href="https://en.wikipedia.org/wiki/CAN_bus" target="_blank" rel="noopener">Wikipedia — CAN bus</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Nguồn 24 V lái động cơ qua PWM hệ số 25 %. Điện áp trung bình?</li><li>Drone có pin 11,1 V, 2,2 Ah và tiêu thụ 120 W khi bay treo. Thời gian bay nếu dùng 80 % pin?</li><li>Máy tính nào chạy (a) vòng PID tốc độ bánh ở 1 kHz, (b) mạng nơ-ron phát hiện người đi bộ?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0,25 · 24 = 6 V. 2) E = 11,1 · 2,2 = 24,42 Wh; dùng được 19,54 Wh; 19,54 / 120 ≈ 0,163 h ≈ 9,8 phút. 3) (a) Vi điều khiển (thời gian thực cứng). (b) Máy tính GPU như Jetson.</p></div>`);

const q2 = QZ(2, 'Quiz — Chapter 2: Robot anatomy — sensors, actuators, controllers|||Quiz — Chương 2: Giải phẫu robot — cảm biến, chấp hành, điều khiển', 'Kiểm tra chương 2: phân loại cảm biến, thời gian bay, encoder, động cơ và hộp số, PWM, kiến trúc phân tầng, thời gian chạy pin.', [
  Q('q1', 'A wheel encoder is a … sensor.|||Encoder bánh xe là cảm biến …',
    ['exteroceptive|||ngoại (exteroceptive)', 'proprioceptive|||nội (proprioceptive)', 'chemical|||hoá học', 'acoustic|||âm thanh'], 1,
    'It measures the robot’s own wheel rotation.|||Nó đo vòng quay bánh của chính robot.'),
  Q('q2', 'An ultrasonic echo returns after 4 ms (v = 343 m/s). The obstacle is at about|||Tiếng vọng siêu âm quay về sau 4 ms (v = 343 m/s). Vật cản cách khoảng',
    ['1.372 m|||1,372 m', '0.686 m|||0,686 m', '0.343 m|||0,343 m', '2.744 m|||2,744 m'], 1,
    'd = 343 · 0.004 / 2 = 0.686 m.|||d = 343 · 0,004 / 2 = 0,686 m.'),
  Q('q3', 'A 500-line quadrature encoder gives how many counts per revolution?|||Encoder quadrature 500 vạch cho bao nhiêu lần đếm mỗi vòng?',
    ['500|||500', '1000|||1000', '2000|||2000', '4000|||4000'], 2,
    'Quadrature decoding counts 4 edges per line: 4 · 500.|||Giải mã quadrature đếm 4 sườn mỗi vạch: 4 · 500.'),
  Q('q4', 'Why does an angle computed by integrating a gyroscope become wrong over time?|||Vì sao góc tính bằng tích phân con quay hồi chuyển sai dần theo thời gian?',
    ['Gyroscopes measure position, not rate|||Con quay đo vị trí chứ không đo tốc độ', 'Small bias and noise accumulate (drift)|||Độ lệch và nhiễu nhỏ bị tích luỹ (trôi)', 'Gravity changes|||Trọng lực thay đổi', 'The encoder interferes|||Encoder gây nhiễu'], 1,
    'Integration adds up every tiny error, so the angle drifts.|||Tích phân cộng dồn mọi sai số nhỏ nên góc bị trôi.'),
  Q('q5', 'A 6000 rpm, 0.05 N·m motor drives a 30:1 gearbox with η = 0.8. Output torque?|||Động cơ 6000 vòng/phút, 0,05 N·m qua hộp số 30:1, η = 0,8. Mô-men đầu ra?',
    ['1.5 N·m|||1,5 N·m', '1.2 N·m|||1,2 N·m', '0.0017 N·m|||0,0017 N·m', '0.04 N·m|||0,04 N·m'], 1,
    'τ = 0.05 · 30 · 0.8 = 1.2 N·m (and speed drops to 200 rpm).|||τ = 0,05 · 30 · 0,8 = 1,2 N·m (tốc độ giảm còn 200 vòng/phút).'),
  Q('q6', 'Which motor positions in fixed steps and is often used open loop?|||Động cơ nào định vị theo bước cố định và thường chạy vòng hở?',
    ['Brushed DC motor|||Động cơ DC chổi than', 'Stepper motor|||Động cơ bước', 'Hydraulic cylinder|||Xi-lanh thuỷ lực', 'BLDC fan motor|||Động cơ quạt BLDC'], 1,
    'A 1.8° stepper has 200 full steps per revolution.|||Động cơ bước 1,8° có 200 bước đủ mỗi vòng.'),
  Q('q7', 'PWM at 60 % duty cycle on a 12 V supply gives an average voltage of|||PWM hệ số 60 % trên nguồn 12 V cho điện áp trung bình',
    ['7.2 V|||7,2 V', '6 V|||6 V', '12 V|||12 V', '4.8 V|||4,8 V'], 0,
    'V_avg = 0.6 · 12 = 7.2 V.|||V_tb = 0,6 · 12 = 7,2 V.'),
  Q('q8', 'What does an H-bridge allow?|||Mạch cầu H cho phép điều gì?',
    ['Measuring motor temperature|||Đo nhiệt độ động cơ', 'Driving a DC motor in both directions|||Lái động cơ DC theo cả hai chiều', 'Charging the battery|||Sạc pin', 'Reading an encoder|||Đọc encoder'], 1,
    'Closing opposite diagonal switches reverses current through the motor.|||Đóng cặp khoá chéo đối diện thì đảo chiều dòng qua động cơ.'),
  Q('q9', 'Which layer should run the 1 kHz motor speed loop?|||Tầng nào nên chạy vòng tốc độ động cơ 1 kHz?',
    ['A cloud server|||Máy chủ đám mây', 'The GPU perception computer|||Máy tính GPU cho nhận thức', 'A real-time microcontroller|||Vi điều khiển thời gian thực', 'The operator’s phone|||Điện thoại của người vận hành'], 2,
    'Fast loops need deterministic timing close to the hardware.|||Vòng lặp nhanh cần định thời chắc chắn, sát phần cứng.'),
  Q('q10', 'A 14.8 V, 5 Ah pack (80 % usable) powers a 45 W robot. Runtime is about|||Pin 14,8 V, 5 Ah (dùng 80 %) cấp cho robot 45 W. Thời gian chạy khoảng',
    ['1.64 h|||1,64 h', '1.32 h|||1,32 h', '0.11 h|||0,11 h', '3.3 h|||3,3 h'], 1,
    '74 Wh · 0.8 = 59.2 Wh; 59.2 / 45 ≈ 1.32 h.|||74 Wh · 0,8 = 59,2 Wh; 59,2 / 45 ≈ 1,32 h.'),
]);

const ch2 = {
  title: 'Chapter 2 — Robot anatomy: sensors, actuators and controllers|||Chương 2 — Giải phẫu robot: cảm biến, cơ cấu chấp hành và bộ điều khiển',
  description: 'Cảm biến (encoder, IMU, siêu âm, lidar, camera) và đặc tính đo; động cơ, hộp số, mô-men – tốc độ – công suất; vi điều khiển, PWM, cầu H, bus giao tiếp, kiến trúc phân tầng, ngân sách pin — có code Python chạy thật (Siegwart ch.2 và 4 · Craig ch.1).',
  lessons: [r21, r22, r23, q2],
};


// ───────────────────────────── Chương 3 — Toán cho robot: hệ toạ độ & phép biến đổi ─────────────────────────────
const r31 = L('rai101-ts-3-1',
  '3.1 — Coordinate frames and vectors: describing where things are|||3.1 — Hệ toạ độ và vectơ: mô tả vật ở đâu',
  'Hệ toạ độ (world, base, tool, camera), vectơ vị trí, độ dài, tích vô hướng, góc giữa hai vectơ, quy tắc bàn tay phải và tích có hướng; ví dụ numpy chạy thật.',
  `<span class="eyebrow">RAI101 · Chapter 3 · Lesson 3.1</span>
<h2>Coordinate frames and vectors: describing where things are</h2>
<p class="lead">Before a robot can grasp a cup or drive to a door, it must answer a simple-sounding question: <em>where is it, and where am I?</em> Robotics answers with <strong>coordinate frames</strong> and <strong>vectors</strong>. Everything in the next two chapters — rotations, transforms, kinematics — is built on these two ideas.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain what a coordinate frame is and name the frames used on a typical robot.</li><li>Represent positions and displacements as vectors and compute their length and direction.</li><li>Use the dot product to find the angle between two directions.</li><li>Apply the right-hand rule and the cross product to 3D axes.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>coordinate frame</strong> is an origin (a point) plus a set of perpendicular unit axes: x and y in the plane, x, y and z in space. A number such as “(3, 4)” means nothing until you say <em>which frame</em> it is measured in. Robots juggle many frames at once:</p>
<ul><li><strong>World frame {w}</strong> (also “map” or “fixed” frame): attached to the room or the factory floor; it never moves.</li><li><strong>Base frame {b}</strong>: attached to the robot body (for a mobile robot, the centre between the wheels; for an arm, the bolt-down base).</li><li><strong>Tool / end-effector frame {e}</strong>: attached to the gripper or welding torch.</li><li><strong>Sensor frames {c}</strong>: one per camera or lidar, because each sensor reports what it sees <em>relative to itself</em>.</li></ul>
<p>The robotics convention (Lynch &amp; Park, Ch. 2–3; Craig, Ch. 2) is that all frames are <strong>right-handed</strong>: point the fingers of your right hand along x, curl them towards y, and your thumb points along z. In the plane we imagine z coming out of the page, so a positive angle is a counter-clockwise rotation.</p>
<p>A <strong>vector</strong> has a length and a direction. A <em>position vector</em> p = (p<sub>x</sub>, p<sub>y</sub>) points from the frame origin to a point; a <em>displacement</em> d = q − p points from one point to another. The key formulas are:</p>
<div class="formula"><span class="lbl">Length, direction, dot product</span>‖d‖ = √(d<sub>x</sub><sup>2</sup> + d<sub>y</sub><sup>2</sup>)    direction α = atan2(d<sub>y</sub>, d<sub>x</sub>)<br>a · b = a<sub>x</sub>b<sub>x</sub> + a<sub>y</sub>b<sub>y</sub> = ‖a‖‖b‖ cos θ  ⇒  θ = arccos( a · b / (‖a‖‖b‖) )</div>
<p>Use <strong>atan2(y, x)</strong>, not atan(y/x): atan2 looks at the signs of both components and returns the correct angle in all four quadrants (−180° to 180°), and it does not crash when x = 0. In 3D, the <strong>cross product</strong> a × b gives a vector perpendicular to both; for the unit axes x × y = z, y × z = x, z × x = y — a quick test that a frame is right-handed.</p>
<h3>✍️ Worked example — robot and cup</h3>
<div class="callout"><p>A robot stands at p = (2, 1) m in the world frame, facing along the world x-axis. A cup is at q = (5, 5) m. How far is the cup and how much must the robot turn?</p>
<p>Step 1: displacement d = q − p = (3, 4). Step 2: distance ‖d‖ = √(9 + 16) = <b>5 m</b>. Step 3: direction α = atan2(4, 3) ≈ <b>53.13°</b>. Step 4: the forward axis is f = (1, 0), so cos θ = f · d / (‖f‖‖d‖) = 3/5 and θ = arccos(0.6) ≈ 53.13° — the robot turns 53.13° counter-clockwise.</p></div>
<pre><code class="language-python">import numpy as np

robot = np.array([2.0, 1.0])    # robot position in world frame (m)
cup   = np.array([5.0, 5.0])    # cup position in world frame (m)

d = cup - robot                 # vector from robot to cup
dist = np.linalg.norm(d)        # length of the vector
heading = np.degrees(np.arctan2(d[1], d[0]))
print("vector robot-&gt;cup:", d)
print("distance (m):", dist)
print("direction (deg):", round(heading, 2))

# angle between the robot's forward axis and the cup direction
forward = np.array([1.0, 0.0])
cos_a = forward @ d / (np.linalg.norm(forward) * dist)
print("angle to turn (deg):", round(np.degrees(np.arccos(cos_a)), 2))

# right-hand rule: x cross y = z
print("x cross y =", np.cross([1, 0, 0], [0, 1, 0]))
</code></pre>
<div class="out">vector robot-&gt;cup: [3. 4.]
distance (m): 5.0
direction (deg): 53.13
angle to turn (deg): 53.13
x cross y = [0 0 1]</div>
<p>Notice that the robot computed “turn 53°” only because we assumed it faces along world x. If it faced along world y, the same cup would require a turn of −36.87°. <strong>Directions relative to the robot depend on the robot's orientation</strong> — which is why the next lesson is about rotations.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Mixing frames: adding a position measured in the camera frame to one measured in the world frame.</li><li>Using atan(y/x): it returns 45° for both (1, 1) and (−1, −1).</li><li>Forgetting units — mixing millimetres (common on arms) and metres (ROS convention).</li><li>Using a left-handed frame (e.g. image coordinates with y pointing down) without converting.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A coordinate is meaningless without its frame: world, base, tool, sensor.</li><li>Robotics frames are right-handed; positive angles are counter-clockwise.</li><li>Displacement d = q − p; distance ‖d‖; direction atan2(d<sub>y</sub>, d<sub>x</sub>).</li><li>The dot product gives the angle between directions; the cross product gives a perpendicular axis.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/2-1-degrees-of-freedom-of-a-rigid-body/" target="_blank" rel="noopener">Modern Robotics (Lynch &amp; Park) — 2.1 Degrees of freedom of a rigid body (video + book section)</a></li><li><a href="https://en.wikipedia.org/wiki/Euclidean_vector" target="_blank" rel="noopener">Wikipedia — Euclidean vector</a></li><li><a href="https://en.wikipedia.org/wiki/Dot_product" target="_blank" rel="noopener">Wikipedia — Dot product</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.arctan2.html" target="_blank" rel="noopener">NumPy documentation — numpy.arctan2</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A mobile robot is at (1, 2) m; a charging dock is at (−2, 6) m. Find the distance and the direction angle (atan2) of the dock.</li><li>What does atan2 return for (x, y) = (−1, −1)? What does atan(y/x) return?</li><li>Compute z × x for the standard unit axes.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) d = (−3, 4), distance 5 m, direction atan2(4, −3) ≈ 126.87°. 2) atan2(−1, −1) = −135°, while atan(1) = 45° (wrong quadrant). 3) z × x = y = (0, 1, 0).</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 3 · Bài 3.1</span>
<h2>Hệ toạ độ và vectơ: mô tả vật ở đâu</h2>
<p class="lead">Trước khi gắp được cái cốc hay chạy tới cửa, robot phải trả lời một câu tưởng như đơn giản: <em>vật ở đâu, và mình ở đâu?</em> Robotics trả lời bằng <strong>hệ toạ độ</strong> (frame) và <strong>vectơ</strong>. Mọi thứ trong hai chương này — phép quay, phép biến đổi, động học — đều xây trên hai ý đó.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích hệ toạ độ là gì và kể tên các hệ toạ độ thường gặp trên robot.</li><li>Biểu diễn vị trí, độ dời bằng vectơ; tính độ dài và hướng.</li><li>Dùng tích vô hướng để tìm góc giữa hai hướng.</li><li>Áp dụng quy tắc bàn tay phải và tích có hướng cho các trục 3D.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Hệ toạ độ</strong> gồm một gốc (một điểm) và các trục đơn vị vuông góc: x, y trong mặt phẳng; x, y, z trong không gian. Con số “(3, 4)” vô nghĩa nếu không nói nó đo trong <em>hệ nào</em>. Robot luôn làm việc với nhiều hệ cùng lúc:</p>
<ul><li><strong>Hệ thế giới {w}</strong> (còn gọi “map” hay hệ cố định): gắn với căn phòng hay sàn nhà máy, không bao giờ di chuyển.</li><li><strong>Hệ thân/đế {b}</strong>: gắn với thân robot (robot di động: tâm giữa hai bánh; cánh tay: phần đế bắt vít xuống sàn).</li><li><strong>Hệ công cụ / khâu cuối {e}</strong>: gắn với tay gắp hoặc mỏ hàn.</li><li><strong>Hệ cảm biến {c}</strong>: mỗi camera, mỗi lidar một hệ, vì cảm biến báo những gì nó thấy <em>so với chính nó</em>.</li></ul>
<p>Quy ước trong robotics (Lynch &amp; Park, Ch. 2–3; Craig, Ch. 2): mọi hệ đều là <strong>hệ thuận (bàn tay phải)</strong> — duỗi các ngón tay phải theo x, gập về phía y, ngón cái chỉ chiều z. Trong mặt phẳng ta coi z hướng ra khỏi trang giấy, nên góc dương là quay ngược chiều kim đồng hồ.</p>
<p><strong>Vectơ</strong> có độ dài và hướng. <em>Vectơ vị trí</em> p = (p<sub>x</sub>, p<sub>y</sub>) đi từ gốc hệ tới một điểm; <em>vectơ độ dời</em> d = q − p đi từ điểm này tới điểm kia. Các công thức chính:</p>
<div class="formula"><span class="lbl">Độ dài, hướng, tích vô hướng</span>‖d‖ = √(d<sub>x</sub><sup>2</sup> + d<sub>y</sub><sup>2</sup>)    hướng α = atan2(d<sub>y</sub>, d<sub>x</sub>)<br>a · b = a<sub>x</sub>b<sub>x</sub> + a<sub>y</sub>b<sub>y</sub> = ‖a‖‖b‖ cos θ  ⇒  θ = arccos( a · b / (‖a‖‖b‖) )</div>
<p>Hãy dùng <strong>atan2(y, x)</strong> chứ không dùng atan(y/x): atan2 xét dấu cả hai thành phần nên trả về góc đúng ở cả bốn góc phần tư (−180° đến 180°), và không lỗi khi x = 0. Trong 3D, <strong>tích có hướng</strong> a × b cho một vectơ vuông góc với cả hai; với các trục đơn vị x × y = z, y × z = x, z × x = y — cách kiểm nhanh một hệ có phải hệ thuận không.</p>
<h3>✍️ Ví dụ — robot và cái cốc</h3>
<div class="callout"><p>Robot đứng ở p = (2, 1) m trong hệ thế giới, mặt hướng theo trục x của thế giới. Cái cốc ở q = (5, 5) m. Cốc cách bao xa và robot phải quay bao nhiêu?</p>
<p>Bước 1: độ dời d = q − p = (3, 4). Bước 2: khoảng cách ‖d‖ = √(9 + 16) = <b>5 m</b>. Bước 3: hướng α = atan2(4, 3) ≈ <b>53,13°</b>. Bước 4: trục tiến f = (1, 0), nên cos θ = f · d / (‖f‖‖d‖) = 3/5 và θ = arccos(0,6) ≈ 53,13° — robot quay 53,13° ngược chiều kim đồng hồ.</p></div>
<pre><code class="language-python">import numpy as np

robot = np.array([2.0, 1.0])    # robot position in world frame (m)
cup   = np.array([5.0, 5.0])    # cup position in world frame (m)

d = cup - robot                 # vector from robot to cup
dist = np.linalg.norm(d)        # length of the vector
heading = np.degrees(np.arctan2(d[1], d[0]))
print("vector robot-&gt;cup:", d)
print("distance (m):", dist)
print("direction (deg):", round(heading, 2))

# angle between the robot's forward axis and the cup direction
forward = np.array([1.0, 0.0])
cos_a = forward @ d / (np.linalg.norm(forward) * dist)
print("angle to turn (deg):", round(np.degrees(np.arccos(cos_a)), 2))

# right-hand rule: x cross y = z
print("x cross y =", np.cross([1, 0, 0], [0, 1, 0]))
</code></pre>
<div class="out">vector robot-&gt;cup: [3. 4.]
distance (m): 5.0
direction (deg): 53.13
angle to turn (deg): 53.13
x cross y = [0 0 1]</div>
<p>Để ý: robot tính ra “quay 53°” chỉ vì ta giả sử nó đang nhìn theo trục x thế giới. Nếu nó nhìn theo trục y, cùng cái cốc đó phải quay −36,87°. <strong>Hướng so với robot phụ thuộc vào hướng của robot</strong> — vì vậy bài tiếp theo nói về phép quay.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lẫn hệ: cộng vị trí đo trong hệ camera với vị trí đo trong hệ thế giới.</li><li>Dùng atan(y/x): nó trả 45° cho cả (1, 1) lẫn (−1, −1).</li><li>Quên đơn vị — trộn milimét (hay gặp ở cánh tay robot) với mét (quy ước của ROS).</li><li>Dùng hệ tay trái (vd toạ độ ảnh có y hướng xuống) mà không đổi sang hệ thuận.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Toạ độ vô nghĩa nếu không kèm hệ: thế giới, thân, công cụ, cảm biến.</li><li>Hệ trong robotics là hệ thuận; góc dương là ngược chiều kim đồng hồ.</li><li>Độ dời d = q − p; khoảng cách ‖d‖; hướng atan2(d<sub>y</sub>, d<sub>x</sub>).</li><li>Tích vô hướng cho góc giữa hai hướng; tích có hướng cho trục vuông góc.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/2-1-degrees-of-freedom-of-a-rigid-body/" target="_blank" rel="noopener">Modern Robotics (Lynch &amp; Park) — 2.1 Bậc tự do của vật rắn (video + mục sách)</a></li><li><a href="https://en.wikipedia.org/wiki/Euclidean_vector" target="_blank" rel="noopener">Wikipedia — Vectơ Euclid</a></li><li><a href="https://en.wikipedia.org/wiki/Dot_product" target="_blank" rel="noopener">Wikipedia — Tích vô hướng</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.arctan2.html" target="_blank" rel="noopener">Tài liệu NumPy — numpy.arctan2</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Robot di động ở (1, 2) m; trạm sạc ở (−2, 6) m. Tính khoảng cách và góc hướng (atan2) tới trạm sạc.</li><li>atan2 trả về gì với (x, y) = (−1, −1)? atan(y/x) trả về gì?</li><li>Tính z × x với các trục đơn vị chuẩn.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) d = (−3, 4), khoảng cách 5 m, hướng atan2(4, −3) ≈ 126,87°. 2) atan2(−1, −1) = −135°, còn atan(1) = 45° (sai góc phần tư). 3) z × x = y = (0, 1, 0).</p></div>`);

const r32 = L('rai101-ts-3-2',
  '3.2 — Rotations: 2D and 3D rotation matrices|||3.2 — Phép quay: ma trận quay 2D và 3D',
  'Ma trận quay 2D R(θ), tính chất trực giao (Rᵀ = R⁻¹, det = 1), ma trận quay quanh trục x, y, z trong 3D, thứ tự phép quay không giao hoán; numpy chạy thật.',
  `<span class="eyebrow">RAI101 · Chapter 3 · Lesson 3.2</span>
<h2>Rotations: 2D and 3D rotation matrices</h2>
<p class="lead">A robot is not just a point — it has an <strong>orientation</strong>. The camera on a turtle-shaped robot points wherever the robot points; a gripper can be tilted. Orientation is described by a <strong>rotation matrix</strong>, the single most used object in robotics mathematics.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the 2D rotation matrix R(θ) and use it to rotate a vector.</li><li>State the properties of rotation matrices: R<sup>T</sup>R = I, det R = 1, R<sup>−1</sup> = R<sup>T</sup>.</li><li>Write the elementary 3D rotations about x, y and z.</li><li>Explain why the order of 3D rotations matters.</li></ul>
<h3>📖 Lecture</h3>
<p>Rotate a vector (x, y) counter-clockwise by angle θ about the origin. Its new coordinates are x′ = x cos θ − y sin θ and y′ = x sin θ + y cos θ. Written as a matrix:</p>
<div class="formula"><span class="lbl">2D rotation</span>R(θ) = [ cos θ   −sin θ ;  sin θ   cos θ ]      p′ = R(θ) p</div>
<p>There is a second, equally important reading. The <strong>columns</strong> of R are the unit axes of a rotated frame {b}, written in the coordinates of the fixed frame {s}. So R<sub>sb</sub> both <em>describes the orientation</em> of {b} relative to {s} and <em>converts</em> a vector from {b} coordinates to {s} coordinates: p<sub>s</sub> = R<sub>sb</sub> p<sub>b</sub>. Lynch &amp; Park use this notation throughout Chapter 3: the subscripts “cancel” like fractions, R<sub>sb</sub> R<sub>bc</sub> = R<sub>sc</sub>.</p>
<p>Because the columns are perpendicular unit vectors, every rotation matrix satisfies:</p>
<div class="formula"><span class="lbl">Properties</span>R<sup>T</sup> R = I    det R = +1    R<sup>−1</sup> = R<sup>T</sup>    R(α) R(β) = R(α + β) in 2D</div>
<p>So undoing a rotation costs nothing: just transpose. A matrix with det = −1 is a reflection (a mirror), not a rotation — it would turn a right-handed frame into a left-handed one.</p>
<p>In <strong>3D</strong> there are three elementary rotations, one about each axis (angles counter-clockwise when looking down the axis towards the origin):</p>
<div class="formula"><span class="lbl">Elementary 3D rotations</span>R<sub>x</sub>(θ) = [1 0 0 ; 0 cos θ −sin θ ; 0 sin θ cos θ]<br>R<sub>y</sub>(θ) = [cos θ 0 sin θ ; 0 1 0 ; −sin θ 0 cos θ]<br>R<sub>z</sub>(θ) = [cos θ −sin θ 0 ; sin θ cos θ 0 ; 0 0 1]</div>
<p>Any 3D orientation can be built as a product of three such rotations — for example roll–pitch–yaw angles used by drones and IMUs. But beware: <strong>3D rotations do not commute</strong>. R<sub>z</sub>R<sub>x</sub> ≠ R<sub>x</sub>R<sub>z</sub>. Try it with a phone: turn it 90° about the vertical axis then 90° about the horizontal one, and compare with the reverse order.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>(a)</b> Rotate (1, 0) by 90°: R(90°) = [0 −1 ; 1 0], so p′ = (0·1 − 1·0, 1·1 + 0·0) = <b>(0, 1)</b>. <b>(b)</b> Rotate (2, 0) by 30°: (2 cos 30°, 2 sin 30°) = <b>(1.732, 1)</b>. <b>(c)</b> Check the properties and the order of 3D rotations numerically:</p></div>
<pre><code class="language-python">import numpy as np
np.set_printoptions(precision=3, suppress=True)

def rot2(theta_deg):
    t = np.radians(theta_deg)
    return np.array([[np.cos(t), -np.sin(t)],
                     [np.sin(t),  np.cos(t)]])

def rot_x(deg):
    t = np.radians(deg); c, s = np.cos(t), np.sin(t)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])

def rot_z(deg):
    t = np.radians(deg); c, s = np.cos(t), np.sin(t)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])

R = rot2(90)
print("R(90) @ [1, 0] =", R @ np.array([1.0, 0.0]))
print("R(30) @ [2, 0] =", rot2(30) @ np.array([2.0, 0.0]))
print("R^T R = I ?", np.allclose(R.T @ R, np.eye(2)), "| det =", round(np.linalg.det(R), 6))

# order matters in 3D
A = np.round(rot_z(90) @ rot_x(90), 3) + 0.0
B = np.round(rot_x(90) @ rot_z(90), 3) + 0.0
print("Rz(90) Rx(90) =\\n", A)
print("Rx(90) Rz(90) =\\n", B)
print("same?", np.allclose(A, B))
</code></pre>
<div class="out">R(90) @ [1, 0] = [0. 1.]
R(30) @ [2, 0] = [1.732 1.   ]
R^T R = I ? True | det = 1.0
Rz(90) Rx(90) =
 [[0. 0. 1.]
 [1. 0. 0.]
 [0. 1. 0.]]
Rx(90) Rz(90) =
 [[ 0. -1.  0.]
 [ 0.  0. -1.]
 [ 1.  0.  0.]]
same? False</div>
<p>The two products are different matrices: the same two 90° turns, done in a different order, leave the body in a different orientation.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Feeding degrees into np.cos / math.cos, which expect radians.</li><li>Sign error in R: the −sin θ is in the <em>top-right</em> for counter-clockwise rotation.</li><li>Inverting R with np.linalg.inv — correct, but R<sup>T</sup> is exact and cheaper.</li><li>Assuming 3D rotations can be applied in any order.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>R(θ) rotates vectors; its columns are the axes of the rotated frame.</li><li>R<sub>sb</sub> converts {b}-coordinates to {s}-coordinates; subscripts chain: R<sub>sb</sub>R<sub>bc</sub> = R<sub>sc</sub>.</li><li>R<sup>T</sup>R = I, det R = 1, inverse = transpose.</li><li>3D: R<sub>x</sub>, R<sub>y</sub>, R<sub>z</sub>; products do not commute.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/3-2-1-rotation-matrices-part-1-of-2/" target="_blank" rel="noopener">Modern Robotics — 3.2.1 Rotation matrices (Part 1 of 2)</a></li><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/3-2-1-rotation-matrices-part-2-of-2/" target="_blank" rel="noopener">Modern Robotics — 3.2.1 Rotation matrices (Part 2 of 2)</a></li><li><a href="https://www.3blue1brown.com/lessons/linear-transformations" target="_blank" rel="noopener">3Blue1Brown — Linear transformations and matrices</a></li><li><a href="https://en.wikipedia.org/wiki/Rotation_matrix" target="_blank" rel="noopener">Wikipedia — Rotation matrix</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Rotate p = (0, 2) by θ = −90°.</li><li>Show that R(30°)R(60°) = R(90°) by multiplying the matrices (or reasoning with angles).</li><li>A robot's orientation in the world is R<sub>wb</sub> = R(45°). A sensor reports a direction (1, 0) in the body frame. Give it in the world frame.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) R(−90°) = [0 1 ; −1 0] ⇒ (2, 0). 2) In 2D rotations add: 30° + 60° = 90°, so the product is [0 −1 ; 1 0]. 3) p<sub>w</sub> = R(45°)(1, 0) = (cos 45°, sin 45°) ≈ (0.707, 0.707).</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 3 · Bài 3.2</span>
<h2>Phép quay: ma trận quay 2D và 3D</h2>
<p class="lead">Robot không chỉ là một điểm — nó có <strong>hướng</strong>. Camera trên con robot hình rùa nhìn theo hướng robot nhìn; tay gắp có thể nghiêng. Hướng được mô tả bằng <strong>ma trận quay</strong>, đối tượng được dùng nhiều nhất trong toán học robot.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết ma trận quay 2D R(θ) và dùng nó quay một vectơ.</li><li>Nêu các tính chất của ma trận quay: R<sup>T</sup>R = I, det R = 1, R<sup>−1</sup> = R<sup>T</sup>.</li><li>Viết các phép quay cơ bản quanh trục x, y, z trong 3D.</li><li>Giải thích vì sao thứ tự các phép quay 3D quan trọng.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Quay vectơ (x, y) ngược chiều kim đồng hồ một góc θ quanh gốc. Toạ độ mới là x′ = x cos θ − y sin θ và y′ = x sin θ + y cos θ. Viết dạng ma trận:</p>
<div class="formula"><span class="lbl">Phép quay 2D</span>R(θ) = [ cos θ   −sin θ ;  sin θ   cos θ ]      p′ = R(θ) p</div>
<p>Có một cách đọc thứ hai, quan trọng không kém. Các <strong>cột</strong> của R chính là các trục đơn vị của hệ {b} đã quay, viết trong toạ độ của hệ cố định {s}. Vì vậy R<sub>sb</sub> vừa <em>mô tả hướng</em> của {b} so với {s}, vừa <em>đổi</em> một vectơ từ toạ độ {b} sang toạ độ {s}: p<sub>s</sub> = R<sub>sb</sub> p<sub>b</sub>. Lynch &amp; Park dùng ký hiệu này suốt Chương 3: các chỉ số dưới “triệt tiêu” như phân số, R<sub>sb</sub> R<sub>bc</sub> = R<sub>sc</sub>.</p>
<p>Vì các cột là các vectơ đơn vị vuông góc nhau, mọi ma trận quay đều thoả:</p>
<div class="formula"><span class="lbl">Tính chất</span>R<sup>T</sup> R = I    det R = +1    R<sup>−1</sup> = R<sup>T</sup>    R(α) R(β) = R(α + β) trong 2D</div>
<p>Vậy muốn “quay ngược lại” thì chỉ cần chuyển vị. Ma trận có det = −1 là phép đối xứng (soi gương), không phải phép quay — nó biến hệ thuận thành hệ nghịch.</p>
<p>Trong <strong>3D</strong> có ba phép quay cơ bản, mỗi phép quanh một trục (góc dương là ngược chiều kim đồng hồ khi nhìn dọc trục về phía gốc):</p>
<div class="formula"><span class="lbl">Phép quay cơ bản 3D</span>R<sub>x</sub>(θ) = [1 0 0 ; 0 cos θ −sin θ ; 0 sin θ cos θ]<br>R<sub>y</sub>(θ) = [cos θ 0 sin θ ; 0 1 0 ; −sin θ 0 cos θ]<br>R<sub>z</sub>(θ) = [cos θ −sin θ 0 ; sin θ cos θ 0 ; 0 0 1]</div>
<p>Mọi hướng 3D đều dựng được bằng tích của ba phép quay như vậy — ví dụ các góc roll–pitch–yaw mà drone và IMU dùng. Nhưng cẩn thận: <strong>phép quay 3D không giao hoán</strong>. R<sub>z</sub>R<sub>x</sub> ≠ R<sub>x</sub>R<sub>z</sub>. Thử với chiếc điện thoại: quay 90° quanh trục đứng rồi 90° quanh trục ngang, so với làm theo thứ tự ngược lại.</p>
<h3>✍️ Ví dụ</h3>
<div class="callout"><p><b>(a)</b> Quay (1, 0) góc 90°: R(90°) = [0 −1 ; 1 0], nên p′ = (0·1 − 1·0, 1·1 + 0·0) = <b>(0, 1)</b>. <b>(b)</b> Quay (2, 0) góc 30°: (2 cos 30°, 2 sin 30°) = <b>(1,732; 1)</b>. <b>(c)</b> Kiểm các tính chất và thứ tự phép quay 3D bằng số:</p></div>
<pre><code class="language-python">import numpy as np
np.set_printoptions(precision=3, suppress=True)

def rot2(theta_deg):
    t = np.radians(theta_deg)
    return np.array([[np.cos(t), -np.sin(t)],
                     [np.sin(t),  np.cos(t)]])

def rot_x(deg):
    t = np.radians(deg); c, s = np.cos(t), np.sin(t)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])

def rot_z(deg):
    t = np.radians(deg); c, s = np.cos(t), np.sin(t)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])

R = rot2(90)
print("R(90) @ [1, 0] =", R @ np.array([1.0, 0.0]))
print("R(30) @ [2, 0] =", rot2(30) @ np.array([2.0, 0.0]))
print("R^T R = I ?", np.allclose(R.T @ R, np.eye(2)), "| det =", round(np.linalg.det(R), 6))

# order matters in 3D
A = np.round(rot_z(90) @ rot_x(90), 3) + 0.0
B = np.round(rot_x(90) @ rot_z(90), 3) + 0.0
print("Rz(90) Rx(90) =\\n", A)
print("Rx(90) Rz(90) =\\n", B)
print("same?", np.allclose(A, B))
</code></pre>
<div class="out">R(90) @ [1, 0] = [0. 1.]
R(30) @ [2, 0] = [1.732 1.   ]
R^T R = I ? True | det = 1.0
Rz(90) Rx(90) =
 [[0. 0. 1.]
 [1. 0. 0.]
 [0. 1. 0.]]
Rx(90) Rz(90) =
 [[ 0. -1.  0.]
 [ 0.  0. -1.]
 [ 1.  0.  0.]]
same? False</div>
<p>Hai tích là hai ma trận khác nhau: cùng hai lần quay 90°, làm theo thứ tự khác thì vật nằm ở hướng khác.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đưa độ vào np.cos / math.cos, trong khi hàm này nhận radian.</li><li>Sai dấu trong R: −sin θ nằm ở <em>góc trên bên phải</em> với phép quay ngược chiều kim đồng hồ.</li><li>Nghịch đảo R bằng np.linalg.inv — đúng, nhưng R<sup>T</sup> chính xác và rẻ hơn.</li><li>Tưởng có thể áp các phép quay 3D theo thứ tự tuỳ ý.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>R(θ) quay vectơ; các cột của nó là các trục của hệ đã quay.</li><li>R<sub>sb</sub> đổi toạ độ {b} sang toạ độ {s}; chỉ số nối chuỗi: R<sub>sb</sub>R<sub>bc</sub> = R<sub>sc</sub>.</li><li>R<sup>T</sup>R = I, det R = 1, nghịch đảo = chuyển vị.</li><li>3D: R<sub>x</sub>, R<sub>y</sub>, R<sub>z</sub>; tích không giao hoán.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/3-2-1-rotation-matrices-part-1-of-2/" target="_blank" rel="noopener">Modern Robotics — 3.2.1 Ma trận quay (phần 1/2)</a></li><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/3-2-1-rotation-matrices-part-2-of-2/" target="_blank" rel="noopener">Modern Robotics — 3.2.1 Ma trận quay (phần 2/2)</a></li><li><a href="https://www.3blue1brown.com/lessons/linear-transformations" target="_blank" rel="noopener">3Blue1Brown — Phép biến đổi tuyến tính và ma trận</a></li><li><a href="https://en.wikipedia.org/wiki/Rotation_matrix" target="_blank" rel="noopener">Wikipedia — Ma trận quay</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Quay p = (0, 2) một góc θ = −90°.</li><li>Chứng tỏ R(30°)R(60°) = R(90°) bằng cách nhân ma trận (hoặc lập luận theo góc).</li><li>Hướng của robot trong hệ thế giới là R<sub>wb</sub> = R(45°). Cảm biến báo một hướng (1, 0) trong hệ thân. Viết hướng đó trong hệ thế giới.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) R(−90°) = [0 1 ; −1 0] ⇒ (2, 0). 2) Trong 2D các góc quay cộng nhau: 30° + 60° = 90°, nên tích là [0 −1 ; 1 0]. 3) p<sub>w</sub> = R(45°)(1, 0) = (cos 45°, sin 45°) ≈ (0,707; 0,707).</p></div>`);

const r33 = L('rai101-ts-3-3',
  '3.3 — Homogeneous transformations: position and orientation together|||3.3 — Phép biến đổi thuần nhất: vị trí và hướng gộp làm một',
  'Ma trận biến đổi thuần nhất T = [R p; 0 1], đổi toạ độ điểm giữa các hệ, nối chuỗi T_wr·T_rc, nghịch đảo T⁻¹ = [Rᵀ, −Rᵀp]; ví dụ camera trên robot bằng numpy chạy thật.',
  `<span class="eyebrow">RAI101 · Chapter 3 · Lesson 3.3</span>
<h2>Homogeneous transformations: position and orientation together</h2>
<p class="lead">A frame's full pose is a <strong>position</strong> (where its origin is) plus an <strong>orientation</strong> (how its axes point). The homogeneous transformation matrix packs both into one matrix, so that changing frames — even through a long chain of frames — becomes plain matrix multiplication.</p>
<h3>🎯 Objectives</h3>
<ul><li>Build the homogeneous transformation T from a rotation R and a translation p.</li><li>Convert a point from one frame to another using homogeneous coordinates.</li><li>Chain transforms (T<sub>wc</sub> = T<sub>wr</sub>T<sub>rc</sub>) and invert them.</li></ul>
<h3>📖 Lecture</h3>
<p>Suppose frame {b} has orientation R<sub>ab</sub> and origin p<sub>ab</sub> relative to frame {a}. A point with coordinates x<sub>b</sub> in {b} has coordinates x<sub>a</sub> = R<sub>ab</sub> x<sub>b</sub> + p<sub>ab</sub> in {a}: first rotate, then shift. To turn “rotate + shift” into a single multiplication, we append a 1 to every point (<strong>homogeneous coordinates</strong>) and build a bigger matrix:</p>
<div class="formula"><span class="lbl">Homogeneous transform</span>T<sub>ab</sub> = [ R<sub>ab</sub>   p<sub>ab</sub> ;  0   1 ]      [x<sub>a</sub> ; 1] = T<sub>ab</sub> [x<sub>b</sub> ; 1]<br>2D (planar): T = [ cos θ  −sin θ  x ;  sin θ  cos θ  y ;  0  0  1 ]   (3×3)<br>3D: R is 3×3, p is 3×1, T is 4×4</div>
<p>Three facts make T powerful (Lynch &amp; Park §3.3; Craig Ch. 2):</p>
<ul><li><strong>Chaining.</strong> Subscripts cancel exactly as with rotations: T<sub>wc</sub> = T<sub>wr</sub> T<sub>rc</sub>. If the robot pose in the world is T<sub>wr</sub> and the camera is mounted on the robot at T<sub>rc</sub>, the camera pose in the world is their product.</li><li><strong>Inverse.</strong> Going the other way needs no general matrix inversion: T<sup>−1</sup> = [ R<sup>T</sup>   −R<sup>T</sup>p ;  0   1 ].</li><li><strong>Order matters.</strong> T<sub>1</sub>T<sub>2</sub> ≠ T<sub>2</sub>T<sub>1</sub> in general — rotating then translating is not the same as translating then rotating.</li></ul>
<p>In ROS 2 this exact idea is implemented by the <em>tf2</em> library: every robot publishes a tree of frames (map → odom → base_link → camera_link …) and tf2 multiplies the transforms along the tree for you (Chapter 10).</p>
<h3>✍️ Worked example — where is the object the camera sees?</h3>
<div class="callout"><p>The robot is at (2, 1) m in the world, facing along world y (θ = 90°): T<sub>wr</sub> = T(2, 1, 90°). The camera is 0.5 m in front of the robot centre, aligned with it: T<sub>rc</sub> = T(0.5, 0, 0°). The camera sees an object 1 m straight ahead: p<sub>c</sub> = (1, 0).</p>
<p>Step 1: T<sub>wc</sub> = T<sub>wr</sub>T<sub>rc</sub> — the camera is at (2, 1.5), facing world y. Step 2: p<sub>w</sub> = T<sub>wc</sub>[1, 0, 1]<sup>T</sup> = <b>(2, 2.5)</b>. Step 3 (reverse question): a door at (0, 3) in the world is at T<sub>wr</sub><sup>−1</sup>(0, 3) = <b>(2, 2)</b> in the robot frame — 2 m ahead and 2 m to the left.</p></div>
<pre><code class="language-python">import numpy as np
np.set_printoptions(precision=3, suppress=True)

def T2(x, y, theta_deg):
    """3x3 homogeneous transform: rotate by theta, then place origin at (x, y)."""
    t = np.radians(theta_deg); c, s = np.cos(t), np.sin(t)
    return np.array([[c, -s, x],
                     [s,  c, y],
                     [0,  0, 1]])

def inv_T2(T):
    R, p = T[:2, :2], T[:2, 2]
    Ti = np.eye(3)
    Ti[:2, :2] = R.T
    Ti[:2, 2] = -R.T @ p
    return Ti

T_wr = T2(2.0, 1.0, 90)    # robot pose in the world
T_rc = T2(0.5, 0.0, 0)     # camera is 0.5 m in front of the robot centre
p_c = np.array([1.0, 0.0, 1.0])   # object seen 1 m straight ahead of the camera

T_wc = T_wr @ T_rc
p_w = T_wc @ p_c
print("T_wc =\\n", T_wc + 0.0)
print("object in world:", p_w[:2] + 0.0)

# the other way round: where is a world point in the robot frame?
door_w = np.array([0.0, 3.0, 1.0])
door_r = inv_T2(T_wr) @ door_w
print("door in robot frame:", door_r[:2] + 0.0)
print("check T * T^-1 = I:", np.allclose(T_wr @ inv_T2(T_wr), np.eye(3)))
</code></pre>
<div class="out">T_wc =
 [[ 0.  -1.   2. ]
 [ 1.   0.   1.5]
 [ 0.   0.   1. ]]
object in world: [2.  2.5]
door in robot frame: [2. 2.]
check T * T^-1 = I: True</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the trailing 1 in [x, y, 1] — or putting 0, which turns a point into a free vector that ignores translation.</li><li>Multiplying in the wrong order (T<sub>rc</sub>T<sub>wr</sub>): the subscripts no longer cancel, which is the warning sign.</li><li>Inverting by negating p only: the correct translation part is −R<sup>T</sup>p, not −p.</li><li>Mixing up “pose of {b} in {a}” (T<sub>ab</sub>) with “pose of {a} in {b}” (T<sub>ba</sub> = T<sub>ab</sub><sup>−1</sup>).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>T = [R p; 0 1] holds position and orientation in one matrix (3×3 planar, 4×4 spatial).</li><li>Points need homogeneous coordinates [x; 1].</li><li>Chain with matching subscripts: T<sub>wc</sub> = T<sub>wr</sub>T<sub>rc</sub>.</li><li>T<sup>−1</sup> = [R<sup>T</sup>, −R<sup>T</sup>p; 0 1]; order of multiplication matters.</li><li>ROS tf2 does this bookkeeping for whole robot frame trees.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/3-3-1-homogeneous-transformation-matrices/" target="_blank" rel="noopener">Modern Robotics — 3.3.1 Homogeneous transformation matrices</a></li><li><a href="https://en.wikipedia.org/wiki/Homogeneous_coordinates" target="_blank" rel="noopener">Wikipedia — Homogeneous coordinates</a></li><li><a href="https://github.com/ros2/ros2_documentation/blob/jazzy/source/Concepts/Intermediate/About-Tf2.rst" target="_blank" rel="noopener">ROS 2 documentation source — About tf2</a></li><li><a href="https://github.com/petercorke/spatialmath-python" target="_blank" rel="noopener">Peter Corke — spatialmath-python (rotations and poses in Python)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write T for a planar frame at (3, −1) rotated 180°.</li><li>With T<sub>wr</sub> = T(1, 1, 0°), a lidar reports an obstacle at (2, 0.5) in the robot frame. Where is it in the world?</li><li>Invert T(0, 2, 90°) and use it to express the world point (0, 4) in that frame.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) [ −1 0 3 ; 0 −1 −1 ; 0 0 1 ]. 2) No rotation, so just add: (3, 1.5). 3) R = [0 −1 ; 1 0], R<sup>T</sup> = [0 1 ; −1 0], −R<sup>T</sup>p = −(2, 0) = (−2, 0); T<sup>−1</sup> = [0 1 −2 ; −1 0 0 ; 0 0 1]; T<sup>−1</sup>(0, 4, 1) = (4 − 2, 0) = (2, 0): the point is 2 m straight ahead along the frame's x-axis.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 3 · Bài 3.3</span>
<h2>Phép biến đổi thuần nhất: vị trí và hướng gộp làm một</h2>
<p class="lead">Tư thế (pose) đầy đủ của một hệ gồm <strong>vị trí</strong> (gốc hệ ở đâu) và <strong>hướng</strong> (các trục chỉ về đâu). Ma trận biến đổi thuần nhất gói cả hai vào một ma trận, nhờ đó việc đổi hệ — kể cả qua một chuỗi dài nhiều hệ — chỉ còn là phép nhân ma trận.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Lập ma trận biến đổi thuần nhất T từ phép quay R và phép tịnh tiến p.</li><li>Đổi toạ độ một điểm từ hệ này sang hệ khác bằng toạ độ thuần nhất.</li><li>Nối chuỗi phép biến đổi (T<sub>wc</sub> = T<sub>wr</sub>T<sub>rc</sub>) và nghịch đảo chúng.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Giả sử hệ {b} có hướng R<sub>ab</sub> và gốc p<sub>ab</sub> so với hệ {a}. Một điểm có toạ độ x<sub>b</sub> trong {b} thì có toạ độ x<sub>a</sub> = R<sub>ab</sub> x<sub>b</sub> + p<sub>ab</sub> trong {a}: quay trước, tịnh tiến sau. Để biến “quay + tịnh tiến” thành một phép nhân duy nhất, ta thêm số 1 vào cuối mỗi điểm (<strong>toạ độ thuần nhất</strong>) và dựng ma trận lớn hơn:</p>
<div class="formula"><span class="lbl">Biến đổi thuần nhất</span>T<sub>ab</sub> = [ R<sub>ab</sub>   p<sub>ab</sub> ;  0   1 ]      [x<sub>a</sub> ; 1] = T<sub>ab</sub> [x<sub>b</sub> ; 1]<br>2D (phẳng): T = [ cos θ  −sin θ  x ;  sin θ  cos θ  y ;  0  0  1 ]   (3×3)<br>3D: R là 3×3, p là 3×1, T là 4×4</div>
<p>Ba sự thật khiến T mạnh (Lynch &amp; Park §3.3; Craig Ch. 2):</p>
<ul><li><strong>Nối chuỗi.</strong> Chỉ số triệt tiêu y như với phép quay: T<sub>wc</sub> = T<sub>wr</sub> T<sub>rc</sub>. Tư thế robot trong thế giới là T<sub>wr</sub>, camera gắn trên robot ở T<sub>rc</sub>, thì tư thế camera trong thế giới là tích của chúng.</li><li><strong>Nghịch đảo.</strong> Đi chiều ngược lại không cần nghịch đảo ma trận tổng quát: T<sup>−1</sup> = [ R<sup>T</sup>   −R<sup>T</sup>p ;  0   1 ].</li><li><strong>Thứ tự quan trọng.</strong> Nói chung T<sub>1</sub>T<sub>2</sub> ≠ T<sub>2</sub>T<sub>1</sub> — quay rồi tịnh tiến khác với tịnh tiến rồi quay.</li></ul>
<p>Trong ROS 2, đúng ý tưởng này được cài trong thư viện <em>tf2</em>: mỗi robot phát một cây hệ toạ độ (map → odom → base_link → camera_link …) và tf2 nhân các phép biến đổi dọc theo cây giúp bạn (Chương 10).</p>
<h3>✍️ Ví dụ — vật mà camera nhìn thấy nằm ở đâu?</h3>
<div class="callout"><p>Robot ở (2, 1) m trong thế giới, mặt hướng theo trục y thế giới (θ = 90°): T<sub>wr</sub> = T(2, 1, 90°). Camera đặt phía trước tâm robot 0,5 m, cùng hướng với robot: T<sub>rc</sub> = T(0,5; 0; 0°). Camera thấy một vật cách 1 m thẳng phía trước: p<sub>c</sub> = (1, 0).</p>
<p>Bước 1: T<sub>wc</sub> = T<sub>wr</sub>T<sub>rc</sub> — camera ở (2; 1,5), nhìn theo trục y thế giới. Bước 2: p<sub>w</sub> = T<sub>wc</sub>[1, 0, 1]<sup>T</sup> = <b>(2; 2,5)</b>. Bước 3 (câu hỏi ngược): cánh cửa ở (0, 3) trong thế giới thì nằm ở T<sub>wr</sub><sup>−1</sup>(0, 3) = <b>(2, 2)</b> trong hệ robot — phía trước 2 m và lệch trái 2 m.</p></div>
<pre><code class="language-python">import numpy as np
np.set_printoptions(precision=3, suppress=True)

def T2(x, y, theta_deg):
    """3x3 homogeneous transform: rotate by theta, then place origin at (x, y)."""
    t = np.radians(theta_deg); c, s = np.cos(t), np.sin(t)
    return np.array([[c, -s, x],
                     [s,  c, y],
                     [0,  0, 1]])

def inv_T2(T):
    R, p = T[:2, :2], T[:2, 2]
    Ti = np.eye(3)
    Ti[:2, :2] = R.T
    Ti[:2, 2] = -R.T @ p
    return Ti

T_wr = T2(2.0, 1.0, 90)    # robot pose in the world
T_rc = T2(0.5, 0.0, 0)     # camera is 0.5 m in front of the robot centre
p_c = np.array([1.0, 0.0, 1.0])   # object seen 1 m straight ahead of the camera

T_wc = T_wr @ T_rc
p_w = T_wc @ p_c
print("T_wc =\\n", T_wc + 0.0)
print("object in world:", p_w[:2] + 0.0)

# the other way round: where is a world point in the robot frame?
door_w = np.array([0.0, 3.0, 1.0])
door_r = inv_T2(T_wr) @ door_w
print("door in robot frame:", door_r[:2] + 0.0)
print("check T * T^-1 = I:", np.allclose(T_wr @ inv_T2(T_wr), np.eye(3)))
</code></pre>
<div class="out">T_wc =
 [[ 0.  -1.   2. ]
 [ 1.   0.   1.5]
 [ 0.   0.   1. ]]
object in world: [2.  2.5]
door in robot frame: [2. 2.]
check T * T^-1 = I: True</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên số 1 ở cuối [x, y, 1] — hoặc ghi 0, khi đó điểm thành vectơ tự do, bỏ qua phép tịnh tiến.</li><li>Nhân sai thứ tự (T<sub>rc</sub>T<sub>wr</sub>): chỉ số không còn triệt tiêu — đó là dấu hiệu cảnh báo.</li><li>Nghịch đảo bằng cách chỉ đổi dấu p: phần tịnh tiến đúng là −R<sup>T</sup>p, không phải −p.</li><li>Nhầm “tư thế của {b} trong {a}” (T<sub>ab</sub>) với “tư thế của {a} trong {b}” (T<sub>ba</sub> = T<sub>ab</sub><sup>−1</sup>).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>T = [R p; 0 1] chứa vị trí và hướng trong một ma trận (3×3 phẳng, 4×4 không gian).</li><li>Điểm phải viết ở toạ độ thuần nhất [x; 1].</li><li>Nối chuỗi với chỉ số khớp nhau: T<sub>wc</sub> = T<sub>wr</sub>T<sub>rc</sub>.</li><li>T<sup>−1</sup> = [R<sup>T</sup>, −R<sup>T</sup>p; 0 1]; thứ tự nhân quan trọng.</li><li>tf2 của ROS làm hộ việc ghi chép này cho cả cây hệ toạ độ của robot.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/3-3-1-homogeneous-transformation-matrices/" target="_blank" rel="noopener">Modern Robotics — 3.3.1 Ma trận biến đổi thuần nhất</a></li><li><a href="https://en.wikipedia.org/wiki/Homogeneous_coordinates" target="_blank" rel="noopener">Wikipedia — Toạ độ thuần nhất</a></li><li><a href="https://github.com/ros2/ros2_documentation/blob/jazzy/source/Concepts/Intermediate/About-Tf2.rst" target="_blank" rel="noopener">Mã nguồn tài liệu ROS 2 — Giới thiệu tf2</a></li><li><a href="https://github.com/petercorke/spatialmath-python" target="_blank" rel="noopener">Peter Corke — spatialmath-python (phép quay và tư thế trong Python)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết T cho một hệ phẳng đặt tại (3, −1) và quay 180°.</li><li>Với T<sub>wr</sub> = T(1, 1, 0°), lidar báo vật cản ở (2; 0,5) trong hệ robot. Vật cản ở đâu trong thế giới?</li><li>Nghịch đảo T(0, 2, 90°) rồi dùng nó biểu diễn điểm thế giới (0, 4) trong hệ đó.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) [ −1 0 3 ; 0 −1 −1 ; 0 0 1 ]. 2) Không có phép quay nên chỉ cần cộng: (3; 1,5). 3) R = [0 −1 ; 1 0], R<sup>T</sup> = [0 1 ; −1 0], −R<sup>T</sup>p = −(2, 0) = (−2, 0); T<sup>−1</sup> = [0 1 −2 ; −1 0 0 ; 0 0 1]; T<sup>−1</sup>(0, 4, 1) = (4 − 2, 0) = (2, 0): điểm nằm thẳng phía trước 2 m theo trục x của hệ.</p></div>`);

const q3 = QZ(3, 'Quiz — Chapter 3: Frames, rotations and transforms|||Quiz — Chương 3: Hệ toạ độ, phép quay và biến đổi', 'Kiểm tra chương 3: hệ toạ độ, vectơ, atan2, ma trận quay 2D/3D, tính chất trực giao, biến đổi thuần nhất, nối chuỗi và nghịch đảo.', [
  Q('q1', 'A robot is at (2, 1) m and a cup at (5, 5) m in the same frame. The distance is|||Robot ở (2, 1) m, cái cốc ở (5, 5) m trong cùng một hệ. Khoảng cách là',
    ['3 m|||3 m', '4 m|||4 m', '5 m|||5 m', '7 m|||7 m'], 2,
    'd = (3, 4), ‖d‖ = √(9 + 16) = 5.|||d = (3, 4), ‖d‖ = √(9 + 16) = 5.'),
  Q('q2', 'Why use atan2(y, x) instead of atan(y/x)?|||Vì sao dùng atan2(y, x) thay cho atan(y/x)?',
    ['atan2 is faster|||atan2 chạy nhanh hơn', 'atan2 returns the correct quadrant and handles x = 0|||atan2 cho đúng góc phần tư và xử lý được x = 0', 'atan2 returns degrees|||atan2 trả về độ', 'There is no difference|||Không có khác biệt'], 1,
    'atan(y/x) cannot tell (1, 1) from (−1, −1) and fails at x = 0.|||atan(y/x) không phân biệt được (1, 1) với (−1, −1) và lỗi khi x = 0.'),
  Q('q3', 'R(90°) applied to the vector (1, 0) gives|||Áp R(90°) vào vectơ (1, 0) được',
    ['(0, 1)|||(0, 1)', '(0, −1)|||(0, −1)', '(−1, 0)|||(−1, 0)', '(1, 1)|||(1, 1)'], 0,
    'Counter-clockwise 90° turns the x-axis into the y-axis.|||Quay 90° ngược chiều kim đồng hồ biến trục x thành trục y.'),
  Q('q4', 'For any rotation matrix R, which statement is FALSE?|||Với mọi ma trận quay R, khẳng định nào SAI?',
    ['Rᵀ R = I|||Rᵀ R = I', 'det R = 1|||det R = 1', 'R⁻¹ = Rᵀ|||R⁻¹ = Rᵀ', 'det R = −1|||det R = −1'], 3,
    'det = −1 is a reflection, not a rotation.|||det = −1 là phép đối xứng, không phải phép quay.'),
  Q('q5', 'The columns of R_sb are|||Các cột của R_sb là',
    ['the axes of {s} written in {b}|||các trục của {s} viết trong {b}', 'the axes of {b} written in {s}|||các trục của {b} viết trong {s}', 'the origin of {b}|||gốc của {b}', 'Euler angles|||các góc Euler'], 1,
    'R_sb describes the orientation of {b} relative to {s}.|||R_sb mô tả hướng của {b} so với {s}.'),
  Q('q6', 'In 3D, Rz(90°)·Rx(90°) and Rx(90°)·Rz(90°) are|||Trong 3D, Rz(90°)·Rx(90°) và Rx(90°)·Rz(90°)',
    ['always equal|||luôn bằng nhau', 'different, because 3D rotations do not commute|||khác nhau, vì phép quay 3D không giao hoán', 'both the identity|||đều là ma trận đơn vị', 'not rotation matrices|||không phải ma trận quay'], 1,
    'The numerical check in lesson 3.2 gives two different matrices.|||Phép kiểm bằng số ở bài 3.2 cho hai ma trận khác nhau.'),
  Q('q7', 'A planar homogeneous transformation matrix has size|||Ma trận biến đổi thuần nhất trong mặt phẳng có kích thước',
    ['2×2|||2×2', '3×3|||3×3', '4×4|||4×4', '2×3|||2×3'], 1,
    '2×2 rotation + 2×1 translation + bottom row [0 0 1]; 3D uses 4×4.|||Phép quay 2×2 + tịnh tiến 2×1 + hàng cuối [0 0 1]; 3D dùng 4×4.'),
  Q('q8', 'Robot pose T_wr = T(2, 1, 90°), camera mount T_rc = T(0.5, 0, 0°). The camera origin in the world is|||Tư thế robot T_wr = T(2, 1, 90°), camera gắn ở T_rc = T(0,5; 0; 0°). Gốc camera trong thế giới là',
    ['(2.5, 1)|||(2,5; 1)', '(2, 1.5)|||(2; 1,5)', '(1.5, 1)|||(1,5; 1)', '(2, 0.5)|||(2; 0,5)'], 1,
    'The robot faces world y, so “0.5 m ahead” adds 0.5 to y.|||Robot nhìn theo trục y thế giới nên “phía trước 0,5 m” cộng 0,5 vào y.'),
  Q('q9', 'The inverse of T = [R p; 0 1] is|||Nghịch đảo của T = [R p; 0 1] là',
    ['[R −p; 0 1]|||[R −p; 0 1]', '[Rᵀ −p; 0 1]|||[Rᵀ −p; 0 1]', '[Rᵀ −Rᵀp; 0 1]|||[Rᵀ −Rᵀp; 0 1]', '[−R p; 0 1]|||[−R p; 0 1]'], 2,
    'Undo the shift, then undo the rotation: x_b = Rᵀ(x_a − p).|||Bỏ tịnh tiến rồi bỏ phép quay: x_b = Rᵀ(x_a − p).'),
  Q('q10', 'Which product correctly gives the camera pose in the world?|||Tích nào cho đúng tư thế camera trong thế giới?',
    ['T_rc · T_wr|||T_rc · T_wr', 'T_wr · T_rc|||T_wr · T_rc', 'T_wr⁻¹ · T_rc|||T_wr⁻¹ · T_rc', 'T_rc⁻¹ · T_wr|||T_rc⁻¹ · T_wr'], 1,
    'Inner subscripts must match and cancel: w‑r · r‑c → w‑c.|||Các chỉ số kề nhau phải khớp và triệt tiêu: w‑r · r‑c → w‑c.'),
]);

const ch3 = {
  title: 'Chapter 3 — Math for robots: frames, rotations and transforms|||Chương 3 — Toán cho robot: hệ toạ độ, phép quay và biến đổi',
  description: 'Hệ toạ độ và vectơ, ma trận quay 2D/3D, ma trận biến đổi thuần nhất, nối chuỗi và nghịch đảo — có code numpy chạy thật (Lynch & Park Modern Robotics Ch. 2–3 · Craig Ch. 2).',
  lessons: [r31, r32, r33, q3],
};


// ───────────────────────────── Chương 4 — Động học ─────────────────────────────
const r41 = L('rai101-ts-4-1',
  '4.1 — Degrees of freedom, joints, workspace and configuration space|||4.1 — Bậc tự do, khớp, không gian làm việc và không gian cấu hình',
  'Bậc tự do của vật rắn (3 phẳng, 6 không gian), khớp quay/tịnh tiến/cầu, công thức Grübler, không gian cấu hình và không gian làm việc của tay máy 2 khâu; code Python chạy thật.',
  `<span class="eyebrow">RAI101 · Chapter 4 · Lesson 4.1</span>
<h2>Degrees of freedom, joints, workspace and configuration space</h2>
<p class="lead">How many numbers do you need to say exactly where every part of a robot is? That number is the robot's <strong>degrees of freedom (DOF)</strong>. It tells you how many motors it needs, what tasks it can do, and how big the planning problem will be.</p>
<h3>🎯 Objectives</h3>
<ul><li>Count the DOF of a rigid body in the plane and in space.</li><li>Recognise common joint types and how many freedoms each allows.</li><li>Apply Grübler's formula to arms and linkages.</li><li>Distinguish configuration space (C-space) from workspace.</li></ul>
<h3>📖 Lecture</h3>
<p>The <strong>configuration</strong> of a robot is a specification of the position of every point of the robot; the <strong>configuration space (C-space)</strong> is the set of all configurations; and the <strong>DOF</strong> is the dimension of the C-space — the minimum number of real numbers needed (Lynch &amp; Park, Ch. 2). A coin sliding on a table has 3 DOF (x, y and a rotation angle θ). A rigid body flying in space has <strong>6 DOF</strong>: 3 for position and 3 for orientation. Rule of thumb:</p>
<div class="formula"><span class="lbl">DOF counting</span>DOF = (sum of freedoms of the bodies) − (number of independent constraints)</div>
<p><strong>Joints</strong> connect links and remove freedoms. The common types and the freedoms f they <em>allow</em>:</p>
<ul><li><strong>Revolute (R)</strong> — a hinge, rotation about one axis: f = 1. Most industrial arms are chains of R joints.</li><li><strong>Prismatic (P)</strong> — a slider, translation along one axis: f = 1 (e.g. the vertical axis of a 3D printer).</li><li><strong>Universal (U)</strong> — two perpendicular hinges: f = 2.</li><li><strong>Spherical (S)</strong> — a ball joint like the human shoulder: f = 3.</li></ul>
<p>For a mechanism with N links (counting the ground as a link), J joints with freedoms f<sub>i</sub>, and m = 3 for planar or m = 6 for spatial mechanisms, <strong>Grübler's formula</strong> gives the DOF (valid when the constraints are independent):</p>
<div class="formula"><span class="lbl">Grübler's formula</span>dof = m (N − 1 − J) + Σ f<sub>i</sub></div>
<p>Two different spaces must not be confused. The <strong>C-space</strong> of a 2-joint arm is the set of joint-angle pairs (θ<sub>1</sub>, θ<sub>2</sub>) — a torus, because each angle wraps around. The <strong>workspace</strong> is the set of points the end-effector can reach in the real world. For a planar arm with link lengths L<sub>1</sub> ≥ L<sub>2</sub> and unlimited joints, the workspace is a ring (annulus): |L<sub>1</sub> − L<sub>2</sub>| ≤ r ≤ L<sub>1</sub> + L<sub>2</sub>. The <strong>task space</strong> is the space in which the task is naturally described (for example, the (x, y) position of a pen on a whiteboard).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>2R planar arm:</b> N = 3 (ground + 2 links), J = 2 revolute joints: dof = 3(3 − 1 − 2) + 2 = <b>2</b>.</p>
<p><b>Four-bar linkage</b> (closed loop): N = 4, J = 4 revolute: dof = 3(4 − 1 − 4) + 4 = <b>1</b> — one motor drives the whole mechanism.</p>
<p><b>Industrial 6R arm:</b> N = 7, J = 6: dof = 6(7 − 1 − 6) + 6 = <b>6</b> — enough to put the gripper at any position <em>and</em> orientation inside its workspace.</p>
<p><b>Stewart platform</b> (flight simulators): 6 legs, each U–P–S; N = 14, J = 18, Σf = 6·(2 + 1 + 3) = 36: dof = 6(14 − 1 − 18) + 36 = <b>6</b>.</p></div>
<pre><code class="language-python">def grubler(m, N, joint_freedoms):
    """m = 3 (planar) or 6 (spatial); N = links incl. ground; joint_freedoms = list of f_i."""
    J = len(joint_freedoms)
    return m * (N - 1 - J) + sum(joint_freedoms)

print("planar 2R arm      :", grubler(3, 3, [1, 1]))
print("planar 3R arm      :", grubler(3, 4, [1, 1, 1]))
print("four-bar linkage   :", grubler(3, 4, [1, 1, 1, 1]))
print("6R industrial arm  :", grubler(6, 7, [1] * 6))
print("Stewart platform   :", grubler(6, 14, [1] * 6 + [3] * 6 + [2] * 6))

# workspace of a planar 2R arm: reachable distances from the base
L1, L2 = 1.0, 0.7
print("reach r from", round(abs(L1 - L2), 3), "to", round(L1 + L2, 3), "m")
</code></pre>
<div class="out">planar 2R arm      : 2
planar 3R arm      : 3
four-bar linkage   : 1
6R industrial arm  : 6
Stewart platform   : 6
reach r from 0.3 to 1.7 m</div>
<p>Why does 6 matter? To place an object at an arbitrary position <em>and</em> orientation in space you need 6 DOF; a 7-DOF arm (like a human arm) is <strong>redundant</strong> — it can reach the same gripper pose with different elbow positions, useful for avoiding obstacles.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting to count the ground as a link in Grübler's formula.</li><li>Counting motors instead of DOF: a gripper's fingers add DOF to the hand, not to where the hand can go.</li><li>Calling the joint-angle space the “workspace” — the workspace is in (x, y, z), the C-space is in joint coordinates.</li><li>Applying Grübler blindly to special geometries where constraints are not independent.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>DOF = dimension of the C-space = number of independent coordinates.</li><li>Rigid body: 3 DOF in the plane, 6 in space.</li><li>R and P joints allow 1 freedom, U allows 2, S allows 3.</li><li>Grübler: dof = m(N − 1 − J) + Σf<sub>i</sub>.</li><li>Workspace (reachable points) ≠ C-space (joint values); a 2R arm reaches the annulus |L<sub>1</sub> − L<sub>2</sub>| ≤ r ≤ L<sub>1</sub> + L<sub>2</sub>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/2-2-degrees-of-freedom-of-a-robot/" target="_blank" rel="noopener">Modern Robotics — 2.2 Degrees of freedom of a robot (Grübler's formula)</a></li><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/2-5-task-space-and-workspace/" target="_blank" rel="noopener">Modern Robotics — 2.5 Task space and workspace</a></li><li><a href="https://en.wikipedia.org/wiki/Chebychev%E2%80%93Gr%C3%BCbler%E2%80%93Kutzbach_criterion" target="_blank" rel="noopener">Wikipedia — Chebychev–Grübler–Kutzbach criterion</a></li><li><a href="https://hades.mech.northwestern.edu/index.php/Modern_Robotics" target="_blank" rel="noopener">Modern Robotics — free preprint PDF and resources (Northwestern)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many DOF does a planar 3R arm have? Use Grübler.</li><li>A drone flying freely: how many DOF does its body have?</li><li>A 2R arm has L<sub>1</sub> = 0.5 m, L<sub>2</sub> = 0.5 m. Describe its workspace. Can it reach the base point (0, 0)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 3(4 − 1 − 3) + 3 = 3. 2) 6 (3 position + 3 orientation), even though it may have only 4 rotors. 3) 0 ≤ r ≤ 1 m: a full disc of radius 1 m; yes, with θ<sub>2</sub> = 180° the tip folds back to the base.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 4 · Bài 4.1</span>
<h2>Bậc tự do, khớp, không gian làm việc và không gian cấu hình</h2>
<p class="lead">Cần bao nhiêu con số để nói chính xác mọi bộ phận của robot đang ở đâu? Con số đó là <strong>bậc tự do (DOF)</strong> của robot. Nó cho biết robot cần bao nhiêu động cơ, làm được việc gì, và bài toán lập kế hoạch chuyển động sẽ lớn cỡ nào.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đếm bậc tự do của vật rắn trong mặt phẳng và trong không gian.</li><li>Nhận biết các loại khớp thường gặp và số bậc tự do mỗi khớp cho phép.</li><li>Áp dụng công thức Grübler cho tay máy và cơ cấu.</li><li>Phân biệt không gian cấu hình (C-space) với không gian làm việc.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Cấu hình</strong> của robot là mô tả vị trí của mọi điểm trên robot; <strong>không gian cấu hình (C-space)</strong> là tập mọi cấu hình; còn <strong>bậc tự do</strong> là số chiều của C-space — số số thực tối thiểu cần dùng (Lynch &amp; Park, Ch. 2). Đồng xu trượt trên mặt bàn có 3 bậc tự do (x, y và góc quay θ). Vật rắn bay trong không gian có <strong>6 bậc tự do</strong>: 3 cho vị trí và 3 cho hướng. Quy tắc chung:</p>
<div class="formula"><span class="lbl">Đếm bậc tự do</span>DOF = (tổng bậc tự do của các vật) − (số ràng buộc độc lập)</div>
<p><strong>Khớp</strong> nối các khâu với nhau và lấy bớt bậc tự do. Các loại thường gặp và số bậc tự do f chúng <em>cho phép</em>:</p>
<ul><li><strong>Khớp quay (R)</strong> — bản lề, quay quanh một trục: f = 1. Phần lớn tay máy công nghiệp là chuỗi khớp R.</li><li><strong>Khớp tịnh tiến (P)</strong> — rãnh trượt, trượt dọc một trục: f = 1 (vd trục đứng của máy in 3D).</li><li><strong>Khớp các-đăng (U)</strong> — hai bản lề vuông góc: f = 2.</li><li><strong>Khớp cầu (S)</strong> — như khớp vai người: f = 3.</li></ul>
<p>Với cơ cấu có N khâu (tính cả mặt đất là một khâu), J khớp với bậc tự do f<sub>i</sub>, và m = 3 cho cơ cấu phẳng hoặc m = 6 cho cơ cấu không gian, <strong>công thức Grübler</strong> cho số bậc tự do (đúng khi các ràng buộc độc lập):</p>
<div class="formula"><span class="lbl">Công thức Grübler</span>dof = m (N − 1 − J) + Σ f<sub>i</sub></div>
<p>Đừng lẫn hai không gian. <strong>C-space</strong> của tay máy 2 khớp là tập các cặp góc khớp (θ<sub>1</sub>, θ<sub>2</sub>) — một mặt xuyến, vì mỗi góc quay vòng lại. <strong>Không gian làm việc</strong> là tập các điểm mà khâu cuối với tới được trong thế giới thật. Với tay máy phẳng có độ dài khâu L<sub>1</sub> ≥ L<sub>2</sub> và khớp không giới hạn, không gian làm việc là một hình vành khăn: |L<sub>1</sub> − L<sub>2</sub>| ≤ r ≤ L<sub>1</sub> + L<sub>2</sub>. <strong>Không gian tác vụ</strong> là không gian mô tả công việc một cách tự nhiên (vd vị trí (x, y) của cây bút trên bảng).</p>
<h3>✍️ Ví dụ</h3>
<div class="callout"><p><b>Tay máy phẳng 2R:</b> N = 3 (đất + 2 khâu), J = 2 khớp quay: dof = 3(3 − 1 − 2) + 2 = <b>2</b>.</p>
<p><b>Cơ cấu bốn khâu</b> (vòng kín): N = 4, J = 4 khớp quay: dof = 3(4 − 1 − 4) + 4 = <b>1</b> — một động cơ điều khiển cả cơ cấu.</p>
<p><b>Tay máy công nghiệp 6R:</b> N = 7, J = 6: dof = 6(7 − 1 − 6) + 6 = <b>6</b> — đủ để đặt tay gắp ở mọi vị trí <em>và</em> hướng trong vùng với tới.</p>
<p><b>Bệ Stewart</b> (buồng mô phỏng bay): 6 chân, mỗi chân U–P–S; N = 14, J = 18, Σf = 6·(2 + 1 + 3) = 36: dof = 6(14 − 1 − 18) + 36 = <b>6</b>.</p></div>
<pre><code class="language-python">def grubler(m, N, joint_freedoms):
    """m = 3 (planar) or 6 (spatial); N = links incl. ground; joint_freedoms = list of f_i."""
    J = len(joint_freedoms)
    return m * (N - 1 - J) + sum(joint_freedoms)

print("planar 2R arm      :", grubler(3, 3, [1, 1]))
print("planar 3R arm      :", grubler(3, 4, [1, 1, 1]))
print("four-bar linkage   :", grubler(3, 4, [1, 1, 1, 1]))
print("6R industrial arm  :", grubler(6, 7, [1] * 6))
print("Stewart platform   :", grubler(6, 14, [1] * 6 + [3] * 6 + [2] * 6))

# workspace of a planar 2R arm: reachable distances from the base
L1, L2 = 1.0, 0.7
print("reach r from", round(abs(L1 - L2), 3), "to", round(L1 + L2, 3), "m")
</code></pre>
<div class="out">planar 2R arm      : 2
planar 3R arm      : 3
four-bar linkage   : 1
6R industrial arm  : 6
Stewart platform   : 6
reach r from 0.3 to 1.7 m</div>
<p>Vì sao con số 6 quan trọng? Muốn đặt một vật ở vị trí <em>và</em> hướng tuỳ ý trong không gian cần 6 bậc tự do; tay máy 7 bậc tự do (như cánh tay người) là <strong>dư bậc</strong> — nó có thể đạt cùng tư thế tay gắp với nhiều vị trí khuỷu khác nhau, rất có ích để tránh vật cản.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên tính mặt đất là một khâu trong công thức Grübler.</li><li>Đếm số động cơ thay vì số bậc tự do: các ngón của tay gắp thêm bậc tự do cho bàn tay, không thêm chỗ bàn tay đi tới được.</li><li>Gọi không gian góc khớp là “không gian làm việc” — không gian làm việc ở (x, y, z), còn C-space ở toạ độ khớp.</li><li>Áp Grübler máy móc cho hình học đặc biệt mà các ràng buộc không độc lập.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bậc tự do = số chiều của C-space = số toạ độ độc lập.</li><li>Vật rắn: 3 bậc tự do trong mặt phẳng, 6 trong không gian.</li><li>Khớp R và P cho 1 bậc tự do, U cho 2, S cho 3.</li><li>Grübler: dof = m(N − 1 − J) + Σf<sub>i</sub>.</li><li>Không gian làm việc (điểm với tới) ≠ C-space (giá trị khớp); tay máy 2R với tới vành khăn |L<sub>1</sub> − L<sub>2</sub>| ≤ r ≤ L<sub>1</sub> + L<sub>2</sub>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/2-2-degrees-of-freedom-of-a-robot/" target="_blank" rel="noopener">Modern Robotics — 2.2 Bậc tự do của robot (công thức Grübler)</a></li><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/2-5-task-space-and-workspace/" target="_blank" rel="noopener">Modern Robotics — 2.5 Không gian tác vụ và không gian làm việc</a></li><li><a href="https://en.wikipedia.org/wiki/Chebychev%E2%80%93Gr%C3%BCbler%E2%80%93Kutzbach_criterion" target="_blank" rel="noopener">Wikipedia — Tiêu chuẩn Chebychev–Grübler–Kutzbach</a></li><li><a href="https://hades.mech.northwestern.edu/index.php/Modern_Robotics" target="_blank" rel="noopener">Modern Robotics — bản PDF tiền in miễn phí và tài nguyên (Northwestern)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tay máy phẳng 3R có bao nhiêu bậc tự do? Dùng Grübler.</li><li>Một drone bay tự do: thân nó có bao nhiêu bậc tự do?</li><li>Tay máy 2R có L<sub>1</sub> = 0,5 m, L<sub>2</sub> = 0,5 m. Mô tả không gian làm việc. Nó có chạm được điểm gốc (0, 0) không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 3(4 − 1 − 3) + 3 = 3. 2) 6 (3 vị trí + 3 hướng), dù nó có thể chỉ có 4 cánh quạt. 3) 0 ≤ r ≤ 1 m: cả một hình tròn bán kính 1 m; có, với θ<sub>2</sub> = 180° đầu tay gập ngược về gốc.</p></div>`);

const r42 = L('rai101-ts-4-2',
  '4.2 — Forward kinematics of a planar 2-link arm|||4.2 — Động học thuận của tay máy phẳng hai khâu',
  'Động học thuận: từ góc khớp tính vị trí và hướng đầu tay máy 2R bằng lượng giác và bằng chuỗi ma trận biến đổi thuần nhất; nhắc đến tham số DH và công thức tích hàm mũ; code Python chạy thật.',
  `<span class="eyebrow">RAI101 · Chapter 4 · Lesson 4.2</span>
<h2>Forward kinematics of a planar 2-link arm</h2>
<p class="lead"><strong>Forward kinematics (FK)</strong> answers: <em>given the joint angles, where is the end-effector?</em> It is the direction that is always easy — one answer, computed by a formula — and every robot controller evaluates it hundreds of times per second.</p>
<h3>🎯 Objectives</h3>
<ul><li>Derive the FK equations of a planar 2R arm with trigonometry.</li><li>Obtain the same result by chaining homogeneous transforms.</li><li>Know the names of the general methods: Denavit–Hartenberg parameters and the product of exponentials.</li></ul>
<h3>📖 Lecture</h3>
<p>Take a planar arm with two revolute joints. Link 1 has length L<sub>1</sub> and is rotated by θ<sub>1</sub> from the x-axis; link 2 has length L<sub>2</sub> and is rotated by θ<sub>2</sub> <em>relative to link 1</em>. The elbow is at (L<sub>1</sub> cos θ<sub>1</sub>, L<sub>1</sub> sin θ<sub>1</sub>). Link 2 points in the absolute direction θ<sub>1</sub> + θ<sub>2</sub>, so adding its vector gives the tip:</p>
<div class="formula"><span class="lbl">FK of a planar 2R arm</span>x = L<sub>1</sub> cos θ<sub>1</sub> + L<sub>2</sub> cos(θ<sub>1</sub> + θ<sub>2</sub>)<br>y = L<sub>1</sub> sin θ<sub>1</sub> + L<sub>2</sub> sin(θ<sub>1</sub> + θ<sub>2</sub>)<br>φ = θ<sub>1</sub> + θ<sub>2</sub>   (orientation of the gripper)</div>
<p>The same answer falls out of the transform machinery from Lesson 3.3. At each joint we rotate by θ<sub>i</sub>, then move along the link by L<sub>i</sub>:</p>
<div class="formula"><span class="lbl">FK as a chain of transforms</span>T<sub>0,tip</sub> = Rot(θ<sub>1</sub>)·Trans(L<sub>1</sub>, 0) · Rot(θ<sub>2</sub>)·Trans(L<sub>2</sub>, 0)</div>
<p>The translation column of T<sub>0,tip</sub> is (x, y) and its rotation block is R(θ<sub>1</sub> + θ<sub>2</sub>). This chain view scales to any number of joints and to 3D: real arms with 6 joints are handled by the same product of 4×4 matrices. Textbooks give two systematic recipes for writing those matrices: <strong>Denavit–Hartenberg (DH) parameters</strong> (four numbers per joint; Craig, Ch. 3) and the <strong>product of exponentials (PoE)</strong> formula (Lynch &amp; Park, Ch. 4). You will meet them in later robotics courses; for now, chaining Rot and Trans is enough.</p>
<p>Notice that FK always has <strong>exactly one</strong> answer: every joint configuration places the tip at a single point. Inverse kinematics (next lesson) is the hard direction.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p>L<sub>1</sub> = 1.0 m, L<sub>2</sub> = 0.7 m, θ<sub>1</sub> = 30°, θ<sub>2</sub> = 45°.</p>
<p>Step 1: elbow = (1.0 cos 30°, 1.0 sin 30°) = (0.8660, 0.5000). Step 2: link 2 direction = 30° + 45° = 75°; its vector = (0.7 cos 75°, 0.7 sin 75°) = (0.1812, 0.6761). Step 3: tip = <b>(1.0472, 1.1761)</b>, gripper orientation φ = <b>75°</b>.</p></div>
<pre><code class="language-python">import math
import numpy as np

L1, L2 = 1.0, 0.7          # link lengths (m)

def fk(theta1_deg, theta2_deg):
    t1, t2 = math.radians(theta1_deg), math.radians(theta2_deg)
    x = L1 * math.cos(t1) + L2 * math.cos(t1 + t2)
    y = L1 * math.sin(t1) + L2 * math.sin(t1 + t2)
    phi = theta1_deg + theta2_deg          # orientation of the gripper
    return round(x, 4) + 0.0, round(y, 4) + 0.0, phi

for q in [(0, 0), (90, 0), (30, 45), (45, -90), (0, 180)]:
    print("theta =", q, "-&gt; (x, y, phi) =", fk(*q))

# the same result by chaining homogeneous transforms
def T(theta_deg, length):
    t = math.radians(theta_deg); c, s = math.cos(t), math.sin(t)
    rot = np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])
    trans = np.array([[1, 0, length], [0, 1, 0], [0, 0, 1]])
    return rot @ trans          # rotate at the joint, then move along the link

T_total = T(30, L1) @ T(45, L2)
print("by transforms (30, 45):", np.round(T_total[:2, 2], 4))
</code></pre>
<div class="out">theta = (0, 0) -&gt; (x, y, phi) = (1.7, 0.0, 0)
theta = (90, 0) -&gt; (x, y, phi) = (0.0, 1.7, 90)
theta = (30, 45) -&gt; (x, y, phi) = (1.0472, 1.1761, 75)
theta = (45, -90) -&gt; (x, y, phi) = (1.2021, 0.2121, -45)
theta = (0, 180) -&gt; (x, y, phi) = (0.3, 0.0, 180)
by transforms (30, 45): [1.0472 1.1761]</div>
<p>Read the special cases: (0°, 0°) is the arm fully stretched along x (reach 1.7 m); (0°, 180°) folds link 2 back onto link 1 (reach 0.3 m) — the inner and outer edges of the annular workspace from Lesson 4.1.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using cos θ<sub>2</sub> instead of cos(θ<sub>1</sub> + θ<sub>2</sub>) for link 2: θ<sub>2</sub> is measured relative to link 1, not to the x-axis.</li><li>Forgetting degree → radian conversion.</li><li>Multiplying Trans then Rot at each joint (wrong order) — the link would be laid out before it is rotated.</li><li>Ignoring joint limits: real servos may only turn ±150°, so not every computed pose is achievable.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>FK: joint angles → end-effector pose; always one answer.</li><li>2R arm: x = L<sub>1</sub>cos θ<sub>1</sub> + L<sub>2</sub>cos(θ<sub>1</sub> + θ<sub>2</sub>), y likewise with sin, φ = θ<sub>1</sub> + θ<sub>2</sub>.</li><li>General method: multiply one transform per joint (Rot then Trans).</li><li>Systematic conventions: DH parameters (Craig) and product of exponentials (Lynch &amp; Park).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/4-1-1-product-of-exponentials-formula-in-the-space-frame/" target="_blank" rel="noopener">Modern Robotics — 4.1.1 Product of exponentials formula (forward kinematics)</a></li><li><a href="https://en.wikipedia.org/wiki/Forward_kinematics" target="_blank" rel="noopener">Wikipedia — Forward kinematics</a></li><li><a href="https://en.wikipedia.org/wiki/Denavit%E2%80%93Hartenberg_parameters" target="_blank" rel="noopener">Wikipedia — Denavit–Hartenberg parameters</a></li><li><a href="https://github.com/petercorke/robotics-toolbox-python" target="_blank" rel="noopener">Robotics Toolbox for Python (Peter Corke) — FK for real robot models</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>With L<sub>1</sub> = 1.0, L<sub>2</sub> = 0.7, compute the tip for θ<sub>1</sub> = 90°, θ<sub>2</sub> = −90°.</li><li>For the same arm, what is the largest and smallest distance of the tip from the base?</li><li>A 3R planar arm adds a third link L<sub>3</sub> with angle θ<sub>3</sub> relative to link 2. Write x.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Elbow (0, 1.0); link 2 direction 0° ⇒ tip (0.7, 1.0), φ = 0°. 2) 1.7 m (θ<sub>2</sub> = 0°) and 0.3 m (θ<sub>2</sub> = 180°). 3) x = L<sub>1</sub>cos θ<sub>1</sub> + L<sub>2</sub>cos(θ<sub>1</sub> + θ<sub>2</sub>) + L<sub>3</sub>cos(θ<sub>1</sub> + θ<sub>2</sub> + θ<sub>3</sub>).</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 4 · Bài 4.2</span>
<h2>Động học thuận của tay máy phẳng hai khâu</h2>
<p class="lead"><strong>Động học thuận (FK)</strong> trả lời: <em>biết các góc khớp, đầu tay máy ở đâu?</em> Đây là chiều luôn dễ — một đáp án, tính bằng công thức — và mọi bộ điều khiển robot tính nó hàng trăm lần mỗi giây.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Lập phương trình động học thuận của tay máy phẳng 2R bằng lượng giác.</li><li>Ra cùng kết quả bằng cách nối chuỗi ma trận biến đổi thuần nhất.</li><li>Biết tên các phương pháp tổng quát: tham số Denavit–Hartenberg và công thức tích hàm mũ.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Xét tay máy phẳng có hai khớp quay. Khâu 1 dài L<sub>1</sub>, quay góc θ<sub>1</sub> so với trục x; khâu 2 dài L<sub>2</sub>, quay góc θ<sub>2</sub> <em>so với khâu 1</em>. Khuỷu nằm ở (L<sub>1</sub> cos θ<sub>1</sub>, L<sub>1</sub> sin θ<sub>1</sub>). Khâu 2 chỉ theo hướng tuyệt đối θ<sub>1</sub> + θ<sub>2</sub>, nên cộng thêm vectơ của nó là ra đầu tay:</p>
<div class="formula"><span class="lbl">Động học thuận tay máy 2R</span>x = L<sub>1</sub> cos θ<sub>1</sub> + L<sub>2</sub> cos(θ<sub>1</sub> + θ<sub>2</sub>)<br>y = L<sub>1</sub> sin θ<sub>1</sub> + L<sub>2</sub> sin(θ<sub>1</sub> + θ<sub>2</sub>)<br>φ = θ<sub>1</sub> + θ<sub>2</sub>   (hướng của tay gắp)</div>
<p>Cùng đáp án ấy cũng rút ra được từ bộ máy biến đổi ở Bài 3.3. Tại mỗi khớp ta quay θ<sub>i</sub>, rồi đi dọc khâu một đoạn L<sub>i</sub>:</p>
<div class="formula"><span class="lbl">Động học thuận = chuỗi biến đổi</span>T<sub>0,đầu</sub> = Rot(θ<sub>1</sub>)·Trans(L<sub>1</sub>, 0) · Rot(θ<sub>2</sub>)·Trans(L<sub>2</sub>, 0)</div>
<p>Cột tịnh tiến của T<sub>0,đầu</sub> là (x, y), khối quay là R(θ<sub>1</sub> + θ<sub>2</sub>). Cách nhìn “chuỗi” này mở rộng cho bao nhiêu khớp cũng được và cho cả 3D: tay máy thật 6 khớp được tính bằng đúng phép nhân các ma trận 4×4 như vậy. Sách đưa ra hai cách viết các ma trận đó có hệ thống: <strong>tham số Denavit–Hartenberg (DH)</strong> (bốn số mỗi khớp; Craig, Ch. 3) và công thức <strong>tích hàm mũ (PoE)</strong> (Lynch &amp; Park, Ch. 4). Bạn sẽ gặp chúng ở các môn robot sau; giờ thì nối Rot và Trans là đủ.</p>
<p>Để ý rằng động học thuận luôn có <strong>đúng một</strong> đáp án: mỗi bộ góc khớp đặt đầu tay vào một điểm duy nhất. Động học ngược (bài sau) mới là chiều khó.</p>
<h3>✍️ Ví dụ</h3>
<div class="callout"><p>L<sub>1</sub> = 1,0 m, L<sub>2</sub> = 0,7 m, θ<sub>1</sub> = 30°, θ<sub>2</sub> = 45°.</p>
<p>Bước 1: khuỷu = (1,0 cos 30°; 1,0 sin 30°) = (0,8660; 0,5000). Bước 2: hướng khâu 2 = 30° + 45° = 75°; vectơ khâu 2 = (0,7 cos 75°; 0,7 sin 75°) = (0,1812; 0,6761). Bước 3: đầu tay = <b>(1,0472; 1,1761)</b>, hướng tay gắp φ = <b>75°</b>.</p></div>
<pre><code class="language-python">import math
import numpy as np

L1, L2 = 1.0, 0.7          # link lengths (m)

def fk(theta1_deg, theta2_deg):
    t1, t2 = math.radians(theta1_deg), math.radians(theta2_deg)
    x = L1 * math.cos(t1) + L2 * math.cos(t1 + t2)
    y = L1 * math.sin(t1) + L2 * math.sin(t1 + t2)
    phi = theta1_deg + theta2_deg          # orientation of the gripper
    return round(x, 4) + 0.0, round(y, 4) + 0.0, phi

for q in [(0, 0), (90, 0), (30, 45), (45, -90), (0, 180)]:
    print("theta =", q, "-&gt; (x, y, phi) =", fk(*q))

# the same result by chaining homogeneous transforms
def T(theta_deg, length):
    t = math.radians(theta_deg); c, s = math.cos(t), math.sin(t)
    rot = np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])
    trans = np.array([[1, 0, length], [0, 1, 0], [0, 0, 1]])
    return rot @ trans          # rotate at the joint, then move along the link

T_total = T(30, L1) @ T(45, L2)
print("by transforms (30, 45):", np.round(T_total[:2, 2], 4))
</code></pre>
<div class="out">theta = (0, 0) -&gt; (x, y, phi) = (1.7, 0.0, 0)
theta = (90, 0) -&gt; (x, y, phi) = (0.0, 1.7, 90)
theta = (30, 45) -&gt; (x, y, phi) = (1.0472, 1.1761, 75)
theta = (45, -90) -&gt; (x, y, phi) = (1.2021, 0.2121, -45)
theta = (0, 180) -&gt; (x, y, phi) = (0.3, 0.0, 180)
by transforms (30, 45): [1.0472 1.1761]</div>
<p>Đọc các trường hợp đặc biệt: (0°, 0°) là tay duỗi thẳng theo trục x (với xa 1,7 m); (0°, 180°) gập khâu 2 ngược lên khâu 1 (với 0,3 m) — chính là mép trong và mép ngoài của vùng làm việc hình vành khăn ở Bài 4.1.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng cos θ<sub>2</sub> thay cho cos(θ<sub>1</sub> + θ<sub>2</sub>) cho khâu 2: θ<sub>2</sub> đo so với khâu 1, không phải so với trục x.</li><li>Quên đổi độ sang radian.</li><li>Nhân Trans trước Rot ở mỗi khớp (sai thứ tự) — khâu bị đặt ra trước khi được quay.</li><li>Bỏ qua giới hạn khớp: servo thật có thể chỉ quay ±150°, nên không phải tư thế nào tính ra cũng đạt được.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Động học thuận: góc khớp → tư thế khâu cuối; luôn một đáp án.</li><li>Tay 2R: x = L<sub>1</sub>cos θ<sub>1</sub> + L<sub>2</sub>cos(θ<sub>1</sub> + θ<sub>2</sub>), y tương tự với sin, φ = θ<sub>1</sub> + θ<sub>2</sub>.</li><li>Cách tổng quát: nhân một phép biến đổi cho mỗi khớp (Rot rồi Trans).</li><li>Quy ước có hệ thống: tham số DH (Craig) và tích hàm mũ (Lynch &amp; Park).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/4-1-1-product-of-exponentials-formula-in-the-space-frame/" target="_blank" rel="noopener">Modern Robotics — 4.1.1 Công thức tích hàm mũ (động học thuận)</a></li><li><a href="https://en.wikipedia.org/wiki/Forward_kinematics" target="_blank" rel="noopener">Wikipedia — Động học thuận</a></li><li><a href="https://en.wikipedia.org/wiki/Denavit%E2%80%93Hartenberg_parameters" target="_blank" rel="noopener">Wikipedia — Tham số Denavit–Hartenberg</a></li><li><a href="https://github.com/petercorke/robotics-toolbox-python" target="_blank" rel="noopener">Robotics Toolbox for Python (Peter Corke) — động học thuận cho mô hình robot thật</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với L<sub>1</sub> = 1,0, L<sub>2</sub> = 0,7, tính đầu tay khi θ<sub>1</sub> = 90°, θ<sub>2</sub> = −90°.</li><li>Cũng tay máy đó, khoảng cách lớn nhất và nhỏ nhất từ đầu tay tới gốc là bao nhiêu?</li><li>Tay máy phẳng 3R thêm khâu thứ ba L<sub>3</sub> với góc θ<sub>3</sub> so với khâu 2. Viết x.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Khuỷu (0; 1,0); hướng khâu 2 là 0° ⇒ đầu tay (0,7; 1,0), φ = 0°. 2) 1,7 m (θ<sub>2</sub> = 0°) và 0,3 m (θ<sub>2</sub> = 180°). 3) x = L<sub>1</sub>cos θ<sub>1</sub> + L<sub>2</sub>cos(θ<sub>1</sub> + θ<sub>2</sub>) + L<sub>3</sub>cos(θ<sub>1</sub> + θ<sub>2</sub> + θ<sub>3</sub>).</p></div>`);

const r43 = L('rai101-ts-4-3',
  '4.3 — Inverse kinematics: finding joint angles for a target|||4.3 — Động học ngược: tìm góc khớp cho một điểm đích',
  'Động học ngược tay máy 2R bằng định lý cos và atan2: hai nghiệm (khuỷu lên/khuỷu xuống), điểm ngoài vùng với tới, kỳ dị; giới thiệu IK số; code Python chạy thật kèm kiểm lại bằng động học thuận.',
  `<span class="eyebrow">RAI101 · Chapter 4 · Lesson 4.3</span>
<h2>Inverse kinematics: finding joint angles for a target</h2>
<p class="lead">A user does not say “set θ<sub>1</sub> = 30°, θ<sub>2</sub> = 45°”; they say “pick up the part at (1.05, 1.18)”. <strong>Inverse kinematics (IK)</strong> turns a desired end-effector position into joint angles. Unlike FK, IK may have <strong>two, many, or zero</strong> solutions.</p>
<h3>🎯 Objectives</h3>
<ul><li>Derive the closed-form IK of a planar 2R arm with the law of cosines and atan2.</li><li>Explain why there are two solutions (elbow-up / elbow-down) and when there are none.</li><li>Verify an IK solution by plugging it back into FK.</li><li>Know that general robots use numerical IK.</li></ul>
<h3>📖 Lecture</h3>
<p>Let the target be (x, y) and r<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup>. The base, elbow and tip form a triangle with sides L<sub>1</sub>, L<sub>2</sub> and r. The <strong>law of cosines</strong> gives the elbow angle directly:</p>
<div class="formula"><span class="lbl">Step 1 — elbow angle</span>cos θ<sub>2</sub> = (x<sup>2</sup> + y<sup>2</sup> − L<sub>1</sub><sup>2</sup> − L<sub>2</sub><sup>2</sup>) / (2 L<sub>1</sub> L<sub>2</sub>)    θ<sub>2</sub> = ± arccos(…)</div>
<p>If the right-hand side is greater than 1 or less than −1, the target is <strong>outside the workspace</strong> — no solution exists. Otherwise the ± gives two mirror-image solutions: one with the elbow bent one way, one with it bent the other way. Then the shoulder angle is the direction to the target minus the angle that link 2 adds:</p>
<div class="formula"><span class="lbl">Step 2 — shoulder angle</span>θ<sub>1</sub> = atan2(y, x) − atan2( L<sub>2</sub> sin θ<sub>2</sub>,  L<sub>1</sub> + L<sub>2</sub> cos θ<sub>2</sub> )</div>
<p>Special situations to recognise:</p>
<ul><li><strong>Two solutions</strong> for a typical point strictly inside the annulus.</li><li><strong>One solution</strong> on the boundary (r = L<sub>1</sub> + L<sub>2</sub> or |L<sub>1</sub> − L<sub>2</sub>|): the arm is fully stretched or fully folded. These are <strong>singular configurations</strong> — near them, a tiny movement of the tip needs huge joint speeds.</li><li><strong>Infinitely many</strong> solutions when L<sub>1</sub> = L<sub>2</sub> and the target is the base (θ<sub>1</sub> is free), or for redundant arms (7 DOF).</li></ul>
<p>Closed-form (“analytic”) IK exists for the 2R arm and for most 6-axis industrial arms with special wrist geometry. For general robots, <strong>numerical IK</strong> is used: start from a guess and repeatedly correct the joints using the Jacobian (Newton–Raphson, Lynch &amp; Park §6.2). Libraries such as MoveIt (Chapter 10) do this for you.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p>L<sub>1</sub> = 1.0, L<sub>2</sub> = 0.7. Target (1.0472, 1.1761) — the point computed by FK for (30°, 45°) in Lesson 4.2.</p>
<p>Step 1: r<sup>2</sup> = 1.0967 + 1.3832 = 2.4799; cos θ<sub>2</sub> = (2.4799 − 1 − 0.49)/1.4 = 0.7071 ⇒ θ<sub>2</sub> = ±45°. Step 2 (θ<sub>2</sub> = +45°): atan2(1.1761, 1.0472) = 48.32°; atan2(0.7 sin 45°, 1 + 0.7 cos 45°) = atan2(0.4950, 1.4950) = 18.32°; θ<sub>1</sub> = <b>30°</b>. Step 2 (θ<sub>2</sub> = −45°): θ<sub>1</sub> = 48.32° + 18.32° = <b>66.64°</b>. Both satisfy FK.</p></div>
<pre><code class="language-python">import math

L1, L2 = 1.0, 0.7

def fk(t1, t2):
    return (L1 * math.cos(t1) + L2 * math.cos(t1 + t2),
            L1 * math.sin(t1) + L2 * math.sin(t1 + t2))

def ik(x, y):
    """Return all (theta1, theta2) in radians that put the tip at (x, y)."""
    c2 = (x**2 + y**2 - L1**2 - L2**2) / (2 * L1 * L2)
    if abs(c2) &gt; 1:
        return []                      # target outside the workspace
    sols = []
    for sign in (+1, -1):              # two elbow configurations
        t2 = sign * math.acos(c2)
        t1 = math.atan2(y, x) - math.atan2(L2 * math.sin(t2), L1 + L2 * math.cos(t2))
        sols.append((t1, t2))
    return sols

def deg(q):
    return tuple(round(math.degrees(a), 2) + 0.0 for a in q)

target = fk(math.radians(30), math.radians(45))   # a point we know is reachable
print("target:", (round(target[0], 4), round(target[1], 4)))
for q in ik(*target):
    x, y = fk(*q)
    print("solution", deg(q), "-&gt; FK check", (round(x, 4), round(y, 4)))

print("target (2.0, 0.5):", ik(2.0, 0.5))
print("target (1.7, 0.0):", [deg(q) for q in ik(1.7, 0.0)])
</code></pre>
<div class="out">target: (1.0472, 1.1761)
solution (30.0, 45.0) -&gt; FK check (1.0472, 1.1761)
solution (66.64, -45.0) -&gt; FK check (1.0472, 1.1761)
target (2.0, 0.5): []
target (1.7, 0.0): [(0.0, 0.0), (0.0, 0.0)]</div>
<p>The point (2.0, 0.5) is at distance ≈ 2.06 m &gt; 1.7 m, so the list is empty. The point (1.7, 0) is on the outer boundary: both “solutions” collapse into the single stretched configuration — a singularity.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Calling math.acos on a value slightly above 1 because of rounding — clamp or check first.</li><li>Using atan instead of atan2 for θ<sub>1</sub> (wrong quadrant for targets with x &lt; 0).</li><li>Returning only one solution: the robot may then choose a pose that hits an obstacle when the other elbow would not.</li><li>Not checking joint limits after solving.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>IK: desired pose → joint angles; 0, 1, 2 or infinitely many solutions.</li><li>2R arm: cos θ<sub>2</sub> by the law of cosines, θ<sub>1</sub> by two atan2 calls.</li><li>|cos θ<sub>2</sub>| &gt; 1 ⇒ unreachable; on the boundary ⇒ singular.</li><li>Always verify with FK; general robots use numerical IK.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/6-2-numerical-inverse-kinematics-part-1-of-2/" target="_blank" rel="noopener">Modern Robotics — 6.2 Numerical inverse kinematics</a></li><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/5-3-singularities/" target="_blank" rel="noopener">Modern Robotics — 5.3 Singularities</a></li><li><a href="https://en.wikipedia.org/wiki/Inverse_kinematics" target="_blank" rel="noopener">Wikipedia — Inverse kinematics</a></li><li><a href="https://www.coursera.org/learn/modernrobotics-course2" target="_blank" rel="noopener">Coursera — Modern Robotics, Course 2: Robot Kinematics (Northwestern)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>For L<sub>1</sub> = L<sub>2</sub> = 1, find both IK solutions for the target (1, 1).</li><li>Is the target (0.2, 0) reachable by the arm L<sub>1</sub> = 1.0, L<sub>2</sub> = 0.7?</li><li>Why can a 2R arm not choose the gripper orientation φ independently of its position?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) cos θ<sub>2</sub> = (2 − 2)/2 = 0 ⇒ θ<sub>2</sub> = ±90°. For +90°: θ<sub>1</sub> = 45° − atan2(1, 1) = 0°. For −90°: θ<sub>1</sub> = 45° + 45° = 90°. Check: (0°, 90°) gives (1, 1); (90°, −90°) gives (1, 1). 2) No: r = 0.2 &lt; |1.0 − 0.7| = 0.3. 3) It has only 2 DOF; a planar pose (x, y, φ) needs 3, so φ = θ<sub>1</sub> + θ<sub>2</sub> is fixed once (x, y) and the elbow choice are fixed.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 4 · Bài 4.3</span>
<h2>Động học ngược: tìm góc khớp cho một điểm đích</h2>
<p class="lead">Người dùng không nói “đặt θ<sub>1</sub> = 30°, θ<sub>2</sub> = 45°”; họ nói “gắp chi tiết ở (1,05; 1,18)”. <strong>Động học ngược (IK)</strong> biến vị trí mong muốn của khâu cuối thành góc khớp. Khác với động học thuận, IK có thể có <strong>hai, vô số, hoặc không có</strong> nghiệm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Lập nghiệm dạng đóng của IK tay máy phẳng 2R bằng định lý cos và atan2.</li><li>Giải thích vì sao có hai nghiệm (khuỷu lên / khuỷu xuống) và khi nào không có nghiệm.</li><li>Kiểm một nghiệm IK bằng cách thế lại vào động học thuận.</li><li>Biết rằng robot tổng quát dùng IK số.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Gọi đích là (x, y) và r<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup>. Gốc, khuỷu và đầu tay tạo thành tam giác có các cạnh L<sub>1</sub>, L<sub>2</sub> và r. <strong>Định lý cos</strong> cho ngay góc khuỷu:</p>
<div class="formula"><span class="lbl">Bước 1 — góc khuỷu</span>cos θ<sub>2</sub> = (x<sup>2</sup> + y<sup>2</sup> − L<sub>1</sub><sup>2</sup> − L<sub>2</sub><sup>2</sup>) / (2 L<sub>1</sub> L<sub>2</sub>)    θ<sub>2</sub> = ± arccos(…)</div>
<p>Nếu vế phải lớn hơn 1 hoặc nhỏ hơn −1, đích nằm <strong>ngoài vùng làm việc</strong> — không có nghiệm. Ngược lại, dấu ± cho hai nghiệm đối xứng gương: khuỷu gập về một phía hoặc phía kia. Sau đó góc vai bằng hướng tới đích trừ đi góc mà khâu 2 góp thêm:</p>
<div class="formula"><span class="lbl">Bước 2 — góc vai</span>θ<sub>1</sub> = atan2(y, x) − atan2( L<sub>2</sub> sin θ<sub>2</sub>,  L<sub>1</sub> + L<sub>2</sub> cos θ<sub>2</sub> )</div>
<p>Những tình huống đặc biệt cần nhận ra:</p>
<ul><li><strong>Hai nghiệm</strong> với điểm thông thường nằm hẳn bên trong vành khăn.</li><li><strong>Một nghiệm</strong> trên biên (r = L<sub>1</sub> + L<sub>2</sub> hoặc |L<sub>1</sub> − L<sub>2</sub>|): tay duỗi thẳng hoặc gập hẳn. Đó là các <strong>cấu hình kỳ dị</strong> — gần chúng, đầu tay chỉ nhích một chút cũng cần vận tốc khớp rất lớn.</li><li><strong>Vô số nghiệm</strong> khi L<sub>1</sub> = L<sub>2</sub> và đích là gốc (θ<sub>1</sub> tuỳ ý), hoặc với tay máy dư bậc (7 bậc tự do).</li></ul>
<p>IK dạng đóng (“giải tích”) tồn tại cho tay 2R và cho phần lớn tay máy công nghiệp 6 trục có cổ tay đặc biệt. Với robot tổng quát người ta dùng <strong>IK số</strong>: bắt đầu từ một phỏng đoán rồi sửa dần góc khớp nhờ ma trận Jacobi (Newton–Raphson, Lynch &amp; Park §6.2). Các thư viện như MoveIt (Chương 10) làm việc này giúp bạn.</p>
<h3>✍️ Ví dụ</h3>
<div class="callout"><p>L<sub>1</sub> = 1,0, L<sub>2</sub> = 0,7. Đích (1,0472; 1,1761) — điểm mà động học thuận tính được cho (30°, 45°) ở Bài 4.2.</p>
<p>Bước 1: r<sup>2</sup> = 1,0967 + 1,3832 = 2,4799; cos θ<sub>2</sub> = (2,4799 − 1 − 0,49)/1,4 = 0,7071 ⇒ θ<sub>2</sub> = ±45°. Bước 2 (θ<sub>2</sub> = +45°): atan2(1,1761; 1,0472) = 48,32°; atan2(0,7 sin 45°; 1 + 0,7 cos 45°) = atan2(0,4950; 1,4950) = 18,32°; θ<sub>1</sub> = <b>30°</b>. Bước 2 (θ<sub>2</sub> = −45°): θ<sub>1</sub> = 48,32° + 18,32° = <b>66,64°</b>. Cả hai đều thoả động học thuận.</p></div>
<pre><code class="language-python">import math

L1, L2 = 1.0, 0.7

def fk(t1, t2):
    return (L1 * math.cos(t1) + L2 * math.cos(t1 + t2),
            L1 * math.sin(t1) + L2 * math.sin(t1 + t2))

def ik(x, y):
    """Return all (theta1, theta2) in radians that put the tip at (x, y)."""
    c2 = (x**2 + y**2 - L1**2 - L2**2) / (2 * L1 * L2)
    if abs(c2) &gt; 1:
        return []                      # target outside the workspace
    sols = []
    for sign in (+1, -1):              # two elbow configurations
        t2 = sign * math.acos(c2)
        t1 = math.atan2(y, x) - math.atan2(L2 * math.sin(t2), L1 + L2 * math.cos(t2))
        sols.append((t1, t2))
    return sols

def deg(q):
    return tuple(round(math.degrees(a), 2) + 0.0 for a in q)

target = fk(math.radians(30), math.radians(45))   # a point we know is reachable
print("target:", (round(target[0], 4), round(target[1], 4)))
for q in ik(*target):
    x, y = fk(*q)
    print("solution", deg(q), "-&gt; FK check", (round(x, 4), round(y, 4)))

print("target (2.0, 0.5):", ik(2.0, 0.5))
print("target (1.7, 0.0):", [deg(q) for q in ik(1.7, 0.0)])
</code></pre>
<div class="out">target: (1.0472, 1.1761)
solution (30.0, 45.0) -&gt; FK check (1.0472, 1.1761)
solution (66.64, -45.0) -&gt; FK check (1.0472, 1.1761)
target (2.0, 0.5): []
target (1.7, 0.0): [(0.0, 0.0), (0.0, 0.0)]</div>
<p>Điểm (2,0; 0,5) cách gốc ≈ 2,06 m &gt; 1,7 m nên danh sách rỗng. Điểm (1,7; 0) nằm trên biên ngoài: hai “nghiệm” chập lại thành một cấu hình duỗi thẳng — một điểm kỳ dị.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Gọi math.acos với giá trị nhỉnh hơn 1 một chút do làm tròn — phải kẹp hoặc kiểm trước.</li><li>Dùng atan thay atan2 cho θ<sub>1</sub> (sai góc phần tư khi đích có x &lt; 0).</li><li>Chỉ trả một nghiệm: robot có thể chọn tư thế đâm vào vật cản trong khi nghiệm khuỷu kia thì không.</li><li>Không kiểm giới hạn khớp sau khi giải.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>IK: tư thế mong muốn → góc khớp; có 0, 1, 2 hoặc vô số nghiệm.</li><li>Tay 2R: cos θ<sub>2</sub> theo định lý cos, θ<sub>1</sub> bằng hai lần atan2.</li><li>|cos θ<sub>2</sub>| &gt; 1 ⇒ không với tới; trên biên ⇒ kỳ dị.</li><li>Luôn kiểm lại bằng động học thuận; robot tổng quát dùng IK số.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/6-2-numerical-inverse-kinematics-part-1-of-2/" target="_blank" rel="noopener">Modern Robotics — 6.2 Động học ngược bằng phương pháp số</a></li><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/5-3-singularities/" target="_blank" rel="noopener">Modern Robotics — 5.3 Điểm kỳ dị</a></li><li><a href="https://en.wikipedia.org/wiki/Inverse_kinematics" target="_blank" rel="noopener">Wikipedia — Động học ngược</a></li><li><a href="https://www.coursera.org/learn/modernrobotics-course2" target="_blank" rel="noopener">Coursera — Modern Robotics, Course 2: Robot Kinematics (Northwestern)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với L<sub>1</sub> = L<sub>2</sub> = 1, tìm cả hai nghiệm IK cho đích (1, 1).</li><li>Tay máy L<sub>1</sub> = 1,0, L<sub>2</sub> = 0,7 có với tới đích (0,2; 0) không?</li><li>Vì sao tay 2R không thể chọn hướng tay gắp φ độc lập với vị trí?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) cos θ<sub>2</sub> = (2 − 2)/2 = 0 ⇒ θ<sub>2</sub> = ±90°. Với +90°: θ<sub>1</sub> = 45° − atan2(1, 1) = 0°. Với −90°: θ<sub>1</sub> = 45° + 45° = 90°. Kiểm: (0°, 90°) cho (1, 1); (90°, −90°) cho (1, 1). 2) Không: r = 0,2 &lt; |1,0 − 0,7| = 0,3. 3) Nó chỉ có 2 bậc tự do; tư thế phẳng (x, y, φ) cần 3, nên khi đã cố định (x, y) và chọn khuỷu thì φ = θ<sub>1</sub> + θ<sub>2</sub> cũng bị cố định.</p></div>`);

const r44 = L('rai101-ts-4-4',
  '4.4 — Mobile robot kinematics: differential drive and odometry|||4.4 — Động học robot di động: dẫn động vi sai và odometry',
  'Mô hình robot hai bánh vi sai: vận tốc thẳng v và vận tốc góc ω từ tốc độ bánh, ràng buộc không trượt ngang (nonholonomic), odometry từ encoder và sai số tích luỹ; code Python chạy thật.',
  `<span class="eyebrow">RAI101 · Chapter 4 · Lesson 4.4</span>
<h2>Mobile robot kinematics: differential drive and odometry</h2>
<p class="lead">Most indoor robots — robot vacuums, warehouse carts, the TurtleBot used in ROS courses — move with two independently driven wheels and a caster. This <strong>differential drive</strong> is the simplest useful mobile robot, and its kinematics is the starting point for navigation.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the robot's forward speed v and turn rate ω from its wheel speeds.</li><li>Explain the nonholonomic (no sideways slip) constraint.</li><li>Update the pose (x, y, θ) from encoder ticks — odometry.</li><li>Explain why odometry drifts and needs correction.</li></ul>
<h3>📖 Lecture</h3>
<p>The pose of a planar mobile robot is q = (x, y, θ): 3 numbers, so its C-space is 3-dimensional. Let the wheels have radius r, be separated by a distance b (the track width), and spin at angular speeds ω<sub>L</sub> and ω<sub>R</sub> (rad/s). Each wheel's rim moves at r·ω. The robot's centre moves at the average of the two, and the difference makes it turn:</p>
<div class="formula"><span class="lbl">Differential drive</span>v = r (ω<sub>R</sub> + ω<sub>L</sub>) / 2        ω = r (ω<sub>R</sub> − ω<sub>L</sub>) / b<br>ẋ = v cos θ    ẏ = v sin θ    θ̇ = ω</div>
<p>Three cases cover the intuition: equal speeds ⇒ straight line (ω = 0); opposite speeds ⇒ spin in place (v = 0); different speeds ⇒ an arc of radius R = v/ω.</p>
<p>The equations contain no sideways velocity: the wheels roll but do not slide sideways. This is a <strong>nonholonomic constraint</strong> (Lynch &amp; Park §13.3): the robot can <em>reach</em> any (x, y, θ), but it cannot move directly sideways — parallel parking needs a sequence of manoeuvres. A car has the same property; an omnidirectional robot with mecanum wheels does not.</p>
<p><strong>Odometry</strong> estimates the pose by integrating wheel motion measured by encoders. If an encoder counts N ticks per revolution and reports Δn ticks since the last update, that wheel rolled Δd = 2πr·Δn/N. Then:</p>
<div class="formula"><span class="lbl">Odometry update</span>Δs = (Δd<sub>R</sub> + Δd<sub>L</sub>) / 2      Δθ = (Δd<sub>R</sub> − Δd<sub>L</sub>) / b<br>x ← x + Δs cos(θ + Δθ/2)    y ← y + Δs sin(θ + Δθ/2)    θ ← θ + Δθ</div>
<p>Using the mid-step heading θ + Δθ/2 is a simple, accurate approximation for short steps. Odometry is <strong>dead reckoning</strong>: every small error (wheel slip, uneven floor, a slightly wrong r or b) is added up forever, so the estimate <strong>drifts</strong>. Real robots correct it with other sensors — IMU, lidar scan matching, cameras — the localization topic of Chapter 9.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p>A small robot: r = 0.033 m, b = 0.160 m, 4096 ticks/revolution.</p>
<p>(a) Both wheels at 10 rad/s: v = 0.033·20/2 = <b>0.33 m/s</b>, ω = 0. (b) Left −5, right +5 rad/s: v = 0, ω = 0.033·10/0.16 = <b>2.0625 rad/s</b> (spin in place). (c) Left 8, right 10: v = 0.297 m/s, ω = 0.4125 rad/s ⇒ arc radius 0.72 m. (d) Odometry: 1000 ticks = 2π·0.033·1000/4096 ≈ 0.0506 m. Drive 5 steps straight, 2 steps spinning, 5 steps straight:</p></div>
<pre><code class="language-python">import math

r = 0.033      # wheel radius (m)
b = 0.160      # distance between the two wheels (m)
TICKS = 4096   # encoder ticks per wheel revolution

def body_velocity(wL, wR):
    """wheel speeds (rad/s) -&gt; forward speed v (m/s), turn rate w (rad/s)"""
    v = r * (wR + wL) / 2
    w = r * (wR - wL) / b
    return v, w

print("both wheels 10 rad/s :", body_velocity(10, 10))
print("left -5, right +5    :", tuple(round(a, 4) for a in body_velocity(-5, 5)))
print("left 8, right 10     :", tuple(round(a, 4) for a in body_velocity(8, 10)))

def odometry(pose, dticks_L, dticks_R):
    """update (x, y, theta) from encoder tick increments"""
    x, y, th = pose
    dL = 2 * math.pi * r * dticks_L / TICKS     # distance rolled by left wheel
    dR = 2 * math.pi * r * dticks_R / TICKS
    ds = (dL + dR) / 2
    dth = (dR - dL) / b
    x += ds * math.cos(th + dth / 2)            # midpoint heading
    y += ds * math.sin(th + dth / 2)
    return (x, y, th + dth)

pose = (0.0, 0.0, 0.0)
steps = [(1000, 1000)] * 5 + [(-500, 500)] * 2 + [(1000, 1000)] * 5
for dl, dr in steps:
    pose = odometry(pose, dl, dr)
x, y, th = pose
print("final pose: x = %.3f m, y = %.3f m, theta = %.1f deg" % (x, y, math.degrees(th)))
</code></pre>
<div class="out">both wheels 10 rad/s : (0.33, 0.0)
left -5, right +5    : (0.0, 2.0625)
left 8, right 10     : (0.297, 0.4125)
final pose: x = 0.457 m, y = 0.150 m, theta = 36.3 deg</div>
<p>Check by hand: 5 straight steps ≈ 0.253 m along x; each spin step turns 0.0506/0.16 ≈ 0.316 rad ≈ 18.1°, so two steps ≈ 36.3°; the last 0.253 m at 36.3° adds (0.204, 0.150).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the wheel radius where the diameter is needed (or vice versa) — a factor-2 error in every distance.</li><li>Dividing by b/2 instead of b in ω (depends on how b is defined — always check: b is the full distance between wheels here).</li><li>Treating odometry as ground truth; after a few metres it can be off by many centimetres.</li><li>Forgetting to wrap θ into (−π, π] when comparing headings.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Pose (x, y, θ): 3 DOF; differential drive has only 2 inputs.</li><li>v = r(ω<sub>R</sub> + ω<sub>L</sub>)/2, ω = r(ω<sub>R</sub> − ω<sub>L</sub>)/b.</li><li>No sideways slip ⇒ nonholonomic, but every pose is still reachable.</li><li>Odometry integrates encoder ticks; it drifts and must be fused with other sensors.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/13-3-1-modeling-of-nonholonomic-wheeled-mobile-robots/" target="_blank" rel="noopener">Modern Robotics — 13.3.1 Modeling of nonholonomic wheeled mobile robots</a></li><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/13-4-odometry/" target="_blank" rel="noopener">Modern Robotics — 13.4 Odometry</a></li><li><a href="https://en.wikipedia.org/wiki/Differential_wheeled_robot" target="_blank" rel="noopener">Wikipedia — Differential wheeled robot</a></li><li><a href="https://en.wikipedia.org/wiki/Dead_reckoning" target="_blank" rel="noopener">Wikipedia — Dead reckoning</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>With r = 0.05 m and b = 0.30 m, the wheels turn at ω<sub>L</sub> = 4, ω<sub>R</sub> = 6 rad/s. Find v, ω and the turning radius.</li><li>Which wheel speeds make the robot spin in place at 1 rad/s (same r, b)?</li><li>An encoder has 1024 ticks/rev and r = 0.05 m. How far has the wheel rolled after 512 ticks?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) v = 0.05·10/2 = 0.25 m/s; ω = 0.05·2/0.30 ≈ 0.333 rad/s; R = v/ω = 0.75 m. 2) Need v = 0 ⇒ ω<sub>L</sub> = −ω<sub>R</sub>; ω = 0.05·2ω<sub>R</sub>/0.30 = 1 ⇒ ω<sub>R</sub> = 3 rad/s, ω<sub>L</sub> = −3 rad/s. 3) Half a turn: π·0.05 ≈ 0.157 m.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 4 · Bài 4.4</span>
<h2>Động học robot di động: dẫn động vi sai và odometry</h2>
<p class="lead">Phần lớn robot trong nhà — robot hút bụi, xe kho hàng, TurtleBot dùng trong các khoá ROS — di chuyển bằng hai bánh dẫn động độc lập và một bánh tự lựa. Kiểu <strong>dẫn động vi sai</strong> này là robot di động hữu ích đơn giản nhất, và động học của nó là điểm xuất phát cho bài toán dẫn đường.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính vận tốc tiến v và vận tốc quay ω của robot từ tốc độ bánh.</li><li>Giải thích ràng buộc nonholonomic (không trượt ngang).</li><li>Cập nhật tư thế (x, y, θ) từ số xung encoder — odometry.</li><li>Giải thích vì sao odometry bị trôi và cần hiệu chỉnh.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Tư thế của robot di động phẳng là q = (x, y, θ): 3 số, nên C-space có 3 chiều. Giả sử bánh có bán kính r, hai bánh cách nhau b (bề rộng vệt bánh), quay với vận tốc góc ω<sub>L</sub> và ω<sub>R</sub> (rad/s). Mép mỗi bánh chạy với tốc độ r·ω. Tâm robot đi với tốc độ trung bình của hai bánh, còn hiệu hai tốc độ làm robot quay:</p>
<div class="formula"><span class="lbl">Dẫn động vi sai</span>v = r (ω<sub>R</sub> + ω<sub>L</sub>) / 2        ω = r (ω<sub>R</sub> − ω<sub>L</sub>) / b<br>ẋ = v cos θ    ẏ = v sin θ    θ̇ = ω</div>
<p>Ba trường hợp cho trực giác: hai bánh cùng tốc độ ⇒ đi thẳng (ω = 0); ngược tốc độ ⇒ quay tại chỗ (v = 0); khác tốc độ ⇒ đi theo cung tròn bán kính R = v/ω.</p>
<p>Phương trình không có vận tốc ngang: bánh lăn nhưng không trượt sang bên. Đó là <strong>ràng buộc nonholonomic</strong> (Lynch &amp; Park §13.3): robot vẫn <em>đến được</em> mọi (x, y, θ), nhưng không thể đi ngang trực tiếp — muốn đỗ xe song song phải làm một chuỗi thao tác. Ô tô cũng vậy; còn robot đa hướng dùng bánh mecanum thì không.</p>
<p><strong>Odometry</strong> ước lượng tư thế bằng cách cộng dồn chuyển động bánh đo bởi encoder. Nếu encoder đếm N xung mỗi vòng và báo Δn xung từ lần cập nhật trước, bánh đó đã lăn Δd = 2πr·Δn/N. Khi đó:</p>
<div class="formula"><span class="lbl">Cập nhật odometry</span>Δs = (Δd<sub>R</sub> + Δd<sub>L</sub>) / 2      Δθ = (Δd<sub>R</sub> − Δd<sub>L</sub>) / b<br>x ← x + Δs cos(θ + Δθ/2)    y ← y + Δs sin(θ + Δθ/2)    θ ← θ + Δθ</div>
<p>Dùng hướng giữa bước θ + Δθ/2 là phép xấp xỉ đơn giản mà chính xác cho bước ngắn. Odometry là <strong>dự đoán vị trí theo quán tính (dead reckoning)</strong>: mọi sai số nhỏ (bánh trượt, sàn gồ ghề, r hay b hơi sai) bị cộng dồn mãi, nên ước lượng bị <strong>trôi</strong>. Robot thật hiệu chỉnh bằng cảm biến khác — IMU, khớp quét lidar, camera — chủ đề định vị ở Chương 9.</p>
<h3>✍️ Ví dụ</h3>
<div class="callout"><p>Một robot nhỏ: r = 0,033 m, b = 0,160 m, encoder 4096 xung/vòng.</p>
<p>(a) Hai bánh cùng 10 rad/s: v = 0,033·20/2 = <b>0,33 m/s</b>, ω = 0. (b) Trái −5, phải +5 rad/s: v = 0, ω = 0,033·10/0,16 = <b>2,0625 rad/s</b> (quay tại chỗ). (c) Trái 8, phải 10: v = 0,297 m/s, ω = 0,4125 rad/s ⇒ bán kính cung 0,72 m. (d) Odometry: 1000 xung = 2π·0,033·1000/4096 ≈ 0,0506 m. Chạy thẳng 5 bước, quay 2 bước, chạy thẳng 5 bước:</p></div>
<pre><code class="language-python">import math

r = 0.033      # wheel radius (m)
b = 0.160      # distance between the two wheels (m)
TICKS = 4096   # encoder ticks per wheel revolution

def body_velocity(wL, wR):
    """wheel speeds (rad/s) -&gt; forward speed v (m/s), turn rate w (rad/s)"""
    v = r * (wR + wL) / 2
    w = r * (wR - wL) / b
    return v, w

print("both wheels 10 rad/s :", body_velocity(10, 10))
print("left -5, right +5    :", tuple(round(a, 4) for a in body_velocity(-5, 5)))
print("left 8, right 10     :", tuple(round(a, 4) for a in body_velocity(8, 10)))

def odometry(pose, dticks_L, dticks_R):
    """update (x, y, theta) from encoder tick increments"""
    x, y, th = pose
    dL = 2 * math.pi * r * dticks_L / TICKS     # distance rolled by left wheel
    dR = 2 * math.pi * r * dticks_R / TICKS
    ds = (dL + dR) / 2
    dth = (dR - dL) / b
    x += ds * math.cos(th + dth / 2)            # midpoint heading
    y += ds * math.sin(th + dth / 2)
    return (x, y, th + dth)

pose = (0.0, 0.0, 0.0)
steps = [(1000, 1000)] * 5 + [(-500, 500)] * 2 + [(1000, 1000)] * 5
for dl, dr in steps:
    pose = odometry(pose, dl, dr)
x, y, th = pose
print("final pose: x = %.3f m, y = %.3f m, theta = %.1f deg" % (x, y, math.degrees(th)))
</code></pre>
<div class="out">both wheels 10 rad/s : (0.33, 0.0)
left -5, right +5    : (0.0, 2.0625)
left 8, right 10     : (0.297, 0.4125)
final pose: x = 0.457 m, y = 0.150 m, theta = 36.3 deg</div>
<p>Kiểm tay: 5 bước thẳng ≈ 0,253 m theo x; mỗi bước quay được 0,0506/0,16 ≈ 0,316 rad ≈ 18,1°, hai bước ≈ 36,3°; đoạn 0,253 m cuối ở hướng 36,3° cộng thêm (0,204; 0,150).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng bán kính bánh ở chỗ cần đường kính (hoặc ngược lại) — sai gấp đôi mọi quãng đường.</li><li>Chia cho b/2 thay vì b trong ω (tuỳ cách định nghĩa b — luôn kiểm: ở đây b là khoảng cách đầy đủ giữa hai bánh).</li><li>Coi odometry là sự thật; sau vài mét nó có thể lệch nhiều xentimét.</li><li>Quên đưa θ về khoảng (−π, π] khi so sánh hướng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tư thế (x, y, θ): 3 bậc tự do; dẫn động vi sai chỉ có 2 đầu vào.</li><li>v = r(ω<sub>R</sub> + ω<sub>L</sub>)/2, ω = r(ω<sub>R</sub> − ω<sub>L</sub>)/b.</li><li>Không trượt ngang ⇒ nonholonomic, nhưng vẫn đến được mọi tư thế.</li><li>Odometry cộng dồn xung encoder; nó bị trôi và phải kết hợp với cảm biến khác.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/13-3-1-modeling-of-nonholonomic-wheeled-mobile-robots/" target="_blank" rel="noopener">Modern Robotics — 13.3.1 Mô hình robot bánh xe nonholonomic</a></li><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/13-4-odometry/" target="_blank" rel="noopener">Modern Robotics — 13.4 Odometry</a></li><li><a href="https://en.wikipedia.org/wiki/Differential_wheeled_robot" target="_blank" rel="noopener">Wikipedia — Robot bánh xe vi sai</a></li><li><a href="https://en.wikipedia.org/wiki/Dead_reckoning" target="_blank" rel="noopener">Wikipedia — Dead reckoning (dự đoán vị trí theo quán tính)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với r = 0,05 m và b = 0,30 m, hai bánh quay ω<sub>L</sub> = 4, ω<sub>R</sub> = 6 rad/s. Tính v, ω và bán kính quay.</li><li>Tốc độ bánh nào làm robot quay tại chỗ với 1 rad/s (cùng r, b)?</li><li>Encoder 1024 xung/vòng, r = 0,05 m. Sau 512 xung bánh lăn được bao xa?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) v = 0,05·10/2 = 0,25 m/s; ω = 0,05·2/0,30 ≈ 0,333 rad/s; R = v/ω = 0,75 m. 2) Cần v = 0 ⇒ ω<sub>L</sub> = −ω<sub>R</sub>; ω = 0,05·2ω<sub>R</sub>/0,30 = 1 ⇒ ω<sub>R</sub> = 3 rad/s, ω<sub>L</sub> = −3 rad/s. 3) Nửa vòng: π·0,05 ≈ 0,157 m.</p></div>`);

const q4 = QZ(4, 'Quiz — Chapter 4: Kinematics|||Quiz — Chương 4: Động học', 'Kiểm tra chương 4: bậc tự do, Grübler, không gian làm việc, động học thuận/ngược tay máy 2R, dẫn động vi sai và odometry.', [
  Q('q1', 'How many degrees of freedom does a rigid body moving freely in 3D space have?|||Vật rắn chuyển động tự do trong không gian 3D có bao nhiêu bậc tự do?',
    ['3|||3', '4|||4', '6|||6', '9|||9'], 2,
    '3 for position + 3 for orientation.|||3 cho vị trí + 3 cho hướng.'),
  Q('q2', 'Grübler for a planar four-bar linkage (N = 4, J = 4 revolute joints) gives|||Grübler cho cơ cấu bốn khâu phẳng (N = 4, J = 4 khớp quay) cho',
    ['0|||0', '1|||1', '2|||2', '4|||4'], 1,
    '3(4 − 1 − 4) + 4 = 1.|||3(4 − 1 − 4) + 4 = 1.'),
  Q('q3', 'A planar 2R arm with L1 = 1.0 m, L2 = 0.7 m (no joint limits) can reach points at distance r from the base with|||Tay máy phẳng 2R có L1 = 1,0 m, L2 = 0,7 m (không giới hạn khớp) với tới các điểm cách gốc r thoả',
    ['0 ≤ r ≤ 1.7|||0 ≤ r ≤ 1,7', '0.3 ≤ r ≤ 1.7|||0,3 ≤ r ≤ 1,7', '0.7 ≤ r ≤ 1.0|||0,7 ≤ r ≤ 1,0', 'r = 1.7 only|||chỉ r = 1,7'], 1,
    'Annulus |L1 − L2| ≤ r ≤ L1 + L2.|||Vành khăn |L1 − L2| ≤ r ≤ L1 + L2.'),
  Q('q4', 'For the 2R arm, the x-coordinate of the tip is|||Với tay 2R, toạ độ x của đầu tay là',
    ['L1 cos θ1 + L2 cos θ2|||L1 cos θ1 + L2 cos θ2', 'L1 cos θ1 + L2 cos(θ1 + θ2)|||L1 cos θ1 + L2 cos(θ1 + θ2)', '(L1 + L2) cos(θ1 + θ2)|||(L1 + L2) cos(θ1 + θ2)', 'L1 sin θ1 + L2 sin(θ1 + θ2)|||L1 sin θ1 + L2 sin(θ1 + θ2)'], 1,
    'θ2 is measured relative to link 1, so link 2 points at θ1 + θ2.|||θ2 đo so với khâu 1, nên khâu 2 chỉ theo θ1 + θ2.'),
  Q('q5', 'With L1 = 1.0, L2 = 0.7, θ1 = 30°, θ2 = 45°, the tip is at about|||Với L1 = 1,0, L2 = 0,7, θ1 = 30°, θ2 = 45°, đầu tay ở khoảng',
    ['(1.047, 1.176)|||(1,047; 1,176)', '(1.366, 0.866)|||(1,366; 0,866)', '(0.866, 0.500)|||(0,866; 0,500)', '(1.700, 0.000)|||(1,700; 0,000)'], 0,
    'Elbow (0.866, 0.5) + 0.7·(cos 75°, sin 75°) = (1.0472, 1.1761).|||Khuỷu (0,866; 0,5) + 0,7·(cos 75°, sin 75°) = (1,0472; 1,1761).'),
  Q('q6', 'In the 2R inverse kinematics, (x² + y² − L1² − L2²)/(2L1L2) = 1.3. This means|||Trong IK tay 2R, (x² + y² − L1² − L2²)/(2L1L2) = 1,3. Điều này nghĩa là',
    ['two solutions|||có hai nghiệm', 'one singular solution|||một nghiệm kỳ dị', 'the target is outside the workspace|||đích nằm ngoài vùng làm việc', 'infinitely many solutions|||vô số nghiệm'], 2,
    'cos θ2 cannot exceed 1.|||cos θ2 không thể lớn hơn 1.'),
  Q('q7', 'A target strictly inside the 2R workspace usually has|||Một đích nằm hẳn bên trong vùng làm việc của tay 2R thường có',
    ['no IK solution|||không có nghiệm IK', 'exactly one IK solution|||đúng một nghiệm IK', 'two IK solutions (elbow-up and elbow-down)|||hai nghiệm IK (khuỷu lên và khuỷu xuống)', 'four IK solutions|||bốn nghiệm IK'], 2,
    'θ2 = ± arccos(…) gives two mirror configurations.|||θ2 = ± arccos(…) cho hai cấu hình đối xứng gương.'),
  Q('q8', 'A differential-drive robot has r = 0.033 m, b = 0.16 m. Left wheel −5 rad/s, right wheel +5 rad/s. Then|||Robot vi sai có r = 0,033 m, b = 0,16 m. Bánh trái −5 rad/s, bánh phải +5 rad/s. Khi đó',
    ['v = 0.165 m/s, ω = 0|||v = 0,165 m/s, ω = 0', 'v = 0, ω ≈ 2.06 rad/s|||v = 0, ω ≈ 2,06 rad/s', 'v = 0, ω ≈ 1.03 rad/s|||v = 0, ω ≈ 1,03 rad/s', 'v = 0.33 m/s, ω = 2.06 rad/s|||v = 0,33 m/s, ω = 2,06 rad/s'], 1,
    'v = r(5 − 5)/2 = 0; ω = 0.033·10/0.16 = 2.0625 rad/s.|||v = r(5 − 5)/2 = 0; ω = 0,033·10/0,16 = 2,0625 rad/s.'),
  Q('q9', 'Why is a differential-drive robot called nonholonomic?|||Vì sao robot dẫn động vi sai được gọi là nonholonomic?',
    ['It cannot reach every pose|||Nó không đến được mọi tư thế', 'It cannot move directly sideways, although it can reach every pose|||Nó không đi ngang trực tiếp được, dù vẫn đến được mọi tư thế', 'It has no encoders|||Nó không có encoder', 'It has 6 DOF|||Nó có 6 bậc tự do'], 1,
    'The no-slip constraint limits velocities, not reachable poses.|||Ràng buộc không trượt giới hạn vận tốc, không giới hạn tư thế đến được.'),
  Q('q10', 'Odometry drifts over time mainly because|||Odometry bị trôi theo thời gian chủ yếu vì',
    ['encoders count too fast|||encoder đếm quá nhanh', 'small errors (slip, wrong r or b) accumulate with integration|||sai số nhỏ (trượt, r hay b sai) bị cộng dồn khi tích phân', 'the robot is nonholonomic|||robot là nonholonomic', 'atan2 is inaccurate|||atan2 không chính xác'], 1,
    'Dead reckoning never corrects itself; other sensors must.|||Dead reckoning không tự sửa; phải nhờ cảm biến khác.'),
]);

const ch4 = {
  title: 'Chapter 4 — Kinematics: arms and mobile robots|||Chương 4 — Động học: tay máy và robot di động',
  description: 'Bậc tự do và công thức Grübler, không gian cấu hình và không gian làm việc, động học thuận/ngược tay máy phẳng 2R, dẫn động vi sai và odometry — code Python chạy thật (Lynch & Park Ch. 2, 4, 6, 13 · Craig Ch. 3–4 · Siegwart Ch. 3).',
  lessons: [r41, r42, r43, r44, q4],
};


// ───────────────────────────── Chương 5 — Điều khiển cơ bản ─────────────────────────────
const r51 = L('rai101-ts-5-1',
  '5.1 — Open-loop vs closed-loop control, feedback and on–off control|||5.1 — Điều khiển vòng hở và vòng kín, phản hồi và điều khiển bật–tắt',
  'Vì sao robot cần phản hồi: so sánh vòng hở và vòng kín, sơ đồ khối, sai số, điều khiển bật–tắt có trễ, mô phỏng Python tốc độ động cơ khi có tải.',
  `<span class="eyebrow">RAI101 · Chapter 5 · Lesson 5.1</span>
<h2>Open-loop vs closed-loop control, feedback and on–off control</h2>
<p class="lead">Sensors tell a robot what <em>is</em> happening; actuators make things happen. <strong>Control</strong> is the “think” step that connects them: it decides, many times per second, what command to send so that the robot does what we <em>want</em> — even when the world pushes back.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain the difference between open-loop and closed-loop (feedback) control.</li><li>Name the blocks of a feedback loop: reference, error, controller, plant, sensor, disturbance.</li><li>Describe on–off (bang–bang) control and why it chatters.</li><li>Read a simple Python simulation and interpret its result.</li></ul>
<h3>📖 Lecture</h3>
<p>Every control problem has a <strong>plant</strong> (the thing we control: a motor, a wheel, a robot arm joint, a drone's altitude), an <strong>input</strong> u we can set (voltage, PWM duty cycle, thrust) and an <strong>output</strong> y we care about (speed, angle, height). The desired value of y is the <strong>reference</strong> or <strong>setpoint</strong> r.</p>
<p><strong>Open-loop control</strong> computes u from r only, using a model: “10 V gives 100 rad/s, so apply 10 V”. It never looks at y. It is cheap and needs no sensor, and works well when the model is exact and nothing disturbs the plant — a toaster timer or a stepper motor that is never overloaded. But when the load changes, the battery drops or the floor gets steeper, the open-loop controller does not notice.</p>
<p><strong>Closed-loop (feedback) control</strong> measures y with a sensor, computes the <strong>error</strong> e = r − y and chooses u from the error. If a disturbance slows the motor, the error grows and the controller pushes harder. This is the same principle as a human driver watching the speedometer. Historically, James Watt's centrifugal governor (1788) used feedback to hold a steam engine's speed; today feedback runs inside every servo, drone and self-balancing robot.</p>
<div class="formula"><span class="lbl">Feedback loop</span>r → (e = r − y) → Controller → u → Plant (+ disturbance d) → y → Sensor → back to the comparison</div>
<p>The simplest feedback law is <strong>on–off (bang–bang) control</strong>: full power when y &lt; r, zero power when y ≥ r. A home thermostat works this way. It is robust and trivial to implement, but y never settles: it keeps crossing the setpoint and the actuator switches on and off rapidly (“chattering”), which wears out relays and motors. Real thermostats add <strong>hysteresis</strong> — a dead band such as “heat on below 19.5 °C, off above 20.5 °C” — to switch less often, at the cost of a larger ripple.</p>
<p>A first-order model is enough to see the difference. For a DC motor with speed ω, input voltage u and load d: <b>τ·dω/dt = K·u − ω − d</b>, with gain K = 10 rad/s per volt and time constant τ = 0.5 s. The program steps this model forward 5 s and records the speed in the last second.</p>
<h3>✍️ Worked example — open loop vs on–off under load</h3>
<pre><code class="language-python"># Motor speed: dw/dt = (K*u - w - d)/tau   (first-order model, Euler steps)
K, tau, dt = 10.0, 0.5, 0.01      # 10 rad/s per volt, time constant 0.5 s
target = 100.0                    # rad/s

def run(controller, load):
    w, last = 0.0, []
    for k in range(int(5 / dt)):           # simulate 5 s
        u = controller(w)
        u = max(0.0, min(12.0, u))         # supply limited to 0..12 V
        w += dt * (K * u - w - load) / tau
        if k * dt &gt;= 4.0:                  # remember the last second
            last.append(w)
    return min(last), max(last)

open_loop = lambda w: target / K           # "10 V should give 100 rad/s"
on_off    = lambda w: 12.0 if w &lt; target else 0.0

for load in (0.0, 15.0):
    print("load =", load)
    for name, c in (("open loop", open_loop), ("on-off   ", on_off)):
        lo, hi = run(c, load)
        print("  %s: speed in last second %.1f .. %.1f rad/s" % (name, lo, hi))</code></pre>
<div class="out">load = 0.0
  open loop: speed in last second 100.0 .. 100.0 rad/s
  on-off   : speed in last second 98.0 .. 100.4 rad/s
load = 15.0
  open loop: speed in last second 85.0 .. 85.0 rad/s
  on-off   : speed in last second 97.8 .. 100.1 rad/s</div>
<div class="callout"><p><b>Reading the result step by step.</b> (1) With no load, open loop is perfect: 10 V × 10 = 100 rad/s. (2) Add a load of 15: the open-loop controller still sends 10 V, so the speed falls to 100 − 15 = 85 rad/s — an error of 15 % that it cannot even see. (3) On–off control uses the measured speed, so with or without load it stays near 100 rad/s. (4) But it oscillates between about 98 and 100.4 rad/s because the voltage keeps jumping between 0 and 12 V. Feedback buys robustness; on–off feedback pays for it with ripple. The next lesson shows how a <em>proportional</em> controller gives a smooth command instead.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking a sensor alone makes a system closed-loop — the measurement must actually change the command.</li><li>Writing the error as y − r and then using positive gains: the robot pushes the wrong way and runs away.</li><li>Forgetting actuator limits: a real motor cannot receive 1000 V just because the formula says so (the code clamps u to 0..12 V).</li><li>Ignoring sensor noise and delay — a feedback loop can only be as good as its measurement.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Open loop: u from r and a model; cheap but blind to disturbances.</li><li>Closed loop: measure y, compute e = r − y, act on e; robust to load and model errors.</li><li>Block names: reference, error, controller, plant, sensor, disturbance.</li><li>On–off control is simple but chatters; hysteresis reduces switching.</li><li>Always respect actuator limits (saturation).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Closed-loop_controller" target="_blank" rel="noopener">Wikipedia — Closed-loop controller</a></li><li><a href="https://en.wikipedia.org/wiki/Bang%E2%80%93bang_control" target="_blank" rel="noopener">Wikipedia — Bang–bang control</a></li><li><a href="https://www.youtube.com/playlist?list=PLUMWjy5jgHK1NC52DXXrriwihVrYZKqjk" target="_blank" rel="noopener">Brian Douglas — Classical Control Theory (YouTube playlist)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Classify as open- or closed-loop: (a) a washing machine that runs 40 minutes regardless of how clean the clothes are; (b) a line-following robot that steers using an IR sensor under its body; (c) a drone that holds altitude using a barometer.</li><li>In the model above, what speed does open loop give with a load of 25?</li><li>Why does a thermostat use a band 19.5–20.5 °C instead of switching exactly at 20 °C?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (a) open loop; (b) closed loop; (c) closed loop. 2) Steady state: ω = K·u − d = 100 − 25 = 75 rad/s. 3) Hysteresis: with a single threshold the heater would switch on and off every few seconds because of noise; the band trades a ±0.5 °C ripple for far fewer switches.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 5 · Bài 5.1</span>
<h2>Điều khiển vòng hở và vòng kín, phản hồi và điều khiển bật–tắt</h2>
<p class="lead">Cảm biến cho robot biết điều gì <em>đang</em> xảy ra; cơ cấu chấp hành làm cho điều gì đó xảy ra. <strong>Điều khiển</strong> là bước “suy nghĩ” nối hai thứ đó: mỗi giây nhiều lần, nó quyết định gửi lệnh gì để robot làm đúng điều ta <em>muốn</em> — kể cả khi thế giới bên ngoài cản lại.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích khác biệt giữa điều khiển vòng hở và vòng kín (có phản hồi).</li><li>Gọi tên các khối của vòng phản hồi: giá trị đặt, sai số, bộ điều khiển, đối tượng, cảm biến, nhiễu.</li><li>Mô tả điều khiển bật–tắt (bang–bang) và vì sao nó “rung”.</li><li>Đọc một mô phỏng Python đơn giản và giải thích kết quả.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Mọi bài toán điều khiển có một <strong>đối tượng</strong> (plant — thứ ta điều khiển: động cơ, bánh xe, khớp tay máy, độ cao của drone), một <strong>đầu vào</strong> u ta đặt được (điện áp, độ rộng xung PWM, lực đẩy) và một <strong>đầu ra</strong> y ta quan tâm (tốc độ, góc, độ cao). Giá trị mong muốn của y là <strong>giá trị đặt</strong> r (reference/setpoint).</p>
<p><strong>Điều khiển vòng hở</strong> tính u chỉ từ r, dựa vào mô hình: “10 V cho 100 rad/s, vậy cấp 10 V”. Nó không bao giờ nhìn y. Rẻ, không cần cảm biến, và chạy tốt khi mô hình đúng và không có gì làm nhiễu đối tượng — như hẹn giờ của lò nướng hay động cơ bước không bao giờ quá tải. Nhưng khi tải đổi, pin yếu đi hay sàn dốc hơn, bộ điều khiển vòng hở không hề hay biết.</p>
<p><strong>Điều khiển vòng kín (phản hồi)</strong> đo y bằng cảm biến, tính <strong>sai số</strong> e = r − y rồi chọn u theo sai số. Nếu nhiễu làm động cơ chậm lại, sai số tăng và bộ điều khiển đẩy mạnh hơn — giống người lái xe nhìn đồng hồ tốc độ. Về lịch sử, bộ điều tốc ly tâm của James Watt (1788) dùng phản hồi để giữ tốc độ máy hơi nước; ngày nay phản hồi chạy bên trong mọi servo, drone và robot tự cân bằng.</p>
<div class="formula"><span class="lbl">Vòng phản hồi</span>r → (e = r − y) → Bộ điều khiển → u → Đối tượng (+ nhiễu d) → y → Cảm biến → quay lại phép so sánh</div>
<p>Luật phản hồi đơn giản nhất là <strong>điều khiển bật–tắt (bang–bang)</strong>: hết công suất khi y &lt; r, tắt khi y ≥ r. Bộ ổn nhiệt trong nhà làm đúng như vậy. Nó bền và cực dễ cài đặt, nhưng y không bao giờ đứng yên: nó liên tục vượt qua giá trị đặt và cơ cấu chấp hành bật tắt liên hồi (“rung”, chattering), làm mòn rơ-le và động cơ. Bộ ổn nhiệt thật thêm <strong>vùng trễ</strong> (hysteresis) — vd “bật sưởi dưới 19,5 °C, tắt trên 20,5 °C” — để đóng cắt ít hơn, đổi lại dao động lớn hơn.</p>
<p>Mô hình bậc nhất là đủ để thấy khác biệt. Với động cơ DC có tốc độ ω, điện áp vào u và tải d: <b>τ·dω/dt = K·u − ω − d</b>, hệ số K = 10 rad/s mỗi vôn, hằng số thời gian τ = 0,5 s. Chương trình cho mô hình chạy 5 s và ghi lại tốc độ trong giây cuối.</p>
<h3>✍️ Ví dụ — vòng hở và bật–tắt khi có tải</h3>
<pre><code class="language-python"># Motor speed: dw/dt = (K*u - w - d)/tau   (first-order model, Euler steps)
K, tau, dt = 10.0, 0.5, 0.01      # 10 rad/s per volt, time constant 0.5 s
target = 100.0                    # rad/s

def run(controller, load):
    w, last = 0.0, []
    for k in range(int(5 / dt)):           # simulate 5 s
        u = controller(w)
        u = max(0.0, min(12.0, u))         # supply limited to 0..12 V
        w += dt * (K * u - w - load) / tau
        if k * dt &gt;= 4.0:                  # remember the last second
            last.append(w)
    return min(last), max(last)

open_loop = lambda w: target / K           # "10 V should give 100 rad/s"
on_off    = lambda w: 12.0 if w &lt; target else 0.0

for load in (0.0, 15.0):
    print("load =", load)
    for name, c in (("open loop", open_loop), ("on-off   ", on_off)):
        lo, hi = run(c, load)
        print("  %s: speed in last second %.1f .. %.1f rad/s" % (name, lo, hi))</code></pre>
<div class="out">load = 0.0
  open loop: speed in last second 100.0 .. 100.0 rad/s
  on-off   : speed in last second 98.0 .. 100.4 rad/s
load = 15.0
  open loop: speed in last second 85.0 .. 85.0 rad/s
  on-off   : speed in last second 97.8 .. 100.1 rad/s</div>
<div class="callout"><p><b>Đọc kết quả từng bước.</b> (1) Không tải, vòng hở hoàn hảo: 10 V × 10 = 100 rad/s. (2) Thêm tải 15: bộ điều khiển vòng hở vẫn cấp 10 V nên tốc độ tụt còn 100 − 15 = 85 rad/s — sai 15 % mà nó không hề thấy. (3) Bật–tắt dùng tốc độ đo được nên dù có tải hay không vẫn giữ quanh 100 rad/s. (4) Nhưng nó dao động khoảng 98 đến 100,4 rad/s vì điện áp cứ nhảy giữa 0 và 12 V. Phản hồi mang lại tính bền vững; phản hồi bật–tắt trả giá bằng gợn sóng. Bài sau cho thấy bộ điều khiển <em>tỉ lệ</em> tạo lệnh mượt hơn.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ rằng chỉ cần có cảm biến là thành vòng kín — phép đo phải thực sự làm thay đổi lệnh điều khiển.</li><li>Viết sai số là y − r rồi vẫn dùng hệ số dương: robot đẩy ngược chiều và mất kiểm soát.</li><li>Quên giới hạn cơ cấu chấp hành: động cơ thật không thể nhận 1000 V chỉ vì công thức bảo thế (code kẹp u trong 0..12 V).</li><li>Bỏ qua nhiễu và độ trễ cảm biến — vòng phản hồi chỉ tốt bằng phép đo của nó.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Vòng hở: u tính từ r và mô hình; rẻ nhưng “mù” trước nhiễu.</li><li>Vòng kín: đo y, tính e = r − y, tác động theo e; bền trước tải và sai số mô hình.</li><li>Tên các khối: giá trị đặt, sai số, bộ điều khiển, đối tượng, cảm biến, nhiễu.</li><li>Bật–tắt đơn giản nhưng rung; vùng trễ giảm số lần đóng cắt.</li><li>Luôn tôn trọng giới hạn cơ cấu chấp hành (bão hoà).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Closed-loop_controller" target="_blank" rel="noopener">Wikipedia — Bộ điều khiển vòng kín (tiếng Anh)</a></li><li><a href="https://en.wikipedia.org/wiki/Bang%E2%80%93bang_control" target="_blank" rel="noopener">Wikipedia — Điều khiển bang–bang (tiếng Anh)</a></li><li><a href="https://www.youtube.com/playlist?list=PLUMWjy5jgHK1NC52DXXrriwihVrYZKqjk" target="_blank" rel="noopener">Brian Douglas — Classical Control Theory (danh sách video YouTube)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Phân loại vòng hở hay vòng kín: (a) máy giặt chạy 40 phút bất kể quần áo sạch hay chưa; (b) robot dò line lái theo cảm biến hồng ngoại dưới gầm; (c) drone giữ độ cao bằng cảm biến áp suất.</li><li>Trong mô hình trên, vòng hở cho tốc độ bao nhiêu khi tải bằng 25?</li><li>Vì sao bộ ổn nhiệt dùng dải 19,5–20,5 °C thay vì đóng cắt đúng tại 20 °C?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (a) vòng hở; (b) vòng kín; (c) vòng kín. 2) Ở trạng thái xác lập: ω = K·u − d = 100 − 25 = 75 rad/s. 3) Vùng trễ: với một ngưỡng duy nhất, nhiễu đo khiến máy sưởi bật tắt vài giây một lần; dải này đổi gợn ±0,5 °C lấy số lần đóng cắt ít hơn nhiều.</p></div>`);

const r52 = L('rai101-ts-5-2',
  '5.2 — PID control intuitively: what P, I and D each do|||5.2 — Hiểu PID trực quan: P, I, D mỗi phần làm gì',
  'Công thức PID, ý nghĩa trực quan của từng thành phần (hiện tại – quá khứ – tương lai), sai số xác lập của điều khiển P, PID rời rạc trên vi điều khiển.',
  `<span class="eyebrow">RAI101 · Chapter 5 · Lesson 5.2</span>
<h2>PID control intuitively: what P, I and D each do</h2>
<p class="lead">The PID controller is the workhorse of robotics: wheel speed loops, servo positions, quadcopter attitude and line followers all use it. It looks at the error in three ways — <strong>now</strong> (P), <strong>the past</strong> (I) and <strong>the trend</strong> (D) — and adds the three opinions together.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the PID control law and its discrete (code) form.</li><li>Explain the effect of each term on speed, overshoot and steady-state error.</li><li>Compute the steady-state error of proportional control on a simple plant.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">PID law</span>u(t) = K<sub>p</sub>·e(t) + K<sub>i</sub>·∫<sub>0</sub><sup>t</sup> e(τ) dτ + K<sub>d</sub>·de/dt,    e = r − y</div>
<p><strong>P — proportional (present).</strong> The command is proportional to the current error: big error, big push; small error, small push. Unlike on–off control the command is smooth. A larger K<sub>p</sub> reacts faster but, on plants with inertia, causes overshoot and oscillation. P alone usually leaves a <strong>steady-state error</strong>: when e = 0 the P-term gives u = 0, but a motor under load needs a non-zero voltage just to keep spinning, so the loop settles where the remaining error is exactly large enough to produce that voltage.</p>
<p><strong>I — integral (past).</strong> The integral adds up past error. As long as any error remains, the integral keeps growing and the command keeps increasing, so in steady state the error is driven to zero. The integral “remembers” how much extra push the load needs. Too much K<sub>i</sub> makes the response overshoot and oscillate, and if the actuator saturates the integral can grow huge (<strong>integral windup</strong>) — real code limits it.</p>
<p><strong>D — derivative (future).</strong> The derivative reacts to how fast the error is changing. When the robot rushes toward the target, e falls quickly, de/dt is strongly negative and the D-term brakes before the overshoot happens — like a driver lifting off the accelerator before the red light. D adds damping but amplifies sensor noise, so it is often filtered or computed from the measurement instead of the error.</p>
<p>On a microcontroller the loop runs every Δt seconds, so integrals become sums and derivatives become differences:</p>
<div class="formula"><span class="lbl">Discrete PID (every Δt)</span>e = r − y;    I = I + e·Δt;    D = (e − e<sub>prev</sub>)/Δt;    u = K<sub>p</sub>·e + K<sub>i</sub>·I + K<sub>d</sub>·D;    e<sub>prev</sub> = e</div>
<div class="kv-grid"><div class="kv"><span class="k">Raise K<sub>p</sub></span><span class="v">faster, smaller steady error, more overshoot</span></div><div class="kv"><span class="k">Raise K<sub>i</sub></span><span class="v">removes steady error, more overshoot, slower to calm</span></div><div class="kv"><span class="k">Raise K<sub>d</sub></span><span class="v">less overshoot, more damping, more noise sensitivity</span></div></div>
<h3>✍️ Worked example — steady-state error of P control</h3>
<p>Take the motor of Lesson 5.1 without load: in steady state ω = K·u with K = 10, and u = K<sub>p</sub>(r − ω). Substituting, ω = K·K<sub>p</sub>(r − ω), so</p>
<div class="formula"><span class="lbl">P-only steady state</span>ω<sub>ss</sub> = K·K<sub>p</sub>·r / (1 + K·K<sub>p</sub>),    e<sub>ss</sub> = r / (1 + K·K<sub>p</sub>)</div>
<pre><code class="language-python"># P-only control of the same motor: steady-state error e_ss = r / (1 + Kp*K)
K, r = 10.0, 100.0
for Kp in (0.1, 0.5, 1.0, 5.0):
    w_ss = Kp * K * r / (1 + Kp * K)
    print("Kp = %-4s  w_ss = %6.2f rad/s   error = %5.2f rad/s" % (Kp, w_ss, r - w_ss))</code></pre>
<div class="out">Kp = 0.1   w_ss =  50.00 rad/s   error = 50.00 rad/s
Kp = 0.5   w_ss =  83.33 rad/s   error = 16.67 rad/s
Kp = 1.0   w_ss =  90.91 rad/s   error =  9.09 rad/s
Kp = 5.0   w_ss =  98.04 rad/s   error =  1.96 rad/s</div>
<div class="callout"><p><b>Step by step for K<sub>p</sub> = 1.</b> Loop gain K·K<sub>p</sub> = 10. ω<sub>ss</sub> = 10·100/11 = 90.91 rad/s, error = 100/11 = 9.09 rad/s. Raising K<sub>p</sub> to 5 shrinks the error to 1.96 rad/s but never to zero — and a real motor with inertia would start to overshoot. Adding an I-term removes the remaining error completely, which Lesson 5.3 shows in simulation.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Cranking K<sub>p</sub> up to kill steady error — the loop becomes oscillatory or unstable; use K<sub>i</sub> instead.</li><li>Forgetting to multiply by Δt in the integral (or dividing by it in the derivative) — the gains then depend on the loop rate.</li><li>No anti-windup: the integral keeps growing while the motor is saturated, causing a huge overshoot afterwards.</li><li>Using D on a noisy sensor without filtering — the motor buzzes.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>u = K<sub>p</sub>e + K<sub>i</sub>∫e + K<sub>d</sub>de/dt: present, past, future.</li><li>P alone leaves e<sub>ss</sub> = r/(1 + K·K<sub>p</sub>) on a simple plant.</li><li>I removes steady-state error; watch for windup.</li><li>D damps overshoot; watch for noise.</li><li>In code: sum for I, difference for D, fixed Δt.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.youtube.com/watch?v=wkfEZmsQqiA" target="_blank" rel="noopener">MATLAB — What Is PID Control? (Understanding PID Control, Part 1)</a></li><li><a href="https://en.wikipedia.org/wiki/PID_controller" target="_blank" rel="noopener">Wikipedia — PID controller</a></li><li><a href="https://en.wikipedia.org/wiki/Integral_windup" target="_blank" rel="noopener">Wikipedia — Integral windup</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>With K = 10 and r = 100, which K<sub>p</sub> gives a steady-state error of exactly 2 rad/s under P-only control?</li><li>A line-following robot wobbles left and right around the line. Which gain would you increase first, and which would you decrease?</li><li>Translate into words: I = I + e·Δt.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 100/(1 + 10K<sub>p</sub>) = 2 ⇒ 1 + 10K<sub>p</sub> = 50 ⇒ K<sub>p</sub> = 4.9. 2) Increase K<sub>d</sub> (damping) and/or decrease K<sub>p</sub>; wobbling is overshoot/oscillation. 3) “Add the area of the current error over one time step to the running total of past error.”</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 5 · Bài 5.2</span>
<h2>Hiểu PID trực quan: P, I, D mỗi phần làm gì</h2>
<p class="lead">Bộ điều khiển PID là “ngựa thồ” của robot học: vòng tốc độ bánh xe, vị trí servo, tư thế quadcopter, robot dò line đều dùng nó. Nó nhìn sai số theo ba cách — <strong>hiện tại</strong> (P), <strong>quá khứ</strong> (I) và <strong>xu hướng</strong> (D) — rồi cộng ba ý kiến lại.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết luật điều khiển PID và dạng rời rạc (trong code).</li><li>Giải thích ảnh hưởng của từng thành phần lên tốc độ đáp ứng, độ vọt lố và sai số xác lập.</li><li>Tính sai số xác lập của điều khiển tỉ lệ trên một đối tượng đơn giản.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Luật PID</span>u(t) = K<sub>p</sub>·e(t) + K<sub>i</sub>·∫<sub>0</sub><sup>t</sup> e(τ) dτ + K<sub>d</sub>·de/dt,    e = r − y</div>
<p><strong>P — tỉ lệ (hiện tại).</strong> Lệnh tỉ lệ với sai số hiện tại: sai nhiều đẩy mạnh, sai ít đẩy nhẹ. Khác bật–tắt, lệnh thay đổi mượt. K<sub>p</sub> lớn phản ứng nhanh nhưng với đối tượng có quán tính sẽ gây vọt lố và dao động. Riêng P thường để lại <strong>sai số xác lập</strong>: khi e = 0 thì thành phần P cho u = 0, nhưng động cơ có tải cần một điện áp khác 0 chỉ để giữ quay, nên vòng ổn định tại chỗ sai số còn lại vừa đủ tạo ra điện áp đó.</p>
<p><strong>I — tích phân (quá khứ).</strong> Tích phân cộng dồn sai số đã qua. Chừng nào còn sai số, tích phân còn tăng và lệnh còn tăng, nên ở trạng thái xác lập sai số bị kéo về 0. Tích phân “nhớ” tải cần thêm bao nhiêu lực đẩy. K<sub>i</sub> quá lớn làm đáp ứng vọt lố và dao động, và nếu cơ cấu chấp hành bão hoà thì tích phân có thể phình rất lớn (<strong>bão hoà tích phân</strong>, integral windup) — code thật phải giới hạn nó.</p>
<p><strong>D — vi phân (tương lai).</strong> Vi phân phản ứng theo tốc độ thay đổi của sai số. Khi robot lao nhanh về đích, e giảm nhanh, de/dt âm lớn và thành phần D “phanh” trước khi vọt lố xảy ra — như tài xế nhả ga trước đèn đỏ. D tăng độ tắt dần nhưng khuếch đại nhiễu cảm biến, nên thường được lọc hoặc tính từ phép đo thay vì từ sai số.</p>
<p>Trên vi điều khiển, vòng lặp chạy mỗi Δt giây, nên tích phân thành tổng và đạo hàm thành hiệu:</p>
<div class="formula"><span class="lbl">PID rời rạc (mỗi Δt)</span>e = r − y;    I = I + e·Δt;    D = (e − e<sub>trước</sub>)/Δt;    u = K<sub>p</sub>·e + K<sub>i</sub>·I + K<sub>d</sub>·D;    e<sub>trước</sub> = e</div>
<div class="kv-grid"><div class="kv"><span class="k">Tăng K<sub>p</sub></span><span class="v">nhanh hơn, sai số xác lập nhỏ hơn, vọt lố nhiều hơn</span></div><div class="kv"><span class="k">Tăng K<sub>i</sub></span><span class="v">khử sai số xác lập, vọt lố hơn, lâu yên hơn</span></div><div class="kv"><span class="k">Tăng K<sub>d</sub></span><span class="v">ít vọt lố, tắt dần tốt hơn, nhạy nhiễu hơn</span></div></div>
<h3>✍️ Ví dụ — sai số xác lập của điều khiển P</h3>
<p>Lấy động cơ ở Bài 5.1, không tải: ở trạng thái xác lập ω = K·u với K = 10, và u = K<sub>p</sub>(r − ω). Thay vào: ω = K·K<sub>p</sub>(r − ω), nên</p>
<div class="formula"><span class="lbl">Xác lập khi chỉ có P</span>ω<sub>xl</sub> = K·K<sub>p</sub>·r / (1 + K·K<sub>p</sub>),    e<sub>xl</sub> = r / (1 + K·K<sub>p</sub>)</div>
<pre><code class="language-python"># P-only control of the same motor: steady-state error e_ss = r / (1 + Kp*K)
K, r = 10.0, 100.0
for Kp in (0.1, 0.5, 1.0, 5.0):
    w_ss = Kp * K * r / (1 + Kp * K)
    print("Kp = %-4s  w_ss = %6.2f rad/s   error = %5.2f rad/s" % (Kp, w_ss, r - w_ss))</code></pre>
<div class="out">Kp = 0.1   w_ss =  50.00 rad/s   error = 50.00 rad/s
Kp = 0.5   w_ss =  83.33 rad/s   error = 16.67 rad/s
Kp = 1.0   w_ss =  90.91 rad/s   error =  9.09 rad/s
Kp = 5.0   w_ss =  98.04 rad/s   error =  1.96 rad/s</div>
<div class="callout"><p><b>Từng bước với K<sub>p</sub> = 1.</b> Độ lợi vòng K·K<sub>p</sub> = 10. ω<sub>xl</sub> = 10·100/11 = 90,91 rad/s, sai số = 100/11 = 9,09 rad/s. Tăng K<sub>p</sub> lên 5 thì sai số còn 1,96 rad/s nhưng không bao giờ về 0 — và động cơ thật có quán tính sẽ bắt đầu vọt lố. Thêm thành phần I sẽ khử hẳn phần sai số còn lại, Bài 5.3 cho thấy điều đó bằng mô phỏng.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tăng K<sub>p</sub> thật lớn để diệt sai số xác lập — vòng sẽ dao động hoặc mất ổn định; hãy dùng K<sub>i</sub>.</li><li>Quên nhân Δt trong tích phân (hoặc chia Δt trong đạo hàm) — khi đó hệ số phụ thuộc tần số vòng lặp.</li><li>Không chống bão hoà tích phân: tích phân cứ tăng trong lúc động cơ đã hết công suất, sau đó vọt lố rất lớn.</li><li>Dùng D trên cảm biến nhiễu mà không lọc — động cơ kêu rè rè.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>u = K<sub>p</sub>e + K<sub>i</sub>∫e + K<sub>d</sub>de/dt: hiện tại, quá khứ, tương lai.</li><li>Chỉ có P để lại e<sub>xl</sub> = r/(1 + K·K<sub>p</sub>) trên đối tượng đơn giản.</li><li>I khử sai số xác lập; cẩn thận bão hoà tích phân.</li><li>D giảm vọt lố; cẩn thận nhiễu.</li><li>Trong code: cộng dồn cho I, lấy hiệu cho D, Δt cố định.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.youtube.com/watch?v=wkfEZmsQqiA" target="_blank" rel="noopener">MATLAB — What Is PID Control? (Understanding PID Control, Phần 1)</a></li><li><a href="https://en.wikipedia.org/wiki/PID_controller" target="_blank" rel="noopener">Wikipedia — Bộ điều khiển PID (tiếng Anh)</a></li><li><a href="https://en.wikipedia.org/wiki/Integral_windup" target="_blank" rel="noopener">Wikipedia — Bão hoà tích phân (tiếng Anh)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với K = 10, r = 100, K<sub>p</sub> bằng bao nhiêu thì sai số xác lập của điều khiển chỉ-P đúng bằng 2 rad/s?</li><li>Robot dò line lắc qua lắc lại quanh vạch. Bạn tăng hệ số nào trước, giảm hệ số nào?</li><li>Diễn đạt bằng lời: I = I + e·Δt.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 100/(1 + 10K<sub>p</sub>) = 2 ⇒ 1 + 10K<sub>p</sub> = 50 ⇒ K<sub>p</sub> = 4,9. 2) Tăng K<sub>d</sub> (tắt dần) và/hoặc giảm K<sub>p</sub>; lắc lư là vọt lố/dao động. 3) “Cộng diện tích của sai số hiện tại trong một bước thời gian vào tổng sai số đã tích luỹ.”</p></div>`);

const r53 = L('rai101-ts-5-3',
  '5.3 — Simulating and tuning a PID controller in Python|||5.3 — Mô phỏng và chỉnh định bộ điều khiển PID bằng Python',
  'Mô phỏng xe trên dốc với P, PD, PI, PID; đo độ vọt lố, thời gian xác lập 2 %, sai số cuối; quy trình chỉnh định thủ công và Ziegler–Nichols.',
  `<span class="eyebrow">RAI101 · Chapter 5 · Lesson 5.3</span>
<h2>Simulating and tuning a PID controller in Python</h2>
<p class="lead">Reading about P, I and D is not the same as seeing them. In this lesson we simulate a small cart that must stop exactly 1 m up a slope, try four controllers and measure three numbers engineers always quote: <strong>overshoot</strong>, <strong>settling time</strong> and <strong>steady-state error</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Simulate a feedback loop with the Euler method.</li><li>Define and compute overshoot, 2 % settling time and steady-state error.</li><li>Compare P, PD, PI and PID on the same plant and explain the differences.</li><li>Apply a simple manual tuning procedure.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>The plant.</strong> A cart of mass m = 1 kg with viscous friction c = 1 N·s/m sits on a slope; gravity pulls it back with a constant force d = 2 N. The motor force is u. Newton's second law gives <b>m·x″ = u − c·x′ − d</b>. We want x = 1 m.</p>
<p><strong>The simulation.</strong> With a small step Δt = 1 ms we repeat: compute the error, update the PID terms, compute the acceleration a = (u − c·v − d)/m, then v ← v + a·Δt and x ← x + v·Δt (the Euler method). 10 s of motion is 10 000 steps — instant on any laptop.</p>
<div class="formula"><span class="lbl">Performance measures</span>overshoot = (x<sub>max</sub> − r)/r × 100 %    settling time = last time |x − r| &gt; 2 % of r    steady-state error = r − x(final)</div>
<h3>✍️ Worked example — four controllers on the same cart</h3>
<pre><code class="language-python"># Cart on a slope: m*x'' = u - c*x' - d   (d = constant push of gravity)
m, c, d = 1.0, 1.0, 2.0
dt, T, target = 0.001, 10.0, 1.0

def simulate(Kp, Ki, Kd):
    x = v = integral = 0.0
    prev_err = target - x
    xs = []
    for k in range(int(T / dt)):
        err = target - x
        integral += err * dt
        deriv = (err - prev_err) / dt
        prev_err = err
        u = Kp * err + Ki * integral + Kd * deriv
        a = (u - c * v - d) / m
        v += a * dt
        x += v * dt
        xs.append(x)
    overshoot = max(0.0, (max(xs) - target) / target * 100)
    settle = 0.0                      # last time outside the 2 % band
    for k, xk in enumerate(xs):
        if abs(xk - target) &gt; 0.02 * target:
            settle = (k + 1) * dt
    return overshoot, settle, target - xs[-1]

print("controller        overshoot  settling(2%)  final error")
for name, g in [("P   Kp=10", (10, 0, 0)),
                ("PD  Kp=10 Kd=4", (10, 0, 4)),
                ("PI  Kp=10 Ki=8", (10, 8, 0)),
                ("PID Kp=10 Ki=8 Kd=4", (10, 8, 4)),
                ("PID Kp=10 Ki=4 Kd=4", (10, 4, 4))]:
    os_, ts, e = simulate(*g)
    ts_txt = "%.2f s" % ts if ts &lt; T else "never"
    print("%-20s %6.1f %%   %9s   %+.3f" % (name, os_, ts_txt, e))</code></pre>
<div class="out">controller        overshoot  settling(2%)  final error
P   Kp=10              28.4 %       never   +0.205
PD  Kp=10 Kd=4          0.0 %       never   +0.200
PI  Kp=10 Ki=8         67.1 %       never   +0.319
PID Kp=10 Ki=8 Kd=4    19.3 %      3.16 s   +0.000
PID Kp=10 Ki=4 Kd=4     3.6 %      2.63 s   -0.000</div>
<div class="callout"><p><b>Interpreting each line.</b></p>
<p>(1) <b>P, K<sub>p</sub> = 10:</b> to hold the cart on the slope the motor must supply 2 N, and P can only do that if an error of 2/10 = 0.2 m remains. The output confirms an error of about 0.2 and the cart oscillates (28 % overshoot of the 1 m target) because nothing damps it.</p>
<p>(2) <b>PD:</b> the derivative adds damping — overshoot drops to 0 % — but the 0.2 m error is still there: D only reacts to <em>change</em>, not to a constant error.</p>
<p>(3) <b>PI:</b> the integral slowly builds the missing 2 N, but with no damping the cart swings wildly (67 % overshoot) and after 10 s it is still oscillating, so the “final error” is just a snapshot of the swing.</p>
<p>(4) <b>PID, K<sub>i</sub> = 8:</b> zero final error and it settles in about 3.2 s, with 19 % overshoot.</p>
<p>(5) <b>PID, K<sub>i</sub> = 4:</b> a gentler integral gives only 3.6 % overshoot and settles faster (2.63 s). More integral is not always better.</p></div>
<h3>🔧 A practical tuning recipe</h3>
<ol><li>Set K<sub>i</sub> = K<sub>d</sub> = 0. Increase K<sub>p</sub> until the response is fast but starts to oscillate.</li><li>Increase K<sub>d</sub> until the oscillation is damped to an acceptable overshoot.</li><li>Increase K<sub>i</sub> slowly until the steady-state error disappears in a reasonable time; back off if overshoot grows.</li><li>Test with disturbances (push the robot, change the load) and with the real loop rate and sensor noise.</li></ol>
<p>A classic alternative is the <strong>Ziegler–Nichols</strong> method: find the gain K<sub>u</sub> at which P-only control oscillates steadily with period T<sub>u</sub>, then use tabulated values (for PID: K<sub>p</sub> = 0.6K<sub>u</sub>, T<sub>i</sub> = T<sub>u</sub>/2, T<sub>d</sub> = T<sub>u</sub>/8). It gives an aggressive starting point that usually needs softening.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Tuning in simulation only — real motors have saturation, delay, friction and noise.</li><li>Choosing Δt too large: the Euler simulation (and the real digital controller) becomes inaccurate or unstable.</li><li>Changing two gains at once, so you cannot tell which change helped.</li><li>Judging a controller by one number: always look at overshoot, settling time and error together.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Simulate with Euler steps: error → PID → acceleration → velocity → position.</li><li>P alone leaves error d/K<sub>p</sub> against a constant disturbance.</li><li>D damps but cannot remove a constant error; I removes it but may oscillate.</li><li>PID combines both; tune K<sub>p</sub> → K<sub>d</sub> → K<sub>i</sub>, then test with disturbances.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.youtube.com/playlist?list=PLn8PRpmsu08pQBgjxYFXSsODEF3Jqmm-y" target="_blank" rel="noopener">MATLAB — Understanding PID Control (YouTube playlist)</a></li><li><a href="https://en.wikipedia.org/wiki/Ziegler%E2%80%93Nichols_method" target="_blank" rel="noopener">Wikipedia — Ziegler–Nichols method</a></li><li><a href="https://www.youtube.com/playlist?list=PLMrJAkhIeNNR20Mz-VpzgfQs5zrYi085m" target="_blank" rel="noopener">Steve Brunton — Control Bootcamp (YouTube playlist)</a></li><li><a href="https://en.wikipedia.org/wiki/Settling_time" target="_blank" rel="noopener">Wikipedia — Settling time</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>If the slope doubles (d = 4 N), what steady-state error does P control with K<sub>p</sub> = 10 leave? What about with K<sub>p</sub> = 40?</li><li>Run the program with K<sub>p</sub> = 10, K<sub>i</sub> = 4 and K<sub>d</sub> = 0. Predict before running: will the overshoot be larger or smaller than PID with K<sub>d</sub> = 4?</li><li>A cart's response has x<sub>max</sub> = 1.15 m for r = 1 m. What is the overshoot?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Error = d/K<sub>p</sub>: 4/10 = 0.4 m; 4/40 = 0.1 m (but more oscillation). 2) Larger — without D there is almost no damping (friction c = 1 only), so the cart swings far more. 3) (1.15 − 1)/1 × 100 % = 15 %.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 5 · Bài 5.3</span>
<h2>Mô phỏng và chỉnh định bộ điều khiển PID bằng Python</h2>
<p class="lead">Đọc về P, I, D khác hẳn với tận mắt thấy chúng. Trong bài này ta mô phỏng một chiếc xe nhỏ phải dừng đúng 1 m trên một con dốc, thử bốn bộ điều khiển và đo ba con số kỹ sư luôn nhắc tới: <strong>độ vọt lố</strong>, <strong>thời gian xác lập</strong> và <strong>sai số xác lập</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô phỏng một vòng phản hồi bằng phương pháp Euler.</li><li>Định nghĩa và tính độ vọt lố, thời gian xác lập 2 % và sai số xác lập.</li><li>So sánh P, PD, PI, PID trên cùng đối tượng và giải thích khác biệt.</li><li>Áp dụng một quy trình chỉnh định thủ công đơn giản.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Đối tượng.</strong> Xe khối lượng m = 1 kg, ma sát nhớt c = 1 N·s/m, đứng trên dốc; trọng lực kéo ngược lại với lực không đổi d = 2 N. Lực động cơ là u. Định luật II Newton: <b>m·x″ = u − c·x′ − d</b>. Ta muốn x = 1 m.</p>
<p><strong>Mô phỏng.</strong> Với bước nhỏ Δt = 1 ms ta lặp: tính sai số, cập nhật các thành phần PID, tính gia tốc a = (u − c·v − d)/m, rồi v ← v + a·Δt và x ← x + v·Δt (phương pháp Euler). 10 s chuyển động là 10 000 bước — chạy tức thì trên mọi laptop.</p>
<div class="formula"><span class="lbl">Chỉ số chất lượng</span>vọt lố = (x<sub>max</sub> − r)/r × 100 %    thời gian xác lập = thời điểm cuối cùng |x − r| &gt; 2 % của r    sai số xác lập = r − x(cuối)</div>
<h3>✍️ Ví dụ — bốn bộ điều khiển trên cùng một xe</h3>
<pre><code class="language-python"># Cart on a slope: m*x'' = u - c*x' - d   (d = constant push of gravity)
m, c, d = 1.0, 1.0, 2.0
dt, T, target = 0.001, 10.0, 1.0

def simulate(Kp, Ki, Kd):
    x = v = integral = 0.0
    prev_err = target - x
    xs = []
    for k in range(int(T / dt)):
        err = target - x
        integral += err * dt
        deriv = (err - prev_err) / dt
        prev_err = err
        u = Kp * err + Ki * integral + Kd * deriv
        a = (u - c * v - d) / m
        v += a * dt
        x += v * dt
        xs.append(x)
    overshoot = max(0.0, (max(xs) - target) / target * 100)
    settle = 0.0                      # last time outside the 2 % band
    for k, xk in enumerate(xs):
        if abs(xk - target) &gt; 0.02 * target:
            settle = (k + 1) * dt
    return overshoot, settle, target - xs[-1]

print("controller        overshoot  settling(2%)  final error")
for name, g in [("P   Kp=10", (10, 0, 0)),
                ("PD  Kp=10 Kd=4", (10, 0, 4)),
                ("PI  Kp=10 Ki=8", (10, 8, 0)),
                ("PID Kp=10 Ki=8 Kd=4", (10, 8, 4)),
                ("PID Kp=10 Ki=4 Kd=4", (10, 4, 4))]:
    os_, ts, e = simulate(*g)
    ts_txt = "%.2f s" % ts if ts &lt; T else "never"
    print("%-20s %6.1f %%   %9s   %+.3f" % (name, os_, ts_txt, e))</code></pre>
<div class="out">controller        overshoot  settling(2%)  final error
P   Kp=10              28.4 %       never   +0.205
PD  Kp=10 Kd=4          0.0 %       never   +0.200
PI  Kp=10 Ki=8         67.1 %       never   +0.319
PID Kp=10 Ki=8 Kd=4    19.3 %      3.16 s   +0.000
PID Kp=10 Ki=4 Kd=4     3.6 %      2.63 s   -0.000</div>
<div class="callout"><p><b>Giải thích từng dòng.</b></p>
<p>(1) <b>P, K<sub>p</sub> = 10:</b> để giữ xe trên dốc, động cơ phải tạo 2 N, và P chỉ làm được vậy khi còn sai số 2/10 = 0,2 m. Kết quả xác nhận sai số khoảng 0,2 và xe dao động (vọt lố 28 % so với đích 1 m) vì không có gì làm tắt dần.</p>
<p>(2) <b>PD:</b> vi phân thêm tắt dần — vọt lố còn 0 % — nhưng sai số 0,2 m vẫn còn: D chỉ phản ứng với <em>sự thay đổi</em>, không phản ứng với sai số không đổi.</p>
<p>(3) <b>PI:</b> tích phân từ từ tạo ra 2 N còn thiếu, nhưng không có tắt dần nên xe lắc rất mạnh (vọt lố 67 %) và sau 10 s vẫn còn dao động, nên “sai số cuối” chỉ là ảnh chụp một thời điểm của dao động.</p>
<p>(4) <b>PID, K<sub>i</sub> = 8:</b> sai số cuối bằng 0, xác lập sau khoảng 3,2 s, vọt lố 19 %.</p>
<p>(5) <b>PID, K<sub>i</sub> = 4:</b> tích phân nhẹ hơn cho vọt lố chỉ 3,6 % và xác lập nhanh hơn (2,63 s). Tích phân nhiều hơn không phải lúc nào cũng tốt hơn.</p></div>
<h3>🔧 Quy trình chỉnh định thực tế</h3>
<ol><li>Đặt K<sub>i</sub> = K<sub>d</sub> = 0. Tăng K<sub>p</sub> tới khi đáp ứng nhanh nhưng bắt đầu dao động.</li><li>Tăng K<sub>d</sub> tới khi dao động tắt dần, vọt lố chấp nhận được.</li><li>Tăng K<sub>i</sub> từ từ tới khi sai số xác lập biến mất trong thời gian hợp lý; lùi lại nếu vọt lố tăng.</li><li>Thử với nhiễu (đẩy robot, đổi tải) và với tần số vòng lặp thật, nhiễu cảm biến thật.</li></ol>
<p>Một cách kinh điển khác là phương pháp <strong>Ziegler–Nichols</strong>: tìm hệ số K<sub>u</sub> mà ở đó điều khiển chỉ-P dao động đều với chu kỳ T<sub>u</sub>, rồi dùng bảng (với PID: K<sub>p</sub> = 0,6K<sub>u</sub>, T<sub>i</sub> = T<sub>u</sub>/2, T<sub>d</sub> = T<sub>u</sub>/8). Nó cho điểm xuất phát khá “hung hăng”, thường phải làm mềm lại.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ chỉnh trong mô phỏng — động cơ thật có bão hoà, trễ, ma sát và nhiễu.</li><li>Chọn Δt quá lớn: mô phỏng Euler (và bộ điều khiển số thật) trở nên sai hoặc mất ổn định.</li><li>Đổi hai hệ số cùng lúc nên không biết thay đổi nào có ích.</li><li>Đánh giá bộ điều khiển bằng một con số: luôn xem cùng lúc vọt lố, thời gian xác lập và sai số.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mô phỏng bằng bước Euler: sai số → PID → gia tốc → vận tốc → vị trí.</li><li>Chỉ P để lại sai số d/K<sub>p</sub> khi có nhiễu không đổi.</li><li>D làm tắt dần nhưng không khử được sai số không đổi; I khử được nhưng có thể dao động.</li><li>PID kết hợp cả hai; chỉnh K<sub>p</sub> → K<sub>d</sub> → K<sub>i</sub>, rồi thử với nhiễu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.youtube.com/playlist?list=PLn8PRpmsu08pQBgjxYFXSsODEF3Jqmm-y" target="_blank" rel="noopener">MATLAB — Understanding PID Control (danh sách video YouTube)</a></li><li><a href="https://en.wikipedia.org/wiki/Ziegler%E2%80%93Nichols_method" target="_blank" rel="noopener">Wikipedia — Phương pháp Ziegler–Nichols (tiếng Anh)</a></li><li><a href="https://www.youtube.com/playlist?list=PLMrJAkhIeNNR20Mz-VpzgfQs5zrYi085m" target="_blank" rel="noopener">Steve Brunton — Control Bootcamp (danh sách video YouTube)</a></li><li><a href="https://en.wikipedia.org/wiki/Settling_time" target="_blank" rel="noopener">Wikipedia — Thời gian xác lập (tiếng Anh)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Nếu dốc gấp đôi (d = 4 N), điều khiển P với K<sub>p</sub> = 10 để lại sai số xác lập bao nhiêu? Với K<sub>p</sub> = 40 thì sao?</li><li>Chạy chương trình với K<sub>p</sub> = 10, K<sub>i</sub> = 4, K<sub>d</sub> = 0. Dự đoán trước khi chạy: vọt lố lớn hơn hay nhỏ hơn PID có K<sub>d</sub> = 4?</li><li>Đáp ứng của xe có x<sub>max</sub> = 1,15 m với r = 1 m. Độ vọt lố bằng bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Sai số = d/K<sub>p</sub>: 4/10 = 0,4 m; 4/40 = 0,1 m (nhưng dao động nhiều hơn). 2) Lớn hơn — không có D thì gần như không có tắt dần (chỉ ma sát c = 1), xe lắc mạnh hơn nhiều. 3) (1,15 − 1)/1 × 100 % = 15 %.</p></div>`);

const q5 = QZ(5, 'Quiz — Chapter 5: Basic control (open/closed loop, PID)|||Quiz — Chương 5: Điều khiển cơ bản (vòng hở/kín, PID)', 'Kiểm tra chương 5: vòng hở và vòng kín, bật–tắt, ý nghĩa P/I/D, sai số xác lập, chỉ số vọt lố và thời gian xác lập, chỉnh định.', [
  Q('q1', 'Which system is closed-loop?|||Hệ nào là vòng kín?',
    ['A toaster with a fixed timer|||Lò nướng bánh có hẹn giờ cố định', 'A servo that compares its measured angle with the commanded angle|||Servo so sánh góc đo được với góc được ra lệnh', 'A fan with three fixed speed buttons|||Quạt có ba nút tốc độ cố định', 'A stepper motor driven by a fixed pulse train|||Động cơ bước chạy theo chuỗi xung cố định'], 1,
    'Closed loop = the measurement of the output changes the command.|||Vòng kín = phép đo đầu ra làm thay đổi lệnh điều khiển.'),
  Q('q2', 'In a feedback loop the error is defined as|||Trong vòng phản hồi, sai số được định nghĩa là',
    ['e = y − u|||e = y − u', 'e = r − y|||e = r − y', 'e = u − r|||e = u − r', 'e = r · y|||e = r · y'], 1,
    'Reference minus measured output.|||Giá trị đặt trừ đầu ra đo được.'),
  Q('q3', 'A motor gives 10 rad/s per volt. Open loop applies 10 V for 100 rad/s, but a load of 20 appears. Steady speed?|||Động cơ cho 10 rad/s mỗi vôn. Vòng hở cấp 10 V để có 100 rad/s, nhưng xuất hiện tải 20. Tốc độ xác lập?',
    ['100 rad/s|||100 rad/s', '120 rad/s|||120 rad/s', '80 rad/s|||80 rad/s', '0 rad/s|||0 rad/s'], 2,
    'ω = K·u − d = 100 − 20 = 80; open loop cannot correct it.|||ω = K·u − d = 100 − 20 = 80; vòng hở không tự sửa được.'),
  Q('q4', 'The main drawback of on–off (bang–bang) control is|||Nhược điểm chính của điều khiển bật–tắt là',
    ['it needs a perfect model|||cần mô hình hoàn hảo', 'the output keeps oscillating around the setpoint and the actuator chatters|||đầu ra dao động quanh giá trị đặt và cơ cấu chấp hành đóng cắt liên tục', 'it cannot react to disturbances|||không phản ứng được với nhiễu', 'it always has a large steady-state error|||luôn có sai số xác lập lớn'], 1,
    'Hysteresis reduces switching but leaves a ripple.|||Vùng trễ giảm số lần đóng cắt nhưng vẫn còn gợn sóng.'),
  Q('q5', 'Which PID term removes a constant steady-state error?|||Thành phần nào của PID khử sai số xác lập không đổi?',
    ['P|||P', 'I|||I', 'D|||D', 'None of them|||Không thành phần nào'], 1,
    'The integral keeps growing while any error remains.|||Tích phân còn tăng chừng nào còn sai số.'),
  Q('q6', 'Which term mainly adds damping (less overshoot) but amplifies sensor noise?|||Thành phần nào chủ yếu tăng tắt dần (giảm vọt lố) nhưng khuếch đại nhiễu cảm biến?',
    ['P|||P', 'I|||I', 'D|||D', 'The setpoint|||Giá trị đặt'], 2,
    'D reacts to the rate of change of the error.|||D phản ứng theo tốc độ thay đổi của sai số.'),
  Q('q7', 'P-only control, plant ω = 10·u, r = 100, K_p = 1.5. Steady-state error ≈|||Chỉ P, đối tượng ω = 10·u, r = 100, K_p = 1,5. Sai số xác lập ≈',
    ['0|||0', '6.25 rad/s|||6,25 rad/s', '10 rad/s|||10 rad/s', '15 rad/s|||15 rad/s'], 1,
    'e = r/(1 + K·K_p) = 100/16 = 6.25.|||e = r/(1 + K·K_p) = 100/16 = 6,25.'),
  Q('q8', 'A cart against a constant 3 N push under P control with K_p = 15 settles with error|||Xe chịu lực cản không đổi 3 N, điều khiển P với K_p = 15 ổn định với sai số',
    ['0.2 m|||0,2 m', '0.5 m|||0,5 m', '5 m|||5 m', '0 m|||0 m'], 0,
    'The motor must supply 3 N = K_p·e ⇒ e = 3/15 = 0.2 m.|||Động cơ phải tạo 3 N = K_p·e ⇒ e = 3/15 = 0,2 m.'),
  Q('q9', 'Target 2 m, the response peaks at 2.3 m. Overshoot =|||Đích 2 m, đáp ứng đạt đỉnh 2,3 m. Độ vọt lố =',
    ['30 %|||30 %', '15 %|||15 %', '3 %|||3 %', '0.3 %|||0,3 %'], 1,
    '(2.3 − 2)/2 × 100 % = 15 %.|||(2,3 − 2)/2 × 100 % = 15 %.'),
  Q('q10', 'A sensible manual tuning order is|||Thứ tự chỉnh định thủ công hợp lý là',
    ['K_i first, then K_d, then K_p|||K_i trước, rồi K_d, rồi K_p', 'K_p, then K_d, then K_i|||K_p, rồi K_d, rồi K_i', 'All three at once|||Cả ba cùng lúc', 'Only K_d|||Chỉ K_d'], 1,
    'Get speed with P, damp with D, remove remaining error with I.|||Lấy tốc độ bằng P, làm tắt dần bằng D, khử sai số còn lại bằng I.'),
]);

const ch5 = {
  title: 'Chapter 5 — Basic control: feedback and PID|||Chương 5 — Điều khiển cơ bản: phản hồi và PID',
  description: 'Vòng hở và vòng kín, điều khiển bật–tắt, PID trực quan, mô phỏng và chỉnh định PID bằng Python (Lynch & Park ch. 11 · Craig ch. 9 · tài liệu PID của MATLAB).',
  lessons: [r51, r52, r53, q5],
};


// ───────────────────────────── Chương 6 — Nhập môn AI & tác tử ─────────────────────────────
const r61 = L('rai101-ts-6-1',
  '6.1 — What is artificial intelligence? Four approaches and a short history|||6.1 — Trí tuệ nhân tạo là gì? Bốn cách tiếp cận và lược sử',
  'Định nghĩa AI theo bốn cách tiếp cận của Russell & Norvig, phép thử Turing, các mốc lịch sử (Dartmouth 1956, mùa đông AI, học sâu), AI hẹp và AI tổng quát, AI trong robot.',
  `<span class="eyebrow">RAI101 · Chapter 6 · Lesson 6.1</span>
<h2>What is artificial intelligence? Four approaches and a short history</h2>
<p class="lead">The first half of this course built the robot's body and reflexes: sensors, motors, kinematics and PID. Now we turn to its “brain”. Artificial intelligence (AI) is the study of how to build systems that <strong>choose good actions</strong> — the part of a robot that decides <em>where</em> to go and <em>what</em> to do, not just how to spin a wheel.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the four approaches to defining AI and explain why this course uses the “rational agent” view.</li><li>Describe the Turing test and its limits.</li><li>Place key milestones of AI history on a timeline.</li><li>Distinguish narrow AI from artificial general intelligence.</li></ul>
<h3>📖 Lecture</h3>
<p>Russell &amp; Norvig (<em>AIMA</em>, ch. 1) organise definitions of AI along two questions: do we care about <strong>thinking</strong> or about <strong>acting</strong>, and do we measure success against <strong>humans</strong> or against an ideal of <strong>rationality</strong>? That gives four approaches:</p>
<div class="kv-grid"><div class="kv"><span class="k">Acting humanly</span><span class="v">the Turing test approach — behave so that people cannot tell it from a human</span></div><div class="kv"><span class="k">Thinking humanly</span><span class="v">cognitive modelling — reproduce how the human mind works</span></div><div class="kv"><span class="k">Thinking rationally</span><span class="v">the “laws of thought” — correct logical inference</span></div><div class="kv"><span class="k">Acting rationally</span><span class="v">the rational agent — do the action expected to achieve the best outcome</span></div></div>
<p>Most modern AI, and this course, takes the <strong>rational agent</strong> view: an AI system is an agent that perceives its environment and acts to maximise a performance measure. It is general (it covers logic, search, learning and control) and it is testable — we can measure whether the robot reached the goal, how fast and how safely. Rational does not mean perfect: the agent does the best it can with what it has perceived.</p>
<p><strong>The Turing test.</strong> In his 1950 paper <em>Computing Machinery and Intelligence</em>, Alan Turing proposed replacing “Can machines think?” with an imitation game: a judge chats by text with a human and a machine; if the judge cannot reliably tell which is which, the machine passes. The test is historically important, but it rewards <em>imitation</em> rather than usefulness, and a robot that folds laundry well is useful whether or not it can chat.</p>
<h3>⏳ A short history</h3>
<ul><li><b>1950</b> — Turing's paper. <b>1956</b> — the Dartmouth summer workshop (McCarthy, Minsky, Rochester, Shannon) gives the field its name.</li><li><b>1966–1972</b> — Shakey (SRI) combines a camera, planning and movement: the first mobile robot that reasoned about its actions; its research produced the A* search algorithm (Chapter 7).</li><li><b>1970s–1980s</b> — expert systems with hand-written rules; over-promising leads to “AI winters” of reduced funding.</li><li><b>1990s–2000s</b> — probability and machine learning; Deep Blue beats Kasparov at chess (1997); probabilistic robots navigate museums and deserts.</li><li><b>2012 →</b> — deep learning: AlexNet wins ImageNet (2012), AlphaGo beats Lee Sedol (2016), large language models such as ChatGPT (2022).</li></ul>
<p><strong>Narrow vs general.</strong> Every deployed AI today is <strong>narrow</strong>: excellent at one family of tasks (recognising faces, planning paths, translating text). <strong>Artificial general intelligence</strong> (AGI) — one system that learns and performs any intellectual task a human can — remains a research goal and a topic of debate.</p>
<h3>✍️ Worked example — classify the approach</h3>
<div class="callout"><p><b>Task.</b> Which approach does each system follow? (a) a chatbot contest judged by whether people think they talked to a person; (b) a theorem prover that only derives conclusions valid in logic; (c) a warehouse robot scored on parcels delivered per hour without collisions; (d) a psychology model that reproduces the reaction times of human subjects.</p>
<p><b>Step 1</b> — ask “thinking or acting?”: (a), (c) judge behaviour; (b), (d) judge internal reasoning. <b>Step 2</b> — ask “human or rational standard?”: (a), (d) compare with humans; (b), (c) compare with an ideal. <b>Answer:</b> (a) acting humanly, (b) thinking rationally, (c) acting rationally, (d) thinking humanly.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Equating AI with “robots that look human” — most AI has no body, and most robots have little AI.</li><li>Equating AI with machine learning only — search, planning, logic and probabilistic reasoning are AI too.</li><li>Believing passing a chat test means a system understands or is safe.</li><li>Treating “rational” as “always right” — rational means best expected outcome given the information available.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Four approaches: acting/thinking × humanly/rationally.</li><li>This course uses the rational agent view: perceive, then act to maximise a performance measure.</li><li>Turing test (1950) = imitation game; Dartmouth (1956) named the field.</li><li>History: symbolic AI → expert systems and AI winters → probability and ML → deep learning.</li><li>All AI deployed today is narrow; AGI is still an open research question.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/resources/lecture-1-introduction-and-scope/" target="_blank" rel="noopener">MIT OCW 6.034 — Lecture 1: Introduction and Scope (Patrick Winston)</a></li><li><a href="https://en.wikipedia.org/wiki/History_of_artificial_intelligence" target="_blank" rel="noopener">Wikipedia — History of artificial intelligence</a></li><li><a href="https://en.wikipedia.org/wiki/Computing_Machinery_and_Intelligence" target="_blank" rel="noopener">Wikipedia — Computing Machinery and Intelligence (Turing, 1950)</a></li><li><a href="https://www.youtube.com/playlist?list=PL8dPuuaLjXtO65LeD2p4_Sb5XQ51par_b" target="_blank" rel="noopener">CrashCourse — Artificial Intelligence (YouTube playlist)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A robot vacuum is rewarded for the area it cleans per charge. Which of the four approaches does this evaluation follow?</li><li>Give one argument for and one against using the Turing test to evaluate a service robot.</li><li>Put in order: AlexNet, Dartmouth workshop, Deep Blue, Shakey.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Acting rationally — it is judged on outcomes against a performance measure, not on human-likeness. 2) For: natural conversation matters for robots that talk with customers. Against: it says nothing about whether the robot does its physical job safely and well. 3) Dartmouth (1956) → Shakey (1966–72) → Deep Blue (1997) → AlexNet (2012).</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 6 · Bài 6.1</span>
<h2>Trí tuệ nhân tạo là gì? Bốn cách tiếp cận và lược sử</h2>
<p class="lead">Nửa đầu môn học đã dựng phần thân và phản xạ của robot: cảm biến, động cơ, động học và PID. Giờ ta chuyển sang “bộ não”. Trí tuệ nhân tạo (AI) nghiên cứu cách xây dựng hệ thống <strong>chọn hành động tốt</strong> — phần của robot quyết định <em>đi đâu</em> và <em>làm gì</em>, chứ không chỉ quay bánh xe thế nào.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nêu bốn cách tiếp cận định nghĩa AI và giải thích vì sao môn này dùng quan điểm “tác tử hợp lý”.</li><li>Mô tả phép thử Turing và giới hạn của nó.</li><li>Đặt các mốc chính của lịch sử AI lên trục thời gian.</li><li>Phân biệt AI hẹp và trí tuệ nhân tạo tổng quát.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Russell &amp; Norvig (<em>AIMA</em>, chương 1) sắp xếp các định nghĩa AI theo hai câu hỏi: ta quan tâm tới <strong>suy nghĩ</strong> hay <strong>hành động</strong>, và đo thành công so với <strong>con người</strong> hay so với một chuẩn <strong>hợp lý</strong> lý tưởng? Từ đó có bốn cách tiếp cận:</p>
<div class="kv-grid"><div class="kv"><span class="k">Hành động như người</span><span class="v">cách của phép thử Turing — cư xử sao cho người không phân biệt được với con người</span></div><div class="kv"><span class="k">Suy nghĩ như người</span><span class="v">mô hình hoá nhận thức — tái tạo cách trí óc con người vận hành</span></div><div class="kv"><span class="k">Suy nghĩ hợp lý</span><span class="v">“các quy luật tư duy” — suy diễn logic đúng đắn</span></div><div class="kv"><span class="k">Hành động hợp lý</span><span class="v">tác tử hợp lý — chọn hành động kỳ vọng đem lại kết quả tốt nhất</span></div></div>
<p>Phần lớn AI hiện đại, và môn học này, theo quan điểm <strong>tác tử hợp lý</strong>: hệ AI là một tác tử cảm nhận môi trường và hành động để tối đa hoá một thước đo hiệu năng. Quan điểm này tổng quát (bao cả logic, tìm kiếm, học máy, điều khiển) và kiểm chứng được — ta đo được robot có tới đích không, nhanh thế nào, an toàn ra sao. Hợp lý không có nghĩa là hoàn hảo: tác tử làm tốt nhất có thể với những gì nó đã cảm nhận.</p>
<p><strong>Phép thử Turing.</strong> Trong bài báo năm 1950 <em>Computing Machinery and Intelligence</em>, Alan Turing đề xuất thay câu hỏi “Máy có thể nghĩ không?” bằng một trò chơi bắt chước: giám khảo nhắn tin với một người và một máy; nếu giám khảo không phân biệt được một cách đáng tin cậy, máy đạt. Phép thử quan trọng về mặt lịch sử, nhưng nó thưởng cho sự <em>bắt chước</em> chứ không cho sự hữu ích — một robot gấp quần áo giỏi vẫn hữu ích dù nó có biết trò chuyện hay không.</p>
<h3>⏳ Lược sử</h3>
<ul><li><b>1950</b> — bài báo của Turing. <b>1956</b> — hội thảo mùa hè Dartmouth (McCarthy, Minsky, Rochester, Shannon) đặt tên cho ngành.</li><li><b>1966–1972</b> — Shakey (SRI) kết hợp camera, lập kế hoạch và di chuyển: robot di động đầu tiên biết suy luận về hành động của mình; dự án này sinh ra thuật toán tìm kiếm A* (Chương 7).</li><li><b>Thập niên 1970–1980</b> — hệ chuyên gia với luật viết tay; hứa hẹn quá đà dẫn tới các “mùa đông AI” bị cắt tài trợ.</li><li><b>Thập niên 1990–2000</b> — xác suất và học máy; Deep Blue thắng Kasparov ở cờ vua (1997); robot xác suất dẫn đường trong bảo tàng và qua sa mạc.</li><li><b>2012 →</b> — học sâu: AlexNet thắng ImageNet (2012), AlphaGo thắng Lee Sedol (2016), các mô hình ngôn ngữ lớn như ChatGPT (2022).</li></ul>
<p><strong>Hẹp và tổng quát.</strong> Mọi AI đang được triển khai hôm nay đều là AI <strong>hẹp</strong>: rất giỏi một nhóm việc (nhận diện khuôn mặt, lập đường đi, dịch văn bản). <strong>Trí tuệ nhân tạo tổng quát</strong> (AGI) — một hệ thống học và làm được mọi việc trí tuệ mà con người làm được — vẫn là mục tiêu nghiên cứu và còn nhiều tranh luận.</p>
<h3>✍️ Ví dụ — phân loại cách tiếp cận</h3>
<div class="callout"><p><b>Đề.</b> Mỗi hệ sau theo cách tiếp cận nào? (a) cuộc thi chatbot chấm theo việc người dùng có tưởng mình nói chuyện với người thật không; (b) chương trình chứng minh định lý chỉ rút ra kết luận hợp lệ về logic; (c) robot kho hàng được chấm theo số kiện giao mỗi giờ mà không va chạm; (d) mô hình tâm lý học tái tạo thời gian phản xạ của người tham gia thí nghiệm.</p>
<p><b>Bước 1</b> — hỏi “suy nghĩ hay hành động?”: (a), (c) chấm hành vi; (b), (d) chấm quá trình suy luận bên trong. <b>Bước 2</b> — hỏi “chuẩn con người hay chuẩn hợp lý?”: (a), (d) so với người; (b), (c) so với chuẩn lý tưởng. <b>Kết quả:</b> (a) hành động như người, (b) suy nghĩ hợp lý, (c) hành động hợp lý, (d) suy nghĩ như người.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đồng nhất AI với “robot trông giống người” — phần lớn AI không có thân thể, và phần lớn robot có rất ít AI.</li><li>Đồng nhất AI với học máy — tìm kiếm, lập kế hoạch, logic và suy luận xác suất cũng là AI.</li><li>Tin rằng qua được phép thử trò chuyện nghĩa là hệ thống hiểu hoặc an toàn.</li><li>Coi “hợp lý” là “luôn đúng” — hợp lý là kết quả kỳ vọng tốt nhất với thông tin đang có.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bốn cách tiếp cận: hành động/suy nghĩ × như người/hợp lý.</li><li>Môn này dùng quan điểm tác tử hợp lý: cảm nhận rồi hành động để tối đa hoá thước đo hiệu năng.</li><li>Phép thử Turing (1950) = trò chơi bắt chước; Dartmouth (1956) đặt tên ngành.</li><li>Lịch sử: AI ký hiệu → hệ chuyên gia và mùa đông AI → xác suất và học máy → học sâu.</li><li>Mọi AI triển khai hôm nay là AI hẹp; AGI vẫn là câu hỏi nghiên cứu mở.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/resources/lecture-1-introduction-and-scope/" target="_blank" rel="noopener">MIT OCW 6.034 — Bài giảng 1: Giới thiệu và phạm vi (Patrick Winston)</a></li><li><a href="https://en.wikipedia.org/wiki/History_of_artificial_intelligence" target="_blank" rel="noopener">Wikipedia — Lịch sử trí tuệ nhân tạo (tiếng Anh)</a></li><li><a href="https://en.wikipedia.org/wiki/Computing_Machinery_and_Intelligence" target="_blank" rel="noopener">Wikipedia — Computing Machinery and Intelligence (Turing, 1950)</a></li><li><a href="https://www.youtube.com/playlist?list=PL8dPuuaLjXtO65LeD2p4_Sb5XQ51par_b" target="_blank" rel="noopener">CrashCourse — Artificial Intelligence (danh sách video YouTube)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Robot hút bụi được chấm điểm theo diện tích làm sạch mỗi lần sạc. Cách đánh giá này thuộc cách tiếp cận nào trong bốn cách?</li><li>Nêu một lý lẽ ủng hộ và một lý lẽ phản đối việc dùng phép thử Turing để đánh giá robot phục vụ.</li><li>Sắp xếp theo thời gian: AlexNet, hội thảo Dartmouth, Deep Blue, Shakey.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Hành động hợp lý — được chấm theo kết quả so với thước đo hiệu năng, không theo độ giống người. 2) Ủng hộ: trò chuyện tự nhiên quan trọng với robot giao tiếp với khách. Phản đối: nó không nói gì về việc robot có làm công việc vật lý an toàn và tốt hay không. 3) Dartmouth (1956) → Shakey (1966–72) → Deep Blue (1997) → AlexNet (2012).</p></div>`);

const r62 = L('rai101-ts-6-2',
  '6.2 — Intelligent agents: PEAS, environment types and agent architectures|||6.2 — Tác tử thông minh: PEAS, loại môi trường và kiến trúc tác tử',
  'Tác tử, cảm nhận, hành động, tính hợp lý; mô tả PEAS; bảy chiều phân loại môi trường; năm loại tác tử; tác tử phản xạ hút bụi chạy thật bằng Python.',
  `<span class="eyebrow">RAI101 · Chapter 6 · Lesson 6.2</span>
<h2>Intelligent agents: PEAS, environment types and agent architectures</h2>
<p class="lead">An <strong>agent</strong> is anything that perceives its environment through <strong>sensors</strong> and acts on it through <strong>actuators</strong>. A robot is the most literal agent there is — and the sense–think–act loop from Chapter 1 is exactly the agent loop of AI.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define agent, percept, percept sequence, agent function and rational agent.</li><li>Write a PEAS description for a robot task.</li><li>Classify environments along the standard dimensions.</li><li>Compare the five agent architectures and run a simple reflex agent.</li></ul>
<h3>📖 Lecture</h3>
<p>What an agent senses at one instant is a <strong>percept</strong>; everything it has ever sensed is its <strong>percept sequence</strong>. Mathematically, the agent's behaviour is an <strong>agent function</strong> from percept sequences to actions; the code running on the robot that implements it is the <strong>agent program</strong>. A <strong>rational agent</strong> chooses, for each percept sequence, the action expected to maximise its <strong>performance measure</strong>, given its built-in knowledge.</p>
<p><strong>PEAS.</strong> Before designing an agent we specify its task environment: <b>P</b>erformance measure, <b>E</b>nvironment, <b>A</b>ctuators, <b>S</b>ensors. AIMA's classic example is an automated taxi:</p>
<div class="kv-grid"><div class="kv"><span class="k">Performance</span><span class="v">safe, fast, legal, comfortable trip; maximise profit; minimise impact on other road users</span></div><div class="kv"><span class="k">Environment</span><span class="v">roads, other traffic, police, pedestrians, customers, weather</span></div><div class="kv"><span class="k">Actuators</span><span class="v">steering, accelerator, brake, signal, horn, display, speech</span></div><div class="kv"><span class="k">Sensors</span><span class="v">cameras, radar, speedometer, GPS, engine sensors, accelerometer, microphones, touchscreen</span></div></div>
<p><strong>Environment properties.</strong> The difficulty of a task depends on its environment:</p>
<ul><li><b>Fully vs partially observable</b> — do sensors show the whole relevant state? (chess: fully; a robot behind a wall: partially)</li><li><b>Single vs multi-agent</b> — are there other agents (other cars, people)?</li><li><b>Deterministic vs nondeterministic/stochastic</b> — is the next state fully determined by the current state and action? (wheels slip ⇒ stochastic)</li><li><b>Episodic vs sequential</b> — do current decisions affect future ones? (inspecting parts one by one: episodic; driving: sequential)</li><li><b>Static vs dynamic</b> — does the world change while the agent thinks?</li><li><b>Discrete vs continuous</b> — states, time and actions in finite steps or real numbers?</li><li><b>Known vs unknown</b> — does the agent know the rules (“physics”) of the environment?</li></ul>
<p>Real robots usually face the hardest combination: partially observable, multi-agent, stochastic, sequential, dynamic, continuous.</p>
<p><strong>Five agent architectures</strong> (from simple to powerful): (1) <b>simple reflex</b> — condition–action rules on the current percept; (2) <b>model-based reflex</b> — keeps an internal state of the parts of the world it cannot see; (3) <b>goal-based</b> — considers which actions lead to a goal (search and planning); (4) <b>utility-based</b> — compares how <em>good</em> outcomes are (fast vs safe); (5) <b>learning agent</b> — improves any of the above from experience.</p>
<h3>✍️ Worked example — a reflex vacuum agent</h3>
<p>AIMA's two-square vacuum world: squares A and B may be dirty; the agent perceives its location and whether that square is dirty; actions are Suck, Left, Right; the performance measure gives +1 for each clean square at each time step.</p>
<pre><code class="language-python"># Two-square vacuum world (AIMA ch. 2): squares A and B, each Clean or Dirty
def reflex_vacuum_agent(percept):
    location, status = percept
    if status == "Dirty":
        return "Suck"
    return "Right" if location == "A" else "Left"

world = {"A": "Dirty", "B": "Dirty"}
location, score = "A", 0
for step in range(1, 7):
    percept = (location, world[location])
    action = reflex_vacuum_agent(percept)
    if action == "Suck":
        world[location] = "Clean"
    elif action == "Right":
        location = "B"
    else:
        location = "A"
    score += sum(1 for s in world.values() if s == "Clean")   # +1 per clean square per step
    print(step, percept, "-&gt;", action, "| world:", world, "| score:", score)</code></pre>
<div class="out">1 ('A', 'Dirty') -&gt; Suck | world: {'A': 'Clean', 'B': 'Dirty'} | score: 1
2 ('A', 'Clean') -&gt; Right | world: {'A': 'Clean', 'B': 'Dirty'} | score: 2
3 ('B', 'Dirty') -&gt; Suck | world: {'A': 'Clean', 'B': 'Clean'} | score: 4
4 ('B', 'Clean') -&gt; Left | world: {'A': 'Clean', 'B': 'Clean'} | score: 6
5 ('A', 'Clean') -&gt; Right | world: {'A': 'Clean', 'B': 'Clean'} | score: 8
6 ('B', 'Clean') -&gt; Left | world: {'A': 'Clean', 'B': 'Clean'} | score: 10</div>
<div class="callout"><p><b>Step by step.</b> Step 1 sees (A, Dirty) → Suck; the score rises by 1 (A clean). Step 2 sees A clean → Right. Step 3 cleans B; now both squares are clean, so each later step adds 2. From step 4 on, the agent keeps moving Left/Right forever — it cannot remember that everything is already clean. A <b>model-based</b> agent that stores “A clean, B clean” could stop and save energy; if moving cost −1 per step, that difference would matter to the score.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing a performance measure for what the agent <em>does</em> (“moves a lot”) instead of what we <em>want</em> (“floor is clean”).</li><li>Calling an environment fully observable because the sensor is high-resolution — occluded objects still make it partial.</li><li>Confusing the agent function (abstract mapping) with the agent program (the actual code).</li><li>Using a simple reflex agent in a partially observable world: it can loop forever.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Agent = sensors + actuators + a program mapping percepts to actions.</li><li>Rational = maximise expected performance given percepts and knowledge.</li><li>Specify tasks with PEAS before designing.</li><li>Seven environment dimensions; robots face the hardest ones.</li><li>Architectures: simple reflex → model-based → goal-based → utility-based → learning.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://aima.cs.berkeley.edu/" target="_blank" rel="noopener">AIMA official site (Russell &amp; Norvig) — chapter 2 “Intelligent Agents”</a></li><li><a href="https://github.com/aimacode/aima-python" target="_blank" rel="noopener">aimacode/aima-python — Python code for AIMA, including agents.py</a></li><li><a href="https://en.wikipedia.org/wiki/Intelligent_agent" target="_blank" rel="noopener">Wikipedia — Intelligent agent</a></li><li><a href="https://www.ibm.com/think/topics/ai-agents" target="_blank" rel="noopener">IBM — What are AI agents?</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write a PEAS description for a robot that picks ripe strawberries in a greenhouse.</li><li>Classify the environment of a robot playing table tennis against a human (observable? agents? deterministic? episodic? static? discrete?).</li><li>In the program above, change the performance measure to subtract 1 for every Left or Right move. Which agent type would score better, and why?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) P: ripe berries picked per hour, berries not damaged, no harm to plants or people. E: greenhouse rows, plants, berries at different ripeness, workers, changing light. A: arm joints, soft gripper, mobile base wheels. S: RGB/depth cameras, joint encoders, force sensor in the gripper. 2) Partially observable (spin, occlusion), multi-agent (competitive), stochastic, sequential, dynamic, continuous. 3) A model-based agent: it remembers both squares are clean and stops moving, avoiding the −1 penalties that the reflex agent collects forever.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 6 · Bài 6.2</span>
<h2>Tác tử thông minh: PEAS, loại môi trường và kiến trúc tác tử</h2>
<p class="lead"><strong>Tác tử</strong> (agent) là bất cứ thứ gì cảm nhận môi trường qua <strong>cảm biến</strong> và tác động lên nó qua <strong>cơ cấu chấp hành</strong>. Robot là tác tử theo nghĩa đen nhất — và vòng cảm nhận–suy nghĩ–hành động ở Chương 1 chính là vòng tác tử của AI.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa tác tử, cảm nhận (percept), chuỗi cảm nhận, hàm tác tử và tác tử hợp lý.</li><li>Viết mô tả PEAS cho một nhiệm vụ robot.</li><li>Phân loại môi trường theo các chiều chuẩn.</li><li>So sánh năm kiến trúc tác tử và chạy một tác tử phản xạ đơn giản.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Thứ tác tử cảm nhận tại một thời điểm là một <strong>cảm nhận</strong> (percept); mọi thứ nó từng cảm nhận là <strong>chuỗi cảm nhận</strong>. Về mặt toán, hành vi của tác tử là một <strong>hàm tác tử</strong> ánh xạ chuỗi cảm nhận sang hành động; đoạn code chạy trên robot hiện thực hàm đó là <strong>chương trình tác tử</strong>. <strong>Tác tử hợp lý</strong> chọn, với mỗi chuỗi cảm nhận, hành động kỳ vọng tối đa hoá <strong>thước đo hiệu năng</strong>, dựa trên tri thức có sẵn.</p>
<p><strong>PEAS.</strong> Trước khi thiết kế tác tử, ta mô tả môi trường nhiệm vụ: <b>P</b>erformance (thước đo hiệu năng), <b>E</b>nvironment (môi trường), <b>A</b>ctuators (cơ cấu chấp hành), <b>S</b>ensors (cảm biến). Ví dụ kinh điển trong AIMA là taxi tự lái:</p>
<div class="kv-grid"><div class="kv"><span class="k">Hiệu năng</span><span class="v">chuyến đi an toàn, nhanh, đúng luật, êm; tối đa lợi nhuận; ít ảnh hưởng tới người tham gia giao thông khác</span></div><div class="kv"><span class="k">Môi trường</span><span class="v">đường sá, xe khác, cảnh sát, người đi bộ, khách hàng, thời tiết</span></div><div class="kv"><span class="k">Chấp hành</span><span class="v">vô-lăng, ga, phanh, xi-nhan, còi, màn hình, giọng nói</span></div><div class="kv"><span class="k">Cảm biến</span><span class="v">camera, radar, đồng hồ tốc độ, GPS, cảm biến động cơ, gia tốc kế, micro, màn hình cảm ứng</span></div></div>
<p><strong>Tính chất môi trường.</strong> Độ khó của nhiệm vụ phụ thuộc môi trường:</p>
<ul><li><b>Quan sát đầy đủ hay một phần</b> — cảm biến có thấy toàn bộ trạng thái liên quan? (cờ vua: đầy đủ; robot sau bức tường: một phần)</li><li><b>Một hay nhiều tác tử</b> — có tác tử khác (xe khác, con người)?</li><li><b>Tất định hay không tất định/ngẫu nhiên</b> — trạng thái kế tiếp có được xác định hoàn toàn bởi trạng thái và hành động hiện tại? (bánh xe trượt ⇒ ngẫu nhiên)</li><li><b>Từng đợt hay tuần tự</b> — quyết định hiện tại có ảnh hưởng quyết định sau? (kiểm từng chi tiết: từng đợt; lái xe: tuần tự)</li><li><b>Tĩnh hay động</b> — thế giới có thay đổi trong lúc tác tử suy nghĩ?</li><li><b>Rời rạc hay liên tục</b> — trạng thái, thời gian, hành động theo bước hữu hạn hay số thực?</li><li><b>Đã biết hay chưa biết</b> — tác tử có biết “luật vật lý” của môi trường?</li></ul>
<p>Robot thật thường gặp tổ hợp khó nhất: quan sát một phần, nhiều tác tử, ngẫu nhiên, tuần tự, động, liên tục.</p>
<p><strong>Năm kiến trúc tác tử</strong> (từ đơn giản tới mạnh): (1) <b>phản xạ đơn giản</b> — luật điều kiện–hành động trên cảm nhận hiện tại; (2) <b>phản xạ dựa trên mô hình</b> — giữ trạng thái nội bộ về phần thế giới không nhìn thấy; (3) <b>dựa trên mục tiêu</b> — xét hành động nào dẫn tới mục tiêu (tìm kiếm, lập kế hoạch); (4) <b>dựa trên độ hữu ích</b> — so sánh kết quả <em>tốt</em> tới mức nào (nhanh hay an toàn); (5) <b>tác tử học</b> — cải thiện bất kỳ loại trên từ kinh nghiệm.</p>
<h3>✍️ Ví dụ — tác tử phản xạ hút bụi</h3>
<p>Thế giới hút bụi hai ô của AIMA: ô A và B có thể bẩn; tác tử cảm nhận vị trí của nó và ô đó có bẩn không; hành động là Suck (hút), Left, Right; thước đo hiệu năng cộng +1 cho mỗi ô sạch ở mỗi bước thời gian.</p>
<pre><code class="language-python"># Two-square vacuum world (AIMA ch. 2): squares A and B, each Clean or Dirty
def reflex_vacuum_agent(percept):
    location, status = percept
    if status == "Dirty":
        return "Suck"
    return "Right" if location == "A" else "Left"

world = {"A": "Dirty", "B": "Dirty"}
location, score = "A", 0
for step in range(1, 7):
    percept = (location, world[location])
    action = reflex_vacuum_agent(percept)
    if action == "Suck":
        world[location] = "Clean"
    elif action == "Right":
        location = "B"
    else:
        location = "A"
    score += sum(1 for s in world.values() if s == "Clean")   # +1 per clean square per step
    print(step, percept, "-&gt;", action, "| world:", world, "| score:", score)</code></pre>
<div class="out">1 ('A', 'Dirty') -&gt; Suck | world: {'A': 'Clean', 'B': 'Dirty'} | score: 1
2 ('A', 'Clean') -&gt; Right | world: {'A': 'Clean', 'B': 'Dirty'} | score: 2
3 ('B', 'Dirty') -&gt; Suck | world: {'A': 'Clean', 'B': 'Clean'} | score: 4
4 ('B', 'Clean') -&gt; Left | world: {'A': 'Clean', 'B': 'Clean'} | score: 6
5 ('A', 'Clean') -&gt; Right | world: {'A': 'Clean', 'B': 'Clean'} | score: 8
6 ('B', 'Clean') -&gt; Left | world: {'A': 'Clean', 'B': 'Clean'} | score: 10</div>
<div class="callout"><p><b>Từng bước.</b> Bước 1 thấy (A, Dirty) → Suck; điểm tăng 1 (A sạch). Bước 2 thấy A sạch → Right. Bước 3 hút B; giờ cả hai ô sạch nên mỗi bước sau cộng 2. Từ bước 4, tác tử cứ đi Left/Right mãi mãi — nó không nhớ được rằng mọi thứ đã sạch. Một tác tử <b>dựa trên mô hình</b> lưu “A sạch, B sạch” có thể dừng lại để tiết kiệm năng lượng; nếu mỗi bước di chuyển bị trừ 1 điểm thì khác biệt đó rất đáng kể.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết thước đo hiệu năng theo việc tác tử <em>làm</em> (“di chuyển nhiều”) thay vì điều ta <em>muốn</em> (“sàn sạch”).</li><li>Gọi môi trường là quan sát đầy đủ chỉ vì cảm biến có độ phân giải cao — vật bị che khuất vẫn khiến nó chỉ quan sát một phần.</li><li>Nhầm hàm tác tử (ánh xạ trừu tượng) với chương trình tác tử (code thật).</li><li>Dùng tác tử phản xạ đơn giản trong thế giới quan sát một phần: nó có thể lặp vô hạn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tác tử = cảm biến + cơ cấu chấp hành + chương trình ánh xạ cảm nhận sang hành động.</li><li>Hợp lý = tối đa hiệu năng kỳ vọng dựa trên cảm nhận và tri thức.</li><li>Mô tả nhiệm vụ bằng PEAS trước khi thiết kế.</li><li>Bảy chiều phân loại môi trường; robot gặp những chiều khó nhất.</li><li>Kiến trúc: phản xạ đơn giản → dựa trên mô hình → dựa trên mục tiêu → dựa trên độ hữu ích → tác tử học.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://aima.cs.berkeley.edu/" target="_blank" rel="noopener">Trang chính thức AIMA (Russell &amp; Norvig) — chương 2 “Intelligent Agents”</a></li><li><a href="https://github.com/aimacode/aima-python" target="_blank" rel="noopener">aimacode/aima-python — code Python của AIMA, có agents.py</a></li><li><a href="https://en.wikipedia.org/wiki/Intelligent_agent" target="_blank" rel="noopener">Wikipedia — Tác tử thông minh (tiếng Anh)</a></li><li><a href="https://www.ibm.com/think/topics/ai-agents" target="_blank" rel="noopener">IBM — AI agent là gì? (tiếng Anh)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết mô tả PEAS cho robot hái dâu tây chín trong nhà kính.</li><li>Phân loại môi trường của robot đánh bóng bàn với người (quan sát? số tác tử? tất định? từng đợt? tĩnh? rời rạc?).</li><li>Trong chương trình trên, đổi thước đo hiệu năng: trừ 1 cho mỗi lần Left hoặc Right. Loại tác tử nào sẽ được điểm cao hơn, vì sao?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) P: số quả chín hái được mỗi giờ, quả không dập, không gây hại cây và người. E: các luống trong nhà kính, cây, quả ở nhiều độ chín, công nhân, ánh sáng thay đổi. A: các khớp tay máy, tay kẹp mềm, bánh xe của đế di động. S: camera màu/độ sâu, encoder khớp, cảm biến lực ở tay kẹp. 2) Quan sát một phần (xoáy bóng, che khuất), nhiều tác tử (đối kháng), ngẫu nhiên, tuần tự, động, liên tục. 3) Tác tử dựa trên mô hình: nó nhớ hai ô đã sạch và ngừng di chuyển, tránh các lần bị trừ 1 điểm mà tác tử phản xạ cứ nhận mãi.</p></div>`);

const r63 = L('rai101-ts-6-3',
  '6.3 — Problem formulation and state spaces|||6.3 — Phát biểu bài toán và không gian trạng thái',
  'Năm thành phần của bài toán tìm kiếm (trạng thái đầu, hành động, mô hình chuyển, kiểm tra đích, chi phí), không gian trạng thái của thế giới hút bụi, 8-puzzle, bài toán dẫn đường robot; code Python liệt kê trạng thái.',
  `<span class="eyebrow">RAI101 · Chapter 6 · Lesson 6.3</span>
<h2>Problem formulation and state spaces</h2>
<p class="lead">A goal-based agent must think ahead: “if I do this, then that, will I reach the goal?” To let a computer think ahead we first turn the real task into a precise <strong>search problem</strong>. Choosing that formulation well is often more important than the search algorithm itself.</p>
<h3>🎯 Objectives</h3>
<ul><li>List the components of a search problem.</li><li>Formulate a toy problem and a robot navigation problem.</li><li>Count the size of a state space and explain why size matters.</li><li>Explain abstraction: removing details that do not affect the solution.</li></ul>
<h3>📖 Lecture</h3>
<p>Following AIMA (ch. 3), a search problem is defined by:</p>
<div class="formula"><span class="lbl">Search problem</span>state space S · initial state s<sub>0</sub> · ACTIONS(s) · transition model RESULT(s, a) · goal test (set of goal states) · action cost c(s, a, s′)</div>
<ul><li><b>State space</b> — every configuration the world can be in, as far as the problem cares.</li><li><b>Initial state</b> — where the agent starts.</li><li><b>Actions</b> — what can be done in state s.</li><li><b>Transition model</b> — the state that results from doing a in s.</li><li><b>Goal test</b> — is this a goal state?</li><li><b>Action cost</b> — distance, time, energy; the <b>path cost</b> is the sum.</li></ul>
<p>A <strong>solution</strong> is a sequence of actions from the initial state to a goal; an <strong>optimal solution</strong> has the lowest path cost. The state space can be drawn as a graph: nodes are states, edges are actions. Searching means exploring that graph.</p>
<p><strong>Abstraction.</strong> A real robot's state includes battery temperature, dust on the camera, the exact angle of every wheel. For “find a route through the building”, we abstract to <em>which room (or grid cell) am I in</em>. A good abstraction keeps every detail that affects the solution and drops everything else; any abstract solution must still be executable by the real robot (the controllers from Chapter 5 handle the low-level motion).</p>
<p><strong>Size matters.</strong> The two-square vacuum world has 2 locations × 2 × 2 dirt states = 8 states. The 8-puzzle has 9!/2 = 181 440 reachable states; the 15-puzzle about 1.05 × 10<sup>13</sup>. A robot on a 100 × 100 grid facing 4 directions has 40 000 states. Exhaustive search is fine for small spaces; large ones need the heuristics of Chapter 7.</p>
<h3>✍️ Worked example 1 — the vacuum world in code</h3>
<pre><code class="language-python">from itertools import product
from math import factorial

# Vacuum world state = (robot location, status of A, status of B)
states = list(product("AB", "CD", "CD"))          # C = clean, D = dirty
print("vacuum states:", len(states))

def result(state, action):                        # transition model
    loc, a, b = state
    if action == "Left":  return ("A", a, b)
    if action == "Right": return ("B", a, b)
    if loc == "A": return (loc, "C", b)           # Suck
    return (loc, a, "C")

start = ("A", "D", "D")
for act in ("Suck", "Right", "Suck"):
    nxt = result(start, act)
    print(start, "--" + act + "-&gt;", nxt)
    start = nxt
print("goal reached:", start[1:] == ("C", "C"))

print("8-puzzle reachable states:", factorial(9) // 2)
print("15-puzzle reachable states:", factorial(16) // 2)</code></pre>
<div class="out">vacuum states: 8
('A', 'D', 'D') --Suck-&gt; ('A', 'C', 'D')
('A', 'C', 'D') --Right-&gt; ('B', 'C', 'D')
('B', 'C', 'D') --Suck-&gt; ('B', 'C', 'C')
goal reached: True
8-puzzle reachable states: 181440
15-puzzle reachable states: 10461394944000</div>
<div class="callout"><p><b>What the code shows.</b> (1) product("AB", "CD", "CD") lists all 8 states. (2) result() is the transition model written as a function. (3) Starting from (A, dirty, dirty), the plan Suck → Right → Suck reaches a state where both squares are clean, so the goal test is true; with cost 1 per action the path cost is 3, which is optimal. (4) The puzzle counts show how fast state spaces explode.</p></div>
<h3>✍️ Worked example 2 — a delivery robot in a building</h3>
<div class="callout"><p><b>Task.</b> A robot must carry a parcel from the lobby to room 305.</p>
<p><b>States:</b> (floor, cell on the floor's grid map, carrying parcel yes/no). <b>Initial:</b> (1, lobby cell, yes). <b>Actions:</b> move N/S/E/W to a free neighbouring cell; enter the lift; choose a floor; drop the parcel. <b>Transition model:</b> a move changes the cell unless the target cell is a wall; the lift changes the floor. <b>Goal:</b> parcel dropped in room 305. <b>Cost:</b> 1 per metre moved, plus 20 for using the lift (waiting time). Notice what we left out: lighting, colour of the walls, people's names — and what we kept because it changes the answer: walls, floors, the lift.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Putting too much detail in the state (exact wheel angles) — the space explodes for no benefit.</li><li>Leaving out something that matters (whether the parcel is carried), so the “solution” cannot work.</li><li>Confusing a state (a snapshot of the world) with a node of a search tree (a state plus the path that reached it).</li><li>Forgetting action costs: the shortest number of steps is not always the cheapest route.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Search problem = state space, initial state, actions, transition model, goal test, action costs.</li><li>Solution = action sequence to a goal; optimal = lowest path cost.</li><li>State space = graph; search explores it.</li><li>Abstract away irrelevant detail, but keep what affects the solution.</li><li>State spaces grow explosively (8-puzzle: 181 440 states).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://cs50.harvard.edu/ai/notes/0/" target="_blank" rel="noopener">CS50 AI with Python — Lecture 0 notes: Search</a></li><li><a href="https://en.wikipedia.org/wiki/State_space_search" target="_blank" rel="noopener">Wikipedia — State-space search</a></li><li><a href="https://en.wikipedia.org/wiki/15_puzzle" target="_blank" rel="noopener">Wikipedia — 15 puzzle (and its solvability)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many states does a three-square vacuum world (A, B, C in a row) have?</li><li>Formulate the problem “a robot arm must stack block A on block B” with three blocks on a table: what is a state, what are the actions, what is the goal?</li><li>A robot works on a 50 × 40 grid and its state is (cell, heading ∈ {N, E, S, W}). How many states?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 3 locations × 2<sup>3</sup> dirt combinations = 24 states. 2) State: which block is on which (or on the table) and whether the gripper is holding a block; actions: pick up a clear block, put the held block on the table or on a clear block; goal: any state where A is on B. 3) 50 × 40 × 4 = 8 000 states.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 6 · Bài 6.3</span>
<h2>Phát biểu bài toán và không gian trạng thái</h2>
<p class="lead">Tác tử dựa trên mục tiêu phải biết nghĩ trước: “nếu làm việc này rồi việc kia, mình có tới đích không?” Để máy tính nghĩ trước được, ta phải biến nhiệm vụ thật thành một <strong>bài toán tìm kiếm</strong> chính xác. Phát biểu bài toán tốt thường quan trọng hơn cả thuật toán tìm kiếm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Liệt kê các thành phần của một bài toán tìm kiếm.</li><li>Phát biểu một bài toán đồ chơi và một bài toán dẫn đường robot.</li><li>Đếm kích thước không gian trạng thái và giải thích vì sao kích thước quan trọng.</li><li>Giải thích trừu tượng hoá: bỏ chi tiết không ảnh hưởng tới lời giải.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Theo AIMA (chương 3), một bài toán tìm kiếm gồm:</p>
<div class="formula"><span class="lbl">Bài toán tìm kiếm</span>không gian trạng thái S · trạng thái đầu s<sub>0</sub> · ACTIONS(s) · mô hình chuyển RESULT(s, a) · kiểm tra đích (tập trạng thái đích) · chi phí hành động c(s, a, s′)</div>
<ul><li><b>Không gian trạng thái</b> — mọi cấu hình thế giới có thể có, xét theo những gì bài toán quan tâm.</li><li><b>Trạng thái đầu</b> — nơi tác tử bắt đầu.</li><li><b>Hành động</b> — những gì làm được ở trạng thái s.</li><li><b>Mô hình chuyển</b> — trạng thái thu được khi làm a ở s.</li><li><b>Kiểm tra đích</b> — đây có phải trạng thái đích?</li><li><b>Chi phí hành động</b> — quãng đường, thời gian, năng lượng; <b>chi phí đường đi</b> là tổng của chúng.</li></ul>
<p><strong>Lời giải</strong> là chuỗi hành động từ trạng thái đầu tới một trạng thái đích; <strong>lời giải tối ưu</strong> có chi phí đường đi nhỏ nhất. Không gian trạng thái vẽ được thành đồ thị: đỉnh là trạng thái, cạnh là hành động. Tìm kiếm nghĩa là khám phá đồ thị đó.</p>
<p><strong>Trừu tượng hoá.</strong> Trạng thái thật của robot gồm cả nhiệt độ pin, bụi trên camera, góc chính xác của từng bánh xe. Với bài toán “tìm đường trong toà nhà”, ta trừu tượng thành <em>tôi đang ở phòng (hay ô lưới) nào</em>. Trừu tượng tốt giữ mọi chi tiết ảnh hưởng tới lời giải và bỏ phần còn lại; lời giải trừu tượng vẫn phải thực hiện được bởi robot thật (các bộ điều khiển ở Chương 5 lo chuyển động cấp thấp).</p>
<p><strong>Kích thước quan trọng.</strong> Thế giới hút bụi hai ô có 2 vị trí × 2 × 2 trạng thái bụi = 8 trạng thái. 8-puzzle có 9!/2 = 181 440 trạng thái tới được; 15-puzzle khoảng 1,05 × 10<sup>13</sup>. Robot trên lưới 100 × 100 với 4 hướng có 40 000 trạng thái. Tìm kiếm vét cạn ổn với không gian nhỏ; không gian lớn cần heuristic ở Chương 7.</p>
<h3>✍️ Ví dụ 1 — thế giới hút bụi bằng code</h3>
<pre><code class="language-python">from itertools import product
from math import factorial

# Vacuum world state = (robot location, status of A, status of B)
states = list(product("AB", "CD", "CD"))          # C = clean, D = dirty
print("vacuum states:", len(states))

def result(state, action):                        # transition model
    loc, a, b = state
    if action == "Left":  return ("A", a, b)
    if action == "Right": return ("B", a, b)
    if loc == "A": return (loc, "C", b)           # Suck
    return (loc, a, "C")

start = ("A", "D", "D")
for act in ("Suck", "Right", "Suck"):
    nxt = result(start, act)
    print(start, "--" + act + "-&gt;", nxt)
    start = nxt
print("goal reached:", start[1:] == ("C", "C"))

print("8-puzzle reachable states:", factorial(9) // 2)
print("15-puzzle reachable states:", factorial(16) // 2)</code></pre>
<div class="out">vacuum states: 8
('A', 'D', 'D') --Suck-&gt; ('A', 'C', 'D')
('A', 'C', 'D') --Right-&gt; ('B', 'C', 'D')
('B', 'C', 'D') --Suck-&gt; ('B', 'C', 'C')
goal reached: True
8-puzzle reachable states: 181440
15-puzzle reachable states: 10461394944000</div>
<div class="callout"><p><b>Code cho thấy gì.</b> (1) product("AB", "CD", "CD") liệt kê đủ 8 trạng thái. (2) result() là mô hình chuyển viết thành hàm. (3) Từ (A, bẩn, bẩn), kế hoạch Suck → Right → Suck tới trạng thái cả hai ô sạch nên kiểm tra đích đúng; với chi phí 1 mỗi hành động, chi phí đường đi là 3 và là tối ưu. (4) Số trạng thái của các trò xếp hình cho thấy không gian trạng thái bùng nổ nhanh thế nào.</p></div>
<h3>✍️ Ví dụ 2 — robot giao hàng trong toà nhà</h3>
<div class="callout"><p><b>Đề.</b> Robot phải mang một kiện hàng từ sảnh lên phòng 305.</p>
<p><b>Trạng thái:</b> (tầng, ô trên bản đồ lưới của tầng, đang mang hàng có/không). <b>Đầu:</b> (1, ô sảnh, có). <b>Hành động:</b> đi B/N/Đ/T sang ô kề trống; vào thang máy; chọn tầng; đặt hàng xuống. <b>Mô hình chuyển:</b> bước đi đổi ô trừ khi ô đích là tường; thang máy đổi tầng. <b>Đích:</b> hàng đã đặt trong phòng 305. <b>Chi phí:</b> 1 cho mỗi mét di chuyển, cộng 20 khi dùng thang máy (thời gian chờ). Để ý những gì ta bỏ: ánh sáng, màu tường, tên người — và những gì ta giữ vì nó làm đổi đáp án: tường, tầng, thang máy.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhét quá nhiều chi tiết vào trạng thái (góc chính xác của bánh xe) — không gian bùng nổ mà chẳng được lợi gì.</li><li>Bỏ sót thứ quan trọng (có đang mang hàng không), khiến “lời giải” không chạy được.</li><li>Nhầm trạng thái (ảnh chụp thế giới) với nút của cây tìm kiếm (trạng thái kèm đường đi dẫn tới nó).</li><li>Quên chi phí hành động: ít bước nhất chưa chắc là đường rẻ nhất.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bài toán tìm kiếm = không gian trạng thái, trạng thái đầu, hành động, mô hình chuyển, kiểm tra đích, chi phí hành động.</li><li>Lời giải = chuỗi hành động tới đích; tối ưu = chi phí đường đi nhỏ nhất.</li><li>Không gian trạng thái = đồ thị; tìm kiếm là khám phá đồ thị.</li><li>Trừu tượng hoá bỏ chi tiết thừa nhưng giữ những gì ảnh hưởng lời giải.</li><li>Không gian trạng thái tăng bùng nổ (8-puzzle: 181 440 trạng thái).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://cs50.harvard.edu/ai/notes/0/" target="_blank" rel="noopener">CS50 AI with Python — ghi chú Lecture 0: Search (tiếng Anh)</a></li><li><a href="https://en.wikipedia.org/wiki/State_space_search" target="_blank" rel="noopener">Wikipedia — Tìm kiếm trong không gian trạng thái (tiếng Anh)</a></li><li><a href="https://en.wikipedia.org/wiki/15_puzzle" target="_blank" rel="noopener">Wikipedia — 15 puzzle và tính giải được (tiếng Anh)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Thế giới hút bụi ba ô (A, B, C thẳng hàng) có bao nhiêu trạng thái?</li><li>Phát biểu bài toán “tay máy phải chồng khối A lên khối B” với ba khối trên bàn: trạng thái là gì, hành động là gì, đích là gì?</li><li>Robot làm việc trên lưới 50 × 40, trạng thái là (ô, hướng ∈ {B, Đ, N, T}). Có bao nhiêu trạng thái?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 3 vị trí × 2<sup>3</sup> tổ hợp bụi = 24 trạng thái. 2) Trạng thái: khối nào nằm trên khối nào (hoặc trên bàn) và tay kẹp có đang giữ khối nào; hành động: nhấc một khối không bị đè, đặt khối đang giữ lên bàn hoặc lên một khối không bị đè; đích: mọi trạng thái có A nằm trên B. 3) 50 × 40 × 4 = 8 000 trạng thái.</p></div>`);

const q6 = QZ(6, 'Quiz — Chapter 6: Introduction to AI and intelligent agents|||Quiz — Chương 6: Nhập môn AI và tác tử thông minh', 'Kiểm tra chương 6: bốn cách tiếp cận AI, phép thử Turing, lịch sử, PEAS, tính chất môi trường, kiến trúc tác tử, phát biểu bài toán tìm kiếm.', [
  Q('q1', 'This course defines AI mainly as|||Môn học này định nghĩa AI chủ yếu theo hướng',
    ['acting humanly|||hành động như người', 'thinking humanly|||suy nghĩ như người', 'acting rationally (rational agents)|||hành động hợp lý (tác tử hợp lý)', 'thinking rationally only|||chỉ suy nghĩ hợp lý'], 2,
    'A rational agent acts to maximise its expected performance measure.|||Tác tử hợp lý hành động để tối đa hoá thước đo hiệu năng kỳ vọng.'),
  Q('q2', 'The Turing test evaluates a machine by|||Phép thử Turing đánh giá máy bằng cách',
    ['its chess rating|||điểm cờ vua của nó', 'whether a judge can tell it apart from a human in conversation|||giám khảo có phân biệt được nó với người qua trò chuyện không', 'its processor speed|||tốc độ bộ xử lý', 'the accuracy of its sensors|||độ chính xác cảm biến'], 1,
    'Turing (1950) proposed the imitation game.|||Turing (1950) đề xuất trò chơi bắt chước.'),
  Q('q3', 'The term “artificial intelligence” became the name of the field at|||Thuật ngữ “trí tuệ nhân tạo” trở thành tên ngành tại',
    ['the Dartmouth workshop, 1956|||hội thảo Dartmouth, 1956', 'the Deep Blue match, 1997|||trận đấu của Deep Blue, 1997', 'the ImageNet contest, 2012|||cuộc thi ImageNet, 2012', 'the launch of Shakey, 1966|||lúc ra mắt Shakey, 1966'], 0,
    'McCarthy, Minsky, Rochester and Shannon organised it.|||McCarthy, Minsky, Rochester và Shannon tổ chức.'),
  Q('q4', 'In PEAS, “wheel encoders and a lidar” belong to|||Trong PEAS, “encoder bánh xe và lidar” thuộc về',
    ['Performance|||Hiệu năng (P)', 'Environment|||Môi trường (E)', 'Actuators|||Chấp hành (A)', 'Sensors|||Cảm biến (S)'], 3,
    'They measure the world; they do not act on it.|||Chúng đo thế giới, không tác động lên nó.'),
  Q('q5', 'A robot whose wheels sometimes slip so the same command gives different results acts in an environment that is|||Robot có bánh đôi khi trượt nên cùng một lệnh cho kết quả khác nhau hoạt động trong môi trường',
    ['deterministic|||tất định', 'stochastic (nondeterministic)|||ngẫu nhiên (không tất định)', 'episodic|||từng đợt', 'fully observable|||quan sát đầy đủ'], 1,
    'The next state is not fully determined by state and action.|||Trạng thái kế tiếp không được xác định hoàn toàn bởi trạng thái và hành động.'),
  Q('q6', 'Which agent keeps an internal state of parts of the world it cannot currently see?|||Tác tử nào giữ trạng thái nội bộ về phần thế giới hiện không nhìn thấy?',
    ['simple reflex agent|||tác tử phản xạ đơn giản', 'model-based reflex agent|||tác tử phản xạ dựa trên mô hình', 'a thermostat|||bộ ổn nhiệt', 'none — agents never store state|||không có — tác tử không lưu trạng thái'], 1,
    'The model tracks unobserved aspects of the world.|||Mô hình theo dõi các khía cạnh không quan sát được.'),
  Q('q7', 'In the two-square vacuum world (+1 per clean square per step), both squares are clean for 4 steps. Points earned in those 4 steps?|||Thế giới hút bụi hai ô (+1 mỗi ô sạch mỗi bước), cả hai ô sạch trong 4 bước. Số điểm thu trong 4 bước đó?',
    ['4|||4', '6|||6', '8|||8', '16|||16'], 2,
    '2 clean squares × 4 steps = 8.|||2 ô sạch × 4 bước = 8.'),
  Q('q8', 'How many states does the two-square vacuum world have?|||Thế giới hút bụi hai ô có bao nhiêu trạng thái?',
    ['4|||4', '6|||6', '8|||8', '16|||16'], 2,
    '2 locations × 2 × 2 dirt states.|||2 vị trí × 2 × 2 trạng thái bụi.'),
  Q('q9', 'RESULT(s, a) in a search problem is the|||RESULT(s, a) trong bài toán tìm kiếm là',
    ['goal test|||kiểm tra đích', 'transition model|||mô hình chuyển', 'path cost|||chi phí đường đi', 'heuristic|||heuristic'], 1,
    'It returns the state reached by doing a in s.|||Nó trả về trạng thái thu được khi làm a ở s.'),
  Q('q10', 'Number of reachable states of the 8-puzzle:|||Số trạng thái tới được của 8-puzzle:',
    ['9! = 362 880|||9! = 362 880', '9!/2 = 181 440|||9!/2 = 181 440', '8! = 40 320|||8! = 40 320', '2⁹ = 512|||2⁹ = 512'], 1,
    'Only half of the 9! arrangements can be reached from a given start.|||Chỉ một nửa trong 9! cách sắp xếp tới được từ một trạng thái đầu.'),
]);

const ch6 = {
  title: 'Chapter 6 — Introduction to AI: intelligent agents and problems|||Chương 6 — Nhập môn AI: tác tử thông minh và bài toán',
  description: 'AI là gì (bốn cách tiếp cận, phép thử Turing, lược sử), tác tử thông minh (PEAS, tính chất môi trường, năm kiến trúc, tác tử hút bụi Python), phát biểu bài toán và không gian trạng thái (Russell & Norvig AIMA 4e ch. 1–3).',
  lessons: [r61, r62, r63, q6],
};


// ───────────────────────────── Chương 7 — Tìm kiếm & lập kế hoạch đường đi ─────────────────────────────
const r71 = L('rai101-ts-7-1',
  '7.1 — Uninformed search: BFS, DFS and uniform-cost search|||7.1 — Tìm kiếm mù: BFS, DFS và tìm kiếm chi phí đều (UCS)',
  'Tìm kiếm trên không gian trạng thái: frontier, nút đã thăm; BFS, DFS, UCS và bốn tiêu chí đánh giá; code Python BFS và DFS trên lưới chạy thật.',
  `<span class="eyebrow">RAI101 · Chapter 7 · Lesson 7.1</span>
<h2>Uninformed search: BFS, DFS and uniform-cost search</h2>
<p class="lead">In Chapter 6 you learned to describe a problem as states, actions, a goal test and costs. Now we solve it: a <strong>search algorithm</strong> explores the state space until it reaches a goal. “Uninformed” (or <em>blind</em>) means the algorithm knows nothing about where the goal is — only how to generate neighbours and recognise the goal when it sees it.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain the frontier / reached-set loop shared by every graph-search algorithm.</li><li>Run breadth-first search (BFS), depth-first search (DFS) and uniform-cost search (UCS) by hand on a small graph.</li><li>Compare them with the four criteria: completeness, optimality, time and space.</li><li>Read and run a Python BFS/DFS on an occupancy grid.</li></ul>
<h3>📖 Lecture</h3>
<p>Every search algorithm in this chapter follows the same loop (Russell &amp; Norvig, AIMA 4e, §3.3): keep a <strong>frontier</strong> of states waiting to be expanded and a <strong>reached</strong> set of states already discovered. Repeatedly remove one state from the frontier, stop if it is the goal, otherwise add its unseen neighbours to the frontier and remember their <strong>parent</strong> so the path can be rebuilt at the end. The <em>only</em> difference between the algorithms is <strong>which state leaves the frontier next</strong>.</p>
<div class="formula"><span class="lbl">Frontier policy decides the algorithm</span>BFS: FIFO queue (oldest first) · DFS: LIFO stack (newest first) · UCS: priority queue ordered by path cost g(n)</div>
<p><strong>Breadth-first search</strong> expands all states 1 step away, then 2 steps, then 3… It always finds the path with the <em>fewest actions</em>, so it is optimal when every action costs the same (e.g. one grid cell = one move). Its weakness is memory: with branching factor b and solution depth d it may store about b<sup>d</sup> states. For b = 4 and d = 10 that is already 4<sup>10</sup> ≈ 1 million.</p>
<p><strong>Depth-first search</strong> dives down one branch until it is stuck, then backtracks. It needs little memory (proportional to the depth), but the first path it finds is usually <em>not</em> the shortest, and in an infinite state space it can dive forever (incomplete).</p>
<p><strong>Uniform-cost search</strong> (the AI name for Dijkstra's algorithm, 1959) always expands the state with the smallest path cost g(n) so far. When actions have different costs — driving on grass costs more battery than on concrete, a diagonal move costs √2 — UCS is the uninformed algorithm that still returns the cheapest path, provided all costs are positive.</p>
<div class="kv-grid"><div class="kv"><span class="k">BFS</span><span class="v">complete · optimal for equal step costs · memory O(b<sup>d</sup>)</span></div><div class="kv"><span class="k">DFS</span><span class="v">not optimal · incomplete in infinite spaces · memory O(b·m)</span></div><div class="kv"><span class="k">UCS</span><span class="v">complete and optimal for positive costs · expands by g(n)</span></div></div>
<h3>✍️ Worked example — BFS vs DFS on a grid</h3>
<div class="callout"><p>A robot on a 5 × 10 occupancy grid starts at S and must reach G. “#” is an obstacle; it may move up, down, left or right. The two algorithms below share one function — the only change is <code>popleft()</code> (queue) versus <code>pop()</code> (stack).</p></div>
<pre><code class="language-python">from collections import deque

GRID = [
    "S....#....",
    ".###.#.##.",
    "...#...#..",
    ".#.#####.#",
    ".#.......G",
]

def find(ch):
    for r, row in enumerate(GRID):
        if ch in row:
            return (r, row.index(ch))

def neighbors(cell):
    r, c = cell
    for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):   # up, down, left, right
        nr, nc = r + dr, c + dc
        if 0 &lt;= nr &lt; len(GRID) and 0 &lt;= nc &lt; len(GRID[0]) and GRID[nr][nc] != "#":
            yield (nr, nc)

def search(start, goal, use_queue):
    frontier = deque([start])
    parent = {start: None}
    expanded = 0
    while frontier:
        cell = frontier.popleft() if use_queue else frontier.pop()  # FIFO = BFS, LIFO = DFS
        expanded += 1
        if cell == goal:
            break
        for nxt in neighbors(cell):
            if nxt not in parent:
                parent[nxt] = cell
                frontier.append(nxt)
    path, cell = [], goal
    while cell is not None:
        path.append(cell)
        cell = parent[cell]
    return path[::-1], expanded

def draw(path):
    rows = [list(r) for r in GRID]
    for (r, c) in path[1:-1]:
        rows[r][c] = "*"
    print("\\n".join("".join(r) for r in rows))

start, goal = find("S"), find("G")
free = sum(row.count(".") for row in GRID) + 2
print("free cells:", free)
for name, q in (("BFS", True), ("DFS", False)):
    path, expanded = search(start, goal, q)
    print(name, "moves:", len(path) - 1, "| expanded:", expanded)
    draw(path)</code></pre>
<div class="out">free cells: 33
BFS moves: 13 | expanded: 29
S....#....
*###.#.##.
***#...#..
.#*#####.#
.#*******G
DFS moves: 19 | expanded: 20
S****#****
.###*#*##*
...#***#**
.#.#####*#
.#......*G</div>
<p><b>Reading the result.</b> BFS returns the shortest route (13 moves) but expands 29 of the 33 free cells. DFS expands fewer cells here (20) because it got lucky going right first, yet its route is 19 moves — 6 moves longer. On a real robot those 6 extra cells are wasted time and battery. Change the neighbour order and DFS can easily become much worse.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the reached set: on a grid every move can be undone, so the search loops forever between two cells.</li><li>Calling DFS “optimal because it found a path”. Finding <em>a</em> path is completeness; finding the <em>best</em> path is optimality.</li><li>Using BFS when actions have different costs — BFS minimises the number of actions, not the total cost. Use UCS.</li><li>Rebuilding the path from start to goal: parents point backwards, so walk from the goal and reverse the list.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>All graph searches share one loop: frontier + reached set + parent pointers.</li><li>The frontier policy defines the algorithm: queue → BFS, stack → DFS, priority on g(n) → UCS.</li><li>BFS is optimal for equal costs but memory-hungry; DFS is memory-cheap but not optimal.</li><li>UCS (Dijkstra) is optimal for any positive action costs.</li><li>Uninformed search wastes effort exploring away from the goal — fixed by heuristics in Lesson 7.2.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://cs50.harvard.edu/ai/weeks/0/" target="_blank" rel="noopener">Harvard CS50 AI — Week 0: Search (lecture video, notes, projects)</a></li><li><a href="https://www.redblobgames.com/pathfinding/grids/graphs.html" target="_blank" rel="noopener">Red Blob Games — Grids and Graphs (interactive)</a></li><li><a href="https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/resources/lecture-4-search-depth-first-hill-climbing-beam/" target="_blank" rel="noopener">MIT 6.034 — Lecture 4: Search: Depth-First, Hill Climbing, Beam</a></li><li><a href="https://en.wikipedia.org/wiki/Breadth-first_search" target="_blank" rel="noopener">Wikipedia — Breadth-first search</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Graph: A–B, A–C, B–D, C–D, D–E (unit costs). Starting from A, neighbours visited in alphabetical order, list the order in which BFS expands the states until it reaches E.</li><li>A grid robot has b = 4 and the goal is 6 moves away. Roughly how many states can BFS generate in the worst case (4<sup>6</sup>)?</li><li>Edges cost A→B = 1, B→G = 5, A→C = 2, C→G = 2. Which path does BFS return, and which does UCS return?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) A, B, C, D, E. 2) 4<sup>6</sup> = 4096 states. 3) Both A→B→G and A→C→G have 2 actions, so BFS may return A→B→G (cost 6); UCS returns A→C→G with cost 4, the cheapest.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 7 · Bài 7.1</span>
<h2>Tìm kiếm mù: BFS, DFS và tìm kiếm chi phí đều</h2>
<p class="lead">Ở Chương 6 bạn đã học cách mô tả bài toán bằng trạng thái, hành động, phép kiểm đích và chi phí. Giờ ta giải nó: một <strong>thuật toán tìm kiếm</strong> khám phá không gian trạng thái cho tới khi gặp đích. “Mù” (uninformed) nghĩa là thuật toán không biết đích nằm ở đâu — nó chỉ biết sinh hàng xóm và nhận ra đích khi gặp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích vòng lặp frontier / tập đã gặp mà mọi thuật toán tìm kiếm trên đồ thị đều dùng.</li><li>Chạy tay tìm kiếm theo chiều rộng (BFS), theo chiều sâu (DFS) và chi phí đều (UCS) trên đồ thị nhỏ.</li><li>So sánh chúng theo bốn tiêu chí: đầy đủ, tối ưu, thời gian, bộ nhớ.</li><li>Đọc và chạy BFS/DFS bằng Python trên bản đồ lưới.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Mọi thuật toán trong chương này dùng chung một vòng lặp (Russell &amp; Norvig, AIMA 4e, §3.3): giữ một <strong>frontier</strong> (biên) gồm các trạng thái chờ mở rộng và một tập <strong>reached</strong> gồm các trạng thái đã phát hiện. Lặp: lấy một trạng thái ra khỏi frontier, nếu là đích thì dừng, nếu không thì thêm các hàng xóm chưa gặp vào frontier và ghi nhớ <strong>cha</strong> của chúng để cuối cùng dựng lại đường đi. Điểm khác nhau <em>duy nhất</em> giữa các thuật toán là <strong>trạng thái nào được lấy ra tiếp theo</strong>.</p>
<div class="formula"><span class="lbl">Cách lấy khỏi frontier quyết định thuật toán</span>BFS: hàng đợi FIFO (cũ nhất trước) · DFS: ngăn xếp LIFO (mới nhất trước) · UCS: hàng đợi ưu tiên theo chi phí đường đi g(n)</div>
<p><strong>BFS</strong> mở rộng mọi trạng thái cách 1 bước, rồi 2 bước, rồi 3 bước… Nó luôn tìm ra đường có <em>ít hành động nhất</em>, nên tối ưu khi mọi hành động có cùng chi phí (vd mỗi ô lưới = một bước). Điểm yếu là bộ nhớ: với hệ số rẽ nhánh b và độ sâu lời giải d, nó có thể lưu khoảng b<sup>d</sup> trạng thái. Với b = 4, d = 10 đã là 4<sup>10</sup> ≈ 1 triệu.</p>
<p><strong>DFS</strong> lao sâu theo một nhánh tới khi bế tắc rồi quay lui. Nó tốn ít bộ nhớ (tỉ lệ với độ sâu), nhưng đường đầu tiên tìm được thường <em>không</em> ngắn nhất, và trong không gian vô hạn có thể lao mãi (không đầy đủ).</p>
<p><strong>UCS</strong> (tên gọi trong AI của thuật toán Dijkstra, 1959) luôn mở rộng trạng thái có chi phí đường đi g(n) nhỏ nhất. Khi các hành động có chi phí khác nhau — đi trên cỏ tốn pin hơn trên bê tông, đi chéo tốn √2 — UCS là thuật toán mù vẫn trả về đường rẻ nhất, miễn mọi chi phí đều dương.</p>
<div class="kv-grid"><div class="kv"><span class="k">BFS</span><span class="v">đầy đủ · tối ưu khi chi phí bước bằng nhau · bộ nhớ O(b<sup>d</sup>)</span></div><div class="kv"><span class="k">DFS</span><span class="v">không tối ưu · không đầy đủ nếu không gian vô hạn · bộ nhớ O(b·m)</span></div><div class="kv"><span class="k">UCS</span><span class="v">đầy đủ và tối ưu với chi phí dương · mở rộng theo g(n)</span></div></div>
<h3>✍️ Ví dụ — BFS và DFS trên lưới</h3>
<div class="callout"><p>Robot trên bản đồ lưới 5 × 10 xuất phát ở S, cần tới G. “#” là vật cản; robot đi lên, xuống, trái, phải. Hai thuật toán dưới đây dùng chung một hàm — khác nhau duy nhất ở <code>popleft()</code> (hàng đợi) và <code>pop()</code> (ngăn xếp).</p></div>
<pre><code class="language-python">from collections import deque

GRID = [
    "S....#....",
    ".###.#.##.",
    "...#...#..",
    ".#.#####.#",
    ".#.......G",
]

def find(ch):
    for r, row in enumerate(GRID):
        if ch in row:
            return (r, row.index(ch))

def neighbors(cell):
    r, c = cell
    for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):   # up, down, left, right
        nr, nc = r + dr, c + dc
        if 0 &lt;= nr &lt; len(GRID) and 0 &lt;= nc &lt; len(GRID[0]) and GRID[nr][nc] != "#":
            yield (nr, nc)

def search(start, goal, use_queue):
    frontier = deque([start])
    parent = {start: None}
    expanded = 0
    while frontier:
        cell = frontier.popleft() if use_queue else frontier.pop()  # FIFO = BFS, LIFO = DFS
        expanded += 1
        if cell == goal:
            break
        for nxt in neighbors(cell):
            if nxt not in parent:
                parent[nxt] = cell
                frontier.append(nxt)
    path, cell = [], goal
    while cell is not None:
        path.append(cell)
        cell = parent[cell]
    return path[::-1], expanded

def draw(path):
    rows = [list(r) for r in GRID]
    for (r, c) in path[1:-1]:
        rows[r][c] = "*"
    print("\\n".join("".join(r) for r in rows))

start, goal = find("S"), find("G")
free = sum(row.count(".") for row in GRID) + 2
print("free cells:", free)
for name, q in (("BFS", True), ("DFS", False)):
    path, expanded = search(start, goal, q)
    print(name, "moves:", len(path) - 1, "| expanded:", expanded)
    draw(path)</code></pre>
<div class="out">free cells: 33
BFS moves: 13 | expanded: 29
S....#....
*###.#.##.
***#...#..
.#*#####.#
.#*******G
DFS moves: 19 | expanded: 20
S****#****
.###*#*##*
...#***#**
.#.#####*#
.#......*G</div>
<p><b>Đọc kết quả.</b> BFS trả về đường ngắn nhất (13 bước) nhưng mở rộng 29 trên 33 ô trống. DFS ở đây mở rộng ít ô hơn (20) vì may mắn đi sang phải trước, nhưng đường của nó dài 19 bước — dài hơn 6 bước. Trên robot thật, 6 ô thừa đó là thời gian và pin bị phí. Đổi thứ tự hàng xóm là DFS có thể tệ hơn nhiều.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên tập đã gặp: trên lưới mọi bước đều đi ngược lại được, nên thuật toán lặp mãi giữa hai ô.</li><li>Nói DFS “tối ưu vì đã tìm được đường”. Tìm được <em>một</em> đường là tính đầy đủ; tìm được đường <em>tốt nhất</em> mới là tối ưu.</li><li>Dùng BFS khi hành động có chi phí khác nhau — BFS tối thiểu số hành động, không tối thiểu tổng chi phí. Hãy dùng UCS.</li><li>Dựng đường từ đầu tới đích: con trỏ cha chỉ ngược, nên phải đi từ đích về rồi đảo danh sách.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mọi tìm kiếm trên đồ thị dùng chung vòng lặp: frontier + tập đã gặp + con trỏ cha.</li><li>Cách lấy khỏi frontier định nghĩa thuật toán: hàng đợi → BFS, ngăn xếp → DFS, ưu tiên theo g(n) → UCS.</li><li>BFS tối ưu khi chi phí bằng nhau nhưng tốn bộ nhớ; DFS tiết kiệm bộ nhớ nhưng không tối ưu.</li><li>UCS (Dijkstra) tối ưu với mọi chi phí hành động dương.</li><li>Tìm kiếm mù phí công khám phá xa đích — Bài 7.2 sửa điều này bằng heuristic.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://cs50.harvard.edu/ai/weeks/0/" target="_blank" rel="noopener">Harvard CS50 AI — Week 0: Search (video, ghi chú, dự án)</a></li><li><a href="https://www.redblobgames.com/pathfinding/grids/graphs.html" target="_blank" rel="noopener">Red Blob Games — Lưới và đồ thị (tương tác)</a></li><li><a href="https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/resources/lecture-4-search-depth-first-hill-climbing-beam/" target="_blank" rel="noopener">MIT 6.034 — Bài 4: Tìm kiếm theo chiều sâu, leo đồi, beam</a></li><li><a href="https://en.wikipedia.org/wiki/Breadth-first_search" target="_blank" rel="noopener">Wikipedia — Breadth-first search</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đồ thị: A–B, A–C, B–D, C–D, D–E (chi phí 1). Bắt đầu từ A, hàng xóm xét theo thứ tự chữ cái, liệt kê thứ tự BFS mở rộng các trạng thái cho tới khi gặp E.</li><li>Robot lưới có b = 4 và đích cách 6 bước. Trong trường hợp xấu BFS có thể sinh khoảng bao nhiêu trạng thái (4<sup>6</sup>)?</li><li>Chi phí cạnh A→B = 1, B→G = 5, A→C = 2, C→G = 2. BFS trả về đường nào, UCS trả về đường nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) A, B, C, D, E. 2) 4<sup>6</sup> = 4096 trạng thái. 3) Cả A→B→G và A→C→G đều 2 hành động nên BFS có thể trả về A→B→G (chi phí 6); UCS trả về A→C→G chi phí 4, rẻ nhất.</p></div>`);

const r72 = L('rai101-ts-7-2',
  '7.2 — Heuristic search and A*|||7.2 — Tìm kiếm có heuristic và thuật toán A*',
  'Heuristic, greedy best-first, A* với f = g + h, heuristic chấp nhận được và nhất quán; code Python A* trên lưới so số nút mở rộng với BFS và UCS.',
  `<span class="eyebrow">RAI101 · Chapter 7 · Lesson 7.2</span>
<h2>Heuristic search and A*</h2>
<p class="lead">A robot in a warehouse knows roughly where the goal is — it has coordinates! A <strong>heuristic</strong> turns that knowledge into an estimate of the remaining cost, and <strong>A*</strong> uses it to search towards the goal instead of in every direction. A* was invented in 1968 by Hart, Nilsson and Raphael for Shakey, the first mobile robot that reasoned about its actions, and it is still the default path-finding algorithm in robots and games.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define a heuristic h(n) and compute Manhattan and Euclidean distances.</li><li>Explain f(n) = g(n) + h(n) and run A* by hand for a few steps.</li><li>State when A* is optimal (admissible / consistent heuristic).</li><li>Measure the saving of A* over BFS and UCS with real code.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>heuristic function</strong> h(n) estimates the cost of the cheapest path from state n to a goal. On a grid where the robot moves in 4 directions with cost 1, the natural heuristic is the <strong>Manhattan distance</strong>; if it can move in any direction, use the straight-line <strong>Euclidean distance</strong>.</p>
<div class="formula"><span class="lbl">Distance heuristics for a cell (r, c) and goal (r<sub>g</sub>, c<sub>g</sub>)</span>Manhattan: h = |r − r<sub>g</sub>| + |c − c<sub>g</sub>|    Euclidean: h = √((r − r<sub>g</sub>)<sup>2</sup> + (c − c<sub>g</sub>)<sup>2</sup>)</div>
<p><strong>Greedy best-first search</strong> expands the state with the smallest h(n) — it rushes towards the goal, is often fast, but can be fooled by obstacles and is not optimal. <strong>A*</strong> combines the cost already paid with the estimated cost still to pay:</p>
<div class="formula"><span class="lbl">A* evaluation function</span>f(n) = g(n) + h(n)    g = cost from start to n, h = estimated cost from n to goal</div>
<p>A* always expands the frontier state with the smallest f. Two properties guarantee the answer is the cheapest path:</p>
<ul><li><strong>Admissible</strong>: h never <em>overestimates</em> the true remaining cost. Manhattan distance is admissible on a 4-connected grid because walls can only make the real path longer.</li><li><strong>Consistent</strong> (monotone): h(n) ≤ cost(n → n′) + h(n′) for every neighbour n′ — a triangle inequality. Consistent implies admissible, and with it A* never needs to re-open a closed state.</li></ul>
<p>Special cases help memory: with h = 0, A* becomes UCS (Dijkstra); with a perfect h it walks straight to the goal. The better (larger but still admissible) the heuristic, the fewer states A* expands.</p>
<h3>✍️ Worked example — A* by hand</h3>
<div class="callout"><p>Start S = (2, 0), goal G = (4, 9), 4-connected grid, cost 1 per move. Then h(S) = |2 − 4| + |0 − 9| = 2 + 9 = <b>11</b>, g(S) = 0, so f(S) = 11. After moving right to (2, 1): g = 1, h = 2 + 8 = 10, f = 11. Moving left would give g = 1, h = 12, f = 13 — so A* prefers the cell towards the goal while g still keeps it honest about the distance travelled.</p></div>
<pre><code class="language-python">import heapq
from collections import deque

GRID = [
    "..........",
    "..........",
    "S...#.....",
    "....#.....",
    "....#....G",
    "....#.....",
    "..........",
]
ROWS, COLS = len(GRID), len(GRID[0])

def find(ch):
    for r, row in enumerate(GRID):
        if ch in row:
            return (r, row.index(ch))

def neighbors(cell):
    r, c = cell
    for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        nr, nc = r + dr, c + dc
        if 0 &lt;= nr &lt; ROWS and 0 &lt;= nc &lt; COLS and GRID[nr][nc] != "#":
            yield (nr, nc)

def manhattan(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def astar(start, goal, h):
    g = {start: 0}                       # cost so far
    parent = {start: None}
    frontier = [(h(start, goal), 0, start)]   # (f = g + h, prefer larger g on ties, cell)
    expanded, closed = 0, set()
    while frontier:
        f, _, cell = heapq.heappop(frontier)
        if cell in closed:
            continue
        closed.add(cell)
        expanded += 1
        if cell == goal:
            break
        for nxt in neighbors(cell):
            new_g = g[cell] + 1          # every move costs 1
            if new_g &lt; g.get(nxt, float("inf")):
                g[nxt] = new_g
                parent[nxt] = cell
                heapq.heappush(frontier, (new_g + h(nxt, goal), -new_g, nxt))
    path, cell = [], goal
    while cell is not None:
        path.append(cell)
        cell = parent[cell]
    return path[::-1], expanded

def bfs_expanded(start, goal):
    frontier, seen, expanded = deque([start]), {start}, 0
    while frontier:
        cell = frontier.popleft()
        expanded += 1
        if cell == goal:
            return expanded
        for nxt in neighbors(cell):
            if nxt not in seen:
                seen.add(nxt)
                frontier.append(nxt)

start, goal = find("S"), find("G")
path, exp_astar = astar(start, goal, manhattan)
_, exp_dijkstra = astar(start, goal, lambda a, b: 0)   # h = 0 -&gt; uniform-cost search
print("h(start) =", manhattan(start, goal))
print("A* path cost:", len(path) - 1)
print("expanded  BFS:", bfs_expanded(start, goal),
      "| UCS (h=0):", exp_dijkstra, "| A* (Manhattan):", exp_astar)
rows = [list(r) for r in GRID]
for (r, c) in path[1:-1]:
    rows[r][c] = "*"
print("\\n".join("".join(r) for r in rows))</code></pre>
<div class="out">h(start) = 11
A* path cost: 13
expanded  BFS: 64 | UCS (h=0): 63 | A* (Manhattan): 24
..........
...*******
S***#....*
....#....*
....#....G
....#.....
..........</div>
<p><b>Reading the result.</b> All three algorithms find a 13-move path (the wall in column 4 forces a detour of 2 moves over the Manhattan estimate 11). BFS and UCS expand 64 and 63 of the 66 free cells — almost the whole map — while A* expands only 24. On a 1000 × 1000 map this difference decides whether a robot replans in milliseconds or in seconds.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using Euclidean or Manhattan distance in <em>metres</em> when step costs are in <em>seconds</em> — h and g must use the same unit.</li><li>Using Manhattan distance on an 8-connected grid where a diagonal costs √2: it overestimates, so A* may return a non-optimal path. Use the octile (diagonal) distance instead.</li><li>Stopping when the goal is <em>added</em> to the frontier instead of when it is <em>removed</em> — a cheaper path may still be waiting.</li><li>Forgetting the tie-breaking rule: many equal-f cells cause A* to expand more than necessary.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A heuristic h(n) estimates the remaining cost to the goal.</li><li>Greedy best-first uses h only: fast, not optimal.</li><li>A* expands by f = g + h; with an admissible (and consistent) h it returns an optimal path.</li><li>h = 0 turns A* into UCS; a more informed admissible h means fewer expansions.</li><li>In the demo A* expanded 24 cells versus 64 for BFS for the same 13-move path.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.redblobgames.com/pathfinding/a-star/introduction.html" target="_blank" rel="noopener">Red Blob Games — Introduction to the A* Algorithm (interactive)</a></li><li><a href="https://www.youtube.com/watch?v=ySN5Wnu88nE" target="_blank" rel="noopener">Computerphile — A* (A Star) Search Algorithm (video)</a></li><li><a href="https://theory.stanford.edu/~amitp/GameProgramming/AStarComparison.html" target="_blank" rel="noopener">Amit Patel (Stanford) — Introduction to A* and heuristics</a></li><li><a href="https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/resources/lecture-5-search-optimal-branch-and-bound-a/" target="_blank" rel="noopener">MIT 6.034 — Lecture 5: Search: Optimal, Branch and Bound, A*</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A state has g = 5 and h = 7. What is f? Another frontier state has g = 9, h = 2. Which does A* expand first?</li><li>Compute the Manhattan and Euclidean heuristics from (1, 1) to (4, 5).</li><li>A friend proposes h(n) = 2 × Manhattan distance to make A* “faster”. Is it admissible? What can go wrong?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) f = 12 and f = 11, so A* expands the second state (g = 9, h = 2) first. 2) Manhattan = 3 + 4 = 7; Euclidean = √(9 + 16) = 5. 3) No — it can overestimate (e.g. next to the goal on an open grid, h = 2 while the real cost is 1). A* then becomes faster but may return a path that is not the shortest (it is “weighted A*”).</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 7 · Bài 7.2</span>
<h2>Tìm kiếm có heuristic và thuật toán A*</h2>
<p class="lead">Robot trong nhà kho biết đại khái đích ở đâu — nó có toạ độ! Một <strong>heuristic</strong> biến hiểu biết đó thành ước lượng chi phí còn lại, và <strong>A*</strong> dùng nó để tìm kiếm hướng về đích thay vì loang ra mọi phía. A* do Hart, Nilsson và Raphael phát minh năm 1968 cho Shakey — robot di động đầu tiên biết suy luận về hành động của mình — và đến nay vẫn là thuật toán tìm đường mặc định trong robot và game.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa heuristic h(n), tính khoảng cách Manhattan và Euclid.</li><li>Giải thích f(n) = g(n) + h(n) và chạy tay vài bước A*.</li><li>Phát biểu khi nào A* tối ưu (heuristic chấp nhận được / nhất quán).</li><li>Đo bằng code thật mức tiết kiệm của A* so với BFS và UCS.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Hàm heuristic</strong> h(n) ước lượng chi phí của đường rẻ nhất từ trạng thái n tới đích. Trên lưới robot đi 4 hướng, mỗi bước chi phí 1, heuristic tự nhiên là <strong>khoảng cách Manhattan</strong>; nếu robot đi được mọi hướng, dùng <strong>khoảng cách Euclid</strong> (đường chim bay).</p>
<div class="formula"><span class="lbl">Heuristic khoảng cách cho ô (r, c) và đích (r<sub>g</sub>, c<sub>g</sub>)</span>Manhattan: h = |r − r<sub>g</sub>| + |c − c<sub>g</sub>|    Euclid: h = √((r − r<sub>g</sub>)<sup>2</sup> + (c − c<sub>g</sub>)<sup>2</sup>)</div>
<p><strong>Greedy best-first</strong> (tham lam) mở rộng trạng thái có h(n) nhỏ nhất — lao thẳng về đích, thường nhanh, nhưng dễ bị vật cản đánh lừa và không tối ưu. <strong>A*</strong> kết hợp chi phí đã trả với chi phí ước lượng còn phải trả:</p>
<div class="formula"><span class="lbl">Hàm đánh giá của A*</span>f(n) = g(n) + h(n)    g = chi phí từ đầu tới n, h = chi phí ước lượng từ n tới đích</div>
<p>A* luôn mở rộng trạng thái trên frontier có f nhỏ nhất. Hai tính chất bảo đảm kết quả là đường rẻ nhất:</p>
<ul><li><strong>Chấp nhận được</strong> (admissible): h không bao giờ <em>ước lượng quá</em> chi phí thật còn lại. Manhattan chấp nhận được trên lưới 4 hướng vì tường chỉ có thể làm đường thật dài thêm.</li><li><strong>Nhất quán</strong> (consistent): h(n) ≤ chi phí(n → n′) + h(n′) với mọi hàng xóm n′ — một bất đẳng thức tam giác. Nhất quán kéo theo chấp nhận được, và khi đó A* không phải mở lại trạng thái đã đóng.</li></ul>
<p>Hai trường hợp đặc biệt dễ nhớ: h = 0 thì A* trở thành UCS (Dijkstra); h hoàn hảo thì A* đi thẳng tới đích. Heuristic càng sát (lớn hơn nhưng vẫn chấp nhận được) thì A* mở rộng càng ít trạng thái.</p>
<h3>✍️ Ví dụ — chạy tay A*</h3>
<div class="callout"><p>Xuất phát S = (2, 0), đích G = (4, 9), lưới 4 hướng, mỗi bước chi phí 1. Khi đó h(S) = |2 − 4| + |0 − 9| = 2 + 9 = <b>11</b>, g(S) = 0, nên f(S) = 11. Sang phải tới (2, 1): g = 1, h = 2 + 8 = 10, f = 11. Sang trái sẽ là g = 1, h = 12, f = 13 — nên A* ưu tiên ô hướng về đích, còn g giữ cho nó trung thực về quãng đường đã đi.</p></div>
<pre><code class="language-python">import heapq
from collections import deque

GRID = [
    "..........",
    "..........",
    "S...#.....",
    "....#.....",
    "....#....G",
    "....#.....",
    "..........",
]
ROWS, COLS = len(GRID), len(GRID[0])

def find(ch):
    for r, row in enumerate(GRID):
        if ch in row:
            return (r, row.index(ch))

def neighbors(cell):
    r, c = cell
    for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        nr, nc = r + dr, c + dc
        if 0 &lt;= nr &lt; ROWS and 0 &lt;= nc &lt; COLS and GRID[nr][nc] != "#":
            yield (nr, nc)

def manhattan(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def astar(start, goal, h):
    g = {start: 0}                       # cost so far
    parent = {start: None}
    frontier = [(h(start, goal), 0, start)]   # (f = g + h, prefer larger g on ties, cell)
    expanded, closed = 0, set()
    while frontier:
        f, _, cell = heapq.heappop(frontier)
        if cell in closed:
            continue
        closed.add(cell)
        expanded += 1
        if cell == goal:
            break
        for nxt in neighbors(cell):
            new_g = g[cell] + 1          # every move costs 1
            if new_g &lt; g.get(nxt, float("inf")):
                g[nxt] = new_g
                parent[nxt] = cell
                heapq.heappush(frontier, (new_g + h(nxt, goal), -new_g, nxt))
    path, cell = [], goal
    while cell is not None:
        path.append(cell)
        cell = parent[cell]
    return path[::-1], expanded

def bfs_expanded(start, goal):
    frontier, seen, expanded = deque([start]), {start}, 0
    while frontier:
        cell = frontier.popleft()
        expanded += 1
        if cell == goal:
            return expanded
        for nxt in neighbors(cell):
            if nxt not in seen:
                seen.add(nxt)
                frontier.append(nxt)

start, goal = find("S"), find("G")
path, exp_astar = astar(start, goal, manhattan)
_, exp_dijkstra = astar(start, goal, lambda a, b: 0)   # h = 0 -&gt; uniform-cost search
print("h(start) =", manhattan(start, goal))
print("A* path cost:", len(path) - 1)
print("expanded  BFS:", bfs_expanded(start, goal),
      "| UCS (h=0):", exp_dijkstra, "| A* (Manhattan):", exp_astar)
rows = [list(r) for r in GRID]
for (r, c) in path[1:-1]:
    rows[r][c] = "*"
print("\\n".join("".join(r) for r in rows))</code></pre>
<div class="out">h(start) = 11
A* path cost: 13
expanded  BFS: 64 | UCS (h=0): 63 | A* (Manhattan): 24
..........
...*******
S***#....*
....#....*
....#....G
....#.....
..........</div>
<p><b>Đọc kết quả.</b> Cả ba thuật toán đều tìm ra đường 13 bước (bức tường ở cột 4 buộc vòng thêm 2 bước so với ước lượng Manhattan 11). BFS và UCS mở rộng 64 và 63 trên 66 ô trống — gần như cả bản đồ — còn A* chỉ mở rộng 24 ô. Trên bản đồ 1000 × 1000, chênh lệch này quyết định robot lập lại kế hoạch trong vài mili giây hay vài giây.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng khoảng cách tính bằng <em>mét</em> trong khi chi phí bước tính bằng <em>giây</em> — h và g phải cùng đơn vị.</li><li>Dùng Manhattan trên lưới 8 hướng khi đi chéo tốn √2: nó ước lượng quá, nên A* có thể trả đường không tối ưu. Hãy dùng khoảng cách octile (đường chéo).</li><li>Dừng khi đích được <em>thêm vào</em> frontier thay vì khi nó được <em>lấy ra</em> — có thể vẫn còn đường rẻ hơn đang chờ.</li><li>Quên luật phá hoà: nhiều ô cùng f làm A* mở rộng nhiều hơn cần thiết.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Heuristic h(n) ước lượng chi phí còn lại tới đích.</li><li>Greedy best-first chỉ dùng h: nhanh, không tối ưu.</li><li>A* mở rộng theo f = g + h; với h chấp nhận được (và nhất quán) nó trả về đường tối ưu.</li><li>h = 0 biến A* thành UCS; h chấp nhận được càng sát thì càng ít lần mở rộng.</li><li>Trong ví dụ, A* mở rộng 24 ô so với 64 ô của BFS cho cùng một đường 13 bước.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.redblobgames.com/pathfinding/a-star/introduction.html" target="_blank" rel="noopener">Red Blob Games — Giới thiệu thuật toán A* (tương tác)</a></li><li><a href="https://www.youtube.com/watch?v=ySN5Wnu88nE" target="_blank" rel="noopener">Computerphile — A* Search Algorithm (video)</a></li><li><a href="https://theory.stanford.edu/~amitp/GameProgramming/AStarComparison.html" target="_blank" rel="noopener">Amit Patel (Stanford) — A* và heuristic</a></li><li><a href="https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/resources/lecture-5-search-optimal-branch-and-bound-a/" target="_blank" rel="noopener">MIT 6.034 — Bài 5: Tìm kiếm tối ưu, nhánh cận, A*</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một trạng thái có g = 5, h = 7. f bằng bao nhiêu? Trạng thái khác trên frontier có g = 9, h = 2. A* mở rộng trạng thái nào trước?</li><li>Tính heuristic Manhattan và Euclid từ (1, 1) tới (4, 5).</li><li>Bạn đề xuất h(n) = 2 × khoảng cách Manhattan để A* “nhanh hơn”. Heuristic này có chấp nhận được không? Điều gì có thể sai?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) f = 12 và f = 11, nên A* mở rộng trạng thái thứ hai (g = 9, h = 2) trước. 2) Manhattan = 3 + 4 = 7; Euclid = √(9 + 16) = 5. 3) Không — nó có thể ước lượng quá (vd cạnh đích trên lưới trống, h = 2 trong khi chi phí thật là 1). A* khi đó nhanh hơn nhưng có thể trả đường không ngắn nhất (gọi là “weighted A*”).</p></div>`);

const r73 = L('rai101-ts-7-3',
  '7.3 — Path planning for robots: maps, configuration space, PRM and RRT|||7.3 — Lập kế hoạch đường đi cho robot: bản đồ, không gian cấu hình, PRM và RRT',
  'Từ thuật toán tìm kiếm tới robot thật: bản đồ lưới chiếm dụng, không gian cấu hình và phình vật cản (code Python chạy thật), lập kế hoạch lấy mẫu PRM/RRT, lập kế hoạch toàn cục và cục bộ.',
  `<span class="eyebrow">RAI101 · Chapter 7 · Lesson 7.3</span>
<h2>Path planning for robots: maps, configuration space, PRM and RRT</h2>
<p class="lead">A* on a toy grid is not yet a robot. A real robot has a size, moves continuously, carries a noisy map and meets people who were not on the map. <strong>Motion planning</strong> bridges that gap: it turns the robot and its world into a search problem that BFS/A* — or sampling-based planners — can solve, and then follows the plan safely.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe an occupancy-grid map and the idea of configuration space (C-space).</li><li>Explain obstacle inflation and see its effect in code.</li><li>Explain how sampling-based planners (PRM, RRT) work and when to use them.</li><li>Distinguish global planning from local planning / obstacle avoidance.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Maps.</strong> Mobile robots usually plan on an <strong>occupancy grid</strong>: the floor is cut into cells (e.g. 5 cm × 5 cm), and each cell stores whether it is free, occupied or unknown — often as a probability built from lidar scans (Chapter 9). Grids are simple and fit graph search directly; each free cell is a node, neighbouring cells are edges.</p>
<p><strong>Configuration space.</strong> A <em>configuration</em> is the full set of numbers that fixes where every point of the robot is: (x, y) for a round mobile robot, (x, y, θ) if its orientation matters, (θ<sub>1</sub>, θ<sub>2</sub>, …) for an arm (Chapter 4). The <strong>C-space</strong> is the set of all configurations; the <strong>free space</strong> C<sub>free</sub> is the part where the robot does not collide. Planning becomes: find a continuous path from q<sub>start</sub> to q<sub>goal</sub> that stays inside C<sub>free</sub> (Lozano-Pérez, 1983).</p>
<p>For a round robot of radius R the trick is simple: <strong>inflate</strong> every obstacle by R and then treat the robot as a single point. Any path for the point in the inflated map is safe for the real robot.</p>
<div class="formula"><span class="lbl">Inflation radius in cells</span>radius<sub>cells</sub> = ⌈(robot radius + safety margin) / cell size⌉   e.g. ⌈(0.07 m + 0.03 m) / 0.10 m⌉ = 1 cell</div>
<h3>✍️ Worked example — inflation changes the plan</h3>
<div class="callout"><p>A robot of radius 7 cm with a 3 cm margin plans on a grid of 10 cm cells, so obstacles are inflated by 1 cell (“o” in the output). A* is run before and after inflation.</p></div>
<pre><code class="language-python">import heapq

# occupancy grid: "#" = obstacle, "." = free (1 cell = 10 cm)
MAP = [
    "..............",
    "..............",
    "......#.......",
    "......#.......",
    "..............",
    "......#.......",
    "......#.......",
    "..............",
]
ROWS, COLS = len(MAP), len(MAP[0])
occ = [[1 if ch == "#" else 0 for ch in row] for row in MAP]

def inflate(grid, radius):
    """Mark every cell within \`radius\` cells (Chebyshev distance) of an obstacle."""
    out = [row[:] for row in grid]
    for r in range(ROWS):
        for c in range(COLS):
            if grid[r][c] == 1:
                for dr in range(-radius, radius + 1):
                    for dc in range(-radius, radius + 1):
                        nr, nc = r + dr, c + dc
                        if 0 &lt;= nr &lt; ROWS and 0 &lt;= nc &lt; COLS and out[nr][nc] == 0:
                            out[nr][nc] = 2          # 2 = inflated (unsafe for robot centre)
    return out

def astar(grid, start, goal):
    h = lambda a: abs(a[0] - goal[0]) + abs(a[1] - goal[1])
    g, parent, frontier, closed = {start: 0}, {start: None}, [(h(start), start)], set()
    while frontier:
        _, cell = heapq.heappop(frontier)
        if cell == goal:
            path = []
            while cell is not None:
                path.append(cell)
                cell = parent[cell]
            return path[::-1]
        if cell in closed:
            continue
        closed.add(cell)
        r, c = cell
        for nr, nc in ((r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)):
            if 0 &lt;= nr &lt; ROWS and 0 &lt;= nc &lt; COLS and grid[nr][nc] == 0:
                if g[cell] + 1 &lt; g.get((nr, nc), 1e9):
                    g[(nr, nc)] = g[cell] + 1
                    parent[(nr, nc)] = cell
                    heapq.heappush(frontier, (g[(nr, nc)] + h((nr, nc)), (nr, nc)))
    return None

def show(grid, path):
    sym = {0: ".", 1: "#", 2: "o"}
    rows = [[sym[v] for v in row] for row in grid]
    for (r, c) in (path or [])[1:-1]:
        rows[r][c] = "*"
    rows[start[0]][start[1]], rows[goal[0]][goal[1]] = "S", "G"
    print("\\n".join("".join(r) for r in rows))

start, goal = (4, 0), (5, 13)
for radius in (0, 1):
    grid = inflate(occ, radius)
    grid[start[0]][start[1]] = grid[goal[0]][goal[1]] = 0
    path = astar(grid, start, goal)
    print("inflation radius", radius, "-&gt;", "no path" if path is None else str(len(path) - 1) + " moves")
    show(grid, path)</code></pre>
<div class="out">inflation radius 0 -&gt; 14 moves
..............
..............
......#.......
......#.......
S*************
......#......G
......#.......
..............
inflation radius 1 -&gt; 22 moves
....**********
....*ooo.....*
....*o#o.....*
....*o#o.....*
S****ooo.....*
.....o#o.....G
.....o#o......
.....ooo......</div>
<p><b>Reading the result.</b> Without inflation, A* squeezes through the single free cell between the two wall pieces (14 moves) — a point fits, but a 14 cm wide robot would scrape both walls. After inflation that gap disappears and A* returns a 22-move path around the wall, keeping a safe distance. Real systems such as the ROS 2 Nav2 costmap use a <em>graded</em> inflation: cells close to obstacles get a high cost rather than being forbidden, so the robot prefers the middle of corridors.</p>
<p><strong>Sampling-based planners.</strong> A grid over (x, y) is fine, but a 6-joint arm has a 6-dimensional C-space: with 100 values per joint that is 100<sup>6</sup> = 10<sup>12</sup> cells — impossible to store. Sampling-based planners never build the full grid:</p>
<ul><li><strong>PRM — Probabilistic Roadmap</strong> (Kavraki et al., 1996): sample many random collision-free configurations, connect nearby ones with straight collision-free segments to build a roadmap graph, then answer queries with A*/Dijkstra on that graph. Good when you plan many times in the same environment.</li><li><strong>RRT — Rapidly-exploring Random Tree</strong> (LaValle, 1998): grow a tree from the start; repeatedly pick a random point, find the nearest tree node and extend a small step towards the sample if it is collision-free. The tree spreads quickly into unexplored space. Good for single queries and high dimensions; RRT* adds rewiring so the path improves towards the optimum.</li></ul>
<p>These planners are <em>probabilistically complete</em>: if a path exists, the probability of finding it approaches 1 as the number of samples grows — but they never prove “no path”. Their paths are jagged, so a smoothing step usually follows.</p>
<p><strong>Global vs local planning.</strong> A <em>global planner</em> (A*, Dijkstra, PRM, RRT) computes a route on the known map — slow-changing, maybe once per second. A <em>local planner / controller</em> runs 10–50 times per second, looks at fresh sensor data and chooses velocity commands that follow the global path while avoiding a person who just stepped in front (e.g. the Dynamic Window Approach). Nav2 in ROS 2 is built exactly this way (Chapter 10).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Planning for a point and forgetting the robot's size — the classic “path through the door that the robot cannot fit through”.</li><li>Inflating too much: narrow corridors vanish and the planner reports “no path” although the robot fits.</li><li>Assuming RRT gives the shortest path. Plain RRT gives <em>a</em> path; use RRT* or smoothing for quality.</li><li>Trusting the global plan blindly — the map is always out of date; the local planner must react to new obstacles.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Occupancy grids turn a map into a graph for BFS/A*.</li><li>C-space describes every pose of the robot; planning = finding a path in C<sub>free</sub>.</li><li>Inflating obstacles by the robot radius lets us plan for a point safely.</li><li>PRM (roadmap, multi-query) and RRT (tree, single-query) handle high-dimensional C-spaces by sampling.</li><li>Real navigation = global planner + fast local planner reacting to sensors.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://hades.mech.northwestern.edu/index.php/Modern_Robotics" target="_blank" rel="noopener">Lynch &amp; Park — Modern Robotics (free book + videos), Chapter 10 “Motion Planning”</a></li><li><a href="https://en.wikipedia.org/wiki/Rapidly_exploring_random_tree" target="_blank" rel="noopener">Wikipedia — Rapidly exploring random tree (with animation)</a></li><li><a href="https://en.wikipedia.org/wiki/Probabilistic_roadmap" target="_blank" rel="noopener">Wikipedia — Probabilistic roadmap</a></li><li><a href="https://en.wikipedia.org/wiki/Motion_planning" target="_blank" rel="noopener">Wikipedia — Motion planning (C-space, grid, sampling methods)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A robot has radius 0.25 m, safety margin 0.05 m, and the map has 0.10 m cells. How many cells should obstacles be inflated by?</li><li>A 7-joint arm, 50 discrete values per joint: how many grid cells would its C-space have? Which kind of planner would you choose?</li><li>A corridor is 0.5 m wide and your robot is 0.6 m wide. The planner on the <em>un-inflated</em> map returns a path through it. What will happen and how do you fix it?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ⌈0.30 / 0.10⌉ = 3 cells. 2) 50<sup>7</sup> ≈ 7.8 × 10<sup>11</sup> cells — far too many; use a sampling-based planner such as RRT/RRT* (or PRM if the scene is reused). 3) The robot will hit the walls or the local planner will get stuck; inflate obstacles by the robot radius (0.3 m) so the corridor becomes blocked and the global planner finds another route.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 7 · Bài 7.3</span>
<h2>Lập kế hoạch đường đi cho robot: bản đồ, không gian cấu hình, PRM và RRT</h2>
<p class="lead">A* trên lưới đồ chơi chưa phải là robot. Robot thật có kích thước, chuyển động liên tục, mang bản đồ có nhiễu và gặp người không có trên bản đồ. <strong>Lập kế hoạch chuyển động</strong> (motion planning) lấp khoảng trống đó: biến robot và thế giới thành bài toán tìm kiếm mà BFS/A* — hoặc các bộ lập kế hoạch lấy mẫu — giải được, rồi bám theo kế hoạch một cách an toàn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả bản đồ lưới chiếm dụng và ý tưởng không gian cấu hình (C-space).</li><li>Giải thích phình vật cản (inflation) và thấy tác dụng của nó bằng code.</li><li>Giải thích cách bộ lập kế hoạch lấy mẫu (PRM, RRT) hoạt động và khi nào dùng.</li><li>Phân biệt lập kế hoạch toàn cục với lập kế hoạch cục bộ / tránh vật cản.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Bản đồ.</strong> Robot di động thường lập kế hoạch trên <strong>lưới chiếm dụng</strong> (occupancy grid): mặt sàn chia thành ô (vd 5 cm × 5 cm), mỗi ô lưu trống, bị chiếm hay chưa biết — thường là một xác suất dựng từ quét lidar (Chương 9). Lưới đơn giản và khớp ngay với tìm kiếm đồ thị: mỗi ô trống là một đỉnh, các ô kề nhau là cạnh.</p>
<p><strong>Không gian cấu hình.</strong> Một <em>cấu hình</em> là bộ số đầy đủ xác định vị trí mọi điểm của robot: (x, y) cho robot tròn, (x, y, θ) nếu hướng quan trọng, (θ<sub>1</sub>, θ<sub>2</sub>, …) cho cánh tay (Chương 4). <strong>C-space</strong> là tập mọi cấu hình; <strong>không gian tự do</strong> C<sub>free</sub> là phần robot không va chạm. Lập kế hoạch trở thành: tìm đường liên tục từ q<sub>start</sub> tới q<sub>goal</sub> nằm trọn trong C<sub>free</sub> (Lozano-Pérez, 1983).</p>
<p>Với robot tròn bán kính R, mẹo rất đơn giản: <strong>phình</strong> mọi vật cản thêm R rồi coi robot là một điểm. Mọi đường đi cho điểm trên bản đồ đã phình đều an toàn cho robot thật.</p>
<div class="formula"><span class="lbl">Bán kính phình tính theo ô</span>bán kính<sub>ô</sub> = ⌈(bán kính robot + biên an toàn) / cỡ ô⌉   vd ⌈(0,07 m + 0,03 m) / 0,10 m⌉ = 1 ô</div>
<h3>✍️ Ví dụ — phình vật cản làm đổi kế hoạch</h3>
<div class="callout"><p>Robot bán kính 7 cm, biên an toàn 3 cm, lập kế hoạch trên lưới ô 10 cm, nên vật cản được phình 1 ô (“o” trong output). Chạy A* trước và sau khi phình.</p></div>
<pre><code class="language-python">import heapq

# occupancy grid: "#" = obstacle, "." = free (1 cell = 10 cm)
MAP = [
    "..............",
    "..............",
    "......#.......",
    "......#.......",
    "..............",
    "......#.......",
    "......#.......",
    "..............",
]
ROWS, COLS = len(MAP), len(MAP[0])
occ = [[1 if ch == "#" else 0 for ch in row] for row in MAP]

def inflate(grid, radius):
    """Mark every cell within \`radius\` cells (Chebyshev distance) of an obstacle."""
    out = [row[:] for row in grid]
    for r in range(ROWS):
        for c in range(COLS):
            if grid[r][c] == 1:
                for dr in range(-radius, radius + 1):
                    for dc in range(-radius, radius + 1):
                        nr, nc = r + dr, c + dc
                        if 0 &lt;= nr &lt; ROWS and 0 &lt;= nc &lt; COLS and out[nr][nc] == 0:
                            out[nr][nc] = 2          # 2 = inflated (unsafe for robot centre)
    return out

def astar(grid, start, goal):
    h = lambda a: abs(a[0] - goal[0]) + abs(a[1] - goal[1])
    g, parent, frontier, closed = {start: 0}, {start: None}, [(h(start), start)], set()
    while frontier:
        _, cell = heapq.heappop(frontier)
        if cell == goal:
            path = []
            while cell is not None:
                path.append(cell)
                cell = parent[cell]
            return path[::-1]
        if cell in closed:
            continue
        closed.add(cell)
        r, c = cell
        for nr, nc in ((r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)):
            if 0 &lt;= nr &lt; ROWS and 0 &lt;= nc &lt; COLS and grid[nr][nc] == 0:
                if g[cell] + 1 &lt; g.get((nr, nc), 1e9):
                    g[(nr, nc)] = g[cell] + 1
                    parent[(nr, nc)] = cell
                    heapq.heappush(frontier, (g[(nr, nc)] + h((nr, nc)), (nr, nc)))
    return None

def show(grid, path):
    sym = {0: ".", 1: "#", 2: "o"}
    rows = [[sym[v] for v in row] for row in grid]
    for (r, c) in (path or [])[1:-1]:
        rows[r][c] = "*"
    rows[start[0]][start[1]], rows[goal[0]][goal[1]] = "S", "G"
    print("\\n".join("".join(r) for r in rows))

start, goal = (4, 0), (5, 13)
for radius in (0, 1):
    grid = inflate(occ, radius)
    grid[start[0]][start[1]] = grid[goal[0]][goal[1]] = 0
    path = astar(grid, start, goal)
    print("inflation radius", radius, "-&gt;", "no path" if path is None else str(len(path) - 1) + " moves")
    show(grid, path)</code></pre>
<div class="out">inflation radius 0 -&gt; 14 moves
..............
..............
......#.......
......#.......
S*************
......#......G
......#.......
..............
inflation radius 1 -&gt; 22 moves
....**********
....*ooo.....*
....*o#o.....*
....*o#o.....*
S****ooo.....*
.....o#o.....G
.....o#o......
.....ooo......</div>
<p><b>Đọc kết quả.</b> Không phình, A* lách qua đúng một ô trống giữa hai đoạn tường (14 bước) — một điểm thì lọt, nhưng robot rộng 14 cm sẽ cọ cả hai tường. Sau khi phình, khe hở biến mất và A* trả về đường 22 bước vòng quanh tường, giữ khoảng cách an toàn. Hệ thống thật như costmap của Nav2 (ROS 2) dùng phình <em>theo mức</em>: ô gần vật cản bị gán chi phí cao chứ không cấm hẳn, nên robot thích đi giữa hành lang.</p>
<p><strong>Bộ lập kế hoạch lấy mẫu.</strong> Lưới theo (x, y) thì ổn, nhưng cánh tay 6 khớp có C-space 6 chiều: 100 giá trị mỗi khớp là 100<sup>6</sup> = 10<sup>12</sup> ô — không thể lưu. Các bộ lập kế hoạch lấy mẫu không bao giờ dựng cả lưới:</p>
<ul><li><strong>PRM — Probabilistic Roadmap</strong> (Kavraki và cộng sự, 1996): lấy mẫu nhiều cấu hình ngẫu nhiên không va chạm, nối các mẫu gần nhau bằng đoạn thẳng không va chạm để có đồ thị “bản đồ đường”, rồi trả lời truy vấn bằng A*/Dijkstra trên đồ thị đó. Hợp khi lập kế hoạch nhiều lần trong cùng môi trường.</li><li><strong>RRT — Rapidly-exploring Random Tree</strong> (LaValle, 1998): mọc một cây từ điểm đầu; lặp lại: chọn điểm ngẫu nhiên, tìm nút gần nhất của cây và vươn một bước nhỏ về phía mẫu nếu không va chạm. Cây lan nhanh vào vùng chưa khám phá. Hợp cho truy vấn đơn và số chiều cao; RRT* thêm bước nối lại để đường dần tiến tới tối ưu.</li></ul>
<p>Các bộ này <em>đầy đủ theo xác suất</em>: nếu có đường, xác suất tìm ra tiến tới 1 khi số mẫu tăng — nhưng chúng không bao giờ chứng minh được “không có đường”. Đường của chúng gấp khúc nên thường có thêm bước làm trơn.</p>
<p><strong>Toàn cục và cục bộ.</strong> <em>Bộ lập kế hoạch toàn cục</em> (A*, Dijkstra, PRM, RRT) tính lộ trình trên bản đồ đã biết — thay đổi chậm, có thể mỗi giây một lần. <em>Bộ lập kế hoạch cục bộ / bộ điều khiển</em> chạy 10–50 lần mỗi giây, nhìn dữ liệu cảm biến mới và chọn lệnh vận tốc bám đường toàn cục mà vẫn tránh người vừa bước ra trước mặt (vd Dynamic Window Approach). Nav2 trong ROS 2 được xây đúng theo cách này (Chương 10).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lập kế hoạch cho một điểm mà quên kích thước robot — kinh điển “đường đi qua cánh cửa mà robot không lọt”.</li><li>Phình quá tay: hành lang hẹp biến mất và bộ lập kế hoạch báo “không có đường” dù robot vừa lọt.</li><li>Tưởng RRT cho đường ngắn nhất. RRT thuần cho <em>một</em> đường; muốn chất lượng thì dùng RRT* hoặc làm trơn.</li><li>Tin mù quáng vào kế hoạch toàn cục — bản đồ luôn lỗi thời; bộ cục bộ phải phản ứng với vật cản mới.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Lưới chiếm dụng biến bản đồ thành đồ thị cho BFS/A*.</li><li>C-space mô tả mọi tư thế của robot; lập kế hoạch = tìm đường trong C<sub>free</sub>.</li><li>Phình vật cản thêm bán kính robot cho phép lập kế hoạch cho một điểm một cách an toàn.</li><li>PRM (bản đồ đường, nhiều truy vấn) và RRT (cây, một truy vấn) xử lý C-space nhiều chiều bằng lấy mẫu.</li><li>Dẫn đường thật = bộ toàn cục + bộ cục bộ nhanh phản ứng theo cảm biến.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://hades.mech.northwestern.edu/index.php/Modern_Robotics" target="_blank" rel="noopener">Lynch &amp; Park — Modern Robotics (sách + video miễn phí), Chương 10 “Motion Planning”</a></li><li><a href="https://en.wikipedia.org/wiki/Rapidly_exploring_random_tree" target="_blank" rel="noopener">Wikipedia — Rapidly exploring random tree (có hoạt ảnh)</a></li><li><a href="https://en.wikipedia.org/wiki/Probabilistic_roadmap" target="_blank" rel="noopener">Wikipedia — Probabilistic roadmap</a></li><li><a href="https://en.wikipedia.org/wiki/Motion_planning" target="_blank" rel="noopener">Wikipedia — Motion planning (C-space, lưới, phương pháp lấy mẫu)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Robot bán kính 0,25 m, biên an toàn 0,05 m, bản đồ ô 0,10 m. Cần phình vật cản bao nhiêu ô?</li><li>Cánh tay 7 khớp, mỗi khớp 50 giá trị rời rạc: C-space dạng lưới có bao nhiêu ô? Bạn chọn loại bộ lập kế hoạch nào?</li><li>Hành lang rộng 0,5 m, robot rộng 0,6 m. Bộ lập kế hoạch trên bản đồ <em>chưa phình</em> trả về đường đi qua hành lang đó. Chuyện gì xảy ra và sửa thế nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ⌈0,30 / 0,10⌉ = 3 ô. 2) 50<sup>7</sup> ≈ 7,8 × 10<sup>11</sup> ô — quá nhiều; dùng bộ lấy mẫu như RRT/RRT* (hoặc PRM nếu môi trường dùng lại nhiều lần). 3) Robot sẽ đâm tường hoặc bộ cục bộ bị kẹt; phình vật cản thêm bán kính robot (0,3 m) để hành lang bị chặn và bộ toàn cục tìm đường khác.</p></div>`);

const q7 = QZ(7, 'Quiz — Chapter 7: Search & path planning|||Quiz — Chương 7: Tìm kiếm & lập kế hoạch đường đi', 'Kiểm tra chương 7: BFS/DFS/UCS, heuristic, A*, phình vật cản, C-space, PRM/RRT, toàn cục và cục bộ.', [
  Q('q1', 'Which frontier data structure turns the generic graph search into breadth-first search?|||Cấu trúc dữ liệu frontier nào biến tìm kiếm đồ thị tổng quát thành BFS?',
    ['LIFO stack|||Ngăn xếp LIFO', 'FIFO queue|||Hàng đợi FIFO', 'Priority queue on h(n)|||Hàng đợi ưu tiên theo h(n)', 'Hash set|||Tập băm'], 1,
    'BFS removes the oldest state first: a FIFO queue.|||BFS lấy trạng thái cũ nhất trước: hàng đợi FIFO.'),
  Q('q2', 'All moves cost 1. Which algorithm is guaranteed to return a path with the fewest moves?|||Mọi bước chi phí 1. Thuật toán nào chắc chắn trả về đường ít bước nhất?',
    ['Depth-first search|||DFS', 'Breadth-first search|||BFS', 'Greedy best-first search|||Greedy best-first', 'Random walk|||Đi ngẫu nhiên'], 1,
    'With equal step costs BFS is optimal; DFS and greedy are not.|||Khi chi phí bước bằng nhau BFS tối ưu; DFS và greedy thì không.'),
  Q('q3', 'Actions have different positive costs. Which uninformed algorithm returns the cheapest path?|||Hành động có chi phí dương khác nhau. Thuật toán mù nào trả về đường rẻ nhất?',
    ['BFS|||BFS', 'DFS|||DFS', 'Uniform-cost search (Dijkstra)|||Tìm kiếm chi phí đều (Dijkstra)', 'Hill climbing|||Leo đồi'], 2,
    'UCS expands by path cost g(n), so it is optimal for positive costs.|||UCS mở rộng theo chi phí đường g(n) nên tối ưu với chi phí dương.'),
  Q('q4', 'Manhattan distance from (2, 0) to (4, 9) on a 4-connected grid is|||Khoảng cách Manhattan từ (2, 0) tới (4, 9) trên lưới 4 hướng là',
    ['9|||9', '√85 ≈ 9.22|||√85 ≈ 9,22', '11|||11', '13|||13'], 2,
    'Row difference 2 + column difference 9 = 11 (Euclidean would be √85).|||Chênh hàng 2 + chênh cột 9 = 11 (Euclid mới là √85).'),
  Q('q5', 'A* orders the frontier by|||A* sắp xếp frontier theo',
    ['h(n) only|||chỉ h(n)', 'g(n) only|||chỉ g(n)', 'f(n) = g(n) + h(n)|||f(n) = g(n) + h(n)', 'the depth of n|||độ sâu của n'], 2,
    'g is the cost paid so far, h the estimated cost to go.|||g là chi phí đã trả, h là chi phí ước lượng còn lại.'),
  Q('q6', 'A heuristic is admissible when it|||Heuristic chấp nhận được khi nó',
    ['never overestimates the true cost to the goal|||không bao giờ ước lượng quá chi phí thật tới đích', 'is always exactly correct|||luôn đúng chính xác', 'is always larger than the true cost|||luôn lớn hơn chi phí thật', 'is computed by BFS|||được tính bằng BFS'], 0,
    'Admissible = optimistic; it guarantees A* returns an optimal path (tree search).|||Chấp nhận được = lạc quan; bảo đảm A* trả về đường tối ưu.'),
  Q('q7', 'If h(n) = 0 for every state, A* behaves like|||Nếu h(n) = 0 với mọi trạng thái, A* hoạt động như',
    ['DFS|||DFS', 'greedy best-first search|||greedy best-first', 'uniform-cost search (Dijkstra)|||tìm kiếm chi phí đều (Dijkstra)', 'RRT|||RRT'], 2,
    'f = g, which is exactly the UCS ordering.|||f = g, đúng thứ tự của UCS.'),
  Q('q8', 'Robot radius 0.15 m, margin 0.05 m, grid cell 0.10 m. Inflate obstacles by|||Robot bán kính 0,15 m, biên 0,05 m, ô lưới 0,10 m. Cần phình vật cản',
    ['1 cell|||1 ô', '2 cells|||2 ô', '3 cells|||3 ô', '20 cells|||20 ô'], 1,
    '⌈(0.15 + 0.05) / 0.10⌉ = ⌈2⌉ = 2 cells.|||⌈(0,15 + 0,05) / 0,10⌉ = 2 ô.'),
  Q('q9', 'Why are RRT and PRM preferred over a grid for a 6-joint robot arm?|||Vì sao RRT và PRM được ưa hơn lưới cho cánh tay 6 khớp?',
    ['They always find the shortest path|||Chúng luôn tìm đường ngắn nhất', 'A grid over a 6-D configuration space has far too many cells; sampling avoids building it|||Lưới trên C-space 6 chiều có quá nhiều ô; lấy mẫu tránh phải dựng nó', 'They need no collision checking|||Chúng không cần kiểm va chạm', 'They prove when no path exists|||Chúng chứng minh được khi không có đường'], 1,
    'E.g. 100 values per joint gives 10¹² cells; sampling planners are probabilistically complete instead.|||Vd 100 giá trị mỗi khớp là 10¹² ô; bộ lấy mẫu thay vào đó đầy đủ theo xác suất.'),
  Q('q10', 'A person suddenly steps in front of a navigating robot. Which component should react first?|||Một người bất ngờ bước ra trước robot đang dẫn đường. Thành phần nào phải phản ứng trước?',
    ['The global planner, by rebuilding the whole map|||Bộ toàn cục, bằng cách dựng lại cả bản đồ', 'The local planner / controller using fresh sensor data|||Bộ lập kế hoạch cục bộ / bộ điều khiển dùng dữ liệu cảm biến mới', 'The PRM roadmap builder|||Bộ dựng bản đồ đường PRM', 'Nothing — the global path is already safe|||Không gì cả — đường toàn cục đã an toàn'], 1,
    'Local planners run 10–50 times per second and avoid new obstacles.|||Bộ cục bộ chạy 10–50 lần mỗi giây và tránh vật cản mới.'),
]);

const ch7 = {
  title: 'Chapter 7 — Search and path planning|||Chương 7 — Tìm kiếm và lập kế hoạch đường đi',
  description: 'Tìm kiếm mù BFS/DFS/UCS, heuristic và A* (code Python chạy thật, so số nút mở rộng), lập kế hoạch đường đi cho robot: lưới chiếm dụng, C-space, phình vật cản, PRM/RRT, toàn cục – cục bộ (AIMA 4e Ch. 3 · Lynch & Park Ch. 10 · Siegwart Ch. 6).',
  lessons: [r71, r72, r73, q7],
};


// ───────────────────────────── Chương 8 — Học máy cơ bản ─────────────────────────────
const r81 = L('rai101-ts-8-1',
  '8.1 — What is machine learning? Supervised, unsupervised and reinforcement learning|||8.1 — Học máy là gì? Học có giám sát, không giám sát và học tăng cường',
  'Định nghĩa học máy (tác vụ T, kinh nghiệm E, thước đo P), ba kiểu học, đặc trưng và nhãn, chia tập train/validation/test, quy trình một dự án ML trên robot.',
  `<span class="eyebrow">RAI101 · Chapter 8 · Lesson 8.1</span>
<h2>What is machine learning?</h2>
<p class="lead">Writing rules by hand works for a line-following robot (“if the left sensor sees black, turn left”). It fails for recognising a pedestrian in a camera image: nobody can write down the rules for every pixel. <strong>Machine learning (ML)</strong> lets the computer find those rules from <em>data</em>. It is the part of AI behind almost every modern robot perception system.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define learning with the task / experience / performance (T, E, P) view.</li><li>Distinguish supervised, unsupervised and reinforcement learning, and regression vs classification.</li><li>Use the vocabulary: feature, label, model, parameter, training, inference.</li><li>Explain why data is split into training, validation and test sets.</li></ul>
<h3>📖 Lecture</h3>
<p>A classic definition (Tom Mitchell, 1997): a program <strong>learns</strong> from experience E with respect to a task T and a performance measure P if its performance on T, measured by P, improves with E. For a robot that sorts parcels: T = choose the right bin, E = thousands of labelled parcel photos, P = percentage of parcels sorted correctly.</p>
<p>The vocabulary you will meet everywhere:</p>
<div class="kv-grid"><div class="kv"><span class="k">Feature (x)</span><span class="v">an input measurement: distance from lidar, pixel values, motor voltage</span></div><div class="kv"><span class="k">Label (y)</span><span class="v">the correct answer we want to predict: “person”, 0.52 m/s</span></div><div class="kv"><span class="k">Model</span><span class="v">a function ŷ = f(x; θ) with parameters θ (weights)</span></div><div class="kv"><span class="k">Training</span><span class="v">adjusting θ so ŷ is close to y on known examples</span></div><div class="kv"><span class="k">Inference</span><span class="v">using the trained model on new data, e.g. on the robot</span></div></div>
<p><strong>Three kinds of learning</strong> (AIMA 4e, Ch. 19):</p>
<ul><li><strong>Supervised learning</strong> — every training example has a label. If y is a number it is <em>regression</em> (predict speed from voltage, Lesson 8.2); if y is a category it is <em>classification</em> (person vs box, Lesson 8.3).</li><li><strong>Unsupervised learning</strong> — no labels; find structure. <em>Clustering</em> groups similar lidar points into objects; <em>dimensionality reduction</em> compresses many sensor channels into a few informative ones; <em>anomaly detection</em> flags a motor whose vibration looks unusual.</li><li><strong>Reinforcement learning (RL)</strong> — an agent acts, receives a numeric <em>reward</em>, and learns a policy that maximises total reward (Lesson 8.4). Used for walking gaits, grasping and game playing.</li></ul>
<p><strong>Training, validation and test sets.</strong> A model can simply memorise its training data. To measure how well it <em>generalises</em>, keep data it has never seen. A common split is 70 % training, 15 % validation (to choose settings such as k in k-NN or the learning rate) and 15 % test (touched only once, at the end). With 2000 labelled images that is 1400 / 300 / 300.</p>
<div class="formula"><span class="lbl">ML project loop on a robot</span>define T and P → collect and label data (E) → choose features → split train / validation / test → train → evaluate → deploy on the robot → monitor and collect new data</div>
<h3>✍️ Worked example — which kind of learning?</h3>
<div class="callout"><p>1. Predict how many minutes of battery remain from voltage, current and temperature. Labelled history exists, y is a number ⇒ <b>supervised regression</b>.</p>
<p>2. Decide whether a camera crop shows a person, a forklift or a pallet ⇒ <b>supervised classification</b> (3 classes).</p>
<p>3. Group 10 000 unlabelled lidar points into separate objects ⇒ <b>unsupervised clustering</b>.</p>
<p>4. A quadruped robot learns to walk in simulation; it gets +1 for each metre forward and −10 for falling ⇒ <b>reinforcement learning</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Evaluating on the training data — accuracy looks great and collapses on the real robot.</li><li>Tuning settings on the test set: it silently becomes training data. Use the validation set.</li><li>Data from one environment only (sunny lab) while the robot works in another (dark warehouse): the model has never seen the real conditions.</li><li>Thinking ML replaces engineering: bad sensors or wrong labels give a bad model (“garbage in, garbage out”).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>ML = improving at a task T, measured by P, from experience E (data).</li><li>Supervised (labels: regression or classification), unsupervised (structure, no labels), reinforcement (rewards).</li><li>A model ŷ = f(x; θ) is trained by adjusting its parameters θ.</li><li>Always judge a model on data it has not seen: train / validation / test.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course" target="_blank" rel="noopener">Google — Machine Learning Crash Course (free)</a></li><li><a href="https://cs50.harvard.edu/ai/weeks/4/" target="_blank" rel="noopener">Harvard CS50 AI — Week 4: Learning</a></li><li><a href="https://www.coursera.org/learn/machine-learning" target="_blank" rel="noopener">Coursera — Supervised Machine Learning: Regression and Classification (Andrew Ng)</a></li><li><a href="https://www.ibm.com/think/topics/machine-learning" target="_blank" rel="noopener">IBM — What is machine learning?</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Name the kind of learning: (a) predicting tomorrow's warehouse order volume from past data; (b) a drone learning to land by trial and error in simulation; (c) grouping customers by buying behaviour without labels.</li><li>You have 5000 labelled images. Using a 70 / 15 / 15 split, how many images are in each set?</li><li>For a robot vacuum that learns to detect cables on the floor, state T, E and P.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (a) supervised regression; (b) reinforcement learning; (c) unsupervised clustering. 2) 3500 training, 750 validation, 750 test. 3) T = decide “cable / no cable” for each camera frame; E = labelled floor images; P = e.g. recall of cables (fraction of real cables detected) and accuracy.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 8 · Bài 8.1</span>
<h2>Học máy là gì?</h2>
<p class="lead">Viết luật bằng tay dùng được cho robot dò line (“nếu cảm biến trái thấy màu đen thì rẽ trái”). Nó thất bại khi phải nhận ra người đi bộ trong ảnh camera: không ai viết nổi luật cho từng điểm ảnh. <strong>Học máy (ML)</strong> để máy tính tự tìm luật từ <em>dữ liệu</em>. Đây là phần AI đứng sau gần như mọi hệ thống nhận thức của robot hiện đại.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa “học” theo góc nhìn tác vụ / kinh nghiệm / thước đo (T, E, P).</li><li>Phân biệt học có giám sát, không giám sát, tăng cường; hồi quy và phân loại.</li><li>Dùng đúng thuật ngữ: đặc trưng, nhãn, mô hình, tham số, huấn luyện, suy luận.</li><li>Giải thích vì sao chia dữ liệu thành tập huấn luyện, kiểm định và kiểm tra.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Định nghĩa kinh điển (Tom Mitchell, 1997): một chương trình <strong>học</strong> từ kinh nghiệm E đối với tác vụ T và thước đo P nếu hiệu năng của nó trên T, đo bằng P, tăng lên nhờ E. Với robot phân loại bưu kiện: T = chọn đúng thùng, E = hàng nghìn ảnh bưu kiện có nhãn, P = tỉ lệ bưu kiện xếp đúng.</p>
<p>Thuật ngữ bạn sẽ gặp ở khắp nơi:</p>
<div class="kv-grid"><div class="kv"><span class="k">Đặc trưng (x)</span><span class="v">một số đo đầu vào: khoảng cách lidar, giá trị điểm ảnh, điện áp động cơ</span></div><div class="kv"><span class="k">Nhãn (y)</span><span class="v">đáp án đúng cần dự đoán: “người”, 0,52 m/s</span></div><div class="kv"><span class="k">Mô hình</span><span class="v">hàm ŷ = f(x; θ) với tham số θ (trọng số)</span></div><div class="kv"><span class="k">Huấn luyện</span><span class="v">chỉnh θ để ŷ gần y trên các ví dụ đã biết</span></div><div class="kv"><span class="k">Suy luận</span><span class="v">dùng mô hình đã huấn luyện trên dữ liệu mới, vd ngay trên robot</span></div></div>
<p><strong>Ba kiểu học</strong> (AIMA 4e, Ch. 19):</p>
<ul><li><strong>Học có giám sát</strong> — mỗi ví dụ huấn luyện có nhãn. Nếu y là số thì là <em>hồi quy</em> (dự đoán tốc độ từ điện áp, Bài 8.2); nếu y là một loại thì là <em>phân loại</em> (người hay thùng hàng, Bài 8.3).</li><li><strong>Học không giám sát</strong> — không có nhãn; tìm cấu trúc. <em>Phân cụm</em> gom các điểm lidar gần nhau thành vật thể; <em>giảm chiều</em> nén nhiều kênh cảm biến thành vài kênh giàu thông tin; <em>phát hiện bất thường</em> cảnh báo động cơ rung lạ.</li><li><strong>Học tăng cường (RL)</strong> — tác tử hành động, nhận <em>phần thưởng</em> dạng số và học chính sách tối đa tổng phần thưởng (Bài 8.4). Dùng cho dáng đi robot, gắp vật, chơi game.</li></ul>
<p><strong>Tập huấn luyện, kiểm định, kiểm tra.</strong> Mô hình có thể chỉ học thuộc dữ liệu huấn luyện. Để đo khả năng <em>tổng quát hoá</em>, phải giữ lại dữ liệu nó chưa từng thấy. Cách chia phổ biến: 70 % huấn luyện, 15 % kiểm định (để chọn thiết lập như k trong k-NN hay tốc độ học) và 15 % kiểm tra (chỉ dùng một lần, lúc cuối). Với 2000 ảnh có nhãn là 1400 / 300 / 300.</p>
<div class="formula"><span class="lbl">Vòng đời dự án ML trên robot</span>xác định T và P → thu và gán nhãn dữ liệu (E) → chọn đặc trưng → chia train / validation / test → huấn luyện → đánh giá → đưa lên robot → theo dõi và thu thêm dữ liệu</div>
<h3>✍️ Ví dụ — kiểu học nào?</h3>
<div class="callout"><p>1. Dự đoán pin còn bao nhiêu phút từ điện áp, dòng điện, nhiệt độ. Có lịch sử có nhãn, y là số ⇒ <b>hồi quy có giám sát</b>.</p>
<p>2. Quyết định một vùng ảnh là người, xe nâng hay pallet ⇒ <b>phân loại có giám sát</b> (3 lớp).</p>
<p>3. Gom 10 000 điểm lidar không nhãn thành các vật thể riêng ⇒ <b>phân cụm không giám sát</b>.</p>
<p>4. Robot bốn chân học đi trong mô phỏng; được +1 cho mỗi mét tiến lên và −10 khi ngã ⇒ <b>học tăng cường</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đánh giá trên chính dữ liệu huấn luyện — độ chính xác đẹp rồi sụp đổ trên robot thật.</li><li>Chỉnh thiết lập trên tập kiểm tra: nó âm thầm biến thành dữ liệu huấn luyện. Hãy dùng tập kiểm định.</li><li>Dữ liệu chỉ từ một môi trường (phòng lab sáng) trong khi robot làm việc ở môi trường khác (kho tối): mô hình chưa từng thấy điều kiện thật.</li><li>Nghĩ ML thay được kỹ thuật: cảm biến kém hoặc nhãn sai cho ra mô hình kém (“rác vào, rác ra”).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>ML = làm tốt hơn tác vụ T, đo bằng P, nhờ kinh nghiệm E (dữ liệu).</li><li>Có giám sát (có nhãn: hồi quy hoặc phân loại), không giám sát (tìm cấu trúc, không nhãn), tăng cường (phần thưởng).</li><li>Mô hình ŷ = f(x; θ) được huấn luyện bằng cách chỉnh tham số θ.</li><li>Luôn đánh giá mô hình trên dữ liệu nó chưa thấy: train / validation / test.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course" target="_blank" rel="noopener">Google — Machine Learning Crash Course (miễn phí)</a></li><li><a href="https://cs50.harvard.edu/ai/weeks/4/" target="_blank" rel="noopener">Harvard CS50 AI — Week 4: Learning</a></li><li><a href="https://www.coursera.org/learn/machine-learning" target="_blank" rel="noopener">Coursera — Supervised Machine Learning: Regression and Classification (Andrew Ng)</a></li><li><a href="https://www.ibm.com/think/topics/machine-learning" target="_blank" rel="noopener">IBM — Học máy là gì?</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Gọi tên kiểu học: (a) dự đoán lượng đơn hàng của kho ngày mai từ dữ liệu cũ; (b) drone học hạ cánh bằng thử – sai trong mô phỏng; (c) gom khách hàng theo hành vi mua sắm khi không có nhãn.</li><li>Bạn có 5000 ảnh có nhãn. Chia 70 / 15 / 15 thì mỗi tập bao nhiêu ảnh?</li><li>Với robot hút bụi học phát hiện dây điện trên sàn, hãy nêu T, E và P.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (a) hồi quy có giám sát; (b) học tăng cường; (c) phân cụm không giám sát. 2) 3500 huấn luyện, 750 kiểm định, 750 kiểm tra. 3) T = quyết định “có dây / không dây” cho mỗi khung hình; E = ảnh sàn có nhãn; P = vd độ phủ (recall) — tỉ lệ dây thật được phát hiện — và độ chính xác.</p></div>`);

const r82 = L('rai101-ts-8-2',
  '8.2 — Linear regression and gradient descent|||8.2 — Hồi quy tuyến tính và gradient descent',
  'Mô hình ŷ = w·x + b, hàm mất mát MSE, gradient descent và tốc độ học; code Python huấn luyện mô hình tốc độ – điện áp động cơ chạy thật, so với bình phương tối thiểu.',
  `<span class="eyebrow">RAI101 · Chapter 8 · Lesson 8.2</span>
<h2>Linear regression and gradient descent</h2>
<p class="lead">The simplest learning machine fits a straight line through data. It is small enough to compute by hand, yet it uses exactly the same recipe as a giant neural network: <strong>a model with parameters, a loss that measures error, and gradient descent that nudges the parameters to reduce the loss</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the linear model ŷ = w·x + b and the mean squared error (MSE) loss.</li><li>Explain gradient descent and the role of the learning rate α.</li><li>Do one gradient-descent step by hand.</li><li>Train a model in Python and compare it with the least-squares formula.</li></ul>
<h3>📖 Lecture</h3>
<p>We measured a small robot's speed at several motor voltages and want to predict speed for any voltage. The model has two parameters: slope w and intercept b.</p>
<div class="formula"><span class="lbl">Model and loss</span>ŷ = w·x + b    MSE(w, b) = (1/n) Σ (ŷ<sub>i</sub> − y<sub>i</sub>)<sup>2</sup></div>
<p>The MSE is a bowl-shaped surface over (w, b); training means finding its lowest point. <strong>Gradient descent</strong> starts anywhere and repeatedly steps <em>downhill</em> — against the gradient (the vector of partial derivatives, which points uphill):</p>
<div class="formula"><span class="lbl">Gradient-descent update</span>∂MSE/∂w = (2/n) Σ (ŷ<sub>i</sub> − y<sub>i</sub>)·x<sub>i</sub>    ∂MSE/∂b = (2/n) Σ (ŷ<sub>i</sub> − y<sub>i</sub>)<br>w ← w − α·∂MSE/∂w    b ← b − α·∂MSE/∂b</div>
<p>The <strong>learning rate</strong> α sets the step size. Too small: training crawls. Too large: each step overshoots the bottom of the bowl and the loss explodes. Typical first tries: 0.1, 0.01, 0.001.</p>
<p>For a straight line there is also an exact answer, the <strong>least-squares</strong> formula w = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)<sup>2</sup>, b = ȳ − w·x̄. We use gradient descent anyway because it is the method that scales to models with millions of parameters, where no formula exists.</p>
<h3>✍️ Worked example 1 — one step by hand</h3>
<div class="callout"><p>Data: (x, y) = (1, 2) and (2, 4). Start at w = 0, b = 0, α = 0.1. Predictions ŷ = 0, 0; errors ŷ − y = −2, −4.</p>
<p>∂MSE/∂w = (2/2)·[(−2)·1 + (−4)·2] = −10;   ∂MSE/∂b = (2/2)·(−2 − 4) = −6.</p>
<p>New w = 0 − 0.1·(−10) = <b>1.0</b>; new b = 0 − 0.1·(−6) = <b>0.6</b>. MSE drops from (4 + 16)/2 = 10 to ((1.6 − 2)<sup>2</sup> + (2.6 − 4)<sup>2</sup>)/2 = (0.16 + 1.96)/2 = <b>1.06</b>.</p></div>
<h3>✍️ Worked example 2 — training in Python</h3>
<pre><code class="language-python"># Learn speed = w * voltage + b for a small DC-motor robot (measured data)
volts = [3.0, 4.0, 5.0, 6.0, 7.0, 8.0]          # input x (V)
speed = [0.31, 0.39, 0.52, 0.58, 0.71, 0.79]    # output y (m/s)
n = len(volts)

def mse(w, b):
    return sum((w * x + b - y) ** 2 for x, y in zip(volts, speed)) / n

w, b, lr = 0.0, 0.0, 0.01                        # start from zero, learning rate 0.01
for step in range(1, 20001):
    # gradients of MSE with respect to w and b
    dw = sum(2 * (w * x + b - y) * x for x, y in zip(volts, speed)) / n
    db = sum(2 * (w * x + b - y) for x, y in zip(volts, speed)) / n
    w -= lr * dw
    b -= lr * db
    if step in (1, 10, 100, 1000, 20000):
        print(f"step {step:5d}: w = {w:.4f}  b = {b:.4f}  MSE = {mse(w, b):.6f}")

# closed-form least squares for comparison
mx, my = sum(volts) / n, sum(speed) / n
w_ls = sum((x - mx) * (y - my) for x, y in zip(volts, speed)) / sum((x - mx) ** 2 for x in volts)
b_ls = my - w_ls * mx
print(f"least squares: w = {w_ls:.4f}  b = {b_ls:.4f}")
print(f"prediction at 5.5 V: {w * 5.5 + b:.3f} m/s")</code></pre>
<div class="out">step     1: w = 0.0662  b = 0.0110  MSE = 0.033671
step    10: w = 0.0971  b = 0.0161  MSE = 0.000186
step   100: w = 0.0972  b = 0.0156  MSE = 0.000186
step  1000: w = 0.0976  b = 0.0132  MSE = 0.000185
step 20000: w = 0.0977  b = 0.0126  MSE = 0.000185
least squares: w = 0.0977  b = 0.0126
prediction at 5.5 V: 0.550 m/s</div>
<p><b>Reading the result.</b> After 10 steps the error is already tiny (MSE 0.000186), but b is still drifting: the voltages are all far from 0, so the bowl is long and narrow in the b direction and gradient descent crawls along it. After 20 000 steps it matches the exact least-squares answer (w = 0.0977 m/s per volt, b = 0.0126 m/s). Rescaling features (e.g. centring x around its mean) is the standard cure for such slow convergence.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Adding the gradient instead of subtracting it — the loss grows every step.</li><li>Learning rate too large: try the same code with α = 0.05 and watch the numbers blow up.</li><li>Extrapolating: the model was fitted between 3 V and 8 V; predicting at 24 V assumes the motor stays linear, which real motors do not.</li><li>Comparing MSE values from data with different units (m/s versus km/h).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Model ŷ = w·x + b; loss MSE = average squared error.</li><li>Gradient descent: w ← w − α·∂L/∂w, repeated many times.</li><li>The learning rate α trades speed against stability.</li><li>Least squares gives the exact line; gradient descent is the general method used for neural networks.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/linear-regression" target="_blank" rel="noopener">Google ML Crash Course — Linear regression</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent" target="_blank" rel="noopener">Google ML Crash Course — Gradient descent</a></li><li><a href="https://www.youtube.com/watch?v=IHZwWFHWa-w" target="_blank" rel="noopener">3Blue1Brown — Gradient descent, how neural networks learn (video)</a></li><li><a href="https://en.wikipedia.org/wiki/Linear_regression" target="_blank" rel="noopener">Wikipedia — Linear regression</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Predictions ŷ = (2, 4) and true values y = (3, 3). Compute the MSE.</li><li>A parameter is w = 1.0, its gradient is 4 and α = 0.1. What is w after one step?</li><li>Using the trained model above (w = 0.0977, b = 0.0126), what speed does the robot have at 6.5 V?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ((2 − 3)<sup>2</sup> + (4 − 3)<sup>2</sup>)/2 = 1. 2) w = 1.0 − 0.1·4 = 0.6. 3) 0.0977·6.5 + 0.0126 ≈ 0.648 m/s.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 8 · Bài 8.2</span>
<h2>Hồi quy tuyến tính và gradient descent</h2>
<p class="lead">Cỗ máy học đơn giản nhất là vẽ một đường thẳng qua dữ liệu. Nó đủ nhỏ để tính tay, nhưng dùng đúng công thức của một mạng nơ-ron khổng lồ: <strong>một mô hình có tham số, một hàm mất mát đo sai số, và gradient descent đẩy dần tham số để giảm mất mát</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết mô hình tuyến tính ŷ = w·x + b và hàm mất mát sai số bình phương trung bình (MSE).</li><li>Giải thích gradient descent và vai trò của tốc độ học α.</li><li>Làm tay một bước gradient descent.</li><li>Huấn luyện mô hình bằng Python và so với công thức bình phương tối thiểu.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Ta đo tốc độ một robot nhỏ ở vài mức điện áp động cơ và muốn dự đoán tốc độ ở điện áp bất kỳ. Mô hình có hai tham số: hệ số góc w và hệ số chặn b.</p>
<div class="formula"><span class="lbl">Mô hình và mất mát</span>ŷ = w·x + b    MSE(w, b) = (1/n) Σ (ŷ<sub>i</sub> − y<sub>i</sub>)<sup>2</sup></div>
<p>MSE là một mặt hình cái bát trên (w, b); huấn luyện là tìm đáy bát. <strong>Gradient descent</strong> bắt đầu ở đâu đó rồi liên tục bước <em>xuống dốc</em> — ngược chiều gradient (véc-tơ các đạo hàm riêng, vốn chỉ hướng lên dốc):</p>
<div class="formula"><span class="lbl">Bước cập nhật gradient descent</span>∂MSE/∂w = (2/n) Σ (ŷ<sub>i</sub> − y<sub>i</sub>)·x<sub>i</sub>    ∂MSE/∂b = (2/n) Σ (ŷ<sub>i</sub> − y<sub>i</sub>)<br>w ← w − α·∂MSE/∂w    b ← b − α·∂MSE/∂b</div>
<p><strong>Tốc độ học</strong> α quyết định độ dài bước. Quá nhỏ: huấn luyện bò chậm. Quá lớn: mỗi bước vọt qua đáy bát và mất mát bùng nổ. Giá trị thử đầu tiên thường là 0,1; 0,01; 0,001.</p>
<p>Với đường thẳng còn có lời giải chính xác, công thức <strong>bình phương tối thiểu</strong> w = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)<sup>2</sup>, b = ȳ − w·x̄. Ta vẫn dùng gradient descent vì đó là phương pháp mở rộng được cho mô hình hàng triệu tham số, nơi không có công thức nào.</p>
<h3>✍️ Ví dụ 1 — một bước làm tay</h3>
<div class="callout"><p>Dữ liệu: (x, y) = (1, 2) và (2, 4). Bắt đầu w = 0, b = 0, α = 0,1. Dự đoán ŷ = 0, 0; sai số ŷ − y = −2, −4.</p>
<p>∂MSE/∂w = (2/2)·[(−2)·1 + (−4)·2] = −10;   ∂MSE/∂b = (2/2)·(−2 − 4) = −6.</p>
<p>w mới = 0 − 0,1·(−10) = <b>1,0</b>; b mới = 0 − 0,1·(−6) = <b>0,6</b>. MSE giảm từ (4 + 16)/2 = 10 xuống ((1,6 − 2)<sup>2</sup> + (2,6 − 4)<sup>2</sup>)/2 = (0,16 + 1,96)/2 = <b>1,06</b>.</p></div>
<h3>✍️ Ví dụ 2 — huấn luyện bằng Python</h3>
<pre><code class="language-python"># Learn speed = w * voltage + b for a small DC-motor robot (measured data)
volts = [3.0, 4.0, 5.0, 6.0, 7.0, 8.0]          # input x (V)
speed = [0.31, 0.39, 0.52, 0.58, 0.71, 0.79]    # output y (m/s)
n = len(volts)

def mse(w, b):
    return sum((w * x + b - y) ** 2 for x, y in zip(volts, speed)) / n

w, b, lr = 0.0, 0.0, 0.01                        # start from zero, learning rate 0.01
for step in range(1, 20001):
    # gradients of MSE with respect to w and b
    dw = sum(2 * (w * x + b - y) * x for x, y in zip(volts, speed)) / n
    db = sum(2 * (w * x + b - y) for x, y in zip(volts, speed)) / n
    w -= lr * dw
    b -= lr * db
    if step in (1, 10, 100, 1000, 20000):
        print(f"step {step:5d}: w = {w:.4f}  b = {b:.4f}  MSE = {mse(w, b):.6f}")

# closed-form least squares for comparison
mx, my = sum(volts) / n, sum(speed) / n
w_ls = sum((x - mx) * (y - my) for x, y in zip(volts, speed)) / sum((x - mx) ** 2 for x in volts)
b_ls = my - w_ls * mx
print(f"least squares: w = {w_ls:.4f}  b = {b_ls:.4f}")
print(f"prediction at 5.5 V: {w * 5.5 + b:.3f} m/s")</code></pre>
<div class="out">step     1: w = 0.0662  b = 0.0110  MSE = 0.033671
step    10: w = 0.0971  b = 0.0161  MSE = 0.000186
step   100: w = 0.0972  b = 0.0156  MSE = 0.000186
step  1000: w = 0.0976  b = 0.0132  MSE = 0.000185
step 20000: w = 0.0977  b = 0.0126  MSE = 0.000185
least squares: w = 0.0977  b = 0.0126
prediction at 5.5 V: 0.550 m/s</div>
<p><b>Đọc kết quả.</b> Sau 10 bước sai số đã rất nhỏ (MSE 0,000186), nhưng b vẫn trôi: các điện áp đều xa 0, nên “cái bát” dài và hẹp theo hướng b và gradient descent bò chậm dọc theo nó. Sau 20 000 bước kết quả khớp lời giải bình phương tối thiểu (w = 0,0977 m/s mỗi vôn, b = 0,0126 m/s). Chuẩn hoá đặc trưng (vd trừ x cho trung bình của nó) là cách chữa chuẩn cho hội tụ chậm kiểu này.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cộng gradient thay vì trừ — mất mát tăng sau mỗi bước.</li><li>Tốc độ học quá lớn: chạy lại code với α = 0,05 và xem các con số nổ tung.</li><li>Ngoại suy: mô hình khớp trong khoảng 3 V – 8 V; dự đoán ở 24 V là giả định động cơ vẫn tuyến tính, điều mà động cơ thật không làm.</li><li>So MSE của dữ liệu khác đơn vị (m/s so với km/h).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mô hình ŷ = w·x + b; mất mát MSE = trung bình bình phương sai số.</li><li>Gradient descent: w ← w − α·∂L/∂w, lặp nhiều lần.</li><li>Tốc độ học α đánh đổi giữa nhanh và ổn định.</li><li>Bình phương tối thiểu cho đường chính xác; gradient descent là phương pháp tổng quát dùng cho mạng nơ-ron.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/linear-regression" target="_blank" rel="noopener">Google ML Crash Course — Hồi quy tuyến tính</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent" target="_blank" rel="noopener">Google ML Crash Course — Gradient descent</a></li><li><a href="https://www.youtube.com/watch?v=IHZwWFHWa-w" target="_blank" rel="noopener">3Blue1Brown — Gradient descent, mạng nơ-ron học thế nào (video)</a></li><li><a href="https://en.wikipedia.org/wiki/Linear_regression" target="_blank" rel="noopener">Wikipedia — Linear regression</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Dự đoán ŷ = (2, 4), giá trị thật y = (3, 3). Tính MSE.</li><li>Tham số w = 1,0, gradient của nó bằng 4 và α = 0,1. Sau một bước w bằng bao nhiêu?</li><li>Dùng mô hình đã huấn luyện ở trên (w = 0,0977, b = 0,0126), robot chạy tốc độ bao nhiêu ở 6,5 V?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ((2 − 3)<sup>2</sup> + (4 − 3)<sup>2</sup>)/2 = 1. 2) w = 1,0 − 0,1·4 = 0,6. 3) 0,0977·6,5 + 0,0126 ≈ 0,648 m/s.</p></div>`);

const r83 = L('rai101-ts-8-3',
  '8.3 — Classification with k-nearest neighbours; accuracy, confusion matrix, overfitting|||8.3 — Phân loại bằng k láng giềng gần nhất; độ chính xác, ma trận nhầm lẫn, quá khớp',
  'Thuật toán k-NN, khoảng cách Euclid, chọn k, chuẩn hoá đặc trưng; accuracy, ma trận nhầm lẫn, precision/recall; quá khớp – thiếu khớp; code Python phân loại người/thùng hàng chạy thật.',
  `<span class="eyebrow">RAI101 · Chapter 8 · Lesson 8.3</span>
<h2>Classification with k-nearest neighbours</h2>
<p class="lead">A warehouse robot's depth camera sees an obstacle 1.65 m tall and 0.48 m wide. Should it slow down for a <em>person</em> or simply route around a <em>box</em>? <strong>Classification</strong> answers such questions, and <strong>k-nearest neighbours (k-NN)</strong> is the most intuitive classifier: “you are what your closest examples are”.</p>
<h3>🎯 Objectives</h3>
<ul><li>Classify a point with k-NN by hand using Euclidean distance.</li><li>Explain the effect of k and why features must be on comparable scales.</li><li>Compute accuracy, a confusion matrix, precision and recall.</li><li>Recognise overfitting and underfitting.</li></ul>
<h3>📖 Lecture</h3>
<p>k-NN stores all training examples. To classify a new point x it (1) computes the distance from x to every training point, (2) takes the k closest, and (3) returns the majority label among them. There is no real “training” step — k-NN is a <em>lazy</em> learner — but prediction is slow for huge datasets because every query compares with every stored point.</p>
<div class="formula"><span class="lbl">Euclidean distance between x = (x<sub>1</sub>, x<sub>2</sub>) and z = (z<sub>1</sub>, z<sub>2</sub>)</span>d(x, z) = √((x<sub>1</sub> − z<sub>1</sub>)<sup>2</sup> + (x<sub>2</sub> − z<sub>2</sub>)<sup>2</sup>)</div>
<p><strong>Choosing k.</strong> k = 1 follows every single training point, including noisy ones — it can <em>overfit</em>. A very large k averages over everything and ignores local patterns — it <em>underfits</em>. Choose k on the validation set; for two classes use an odd k to avoid ties.</p>
<p><strong>Feature scaling.</strong> If one feature is in millimetres (0–2000) and another in metres (0–2), the millimetre feature dominates every distance. Standardise features (subtract the mean, divide by the standard deviation) before using k-NN.</p>
<p><strong>Evaluating a classifier.</strong> <em>Accuracy</em> = correct predictions / all predictions. It hides <em>which</em> mistakes happen, so we also draw a <strong>confusion matrix</strong>: rows = true class, columns = predicted class. For the class “person”:</p>
<div class="formula"><span class="lbl">Precision and recall</span>precision = TP / (TP + FP)  (of everything called “person”, how much really was?)<br>recall = TP / (TP + FN)  (of all real persons, how many did we catch?)</div>
<p>For safety, recall on “person” matters most: a missed person (false negative) is far worse than slowing down for a box (false positive).</p>
<h3>✍️ Worked example — k-NN in Python</h3>
<pre><code class="language-python">import math
from collections import Counter

# Features measured by a warehouse robot's depth camera: (height m, width m) -&gt; label
train = [
    ((1.70, 0.45), "person"), ((1.60, 0.40), "person"), ((1.80, 0.50), "person"),
    ((1.55, 0.42), "person"), ((1.75, 0.55), "person"), ((1.20, 0.35), "person"),
    ((0.60, 0.60), "box"), ((0.40, 0.50), "box"), ((0.80, 0.80), "box"),
    ((1.00, 0.60), "box"), ((0.50, 0.40), "box"), ((1.20, 0.80), "box"),
]
test = [
    ((1.65, 0.48), "person"), ((1.10, 0.38), "person"), ((1.45, 0.60), "person"),
    ((0.70, 0.55), "box"), ((1.10, 0.70), "box"), ((1.30, 0.50), "box"),
]

def knn(x, k):
    dists = sorted((math.dist(x, xi), yi) for xi, yi in train)   # Euclidean distance
    votes = Counter(label for _, label in dists[:k])
    return votes.most_common(1)[0][0]

labels = ["person", "box"]
for k in (1, 3, 5):
    conf = {(t, p): 0 for t in labels for p in labels}
    for x, y in test:
        conf[(y, knn(x, k))] += 1
    acc = sum(conf[(c, c)] for c in labels) / len(test)
    print(f"k={k}: accuracy = {acc:.2f}")
    print("            pred person  pred box")
    for t in labels:
        print(f"  true {t:&lt;6} {conf[(t, 'person')]:&gt;8} {conf[(t, 'box')]:&gt;9}")

print("query (1.30, 0.50), k=3, neighbours:")
for d, lab in sorted((math.dist((1.30, 0.50), xi), yi) for xi, yi in train)[:3]:
    print(f"  {lab:&lt;6} at distance {d:.3f}")</code></pre>
<div class="out">k=1: accuracy = 0.83
            pred person  pred box
  true person        3         0
  true box           1         2
k=3: accuracy = 0.67
            pred person  pred box
  true person        2         1
  true box           1         2
k=5: accuracy = 0.83
            pred person  pred box
  true person        3         0
  true box           1         2
query (1.30, 0.50), k=3, neighbours:
  person at distance 0.180
  person at distance 0.262
  box    at distance 0.316</div>
<p><b>Reading the result.</b> With k = 3 the confusion matrix shows TP = 2, FN = 1, FP = 1, TN = 2, so accuracy = 4/6 ≈ 0.67, precision(person) = 2/3 and recall(person) = 2/3. The query (1.30, 0.50) is a <em>box</em>, but its 3 nearest neighbours are two persons and one box, so it is misclassified: with only height and width, a tall narrow box really does look like a person. The fix is better features (e.g. shape, motion, temperature) or more data — not just a different k. Note also that k = 1 and k = 5 both reach 0.83 here; with only 6 test points one mistake changes accuracy by 0.17, so small test sets give noisy scores.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reporting only accuracy on imbalanced data: if 95 % of obstacles are boxes, a model that always says “box” has 95 % accuracy and zero recall for people.</li><li>Not scaling features before computing distances.</li><li>Choosing k by looking at the test set.</li><li>Overfitting: 100 % training accuracy but poor test accuracy means the model memorised noise.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>k-NN predicts the majority label among the k closest training points.</li><li>Small k → overfitting; large k → underfitting; pick k on validation data.</li><li>Scale features so that no single feature dominates the distance.</li><li>Use a confusion matrix, precision and recall — not accuracy alone.</li><li>Safety-critical classes need high recall.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/neighbors.html" target="_blank" rel="noopener">scikit-learn — Nearest Neighbors (official documentation)</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/classification" target="_blank" rel="noopener">Google ML Crash Course — Classification (accuracy, precision, recall)</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/overfitting" target="_blank" rel="noopener">Google ML Crash Course — Datasets, generalization and overfitting</a></li><li><a href="https://en.wikipedia.org/wiki/Confusion_matrix" target="_blank" rel="noopener">Wikipedia — Confusion matrix</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Training points: A (0, 0) “red”, B (1, 0) “red”, C (4, 4) “blue”, D (5, 4) “blue”, E (2, 2) “blue”. Classify the query (1, 1) with k = 1 and with k = 3.</li><li>A detector finds 40 real persons out of 50 and also raises 10 false alarms. Compute precision and recall for “person”.</li><li>Your k-NN has 100 % training accuracy and 60 % validation accuracy. What is happening and what would you try?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Distances from (1, 1): A √2 ≈ 1.41, B 1, E √2 ≈ 1.41, C √18 ≈ 4.24, D √25 = 5. k = 1 → B → “red”. k = 3 → the three nearest are B, A and E (A and E both at √2): red, red, blue → “red” (2 votes to 1). 2) TP = 40, FN = 10, FP = 10: precision = 40/50 = 0.8, recall = 40/50 = 0.8. 3) Overfitting (probably k = 1); increase k, scale features, add data or better features.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 8 · Bài 8.3</span>
<h2>Phân loại bằng k láng giềng gần nhất</h2>
<p class="lead">Camera độ sâu của robot trong kho thấy một vật cản cao 1,65 m, rộng 0,48 m. Robot nên chậm lại vì đó là <em>người</em>, hay chỉ vòng qua vì là <em>thùng hàng</em>? <strong>Phân loại</strong> trả lời những câu hỏi như vậy, và <strong>k láng giềng gần nhất (k-NN)</strong> là bộ phân loại dễ hiểu nhất: “bạn giống những ví dụ gần bạn nhất”.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân loại một điểm bằng k-NN làm tay với khoảng cách Euclid.</li><li>Giải thích tác dụng của k và vì sao đặc trưng phải cùng thang đo.</li><li>Tính accuracy, ma trận nhầm lẫn, precision và recall.</li><li>Nhận ra quá khớp (overfitting) và thiếu khớp (underfitting).</li></ul>
<h3>📖 Bài giảng</h3>
<p>k-NN lưu toàn bộ ví dụ huấn luyện. Để phân loại điểm mới x nó (1) tính khoảng cách từ x tới mọi điểm huấn luyện, (2) lấy k điểm gần nhất, (3) trả về nhãn chiếm đa số trong số đó. Không có bước “huấn luyện” thật sự — k-NN là bộ học <em>lười</em> — nhưng dự đoán chậm với dữ liệu lớn vì mỗi truy vấn phải so với mọi điểm đã lưu.</p>
<div class="formula"><span class="lbl">Khoảng cách Euclid giữa x = (x<sub>1</sub>, x<sub>2</sub>) và z = (z<sub>1</sub>, z<sub>2</sub>)</span>d(x, z) = √((x<sub>1</sub> − z<sub>1</sub>)<sup>2</sup> + (x<sub>2</sub> − z<sub>2</sub>)<sup>2</sup>)</div>
<p><strong>Chọn k.</strong> k = 1 bám theo từng điểm huấn luyện, kể cả điểm nhiễu — dễ <em>quá khớp</em>. k rất lớn thì lấy trung bình mọi thứ, bỏ qua mẫu hình cục bộ — <em>thiếu khớp</em>. Chọn k trên tập kiểm định; với hai lớp dùng k lẻ để tránh hoà phiếu.</p>
<p><strong>Chuẩn hoá đặc trưng.</strong> Nếu một đặc trưng tính bằng milimét (0–2000) còn đặc trưng khác bằng mét (0–2), đặc trưng milimét áp đảo mọi khoảng cách. Hãy chuẩn hoá (trừ trung bình, chia độ lệch chuẩn) trước khi dùng k-NN.</p>
<p><strong>Đánh giá bộ phân loại.</strong> <em>Accuracy</em> = số dự đoán đúng / tổng số dự đoán. Nó che mất <em>loại</em> lỗi nào xảy ra, nên ta vẽ thêm <strong>ma trận nhầm lẫn</strong>: hàng = lớp thật, cột = lớp dự đoán. Với lớp “người”:</p>
<div class="formula"><span class="lbl">Precision và recall</span>precision = TP / (TP + FP)  (trong những gì bị gọi là “người”, bao nhiêu đúng là người?)<br>recall = TP / (TP + FN)  (trong mọi người thật, ta bắt được bao nhiêu?)</div>
<p>Về an toàn, recall của lớp “người” quan trọng nhất: bỏ sót một người (âm tính giả) tệ hơn nhiều so với chậm lại vì một thùng hàng (dương tính giả).</p>
<h3>✍️ Ví dụ — k-NN bằng Python</h3>
<pre><code class="language-python">import math
from collections import Counter

# Features measured by a warehouse robot's depth camera: (height m, width m) -&gt; label
train = [
    ((1.70, 0.45), "person"), ((1.60, 0.40), "person"), ((1.80, 0.50), "person"),
    ((1.55, 0.42), "person"), ((1.75, 0.55), "person"), ((1.20, 0.35), "person"),
    ((0.60, 0.60), "box"), ((0.40, 0.50), "box"), ((0.80, 0.80), "box"),
    ((1.00, 0.60), "box"), ((0.50, 0.40), "box"), ((1.20, 0.80), "box"),
]
test = [
    ((1.65, 0.48), "person"), ((1.10, 0.38), "person"), ((1.45, 0.60), "person"),
    ((0.70, 0.55), "box"), ((1.10, 0.70), "box"), ((1.30, 0.50), "box"),
]

def knn(x, k):
    dists = sorted((math.dist(x, xi), yi) for xi, yi in train)   # Euclidean distance
    votes = Counter(label for _, label in dists[:k])
    return votes.most_common(1)[0][0]

labels = ["person", "box"]
for k in (1, 3, 5):
    conf = {(t, p): 0 for t in labels for p in labels}
    for x, y in test:
        conf[(y, knn(x, k))] += 1
    acc = sum(conf[(c, c)] for c in labels) / len(test)
    print(f"k={k}: accuracy = {acc:.2f}")
    print("            pred person  pred box")
    for t in labels:
        print(f"  true {t:&lt;6} {conf[(t, 'person')]:&gt;8} {conf[(t, 'box')]:&gt;9}")

print("query (1.30, 0.50), k=3, neighbours:")
for d, lab in sorted((math.dist((1.30, 0.50), xi), yi) for xi, yi in train)[:3]:
    print(f"  {lab:&lt;6} at distance {d:.3f}")</code></pre>
<div class="out">k=1: accuracy = 0.83
            pred person  pred box
  true person        3         0
  true box           1         2
k=3: accuracy = 0.67
            pred person  pred box
  true person        2         1
  true box           1         2
k=5: accuracy = 0.83
            pred person  pred box
  true person        3         0
  true box           1         2
query (1.30, 0.50), k=3, neighbours:
  person at distance 0.180
  person at distance 0.262
  box    at distance 0.316</div>
<p><b>Đọc kết quả.</b> Với k = 3 ma trận nhầm lẫn cho TP = 2, FN = 1, FP = 1, TN = 2, nên accuracy = 4/6 ≈ 0,67, precision(người) = 2/3, recall(người) = 2/3. Truy vấn (1,30; 0,50) là <em>thùng</em>, nhưng 3 láng giềng gần nhất gồm hai người và một thùng, nên bị phân loại sai: chỉ với chiều cao và chiều rộng, một thùng cao và hẹp đúng là trông như người. Cách sửa là đặc trưng tốt hơn (hình dạng, chuyển động, nhiệt độ) hoặc thêm dữ liệu — không chỉ đổi k. Lưu ý k = 1 và k = 5 đều đạt 0,83 ở đây; chỉ có 6 điểm kiểm tra nên một lỗi làm accuracy đổi 0,17 — tập kiểm tra nhỏ cho điểm số nhiễu.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ báo accuracy khi dữ liệu lệch lớp: nếu 95 % vật cản là thùng, mô hình luôn nói “thùng” đạt 95 % accuracy mà recall cho người bằng 0.</li><li>Không chuẩn hoá đặc trưng trước khi tính khoảng cách.</li><li>Chọn k bằng cách nhìn tập kiểm tra.</li><li>Quá khớp: accuracy huấn luyện 100 % nhưng accuracy kiểm tra kém nghĩa là mô hình học thuộc nhiễu.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>k-NN dự đoán nhãn đa số trong k điểm huấn luyện gần nhất.</li><li>k nhỏ → quá khớp; k lớn → thiếu khớp; chọn k trên dữ liệu kiểm định.</li><li>Chuẩn hoá đặc trưng để không đặc trưng nào áp đảo khoảng cách.</li><li>Dùng ma trận nhầm lẫn, precision và recall — đừng chỉ dùng accuracy.</li><li>Lớp liên quan an toàn cần recall cao.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/neighbors.html" target="_blank" rel="noopener">scikit-learn — Nearest Neighbors (tài liệu chính thức)</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/classification" target="_blank" rel="noopener">Google ML Crash Course — Phân loại (accuracy, precision, recall)</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/overfitting" target="_blank" rel="noopener">Google ML Crash Course — Dữ liệu, tổng quát hoá và quá khớp</a></li><li><a href="https://en.wikipedia.org/wiki/Confusion_matrix" target="_blank" rel="noopener">Wikipedia — Confusion matrix</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Điểm huấn luyện: A (0, 0) “đỏ”, B (1, 0) “đỏ”, C (4, 4) “xanh”, D (5, 4) “xanh”, E (2, 2) “xanh”. Phân loại truy vấn (1, 1) với k = 1 và k = 3.</li><li>Một bộ phát hiện tìm ra 40 trên 50 người thật và báo nhầm thêm 10 lần. Tính precision và recall cho lớp “người”.</li><li>k-NN của bạn đạt 100 % trên tập huấn luyện và 60 % trên tập kiểm định. Chuyện gì đang xảy ra, bạn sẽ thử gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Khoảng cách từ (1, 1): A √2 ≈ 1,41; B 1; E √2 ≈ 1,41; C √18 ≈ 4,24; D √25 = 5. k = 1 → B → “đỏ”. k = 3 → ba điểm gần nhất là B, A và E (A và E cùng cách √2): đỏ, đỏ, xanh → “đỏ” (2 phiếu so với 1). 2) TP = 40, FN = 10, FP = 10: precision = 40/50 = 0,8; recall = 40/50 = 0,8. 3) Quá khớp (có lẽ k = 1); tăng k, chuẩn hoá đặc trưng, thêm dữ liệu hoặc đặc trưng tốt hơn.</p></div>`);

const r84 = L('rai101-ts-8-4',
  '8.4 — Neural networks and reinforcement learning: the intuition|||8.4 — Mạng nơ-ron và học tăng cường: hiểu bằng trực giác',
  'Perceptron, mạng nhiều lớp, hàm kích hoạt, lan truyền ngược; học tăng cường: trạng thái, hành động, phần thưởng, Q-learning, ε-greedy; code Python perceptron và Q-learning hành lang chạy thật.',
  `<span class="eyebrow">RAI101 · Chapter 8 · Lesson 8.4</span>
<h2>Neural networks and reinforcement learning: the intuition</h2>
<p class="lead">Two ideas power most headline robotics AI today. <strong>Neural networks</strong> learn complex functions — from pixels to “person” — by stacking many simple units. <strong>Reinforcement learning</strong> learns <em>behaviour</em> — how to act — from rewards instead of labels. This lesson builds the intuition with two tiny programs you can read line by line.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain a perceptron (weights, bias, activation) and its learning rule.</li><li>Describe how layers, activation functions and backpropagation make deep networks.</li><li>Describe the RL loop: state, action, reward, policy, discount γ.</li><li>Apply the Q-learning update once by hand.</li></ul>
<h3>📖 Lecture — neural networks</h3>
<p>A <strong>perceptron</strong> (Rosenblatt, 1958) computes a weighted sum of its inputs plus a bias and passes it through an activation: output = 1 if w<sub>1</sub>x<sub>1</sub> + w<sub>2</sub>x<sub>2</sub> + b &gt; 0, else 0. Learning rule: after each wrong answer, move each weight by α·(target − output)·x<sub>i</sub>. A single perceptron can only separate classes with a straight line, so it famously cannot learn XOR (Minsky &amp; Papert, 1969).</p>
<p>The fix is to stack them. A <strong>multi-layer network</strong> has an input layer, one or more <em>hidden</em> layers and an output layer. Each unit computes a weighted sum followed by a non-linear <em>activation</em> such as ReLU(z) = max(0, z) or the sigmoid 1/(1 + e<sup>−z</sup>). Without the non-linearity, many layers would collapse into one linear model. Training uses the same idea as Lesson 8.2 — gradient descent on a loss — and <strong>backpropagation</strong> computes all the gradients efficiently with the chain rule. Networks for images (CNNs, Chapter 9) can have millions of weights.</p>
<h3>📖 Lecture — reinforcement learning</h3>
<p>In RL an <strong>agent</strong> observes a <strong>state</strong> s, takes an <strong>action</strong> a, receives a <strong>reward</strong> r and lands in a new state s′. Its goal is a <strong>policy</strong> (state → action) that maximises the total <em>discounted</em> reward r<sub>0</sub> + γr<sub>1</sub> + γ<sup>2</sup>r<sub>2</sub> + …, where 0 ≤ γ &lt; 1 makes near rewards worth more than distant ones. <strong>Q-learning</strong> (Watkins, 1989) learns a table Q(s, a) = “how good is action a in state s”:</p>
<div class="formula"><span class="lbl">Q-learning update</span>Q(s, a) ← Q(s, a) + α·[ r + γ·max<sub>a′</sub> Q(s′, a′) − Q(s, a) ]</div>
<p>To keep discovering, the agent uses <strong>ε-greedy</strong> exploration: with probability ε it tries a random action, otherwise it takes the best known one.</p>
<h3>✍️ Worked example 1 — one Q-learning update by hand</h3>
<div class="callout"><p>Q(3, right) = 0, α = 0.5, γ = 0.9. The robot moves right to state 4, gets r = −1, and max Q(4, ·) = 10. Target = −1 + 0.9·10 = 8. New Q(3, right) = 0 + 0.5·(8 − 0) = <b>4</b>.</p></div>
<h3>✍️ Worked example 2 — a perceptron and a Q-learner in Python</h3>
<pre><code class="language-python">import random

# --- Part 1: a single perceptron learns "stop if bumper OR cliff sensor fires" ---
data = [((0, 0), 0), ((0, 1), 1), ((1, 0), 1), ((1, 1), 1)]
w, b, lr = [0.0, 0.0], 0.0, 0.1
for epoch in range(1, 11):
    errors = 0
    for (x1, x2), target in data:
        out = 1 if w[0] * x1 + w[1] * x2 + b &gt; 0 else 0
        err = target - out
        if err != 0:
            errors += 1
            w[0] += lr * err * x1
            w[1] += lr * err * x2
            b += lr * err
    print(f"epoch {epoch}: errors = {errors}, w = [{w[0]:.1f}, {w[1]:.1f}], b = {b:.1f}")
    if errors == 0:
        break

# --- Part 2: tabular Q-learning in a 1-D corridor: cells 0..5, charger at cell 5 ---
random.seed(0)
N, GOAL = 6, 5
Q = [[0.0, 0.0] for _ in range(N)]        # actions: 0 = left, 1 = right
alpha, gamma, eps = 0.5, 0.9, 0.2
for episode in range(200):
    s = 0
    while s != GOAL:
        a = random.randrange(2) if random.random() &lt; eps else (0 if Q[s][0] &gt; Q[s][1] else 1)
        s2 = max(0, s - 1) if a == 0 else s + 1
        r = 10 if s2 == GOAL else -1          # reward: +10 at charger, -1 per step
        target = r if s2 == GOAL else r + gamma * max(Q[s2])
        Q[s][a] += alpha * (target - Q[s][a])
        s = s2
print("learned policy:", " ".join("R" if q[1] &gt;= q[0] else "L" for q in Q[:GOAL]))
print("Q(0,right) =", round(Q[0][1], 2), "| Q(4,right) =", round(Q[4][1], 2))</code></pre>
<div class="out">epoch 1: errors = 1, w = [0.0, 0.1], b = 0.1
epoch 2: errors = 2, w = [0.1, 0.1], b = 0.1
epoch 3: errors = 1, w = [0.1, 0.1], b = 0.0
epoch 4: errors = 0, w = [0.1, 0.1], b = 0.0
learned policy: R R R R R
Q(0,right) = 3.12 | Q(4,right) = 10.0</div>
<p><b>Reading the result.</b> Part 1: after 3 epochs with mistakes, the perceptron finds w = [0.1, 0.1], b = 0, i.e. “stop if 0.1·bumper + 0.1·cliff &gt; 0” — exactly the OR rule, learned from 4 examples. Part 2: the robot starts with no idea where the charger is; after 200 episodes its policy is “go right” in every cell. Q(4, right) = 10 (the charger is one step away) and Q(0, right) = 3.12, which equals the exact value −1 − 0.9 − 0.81 − 0.729 + 0.9<sup>4</sup>·10 ≈ 3.12 for the 5-step route.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking a neural network “understands” — it fits a function to its training data and can fail badly on unusual inputs.</li><li>Forgetting the activation function: stacked linear layers are still linear.</li><li>Badly designed rewards: reward a robot only for speed and it learns to spin in circles at full speed (“reward hacking”).</li><li>Training RL directly on a real robot from scratch — thousands of falls. Train in simulation first, then transfer.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A perceptron = weighted sum + bias + threshold; it learns linear boundaries only.</li><li>Deep networks stack layers with non-linear activations; backpropagation + gradient descent trains them.</li><li>RL learns a policy from rewards; γ discounts future rewards.</li><li>Q-learning updates Q(s, a) towards r + γ·max Q(s′, ·); ε-greedy balances exploration and exploitation.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.youtube.com/watch?v=aircAruvnKk" target="_blank" rel="noopener">3Blue1Brown — But what is a neural network? (video)</a></li><li><a href="https://playground.tensorflow.org/" target="_blank" rel="noopener">TensorFlow Playground — train a small network in your browser</a></li><li><a href="https://spinningup.openai.com/en/latest/spinningup/rl_intro.html" target="_blank" rel="noopener">OpenAI Spinning Up — Key Concepts in RL</a></li><li><a href="http://incompleteideas.net/book/the-book-2nd.html" target="_blank" rel="noopener">Sutton &amp; Barto — Reinforcement Learning: An Introduction (free book)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A perceptron has w = [0.5, −0.5], b = 0.1. What does it output for x = (1, 1) and for x = (0, 1)?</li><li>Q(2, left) = 2, α = 0.5, γ = 0.9, reward r = −1 and max Q(s′, ·) = 4. Compute the new Q(2, left).</li><li>With γ = 0.9, what is the discounted value of receiving reward 10 three steps from now (i.e. γ<sup>3</sup>·10)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (1, 1): 0.5 − 0.5 + 0.1 = 0.1 &gt; 0 → 1. (0, 1): −0.5 + 0.1 = −0.4 → 0. 2) Target = −1 + 0.9·4 = 2.6; new Q = 2 + 0.5·(2.6 − 2) = 2.3. 3) 0.9<sup>3</sup>·10 = 0.729·10 = 7.29.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 8 · Bài 8.4</span>
<h2>Mạng nơ-ron và học tăng cường: hiểu bằng trực giác</h2>
<p class="lead">Hai ý tưởng đứng sau phần lớn AI robot nổi bật ngày nay. <strong>Mạng nơ-ron</strong> học những hàm phức tạp — từ điểm ảnh tới “người” — bằng cách xếp chồng nhiều đơn vị đơn giản. <strong>Học tăng cường</strong> học <em>hành vi</em> — cách hành động — từ phần thưởng thay vì nhãn. Bài này xây trực giác bằng hai chương trình nhỏ đọc được từng dòng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích perceptron (trọng số, bias, kích hoạt) và luật học của nó.</li><li>Mô tả cách lớp ẩn, hàm kích hoạt và lan truyền ngược tạo nên mạng sâu.</li><li>Mô tả vòng lặp RL: trạng thái, hành động, phần thưởng, chính sách, hệ số chiết khấu γ.</li><li>Làm tay một bước cập nhật Q-learning.</li></ul>
<h3>📖 Bài giảng — mạng nơ-ron</h3>
<p><strong>Perceptron</strong> (Rosenblatt, 1958) tính tổng có trọng số của đầu vào cộng bias rồi đưa qua hàm kích hoạt: đầu ra = 1 nếu w<sub>1</sub>x<sub>1</sub> + w<sub>2</sub>x<sub>2</sub> + b &gt; 0, ngược lại 0. Luật học: sau mỗi lần trả lời sai, dịch mỗi trọng số một lượng α·(đích − đầu ra)·x<sub>i</sub>. Một perceptron chỉ tách được các lớp bằng một đường thẳng, nên nổi tiếng là không học được XOR (Minsky &amp; Papert, 1969).</p>
<p>Cách sửa là xếp chồng. <strong>Mạng nhiều lớp</strong> có lớp vào, một hoặc nhiều lớp <em>ẩn</em> và lớp ra. Mỗi đơn vị tính tổng có trọng số rồi qua một <em>hàm kích hoạt</em> phi tuyến như ReLU(z) = max(0, z) hoặc sigmoid 1/(1 + e<sup>−z</sup>). Không có phi tuyến, nhiều lớp sẽ gộp lại thành một mô hình tuyến tính. Huấn luyện dùng đúng ý tưởng của Bài 8.2 — gradient descent trên hàm mất mát — và <strong>lan truyền ngược</strong> (backpropagation) tính mọi gradient hiệu quả bằng quy tắc dây chuyền. Mạng xử lý ảnh (CNN, Chương 9) có thể có hàng triệu trọng số.</p>
<h3>📖 Bài giảng — học tăng cường</h3>
<p>Trong RL, <strong>tác tử</strong> quan sát <strong>trạng thái</strong> s, chọn <strong>hành động</strong> a, nhận <strong>phần thưởng</strong> r và tới trạng thái mới s′. Mục tiêu là một <strong>chính sách</strong> (trạng thái → hành động) tối đa tổng phần thưởng <em>có chiết khấu</em> r<sub>0</sub> + γr<sub>1</sub> + γ<sup>2</sup>r<sub>2</sub> + …, trong đó 0 ≤ γ &lt; 1 làm phần thưởng gần có giá trị hơn phần thưởng xa. <strong>Q-learning</strong> (Watkins, 1989) học một bảng Q(s, a) = “hành động a ở trạng thái s tốt đến đâu”:</p>
<div class="formula"><span class="lbl">Cập nhật Q-learning</span>Q(s, a) ← Q(s, a) + α·[ r + γ·max<sub>a′</sub> Q(s′, a′) − Q(s, a) ]</div>
<p>Để tiếp tục khám phá, tác tử dùng <strong>ε-greedy</strong>: với xác suất ε nó thử hành động ngẫu nhiên, còn lại chọn hành động tốt nhất đã biết.</p>
<h3>✍️ Ví dụ 1 — làm tay một bước Q-learning</h3>
<div class="callout"><p>Q(3, phải) = 0, α = 0,5, γ = 0,9. Robot sang phải tới trạng thái 4, nhận r = −1, và max Q(4, ·) = 10. Đích = −1 + 0,9·10 = 8. Q(3, phải) mới = 0 + 0,5·(8 − 0) = <b>4</b>.</p></div>
<h3>✍️ Ví dụ 2 — perceptron và Q-learning bằng Python</h3>
<pre><code class="language-python">import random

# --- Part 1: a single perceptron learns "stop if bumper OR cliff sensor fires" ---
data = [((0, 0), 0), ((0, 1), 1), ((1, 0), 1), ((1, 1), 1)]
w, b, lr = [0.0, 0.0], 0.0, 0.1
for epoch in range(1, 11):
    errors = 0
    for (x1, x2), target in data:
        out = 1 if w[0] * x1 + w[1] * x2 + b &gt; 0 else 0
        err = target - out
        if err != 0:
            errors += 1
            w[0] += lr * err * x1
            w[1] += lr * err * x2
            b += lr * err
    print(f"epoch {epoch}: errors = {errors}, w = [{w[0]:.1f}, {w[1]:.1f}], b = {b:.1f}")
    if errors == 0:
        break

# --- Part 2: tabular Q-learning in a 1-D corridor: cells 0..5, charger at cell 5 ---
random.seed(0)
N, GOAL = 6, 5
Q = [[0.0, 0.0] for _ in range(N)]        # actions: 0 = left, 1 = right
alpha, gamma, eps = 0.5, 0.9, 0.2
for episode in range(200):
    s = 0
    while s != GOAL:
        a = random.randrange(2) if random.random() &lt; eps else (0 if Q[s][0] &gt; Q[s][1] else 1)
        s2 = max(0, s - 1) if a == 0 else s + 1
        r = 10 if s2 == GOAL else -1          # reward: +10 at charger, -1 per step
        target = r if s2 == GOAL else r + gamma * max(Q[s2])
        Q[s][a] += alpha * (target - Q[s][a])
        s = s2
print("learned policy:", " ".join("R" if q[1] &gt;= q[0] else "L" for q in Q[:GOAL]))
print("Q(0,right) =", round(Q[0][1], 2), "| Q(4,right) =", round(Q[4][1], 2))</code></pre>
<div class="out">epoch 1: errors = 1, w = [0.0, 0.1], b = 0.1
epoch 2: errors = 2, w = [0.1, 0.1], b = 0.1
epoch 3: errors = 1, w = [0.1, 0.1], b = 0.0
epoch 4: errors = 0, w = [0.1, 0.1], b = 0.0
learned policy: R R R R R
Q(0,right) = 3.12 | Q(4,right) = 10.0</div>
<p><b>Đọc kết quả.</b> Phần 1: sau 3 epoch còn sai, perceptron tìm được w = [0,1; 0,1], b = 0, tức “dừng nếu 0,1·cản_va + 0,1·hụt_sàn &gt; 0” — đúng luật OR, học từ 4 ví dụ. Phần 2: robot ban đầu không biết trạm sạc ở đâu; sau 200 lượt, chính sách là “sang phải” ở mọi ô. Q(4, phải) = 10 (trạm sạc cách một bước) và Q(0, phải) = 3,12, khớp giá trị chính xác −1 − 0,9 − 0,81 − 0,729 + 0,9<sup>4</sup>·10 ≈ 3,12 cho lộ trình 5 bước.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tưởng mạng nơ-ron “hiểu” — nó chỉ khớp một hàm với dữ liệu huấn luyện và có thể sai nặng với đầu vào lạ.</li><li>Quên hàm kích hoạt: xếp chồng các lớp tuyến tính vẫn chỉ là tuyến tính.</li><li>Thiết kế phần thưởng kém: chỉ thưởng tốc độ thì robot học cách quay tròn hết tốc lực (“reward hacking”).</li><li>Huấn luyện RL từ đầu trực tiếp trên robot thật — hàng nghìn lần ngã. Hãy huấn luyện trong mô phỏng trước rồi chuyển sang.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Perceptron = tổng có trọng số + bias + ngưỡng; chỉ học được ranh giới tuyến tính.</li><li>Mạng sâu xếp chồng các lớp với kích hoạt phi tuyến; huấn luyện bằng lan truyền ngược + gradient descent.</li><li>RL học chính sách từ phần thưởng; γ chiết khấu phần thưởng tương lai.</li><li>Q-learning kéo Q(s, a) về r + γ·max Q(s′, ·); ε-greedy cân bằng khám phá và khai thác.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.youtube.com/watch?v=aircAruvnKk" target="_blank" rel="noopener">3Blue1Brown — Mạng nơ-ron là gì? (video)</a></li><li><a href="https://playground.tensorflow.org/" target="_blank" rel="noopener">TensorFlow Playground — huấn luyện mạng nhỏ ngay trên trình duyệt</a></li><li><a href="https://spinningup.openai.com/en/latest/spinningup/rl_intro.html" target="_blank" rel="noopener">OpenAI Spinning Up — Khái niệm cốt lõi của RL</a></li><li><a href="http://incompleteideas.net/book/the-book-2nd.html" target="_blank" rel="noopener">Sutton &amp; Barto — Reinforcement Learning: An Introduction (sách miễn phí)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Perceptron có w = [0,5; −0,5], b = 0,1. Đầu ra với x = (1, 1) và x = (0, 1) là gì?</li><li>Q(2, trái) = 2, α = 0,5, γ = 0,9, phần thưởng r = −1 và max Q(s′, ·) = 4. Tính Q(2, trái) mới.</li><li>Với γ = 0,9, phần thưởng 10 nhận sau ba bước nữa có giá trị chiết khấu bao nhiêu (γ<sup>3</sup>·10)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (1, 1): 0,5 − 0,5 + 0,1 = 0,1 &gt; 0 → 1. (0, 1): −0,5 + 0,1 = −0,4 → 0. 2) Đích = −1 + 0,9·4 = 2,6; Q mới = 2 + 0,5·(2,6 − 2) = 2,3. 3) 0,9<sup>3</sup>·10 = 0,729·10 = 7,29.</p></div>`);

const q8 = QZ(8, 'Quiz — Chapter 8: Machine learning basics|||Quiz — Chương 8: Học máy cơ bản', 'Kiểm tra chương 8: kiểu học, chia dữ liệu, MSE, gradient descent, k-NN, precision/recall, quá khớp, perceptron, Q-learning.', [
  Q('q1', 'Predicting a robot battery’s remaining minutes from labelled history is|||Dự đoán số phút pin còn lại của robot từ lịch sử có nhãn là',
    ['unsupervised clustering|||phân cụm không giám sát', 'supervised regression|||hồi quy có giám sát', 'supervised classification|||phân loại có giám sát', 'reinforcement learning|||học tăng cường'], 1,
    'Labels exist and the target is a number.|||Có nhãn và đích là một số.'),
  Q('q2', 'Why keep a separate test set?|||Vì sao phải giữ riêng một tập kiểm tra?',
    ['To train faster|||Để huấn luyện nhanh hơn', 'To measure generalisation on data the model has never seen|||Để đo khả năng tổng quát hoá trên dữ liệu mô hình chưa từng thấy', 'To choose the learning rate|||Để chọn tốc độ học', 'Because ML libraries require it|||Vì thư viện ML bắt buộc'], 1,
    'Settings are tuned on validation; the test set is used once at the end.|||Thiết lập chỉnh trên tập kiểm định; tập kiểm tra chỉ dùng một lần lúc cuối.'),
  Q('q3', 'Predictions (2, 4), true values (3, 3). The MSE is|||Dự đoán (2, 4), giá trị thật (3, 3). MSE bằng',
    ['0|||0', '1|||1', '2|||2', '0.5|||0,5'], 1,
    '((−1)² + 1²)/2 = 1.|||((−1)² + 1²)/2 = 1.'),
  Q('q4', 'w = 1.0, ∂L/∂w = 4, learning rate 0.1. After one gradient-descent step w =|||w = 1,0, ∂L/∂w = 4, tốc độ học 0,1. Sau một bước gradient descent w =',
    ['1.4|||1,4', '0.6|||0,6', '0.96|||0,96', '−3.0|||−3,0'], 1,
    'w − α·gradient = 1.0 − 0.4 = 0.6.|||w − α·gradient = 1,0 − 0,4 = 0,6.'),
  Q('q5', 'Training loss grows larger at every step. The most likely cause is|||Mất mát huấn luyện tăng sau mỗi bước. Nguyên nhân khả dĩ nhất là',
    ['the learning rate is too large|||tốc độ học quá lớn', 'too much training data|||quá nhiều dữ liệu', 'k is odd|||k lẻ', 'the test set is too small|||tập kiểm tra quá nhỏ'], 0,
    'Too large α overshoots the minimum (or the gradient is added instead of subtracted).|||α quá lớn làm vọt qua điểm cực tiểu (hoặc cộng gradient thay vì trừ).'),
  Q('q6', 'Before running k-NN on features in millimetres and in metres you should|||Trước khi chạy k-NN với đặc trưng tính bằng milimét và bằng mét, bạn nên',
    ['use k = 1|||dùng k = 1', 'scale (standardise) the features|||chuẩn hoá đặc trưng', 'remove the test set|||bỏ tập kiểm tra', 'square all labels|||bình phương mọi nhãn'], 1,
    'Otherwise the large-range feature dominates every distance.|||Nếu không, đặc trưng có biên độ lớn sẽ áp đảo mọi khoảng cách.'),
  Q('q7', 'A person detector finds 40 of 50 real persons and raises 10 false alarms. Recall for “person” is|||Bộ phát hiện tìm ra 40 trên 50 người thật và báo nhầm 10 lần. Recall cho “người” là',
    ['0.5|||0,5', '0.8|||0,8', '0.9|||0,9', '1.0|||1,0'], 1,
    'Recall = TP/(TP + FN) = 40/50 = 0.8.|||Recall = TP/(TP + FN) = 40/50 = 0,8.'),
  Q('q8', '100 % training accuracy but 60 % validation accuracy indicates|||Accuracy huấn luyện 100 % nhưng kiểm định 60 % cho thấy',
    ['underfitting|||thiếu khớp', 'overfitting|||quá khớp', 'a perfect model|||mô hình hoàn hảo', 'a learning rate that is too small|||tốc độ học quá nhỏ'], 1,
    'The model memorised training noise and does not generalise.|||Mô hình học thuộc nhiễu huấn luyện và không tổng quát hoá.'),
  Q('q9', 'Why can a single perceptron not learn XOR?|||Vì sao một perceptron không học được XOR?',
    ['XOR has too many inputs|||XOR có quá nhiều đầu vào', 'XOR is not linearly separable|||XOR không tách được bằng đường thẳng', 'The learning rate is fixed|||Tốc độ học cố định', 'It has no bias|||Nó không có bias'], 1,
    'A perceptron draws one straight boundary; XOR needs two (a hidden layer).|||Perceptron chỉ vẽ một đường biên thẳng; XOR cần hai (một lớp ẩn).'),
  Q('q10', 'Q(s, a) = 0, α = 0.5, γ = 0.9, r = −1, max Q(s′, ·) = 10. The updated Q(s, a) is|||Q(s, a) = 0, α = 0,5, γ = 0,9, r = −1, max Q(s′, ·) = 10. Q(s, a) mới là',
    ['8|||8', '4|||4', '4.5|||4,5', '−0.5|||−0,5'], 1,
    'Target −1 + 0.9·10 = 8; Q = 0 + 0.5·(8 − 0) = 4.|||Đích −1 + 0,9·10 = 8; Q = 0 + 0,5·(8 − 0) = 4.'),
]);

const ch8 = {
  title: 'Chapter 8 — Machine learning basics|||Chương 8 — Học máy cơ bản',
  description: 'Học máy là gì và ba kiểu học, hồi quy tuyến tính và gradient descent, phân loại k-NN với ma trận nhầm lẫn và quá khớp, trực giác về mạng nơ-ron và Q-learning — code Python chạy thật (AIMA 4e Ch. 19, 21, 22).',
  lessons: [r81, r82, r83, r84, q8],
};


// ───────────────────────────── Chương 9 — Nhận thức & định vị ─────────────────────────────
const r91 = L('rai101-ts-9-1',
  '9.1 — Digital images and the pinhole camera model|||9.1 — Ảnh số và mô hình camera lỗ kim',
  'Ảnh là mảng số (H×W×C), điểm ảnh RGB, chuyển sang ảnh xám, độ phân giải và dung lượng; mô hình camera lỗ kim chiếu điểm 3D thành pixel, có code numpy chạy thật.',
  `<span class="eyebrow">RAI101 · Chapter 9 · Lesson 9.1</span>
<h2>Digital images and the pinhole camera model</h2>
<p class="lead">A camera is the richest sensor a robot can carry — and the cheapest. But to a computer an image is only a grid of numbers. This lesson shows how that grid is stored and how a 3D point in the world becomes a pixel.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe a digital image as an array of shape height × width × channels.</li><li>Convert a colour pixel to grayscale with standard weights.</li><li>Compute the memory and bandwidth of an image stream.</li><li>Project a 3D point to pixel coordinates with the pinhole camera model.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Perception</strong> is the step in the sense–think–act loop that turns raw sensor data into useful information: “there is a person 3 m ahead”, “the door is open”, “I am in the kitchen”. Cameras, lidar and sonar all feed perception, but cameras dominate because they are cheap and carry colour, texture and text.</p>
<p>A <strong>digital image</strong> is a 2D grid of <strong>pixels</strong> (picture elements). A grayscale image stores one brightness value per pixel; a colour image stores three — <strong>red, green, blue</strong> (RGB). With 8-bit storage each value is an integer 0–255 (0 = dark, 255 = full intensity). In Python the image is a NumPy array with shape <code>(H, W, 3)</code>: the first index is the <strong>row</strong> (y, counted downward from the top), the second the <strong>column</strong> (x, counted to the right). Note the order: <code>img[row, col]</code>, not <code>img[x, y]</code>.</p>
<div class="formula"><span class="lbl">Grayscale (ITU-R BT.601 luma)</span>Y = 0.299·R + 0.587·G + 0.114·B</div>
<p>Green gets the largest weight because the human eye is most sensitive to it. Many vision algorithms (edges, features) run on grayscale because it is three times smaller and brightness carries most of the structure.</p>
<p><strong>Resolution and data rate.</strong> A Full-HD frame is 1920 × 1080 pixels × 3 bytes = 6 220 800 bytes ≈ 6.2 MB. At 30 frames per second the camera produces about 187 MB/s — which is why robots compress video, downscale it, or process it on a GPU right next to the camera.</p>
<p><strong>The pinhole camera model.</strong> Light from a 3D point passes through a single point (the optical centre) and hits the image plane. If the point has coordinates (X, Y, Z) in the camera frame (Z pointing forward along the optical axis), similar triangles give its pixel position:</p>
<div class="formula"><span class="lbl">Pinhole projection</span>u = f<sub>x</sub> · X / Z + c<sub>x</sub>    v = f<sub>y</sub> · Y / Z + c<sub>y</sub></div>
<p>Here f<sub>x</sub>, f<sub>y</sub> are the focal lengths <em>in pixels</em> and (c<sub>x</sub>, c<sub>y</sub>) is the principal point, usually near the image centre. These four numbers are the camera's <strong>intrinsic parameters</strong>; they are found by <strong>calibration</strong> (photographing a checkerboard from several angles). The division by Z is the key fact: <strong>an object twice as far away looks half as big</strong>, and a single image loses depth — that is why robots add stereo cameras, depth cameras or lidar.</p>
<h3>✍️ Worked example (run in Python)</h3>
<div class="callout"><p>We build a tiny 2 × 3 colour image, convert it to grayscale, and project the same point at two depths with f<sub>x</sub> = f<sub>y</sub> = 800 px and principal point (320, 240) for a 640 × 480 camera.</p></div>
<pre><code class="language-python">import numpy as np

# A tiny 2x3 colour image: shape (rows, cols, channels), values 0..255
img = np.array([[[255, 0, 0], [0, 255, 0], [0, 0, 255]],
                [[255, 255, 255], [128, 128, 128], [0, 0, 0]]], dtype=np.uint8)
print("shape:", img.shape, "dtype:", img.dtype)
print("pixel (row 0, col 1) RGB =", img[0, 1])

# Grayscale with ITU-R BT.601 weights
w = np.array([0.299, 0.587, 0.114])
gray = np.round(img @ w).astype(np.uint8)
print("gray =")
print(gray)

# Pinhole camera: u = fx*X/Z + cx, v = fy*Y/Z + cy
fx = fy = 800.0          # focal length in pixels
cx, cy = 320.0, 240.0    # principal point (640x480 image)
for X, Y, Z in [(0.5, 0.2, 2.0), (0.5, 0.2, 4.0)]:
    u = fx * X / Z + cx
    v = fy * Y / Z + cy
    print(f"point ({X}, {Y}, {Z}) m -&gt; pixel (u, v) = ({u:.1f}, {v:.1f})")
</code></pre>
<div class="out">shape: (2, 3, 3) dtype: uint8
pixel (row 0, col 1) RGB = [  0 255   0]
gray =
[[ 76 150  29]
 [255 128   0]]
point (0.5, 0.2, 2.0) m -&gt; pixel (u, v) = (520.0, 320.0)
point (0.5, 0.2, 4.0) m -&gt; pixel (u, v) = (420.0, 280.0)</div>
<p>Read the result: pure green (0, 255, 0) becomes gray 150 but pure blue only 29 — green looks brighter to us. Moving the point from 2 m to 4 m halves its offset from the centre: 200 px → 100 px horizontally. Step by step for the first point: u = 800 · 0.5 / 2 + 320 = 200 + 320 = 520.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Swapping row/column: <code>img[y, x]</code> is correct, <code>img[x, y]</code> reads the wrong pixel (or crashes on non-square images).</li><li>Assuming RGB order — OpenCV loads images as <strong>BGR</strong>, so red and blue are swapped unless you convert.</li><li>Doing arithmetic on uint8 arrays: 200 + 100 wraps around to 44. Convert to float first.</li><li>Forgetting that one camera cannot measure depth: the same pixel fits every point on a ray.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>An image is an H × W × C array of numbers; 8-bit values range 0–255.</li><li>Grayscale Y = 0.299R + 0.587G + 0.114B.</li><li>Raw video is large: Full-HD at 30 fps ≈ 187 MB/s.</li><li>Pinhole model: u = f<sub>x</sub>X/Z + c<sub>x</sub>, v = f<sub>y</sub>Y/Z + c<sub>y</sub>; intrinsics come from calibration.</li><li>Size in the image is proportional to 1/Z — depth is lost in a single image.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Pinhole_camera_model" target="_blank" rel="noopener">Wikipedia — Pinhole camera model</a></li><li><a href="https://numpy.org/doc/stable/user/absolute_beginners.html" target="_blank" rel="noopener">NumPy — the absolute basics for beginners (arrays, shapes, indexing)</a></li><li><a href="https://ocw.mit.edu/courses/6-801-machine-vision-fall-2020/" target="_blank" rel="noopener">MIT OpenCourseWare 6.801 — Machine Vision (Berthold Horn)</a></li><li><a href="https://www.ibm.com/think/topics/computer-vision" target="_blank" rel="noopener">IBM — What is computer vision?</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many bytes is one 1920 × 1080 RGB 8-bit frame? How many MB per second at 30 fps?</li><li>Convert the pixel (R, G, B) = (200, 100, 50) to grayscale.</li><li>A camera has f<sub>y</sub> = 800 px. A person 1.7 m tall stands 10 m away. About how many pixels tall does the person appear?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1920 · 1080 · 3 = 6 220 800 bytes ≈ 6.2 MB; × 30 ≈ 186.6 MB/s. 2) 0.299·200 + 0.587·100 + 0.114·50 = 59.8 + 58.7 + 5.7 = 124.2 ≈ 124. 3) height ≈ f<sub>y</sub> · 1.7 / 10 = 800 · 0.17 = 136 px.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 9 · Bài 9.1</span>
<h2>Ảnh số và mô hình camera lỗ kim</h2>
<p class="lead">Camera là cảm biến giàu thông tin nhất mà robot mang được — và cũng rẻ nhất. Nhưng với máy tính, ảnh chỉ là một lưới số. Bài này cho thấy lưới đó được lưu thế nào và một điểm 3D ngoài đời trở thành một pixel ra sao.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả ảnh số là một mảng có dạng cao × rộng × số kênh.</li><li>Chuyển một pixel màu sang ảnh xám bằng trọng số chuẩn.</li><li>Tính dung lượng và băng thông của một luồng ảnh.</li><li>Chiếu một điểm 3D thành toạ độ pixel bằng mô hình camera lỗ kim.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Nhận thức</strong> (perception) là bước trong vòng cảm nhận – suy nghĩ – hành động biến dữ liệu cảm biến thô thành thông tin có ích: “có người cách 3 m phía trước”, “cửa đang mở”, “mình đang ở trong bếp”. Camera, lidar, sonar đều phục vụ nhận thức, nhưng camera chiếm ưu thế vì rẻ và mang cả màu sắc, kết cấu bề mặt lẫn chữ viết.</p>
<p><strong>Ảnh số</strong> là lưới 2D gồm các <strong>điểm ảnh</strong> (pixel). Ảnh xám lưu một giá trị độ sáng mỗi pixel; ảnh màu lưu ba giá trị — <strong>đỏ, lục, lam</strong> (RGB). Với kiểu 8 bit, mỗi giá trị là số nguyên 0–255 (0 = tối, 255 = sáng tối đa). Trong Python ảnh là mảng NumPy dạng <code>(H, W, 3)</code>: chỉ số thứ nhất là <strong>hàng</strong> (y, đếm từ trên xuống), chỉ số thứ hai là <strong>cột</strong> (x, đếm sang phải). Chú ý thứ tự: <code>img[hàng, cột]</code>, không phải <code>img[x, y]</code>.</p>
<div class="formula"><span class="lbl">Ảnh xám (luma ITU-R BT.601)</span>Y = 0,299·R + 0,587·G + 0,114·B</div>
<p>Kênh lục có trọng số lớn nhất vì mắt người nhạy với màu lục nhất. Nhiều thuật toán thị giác (cạnh, đặc trưng) chạy trên ảnh xám vì nó nhỏ hơn ba lần mà độ sáng đã mang phần lớn cấu trúc của cảnh.</p>
<p><strong>Độ phân giải và lưu lượng dữ liệu.</strong> Một khung Full-HD là 1920 × 1080 pixel × 3 byte = 6 220 800 byte ≈ 6,2 MB. Ở 30 khung/giây camera sinh ra khoảng 187 MB/s — vì vậy robot phải nén video, giảm kích thước, hoặc xử lý ngay trên GPU đặt cạnh camera.</p>
<p><strong>Mô hình camera lỗ kim.</strong> Ánh sáng từ một điểm 3D đi qua một điểm duy nhất (tâm quang học) rồi chạm mặt phẳng ảnh. Nếu điểm có toạ độ (X, Y, Z) trong hệ toạ độ camera (trục Z hướng thẳng ra trước theo trục quang học), tam giác đồng dạng cho vị trí pixel:</p>
<div class="formula"><span class="lbl">Phép chiếu lỗ kim</span>u = f<sub>x</sub> · X / Z + c<sub>x</sub>    v = f<sub>y</sub> · Y / Z + c<sub>y</sub></div>
<p>Trong đó f<sub>x</sub>, f<sub>y</sub> là tiêu cự <em>tính bằng pixel</em>, (c<sub>x</sub>, c<sub>y</sub>) là điểm chính, thường gần tâm ảnh. Bốn số này là <strong>tham số nội</strong> (intrinsics) của camera; chúng được tìm bằng <strong>hiệu chuẩn</strong> (chụp bàn cờ ca-rô từ nhiều góc). Phép chia cho Z là điểm mấu chốt: <strong>vật ở xa gấp đôi thì trông nhỏ đi một nửa</strong>, và một ảnh đơn làm mất chiều sâu — đó là lý do robot gắn thêm camera stereo, camera chiều sâu hoặc lidar.</p>
<h3>✍️ Ví dụ (chạy bằng Python)</h3>
<div class="callout"><p>Ta dựng một ảnh màu nhỏ 2 × 3, chuyển sang ảnh xám, rồi chiếu cùng một điểm ở hai độ sâu với f<sub>x</sub> = f<sub>y</sub> = 800 px và điểm chính (320, 240) cho camera 640 × 480.</p></div>
<pre><code class="language-python">import numpy as np

# A tiny 2x3 colour image: shape (rows, cols, channels), values 0..255
img = np.array([[[255, 0, 0], [0, 255, 0], [0, 0, 255]],
                [[255, 255, 255], [128, 128, 128], [0, 0, 0]]], dtype=np.uint8)
print("shape:", img.shape, "dtype:", img.dtype)
print("pixel (row 0, col 1) RGB =", img[0, 1])

# Grayscale with ITU-R BT.601 weights
w = np.array([0.299, 0.587, 0.114])
gray = np.round(img @ w).astype(np.uint8)
print("gray =")
print(gray)

# Pinhole camera: u = fx*X/Z + cx, v = fy*Y/Z + cy
fx = fy = 800.0          # focal length in pixels
cx, cy = 320.0, 240.0    # principal point (640x480 image)
for X, Y, Z in [(0.5, 0.2, 2.0), (0.5, 0.2, 4.0)]:
    u = fx * X / Z + cx
    v = fy * Y / Z + cy
    print(f"point ({X}, {Y}, {Z}) m -&gt; pixel (u, v) = ({u:.1f}, {v:.1f})")
</code></pre>
<div class="out">shape: (2, 3, 3) dtype: uint8
pixel (row 0, col 1) RGB = [  0 255   0]
gray =
[[ 76 150  29]
 [255 128   0]]
point (0.5, 0.2, 2.0) m -&gt; pixel (u, v) = (520.0, 320.0)
point (0.5, 0.2, 4.0) m -&gt; pixel (u, v) = (420.0, 280.0)</div>
<p>Đọc kết quả: lục thuần (0, 255, 0) thành mức xám 150 còn lam thuần chỉ 29 — với mắt ta màu lục sáng hơn. Dời điểm từ 2 m ra 4 m thì độ lệch khỏi tâm giảm một nửa: 200 px → 100 px theo chiều ngang. Từng bước với điểm thứ nhất: u = 800 · 0,5 / 2 + 320 = 200 + 320 = 520.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đảo hàng/cột: <code>img[y, x]</code> mới đúng, <code>img[x, y]</code> đọc nhầm pixel (hoặc lỗi với ảnh không vuông).</li><li>Mặc định thứ tự RGB — OpenCV đọc ảnh theo <strong>BGR</strong>, nên đỏ và lam bị đổi chỗ nếu không chuyển đổi.</li><li>Tính toán trên mảng uint8: 200 + 100 bị tràn thành 44. Hãy đổi sang float trước.</li><li>Quên rằng một camera không đo được độ sâu: cùng một pixel ứng với mọi điểm trên một tia sáng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ảnh là mảng số H × W × C; giá trị 8 bit nằm trong 0–255.</li><li>Ảnh xám Y = 0,299R + 0,587G + 0,114B.</li><li>Video thô rất nặng: Full-HD 30 khung/giây ≈ 187 MB/s.</li><li>Mô hình lỗ kim: u = f<sub>x</sub>X/Z + c<sub>x</sub>, v = f<sub>y</sub>Y/Z + c<sub>y</sub>; tham số nội có được nhờ hiệu chuẩn.</li><li>Kích thước trên ảnh tỉ lệ với 1/Z — một ảnh đơn mất thông tin chiều sâu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Pinhole_camera_model" target="_blank" rel="noopener">Wikipedia — Mô hình camera lỗ kim (tiếng Anh)</a></li><li><a href="https://numpy.org/doc/stable/user/absolute_beginners.html" target="_blank" rel="noopener">NumPy — kiến thức cơ bản cho người mới (mảng, shape, chỉ số)</a></li><li><a href="https://ocw.mit.edu/courses/6-801-machine-vision-fall-2020/" target="_blank" rel="noopener">MIT OpenCourseWare 6.801 — Thị giác máy (Berthold Horn)</a></li><li><a href="https://www.ibm.com/think/topics/computer-vision" target="_blank" rel="noopener">IBM — Thị giác máy tính là gì?</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một khung RGB 8 bit 1920 × 1080 nặng bao nhiêu byte? Ở 30 khung/giây là bao nhiêu MB mỗi giây?</li><li>Chuyển pixel (R, G, B) = (200, 100, 50) sang mức xám.</li><li>Camera có f<sub>y</sub> = 800 px. Một người cao 1,7 m đứng cách 10 m. Người đó cao khoảng bao nhiêu pixel trên ảnh?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1920 · 1080 · 3 = 6 220 800 byte ≈ 6,2 MB; × 30 ≈ 186,6 MB/s. 2) 0,299·200 + 0,587·100 + 0,114·50 = 59,8 + 58,7 + 5,7 = 124,2 ≈ 124. 3) chiều cao ≈ f<sub>y</sub> · 1,7 / 10 = 800 · 0,17 = 136 px.</p></div>`);

const r92 = L('rai101-ts-9-2',
  '9.2 — Image processing: thresholding, convolution and edge detection|||9.2 — Xử lý ảnh: phân ngưỡng, tích chập và phát hiện cạnh',
  'Phân ngưỡng, bộ lọc trung bình làm mờ, tích chập 2D với nhân Sobel để tìm cạnh, ngưỡng hoá độ lớn gradient — viết tích chập bằng numpy, chạy thật trên ảnh nhỏ.',
  `<span class="eyebrow">RAI101 · Chapter 9 · Lesson 9.2</span>
<h2>Image processing: thresholding, convolution and edge detection</h2>
<p class="lead">Before a robot can recognise anything, it usually cleans the image and extracts simple structure such as edges. Almost all of this classic image processing is built on one operation: sliding a small kernel over the image — <strong>convolution</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Segment an image by thresholding.</li><li>Explain 2D convolution with a 3 × 3 kernel and compute one output value by hand.</li><li>Use Sobel kernels to find edges and the gradient magnitude.</li><li>Compute the output size of a “valid” convolution.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Thresholding</strong> is the simplest segmentation: every pixel brighter than a threshold T becomes 1 (object), the rest 0 (background). A line-following robot does exactly this with a downward camera: dark tape → 1, floor → 0. It works when lighting is controlled; under changing light the right T changes, so practical systems use adaptive thresholds (e.g. Otsu's method picks T from the histogram).</p>
<p><strong>Convolution (filtering).</strong> A <strong>kernel</strong> is a small matrix of weights, e.g. 3 × 3. Place it on top of the image, multiply each kernel weight by the pixel under it, add the nine products: that sum is one output pixel. Slide one pixel and repeat. Different kernels do different jobs:</p>
<ul><li><strong>Mean (box) blur</strong> — all weights 1/9: averages neighbours, removes noise, softens detail.</li><li><strong>Sobel</strong> — weights −1, 0, +1 across: responds strongly where brightness changes, i.e. at <strong>edges</strong>.</li></ul>
<div class="formula"><span class="lbl">Sobel kernels</span>S<sub>x</sub> = [[−1, 0, 1], [−2, 0, 2], [−1, 0, 1]]    S<sub>y</sub> = S<sub>x</sub><sup>T</sup><br>gradient magnitude |G| = √(G<sub>x</sub><sup>2</sup> + G<sub>y</sub><sup>2</sup>)</div>
<p>G<sub>x</sub> is large at vertical edges (brightness changes left→right), G<sub>y</sub> at horizontal edges. Thresholding |G| gives a binary <strong>edge map</strong>. The Canny detector, used everywhere, adds smoothing, thinning and two thresholds on top of this idea.</p>
<div class="formula"><span class="lbl">Output size (no padding, stride 1)</span>an H × W image with a k × k kernel → (H − k + 1) × (W − k + 1)</div>
<p>Strictly speaking, libraries such as OpenCV's filter2D compute <em>correlation</em> (the kernel is not flipped); for symmetric kernels, and for this course, the difference does not matter.</p>
<h3>✍️ Worked example (run in Python)</h3>
<div class="callout"><p>A 5 × 6 image is dark (10) on the left and bright (200) on the right — one vertical edge. We write convolution ourselves, apply S<sub>x</sub> and S<sub>y</sub>, threshold the magnitude at 400, and also blur a noisy 3 × 3 patch.</p></div>
<pre><code class="language-python">import numpy as np

# 5x6 grayscale image: dark left half (10), bright right half (200)
img = np.array([[10, 10, 10, 200, 200, 200]] * 5, dtype=float)

def conv2d_valid(image, kernel):
    """Slide the kernel over the image (no padding, 'valid' mode).
    Like OpenCV filter2D, this is correlation: the kernel is not flipped."""
    kh, kw = kernel.shape
    H, W = image.shape
    out = np.zeros((H - kh + 1, W - kw + 1))
    for i in range(out.shape[0]):
        for j in range(out.shape[1]):
            out[i, j] = np.sum(image[i:i+kh, j:j+kw] * kernel)
    return out

sobel_x = np.array([[-1, 0, 1],
                    [-2, 0, 2],
                    [-1, 0, 1]], dtype=float)
sobel_y = sobel_x.T

gx = conv2d_valid(img, sobel_x)
gy = conv2d_valid(img, sobel_y)
mag = np.sqrt(gx**2 + gy**2)
print("Gx =")
print(gx)
print("Gy max abs =", np.abs(gy).max())
edges = (mag &gt; 400).astype(int)   # threshold
print("edge map (1 = edge) =")
print(edges)

# Box blur 3x3 (mean filter) on a single noisy row patch
patch = np.array([[10, 10, 10], [10, 100, 10], [10, 10, 10]], dtype=float)
print("3x3 mean of noisy patch =", conv2d_valid(patch, np.ones((3, 3)) / 9)[0, 0])
</code></pre>
<div class="out">Gx =
[[  0. 760. 760.   0.]
 [  0. 760. 760.   0.]
 [  0. 760. 760.   0.]]
Gy max abs = 0.0
edge map (1 = edge) =
[[0 1 1 0]
 [0 1 1 0]
 [0 1 1 0]]
3x3 mean of noisy patch = 19.999999999999996</div>
<p><strong>Check one value by hand.</strong> At output (0, 1) the window covers columns 1–3: rows are [10, 10, 200]. S<sub>x</sub> gives (−10 + 200) + 2(−10 + 200) + (−10 + 200) = 190 + 380 + 190 = 760. The 5 × 6 image gave a 3 × 4 output, as the size formula predicts. G<sub>y</sub> is 0 everywhere because nothing changes top-to-bottom. The noisy spike 100 is averaged down to (8·10 + 100)/9 = 20 — printed as 19.999999999999996 because 1/9 cannot be stored exactly in binary floating point.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Running edge detection on a noisy image without smoothing first: every noise speck becomes an “edge”.</li><li>Storing filter results in uint8: negative Sobel values are lost or wrap around. Use float or a signed type.</li><li>Forgetting that the output shrinks (or that padding is needed to keep the size).</li><li>A fixed global threshold that works in the lab and fails in sunlight.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Thresholding turns gray levels into a binary object/background mask.</li><li>Convolution = slide a kernel, multiply, sum; the kernel decides the effect.</li><li>Mean filter removes noise; Sobel measures brightness gradients.</li><li>Edge map = threshold on |G| = √(G<sub>x</sub><sup>2</sup> + G<sub>y</sub><sup>2</sup>).</li><li>Valid convolution: (H − k + 1) × (W − k + 1).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Kernel_(image_processing)" target="_blank" rel="noopener">Wikipedia — Kernel (image processing): blur, sharpen, edge kernels</a></li><li><a href="https://en.wikipedia.org/wiki/Sobel_operator" target="_blank" rel="noopener">Wikipedia — Sobel operator</a></li><li><a href="https://en.wikipedia.org/wiki/Edge_detection" target="_blank" rel="noopener">Wikipedia — Edge detection (incl. Canny)</a></li><li><a href="https://ocw.mit.edu/courses/6-801-machine-vision-fall-2020/" target="_blank" rel="noopener">MIT OCW 6.801 — Machine Vision</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Apply S<sub>x</sub> to the 3 × 3 patch [[0, 0, 9], [0, 0, 9], [0, 0, 9]]. What is the single output value?</li><li>A 100 × 100 image is filtered with a 5 × 5 kernel, no padding, stride 1. What is the output size?</li><li>Why do we usually blur an image before detecting edges?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 9 + 2·9 + 9 = 36. 2) (100 − 5 + 1) = 96, so 96 × 96. 3) Derivative-like kernels amplify noise; smoothing first removes small random variations so only real, large brightness changes survive as edges.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 9 · Bài 9.2</span>
<h2>Xử lý ảnh: phân ngưỡng, tích chập và phát hiện cạnh</h2>
<p class="lead">Trước khi nhận ra được thứ gì, robot thường làm sạch ảnh và rút ra cấu trúc đơn giản như các cạnh. Gần như toàn bộ xử lý ảnh cổ điển dựa trên một phép toán: trượt một nhân nhỏ trên ảnh — <strong>tích chập</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tách vùng ảnh bằng phân ngưỡng.</li><li>Giải thích tích chập 2D với nhân 3 × 3 và tự tính tay một giá trị đầu ra.</li><li>Dùng nhân Sobel tìm cạnh và độ lớn gradient.</li><li>Tính kích thước đầu ra của tích chập “valid”.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Phân ngưỡng</strong> là cách tách vùng đơn giản nhất: mọi pixel sáng hơn ngưỡng T thành 1 (vật), còn lại 0 (nền). Robot dò line dùng camera nhìn xuống làm đúng như vậy: băng keo tối → 1, sàn → 0. Cách này chạy tốt khi ánh sáng ổn định; khi ánh sáng đổi thì T phù hợp cũng đổi, nên hệ thống thực tế dùng ngưỡng thích nghi (vd phương pháp Otsu chọn T từ biểu đồ histogram).</p>
<p><strong>Tích chập (lọc ảnh).</strong> <strong>Nhân</strong> (kernel) là một ma trận trọng số nhỏ, vd 3 × 3. Đặt nhân lên ảnh, nhân từng trọng số với pixel nằm dưới nó, cộng chín tích lại: tổng đó là một pixel đầu ra. Trượt sang một pixel và lặp lại. Nhân khác nhau làm việc khác nhau:</p>
<ul><li><strong>Làm mờ trung bình (box blur)</strong> — mọi trọng số 1/9: lấy trung bình các điểm lân cận, khử nhiễu, làm mềm chi tiết.</li><li><strong>Sobel</strong> — trọng số −1, 0, +1 theo chiều ngang: phản ứng mạnh ở nơi độ sáng thay đổi, tức là ở <strong>cạnh</strong>.</li></ul>
<div class="formula"><span class="lbl">Nhân Sobel</span>S<sub>x</sub> = [[−1, 0, 1], [−2, 0, 2], [−1, 0, 1]]    S<sub>y</sub> = S<sub>x</sub><sup>T</sup><br>độ lớn gradient |G| = √(G<sub>x</sub><sup>2</sup> + G<sub>y</sub><sup>2</sup>)</div>
<p>G<sub>x</sub> lớn ở cạnh đứng (độ sáng đổi từ trái sang phải), G<sub>y</sub> lớn ở cạnh ngang. Phân ngưỡng |G| cho ta một <strong>bản đồ cạnh</strong> nhị phân. Bộ dò cạnh Canny, được dùng khắp nơi, thêm làm mịn, làm mảnh cạnh và hai ngưỡng dựa trên ý tưởng này.</p>
<div class="formula"><span class="lbl">Kích thước đầu ra (không đệm, bước 1)</span>ảnh H × W với nhân k × k → (H − k + 1) × (W − k + 1)</div>
<p>Nói chặt chẽ, các thư viện như filter2D của OpenCV tính <em>tương quan</em> (không lật nhân); với nhân đối xứng, và trong phạm vi môn này, khác biệt đó không quan trọng.</p>
<h3>✍️ Ví dụ (chạy bằng Python)</h3>
<div class="callout"><p>Ảnh 5 × 6 tối (10) bên trái và sáng (200) bên phải — đúng một cạnh đứng. Ta tự viết hàm tích chập, áp S<sub>x</sub> và S<sub>y</sub>, phân ngưỡng độ lớn ở 400, và làm mờ một mảnh 3 × 3 bị nhiễu.</p></div>
<pre><code class="language-python">import numpy as np

# 5x6 grayscale image: dark left half (10), bright right half (200)
img = np.array([[10, 10, 10, 200, 200, 200]] * 5, dtype=float)

def conv2d_valid(image, kernel):
    """Slide the kernel over the image (no padding, 'valid' mode).
    Like OpenCV filter2D, this is correlation: the kernel is not flipped."""
    kh, kw = kernel.shape
    H, W = image.shape
    out = np.zeros((H - kh + 1, W - kw + 1))
    for i in range(out.shape[0]):
        for j in range(out.shape[1]):
            out[i, j] = np.sum(image[i:i+kh, j:j+kw] * kernel)
    return out

sobel_x = np.array([[-1, 0, 1],
                    [-2, 0, 2],
                    [-1, 0, 1]], dtype=float)
sobel_y = sobel_x.T

gx = conv2d_valid(img, sobel_x)
gy = conv2d_valid(img, sobel_y)
mag = np.sqrt(gx**2 + gy**2)
print("Gx =")
print(gx)
print("Gy max abs =", np.abs(gy).max())
edges = (mag &gt; 400).astype(int)   # threshold
print("edge map (1 = edge) =")
print(edges)

# Box blur 3x3 (mean filter) on a single noisy row patch
patch = np.array([[10, 10, 10], [10, 100, 10], [10, 10, 10]], dtype=float)
print("3x3 mean of noisy patch =", conv2d_valid(patch, np.ones((3, 3)) / 9)[0, 0])
</code></pre>
<div class="out">Gx =
[[  0. 760. 760.   0.]
 [  0. 760. 760.   0.]
 [  0. 760. 760.   0.]]
Gy max abs = 0.0
edge map (1 = edge) =
[[0 1 1 0]
 [0 1 1 0]
 [0 1 1 0]]
3x3 mean of noisy patch = 19.999999999999996</div>
<p><strong>Tự kiểm một giá trị bằng tay.</strong> Ở đầu ra (0, 1), cửa sổ phủ cột 1–3: mỗi hàng là [10, 10, 200]. S<sub>x</sub> cho (−10 + 200) + 2(−10 + 200) + (−10 + 200) = 190 + 380 + 190 = 760. Ảnh 5 × 6 cho đầu ra 3 × 4, đúng như công thức kích thước. G<sub>y</sub> bằng 0 khắp nơi vì không có gì thay đổi theo chiều trên–dưới. Điểm nhiễu 100 bị kéo về (8·10 + 100)/9 = 20 — in ra 19.999999999999996 vì 1/9 không lưu chính xác được trong số thực nhị phân.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dò cạnh trên ảnh nhiễu mà không làm mịn trước: mỗi hạt nhiễu thành một “cạnh”.</li><li>Lưu kết quả lọc bằng uint8: giá trị Sobel âm bị mất hoặc tràn. Dùng float hoặc kiểu có dấu.</li><li>Quên rằng đầu ra bị co lại (hoặc cần đệm viền để giữ nguyên kích thước).</li><li>Dùng một ngưỡng cố định chạy tốt trong phòng thí nghiệm nhưng hỏng ngoài nắng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Phân ngưỡng biến mức xám thành mặt nạ nhị phân vật/nền.</li><li>Tích chập = trượt nhân, nhân từng phần tử, cộng lại; nhân quyết định hiệu ứng.</li><li>Lọc trung bình khử nhiễu; Sobel đo gradient độ sáng.</li><li>Bản đồ cạnh = phân ngưỡng |G| = √(G<sub>x</sub><sup>2</sup> + G<sub>y</sub><sup>2</sup>).</li><li>Tích chập valid: (H − k + 1) × (W − k + 1).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Kernel_(image_processing)" target="_blank" rel="noopener">Wikipedia — Nhân xử lý ảnh: làm mờ, làm nét, dò cạnh</a></li><li><a href="https://en.wikipedia.org/wiki/Sobel_operator" target="_blank" rel="noopener">Wikipedia — Toán tử Sobel</a></li><li><a href="https://en.wikipedia.org/wiki/Edge_detection" target="_blank" rel="noopener">Wikipedia — Phát hiện cạnh (có Canny)</a></li><li><a href="https://ocw.mit.edu/courses/6-801-machine-vision-fall-2020/" target="_blank" rel="noopener">MIT OCW 6.801 — Thị giác máy</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Áp S<sub>x</sub> lên mảnh 3 × 3 [[0, 0, 9], [0, 0, 9], [0, 0, 9]]. Giá trị đầu ra duy nhất là bao nhiêu?</li><li>Ảnh 100 × 100 lọc bằng nhân 5 × 5, không đệm, bước 1. Đầu ra kích thước bao nhiêu?</li><li>Vì sao thường làm mờ ảnh trước khi dò cạnh?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 9 + 2·9 + 9 = 36. 2) (100 − 5 + 1) = 96, tức 96 × 96. 3) Nhân kiểu đạo hàm khuếch đại nhiễu; làm mịn trước giúp xoá dao động ngẫu nhiên nhỏ, chỉ những thay đổi độ sáng lớn và thật mới còn lại thành cạnh.</p></div>`);

const r93 = L('rai101-ts-9-3',
  '9.3 — Deep learning for vision: CNNs, detection and segmentation|||9.3 — Học sâu cho thị giác: CNN, phát hiện và phân vùng đối tượng',
  'Vì sao CNN thay bộ lọc thiết kế tay, lớp tích chập/pooling, đếm tham số, ba bài toán phân loại – phát hiện – phân vùng, chỉ số IoU; code Python tính kích thước, số tham số và IoU.',
  `<span class="eyebrow">RAI101 · Chapter 9 · Lesson 9.3</span>
<h2>Deep learning for vision: CNNs, detection and segmentation</h2>
<p class="lead">In Lesson 9.2 a human designed the Sobel kernel. A <strong>convolutional neural network (CNN)</strong> learns hundreds of kernels from labelled examples instead — and that single change is why robots today can recognise people, cups and traffic signs.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain how a CNN stacks learned convolution filters into features.</li><li>Compute a convolution layer's output size and parameter count.</li><li>Distinguish classification, object detection and segmentation.</li><li>Compute Intersection over Union (IoU) for a detected box.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>From hand-made to learned features.</strong> Classic vision chained hand-designed filters (edges, corners) with hand-written rules. This breaks easily: a chair has hundreds of shapes. A CNN keeps the convolution idea but lets training choose the kernel weights. Early layers learn edge- and colour-detectors (much like Sobel); deeper layers combine them into textures, parts (wheels, eyes) and finally whole objects.</p>
<p><strong>Building blocks.</strong></p>
<ul><li><strong>Convolution layer</strong>: C<sub>out</sub> filters, each of size k × k × C<sub>in</sub>, plus one bias per filter. Because the same small filter slides over the whole image (<em>weight sharing</em>), it needs far fewer parameters than a fully connected layer.</li><li><strong>Activation</strong> (usually ReLU, max(0, x)) adds non-linearity.</li><li><strong>Pooling / stride</strong> shrinks the feature map (e.g. 224 → 112) so deeper layers see a larger area.</li><li><strong>Fully connected head</strong> turns the final features into class scores.</li></ul>
<div class="formula"><span class="lbl">Conv layer arithmetic</span>output size = ⌊(n + 2p − k) / s⌋ + 1    (n input, k kernel, p padding, s stride)<br>parameters = (k · k · C<sub>in</sub> + 1) · C<sub>out</sub></div>
<p><strong>Three vision tasks</strong> a robot needs:</p>
<ul><li><strong>Classification</strong> — one label per image: “this is a cup”.</li><li><strong>Object detection</strong> — a <em>bounding box</em> + label + confidence for each object: “cup at (120, 80)–(180, 160), 0.93”. Families such as YOLO, SSD and Faster R-CNN run in real time on a robot's GPU.</li><li><strong>Segmentation</strong> — a label for <em>every pixel</em>: road vs. sidewalk vs. person. Needed when shape matters, e.g. where exactly to grasp or where the floor is free.</li></ul>
<p>Detections are scored with <strong>IoU</strong> (Intersection over Union): overlap area ÷ combined area of predicted and true box. A common convention counts a detection as correct when IoU ≥ 0.5.</p>
<p><strong>Data and limits.</strong> CNNs need large labelled datasets (ImageNet has over a million labelled images) and usually start from a pretrained network that is <em>fine-tuned</em> on your robot's images. They can fail silently on conditions never seen in training — night, rain, unusual objects — so safety-critical robots combine them with other sensors and checks.</p>
<h3>✍️ Worked example (run in Python)</h3>
<div class="callout"><p>We compute layer sizes for a 224 × 224 RGB input, compare the parameters of a 3 × 3 conv layer with a dense layer, and score one detection with IoU.</p></div>
<pre><code class="language-python">def conv_out(n, k, p=0, s=1):
    """Output size of a convolution: floor((n + 2p - k) / s) + 1"""
    return (n + 2 * p - k) // s + 1

def conv_params(k, c_in, c_out):
    """Weights k*k*c_in per filter, plus one bias per filter."""
    return (k * k * c_in + 1) * c_out

print("224x224 input, 3x3 kernel, pad 1, stride 1 -&gt;", conv_out(224, 3, 1, 1))
print("224x224 input, 3x3 kernel, pad 1, stride 2 -&gt;", conv_out(224, 3, 1, 2))
print("params of conv 3x3, 3 -&gt; 64 channels:", conv_params(3, 3, 64))
print("params of a dense layer 224*224*3 -&gt; 64:", (224 * 224 * 3 + 1) * 64)

def iou(a, b):
    """Boxes as (x1, y1, x2, y2). Intersection over Union."""
    ix1, iy1 = max(a[0], b[0]), max(a[1], b[1])
    ix2, iy2 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0, ix2 - ix1) * max(0, iy2 - iy1)
    area_a = (a[2] - a[0]) * (a[3] - a[1])
    area_b = (b[2] - b[0]) * (b[3] - b[1])
    return inter / (area_a + area_b - inter)

truth = (50, 50, 150, 150)       # ground-truth box of a person
pred = (70, 60, 170, 160)        # detector's box
print("IoU =", round(iou(truth, pred), 3))
print("correct at threshold 0.5?", iou(truth, pred) &gt;= 0.5)
</code></pre>
<div class="out">224x224 input, 3x3 kernel, pad 1, stride 1 -&gt; 224
224x224 input, 3x3 kernel, pad 1, stride 2 -&gt; 112
params of conv 3x3, 3 -&gt; 64 channels: 1792
params of a dense layer 224*224*3 -&gt; 64: 9633856
IoU = 0.562
correct at threshold 0.5? True</div>
<p>Step by step: the conv layer has (3·3·3 + 1)·64 = 28·64 = 1 792 parameters; a dense layer producing just 64 numbers from the same image needs over 9.6 million — that is weight sharing at work. For IoU: intersection = (150 − 70)·(150 − 60) = 80·90 = 7 200; each box has area 10 000; union = 20 000 − 7 200 = 12 800; IoU = 7 200 / 12 800 = 0.5625.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Treating a confidence of 0.95 as “95 % sure in the real world” — networks are often over-confident outside their training data.</li><li>Testing on images that also appear in the training set and reporting inflated accuracy.</li><li>Forgetting the bias term (or C<sub>in</sub>) when counting parameters.</li><li>Using detection when the task needs exact shape (segmentation), or segmentation when a box is enough (wasted compute).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A CNN learns its convolution kernels from labelled data; layers go edges → parts → objects.</li><li>Output size ⌊(n + 2p − k)/s⌋ + 1; parameters (k·k·C<sub>in</sub> + 1)·C<sub>out</sub>.</li><li>Weight sharing makes convolution far cheaper than dense layers on images.</li><li>Classification = one label; detection = boxes; segmentation = per-pixel labels.</li><li>IoU = intersection / union; ≥ 0.5 is a common “correct detection” threshold.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://cs231n.github.io/convolutional-networks/" target="_blank" rel="noopener">Stanford CS231n — Convolutional Neural Networks (notes)</a></li><li><a href="https://d2l.ai/chapter_convolutional-neural-networks/index.html" target="_blank" rel="noopener">Dive into Deep Learning — Chapter 7: Convolutional Neural Networks</a></li><li><a href="https://www.youtube.com/watch?v=aircAruvnKk" target="_blank" rel="noopener">3Blue1Brown — But what is a neural network?</a></li><li><a href="https://en.wikipedia.org/wiki/Jaccard_index" target="_blank" rel="noopener">Wikipedia — Jaccard index (Intersection over Union)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A 32 × 32 input passes a 5 × 5 convolution with no padding and stride 1. What is the output size?</li><li>How many parameters does a 5 × 5 conv layer from 3 channels to 16 channels have?</li><li>Boxes A = (0, 0, 10, 10) and B = (5, 0, 15, 10). Compute their IoU. Would the detection count as correct at 0.5?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (32 − 5)/1 + 1 = 28 → 28 × 28. 2) (5·5·3 + 1)·16 = 76·16 = 1 216. 3) Intersection 5·10 = 50, union 100 + 100 − 50 = 150, IoU = 1/3 ≈ 0.333 &lt; 0.5 → not correct.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 9 · Bài 9.3</span>
<h2>Học sâu cho thị giác: CNN, phát hiện và phân vùng đối tượng</h2>
<p class="lead">Ở Bài 9.2 con người tự thiết kế nhân Sobel. <strong>Mạng nơ-ron tích chập (CNN)</strong> thì tự học hàng trăm nhân từ các ví dụ có nhãn — và chính thay đổi đó giúp robot ngày nay nhận ra người, cái cốc hay biển báo giao thông.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích cách CNN xếp chồng các bộ lọc tích chập học được thành đặc trưng.</li><li>Tính kích thước đầu ra và số tham số của một lớp tích chập.</li><li>Phân biệt phân loại, phát hiện đối tượng và phân vùng.</li><li>Tính chỉ số IoU (Intersection over Union) cho một khung phát hiện.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Từ đặc trưng làm tay sang đặc trưng học được.</strong> Thị giác cổ điển nối các bộ lọc thiết kế tay (cạnh, góc) với các luật viết tay. Cách này dễ vỡ: cái ghế có hàng trăm hình dạng. CNN giữ ý tưởng tích chập nhưng để quá trình huấn luyện tự chọn trọng số của nhân. Các lớp đầu học bộ dò cạnh, dò màu (rất giống Sobel); các lớp sâu hơn ghép chúng thành kết cấu, bộ phận (bánh xe, mắt) và cuối cùng là cả đối tượng.</p>
<p><strong>Các khối xây dựng.</strong></p>
<ul><li><strong>Lớp tích chập</strong>: C<sub>out</sub> bộ lọc, mỗi bộ kích thước k × k × C<sub>in</sub>, cộng một bias cho mỗi bộ lọc. Vì cùng một bộ lọc nhỏ trượt khắp ảnh (<em>chia sẻ trọng số</em>), nó cần ít tham số hơn rất nhiều so với lớp kết nối đầy đủ.</li><li><strong>Hàm kích hoạt</strong> (thường là ReLU, max(0, x)) thêm tính phi tuyến.</li><li><strong>Pooling / bước nhảy (stride)</strong> thu nhỏ bản đồ đặc trưng (vd 224 → 112) để lớp sâu hơn nhìn được vùng rộng hơn.</li><li><strong>Phần đầu kết nối đầy đủ</strong> biến đặc trưng cuối thành điểm số cho từng lớp.</li></ul>
<div class="formula"><span class="lbl">Số học của lớp tích chập</span>kích thước ra = ⌊(n + 2p − k) / s⌋ + 1    (n đầu vào, k nhân, p đệm, s bước)<br>số tham số = (k · k · C<sub>in</sub> + 1) · C<sub>out</sub></div>
<p><strong>Ba bài toán thị giác</strong> robot cần:</p>
<ul><li><strong>Phân loại</strong> — một nhãn cho cả ảnh: “đây là cái cốc”.</li><li><strong>Phát hiện đối tượng</strong> — mỗi vật một <em>khung bao</em> + nhãn + độ tin cậy: “cốc ở (120, 80)–(180, 160), 0,93”. Các họ mô hình YOLO, SSD, Faster R-CNN chạy thời gian thực trên GPU của robot.</li><li><strong>Phân vùng</strong> — gán nhãn cho <em>từng pixel</em>: lòng đường, vỉa hè, người. Cần khi hình dạng quan trọng, vd nắm vật chính xác ở đâu, hay sàn trống tới đâu.</li></ul>
<p>Kết quả phát hiện được chấm bằng <strong>IoU</strong>: diện tích phần giao ÷ diện tích phần hợp của khung dự đoán và khung thật. Quy ước phổ biến coi phát hiện là đúng khi IoU ≥ 0,5.</p>
<p><strong>Dữ liệu và giới hạn.</strong> CNN cần bộ dữ liệu có nhãn rất lớn (ImageNet có hơn một triệu ảnh gán nhãn) và thường bắt đầu từ một mạng đã huấn luyện sẵn rồi <em>tinh chỉnh</em> (fine-tune) trên ảnh của robot mình. Chúng có thể hỏng âm thầm ở điều kiện chưa từng gặp khi huấn luyện — ban đêm, trời mưa, vật lạ — nên robot liên quan an toàn luôn kết hợp với cảm biến và phép kiểm khác.</p>
<h3>✍️ Ví dụ (chạy bằng Python)</h3>
<div class="callout"><p>Ta tính kích thước lớp cho đầu vào RGB 224 × 224, so số tham số của lớp tích chập 3 × 3 với lớp kết nối đầy đủ, và chấm một kết quả phát hiện bằng IoU.</p></div>
<pre><code class="language-python">def conv_out(n, k, p=0, s=1):
    """Output size of a convolution: floor((n + 2p - k) / s) + 1"""
    return (n + 2 * p - k) // s + 1

def conv_params(k, c_in, c_out):
    """Weights k*k*c_in per filter, plus one bias per filter."""
    return (k * k * c_in + 1) * c_out

print("224x224 input, 3x3 kernel, pad 1, stride 1 -&gt;", conv_out(224, 3, 1, 1))
print("224x224 input, 3x3 kernel, pad 1, stride 2 -&gt;", conv_out(224, 3, 1, 2))
print("params of conv 3x3, 3 -&gt; 64 channels:", conv_params(3, 3, 64))
print("params of a dense layer 224*224*3 -&gt; 64:", (224 * 224 * 3 + 1) * 64)

def iou(a, b):
    """Boxes as (x1, y1, x2, y2). Intersection over Union."""
    ix1, iy1 = max(a[0], b[0]), max(a[1], b[1])
    ix2, iy2 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0, ix2 - ix1) * max(0, iy2 - iy1)
    area_a = (a[2] - a[0]) * (a[3] - a[1])
    area_b = (b[2] - b[0]) * (b[3] - b[1])
    return inter / (area_a + area_b - inter)

truth = (50, 50, 150, 150)       # ground-truth box of a person
pred = (70, 60, 170, 160)        # detector's box
print("IoU =", round(iou(truth, pred), 3))
print("correct at threshold 0.5?", iou(truth, pred) &gt;= 0.5)
</code></pre>
<div class="out">224x224 input, 3x3 kernel, pad 1, stride 1 -&gt; 224
224x224 input, 3x3 kernel, pad 1, stride 2 -&gt; 112
params of conv 3x3, 3 -&gt; 64 channels: 1792
params of a dense layer 224*224*3 -&gt; 64: 9633856
IoU = 0.562
correct at threshold 0.5? True</div>
<p>Từng bước: lớp tích chập có (3·3·3 + 1)·64 = 28·64 = 1 792 tham số; một lớp kết nối đầy đủ chỉ sinh 64 số từ cùng ảnh đó đã cần hơn 9,6 triệu — đó là sức mạnh của chia sẻ trọng số. Với IoU: phần giao = (150 − 70)·(150 − 60) = 80·90 = 7 200; mỗi khung có diện tích 10 000; phần hợp = 20 000 − 7 200 = 12 800; IoU = 7 200 / 12 800 = 0,5625.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Coi độ tin cậy 0,95 là “chắc 95 % ngoài đời thật” — mạng thường tự tin thái quá với dữ liệu khác dữ liệu huấn luyện.</li><li>Kiểm thử trên ảnh cũng nằm trong tập huấn luyện rồi báo độ chính xác bị thổi phồng.</li><li>Quên bias (hoặc quên C<sub>in</sub>) khi đếm tham số.</li><li>Dùng phát hiện khi bài toán cần hình dạng chính xác (phân vùng), hoặc dùng phân vùng khi chỉ cần khung (tốn tính toán).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>CNN học nhân tích chập từ dữ liệu có nhãn; các lớp đi từ cạnh → bộ phận → đối tượng.</li><li>Kích thước ra ⌊(n + 2p − k)/s⌋ + 1; tham số (k·k·C<sub>in</sub> + 1)·C<sub>out</sub>.</li><li>Chia sẻ trọng số khiến tích chập rẻ hơn hẳn lớp kết nối đầy đủ trên ảnh.</li><li>Phân loại = một nhãn; phát hiện = khung bao; phân vùng = nhãn từng pixel.</li><li>IoU = giao / hợp; ≥ 0,5 là ngưỡng “phát hiện đúng” phổ biến.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://cs231n.github.io/convolutional-networks/" target="_blank" rel="noopener">Stanford CS231n — Ghi chú về mạng nơ-ron tích chập</a></li><li><a href="https://d2l.ai/chapter_convolutional-neural-networks/index.html" target="_blank" rel="noopener">Dive into Deep Learning — Chương 7: Mạng nơ-ron tích chập</a></li><li><a href="https://www.youtube.com/watch?v=aircAruvnKk" target="_blank" rel="noopener">3Blue1Brown — Mạng nơ-ron thực ra là gì? (có phụ đề)</a></li><li><a href="https://en.wikipedia.org/wiki/Jaccard_index" target="_blank" rel="noopener">Wikipedia — Chỉ số Jaccard (Intersection over Union)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đầu vào 32 × 32 qua tích chập 5 × 5, không đệm, bước 1. Đầu ra kích thước bao nhiêu?</li><li>Lớp tích chập 5 × 5 từ 3 kênh sang 16 kênh có bao nhiêu tham số?</li><li>Khung A = (0, 0, 10, 10) và B = (5, 0, 15, 10). Tính IoU. Ở ngưỡng 0,5 phát hiện này có được tính là đúng không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (32 − 5)/1 + 1 = 28 → 28 × 28. 2) (5·5·3 + 1)·16 = 76·16 = 1 216. 3) Giao 5·10 = 50, hợp 100 + 100 − 50 = 150, IoU = 1/3 ≈ 0,333 &lt; 0,5 → không đúng.</p></div>`);

const r94 = L('rai101-ts-9-4',
  '9.4 — Localization under uncertainty: Bayes filter, sensor fusion, SLAM|||9.4 — Định vị trong bất định: bộ lọc Bayes, hợp nhất cảm biến, SLAM',
  'Vì sao robot phải biểu diễn vị trí bằng xác suất, chu trình dự đoán – cập nhật của bộ lọc Bayes, bộ lọc histogram 1D chạy thật bằng numpy, hợp nhất hai phép đo, ý tưởng Kalman/hạt và SLAM.',
  `<span class="eyebrow">RAI101 · Chapter 9 · Lesson 9.4</span>
<h2>Localization under uncertainty: Bayes filter, sensor fusion, SLAM</h2>
<p class="lead">“Where am I?” is the most basic question of a mobile robot. Wheels slip and sensors are noisy, so the honest answer is never a single point but a <strong>probability distribution</strong> — a belief. This idea is the heart of probabilistic robotics.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain why localization must handle uncertainty.</li><li>Describe the two steps of the Bayes filter: motion (predict) and measurement (update).</li><li>Run and interpret a 1D histogram localization filter.</li><li>Fuse two noisy measurements and outline Kalman filters, particle filters and SLAM.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Why uncertainty?</strong> Odometry (Chapter 4) integrates wheel motion, but every small error accumulates — after a few metres the estimate drifts. Sensors such as lidar or a camera can recognise landmarks, but measurements are noisy and landmarks repeat (many doors look alike). So the robot keeps a <strong>belief</strong> bel(x): for every possible position x, how probable it is that the robot is there.</p>
<p><strong>The Bayes filter</strong> repeats two steps forever:</p>
<ul><li><strong>Predict (motion update)</strong>: when the robot moves, shift the belief by the commanded motion and <em>spread</em> it, because motion is uncertain. Uncertainty grows.</li><li><strong>Update (measurement update)</strong>: when a sensor reading z arrives, multiply the belief by the likelihood p(z | x) — how well each position explains the reading — then <strong>normalise</strong> so it sums to 1. Uncertainty shrinks.</li></ul>
<div class="formula"><span class="lbl">Bayes rule for localization</span>bel(x) ← η · p(z | x) · bel(x)    η = 1 / Σ p(z | x)·bel(x)  (normaliser)</div>
<p>When the world is divided into cells we get the <strong>histogram filter</strong> (below). When the belief is a Gaussian (mean + variance) and the models are linear we get the <strong>Kalman filter</strong>, the workhorse of GPS/IMU fusion. When the belief is represented by many random samples we get the <strong>particle filter</strong>, known in robotics as <strong>Monte Carlo localization</strong> — used by the ROS 2 navigation stack (AMCL).</p>
<p><strong>Sensor fusion in one line.</strong> Two independent measurements of the same distance with variances σ<sub>1</sub><sup>2</sup> and σ<sub>2</sub><sup>2</sup> are combined by weighting each with the inverse of its variance:</p>
<div class="formula"><span class="lbl">Fusing two Gaussian measurements</span>x = (x<sub>1</sub>/σ<sub>1</sub><sup>2</sup> + x<sub>2</sub>/σ<sub>2</sub><sup>2</sup>) / (1/σ<sub>1</sub><sup>2</sup> + 1/σ<sub>2</sub><sup>2</sup>)    σ<sup>2</sup> = 1 / (1/σ<sub>1</sub><sup>2</sup> + 1/σ<sub>2</sub><sup>2</sup>)</div>
<p>Example: sonar says 10.0 m (variance 4), lidar says 12.0 m (variance 1). Fused: (2.5 + 12)/(0.25 + 1) = 11.6 m with variance 0.8 — closer to the more reliable sensor and more certain than either.</p>
<p><strong>SLAM</strong> (Simultaneous Localization And Mapping) solves the harder case where the map is unknown too: the robot builds the map and localizes itself in it at the same time. Robot vacuums, warehouse robots and AR headsets all run some form of SLAM.</p>
<h3>✍️ Worked example (run in Python)</h3>
<div class="callout"><p>A robot lives in a circular corridor of 10 cells; doors (D) are at cells 0, 3, 7, walls (W) elsewhere. Its door sensor is right 90 % of the time; each move lands exactly 80 % of the time, one cell short or long 10 % each. It starts with no idea where it is.</p></div>
<pre><code class="language-python">import numpy as np

# A circular corridor of 10 cells; 'D' = door, 'W' = wall
world = ['D', 'W', 'W', 'D', 'W', 'W', 'W', 'D', 'W', 'W']
belief = np.ones(10) / 10           # start: no idea where we are

P_HIT, P_MISS = 0.9, 0.1            # sensor says the right thing 90% of the time

def sense(belief, z):
    """Measurement update (Bayes rule): multiply by likelihood, normalise."""
    like = np.array([P_HIT if cell == z else P_MISS for cell in world])
    post = belief * like
    return post / post.sum()

def move(belief, step):
    """Motion update: shift by 'step' cells; 80% exact, 10% under, 10% over."""
    return (0.8 * np.roll(belief, step)
            + 0.1 * np.roll(belief, step - 1)
            + 0.1 * np.roll(belief, step + 1))

np.set_printoptions(precision=3, suppress=True)
belief = sense(belief, 'D');  print("after sensing D:   ", belief)
belief = move(belief, 1);     print("after moving +1:   ", belief)
belief = sense(belief, 'W');  print("after sensing W:   ", belief)
belief = move(belief, 2);     print("after moving +2:   ", belief)
belief = sense(belief, 'D');  print("after sensing D:   ", belief)
belief = move(belief, 4);     print("after moving +4:   ", belief)
belief = sense(belief, 'D');  print("after sensing D:   ", belief)
print("most likely cell:", int(np.argmax(belief)), "p =", round(float(belief.max()), 3))
</code></pre>
<div class="out">after sensing D:    [0.265 0.029 0.029 0.265 0.029 0.029 0.029 0.265 0.029 0.029]
after moving +1:    [0.053 0.218 0.053 0.053 0.218 0.053 0.029 0.053 0.218 0.053]
after sensing W:    [0.007 0.253 0.062 0.007 0.253 0.062 0.034 0.007 0.253 0.062]
after moving +2:    [0.21  0.075 0.037 0.21  0.075 0.037 0.21  0.078 0.034 0.034]
after sensing D:    [0.379 0.015 0.007 0.379 0.015 0.007 0.042 0.141 0.007 0.007]
after moving +4:    [0.049 0.118 0.02  0.044 0.305 0.051 0.045 0.305 0.051 0.012]
after sensing D:    [0.104 0.028 0.005 0.095 0.073 0.012 0.011 0.657 0.012 0.003]
most likely cell: 7 p = 0.657</div>
<p><strong>Read it step by step.</strong> The first “D” makes the three door cells equally likely (0.265 each). After the move and “W”, then “+2” and “D”, two hypotheses tie at 0.379: cell 0 and cell 3 — the corridor is ambiguous. One more move (+4) and another “D” settle it: from cell 3 the robot reaches cell 7 (a door), from cell 0 it would reach cell 4 (a wall). The belief collapses to cell 7 with p = 0.657. Notice how each <em>move</em> flattens the belief and each <em>sense</em> sharpens it.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting to normalise after the measurement update — probabilities no longer sum to 1.</li><li>Trusting odometry alone for long distances; drift grows without bound.</li><li>Setting P_MISS = 0 (a “perfect” sensor): one wrong reading then makes the true position impossible forever.</li><li>Reporting only argmax and ignoring that two cells may be almost equally likely.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Localization keeps a belief: a probability for every possible pose.</li><li>Bayes filter = predict with motion (spread) + update with measurements (multiply, normalise).</li><li>Histogram, Kalman and particle filters are three ways to represent the belief.</li><li>Fusing measurements weights each by 1/variance; the result is more certain than either.</li><li>SLAM builds the map and localizes in it at the same time.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Recursive_Bayesian_estimation" target="_blank" rel="noopener">Wikipedia — Recursive Bayesian estimation (Bayes filter)</a></li><li><a href="https://en.wikipedia.org/wiki/Monte_Carlo_localization" target="_blank" rel="noopener">Wikipedia — Monte Carlo localization (particle filter)</a></li><li><a href="https://en.wikipedia.org/wiki/Kalman_filter" target="_blank" rel="noopener">Wikipedia — Kalman filter</a></li><li><a href="https://en.wikipedia.org/wiki/Simultaneous_localization_and_mapping" target="_blank" rel="noopener">Wikipedia — Simultaneous localization and mapping (SLAM)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A corridor has 5 cells, 2 of them doors; the prior is uniform. The sensor (P_HIT 0.9, P_MISS 0.1) reads “door”. What is the posterior probability of each door cell and each wall cell?</li><li>Fuse a sonar reading 10.0 m (variance 4) with a lidar reading 12.0 m (variance 1).</li><li>In the example above, why did the belief stay split between cells 0 and 3 before the last move?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Unnormalised: door 0.9·0.2 = 0.18 (×2), wall 0.1·0.2 = 0.02 (×3); total 0.42. Door cell 0.18/0.42 ≈ 0.429, wall cell 0.02/0.42 ≈ 0.048. 2) x = (10/4 + 12/1)/(1/4 + 1) = 14.5/1.25 = 11.6 m, variance 1/1.25 = 0.8. 3) Both starting hypotheses (cell 7 → 8 → 0 and cell 0 → 1 → 3) produced exactly the readings D, W, D; only a new measurement that differs between them can break the tie.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 9 · Bài 9.4</span>
<h2>Định vị trong bất định: bộ lọc Bayes, hợp nhất cảm biến, SLAM</h2>
<p class="lead">“Mình đang ở đâu?” là câu hỏi cơ bản nhất của robot di động. Bánh xe bị trượt, cảm biến bị nhiễu, nên câu trả lời trung thực không bao giờ là một điểm duy nhất mà là một <strong>phân bố xác suất</strong> — gọi là niềm tin (belief). Ý tưởng này là trái tim của robot học xác suất.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích vì sao bài toán định vị phải xử lý bất định.</li><li>Mô tả hai bước của bộ lọc Bayes: chuyển động (dự đoán) và đo (cập nhật).</li><li>Chạy và đọc hiểu bộ lọc histogram định vị 1D.</li><li>Hợp nhất hai phép đo nhiễu và nắm ý tưởng bộ lọc Kalman, bộ lọc hạt và SLAM.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Vì sao có bất định?</strong> Odometry (Chương 4) cộng dồn chuyển động bánh xe, nhưng mỗi sai số nhỏ đều tích luỹ — sau vài mét ước lượng đã trôi. Cảm biến như lidar hay camera nhận ra được mốc, nhưng phép đo có nhiễu và mốc thì lặp lại (nhiều cánh cửa trông giống nhau). Vì vậy robot giữ một <strong>niềm tin</strong> bel(x): với mỗi vị trí có thể x, xác suất robot đang ở đó là bao nhiêu.</p>
<p><strong>Bộ lọc Bayes</strong> lặp mãi hai bước:</p>
<ul><li><strong>Dự đoán (cập nhật chuyển động)</strong>: khi robot di chuyển, dịch niềm tin theo lệnh chuyển động và <em>làm loang</em> nó ra, vì chuyển động không chắc chắn. Độ bất định tăng.</li><li><strong>Cập nhật (cập nhật đo)</strong>: khi có số đo z, nhân niềm tin với độ hợp lý p(z | x) — mỗi vị trí giải thích số đo tốt đến đâu — rồi <strong>chuẩn hoá</strong> để tổng bằng 1. Độ bất định giảm.</li></ul>
<div class="formula"><span class="lbl">Quy tắc Bayes cho định vị</span>bel(x) ← η · p(z | x) · bel(x)    η = 1 / Σ p(z | x)·bel(x)  (hệ số chuẩn hoá)</div>
<p>Khi chia thế giới thành các ô ta có <strong>bộ lọc histogram</strong> (ví dụ dưới). Khi niềm tin là phân bố Gauss (trung bình + phương sai) và mô hình tuyến tính ta có <strong>bộ lọc Kalman</strong>, “ngựa thồ” của việc hợp nhất GPS/IMU. Khi niềm tin được biểu diễn bằng nhiều mẫu ngẫu nhiên ta có <strong>bộ lọc hạt</strong>, trong robot gọi là <strong>định vị Monte Carlo</strong> — được dùng trong bộ điều hướng ROS 2 (AMCL).</p>
<p><strong>Hợp nhất cảm biến trong một dòng.</strong> Hai phép đo độc lập của cùng một khoảng cách với phương sai σ<sub>1</sub><sup>2</sup> và σ<sub>2</sub><sup>2</sup> được ghép bằng cách đặt trọng số cho mỗi phép đo bằng nghịch đảo phương sai của nó:</p>
<div class="formula"><span class="lbl">Hợp nhất hai phép đo Gauss</span>x = (x<sub>1</sub>/σ<sub>1</sub><sup>2</sup> + x<sub>2</sub>/σ<sub>2</sub><sup>2</sup>) / (1/σ<sub>1</sub><sup>2</sup> + 1/σ<sub>2</sub><sup>2</sup>)    σ<sup>2</sup> = 1 / (1/σ<sub>1</sub><sup>2</sup> + 1/σ<sub>2</sub><sup>2</sup>)</div>
<p>Ví dụ: sonar báo 10,0 m (phương sai 4), lidar báo 12,0 m (phương sai 1). Hợp nhất: (2,5 + 12)/(0,25 + 1) = 11,6 m với phương sai 0,8 — gần cảm biến tin cậy hơn và chắc chắn hơn cả hai.</p>
<p><strong>SLAM</strong> (định vị và lập bản đồ đồng thời) giải trường hợp khó hơn khi bản đồ cũng chưa biết: robot vừa dựng bản đồ vừa định vị chính mình trong đó. Robot hút bụi, robot kho hàng, kính AR đều chạy một dạng SLAM.</p>
<h3>✍️ Ví dụ (chạy bằng Python)</h3>
<div class="callout"><p>Robot ở trong một hành lang vòng gồm 10 ô; cửa (D) ở ô 0, 3, 7, còn lại là tường (W). Cảm biến cửa đúng 90 % số lần; mỗi lần di chuyển tới đúng ô 80 %, hụt hoặc lố một ô mỗi trường hợp 10 %. Ban đầu robot hoàn toàn không biết mình ở đâu.</p></div>
<pre><code class="language-python">import numpy as np

# A circular corridor of 10 cells; 'D' = door, 'W' = wall
world = ['D', 'W', 'W', 'D', 'W', 'W', 'W', 'D', 'W', 'W']
belief = np.ones(10) / 10           # start: no idea where we are

P_HIT, P_MISS = 0.9, 0.1            # sensor says the right thing 90% of the time

def sense(belief, z):
    """Measurement update (Bayes rule): multiply by likelihood, normalise."""
    like = np.array([P_HIT if cell == z else P_MISS for cell in world])
    post = belief * like
    return post / post.sum()

def move(belief, step):
    """Motion update: shift by 'step' cells; 80% exact, 10% under, 10% over."""
    return (0.8 * np.roll(belief, step)
            + 0.1 * np.roll(belief, step - 1)
            + 0.1 * np.roll(belief, step + 1))

np.set_printoptions(precision=3, suppress=True)
belief = sense(belief, 'D');  print("after sensing D:   ", belief)
belief = move(belief, 1);     print("after moving +1:   ", belief)
belief = sense(belief, 'W');  print("after sensing W:   ", belief)
belief = move(belief, 2);     print("after moving +2:   ", belief)
belief = sense(belief, 'D');  print("after sensing D:   ", belief)
belief = move(belief, 4);     print("after moving +4:   ", belief)
belief = sense(belief, 'D');  print("after sensing D:   ", belief)
print("most likely cell:", int(np.argmax(belief)), "p =", round(float(belief.max()), 3))
</code></pre>
<div class="out">after sensing D:    [0.265 0.029 0.029 0.265 0.029 0.029 0.029 0.265 0.029 0.029]
after moving +1:    [0.053 0.218 0.053 0.053 0.218 0.053 0.029 0.053 0.218 0.053]
after sensing W:    [0.007 0.253 0.062 0.007 0.253 0.062 0.034 0.007 0.253 0.062]
after moving +2:    [0.21  0.075 0.037 0.21  0.075 0.037 0.21  0.078 0.034 0.034]
after sensing D:    [0.379 0.015 0.007 0.379 0.015 0.007 0.042 0.141 0.007 0.007]
after moving +4:    [0.049 0.118 0.02  0.044 0.305 0.051 0.045 0.305 0.051 0.012]
after sensing D:    [0.104 0.028 0.005 0.095 0.073 0.012 0.011 0.657 0.012 0.003]
most likely cell: 7 p = 0.657</div>
<p><strong>Đọc từng bước.</strong> Lần đo “D” đầu tiên làm ba ô cửa đồng khả năng (0,265 mỗi ô). Sau khi đi, đo “W”, đi “+2” rồi đo “D”, hai giả thuyết hoà nhau ở 0,379: ô 0 và ô 3 — hành lang gây nhập nhằng. Thêm một lần đi (+4) và đo “D” nữa là phân xử xong: từ ô 3 robot tới ô 7 (cửa), còn từ ô 0 nó sẽ tới ô 4 (tường). Niềm tin dồn về ô 7 với p = 0,657. Để ý: mỗi lần <em>đi</em> làm niềm tin dàn mỏng ra, mỗi lần <em>đo</em> làm nó nhọn lại.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên chuẩn hoá sau bước cập nhật đo — tổng xác suất không còn bằng 1.</li><li>Chỉ tin odometry trên quãng đường dài; sai số trôi tăng không giới hạn.</li><li>Đặt P_MISS = 0 (cảm biến “hoàn hảo”): chỉ một lần đọc sai là vị trí thật bị coi là không thể mãi mãi.</li><li>Chỉ báo argmax mà bỏ qua việc hai ô có thể gần như ngang xác suất.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Định vị giữ một niềm tin: xác suất cho mọi tư thế có thể.</li><li>Bộ lọc Bayes = dự đoán bằng chuyển động (loang ra) + cập nhật bằng phép đo (nhân, chuẩn hoá).</li><li>Bộ lọc histogram, Kalman và bộ lọc hạt là ba cách biểu diễn niềm tin.</li><li>Hợp nhất phép đo đặt trọng số 1/phương sai; kết quả chắc chắn hơn từng phép đo.</li><li>SLAM vừa dựng bản đồ vừa định vị trong bản đồ đó.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Recursive_Bayesian_estimation" target="_blank" rel="noopener">Wikipedia — Ước lượng Bayes đệ quy (bộ lọc Bayes)</a></li><li><a href="https://en.wikipedia.org/wiki/Monte_Carlo_localization" target="_blank" rel="noopener">Wikipedia — Định vị Monte Carlo (bộ lọc hạt)</a></li><li><a href="https://en.wikipedia.org/wiki/Kalman_filter" target="_blank" rel="noopener">Wikipedia — Bộ lọc Kalman</a></li><li><a href="https://en.wikipedia.org/wiki/Simultaneous_localization_and_mapping" target="_blank" rel="noopener">Wikipedia — Định vị và lập bản đồ đồng thời (SLAM)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Hành lang có 5 ô, 2 ô là cửa; niềm tin ban đầu đều nhau. Cảm biến (P_HIT 0,9, P_MISS 0,1) đọc “cửa”. Xác suất hậu nghiệm của mỗi ô cửa và mỗi ô tường là bao nhiêu?</li><li>Hợp nhất số đo sonar 10,0 m (phương sai 4) với số đo lidar 12,0 m (phương sai 1).</li><li>Trong ví dụ trên, vì sao trước lần di chuyển cuối niềm tin vẫn chia đôi giữa ô 0 và ô 3?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Chưa chuẩn hoá: ô cửa 0,9·0,2 = 0,18 (×2), ô tường 0,1·0,2 = 0,02 (×3); tổng 0,42. Ô cửa 0,18/0,42 ≈ 0,429, ô tường 0,02/0,42 ≈ 0,048. 2) x = (10/4 + 12/1)/(1/4 + 1) = 14,5/1,25 = 11,6 m, phương sai 1/1,25 = 0,8. 3) Cả hai giả thuyết xuất phát (ô 7 → 8 → 0 và ô 0 → 1 → 3) đều cho đúng chuỗi số đo D, W, D; chỉ một số đo mới khác nhau giữa hai giả thuyết mới phá được thế hoà.</p></div>`);

const q9 = QZ(9, 'Quiz — Chapter 9: Perception & localization|||Quiz — Chương 9: Nhận thức & định vị', 'Kiểm tra chương 9: ảnh số, ảnh xám, mô hình lỗ kim, tích chập & Sobel, CNN, IoU, bộ lọc Bayes, hợp nhất cảm biến, SLAM.', [
  Q('q1', 'An 8-bit RGB image of 640 × 480 pixels is stored as a NumPy array. What is its shape?|||Ảnh RGB 8 bit 640 × 480 pixel lưu thành mảng NumPy. Shape của nó là gì?',
    ['(640, 480, 3)|||(640, 480, 3)', '(480, 640, 3)|||(480, 640, 3)', '(3, 640, 480)|||(3, 640, 480)', '(480, 640)|||(480, 640)'], 1,
    'Rows (height 480) first, then columns (width 640), then 3 channels.|||Hàng (chiều cao 480) trước, rồi cột (chiều rộng 640), rồi 3 kênh.'),
  Q('q2', 'Using Y = 0.299R + 0.587G + 0.114B, the gray value of pure green (0, 255, 0) is about|||Với Y = 0,299R + 0,587G + 0,114B, mức xám của lục thuần (0, 255, 0) xấp xỉ',
    ['29|||29', '76|||76', '150|||150', '255|||255'], 2,
    '0.587 · 255 ≈ 149.7 → 150.|||0,587 · 255 ≈ 149,7 → 150.'),
  Q('q3', 'Pinhole camera with fx = 800 px, cx = 320. A point at X = 0.5 m, Z = 2 m projects to u =|||Camera lỗ kim fx = 800 px, cx = 320. Điểm X = 0,5 m, Z = 2 m chiếu tới u =',
    ['400|||400', '520|||520', '720|||720', '200|||200'], 1,
    'u = 800 · 0.5 / 2 + 320 = 200 + 320 = 520.|||u = 800 · 0,5 / 2 + 320 = 200 + 320 = 520.'),
  Q('q4', 'If an object moves from 2 m to 4 m away from the camera, its size in the image|||Nếu vật dời từ cách camera 2 m ra 4 m, kích thước của nó trên ảnh',
    ['doubles|||tăng gấp đôi', 'stays the same|||không đổi', 'halves|||giảm một nửa', 'drops to a quarter|||giảm còn một phần tư'], 2,
    'Image size is proportional to 1/Z.|||Kích thước trên ảnh tỉ lệ với 1/Z.'),
  Q('q5', 'A 100 × 100 image is filtered with a 3 × 3 kernel (no padding, stride 1). The output size is|||Ảnh 100 × 100 lọc bằng nhân 3 × 3 (không đệm, bước 1). Kích thước đầu ra là',
    ['100 × 100|||100 × 100', '97 × 97|||97 × 97', '98 × 98|||98 × 98', '33 × 33|||33 × 33'], 2,
    'H − k + 1 = 100 − 3 + 1 = 98.|||H − k + 1 = 100 − 3 + 1 = 98.'),
  Q('q6', 'The Sobel kernel Sx responds most strongly to|||Nhân Sobel Sx phản ứng mạnh nhất với',
    ['uniform regions|||vùng đồng màu', 'vertical edges (brightness changes left→right)|||cạnh đứng (độ sáng đổi từ trái sang phải)', 'horizontal edges only|||chỉ cạnh ngang', 'random noise only|||chỉ nhiễu ngẫu nhiên'], 1,
    'Sx has −1, 0, +1 across columns, so it measures the horizontal gradient Gx.|||Sx có −1, 0, +1 theo cột nên đo gradient ngang Gx.'),
  Q('q7', 'How many parameters does a 3 × 3 convolution layer from 3 to 64 channels have (with bias)?|||Lớp tích chập 3 × 3 từ 3 kênh sang 64 kênh (có bias) có bao nhiêu tham số?',
    ['576|||576', '1 728|||1 728', '1 792|||1 792', '9 633 856|||9 633 856'], 2,
    '(3·3·3 + 1) · 64 = 28 · 64 = 1 792.|||(3·3·3 + 1) · 64 = 28 · 64 = 1 792.'),
  Q('q8', 'Which task assigns a class label to every pixel of the image?|||Bài toán nào gán nhãn lớp cho từng pixel của ảnh?',
    ['Classification|||Phân loại', 'Object detection|||Phát hiện đối tượng', 'Semantic segmentation|||Phân vùng ngữ nghĩa', 'Thresholding with one fixed T|||Phân ngưỡng với một T cố định'], 2,
    'Segmentation labels pixels; detection gives boxes; classification one label per image.|||Phân vùng gán nhãn từng pixel; phát hiện cho khung bao; phân loại một nhãn cho cả ảnh.'),
  Q('q9', 'Boxes A = (0, 0, 10, 10) and B = (5, 0, 15, 10). IoU =|||Khung A = (0, 0, 10, 10) và B = (5, 0, 15, 10). IoU =',
    ['0.5|||0,5', '1/3|||1/3', '0.25|||0,25', '2/3|||2/3'], 1,
    'Intersection 50, union 100 + 100 − 50 = 150, IoU = 50/150 = 1/3.|||Giao 50, hợp 100 + 100 − 50 = 150, IoU = 50/150 = 1/3.'),
  Q('q10', 'In a Bayes (histogram) localization filter, what happens in the measurement update?|||Trong bộ lọc Bayes (histogram) định vị, bước cập nhật đo làm gì?',
    ['Shift the belief by the motion and spread it|||Dịch niềm tin theo chuyển động và làm loang ra', 'Multiply the belief by p(z | x), then normalise|||Nhân niềm tin với p(z | x) rồi chuẩn hoá', 'Reset the belief to uniform|||Đặt lại niềm tin về phân bố đều', 'Pick the argmax and discard the rest|||Chọn argmax và bỏ phần còn lại'], 1,
    'Measurement update = Bayes rule: likelihood × prior, normalised; it usually sharpens the belief.|||Cập nhật đo = quy tắc Bayes: độ hợp lý × tiên nghiệm, rồi chuẩn hoá; thường làm niềm tin nhọn lại.'),
]);

const ch9 = {
  title: 'Chapter 9 — Perception & localization|||Chương 9 — Nhận thức & định vị',
  description: 'Ảnh số và mô hình camera lỗ kim, xử lý ảnh (phân ngưỡng, tích chập, Sobel), học sâu cho thị giác (CNN, phát hiện, phân vùng, IoU), định vị xác suất (bộ lọc Bayes/histogram, hợp nhất cảm biến, Kalman, bộ lọc hạt, SLAM) — tham khảo AIMA 4e ch. 25–26 (Computer Vision, Robotics) và Siegwart et al. ch. 4–5; code Python chạy thật.',
  lessons: [r91, r92, r93, r94, q9],
};


// ───────────────────────────── Chương 10 — ROS 2 nhập môn ─────────────────────────────
const r101 = L('rai101-ts-10-1',
  '10.1 — What is ROS 2 and why do roboticists use it?|||10.1 — ROS 2 là gì và vì sao giới robot dùng nó?',
  'ROS 2 là middleware (không phải hệ điều hành): đồ thị node, DDS, gói, workspace, bản phát hành Jazzy/Humble, lịch sử từ Willow Garage, khi nào dùng và không dùng ROS.',
  `<span class="eyebrow">RAI101 · Chapter 10 · Lesson 10.1</span>
<h2>What is ROS 2 and why do roboticists use it?</h2>
<p class="lead">A real robot runs dozens of programs at once: a lidar driver, a camera driver, localization, path planning, a motor controller, a safety monitor, a user interface. ROS 2 is the “plumbing” that lets these programs find each other and exchange data in a standard way — so you can reuse other people's work instead of rewriting everything.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain what ROS 2 is (and what it is not).</li><li>Describe the computation graph: nodes, topics, services, actions, parameters.</li><li>Know the main ROS 2 distributions and which one to install as a beginner.</li><li>Decide when ROS is a good choice for a project.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>ROS</strong> stands for <em>Robot Operating System</em>, but despite the name it is <strong>not an operating system</strong>. It is open-source <strong>middleware</strong> plus a large collection of libraries and tools that run on top of a normal OS (mainly Ubuntu Linux; Windows and macOS have more limited support). ROS began at Stanford and the robotics incubator <strong>Willow Garage</strong>, which made the first code commit in November 2007. ROS 1 became the standard research platform for a decade; its last release, <em>Noetic</em>, reached end of life in May 2025.</p>
<p><strong>ROS 2</strong> is a redesign announced in 2014 (first distribution, <em>Ardent</em>, December 2017). The main change: communication is built on <strong>DDS</strong> (Data Distribution Service), an industrial publish–subscribe standard. This gives ROS 2 automatic discovery (no central “master” process), configurable <strong>Quality of Service</strong> (reliable vs best-effort delivery), better security and better support for real-time and embedded systems.</p>
<div class="formula"><span class="lbl">The ROS 2 computation graph</span><b>node</b> = one process with one job (e.g. lidar driver)<br><b>topic</b> = named data stream, many-to-many, publish/subscribe (e.g. /scan)<br><b>service</b> = request → response, short call (e.g. /reset)<br><b>action</b> = long task with goal, feedback, result, cancel (e.g. navigate to a point)<br><b>parameter</b> = configuration value of a node (e.g. max_speed)</div>
<p>Code is organised in <strong>packages</strong> (a folder with a <code>package.xml</code> manifest). Packages live in a <strong>workspace</strong> and are built with <code>colcon</code>. You write nodes mostly in <strong>C++ (rclcpp)</strong> or <strong>Python (rclpy)</strong>; both talk to each other because messages have language-neutral definitions (<code>.msg</code>, <code>.srv</code>, <code>.action</code> files).</p>
<h3>Distributions</h3>
<p>ROS 2 is released in named <strong>distributions</strong> every May. Even-year releases are <strong>LTS</strong> with 5 years of support: <em>Humble Hawksbill</em> (May 2022 → May 2027) and <em>Jazzy Jalisco</em> (May 2024 → May 2029, paired with Ubuntu 24.04). Odd-year releases such as <em>Kilted Kaiju</em> (2025) are supported for only about 1.5 years; <em>Rolling</em> is the always-moving development version. <strong>Beginner advice:</strong> install Jazzy on Ubuntu 24.04 (or in a virtual machine) and follow the official tutorials for that same distribution.</p>
<h3>✍️ Worked example — mapping a robot onto ROS 2</h3>
<div class="callout"><p><b>Task.</b> A delivery robot with a 2D lidar, wheel encoders and a tablet UI must drive to a room on command.</p>
<p>Step 1 — nodes: <code>lidar_driver</code>, <code>wheel_driver</code> (reads encoders, drives motors), <code>localization</code>, <code>planner</code>, <code>ui</code>.</p>
<p>Step 2 — topics: lidar_driver publishes <code>/scan</code>; wheel_driver publishes <code>/odom</code> and subscribes to <code>/cmd_vel</code>; localization subscribes to /scan and /odom.</p>
<p>Step 3 — action: the UI sends a <b>navigate_to_pose</b> goal; the planner reports feedback (distance remaining) and a final result. An action fits because the task is long and may be cancelled.</p>
<p>Step 4 — service: <code>/clear_map</code> is a quick request → response, so it is a service.</p>
<p>Result: five small programs that can be tested, replaced and reused separately — e.g. swap the lidar brand by changing only one node.</p></div>
<h3>When (not) to use ROS</h3>
<p>Use ROS 2 when the robot has several sensors and software parts, when you want existing packages (navigation, manipulation, simulation, visualisation) or when a team works in parallel. For a tiny line-following robot on a microcontroller, plain Arduino code is simpler. ROS has a learning curve: Linux, the terminal, build tools and its own concepts.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking ROS replaces Linux or Windows — it runs on top of them.</li><li>Mixing tutorials of different distributions (Humble commands on Jazzy, or ROS 1 <code>rosrun</code>/<code>catkin</code> on ROS 2).</li><li>Forgetting to <code>source</code> the setup file in every new terminal, so the <code>ros2</code> command or your package is “not found”.</li><li>Putting everything into one giant node, losing the modularity that ROS is for.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>ROS 2 = open-source middleware + tools + libraries for robots, running on a normal OS.</li><li>Programs are nodes; they communicate via topics, services and actions; parameters configure them.</li><li>ROS 2 uses DDS: no master, Quality of Service, better security and real-time support.</li><li>Install an LTS distribution (Jazzy on Ubuntu 24.04) and use tutorials for the same distribution.</li><li>Use ROS when the system is modular and multi-sensor; skip it for tiny microcontroller projects.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://design.ros2.org/articles/why_ros2.html" target="_blank" rel="noopener">ROS 2 Design — Why ROS 2?</a></li><li><a href="https://en.wikipedia.org/wiki/Robot_Operating_System" target="_blank" rel="noopener">Wikipedia — Robot Operating System (history and distributions)</a></li><li><a href="https://github.com/ros2/ros2_documentation/blob/jazzy/source/Installation/Ubuntu-Install-Debs.rst" target="_blank" rel="noopener">Official docs source — Installing ROS 2 Jazzy on Ubuntu (deb packages)</a></li><li><a href="https://en.wikipedia.org/wiki/Data_Distribution_Service" target="_blank" rel="noopener">Wikipedia — Data Distribution Service (DDS)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>For each, choose topic, service or action: (a) camera images at 30 Hz; (b) “take a photo now and return its file name”; (c) “move the arm to the shelf, report progress, allow cancel”.</li><li>Why is a ROS 2 system easier to change than one monolithic program? Give one concrete example.</li><li>A student copies a command <code>rosrun turtlesim turtlesim_node</code> into a ROS 2 Jazzy terminal and gets an error. Why?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (a) topic (continuous stream); (b) service (short request → response); (c) action (long, feedback, cancellable). 2) Each part is a separate node with a standard interface, so you can replace one part — e.g. switch from a simulated lidar to a real one — without touching the planner. 3) <code>rosrun</code> is a ROS 1 command; in ROS 2 the equivalent is <code>ros2 run turtlesim turtlesim_node</code>.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 10 · Bài 10.1</span>
<h2>ROS 2 là gì và vì sao giới robot dùng nó?</h2>
<p class="lead">Một robot thật chạy cùng lúc hàng chục chương trình: driver lidar, driver camera, định vị, lập đường đi, điều khiển động cơ, giám sát an toàn, giao diện người dùng. ROS 2 là “hệ thống ống nước” giúp các chương trình đó tìm thấy nhau và trao đổi dữ liệu theo một chuẩn chung — nhờ vậy bạn dùng lại được công sức của người khác thay vì viết lại mọi thứ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích ROS 2 là gì (và không phải là gì).</li><li>Mô tả đồ thị tính toán: node, topic, service, action, parameter.</li><li>Biết các bản phát hành ROS 2 chính và nên cài bản nào khi mới học.</li><li>Quyết định khi nào ROS phù hợp với một dự án.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>ROS</strong> là viết tắt của <em>Robot Operating System</em>, nhưng dù tên như vậy nó <strong>không phải hệ điều hành</strong>. Nó là <strong>middleware</strong> mã nguồn mở cộng với rất nhiều thư viện và công cụ, chạy trên một hệ điều hành bình thường (chủ yếu Ubuntu Linux; Windows và macOS hỗ trợ hạn chế hơn). ROS khởi đầu ở Stanford và vườn ươm robot <strong>Willow Garage</strong>, nơi có commit mã đầu tiên vào tháng 11/2007. ROS 1 là nền tảng nghiên cứu chuẩn suốt một thập kỷ; bản cuối cùng, <em>Noetic</em>, hết hỗ trợ tháng 5/2025.</p>
<p><strong>ROS 2</strong> là bản thiết kế lại, công bố năm 2014 (bản phát hành đầu <em>Ardent</em>, tháng 12/2017). Thay đổi chính: truyền thông xây trên <strong>DDS</strong> (Data Distribution Service), một chuẩn publish–subscribe công nghiệp. Nhờ đó ROS 2 tự phát hiện các node (không cần tiến trình “master” trung tâm), cấu hình được <strong>Quality of Service</strong> (gửi tin cậy hay gửi nhanh chấp nhận mất gói), bảo mật tốt hơn và hỗ trợ hệ thời gian thực, hệ nhúng tốt hơn.</p>
<div class="formula"><span class="lbl">Đồ thị tính toán ROS 2</span><b>node</b> = một tiến trình làm một việc (vd driver lidar)<br><b>topic</b> = luồng dữ liệu có tên, nhiều–nhiều, publish/subscribe (vd /scan)<br><b>service</b> = yêu cầu → phản hồi, lời gọi ngắn (vd /reset)<br><b>action</b> = tác vụ dài có goal, feedback, result, huỷ được (vd đi tới một điểm)<br><b>parameter</b> = giá trị cấu hình của node (vd max_speed)</div>
<p>Mã được tổ chức thành <strong>package</strong> (thư mục có tệp mô tả <code>package.xml</code>). Các package nằm trong một <strong>workspace</strong> và được build bằng <code>colcon</code>. Node chủ yếu viết bằng <strong>C++ (rclcpp)</strong> hoặc <strong>Python (rclpy)</strong>; hai loại nói chuyện được với nhau vì message được định nghĩa độc lập ngôn ngữ (tệp <code>.msg</code>, <code>.srv</code>, <code>.action</code>).</p>
<h3>Các bản phát hành</h3>
<p>ROS 2 ra một <strong>bản phát hành</strong> có tên vào tháng 5 mỗi năm. Bản năm chẵn là <strong>LTS</strong>, hỗ trợ 5 năm: <em>Humble Hawksbill</em> (5/2022 → 5/2027) và <em>Jazzy Jalisco</em> (5/2024 → 5/2029, đi cùng Ubuntu 24.04). Bản năm lẻ như <em>Kilted Kaiju</em> (2025) chỉ được hỗ trợ khoảng 1,5 năm; <em>Rolling</em> là bản phát triển luôn thay đổi. <strong>Lời khuyên cho người mới:</strong> cài Jazzy trên Ubuntu 24.04 (hoặc máy ảo) và làm theo tutorial chính thức của đúng bản đó.</p>
<h3>✍️ Ví dụ — đặt một robot lên ROS 2</h3>
<div class="callout"><p><b>Bài toán.</b> Robot giao hàng có lidar 2D, encoder bánh xe và máy tính bảng giao diện; phải tự đi tới một phòng khi được ra lệnh.</p>
<p>Bước 1 — node: <code>lidar_driver</code>, <code>wheel_driver</code> (đọc encoder, chạy động cơ), <code>localization</code>, <code>planner</code>, <code>ui</code>.</p>
<p>Bước 2 — topic: lidar_driver publish <code>/scan</code>; wheel_driver publish <code>/odom</code> và subscribe <code>/cmd_vel</code>; localization subscribe /scan và /odom.</p>
<p>Bước 3 — action: UI gửi goal <b>navigate_to_pose</b>; planner gửi feedback (quãng đường còn lại) và result cuối. Dùng action vì tác vụ dài và có thể bị huỷ.</p>
<p>Bước 4 — service: <code>/clear_map</code> là yêu cầu → phản hồi nhanh nên là service.</p>
<p>Kết quả: năm chương trình nhỏ, kiểm thử, thay thế, dùng lại riêng được — vd đổi hãng lidar chỉ cần đổi một node.</p></div>
<h3>Khi nào (không) dùng ROS</h3>
<p>Dùng ROS 2 khi robot có nhiều cảm biến và nhiều khối phần mềm, khi muốn dùng package có sẵn (dẫn đường, thao tác, mô phỏng, hiển thị) hoặc khi cả nhóm làm song song. Với robot dò line nhỏ trên vi điều khiển, code Arduino thuần đơn giản hơn. ROS có đường cong học tập: Linux, terminal, công cụ build và các khái niệm riêng.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ ROS thay thế Linux hay Windows — nó chạy bên trên chúng.</li><li>Trộn tutorial của các bản khác nhau (lệnh Humble trên Jazzy, hoặc <code>rosrun</code>/<code>catkin</code> của ROS 1 trên ROS 2).</li><li>Quên <code>source</code> tệp setup ở mỗi terminal mới, nên lệnh <code>ros2</code> hoặc package của bạn “không tìm thấy”.</li><li>Dồn mọi thứ vào một node khổng lồ, đánh mất tính mô-đun — lý do tồn tại của ROS.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>ROS 2 = middleware mã nguồn mở + công cụ + thư viện cho robot, chạy trên hệ điều hành thường.</li><li>Chương trình là node; giao tiếp qua topic, service, action; parameter để cấu hình.</li><li>ROS 2 dùng DDS: không cần master, có QoS, bảo mật và hỗ trợ thời gian thực tốt hơn.</li><li>Cài bản LTS (Jazzy trên Ubuntu 24.04) và dùng tutorial cùng bản.</li><li>Dùng ROS khi hệ thống mô-đun, nhiều cảm biến; bỏ qua với dự án vi điều khiển nhỏ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://design.ros2.org/articles/why_ros2.html" target="_blank" rel="noopener">ROS 2 Design — Vì sao có ROS 2?</a></li><li><a href="https://en.wikipedia.org/wiki/Robot_Operating_System" target="_blank" rel="noopener">Wikipedia — Robot Operating System (lịch sử, các bản phát hành)</a></li><li><a href="https://github.com/ros2/ros2_documentation/blob/jazzy/source/Installation/Ubuntu-Install-Debs.rst" target="_blank" rel="noopener">Nguồn tài liệu chính thức — Cài ROS 2 Jazzy trên Ubuntu (gói deb)</a></li><li><a href="https://en.wikipedia.org/wiki/Data_Distribution_Service" target="_blank" rel="noopener">Wikipedia — Data Distribution Service (DDS)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chọn topic, service hay action cho mỗi việc: (a) ảnh camera 30 Hz; (b) “chụp một ảnh ngay và trả về tên tệp”; (c) “đưa cánh tay tới kệ, báo tiến độ, cho phép huỷ”.</li><li>Vì sao hệ thống ROS 2 dễ thay đổi hơn một chương trình nguyên khối? Cho một ví dụ cụ thể.</li><li>Một bạn chép lệnh <code>rosrun turtlesim turtlesim_node</code> vào terminal ROS 2 Jazzy và bị lỗi. Vì sao?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (a) topic (luồng liên tục); (b) service (yêu cầu → phản hồi ngắn); (c) action (dài, có feedback, huỷ được). 2) Mỗi phần là một node riêng với giao diện chuẩn, nên thay được một phần — vd đổi lidar mô phỏng sang lidar thật — mà không đụng planner. 3) <code>rosrun</code> là lệnh ROS 1; ở ROS 2 lệnh tương đương là <code>ros2 run turtlesim turtlesim_node</code>.</p></div>`);

const r102 = L('rai101-ts-10-2',
  '10.2 — Nodes, topics, services and actions in practice (rclpy)|||10.2 — Node, topic, service, action trong thực hành (rclpy)',
  'Mô phỏng publish/subscribe bằng Python thuần (chạy thật), node publisher/subscriber rclpy theo tutorial chính thức, lệnh ros2 topic/node/service, message std_msgs và geometry_msgs/Twist.',
  `<span class="eyebrow">RAI101 · Chapter 10 · Lesson 10.2</span>
<h2>Nodes, topics, services and actions in practice (rclpy)</h2>
<p class="lead">Publish/subscribe is the heart of ROS 2. We first build the idea in 30 lines of plain Python that runs anywhere, then look at the real <code>rclpy</code> publisher and subscriber from the official ROS 2 tutorial, and the command-line tools that let you inspect a running robot.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain publish/subscribe and why publishers do not need to know their subscribers.</li><li>Read a minimal rclpy publisher and subscriber.</li><li>Use <code>ros2 node</code>, <code>ros2 topic</code>, <code>ros2 service</code> and <code>ros2 interface</code> to inspect a system.</li><li>Recognise common message types (String, Twist, LaserScan).</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>topic</strong> is a named channel such as <code>/scan</code> or <code>/cmd_vel</code>. A node <strong>publishes</strong> messages to it; any number of nodes <strong>subscribe</strong> and receive a copy through a <strong>callback</strong> function. The publisher does not know who listens — this <em>decoupling</em> is what lets you add a logger or a visualiser without changing existing code. Every topic has one <strong>message type</strong>, e.g. <code>std_msgs/msg/String</code> (text), <code>geometry_msgs/msg/Twist</code> (linear and angular velocity — the standard “drive” command) or <code>sensor_msgs/msg/LaserScan</code> (a lidar sweep).</p>
<h3>✍️ Worked example 1 — publish/subscribe in plain Python (runnable)</h3>
<p>This is <em>not</em> ROS; it is a tiny in-process “bus” that shows the same pattern. A fake lidar publishes distances; a safety node turns them into speed commands; a motor node obeys.</p>
<pre><code class="language-python"># A tiny publish/subscribe "bus" in plain Python - the idea behind ROS 2 topics
from collections import defaultdict

class Bus:
    def __init__(self):
        self.subs = defaultdict(list)          # topic name -&gt; list of callbacks

    def subscribe(self, topic, callback):
        self.subs[topic].append(callback)

    def publish(self, topic, msg):
        for cb in self.subs[topic]:            # deliver to every subscriber
            cb(msg)

bus = Bus()

# "listener" node: prints what it hears
bus.subscribe('chatter', lambda m: print('[listener] I heard:', m))

# "safety" node: stops the robot if an obstacle is closer than 0.5 m
def on_scan(dist):
    cmd = 0.0 if dist &lt; 0.5 else 0.3
    print('[safety] range = %.2f m -&gt; publish /cmd_vel speed %.1f m/s' % (dist, cmd))
    bus.publish('cmd_vel', cmd)
bus.subscribe('scan', on_scan)

# "motor driver" node
bus.subscribe('cmd_vel', lambda v: print('[motor]  wheels set to', v, 'm/s'))

# "talker" node publishes 3 messages
for i in range(3):
    bus.publish('chatter', 'Hello World: %d' % i)

# a fake lidar publishes 3 distance readings
for d in [1.20, 0.80, 0.35]:
    bus.publish('scan', d)

print('topics:', sorted(bus.subs), '| subscribers on scan:', len(bus.subs['scan']))
</code></pre>
<div class="out">[listener] I heard: Hello World: 0
[listener] I heard: Hello World: 1
[listener] I heard: Hello World: 2
[safety] range = 1.20 m -&gt; publish /cmd_vel speed 0.3 m/s
[motor]  wheels set to 0.3 m/s
[safety] range = 0.80 m -&gt; publish /cmd_vel speed 0.3 m/s
[motor]  wheels set to 0.3 m/s
[safety] range = 0.35 m -&gt; publish /cmd_vel speed 0.0 m/s
[motor]  wheels set to 0.0 m/s
topics: ['chatter', 'cmd_vel', 'scan'] | subscribers on scan: 1</div>
<p>Notice: the safety node is both a subscriber (of <code>scan</code>) and a publisher (of <code>cmd_vel</code>) — exactly how real ROS nodes are chained. Real ROS adds what this toy lacks: separate processes or machines, network discovery, typed messages, queues and Quality of Service.</p>
<h3>✍️ Worked example 2 — the real rclpy publisher</h3>
<div class="note-ct"><p>⚠️ The code and commands below were <strong>not run in this lesson</strong> (they need ROS 2 installed). Run them on your own ROS 2 Jazzy machine, following the official tutorial “Writing a simple publisher and subscriber (Python)” linked below.</p></div>
<pre><code class="language-python">import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)  # queue size 10
        self.timer = self.create_timer(0.5, self.timer_callback)      # every 0.5 s
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello World: %d' % self.i
        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
        self.i += 1

def main():
    rclpy.init()
    node = MinimalPublisher()
    rclpy.spin(node)        # keep the node alive and run callbacks
    node.destroy_node()
    rclpy.shutdown()
</code></pre>
<p>The subscriber is symmetrical: <code>self.create_subscription(String, 'topic', self.listener_callback, 10)</code>, and its callback logs <code>I heard: ...</code>. In the tutorial you build the package with <code>colcon build --packages-select py_pubsub</code>, source the workspace, then run <code>ros2 run py_pubsub talker</code> in one terminal and <code>ros2 run py_pubsub listener</code> in another. Expected behaviour (described in the tutorial): the talker logs a new message every 0.5 s with an increasing counter; the listener logs each message it receives, starting from whatever counter value the talker has reached.</p>
<h3>Inspecting a running system</h3>
<pre><code class="language-bash"># not run here - use on your ROS 2 install
ros2 node list                      # which nodes are running
ros2 topic list -t                  # topics and their message types
ros2 topic echo /topic              # print messages as they arrive
ros2 topic hz /topic                # measure publishing rate
ros2 interface show geometry_msgs/msg/Twist
ros2 service list
</code></pre>
<p>Services use <code>create_service</code> / <code>create_client</code> (one request, one response). Actions add a goal, periodic feedback and a result — use them for anything long such as “navigate to the kitchen”.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Publisher and subscriber use different topic names (<code>topic</code> vs <code>/chatter</code>) or different message types — nothing arrives and there is no error.</li><li>Forgetting <code>rclpy.spin()</code>: callbacks never run.</li><li>Doing slow work (e.g. a 2-second computation) inside a callback, blocking the node.</li><li>Using a service for a long task; use an action so the caller gets feedback and can cancel.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Topics are many-to-many typed data streams; publishers do not know their subscribers.</li><li>A node can subscribe to one topic and publish to another, forming a pipeline.</li><li>rclpy: <code>create_publisher</code>, <code>create_subscription</code>, <code>create_timer</code>, <code>spin</code>.</li><li><code>ros2 topic list/echo/hz</code> and <code>ros2 interface show</code> are your debugging tools.</li><li>Service = short request/response; action = long goal with feedback and cancel.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://github.com/ros2/ros2_documentation/blob/jazzy/source/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Py-Publisher-And-Subscriber.rst" target="_blank" rel="noopener">Official tutorial (source) — Writing a simple publisher and subscriber (Python)</a></li><li><a href="https://github.com/ros2/ros2_documentation/blob/jazzy/source/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Topics/Understanding-ROS2-Topics.rst" target="_blank" rel="noopener">Official tutorial (source) — Understanding topics (with turtlesim)</a></li><li><a href="https://github.com/ros2/ros2_documentation/blob/jazzy/source/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Actions/Understanding-ROS2-Actions.rst" target="_blank" rel="noopener">Official tutorial (source) — Understanding actions</a></li><li><a href="https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern" target="_blank" rel="noopener">Wikipedia — Publish–subscribe pattern</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>In the plain-Python example, add a second subscriber to <code>scan</code> that prints “LOG” plus the distance. Do you have to change the lidar loop? Why?</li><li>Which message type would you use to tell a mobile base “drive forward at 0.2 m/s and turn at 0.5 rad/s”?</li><li>Your listener prints nothing. List two checks using the <code>ros2</code> CLI.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Add <code>bus.subscribe('scan', lambda d: print('LOG', d))</code>. The lidar loop does not change — publishers do not know their subscribers (decoupling). 2) <code>geometry_msgs/msg/Twist</code>: linear.x = 0.2, angular.z = 0.5. 3) <code>ros2 topic list -t</code> (does the topic exist, same name and type?) and <code>ros2 topic echo /topic</code> or <code>ros2 topic hz /topic</code> (is anything actually being published?). Also check <code>ros2 node list</code>.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 10 · Bài 10.2</span>
<h2>Node, topic, service, action trong thực hành (rclpy)</h2>
<p class="lead">Publish/subscribe là trái tim của ROS 2. Trước hết ta dựng ý tưởng bằng 30 dòng Python thuần chạy ở đâu cũng được, rồi xem publisher và subscriber <code>rclpy</code> thật trong tutorial chính thức của ROS 2, cùng các công cụ dòng lệnh để soi một robot đang chạy.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích publish/subscribe và vì sao publisher không cần biết subscriber.</li><li>Đọc hiểu một publisher và subscriber rclpy tối giản.</li><li>Dùng <code>ros2 node</code>, <code>ros2 topic</code>, <code>ros2 service</code>, <code>ros2 interface</code> để kiểm tra hệ thống.</li><li>Nhận ra các kiểu message thông dụng (String, Twist, LaserScan).</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Topic</strong> là một kênh có tên như <code>/scan</code> hay <code>/cmd_vel</code>. Một node <strong>publish</strong> message lên đó; bao nhiêu node <strong>subscribe</strong> cũng được và mỗi node nhận một bản sao qua hàm <strong>callback</strong>. Publisher không biết ai đang nghe — chính sự <em>tách rời</em> này giúp bạn thêm một bộ ghi log hay bộ hiển thị mà không sửa code cũ. Mỗi topic có một <strong>kiểu message</strong>, vd <code>std_msgs/msg/String</code> (chuỗi), <code>geometry_msgs/msg/Twist</code> (vận tốc thẳng và vận tốc góc — lệnh “chạy” chuẩn) hay <code>sensor_msgs/msg/LaserScan</code> (một vòng quét lidar).</p>
<h3>✍️ Ví dụ 1 — publish/subscribe bằng Python thuần (chạy được)</h3>
<p>Đây <em>không</em> phải ROS; đó là một “bus” nhỏ trong cùng tiến trình, minh hoạ đúng mẫu ấy. Lidar giả publish khoảng cách; node an toàn biến chúng thành lệnh tốc độ; node động cơ làm theo.</p>
<pre><code class="language-python"># A tiny publish/subscribe "bus" in plain Python - the idea behind ROS 2 topics
from collections import defaultdict

class Bus:
    def __init__(self):
        self.subs = defaultdict(list)          # topic name -&gt; list of callbacks

    def subscribe(self, topic, callback):
        self.subs[topic].append(callback)

    def publish(self, topic, msg):
        for cb in self.subs[topic]:            # deliver to every subscriber
            cb(msg)

bus = Bus()

# "listener" node: prints what it hears
bus.subscribe('chatter', lambda m: print('[listener] I heard:', m))

# "safety" node: stops the robot if an obstacle is closer than 0.5 m
def on_scan(dist):
    cmd = 0.0 if dist &lt; 0.5 else 0.3
    print('[safety] range = %.2f m -&gt; publish /cmd_vel speed %.1f m/s' % (dist, cmd))
    bus.publish('cmd_vel', cmd)
bus.subscribe('scan', on_scan)

# "motor driver" node
bus.subscribe('cmd_vel', lambda v: print('[motor]  wheels set to', v, 'm/s'))

# "talker" node publishes 3 messages
for i in range(3):
    bus.publish('chatter', 'Hello World: %d' % i)

# a fake lidar publishes 3 distance readings
for d in [1.20, 0.80, 0.35]:
    bus.publish('scan', d)

print('topics:', sorted(bus.subs), '| subscribers on scan:', len(bus.subs['scan']))
</code></pre>
<div class="out">[listener] I heard: Hello World: 0
[listener] I heard: Hello World: 1
[listener] I heard: Hello World: 2
[safety] range = 1.20 m -&gt; publish /cmd_vel speed 0.3 m/s
[motor]  wheels set to 0.3 m/s
[safety] range = 0.80 m -&gt; publish /cmd_vel speed 0.3 m/s
[motor]  wheels set to 0.3 m/s
[safety] range = 0.35 m -&gt; publish /cmd_vel speed 0.0 m/s
[motor]  wheels set to 0.0 m/s
topics: ['chatter', 'cmd_vel', 'scan'] | subscribers on scan: 1</div>
<p>Để ý: node an toàn vừa là subscriber (của <code>scan</code>) vừa là publisher (của <code>cmd_vel</code>) — đúng cách các node ROS thật nối thành chuỗi. ROS thật bổ sung những thứ bản đồ chơi này thiếu: tiến trình hoặc máy tính riêng, tự phát hiện qua mạng, message có kiểu, hàng đợi và Quality of Service.</p>
<h3>✍️ Ví dụ 2 — publisher rclpy thật</h3>
<div class="note-ct"><p>⚠️ Code và lệnh dưới đây <strong>không được chạy trong bài này</strong> (cần cài ROS 2). Hãy chạy trên máy ROS 2 Jazzy của bạn, theo tutorial chính thức “Writing a simple publisher and subscriber (Python)” có link bên dưới.</p></div>
<pre><code class="language-python">import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)  # queue size 10
        self.timer = self.create_timer(0.5, self.timer_callback)      # every 0.5 s
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello World: %d' % self.i
        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
        self.i += 1

def main():
    rclpy.init()
    node = MinimalPublisher()
    rclpy.spin(node)        # keep the node alive and run callbacks
    node.destroy_node()
    rclpy.shutdown()
</code></pre>
<p>Subscriber đối xứng: <code>self.create_subscription(String, 'topic', self.listener_callback, 10)</code>, và callback ghi log <code>I heard: ...</code>. Trong tutorial, bạn build package bằng <code>colcon build --packages-select py_pubsub</code>, source workspace, rồi chạy <code>ros2 run py_pubsub talker</code> ở một terminal và <code>ros2 run py_pubsub listener</code> ở terminal khác. Hành vi mong đợi (theo mô tả của tutorial): talker ghi log một message mới mỗi 0,5 giây với bộ đếm tăng dần; listener ghi log từng message nhận được, bắt đầu từ giá trị đếm mà talker đã chạy tới.</p>
<h3>Soi một hệ thống đang chạy</h3>
<pre><code class="language-bash"># not run here - use on your ROS 2 install
ros2 node list                      # which nodes are running
ros2 topic list -t                  # topics and their message types
ros2 topic echo /topic              # print messages as they arrive
ros2 topic hz /topic                # measure publishing rate
ros2 interface show geometry_msgs/msg/Twist
ros2 service list
</code></pre>
<p>Service dùng <code>create_service</code> / <code>create_client</code> (một yêu cầu, một phản hồi). Action thêm goal, feedback định kỳ và result — dùng cho mọi việc dài như “đi tới nhà bếp”.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Publisher và subscriber dùng tên topic khác nhau (<code>topic</code> và <code>/chatter</code>) hoặc khác kiểu message — không nhận được gì mà cũng không báo lỗi.</li><li>Quên <code>rclpy.spin()</code>: callback không bao giờ chạy.</li><li>Làm việc chậm (vd tính 2 giây) ngay trong callback, làm node bị nghẽn.</li><li>Dùng service cho tác vụ dài; hãy dùng action để bên gọi có feedback và huỷ được.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Topic là luồng dữ liệu có kiểu, nhiều–nhiều; publisher không biết subscriber.</li><li>Một node có thể subscribe topic này và publish topic khác, tạo thành pipeline.</li><li>rclpy: <code>create_publisher</code>, <code>create_subscription</code>, <code>create_timer</code>, <code>spin</code>.</li><li><code>ros2 topic list/echo/hz</code> và <code>ros2 interface show</code> là công cụ gỡ lỗi.</li><li>Service = yêu cầu/phản hồi ngắn; action = goal dài có feedback và huỷ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://github.com/ros2/ros2_documentation/blob/jazzy/source/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Py-Publisher-And-Subscriber.rst" target="_blank" rel="noopener">Tutorial chính thức (bản nguồn) — Viết publisher và subscriber đơn giản (Python)</a></li><li><a href="https://github.com/ros2/ros2_documentation/blob/jazzy/source/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Topics/Understanding-ROS2-Topics.rst" target="_blank" rel="noopener">Tutorial chính thức (bản nguồn) — Hiểu về topic (với turtlesim)</a></li><li><a href="https://github.com/ros2/ros2_documentation/blob/jazzy/source/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Actions/Understanding-ROS2-Actions.rst" target="_blank" rel="noopener">Tutorial chính thức (bản nguồn) — Hiểu về action</a></li><li><a href="https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern" target="_blank" rel="noopener">Wikipedia — Mẫu publish–subscribe</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Trong ví dụ Python thuần, thêm subscriber thứ hai cho <code>scan</code> in ra “LOG” kèm khoảng cách. Có phải sửa vòng lặp lidar không? Vì sao?</li><li>Dùng kiểu message nào để bảo đế di động “tiến 0,2 m/s và quay 0,5 rad/s”?</li><li>Listener của bạn không in gì. Nêu hai bước kiểm tra bằng CLI <code>ros2</code>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Thêm <code>bus.subscribe('scan', lambda d: print('LOG', d))</code>. Vòng lặp lidar không đổi — publisher không biết subscriber (tách rời). 2) <code>geometry_msgs/msg/Twist</code>: linear.x = 0,2, angular.z = 0,5. 3) <code>ros2 topic list -t</code> (topic có tồn tại, cùng tên và kiểu không?) và <code>ros2 topic echo /topic</code> hoặc <code>ros2 topic hz /topic</code> (có thật sự đang publish không?). Kiểm thêm <code>ros2 node list</code>.</p></div>`);

const r103 = L('rai101-ts-10-3',
  '10.3 — The ROS 2 toolbox: tf2, RViz, Gazebo, Nav2, MoveIt and launch files|||10.3 — Bộ công cụ ROS 2: tf2, RViz, Gazebo, Nav2, MoveIt và launch',
  'Hệ khung toạ độ tf2 (map → odom → base_link → laser, có code numpy chạy thật), RViz, mô phỏng Gazebo, Nav2, MoveIt, launch file, quy trình mô phỏng trước – robot thật sau.',
  `<span class="eyebrow">RAI101 · Chapter 10 · Lesson 10.3</span>
<h2>The ROS 2 toolbox: tf2, RViz, Gazebo, Nav2, MoveIt and launch files</h2>
<p class="lead">The real power of ROS is not the messaging — it is the ecosystem built on it. This lesson tours the tools you will meet in any ROS 2 project and connects tf2 back to the homogeneous transforms of Chapter 3.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain what tf2 does and read the standard frame chain map → odom → base_link → sensor.</li><li>Compute a sensor point in the map frame by chaining transforms (Python, numpy).</li><li>Know the role of RViz, Gazebo, Nav2, MoveIt and launch files.</li><li>Describe a sensible simulate-first development workflow.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>tf2</strong> is the transform library of ROS 2. Every part of a robot has its own coordinate frame: the map, the odometry origin, the robot base, each sensor, each joint of an arm. tf2 keeps all frames in a time-stamped <strong>tree</strong> and can answer “where is point P (seen in the laser frame) expressed in the map frame, at time t?”. Nodes <em>broadcast</em> transforms (e.g. localization publishes map → odom; the wheel driver publishes odom → base_link) and <em>listen</em> to them; fixed mounts such as base_link → laser are <em>static transforms</em>.</p>
<div class="formula"><span class="lbl">Chaining (Chapter 3)</span>T<sub>map,laser</sub> = T<sub>map,odom</sub> · T<sub>odom,base</sub> · T<sub>base,laser</sub>    p<sub>map</sub> = T<sub>map,laser</sub> · p<sub>laser</sub></div>
<h3>✍️ Worked example — what tf2 computes for you</h3>
<pre><code class="language-python"># Chaining transforms like tf2: map -&gt; odom -&gt; base_link -&gt; laser
import numpy as np

def T(x, y, theta_deg):
    """2D homogeneous transform: pose of a child frame expressed in its parent frame"""
    t = np.radians(theta_deg)
    return np.array([[np.cos(t), -np.sin(t), x],
                     [np.sin(t),  np.cos(t), y],
                     [0.0,        0.0,       1.0]])

T_map_odom   = T(1.0, 0.5, 0)     # odometry drift correction from localization
T_odom_base  = T(2.0, 1.0, 90)    # robot pose from wheel odometry
T_base_laser = T(0.2, 0.0, 0)     # lidar mounted 20 cm in front of the centre

T_map_laser = T_map_odom @ T_odom_base @ T_base_laser
p_laser = np.array([1.5, 0.0, 1.0])      # obstacle 1.5 m straight ahead of the lidar
p_map = T_map_laser @ p_laser
print('laser origin in map :', np.round(T_map_laser[:2, 2], 3))
print('obstacle in map     :', np.round(p_map[:2], 3))
</code></pre>
<div class="out">laser origin in map : [3.  1.7]
obstacle in map     : [3.  3.2]</div>
<p>Check by hand: the base is at (1 + 2, 0.5 + 1) = (3, 1.5) facing +y (90°). The laser is 0.2 m ahead → (3, 1.7). The obstacle is 1.5 m further ahead → (3, 3.2). ✓ In ROS you never write this chain yourself: you ask tf2 for the transform between two frames and it multiplies along the tree.</p>
<h3>The rest of the toolbox</h3>
<ul>
<li><strong>RViz</strong> — 3D visualiser: shows the robot model, tf frames, laser scans, camera images, maps and planned paths. Your first debugging tool: “what does the robot <em>think</em> it sees?”.</li>
<li><strong>Gazebo</strong> — physics simulator: a virtual world with gravity, collisions and simulated sensors that publish on the same topics as real ones, so the same nodes run in simulation and on hardware.</li>
<li><strong>Nav2</strong> — the navigation stack for mobile robots: maps, localization, global and local planners (Chapter 7), recovery behaviours, all controlled through a <code>navigate_to_pose</code> action.</li>
<li><strong>MoveIt</strong> — motion planning for robot arms: inverse kinematics (Chapter 4), collision-free trajectories, grasping.</li>
<li><strong>Launch files</strong> — Python/XML/YAML files that start many nodes with their parameters at once (<code>ros2 launch ...</code>) instead of opening ten terminals.</li>
<li><strong>rosbag2</strong> — records topics to a file and replays them later: test perception code on real data without the robot.</li>
</ul>
<h3>A good workflow</h3>
<p>1) Describe the robot (URDF model: links, joints, sensors). 2) Visualise it in RViz and check the tf tree. 3) Simulate in Gazebo and develop nodes there. 4) Record bags from the real robot and replay them. 5) Only then run on hardware, at low speed, with an emergency stop within reach (Chapter 11).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Two nodes publishing the same transform (e.g. both a simulator and your node publishing odom → base_link) — frames “jump”.</li><li>Mixing up the direction of a transform (parent → child vs child → parent).</li><li>Using degrees where ROS expects radians; ROS uses SI units (metres, radians, seconds).</li><li>Trusting simulation completely: real sensors are noisier and real floors are slippery.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>tf2 keeps a time-stamped tree of frames and multiplies transforms for you.</li><li>Standard mobile-robot chain: map → odom → base_link → sensor frames.</li><li>RViz visualises, Gazebo simulates, Nav2 navigates, MoveIt plans arm motion.</li><li>Launch files start whole systems; rosbag2 records and replays data.</li><li>Simulate first, then hardware at low speed with an e-stop.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://github.com/ros2/ros2_documentation/blob/jazzy/source/Concepts/Intermediate/About-Tf2.rst" target="_blank" rel="noopener">Official docs (source) — About tf2</a></li><li><a href="https://github.com/ros-infrastructure/rep/blob/master/rep-0105.rst" target="_blank" rel="noopener">REP 105 — Coordinate frames for mobile platforms (map, odom, base_link)</a></li><li><a href="https://github.com/ros-navigation/navigation2" target="_blank" rel="noopener">Nav2 — ROS 2 Navigation framework (GitHub)</a></li><li><a href="https://moveit.picknik.ai/main/index.html" target="_blank" rel="noopener">MoveIt 2 documentation</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>In the example, change the robot heading in odom from 90° to 0°. Where is the obstacle in the map frame now?</li><li>Which tool would you use to (a) check whether a laser scan lines up with the walls of the map; (b) test a new planner without risking the robot; (c) make an arm pick a cup while avoiding a table?</li><li>Why is base_link → laser usually a static transform, while odom → base_link is not?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Base at (3, 1.5) facing +x; laser at (3.2, 1.5); obstacle at (4.7, 1.5). 2) (a) RViz; (b) Gazebo simulation (or replaying a rosbag); (c) MoveIt. 3) The lidar is bolted to the robot, so its offset never changes; the robot's pose in odom changes every time the wheels turn.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 10 · Bài 10.3</span>
<h2>Bộ công cụ ROS 2: tf2, RViz, Gazebo, Nav2, MoveIt và launch</h2>
<p class="lead">Sức mạnh thật của ROS không nằm ở việc truyền message — mà ở hệ sinh thái xây trên nó. Bài này dạo qua các công cụ bạn sẽ gặp trong mọi dự án ROS 2 và nối tf2 với phép biến đổi thuần nhất ở Chương 3.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích tf2 làm gì và đọc chuỗi khung chuẩn map → odom → base_link → cảm biến.</li><li>Tính toạ độ một điểm cảm biến trong khung map bằng cách nhân chuỗi phép biến đổi (Python, numpy).</li><li>Biết vai trò của RViz, Gazebo, Nav2, MoveIt và launch file.</li><li>Mô tả quy trình phát triển hợp lý: mô phỏng trước.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>tf2</strong> là thư viện biến đổi toạ độ của ROS 2. Mỗi bộ phận robot có khung toạ độ riêng: bản đồ, gốc odometry, thân robot, từng cảm biến, từng khớp của cánh tay. tf2 giữ mọi khung trong một <strong>cây</strong> có gắn thời gian và trả lời được câu hỏi “điểm P (nhìn thấy trong khung laser) nằm ở đâu trong khung map, tại thời điểm t?”. Các node <em>phát (broadcast)</em> phép biến đổi (vd node định vị phát map → odom; driver bánh xe phát odom → base_link) và <em>nghe</em> chúng; các phần gắn cố định như base_link → laser là <em>biến đổi tĩnh</em>.</p>
<div class="formula"><span class="lbl">Nhân chuỗi (Chương 3)</span>T<sub>map,laser</sub> = T<sub>map,odom</sub> · T<sub>odom,base</sub> · T<sub>base,laser</sub>    p<sub>map</sub> = T<sub>map,laser</sub> · p<sub>laser</sub></div>
<h3>✍️ Ví dụ — tf2 tính giúp bạn điều gì</h3>
<pre><code class="language-python"># Chaining transforms like tf2: map -&gt; odom -&gt; base_link -&gt; laser
import numpy as np

def T(x, y, theta_deg):
    """2D homogeneous transform: pose of a child frame expressed in its parent frame"""
    t = np.radians(theta_deg)
    return np.array([[np.cos(t), -np.sin(t), x],
                     [np.sin(t),  np.cos(t), y],
                     [0.0,        0.0,       1.0]])

T_map_odom   = T(1.0, 0.5, 0)     # odometry drift correction from localization
T_odom_base  = T(2.0, 1.0, 90)    # robot pose from wheel odometry
T_base_laser = T(0.2, 0.0, 0)     # lidar mounted 20 cm in front of the centre

T_map_laser = T_map_odom @ T_odom_base @ T_base_laser
p_laser = np.array([1.5, 0.0, 1.0])      # obstacle 1.5 m straight ahead of the lidar
p_map = T_map_laser @ p_laser
print('laser origin in map :', np.round(T_map_laser[:2, 2], 3))
print('obstacle in map     :', np.round(p_map[:2], 3))
</code></pre>
<div class="out">laser origin in map : [3.  1.7]
obstacle in map     : [3.  3.2]</div>
<p>Kiểm tay: thân robot ở (1 + 2; 0,5 + 1) = (3; 1,5), hướng theo +y (90°). Laser ở phía trước 0,2 m → (3; 1,7). Vật cản xa thêm 1,5 m phía trước → (3; 3,2). ✓ Trong ROS bạn không tự viết chuỗi này: bạn hỏi tf2 phép biến đổi giữa hai khung và nó tự nhân dọc theo cây.</p>
<h3>Phần còn lại của bộ công cụ</h3>
<ul>
<li><strong>RViz</strong> — công cụ hiển thị 3D: mô hình robot, các khung tf, quét laser, ảnh camera, bản đồ, đường đi đã lập. Công cụ gỡ lỗi đầu tiên: “robot <em>nghĩ</em> nó đang thấy gì?”.</li>
<li><strong>Gazebo</strong> — trình mô phỏng vật lý: thế giới ảo có trọng lực, va chạm và cảm biến mô phỏng publish lên đúng các topic như cảm biến thật, nên cùng một bộ node chạy được cả trong mô phỏng lẫn trên phần cứng.</li>
<li><strong>Nav2</strong> — bộ dẫn đường cho robot di động: bản đồ, định vị, bộ lập đường toàn cục và cục bộ (Chương 7), hành vi phục hồi, tất cả điều khiển qua action <code>navigate_to_pose</code>.</li>
<li><strong>MoveIt</strong> — lập kế hoạch chuyển động cho cánh tay robot: động học ngược (Chương 4), quỹ đạo không va chạm, gắp vật.</li>
<li><strong>Launch file</strong> — tệp Python/XML/YAML khởi động nhiều node cùng tham số một lúc (<code>ros2 launch ...</code>) thay vì mở mười terminal.</li>
<li><strong>rosbag2</strong> — ghi các topic ra tệp rồi phát lại sau: thử code nhận thức trên dữ liệu thật mà không cần robot.</li>
</ul>
<h3>Quy trình tốt</h3>
<p>1) Mô tả robot (mô hình URDF: khâu, khớp, cảm biến). 2) Hiển thị trong RViz và kiểm cây tf. 3) Mô phỏng trong Gazebo và phát triển node ở đó. 4) Ghi bag từ robot thật và phát lại. 5) Chỉ khi đó mới chạy trên phần cứng, tốc độ thấp, nút dừng khẩn cấp trong tầm tay (Chương 11).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Hai node cùng phát một phép biến đổi (vd cả trình mô phỏng lẫn node của bạn cùng phát odom → base_link) — khung bị “nhảy”.</li><li>Nhầm chiều phép biến đổi (cha → con hay con → cha).</li><li>Dùng độ trong khi ROS cần radian; ROS dùng đơn vị SI (mét, radian, giây).</li><li>Tin hoàn toàn vào mô phỏng: cảm biến thật nhiễu hơn, sàn thật trơn hơn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>tf2 giữ cây khung toạ độ có gắn thời gian và tự nhân các phép biến đổi.</li><li>Chuỗi chuẩn của robot di động: map → odom → base_link → khung cảm biến.</li><li>RViz hiển thị, Gazebo mô phỏng, Nav2 dẫn đường, MoveIt lập chuyển động cánh tay.</li><li>Launch file khởi động cả hệ thống; rosbag2 ghi và phát lại dữ liệu.</li><li>Mô phỏng trước, rồi phần cứng ở tốc độ thấp có nút dừng khẩn cấp.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://github.com/ros2/ros2_documentation/blob/jazzy/source/Concepts/Intermediate/About-Tf2.rst" target="_blank" rel="noopener">Tài liệu chính thức (bản nguồn) — Về tf2</a></li><li><a href="https://github.com/ros-infrastructure/rep/blob/master/rep-0105.rst" target="_blank" rel="noopener">REP 105 — Khung toạ độ cho robot di động (map, odom, base_link)</a></li><li><a href="https://github.com/ros-navigation/navigation2" target="_blank" rel="noopener">Nav2 — Khung dẫn đường ROS 2 (GitHub)</a></li><li><a href="https://moveit.picknik.ai/main/index.html" target="_blank" rel="noopener">Tài liệu MoveIt 2</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Trong ví dụ, đổi hướng robot trong odom từ 90° thành 0°. Vật cản giờ nằm ở đâu trong khung map?</li><li>Dùng công cụ nào để (a) kiểm tra quét laser có khớp với tường trên bản đồ; (b) thử bộ lập đường mới mà không liều robot; (c) cho cánh tay gắp cốc mà tránh cái bàn?</li><li>Vì sao base_link → laser thường là biến đổi tĩnh, còn odom → base_link thì không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Thân ở (3; 1,5) hướng +x; laser ở (3,2; 1,5); vật cản ở (4,7; 1,5). 2) (a) RViz; (b) mô phỏng Gazebo (hoặc phát lại rosbag); (c) MoveIt. 3) Lidar được bắt vít vào robot nên độ lệch không bao giờ đổi; còn vị trí robot trong odom đổi mỗi khi bánh xe quay.</p></div>`);

const q10 = QZ(10, 'Quiz — Chapter 10: ROS 2 fundamentals|||Quiz — Chương 10: Nền tảng ROS 2', 'Kiểm tra chương 10: ROS 2 là gì, node/topic/service/action, rclpy, lệnh ros2, tf2, RViz/Gazebo/Nav2/MoveIt.', [
  Q('q1', 'ROS 2 is best described as|||ROS 2 được mô tả đúng nhất là',
    ['a Linux distribution for robots|||một bản phân phối Linux cho robot', 'open-source middleware, libraries and tools that run on a normal OS|||middleware mã nguồn mở, thư viện và công cụ chạy trên hệ điều hành thường', 'a programming language|||một ngôn ngữ lập trình', 'a robot simulator only|||chỉ là một trình mô phỏng robot'], 1,
    'Despite its name, ROS is middleware on top of an OS such as Ubuntu.|||Dù tên như vậy, ROS là middleware chạy trên hệ điều hành như Ubuntu.'),
  Q('q2', 'ROS 2 communication is built on|||Truyền thông ROS 2 được xây trên',
    ['DDS (Data Distribution Service)|||DDS (Data Distribution Service)', 'HTTP REST|||HTTP REST', 'a central roscore master|||master roscore trung tâm', 'Bluetooth|||Bluetooth'], 0,
    'DDS gives discovery without a master and configurable Quality of Service.|||DDS cho phép tự phát hiện không cần master và QoS cấu hình được.'),
  Q('q3', 'A camera streaming images at 30 Hz should use a|||Camera phát ảnh 30 Hz nên dùng',
    ['service|||service', 'action|||action', 'topic|||topic', 'parameter|||parameter'], 2,
    'Continuous data streams are topics (publish/subscribe).|||Luồng dữ liệu liên tục là topic (publish/subscribe).'),
  Q('q4', '“Drive to the kitchen, report distance remaining, allow cancel” fits a|||“Đi tới nhà bếp, báo quãng đường còn lại, cho phép huỷ” hợp với',
    ['topic|||topic', 'service|||service', 'parameter|||parameter', 'action|||action'], 3,
    'Actions have goal, feedback, result and cancel for long tasks.|||Action có goal, feedback, result và huỷ cho tác vụ dài.'),
  Q('q5', 'In rclpy, which call keeps a node alive so its callbacks run?|||Trong rclpy, lời gọi nào giữ node sống để callback chạy?',
    ['rclpy.init()|||rclpy.init()', 'rclpy.spin(node)|||rclpy.spin(node)', 'node.destroy_node()|||node.destroy_node()', 'create_timer()|||create_timer()'], 1,
    'spin() processes timers and incoming messages until shutdown.|||spin() xử lý timer và message đến cho tới khi tắt.'),
  Q('q6', 'Which command shows topics together with their message types?|||Lệnh nào liệt kê topic kèm kiểu message?',
    ['ros2 node list|||ros2 node list', 'ros2 topic echo|||ros2 topic echo', 'ros2 topic list -t|||ros2 topic list -t', 'rosrun topic list|||rosrun topic list'], 2,
    'The -t flag adds the type; rosrun is a ROS 1 command.|||Cờ -t thêm kiểu; rosrun là lệnh ROS 1.'),
  Q('q7', 'The standard ROS message to command a mobile base velocity is|||Message ROS chuẩn để ra lệnh vận tốc cho đế di động là',
    ['std_msgs/msg/String|||std_msgs/msg/String', 'sensor_msgs/msg/LaserScan|||sensor_msgs/msg/LaserScan', 'geometry_msgs/msg/Twist|||geometry_msgs/msg/Twist', 'sensor_msgs/msg/Image|||sensor_msgs/msg/Image'], 2,
    'Twist holds linear and angular velocity, usually on /cmd_vel.|||Twist chứa vận tốc thẳng và góc, thường trên /cmd_vel.'),
  Q('q8', 'Base at (3, 1.5) facing +y; laser 0.2 m ahead of the base. The laser origin in the map is|||Thân robot ở (3; 1,5) hướng +y; laser ở trước thân 0,2 m. Gốc laser trong map là',
    ['(3.2, 1.5)|||(3,2; 1,5)', '(3, 1.7)|||(3; 1,7)', '(2.8, 1.5)|||(2,8; 1,5)', '(3, 1.3)|||(3; 1,3)'], 1,
    '“Ahead” is +y when the heading is 90°, so add 0.2 to y.|||“Phía trước” là +y khi hướng 90°, nên cộng 0,2 vào y.'),
  Q('q9', 'Which tool plans collision-free motions for a robot arm?|||Công cụ nào lập chuyển động không va chạm cho cánh tay robot?',
    ['RViz|||RViz', 'MoveIt|||MoveIt', 'rosbag2|||rosbag2', 'colcon|||colcon'], 1,
    'MoveIt does IK and motion planning; RViz only visualises.|||MoveIt làm IK và lập chuyển động; RViz chỉ hiển thị.'),
  Q('q10', 'Which ROS 2 distribution is an LTS release supported until May 2029?|||Bản ROS 2 nào là LTS được hỗ trợ tới tháng 5/2029?',
    ['Humble Hawksbill|||Humble Hawksbill', 'Kilted Kaiju|||Kilted Kaiju', 'Jazzy Jalisco|||Jazzy Jalisco', 'Noetic Ninjemys|||Noetic Ninjemys'], 2,
    'Jazzy (May 2024) has 5 years of support; Humble ends 2027; Noetic is ROS 1.|||Jazzy (5/2024) hỗ trợ 5 năm; Humble hết 2027; Noetic là ROS 1.'),
]);

const ch10 = {
  title: 'Chapter 10 — Introduction to ROS 2|||Chương 10 — Nhập môn ROS 2',
  description: 'ROS 2 là gì, đồ thị node/topic/service/action, publisher/subscriber rclpy theo tutorial chính thức (kèm mô phỏng pub/sub Python chạy thật), tf2, RViz, Gazebo, Nav2, MoveIt (tài liệu chính thức ROS 2 Jazzy · REP 105).',
  lessons: [r101, r102, r103, q10],
};


// ───────────────────────────── Chương 11 — Đạo đức & an toàn ─────────────────────────────
const r111 = L('rai101-ts-11-1',
  '11.1 — Robot safety: hazards, standards and risk assessment|||11.1 — An toàn robot: mối nguy, tiêu chuẩn và đánh giá rủi ro',
  'Mối nguy khi làm việc với robot, ba định luật Asimov so với kỹ thuật an toàn thật, ISO 10218 (bản 2025), ISO/TS 15066 cho cobot, 4 chế độ cộng tác, đánh giá rủi ro, dừng khẩn cấp, tính khoảng cách an toàn bằng Python.',
  `<span class="eyebrow">RAI101 · Chapter 11 · Lesson 11.1</span>
<h2>Robot safety: hazards, standards and risk assessment</h2>
<p class="lead">An industrial arm can move faster than a human can react and push with far more force than a body can take. Robot safety is therefore an engineering discipline with standards, calculations and tests — not a matter of “programming the robot to be nice”.</p>
<h3>🎯 Objectives</h3>
<ul><li>List the main hazards of robots and where accidents usually happen.</li><li>Name the key standards: ISO 10218-1/-2 and ISO/TS 15066.</li><li>Describe the four collaborative operation modes.</li><li>Apply a simplified risk assessment and protective-distance calculation.</li></ul>
<h3>📖 Lecture</h3>
<p>Science fiction gave us Asimov's <strong>Three Laws of Robotics</strong> (a robot may not injure a human…). They are a thought experiment, not engineering: a real robot cannot reliably “know” whether an action will harm someone. Real safety comes from <strong>design, guarding, sensing and procedures</strong>.</p>
<p><strong>Typical hazards:</strong> impact and crushing (being hit or pinned against a fixture), trapping between moving parts, unexpected start-up, flying objects (a dropped part, a broken tool), electrical and hydraulic energy, and — for mobile robots — collisions in shared spaces. Many accidents happen <strong>not in normal operation</strong> but during programming, maintenance and troubleshooting, when a person is inside the cell.</p>
<div class="formula"><span class="lbl">Key standards</span><b>ISO 10218-1</b> — safety requirements for industrial robots (the machine)<br><b>ISO 10218-2</b> — robot applications and robot cells (the integration)<br><b>ISO/TS 15066</b> (2016) — collaborative robots (cobots) working near people<br><b>ISO 12100</b> — general principles: risk assessment and risk reduction for machinery</div>
<p>ISO 10218 first appeared in 2011; the current editions were published in <strong>2025</strong>. In Europe they are used as EN ISO 10218 to show compliance with machinery law.</p>
<h3>Collaborative robots: four modes</h3>
<ol><li><strong>Safety-rated monitored stop</strong> — the robot stops while a person is in the shared space and resumes when they leave.</li><li><strong>Hand guiding</strong> — the operator moves the robot by hand through a guiding device.</li><li><strong>Speed and separation monitoring</strong> — sensors measure the distance to people; the robot slows down and stops before contact.</li><li><strong>Power and force limiting</strong> — contact may happen, but force and pressure are limited below thresholds for each body region.</li></ol>
<h3>Risk assessment and the hierarchy of measures</h3>
<p>Following ISO 12100: identify hazards → estimate risk (how severe? how often exposed? can it be avoided?) → reduce risk in this order: <strong>1) inherently safe design</strong> (lower speed, rounded edges, less mass), <strong>2) safeguarding</strong> (fences, light curtains, laser scanners, interlocked doors), <strong>3) information</strong> (warnings, training, procedures). Every robot needs an accessible <strong>emergency stop</strong> — but an e-stop is a backup, not the main safety measure.</p>
<h3>✍️ Worked example — how far must a person stay away?</h3>
<p>Speed and separation monitoring needs a <em>protective separation distance</em>: while the robot reacts and brakes, the person keeps walking. The code below uses a <strong>simplified</strong> version of the idea (the real ISO/TS 15066 formula has more terms, e.g. sensor uncertainty and intrusion distance). A walking speed of 1.6 m/s is a commonly used design value.</p>
<pre><code class="language-python"># Simplified speed &amp; separation monitoring (idea from ISO/TS 15066; NOT the full standard formula)
def protective_distance(v_h, v_r, t_react, t_stop, margin):
    s_h = v_h * (t_react + t_stop)        # the person keeps walking until the robot has stopped
    s_r = v_r * t_react                   # robot still moves at full speed while it reacts
    s_b = v_r * t_stop / 2                # braking with constant deceleration
    return s_h + s_r + s_b + margin

for v_r in [0.25, 0.5, 1.0, 2.0]:
    S = protective_distance(v_h=1.6, v_r=v_r, t_react=0.1, t_stop=0.3, margin=0.1)
    print('robot speed %.2f m/s -&gt; keep at least %.3f m' % (v_r, S))
</code></pre>
<div class="out">robot speed 0.25 m/s -&gt; keep at least 0.803 m
robot speed 0.50 m/s -&gt; keep at least 0.865 m
robot speed 1.00 m/s -&gt; keep at least 0.990 m
robot speed 2.00 m/s -&gt; keep at least 1.240 m</div>
<p>Reading the result: the person's own motion (1.6 × 0.4 = 0.64 m) dominates, so shortening reaction and stopping time matters as much as slowing the robot. Faster robots need bigger zones — which is why cobots run slowly when people are near.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>“It's a cobot, so it is safe.” Safety belongs to the whole <em>application</em>: a cobot holding a knife is not safe.</li><li>Relying only on software checks; safety functions must use safety-rated hardware and controllers.</li><li>Bypassing a door interlock “just for a quick test”.</li><li>Testing new code at full speed on real hardware.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Asimov's laws are fiction; real safety is design + guarding + sensing + procedures.</li><li>ISO 10218-1/-2 (2025 editions) cover robots and robot cells; ISO/TS 15066 covers cobots.</li><li>Four collaborative modes: monitored stop, hand guiding, speed &amp; separation, power &amp; force limiting.</li><li>Risk reduction order: safe design → safeguards → information; e-stop is a backup.</li><li>Protective distance grows with robot speed and with reaction/stopping time.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/ISO_10218" target="_blank" rel="noopener">Wikipedia — ISO 10218 (and ISO/TS 15066)</a></li><li><a href="https://www.osha.gov/robotics/hazards" target="_blank" rel="noopener">OSHA — Robotics: hazard recognition</a></li><li><a href="https://en.wikipedia.org/wiki/Cobot" target="_blank" rel="noopener">Wikipedia — Cobot (collaborative robot)</a></li><li><a href="https://en.wikipedia.org/wiki/Three_Laws_of_Robotics" target="_blank" rel="noopener">Wikipedia — Three Laws of Robotics</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Using the simplified formula, compute the protective distance for v<sub>r</sub> = 1.5 m/s (other values as in the example).</li><li>A cobot packs boxes next to a worker; contact is possible but forces are kept low. Which collaborative mode is this?</li><li>Put in the correct order of preference: warning sign, lower maximum speed, light curtain.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1.6 × 0.4 + 1.5 × 0.1 + 1.5 × 0.3/2 + 0.1 = 0.64 + 0.15 + 0.225 + 0.1 = <b>1.115 m</b>. 2) Power and force limiting. 3) Lower maximum speed (inherently safe design) → light curtain (safeguarding) → warning sign (information).</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 11 · Bài 11.1</span>
<h2>An toàn robot: mối nguy, tiêu chuẩn và đánh giá rủi ro</h2>
<p class="lead">Một cánh tay công nghiệp có thể chuyển động nhanh hơn phản xạ của con người và đẩy với lực lớn hơn nhiều so với sức chịu của cơ thể. Vì thế an toàn robot là một ngành kỹ thuật có tiêu chuẩn, tính toán và kiểm thử — không phải chuyện “lập trình cho robot hiền”.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kể các mối nguy chính của robot và nơi tai nạn thường xảy ra.</li><li>Nêu tên các tiêu chuẩn chính: ISO 10218-1/-2 và ISO/TS 15066.</li><li>Mô tả bốn chế độ vận hành cộng tác.</li><li>Áp dụng đánh giá rủi ro đơn giản và tính khoảng cách bảo vệ.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Khoa học viễn tưởng cho ta <strong>Ba định luật robot</strong> của Asimov (robot không được làm hại con người…). Đó là thí nghiệm tư duy, không phải kỹ thuật: robot thật không thể “biết” chắc một hành động có làm ai bị thương không. An toàn thật đến từ <strong>thiết kế, che chắn, cảm biến và quy trình</strong>.</p>
<p><strong>Mối nguy điển hình:</strong> va đập và đè ép (bị đập hoặc bị kẹp vào đồ gá), kẹt giữa các bộ phận chuyển động, khởi động bất ngờ, vật văng (chi tiết rơi, dụng cụ gãy), năng lượng điện và thuỷ lực, và — với robot di động — va chạm trong không gian chung. Nhiều tai nạn xảy ra <strong>không phải khi vận hành bình thường</strong> mà khi lập trình, bảo trì, xử lý sự cố, lúc có người ở trong khu vực robot.</p>
<div class="formula"><span class="lbl">Tiêu chuẩn chính</span><b>ISO 10218-1</b> — yêu cầu an toàn cho robot công nghiệp (bản thân máy)<br><b>ISO 10218-2</b> — ứng dụng robot và cell robot (phần tích hợp)<br><b>ISO/TS 15066</b> (2016) — robot cộng tác (cobot) làm việc gần người<br><b>ISO 12100</b> — nguyên tắc chung: đánh giá và giảm rủi ro cho máy móc</div>
<p>ISO 10218 ra đời lần đầu năm 2011; các bản hiện hành công bố năm <strong>2025</strong>. Ở châu Âu chúng được dùng dưới tên EN ISO 10218 để chứng minh tuân thủ luật máy móc.</p>
<h3>Robot cộng tác: bốn chế độ</h3>
<ol><li><strong>Dừng có giám sát an toàn</strong> — robot dừng khi có người trong vùng chung và chạy lại khi người rời đi.</li><li><strong>Dẫn hướng bằng tay</strong> — người vận hành cầm thiết bị dẫn hướng và kéo robot đi.</li><li><strong>Giám sát tốc độ và khoảng cách</strong> — cảm biến đo khoảng cách tới người; robot giảm tốc và dừng trước khi chạm.</li><li><strong>Giới hạn công suất và lực</strong> — có thể chạm, nhưng lực và áp suất bị giới hạn dưới ngưỡng cho từng vùng cơ thể.</li></ol>
<h3>Đánh giá rủi ro và thứ bậc biện pháp</h3>
<p>Theo ISO 12100: nhận diện mối nguy → ước lượng rủi ro (nặng cỡ nào? tiếp xúc thường xuyên không? tránh được không?) → giảm rủi ro theo thứ tự: <strong>1) thiết kế an toàn từ gốc</strong> (giảm tốc độ, bo tròn cạnh, giảm khối lượng), <strong>2) bảo vệ</strong> (hàng rào, rèm ánh sáng, máy quét laser, cửa có khoá liên động), <strong>3) thông tin</strong> (cảnh báo, đào tạo, quy trình). Robot nào cũng cần <strong>nút dừng khẩn cấp</strong> dễ với tới — nhưng e-stop là lớp dự phòng, không phải biện pháp an toàn chính.</p>
<h3>✍️ Ví dụ — người phải đứng cách bao xa?</h3>
<p>Giám sát tốc độ và khoảng cách cần một <em>khoảng cách bảo vệ</em>: trong lúc robot phản ứng và phanh, người vẫn tiếp tục bước. Code dưới dùng bản <strong>đơn giản hoá</strong> của ý tưởng này (công thức thật trong ISO/TS 15066 có thêm các số hạng như sai số cảm biến và khoảng xâm nhập). Tốc độ đi bộ 1,6 m/s là giá trị thiết kế hay dùng.</p>
<pre><code class="language-python"># Simplified speed &amp; separation monitoring (idea from ISO/TS 15066; NOT the full standard formula)
def protective_distance(v_h, v_r, t_react, t_stop, margin):
    s_h = v_h * (t_react + t_stop)        # the person keeps walking until the robot has stopped
    s_r = v_r * t_react                   # robot still moves at full speed while it reacts
    s_b = v_r * t_stop / 2                # braking with constant deceleration
    return s_h + s_r + s_b + margin

for v_r in [0.25, 0.5, 1.0, 2.0]:
    S = protective_distance(v_h=1.6, v_r=v_r, t_react=0.1, t_stop=0.3, margin=0.1)
    print('robot speed %.2f m/s -&gt; keep at least %.3f m' % (v_r, S))
</code></pre>
<div class="out">robot speed 0.25 m/s -&gt; keep at least 0.803 m
robot speed 0.50 m/s -&gt; keep at least 0.865 m
robot speed 1.00 m/s -&gt; keep at least 0.990 m
robot speed 2.00 m/s -&gt; keep at least 1.240 m</div>
<p>Đọc kết quả: chuyển động của chính con người (1,6 × 0,4 = 0,64 m) chiếm phần lớn, nên rút ngắn thời gian phản ứng và thời gian dừng quan trọng ngang với giảm tốc robot. Robot nhanh hơn cần vùng an toàn lớn hơn — vì thế cobot chạy chậm khi có người ở gần.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>“Là cobot nên an toàn.” An toàn thuộc về cả <em>ứng dụng</em>: cobot cầm dao thì không an toàn.</li><li>Chỉ dựa vào kiểm tra bằng phần mềm; chức năng an toàn phải dùng phần cứng và bộ điều khiển đạt chuẩn an toàn.</li><li>Vô hiệu hoá khoá liên động cửa “chỉ để thử nhanh”.</li><li>Thử code mới ở tốc độ tối đa trên phần cứng thật.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Định luật Asimov là hư cấu; an toàn thật = thiết kế + che chắn + cảm biến + quy trình.</li><li>ISO 10218-1/-2 (bản 2025) cho robot và cell robot; ISO/TS 15066 cho cobot.</li><li>Bốn chế độ cộng tác: dừng có giám sát, dẫn hướng tay, tốc độ &amp; khoảng cách, giới hạn công suất &amp; lực.</li><li>Thứ tự giảm rủi ro: thiết kế an toàn → bảo vệ → thông tin; e-stop là dự phòng.</li><li>Khoảng cách bảo vệ tăng theo tốc độ robot và thời gian phản ứng/dừng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/ISO_10218" target="_blank" rel="noopener">Wikipedia — ISO 10218 (và ISO/TS 15066)</a></li><li><a href="https://www.osha.gov/robotics/hazards" target="_blank" rel="noopener">OSHA — Robot: nhận diện mối nguy</a></li><li><a href="https://en.wikipedia.org/wiki/Cobot" target="_blank" rel="noopener">Wikipedia — Cobot (robot cộng tác)</a></li><li><a href="https://en.wikipedia.org/wiki/Three_Laws_of_Robotics" target="_blank" rel="noopener">Wikipedia — Ba định luật robot</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Dùng công thức đơn giản hoá, tính khoảng cách bảo vệ khi v<sub>r</sub> = 1,5 m/s (các giá trị khác như ví dụ).</li><li>Một cobot đóng hộp cạnh công nhân; có thể chạm nhưng lực được giữ thấp. Đây là chế độ cộng tác nào?</li><li>Sắp xếp theo thứ tự ưu tiên: biển cảnh báo, giảm tốc độ tối đa, rèm ánh sáng.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1,6 × 0,4 + 1,5 × 0,1 + 1,5 × 0,3/2 + 0,1 = 0,64 + 0,15 + 0,225 + 0,1 = <b>1,115 m</b>. 2) Giới hạn công suất và lực. 3) Giảm tốc độ tối đa (thiết kế an toàn) → rèm ánh sáng (bảo vệ) → biển cảnh báo (thông tin).</p></div>`);

const r112 = L('rai101-ts-11-2',
  '11.2 — AI ethics and regulation: bias, transparency, privacy, accountability|||11.2 — Đạo đức AI và quy định: thiên lệch, minh bạch, riêng tư, trách nhiệm',
  'Các nguyên tắc đạo đức AI (công bằng, minh bạch, riêng tư, trách nhiệm, giám sát của con người), kiểm tra thiên lệch theo nhóm bằng Python, Đạo luật AI của EU (4 mức rủi ro), Khuyến nghị UNESCO 2021, NIST AI RMF.',
  `<span class="eyebrow">RAI101 · Chapter 11 · Lesson 11.2</span>
<h2>AI ethics and regulation: bias, transparency, privacy, accountability</h2>
<p class="lead">An AI system that works “95% of the time” can still fail badly for a specific group of people, leak private data, or make decisions no one can explain. AI ethics turns these worries into concrete principles and checks — and, increasingly, into law.</p>
<h3>🎯 Objectives</h3>
<ul><li>State five core principles of trustworthy AI.</li><li>Detect bias by evaluating performance per group, not only overall.</li><li>Summarise the risk-based approach of the EU AI Act and other frameworks.</li><li>Apply an ethics checklist to a robotics/AI project.</li></ul>
<h3>📖 Lecture</h3>
<p>International frameworks — the <strong>OECD AI Principles</strong> (2019), the <strong>UNESCO Recommendation on the Ethics of AI</strong> (adopted November 2021 by its member states) and the <strong>NIST AI Risk Management Framework</strong> (USA, 2023) — use different words but agree on a core set:</p>
<ul>
<li><strong>Fairness / non-discrimination</strong> — the system should not perform worse or decide unfairly for groups defined by skin colour, gender, age, accent…</li>
<li><strong>Transparency &amp; explainability</strong> — people should know they are dealing with AI and get understandable reasons for decisions that affect them.</li>
<li><strong>Privacy &amp; data protection</strong> — collect only needed data, protect it, respect consent. Robots with cameras and microphones in homes and hospitals are data collectors.</li>
<li><strong>Safety &amp; robustness</strong> — work reliably, including in unusual conditions and under attack.</li>
<li><strong>Accountability &amp; human oversight</strong> — a human or organisation is responsible, and people can intervene or override.</li>
</ul>
<h3>Where does bias come from?</h3>
<p>Mostly from <strong>data</strong>: if a person detector is trained on 90% light-skinned images, it learns that group better. Bias also comes from labels (human annotators' prejudices), from the choice of what to optimise, and from deployment in a context different from training (a model trained in daytime used at night). The <strong>overall</strong> accuracy can hide all of this.</p>
<h3>✍️ Worked example — evaluate per group</h3>
<pre><code class="language-python"># Checking a person-detector for bias: accuracy per group, not only overall
results = {   # group: (correct detections, total test images)
    'light skin': (980, 1000),
    'dark skin':  (170, 200),
}
tot_ok = sum(ok for ok, n in results.values())
tot_n = sum(n for ok, n in results.values())
print('overall accuracy: %.1f %%' % (100 * tot_ok / tot_n))
for g, (ok, n) in results.items():
    print('%-10s: %.1f %%  (missed %d of %d)' % (g, 100 * ok / n, n - ok, n))
</code></pre>
<div class="out">overall accuracy: 95.8 %
light skin: 98.0 %  (missed 20 of 1000)
dark skin : 85.0 %  (missed 30 of 200)</div>
<p>The headline “95.8%” looks good, but the detector misses <b>15%</b> of people in the smaller group versus 2% in the larger one — 7.5 times the miss rate. For a delivery robot that must avoid pedestrians, that is a <em>safety</em> problem, not just a fairness statistic. Fixes: collect more balanced data, report per-group metrics as a release requirement, and set the safety margin by the <em>worst</em> group. (Numbers here are illustrative.)</p>
<h3>Regulation: the EU AI Act</h3>
<p>The <strong>EU Artificial Intelligence Act</strong> (Regulation (EU) 2024/1689) entered into force on <strong>1 August 2024</strong> and applies in phases. It classifies AI by risk:</p>
<div class="formula"><span class="lbl">EU AI Act — risk levels</span><b>Unacceptable</b> → banned (e.g. social scoring, manipulative AI, most real-time remote biometric identification in public)<br><b>High</b> → strict duties: risk management, data quality, documentation, human oversight, conformity assessment (e.g. AI in safety components of machinery, hiring, education, medical devices)<br><b>Limited</b> → transparency (tell users they talk to a chatbot; label deepfakes)<br><b>Minimal</b> → no extra rules (spam filters, game AI)</div>
<p>Bans applied from February 2025 and rules for general-purpose AI models from August 2025; deadlines for high-risk systems were later postponed by an amending regulation. Fines for banned practices can reach 35 million euros or 7% of worldwide turnover. Even outside Europe the Act matters: any product sold in the EU must comply, so global companies design for it.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reporting only overall accuracy.</li><li>“The algorithm decided” — algorithms do not carry responsibility; the people who build and deploy them do.</li><li>Collecting all the data you can “in case it is useful later”.</li><li>Treating ethics as a final checkbox instead of a requirement from the first design meeting.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Core principles: fairness, transparency, privacy, safety/robustness, accountability with human oversight.</li><li>Bias mostly comes from data; always evaluate per group.</li><li>OECD (2019), UNESCO (2021) and NIST AI RMF (2023) give shared guidance.</li><li>The EU AI Act (in force 1 Aug 2024) regulates AI by risk level, from banned to minimal.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.unesco.org/en/artificial-intelligence/recommendation-ethics" target="_blank" rel="noopener">UNESCO — Recommendation on the Ethics of Artificial Intelligence</a></li><li><a href="https://artificialintelligenceact.eu/" target="_blank" rel="noopener">EU Artificial Intelligence Act — text and analyses</a></li><li><a href="https://oecd.ai/en/ai-principles" target="_blank" rel="noopener">OECD.AI — AI Principles</a></li><li><a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">NIST — AI Risk Management Framework</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A face-unlock feature is 99% accurate overall but 90% for users over 60. Which principle is at stake and what would you report before release?</li><li>Classify under the EU AI Act: (a) a game's enemy AI; (b) a chatbot on a shop website; (c) AI that screens job applications.</li><li>A home robot records video all day “to improve the AI”. Name two privacy measures.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Fairness (and accessibility); report accuracy per age group and fix the gap (more data from older users, threshold review). 2) (a) minimal; (b) limited — must disclose it is AI; (c) high-risk (employment). 3) Examples: process on the device and keep only what is needed; ask clear consent and allow turning recording off; blur faces; delete data after a fixed period; encrypt storage.</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 11 · Bài 11.2</span>
<h2>Đạo đức AI và quy định: thiên lệch, minh bạch, riêng tư, trách nhiệm</h2>
<p class="lead">Một hệ AI đúng “95% số lần” vẫn có thể sai nặng với một nhóm người cụ thể, làm lộ dữ liệu riêng tư, hoặc ra quyết định không ai giải thích nổi. Đạo đức AI biến những lo ngại này thành nguyên tắc và phép kiểm cụ thể — và ngày càng thành luật.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nêu năm nguyên tắc cốt lõi của AI đáng tin cậy.</li><li>Phát hiện thiên lệch bằng cách đánh giá hiệu năng theo từng nhóm, không chỉ tổng thể.</li><li>Tóm tắt cách tiếp cận theo rủi ro của Đạo luật AI châu Âu và các khung khác.</li><li>Áp dụng bảng kiểm đạo đức cho một dự án robot/AI.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Các khung quốc tế — <strong>Nguyên tắc AI của OECD</strong> (2019), <strong>Khuyến nghị của UNESCO về Đạo đức AI</strong> (các quốc gia thành viên thông qua tháng 11/2021) và <strong>Khung quản lý rủi ro AI của NIST</strong> (Mỹ, 2023) — dùng từ ngữ khác nhau nhưng thống nhất một bộ lõi:</p>
<ul>
<li><strong>Công bằng / không phân biệt đối xử</strong> — hệ thống không được hoạt động kém hơn hay quyết định bất công với các nhóm theo màu da, giới tính, tuổi, giọng nói…</li>
<li><strong>Minh bạch &amp; giải thích được</strong> — người dùng cần biết mình đang tương tác với AI và nhận được lý do dễ hiểu cho quyết định ảnh hưởng tới họ.</li>
<li><strong>Riêng tư &amp; bảo vệ dữ liệu</strong> — chỉ thu dữ liệu cần thiết, bảo vệ nó, tôn trọng sự đồng ý. Robot có camera và micro trong nhà, bệnh viện chính là máy thu thập dữ liệu.</li>
<li><strong>An toàn &amp; bền vững</strong> — hoạt động tin cậy, kể cả trong điều kiện bất thường và khi bị tấn công.</li>
<li><strong>Trách nhiệm giải trình &amp; giám sát của con người</strong> — có một người hay tổ chức chịu trách nhiệm, và con người có thể can thiệp hoặc ghi đè.</li>
</ul>
<h3>Thiên lệch đến từ đâu?</h3>
<p>Chủ yếu từ <strong>dữ liệu</strong>: nếu bộ phát hiện người được huấn luyện với 90% ảnh người da sáng, nó sẽ học nhóm đó tốt hơn. Thiên lệch còn đến từ nhãn (định kiến của người gán nhãn), từ việc chọn tối ưu cái gì, và từ triển khai ở bối cảnh khác lúc huấn luyện (mô hình học ban ngày đem dùng ban đêm). Độ chính xác <strong>tổng thể</strong> có thể che giấu tất cả những điều này.</p>
<h3>✍️ Ví dụ — đánh giá theo từng nhóm</h3>
<pre><code class="language-python"># Checking a person-detector for bias: accuracy per group, not only overall
results = {   # group: (correct detections, total test images)
    'light skin': (980, 1000),
    'dark skin':  (170, 200),
}
tot_ok = sum(ok for ok, n in results.values())
tot_n = sum(n for ok, n in results.values())
print('overall accuracy: %.1f %%' % (100 * tot_ok / tot_n))
for g, (ok, n) in results.items():
    print('%-10s: %.1f %%  (missed %d of %d)' % (g, 100 * ok / n, n - ok, n))
</code></pre>
<div class="out">overall accuracy: 95.8 %
light skin: 98.0 %  (missed 20 of 1000)
dark skin : 85.0 %  (missed 30 of 200)</div>
<p>Con số “95,8%” trông đẹp, nhưng bộ phát hiện bỏ sót <b>15%</b> người ở nhóm nhỏ so với 2% ở nhóm lớn — tỉ lệ bỏ sót gấp 7,5 lần. Với robot giao hàng phải tránh người đi bộ, đây là vấn đề <em>an toàn</em>, không chỉ là con số công bằng. Cách sửa: thu dữ liệu cân bằng hơn, bắt buộc báo cáo chỉ số theo nhóm trước khi phát hành, và đặt biên an toàn theo nhóm <em>tệ nhất</em>. (Số liệu ở đây là minh hoạ.)</p>
<h3>Quy định: Đạo luật AI của EU</h3>
<p><strong>Đạo luật Trí tuệ nhân tạo của EU</strong> (Quy định (EU) 2024/1689) có hiệu lực từ <strong>1/8/2024</strong> và áp dụng theo từng giai đoạn. Nó phân loại AI theo rủi ro:</p>
<div class="formula"><span class="lbl">Đạo luật AI của EU — các mức rủi ro</span><b>Không chấp nhận được</b> → cấm (vd chấm điểm xã hội, AI thao túng hành vi, phần lớn nhận dạng sinh trắc từ xa thời gian thực nơi công cộng)<br><b>Cao</b> → nghĩa vụ nghiêm ngặt: quản lý rủi ro, chất lượng dữ liệu, hồ sơ kỹ thuật, giám sát của con người, đánh giá sự phù hợp (vd AI trong bộ phận an toàn của máy móc, tuyển dụng, giáo dục, thiết bị y tế)<br><b>Hạn chế</b> → minh bạch (báo người dùng đang nói chuyện với chatbot; gắn nhãn deepfake)<br><b>Tối thiểu</b> → không thêm quy định (lọc thư rác, AI trong game)</div>
<p>Các lệnh cấm áp dụng từ tháng 2/2025 và quy định cho mô hình AI đa dụng từ tháng 8/2025; hạn chót cho hệ thống rủi ro cao sau đó được lùi lại bằng một quy định sửa đổi. Mức phạt với hành vi bị cấm có thể tới 35 triệu euro hoặc 7% doanh thu toàn cầu. Ngay cả ngoài châu Âu, đạo luật vẫn quan trọng: sản phẩm bán vào EU phải tuân thủ, nên các công ty toàn cầu thiết kế theo nó.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ báo cáo độ chính xác tổng thể.</li><li>“Thuật toán quyết định” — thuật toán không gánh trách nhiệm; người xây dựng và triển khai nó mới gánh.</li><li>Thu mọi dữ liệu có thể “phòng khi sau này cần”.</li><li>Coi đạo đức là ô tích cuối cùng thay vì yêu cầu từ buổi thiết kế đầu tiên.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Nguyên tắc cốt lõi: công bằng, minh bạch, riêng tư, an toàn/bền vững, trách nhiệm kèm giám sát của con người.</li><li>Thiên lệch chủ yếu đến từ dữ liệu; luôn đánh giá theo nhóm.</li><li>OECD (2019), UNESCO (2021) và NIST AI RMF (2023) đưa ra định hướng chung.</li><li>Đạo luật AI của EU (hiệu lực 1/8/2024) quản lý AI theo mức rủi ro, từ bị cấm tới tối thiểu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.unesco.org/en/artificial-intelligence/recommendation-ethics" target="_blank" rel="noopener">UNESCO — Khuyến nghị về Đạo đức Trí tuệ nhân tạo</a></li><li><a href="https://artificialintelligenceact.eu/" target="_blank" rel="noopener">Đạo luật AI của EU — văn bản và phân tích</a></li><li><a href="https://oecd.ai/en/ai-principles" target="_blank" rel="noopener">OECD.AI — Nguyên tắc AI</a></li><li><a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">NIST — Khung quản lý rủi ro AI</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính năng mở khoá bằng khuôn mặt đúng 99% tổng thể nhưng chỉ 90% với người trên 60 tuổi. Nguyên tắc nào bị ảnh hưởng và bạn sẽ báo cáo gì trước khi phát hành?</li><li>Phân loại theo Đạo luật AI của EU: (a) AI điều khiển quái trong game; (b) chatbot trên web cửa hàng; (c) AI sàng lọc hồ sơ xin việc.</li><li>Robot gia đình quay video cả ngày “để cải thiện AI”. Nêu hai biện pháp bảo vệ riêng tư.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Công bằng (và khả năng tiếp cận); báo cáo độ chính xác theo nhóm tuổi và khắc phục khoảng cách (thêm dữ liệu người lớn tuổi, xem lại ngưỡng). 2) (a) tối thiểu; (b) hạn chế — phải cho biết đó là AI; (c) rủi ro cao (việc làm). 3) Ví dụ: xử lý ngay trên thiết bị và chỉ giữ thứ cần thiết; xin đồng ý rõ ràng và cho phép tắt ghi hình; làm mờ khuôn mặt; xoá dữ liệu sau thời hạn cố định; mã hoá dữ liệu lưu trữ.</p></div>`);

const r113 = L('rai101-ts-11-3',
  '11.3 — Robots, AI and society; course wrap-up and next steps|||11.3 — Robot, AI và xã hội; tổng kết môn và bước tiếp theo',
  'Tác động của robot và AI tới việc làm, vũ khí tự hành, trách nhiệm khi xe tự lái gây tai nạn, bản đồ toàn môn RAI101, nghề nghiệp trong Robotics & AI và lộ trình học tiếp.',
  `<span class="eyebrow">RAI101 · Chapter 11 · Lesson 11.3</span>
<h2>Robots, AI and society; course wrap-up and next steps</h2>
<p class="lead">Engineers do not only build robots — they decide what robots are for. This last lesson looks at the big societal questions you will meet in your career, then ties the whole course together and points to what to learn next.</p>
<h3>🎯 Objectives</h3>
<ul><li>Discuss the effect of automation on jobs with nuance (tasks vs jobs).</li><li>Explain the debates on autonomous weapons and on responsibility for autonomous systems.</li><li>Connect all chapters of RAI101 in one sense–think–act picture.</li><li>Plan your next courses and projects in Robotics &amp; AI.</li></ul>
<h3>📖 Lecture</h3>
<h3>1. Work and automation</h3>
<p>Robots and AI automate <strong>tasks</strong>, not whole jobs at once. Historically, automation has destroyed some jobs (e.g. many repetitive factory tasks), changed most jobs and created new ones (robot technicians, data annotators, ML engineers). The transition is not painless: workers whose tasks are automated need retraining, and the benefits are not shared automatically. The debate on <em>technological unemployment</em> is old — from the Luddites of the 1810s to today's generative AI — and the honest answer is: impact depends on policy, education and how companies choose to use the technology. For you as an engineer: skills that combine domain knowledge, systems thinking and working with AI are the most durable.</p>
<h3>2. Autonomous weapons</h3>
<p><strong>Lethal autonomous weapon systems</strong> can select and engage targets without a human decision. Many researchers, NGOs and states call for a ban or strict limits, arguing that decisions to kill require human judgement and accountability; discussions continue at the United Nations. Many robotics companies and researchers have publicly pledged not to weaponise general-purpose robots. As an engineer you may one day have to decide what projects you accept.</p>
<h3>3. Who is responsible?</h3>
<p>When a self-driving car or a hospital robot causes harm, responsibility may lie with the manufacturer, the software supplier, the operator, the owner or the person who changed its settings. Good engineering practice supports accountability: <strong>logging</strong> (record sensor data and decisions, like an aircraft black box), clear <strong>operating limits</strong>, <strong>human override</strong> and documented testing. The famous “trolley problem” (whom should a car hit?) gets attention, but most real safety gains come from avoiding dilemmas in the first place: slower speeds, better perception, conservative behaviour.</p>
<h3>✍️ Worked example — an ethics &amp; safety review of a campus delivery robot</h3>
<div class="callout"><p><b>Safety (11.1):</b> max speed 1.2 m/s on shared paths, lidar-based speed and separation monitoring, bumper switches, visible e-stop, test in simulation then at walking speed.</p>
<p><b>Fairness (11.2):</b> person detector evaluated per group (skin tone, wheelchair users, children); worst-group miss rate sets the safety margin.</p>
<p><b>Privacy:</b> cameras used for navigation only; faces blurred on the robot; no recordings kept beyond 24 h except after an incident.</p>
<p><b>Accountability:</b> event log of every stop and near-miss; a named operator on duty; remote stop.</p>
<p><b>Society:</b> does it replace student jobs, or complement them? Consult users before deployment.</p></div>
<h3>4. The course in one picture</h3>
<div class="formula"><span class="lbl">RAI101 — sense → think → act</span><b>Sense:</b> sensors (Ch. 2), images and perception (Ch. 9)<br><b>Represent:</b> frames, rotations, transforms (Ch. 3), kinematics (Ch. 4), localization under uncertainty (Ch. 9)<br><b>Think:</b> agents (Ch. 6), search and path planning (Ch. 7), machine learning (Ch. 8)<br><b>Act:</b> actuators (Ch. 2), feedback and PID control (Ch. 5)<br><b>Integrate:</b> ROS 2 (Ch. 10) · <b>Responsibly:</b> safety and ethics (Ch. 11)</div>
<h3>5. What next?</h3>
<ul><li><strong>Maths:</strong> linear algebra and calculus (vectors, matrices, derivatives) underpin kinematics, control and ML; probability underpins perception and localization.</li><li><strong>Programming:</strong> strong Python, then C++ (most real-time robot code), Linux and Git.</li><li><strong>Projects:</strong> a line-following robot with PID; a TurtleBot simulation in Gazebo with Nav2; an A* planner on your own grid map; a small image classifier.</li><li><strong>Careers:</strong> robotics software engineer, perception/computer-vision engineer, ML engineer, controls engineer, automation/integration engineer, research.</li></ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking ethics is “someone else's job” — engineers make the design choices that create or prevent harm.</li><li>Believing extreme headlines (“robots will take all jobs” or “AI changes nothing”) instead of looking at tasks and evidence.</li><li>Jumping to advanced AI before mastering the basics of sensing, frames and control.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Automation changes tasks first; outcomes for workers depend on policy, training and company choices.</li><li>Autonomous weapons and responsibility for autonomous systems are open, important debates.</li><li>Logging, operating limits and human override make accountability possible.</li><li>RAI101 = sense → represent → think → act, integrated with ROS 2, built responsibly.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Technological_unemployment" target="_blank" rel="noopener">Wikipedia — Technological unemployment</a></li><li><a href="https://en.wikipedia.org/wiki/Lethal_autonomous_weapon" target="_blank" rel="noopener">Wikipedia — Lethal autonomous weapon</a></li><li><a href="https://en.wikipedia.org/wiki/Robot_ethics" target="_blank" rel="noopener">Wikipedia — Robot ethics</a></li><li><a href="https://www.ifr.org/worldrobotics/" target="_blank" rel="noopener">International Federation of Robotics — World Robotics statistics</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Pick a job you know (e.g. warehouse worker, accountant). List two tasks likely to be automated and two that are hard to automate. Why?</li><li>Name three engineering measures that make it possible to find out why an autonomous robot caused an accident.</li><li>Map these to the sense–think–act picture: (a) A* planner; (b) wheel encoder; (c) PID motor controller; (d) camera calibration.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Example (warehouse): automatable — moving shelves, scanning barcodes; hard — handling unusual damaged items, solving problems with customers/colleagues (need dexterity, judgement, communication). 2) Event/data logging (black box), documented operating limits and test records, versioned software with configuration history (also: human override records). 3) (a) think; (b) sense; (c) act; (d) sense/represent (perception).</p></div>`,
  `<span class="eyebrow">RAI101 · Chương 11 · Bài 11.3</span>
<h2>Robot, AI và xã hội; tổng kết môn và bước tiếp theo</h2>
<p class="lead">Kỹ sư không chỉ chế tạo robot — họ quyết định robot dùng vào việc gì. Bài cuối này nhìn vào các câu hỏi xã hội lớn bạn sẽ gặp trong nghề, rồi nối toàn bộ môn học lại và chỉ ra nên học gì tiếp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Bàn về tác động của tự động hoá tới việc làm một cách tỉnh táo (tác vụ khác với nghề).</li><li>Giải thích các tranh luận về vũ khí tự hành và trách nhiệm với hệ thống tự hành.</li><li>Nối mọi chương của RAI101 vào một bức tranh cảm nhận – suy nghĩ – hành động.</li><li>Lên kế hoạch môn học và dự án tiếp theo trong Robotics &amp; AI.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>1. Việc làm và tự động hoá</h3>
<p>Robot và AI tự động hoá <strong>tác vụ</strong>, không phải cả một nghề cùng lúc. Trong lịch sử, tự động hoá đã xoá một số việc (vd nhiều công đoạn lặp lại trong nhà máy), thay đổi phần lớn công việc và tạo ra việc mới (kỹ thuật viên robot, người gán nhãn dữ liệu, kỹ sư ML). Quá trình chuyển đổi không êm ả: người lao động bị tự động hoá tác vụ cần được đào tạo lại, và lợi ích không tự chia đều. Tranh luận về <em>thất nghiệp do công nghệ</em> đã có từ lâu — từ phong trào Luddite những năm 1810 tới AI tạo sinh ngày nay — và câu trả lời trung thực là: tác động tuỳ vào chính sách, giáo dục và cách doanh nghiệp chọn dùng công nghệ. Với bạn là kỹ sư: kỹ năng kết hợp hiểu biết lĩnh vực, tư duy hệ thống và làm việc cùng AI là bền nhất.</p>
<h3>2. Vũ khí tự hành</h3>
<p><strong>Hệ thống vũ khí sát thương tự hành</strong> có thể tự chọn và tấn công mục tiêu mà không cần con người quyết định. Nhiều nhà nghiên cứu, tổ chức phi chính phủ và quốc gia kêu gọi cấm hoặc giới hạn chặt, lập luận rằng quyết định tước mạng sống cần phán đoán và trách nhiệm của con người; các cuộc thảo luận vẫn tiếp diễn ở Liên Hợp Quốc. Nhiều công ty và nhà nghiên cứu robot đã cam kết công khai không vũ khí hoá robot đa dụng. Là kỹ sư, một ngày nào đó bạn có thể phải quyết định nhận hay từ chối dự án nào.</p>
<h3>3. Ai chịu trách nhiệm?</h3>
<p>Khi xe tự lái hay robot bệnh viện gây hại, trách nhiệm có thể thuộc nhà sản xuất, nhà cung cấp phần mềm, người vận hành, chủ sở hữu hoặc người đã đổi cấu hình. Thực hành kỹ thuật tốt hỗ trợ việc truy trách nhiệm: <strong>ghi log</strong> (lưu dữ liệu cảm biến và quyết định, như hộp đen máy bay), <strong>giới hạn vận hành</strong> rõ ràng, <strong>quyền ghi đè của con người</strong> và hồ sơ kiểm thử. “Bài toán xe điện” nổi tiếng (xe nên đâm ai?) được chú ý nhiều, nhưng phần lớn lợi ích an toàn thật đến từ việc tránh rơi vào thế lưỡng nan ngay từ đầu: chạy chậm hơn, nhận thức tốt hơn, hành vi thận trọng.</p>
<h3>✍️ Ví dụ — rà soát đạo đức &amp; an toàn cho robot giao hàng trong khuôn viên trường</h3>
<div class="callout"><p><b>An toàn (11.1):</b> tốc độ tối đa 1,2 m/s trên lối đi chung, giám sát tốc độ và khoảng cách bằng lidar, công tắc cản va, nút dừng khẩn cấp dễ thấy, thử trong mô phỏng rồi ở tốc độ đi bộ.</p>
<p><b>Công bằng (11.2):</b> bộ phát hiện người được đánh giá theo nhóm (màu da, người ngồi xe lăn, trẻ em); tỉ lệ bỏ sót của nhóm tệ nhất quyết định biên an toàn.</p>
<p><b>Riêng tư:</b> camera chỉ dùng để dẫn đường; làm mờ khuôn mặt ngay trên robot; không giữ bản ghi quá 24 giờ trừ khi có sự cố.</p>
<p><b>Trách nhiệm:</b> nhật ký mọi lần dừng và suýt va chạm; có người vận hành trực được nêu tên; dừng từ xa.</p>
<p><b>Xã hội:</b> robot thay thế việc làm thêm của sinh viên hay bổ trợ? Hỏi ý kiến người dùng trước khi triển khai.</p></div>
<h3>4. Cả môn học trong một bức tranh</h3>
<div class="formula"><span class="lbl">RAI101 — cảm nhận → suy nghĩ → hành động</span><b>Cảm nhận:</b> cảm biến (Ch. 2), ảnh và nhận thức (Ch. 9)<br><b>Biểu diễn:</b> khung toạ độ, phép quay, phép biến đổi (Ch. 3), động học (Ch. 4), định vị trong bất định (Ch. 9)<br><b>Suy nghĩ:</b> tác tử (Ch. 6), tìm kiếm và lập đường đi (Ch. 7), học máy (Ch. 8)<br><b>Hành động:</b> cơ cấu chấp hành (Ch. 2), điều khiển phản hồi và PID (Ch. 5)<br><b>Tích hợp:</b> ROS 2 (Ch. 10) · <b>Có trách nhiệm:</b> an toàn và đạo đức (Ch. 11)</div>
<h3>5. Học gì tiếp?</h3>
<ul><li><strong>Toán:</strong> đại số tuyến tính và giải tích (vectơ, ma trận, đạo hàm) là nền của động học, điều khiển và ML; xác suất là nền của nhận thức và định vị.</li><li><strong>Lập trình:</strong> Python vững, rồi C++ (phần lớn code robot thời gian thực), Linux và Git.</li><li><strong>Dự án:</strong> robot dò line dùng PID; mô phỏng TurtleBot trong Gazebo với Nav2; bộ lập đường A* trên bản đồ lưới tự vẽ; một bộ phân loại ảnh nhỏ.</li><li><strong>Nghề nghiệp:</strong> kỹ sư phần mềm robot, kỹ sư nhận thức/thị giác máy, kỹ sư ML, kỹ sư điều khiển, kỹ sư tự động hoá/tích hợp, nghiên cứu.</li></ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ đạo đức là “việc của người khác” — kỹ sư là người đưa ra các lựa chọn thiết kế gây ra hoặc ngăn ngừa tác hại.</li><li>Tin vào tiêu đề cực đoan (“robot sẽ lấy hết việc” hoặc “AI chẳng thay đổi gì”) thay vì nhìn vào tác vụ và bằng chứng.</li><li>Nhảy vào AI nâng cao trước khi vững nền tảng cảm biến, khung toạ độ và điều khiển.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tự động hoá thay đổi tác vụ trước; kết cục cho người lao động tuỳ chính sách, đào tạo và lựa chọn của doanh nghiệp.</li><li>Vũ khí tự hành và trách nhiệm với hệ tự hành là các tranh luận lớn, còn mở.</li><li>Ghi log, giới hạn vận hành và quyền ghi đè của con người giúp truy được trách nhiệm.</li><li>RAI101 = cảm nhận → biểu diễn → suy nghĩ → hành động, tích hợp bằng ROS 2, xây dựng có trách nhiệm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Technological_unemployment" target="_blank" rel="noopener">Wikipedia — Thất nghiệp do công nghệ</a></li><li><a href="https://en.wikipedia.org/wiki/Lethal_autonomous_weapon" target="_blank" rel="noopener">Wikipedia — Vũ khí sát thương tự hành</a></li><li><a href="https://en.wikipedia.org/wiki/Robot_ethics" target="_blank" rel="noopener">Wikipedia — Đạo đức robot</a></li><li><a href="https://www.ifr.org/worldrobotics/" target="_blank" rel="noopener">Liên đoàn Robot Quốc tế (IFR) — Thống kê World Robotics</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chọn một nghề bạn biết (vd nhân viên kho, kế toán). Liệt kê hai tác vụ dễ bị tự động hoá và hai tác vụ khó tự động hoá. Vì sao?</li><li>Nêu ba biện pháp kỹ thuật giúp tìm ra nguyên nhân khi một robot tự hành gây tai nạn.</li><li>Xếp vào bức tranh cảm nhận – suy nghĩ – hành động: (a) bộ lập đường A*; (b) encoder bánh xe; (c) bộ điều khiển PID động cơ; (d) hiệu chuẩn camera.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Ví dụ (kho hàng): dễ tự động hoá — di chuyển kệ, quét mã vạch; khó — xử lý hàng hỏng bất thường, giải quyết vấn đề với khách/đồng nghiệp (cần sự khéo tay, phán đoán, giao tiếp). 2) Ghi log sự kiện/dữ liệu (hộp đen), giới hạn vận hành và hồ sơ kiểm thử được lưu, phần mềm có phiên bản kèm lịch sử cấu hình (thêm: ghi lại các lần con người ghi đè). 3) (a) suy nghĩ; (b) cảm nhận; (c) hành động; (d) cảm nhận/biểu diễn (nhận thức).</p></div>`);

const q11 = QZ(11, 'Quiz — Chapter 11: Safety, ethics and society|||Quiz — Chương 11: An toàn, đạo đức và xã hội', 'Kiểm tra chương 11: tiêu chuẩn an toàn robot, chế độ cộng tác, khoảng cách bảo vệ, thiên lệch AI, Đạo luật AI EU, trách nhiệm và tác động xã hội.', [
  Q('q1', 'Which standard specifically addresses collaborative robots (cobots)?|||Tiêu chuẩn nào dành riêng cho robot cộng tác (cobot)?',
    ['ISO 9001|||ISO 9001', 'ISO/TS 15066|||ISO/TS 15066', 'ISO 27001|||ISO 27001', 'IEEE 802.11|||IEEE 802.11'], 1,
    'ISO/TS 15066 (2016) gives safety requirements for collaborative operation.|||ISO/TS 15066 (2016) nêu yêu cầu an toàn cho vận hành cộng tác.'),
  Q('q2', 'ISO 10218-2 covers|||ISO 10218-2 bao quát',
    ['the robot itself only|||chỉ bản thân robot', 'robot applications and robot cells (integration)|||ứng dụng robot và cell robot (phần tích hợp)', 'AI ethics|||đạo đức AI', 'battery chemistry|||hoá học pin'], 1,
    'Part 1 is the robot; Part 2 is the application/cell.|||Phần 1 là robot; Phần 2 là ứng dụng/cell.'),
  Q('q3', 'A cobot may touch the worker but forces are kept below body-region limits. This mode is|||Cobot có thể chạm công nhân nhưng lực giữ dưới ngưỡng từng vùng cơ thể. Chế độ này là',
    ['safety-rated monitored stop|||dừng có giám sát an toàn', 'hand guiding|||dẫn hướng bằng tay', 'speed and separation monitoring|||giám sát tốc độ và khoảng cách', 'power and force limiting|||giới hạn công suất và lực'], 3,
    'Contact is allowed only with limited force and pressure.|||Chỉ cho chạm khi lực và áp suất bị giới hạn.'),
  Q('q4', 'Correct order of risk reduction (most preferred first):|||Thứ tự giảm rủi ro đúng (ưu tiên nhất trước):',
    ['warning signs → fences → safe design|||biển cảnh báo → hàng rào → thiết kế an toàn', 'safe design → safeguards → information|||thiết kế an toàn → bảo vệ → thông tin', 'e-stop → training → design|||e-stop → đào tạo → thiết kế', 'safeguards → safe design → information|||bảo vệ → thiết kế an toàn → thông tin'], 1,
    'Remove the hazard by design first; information is the last resort.|||Loại bỏ mối nguy bằng thiết kế trước; thông tin là biện pháp cuối.'),
  Q('q5', 'Simplified protective distance with v_h = 1.6 m/s, v_r = 1 m/s, t_react = 0.1 s, t_stop = 0.3 s, margin 0.1 m (S = v_h(t_r + t_s) + v_r·t_r + v_r·t_s/2 + margin):|||Khoảng cách bảo vệ đơn giản với v_h = 1,6 m/s, v_r = 1 m/s, t_react = 0,1 s, t_stop = 0,3 s, biên 0,1 m (S = v_h(t_r + t_s) + v_r·t_r + v_r·t_s/2 + biên):',
    ['0.64 m|||0,64 m', '0.99 m|||0,99 m', '1.24 m|||1,24 m', '0.80 m|||0,80 m'], 1,
    '0.64 + 0.1 + 0.15 + 0.1 = 0.99 m.|||0,64 + 0,1 + 0,15 + 0,1 = 0,99 m.'),
  Q('q6', 'Group A: 980/1000 correct; group B: 170/200 correct. The overall accuracy is|||Nhóm A: đúng 980/1000; nhóm B: đúng 170/200. Độ chính xác tổng thể là',
    ['91.5%|||91,5%', '95.8%|||95,8%', '98.0%|||98,0%', '85.0%|||85,0%'], 1,
    '1150/1200 = 95.8%, which hides group B at 85%.|||1150/1200 = 95,8%, che mất nhóm B chỉ 85%.'),
  Q('q7', 'The main source of bias in most machine-learning systems is|||Nguồn thiên lệch chính trong đa số hệ học máy là',
    ['the CPU|||CPU', 'unbalanced or unrepresentative training data|||dữ liệu huấn luyện mất cân bằng hoặc không đại diện', 'the programming language|||ngôn ngữ lập trình', 'the screen resolution|||độ phân giải màn hình'], 1,
    'Models learn the groups that dominate the data better.|||Mô hình học tốt hơn các nhóm chiếm đa số trong dữ liệu.'),
  Q('q8', 'The EU AI Act entered into force on|||Đạo luật AI của EU có hiệu lực từ',
    ['1 August 2024|||1/8/2024', '1 January 2020|||1/1/2020', '25 May 2018|||25/5/2018', 'it is only a proposal|||nó mới chỉ là dự thảo'], 0,
    'Regulation (EU) 2024/1689 entered into force on 1 Aug 2024 and applies in phases.|||Quy định (EU) 2024/1689 có hiệu lực 1/8/2024 và áp dụng theo giai đoạn.'),
  Q('q9', 'Under the EU AI Act, AI that screens job applications is|||Theo Đạo luật AI của EU, AI sàng lọc hồ sơ xin việc thuộc mức',
    ['minimal risk|||rủi ro tối thiểu', 'limited risk|||rủi ro hạn chế', 'high risk|||rủi ro cao', 'not covered|||không thuộc phạm vi'], 2,
    'Employment is a listed high-risk area with strict duties.|||Việc làm là lĩnh vực rủi ro cao được liệt kê, có nghĩa vụ nghiêm ngặt.'),
  Q('q10', 'Which measure best supports accountability after an autonomous-robot accident?|||Biện pháp nào hỗ trợ truy trách nhiệm tốt nhất sau tai nạn robot tự hành?',
    ['removing all logs to protect privacy|||xoá mọi log để bảo vệ riêng tư', 'event and sensor logging (“black box”)|||ghi log sự kiện và cảm biến (“hộp đen”)', 'making the robot faster|||cho robot chạy nhanh hơn', 'following Asimov’s laws|||tuân theo định luật Asimov'], 1,
    'Logs let investigators reconstruct what the robot sensed and decided.|||Log giúp điều tra dựng lại robot đã cảm nhận và quyết định gì.'),
]);

const ch11 = {
  title: 'Chapter 11 — Safety, ethics and society|||Chương 11 — An toàn, đạo đức và xã hội',
  description: 'An toàn robot (ISO 10218 bản 2025, ISO/TS 15066, đánh giá rủi ro, khoảng cách bảo vệ), đạo đức AI (thiên lệch, minh bạch, riêng tư, trách nhiệm), Đạo luật AI của EU, UNESCO 2021, tác động xã hội và tổng kết môn (AIMA 4e ch. 27 Philosophy, Ethics, and Safety of AI · ch. 28 The Future of AI).',
  lessons: [r111, r112, r113, q11],
};


// ───────────────────────────── Xuất ─────────────────────────────
export default [muc0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11];
