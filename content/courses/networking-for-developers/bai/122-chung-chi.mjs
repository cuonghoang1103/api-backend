/**
 * Chương 12 · 12.3 — Chứng chỉ nên biết (slug khung netdev-12-3-chung-chi). Khái niệm, không có lab output.
 */
import { card, kv } from '../_ui.mjs';
import G from '../giang/nfd-12-3.mjs';

const L = card;

export default {
  title: '12.3 — Certifications worth knowing|||12.3 — Chứng chỉ nên biết',
  slug: 'netdev-12-3-chung-chi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'CompTIA Network+ (nền tảng trung lập) và Cisco CCNA (sâu hơn, Cisco IOS) là chứng chỉ KỸ-SƯ-MẠNG — khác việc dựng ứng dụng trên mạng. Lập trình viên cần một cái chủ yếu để chuyển sang hạ tầng/DevOps hoặc khi nhà tuyển dụng đòi; phần lớn thì KHÔNG. Chứng chỉ không dạy cái phỏng vấn thưởng: ĐO và CHẨN ĐOÁN một đường request thật (cái khoá này làm). Lập trường: kỹ năng trước, chứng chỉ chỉ để mở một cánh cửa cụ thể.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>Certifications worth knowing</h2>
<p class="lead">"Do I need a networking certification?" is one of the most common — and most over-answered — questions a developer asks. The honest answer requires judgement, not a yes/no: it depends on which job you are aiming at, and for most <em>software</em> roles the answer is no, because what interviews actually reward is the ability to reason about and measure a real request path — exactly what this course trained, and exactly what a multiple-choice cert exam does not test. This lesson tells you what the two certs you'll hear about cover, who they're for, and how to answer the question with the judgement that itself reads as senior.</p>

<h3>The two names you will hear</h3>
${kv([
  ['CompTIA Network+', 'Vendor-neutral fundamentals: OSI, IP, subnetting, routing/switching concepts, cabling, basic security. Entry-level, broad baseline.'],
  ['Cisco CCNA', 'Deeper routing/switching, VLANs, OSPF, access lists, lots of Cisco IOS. The credential when the network is your job.'],
  ['Cloud networking certs', 'AWS/GCP/Azure VPCs, load balancers, security groups — for cloud/DevOps engineers.'],
])}
<p>All of these are <strong>network-engineer</strong> credentials. They prove breadth of <em>configuration</em> knowledge — routers, switches, VLANs — which is a real and valuable skill, but a <em>different job</em> from building and debugging the applications that run on top of the network (your job).</p>

<h3>CompTIA Network+</h3>
<p>Vendor-neutral and entry-level: the OSI model, IP addressing and subnetting, routing/switching concepts, cabling and wireless, and basic network security. It teaches the <strong>vocabulary</strong> of the field rather than deep configuration. It's a sensible choice if you're entering IT, a NOC or helpdesk and want a recognised baseline. For a <strong>developer</strong>, it's mostly a vocabulary check — you already met most of its syllabus in this course, and you measured it rather than memorised it. It is not a differentiator for software roles, and employers rarely require it of developers.</p>

<h3>Cisco CCNA</h3>
<p>Deeper and more hands-on: routing and switching, VLANs, OSPF, access control lists, and a great deal of Cisco IOS specifics. It's the standard credential for someone whose <strong>job is the network itself</strong> — a network engineer or infrastructure/NetDevOps role. For most application developers it's overkill; you will rarely, if ever, configure a router. Its <strong>concepts</strong> (subnets, routing, VLANs) are genuinely worth knowing; the IOS command syntax is not, unless configuring Cisco gear is your day job.</p>

<div class="pitfall co-tieu-de">
<p><strong>A certificate proves you studied the map; it does not prove you can drive the territory — and interviews are about driving.</strong> The trap is believing a cert will substitute for demonstrable skill. It will not, because the things that make a strong networking interview — reading a real capture to tell the network apart from the app, measuring a request with <code>curl -w</code>/<code>mtr</code>/<code>iperf3</code> and acting on the numbers, diagnosing a production 502/504/524 or a stale cache or a dropped WebSocket with the layered method — are precisely what a multiple-choice exam cannot assess. This whole course was the other half: not the map, but the measurements and incidents that become your interview <em>stories</em>. So treat a cert as a <strong>door-opener for a specific role</strong> (infra/DevOps, or a contract that names it), never as a replacement for being able to explain and measure the request path. When asked "do you need a cert?", the senior answer is judgement: "For this software role, no — I diagnose with <code>dig</code>/<code>curl</code>/<code>tcpdump</code>; I'd pursue CCNA if I moved into network engineering."</p>
</div>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> an interviewer asks, "Do you have any networking certifications, and do you think you need one?"</p>
<ol>
<li>Give a 45-second answer that (a) shows you know what Network+ and CCNA cover, and (b) frames a cert as role-dependent.</li>
<li>State one case where you'd pursue a cert and one where you wouldn't.</li>
<li>Replace "I'd study for a cert" with a concrete skill demonstration — name a measurement or incident from this course you'd describe instead.</li>
</ol>
<p><strong>Done when:</strong> your answer distinguishes network-engineer certs from developer skills, is role-dependent (not a flat yes/no), and pivots to a real measurement (e.g. "I diagnose a slow request with <code>curl -w</code> and a capture") rather than a credential.</p>
<details><summary>Solution</summary>
<p>"Network+ is vendor-neutral fundamentals and CCNA is deeper Cisco routing/switching — both are network-engineer credentials. For a software role I haven't needed one: I diagnose with <code>dig</code>, <code>curl -w</code> and <code>tcpdump</code>, and I can walk a request path from DNS to the app and measure each hop. I'd get a CCNA if I moved into network engineering, or any cert a specific employer required." Pursue a cert for an infra/DevOps pivot or a contract requirement; skip it for application work where measurements and incidents demonstrate the skill directly.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['CompTIA Network+', 'Vendor-neutral, entry-level networking fundamentals cert.'],
  ['Cisco CCNA', 'Deeper routing/switching cert, heavy on Cisco IOS.'],
  ['Cloud networking cert', 'AWS/GCP/Azure VPC, LB and security-group credentials.'],
  ['Network-engineer credential', 'Proves config breadth — a different job from app development.'],
  ['Door-opener', 'A cert pursued only to meet a specific role/contract requirement.'],
])}

<h3>📌 Summary</h3>
<ul>
<li><strong>CompTIA Network+</strong> = vendor-neutral fundamentals; <strong>CCNA</strong> = deeper, Cisco-flavoured routing/switching.</li>
<li>Both are <strong>network-engineer</strong> credentials — a different job from building applications on the network.</li>
<li>A developer needs one mainly to <strong>move into infra/DevOps</strong>, or when an employer requires it.</li>
<li>Certs don't teach what interviews reward: <strong>measuring and diagnosing a real request path</strong>.</li>
<li>Stance: <strong>skills first</strong>, a cert only to open a specific door; keep the concepts, drop the vendor syntax.</li>
</ul>
${L('https://www.comptia.org/certifications/network', '📘', 'CompTIA Network+', 'Official exam objectives — the vendor-neutral fundamentals it covers.', 'Open')}
${L('https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html', '📘', 'Cisco CCNA', 'What the CCNA covers and who it is aimed at.', 'Open')}
${L('https://roadmap.sh/', '📘', 'roadmap.sh', 'Developer skill roadmaps — where networking fits for each role.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Chứng chỉ nên biết</h2>
<p class="lead">"Tôi có cần một chứng chỉ mạng không?" là một trong những câu hỏi phổ biến nhất — và bị trả lời quá mức nhất — một lập trình viên hỏi. Câu trả lời thật cần suy xét, không phải có/không: nó tuỳ việc bạn nhắm tới, và với phần lớn vai trò <em>phần mềm</em> câu trả lời là không, vì cái phỏng vấn thật sự thưởng là khả năng lập luận và đo một đường request thật — đúng cái khoá này luyện, và đúng cái một kỳ thi chứng chỉ trắc nghiệm không kiểm. Bài này cho bạn biết hai chứng chỉ bạn sẽ nghe bao gì, dành cho ai, và cách trả lời câu hỏi với suy xét mà chính nó đọc như cấp cao.</p>

<h3>Hai cái tên bạn sẽ nghe</h3>
${kv([
  ['CompTIA Network+', 'Nền tảng trung lập nhà cung cấp: OSI, IP, subnet, khái niệm định tuyến/chuyển mạch, cáp, bảo mật cơ bản. Vào nghề, nền rộng.'],
  ['Cisco CCNA', 'Định tuyến/chuyển mạch sâu hơn, VLAN, OSPF, access list, nhiều Cisco IOS. Chứng chỉ khi mạng là việc của bạn.'],
  ['Chứng chỉ mạng đám mây', 'VPC AWS/GCP/Azure, cân bằng tải, security group — cho kỹ sư đám mây/DevOps.'],
])}
<p>Tất cả là chứng chỉ <strong>kỹ-sư-mạng</strong>. Chúng chứng minh bề rộng kiến thức <em>cấu hình</em> — router, switch, VLAN — một kỹ năng thật và giá trị, nhưng một <em>việc khác</em> với dựng và gỡ các ứng dụng chạy trên mạng (việc của bạn).</p>

<h3>CompTIA Network+</h3>
<p>Trung lập nhà cung cấp và vào nghề: mô hình OSI, địa chỉ IP và subnet, khái niệm định tuyến/chuyển mạch, cáp và không dây, và bảo mật mạng cơ bản. Nó dạy <strong>từ vựng</strong> của ngành hơn là cấu hình sâu. Nó là lựa chọn hợp lý nếu bạn vào IT, một NOC hay helpdesk và muốn một nền được công nhận. Với một <strong>lập trình viên</strong>, nó chủ yếu là một kiểm từ vựng — bạn đã gặp phần lớn giáo trình của nó trong khoá này, và bạn đo nó chứ không thuộc nó. Nó không phải một điểm khác biệt cho vai trò phần mềm, và nhà tuyển dụng hiếm khi đòi nó ở lập trình viên.</p>

<h3>Cisco CCNA</h3>
<p>Sâu hơn và thực hành hơn: định tuyến và chuyển mạch, VLAN, OSPF, danh sách kiểm soát truy cập, và rất nhiều chi tiết Cisco IOS. Nó là chứng chỉ chuẩn cho người mà <strong>việc là chính mạng</strong> — một kỹ sư mạng hay vai trò hạ tầng/NetDevOps. Với phần lớn lập trình viên ứng dụng nó thừa; bạn sẽ hiếm khi, nếu có, cấu hình một router. Các <strong>khái niệm</strong> của nó (subnet, định tuyến, VLAN) thật sự đáng biết; cú pháp lệnh IOS thì không, trừ khi cấu hình thiết bị Cisco là việc hằng ngày của bạn.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một chứng chỉ chứng minh bạn đã học bản đồ; nó không chứng minh bạn lái được vùng đất — và phỏng vấn là về lái.</strong> Cái bẫy là tin một chứng chỉ sẽ thay cho kỹ năng chứng minh được. Nó sẽ không, vì những thứ làm nên một phỏng vấn mạng mạnh — đọc một bản bắt thật để phân biệt mạng khỏi app, đo một yêu cầu với <code>curl -w</code>/<code>mtr</code>/<code>iperf3</code> và hành động theo con số, chẩn đoán một 502/504/524 production hay một cache cũ hay một WebSocket rớt với phương pháp theo tầng — đúng là cái một kỳ thi trắc nghiệm không đánh giá được. Cả khoá này là nửa kia: không phải bản đồ, mà các phép đo và sự cố thành câu <em>chuyện</em> phỏng vấn của bạn. Nên coi một chứng chỉ là một <strong>cái mở cửa cho một vai trò cụ thể</strong> (hạ tầng/DevOps, hay một hợp đồng gọi tên nó), không bao giờ là thứ thay cho việc giải thích và đo được đường request. Khi được hỏi "bạn có cần một chứng chỉ không?", câu trả lời cấp cao là suy xét: "Cho vai trò phần mềm này, không — tôi chẩn đoán với <code>dig</code>/<code>curl</code>/<code>tcpdump</code>; tôi sẽ theo CCNA nếu chuyển sang kỹ thuật mạng."</p>
</div>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một người phỏng vấn hỏi, "Bạn có chứng chỉ mạng nào không, và bạn có nghĩ mình cần một cái?"</p>
<ol>
<li>Cho một câu trả lời 45 giây (a) cho thấy bạn biết Network+ và CCNA bao gì, và (b) khung một chứng chỉ là tuỳ vai trò.</li>
<li>Nêu một trường hợp bạn sẽ theo một chứng chỉ và một trường hợp bạn sẽ không.</li>
<li>Thay "tôi sẽ học một chứng chỉ" bằng một trình diễn kỹ năng cụ thể — gọi tên một phép đo hay sự cố từ khoá này bạn sẽ mô tả thay vào.</li>
</ol>
<p><strong>Đạt khi:</strong> câu trả lời của bạn phân biệt chứng chỉ kỹ-sư-mạng với kỹ năng lập trình viên, tuỳ vai trò (không phải một có/không phẳng), và xoay sang một phép đo thật (vd "tôi chẩn đoán một yêu cầu chậm với <code>curl -w</code> và một bản bắt") hơn là một chứng chỉ.</p>
<details><summary>Lời giải</summary>
<p>"Network+ là nền tảng trung lập và CCNA là định tuyến/chuyển mạch Cisco sâu hơn — cả hai là chứng chỉ kỹ-sư-mạng. Cho một vai trò phần mềm tôi chưa cần một cái: tôi chẩn đoán với <code>dig</code>, <code>curl -w</code> và <code>tcpdump</code>, và tôi đi được một đường request từ DNS tới app và đo mỗi chặng. Tôi sẽ lấy CCNA nếu chuyển sang kỹ thuật mạng, hay bất kỳ chứng chỉ nào một nhà tuyển dụng cụ thể đòi." Theo một chứng chỉ cho một bước sang hạ tầng/DevOps hay một yêu cầu hợp đồng; bỏ qua nó cho việc ứng dụng nơi phép đo và sự cố trình diễn kỹ năng trực tiếp.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['CompTIA Network+', 'Chứng chỉ nền tảng mạng trung lập, vào nghề.'],
  ['Cisco CCNA', 'Chứng chỉ định tuyến/chuyển mạch sâu hơn, nặng Cisco IOS.'],
  ['Chứng chỉ mạng đám mây', 'Chứng chỉ VPC, LB và security-group của AWS/GCP/Azure.'],
  ['Chứng chỉ kỹ-sư-mạng', 'Chứng minh bề rộng cấu hình — một việc khác với phát triển ứng dụng.'],
  ['Cái mở cửa', 'Một chứng chỉ theo chỉ để đáp một yêu cầu vai trò/hợp đồng cụ thể.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><strong>CompTIA Network+</strong> = nền tảng trung lập; <strong>CCNA</strong> = định tuyến/chuyển mạch sâu hơn, vị Cisco.</li>
<li>Cả hai là chứng chỉ <strong>kỹ-sư-mạng</strong> — một việc khác với dựng ứng dụng trên mạng.</li>
<li>Một lập trình viên cần một cái chủ yếu để <strong>chuyển sang hạ tầng/DevOps</strong>, hay khi một nhà tuyển dụng đòi.</li>
<li>Chứng chỉ không dạy cái phỏng vấn thưởng: <strong>đo và chẩn đoán một đường request thật</strong>.</li>
<li>Lập trường: <strong>kỹ năng trước</strong>, một chứng chỉ chỉ để mở một cánh cửa cụ thể; giữ khái niệm, bỏ cú pháp nhà cung cấp.</li>
</ul>
${L('https://www.comptia.org/certifications/network', '📘', 'CompTIA Network+', 'Mục tiêu thi chính thức — nền tảng trung lập nó bao.', 'Mở')}
${L('https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html', '📘', 'Cisco CCNA', 'CCNA bao gì và nhắm tới ai.', 'Mở')}
${L('https://roadmap.sh/', '📘', 'roadmap.sh', 'Lộ trình kỹ năng lập trình viên — mạng hợp ở đâu cho mỗi vai trò.', 'Mở')}
</div>
`,
};
