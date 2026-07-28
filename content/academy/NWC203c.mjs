/**
 * NWC203c — Computer Networking (Mạng máy tính). Kỳ 2.
 * Dựa trên Coursera Specialization "Computer Communications" (Leon-Garcia) + chương
 * nâng cao. Song ngữ EN/VN realtime (khối .ml-en / .ml-vi, tiêu đề EN|||VI).
 * Sơ đồ .lz-map/.lz-flow/.lz-stack; link MOOC Coursera trong nội dung.
 * Luyện HTTP/mạng → CodeLab rest-apis/linux-bash; công cụ (Wireshark, Packet Tracer) → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/NWC203c.mjs --apply
 */
export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'NWC203c',
    slug: 'computer-networking',
    title: 'Computer Networking',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'How data travels the world: the layered model, error control, LANs & Ethernet, packet switching & routing, IP addressing & subnetting, and TCP — the engineering behind the Internet.|||Dữ liệu đi khắp thế giới ra sao: mô hình phân tầng, kiểm soát lỗi, LAN & Ethernet, chuyển mạch gói & định tuyến, địa chỉ IP & chia mạng con, và TCP — kỹ thuật đằng sau Internet.',
    description: 'Môn mạng máy tính dựa trên bộ Coursera "Computer Communications". Học Internet hoạt động ra sao từ tín hiệu tới ứng dụng: kiến trúc phân tầng, kiểm soát lỗi, LAN, chuyển mạch gói & định tuyến, địa chỉ IP & subnetting, và TCP/IP. Là nền cho SDN302, bảo mật mạng và DevOps.',
    whatYouLearn: 'Kiến trúc mạng phân tầng (OSI/TCP-IP); truyền tin số & kiểm soát lỗi; giao thức data link & LAN/Ethernet; điều khiển truy cập môi trường (MAC); chuyển mạch gói & định tuyến (shortest-path); địa chỉ IP, subnet mask & phân cấp; TCP three-way handshake & điều khiển luồng.',
    requirements: 'Không có môn tiên quyết. Cần tài khoản Coursera (đăng ký qua lớp) và một máy tính có Internet để học các MOOC.',
    documentsNote: 'Bộ MOOC Coursera "Computer Communications" (4 khoá, dựa trên Leon-Garcia "Communication Networks"). Công cụ: Wireshark, Cisco Packet Tracer, lệnh ping/traceroute. Kèm file syllabus gốc NWC203c.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, học trên Coursera ra sao, điều kiện qua môn và lộ trình.',
      lessons: [
        {
          title: '0.1 — About NWC203c & the course map|||0.1 — Giới thiệu NWC203c & bản đồ môn học',
          slug: 'nwc203c-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Mạng máy tính học gì, học trên Coursera thế nào, và bản đồ toàn bộ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About NWC203c — Computer Networking</h2>
<p class="lead">CSI104 gave you one lesson on networks; NWC203c is the full engineering story of <strong>how the Internet actually works</strong>. From electrical signals on a wire, up through error control, local networks, routing, IP addressing and TCP — you will understand every layer that carries your data across the world.</p>
<p>The course is delivered as a <strong>Coursera specialization</strong> (Computer Communications, 4 MOOCs). You study the videos online, then sit theory and practical exams. This Academy course is your bilingual companion — it structures and summarizes each concept so the layered model finally clicks.</p>
<h3>Course map — from signals to the Internet</h3>
<div class="lz-map">
  <div class="lz-stage">The framework</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Fundamentals &amp; Layered Architecture</div><div class="lz-nsub">Networks · services · OSI / TCP-IP</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Digital Communication &amp; Error Control</div><div class="lz-nsub">Signals · detecting &amp; fixing errors</div></div></div>
  <div class="lz-stage">Local networks</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Data Link &amp; LANs</div><div class="lz-nsub">Reliable delivery · MAC · Ethernet</div></div></div>
  <div class="lz-stage">Across networks</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Packet Switching &amp; Routing</div><div class="lz-nsub">Shortest-path · congestion</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">IP &amp; Addressing</div><div class="lz-nsub">IP addresses · subnet masks</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">TCP &amp; Transport</div><div class="lz-nsub">Handshake · flow control</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">The application layer &amp; a request&#39;s full journey</div><div class="lz-nsub">DNS · HTTP · seeing packets for real</div></div></div>
</div>
<p>NWC203c builds on <span class="badge">CSI104</span> and <span class="badge">OSG202</span>, and prepares you for <span class="badge">SDN302</span> (network programming), network security and cloud/DevOps. Understanding the network layers is essential for any backend or systems role.</p>
<div class="callout ok">Networking is layered — and the secret to mastering it is to always know <strong>which layer you are at</strong>. Is this about wires (physical), a local network (data link), routing (network), reliability (transport), or an app (application)? Keep the stack in mind and everything falls into place.</div>
<a class="link-card exphub" href="/exp-hub/nwc203c-cong-cu-hoc-tap?ref=%2Fcourses%2Fcomputer-networking%2Flearn&reflabel=NWC203c%20%E2%80%94%20Computer%20Networking" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Tools for NWC203c — Wireshark, Packet Tracer, ping</span><span class="lc-sub">See real network packets &amp; simulate networks — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu NWC203c — Mạng máy tính</h2>
<p class="lead">CSI104 cho bạn một bài về mạng; NWC203c là câu chuyện kỹ thuật đầy đủ về <strong>Internet thực sự hoạt động ra sao</strong>. Từ tín hiệu điện trên dây, lên qua kiểm soát lỗi, mạng cục bộ, định tuyến, địa chỉ IP và TCP — bạn sẽ hiểu mọi tầng mang dữ liệu của bạn đi khắp thế giới.</p>
<p>Môn được dạy dưới dạng một <strong>bộ chuyên đề Coursera</strong> (Computer Communications, 4 MOOC). Bạn học video online, rồi thi lý thuyết và thực hành. Khóa Academy này là bạn đồng hành song ngữ — sắp xếp và tóm tắt từng khái niệm để mô hình phân tầng cuối cùng "thấm".</p>
<h3>Bản đồ môn học — từ tín hiệu tới Internet</h3>
<div class="lz-map">
  <div class="lz-stage">Khung sườn</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Cơ bản &amp; Kiến trúc phân tầng</div><div class="lz-nsub">Mạng · dịch vụ · OSI / TCP-IP</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Truyền tin số &amp; Kiểm soát lỗi</div><div class="lz-nsub">Tín hiệu · phát hiện &amp; sửa lỗi</div></div></div>
  <div class="lz-stage">Mạng cục bộ</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Data Link &amp; LAN</div><div class="lz-nsub">Giao tin cậy · MAC · Ethernet</div></div></div>
  <div class="lz-stage">Xuyên các mạng</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Chuyển mạch gói &amp; Định tuyến</div><div class="lz-nsub">Đường ngắn nhất · tắc nghẽn</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">IP &amp; Địa chỉ</div><div class="lz-nsub">Địa chỉ IP · subnet mask</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">TCP &amp; Giao vận</div><div class="lz-nsub">Bắt tay · điều khiển luồng</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Tầng ứng dụng &amp; hành trình đầy đủ của một yêu cầu</div><div class="lz-nsub">DNS · HTTP · thấy gói tin thật</div></div></div>
</div>
<p>NWC203c xây trên <span class="badge">CSI104</span> và <span class="badge">OSG202</span>, và chuẩn bị cho <span class="badge">SDN302</span> (lập trình mạng), bảo mật mạng và cloud/DevOps. Hiểu các tầng mạng là thiết yếu cho mọi vị trí backend hay hệ thống.</p>
<div class="callout ok">Mạng có tính phân tầng — và bí quyết làm chủ là luôn biết <strong>bạn đang ở tầng nào</strong>. Cái này về dây (vật lý), mạng cục bộ (data link), định tuyến (mạng), độ tin cậy (giao vận), hay một app (ứng dụng)? Giữ ngăn xếp trong đầu và mọi thứ vào đúng chỗ.</div>
<a class="link-card exphub" href="/exp-hub/nwc203c-cong-cu-hoc-tap?ref=%2Fcourses%2Fcomputer-networking%2Flearn&reflabel=NWC203c%20%E2%80%94%20Computer%20Networking" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Công cụ NWC203c — Wireshark, Packet Tracer, ping</span><span class="lc-sub">Thấy gói tin mạng thật &amp; mô phỏng mạng — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — How the course is graded|||0.2 — Cách tính điểm & qua môn',
          slug: 'nwc203c-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'MOOC, điểm thưởng, thi lý thuyết & thực hành và điều kiện qua môn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>How NWC203c is graded</h2>
<p class="lead">Like SSL101c, this is a Coursera-based course. The grade is 100% exams — but completing the MOOCs on time earns a bonus and is required to sit the exam.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Time</span><span class="v">150h <small>50h online + offline + exams + 94h self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">None</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when Final Result ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam gate</span><span class="v">Complete the MOOC certification to be allowed to take the Final Exam</span></div>
</div>
<h3>Grade structure</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Theory Exam (TE)</td><td>50%</td><td>60 min, 50 computer-graded questions</td></tr>
    <tr><td>Practical Exam (PE)</td><td>50%</td><td>120 min, hands-on networking tasks</td></tr>
  </tbody>
</table>
<div class="callout warn">Three conditions to pass: <strong>TE ≥ 4</strong> AND <strong>PE ≥ 4</strong> AND <strong>Final Result ≥ 5</strong>, where FR = min(10, (TE + PE)/2 + bonus). Completing every MOOC on time gives +1 bonus point and is required to even sit the exam — do not leave the courses to the last week.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cách tính điểm NWC203c</h2>
<p class="lead">Như SSL101c, đây là môn dựa trên Coursera. Điểm 100% là thi — nhưng hoàn thành MOOC đúng hạn kiếm điểm thưởng và là bắt buộc để được dự thi.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Thời lượng</span><span class="v">150h <small>50h online + offline + thi + 94h tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Không</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi Kết quả cuối ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện thi</span><span class="v">Hoàn thành chứng chỉ MOOC mới được dự Thi cuối kỳ</span></div>
</div>
<h3>Cấu trúc điểm</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Thi lý thuyết (TE)</td><td>50%</td><td>60 phút, 50 câu chấm máy</td></tr>
    <tr><td>Thi thực hành (PE)</td><td>50%</td><td>120 phút, bài mạng thực hành</td></tr>
  </tbody>
</table>
<div class="callout warn">Ba điều kiện để qua: <strong>TE ≥ 4</strong> VÀ <strong>PE ≥ 4</strong> VÀ <strong>Kết quả cuối ≥ 5</strong>, với FR = min(10, (TE + PE)/2 + bonus). Hoàn thành mọi MOOC đúng hạn cho +1 điểm thưởng và là bắt buộc để được dự thi — đừng để các khoá tới tuần cuối.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning outcomes (8 CLOs)|||0.3 — Chuẩn đầu ra (8 CLO)',
          slug: 'nwc203c-chuan-dau-ra',
          type: 'VIDEO',
          description: '8 kỹ năng nhà trường cam kết bạn làm được — checklist ôn thi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The 8 Course Learning Outcomes (CLOs)</h2>
<p class="lead">The CLOs walk up the network stack layer by layer. They map onto the chapters — your exam checklist.</p>
<table>
  <thead><tr><th>#</th><th>You will be able to…</th><th>Covered in</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Trace network evolution &amp; layered architecture</td><td>Chapter 1</td></tr>
    <tr><td>CLO2</td><td>Explain digital communication &amp; error control</td><td>Chapter 2</td></tr>
    <tr><td>CLO3</td><td>Describe peer-to-peer protocols &amp; LANs</td><td>Chapter 3</td></tr>
    <tr><td>CLO4</td><td>Describe medium access control (MAC)</td><td>Chapter 3</td></tr>
    <tr><td>CLO5</td><td>Describe packet networks &amp; their services</td><td>Chapter 4</td></tr>
    <tr><td>CLO6</td><td>Describe addressing, routing &amp; congestion control</td><td>Chapters 4–5</td></tr>
    <tr><td>CLO7</td><td>Explain how IP connects networks; IP hierarchy</td><td>Chapter 5</td></tr>
    <tr><td>CLO8</td><td>Explain address prefixes/masks &amp; the TCP handshake</td><td>Chapters 5–6</td></tr>
  </tbody>
</table>
<div class="note-ct">The Practical Exam tests real skills (subnetting, tools), so the concepts must become hands-on. Use Packet Tracer and Wireshark (tools guide) to turn each CLO into something you can actually do.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>8 Chuẩn đầu ra môn học (CLO)</h2>
<p class="lead">Các CLO đi lên ngăn xếp mạng từng tầng. Chúng khớp với các chương — checklist ôn thi của bạn.</p>
<table>
  <thead><tr><th>#</th><th>Bạn sẽ làm được…</th><th>Học ở</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Lần theo sự tiến hoá mạng &amp; kiến trúc phân tầng</td><td>Chương 1</td></tr>
    <tr><td>CLO2</td><td>Giải thích truyền tin số &amp; kiểm soát lỗi</td><td>Chương 2</td></tr>
    <tr><td>CLO3</td><td>Mô tả giao thức peer-to-peer &amp; LAN</td><td>Chương 3</td></tr>
    <tr><td>CLO4</td><td>Mô tả điều khiển truy cập môi trường (MAC)</td><td>Chương 3</td></tr>
    <tr><td>CLO5</td><td>Mô tả mạng chuyển gói &amp; dịch vụ của chúng</td><td>Chương 4</td></tr>
    <tr><td>CLO6</td><td>Mô tả đánh địa chỉ, định tuyến &amp; điều khiển tắc nghẽn</td><td>Chương 4–5</td></tr>
    <tr><td>CLO7</td><td>Giải thích IP nối các mạng ra sao; phân cấp IP</td><td>Chương 5</td></tr>
    <tr><td>CLO8</td><td>Giải thích tiền tố/mask địa chỉ &amp; bắt tay TCP</td><td>Chương 5–6</td></tr>
  </tbody>
</table>
<div class="note-ct">Thi thực hành kiểm kỹ năng thật (subnetting, công cụ), nên các khái niệm phải trở nên thực hành. Dùng Packet Tracer và Wireshark (guide công cụ) để biến mỗi CLO thành thứ bạn làm được.</div>
</div>
`,
        },
        {
          title: '0.4 — How to enroll & study on Coursera|||0.4 — Cách đăng ký & học trên Coursera',
          slug: 'nwc203c-tai-lieu',
          type: 'VIDEO',
          description: 'Bốn MOOC của bộ Computer Communications và cách học mạng hiệu quả.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Getting set up &amp; studying well</h2>
<h3>The Coursera specialization</h3>
<p>The content lives in the <strong>Computer Communications</strong> specialization on Coursera (based on Leon-Garcia&#39;s classic textbook). Enroll promptly and complete all four MOOCs:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">MOOC 1 — Fundamentals of Network Communication</div><div class="lz-ld">Networks, services, the layered model.</div></div>
  <div class="lz-layer"><div class="lz-lt">MOOC 2 — Peer-to-Peer Protocols &amp; LANs</div><div class="lz-ld">Reliable data link, error control, medium access, Ethernet.</div></div>
  <div class="lz-layer"><div class="lz-lt">MOOC 3 — Packet Switching Networks &amp; Algorithms</div><div class="lz-ld">Routing, shortest-path, congestion.</div></div>
  <div class="lz-layer"><div class="lz-lt">MOOC 4 — TCP/IP Advanced</div><div class="lz-ld">IP addressing, masks, TCP handshake &amp; flow control.</div></div>
</div>
<h3>How to study networking</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Layer</div><div class="lz-t">know where you are</div><div class="lz-d">which of the 5 layers?</div></div>
  <div class="lz-step"><div class="lz-k">Trace</div><div class="lz-t">follow the packet</div><div class="lz-d">down the stack &amp; up</div></div>
  <div class="lz-step"><div class="lz-k">See it</div><div class="lz-t">use Wireshark</div><div class="lz-d">watch real packets</div></div>
  <div class="lz-step"><div class="lz-k">Practice</div><div class="lz-t">subnetting by hand</div><div class="lz-d">for the practical exam</div></div>
</div>
<div class="callout ok">Two things make networking click: always identifying the layer, and seeing packets for real with Wireshark. Read about TCP&#39;s handshake, then capture one and watch the SYN, SYN-ACK, ACK actually happen. Abstract becomes concrete.</div>
<a class="link-card exphub" href="/exp-hub/nwc203c-cong-cu-hoc-tap?ref=%2Fcourses%2Fcomputer-networking%2Flearn&reflabel=NWC203c%20%E2%80%94%20Computer%20Networking" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Wireshark, Packet Tracer &amp; the MOOCs</span><span class="lc-sub">Set-up links and study tools for NWC203c.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cài đặt &amp; học sao cho tốt</h2>
<h3>Bộ chuyên đề Coursera</h3>
<p>Nội dung nằm trong bộ chuyên đề <strong>Computer Communications</strong> trên Coursera (dựa trên giáo trình kinh điển của Leon-Garcia). Đăng ký sớm và hoàn thành cả bốn MOOC:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">MOOC 1 — Fundamentals of Network Communication</div><div class="lz-ld">Mạng, dịch vụ, mô hình phân tầng.</div></div>
  <div class="lz-layer"><div class="lz-lt">MOOC 2 — Peer-to-Peer Protocols &amp; LANs</div><div class="lz-ld">Data link tin cậy, kiểm soát lỗi, truy cập môi trường, Ethernet.</div></div>
  <div class="lz-layer"><div class="lz-lt">MOOC 3 — Packet Switching Networks &amp; Algorithms</div><div class="lz-ld">Định tuyến, đường ngắn nhất, tắc nghẽn.</div></div>
  <div class="lz-layer"><div class="lz-lt">MOOC 4 — TCP/IP Advanced</div><div class="lz-ld">Địa chỉ IP, mask, bắt tay TCP &amp; điều khiển luồng.</div></div>
</div>
<h3>Cách học mạng</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Tầng</div><div class="lz-t">biết bạn ở đâu</div><div class="lz-d">tầng nào trong 5 tầng?</div></div>
  <div class="lz-step"><div class="lz-k">Lần theo</div><div class="lz-t">đi theo gói tin</div><div class="lz-d">xuống ngăn xếp &amp; lên</div></div>
  <div class="lz-step"><div class="lz-k">Thấy nó</div><div class="lz-t">dùng Wireshark</div><div class="lz-d">xem gói tin thật</div></div>
  <div class="lz-step"><div class="lz-k">Luyện</div><div class="lz-t">subnetting bằng tay</div><div class="lz-d">cho thi thực hành</div></div>
</div>
<div class="callout ok">Hai điều làm mạng "thấm": luôn xác định tầng, và thấy gói tin thật bằng Wireshark. Đọc về bắt tay TCP, rồi bắt một cái và xem SYN, SYN-ACK, ACK thực sự diễn ra. Trừu tượng thành cụ thể.</div>
<a class="link-card exphub" href="/exp-hub/nwc203c-cong-cu-hoc-tap?ref=%2Fcourses%2Fcomputer-networking%2Flearn&reflabel=NWC203c%20%E2%80%94%20Computer%20Networking" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Wireshark, Packet Tracer &amp; các MOOC</span><span class="lc-sub">Link cài đặt và công cụ học cho NWC203c.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — CƠ BẢN & KIẾN TRÚC PHÂN TẦNG ══════════════════ */
    {
      title: 'Chapter 1 — Fundamentals & Layered Architecture|||Chương 1 — Cơ bản & Kiến trúc phân tầng',
      description: 'Mạng, dịch vụ và mô hình phân tầng OSI / TCP-IP.',
      lessons: [
        {
          title: '1.1 — Networks, services & the layered model|||1.1 — Mạng, dịch vụ & mô hình phân tầng',
          slug: 'nwc203c-1-1-phan-tang',
          simulation: {
            scenario: 'osi-layers',
            caption: { en: '12 bytes of data, 66 bytes on the wire — the headers in between', vi: '12 byte dữ liệu, 66 byte trên dây — phần tiêu đề ở giữa' },
          },
          type: 'VIDEO',
          description: 'Vì sao mạng chia thành các tầng và mỗi tầng làm gì.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Taming complexity with layers</h2>
<p class="lead">Sending data across the world is enormously complex. Networking (CLO1) tames it with <strong>layering</strong>: split the job into a stack of layers, each solving one problem and talking only to the layers directly above and below.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">5 · Application</div><div class="lz-ld">The apps: HTTP (web), SMTP (email), DNS. Messages a program understands.</div></div>
  <div class="lz-layer"><div class="lz-lt">4 · Transport (TCP / UDP)</div><div class="lz-ld">End-to-end delivery: reliable &amp; ordered (TCP) or fast (UDP). Uses port numbers.</div></div>
  <div class="lz-layer"><div class="lz-lt">3 · Network (IP)</div><div class="lz-ld">Addresses &amp; routes packets across networks, hop by hop.</div></div>
  <div class="lz-layer"><div class="lz-lt">2 · Data Link</div><div class="lz-ld">Reliable transfer between neighboring devices; MAC addresses, framing, error control.</div></div>
  <div class="lz-layer"><div class="lz-lt">1 · Physical</div><div class="lz-ld">The actual signals on the wire/fiber/radio — bits as voltage or light.</div></div>
</div>
<h3>OSI vs TCP/IP</h3>
<p>The <strong>OSI model</strong> has 7 layers (a teaching reference); the practical <strong>TCP/IP model</strong> collapses them into ~5. The idea is the same: separation of concerns, so each layer can change without breaking the others.</p>
<h3>Encapsulation</h3>
<p>As data goes <strong>down</strong> the stack at the sender, each layer wraps it in its own header. At the receiver it travels <strong>up</strong>, each layer peeling its header off. Like nested envelopes.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Send</div><div class="lz-t">data goes DOWN</div><div class="lz-d">each layer adds a header</div></div>
  <div class="lz-step"><div class="lz-k">Wire</div><div class="lz-t">bits travel</div><div class="lz-d">across the physical medium</div></div>
  <div class="lz-step"><div class="lz-k">Receive</div><div class="lz-t">data goes UP</div><div class="lz-d">each layer removes its header</div></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The hourglass model.</b> The Internet stack is shaped like an hourglass: many applications on top, many physical technologies at the bottom, but a single narrow waist in the middle — <em>IP</em>. Everything runs over IP and IP runs over everything, which is exactly why any app works over Wi-Fi, fibre or 5G without being rewritten. <em>Courses teach the 5 layers as equals; in practice the IP waist is what lets the whole thing scale.</em></div>
<div class="note-ct">This is the master framework of the whole course. Every later topic — error control, MAC, routing, IP, TCP — is "which layer solves which problem." Keep the stack in your head and each chapter has a home.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/fundamentals-network-communications" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 1 — Fundamentals of Network Communication</span><span class="lc-sub">The official Coursera course.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Thuần hoá độ phức tạp bằng các tầng</h2>
<p class="lead">Gửi dữ liệu đi khắp thế giới cực kỳ phức tạp. Mạng (CLO1) thuần hoá nó bằng <strong>phân tầng (layering)</strong>: chia công việc thành một ngăn xếp các tầng, mỗi tầng giải một vấn đề và chỉ nói chuyện với tầng ngay trên và ngay dưới.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">5 · Ứng dụng (Application)</div><div class="lz-ld">Các app: HTTP (web), SMTP (email), DNS. Thông điệp chương trình hiểu.</div></div>
  <div class="lz-layer"><div class="lz-lt">4 · Giao vận (Transport — TCP / UDP)</div><div class="lz-ld">Giao đầu-cuối: tin cậy &amp; đúng thứ tự (TCP) hoặc nhanh (UDP). Dùng số cổng (port).</div></div>
  <div class="lz-layer"><div class="lz-lt">3 · Mạng (Network — IP)</div><div class="lz-ld">Đánh địa chỉ &amp; định tuyến gói qua các mạng, từng chặng.</div></div>
  <div class="lz-layer"><div class="lz-lt">2 · Liên kết dữ liệu (Data Link)</div><div class="lz-ld">Truyền tin cậy giữa thiết bị kề nhau; địa chỉ MAC, đóng khung, kiểm soát lỗi.</div></div>
  <div class="lz-layer"><div class="lz-lt">1 · Vật lý (Physical)</div><div class="lz-ld">Tín hiệu thực trên dây/cáp quang/sóng — bit dưới dạng điện áp hoặc ánh sáng.</div></div>
</div>
<h3>OSI vs TCP/IP</h3>
<p><strong>Mô hình OSI</strong> có 7 tầng (tham chiếu dạy học); <strong>mô hình TCP/IP</strong> thực tế gộp lại còn ~5. Ý tưởng như nhau: tách mối quan tâm, để mỗi tầng đổi được mà không phá tầng khác.</p>
<h3>Đóng gói (encapsulation)</h3>
<p>Khi dữ liệu đi <strong>xuống</strong> ngăn xếp ở bên gửi, mỗi tầng bọc nó bằng phần đầu (header) riêng. Ở bên nhận nó đi <strong>lên</strong>, mỗi tầng bóc header của mình. Như các phong bì lồng nhau.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Gửi</div><div class="lz-t">dữ liệu đi XUỐNG</div><div class="lz-d">mỗi tầng thêm một header</div></div>
  <div class="lz-step"><div class="lz-k">Dây</div><div class="lz-t">bit truyền đi</div><div class="lz-d">qua môi trường vật lý</div></div>
  <div class="lz-step"><div class="lz-k">Nhận</div><div class="lz-t">dữ liệu đi LÊN</div><div class="lz-d">mỗi tầng bóc header của mình</div></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mô hình đồng hồ cát.</b> Ngăn xếp Internet có hình đồng hồ cát: rất nhiều ứng dụng ở trên, rất nhiều công nghệ vật lý ở dưới, nhưng chỉ một "eo" hẹp duy nhất ở giữa — <em>IP</em>. Mọi thứ chạy trên IP và IP chạy trên mọi thứ, đúng là lý do mọi app chạy được qua Wi-Fi, cáp quang hay 5G mà không phải viết lại. <em>Giáo trình dạy 5 tầng ngang nhau; thực tế chính eo IP mới là thứ giúp cả hệ mở rộng.</em></div>
<div class="note-ct">Đây là khung sườn chủ của cả môn. Mọi chủ đề sau — kiểm soát lỗi, MAC, định tuyến, IP, TCP — là "tầng nào giải vấn đề nào." Giữ ngăn xếp trong đầu và mỗi chương có chỗ đứng.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/fundamentals-network-communications" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 1 — Fundamentals of Network Communication</span><span class="lc-sub">Khoá chính chủ trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 1 Quiz|||Quiz chương 1',
          slug: 'nwc203c-quiz-ch1',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: phân tầng, 5 tầng TCP/IP, OSI, đóng gói.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Why is networking built in layers?|||Vì sao mạng được xây theo tầng?', options: ['to make it slower|||để chậm hơn', 'to split complexity so each layer solves one problem|||để chia độ phức tạp, mỗi tầng giải một vấn đề', 'to use more cables|||để dùng nhiều cáp hơn', 'for no reason|||không lý do'], correctIndex: 1, points: 1 },
              { question: 'Which layer handles addressing and routing across networks?|||Tầng nào lo đánh địa chỉ và định tuyến qua các mạng?', options: ['Physical|||Vật lý', 'Data Link|||Liên kết dữ liệu', 'Network (IP)', 'Application|||Ứng dụng'], correctIndex: 2, points: 1 },
              { question: 'The OSI model has how many layers?|||Mô hình OSI có bao nhiêu tầng?', options: ['4', '5', '7', '10'], correctIndex: 2, points: 1 },
              { question: 'Encapsulation means each layer, going down, …|||Đóng gói nghĩa là mỗi tầng, đi xuống, …', options: ['removes a header|||bóc một header', 'adds its own header|||thêm header riêng', 'deletes the data|||xoá dữ liệu', 'skips the next layer|||bỏ tầng kế'], correctIndex: 1, points: 1 },
              { question: 'Reliable, ordered end-to-end delivery is the job of which layer?|||Giao đầu-cuối tin cậy, đúng thứ tự là việc của tầng nào?', options: ['Physical|||Vật lý', 'Transport (TCP)', 'Data Link|||Liên kết dữ liệu', 'Application|||Ứng dụng'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — TRUYỀN TIN SỐ & KIỂM SOÁT LỖI ══════════════════ */
    {
      title: 'Chapter 2 — Digital Communication & Error Control|||Chương 2 — Truyền tin số & Kiểm soát lỗi',
      description: 'Tín hiệu số và cách phát hiện, sửa lỗi khi truyền.',
      lessons: [
        {
          title: '2.1 — Signals & error control|||2.1 — Tín hiệu & kiểm soát lỗi',
          slug: 'nwc203c-2-1-kiem-soat-loi',
          type: 'VIDEO',
          description: 'Bit thành tín hiệu, và parity/checksum/CRC phát hiện lỗi ra sao.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Sending bits reliably over a noisy channel</h2>
<p class="lead">At the physical layer, bits become <strong>signals</strong> — voltages, light pulses or radio waves. Real channels are noisy, so bits sometimes flip. <strong>Error control</strong> (CLO2) detects and even corrects these errors, using redundant bits (the same idea as CEA201&#39;s memory ECC).</p>
<h3>Detecting errors</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Parity bit</div><div class="lz-ld">One extra bit makes the total number of 1s even/odd. Detects any single-bit error.</div></div>
  <div class="lz-layer"><div class="lz-lt">Checksum</div><div class="lz-ld">Add up the data and send the sum; the receiver recomputes and compares.</div></div>
  <div class="lz-layer"><div class="lz-lt">CRC (Cyclic Redundancy Check)</div><div class="lz-ld">A polynomial-division code that catches almost all burst errors — used in Ethernet frames.</div></div>
</div>
<h3>Correcting errors — two strategies</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Detect + resend</div><div class="lz-t">ARQ</div><div class="lz-d">ask the sender to retransmit</div></div>
  <div class="lz-step"><div class="lz-k">Correct in place</div><div class="lz-t">FEC / Hamming</div><div class="lz-d">enough redundancy to fix it</div></div>
</div>
<p><strong>ARQ (Automatic Repeat reQuest)</strong> detects an error and asks for a resend — simple, used when a return channel exists. <strong>Forward Error Correction</strong> adds enough redundant bits to fix errors without resending — used when resending is costly (e.g. satellite).</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Hamming distance decides detect vs correct.</b> A code whose valid codewords differ by a minimum Hamming distance d can <em>detect</em> up to d−1 flipped bits, but only <em>correct</em> up to ⌊(d−1)/2⌋. Example: a plain parity bit gives d=2, so it detects one bad bit and corrects none; a code with d=3 corrects one bit or detects two. <em>The syllabus lists parity/CRC/FEC as separate tricks; this one formula tells you what any of them can actually do.</em></div>
<div class="note-ct">Error control is the reason a file downloads perfectly even over a flaky Wi-Fi connection: the network detects corrupted pieces and re-sends them. This same redundancy idea appears in memory (ECC), storage (RAID) and QR codes — trade a few extra bits for reliability.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Gửi bit tin cậy qua kênh nhiễu</h2>
<p class="lead">Ở tầng vật lý, bit thành <strong>tín hiệu</strong> — điện áp, xung ánh sáng hoặc sóng radio. Kênh thật có nhiễu, nên bit thi thoảng bị lật. <strong>Kiểm soát lỗi</strong> (CLO2) phát hiện và thậm chí sửa các lỗi này, dùng bit dư (cùng ý tưởng ECC bộ nhớ ở CEA201).</p>
<h3>Phát hiện lỗi</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Bit chẵn lẻ (parity)</div><div class="lz-ld">Một bit thêm làm tổng số bit 1 thành chẵn/lẻ. Phát hiện mọi lỗi một bit.</div></div>
  <div class="lz-layer"><div class="lz-lt">Checksum</div><div class="lz-ld">Cộng dữ liệu và gửi tổng; bên nhận tính lại và so sánh.</div></div>
  <div class="lz-layer"><div class="lz-lt">CRC (Kiểm dư vòng)</div><div class="lz-ld">Một mã chia đa thức bắt gần như mọi lỗi chùm — dùng trong khung Ethernet.</div></div>
</div>
<h3>Sửa lỗi — hai chiến lược</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Phát hiện + gửi lại</div><div class="lz-t">ARQ</div><div class="lz-d">yêu cầu bên gửi truyền lại</div></div>
  <div class="lz-step"><div class="lz-k">Sửa tại chỗ</div><div class="lz-t">FEC / Hamming</div><div class="lz-d">đủ dư để sửa</div></div>
</div>
<p><strong>ARQ (Yêu cầu lặp tự động)</strong> phát hiện lỗi và yêu cầu gửi lại — đơn giản, dùng khi có kênh phản hồi. <strong>Sửa lỗi tiến (FEC)</strong> thêm đủ bit dư để sửa lỗi mà không gửi lại — dùng khi gửi lại tốn kém (vd vệ tinh).</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khoảng cách Hamming quyết định phát hiện hay sửa.</b> Một mã mà các từ mã hợp lệ cách nhau khoảng cách Hamming tối thiểu d thì <em>phát hiện</em> được tới d−1 bit lật, nhưng chỉ <em>sửa</em> được tới ⌊(d−1)/2⌋. Ví dụ: một bit parity thường cho d=2, nên phát hiện một bit hỏng và sửa được 0; mã có d=3 sửa một bit hoặc phát hiện hai bit. <em>Giáo trình liệt kê parity/CRC/FEC như các mẹo riêng lẻ; một công thức này mới cho biết mỗi cái thực sự làm được gì.</em></div>
<div class="note-ct">Kiểm soát lỗi là lý do một tệp tải hoàn hảo kể cả qua Wi-Fi chập chờn: mạng phát hiện mảnh hỏng và gửi lại. Cùng ý tưởng dư này xuất hiện ở bộ nhớ (ECC), lưu trữ (RAID) và mã QR — đổi vài bit thêm lấy độ tin cậy.</div>
</div>
`,
        },
        {
          title: 'Chapter 2 Quiz|||Quiz chương 2',
          slug: 'nwc203c-quiz-ch2',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: tín hiệu, parity/checksum/CRC, ARQ vs FEC.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Error control uses… to detect/fix errors.|||Kiểm soát lỗi dùng… để phát hiện/sửa lỗi.', options: ['faster CPUs|||CPU nhanh hơn', 'redundant (extra) bits|||các bit dư (thêm)', 'more cables|||nhiều cáp hơn', 'encryption only|||chỉ mã hoá'], correctIndex: 1, points: 1 },
              { question: 'CRC is used in Ethernet frames to…|||CRC dùng trong khung Ethernet để…', options: ['encrypt data|||mã hoá dữ liệu', 'detect transmission errors|||phát hiện lỗi truyền', 'route packets|||định tuyến gói', 'assign IP addresses|||gán địa chỉ IP'], correctIndex: 1, points: 1 },
              { question: 'ARQ handles errors by…|||ARQ xử lý lỗi bằng cách…', options: ['correcting them in place|||sửa tại chỗ', 'detecting and requesting a resend|||phát hiện và yêu cầu gửi lại', 'ignoring them|||bỏ qua', 'dropping the connection|||ngắt kết nối'], correctIndex: 1, points: 1 },
              { question: 'Forward Error Correction (FEC) is preferred when…|||Sửa lỗi tiến (FEC) được ưu tiên khi…', options: ['resending is cheap|||gửi lại rẻ', 'resending is costly (e.g. satellite)|||gửi lại tốn kém (vd vệ tinh)', 'there are no errors|||không có lỗi', 'the network is a LAN|||mạng là LAN'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — DATA LINK & LAN ══════════════════ */
    {
      title: 'Chapter 3 — Data Link & LANs|||Chương 3 — Data Link & LAN',
      description: 'Giao tin cậy giữa thiết bị kề nhau, MAC và Ethernet.',
      lessons: [
        {
          title: '3.1 — Reliable data link & medium access|||3.1 — Data link tin cậy & truy cập môi trường',
          slug: 'nwc203c-3-1-data-link-mac',
          type: 'VIDEO',
          description: 'Đóng khung, sliding window, và cách chia sẻ một môi trường chung (MAC).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Getting data reliably to the next device</h2>
<p class="lead">The data link layer (CLO3) delivers frames reliably between two directly-connected devices. It handles <strong>framing</strong> (marking where each frame starts/ends), error control, and flow control so a fast sender does not overwhelm a slow receiver.</p>
<h3>Sliding window &amp; flow control</h3>
<p>Instead of sending one frame and waiting (slow), a sender can have several frames "in flight" using a <strong>sliding window</strong> protocol, acknowledging as they arrive. This keeps the link busy and efficient.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Stop-and-wait</div><div class="lz-t">1 frame, then wait</div><div class="lz-d">simple but slow</div></div>
  <div class="lz-step"><div class="lz-k">Sliding window</div><div class="lz-t">several in flight</div><div class="lz-d">high throughput</div></div>
</div>
<h3>Medium access control (MAC)</h3>
<p>On a shared medium (like classic Ethernet or Wi-Fi), many devices want to transmit on the same channel (CLO4). A <strong>MAC protocol</strong> coordinates access so they do not talk over each other.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">CSMA/CD (classic Ethernet)</div><div class="lz-ld">"Listen before you talk"; if two collide, back off and retry after a random time.</div></div>
  <div class="lz-layer"><div class="lz-lt">MAC address</div><div class="lz-ld">A unique 48-bit hardware address burned into each network card — how devices are identified on a LAN.</div></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why Wi-Fi uses CSMA/CA, not CSMA/CD.</b> Wired Ethernet detects collisions (CD) because a card can listen while it transmits. On radio a sender cannot hear a distant collision (the "hidden terminal" problem), so Wi-Fi instead <em>avoids</em> collisions (CA): it waits a random backoff and can reserve the channel with RTS/CTS before sending. <em>The syllabus teaches CSMA/CD on classic Ethernet; the wireless world you actually use flipped it to collision avoidance.</em></div>
<div class="note-ct">A LAN <strong>switch</strong> learns which MAC address is on which port and forwards frames only where needed — smarter than the old shared-cable hubs. This is the local-network foundation beneath the IP routing of the next chapter.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/peer-to-peer-protocols-local-area-networks" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 2 — Peer-to-Peer Protocols &amp; LANs</span><span class="lc-sub">The official Coursera course.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Đưa dữ liệu tin cậy tới thiết bị kế</h2>
<p class="lead">Tầng data link (CLO3) giao khung (frame) tin cậy giữa hai thiết bị nối trực tiếp. Nó lo <strong>đóng khung (framing)</strong> (đánh dấu khung bắt đầu/kết thúc ở đâu), kiểm soát lỗi, và điều khiển luồng để bên gửi nhanh không làm ngợp bên nhận chậm.</p>
<h3>Sliding window &amp; điều khiển luồng</h3>
<p>Thay vì gửi một khung rồi chờ (chậm), bên gửi có thể có nhiều khung "đang bay" bằng giao thức <strong>sliding window (cửa sổ trượt)</strong>, xác nhận khi chúng tới. Điều này giữ liên kết bận và hiệu quả.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Stop-and-wait</div><div class="lz-t">1 khung, rồi chờ</div><div class="lz-d">đơn giản nhưng chậm</div></div>
  <div class="lz-step"><div class="lz-k">Sliding window</div><div class="lz-t">nhiều khung đang bay</div><div class="lz-d">thông lượng cao</div></div>
</div>
<h3>Điều khiển truy cập môi trường (MAC)</h3>
<p>Trên môi trường dùng chung (như Ethernet cổ điển hay Wi-Fi), nhiều thiết bị muốn truyền trên cùng một kênh (CLO4). Một <strong>giao thức MAC</strong> điều phối truy cập để chúng không nói đè lên nhau.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">CSMA/CD (Ethernet cổ điển)</div><div class="lz-ld">"Nghe trước khi nói"; nếu hai cái va chạm, lùi lại và thử lại sau một khoảng thời gian ngẫu nhiên.</div></div>
  <div class="lz-layer"><div class="lz-lt">Địa chỉ MAC</div><div class="lz-ld">Một địa chỉ phần cứng 48-bit duy nhất khắc vào mỗi card mạng — cách thiết bị được định danh trên LAN.</div></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao Wi-Fi dùng CSMA/CA chứ không CSMA/CD.</b> Ethernet có dây phát hiện va chạm (CD) vì card vừa truyền vừa nghe được. Trên sóng radio bên gửi không nghe được va chạm ở xa (vấn đề "trạm ẩn"), nên Wi-Fi <em>tránh</em> va chạm (CA): chờ một khoảng lùi ngẫu nhiên và có thể đặt trước kênh bằng RTS/CTS trước khi gửi. <em>Giáo trình dạy CSMA/CD trên Ethernet cổ điển; thế giới không dây bạn đang dùng đã lật sang tránh va chạm.</em></div>
<div class="note-ct">Một <strong>switch</strong> LAN học địa chỉ MAC nào ở cổng nào và chỉ chuyển khung tới nơi cần — thông minh hơn hub dùng chung cáp cũ. Đây là nền mạng cục bộ bên dưới định tuyến IP ở chương kế.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/peer-to-peer-protocols-local-area-networks" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 2 — Peer-to-Peer Protocols &amp; LANs</span><span class="lc-sub">Khoá chính chủ trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 3 Quiz|||Quiz chương 3',
          slug: 'nwc203c-quiz-ch3',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: framing, sliding window, CSMA/CD, MAC, switch.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The data link layer delivers frames between…|||Tầng data link giao khung giữa…', options: ['distant servers|||các máy chủ xa', 'two directly-connected devices|||hai thiết bị nối trực tiếp', 'applications|||các ứng dụng', 'continents|||các châu lục'], correctIndex: 1, points: 1 },
              { question: 'A sliding window protocol improves on stop-and-wait by…|||Giao thức sliding window cải thiện stop-and-wait bằng cách…', options: ['sending one frame at a time|||gửi một khung mỗi lần', 'having several frames in flight at once|||có nhiều khung đang bay cùng lúc', 'never acknowledging|||không bao giờ xác nhận', 'dropping frames|||bỏ khung'], correctIndex: 1, points: 1 },
              { question: 'CSMA/CD works by…|||CSMA/CD hoạt động bằng cách…', options: ['assigning IP addresses|||gán địa chỉ IP', 'listen-before-talk, back off on collision|||nghe trước khi nói, lùi lại khi va chạm', 'encrypting frames|||mã hoá khung', 'routing packets|||định tuyến gói'], correctIndex: 1, points: 1 },
              { question: 'A MAC address is…|||Một địa chỉ MAC là…', options: ['a 48-bit hardware address on a network card|||một địa chỉ phần cứng 48-bit trên card mạng', 'an IP address|||một địa chỉ IP', 'a port number|||một số cổng', 'a domain name|||một tên miền'], correctIndex: 0, points: 1 },
              { question: 'A LAN switch forwards a frame…|||Một switch LAN chuyển một khung…', options: ['to every port always|||tới mọi cổng luôn luôn', 'only to the port where the destination MAC is|||chỉ tới cổng có MAC đích', 'to the Internet|||ra Internet', 'nowhere|||không đâu cả'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 1 ══════════════════ */
    {
      title: 'Progress Test 1 (Layers, Errors, Data Link — CLO1–4)|||Progress Test 1 (Tầng, Lỗi, Data Link — CLO1–4)',
      description: 'Ôn: phân tầng, kiểm soát lỗi, data link & LAN.',
      lessons: [
        {
          title: 'Progress Test 1 — review|||Progress Test 1 — ôn tổng hợp',
          slug: 'nwc203c-progress-test-1',
          type: 'QUIZ',
          description: 'Trộn câu hỏi từ chương 1–3.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The main benefit of a layered network model is…|||Lợi ích chính của mô hình mạng phân tầng là…', options: ['faster wires|||dây nhanh hơn', 'separation of concerns — each layer changes independently|||tách mối quan tâm — mỗi tầng đổi độc lập', 'fewer devices|||ít thiết bị hơn', 'no addresses needed|||không cần địa chỉ'], correctIndex: 1, points: 1 },
              { question: 'Which layer uses IP addresses?|||Tầng nào dùng địa chỉ IP?', options: ['Physical|||Vật lý', 'Data Link|||Liên kết dữ liệu', 'Network|||Mạng', 'Application|||Ứng dụng'], correctIndex: 2, points: 1 },
              { question: 'Parity, checksum and CRC are all forms of…|||Parity, checksum và CRC đều là dạng…', options: ['encryption|||mã hoá', 'error detection|||phát hiện lỗi', 'routing|||định tuyến', 'addressing|||đánh địa chỉ'], correctIndex: 1, points: 1 },
              { question: 'A MAC address identifies a device on a…|||Một địa chỉ MAC định danh một thiết bị trên một…', options: ['LAN (local network)|||LAN (mạng cục bộ)', 'the whole Internet|||cả Internet', 'the CPU|||CPU', 'a file system|||một hệ thống tệp'], correctIndex: 0, points: 1 },
              { question: 'Which delivers reliable, ordered data end-to-end?|||Cái nào giao dữ liệu tin cậy, đúng thứ tự đầu-cuối?', options: ['the physical layer|||tầng vật lý', 'TCP (transport layer)|||TCP (tầng giao vận)', 'a MAC address|||một địa chỉ MAC', 'a hub|||một hub'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — CHUYỂN MẠCH GÓI & ĐỊNH TUYẾN ══════════════════ */
    {
      title: 'Chapter 4 — Packet Switching & Routing|||Chương 4 — Chuyển mạch gói & Định tuyến',
      description: 'Mạng chuyển gói, bảng định tuyến, đường ngắn nhất và tắc nghẽn.',
      lessons: [
        {
          title: '4.1 — Packet switching & routing|||4.1 — Chuyển mạch gói & định tuyến',
          slug: 'nwc203c-4-1-dinh-tuyen',
          simulation: {
            scenario: 'ip-journey',
            caption: { en: 'Hop by hop: the routing table decides the next hop, not the path', vi: 'Từng chặng: bảng định tuyến chọn chặng KẾ TIẾP, không chọn cả đường' },
          },
          type: 'VIDEO',
          description: 'Cắt dữ liệu thành gói, định tuyến từng chặng và điều khiển tắc nghẽn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Moving data across many networks</h2>
<p class="lead">The Internet is a network of networks. Data is broken into <strong>packets</strong> (CLO5), each labeled with its destination, and forwarded hop by hop by <strong>routers</strong> until it arrives. Packets may take different routes and arrive out of order — the transport layer reassembles them.</p>
<h3>Routing — finding the way</h3>
<p>Each router keeps a <strong>routing table</strong> mapping destinations to the next hop. Routing algorithms build these tables, often finding the <strong>shortest path</strong> — exactly the Dijkstra algorithm from MAD101, running on a graph of routers and links.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Packet arrives</div><div class="lz-t">at a router</div><div class="lz-d">read the destination</div></div>
  <div class="lz-step"><div class="lz-k">Look up</div><div class="lz-t">routing table</div><div class="lz-d">which next hop?</div></div>
  <div class="lz-step"><div class="lz-k">Forward</div><div class="lz-t">to the next router</div><div class="lz-d">one hop closer</div></div>
</div>
<h3>Congestion control</h3>
<p>When too many packets flood a router, its queues overflow and packets are dropped — <strong>congestion</strong> (CLO6), the network&#39;s version of a traffic jam. Congestion control (largely done by TCP, Chapter 6) senses this and slows senders down so the network recovers.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The real Internet routes by policy, not shortest path.</b> Inside one network routers do run shortest-path algorithms (OSPF, Dijkstra). But between the ~75,000 independent networks (Autonomous Systems) that make up the Internet, routing is done by <em>BGP</em>, which chooses paths by business policy and contracts — the "shortest" route is often not the cheapest one an operator will accept. <em>The syllabus stops at shortest-path; BGP is why a packet from Hanoi to a nearby site can detour through Singapore.</em></div>
<div class="note-ct">Packet switching is why the Internet is so resilient: there is no single fixed path, so if one link fails, routers simply route around it. This design — devised for surviving failures — is a direct application of graph theory (MAD101) at global scale.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/packet-switching-networks-algorithms" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 3 — Packet Switching Networks &amp; Algorithms</span><span class="lc-sub">The official Coursera course.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Chuyển dữ liệu qua nhiều mạng</h2>
<p class="lead">Internet là một mạng của các mạng. Dữ liệu được cắt thành <strong>gói (packet)</strong> (CLO5), mỗi gói gắn nhãn đích, và được <strong>router</strong> chuyển tiếp từng chặng tới khi tới nơi. Gói có thể theo tuyến khác nhau và tới không đúng thứ tự — tầng giao vận ghép chúng lại.</p>
<h3>Định tuyến — tìm đường</h3>
<p>Mỗi router giữ một <strong>bảng định tuyến (routing table)</strong> ánh xạ đích tới chặng kế. Thuật toán định tuyến xây các bảng này, thường tìm <strong>đường ngắn nhất</strong> — đúng thuật toán Dijkstra từ MAD101, chạy trên một đồ thị các router và liên kết.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Gói tới</div><div class="lz-t">tại một router</div><div class="lz-d">đọc địa chỉ đích</div></div>
  <div class="lz-step"><div class="lz-k">Tra</div><div class="lz-t">bảng định tuyến</div><div class="lz-d">chặng kế nào?</div></div>
  <div class="lz-step"><div class="lz-k">Chuyển tiếp</div><div class="lz-t">tới router kế</div><div class="lz-d">gần đích một chặng</div></div>
</div>
<h3>Điều khiển tắc nghẽn</h3>
<p>Khi quá nhiều gói tràn vào một router, hàng đợi của nó tràn và gói bị bỏ — <strong>tắc nghẽn (congestion)</strong> (CLO6), phiên bản kẹt xe của mạng. Điều khiển tắc nghẽn (chủ yếu do TCP làm, Chương 6) cảm nhận điều này và làm chậm bên gửi để mạng phục hồi.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Internet thật định tuyến theo chính sách, không phải đường ngắn nhất.</b> Bên trong một mạng, router có chạy thuật toán đường ngắn nhất (OSPF, Dijkstra). Nhưng giữa ~75.000 mạng độc lập (Hệ tự trị — Autonomous System) tạo nên Internet, việc định tuyến do <em>BGP</em> làm, chọn đường theo chính sách kinh doanh và hợp đồng — đường "ngắn nhất" thường không phải đường rẻ nhất mà nhà mạng chịu nhận. <em>Giáo trình dừng ở đường ngắn nhất; BGP là lý do một gói từ Hà Nội tới một site gần đó có thể vòng qua Singapore.</em></div>
<div class="note-ct">Chuyển mạch gói là lý do Internet rất bền bỉ: không có tuyến cố định duy nhất, nên nếu một liên kết hỏng, router chỉ việc định tuyến vòng qua. Thiết kế này — nghĩ ra để sống sót khi hỏng hóc — là ứng dụng trực tiếp của lý thuyết đồ thị (MAD101) ở quy mô toàn cầu.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/packet-switching-networks-algorithms" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 3 — Packet Switching Networks &amp; Algorithms</span><span class="lc-sub">Khoá chính chủ trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 4 Quiz|||Quiz chương 4',
          slug: 'nwc203c-quiz-ch4',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: gói tin, router, bảng định tuyến, shortest-path, tắc nghẽn.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Data crossing the Internet is broken into…|||Dữ liệu qua Internet được cắt thành…', options: ['files|||tệp', 'packets|||các gói', 'threads|||các luồng', 'pages|||các trang'], correctIndex: 1, points: 1 },
              { question: 'A router forwards a packet based on its…|||Một router chuyển tiếp một gói dựa trên…', options: ['routing table (destination → next hop)|||bảng định tuyến (đích → chặng kế)', 'MAC address only|||chỉ địa chỉ MAC', 'file size|||kích thước tệp', 'password|||mật khẩu'], correctIndex: 0, points: 1 },
              { question: 'Finding shortest paths for routing uses which algorithm from MAD101?|||Tìm đường ngắn nhất để định tuyến dùng thuật toán nào từ MAD101?', options: ['bubble sort', 'Dijkstra', 'Euclid', 'Fibonacci'], correctIndex: 1, points: 1 },
              { question: 'Congestion in a network is like…|||Tắc nghẽn trong mạng giống như…', options: ['a power outage|||mất điện', 'a traffic jam (too many packets, queues overflow)|||kẹt xe (quá nhiều gói, hàng đợi tràn)', 'a virus|||một virus', 'a deadlock|||một deadlock'], correctIndex: 1, points: 1 },
              { question: 'Packet switching makes the Internet resilient because…|||Chuyển mạch gói làm Internet bền bỉ vì…', options: ['there is one fixed path|||có một tuyến cố định', 'routers can route around a failed link|||router định tuyến vòng qua liên kết hỏng', 'packets never get lost|||gói không bao giờ mất', 'it uses no addresses|||không dùng địa chỉ'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — IP & ĐỊA CHỈ ══════════════════ */
    {
      title: 'Chapter 5 — IP & Addressing|||Chương 5 — IP & Địa chỉ',
      description: 'Địa chỉ IP, subnet mask, phân cấp và CIDR.',
      lessons: [
        {
          title: '5.1 — IP addresses & subnet masks|||5.1 — Địa chỉ IP & subnet mask',
          slug: 'nwc203c-5-1-ip-subnet',
          simulation: {
            scenario: 'ip-journey',
            options: { view: 'nat' },
            caption: { en: 'A private 192.168.x address the Internet refuses to route — and NAT', vi: 'Địa chỉ riêng 192.168.x mà Internet từ chối định tuyến — và NAT' },
          },
          type: 'VIDEO',
          description: 'Cấu trúc địa chỉ IPv4, mask, network/host và chia mạng con.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>IP — one addressing scheme for the whole Internet</h2>
<p class="lead"><strong>IP (Internet Protocol)</strong> gives every device a unique <strong>IP address</strong> and defines how packets travel across the collection of networks (CLO7). An IPv4 address is 32 bits, written as four decimal numbers: 192.168.1.10.</p>
<h3>Network part vs host part</h3>
<p>An IP address splits into a <strong>network prefix</strong> (which network) and a <strong>host part</strong> (which device on it). The <strong>subnet mask</strong> marks where the split is (CLO8). This hierarchy is what lets routers find networks efficiently — you route toward a network, then to the host.</p>
<div class="out"><b>192.168.1.10 / 24</b><br>Mask 255.255.255.0 → first 24 bits = network (192.168.1), last 8 bits = host (.10)<br>This network holds hosts .1 to .254</div>
<h3>Subnetting &amp; CIDR</h3>
<p><strong>Subnetting</strong> divides one big network into smaller ones by moving the mask boundary — essential for organizing and conserving addresses. Modern notation is <strong>CIDR</strong> (e.g. /24), giving the number of network bits directly. This is a core Practical Exam skill.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Address</div><div class="lz-t">32 bits (IPv4)</div><div class="lz-d">four octets</div></div>
  <div class="lz-step"><div class="lz-k">Mask</div><div class="lz-t">splits network/host</div><div class="lz-d">e.g. /24</div></div>
  <div class="lz-step"><div class="lz-k">Route</div><div class="lz-t">to the network first</div><div class="lz-d">then to the host</div></div>
</div>
<div class="formula"><span class="lbl">Subnetting formulas</span>Number of subnets = 2^(borrowed bits) · Usable hosts per subnet = 2^(host bits) − 2<br>Block size (subnet step) = 256 − mask octet value · Broadcast address = next network address − 1</div>
<h3>Worked example · from one IP/CIDR, find everything</h3>
<div class="out"><b>Given:</b> a host has address 172.16.20.130 /27.<br><b>Step 1 — host bits.</b> /27 = 27 network bits, so host bits = 32 − 27 = 5 → block size = 2⁵ = 32.<br><b>Step 2 — which block does .130 fall in?</b> Blocks of 32 in the last octet: 0, 32, 64, 96, 128, 160… → 130 falls in the 128–159 block.<br><b>Step 3 — network address</b> = 172.16.20.<b>128</b> (the start of the block).<br><b>Step 4 — broadcast address</b> = next block start − 1 = 172.16.20.160 − 1 = 172.16.20.<b>159</b>.<br><b>Step 5 — usable host range</b> = 172.16.20.129 to 172.16.20.158 (network and broadcast excluded).<br><b>Step 6 — usable hosts</b> = 2⁵ − 2 = <b>30</b> hosts.</div>
<div class="pitfall">The #1 exam mistake: forgetting to <strong>subtract 2</strong> for the network and broadcast addresses (a /27 block has 32 total addresses but only 30 are assignable to hosts), and confusing the <em>network address</em> (all-host-bits-zero, unusable) with the <em>first usable host</em> (network address + 1).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Worked example — splitting a /24 into four subnets.</b> Take 192.168.1.0/24 (256 addresses) and borrow 2 host bits to make four /26 subnets. Each block holds 2⁶ = 64 addresses, of which 62 are usable (minus the network and broadcast address): 192.168.1.0/26 (hosts .1–.62), .64/26 (.65–.126), .128/26 (.129–.190), .192/26 (.193–.254). <em>The syllabus explains the mask concept; the practical exam makes you compute exactly these boundaries by hand.</em></div>
<div class="note-ct">The IP hierarchy mirrors a postal system: the network prefix is the city/postcode (routers use it to get close), and the host part is the street address (the final local network delivers it). Practice subnetting by hand — it is heavily tested in the practical exam.</div>
<a class="link-card codelab" href="/code-lab/linux-bash?ref=%2Fcourses%2Fcomputer-networking%2Flearn&reflabel=NWC203c%20%E2%80%94%20Computer%20Networking#module-484" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Explore networking from the shell</span><span class="lc-sub">ip, ping, traceroute — the "Networking, SSH &amp; Remote" module.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>IP — một sơ đồ đánh địa chỉ cho cả Internet</h2>
<p class="lead"><strong>IP (Internet Protocol)</strong> cho mỗi thiết bị một <strong>địa chỉ IP</strong> duy nhất và định nghĩa cách gói đi qua tập các mạng (CLO7). Một địa chỉ IPv4 dài 32 bit, viết thành bốn số thập phân: 192.168.1.10.</p>
<h3>Phần mạng vs phần host</h3>
<p>Một địa chỉ IP chia thành <strong>tiền tố mạng (network prefix)</strong> (mạng nào) và <strong>phần host</strong> (thiết bị nào trên đó). <strong>Subnet mask</strong> đánh dấu chỗ chia (CLO8). Phân cấp này cho router tìm mạng hiệu quả — bạn định tuyến tới một mạng, rồi tới host.</p>
<div class="out"><b>192.168.1.10 / 24</b><br>Mask 255.255.255.0 → 24 bit đầu = mạng (192.168.1), 8 bit cuối = host (.10)<br>Mạng này chứa host .1 tới .254</div>
<h3>Chia mạng con (subnetting) &amp; CIDR</h3>
<p><strong>Subnetting</strong> chia một mạng lớn thành các mạng nhỏ bằng cách dời ranh giới mask — thiết yếu để tổ chức và tiết kiệm địa chỉ. Ký hiệu hiện đại là <strong>CIDR</strong> (vd /24), cho số bit mạng trực tiếp. Đây là kỹ năng cốt lõi của Thi thực hành.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Địa chỉ</div><div class="lz-t">32 bit (IPv4)</div><div class="lz-d">bốn octet</div></div>
  <div class="lz-step"><div class="lz-k">Mask</div><div class="lz-t">chia mạng/host</div><div class="lz-d">vd /24</div></div>
  <div class="lz-step"><div class="lz-k">Định tuyến</div><div class="lz-t">tới mạng trước</div><div class="lz-d">rồi tới host</div></div>
</div>
<div class="formula"><span class="lbl">Công thức chia mạng con</span>Số mạng con = 2^(số bit mượn) · Số host dùng được mỗi mạng con = 2^(số bit host) − 2<br>Kích thước khối (bước subnet) = 256 − giá trị octet mask · Địa chỉ broadcast = địa chỉ mạng kế tiếp − 1</div>
<h3>Ví dụ có lời giải · từ một IP/CIDR, tìm mọi thứ</h3>
<div class="out"><b>Đề bài:</b> một host có địa chỉ 172.16.20.130 /27.<br><b>Bước 1 — số bit host.</b> /27 = 27 bit mạng, nên bit host = 32 − 27 = 5 → kích thước khối = 2⁵ = 32.<br><b>Bước 2 — .130 rơi vào khối nào?</b> Các khối 32 ở octet cuối: 0, 32, 64, 96, 128, 160… → 130 rơi vào khối 128–159.<br><b>Bước 3 — địa chỉ mạng</b> = 172.16.20.<b>128</b> (đầu khối).<br><b>Bước 4 — địa chỉ broadcast</b> = đầu khối kế tiếp − 1 = 172.16.20.160 − 1 = 172.16.20.<b>159</b>.<br><b>Bước 5 — dải host dùng được</b> = 172.16.20.129 đến 172.16.20.158 (loại địa chỉ mạng và broadcast).<br><b>Bước 6 — số host dùng được</b> = 2⁵ − 2 = <b>30</b> host.</div>
<div class="pitfall">Lỗi #1 khi thi: quên <strong>trừ 2</strong> cho địa chỉ mạng và broadcast (khối /27 có 32 địa chỉ nhưng chỉ 30 gán được cho host), và nhầm <em>địa chỉ mạng</em> (toàn bit host = 0, không dùng được) với <em>host dùng được đầu tiên</em> (địa chỉ mạng + 1).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ví dụ có số — chia một /24 thành bốn mạng con.</b> Lấy 192.168.1.0/24 (256 địa chỉ) và mượn 2 bit host để tạo bốn mạng /26. Mỗi khối chứa 2⁶ = 64 địa chỉ, trong đó 62 dùng được (trừ địa chỉ mạng và địa chỉ broadcast): 192.168.1.0/26 (host .1–.62), .64/26 (.65–.126), .128/26 (.129–.190), .192/26 (.193–.254). <em>Giáo trình giải thích khái niệm mask; thi thực hành bắt bạn tính đúng các ranh giới này bằng tay.</em></div>
<div class="note-ct">Phân cấp IP phản chiếu hệ thống bưu chính: tiền tố mạng là thành phố/mã bưu chính (router dùng để tới gần), và phần host là địa chỉ đường phố (mạng cục bộ cuối giao tới nơi). Luyện subnetting bằng tay — nó bị kiểm nhiều ở thi thực hành.</div>
<a class="link-card codelab" href="/code-lab/linux-bash?ref=%2Fcourses%2Fcomputer-networking%2Flearn&reflabel=NWC203c%20%E2%80%94%20Computer%20Networking#module-484" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Khám phá mạng từ shell</span><span class="lc-sub">ip, ping, traceroute — module "Networking, SSH &amp; Remote".</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 5 Quiz|||Quiz chương 5',
          slug: 'nwc203c-quiz-ch5',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: địa chỉ IPv4, network/host, subnet mask, CIDR.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'An IPv4 address is how many bits?|||Một địa chỉ IPv4 có bao nhiêu bit?', options: ['16', '32', '48', '64'], correctIndex: 1, points: 1 },
              { question: 'A subnet mask marks the boundary between…|||Subnet mask đánh dấu ranh giới giữa…', options: ['sender and receiver|||bên gửi và nhận', 'the network part and the host part of an address|||phần mạng và phần host của một địa chỉ', 'TCP and UDP|||TCP và UDP', 'two files|||hai tệp'], correctIndex: 1, points: 1 },
              { question: 'In 192.168.1.10 /24, the network part is…|||Trong 192.168.1.10 /24, phần mạng là…', options: ['192.168.1|||192.168.1', '10|||10', '255.255.255.0|||255.255.255.0', 'the whole address|||cả địa chỉ'], correctIndex: 0, points: 1 },
              { question: 'Subnetting is used to…|||Subnetting dùng để…', options: ['encrypt packets|||mã hoá gói', 'divide one network into smaller ones|||chia một mạng thành các mạng nhỏ hơn', 'speed up the CPU|||tăng tốc CPU', 'delete addresses|||xoá địa chỉ'], correctIndex: 1, points: 1 },
              { question: 'The IP hierarchy (network then host) helps routers…|||Phân cấp IP (mạng rồi host) giúp router…', options: ['find networks efficiently|||tìm mạng hiệu quả', 'store files|||lưu tệp', 'run faster clocks|||chạy clock nhanh hơn', 'detect errors|||phát hiện lỗi'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 6 — TCP & GIAO VẬN ══════════════════ */
    {
      title: 'Chapter 6 — TCP & Transport|||Chương 6 — TCP & Giao vận',
      description: 'Bắt tay ba bước TCP, điều khiển luồng và TCP vs UDP.',
      lessons: [
        {
          title: '6.1 — TCP handshake & flow control|||6.1 — Bắt tay TCP & điều khiển luồng',
          slug: 'nwc203c-6-1-tcp',
          simulations: [
            {
              scenario: 'tcp-handshake',
              caption: { en: 'Three-way handshake, then the four-way close', vi: 'Bắt tay ba bước, rồi bốn bước đóng' },
            },
            {
              scenario: 'tcp-window',
              caption: { en: 'The sliding window, and what happens when a segment is lost', vi: 'Cửa sổ trượt, và chuyện gì xảy ra khi mất một phân đoạn' },
            },
          ],
          type: 'VIDEO',
          description: 'Cách TCP thiết lập kết nối tin cậy và điều tiết tốc độ gửi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Reliable delivery — TCP</h2>
<p class="lead">IP just forwards packets and may lose or reorder them. <strong>TCP (Transmission Control Protocol)</strong> (CLO8) sits on top and provides a <em>reliable, ordered</em> byte stream — it detects loss, retransmits, and delivers data in order. This is what web, email and file transfer rely on.</p>
<h3>The three-way handshake</h3>
<p>Before sending data, TCP establishes a connection with a <strong>three-way handshake</strong>:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · SYN</div><div class="lz-t">client → server</div><div class="lz-d">"let&#39;s connect"</div></div>
  <div class="lz-step"><div class="lz-k">2 · SYN-ACK</div><div class="lz-t">server → client</div><div class="lz-d">"ok, and you?"</div></div>
  <div class="lz-step"><div class="lz-k">3 · ACK</div><div class="lz-t">client → server</div><div class="lz-d">"confirmed — go"</div></div>
</div>
<h3>Flow &amp; congestion control</h3>
<p><strong>Flow control</strong> stops a fast sender from overwhelming a slow receiver (using a window advertised by the receiver). <strong>Congestion control</strong> senses network overload (packet loss) and slows down — TCP is why the Internet does not collapse under load.</p>
<h3>TCP vs UDP</h3>
<table>
  <thead><tr><th>TCP</th><th>UDP</th></tr></thead>
  <tbody>
    <tr><td>Reliable, ordered, connection-based</td><td>Fast, connectionless, "best effort"</td></tr>
    <tr><td>Web, email, file transfer</td><td>Video calls, gaming, DNS, live streaming</td></tr>
    <tr><td>More overhead</td><td>Less overhead, may lose packets</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>How TCP actually finds the right speed — slow-start &amp; AIMD.</b> TCP does not know the network&#39;s capacity, so it probes: it starts with a tiny window and <em>doubles</em> it each round-trip (slow-start), then switches to adding one segment per round-trip. On packet loss it halves the window — the famous "AIMD sawtooth" (Additive Increase, Multiplicative Decrease). This gentle back-off is what lets millions of flows share a link fairly. <em>The syllabus just says TCP "slows down on loss"; AIMD is the exact rule, and the reason your download speed visibly ramps up then dips.</em></div>
<div class="note-ct">The handshake and reliability you see here are exactly what happens (invisibly) every time you load a web page. Ports (like 80 for HTTP, 443 for HTTPS) let one machine run many services at once — the transport layer&#39;s addressing on top of IP&#39;s.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/tcp-ip-advanced" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 4 — TCP/IP Advanced</span><span class="lc-sub">The official Coursera course.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Giao tin cậy — TCP</h2>
<p class="lead">IP chỉ chuyển gói và có thể mất hoặc đảo thứ tự. <strong>TCP (Transmission Control Protocol)</strong> (CLO8) nằm trên và cung cấp một luồng byte <em>tin cậy, đúng thứ tự</em> — nó phát hiện mất, truyền lại, và giao dữ liệu đúng thứ tự. Đây là thứ web, email và truyền tệp dựa vào.</p>
<h3>Bắt tay ba bước</h3>
<p>Trước khi gửi dữ liệu, TCP thiết lập kết nối bằng một <strong>bắt tay ba bước (three-way handshake)</strong>:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · SYN</div><div class="lz-t">client → server</div><div class="lz-d">"kết nối nhé"</div></div>
  <div class="lz-step"><div class="lz-k">2 · SYN-ACK</div><div class="lz-t">server → client</div><div class="lz-d">"ok, còn bạn?"</div></div>
  <div class="lz-step"><div class="lz-k">3 · ACK</div><div class="lz-t">client → server</div><div class="lz-d">"xác nhận — bắt đầu"</div></div>
</div>
<h3>Điều khiển luồng &amp; tắc nghẽn</h3>
<p><strong>Điều khiển luồng (flow control)</strong> ngăn bên gửi nhanh làm ngợp bên nhận chậm (dùng cửa sổ do bên nhận quảng bá). <strong>Điều khiển tắc nghẽn</strong> cảm nhận mạng quá tải (mất gói) và làm chậm — TCP là lý do Internet không sụp khi tải cao.</p>
<h3>TCP vs UDP</h3>
<table>
  <thead><tr><th>TCP</th><th>UDP</th></tr></thead>
  <tbody>
    <tr><td>Tin cậy, đúng thứ tự, có kết nối</td><td>Nhanh, không kết nối, "cố gắng hết sức"</td></tr>
    <tr><td>Web, email, truyền tệp</td><td>Gọi video, game, DNS, phát trực tiếp</td></tr>
    <tr><td>Chi phí cao hơn</td><td>Chi phí thấp hơn, có thể mất gói</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>TCP thực sự tìm đúng tốc độ ra sao — slow-start &amp; AIMD.</b> TCP không biết dung lượng mạng, nên nó dò: bắt đầu với cửa sổ rất nhỏ và <em>nhân đôi</em> mỗi vòng khứ hồi (slow-start), rồi chuyển sang cộng thêm một segment mỗi vòng. Khi mất gói nó giảm nửa cửa sổ — "răng cưa AIMD" nổi tiếng (Additive Increase, Multiplicative Decrease). Kiểu lùi nhẹ nhàng này giúp hàng triệu luồng chia sẻ một liên kết công bằng. <em>Giáo trình chỉ nói TCP "chậm lại khi mất gói"; AIMD là quy tắc chính xác, và là lý do tốc độ tải của bạn tăng dần rồi tụt xuống thấy rõ.</em></div>
<div class="note-ct">Bắt tay và độ tin cậy bạn thấy ở đây đúng là điều xảy ra (vô hình) mỗi khi bạn tải một trang web. Cổng (port, như 80 cho HTTP, 443 cho HTTPS) cho một máy chạy nhiều dịch vụ cùng lúc — đánh địa chỉ của tầng giao vận trên nền IP.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/tcp-ip-advanced" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 4 — TCP/IP Advanced</span><span class="lc-sub">Khoá chính chủ trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 6 Quiz|||Quiz chương 6',
          slug: 'nwc203c-quiz-ch6',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: TCP tin cậy, three-way handshake, flow control, TCP vs UDP.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'TCP provides…|||TCP cung cấp…', options: ['fast, unreliable delivery|||giao nhanh, không tin cậy', 'reliable, ordered byte-stream delivery|||giao luồng byte tin cậy, đúng thứ tự', 'IP addressing|||đánh địa chỉ IP', 'physical signals|||tín hiệu vật lý'], correctIndex: 1, points: 1 },
              { question: 'The TCP three-way handshake is…|||Bắt tay ba bước TCP là…', options: ['ACK → SYN → ACK', 'SYN → SYN-ACK → ACK', 'SYN → ACK → SYN', 'FIN → ACK → FIN'], correctIndex: 1, points: 1 },
              { question: 'Flow control prevents…|||Điều khiển luồng ngăn…', options: ['a fast sender from overwhelming a slow receiver|||bên gửi nhanh làm ngợp bên nhận chậm', 'packets from being routed|||gói bị định tuyến', 'IP addresses from changing|||địa chỉ IP đổi', 'the CPU from overheating|||CPU quá nóng'], correctIndex: 0, points: 1 },
              { question: 'Which protocol is best for a live video call?|||Giao thức nào tốt nhất cho gọi video trực tiếp?', options: ['TCP', 'UDP', 'HTTP', 'CRC'], correctIndex: 1, points: 1 },
              { question: 'Port numbers (like 80, 443) let one machine…|||Số cổng (như 80, 443) cho một máy…', options: ['have one service only|||chỉ có một dịch vụ', 'run many services at once|||chạy nhiều dịch vụ cùng lúc', 'skip IP|||bỏ qua IP', 'avoid TCP|||tránh TCP'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 1 — TẦNG ỨNG DỤNG & HÀNH TRÌNH (CAPSTONE) ══════════════════ */
    {
      title: 'Advanced 1 — The application layer & a request&#39;s journey|||Nâng cao 1 — Tầng ứng dụng & hành trình một yêu cầu',
      description: 'Ngoài giáo trình — bài tổng kết: DNS, HTTP và cả hành trình một lần tải trang.',
      lessons: [
        {
          title: 'N1.1 — Loading a web page, layer by layer|||N1.1 — Tải một trang web, từng tầng',
          slug: 'nwc203c-n1-1-hanh-trinh',
          simulation: {
            scenario: 'osi-layers',
            options: { view: 'up' },
            caption: { en: 'Unwrapping the layers on the receiving side', vi: 'Bóc từng lớp tiêu đề ở phía nhận' },
          },
          type: 'VIDEO',
          description: 'Ghép cả stack: DNS, TCP, IP, và cách một yêu cầu đi và về.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 1 · Lesson N1.1</span>
<h2>The whole stack in one action</h2>
<p class="lead">This capstone ties every chapter together by tracing one everyday action: typing a URL and pressing Enter. Watch each layer you studied do its job.</p>
<div class="lz-map">
  <div class="lz-stage">Loading cuongthai.com</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">DNS lookup (Application)</div><div class="lz-nsub">Translate the name cuongthai.com → an IP address (like a phone book)</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">TCP handshake (Transport)</div><div class="lz-nsub">SYN / SYN-ACK / ACK opens a reliable connection to port 443</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">HTTP request (Application)</div><div class="lz-nsub">"GET /" — ask for the page, secured by HTTPS encryption</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">IP routing (Network)</div><div class="lz-nsub">Packets hop router to router toward the server&#39;s IP</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Data link + physical</div><div class="lz-nsub">Frames &amp; signals carry the bits across each hop</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Response comes back</div><div class="lz-nsub">The page returns the same way; TCP reassembles it in order</div></div></div>
</div>
<p>Every layer you learned appears in this half-second dance: the application layer (DNS, HTTP) speaks meaning; TCP guarantees reliability; IP routes; the data link and physical layers move the bits. The whole course, in one page load.</p>
<div class="callout ok">The best way to make this real is <strong>Wireshark</strong>: capture your own traffic and literally watch the DNS query, the TCP SYN/SYN-ACK/ACK, and the HTTP request go by. Everything abstract becomes visible packets.</div>
<div class="note-ct">Congratulations on completing NWC203c. You now understand how the Internet works from the ground up: signals, error control, LANs, routing, IP addressing and TCP — the layered engineering that carries all the world&#39;s data. This foundation underlies backend development, network security, cloud and DevOps.</div>
<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fcomputer-networking%2Flearn&reflabel=NWC203c%20%E2%80%94%20Computer%20Networking#module-526" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">The application layer in code</span><span class="lc-sub">Build on HTTP with the "REST &amp; HTTP Basics" module on CodeLab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 1 · Bài N1.1</span>
<h2>Cả ngăn xếp trong một hành động</h2>
<p class="lead">Bài tổng kết này buộc mọi chương lại bằng cách lần theo một hành động thường ngày: gõ một URL và nhấn Enter. Xem mỗi tầng bạn đã học làm việc của nó.</p>
<div class="lz-map">
  <div class="lz-stage">Tải cuongthai.com</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Tra DNS (Ứng dụng)</div><div class="lz-nsub">Dịch tên cuongthai.com → một địa chỉ IP (như cuốn danh bạ)</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Bắt tay TCP (Giao vận)</div><div class="lz-nsub">SYN / SYN-ACK / ACK mở một kết nối tin cậy tới cổng 443</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Yêu cầu HTTP (Ứng dụng)</div><div class="lz-nsub">"GET /" — xin trang, được HTTPS mã hoá bảo vệ</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Định tuyến IP (Mạng)</div><div class="lz-nsub">Gói nhảy router qua router tới IP của máy chủ</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Data link + vật lý</div><div class="lz-nsub">Khung &amp; tín hiệu mang bit qua từng chặng</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Phản hồi trở về</div><div class="lz-nsub">Trang trở về theo đường cũ; TCP ghép lại đúng thứ tự</div></div></div>
</div>
<p>Mọi tầng bạn học xuất hiện trong điệu nhảy nửa giây này: tầng ứng dụng (DNS, HTTP) nói ý nghĩa; TCP đảm bảo tin cậy; IP định tuyến; tầng data link và vật lý chuyển bit. Cả môn học, trong một lần tải trang.</p>
<div class="callout ok">Cách tốt nhất để làm điều này thành hiện thực là <strong>Wireshark</strong>: bắt lưu lượng của chính bạn và đúng nghĩa xem truy vấn DNS, TCP SYN/SYN-ACK/ACK, và yêu cầu HTTP đi qua. Mọi thứ trừu tượng thành gói tin nhìn thấy được.</div>
<div class="note-ct">Chúc mừng bạn hoàn thành NWC203c. Giờ bạn hiểu Internet hoạt động ra sao từ gốc: tín hiệu, kiểm soát lỗi, LAN, định tuyến, địa chỉ IP và TCP — kỹ thuật phân tầng mang mọi dữ liệu của thế giới. Nền tảng này nằm dưới phát triển backend, bảo mật mạng, cloud và DevOps.</div>
<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fcomputer-networking%2Flearn&reflabel=NWC203c%20%E2%80%94%20Computer%20Networking#module-526" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Tầng ứng dụng trong code</span><span class="lc-sub">Xây trên HTTP với module "REST &amp; HTTP Basics" trên CodeLab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
      ],
    },
    {
      "title": "Final Exam|||Thi cuối kỳ",
      "description": "Thi cuối kỳ FE (trắc nghiệm, máy chấm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.",
      "lessons": [
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "nwc203c-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "Why is networking built in layers?|||Vì sao mạng được xây theo tầng?",
                "options": [
                  "to make it slower|||để chậm hơn",
                  "to split complexity so each layer solves one problem|||để chia độ phức tạp, mỗi tầng giải một vấn đề",
                  "to use more cables|||để dùng nhiều cáp hơn",
                  "for no reason|||không lý do"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "Which layer handles addressing and routing across networks?|||Tầng nào lo đánh địa chỉ và định tuyến qua các mạng?",
                "options": [
                  "Physical|||Vật lý",
                  "Data Link|||Liên kết dữ liệu",
                  "Network (IP)",
                  "Application|||Ứng dụng"
                ],
                "correctIndex": 2
              },
              {
                "id": "q3",
                "points": 1,
                "question": "The OSI model has how many layers?|||Mô hình OSI có bao nhiêu tầng?",
                "options": [
                  "4",
                  "5",
                  "7",
                  "10"
                ],
                "correctIndex": 2
              },
              {
                "id": "q4",
                "points": 1,
                "question": "Encapsulation means each layer, going down, …|||Đóng gói nghĩa là mỗi tầng, đi xuống, …",
                "options": [
                  "removes a header|||bóc một header",
                  "adds its own header|||thêm header riêng",
                  "deletes the data|||xoá dữ liệu",
                  "skips the next layer|||bỏ tầng kế"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "Reliable, ordered end-to-end delivery is the job of which layer?|||Giao đầu-cuối tin cậy, đúng thứ tự là việc của tầng nào?",
                "options": [
                  "Physical|||Vật lý",
                  "Transport (TCP)",
                  "Data Link|||Liên kết dữ liệu",
                  "Application|||Ứng dụng"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "Error control uses… to detect/fix errors.|||Kiểm soát lỗi dùng… để phát hiện/sửa lỗi.",
                "options": [
                  "faster CPUs|||CPU nhanh hơn",
                  "redundant (extra) bits|||các bit dư (thêm)",
                  "more cables|||nhiều cáp hơn",
                  "encryption only|||chỉ mã hoá"
                ],
                "correctIndex": 1
              }
            ]
          }
        }
      ]
    },
  ],
};
