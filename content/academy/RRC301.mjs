/**
 * RRC301 — ROS and Robot Control (ROS và Điều khiển Robot). Ngành Robotics & AI,
 * FPTU, Kỳ 5. Khung chất lượng: 8 chương, mỗi chương = 1 DOCUMENT song ngữ
 * (khái niệm + khối code ROS Python/C++ + giải thích) + 1 QUIZ 3 câu.
 * Nguồn chuẩn: ROS Wiki / ROS 2 docs, Quigley "Programming Robots with ROS",
 * O'Kane "A Gentle Introduction to ROS", Gazebo docs, Siegwart.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ Không backtick/${ lồng trong
 * HTML; "&" trong content HTML viết "&amp;". doc.content .join('\n') → String.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('rrc301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (Quigley, O’Kane, Siegwart), tài liệu chính thức ROS 2/Gazebo, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">RRC301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>ROS (Robot Operating System)</strong> and robot control in one place — nodes &amp; topics, services &amp; actions, TF, simulation, motion control and navigation. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for RRC301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Programming Robots with ROS</em> — Quigley, Gerkey &amp; Smart (O'Reilly) — the practical ROS handbook.</li>
<li><a href="https://www.cse.sc.edu/~jokane/agitr/" target="_blank" rel="noopener"><em>A Gentle Introduction to ROS</em> — Jason O'Kane (free PDF)</a></li>
<li><em>Introduction to Autonomous Mobile Robots</em> — Siegwart, Nourbakhsh &amp; Scaramuzza (MIT Press) — localization, mapping, motion.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.ros.org/en/rolling/" target="_blank" rel="noopener">ROS 2 documentation (docs.ros.org)</a> — tutorials, concepts, API.</li>
<li><a href="https://wiki.ros.org/" target="_blank" rel="noopener">ROS Wiki (ROS 1)</a> — the classic reference.</li>
<li><a href="https://gazebosim.org/docs" target="_blank" rel="noopener">Gazebo simulator docs</a> and <a href="https://navigation.ros.org/" target="_blank" rel="noopener">Nav2 navigation docs</a>.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ArticulatedRobotics" target="_blank" rel="noopener">Articulated Robotics</a> — build a ROS 2 robot from scratch.</li>
<li><a href="https://www.youtube.com/@RoboticsBackEnd" target="_blank" rel="noopener">Robotics Back-End</a> — ROS 2 node, topic, service tutorials.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://docs.ros.org/en/rolling/Installation.html" target="_blank" rel="noopener">ROS 2 (Humble / Jazzy)</a> — the framework itself.</li>
<li><a href="https://gazebosim.org/" target="_blank" rel="noopener">Gazebo</a> — 3D physics simulation; <strong>RViz</strong> — 3D visualization (ships with ROS).</li>
<li><a href="https://www.turtlebot.com/" target="_blank" rel="noopener">TurtleBot</a> — the standard ROS learning robot (real or simulated).</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — install ROS 2, run turtlesim, understand nodes, topics &amp; messages.</li>
<li><strong>Communication</strong> — publisher/subscriber, then services &amp; actions; inspect with the CLI.</li>
<li><strong>Model &amp; simulate</strong> — TF/URDF, spawn a robot in Gazebo, view sensors in RViz.</li>
<li><strong>Control &amp; navigate</strong> — cmd_vel &amp; PID motion, then SLAM and the Nav2 stack, ending in a capstone project.</li>
</ol></div>`,
    `<span class="eyebrow">RRC301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>ROS (Robot Operating System)</strong> và điều khiển robot gom về một chỗ — node &amp; topic, service &amp; action, TF, mô phỏng, điều khiển chuyển động và điều hướng. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của RRC301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Programming Robots with ROS</em> — Quigley, Gerkey &amp; Smart (O'Reilly) — cẩm nang ROS thực hành.</li>
<li><a href="https://www.cse.sc.edu/~jokane/agitr/" target="_blank" rel="noopener"><em>A Gentle Introduction to ROS</em> — Jason O'Kane (PDF miễn phí)</a></li>
<li><em>Introduction to Autonomous Mobile Robots</em> — Siegwart, Nourbakhsh &amp; Scaramuzza (MIT Press) — định vị, lập bản đồ, chuyển động.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.ros.org/en/rolling/" target="_blank" rel="noopener">Tài liệu ROS 2 (docs.ros.org)</a> — hướng dẫn, khái niệm, API.</li>
<li><a href="https://wiki.ros.org/" target="_blank" rel="noopener">ROS Wiki (ROS 1)</a> — tài liệu kinh điển.</li>
<li><a href="https://gazebosim.org/docs" target="_blank" rel="noopener">Tài liệu Gazebo</a> và <a href="https://navigation.ros.org/" target="_blank" rel="noopener">tài liệu điều hướng Nav2</a>.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ArticulatedRobotics" target="_blank" rel="noopener">Articulated Robotics</a> — dựng robot ROS 2 từ đầu.</li>
<li><a href="https://www.youtube.com/@RoboticsBackEnd" target="_blank" rel="noopener">Robotics Back-End</a> — hướng dẫn node, topic, service ROS 2.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://docs.ros.org/en/rolling/Installation.html" target="_blank" rel="noopener">ROS 2 (Humble / Jazzy)</a> — chính bản thân framework.</li>
<li><a href="https://gazebosim.org/" target="_blank" rel="noopener">Gazebo</a> — mô phỏng vật lý 3D; <strong>RViz</strong> — trực quan hoá 3D (đi kèm ROS).</li>
<li><a href="https://www.turtlebot.com/" target="_blank" rel="noopener">TurtleBot</a> — robot học ROS chuẩn (thật hoặc mô phỏng).</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — cài ROS 2, chạy turtlesim, hiểu node, topic &amp; message.</li>
<li><strong>Giao tiếp</strong> — publisher/subscriber, rồi service &amp; action; soi bằng CLI.</li>
<li><strong>Mô hình &amp; mô phỏng</strong> — TF/URDF, thả robot vào Gazebo, xem cảm biến trong RViz.</li>
<li><strong>Điều khiển &amp; điều hướng</strong> — cmd_vel &amp; PID, rồi SLAM và Nav2, kết bằng dự án cuối.</li>
</ol></div>`,
  ]]);

const intro = doc('rrc301-0-1-overview', 'Course overview: ROS &amp; robot control|||Tổng quan: ROS & điều khiển robot',
  'ROS là gì và giải quyết vấn đề gì; lộ trình từ node/topic → service/action → TF/URDF → cảm biến & mô phỏng → điều khiển & định vị → dự án tích hợp.',
  [[
    `<span class="eyebrow">RRC301 · Lesson 0.1 · Overview</span>
<h2>ROS &amp; robot control</h2>
<p class="lead">This course teaches you <strong>how modern robots are programmed</strong> using <strong>ROS — the Robot Operating System</strong>. ROS is not an operating system in the usual sense; it is a <strong>middleware</strong> that lets many small programs on a robot talk to each other, reuse existing drivers and algorithms, and run the same code in simulation or on real hardware.</p>
<h3>Why ROS exists</h3>
<p>A robot needs perception, planning and control running at once. Writing all of that as one monolithic program is brittle. ROS splits the work into independent <strong>nodes</strong> that exchange data over named channels, so a laser driver, a mapping algorithm and a motor controller written by different people can be plugged together.</p>
<h3>Roadmap</h3>
<p>ROS overview &amp; architecture → nodes, topics &amp; messages → services &amp; actions → coordinate frames &amp; TF (URDF) → sensors &amp; simulation (Gazebo, RViz) → motion control (cmd_vel, PID) → localization, SLAM &amp; navigation → a capstone robot-control project. Bilingual, with Python (rclpy) and C++ (rclcpp) code and a quiz per chapter.</p>`,
    `<span class="eyebrow">RRC301 · Bài 0.1 · Tổng quan</span>
<h2>ROS &amp; điều khiển robot</h2>
<p class="lead">Môn này dạy bạn <strong>cách lập trình robot hiện đại</strong> bằng <strong>ROS — Robot Operating System</strong>. ROS không phải hệ điều hành theo nghĩa thường thấy; nó là một lớp <strong>middleware</strong> giúp nhiều chương trình nhỏ trên robot nói chuyện với nhau, dùng lại driver và thuật toán có sẵn, và chạy cùng một đoạn code trong mô phỏng hay trên phần cứng thật.</p>
<h3>Vì sao có ROS</h3>
<p>Một robot cần nhận thức, lập kế hoạch và điều khiển chạy cùng lúc. Viết tất cả thành một chương trình khối là dễ vỡ. ROS chia việc thành các <strong>node</strong> độc lập trao đổi dữ liệu qua các kênh có tên, nhờ vậy driver laser, thuật toán lập bản đồ và bộ điều khiển động cơ do những người khác viết có thể ghép lại với nhau.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; kiến trúc ROS → node, topic &amp; message → service &amp; action → hệ toạ độ &amp; TF (URDF) → cảm biến &amp; mô phỏng (Gazebo, RViz) → điều khiển chuyển động (cmd_vel, PID) → định vị, SLAM &amp; điều hướng → dự án điều khiển robot cuối môn. Song ngữ, có code Python (rclpy) và C++ (rclcpp), mỗi chương một quiz.</p>`,
  ]]);

const c1 = doc('rrc301-1-1-ros-overview', '1.1 — ROS overview &amp; architecture|||1.1 — Tổng quan & kiến trúc ROS',
  'ROS là gì, vì sao dùng; ROS 1 vs ROS 2 (DDS, không còn master); kiến trúc phân tán: node, graph, workspace, package.',
  [[
    `<span class="eyebrow">RRC301 · Chapter 1 · Lesson 1.1</span>
<h2>ROS overview &amp; architecture</h2>
<h3>What ROS is</h3>
<p>ROS is a <strong>set of libraries and tools</strong> for building robot software: a message-passing system, standard message types, drivers, algorithms (SLAM, navigation), and command-line &amp; visualization tools. Programs are organized as a <strong>computation graph</strong> of nodes.</p>
<h3>ROS 1 vs ROS 2</h3>
<ul>
<li><strong>ROS 1</strong> used a central <code>roscore</code> master for discovery — a single point of failure, not real-time, weak security.</li>
<li><strong>ROS 2</strong> replaces it with <strong>DDS</strong> (Data Distribution Service): <em>no master</em>, peer-to-peer discovery, configurable <strong>QoS</strong> (reliability, history), real-time friendly, and multi-platform. New projects use ROS 2.</li>
</ul>
<h3>Key building blocks</h3>
<pre><code>workspace/            # your ROS 2 workspace (colcon build)
  src/
    my_robot_pkg/     # a package = unit of build/share
      package.xml     # metadata + dependencies
      nodes / launch  # executables and launch files
graph:  node --topic--&gt; node   (running programs + channels)
</code></pre>
<div class="callout"><span class="badge">Mental model</span> A running ROS system is a <strong>graph</strong>: circles are nodes (programs), arrows are topics (data streams). You build packages, then run their nodes; the graph is what actually moves data.</div>`,
    `<span class="eyebrow">RRC301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan &amp; kiến trúc ROS</h2>
<h3>ROS là gì</h3>
<p>ROS là một <strong>bộ thư viện và công cụ</strong> để dựng phần mềm robot: hệ truyền tin nhắn, các kiểu message chuẩn, driver, thuật toán (SLAM, điều hướng), cùng công cụ dòng lệnh &amp; trực quan hoá. Chương trình được tổ chức thành một <strong>đồ thị tính toán</strong> gồm các node.</p>
<h3>ROS 1 và ROS 2</h3>
<ul>
<li><strong>ROS 1</strong> dùng master trung tâm <code>roscore</code> để khám phá node — một điểm chết duy nhất, không thời gian thực, bảo mật yếu.</li>
<li><strong>ROS 2</strong> thay bằng <strong>DDS</strong> (Data Distribution Service): <em>không master</em>, khám phá ngang hàng, <strong>QoS</strong> cấu hình được (độ tin cậy, lịch sử), thân thiện thời gian thực, đa nền tảng. Dự án mới dùng ROS 2.</li>
</ul>
<h3>Các khối chính</h3>
<pre><code>workspace/            # workspace ROS 2 (build bang colcon)
  src/
    my_robot_pkg/     # package = don vi build/chia se
      package.xml     # metadata + phu thuoc
      nodes / launch  # file thuc thi va launch
graph:  node --topic--&gt; node   (chuong trinh dang chay + kenh)
</code></pre>
<div class="callout"><span class="badge">Mô hình tư duy</span> Một hệ ROS đang chạy là một <strong>đồ thị</strong>: vòng tròn là node (chương trình), mũi tên là topic (luồng dữ liệu). Bạn build package rồi chạy node của chúng; đồ thị mới là thứ thực sự chuyển dữ liệu.</div>`,
  ]]);

const c1q = quiz('rrc301-quiz-1', 'Quiz 1 — ROS overview|||Quiz 1 — Tổng quan ROS', [
  { id: 'q1', question: 'ROS về bản chất là gì?', options: ['Một hệ điều hành thay Linux', 'Middleware + thư viện/công cụ cho robot', 'Một ngôn ngữ lập trình', 'Một con chip điều khiển'], correctIndex: 1, explanation: 'ROS là middleware truyền tin cùng thư viện, driver, công cụ — chạy trên Linux.' },
  { id: 'q2', question: 'Khác biệt lớn của ROS 2 so với ROS 1?', options: ['Bắt buộc dùng C++', 'Bỏ master, dùng DDS khám phá ngang hàng + QoS', 'Không có message', 'Chỉ chạy mô phỏng'], correctIndex: 1, explanation: 'ROS 2 bỏ roscore master, dùng DDS phân tán, có QoS, hợp thời gian thực.' },
  { id: 'q3', question: 'Một hệ ROS đang chạy được mô tả tốt nhất là?', options: ['Một file duy nhất', 'Đồ thị các node nối bằng topic', 'Một bảng cơ sở dữ liệu', 'Một vòng lặp while'], correctIndex: 1, explanation: 'Computation graph: node (chương trình) nối nhau qua các kênh topic.' },
]);

const c2 = doc('rrc301-2-1-node-topic-message', '2.1 — Nodes, topics &amp; messages|||2.1 — Node, topic & message',
  'Node là gì; topic là kênh có tên; message là kiểu dữ liệu; mô hình publisher/subscriber bất đồng bộ, nhiều-tới-nhiều; CLI rostopic/ros2 topic.',
  [[
    `<span class="eyebrow">RRC301 · Chapter 2 · Lesson 2.1</span>
<h2>Nodes, topics &amp; messages</h2>
<h3>The three core ideas</h3>
<ul>
<li><strong>Node</strong> — one program doing one job (read a sensor, drive a motor).</li>
<li><strong>Topic</strong> — a named channel, e.g. <code>/cmd_vel</code>, carrying a stream of data.</li>
<li><strong>Message</strong> — the typed structure sent on a topic, e.g. <code>geometry_msgs/Twist</code>.</li>
</ul>
<p>A <strong>publisher</strong> writes messages onto a topic; a <strong>subscriber</strong> reads them. It is <em>anonymous</em> and <em>many-to-many</em> — publishers do not know who listens. This decoupling is why ROS parts snap together.</p>
<h3>Publisher (Python / rclpy)</h3>
<pre><code>import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class Talker(Node):
    def __init__(self):
        super().__init__('talker')
        self.pub = self.create_publisher(String, 'chatter', 10)
        self.create_timer(0.5, self.tick)   # 2 Hz

    def tick(self):
        msg = String()
        msg.data = 'hello ROS'
        self.pub.publish(msg)

rclpy.init(); rclpy.spin(Talker())
</code></pre>
<h3>Subscriber (C++ / rclcpp)</h3>
<pre><code>#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

class Listener : public rclcpp::Node {
public:
  Listener() : Node("listener") {
    sub_ = create_subscription&lt;std_msgs::msg::String&gt;(
      "chatter", 10,
      [this](std_msgs::msg::String::SharedPtr m) {
        RCLCPP_INFO(get_logger(), "heard: %s", m-&gt;data.c_str());
      });
  }
private:
  rclcpp::Subscription&lt;std_msgs::msg::String&gt;::SharedPtr sub_;
};
</code></pre>
<div class="callout"><span class="badge">Inspect from the CLI</span> <code>ros2 topic list</code>, <code>ros2 topic echo /chatter</code>, <code>ros2 topic hz /chatter</code> — see the graph without writing a line of code.</div>`,
    `<span class="eyebrow">RRC301 · Chương 2 · Bài 2.1</span>
<h2>Node, topic &amp; message</h2>
<h3>Ba ý cốt lõi</h3>
<ul>
<li><strong>Node</strong> — một chương trình làm một việc (đọc cảm biến, chạy động cơ).</li>
<li><strong>Topic</strong> — kênh có tên, ví dụ <code>/cmd_vel</code>, tải một luồng dữ liệu.</li>
<li><strong>Message</strong> — cấu trúc có kiểu gửi trên topic, ví dụ <code>geometry_msgs/Twist</code>.</li>
</ul>
<p>Một <strong>publisher</strong> ghi message lên topic; một <strong>subscriber</strong> đọc chúng. Mô hình này <em>ẩn danh</em> và <em>nhiều-tới-nhiều</em> — bên phát không biết ai nghe. Chính sự tách rời đó giúp các phần ROS ghép vào nhau.</p>
<h3>Publisher (Python / rclpy)</h3>
<pre><code>import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class Talker(Node):
    def __init__(self):
        super().__init__('talker')
        self.pub = self.create_publisher(String, 'chatter', 10)
        self.create_timer(0.5, self.tick)   # 2 Hz

    def tick(self):
        msg = String()
        msg.data = 'hello ROS'
        self.pub.publish(msg)

rclpy.init(); rclpy.spin(Talker())
</code></pre>
<h3>Subscriber (C++ / rclcpp)</h3>
<pre><code>#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

class Listener : public rclcpp::Node {
public:
  Listener() : Node("listener") {
    sub_ = create_subscription&lt;std_msgs::msg::String&gt;(
      "chatter", 10,
      [this](std_msgs::msg::String::SharedPtr m) {
        RCLCPP_INFO(get_logger(), "heard: %s", m-&gt;data.c_str());
      });
  }
private:
  rclcpp::Subscription&lt;std_msgs::msg::String&gt;::SharedPtr sub_;
};
</code></pre>
<div class="callout"><span class="badge">Soi bằng CLI</span> <code>ros2 topic list</code>, <code>ros2 topic echo /chatter</code>, <code>ros2 topic hz /chatter</code> — thấy đồ thị mà không cần viết dòng code nào.</div>`,
  ]]);

const c2q = quiz('rrc301-quiz-2', 'Quiz 2 — Nodes & topics|||Quiz 2 — Node & topic', [
  { id: 'q1', question: 'Trong mô hình publisher/subscriber, bên phát và bên nhận liên hệ thế nào?', options: ['Publisher gọi trực tiếp subscriber', 'Ẩn danh, nhiều-tới-nhiều qua topic', 'Phải cùng một node', 'Qua cơ sở dữ liệu SQL'], correctIndex: 1, explanation: 'Pub/sub ẩn danh, nhiều-tới-nhiều; publisher không biết ai nghe.' },
  { id: 'q2', question: '"Message" trong ROS là gì?', options: ['Một node', 'Kiểu dữ liệu có cấu trúc gửi trên topic', 'Một file launch', 'Một câu log'], correctIndex: 1, explanation: 'Message là cấu trúc có kiểu, ví dụ geometry_msgs/Twist.' },
  { id: 'q3', question: 'Lệnh nào xem dữ liệu đang chảy trên một topic?', options: ['ros2 run', 'ros2 topic echo /chatter', 'colcon build', 'ros2 node kill'], correctIndex: 1, explanation: 'ros2 topic echo in ra message; topic hz đo tần số.' },
]);

const c3 = doc('rrc301-3-1-service-action', '3.1 — Services &amp; actions|||3.1 — Service & action',
  'Service = gọi request/response đồng bộ; action = mục tiêu chạy lâu, có feedback + huỷ được; khi nào dùng topic vs service vs action.',
  [[
    `<span class="eyebrow">RRC301 · Chapter 3 · Lesson 3.1</span>
<h2>Services &amp; actions</h2>
<h3>Three communication patterns</h3>
<ul>
<li><strong>Topic</strong> — continuous, one-way stream (sensor data). Fire and forget.</li>
<li><strong>Service</strong> — a <em>synchronous</em> request/response call. The client waits for one reply. Good for quick queries and commands (e.g. "reset odometry").</li>
<li><strong>Action</strong> — a <em>long-running</em> goal that streams <strong>feedback</strong>, returns a <strong>result</strong>, and can be <strong>cancelled</strong> (e.g. "navigate to (x, y)"). Asynchronous.</li>
</ul>
<h3>Service server (Python)</h3>
<pre><code>from example_interfaces.srv import AddTwoInts

class AddServer(Node):
    def __init__(self):
        super().__init__('add_server')
        self.create_service(AddTwoInts, 'add', self.cb)

    def cb(self, req, res):
        res.sum = req.a + req.b     # synchronous: fill and return
        return res
</code></pre>
<pre><code># call it from the CLI:
ros2 service call /add example_interfaces/srv/AddTwoInts "{a: 2, b: 3}"
# -&gt; response: sum = 5
</code></pre>
<div class="callout"><span class="badge">How to choose</span> Streaming data → <strong>topic</strong>. A quick answer now → <strong>service</strong>. A task that takes seconds and you want progress + the ability to cancel → <strong>action</strong>.</div>`,
    `<span class="eyebrow">RRC301 · Chương 3 · Bài 3.1</span>
<h2>Service &amp; action</h2>
<h3>Ba kiểu giao tiếp</h3>
<ul>
<li><strong>Topic</strong> — luồng liên tục, một chiều (dữ liệu cảm biến). Gửi rồi quên.</li>
<li><strong>Service</strong> — gọi request/response <em>đồng bộ</em>. Client chờ đúng một câu trả lời. Hợp cho truy vấn/lệnh nhanh (ví dụ "reset odometry").</li>
<li><strong>Action</strong> — một mục tiêu <em>chạy lâu</em>, phát <strong>feedback</strong>, trả <strong>result</strong>, và <strong>huỷ được</strong> (ví dụ "đi tới (x, y)"). Bất đồng bộ.</li>
</ul>
<h3>Service server (Python)</h3>
<pre><code>from example_interfaces.srv import AddTwoInts

class AddServer(Node):
    def __init__(self):
        super().__init__('add_server')
        self.create_service(AddTwoInts, 'add', self.cb)

    def cb(self, req, res):
        res.sum = req.a + req.b     # dong bo: dien roi tra ve
        return res
</code></pre>
<pre><code># goi tu CLI:
ros2 service call /add example_interfaces/srv/AddTwoInts "{a: 2, b: 3}"
# -&gt; phan hoi: sum = 5
</code></pre>
<div class="callout"><span class="badge">Chọn thế nào</span> Dữ liệu chảy liên tục → <strong>topic</strong>. Cần câu trả lời ngay → <strong>service</strong>. Việc mất vài giây, muốn theo dõi tiến độ + huỷ được → <strong>action</strong>.</div>`,
  ]]);

const c3q = quiz('rrc301-quiz-3', 'Quiz 3 — Services & actions|||Quiz 3 — Service & action', [
  { id: 'q1', question: 'Service trong ROS theo mô hình nào?', options: ['Một chiều liên tục', 'Request/response đồng bộ', 'Chỉ gửi không nhận', 'Publish nhiều-tới-nhiều'], correctIndex: 1, explanation: 'Service là gọi đồng bộ: client gửi request, chờ một response.' },
  { id: 'q2', question: 'Việc "đi tới điểm (x, y)" mất vài giây, cần tiến độ và huỷ được nên dùng?', options: ['Topic', 'Service', 'Action', 'Parameter'], correctIndex: 2, explanation: 'Action: mục tiêu chạy lâu, có feedback, result và huỷ được.' },
  { id: 'q3', question: 'Điểm khác của action so với service?', options: ['Action không trả kết quả', 'Action có feedback liên tục và huỷ được', 'Action luôn nhanh hơn', 'Action không cần server'], correctIndex: 1, explanation: 'Action bất đồng bộ, phát feedback định kỳ, trả result, cho phép cancel.' },
]);

const c4 = doc('rrc301-4-1-frames-tf', '4.1 — Coordinate frames &amp; TF|||4.1 — Hệ toạ độ & TF',
  'Vì sao cần nhiều hệ toạ độ (map, odom, base_link, sensor); tf2 cây transform theo thời gian; URDF mô tả khớp/khâu robot.',
  [[
    `<span class="eyebrow">RRC301 · Chapter 4 · Lesson 4.1</span>
<h2>Coordinate frames &amp; TF</h2>
<h3>Why frames?</h3>
<p>A robot has many <strong>coordinate frames</strong>: the world (<code>map</code>), the drifting odometry frame (<code>odom</code>), the robot body (<code>base_link</code>), and each sensor (<code>laser</code>, <code>camera</code>). A laser reports a point in <em>its own</em> frame; to act on it you must know where that sensor is relative to the body and the world.</p>
<h3>tf2 — the transform tree</h3>
<p><strong>tf2</strong> tracks the relationship between all frames <em>over time</em> as a tree, so any node can ask: "where is point P of frame A, expressed in frame B, at time t?" The standard chain is <code>map → odom → base_link → sensor</code>.</p>
<pre><code>from tf2_ros import TransformListener, Buffer

buf = Buffer()
TransformListener(buf, node)
# transform a laser point into the base frame:
t = buf.lookup_transform('base_link', 'laser', rclpy.time.Time())
</code></pre>
<h3>URDF — describing the robot</h3>
<p><strong>URDF</strong> (Unified Robot Description Format) is an XML file of <strong>links</strong> (rigid bodies) connected by <strong>joints</strong>. From it, ROS publishes the fixed part of the TF tree and draws the robot in RViz.</p>
<pre><code>&lt;robot name="bot"&gt;
  &lt;link name="base_link"/&gt;
  &lt;joint name="laser_joint" type="fixed"&gt;
    &lt;parent link="base_link"/&gt;
    &lt;child  link="laser"/&gt;
    &lt;origin xyz="0.1 0 0.2"/&gt;
  &lt;/joint&gt;
&lt;/robot&gt;
</code></pre>
<div class="callout"><span class="badge">One question, any frame</span> The whole point of TF: never hand-code frame maths. Ask tf2 for the transform and let it compose the tree and interpolate in time.</div>`,
    `<span class="eyebrow">RRC301 · Chương 4 · Bài 4.1</span>
<h2>Hệ toạ độ &amp; TF</h2>
<h3>Vì sao cần nhiều hệ?</h3>
<p>Một robot có nhiều <strong>hệ toạ độ</strong>: thế giới (<code>map</code>), hệ odometry bị trôi (<code>odom</code>), thân robot (<code>base_link</code>), và mỗi cảm biến (<code>laser</code>, <code>camera</code>). Laser báo một điểm trong hệ <em>của chính nó</em>; muốn hành động theo điểm đó bạn phải biết cảm biến nằm ở đâu so với thân và so với thế giới.</p>
<h3>tf2 — cây transform</h3>
<p><strong>tf2</strong> theo dõi quan hệ giữa mọi hệ <em>theo thời gian</em> dưới dạng một cây, nên bất kỳ node nào cũng hỏi được: "điểm P của hệ A, biểu diễn trong hệ B, tại thời điểm t, ở đâu?". Chuỗi chuẩn là <code>map → odom → base_link → sensor</code>.</p>
<pre><code>from tf2_ros import TransformListener, Buffer

buf = Buffer()
TransformListener(buf, node)
# doi mot diem laser sang he than robot:
t = buf.lookup_transform('base_link', 'laser', rclpy.time.Time())
</code></pre>
<h3>URDF — mô tả robot</h3>
<p><strong>URDF</strong> (Unified Robot Description Format) là một file XML gồm các <strong>link</strong> (khâu cứng) nối bằng <strong>joint</strong> (khớp). Từ nó, ROS phát phần cố định của cây TF và vẽ robot trong RViz.</p>
<pre><code>&lt;robot name="bot"&gt;
  &lt;link name="base_link"/&gt;
  &lt;joint name="laser_joint" type="fixed"&gt;
    &lt;parent link="base_link"/&gt;
    &lt;child  link="laser"/&gt;
    &lt;origin xyz="0.1 0 0.2"/&gt;
  &lt;/joint&gt;
&lt;/robot&gt;
</code></pre>
<div class="callout"><span class="badge">Một câu hỏi, hệ nào cũng được</span> Cốt lõi của TF: đừng tự viết tay phép toán hệ toạ độ. Hỏi tf2 lấy transform và để nó ghép cây, nội suy theo thời gian.</div>`,
  ]]);

const c4q = quiz('rrc301-quiz-4', 'Quiz 4 — Frames & TF|||Quiz 4 — Hệ toạ độ & TF', [
  { id: 'q1', question: 'Thư viện tf2 dùng để làm gì?', options: ['Vẽ đồ thị node', 'Theo dõi quan hệ giữa các hệ toạ độ theo thời gian', 'Gửi cmd_vel', 'Build package'], correctIndex: 1, explanation: 'tf2 giữ cây transform giữa các frame theo thời gian và tra cứu được.' },
  { id: 'q2', question: 'Chuỗi hệ toạ độ chuẩn của robot di động là?', options: ['laser → camera → wheel', 'map → odom → base_link → sensor', 'base_link → map', 'sensor → map'], correctIndex: 1, explanation: 'map → odom → base_link → sensor là chuỗi TF chuẩn.' },
  { id: 'q3', question: 'File URDF mô tả điều gì?', options: ['Bản đồ môi trường', 'Link (khâu) và joint (khớp) của robot', 'Thuật toán SLAM', 'Lịch chạy node'], correctIndex: 1, explanation: 'URDF là XML gồm link nối bằng joint; ROS dùng để phát TF và vẽ RViz.' },
]);

const c5 = doc('rrc301-5-1-sensors-simulation', '5.1 — Sensors &amp; simulation|||5.1 — Cảm biến & mô phỏng',
  'Cảm biến trong ROS (LaserScan, Image, Imu, Odometry) qua topic; Gazebo mô phỏng vật lý + cảm biến; RViz trực quan hoá dữ liệu, không phải mô phỏng.',
  [[
    `<span class="eyebrow">RRC301 · Chapter 5 · Lesson 5.1</span>
<h2>Sensors &amp; simulation</h2>
<h3>Sensors are just topics</h3>
<p>In ROS every sensor is a node publishing a standard message on a topic — so your code never depends on the exact hardware. Common types:</p>
<ul>
<li><code>sensor_msgs/LaserScan</code> — 2D lidar ranges.</li>
<li><code>sensor_msgs/Image</code> — camera frames.</li>
<li><code>sensor_msgs/Imu</code> — orientation &amp; acceleration.</li>
<li><code>nav_msgs/Odometry</code> — estimated pose &amp; velocity.</li>
</ul>
<h3>Gazebo vs RViz — do not confuse them</h3>
<ul>
<li><strong>Gazebo</strong> is a <em>simulator</em>: it computes physics (gravity, collisions) and <em>generates</em> fake sensor data, so you can test without a real robot.</li>
<li><strong>RViz</strong> is a <em>visualizer</em>: it only <em>displays</em> whatever data already exists on topics (laser points, the robot model, the map). It invents nothing.</li>
</ul>
<pre><code># drive a simulated robot, then watch its laser:
ros2 launch turtlebot3_gazebo empty_world.launch.py
ros2 topic echo /scan          # LaserScan from Gazebo
rviz2                           # add RobotModel + LaserScan displays
</code></pre>
<div class="callout"><span class="badge">Simulate first</span> Because sensors are topics, the exact same control &amp; navigation code runs in Gazebo and on the real robot — you only swap which nodes publish the sensor topics.</div>`,
    `<span class="eyebrow">RRC301 · Chương 5 · Bài 5.1</span>
<h2>Cảm biến &amp; mô phỏng</h2>
<h3>Cảm biến chỉ là topic</h3>
<p>Trong ROS mỗi cảm biến là một node phát một message chuẩn lên topic — nên code của bạn không phụ thuộc phần cứng cụ thể. Các kiểu thường gặp:</p>
<ul>
<li><code>sensor_msgs/LaserScan</code> — dải đo lidar 2D.</li>
<li><code>sensor_msgs/Image</code> — khung hình camera.</li>
<li><code>sensor_msgs/Imu</code> — hướng &amp; gia tốc.</li>
<li><code>nav_msgs/Odometry</code> — ước lượng vị trí &amp; vận tốc.</li>
</ul>
<h3>Gazebo và RViz — đừng nhầm</h3>
<ul>
<li><strong>Gazebo</strong> là <em>bộ mô phỏng</em>: nó tính vật lý (trọng lực, va chạm) và <em>sinh ra</em> dữ liệu cảm biến giả, giúp bạn thử mà không cần robot thật.</li>
<li><strong>RViz</strong> là <em>bộ trực quan hoá</em>: nó chỉ <em>hiển thị</em> dữ liệu đã có sẵn trên topic (điểm laser, mô hình robot, bản đồ). Nó không bịa ra gì.</li>
</ul>
<pre><code># chay robot mo phong roi xem laser:
ros2 launch turtlebot3_gazebo empty_world.launch.py
ros2 topic echo /scan          # LaserScan tu Gazebo
rviz2                           # them display RobotModel + LaserScan
</code></pre>
<div class="callout"><span class="badge">Mô phỏng trước</span> Vì cảm biến là topic, đúng một đoạn code điều khiển &amp; điều hướng chạy được cả trong Gazebo lẫn trên robot thật — bạn chỉ đổi node nào phát topic cảm biến.</div>`,
  ]]);

const c5q = quiz('rrc301-quiz-5', 'Quiz 5 — Sensors & simulation|||Quiz 5 — Cảm biến & mô phỏng', [
  { id: 'q1', question: 'Dữ liệu lidar 2D trong ROS thường có kiểu message nào?', options: ['sensor_msgs/Image', 'sensor_msgs/LaserScan', 'geometry_msgs/Twist', 'std_msgs/String'], correctIndex: 1, explanation: 'LaserScan chứa các tia đo khoảng cách của lidar 2D.' },
  { id: 'q2', question: 'Khác biệt cốt lõi giữa Gazebo và RViz?', options: ['Giống hệt nhau', 'Gazebo mô phỏng vật lý & sinh dữ liệu; RViz chỉ hiển thị', 'RViz mô phỏng, Gazebo hiển thị', 'Cả hai đều là driver phần cứng'], correctIndex: 1, explanation: 'Gazebo là simulator sinh dữ liệu; RViz chỉ trực quan hoá dữ liệu có sẵn.' },
  { id: 'q3', question: 'Vì sao cùng một code chạy được cả mô phỏng lẫn robot thật?', options: ['Vì Gazebo là robot thật', 'Vì cảm biến đều là topic chuẩn, chỉ đổi node phát', 'Vì RViz điều khiển động cơ', 'Vì URDF tự lái robot'], correctIndex: 1, explanation: 'Cảm biến là topic chuẩn → code không phụ thuộc phần cứng, chỉ đổi nguồn phát.' },
]);

const c6 = doc('rrc301-6-1-motion-control', '6.1 — Motion control|||6.1 — Điều khiển chuyển động',
  'Điều khiển tốc độ qua cmd_vel (Twist); mô hình vi sai (differential drive) từ v và ω ra tốc độ hai bánh; vòng điều khiển PID bám giá trị đặt.',
  [[
    `<span class="eyebrow">RRC301 · Chapter 6 · Lesson 6.1</span>
<h2>Motion control</h2>
<h3>cmd_vel — the universal velocity command</h3>
<p>Almost every mobile robot is driven by publishing <code>geometry_msgs/Twist</code> on <code>/cmd_vel</code>: a <strong>linear</strong> velocity (m/s forward) and an <strong>angular</strong> velocity (rad/s turn). The robot base translates that into wheel commands.</p>
<pre><code>from geometry_msgs.msg import Twist
cmd = Twist()
cmd.linear.x  = 0.2    # move forward 0.2 m/s
cmd.angular.z = 0.5    # turn left 0.5 rad/s
pub.publish(cmd)
</code></pre>
<h3>Differential drive</h3>
<p>For a two-wheeled robot, linear <code>v</code> and angular <code>w</code> map to left/right wheel speeds (wheel separation <code>L</code>):</p>
<pre><code>v_left  = v - w * L / 2
v_right = v + w * L / 2
</code></pre>
<h3>PID — closing the loop</h3>
<p>Open-loop commands drift. A <strong>PID controller</strong> corrects the <em>error</em> = target − measured, combining three terms:</p>
<pre><code>error = target - measured
output = Kp*error + Ki*integral(error) + Kd*derivative(error)
# P: react to current error  I: kill steady offset  D: damp overshoot
</code></pre>
<div class="callout"><span class="badge">Feedback beats hoping</span> Publishing a speed does not guarantee it. Measure the real velocity (from odometry) and let PID drive the error to zero.</div>`,
    `<span class="eyebrow">RRC301 · Chương 6 · Bài 6.1</span>
<h2>Điều khiển chuyển động</h2>
<h3>cmd_vel — lệnh vận tốc phổ quát</h3>
<p>Gần như mọi robot di động được điều khiển bằng cách phát <code>geometry_msgs/Twist</code> lên <code>/cmd_vel</code>: một vận tốc <strong>dài (linear)</strong> (m/s tiến) và một vận tốc <strong>góc (angular)</strong> (rad/s xoay). Đế robot chuyển lệnh đó thành lệnh cho bánh.</p>
<pre><code>from geometry_msgs.msg import Twist
cmd = Twist()
cmd.linear.x  = 0.2    # tien 0.2 m/s
cmd.angular.z = 0.5    # re trai 0.5 rad/s
pub.publish(cmd)
</code></pre>
<h3>Truyền động vi sai (differential drive)</h3>
<p>Với robot hai bánh, vận tốc dài <code>v</code> và góc <code>w</code> quy ra tốc độ bánh trái/phải (khoảng cách hai bánh <code>L</code>):</p>
<pre><code>v_left  = v - w * L / 2
v_right = v + w * L / 2
</code></pre>
<h3>PID — khép vòng điều khiển</h3>
<p>Lệnh hở vòng sẽ trôi. Bộ <strong>điều khiển PID</strong> sửa <em>sai số</em> = đặt − đo, kết hợp ba thành phần:</p>
<pre><code>error = target - measured
output = Kp*error + Ki*integral(error) + Kd*derivative(error)
# P: phan ung voi sai so hien tai  I: khu lech tinh  D: dap dao dong
</code></pre>
<div class="callout"><span class="badge">Phản hồi hơn cầu may</span> Phát một tốc độ không bảo đảm đạt tốc độ đó. Hãy đo vận tốc thật (từ odometry) và để PID kéo sai số về 0.</div>`,
  ]]);

const c6q = quiz('rrc301-quiz-6', 'Quiz 6 — Motion control|||Quiz 6 — Điều khiển chuyển động', [
  { id: 'q1', question: 'Message và topic chuẩn để ra lệnh tốc độ cho robot di động?', options: ['LaserScan trên /scan', 'Twist trên /cmd_vel', 'Image trên /camera', 'String trên /chatter'], correctIndex: 1, explanation: 'geometry_msgs/Twist trên /cmd_vel: linear + angular.' },
  { id: 'q2', question: 'Trong truyền động vi sai, xoay tại chỗ đạt được khi?', options: ['Hai bánh cùng tốc độ, cùng chiều', 'Hai bánh ngược chiều nhau', 'Chỉ một bánh có nguồn', 'v và w đều bằng 0'], correctIndex: 1, explanation: 'v=0, w≠0 → v_left = -w·L/2, v_right = +w·L/2: hai bánh ngược chiều.' },
  { id: 'q3', question: 'Thành phần D trong PID có vai trò gì?', options: ['Khử sai số tĩnh', 'Dập vọt lố / dao động', 'Tăng tốc tối đa', 'Đọc cảm biến'], correctIndex: 1, explanation: 'D phản ứng theo tốc độ thay đổi sai số → giảm overshoot; I khử lệch tĩnh.' },
]);

const c7 = doc('rrc301-7-1-localization-slam-nav', '7.1 — Localization, SLAM &amp; navigation|||7.1 — Định vị, SLAM & điều hướng',
  'Định vị (tôi ở đâu trên bản đồ, AMCL); SLAM (vừa lập bản đồ vừa định vị); ngăn xếp điều hướng Nav2: global/local planner, costmap, recovery.',
  [[
    `<span class="eyebrow">RRC301 · Chapter 7 · Lesson 7.1</span>
<h2>Localization, SLAM &amp; navigation</h2>
<h3>Localization — "where am I?"</h3>
<p>Wheel odometry drifts over time. <strong>Localization</strong> corrects it by matching live sensor data to a known map. <strong>AMCL</strong> (Adaptive Monte Carlo Localization) uses a particle filter: many pose guesses, reweighted by how well the laser matches the map, converging on the true pose.</p>
<h3>SLAM — map and locate at once</h3>
<p>When there is <em>no</em> map yet, <strong>SLAM</strong> (Simultaneous Localization And Mapping) builds the map while tracking the robot in it — a chicken-and-egg problem solved by tools like <code>slam_toolbox</code>. Drive the robot around once and it produces an occupancy grid.</p>
<h3>The navigation stack (Nav2)</h3>
<pre><code>goal pose
   -&gt; global planner  : path across the whole map (avoid known walls)
   -&gt; local planner   : short-term velocity, dodging new obstacles
   -&gt; costmaps        : inflate obstacles into "expensive" zones
   -&gt; recovery        : spin / back up when stuck
   =&gt; /cmd_vel        : the velocity the robot finally drives
</code></pre>
<div class="callout"><span class="badge">Two planners, two jobs</span> The <strong>global</strong> planner finds a route on the static map; the <strong>local</strong> planner turns that route into safe cmd_vel while reacting to things the map never knew about.</div>`,
    `<span class="eyebrow">RRC301 · Chương 7 · Bài 7.1</span>
<h2>Định vị, SLAM &amp; điều hướng</h2>
<h3>Định vị — "tôi đang ở đâu?"</h3>
<p>Odometry từ bánh xe trôi dần theo thời gian. <strong>Định vị</strong> sửa nó bằng cách khớp dữ liệu cảm biến hiện thời với một bản đồ đã biết. <strong>AMCL</strong> (Adaptive Monte Carlo Localization) dùng bộ lọc hạt: nhiều phỏng đoán vị trí, được cân lại theo mức khớp của laser với bản đồ, hội tụ về vị trí thật.</p>
<h3>SLAM — vừa lập bản đồ vừa định vị</h3>
<p>Khi <em>chưa</em> có bản đồ, <strong>SLAM</strong> (Simultaneous Localization And Mapping) dựng bản đồ trong lúc bám vị trí robot trong đó — bài toán con gà quả trứng, giải bằng công cụ như <code>slam_toolbox</code>. Lái robot đi một vòng là có một lưới chiếm dụng (occupancy grid).</p>
<h3>Ngăn xếp điều hướng (Nav2)</h3>
<pre><code>vi tri dich (goal)
   -&gt; global planner  : duong di khap ban do (tranh tuong da biet)
   -&gt; local planner   : van toc ngan han, ne vat can moi
   -&gt; costmaps        : phong vat can thanh vung "dat do"
   -&gt; recovery        : xoay / lui khi bi ket
   =&gt; /cmd_vel        : van toc robot cuoi cung chay
</code></pre>
<div class="callout"><span class="badge">Hai planner, hai việc</span> <strong>Global</strong> planner tìm lộ trình trên bản đồ tĩnh; <strong>local</strong> planner biến lộ trình đó thành cmd_vel an toàn trong khi phản ứng với thứ bản đồ chưa từng biết.</div>`,
  ]]);

const c7q = quiz('rrc301-quiz-7', 'Quiz 7 — Localization & navigation|||Quiz 7 — Định vị & điều hướng', [
  { id: 'q1', question: 'AMCL giải quyết vấn đề gì?', options: ['Lập bản đồ mới từ đầu', 'Định vị robot trên một bản đồ đã biết', 'Điều khiển động cơ', 'Nén ảnh camera'], correctIndex: 1, explanation: 'AMCL dùng particle filter để định vị trên bản đồ có sẵn.' },
  { id: 'q2', question: 'SLAM khác định vị (localization) ở chỗ?', options: ['SLAM cần bản đồ có sẵn', 'SLAM vừa lập bản đồ vừa định vị khi chưa có bản đồ', 'SLAM chỉ chạy mô phỏng', 'SLAM không dùng cảm biến'], correctIndex: 1, explanation: 'SLAM dựng bản đồ đồng thời bám vị trí; localization cần bản đồ trước.' },
  { id: 'q3', question: 'Vai trò của local planner trong Nav2?', options: ['Tìm đường trên toàn bản đồ tĩnh', 'Sinh cmd_vel ngắn hạn, né vật cản mới', 'Lưu bản đồ ra file', 'Khởi động DDS'], correctIndex: 1, explanation: 'Local planner biến lộ trình thành vận tốc an toàn, phản ứng vật cản mới.' },
]);

const c8 = doc('rrc301-8-1-project-integration', '8.1 — Project &amp; integration|||8.1 — Dự án & tích hợp',
  'Ghép mọi thứ: node đọc laser (cảm biến) → quyết định → phát cmd_vel (điều khiển); ví dụ tránh vật cản; đóng gói package + launch; kiểm bằng CLI.',
  [[
    `<span class="eyebrow">RRC301 · Chapter 8 · Lesson 8.1</span>
<h2>Project &amp; integration</h2>
<h3>Perceive → decide → act, in one node</h3>
<p>The capstone pattern ties the whole course together: <strong>subscribe</strong> to a sensor topic, <strong>decide</strong>, and <strong>publish</strong> a command. Here is a minimal obstacle-avoider: go forward, but turn when the laser sees a wall ahead.</p>
<pre><code>from sensor_msgs.msg import LaserScan
from geometry_msgs.msg import Twist

class Avoider(Node):
    def __init__(self):
        super().__init__('avoider')
        self.pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self.create_subscription(LaserScan, 'scan', self.on_scan, 10)

    def on_scan(self, scan):
        front = min(scan.ranges[0:15] + scan.ranges[-15:])
        cmd = Twist()
        if front &lt; 0.5:          # obstacle within 0.5 m
            cmd.angular.z = 0.6  # turn away
        else:
            cmd.linear.x = 0.2   # otherwise go forward
        self.pub.publish(cmd)
</code></pre>
<h3>Package it &amp; launch it</h3>
<pre><code>ros2 pkg create my_robot --build-type ament_python
colcon build &amp;&amp; source install/setup.bash
ros2 run my_robot avoider          # run the node
ros2 launch my_robot bringup.launch.py   # or start the whole system
</code></pre>
<div class="callout"><span class="badge">The loop you will reuse forever</span> Every robot behaviour — following, docking, patrolling — is this same perceive-decide-act loop over ROS topics. Build it once, test in Gazebo, deploy on hardware.</div>`,
    `<span class="eyebrow">RRC301 · Chương 8 · Bài 8.1</span>
<h2>Dự án &amp; tích hợp</h2>
<h3>Nhận thức → quyết định → hành động, trong một node</h3>
<p>Mẫu dự án cuối gói cả môn lại: <strong>subscribe</strong> một topic cảm biến, <strong>quyết định</strong>, rồi <strong>publish</strong> một lệnh. Đây là bộ tránh vật cản tối giản: đi thẳng, nhưng rẽ khi laser thấy tường phía trước.</p>
<pre><code>from sensor_msgs.msg import LaserScan
from geometry_msgs.msg import Twist

class Avoider(Node):
    def __init__(self):
        super().__init__('avoider')
        self.pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self.create_subscription(LaserScan, 'scan', self.on_scan, 10)

    def on_scan(self, scan):
        front = min(scan.ranges[0:15] + scan.ranges[-15:])
        cmd = Twist()
        if front &lt; 0.5:          # vat can trong 0.5 m
            cmd.angular.z = 0.6  # re tranh
        else:
            cmd.linear.x = 0.2   # khong thi di thang
        self.pub.publish(cmd)
</code></pre>
<h3>Đóng gói &amp; chạy</h3>
<pre><code>ros2 pkg create my_robot --build-type ament_python
colcon build &amp;&amp; source install/setup.bash
ros2 run my_robot avoider          # chay node
ros2 launch my_robot bringup.launch.py   # hoac khoi dong ca he thong
</code></pre>
<div class="callout"><span class="badge">Vòng lặp bạn sẽ dùng mãi</span> Mọi hành vi robot — bám theo, cập bến, tuần tra — đều là cùng vòng nhận thức-quyết định-hành động này trên các topic ROS. Dựng một lần, thử trong Gazebo, triển khai lên phần cứng.</div>`,
  ]]);

const c8q = quiz('rrc301-quiz-8', 'Quiz 8 — Project & integration|||Quiz 8 — Dự án & tích hợp', [
  { id: 'q1', question: 'Vòng lặp cơ bản của một node điều khiển robot là?', options: ['Build → test → deploy', 'Nhận thức (subscribe) → quyết định → hành động (publish)', 'Map → odom → base_link', 'Kp → Ki → Kd'], correctIndex: 1, explanation: 'Subscribe cảm biến → xử lý/quyết định → publish cmd_vel.' },
  { id: 'q2', question: 'Trong bộ tránh vật cản, node subscribe topic nào và publish topic nào?', options: ['Subscribe /cmd_vel, publish /scan', 'Subscribe /scan, publish /cmd_vel', 'Subscribe /map, publish /tf', 'Subscribe /chatter, publish /add'], correctIndex: 1, explanation: 'Đọc LaserScan trên /scan, ra lệnh Twist trên /cmd_vel.' },
  { id: 'q3', question: 'Lệnh nào build workspace ROS 2 rồi mới chạy được node?', options: ['ros2 topic echo', 'colcon build', 'rviz2', 'ros2 service call'], correctIndex: 1, explanation: 'colcon build biên dịch package; sau đó source install/setup.bash rồi ros2 run.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'RRC301',
    slug: 'rrc301-ros-and-robot-control',
    title: 'ROS and Robot Control',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/RRC301.webp',
    shortDescription: 'ROS (Robot Operating System) & robot control — ROS2 nodes, topics & messages, services & actions, TF & URDF, sensors & simulation (Gazebo/RViz), motion control (cmd_vel, PID), SLAM & navigation, capstone. Python & C++, bilingual.|||ROS (Robot Operating System) & điều khiển robot — node, topic & message ROS2, service & action, TF & URDF, cảm biến & mô phỏng (Gazebo/RViz), điều khiển (cmd_vel, PID), SLAM & điều hướng, dự án. Song ngữ, Python & C++.',
    description: 'Môn <strong>RRC301 — ROS and Robot Control</strong> (Robotics &amp; AI, kỳ 5) dạy <strong>cách lập trình robot bằng ROS</strong>. Từ <strong>kiến trúc ROS</strong> (ROS 1 vs ROS 2, DDS) → <strong>node, topic &amp; message</strong> (publisher/subscriber) → <strong>service &amp; action</strong> → <strong>hệ toạ độ &amp; TF, URDF</strong> → <strong>cảm biến &amp; mô phỏng</strong> (Gazebo, RViz) → <strong>điều khiển chuyển động</strong> (cmd_vel, vi sai, PID) → <strong>định vị, SLAM &amp; điều hướng</strong> (Nav2) → <strong>dự án tích hợp</strong>. Bám giáo trình chuẩn (Quigley, O’Kane, ROS 2 docs, Siegwart), song ngữ, có code Python (rclpy) &amp; C++ (rclcpp), quiz mỗi chương.',
    whatYouLearn: 'Kiến trúc ROS 1/ROS 2 &amp; DDS; node, topic, message; publisher/subscriber (Python &amp; C++); service &amp; action (đồng bộ vs bất đồng bộ); hệ toạ độ &amp; tf2, URDF; cảm biến (LaserScan/Image/Imu/Odometry) &amp; mô phỏng Gazebo, trực quan hoá RViz; điều khiển cmd_vel, mô hình vi sai, vòng PID; định vị AMCL, SLAM, ngăn xếp điều hướng Nav2; xây node điều khiển robot tích hợp cảm biến-điều khiển.',
    requirements: 'Biết lập trình cơ bản (Python và/hoặc C++), quen dòng lệnh Linux. Nên cài ROS 2 (Humble/Jazzy) và Gazebo, hoặc dùng máy ảo/Docker có sẵn ROS.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu ROS 2/Gazebo, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'ROS là gì, giải quyết vấn đề gì, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan ROS|||Chapter 1 — ROS overview', description: 'ROS 1 vs ROS 2, DDS, kiến trúc, graph, package.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Node, topic & message|||Chapter 2 — Nodes, topics & messages', description: 'Publisher/subscriber, message, CLI ros2 topic.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Service & action|||Chapter 3 — Services & actions', description: 'Đồng bộ vs bất đồng bộ, feedback, huỷ.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Hệ toạ độ & TF|||Chapter 4 — Coordinate frames & TF', description: 'tf2 cây transform, URDF link/joint.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Cảm biến & mô phỏng|||Chapter 5 — Sensors & simulation', description: 'Cảm biến qua topic, Gazebo, RViz.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Điều khiển chuyển động|||Chapter 6 — Motion control', description: 'cmd_vel, vi sai, PID.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Định vị & điều hướng|||Chapter 7 — Localization & navigation', description: 'AMCL, SLAM, Nav2, path planning.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Dự án & tích hợp|||Chapter 8 — Project & integration', description: 'Node tránh vật cản, đóng gói package, launch.', lessons: [c8, c8q] },
  ],
};
