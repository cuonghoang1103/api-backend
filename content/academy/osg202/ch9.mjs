/**
 * OSG202 · Chương 9 — Security (osg9: 9.A 1–28, 9.B 29–54).
 * Bài 📑 học theo từng slide: osg9 (tmp_09.pptx, slide 1–54).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: osg202-on-ch9.
 * Quiz MỚI (10 câu, slug osg202-quiz-ch9).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs từ gen/src/**, gen/code/**, gen/sim/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node OSG202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 9.A — 📑 Slide by slide · Security by design: domains, ACLs, capabilities, models, cryptography, authentication (slides 1–28) ───────── */
const L_osg9_1 = {
  title: '9.A — 📑 Slide by slide · Security by design: domains, ACLs, capabilities, models, cryptography, authentication (slides 1–28)|||9.A — 📑 Học theo từng slide · Bảo mật bằng thiết kế: miền, ACL, capability, mô hình, mật mã, xác thực (slide 1–28)',
  slug: 'osg202-slide-osg9-1',
  type: 'VIDEO',
  description: 'Giảng đủ 28 slide đầu của Chương 9 (Tanenbaum, Modern Operating Systems 4e): ba mục tiêu bảo mật và ba loại mối đe doạ, vì sao hệ thống an toàn khó xây, cơ sở tin cậy và giám sát tham chiếu, miền bảo vệ và ma trận bảo vệ (cắt theo cột thành ACL, theo hàng thành capability), mô hình Bell–LaPadula và Biba, kênh ngầm và giấu tin, mật mã khoá bí mật, chữ ký số, và bốn cách xác thực người dùng (mật khẩu có muối, hỏi–đáp, thẻ, sinh trắc) — mỗi ý có lệnh hoặc chương trình chạy thật trên Linux (quyền tệp, setuid, capability, băm mật khẩu có muối, openssl, TOTP theo RFC 6238, kênh ngầm bằng khoá tệp) và hình do bộ mô phỏng tính.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lesson 9.A · deck "Chapter 9 · Security", slides 1–28</span>
<h2>Who is allowed to do what — and how the OS makes that stick</h2>
<p class="lead">Every earlier chapter assumed the programs were friendly. Chapter 9 drops that assumption: users may be careless, programs may have bugs, and some people are plainly hostile. The first half of the deck is <strong>protection by design</strong> — the machinery an operating system uses to say <em>who may do what to which object</em>: security goals and threats (slides 1–3), the trusted computing base and reference monitor (4), protection domains, matrices, access control lists and capabilities (5–12), formal models and covert channels (13–19), cryptography (20–22) and authentication (23–28). The second half (lesson 9.B) is about <em>attacks</em> on software and the defences against them. Everything here runs on a real Linux in the course container — permission bits, <code>setuid</code>, capabilities, salted password hashes, signatures, even a covert channel.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>9.1 The security environment</td><td>name the three goals (CIA) and match each to its threat</td></tr>
<tr><td>4</td><td>9.2 Operating system security</td><td>say what the trusted computing base and the reference monitor are</td></tr>
<tr><td>5–12</td><td>9.3 Protection mechanisms</td><td>read a protection matrix, cut it into ACLs and capability lists, and tell Unix modes from capabilities</td></tr>
<tr><td>13–19</td><td>9.4 Formal models, covert channels</td><td>apply Bell–LaPadula and Biba, and explain how a "locked" system still leaks</td></tr>
<tr><td>20–22</td><td>9.5 Basics of cryptography</td><td>tell secret-key encryption, hashes and digital signatures apart</td></tr>
<tr><td>23–28</td><td>9.6 Authentication</td><td>explain salted hashing, challenge–response, tokens and biometrics (FAR/FRR)</td></tr>
</tbody>
</table>
<div class="callout">Older web lessons stay as they are. Chapter 9 has no earlier web lesson, but the Docker, Linux and PostgreSQL courses use these ideas daily (least privilege, secrets, parameterized SQL) — each 🧭 box says where.</div>`,
    `<span class="eyebrow">Chương 9 · Bài 9.A · deck "Chapter 9 · Security", slide 1–28</span>
<h2>Ai được làm gì — và HĐH làm cho điều đó có hiệu lực thế nào</h2>
<p class="lead">Mọi chương trước đều giả định chương trình thân thiện. Chương 9 bỏ giả định đó: người dùng có thể bất cẩn, chương trình có thể có lỗi, và có người rõ ràng thù địch. Nửa đầu bộ slide là <strong>bảo vệ bằng thiết kế</strong> — bộ máy HĐH dùng để nói <em>ai được làm gì với đối tượng nào</em>: mục tiêu và mối đe doạ bảo mật (slide 1–3), cơ sở tin cậy và giám sát tham chiếu (4), miền bảo vệ, ma trận, danh sách điều khiển truy cập (ACL) và capability (5–12), mô hình hình thức và kênh ngầm (13–19), mật mã (20–22) và xác thực (23–28). Nửa sau (bài 9.B) nói về <em>cuộc tấn công</em> vào phần mềm và cách phòng thủ. Mọi thứ ở đây chạy trên Linux thật trong container của môn — bit quyền tệp, <code>setuid</code>, capability, băm mật khẩu có muối, chữ ký, thậm chí một kênh ngầm.</p>
<table>
<thead><tr><th>Slide</th><th>Mục sách</th><th>Học xong bạn làm được</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>9.1 Môi trường bảo mật</td><td>gọi tên ba mục tiêu (CIA) và ghép mỗi mục tiêu với mối đe doạ của nó</td></tr>
<tr><td>4</td><td>9.2 Bảo mật hệ điều hành</td><td>nói được cơ sở tin cậy (TCB) và giám sát tham chiếu là gì</td></tr>
<tr><td>5–12</td><td>9.3 Cơ chế bảo vệ</td><td>đọc ma trận bảo vệ, cắt thành ACL và danh sách capability, phân biệt mode của Unix với capability</td></tr>
<tr><td>13–19</td><td>9.4 Mô hình hình thức, kênh ngầm</td><td>áp dụng Bell–LaPadula và Biba, giải thích vì sao hệ thống "đã khoá" vẫn rò rỉ</td></tr>
<tr><td>20–22</td><td>9.5 Cơ bản về mật mã</td><td>phân biệt mã hoá khoá bí mật, hàm băm và chữ ký số</td></tr>
<tr><td>23–28</td><td>9.6 Xác thực</td><td>giải thích băm có muối, hỏi–đáp, token và sinh trắc (FAR/FRR)</td></tr>
</tbody>
</table>
<div class="callout">Các bài web cũ giữ nguyên. Chương 9 chưa có bài web cũ, nhưng các khoá Docker, Linux và PostgreSQL dùng những ý này hằng ngày (quyền tối thiểu, bí mật, SQL tham số hoá) — mỗi ô 🧭 chỉ rõ chỗ nào.</div>`),
    walkHead('osg9', 1, 28),
    walk('osg9', [
      [1, 'Security',
        `<p class="y-chinh">🎯 Chapter 9 title slide: <strong>Security</strong>. In operating-system terms, security is the discipline of keeping the machine's resources — data, CPU time, network — working only for the people they are meant for, even when some people (or programs) try otherwise.</p>
<p>Think of an apartment building. <em>Protection</em> is the locks and the key rules inside it: which tenant has a key to which room. <em>Security</em> is the whole question: are the locks any good, does the doorman check who walks in, can someone climb in through the window, and what if a tenant themselves is the thief? The book separates the two words: <strong>protection</strong> = the internal mechanisms (domains, ACLs, capabilities — slides 5–12); <strong>security</strong> = the larger problem including the outside world, people and bugs.</p>
<p>➕ Why a backend developer cares: your Node or Spring service runs <em>as a user</em> on a Linux server, accepts text from strangers on the internet, and holds secrets (database password, JWT key). Everything in this chapter is the reason a stolen password or a single unchecked <code>strcpy</code> can mean the whole server. Interviews ask it constantly: "How do you store passwords?", "What is SQL injection?", "Why not run the container as root?" — each has a slide in this chapter.</p>
<div class="callout">🧭 On a real server: the first thing to check on any Linux box is <em>who the process runs as</em>: <code>ps -o user,pid,cmd -C node</code>. If that says <code>root</code>, every bug in your code is a root bug.</div>`,
        `<p class="y-chinh">🎯 Slide tiêu đề Chương 9: <strong>Security</strong> (bảo mật). Theo ngôn ngữ HĐH, bảo mật là việc giữ cho tài nguyên của máy — dữ liệu, thời gian CPU, mạng — chỉ phục vụ đúng những người được phép, ngay cả khi có người (hay chương trình) cố làm khác.</p>
<p>Hãy nghĩ tới một toà chung cư. <em>Bảo vệ (protection)</em> là các ổ khoá và quy tắc chìa khoá bên trong: người thuê nào có chìa phòng nào. <em>Bảo mật (security)</em> là cả bài toán: ổ khoá có tốt không, bảo vệ có kiểm tra ai vào không, có ai trèo cửa sổ vào được không, và nếu chính một người thuê là kẻ trộm thì sao? Sách tách hai từ: <strong>protection</strong> = các cơ chế bên trong (miền, ACL, capability — slide 5–12); <strong>security</strong> = bài toán lớn hơn gồm cả thế giới bên ngoài, con người và lỗi phần mềm.</p>
<p>➕ Vì sao lập trình viên backend cần quan tâm: dịch vụ Node hay Spring của bạn chạy <em>như một người dùng</em> trên máy chủ Linux, nhận chữ từ người lạ trên internet, và giữ bí mật (mật khẩu cơ sở dữ liệu, khoá JWT). Mọi thứ trong chương này là lý do một mật khẩu bị lộ hay một lệnh <code>strcpy</code> không kiểm tra có thể là cả máy chủ. Phỏng vấn hỏi liên tục: "Bạn lưu mật khẩu thế nào?", "SQL injection là gì?", "Sao không chạy container bằng root?" — mỗi câu có một slide trong chương này.</p>
<div class="callout">🧭 Trên server thật: việc đầu tiên cần kiểm trên mọi máy Linux là <em>tiến trình chạy bằng ai</em>: <code>ps -o user,pid,cmd -C node</code>. Nếu ra <code>root</code> thì mọi lỗi trong mã của bạn là lỗi root.</div>`],
      [2, 'The Security EnvironmentThreats',
        `<p class="y-chinh">🎯 Figure 9-1: three <strong>security goals</strong>, each with the <strong>threat</strong> against it — <strong>confidentiality</strong> (keep secrets secret) ↔ <em>exposure of data</em>; <strong>integrity</strong> (data is not changed without permission) ↔ <em>tampering with data</em>; <strong>availability</strong> (the service works when needed) ↔ <em>denial of service</em>. Together: the <strong>CIA triad</strong>.</p>
<p>Take your online bank. <em>Confidentiality</em>: a stranger must not read your balance. <em>Integrity</em>: nobody — not even you, by a bug — may change a transfer after it is confirmed. <em>Availability</em>: the app must open on salary day. An attack usually breaks one goal, but the goals fight each other: encrypting everything with a key you can lose helps confidentiality and hurts availability.</p>
<p>The book adds a fourth worry, <strong>privacy</strong> (protecting individuals from misuse of information about them — in Vietnam, Decree 13/2023 on personal data), and notes that the people behind threats range from curious students to organised criminals and governments — which is why "how secure?" has no single answer: it depends on <em>who you defend against</em>.</p>
<p>➕ See the three goals on a live Linux with three one-liners:</p>
<div class="out"># Slide 2 (Figure 9-1): the three goals, one command each<br>
# CONFIDENTIALITY: a file only its owner may read; another user is refused<br>
$ echo "luong thang 3: 20 trieu" &gt; /tmp/luong.txt; chown sv /tmp/luong.txt; chmod 600 /tmp/luong.txt<br>
$ runuser -u khach -- cat /tmp/luong.txt; echo "exit=$?"<br>
cat: /tmp/luong.txt: Permission denied<br>
exit=1<br>
# INTEGRITY: a fingerprint kept elsewhere notices a silent change<br>
$ sha256sum /tmp/luong.txt &gt; /tmp/luong.sha256<br>
$ echo "luong thang 3: 90 trieu" &gt; /tmp/luong.txt<br>
$ sha256sum -c /tmp/luong.sha256 2&gt;&amp;1 | head -1<br>
/tmp/luong.txt: FAILED<br>
# AVAILABILITY: a per-process limit stops one program from taking every file descriptor of the machine<br>
$ bash -c 'ulimit -n 20; for i in $(seq 1 30); do exec {fd}&lt;/etc/hostname || break; done; echo "stopped after $i tries"' 2&gt;&amp;1 | tail -1<br>
stopped after 11 tries</div>
<p>The permission bits protect confidentiality, the stored hash notices a change (integrity), and the per-process limit stops one program from using everything (availability — the same idea as <code>--memory</code> and <code>--pids-limit</code> for containers).</p>
<p class="pitfall">⚠️ FE-style trap: DoS is an attack on <em>availability</em>, not on confidentiality. And "integrity" in security is about <em>unauthorised change</em>, not about files being intact after a disk failure (that is reliability).</p>`,
        `<p class="y-chinh">🎯 Hình 9-1: ba <strong>mục tiêu bảo mật</strong>, mỗi mục tiêu kèm <strong>mối đe doạ</strong> nhắm vào nó — <strong>bí mật (confidentiality)</strong> (giữ bí mật cho kín) ↔ <em>lộ dữ liệu</em>; <strong>toàn vẹn (integrity)</strong> (dữ liệu không bị đổi khi chưa được phép) ↔ <em>sửa trộm dữ liệu</em>; <strong>sẵn sàng (availability)</strong> (dịch vụ chạy khi cần) ↔ <em>từ chối dịch vụ (DoS)</em>. Gộp lại: <strong>bộ ba CIA</strong>.</p>
<p>Lấy ví dụ ngân hàng trực tuyến. <em>Bí mật</em>: người lạ không được đọc số dư của bạn. <em>Toàn vẹn</em>: không ai — kể cả bạn, do lỗi — được sửa một lệnh chuyển tiền sau khi đã xác nhận. <em>Sẵn sàng</em>: ứng dụng phải mở được vào ngày lĩnh lương. Một cuộc tấn công thường phá một mục tiêu, nhưng các mục tiêu giằng co nhau: mã hoá mọi thứ bằng một khoá mà bạn có thể làm mất thì tốt cho bí mật và xấu cho sẵn sàng.</p>
<p>Sách thêm mối lo thứ tư, <strong>quyền riêng tư (privacy)</strong> (bảo vệ cá nhân khỏi việc lạm dụng thông tin về họ — ở Việt Nam là Nghị định 13/2023 về dữ liệu cá nhân), và lưu ý kẻ đứng sau mối đe doạ trải từ sinh viên tò mò tới tội phạm có tổ chức và chính phủ — nên "an toàn tới đâu?" không có một đáp án duy nhất: nó phụ thuộc <em>bạn phòng thủ trước ai</em>.</p>
<p>➕ Thấy ba mục tiêu trên Linux thật bằng ba dòng lệnh:</p>
<div class="out"># Slide 2 (Hình 9-1): ba mục tiêu, mỗi mục tiêu một lệnh<br>
# BÍ MẬT: tệp chỉ chủ đọc được; người dùng khác bị từ chối<br>
$ echo "luong thang 3: 20 trieu" &gt; /tmp/luong.txt; chown sv /tmp/luong.txt; chmod 600 /tmp/luong.txt<br>
$ runuser -u khach -- cat /tmp/luong.txt; echo "exit=$?"<br>
cat: /tmp/luong.txt: Permission denied<br>
exit=1<br>
# TOÀN VẸN: dấu vân tay giữ ở nơi khác phát hiện thay đổi âm thầm<br>
$ sha256sum /tmp/luong.txt &gt; /tmp/luong.sha256<br>
$ echo "luong thang 3: 90 trieu" &gt; /tmp/luong.txt<br>
$ sha256sum -c /tmp/luong.sha256 2&gt;&amp;1 | head -1<br>
/tmp/luong.txt: FAILED<br>
# SẴN SÀNG: giới hạn theo tiến trình ngăn một chương trình chiếm hết mọi mô tả tệp của máy<br>
$ bash -c 'ulimit -n 20; for i in $(seq 1 30); do exec {fd}&lt;/etc/hostname || break; done; echo "stopped after $i tries"' 2&gt;&amp;1 | tail -1<br>
stopped after 11 tries</div>
<p>Bit quyền bảo vệ bí mật, bản băm đã lưu phát hiện thay đổi (toàn vẹn), và giới hạn theo tiến trình ngăn một chương trình dùng hết mọi thứ (sẵn sàng — cùng ý với <code>--memory</code> và <code>--pids-limit</code> của container).</p>
<p class="pitfall">⚠️ Bẫy kiểu FE: DoS là tấn công vào <em>tính sẵn sàng</em>, không phải bí mật. Và "toàn vẹn" trong bảo mật là về <em>thay đổi trái phép</em>, không phải việc tệp còn nguyên sau khi đĩa hỏng (đó là độ tin cậy).</p>`],
      [3, 'Can We Build Secure Systems?',
        `<p class="y-chinh">🎯 Two questions: <strong>(1) Is it possible to build a secure computer system? (2) If so, why is it not done?</strong> Tanenbaum's answer: (1) <em>yes, in principle</em> — and (2) because people prefer features, speed and compatibility to security, and a system is only as secure as its weakest part.</p>
<p>Why is it hard? Because the attacker needs <em>one</em> hole and the defender must close <em>all</em> of them — like a ship that sinks from one leak. The book lists the practical reasons: every new feature (macros in documents, scripts in e-mail, plug-ins in the browser) adds attack surface; users click what they are told to click; code written in C has no bounds checks; and old software must keep working, so old holes stay. Security is a <em>tax</em> on convenience, and customers rarely pay it willingly.</p>
<p>➕ But "yes, in principle" is not a slogan. <strong>seL4</strong>, a small microkernel (about 10,000 lines of C), was the first general-purpose OS kernel with a machine-checked proof that its C code does what its specification says (Klein et al., SOSP 2009). The price: years of expert work for a tiny kernel — not Linux with 30+ million lines. Cheaper wins are real too: <strong>memory-safe languages</strong> remove whole bug classes (slide 29 onward). Microsoft's security team reported that roughly 70% of the vulnerabilities it patches are memory-safety bugs (MSRC, 2019), which is part of why Rust was accepted into the Linux kernel (merged for 6.1, December 2022).</p>
<p>🧭 On a real server this is the argument for <strong>defence in depth</strong>: assume one layer fails (a bug in your code) and make the next layer limit the damage (non-root user, read-only file system, a database role that cannot drop tables).</p>
<p class="meo">🧠 FE-style: "It is possible to build a secure system, but it is often not done because users want features, not security" — the book's reasoning in one sentence.</p>`,
        `<p class="y-chinh">🎯 Hai câu hỏi: <strong>(1) Có thể xây một hệ thống máy tính an toàn không? (2) Nếu có, vì sao người ta không làm?</strong> Trả lời của Tanenbaum: (1) <em>có, về nguyên tắc</em> — và (2) vì người ta thích tính năng, tốc độ và tương thích hơn bảo mật, và một hệ thống chỉ an toàn bằng bộ phận yếu nhất của nó.</p>
<p>Vì sao khó? Vì kẻ tấn công chỉ cần <em>một</em> lỗ hổng còn người phòng thủ phải bịt <em>tất cả</em> — như con tàu chìm vì một chỗ rò. Sách liệt kê lý do thực tế: mỗi tính năng mới (macro trong tài liệu, script trong e-mail, plug-in trong trình duyệt) thêm bề mặt tấn công; người dùng bấm vào cái được bảo bấm; mã viết bằng C không kiểm biên; và phần mềm cũ phải chạy tiếp nên lỗ hổng cũ còn đó. Bảo mật là một khoản <em>thuế</em> đánh vào sự tiện lợi, và khách hàng hiếm khi sẵn lòng đóng.</p>
<p>➕ Nhưng "có, về nguyên tắc" không phải khẩu hiệu. <strong>seL4</strong>, một vi nhân nhỏ (khoảng 10.000 dòng C), là nhân HĐH đa dụng đầu tiên có chứng minh được máy kiểm rằng mã C của nó làm đúng như đặc tả (Klein và cộng sự, SOSP 2009). Cái giá: nhiều năm công sức chuyên gia cho một nhân bé xíu — không phải Linux với hơn 30 triệu dòng. Cũng có chiến thắng rẻ hơn: <strong>ngôn ngữ an toàn bộ nhớ</strong> loại bỏ cả lớp lỗi (từ slide 29). Nhóm bảo mật của Microsoft báo cáo khoảng 70% lỗ hổng họ vá là lỗi an toàn bộ nhớ (MSRC, 2019), một phần lý do Rust được nhận vào nhân Linux (hợp nhất cho 6.1, 12/2022).</p>
<p>🧭 Trên server thật, đây là lập luận cho <strong>phòng thủ nhiều lớp (defence in depth)</strong>: giả định một lớp hỏng (lỗi trong mã của bạn) và để lớp kế hạn chế thiệt hại (người dùng không phải root, hệ thống tệp chỉ đọc, role cơ sở dữ liệu không xoá được bảng).</p>
<p class="meo">🧠 Kiểu FE: "Có thể xây hệ thống an toàn nhưng thường không làm vì người dùng muốn tính năng chứ không muốn bảo mật" — lập luận của sách gói trong một câu.</p>`],
      [4, 'Trusted Computing Base',
        `<p class="y-chinh">🎯 Figure 9-2: the <strong>trusted computing base (TCB)</strong> is everything you must trust to enforce security — the hardware, the kernel, and any program that runs with special rights. Inside it sits the <strong>reference monitor</strong>: the one checkpoint that every request from a user process (through a system call) must pass before an object is touched.</p>
<p>A reference monitor must be (1) <em>always invoked</em> — no side door (complete mediation), (2) <em>tamper-proof</em> — user code cannot change it, (3) <em>small enough to verify</em>. A bank vault has one door, thick walls and a guard who is checked by someone else: the vault is the object, the door procedure is the monitor. The smaller the TCB, the fewer places a bug can hide — which is why microkernels and, in a different way, containers appeal to security people.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/2c196b589ce39e43d23485026b06370a229ad040.svg" alt="Figure 9-2 as a diagram — every access goes through one checkpoint" loading="lazy" /><p class="chu-thich">🧩 Figure 9-2 as a diagram — every access goes through one checkpoint</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 4 (Figure 9-2): the reference monitor — every access request passes ONE checkpoint inside the kernel
left to right direction
rectangle "User space" {
  actor "Process\\n(uid 1000)" as P
}
rectangle "Kernel space = trusted computing base" {
  rectangle "System call\\ninterface" as SC
  rectangle "Reference monitor\\n(permission check)" as RM #E0E7FF
  rectangle "Policy:\\nmode bits, ACLs,\\ncapabilities, LSM" as POL
  database "Objects:\\nfiles, sockets,\\nmemory, devices" as OBJ
}
P --&gt; SC : open("/etc/shadow")
SC --&gt; RM : who? what? which right?
RM --&gt; POL : look up
POL --&gt; RM : allow / deny
RM --&gt; OBJ : only if allowed
RM ..&gt; P : EACCES (deny)
note bottom of RM
  Complete mediation: no path to an object avoids it.
  Tamper-proof: user code cannot change it.
  Small enough to verify.
end note
@enduml</code></pre></details>
<p>➕ Watch the monitor decide. When user <code>sv</code> opens <code>/etc/shadow</code>, strace shows the kernel's verdict on the very call; root's identical call succeeds. And the TCB of this container is not just the kernel — it includes every <em>setuid-root</em> program (they run with root's rights for anyone who starts them):</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_PTRACE</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 4: EVERY access goes through the kernel (the reference monitor). strace shows the verdict the kernel gives sv<br>
$ strace -f -o /tmp/vet -e trace=openat runuser -u sv -- cat /etc/shadow; sed -n 's/^[0-9]* //p' /tmp/vet | grep shadow<br>
cat: /etc/shadow: Permission denied<br>
&nbsp;&nbsp;&nbsp;openat(AT_FDCWD, "/etc/shadow", O_RDONLY) = -1 EACCES (Permission denied)<br>
# the same call by root is allowed: root's identity (uid 0) + CAP_DAC_READ_SEARCH/CAP_DAC_OVERRIDE<br>
$ strace -o /tmp/vet2 -e trace=openat cat /etc/shadow &gt;/dev/null; grep shadow /tmp/vet2<br>
openat(AT_FDCWD, "/etc/shadow", O_RDONLY) = 3<br>
# Slide 4: the trusted computing base = everything you must trust. A few of its members on this system: programs that run as root for any user (setuid-root)<br>
$ find / -xdev -perm -4000 -type f 2&gt;/dev/null | sort<br>
/usr/bin/chfn<br>
/usr/bin/chsh<br>
/usr/bin/gpasswd<br>
/usr/bin/mount<br>
/usr/bin/newgrp<br>
/usr/bin/passwd<br>
/usr/bin/su<br>
/usr/bin/umount<br>
$ find / -xdev -perm -4000 -type f 2&gt;/dev/null | wc -l<br>
8</div>
<p>Eight programs on a small Debian image; on a desktop there are dozens. Each is code that must be perfect — one overflow in <code>mount</code> or <code>su</code> is a root exploit, so distributions keep this list short and are moving functions to capabilities (slide 12).</p>
<p class="pitfall">⚠️ The TCB is <em>not</em> "the part that is secure"; it is "the part whose failure breaks security". A big TCB is a weakness, not a strength.</p>
<div class="callout">🧭 On a real server: <code>find / -xdev -perm -4000</code> is a standard audit command; compare the result with your distribution's default and investigate every extra entry.</div>`,
        `<p class="y-chinh">🎯 Hình 9-2: <strong>cơ sở tin cậy (TCB — trusted computing base)</strong> là mọi thứ bạn buộc phải tin để thực thi bảo mật — phần cứng, nhân, và mọi chương trình chạy với quyền đặc biệt. Bên trong nó là <strong>giám sát tham chiếu (reference monitor)</strong>: một cổng kiểm duy nhất mà mọi yêu cầu từ tiến trình người dùng (qua lời gọi hệ thống) phải qua trước khi đối tượng bị đụng tới.</p>
<p>Giám sát tham chiếu phải (1) <em>luôn được gọi</em> — không có cửa hông (trung gian hoàn toàn), (2) <em>chống giả mạo</em> — mã người dùng không sửa được nó, (3) <em>đủ nhỏ để kiểm chứng</em>. Két sắt ngân hàng có một cửa, tường dày và người canh được người khác kiểm: két là đối tượng, thủ tục ở cửa là giám sát. TCB càng nhỏ thì càng ít chỗ cho lỗi ẩn nấp — vì thế vi nhân và, theo cách khác, container hấp dẫn giới bảo mật.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/2c196b589ce39e43d23485026b06370a229ad040.svg" alt="Hình 9-2 dạng sơ đồ — mọi truy cập đi qua một cổng kiểm" loading="lazy" /><p class="chu-thich">🧩 Hình 9-2 dạng sơ đồ — mọi truy cập đi qua một cổng kiểm</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 4 (Hình 9-2): giám sát tham chiếu — mọi yêu cầu truy cập đi qua MỘT cổng kiểm duy nhất trong nhân
left to right direction
rectangle "User space" {
  actor "Process\\n(uid 1000)" as P
}
rectangle "Kernel space = trusted computing base" {
  rectangle "System call\\ninterface" as SC
  rectangle "Reference monitor\\n(permission check)" as RM #E0E7FF
  rectangle "Policy:\\nmode bits, ACLs,\\ncapabilities, LSM" as POL
  database "Objects:\\nfiles, sockets,\\nmemory, devices" as OBJ
}
P --&gt; SC : open("/etc/shadow")
SC --&gt; RM : who? what? which right?
RM --&gt; POL : look up
POL --&gt; RM : allow / deny
RM --&gt; OBJ : only if allowed
RM ..&gt; P : EACCES (deny)
note bottom of RM
  Complete mediation: no path to an object avoids it.
  Tamper-proof: user code cannot change it.
  Small enough to verify.
end note
@enduml</code></pre></details>
<p>➕ Xem giám sát ra phán quyết. Khi người dùng <code>sv</code> mở <code>/etc/shadow</code>, strace cho thấy phán quyết của nhân ngay trên lời gọi đó; cùng lời gọi của root thì thành công. Và TCB của container này không chỉ là nhân — nó gồm mọi chương trình <em>setuid-root</em> (chạy với quyền root cho bất kỳ ai khởi động chúng):</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_PTRACE</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 4: MỌI truy cập đều đi qua nhân (giám sát tham chiếu). strace cho thấy phán quyết của nhân với sv<br>
$ strace -f -o /tmp/vet -e trace=openat runuser -u sv -- cat /etc/shadow; sed -n 's/^[0-9]* //p' /tmp/vet | grep shadow<br>
cat: /etc/shadow: Permission denied<br>
&nbsp;&nbsp;&nbsp;openat(AT_FDCWD, "/etc/shadow", O_RDONLY) = -1 EACCES (Permission denied)<br>
# cùng lời gọi do root làm thì được phép: danh tính root (uid 0) + CAP_DAC_OVERRIDE<br>
$ strace -o /tmp/vet2 -e trace=openat cat /etc/shadow &gt;/dev/null; grep shadow /tmp/vet2<br>
openat(AT_FDCWD, "/etc/shadow", O_RDONLY) = 3<br>
# Slide 4: cơ sở tin cậy (TCB) = mọi thứ bạn buộc phải tin. Vài thành viên trên hệ này: chương trình chạy với quyền root cho bất kỳ ai (setuid-root)<br>
$ find / -xdev -perm -4000 -type f 2&gt;/dev/null | sort<br>
/usr/bin/chfn<br>
/usr/bin/chsh<br>
/usr/bin/gpasswd<br>
/usr/bin/mount<br>
/usr/bin/newgrp<br>
/usr/bin/passwd<br>
/usr/bin/su<br>
/usr/bin/umount<br>
$ find / -xdev -perm -4000 -type f 2&gt;/dev/null | wc -l<br>
8</div>
<p>Tám chương trình trên một ảnh Debian nhỏ; trên máy để bàn có hàng chục. Mỗi cái là mã phải hoàn hảo — một lỗi tràn trong <code>mount</code> hay <code>su</code> là một khai thác root, nên các bản phân phối giữ danh sách này ngắn và đang chuyển chức năng sang capability (slide 12).</p>
<p class="pitfall">⚠️ TCB <em>không</em> phải "phần an toàn"; nó là "phần mà hỏng thì bảo mật hỏng". TCB lớn là điểm yếu, không phải điểm mạnh.</p>
<div class="callout">🧭 Trên server thật: <code>find / -xdev -perm -4000</code> là lệnh kiểm toán chuẩn; so kết quả với mặc định của bản phân phối và điều tra mọi mục thừa.</div>`],
      [5, 'Protection Domains (1)',
        `<p class="y-chinh">🎯 Figure 9-3: a <strong>protection domain</strong> is a set of <em>(object, rights)</em> pairs. Domain 1 holds File1[R] and File2[RW]; domain 2 and domain 3 overlap on Printer1[W]. At any moment a process runs in <em>one</em> domain, and the domain says what it may touch.</p>
<p>Imagine staff badges in an office. The "accountant" badge opens the finance room (read/write) and the printer; the "intern" badge opens only the copier. A person can <em>switch</em> badge (log in as another role), but while holding one badge they get exactly its doors. In Unix the domain is the pair <strong>(user id, group id)</strong>: whatever the user or group may open, the process may open. Objects are files, devices, memory pages — anything with a right attached.</p>
<p>⚠️ The book draws Figure 9-3 and Figure 9-4 (next slide) from <em>two different examples</em>: here domain 2 has <code>File1[RW]</code>; in Figure 9-4 domain 2 has <code>File3[R]</code> and no File1 at all. Don't try to reconcile them — each figure is self-consistent.</p>
<p>➕ A real Linux shows the domain of a process directly. The run below creates two ordinary users and a file, then asks the kernel what each may do:</p>
<div class="out"># Slides 5-9: the Unix protection matrix. The domain is (user, group); each file's mode is a tiny 3-entry ACL: owner, group, others<br>
$ umask<br>
0022<br>
# a new file: mode = 666 minus the umask (022) =&gt; 644, and the owner is whoever created it (root here)<br>
$ cd /tmp &amp;&amp; mkdir work &amp;&amp; cd work &amp;&amp; echo 'hop luc 9h' &gt; ghi-chu.txt &amp;&amp; ls -l ghi-chu.txt<br>
-rw-r--r-- 1 root root 11 Oct 26 02:50 ghi-chu.txt<br>
# give it to alice, group dev, and take everything from "others": rw- r-- ---<br>
$ chown alice:dev ghi-chu.txt; chmod 640 ghi-chu.txt; ls -l ghi-chu.txt<br>
-rw-r----- 1 alice dev 11 Oct 26 02:50 ghi-chu.txt<br>
# bob is in neither the owner entry nor the group entry =&gt; he falls into "others" =&gt; no rights<br>
$ runuser -u bob -- cat ghi-chu.txt; echo "exit=$?"<br>
cat: ghi-chu.txt: Permission denied<br>
exit=1<br>
# put bob in group dev: the kernel re-reads the group list at the next login/exec — the matrix changed, no file was touched<br>
$ usermod -aG dev bob<br>
$ runuser -u bob -- id<br>
uid=1002(bob) gid=1002(bob) groups=1002(bob),1003(dev)<br>
$ runuser -u bob -- cat ghi-chu.txt; echo "exit=$?"<br>
hop luc 9h<br>
exit=0<br>
# the group entry is r-- only, so bob can read but not write<br>
$ runuser -u bob -- sh -c 'echo them &gt;&gt; ghi-chu.txt'; echo "exit=$?"<br>
sh: 1: cannot create ghi-chu.txt: Permission denied<br>
exit=2<br>
# the "x" bit on a DIRECTORY means "may pass through": without it you cannot even open a file whose name you know<br>
$ mkdir hop; echo noi-dung &gt; hop/tep.txt; chmod 644 hop/tep.txt; chmod 700 hop; chown alice hop<br>
$ runuser -u bob -- cat hop/tep.txt; echo "exit=$?"<br>
cat: hop/tep.txt: Permission denied<br>
exit=1<br>
# /tmp is world-writable (rwx for everyone) but with the sticky bit (t): you may only delete YOUR OWN files there<br>
$ stat -c '%A %U:%G %n' /tmp /etc/passwd /etc/shadow /usr/bin/passwd<br>
drwxrwxrwt root:root /tmp<br>
-rw-r--r-- root:root /etc/passwd<br>
-rw-r----- root:shadow /etc/shadow<br>
-rwsr-xr-x root:root /usr/bin/passwd<br>
$ touch /tmp/cua-root.txt<br>
$ runuser -u bob -- rm /tmp/cua-root.txt; echo "exit=$?"<br>
rm: cannot remove '/tmp/cua-root.txt': Operation not permitted<br>
exit=1</div>
<p>Read it as a protection matrix with users in the rows: <code>alice</code> owns the file, group <code>dev</code> may read it, "others" may do nothing. <code>bob</code> was in the "others" row until <code>usermod -aG dev bob</code> moved him into the <code>dev</code> row — the file was never touched, only the domain changed. Note the directory case: without the <code>x</code> bit on <code>hop/</code>, even a world-readable file inside is out of reach.</p>
<p class="meo">🧠 FE-style: "Which file attribute says who can access the file and how?" → <strong>Protection</strong> (FE4#24, FE9#32 — correct in the bank).</p>`,
        `<p class="y-chinh">🎯 Hình 9-3: một <strong>miền bảo vệ (protection domain)</strong> là tập các cặp <em>(đối tượng, quyền)</em>. Miền 1 giữ File1[R] và File2[RW]; miền 2 và miền 3 chồng lên nhau ở Printer1[W]. Tại mỗi thời điểm một tiến trình chạy trong <em>một</em> miền, và miền cho biết nó được đụng tới gì.</p>
<p>Hãy hình dung thẻ nhân viên trong văn phòng. Thẻ "kế toán" mở phòng tài chính (đọc/ghi) và máy in; thẻ "thực tập" chỉ mở máy photocopy. Một người có thể <em>đổi</em> thẻ (đăng nhập với vai khác), nhưng khi cầm một thẻ thì chỉ có đúng các cửa của thẻ đó. Trong Unix miền là cặp <strong>(user id, group id)</strong>: người dùng hay nhóm mở được gì thì tiến trình mở được cái đó. Đối tượng là tệp, thiết bị, trang bộ nhớ — mọi thứ có gắn quyền.</p>
<p>⚠️ Sách vẽ Hình 9-3 và Hình 9-4 (slide sau) từ <em>hai ví dụ khác nhau</em>: ở đây miền 2 có <code>File1[RW]</code>; ở Hình 9-4 miền 2 có <code>File3[R]</code> và không có File1. Đừng cố ghép chúng — mỗi hình tự nhất quán.</p>
<p>➕ Linux thật cho xem thẳng miền của tiến trình. Lần chạy dưới đây tạo hai người dùng thường và một tệp, rồi hỏi nhân mỗi người được làm gì:</p>
<div class="out"># Slide 5-9: ma trận bảo vệ của Unix. Miền là (người dùng, nhóm); mode của mỗi tệp là một ACL nhỏ 3 mục: chủ, nhóm, người khác<br>
$ umask<br>
0022<br>
# tệp mới: mode = 666 trừ umask (022) =&gt; 644, chủ là người tạo (ở đây là root)<br>
$ cd /tmp &amp;&amp; mkdir work &amp;&amp; cd work &amp;&amp; echo 'hop luc 9h' &gt; ghi-chu.txt &amp;&amp; ls -l ghi-chu.txt<br>
-rw-r--r-- 1 root root 11 Oct 26 02:50 ghi-chu.txt<br>
# giao cho alice, nhóm dev, và rút hết quyền của "người khác": rw- r-- ---<br>
$ chown alice:dev ghi-chu.txt; chmod 640 ghi-chu.txt; ls -l ghi-chu.txt<br>
-rw-r----- 1 alice dev 11 Oct 26 02:50 ghi-chu.txt<br>
# bob không thuộc mục chủ cũng không thuộc mục nhóm =&gt; rơi vào "người khác" =&gt; không có quyền<br>
$ runuser -u bob -- cat ghi-chu.txt; echo "exit=$?"<br>
cat: ghi-chu.txt: Permission denied<br>
exit=1<br>
# đưa bob vào nhóm dev: nhân đọc lại danh sách nhóm ở lần đăng nhập/exec kế — ma trận đổi mà không đụng tệp nào<br>
$ usermod -aG dev bob<br>
$ runuser -u bob -- id<br>
uid=1002(bob) gid=1002(bob) groups=1002(bob),1003(dev)<br>
$ runuser -u bob -- cat ghi-chu.txt; echo "exit=$?"<br>
hop luc 9h<br>
exit=0<br>
# mục nhóm chỉ có r-- nên bob đọc được mà không ghi được<br>
$ runuser -u bob -- sh -c 'echo them &gt;&gt; ghi-chu.txt'; echo "exit=$?"<br>
sh: 1: cannot create ghi-chu.txt: Permission denied<br>
exit=2<br>
# bit "x" trên THƯ MỤC nghĩa là "được đi qua": thiếu nó thì biết tên tệp cũng không mở được<br>
$ mkdir hop; echo noi-dung &gt; hop/tep.txt; chmod 644 hop/tep.txt; chmod 700 hop; chown alice hop<br>
$ runuser -u bob -- cat hop/tep.txt; echo "exit=$?"<br>
cat: hop/tep.txt: Permission denied<br>
exit=1<br>
# /tmp ai cũng ghi được (rwx) nhưng có bit dính (t): chỉ xoá được tệp CỦA MÌNH<br>
$ stat -c '%A %U:%G %n' /tmp /etc/passwd /etc/shadow /usr/bin/passwd<br>
drwxrwxrwt root:root /tmp<br>
-rw-r--r-- root:root /etc/passwd<br>
-rw-r----- root:shadow /etc/shadow<br>
-rwsr-xr-x root:root /usr/bin/passwd<br>
$ touch /tmp/cua-root.txt<br>
$ runuser -u bob -- rm /tmp/cua-root.txt; echo "exit=$?"<br>
rm: cannot remove '/tmp/cua-root.txt': Operation not permitted<br>
exit=1</div>
<p>Đọc nó như ma trận bảo vệ với người dùng ở các hàng: <code>alice</code> sở hữu tệp, nhóm <code>dev</code> được đọc, "người khác" không được gì. <code>bob</code> nằm ở hàng "người khác" cho tới khi <code>usermod -aG dev bob</code> chuyển anh sang hàng <code>dev</code> — tệp không bị đụng tới, chỉ miền đổi. Lưu ý trường hợp thư mục: thiếu bit <code>x</code> ở <code>hop/</code> thì tệp ai cũng đọc được bên trong vẫn ngoài tầm với.</p>
<p class="meo">🧠 Kiểu FE: "Thuộc tính tệp nào nói ai được truy cập tệp và theo cách nào?" → <strong>Protection</strong> (FE4#24, FE9#32 — ngân hàng đúng).</p>`],
      [6, 'Protection Domains (2)',
        `<p class="y-chinh">🎯 Figure 9-4: the <strong>protection matrix</strong> — rows are domains, columns are objects, each cell lists the rights (R = read, W = write, X = execute). Domain 1 may read File1 and read/write File2; domain 2 may read File3, read/write/execute File4, read/write File5 and write Printer1; domain 3 may read/write/execute File6 and write Printer1 and Plotter2.</p>
<p>The matrix is the <em>complete</em> answer to "who may do what": to check a request, look up one cell. It is a clean idea and a terrible data structure — with a million files and ten thousand users it has ten billion cells, almost all empty. Real systems store it <em>sparsely</em>, in one of two ways that slices it (slides 8–12): <strong>by column</strong> (each object keeps a list of who may use it = ACL) or <strong>by row</strong> (each domain keeps a list of what it may use = capability list).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4b2305c324a412eb2efaeb87f381c04cd0aba75b.svg" alt="Figure 9-4 computed from a data structure — 9 filled cells out of 24" loading="lazy" /><p class="chu-thich">🧮 Figure 9-4 computed from a data structure — 9 filled cells out of 24</p></div>
<p>Check: may domain 2 write File4? <strong>yes</strong>; may domain 1 write File1? <strong>no</strong>.</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">/**
 * Mô phỏng — ma trận bảo vệ (MOS 4e §9.3.1–9.3.4, Hình 9-3…9-9). Cùng MỘT ma trận 3 miền × 8 đối tượng (Hình 9-4):
 *   #ma-tran  : vẽ ma trận;  #acl : cắt theo CỘT = ACL của từng đối tượng (Hình 9-6/9-7);  #clist : cắt theo HÀNG = C-list của
 *   từng miền (Hình 9-8);  #trang-thai : Hình 9-10 — trạng thái (a) được phép, (b) có thêm một quyền bị cấm, ô bị tô đỏ.
 * data.dapAn = chuỗi đáp án (số mục ACL của File1…, hoặc số ô vi phạm).
 */
import { MA_TRAN_9_4, TRANG_THAI_9_10, acl, clist, soSanhTrangThai, duocPhep } from '../_thuat-toan/bao-mat.mjs';
import { bang } from './_luoi.mjs';
import { L, MAU } from '../_ve.mjs';

export default function ({ bien, lang }) {
  const t = L(lang);
  const mt = MA_TRAN_9_4;
  const mienDs = Object.keys(mt.mien);
  const ten = (d) =&gt; t(&#96;Domain &#36;{d}&#96;, &#96;Miền &#36;{d}&#96;);
  if (bien === 'trang-thai') {
    const ts = TRANG_THAI_9_10;
    const khac = soSanhTrangThai(ts);
    const dang = (st) =&gt; ts.chuThe.map((c) =&gt; [c, ...ts.doiTuong.map((o) =&gt; (st[c] || {})[o] || '')]);
    const svg = (st, nhan) =&gt; bang({ tieuDe: nhan, dau: [t('subject', 'chủ thể'), ...ts.doiTuong], hang: dang(st),
      mau: (r, c, s) =&gt; (st === ts.b &amp;&amp; ts.chuThe[r] === 'Robert' &amp;&amp; ts.doiTuong[c - 1] === 'Mailbox 7' &amp;&amp; s ? MAU.xauNen : undefined) });

    const b = svg(ts.b, t('(b) unauthorized state', '(b) trạng thái KHÔNG được phép'));

    return {
      svg: b, alt: t('Figure 9-10(b): Robert has gained Read on Mailbox 7 — the red cell is outside the policy', 'Hình 9-10(b): Robert có thêm quyền Read trên Mailbox 7 — ô đỏ nằm ngoài chính sách'),
      html: &#96;&lt;p&gt;&#36;{t('The only difference between (a) and (b):', 'Khác biệt duy nhất giữa (a) và (b):')} &#36;{khac.map((k) =&gt; &#96;&lt;code&gt;&#36;{k.chuThe}&lt;/code&gt; × &lt;code&gt;&#36;{k.doiTuong}&lt;/code&gt;: “&#36;{k.truoc || '—'}” → “&#36;{k.sau}”&#36;{k.viPham ? t(' (forbidden by the policy)', ' (bị chính sách cấm)') : ''}&#96;).join('; ')}.&lt;/p&gt;&#96;,
      data: { dapAn: String(khac.filter((k) =&gt; k.viPham).length) },
    };
  }
  if (bien === 'acl') {
    const a = acl(mt);
    const hang = mt.doiTuong.map((o) =&gt; [o, a[o].map(([d, q]) =&gt; &#96;&#36;{ten(d)}: &#36;{q}&#96;).join(' · ') || t('(nobody)', '(không ai)')]);
    return {
      svg: bang({ tieuDe: t('Cut by COLUMN = the access control list of each object', 'Cắt theo CỘT = danh sách điều khiển truy cập (ACL) của từng đối tượng'), dau: [t('object', 'đối tượng'), 'ACL'], hang, size: 13 }),
      alt: t('The columns of Figure 9-4 written as one ACL per object', 'Các cột của Hình 9-4 viết thành một ACL cho mỗi đối tượng'),
      data: { dapAn: String(a.Printer1.length) },
    };
  }
  if (bien === 'clist') {
    const c = clist(mt);
    const hang = mienDs.map((d) =&gt; [ten(d), c[d].map(([o, q]) =&gt; &#96;&#36;{o}:&#36;{q}&#96;).join('  ')]);
    return {
      svg: bang({ tieuDe: t('Cut by ROW = the capability list (C-list) of each domain', 'Cắt theo HÀNG = danh sách khả năng (C-list) của từng miền'), dau: [t('domain', 'miền'), 'C-list'], hang, size: 13 }),
      alt: t('The rows of Figure 9-4 written as one capability list per domain', 'Các hàng của Hình 9-4 viết thành một danh sách khả năng cho mỗi miền'),
      data: { dapAn: String(c[3].length) },
    };
  }
  // #ma-tran (mặc định)
  const hang = mienDs.map((d) =&gt; [ten(d), ...mt.doiTuong.map((o) =&gt; mt.mien[d][o] || '')]);
  return {
    svg: bang({ tieuDe: t('Figure 9-4 — the protection matrix (rows = domains, columns = objects)', 'Hình 9-4 — ma trận bảo vệ (hàng = miền, cột = đối tượng)'),
      dau: [t('domain \\\\ object', 'miền \\\\ đối tượng'), ...mt.doiTuong], hang, size: 13, toiThieuCot: 40,
      mau: (r, c, s) =&gt; (c &gt; 0 &amp;&amp; s ? MAU.totNen : undefined) }),
    alt: t('Protection matrix of three domains over eight objects', 'Ma trận bảo vệ của ba miền trên tám đối tượng'),
    html: &#96;&lt;p&gt;&#36;{t('Check: may domain 2 write File4?', 'Kiểm: miền 2 có được ghi File4 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 2, 'File4', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;; &#36;{t('may domain 1 write File1?', 'miền 1 có được ghi File1 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 1, 'File1', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;.&lt;/p&gt;&#96;,
    data: { dapAn: String(mienDs.reduce((n, d) =&gt; n + Object.keys(mt.mien[d]).length, 0)) },
  };
}</code></pre></details>
<p>➕ Count: 3 domains × 8 objects = 24 cells, only 9 filled. The matrix also answers questions mechanically — "may domain 2 write File4?" (yes), "may domain 1 write File1?" (no, only R). The simulator above stores the matrix once and produces every view of it, which is exactly what the next two slides do by hand.</p>
<p class="pitfall">⚠️ Exam trap: the <em>row</em> is a domain (a subject), the <em>column</em> is an object. ACL = column; capability list = row. Students swap them constantly.</p>`,
        `<p class="y-chinh">🎯 Hình 9-4: <strong>ma trận bảo vệ (protection matrix)</strong> — hàng là miền, cột là đối tượng, mỗi ô liệt kê các quyền (R = đọc, W = ghi, X = thực thi). Miền 1 được đọc File1 và đọc/ghi File2; miền 2 được đọc File3, đọc/ghi/thực thi File4, đọc/ghi File5 và ghi Printer1; miền 3 được đọc/ghi/thực thi File6 và ghi Printer1, Plotter2.</p>
<p>Ma trận là câu trả lời <em>đầy đủ</em> cho "ai được làm gì": để kiểm một yêu cầu, tra một ô. Đó là ý tưởng gọn và là cấu trúc dữ liệu tệ — với một triệu tệp và mười nghìn người dùng nó có mười tỉ ô, hầu hết trống. Hệ thống thật lưu nó <em>thưa</em>, theo một trong hai cách cắt nó (slide 8–12): <strong>theo cột</strong> (mỗi đối tượng giữ danh sách ai được dùng nó = ACL) hoặc <strong>theo hàng</strong> (mỗi miền giữ danh sách nó được dùng gì = danh sách capability).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f02450ef559a71224211dc420c216db9e7c1c76b.svg" alt="Hình 9-4 tính từ một cấu trúc dữ liệu — 9 ô có quyền trên 24 ô" loading="lazy" /><p class="chu-thich">🧮 Hình 9-4 tính từ một cấu trúc dữ liệu — 9 ô có quyền trên 24 ô</p></div>
<p>Kiểm: miền 2 có được ghi File4 không? <strong>có</strong>; miền 1 có được ghi File1 không? <strong>không</strong>.</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">/**
 * Mô phỏng — ma trận bảo vệ (MOS 4e §9.3.1–9.3.4, Hình 9-3…9-9). Cùng MỘT ma trận 3 miền × 8 đối tượng (Hình 9-4):
 *   #ma-tran  : vẽ ma trận;  #acl : cắt theo CỘT = ACL của từng đối tượng (Hình 9-6/9-7);  #clist : cắt theo HÀNG = C-list của
 *   từng miền (Hình 9-8);  #trang-thai : Hình 9-10 — trạng thái (a) được phép, (b) có thêm một quyền bị cấm, ô bị tô đỏ.
 * data.dapAn = chuỗi đáp án (số mục ACL của File1…, hoặc số ô vi phạm).
 */
import { MA_TRAN_9_4, TRANG_THAI_9_10, acl, clist, soSanhTrangThai, duocPhep } from '../_thuat-toan/bao-mat.mjs';
import { bang } from './_luoi.mjs';
import { L, MAU } from '../_ve.mjs';

export default function ({ bien, lang }) {
  const t = L(lang);
  const mt = MA_TRAN_9_4;
  const mienDs = Object.keys(mt.mien);
  const ten = (d) =&gt; t(&#96;Domain &#36;{d}&#96;, &#96;Miền &#36;{d}&#96;);
  if (bien === 'trang-thai') {
    const ts = TRANG_THAI_9_10;
    const khac = soSanhTrangThai(ts);
    const dang = (st) =&gt; ts.chuThe.map((c) =&gt; [c, ...ts.doiTuong.map((o) =&gt; (st[c] || {})[o] || '')]);
    const svg = (st, nhan) =&gt; bang({ tieuDe: nhan, dau: [t('subject', 'chủ thể'), ...ts.doiTuong], hang: dang(st),
      mau: (r, c, s) =&gt; (st === ts.b &amp;&amp; ts.chuThe[r] === 'Robert' &amp;&amp; ts.doiTuong[c - 1] === 'Mailbox 7' &amp;&amp; s ? MAU.xauNen : undefined) });

    const b = svg(ts.b, t('(b) unauthorized state', '(b) trạng thái KHÔNG được phép'));

    return {
      svg: b, alt: t('Figure 9-10(b): Robert has gained Read on Mailbox 7 — the red cell is outside the policy', 'Hình 9-10(b): Robert có thêm quyền Read trên Mailbox 7 — ô đỏ nằm ngoài chính sách'),
      html: &#96;&lt;p&gt;&#36;{t('The only difference between (a) and (b):', 'Khác biệt duy nhất giữa (a) và (b):')} &#36;{khac.map((k) =&gt; &#96;&lt;code&gt;&#36;{k.chuThe}&lt;/code&gt; × &lt;code&gt;&#36;{k.doiTuong}&lt;/code&gt;: “&#36;{k.truoc || '—'}” → “&#36;{k.sau}”&#36;{k.viPham ? t(' (forbidden by the policy)', ' (bị chính sách cấm)') : ''}&#96;).join('; ')}.&lt;/p&gt;&#96;,
      data: { dapAn: String(khac.filter((k) =&gt; k.viPham).length) },
    };
  }
  if (bien === 'acl') {
    const a = acl(mt);
    const hang = mt.doiTuong.map((o) =&gt; [o, a[o].map(([d, q]) =&gt; &#96;&#36;{ten(d)}: &#36;{q}&#96;).join(' · ') || t('(nobody)', '(không ai)')]);
    return {
      svg: bang({ tieuDe: t('Cut by COLUMN = the access control list of each object', 'Cắt theo CỘT = danh sách điều khiển truy cập (ACL) của từng đối tượng'), dau: [t('object', 'đối tượng'), 'ACL'], hang, size: 13 }),
      alt: t('The columns of Figure 9-4 written as one ACL per object', 'Các cột của Hình 9-4 viết thành một ACL cho mỗi đối tượng'),
      data: { dapAn: String(a.Printer1.length) },
    };
  }
  if (bien === 'clist') {
    const c = clist(mt);
    const hang = mienDs.map((d) =&gt; [ten(d), c[d].map(([o, q]) =&gt; &#96;&#36;{o}:&#36;{q}&#96;).join('  ')]);
    return {
      svg: bang({ tieuDe: t('Cut by ROW = the capability list (C-list) of each domain', 'Cắt theo HÀNG = danh sách khả năng (C-list) của từng miền'), dau: [t('domain', 'miền'), 'C-list'], hang, size: 13 }),
      alt: t('The rows of Figure 9-4 written as one capability list per domain', 'Các hàng của Hình 9-4 viết thành một danh sách khả năng cho mỗi miền'),
      data: { dapAn: String(c[3].length) },
    };
  }
  // #ma-tran (mặc định)
  const hang = mienDs.map((d) =&gt; [ten(d), ...mt.doiTuong.map((o) =&gt; mt.mien[d][o] || '')]);
  return {
    svg: bang({ tieuDe: t('Figure 9-4 — the protection matrix (rows = domains, columns = objects)', 'Hình 9-4 — ma trận bảo vệ (hàng = miền, cột = đối tượng)'),
      dau: [t('domain \\\\ object', 'miền \\\\ đối tượng'), ...mt.doiTuong], hang, size: 13, toiThieuCot: 40,
      mau: (r, c, s) =&gt; (c &gt; 0 &amp;&amp; s ? MAU.totNen : undefined) }),
    alt: t('Protection matrix of three domains over eight objects', 'Ma trận bảo vệ của ba miền trên tám đối tượng'),
    html: &#96;&lt;p&gt;&#36;{t('Check: may domain 2 write File4?', 'Kiểm: miền 2 có được ghi File4 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 2, 'File4', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;; &#36;{t('may domain 1 write File1?', 'miền 1 có được ghi File1 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 1, 'File1', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;.&lt;/p&gt;&#96;,
    data: { dapAn: String(mienDs.reduce((n, d) =&gt; n + Object.keys(mt.mien[d]).length, 0)) },
  };
}</code></pre></details>
<p>➕ Đếm: 3 miền × 8 đối tượng = 24 ô, chỉ 9 ô có quyền. Ma trận cũng trả lời máy móc — "miền 2 có được ghi File4 không?" (có), "miền 1 có được ghi File1 không?" (không, chỉ R). Mô phỏng ở trên lưu ma trận một lần và sinh mọi cách nhìn của nó, đúng là việc hai slide sau làm bằng tay.</p>
<p class="pitfall">⚠️ Bẫy thi: <em>hàng</em> là miền (chủ thể), <em>cột</em> là đối tượng. ACL = cột; danh sách capability = hàng. Sinh viên đảo hai thứ này liên tục.</p>`],
      [7, 'Protection Domains (3)',
        `<p class="y-chinh">🎯 Figure 9-5: domains can themselves be <strong>objects</strong> of the matrix. The cell "Enter" in row 1, column Domain2 means a process in domain 1 may <em>switch into</em> domain 2 — the controlled way to gain (or lose) rights.</p>
<p>A process must sometimes borrow stronger rights for one job: printing needs the print spooler's rights, changing your password needs to write a root-only file. Giving the user those rights permanently would be dangerous; instead the matrix allows a <em>doorway</em>: "Enter". The process steps through, does the job with the other domain's rights, and steps back. In Unix the doorway is the <strong>setuid bit</strong>: a program file owned by root with the <code>s</code> flag runs, whoever starts it, with the owner's <em>effective</em> user id.</p>
<div class="out"># Slides 5-7 (Figure 9-5, "Enter"): a process changes protection domain by executing a setuid program<br>
$ cat _uid.c<br>
#include &lt;stdio.h&gt;<br>
#include &lt;unistd.h&gt;<br>
int main(void) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;printf("real uid = %d &nbsp;&nbsp;effective uid = %d\\n", (int)getuid(), (int)geteuid());<br>
&nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
}<br>
# sv (uid 1000) runs it: real and effective uid are both 1000<br>
$ runuser -u sv -- uid-demo<br>
real uid = 1000 &nbsp;&nbsp;effective uid = 1000<br>
# now set the setuid bit (the "s" in rws): the program is owned by root<br>
$ chmod u+s /usr/local/bin/uid-demo; ls -l /usr/local/bin/uid-demo<br>
-rwsr-xr-x 1 root root 70544 Oct 26 02:50 /usr/local/bin/uid-demo<br>
# same user, same command — but while this program runs, the kernel gives it the OWNER's domain (euid 0)<br>
$ runuser -u sv -- uid-demo<br>
real uid = 1000 &nbsp;&nbsp;effective uid = 0<br>
# the real login program for passwords is exactly this: sv may not read /etc/shadow, but passwd (setuid root) may<br>
$ ls -l /usr/bin/passwd /etc/shadow<br>
-rw-r----- 1 root shadow &nbsp;&nbsp;498 Oct 26 00:25 /etc/shadow<br>
-rwsr-xr-x 1 root root &nbsp;&nbsp;72048 Dec 14 &nbsp;2025 /usr/bin/passwd</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/518444ec662ece961a8c873703ddb1ea2015504e.svg" alt="Entering another domain: the setuid doorway" loading="lazy" /><p class="chu-thich">🧩 Entering another domain: the setuid doorway</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slides 5-7 (Figure 9-5): a process changes protection domain by exec-ing a setuid program ("Enter")
participant "shell of sv\\n(domain: uid 1000)" as SH
participant "kernel" as K
participant "/usr/bin/passwd\\n(owner root, mode rwsr-xr-x)" as PW
participant "/etc/shadow\\n(owner root, mode 640)" as SF
SH -&gt; K : fork() + execve("/usr/bin/passwd")
K -&gt; K : setuid bit set?\\nyes: effective uid := owner (0)\\nreal uid stays 1000
K -&gt; PW : start running in the domain of root
PW -&gt; K : open("/etc/shadow", O_RDWR)
K -&gt; K : euid 0 owns the file: allowed
K --&gt; PW : fd 3  (a capability)
PW -&gt; SF : write the NEW hash of sv's password only
PW -&gt; K : exit()
K --&gt; SH : back in domain uid 1000
note over PW
  The program must check the real uid (1000)
  so sv can only change sv's own password.
  Every setuid-root program is part of the TCB.
end note
@enduml</code></pre></details>
<p>Same user (<code>sv</code>, uid 1000), same command, two results: before the <code>s</code> bit the effective uid is 1000, after it is 0 — the program <em>is</em> in root's domain while it runs, though sv's <em>real</em> uid is still 1000 (so the program can still ask "who called me?"). <code>/usr/bin/passwd</code> works like this: sv cannot read <code>/etc/shadow</code>, but the setuid <code>passwd</code> can, and it is written to change only the caller's own line.</p>
<p>🧭 On a real server this is why setuid binaries are audited and why <code>sudo</code> is configured per command, not per user: a doorway into root's domain is exactly where an attacker aims. A bug <em>inside</em> the doorway program is a root exploit (slides 29–33).</p>
<p class="pitfall">⚠️ Real vs effective uid: <em>real</em> = who really started the process; <em>effective</em> = whose rights the kernel checks. Setuid changes the effective one.</p>`,
        `<p class="y-chinh">🎯 Hình 9-5: bản thân các miền cũng có thể là <strong>đối tượng</strong> của ma trận. Ô "Enter" ở hàng 1, cột Domain2 nghĩa là tiến trình ở miền 1 được <em>chuyển sang</em> miền 2 — cách có kiểm soát để lấy thêm (hoặc bỏ bớt) quyền.</p>
<p>Đôi khi tiến trình phải mượn quyền mạnh hơn cho một việc: in cần quyền của trình spool in, đổi mật khẩu cần ghi một tệp chỉ root đọc ghi được. Cho người dùng các quyền đó vĩnh viễn thì nguy hiểm; thay vào đó ma trận cho một <em>ô cửa</em>: "Enter". Tiến trình bước qua, làm việc với quyền của miền kia, rồi bước ra. Trong Unix ô cửa là <strong>bit setuid</strong>: tệp chương trình thuộc root có cờ <code>s</code> chạy, ai khởi động cũng vậy, với user id <em>hiệu lực</em> của chủ tệp.</p>
<div class="out"># Slide 5-7 (Hình 9-5, "Enter"): tiến trình đổi miền bảo vệ bằng cách chạy một chương trình setuid<br>
$ cat _uid.c<br>
#include &lt;stdio.h&gt;<br>
#include &lt;unistd.h&gt;<br>
int main(void) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;printf("real uid = %d &nbsp;&nbsp;effective uid = %d\\n", (int)getuid(), (int)geteuid());<br>
&nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
}<br>
# sv (uid 1000) chạy nó: uid thật và uid hiệu lực đều là 1000<br>
$ runuser -u sv -- uid-demo<br>
real uid = 1000 &nbsp;&nbsp;effective uid = 1000<br>
# giờ đặt bit setuid (chữ "s" trong rws): chương trình thuộc về root<br>
$ chmod u+s /usr/local/bin/uid-demo; ls -l /usr/local/bin/uid-demo<br>
-rwsr-xr-x 1 root root 70544 Oct 26 02:50 /usr/local/bin/uid-demo<br>
# cùng người dùng, cùng lệnh — nhưng khi chương trình này chạy, nhân cho nó miền của CHỦ (euid 0)<br>
$ runuser -u sv -- uid-demo<br>
real uid = 1000 &nbsp;&nbsp;effective uid = 0<br>
# chương trình đổi mật khẩu thật y như vậy: sv không đọc được /etc/shadow, nhưng passwd (setuid root) thì được<br>
$ ls -l /usr/bin/passwd /etc/shadow<br>
-rw-r----- 1 root shadow &nbsp;&nbsp;498 Oct 26 00:25 /etc/shadow<br>
-rwsr-xr-x 1 root root &nbsp;&nbsp;72048 Dec 14 &nbsp;2025 /usr/bin/passwd</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/518444ec662ece961a8c873703ddb1ea2015504e.svg" alt="Vào miền khác: ô cửa setuid" loading="lazy" /><p class="chu-thich">🧩 Vào miền khác: ô cửa setuid</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 5-7 (Hình 9-5): tiến trình đổi miền bảo vệ khi exec một chương trình setuid ("Enter")
participant "shell of sv\\n(domain: uid 1000)" as SH
participant "kernel" as K
participant "/usr/bin/passwd\\n(owner root, mode rwsr-xr-x)" as PW
participant "/etc/shadow\\n(owner root, mode 640)" as SF
SH -&gt; K : fork() + execve("/usr/bin/passwd")
K -&gt; K : setuid bit set?\\nyes: effective uid := owner (0)\\nreal uid stays 1000
K -&gt; PW : start running in the domain of root
PW -&gt; K : open("/etc/shadow", O_RDWR)
K -&gt; K : euid 0 owns the file: allowed
K --&gt; PW : fd 3  (a capability)
PW -&gt; SF : write the NEW hash of sv's password only
PW -&gt; K : exit()
K --&gt; SH : back in domain uid 1000
note over PW
  The program must check the real uid (1000)
  so sv can only change sv's own password.
  Every setuid-root program is part of the TCB.
end note
@enduml</code></pre></details>
<p>Cùng người dùng (<code>sv</code>, uid 1000), cùng lệnh, hai kết quả: trước bit <code>s</code> uid hiệu lực là 1000, sau đó là 0 — chương trình <em>ở trong</em> miền root khi chạy, dù uid <em>thật</em> của sv vẫn là 1000 (nên chương trình vẫn hỏi được "ai gọi tôi?"). <code>/usr/bin/passwd</code> hoạt động đúng thế này: sv không đọc được <code>/etc/shadow</code>, nhưng <code>passwd</code> setuid thì được, và nó được viết để chỉ đổi dòng của chính người gọi.</p>
<p>🧭 Trên server thật, đây là lý do chương trình setuid được kiểm toán và <code>sudo</code> được cấu hình theo từng lệnh chứ không theo từng người dùng: ô cửa vào miền root chính là chỗ kẻ tấn công nhắm tới. Lỗi <em>bên trong</em> chương trình ở ô cửa là một khai thác root (slide 29–33).</p>
<p class="pitfall">⚠️ Uid thật so với hiệu lực: <em>thật</em> = ai thực sự khởi động tiến trình; <em>hiệu lực</em> = nhân kiểm quyền của ai. Setuid đổi uid hiệu lực.</p>`],
      [8, 'Access Control Lists (1)',
        `<p class="y-chinh">🎯 Figure 9-6: with <strong>access control lists (ACLs)</strong> the kernel keeps, with each <em>file</em>, a list of who may do what: F1: A:RW, B:R · F2: A:R, B:RW, C:R · F3: B:RWX, C:RX. When process A (owner) asks to write F2, the kernel scans F2's list for A. The matrix is stored <strong>by column</strong>.</p>
<p>Think of a guest list at the door of a party: the list belongs to the <em>party</em> (object), and the bouncer checks the visitor's name. ACLs are great for questions about an <em>object</em> — "who can read payroll.xlsx?" is one lookup — and for revoking: delete the name and access is gone. They are poor for questions about a <em>subject</em> — "what can alice touch?" means scanning every file's list.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6bd67f70fea3c61cc082b0d1c0aa56939a71a607.svg" alt="The columns of Figure 9-4 written as ACLs" loading="lazy" /><p class="chu-thich">🧮 The columns of Figure 9-4 written as ACLs</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">/**
 * Mô phỏng — ma trận bảo vệ (MOS 4e §9.3.1–9.3.4, Hình 9-3…9-9). Cùng MỘT ma trận 3 miền × 8 đối tượng (Hình 9-4):
 *   #ma-tran  : vẽ ma trận;  #acl : cắt theo CỘT = ACL của từng đối tượng (Hình 9-6/9-7);  #clist : cắt theo HÀNG = C-list của
 *   từng miền (Hình 9-8);  #trang-thai : Hình 9-10 — trạng thái (a) được phép, (b) có thêm một quyền bị cấm, ô bị tô đỏ.
 * data.dapAn = chuỗi đáp án (số mục ACL của File1…, hoặc số ô vi phạm).
 */
import { MA_TRAN_9_4, TRANG_THAI_9_10, acl, clist, soSanhTrangThai, duocPhep } from '../_thuat-toan/bao-mat.mjs';
import { bang } from './_luoi.mjs';
import { L, MAU } from '../_ve.mjs';

export default function ({ bien, lang }) {
  const t = L(lang);
  const mt = MA_TRAN_9_4;
  const mienDs = Object.keys(mt.mien);
  const ten = (d) =&gt; t(&#96;Domain &#36;{d}&#96;, &#96;Miền &#36;{d}&#96;);
  if (bien === 'trang-thai') {
    const ts = TRANG_THAI_9_10;
    const khac = soSanhTrangThai(ts);
    const dang = (st) =&gt; ts.chuThe.map((c) =&gt; [c, ...ts.doiTuong.map((o) =&gt; (st[c] || {})[o] || '')]);
    const svg = (st, nhan) =&gt; bang({ tieuDe: nhan, dau: [t('subject', 'chủ thể'), ...ts.doiTuong], hang: dang(st),
      mau: (r, c, s) =&gt; (st === ts.b &amp;&amp; ts.chuThe[r] === 'Robert' &amp;&amp; ts.doiTuong[c - 1] === 'Mailbox 7' &amp;&amp; s ? MAU.xauNen : undefined) });

    const b = svg(ts.b, t('(b) unauthorized state', '(b) trạng thái KHÔNG được phép'));

    return {
      svg: b, alt: t('Figure 9-10(b): Robert has gained Read on Mailbox 7 — the red cell is outside the policy', 'Hình 9-10(b): Robert có thêm quyền Read trên Mailbox 7 — ô đỏ nằm ngoài chính sách'),
      html: &#96;&lt;p&gt;&#36;{t('The only difference between (a) and (b):', 'Khác biệt duy nhất giữa (a) và (b):')} &#36;{khac.map((k) =&gt; &#96;&lt;code&gt;&#36;{k.chuThe}&lt;/code&gt; × &lt;code&gt;&#36;{k.doiTuong}&lt;/code&gt;: “&#36;{k.truoc || '—'}” → “&#36;{k.sau}”&#36;{k.viPham ? t(' (forbidden by the policy)', ' (bị chính sách cấm)') : ''}&#96;).join('; ')}.&lt;/p&gt;&#96;,
      data: { dapAn: String(khac.filter((k) =&gt; k.viPham).length) },
    };
  }
  if (bien === 'acl') {
    const a = acl(mt);
    const hang = mt.doiTuong.map((o) =&gt; [o, a[o].map(([d, q]) =&gt; &#96;&#36;{ten(d)}: &#36;{q}&#96;).join(' · ') || t('(nobody)', '(không ai)')]);
    return {
      svg: bang({ tieuDe: t('Cut by COLUMN = the access control list of each object', 'Cắt theo CỘT = danh sách điều khiển truy cập (ACL) của từng đối tượng'), dau: [t('object', 'đối tượng'), 'ACL'], hang, size: 13 }),
      alt: t('The columns of Figure 9-4 written as one ACL per object', 'Các cột của Hình 9-4 viết thành một ACL cho mỗi đối tượng'),
      data: { dapAn: String(a.Printer1.length) },
    };
  }
  if (bien === 'clist') {
    const c = clist(mt);
    const hang = mienDs.map((d) =&gt; [ten(d), c[d].map(([o, q]) =&gt; &#96;&#36;{o}:&#36;{q}&#96;).join('  ')]);
    return {
      svg: bang({ tieuDe: t('Cut by ROW = the capability list (C-list) of each domain', 'Cắt theo HÀNG = danh sách khả năng (C-list) của từng miền'), dau: [t('domain', 'miền'), 'C-list'], hang, size: 13 }),
      alt: t('The rows of Figure 9-4 written as one capability list per domain', 'Các hàng của Hình 9-4 viết thành một danh sách khả năng cho mỗi miền'),
      data: { dapAn: String(c[3].length) },
    };
  }
  // #ma-tran (mặc định)
  const hang = mienDs.map((d) =&gt; [ten(d), ...mt.doiTuong.map((o) =&gt; mt.mien[d][o] || '')]);
  return {
    svg: bang({ tieuDe: t('Figure 9-4 — the protection matrix (rows = domains, columns = objects)', 'Hình 9-4 — ma trận bảo vệ (hàng = miền, cột = đối tượng)'),
      dau: [t('domain \\\\ object', 'miền \\\\ đối tượng'), ...mt.doiTuong], hang, size: 13, toiThieuCot: 40,
      mau: (r, c, s) =&gt; (c &gt; 0 &amp;&amp; s ? MAU.totNen : undefined) }),
    alt: t('Protection matrix of three domains over eight objects', 'Ma trận bảo vệ của ba miền trên tám đối tượng'),
    html: &#96;&lt;p&gt;&#36;{t('Check: may domain 2 write File4?', 'Kiểm: miền 2 có được ghi File4 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 2, 'File4', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;; &#36;{t('may domain 1 write File1?', 'miền 1 có được ghi File1 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 1, 'File1', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;.&lt;/p&gt;&#96;,
    data: { dapAn: String(mienDs.reduce((n, d) =&gt; n + Object.keys(mt.mien[d]).length, 0)) },
  };
}</code></pre></details>
<p>➕ Classic Unix has a tiny ACL: three entries — owner, group, others — with r, w, x each: that is what <code>ls -l</code> prints (<code>-rw-r-----</code> = owner rw, group r, others nothing; the run of slide 5 showed it). POSIX ACLs extend this to any number of named users and groups, set with <code>setfacl -m u:bob:r file</code> and read with <code>getfacl file</code> (package <code>acl</code>; the course image does not ship it, so there is no output to show — on your own Debian/Ubuntu: <code>sudo apt install acl</code>). A <code>+</code> after the mode in <code>ls -l</code> tells you an extended ACL exists. Windows NTFS and cloud object stores (S3 bucket ACLs, Cloudflare R2 policies) use the same idea.</p>
<p class="pitfall">⚠️ ACL = list attached to the <em>object</em> (column). The kernel must check it on <em>every</em> access, so long ACLs cost time; Unix keeps it to three entries for that reason.</p>`,
        `<p class="y-chinh">🎯 Hình 9-6: với <strong>danh sách điều khiển truy cập (ACL)</strong> nhân giữ, kèm mỗi <em>tệp</em>, một danh sách ai được làm gì: F1: A:RW, B:R · F2: A:R, B:RW, C:R · F3: B:RWX, C:RX. Khi tiến trình A (chủ) xin ghi F2, nhân quét danh sách của F2 tìm A. Ma trận được lưu <strong>theo cột</strong>.</p>
<p>Hãy nghĩ tới danh sách khách ở cửa một bữa tiệc: danh sách thuộc về <em>bữa tiệc</em> (đối tượng), và bảo vệ kiểm tên khách. ACL rất tốt cho câu hỏi về một <em>đối tượng</em> — "ai đọc được payroll.xlsx?" là một lần tra — và cho việc thu hồi: xoá tên là mất quyền. Nó kém cho câu hỏi về một <em>chủ thể</em> — "alice đụng tới được gì?" nghĩa là quét danh sách của mọi tệp.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8717f5a0122243ebdaf717af2fd36d8ed4c73495.svg" alt="Các cột của Hình 9-4 viết thành ACL" loading="lazy" /><p class="chu-thich">🧮 Các cột của Hình 9-4 viết thành ACL</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">/**
 * Mô phỏng — ma trận bảo vệ (MOS 4e §9.3.1–9.3.4, Hình 9-3…9-9). Cùng MỘT ma trận 3 miền × 8 đối tượng (Hình 9-4):
 *   #ma-tran  : vẽ ma trận;  #acl : cắt theo CỘT = ACL của từng đối tượng (Hình 9-6/9-7);  #clist : cắt theo HÀNG = C-list của
 *   từng miền (Hình 9-8);  #trang-thai : Hình 9-10 — trạng thái (a) được phép, (b) có thêm một quyền bị cấm, ô bị tô đỏ.
 * data.dapAn = chuỗi đáp án (số mục ACL của File1…, hoặc số ô vi phạm).
 */
import { MA_TRAN_9_4, TRANG_THAI_9_10, acl, clist, soSanhTrangThai, duocPhep } from '../_thuat-toan/bao-mat.mjs';
import { bang } from './_luoi.mjs';
import { L, MAU } from '../_ve.mjs';

export default function ({ bien, lang }) {
  const t = L(lang);
  const mt = MA_TRAN_9_4;
  const mienDs = Object.keys(mt.mien);
  const ten = (d) =&gt; t(&#96;Domain &#36;{d}&#96;, &#96;Miền &#36;{d}&#96;);
  if (bien === 'trang-thai') {
    const ts = TRANG_THAI_9_10;
    const khac = soSanhTrangThai(ts);
    const dang = (st) =&gt; ts.chuThe.map((c) =&gt; [c, ...ts.doiTuong.map((o) =&gt; (st[c] || {})[o] || '')]);
    const svg = (st, nhan) =&gt; bang({ tieuDe: nhan, dau: [t('subject', 'chủ thể'), ...ts.doiTuong], hang: dang(st),
      mau: (r, c, s) =&gt; (st === ts.b &amp;&amp; ts.chuThe[r] === 'Robert' &amp;&amp; ts.doiTuong[c - 1] === 'Mailbox 7' &amp;&amp; s ? MAU.xauNen : undefined) });

    const b = svg(ts.b, t('(b) unauthorized state', '(b) trạng thái KHÔNG được phép'));

    return {
      svg: b, alt: t('Figure 9-10(b): Robert has gained Read on Mailbox 7 — the red cell is outside the policy', 'Hình 9-10(b): Robert có thêm quyền Read trên Mailbox 7 — ô đỏ nằm ngoài chính sách'),
      html: &#96;&lt;p&gt;&#36;{t('The only difference between (a) and (b):', 'Khác biệt duy nhất giữa (a) và (b):')} &#36;{khac.map((k) =&gt; &#96;&lt;code&gt;&#36;{k.chuThe}&lt;/code&gt; × &lt;code&gt;&#36;{k.doiTuong}&lt;/code&gt;: “&#36;{k.truoc || '—'}” → “&#36;{k.sau}”&#36;{k.viPham ? t(' (forbidden by the policy)', ' (bị chính sách cấm)') : ''}&#96;).join('; ')}.&lt;/p&gt;&#96;,
      data: { dapAn: String(khac.filter((k) =&gt; k.viPham).length) },
    };
  }
  if (bien === 'acl') {
    const a = acl(mt);
    const hang = mt.doiTuong.map((o) =&gt; [o, a[o].map(([d, q]) =&gt; &#96;&#36;{ten(d)}: &#36;{q}&#96;).join(' · ') || t('(nobody)', '(không ai)')]);
    return {
      svg: bang({ tieuDe: t('Cut by COLUMN = the access control list of each object', 'Cắt theo CỘT = danh sách điều khiển truy cập (ACL) của từng đối tượng'), dau: [t('object', 'đối tượng'), 'ACL'], hang, size: 13 }),
      alt: t('The columns of Figure 9-4 written as one ACL per object', 'Các cột của Hình 9-4 viết thành một ACL cho mỗi đối tượng'),
      data: { dapAn: String(a.Printer1.length) },
    };
  }
  if (bien === 'clist') {
    const c = clist(mt);
    const hang = mienDs.map((d) =&gt; [ten(d), c[d].map(([o, q]) =&gt; &#96;&#36;{o}:&#36;{q}&#96;).join('  ')]);
    return {
      svg: bang({ tieuDe: t('Cut by ROW = the capability list (C-list) of each domain', 'Cắt theo HÀNG = danh sách khả năng (C-list) của từng miền'), dau: [t('domain', 'miền'), 'C-list'], hang, size: 13 }),
      alt: t('The rows of Figure 9-4 written as one capability list per domain', 'Các hàng của Hình 9-4 viết thành một danh sách khả năng cho mỗi miền'),
      data: { dapAn: String(c[3].length) },
    };
  }
  // #ma-tran (mặc định)
  const hang = mienDs.map((d) =&gt; [ten(d), ...mt.doiTuong.map((o) =&gt; mt.mien[d][o] || '')]);
  return {
    svg: bang({ tieuDe: t('Figure 9-4 — the protection matrix (rows = domains, columns = objects)', 'Hình 9-4 — ma trận bảo vệ (hàng = miền, cột = đối tượng)'),
      dau: [t('domain \\\\ object', 'miền \\\\ đối tượng'), ...mt.doiTuong], hang, size: 13, toiThieuCot: 40,
      mau: (r, c, s) =&gt; (c &gt; 0 &amp;&amp; s ? MAU.totNen : undefined) }),
    alt: t('Protection matrix of three domains over eight objects', 'Ma trận bảo vệ của ba miền trên tám đối tượng'),
    html: &#96;&lt;p&gt;&#36;{t('Check: may domain 2 write File4?', 'Kiểm: miền 2 có được ghi File4 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 2, 'File4', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;; &#36;{t('may domain 1 write File1?', 'miền 1 có được ghi File1 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 1, 'File1', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;.&lt;/p&gt;&#96;,
    data: { dapAn: String(mienDs.reduce((n, d) =&gt; n + Object.keys(mt.mien[d]).length, 0)) },
  };
}</code></pre></details>
<p>➕ Unix cổ điển có một ACL nhỏ xíu: ba mục — chủ, nhóm, người khác — mỗi mục r, w, x: đó là thứ <code>ls -l</code> in ra (<code>-rw-r-----</code> = chủ rw, nhóm r, người khác không gì; lần chạy ở slide 5 đã cho thấy). ACL POSIX mở rộng thành số người dùng và nhóm có tên tuỳ ý, đặt bằng <code>setfacl -m u:bob:r file</code> và đọc bằng <code>getfacl file</code> (gói <code>acl</code>; ảnh của môn không kèm gói này nên không có output để hiện — trên Debian/Ubuntu của bạn: <code>sudo apt install acl</code>). Dấu <code>+</code> sau mode trong <code>ls -l</code> báo có ACL mở rộng. NTFS của Windows và kho đối tượng đám mây (ACL bucket S3, chính sách Cloudflare R2) dùng cùng ý này.</p>
<p class="pitfall">⚠️ ACL = danh sách gắn với <em>đối tượng</em> (cột). Nhân phải kiểm nó ở <em>mọi</em> lần truy cập nên ACL dài tốn thời gian; Unix giữ ba mục vì lý do đó.</p>`],
      [9, 'Access Control Lists (2)',
        `<p class="y-chinh">🎯 Figure 9-7: two ACLs written out with <em>user, group</em> pairs: file <code>Password</code>: <code>tana, sysadm: RW</code>; file <code>Pigeon_data</code>: <code>bill, pigfan: RW; tana, pigfan: RW; …</code>. An entry is a <strong>(user, group)</strong> pair with a rights set — and a wildcard <code>*</code> may stand for "any user" or "any group".</p>
<p>The book's example: user <code>tana</code> may use <code>Pigeon_data</code> only <em>as a member of group pigfan</em>, but may edit <code>Password</code> only <em>as sysadm</em>. The same person acts in different domains depending on which group hat she wears at login — so the domain really is the (user, group) pair of slide 5. Rules like "<code>*, pigfan: R</code>" give every pigfan read access without naming people, and a "deny" entry (<code>bill, *: —</code>) can cut a specific user out even when a group would let him in. Windows NTFS supports explicit deny entries; classic Unix modes do not (owner bits win, even to deny: an owner with mode <code>0</code> on his own file is refused, as the next experiment shows).</p>
<p>➕ A user may hold <em>several</em> groups at once on Linux; the kernel unions the rights of all of them — see <code>id</code>:</p>
<div class="out"># Slide 9: Unix picks the FIRST matching class (owner, then group, then others) — it does not add them up<br>
$ cd /tmp; echo "du lieu chim bo cau" &gt; pigeon_data<br>
$ chown tana:pigfan pigeon_data<br>
# tana wears two group hats at once; the kernel unions the GROUP rights she has<br>
$ runuser -u tana -- id<br>
uid=1001(tana) gid=1001(tana) groups=1001(tana),1002(pigfan),1003(sysadm)<br>
$ chmod 060 pigeon_data; ls -l pigeon_data<br>
----rw---- 1 tana pigfan 20 Oct 26 03:01 pigeon_data<br>
# owner entry is --- and group entry is rw-: tana is the owner AND in the group — the owner entry wins, so she is refused<br>
$ runuser -u tana -- cat pigeon_data; echo "exit=$?"<br>
cat: pigeon_data: Permission denied<br>
exit=1<br>
# somebody else in group pigfan (not the owner) is allowed through the group entry<br>
$ chmod 460 pigeon_data; ls -l pigeon_data<br>
-r--rw---- 1 tana pigfan 20 Oct 26 03:01 pigeon_data<br>
$ runuser -u bill -- cat pigeon_data; echo "exit=$?"<br>
du lieu chim bo cau<br>
exit=0</div>
<p>The "owner beats group" rule shows in the middle: mode <code>060</code> gives the group rights but the owner none — the owner is refused though he is also in the group, because Unix picks the <em>first matching entry</em> (owner, then group, then others) and stops.</p>
<p class="pitfall">⚠️ Unix picks the <em>first</em> matching class, it does not add them up: owner ≠ group ≠ others. A common FE-style mistake is to think "owner with --- can still read through the group bits" — he cannot.</p>`,
        `<p class="y-chinh">🎯 Hình 9-7: hai ACL viết ra với các cặp <em>người dùng, nhóm</em>: tệp <code>Password</code>: <code>tana, sysadm: RW</code>; tệp <code>Pigeon_data</code>: <code>bill, pigfan: RW; tana, pigfan: RW; …</code>. Một mục là cặp <strong>(người dùng, nhóm)</strong> kèm tập quyền — và ký tự thay thế <code>*</code> có thể là "mọi người dùng" hay "mọi nhóm".</p>
<p>Ví dụ của sách: người dùng <code>tana</code> chỉ được dùng <code>Pigeon_data</code> <em>với tư cách thành viên nhóm pigfan</em>, và chỉ sửa <code>Password</code> <em>với tư cách sysadm</em>. Cùng một người hành động trong các miền khác nhau tuỳ chiếc mũ nhóm cô đội lúc đăng nhập — nên miền thật sự là cặp (người dùng, nhóm) của slide 5. Luật như "<code>*, pigfan: R</code>" cho mọi pigfan quyền đọc mà không cần nêu tên, và mục "từ chối" (<code>bill, *: —</code>) có thể loại một người cụ thể ngay cả khi nhóm cho phép anh vào. NTFS của Windows hỗ trợ mục từ chối tường minh; mode Unix cổ điển thì không (bit chủ thắng, kể cả để từ chối: chủ có mode <code>0</code> trên tệp của chính mình bị từ chối, như thí nghiệm kế tiếp cho thấy).</p>
<p>➕ Trên Linux một người dùng có thể thuộc <em>nhiều</em> nhóm cùng lúc; nhân hợp quyền của tất cả — xem <code>id</code>:</p>
<div class="out"># Slide 9: Unix chọn lớp khớp ĐẦU TIÊN (chủ, rồi nhóm, rồi người khác) — không cộng dồn<br>
$ cd /tmp; echo "du lieu chim bo cau" &gt; pigeon_data<br>
$ chown tana:pigfan pigeon_data<br>
# tana đội hai chiếc mũ nhóm cùng lúc; nhân hợp các quyền NHÓM của cô<br>
$ runuser -u tana -- id<br>
uid=1001(tana) gid=1001(tana) groups=1001(tana),1002(pigfan),1003(sysadm)<br>
$ chmod 060 pigeon_data; ls -l pigeon_data<br>
----rw---- 1 tana pigfan 20 Oct 26 03:01 pigeon_data<br>
# mục chủ là --- còn mục nhóm là rw-: tana vừa là chủ VỪA ở trong nhóm — mục chủ thắng nên cô bị từ chối<br>
$ runuser -u tana -- cat pigeon_data; echo "exit=$?"<br>
cat: pigeon_data: Permission denied<br>
exit=1<br>
# người khác trong nhóm pigfan (không phải chủ) được qua bằng mục nhóm<br>
$ chmod 460 pigeon_data; ls -l pigeon_data<br>
-r--rw---- 1 tana pigfan 20 Oct 26 03:01 pigeon_data<br>
$ runuser -u bill -- cat pigeon_data; echo "exit=$?"<br>
du lieu chim bo cau<br>
exit=0</div>
<p>Quy tắc "chủ thắng nhóm" hiện ra ở giữa: mode <code>060</code> cho nhóm quyền nhưng chủ không có gì — chủ bị từ chối dù anh cũng ở trong nhóm, vì Unix chọn <em>mục khớp đầu tiên</em> (chủ, rồi nhóm, rồi người khác) và dừng.</p>
<p class="pitfall">⚠️ Unix chọn lớp khớp <em>đầu tiên</em>, không cộng dồn: chủ ≠ nhóm ≠ người khác. Lỗi kiểu FE hay gặp là nghĩ "chủ có --- vẫn đọc được qua bit nhóm" — không được.</p>`],
      [10, 'Capabilities (1)',
        `<p class="y-chinh">🎯 Figure 9-8: with <strong>capabilities</strong> each <em>process</em> has a <strong>capability list (C-list)</strong>, kept in kernel space: process A: F1:R, F2:R · B: F1:R, F2:RW, F3:RWX · C: F2:R, F3:RX. The matrix is stored <strong>by row</strong>. A capability is an <em>unforgeable ticket</em>: holding it <em>is</em> the right — the kernel does not ask "who are you?", only "do you hold the ticket?".</p>
<p>A cinema ticket versus a guest list. The ACL (guest list) checks <em>your name</em> against the film's list; the capability (ticket) checks only that you <em>hold a ticket for this film</em> — you may even hand it to a friend. That makes capabilities good for subject-centred questions (everything process A holds is in one list) and for <em>delegation</em> (pass a ticket to a helper process), and awkward for revocation (how do you take back a ticket already copied?).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e6b21a73b6e3687f3da92e61429fc2fa9bae9409.svg" alt="The rows of Figure 9-4 written as C-lists" loading="lazy" /><p class="chu-thich">🧮 The rows of Figure 9-4 written as C-lists</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">/**
 * Mô phỏng — ma trận bảo vệ (MOS 4e §9.3.1–9.3.4, Hình 9-3…9-9). Cùng MỘT ma trận 3 miền × 8 đối tượng (Hình 9-4):
 *   #ma-tran  : vẽ ma trận;  #acl : cắt theo CỘT = ACL của từng đối tượng (Hình 9-6/9-7);  #clist : cắt theo HÀNG = C-list của
 *   từng miền (Hình 9-8);  #trang-thai : Hình 9-10 — trạng thái (a) được phép, (b) có thêm một quyền bị cấm, ô bị tô đỏ.
 * data.dapAn = chuỗi đáp án (số mục ACL của File1…, hoặc số ô vi phạm).
 */
import { MA_TRAN_9_4, TRANG_THAI_9_10, acl, clist, soSanhTrangThai, duocPhep } from '../_thuat-toan/bao-mat.mjs';
import { bang } from './_luoi.mjs';
import { L, MAU } from '../_ve.mjs';

export default function ({ bien, lang }) {
  const t = L(lang);
  const mt = MA_TRAN_9_4;
  const mienDs = Object.keys(mt.mien);
  const ten = (d) =&gt; t(&#96;Domain &#36;{d}&#96;, &#96;Miền &#36;{d}&#96;);
  if (bien === 'trang-thai') {
    const ts = TRANG_THAI_9_10;
    const khac = soSanhTrangThai(ts);
    const dang = (st) =&gt; ts.chuThe.map((c) =&gt; [c, ...ts.doiTuong.map((o) =&gt; (st[c] || {})[o] || '')]);
    const svg = (st, nhan) =&gt; bang({ tieuDe: nhan, dau: [t('subject', 'chủ thể'), ...ts.doiTuong], hang: dang(st),
      mau: (r, c, s) =&gt; (st === ts.b &amp;&amp; ts.chuThe[r] === 'Robert' &amp;&amp; ts.doiTuong[c - 1] === 'Mailbox 7' &amp;&amp; s ? MAU.xauNen : undefined) });

    const b = svg(ts.b, t('(b) unauthorized state', '(b) trạng thái KHÔNG được phép'));

    return {
      svg: b, alt: t('Figure 9-10(b): Robert has gained Read on Mailbox 7 — the red cell is outside the policy', 'Hình 9-10(b): Robert có thêm quyền Read trên Mailbox 7 — ô đỏ nằm ngoài chính sách'),
      html: &#96;&lt;p&gt;&#36;{t('The only difference between (a) and (b):', 'Khác biệt duy nhất giữa (a) và (b):')} &#36;{khac.map((k) =&gt; &#96;&lt;code&gt;&#36;{k.chuThe}&lt;/code&gt; × &lt;code&gt;&#36;{k.doiTuong}&lt;/code&gt;: “&#36;{k.truoc || '—'}” → “&#36;{k.sau}”&#36;{k.viPham ? t(' (forbidden by the policy)', ' (bị chính sách cấm)') : ''}&#96;).join('; ')}.&lt;/p&gt;&#96;,
      data: { dapAn: String(khac.filter((k) =&gt; k.viPham).length) },
    };
  }
  if (bien === 'acl') {
    const a = acl(mt);
    const hang = mt.doiTuong.map((o) =&gt; [o, a[o].map(([d, q]) =&gt; &#96;&#36;{ten(d)}: &#36;{q}&#96;).join(' · ') || t('(nobody)', '(không ai)')]);
    return {
      svg: bang({ tieuDe: t('Cut by COLUMN = the access control list of each object', 'Cắt theo CỘT = danh sách điều khiển truy cập (ACL) của từng đối tượng'), dau: [t('object', 'đối tượng'), 'ACL'], hang, size: 13 }),
      alt: t('The columns of Figure 9-4 written as one ACL per object', 'Các cột của Hình 9-4 viết thành một ACL cho mỗi đối tượng'),
      data: { dapAn: String(a.Printer1.length) },
    };
  }
  if (bien === 'clist') {
    const c = clist(mt);
    const hang = mienDs.map((d) =&gt; [ten(d), c[d].map(([o, q]) =&gt; &#96;&#36;{o}:&#36;{q}&#96;).join('  ')]);
    return {
      svg: bang({ tieuDe: t('Cut by ROW = the capability list (C-list) of each domain', 'Cắt theo HÀNG = danh sách khả năng (C-list) của từng miền'), dau: [t('domain', 'miền'), 'C-list'], hang, size: 13 }),
      alt: t('The rows of Figure 9-4 written as one capability list per domain', 'Các hàng của Hình 9-4 viết thành một danh sách khả năng cho mỗi miền'),
      data: { dapAn: String(c[3].length) },
    };
  }
  // #ma-tran (mặc định)
  const hang = mienDs.map((d) =&gt; [ten(d), ...mt.doiTuong.map((o) =&gt; mt.mien[d][o] || '')]);
  return {
    svg: bang({ tieuDe: t('Figure 9-4 — the protection matrix (rows = domains, columns = objects)', 'Hình 9-4 — ma trận bảo vệ (hàng = miền, cột = đối tượng)'),
      dau: [t('domain \\\\ object', 'miền \\\\ đối tượng'), ...mt.doiTuong], hang, size: 13, toiThieuCot: 40,
      mau: (r, c, s) =&gt; (c &gt; 0 &amp;&amp; s ? MAU.totNen : undefined) }),
    alt: t('Protection matrix of three domains over eight objects', 'Ma trận bảo vệ của ba miền trên tám đối tượng'),
    html: &#96;&lt;p&gt;&#36;{t('Check: may domain 2 write File4?', 'Kiểm: miền 2 có được ghi File4 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 2, 'File4', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;; &#36;{t('may domain 1 write File1?', 'miền 1 có được ghi File1 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 1, 'File1', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;.&lt;/p&gt;&#96;,
    data: { dapAn: String(mienDs.reduce((n, d) =&gt; n + Object.keys(mt.mien[d]).length, 0)) },
  };
}</code></pre></details>
<p>➕ <strong>Linux already has capabilities — you use them every day: file descriptors.</strong> <code>open()</code> checks your rights <em>once</em>, then returns a small number that indexes your process's fd table inside the kernel — a C-list. Afterwards <code>read(fd)</code> never asks who you are. The proof: a root process opens a root-only file, gives up root, and can <em>still</em> read through the descriptor, but a brand-new <code>open()</code> is refused.</p>
<pre><code class="language-c">// Slide 10 (Figure 9-8): a file descriptor is a CAPABILITY — an index into the kernel's capability list (the fd table) of this process
// Run as root (the default in the container)
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;sys/stat.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
int main(void) {
    const char *path = "/tmp/bi-mat.txt";
    FILE *f = fopen(path, "w"); fputs("db password = hunter2\\n", f); fclose(f);   // root writes a secret
    chmod(path, 0600);                                                             // only root may open it
    int fd = open(path, O_RDONLY);                                                 // the kernel checks the rights ONCE, here
    printf("opened as uid %d -&gt; fd %d\\n", (int)geteuid(), fd);
    if (setgid(1000) || setuid(1000)) { perror("drop privileges"); return 1; }      // give up root for good
    printf("now uid %d\\n", (int)geteuid());
    char buf[64]; ssize_t n = read(fd, buf, sizeof buf - 1); buf[n &gt; 0 ? n : 0] = 0;
    printf("read() on the old fd : %s", buf);                                      // still works: possession of the fd IS the right
    int fd2 = open(path, O_RDONLY);                                                // a NEW open is checked against uid 1000
    printf("open() again     : %s\\n", fd2 &lt; 0 ? strerror(errno) : "allowed");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread fd-la-capability.c -o fd-la-capability &amp;&amp; ./fd-la-capability<br>
opened as uid 0 -&gt; fd 3<br>
now uid 1000<br>
read() on the old fd : db password = hunter2<br>
open() again &nbsp;&nbsp;&nbsp;&nbsp;: Permission denied</div>
<p>This is why a web server opens its port 443 socket and its TLS key file as root, then drops to an ordinary user: the descriptors it already holds keep working, nothing new can be opened. Unix descriptors are passed to children by <code>fork()</code> and even over sockets (<code>SCM_RIGHTS</code>) — delegation of tickets in action.</p>
<p class="pitfall">⚠️ Do not confuse the two Linux meanings of "capability": (a) the <em>textbook</em> capability (ticket for an object, like an fd) and (b) the <em>POSIX/Linux capabilities</em> that split root into ~40 privileges (slide 12). Related spirit, different objects.</p>`,
        `<p class="y-chinh">🎯 Hình 9-8: với <strong>capability</strong> mỗi <em>tiến trình</em> có một <strong>danh sách capability (C-list)</strong>, giữ trong không gian nhân: tiến trình A: F1:R, F2:R · B: F1:R, F2:RW, F3:RWX · C: F2:R, F3:RX. Ma trận được lưu <strong>theo hàng</strong>. Capability là một <em>tấm vé không giả được</em>: cầm nó <em>là</em> có quyền — nhân không hỏi "bạn là ai?", chỉ hỏi "bạn có vé không?".</p>
<p>Vé xem phim so với danh sách khách. ACL (danh sách khách) so <em>tên bạn</em> với danh sách của bộ phim; capability (vé) chỉ kiểm bạn <em>có vé cho phim này</em> — bạn thậm chí đưa nó cho bạn mình được. Nhờ vậy capability tốt cho câu hỏi theo chủ thể (mọi thứ tiến trình A giữ nằm trong một danh sách) và cho <em>uỷ quyền</em> (đưa vé cho tiến trình phụ), và khó cho việc thu hồi (làm sao lấy lại tấm vé đã được chép đi?).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4c714e48ba4d9f413d1fcf13702f124b3dfb20a1.svg" alt="Các hàng của Hình 9-4 viết thành C-list" loading="lazy" /><p class="chu-thich">🧮 Các hàng của Hình 9-4 viết thành C-list</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">/**
 * Mô phỏng — ma trận bảo vệ (MOS 4e §9.3.1–9.3.4, Hình 9-3…9-9). Cùng MỘT ma trận 3 miền × 8 đối tượng (Hình 9-4):
 *   #ma-tran  : vẽ ma trận;  #acl : cắt theo CỘT = ACL của từng đối tượng (Hình 9-6/9-7);  #clist : cắt theo HÀNG = C-list của
 *   từng miền (Hình 9-8);  #trang-thai : Hình 9-10 — trạng thái (a) được phép, (b) có thêm một quyền bị cấm, ô bị tô đỏ.
 * data.dapAn = chuỗi đáp án (số mục ACL của File1…, hoặc số ô vi phạm).
 */
import { MA_TRAN_9_4, TRANG_THAI_9_10, acl, clist, soSanhTrangThai, duocPhep } from '../_thuat-toan/bao-mat.mjs';
import { bang } from './_luoi.mjs';
import { L, MAU } from '../_ve.mjs';

export default function ({ bien, lang }) {
  const t = L(lang);
  const mt = MA_TRAN_9_4;
  const mienDs = Object.keys(mt.mien);
  const ten = (d) =&gt; t(&#96;Domain &#36;{d}&#96;, &#96;Miền &#36;{d}&#96;);
  if (bien === 'trang-thai') {
    const ts = TRANG_THAI_9_10;
    const khac = soSanhTrangThai(ts);
    const dang = (st) =&gt; ts.chuThe.map((c) =&gt; [c, ...ts.doiTuong.map((o) =&gt; (st[c] || {})[o] || '')]);
    const svg = (st, nhan) =&gt; bang({ tieuDe: nhan, dau: [t('subject', 'chủ thể'), ...ts.doiTuong], hang: dang(st),
      mau: (r, c, s) =&gt; (st === ts.b &amp;&amp; ts.chuThe[r] === 'Robert' &amp;&amp; ts.doiTuong[c - 1] === 'Mailbox 7' &amp;&amp; s ? MAU.xauNen : undefined) });

    const b = svg(ts.b, t('(b) unauthorized state', '(b) trạng thái KHÔNG được phép'));

    return {
      svg: b, alt: t('Figure 9-10(b): Robert has gained Read on Mailbox 7 — the red cell is outside the policy', 'Hình 9-10(b): Robert có thêm quyền Read trên Mailbox 7 — ô đỏ nằm ngoài chính sách'),
      html: &#96;&lt;p&gt;&#36;{t('The only difference between (a) and (b):', 'Khác biệt duy nhất giữa (a) và (b):')} &#36;{khac.map((k) =&gt; &#96;&lt;code&gt;&#36;{k.chuThe}&lt;/code&gt; × &lt;code&gt;&#36;{k.doiTuong}&lt;/code&gt;: “&#36;{k.truoc || '—'}” → “&#36;{k.sau}”&#36;{k.viPham ? t(' (forbidden by the policy)', ' (bị chính sách cấm)') : ''}&#96;).join('; ')}.&lt;/p&gt;&#96;,
      data: { dapAn: String(khac.filter((k) =&gt; k.viPham).length) },
    };
  }
  if (bien === 'acl') {
    const a = acl(mt);
    const hang = mt.doiTuong.map((o) =&gt; [o, a[o].map(([d, q]) =&gt; &#96;&#36;{ten(d)}: &#36;{q}&#96;).join(' · ') || t('(nobody)', '(không ai)')]);
    return {
      svg: bang({ tieuDe: t('Cut by COLUMN = the access control list of each object', 'Cắt theo CỘT = danh sách điều khiển truy cập (ACL) của từng đối tượng'), dau: [t('object', 'đối tượng'), 'ACL'], hang, size: 13 }),
      alt: t('The columns of Figure 9-4 written as one ACL per object', 'Các cột của Hình 9-4 viết thành một ACL cho mỗi đối tượng'),
      data: { dapAn: String(a.Printer1.length) },
    };
  }
  if (bien === 'clist') {
    const c = clist(mt);
    const hang = mienDs.map((d) =&gt; [ten(d), c[d].map(([o, q]) =&gt; &#96;&#36;{o}:&#36;{q}&#96;).join('  ')]);
    return {
      svg: bang({ tieuDe: t('Cut by ROW = the capability list (C-list) of each domain', 'Cắt theo HÀNG = danh sách khả năng (C-list) của từng miền'), dau: [t('domain', 'miền'), 'C-list'], hang, size: 13 }),
      alt: t('The rows of Figure 9-4 written as one capability list per domain', 'Các hàng của Hình 9-4 viết thành một danh sách khả năng cho mỗi miền'),
      data: { dapAn: String(c[3].length) },
    };
  }
  // #ma-tran (mặc định)
  const hang = mienDs.map((d) =&gt; [ten(d), ...mt.doiTuong.map((o) =&gt; mt.mien[d][o] || '')]);
  return {
    svg: bang({ tieuDe: t('Figure 9-4 — the protection matrix (rows = domains, columns = objects)', 'Hình 9-4 — ma trận bảo vệ (hàng = miền, cột = đối tượng)'),
      dau: [t('domain \\\\ object', 'miền \\\\ đối tượng'), ...mt.doiTuong], hang, size: 13, toiThieuCot: 40,
      mau: (r, c, s) =&gt; (c &gt; 0 &amp;&amp; s ? MAU.totNen : undefined) }),
    alt: t('Protection matrix of three domains over eight objects', 'Ma trận bảo vệ của ba miền trên tám đối tượng'),
    html: &#96;&lt;p&gt;&#36;{t('Check: may domain 2 write File4?', 'Kiểm: miền 2 có được ghi File4 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 2, 'File4', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;; &#36;{t('may domain 1 write File1?', 'miền 1 có được ghi File1 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 1, 'File1', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;.&lt;/p&gt;&#96;,
    data: { dapAn: String(mienDs.reduce((n, d) =&gt; n + Object.keys(mt.mien[d]).length, 0)) },
  };
}</code></pre></details>
<p>➕ <strong>Linux đã có capability — bạn dùng hằng ngày: mô tả tệp (file descriptor).</strong> <code>open()</code> kiểm quyền của bạn <em>một lần</em>, rồi trả một số nhỏ làm chỉ số vào bảng fd của tiến trình trong nhân — một C-list. Sau đó <code>read(fd)</code> không bao giờ hỏi bạn là ai. Bằng chứng: tiến trình root mở một tệp chỉ root đọc được, bỏ quyền root, và vẫn đọc <em>được</em> qua descriptor, còn một lần <code>open()</code> mới thì bị từ chối.</p>
<pre><code class="language-c">// Slide 10 (Hình 9-8): file descriptor là một CAPABILITY — chỉ số trong danh sách khả năng của nhân (bảng fd) của tiến trình này
// Chạy bằng root (mặc định trong container)
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;sys/stat.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
int main(void) {
    const char *path = "/tmp/bi-mat.txt";
    FILE *f = fopen(path, "w"); fputs("db password = hunter2\\n", f); fclose(f);   // root ghi một bí mật
    chmod(path, 0600);                                                             // chỉ root được mở
    int fd = open(path, O_RDONLY);                                                 // nhân kiểm quyền MỘT lần, ngay đây
    printf("opened as uid %d -&gt; fd %d\\n", (int)geteuid(), fd);
    if (setgid(1000) || setuid(1000)) { perror("drop privileges"); return 1; }      // bỏ root vĩnh viễn
    printf("now uid %d\\n", (int)geteuid());
    char buf[64]; ssize_t n = read(fd, buf, sizeof buf - 1); buf[n &gt; 0 ? n : 0] = 0;
    printf("read() on the old fd : %s", buf);                                      // vẫn chạy: nắm fd chính là có quyền
    int fd2 = open(path, O_RDONLY);                                                // lần mở MỚI bị kiểm theo uid 1000
    printf("open() again     : %s\\n", fd2 &lt; 0 ? strerror(errno) : "allowed");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread fd-la-capability.c -o fd-la-capability &amp;&amp; ./fd-la-capability<br>
opened as uid 0 -&gt; fd 3<br>
now uid 1000<br>
read() on the old fd : db password = hunter2<br>
open() again &nbsp;&nbsp;&nbsp;&nbsp;: Permission denied</div>
<p>Đây là lý do máy chủ web mở socket cổng 443 và tệp khoá TLS bằng root rồi hạ xuống người dùng thường: các descriptor đã giữ vẫn chạy, không mở được gì mới. Descriptor Unix được truyền cho tiến trình con bằng <code>fork()</code> và thậm chí qua socket (<code>SCM_RIGHTS</code>) — uỷ quyền vé trong thực tế.</p>
<p class="pitfall">⚠️ Đừng lẫn hai nghĩa của "capability" trên Linux: (a) capability <em>theo sách</em> (vé cho một đối tượng, như fd) và (b) <em>capability POSIX/Linux</em> tách root thành ~40 đặc quyền (slide 12). Tinh thần liên quan, đối tượng khác nhau.</p>`],
      [11, 'Capabilities (2)',
        `<p class="y-chinh">🎯 Figure 9-9: a <strong>cryptographically protected capability</strong> kept in user space: fields <em>Server | Object | Rights | f(Objects, Rights, Check)</em>. The server puts a secret <em>Check</em> into a one-way function of the other fields; a user who edits <em>Rights</em> (to add W) cannot recompute the last field, so the forgery is detected.</p>
<p>When the C-list is in the kernel, the kernel guards it. But on a network (the Amoeba system of the book) the "ticket" lives in user memory and travels in messages — so it must protect itself. The trick is a <strong>MAC</strong> (message authentication code): a short tag computed from the content and a key only the server knows. Change one bit of the content and the tag no longer matches; without the key you cannot make a new tag. The server needs no list of who is allowed — it only verifies tags. That is why this design scales.</p>
<pre><code class="language-javascript">// Slide 11 (Figure 9-9): a cryptographically protected capability: Server | Object | Rights | f(Object, Rights, Check)
// The same idea runs the web: signed URLs (S3 / Cloudflare R2 presigned), JWT, API tokens
const crypto = require('node:crypto');
const BI_MAT_MAY_CHU = 'bi-mat-chi-may-chu-biet';           // the server's secret "Check" — never leaves the server
const f = (doiTuong, quyen, hetHan) =&gt; crypto.createHmac('sha256', BI_MAT_MAY_CHU).update(&#96;&#36;{doiTuong}|&#36;{quyen}|&#36;{hetHan}&#96;).digest('hex').slice(0, 16);

// the server issues a capability: (object, rights, expiry, tag)
const phat = (doiTuong, quyen, hetHan) =&gt; ({ doiTuong, quyen, hetHan, nhan: f(doiTuong, quyen, hetHan) });
// the server checks a capability presented by anyone: it needs NO list of who is allowed
const kiem = (cap, quyenCan, bayGio) =&gt; {
  if (f(cap.doiTuong, cap.quyen, cap.hetHan) !== cap.nhan) return 'REJECTED: tag does not match (forged or altered)';
  if (bayGio &gt; cap.hetHan) return 'REJECTED: expired';
  if (!cap.quyen.includes(quyenCan)) return &#96;REJECTED: no right "&#36;{quyenCan}"&#96;;
  return &#96;OK: &#36;{quyenCan} on &#36;{cap.doiTuong}&#96;;
};

const BAY_GIO = 1000;
const cap = phat('file-7', 'R', 2000);
console.log('issued      :', JSON.stringify(cap));
console.log('read        :', kiem(cap, 'R', BAY_GIO));
console.log('write       :', kiem(cap, 'W', BAY_GIO));
const gia = { ...cap, quyen: 'RW' };                      // the holder edits the Rights field
console.log('forged RW   :', kiem(gia, 'W', BAY_GIO));
const sangFile8 = { ...cap, doiTuong: 'file-8' };         // or points it at another object
console.log('other object:', kiem(sangFile8, 'R', BAY_GIO));
console.log('late        :', kiem(cap, 'R', 3000));
// a capability can be handed on without asking anybody: copy the JSON, paste it in a chat
const banSao = JSON.parse(JSON.stringify(cap));
console.log('copied      :', kiem(banSao, 'R', BAY_GIO), '  &lt;- anyone who holds it can use it (bearer token)');</code></pre>
<div class="out">$ node capability.js<br>
issued &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {"doiTuong":"file-7","quyen":"R","hetHan":2000,"nhan":"7544744638d66d59"}<br>
read &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: OK: R on file-7<br>
write &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: REJECTED: no right "W"<br>
forged RW &nbsp;&nbsp;: REJECTED: tag does not match (forged or altered)<br>
other object: REJECTED: tag does not match (forged or altered)<br>
late &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: REJECTED: expired<br>
copied &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: OK: R on file-7 &nbsp;&nbsp;&lt;- anyone who holds it can use it (bearer token)</div>
<p>The output shows all five behaviours: a valid ticket works for the right it carries, the forged <code>RW</code> and the re-pointed object are rejected, an expired one is rejected, and a <em>copied</em> ticket works for whoever holds it — the price of the design (a "bearer token").</p>
<p>🧭 <strong>This is how the modern web works.</strong> A Cloudflare R2/S3 <em>presigned URL</em> is exactly this: <code>object + rights (GET) + expiry + signature</code>. A <em>JWT</em> is a capability whose "rights" are claims. An API token is a capability with no expiry — which is why leaked tokens are so dangerous and why you give them short lifetimes and narrow rights. The course site's own media uploads use presigned URLs.</p>
<p class="pitfall">⚠️ Capabilities cannot be "revoked by editing a list" — design for expiry (short <code>exp</code>), per-object keys, or a server-side deny list.</p>`,
        `<p class="y-chinh">🎯 Hình 9-9: <strong>capability được bảo vệ bằng mật mã</strong> giữ trong không gian người dùng: các trường <em>Server | Object | Rights | f(Objects, Rights, Check)</em>. Máy chủ đưa một <em>Check</em> bí mật vào một hàm một chiều của các trường còn lại; người dùng sửa <em>Rights</em> (để thêm W) không tính lại được trường cuối nên giả mạo bị phát hiện.</p>
<p>Khi C-list nằm trong nhân thì nhân canh nó. Nhưng trên mạng (hệ Amoeba của sách) "tấm vé" nằm trong bộ nhớ người dùng và đi trong các thông điệp — nên nó phải tự bảo vệ. Mánh là <strong>MAC</strong> (mã xác thực thông điệp): một nhãn ngắn tính từ nội dung và một khoá chỉ máy chủ biết. Đổi một bit nội dung thì nhãn không còn khớp; không có khoá thì không tạo được nhãn mới. Máy chủ không cần danh sách ai được phép — nó chỉ kiểm nhãn. Vì thế thiết kế này mở rộng được.</p>
<pre><code class="language-javascript">// Slide 11 (Hình 9-9): capability được bảo vệ bằng mật mã: Server | Object | Rights | f(Object, Rights, Check)
// Cùng ý tưởng chạy cả web: URL ký sẵn (S3 / Cloudflare R2), JWT, token API
const crypto = require('node:crypto');
const BI_MAT_MAY_CHU = 'bi-mat-chi-may-chu-biet';           // "Check" bí mật của máy chủ — không rời máy chủ
const f = (doiTuong, quyen, hetHan) =&gt; crypto.createHmac('sha256', BI_MAT_MAY_CHU).update(&#96;&#36;{doiTuong}|&#36;{quyen}|&#36;{hetHan}&#96;).digest('hex').slice(0, 16);

// máy chủ cấp một capability: (đối tượng, quyền, hạn, nhãn)
const phat = (doiTuong, quyen, hetHan) =&gt; ({ doiTuong, quyen, hetHan, nhan: f(doiTuong, quyen, hetHan) });
// máy chủ kiểm một capability do BẤT KỲ AI đưa tới: không cần danh sách ai được phép
const kiem = (cap, quyenCan, bayGio) =&gt; {
  if (f(cap.doiTuong, cap.quyen, cap.hetHan) !== cap.nhan) return 'REJECTED: tag does not match (forged or altered)';
  if (bayGio &gt; cap.hetHan) return 'REJECTED: expired';
  if (!cap.quyen.includes(quyenCan)) return &#96;REJECTED: no right "&#36;{quyenCan}"&#96;;
  return &#96;OK: &#36;{quyenCan} on &#36;{cap.doiTuong}&#96;;
};

const BAY_GIO = 1000;
const cap = phat('file-7', 'R', 2000);
console.log('issued      :', JSON.stringify(cap));
console.log('read        :', kiem(cap, 'R', BAY_GIO));
console.log('write       :', kiem(cap, 'W', BAY_GIO));
const gia = { ...cap, quyen: 'RW' };                      // người giữ tự sửa trường Rights
console.log('forged RW   :', kiem(gia, 'W', BAY_GIO));
const sangFile8 = { ...cap, doiTuong: 'file-8' };         // hoặc trỏ nó sang đối tượng khác
console.log('other object:', kiem(sangFile8, 'R', BAY_GIO));
console.log('late        :', kiem(cap, 'R', 3000));
// capability đưa cho người khác được mà không cần hỏi ai: chép JSON, dán vào chat
const banSao = JSON.parse(JSON.stringify(cap));
console.log('copied      :', kiem(banSao, 'R', BAY_GIO), '  &lt;- anyone who holds it can use it (bearer token)');</code></pre>
<div class="out">$ node capability.js<br>
issued &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {"doiTuong":"file-7","quyen":"R","hetHan":2000,"nhan":"7544744638d66d59"}<br>
read &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: OK: R on file-7<br>
write &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: REJECTED: no right "W"<br>
forged RW &nbsp;&nbsp;: REJECTED: tag does not match (forged or altered)<br>
other object: REJECTED: tag does not match (forged or altered)<br>
late &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: REJECTED: expired<br>
copied &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: OK: R on file-7 &nbsp;&nbsp;&lt;- anyone who holds it can use it (bearer token)</div>
<p>Output cho thấy cả năm hành vi: vé hợp lệ chạy với đúng quyền nó mang, bản giả <code>RW</code> và đối tượng bị trỏ lại bị từ chối, vé hết hạn bị từ chối, và vé <em>được chép</em> chạy với bất kỳ ai cầm nó — cái giá của thiết kế (một "bearer token").</p>
<p>🧭 <strong>Web hiện đại chạy đúng như vậy.</strong> <em>URL ký sẵn (presigned URL)</em> của Cloudflare R2/S3 chính là cái này: <code>đối tượng + quyền (GET) + hạn + chữ ký</code>. <em>JWT</em> là capability có "quyền" là các claim. Token API là capability không hạn — vì thế token bị lộ rất nguy hiểm và bạn nên đặt hạn ngắn và quyền hẹp. Chính việc tải media của site khoá học dùng URL ký sẵn.</p>
<p class="pitfall">⚠️ Capability không "thu hồi bằng cách sửa danh sách" được — thiết kế cho hết hạn (<code>exp</code> ngắn), khoá riêng cho từng đối tượng, hoặc danh sách từ chối phía máy chủ.</p>`],
      [12, 'Capabilities (3)',
        `<p class="y-chinh">🎯 Four <strong>generic rights</strong> that apply to every capability: <strong>copy capability</strong> (make a new ticket for the same object), <strong>copy object</strong> (duplicate the object and get a ticket for the copy), <strong>remove capability</strong> (delete the entry from my C-list — the object is unaffected), <strong>destroy object</strong> (permanently remove object and capability).</p>
<p>Notice what is missing from the list: "see who else holds a ticket" or "revoke every ticket". The four rights are about <em>my own ticket and the object</em>. In a house: copying a key (right 1), building a second house (2), throwing away <em>my</em> key (3 — the house still stands), demolishing the house (4). This is also why removal and destruction are separate rights: losing a key is harmless to others; demolition is not.</p>
<p>➕ <strong>Linux capabilities</strong> (capabilities(7)) turn the same idea on "root": instead of one all-powerful user, the kernel has ~40 separate rights — <code>CAP_NET_BIND_SERVICE</code> (ports below 1024), <code>CAP_CHOWN</code>, <code>CAP_DAC_OVERRIDE</code> (ignore file permission bits), <code>CAP_SYS_ADMIN</code> (a grab-bag) and so on. A process holds sets of them (permitted, effective, inheritable, bounding, ambient) and a file can carry some (<code>setcap</code>). Experiment:</p>
<div class="out"># Slides 10-12: capabilities — unforgeable tokens of authority. Linux splits "root" into ~40 of them<br>
# what a root process in a default container really holds (a handful, NOT everything)<br>
$ capsh --print | head -1<br>
Current: cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap=ep<br>
$ runuser -u sv -- capsh --print | head -1<br>
Current: =<br>
# the bit mask in /proc, decoded (CapEff = capabilities in force right now)<br>
$ grep CapEff /proc/self/status<br>
CapEff:	00000000a80425fb<br>
$ capsh --decode=00000000a80425fb | sed 's/^[^=]*=//; s/,/ /g' | fold -s -w 100<br>
cap_chown cap_dac_override cap_fowner cap_fsetid cap_kill cap_setgid cap_setuid cap_setpcap<br>
cap_net_bind_service cap_net_raw cap_sys_chroot cap_mknod cap_audit_write cap_setfcap<br>
# Linux capabilities in action: a file owned by sv with mode 600 — root can still read it thanks to CAP_DAC_OVERRIDE<br>
$ echo "ghi chu rieng cua sv" &gt; /tmp/rieng.txt; chown sv /tmp/rieng.txt; chmod 600 /tmp/rieng.txt<br>
$ cat /tmp/rieng.txt<br>
ghi chu rieng cua sv<br>
# the same root, with that ONE capability removed (copy C of slide 12: remove a capability): refused<br>
$ capsh --drop=cap_dac_override --user=root -- -c 'cat /tmp/rieng.txt'<br>
cat: /tmp/rieng.txt: Permission denied<br>
# a capability can also be attached to a program file: this one may bind ports below 1024 and nothing else<br>
$ cp /bin/true /usr/local/bin/nhe; setcap cap_net_bind_service+ep /usr/local/bin/nhe; getcap /usr/local/bin/nhe<br>
/usr/local/bin/nhe cap_net_bind_service=ep</div>
<p>Read it: a root process inside a default Docker container holds 14 capabilities, <em>not all of them</em> — no <code>CAP_SYS_ADMIN</code>, no <code>CAP_SYS_MODULE</code> — which is why container root is much weaker than host root. User <code>sv</code> holds none. Dropping <code>CAP_DAC_OVERRIDE</code> from root makes root obey a 600 file it does not own: "remove capability", slide 12 right 3, in real life. The last line gives a program <em>one</em> right (<code>cap_net_bind_service</code>), instead of making it setuid root — the modern replacement for the slide-7 doorway.</p>
<p>🧭 On a real server: <code>docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE …</code> is the least-privilege recipe for a web server; Kubernetes has <code>securityContext.capabilities.drop: [ALL]</code>. Never use <code>--privileged</code> (all capabilities, no seccomp) for an app.</p>`,
        `<p class="y-chinh">🎯 Bốn <strong>quyền chung</strong> áp dụng cho mọi capability: <strong>copy capability</strong> (làm vé mới cho cùng đối tượng), <strong>copy object</strong> (nhân bản đối tượng và nhận vé cho bản sao), <strong>remove capability</strong> (xoá mục khỏi C-list của tôi — đối tượng không bị ảnh hưởng), <strong>destroy object</strong> (xoá vĩnh viễn đối tượng và capability).</p>
<p>Để ý cái không có trong danh sách: "xem ai khác đang giữ vé" hay "thu hồi mọi vé". Bốn quyền nói về <em>vé của tôi và đối tượng</em>. Trong một ngôi nhà: chép chìa khoá (quyền 1), xây ngôi nhà thứ hai (2), vứt chìa <em>của tôi</em> (3 — nhà vẫn đứng), phá nhà (4). Đó cũng là lý do gỡ bỏ và phá huỷ là hai quyền riêng: mất chìa không hại người khác; phá nhà thì có.</p>
<p>➕ <strong>Capability của Linux</strong> (capabilities(7)) áp cùng ý tưởng cho "root": thay vì một người dùng toàn năng, nhân có ~40 quyền riêng — <code>CAP_NET_BIND_SERVICE</code> (cổng dưới 1024), <code>CAP_CHOWN</code>, <code>CAP_DAC_OVERRIDE</code> (bỏ qua bit quyền tệp), <code>CAP_SYS_ADMIN</code> (một cái túi tạp) và vân vân. Tiến trình giữ các tập quyền (permitted, effective, inheritable, bounding, ambient) và tệp có thể mang một số (<code>setcap</code>). Thí nghiệm:</p>
<div class="out"># Slide 10-12: capability — thẻ quyền không giả được. Linux tách "root" thành khoảng 40 capability<br>
# một tiến trình root trong container mặc định thật sự giữ gì (một nắm, KHÔNG phải tất cả)<br>
$ capsh --print | head -1<br>
Current: cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap=ep<br>
$ runuser -u sv -- capsh --print | head -1<br>
Current: =<br>
# mặt nạ bit trong /proc, giải mã ra (CapEff = capability đang có hiệu lực)<br>
$ grep CapEff /proc/self/status<br>
CapEff:	00000000a80425fb<br>
$ capsh --decode=00000000a80425fb | sed 's/^[^=]*=//; s/,/ /g' | fold -s -w 100<br>
cap_chown cap_dac_override cap_fowner cap_fsetid cap_kill cap_setgid cap_setuid cap_setpcap<br>
cap_net_bind_service cap_net_raw cap_sys_chroot cap_mknod cap_audit_write cap_setfcap<br>
# capability của Linux hoạt động: tệp của sv, mode 600 — root vẫn đọc được nhờ CAP_DAC_OVERRIDE<br>
$ echo "ghi chu rieng cua sv" &gt; /tmp/rieng.txt; chown sv /tmp/rieng.txt; chmod 600 /tmp/rieng.txt<br>
$ cat /tmp/rieng.txt<br>
ghi chu rieng cua sv<br>
# cũng root đó, bị bỏ ĐÚNG MỘT capability đó (thao tác "remove capability" của slide 12): bị từ chối<br>
$ capsh --drop=cap_dac_override --user=root -- -c 'cat /tmp/rieng.txt'<br>
cat: /tmp/rieng.txt: Permission denied<br>
# capability cũng gắn được vào tệp chương trình: cái này được bind cổng dưới 1024 và không gì khác<br>
$ cp /bin/true /usr/local/bin/nhe; setcap cap_net_bind_service+ep /usr/local/bin/nhe; getcap /usr/local/bin/nhe<br>
/usr/local/bin/nhe cap_net_bind_service=ep</div>
<p>Đọc kết quả: tiến trình root trong container Docker mặc định giữ 14 capability, <em>không phải tất cả</em> — không có <code>CAP_SYS_ADMIN</code>, không có <code>CAP_SYS_MODULE</code> — nên root trong container yếu hơn nhiều so với root trên máy chủ. Người dùng <code>sv</code> không giữ cái nào. Bỏ <code>CAP_DAC_OVERRIDE</code> khỏi root khiến root phải tuân theo tệp 600 không thuộc mình: "remove capability", quyền 3 của slide 12, ngoài đời thật. Dòng cuối cho một chương trình <em>một</em> quyền (<code>cap_net_bind_service</code>) thay vì biến nó thành setuid root — cách thay thế hiện đại cho ô cửa ở slide 7.</p>
<p>🧭 Trên server thật: <code>docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE …</code> là công thức quyền tối thiểu cho máy chủ web; Kubernetes có <code>securityContext.capabilities.drop: [ALL]</code>. Không bao giờ dùng <code>--privileged</code> (mọi capability, không seccomp) cho một ứng dụng.</p>`],
      [13, 'Formal Models of Secure Systems',
        `<p class="y-chinh">🎯 Figure 9-10: a protection matrix describes a <em>state</em>; commands change it. A <strong>formal model</strong> asks a precise question: starting from an <strong>authorized state</strong> (a), can any sequence of commands reach an <strong>unauthorized state</strong> (b)? In (b), Robert has gained <em>Read</em> on Mailbox 7 — a cell the policy forbids him.</p>
<p>Why bother with mathematics? Because "I tried a few things and nothing broke" proves nothing about the thousands of command sequences you did not try. A formal model turns "is this system secure?" into a yes/no question about states and rules. The book notes the bad news: for the general model of Harrison, Ruzzo and Ullman (1976) the question is <em>undecidable</em> — no algorithm can answer it for every system — but restricted models (such as the two on the next slides) are decidable and usable.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3dfe10ef1cbf631176ff72e3aa8c88f0c0d64a5c.svg" alt="Figure 9-10(b): the one forbidden cell is red" loading="lazy" /><p class="chu-thich">🧮 Figure 9-10(b): the one forbidden cell is red</p></div>
<p>The only difference between (a) and (b): <code>Robert</code> × <code>Mailbox 7</code>: “—” → “R” (forbidden by the policy).</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">/**
 * Mô phỏng — ma trận bảo vệ (MOS 4e §9.3.1–9.3.4, Hình 9-3…9-9). Cùng MỘT ma trận 3 miền × 8 đối tượng (Hình 9-4):
 *   #ma-tran  : vẽ ma trận;  #acl : cắt theo CỘT = ACL của từng đối tượng (Hình 9-6/9-7);  #clist : cắt theo HÀNG = C-list của
 *   từng miền (Hình 9-8);  #trang-thai : Hình 9-10 — trạng thái (a) được phép, (b) có thêm một quyền bị cấm, ô bị tô đỏ.
 * data.dapAn = chuỗi đáp án (số mục ACL của File1…, hoặc số ô vi phạm).
 */
import { MA_TRAN_9_4, TRANG_THAI_9_10, acl, clist, soSanhTrangThai, duocPhep } from '../_thuat-toan/bao-mat.mjs';
import { bang } from './_luoi.mjs';
import { L, MAU } from '../_ve.mjs';

export default function ({ bien, lang }) {
  const t = L(lang);
  const mt = MA_TRAN_9_4;
  const mienDs = Object.keys(mt.mien);
  const ten = (d) =&gt; t(&#96;Domain &#36;{d}&#96;, &#96;Miền &#36;{d}&#96;);
  if (bien === 'trang-thai') {
    const ts = TRANG_THAI_9_10;
    const khac = soSanhTrangThai(ts);
    const dang = (st) =&gt; ts.chuThe.map((c) =&gt; [c, ...ts.doiTuong.map((o) =&gt; (st[c] || {})[o] || '')]);
    const svg = (st, nhan) =&gt; bang({ tieuDe: nhan, dau: [t('subject', 'chủ thể'), ...ts.doiTuong], hang: dang(st),
      mau: (r, c, s) =&gt; (st === ts.b &amp;&amp; ts.chuThe[r] === 'Robert' &amp;&amp; ts.doiTuong[c - 1] === 'Mailbox 7' &amp;&amp; s ? MAU.xauNen : undefined) });

    const b = svg(ts.b, t('(b) unauthorized state', '(b) trạng thái KHÔNG được phép'));

    return {
      svg: b, alt: t('Figure 9-10(b): Robert has gained Read on Mailbox 7 — the red cell is outside the policy', 'Hình 9-10(b): Robert có thêm quyền Read trên Mailbox 7 — ô đỏ nằm ngoài chính sách'),
      html: &#96;&lt;p&gt;&#36;{t('The only difference between (a) and (b):', 'Khác biệt duy nhất giữa (a) và (b):')} &#36;{khac.map((k) =&gt; &#96;&lt;code&gt;&#36;{k.chuThe}&lt;/code&gt; × &lt;code&gt;&#36;{k.doiTuong}&lt;/code&gt;: “&#36;{k.truoc || '—'}” → “&#36;{k.sau}”&#36;{k.viPham ? t(' (forbidden by the policy)', ' (bị chính sách cấm)') : ''}&#96;).join('; ')}.&lt;/p&gt;&#96;,
      data: { dapAn: String(khac.filter((k) =&gt; k.viPham).length) },
    };
  }
  if (bien === 'acl') {
    const a = acl(mt);
    const hang = mt.doiTuong.map((o) =&gt; [o, a[o].map(([d, q]) =&gt; &#96;&#36;{ten(d)}: &#36;{q}&#96;).join(' · ') || t('(nobody)', '(không ai)')]);
    return {
      svg: bang({ tieuDe: t('Cut by COLUMN = the access control list of each object', 'Cắt theo CỘT = danh sách điều khiển truy cập (ACL) của từng đối tượng'), dau: [t('object', 'đối tượng'), 'ACL'], hang, size: 13 }),
      alt: t('The columns of Figure 9-4 written as one ACL per object', 'Các cột của Hình 9-4 viết thành một ACL cho mỗi đối tượng'),
      data: { dapAn: String(a.Printer1.length) },
    };
  }
  if (bien === 'clist') {
    const c = clist(mt);
    const hang = mienDs.map((d) =&gt; [ten(d), c[d].map(([o, q]) =&gt; &#96;&#36;{o}:&#36;{q}&#96;).join('  ')]);
    return {
      svg: bang({ tieuDe: t('Cut by ROW = the capability list (C-list) of each domain', 'Cắt theo HÀNG = danh sách khả năng (C-list) của từng miền'), dau: [t('domain', 'miền'), 'C-list'], hang, size: 13 }),
      alt: t('The rows of Figure 9-4 written as one capability list per domain', 'Các hàng của Hình 9-4 viết thành một danh sách khả năng cho mỗi miền'),
      data: { dapAn: String(c[3].length) },
    };
  }
  // #ma-tran (mặc định)
  const hang = mienDs.map((d) =&gt; [ten(d), ...mt.doiTuong.map((o) =&gt; mt.mien[d][o] || '')]);
  return {
    svg: bang({ tieuDe: t('Figure 9-4 — the protection matrix (rows = domains, columns = objects)', 'Hình 9-4 — ma trận bảo vệ (hàng = miền, cột = đối tượng)'),
      dau: [t('domain \\\\ object', 'miền \\\\ đối tượng'), ...mt.doiTuong], hang, size: 13, toiThieuCot: 40,
      mau: (r, c, s) =&gt; (c &gt; 0 &amp;&amp; s ? MAU.totNen : undefined) }),
    alt: t('Protection matrix of three domains over eight objects', 'Ma trận bảo vệ của ba miền trên tám đối tượng'),
    html: &#96;&lt;p&gt;&#36;{t('Check: may domain 2 write File4?', 'Kiểm: miền 2 có được ghi File4 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 2, 'File4', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;; &#36;{t('may domain 1 write File1?', 'miền 1 có được ghi File1 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 1, 'File1', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;.&lt;/p&gt;&#96;,
    data: { dapAn: String(mienDs.reduce((n, d) =&gt; n + Object.keys(mt.mien[d]).length, 0)) },
  };
}</code></pre></details>
<p>➕ The simulator found exactly <strong>one</strong> cell that differs between (a) and (b), and it is in the policy's forbidden list (Robert × Mailbox 7). The practical lesson: <em>every</em> permission change is a state transition, and a good system (or a code review of a new "share" feature) asks "after this change, can anyone reach a state the policy forbids?" — for instance, "can sharing a folder with Henry let Robert read it through Henry?" is the same question as a cell appearing in Robert's row.</p>
<p class="pitfall">⚠️ A model proves things only about <em>the model</em>. The real system may have a covert channel (slide 17) or a bug (slides 29–33) the model never mentioned.</p>`,
        `<p class="y-chinh">🎯 Hình 9-10: ma trận bảo vệ mô tả một <em>trạng thái</em>; các lệnh làm nó đổi. Một <strong>mô hình hình thức</strong> hỏi một câu chính xác: bắt đầu từ một <strong>trạng thái được phép</strong> (a), có dãy lệnh nào dẫn tới <strong>trạng thái không được phép</strong> (b) không? Ở (b), Robert có thêm quyền <em>Read</em> trên Mailbox 7 — một ô mà chính sách cấm anh.</p>
<p>Vì sao phải dùng toán? Vì "tôi thử vài thứ và không gì hỏng" chẳng chứng minh gì về hàng nghìn dãy lệnh tôi chưa thử. Mô hình hình thức biến "hệ thống này có an toàn không?" thành câu hỏi có/không về trạng thái và luật. Sách nêu tin xấu: với mô hình tổng quát của Harrison, Ruzzo và Ullman (1976) câu hỏi là <em>bất khả quyết (undecidable)</em> — không thuật toán nào trả lời được cho mọi hệ thống — nhưng các mô hình hạn chế (như hai mô hình ở slide sau) thì quyết định được và dùng được.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5975d5ee15c11d90119743d04d16959b1f6c7d74.svg" alt="Hình 9-10(b): ô bị cấm duy nhất tô đỏ" loading="lazy" /><p class="chu-thich">🧮 Hình 9-10(b): ô bị cấm duy nhất tô đỏ</p></div>
<p>Khác biệt duy nhất giữa (a) và (b): <code>Robert</code> × <code>Mailbox 7</code>: “—” → “R” (bị chính sách cấm).</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">/**
 * Mô phỏng — ma trận bảo vệ (MOS 4e §9.3.1–9.3.4, Hình 9-3…9-9). Cùng MỘT ma trận 3 miền × 8 đối tượng (Hình 9-4):
 *   #ma-tran  : vẽ ma trận;  #acl : cắt theo CỘT = ACL của từng đối tượng (Hình 9-6/9-7);  #clist : cắt theo HÀNG = C-list của
 *   từng miền (Hình 9-8);  #trang-thai : Hình 9-10 — trạng thái (a) được phép, (b) có thêm một quyền bị cấm, ô bị tô đỏ.
 * data.dapAn = chuỗi đáp án (số mục ACL của File1…, hoặc số ô vi phạm).
 */
import { MA_TRAN_9_4, TRANG_THAI_9_10, acl, clist, soSanhTrangThai, duocPhep } from '../_thuat-toan/bao-mat.mjs';
import { bang } from './_luoi.mjs';
import { L, MAU } from '../_ve.mjs';

export default function ({ bien, lang }) {
  const t = L(lang);
  const mt = MA_TRAN_9_4;
  const mienDs = Object.keys(mt.mien);
  const ten = (d) =&gt; t(&#96;Domain &#36;{d}&#96;, &#96;Miền &#36;{d}&#96;);
  if (bien === 'trang-thai') {
    const ts = TRANG_THAI_9_10;
    const khac = soSanhTrangThai(ts);
    const dang = (st) =&gt; ts.chuThe.map((c) =&gt; [c, ...ts.doiTuong.map((o) =&gt; (st[c] || {})[o] || '')]);
    const svg = (st, nhan) =&gt; bang({ tieuDe: nhan, dau: [t('subject', 'chủ thể'), ...ts.doiTuong], hang: dang(st),
      mau: (r, c, s) =&gt; (st === ts.b &amp;&amp; ts.chuThe[r] === 'Robert' &amp;&amp; ts.doiTuong[c - 1] === 'Mailbox 7' &amp;&amp; s ? MAU.xauNen : undefined) });

    const b = svg(ts.b, t('(b) unauthorized state', '(b) trạng thái KHÔNG được phép'));

    return {
      svg: b, alt: t('Figure 9-10(b): Robert has gained Read on Mailbox 7 — the red cell is outside the policy', 'Hình 9-10(b): Robert có thêm quyền Read trên Mailbox 7 — ô đỏ nằm ngoài chính sách'),
      html: &#96;&lt;p&gt;&#36;{t('The only difference between (a) and (b):', 'Khác biệt duy nhất giữa (a) và (b):')} &#36;{khac.map((k) =&gt; &#96;&lt;code&gt;&#36;{k.chuThe}&lt;/code&gt; × &lt;code&gt;&#36;{k.doiTuong}&lt;/code&gt;: “&#36;{k.truoc || '—'}” → “&#36;{k.sau}”&#36;{k.viPham ? t(' (forbidden by the policy)', ' (bị chính sách cấm)') : ''}&#96;).join('; ')}.&lt;/p&gt;&#96;,
      data: { dapAn: String(khac.filter((k) =&gt; k.viPham).length) },
    };
  }
  if (bien === 'acl') {
    const a = acl(mt);
    const hang = mt.doiTuong.map((o) =&gt; [o, a[o].map(([d, q]) =&gt; &#96;&#36;{ten(d)}: &#36;{q}&#96;).join(' · ') || t('(nobody)', '(không ai)')]);
    return {
      svg: bang({ tieuDe: t('Cut by COLUMN = the access control list of each object', 'Cắt theo CỘT = danh sách điều khiển truy cập (ACL) của từng đối tượng'), dau: [t('object', 'đối tượng'), 'ACL'], hang, size: 13 }),
      alt: t('The columns of Figure 9-4 written as one ACL per object', 'Các cột của Hình 9-4 viết thành một ACL cho mỗi đối tượng'),
      data: { dapAn: String(a.Printer1.length) },
    };
  }
  if (bien === 'clist') {
    const c = clist(mt);
    const hang = mienDs.map((d) =&gt; [ten(d), c[d].map(([o, q]) =&gt; &#96;&#36;{o}:&#36;{q}&#96;).join('  ')]);
    return {
      svg: bang({ tieuDe: t('Cut by ROW = the capability list (C-list) of each domain', 'Cắt theo HÀNG = danh sách khả năng (C-list) của từng miền'), dau: [t('domain', 'miền'), 'C-list'], hang, size: 13 }),
      alt: t('The rows of Figure 9-4 written as one capability list per domain', 'Các hàng của Hình 9-4 viết thành một danh sách khả năng cho mỗi miền'),
      data: { dapAn: String(c[3].length) },
    };
  }
  // #ma-tran (mặc định)
  const hang = mienDs.map((d) =&gt; [ten(d), ...mt.doiTuong.map((o) =&gt; mt.mien[d][o] || '')]);
  return {
    svg: bang({ tieuDe: t('Figure 9-4 — the protection matrix (rows = domains, columns = objects)', 'Hình 9-4 — ma trận bảo vệ (hàng = miền, cột = đối tượng)'),
      dau: [t('domain \\\\ object', 'miền \\\\ đối tượng'), ...mt.doiTuong], hang, size: 13, toiThieuCot: 40,
      mau: (r, c, s) =&gt; (c &gt; 0 &amp;&amp; s ? MAU.totNen : undefined) }),
    alt: t('Protection matrix of three domains over eight objects', 'Ma trận bảo vệ của ba miền trên tám đối tượng'),
    html: &#96;&lt;p&gt;&#36;{t('Check: may domain 2 write File4?', 'Kiểm: miền 2 có được ghi File4 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 2, 'File4', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;; &#36;{t('may domain 1 write File1?', 'miền 1 có được ghi File1 không?')} &lt;strong&gt;&#36;{duocPhep(mt, 1, 'File1', 'W') ? t('yes', 'có') : t('no', 'không')}&lt;/strong&gt;.&lt;/p&gt;&#96;,
    data: { dapAn: String(mienDs.reduce((n, d) =&gt; n + Object.keys(mt.mien[d]).length, 0)) },
  };
}</code></pre></details>
<p>➕ Bộ mô phỏng tìm ra đúng <strong>một</strong> ô khác nhau giữa (a) và (b), và ô đó nằm trong danh sách cấm của chính sách (Robert × Mailbox 7). Bài học thực hành: <em>mọi</em> thay đổi quyền là một bước chuyển trạng thái, và một hệ thống tốt (hay một buổi review mã của tính năng "chia sẻ" mới) hỏi "sau thay đổi này, có ai tới được trạng thái chính sách cấm không?" — ví dụ, "chia sẻ thư mục cho Henry có cho Robert đọc qua Henry không?" là cùng câu hỏi với một ô xuất hiện ở hàng của Robert.</p>
<p class="pitfall">⚠️ Mô hình chỉ chứng minh điều về <em>mô hình</em>. Hệ thống thật có thể có kênh ngầm (slide 17) hay lỗi (slide 29–33) mà mô hình chưa từng nhắc.</p>`],
      [14, 'Multilevel SecurityBell-LaPadula Model',
        `<p class="y-chinh">🎯 <strong>Bell–LaPadula</strong> (a model for <em>confidentiality</em>; Bell and LaPadula, 1973) gives every process and object a <strong>security level</strong> (unclassified &lt; confidential &lt; secret &lt; top secret). Two rules: <strong>simple security property</strong> — a process at level k may <em>read</em> only objects at level ≤ k (<strong>no read up</strong>); <strong>★-property</strong> — it may <em>write</em> only objects at level ≥ k (<strong>no write down</strong>).</p>
<p>Think of a military office. A colonel (secret) may read a memo marked confidential but not a top-secret one — obvious. The surprise is the second rule: the colonel may not <em>write</em> into a confidential memo, because he might copy secret facts into it and leak them downward. Information may flow only <strong>up</strong> (or sideways), never down. Even a Trojan horse running with the colonel's rights cannot copy secrets to a lower level: the kernel refuses the write.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fac701c18effab78512cd3a161fe19f2705e103b.svg" alt="Bell–LaPadula: R and W allowed per (process level, object level)" loading="lazy" /><p class="chu-thich">🧮 Bell–LaPadula: R and W allowed per (process level, object level)</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const MUC = [1, 2, 3, 4];                       // 1 = thấp nhất (Unclassified) … 4 = cao nhất (Top secret)</code></pre></details>
<p>➕ Read the grid: a level-2 process may read levels 1–2 (R) and write levels 2–4 (W); only at its own level (2) does it hold both R and W (yellow). Total 20 allowed cells (each of 4 levels contributes 5). Writing <em>up</em> is allowed — a private can drop a report into the general's inbox, though he cannot read what is there ("blind write").</p>
<p>🧭 Real systems: SELinux's Multi-Level Security (MLS) policy and Linux "Bell-LaPadula style" labels are used where confidentiality dominates (government, defence). Ordinary web apps use <strong>roles</strong> (RBAC) instead, but the idea "labels on data + a rule the kernel enforces" is the same one behind cloud "data classification".</p>
<p class="pitfall">⚠️ The two words people swap: <strong>simple security</strong> = no <em>read</em> up; <strong>★ (star)</strong> = no <em>write</em> down. Remember: BLP protects <em>secrets</em> from flowing down.</p>`,
        `<p class="y-chinh">🎯 <strong>Bell–LaPadula</strong> (mô hình cho <em>bí mật</em>; Bell và LaPadula, 1973) gán cho mọi tiến trình và đối tượng một <strong>mức an ninh</strong> (không mật &lt; mật &lt; tối mật &lt; tuyệt mật). Hai luật: <strong>tính chất an ninh đơn giản</strong> — tiến trình mức k chỉ được <em>đọc</em> đối tượng mức ≤ k (<strong>không đọc lên</strong>); <strong>tính chất ★</strong> — chỉ được <em>ghi</em> đối tượng mức ≥ k (<strong>không ghi xuống</strong>).</p>
<p>Hãy nghĩ tới một văn phòng quân đội. Đại tá (tối mật) đọc được bản ghi nhớ đóng dấu mật nhưng không đọc được bản tuyệt mật — hiển nhiên. Bất ngờ là luật thứ hai: đại tá không được <em>ghi</em> vào bản ghi nhớ mức mật, vì ông có thể chép sự thật tối mật vào đó và làm rò xuống dưới. Thông tin chỉ được chảy <strong>lên</strong> (hoặc ngang), không bao giờ xuống. Ngay cả một con ngựa Trojan chạy với quyền của đại tá cũng không chép bí mật xuống mức thấp: nhân từ chối lần ghi.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ea6465c9983bcc73fcefd84ee26b4dc48a9fe9bb.svg" alt="Bell–LaPadula: R và W được phép theo (mức tiến trình, mức đối tượng)" loading="lazy" /><p class="chu-thich">🧮 Bell–LaPadula: R và W được phép theo (mức tiến trình, mức đối tượng)</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const MUC = [1, 2, 3, 4];                       // 1 = thấp nhất (Unclassified) … 4 = cao nhất (Top secret)</code></pre></details>
<p>➕ Đọc lưới: tiến trình mức 2 đọc được mức 1–2 (R) và ghi được mức 2–4 (W); chỉ ở đúng mức của nó (2) mới có cả R lẫn W (màu vàng). Tổng 20 ô được phép (mỗi trong 4 mức đóng góp 5). Ghi <em>lên</em> là được — người lính bỏ báo cáo vào hộp thư của tướng, dù không đọc được gì trong đó ("ghi mù").</p>
<p>🧭 Hệ thống thật: chính sách Multi-Level Security (MLS) của SELinux và nhãn kiểu Bell-LaPadula trên Linux được dùng nơi bí mật là ưu tiên (chính phủ, quốc phòng). Ứng dụng web thường dùng <strong>vai trò</strong> (RBAC) thay thế, nhưng ý "nhãn trên dữ liệu + một luật nhân thực thi" cũng là ý đứng sau "phân loại dữ liệu" trên đám mây.</p>
<p class="pitfall">⚠️ Hai từ hay bị đảo: <strong>an ninh đơn giản</strong> = không <em>đọc</em> lên; <strong>★ (sao)</strong> = không <em>ghi</em> xuống. Nhớ: BLP bảo vệ <em>bí mật</em> khỏi chảy xuống.</p>`],
      [15, 'Bell-LaPadula Model',
        `<p class="y-chinh">🎯 Figure 9-11: the model drawn for four levels — processes are circles (A…E), objects are squares (1…6); a <strong>solid arrow</strong> from an object to a process is a <em>read</em>, a <strong>dashed arrow</strong> from a process to an object is a <em>write</em>. Reads point <em>down/level</em>, writes point <em>up/level</em>, so the arrows only ever carry information <strong>upward</strong>.</p>
<p>Follow information, not arrows: for a secret to reach a low-level object it must be read by some process and then written by some process. A process that can read the secret (level ≥ secret) cannot write low (★-property); a process that can write low cannot read the secret (simple security). No chain of such steps leads down. That is the model's whole guarantee: <em>no information flows from a higher level to a lower level through legal operations</em>.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/18dc5affe06815da33d3ea898e7a4d3c291d5c66.svg" alt="Can information starting at level a end up at level b? (Bell–LaPadula)" loading="lazy" /><p class="chu-thich">🧮 Can information starting at level a end up at level b? (Bell–LaPadula)</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const MUC = [1, 2, 3, 4];                       // 1 = thấp nhất (Unclassified) … 4 = cao nhất (Top secret)</code></pre></details>
<p>➕ The table is computed by asking, for every pair, "is there a process that can legally read level a and then write level b?". The answer is "yes" exactly when a ≤ b — 10 of the 16 pairs, all on or above the diagonal. The 6 red cells below the diagonal are the leaks BLP forbids.</p>
<p class="meo">🧠 FE-style: given levels and a request, apply the two rules mechanically — "level 3 process reads a level 4 object" → denied (read up); "level 3 writes a level 2 object" → denied (write down); "level 3 writes a level 4 object" → allowed.</p>`,
        `<p class="y-chinh">🎯 Hình 9-11: mô hình vẽ cho bốn mức — tiến trình là hình tròn (A…E), đối tượng là hình vuông (1…6); <strong>mũi tên liền</strong> từ đối tượng tới tiến trình là <em>đọc</em>, <strong>mũi tên đứt</strong> từ tiến trình tới đối tượng là <em>ghi</em>. Đọc hướng <em>xuống/ngang</em>, ghi hướng <em>lên/ngang</em>, nên các mũi tên chỉ mang thông tin <strong>đi lên</strong>.</p>
<p>Hãy theo thông tin chứ đừng theo mũi tên: để một bí mật tới được đối tượng mức thấp, nó phải được một tiến trình nào đó đọc rồi một tiến trình nào đó ghi. Tiến trình đọc được bí mật (mức ≥ mật) thì không ghi xuống thấp được (tính chất ★); tiến trình ghi được xuống thấp thì không đọc được bí mật (an ninh đơn giản). Không chuỗi bước hợp lệ nào dẫn xuống. Đó là toàn bộ bảo đảm của mô hình: <em>không có thông tin nào chảy từ mức cao xuống mức thấp bằng các thao tác hợp lệ</em>.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/40bcdae9b9236798ea1dc5a28d63d35f472b792f.svg" alt="Thông tin bắt đầu ở mức a có thể kết thúc ở mức b không? (Bell–LaPadula)" loading="lazy" /><p class="chu-thich">🧮 Thông tin bắt đầu ở mức a có thể kết thúc ở mức b không? (Bell–LaPadula)</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const MUC = [1, 2, 3, 4];                       // 1 = thấp nhất (Unclassified) … 4 = cao nhất (Top secret)</code></pre></details>
<p>➕ Bảng được tính bằng cách hỏi, với mọi cặp, "có tiến trình nào đọc hợp lệ mức a rồi ghi mức b không?". Câu trả lời là "có" đúng khi a ≤ b — 10 trong 16 cặp, nằm trên và phía trên đường chéo. 6 ô đỏ dưới đường chéo là những rò rỉ BLP cấm.</p>
<p class="meo">🧠 Kiểu FE: cho các mức và một yêu cầu, áp hai luật máy móc — "tiến trình mức 3 đọc đối tượng mức 4" → bị từ chối (đọc lên); "mức 3 ghi đối tượng mức 2" → bị từ chối (ghi xuống); "mức 3 ghi đối tượng mức 4" → được phép.</p>`],
      [16, 'The Biba Model',
        `<p class="y-chinh">🎯 <strong>Biba</strong> (Biba, 1977) protects <em>integrity</em> with the mirror image of Bell–LaPadula: <strong>simple integrity</strong> — a process at level k may <em>write</em> only objects at level ≤ k (<strong>no write up</strong>); <strong>integrity ★-property</strong> — it may <em>read</em> only objects at level ≥ k (<strong>no read down</strong>). Here "high level" means "high trust", not "high secrecy".</p>
<p>A newsroom: the editor-in-chief's page (high integrity) must not be changed by an intern (low) — no write up — and the editor must not build the front page from unverified rumours (low) — no read down. Information of low quality must never flow into high-quality objects. For a bank: the ledger is high-integrity; a spreadsheet downloaded from the internet is low; Biba says the ledger program must not <em>read</em> it directly (it may be poisoned) and a low process must not <em>write</em> the ledger.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/03bf3d7e2fe75a690fb2f5258ec3e43cc9a825d2.svg" alt="Biba: the rules flipped" loading="lazy" /><p class="chu-thich">🧮 Biba: the rules flipped</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const MUC = [1, 2, 3, 4];                       // 1 = thấp nhất (Unclassified) … 4 = cao nhất (Top secret)</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9a688e4e5b561a7c923d7c993bd08504b465e9b9.svg" alt="Biba: information may only flow DOWN" loading="lazy" /><p class="chu-thich">🧮 Biba: information may only flow DOWN</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const MUC = [1, 2, 3, 4];                       // 1 = thấp nhất (Unclassified) … 4 = cao nhất (Top secret)</code></pre></details>
<p>➕ Compare with slide 14: the two grids contain the same number of cells (20) but the letters moved to opposite sides, and in the flow tables the allowed half switches from "up" to "down". The book's observation matters: <strong>no single model gives both</strong> — if you apply BLP and Biba together on the same levels you can only keep information at one level. Secrecy and integrity pull in opposite directions, so a real system picks what it needs (the military mostly BLP; a bank's ledger mostly Biba-like).</p>
<p>🧭 Biba-like ideas you already use: running untrusted input through a <em>validator</em> before it reaches a trusted module (don't read down), and signing/approving code before it is merged into production (don't write up without authority). Linux integrity measurement (IMA) and Android's <code>untrusted_app</code> SELinux domain follow the spirit.</p>
<p class="pitfall">⚠️ Biba is <em>not</em> Bell–LaPadula with a typo: the roles of "read" and "write" swap sides. Memorise the pair: BLP = no read up, no write down; Biba = no write up, no read down.</p>`,
        `<p class="y-chinh">🎯 <strong>Biba</strong> (Biba, 1977) bảo vệ <em>toàn vẹn</em> bằng hình ảnh phản chiếu của Bell–LaPadula: <strong>toàn vẹn đơn giản</strong> — tiến trình mức k chỉ được <em>ghi</em> đối tượng mức ≤ k (<strong>không ghi lên</strong>); <strong>tính chất ★ toàn vẹn</strong> — chỉ được <em>đọc</em> đối tượng mức ≥ k (<strong>không đọc xuống</strong>). Ở đây "mức cao" nghĩa là "độ tin cậy cao", không phải "độ bí mật cao".</p>
<p>Một toà soạn: trang của tổng biên tập (toàn vẹn cao) không được thực tập sinh (thấp) sửa — không ghi lên — và biên tập viên không được dựng trang nhất từ tin đồn chưa kiểm chứng (thấp) — không đọc xuống. Thông tin chất lượng thấp không bao giờ được chảy vào đối tượng chất lượng cao. Với ngân hàng: sổ cái là toàn vẹn cao; bảng tính tải từ internet là thấp; Biba nói chương trình sổ cái không được <em>đọc</em> thẳng nó (có thể bị đầu độc) và tiến trình thấp không được <em>ghi</em> sổ cái.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/64afabfd0aa361be7dd332c66c890e72fc9193f3.svg" alt="Biba: các luật bị lật ngược" loading="lazy" /><p class="chu-thich">🧮 Biba: các luật bị lật ngược</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const MUC = [1, 2, 3, 4];                       // 1 = thấp nhất (Unclassified) … 4 = cao nhất (Top secret)</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c1a932a86cf05a157f5c9e24207187e5229699fc.svg" alt="Biba: thông tin chỉ được chảy XUỐNG" loading="lazy" /><p class="chu-thich">🧮 Biba: thông tin chỉ được chảy XUỐNG</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const MUC = [1, 2, 3, 4];                       // 1 = thấp nhất (Unclassified) … 4 = cao nhất (Top secret)</code></pre></details>
<p>➕ So với slide 14: hai lưới có cùng số ô (20) nhưng các chữ chuyển sang phía đối diện, và trong bảng luồng thì nửa được phép đổi từ "lên" sang "xuống". Nhận xét của sách rất quan trọng: <strong>không mô hình nào cho cả hai</strong> — nếu áp BLP và Biba cùng lúc trên cùng các mức thì thông tin chỉ giữ được ở một mức. Bí mật và toàn vẹn kéo ngược chiều nhau, nên hệ thống thật chọn cái cần (quân đội chủ yếu BLP; sổ cái ngân hàng chủ yếu kiểu Biba).</p>
<p>🧭 Ý kiểu Biba bạn đã dùng: cho đầu vào không tin cậy đi qua một <em>bộ kiểm tra (validator)</em> trước khi tới module tin cậy (đừng đọc xuống), và ký/duyệt mã trước khi hợp nhất vào production (đừng ghi lên khi không có thẩm quyền). Đo toàn vẹn của Linux (IMA) và miền SELinux <code>untrusted_app</code> của Android theo đúng tinh thần này.</p>
<p class="pitfall">⚠️ Biba <em>không</em> phải Bell–LaPadula gõ nhầm: vai của "đọc" và "ghi" đổi phía. Học thuộc cặp: BLP = không đọc lên, không ghi xuống; Biba = không ghi lên, không đọc xuống.</p>`],
      [17, 'Covert Channels (1)',
        `<p class="y-chinh">🎯 Figure 9-12: a <strong>client</strong> uses a <strong>server</strong> (say, a tax program that sees the client's private data). The server is <em>encapsulated</em> — it may not write files, send messages or open sockets — and the client trusts it. Yet the server may be in league with a <strong>collaborator</strong>, and a <strong>covert channel</strong> lets it leak the data anyway, through something nobody thought of as "communication".</p>
<p>Prisoners in neighbouring cells with no way to speak can still tap on the pipe: one knock = 1, two knocks = 0. The guards forbade <em>talking</em>, not <em>pipes</em>. Lampson called this the <strong>confinement problem</strong> (1973). Any shared resource the server can influence and the collaborator can observe is a channel: file locks (next slide), CPU load, disk-arm movement, the time a request takes, even the amount of free memory.</p>
<p>➕ The same family caused the biggest hardware scandal of recent years: <strong>Spectre and Meltdown</strong> (2018) are <em>side channels</em> — a program learns another's secrets by measuring how long memory accesses take, because the CPU cache is a shared resource. Cloud providers had to patch kernels, microcode and browsers. Covert channels are not a theory exercise.</p>
<p>🧭 On a real server: noisy neighbours on a shared VM are a timing channel; this is a reason why high-security workloads ask for dedicated hosts, and why browsers reduced timer precision after Spectre.</p>
<p class="meo">🧠 Say it in one sentence: a covert channel is <em>communication through a side effect</em> the security policy did not look at.</p>`,
        `<p class="y-chinh">🎯 Hình 9-12: một <strong>khách hàng (client)</strong> dùng một <strong>máy chủ (server)</strong> (ví dụ chương trình khai thuế nhìn thấy dữ liệu riêng của khách). Máy chủ bị <em>đóng gói</em> — nó không được ghi tệp, gửi thông điệp hay mở socket — và khách tin nó. Nhưng máy chủ có thể cấu kết với một <strong>cộng tác viên (collaborator)</strong>, và một <strong>kênh ngầm (covert channel)</strong> cho nó rò dữ liệu bằng một thứ không ai nghĩ là "giao tiếp".</p>
<p>Hai tù nhân ở hai phòng giam cạnh nhau không nói chuyện được vẫn gõ vào ống nước được: một tiếng gõ = 1, hai tiếng = 0. Quản ngục cấm <em>nói</em>, không cấm <em>ống nước</em>. Lampson gọi đây là <strong>bài toán giam giữ (confinement problem)</strong> (1973). Mọi tài nguyên dùng chung mà máy chủ tác động được và cộng tác viên quan sát được đều là một kênh: khoá tệp (slide sau), tải CPU, chuyển động cần đĩa, thời gian một yêu cầu mất, thậm chí lượng bộ nhớ trống.</p>
<p>➕ Cùng họ này gây ra vụ bê bối phần cứng lớn nhất những năm gần đây: <strong>Spectre và Meltdown</strong> (2018) là các <em>kênh phụ (side channel)</em> — một chương trình biết bí mật của chương trình khác bằng cách đo thời gian truy cập bộ nhớ, vì cache CPU là tài nguyên dùng chung. Các nhà cung cấp đám mây phải vá nhân, microcode và trình duyệt. Kênh ngầm không phải bài tập lý thuyết.</p>
<p>🧭 Trên server thật: hàng xóm ồn ào trên máy ảo dùng chung là một kênh thời gian; đó là lý do các tải công việc bảo mật cao đòi máy chủ riêng, và vì sao trình duyệt giảm độ chính xác của đồng hồ sau Spectre.</p>
<p class="meo">🧠 Nói trong một câu: kênh ngầm là <em>giao tiếp qua một tác dụng phụ</em> mà chính sách bảo mật không để mắt tới.</p>`],
      [18, 'Covert Channels (2)',
        `<p class="y-chinh">🎯 Figure 9-13: a <strong>covert channel using file locking</strong>. To send bit 1 the server <em>locks</em> a file; to send 0 it <em>unlocks</em> it. In every time slot the collaborator simply tries to lock the same file: if that fails, the bit is 1, if it succeeds, 0. The server sends 11111…; the figure shows the sequence 1,1,0,1,0,1,1,0 being read — the server never sent a single byte to anyone.</p>
<p>Both programs are allowed to lock files; neither does anything the policy forbids. The leak is the <em>pattern over time</em>. Because timing matters, they share a clock (here an agreed start time and one bit per 60 ms slot). Run it for real — the server leaks the two letters "OK" (bits 01001111 01001011) to a collaborator that only asks "is the file locked?":</p>
<pre><code class="language-c">// Slides 17-18 (Figure 9-13): a covert channel. The "server" can never send data to the "collaborator" — it can only lock or unlock a file
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;time.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/file.h&gt;
#include &lt;sys/wait.h&gt;
#define SLOT_NS 60000000L                                     // one bit per 60 ms
static void at(struct timespec t) { clock_nanosleep(CLOCK_MONOTONIC, TIMER_ABSTIME, &amp;t, NULL); }
static struct timespec plus(struct timespec t, long ns) { t.tv_nsec += ns; while (t.tv_nsec &gt;= 1000000000L) { t.tv_nsec -= 1000000000L; t.tv_sec++; } return t; }
int main(void) {
    const char *msg = "OK";                                    // the secret the server wants to leak
    struct timespec t0; clock_gettime(CLOCK_MONOTONIC, &amp;t0); t0 = plus(t0, 300000000L);   // both sides agree on the start
    if (fork() == 0) {                                        // SERVER
        int fd = open("/tmp/cong.lock", O_CREAT | O_RDWR, 0600);
        for (size_t i = 0; i &lt; strlen(msg) * 8; i++) {
            int bit = (msg[i / 8] &gt;&gt; (7 - i % 8)) &amp; 1;
            at(plus(t0, i * SLOT_NS));
            if (bit) flock(fd, LOCK_EX); else flock(fd, LOCK_UN);   // 1 = locked, 0 = unlocked
        }
        at(plus(t0, strlen(msg) * 8 * SLOT_NS)); flock(fd, LOCK_UN);
        _exit(0);
    }
    int fd = open("/tmp/cong.lock", O_CREAT | O_RDWR, 0600);  // COLLABORATOR: only asks "is the file locked?"
    char out[16] = {0}; int bits = 0, byte = 0;
    for (size_t i = 0; i &lt; strlen(msg) * 8; i++) {
        at(plus(t0, i * SLOT_NS + SLOT_NS / 2));              // sample in the middle of the slot
        int locked = flock(fd, LOCK_SH | LOCK_NB) != 0;        // fails =&gt; somebody holds LOCK_EX
        if (!locked) flock(fd, LOCK_UN);
        byte = (byte &lt;&lt; 1) | locked;
        printf("%d", locked);
        if (++bits == 8) { out[i / 8] = (char)byte; bits = 0; byte = 0; printf(" "); }
    }
    wait(NULL);
    printf("\\ncollaborator decoded: \\"%s\\"   (16 bits in about 1 second)\\n", out);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread kenh-ngam.c -o kenh-ngam &amp;&amp; ./kenh-ngam<br>
01001111 01001011<br>
collaborator decoded: "OK" &nbsp;&nbsp;(16 bits in about 1 second)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The output decoded <code>"OK"</code> at roughly 16 bits per second. Slow, but a 256-bit private key leaks in 16 seconds, and real channels run at thousands of bits per second. Bandwidth is the attacker's budget; <strong>defence</strong> is to remove the shared resource or to add noise and make timing coarse.</p>
<p class="pitfall">⚠️ The run is a 🎲 sample — on a very busy machine a bit could be misread. That is itself the lesson: noise lowers the capacity of the channel but a few repeats and an error-correcting code restore it.</p>
<p class="meo">🧠 A formal model (slides 13–16) says nothing about this: BLP is about <em>read and write permissions</em>, not about locks, load or time. That is why the book follows the models with covert channels.</p>`,
        `<p class="y-chinh">🎯 Hình 9-13: <strong>kênh ngầm dùng khoá tệp</strong>. Để gửi bit 1, máy chủ <em>khoá</em> một tệp; để gửi 0 nó <em>mở khoá</em>. Ở mỗi khe thời gian, cộng tác viên chỉ việc thử khoá cùng tệp đó: thất bại thì bit là 1, thành công thì 0. Hình cho thấy dãy 1,1,0,1,0,1,1,0 được đọc ra — máy chủ chưa từng gửi một byte nào cho ai.</p>
<p>Cả hai chương trình đều được phép khoá tệp; không bên nào làm điều chính sách cấm. Rò rỉ là <em>khuôn mẫu theo thời gian</em>. Vì thời gian quan trọng nên chúng dùng chung đồng hồ (ở đây là giờ bắt đầu đã thống nhất và mỗi khe 60 ms một bit). Chạy thật — máy chủ rò hai chữ "OK" (bit 01001111 01001011) cho một cộng tác viên chỉ hỏi "tệp có đang bị khoá không?":</p>
<pre><code class="language-c">// Slide 17-18 (Hình 9-13): kênh ngầm. "Máy chủ" không bao giờ gửi dữ liệu cho "cộng tác viên" — nó chỉ khoá hay mở khoá một tệp
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;time.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/file.h&gt;
#include &lt;sys/wait.h&gt;
#define SLOT_NS 60000000L                                     // mỗi bit 60 ms
static void at(struct timespec t) { clock_nanosleep(CLOCK_MONOTONIC, TIMER_ABSTIME, &amp;t, NULL); }
static struct timespec plus(struct timespec t, long ns) { t.tv_nsec += ns; while (t.tv_nsec &gt;= 1000000000L) { t.tv_nsec -= 1000000000L; t.tv_sec++; } return t; }
int main(void) {
    const char *msg = "OK";                                    // bí mật máy chủ muốn rò ra
    struct timespec t0; clock_gettime(CLOCK_MONOTONIC, &amp;t0); t0 = plus(t0, 300000000L);   // hai bên thống nhất giờ bắt đầu
    if (fork() == 0) {                                        // MÁY CHỦ
        int fd = open("/tmp/cong.lock", O_CREAT | O_RDWR, 0600);
        for (size_t i = 0; i &lt; strlen(msg) * 8; i++) {
            int bit = (msg[i / 8] &gt;&gt; (7 - i % 8)) &amp; 1;
            at(plus(t0, i * SLOT_NS));
            if (bit) flock(fd, LOCK_EX); else flock(fd, LOCK_UN);   // 1 = khoá, 0 = mở
        }
        at(plus(t0, strlen(msg) * 8 * SLOT_NS)); flock(fd, LOCK_UN);
        _exit(0);
    }
    int fd = open("/tmp/cong.lock", O_CREAT | O_RDWR, 0600);  // CỘNG TÁC VIÊN: chỉ hỏi "tệp có đang bị khoá không?"
    char out[16] = {0}; int bits = 0, byte = 0;
    for (size_t i = 0; i &lt; strlen(msg) * 8; i++) {
        at(plus(t0, i * SLOT_NS + SLOT_NS / 2));              // lấy mẫu giữa khe
        int locked = flock(fd, LOCK_SH | LOCK_NB) != 0;        // thất bại =&gt; có ai giữ LOCK_EX
        if (!locked) flock(fd, LOCK_UN);
        byte = (byte &lt;&lt; 1) | locked;
        printf("%d", locked);
        if (++bits == 8) { out[i / 8] = (char)byte; bits = 0; byte = 0; printf(" "); }
    }
    wait(NULL);
    printf("\\ncollaborator decoded: \\"%s\\"   (16 bits in about 1 second)\\n", out);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread kenh-ngam.c -o kenh-ngam &amp;&amp; ./kenh-ngam<br>
01001111 01001011<br>
collaborator decoded: "OK" &nbsp;&nbsp;(16 bits in about 1 second)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Output giải mã ra <code>"OK"</code> ở tốc độ khoảng 16 bit mỗi giây. Chậm, nhưng một khoá riêng 256 bit rò hết trong 16 giây, và kênh thật chạy hàng nghìn bit mỗi giây. Băng thông là ngân sách của kẻ tấn công; <strong>phòng thủ</strong> là loại bỏ tài nguyên dùng chung hoặc thêm nhiễu và làm thời gian thô đi.</p>
<p class="pitfall">⚠️ Lần chạy là một 🎲 mẫu — trên máy rất bận một bit có thể bị đọc sai. Chính điều đó là bài học: nhiễu làm giảm dung lượng kênh nhưng vài lần lặp và mã sửa lỗi khôi phục lại nó.</p>
<p class="meo">🧠 Mô hình hình thức (slide 13–16) không nói gì về điều này: BLP nói về <em>quyền đọc và ghi</em>, không phải khoá, tải hay thời gian. Đó là lý do sách đặt kênh ngầm ngay sau các mô hình.</p>`],
      [19, 'Steganography',
        `<p class="y-chinh">🎯 Figure 9-14: <strong>steganography</strong> — hiding the <em>existence</em> of a message. Picture (a) is three zebras and a tree; picture (b) looks identical but carries the complete text of five Shakespeare plays, hidden in the low-order bits of the colour values. A covert channel hides a message in <em>behaviour</em>; steganography hides it in <em>data</em>.</p>
<p>Encryption makes a message unreadable but visibly secret — a sealed envelope draws attention. Steganography is a letter written in lemon juice on a shopping list. The trick for images: each pixel's colour is stored in 8 bits per channel, and changing the <em>lowest</em> bit changes the brightness by 1/255, below what an eye notices. Replace the lowest bits of all pixels by message bits and the picture seems unchanged.</p>
<pre><code class="language-javascript">// Slide 19 (Figure 9-14): steganography — hide a message in the lowest bit of every pixel, where the eye cannot see it
// A 64x64 grey "image" (one byte per pixel); we do it on raw bytes, the idea is identical for PNG/BMP colour channels
const W = 64, H = 64;
const anh = Buffer.alloc(W * H);
for (let y = 0; y &lt; H; y++) for (let x = 0; x &lt; W; x++) anh[y * W + x] = (x * 3 + y * 2) &amp; 255;   // a smooth gradient
const goc = Buffer.from(anh);

const thongDiep = 'Hen gap luc 9h tai cong truong. -- CuongThai OSG202';
const bytes = Buffer.from(thongDiep, 'utf8');
const bits = [];
for (let i = 31; i &gt;= 0; i--) bits.push((bytes.length &gt;&gt; i) &amp; 1);                   // 32-bit length header
for (const b of bytes) for (let i = 7; i &gt;= 0; i--) bits.push((b &gt;&gt; i) &amp; 1);
if (bits.length &gt; anh.length) throw new Error('message too long for this image');
bits.forEach((bit, i) =&gt; { anh[i] = (anh[i] &amp; 0xfe) | bit; });                       // replace the lowest bit

let khac = 0, lonNhat = 0;
for (let i = 0; i &lt; anh.length; i++) { const d = Math.abs(anh[i] - goc[i]); if (d) khac++; lonNhat = Math.max(lonNhat, d); }
console.log(&#96;capacity       : &#36;{W * H} pixels = &#36;{(W * H - 32) &gt;&gt; 3} bytes of message (1 bit per pixel)&#96;);
console.log(&#96;message        : &#36;{bytes.length} bytes = &#36;{bits.length} bits&#96;);
console.log(&#96;pixels changed : &#36;{khac} of &#36;{W * H}, the biggest change in any pixel = &#36;{lonNhat} (out of 255)&#96;);

let n = 0; for (let i = 0; i &lt; 32; i++) n = (n &lt;&lt; 1) | (anh[i] &amp; 1);               // the receiver reads it back
const ra = Buffer.alloc(n);
for (let i = 0; i &lt; n * 8; i++) ra[i &gt;&gt; 3] |= (anh[32 + i] &amp; 1) &lt;&lt; (7 - (i &amp; 7));
console.log(&#96;extracted      : "&#36;{ra.toString('utf8')}"&#96;);
// 1024 x 768 pixels x 3 colour channels x 1 bit
console.log(&#96;1024x768 RGB   : &#36;{(1024 * 768 * 3) / 8} bytes = &#36;{((1024 * 768 * 3) / 8 / 1024).toFixed(0)} KiB of hidden payload at 1 bit per colour value&#96;);</code></pre>
<div class="out">$ node giau-tin.js<br>
capacity &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 4096 pixels = 508 bytes of message (1 bit per pixel)<br>
message &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 51 bytes = 440 bits<br>
pixels changed : 207 of 4096, the biggest change in any pixel = 1 (out of 255)<br>
extracted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "Hen gap luc 9h tai cong truong. -- CuongThai OSG202"<br>
1024x768 RGB &nbsp;&nbsp;: 294912 bytes = 288 KiB of hidden payload at 1 bit per colour value</div>
<p>Our 64×64 grey picture (4096 pixels) carries a 51-byte message in 440 pixels' lowest bits; 207 pixels changed (the rest already had the right bit) and <strong>no pixel changed by more than 1</strong> out of 255. For a 1024×768 colour picture at one bit per colour value, the payload is 288 KiB. (The book fits five plays by compressing the text first, so its picture carries more than a naive count suggests.)</p>
<p>➕ Uses: watermarking (hide an owner's mark in a photo), and — for the dark side — hiding stolen data in innocent files so that an outbound filter sees only a picture. Defence is <em>statistical steganalysis</em>: natural images have noisy low bits with a certain structure, hidden data disturbs it. Real stego tools are cleverer than our toy (they avoid patterns), but the principle is the same.</p>
<p class="pitfall">⚠️ Steganography is <em>not</em> encryption. Anyone who suspects it and knows the method reads the message — hide <em>encrypted</em> text if the content matters.</p>`,
        `<p class="y-chinh">🎯 Hình 9-14: <strong>steganography (giấu tin)</strong> — giấu <em>sự tồn tại</em> của thông điệp. Ảnh (a) là ba con ngựa vằn và một cái cây; ảnh (b) trông giống hệt nhưng mang toàn văn năm vở kịch của Shakespeare, giấu trong các bit thấp của giá trị màu. Kênh ngầm giấu thông điệp trong <em>hành vi</em>; giấu tin giấu nó trong <em>dữ liệu</em>.</p>
<p>Mã hoá làm thông điệp không đọc được nhưng lộ rõ là bí mật — phong bì dán kín gây chú ý. Giấu tin là bức thư viết bằng nước chanh trên tờ danh sách đi chợ. Mánh với ảnh: màu mỗi điểm ảnh lưu 8 bit mỗi kênh, và đổi bit <em>thấp nhất</em> chỉ đổi độ sáng 1/255, dưới ngưỡng mắt nhận ra. Thay bit thấp nhất của mọi điểm ảnh bằng bit thông điệp thì ảnh dường như không đổi.</p>
<pre><code class="language-javascript">// Slide 19 (Hình 9-14): steganography — giấu thông điệp vào bit thấp nhất của từng điểm ảnh, nơi mắt không thấy
// "Ảnh" xám 64x64 (mỗi điểm một byte); ta làm trên byte thô, ý tưởng y hệt với kênh màu PNG/BMP
const W = 64, H = 64;
const anh = Buffer.alloc(W * H);
for (let y = 0; y &lt; H; y++) for (let x = 0; x &lt; W; x++) anh[y * W + x] = (x * 3 + y * 2) &amp; 255;   // một dải chuyển sắc mượt
const goc = Buffer.from(anh);

const thongDiep = 'Hen gap luc 9h tai cong truong. -- CuongThai OSG202';
const bytes = Buffer.from(thongDiep, 'utf8');
const bits = [];
for (let i = 31; i &gt;= 0; i--) bits.push((bytes.length &gt;&gt; i) &amp; 1);                   // tiêu đề độ dài 32 bit
for (const b of bytes) for (let i = 7; i &gt;= 0; i--) bits.push((b &gt;&gt; i) &amp; 1);
if (bits.length &gt; anh.length) throw new Error('message too long for this image');
bits.forEach((bit, i) =&gt; { anh[i] = (anh[i] &amp; 0xfe) | bit; });                       // thay bit thấp nhất

let khac = 0, lonNhat = 0;
for (let i = 0; i &lt; anh.length; i++) { const d = Math.abs(anh[i] - goc[i]); if (d) khac++; lonNhat = Math.max(lonNhat, d); }
console.log(&#96;capacity       : &#36;{W * H} pixels = &#36;{(W * H - 32) &gt;&gt; 3} bytes of message (1 bit per pixel)&#96;);
console.log(&#96;message        : &#36;{bytes.length} bytes = &#36;{bits.length} bits&#96;);
console.log(&#96;pixels changed : &#36;{khac} of &#36;{W * H}, the biggest change in any pixel = &#36;{lonNhat} (out of 255)&#96;);

let n = 0; for (let i = 0; i &lt; 32; i++) n = (n &lt;&lt; 1) | (anh[i] &amp; 1);               // người nhận đọc lại
const ra = Buffer.alloc(n);
for (let i = 0; i &lt; n * 8; i++) ra[i &gt;&gt; 3] |= (anh[32 + i] &amp; 1) &lt;&lt; (7 - (i &amp; 7));
console.log(&#96;extracted      : "&#36;{ra.toString('utf8')}"&#96;);
// 1024 x 768 điểm x 3 kênh màu x 1 bit
console.log(&#96;1024x768 RGB   : &#36;{(1024 * 768 * 3) / 8} bytes = &#36;{((1024 * 768 * 3) / 8 / 1024).toFixed(0)} KiB of hidden payload at 1 bit per colour value&#96;);</code></pre>
<div class="out">$ node giau-tin.js<br>
capacity &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 4096 pixels = 508 bytes of message (1 bit per pixel)<br>
message &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 51 bytes = 440 bits<br>
pixels changed : 207 of 4096, the biggest change in any pixel = 1 (out of 255)<br>
extracted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "Hen gap luc 9h tai cong truong. -- CuongThai OSG202"<br>
1024x768 RGB &nbsp;&nbsp;: 294912 bytes = 288 KiB of hidden payload at 1 bit per colour value</div>
<p>Bức ảnh xám 64×64 (4096 điểm) của ta chở thông điệp 51 byte trong bit thấp nhất của 440 điểm; 207 điểm thay đổi (số còn lại vốn đã đúng bit) và <strong>không điểm nào đổi quá 1</strong> trên 255. Với ảnh màu 1024×768 ở mức một bit mỗi giá trị màu, tải trọng là 288 KiB. (Sách nhét được năm vở kịch vì nén văn bản trước, nên ảnh của sách chở nhiều hơn phép đếm ngây thơ cho thấy.)</p>
<p>➕ Công dụng: đóng dấu bản quyền (giấu dấu của chủ sở hữu trong ảnh), và — mặt tối — giấu dữ liệu ăn cắp trong tệp vô hại để bộ lọc đầu ra chỉ thấy một bức ảnh. Phòng thủ là <em>phân tích thống kê giấu tin (steganalysis)</em>: ảnh tự nhiên có bit thấp nhiễu với một cấu trúc nhất định, dữ liệu giấu làm rối nó. Công cụ giấu tin thật khôn hơn đồ chơi của ta (chúng tránh khuôn mẫu), nhưng nguyên lý như nhau.</p>
<p class="pitfall">⚠️ Giấu tin <em>không</em> phải mã hoá. Ai nghi ngờ và biết phương pháp thì đọc được thông điệp — hãy giấu văn bản <em>đã mã hoá</em> nếu nội dung quan trọng.</p>`],
      [20, 'Basics of Cryptography',
        `<p class="y-chinh">🎯 Figure 9-15: <strong>encryption</strong> turns <em>plaintext</em> P into <em>ciphertext</em> C = E(P, K<sub>E</sub>) using an encryption algorithm E and an encryption key K<sub>E</sub>; <strong>decryption</strong> recovers P = D(C, K<sub>D</sub>) with a decryption algorithm D and key K<sub>D</sub>. <strong>Kerckhoffs' principle</strong>: the algorithm is public, only the key is secret.</p>
<p>A padlock: everybody knows how padlocks work; security rests on the key. Never hide the design — "security by obscurity" fails the moment someone disassembles your program, whereas a published algorithm (AES) has been attacked by thousands of experts for decades. Three families to keep apart:</p>
<table>
<thead><tr><th>Family</th><th>Keys</th><th>Does</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Secret-key (symmetric)</td><td>one shared key K<sub>E</sub> = K<sub>D</sub></td><td>encrypt/decrypt big data fast</td><td>AES-256</td></tr>
<tr><td>Public-key (asymmetric)</td><td>a public key and a private key</td><td>key exchange, signatures</td><td>RSA, Ed25519, X25519</td></tr>
<tr><td>Hash (one-way)</td><td>no key</td><td>fixed-size fingerprint, cannot be reversed</td><td>SHA-256</td></tr>
</tbody>
</table>
<p>➕ Rules of thumb for a developer in 2026: never invent a cipher; use a vetted library (libsodium, OpenSSL, Java <code>javax.crypto</code>, Node <code>crypto</code>); keys come from a CSPRNG (<code>crypto.randomBytes</code>, <code>/dev/urandom</code>), never <code>Math.random()</code>; keep keys out of git (a separate lesson: secrets). Slide 21 shows why even a "huge key space" is no guarantee, and slide 22 gives you hashes and signatures with real commands.</p>
<p class="pitfall">⚠️ "Encoding" (Base64), "hashing" (SHA-256) and "encryption" (AES) are three different things. Base64 is reversible by anyone; a hash is not reversible; encryption is reversible <em>only with the key</em>.</p>`,
        `<p class="y-chinh">🎯 Hình 9-15: <strong>mã hoá</strong> biến <em>bản rõ (plaintext)</em> P thành <em>bản mã (ciphertext)</em> C = E(P, K<sub>E</sub>) bằng thuật toán mã hoá E và khoá mã K<sub>E</sub>; <strong>giải mã</strong> khôi phục P = D(C, K<sub>D</sub>) bằng thuật toán giải mã D và khoá K<sub>D</sub>. <strong>Nguyên lý Kerckhoffs</strong>: thuật toán công khai, chỉ khoá là bí mật.</p>
<p>Một ổ khoá: ai cũng biết ổ khoá hoạt động ra sao; an toàn nằm ở chìa. Đừng bao giờ giấu thiết kế — "bảo mật bằng che giấu" thất bại ngay khi ai đó dịch ngược chương trình của bạn, trong khi một thuật toán công khai (AES) đã bị hàng nghìn chuyên gia tấn công hàng chục năm. Ba họ cần phân biệt:</p>
<table>
<thead><tr><th>Họ</th><th>Khoá</th><th>Làm gì</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Khoá bí mật (đối xứng)</td><td>một khoá chung K<sub>E</sub> = K<sub>D</sub></td><td>mã/giải dữ liệu lớn nhanh</td><td>AES-256</td></tr>
<tr><td>Khoá công khai (bất đối xứng)</td><td>một khoá công khai và một khoá riêng</td><td>trao đổi khoá, chữ ký</td><td>RSA, Ed25519, X25519</td></tr>
<tr><td>Hàm băm (một chiều)</td><td>không khoá</td><td>dấu vân tay cỡ cố định, không đảo ngược được</td><td>SHA-256</td></tr>
</tbody>
</table>
<p>➕ Quy tắc ngón tay cái cho lập trình viên năm 2026: đừng bao giờ tự chế mã; dùng thư viện đã kiểm chứng (libsodium, OpenSSL, Java <code>javax.crypto</code>, Node <code>crypto</code>); khoá lấy từ CSPRNG (<code>crypto.randomBytes</code>, <code>/dev/urandom</code>), không bao giờ <code>Math.random()</code>; giữ khoá ngoài git (một bài riêng: bí mật). Slide 21 cho thấy vì sao ngay cả "không gian khoá khổng lồ" cũng không bảo đảm gì, và slide 22 cho bạn hàm băm và chữ ký với lệnh thật.</p>
<p class="pitfall">⚠️ "Mã hoá dạng chuỗi (encoding — Base64)", "băm (hashing — SHA-256)" và "mã hoá (encryption — AES)" là ba thứ khác nhau. Base64 ai cũng đảo ngược được; hàm băm thì không đảo ngược được; mã hoá đảo ngược được <em>chỉ khi có khoá</em>.</p>`],
      [21, 'Secret-Key Cryptography',
        `<p class="y-chinh">🎯 The book's <strong>monoalphabetic substitution cipher</strong>: each plaintext letter is replaced by a fixed other letter — plaintext <code>ABCDEFGHIJKLMNOPQRSTUVWXYZ</code> ↔ ciphertext <code>QWERTYUIOPASDFGHJKLZXCVBNM</code> (the keyboard rows). The key is the 26-letter mapping; there are 26! ≈ 4×10<sup>26</sup> keys (≈ 2<sup>88</sup>). Yet the cipher is <strong>trivially broken</strong>.</p>
<p>Why? Because each letter always maps to the same letter, the <em>shape</em> of the language leaks: in English E, T, A, O are the most frequent, "THE" is the commonest word, and so on. A newspaper "cryptogram" puzzle is exactly this attack done by hand. Run both halves — the book's cipher, and the first, crude pass of the frequency attack:</p>
<pre><code class="language-javascript">// Slide 21: the book's substitution cipher (QWERTY order) — and why it is NOT secure: letter frequencies survive
const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', KHOA = 'QWERTYUIOPASDFGHJKLZXCVBNM';
const ma = (s) =&gt; [...s.toUpperCase()].map((c) =&gt; (AZ.includes(c) ? KHOA[AZ.indexOf(c)] : c)).join('');
const giai = (s) =&gt; [...s].map((c) =&gt; (KHOA.includes(c) ? AZ[KHOA.indexOf(c)] : c)).join('');
console.log('key        :', AZ, '-&gt;', KHOA);
console.log('ATTACK     -&gt;', ma('ATTACK'), ' -&gt;', giai(ma('ATTACK')));
const van = &#96;An operating system must protect users from each other and from outsiders. The kernel checks every request to open a file or to send a packet,
and the check is only as strong as the weakest piece of code that is allowed to bypass it. Because secret keys are short and messages are long, a cipher that
replaces each letter by another letter keeps the shape of the language: the most common letter in the message still stands for the most common letter of English,
and a patient reader needs no key at all to recover most of the text. Modern ciphers are built so that no such pattern survives in the output.&#96;;
const mat = ma(van).replace(/[^A-Z]/g, '');
const tanSuat = (s) =&gt; { const m = {}; for (const c of s) m[c] = (m[c] || 0) + 1; return Object.entries(m).sort((a, b) =&gt; b[1] - a[1] || (a[0] &lt; b[0] ? -1 : 1)); };
const TIENG_ANH = 'ETAOINSHRDLCUMWFGYPBVKJXQZ';           // letters from most to least common in English
const ts = tanSuat(mat);
console.log(&#96;ciphertext : &#36;{mat.length} letters; the 6 most common are &#36;{ts.slice(0, 6).map(([c, n]) =&gt; &#96;&#36;{c}x&#36;{n}&#96;).join(' ')}&#96;);
// attacker's first guess: i-th most common cipher letter = i-th most common English letter
const doan = {}; ts.forEach(([c], i) =&gt; { doan[c] = TIENG_ANH[i]; });
const tho = [...mat].map((c) =&gt; doan[c]).join('');
const goc = van.toUpperCase().replace(/[^A-Z]/g, '');
let dung = 0; for (let i = 0; i &lt; goc.length; i++) if (tho[i] === goc[i]) dung++;
console.log(&#96;first guess by frequency alone, with no key: &#36;{dung} of &#36;{goc.length} letters already right (&#36;{Math.round((100 * dung) / goc.length)} %)&#96;);
console.log('guess      :', tho.slice(0, 48));
console.log('real text  :', goc.slice(0, 48));
console.log(&#96;key space  : 26! = &#36;{(() =&gt; { let f = 1n; for (let i = 2n; i &lt;= 26n; i++) f *= i; return f; })().toString()}  (~ 2^88) — huge, yet the cipher falls to counting letters&#96;);</code></pre>
<div class="out">$ node the-thay-the.js<br>
key &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ABCDEFGHIJKLMNOPQRSTUVWXYZ -&gt; QWERTYUIOPASDFGHJKLZXCVBNM<br>
ATTACK &nbsp;&nbsp;&nbsp;&nbsp;-&gt; QZZQEA &nbsp;-&gt; ATTACK<br>
ciphertext : 485 letters; the 6 most common are Tx78 Zx58 Lx43 Qx38 Gx37 Kx33<br>
first guess by frequency alone, with no key: 169 of 485 letters already right (35 %)<br>
guess &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: OSIUENOTLSGAPATECCWATUNITERTWAENAYNICEORHITHENOS<br>
real text &nbsp;: ANOPERATINGSYSTEMMUSTPROTECTUSERSFROMEACHOTHERAN<br>
key space &nbsp;: 26! = 403291461126605635584000000 &nbsp;(~ 2^88) — huge, yet the cipher falls to counting letters</div>
<p>The frequency table alone, with no key, put 35% of the letters right in the first pass (a patient human fills in the rest using word shapes like THE, AND, OF). So <em>a big key space does not mean a strong cipher</em>. Modern secret-key ciphers (AES, ChaCha20) are designed so that every output bit depends on every key bit and every input bit, destroying any statistical pattern.</p>
<p>➕ AES is a <em>block</em> cipher on 128-bit blocks with 128/192/256-bit keys; how you chain blocks (the <em>mode</em>) matters as much as the cipher. ECB encrypts equal blocks equally (leaks patterns — the famous "encrypted penguin"); CBC chains blocks; <strong>GCM</strong> is modern because it also <em>authenticates</em> (any change to the ciphertext is detected). In practice: <code>AES-256-GCM</code> or <code>ChaCha20-Poly1305</code>, with a fresh random nonce per message, never reused with the same key.</p>
<p class="pitfall">⚠️ FE-style: "substitution cipher" = each <em>letter</em> replaced one-for-one; "transposition" = letters stay but are <em>shuffled</em>. The key space of 26! sounds enormous but frequency analysis breaks it.</p>`,
        `<p class="y-chinh">🎯 <strong>Mã thay thế đơn bảng chữ cái (monoalphabetic substitution cipher)</strong> của sách: mỗi chữ của bản rõ được thay bằng một chữ cố định khác — bản rõ <code>ABCDEFGHIJKLMNOPQRSTUVWXYZ</code> ↔ bản mã <code>QWERTYUIOPASDFGHJKLZXCVBNM</code> (các hàng phím). Khoá là phép ánh xạ 26 chữ; có 26! ≈ 4×10<sup>26</sup> khoá (≈ 2<sup>88</sup>). Vậy mà mã này <strong>bị phá dễ dàng</strong>.</p>
<p>Vì sao? Vì mỗi chữ luôn ánh xạ sang cùng một chữ nên <em>hình dạng</em> của ngôn ngữ bị lộ: trong tiếng Anh E, T, A, O thường gặp nhất, "THE" là từ phổ biến nhất, v.v. Trò "cryptogram" trên báo chính là cuộc tấn công này làm bằng tay. Chạy cả hai nửa — mã của sách, và lượt thô đầu tiên của tấn công tần suất:</p>
<pre><code class="language-javascript">// Slide 21: mã thay thế của sách (thứ tự bàn phím QWERTY) — và vì sao nó KHÔNG an toàn: tần suất chữ cái còn nguyên
const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', KHOA = 'QWERTYUIOPASDFGHJKLZXCVBNM';
const ma = (s) =&gt; [...s.toUpperCase()].map((c) =&gt; (AZ.includes(c) ? KHOA[AZ.indexOf(c)] : c)).join('');
const giai = (s) =&gt; [...s].map((c) =&gt; (KHOA.includes(c) ? AZ[KHOA.indexOf(c)] : c)).join('');
console.log('key        :', AZ, '-&gt;', KHOA);
console.log('ATTACK     -&gt;', ma('ATTACK'), ' -&gt;', giai(ma('ATTACK')));
const van = &#96;An operating system must protect users from each other and from outsiders. The kernel checks every request to open a file or to send a packet,
and the check is only as strong as the weakest piece of code that is allowed to bypass it. Because secret keys are short and messages are long, a cipher that
replaces each letter by another letter keeps the shape of the language: the most common letter in the message still stands for the most common letter of English,
and a patient reader needs no key at all to recover most of the text. Modern ciphers are built so that no such pattern survives in the output.&#96;;
const mat = ma(van).replace(/[^A-Z]/g, '');
const tanSuat = (s) =&gt; { const m = {}; for (const c of s) m[c] = (m[c] || 0) + 1; return Object.entries(m).sort((a, b) =&gt; b[1] - a[1] || (a[0] &lt; b[0] ? -1 : 1)); };
const TIENG_ANH = 'ETAOINSHRDLCUMWFGYPBVKJXQZ';           // chữ cái theo thứ tự phổ biến trong tiếng Anh
const ts = tanSuat(mat);
console.log(&#96;ciphertext : &#36;{mat.length} letters; the 6 most common are &#36;{ts.slice(0, 6).map(([c, n]) =&gt; &#96;&#36;{c}x&#36;{n}&#96;).join(' ')}&#96;);
// lần đoán đầu của kẻ tấn công: chữ mã phổ biến thứ i = chữ tiếng Anh phổ biến thứ i
const doan = {}; ts.forEach(([c], i) =&gt; { doan[c] = TIENG_ANH[i]; });
const tho = [...mat].map((c) =&gt; doan[c]).join('');
const goc = van.toUpperCase().replace(/[^A-Z]/g, '');
let dung = 0; for (let i = 0; i &lt; goc.length; i++) if (tho[i] === goc[i]) dung++;
console.log(&#96;first guess by frequency alone, with no key: &#36;{dung} of &#36;{goc.length} letters already right (&#36;{Math.round((100 * dung) / goc.length)} %)&#96;);
console.log('guess      :', tho.slice(0, 48));
console.log('real text  :', goc.slice(0, 48));
console.log(&#96;key space  : 26! = &#36;{(() =&gt; { let f = 1n; for (let i = 2n; i &lt;= 26n; i++) f *= i; return f; })().toString()}  (~ 2^88) — huge, yet the cipher falls to counting letters&#96;);</code></pre>
<div class="out">$ node the-thay-the.js<br>
key &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ABCDEFGHIJKLMNOPQRSTUVWXYZ -&gt; QWERTYUIOPASDFGHJKLZXCVBNM<br>
ATTACK &nbsp;&nbsp;&nbsp;&nbsp;-&gt; QZZQEA &nbsp;-&gt; ATTACK<br>
ciphertext : 485 letters; the 6 most common are Tx78 Zx58 Lx43 Qx38 Gx37 Kx33<br>
first guess by frequency alone, with no key: 169 of 485 letters already right (35 %)<br>
guess &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: OSIUENOTLSGAPATECCWATUNITERTWAENAYNICEORHITHENOS<br>
real text &nbsp;: ANOPERATINGSYSTEMMUSTPROTECTUSERSFROMEACHOTHERAN<br>
key space &nbsp;: 26! = 403291461126605635584000000 &nbsp;(~ 2^88) — huge, yet the cipher falls to counting letters</div>
<p>Chỉ riêng bảng tần suất, không có khoá, đã đoán đúng 35% chữ ngay lượt đầu (người kiên nhẫn điền phần còn lại bằng hình dạng từ như THE, AND, OF). Vậy <em>không gian khoá lớn không có nghĩa là mã mạnh</em>. Mã khoá bí mật hiện đại (AES, ChaCha20) được thiết kế để mỗi bit đầu ra phụ thuộc vào mọi bit khoá và mọi bit đầu vào, phá huỷ mọi khuôn mẫu thống kê.</p>
<p>➕ AES là mã <em>khối</em> trên khối 128 bit với khoá 128/192/256 bit; cách xích các khối (<em>chế độ — mode</em>) quan trọng ngang bản thân mã. ECB mã hoá các khối bằng nhau thành bằng nhau (lộ khuôn mẫu — "chú chim cánh cụt mã hoá" nổi tiếng); CBC xích các khối; <strong>GCM</strong> hiện đại vì còn <em>xác thực</em> (mọi thay đổi bản mã đều bị phát hiện). Thực tế: <code>AES-256-GCM</code> hoặc <code>ChaCha20-Poly1305</code>, với nonce ngẫu nhiên mới cho mỗi thông điệp, không bao giờ dùng lại với cùng khoá.</p>
<p class="pitfall">⚠️ Kiểu FE: "mã thay thế" = mỗi <em>chữ</em> được thay một-đổi-một; "mã hoán vị" = chữ giữ nguyên nhưng bị <em>xáo trộn</em>. Không gian khoá 26! nghe khổng lồ nhưng phân tích tần suất phá được.</p>`],
      [22, 'Digital Signatures',
        `<p class="y-chinh">🎯 Figure 9-16: a <strong>digital signature</strong> — (a) compute a <strong>hash</strong> of the document (a short fixed-size value), then transform it with the signer's <em>private</em> key to get D(Hash); (b) the receiver gets the document plus the <strong>signature block</strong> D(Hash), recomputes the hash and checks it against the signature using the signer's <em>public</em> key. It proves <em>who</em> signed and that the document is <em>unchanged</em>.</p>
<p>A paper contract with a wax seal: the seal is hard to forge (only the owner has the ring) and breaks if the paper is opened. Hashing first matters: signing a 2 GB file directly would be slow, and a hash makes the signature cover <em>every</em> bit. A good hash has three properties: <strong>one-way</strong> (cannot go from hash back to document), <strong>collision-resistant</strong> (cannot find two documents with the same hash), and an <strong>avalanche</strong> (one changed bit changes about half the output bits). MD5 and SHA-1 have known collisions — use SHA-256 or better.</p>
<div class="out"># Slides 20-22 and 47: hashes, secret-key encryption, digital signatures, code signing — with the real OpenSSL<br>
$ openssl version | cut -d' ' -f1,2<br>
OpenSSL 3.0.22<br>
# a hash: fixed-size fingerprint of any input; change ONE letter and the whole fingerprint changes ("avalanche")<br>
$ echo 'Pay Bob 100 dollars' &gt; hop-dong.txt; openssl dgst -sha256 hop-dong.txt<br>
SHA2-256(hop-dong.txt)= 0bd1ae411b223ec626156245c69b03c7876c982c82c8715f0b944568bb398181<br>
$ echo 'Pay Bob 900 dollars' &gt; hop-dong.txt; openssl dgst -sha256 hop-dong.txt<br>
SHA2-256(hop-dong.txt)= 41b582e626f3ff82e9eb9dd5e5ebe0cc4d06b8c851c154db64147ddfec56eacc<br>
# secret-key (symmetric) encryption, slide 21: the SAME key encrypts and decrypts (AES-256, key made from a password)<br>
$ echo 'ATTACK AT DAWN' | openssl enc -aes-256-cbc -pbkdf2 -iter 10000 -pass pass:ban-hoc-chung -base64 -S 0102030405060708 &gt; mat.b64; cat mat.b64<br>
TYmc5vWvDrq+p5pPPZffug==<br>
$ openssl enc -d -aes-256-cbc -pbkdf2 -iter 10000 -pass pass:ban-hoc-chung -base64 -S 0102030405060708 -in mat.b64<br>
ATTACK AT DAWN<br>
$ openssl enc -d -aes-256-cbc -pbkdf2 -iter 10000 -pass pass:sai-khoa -base64 -S 0102030405060708 -in mat.b64 2&gt;&amp;1 | head -1<br>
bad decrypt<br>
# digital signature, slide 22: hash the document, then sign the hash with the PRIVATE key; anyone with the PUBLIC key can verify<br>
$ openssl genpkey -algorithm ed25519 -out khoa-rieng.pem 2&gt;/dev/null; openssl pkey -in khoa-rieng.pem -pubout -out khoa-cong-khai.pem<br>
$ echo 'program v1.0' &gt; chuong-trinh.bin<br>
$ openssl pkeyutl -sign -inkey khoa-rieng.pem -rawin -in chuong-trinh.bin -out chuong-trinh.sig<br>
$ openssl pkeyutl -verify -pubin -inkey khoa-cong-khai.pem -rawin -in chuong-trinh.bin -sigfile chuong-trinh.sig<br>
Signature Verified Successfully<br>
# code signing, slide 47: somebody adds one line to the program on its way to you<br>
$ echo 'run_backdoor()' &gt;&gt; chuong-trinh.bin<br>
$ openssl pkeyutl -verify -pubin -inkey khoa-cong-khai.pem -rawin -in chuong-trinh.bin -sigfile chuong-trinh.sig; echo "exit=$?"<br>
Signature Verification Failure<br>
exit=1</div>
<p>Four results to read: (1) changing "100" to "900" gave a completely different SHA-256; (2) AES decrypts only with the exact key — a wrong key gives <code>bad decrypt</code>; (3) the Ed25519 signature on <code>program v1.0</code> verified successfully with the public key; (4) after one line was appended, verification failed — exactly slide 47's code-signing check.</p>
<p>🧭 You meet signatures daily: <code>git commit -S</code>, Docker image signing (cosign), <code>apt</code> verifying repository releases, JWTs signed with RS256/EdDSA, TLS certificates. A signature gives <strong>integrity + authenticity + non-repudiation</strong>, <em>not</em> confidentiality (the document stays readable).</p>
<p class="pitfall">⚠️ Sign with the <em>private</em> key, verify with the <em>public</em> key (the reverse of encryption, where you encrypt with the public key and decrypt with the private one).</p>`,
        `<p class="y-chinh">🎯 Hình 9-16: <strong>chữ ký số</strong> — (a) tính <strong>hàm băm</strong> của tài liệu (một giá trị ngắn cỡ cố định), rồi biến đổi nó bằng khoá <em>riêng</em> của người ký để ra D(Hash); (b) người nhận nhận tài liệu cùng <strong>khối chữ ký</strong> D(Hash), tính lại bản băm và so với chữ ký bằng khoá <em>công khai</em> của người ký. Nó chứng minh <em>ai</em> đã ký và tài liệu <em>không bị đổi</em>.</p>
<p>Một hợp đồng giấy đóng dấu sáp: dấu khó giả (chỉ chủ nhân có chiếc nhẫn) và vỡ nếu mở tờ giấy. Băm trước rất quan trọng: ký thẳng tệp 2 GB sẽ chậm, và băm làm chữ ký phủ <em>mọi</em> bit. Hàm băm tốt có ba tính chất: <strong>một chiều</strong> (không đi từ băm ngược về tài liệu), <strong>chống va chạm</strong> (không tìm được hai tài liệu cùng băm), và <strong>hiệu ứng tuyết lở</strong> (đổi một bit làm đổi khoảng một nửa bit đầu ra). MD5 và SHA-1 đã có va chạm được biết — dùng SHA-256 trở lên.</p>
<div class="out"># Slide 20-22 và 47: băm, mã hoá khoá bí mật, chữ ký số, ký mã — bằng OpenSSL thật<br>
$ openssl version | cut -d' ' -f1,2<br>
OpenSSL 3.0.22<br>
# băm: dấu vân tay cỡ cố định của mọi đầu vào; đổi MỘT chữ thì cả dấu vân tay đổi ("tuyết lở")<br>
$ echo 'Pay Bob 100 dollars' &gt; hop-dong.txt; openssl dgst -sha256 hop-dong.txt<br>
SHA2-256(hop-dong.txt)= 0bd1ae411b223ec626156245c69b03c7876c982c82c8715f0b944568bb398181<br>
$ echo 'Pay Bob 900 dollars' &gt; hop-dong.txt; openssl dgst -sha256 hop-dong.txt<br>
SHA2-256(hop-dong.txt)= 41b582e626f3ff82e9eb9dd5e5ebe0cc4d06b8c851c154db64147ddfec56eacc<br>
# mã hoá khoá bí mật (đối xứng), slide 21: CÙNG một khoá mã và giải (AES-256, khoá sinh từ mật khẩu)<br>
$ echo 'ATTACK AT DAWN' | openssl enc -aes-256-cbc -pbkdf2 -iter 10000 -pass pass:ban-hoc-chung -base64 -S 0102030405060708 &gt; mat.b64; cat mat.b64<br>
TYmc5vWvDrq+p5pPPZffug==<br>
$ openssl enc -d -aes-256-cbc -pbkdf2 -iter 10000 -pass pass:ban-hoc-chung -base64 -S 0102030405060708 -in mat.b64<br>
ATTACK AT DAWN<br>
$ openssl enc -d -aes-256-cbc -pbkdf2 -iter 10000 -pass pass:sai-khoa -base64 -S 0102030405060708 -in mat.b64 2&gt;&amp;1 | head -1<br>
bad decrypt<br>
# chữ ký số, slide 22: băm tài liệu rồi ký bản băm bằng khoá RIÊNG; ai có khoá CÔNG KHAI cũng kiểm được<br>
$ openssl genpkey -algorithm ed25519 -out khoa-rieng.pem 2&gt;/dev/null; openssl pkey -in khoa-rieng.pem -pubout -out khoa-cong-khai.pem<br>
$ echo 'program v1.0' &gt; chuong-trinh.bin<br>
$ openssl pkeyutl -sign -inkey khoa-rieng.pem -rawin -in chuong-trinh.bin -out chuong-trinh.sig<br>
$ openssl pkeyutl -verify -pubin -inkey khoa-cong-khai.pem -rawin -in chuong-trinh.bin -sigfile chuong-trinh.sig<br>
Signature Verified Successfully<br>
# ký mã, slide 47: ai đó thêm một dòng vào chương trình trên đường tới bạn<br>
$ echo 'run_backdoor()' &gt;&gt; chuong-trinh.bin<br>
$ openssl pkeyutl -verify -pubin -inkey khoa-cong-khai.pem -rawin -in chuong-trinh.bin -sigfile chuong-trinh.sig; echo "exit=$?"<br>
Signature Verification Failure<br>
exit=1</div>
<p>Bốn kết quả cần đọc: (1) đổi "100" thành "900" cho SHA-256 hoàn toàn khác; (2) AES chỉ giải mã đúng với khoá chính xác — khoá sai cho <code>bad decrypt</code>; (3) chữ ký Ed25519 trên <code>program v1.0</code> được xác minh thành công bằng khoá công khai; (4) sau khi thêm một dòng, xác minh thất bại — đúng phép kiểm ký mã ở slide 47.</p>
<p>🧭 Bạn gặp chữ ký hằng ngày: <code>git commit -S</code>, ký ảnh Docker (cosign), <code>apt</code> kiểm bản phát hành của kho, JWT ký bằng RS256/EdDSA, chứng chỉ TLS. Chữ ký cho <strong>toàn vẹn + xác thực nguồn + chống chối bỏ</strong>, <em>không</em> cho bí mật (tài liệu vẫn đọc được).</p>
<p class="pitfall">⚠️ Ký bằng khoá <em>riêng</em>, xác minh bằng khoá <em>công khai</em> (ngược với mã hoá, nơi bạn mã bằng khoá công khai và giải bằng khoá riêng).</p>`],
      [23, 'Authentication (1)',
        `<p class="y-chinh">🎯 <strong>Authentication</strong> = proving who you are, based on one of three general principles: <strong>(1) something the user knows</strong> (password, PIN), <strong>(2) something the user has</strong> (key, smart card, phone), <strong>(3) something the user is</strong> (fingerprint, face). Combining two or more different kinds is <strong>multi-factor authentication (MFA)</strong>.</p>
<p>A cash machine uses two: the card you <em>have</em> and the PIN you <em>know</em>. Stealing only one is useless. The point of mixing <em>kinds</em> is that they fail differently: passwords leak in database breaches, tokens get stolen from pockets, biometrics cannot be changed once copied. Two passwords are <em>not</em> two factors — both are "something you know".</p>
<p>Don't mix up the three jobs: <strong>identification</strong> (who do you claim to be: a username), <strong>authentication</strong> (prove it), <strong>authorization</strong> (what may you do now — the ACLs and capabilities of slides 5–12). Most login bugs in web apps are confusions between these: an <code>isAdmin</code> flag in a cookie the user can edit confuses claim with proof.</p>
<p>🧭 On a real server: SSH with a <em>key</em> (something you have) plus a passphrase (something you know) is two factors; <code>PasswordAuthentication no</code> in sshd_config (the course's own VPS runs it) removes the weakest factor entirely; and GitHub, Google and most banks now push passkeys (FIDO2).</p>
<p class="meo">🧠 FE-style: classify "fingerprint reader" → <em>something the user is</em>; "smart card" → <em>has</em>; "password" → <em>knows</em>.</p>`,
        `<p class="y-chinh">🎯 <strong>Xác thực (authentication)</strong> = chứng minh bạn là ai, dựa trên một trong ba nguyên tắc chung: <strong>(1) thứ người dùng biết</strong> (mật khẩu, PIN), <strong>(2) thứ người dùng có</strong> (chìa khoá, thẻ thông minh, điện thoại), <strong>(3) thứ người dùng là</strong> (vân tay, khuôn mặt). Kết hợp hai loại khác nhau trở lên là <strong>xác thực đa yếu tố (MFA)</strong>.</p>
<p>Máy ATM dùng hai: thẻ bạn <em>có</em> và mã PIN bạn <em>biết</em>. Trộm một thứ thì vô dụng. Ý nghĩa của việc trộn các <em>loại</em> là chúng hỏng theo cách khác nhau: mật khẩu lộ khi cơ sở dữ liệu bị xâm nhập, token bị trộm khỏi túi, sinh trắc không đổi được khi đã bị sao chép. Hai mật khẩu <em>không</em> phải hai yếu tố — cả hai đều là "thứ bạn biết".</p>
<p>Đừng lẫn ba việc: <strong>nhận diện (identification)</strong> (bạn tự nhận là ai: tên đăng nhập), <strong>xác thực (authentication)</strong> (chứng minh điều đó), <strong>phân quyền (authorization)</strong> (giờ bạn được làm gì — ACL và capability của slide 5–12). Phần lớn lỗi đăng nhập trong ứng dụng web là nhầm lẫn giữa các việc này: cờ <code>isAdmin</code> trong cookie người dùng sửa được là nhầm lời tự nhận với bằng chứng.</p>
<p>🧭 Trên server thật: SSH bằng <em>khoá</em> (thứ bạn có) cộng cụm mật khẩu (thứ bạn biết) là hai yếu tố; <code>PasswordAuthentication no</code> trong sshd_config (VPS của chính khoá học này chạy như vậy) loại hẳn yếu tố yếu nhất; và GitHub, Google cùng hầu hết ngân hàng giờ đẩy passkey (FIDO2).</p>
<p class="meo">🧠 Kiểu FE: phân loại "máy đọc vân tay" → <em>thứ người dùng là</em>; "thẻ thông minh" → <em>có</em>; "mật khẩu" → <em>biết</em>.</p>`],
      [24, 'Authentication (2)',
        `<p class="y-chinh">🎯 Figure 9-17: three login transcripts — (a) a successful login: <code>LOGIN: mitch / PASSWORD: FooBar!-7 / SUCCESSFUL LOGIN</code>; (b) rejected after the <em>name</em>: <code>LOGIN: carol / INVALID LOGIN NAME</code>; (c) rejected after name and password: <code>LOGIN: carol / PASSWORD: Idunno / INVALID LOGIN</code>. The lesson is in the difference between (b) and (c).</p>
<p>In (b) the system tells the attacker <em>the name does not exist</em>; in (c) it says only "invalid login" without saying whether the name or the password was wrong. Version (b) helps an attacker: they can try names in bulk and keep the ones that don't get "INVALID LOGIN NAME" — <strong>username enumeration</strong>. Version (c) leaks nothing. The same rule for a web app: login and password-reset pages must give the <em>same</em> message and take about the <em>same time</em> whether or not the account exists.</p>
<p>➕ Other classic defences on the same screen: a short delay after each failure and a limit on attempts (slows <em>brute force</em>), a lockout or CAPTCHA after many failures (careful — lockout can itself be a denial-of-service against the victim), password <em>echo off</em> (no characters shown), and showing the last login time so users notice intrusions. Password <em>rules</em> have changed: NIST SP 800-63B advises length over complexity, no forced periodic changes, no "must contain a symbol", and checking new passwords against lists of breached ones.</p>
<p>🧭 Backend: rate-limit <code>POST /login</code> per account <em>and</em> per IP (an in-memory counter or Redis), return one generic error, log failures, and consider an exponential delay. <code>fail2ban</code> does the same for SSH on the host.</p>
<p class="pitfall">⚠️ Do not confuse "invalid username" and "invalid password" messages in your API — the whole point of (c) is to never say which.</p>`,
        `<p class="y-chinh">🎯 Hình 9-17: ba bản ghi đăng nhập — (a) đăng nhập thành công: <code>LOGIN: mitch / PASSWORD: FooBar!-7 / SUCCESSFUL LOGIN</code>; (b) bị từ chối sau <em>tên</em>: <code>LOGIN: carol / INVALID LOGIN NAME</code>; (c) bị từ chối sau tên và mật khẩu: <code>LOGIN: carol / PASSWORD: Idunno / INVALID LOGIN</code>. Bài học nằm ở khác biệt giữa (b) và (c).</p>
<p>Ở (b) hệ thống nói với kẻ tấn công <em>tên không tồn tại</em>; ở (c) nó chỉ nói "đăng nhập không hợp lệ" mà không nói tên hay mật khẩu sai. Bản (b) giúp kẻ tấn công: chúng thử tên hàng loạt và giữ những tên không bị "INVALID LOGIN NAME" — <strong>liệt kê tên người dùng (username enumeration)</strong>. Bản (c) không rò gì. Cùng quy tắc cho ứng dụng web: trang đăng nhập và đặt lại mật khẩu phải cho <em>cùng</em> một thông báo và mất <em>xấp xỉ cùng</em> thời gian dù tài khoản có tồn tại hay không.</p>
<p>➕ Các phòng thủ kinh điển khác trên cùng màn hình: trễ ngắn sau mỗi lần thất bại và giới hạn số lần thử (làm chậm <em>vét cạn</em>), khoá tài khoản hay CAPTCHA sau nhiều lần thất bại (cẩn thận — khoá tài khoản tự nó có thể là một cuộc tấn công từ chối dịch vụ vào nạn nhân), <em>tắt vọng chữ</em> mật khẩu (không hiện ký tự), và hiện thời điểm đăng nhập lần trước để người dùng nhận ra xâm nhập. <em>Luật</em> mật khẩu đã đổi: NIST SP 800-63B khuyên ưu tiên độ dài hơn độ phức tạp, không ép đổi định kỳ, không bắt "phải có ký hiệu", và kiểm mật khẩu mới với danh sách mật khẩu đã lộ.</p>
<p>🧭 Backend: giới hạn tần suất <code>POST /login</code> theo tài khoản <em>và</em> theo IP (bộ đếm trong bộ nhớ hoặc Redis), trả một lỗi chung, ghi nhật ký thất bại, và cân nhắc trễ luỹ thừa. <code>fail2ban</code> làm đúng việc đó cho SSH trên máy chủ.</p>
<p class="pitfall">⚠️ Đừng lẫn thông báo "tên không hợp lệ" và "mật khẩu không hợp lệ" trong API của bạn — toàn bộ ý nghĩa của (c) là không bao giờ nói cái nào.</p>`],
      [25, 'UNIX Password Security',
        `<p class="y-chinh">🎯 Figure 9-18: <strong>salt</strong> defeats precomputation. UNIX stores, for each user, <code>name, salt, e(password + salt)</code> — the figure shows <code>Bobbie, 4238, e(Dog, 4238)</code> and so on: a random salt per user, and a one-way function e applied to password+salt. Without the salt an attacker would hash a dictionary <em>once</em> and look up every user; with it, each user needs a separate attack.</p>
<p>The login program takes the typed password, appends the stored salt, runs the one-way function and compares with the stored value — it never needs the password itself, and nobody (not even root) can reverse the stored value. Cracking means <em>guess, hash, compare</em>. Two things protect the user: <strong>salt</strong> (two users with the same password get different values; no precomputed tables) and <strong>slowness</strong> (a password hash must be expensive — SHA-256 does about a million guesses per second per CPU core, a purpose-built password hash far fewer).</p>
<div class="out"># Slide 25 (Figure 9-18): how UNIX stores passwords: salt + one-way hash, in /etc/shadow (readable by root only)<br>
$ ls -l /etc/passwd /etc/shadow<br>
-rw-r--r-- 1 root root &nbsp;&nbsp;874 Oct 26 00:25 /etc/passwd<br>
-rw-r----- 1 root shadow 498 Oct 26 00:25 /etc/shadow<br>
# the hash for a given salt and password is always the same: $6$ = SHA-512-crypt, then the salt, then the hash<br>
$ openssl passwd -6 -salt Xk2mP9aQ 'matkhau123'<br>
$6$Xk2mP9aQ$jxktqmoHCebsXQV7oTX8QzXcaGhVu6LSpNo0LTZDwMTLFF0S63olyDQgoodShQ7GNtUzJnwoMuBq5ECkyCRer0<br>
# another salt, SAME password: a completely different stored value<br>
$ openssl passwd -6 -salt Zz7wB1cD 'matkhau123'<br>
$6$Zz7wB1cD$hefUXUINYFtNe8Kq1DLkcUnzztDKAJ7tbuIAx/iELZdc4.LvftqDObySBOhhVx267/WVDJwe0MZ0dHcloBw0j/<br>
# create a user with that first value, as chpasswd -e does when you restore a backup<br>
$ echo "alice:$(openssl passwd -6 -salt Xk2mP9aQ 'matkhau123')" | chpasswd -e<br>
# the line of /etc/shadow: name : hash : last change (days since 1970) : min : max : warn …<br>
$ grep '^alice' /etc/shadow<br>
alice:$6$Xk2mP9aQ$jxktqmoHCebsXQV7oTX8QzXcaGhVu6LSpNo0LTZDwMTLFF0S63olyDQgoodShQ7GNtUzJnwoMuBq5ECkyCRer0:20751:0:99999:7:::<br>
# the login program does exactly this: take the salt out of the stored value, hash what was typed, compare<br>
$ LUU=$(grep '^alice' /etc/shadow | cut -d: -f2); MUOI=$(echo "$LUU" | cut -d'$' -f3)<br>
$ echo "salt = $MUOI"<br>
salt = Xk2mP9aQ<br>
$ [ "$(openssl passwd -6 -salt "$MUOI" 'matkhau123')" = "$LUU" ] &amp;&amp; echo "typed matkhau123 -&gt; MATCH, login allowed"<br>
typed matkhau123 -&gt; MATCH, login allowed<br>
$ [ "$(openssl passwd -6 -salt "$MUOI" 'matkhau124')" = "$LUU" ] || echo "typed matkhau124 -&gt; no match, login refused"<br>
typed matkhau124 -&gt; no match, login refused<br>
# nobody (not even root) can turn the stored value back into the password: only guess-and-compare<br>
$ runuser -u sv -- cat /etc/shadow; echo "exit=$?"<br>
cat: /etc/shadow: Permission denied<br>
exit=1</div>
<p>Read the stored line: <code>$6$</code> = SHA-512-crypt, <code>Xk2mP9aQ</code> = the salt, the long tail = the hash. The same password under a different salt gives a totally different value; and the login check is just "recompute with the stored salt and compare". The slide's <code>e(Dog, 4238)</code> is the 1979 <code>crypt</code>; today Debian/Ubuntu default to <code>$y$</code> (<em>yescrypt</em>), older systems <code>$6$</code>; <code>$1$</code> (MD5) is obsolete.</p>
<pre><code class="language-javascript">// Slide 25 (Figure 9-18): salt defeats precomputation. And why a PASSWORD hash must be SLOW (unlike a file hash)
const crypto = require('node:crypto');
const sha = (s) =&gt; crypto.createHash('sha256').update(s).digest('hex');

// 1) the site stores sha256(password), no salt
const csdl = [['alice', sha('123456')], ['bob', sha('123456')], ['carol', sha('Tr0ub4dor&amp;3')]];
console.log('stored (no salt):'); for (const [u, h] of csdl) console.log(&#96;  &#36;{u.padEnd(6)} &#36;{h.slice(0, 16)}…&#96;);
console.log('  -&gt; alice and bob have the SAME hash: same password, visible without cracking anything');
// the attacker builds one table of common passwords ONCE and looks every user up
const tu = ['password', '123456', 'qwerty', 'matkhau123', 'letmein', 'iloveyou'];
const bang = new Map(tu.map((p) =&gt; [sha(p), p]));
const trung = csdl.filter(([, h]) =&gt; bang.has(h)).map(([u, h]) =&gt; &#96;&#36;{u}="&#36;{bang.get(h)}"&#96;);
console.log(&#96;cracked in unsalted table: &#36;{csdl.filter(([, h]) =&gt; bang.has(h)).map(([u]) =&gt; u).join(', ')}   (&#36;{trung.join(', ')})&#96;);

// 2) with a random salt per user: same password, different stored value; the table is useless
const muoiHoa = (p, muoi) =&gt; sha(muoi + p);
const m1 = crypto.randomBytes(8).toString('hex'), m2 = crypto.randomBytes(8).toString('hex');
const a = muoiHoa('123456', m1), b = muoiHoa('123456', m2);
console.log(&#96;salted: alice hash == bob hash ? &#36;{a === b}   (alice and bob picked the same password "123456")&#96;);
console.log(&#96;precomputed table still finds them ? &#36;{bang.has(a) || bang.has(b)}&#96;);

// 3) but sha256 is FAST — an attacker can try billions per second. A password hash must be slow on purpose
let t = process.hrtime.bigint();
for (let i = 0; i &lt; 1000; i++) sha('matkhau' + i);
const msSha = Number(process.hrtime.bigint() - t) / 1e6;
t = process.hrtime.bigint();
const kdf = crypto.scryptSync('matkhau123', Buffer.from(m1, 'hex'), 32, { N: 2 ** 15, r: 8, p: 1, maxmem: 128 * 1024 * 1024 });
const msScrypt = Number(process.hrtime.bigint() - t) / 1e6;
console.log(&#96;1000 sha-256 hashes : &#36;{Math.round(msSha)} ms&#96;);
console.log(&#96;1 scrypt hash       : &#36;{Math.round(msScrypt)} ms   (N=2^15, r=8, p=1: uses 32 MiB of RAM too)&#96;);
console.log(&#96;=&gt; scrypt costs the attacker about &#36;{Math.round(msScrypt / (msSha / 1000))} times more per guess than one sha-256&#96;);
// constant-time comparison when checking a login
const lai = crypto.scryptSync('matkhau123', Buffer.from(m1, 'hex'), 32, { N: 2 ** 15, r: 8, p: 1, maxmem: 128 * 1024 * 1024 });
console.log('login check (timingSafeEqual):', crypto.timingSafeEqual(kdf, lai));</code></pre>
<div class="out">$ node bam-mat-khau.js<br>
stored (no salt):<br>
&nbsp;&nbsp;alice &nbsp;8d969eef6ecad3c2…<br>
&nbsp;&nbsp;bob &nbsp;&nbsp;&nbsp;8d969eef6ecad3c2…<br>
&nbsp;&nbsp;carol &nbsp;48486e1514e84234…<br>
&nbsp;&nbsp;-&gt; alice and bob have the SAME hash: same password, visible without cracking anything<br>
cracked in unsalted table: alice, bob &nbsp;&nbsp;(alice="123456", bob="123456")<br>
salted: alice hash == bob hash ? false &nbsp;&nbsp;(alice and bob picked the same password "123456")<br>
precomputed table still finds them ? false<br>
1000 sha-256 hashes : 3 ms<br>
1 scrypt hash &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 150 ms &nbsp;&nbsp;(N=2^15, r=8, p=1: uses 32 MiB of RAM too)<br>
=&gt; scrypt costs the attacker about 49291 times more per guess than one sha-256<br>
login check (timingSafeEqual): true</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The program shows the three ideas in order: (1) unsalted SHA-256 — alice and bob have <em>identical</em> stored values and one small dictionary cracks both; (2) with a salt per user the identical passwords look different and the precomputed table finds nothing; (3) <strong>speed is the enemy</strong> — one scrypt hash (N=2<sup>15</sup>, 32 MiB of RAM) costs the attacker tens of thousands of times more than one SHA-256, which is why <em>scrypt, bcrypt, argon2id or PBKDF2</em> are the right tools for passwords.</p>
<p>🧭 <strong>Backend rule</strong>: in Spring use <code>BCryptPasswordEncoder</code> or <code>Argon2PasswordEncoder</code> (<code>PasswordEncoderFactories.createDelegatingPasswordEncoder()</code> stores the algorithm id in the hash, like <code>$6$</code>); in Node use <code>argon2</code>/<code>bcrypt</code> packages or <code>crypto.scrypt</code>. OWASP's Password Storage Cheat Sheet recommends argon2id (e.g. m=19 MiB, t=2, p=1 as a floor), scrypt, or bcrypt (cost ≥ 10) — check the sheet for the current numbers. Never plain SHA-256, never unsalted, never your own scheme.</p>
<p class="pitfall">⚠️ FE-style: "salt" is public (it is stored next to the hash); its job is to make hashes <em>unique</em>, not secret. A secret server-side value mixed in is a "pepper".</p>`,
        `<p class="y-chinh">🎯 Hình 9-18: <strong>muối (salt)</strong> đánh bại việc tính trước. UNIX lưu, cho mỗi người dùng, <code>tên, muối, e(mật khẩu + muối)</code> — hình cho thấy <code>Bobbie, 4238, e(Dog, 4238)</code> và tiếp: một muối ngẫu nhiên cho mỗi người, và hàm một chiều e áp lên mật khẩu+muối. Không có muối, kẻ tấn công băm một từ điển <em>một lần</em> rồi tra mọi người dùng; có muối thì mỗi người cần một cuộc tấn công riêng.</p>
<p>Chương trình đăng nhập lấy mật khẩu vừa gõ, nối muối đã lưu, chạy hàm một chiều rồi so với giá trị đã lưu — nó không bao giờ cần chính mật khẩu, và không ai (kể cả root) đảo ngược được giá trị đã lưu. Bẻ khoá nghĩa là <em>đoán, băm, so</em>. Hai thứ bảo vệ người dùng: <strong>muối</strong> (hai người cùng mật khẩu có giá trị khác nhau; không có bảng tính sẵn) và <strong>độ chậm</strong> (băm mật khẩu phải đắt — SHA-256 làm cỡ một triệu lần đoán mỗi giây mỗi nhân CPU, còn hàm băm mật khẩu chuyên dụng ít hơn nhiều).</p>
<div class="out"># Slide 25 (Hình 9-18): UNIX lưu mật khẩu thế nào: muối + băm một chiều, trong /etc/shadow (chỉ root đọc được)<br>
$ ls -l /etc/passwd /etc/shadow<br>
-rw-r--r-- 1 root root &nbsp;&nbsp;874 Oct 26 00:25 /etc/passwd<br>
-rw-r----- 1 root shadow 498 Oct 26 00:25 /etc/shadow<br>
# băm của một muối và một mật khẩu luôn như nhau: $6$ = SHA-512-crypt, rồi muối, rồi bản băm<br>
$ openssl passwd -6 -salt Xk2mP9aQ 'matkhau123'<br>
$6$Xk2mP9aQ$jxktqmoHCebsXQV7oTX8QzXcaGhVu6LSpNo0LTZDwMTLFF0S63olyDQgoodShQ7GNtUzJnwoMuBq5ECkyCRer0<br>
# muối khác, CÙNG mật khẩu: giá trị lưu hoàn toàn khác<br>
$ openssl passwd -6 -salt Zz7wB1cD 'matkhau123'<br>
$6$Zz7wB1cD$hefUXUINYFtNe8Kq1DLkcUnzztDKAJ7tbuIAx/iELZdc4.LvftqDObySBOhhVx267/WVDJwe0MZ0dHcloBw0j/<br>
# tạo người dùng với giá trị đầu, như chpasswd -e khi khôi phục bản sao lưu<br>
$ echo "alice:$(openssl passwd -6 -salt Xk2mP9aQ 'matkhau123')" | chpasswd -e<br>
# dòng của /etc/shadow: tên : băm : lần đổi cuối (ngày từ 1970) : min : max : cảnh báo …<br>
$ grep '^alice' /etc/shadow<br>
alice:$6$Xk2mP9aQ$jxktqmoHCebsXQV7oTX8QzXcaGhVu6LSpNo0LTZDwMTLFF0S63olyDQgoodShQ7GNtUzJnwoMuBq5ECkyCRer0:20751:0:99999:7:::<br>
# chương trình đăng nhập làm đúng thế này: lấy muối ra khỏi giá trị đã lưu, băm chuỗi vừa gõ, so sánh<br>
$ LUU=$(grep '^alice' /etc/shadow | cut -d: -f2); MUOI=$(echo "$LUU" | cut -d'$' -f3)<br>
$ echo "salt = $MUOI"<br>
salt = Xk2mP9aQ<br>
$ [ "$(openssl passwd -6 -salt "$MUOI" 'matkhau123')" = "$LUU" ] &amp;&amp; echo "typed matkhau123 -&gt; MATCH, login allowed"<br>
typed matkhau123 -&gt; MATCH, login allowed<br>
$ [ "$(openssl passwd -6 -salt "$MUOI" 'matkhau124')" = "$LUU" ] || echo "typed matkhau124 -&gt; no match, login refused"<br>
typed matkhau124 -&gt; no match, login refused<br>
# không ai (kể cả root) đổi giá trị lưu ngược lại thành mật khẩu được: chỉ có cách đoán rồi so<br>
$ runuser -u sv -- cat /etc/shadow; echo "exit=$?"<br>
cat: /etc/shadow: Permission denied<br>
exit=1</div>
<p>Đọc dòng đã lưu: <code>$6$</code> = SHA-512-crypt, <code>Xk2mP9aQ</code> = muối, đoạn dài phía sau = bản băm. Cùng mật khẩu dưới muối khác cho giá trị hoàn toàn khác; và phép kiểm đăng nhập chỉ là "tính lại với muối đã lưu rồi so". <code>e(Dog, 4238)</code> của slide là <code>crypt</code> năm 1979; ngày nay Debian/Ubuntu mặc định <code>$y$</code> (<em>yescrypt</em>), hệ cũ hơn <code>$6$</code>; <code>$1$</code> (MD5) đã lỗi thời.</p>
<pre><code class="language-javascript">// Slide 25 (Hình 9-18): muối chống tính trước. Và vì sao băm MẬT KHẨU phải CHẬM (khác băm tệp)
const crypto = require('node:crypto');
const sha = (s) =&gt; crypto.createHash('sha256').update(s).digest('hex');

// 1) trang lưu sha256(mật khẩu), không muối
const csdl = [['alice', sha('123456')], ['bob', sha('123456')], ['carol', sha('Tr0ub4dor&amp;3')]];
console.log('stored (no salt):'); for (const [u, h] of csdl) console.log(&#96;  &#36;{u.padEnd(6)} &#36;{h.slice(0, 16)}…&#96;);
console.log('  -&gt; alice and bob have the SAME hash: same password, visible without cracking anything');
// kẻ tấn công dựng MỘT bảng mật khẩu phổ biến rồi tra mọi người dùng
const tu = ['password', '123456', 'qwerty', 'matkhau123', 'letmein', 'iloveyou'];
const bang = new Map(tu.map((p) =&gt; [sha(p), p]));
const trung = csdl.filter(([, h]) =&gt; bang.has(h)).map(([u, h]) =&gt; &#96;&#36;{u}="&#36;{bang.get(h)}"&#96;);
console.log(&#96;cracked in unsalted table: &#36;{csdl.filter(([, h]) =&gt; bang.has(h)).map(([u]) =&gt; u).join(', ')}   (&#36;{trung.join(', ')})&#96;);

// 2) có muối ngẫu nhiên cho mỗi người: cùng mật khẩu, giá trị lưu khác nhau; bảng tính sẵn vô dụng
const muoiHoa = (p, muoi) =&gt; sha(muoi + p);
const m1 = crypto.randomBytes(8).toString('hex'), m2 = crypto.randomBytes(8).toString('hex');
const a = muoiHoa('123456', m1), b = muoiHoa('123456', m2);
console.log(&#96;salted: alice hash == bob hash ? &#36;{a === b}   (alice and bob picked the same password "123456")&#96;);
console.log(&#96;precomputed table still finds them ? &#36;{bang.has(a) || bang.has(b)}&#96;);

// 3) nhưng sha256 NHANH — kẻ tấn công thử hàng tỉ lần mỗi giây. Băm mật khẩu phải cố ý chậm
let t = process.hrtime.bigint();
for (let i = 0; i &lt; 1000; i++) sha('matkhau' + i);
const msSha = Number(process.hrtime.bigint() - t) / 1e6;
t = process.hrtime.bigint();
const kdf = crypto.scryptSync('matkhau123', Buffer.from(m1, 'hex'), 32, { N: 2 ** 15, r: 8, p: 1, maxmem: 128 * 1024 * 1024 });
const msScrypt = Number(process.hrtime.bigint() - t) / 1e6;
console.log(&#96;1000 sha-256 hashes : &#36;{Math.round(msSha)} ms&#96;);
console.log(&#96;1 scrypt hash       : &#36;{Math.round(msScrypt)} ms   (N=2^15, r=8, p=1: uses 32 MiB of RAM too)&#96;);
console.log(&#96;=&gt; scrypt costs the attacker about &#36;{Math.round(msScrypt / (msSha / 1000))} times more per guess than one sha-256&#96;);
// so sánh thời gian không đổi khi kiểm đăng nhập
const lai = crypto.scryptSync('matkhau123', Buffer.from(m1, 'hex'), 32, { N: 2 ** 15, r: 8, p: 1, maxmem: 128 * 1024 * 1024 });
console.log('login check (timingSafeEqual):', crypto.timingSafeEqual(kdf, lai));</code></pre>
<div class="out">$ node bam-mat-khau.js<br>
stored (no salt):<br>
&nbsp;&nbsp;alice &nbsp;8d969eef6ecad3c2…<br>
&nbsp;&nbsp;bob &nbsp;&nbsp;&nbsp;8d969eef6ecad3c2…<br>
&nbsp;&nbsp;carol &nbsp;48486e1514e84234…<br>
&nbsp;&nbsp;-&gt; alice and bob have the SAME hash: same password, visible without cracking anything<br>
cracked in unsalted table: alice, bob &nbsp;&nbsp;(alice="123456", bob="123456")<br>
salted: alice hash == bob hash ? false &nbsp;&nbsp;(alice and bob picked the same password "123456")<br>
precomputed table still finds them ? false<br>
1000 sha-256 hashes : 3 ms<br>
1 scrypt hash &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 150 ms &nbsp;&nbsp;(N=2^15, r=8, p=1: uses 32 MiB of RAM too)<br>
=&gt; scrypt costs the attacker about 49291 times more per guess than one sha-256<br>
login check (timingSafeEqual): true</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Chương trình cho thấy ba ý theo thứ tự: (1) SHA-256 không muối — alice và bob có giá trị lưu <em>y hệt</em> và một từ điển nhỏ bẻ cả hai; (2) có muối riêng cho mỗi người thì các mật khẩu giống nhau trông khác nhau và bảng tính sẵn không tìm ra gì; (3) <strong>tốc độ là kẻ thù</strong> — một lần băm scrypt (N=2<sup>15</sup>, 32 MiB RAM) tốn của kẻ tấn công gấp hàng chục nghìn lần một SHA-256, đó là lý do <em>scrypt, bcrypt, argon2id hay PBKDF2</em> mới là công cụ đúng cho mật khẩu.</p>
<p>🧭 <strong>Quy tắc backend</strong>: trong Spring dùng <code>BCryptPasswordEncoder</code> hoặc <code>Argon2PasswordEncoder</code> (<code>PasswordEncoderFactories.createDelegatingPasswordEncoder()</code> lưu mã thuật toán trong bản băm, như <code>$6$</code>); trong Node dùng gói <code>argon2</code>/<code>bcrypt</code> hoặc <code>crypto.scrypt</code>. Cheat Sheet Password Storage của OWASP khuyên argon2id (ví dụ m=19 MiB, t=2, p=1 làm mức sàn), scrypt, hoặc bcrypt (cost ≥ 10) — xem trang đó để lấy số mới nhất. Không bao giờ SHA-256 trơn, không bao giờ không muối, không bao giờ tự chế.</p>
<p class="pitfall">⚠️ Kiểu FE: "muối" là công khai (lưu cạnh bản băm); việc của nó là làm bản băm <em>duy nhất</em>, không phải bí mật. Một giá trị bí mật phía máy chủ trộn thêm gọi là "pepper".</p>`],
      [26, 'Challenge-Response Authentication',
        `<p class="y-chinh">🎯 <strong>Challenge–response</strong>: instead of one fixed secret answer, the user registers a list of questions and answers ("Who is Marjolein's sister?", "On what street was your elementary school?", "What did Mrs. Ellis teach?"), and the system asks one at random at login. Questions are chosen so the user <em>need not write them down</em>. The general idea — and the strong one — is that the <strong>question changes every time</strong>.</p>
<p>The book's human version has a weakness you already know: answers to "mother's maiden name" and "first school" are guessable or findable on social media. The cryptographic version fixes this: the server sends a fresh random <strong>challenge</strong> N; the client answers <code>HMAC(secret, N)</code>; the secret itself <em>never crosses the wire</em>, and a recorded answer is useless because next time N is different (a <em>replay attack</em> fails).</p>
<pre><code class="language-javascript">// Slide 26: challenge-response — the secret never crosses the wire; every login uses a fresh question
const crypto = require('node:crypto');
const hmac = (khoa, s) =&gt; crypto.createHmac('sha256', khoa).update(s).digest('hex').slice(0, 12);
const BI_MAT = 'chia-se-truoc-giua-the-va-may-chu';        // shared by the smart card and the server (slide 27)

let dem = 0;                                                 // deterministic "random" challenges, so the output is stable
const thuThach = () =&gt; &#96;thu-thach-&#36;{++dem}&#96;;

console.log('--- 1. honest login ---');
const t1 = thuThach();                                       // server -&gt; client: "answer THIS"
const d1 = hmac(BI_MAT, t1);                                 // client computes with the secret; the secret is NOT sent
console.log(&#96;server asks  : &#36;{t1}\\nclient answers: &#36;{d1}\\nserver check : &#36;{hmac(BI_MAT, t1) === d1 ? 'ACCEPT' : 'REJECT'}&#96;);

console.log('--- 2. an eavesdropper replays the recorded answer next time ---');
const t2 = thuThach();
console.log(&#96;server asks  : &#36;{t2}\\nreplayed     : &#36;{d1}\\nserver check : &#36;{hmac(BI_MAT, t2) === d1 ? 'ACCEPT' : 'REJECT (the question changed, the old answer is useless)'}&#96;);

console.log('--- 3. phishing: the fake site relays the real site question (login spoofing, slide 35) ---');
// without binding, a fake site asks the real server for a challenge and forwards it to the victim
const t3 = thuThach();
const nanNhanTraLoi = hmac(BI_MAT, t3);                      // victim's token answers whatever it is asked
console.log(&#96;relayed to real server: &#36;{hmac(BI_MAT, t3) === nanNhanTraLoi ? 'ACCEPT (attack works)' : 'REJECT'}&#96;);
// with the ORIGIN inside the answer (this is how FIDO2/WebAuthn works), the answer is only valid for the site that was asked
const t4 = thuThach();
const traLoiGanNguon = (nguon, t) =&gt; hmac(BI_MAT, &#96;&#36;{nguon}|&#36;{t}&#96;);
const nanNhan = traLoiGanNguon('https:// cuongthai-fake.example', t4);   // the browser puts the REAL address of the page in front of the user
console.log(&#96;bound to origin, relayed: &#36;{traLoiGanNguon('https://cuongthai.com', t4) === nanNhan ? 'ACCEPT' : 'REJECT (answer was made for the fake origin)'}&#96;);</code></pre>
<div class="out">$ node thach-thuc.js<br>
--- 1. honest login ---<br>
server asks &nbsp;: thu-thach-1<br>
client answers: f56d450fa6be<br>
server check : ACCEPT<br>
--- 2. an eavesdropper replays the recorded answer next time ---<br>
server asks &nbsp;: thu-thach-2<br>
replayed &nbsp;&nbsp;&nbsp;&nbsp;: f56d450fa6be<br>
server check : REJECT (the question changed, the old answer is useless)<br>
--- 3. phishing: the fake site relays the real site question (login spoofing, slide 35) ---<br>
relayed to real server: ACCEPT (attack works)<br>
bound to origin, relayed: REJECT (answer was made for the fake origin)</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/6b730bce2ce1dcf11096ccdd6ef9d2f1e9cf1d99.svg" alt="Challenge–response as a sequence diagram" loading="lazy" /><p class="chu-thich">🧩 Challenge–response as a sequence diagram</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 26: challenge-response — the secret never travels, every login has a fresh question
participant "Client\\n(knows the secret)" as C
participant "Server\\n(knows the secret)" as S
C -&gt; S : login request: "I am alice"
S -&gt; S : make a fresh random challenge N
S --&gt; C : challenge N
C -&gt; C : answer = HMAC(secret, N)
C -&gt; S : answer
S -&gt; S : expected = HMAC(secret, N)\\ncompare in constant time
S --&gt; C : accepted / refused
note over C, S
  A recording of the answer is useless next time:
  next time the challenge is N2, not N.
  Binding the ORIGIN into the HMAC (FIDO2) also stops phishing relays.
end note
@enduml</code></pre></details>
<p>Read the four sections: honest login accepted; the replayed old answer rejected; a <em>relay</em> through a fake site accepted when the answer is not bound to a site (this is phishing, slide 35); and rejected when the answer includes the real <strong>origin</strong> — the core idea of <strong>FIDO2/WebAuthn</strong> passkeys: the browser, not the user, puts the true address into the signed answer, so a look-alike page gets an answer that is worthless elsewhere.</p>
<p>🧭 Challenge–response is everywhere: SSH public-key login (the server sends a challenge, your private key signs it), CHAP, the NTLM/Kerberos family, and Postgres' <code>scram-sha-256</code> password authentication (the password never travels, only salted proofs).</p>
<p class="pitfall">⚠️ The "challenge" must be <em>unpredictable and used once</em> (a nonce). A counter that an attacker can guess, or a challenge accepted twice, brings replay back.</p>`,
        `<p class="y-chinh">🎯 <strong>Hỏi–đáp (challenge–response)</strong>: thay vì một đáp án bí mật cố định, người dùng đăng ký một danh sách câu hỏi và câu trả lời ("Chị của Marjolein là ai?", "Trường tiểu học của bạn ở đường nào?", "Cô Ellis dạy môn gì?"), và hệ thống hỏi ngẫu nhiên một câu lúc đăng nhập. Câu hỏi được chọn để người dùng <em>không cần ghi ra</em>. Ý chung — và là ý mạnh — là <strong>câu hỏi đổi mỗi lần</strong>.</p>
<p>Phiên bản của người có một điểm yếu bạn đã biết: đáp án "họ thời con gái của mẹ" và "trường đầu tiên" đoán được hoặc tìm được trên mạng xã hội. Phiên bản mật mã sửa điều đó: máy chủ gửi một <strong>thử thách (challenge)</strong> N ngẫu nhiên mới; máy khách đáp <code>HMAC(bí mật, N)</code>; bản thân bí mật <em>không bao giờ đi qua đường truyền</em>, và câu trả lời được ghi lại vô dụng vì lần sau N khác (<em>tấn công phát lại — replay</em> thất bại).</p>
<pre><code class="language-javascript">// Slide 26: hỏi–đáp — bí mật không bao giờ đi qua đường truyền; mỗi lần đăng nhập một câu hỏi mới
const crypto = require('node:crypto');
const hmac = (khoa, s) =&gt; crypto.createHmac('sha256', khoa).update(s).digest('hex').slice(0, 12);
const BI_MAT = 'chia-se-truoc-giua-the-va-may-chu';        // thẻ thông minh và máy chủ cùng giữ (slide 27)

let dem = 0;                                                 // thử thách "ngẫu nhiên" tất định để output ổn định
const thuThach = () =&gt; &#96;thu-thach-&#36;{++dem}&#96;;

console.log('--- 1. honest login ---');
const t1 = thuThach();                                       // server -&gt; client: "answer THIS"
const d1 = hmac(BI_MAT, t1);                                 // client computes with the secret; the secret is NOT sent
console.log(&#96;server asks  : &#36;{t1}\\nclient answers: &#36;{d1}\\nserver check : &#36;{hmac(BI_MAT, t1) === d1 ? 'ACCEPT' : 'REJECT'}&#96;);

console.log('--- 2. an eavesdropper replays the recorded answer next time ---');
const t2 = thuThach();
console.log(&#96;server asks  : &#36;{t2}\\nreplayed     : &#36;{d1}\\nserver check : &#36;{hmac(BI_MAT, t2) === d1 ? 'ACCEPT' : 'REJECT (the question changed, the old answer is useless)'}&#96;);

console.log('--- 3. phishing: the fake site relays the real site question (login spoofing, slide 35) ---');
// không có ràng buộc, trang giả xin thử thách thật rồi chuyển cho nạn nhân
const t3 = thuThach();
const nanNhanTraLoi = hmac(BI_MAT, t3);                      // thẻ của nạn nhân trả lời bất cứ câu hỏi nào
console.log(&#96;relayed to real server: &#36;{hmac(BI_MAT, t3) === nanNhanTraLoi ? 'ACCEPT (attack works)' : 'REJECT'}&#96;);
// khi đưa NGUỒN GỐC (origin) vào câu trả lời (FIDO2/WebAuthn làm vậy), câu trả lời chỉ có giá trị với đúng trang được hỏi
const t4 = thuThach();
const traLoiGanNguon = (nguon, t) =&gt; hmac(BI_MAT, &#96;&#36;{nguon}|&#36;{t}&#96;);
const nanNhan = traLoiGanNguon('https:// trình duyệt tự điền địa chỉ THẬT của trang
console.log(&#96;bound to origin, relayed: &#36;{traLoiGanNguon('https://cuongthai.com', t4) === nanNhan ? 'ACCEPT' : 'REJECT (answer was made for the fake origin)'}&#96;);</code></pre>
<div class="out">$ node thach-thuc.js<br>
--- 1. honest login ---<br>
server asks &nbsp;: thu-thach-1<br>
client answers: f56d450fa6be<br>
server check : ACCEPT<br>
--- 2. an eavesdropper replays the recorded answer next time ---<br>
server asks &nbsp;: thu-thach-2<br>
replayed &nbsp;&nbsp;&nbsp;&nbsp;: f56d450fa6be<br>
server check : REJECT (the question changed, the old answer is useless)<br>
--- 3. phishing: the fake site relays the real site question (login spoofing, slide 35) ---<br>
relayed to real server: ACCEPT (attack works)<br>
bound to origin, relayed: REJECT (answer was made for the fake origin)</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/6b730bce2ce1dcf11096ccdd6ef9d2f1e9cf1d99.svg" alt="Hỏi–đáp dạng sơ đồ tuần tự" loading="lazy" /><p class="chu-thich">🧩 Hỏi–đáp dạng sơ đồ tuần tự</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 26: hỏi–đáp — bí mật không bao giờ đi qua đường truyền, mỗi lần đăng nhập một câu hỏi mới
participant "Client\\n(knows the secret)" as C
participant "Server\\n(knows the secret)" as S
C -&gt; S : login request: "I am alice"
S -&gt; S : make a fresh random challenge N
S --&gt; C : challenge N
C -&gt; C : answer = HMAC(secret, N)
C -&gt; S : answer
S -&gt; S : expected = HMAC(secret, N)\\ncompare in constant time
S --&gt; C : accepted / refused
note over C, S
  A recording of the answer is useless next time:
  next time the challenge is N2, not N.
  Binding the ORIGIN into the HMAC (FIDO2) also stops phishing relays.
end note
@enduml</code></pre></details>
<p>Đọc bốn phần: đăng nhập trung thực được chấp nhận; câu trả lời cũ phát lại bị từ chối; một cuộc <em>chuyển tiếp (relay)</em> qua trang giả được chấp nhận khi câu trả lời không gắn với trang (đó là lừa đảo — phishing, slide 35); và bị từ chối khi câu trả lời gồm <strong>nguồn gốc (origin)</strong> thật — ý cốt lõi của passkey <strong>FIDO2/WebAuthn</strong>: trình duyệt, không phải người dùng, đặt địa chỉ thật vào câu trả lời đã ký, nên trang nhái nhận được câu trả lời vô giá trị ở nơi khác.</p>
<p>🧭 Hỏi–đáp có ở khắp nơi: đăng nhập SSH bằng khoá công khai (máy chủ gửi thử thách, khoá riêng của bạn ký nó), CHAP, họ NTLM/Kerberos, và xác thực mật khẩu <code>scram-sha-256</code> của Postgres (mật khẩu không bao giờ đi qua đường truyền, chỉ có bằng chứng có muối).</p>
<p class="pitfall">⚠️ "Thử thách" phải <em>không đoán được và chỉ dùng một lần</em> (nonce). Bộ đếm mà kẻ tấn công đoán được, hay thử thách được chấp nhận hai lần, đem replay trở lại.</p>`],
      [27, 'Authentication Using a Physical Object',
        `<p class="y-chinh">🎯 Figure 9-19: a <strong>smart card</strong> holds a secret key and a tiny processor. (1) The remote computer sends a <strong>challenge</strong> to the smart card reader; (2) the card computes the response with its secret; (3) the response is sent back. The secret never leaves the card — a hardware version of slide 26. Authentication by <em>something the user has</em>.</p>
<p>Because the secret is inside tamper-resistant hardware, malware on the PC can ask the card to answer challenges <em>while the card is plugged in</em> but cannot copy the key and take it away. Today's equivalents: bank <em>token generators</em>, phone authenticator apps (TOTP), USB security keys (YubiKey, FIDO2) and <em>passkeys</em> in the phone's secure enclave.</p>
<p>The most common one is <strong>TOTP</strong> (time-based one-time password, RFC 6238): the server and your phone share a secret; both compute <code>HMAC(secret, floor(time/30))</code> and cut it to 6 digits. The code changes every 30 seconds and nothing but the code crosses the wire. The program below implements it and checks itself against the six test vectors printed in RFC 6238, Appendix B (SHA-1, secret "12345678901234567890", 8 digits):</p>
<pre><code class="language-javascript">// Slide 27: "something the user HAS" — a one-time-password token. TOTP = RFC 6238: HMAC(secret, time step) cut to 6-8 digits
const crypto = require('node:crypto');
function totp(bimat, giay, { chuSo = 8, buoc = 30, thuatToan = 'sha1' } = {}) {
  const dem = Buffer.alloc(8); dem.writeBigUInt64BE(BigInt(Math.floor(giay / buoc)));
  const h = crypto.createHmac(thuatToan, bimat).update(dem).digest();
  const o = h[h.length - 1] &amp; 0x0f;                                              // dynamic truncation (RFC 4226)
  const so = ((h[o] &amp; 0x7f) &lt;&lt; 24) | (h[o + 1] &lt;&lt; 16) | (h[o + 2] &lt;&lt; 8) | h[o + 3];
  return String(so % 10 ** chuSo).padStart(chuSo, '0');
}
// RFC 6238 Appendix B test vectors, SHA-1, secret "12345678901234567890"
const KHOA = Buffer.from('12345678901234567890');
for (const [t, mong] of [[59, '94287082'], [1111111109, '07081804'], [1111111111, '14050471'], [1234567890, '89005924'], [2000000000, '69279037'], [20000000000, '65353130']]) {
  const ra = totp(KHOA, t);
  console.log(&#96;T=&#36;{String(t).padEnd(11)} TOTP=&#36;{ra}  expected &#36;{mong}  &#36;{ra === mong ? 'OK' : 'MISMATCH'}&#96;);
}
// what your phone shows (6 digits): the same code for 30 seconds, then a new one
console.log('6 digits at T=59 and T=60:', totp(KHOA, 59, { chuSo: 6 }), totp(KHOA, 60, { chuSo: 6 }), '(59 is in step 1, 60 starts step 2)');</code></pre>
<div class="out">$ node totp.js<br>
T=59 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TOTP=94287082 &nbsp;expected 94287082 &nbsp;OK<br>
T=1111111109 &nbsp;TOTP=07081804 &nbsp;expected 07081804 &nbsp;OK<br>
T=1111111111 &nbsp;TOTP=14050471 &nbsp;expected 14050471 &nbsp;OK<br>
T=1234567890 &nbsp;TOTP=89005924 &nbsp;expected 89005924 &nbsp;OK<br>
T=2000000000 &nbsp;TOTP=69279037 &nbsp;expected 69279037 &nbsp;OK<br>
T=20000000000 TOTP=65353130 &nbsp;expected 65353130 &nbsp;OK<br>
6 digits at T=59 and T=60: 287082 359152 (59 is in step 1, 60 starts step 2)</div>
<p>Every line says <code>OK</code> — our implementation matches the RFC byte for byte. Look at the last line: a code valid at time 59 is not valid at time 60, because the 30-second step changed. Real servers accept ±1 step to tolerate clock drift.</p>
<p>🧭 Add TOTP to your own login page with a vetted library (<code>otplib</code>, <code>speakeasy</code>, Spring Security + a TOTP library), store the shared secret <em>encrypted</em>, and offer recovery codes. For maximum phishing resistance prefer WebAuthn/passkeys (slide 26's origin binding); TOTP can still be relayed by a fake site in real time.</p>
<p class="pitfall">⚠️ SMS codes are the weakest "something you have": SIM-swap and interception attacks exist. NIST classes SMS as a <em>restricted</em> authenticator.</p>`,
        `<p class="y-chinh">🎯 Hình 9-19: <strong>thẻ thông minh (smart card)</strong> giữ một khoá bí mật và một bộ xử lý nhỏ. (1) Máy tính ở xa gửi một <strong>thử thách</strong> tới đầu đọc thẻ; (2) thẻ tính phản hồi bằng bí mật của nó; (3) phản hồi được gửi lại. Bí mật không bao giờ rời thẻ — một phiên bản phần cứng của slide 26. Xác thực bằng <em>thứ người dùng có</em>.</p>
<p>Vì bí mật nằm trong phần cứng chống giả mạo, mã độc trên PC có thể bảo thẻ trả lời thử thách <em>khi thẻ đang cắm</em> nhưng không chép được khoá mang đi. Tương đương ngày nay: <em>máy sinh mã</em> của ngân hàng, ứng dụng authenticator trên điện thoại (TOTP), khoá bảo mật USB (YubiKey, FIDO2) và <em>passkey</em> trong vùng an toàn của điện thoại.</p>
<p>Phổ biến nhất là <strong>TOTP</strong> (mật khẩu một lần theo thời gian, RFC 6238): máy chủ và điện thoại bạn chia sẻ một bí mật; cả hai tính <code>HMAC(bí mật, floor(thời gian/30))</code> rồi cắt còn 6 chữ số. Mã đổi mỗi 30 giây và không gì ngoài mã đi qua đường truyền. Chương trình dưới đây cài nó và tự kiểm với sáu vector thử in trong RFC 6238, Phụ lục B (SHA-1, bí mật "12345678901234567890", 8 chữ số):</p>
<pre><code class="language-javascript">// Slide 27: "thứ người dùng CÓ" — token mật khẩu một lần. TOTP = RFC 6238: HMAC(bí mật, bước thời gian) cắt còn 6-8 chữ số
const crypto = require('node:crypto');
function totp(bimat, giay, { chuSo = 8, buoc = 30, thuatToan = 'sha1' } = {}) {
  const dem = Buffer.alloc(8); dem.writeBigUInt64BE(BigInt(Math.floor(giay / buoc)));
  const h = crypto.createHmac(thuatToan, bimat).update(dem).digest();
  const o = h[h.length - 1] &amp; 0x0f;                                              // cắt động
  const so = ((h[o] &amp; 0x7f) &lt;&lt; 24) | (h[o + 1] &lt;&lt; 16) | (h[o + 2] &lt;&lt; 8) | h[o + 3];
  return String(so % 10 ** chuSo).padStart(chuSo, '0');
}
// vector thử trong Phụ lục B của RFC 6238, SHA-1, bí mật "12345678901234567890"
const KHOA = Buffer.from('12345678901234567890');
for (const [t, mong] of [[59, '94287082'], [1111111109, '07081804'], [1111111111, '14050471'], [1234567890, '89005924'], [2000000000, '69279037'], [20000000000, '65353130']]) {
  const ra = totp(KHOA, t);
  console.log(&#96;T=&#36;{String(t).padEnd(11)} TOTP=&#36;{ra}  expected &#36;{mong}  &#36;{ra === mong ? 'OK' : 'MISMATCH'}&#96;);
}
// điện thoại hiện (6 chữ số): cùng mã suốt 30 giây, rồi mã mới
console.log('6 digits at T=59 and T=60:', totp(KHOA, 59, { chuSo: 6 }), totp(KHOA, 60, { chuSo: 6 }), '(59 is in step 1, 60 starts step 2)');</code></pre>
<div class="out">$ node totp.js<br>
T=59 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TOTP=94287082 &nbsp;expected 94287082 &nbsp;OK<br>
T=1111111109 &nbsp;TOTP=07081804 &nbsp;expected 07081804 &nbsp;OK<br>
T=1111111111 &nbsp;TOTP=14050471 &nbsp;expected 14050471 &nbsp;OK<br>
T=1234567890 &nbsp;TOTP=89005924 &nbsp;expected 89005924 &nbsp;OK<br>
T=2000000000 &nbsp;TOTP=69279037 &nbsp;expected 69279037 &nbsp;OK<br>
T=20000000000 TOTP=65353130 &nbsp;expected 65353130 &nbsp;OK<br>
6 digits at T=59 and T=60: 287082 359152 (59 is in step 1, 60 starts step 2)</div>
<p>Mọi dòng đều ghi <code>OK</code> — bản cài của ta khớp RFC từng byte. Nhìn dòng cuối: mã hợp lệ ở thời điểm 59 không hợp lệ ở thời điểm 60, vì bước 30 giây đã đổi. Máy chủ thật chấp nhận ±1 bước để chịu được lệch đồng hồ.</p>
<p>🧭 Thêm TOTP vào trang đăng nhập của bạn bằng thư viện đã kiểm chứng (<code>otplib</code>, <code>speakeasy</code>, Spring Security + thư viện TOTP), lưu bí mật chung <em>đã mã hoá</em>, và cung cấp mã khôi phục. Để chống lừa đảo tối đa, ưu tiên WebAuthn/passkey (ràng buộc nguồn gốc ở slide 26); TOTP vẫn có thể bị trang giả chuyển tiếp theo thời gian thực.</p>
<p class="pitfall">⚠️ Mã SMS là "thứ bạn có" yếu nhất: có tấn công đổi SIM và chặn tin. NIST xếp SMS vào loại bộ xác thực <em>bị hạn chế</em>.</p>`],
      [28, 'Authentication Using Biometrics',
        `<p class="y-chinh">🎯 Figure 9-20: a device measuring <strong>finger length</strong> (springs and pressure plates) — an early example of <strong>biometrics</strong>, authentication by <em>something the user is</em>. Fingerprints, irises, faces and voices are the modern ones. A biometric system works in two phases: <strong>enrolment</strong> (measure and store a template) and <strong>identification/verification</strong> (measure again and compare).</p>
<p>The catch: two measurements of the same finger are never <em>identical</em> — pressure, dirt and light change them — so the system accepts a match when the similarity is above a <strong>threshold</strong>. That threshold creates two errors: <strong>FAR</strong>, false acceptance rate (an impostor gets in), and <strong>FRR</strong>, false rejection rate (the real user is refused). Raise the threshold: FAR falls, FRR rises. The point where they are equal is the <strong>EER</strong>.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4205f328894ab2c93e57598d8c979e5874145ea5.svg" alt="FAR falls and FRR rises as the threshold increases (invented distributions)" loading="lazy" /><p class="chu-thich">🧮 FAR falls and FRR rises as the threshold increases (invented distributions)</p></div>
<table><thead><tr><th>threshold</th><th>FAR</th><th>FRR</th></tr></thead><tbody><tr><td>0.45</td><td>33.8 %</td><td>1.9 %</td></tr><tr><td>0.55</td><td>10.6 %</td><td>10.6 %</td></tr><tr><td>0.6</td><td>4.8 %</td><td>20.2 %</td></tr><tr><td>0.65</td><td>1.9 %</td><td>33.8 %</td></tr></tbody></table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const MU_THAT = 0.7, MU_LA = 0.4, SIGMA = 0.12;
// hàm phân phối chuẩn bằng xấp xỉ Abramowitz–Stegun 7.1.26 của erf (sai số &lt; 1,5e-7)
function erf(x) {
  const s = x &lt; 0 ? -1 : 1; x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return s * y;
}
const cdf = (x, mu) =&gt; 0.5 * (1 + erf((x - mu) / (SIGMA * Math.SQRT2)));
const far = (ng) =&gt; 1 - cdf(ng, MU_LA);
const frr = (ng) =&gt; cdf(ng, MU_THAT);
function eer() { let best = 0, d = Infinity; for (let i = 0; i &lt;= 1000; i++) { const ng = i / 1000; const e = Math.abs(far(ng) - frr(ng)); if (e &lt; d) { d = e; best = ng; } } return best; }</code></pre></details>
<p>➕ The curves come from two bell-shaped score distributions (genuine around 0.70, impostor around 0.40 — invented numbers to show the shape, not a real device); they cross at threshold 0.55. A bank picks a high threshold (few false accepts, annoyed customers); a phone picks a middle one. Biometrics also have problems passwords do not: they <em>cannot be changed</em> if copied (you cannot reset your fingerprint), they can be photographed or lifted, and raise privacy duties (a biometric is personal data of a sensitive kind under many laws, including Vietnam's Decree 13/2023). So they are best used <em>on the device</em> to unlock a key (Face ID/Touch ID unlocking a passkey), not as a shared server-side secret.</p>
<p class="pitfall">⚠️ FAR = <em>impostor accepted</em> (security failure); FRR = <em>genuine user rejected</em> (usability failure). Students swap them — "false <strong>accept</strong>" is the dangerous one.</p>
<p class="meo">🧠 End of 9.A — check yourself: CIA (slide 2), TCB and reference monitor (4), domain/matrix/ACL/C-list (5–12), BLP vs Biba (14–16), covert channel (17–18), salt and slow hashing (25), challenge–response (26), TOTP (27), FAR/FRR (28). Then lesson 9.B: attacks.</p>`,
        `<p class="y-chinh">🎯 Hình 9-20: thiết bị đo <strong>độ dài ngón tay</strong> (lò xo và tấm áp lực) — một ví dụ sớm của <strong>sinh trắc học (biometrics)</strong>, xác thực bằng <em>thứ người dùng là</em>. Vân tay, mống mắt, khuôn mặt và giọng nói là các ví dụ hiện đại. Hệ thống sinh trắc làm việc hai pha: <strong>đăng ký (enrolment)</strong> (đo và lưu mẫu) và <strong>nhận dạng/xác minh</strong> (đo lại và so sánh).</p>
<p>Vướng mắc: hai lần đo cùng một ngón tay không bao giờ <em>y hệt</em> — áp lực, bụi bẩn và ánh sáng làm chúng khác — nên hệ thống chấp nhận khi độ giống vượt một <strong>ngưỡng</strong>. Ngưỡng này tạo hai loại lỗi: <strong>FAR</strong>, tỉ lệ chấp nhận nhầm (kẻ mạo danh lọt vào), và <strong>FRR</strong>, tỉ lệ từ chối nhầm (người thật bị từ chối). Tăng ngưỡng: FAR giảm, FRR tăng. Điểm hai tỉ lệ bằng nhau là <strong>EER</strong>.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/43a06e9a82688e45d58175b8dbfce5ca15ab6fa9.svg" alt="FAR giảm và FRR tăng khi ngưỡng tăng (phân phối bịa để minh hoạ)" loading="lazy" /><p class="chu-thich">🧮 FAR giảm và FRR tăng khi ngưỡng tăng (phân phối bịa để minh hoạ)</p></div>
<table><thead><tr><th>ngưỡng</th><th>FAR</th><th>FRR</th></tr></thead><tbody><tr><td>0.45</td><td>33.8 %</td><td>1.9 %</td></tr><tr><td>0.55</td><td>10.6 %</td><td>10.6 %</td></tr><tr><td>0.6</td><td>4.8 %</td><td>20.2 %</td></tr><tr><td>0.65</td><td>1.9 %</td><td>33.8 %</td></tr></tbody></table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const MU_THAT = 0.7, MU_LA = 0.4, SIGMA = 0.12;
// hàm phân phối chuẩn bằng xấp xỉ Abramowitz–Stegun 7.1.26 của erf (sai số &lt; 1,5e-7)
function erf(x) {
  const s = x &lt; 0 ? -1 : 1; x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return s * y;
}
const cdf = (x, mu) =&gt; 0.5 * (1 + erf((x - mu) / (SIGMA * Math.SQRT2)));
const far = (ng) =&gt; 1 - cdf(ng, MU_LA);
const frr = (ng) =&gt; cdf(ng, MU_THAT);
function eer() { let best = 0, d = Infinity; for (let i = 0; i &lt;= 1000; i++) { const ng = i / 1000; const e = Math.abs(far(ng) - frr(ng)); if (e &lt; d) { d = e; best = ng; } } return best; }</code></pre></details>
<p>➕ Các đường cong đến từ hai phân phối điểm hình chuông (người thật quanh 0,70, kẻ mạo danh quanh 0,40 — số bịa để cho thấy hình dạng, không phải thiết bị thật); chúng cắt nhau ở ngưỡng 0,55. Ngân hàng chọn ngưỡng cao (ít chấp nhận nhầm, khách bực mình); điện thoại chọn mức giữa. Sinh trắc còn có vấn đề mà mật khẩu không có: chúng <em>không đổi được</em> khi bị sao chép (bạn không đặt lại vân tay được), chúng chụp ảnh hay lấy dấu được, và kéo theo nghĩa vụ riêng tư (sinh trắc là dữ liệu cá nhân nhạy cảm theo nhiều luật, gồm Nghị định 13/2023 của Việt Nam). Vì vậy tốt nhất dùng chúng <em>trên thiết bị</em> để mở khoá một khoá (Face ID/Touch ID mở passkey), không phải làm bí mật chung phía máy chủ.</p>
<p class="pitfall">⚠️ FAR = <em>kẻ mạo danh được chấp nhận</em> (lỗi bảo mật); FRR = <em>người thật bị từ chối</em> (lỗi dễ dùng). Sinh viên hay đảo — "chấp nhận <strong>nhầm</strong>" mới là cái nguy hiểm.</p>
<p class="meo">🧠 Hết 9.A — tự kiểm: CIA (slide 2), TCB và giám sát tham chiếu (4), miền/ma trận/ACL/C-list (5–12), BLP so với Biba (14–16), kênh ngầm (17–18), muối và băm chậm (25), hỏi–đáp (26), TOTP (27), FAR/FRR (28). Rồi bài 9.B: các cuộc tấn công.</p>`],
    ]),
    books([
      ['mos4', 'Chapter 9, sections 9.1–9.6 (pp. 593–650): the security environment, protection domains, ACLs, capabilities, formal models, covert channels, cryptography, authentication; Figures 9-1 to 9-20', 'Chương 9, mục 9.1–9.6 (tr. 593–650): môi trường bảo mật, miền bảo vệ, ACL, capability, mô hình hình thức, kênh ngầm, mật mã, xác thực; Hình 9-1 tới 9-20'],
      ['man7', 'credentials(7), capabilities(7), setuid(2), chmod(2), umask(2), flock(2), crypt(3), shadow(5), acl(5)', 'credentials(7), capabilities(7), setuid(2), chmod(2), umask(2), flock(2), crypt(3), shadow(5), acl(5)'],
      ['kernelDocs', 'Documentation/security (LSM, SELinux, Yama) and Documentation/userspace-api/seccomp_filter.rst', 'Documentation/security (LSM, SELinux, Yama) và Documentation/userspace-api/seccomp_filter.rst'],
    ]),
  ].join('\n'),
};

/* ───────── 9.B — 📑 Slide by slide · Security under attack: overflows, injection, back doors, malware, rootkits, defences (slides 29–54) ───────── */
const L_osg9_2 = {
  title: '9.B — 📑 Slide by slide · Security under attack: overflows, injection, back doors, malware, rootkits, defences (slides 29–54)|||9.B — 📑 Học theo từng slide · Bảo mật dưới tấn công: tràn, chèn lệnh, cửa hậu, mã độc, rootkit, phòng thủ (slide 29–54)',
  slug: 'osg202-slide-osg9-2',
  type: 'VIDEO',
  description: 'Giảng đủ 26 slide cuối của Chương 9: tràn bộ đệm trên chương trình đồ chơi (làm hỏng biến kế bên, canary, FORTIFY_SOURCE, ASLR, W^X), tái dùng mã (ROP), chuỗi định dạng rò ngăn xếp, chèn lệnh vào shell và vào SQL, tràn số nguyên, con trỏ treo, TOCTOU, cửa hậu, giả mạo màn hình đăng nhập, virus thực thi và virus khởi động, spyware, rootkit theo năm tầng, tường lửa, bộ quét virus theo chữ ký và kiểm tra toàn vẹn, ký mã, nhà giam chroot, phát hiện xâm nhập theo mô hình, hộp cát seccomp và bảo mật Java — mọi lỗi chỉ minh hoạ trên chương trình đồ chơi trong container, kèm cách phòng.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lesson 9.B · deck "Chapter 9 · Security", slides 29–54</span>
<h2>How software gets attacked — and how each attack is stopped</h2>
<p class="lead">Lesson 9.A built the locks. Lesson 9.B is about the ways attackers go <em>around</em> them: by feeding a program input it never expected (slides 29–33), by hiding in code you already trust (34–35), by becoming malware that copies itself (36–43), and the defences — firewalls, scanners, signing, jails, intrusion detection, sandboxes, safe languages (44–53). Two rules for this lesson. First, <strong>every demonstration is a toy program of ours, run in a throw-away container</strong>; nothing here is a tool for attacking a real system, and we show what the <em>bug</em> is and how the <em>fix</em> works, never a working exploit. Second, each bug class comes with the exact one-line cure — the skill an employer pays for.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>29–31</td><td>9.7 Buffer overflow, canaries, code reuse</td><td>explain an overflow, a canary, ASLR, NX and why return-oriented programming exists</td></tr>
<tr><td>32–33</td><td>9.7 Format strings, command injection (+ integer overflow, dangling pointers, TOCTOU)</td><td>spot the bug in a few lines of C, shell, Node or SQL and write the fix</td></tr>
<tr><td>34–35</td><td>9.8 Insider attacks</td><td>explain back doors and login spoofing and the defences against them</td></tr>
<tr><td>36–43</td><td>9.9 Malware</td><td>describe file viruses, boot-sector viruses, spyware and the five kinds of rootkit</td></tr>
<tr><td>44–50</td><td>9.9 Defences</td><td>firewalls, scanners and integrity checks, code signing, jails, intrusion detection, sandboxes</td></tr>
<tr><td>51–54</td><td>9.9 Java security</td><td>explain interpretation, the verifier, the SecurityManager's retirement and what replaced it</td></tr>
</tbody>
</table>
<div class="callout">Lesson 9.A gave the vocabulary (reference monitor, domain, capability, hash, signature); every defence here is an application of it. Related courses: <code>/courses/postgresql</code> (parameterized queries, least-privilege roles), Docker and Linux (users, capabilities, seccomp), Deploy VPS (SSH keys, firewalls).</div>`,
    `<span class="eyebrow">Chương 9 · Bài 9.B · deck "Chapter 9 · Security", slide 29–54</span>
<h2>Phần mềm bị tấn công thế nào — và mỗi cuộc tấn công bị chặn ra sao</h2>
<p class="lead">Bài 9.A dựng các ổ khoá. Bài 9.B nói về cách kẻ tấn công đi <em>vòng qua</em> chúng: đưa cho chương trình đầu vào nó không ngờ tới (slide 29–33), ẩn trong mã bạn đã tin (34–35), trở thành mã độc tự sao chép (36–43), và các phòng thủ — tường lửa, bộ quét, ký mã, nhà giam, phát hiện xâm nhập, hộp cát, ngôn ngữ an toàn (44–53). Hai luật cho bài này. Thứ nhất, <strong>mọi minh hoạ là chương trình đồ chơi của ta, chạy trong container dùng một lần</strong>; không có gì ở đây là công cụ tấn công hệ thống thật, và ta chỉ cho thấy <em>lỗi</em> là gì và <em>cách sửa</em> hoạt động ra sao, không bao giờ là một khai thác chạy được. Thứ hai, mỗi lớp lỗi đi kèm đúng liều thuốc một dòng — kỹ năng nhà tuyển dụng trả tiền.</p>
<table>
<thead><tr><th>Slide</th><th>Mục sách</th><th>Học xong bạn làm được</th></tr></thead>
<tbody>
<tr><td>29–31</td><td>9.7 Tràn bộ đệm, canary, tái dùng mã</td><td>giải thích tràn bộ đệm, canary, ASLR, NX và vì sao có lập trình hướng return</td></tr>
<tr><td>32–33</td><td>9.7 Chuỗi định dạng, chèn lệnh (+ tràn số nguyên, con trỏ treo, TOCTOU)</td><td>nhận ra lỗi trong vài dòng C, shell, Node hay SQL và viết cách sửa</td></tr>
<tr><td>34–35</td><td>9.8 Tấn công từ bên trong</td><td>giải thích cửa hậu và giả mạo màn hình đăng nhập cùng cách phòng</td></tr>
<tr><td>36–43</td><td>9.9 Mã độc</td><td>mô tả virus tệp, virus khởi động, spyware và năm loại rootkit</td></tr>
<tr><td>44–50</td><td>9.9 Phòng thủ</td><td>tường lửa, bộ quét và kiểm tra toàn vẹn, ký mã, nhà giam, phát hiện xâm nhập, hộp cát</td></tr>
<tr><td>51–54</td><td>9.9 Bảo mật Java</td><td>giải thích thông dịch, bộ kiểm chứng, việc SecurityManager nghỉ hưu và cái thay thế nó</td></tr>
</tbody>
</table>
<div class="callout">Bài 9.A cho từ vựng (giám sát tham chiếu, miền, capability, băm, chữ ký); mọi phòng thủ ở đây là một ứng dụng của nó. Khoá liên quan: <code>/courses/postgresql</code> (truy vấn tham số hoá, role quyền tối thiểu), Docker và Linux (người dùng, capability, seccomp), Deploy VPS (khoá SSH, tường lửa).</div>`),
    walkHead('osg9', 29, 54),
    walk('osg9', [
      [29, 'Buffer Overflow Attacks',
        `<p class="y-chinh">🎯 Figure 9-21: (a) while <code>main</code> runs, the stack holds main's local variables; (b) after <code>main</code> calls procedure <code>A</code>, the stack also holds <em>the return address</em> (where to resume in main) and A's locals, including buffer <code>B</code>; (c) if A copies more data into B than it holds, the extra bytes (grey) overwrite what lies <em>above</em> B — other locals, then the return address. When A returns, the CPU jumps to whatever now sits there. This is a <strong>buffer overflow</strong>: C does not check bounds.</p>
<p>A row of 16 parking spaces with cars labelled by a number plate: if you park a 20-car convoy "starting at space 1", the last four cars land in the next row — on someone else's cars. C's <code>strcpy</code>, <code>gets</code>, <code>sprintf</code> never ask how many spaces exist; they copy until a zero byte. The first, mildest effect needs no cleverness at all — it corrupts the variable <em>next door</em>. Our toy keeps a name (16 bytes) next to an <code>is_admin</code> flag:</p>
<div class="out"># Slide 29 (Figure 9-21): a buffer overflow — a TOY program of ours, compiled with and without the compiler's defences<br>
# Part 1 — the bug corrupts a neighbouring variable (no return address needed, no tricks)<br>
$ cat &gt; phien.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt; struct phien { char ten[16]; int la_admin; }; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 16-byte name, then a flag, side by side in memory<br>
&gt; int main(int argc, char **argv) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;struct phien p; p.la_admin = 0;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;strcpy(p.ten, argv[1]); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// BUG: no length check<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("name = \\"%s\\" &nbsp;&nbsp;is_admin = 0x%x\\n", p.ten, p.la_admin);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; X<br>
$ gcc -O0 -fno-stack-protector -o phien phien.c<br>
$ ./phien an<br>
name = "an" &nbsp;&nbsp;is_admin = 0x0<br>
$ ./phien AAAAAAAAAAAAAAAAAAAA<br>
name = "AAAAAAAAAAAAAAAAAAAA" &nbsp;&nbsp;is_admin = 0x41414141<br>
# the 20 letters spilled over the name into the flag: a "normal user" now has is_admin != 0<br>
# Part 2 — spilling further, over the saved return address of a function<br>
$ cat &gt; ham.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt; void nhap(const char *s) { char b[16]; strcpy(b, s); printf("copied: %s\\n", b); }<br>
&gt; int main(int argc, char **argv) { nhap(argv[1]); puts("main returned normally"); return 0; }<br>
&gt; X<br>
$ gcc -O0 -fno-stack-protector -o ham0 ham.c<br>
$ ./ham0 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA; echo "exit=$?"<br>
bash: &nbsp;&nbsp;&nbsp;36 Bus error &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./ham0 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA<br>
exit=135<br>
# now the same source with the stack protector (canary)<br>
$ gcc -O0 -fstack-protector-strong -o ham1 ham.c<br>
$ ./ham1 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA; echo "exit=$?"<br>
*** stack smashing detected ***: terminated<br>
bash: &nbsp;&nbsp;&nbsp;46 Aborted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./ham1 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA<br>
exit=134<br>
$ ./ham1 hello; echo "exit=$?"<br>
copied: hello<br>
main returned normally<br>
exit=0<br>
# and with _FORTIFY_SOURCE: the compiler knows b is 16 bytes and swaps strcpy for a checked version<br>
$ gcc -O2 -D_FORTIFY_SOURCE=2 -fno-stack-protector -o ham2 ham.c<br>
$ ./ham2 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA; echo "exit=$?"<br>
*** buffer overflow detected ***: terminated<br>
bash: &nbsp;&nbsp;&nbsp;59 Aborted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./ham2 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA<br>
exit=134</div>
<p>Part 1: <code>./phien an</code> is fine; 20 letters <code>A</code> spill over the name into the flag: <code>is_admin = 0x41414141</code> — a "normal user" is now non-zero, i.e. admin. Part 2 keeps going to the <em>return address</em> (compare Figure 9-21c): without protection the process dies when <code>nhap</code> returns (here SIGBUS, exit 135, because the CPU is told to jump to the unaligned address 0x4141…; an x86-64 machine reports SIGSEGV, exit 139). With the <strong>stack protector</strong> (<code>-fstack-protector-strong</code>) the next slide's canary notices first: <code>*** stack smashing detected ***</code>, exit 134 (SIGABRT). With <code>_FORTIFY_SOURCE=2</code> and optimisation the compiler knows <code>b</code> is 16 bytes, swaps <code>strcpy</code> for a checked copy and reports <code>buffer overflow detected</code> before any damage.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ac8f1acb6d97b7d29b3be15810c64adea5d2579b.svg" alt="Figure 9-21 as three cases: fits, overflow without canary, overflow with canary" loading="lazy" /><p class="chu-thich">🧮 Figure 9-21 as three cases: fits, overflow without canary, overflow with canary</p></div>
<p>Bytes needed to start overwriting the return address: 25 without a canary, 33 with one (the canary is in the way — and its check runs before <code>ret</code>).</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BUF = 16, CANARY = 8, FP = 8, RET = 8;      // cỡ từng ô (byte) — khung kiểu x86-64
const batDauDeRet = (coCanary) =&gt; BUF + (coCanary ? CANARY : 0) + FP;      // chỉ số byte đầu tiên chạm địa chỉ trả về</code></pre></details>
<p>⚠️ <strong>What an attacker does with it</strong> — control the return address to run code of their choice — is the reason this bug is graded critical; we deliberately stop at "the program crashes" and never build the payload. That is enough to understand the defence.</p>
<p>🧭 History and today: the 1988 Morris worm used a <code>gets()</code> overflow in <code>fingerd</code>; Heartbleed (2014) was a buffer <em>over-read</em> in OpenSSL; Linux kernel and browsers still ship such bugs yearly. The permanent fixes: <strong>memory-safe languages</strong> (Java, Go, Rust, JavaScript, Python — slide 52 shows Java throwing an exception where C overwrites), bounded functions (<code>snprintf</code>, <code>strlcpy</code>, <code>std::string</code>), and compiler/OS mitigations (slides 30–31).</p>
<p class="pitfall">⚠️ <code>gets()</code> was removed from C11 — it cannot be used safely at all. <code>strncpy</code> is <em>not</em> a safe <code>strcpy</code> (it may leave no terminating zero).</p>`,
        `<p class="y-chinh">🎯 Hình 9-21: (a) khi <code>main</code> chạy, ngăn xếp giữ biến cục bộ của main; (b) sau khi <code>main</code> gọi thủ tục <code>A</code>, ngăn xếp còn giữ <em>địa chỉ trả về</em> (chỗ tiếp tục trong main) và biến cục bộ của A, gồm bộ đệm <code>B</code>; (c) nếu A chép vào B nhiều dữ liệu hơn B chứa, các byte thừa (màu xám) đè lên cái nằm <em>phía trên</em> B — các biến cục bộ khác, rồi địa chỉ trả về. Khi A trả về, CPU nhảy tới cái đang nằm ở đó. Đó là <strong>tràn bộ đệm (buffer overflow)</strong>: C không kiểm biên.</p>
<p>Một hàng 16 chỗ đỗ xe với xe đánh số biển: nếu bạn đỗ đoàn 20 xe "bắt đầu từ chỗ 1", bốn xe cuối rơi sang hàng bên cạnh — đè lên xe người khác. <code>strcpy</code>, <code>gets</code>, <code>sprintf</code> của C không bao giờ hỏi có bao nhiêu chỗ; chúng chép tới khi gặp byte 0. Hậu quả đầu tiên, nhẹ nhất, không cần khéo léo gì — nó làm hỏng biến <em>nhà bên cạnh</em>. Đồ chơi của ta giữ một cái tên (16 byte) cạnh cờ <code>is_admin</code>:</p>
<div class="out"># Slide 29 (Hình 9-21): tràn bộ đệm — chương trình ĐỒ CHƠI của ta, biên dịch có và không có lớp phòng thủ của trình biên dịch<br>
# Phần 1 — lỗi làm hỏng biến kế bên (không cần địa chỉ trả về, không mánh khoé gì)<br>
$ cat &gt; phien.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt; struct phien { char ten[16]; int la_admin; }; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 16-byte name, then a flag, side by side in memory<br>
&gt; int main(int argc, char **argv) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;struct phien p; p.la_admin = 0;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;strcpy(p.ten, argv[1]); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// BUG: no length check<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("name = \\"%s\\" &nbsp;&nbsp;is_admin = 0x%x\\n", p.ten, p.la_admin);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; X<br>
$ gcc -O0 -fno-stack-protector -o phien phien.c<br>
$ ./phien an<br>
name = "an" &nbsp;&nbsp;is_admin = 0x0<br>
$ ./phien AAAAAAAAAAAAAAAAAAAA<br>
name = "AAAAAAAAAAAAAAAAAAAA" &nbsp;&nbsp;is_admin = 0x41414141<br>
# 20 chữ tràn khỏi tên sang cờ: "người dùng thường" giờ có is_admin != 0<br>
# Phần 2 — tràn xa hơn, qua địa chỉ trả về đã lưu của một hàm<br>
$ cat &gt; ham.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt; void nhap(const char *s) { char b[16]; strcpy(b, s); printf("copied: %s\\n", b); }<br>
&gt; int main(int argc, char **argv) { nhap(argv[1]); puts("main returned normally"); return 0; }<br>
&gt; X<br>
$ gcc -O0 -fno-stack-protector -o ham0 ham.c<br>
$ ./ham0 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA; echo "exit=$?"<br>
bash: &nbsp;&nbsp;&nbsp;36 Bus error &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./ham0 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA<br>
exit=135<br>
# giờ cùng mã nguồn với stack protector (canary)<br>
$ gcc -O0 -fstack-protector-strong -o ham1 ham.c<br>
$ ./ham1 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA; echo "exit=$?"<br>
*** stack smashing detected ***: terminated<br>
bash: &nbsp;&nbsp;&nbsp;46 Aborted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./ham1 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA<br>
exit=134<br>
$ ./ham1 hello; echo "exit=$?"<br>
copied: hello<br>
main returned normally<br>
exit=0<br>
# và với _FORTIFY_SOURCE: trình biên dịch biết b chỉ 16 byte nên đổi strcpy thành bản có kiểm<br>
$ gcc -O2 -D_FORTIFY_SOURCE=2 -fno-stack-protector -o ham2 ham.c<br>
$ ./ham2 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA; echo "exit=$?"<br>
*** buffer overflow detected ***: terminated<br>
bash: &nbsp;&nbsp;&nbsp;59 Aborted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./ham2 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA<br>
exit=134</div>
<p>Phần 1: <code>./phien an</code> bình thường; 20 chữ <code>A</code> tràn khỏi tên sang cờ: <code>is_admin = 0x41414141</code> — một "người dùng thường" giờ khác 0, tức là admin. Phần 2 đi tiếp tới <em>địa chỉ trả về</em> (so Hình 9-21c): không bảo vệ thì tiến trình chết khi <code>nhap</code> trả về (ở đây SIGBUS, exit 135, vì CPU bị bảo nhảy tới địa chỉ chưa căn lề 0x4141…; máy x86-64 báo SIGSEGV, exit 139). Với <strong>stack protector</strong> (<code>-fstack-protector-strong</code>) canary ở slide sau phát hiện trước: <code>*** stack smashing detected ***</code>, exit 134 (SIGABRT). Với <code>_FORTIFY_SOURCE=2</code> và tối ưu hoá, trình biên dịch biết <code>b</code> là 16 byte, đổi <code>strcpy</code> sang bản chép có kiểm và báo <code>buffer overflow detected</code> trước khi có hại gì.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3234db31f0d96f8a46754a2ed6673921039955d3.svg" alt="Hình 9-21 thành ba trường hợp: vừa, tràn không canary, tràn có canary" loading="lazy" /><p class="chu-thich">🧮 Hình 9-21 thành ba trường hợp: vừa, tràn không canary, tràn có canary</p></div>
<p>Số byte để bắt đầu đè địa chỉ trả về: 25 nếu không có canary, 33 nếu có (canary nằm chắn đường — và phép kiểm của nó chạy trước <code>ret</code>).</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BUF = 16, CANARY = 8, FP = 8, RET = 8;      // cỡ từng ô (byte) — khung kiểu x86-64
const batDauDeRet = (coCanary) =&gt; BUF + (coCanary ? CANARY : 0) + FP;      // chỉ số byte đầu tiên chạm địa chỉ trả về</code></pre></details>
<p>⚠️ <strong>Kẻ tấn công làm gì với nó</strong> — điều khiển địa chỉ trả về để chạy mã tuỳ ý — là lý do lỗi này được chấm mức nghiêm trọng; ta cố ý dừng ở "chương trình sập" và không bao giờ dựng tải trọng. Thế là đủ để hiểu phòng thủ.</p>
<p>🧭 Lịch sử và ngày nay: sâu Morris 1988 dùng lỗi tràn <code>gets()</code> trong <code>fingerd</code>; Heartbleed (2014) là lỗi <em>đọc</em> tràn bộ đệm trong OpenSSL; nhân Linux và trình duyệt hằng năm vẫn có lỗi như vậy. Cách sửa lâu dài: <strong>ngôn ngữ an toàn bộ nhớ</strong> (Java, Go, Rust, JavaScript, Python — slide 52 cho thấy Java ném ngoại lệ khi C ghi đè), hàm có giới hạn (<code>snprintf</code>, <code>strlcpy</code>, <code>std::string</code>), và biện pháp giảm nhẹ của trình biên dịch/HĐH (slide 30–31).</p>
<p class="pitfall">⚠️ <code>gets()</code> đã bị gỡ khỏi C11 — không dùng an toàn được chút nào. <code>strncpy</code> <em>không</em> phải <code>strcpy</code> an toàn (nó có thể không để byte 0 kết thúc).</p>`],
      [30, 'Avoiding Stack Canaries',
        `<p class="y-chinh">🎯 Figure 9-22: a function <code>A</code> that builds a log message — <code>strcpy(logMsg, date)</code>; <code>len = strlen(date)</code>; <code>gets(B)</code>; <code>strcpy(logMsg+len, B)</code>; <code>writeLog(logMsg)</code>. A <strong>stack canary</strong> is a random value the compiler puts between the locals and the return address and checks <em>before returning</em>; an overflow that tramples the return address tramples the canary too, and the program aborts instead of jumping. The slide's point: the attacker may <strong>skip the canary</strong> by first corrupting <code>len</code> so the later <code>strcpy</code> writes <em>beyond</em> the canary directly.</p>
<p>A canary in the coal mine: miners carried a bird; if the air turned bad the bird died first and warned them. The compiler's canary is a "bird" that must be intact when the function returns. Two properties make it work: it is <strong>random per process</strong> (the attacker cannot write the correct value into the overflow), and it is checked <strong>before</strong> <code>ret</code>. See both in the real code and the real source of the randomness:</p>
<div class="out"># Slide 30 (Figure 9-22): what a stack canary is, and where its random value comes from<br>
# the compiler adds a load, a store and a compare to EVERY function that has an array on its stack<br>
$ cat &gt; ham.c &lt;&lt;'X'<br>
&gt; #include &lt;string.h&gt;<br>
&gt; void nhap(const char *s) { char b[16]; strcpy(b, s); }<br>
&gt; X<br>
$ gcc -O0 -S -fstack-protector-strong -o - ham.c | grep -E 'stack_chk|^nhap:'<br>
nhap:<br>
	adrp	x0, :got:__stack_chk_guard<br>
	ldr	x0, [x0, :got_lo12:__stack_chk_guard]<br>
	adrp	x0, :got:__stack_chk_guard<br>
	ldr	x0, [x0, :got_lo12:__stack_chk_guard]<br>
	bl	__stack_chk_fail<br>
$ gcc -O0 -S -fno-stack-protector -o - ham.c | grep -c stack_chk<br>
0<br>
# the guard value is chosen at exec time: the kernel hands each new process 16 random bytes (AT_RANDOM)<br>
$ cat &gt; rnd.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;sys/auxv.h&gt;<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;unsigned char *r = (unsigned char *)getauxval(AT_RANDOM);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("AT_RANDOM bytes: ");<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;for (int i = 0; i &lt; 8; i++) printf("%02x", r[i]);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("\\n");<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; X<br>
$ gcc -O0 -o rnd rnd.c<br>
$ ./rnd; ./rnd; ./rnd<br>
AT_RANDOM bytes: 932fa3ff1db84413<br>
AT_RANDOM bytes: cafe8e53f07923e5<br>
AT_RANDOM bytes: 3427777767cbe52b<br>
# a fresh value every run: a value an attacker saw in one run tells nothing about the next</div>
<p>The assembly shows the load of <code>__stack_chk_guard</code> at function start, the second load and comparison at the end, and a call to <code>__stack_chk_fail</code> on mismatch — added only to functions with arrays (<code>-fstack-protector-strong</code>); without the flag there are 0 references. The 8 random bytes come from the kernel (<code>AT_RANDOM</code>), a fresh value every run (glibc turns it into the guard, clearing the lowest byte so a C string overflow cannot copy through it).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d0bc1ba9735fac72bc1383222bb01bb768084d4d.svg" alt="Figure 9-22: corrupt len first, then the write lands past the canary" loading="lazy" /><p class="chu-thich">🧮 Figure 9-22: corrupt len first, then the write lands past the canary</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BUF = 16, CANARY = 8, FP = 8, RET = 8;      // cỡ từng ô (byte) — khung kiểu x86-64
const batDauDeRet = (coCanary) =&gt; BUF + (coCanary ? CANARY : 0) + FP;      // chỉ số byte đầu tiên chạm địa chỉ trả về</code></pre></details>
<p>The figure's trick shows the canary protects only against <em>contiguous</em> overflows. Real compilers reduce the risk by placing arrays right next to the canary and scalars (like <code>len</code>) below them, so overflowing <code>B</code> cannot reach <code>len</code> — but the general rule stands: <strong>any length, index or pointer that can be corrupted before the check is a hole</strong>. A canary can also leak through a format-string bug (next slides) and be replayed in a forking server, where every child shares the same canary.</p>
<p class="pitfall">⚠️ A canary is a <em>detector</em>, not a cure: the program still dies (a denial of service), but the attacker no longer gets code execution. Fix the bug itself.</p>`,
        `<p class="y-chinh">🎯 Hình 9-22: hàm <code>A</code> dựng một thông điệp nhật ký — <code>strcpy(logMsg, date)</code>; <code>len = strlen(date)</code>; <code>gets(B)</code>; <code>strcpy(logMsg+len, B)</code>; <code>writeLog(logMsg)</code>. <strong>Canary ngăn xếp</strong> là một giá trị ngẫu nhiên trình biên dịch đặt giữa biến cục bộ và địa chỉ trả về và kiểm <em>trước khi trả về</em>; tràn đè địa chỉ trả về cũng đè canary, và chương trình huỷ bỏ thay vì nhảy. Ý của slide: kẻ tấn công có thể <strong>vượt canary</strong> bằng cách làm hỏng <code>len</code> trước để phép <code>strcpy</code> sau ghi <em>vượt quá</em> canary trực tiếp.</p>
<p>Chim hoàng yến trong hầm mỏ: thợ mỏ mang theo một con chim; không khí xấu đi thì chim chết trước và cảnh báo họ. Canary của trình biên dịch là "con chim" phải còn nguyên khi hàm trả về. Hai tính chất làm nó hoạt động: nó <strong>ngẫu nhiên theo tiến trình</strong> (kẻ tấn công không ghi được giá trị đúng vào chỗ tràn), và được kiểm <strong>trước</strong> <code>ret</code>. Xem cả hai trong mã thật và nguồn ngẫu nhiên thật:</p>
<div class="out"># Slide 30 (Hình 9-22): canary ngăn xếp là gì, và giá trị ngẫu nhiên của nó từ đâu ra<br>
# trình biên dịch thêm một lệnh nạp, một lệnh ghi và một phép so vào MỌI hàm có mảng trên ngăn xếp<br>
$ cat &gt; ham.c &lt;&lt;'X'<br>
&gt; #include &lt;string.h&gt;<br>
&gt; void nhap(const char *s) { char b[16]; strcpy(b, s); }<br>
&gt; X<br>
$ gcc -O0 -S -fstack-protector-strong -o - ham.c | grep -E 'stack_chk|^nhap:'<br>
nhap:<br>
	adrp	x0, :got:__stack_chk_guard<br>
	ldr	x0, [x0, :got_lo12:__stack_chk_guard]<br>
	adrp	x0, :got:__stack_chk_guard<br>
	ldr	x0, [x0, :got_lo12:__stack_chk_guard]<br>
	bl	__stack_chk_fail<br>
$ gcc -O0 -S -fno-stack-protector -o - ham.c | grep -c stack_chk<br>
0<br>
# giá trị canary chọn lúc exec: nhân đưa cho mỗi tiến trình mới 16 byte ngẫu nhiên (AT_RANDOM)<br>
$ cat &gt; rnd.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;sys/auxv.h&gt;<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;unsigned char *r = (unsigned char *)getauxval(AT_RANDOM);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("AT_RANDOM bytes: ");<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;for (int i = 0; i &lt; 8; i++) printf("%02x", r[i]);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("\\n");<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; X<br>
$ gcc -O0 -o rnd rnd.c<br>
$ ./rnd; ./rnd; ./rnd<br>
AT_RANDOM bytes: 932fa3ff1db84413<br>
AT_RANDOM bytes: cafe8e53f07923e5<br>
AT_RANDOM bytes: 3427777767cbe52b<br>
# mỗi lần chạy một giá trị mới: giá trị kẻ tấn công thấy ở lần này chẳng nói gì về lần sau</div>
<p>Hợp ngữ cho thấy việc nạp <code>__stack_chk_guard</code> ở đầu hàm, lần nạp thứ hai và phép so ở cuối, và lời gọi <code>__stack_chk_fail</code> khi lệch — chỉ thêm vào hàm có mảng (<code>-fstack-protector-strong</code>); không có cờ thì có 0 tham chiếu. 8 byte ngẫu nhiên đến từ nhân (<code>AT_RANDOM</code>), mỗi lần chạy một giá trị mới (glibc biến nó thành canary, xoá byte thấp nhất để một lỗi tràn chuỗi C không chép xuyên qua được).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1db96d3ac57b16929a402bee426db2a12540340a.svg" alt="Hình 9-22: sửa len trước, rồi lần ghi rơi vượt qua canary" loading="lazy" /><p class="chu-thich">🧮 Hình 9-22: sửa len trước, rồi lần ghi rơi vượt qua canary</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BUF = 16, CANARY = 8, FP = 8, RET = 8;      // cỡ từng ô (byte) — khung kiểu x86-64
const batDauDeRet = (coCanary) =&gt; BUF + (coCanary ? CANARY : 0) + FP;      // chỉ số byte đầu tiên chạm địa chỉ trả về</code></pre></details>
<p>Mánh của hình cho thấy canary chỉ bảo vệ trước tràn <em>liền mạch</em>. Trình biên dịch thật giảm rủi ro bằng cách đặt mảng sát canary và biến đơn (như <code>len</code>) ở dưới chúng, nên tràn <code>B</code> không với tới <code>len</code> — nhưng quy tắc chung vẫn đúng: <strong>mọi độ dài, chỉ số hay con trỏ bị làm hỏng được trước phép kiểm đều là lỗ hổng</strong>. Canary cũng có thể rò qua lỗi chuỗi định dạng (slide sau) và bị dùng lại trong máy chủ fork, nơi mọi tiến trình con chia sẻ cùng canary.</p>
<p class="pitfall">⚠️ Canary là <em>bộ phát hiện</em>, không phải thuốc chữa: chương trình vẫn chết (một dạng từ chối dịch vụ), nhưng kẻ tấn công không còn chạy được mã. Hãy sửa chính lỗi.</p>`],
      [31, 'Code Reuse Attacks',
        `<p class="y-chinh">🎯 Figure 9-23: <strong>return-oriented programming (ROP)</strong>, the book's best-known code-reuse attack. Because the stack is non-executable (NX/W^X), the attacker cannot inject code; instead the overflow fills the stack with a chain of <em>addresses of small snippets already in the program</em> — <strong>gadgets</strong>, each ending in <code>RET</code> — plus data. Each <code>RET</code> pops the next address from the stack and jumps there, so the stack <em>becomes the program</em>. The figure's gadgets: A pops a value into register 1 (and tests it), B pops into register 2, C multiplies register 1 by 4, pushes it and adds register 2.</p>
<p>Ransom-note letters cut from magazines: no new letters are written, only existing ones pasted in a chosen order. NX killed "inject my own code" so attackers switched to "reuse yours". Our toy VM below runs the figure's three gadgets as <em>pure arithmetic in a table</em> — there are no addresses, machine code or real exploit here, only the idea that data on the stack drives existing code:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1f02fdb988a9cc911998ee8a5bcc2f4c6699e21e.svg" alt="Three existing snippets chained by data on the stack compute R2 = 27 (toy VM, our reading of the figure)" loading="lazy" /><p class="chu-thich">🧮 Three existing snippets chained by data on the stack compute R2 = 27 (toy VM, our reading of the figure)</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const NGAN_XEP = ['&amp;A', 5, '&amp;B', 7, '&amp;C', 'END'];          // đỉnh ở bên trái
function chay(st) {
  st = [...st]; const R = { R1: 0, R2: 0 }; const vet = [];
  let pc = st.shift();                                      // lệnh ret đầu tiên lấy &amp;A
  while (pc !== 'END') {
    if (pc === '&amp;A') { R.R1 = st.shift(); vet.push(['A', 'pop → R1', &#96;R1=&#36;{R.R1}&#96;]); }
    else if (pc === '&amp;B') { R.R2 = st.shift(); vet.push(['B', 'pop → R2', &#96;R2=&#36;{R.R2}&#96;]); }
    else if (pc === '&amp;C') { R.R1 *= 4; st.unshift(R.R1); R.R2 += st.shift(); vet.push(['C', 'R1×4; push R1; R2+=top', &#96;R1=&#36;{R.R1}, R2=&#36;{R.R2}&#96;]); }
    pc = st.shift();                                        // ret: lấy địa chỉ kế tiếp từ ngăn xếp
  }
  return { R, vet };
}</code></pre></details>
<p>Defences — all deployed today:</p>
<ul>
<li><strong>NX / W^X</strong>: a page is writable or executable, never both. Prove it on a real kernel (the page below holds a harmless <code>ret</code> instruction): jumping into a read+write page crashes (SIGSEGV), the same bytes run after the page is made read+execute (as JIT compilers do on purpose):</li>
</ul>
<div class="out"># Slide 31: why attackers moved from "inject code" to "reuse code": the stack and heap are not executable (W^X / NX)<br>
# the program headers: GNU_STACK says RW (read+write) and no E (execute)<br>
$ readelf -lW /bin/ls | grep -E 'GNU_STACK|Type'<br>
&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Offset &nbsp;&nbsp;VirtAddr &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PhysAddr &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileSiz &nbsp;MemSiz &nbsp;&nbsp;Flg Align<br>
&nbsp;&nbsp;GNU_STACK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0x000000 0x0000000000000000 0x0000000000000000 0x000000 0x000000 RW &nbsp;0x10<br>
# a running process: [stack] and [heap] are rw-p, never "x"<br>
$ grep -E '\\[(stack|heap)\\]' /proc/self/maps | awk '{print $2, $6}'<br>
rw-p [heap]<br>
rw-p [stack]<br>
$ cat _nx.c<br>
#include &lt;stdio.h&gt;<br>
#include &lt;string.h&gt;<br>
#include &lt;sys/mman.h&gt;<br>
#if defined(__aarch64__)<br>
static const unsigned char RET[] = {0xc0, 0x03, 0x5f, 0xd6}; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// one instruction: "ret" — does nothing, harmless<br>
#else<br>
static const unsigned char RET[] = {0xc3}; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// x86-64 "ret"<br>
#endif<br>
int main(int argc, char **argv) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;unsigned char *p = mmap(NULL, 4096, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);<br>
&nbsp;&nbsp;&nbsp;&nbsp;memcpy(p, RET, sizeof RET);<br>
&nbsp;&nbsp;&nbsp;&nbsp;if (argc &gt; 1) mprotect(p, 4096, PROT_READ | PROT_EXEC); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// W^X: the page is now R-X, no longer writable<br>
&nbsp;&nbsp;&nbsp;&nbsp;puts("jumping into the data page...");<br>
&nbsp;&nbsp;&nbsp;&nbsp;fflush(stdout);<br>
&nbsp;&nbsp;&nbsp;&nbsp;((void (*)(void))p)();<br>
&nbsp;&nbsp;&nbsp;&nbsp;puts("returned: the page was executable");<br>
&nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
}<br>
# jump into a page that is READ+WRITE only: the CPU refuses to fetch an instruction from it<br>
$ /tmp/nx; echo "exit=$?"<br>
jumping into the data page...<br>
bash: &nbsp;&nbsp;&nbsp;27 Segmentation fault &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/tmp/nx<br>
exit=139<br>
# the very same bytes after the program (not the attacker) marked the page executable — as a JIT compiler does<br>
$ /tmp/nx rx; echo "exit=$?"<br>
jumping into the data page...<br>
returned: the page was executable<br>
exit=0</div>
<ul>
<li><strong>ASLR</strong> randomises where stack, heap, libraries and (for PIE binaries) the program sit, so the attacker does not know the gadget addresses (run it on the next slide).</li>
<li><strong>CFI / shadow stacks</strong>: check that every <code>RET</code> goes where the matching <code>CALL</code> came from — Intel CET shadow stack (hardware), Windows CET, ARM <em>pointer authentication (PAC)</em> and <em>branch target identification (BTI)</em> on ARM64, clang CFI.</li>
<li><strong>Fewer gadgets / safe languages</strong>, compiling with <code>-fcf-protection</code>, keeping binaries small.</li>
</ul>
<p>➕ ASLR in numbers, on the container's real kernel:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--security-opt=seccomp=unconfined</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slides 29-31: ASLR — the same program, run five times, lives at different addresses every time<br>
$ cat /proc/sys/kernel/randomize_va_space<br>
2<br>
$ ./aslr; ./aslr; ./aslr<br>
stack 0xffffe4b588ec &nbsp;heap 0xaaaae45fd2a0 &nbsp;mmap 0xffffa6ca7000 &nbsp;libc(printf) 0xffffa6b0cfe0 &nbsp;code(main) 0xaaaac0980814<br>
stack 0xffffd97440dc &nbsp;heap 0xaaaad59512a0 &nbsp;mmap 0xffffb5827000 &nbsp;libc(printf) 0xffffb568cfe0 &nbsp;code(main) 0xaaaace5f0814<br>
stack 0xffffed42ea6c &nbsp;heap 0xaaaaf246e2a0 &nbsp;mmap 0xffffb50c9000 &nbsp;libc(printf) 0xffffb4f2cfe0 &nbsp;code(main) 0xaaaadd0e0814<br>
# with randomization switched off for ONE run (personality ADDR_NO_RANDOMIZE; blocked by Docker's default filter, hence seccomp=unconfined)<br>
$ setarch -R ./aslr; setarch -R ./aslr<br>
stack 0xfffffffffb5c &nbsp;heap 0xaaaaaaac12a0 &nbsp;mmap 0xfffff7ff3000 &nbsp;libc(printf) 0xfffff7e4cfe0 &nbsp;code(main) 0xaaaaaaaa0814<br>
stack 0xfffffffffb5c &nbsp;heap 0xaaaaaaac12a0 &nbsp;mmap 0xfffff7ff3000 &nbsp;libc(printf) 0xfffff7e4cfe0 &nbsp;code(main) 0xaaaaaaaa0814</div>
<p>Five runs of the same program: the stack, heap, <code>mmap</code> area, libc and the program itself all move every time (<code>randomize_va_space = 2</code> = full). The low 12 bits of an address (here <code>fe0</code>, <code>814</code>) never change — a page is 4 KiB, ASLR moves whole pages. With randomisation switched off for one run (<code>setarch -R</code>; Docker's default filter blocks it, so this container uses <code>seccomp=unconfined</code> just for this experiment) the addresses are identical every time — which is why debuggers turn ASLR off and why a <em>leak</em> of one address (slide 32) can defeat it.</p>
<p class="pitfall">⚠️ FE-style: ASLR does <em>not</em> stop overflows; it makes the attacker's addresses wrong. NX does not stop ROP; it only stops code <em>injection</em>.</p>`,
        `<p class="y-chinh">🎯 Hình 9-23: <strong>lập trình hướng return (ROP — return-oriented programming)</strong>, tấn công tái dùng mã nổi tiếng nhất của sách. Vì ngăn xếp không thực thi được (NX/W^X), kẻ tấn công không tiêm mã được; thay vào đó chỗ tràn lấp ngăn xếp bằng một chuỗi <em>địa chỉ của các đoạn mã nhỏ đã có sẵn trong chương trình</em> — <strong>gadget</strong>, mỗi cái kết thúc bằng <code>RET</code> — cộng dữ liệu. Mỗi <code>RET</code> lấy địa chỉ kế tiếp từ ngăn xếp và nhảy tới đó, nên ngăn xếp <em>trở thành chương trình</em>. Các gadget của hình: A lấy một giá trị vào thanh ghi 1 (và kiểm tra), B lấy vào thanh ghi 2, C nhân thanh ghi 1 với 4, đẩy nó vào và cộng thanh ghi 2.</p>
<p>Thư tống tiền ghép chữ cắt từ tạp chí: không viết chữ mới, chỉ dán chữ có sẵn theo thứ tự đã chọn. NX giết "tiêm mã của tôi" nên kẻ tấn công chuyển sang "tái dùng mã của bạn". VM đồ chơi dưới đây chạy ba gadget của hình như <em>phép số học thuần trong một bảng</em> — không có địa chỉ, mã máy hay khai thác thật ở đây, chỉ có ý rằng dữ liệu trên ngăn xếp điều khiển mã có sẵn:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5b200d748ff860d528d298dac05d5be5640f3e8a.svg" alt="Ba đoạn mã có sẵn nối bằng dữ liệu trên ngăn xếp tính ra R2 = 27 (VM đồ chơi, cách đọc hình của khoá học)" loading="lazy" /><p class="chu-thich">🧮 Ba đoạn mã có sẵn nối bằng dữ liệu trên ngăn xếp tính ra R2 = 27 (VM đồ chơi, cách đọc hình của khoá học)</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const NGAN_XEP = ['&amp;A', 5, '&amp;B', 7, '&amp;C', 'END'];          // đỉnh ở bên trái
function chay(st) {
  st = [...st]; const R = { R1: 0, R2: 0 }; const vet = [];
  let pc = st.shift();                                      // lệnh ret đầu tiên lấy &amp;A
  while (pc !== 'END') {
    if (pc === '&amp;A') { R.R1 = st.shift(); vet.push(['A', 'pop → R1', &#96;R1=&#36;{R.R1}&#96;]); }
    else if (pc === '&amp;B') { R.R2 = st.shift(); vet.push(['B', 'pop → R2', &#96;R2=&#36;{R.R2}&#96;]); }
    else if (pc === '&amp;C') { R.R1 *= 4; st.unshift(R.R1); R.R2 += st.shift(); vet.push(['C', 'R1×4; push R1; R2+=top', &#96;R1=&#36;{R.R1}, R2=&#36;{R.R2}&#96;]); }
    pc = st.shift();                                        // ret: lấy địa chỉ kế tiếp từ ngăn xếp
  }
  return { R, vet };
}</code></pre></details>
<p>Các phòng thủ — đều đang được triển khai:</p>
<ul>
<li><strong>NX / W^X</strong>: một trang hoặc ghi được hoặc thực thi được, không bao giờ cả hai. Chứng minh trên nhân thật (trang dưới đây chứa một lệnh <code>ret</code> vô hại): nhảy vào trang đọc+ghi thì sập (SIGSEGV), cũng các byte đó chạy được sau khi trang được đổi thành đọc+thực thi (như trình biên dịch JIT làm có chủ ý):</li>
</ul>
<div class="out"># Slide 31: vì sao kẻ tấn công chuyển từ "tiêm mã" sang "tái dùng mã": ngăn xếp và heap không thực thi được (W^X / NX)<br>
# tiêu đề chương trình: GNU_STACK ghi RW (đọc+ghi), không có E (thực thi)<br>
$ readelf -lW /bin/ls | grep -E 'GNU_STACK|Type'<br>
&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Offset &nbsp;&nbsp;VirtAddr &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PhysAddr &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileSiz &nbsp;MemSiz &nbsp;&nbsp;Flg Align<br>
&nbsp;&nbsp;GNU_STACK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0x000000 0x0000000000000000 0x0000000000000000 0x000000 0x000000 RW &nbsp;0x10<br>
# tiến trình đang chạy: [stack] và [heap] là rw-p, không bao giờ có "x"<br>
$ grep -E '\\[(stack|heap)\\]' /proc/self/maps | awk '{print $2, $6}'<br>
rw-p [heap]<br>
rw-p [stack]<br>
$ cat _nx.c<br>
#include &lt;stdio.h&gt;<br>
#include &lt;string.h&gt;<br>
#include &lt;sys/mman.h&gt;<br>
#if defined(__aarch64__)<br>
static const unsigned char RET[] = {0xc0, 0x03, 0x5f, 0xd6}; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// one instruction: "ret" — does nothing, harmless<br>
#else<br>
static const unsigned char RET[] = {0xc3}; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// x86-64 "ret"<br>
#endif<br>
int main(int argc, char **argv) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;unsigned char *p = mmap(NULL, 4096, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);<br>
&nbsp;&nbsp;&nbsp;&nbsp;memcpy(p, RET, sizeof RET);<br>
&nbsp;&nbsp;&nbsp;&nbsp;if (argc &gt; 1) mprotect(p, 4096, PROT_READ | PROT_EXEC); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// W^X: the page is now R-X, no longer writable<br>
&nbsp;&nbsp;&nbsp;&nbsp;puts("jumping into the data page...");<br>
&nbsp;&nbsp;&nbsp;&nbsp;fflush(stdout);<br>
&nbsp;&nbsp;&nbsp;&nbsp;((void (*)(void))p)();<br>
&nbsp;&nbsp;&nbsp;&nbsp;puts("returned: the page was executable");<br>
&nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
}<br>
# nhảy vào một trang chỉ ĐỌC+GHI: CPU từ chối lấy lệnh từ đó<br>
$ /tmp/nx; echo "exit=$?"<br>
jumping into the data page...<br>
bash: &nbsp;&nbsp;&nbsp;27 Segmentation fault &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/tmp/nx<br>
exit=139<br>
# đúng những byte đó sau khi chính chương trình (không phải kẻ tấn công) đánh dấu trang là thực thi — như trình biên dịch JIT làm<br>
$ /tmp/nx rx; echo "exit=$?"<br>
jumping into the data page...<br>
returned: the page was executable<br>
exit=0</div>
<ul>
<li><strong>ASLR</strong> ngẫu nhiên hoá vị trí của ngăn xếp, heap, thư viện và (với tệp PIE) chính chương trình, nên kẻ tấn công không biết địa chỉ gadget (chạy ngay dưới).</li>
<li><strong>CFI / ngăn xếp bóng (shadow stack)</strong>: kiểm mọi <code>RET</code> đi đúng nơi <code>CALL</code> tương ứng tới — shadow stack Intel CET (phần cứng), Windows CET, <em>xác thực con trỏ (PAC)</em> và <em>nhận dạng đích nhảy (BTI)</em> của ARM64, CFI của clang.</li>
<li><strong>Ít gadget hơn / ngôn ngữ an toàn</strong>, biên dịch với <code>-fcf-protection</code>, giữ tệp nhị phân nhỏ.</li>
</ul>
<p>➕ ASLR bằng con số, trên nhân thật của container:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--security-opt=seccomp=unconfined</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 29-31: ASLR — cùng một chương trình, chạy năm lần, nằm ở địa chỉ khác nhau mỗi lần<br>
$ cat /proc/sys/kernel/randomize_va_space<br>
2<br>
$ ./aslr; ./aslr; ./aslr<br>
stack 0xffffe4b588ec &nbsp;heap 0xaaaae45fd2a0 &nbsp;mmap 0xffffa6ca7000 &nbsp;libc(printf) 0xffffa6b0cfe0 &nbsp;code(main) 0xaaaac0980814<br>
stack 0xffffd97440dc &nbsp;heap 0xaaaad59512a0 &nbsp;mmap 0xffffb5827000 &nbsp;libc(printf) 0xffffb568cfe0 &nbsp;code(main) 0xaaaace5f0814<br>
stack 0xffffed42ea6c &nbsp;heap 0xaaaaf246e2a0 &nbsp;mmap 0xffffb50c9000 &nbsp;libc(printf) 0xffffb4f2cfe0 &nbsp;code(main) 0xaaaadd0e0814<br>
# tắt ngẫu nhiên hoá cho MỘT lần chạy (personality ADDR_NO_RANDOMIZE; bộ lọc mặc định của Docker chặn, nên phải seccomp=unconfined)<br>
$ setarch -R ./aslr; setarch -R ./aslr<br>
stack 0xfffffffffb5c &nbsp;heap 0xaaaaaaac12a0 &nbsp;mmap 0xfffff7ff3000 &nbsp;libc(printf) 0xfffff7e4cfe0 &nbsp;code(main) 0xaaaaaaaa0814<br>
stack 0xfffffffffb5c &nbsp;heap 0xaaaaaaac12a0 &nbsp;mmap 0xfffff7ff3000 &nbsp;libc(printf) 0xfffff7e4cfe0 &nbsp;code(main) 0xaaaaaaaa0814</div>
<p>Năm lần chạy cùng một chương trình: ngăn xếp, heap, vùng <code>mmap</code>, libc và chính chương trình đều dịch chuyển mỗi lần (<code>randomize_va_space = 2</code> = đầy đủ). 12 bit thấp của địa chỉ (ở đây <code>fe0</code>, <code>814</code>) không bao giờ đổi — một trang là 4 KiB, ASLR dời cả trang. Khi tắt ngẫu nhiên hoá cho một lần chạy (<code>setarch -R</code>; bộ lọc mặc định của Docker chặn nên container này dùng <code>seccomp=unconfined</code> riêng cho thí nghiệm này) các địa chỉ giống hệt nhau mọi lần — đó là lý do trình gỡ lỗi tắt ASLR và vì sao <em>rò</em> một địa chỉ (slide 32) có thể đánh bại nó.</p>
<p class="pitfall">⚠️ Kiểu FE: ASLR <em>không</em> chặn tràn; nó làm địa chỉ của kẻ tấn công sai. NX không chặn ROP; nó chỉ chặn việc <em>tiêm</em> mã.</p>`],
      [32, 'Format String Attacks',
        `<p class="y-chinh">🎯 Figure 9-24: a <strong>format string attack</strong>. The bug is a single line: <code>printf(user_text)</code> instead of <code>printf("%s", user_text)</code>. Then the user's text <em>is</em> the format, and <code>%x</code> / <code>%s</code> / <code>%n</code> inside it make <code>printf</code> read (or even write!) the stack as if the caller had passed arguments. In the figure the attacker puts four address bytes at the start of the buffer, then exactly the right number of <code>%08x</code> to walk the stack up to them, so a final <code>%s</code>/<code>%n</code> acts on a chosen address.</p>
<p>A form letter "Dear %s, you owe %d" where the clerk fills in the blanks from a drawer. If the <em>customer</em> writes the letter, he can write "Dear %s %s %s %s" and the clerk keeps pulling papers out of the drawer — papers meant for other customers. <code>printf</code> cannot count the arguments it was given (the C varargs mechanism has no length), so it trusts the format. Our toy logger keeps a secret next to the call:</p>
<div class="out"># Slide 32 (Figure 9-24): format string attack — our TOY logger prints user text with printf(text) instead of printf("%s", text)<br>
$ cat &gt; nhat-ky.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; static void ghi(const char *tin_nhan) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;char bi_mat[16] = "TOKEN-9f3a7c1e"; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a secret that lives in this function's stack frame<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf(tin_nhan); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// BUG: the user's text IS the format string<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("\\n");<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;(void)bi_mat;<br>
&gt; }<br>
&gt; int main(int argc, char **argv) { ghi(argv[1]); return 0; }<br>
&gt; X<br>
# the compiler already complains (this warning is on by default in many distributions' build flags)<br>
$ gcc -O0 -Wall -Wformat-security -o nhat-ky nhat-ky.c 2&gt;&amp;1 | grep warning<br>
nhat-ky.c:4:5: warning: format not a string literal and no format arguments [-Wformat-security]<br>
$ ./nhat-ky 'hello'<br>
hello<br>
# an innocent user text; a hostile one asks printf for 16 "arguments" nobody passed — printf reads them from the stack<br>
$ ./nhat-ky '%lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx'<br>
653163376133 ffffddc05310 aaaadfe2080c ffffb11030c0 db0caffb57921979 ffffb10b2078 4554415649 ffffddc05160 aaaadfe2082c ffffddc052f8 ffffddc05eaa 66392d4e454b4f54 653163376133 ffffddc05280 ffffb0f37744 ffffddc052f8<br>
# decode the 8-byte words that look like text: bytes of "TOKEN-9f3a7c1e" appear (little-endian, so each word reads backwards)<br>
$ ./nhat-ky '%lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx' | tr ' ' '\\n' | node -e "<br>
&gt; const l=require('fs').readFileSync(0,'utf8').split('\\n').filter(Boolean);<br>
&gt; for (const w of l) { const b=Buffer.from(w.padStart(w.length+(w.length%2),'0'),'hex').reverse(); if (b.length&gt;=4 &amp;&amp; [...b].every(c=&gt;c&gt;=32&amp;&amp;c&lt;127)) console.log('word', w, '-&gt; text', JSON.stringify(b.toString())); }"<br>
word 653163376133 -&gt; text "3a7c1e"<br>
word 4554415649 -&gt; text "IVATE"<br>
word 66392d4e454b4f54 -&gt; text "TOKEN-9f"<br>
word 653163376133 -&gt; text "3a7c1e"<br>
# the fix is one word: tell printf the text is DATA, not a format<br>
$ sed -i 's/printf(tin_nhan);/printf("%s", tin_nhan);/' nhat-ky.c &amp;&amp; gcc -O0 -Wall -Wformat-security -o nhat-ky nhat-ky.c<br>
$ ./nhat-ky '%lx %lx %lx %lx'<br>
%lx %lx %lx %lx</div>
<p>Read it top to bottom: the compiler <em>already warns</em> (<code>-Wformat-security</code>); an innocent text prints as-is; a text made of <code>%lx</code> prints 16 words from the stack — pointers (stack <code>ffff…</code>, code <code>aaaa…</code>, libc) and, among them, the bytes of the secret <code>TOKEN-9f3a7c1e</code>, which the decoder shows as readable pieces (words are stored little-endian, so each reads backwards in hex). Leaked pointers are also exactly what defeats <strong>ASLR</strong> and canaries (slides 30–31): this bug turns a "random" address into a known one. The fix on the last lines: one extra argument, <code>printf("%s", text)</code>, and the same hostile text is printed literally.</p>
<p>➕ <code>%n</code> <em>writes</em> the count of characters printed so far to the address given — legitimate for counting, deadly when an attacker steers it. glibc's <code>_FORTIFY_SOURCE</code> refuses <code>%n</code> in a writable format string, and since glibc 2.38 <code>printf</code> family hardening is wider; many languages (Java, Python <code>%</code> on non-strings, Go) have no equivalent bug.</p>
<p>🧭 The same <em>family</em> appears everywhere user text is treated as a <em>template</em>: Python <code>str.format(user_text)</code> leaking object attributes, SQL strings, shell commands (next slide), server-side template injection in Jinja/Thymeleaf, and — famously — <strong>Log4Shell</strong> (December 2021, CVE-2021-44228), where user text in a log line was interpreted as a JNDI lookup. Rule: <em>data is never code</em>; give the interpreter the template and the data separately.</p>
<p class="pitfall">⚠️ Compile with <code>-Wall -Wformat-security</code> (Debian/Ubuntu enable it by default through hardening flags) and treat the warning as an error.</p>`,
        `<p class="y-chinh">🎯 Hình 9-24: <strong>tấn công chuỗi định dạng (format string)</strong>. Lỗi chỉ là một dòng: <code>printf(chu_nguoi_dung)</code> thay vì <code>printf("%s", chu_nguoi_dung)</code>. Khi đó chữ của người dùng <em>là</em> định dạng, và <code>%x</code> / <code>%s</code> / <code>%n</code> trong đó khiến <code>printf</code> đọc (thậm chí ghi!) ngăn xếp như thể bên gọi đã truyền đối số. Trong hình kẻ tấn công đặt bốn byte địa chỉ ở đầu bộ đệm, rồi đúng số <code>%08x</code> cần để đi qua ngăn xếp tới đó, để một <code>%s</code>/<code>%n</code> cuối tác động lên địa chỉ được chọn.</p>
<p>Một lá thư mẫu "Kính gửi %s, ông nợ %d" mà thư ký điền chỗ trống từ một ngăn kéo. Nếu <em>khách hàng</em> tự viết lá thư, anh ta viết được "Kính gửi %s %s %s %s" và thư ký cứ rút giấy ra khỏi ngăn kéo — giấy dành cho khách khác. <code>printf</code> không đếm được số đối số đã nhận (cơ chế varargs của C không có độ dài), nên nó tin vào định dạng. Trình ghi nhật ký đồ chơi của ta giữ một bí mật cạnh lời gọi:</p>
<div class="out"># Slide 32 (Hình 9-24): tấn công chuỗi định dạng — trình ghi nhật ký ĐỒ CHƠI của ta in chữ người dùng bằng printf(text) thay vì printf("%s", text)<br>
$ cat &gt; nhat-ky.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; static void ghi(const char *tin_nhan) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;char bi_mat[16] = "TOKEN-9f3a7c1e"; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a secret that lives in this function's stack frame<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf(tin_nhan); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// BUG: the user's text IS the format string<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("\\n");<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;(void)bi_mat;<br>
&gt; }<br>
&gt; int main(int argc, char **argv) { ghi(argv[1]); return 0; }<br>
&gt; X<br>
# trình biên dịch đã phàn nàn rồi (cảnh báo này được bật sẵn trong cờ dựng của nhiều bản phân phối)<br>
$ gcc -O0 -Wall -Wformat-security -o nhat-ky nhat-ky.c 2&gt;&amp;1 | grep warning<br>
nhat-ky.c:4:5: warning: format not a string literal and no format arguments [-Wformat-security]<br>
$ ./nhat-ky 'hello'<br>
hello<br>
# chữ vô hại; chữ thù địch bảo printf lấy 16 "đối số" không ai truyền — printf đọc chúng từ ngăn xếp<br>
$ ./nhat-ky '%lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx'<br>
653163376133 ffffddc05310 aaaadfe2080c ffffb11030c0 db0caffb57921979 ffffb10b2078 4554415649 ffffddc05160 aaaadfe2082c ffffddc052f8 ffffddc05eaa 66392d4e454b4f54 653163376133 ffffddc05280 ffffb0f37744 ffffddc052f8<br>
# giải mã các từ 8 byte trông như chữ: byte của "TOKEN-9f3a7c1e" hiện ra (little-endian nên mỗi từ đọc ngược)<br>
$ ./nhat-ky '%lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx %lx' | tr ' ' '\\n' | node -e "<br>
&gt; const l=require('fs').readFileSync(0,'utf8').split('\\n').filter(Boolean);<br>
&gt; for (const w of l) { const b=Buffer.from(w.padStart(w.length+(w.length%2),'0'),'hex').reverse(); if (b.length&gt;=4 &amp;&amp; [...b].every(c=&gt;c&gt;=32&amp;&amp;c&lt;127)) console.log('word', w, '-&gt; text', JSON.stringify(b.toString())); }"<br>
word 653163376133 -&gt; text "3a7c1e"<br>
word 4554415649 -&gt; text "IVATE"<br>
word 66392d4e454b4f54 -&gt; text "TOKEN-9f"<br>
word 653163376133 -&gt; text "3a7c1e"<br>
# cách sửa chỉ một từ: bảo printf rằng đó là DỮ LIỆU, không phải định dạng<br>
$ sed -i 's/printf(tin_nhan);/printf("%s", tin_nhan);/' nhat-ky.c &amp;&amp; gcc -O0 -Wall -Wformat-security -o nhat-ky nhat-ky.c<br>
$ ./nhat-ky '%lx %lx %lx %lx'<br>
%lx %lx %lx %lx</div>
<p>Đọc từ trên xuống: trình biên dịch <em>đã cảnh báo</em> (<code>-Wformat-security</code>); chữ vô hại được in nguyên; chữ gồm các <code>%lx</code> in 16 từ của ngăn xếp — con trỏ (ngăn xếp <code>ffff…</code>, mã <code>aaaa…</code>, libc) và, lẫn trong đó, các byte của bí mật <code>TOKEN-9f3a7c1e</code>, mà bộ giải mã hiện thành các mảnh đọc được (từ lưu little-endian nên mỗi từ đọc ngược trong hex). Con trỏ bị rò cũng chính là thứ đánh bại <strong>ASLR</strong> và canary (slide 30–31): lỗi này biến địa chỉ "ngẫu nhiên" thành địa chỉ đã biết. Cách sửa ở các dòng cuối: thêm một đối số, <code>printf("%s", chu)</code>, và cùng chữ thù địch đó được in nguyên văn.</p>
<p>➕ <code>%n</code> <em>ghi</em> số ký tự đã in tới địa chỉ cho trước — chính đáng để đếm, chết người khi kẻ tấn công lái nó. <code>_FORTIFY_SOURCE</code> của glibc từ chối <code>%n</code> trong chuỗi định dạng ghi được, và nhiều ngôn ngữ (Java, Go) không có lỗi tương đương.</p>
<p>🧭 Cùng <em>họ</em> lỗi xuất hiện ở mọi nơi chữ người dùng bị coi là <em>mẫu (template)</em>: Python <code>str.format(chu_nguoi_dung)</code> làm lộ thuộc tính đối tượng, chuỗi SQL, lệnh shell (slide sau), chèn mẫu phía máy chủ ở Jinja/Thymeleaf, và — nổi tiếng — <strong>Log4Shell</strong> (12/2021, CVE-2021-44228), nơi chữ người dùng trong một dòng nhật ký bị hiểu thành một truy vấn JNDI. Quy tắc: <em>dữ liệu không bao giờ là mã</em>; đưa cho bộ thông dịch mẫu và dữ liệu riêng biệt.</p>
<p class="pitfall">⚠️ Biên dịch với <code>-Wall -Wformat-security</code> (Debian/Ubuntu bật mặc định qua cờ làm cứng) và coi cảnh báo là lỗi.</p>`],
      [33, 'Command Injection Attacks',
        `<p class="y-chinh">🎯 Figure 9-25: a copy program builds a shell command from the user's text — <code>"cp "</code> + source + <code>" "</code> + destination — then calls <code>system(cmd)</code>. If the "file name" the user types is <code>abc; rm -rf /</code>, the shell sees <strong>two commands</strong>: the copy <em>and</em> a deletion, run with the program's privileges. <code>system()</code> hands the whole string to <code>/bin/sh</code>, and the shell treats <code>; | &amp; $( ) &#96; &gt; &lt;</code> and newlines as <em>syntax</em>, not data.</p>
<p>A restaurant order slip: "one pizza; and open the cash register". If the waiter reads the customer's words aloud to the cook <em>as instructions</em>, the customer is running the kitchen. We run the book's program (with a harmless <code>echo</code> as the second command) and then the cure — pass the arguments as an <em>array</em> to <code>exec</code>, so no shell exists to re-parse them:</p>
<div class="out"># Slide 33 (Figure 9-25): command injection — the book's copy program builds a shell command from user text<br>
$ cat &gt; sao-chep.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;stdlib.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt; int main(int argc, char **argv) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;char cmd[256] = "cp ";<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;strcat(cmd, argv[1]); strcat(cmd, " "); strcat(cmd, argv[2]); &nbsp;&nbsp;&nbsp;&nbsp;// the shell will re-parse ALL of this<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("running: %s\\n", cmd); fflush(stdout);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return system(cmd); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// system() = /bin/sh -c "..."<br>
&gt; }<br>
&gt; X<br>
$ gcc -O0 -Wall -o sao-chep sao-chep.c<br>
$ echo "noi dung" &gt; a.txt<br>
# normal use<br>
$ ./sao-chep a.txt b.txt; ls b.txt<br>
running: cp a.txt b.txt<br>
b.txt<br>
# the "file name" contains a semicolon: the shell sees TWO commands. Ours just prints a line; it could be anything the user may run<br>
$ ./sao-chep 'a.txt c.txt; echo INJECTED' d.txt<br>
running: cp a.txt c.txt; echo INJECTED d.txt<br>
INJECTED d.txt<br>
# the fix: never build a command string. Pass the arguments as an ARRAY: no shell, nothing is re-parsed<br>
$ cat &gt; sao-chep-an-toan.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;stdlib.h&gt;<br>
&gt; #include &lt;unistd.h&gt;<br>
&gt; #include &lt;sys/wait.h&gt;<br>
&gt; int main(int argc, char **argv) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;pid_t p = fork();<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;if (p == 0) { execlp("cp", "cp", "--", argv[1], argv[2], (char *)NULL); perror("exec"); _exit(127); }<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;int st; waitpid(p, &amp;st, 0);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return WEXITSTATUS(st);<br>
&gt; }<br>
&gt; X<br>
$ gcc -O0 -Wall -o sao-chep-an-toan sao-chep-an-toan.c<br>
$ ./sao-chep-an-toan 'a.txt c.txt; echo INJECTED' d.txt; echo "exit=$?"<br>
cp: cannot stat 'a.txt c.txt; echo INJECTED': No such file or directory<br>
exit=1</div>
<p>The hostile "file name" made the shell run <code>echo INJECTED</code>. The safe version uses <code>fork()</code> + <code>execlp("cp", "cp", "--", src, dst)</code>: the whole string is <em>one argument</em> to <code>cp</code>, which simply reports there is no such file. (The <code>--</code> also stops a name that starts with <code>-</code> from being read as an option — "argument injection".) The same two behaviours exist in every language:</p>
<pre><code class="language-javascript">// Slide 33 in Node: child_process.exec() runs a SHELL; execFile() does not
const { exec, execFile } = require('node:child_process');
const tenTep = 'bao-cao.pdf; echo INJECTED-BY-THE-FILENAME';      // pretend this came from an HTTP request
exec(&#96;ls &#36;{tenTep}&#96;, (err, out, errOut) =&gt; {
  console.log('exec     :', JSON.stringify(out.trim()), '|', (errOut.trim().split('\\n')[0] || '').slice(0, 55));
  execFile('ls', ['--', tenTep], (err2, out2, errOut2) =&gt; {
    console.log('execFile :', JSON.stringify(out2.trim()), '|', errOut2.trim().split('\\n')[0]);
  });
});</code></pre>
<div class="out">$ node chen-lenh-node.js<br>
exec &nbsp;&nbsp;&nbsp;&nbsp;: "INJECTED-BY-THE-FILENAME" | ls: cannot access 'bao-cao.pdf': No such file or direct<br>
execFile : "" | ls: cannot access 'bao-cao.pdf; echo INJECTED-BY-THE-FILENAME': No such file or directory</div>
<p>Node's <code>exec</code> starts a shell and ran the injected <code>echo</code>; <code>execFile</code> did not. Java: <code>Runtime.exec(String)</code> tokenises but <code>new ProcessBuilder(list)</code> is the safe form; Python: <code>subprocess.run([...])</code> not <code>shell=True</code>; Spring/Node apps shelling out to <code>ffmpeg</code>, <code>convert</code> or <code>git</code> with user-supplied names are the classic real-world case.</p>
<p>🧭 <strong>SQL injection</strong> is the same bug with a database as the interpreter — the #1 web vulnerability for two decades. Our program runs the same login query two ways against an in-memory SQLite database (built into Node 22):</p>
<pre><code class="language-javascript">// Slide 33 + backend: the same bug in SQL. node:sqlite is built into Node 22; PostgreSQL/pg and Prisma behave the same way
process.removeAllListeners('warning');                              // hide the "experimental" notice
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync(':memory:');
db.exec(&#96;CREATE TABLE users(name TEXT, pass TEXT, role TEXT);
         INSERT INTO users VALUES ('alice','s3cret','admin'), ('bob','hunter2','user');&#96;);

const dangNhapSai = (ten, mk) =&gt; db.prepare(&#96;SELECT name, role FROM users WHERE name = '&#36;{ten}' AND pass = '&#36;{mk}'&#96;).all();   // BUG: string concatenation
const dangNhapDung = (ten, mk) =&gt; db.prepare('SELECT name, role FROM users WHERE name = ? AND pass = ?').all(ten, mk);     // placeholders ?

console.log('wrong password, concatenated :', JSON.stringify(dangNhapSai('bob', 'khong-dung')));
const doc = "' OR '1'='1";
console.log('payload        :', doc);
console.log('concatenated   :', JSON.stringify(dangNhapSai('alice', doc)), ' &lt;- logged in as admin without the password');
console.log('parameterized  :', JSON.stringify(dangNhapDung('alice', doc)), ' &lt;- the payload is just a strange password');
console.log('query built    :', &#96;SELECT ... WHERE name = 'alice' AND pass = '&#36;{doc}'&#96;);</code></pre>
<div class="out">$ node sql-chen.js<br>
wrong password, concatenated : []<br>
payload &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ' OR '1'='1<br>
concatenated &nbsp;&nbsp;: [{"name":"alice","role":"admin"},{"name":"bob","role":"user"}] &nbsp;&lt;- logged in as admin without the password<br>
parameterized &nbsp;: [] &nbsp;&lt;- the payload is just a strange password<br>
query built &nbsp;&nbsp;&nbsp;: SELECT ... WHERE name = 'alice' AND pass = '' OR '1'='1'</div>
<p>The payload <code>' OR '1'='1</code> turned the query into <code>… AND pass = '' OR '1'='1'</code>, which is true for every row, so the first row (alice, admin) came back <em>without the password</em>. With a <strong>placeholder</strong> (<code>?</code>) the driver sends the SQL text and the values <em>separately</em>, and the payload is just a strange password that matches nothing. In PostgreSQL with Node's <code>pg</code> it is <code>client.query('… WHERE name = $1', [name])</code>; in Prisma use the query builder or the tagged <code>$queryRaw</code> template (never <code>$queryRawUnsafe</code> with string concatenation); in Spring use <code>PreparedStatement</code> / JPA named parameters. See the PostgreSQL course (<code>/courses/postgresql</code>) for the generic-plan and Prisma <code>$queryRaw</code> details.</p>
<p>➕ <strong>Three more bugs of the same section (book §9.7), each with its one-line cure.</strong> <em>Integer overflow</em>: a size computed in 32 bits wraps, <code>malloc</code> returns a tiny block and the copy loop believes it is big — cure: check with <code>__builtin_mul_overflow</code> or use checked arithmetic (Rust/Java <code>Math.multiplyExact</code>).</p>
<div class="out"># Slide 33 (book §9.7): integer overflow — a size computed in 32 bits wraps around, malloc gives a SMALL block, the loop thinks it is big<br>
$ cat &gt; so.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;stdint.h&gt;<br>
&gt; #include &lt;stdlib.h&gt;<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;uint32_t n = 0x40000001; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// "number of records" read from a file header — attacker's choice<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;uint32_t bytes = n * 4; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 4 bytes per record: 0x100000004 does not fit in 32 bits<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("n = %u records, n * 4 = %u bytes (should be %llu)\\n", n, bytes, (unsigned long long)n * 4);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;uint32_t kq;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;if (__builtin_mul_overflow(n, 4u, &amp;kq)) puts("__builtin_mul_overflow: OVERFLOW detected, refuse the file");<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; X<br>
$ gcc -O0 -Wall -o so so.c &amp;&amp; ./so<br>
n = 1073741825 records, n * 4 = 4 bytes (should be 4294967300)<br>
__builtin_mul_overflow: OVERFLOW detected, refuse the file<br>
# the dangling pointer and the null pointer (book §9.7): the AddressSanitizer names the bug and the line<br>
$ cat &gt; uaf.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;stdlib.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;char *p = malloc(16); strcpy(p, "session-A");<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;free(p); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// p now dangles: the block may be handed to someone else<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("%s\\n", p); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// use after free<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; X<br>
# asan = re-run if AddressSanitizer cannot place its shadow memory (rare, heavy ASLR)<br>
$ gcc -g -fsanitize=address -o uaf uaf.c &amp;&amp; asan ./uaf | grep -E 'ERROR|READ|freed by|previously allocated|uaf.c:' | sed 's/0x[0-9a-f]*/0xADDR/g' | head -8<br>
==33==ERROR: AddressSanitizer: heap-use-after-free on address 0xADDR at pc 0xADDR bp 0xADDR sp 0xADDR<br>
READ of size 2 at 0xADDR thread T0<br>
&nbsp;&nbsp;&nbsp;&nbsp;#1 0xADDR in main /w/uaf.c:7<br>
freed by thread T0 here:<br>
&nbsp;&nbsp;&nbsp;&nbsp;#1 0xADDR in main /w/uaf.c:6<br>
previously allocated by thread T0 here:<br>
&nbsp;&nbsp;&nbsp;&nbsp;#1 0xADDR in main /w/uaf.c:5</div>
<p><em>Dangling pointer</em> (use-after-free): memory is released, the pointer still points at it, the allocator hands it to someone else — the AddressSanitizer output above names the bug and the three lines involved (read, free, allocation); cure: set pointers to NULL after free, use sanitizers in CI (<code>-fsanitize=address,undefined</code>), or a language with ownership (Rust) or a garbage collector. <em>Null pointer dereference</em>: crashes the program (a denial of service) and in old kernels mapping page 0 let attackers take control; Linux now forbids mapping the low pages (<code>vm.mmap_min_addr</code>). And <strong>TOCTOU</strong> (time of check to time of use): a program checks a file (<code>access()</code>), then uses it (<code>open()</code>), and an attacker swaps the file between the two. Our toy setuid-root viewer does exactly that, in a throw-away container:</p>
<div class="out"># Slide 33 (and book §9.7): TOCTOU — time of check to time of use. A TOY setuid-root "report viewer" in a container, and its fix<br>
$ cat _doc.c<br>
// toy setuid-root "report viewer": prints a file the CALLING user is allowed to read<br>
#include &lt;stdio.h&gt;<br>
#include &lt;unistd.h&gt;<br>
#include &lt;fcntl.h&gt;<br>
int main(int argc, char **argv) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;const char *path = argv[1];<br>
&nbsp;&nbsp;&nbsp;&nbsp;if (access(path, R_OK) != 0) { puts("denied: you may not read that"); return 1; } &nbsp;&nbsp;// CHECK, uses the REAL uid<br>
&nbsp;&nbsp;&nbsp;&nbsp;usleep(300000); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// slow work / the scheduler switches away<br>
&nbsp;&nbsp;&nbsp;&nbsp;int fd = open(path, O_RDONLY); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// USE, uses the EFFECTIVE uid = root<br>
&nbsp;&nbsp;&nbsp;&nbsp;char buf[200]; ssize_t n = read(fd, buf, sizeof buf - 1); buf[n &gt; 0 ? n : 0] = 0;<br>
&nbsp;&nbsp;&nbsp;&nbsp;printf("file says: %s", buf);<br>
&nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
}<br>
$ ls -l /srv/bi-mat.txt<br>
-rw------- 1 root root 33 Oct 26 03:15 /srv/bi-mat.txt<br>
# sv cannot read the secret directly, and the viewer refuses when asked directly<br>
$ runuser -u sv -- cat /srv/bi-mat.txt<br>
cat: /srv/bi-mat.txt: Permission denied<br>
$ runuser -u sv -- doc /srv/bi-mat.txt<br>
denied: you may not read that<br>
# sv points a symbolic link at a harmless file; the viewer checks it, then sleeps 0.3 s ("slow work"); in that gap sv re-points the link<br>
$ runuser -u sv -- sh -c 'ln -sf /srv/chung/cong-khai.txt /srv/chung/lien-ket; (sleep 0.1; ln -sf /srv/bi-mat.txt /srv/chung/lien-ket) &amp; doc /srv/chung/lien-ket; wait'<br>
file says: ROOT-ONLY: db password = hunter2<br>
# the fix: drop to the CALLER's identity first, then open — the kernel's check and the use are one atomic step<br>
$ runuser -u sv -- sh -c 'ln -sf /srv/chung/cong-khai.txt /srv/chung/lien-ket; (sleep 0.1; ln -sf /srv/bi-mat.txt /srv/chung/lien-ket) &amp; doc-an-toan /srv/chung/lien-ket; wait'<br>
open: Permission denied</div>
<p>The viewer refuses the secret when asked directly, but when <code>sv</code> re-points a symbolic link in the 0.3 s gap, <code>open()</code> (now running as root) reads the root-only file. The fix is the pattern from slide 10: <em>don't check then use</em>; act with the caller's identity (<code>seteuid(getuid())</code>) and let the kernel decide once, at the <code>open</code> — the safe version prints <code>Permission denied</code> for the same trick. (Modern code can also use <code>openat2()</code> with <code>RESOLVE_NO_SYMLINKS</code>, or open first and <code>fstat</code> the descriptor.)</p>
<p class="pitfall">⚠️ <strong>Escaping is not the fix; separation is.</strong> Hand-written "remove the dangerous characters" filters always miss one. Use placeholders for SQL, argument arrays for processes, and parsers/templating engines that keep code and data apart.</p>`,
        `<p class="y-chinh">🎯 Hình 9-25: một chương trình sao chép dựng lệnh shell từ chữ người dùng — <code>"cp "</code> + nguồn + <code>" "</code> + đích — rồi gọi <code>system(cmd)</code>. Nếu "tên tệp" người dùng gõ là <code>abc; rm -rf /</code>, shell thấy <strong>hai lệnh</strong>: lệnh sao chép <em>và</em> một lệnh xoá, chạy với quyền của chương trình. <code>system()</code> đưa cả chuỗi cho <code>/bin/sh</code>, và shell coi <code>; | &amp; $( ) &#96; &gt; &lt;</code> cùng ký tự xuống dòng là <em>cú pháp</em>, không phải dữ liệu.</p>
<p>Phiếu gọi món trong nhà hàng: "một pizza; và mở két tiền". Nếu người phục vụ đọc to lời khách cho đầu bếp <em>như chỉ thị</em>, khách đang điều hành nhà bếp. Ta chạy chương trình của sách (với một lệnh <code>echo</code> vô hại làm lệnh thứ hai) rồi thuốc chữa — truyền đối số dạng <em>mảng</em> cho <code>exec</code>, để không có shell nào phân tích lại chúng:</p>
<div class="out"># Slide 33 (Hình 9-25): chèn lệnh — chương trình sao chép của sách ghép lệnh shell từ chữ người dùng<br>
$ cat &gt; sao-chep.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;stdlib.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt; int main(int argc, char **argv) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;char cmd[256] = "cp ";<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;strcat(cmd, argv[1]); strcat(cmd, " "); strcat(cmd, argv[2]); &nbsp;&nbsp;&nbsp;&nbsp;// the shell will re-parse ALL of this<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("running: %s\\n", cmd); fflush(stdout);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return system(cmd); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// system() = /bin/sh -c "..."<br>
&gt; }<br>
&gt; X<br>
$ gcc -O0 -Wall -o sao-chep sao-chep.c<br>
$ echo "noi dung" &gt; a.txt<br>
# dùng bình thường<br>
$ ./sao-chep a.txt b.txt; ls b.txt<br>
running: cp a.txt b.txt<br>
b.txt<br>
# "tên tệp" chứa dấu chấm phẩy: shell thấy HAI lệnh. Lệnh của ta chỉ in một dòng; nó có thể là bất cứ thứ gì người dùng đó chạy được<br>
$ ./sao-chep 'a.txt c.txt; echo INJECTED' d.txt<br>
running: cp a.txt c.txt; echo INJECTED d.txt<br>
INJECTED d.txt<br>
# cách sửa: đừng bao giờ ghép chuỗi lệnh. Truyền đối số dạng MẢNG: không có shell, không gì bị phân tích lại<br>
$ cat &gt; sao-chep-an-toan.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;stdlib.h&gt;<br>
&gt; #include &lt;unistd.h&gt;<br>
&gt; #include &lt;sys/wait.h&gt;<br>
&gt; int main(int argc, char **argv) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;pid_t p = fork();<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;if (p == 0) { execlp("cp", "cp", "--", argv[1], argv[2], (char *)NULL); perror("exec"); _exit(127); }<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;int st; waitpid(p, &amp;st, 0);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return WEXITSTATUS(st);<br>
&gt; }<br>
&gt; X<br>
$ gcc -O0 -Wall -o sao-chep-an-toan sao-chep-an-toan.c<br>
$ ./sao-chep-an-toan 'a.txt c.txt; echo INJECTED' d.txt; echo "exit=$?"<br>
cp: cannot stat 'a.txt c.txt; echo INJECTED': No such file or directory<br>
exit=1</div>
<p>"Tên tệp" thù địch khiến shell chạy <code>echo INJECTED</code>. Bản an toàn dùng <code>fork()</code> + <code>execlp("cp", "cp", "--", src, dst)</code>: cả chuỗi là <em>một đối số</em> của <code>cp</code>, nó chỉ báo không có tệp như vậy. (<code>--</code> cũng ngăn tên bắt đầu bằng <code>-</code> bị đọc thành tuỳ chọn — "chèn đối số".) Hai hành vi y hệt có ở mọi ngôn ngữ:</p>
<pre><code class="language-javascript">// Slide 33 trong Node: child_process.exec() chạy một SHELL; execFile() thì không
const { exec, execFile } = require('node:child_process');
const tenTep = 'bao-cao.pdf; echo INJECTED-BY-THE-FILENAME';      // giả sử nó đến từ một HTTP request
exec(&#96;ls &#36;{tenTep}&#96;, (err, out, errOut) =&gt; {
  console.log('exec     :', JSON.stringify(out.trim()), '|', (errOut.trim().split('\\n')[0] || '').slice(0, 55));
  execFile('ls', ['--', tenTep], (err2, out2, errOut2) =&gt; {
    console.log('execFile :', JSON.stringify(out2.trim()), '|', errOut2.trim().split('\\n')[0]);
  });
});</code></pre>
<div class="out">$ node chen-lenh-node.js<br>
exec &nbsp;&nbsp;&nbsp;&nbsp;: "INJECTED-BY-THE-FILENAME" | ls: cannot access 'bao-cao.pdf': No such file or direct<br>
execFile : "" | ls: cannot access 'bao-cao.pdf; echo INJECTED-BY-THE-FILENAME': No such file or directory</div>
<p><code>exec</code> của Node khởi động một shell và chạy <code>echo</code> được chèn; <code>execFile</code> thì không. Java: <code>Runtime.exec(String)</code> tách từ còn <code>new ProcessBuilder(list)</code> là dạng an toàn; Python: <code>subprocess.run([...])</code> chứ không <code>shell=True</code>; ứng dụng Spring/Node gọi <code>ffmpeg</code>, <code>convert</code> hay <code>git</code> với tên do người dùng cung cấp là trường hợp thực tế kinh điển.</p>
<p>🧭 <strong>SQL injection</strong> là cùng lỗi đó với cơ sở dữ liệu làm bộ thông dịch — lỗ hổng web số 1 suốt hai thập kỷ. Chương trình của ta chạy cùng truy vấn đăng nhập theo hai cách trên cơ sở dữ liệu SQLite trong bộ nhớ (có sẵn trong Node 22):</p>
<pre><code class="language-javascript">// Slide 33 + backend: cùng lỗi đó trong SQL. node:sqlite có sẵn trong Node 22; PostgreSQL/pg và Prisma cũng y vậy
process.removeAllListeners('warning');                              // ẩn thông báo "experimental"
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync(':memory:');
db.exec(&#96;CREATE TABLE users(name TEXT, pass TEXT, role TEXT);
         INSERT INTO users VALUES ('alice','s3cret','admin'), ('bob','hunter2','user');&#96;);

const dangNhapSai = (ten, mk) =&gt; db.prepare(&#96;SELECT name, role FROM users WHERE name = '&#36;{ten}' AND pass = '&#36;{mk}'&#96;).all();   // BUG: string concatenation
const dangNhapDung = (ten, mk) =&gt; db.prepare('SELECT name, role FROM users WHERE name = ? AND pass = ?').all(ten, mk);     // placeholders ?

console.log('wrong password, concatenated :', JSON.stringify(dangNhapSai('bob', 'khong-dung')));
const doc = "' OR '1'='1";
console.log('payload        :', doc);
console.log('concatenated   :', JSON.stringify(dangNhapSai('alice', doc)), ' &lt;- logged in as admin without the password');
console.log('parameterized  :', JSON.stringify(dangNhapDung('alice', doc)), ' &lt;- the payload is just a strange password');
console.log('query built    :', &#96;SELECT ... WHERE name = 'alice' AND pass = '&#36;{doc}'&#96;);</code></pre>
<div class="out">$ node sql-chen.js<br>
wrong password, concatenated : []<br>
payload &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ' OR '1'='1<br>
concatenated &nbsp;&nbsp;: [{"name":"alice","role":"admin"},{"name":"bob","role":"user"}] &nbsp;&lt;- logged in as admin without the password<br>
parameterized &nbsp;: [] &nbsp;&lt;- the payload is just a strange password<br>
query built &nbsp;&nbsp;&nbsp;: SELECT ... WHERE name = 'alice' AND pass = '' OR '1'='1'</div>
<p>Tải trọng <code>' OR '1'='1</code> biến truy vấn thành <code>… AND pass = '' OR '1'='1'</code>, đúng với mọi hàng, nên hàng đầu (alice, admin) trả về <em>mà không cần mật khẩu</em>. Với <strong>placeholder</strong> (<code>?</code>) driver gửi văn bản SQL và các giá trị <em>riêng biệt</em>, và tải trọng chỉ là một mật khẩu lạ chẳng khớp gì. Với PostgreSQL và <code>pg</code> của Node là <code>client.query('… WHERE name = $1', [name])</code>; trong Prisma dùng query builder hoặc mẫu gắn thẻ <code>$queryRaw</code> (không bao giờ <code>$queryRawUnsafe</code> với ghép chuỗi); trong Spring dùng <code>PreparedStatement</code> / tham số có tên của JPA. Xem khoá PostgreSQL (<code>/courses/postgresql</code>) cho chi tiết generic plan và <code>$queryRaw</code> của Prisma.</p>
<p>➕ <strong>Ba lỗi nữa của cùng mục (sách §9.7), mỗi lỗi một dòng thuốc.</strong> <em>Tràn số nguyên</em>: kích thước tính bằng 32 bit bị quay vòng, <code>malloc</code> trả khối bé xíu và vòng chép tin nó lớn — thuốc: kiểm bằng <code>__builtin_mul_overflow</code> hoặc dùng số học có kiểm (Rust/Java <code>Math.multiplyExact</code>).</p>
<div class="out"># Slide 33 (và mục 9.7 của sách): tràn số nguyên — kích thước tính bằng 32 bit bị quay vòng, malloc cho khối NHỎ, vòng lặp tưởng nó lớn<br>
$ cat &gt; so.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;stdint.h&gt;<br>
&gt; #include &lt;stdlib.h&gt;<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;uint32_t n = 0x40000001; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// "number of records" read from a file header — attacker's choice<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;uint32_t bytes = n * 4; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 4 bytes per record: 0x100000004 does not fit in 32 bits<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("n = %u records, n * 4 = %u bytes (should be %llu)\\n", n, bytes, (unsigned long long)n * 4);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;uint32_t kq;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;if (__builtin_mul_overflow(n, 4u, &amp;kq)) puts("__builtin_mul_overflow: OVERFLOW detected, refuse the file");<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; X<br>
$ gcc -O0 -Wall -o so so.c &amp;&amp; ./so<br>
n = 1073741825 records, n * 4 = 4 bytes (should be 4294967300)<br>
__builtin_mul_overflow: OVERFLOW detected, refuse the file<br>
# con trỏ treo và con trỏ null (mục 9.7): AddressSanitizer gọi tên lỗi và dòng mã<br>
$ cat &gt; uaf.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;stdlib.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;char *p = malloc(16); strcpy(p, "session-A");<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;free(p); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// p now dangles: the block may be handed to someone else<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("%s\\n", p); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// use after free<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; X<br>
# asan = chạy lại nếu AddressSanitizer không đặt được bộ nhớ bóng (hiếm, ASLR mạnh)<br>
$ gcc -g -fsanitize=address -o uaf uaf.c &amp;&amp; asan ./uaf | grep -E 'ERROR|READ|freed by|previously allocated|uaf.c:' | sed 's/0x[0-9a-f]*/0xADDR/g' | head -8<br>
==33==ERROR: AddressSanitizer: heap-use-after-free on address 0xADDR at pc 0xADDR bp 0xADDR sp 0xADDR<br>
READ of size 2 at 0xADDR thread T0<br>
&nbsp;&nbsp;&nbsp;&nbsp;#1 0xADDR in main /w/uaf.c:7<br>
freed by thread T0 here:<br>
&nbsp;&nbsp;&nbsp;&nbsp;#1 0xADDR in main /w/uaf.c:6<br>
previously allocated by thread T0 here:<br>
&nbsp;&nbsp;&nbsp;&nbsp;#1 0xADDR in main /w/uaf.c:5</div>
<p><em>Con trỏ treo</em> (use-after-free): bộ nhớ được giải phóng, con trỏ vẫn trỏ vào đó, bộ cấp phát giao nó cho người khác — output AddressSanitizer ở trên gọi tên lỗi và ba dòng liên quan (đọc, giải phóng, cấp phát); thuốc: đặt con trỏ về NULL sau free, dùng sanitizer trong CI (<code>-fsanitize=address,undefined</code>), hoặc ngôn ngữ có sở hữu (Rust) hay bộ gom rác. <em>Giải tham chiếu con trỏ null</em>: làm chương trình sập (một dạng từ chối dịch vụ) và ở nhân cũ việc ánh xạ trang 0 cho kẻ tấn công chiếm quyền; Linux nay cấm ánh xạ các trang thấp (<code>vm.mmap_min_addr</code>). Và <strong>TOCTOU</strong> (từ lúc kiểm tới lúc dùng): chương trình kiểm một tệp (<code>access()</code>), rồi dùng nó (<code>open()</code>), và kẻ tấn công tráo tệp giữa hai bước. Trình xem setuid-root đồ chơi của ta làm đúng như vậy, trong container dùng một lần:</p>
<div class="out"># Slide 33 (và mục 9.7 của sách): TOCTOU — từ lúc kiểm tới lúc dùng. Một "trình xem báo cáo" setuid-root ĐỒ CHƠI trong container, và cách sửa<br>
$ cat _doc.c<br>
// toy setuid-root "report viewer": prints a file the CALLING user is allowed to read<br>
#include &lt;stdio.h&gt;<br>
#include &lt;unistd.h&gt;<br>
#include &lt;fcntl.h&gt;<br>
int main(int argc, char **argv) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;const char *path = argv[1];<br>
&nbsp;&nbsp;&nbsp;&nbsp;if (access(path, R_OK) != 0) { puts("denied: you may not read that"); return 1; } &nbsp;&nbsp;// CHECK, uses the REAL uid<br>
&nbsp;&nbsp;&nbsp;&nbsp;usleep(300000); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// slow work / the scheduler switches away<br>
&nbsp;&nbsp;&nbsp;&nbsp;int fd = open(path, O_RDONLY); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// USE, uses the EFFECTIVE uid = root<br>
&nbsp;&nbsp;&nbsp;&nbsp;char buf[200]; ssize_t n = read(fd, buf, sizeof buf - 1); buf[n &gt; 0 ? n : 0] = 0;<br>
&nbsp;&nbsp;&nbsp;&nbsp;printf("file says: %s", buf);<br>
&nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
}<br>
$ ls -l /srv/bi-mat.txt<br>
-rw------- 1 root root 33 Oct 26 03:15 /srv/bi-mat.txt<br>
# sv không đọc thẳng được bí mật, và trình xem từ chối khi bị hỏi thẳng<br>
$ runuser -u sv -- cat /srv/bi-mat.txt<br>
cat: /srv/bi-mat.txt: Permission denied<br>
$ runuser -u sv -- doc /srv/bi-mat.txt<br>
denied: you may not read that<br>
# sv trỏ một liên kết mềm vào tệp vô hại; trình xem kiểm xong thì ngủ 0,3 s ("việc chậm"); trong khoảng đó sv trỏ lại liên kết<br>
$ runuser -u sv -- sh -c 'ln -sf /srv/chung/cong-khai.txt /srv/chung/lien-ket; (sleep 0.1; ln -sf /srv/bi-mat.txt /srv/chung/lien-ket) &amp; doc /srv/chung/lien-ket; wait'<br>
file says: ROOT-ONLY: db password = hunter2<br>
# cách sửa: hạ xuống danh tính của NGƯỜI GỌI trước, rồi mới mở — phép kiểm của nhân và việc dùng là một bước nguyên tử<br>
$ runuser -u sv -- sh -c 'ln -sf /srv/chung/cong-khai.txt /srv/chung/lien-ket; (sleep 0.1; ln -sf /srv/bi-mat.txt /srv/chung/lien-ket) &amp; doc-an-toan /srv/chung/lien-ket; wait'<br>
open: Permission denied</div>
<p>Trình xem từ chối bí mật khi bị hỏi thẳng, nhưng khi <code>sv</code> trỏ lại một liên kết mềm trong khoảng 0,3 s, <code>open()</code> (lúc này chạy bằng root) đọc tệp chỉ root đọc được. Cách sửa là mẫu của slide 10: <em>đừng kiểm rồi dùng</em>; hành động bằng danh tính người gọi (<code>seteuid(getuid())</code>) và để nhân quyết định một lần, ngay lúc <code>open</code> — bản an toàn in <code>Permission denied</code> cho cùng mánh đó. (Mã hiện đại còn dùng được <code>openat2()</code> với <code>RESOLVE_NO_SYMLINKS</code>, hoặc mở trước rồi <code>fstat</code> descriptor.)</p>
<p class="pitfall">⚠️ <strong>Thoát ký tự (escaping) không phải cách sửa; tách biệt mới là.</strong> Bộ lọc "bỏ ký tự nguy hiểm" tự viết luôn sót một cái. Dùng placeholder cho SQL, mảng đối số cho tiến trình, và bộ phân tích/công cụ mẫu giữ mã và dữ liệu tách rời.</p>`],
      [34, 'Back Doors',
        `<p class="y-chinh">🎯 Figure 9-26: (a) a normal login loop: read name, read password, <code>v = check_validity(name, password)</code>, <code>if (v) break;</code>. (b) the same loop with a <strong>back door</strong>: <code>if (v || strcmp(name, "zzzzz") == 0) break;</code> — user name "zzzzz" gets in whatever the password. This is an <strong>insider attack</strong> (the programmer is the attacker) and an example of how a tiny change hides in thousands of lines.</p>
<p>A locksmith who cuts a spare key for himself when he installs your lock. Nobody tests "what happens with the user name zzzzz?", because nobody knows it exists. We rebuild the book's two loops and look at how such a change can be <em>found</em>:</p>
<div class="out"># Slide 34 (Figure 9-26): a back door — one extra condition in the login loop. A toy, with the detection methods that work<br>
$ cat &gt; dang-nhap-v1.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt; static int hop_le(const char *ten, const char *mk) { return !strcmp(ten, "mitch") &amp;&amp; !strcmp(mk, "FooBar!-7"); }<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;char ten[32], mk[32];<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;while (1) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;printf("login: "); if (scanf("%31s", ten) != 1) { puts(""); return 1; }<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;printf("password: "); if (scanf("%31s", mk) != 1) { puts(""); return 1; }<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int v = hop_le(ten, mk);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (v) break;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;puts("INVALID LOGIN");<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;}<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;puts("welcome: starting shell");<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; X<br>
# version 2 differs by ONE condition: user name "zzzzz" always gets in (Figure 9-26b)<br>
$ sed 's/if (v) break;/if (v || strcmp(ten, "zzzzz") == 0) break;/' dang-nhap-v1.c &gt; dang-nhap-v2.c<br>
$ gcc -O0 -Wall -o v1 dang-nhap-v1.c &amp;&amp; gcc -O0 -Wall -o v2 dang-nhap-v2.c<br>
$ printf 'zzzzz\\nbat-ky\\n' | ./v1 | tail -2<br>
login: password: INVALID LOGIN<br>
login:<br>
$ printf 'zzzzz\\nbat-ky\\n' | ./v2 | tail -1<br>
login: password: welcome: starting shell<br>
# detection 1: code review / diff — the back door is one line (this works when you HAVE the source)<br>
$ diff dang-nhap-v1.c dang-nhap-v2.c<br>
10c10<br>
&lt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (v) break;<br>
---<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (v || strcmp(ten, "zzzzz") == 0) break;<br>
# detection 2: compare fingerprints of what you built with what the vendor published (reproducible builds, package signatures)<br>
$ sha256sum v1 v2 | cut -c1-16,65-<br>
fd1f89ffdc040192 &nbsp;v1<br>
7d2089564396ee28 &nbsp;v2<br>
# detection 3: the secret string is IN the binary — a quick look at its printable strings is not hopeless<br>
$ strings -n 5 v2 | grep -n -E 'zzzzz|login|INVALID'<br>
17:login:<br>
19:zzzzz<br>
20:INVALID LOGIN</div>
<p>Version 1 refuses <code>zzzzz</code>, version 2 lets it in. Three defences, in decreasing order of cost: <strong>(1) code review</strong> — the <code>diff</code> shows the extra condition in one line, which is why important code is reviewed by a second person and why "force-push to main" is forbidden; <strong>(2) fingerprints and reproducible builds</strong> — build the same source on two machines and compare hashes (different here: v1 ≠ v2), publish signed hashes; <strong>(3) a look at the binary</strong> — the secret string <code>zzzzz</code> sits in the executable and shows up in <code>strings</code>.</p>
<p>🧭 <strong>This is a real kind of attack.</strong> In March 2024 a maintainer-turned-attacker slipped a back door into <code>xz</code>/<code>liblzma</code> 5.6.0–5.6.1 (CVE-2024-3094) that targeted OpenSSH via systemd; it was caught by a Microsoft engineer who noticed that SSH logins were 500 ms slower. Ken Thompson's 1984 Turing lecture "Reflections on Trusting Trust" went further: a back door in the <em>compiler</em> that re-inserts itself when it compiles the compiler, invisible in any source code. Modern answers: reproducible builds, signed commits and releases, two-person review, minimal dependencies, SBOMs, and <code>npm ci</code> with a lockfile — the same <strong>supply-chain</strong> thinking that applies to every <code>npm install</code> you run.</p>
<p class="pitfall">⚠️ A back door is a <em>feature</em> only the attacker knows; the cure is not a smarter antivirus but a process: review, provenance, least privilege for build servers.</p>`,
        `<p class="y-chinh">🎯 Hình 9-26: (a) một vòng đăng nhập bình thường: đọc tên, đọc mật khẩu, <code>v = check_validity(name, password)</code>, <code>if (v) break;</code>. (b) cùng vòng lặp với <strong>cửa hậu</strong>: <code>if (v || strcmp(name, "zzzzz") == 0) break;</code> — tên người dùng "zzzzz" vào được bất kể mật khẩu. Đây là một <strong>tấn công từ bên trong</strong> (lập trình viên là kẻ tấn công) và là ví dụ về việc một thay đổi bé xíu ẩn trong hàng nghìn dòng.</p>
<p>Một thợ khoá tự cắt thêm chìa cho mình khi lắp ổ khoá nhà bạn. Không ai thử "chuyện gì xảy ra với tên zzzzz?" vì không ai biết nó tồn tại. Ta dựng lại hai vòng lặp của sách và xem một thay đổi như vậy <em>tìm ra</em> thế nào:</p>
<div class="out"># Slide 34 (Hình 9-26): cửa hậu — thêm một điều kiện trong vòng đăng nhập. Một chương trình đồ chơi, cùng các cách phát hiện thật sự hiệu quả<br>
$ cat &gt; dang-nhap-v1.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt; static int hop_le(const char *ten, const char *mk) { return !strcmp(ten, "mitch") &amp;&amp; !strcmp(mk, "FooBar!-7"); }<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;char ten[32], mk[32];<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;while (1) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;printf("login: "); if (scanf("%31s", ten) != 1) { puts(""); return 1; }<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;printf("password: "); if (scanf("%31s", mk) != 1) { puts(""); return 1; }<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int v = hop_le(ten, mk);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (v) break;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;puts("INVALID LOGIN");<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;}<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;puts("welcome: starting shell");<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; X<br>
# bản 2 khác đúng MỘT điều kiện: tên "zzzzz" luôn được vào (Hình 9-26b)<br>
$ sed 's/if (v) break;/if (v || strcmp(ten, "zzzzz") == 0) break;/' dang-nhap-v1.c &gt; dang-nhap-v2.c<br>
$ gcc -O0 -Wall -o v1 dang-nhap-v1.c &amp;&amp; gcc -O0 -Wall -o v2 dang-nhap-v2.c<br>
$ printf 'zzzzz\\nbat-ky\\n' | ./v1 | tail -2<br>
login: password: INVALID LOGIN<br>
login:<br>
$ printf 'zzzzz\\nbat-ky\\n' | ./v2 | tail -1<br>
login: password: welcome: starting shell<br>
# phát hiện 1: rà mã / diff — cửa hậu chỉ là một dòng (dùng được khi bạn CÓ mã nguồn)<br>
$ diff dang-nhap-v1.c dang-nhap-v2.c<br>
10c10<br>
&lt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (v) break;<br>
---<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (v || strcmp(ten, "zzzzz") == 0) break;<br>
# phát hiện 2: so dấu vân tay của bản bạn dựng với bản nhà cung cấp công bố (dựng tái lập, chữ ký gói)<br>
$ sha256sum v1 v2 | cut -c1-16,65-<br>
fd1f89ffdc040192 &nbsp;v1<br>
7d2089564396ee28 &nbsp;v2<br>
# phát hiện 3: chuỗi bí mật nằm TRONG tệp nhị phân — nhìn nhanh các chuỗi in được không phải vô vọng<br>
$ strings -n 5 v2 | grep -n -E 'zzzzz|login|INVALID'<br>
17:login:<br>
19:zzzzz<br>
20:INVALID LOGIN</div>
<p>Bản 1 từ chối <code>zzzzz</code>, bản 2 cho vào. Ba phòng thủ, theo thứ tự chi phí giảm dần: <strong>(1) rà soát mã</strong> — <code>diff</code> cho thấy điều kiện thừa trong một dòng, đó là lý do mã quan trọng được người thứ hai xem và vì sao "force-push lên main" bị cấm; <strong>(2) dấu vân tay và bản dựng tái lập</strong> — dựng cùng mã nguồn trên hai máy và so băm (ở đây khác nhau: v1 ≠ v2), công bố băm đã ký; <strong>(3) nhìn vào tệp nhị phân</strong> — chuỗi bí mật <code>zzzzz</code> nằm trong tệp thực thi và hiện ra trong <code>strings</code>.</p>
<p>🧭 <strong>Đây là một loại tấn công có thật.</strong> Tháng 3/2024 một người bảo trì biến thành kẻ tấn công cài cửa hậu vào <code>xz</code>/<code>liblzma</code> 5.6.0–5.6.1 (CVE-2024-3094) nhắm vào OpenSSH qua systemd; nó bị một kỹ sư Microsoft phát hiện vì nhận ra đăng nhập SSH chậm hơn 500 ms. Bài giảng Turing 1984 của Ken Thompson "Reflections on Trusting Trust" đi xa hơn: cửa hậu trong <em>trình biên dịch</em> tự chèn lại khi nó biên dịch chính trình biên dịch, vô hình trong mọi mã nguồn. Câu trả lời hiện đại: bản dựng tái lập, commit và bản phát hành có ký, rà soát hai người, ít phụ thuộc, SBOM, và <code>npm ci</code> với lockfile — cùng tư duy <strong>chuỗi cung ứng (supply chain)</strong> áp dụng cho mọi lần <code>npm install</code> bạn chạy.</p>
<p class="pitfall">⚠️ Cửa hậu là một <em>tính năng</em> chỉ kẻ tấn công biết; thuốc chữa không phải phần mềm diệt virus khôn hơn mà là quy trình: rà soát, nguồn gốc, quyền tối thiểu cho máy chủ dựng.</p>`],
      [35, 'Login Spoofing',
        `<p class="y-chinh">🎯 Figure 9-27: (a) the <strong>real login screen</strong>; (b) a <strong>phony login screen</strong> that looks identical. The user types name and password, the fake program stores them, prints "login incorrect" and then starts the real login — the user thinks they mistyped and tries again, never knowing they gave the password away. It is an <em>insider</em> or malware trick that needs no overflow at all.</p>
<p>The ATM with a card skimmer: the machine looks real, the slot is fake. The defence is a rule that a fake <em>cannot imitate</em>: the real system makes you press a key combination that only the OS can receive — <strong>Ctrl+Alt+Del</strong> on Windows (the "secure attention key"); Linux has the SAK, Alt+SysRq+K, which kills every process on the console before login. A user program cannot catch that key, so the screen that follows is the real one. Other defences: show the <em>last login</em> time and count of failures (users notice "login at 3 a.m."), log out the console automatically, and — crucially for the web — <strong>phishing is the same trick on a website</strong>.</p>
<p>The cure for web phishing is the one from slide 26: bind the secret to the <em>origin</em>. A password typed into a look-alike domain is a gift; a passkey simply does not answer a site whose address is wrong. Meanwhile train the eye to read the <em>domain</em> in the address bar, not the page content, and use a password manager — it refuses to auto-fill on an unfamiliar domain, a free phishing alarm.</p>
<p>🧭 On a real server: SSH shows the key fingerprint the first time you connect and warns if it changes (<code>REMOTE HOST IDENTIFICATION HAS CHANGED</code>) — that is the same defence for "is this the real machine?" — don't hit "yes" blindly and don't delete <code>known_hosts</code> to silence it.</p>
<p class="pitfall">⚠️ Spoofing attacks the <em>user's trust</em>, not the OS's code — so the fix must give the user something unforgeable to check (a key combination, an origin-bound credential), not a nicer-looking screen.</p>`,
        `<p class="y-chinh">🎯 Hình 9-27: (a) <strong>màn hình đăng nhập thật</strong>; (b) <strong>màn hình đăng nhập giả</strong> trông giống hệt. Người dùng gõ tên và mật khẩu, chương trình giả lưu chúng, in "login incorrect" rồi khởi động chương trình đăng nhập thật — người dùng tưởng gõ nhầm và thử lại, không biết mình đã trao mật khẩu. Đó là mánh của kẻ trong cuộc hoặc mã độc, không cần tràn gì cả.</p>
<p>Máy ATM có thiết bị đọc trộm thẻ: máy trông thật, khe cắm là giả. Phòng thủ là một quy tắc mà đồ giả <em>không bắt chước được</em>: hệ thống thật bắt bạn bấm một tổ hợp phím chỉ HĐH nhận được — <strong>Ctrl+Alt+Del</strong> trên Windows ("secure attention key"); Linux có SAK, Alt+SysRq+K, giết mọi tiến trình trên bảng điều khiển trước khi đăng nhập. Chương trình người dùng không bắt được phím này, nên màn hình hiện sau đó là thật. Các phòng thủ khác: hiện thời điểm <em>đăng nhập lần trước</em> và số lần thất bại (người dùng nhận ra "đăng nhập lúc 3 giờ sáng"), tự đăng xuất bảng điều khiển, và — then chốt cho web — <strong>lừa đảo (phishing) là cùng mánh trên một website</strong>.</p>
<p>Thuốc chữa phishing web là cái ở slide 26: ràng buộc bí mật với <em>nguồn gốc (origin)</em>. Mật khẩu gõ vào tên miền nhái là món quà; passkey đơn giản là không trả lời trang có địa chỉ sai. Trong lúc đó tập cho mắt đọc <em>tên miền</em> trên thanh địa chỉ, không phải nội dung trang, và dùng trình quản lý mật khẩu — nó từ chối tự điền ở tên miền lạ, một chuông báo phishing miễn phí.</p>
<p>🧭 Trên server thật: SSH hiện dấu vân tay khoá lần đầu bạn kết nối và cảnh báo nếu nó đổi (<code>REMOTE HOST IDENTIFICATION HAS CHANGED</code>) — đó là cùng phòng thủ cho "đây có phải máy thật không?" — đừng gõ "yes" mù quáng và đừng xoá <code>known_hosts</code> để làm im cảnh báo.</p>
<p class="pitfall">⚠️ Giả mạo tấn công vào <em>niềm tin của người dùng</em>, không phải mã của HĐH — nên cách sửa phải cho người dùng thứ không giả được để kiểm (một tổ hợp phím, một thông tin xác thực gắn với nguồn gốc), không phải màn hình đẹp hơn.</p>`],
      [36, 'Executable Program Viruses (1)',
        `<p class="y-chinh">🎯 Figure 9-28 (first half): the book's pseudo-virus finds executable files on a UNIX system by a <strong>recursive directory walk</strong> — <code>search(dir_name)</code> opens the directory (<code>opendir</code>), reads each entry (<code>readdir</code>), skips <code>.</code>, <code>..</code> and symbolic links (<code>lstat</code>), recurses into sub-directories (<code>chdir</code> succeeds ⇒ it is a directory), and for each file that is executable (<code>access(name, X_OK) == 0</code>) calls <code>infect()</code>. A <strong>virus</strong> is code that copies itself into other programs and runs when the host runs; a <strong>worm</strong> spreads over the network by itself.</p>
<p>Biology fits: a virus cannot live alone, it needs a host cell. A file virus is useless unless somebody <em>runs</em> an infected program, so it spreads by sharing — floppy disks once, e-mail attachments, cracked software, <code>curl | sh</code> installers today. Everything in the book's procedure is an ordinary system call; <strong>there is nothing "evil" in the API</strong> — which is why scanners look for patterns and behaviour instead.</p>
<p>The book deliberately shows the <em>search</em> half only (finding files) to explain the shape; we will not build the other half. What we <em>can</em> safely show is what infection <strong>looks like to a defender</strong>: a harmless marker line appended to text "programs" — the file grows, its hash changes, a signature scanner finds the marker it knows. Slides 45–46 run that experiment.</p>
<p>➕ Why Unix viruses are rarer than Windows ones: users do not run as the owner of system programs (slide 5), executables are not world-writable, packages are signed and come from repositories, not from random sites — <strong>least privilege and signed provenance are anti-virus design</strong>. Linux malware today is mostly <em>not</em> file viruses but compromised servers running crypto-miners, botnet clients (Mirai-style) or ransomware, entering through weak passwords, exposed admin ports and vulnerable web apps.</p>
<p class="pitfall">⚠️ Virus (needs a host and a human to run it) ≠ worm (self-propagating over a network) ≠ trojan (looks useful, does harm) ≠ ransomware (encrypts your data for money). FE-style definitions.</p>`,
        `<p class="y-chinh">🎯 Hình 9-28 (nửa đầu): giả-virus của sách tìm tệp thực thi trên hệ UNIX bằng <strong>duyệt thư mục đệ quy</strong> — <code>search(dir_name)</code> mở thư mục (<code>opendir</code>), đọc từng mục (<code>readdir</code>), bỏ qua <code>.</code>, <code>..</code> và liên kết mềm (<code>lstat</code>), đệ quy vào thư mục con (<code>chdir</code> thành công ⇒ là thư mục), và với mỗi tệp thực thi được (<code>access(name, X_OK) == 0</code>) gọi <code>infect()</code>. <strong>Virus</strong> là mã tự chép vào chương trình khác và chạy khi vật chủ chạy; <strong>sâu (worm)</strong> tự lây qua mạng.</p>
<p>Sinh học khớp: virus không sống một mình, cần tế bào chủ. Virus tệp vô dụng trừ khi ai đó <em>chạy</em> chương trình nhiễm, nên nó lây qua chia sẻ — đĩa mềm ngày xưa, tệp đính kèm e-mail, phần mềm crack, trình cài <code>curl | sh</code> ngày nay. Mọi thứ trong thủ tục của sách là lời gọi hệ thống bình thường; <strong>không có gì "xấu" trong API</strong> — vì thế bộ quét tìm khuôn mẫu và hành vi thay vì tìm lời gọi.</p>
<p>Sách cố ý chỉ cho xem nửa <em>tìm kiếm</em> (tìm tệp) để giải thích hình dạng; ta sẽ không dựng nửa còn lại. Cái ta <em>có thể</em> cho xem an toàn là việc nhiễm <strong>trông thế nào với người phòng thủ</strong>: một dòng đánh dấu vô hại nối vào các "chương trình" văn bản — tệp phình ra, băm đổi, bộ quét chữ ký thấy dấu hiệu nó biết. Slide 45–46 chạy thí nghiệm đó.</p>
<p>➕ Vì sao virus Unix hiếm hơn Windows: người dùng không chạy với tư cách chủ của chương trình hệ thống (slide 5), tệp thực thi không ghi được bởi mọi người, gói được ký và đến từ kho chứ không từ trang ngẫu nhiên — <strong>quyền tối thiểu và nguồn gốc có ký chính là thiết kế chống virus</strong>. Mã độc Linux ngày nay chủ yếu <em>không</em> phải virus tệp mà là máy chủ bị chiếm chạy đào tiền ảo, máy khách botnet (kiểu Mirai) hoặc ransomware, vào qua mật khẩu yếu, cổng quản trị lộ ra ngoài và ứng dụng web có lỗ hổng.</p>
<p class="pitfall">⚠️ Virus (cần vật chủ và người chạy nó) ≠ sâu (tự lây qua mạng) ≠ trojan (trông có ích, gây hại) ≠ ransomware (mã hoá dữ liệu của bạn để đòi tiền). Định nghĩa kiểu FE.</p>`],
      [37, 'Executable Program Viruses (2)',
        `<p class="y-chinh">🎯 Figure 9-28 (second half): the rest of the recursive procedure — after the file loop, <code>closedir(dirp)</code> closes the directory; for each entry the code tests <code>chdir(dp-&gt;d_name) == 0</code> to decide "directory ⇒ <code>search(".")</code> recursively, else ⇒ if <code>access(dp-&gt;d_name, X_OK) == 0</code>, call <code>infect(dp-&gt;d_name)</code>". It is a depth-first walk of the whole file system, the same pattern as <code>find /</code>.</p>
<p>Two points matter for a defender. <strong>(1)</strong> The walk touches thousands of files in a few seconds — an unusual <em>behaviour</em> that an endpoint detector (EDR) can notice. <strong>(2)</strong> It can only infect what the <em>current user may write</em> (<code>access</code> and <code>open(O_WRONLY)</code> obey slide 5's domains). Run as an ordinary user and it reaches that user's files; run as root and it reaches everything — the cost of casual root use.</p>
<p>See the "reach" of a user with a plain <code>find</code> — the same walk, but harmless, listing which programs the user <em>could</em> modify (none of the system's, as expected):</p>
<div class="out"># Slide 37: the reach of a user = the executables it may WRITE (what a file virus could modify). A harmless audit, not an infection<br>
# executables that user sv may write, anywhere on this file system<br>
$ runuser -u sv -- find / -xdev -type f -perm /111 -writable 2&gt;/dev/null<br>
/home/sv/cua-toi.sh<br>
# how many regular executable files exist at all (the count root could reach)<br>
$ find / -xdev -type f -perm /111 2&gt;/dev/null | wc -l<br>
943</div>
<p>User <code>sv</code> can write exactly <strong>one</strong> executable (its own script in its home); the image holds <strong>943</strong> executable files that root could modify. <strong>Least privilege shrinks the blast radius of any infection</strong> — the principle behind running services as dedicated users, containers as non-root, and CI jobs with read-only tokens.</p>
<p class="meo">🧠 Remember: a program can only damage what its <em>domain</em> (slide 5) allows. Reading slides 36–37 as "the virus needs a domain with write access to executables" explains most of the defences.</p>`,
        `<p class="y-chinh">🎯 Hình 9-28 (nửa sau): phần còn lại của thủ tục đệ quy — sau vòng lặp tệp, <code>closedir(dirp)</code> đóng thư mục; với mỗi mục mã thử <code>chdir(dp-&gt;d_name) == 0</code> để quyết "thư mục ⇒ <code>search(".")</code> đệ quy, nếu không ⇒ nếu <code>access(dp-&gt;d_name, X_OK) == 0</code> thì gọi <code>infect(dp-&gt;d_name)</code>". Đó là duyệt theo chiều sâu toàn hệ thống tệp, cùng khuôn với <code>find /</code>.</p>
<p>Hai điểm quan trọng với người phòng thủ. <strong>(1)</strong> Việc duyệt đụng hàng nghìn tệp trong vài giây — một <em>hành vi</em> bất thường mà bộ phát hiện đầu cuối (EDR) có thể nhận ra. <strong>(2)</strong> Nó chỉ nhiễm được cái <em>người dùng hiện tại ghi được</em> (<code>access</code> và <code>open(O_WRONLY)</code> tuân theo miền ở slide 5). Chạy bằng người dùng thường thì tới được tệp của người đó; chạy bằng root thì tới mọi thứ — cái giá của việc dùng root tuỳ tiện.</p>
<p>Xem "tầm với" của một người dùng bằng một lệnh <code>find</code> trơn — cùng cuộc duyệt nhưng vô hại, liệt kê chương trình người dùng <em>có thể</em> sửa (không cái nào của hệ thống, như mong đợi):</p>
<div class="out"># Slide 37: tầm với của một người dùng = tệp thực thi nó được GHI (thứ virus tệp có thể sửa). Một lần kiểm toán vô hại, không phải lây nhiễm<br>
# tệp thực thi mà người dùng sv ghi được, ở bất cứ đâu trên hệ thống tệp này<br>
$ runuser -u sv -- find / -xdev -type f -perm /111 -writable 2&gt;/dev/null<br>
/home/sv/cua-toi.sh<br>
# có bao nhiêu tệp thực thi thường tồn tại (số mà root với tới được)<br>
$ find / -xdev -type f -perm /111 2&gt;/dev/null | wc -l<br>
943</div>
<p>Người dùng <code>sv</code> ghi được đúng <strong>một</strong> tệp thực thi (script riêng trong thư mục của nó); ảnh có <strong>943</strong> tệp thực thi mà root sửa được. <strong>Quyền tối thiểu thu nhỏ bán kính thiệt hại của mọi nhiễm</strong> — nguyên tắc đứng sau việc chạy dịch vụ bằng người dùng riêng, container không phải root, và job CI với token chỉ đọc.</p>
<p class="meo">🧠 Nhớ: một chương trình chỉ gây hại được cho cái <em>miền</em> (slide 5) của nó cho phép. Đọc slide 36–37 như "virus cần một miền có quyền ghi vào tệp thực thi" giải thích hầu hết các phòng thủ.</p>`],
      [38, 'Executable Program Viruses (3)',
        `<p class="y-chinh">🎯 Figure 9-29: where a virus can sit inside an executable — (a) the clean program: header, then code, with the <em>starting address</em> in the header; (b) the virus <strong>appended at the end</strong>, with the starting address in the header changed to point at it; (c) the virus placed at the <strong>front</strong> and the file shifted down; (d) the virus <strong>spread over free space</strong> inside the program (the "cavity" virus: the file size stays the same), with a chain of jumps linking the pieces. In every case the virus runs first, then hands control to the original program so the user notices nothing.</p>
<p>A parasite wasp lays its egg in a caterpillar that keeps walking and eating — the host still "works", which is how the infection survives. For the defender, <strong>each placement leaves a different trace</strong>: (b) and (c) make the file <em>longer</em> and change the entry point; (d) keeps the length but changes bytes and often makes the entry point or section layout odd. All three change the file's <strong>hash</strong> — which is the key to the most robust defence (integrity checking, slide 45).</p>
<p>Run the safe equivalent — a text "program" that grows by a marker line — and watch the three traces:</p>
<div class="out"># Slides 36-38 and 45-46: infection grows a file; scanners match signatures; integrity checking catches what signatures miss. NO malware here: the "infection" is a harmless marker line appended to a text file<br>
$ mkdir -p /tmp/may &amp;&amp; cd /tmp/may<br>
$ for i in 1 2 3; do printf '#!/bin/sh\\necho hello from tool %s\\n' $i &gt; tool$i.sh; done<br>
# step 1 — the administrator records a fingerprint of every program while the system is known to be clean (this is what AIDE/Tripwire do)<br>
$ sha256sum tool*.sh &gt; sach.sha256; ls -l tool*.sh | awk '{print $5, $9}'<br>
33 tool1.sh<br>
33 tool2.sh<br>
33 tool3.sh<br>
# step 2 — "infection": the file grows by a marker line (Figure 9-33b: an infected program is LONGER)<br>
$ echo '# CTW-TEST-MARKER-0001 (harmless test marker)' &gt;&gt; tool2.sh<br>
$ ls -l tool*.sh | awk '{print $5, $9}'<br>
33 tool1.sh<br>
79 tool2.sh<br>
33 tool3.sh<br>
# a SIGNATURE scanner looks for known bytes: it finds the marker it knows<br>
$ grep -l 'CTW-TEST-MARKER-0001' tool*.sh<br>
tool2.sh<br>
# an INTEGRITY checker does not need to know the marker at all<br>
$ sha256sum -c sach.sha256 2&gt;&amp;1 | grep -v ': OK'<br>
tool2.sh: FAILED<br>
sha256sum: WARNING: 1 computed checksum did NOT match<br>
# step 3 — a "new variant": same effect, different bytes (Figure 9-34's idea). The signature scanner is blind, the integrity checker is not<br>
$ printf '#!/bin/sh\\necho hello from tool 3\\n' &gt; tool3.sh; echo '# ctw-test-marker-0002' &gt;&gt; tool3.sh<br>
$ grep -l 'CTW-TEST-MARKER-0001' tool*.sh<br>
tool2.sh<br>
$ sha256sum -c sach.sha256 2&gt;&amp;1 | grep -v ': OK'<br>
tool2.sh: FAILED<br>
tool3.sh: FAILED<br>
sha256sum: WARNING: 2 computed checksums did NOT match<br>
# the same idea for a whole operating system: dpkg keeps the checksum of every file of every package<br>
$ dpkg -V coreutils; echo "dpkg -V: no output above = every file of coreutils is exactly as packaged"<br>
dpkg -V: no output above = every file of coreutils is exactly as packaged<br>
$ echo '# tampered' &gt;&gt; /bin/true<br>
$ dpkg -V coreutils<br>
??5?????? &nbsp;&nbsp;/bin/true</div>
<p>Read the first half: the files start at 33 bytes each; after the marker was appended <code>tool2.sh</code> is 79 bytes (the "file is longer" trace of Figure 9-33b), its sha256 no longer matches the clean record (<code>FAILED</code>), and a scanner that knows the marker finds exactly that file. The second half (slides 45–46) shows what a <em>new variant</em> does to the signature scanner, and then how <code>dpkg -V</code> checks every program of an installed operating system.</p>
<p class="pitfall">⚠️ A "cavity" virus (d) beats the "file got longer" check, but not a hash. Always prefer <em>cryptographic fingerprints</em> over size and date, which a virus can set back (touch).</p>`,
        `<p class="y-chinh">🎯 Hình 9-29: vị trí virus có thể ngồi trong tệp thực thi — (a) chương trình sạch: tiêu đề, rồi mã, với <em>địa chỉ bắt đầu</em> trong tiêu đề; (b) virus <strong>nối ở cuối</strong> và địa chỉ bắt đầu trong tiêu đề bị đổi để trỏ tới nó; (c) virus đặt ở <strong>đầu</strong> và tệp bị dịch xuống; (d) virus <strong>rải vào chỗ trống</strong> trong chương trình (virus "khoang": kích thước tệp giữ nguyên), với một chuỗi lệnh nhảy nối các mảnh. Trong mọi trường hợp virus chạy trước, rồi trao quyền cho chương trình gốc để người dùng không nhận ra gì.</p>
<p>Ong bắp cày đẻ trứng vào con sâu vẫn đi và ăn — vật chủ vẫn "làm việc", nhờ đó nhiễm sống sót. Với người phòng thủ, <strong>mỗi kiểu đặt để lại vết khác nhau</strong>: (b) và (c) làm tệp <em>dài hơn</em> và đổi điểm vào; (d) giữ độ dài nhưng đổi byte và thường làm điểm vào hay bố cục phần trở nên lạ. Cả ba đều đổi <strong>băm</strong> của tệp — chìa khoá của phòng thủ bền vững nhất (kiểm tra toàn vẹn, slide 45).</p>
<p>Chạy bản tương đương an toàn — một "chương trình" văn bản dài thêm một dòng đánh dấu — và xem ba vết:</p>
<div class="out"># Slide 36-38 và 45-46: lây nhiễm làm tệp phình ra; bộ quét so chữ ký; kiểm tra toàn vẹn bắt cái chữ ký bỏ lọt. KHÔNG có mã độc: "lây nhiễm" chỉ là một dòng đánh dấu vô hại nối vào tệp văn bản<br>
$ mkdir -p /tmp/may &amp;&amp; cd /tmp/may<br>
$ for i in 1 2 3; do printf '#!/bin/sh\\necho hello from tool %s\\n' $i &gt; tool$i.sh; done<br>
# bước 1 — quản trị viên ghi dấu vân tay của mọi chương trình khi hệ thống còn sạch (AIDE/Tripwire làm đúng việc này)<br>
$ sha256sum tool*.sh &gt; sach.sha256; ls -l tool*.sh | awk '{print $5, $9}'<br>
33 tool1.sh<br>
33 tool2.sh<br>
33 tool3.sh<br>
# bước 2 — "lây nhiễm": tệp dài thêm một dòng đánh dấu (Hình 9-33b: chương trình bị nhiễm DÀI hơn)<br>
$ echo '# CTW-TEST-MARKER-0001 (harmless test marker)' &gt;&gt; tool2.sh<br>
$ ls -l tool*.sh | awk '{print $5, $9}'<br>
33 tool1.sh<br>
79 tool2.sh<br>
33 tool3.sh<br>
# bộ quét CHỮ KÝ tìm các byte đã biết: nó thấy dấu hiệu mà nó biết<br>
$ grep -l 'CTW-TEST-MARKER-0001' tool*.sh<br>
tool2.sh<br>
# bộ kiểm TOÀN VẸN không cần biết dấu hiệu gì cả<br>
$ sha256sum -c sach.sha256 2&gt;&amp;1 | grep -v ': OK'<br>
tool2.sh: FAILED<br>
sha256sum: WARNING: 1 computed checksum did NOT match<br>
# bước 3 — một "biến thể mới": cùng tác dụng, byte khác (ý của Hình 9-34). Bộ quét chữ ký mù, bộ kiểm toàn vẹn thì không<br>
$ printf '#!/bin/sh\\necho hello from tool 3\\n' &gt; tool3.sh; echo '# ctw-test-marker-0002' &gt;&gt; tool3.sh<br>
$ grep -l 'CTW-TEST-MARKER-0001' tool*.sh<br>
tool2.sh<br>
$ sha256sum -c sach.sha256 2&gt;&amp;1 | grep -v ': OK'<br>
tool2.sh: FAILED<br>
tool3.sh: FAILED<br>
sha256sum: WARNING: 2 computed checksums did NOT match<br>
# cùng ý đó cho cả hệ điều hành: dpkg giữ checksum của mọi tệp của mọi gói<br>
$ dpkg -V coreutils; echo "dpkg -V: no output above = every file of coreutils is exactly as packaged"<br>
dpkg -V: no output above = every file of coreutils is exactly as packaged<br>
$ echo '# tampered' &gt;&gt; /bin/true<br>
$ dpkg -V coreutils<br>
??5?????? &nbsp;&nbsp;/bin/true</div>
<p>Đọc nửa đầu: các tệp bắt đầu mỗi cái 33 byte; sau khi dòng đánh dấu được nối, <code>tool2.sh</code> là 79 byte (vết "tệp dài hơn" của Hình 9-33b), sha256 của nó không còn khớp bản ghi sạch (<code>FAILED</code>), và bộ quét biết dấu hiệu tìm ra đúng tệp đó. Nửa sau (slide 45–46) cho thấy một <em>biến thể mới</em> làm gì với bộ quét chữ ký, rồi <code>dpkg -V</code> kiểm mọi chương trình của một hệ điều hành đã cài ra sao.</p>
<p class="pitfall">⚠️ Virus "khoang" (d) vượt được phép kiểm "tệp dài hơn", nhưng không vượt được băm. Luôn ưu tiên <em>dấu vân tay mật mã</em> hơn kích thước và ngày, thứ virus đặt lại được (touch).</p>`],
      [39, 'Boot Sector Viruses',
        `<p class="y-chinh">🎯 Figure 9-30: a <strong>boot-sector virus</strong> — (a) the virus has copied itself into the boot sector and <em>captured</em> the interrupt and trap vectors (system calls, disk, clock, printer) so it keeps control; (b) the operating system, once loaded, retakes the vectors it needs (the printer vector); (c) the virus notices the loss and <em>recaptures</em> it. It runs <strong>before the OS exists</strong>, so no OS-level scanner can see it start.</p>
<p>The boot sector is the first 512 bytes of a disk: the BIOS copies it to memory and jumps to it, trusting it blindly — the ultimate "first thing that runs". Whoever writes there controls the machine before any defence has loaded: like a burglar who replaces the doorman's instructions <em>before the doorman's first shift</em>. A real master boot record ends with the two magic bytes <code>55 AA</code>; here is one, built from nothing, with its fingerprint — and the fingerprint of a version where one byte of the boot code was overwritten:</p>
<div class="out"># Slide 39 (Figure 9-30): the boot sector — the first 512 bytes of a disk, run before ANY operating system code<br>
# a 1 MiB "disk" of zeros<br>
$ dd if=/dev/zero of=dia.img bs=512 count=2048 2&gt;/dev/null<br>
# a minimal MBR: boot code area (we leave it empty), then the magic signature 55 AA in the last two bytes<br>
$ printf '\\x55\\xaa' | dd of=dia.img bs=1 seek=510 conv=notrunc 2&gt;/dev/null<br>
$ file dia.img<br>
dia.img: DOS/MBR boot sector<br>
$ od -A d -t x1 -j 496 -N 16 dia.img<br>
0000496 00 00 00 00 00 00 00 00 00 00 00 00 00 00 55 aa<br>
0000512<br>
# the defender's habit: keep the fingerprint of sector 0 (and the partition table) and compare it at every boot<br>
$ dd if=dia.img bs=512 count=1 2&gt;/dev/null | sha256sum | cut -c1-16<br>
b140168e270a1946<br>
# a boot-sector virus would overwrite the boot code (first 440 bytes) with its own: even one byte changes the fingerprint<br>
$ printf 'X' | dd of=dia.img bs=1 seek=0 conv=notrunc 2&gt;/dev/null<br>
$ dd if=dia.img bs=512 count=1 2&gt;/dev/null | sha256sum | cut -c1-16<br>
e2fcf44f374c401e<br>
# today: UEFI Secure Boot signs the boot loader (slide 47's code signing, applied to boot) and /sys/firmware/efi tells you the mode<br>
$ ls /sys/firmware/efi 2&gt;&amp;1 | head -2<br>
ls: cannot access '/sys/firmware/efi': No such file or directory</div>
<p><code>file</code> recognises it as a DOS/MBR boot sector purely from the <code>55 aa</code> tail; changing one byte of the 440-byte code area changes the sector's SHA-256 completely. A defender who stores the fingerprint of sector 0 elsewhere (read-only) detects any modification at the next check. The last line shows a container has no <code>/sys/firmware/efi</code> (no firmware of its own).</p>
<p>➕ <strong>Today: UEFI Secure Boot.</strong> The firmware holds trusted public keys and refuses to run a boot loader whose <em>signature</em> does not verify (slide 47's code signing, applied to boot); the loader verifies the kernel; on Linux the kernel can verify modules (<code>module.sig_enforce</code>) and "lockdown" mode. <strong>Measured boot</strong> goes further: the TPM records a hash of each boot stage so a remote server can check what actually ran. Bootkits still exist — <strong>LoJax</strong> (2018, the first UEFI rootkit found in the wild, ESET) and <strong>BlackLotus</strong> (2023, bypassed Secure Boot on fully patched Windows via CVE-2022-21894) — but they need privileges or an unrevoked vulnerable loader to install, which Secure Boot revocation lists (dbx) shrink.</p>
<p class="pitfall">⚠️ Don't confuse Secure Boot (<em>verifies signatures</em> at boot) with a boot-sector <em>virus scanner</em> (looks for known viruses). The first stops <em>unsigned</em> code; the second only knows what it has seen.</p>`,
        `<p class="y-chinh">🎯 Hình 9-30: <strong>virus khu vực khởi động (boot sector)</strong> — (a) virus đã chép vào boot sector và <em>chiếm</em> các vector ngắt và bẫy (lời gọi hệ thống, đĩa, đồng hồ, máy in) để giữ quyền kiểm soát; (b) hệ điều hành, khi đã nạp, lấy lại các vector nó cần (vector máy in); (c) virus nhận ra mất mát và <em>chiếm lại</em>. Nó chạy <strong>trước khi HĐH tồn tại</strong>, nên không bộ quét mức HĐH nào thấy nó khởi động.</p>
<p>Boot sector là 512 byte đầu của đĩa: BIOS chép nó vào bộ nhớ rồi nhảy tới, tin mù quáng — "thứ đầu tiên chạy" tuyệt đối. Ai ghi ở đó kiểm soát máy trước khi bất kỳ phòng thủ nào nạp: như kẻ trộm thay chỉ dẫn của bảo vệ <em>trước ca trực đầu tiên của bảo vệ</em>. Một master boot record thật kết thúc bằng hai byte thần <code>55 AA</code>; đây là một cái, dựng từ số không, với dấu vân tay của nó — và dấu vân tay của bản mà một byte mã khởi động bị ghi đè:</p>
<div class="out"># Slide 39 (Hình 9-30): boot sector — 512 byte đầu của đĩa, chạy trước MỌI mã của hệ điều hành<br>
# một "đĩa" 1 MiB toàn số 0<br>
$ dd if=/dev/zero of=dia.img bs=512 count=2048 2&gt;/dev/null<br>
# một MBR tối thiểu: vùng mã khởi động (để trống), rồi chữ ký 55 AA ở hai byte cuối<br>
$ printf '\\x55\\xaa' | dd of=dia.img bs=1 seek=510 conv=notrunc 2&gt;/dev/null<br>
$ file dia.img<br>
dia.img: DOS/MBR boot sector<br>
$ od -A d -t x1 -j 496 -N 16 dia.img<br>
0000496 00 00 00 00 00 00 00 00 00 00 00 00 00 00 55 aa<br>
0000512<br>
# thói quen của người phòng thủ: giữ dấu vân tay của sector 0 (và bảng phân vùng) rồi so ở mỗi lần khởi động<br>
$ dd if=dia.img bs=512 count=1 2&gt;/dev/null | sha256sum | cut -c1-16<br>
b140168e270a1946<br>
# virus boot sector sẽ ghi đè mã khởi động (440 byte đầu) bằng mã của nó: chỉ cần một byte là dấu vân tay đổi<br>
$ printf 'X' | dd of=dia.img bs=1 seek=0 conv=notrunc 2&gt;/dev/null<br>
$ dd if=dia.img bs=512 count=1 2&gt;/dev/null | sha256sum | cut -c1-16<br>
e2fcf44f374c401e<br>
# ngày nay: UEFI Secure Boot ký bộ nạp khởi động (ký mã của slide 47, áp cho khởi động) và /sys/firmware/efi cho biết chế độ<br>
$ ls /sys/firmware/efi 2&gt;&amp;1 | head -2<br>
ls: cannot access '/sys/firmware/efi': No such file or directory</div>
<p><code>file</code> nhận ra nó là boot sector DOS/MBR chỉ từ đuôi <code>55 aa</code>; đổi một byte của vùng mã 440 byte làm SHA-256 của sector đổi hoàn toàn. Người phòng thủ lưu dấu vân tay sector 0 ở nơi khác (chỉ đọc) phát hiện mọi sửa đổi ở lần kiểm kế. Dòng cuối cho thấy container không có <code>/sys/firmware/efi</code> (không có phần sụn riêng).</p>
<p>➕ <strong>Ngày nay: UEFI Secure Boot.</strong> Phần sụn giữ các khoá công khai tin cậy và từ chối chạy bộ nạp khởi động có <em>chữ ký</em> không xác minh được (ký mã của slide 47, áp cho khởi động); bộ nạp xác minh nhân; trên Linux nhân có thể xác minh module (<code>module.sig_enforce</code>) và chế độ "lockdown". <strong>Khởi động có đo (measured boot)</strong> đi xa hơn: TPM ghi băm của từng giai đoạn khởi động để máy chủ từ xa kiểm cái gì đã thực sự chạy. Bootkit vẫn tồn tại — <strong>LoJax</strong> (2018, rootkit UEFI đầu tiên bị phát hiện ngoài đời, ESET) và <strong>BlackLotus</strong> (2023, vượt Secure Boot trên Windows đã vá đầy đủ qua CVE-2022-21894) — nhưng chúng cần đặc quyền hoặc một bộ nạp có lỗi chưa bị thu hồi để cài, điều mà danh sách thu hồi của Secure Boot (dbx) thu hẹp.</p>
<p class="pitfall">⚠️ Đừng lẫn Secure Boot (<em>xác minh chữ ký</em> lúc khởi động) với <em>bộ quét virus</em> boot sector (tìm virus đã biết). Cái đầu chặn mã <em>không ký</em>; cái sau chỉ biết cái nó đã thấy.</p>`],
      [40, 'Actions Taken by Spyware (1)',
        `<p class="y-chinh">🎯 <strong>Spyware</strong> is software that is installed without real consent and watches or manipulates the user. The slide lists what it does to the browser: <strong>1.</strong> change the browser's home page; <strong>2.</strong> modify the list of favourite (bookmarked) pages; <strong>3.</strong> add new toolbars; <strong>4.</strong> change the user's default media player; <strong>5.</strong> change the user's default search engine.</p>
<p>Why would anyone bother? <strong>Money.</strong> Changing the default search engine or home page sends you to a site that pays per click; toolbars sell ads; the profile of what you read is sold. It is a business, and it arrives by <em>trojan</em> (a "free" app or video codec that carries it), drive-by downloads (a web page exploits a browser bug — slides 29–33), or bundling in an installer where you clicked "Next, Next, Next".</p>
<p>How is it different from a virus? It does not need to <em>spread</em>; it needs to <em>stay</em> and <em>collect</em>. So it hides, restarts itself, and often installs a second helper that reinstalls the first when you delete it. The defences are the ones you already know — least privilege (an app that cannot write to the browser's settings cannot change them), code signing (slide 47), installing only from the OS's own repositories, and a browser that locks its settings with a policy.</p>
<p>➕ On Linux and in the web world the equivalents are <em>malicious browser extensions</em> (permission "read and change all your data on all websites"), <em>npm/PyPI packages</em> that steal environment variables in an install script, and <em>mobile apps</em> asking for far more permissions than they need — the same <strong>principle of least privilege</strong> applied by the permission dialog on Android and iOS.</p>
<p class="pitfall">⚠️ The slide numbers items 6–9 as "6." four times on the next slide: a numbering mistake in the deck (the book lists 6, 7, 8, 9).</p>`,
        `<p class="y-chinh">🎯 <strong>Spyware</strong> là phần mềm được cài mà không có sự đồng ý thật sự và theo dõi hoặc thao túng người dùng. Slide liệt kê nó làm gì với trình duyệt: <strong>1.</strong> đổi trang chủ của trình duyệt; <strong>2.</strong> sửa danh sách trang yêu thích (bookmark); <strong>3.</strong> thêm thanh công cụ mới; <strong>4.</strong> đổi trình phát media mặc định của người dùng; <strong>5.</strong> đổi công cụ tìm kiếm mặc định của người dùng.</p>
<p>Vì sao có người bỏ công? <strong>Tiền.</strong> Đổi công cụ tìm kiếm hay trang chủ mặc định đưa bạn tới trang trả tiền theo lượt bấm; thanh công cụ bán quảng cáo; hồ sơ những gì bạn đọc bị bán. Đó là một ngành kinh doanh, và nó đến bằng <em>trojan</em> (một ứng dụng "miễn phí" hay codec video mang nó), tải xuống ngầm (một trang web khai thác lỗi trình duyệt — slide 29–33), hoặc đóng gói trong trình cài đặt nơi bạn bấm "Next, Next, Next".</p>
<p>Khác virus ở đâu? Nó không cần <em>lây</em>; nó cần <em>ở lại</em> và <em>thu thập</em>. Nên nó ẩn, tự khởi động lại, và thường cài thêm một trợ thủ cài lại cái đầu khi bạn xoá. Phòng thủ là những cái bạn đã biết — quyền tối thiểu (ứng dụng không ghi được vào cài đặt trình duyệt thì không đổi được chúng), ký mã (slide 47), chỉ cài từ kho của chính HĐH, và trình duyệt khoá cài đặt bằng chính sách.</p>
<p>➕ Trên Linux và trong thế giới web, tương đương là <em>tiện ích mở rộng trình duyệt độc hại</em> (quyền "đọc và đổi mọi dữ liệu trên mọi website"), <em>gói npm/PyPI</em> đánh cắp biến môi trường trong script cài đặt, và <em>ứng dụng di động</em> xin nhiều quyền hơn mức cần — cùng <strong>nguyên tắc quyền tối thiểu</strong> được hộp thoại quyền trên Android và iOS áp dụng.</p>
<p class="pitfall">⚠️ Slide sau đánh số mục 6–9 là "6." bốn lần: lỗi đánh số của bộ slide (sách là 6, 7, 8, 9).</p>`],
      [41, 'Actions Taken by Spyware (2)',
        `<p class="y-chinh">🎯 More spyware actions (the slide numbers them all "6."; the book's items 6–9): <strong>6.</strong> add new icons to the Windows desktop; <strong>7.</strong> replace banner ads on web pages with ones the spyware picks; <strong>8.</strong> put ads in the standard Windows dialog boxes; <strong>9.</strong> generate a continuous and unstoppable stream of pop-up ads. The earlier list <em>redirected</em> you; this one <em>monetises</em> your screen.</p>
<p>Notice the pattern across slides 40–41: every item is an action <em>the user could do by hand</em> — change a setting, add an icon, show an ad. Spyware needs no kernel exploit; it needs the <em>user's own rights</em>. That is why the defence is the permission model of slides 5–12 plus a bit of human judgement, not magic detection.</p>
<p>A short, sober checklist for the exam and for life: (1) install software from the official repository or vendor only; (2) read the permission list — a calculator that wants your contacts is spyware by design; (3) keep the browser, OS and extensions updated; (4) use a standard (non-admin) account for daily work, so a malicious installer cannot change system-wide settings (Windows UAC, Linux <code>sudo</code>); (5) when the machine behaves oddly, boot from known-good media and compare integrity (slide 45).</p>
<p>🧭 For a backend team the same logic is <strong>dependency hygiene</strong>: pin versions, review what a new package asks for, run <code>npm audit</code>/<code>mvn dependency-check</code>, and run CI with the minimum token scope — a malicious dependency executes with whatever rights your build has.</p>
<p class="meo">🧠 FE-style: "Which is NOT an action of spyware?" — look for the option that <em>spreads</em> itself to other machines (that is a worm).</p>`,
        `<p class="y-chinh">🎯 Thêm các hành động của spyware (slide đánh số hết là "6."; mục 6–9 của sách): <strong>6.</strong> thêm biểu tượng mới lên màn hình nền Windows; <strong>7.</strong> thay quảng cáo banner trên trang web bằng quảng cáo do spyware chọn; <strong>8.</strong> chèn quảng cáo vào các hộp thoại chuẩn của Windows; <strong>9.</strong> sinh dòng quảng cáo bật lên liên tục không dừng được. Danh sách trước <em>chuyển hướng</em> bạn; danh sách này <em>kiếm tiền</em> từ màn hình của bạn.</p>
<p>Để ý khuôn mẫu xuyên slide 40–41: mỗi mục là hành động <em>người dùng làm tay được</em> — đổi cài đặt, thêm biểu tượng, hiện quảng cáo. Spyware không cần khai thác nhân; nó cần <em>quyền của chính người dùng</em>. Vì vậy phòng thủ là mô hình quyền của slide 5–12 cộng một chút phán đoán của con người, không phải phát hiện thần kỳ.</p>
<p>Một danh sách kiểm ngắn, tỉnh táo cho kỳ thi và cho đời: (1) chỉ cài phần mềm từ kho chính thức hay nhà cung cấp; (2) đọc danh sách quyền — máy tính bỏ túi đòi danh bạ là spyware theo thiết kế; (3) cập nhật trình duyệt, HĐH và tiện ích; (4) dùng tài khoản chuẩn (không phải admin) cho việc hằng ngày, để trình cài độc hại không đổi được cài đặt toàn hệ thống (UAC của Windows, <code>sudo</code> của Linux); (5) khi máy chạy lạ, khởi động từ phương tiện tốt đã biết và so toàn vẹn (slide 45).</p>
<p>🧭 Với đội backend, cùng logic đó là <strong>vệ sinh phụ thuộc (dependency hygiene)</strong>: ghim phiên bản, xem gói mới đòi gì, chạy <code>npm audit</code>/<code>mvn dependency-check</code>, và chạy CI với phạm vi token tối thiểu — một phụ thuộc độc hại chạy với bất kỳ quyền nào bản dựng của bạn có.</p>
<p class="meo">🧠 Kiểu FE: "Cái nào KHÔNG phải hành động của spyware?" — tìm lựa chọn <em>tự lây</em> sang máy khác (đó là sâu).</p>`],
      [42, 'Types of Rootkits (1)',
        `<p class="y-chinh">🎯 A <strong>rootkit</strong> is malware that <em>hides itself and other malware</em> from the user and the OS tools — the question is <strong>where it hides</strong>. Five kinds, from the bottom of the machine upward: <strong>1. firmware rootkit</strong> (BIOS/UEFI, disk or network-card firmware), <strong>2. hypervisor rootkit</strong> (the OS becomes a guest of a hostile hypervisor), <strong>3. kernel rootkit</strong> (a loadable module or patched kernel table), <strong>4. library rootkit</strong> (replaces shared libraries such as libc), <strong>5. application rootkit</strong> (replaces programs like <code>ls</code>, <code>ps</code>, <code>login</code>).</p>
<p>A burglar who, after breaking in, also cuts the security-camera cable and rewrites the guard's logbook. The point is not entry but <strong>staying unseen</strong>: if <code>ps</code> shows nothing and <code>ls</code> shows no file, the administrator concludes "clean". All the tools we trust for looking (<code>ps</code>, <code>ls</code>, <code>netstat</code>, a virus scanner) are themselves programs running on the layers beneath which the rootkit may sit — the <strong>trust problem</strong> of slide 4 in its purest form: whoever controls a lower layer can lie to every layer above.</p>
<p>The name comes from "root kit": the toolkit an intruder installs after gaining root, to keep it. Real examples the book cites include the Sony BMG copy-protection rootkit (2005), which hid every file whose name started with <code>$sys$</code> on the PCs of people who played certain music CDs — a rare case of a <em>company</em> shipping one — and the Blue Pill idea (Joanna Rutkowska, 2006) of a thin hypervisor slipped under a running OS.</p>
<p>➕ In the Linux world the kernel and library rootkits you will actually read about are <em>loadable kernel modules</em> that hook the syscall table to hide processes, files and sockets, and <code>LD_PRELOAD</code>-style tricks (next slide shows the library layer harmlessly). Detection uses the <strong>cross-view</strong> idea: ask the same question through two different layers and compare — a mismatch means someone is lying.</p>
<p class="pitfall">⚠️ The lower the rootkit, the harder to find <em>and</em> to remove; the usual advice for a kernel or firmware rootkit is "rebuild the machine from known-good media", not "clean it".</p>`,
        `<p class="y-chinh">🎯 <strong>Rootkit</strong> là mã độc <em>che giấu chính nó và mã độc khác</em> khỏi người dùng và công cụ của HĐH — câu hỏi là <strong>nó ẩn ở đâu</strong>. Năm loại, từ đáy máy lên trên: <strong>1. rootkit phần sụn</strong> (BIOS/UEFI, phần sụn đĩa hay card mạng), <strong>2. rootkit hypervisor</strong> (HĐH trở thành khách của một hypervisor thù địch), <strong>3. rootkit nhân</strong> (một module nạp được hay bảng nhân bị vá), <strong>4. rootkit thư viện</strong> (thay thư viện dùng chung như libc), <strong>5. rootkit ứng dụng</strong> (thay chương trình như <code>ls</code>, <code>ps</code>, <code>login</code>).</p>
<p>Một tên trộm, sau khi đột nhập, còn cắt cáp camera và viết lại sổ nhật ký của bảo vệ. Điểm không phải là vào được mà là <strong>không bị thấy</strong>: nếu <code>ps</code> không thấy gì và <code>ls</code> không thấy tệp, quản trị viên kết luận "sạch". Mọi công cụ ta tin để nhìn (<code>ps</code>, <code>ls</code>, <code>netstat</code>, bộ quét virus) tự chúng là chương trình chạy trên các tầng dưới, nơi rootkit có thể ngồi — <strong>bài toán niềm tin</strong> của slide 4 ở dạng thuần nhất: ai kiểm soát tầng thấp hơn thì nói dối được mọi tầng trên.</p>
<p>Cái tên từ "root kit": bộ công cụ kẻ xâm nhập cài sau khi có root, để giữ nó. Ví dụ thật sách nêu gồm rootkit chống sao chép của Sony BMG (2005), giấu mọi tệp có tên bắt đầu bằng <code>$sys$</code> trên PC của những người nghe một số đĩa nhạc CD — một trường hợp hiếm do <em>một công ty</em> phát hành — và ý tưởng Blue Pill (Joanna Rutkowska, 2006) về một hypervisor mỏng luồn xuống dưới HĐH đang chạy.</p>
<p>➕ Trong thế giới Linux, rootkit nhân và thư viện bạn sẽ thực sự đọc tới là <em>module nhân nạp được</em> móc bảng lời gọi hệ thống để giấu tiến trình, tệp và socket, và mánh kiểu <code>LD_PRELOAD</code> (slide sau cho xem tầng thư viện một cách vô hại). Phát hiện dùng ý <strong>đối chiếu hai góc nhìn (cross-view)</strong>: hỏi cùng câu qua hai tầng khác nhau rồi so — lệch nghĩa là có ai đó nói dối.</p>
<p class="pitfall">⚠️ Rootkit càng thấp càng khó tìm <em>và</em> khó gỡ; lời khuyên thường cho rootkit nhân hay phần sụn là "dựng lại máy từ phương tiện tốt đã biết", không phải "dọn sạch".</p>`],
      [43, 'Types of Rootkits (2)',
        `<p class="y-chinh">🎯 Figure 9-31: the five places a rootkit can hide, drawn as a stack — (a) <strong>firmware</strong> (HW/BIOS), (b) <strong>hypervisor</strong> under the OS, (c) <strong>kernel</strong> inside the OS, (d) <strong>library</strong> between OS and application, (e) the <strong>application</strong> itself. The higher up, the easier to detect and remove; the lower, the more of the machine it can lie about.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/c168e62cf776a87e91455161563799779011ee10.svg" alt="Figure 9-31 as layers, with the tools that can still see each one" loading="lazy" /><p class="chu-thich">🧩 Figure 9-31 as layers, with the tools that can still see each one</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 43 (Figure 9-31): five places a rootkit can hide, and which tools can still see it
rectangle "5. Application rootkit\\n(replaces ls, ps, login …)" as A5 #FEF9C3
rectangle "4. Library rootkit\\n(LD_PRELOAD / patched libc)" as A4 #FEF9C3
rectangle "3. Kernel rootkit\\n(loadable module, patched syscall table)" as A3 #FEE2E2
rectangle "2. Hypervisor rootkit\\n(OS runs as a guest, unaware)" as A2 #FEE2E2
rectangle "1. Firmware rootkit\\n(BIOS/UEFI, disk or NIC firmware)" as A1 #FEE2E2
A5 -[hidden]down-&gt; A4
A4 -[hidden]down-&gt; A3
A3 -[hidden]down-&gt; A2
A2 -[hidden]down-&gt; A1
note right of A5 : detect: package checksums (dpkg -V, rpm -V),\\nfile integrity (AIDE/Tripwire)
note right of A4 : detect: memory map, static binaries,\\nfresh trusted tools from read-only media
note right of A3 : detect: look from OUTSIDE — memory forensics,\\nsigned modules, Secure Boot + lockdown
note right of A2 : detect: timing and CPU-feature probes,\\nmeasured boot (TPM)
note right of A1 : detect: Secure Boot, measured boot,\\nvendor firmware signatures
note bottom of A1 : The lower the rootkit, the fewer tools run BELOW it to check on it.
@enduml</code></pre></details>
<p>Take the harmless library layer as the lab specimen. Our "hook" replaces <code>puts()</code> for programs started with <code>LD_PRELOAD</code>: it prints every line unchanged except one containing "balance", which it rewrites. Nothing on disk changes — neither <code>chao</code> nor libc is touched:</p>
<div class="out"># Slides 42-43 (Figure 9-31): rootkits hide at different layers. A HARMLESS library hook shows the library layer, and how to see through it<br>
$ cat _hook.c<br>
// a harmless interposer: replaces puts() for programs started with LD_PRELOAD=./hook.so<br>
#define _GNU_SOURCE<br>
#include &lt;stdio.h&gt;<br>
#include &lt;string.h&gt;<br>
#include &lt;dlfcn.h&gt;<br>
int puts(const char *s) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;int (*that)(const char *) = dlsym(RTLD_NEXT, "puts"); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// the real puts()<br>
&nbsp;&nbsp;&nbsp;&nbsp;if (strstr(s, "balance")) return that("balance: [hidden by the hook]"); &nbsp;&nbsp;// the library layer lies about one line<br>
&nbsp;&nbsp;&nbsp;&nbsp;return that(s);<br>
}<br>
$ cat _chao.c<br>
#include &lt;stdio.h&gt;<br>
int main(void) { puts("account: alice"); puts("balance: 1500"); return 0; }<br>
$ ./chao<br>
account: alice<br>
balance: 1500<br>
# LD_PRELOAD puts OUR library first: when the program calls puts(), it reaches the hook, not libc<br>
$ LD_PRELOAD=$PWD/hook.so ./chao<br>
account: alice<br>
balance: [hidden by the hook]<br>
# the program file is untouched and the system calls are honest — but the process memory map shows a library nobody asked for: this is what rkhunter-style tools look for<br>
$ LD_PRELOAD=$PWD/hook.so cat /proc/self/maps | awk '/hook.so/ {print $6}' | sort -u<br>
/w/hook.so<br>
# defences against the library layer: a static binary has no dynamic loader, and the loader ignores LD_PRELOAD for setuid programs<br>
$ gcc -static -o chao-tinh _chao.c &amp;&amp; LD_PRELOAD=$PWD/hook.so ./chao-tinh<br>
account: alice<br>
balance: 1500<br>
# cross-view detection (what rkhunter/chkrootkit do, in miniature): ask the same question two ways and compare<br>
$ sleep 30 &amp; P=$(jobs -p %1)<br>
$ ps -e -o pid= | tr -d ' ' | grep -qx "$P" &amp;&amp; echo "ps sees the process"; ls /proc | grep -qx "$P" &amp;&amp; echo "/proc sees the process"; kill -0 "$P" &amp;&amp; echo "kill -0 says it exists"<br>
ps sees the process<br>
/proc sees the process<br>
kill -0 says it exists</div>
<p>Read it as a detection lesson. (1) Without the hook the program prints the truth; with it, the same binary prints a lie for one line. (2) Memory map (<code>/proc/PID/maps</code>) shows a library nobody asked for — what rkhunter-style tools check. (3) A <strong>statically linked</strong> program has no dynamic loader, so <code>LD_PRELOAD</code> has no effect (and the loader ignores it for setuid programs). (4) The <strong>cross-view</strong> check at the end: <code>ps</code>, <code>/proc</code> and <code>kill -0</code> all agree the process exists — if a rootkit hid it from <code>ps</code> only, the three answers would disagree, and that disagreement <em>is</em> the alarm.</p>
<p>🧭 Practical hygiene for a server: <code>dpkg -V</code>/<code>rpm -V</code> (are package files unchanged? slide 45), <code>debsums</code>, AIDE/Tripwire (integrity), <code>rkhunter</code>/<code>chkrootkit</code> (cross-view and known signatures), kernel module signing and <code>kernel.modules_disabled=1</code> after boot, Secure Boot (slide 39), and — the strongest — <em>immutable infrastructure</em>: never repair a suspect container or VM; destroy it and redeploy from a signed image.</p>
<p class="pitfall">⚠️ Exam question: "Which rootkit is hardest to detect?" — the lowest layer: firmware (or hypervisor), because no tool runs beneath it to compare against.</p>`,
        `<p class="y-chinh">🎯 Hình 9-31: năm chỗ rootkit có thể ẩn, vẽ như một chồng — (a) <strong>phần sụn</strong> (HW/BIOS), (b) <strong>hypervisor</strong> dưới HĐH, (c) <strong>nhân</strong> trong HĐH, (d) <strong>thư viện</strong> giữa HĐH và ứng dụng, (e) chính <strong>ứng dụng</strong>. Càng lên cao càng dễ phát hiện và gỡ; càng thấp càng nói dối được nhiều phần của máy.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/c168e62cf776a87e91455161563799779011ee10.svg" alt="Hình 9-31 dạng các tầng, kèm công cụ vẫn nhìn thấy từng tầng" loading="lazy" /><p class="chu-thich">🧩 Hình 9-31 dạng các tầng, kèm công cụ vẫn nhìn thấy từng tầng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 43 (Hình 9-31): năm chỗ rootkit có thể ẩn, và công cụ nào còn thấy được nó
rectangle "5. Application rootkit\\n(replaces ls, ps, login …)" as A5 #FEF9C3
rectangle "4. Library rootkit\\n(LD_PRELOAD / patched libc)" as A4 #FEF9C3
rectangle "3. Kernel rootkit\\n(loadable module, patched syscall table)" as A3 #FEE2E2
rectangle "2. Hypervisor rootkit\\n(OS runs as a guest, unaware)" as A2 #FEE2E2
rectangle "1. Firmware rootkit\\n(BIOS/UEFI, disk or NIC firmware)" as A1 #FEE2E2
A5 -[hidden]down-&gt; A4
A4 -[hidden]down-&gt; A3
A3 -[hidden]down-&gt; A2
A2 -[hidden]down-&gt; A1
note right of A5 : detect: package checksums (dpkg -V, rpm -V),\\nfile integrity (AIDE/Tripwire)
note right of A4 : detect: memory map, static binaries,\\nfresh trusted tools from read-only media
note right of A3 : detect: look from OUTSIDE — memory forensics,\\nsigned modules, Secure Boot + lockdown
note right of A2 : detect: timing and CPU-feature probes,\\nmeasured boot (TPM)
note right of A1 : detect: Secure Boot, measured boot,\\nvendor firmware signatures
note bottom of A1 : The lower the rootkit, the fewer tools run BELOW it to check on it.
@enduml</code></pre></details>
<p>Lấy tầng thư viện vô hại làm mẫu thí nghiệm. "Hook" của ta thay <code>puts()</code> cho chương trình khởi động với <code>LD_PRELOAD</code>: nó in mọi dòng nguyên vẹn trừ một dòng chứa "balance" mà nó viết lại. Không gì trên đĩa đổi — cả <code>chao</code> lẫn libc đều không bị đụng tới:</p>
<div class="out"># Slide 42-43 (Hình 9-31): rootkit ẩn ở các tầng khác nhau. Một hook thư viện VÔ HẠI cho thấy tầng thư viện, và cách nhìn xuyên qua nó<br>
$ cat _hook.c<br>
// a harmless interposer: replaces puts() for programs started with LD_PRELOAD=./hook.so<br>
#define _GNU_SOURCE<br>
#include &lt;stdio.h&gt;<br>
#include &lt;string.h&gt;<br>
#include &lt;dlfcn.h&gt;<br>
int puts(const char *s) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;int (*that)(const char *) = dlsym(RTLD_NEXT, "puts"); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// the real puts()<br>
&nbsp;&nbsp;&nbsp;&nbsp;if (strstr(s, "balance")) return that("balance: [hidden by the hook]"); &nbsp;&nbsp;// the library layer lies about one line<br>
&nbsp;&nbsp;&nbsp;&nbsp;return that(s);<br>
}<br>
$ cat _chao.c<br>
#include &lt;stdio.h&gt;<br>
int main(void) { puts("account: alice"); puts("balance: 1500"); return 0; }<br>
$ ./chao<br>
account: alice<br>
balance: 1500<br>
# LD_PRELOAD đặt thư viện CỦA TA lên trước: khi chương trình gọi puts(), nó tới hook chứ không tới libc<br>
$ LD_PRELOAD=$PWD/hook.so ./chao<br>
account: alice<br>
balance: [hidden by the hook]<br>
# tệp chương trình không bị đụng tới và lời gọi hệ thống trung thực — nhưng bản đồ bộ nhớ của tiến trình có thêm một thư viện không ai yêu cầu: đó là thứ các công cụ kiểu rkhunter tìm<br>
$ LD_PRELOAD=$PWD/hook.so cat /proc/self/maps | awk '/hook.so/ {print $6}' | sort -u<br>
/w/hook.so<br>
# phòng thủ trước tầng thư viện: tệp liên kết tĩnh không có bộ nạp động, và bộ nạp bỏ qua LD_PRELOAD với chương trình setuid<br>
$ gcc -static -o chao-tinh _chao.c &amp;&amp; LD_PRELOAD=$PWD/hook.so ./chao-tinh<br>
account: alice<br>
balance: 1500<br>
# phát hiện đối chiếu hai góc nhìn (điều rkhunter/chkrootkit làm, thu nhỏ): hỏi cùng một câu bằng hai cách rồi so<br>
$ sleep 30 &amp; P=$(jobs -p %1)<br>
$ ps -e -o pid= | tr -d ' ' | grep -qx "$P" &amp;&amp; echo "ps sees the process"; ls /proc | grep -qx "$P" &amp;&amp; echo "/proc sees the process"; kill -0 "$P" &amp;&amp; echo "kill -0 says it exists"<br>
ps sees the process<br>
/proc sees the process<br>
kill -0 says it exists</div>
<p>Đọc nó như một bài học phát hiện. (1) Không có hook chương trình in sự thật; có hook, cùng tệp nhị phân in dối một dòng. (2) Bản đồ bộ nhớ (<code>/proc/PID/maps</code>) cho thấy một thư viện không ai yêu cầu — thứ các công cụ kiểu rkhunter kiểm. (3) Chương trình <strong>liên kết tĩnh</strong> không có bộ nạp động nên <code>LD_PRELOAD</code> vô tác dụng (và bộ nạp bỏ qua nó với chương trình setuid). (4) Phép <strong>đối chiếu hai góc nhìn</strong> ở cuối: <code>ps</code>, <code>/proc</code> và <code>kill -0</code> đều đồng ý tiến trình tồn tại — nếu rootkit chỉ giấu nó khỏi <code>ps</code>, ba câu trả lời sẽ lệch nhau, và chính sự lệch đó <em>là</em> báo động.</p>
<p>🧭 Vệ sinh thực tế cho máy chủ: <code>dpkg -V</code>/<code>rpm -V</code> (tệp gói còn nguyên không? slide 45), <code>debsums</code>, AIDE/Tripwire (toàn vẹn), <code>rkhunter</code>/<code>chkrootkit</code> (đối chiếu và chữ ký đã biết), ký module nhân và <code>kernel.modules_disabled=1</code> sau khi khởi động, Secure Boot (slide 39), và — mạnh nhất — <em>hạ tầng bất biến</em>: đừng bao giờ sửa container hay VM nghi ngờ; huỷ nó và triển khai lại từ ảnh có ký.</p>
<p class="pitfall">⚠️ Câu thi: "Rootkit nào khó phát hiện nhất?" — tầng thấp nhất: phần sụn (hoặc hypervisor), vì không công cụ nào chạy bên dưới nó để so.</p>`],
      [44, 'Firewalls',
        `<p class="y-chinh">🎯 Figure 9-32: a (simplified) <strong>hardware firewall</strong> protecting a LAN with three servers — Web 207.68.160.190:80, e-mail 207.68.160.191:25, FTP 207.68.160.192:21. The firewall sits between the network connection and the LAN and lets through only the traffic the rules allow: web traffic to the web server, mail to the mail server, FTP to the FTP server, and <em>nothing else</em>. Rule of thumb: <strong>default deny</strong>.</p>
<p>The doorman of a building who lets visitors reach only the floor they came for — and the rule is "the list of allowed things", not "the list of banned things", because banned lists always miss something. A <strong>packet filter</strong> decides per packet from protocol, addresses and ports (first matching rule wins); a <strong>stateful firewall</strong> also remembers connections (so replies to your own requests are allowed back in); an <strong>application-level proxy / WAF</strong> reads the content (e.g. HTTP) and can block SQL-injection patterns. A firewall protects the <em>perimeter</em>; it cannot see inside TLS-encrypted traffic or stop an attack arriving through an allowed port (port 443 carries SQL injection too).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/df7874444ced3c4c54c2751077b2c1b708b30b82.svg" alt="Seven packets against four rules: first match wins, default deny" loading="lazy" /><p class="chu-thich">🧮 Seven packets against four rules: first match wins, default deny</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const LUAT = [
  { so: 1, hanhDong: 'allow', giaoThuc: 'tcp', dich: '207.68.160.190', cong: 80 },
  { so: 2, hanhDong: 'allow', giaoThuc: 'tcp', dich: '207.68.160.191', cong: 25 },
  { so: 3, hanhDong: 'allow', giaoThuc: 'tcp', dich: '207.68.160.192', cong: 21 },
  { so: 4, hanhDong: 'deny', giaoThuc: '*', dich: '*', cong: '*' },       // mặc định
];
const GOI = [
  ['tcp', '207.68.160.190', 80], ['tcp', '207.68.160.190', 22], ['tcp', '207.68.160.191', 25], ['tcp', '207.68.160.191', 80],
  ['tcp', '207.68.160.192', 21], ['udp', '207.68.160.190', 80], ['tcp', '207.68.160.192', 20],
];
const khop = (l, g) =&gt; (l.giaoThuc === '*' || l.giaoThuc === g[0]) &amp;&amp; (l.dich === '*' || l.dich === g[1]) &amp;&amp; (l.cong === '*' || l.cong === g[2]);
const xet = (g) =&gt; LUAT.find((l) =&gt; khop(l, g));</code></pre></details>
<p>➕ Read the table: rules 1–3 admit exactly Figure 9-32's three services, rule 4 drops everything else — SSH on the web server (<code>:22</code>), UDP, even the FTP <em>data</em> channel (<code>:20</code>). That last one is a real FTP headache (FTP uses a second connection, so firewalls need special helpers) and one reason SFTP/HTTPS replaced FTP. Three of seven packets pass.</p>
<p>🧭 On a real server the first line of defence is <strong>which ports are open at all</strong>. Our container starts two servers; <code>ss -ltn</code> shows what can be reached from outside:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 44 (Figure 9-32): a firewall decides WHICH ports are reachable; first decide which ports are OPEN at all<br>
# two tiny servers: one listens on 127.0.0.1 only (loopback), one on 0.0.0.0 (every interface, the whole network)<br>
$ ss -ltn | tail -n +2 | sort<br>
LISTEN 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;511 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.0.0.0:8080 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.0.0.0:*<br>
LISTEN 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;511 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;127.0.0.1:5432 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.0.0.0:*<br>
# 127.0.0.1:5432 (a database) cannot be reached from another machine whatever the firewall says; 0.0.0.0:8080 can, unless a firewall drops it<br>
$ id -un<br>
sv<br>
# a normal user may listen on a port below 1024 here — Docker sets net.ipv4.ip_unprivileged_port_start=0 for containers (a classic Linux host says 1024)<br>
$ cat /proc/sys/net/ipv4/ip_unprivileged_port_start<br>
0<br>
$ node -e "require('net').createServer().listen(80,'127.0.0.1',function(){console.log('listening on port 80 as uid',process.getuid());process.exit(0)})"<br>
listening on port 80 as uid 1000</div>
<p><code>127.0.0.1:5432</code> (a database bound to loopback) cannot be reached from another machine whatever the firewall says; <code>0.0.0.0:8080</code> listens on every interface. For Postgres, Redis and admin tools: bind to <code>127.0.0.1</code> or a private network, never <code>0.0.0.0</code>; with Docker, publish as <code>-p 127.0.0.1:5432:5432</code>. (<em>Careful:</em> Docker edits iptables itself, so <code>ufw</code> rules can be bypassed by <code>-p 5432:5432</code> — a classic production incident.) The tools are <code>ufw</code>/<code>nftables</code> on the host, cloud <em>security groups</em>, and Kubernetes <em>NetworkPolicies</em>. The course's own VPS publishes only 80/443 (and SSH).</p>
<p>Last line of the run: user <code>sv</code> (uid 1000) can listen on port 80. Linux's classic rule reserves ports below 1024 for root (<code>CAP_NET_BIND_SERVICE</code>, slide 12), but Docker sets <code>net.ipv4.ip_unprivileged_port_start=0</code> inside containers, so a non-root web server needs no special capability there — on a normal host you would see <code>1024</code>.</p>
<p class="pitfall">⚠️ A firewall is <em>not</em> authentication. "Only our office IP may connect" is a weak control by itself — IPs can be shared or spoofed — combine it with keys/passwords (defence in depth).</p>`,
        `<p class="y-chinh">🎯 Hình 9-32: một <strong>tường lửa phần cứng</strong> (đơn giản hoá) bảo vệ một LAN có ba máy chủ — Web 207.68.160.190:80, e-mail 207.68.160.191:25, FTP 207.68.160.192:21. Tường lửa nằm giữa kết nối mạng và LAN và chỉ cho qua lưu lượng mà luật cho phép: web tới máy chủ web, thư tới máy chủ thư, FTP tới máy chủ FTP, và <em>không gì khác</em>. Quy tắc ngón tay cái: <strong>mặc định từ chối (default deny)</strong>.</p>
<p>Bảo vệ toà nhà chỉ cho khách tới đúng tầng họ cần — và luật là "danh sách thứ được phép", không phải "danh sách thứ bị cấm", vì danh sách cấm luôn sót. <strong>Bộ lọc gói (packet filter)</strong> quyết theo từng gói từ giao thức, địa chỉ và cổng (luật khớp đầu tiên thắng); <strong>tường lửa có trạng thái (stateful)</strong> còn nhớ các kết nối (nên phản hồi cho yêu cầu của chính bạn được vào lại); <strong>proxy mức ứng dụng / WAF</strong> đọc nội dung (ví dụ HTTP) và chặn được mẫu SQL injection. Tường lửa bảo vệ <em>vành đai</em>; nó không nhìn được vào lưu lượng mã hoá TLS hay chặn cuộc tấn công đến qua cổng được phép (cổng 443 cũng chở SQL injection).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3053aef97007c396731183ad211bbe439aeeceec.svg" alt="Bảy gói tin so với bốn luật: khớp đầu tiên thắng, mặc định từ chối" loading="lazy" /><p class="chu-thich">🧮 Bảy gói tin so với bốn luật: khớp đầu tiên thắng, mặc định từ chối</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const LUAT = [
  { so: 1, hanhDong: 'allow', giaoThuc: 'tcp', dich: '207.68.160.190', cong: 80 },
  { so: 2, hanhDong: 'allow', giaoThuc: 'tcp', dich: '207.68.160.191', cong: 25 },
  { so: 3, hanhDong: 'allow', giaoThuc: 'tcp', dich: '207.68.160.192', cong: 21 },
  { so: 4, hanhDong: 'deny', giaoThuc: '*', dich: '*', cong: '*' },       // mặc định
];
const GOI = [
  ['tcp', '207.68.160.190', 80], ['tcp', '207.68.160.190', 22], ['tcp', '207.68.160.191', 25], ['tcp', '207.68.160.191', 80],
  ['tcp', '207.68.160.192', 21], ['udp', '207.68.160.190', 80], ['tcp', '207.68.160.192', 20],
];
const khop = (l, g) =&gt; (l.giaoThuc === '*' || l.giaoThuc === g[0]) &amp;&amp; (l.dich === '*' || l.dich === g[1]) &amp;&amp; (l.cong === '*' || l.cong === g[2]);
const xet = (g) =&gt; LUAT.find((l) =&gt; khop(l, g));</code></pre></details>
<p>➕ Đọc bảng: luật 1–3 cho qua đúng ba dịch vụ của Hình 9-32, luật 4 chặn mọi thứ còn lại — SSH trên máy chủ web (<code>:22</code>), UDP, thậm chí kênh <em>dữ liệu</em> FTP (<code>:20</code>). Cái cuối là một nỗi đau thật của FTP (FTP dùng kết nối thứ hai nên tường lửa cần trợ giúp đặc biệt) và là một lý do SFTP/HTTPS thay FTP. Ba trên bảy gói được qua.</p>
<p>🧭 Trên server thật, tuyến phòng thủ đầu là <strong>cổng nào đang mở</strong>. Container của ta khởi động hai máy chủ; <code>ss -ltn</code> cho thấy cái gì tới được từ bên ngoài:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 44 (Hình 9-32): tường lửa quyết định cổng NÀO tới được; trước hết hãy quyết định cổng nào đang MỞ<br>
# hai máy chủ nhỏ: một cái chỉ nghe ở 127.0.0.1 (loopback), một cái nghe ở 0.0.0.0 (mọi giao diện, cả mạng)<br>
$ ss -ltn | tail -n +2 | sort<br>
LISTEN 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;511 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.0.0.0:8080 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.0.0.0:*<br>
LISTEN 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;511 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;127.0.0.1:5432 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.0.0.0:*<br>
# 127.0.0.1:5432 (cơ sở dữ liệu) máy khác không tới được dù tường lửa nói gì; 0.0.0.0:8080 thì tới được, trừ khi tường lửa chặn<br>
$ id -un<br>
sv<br>
# người dùng thường ở đây nghe được cổng dưới 1024 — Docker đặt net.ipv4.ip_unprivileged_port_start=0 cho container (máy Linux thường là 1024)<br>
$ cat /proc/sys/net/ipv4/ip_unprivileged_port_start<br>
0<br>
$ node -e "require('net').createServer().listen(80,'127.0.0.1',function(){console.log('listening on port 80 as uid',process.getuid());process.exit(0)})"<br>
listening on port 80 as uid 1000</div>
<p><code>127.0.0.1:5432</code> (cơ sở dữ liệu gắn vào loopback) máy khác không tới được dù tường lửa nói gì; <code>0.0.0.0:8080</code> nghe ở mọi giao diện. Với Postgres, Redis và công cụ quản trị: gắn vào <code>127.0.0.1</code> hoặc mạng riêng, không bao giờ <code>0.0.0.0</code>; với Docker, công bố là <code>-p 127.0.0.1:5432:5432</code>. (<em>Cẩn thận:</em> Docker tự sửa iptables nên luật <code>ufw</code> có thể bị <code>-p 5432:5432</code> vượt qua — một sự cố production kinh điển.) Công cụ là <code>ufw</code>/<code>nftables</code> trên máy chủ, <em>security group</em> của đám mây, và <em>NetworkPolicy</em> của Kubernetes. VPS của chính khoá học này chỉ công bố 80/443 (và SSH).</p>
<p>Dòng cuối của lần chạy: người dùng <code>sv</code> (uid 1000) nghe được cổng 80. Luật kinh điển của Linux dành cổng dưới 1024 cho root (<code>CAP_NET_BIND_SERVICE</code>, slide 12), nhưng Docker đặt <code>net.ipv4.ip_unprivileged_port_start=0</code> trong container, nên máy chủ web không phải root ở đó không cần capability đặc biệt — trên máy thường bạn sẽ thấy <code>1024</code>.</p>
<p class="pitfall">⚠️ Tường lửa <em>không</em> phải xác thực. "Chỉ IP văn phòng mới kết nối được" là kiểm soát yếu nếu đứng một mình — IP có thể dùng chung hay giả — hãy kết hợp với khoá/mật khẩu (phòng thủ nhiều lớp).</p>`],
      [45, 'Virus Scanners (1)',
        `<p class="y-chinh">🎯 Figure 9-33: how a virus tries to evade a <strong>virus scanner</strong> — (a) a clean program; (b) an infected program, <em>longer</em> (the file is longer — an easy giveaway); (c) a <strong>compressed</strong> infected program (original size again — the virus compresses the host to hide the growth), with a decompressor; (d) an <strong>encrypted virus</strong> (encryptor, key, decryptor — only the small decryptor stays constant); (e) a <strong>compressed virus with encrypted compression code</strong>. Each step hides more bytes a scanner could recognise.</p>
<p>A virus scanner works like airport security with a book of photographs of known troublemakers: it compares each file with a database of <strong>signatures</strong> (byte patterns of known viruses). It misses what is not in the book; it must be updated daily; and it can false-alarm. The book's arms race: viruses answer with compression (to keep the length), encryption (so the body has no fixed bytes) and — next slide — <em>polymorphism</em> (the decryptor itself keeps changing).</p>
<p>Three families of detection to keep apart: <strong>signature</strong> (know the bytes), <strong>integrity checking</strong> (know the <em>good</em> state; any change is suspicious — the next experiment), and <strong>behaviour</strong> (watch what a program does: mass-encrypting files, touching <code>/etc/shadow</code>; today's EDR products and kernel-level eBPF tools like Falco), plus cloud reputation and machine learning. Integrity checking has an elegant property: it needs <em>no knowledge of any virus</em>.</p>
<p>Run the three detectors against a new "variant" of our harmless marker (slide 38's run, second half): the signature scanner is blind to the variant, while the checksum list catches both infections. Then the same idea over a whole operating system — <code>dpkg -V</code> compares every file of a package with the checksums stored when it was installed:</p>
<div class="out"># Slides 36-38 and 45-46: infection grows a file; scanners match signatures; integrity checking catches what signatures miss. NO malware here: the "infection" is a harmless marker line appended to a text file<br>
$ mkdir -p /tmp/may &amp;&amp; cd /tmp/may<br>
$ for i in 1 2 3; do printf '#!/bin/sh\\necho hello from tool %s\\n' $i &gt; tool$i.sh; done<br>
# step 1 — the administrator records a fingerprint of every program while the system is known to be clean (this is what AIDE/Tripwire do)<br>
$ sha256sum tool*.sh &gt; sach.sha256; ls -l tool*.sh | awk '{print $5, $9}'<br>
33 tool1.sh<br>
33 tool2.sh<br>
33 tool3.sh<br>
# step 2 — "infection": the file grows by a marker line (Figure 9-33b: an infected program is LONGER)<br>
$ echo '# CTW-TEST-MARKER-0001 (harmless test marker)' &gt;&gt; tool2.sh<br>
$ ls -l tool*.sh | awk '{print $5, $9}'<br>
33 tool1.sh<br>
79 tool2.sh<br>
33 tool3.sh<br>
# a SIGNATURE scanner looks for known bytes: it finds the marker it knows<br>
$ grep -l 'CTW-TEST-MARKER-0001' tool*.sh<br>
tool2.sh<br>
# an INTEGRITY checker does not need to know the marker at all<br>
$ sha256sum -c sach.sha256 2&gt;&amp;1 | grep -v ': OK'<br>
tool2.sh: FAILED<br>
sha256sum: WARNING: 1 computed checksum did NOT match<br>
# step 3 — a "new variant": same effect, different bytes (Figure 9-34's idea). The signature scanner is blind, the integrity checker is not<br>
$ printf '#!/bin/sh\\necho hello from tool 3\\n' &gt; tool3.sh; echo '# ctw-test-marker-0002' &gt;&gt; tool3.sh<br>
$ grep -l 'CTW-TEST-MARKER-0001' tool*.sh<br>
tool2.sh<br>
$ sha256sum -c sach.sha256 2&gt;&amp;1 | grep -v ': OK'<br>
tool2.sh: FAILED<br>
tool3.sh: FAILED<br>
sha256sum: WARNING: 2 computed checksums did NOT match<br>
# the same idea for a whole operating system: dpkg keeps the checksum of every file of every package<br>
$ dpkg -V coreutils; echo "dpkg -V: no output above = every file of coreutils is exactly as packaged"<br>
dpkg -V: no output above = every file of coreutils is exactly as packaged<br>
$ echo '# tampered' &gt;&gt; /bin/true<br>
$ dpkg -V coreutils<br>
??5?????? &nbsp;&nbsp;/bin/true</div>
<p>After the "new variant" step <code>grep</code> still lists only <code>tool2.sh</code> (the marker it knows), but <code>sha256sum -c</code> reports both <code>tool2.sh</code> and <code>tool3.sh</code> as changed. At the end <code>dpkg -V coreutils</code> prints nothing while the system is clean, and after one line is appended to <code>/bin/true</code> it prints <code>??5??????  /bin/true</code> — the <code>5</code> means the MD5 checksum differs. (Honest limit: a rootkit that controls the kernel can lie to <code>dpkg</code> too — run checks from trusted media.)</p>
<p>🧭 For servers: AIDE/Tripwire for file integrity, <code>rpm -V</code>/<code>dpkg -V</code>, container image <em>digests</em> (<code>image@sha256:…</code> pins exactly the bytes you tested), and signed packages. For uploads (a backend accepting user files): scan with ClamAV in a sandboxed worker and never serve uploaded files from the app's own origin with their original content type.</p>
<p class="pitfall">⚠️ FE-style: a signature scanner cannot detect a <em>zero-day</em> (never seen) virus; integrity checking can notice the <em>change</em> but not say the change was malicious.</p>`,
        `<p class="y-chinh">🎯 Hình 9-33: virus cố tránh <strong>bộ quét virus</strong> thế nào — (a) chương trình sạch; (b) chương trình nhiễm, <em>dài hơn</em> (tệp dài hơn — dấu hiệu dễ lộ); (c) chương trình nhiễm <strong>được nén</strong> (kích thước ban đầu trở lại — virus nén vật chủ để giấu độ phình), kèm bộ giải nén; (d) <strong>virus mã hoá</strong> (bộ mã hoá, khoá, bộ giải mã — chỉ bộ giải mã nhỏ là không đổi); (e) <strong>virus nén với mã nén được mã hoá</strong>. Mỗi bước giấu thêm byte mà bộ quét có thể nhận ra.</p>
<p>Bộ quét virus làm việc như an ninh sân bay với cuốn sổ ảnh những kẻ gây rối đã biết: nó so từng tệp với cơ sở dữ liệu <strong>chữ ký</strong> (mẫu byte của virus đã biết). Nó bỏ sót cái không có trong sổ; phải cập nhật hằng ngày; và có thể báo nhầm. Cuộc chạy đua của sách: virus đáp lại bằng nén (giữ độ dài), mã hoá (để thân không có byte cố định) và — slide sau — <em>đa hình (polymorphism)</em> (chính bộ giải mã luôn đổi).</p>
<p>Ba họ phát hiện cần phân biệt: <strong>chữ ký</strong> (biết byte), <strong>kiểm tra toàn vẹn</strong> (biết trạng thái <em>tốt</em>; mọi thay đổi đều đáng ngờ — thí nghiệm kế tiếp), và <strong>hành vi</strong> (xem chương trình làm gì: mã hoá hàng loạt tệp, đụng tới <code>/etc/shadow</code>; các sản phẩm EDR ngày nay và công cụ eBPF mức nhân như Falco), cộng danh tiếng trên đám mây và học máy. Kiểm tra toàn vẹn có một tính chất thanh lịch: nó <em>không cần biết virus nào</em>.</p>
<p>Chạy ba bộ phát hiện với một "biến thể" mới của dấu hiệu vô hại của ta (lần chạy slide 38, nửa sau): bộ quét chữ ký mù trước biến thể, còn danh sách checksum bắt cả hai lần nhiễm. Rồi cùng ý đó trên cả một hệ điều hành — <code>dpkg -V</code> so mọi tệp của một gói với checksum lưu lúc cài:</p>
<div class="out"># Slide 36-38 và 45-46: lây nhiễm làm tệp phình ra; bộ quét so chữ ký; kiểm tra toàn vẹn bắt cái chữ ký bỏ lọt. KHÔNG có mã độc: "lây nhiễm" chỉ là một dòng đánh dấu vô hại nối vào tệp văn bản<br>
$ mkdir -p /tmp/may &amp;&amp; cd /tmp/may<br>
$ for i in 1 2 3; do printf '#!/bin/sh\\necho hello from tool %s\\n' $i &gt; tool$i.sh; done<br>
# bước 1 — quản trị viên ghi dấu vân tay của mọi chương trình khi hệ thống còn sạch (AIDE/Tripwire làm đúng việc này)<br>
$ sha256sum tool*.sh &gt; sach.sha256; ls -l tool*.sh | awk '{print $5, $9}'<br>
33 tool1.sh<br>
33 tool2.sh<br>
33 tool3.sh<br>
# bước 2 — "lây nhiễm": tệp dài thêm một dòng đánh dấu (Hình 9-33b: chương trình bị nhiễm DÀI hơn)<br>
$ echo '# CTW-TEST-MARKER-0001 (harmless test marker)' &gt;&gt; tool2.sh<br>
$ ls -l tool*.sh | awk '{print $5, $9}'<br>
33 tool1.sh<br>
79 tool2.sh<br>
33 tool3.sh<br>
# bộ quét CHỮ KÝ tìm các byte đã biết: nó thấy dấu hiệu mà nó biết<br>
$ grep -l 'CTW-TEST-MARKER-0001' tool*.sh<br>
tool2.sh<br>
# bộ kiểm TOÀN VẸN không cần biết dấu hiệu gì cả<br>
$ sha256sum -c sach.sha256 2&gt;&amp;1 | grep -v ': OK'<br>
tool2.sh: FAILED<br>
sha256sum: WARNING: 1 computed checksum did NOT match<br>
# bước 3 — một "biến thể mới": cùng tác dụng, byte khác (ý của Hình 9-34). Bộ quét chữ ký mù, bộ kiểm toàn vẹn thì không<br>
$ printf '#!/bin/sh\\necho hello from tool 3\\n' &gt; tool3.sh; echo '# ctw-test-marker-0002' &gt;&gt; tool3.sh<br>
$ grep -l 'CTW-TEST-MARKER-0001' tool*.sh<br>
tool2.sh<br>
$ sha256sum -c sach.sha256 2&gt;&amp;1 | grep -v ': OK'<br>
tool2.sh: FAILED<br>
tool3.sh: FAILED<br>
sha256sum: WARNING: 2 computed checksums did NOT match<br>
# cùng ý đó cho cả hệ điều hành: dpkg giữ checksum của mọi tệp của mọi gói<br>
$ dpkg -V coreutils; echo "dpkg -V: no output above = every file of coreutils is exactly as packaged"<br>
dpkg -V: no output above = every file of coreutils is exactly as packaged<br>
$ echo '# tampered' &gt;&gt; /bin/true<br>
$ dpkg -V coreutils<br>
??5?????? &nbsp;&nbsp;/bin/true</div>
<p>Sau bước "biến thể mới", <code>grep</code> vẫn chỉ liệt kê <code>tool2.sh</code> (dấu hiệu nó biết), nhưng <code>sha256sum -c</code> báo cả <code>tool2.sh</code> lẫn <code>tool3.sh</code> đã đổi. Cuối cùng <code>dpkg -V coreutils</code> không in gì khi hệ thống sạch, và sau khi thêm một dòng vào <code>/bin/true</code> nó in <code>??5??????  /bin/true</code> — chữ <code>5</code> nghĩa là checksum MD5 khác. (Giới hạn trung thực: rootkit kiểm soát nhân có thể nói dối cả <code>dpkg</code> — chạy kiểm tra từ phương tiện đáng tin.)</p>
<p>🧭 Cho máy chủ: AIDE/Tripwire cho toàn vẹn tệp, <code>rpm -V</code>/<code>dpkg -V</code>, <em>digest</em> của ảnh container (<code>image@sha256:…</code> ghim đúng các byte bạn đã thử), và gói có ký. Cho tải lên (backend nhận tệp người dùng): quét bằng ClamAV trong worker có hộp cát và không bao giờ phục vụ tệp tải lên từ chính origin của ứng dụng với content type gốc.</p>
<p class="pitfall">⚠️ Kiểu FE: bộ quét chữ ký không phát hiện được virus <em>zero-day</em> (chưa từng thấy); kiểm tra toàn vẹn nhận ra <em>thay đổi</em> nhưng không nói được thay đổi đó có độc hại không.</p>`],
      [46, 'Virus Scanners (2)',
        `<p class="y-chinh">🎯 Figure 9-34: examples of a <strong>polymorphic virus</strong> — five versions of the same tiny routine (compute X = A + B + C − 4). Version (a) is the plain code; (b) inserts <code>NOP</code>s; (c) adds do-nothing arithmetic (<code>ADD #0</code>, <code>OR R1,R1</code>, <code>SHL #0</code>) and a jump to the next instruction; (d) and (e) also reorder independent instructions and use a spare register. The <em>bytes</em> differ in every copy; the <em>effect</em> is identical — so a pattern match on bytes fails.</p>
<p>The same sentence written five ways: "Pay Bob 100", "Please pay Bob 100", "Bob is to be paid 100" — a clerk who only looks for one exact spelling misses the other four. A polymorphic virus carries a <strong>mutation engine</strong> that rewrites its own decryptor into an equivalent but different form in each infection. Our toy interpreter runs the five figure versions (A=10, B=20, C=30) and fingerprints each one:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d42cedafb024e02517ed3b18b51baf88c01f3eec.svg" alt="Five spellings, one result: X = 56 each time, five different signatures" loading="lazy" /><p class="chu-thich">🧮 Five spellings, one result: X = 56 each time, five different signatures</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BIEN = { A: 10, B: 20, C: 30 };
const DOAN = {
  a: ['MOV A,R1', 'ADD B,R1', 'ADD C,R1', 'SUB #4,R1', 'MOV R1,X'],
  b: ['MOV A,R1', 'NOP', 'ADD B,R1', 'NOP', 'ADD C,R1', 'NOP', 'SUB #4,R1', 'NOP', 'MOV R1,X'],
  c: ['MOV A,R1', 'ADD #0,R1', 'ADD B,R1', 'OR R1,R1', 'ADD C,R1', 'SHL #0,R1', 'SUB #4,R1', 'JMP .+1', 'MOV R1,X'],
  d: ['MOV A,R1', 'OR R1,R1', 'ADD B,R1', 'MOV R1,R5', 'ADD C,R1', 'SHL R1,0', 'SUB #4,R1', 'ADD R5,R5', 'MOV R1,X', 'MOV R5,Y'],
  e: ['MOV A,R1', 'TST R1', 'ADD C,R1', 'MOV R1,R5', 'ADD B,R1', 'CMP R2,R5', 'SUB #4,R1', 'JMP .+1', 'MOV R1,X', 'MOV R5,Y'],
};
function chay(prog) {
  const reg = { R1: 0, R2: 0, R5: 0 }, mem = { ...BIEN };
  const lay = (s) =&gt; (s.startsWith('#') ? Number(s.slice(1)) : s in reg ? reg[s] : s in mem ? mem[s] : Number(s));
  const dat = (s, v) =&gt; { if (s in reg) reg[s] = v; else mem[s] = v; };
  for (const ins of prog) {
    const [op, args = ''] = ins.split(/ (.*)/);
    const [a, b] = args.split(',');
    if (op === 'MOV') dat(b, lay(a));
    else if (op === 'ADD') dat(b, lay(b) + lay(a));
    else if (op === 'SUB') dat(b, lay(b) - lay(a));
    else if (op === 'OR') dat(b, lay(b) | lay(a));
    else if (op === 'SHL') dat(a.startsWith('#') ? b : a, lay(a.startsWith('#') ? b : a) &lt;&lt; Number(a.startsWith('#') ? a.slice(1) : b));   // dịch 0 bit
    // NOP, TST, CMP, JMP .+1: không đổi X (TST/CMP chỉ đặt cờ, JMP .+1 nhảy sang lệnh kế)
  }
  return mem.X;
}
const chuKy = (prog) =&gt; { let h = 0x811c9dc5; for (const ch of prog.join(';')) { h ^= ch.charCodeAt(0); h = Math.imul(h, 0x01000193) &gt;&gt;&gt; 0; } return h.toString(16).padStart(8, '0'); };   // FNV-1a</code></pre></details>
<p>Five instruction sequences, five different fingerprints, <strong>one</strong> result (56). The scanner holding the signature of (a) misses (b)–(e). The scanner's answers: (1) <strong>emulation / sandboxing</strong> — run the suspect code in a virtual machine for a moment and look at what it <em>does</em> (the decryptor eventually produces the same body every time); (2) <strong>behaviour</strong> and <strong>heuristics</strong> (mass file writes, self-modifying code); (3) <strong>integrity checking</strong> as on the previous slide; (4) ML on features. The book's wry remark stays true: it is an arms race between virus writers and scanner writers, and the defender needs to win every round.</p>
<p>➕ Also note why "compile → identical bytes" is a security feature: <strong>reproducible builds</strong> (slide 34) make the legitimate program have <em>one</em> well-known fingerprint, so anything else is suspect — the opposite of polymorphism, used for good.</p>
<p class="pitfall">⚠️ Polymorphic ≠ metamorphic: polymorphic code <em>encrypts</em> the body with varying decryptors (the body is the same once decrypted); metamorphic code <em>rewrites its whole body</em> every time. FE-style definitions.</p>`,
        `<p class="y-chinh">🎯 Hình 9-34: ví dụ <strong>virus đa hình (polymorphic)</strong> — năm phiên bản của cùng một thủ tục nhỏ (tính X = A + B + C − 4). Phiên bản (a) là mã trơn; (b) chèn <code>NOP</code>; (c) thêm phép tính vô tác dụng (<code>ADD #0</code>, <code>OR R1,R1</code>, <code>SHL #0</code>) và một lệnh nhảy tới lệnh kế; (d) và (e) còn đổi thứ tự các lệnh độc lập và dùng thanh ghi dự phòng. <em>Byte</em> khác nhau ở mỗi bản sao; <em>tác dụng</em> y hệt — nên đối khớp mẫu byte thất bại.</p>
<p>Cùng một câu viết năm cách: "Pay Bob 100", "Please pay Bob 100", "Bob is to be paid 100" — một thư ký chỉ tìm một cách viết đúng sẽ bỏ sót bốn cách kia. Virus đa hình mang một <strong>động cơ đột biến (mutation engine)</strong> viết lại chính bộ giải mã của nó thành dạng tương đương nhưng khác ở mỗi lần nhiễm. Bộ thông dịch đồ chơi của ta chạy năm phiên bản của hình (A=10, B=20, C=30) và lấy dấu vân tay từng cái:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/594563333be9db3654eba702f3f4341677454e95.svg" alt="Năm cách viết, một kết quả: X = 56 mọi lần, năm chữ ký khác nhau" loading="lazy" /><p class="chu-thich">🧮 Năm cách viết, một kết quả: X = 56 mọi lần, năm chữ ký khác nhau</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BIEN = { A: 10, B: 20, C: 30 };
const DOAN = {
  a: ['MOV A,R1', 'ADD B,R1', 'ADD C,R1', 'SUB #4,R1', 'MOV R1,X'],
  b: ['MOV A,R1', 'NOP', 'ADD B,R1', 'NOP', 'ADD C,R1', 'NOP', 'SUB #4,R1', 'NOP', 'MOV R1,X'],
  c: ['MOV A,R1', 'ADD #0,R1', 'ADD B,R1', 'OR R1,R1', 'ADD C,R1', 'SHL #0,R1', 'SUB #4,R1', 'JMP .+1', 'MOV R1,X'],
  d: ['MOV A,R1', 'OR R1,R1', 'ADD B,R1', 'MOV R1,R5', 'ADD C,R1', 'SHL R1,0', 'SUB #4,R1', 'ADD R5,R5', 'MOV R1,X', 'MOV R5,Y'],
  e: ['MOV A,R1', 'TST R1', 'ADD C,R1', 'MOV R1,R5', 'ADD B,R1', 'CMP R2,R5', 'SUB #4,R1', 'JMP .+1', 'MOV R1,X', 'MOV R5,Y'],
};
function chay(prog) {
  const reg = { R1: 0, R2: 0, R5: 0 }, mem = { ...BIEN };
  const lay = (s) =&gt; (s.startsWith('#') ? Number(s.slice(1)) : s in reg ? reg[s] : s in mem ? mem[s] : Number(s));
  const dat = (s, v) =&gt; { if (s in reg) reg[s] = v; else mem[s] = v; };
  for (const ins of prog) {
    const [op, args = ''] = ins.split(/ (.*)/);
    const [a, b] = args.split(',');
    if (op === 'MOV') dat(b, lay(a));
    else if (op === 'ADD') dat(b, lay(b) + lay(a));
    else if (op === 'SUB') dat(b, lay(b) - lay(a));
    else if (op === 'OR') dat(b, lay(b) | lay(a));
    else if (op === 'SHL') dat(a.startsWith('#') ? b : a, lay(a.startsWith('#') ? b : a) &lt;&lt; Number(a.startsWith('#') ? a.slice(1) : b));   // dịch 0 bit
    // NOP, TST, CMP, JMP .+1: không đổi X (TST/CMP chỉ đặt cờ, JMP .+1 nhảy sang lệnh kế)
  }
  return mem.X;
}
const chuKy = (prog) =&gt; { let h = 0x811c9dc5; for (const ch of prog.join(';')) { h ^= ch.charCodeAt(0); h = Math.imul(h, 0x01000193) &gt;&gt;&gt; 0; } return h.toString(16).padStart(8, '0'); };   // FNV-1a</code></pre></details>
<p>Năm dãy lệnh, năm dấu vân tay khác nhau, <strong>một</strong> kết quả (56). Bộ quét giữ chữ ký của (a) bỏ lọt (b)–(e). Câu trả lời của bộ quét: (1) <strong>giả lập / hộp cát</strong> — chạy mã đáng ngờ trong máy ảo một lúc và xem nó <em>làm gì</em> (bộ giải mã rốt cuộc luôn ra cùng thân); (2) <strong>hành vi</strong> và <strong>heuristic</strong> (ghi tệp hàng loạt, mã tự sửa); (3) <strong>kiểm tra toàn vẹn</strong> như slide trước; (4) học máy trên đặc trưng. Nhận xét châm biếm của sách vẫn đúng: đó là cuộc chạy đua giữa người viết virus và người viết bộ quét, và người phòng thủ phải thắng mọi vòng.</p>
<p>➕ Cũng lưu ý vì sao "dịch → byte giống hệt" là một tính năng bảo mật: <strong>bản dựng tái lập (reproducible builds)</strong> (slide 34) làm chương trình hợp pháp có <em>một</em> dấu vân tay nổi tiếng, nên mọi thứ khác đều đáng ngờ — ngược với đa hình, dùng vào việc tốt.</p>
<p class="pitfall">⚠️ Đa hình (polymorphic) ≠ biến hình (metamorphic): mã đa hình <em>mã hoá</em> thân bằng các bộ giải mã đổi thay (giải mã xong thân vẫn như cũ); mã biến hình <em>viết lại toàn bộ thân</em> mỗi lần. Định nghĩa kiểu FE.</p>`],
      [47, 'Code Signing',
        `<p class="y-chinh">🎯 Figure 9-35: <strong>code signing</strong>. The software vendor computes <code>H = hash(Program)</code> and <code>Signature = encrypt(H)</code> with its <em>private</em> key and ships program + signature over the Internet. The user computes <code>H1 = hash(Program)</code>, <code>H2 = decrypt(Signature)</code> with the vendor's <em>public</em> key and <strong>accepts the program only if H1 = H2</strong>. It is slide 22's digital signature applied to software.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/35d727f51b44df8f7cea04dc819388dd53750586.svg" alt="Figure 9-35 as a sequence diagram: the network is untrusted, the signature is checked at the end" loading="lazy" /><p class="chu-thich">🧩 Figure 9-35 as a sequence diagram: the network is untrusted, the signature is checked at the end</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 47 (Figure 9-35): code signing
participant "Software vendor" as V
participant "Internet / mirror / CDN\\n(untrusted)" as N
participant "User's computer\\n(trusts the vendor's PUBLIC key)" as U
V -&gt; V : H = hash(program)
V -&gt; V : signature = sign(H, PRIVATE key)
V -&gt; N : program + signature
N -&gt; U : program + signature  (maybe altered on the way)
U -&gt; U : H1 = hash(program received)
U -&gt; U : H2 = verify(signature, PUBLIC key)
alt H1 == H2
  U -&gt; U : accept and run
else different
  U -&gt; U : refuse: altered, or signed by someone else
end
note over U
  This protects integrity and origin, not quality:
  a vendor can sign buggy or even malicious code.
end note
@enduml</code></pre></details>
<p>It answers two questions at once: <em>has it been changed on the way</em> (integrity — a mirror, a CDN or a man-in-the-middle altered it) and <em>who published it</em> (authenticity). It does <strong>not</strong> say the code is <em>good</em> — a vendor can sign malware, a stolen signing key signs anything (Stuxnet used stolen driver certificates). So code signing moves the trust question to "which keys do I trust, and who protects them?" — the <em>public-key infrastructure</em> and <em>certificate authorities</em> of the book.</p>
<p>You have already seen the mechanism work in slide 22's run: the signature on <code>chuong-trinh.bin</code> verified, and after a single appended line it failed. Here is the whole real-world chain it supports:</p>
<ul>
<li><strong>Operating system</strong>: <code>apt</code>/<code>dnf</code> verify GPG signatures of repository metadata and packages; Windows Authenticode, macOS notarisation, Android/iOS app signing; UEFI Secure Boot (slide 39) signs boot loaders and drivers.</li>
<li><strong>Source and builds</strong>: <code>git commit -S</code>/<code>git tag -s</code>, GitHub "Verified" badges, Sigstore/<code>cosign</code> for container images, npm package <em>provenance</em> attestations, Maven Central requiring GPG signatures.</li>
<li><strong>Your own service</strong>: pin image <em>digests</em> in <code>docker-compose</code>/Kubernetes, verify signatures in CI before deploying, keep the signing key in a hardware token or CI secret store, <em>rotate</em> it, and have a revocation plan.</li>
</ul>
<p>🧭 The course's own deploy script (<code>deploy-nha.sh</code>) builds images at home and ships them to the VPS through a registry by tag and digest; adding signature verification on the VPS side is the natural next hardening step against a tampered registry.</p>
<p class="pitfall">⚠️ "Signed" ≠ "safe". It tells you <em>who</em> and <em>unchanged</em>; whether you should trust that who is a separate decision.</p>`,
        `<p class="y-chinh">🎯 Hình 9-35: <strong>ký mã (code signing)</strong>. Nhà cung cấp phần mềm tính <code>H = hash(Program)</code> và <code>Signature = encrypt(H)</code> bằng khoá <em>riêng</em> của mình rồi gửi chương trình + chữ ký qua Internet. Người dùng tính <code>H1 = hash(Program)</code>, <code>H2 = decrypt(Signature)</code> bằng khoá <em>công khai</em> của nhà cung cấp và <strong>chỉ chấp nhận chương trình nếu H1 = H2</strong>. Đó là chữ ký số của slide 22 áp cho phần mềm.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/35d727f51b44df8f7cea04dc819388dd53750586.svg" alt="Hình 9-35 dạng sơ đồ tuần tự: mạng không đáng tin, chữ ký được kiểm ở cuối" loading="lazy" /><p class="chu-thich">🧩 Hình 9-35 dạng sơ đồ tuần tự: mạng không đáng tin, chữ ký được kiểm ở cuối</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 47 (Hình 9-35): ký mã
participant "Software vendor" as V
participant "Internet / mirror / CDN\\n(untrusted)" as N
participant "User's computer\\n(trusts the vendor's PUBLIC key)" as U
V -&gt; V : H = hash(program)
V -&gt; V : signature = sign(H, PRIVATE key)
V -&gt; N : program + signature
N -&gt; U : program + signature  (maybe altered on the way)
U -&gt; U : H1 = hash(program received)
U -&gt; U : H2 = verify(signature, PUBLIC key)
alt H1 == H2
  U -&gt; U : accept and run
else different
  U -&gt; U : refuse: altered, or signed by someone else
end
note over U
  This protects integrity and origin, not quality:
  a vendor can sign buggy or even malicious code.
end note
@enduml</code></pre></details>
<p>Nó trả lời hai câu cùng lúc: <em>có bị đổi trên đường không</em> (toàn vẹn — một mirror, CDN hay kẻ đứng giữa đã sửa) và <em>ai phát hành</em> (xác thực nguồn). Nó <strong>không</strong> nói mã <em>tốt</em> — nhà cung cấp có thể ký mã độc, khoá ký bị trộm ký được mọi thứ (Stuxnet dùng chứng chỉ driver bị trộm). Nên ký mã chuyển câu hỏi niềm tin thành "tôi tin những khoá nào, và ai bảo vệ chúng?" — <em>hạ tầng khoá công khai</em> và <em>tổ chức cấp chứng chỉ</em> của sách.</p>
<p>Bạn đã thấy cơ chế hoạt động ở lần chạy slide 22: chữ ký trên <code>chuong-trinh.bin</code> xác minh được, và sau khi nối một dòng thì thất bại. Đây là cả chuỗi ngoài đời nó nâng đỡ:</p>
<ul>
<li><strong>Hệ điều hành</strong>: <code>apt</code>/<code>dnf</code> xác minh chữ ký GPG của siêu dữ liệu kho và gói; Authenticode của Windows, notarisation của macOS, ký ứng dụng Android/iOS; UEFI Secure Boot (slide 39) ký bộ nạp khởi động và driver.</li>
<li><strong>Mã nguồn và bản dựng</strong>: <code>git commit -S</code>/<code>git tag -s</code>, huy hiệu "Verified" của GitHub, Sigstore/<code>cosign</code> cho ảnh container, chứng thực <em>nguồn gốc (provenance)</em> của gói npm, Maven Central bắt buộc chữ ký GPG.</li>
<li><strong>Dịch vụ của bạn</strong>: ghim <em>digest</em> ảnh trong <code>docker-compose</code>/Kubernetes, xác minh chữ ký trong CI trước khi triển khai, giữ khoá ký trong token phần cứng hay kho bí mật của CI, <em>xoay vòng</em> nó, và có kế hoạch thu hồi.</li>
</ul>
<p>🧭 Script triển khai của chính khoá học (<code>deploy-nha.sh</code>) dựng ảnh ở nhà và gửi lên VPS qua một registry theo tag và digest; thêm xác minh chữ ký phía VPS là bước làm cứng tự nhiên kế tiếp chống registry bị giả mạo.</p>
<p class="pitfall">⚠️ "Đã ký" ≠ "an toàn". Nó cho bạn biết <em>ai</em> và <em>không đổi</em>; có nên tin người đó hay không là quyết định riêng.</p>`],
      [48, 'Jailing',
        `<p class="y-chinh">🎯 Figure 9-36: a <strong>jail</strong>. A trusted <strong>jailer</strong> process starts an untrusted <strong>prisoner</strong> in a restricted environment: the prisoner sees a different file-system root, so it can only open files inside the jail; every system call it makes (<em>Sys</em>) goes through the kernel, which consults the jailer's restrictions. FreeBSD <code>jail</code>, Unix <code>chroot</code> and, in modern form, Linux <strong>namespaces + cgroups</strong> (containers) are the descendants.</p>
<p>A prisoner in a cell with a window onto a courtyard: he can walk the courtyard but cannot see the town. We build the smallest possible jail — a directory with just <code>ls</code>, <code>cat</code> and their libraries — and run programs in it with <code>chroot</code>:</p>
<div class="out"># Slide 48 (Figure 9-36): a jail — the prisoner sees a different file system root<br>
# build a tiny jail with just /bin/ls, /bin/cat and the libraries they need<br>
$ mkdir -p /jail/etc<br>
$ echo "this file lives INSIDE the jail" &gt; /jail/etc/ghi-chu.txt<br>
$ for p in /bin/ls /bin/cat; do cp --parents "$p" /jail; for l in $(ldd "$p" | grep -o '/[^ ]*'); do cp --parents "$l" /jail; done; done<br>
# the jailer (root) runs the prisoner with / changed to /jail<br>
$ chroot /jail /bin/ls /etc<br>
ghi-chu.txt<br>
$ chroot /jail /bin/cat /etc/ghi-chu.txt<br>
this file lives INSIDE the jail<br>
# the real /etc/passwd does not exist in the prisoner's world<br>
$ chroot /jail /bin/cat /etc/passwd; echo "exit=$?"<br>
/bin/cat: /etc/passwd: No such file or directory<br>
exit=1<br>
# the prisoner has no shell, no compiler, no network tools: nothing to attack with<br>
$ chroot /jail /bin/sh -c true; echo "exit=$?"<br>
chroot: failed to run command ‘/bin/sh’: No such file or directory<br>
exit=127<br>
# chroot only changes where path lookup starts. A prisoner that is still ROOT and keeps CAP_SYS_CHROOT is not safely held — man7.org/linux/man-pages/man2/chroot.2.html says chroot is not a security mechanism by itself</div>
<p>Inside the jail <code>/etc</code> holds only our note; the real <code>/etc/passwd</code> does not exist in the prisoner's world; even <code>/bin/sh</code> is missing, so there is no shell to attack with. This is "<strong>least privilege by shrinking the world</strong>". The caveat that matters for exams and for real systems: <code>chroot</code> changes only where <em>path lookup starts</em>. A prisoner that is still <strong>root</strong> and has the capability <code>CAP_SYS_CHROOT</code> is <em>not</em> reliably held (the man page states <code>chroot</code> is not a security mechanism by itself), and it does nothing about processes, network or memory — which is why containers add <strong>namespaces</strong> (separate process IDs, network, mounts, users), <strong>cgroups</strong> (resource limits), <strong>capabilities</strong> (slide 12) and <strong>seccomp</strong> (slide 50).</p>
<p>🧭 A Docker container is exactly this stack: <code>docker run --user 1000 --read-only --cap-drop=ALL --security-opt no-new-privileges --memory 256m …</code>. Remember the limit: containers share the host kernel, so a kernel bug can break out — high-risk multi-tenant workloads add a VM layer (gVisor, Kata Containers, Firecracker).</p>
<p class="pitfall">⚠️ FE-style: "jailing" = running an untrusted program in a restricted part of the system; chroot is the Unix mechanism, but alone it is a weak jail.</p>`,
        `<p class="y-chinh">🎯 Hình 9-36: một <strong>nhà giam (jail)</strong>. Một tiến trình <strong>cai tù (jailer)</strong> đáng tin khởi động một <strong>tù nhân (prisoner)</strong> không đáng tin trong môi trường bị hạn chế: tù nhân thấy một gốc hệ thống tệp khác nên chỉ mở được tệp trong nhà giam; mọi lời gọi hệ thống nó làm (<em>Sys</em>) đi qua nhân, nhân hỏi các hạn chế của cai tù. <code>jail</code> của FreeBSD, <code>chroot</code> của Unix và, dạng hiện đại, <strong>namespace + cgroup</strong> của Linux (container) là hậu duệ.</p>
<p>Một tù nhân trong xà lim có cửa sổ nhìn ra sân: anh đi lại được trong sân nhưng không thấy thành phố. Ta dựng nhà giam nhỏ nhất có thể — một thư mục chỉ có <code>ls</code>, <code>cat</code> và thư viện của chúng — và chạy chương trình trong đó bằng <code>chroot</code>:</p>
<div class="out"># Slide 48 (Hình 9-36): nhà giam — tù nhân thấy một gốc hệ thống tệp khác<br>
# dựng một nhà giam nhỏ chỉ có /bin/ls, /bin/cat và các thư viện chúng cần<br>
$ mkdir -p /jail/etc<br>
$ echo "this file lives INSIDE the jail" &gt; /jail/etc/ghi-chu.txt<br>
$ for p in /bin/ls /bin/cat; do cp --parents "$p" /jail; for l in $(ldd "$p" | grep -o '/[^ ]*'); do cp --parents "$l" /jail; done; done<br>
# người canh tù (root) chạy tù nhân với / đổi thành /jail<br>
$ chroot /jail /bin/ls /etc<br>
ghi-chu.txt<br>
$ chroot /jail /bin/cat /etc/ghi-chu.txt<br>
this file lives INSIDE the jail<br>
# /etc/passwd thật không tồn tại trong thế giới của tù nhân<br>
$ chroot /jail /bin/cat /etc/passwd; echo "exit=$?"<br>
/bin/cat: /etc/passwd: No such file or directory<br>
exit=1<br>
# tù nhân không có shell, không có trình biên dịch, không có công cụ mạng: không có gì để tấn công<br>
$ chroot /jail /bin/sh -c true; echo "exit=$?"<br>
chroot: failed to run command ‘/bin/sh’: No such file or directory<br>
exit=127<br>
# chroot chỉ đổi nơi việc tra đường dẫn bắt đầu. Tù nhân vẫn là ROOT và giữ CAP_SYS_CHROOT thì không bị giữ chắc chắn — man7.org/linux/man-pages/man2/chroot.2.html nói chroot tự nó không phải cơ chế bảo mật</div>
<p>Trong nhà giam, <code>/etc</code> chỉ có ghi chú của ta; <code>/etc/passwd</code> thật không tồn tại trong thế giới của tù nhân; thậm chí <code>/bin/sh</code> cũng không có, nên không có shell để tấn công. Đây là "<strong>quyền tối thiểu bằng cách thu nhỏ thế giới</strong>". Cảnh báo quan trọng cho kỳ thi và cho hệ thống thật: <code>chroot</code> chỉ đổi nơi <em>việc tra đường dẫn bắt đầu</em>. Tù nhân vẫn là <strong>root</strong> và có capability <code>CAP_SYS_CHROOT</code> thì <em>không</em> bị giữ đáng tin cậy (trang man nói <code>chroot</code> tự nó không phải cơ chế bảo mật), và nó không làm gì về tiến trình, mạng hay bộ nhớ — vì thế container thêm <strong>namespace</strong> (ID tiến trình, mạng, mount, người dùng riêng), <strong>cgroup</strong> (giới hạn tài nguyên), <strong>capability</strong> (slide 12) và <strong>seccomp</strong> (slide 50).</p>
<p>🧭 Một container Docker chính là chồng này: <code>docker run --user 1000 --read-only --cap-drop=ALL --security-opt no-new-privileges --memory 256m …</code>. Nhớ giới hạn: container dùng chung nhân với máy chủ nên lỗi nhân có thể phá vỡ ra ngoài — tải công việc nhiều bên thuê rủi ro cao thêm một lớp VM (gVisor, Kata Containers, Firecracker).</p>
<p class="pitfall">⚠️ Kiểu FE: "jailing" = chạy chương trình không tin cậy trong một phần bị hạn chế của hệ thống; chroot là cơ chế Unix, nhưng đứng một mình là nhà giam yếu.</p>`],
      [49, 'Model-Based Intrusion Detection',
        `<p class="y-chinh">🎯 Figure 9-37: (a) a small C program — it opens <code>data</code>; on failure it prints "Bad data file" and exits; otherwise it reads one byte at a time counting until a zero byte, then closes, prints <code>n</code> and exits; (b) its <strong>system-call graph</strong>: <code>open → {read, write}</code>, <code>read → {read, close}</code>, <code>close → write</code>, <code>write → exit</code>. A <strong>model-based intrusion detector</strong> builds the graph from the program (statically) and then, at run time, compares the process's actual system calls with it; <strong>a call that is not an edge of the graph raises an alarm</strong>.</p>
<p>A security guard who knows a courier's normal route — warehouse, loading bay, front desk — and raises the alarm the moment the courier heads for the vault. Why system calls? Because they are the <em>only way</em> a process can affect the outside world (slide 4's reference monitor): even a hijacked program must make system calls to do harm, and a hijacked program makes <em>different</em> ones. First get the real sequence from a real run:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_PTRACE</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 49 (Figure 9-37): model-based intrusion detection needs the program's real system-call sequence. strace shows it<br>
$ cat &gt; doc-dem.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;unistd.h&gt;<br>
&gt; #include &lt;fcntl.h&gt;<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;char buf[1]; int n = 0;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;int fd = open("data", O_RDONLY);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;if (fd &lt; 0) { puts("Bad data file"); return 1; }<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;while (1) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;read(fd, buf, 1);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (buf[0] == 0) { close(fd); printf("n = %d\\n", n); return 0; }<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n = n + 1;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;}<br>
&gt; }<br>
&gt; X<br>
$ gcc -O0 -Wall -o doc-dem doc-dem.c<br>
$ printf 'abc\\0' &gt; data<br>
$ ./doc-dem<br>
n = 3<br>
# the kernel-level truth: open, read x4, close, write, exit — the edges of the graph in Figure 9-37<br>
$ strace -o vet.txt -e trace=openat,read,close,write,exit_group ./doc-dem &gt;/dev/null; sed -n '/"data"/,$p' vet.txt<br>
openat(AT_FDCWD, "data", O_RDONLY) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 3<br>
read(3, "a", 1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 1<br>
read(3, "b", 1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 1<br>
read(3, "c", 1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 1<br>
read(3, "\\0", 1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 1<br>
close(3) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
write(1, "n = 3\\n", 6) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 6<br>
exit_group(0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ?<br>
+++ exited with 0 +++<br>
# when the data file is missing the program takes the OTHER path of the graph: open, write, exit<br>
$ rm data<br>
$ strace -o vet.txt -e trace=openat,read,close,write,exit_group ./doc-dem &gt;/dev/null; sed -n '/"data"/,$p' vet.txt<br>
openat(AT_FDCWD, "data", O_RDONLY) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= -1 ENOENT (No such file or directory)<br>
write(1, "Bad data file\\n", 14) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 14<br>
exit_group(1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ?<br>
+++ exited with 1 +++</div>
<p>With the data file present, the kernel-level trace is exactly the path of Figure 9-37b: <code>openat</code>, four <code>read</code>s (a, b, c, then the zero byte), <code>close</code>, <code>write</code>, <code>exit_group</code>. With the file missing the program takes the <em>other</em> branch of the graph: <code>openat</code> (fails), <code>write</code>, <code>exit_group</code>. Now run the detector on four traces:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c9e12c528326040202dd32b9237e9676c6ebade8.svg" alt="A trace with an extra execve is flagged at call 4" loading="lazy" /><p class="chu-thich">🧮 A trace with an extra execve is flagged at call 4</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const DO_THI = { START: ['open'], open: ['read', 'write'], read: ['read', 'close'], close: ['write'], write: ['exit'], exit: [] };
const VET = {
  normal: ['open', 'read', 'read', 'read', 'close', 'write', 'exit'],
  loi: ['open', 'write', 'exit'],
  la: ['open', 'read', 'read', 'execve', 'write', 'exit'],
  bat: ['open', 'read', 'close', 'write', 'exit'],     // vẫn nằm trong đồ thị — "mimicry": mô hình không thấy ĐỐI SỐ
};
function kiem(vet) {
  let tt = 'START'; const kq = [];
  for (let i = 0; i &lt; vet.length; i++) {
    const ok = (DO_THI[tt] || []).includes(vet[i]);
    kq.push({ goi: vet[i], tu: tt, ok });
    if (!ok) break;
    tt = vet[i];
  }
  return kq;
}</code></pre></details>
<p>The trace <code>open, read, read, execve, …</code> is flagged at its 4th call: <code>read → execve</code> is not an edge. (Try the other three traces in the exercises: the normal and error traces are accepted; a trace that stays inside the graph — <code>open, read, close, write, exit</code> — is also accepted even if the <em>file name or data</em> was malicious: this is the <strong>mimicry attack</strong>, the model's blind spot, because it sees call <em>types</em>, not arguments.)</p>
<p>➕ This idea lives on as <strong>seccomp profiles generated from observed behaviour</strong> (Docker/Kubernetes profile generators), <strong>AppArmor/SELinux learning modes</strong>, and eBPF tools such as Falco that alert on "a shell was spawned inside a web container". Cost: false alarms when the program legitimately does something new (a new branch, a plug-in).</p>
<p class="pitfall">⚠️ Model-based detection learns <em>what the program should do</em> (anomaly detection with a model of normal), unlike a signature scanner that knows <em>what viruses look like</em>.</p>`,
        `<p class="y-chinh">🎯 Hình 9-37: (a) một chương trình C nhỏ — nó mở <code>data</code>; thất bại thì in "Bad data file" và thoát; không thì đọc từng byte đếm tới khi gặp byte 0, rồi đóng, in <code>n</code> và thoát; (b) <strong>đồ thị lời gọi hệ thống</strong> của nó: <code>open → {read, write}</code>, <code>read → {read, close}</code>, <code>close → write</code>, <code>write → exit</code>. <strong>Bộ phát hiện xâm nhập theo mô hình</strong> dựng đồ thị từ chương trình (tĩnh) rồi, lúc chạy, so các lời gọi hệ thống thực tế của tiến trình với nó; <strong>lời gọi không phải một cạnh của đồ thị gây báo động</strong>.</p>
<p>Một bảo vệ biết lộ trình bình thường của người giao hàng — nhà kho, bến xếp hàng, quầy lễ tân — và báo động ngay khi người đó hướng tới két sắt. Vì sao lời gọi hệ thống? Vì chúng là <em>cách duy nhất</em> một tiến trình tác động ra thế giới bên ngoài (giám sát tham chiếu ở slide 4): ngay cả chương trình bị chiếm cũng phải gọi hệ thống để gây hại, và chương trình bị chiếm gọi những lời gọi <em>khác</em>. Trước hết lấy dãy thật từ một lần chạy thật:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_PTRACE</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 49 (Hình 9-37): phát hiện xâm nhập theo mô hình cần dãy lời gọi hệ thống thật của chương trình. strace cho thấy nó<br>
$ cat &gt; doc-dem.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;unistd.h&gt;<br>
&gt; #include &lt;fcntl.h&gt;<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;char buf[1]; int n = 0;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;int fd = open("data", O_RDONLY);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;if (fd &lt; 0) { puts("Bad data file"); return 1; }<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;while (1) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;read(fd, buf, 1);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (buf[0] == 0) { close(fd); printf("n = %d\\n", n); return 0; }<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n = n + 1;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;}<br>
&gt; }<br>
&gt; X<br>
$ gcc -O0 -Wall -o doc-dem doc-dem.c<br>
$ printf 'abc\\0' &gt; data<br>
$ ./doc-dem<br>
n = 3<br>
# sự thật ở mức nhân: open, read x4, close, write, exit — các cạnh của đồ thị trong Hình 9-37<br>
$ strace -o vet.txt -e trace=openat,read,close,write,exit_group ./doc-dem &gt;/dev/null; sed -n '/"data"/,$p' vet.txt<br>
openat(AT_FDCWD, "data", O_RDONLY) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 3<br>
read(3, "a", 1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 1<br>
read(3, "b", 1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 1<br>
read(3, "c", 1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 1<br>
read(3, "\\0", 1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 1<br>
close(3) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
write(1, "n = 3\\n", 6) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 6<br>
exit_group(0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ?<br>
+++ exited with 0 +++<br>
# khi thiếu tệp dữ liệu, chương trình đi nhánh KHÁC của đồ thị: open, write, exit<br>
$ rm data<br>
$ strace -o vet.txt -e trace=openat,read,close,write,exit_group ./doc-dem &gt;/dev/null; sed -n '/"data"/,$p' vet.txt<br>
openat(AT_FDCWD, "data", O_RDONLY) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= -1 ENOENT (No such file or directory)<br>
write(1, "Bad data file\\n", 14) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 14<br>
exit_group(1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ?<br>
+++ exited with 1 +++</div>
<p>Khi có tệp dữ liệu, vết mức nhân đúng là đường đi của Hình 9-37b: <code>openat</code>, bốn <code>read</code> (a, b, c, rồi byte 0), <code>close</code>, <code>write</code>, <code>exit_group</code>. Khi thiếu tệp, chương trình đi nhánh <em>khác</em> của đồ thị: <code>openat</code> (thất bại), <code>write</code>, <code>exit_group</code>. Giờ chạy bộ phát hiện trên một vết:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f54d2f9ec3174a12666f83fbdeacf6e0f46041e1.svg" alt="Một vết có thêm execve bị đánh dấu ở lời gọi thứ 4" loading="lazy" /><p class="chu-thich">🧮 Một vết có thêm execve bị đánh dấu ở lời gọi thứ 4</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const DO_THI = { START: ['open'], open: ['read', 'write'], read: ['read', 'close'], close: ['write'], write: ['exit'], exit: [] };
const VET = {
  normal: ['open', 'read', 'read', 'read', 'close', 'write', 'exit'],
  loi: ['open', 'write', 'exit'],
  la: ['open', 'read', 'read', 'execve', 'write', 'exit'],
  bat: ['open', 'read', 'close', 'write', 'exit'],     // vẫn nằm trong đồ thị — "mimicry": mô hình không thấy ĐỐI SỐ
};
function kiem(vet) {
  let tt = 'START'; const kq = [];
  for (let i = 0; i &lt; vet.length; i++) {
    const ok = (DO_THI[tt] || []).includes(vet[i]);
    kq.push({ goi: vet[i], tu: tt, ok });
    if (!ok) break;
    tt = vet[i];
  }
  return kq;
}</code></pre></details>
<p>Vết <code>open, read, read, execve, …</code> bị đánh dấu ở lời gọi thứ 4: <code>read → execve</code> không phải một cạnh. (Thử ba vết còn lại trong bài tập: vết bình thường và vết lỗi được chấp nhận; một vết ở lại trong đồ thị — <code>open, read, close, write, exit</code> — cũng được chấp nhận dù <em>tên tệp hay dữ liệu</em> độc hại: đó là <strong>tấn công bắt chước (mimicry)</strong>, điểm mù của mô hình, vì nó thấy <em>loại</em> lời gọi chứ không thấy đối số.)</p>
<p>➕ Ý này sống tiếp dưới dạng <strong>hồ sơ seccomp sinh từ hành vi quan sát được</strong> (bộ sinh hồ sơ cho Docker/Kubernetes), <strong>chế độ học của AppArmor/SELinux</strong>, và công cụ eBPF như Falco cảnh báo "một shell được sinh ra trong container web". Cái giá: báo động nhầm khi chương trình hợp lệ làm điều mới (nhánh mới, plug-in).</p>
<p class="pitfall">⚠️ Phát hiện theo mô hình học <em>chương trình nên làm gì</em> (phát hiện bất thường với mô hình cái bình thường), khác bộ quét chữ ký biết <em>virus trông thế nào</em>.</p>`],
      [50, 'Sandboxing',
        `<p class="y-chinh">🎯 Figure 9-38: (a) the virtual address space (256 MB here) is divided into <strong>16-MB sandboxes</strong>; each untrusted <em>applet</em> gets one (Code + Data), and a <em>reference monitor</em> lives in another; (b) before every indirect jump or store, the loader inserts a check — <code>MOV R1,S1</code>; <code>SHR #24,S1</code> (the sandbox number); <code>CMP S1,S2</code>; <code>TRAPNE</code> (trap if not equal to the applet's own sandbox); <code>JMP (R1)</code>. Untrusted code can then only touch its own 16 MB, with no hardware help — <strong>software fault isolation</strong>.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/839d8362ae5798e8d7ebe2af4d02ddaffea154bb.svg" alt="Six jumps checked against the sandbox number: three are trapped" loading="lazy" /><p class="chu-thich">🧮 Six jumps checked against the sandbox number: three are trapped</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const MB = 1 &lt;&lt; 20;
const hopCuaAddr = (a) =&gt; Math.floor(a / (16 * MB));              // = a &gt;&gt; 24
const APPLET = { 'applet 1': 1, 'applet 2': 2 };                   // mỗi applet được cấp một hộp (S2)
const LAN_NHAY = [
  ['applet 1', 17 * MB + 4096], ['applet 1', 31 * MB], ['applet 1', 40 * MB], ['applet 2', 33 * MB],
  ['applet 2', 224 * MB + 8], ['applet 1', 0],
];</code></pre></details>
<p>The table shows the arithmetic: <code>address &gt;&gt; 24</code> is the sandbox number because 2<sup>24</sup> bytes = 16 MB. An applet in sandbox 1 may jump anywhere between 16 and 32 MB; a jump to 40 MB (sandbox 2), to 0 (sandbox 0) or to 224 MB (the monitor's sandbox 14) traps. A key design point is <em>where</em> the check lives: it is added by the <em>loader</em>, not trusted to the applet, and a verifier checks the loaded code contains every check (otherwise a hostile applet would simply omit them). Today's descendants: <strong>WebAssembly</strong> (linear memory with bounds, the sandbox of every browser), <strong>Google Native Client</strong> (retired) and eBPF's in-kernel verifier.</p>
<p>The most widely deployed sandbox on a Linux server is not SFI but <strong>seccomp</strong>: a filter the kernel runs on <em>every system call</em> (a reference monitor on the syscall interface, slide 4). Here is the real thing:</p>
<div class="out"># Slide 50: sandboxing by system-call filter (seccomp-bpf) — what Docker, Chrome and systemd do. A reference monitor on EVERY system call<br>
# this container already runs under Docker's default seccomp profile: Seccomp: 2 = filter mode<br>
$ grep -E 'Seccomp|NoNewPrivs' /proc/self/status<br>
NoNewPrivs:	0<br>
Seccomp:	2<br>
Seccomp_filters:	1<br>
# even root cannot make a call the filter forbids: unshare() needs CAP_SYS_ADMIN, and Docker's filter blocks it<br>
$ unshare -U true; echo "exit=$?"<br>
unshare: unshare failed: Operation not permitted<br>
exit=1<br>
# now OUR program installs its own filter on itself: black-list getppid()<br>
$ cat _loc.c<br>
#include &lt;stdio.h&gt;<br>
#include &lt;errno.h&gt;<br>
#include &lt;string.h&gt;<br>
#include &lt;stddef.h&gt;<br>
#include &lt;unistd.h&gt;<br>
#include &lt;sys/prctl.h&gt;<br>
#include &lt;sys/syscall.h&gt;<br>
#include &lt;linux/seccomp.h&gt;<br>
#include &lt;linux/filter.h&gt;<br>
#include &lt;linux/audit.h&gt;<br>
#if defined(__aarch64__)<br>
#define ARCH AUDIT_ARCH_AARCH64<br>
#else<br>
#define ARCH AUDIT_ARCH_X86_64<br>
#endif<br>
int main(int argc, char **argv) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;unsigned verdict = argc &gt; 1 ? SECCOMP_RET_KILL_PROCESS : (SECCOMP_RET_ERRNO | EPERM); &nbsp;&nbsp;&nbsp;&nbsp;// ./loc: "no, EPERM" &nbsp;&nbsp;./loc kill: die<br>
&nbsp;&nbsp;&nbsp;&nbsp;struct sock_filter f[] = {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BPF_STMT(BPF_LD | BPF_W | BPF_ABS, offsetof(struct seccomp_data, arch)), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// load the architecture<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, ARCH, 1, 0), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// not ours? kill<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_KILL_PROCESS),<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BPF_STMT(BPF_LD | BPF_W | BPF_ABS, offsetof(struct seccomp_data, nr)), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// load the syscall number<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, SYS_getppid, 0, 1), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// is it getppid?<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BPF_STMT(BPF_RET | BPF_K, verdict), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// yes: refuse<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// anything else: allow<br>
&nbsp;&nbsp;&nbsp;&nbsp;};<br>
&nbsp;&nbsp;&nbsp;&nbsp;struct sock_fprog prog = { .len = sizeof f / sizeof f[0], .filter = f };<br>
&nbsp;&nbsp;&nbsp;&nbsp;printf("before: getppid() = %d\\n", (int)getppid());<br>
&nbsp;&nbsp;&nbsp;&nbsp;fflush(stdout);<br>
&nbsp;&nbsp;&nbsp;&nbsp;prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// required: a filter must not be a way to gain privileges<br>
&nbsp;&nbsp;&nbsp;&nbsp;if (prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, &amp;prog)) { perror("seccomp"); return 1; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;long r = syscall(SYS_getppid);<br>
&nbsp;&nbsp;&nbsp;&nbsp;printf("after : getppid() = %ld (%s)\\n", r, r &lt; 0 ? strerror(errno) : "allowed");<br>
&nbsp;&nbsp;&nbsp;&nbsp;printf("after : getpid() &nbsp;= %d (not on the black list)\\n", (int)getpid());<br>
&nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
}<br>
$ ./loc<br>
before: getppid() = 1<br>
after : getppid() = -1 (Operation not permitted)<br>
after : getpid() &nbsp;= 25 (not on the black list)<br>
# the same filter with a harsher verdict: the process is killed the moment it makes the forbidden call<br>
$ ./loc kill; echo "exit=$?"<br>
before: getppid() = 1<br>
bash: &nbsp;&nbsp;&nbsp;28 Bad system call &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./loc kill<br>
exit=159</div>
<p>Read it: (1) this container already runs under Docker's default seccomp profile (<code>Seccomp: 2</code> = filter mode) — which is why <code>unshare</code> fails with "Operation not permitted" even for root; (2) our own program installs a filter on itself with <code>prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER)</code> that blacklists <code>getppid</code>: the same process, a moment later, gets <code>EPERM</code> for that one call while <code>getpid</code> still works; (3) the same filter with verdict <code>KILL_PROCESS</code> kills the process the instant it makes the forbidden call (exit 159 = 128 + SIGSYS 31). <code>PR_SET_NO_NEW_PRIVS</code> is required first: a filter must never be a way to gain privileges (it also stops setuid programs run later from raising privileges).</p>
<p>🧭 Where you meet it: Docker's default profile blocks about 44 of the 300+ system calls; Chrome's renderer, OpenSSH's pre-auth process, systemd's <code>SystemCallFilter=</code> and Kubernetes' <code>seccompProfile: RuntimeDefault</code> all use it. For a Spring/Node service the cheap win is simply: don't run with <code>--privileged</code> or <code>seccomp=unconfined</code>.</p>
<p class="pitfall">⚠️ A syscall <em>blacklist</em> is weak (new syscalls appear); a <em>whitelist</em> (allow only what the program needs, kill the rest) is the secure design — compare the "default deny" firewall of slide 44.</p>`,
        `<p class="y-chinh">🎯 Hình 9-38: (a) không gian địa chỉ ảo (ở đây 256 MB) được chia thành các <strong>hộp cát 16 MB</strong>; mỗi <em>applet</em> không tin cậy được một hộp (Code + Data), và một <em>giám sát tham chiếu</em> ở một hộp khác; (b) trước mỗi lệnh nhảy hay ghi gián tiếp, bộ nạp chèn một phép kiểm — <code>MOV R1,S1</code>; <code>SHR #24,S1</code> (số hộp cát); <code>CMP S1,S2</code>; <code>TRAPNE</code> (bẫy nếu khác hộp của chính applet); <code>JMP (R1)</code>. Mã không tin cậy khi đó chỉ đụng được 16 MB của nó, không cần phần cứng trợ giúp — <strong>cô lập lỗi bằng phần mềm (SFI)</strong>.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/32cd827c69c00433c29ff4ad6eda0c53c684ac7f.svg" alt="Sáu lệnh nhảy được kiểm với số hộp cát: ba lệnh bị bẫy" loading="lazy" /><p class="chu-thich">🧮 Sáu lệnh nhảy được kiểm với số hộp cát: ba lệnh bị bẫy</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const MB = 1 &lt;&lt; 20;
const hopCuaAddr = (a) =&gt; Math.floor(a / (16 * MB));              // = a &gt;&gt; 24
const APPLET = { 'applet 1': 1, 'applet 2': 2 };                   // mỗi applet được cấp một hộp (S2)
const LAN_NHAY = [
  ['applet 1', 17 * MB + 4096], ['applet 1', 31 * MB], ['applet 1', 40 * MB], ['applet 2', 33 * MB],
  ['applet 2', 224 * MB + 8], ['applet 1', 0],
];</code></pre></details>
<p>Bảng cho thấy phép tính: <code>địa chỉ &gt;&gt; 24</code> là số hộp vì 2<sup>24</sup> byte = 16 MB. Applet ở hộp 1 được nhảy bất cứ đâu giữa 16 và 32 MB; nhảy tới 40 MB (hộp 2), tới 0 (hộp 0) hay tới 224 MB (hộp 14 của giám sát) bị bẫy. Điểm thiết kế then chốt là phép kiểm <em>nằm ở đâu</em>: nó do <em>bộ nạp</em> thêm vào, không tin applet, và một bộ kiểm chứng xác nhận mã đã nạp có đủ mọi phép kiểm (không thì applet thù địch sẽ bỏ chúng đi). Hậu duệ ngày nay: <strong>WebAssembly</strong> (bộ nhớ tuyến tính có biên, hộp cát của mọi trình duyệt), <strong>Google Native Client</strong> (đã ngừng) và bộ kiểm chứng trong nhân của eBPF.</p>
<p>Hộp cát được triển khai rộng nhất trên máy chủ Linux không phải SFI mà là <strong>seccomp</strong>: một bộ lọc nhân chạy trên <em>mọi lời gọi hệ thống</em> (giám sát tham chiếu trên giao diện syscall, slide 4). Đây là bản thật:</p>
<div class="out"># Slide 50: hộp cát bằng bộ lọc lời gọi hệ thống (seccomp-bpf) — việc Docker, Chrome và systemd đang làm. Giám sát tham chiếu trên MỌI lời gọi hệ thống<br>
# container này đã chạy dưới hồ sơ seccomp mặc định của Docker: Seccomp: 2 = chế độ bộ lọc<br>
$ grep -E 'Seccomp|NoNewPrivs' /proc/self/status<br>
NoNewPrivs:	0<br>
Seccomp:	2<br>
Seccomp_filters:	1<br>
# root cũng không làm được lời gọi mà bộ lọc cấm: unshare() cần CAP_SYS_ADMIN, và bộ lọc của Docker chặn nó<br>
$ unshare -U true; echo "exit=$?"<br>
unshare: unshare failed: Operation not permitted<br>
exit=1<br>
# giờ chương trình CỦA TA tự cài bộ lọc cho chính nó: đưa getppid() vào danh sách đen<br>
$ cat _loc.c<br>
#include &lt;stdio.h&gt;<br>
#include &lt;errno.h&gt;<br>
#include &lt;string.h&gt;<br>
#include &lt;stddef.h&gt;<br>
#include &lt;unistd.h&gt;<br>
#include &lt;sys/prctl.h&gt;<br>
#include &lt;sys/syscall.h&gt;<br>
#include &lt;linux/seccomp.h&gt;<br>
#include &lt;linux/filter.h&gt;<br>
#include &lt;linux/audit.h&gt;<br>
#if defined(__aarch64__)<br>
#define ARCH AUDIT_ARCH_AARCH64<br>
#else<br>
#define ARCH AUDIT_ARCH_X86_64<br>
#endif<br>
int main(int argc, char **argv) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;unsigned verdict = argc &gt; 1 ? SECCOMP_RET_KILL_PROCESS : (SECCOMP_RET_ERRNO | EPERM); &nbsp;&nbsp;&nbsp;&nbsp;// ./loc: "no, EPERM" &nbsp;&nbsp;./loc kill: die<br>
&nbsp;&nbsp;&nbsp;&nbsp;struct sock_filter f[] = {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BPF_STMT(BPF_LD | BPF_W | BPF_ABS, offsetof(struct seccomp_data, arch)), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// load the architecture<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, ARCH, 1, 0), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// not ours? kill<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_KILL_PROCESS),<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BPF_STMT(BPF_LD | BPF_W | BPF_ABS, offsetof(struct seccomp_data, nr)), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// load the syscall number<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, SYS_getppid, 0, 1), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// is it getppid?<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BPF_STMT(BPF_RET | BPF_K, verdict), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// yes: refuse<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW), &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// anything else: allow<br>
&nbsp;&nbsp;&nbsp;&nbsp;};<br>
&nbsp;&nbsp;&nbsp;&nbsp;struct sock_fprog prog = { .len = sizeof f / sizeof f[0], .filter = f };<br>
&nbsp;&nbsp;&nbsp;&nbsp;printf("before: getppid() = %d\\n", (int)getppid());<br>
&nbsp;&nbsp;&nbsp;&nbsp;fflush(stdout);<br>
&nbsp;&nbsp;&nbsp;&nbsp;prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// required: a filter must not be a way to gain privileges<br>
&nbsp;&nbsp;&nbsp;&nbsp;if (prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, &amp;prog)) { perror("seccomp"); return 1; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;long r = syscall(SYS_getppid);<br>
&nbsp;&nbsp;&nbsp;&nbsp;printf("after : getppid() = %ld (%s)\\n", r, r &lt; 0 ? strerror(errno) : "allowed");<br>
&nbsp;&nbsp;&nbsp;&nbsp;printf("after : getpid() &nbsp;= %d (not on the black list)\\n", (int)getpid());<br>
&nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
}<br>
$ ./loc<br>
before: getppid() = 1<br>
after : getppid() = -1 (Operation not permitted)<br>
after : getpid() &nbsp;= 25 (not on the black list)<br>
# cùng bộ lọc với phán quyết nặng hơn: tiến trình bị giết ngay khi gọi lời gọi bị cấm<br>
$ ./loc kill; echo "exit=$?"<br>
before: getppid() = 1<br>
bash: &nbsp;&nbsp;&nbsp;28 Bad system call &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./loc kill<br>
exit=159</div>
<p>Đọc kết quả: (1) container này đã chạy dưới hồ sơ seccomp mặc định của Docker (<code>Seccomp: 2</code> = chế độ bộ lọc) — vì thế <code>unshare</code> thất bại với "Operation not permitted" ngay cả với root; (2) chương trình của ta tự cài bộ lọc cho mình bằng <code>prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER)</code> đưa <code>getppid</code> vào danh sách đen: cùng tiến trình, một lúc sau, nhận <code>EPERM</code> cho đúng lời gọi đó còn <code>getpid</code> vẫn chạy; (3) cùng bộ lọc với phán quyết <code>KILL_PROCESS</code> giết tiến trình ngay khi nó gọi lời gọi bị cấm (exit 159 = 128 + SIGSYS 31). <code>PR_SET_NO_NEW_PRIVS</code> phải đặt trước: bộ lọc không bao giờ được là đường để leo quyền (nó cũng ngăn chương trình setuid chạy sau đó nâng đặc quyền).</p>
<p>🧭 Bạn gặp nó ở: hồ sơ mặc định của Docker chặn khoảng 44 trong hơn 300 lời gọi hệ thống; renderer của Chrome, tiến trình tiền xác thực của OpenSSH, <code>SystemCallFilter=</code> của systemd và <code>seccompProfile: RuntimeDefault</code> của Kubernetes đều dùng nó. Với dịch vụ Spring/Node, chiến thắng rẻ chỉ là: đừng chạy với <code>--privileged</code> hay <code>seccomp=unconfined</code>.</p>
<p class="pitfall">⚠️ <em>Danh sách đen</em> syscall là yếu (syscall mới xuất hiện); <em>danh sách trắng</em> (chỉ cho cái chương trình cần, giết phần còn lại) mới là thiết kế an toàn — so với tường lửa "default deny" ở slide 44.</p>`],
      [51, 'Interpretation',
        `<p class="y-chinh">🎯 Figure 9-39: <strong>applets can be interpreted by a Web browser</strong>. Instead of running untrusted code directly on the CPU, the browser contains an <strong>interpreter</strong> that executes the applet's instructions one by one inside a <strong>sandbox</strong> in the browser's address space; a <em>trusted</em> applet (signed, local) may run with more rights than an <em>untrusted</em> one, and the interpreter checks every dangerous action before performing it.</p>
<p>A translator at a negotiation: the foreigner never speaks to your boss directly; every sentence passes through the interpreter, who can refuse to repeat dangerous ones. Interpretation is the strongest <em>software</em> sandbox because <strong>nothing the applet does reaches the machine unless the interpreter performs it</strong> — it can bounds-check every memory access, forbid files, limit time and memory. The price is speed (10–50× slower for plain interpretation), which is why modern engines mix interpretation with <strong>just-in-time (JIT)</strong> compilation that <em>inserts the same checks</em> into the generated machine code (and why a bug in a JIT is a favourite browser attack target).</p>
<p>The same idea runs the modern web: JavaScript in your browser, <strong>WebAssembly</strong>, the Java and .NET virtual machines, eBPF programs in the Linux kernel (verified, then JIT-compiled), Lua and expression languages embedded in servers, and "edge functions" (Cloudflare Workers run each customer's JavaScript in a V8 <em>isolate</em>).</p>
<p>🧭 <strong>Warning for backend developers: "an interpreter" is not automatically "a sandbox".</strong> Node's own documentation says its <code>vm</code> module is not a security mechanism and must not be used to run untrusted code; <code>eval</code> and template engines that evaluate expressions are code injection waiting to happen (slide 33). To run user-supplied code safely use a process-level sandbox (container with the slide 12/48/50 hardening, gVisor, Firecracker) or WebAssembly with explicit capabilities (WASI).</p>
<p class="pitfall">⚠️ Compiled-to-native is not unsafe by itself, and interpreted is not safe by itself: safety comes from the <em>mediation</em> — whether every effect goes through a checkpoint the untrusted code cannot skip (slide 4 again).</p>`,
        `<p class="y-chinh">🎯 Hình 9-39: <strong>applet có thể được trình duyệt Web thông dịch</strong>. Thay vì chạy mã không tin cậy thẳng trên CPU, trình duyệt chứa một <strong>bộ thông dịch</strong> thực thi từng lệnh của applet trong một <strong>hộp cát</strong> trong không gian địa chỉ của trình duyệt; applet <em>đáng tin</em> (có ký, cục bộ) có thể chạy với nhiều quyền hơn applet <em>không đáng tin</em>, và bộ thông dịch kiểm mọi hành động nguy hiểm trước khi thực hiện.</p>
<p>Một thông dịch viên trong cuộc đàm phán: người nước ngoài không bao giờ nói thẳng với sếp của bạn; mọi câu đi qua thông dịch viên, người có thể từ chối lặp lại câu nguy hiểm. Thông dịch là hộp cát <em>phần mềm</em> mạnh nhất vì <strong>không gì applet làm tới được máy trừ khi bộ thông dịch thực hiện</strong> — nó kiểm biên mọi truy cập bộ nhớ, cấm tệp, giới hạn thời gian và bộ nhớ được. Cái giá là tốc độ (chậm hơn 10–50 lần với thông dịch thuần), vì thế các engine hiện đại trộn thông dịch với biên dịch <strong>just-in-time (JIT)</strong> <em>chèn cùng các phép kiểm</em> vào mã máy sinh ra (và vì sao lỗi trong JIT là mục tiêu tấn công trình duyệt ưa thích).</p>
<p>Cùng ý đó chạy web hiện đại: JavaScript trong trình duyệt, <strong>WebAssembly</strong>, máy ảo Java và .NET, chương trình eBPF trong nhân Linux (kiểm chứng rồi JIT), Lua và ngôn ngữ biểu thức nhúng trong máy chủ, và "edge function" (Cloudflare Workers chạy JavaScript của từng khách trong một <em>isolate</em> V8).</p>
<p>🧭 <strong>Cảnh báo cho lập trình viên backend: "có bộ thông dịch" không tự động là "có hộp cát".</strong> Tài liệu của chính Node nói module <code>vm</code> không phải cơ chế bảo mật và không được dùng để chạy mã không tin cậy; <code>eval</code> và công cụ mẫu đánh giá biểu thức là chèn mã đang chờ xảy ra (slide 33). Để chạy mã do người dùng cung cấp an toàn, dùng hộp cát mức tiến trình (container với làm cứng ở slide 12/48/50, gVisor, Firecracker) hoặc WebAssembly với capability tường minh (WASI).</p>
<p class="pitfall">⚠️ Biên dịch ra mã gốc tự nó không không an toàn, và thông dịch tự nó không an toàn: an toàn đến từ <em>sự trung gian</em> — mọi tác dụng có đi qua một cổng kiểm mà mã không tin cậy không bỏ qua được hay không (lại slide 4).</p>`],
      [52, 'Java Security (1)',
        `<p class="y-chinh">🎯 Checks on applets include: <strong>(1)</strong> does the applet attempt to <em>forge pointers</em>? <strong>(2)</strong> does it violate access restrictions on <em>private</em> class members? <strong>(3)</strong> does it try to use a variable of one type as another? <strong>(4)</strong> does it generate stack overflows or underflows? <strong>(5)</strong> does it illegally convert variables of one type to another? Java enforces these through the <strong>language</strong> (no pointers, private members), the <strong>bytecode verifier</strong> (types, stack discipline) and <strong>run-time checks</strong> (array bounds, casts).</p>
<p>The JVM does not trust the compiler: a hostile class file need not come from <code>javac</code>, so the <em>verifier</em> re-checks the bytecode when it is loaded — every instruction is typed (<code>iadd</code> only on ints, <code>aload</code> for references), the stack depth is known at every point, and jumps land only on instruction boundaries. Together with array-bound checks, this makes the whole class of slides 29–31 <em>impossible in safe Java code</em>. Run the same ideas on a real JDK 21 (slide 53 uses the second half):</p>
<div class="out"># Slides 51-53: Java security — checks the language makes for you, and the retired SecurityManager<br>
$ javac _BaoMatJava.java 2&gt;&amp;1 | head -1<br>
_BaoMatJava.java:16: warning: [removal] SecurityManager in java.lang has been deprecated and marked for removal<br>
$ java -version 2&gt;&amp;1 | head -1<br>
openjdk version "21.0.12.1" 2026-08-18 LTS<br>
$ java -Djava.security.manager=allow _BaoMatJava 2&gt;&amp;1 | grep -v '^WARNING'<br>
1. array write refused: Index 16 out of bounds for length 16<br>
2. cast refused: class java.lang.String cannot be cast to class java.lan...<br>
3. before: osg-lab<br>
3. after : AccessControlException: access denied ("java.io.FilePermission" "/etc/hostname" "read")<br>
# the bytecode the JVM verifies (slide 52, checks 3-5: types, stack over/underflow): every instruction is typed<br>
$ javap -c -cp . _BaoMatJava | grep -E 'bastore|checkcast' | head -3<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17: bastore<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;47: checkcast &nbsp;&nbsp;&nbsp;&nbsp;#31 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// class java/lang/Integer</div>
<p>Checks (1) and (5): writing the 17th byte of a 16-byte array did not overwrite a neighbour — the JVM threw <code>ArrayIndexOutOfBoundsException: Index 16 out of bounds for length 16</code> (compare slide 29 where C overwrote the flag); casting a <code>String</code> to <code>Integer</code> threw <code>ClassCastException</code> (a forged type is caught at run time). The <code>javap</code> output at the bottom shows the typed instructions the verifier reads: <code>bastore</code> (store a byte into an array — bounds-checked) and <code>checkcast</code>.</p>
<p>🧭 For backend work this is a real argument for the JVM, Go, Rust, C#, JavaScript, Python: the <em>memory-safety</em> class of vulnerabilities (a large share of critical bugs in C/C++ code) mostly disappears, and what remains are logic bugs — injection (slide 33), authentication flaws, secrets in git. <code>sun.misc.Unsafe</code>, JNI and native libraries re-open the door: a Java program that calls into a C library is only as safe as that library.</p>
<p class="pitfall">⚠️ "Memory-safe" ≠ "secure": Java apps still suffer SQL injection, deserialization attacks (a famous Java problem), and Log4Shell (slide 32).</p>`,
        `<p class="y-chinh">🎯 Các kiểm tra với applet gồm: <strong>(1)</strong> applet có cố <em>giả mạo con trỏ</em> không? <strong>(2)</strong> có vi phạm hạn chế truy cập đối với thành viên <em>private</em> của lớp không? <strong>(3)</strong> có thử dùng biến kiểu này như kiểu khác không? <strong>(4)</strong> có sinh tràn hay cạn ngăn xếp không? <strong>(5)</strong> có chuyển kiểu biến bất hợp pháp không? Java thực thi chúng qua <strong>ngôn ngữ</strong> (không con trỏ, thành viên private), <strong>bộ kiểm chứng bytecode</strong> (kiểu, kỷ luật ngăn xếp) và <strong>kiểm tra lúc chạy</strong> (biên mảng, ép kiểu).</p>
<p>JVM không tin trình biên dịch: một tệp class thù địch không cần đến từ <code>javac</code>, nên <em>bộ kiểm chứng</em> kiểm lại bytecode khi nạp — mỗi lệnh có kiểu (<code>iadd</code> chỉ trên số nguyên, <code>aload</code> cho tham chiếu), độ sâu ngăn xếp biết ở mọi điểm, và các lệnh nhảy chỉ đáp trên ranh giới lệnh. Cùng kiểm tra biên mảng, điều này làm cả lớp lỗi ở slide 29–31 <em>không thể xảy ra trong mã Java an toàn</em>. Chạy cùng các ý trên JDK 21 thật (slide 53 dùng nửa sau):</p>
<div class="out"># Slide 51-53: bảo mật Java — những kiểm tra ngôn ngữ làm hộ bạn, và SecurityManager đã nghỉ hưu<br>
$ javac _BaoMatJava.java 2&gt;&amp;1 | head -1<br>
_BaoMatJava.java:16: warning: [removal] SecurityManager in java.lang has been deprecated and marked for removal<br>
$ java -version 2&gt;&amp;1 | head -1<br>
openjdk version "21.0.12.1" 2026-08-18 LTS<br>
$ java -Djava.security.manager=allow _BaoMatJava 2&gt;&amp;1 | grep -v '^WARNING'<br>
1. array write refused: Index 16 out of bounds for length 16<br>
2. cast refused: class java.lang.String cannot be cast to class java.lan...<br>
3. before: osg-lab<br>
3. after : AccessControlException: access denied ("java.io.FilePermission" "/etc/hostname" "read")<br>
# bytecode mà JVM kiểm chứng (slide 52, kiểm tra 3-5: kiểu, tràn/cạn ngăn xếp): mỗi lệnh đều có kiểu<br>
$ javap -c -cp . _BaoMatJava | grep -E 'bastore|checkcast' | head -3<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17: bastore<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;47: checkcast &nbsp;&nbsp;&nbsp;&nbsp;#31 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// class java/lang/Integer</div>
<p>Kiểm tra (1) và (5): ghi byte thứ 17 của mảng 16 byte không đè lên hàng xóm — JVM ném <code>ArrayIndexOutOfBoundsException: Index 16 out of bounds for length 16</code> (so slide 29, nơi C ghi đè cờ); ép <code>String</code> sang <code>Integer</code> ném <code>ClassCastException</code> (kiểu giả mạo bị bắt lúc chạy). Output <code>javap</code> ở cuối cho thấy các lệnh có kiểu mà bộ kiểm chứng đọc: <code>bastore</code> (ghi một byte vào mảng — có kiểm biên) và <code>checkcast</code>.</p>
<p>🧭 Cho công việc backend, đây là lập luận thật cho JVM, Go, Rust, C#, JavaScript, Python: lớp lỗ hổng <em>an toàn bộ nhớ</em> (phần lớn các lỗi nghiêm trọng trong mã C/C++) hầu như biến mất, và còn lại là lỗi logic — chèn lệnh (slide 33), lỗi xác thực, bí mật trong git. <code>sun.misc.Unsafe</code>, JNI và thư viện gốc mở lại cánh cửa: chương trình Java gọi vào thư viện C chỉ an toàn bằng thư viện đó.</p>
<p class="pitfall">⚠️ "An toàn bộ nhớ" ≠ "bảo mật": ứng dụng Java vẫn dính SQL injection, tấn công giải tuần tự hoá (vấn đề nổi tiếng của Java) và Log4Shell (slide 32).</p>`],
      [53, 'Java Security (2)',
        `<p class="y-chinh">🎯 Figure 9-40: protection <strong>policy</strong> in JDK 1.2 as a table of <em>(URL, signer, object, action)</em>: code from <code>www.taxprep.com</code> signed by TaxPrep may <code>Read</code> <code>/usr/susan/1040.xls</code>; <em>any</em> code (<code>*</code>) may <code>Read, Write</code> <code>/usr/tmp/*</code>; code from <code>www.microsoft.com</code> signed by Microsoft may <code>Read, Write, Delete</code> <code>/usr/susan/Office/–</code>. The decision depends on <strong>where the code came from</strong> and <strong>who signed it</strong>, not on which <em>user</em> runs it — a <strong>code-centric</strong> policy, the mirror image of Unix's user-centric one.</p>
<p>It is a protection matrix (slide 6) whose <em>rows are pieces of code</em> — (origin, signer) — instead of users. A <strong>SecurityManager</strong> consulted by the library (<code>new FileReader(...)</code> calls <code>checkRead</code>) enforces it with a <em>stack inspection</em>: access is allowed only if <em>every</em> piece of code on the call stack has the permission, so a trusted library cannot be tricked into acting for an untrusted caller. The real run:</p>
<div class="out"># Slides 51-53: Java security — checks the language makes for you, and the retired SecurityManager<br>
$ javac _BaoMatJava.java 2&gt;&amp;1 | head -1<br>
_BaoMatJava.java:16: warning: [removal] SecurityManager in java.lang has been deprecated and marked for removal<br>
$ java -version 2&gt;&amp;1 | head -1<br>
openjdk version "21.0.12.1" 2026-08-18 LTS<br>
$ java -Djava.security.manager=allow _BaoMatJava 2&gt;&amp;1 | grep -v '^WARNING'<br>
1. array write refused: Index 16 out of bounds for length 16<br>
2. cast refused: class java.lang.String cannot be cast to class java.lan...<br>
3. before: osg-lab<br>
3. after : AccessControlException: access denied ("java.io.FilePermission" "/etc/hostname" "read")<br>
# the bytecode the JVM verifies (slide 52, checks 3-5: types, stack over/underflow): every instruction is typed<br>
$ javap -c -cp . _BaoMatJava | grep -E 'bastore|checkcast' | head -3<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17: bastore<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;47: checkcast &nbsp;&nbsp;&nbsp;&nbsp;#31 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// class java/lang/Integer</div>
<p>Line 3 shows the policy in action: before the SecurityManager is installed the file <code>/etc/hostname</code> reads fine (<code>osg-lab</code>); after, the same call throws <code>AccessControlException: access denied ("java.io.FilePermission" "/etc/hostname" "read")</code> — a <code>FilePermission</code> for read is exactly an (object, right) cell of the matrix.</p>
<p>➕ <strong>Update — this mechanism is retired.</strong> The book's applets died with browsers dropping Java plug-ins; applications almost never configured the SecurityManager correctly; and it was costly to maintain. <strong>JEP 411</strong> (Java 17, 2021) deprecated it for removal and <strong>JEP 486</strong> permanently disabled it in <strong>JDK 24</strong> (March 2025) — which is why this demo runs on Java 21 with <code>-Djava.security.manager=allow</code> and prints a removal warning at compile time. The lesson did not die, the enforcement moved <em>outside</em> the JVM: containers, seccomp, SELinux/AppArmor, a non-root <code>USER</code>, cloud IAM roles, and the Java module system (<code>--add-opens</code> controls reflection into the JDK).</p>
<p>🧭 Interview framing: "Java had a code-centric permission model (SecurityManager) that was removed in JDK 24; today we sandbox the <em>process</em> instead." Also note <em>supply-chain</em> signing for Java: Maven Central requires GPG signatures, and tools like <code>jarsigner</code> / Sigstore carry the "signer" column of Figure 9-40 into the build pipeline.</p>
<p class="pitfall">⚠️ FE-style: the policy of Figure 9-40 depends on <em>code origin and signer</em>; Unix's depends on the <em>user</em>. Don't mix them up.</p>`,
        `<p class="y-chinh">🎯 Hình 9-40: <strong>chính sách</strong> bảo vệ trong JDK 1.2 dạng bảng <em>(URL, người ký, đối tượng, hành động)</em>: mã từ <code>www.taxprep.com</code> do TaxPrep ký được <code>Read</code> <code>/usr/susan/1040.xls</code>; <em>mọi</em> mã (<code>*</code>) được <code>Read, Write</code> <code>/usr/tmp/*</code>; mã từ <code>www.microsoft.com</code> do Microsoft ký được <code>Read, Write, Delete</code> <code>/usr/susan/Office/–</code>. Quyết định phụ thuộc <strong>mã đến từ đâu</strong> và <strong>ai ký</strong>, không phải <em>người dùng</em> nào chạy nó — chính sách <strong>lấy mã làm trung tâm</strong>, hình ảnh phản chiếu của chính sách lấy người dùng làm trung tâm của Unix.</p>
<p>Đó là một ma trận bảo vệ (slide 6) mà <em>các hàng là các đoạn mã</em> — (nguồn, người ký) — thay vì người dùng. <strong>SecurityManager</strong> mà thư viện hỏi (<code>new FileReader(...)</code> gọi <code>checkRead</code>) thực thi nó bằng <em>kiểm tra ngăn xếp (stack inspection)</em>: truy cập chỉ được phép nếu <em>mọi</em> đoạn mã trên ngăn xếp gọi đều có quyền, nên thư viện đáng tin không bị lừa hành động thay cho bên gọi không đáng tin. Lần chạy thật:</p>
<div class="out"># Slide 51-53: bảo mật Java — những kiểm tra ngôn ngữ làm hộ bạn, và SecurityManager đã nghỉ hưu<br>
$ javac _BaoMatJava.java 2&gt;&amp;1 | head -1<br>
_BaoMatJava.java:16: warning: [removal] SecurityManager in java.lang has been deprecated and marked for removal<br>
$ java -version 2&gt;&amp;1 | head -1<br>
openjdk version "21.0.12.1" 2026-08-18 LTS<br>
$ java -Djava.security.manager=allow _BaoMatJava 2&gt;&amp;1 | grep -v '^WARNING'<br>
1. array write refused: Index 16 out of bounds for length 16<br>
2. cast refused: class java.lang.String cannot be cast to class java.lan...<br>
3. before: osg-lab<br>
3. after : AccessControlException: access denied ("java.io.FilePermission" "/etc/hostname" "read")<br>
# bytecode mà JVM kiểm chứng (slide 52, kiểm tra 3-5: kiểu, tràn/cạn ngăn xếp): mỗi lệnh đều có kiểu<br>
$ javap -c -cp . _BaoMatJava | grep -E 'bastore|checkcast' | head -3<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17: bastore<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;47: checkcast &nbsp;&nbsp;&nbsp;&nbsp;#31 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// class java/lang/Integer</div>
<p>Dòng 3 cho thấy chính sách hoạt động: trước khi cài SecurityManager tệp <code>/etc/hostname</code> đọc bình thường (<code>osg-lab</code>); sau đó cùng lời gọi ném <code>AccessControlException: access denied ("java.io.FilePermission" "/etc/hostname" "read")</code> — một <code>FilePermission</code> đọc đúng là một ô (đối tượng, quyền) của ma trận.</p>
<p>➕ <strong>Cập nhật — cơ chế này đã nghỉ hưu.</strong> Applet của sách chết cùng việc trình duyệt bỏ plug-in Java; ứng dụng gần như không bao giờ cấu hình SecurityManager đúng; và nó tốn công bảo trì. <strong>JEP 411</strong> (Java 17, 2021) đánh dấu sẽ gỡ và <strong>JEP 486</strong> vô hiệu vĩnh viễn nó ở <strong>JDK 24</strong> (3/2025) — nên bản demo này chạy trên Java 21 với <code>-Djava.security.manager=allow</code> và in cảnh báo gỡ bỏ lúc biên dịch. Bài học không chết, việc thực thi chuyển <em>ra ngoài</em> JVM: container, seccomp, SELinux/AppArmor, <code>USER</code> không phải root, vai trò IAM đám mây, và hệ module Java (<code>--add-opens</code> kiểm soát reflection vào JDK).</p>
<p>🧭 Cách nói khi phỏng vấn: "Java từng có mô hình quyền lấy mã làm trung tâm (SecurityManager) bị gỡ ở JDK 24; ngày nay ta cô lập <em>tiến trình</em> thay vào đó." Cũng lưu ý ký <em>chuỗi cung ứng</em> cho Java: Maven Central bắt buộc chữ ký GPG, và công cụ như <code>jarsigner</code> / Sigstore đưa cột "người ký" của Hình 9-40 vào đường ống dựng.</p>
<p class="pitfall">⚠️ Kiểu FE: chính sách của Hình 9-40 phụ thuộc <em>nguồn mã và người ký</em>; của Unix phụ thuộc <em>người dùng</em>. Đừng lẫn.</p>`],
      [54, 'End',
        `<p class="y-chinh">🎯 End of Chapter 9. You have followed security from the <em>design</em> of protection (domains, ACLs, capabilities, models, cryptography, authentication) to the <em>attacks</em> on real software (overflows, injection, malware) and the layered <em>defences</em> (hardening, signing, jails, sandboxes, safe languages) — all run on a real Linux.</p>
<p>The one-page version: <strong>(1)</strong> every access goes through a reference monitor; keep the trusted base small. <strong>(2)</strong> Give each process the least privilege it needs — a non-root user, dropped capabilities, a seccomp filter, a private file system (slides 5–12, 44–50). <strong>(3)</strong> Data is never code: placeholders for SQL, argument arrays for processes, <code>printf("%s", text)</code> (slides 32–33). <strong>(4)</strong> Passwords are stored with a salted, slow hash (argon2id/bcrypt/scrypt); add a second factor; prefer origin-bound passkeys (slides 25–27). <strong>(5)</strong> Prefer memory-safe languages; if you must use C, compile with canaries, FORTIFY, ASLR/PIE, NX and run sanitizers in CI (29–31). <strong>(6)</strong> Verify what you run: signatures, fingerprints, reproducible builds, pinned digests (34, 45–47). <strong>(7)</strong> Assume a layer will fail: defence in depth, logs, alerts, and immutable redeploy.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/e8c0c4181cd09f6dc1c5f6c312e76d7c5f31a06c.svg" alt="Defence in depth for a backend service — every layer limits what the previous one lets through" loading="lazy" /><p class="chu-thich">🧩 Defence in depth for a backend service — every layer limits what the previous one lets through</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 54: defence in depth for a backend service — no single wall
left to right direction
rectangle "Internet" as I
rectangle "Firewall /\\nsecurity group\\n(only 443)" as F
rectangle "TLS +\\nauthentication\\n(JWT / OAuth)" as T
rectangle "Authorization\\n(roles, ownership)" as Z
rectangle "App code:\\nvalidation,\\nparameterized SQL" as A
rectangle "Runtime limits:\\nnon-root USER, seccomp,\\nread-only fs, caps dropped" as R
database "PostgreSQL\\n(least-privilege role)" as D
I --&gt; F
F --&gt; T
T --&gt; Z
Z --&gt; A
A --&gt; R
R --&gt; D
note bottom of R : Logs, alerts, patches and signed images watch every layer.
@enduml</code></pre></details>
<p>Check yourself before moving on: can you name the CIA triad and the threat to each (slide 2), define TCB and reference monitor (4), cut a protection matrix into ACLs and C-lists (6–12), apply Bell–LaPadula and Biba (14–16), describe a covert channel (17–18), explain salt and slow hashing (25), challenge–response and TOTP (26–27), FAR/FRR (28), say what a stack canary, ASLR and NX each stop (29–31), fix a format-string, command-injection and SQL-injection bug (32–33), tell a virus, worm, trojan and rootkit apart (36–43), and say what firewalls, scanners, signing, jails, seccomp and the Java verifier do (44–53)? Then do the 🧪 practice lesson 9.C and the Chapter 9 quiz.</p>
<p class="meo">🧠 Next: Chapter 10 — Linux (and Android) from the inside. You will meet today's security features there as real code: Linux credentials and capabilities, the VFS permission checks, SELinux/AppArmor, seccomp and Android's per-app sandbox.</p>`,
        `<p class="y-chinh">🎯 Hết Chương 9. Bạn đã đi theo bảo mật từ <em>thiết kế</em> của bảo vệ (miền, ACL, capability, mô hình, mật mã, xác thực) tới các cuộc <em>tấn công</em> vào phần mềm thật (tràn, chèn lệnh, mã độc) và các <em>phòng thủ</em> nhiều lớp (làm cứng, ký, nhà giam, hộp cát, ngôn ngữ an toàn) — tất cả chạy trên Linux thật.</p>
<p>Bản một trang: <strong>(1)</strong> mọi truy cập đi qua một giám sát tham chiếu; giữ cơ sở tin cậy nhỏ. <strong>(2)</strong> Cho mỗi tiến trình quyền tối thiểu nó cần — người dùng không phải root, capability bị bỏ, bộ lọc seccomp, hệ thống tệp riêng (slide 5–12, 44–50). <strong>(3)</strong> Dữ liệu không bao giờ là mã: placeholder cho SQL, mảng đối số cho tiến trình, <code>printf("%s", chu)</code> (slide 32–33). <strong>(4)</strong> Mật khẩu lưu bằng băm có muối và chậm (argon2id/bcrypt/scrypt); thêm yếu tố thứ hai; ưu tiên passkey gắn với nguồn gốc (slide 25–27). <strong>(5)</strong> Ưu tiên ngôn ngữ an toàn bộ nhớ; nếu buộc dùng C, biên dịch với canary, FORTIFY, ASLR/PIE, NX và chạy sanitizer trong CI (29–31). <strong>(6)</strong> Xác minh cái bạn chạy: chữ ký, dấu vân tay, bản dựng tái lập, digest được ghim (34, 45–47). <strong>(7)</strong> Giả định một lớp sẽ hỏng: phòng thủ nhiều lớp, nhật ký, cảnh báo, và triển khai lại bất biến.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/e8c0c4181cd09f6dc1c5f6c312e76d7c5f31a06c.svg" alt="Phòng thủ nhiều lớp cho một dịch vụ backend — mỗi lớp giới hạn cái lớp trước cho qua" loading="lazy" /><p class="chu-thich">🧩 Phòng thủ nhiều lớp cho một dịch vụ backend — mỗi lớp giới hạn cái lớp trước cho qua</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 54: phòng thủ nhiều lớp cho một dịch vụ backend — không có bức tường duy nhất
left to right direction
rectangle "Internet" as I
rectangle "Firewall /\\nsecurity group\\n(only 443)" as F
rectangle "TLS +\\nauthentication\\n(JWT / OAuth)" as T
rectangle "Authorization\\n(roles, ownership)" as Z
rectangle "App code:\\nvalidation,\\nparameterized SQL" as A
rectangle "Runtime limits:\\nnon-root USER, seccomp,\\nread-only fs, caps dropped" as R
database "PostgreSQL\\n(least-privilege role)" as D
I --&gt; F
F --&gt; T
T --&gt; Z
Z --&gt; A
A --&gt; R
R --&gt; D
note bottom of R : Logs, alerts, patches and signed images watch every layer.
@enduml</code></pre></details>
<p>Tự kiểm trước khi đi tiếp: bạn có gọi tên được bộ ba CIA và mối đe doạ cho từng cái (slide 2), định nghĩa TCB và giám sát tham chiếu (4), cắt ma trận bảo vệ thành ACL và C-list (6–12), áp Bell–LaPadula và Biba (14–16), mô tả kênh ngầm (17–18), giải thích muối và băm chậm (25), hỏi–đáp và TOTP (26–27), FAR/FRR (28), nói canary, ASLR và NX mỗi cái chặn gì (29–31), sửa lỗi chuỗi định dạng, chèn lệnh và SQL injection (32–33), phân biệt virus, sâu, trojan và rootkit (36–43), và nói tường lửa, bộ quét, ký mã, nhà giam, seccomp và bộ kiểm chứng Java làm gì (44–53) chưa? Rồi làm bài 🧪 thực hành 9.C và quiz Chương 9.</p>
<p class="meo">🧠 Tiếp theo: Chương 10 — Linux (và Android) từ bên trong. Bạn sẽ gặp các tính năng bảo mật ngày nay ở đó dưới dạng mã thật: credential và capability của Linux, phép kiểm quyền của VFS, SELinux/AppArmor, seccomp và hộp cát theo ứng dụng của Android.</p>`],
    ]),
    books([
      ['mos4', 'Chapter 9, sections 9.7–9.9 (pp. 650–702): exploiting software (buffer overflow, format string, dangling pointers, injection, TOCTOU), insider attacks, malware, defences (firewalls, scanners, code signing, jailing, model-based detection, sandboxing, Java security); Figures 9-21 to 9-40', 'Chương 9, mục 9.7–9.9 (tr. 650–702): khai thác phần mềm (tràn bộ đệm, chuỗi định dạng, con trỏ treo, chèn lệnh, TOCTOU), tấn công từ bên trong, mã độc, phòng thủ (tường lửa, bộ quét, ký mã, nhà giam, phát hiện theo mô hình, hộp cát, bảo mật Java); Hình 9-21 tới 9-40'],
      ['man7', 'seccomp(2), prctl(2), chroot(2), ld.so(8) (LD_PRELOAD), getauxval(3) (AT_RANDOM), printf(3) (format strings), system(3), execve(2), proc(5)', 'seccomp(2), prctl(2), chroot(2), ld.so(8) (LD_PRELOAD), getauxval(3) (AT_RANDOM), printf(3) (chuỗi định dạng), system(3), execve(2), proc(5)'],
      ['kernelDocs', 'Documentation/userspace-api/seccomp_filter.rst, Documentation/security/ (LSM, SELinux), Documentation/admin-guide/sysctl/kernel.rst (randomize_va_space)', 'Documentation/userspace-api/seccomp_filter.rst, Documentation/security/ (LSM, SELinux), Documentation/admin-guide/sysctl/kernel.rst (randomize_va_space)'],
    ]),
  ].join('\n'),
};

/* ───────── 9.C — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 9: models, permissions, passwords, hardening, injection, least privilege ───────── */
const L_on_ch9 = {
  title: '9.C — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 9: models, permissions, passwords, hardening, injection, least privilege|||9.C — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Chương 9: mô hình, quyền tệp, mật khẩu, làm cứng, chèn lệnh, quyền tối thiểu',
  slug: 'osg202-on-ch9',
  type: 'VIDEO',
  description: '7 bài tập Chương 9 có lời giải chạy thật: cắt một ma trận bảo vệ mới thành ACL và danh sách capability, áp Bell–LaPadula và Biba lên tám yêu cầu, tính mode sau umask và kiểm ai đọc ghi được, tính không gian mật khẩu và thời gian vét cạn, so năm bản dựng của một chương trình tràn bộ đệm (canary, FORTIFY, AddressSanitizer), sửa ba lỗi chèn lệnh (SQL, ORDER BY, shell) và xem người dùng không phải root trong container làm được gì; kèm bảng thuật ngữ Anh–Việt và tóm tắt chương.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lesson 9.C · Practice &amp; review</span>
<h2>Seven exercises: the security chapter, computed and run</h2>
<p class="lead">Chapter 9 gives the FE few calculation questions, but it gives interviews and real jobs the most practical ones: "who can read this file?", "how do you store passwords?", "what is the bug in this line?", "why not run as root?". Exercises 1–2 are model questions with answers from a simulator, 3–4 are arithmetic checked by programs, 5–7 are hands-on Linux. Try each first (the time is a target), then open the solution. Every program runs in a throw-away container; the "bugs" are toys of ours.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>1</td><td>cut a new protection matrix into ACLs and C-lists</td><td>9.A slides 6–12</td></tr>
<tr><td>2</td><td>Bell–LaPadula and Biba on eight requests</td><td>9.A slides 14–16</td></tr>
<tr><td>3</td><td>permission bits, umask, who may read and write</td><td>9.A slides 5–9</td></tr>
<tr><td>4</td><td>password space, bits of entropy, slow hashing</td><td>9.A slide 25</td></tr>
<tr><td>5</td><td>one overflow bug, five builds: canary, FORTIFY, ASan, fix</td><td>9.B slides 29–31</td></tr>
<tr><td>6</td><td>fix SQL, ORDER BY and shell injection</td><td>9.B slide 33</td></tr>
<tr><td>7</td><td>what a non-root container user can and cannot do</td><td>9.A slides 7, 12 · 9.B slide 48</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 9 · Bài 9.C · Thực hành &amp; ôn tập</span>
<h2>Bảy bài tập: chương bảo mật, tính ra và chạy thật</h2>
<p class="lead">Chương 9 cho FE ít câu tính toán, nhưng cho phỏng vấn và công việc thật những câu thực tế nhất: "ai đọc được tệp này?", "bạn lưu mật khẩu thế nào?", "lỗi ở dòng này là gì?", "sao không chạy bằng root?". Bài 1–2 là câu hỏi mô hình với đáp án từ bộ mô phỏng, bài 3–4 là số học được chương trình kiểm, bài 5–7 là thực hành Linux. Tự làm từng bài trước (thời gian ghi kèm là mục tiêu), rồi mới mở lời giải. Mọi chương trình chạy trong container dùng một lần; các "lỗi" là đồ chơi của ta.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Bài học</th></tr></thead>
<tbody>
<tr><td>1</td><td>cắt một ma trận bảo vệ mới thành ACL và C-list</td><td>9.A slide 6–12</td></tr>
<tr><td>2</td><td>Bell–LaPadula và Biba trên tám yêu cầu</td><td>9.A slide 14–16</td></tr>
<tr><td>3</td><td>bit quyền, umask, ai đọc và ghi được</td><td>9.A slide 5–9</td></tr>
<tr><td>4</td><td>không gian mật khẩu, bit entropy, băm chậm</td><td>9.A slide 25</td></tr>
<tr><td>5</td><td>một lỗi tràn, năm bản dựng: canary, FORTIFY, ASan, sửa</td><td>9.B slide 29–31</td></tr>
<tr><td>6</td><td>sửa chèn SQL, ORDER BY và shell</td><td>9.B slide 33</td></tr>
<tr><td>7</td><td>người dùng không phải root trong container làm được và không làm được gì</td><td>9.A slide 7, 12 · 9.B slide 48</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — a new protection matrix (15 min)</h3>
<p>A company has four domains — Accountant, Developer, Admin, Intern — and six objects. Rights: Accountant: Payroll RW, Report R, Printer W. Developer: Report R, Code RWX, Printer W, Router R. Admin: Payroll R, Code R, Backup RW, Printer W, Router RW. Intern: Report R, Printer W. (a) How many cells of the matrix hold a right? (b) Write the ACL of <code>Report</code>. (c) Write the capability list of <code>Intern</code>. (d) May Developer write Report? May Admin execute Code? Who may read Payroll? (e) Which structure answers "who can read Payroll?" in one lookup, and which answers "what can Intern touch?"</p>
<details><summary>Solution — computed by the simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8e48a79a1705dc18d86acd8893ef8c8d5cca2707.svg" alt="The matrix" loading="lazy" /><p class="chu-thich">🧮 The matrix</p></div>
<p>May Developer write Report? <strong>no</strong> · May Admin execute Code? <strong>no</strong> · Who may read Payroll? <strong>NaN, NaN</strong></p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const MT = {
  doiTuong: ['Payroll', 'Report', 'Code', 'Backup', 'Printer', 'Router'],
  mien: {
    Accountant: { Payroll: 'RW', Report: 'R', Printer: 'W' },
    Developer: { Report: 'R', Code: 'RWX', Printer: 'W', Router: 'R' },
    Admin: { Payroll: 'R', Code: 'R', Backup: 'RW', Printer: 'W', Router: 'RW' },
    Intern: { Report: 'R', Printer: 'W' },
  },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/44288d5a37349a5cf86bbdc1be636a88f1609bb5.svg" alt="Cut by column: ACLs" loading="lazy" /><p class="chu-thich">🧮 Cut by column: ACLs</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const MT = {
  doiTuong: ['Payroll', 'Report', 'Code', 'Backup', 'Printer', 'Router'],
  mien: {
    Accountant: { Payroll: 'RW', Report: 'R', Printer: 'W' },
    Developer: { Report: 'R', Code: 'RWX', Printer: 'W', Router: 'R' },
    Admin: { Payroll: 'R', Code: 'R', Backup: 'RW', Printer: 'W', Router: 'RW' },
    Intern: { Report: 'R', Printer: 'W' },
  },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/65b08a91e1ff17b461865c980c011e4d9b49a59b.svg" alt="Cut by row: capability lists" loading="lazy" /><p class="chu-thich">🧮 Cut by row: capability lists</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const MT = {
  doiTuong: ['Payroll', 'Report', 'Code', 'Backup', 'Printer', 'Router'],
  mien: {
    Accountant: { Payroll: 'RW', Report: 'R', Printer: 'W' },
    Developer: { Report: 'R', Code: 'RWX', Printer: 'W', Router: 'R' },
    Admin: { Payroll: 'R', Code: 'R', Backup: 'RW', Printer: 'W', Router: 'RW' },
    Intern: { Report: 'R', Printer: 'W' },
  },
};</code></pre></details>
<ul>
<li>(a) <strong>14</strong> filled cells out of 24.</li>
<li>(b) ACL(Report) = Accountant:R, Developer:R, Intern:R — <strong>3</strong> entries.</li>
<li>(c) C-list(Intern) = Report:R, Printer:W — <strong>2</strong> entries.</li>
<li>(d) Developer writes Report: <strong>no</strong> (only R). Admin executes Code: <strong>no</strong> (only R). Readers of Payroll: <strong>Accountant, Admin</strong>.</li>
<li>(e) The <strong>ACL</strong> (column) answers "who can read Payroll?" in one lookup; the <strong>C-list</strong> (row) answers "what can Intern touch?" in one lookup. Each is a scan in the other structure.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 1 — một ma trận bảo vệ mới (15 phút)</h3>
<p>Một công ty có bốn miền — Accountant, Developer, Admin, Intern — và sáu đối tượng. Quyền: Accountant: Payroll RW, Report R, Printer W. Developer: Report R, Code RWX, Printer W, Router R. Admin: Payroll R, Code R, Backup RW, Printer W, Router RW. Intern: Report R, Printer W. (a) Có bao nhiêu ô của ma trận có quyền? (b) Viết ACL của <code>Report</code>. (c) Viết danh sách capability của <code>Intern</code>. (d) Developer có ghi được Report không? Admin có thực thi được Code không? Ai đọc được Payroll? (e) Cấu trúc nào trả lời "ai đọc được Payroll?" trong một lần tra, cấu trúc nào trả lời "Intern đụng được gì?"</p>
<details><summary>Lời giải — do bộ mô phỏng tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f2d60be6ee335741b77e6fc2069d812848e0f2c0.svg" alt="Ma trận" loading="lazy" /><p class="chu-thich">🧮 Ma trận</p></div>
<p>Developer có được ghi Report không? <strong>không</strong> · Admin có được thực thi Code không? <strong>không</strong> · Ai được đọc Payroll? <strong>NaN, NaN</strong></p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const MT = {
  doiTuong: ['Payroll', 'Report', 'Code', 'Backup', 'Printer', 'Router'],
  mien: {
    Accountant: { Payroll: 'RW', Report: 'R', Printer: 'W' },
    Developer: { Report: 'R', Code: 'RWX', Printer: 'W', Router: 'R' },
    Admin: { Payroll: 'R', Code: 'R', Backup: 'RW', Printer: 'W', Router: 'RW' },
    Intern: { Report: 'R', Printer: 'W' },
  },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3dab7037ced64701b2ae94b8b8e4452ae2b68650.svg" alt="Cắt theo cột: ACL" loading="lazy" /><p class="chu-thich">🧮 Cắt theo cột: ACL</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const MT = {
  doiTuong: ['Payroll', 'Report', 'Code', 'Backup', 'Printer', 'Router'],
  mien: {
    Accountant: { Payroll: 'RW', Report: 'R', Printer: 'W' },
    Developer: { Report: 'R', Code: 'RWX', Printer: 'W', Router: 'R' },
    Admin: { Payroll: 'R', Code: 'R', Backup: 'RW', Printer: 'W', Router: 'RW' },
    Intern: { Report: 'R', Printer: 'W' },
  },
};</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/23c23ac9fee713f0ab4c3b6e7a755a2cb36302d2.svg" alt="Cắt theo hàng: danh sách capability" loading="lazy" /><p class="chu-thich">🧮 Cắt theo hàng: danh sách capability</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const MT = {
  doiTuong: ['Payroll', 'Report', 'Code', 'Backup', 'Printer', 'Router'],
  mien: {
    Accountant: { Payroll: 'RW', Report: 'R', Printer: 'W' },
    Developer: { Report: 'R', Code: 'RWX', Printer: 'W', Router: 'R' },
    Admin: { Payroll: 'R', Code: 'R', Backup: 'RW', Printer: 'W', Router: 'RW' },
    Intern: { Report: 'R', Printer: 'W' },
  },
};</code></pre></details>
<ul>
<li>(a) <strong>14</strong> ô có quyền trên 24.</li>
<li>(b) ACL(Report) = Accountant:R, Developer:R, Intern:R — <strong>3</strong> mục.</li>
<li>(c) C-list(Intern) = Report:R, Printer:W — <strong>2</strong> mục.</li>
<li>(d) Developer ghi Report: <strong>không</strong> (chỉ R). Admin thực thi Code: <strong>không</strong> (chỉ R). Người đọc Payroll: <strong>Accountant, Admin</strong>.</li>
<li>(e) <strong>ACL</strong> (cột) trả lời "ai đọc được Payroll?" trong một lần tra; <strong>C-list</strong> (hàng) trả lời "Intern đụng được gì?" trong một lần tra. Mỗi cái là một lần quét ở cấu trúc kia.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 2 — Bell–LaPadula and Biba (10 min)</h3>
<p>Levels: 1 Public, 2 Internal, 3 Confidential, 4 Secret. A process at level 3 makes eight requests: read 1, read 3, read 4, write 1, write 3, write 4, write 2, read 2. For each, say whether Bell–LaPadula and Biba allow it. How many does BLP allow? Is it the same <em>set</em> as Biba's?</p>
<details><summary>Solution — computed by the simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/04d634d4f67f5d6f0482ba34647d2713a43cedba.svg" alt="The eight requests under both models" loading="lazy" /><p class="chu-thich">🧮 The eight requests under both models</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const MUC_P = 3;
const YEU_CAU = [['read', 1], ['read', 3], ['read', 4], ['write', 1], ['write', 3], ['write', 4], ['write', 2], ['read', 2]];</code></pre></details>
<ul>
<li>BLP allows <strong>5</strong>: read 1, read 3, read 2 (no read up) and write 3, write 4 (no write down). It denies read 4, write 1, write 2.</li>
<li>Biba also allows <strong>5</strong> but a <em>different</em> set: read 3, read 4 (no read down) and write 1, write 3, write 2 (no write up). It denies read 1, read 2, write 4.</li>
<li>The count is equal by symmetry; the sets are mirror images. At the process's own level (3) both allow read and write.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 2 — Bell–LaPadula và Biba (10 phút)</h3>
<p>Các mức: 1 Public, 2 Internal, 3 Confidential, 4 Secret. Một tiến trình ở mức 3 đưa tám yêu cầu: đọc 1, đọc 3, đọc 4, ghi 1, ghi 3, ghi 4, ghi 2, đọc 2. Với mỗi yêu cầu, nói Bell–LaPadula và Biba có cho phép không. BLP cho phép mấy yêu cầu? Có cùng <em>tập</em> với Biba không?</p>
<details><summary>Lời giải — do bộ mô phỏng tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4f38f88fafb17aa61b64f6db99c80a4bd1ec5859.svg" alt="Tám yêu cầu dưới hai mô hình" loading="lazy" /><p class="chu-thich">🧮 Tám yêu cầu dưới hai mô hình</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const MUC_P = 3;
const YEU_CAU = [['read', 1], ['read', 3], ['read', 4], ['write', 1], ['write', 3], ['write', 4], ['write', 2], ['read', 2]];</code></pre></details>
<ul>
<li>BLP cho <strong>5</strong>: đọc 1, đọc 3, đọc 2 (không đọc lên) và ghi 3, ghi 4 (không ghi xuống). Nó chặn đọc 4, ghi 1, ghi 2.</li>
<li>Biba cũng cho <strong>5</strong> nhưng một tập <em>khác</em>: đọc 3, đọc 4 (không đọc xuống) và ghi 1, ghi 3, ghi 2 (không ghi lên). Nó chặn đọc 1, đọc 2, ghi 4.</li>
<li>Số lượng bằng nhau do đối xứng; hai tập là hình ảnh phản chiếu. Ở đúng mức của tiến trình (3) cả hai đều cho đọc và ghi.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 3 — permission bits and umask (15 min)</h3>
<p>(a) Compute the mode of a new file and a new directory for umask 022, 027, 077 and 002. (b) File <code>r.txt</code> is owned by <code>alice:dev</code> with mode 640; carol is in group dev, bob is not. Who can read it, who can write it? (c) Convert <code>u=rw,g=r,o=</code> to octal, and 754 to letters. (d) FE-style: "Which file attribute specifies who can access the file and in what way?"</p>
<details><summary>Solution — run in the container</summary>
<div class="out"># Exercise 3: permission bits and umask — compute first, then let the kernel confirm<br>
# new file = 666 AND NOT umask; new directory = 777 AND NOT umask<br>
$ for u in 022 027 077 002; do printf 'umask %s -&gt; file %03o &nbsp;directory %03o\\n' $u $((0666 &amp; ~0$u)) $((0777 &amp; ~0$u)); done<br>
umask 022 -&gt; file 644 &nbsp;directory 755<br>
umask 027 -&gt; file 640 &nbsp;directory 750<br>
umask 077 -&gt; file 600 &nbsp;directory 700<br>
umask 002 -&gt; file 664 &nbsp;directory 775<br>
# the kernel agrees (umask 027 in a subshell)<br>
$ cd /tmp; (umask 027; touch f; mkdir d; stat -c '%a %A %n' f d)<br>
640 -rw-r----- f<br>
750 drwxr-x--- d<br>
# who can do what? alice owns the file, group dev, bob is only in "others"<br>
$ echo "report" &gt; r.txt; chown alice:dev r.txt; chmod 640 r.txt; stat -c '%a %A %U:%G' r.txt<br>
640 -rw-r----- alice:dev<br>
$ for u in alice carol bob; do runuser -u $u -- sh -c 'cat r.txt &gt;/dev/null 2&gt;&amp;1 &amp;&amp; echo "$(id -un): read OK" || echo "$(id -un): read DENIED"; (echo x &gt;&gt; r.txt) 2&gt;/dev/null &amp;&amp; echo "$(id -un): write OK" || echo "$(id -un): write DENIED"'; done<br>
alice: read OK<br>
alice: write OK<br>
carol: read OK<br>
carol: write DENIED<br>
bob: read DENIED<br>
bob: write DENIED<br>
# symbolic and octal are the same thing<br>
$ chmod u=rw,g=r,o= r.txt; stat -c '%a' r.txt; chmod 754 r.txt; stat -c '%a %A' r.txt<br>
640<br>
754 -rwxr-xr--</div>
<ul>
<li>(a) New file = 666 AND NOT umask: 644, 640, 600, 664. New directory = 777 AND NOT umask: 755, 750, 700, 775.</li>
<li>(b) alice (owner entry rw-): reads and writes; carol (group entry r--): reads, cannot write; bob (others ---): neither.</li>
<li>(c) <code>u=rw,g=r,o=</code> = <strong>640</strong>; 754 = <code>rwxr-xr--</code>.</li>
<li>(d) <strong>Protection</strong> (FE4#24, FE9#32).</li>
</ul>
</details>`,
    `<h3>🧪 Bài 3 — bit quyền và umask (15 phút)</h3>
<p>(a) Tính mode của tệp mới và thư mục mới với umask 022, 027, 077 và 002. (b) Tệp <code>r.txt</code> thuộc <code>alice:dev</code> với mode 640; carol thuộc nhóm dev, bob thì không. Ai đọc được, ai ghi được? (c) Đổi <code>u=rw,g=r,o=</code> sang bát phân, và 754 sang chữ. (d) Kiểu FE: "Thuộc tính tệp nào nói ai được truy cập tệp và theo cách nào?"</p>
<details><summary>Lời giải — chạy trong container</summary>
<div class="out"># Bài 3: bit quyền và umask — tính trước, rồi để nhân xác nhận<br>
# tệp mới = 666 VÀ KHÔNG umask; thư mục mới = 777 VÀ KHÔNG umask<br>
$ for u in 022 027 077 002; do printf 'umask %s -&gt; file %03o &nbsp;directory %03o\\n' $u $((0666 &amp; ~0$u)) $((0777 &amp; ~0$u)); done<br>
umask 022 -&gt; file 644 &nbsp;directory 755<br>
umask 027 -&gt; file 640 &nbsp;directory 750<br>
umask 077 -&gt; file 600 &nbsp;directory 700<br>
umask 002 -&gt; file 664 &nbsp;directory 775<br>
# nhân đồng ý (umask 027 trong subshell)<br>
$ cd /tmp; (umask 027; touch f; mkdir d; stat -c '%a %A %n' f d)<br>
640 -rw-r----- f<br>
750 drwxr-x--- d<br>
# ai làm được gì? alice là chủ tệp, nhóm dev, bob chỉ ở "người khác"<br>
$ echo "report" &gt; r.txt; chown alice:dev r.txt; chmod 640 r.txt; stat -c '%a %A %U:%G' r.txt<br>
640 -rw-r----- alice:dev<br>
$ for u in alice carol bob; do runuser -u $u -- sh -c 'cat r.txt &gt;/dev/null 2&gt;&amp;1 &amp;&amp; echo "$(id -un): read OK" || echo "$(id -un): read DENIED"; (echo x &gt;&gt; r.txt) 2&gt;/dev/null &amp;&amp; echo "$(id -un): write OK" || echo "$(id -un): write DENIED"'; done<br>
alice: read OK<br>
alice: write OK<br>
carol: read OK<br>
carol: write DENIED<br>
bob: read DENIED<br>
bob: write DENIED<br>
# ký hiệu và bát phân là một<br>
$ chmod u=rw,g=r,o= r.txt; stat -c '%a' r.txt; chmod 754 r.txt; stat -c '%a %A' r.txt<br>
640<br>
754 -rwxr-xr--</div>
<ul>
<li>(a) Tệp mới = 666 VÀ KHÔNG umask: 644, 640, 600, 664. Thư mục mới = 777 VÀ KHÔNG umask: 755, 750, 700, 775.</li>
<li>(b) alice (mục chủ rw-): đọc và ghi; carol (mục nhóm r--): đọc, không ghi; bob (người khác ---): không cả hai.</li>
<li>(c) <code>u=rw,g=r,o=</code> = <strong>640</strong>; 754 = <code>rwxr-xr--</code>.</li>
<li>(d) <strong>Protection</strong> (FE4#24, FE9#32).</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 4 — how strong is a password? (15 min)</h3>
<p>(a) How many bits is a random password of 8 lowercase letters? of 8 characters from the 95 printable ASCII? of 4 Diceware words (a list of 7776 words)? (b) At 10<sup>10</sup> guesses per second (a fast, unsalted hash on GPUs) and at 10<sup>4</sup> per second (a salted slow hash) how long does an average attack take on each? (c) By how much does raising a bcrypt work factor from 10 to 14 multiply the work? (d) Why is "Password1!" far weaker than its 10 characters suggest?</p>
<details><summary>Solution — arithmetic checked by a program</summary>
<pre><code class="language-javascript">// Exercise 4: how big is a password space, and what does a slow hash buy? Pure arithmetic — deterministic
const bits = (n) =&gt; Math.log2(n);
const dang = (n) =&gt; (n &gt;= 1e15 ? n.toExponential(2) : n.toLocaleString('en-US'));
const thoiGian = (s) =&gt; (s &lt; 1 ? &#96;&#36;{(s * 1000).toFixed(1)} ms&#96; : s &lt; 3600 ? &#96;&#36;{s.toFixed(1)} s&#96; : s &lt; 86400 * 365 ? &#96;&#36;{(s / 86400).toFixed(1)} days&#96; : &#96;&#36;{(s / 86400 / 365).toExponential(2)} years&#96;);
const KHONG_GIAN = [['8 lowercase letters', 26 ** 8], ['8 letters + digits (62)', 62 ** 8], ['8 printable ASCII (95)', 95 ** 8], ['12 printable ASCII (95)', 95 ** 12], ['4 Diceware words (7776 each)', 7776 ** 4], ['6 Diceware words', 7776 ** 6]];
const TOC_DO = [['fast hash on GPUs: 1e10 guesses/s', 1e10], ['salted slow hash: 1e4 guesses/s', 1e4]];
for (const [ten, tocDo] of TOC_DO) {
  console.log(&#96;--- &#36;{ten}  (average = half the space) ---&#96;);
  for (const [t, n] of KHONG_GIAN) console.log(&#96;&#36;{t.padEnd(30)} &#36;{dang(n).padStart(24)} = &#36;{bits(n).toFixed(1).padStart(5)} bits   &#36;{thoiGian(n / 2 / tocDo)}&#96;);
}
// the cost of a bcrypt/argon2 "work factor": each +1 doubles the time
console.log('bcrypt cost 10 -&gt; 12 -&gt; 14 multiplies the work by', 2 ** (12 - 10), 'and', 2 ** (14 - 10));
// entropy of a NIST-style rule "8 chars with a capital, digit and symbol" is far below 95^8 because people follow patterns
console.log('"Password1!" style: capital + 6 lowercase + digit + symbol, with 1000 common words:', dang(1000 * 10 * 10), 'guesses =', bits(1000 * 10 * 10).toFixed(1), 'bits');</code></pre>
<div class="out">$ node tinh-mat-khau.js<br>
--- fast hash on GPUs: 1e10 guesses/s &nbsp;(average = half the space) ---<br>
8 lowercase letters &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;208,827,064,576 = &nbsp;37.6 bits &nbsp;&nbsp;10.4 s<br>
8 letters + digits (62) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;218,340,105,584,896 = &nbsp;47.6 bits &nbsp;&nbsp;0.1 days<br>
8 printable ASCII (95) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.63e+15 = &nbsp;52.6 bits &nbsp;&nbsp;3.8 days<br>
12 printable ASCII (95) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.40e+23 = &nbsp;78.8 bits &nbsp;&nbsp;8.57e+5 years<br>
4 Diceware words (7776 each) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.66e+15 = &nbsp;51.7 bits &nbsp;&nbsp;2.1 days<br>
6 Diceware words &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.21e+23 = &nbsp;77.5 bits &nbsp;&nbsp;3.51e+5 years<br>
--- salted slow hash: 1e4 guesses/s &nbsp;(average = half the space) ---<br>
8 lowercase letters &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;208,827,064,576 = &nbsp;37.6 bits &nbsp;&nbsp;120.8 days<br>
8 letters + digits (62) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;218,340,105,584,896 = &nbsp;47.6 bits &nbsp;&nbsp;3.46e+2 years<br>
8 printable ASCII (95) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.63e+15 = &nbsp;52.6 bits &nbsp;&nbsp;1.05e+4 years<br>
12 printable ASCII (95) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.40e+23 = &nbsp;78.8 bits &nbsp;&nbsp;8.57e+11 years<br>
4 Diceware words (7776 each) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.66e+15 = &nbsp;51.7 bits &nbsp;&nbsp;5.80e+3 years<br>
6 Diceware words &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.21e+23 = &nbsp;77.5 bits &nbsp;&nbsp;3.51e+11 years<br>
bcrypt cost 10 -&gt; 12 -&gt; 14 multiplies the work by 4 and 16<br>
"Password1!" style: capital + 6 lowercase + digit + symbol, with 1000 common words: 100,000 guesses = 16.6 bits</div>
<ul>
<li>(a) 26<sup>8</sup> ≈ 2.1×10<sup>11</sup> = <strong>37.6 bits</strong>; 95<sup>8</sup> ≈ 6.6×10<sup>15</sup> = <strong>52.6 bits</strong>; 7776<sup>4</sup> ≈ 3.7×10<sup>15</sup> = <strong>51.7 bits</strong> — four random words are about as strong as eight random symbols, and far easier to remember.</li>
<li>(b) Lowercase-8: <strong>10 seconds</strong> with a fast hash vs <strong>121 days</strong> with a slow salted hash; 95<sup>8</sup>: 3.8 days vs ~10,000 years. A slow hash buys a factor 10<sup>6</sup> (here), but only a <em>long random</em> password buys the rest.</li>
<li>(c) Each +1 doubles the work: 2<sup>4</sup> = <strong>16</strong>.</li>
<li>(d) People follow patterns (capital first, word, digit, symbol at the end): only about 10<sup>5</sup> guesses = 16.6 bits for that shape with 1000 common words — which is why NIST SP 800-63B drops composition rules in favour of length and breached-password checks.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 4 — mật khẩu mạnh cỡ nào? (15 phút)</h3>
<p>(a) Mật khẩu ngẫu nhiên 8 chữ thường là bao nhiêu bit? 8 ký tự trong 95 ký tự ASCII in được? 4 từ Diceware (danh sách 7776 từ)? (b) Ở 10<sup>10</sup> lần đoán mỗi giây (băm nhanh không muối trên GPU) và 10<sup>4</sup> mỗi giây (băm chậm có muối) một cuộc tấn công trung bình mất bao lâu với từng loại? (c) Tăng work factor bcrypt từ 10 lên 14 nhân công việc lên bao nhiêu? (d) Vì sao "Password1!" yếu hơn nhiều so với 10 ký tự gợi ý?</p>
<details><summary>Lời giải — số học được chương trình kiểm</summary>
<pre><code class="language-javascript">// Bài 4: không gian mật khẩu lớn cỡ nào, và băm chậm được lợi gì? Số học thuần — tất định
const bits = (n) =&gt; Math.log2(n);
const dang = (n) =&gt; (n &gt;= 1e15 ? n.toExponential(2) : n.toLocaleString('en-US'));
const thoiGian = (s) =&gt; (s &lt; 1 ? &#96;&#36;{(s * 1000).toFixed(1)} ms&#96; : s &lt; 3600 ? &#96;&#36;{s.toFixed(1)} s&#96; : s &lt; 86400 * 365 ? &#96;&#36;{(s / 86400).toFixed(1)} days&#96; : &#96;&#36;{(s / 86400 / 365).toExponential(2)} years&#96;);
const KHONG_GIAN = [['8 lowercase letters', 26 ** 8], ['8 letters + digits (62)', 62 ** 8], ['8 printable ASCII (95)', 95 ** 8], ['12 printable ASCII (95)', 95 ** 12], ['4 Diceware words (7776 each)', 7776 ** 4], ['6 Diceware words', 7776 ** 6]];
const TOC_DO = [['fast hash on GPUs: 1e10 guesses/s', 1e10], ['salted slow hash: 1e4 guesses/s', 1e4]];
for (const [ten, tocDo] of TOC_DO) {
  console.log(&#96;--- &#36;{ten}  (average = half the space) ---&#96;);
  for (const [t, n] of KHONG_GIAN) console.log(&#96;&#36;{t.padEnd(30)} &#36;{dang(n).padStart(24)} = &#36;{bits(n).toFixed(1).padStart(5)} bits   &#36;{thoiGian(n / 2 / tocDo)}&#96;);
}
// chi phí của "work factor" bcrypt/argon2: mỗi +1 nhân đôi thời gian
console.log('bcrypt cost 10 -&gt; 12 -&gt; 14 multiplies the work by', 2 ** (12 - 10), 'and', 2 ** (14 - 10));
// entropy của luật kiểu "8 ký tự có chữ hoa, số, ký hiệu" thấp hơn nhiều 95^8 vì người ta theo khuôn mẫu
console.log('"Password1!" style: capital + 6 lowercase + digit + symbol, with 1000 common words:', dang(1000 * 10 * 10), 'guesses =', bits(1000 * 10 * 10).toFixed(1), 'bits');</code></pre>
<div class="out">$ node tinh-mat-khau.js<br>
--- fast hash on GPUs: 1e10 guesses/s &nbsp;(average = half the space) ---<br>
8 lowercase letters &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;208,827,064,576 = &nbsp;37.6 bits &nbsp;&nbsp;10.4 s<br>
8 letters + digits (62) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;218,340,105,584,896 = &nbsp;47.6 bits &nbsp;&nbsp;0.1 days<br>
8 printable ASCII (95) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.63e+15 = &nbsp;52.6 bits &nbsp;&nbsp;3.8 days<br>
12 printable ASCII (95) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.40e+23 = &nbsp;78.8 bits &nbsp;&nbsp;8.57e+5 years<br>
4 Diceware words (7776 each) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.66e+15 = &nbsp;51.7 bits &nbsp;&nbsp;2.1 days<br>
6 Diceware words &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.21e+23 = &nbsp;77.5 bits &nbsp;&nbsp;3.51e+5 years<br>
--- salted slow hash: 1e4 guesses/s &nbsp;(average = half the space) ---<br>
8 lowercase letters &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;208,827,064,576 = &nbsp;37.6 bits &nbsp;&nbsp;120.8 days<br>
8 letters + digits (62) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;218,340,105,584,896 = &nbsp;47.6 bits &nbsp;&nbsp;3.46e+2 years<br>
8 printable ASCII (95) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.63e+15 = &nbsp;52.6 bits &nbsp;&nbsp;1.05e+4 years<br>
12 printable ASCII (95) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.40e+23 = &nbsp;78.8 bits &nbsp;&nbsp;8.57e+11 years<br>
4 Diceware words (7776 each) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.66e+15 = &nbsp;51.7 bits &nbsp;&nbsp;5.80e+3 years<br>
6 Diceware words &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.21e+23 = &nbsp;77.5 bits &nbsp;&nbsp;3.51e+11 years<br>
bcrypt cost 10 -&gt; 12 -&gt; 14 multiplies the work by 4 and 16<br>
"Password1!" style: capital + 6 lowercase + digit + symbol, with 1000 common words: 100,000 guesses = 16.6 bits</div>
<ul>
<li>(a) 26<sup>8</sup> ≈ 2,1×10<sup>11</sup> = <strong>37,6 bit</strong>; 95<sup>8</sup> ≈ 6,6×10<sup>15</sup> = <strong>52,6 bit</strong>; 7776<sup>4</sup> ≈ 3,7×10<sup>15</sup> = <strong>51,7 bit</strong> — bốn từ ngẫu nhiên mạnh xấp xỉ tám ký hiệu ngẫu nhiên, và dễ nhớ hơn nhiều.</li>
<li>(b) 8 chữ thường: <strong>10 giây</strong> với băm nhanh so với <strong>121 ngày</strong> với băm chậm có muối; 95<sup>8</sup>: 3,8 ngày so với ~10.000 năm. Băm chậm mua được hệ số 10<sup>6</sup> (ở đây), nhưng chỉ mật khẩu <em>dài ngẫu nhiên</em> mua được phần còn lại.</li>
<li>(c) Mỗi +1 nhân đôi công việc: 2<sup>4</sup> = <strong>16</strong>.</li>
<li>(d) Con người theo khuôn mẫu (chữ hoa đầu, từ, số, ký hiệu ở cuối): chỉ khoảng 10<sup>5</sup> lần đoán = 16,6 bit cho dạng đó với 1000 từ phổ biến — đó là lý do NIST SP 800-63B bỏ luật cấu thành để ưu tiên độ dài và kiểm mật khẩu đã lộ.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 5 — one overflow, five builds (20 min)</h3>
<p>The toy program <code>loi.c</code> copies <code>argv[1]</code> into a 16-byte stack buffer without checking the length. Build it five ways and run each with a 64-byte argument: (1) no protection; (2) <code>-fstack-protector-strong</code>; (3) <code>-O2 -D_FORTIFY_SOURCE=2</code>; (4) <code>-fsanitize=address</code>; (5) with a length check. Predict, then check: which exit status or message does each give, and which build tells you <em>the line</em>?</p>
<details><summary>Solution — run in the container</summary>
<div class="out"># Exercise 5: one buggy program, five builds — what does each defence do?<br>
$ cat &gt; loi.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt; #include &lt;stdlib.h&gt;<br>
&gt; int main(int argc, char **argv) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;char *heap = malloc(16);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;char stack[16];<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;size_t n = strlen(argv[1]);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;memcpy(stack, argv[1], n); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// BUG: n is not checked against sizeof stack<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;strncpy(heap, "ok", 16);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("copied %zu bytes, first byte %c\\n", n, stack[0]);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;free(heap);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; X<br>
$ echo "--- 1. no protection"<br>
--- 1. no protection<br>
$ gcc -O0 -fno-stack-protector -o b1 loi.c &amp;&amp; ./b1 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA; echo "exit=$?"<br>
bash: &nbsp;&nbsp;&nbsp;18 Segmentation fault &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./b1 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA<br>
exit=139<br>
$ echo "--- 2. stack protector"<br>
--- 2. stack protector<br>
$ gcc -O0 -fstack-protector-strong -o b2 loi.c &amp;&amp; ./b2 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA; echo "exit=$?"<br>
*** stack smashing detected ***: terminated<br>
bash: &nbsp;&nbsp;&nbsp;28 Aborted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./b2 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA<br>
exit=134<br>
$ echo "--- 3. FORTIFY_SOURCE=2 (-O2)"<br>
--- 3. FORTIFY_SOURCE=2 (-O2)<br>
$ gcc -O2 -D_FORTIFY_SOURCE=2 -fno-stack-protector -o b3 loi.c &amp;&amp; ./b3 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA 2&gt;&amp;1 | head -2; echo "exit=&#36;{PIPESTATUS[0]}"<br>
*** buffer overflow detected ***: terminated<br>
exit=134<br>
$ echo "--- 4. AddressSanitizer: names the bug and the line"<br>
--- 4. AddressSanitizer: names the bug and the line<br>
# asan = run the program again if AddressSanitizer could not place its shadow memory (rare under this kernel's heavy ASLR)<br>
$ gcc -g -fsanitize=address -o b4 loi.c &amp;&amp; asan ./b4 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA | grep -E 'ERROR|WRITE of|loi.c:' | sed 's/0x[0-9a-f]*/0xADDR/g' | head -3<br>
==54==ERROR: AddressSanitizer: stack-buffer-overflow on address 0xADDR at pc 0xADDR bp 0xADDR sp 0xADDR<br>
WRITE of size 64 at 0xADDR thread T0<br>
&nbsp;&nbsp;&nbsp;&nbsp;#1 0xADDR in main /w/loi.c:8<br>
$ echo "--- 5. the fix: check the length"<br>
--- 5. the fix: check the length<br>
$ sed 's|memcpy(stack, argv\\[1\\], n);|if (n &gt;= sizeof stack) { fputs("too long\\\\n", stderr); return 2; } memcpy(stack, argv[1], n);|' loi.c &gt; ok.c &amp;&amp; gcc -O0 -Wall -o b5 ok.c &amp;&amp; ./b5 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA; echo "exit=$?"; ./b5 hello; echo "exit=$?"<br>
too long<br>
exit=2<br>
copied 5 bytes, first byte h<br>
exit=0</div>
<ul>
<li>(1) <strong>exit 139</strong> (SIGSEGV): the return address was overwritten; nothing noticed before the crash.</li>
<li>(2) <strong>134</strong> with <code>*** stack smashing detected ***</code>: the canary changed, <code>abort()</code> before <code>ret</code>.</li>
<li>(3) <strong>134</strong> with <code>*** buffer overflow detected ***</code>: the compiler knew the buffer is 16 bytes and used a checked <code>memcpy</code>. (Without the later <code>printf</code> that uses <code>stack</code>, the optimiser deletes the dead copy and nothing happens — a reminder that FORTIFY works on what the compiler can see.)</li>
<li>(4) AddressSanitizer: <strong>stack-buffer-overflow, WRITE of size 64 … loi.c:8</strong> — the only build that names the bug and the line; use it in CI and tests (2–3× slower, so not in production).</li>
<li>(5) The fix prints <code>too long</code> (exit 2) for 64 bytes and works for <code>hello</code>. All the others are mitigations; only (5) removes the bug.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 5 — một lỗi tràn, năm bản dựng (20 phút)</h3>
<p>Chương trình đồ chơi <code>loi.c</code> chép <code>argv[1]</code> vào bộ đệm ngăn xếp 16 byte mà không kiểm độ dài. Dựng nó năm cách và chạy mỗi cách với đối số 64 byte: (1) không bảo vệ; (2) <code>-fstack-protector-strong</code>; (3) <code>-O2 -D_FORTIFY_SOURCE=2</code>; (4) <code>-fsanitize=address</code>; (5) có kiểm độ dài. Dự đoán rồi kiểm: mỗi bản cho trạng thái thoát hay thông báo gì, và bản nào cho bạn biết <em>dòng lỗi</em>?</p>
<details><summary>Lời giải — chạy trong container</summary>
<div class="out"># Bài 5: một chương trình lỗi, năm bản dựng — mỗi lớp phòng thủ làm gì?<br>
$ cat &gt; loi.c &lt;&lt;'X'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt; #include &lt;stdlib.h&gt;<br>
&gt; int main(int argc, char **argv) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;char *heap = malloc(16);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;char stack[16];<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;size_t n = strlen(argv[1]);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;memcpy(stack, argv[1], n); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// BUG: n is not checked against sizeof stack<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;strncpy(heap, "ok", 16);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("copied %zu bytes, first byte %c\\n", n, stack[0]);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;free(heap);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; X<br>
$ echo "--- 1. no protection"<br>
--- 1. no protection<br>
$ gcc -O0 -fno-stack-protector -o b1 loi.c &amp;&amp; ./b1 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA; echo "exit=$?"<br>
bash: &nbsp;&nbsp;&nbsp;18 Segmentation fault &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./b1 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA<br>
exit=139<br>
$ echo "--- 2. stack protector"<br>
--- 2. stack protector<br>
$ gcc -O0 -fstack-protector-strong -o b2 loi.c &amp;&amp; ./b2 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA; echo "exit=$?"<br>
*** stack smashing detected ***: terminated<br>
bash: &nbsp;&nbsp;&nbsp;28 Aborted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./b2 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA<br>
exit=134<br>
$ echo "--- 3. FORTIFY_SOURCE=2 (-O2)"<br>
--- 3. FORTIFY_SOURCE=2 (-O2)<br>
$ gcc -O2 -D_FORTIFY_SOURCE=2 -fno-stack-protector -o b3 loi.c &amp;&amp; ./b3 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA 2&gt;&amp;1 | head -2; echo "exit=&#36;{PIPESTATUS[0]}"<br>
*** buffer overflow detected ***: terminated<br>
exit=134<br>
$ echo "--- 4. AddressSanitizer: names the bug and the line"<br>
--- 4. AddressSanitizer: names the bug and the line<br>
# asan = chạy lại nếu AddressSanitizer không đặt được bộ nhớ bóng (hiếm, do ASLR mạnh của nhân này)<br>
$ gcc -g -fsanitize=address -o b4 loi.c &amp;&amp; asan ./b4 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA | grep -E 'ERROR|WRITE of|loi.c:' | sed 's/0x[0-9a-f]*/0xADDR/g' | head -3<br>
==54==ERROR: AddressSanitizer: stack-buffer-overflow on address 0xADDR at pc 0xADDR bp 0xADDR sp 0xADDR<br>
WRITE of size 64 at 0xADDR thread T0<br>
&nbsp;&nbsp;&nbsp;&nbsp;#1 0xADDR in main /w/loi.c:8<br>
$ echo "--- 5. the fix: check the length"<br>
--- 5. the fix: check the length<br>
$ sed 's|memcpy(stack, argv\\[1\\], n);|if (n &gt;= sizeof stack) { fputs("too long\\\\n", stderr); return 2; } memcpy(stack, argv[1], n);|' loi.c &gt; ok.c &amp;&amp; gcc -O0 -Wall -o b5 ok.c &amp;&amp; ./b5 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA; echo "exit=$?"; ./b5 hello; echo "exit=$?"<br>
too long<br>
exit=2<br>
copied 5 bytes, first byte h<br>
exit=0</div>
<ul>
<li>(1) <strong>exit 139</strong> (SIGSEGV): địa chỉ trả về bị ghi đè; không gì phát hiện trước khi sập.</li>
<li>(2) <strong>134</strong> với <code>*** stack smashing detected ***</code>: canary đổi, <code>abort()</code> trước <code>ret</code>.</li>
<li>(3) <strong>134</strong> với <code>*** buffer overflow detected ***</code>: trình biên dịch biết bộ đệm 16 byte và dùng <code>memcpy</code> có kiểm. (Nếu không có <code>printf</code> sau dùng <code>stack</code>, bộ tối ưu xoá phép chép chết và không gì xảy ra — nhắc rằng FORTIFY chỉ làm việc với cái trình biên dịch thấy được.)</li>
<li>(4) AddressSanitizer: <strong>stack-buffer-overflow, WRITE of size 64 … loi.c:8</strong> — bản duy nhất gọi tên lỗi và dòng; dùng trong CI và kiểm thử (chậm 2–3 lần nên không dùng ở production).</li>
<li>(5) Cách sửa in <code>too long</code> (exit 2) với 64 byte và chạy tốt với <code>hello</code>. Mọi bản còn lại là giảm nhẹ; chỉ (5) loại bỏ lỗi.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 6 — three injection fixes (20 min)</h3>
<p>(A) A product search builds <code>"SELECT … WHERE name = '" + name + "'"</code> — fix it. (B) A listing endpoint takes the sort column from the query string: <code>"… ORDER BY " + col</code>. Placeholders cannot hold a column name — what is the right fix? (C) A helper runs <code>exec("echo checking " + file)</code> — fix it. Test with the payloads <code>x' OR '1'='1</code>, <code>(SELECT 1/0)</code> and <code>a.txt; echo INJECTED</code>.</p>
<details><summary>Solution — the program runs every payload against both versions</summary>
<pre><code class="language-javascript">// Exercise 6: fix three injection bugs — the program runs every payload against the broken and the fixed version
process.removeAllListeners('warning');
const { DatabaseSync } = require('node:sqlite');
const { execFileSync, execSync } = require('node:child_process');
const db = new DatabaseSync(':memory:');
db.exec("CREATE TABLE products(id INTEGER, name TEXT, secret TEXT); INSERT INTO products VALUES (1,'pen','cost 2'),(2,'book','cost 9'),(3,'vault','CODE 4711');");

// --- bug A: SQL built by concatenation
const timSai = (ten) =&gt; db.prepare(&#96;SELECT name FROM products WHERE name = '&#36;{ten}'&#96;).all().map((r) =&gt; r.name);
const timDung = (ten) =&gt; db.prepare('SELECT name FROM products WHERE name = ?').all(ten).map((r) =&gt; r.name);
// --- bug B: ORDER BY column taken from the user (placeholders cannot hold identifiers!) -&gt; allow-list
const sapXepSai = (cot) =&gt; { try { return db.prepare(&#96;SELECT name FROM products ORDER BY &#36;{cot}&#96;).all().map((r) =&gt; r.name).join(','); } catch (e) { return 'SQL error: ' + e.message; } };
const CHO_PHEP = new Set(['id', 'name']);
const sapXepDung = (cot) =&gt; (CHO_PHEP.has(cot) ? db.prepare(&#96;SELECT name FROM products ORDER BY &#36;{cot}&#96;).all().map((r) =&gt; r.name).join(',') : 'refused: column not allowed');
// --- bug C: shell command
const demSai = (tep) =&gt; { try { return execSync(&#96;echo checking &#36;{tep}&#96;).toString().trim().replace(/\\n/g, ' | '); } catch (e) { return 'error'; } };
const demDung = (tep) =&gt; execFileSync('echo', ['checking', tep]).toString().trim();

const PAYLOAD_A = "x' OR '1'='1", PAYLOAD_B = '(SELECT 1/0)', PAYLOAD_C = 'a.txt; echo INJECTED';
const dong = (ten, sai, dung, tinhChat) =&gt; console.log(&#96;&#36;{ten}\\n  broken: &#36;{sai}\\n  fixed : &#36;{dung}\\n  fixed version is safe: &#36;{tinhChat(dung) ? 'PASS' : 'FAIL'}&#96;);
dong('A  SQL placeholder', JSON.stringify(timSai(PAYLOAD_A)), JSON.stringify(timDung(PAYLOAD_A)), (d) =&gt; d === '[]');
dong('B  ORDER BY allow-list', sapXepSai(PAYLOAD_B), sapXepDung(PAYLOAD_B), (d) =&gt; d.startsWith('refused'));
dong('C  execFile instead of a shell', demSai(PAYLOAD_C), demDung(PAYLOAD_C), (d) =&gt; !d.includes('INJECTED |') &amp;&amp; d === 'checking a.txt; echo INJECTED');</code></pre>
<div class="out">$ node sua-loi.js<br>
A &nbsp;SQL placeholder<br>
&nbsp;&nbsp;broken: ["pen","book","vault"]<br>
&nbsp;&nbsp;fixed : []<br>
&nbsp;&nbsp;fixed version is safe: PASS<br>
B &nbsp;ORDER BY allow-list<br>
&nbsp;&nbsp;broken: pen,book,vault<br>
&nbsp;&nbsp;fixed : refused: column not allowed<br>
&nbsp;&nbsp;fixed version is safe: PASS<br>
C &nbsp;execFile instead of a shell<br>
&nbsp;&nbsp;broken: checking a.txt | INJECTED<br>
&nbsp;&nbsp;fixed : checking a.txt; echo INJECTED<br>
&nbsp;&nbsp;fixed version is safe: PASS</div>
<ul>
<li>(A) <strong>placeholder</strong> <code>?</code> (<code>$1</code> in PostgreSQL): the broken query returned every product, the fixed one returned none.</li>
<li>(B) An <strong>allow-list</strong>: only <code>id</code> or <code>name</code> may become the column. The broken version happily evaluated the injected sub-select; placeholders cannot protect identifiers, so you must choose the column from a fixed set in code.</li>
<li>(C) <strong>execFile</strong> with an argument array: the whole string stays one argument, the shell never sees <code>;</code>.</li>
<li>Same three rules for any stack: Prisma (<code>$queryRaw</code> template, never <code>$queryRawUnsafe</code>), Spring (<code>PreparedStatement</code>, JPA parameters; whitelisted <code>Sort</code> fields), Java (<code>ProcessBuilder</code> with a list).</li>
</ul>
</details>`,
    `<h3>🧪 Bài 6 — ba cách sửa lỗi chèn lệnh (20 phút)</h3>
<p>(A) Một tìm kiếm sản phẩm dựng <code>"SELECT … WHERE name = '" + name + "'"</code> — hãy sửa. (B) Một endpoint liệt kê lấy cột sắp xếp từ query string: <code>"… ORDER BY " + col</code>. Placeholder không chứa được tên cột — cách sửa đúng là gì? (C) Một hàm phụ chạy <code>exec("echo checking " + file)</code> — hãy sửa. Thử với các tải trọng <code>x' OR '1'='1</code>, <code>(SELECT 1/0)</code> và <code>a.txt; echo INJECTED</code>.</p>
<details><summary>Lời giải — chương trình chạy mọi tải trọng với cả hai phiên bản</summary>
<pre><code class="language-javascript">// Bài 6: sửa ba lỗi chèn lệnh — chương trình chạy mọi tải trọng với bản lỗi và bản đã sửa
process.removeAllListeners('warning');
const { DatabaseSync } = require('node:sqlite');
const { execFileSync, execSync } = require('node:child_process');
const db = new DatabaseSync(':memory:');
db.exec("CREATE TABLE products(id INTEGER, name TEXT, secret TEXT); INSERT INTO products VALUES (1,'pen','cost 2'),(2,'book','cost 9'),(3,'vault','CODE 4711');");

// lỗi A: SQL ghép chuỗi
const timSai = (ten) =&gt; db.prepare(&#96;SELECT name FROM products WHERE name = '&#36;{ten}'&#96;).all().map((r) =&gt; r.name);
const timDung = (ten) =&gt; db.prepare('SELECT name FROM products WHERE name = ?').all(ten).map((r) =&gt; r.name);
// lỗi B: cột ORDER BY lấy từ người dùng (placeholder không chứa được tên cột!) -&gt; danh sách cho phép
const sapXepSai = (cot) =&gt; { try { return db.prepare(&#96;SELECT name FROM products ORDER BY &#36;{cot}&#96;).all().map((r) =&gt; r.name).join(','); } catch (e) { return 'SQL error: ' + e.message; } };
const CHO_PHEP = new Set(['id', 'name']);
const sapXepDung = (cot) =&gt; (CHO_PHEP.has(cot) ? db.prepare(&#96;SELECT name FROM products ORDER BY &#36;{cot}&#96;).all().map((r) =&gt; r.name).join(',') : 'refused: column not allowed');
// lỗi C: lệnh shell
const demSai = (tep) =&gt; { try { return execSync(&#96;echo checking &#36;{tep}&#96;).toString().trim().replace(/\\n/g, ' | '); } catch (e) { return 'error'; } };
const demDung = (tep) =&gt; execFileSync('echo', ['checking', tep]).toString().trim();

const PAYLOAD_A = "x' OR '1'='1", PAYLOAD_B = '(SELECT 1/0)', PAYLOAD_C = 'a.txt; echo INJECTED';
const dong = (ten, sai, dung, tinhChat) =&gt; console.log(&#96;&#36;{ten}\\n  broken: &#36;{sai}\\n  fixed : &#36;{dung}\\n  fixed version is safe: &#36;{tinhChat(dung) ? 'PASS' : 'FAIL'}&#96;);
dong('A  SQL placeholder', JSON.stringify(timSai(PAYLOAD_A)), JSON.stringify(timDung(PAYLOAD_A)), (d) =&gt; d === '[]');
dong('B  ORDER BY allow-list', sapXepSai(PAYLOAD_B), sapXepDung(PAYLOAD_B), (d) =&gt; d.startsWith('refused'));
dong('C  execFile instead of a shell', demSai(PAYLOAD_C), demDung(PAYLOAD_C), (d) =&gt; !d.includes('INJECTED |') &amp;&amp; d === 'checking a.txt; echo INJECTED');</code></pre>
<div class="out">$ node sua-loi.js<br>
A &nbsp;SQL placeholder<br>
&nbsp;&nbsp;broken: ["pen","book","vault"]<br>
&nbsp;&nbsp;fixed : []<br>
&nbsp;&nbsp;fixed version is safe: PASS<br>
B &nbsp;ORDER BY allow-list<br>
&nbsp;&nbsp;broken: pen,book,vault<br>
&nbsp;&nbsp;fixed : refused: column not allowed<br>
&nbsp;&nbsp;fixed version is safe: PASS<br>
C &nbsp;execFile instead of a shell<br>
&nbsp;&nbsp;broken: checking a.txt | INJECTED<br>
&nbsp;&nbsp;fixed : checking a.txt; echo INJECTED<br>
&nbsp;&nbsp;fixed version is safe: PASS</div>
<ul>
<li>(A) <strong>placeholder</strong> <code>?</code> (<code>$1</code> trong PostgreSQL): truy vấn lỗi trả về mọi sản phẩm, bản đã sửa không trả gì.</li>
<li>(B) Một <strong>danh sách cho phép (allow-list)</strong>: chỉ <code>id</code> hoặc <code>name</code> được thành tên cột. Bản lỗi vui vẻ đánh giá sub-select bị chèn; placeholder không bảo vệ được định danh, nên bạn phải chọn cột từ một tập cố định trong mã.</li>
<li>(C) <strong>execFile</strong> với mảng đối số: cả chuỗi vẫn là một đối số, shell không bao giờ thấy <code>;</code>.</li>
<li>Cùng ba quy tắc cho mọi stack: Prisma (mẫu <code>$queryRaw</code>, không bao giờ <code>$queryRawUnsafe</code>), Spring (<code>PreparedStatement</code>, tham số JPA; trường <code>Sort</code> nằm trong danh sách cho phép), Java (<code>ProcessBuilder</code> với danh sách).</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 7 — least privilege in a container (15 min)</h3>
<p>A Dockerfile ends with <code>USER 1000</code>. List five things the process can no longer do, two things it still can, and what <code>CapEff</code> shows. Then write the four <code>docker run</code> flags you would add for a Node web server on port 3000: non-root user, all capabilities dropped, no privilege gain, memory limit.</p>
<details><summary>Solution — run as uid 1000</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 7: what a non-root container user can and cannot do (Dockerfile: USER 1000)<br>
$ id<br>
uid=1000(sv) gid=1000(sv) groups=1000(sv)<br>
# write to system places<br>
$ touch /etc/x 2&gt;&amp;1; touch /usr/local/bin/x 2&gt;&amp;1<br>
touch: cannot touch '/etc/x': Permission denied<br>
touch: cannot touch '/usr/local/bin/x': Permission denied<br>
# read the password file<br>
$ cat /etc/shadow 2&gt;&amp;1<br>
cat: /etc/shadow: Permission denied<br>
# change another user's file or install packages<br>
$ chown root /tmp 2&gt;&amp;1; apt-get install -y curl 2&gt;&amp;1 | head -1<br>
chown: changing ownership of '/tmp': Operation not permitted<br>
E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)<br>
# its own home and /tmp are fine — an app writes uploads and caches there<br>
$ echo ok &gt; ~/ghi-duoc.txt &amp;&amp; cat ~/ghi-duoc.txt<br>
ok<br>
# no capabilities at all, and it can start a server on any port in Docker<br>
$ grep -E 'CapEff|NoNewPrivs' /proc/self/status<br>
CapEff:	0000000000000000<br>
NoNewPrivs:	0<br>
# it cannot become root: su needs a password, and no sudo exists<br>
$ su -c id 2&gt;&amp;1 &lt;/dev/null | head -1<br>
Password: su: Authentication failure</div>
<ul>
<li>It <strong>cannot</strong>: create files under <code>/etc</code> or <code>/usr/local/bin</code>, read <code>/etc/shadow</code>, <code>chown</code> a root-owned directory, install packages (<code>apt</code> cannot take its lock), or become root (<code>su</code> asks for a password; there is no sudo).</li>
<li>It <strong>can</strong>: write in its home and <code>/tmp</code> (uploads, caches), and — because Docker sets <code>ip_unprivileged_port_start=0</code> — listen on port 80 (on a normal host, only ≥ 1024).</li>
<li><code>CapEff = 0000000000000000</code>: no capabilities at all (slide 12).</li>
<li>Flags: <code>docker run --user 1000:1000 --cap-drop=ALL --security-opt no-new-privileges --memory 256m -p 127.0.0.1:3000:3000 image</code>. (In a Dockerfile: <code>USER node</code> or a numeric uid; in Compose: <code>cap_drop: [ALL]</code>.)</li>
</ul>
</details>`,
    `<h3>🧪 Bài 7 — quyền tối thiểu trong container (15 phút)</h3>
<p>Một Dockerfile kết thúc bằng <code>USER 1000</code>. Liệt kê năm việc tiến trình không còn làm được, hai việc vẫn làm được, và <code>CapEff</code> cho thấy gì. Rồi viết bốn cờ <code>docker run</code> bạn sẽ thêm cho một máy chủ web Node ở cổng 3000: người dùng không phải root, bỏ mọi capability, không leo thêm đặc quyền, giới hạn bộ nhớ.</p>
<details><summary>Lời giải — chạy với uid 1000</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 7: người dùng không phải root trong container làm được và không làm được gì (Dockerfile: USER 1000)<br>
$ id<br>
uid=1000(sv) gid=1000(sv) groups=1000(sv)<br>
# ghi vào chỗ của hệ thống<br>
$ touch /etc/x 2&gt;&amp;1; touch /usr/local/bin/x 2&gt;&amp;1<br>
touch: cannot touch '/etc/x': Permission denied<br>
touch: cannot touch '/usr/local/bin/x': Permission denied<br>
# đọc tệp mật khẩu<br>
$ cat /etc/shadow 2&gt;&amp;1<br>
cat: /etc/shadow: Permission denied<br>
# đổi tệp của người khác hay cài gói<br>
$ chown root /tmp 2&gt;&amp;1; apt-get install -y curl 2&gt;&amp;1 | head -1<br>
chown: changing ownership of '/tmp': Operation not permitted<br>
E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)<br>
# thư mục riêng và /tmp thì ổn — ứng dụng ghi tệp tải lên và cache ở đó<br>
$ echo ok &gt; ~/ghi-duoc.txt &amp;&amp; cat ~/ghi-duoc.txt<br>
ok<br>
# không có capability nào, và nó mở được máy chủ trên cổng bất kỳ trong Docker<br>
$ grep -E 'CapEff|NoNewPrivs' /proc/self/status<br>
CapEff:	0000000000000000<br>
NoNewPrivs:	0<br>
# nó không thành root được: su cần mật khẩu, và không có sudo<br>
$ su -c id 2&gt;&amp;1 &lt;/dev/null | head -1<br>
Password: su: Authentication failure</div>
<ul>
<li>Nó <strong>không</strong> làm được: tạo tệp trong <code>/etc</code> hay <code>/usr/local/bin</code>, đọc <code>/etc/shadow</code>, <code>chown</code> một thư mục của root, cài gói (<code>apt</code> không lấy được khoá), hay thành root (<code>su</code> đòi mật khẩu; không có sudo).</li>
<li>Nó <strong>làm được</strong>: ghi trong thư mục riêng và <code>/tmp</code> (tệp tải lên, cache), và — vì Docker đặt <code>ip_unprivileged_port_start=0</code> — nghe cổng 80 (trên máy thường chỉ ≥ 1024).</li>
<li><code>CapEff = 0000000000000000</code>: không có capability nào (slide 12).</li>
<li>Cờ: <code>docker run --user 1000:1000 --cap-drop=ALL --security-opt no-new-privileges --memory 256m -p 127.0.0.1:3000:3000 image</code>. (Trong Dockerfile: <code>USER node</code> hay uid số; trong Compose: <code>cap_drop: [ALL]</code>.)</li>
</ul>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>confidentiality / integrity / availability</strong></td><td>bí mật / toàn vẹn / sẵn sàng</td><td>The three security goals (CIA): keep data secret, keep it unchanged without permission, keep the service working.</td></tr>
<tr><td><strong>trusted computing base (TCB)</strong></td><td>cơ sở tin cậy</td><td>Everything that must work correctly for security to hold: hardware, kernel, privileged programs.</td></tr>
<tr><td><strong>reference monitor</strong></td><td>giám sát tham chiếu</td><td>The always-invoked, tamper-proof, verifiable checkpoint every access request passes (in the kernel).</td></tr>
<tr><td><strong>protection domain</strong></td><td>miền bảo vệ</td><td>A set of (object, rights) pairs a process holds; in Unix, the (user id, group id).</td></tr>
<tr><td><strong>protection matrix</strong></td><td>ma trận bảo vệ</td><td>Rows = domains, columns = objects, cells = rights; stored by column (ACL) or by row (capabilities).</td></tr>
<tr><td><strong>access control list (ACL)</strong></td><td>danh sách điều khiển truy cập</td><td>A list attached to an object saying who may do what to it (a column of the matrix).</td></tr>
<tr><td><strong>capability / C-list</strong></td><td>capability / danh sách capability</td><td>An unforgeable ticket for an object with rights; a process's list of them (a row). File descriptors are capabilities.</td></tr>
<tr><td><strong>setuid / effective uid</strong></td><td>setuid / uid hiệu lực</td><td>A file bit that runs a program with its owner's rights; the uid the kernel checks (versus the real uid of the caller).</td></tr>
<tr><td><strong>Linux capabilities</strong></td><td>capability của Linux</td><td>About 40 separate privileges that split up root (CAP_NET_BIND_SERVICE, CAP_DAC_OVERRIDE…).</td></tr>
<tr><td><strong>Bell–LaPadula / Biba</strong></td><td>Bell–LaPadula / Biba</td><td>Level-based models: BLP protects secrecy (no read up, no write down); Biba protects integrity (no write up, no read down).</td></tr>
<tr><td><strong>covert channel / steganography</strong></td><td>kênh ngầm / giấu tin</td><td>Leaking data through a side effect the policy ignores (locks, timing); hiding a message inside ordinary data (image low bits).</td></tr>
<tr><td><strong>hash / digital signature</strong></td><td>hàm băm / chữ ký số</td><td>A fixed-size one-way fingerprint; a hash signed with a private key and checked with the public key.</td></tr>
<tr><td><strong>salt / slow hash</strong></td><td>muối / băm chậm</td><td>A random per-user value stored beside the hash so equal passwords differ; a deliberately expensive hash (argon2id, bcrypt, scrypt).</td></tr>
<tr><td><strong>challenge–response / TOTP</strong></td><td>hỏi–đáp / TOTP</td><td>Authenticate by answering a fresh challenge with a secret that never travels; a time-based one-time code (RFC 6238).</td></tr>
<tr><td><strong>FAR / FRR</strong></td><td>FAR / FRR</td><td>Biometric errors: impostor accepted / genuine user rejected; they trade off with the threshold.</td></tr>
<tr><td><strong>buffer overflow / stack canary</strong></td><td>tràn bộ đệm / canary ngăn xếp</td><td>Writing past a buffer's end; a random value checked before return that detects it.</td></tr>
<tr><td><strong>ASLR / NX (W^X)</strong></td><td>ASLR / NX (W^X)</td><td>Randomised memory layout; pages are writable or executable, never both.</td></tr>
<tr><td><strong>return-oriented programming (ROP)</strong></td><td>lập trình hướng return</td><td>Chaining existing code snippets (gadgets) with data on the stack when injected code is not allowed.</td></tr>
<tr><td><strong>format string / command injection / SQL injection</strong></td><td>chuỗi định dạng / chèn lệnh / chèn SQL</td><td>User text interpreted as a template, a shell command or SQL; cured by separating code from data.</td></tr>
<tr><td><strong>TOCTOU</strong></td><td>TOCTOU</td><td>Time of check to time of use: the thing checked changes before it is used.</td></tr>
<tr><td><strong>back door / rootkit</strong></td><td>cửa hậu / rootkit</td><td>A secret way in left in code; malware that hides itself (firmware, hypervisor, kernel, library, application).</td></tr>
<tr><td><strong>virus / worm / trojan / spyware</strong></td><td>virus / sâu / trojan / spyware</td><td>Code copying itself into hosts; self-spreading over a network; useful-looking harmful program; software that watches the user.</td></tr>
<tr><td><strong>firewall / default deny</strong></td><td>tường lửa / mặc định từ chối</td><td>A filter between networks; allow only what is listed, drop the rest.</td></tr>
<tr><td><strong>code signing / integrity checking</strong></td><td>ký mã / kiểm tra toàn vẹn</td><td>Verify a vendor's signature on code; compare files to a known-good fingerprint list.</td></tr>
<tr><td><strong>jail (chroot) / sandbox / seccomp</strong></td><td>nhà giam (chroot) / hộp cát / seccomp</td><td>Restricting what an untrusted program can see or do; a kernel filter on every system call.</td></tr>
<tr><td><strong>least privilege / defence in depth</strong></td><td>quyền tối thiểu / phòng thủ nhiều lớp</td><td>Give each part only the rights it needs; assume a layer fails and limit the damage with the next.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>confidentiality / integrity / availability</strong></td><td>bí mật / toàn vẹn / sẵn sàng</td><td>Ba mục tiêu bảo mật (CIA): giữ dữ liệu bí mật, không bị đổi khi chưa được phép, giữ dịch vụ chạy.</td></tr>
<tr><td><strong>trusted computing base (TCB)</strong></td><td>cơ sở tin cậy</td><td>Mọi thứ phải đúng thì bảo mật mới đứng vững: phần cứng, nhân, chương trình đặc quyền.</td></tr>
<tr><td><strong>reference monitor</strong></td><td>giám sát tham chiếu</td><td>Cổng kiểm luôn được gọi, chống giả mạo, kiểm chứng được mà mọi yêu cầu truy cập phải qua (trong nhân).</td></tr>
<tr><td><strong>protection domain</strong></td><td>miền bảo vệ</td><td>Tập các cặp (đối tượng, quyền) tiến trình giữ; trong Unix là (user id, group id).</td></tr>
<tr><td><strong>protection matrix</strong></td><td>ma trận bảo vệ</td><td>Hàng = miền, cột = đối tượng, ô = quyền; lưu theo cột (ACL) hoặc theo hàng (capability).</td></tr>
<tr><td><strong>access control list (ACL)</strong></td><td>danh sách điều khiển truy cập</td><td>Danh sách gắn với đối tượng nói ai được làm gì với nó (một cột của ma trận).</td></tr>
<tr><td><strong>capability / C-list</strong></td><td>capability / danh sách capability</td><td>Tấm vé không giả được cho một đối tượng kèm quyền; danh sách của tiến trình (một hàng). File descriptor là capability.</td></tr>
<tr><td><strong>setuid / effective uid</strong></td><td>setuid / uid hiệu lực</td><td>Bit của tệp chạy chương trình với quyền của chủ nó; uid mà nhân kiểm (khác uid thật của người gọi).</td></tr>
<tr><td><strong>Linux capabilities</strong></td><td>capability của Linux</td><td>Khoảng 40 đặc quyền riêng tách nhỏ root (CAP_NET_BIND_SERVICE, CAP_DAC_OVERRIDE…).</td></tr>
<tr><td><strong>Bell–LaPadula / Biba</strong></td><td>Bell–LaPadula / Biba</td><td>Mô hình theo mức: BLP bảo vệ bí mật (không đọc lên, không ghi xuống); Biba bảo vệ toàn vẹn (không ghi lên, không đọc xuống).</td></tr>
<tr><td><strong>covert channel / steganography</strong></td><td>kênh ngầm / giấu tin</td><td>Rò dữ liệu qua tác dụng phụ chính sách bỏ qua (khoá, thời gian); giấu thông điệp trong dữ liệu bình thường (bit thấp của ảnh).</td></tr>
<tr><td><strong>hash / digital signature</strong></td><td>hàm băm / chữ ký số</td><td>Dấu vân tay một chiều cỡ cố định; bản băm được ký bằng khoá riêng và kiểm bằng khoá công khai.</td></tr>
<tr><td><strong>salt / slow hash</strong></td><td>muối / băm chậm</td><td>Giá trị ngẫu nhiên riêng cho mỗi người lưu cạnh bản băm để mật khẩu giống nhau khác nhau; băm cố ý đắt (argon2id, bcrypt, scrypt).</td></tr>
<tr><td><strong>challenge–response / TOTP</strong></td><td>hỏi–đáp / TOTP</td><td>Xác thực bằng cách trả lời thử thách mới với bí mật không đi qua đường truyền; mã một lần theo thời gian (RFC 6238).</td></tr>
<tr><td><strong>FAR / FRR</strong></td><td>FAR / FRR</td><td>Lỗi sinh trắc: chấp nhận nhầm kẻ lạ / từ chối nhầm người thật; đánh đổi nhau theo ngưỡng.</td></tr>
<tr><td><strong>buffer overflow / stack canary</strong></td><td>tràn bộ đệm / canary ngăn xếp</td><td>Ghi quá cuối bộ đệm; giá trị ngẫu nhiên được kiểm trước khi trả về để phát hiện nó.</td></tr>
<tr><td><strong>ASLR / NX (W^X)</strong></td><td>ASLR / NX (W^X)</td><td>Bố cục bộ nhớ ngẫu nhiên; trang hoặc ghi được hoặc thực thi được, không bao giờ cả hai.</td></tr>
<tr><td><strong>return-oriented programming (ROP)</strong></td><td>lập trình hướng return</td><td>Nối các đoạn mã có sẵn (gadget) bằng dữ liệu trên ngăn xếp khi mã tiêm bị cấm.</td></tr>
<tr><td><strong>format string / command injection / SQL injection</strong></td><td>chuỗi định dạng / chèn lệnh / chèn SQL</td><td>Chữ người dùng bị hiểu thành mẫu, lệnh shell hay SQL; chữa bằng cách tách mã khỏi dữ liệu.</td></tr>
<tr><td><strong>TOCTOU</strong></td><td>TOCTOU</td><td>Từ lúc kiểm tới lúc dùng: thứ được kiểm đổi trước khi được dùng.</td></tr>
<tr><td><strong>back door / rootkit</strong></td><td>cửa hậu / rootkit</td><td>Lối vào bí mật để lại trong mã; mã độc tự che giấu (phần sụn, hypervisor, nhân, thư viện, ứng dụng).</td></tr>
<tr><td><strong>virus / worm / trojan / spyware</strong></td><td>virus / sâu / trojan / spyware</td><td>Mã tự chép vào vật chủ; tự lây qua mạng; chương trình trông có ích nhưng gây hại; phần mềm theo dõi người dùng.</td></tr>
<tr><td><strong>firewall / default deny</strong></td><td>tường lửa / mặc định từ chối</td><td>Bộ lọc giữa các mạng; chỉ cho cái được liệt kê, chặn phần còn lại.</td></tr>
<tr><td><strong>code signing / integrity checking</strong></td><td>ký mã / kiểm tra toàn vẹn</td><td>Xác minh chữ ký của nhà cung cấp trên mã; so tệp với danh sách dấu vân tay tốt đã biết.</td></tr>
<tr><td><strong>jail (chroot) / sandbox / seccomp</strong></td><td>nhà giam (chroot) / hộp cát / seccomp</td><td>Hạn chế cái chương trình không tin cậy thấy hoặc làm; bộ lọc nhân trên mọi lời gọi hệ thống.</td></tr>
<tr><td><strong>least privilege / defence in depth</strong></td><td>quyền tối thiểu / phòng thủ nhiều lớp</td><td>Cho mỗi phần chỉ quyền nó cần; giả định một lớp hỏng và hạn chế thiệt hại bằng lớp kế.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Chapter 9 summary</h2>
<ol>
<li>Security goals: <strong>confidentiality, integrity, availability</strong> (threats: exposure, tampering, denial of service). Protection is the internal machinery; security is the whole problem, including people and bugs.</li>
<li>The <strong>TCB</strong> is everything you must trust; a <strong>reference monitor</strong> mediates every access (always invoked, tamper-proof, small). Keep the TCB small: few setuid-root programs, small kernels, containers.</li>
<li>A <strong>protection matrix</strong> (domains × objects) is stored by column as <strong>ACLs</strong> (good for "who can use this object?", easy revocation) or by row as <strong>capabilities</strong> (good for delegation; file descriptors, presigned URLs, JWTs). Unix: mode bits (owner, group, others), first matching class wins; setuid and Linux capabilities split root.</li>
<li><strong>Bell–LaPadula</strong> (secrecy): no read up, no write down. <strong>Biba</strong> (integrity): no write up, no read down. Models are about permissions; <strong>covert channels</strong> and steganography leak around them.</li>
<li>Crypto: secret-key (AES-GCM), public-key (signatures, key exchange), hashes (SHA-256). Never invent a cipher; Kerckhoffs: only the key is secret. A <strong>signature</strong> gives integrity + origin, not secrecy.</li>
<li>Authentication: know / have / are. Store passwords with a <strong>unique salt and a slow hash</strong> (argon2id, bcrypt, scrypt); use <strong>challenge–response</strong>, <strong>TOTP</strong> or passkeys; give one generic login error; biometrics trade <strong>FAR</strong> against <strong>FRR</strong>.</li>
<li>Bugs: <strong>buffer overflow</strong> (cures: bounds, memory-safe language; mitigations: canary, FORTIFY, ASLR/PIE, NX, CFI, shadow stack), <strong>format string</strong> (<code>printf("%s", text)</code>), <strong>injection</strong> (placeholders, argument arrays, allow-lists), integer overflow, use-after-free (sanitizers), <strong>TOCTOU</strong> (don't check then use).</li>
<li>Insiders and malware: <strong>back doors</strong> (review, reproducible builds, signatures), login spoofing/phishing (origin-bound credentials), viruses, worms, spyware, <strong>rootkits</strong> (five layers; the lower the harder), boot-sector viruses (Secure Boot, measured boot).</li>
<li>Defences: <strong>firewall</strong> (default deny, bind to loopback), <strong>scanners</strong> (signatures miss variants; integrity checking and behaviour catch them), <strong>code signing</strong>, <strong>jails/containers</strong> (namespaces, cgroups, capabilities, seccomp), model-based <strong>intrusion detection</strong>, <strong>sandboxing</strong> (SFI, WebAssembly), Java's verifier (the SecurityManager was removed in JDK 24).</li>
<li>For backend work in one sentence: non-root user, dropped capabilities, parameterized queries, salted slow password hashes, signed and pinned images, secrets out of git, and layers that each assume the one before can fail.</li>
</ol>`,
    `<h2>📌 Tóm tắt Chương 9</h2>
<ol>
<li>Mục tiêu bảo mật: <strong>bí mật, toàn vẹn, sẵn sàng</strong> (mối đe doạ: lộ, sửa trộm, từ chối dịch vụ). Protection là bộ máy bên trong; security là cả bài toán, gồm con người và lỗi.</li>
<li><strong>TCB</strong> là mọi thứ bạn buộc phải tin; <strong>giám sát tham chiếu</strong> trung gian mọi truy cập (luôn được gọi, chống giả mạo, nhỏ). Giữ TCB nhỏ: ít chương trình setuid-root, nhân nhỏ, container.</li>
<li><strong>Ma trận bảo vệ</strong> (miền × đối tượng) lưu theo cột thành <strong>ACL</strong> (tốt cho "ai dùng được đối tượng này?", thu hồi dễ) hoặc theo hàng thành <strong>capability</strong> (tốt cho uỷ quyền; file descriptor, URL ký sẵn, JWT). Unix: bit mode (chủ, nhóm, người khác), lớp khớp đầu tiên thắng; setuid và capability Linux tách nhỏ root.</li>
<li><strong>Bell–LaPadula</strong> (bí mật): không đọc lên, không ghi xuống. <strong>Biba</strong> (toàn vẹn): không ghi lên, không đọc xuống. Mô hình nói về quyền; <strong>kênh ngầm</strong> và giấu tin rò vòng quanh chúng.</li>
<li>Mật mã: khoá bí mật (AES-GCM), khoá công khai (chữ ký, trao đổi khoá), hàm băm (SHA-256). Không bao giờ tự chế mã; Kerckhoffs: chỉ khoá là bí mật. <strong>Chữ ký</strong> cho toàn vẹn + nguồn gốc, không cho bí mật.</li>
<li>Xác thực: biết / có / là. Lưu mật khẩu bằng <strong>muối riêng và băm chậm</strong> (argon2id, bcrypt, scrypt); dùng <strong>hỏi–đáp</strong>, <strong>TOTP</strong> hay passkey; chỉ một thông báo lỗi đăng nhập chung; sinh trắc đánh đổi <strong>FAR</strong> với <strong>FRR</strong>.</li>
<li>Lỗi: <strong>tràn bộ đệm</strong> (thuốc: kiểm biên, ngôn ngữ an toàn bộ nhớ; giảm nhẹ: canary, FORTIFY, ASLR/PIE, NX, CFI, shadow stack), <strong>chuỗi định dạng</strong> (<code>printf("%s", chu)</code>), <strong>chèn lệnh</strong> (placeholder, mảng đối số, danh sách cho phép), tràn số nguyên, use-after-free (sanitizer), <strong>TOCTOU</strong> (đừng kiểm rồi dùng).</li>
<li>Kẻ trong cuộc và mã độc: <strong>cửa hậu</strong> (rà soát, bản dựng tái lập, chữ ký), giả mạo đăng nhập/phishing (thông tin xác thực gắn nguồn gốc), virus, sâu, spyware, <strong>rootkit</strong> (năm tầng; càng thấp càng khó), virus boot sector (Secure Boot, khởi động có đo).</li>
<li>Phòng thủ: <strong>tường lửa</strong> (mặc định từ chối, gắn vào loopback), <strong>bộ quét</strong> (chữ ký bỏ lọt biến thể; kiểm tra toàn vẹn và hành vi bắt được), <strong>ký mã</strong>, <strong>nhà giam/container</strong> (namespace, cgroup, capability, seccomp), <strong>phát hiện xâm nhập</strong> theo mô hình, <strong>hộp cát</strong> (SFI, WebAssembly), bộ kiểm chứng của Java (SecurityManager đã bị gỡ ở JDK 24).</li>
<li>Cho công việc backend trong một câu: người dùng không phải root, bỏ capability, truy vấn tham số hoá, băm mật khẩu chậm có muối, ảnh có ký và được ghim, bí mật ngoài git, và các lớp mà mỗi lớp giả định lớp trước có thể hỏng.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-ch9) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) A denial-of-service attack is a threat to which security goal?|||(Dạng câu FE) Tấn công từ chối dịch vụ (DoS) là mối đe doạ với mục tiêu bảo mật nào?',
      options: ['Confidentiality|||Bí mật (confidentiality)', 'Integrity|||Toàn vẹn (integrity)', 'Availability|||Sẵn sàng (availability)', 'Authenticity|||Tính xác thực (authenticity)'],
      correctIndex: 2,
      points: 1,
      explanation: 'Figure 9-1 pairs each goal with its threat: confidentiality ↔ exposure of data, integrity ↔ tampering with data, availability ↔ denial of service. A DoS attack does not read or change anything; it makes the service unusable when it is needed. Lesson 9.A, slide 2.|||Hình 9-1 ghép mỗi mục tiêu với mối đe doạ: bí mật ↔ lộ dữ liệu, toàn vẹn ↔ sửa trộm dữ liệu, sẵn sàng ↔ từ chối dịch vụ. DoS không đọc hay đổi gì; nó làm dịch vụ không dùng được lúc cần. Bài 9.A, slide 2.' },
    { id: 'q2',
      question: '(FE question type) In the protection matrix of Figure 9-4 (domains 1–3 over File1–File6, Printer1, Plotter2), how many entries does the access control list of Printer1 have?|||(Dạng câu FE) Trong ma trận bảo vệ của Hình 9-4 (miền 1–3 trên File1–File6, Printer1, Plotter2), danh sách điều khiển truy cập (ACL) của Printer1 có bao nhiêu mục?',
      options: ['1|||1', '2|||2', '3|||3', '4|||4'],
      correctIndex: 1,
      points: 1,
      explanation: 'An ACL is a column of the matrix. In column Printer1 only domain 2 (Write) and domain 3 (Write) have a right, so the ACL has 2 entries. A capability list would be a ROW instead. Computed by the simulator. Lesson 9.A, slides 6 and 8.|||ACL là một CỘT của ma trận. Ở cột Printer1 chỉ miền 2 (Write) và miền 3 (Write) có quyền, nên ACL có 2 mục. Danh sách capability thì là một HÀNG. Do bộ mô phỏng tính. Bài 9.A, slide 6 và 8.' },
    { id: 'q3',
      question: '(FE question type) A system has four security levels. Under the Bell–LaPadula model, for how many ordered pairs (a, b) of levels can information flow from an object at level a to an object at level b through legal read and write operations?|||(Dạng câu FE) Một hệ thống có bốn mức an ninh. Theo mô hình Bell–LaPadula, có bao nhiêu cặp có thứ tự (a, b) mà thông tin có thể chảy từ đối tượng mức a sang đối tượng mức b bằng các thao tác đọc và ghi hợp lệ?',
      options: ['6|||6', '8|||8', '10|||10', '16|||16'],
      correctIndex: 2,
      points: 1,
      explanation: 'Reading needs object level ≤ process level and writing needs object level ≥ process level, so information can only stay level or go UP: a ≤ b. For 4 levels that is 4 + 3 + 2 + 1 = 10 pairs (the diagonal and everything above it); the 6 pairs below the diagonal are the forbidden downward leaks. Lesson 9.A, slides 14–15.|||Đọc cần mức đối tượng ≤ mức tiến trình và ghi cần mức đối tượng ≥ mức tiến trình, nên thông tin chỉ ở nguyên mức hoặc đi LÊN: a ≤ b. Với 4 mức là 4 + 3 + 2 + 1 = 10 cặp (đường chéo và mọi thứ phía trên); 6 cặp dưới đường chéo là các rò rỉ đi xuống bị cấm. Bài 9.A, slide 14–15.' },
    { id: 'q4',
      question: '(FE question type) Which statement about the Biba integrity model is correct?|||(Dạng câu FE) Phát biểu nào về mô hình toàn vẹn Biba là ĐÚNG?',
      options: ['A process may write only objects at its own level or lower (no write up) and read only objects at its level or higher (no read down)|||Tiến trình chỉ được ghi đối tượng ở mức của nó hoặc thấp hơn (không ghi lên) và chỉ được đọc đối tượng ở mức của nó hoặc cao hơn (không đọc xuống)', 'A process may read only objects at its own level or lower (no read up) and write only objects at its level or higher (no write down)|||Tiến trình chỉ được đọc đối tượng ở mức của nó hoặc thấp hơn (không đọc lên) và chỉ được ghi đối tượng ở mức của nó hoặc cao hơn (không ghi xuống)', 'A process may read and write objects at any level as long as it owns them|||Tiến trình đọc và ghi đối tượng ở mọi mức miễn là nó sở hữu chúng', 'Biba and Bell–LaPadula are the same rules under different names|||Biba và Bell–LaPadula là cùng các luật dưới tên khác'],
      correctIndex: 0,
      points: 1,
      explanation: 'Biba protects INTEGRITY: low-trust data must not flow into high-trust objects, so no write up and no read down. Option b is Bell–LaPadula (confidentiality: no read up, no write down). The two models mirror each other and cannot both be enforced on the same levels without freezing information at one level. Lesson 9.A, slide 16.|||Biba bảo vệ TOÀN VẸN: dữ liệu độ tin cậy thấp không được chảy vào đối tượng độ tin cậy cao, nên không ghi lên và không đọc xuống. Phương án b là Bell–LaPadula (bí mật: không đọc lên, không ghi xuống). Hai mô hình là hình ảnh phản chiếu và không thể thực thi cả hai trên cùng các mức mà không đóng băng thông tin ở một mức. Bài 9.A, slide 16.' },
    { id: 'q5',
      question: '(FE question type) On Linux the default mode of a new file is 666 and the process umask is 027. What is the mode of the new file?|||(Dạng câu FE) Trên Linux mode mặc định của tệp mới là 666 và umask của tiến trình là 027. Mode của tệp mới là gì?',
      options: ['640|||640', '750|||750', '027|||027', '666|||666'],
      correctIndex: 0,
      points: 1,
      explanation: 'Computed by a program: mode = 666 AND NOT 027 = 640, that is rw-r----- (owner read+write, group read, others nothing). 750 is the result for a new DIRECTORY (base 777). Lesson 9.A, slide 5 and exercise 3.|||Do chương trình tính: mode = 666 VÀ KHÔNG 027 = 640, tức rw-r----- (chủ đọc+ghi, nhóm đọc, người khác không gì). 750 là kết quả cho một THƯ MỤC mới (nền 777). Bài 9.A, slide 5 và bài tập 3.' },
    { id: 'q6',
      question: '(FE question type) Which way of storing user passwords is the correct one?|||(Dạng câu FE) Cách lưu mật khẩu người dùng nào là ĐÚNG?',
      options: ['Encrypt them with AES and keep the key in the same database|||Mã hoá bằng AES và giữ khoá trong cùng cơ sở dữ liệu', 'Store SHA-256(password) with no salt, so identical passwords are easy to spot|||Lưu SHA-256(mật khẩu) không muối, để dễ thấy các mật khẩu giống nhau', 'Store Base64(password), which cannot be read by eye|||Lưu Base64(mật khẩu), mắt thường không đọc được', 'Store a slow salted hash such as argon2id, bcrypt or scrypt, with a unique random salt per user|||Lưu băm chậm có muối như argon2id, bcrypt hay scrypt, với muối ngẫu nhiên riêng cho mỗi người dùng'],
      correctIndex: 3,
      points: 1,
      explanation: 'The server never needs the password, only to check a guess: recompute the one-way hash with the stored salt and compare. A unique salt defeats precomputed tables and makes equal passwords look different; a slow memory-hard hash makes every guess expensive (measured in lesson 9.A: one scrypt hash costs the attacker tens of thousands of times one SHA-256). A reversible form (AES with a stored key, Base64) leaks everything when the database leaks; plain unsalted SHA-256 is fast and unsalted. Lesson 9.A, slide 25.|||Máy chủ không bao giờ cần mật khẩu, chỉ cần kiểm một lần đoán: tính lại băm một chiều với muối đã lưu rồi so. Muối riêng đánh bại bảng tính sẵn và làm mật khẩu giống nhau trông khác nhau; băm chậm tốn bộ nhớ làm mỗi lần đoán đắt (đã đo ở bài 9.A: một lần băm scrypt tốn của kẻ tấn công gấp hàng chục nghìn lần một SHA-256). Dạng đảo ngược được (AES với khoá lưu kèm, Base64) lộ hết khi cơ sở dữ liệu bị lộ; SHA-256 trơn không muối thì nhanh và không muối. Bài 9.A, slide 25.' },
    { id: 'q7',
      question: '(FE question type) Using the RFC 6238 test setup (HMAC-SHA-1, shared secret "12345678901234567890", 30-second step, 8 digits), what is the one-time code at Unix time T = 59 seconds?|||(Dạng câu FE) Với thiết lập thử của RFC 6238 (HMAC-SHA-1, bí mật chung "12345678901234567890", bước 30 giây, 8 chữ số), mã dùng một lần ở thời điểm Unix T = 59 giây là gì?',
      options: ['07081804|||07081804', '94287082|||94287082', '14050471|||14050471', '89005924|||89005924'],
      correctIndex: 1,
      points: 1,
      explanation: 'Computed by a program: time step = floor(59 / 30) = 1; HMAC-SHA-1 of the 8-byte step counter, dynamic truncation, modulo 10^8 gives 94287082, which is exactly the value printed in RFC 6238 Appendix B. The other options are the RFC values for T = 1111111109, 1111111111 and 1234567890. Lesson 9.A, slide 27.|||Do chương trình tính: bước thời gian = floor(59 / 30) = 1; HMAC-SHA-1 của bộ đếm bước 8 byte, cắt động, modulo 10^8 cho 94287082, đúng giá trị in trong RFC 6238 Phụ lục B. Các phương án khác là giá trị của RFC cho T = 1111111109, 1111111111 và 1234567890. Bài 9.A, slide 27.' },
    { id: 'q8',
      question: '(FE question type) A C function logs user text with printf(msg). Which replacement removes the format string vulnerability?|||(Dạng câu FE) Một hàm C ghi nhật ký chữ người dùng bằng printf(msg). Thay bằng cái nào thì hết lỗ hổng chuỗi định dạng?',
      options: ['printf(msg + 1);|||printf(msg + 1);', 'snprintf(buf, 1, msg);|||snprintf(buf, 1, msg);', 'printf(msg, msg);|||printf(msg, msg);', 'printf("%s", msg);|||printf("%s", msg);'],
      correctIndex: 3,
      points: 1,
      explanation: "The bug is that the user's text is used AS the format, so %x and %n inside it make printf read or write the stack. The cure is to make the format a constant and pass the text as DATA: printf(\"%s\", msg). A, B and C still treat msg as a format string (or pass a wrong argument), so the same hostile text is still interpreted. Lesson 9.B, slide 32.|||Lỗi là chữ người dùng bị dùng LÀM định dạng, nên %x và %n trong đó khiến printf đọc hay ghi ngăn xếp. Thuốc là làm định dạng thành hằng và truyền chữ như DỮ LIỆU: printf(\"%s\", msg). A, B và C vẫn coi msg là chuỗi định dạng (hoặc truyền sai đối số) nên cùng chữ thù địch vẫn bị thông dịch. Bài 9.B, slide 32." },
    { id: 'q9',
      question: '(FE question type) A process built with a stack canary overflows a local buffer so that the canary is overwritten. The check before the function returns fails and the C library calls abort(). What exit status does the shell report for a process killed by SIGABRT (signal 6)?|||(Dạng câu FE) Một tiến trình dựng với canary ngăn xếp bị tràn bộ đệm cục bộ làm canary bị đè. Phép kiểm trước khi hàm trả về thất bại và thư viện C gọi abort(). Shell báo trạng thái thoát nào cho tiến trình bị SIGABRT (tín hiệu 6) giết?',
      options: ['6|||6', '11|||11', '134|||134', '139|||139'],
      correctIndex: 2,
      points: 1,
      explanation: 'A process killed by a signal reports 128 + the signal number: SIGABRT is 6, so 134 — what the lesson-9.B run printed for the canary build ("*** stack smashing detected ***"). 139 = 128 + 11 is SIGSEGV (a crash from a wild jump, the unprotected build on x86-64); 6 and 11 alone are the signal numbers, not the exit status. Lesson 9.B, slides 29–30.|||Tiến trình bị tín hiệu giết báo 128 + số tín hiệu: SIGABRT là 6, nên 134 — đúng cái lần chạy bài 9.B in cho bản có canary ("*** stack smashing detected ***"). 139 = 128 + 11 là SIGSEGV (sập do nhảy lung tung, bản không bảo vệ trên x86-64); 6 và 11 riêng lẻ là số tín hiệu, không phải trạng thái thoát. Bài 9.B, slide 29–30.' },
    { id: 'q10',
      question: "(FE question type) A packet filter has these rules, first match wins: (1) allow tcp to 207.68.160.190 port 80, (2) allow tcp to 207.68.160.191 port 25, (3) allow tcp to 207.68.160.192 port 21, (4) deny everything. Of the seven packets in the lesson's table (tcp .190:80, tcp .190:22, tcp .191:25, tcp .191:80, tcp .192:21, udp .190:80, tcp .192:20), how many are let through?|||(Dạng câu FE) Một bộ lọc gói có các luật sau, khớp đầu tiên thắng: (1) cho tcp tới 207.68.160.190 cổng 80, (2) cho tcp tới 207.68.160.191 cổng 25, (3) cho tcp tới 207.68.160.192 cổng 21, (4) chặn mọi thứ. Trong bảy gói của bảng ở bài (tcp .190:80, tcp .190:22, tcp .191:25, tcp .191:80, tcp .192:21, udp .190:80, tcp .192:20), có bao nhiêu gói được cho qua?",
      options: ['2|||2', '3|||3', '4|||4', '5|||5'],
      correctIndex: 1,
      points: 1,
      explanation: 'Computed by the simulator: only tcp .190:80 (rule 1), tcp .191:25 (rule 2) and tcp .192:21 (rule 3) match an allow rule; the other four fall to rule 4, the default deny (SSH on the web server, port 80 on the mail server, UDP, and the FTP data port 20). Default deny is the safe design: list what is allowed, not what is banned. Lesson 9.B, slide 44.|||Do bộ mô phỏng tính: chỉ tcp .190:80 (luật 1), tcp .191:25 (luật 2) và tcp .192:21 (luật 3) khớp luật cho phép; bốn gói còn lại rơi vào luật 4, mặc định từ chối (SSH trên máy chủ web, cổng 80 trên máy chủ thư, UDP và cổng dữ liệu FTP 20). Mặc định từ chối là thiết kế an toàn: liệt kê cái được phép, không phải cái bị cấm. Bài 9.B, slide 44.' },
  ],
};

const QUIZ_LESSON = {
  title: 'Chapter 9 Quiz|||Quiz chương 9',
  slug: 'osg202-quiz-ch9',
  type: 'QUIZ',
  description: '10 câu ôn Chương 9 theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ, câu tính toán có đáp án kiểm bằng mô phỏng hoặc chương trình chạy thật: ba mục tiêu bảo mật, ACL cắt từ ma trận bảo vệ, luồng thông tin của Bell–LaPadula, luật Biba, mode tệp sau umask, băm mật khẩu, mã TOTP theo RFC 6238, lỗi chuỗi định dạng, kết cục của canary bị đè, và tường lửa mặc định từ chối.',
  quiz: QUIZ,
};

export default {
  slides: [L_osg9_1, L_osg9_2],
  practice: L_on_ch9,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 9 theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ, câu tính toán có đáp án kiểm bằng mô phỏng hoặc chương trình chạy thật: ba mục tiêu bảo mật, ACL cắt từ ma trận bảo vệ, luồng thông tin của Bell–LaPadula, luật Biba, mode tệp sau umask, băm mật khẩu, mã TOTP theo RFC 6238, lỗi chuỗi định dạng, kết cục của canary bị đè, và tường lửa mặc định từ chối.',
  quizLesson: QUIZ_LESSON,
  lessons: [L_osg9_1, L_osg9_2, L_on_ch9, QUIZ_LESSON],
};
