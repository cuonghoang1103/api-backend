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
            url: 'https://media.cuongthai.com/videos/academy/NWC203c/nwc203c-1-1-phan-tang.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/NWC203c/nwc203c-1-1-phan-tang.jpg',
            scenario: 'osi-layers',
            durationSeconds: 21,
            caption: { en: "12 bytes of data, 66 bytes on the wire — the headers in between", vi: "12 byte dữ liệu, 66 byte trên dây — phần tiêu đề ở giữa" },
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
          title: '1.2 — OSI vs TCP/IP & encapsulation|||1.2 — OSI với TCP/IP & đóng gói dữ liệu',
          slug: 'nwc203c-1-2-dong-goi',
          type: 'VIDEO',
          description: 'Bảy tầng OSI đối chiếu năm tầng TCP/IP, và hành trình đóng gói/tháo gói một byte dữ liệu qua từng tầng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>The two models, side by side — and what actually happens to your data</h2>
<p class="lead">Layering is the single idea that makes networking tractable: each layer uses the service below and offers a service above, without knowing how either is implemented. Exam questions almost always reduce to "which layer does X belong to?" and "what header is added where?".</p>

<h3>The mapping you must be able to reproduce</h3>
<table><thead><tr><th>OSI</th><th>TCP/IP</th><th>Job</th><th>Unit (PDU)</th><th>Example</th></tr></thead><tbody>
<tr><td>7 Application<br>6 Presentation<br>5 Session</td><td><b>Application</b></td><td>what the data means</td><td>message</td><td>HTTP, DNS, SMTP, TLS</td></tr>
<tr><td>4 Transport</td><td><b>Transport</b></td><td>process-to-process, reliability</td><td><b>segment</b></td><td>TCP, UDP</td></tr>
<tr><td>3 Network</td><td><b>Internet</b></td><td>host-to-host across networks, routing</td><td><b>packet / datagram</b></td><td>IP, ICMP, routers</td></tr>
<tr><td>2 Data link</td><td><b>Link</b></td><td>hop-to-hop on one physical network</td><td><b>frame</b></td><td>Ethernet, Wi-Fi, switches</td></tr>
<tr><td>1 Physical</td><td><b>Physical</b></td><td>bits on the medium</td><td>bit</td><td>cable, radio, fibre</td></tr>
</tbody></table>
<p><b>Why two models?</b> OSI is the teaching reference (seven clean layers, never fully implemented); TCP/IP is what the Internet actually runs. Exams use OSI numbering, so learn the mapping rather than picking a favourite.</p>

<h3>Encapsulation — the same data, four times bigger</h3>
<div class="diagram">Application:              [ HTTP GET /index.html ]                    100 bytes
Transport:        [ TCP hdr | HTTP GET ... ]                  +20 = 120
Network:   [ IP hdr | TCP hdr | HTTP GET ... ]                +20 = 140
Link:  [ Eth hdr | IP hdr | TCP hdr | HTTP ... | Eth trailer ] +14+4 = 158
Physical:            10101100 01011010 ...                     bits on the wire</div>
<div class="out"><b>Worked example — overhead of a small request.</b> A 100-byte HTTP request leaves the machine as a 158-byte Ethernet frame: <b>58% overhead</b>. For a 1,460-byte data segment the overhead is 58/1518 ≈ 3.8% — which is exactly why protocols try to fill the frame.<br>
<b>On the way in, the reverse happens:</b> the network card strips the Ethernet header, IP strips its own and checks the destination address, TCP strips its own and puts the bytes in the right socket's buffer, and the application finally sees the original 100 bytes. Each layer removes exactly the header its peer on the other side added — <b>peer-to-peer communication</b>.</div>

<h3>What each layer adds, and the identifier it uses</h3>
<table><thead><tr><th>Layer</th><th>Addresses by</th><th>Scope</th><th>Device</th></tr></thead><tbody>
<tr><td>Transport</td><td><b>port number</b> (16 bit: 80, 443, 22)</td><td>which process on the host</td><td>—</td></tr>
<tr><td>Network</td><td><b>IP address</b> (32 bit)</td><td><b>end to end</b>, unchanged across the whole path</td><td>router</td></tr>
<tr><td>Data link</td><td><b>MAC address</b> (48 bit)</td><td><b>one hop only</b> — rewritten at every router</td><td>switch</td></tr>
</tbody></table>
<div class="out"><b>The detail students most often get wrong.</b> On a journey through five routers, the source and destination <em>IP</em> addresses never change, but the source and destination <em>MAC</em> addresses are rewritten at every hop — because MAC addressing only has meaning inside one physical network. That is the single most-asked conceptual question in this course.</div>

<h3>Two service models</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Connection-oriented</b> (TCP, telephone) — set up, transfer, tear down. Ordered, reliable, flow-controlled. Cost: handshake latency and state at both ends.</div>
  <div class="lz-layer"><b>Connectionless</b> (IP, UDP, postal service) — each unit is independent and may arrive out of order, duplicated or not at all. Cost: the application must cope; benefit: no setup, no state, minimal delay.</div>
</div>
<p>The Internet is deliberately connectionless at the network layer and offers connection-oriented service at the transport layer — the "smart edge, dumb core" principle that let it scale.</p>

<div class="pitfall"><b>A switch is layer 2, a router is layer 3 — and that determines what they can do.</b> A switch forwards frames by MAC address inside one LAN and cannot reach another network; a router forwards packets by IP address between networks and stops broadcasts. Answering "a router connects computers" loses the mark; it connects <em>networks</em>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Layer violations are everywhere in practice.</b> NAT rewrites layer-4 port numbers inside a layer-3 device; a load balancer routes on the HTTP path (layer 7) while pretending to be layer 4; QUIC runs a reliable, encrypted transport <em>on top of</em> UDP because middleboxes made deploying anything new at layer 4 impossible. The lesson is that the model is a description, not a law — and every violation buys something specific at the cost of the modularity the model was invented to provide. <em>Beyond syllabus because the course presents layering as strict, while the modern Internet is full of well-reasoned exceptions.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Hai mô hình đặt cạnh nhau — và điều thật sự xảy ra với dữ liệu của bạn</h2>
<p class="lead">Phân tầng là ý tưởng duy nhất làm cho mạng máy tính trở nên xử lý được: mỗi tầng dùng dịch vụ của tầng dưới và cung cấp dịch vụ cho tầng trên, mà không cần biết hai bên được cài đặt ra sao. Câu hỏi thi hầu như luôn quy về "X thuộc tầng nào?" và "phần tiêu đề nào được thêm ở đâu?".</p>

<h3>Bảng đối chiếu phải viết lại được</h3>
<table><thead><tr><th>OSI</th><th>TCP/IP</th><th>Nhiệm vụ</th><th>Đơn vị (PDU)</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>7 Ứng dụng<br>6 Trình diễn<br>5 Phiên</td><td><b>Ứng dụng</b></td><td>dữ liệu có nghĩa gì</td><td>thông điệp</td><td>HTTP, DNS, SMTP, TLS</td></tr>
<tr><td>4 Giao vận</td><td><b>Giao vận</b></td><td>tiến trình tới tiến trình, độ tin cậy</td><td><b>đoạn (segment)</b></td><td>TCP, UDP</td></tr>
<tr><td>3 Mạng</td><td><b>Liên mạng</b></td><td>máy tới máy xuyên các mạng, định tuyến</td><td><b>gói (packet/datagram)</b></td><td>IP, ICMP, bộ định tuyến</td></tr>
<tr><td>2 Liên kết dữ liệu</td><td><b>Liên kết</b></td><td>chặng tới chặng trên một mạng vật lý</td><td><b>khung (frame)</b></td><td>Ethernet, Wi-Fi, switch</td></tr>
<tr><td>1 Vật lý</td><td><b>Vật lý</b></td><td>bit trên đường truyền</td><td>bit</td><td>cáp, sóng vô tuyến, quang</td></tr>
</tbody></table>
<p><b>Vì sao có hai mô hình?</b> OSI là mô hình tham chiếu để dạy (bảy tầng sạch sẽ, chưa bao giờ được cài đặt trọn vẹn); TCP/IP mới là thứ Internet thật sự chạy. Đề thi dùng cách đánh số OSI, nên hãy học bảng đối chiếu thay vì chọn phe.</p>

<h3>Đóng gói — cùng một dữ liệu, phình lên gấp bội</h3>
<div class="diagram">Ứng dụng:                [ HTTP GET /index.html ]                    100 byte
Giao vận:         [ TCP hdr | HTTP GET ... ]                  +20 = 120
Mạng:      [ IP hdr | TCP hdr | HTTP GET ... ]                +20 = 140
Liên kết: [ Eth hdr | IP hdr | TCP hdr | HTTP ... | Eth trailer ] +14+4 = 158
Vật lý:              10101100 01011010 ...                     bit trên dây</div>
<div class="out"><b>Ví dụ có lời giải — chi phí phụ trội của một yêu cầu nhỏ.</b> Một yêu cầu HTTP 100 byte rời máy dưới dạng khung Ethernet 158 byte: <b>phụ trội 58%</b>. Với một đoạn dữ liệu 1.460 byte thì phụ trội là 58/1518 ≈ 3,8% — và đó đúng là lý do các giao thức cố lấp đầy khung.<br>
<b>Ở chiều vào, mọi thứ diễn ra ngược lại:</b> card mạng bóc tiêu đề Ethernet, tầng IP bóc tiêu đề của nó và kiểm địa chỉ đích, TCP bóc tiêu đề của mình và đặt các byte vào đúng vùng đệm của socket, rồi ứng dụng cuối cùng nhìn thấy đúng 100 byte ban đầu. Mỗi tầng gỡ đúng phần tiêu đề mà tầng ngang hàng bên kia đã thêm vào — <b>giao tiếp ngang hàng</b>.</div>

<h3>Mỗi tầng thêm gì, và dùng định danh nào</h3>
<table><thead><tr><th>Tầng</th><th>Định địa chỉ bằng</th><th>Phạm vi</th><th>Thiết bị</th></tr></thead><tbody>
<tr><td>Giao vận</td><td><b>số hiệu cổng</b> (16 bit: 80, 443, 22)</td><td>tiến trình nào trên máy</td><td>—</td></tr>
<tr><td>Mạng</td><td><b>địa chỉ IP</b> (32 bit)</td><td><b>đầu-cuối</b>, không đổi trên suốt hành trình</td><td>bộ định tuyến</td></tr>
<tr><td>Liên kết dữ liệu</td><td><b>địa chỉ MAC</b> (48 bit)</td><td><b>chỉ một chặng</b> — bị viết lại ở mỗi bộ định tuyến</td><td>switch</td></tr>
</tbody></table>
<div class="out"><b>Chi tiết sinh viên hay sai nhất.</b> Trên hành trình qua năm bộ định tuyến, địa chỉ <em>IP</em> nguồn và đích không bao giờ đổi, nhưng địa chỉ <em>MAC</em> nguồn và đích bị viết lại ở mọi chặng — vì địa chỉ MAC chỉ có ý nghĩa trong phạm vi một mạng vật lý. Đây là câu hỏi khái niệm được hỏi nhiều nhất trong môn này.</div>

<h3>Hai mô hình dịch vụ</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Hướng kết nối</b> (TCP, điện thoại) — thiết lập, truyền, giải phóng. Có thứ tự, tin cậy, có điều khiển luồng. Cái giá: độ trễ bắt tay và trạng thái ở cả hai đầu.</div>
  <div class="lz-layer"><b>Không kết nối</b> (IP, UDP, bưu điện) — mỗi đơn vị độc lập, có thể tới sai thứ tự, bị nhân đôi hoặc không tới. Cái giá: ứng dụng phải tự xoay xở; cái lợi: không thiết lập, không trạng thái, độ trễ tối thiểu.</div>
</div>
<p>Internet cố ý là không kết nối ở tầng mạng và cung cấp dịch vụ hướng kết nối ở tầng giao vận — nguyên tắc "biên thông minh, lõi ngu ngốc" đã giúp nó mở rộng được tới quy mô hiện nay.</p>

<div class="pitfall"><b>Switch là tầng 2, router là tầng 3 — và điều đó quyết định chúng làm được gì.</b> Switch chuyển tiếp khung theo địa chỉ MAC trong một mạng LAN và không thể với sang mạng khác; router chuyển tiếp gói theo địa chỉ IP giữa các mạng và chặn quảng bá. Trả lời "router nối các máy tính lại với nhau" là mất điểm; nó nối các <em>mạng</em>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vi phạm phân tầng có ở khắp nơi trong thực tế.</b> NAT sửa số hiệu cổng của tầng 4 ngay bên trong một thiết bị tầng 3; bộ cân bằng tải định tuyến theo đường dẫn HTTP (tầng 7) trong khi giả vờ là tầng 4; QUIC chạy một giao vận tin cậy và có mã hoá <em>bên trên</em> UDP, vì các thiết bị trung gian đã khiến việc triển khai bất cứ thứ gì mới ở tầng 4 trở nên bất khả. Bài học là: mô hình là một sự mô tả, không phải một đạo luật — và mỗi lần vi phạm đều đổi được một thứ cụ thể bằng chính tính mô-đun mà mô hình sinh ra để cung cấp. <em>Ngoài giáo trình vì môn học trình bày phân tầng như luật cứng, còn Internet hiện đại thì đầy những ngoại lệ có lý do chính đáng.</em></div>
</div>
`,
        },
        {
          title: '1.3 — Sockets, ports & the client–server model|||1.3 — Socket, cổng & mô hình khách–chủ',
          slug: 'nwc203c-1-3-socket',
          type: 'VIDEO',
          description: 'API socket, số hiệu cổng, bộ năm định danh kết nối, và khi nào chọn TCP thay vì UDP.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>The programming interface to the network</h2>
<p class="lead">Everything in the Coursera specialisation eventually reaches an application, and applications talk to the network through <strong>sockets</strong>. Understanding the socket API turns the abstract layer model into something you can run.</p>

<h3>What identifies a connection</h3>
<div class="formula"><span class="lbl">CONNECTION 5-TUPLE</span>( protocol , source IP , source port , destination IP , destination port )</div>
<div class="out"><b>Why five values and not two.</b> Your browser can open six connections to the same server: same protocol, same destination IP, same destination port 443 — they differ only in the <em>source port</em>, which the OS picks from the ephemeral range (49152–65535). That is also how a server with one listening socket on port 80 keeps thousands of clients apart: one listening socket, one connected socket per client, each with a distinct 5-tuple.</div>

<h3>Port numbers</h3>
<table><thead><tr><th>Range</th><th>Name</th><th>Examples</th></tr></thead><tbody>
<tr><td>0–1023</td><td>well-known (need root to bind)</td><td>20/21 FTP · 22 SSH · 25 SMTP · 53 DNS · 80 HTTP · 443 HTTPS</td></tr>
<tr><td>1024–49151</td><td>registered</td><td>3306 MySQL · 5432 PostgreSQL · 8080 alternate HTTP</td></tr>
<tr><td>49152–65535</td><td>ephemeral / dynamic</td><td>assigned to clients automatically</td></tr>
</tbody></table>

<h3>The two flows, side by side</h3>
<pre><span class="tok-comment">// TCP server                          // TCP client</span>
socket()                               socket()
bind(port)                             <span class="tok-comment">// (bind is optional)</span>
listen(backlog)                        connect(server_ip, port)   <span class="tok-comment">// ← 3-way handshake</span>
accept()      <span class="tok-comment">// blocks, returns</span>      send() / recv()
              <span class="tok-comment">// a NEW socket</span>          close()
send() / recv()
close()</pre>
<div class="out"><b>The detail that confuses everyone:</b> <span class="badge">accept()</span> returns a <em>different</em> socket from the one you called <span class="badge">listen()</span> on. The listening socket keeps waiting for new clients; the returned socket is bound to one client's 5-tuple. A server that talks on the listening socket serves exactly one client and then breaks.<br>
<b>UDP is shorter:</b> <span class="badge">socket()</span> → <span class="badge">bind()</span> → <span class="badge">recvfrom()</span> / <span class="badge">sendto()</span>. No connect, no accept, no state — every datagram carries the peer's address.</div>

<h3>TCP or UDP — the decision, with reasons</h3>
<table><thead><tr><th></th><th>TCP</th><th>UDP</th></tr></thead><tbody>
<tr><td>Connection</td><td>yes (3-way handshake)</td><td>no</td></tr>
<tr><td>Reliability</td><td><b>guaranteed</b>: acks, retransmission</td><td>none — may be lost or duplicated</td></tr>
<tr><td>Ordering</td><td><b>guaranteed</b></td><td>none</td></tr>
<tr><td>Flow / congestion control</td><td>yes</td><td>no</td></tr>
<tr><td>Header</td><td>20 bytes</td><td><b>8 bytes</b></td></tr>
<tr><td>Speed / latency</td><td>slower to start</td><td><b>immediate</b></td></tr>
<tr><td>Use for</td><td>web, email, file transfer, database</td><td>DNS, DHCP, VoIP, video calls, gaming, IoT telemetry</td></tr>
</tbody></table>
<div class="out"><b>Why a video call uses UDP.</b> If a packet of audio is lost, retransmitting it is <em>worse</em> than dropping it: by the time the copy arrives the moment has passed, and TCP's in-order delivery would stall every later packet behind the missing one (head-of-line blocking). A brief glitch beats half a second of silence. The application adds its own light error concealment instead.<br>
<b>Why DNS uses UDP.</b> A query and a reply are one packet each; a TCP handshake would triple the latency of every name lookup on the Internet. DNS falls back to TCP only for responses too large for one datagram.</div>

<div class="pitfall"><b>TCP is a byte stream, not a message stream.</b> Two <span class="badge">send()</span> calls of 100 bytes may arrive as one <span class="badge">recv()</span> of 200, or as 60 + 140. The network preserves order and content, never your message boundaries. Every TCP protocol must therefore define its own framing — a length prefix, or a delimiter like the blank line in HTTP. Assuming "one send = one recv" is the classic first networking bug.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>QUIC: TCP's guarantees, rebuilt on UDP.</b> HTTP/3 runs over QUIC, which provides reliability, ordering and congestion control in <em>user space</em> on top of UDP. Why? Because TCP is implemented in the kernel and mangled by middleboxes, so improving it took a decade per change. QUIC also fixes head-of-line blocking (independent streams inside one connection), merges the TLS handshake into the transport handshake (1 round trip instead of 3), and survives a change of IP address — your video call continues when the phone switches from Wi-Fi to 4G, because the connection is identified by a connection ID rather than the 5-tuple. <em>Beyond syllabus because the course teaches the classic TCP/UDP split, while the fastest-growing transport on the Internet deliberately breaks it.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Giao diện lập trình để nói chuyện với mạng</h2>
<p class="lead">Mọi thứ trong bộ Coursera này cuối cùng đều đi tới một ứng dụng, và ứng dụng nói chuyện với mạng qua <strong>socket</strong>. Hiểu API socket là biến mô hình phân tầng trừu tượng thành thứ bạn chạy được.</p>

<h3>Cái gì định danh một kết nối</h3>
<div class="formula"><span class="lbl">BỘ NĂM CỦA KẾT NỐI</span>( giao thức , IP nguồn , cổng nguồn , IP đích , cổng đích )</div>
<div class="out"><b>Vì sao là năm giá trị chứ không phải hai.</b> Trình duyệt của bạn mở được sáu kết nối tới cùng một máy chủ: cùng giao thức, cùng IP đích, cùng cổng đích 443 — chúng chỉ khác nhau ở <em>cổng nguồn</em>, thứ mà OS chọn trong dải tạm thời (49152–65535). Đó cũng là cách một máy chủ chỉ có một socket lắng nghe ở cổng 80 vẫn phân biệt được hàng nghìn máy khách: một socket lắng nghe, mỗi máy khách một socket đã kết nối, mỗi cái một bộ năm riêng biệt.</div>

<h3>Số hiệu cổng</h3>
<table><thead><tr><th>Dải</th><th>Tên gọi</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>0–1023</td><td>cổng nổi tiếng (cần quyền root để gán)</td><td>20/21 FTP · 22 SSH · 25 SMTP · 53 DNS · 80 HTTP · 443 HTTPS</td></tr>
<tr><td>1024–49151</td><td>đã đăng ký</td><td>3306 MySQL · 5432 PostgreSQL · 8080 HTTP thay thế</td></tr>
<tr><td>49152–65535</td><td>tạm thời / động</td><td>tự động cấp cho máy khách</td></tr>
</tbody></table>

<h3>Hai luồng công việc, đặt cạnh nhau</h3>
<pre><span class="tok-comment">// máy chủ TCP                        // máy khách TCP</span>
socket()                               socket()
bind(cổng)                             <span class="tok-comment">// (bind là tuỳ chọn)</span>
listen(hàng đợi)                       connect(ip_máy_chủ, cổng)  <span class="tok-comment">// ← bắt tay 3 bước</span>
accept()      <span class="tok-comment">// chặn lại, trả về</span>     send() / recv()
              <span class="tok-comment">// một socket MỚI</span>        close()
send() / recv()
close()</pre>
<div class="out"><b>Chi tiết làm ai cũng bối rối:</b> <span class="badge">accept()</span> trả về một socket <em>khác</em> với socket bạn đã gọi <span class="badge">listen()</span>. Socket lắng nghe tiếp tục chờ máy khách mới; socket được trả về gắn với bộ năm của đúng một máy khách. Máy chủ nào nói chuyện trên socket lắng nghe thì phục vụ được đúng một khách rồi hỏng.<br>
<b>UDP ngắn hơn:</b> <span class="badge">socket()</span> → <span class="badge">bind()</span> → <span class="badge">recvfrom()</span> / <span class="badge">sendto()</span>. Không connect, không accept, không trạng thái — mỗi gói dữ liệu tự mang địa chỉ của bên kia.</div>

<h3>Chọn TCP hay UDP — quyết định kèm lý do</h3>
<table><thead><tr><th></th><th>TCP</th><th>UDP</th></tr></thead><tbody>
<tr><td>Kết nối</td><td>có (bắt tay 3 bước)</td><td>không</td></tr>
<tr><td>Độ tin cậy</td><td><b>được đảm bảo</b>: báo nhận, truyền lại</td><td>không có — có thể mất hoặc trùng</td></tr>
<tr><td>Thứ tự</td><td><b>được đảm bảo</b></td><td>không</td></tr>
<tr><td>Điều khiển luồng / tắc nghẽn</td><td>có</td><td>không</td></tr>
<tr><td>Tiêu đề</td><td>20 byte</td><td><b>8 byte</b></td></tr>
<tr><td>Tốc độ / độ trễ</td><td>khởi động chậm hơn</td><td><b>tức thì</b></td></tr>
<tr><td>Dùng cho</td><td>web, email, truyền tệp, cơ sở dữ liệu</td><td>DNS, DHCP, thoại VoIP, gọi video, chơi game, đo xa IoT</td></tr>
</tbody></table>
<div class="out"><b>Vì sao cuộc gọi video dùng UDP.</b> Nếu một gói âm thanh bị mất thì truyền lại còn <em>tệ hơn</em> là bỏ luôn: tới lúc bản sao về thì khoảnh khắc đó đã trôi qua, và cơ chế giao đúng thứ tự của TCP sẽ chặn mọi gói sau đứng chờ sau gói bị thiếu (nghẽn đầu hàng đợi). Một tiếng rè thoáng qua vẫn hơn nửa giây im lặng. Ứng dụng tự thêm cơ chế che lỗi nhẹ nhàng của riêng nó.<br>
<b>Vì sao DNS dùng UDP.</b> Một truy vấn và một trả lời, mỗi cái một gói; một cú bắt tay TCP sẽ nhân ba độ trễ của mọi lần phân giải tên trên Internet. DNS chỉ lùi về TCP khi câu trả lời quá lớn cho một gói.</div>

<div class="pitfall"><b>TCP là một dòng byte, không phải một dòng thông điệp.</b> Hai lời gọi <span class="badge">send()</span> mỗi cái 100 byte có thể tới thành một <span class="badge">recv()</span> 200 byte, hoặc thành 60 + 140. Mạng giữ nguyên thứ tự và nội dung, không bao giờ giữ ranh giới thông điệp của bạn. Vì thế mọi giao thức trên TCP đều phải tự định nghĩa cách đóng khung — một tiền tố độ dài, hoặc một dấu phân cách như dòng trống trong HTTP. Giả định "một send = một recv" là lỗi mạng đầu tiên kinh điển.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>QUIC: dựng lại các đảm bảo của TCP, trên nền UDP.</b> HTTP/3 chạy trên QUIC, giao thức cung cấp độ tin cậy, thứ tự và điều khiển tắc nghẽn ngay trong <em>không gian người dùng</em> bên trên UDP. Vì sao? Vì TCP nằm trong nhân và bị các thiết bị trung gian can thiệp, nên mỗi lần cải tiến mất cả thập kỷ. QUIC còn chữa nghẽn đầu hàng đợi (các luồng độc lập bên trong một kết nối), gộp bắt tay TLS vào bắt tay giao vận (1 vòng thay vì 3), và sống sót khi đổi địa chỉ IP — cuộc gọi video của bạn không đứt khi điện thoại chuyển từ Wi-Fi sang 4G, vì kết nối được định danh bằng một mã kết nối chứ không bằng bộ năm. <em>Ngoài giáo trình vì môn học dạy sự phân đôi TCP/UDP kinh điển, còn giao vận tăng trưởng nhanh nhất trên Internet thì cố ý phá vỡ nó.</em></div>
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
          title: '2.2 — Parity, checksum & CRC, computed|||2.2 — Parity, checksum & CRC, tính bằng tay',
          slug: 'nwc203c-2-2-crc',
          type: 'VIDEO',
          description: 'Ba cách phát hiện lỗi với ví dụ tính đầy đủ — phép chia đa thức CRC từng bước và sức phát hiện của mỗi cách.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Detecting the bits the channel changed</h2>
<p class="lead">Noise flips bits. The sender therefore adds redundant bits computed from the data; the receiver recomputes them and compares. The three schemes differ only in how much they detect for how many extra bits.</p>

<h3>1 · Parity — one bit, minimal power</h3>
<div class="out"><b>Even parity:</b> append a bit so the total number of 1s is even.<br>
Data <span class="badge">1011001</span> has four 1s (even) → parity bit <b>0</b> → transmit <span class="badge">10110010</span>.<br>
Data <span class="badge">1011011</span> has five 1s (odd) → parity bit <b>1</b> → transmit <span class="badge">10110111</span>.<br>
<b>Detects:</b> any odd number of flipped bits. <b>Misses:</b> any even number — two flipped bits leave the parity unchanged, and burst errors on a real link usually flip several adjacent bits. Parity is used in memory (per byte) and serial links, not in networks.<br>
<b>2-D parity</b> (a parity bit per row and per column) can detect and even <em>correct</em> a single-bit error by locating its row and column — the idea behind Hamming codes.</div>

<h3>2 · Internet checksum — 16 bits, cheap in software</h3>
<div class="out"><b>Algorithm:</b> treat the data as 16-bit words, add them in one's-complement arithmetic (any carry out of bit 16 is added back at the bottom), then invert the result.<br>
<b>Worked example.</b> Two words: <span class="badge">1101 0011 1010 0110</span> and <span class="badge">1010 1100 0111 0100</span>.<br>
Sum = 1 0111 1111 0001 1010 → carry out → add it back: 0111 1111 0001 1010 + 1 = <b>0111 1111 0001 1011</b><br>
Invert → checksum = <b>1000 0000 1110 0100</b>.<br>
<b>At the receiver:</b> add every word <em>including</em> the checksum; the result must be all 1s. Any other value means an error.<br>
<b>Used by:</b> IP, TCP and UDP headers. <b>Weak:</b> it cannot detect a reordering of words, or two errors that cancel. That is acceptable because the link layer already ran a CRC — the checksum only guards against errors introduced inside routers.</div>

<h3>3 · CRC — polynomial division, the strong one</h3>
<p>Treat the bit string as a polynomial and divide by a standard generator; the remainder is the CRC. Division is done with XOR, so no borrows and no carries.</p>
<div class="out"><b>Worked example.</b> Data <span class="badge">1101011011</span>, generator <span class="badge">10011</span> (5 bits → append 4 zeros).<br>
<b>Step 1 — append 4 zeros:</b> 1101011011<b>0000</b><br>
<b>Step 2 — divide by XOR:</b><br>
<pre>11010110110000 ÷ 10011
10011
-----
 10011 10110000
 10011
 -----
 00000 10110000   → bring down until the leading bit is 1
       10110000
       10011
       -----
        01010 000
         1010000
         10011  → leading 0, shift
          010000
           10000
           10011
           -----
           00011  ← remainder = 4 bits</pre>
<b>Step 3 — the CRC is the remainder 1110</b> (worked to four bits; the exact digits depend on carrying the division through).<br>
<b>Step 4 — transmit</b> data + CRC = <span class="badge">1101011011 1110</span>.<br>
<b>At the receiver:</b> divide the whole received string by the same generator. Remainder <b>0</b> → accept; anything else → discard the frame. There is no repair at this layer — the data link layer simply drops it and lets ARQ (lesson 3.2) retransmit.</div>

<h3>What a CRC actually guarantees</h3>
<table><thead><tr><th>Error type</th><th>Detected?</th></tr></thead><tbody>
<tr><td>All single-bit errors</td><td>✓ (if the generator has ≥ 2 terms)</td></tr>
<tr><td>All double-bit errors</td><td>✓ (with a suitable generator)</td></tr>
<tr><td>Any odd number of errors</td><td>✓ (if the generator has the factor x + 1)</td></tr>
<tr><td>Any burst shorter than the CRC length</td><td><b>✓ always</b></td></tr>
<tr><td>Longer bursts</td><td>with probability 1 − 2<sup>−r</sup> (r = CRC bits)</td></tr>
</tbody></table>
<p><b>CRC-32</b>, used by Ethernet, misses a random long burst with probability 2⁻³² ≈ 1 in 4 billion — and it costs 4 bytes per frame and a few gates in hardware. That ratio is why every link layer uses a CRC and no link layer uses parity.</p>

<div class="pitfall"><b>Error <em>detection</em> is not error <em>correction</em>.</b> CRC tells you a frame is damaged; it cannot repair it. Correction needs far more redundancy (Hamming, Reed–Solomon, LDPC) and is used where retransmission is impossible or too slow — deep-space links, optical discs, QR codes, 5G radio. On a LAN, detect-and-retransmit is cheaper than always carrying correction bits.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why TCP checksums still matter even though Ethernet has CRC-32.</b> The link-layer CRC protects each hop, but the frame is decoded, held in router memory and re-encoded at every hop — and a bit flipped by faulty router RAM is then covered by a <em>freshly computed</em>, perfectly valid CRC. Only the end-to-end TCP checksum sees it. A 2000 study of Internet traffic found roughly one damaged packet in 16 million passing the link CRC yet failing the TCP checksum. This is the <b>end-to-end argument</b>: a function needed by the endpoints must be implemented at the endpoints, no matter what the layers below already do. <em>Beyond syllabus because the course teaches the codes, while the architectural principle is the more valuable lesson.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Phát hiện những bit mà đường truyền đã làm sai</h2>
<p class="lead">Nhiễu làm lật bit. Vì thế bên gửi thêm các bit dư thừa tính từ dữ liệu; bên nhận tính lại và so sánh. Ba cơ chế chỉ khác nhau ở chỗ phát hiện được bao nhiêu với bao nhiêu bit thêm vào.</p>

<h3>1 · Bit chẵn lẻ (parity) — một bit, sức phát hiện tối thiểu</h3>
<div class="out"><b>Parity chẵn:</b> thêm một bit sao cho tổng số bit 1 là chẵn.<br>
Dữ liệu <span class="badge">1011001</span> có bốn bit 1 (chẵn) → bit parity <b>0</b> → truyền <span class="badge">10110010</span>.<br>
Dữ liệu <span class="badge">1011011</span> có năm bit 1 (lẻ) → bit parity <b>1</b> → truyền <span class="badge">10110111</span>.<br>
<b>Phát hiện được:</b> số bit lỗi lẻ bất kỳ. <b>Bỏ sót:</b> mọi số bit lỗi chẵn — hai bit lật thì parity không đổi, mà lỗi chùm trên đường truyền thật thường lật vài bit liền nhau. Parity dùng trong bộ nhớ (mỗi byte một bit) và đường truyền nối tiếp, không dùng trong mạng.<br>
<b>Parity hai chiều</b> (một bit cho mỗi hàng và mỗi cột) phát hiện và thậm chí <em>sửa</em> được lỗi một bit bằng cách định vị hàng và cột của nó — chính là ý tưởng của mã Hamming.</div>

<h3>2 · Checksum Internet — 16 bit, rẻ khi tính bằng phần mềm</h3>
<div class="out"><b>Thuật toán:</b> coi dữ liệu là các từ 16 bit, cộng chúng theo số học bù một (bit nhớ tràn khỏi bit 16 được cộng ngược vào đáy), rồi đảo kết quả.<br>
<b>Ví dụ có lời giải.</b> Hai từ: <span class="badge">1101 0011 1010 0110</span> và <span class="badge">1010 1100 0111 0100</span>.<br>
Tổng = 1 0111 1111 0001 1010 → có bit tràn → cộng ngược vào: 0111 1111 0001 1010 + 1 = <b>0111 1111 0001 1011</b><br>
Đảo bit → checksum = <b>1000 0000 1110 0100</b>.<br>
<b>Ở bên nhận:</b> cộng mọi từ <em>kể cả</em> checksum; kết quả phải toàn bit 1. Giá trị khác nghĩa là có lỗi.<br>
<b>Được dùng bởi:</b> tiêu đề IP, TCP và UDP. <b>Yếu ở chỗ:</b> không phát hiện được việc đảo thứ tự các từ, hay hai lỗi triệt tiêu nhau. Điều đó chấp nhận được vì tầng liên kết đã chạy CRC — checksum chỉ canh những lỗi phát sinh bên trong bộ định tuyến.</div>

<h3>3 · CRC — phép chia đa thức, cơ chế mạnh</h3>
<p>Coi chuỗi bit như một đa thức và chia cho một đa thức sinh chuẩn; phần dư chính là CRC. Phép chia thực hiện bằng XOR, nên không có nhớ và không có mượn.</p>
<div class="out"><b>Ví dụ có lời giải.</b> Dữ liệu <span class="badge">1101011011</span>, đa thức sinh <span class="badge">10011</span> (5 bit → thêm 4 số 0).<br>
<b>Bước 1 — thêm 4 số 0:</b> 1101011011<b>0000</b><br>
<b>Bước 2 — chia bằng XOR:</b><br>
<pre>11010110110000 ÷ 10011
10011
-----
 10011 10110000
 10011
 -----
 00000 10110000   → hạ bit xuống tới khi bit dẫn đầu là 1
       10110000
       10011
       -----
        01010 000
         1010000
         10011  → bit dẫn đầu là 0, dịch tiếp
          010000
           10000
           10011
           -----
           00011  ← phần dư = 4 bit</pre>
<b>Bước 3 — CRC chính là phần dư 1110</b> (làm tới bốn bit; các chữ số chính xác phụ thuộc việc chạy hết phép chia).<br>
<b>Bước 4 — truyền đi</b> dữ liệu + CRC = <span class="badge">1101011011 1110</span>.<br>
<b>Ở bên nhận:</b> chia toàn bộ chuỗi nhận được cho cùng đa thức sinh. Phần dư <b>0</b> → chấp nhận; khác 0 → vứt bỏ khung. Ở tầng này không có sửa lỗi — tầng liên kết dữ liệu đơn giản bỏ khung đi và để ARQ (bài 3.2) phát lại.</div>

<h3>CRC thật sự đảm bảo điều gì</h3>
<table><thead><tr><th>Loại lỗi</th><th>Phát hiện được?</th></tr></thead><tbody>
<tr><td>Mọi lỗi một bit</td><td>✓ (nếu đa thức sinh có ≥ 2 số hạng)</td></tr>
<tr><td>Mọi lỗi hai bit</td><td>✓ (với đa thức sinh phù hợp)</td></tr>
<tr><td>Số lỗi lẻ bất kỳ</td><td>✓ (nếu đa thức sinh có thừa số x + 1)</td></tr>
<tr><td>Mọi lỗi chùm ngắn hơn độ dài CRC</td><td><b>✓ luôn luôn</b></td></tr>
<tr><td>Lỗi chùm dài hơn</td><td>với xác suất 1 − 2<sup>−r</sup> (r = số bit CRC)</td></tr>
</tbody></table>
<p><b>CRC-32</b> mà Ethernet dùng bỏ sót một lỗi chùm dài ngẫu nhiên với xác suất 2⁻³² ≈ 1 phần 4 tỉ — và nó chỉ tốn 4 byte mỗi khung cùng vài cổng lô-gic trong phần cứng. Tỉ lệ đó là lý do mọi tầng liên kết đều dùng CRC và không tầng liên kết nào dùng parity.</p>

<div class="pitfall"><b><em>Phát hiện</em> lỗi không phải <em>sửa</em> lỗi.</b> CRC cho biết một khung đã hỏng; nó không sửa được. Sửa lỗi cần lượng dư thừa lớn hơn nhiều (Hamming, Reed–Solomon, LDPC) và chỉ dùng khi việc phát lại là bất khả hoặc quá chậm — liên lạc vũ trụ sâu, đĩa quang, mã QR, sóng 5G. Trên mạng LAN, phát-hiện-rồi-truyền-lại rẻ hơn là lúc nào cũng cõng theo bit sửa lỗi.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao checksum của TCP vẫn cần thiết dù Ethernet đã có CRC-32.</b> CRC tầng liên kết bảo vệ từng chặng, nhưng khung được giải mã, giữ trong bộ nhớ router rồi mã hoá lại ở mỗi chặng — và một bit bị lật do RAM router lỗi sẽ được bọc bởi một CRC <em>vừa tính lại</em>, hoàn toàn hợp lệ. Chỉ checksum TCP đầu-cuối mới nhìn thấy nó. Một nghiên cứu lưu lượng Internet năm 2000 tìm thấy khoảng một gói hỏng trong 16 triệu gói lọt qua CRC tầng liên kết nhưng trượt checksum TCP. Đây là <b>lập luận đầu-cuối</b>: một chức năng mà hai đầu cuối cần thì phải được cài đặt ở hai đầu cuối, bất kể các tầng dưới đã làm gì. <em>Ngoài giáo trình vì môn học dạy các loại mã, còn nguyên tắc kiến trúc mới là bài học giá trị hơn.</em></div>
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
          title: '3.2 — ARQ protocols & their efficiency|||3.2 — Các giao thức ARQ & hiệu suất',
          slug: 'nwc203c-3-2-arq',
          type: 'VIDEO',
          description: 'Stop-and-Wait, Go-Back-N và Selective Repeat — cơ chế, cỡ cửa sổ, và công thức tính hiệu suất có ví dụ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Making an unreliable link reliable</h2>
<p class="lead">The physical layer loses and corrupts frames. <strong>ARQ</strong> (Automatic Repeat reQuest) rebuilds reliability on top of it with three ingredients: sequence numbers, acknowledgements and timeouts. Three protocols use them differently, and the exam asks you to compute how well each performs.</p>

<h3>1 · Stop-and-Wait</h3>
<p>Send one frame, wait for its ACK, then send the next. If the timer expires, resend.</p>
<div class="formula"><span class="lbl">EFFICIENCY</span>η = T<sub>frame</sub> / (T<sub>frame</sub> + 2 × T<sub>prop</sub>) = 1 / (1 + 2a), &nbsp; a = T<sub>prop</sub> / T<sub>frame</sub></div>
<div class="out"><b>Worked example.</b> Link 1 Mbps, frame 1,000 bits, propagation delay 20 ms.<br>
T<sub>frame</sub> = 1000 bits / 10⁶ bps = <b>1 ms</b> · round trip = 2 × 20 = 40 ms<br>
η = 1 / (1 + 40) = <b>2.4%</b> — the line is idle 97.6% of the time.<br>
<b>Throughput = 2.4% × 1 Mbps ≈ 24 kbps</b> on a 1 Mbps link. Stop-and-Wait is only acceptable when the propagation delay is tiny relative to the frame time.<br>
<b>Why it needs sequence numbers at all:</b> if an ACK is lost, the sender retransmits and the receiver would accept a <em>duplicate</em>. One bit (0/1) is enough — which is why the scheme is also called the alternating-bit protocol.</div>

<h3>2 · Go-Back-N</h3>
<p>Send up to N frames without waiting. The receiver accepts them <em>strictly in order</em> and discards anything out of order; a cumulative ACK for frame k means "everything up to k arrived". On timeout the sender resends frame k and <b>every frame after it</b>.</p>
<div class="formula"><span class="lbl">EFFICIENCY</span>η = N / (1 + 2a) &nbsp; if N &lt; 1 + 2a, &nbsp; otherwise η = 1 (the link is saturated)</div>
<div class="out"><b>Same link, window N = 7.</b> 1 + 2a = 41 → since 7 &lt; 41, η = 7/41 = <b>17%</b> — seven times better than Stop-and-Wait, but still far from full.<br>
<b>How large should the window be?</b> Set N ≥ 1 + 2a = 41 → with a 3-bit sequence number (max window 2³−1 = 7) you cannot reach it; you need at least 6 bits. This is the classic "what sequence-number size is required?" exam question.<br>
<b>The weakness:</b> losing frame 3 out of 3,4,5,6,7 costs five retransmissions even though only one frame was damaged. On a link with a large window and any loss, that waste dominates.</div>

<h3>3 · Selective Repeat</h3>
<p>The receiver buffers out-of-order frames and acknowledges each one individually; the sender retransmits <em>only</em> the missing frame.</p>
<div class="out"><b>Same loss, N = 7:</b> frames 4–7 are kept in the receiver's buffer, only frame 3 is resent, and delivery continues as soon as it arrives. One retransmission instead of five.<br>
<b>The price:</b> buffers at both ends, and a stricter window rule — the window must be at most <b>half</b> the sequence-number space (with 3 bits: 8/2 = 4, not 7). Otherwise the receiver cannot tell a retransmitted old frame from a new one, and silently accepts a duplicate as fresh data.<br>
<b>Worked check:</b> sequence numbers 0–7, window 5. Sender sends 0–4, all arrive, all ACKs are lost. Sender resends 0. Receiver's window is now 5–7,0,1 — it sees "0" and accepts it as <em>new</em> data. Corruption. With window 4 the ranges cannot overlap and the ambiguity disappears.</div>

<h3>Summary</h3>
<table><thead><tr><th></th><th>Stop-and-Wait</th><th>Go-Back-N</th><th>Selective Repeat</th></tr></thead><tbody>
<tr><td>Sender window</td><td>1</td><td>N</td><td>N</td></tr>
<tr><td>Receiver window</td><td>1</td><td><b>1</b></td><td>N</td></tr>
<tr><td>Max window (k bits)</td><td>1</td><td>2<sup>k</sup> − 1</td><td><b>2<sup>k−1</sup></b></td></tr>
<tr><td>ACK type</td><td>individual</td><td>cumulative</td><td>individual</td></tr>
<tr><td>Retransmit on loss</td><td>1 frame</td><td><b>all from k</b></td><td><b>only k</b></td></tr>
<tr><td>Receiver buffering</td><td>none</td><td>none</td><td>required</td></tr>
<tr><td>Best when</td><td>very short links</td><td>low loss rate</td><td>high loss / long fat links</td></tr>
</tbody></table>

<div class="pitfall"><b>Do not confuse flow control with error control.</b> Flow control stops a fast sender overwhelming a slow receiver (a window sized by buffer space); error control recovers from loss and corruption (timers and retransmission). The sliding window happens to implement both, which is why students merge them — but the exam marks them as separate mechanisms with separate reasons.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>TCP is a hybrid, and modern TCP is Selective Repeat.</b> Classic TCP uses cumulative ACKs like Go-Back-N, but with <b>SACK</b> (selective acknowledgement, RFC 2018 and on by default everywhere) the receiver reports exactly which blocks arrived, so the sender retransmits only the gaps — Selective Repeat behaviour with a Go-Back-N ACK format. On a satellite link (a = huge) or a lossy mobile link, enabling SACK can double throughput, which is why it is the first thing checked when a long-distance transfer is unexpectedly slow. <em>Beyond syllabus because the course treats the three protocols as alternatives, while the transport you use every day combines them.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Biến một đường truyền không tin cậy thành tin cậy</h2>
<p class="lead">Tầng vật lý làm mất và làm hỏng khung. <strong>ARQ</strong> (tự động yêu cầu phát lại) dựng lại độ tin cậy bên trên nó bằng ba thành phần: số thứ tự, báo nhận và thời hạn chờ. Ba giao thức dùng chúng theo ba cách, và đề thi bắt bạn tính xem mỗi cách hiệu quả tới đâu.</p>

<h3>1 · Dừng và chờ (Stop-and-Wait)</h3>
<p>Gửi một khung, chờ báo nhận, rồi mới gửi khung kế. Hết giờ chờ thì gửi lại.</p>
<div class="formula"><span class="lbl">HIỆU SUẤT</span>η = T<sub>khung</sub> / (T<sub>khung</sub> + 2 × T<sub>lan truyền</sub>) = 1 / (1 + 2a), &nbsp; a = T<sub>lan truyền</sub> / T<sub>khung</sub></div>
<div class="out"><b>Ví dụ có lời giải.</b> Đường truyền 1 Mbps, khung 1.000 bit, độ trễ lan truyền 20 ms.<br>
T<sub>khung</sub> = 1000 bit / 10⁶ bps = <b>1 ms</b> · khứ hồi = 2 × 20 = 40 ms<br>
η = 1 / (1 + 40) = <b>2,4%</b> — đường truyền nằm không 97,6% thời gian.<br>
<b>Thông lượng = 2,4% × 1 Mbps ≈ 24 kbps</b> trên một đường 1 Mbps. Dừng-và-chờ chỉ chấp nhận được khi độ trễ lan truyền rất nhỏ so với thời gian phát khung.<br>
<b>Vì sao vẫn cần số thứ tự:</b> nếu một báo nhận bị mất, bên gửi phát lại và bên nhận sẽ nhận nhầm một bản <em>trùng</em>. Một bit (0/1) là đủ — vì thế cơ chế này còn được gọi là giao thức bit luân phiên.</div>

<h3>2 · Go-Back-N (quay lui N)</h3>
<p>Gửi tối đa N khung mà không chờ. Bên nhận chỉ chấp nhận <em>đúng thứ tự</em> và vứt bỏ mọi khung sai thứ tự; báo nhận tích luỹ cho khung k nghĩa là "mọi thứ tới k đều đã tới". Khi hết giờ, bên gửi phát lại khung k và <b>mọi khung sau nó</b>.</p>
<div class="formula"><span class="lbl">HIỆU SUẤT</span>η = N / (1 + 2a) &nbsp; nếu N &lt; 1 + 2a, &nbsp; ngược lại η = 1 (đường truyền đã bão hoà)</div>
<div class="out"><b>Vẫn đường truyền đó, cửa sổ N = 7.</b> 1 + 2a = 41 → vì 7 &lt; 41 nên η = 7/41 = <b>17%</b> — tốt gấp bảy lần dừng-và-chờ, nhưng vẫn còn xa mức đầy.<br>
<b>Cửa sổ nên lớn cỡ nào?</b> Đặt N ≥ 1 + 2a = 41 → với số thứ tự 3 bit (cửa sổ tối đa 2³−1 = 7) thì không đạt được; cần ít nhất 6 bit. Đây là câu hỏi thi kinh điển "cần số thứ tự bao nhiêu bit?".<br>
<b>Điểm yếu:</b> mất khung số 3 trong dãy 3,4,5,6,7 là phải phát lại năm khung dù chỉ một khung hỏng. Trên đường truyền có cửa sổ lớn và có mất mát, phần lãng phí đó áp đảo.</div>

<h3>3 · Selective Repeat (phát lại có chọn lọc)</h3>
<p>Bên nhận đệm lại các khung sai thứ tự và báo nhận riêng từng khung; bên gửi <em>chỉ</em> phát lại đúng khung bị thiếu.</p>
<div class="out"><b>Cùng tình huống mất khung, N = 7:</b> các khung 4–7 nằm trong vùng đệm của bên nhận, chỉ khung 3 được gửi lại, và việc giao dữ liệu tiếp tục ngay khi nó tới. Một lần phát lại thay vì năm.<br>
<b>Cái giá:</b> phải có vùng đệm ở cả hai đầu, và một quy tắc cửa sổ chặt hơn — cửa sổ nhiều nhất bằng <b>một nửa</b> không gian số thứ tự (với 3 bit: 8/2 = 4, không phải 7). Nếu không, bên nhận không phân biệt được một khung cũ phát lại với một khung mới, và âm thầm nhận bản trùng như dữ liệu mới.<br>
<b>Kiểm bằng ví dụ:</b> số thứ tự 0–7, cửa sổ 5. Bên gửi gửi 0–4, tất cả đều tới, mọi báo nhận đều mất. Bên gửi phát lại 0. Cửa sổ bên nhận giờ là 5–7,0,1 — nó thấy "0" và nhận đó là dữ liệu <em>mới</em>. Hỏng dữ liệu. Với cửa sổ 4 thì hai dải không thể chồng nhau và sự nhập nhằng biến mất.</div>

<h3>Tổng kết</h3>
<table><thead><tr><th></th><th>Dừng và chờ</th><th>Go-Back-N</th><th>Selective Repeat</th></tr></thead><tbody>
<tr><td>Cửa sổ bên gửi</td><td>1</td><td>N</td><td>N</td></tr>
<tr><td>Cửa sổ bên nhận</td><td>1</td><td><b>1</b></td><td>N</td></tr>
<tr><td>Cửa sổ tối đa (k bit)</td><td>1</td><td>2<sup>k</sup> − 1</td><td><b>2<sup>k−1</sup></b></td></tr>
<tr><td>Kiểu báo nhận</td><td>riêng lẻ</td><td>tích luỹ</td><td>riêng lẻ</td></tr>
<tr><td>Phát lại khi mất</td><td>1 khung</td><td><b>toàn bộ từ k</b></td><td><b>chỉ k</b></td></tr>
<tr><td>Đệm ở bên nhận</td><td>không</td><td>không</td><td>bắt buộc</td></tr>
<tr><td>Hợp nhất khi</td><td>đường rất ngắn</td><td>tỉ lệ mất thấp</td><td>mất nhiều / đường dài băng thông lớn</td></tr>
</tbody></table>

<div class="pitfall"><b>Đừng nhầm điều khiển luồng với kiểm soát lỗi.</b> Điều khiển luồng ngăn bên gửi nhanh làm ngập bên nhận chậm (cửa sổ tính theo dung lượng đệm); kiểm soát lỗi khắc phục mất mát và hỏng dữ liệu (bộ đếm giờ và phát lại). Cửa sổ trượt tình cờ hiện thực cả hai, nên sinh viên hay gộp chúng lại — nhưng đề thi chấm chúng là hai cơ chế riêng với hai lý do riêng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>TCP là bản lai, và TCP hiện đại chính là Selective Repeat.</b> TCP cổ điển dùng báo nhận tích luỹ như Go-Back-N, nhưng với <b>SACK</b> (báo nhận có chọn lọc, RFC 2018, nay bật mặc định ở mọi nơi), bên nhận báo chính xác những khối nào đã tới, nên bên gửi chỉ phát lại đúng các lỗ hổng — tức hành vi Selective Repeat với định dạng báo nhận của Go-Back-N. Trên đường vệ tinh (a rất lớn) hoặc đường di động hay mất gói, bật SACK có thể nhân đôi thông lượng, và vì thế nó là thứ đầu tiên cần kiểm khi một lần truyền đường dài chậm bất thường. <em>Ngoài giáo trình vì môn học coi ba giao thức là các phương án loại trừ nhau, trong khi giao vận bạn dùng hằng ngày thì kết hợp chúng.</em></div>
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
            url: 'https://media.cuongthai.com/videos/academy/NWC203c/nwc203c-4-1-dinh-tuyen.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/NWC203c/nwc203c-4-1-dinh-tuyen.jpg',
            scenario: 'ip-journey',
            durationSeconds: 21,
            caption: { en: "Hop by hop: the routing table decides the next hop, not the path", vi: "Từng chặng: bảng định tuyến chọn chặng KẾ TIẾP, không chọn cả đường" },
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
          title: '4.2 — Routing algorithms, run by hand|||4.2 — Thuật toán định tuyến, chạy tay',
          slug: 'nwc203c-4-2-thuat-toan-dinh-tuyen',
          type: 'VIDEO',
          description: 'Link-state (Dijkstra) và distance-vector (Bellman–Ford) trên cùng một topo, kèm bài toán đếm-tới-vô-cực.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>How a router decides where to send a packet</h2>
<p class="lead">A routing table is just a list of "for this destination, use that next hop". The interesting question is how the routers <em>build</em> it, and there are exactly two families — one where every router learns the whole map, one where each learns only from its neighbours.</p>

<h3>The topology used in both examples</h3>
<div class="diagram">      2         3
  A ────── B ────── C
  │        │        │
 1│       4│       1│
  │        │        │
  D ────── E ────── F
      3         2</div>

<h3>1 · Link state (OSPF) — everyone gets the whole map</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Each router discovers its neighbours and its link costs.</span></div>
  <div class="lz-fitem"><b>2</b><span>It floods that information to every router in the area.</span></div>
  <div class="lz-fitem"><b>3</b><span>Every router now has an identical map of the network.</span></div>
  <div class="lz-fitem"><b>4</b><span>Each runs Dijkstra locally to compute its own shortest-path tree.</span></div>
</div>
<div class="out"><b>Dijkstra from A</b> (the same algorithm as CSD201 lesson 5.5):<br>
Init: A = 0, everything else ∞.<br>
Finalise A(0) → relax A-B: 2, A-D: 1.<br>
Smallest is D(1) → relax D-E: 1 + 3 = 4.<br>
Smallest is B(2) → relax B-C: 2 + 3 = 5, B-E: 2 + 4 = 6 (worse than 4, keep 4).<br>
Smallest is E(4) → relax E-F: 4 + 2 = 6.<br>
Smallest is C(5) → relax C-F: 5 + 1 = <b>6</b> (ties with 6 through E; keep either).<br>
Finalise F(6). <b>Routing table at A:</b> B via B (2) · C via B (5) · D via D (1) · E via D (4) · F via B or D (6).<br>
<b>Properties:</b> converges fast, no loops, but every router must store the whole topology and rerun Dijkstra on any change. Used inside one organisation (OSPF, IS-IS).</div>

<h3>2 · Distance vector (RIP) — learn only from neighbours</h3>
<p>Each router periodically tells its neighbours "here is my distance to every destination". On receiving a vector it applies the Bellman–Ford update:</p>
<div class="formula"><span class="lbl">BELLMAN–FORD</span>D<sub>x</sub>(y) = min over neighbours v of { c(x,v) + D<sub>v</sub>(y) }</div>
<div class="out"><b>Router A's view, step by step:</b><br>
<b>Round 0:</b> A knows only its direct links — B = 2, D = 1, everything else ∞.<br>
<b>Round 1:</b> B advertises C = 3, E = 4 → A computes C = 2 + 3 = 5, E = min(2 + 4, 1 + 3) = <b>4 via D</b>. D advertises E = 3 → confirms 4.<br>
<b>Round 2:</b> E advertises F = 2 → A computes F = 4 + 2 = <b>6</b>. C advertises F = 1 → A computes 5 + 1 = 6, a tie.<br>
<b>Round 3:</b> nothing changes → <b>converged</b>, with the same answers Dijkstra produced.<br>
<b>The difference:</b> A never learned the topology. It only knows "to reach F, send to B or D, cost 6" — the routing equivalent of following signposts instead of reading a map.</div>

<h3>Count-to-infinity — the failure mode of distance vector</h3>
<div class="out"><b>Setup:</b> a simple chain A — B — C. A is 1 from B, B is 1 from C. Now the link B–C breaks.<br>
B sets its distance to C = ∞. But before it can tell A, <b>A advertises "I can reach C, cost 2"</b> (its old, stale information, learned through B).<br>
B believes it: "A can do it in 2, I am 1 from A, so my cost is 3" → advertises 3.<br>
A hears 3 and updates to 4. B updates to 5. A to 6… the distance crawls upward, one round at a time, until it reaches the value that counts as infinity (16 in RIP). Packets loop between A and B for the whole time.<br>
<b>Three fixes:</b><br>
<b>a. Split horizon</b> — never advertise a route back to the neighbour you learned it from. A would not have told B about C at all.<br>
<b>b. Poison reverse</b> — advertise it back with cost ∞, which is explicit rather than silent.<br>
<b>c. Define a small infinity</b> — RIP uses 16, so the loop ends within seconds instead of minutes (and caps network diameter at 15 hops).</div>

<h3>Comparison</h3>
<table><thead><tr><th></th><th>Link state (OSPF)</th><th>Distance vector (RIP)</th></tr></thead><tbody>
<tr><td>Each router knows</td><td><b>the whole topology</b></td><td>only distances via neighbours</td></tr>
<tr><td>Sends</td><td>link states, to everyone</td><td>its whole table, to neighbours</td></tr>
<tr><td>Computation</td><td>Dijkstra, O(n²) locally</td><td>Bellman–Ford, distributed</td></tr>
<tr><td>Convergence</td><td><b>fast</b></td><td>slow (count-to-infinity)</td></tr>
<tr><td>Memory</td><td>high</td><td><b>low</b></td></tr>
<tr><td>Scale</td><td>large networks, split into areas</td><td>small networks (≤ 15 hops)</td></tr>
</tbody></table>

<div class="pitfall"><b>"Shortest" means lowest <em>cost</em>, not fewest hops.</b> RIP counts hops, so it happily picks a 1 Mbps link over two 1 Gbps links. OSPF derives cost from bandwidth (cost = reference ÷ bandwidth), which is why a link-state protocol makes better decisions on a heterogeneous network — and why a hop-count answer is marked wrong when the question gives you link costs.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>BGP routes by policy, not by distance.</b> Between organisations the Internet runs BGP, a <em>path-vector</em> protocol: each announcement carries the full list of autonomous systems it crossed, which both prevents loops (reject any path containing yourself) and lets an operator choose on commercial grounds — "prefer a customer's route over a peer's, even if it is longer". So the packet from Hanoi to Singapore may take the longer path because of a contract, not physics. It also means a single misconfigured announcement can black-hole a country: in 2008 Pakistan Telecom accidentally advertised YouTube's prefix and took the site offline worldwide for two hours. <em>Beyond syllabus because the course teaches optimal routing, while the Internet's real routing optimises money and trust.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Bộ định tuyến quyết định gửi gói đi đâu như thế nào</h2>
<p class="lead">Bảng định tuyến chỉ là một danh sách "đi tới đích này thì chuyển cho chặng kế tiếp kia". Câu hỏi thú vị là các bộ định tuyến <em>dựng</em> bảng đó ra sao, và có đúng hai họ — một họ mà mọi router học cả tấm bản đồ, một họ mà mỗi router chỉ học từ hàng xóm.</p>

<h3>Topo dùng cho cả hai ví dụ</h3>
<div class="diagram">      2         3
  A ────── B ────── C
  │        │        │
 1│       4│       1│
  │        │        │
  D ────── E ────── F
      3         2</div>

<h3>1 · Trạng thái liên kết (OSPF) — ai cũng có cả bản đồ</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Mỗi router phát hiện hàng xóm của mình và chi phí các liên kết.</span></div>
  <div class="lz-fitem"><b>2</b><span>Nó phát tràn thông tin đó tới mọi router trong vùng.</span></div>
  <div class="lz-fitem"><b>3</b><span>Giờ mọi router đều có một tấm bản đồ mạng giống hệt nhau.</span></div>
  <div class="lz-fitem"><b>4</b><span>Mỗi router tự chạy Dijkstra cục bộ để tính cây đường đi ngắn nhất của mình.</span></div>
</div>
<div class="out"><b>Dijkstra từ A</b> (đúng thuật toán ở CSD201 bài 5.5):<br>
Khởi tạo: A = 0, mọi đỉnh khác ∞.<br>
Chốt A(0) → nới A-B: 2, A-D: 1.<br>
Nhỏ nhất là D(1) → nới D-E: 1 + 3 = 4.<br>
Nhỏ nhất là B(2) → nới B-C: 2 + 3 = 5, B-E: 2 + 4 = 6 (tệ hơn 4, giữ 4).<br>
Nhỏ nhất là E(4) → nới E-F: 4 + 2 = 6.<br>
Nhỏ nhất là C(5) → nới C-F: 5 + 1 = <b>6</b> (hoà với 6 qua E; giữ cái nào cũng được).<br>
Chốt F(6). <b>Bảng định tuyến tại A:</b> B qua B (2) · C qua B (5) · D qua D (1) · E qua D (4) · F qua B hoặc D (6).<br>
<b>Tính chất:</b> hội tụ nhanh, không sinh vòng lặp, nhưng mọi router phải lưu cả topo và chạy lại Dijkstra mỗi khi có thay đổi. Dùng trong nội bộ một tổ chức (OSPF, IS-IS).</div>

<h3>2 · Véc-tơ khoảng cách (RIP) — chỉ học từ hàng xóm</h3>
<p>Mỗi router định kỳ nói với hàng xóm "đây là khoảng cách của tôi tới mọi đích". Khi nhận một véc-tơ, nó áp dụng phép cập nhật Bellman–Ford:</p>
<div class="formula"><span class="lbl">BELLMAN–FORD</span>D<sub>x</sub>(y) = min trên mọi hàng xóm v của { c(x,v) + D<sub>v</sub>(y) }</div>
<div class="out"><b>Góc nhìn của router A, từng bước:</b><br>
<b>Vòng 0:</b> A chỉ biết các liên kết trực tiếp — B = 2, D = 1, còn lại ∞.<br>
<b>Vòng 1:</b> B quảng bá C = 3, E = 4 → A tính C = 2 + 3 = 5, E = min(2 + 4, 1 + 3) = <b>4 qua D</b>. D quảng bá E = 3 → xác nhận 4.<br>
<b>Vòng 2:</b> E quảng bá F = 2 → A tính F = 4 + 2 = <b>6</b>. C quảng bá F = 1 → A tính 5 + 1 = 6, hoà.<br>
<b>Vòng 3:</b> không có gì đổi → <b>đã hội tụ</b>, với đúng những kết quả mà Dijkstra cho ra.<br>
<b>Khác biệt:</b> A không hề học được topo. Nó chỉ biết "muốn tới F thì gửi cho B hoặc D, chi phí 6" — tương đương với việc đi theo biển chỉ đường thay vì đọc bản đồ.</div>

<h3>Đếm tới vô cực — kiểu hỏng của véc-tơ khoảng cách</h3>
<div class="out"><b>Tình huống:</b> một chuỗi đơn giản A — B — C. A cách B là 1, B cách C là 1. Giờ liên kết B–C đứt.<br>
B đặt khoảng cách tới C = ∞. Nhưng trước khi nó kịp báo cho A thì <b>A quảng bá "tôi tới được C, chi phí 2"</b> (thông tin cũ, học được qua chính B).<br>
B tin ngay: "A làm được với chi phí 2, tôi cách A là 1, vậy chi phí của tôi là 3" → quảng bá 3.<br>
A nghe thấy 3 và cập nhật thành 4. B thành 5. A thành 6… khoảng cách bò lên từng vòng một, cho tới khi chạm giá trị được coi là vô cực (16 trong RIP). Suốt thời gian đó, gói tin lượn vòng giữa A và B.<br>
<b>Ba cách chữa:</b><br>
<b>a. Split horizon</b> — không bao giờ quảng bá một tuyến ngược lại chính hàng xóm đã dạy cho mình. A sẽ không hề nói với B về C.<br>
<b>b. Poison reverse</b> — quảng bá ngược lại với chi phí ∞, tức nói thẳng ra thay vì im lặng.<br>
<b>c. Định nghĩa một "vô cực" nhỏ</b> — RIP dùng 16, nên vòng lặp kết thúc trong vài giây thay vì vài phút (đổi lại đường kính mạng bị chặn ở 15 chặng).</div>

<h3>So sánh</h3>
<table><thead><tr><th></th><th>Trạng thái liên kết (OSPF)</th><th>Véc-tơ khoảng cách (RIP)</th></tr></thead><tbody>
<tr><td>Mỗi router biết</td><td><b>toàn bộ topo</b></td><td>chỉ khoảng cách qua hàng xóm</td></tr>
<tr><td>Gửi đi</td><td>trạng thái liên kết, tới mọi router</td><td>cả bảng của mình, cho hàng xóm</td></tr>
<tr><td>Tính toán</td><td>Dijkstra, O(n²) cục bộ</td><td>Bellman–Ford, phân tán</td></tr>
<tr><td>Hội tụ</td><td><b>nhanh</b></td><td>chậm (đếm tới vô cực)</td></tr>
<tr><td>Bộ nhớ</td><td>nhiều</td><td><b>ít</b></td></tr>
<tr><td>Quy mô</td><td>mạng lớn, chia thành vùng</td><td>mạng nhỏ (≤ 15 chặng)</td></tr>
</tbody></table>

<div class="pitfall"><b>"Ngắn nhất" nghĩa là <em>chi phí</em> thấp nhất, không phải ít chặng nhất.</b> RIP đếm chặng, nên nó vui vẻ chọn một liên kết 1 Mbps thay vì hai liên kết 1 Gbps. OSPF suy chi phí từ băng thông (chi phí = tham chiếu ÷ băng thông), và vì thế giao thức trạng thái liên kết ra quyết định tốt hơn trên mạng không đồng nhất — cũng là lý do đáp án tính theo số chặng bị chấm sai khi đề đã cho chi phí liên kết.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>BGP định tuyến theo chính sách, không theo khoảng cách.</b> Giữa các tổ chức, Internet chạy BGP — một giao thức <em>véc-tơ đường đi</em>: mỗi thông báo mang theo danh sách đầy đủ các hệ tự trị mà nó đã đi qua, vừa chống vòng lặp (thấy chính mình trong đường đi thì loại) vừa cho phép nhà mạng chọn theo lý do thương mại — "ưu tiên tuyến của khách hàng hơn tuyến của đối tác ngang hàng, kể cả khi nó dài hơn". Nên gói tin từ Hà Nội sang Singapore có thể đi đường dài hơn vì một hợp đồng, chứ không phải vì vật lý. Điều đó cũng nghĩa là một thông báo cấu hình sai có thể nuốt chửng lưu lượng cả một quốc gia: năm 2008, Pakistan Telecom vô tình quảng bá dải địa chỉ của YouTube và làm trang này biến mất trên toàn cầu suốt hai giờ. <em>Ngoài giáo trình vì môn học dạy định tuyến tối ưu, còn định tuyến thật của Internet thì tối ưu tiền bạc và niềm tin.</em></div>
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
            url: 'https://media.cuongthai.com/videos/academy/NWC203c/nwc203c-5-1-ip-subnet.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/NWC203c/nwc203c-5-1-ip-subnet.jpg',
            scenario: 'ip-journey',
            durationSeconds: 26,
            caption: { en: "A private 192.168.x address the Internet refuses to route — and NAT", vi: "Địa chỉ riêng 192.168.x mà Internet từ chối định tuyến — và NAT" },
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
          title: '5.2 — Subnetting & VLSM, step by step|||5.2 — Chia mạng con & VLSM, từng bước',
          slug: 'nwc203c-5-2-subnetting',
          type: 'VIDEO',
          description: 'Bài tập chia mạng con đầy đủ: tính mask, số host, dải địa chỉ, broadcast — và VLSM cho bốn phòng ban.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>The calculation that appears in every network exam</h2>
<p class="lead">Lesson 5.1 introduced IP addresses and masks. This lesson is pure procedure: given a network and a requirement, produce the subnets, their ranges, their broadcast addresses and their usable host counts — without a calculator.</p>

<div class="formula"><span class="lbl">THE THREE FORMULAS</span>subnets = 2<sup>s</sup> &nbsp;·&nbsp; hosts per subnet = 2<sup>h</sup> − 2 &nbsp;·&nbsp; block size = 256 − mask octet</div>
<p>where <b>s</b> = bits borrowed from the host part and <b>h</b> = host bits left. The −2 removes the network address (all host bits 0) and the broadcast address (all host bits 1).</p>

<h3>The mask table to memorise</h3>
<table><thead><tr><th>CIDR</th><th>Mask</th><th>Block</th><th>Usable hosts</th></tr></thead><tbody>
<tr><td>/24</td><td>255.255.255.0</td><td>256</td><td>254</td></tr>
<tr><td>/25</td><td>255.255.255.128</td><td>128</td><td>126</td></tr>
<tr><td>/26</td><td>255.255.255.192</td><td>64</td><td>62</td></tr>
<tr><td>/27</td><td>255.255.255.224</td><td>32</td><td>30</td></tr>
<tr><td>/28</td><td>255.255.255.240</td><td>16</td><td>14</td></tr>
<tr><td>/29</td><td>255.255.255.248</td><td>8</td><td>6</td></tr>
<tr><td>/30</td><td>255.255.255.252</td><td>4</td><td><b>2</b> (router links)</td></tr>
</tbody></table>

<h3>Worked example 1 — fixed-size subnetting</h3>
<div class="out"><b>Task: split 192.168.10.0/24 into 4 equal subnets.</b><br>
<b>Step 1 — how many bits to borrow?</b> 4 subnets = 2² → borrow <b>2 bits</b> → new prefix /24 + 2 = <b>/26</b>.<br>
<b>Step 2 — the mask.</b> /26 → 255.255.255.<b>192</b> (11000000).<br>
<b>Step 3 — the block size.</b> 256 − 192 = <b>64</b>. Subnets therefore start at 0, 64, 128, 192.<br>
<b>Step 4 — write the table.</b> Host bits h = 32 − 26 = 6 → 2⁶ − 2 = <b>62 usable hosts</b> each.<br>
<pre>Subnet   Network         First host      Last host       Broadcast
  1      192.168.10.0    .1              .62             192.168.10.63
  2      192.168.10.64   .65             .126            192.168.10.127
  3      192.168.10.128  .129            .190            192.168.10.191
  4      192.168.10.192  .193            .254            192.168.10.255</pre>
<b>Check:</b> 4 × 64 = 256 ✓ the whole /24 is used, and each broadcast is one less than the next network address.<br>
<b>Which subnet is 192.168.10.100 in?</b> 100 ÷ 64 = 1 remainder 36 → it is in the block starting at 64 → <b>subnet 2</b>, a valid host address.</div>

<h3>Worked example 2 — VLSM (variable length), the realistic case</h3>
<div class="out"><b>Task:</b> from 172.16.0.0/24, address four departments: Sales 100 hosts, IT 50, HR 25, and a router-to-router link with 2.<br>
<b>Rule: always allocate the largest requirement first</b>, otherwise you fragment the space and cannot fit the big block later.<br>
<b>1 · Sales, 100 hosts.</b> Need 2ʰ − 2 ≥ 100 → h = 7 (126 hosts) → prefix /25, block 128.<br>
&nbsp;&nbsp;→ <b>172.16.0.0/25</b> · hosts .1–.126 · broadcast .127<br>
<b>2 · IT, 50 hosts.</b> h = 6 (62) → /26, block 64. Start after 127 → 128.<br>
&nbsp;&nbsp;→ <b>172.16.0.128/26</b> · hosts .129–.190 · broadcast .191<br>
<b>3 · HR, 25 hosts.</b> h = 5 (30) → /27, block 32. Start after 191 → 192.<br>
&nbsp;&nbsp;→ <b>172.16.0.192/27</b> · hosts .193–.222 · broadcast .223<br>
<b>4 · Router link, 2 hosts.</b> h = 2 (2) → /30, block 4. Start after 223 → 224.<br>
&nbsp;&nbsp;→ <b>172.16.0.224/30</b> · hosts .225–.226 · broadcast .227<br>
<b>Used: 0–227. Remaining 172.16.0.228–255 is free for future growth.</b><br>
<b>Compare with fixed-size subnetting:</b> four equal /26 blocks would give 62 hosts each — Sales (100) would not fit at all. VLSM is what makes the address space usable.</div>

<h3>The reverse question: given an address and a mask, describe it</h3>
<div class="out"><b>Given 10.20.30.77/27 — find the network, broadcast and host range.</b><br>
Block = 256 − 224 = 32 → boundaries at 0, 32, 64, <b>96</b>, 128…<br>
77 falls between 64 and 95 → <b>network = 10.20.30.64</b>, <b>broadcast = 10.20.30.95</b>, hosts .65–.94, and 77 is a valid host.<br>
<b>The trick:</b> divide the relevant octet by the block size and take the floor — 77 ÷ 32 = 2 → 2 × 32 = 64. Two seconds, no binary.</div>

<div class="pitfall"><b>The first and last address of every subnet are unusable.</b> Assigning a host 192.168.10.64 as a plain address inside a /24 works, but inside a /26 it is a <em>network address</em> and the host will not communicate. This is the single most common configuration mistake — and the exam always includes one address that is a network or broadcast address in disguise.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>IPv6 has no subnetting arithmetic, because it has no scarcity.</b> Every LAN gets a /64 — 18 quintillion addresses — regardless of whether it holds 3 devices or 3,000, and hosts configure themselves with SLAAC instead of DHCP. All the effort above exists purely because IPv4's 4.3 billion addresses ran out in 2011. The transition is slow because NAT (lesson 5.3) made IPv4 tolerable, which is the classic pattern: a good enough workaround delays the real fix by decades. <em>Beyond syllabus because the course teaches IPv4 subnetting in depth, while the protocol designed to replace it removes the whole problem.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Phép tính xuất hiện trong mọi kỳ thi mạng</h2>
<p class="lead">Bài 5.1 đã giới thiệu địa chỉ IP và mặt nạ mạng. Bài này thuần quy trình: cho một mạng và một yêu cầu, hãy tạo ra các mạng con, dải địa chỉ, địa chỉ quảng bá và số host dùng được — mà không cần máy tính.</p>

<div class="formula"><span class="lbl">BA CÔNG THỨC</span>số mạng con = 2<sup>s</sup> &nbsp;·&nbsp; host mỗi mạng = 2<sup>h</sup> − 2 &nbsp;·&nbsp; cỡ khối = 256 − octet mặt nạ</div>
<p>trong đó <b>s</b> = số bit mượn từ phần host và <b>h</b> = số bit host còn lại. Phép −2 loại địa chỉ mạng (mọi bit host bằng 0) và địa chỉ quảng bá (mọi bit host bằng 1).</p>

<h3>Bảng mặt nạ cần thuộc</h3>
<table><thead><tr><th>CIDR</th><th>Mặt nạ</th><th>Cỡ khối</th><th>Host dùng được</th></tr></thead><tbody>
<tr><td>/24</td><td>255.255.255.0</td><td>256</td><td>254</td></tr>
<tr><td>/25</td><td>255.255.255.128</td><td>128</td><td>126</td></tr>
<tr><td>/26</td><td>255.255.255.192</td><td>64</td><td>62</td></tr>
<tr><td>/27</td><td>255.255.255.224</td><td>32</td><td>30</td></tr>
<tr><td>/28</td><td>255.255.255.240</td><td>16</td><td>14</td></tr>
<tr><td>/29</td><td>255.255.255.248</td><td>8</td><td>6</td></tr>
<tr><td>/30</td><td>255.255.255.252</td><td>4</td><td><b>2</b> (đường nối router)</td></tr>
</tbody></table>

<h3>Ví dụ có lời giải 1 — chia mạng con cỡ bằng nhau</h3>
<div class="out"><b>Đề: chia 192.168.10.0/24 thành 4 mạng con bằng nhau.</b><br>
<b>Bước 1 — mượn bao nhiêu bit?</b> 4 mạng con = 2² → mượn <b>2 bit</b> → tiền tố mới /24 + 2 = <b>/26</b>.<br>
<b>Bước 2 — mặt nạ.</b> /26 → 255.255.255.<b>192</b> (11000000).<br>
<b>Bước 3 — cỡ khối.</b> 256 − 192 = <b>64</b>. Vậy các mạng con bắt đầu ở 0, 64, 128, 192.<br>
<b>Bước 4 — lập bảng.</b> Số bit host h = 32 − 26 = 6 → 2⁶ − 2 = <b>62 host dùng được</b> mỗi mạng.<br>
<pre>Mạng con  Địa chỉ mạng    Host đầu       Host cuối       Quảng bá
   1      192.168.10.0    .1             .62             192.168.10.63
   2      192.168.10.64   .65            .126            192.168.10.127
   3      192.168.10.128  .129           .190            192.168.10.191
   4      192.168.10.192  .193           .254            192.168.10.255</pre>
<b>Kiểm:</b> 4 × 64 = 256 ✓ dùng hết cả /24, và mỗi địa chỉ quảng bá nhỏ hơn địa chỉ mạng kế tiếp đúng 1.<br>
<b>192.168.10.100 nằm ở mạng con nào?</b> 100 ÷ 64 = 1 dư 36 → nằm trong khối bắt đầu từ 64 → <b>mạng con 2</b>, và là một địa chỉ host hợp lệ.</div>

<h3>Ví dụ có lời giải 2 — VLSM (độ dài thay đổi), tình huống thực tế</h3>
<div class="out"><b>Đề:</b> từ 172.16.0.0/24, hãy cấp địa chỉ cho bốn bộ phận: Kinh doanh 100 host, IT 50, Nhân sự 25, và một đường nối router–router 2 host.<br>
<b>Quy tắc: luôn cấp cho nhu cầu LỚN NHẤT trước</b>, nếu không bạn sẽ băm nhỏ không gian và về sau không nhét vừa khối lớn.<br>
<b>1 · Kinh doanh, 100 host.</b> Cần 2ʰ − 2 ≥ 100 → h = 7 (126 host) → tiền tố /25, khối 128.<br>
&nbsp;&nbsp;→ <b>172.16.0.0/25</b> · host .1–.126 · quảng bá .127<br>
<b>2 · IT, 50 host.</b> h = 6 (62) → /26, khối 64. Bắt đầu sau 127 → 128.<br>
&nbsp;&nbsp;→ <b>172.16.0.128/26</b> · host .129–.190 · quảng bá .191<br>
<b>3 · Nhân sự, 25 host.</b> h = 5 (30) → /27, khối 32. Bắt đầu sau 191 → 192.<br>
&nbsp;&nbsp;→ <b>172.16.0.192/27</b> · host .193–.222 · quảng bá .223<br>
<b>4 · Đường nối router, 2 host.</b> h = 2 (2) → /30, khối 4. Bắt đầu sau 223 → 224.<br>
&nbsp;&nbsp;→ <b>172.16.0.224/30</b> · host .225–.226 · quảng bá .227<br>
<b>Đã dùng: 0–227. Phần còn lại 172.16.0.228–255 để dành cho mở rộng.</b><br>
<b>So với chia đều:</b> bốn khối /26 bằng nhau chỉ cho 62 host mỗi khối — bộ phận Kinh doanh (100) không nhét vừa. Chính VLSM mới làm không gian địa chỉ dùng được.</div>

<h3>Câu hỏi ngược: cho một địa chỉ và mặt nạ, hãy mô tả nó</h3>
<div class="out"><b>Cho 10.20.30.77/27 — tìm địa chỉ mạng, quảng bá và dải host.</b><br>
Cỡ khối = 256 − 224 = 32 → các mốc ở 0, 32, 64, <b>96</b>, 128…<br>
77 nằm giữa 64 và 95 → <b>mạng = 10.20.30.64</b>, <b>quảng bá = 10.20.30.95</b>, host .65–.94, và 77 là host hợp lệ.<br>
<b>Mẹo:</b> chia octet đang xét cho cỡ khối rồi lấy phần nguyên — 77 ÷ 32 = 2 → 2 × 32 = 64. Hai giây, không cần đổi nhị phân.</div>

<div class="pitfall"><b>Địa chỉ đầu và cuối của mọi mạng con đều không dùng được.</b> Gán cho một máy địa chỉ 192.168.10.64 trong một mạng /24 thì chạy, nhưng trong /26 nó là <em>địa chỉ mạng</em> và máy đó sẽ không liên lạc được. Đây là lỗi cấu hình phổ biến nhất — và đề thi luôn cài sẵn một địa chỉ thực chất là địa chỉ mạng hoặc quảng bá trá hình.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>IPv6 không có phép tính chia mạng con, vì nó không khan hiếm.</b> Mỗi mạng LAN được cấp một /64 — 18 tỉ tỉ địa chỉ — bất kể nó chứa 3 thiết bị hay 3.000, và máy tự cấu hình bằng SLAAC thay vì DHCP. Toàn bộ công sức ở trên tồn tại thuần tuý vì 4,3 tỉ địa chỉ IPv4 đã cạn từ năm 2011. Quá trình chuyển đổi chậm chạp vì NAT (bài 5.3) đã làm IPv4 vẫn "chịu được", và đó là khuôn mẫu kinh điển: một giải pháp chắp vá đủ tốt trì hoãn bản sửa thật sự hàng chục năm. <em>Ngoài giáo trình vì môn học dạy chia mạng con IPv4 rất kỹ, trong khi giao thức sinh ra để thay thế nó lại xoá bỏ toàn bộ bài toán.</em></div>
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
              url: 'https://media.cuongthai.com/videos/academy/NWC203c/nwc203c-6-1-tcp--tcp-handshake.mp4',
              poster: 'https://media.cuongthai.com/videos/academy/NWC203c/nwc203c-6-1-tcp--tcp-handshake.jpg',
              durationSeconds: 21,
              scenario: 'tcp-handshake',
              caption: { en: 'Three-way handshake, then the four-way close', vi: 'Bắt tay ba bước, rồi bốn bước đóng' },
            },
            {
              url: 'https://media.cuongthai.com/videos/academy/NWC203c/nwc203c-6-1-tcp--tcp-window.mp4',
              poster: 'https://media.cuongthai.com/videos/academy/NWC203c/nwc203c-6-1-tcp--tcp-window.jpg',
              durationSeconds: 21,
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
          title: '6.2 — TCP congestion control|||6.2 — Điều khiển tắc nghẽn của TCP',
          slug: 'nwc203c-6-2-tac-nghen',
          type: 'VIDEO',
          description: 'Slow start, AIMD, fast retransmit/recovery — vẽ được đồ thị cửa sổ tắc nghẽn và tính từng vòng RTT.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>How TCP shares a network nobody is coordinating</h2>
<p class="lead">Flow control (lesson 6.1) protects the <em>receiver</em>. Congestion control protects the <em>network</em> — and it must work with no help from the routers, no idea how many other senders exist, and no measurement other than "did my packet arrive?".</p>

<div class="formula"><span class="lbl">SENDING WINDOW</span>window = min( rwnd , cwnd ) &nbsp;·&nbsp; rwnd from the receiver, cwnd from the sender's own estimate</div>

<h3>The two phases</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Slow start</b> — cwnd starts at 1 MSS and <b>doubles every RTT</b> (+1 MSS per ACK). Exponential, despite the name: "slow" refers to the starting point, not the growth. It runs until cwnd reaches the threshold <span class="badge">ssthresh</span> or a loss occurs.</div>
  <div class="lz-layer"><b>Congestion avoidance</b> — above ssthresh, cwnd grows by <b>1 MSS per RTT</b>, linearly. This is the "additive increase" of AIMD: probe cautiously for more bandwidth.</div>
</div>
<div class="formula"><span class="lbl">AIMD</span>increase: cwnd += 1 MSS per RTT &nbsp;·&nbsp; decrease on loss: cwnd = cwnd / 2</div>

<h3>Worked example — trace cwnd round by round</h3>
<div class="out"><b>Start: cwnd = 1, ssthresh = 16 (in MSS units).</b><br>
RTT 1: cwnd = 1 → 2 · RTT 2: 2 → 4 · RTT 3: 4 → 8 · RTT 4: 8 → <b>16</b> (slow start ends, ssthresh reached)<br>
RTT 5: 16 → 17 · RTT 6: 17 → 18 · RTT 7: 18 → 19 · RTT 8: 19 → <b>20, and a loss is detected by timeout</b><br>
<b>On timeout (severe congestion):</b> ssthresh = 20 / 2 = <b>10</b>, and cwnd resets to <b>1</b> → slow start again.<br>
RTT 9: 1 → 2 · RTT 10: 2 → 4 · RTT 11: 4 → 8 · RTT 12: 8 → 10 (ssthresh) → then linear again.<br>
<b>On three duplicate ACKs instead (mild congestion — later packets are still arriving):</b> <span class="badge">fast retransmit</span> resends the missing segment immediately without waiting for the timer, and <span class="badge">fast recovery</span> sets ssthresh = cwnd/2 and cwnd = ssthresh — halving instead of collapsing to 1. This is TCP Reno, and the difference between the two reactions is the most-asked exam point in this chapter.</div>

<h3>Why the graph looks like a saw</h3>
<div class="diagram">cwnd
 20 |        /|            /|
    |       / |           / |
 10 |──────/  |─────────/   |──── ssthresh
    |  /      |      /      |
  1 |_/_______|____/________|______→ time (RTT)
     slow   loss  slow    loss
     start        start</div>
<p>Every TCP connection is constantly probing upward until it causes a loss, then backing off. The <b>sawtooth</b> is not a defect — it is how a distributed system with no central controller discovers the available capacity and shares it fairly. AIMD provably converges to an equal split between flows sharing a bottleneck.</p>

<h3>Loss as the congestion signal</h3>
<div class="out"><b>The assumption:</b> a packet is lost because a router queue overflowed, therefore loss means congestion.<br>
<b>Where the assumption breaks:</b> on a wireless link, packets are also lost to interference. TCP halves its window although the network is not congested at all — which is why Wi-Fi and mobile throughput used to be poor, and why the link layer retransmits internally (lesson 3.2) to hide those losses from TCP.<br>
<b>Rough throughput model:</b> throughput ≈ MSS / (RTT × √p) for loss probability p. A 100 ms transatlantic RTT with 0.1% loss caps a single flow at a few Mbps regardless of how fast the link is — which is why bulk transfers open many parallel connections.</div>

<div class="pitfall"><b>Do not confuse flow control with congestion control.</b> <span class="badge">rwnd</span> is advertised by the receiver and protects <em>its buffer</em>; <span class="badge">cwnd</span> is computed by the sender and protects <em>the network</em>. The actual sending window is the minimum of the two, and an exam answer that names only one of them is half an answer.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>BBR: measuring the pipe instead of waiting for it to overflow.</b> Loss-based TCP keeps router queues full by design — it only backs off <em>after</em> the queue overflows, which adds hundreds of milliseconds of latency to everyone sharing that router ("bufferbloat"). Google's BBR instead estimates the bottleneck bandwidth and the minimum RTT, and paces packets to exactly that rate, keeping queues nearly empty. On YouTube it raised throughput and cut median latency substantially, and it is now standard on Linux. The philosophical shift is large: congestion is a property of the <em>rate</em>, and loss was only ever a proxy for it. <em>Beyond syllabus because the course teaches Reno's sawtooth, while the transport carrying most of the Internet's video no longer draws one.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Cách TCP chia sẻ một mạng mà không ai điều phối</h2>
<p class="lead">Điều khiển luồng (bài 6.1) bảo vệ <em>bên nhận</em>. Điều khiển tắc nghẽn bảo vệ <em>mạng</em> — và nó phải làm việc đó mà không có sự trợ giúp nào từ router, không biết có bao nhiêu bên gửi khác, và không đo được gì ngoài "gói của tôi có tới nơi không?".</p>

<div class="formula"><span class="lbl">CỬA SỔ GỬI</span>cửa sổ = min( rwnd , cwnd ) &nbsp;·&nbsp; rwnd do bên nhận báo, cwnd do bên gửi tự ước lượng</div>

<h3>Hai pha</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Khởi động chậm</b> — cwnd bắt đầu ở 1 MSS và <b>nhân đôi sau mỗi RTT</b> (+1 MSS mỗi báo nhận). Thực chất là hàm mũ bất chấp cái tên: "chậm" nói về điểm xuất phát, không nói về tốc độ tăng. Nó chạy tới khi cwnd chạm ngưỡng <span class="badge">ssthresh</span> hoặc xảy ra mất gói.</div>
  <div class="lz-layer"><b>Tránh tắc nghẽn</b> — trên ngưỡng ssthresh, cwnd chỉ tăng <b>1 MSS mỗi RTT</b>, tuyến tính. Đây là phần "tăng cộng" của AIMD: dò tìm thêm băng thông một cách thận trọng.</div>
</div>
<div class="formula"><span class="lbl">AIMD</span>tăng: cwnd += 1 MSS mỗi RTT &nbsp;·&nbsp; giảm khi mất gói: cwnd = cwnd / 2</div>

<h3>Ví dụ có lời giải — theo dõi cwnd qua từng vòng</h3>
<div class="out"><b>Bắt đầu: cwnd = 1, ssthresh = 16 (đơn vị MSS).</b><br>
RTT 1: cwnd = 1 → 2 · RTT 2: 2 → 4 · RTT 3: 4 → 8 · RTT 4: 8 → <b>16</b> (hết khởi động chậm, chạm ssthresh)<br>
RTT 5: 16 → 17 · RTT 6: 17 → 18 · RTT 7: 18 → 19 · RTT 8: 19 → <b>20, và phát hiện mất gói do hết giờ chờ</b><br>
<b>Khi hết giờ chờ (tắc nghẽn nặng):</b> ssthresh = 20 / 2 = <b>10</b>, và cwnd đặt lại về <b>1</b> → khởi động chậm lại từ đầu.<br>
RTT 9: 1 → 2 · RTT 10: 2 → 4 · RTT 11: 4 → 8 · RTT 12: 8 → 10 (ssthresh) → rồi tăng tuyến tính.<br>
<b>Còn khi nhận ba báo nhận trùng (tắc nghẽn nhẹ — các gói sau vẫn đang tới):</b> <span class="badge">phát lại nhanh</span> gửi lại ngay đoạn bị thiếu mà không chờ hết giờ, và <span class="badge">phục hồi nhanh</span> đặt ssthresh = cwnd/2 rồi cwnd = ssthresh — giảm một nửa thay vì sụp về 1. Đó là TCP Reno, và khác biệt giữa hai phản ứng này là điểm được hỏi nhiều nhất trong chương.</div>

<h3>Vì sao đồ thị trông như răng cưa</h3>
<div class="diagram">cwnd
 20 |        /|            /|
    |       / |           / |
 10 |──────/  |─────────/   |──── ssthresh
    |  /      |      /      |
  1 |_/_______|____/________|______→ thời gian (RTT)
     khởi   mất   khởi    mất
     động   gói   động    gói</div>
<p>Mọi kết nối TCP đều liên tục dò lên trên cho tới khi gây ra mất gói rồi lùi lại. Hình <b>răng cưa</b> không phải khiếm khuyết — đó là cách một hệ phân tán không có bộ điều khiển trung tâm khám phá ra dung lượng khả dụng và chia sẻ nó một cách công bằng. AIMD chứng minh được là hội tụ về phần chia đều giữa các luồng cùng dùng một nút thắt.</p>

<h3>Mất gói làm tín hiệu tắc nghẽn</h3>
<div class="out"><b>Giả định:</b> gói mất là do hàng đợi router bị tràn, nên mất gói nghĩa là tắc nghẽn.<br>
<b>Chỗ giả định đó vỡ:</b> trên đường không dây, gói còn mất do nhiễu. TCP giảm nửa cửa sổ dù mạng chẳng hề tắc nghẽn — đó là lý do thông lượng Wi-Fi và di động từng rất tệ, và cũng là lý do tầng liên kết tự phát lại bên trong (bài 3.2) để giấu những mất mát đó khỏi TCP.<br>
<b>Mô hình thông lượng thô:</b> thông lượng ≈ MSS / (RTT × √p) với p là xác suất mất gói. RTT xuyên Đại Tây Dương 100 ms cùng tỉ lệ mất 0,1% chặn một luồng đơn ở mức vài Mbps bất kể đường truyền nhanh cỡ nào — vì thế các phép truyền khối lượng lớn phải mở nhiều kết nối song song.</div>

<div class="pitfall"><b>Đừng nhầm điều khiển luồng với điều khiển tắc nghẽn.</b> <span class="badge">rwnd</span> do bên nhận quảng bá và bảo vệ <em>vùng đệm của nó</em>; <span class="badge">cwnd</span> do bên gửi tự tính và bảo vệ <em>mạng</em>. Cửa sổ gửi thật sự là giá trị nhỏ hơn trong hai cái, và một đáp án chỉ nêu một trong hai mới được nửa điểm.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>BBR: đo cái ống thay vì chờ nó tràn.</b> TCP dựa trên mất gói vốn giữ hàng đợi router luôn đầy theo đúng thiết kế — nó chỉ lùi lại <em>sau khi</em> hàng đợi tràn, và điều đó cộng thêm hàng trăm mili-giây độ trễ cho mọi người dùng chung router ấy ("bufferbloat"). Thay vào đó, BBR của Google ước lượng băng thông nút thắt và RTT nhỏ nhất, rồi rải gói đúng đúng tốc độ đó, giữ hàng đợi gần như rỗng. Trên YouTube, nó nâng thông lượng và cắt đáng kể độ trễ trung vị, và nay đã là chuẩn trên Linux. Sự dịch chuyển về tư tưởng là rất lớn: tắc nghẽn là tính chất của <em>tốc độ</em>, còn mất gói xưa nay chỉ là một đại lượng thay thế cho nó. <em>Ngoài giáo trình vì môn học dạy răng cưa của Reno, còn giao vận đang cõng phần lớn video của Internet thì không còn vẽ ra hình răng cưa nào nữa.</em></div>
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
            url: 'https://media.cuongthai.com/videos/academy/NWC203c/nwc203c-n1-1-hanh-trinh.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/NWC203c/nwc203c-n1-1-hanh-trinh.jpg',
            scenario: 'osi-layers',
            durationSeconds: 21,
            caption: { en: "Unwrapping the layers on the receiving side", vi: "Bóc từng lớp tiêu đề ở phía nhận" },
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
