/**
 * OSG202 · Nâng cao 1 — Virtualization & the Cloud (osg7: N1.A 1–21, chủ đề thuyết trình).
 * Bài 📑 học theo từng slide: osg7 (tmp_07.pptx, slide 1–21).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: osg202-on-n1.
 * Quiz MỚI (10 câu, slug osg202-quiz-n1).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs từ gen/src/**, gen/code/**, gen/sim/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node OSG202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── N1.A — 📑 Slide by slide · Virtualization and the Cloud: hypervisors, nested page tables, the cloud, VMware (slides 1–21) ───────── */
const L_osg7_1 = {
  title: 'N1.A — 📑 Slide by slide · Virtualization and the Cloud: hypervisors, nested page tables, the cloud, VMware (slides 1–21)|||N1.A — 📑 Học theo từng slide · Ảo hoá và đám mây: hypervisor, bảng trang lồng, đám mây, VMware (slide 1–21)',
  slug: 'osg202-slide-osg7-1',
  type: 'VIDEO',
  description: 'Giảng đủ 21 slide Chương 7 (Tanenbaum, Modern Operating Systems 4e) — chủ đề thuyết trình của môn: ba yêu cầu Popek–Goldberg, hypervisor loại 1 và loại 2, trap-and-emulate, vì sao x86 từng không ảo hoá được, dịch nhị phân, paravirtualization và hypercall, bảng trang lồng (EPT/NPT), ảo hoá I/O với virtio, đám mây theo NIST (IaaS/PaaS/SaaS), kiến trúc VMware (hosted, world switch, ESX) — mỗi ý có lệnh hoặc chương trình chạy thật trên Linux (container không phải máy ảo, namespace và cgroup, đo chi phí bẫy, thiết bị virtio của chính máy ảo Docker), hai mô phỏng (CPU có ảo hoá được không, bảng trang lồng 24 lần đọc), năm sơ đồ, phần cập nhật 2026 (KVM, Nitro, Firecracker, Apple Virtualization) và dàn ý thuyết trình 20 phút cho nhóm.',
  content: [
    bi(`<span class="eyebrow">Advanced 1 · Lesson N1.A · deck "Chapter 7 · Virtualization and the Cloud", slides 1–21</span>
<h2>One machine, many machines: how virtualization works, and why the cloud is built on it</h2>
<p class="lead">Virtualization is the idea that a program — the <strong>hypervisor</strong> — can hand each of several operating systems the illusion that it owns a whole computer. It is the technology under every virtual private server you will ever rent, under every cloud region, and under the Linux virtual machine that Docker Desktop starts on your laptop. This chapter is also one of the three official <strong>presentation topics</strong> of OSG202 (with Chapter 10 UNIX/Linux/Android and Chapter 11 Windows), worth 20% of the grade, so this lesson is written to be presented: every idea has a picture, a demonstration that runs, and a question the audience is likely to ask.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–2</td><td>7.1–7.2 History, requirements</td><td>state the three properties of a good hypervisor (safety, fidelity, efficiency) and the Popek–Goldberg condition</td></tr>
<tr><td>3–4</td><td>7.3 Type 1 and type 2 hypervisors</td><td>place ESXi, Xen, Hyper-V, KVM, VMware Workstation and VirtualBox, and say how containers differ from virtual machines</td></tr>
<tr><td>5–8</td><td>7.4–7.5 Efficient virtualization, microkernels</td><td>follow trap-and-emulate, explain why x86 was "unvirtualizable", binary translation, paravirtualization and a hypercall</td></tr>
<tr><td>9</td><td>7.6 Memory virtualization</td><td>compute why a TLB miss costs 24 memory reads with nested page tables</td></tr>
<tr><td>10</td><td>7.11 Clouds</td><td>list NIST's five characteristics and the three service models, and map IaaS, PaaS and SaaS to real products</td></tr>
<tr><td>11–20</td><td>7.12 Case study: VMware</td><td>draw VMware's hosted architecture, world switch and the type-1 ESX Server, and say what each design bought</td></tr>
</tbody>
</table>
<div class="callout">The older web lesson N1.1 ("From OS concepts to the cloud") stays as a one-page orientation. This lesson goes slide by slide, adds what the slides leave out (live migration, virtio, hardware assist, the cloud service models) and corrects what has aged. Concepts from earlier chapters come back here: the trap into the kernel (lesson 1.B), page tables and the TLB (Chapter 3), device drivers and DMA (Chapter 5).</div>`,
    `<span class="eyebrow">Nâng cao 1 · Bài N1.A · deck "Chapter 7 · Virtualization and the Cloud", slide 1–21</span>
<h2>Một máy, nhiều máy: ảo hoá hoạt động ra sao, và vì sao đám mây xây trên nó</h2>
<p class="lead">Ảo hoá (virtualization) là ý tưởng rằng một chương trình — <strong>hypervisor</strong> (bộ giám sát máy ảo) — có thể đưa cho mỗi hệ điều hành trong số nhiều hệ điều hành ảo giác rằng nó sở hữu cả một máy tính. Đó là công nghệ nằm dưới mọi máy chủ ảo (VPS) bạn từng thuê, dưới mọi vùng đám mây, và dưới máy ảo Linux mà Docker Desktop khởi động trên laptop của bạn. Chương này cũng là một trong ba <strong>chủ đề thuyết trình</strong> chính thức của OSG202 (cùng Chương 10 UNIX/Linux/Android và Chương 11 Windows), chiếm 20% điểm, nên bài này được viết để trình bày: mỗi ý có một hình, một demo chạy được, và một câu hỏi mà khán giả hay hỏi.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–2</td><td>7.1–7.2 Lịch sử, yêu cầu</td><td>nêu ba tính chất của một hypervisor tốt (an toàn, trung thực, hiệu quả) và điều kiện Popek–Goldberg</td></tr>
<tr><td>3–4</td><td>7.3 Hypervisor loại 1 và loại 2</td><td>xếp ESXi, Xen, Hyper-V, KVM, VMware Workstation, VirtualBox vào đúng loại, và nói container khác máy ảo ở đâu</td></tr>
<tr><td>5–8</td><td>7.4–7.5 Ảo hoá hiệu quả, vi nhân</td><td>theo dõi trap-and-emulate, giải thích vì sao x86 từng "không ảo hoá được", dịch nhị phân, paravirtualization và hypercall</td></tr>
<tr><td>9</td><td>7.6 Ảo hoá bộ nhớ</td><td>tính vì sao một lần TLB hụt tốn 24 lần đọc bộ nhớ khi có bảng trang lồng</td></tr>
<tr><td>10</td><td>7.11 Đám mây</td><td>kể năm đặc tính của NIST và ba mô hình dịch vụ, và gắn IaaS, PaaS, SaaS với sản phẩm thật</td></tr>
<tr><td>11–20</td><td>7.12 Ca nghiên cứu: VMware</td><td>vẽ kiến trúc hosted của VMware, world switch và ESX Server loại 1, và nói mỗi thiết kế đổi lại được gì</td></tr>
</tbody>
</table>
<div class="callout">Bài web cũ N1.1 ("Từ khái niệm OS tới đám mây") vẫn giữ làm trang định hướng ngắn. Bài này đi từng slide, thêm những thứ slide bỏ qua (di trú trực tiếp, virtio, hỗ trợ phần cứng, các mô hình dịch vụ đám mây) và đính chính chỗ đã cũ. Khái niệm các chương trước quay lại ở đây: cú bẫy vào nhân (bài 1.B), bảng trang và TLB (Chương 3), driver và DMA (Chương 5).</div>`),
    walkHead('osg7', 1, 21),
    walk('osg7', [
      [1, 'Virtualization and the Cloud',
        `<p class="y-chinh">🎯 Chapter 7: <strong>virtualization</strong> — software that makes ONE physical computer behave like MANY separate computers — and <strong>the cloud</strong>, which rents those computers by the hour.</p>
<p>Picture an apartment building. One building (the physical machine), many apartments (virtual machines). Each tenant has a key, a door and the feeling of living alone; none can walk into another's flat, and the building manager (the hypervisor) decides who gets how much water and electricity. Now picture a house where several people share the same kitchen and bathroom but each has a locked room — that is a <strong>container</strong>: cheaper and faster to set up, but everybody uses the same plumbing (the same kernel). Keep both pictures; the whole chapter is about how the "manager" is built and what the walls cost.</p>
<p>Why a backend developer cares, concretely: the VPS that hosts your project is a virtual machine (on most providers a KVM guest); the CI runner that tests your pull request is a virtual machine; on a Mac or Windows laptop <code>docker run</code> starts a hidden Linux virtual machine first. The program below ran inside a container, and the container itself lives in such a machine. Ask it whose kernel it sees:</p>
<div class="out"># You are inside a CONTAINER right now. Whose kernel is it?<br>
$ uname -srm<br>
Linux 7.0.12-linuxkit aarch64<br>
$ cat /proc/version<br>
Linux version 7.0.12-linuxkit (root@buildkitsandbox) (gcc (Alpine 15.2.0) 15.2.0, GNU ld (GNU Binutils) 2.45.1) #1 SMP PREEMPT Thu Aug 27 14:02:21 UTC 2026<br>
# uname -r and /proc/version must agree: there is ONE kernel, and this container does not own it<br>
$ echo "uname -r = $(uname -r) ; /proc/version says $(awk '{print $3}' /proc/version)"<br>
uname -r = 7.0.12-linuxkit ; /proc/version says 7.0.12-linuxkit<br>
# A container has its own view of processes (PID namespace)...<br>
$ ps -e -o pid,comm | head -5<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 bash<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19 ps<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 head<br>
# ...but the same CPUs and the same RAM as the machine below it<br>
$ echo "CPUs: $(nproc)"; grep MemTotal /proc/meminfo<br>
CPUs: 10<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
# The "walls" are namespaces: one link per kind<br>
$ ls /proc/self/ns | tr '\\n' ' '; echo<br>
cgroup ipc mnt net pid pid_for_children time time_for_children user uts</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>This is a <em>Linux</em> kernel (<code>7.0.12-linuxkit</code>, built for ARM64) although the course is built on a Mac: containers need a Linux kernel, so Docker Desktop boots a small Linux virtual machine and every container shares its kernel. The 10 CPUs and about 8 GB of RAM are the VM's, not the Mac's. <code>uname -r</code> and <code>/proc/version</code> agree because there is one kernel; the container only has its own <em>view</em> of processes, mounts, network and so on (the <code>ls /proc/self/ns</code> line — you will build one in slide 4). One run on one machine: on Windows with WSL 2 you would see <code>…-microsoft-standard-WSL2</code> and <code>x86_64</code>.</p>
<p class="pitfall">⚠️ "Virtual" means different things in this course: <em>virtual memory</em> (Chapter 3 — each process sees a private address space) is not <em>virtual machine</em> (this chapter — each OS sees a private computer). Both are the same trick, "give each client the illusion of owning the resource", applied at two levels. FE questions that mention "virtual machine" in other chapters (FE5#7, FE12#6, FE14#8: "monolithic / layers / microkernel / client-server / virtual machine / exokernel" in Chapter 1) are about OS <em>structure</em>, not hypervisors.</p>`,
        `<p class="y-chinh">🎯 Chương 7: <strong>ảo hoá</strong> (virtualization) — phần mềm làm MỘT máy tính vật lý cư xử như NHIỀU máy tính riêng biệt — và <strong>đám mây</strong> (the cloud), nơi cho thuê các máy tính đó theo giờ.</p>
<p>Hình dung một toà chung cư. Một toà nhà (máy vật lý), nhiều căn hộ (máy ảo). Mỗi người thuê có chìa khoá, cửa riêng và cảm giác sống một mình; không ai bước được vào căn của người khác, còn người quản lý toà nhà (hypervisor) quyết định ai được bao nhiêu điện nước. Giờ hình dung một ngôi nhà nhiều người chung bếp và phòng tắm nhưng mỗi người có một phòng khoá riêng — đó là <strong>container</strong>: rẻ hơn và dựng nhanh hơn, nhưng mọi người dùng chung đường ống (chung một nhân). Giữ cả hai hình ảnh trong đầu; cả chương nói về "người quản lý" được xây thế nào và các bức tường tốn bao nhiêu.</p>
<p>Vì sao dev backend phải quan tâm, cụ thể: VPS chạy dự án của bạn là một máy ảo (ở đa số nhà cung cấp là khách của KVM); máy chạy CI kiểm tra pull request cũng là máy ảo; trên laptop Mac hay Windows, <code>docker run</code> trước hết khởi động một máy ảo Linux ẩn. Chương trình dưới đây chạy trong một container, và container đó nằm trong một máy ảo như thế. Hỏi nó xem nó thấy nhân của ai:</p>
<div class="out"># Bạn đang ở trong một CONTAINER. Nhân này của ai?<br>
$ uname -srm<br>
Linux 7.0.12-linuxkit aarch64<br>
$ cat /proc/version<br>
Linux version 7.0.12-linuxkit (root@buildkitsandbox) (gcc (Alpine 15.2.0) 15.2.0, GNU ld (GNU Binutils) 2.45.1) #1 SMP PREEMPT Thu Aug 27 14:02:21 UTC 2026<br>
# uname -r và /proc/version phải khớp: chỉ có MỘT nhân, và container này không sở hữu nó<br>
$ echo "uname -r = $(uname -r) ; /proc/version says $(awk '{print $3}' /proc/version)"<br>
uname -r = 7.0.12-linuxkit ; /proc/version says 7.0.12-linuxkit<br>
# Container có góc nhìn riêng về tiến trình (PID namespace)...<br>
$ ps -e -o pid,comm | head -5<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 bash<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19 ps<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 head<br>
# ...nhưng cùng CPU và cùng RAM với cỗ máy bên dưới<br>
$ echo "CPUs: $(nproc)"; grep MemTotal /proc/meminfo<br>
CPUs: 10<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
# Các "bức tường" là namespace: mỗi loại một liên kết<br>
$ ls /proc/self/ns | tr '\\n' ' '; echo<br>
cgroup ipc mnt net pid pid_for_children time time_for_children user uts</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Đây là nhân <em>Linux</em> (<code>7.0.12-linuxkit</code>, dựng cho ARM64) dù khoá học được dựng trên Mac: container cần nhân Linux, nên Docker Desktop khởi động một máy ảo Linux nhỏ và mọi container dùng chung nhân của nó. 10 CPU và khoảng 8 GB RAM là của máy ảo, không phải của Mac. <code>uname -r</code> và <code>/proc/version</code> khớp nhau vì chỉ có một nhân; container chỉ có <em>góc nhìn</em> riêng về tiến trình, điểm mount, mạng… (dòng <code>ls /proc/self/ns</code> — bạn sẽ tự dựng một cái ở slide 4). Đây là một lần chạy trên một máy: trên Windows với WSL 2 bạn sẽ thấy <code>…-microsoft-standard-WSL2</code> và <code>x86_64</code>.</p>
<p class="pitfall">⚠️ "Virtual" mang nghĩa khác nhau trong môn này: <em>bộ nhớ ảo</em> (Chương 3 — mỗi tiến trình thấy một không gian địa chỉ riêng) không phải <em>máy ảo</em> (chương này — mỗi HĐH thấy một máy tính riêng). Cả hai là cùng một mẹo, "cho mỗi khách ảo giác sở hữu tài nguyên", áp dụng ở hai tầng. Các câu FE nhắc "virtual machine" ở chương khác (FE5#7, FE12#6, FE14#8: "monolithic / layers / microkernel / client-server / virtual machine / exokernel" ở Chương 1) hỏi về <em>cấu trúc</em> HĐH, không phải hypervisor.</p>`],
      [2, 'Requirements for Virtualization',
        `<p class="y-chinh">🎯 A hypervisor should score well on three dimensions: <strong>Safety</strong> (it keeps full control of the virtualized resources), <strong>Fidelity</strong> (a program on a virtual machine behaves exactly as on bare hardware) and <strong>Efficiency</strong> (most of the code in the virtual machine runs with no intervention by the hypervisor).</p>
<p>Return to the apartment building. <em>Safety</em>: the manager holds the master key — no tenant can lock the manager out, cut off another tenant's power, or knock down the wall. <em>Fidelity</em>: the flat must be a normal flat; the tenant's furniture (the guest operating system, unmodified) must work without being rebuilt. <em>Efficiency</em>: if the tenant had to ask the manager's permission to open every cupboard, nobody would live there — only the dangerous actions (touching the electricity panel) may need the manager. These three are the 1974 requirements of <strong>Gerald Popek and Robert Goldberg</strong> (<em>Formal Requirements for Virtualizable Third Generation Architectures</em>, Communications of the ACM 17(7)), where they are called <em>resource control</em>, <em>equivalence</em> and <em>efficiency</em>.</p>
<p>➕ The same paper gives the test that decides whether a CPU can be virtualized with the simplest technique, <strong>trap-and-emulate</strong>. Split the instructions in two sets. <strong>Privileged</strong> instructions are those that <em>trap</em> (raise an exception) when executed in user mode. <strong>Sensitive</strong> instructions are those that read or change the machine's privileged state or resources (the interrupt flag, the page-table register, I/O). <strong>Theorem 1:</strong> a virtual machine monitor can be built if every sensitive instruction is privileged. Why: the guest's kernel is run in user mode; each time it tries something sensitive the CPU traps into the hypervisor, which emulates the effect on <em>virtual</em> state and resumes the guest. A sensitive instruction that does <em>not</em> trap breaks both fidelity (it gives the wrong answer) and safety (the guest changes the real machine). Slides 5, 6 and 12 show the CPU that failed the test — x86 for fifteen years.</p>
<p class="meo">🧠 Memorise the trio as <strong>S-F-E</strong>: Safety = who is in control; Fidelity = same behaviour; Efficiency = rarely interrupt. When you present, give each one an everyday sentence like the building one — it is easier to remember than the definitions.</p>
<p class="pitfall">⚠️ Fidelity does not promise equal <em>speed</em> (a VM is a little slower) or equal <em>timing</em> — Popek and Goldberg exempt timing effects. It promises equal <em>results</em>. And "Efficiency" is about the <em>fraction of instructions</em> that need the hypervisor, not about how fast the hypervisor itself is.</p>`,
        `<p class="y-chinh">🎯 Một hypervisor tốt phải đạt điểm cao ở ba chiều: <strong>An toàn (Safety)</strong> (nó giữ toàn quyền kiểm soát các tài nguyên được ảo hoá), <strong>Trung thực (Fidelity)</strong> (chương trình trên máy ảo cư xử y hệt trên phần cứng trần) và <strong>Hiệu quả (Efficiency)</strong> (phần lớn mã trong máy ảo chạy mà hypervisor không phải can thiệp).</p>
<p>Quay lại toà chung cư. <em>An toàn</em>: người quản lý giữ chìa khoá chủ — không người thuê nào khoá ngoài được quản lý, cắt điện của người khác hay đục tường. <em>Trung thực</em>: căn hộ phải là căn hộ bình thường; đồ đạc của người thuê (HĐH guest, không sửa) phải dùng được mà không phải làm lại. <em>Hiệu quả</em>: nếu người thuê phải xin phép quản lý mỗi lần mở tủ bếp thì chẳng ai ở nổi — chỉ những việc nguy hiểm (sờ vào tủ điện) mới cần tới quản lý. Ba điều này là yêu cầu năm 1974 của <strong>Gerald Popek và Robert Goldberg</strong> (<em>Formal Requirements for Virtualizable Third Generation Architectures</em>, Communications of the ACM 17(7)), nơi chúng tên là <em>resource control</em> (kiểm soát tài nguyên), <em>equivalence</em> (tương đương) và <em>efficiency</em>.</p>
<p>➕ Cũng bài báo đó đưa ra phép thử xem một CPU có ảo hoá được bằng kỹ thuật đơn giản nhất, <strong>trap-and-emulate</strong> (bẫy rồi giả lập), hay không. Chia các lệnh làm hai tập. Lệnh <strong>đặc quyền (privileged)</strong> là lệnh <em>bẫy</em> (gây ngoại lệ) khi chạy ở chế độ người dùng. Lệnh <strong>nhạy cảm (sensitive)</strong> là lệnh đọc hoặc đổi trạng thái đặc quyền hay tài nguyên của máy (cờ ngắt, thanh ghi bảng trang, I/O). <strong>Định lý 1:</strong> có thể xây một bộ giám sát máy ảo nếu MỌI lệnh nhạy cảm đều là lệnh đặc quyền. Lý do: nhân của guest chạy ở chế độ người dùng; mỗi lần nó thử một việc nhạy cảm, CPU bẫy vào hypervisor, hypervisor giả lập hiệu ứng lên trạng thái <em>ảo</em> rồi cho guest chạy tiếp. Một lệnh nhạy cảm mà <em>không</em> bẫy sẽ phá cả tính trung thực (cho kết quả sai) lẫn an toàn (guest sửa máy thật). Slide 5, 6 và 12 cho thấy con CPU trượt phép thử này — x86 suốt mười lăm năm.</p>
<p class="meo">🧠 Nhớ bộ ba bằng <strong>S-F-E</strong>: Safety = ai nắm quyền; Fidelity = cùng hành vi; Efficiency = ít khi ngắt. Khi thuyết trình, cho mỗi ý một câu đời thường như ví dụ toà nhà — dễ nhớ hơn định nghĩa.</p>
<p class="pitfall">⚠️ Trung thực không hứa hẹn cùng <em>tốc độ</em> (máy ảo chậm hơn một chút) hay cùng <em>thời gian</em> — Popek và Goldberg loại trừ hiệu ứng thời gian. Nó hứa cùng <em>kết quả</em>. Và "Hiệu quả" nói về <em>tỉ lệ lệnh</em> cần tới hypervisor, không phải bản thân hypervisor chạy nhanh cỡ nào.</p>`],
      [3, 'Type 1 and Type 2 Hypervisors (1)',
        `<p class="y-chinh">🎯 Figure 7-1: (a) a <strong>type 1</strong> hypervisor runs directly on the bare hardware and the guest operating systems (here Windows and Linux) run on top of it, plus a <em>control domain</em> for management; (b) a <strong>type 2</strong> hypervisor runs as a program on an ordinary <em>host</em> operating system, and each guest OS is a process of the host.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/34b5119272505f20835a12817076bf9f6c83b769.svg" alt="Figure 7-1 redrawn with today's names — and KVM, which does not fit either box cleanly" loading="lazy" /><p class="chu-thich">🧩 Figure 7-1 redrawn with today's names — and KVM, which does not fit either box cleanly</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 7-1 redrawn with 2026 examples: type 1 on bare metal, type 2 on a host OS, and KVM, which is both
rectangle "(a) Type 1 — bare-metal hypervisor\\nESXi · Xen · Hyper-V" as A {
  rectangle "VM 1\\nguest OS + apps" as A1
  rectangle "VM 2\\nguest OS + apps" as A2
  rectangle "Control domain / root partition\\n(management, device drivers)" as AC
  rectangle "Hypervisor" as AH #FDE68A
  rectangle "Hardware: CPU, RAM, disk, network" as AHW #E5E7EB
  A1 -[hidden]down-&gt; AH
  A2 -[hidden]down-&gt; AH
  AC -[hidden]down-&gt; AH
  AH -[hidden]down-&gt; AHW
}
rectangle "(b) Type 2 — hosted hypervisor\\nVMware Workstation · VirtualBox · Parallels" as B {
  rectangle "VM\\nguest OS + apps" as B1
  rectangle "VMM process / driver" as BV #FDE68A
  rectangle "Host OS (Windows, macOS, Linux)\\n+ its own processes" as BH #BFDBFE
  rectangle "Hardware" as BHW #E5E7EB
  B1 -[hidden]down-&gt; BV
  BV -[hidden]down-&gt; BH
  BH -[hidden]down-&gt; BHW
}
rectangle "(c) KVM — the Linux kernel IS the hypervisor\\nQEMU (user space) draws the virtual hardware" as C {
  rectangle "VM = a QEMU process\\nguest OS + apps" as C1
  rectangle "Linux kernel + kvm.ko\\n(scheduler, memory manager, drivers)" as CK #FDE68A
  rectangle "Hardware (VT-x / AMD-V / ARM EL2)" as CHW #E5E7EB
  C1 -[hidden]down-&gt; CK
  CK -[hidden]down-&gt; CHW
}
A -[hidden]right-&gt; B
B -[hidden]right-&gt; C
@enduml</code></pre></details>
<p>Type 1 means <em>no operating system underneath</em>: the hypervisor is itself a small, specialised kernel that schedules virtual CPUs, manages memory and (in some designs) owns the drivers. In the slide's picture the "control domain" is the privileged guest used to manage the machine and often to run the device drivers — Xen calls it <strong>Dom0</strong>, Hyper-V calls it the <strong>root partition</strong>. Type 2 means the hypervisor is installed like an application on Windows, macOS or Linux; it is easy to install (you can click "Run" on your laptop) but every I/O of the guest passes through the host's drivers and every guest CPU competes with host processes. That is why servers use type 1 and laptops use type 2.</p>
<p>➕ <strong>KVM</strong> (Kernel-based Virtual Machine) is why the neat division is argued about. It is a module of the Linux kernel, merged in version 2.6.20 (released 5 February 2007): it turns the Linux kernel into a hypervisor (type-1-like — nothing sits below it), while a user-space program, usually <strong>QEMU</strong>, draws the virtual hardware and runs each VM as an ordinary Linux process (type-2-like — you can still <code>ps</code> and <code>kill</code> it). The slide table puts KVM in type 2; many authors call it type 1. Both are defensible — what matters is that you can say <em>why</em>. Almost every VPS you can rent, and the cloud under many big providers, is a KVM guest.</p>
<p class="pitfall">⚠️ FE questions on this slide: "Regarding the hypervisor, the OS running on the hardware is called the host operating system — which type?" = <strong>Type 2</strong> (FE16#49; the wording is loose, because type 1 products also have a "root partition", but the host OS belongs to type 2); "VMware Workstation is:" = <strong>Type 2 hypervisor</strong> (FE21#37, FE23#33, FE24#7); "differentiate type 1 and type 2 … which is generally more efficient for enterprise" = <strong>Type 1, as it runs directly on hardware</strong> (FE9#50); "VMM is also known as" = <strong>hypervisor</strong> (FE1#20, FE3#40, FE15#50 — not "hypovisor", which is a spelling trap).</p>`,
        `<p class="y-chinh">🎯 Hình 7-1: (a) hypervisor <strong>loại 1</strong> chạy thẳng trên phần cứng trần và các HĐH guest (ở đây là Windows và Linux) chạy trên nó, kèm một <em>control domain</em> để quản lý; (b) hypervisor <strong>loại 2</strong> chạy như một chương trình trên một HĐH <em>chủ (host)</em> bình thường, và mỗi HĐH guest là một tiến trình của HĐH chủ.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/34b5119272505f20835a12817076bf9f6c83b769.svg" alt="Hình 7-1 vẽ lại với tên hôm nay — và KVM, thứ không nằm gọn trong hộp nào" loading="lazy" /><p class="chu-thich">🧩 Hình 7-1 vẽ lại với tên hôm nay — và KVM, thứ không nằm gọn trong hộp nào</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 7-1 vẽ lại với ví dụ 2026: loại 1 chạy trên phần cứng trần, loại 2 chạy trên HĐH chủ, và KVM thì là cả hai
rectangle "(a) Type 1 — bare-metal hypervisor\\nESXi · Xen · Hyper-V" as A {
  rectangle "VM 1\\nguest OS + apps" as A1
  rectangle "VM 2\\nguest OS + apps" as A2
  rectangle "Control domain / root partition\\n(management, device drivers)" as AC
  rectangle "Hypervisor" as AH #FDE68A
  rectangle "Hardware: CPU, RAM, disk, network" as AHW #E5E7EB
  A1 -[hidden]down-&gt; AH
  A2 -[hidden]down-&gt; AH
  AC -[hidden]down-&gt; AH
  AH -[hidden]down-&gt; AHW
}
rectangle "(b) Type 2 — hosted hypervisor\\nVMware Workstation · VirtualBox · Parallels" as B {
  rectangle "VM\\nguest OS + apps" as B1
  rectangle "VMM process / driver" as BV #FDE68A
  rectangle "Host OS (Windows, macOS, Linux)\\n+ its own processes" as BH #BFDBFE
  rectangle "Hardware" as BHW #E5E7EB
  B1 -[hidden]down-&gt; BV
  BV -[hidden]down-&gt; BH
  BH -[hidden]down-&gt; BHW
}
rectangle "(c) KVM — the Linux kernel IS the hypervisor\\nQEMU (user space) draws the virtual hardware" as C {
  rectangle "VM = a QEMU process\\nguest OS + apps" as C1
  rectangle "Linux kernel + kvm.ko\\n(scheduler, memory manager, drivers)" as CK #FDE68A
  rectangle "Hardware (VT-x / AMD-V / ARM EL2)" as CHW #E5E7EB
  C1 -[hidden]down-&gt; CK
  CK -[hidden]down-&gt; CHW
}
A -[hidden]right-&gt; B
B -[hidden]right-&gt; C
@enduml</code></pre></details>
<p>Loại 1 nghĩa là <em>không có hệ điều hành bên dưới</em>: bản thân hypervisor là một nhân nhỏ chuyên dụng, lập lịch các CPU ảo, quản lý bộ nhớ và (ở một số thiết kế) giữ các driver. Trong hình slide, "control domain" là guest đặc quyền dùng để quản lý máy và thường chạy các driver thiết bị — Xen gọi nó là <strong>Dom0</strong>, Hyper-V gọi là <strong>root partition</strong>. Loại 2 nghĩa là hypervisor được cài như một ứng dụng trên Windows, macOS hay Linux; cài dễ (bấm "Run" ngay trên laptop) nhưng mọi I/O của guest đi qua driver của HĐH chủ và mỗi CPU của guest tranh với tiến trình của HĐH chủ. Vì thế máy chủ dùng loại 1, laptop dùng loại 2.</p>
<p>➕ <strong>KVM</strong> (Kernel-based Virtual Machine) là lý do sự phân chia gọn gàng này bị tranh cãi. Nó là một mô-đun của nhân Linux, nhập vào phiên bản 2.6.20 (phát hành 5/2/2007): nó biến chính nhân Linux thành hypervisor (giống loại 1 — không có gì bên dưới), trong khi một chương trình ở không gian người dùng, thường là <strong>QEMU</strong>, vẽ phần cứng ảo và chạy mỗi VM như một tiến trình Linux bình thường (giống loại 2 — bạn vẫn <code>ps</code> và <code>kill</code> được nó). Bảng ở slide xếp KVM vào loại 2; nhiều tác giả gọi nó loại 1. Cả hai đều bảo vệ được — điều quan trọng là bạn nói được <em>vì sao</em>. Gần như mọi VPS bạn thuê được, và đám mây dưới nhiều nhà cung cấp lớn, đều là khách của KVM.</p>
<p class="pitfall">⚠️ Câu FE về slide này: "Về hypervisor, HĐH chạy trên phần cứng gọi là HĐH chủ — loại nào?" = <strong>Type 2</strong> (FE16#49; câu hỏi hơi lỏng vì sản phẩm loại 1 cũng có "root partition", nhưng HĐH chủ thuộc loại 2); "VMware Workstation là:" = <strong>hypervisor loại 2</strong> (FE21#37, FE23#33, FE24#7); "phân biệt loại 1 và 2 … loại nào thường hiệu quả hơn cho doanh nghiệp" = <strong>Type 1, vì chạy thẳng trên phần cứng</strong> (FE9#50); "VMM còn gọi là" = <strong>hypervisor</strong> (FE1#20, FE3#40, FE15#50 — không phải "hypovisor", bẫy chính tả).</p>`],
      [4, 'Type 1 and Type 2 Hypervisors (2)',
        `<p class="y-chinh">🎯 Figure 7-2 classifies products by two choices: <strong>how</strong> the CPU is virtualized (without hardware support, paravirtualization, with hardware support, or "process virtualization") and <strong>where</strong> the hypervisor sits (type 1 or type 2) — ESX Server 1.0 and VMware Workstation 1 (no hardware support), Xen 1.0 (paravirtualization), vSphere / Xen / Hyper-V and VMware Fusion / KVM / Parallels (with hardware support), Wine (process virtualization).</p>
<p>The table is a 2015 snapshot with historical version numbers, so read it as a map of ideas, not a product list (the typo "Virtualizaton" is the slide's). Three rows matter today. <em>Without hardware support</em> is the era of binary translation (slides 13–14); <em>paravirtualization</em> is Xen's idea (slide 7); <em>with hardware support</em> is what every server has run since about 2006 — Intel VT-x (first on two Pentium 4 models, 13 November 2005) and AMD-V (2006) add a new CPU mode so a guest kernel can run natively. The last row, <strong>process virtualization</strong>, is the odd one: Wine does not run an operating system, it translates Windows system calls into Linux ones for a single program. It is the cousin of the technology you use every day.</p>
<p>➕ <strong>Containers are process virtualization at the OS level.</strong> A VM virtualizes the <em>hardware</em> (each guest brings a kernel); a container virtualizes the <em>operating system's view</em> (all containers share the host kernel). Linux builds a container from two kernel features: <strong>namespaces</strong> (what a process can <em>see</em>: its own process IDs, hostname, mounts, network, users — <code>namespaces(7)</code>) and <strong>cgroups</strong> (how much it can <em>use</em>: memory, CPU, process count — <code>cgroups(7)</code>). First, how does software notice it is inside a VM at all?</p>
<div class="out"># How does software notice that it runs inside a virtual machine?<br>
$ echo "architecture: $(uname -m)"<br>
architecture: aarch64<br>
$ echo "CPUs with the hypervisor flag: $(grep -c -w hypervisor /proc/cpuinfo)"<br>
CPUs with the hypervisor flag: 0<br>
# x86 CPUs set CPUID bit 31 of leaf 1 ("hypervisor present") — shown as the flag above. ARM64 has no such flag<br>
$ lscpu | grep -E "Architecture|Vendor ID|Hypervisor|Virtualization type"<br>
Architecture: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;aarch64<br>
Vendor ID: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Apple<br>
# The firmware tables of a virtual PC say so too (x86 only; ARM images have no DMI)<br>
$ cat /sys/class/dmi/id/product_name 2&gt;/dev/null || echo "(no DMI table here)"<br>
(no DMI table here)<br>
# The most reliable sign on ARM: the devices are VIRTIO devices, not real hardware<br>
$ for d in /sys/bus/virtio/devices/*; do echo "$(basename $d) &nbsp;$(basename $(readlink $d/driver))"; done<br>
virtio0 &nbsp;virtio_net<br>
virtio1 &nbsp;virtio_console<br>
virtio10 &nbsp;vmw_vsock_virtio_transport<br>
virtio11 &nbsp;virtio_rng<br>
virtio12 &nbsp;virtio_balloon<br>
virtio2 &nbsp;virtio_blk<br>
virtio3 &nbsp;virtio_blk<br>
virtio4 &nbsp;virtiofs<br>
virtio5 &nbsp;virtiofs<br>
virtio6 &nbsp;virtiofs<br>
virtio7 &nbsp;virtiofs<br>
virtio8 &nbsp;virtiofs<br>
virtio9 &nbsp;virtiofs</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>On x86 the answer is a CPU flag, <code>hypervisor</code>, which the hypervisor turns on (CPUID bit 31 of leaf 1), and a firmware table (DMI) that says "Virtual Machine" or "KVM". This machine is ARM64 — Apple's chip — which has neither, so the clear sign is the set of <strong>virtio</strong> devices (virtual disks, network, console, random-number generator, memory balloon, a socket for host–guest talk, and a shared file system): hardware that exists only in software. Now build the container walls by hand, with no Docker:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># A container is made of OS features, not of a hypervisor. First: namespaces (own view)<br>
$ unshare --fork --pid --mount-proc --uts bash -c 'hostname vm-gia; echo "inside: hostname=$(hostname) pid=$$"; ps -e -o pid,comm'<br>
inside: hostname=vm-gia pid=1<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ps<br>
$ echo "outside: hostname is still $(hostname)"<br>
outside: hostname is still osg-lab<br>
# Second: cgroups (a limit). cgroup v2 forbids processes in a group that delegates controllers, so move this shell aside first<br>
$ mkdir /sys/fs/cgroup/init &amp;&amp; echo $$ &gt; /sys/fs/cgroup/init/cgroup.procs<br>
$ echo "+memory" &gt; /sys/fs/cgroup/cgroup.subtree_control<br>
$ mkdir /sys/fs/cgroup/demo<br>
$ echo 32M &gt; /sys/fs/cgroup/demo/memory.max<br>
$ echo "limit: $(cat /sys/fs/cgroup/demo/memory.max) bytes"<br>
limit: 33554432 bytes<br>
# A program that eats memory without end, inside the group<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/demo/cgroup.procs; tail /dev/zero'; echo "exit=$?"<br>
bash: &nbsp;&nbsp;&nbsp;31 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bash -c 'echo $$ &gt; /sys/fs/cgroup/demo/cgroup.procs; tail /dev/zero'<br>
exit=137<br>
$ grep oom_kill /sys/fs/cgroup/demo/memory.events<br>
oom_kill 1<br>
# The kernel killed ONLY that process; the rest of the machine did not notice</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Two things happened. <code>unshare</code> created new PID and UTS namespaces: inside, our shell is process 1 and the hostname is <code>vm-gia</code>, but the hostname outside did not change — no hypervisor, no second kernel, only a different <em>view</em>. Then a cgroup with <code>memory.max = 32 MiB</code> killed the program that tried to eat memory forever (<code>exit=137</code> = 128 + SIGKILL, <code>oom_kill 1</code>), and only that program. A VM draws its wall in hardware, a container in kernel bookkeeping: lighter and faster (no guest kernel to boot), but a kernel bug can cross the wall, which is why clouds that run strangers' code put containers <em>inside</em> micro-VMs (Firecracker, slide 20).</p>
<p class="pitfall">⚠️ "Docker is a lightweight VM" is the classic wrong answer. Docker on Linux has <em>no</em> hypervisor at all; Docker Desktop on Mac/Windows has one only because containers need a Linux kernel and your laptop does not run one. Docker for Mac offers the Apple Virtualization framework or Docker's own VMM for that VM (QEMU was dropped on 14 July 2025 — docs.docker.com/desktop/vmm). Also: the book's table puts VMware under "type 1/type 2" by <em>product</em>; since late 2023 VMware belongs to Broadcom, and many companies now evaluate KVM-based platforms — cite the date if you present it.</p>`,
        `<p class="y-chinh">🎯 Hình 7-2 phân loại sản phẩm theo hai lựa chọn: CPU được ảo hoá <strong>bằng cách nào</strong> (không có hỗ trợ phần cứng, paravirtualization, có hỗ trợ phần cứng, hay "ảo hoá tiến trình") và hypervisor nằm <strong>ở đâu</strong> (loại 1 hay loại 2) — ESX Server 1.0 và VMware Workstation 1 (không hỗ trợ phần cứng), Xen 1.0 (paravirtualization), vSphere / Xen / Hyper-V và VMware Fusion / KVM / Parallels (có hỗ trợ phần cứng), Wine (ảo hoá tiến trình).</p>
<p>Bảng là ảnh chụp năm 2015 với số phiên bản lịch sử, nên đọc nó như bản đồ ý tưởng chứ không phải danh sách sản phẩm (lỗi "Virtualizaton" là của slide). Ba hàng quan trọng đến nay. <em>Không có hỗ trợ phần cứng</em> là thời của dịch nhị phân (slide 13–14); <em>paravirtualization</em> là ý của Xen (slide 7); <em>có hỗ trợ phần cứng</em> là thứ mọi máy chủ chạy từ khoảng 2006 — Intel VT-x (đầu tiên trên hai mẫu Pentium 4, 13/11/2005) và AMD-V (2006) thêm một chế độ CPU mới để nhân guest chạy nguyên bản. Hàng cuối, <strong>ảo hoá tiến trình</strong>, là hàng lạ: Wine không chạy một hệ điều hành, nó dịch lời gọi hệ thống Windows sang Linux cho một chương trình. Nó là họ hàng của công nghệ bạn dùng mỗi ngày.</p>
<p>➕ <strong>Container là ảo hoá tiến trình ở tầng HĐH.</strong> Máy ảo ảo hoá <em>phần cứng</em> (mỗi guest mang theo một nhân); container ảo hoá <em>góc nhìn của hệ điều hành</em> (mọi container dùng chung nhân của máy chủ). Linux dựng container từ hai tính năng của nhân: <strong>namespace</strong> (tiến trình <em>thấy</em> gì: mã tiến trình, hostname, điểm mount, mạng, người dùng riêng — <code>namespaces(7)</code>) và <strong>cgroup</strong> (nó được <em>dùng</em> bao nhiêu: bộ nhớ, CPU, số tiến trình — <code>cgroups(7)</code>). Trước hết, phần mềm nhận ra mình đang ở trong một máy ảo bằng cách nào?</p>
<div class="out"># Phần mềm nhận ra mình đang chạy trong máy ảo bằng cách nào?<br>
$ echo "architecture: $(uname -m)"<br>
architecture: aarch64<br>
$ echo "CPUs with the hypervisor flag: $(grep -c -w hypervisor /proc/cpuinfo)"<br>
CPUs with the hypervisor flag: 0<br>
# CPU x86 bật bit 31 của CPUID lá 1 ("có hypervisor") — hiện thành cờ ở trên. ARM64 không có cờ đó<br>
$ lscpu | grep -E "Architecture|Vendor ID|Hypervisor|Virtualization type"<br>
Architecture: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;aarch64<br>
Vendor ID: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Apple<br>
# Bảng firmware của PC ảo cũng nói thế (chỉ x86; ARM không có DMI)<br>
$ cat /sys/class/dmi/id/product_name 2&gt;/dev/null || echo "(no DMI table here)"<br>
(no DMI table here)<br>
# Dấu hiệu chắc nhất trên ARM: thiết bị là thiết bị VIRTIO, không phải phần cứng thật<br>
$ for d in /sys/bus/virtio/devices/*; do echo "$(basename $d) &nbsp;$(basename $(readlink $d/driver))"; done<br>
virtio0 &nbsp;virtio_net<br>
virtio1 &nbsp;virtio_console<br>
virtio10 &nbsp;vmw_vsock_virtio_transport<br>
virtio11 &nbsp;virtio_rng<br>
virtio12 &nbsp;virtio_balloon<br>
virtio2 &nbsp;virtio_blk<br>
virtio3 &nbsp;virtio_blk<br>
virtio4 &nbsp;virtiofs<br>
virtio5 &nbsp;virtiofs<br>
virtio6 &nbsp;virtiofs<br>
virtio7 &nbsp;virtiofs<br>
virtio8 &nbsp;virtiofs<br>
virtio9 &nbsp;virtiofs</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Trên x86 câu trả lời là một cờ CPU, <code>hypervisor</code>, do hypervisor bật lên (bit 31 của CPUID lá 1), và một bảng firmware (DMI) ghi "Virtual Machine" hay "KVM". Máy này là ARM64 — chip của Apple — không có cả hai, nên dấu hiệu rõ nhất là tập thiết bị <strong>virtio</strong> (đĩa ảo, mạng, console, bộ sinh số ngẫu nhiên, balloon bộ nhớ, socket để host và guest nói chuyện, và hệ thống tệp chung): phần cứng chỉ tồn tại trong phần mềm. Giờ tự dựng các bức tường container bằng tay, không cần Docker:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Container làm từ tính năng của HĐH, không phải hypervisor. Trước hết: namespace (góc nhìn riêng)<br>
$ unshare --fork --pid --mount-proc --uts bash -c 'hostname vm-gia; echo "inside: hostname=$(hostname) pid=$$"; ps -e -o pid,comm'<br>
inside: hostname=vm-gia pid=1<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ps<br>
$ echo "outside: hostname is still $(hostname)"<br>
outside: hostname is still osg-lab<br>
# Thứ hai: cgroup (giới hạn). cgroup v2 cấm tiến trình nằm trong nhóm đang chia quyền điều khiển, nên dời shell này sang một bên trước<br>
$ mkdir /sys/fs/cgroup/init &amp;&amp; echo $$ &gt; /sys/fs/cgroup/init/cgroup.procs<br>
$ echo "+memory" &gt; /sys/fs/cgroup/cgroup.subtree_control<br>
$ mkdir /sys/fs/cgroup/demo<br>
$ echo 32M &gt; /sys/fs/cgroup/demo/memory.max<br>
$ echo "limit: $(cat /sys/fs/cgroup/demo/memory.max) bytes"<br>
limit: 33554432 bytes<br>
# Chương trình ăn bộ nhớ không dừng, trong nhóm đó<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/demo/cgroup.procs; tail /dev/zero'; echo "exit=$?"<br>
bash: &nbsp;&nbsp;&nbsp;31 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bash -c 'echo $$ &gt; /sys/fs/cgroup/demo/cgroup.procs; tail /dev/zero'<br>
exit=137<br>
$ grep oom_kill /sys/fs/cgroup/demo/memory.events<br>
oom_kill 1<br>
# Nhân chỉ giết ĐÚNG tiến trình đó; phần còn lại của máy không hay biết</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Hai việc đã xảy ra. <code>unshare</code> tạo namespace PID và UTS mới: bên trong, shell của ta là tiến trình 1 và hostname là <code>vm-gia</code>, nhưng hostname bên ngoài không đổi — không hypervisor, không nhân thứ hai, chỉ khác <em>góc nhìn</em>. Rồi một cgroup với <code>memory.max = 32 MiB</code> giết chương trình cố ăn bộ nhớ mãi (<code>exit=137</code> = 128 + SIGKILL, <code>oom_kill 1</code>), và chỉ riêng chương trình đó. Máy ảo vẽ bức tường bằng phần cứng, container vẽ bằng sổ sách của nhân: nhẹ và nhanh hơn (không phải khởi động nhân guest), nhưng một lỗi nhân có thể vượt tường, nên các đám mây chạy mã của người lạ đặt container <em>bên trong</em> micro-VM (Firecracker, slide 20).</p>
<p class="pitfall">⚠️ "Docker là máy ảo nhẹ" là câu trả lời sai kinh điển. Docker trên Linux <em>không có</em> hypervisor nào; Docker Desktop trên Mac/Windows có một cái chỉ vì container cần nhân Linux mà laptop bạn không chạy nhân đó. Docker cho Mac cho chọn Apple Virtualization framework hoặc VMM riêng của Docker cho máy ảo ấy (QEMU bị bỏ ngày 14/07/2025 — docs.docker.com/desktop/vmm). Ngoài ra: bảng của sách xếp VMware vào "loại 1/loại 2" theo <em>sản phẩm</em>; từ cuối 2023 VMware thuộc Broadcom và nhiều công ty giờ cân nhắc nền tảng dựa trên KVM — nếu thuyết trình hãy ghi rõ ngày tháng.</p>`],
      [5, 'Techniques for Efficient Virtualization',
        `<p class="y-chinh">🎯 Figure 7-3, <strong>trap-and-emulate</strong>: the guest operating system believes it runs in kernel mode ("virtual kernel mode") but the real CPU runs it in <em>user</em> mode; when it executes a privileged instruction the CPU <strong>traps</strong> to the hypervisor — the only code in real kernel mode — which emulates the instruction on the VM's <em>virtual</em> state and lets the guest continue. Guest user programs run at full speed, with no trap at all.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/cb36777e115849ce40cd3cdd3e12f629a8df1deb.svg" alt="Figure 7-3 as a sequence — one CLI instruction, from the guest's point of view and the hypervisor's" loading="lazy" /><p class="chu-thich">🧩 Figure 7-3 as a sequence — one CLI instruction, from the guest's point of view and the hypervisor's</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 7-3 as a sequence: the guest kernel runs a privileged instruction; the CPU traps; the hypervisor emulates it on VIRTUAL state
participant "Guest kernel\\n(thinks it is in kernel mode)" as G
participant "CPU" as C
participant "Hypervisor\\n(real kernel mode)" as H
G -&gt; C : CLI  (disable interrupts)
C -&gt; H : TRAP — not allowed outside kernel mode,\\nsave the guest's registers (VM exit)
H -&gt; H : emulate: virtual_IF := 0\\n(the REAL interrupt flag stays 1)
H -&gt; C : resume the guest at the NEXT instruction (VM entry)
C -&gt; G : continues; the guest believes\\nit just disabled interrupts
note over G, H : cost: a trap + two state switches for every sensitive instruction —\\nthis is why Efficiency asks that MOST instructions run with no trap at all
@enduml</code></pre></details>
<p>The idea is the same as the system call you met in lesson 1.B, one level up. A user program may not disable interrupts, so the CPU refuses and enters the kernel; the kernel does what is right. Here the "user program" is the whole guest kernel and the "kernel" is the hypervisor. The hypervisor keeps, for each virtual CPU, a record of the <em>virtual</em> machine state — the virtual interrupt flag, the virtual page-table register, the virtual mode — and every emulated instruction edits that record, never the real registers. When the instruction was <code>CLI</code> (disable interrupts), the hypervisor sets <code>virtual_IF = 0</code> and the <em>real</em> flag stays 1, so a timer interrupt still reaches the hypervisor and the guest cannot hold the machine hostage. That is <strong>safety</strong> and <strong>fidelity</strong> at once, and as long as sensitive instructions are rare, <strong>efficiency</strong> as well. In today's hardware vocabulary the trap is a <strong>VM exit</strong>, the return a <strong>VM entry</strong>; each saves and restores a block of CPU state (on Intel the <em>VMCS</em>).</p>
<p>➕ Trap-and-emulate can be touched without any hypervisor, because the same mechanism exists between user mode and the kernel. The ARM64 instruction <code>MRS … MIDR_EL1</code> ("which CPU model am I?") is not allowed in user mode; Linux catches the fault and <em>emulates</em> it so programs can read the CPU identity (docs.kernel.org, arm64/cpu-feature-registers). Compare three costs in one process:</p>
<pre><code class="language-c">// Trap-and-emulate you can touch: an instruction the CPU refuses in user mode is TRAPPED by the kernel and EMULATED
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/syscall.h&gt;

static double now_ns(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t); return t.tv_sec * 1e9 + t.tv_nsec; }
__attribute__((noinline)) static long add_one(long x) { __asm__ volatile("" ::"r"(x)); return x + 1; }   // never inlined

int main(void) {
    const int N = 2000000;
    double t0 = now_ns(); long s = 0;
    for (int i = 0; i &lt; N; i++) s += add_one(i);
    double t1 = now_ns();
    for (int i = 0; i &lt; N; i++) syscall(SYS_getppid);                      // user -&gt; kernel -&gt; user
    double t2 = now_ns();
    unsigned long v = 0;
#if defined(__aarch64__)
    // MIDR_EL1 = "which CPU am I?" — a system register that EL0 (user mode) may not read directly.
    for (int i = 0; i &lt; N; i++) __asm__ volatile("mrs %0, midr_el1" : "=r"(v));
    const char *ten = "mrs midr_el1 (ARM64)";
#elif defined(__x86_64__)
    // CPUID is not privileged on bare metal, but a hypervisor makes it TRAP: in a VM every CPUID is a VM exit.
    for (int i = 0; i &lt; N; i++) { unsigned a = 0, b, c, d; __asm__ volatile("cpuid" : "+a"(a), "=b"(b), "=c"(c), "=d"(d)); v = a; }
    const char *ten = "cpuid (x86-64)";
#endif
    double t3 = now_ns();
    printf("plain function call   %4.0f ns   (no mode change)\\n", (t1 - t0) / N);
    printf("system call getppid() %4.0f ns   (trap into the kernel, handled by the kernel itself)\\n", (t2 - t1) / N);
    printf("trapped instruction   %4.0f ns   (%s, value 0x%lx)\\n", (t3 - t2) / N, ten, v);
    (void)s;
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bay-vao-nhan.c -o bay-vao-nhan &amp;&amp; ./bay-vao-nhan<br>
plain function call &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 ns &nbsp;&nbsp;(no mode change)<br>
system call getppid() &nbsp;192 ns &nbsp;&nbsp;(trap into the kernel, handled by the kernel itself)<br>
trapped instruction &nbsp;&nbsp;&nbsp;143 ns &nbsp;&nbsp;(mrs midr_el1 (ARM64), value 0x610f0000)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>A plain call costs a few nanoseconds. A system call (<code>getppid</code>) and the trapped <code>mrs</code> each cost <strong>hundreds</strong> of nanoseconds — a 50- to 100-fold step, just for crossing the mode boundary and coming back. A real VM exit crosses a bigger boundary (it swaps the CPU's whole virtualization state), so it costs more again; this program on an x86 virtual machine would time <code>cpuid</code>, which a hypervisor always traps (the source contains that branch; this run is ARM64). The lesson of efficiency is therefore: <em>keep the number of traps small</em>. Ordinary instructions and — with hardware support — ordinary system calls inside the guest never leave the guest.</p>
<p class="meo">🧠 Say it in one line for the presentation: <em>"A hypervisor is a kernel whose user programs are operating systems."</em> Trap-and-emulate then follows: the guest kernel is the "user program", a privileged instruction is the "system call".</p>
<p class="pitfall">⚠️ Do not draw the guest's own system calls as traps to the hypervisor on modern hardware: with VT-x / AMD-V a guest user program calling its guest kernel stays inside the guest; the hypervisor is involved only for the events it asked to intercept (some I/O, some privileged state, external interrupts). In the pre-hardware era (slides 6, 13–14) such calls <em>did</em> pass through the hypervisor, which is part of why that era was slower.</p>`,
        `<p class="y-chinh">🎯 Hình 7-3, <strong>trap-and-emulate</strong>: HĐH guest tin rằng nó chạy ở chế độ nhân ("virtual kernel mode") nhưng CPU thật chạy nó ở chế độ <em>người dùng</em>; khi nó chạy một lệnh đặc quyền, CPU <strong>bẫy (trap)</strong> vào hypervisor — mã duy nhất ở chế độ nhân thật — hypervisor giả lập lệnh đó lên trạng thái <em>ảo</em> của VM rồi cho guest chạy tiếp. Chương trình người dùng của guest chạy hết tốc độ, không bẫy lần nào.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/cb36777e115849ce40cd3cdd3e12f629a8df1deb.svg" alt="Hình 7-3 dạng tuần tự — một lệnh CLI, nhìn từ guest và từ hypervisor" loading="lazy" /><p class="chu-thich">🧩 Hình 7-3 dạng tuần tự — một lệnh CLI, nhìn từ guest và từ hypervisor</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 7-3 dạng tuần tự: nhân guest chạy lệnh đặc quyền; CPU bẫy; hypervisor giả lập trên trạng thái ẢO
participant "Guest kernel\\n(thinks it is in kernel mode)" as G
participant "CPU" as C
participant "Hypervisor\\n(real kernel mode)" as H
G -&gt; C : CLI  (disable interrupts)
C -&gt; H : TRAP — not allowed outside kernel mode,\\nsave the guest's registers (VM exit)
H -&gt; H : emulate: virtual_IF := 0\\n(the REAL interrupt flag stays 1)
H -&gt; C : resume the guest at the NEXT instruction (VM entry)
C -&gt; G : continues; the guest believes\\nit just disabled interrupts
note over G, H : cost: a trap + two state switches for every sensitive instruction —\\nthis is why Efficiency asks that MOST instructions run with no trap at all
@enduml</code></pre></details>
<p>Ý tưởng giống lời gọi hệ thống bạn gặp ở bài 1.B, nhưng nhích lên một tầng. Chương trình người dùng không được tắt ngắt, nên CPU từ chối và vào nhân; nhân làm điều đúng đắn. Ở đây "chương trình người dùng" là cả nhân của guest và "nhân" là hypervisor. Hypervisor giữ, cho mỗi CPU ảo, một bản ghi <em>trạng thái máy ảo</em> — cờ ngắt ảo, thanh ghi bảng trang ảo, chế độ ảo — và mọi lệnh được giả lập đều sửa bản ghi đó, không bao giờ sửa thanh ghi thật. Khi lệnh là <code>CLI</code> (tắt ngắt), hypervisor đặt <code>virtual_IF = 0</code> còn cờ <em>thật</em> vẫn là 1, nên ngắt đồng hồ vẫn tới hypervisor và guest không thể bắt máy làm con tin. Đó là <strong>an toàn</strong> và <strong>trung thực</strong> cùng lúc, và chừng nào lệnh nhạy cảm còn hiếm, cả <strong>hiệu quả</strong> nữa. Theo từ vựng phần cứng hiện nay, cú bẫy là <strong>VM exit</strong>, cú quay về là <strong>VM entry</strong>; mỗi cái lưu và khôi phục một khối trạng thái CPU (trên Intel là <em>VMCS</em>).</p>
<p>➕ Có thể sờ trap-and-emulate mà không cần hypervisor, vì cùng cơ chế đó tồn tại giữa chế độ người dùng và nhân. Lệnh ARM64 <code>MRS … MIDR_EL1</code> ("tôi là mẫu CPU nào?") không được phép ở chế độ người dùng; Linux bắt lỗi và <em>giả lập</em> nó để chương trình đọc được danh tính CPU (docs.kernel.org, arm64/cpu-feature-registers). So sánh ba chi phí trong một tiến trình:</p>
<pre><code class="language-c">// Trap-and-emulate sờ được: lệnh CPU từ chối ở chế độ người dùng bị nhân BẮT và GIẢ LẬP
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/syscall.h&gt;

static double now_ns(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t); return t.tv_sec * 1e9 + t.tv_nsec; }
__attribute__((noinline)) static long add_one(long x) { __asm__ volatile("" ::"r"(x)); return x + 1; }   // không bao giờ được inline

int main(void) {
    const int N = 2000000;
    double t0 = now_ns(); long s = 0;
    for (int i = 0; i &lt; N; i++) s += add_one(i);
    double t1 = now_ns();
    for (int i = 0; i &lt; N; i++) syscall(SYS_getppid);                      // người dùng -&gt; nhân -&gt; người dùng
    double t2 = now_ns();
    unsigned long v = 0;
#if defined(__aarch64__)
    // MIDR_EL1 = "tôi là CPU nào?" — thanh ghi hệ thống mà EL0 (chế độ người dùng) không được đọc trực tiếp.
    for (int i = 0; i &lt; N; i++) __asm__ volatile("mrs %0, midr_el1" : "=r"(v));
    const char *ten = "mrs midr_el1 (ARM64)";
#elif defined(__x86_64__)
    // CPUID không đặc quyền trên máy thật, nhưng hypervisor khiến nó TRAP: trong VM mỗi CPUID là một VM exit.
    for (int i = 0; i &lt; N; i++) { unsigned a = 0, b, c, d; __asm__ volatile("cpuid" : "+a"(a), "=b"(b), "=c"(c), "=d"(d)); v = a; }
    const char *ten = "cpuid (x86-64)";
#endif
    double t3 = now_ns();
    printf("plain function call   %4.0f ns   (no mode change)\\n", (t1 - t0) / N);
    printf("system call getppid() %4.0f ns   (trap into the kernel, handled by the kernel itself)\\n", (t2 - t1) / N);
    printf("trapped instruction   %4.0f ns   (%s, value 0x%lx)\\n", (t3 - t2) / N, ten, v);
    (void)s;
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bay-vao-nhan.c -o bay-vao-nhan &amp;&amp; ./bay-vao-nhan<br>
plain function call &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 ns &nbsp;&nbsp;(no mode change)<br>
system call getppid() &nbsp;192 ns &nbsp;&nbsp;(trap into the kernel, handled by the kernel itself)<br>
trapped instruction &nbsp;&nbsp;&nbsp;143 ns &nbsp;&nbsp;(mrs midr_el1 (ARM64), value 0x610f0000)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Một lời gọi hàm thường tốn vài nano giây. Một lời gọi hệ thống (<code>getppid</code>) và lệnh <code>mrs</code> bị bẫy mỗi cái tốn <strong>hàng trăm</strong> nano giây — một bước nhảy 50 đến 100 lần, chỉ vì băng qua ranh giới chế độ rồi quay về. Một VM exit thật băng qua ranh giới lớn hơn (nó đổi cả trạng thái ảo hoá của CPU) nên còn tốn hơn nữa; chương trình này trên một máy ảo x86 sẽ đo <code>cpuid</code>, lệnh mà hypervisor luôn bẫy (mã nguồn có nhánh đó; lần chạy này là ARM64). Bài học về hiệu quả vì vậy là: <em>giữ số cú bẫy thật ít</em>. Lệnh thường và — khi có hỗ trợ phần cứng — cả lời gọi hệ thống bình thường bên trong guest không bao giờ rời guest.</p>
<p class="meo">🧠 Nói gọn một dòng khi thuyết trình: <em>"Hypervisor là một cái nhân mà chương trình người dùng của nó là các hệ điều hành."</em> Trap-and-emulate suy ra ngay: nhân guest là "chương trình người dùng", lệnh đặc quyền là "lời gọi hệ thống".</p>
<p class="pitfall">⚠️ Đừng vẽ lời gọi hệ thống của chính guest thành cú bẫy sang hypervisor trên phần cứng hiện đại: với VT-x / AMD-V, chương trình người dùng của guest gọi nhân guest vẫn ở trong guest; hypervisor chỉ dính vào những sự kiện nó đăng ký chặn (một số I/O, một số trạng thái đặc quyền, ngắt ngoài). Thời trước phần cứng (slide 6, 13–14) những lời gọi đó <em>có</em> đi qua hypervisor, và đó là một phần lý do thời ấy chậm hơn.</p>`],
      [6, 'Virtualizing the Unvirtualizable',
        `<p class="y-chinh">🎯 Figure 7-4: x86 has four privilege rings (0 innermost … 3 user). With <strong>binary translation</strong> the hypervisor runs in ring 0, the guest kernel is pushed out to ring 1, guest user programs stay in ring 3, and the hypervisor <strong>rewrites the guest's code before it executes</strong>, replacing the instructions that would misbehave with code that emulates them. (The slide says "binary translates"; the word is <em>translator</em>.)</p>
<p>Why "unvirtualizable"? Popek and Goldberg's theorem (slide 2) needs every sensitive instruction to trap in user mode. The Intel x86 of 1985–2005 broke the rule: it has instructions that read or change privileged state <em>without</em> trapping when run outside ring 0. A study by Robin and Irvine (USENIX Security 2000) counted <strong>17</strong> of them, among them <code>PUSHF</code> and <code>POPF</code> (push / pop the flags register, whose bit IF is the interrupt flag), <code>SGDT</code> and <code>SIDT</code> (read where the kernel's descriptor tables really are) and the segment-register instructions. Take the pattern every kernel uses to guard a critical section — <code>PUSHF; CLI; …; POPF</code> (save the flags, disable interrupts, do the work, restore the flags). Run it in a guest kernel pushed to ring 1: <code>CLI</code> traps (good), but <code>POPF</code> silently <em>ignores</em> the interrupt-flag bit because the CPU is not in ring 0 — and <code>PUSHF</code> pushes the <em>real</em> flags, not the guest's. No trap, no chance for the hypervisor to fix it; the guest just misbehaves. The simulator replays exactly this on a toy CPU with only an interrupt flag:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/80ba163edbd496ad1d89b89410e5718cbf9de91e.svg" alt="Two kernel patterns × five ways to run them — only &quot;x86 before VT-x&quot; gets a wrong answer" loading="lazy" /><p class="chu-thich">🧮 Two kernel patterns × five ways to run them — only "x86 before VT-x" gets a wrong answer</p></div>
<table>
<thead><tr><th>Execution method</th><th>A: final IF</th><th>B: IF pushed</th><th>traps</th><th>monitor calls</th><th>verdict</th></tr></thead>
<tbody>
<tr><td>bare machine (the reference)</td><td>IF=1</td><td>IF=0</td><td>0</td><td>0</td><td>correct</td></tr>
<tr><td>classic trap-and-emulate (ideal CPU)</td><td>IF=1</td><td>IF=0</td><td>4</td><td>0</td><td>correct</td></tr>
<tr><td>x86 before VT-x / AMD-V</td><td>IF=0</td><td>IF=1</td><td>1</td><td>0</td><td>WRONG</td></tr>
<tr><td>binary translation (VMware)</td><td>IF=1</td><td>IF=0</td><td>0</td><td>4</td><td>correct</td></tr>
<tr><td>hardware support (VT-x / AMD-V)</td><td>IF=1</td><td>IF=0</td><td>0</td><td>0</td><td>correct</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const NHAY_CAM = new Set(['CLI', 'STI', 'PUSHF', 'POPF']);       // đọc/ghi trạng thái đặc quyền
const DAC_QUYEN = new Set(['CLI', 'STI']);                       // x86 cũ: chỉ hai lệnh này bẫy khi không ở vòng 0
const CT = {
  A: { ifDau: 1, lenh: ['PUSHF', 'CLI', 'ADD', 'POPF'] },
  B: { ifDau: 0, lenh: ['PUSHF'] },
};
function chay(cach, ct) {
  const { ifDau, lenh } = CT[ct];
  let ifAo = ifDau, ifThat = 1, stack = null, bay = 0, goiGS = 0;
  const hang = [];
  for (const l of lenh) {
    let cachChay = 'direct', ghiChu = '';
    const nhay = NHAY_CAM.has(l);
    if (!nhay) { cachChay = 'direct'; }
    else if (cach === 'may-that' || cach === 'vt-x') cachChay = 'native';
    else if (cach === 'dich-nhi-phan') { cachChay = 'rewrite'; goiGS++; }
    else if (cach === 'ly-tuong') { cachChay = 'trap'; bay++; }
    else if (cach === 'x86-cu') cachChay = DAC_QUYEN.has(l) ? 'trap' : 'silent';
    if (cach === 'x86-cu' &amp;&amp; cachChay === 'trap') bay++;
    const emulate = cachChay === 'trap' || cachChay === 'rewrite';
    // tác dụng lên trạng thái
    let truocIf = ifAo;
    if (l === 'CLI') ifAo = 0;
    else if (l === 'STI') ifAo = 1;
    else if (l === 'PUSHF') stack = (cachChay === 'silent') ? ifThat : ifAo;     // x86 cũ: lộ IF THẬT
    else if (l === 'POPF') { if (cachChay !== 'silent') ifAo = stack; }          // x86 cũ: bị bỏ qua
    hang.push({ l, cachChay, ifAo, stack: l === 'PUSHF' ? stack : null, emulate, truocIf });
  }
  return { hang, ifCuoi: ifAo, stack, bay, goiGS };
}
const TEN_CACH = ['may-that', 'ly-tuong', 'x86-cu', 'dich-nhi-phan', 'vt-x'];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c37483364fdc9ccce5296572c6b9ea9e60d50fcd.svg" alt="Program A on old x86 in detail: PUSHF reads the real flag, CLI traps, POPF is silently ignored — the guest ends with IF = 0 instead of 1" loading="lazy" /><p class="chu-thich">🧮 Program A on old x86 in detail: PUSHF reads the real flag, CLI traps, POPF is silently ignored — the guest ends with IF = 0 instead of 1</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const NHAY_CAM = new Set(['CLI', 'STI', 'PUSHF', 'POPF']);       // đọc/ghi trạng thái đặc quyền
const DAC_QUYEN = new Set(['CLI', 'STI']);                       // x86 cũ: chỉ hai lệnh này bẫy khi không ở vòng 0
const CT = {
  A: { ifDau: 1, lenh: ['PUSHF', 'CLI', 'ADD', 'POPF'] },
  B: { ifDau: 0, lenh: ['PUSHF'] },
};
function chay(cach, ct) {
  const { ifDau, lenh } = CT[ct];
  let ifAo = ifDau, ifThat = 1, stack = null, bay = 0, goiGS = 0;
  const hang = [];
  for (const l of lenh) {
    let cachChay = 'direct', ghiChu = '';
    const nhay = NHAY_CAM.has(l);
    if (!nhay) { cachChay = 'direct'; }
    else if (cach === 'may-that' || cach === 'vt-x') cachChay = 'native';
    else if (cach === 'dich-nhi-phan') { cachChay = 'rewrite'; goiGS++; }
    else if (cach === 'ly-tuong') { cachChay = 'trap'; bay++; }
    else if (cach === 'x86-cu') cachChay = DAC_QUYEN.has(l) ? 'trap' : 'silent';
    if (cach === 'x86-cu' &amp;&amp; cachChay === 'trap') bay++;
    const emulate = cachChay === 'trap' || cachChay === 'rewrite';
    // tác dụng lên trạng thái
    let truocIf = ifAo;
    if (l === 'CLI') ifAo = 0;
    else if (l === 'STI') ifAo = 1;
    else if (l === 'PUSHF') stack = (cachChay === 'silent') ? ifThat : ifAo;     // x86 cũ: lộ IF THẬT
    else if (l === 'POPF') { if (cachChay !== 'silent') ifAo = stack; }          // x86 cũ: bị bỏ qua
    hang.push({ l, cachChay, ifAo, stack: l === 'PUSHF' ? stack : null, emulate, truocIf });
  }
  return { hang, ifCuoi: ifAo, stack, bay, goiGS };
}
const TEN_CACH = ['may-that', 'ly-tuong', 'x86-cu', 'dich-nhi-phan', 'vt-x'];</code></pre></details>
<p>Reading the first table: the <em>classic</em> row is the textbook ideal (every sensitive instruction traps, 4 traps in all, always correct); the <em>x86 before hardware support</em> row is reality, with 1 trap and 2 wrong answers; <em>binary translation</em> reaches the right answers by a different road (0 hardware traps, every sensitive instruction rewritten into a call — slide 14); <em>hardware support</em> fixes the CPU itself (0 traps, the guest kernel works on its own flags). Hence VMware's 1999 trick, and hence Intel's and AMD's 2005–2006 fix.</p>
<p class="pitfall">⚠️ The ring-1 picture is a <em>32-bit</em> x86 trick (segment limits protected the hypervisor from a ring-1 guest). The 64-bit extension removed segment limits, so 64-bit guests could not use it and VMware used the new hardware support for them (Bugnion et al., ACM TOCS 2012). When a question gives you the four rings, the answer "guest OS in ring 1, hypervisor in ring 0, applications in ring 3" is the book's.</p>`,
        `<p class="y-chinh">🎯 Hình 7-4: x86 có bốn vòng đặc quyền (0 trong cùng … 3 là người dùng). Với <strong>dịch nhị phân (binary translation)</strong>, hypervisor chạy ở vòng 0, nhân guest bị đẩy ra vòng 1, chương trình người dùng của guest ở vòng 3, và hypervisor <strong>viết lại mã của guest trước khi nó chạy</strong>, thay các lệnh sẽ hỏng bằng mã giả lập chúng. (Slide ghi "binary translates"; từ đúng là <em>translator</em>.)</p>
<p>Vì sao "không ảo hoá được"? Định lý của Popek và Goldberg (slide 2) đòi mọi lệnh nhạy cảm đều bẫy ở chế độ người dùng. Intel x86 giai đoạn 1985–2005 phá luật đó: nó có những lệnh đọc hoặc đổi trạng thái đặc quyền mà <em>không</em> bẫy khi chạy ngoài vòng 0. Một nghiên cứu của Robin và Irvine (USENIX Security 2000) đếm được <strong>17</strong> lệnh như vậy, trong đó có <code>PUSHF</code> và <code>POPF</code> (đẩy / lấy thanh ghi cờ, mà bit IF là cờ ngắt), <code>SGDT</code> và <code>SIDT</code> (đọc xem các bảng mô tả của nhân thật sự nằm đâu) và các lệnh thanh ghi đoạn. Lấy mẫu mà nhân nào cũng dùng để canh một vùng tới hạn — <code>PUSHF; CLI; …; POPF</code> (lưu cờ, tắt ngắt, làm việc, khôi phục cờ). Chạy nó trong nhân guest bị đẩy ra vòng 1: <code>CLI</code> bẫy (tốt), nhưng <code>POPF</code> lặng lẽ <em>bỏ qua</em> bit cờ ngắt vì CPU không ở vòng 0 — còn <code>PUSHF</code> đẩy cờ <em>thật</em>, không phải cờ của guest. Không bẫy, hypervisor không có cơ hội sửa; guest cứ thế chạy sai. Bộ mô phỏng phát lại đúng chuyện này trên một CPU đồ chơi chỉ có cờ ngắt:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/31793ad2b72911dfb17bf531646bae8d6a340c25.svg" alt="Hai mẫu mã nhân × năm cách chạy — chỉ &quot;x86 trước VT-x&quot; cho kết quả sai" loading="lazy" /><p class="chu-thich">🧮 Hai mẫu mã nhân × năm cách chạy — chỉ "x86 trước VT-x" cho kết quả sai</p></div>
<table>
<thead><tr><th>Cách thực thi</th><th>A: IF cuối</th><th>B: IF đã đẩy</th><th>số bẫy</th><th>lời gọi giám sát</th><th>kết luận</th></tr></thead>
<tbody>
<tr><td>máy thật (mốc đúng)</td><td>IF=1</td><td>IF=0</td><td>0</td><td>0</td><td>đúng</td></tr>
<tr><td>trap-and-emulate cổ điển (CPU lý tưởng)</td><td>IF=1</td><td>IF=0</td><td>4</td><td>0</td><td>đúng</td></tr>
<tr><td>x86 trước VT-x / AMD-V</td><td>IF=0</td><td>IF=1</td><td>1</td><td>0</td><td>SAI</td></tr>
<tr><td>dịch nhị phân (VMware)</td><td>IF=1</td><td>IF=0</td><td>0</td><td>4</td><td>đúng</td></tr>
<tr><td>có hỗ trợ phần cứng (VT-x / AMD-V)</td><td>IF=1</td><td>IF=0</td><td>0</td><td>0</td><td>đúng</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const NHAY_CAM = new Set(['CLI', 'STI', 'PUSHF', 'POPF']);       // đọc/ghi trạng thái đặc quyền
const DAC_QUYEN = new Set(['CLI', 'STI']);                       // x86 cũ: chỉ hai lệnh này bẫy khi không ở vòng 0
const CT = {
  A: { ifDau: 1, lenh: ['PUSHF', 'CLI', 'ADD', 'POPF'] },
  B: { ifDau: 0, lenh: ['PUSHF'] },
};
function chay(cach, ct) {
  const { ifDau, lenh } = CT[ct];
  let ifAo = ifDau, ifThat = 1, stack = null, bay = 0, goiGS = 0;
  const hang = [];
  for (const l of lenh) {
    let cachChay = 'direct', ghiChu = '';
    const nhay = NHAY_CAM.has(l);
    if (!nhay) { cachChay = 'direct'; }
    else if (cach === 'may-that' || cach === 'vt-x') cachChay = 'native';
    else if (cach === 'dich-nhi-phan') { cachChay = 'rewrite'; goiGS++; }
    else if (cach === 'ly-tuong') { cachChay = 'trap'; bay++; }
    else if (cach === 'x86-cu') cachChay = DAC_QUYEN.has(l) ? 'trap' : 'silent';
    if (cach === 'x86-cu' &amp;&amp; cachChay === 'trap') bay++;
    const emulate = cachChay === 'trap' || cachChay === 'rewrite';
    // tác dụng lên trạng thái
    let truocIf = ifAo;
    if (l === 'CLI') ifAo = 0;
    else if (l === 'STI') ifAo = 1;
    else if (l === 'PUSHF') stack = (cachChay === 'silent') ? ifThat : ifAo;     // x86 cũ: lộ IF THẬT
    else if (l === 'POPF') { if (cachChay !== 'silent') ifAo = stack; }          // x86 cũ: bị bỏ qua
    hang.push({ l, cachChay, ifAo, stack: l === 'PUSHF' ? stack : null, emulate, truocIf });
  }
  return { hang, ifCuoi: ifAo, stack, bay, goiGS };
}
const TEN_CACH = ['may-that', 'ly-tuong', 'x86-cu', 'dich-nhi-phan', 'vt-x'];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c30f7224c43fe2e0bb507263407d539b3c69f2ac.svg" alt="Chương trình A trên x86 cũ chi tiết: PUSHF đọc cờ thật, CLI bẫy, POPF bị bỏ qua lặng lẽ — guest kết thúc với IF = 0 thay vì 1" loading="lazy" /><p class="chu-thich">🧮 Chương trình A trên x86 cũ chi tiết: PUSHF đọc cờ thật, CLI bẫy, POPF bị bỏ qua lặng lẽ — guest kết thúc với IF = 0 thay vì 1</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const NHAY_CAM = new Set(['CLI', 'STI', 'PUSHF', 'POPF']);       // đọc/ghi trạng thái đặc quyền
const DAC_QUYEN = new Set(['CLI', 'STI']);                       // x86 cũ: chỉ hai lệnh này bẫy khi không ở vòng 0
const CT = {
  A: { ifDau: 1, lenh: ['PUSHF', 'CLI', 'ADD', 'POPF'] },
  B: { ifDau: 0, lenh: ['PUSHF'] },
};
function chay(cach, ct) {
  const { ifDau, lenh } = CT[ct];
  let ifAo = ifDau, ifThat = 1, stack = null, bay = 0, goiGS = 0;
  const hang = [];
  for (const l of lenh) {
    let cachChay = 'direct', ghiChu = '';
    const nhay = NHAY_CAM.has(l);
    if (!nhay) { cachChay = 'direct'; }
    else if (cach === 'may-that' || cach === 'vt-x') cachChay = 'native';
    else if (cach === 'dich-nhi-phan') { cachChay = 'rewrite'; goiGS++; }
    else if (cach === 'ly-tuong') { cachChay = 'trap'; bay++; }
    else if (cach === 'x86-cu') cachChay = DAC_QUYEN.has(l) ? 'trap' : 'silent';
    if (cach === 'x86-cu' &amp;&amp; cachChay === 'trap') bay++;
    const emulate = cachChay === 'trap' || cachChay === 'rewrite';
    // tác dụng lên trạng thái
    let truocIf = ifAo;
    if (l === 'CLI') ifAo = 0;
    else if (l === 'STI') ifAo = 1;
    else if (l === 'PUSHF') stack = (cachChay === 'silent') ? ifThat : ifAo;     // x86 cũ: lộ IF THẬT
    else if (l === 'POPF') { if (cachChay !== 'silent') ifAo = stack; }          // x86 cũ: bị bỏ qua
    hang.push({ l, cachChay, ifAo, stack: l === 'PUSHF' ? stack : null, emulate, truocIf });
  }
  return { hang, ifCuoi: ifAo, stack, bay, goiGS };
}
const TEN_CACH = ['may-that', 'ly-tuong', 'x86-cu', 'dich-nhi-phan', 'vt-x'];</code></pre></details>
<p>Đọc bảng đầu: hàng <em>cổ điển</em> là lý tưởng trong sách giáo khoa (mọi lệnh nhạy cảm đều bẫy, tổng 4 cú bẫy, luôn đúng); hàng <em>x86 trước khi có hỗ trợ phần cứng</em> là thực tế, 1 cú bẫy và 2 đáp án sai; <em>dịch nhị phân</em> đến đáp án đúng bằng con đường khác (0 cú bẫy phần cứng, mọi lệnh nhạy cảm được viết lại thành lời gọi — slide 14); <em>hỗ trợ phần cứng</em> sửa chính CPU (0 cú bẫy, nhân guest làm việc trên cờ riêng của nó). Từ đó có mẹo của VMware năm 1999, và có bản sửa của Intel và AMD năm 2005–2006.</p>
<p class="pitfall">⚠️ Hình vòng 1 là mẹo của x86 <em>32 bit</em> (giới hạn đoạn bảo vệ hypervisor khỏi guest ở vòng 1). Bản mở rộng 64 bit bỏ giới hạn đoạn, nên guest 64 bit không dùng được mẹo đó và VMware dùng hỗ trợ phần cứng mới cho chúng (Bugnion và cs., ACM TOCS 2012). Khi đề cho bốn vòng, đáp án "HĐH guest ở vòng 1, hypervisor ở vòng 0, ứng dụng ở vòng 3" là của sách.</p>`],
      [7, 'Are Hypervisors Microkernels Done Right? (1)',
        `<p class="y-chinh">🎯 Figure 7-5: <strong>true virtualization</strong> runs an <em>unmodified</em> guest (Windows) — its sensitive instructions trap to a type-1 hypervisor; <strong>paravirtualization</strong> runs a <em>modified</em> guest (Linux) that never executes a sensitive instruction but calls the hypervisor on purpose with a <strong>hypercall</strong> — like a system call, except the callee is the hypervisor — and the hypervisor then looks very much like a <strong>microkernel</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/3b57a382a1b3f3456e234e6e5ccb772c0a0584cf.svg" alt="A paravirtual disk write: the guest cooperates — descriptors in a shared ring, one notification, one virtual interrupt" loading="lazy" /><p class="chu-thich">🧩 A paravirtual disk write: the guest cooperates — descriptors in a shared ring, one notification, one virtual interrupt</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slides 7-8: a paravirtualized guest asks the hypervisor on purpose; virtio batches requests in a shared ring
participant "Guest app" as App
participant "Guest kernel\\n(modified: knows it is virtual)" as G
participant "Shared memory\\n(virtqueue ring)" as R
participant "Hypervisor /\\nhost device back end" as H
participant "Real disk" as D
App -&gt; G : write(fd, buf, n)  [ordinary system call]
G -&gt; R : put a descriptor in the ring:\\n"write these 4 KiB to sector 777"
G -&gt; R : put 2 more descriptors (batching)
G -&gt; H : ONE notification (a hypercall / a write to a doorbell register)
note over G, H : with a fully emulated old-style disk, every access to a\\ndevice register would be a separate trap
H -&gt; R : read the 3 descriptors, no trap needed
H -&gt; D : perform the 3 writes on the real device
H -&gt; R : mark the descriptors used
H -&gt; G : ONE virtual interrupt: "done"
G -&gt; App : write returns n
@enduml</code></pre></details>
<p>The chapter's title question compares the two kinds of "small kernel under the others". A microkernel (Chapter 1) keeps only the minimum in kernel mode — scheduling, memory protection, message passing — and runs file systems, drivers and servers as ordinary processes. A hypervisor does the same job for whole operating systems: it multiplexes CPUs and memory and isolates VMs, while the guests (and, in some designs, a privileged control domain) hold the rest. Tanenbaum's argument is that hypervisors are what microkernels were meant to be, only with operating systems as the "servers". In a paravirtualized design the resemblance is closest: the guest is edited so that every dangerous action becomes a call into the small hypervisor — Xen (Barham et al., <em>Xen and the Art of Virtualization</em>, SOSP 2003) did this to Linux and measured only a few percent loss against bare hardware.</p>
<p>The price of paravirtualization is that <strong>you must change the guest</strong>: fidelity is traded for efficiency, and a closed-source OS (Windows) cannot be edited by outsiders. Today the line has blurred into a hybrid: an <em>unmodified</em> guest kernel running on hardware support (VT-x / AMD-V / ARM EL2) plus <strong>paravirtual drivers</strong> for the slow parts — disks, network, clock, memory ballooning. The standard for those is <strong>virtio</strong>: the guest driver and the host back end share a memory ring (a <em>virtqueue</em>); the guest queues several requests and rings one "doorbell" instead of trapping on every device register (the diagram). The OASIS specification is at version 1.0 (March 2016) and 1.2 (July 2022). You will list the virtio devices of your own machine at slide 16. A hypercall is the same instruction at every level: <code>HVC</code> on ARM64, <code>VMCALL</code> on Intel, <code>VMMCALL</code> on AMD.</p>
<p class="pitfall">⚠️ The FE asks it as: "Paravirtualization modifies the source code of the guest OS instead of performing sensitive instructions — the paravirtualized guest executes …" = <strong>hyper calls</strong> (FE1#21, FE3#41, FE11#50, FE16#50). Wrong options: "system calls" (those go guest app → guest kernel), "virtual calls", "Hyper commands" — only the word <em>hypercall</em> is real. Do not confuse paravirtualization (modify the guest) with <em>full</em> virtualization (do not modify it).</p>`,
        `<p class="y-chinh">🎯 Hình 7-5: <strong>ảo hoá thật (true virtualization)</strong> chạy guest <em>không sửa</em> (Windows) — lệnh nhạy cảm của nó bẫy sang hypervisor loại 1; <strong>paravirtualization</strong> chạy guest <em>đã sửa</em> (Linux) không bao giờ chạy lệnh nhạy cảm mà chủ động gọi hypervisor bằng một <strong>hypercall</strong> — giống lời gọi hệ thống, chỉ khác bên được gọi là hypervisor — và khi đó hypervisor trông rất giống một <strong>vi nhân (microkernel)</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/3b57a382a1b3f3456e234e6e5ccb772c0a0584cf.svg" alt="Một lần ghi đĩa paravirtual: guest hợp tác — descriptor trong vòng bộ nhớ chung, một thông báo, một ngắt ảo" loading="lazy" /><p class="chu-thich">🧩 Một lần ghi đĩa paravirtual: guest hợp tác — descriptor trong vòng bộ nhớ chung, một thông báo, một ngắt ảo</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 7-8: guest paravirt chủ động nhờ hypervisor; virtio gom yêu cầu trong một vòng chung
participant "Guest app" as App
participant "Guest kernel\\n(modified: knows it is virtual)" as G
participant "Shared memory\\n(virtqueue ring)" as R
participant "Hypervisor /\\nhost device back end" as H
participant "Real disk" as D
App -&gt; G : write(fd, buf, n)  [ordinary system call]
G -&gt; R : put a descriptor in the ring:\\n"write these 4 KiB to sector 777"
G -&gt; R : put 2 more descriptors (batching)
G -&gt; H : ONE notification (a hypercall / a write to a doorbell register)
note over G, H : with a fully emulated old-style disk, every access to a\\ndevice register would be a separate trap
H -&gt; R : read the 3 descriptors, no trap needed
H -&gt; D : perform the 3 writes on the real device
H -&gt; R : mark the descriptors used
H -&gt; G : ONE virtual interrupt: "done"
G -&gt; App : write returns n
@enduml</code></pre></details>
<p>Câu hỏi ở tiêu đề chương so sánh hai loại "nhân nhỏ nằm dưới các nhân khác". Vi nhân (Chương 1) chỉ giữ tối thiểu ở chế độ nhân — lập lịch, bảo vệ bộ nhớ, truyền thông điệp — còn hệ thống tệp, driver, các máy chủ chạy như tiến trình thường. Hypervisor làm đúng việc đó cho cả hệ điều hành: nó chia CPU và bộ nhớ và cô lập các VM, còn guest (và, ở vài thiết kế, một control domain đặc quyền) giữ phần còn lại. Lập luận của Tanenbaum là hypervisor chính là thứ vi nhân định trở thành, chỉ khác là "máy chủ" là các hệ điều hành. Ở thiết kế paravirtual, sự giống nhau rõ nhất: guest được sửa để mọi hành động nguy hiểm thành một lời gọi vào hypervisor nhỏ — Xen (Barham và cs., <em>Xen and the Art of Virtualization</em>, SOSP 2003) làm thế với Linux và đo được chỉ thua phần cứng trần vài phần trăm.</p>
<p>Cái giá của paravirtualization là <strong>phải sửa guest</strong>: đổi tính trung thực lấy hiệu quả, và một HĐH mã đóng (Windows) thì người ngoài không sửa được. Ngày nay ranh giới đã mờ thành bản lai: nhân guest <em>không sửa</em> chạy trên hỗ trợ phần cứng (VT-x / AMD-V / ARM EL2) cộng <strong>driver paravirtual</strong> cho phần chậm — đĩa, mạng, đồng hồ, balloon bộ nhớ. Chuẩn cho chúng là <strong>virtio</strong>: driver của guest và back end của host dùng chung một vòng bộ nhớ (<em>virtqueue</em>); guest xếp vài yêu cầu rồi bấm một "chuông cửa" thay vì bẫy ở từng thanh ghi thiết bị (sơ đồ). Đặc tả OASIS ở phiên bản 1.0 (03/2016) và 1.2 (07/2022). Bạn sẽ liệt kê thiết bị virtio của máy mình ở slide 16. Hypercall là cùng một lệnh ở mọi nền: <code>HVC</code> trên ARM64, <code>VMCALL</code> trên Intel, <code>VMMCALL</code> trên AMD.</p>
<p class="pitfall">⚠️ FE hỏi thế này: "Paravirtualization sửa mã nguồn HĐH guest thay vì chạy lệnh nhạy cảm — guest paravirtualized chạy …" = <strong>hyper calls</strong> (FE1#21, FE3#41, FE11#50, FE16#50). Các phương án sai: "system calls" (đó là app guest → nhân guest), "virtual calls", "Hyper commands" — chỉ từ <em>hypercall</em> là có thật. Đừng lẫn paravirtualization (sửa guest) với ảo hoá <em>đầy đủ</em> (không sửa guest).</p>`],
      [8, 'Are Hypervisors Microkernels Done Right?',
        `<p class="y-chinh">🎯 Figure 7-6: <strong>VMI Linux</strong> — one Linux kernel binary, written against a thin <em>Virtual Machine Interface</em> layer, that runs (a) on the bare hardware (the interface library maps to real instructions), (b) on VMware (the library makes hypercalls to VMware) and (c) on Xen (the library makes hypercalls to Xen). The goal: <strong>one paravirtualized guest for every hypervisor</strong>. (The slide title lacks its "(2)".)</p>
<p>The problem VMI attacked is real: if every hypervisor needs its own modified Linux, distributors would have to ship and test one kernel per hypervisor. VMI put all the hypervisor-specific code behind a replaceable library so the guest kernel itself stays identical. It is an instructive <em>dead end</em>: VMware marked VMI deprecated in the Linux feature-removal schedule in September 2009, and the commit that removed it from the kernel is dated 23 August 2010 (planned for 2.6.37). VMware's stated reason is the lesson: hardware-assisted virtualization from Intel and AMD had become faster than VMI's paravirtual optimisation for most workloads, so the complexity no longer paid for itself.</p>
<p>➕ The <em>idea</em> survived under a vendor-neutral name: <strong>paravirt_ops</strong> (<code>pv_ops</code>), in Linux since 2.6.20 — the same release that merged KVM. The kernel contains function-pointer tables for the sensitive operations; on bare hardware they point to the normal instructions, and at boot a guest that detects a hypervisor (CPUID bit, slide 4) patches them to the hypervisor-specific versions. That is why <strong>one Linux kernel image</strong> boots unchanged on bare metal, KVM, Xen and Hyper-V, and why your cloud VM's <code>uname -r</code> is just a normal distribution kernel.</p>
<table>
<thead><tr><th>Layer</th><th>2015 slide</th><th>Today</th></tr></thead>
<tbody>
<tr><td>Guest kernel interface</td><td>VMI (VMware-specific)</td><td>paravirt_ops, vendor-neutral</td></tr>
<tr><td>CPU virtualization</td><td>binary translation or paravirtualization</td><td>hardware: VT-x, AMD-V, ARM EL2</td></tr>
<tr><td>Memory</td><td>shadow page tables</td><td>nested page tables (slide 9)</td></tr>
<tr><td>Disk, network</td><td>emulated old cards or paravirtual drivers</td><td>virtio (slide 16)</td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ Do not present VMI as "how VMware works today": it was removed from Linux in 2010 and VMware's current products run guests on hardware assist. In a presentation, name it as the 2005–2009 attempt at a <em>common paravirtual interface</em>, and say why it lost.</p>`,
        `<p class="y-chinh">🎯 Hình 7-6: <strong>VMI Linux</strong> — một nhân Linux duy nhất, viết dựa trên một lớp mỏng <em>Virtual Machine Interface</em>, chạy được (a) trên phần cứng trần (thư viện giao diện ánh xạ ra lệnh thật), (b) trên VMware (thư viện thực hiện hypercall tới VMware) và (c) trên Xen (thư viện thực hiện hypercall tới Xen). Mục tiêu: <strong>một guest paravirtualized cho mọi hypervisor</strong>. (Tiêu đề slide thiếu chữ "(2)".)</p>
<p>Vấn đề VMI nhắm tới là có thật: nếu mỗi hypervisor cần một bản Linux sửa riêng, các nhà phân phối phải phát hành và thử một nhân cho mỗi hypervisor. VMI đặt mọi mã riêng của hypervisor sau một thư viện thay được để chính nhân guest giữ nguyên. Đây là một <em>ngõ cụt</em> đáng học: VMware đánh dấu VMI lỗi thời trong lịch trình gỡ tính năng của Linux vào tháng 9/2009, và commit gỡ nó khỏi nhân đề ngày 23/08/2010 (dự kiến ở 2.6.37). Lý do VMware nêu chính là bài học: ảo hoá có hỗ trợ phần cứng của Intel và AMD đã nhanh hơn tối ưu paravirtual của VMI ở phần lớn khối lượng việc, nên độ phức tạp không còn đáng.</p>
<p>➕ <em>Ý tưởng</em> sống tiếp dưới tên trung lập: <strong>paravirt_ops</strong> (<code>pv_ops</code>), có trong Linux từ 2.6.20 — cùng bản với lúc KVM được nhập. Nhân chứa các bảng con trỏ hàm cho các thao tác nhạy cảm; trên phần cứng trần chúng trỏ tới lệnh thường, và lúc khởi động một guest phát hiện có hypervisor (bit CPUID, slide 4) sẽ vá chúng sang bản riêng của hypervisor. Vì thế <strong>một ảnh nhân Linux</strong> khởi động nguyên xi trên máy thật, KVM, Xen và Hyper-V, và <code>uname -r</code> của máy ảo đám mây của bạn chỉ là nhân phân phối bình thường.</p>
<table>
<thead><tr><th>Tầng</th><th>Slide 2015</th><th>Ngày nay</th></tr></thead>
<tbody>
<tr><td>Giao diện nhân guest</td><td>VMI (riêng của VMware)</td><td>paravirt_ops, trung lập nhà cung cấp</td></tr>
<tr><td>Ảo hoá CPU</td><td>dịch nhị phân hoặc paravirtualization</td><td>phần cứng: VT-x, AMD-V, ARM EL2</td></tr>
<tr><td>Bộ nhớ</td><td>bảng trang bóng (shadow)</td><td>bảng trang lồng (slide 9)</td></tr>
<tr><td>Đĩa, mạng</td><td>card cũ giả lập hoặc driver paravirtual</td><td>virtio (slide 16)</td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ Đừng trình bày VMI là "cách VMware chạy hôm nay": nó đã bị gỡ khỏi Linux năm 2010 và sản phẩm hiện nay của VMware chạy guest trên hỗ trợ phần cứng. Khi thuyết trình, gọi nó là nỗ lực 2005–2009 nhằm có một <em>giao diện paravirtual chung</em>, và nói vì sao nó thua.</p>`],
      [9, 'Hardware Support For Nested Page Tables',
        `<p class="y-chinh">🎯 Figure 7-7: with <strong>nested</strong> (Intel: <em>extended</em>, EPT; AMD: NPT / RVI) page tables the hardware walks <em>two</em> sets of tables — the guest's (virtual address → guest-physical) and the hypervisor's (guest-physical → real machine address) — and the second walk is needed for <em>every</em> guest-physical address touched, including each level of the guest's own page tables.</p>
<p>Chapter 3 gave one translation: virtual address → physical address, helped by the TLB. A VM adds a second level of "physical": what the guest believes is physical RAM is just a block the hypervisor handed out. So memory virtualization needs <strong>three</strong> kinds of address — guest virtual, guest physical, host physical. Before hardware help, the hypervisor kept <strong>shadow page tables</strong> mapping guest virtual straight to host physical, and had to intercept every write the guest made to its own page tables (a trap each time) to keep the shadow copy in step. Nested paging removes those traps: the guest edits its tables freely, and the MMU combines the two sets itself. The cost moves into a TLB miss, because the guest's page-table pointers are themselves guest-physical addresses that must be translated before they can be read:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/722a3aa28aa5e47f6e399616b5b2cc85a73e9157.svg" alt="A TLB miss in a VM with 4 + 4 levels: 20 nested-table reads + 4 guest-table reads = 24, then the data" loading="lazy" /><p class="chu-thich">🧮 A TLB miss in a VM with 4 + 4 levels: 20 nested-table reads + 4 guest-table reads = 24, then the data</p></div>
<p>4·4 + 4 + 4 = <strong>24</strong> page-table references (a native 4-level walk needs 4), plus 1 data access.</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">function duyet(n, m) {
  const buoc = [];                                    // { k: tầng guest (1..n+1), j: hàng (1..m+1), loai: 'long' | 'guest' | 'du-lieu' }
  for (let k = 1; k &lt;= n; k++) {
    for (let j = 1; j &lt;= m; j++) buoc.push({ k, j, loai: 'long' });     // đổi địa chỉ bảng tầng k của guest qua host
    buoc.push({ k, j: m + 1, loai: 'guest' });                           // đọc mục bảng tầng k của guest
  }
  for (let j = 1; j &lt;= m; j++) buoc.push({ k: n + 1, j, loai: 'long' }); // đổi địa chỉ trang dữ liệu qua host
  const thamChieu = buoc.length;                                          // = n·m + n + m
  buoc.push({ k: n + 1, j: m + 1, loai: 'du-lieu' });                     // truy cập dữ liệu thật
  return { buoc, thamChieu };
}
const goc = (n) =&gt; n;                                  // duyệt thường (không ảo hoá): n tham chiếu</code></pre></details>
<p>Count it as the simulator does: for each of the guest's 4 levels, translate the table's guest-physical address through the host's 4 levels (4 reads) and read the guest entry (1 read) = 4 × (4 + 1) = 20; then translate the final data page through the host's 4 levels (4 more) = <strong>24 page-entry reads</strong>, versus 4 on bare metal — the general formula is <em>n·m + n + m</em> (Bhargava et al., ASPLOS 2008: "six times" the native walk). Only then is the data read. That is why the TLB matters even more in a VM, and why hypervisors back guest memory with <strong>huge pages</strong>: shorter host walks.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8c689eb21bf7ed6ec162c919a97f46f2e4020c7d.svg" alt="How the worst-case cost changes with host page size and with Intel's 5-level paging" loading="lazy" /><p class="chu-thich">🧮 How the worst-case cost changes with host page size and with Intel's 5-level paging</p></div>
<table>
<thead><tr><th>Configuration</th><th>References</th></tr></thead>
<tbody>
<tr><td>native, 4-level</td><td>4</td></tr>
<tr><td>VM 4+4 levels</td><td>4·4 + 4 + 4 = 24</td></tr>
<tr><td>VM, host 2 MiB pages (3)</td><td>4·3 + 4 + 3 = 19</td></tr>
<tr><td>VM, host 1 GiB pages (2)</td><td>4·2 + 4 + 2 = 14</td></tr>
<tr><td>VM 5+5 levels</td><td>5·5 + 5 + 5 = 35</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">function duyet(n, m) {
  const buoc = [];                                    // { k: tầng guest (1..n+1), j: hàng (1..m+1), loai: 'long' | 'guest' | 'du-lieu' }
  for (let k = 1; k &lt;= n; k++) {
    for (let j = 1; j &lt;= m; j++) buoc.push({ k, j, loai: 'long' });     // đổi địa chỉ bảng tầng k của guest qua host
    buoc.push({ k, j: m + 1, loai: 'guest' });                           // đọc mục bảng tầng k của guest
  }
  for (let j = 1; j &lt;= m; j++) buoc.push({ k: n + 1, j, loai: 'long' }); // đổi địa chỉ trang dữ liệu qua host
  const thamChieu = buoc.length;                                          // = n·m + n + m
  buoc.push({ k: n + 1, j: m + 1, loai: 'du-lieu' });                     // truy cập dữ liệu thật
  return { buoc, thamChieu };
}
const goc = (n) =&gt; n;                                  // duyệt thường (không ảo hoá): n tham chiếu</code></pre></details>
<p>The figure shows the worst case; real programs hit the TLB (and the CPU's page-walk caches) most of the time, so measured overhead is a few percent for typical workloads and much larger only for programs that miss the TLB constantly — a database scanning random memory. Intel's newer 5-level paging adds a level to each side and raises the worst case to 35.</p>
<p class="pitfall">⚠️ The FE question "Evaluate the role of memory virtualization in optimizing resource allocation … how does it impact overall system performance?" has "<em>It enhances resource allocation efficiency, improving system performance</em>" as the bank's answer (FE1#19, FE10#49). The question is vague: memory virtualization lets many VMs share one RAM (efficient allocation), but it costs extra translation work (up to 24 reads per miss) — it does not <em>improve</em> the speed of a single program. Choose the bank's option in the exam, but know the trade-off for the oral presentation.</p>`,
        `<p class="y-chinh">🎯 Hình 7-7: với bảng trang <strong>lồng (nested)</strong> (Intel gọi <em>extended</em>, EPT; AMD gọi NPT / RVI) phần cứng duyệt <em>hai</em> bộ bảng — của guest (địa chỉ ảo → guest-physical) và của hypervisor (guest-physical → địa chỉ máy thật) — và lần duyệt thứ hai cần cho <em>mỗi</em> địa chỉ guest-physical được chạm tới, kể cả từng tầng trong bảng trang của chính guest.</p>
<p>Chương 3 cho một phép dịch: địa chỉ ảo → địa chỉ vật lý, có TLB giúp. Máy ảo thêm một tầng "vật lý" thứ hai: thứ guest tưởng là RAM vật lý chỉ là một khối hypervisor cấp cho. Nên ảo hoá bộ nhớ cần <strong>ba</strong> loại địa chỉ — guest virtual, guest physical, host physical. Trước khi có phần cứng giúp, hypervisor giữ <strong>bảng trang bóng (shadow page tables)</strong> ánh xạ thẳng guest virtual sang host physical, và phải chặn mọi lần guest ghi vào bảng trang của chính nó (mỗi lần một cú bẫy) để giữ bản bóng đồng bộ. Bảng trang lồng bỏ những cú bẫy đó: guest tự do sửa bảng của mình, còn MMU tự ghép hai bộ. Chi phí chuyển sang lần TLB hụt, vì các con trỏ bảng trang của guest bản thân là địa chỉ guest-physical phải được dịch trước khi đọc được:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/29a3a51b0abc0c84efa3fe798928d9dc21e5ee51.svg" alt="Một lần TLB hụt trong VM 4 + 4 tầng: 20 lần đọc bảng lồng + 4 lần đọc bảng của guest = 24, rồi mới tới dữ liệu" loading="lazy" /><p class="chu-thich">🧮 Một lần TLB hụt trong VM 4 + 4 tầng: 20 lần đọc bảng lồng + 4 lần đọc bảng của guest = 24, rồi mới tới dữ liệu</p></div>
<p>4·4 + 4 + 4 = <strong>24</strong> lần đọc mục bảng trang (duyệt thường 4 tầng chỉ cần 4), cộng 1 lần truy cập dữ liệu.</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">function duyet(n, m) {
  const buoc = [];                                    // { k: tầng guest (1..n+1), j: hàng (1..m+1), loai: 'long' | 'guest' | 'du-lieu' }
  for (let k = 1; k &lt;= n; k++) {
    for (let j = 1; j &lt;= m; j++) buoc.push({ k, j, loai: 'long' });     // đổi địa chỉ bảng tầng k của guest qua host
    buoc.push({ k, j: m + 1, loai: 'guest' });                           // đọc mục bảng tầng k của guest
  }
  for (let j = 1; j &lt;= m; j++) buoc.push({ k: n + 1, j, loai: 'long' }); // đổi địa chỉ trang dữ liệu qua host
  const thamChieu = buoc.length;                                          // = n·m + n + m
  buoc.push({ k: n + 1, j: m + 1, loai: 'du-lieu' });                     // truy cập dữ liệu thật
  return { buoc, thamChieu };
}
const goc = (n) =&gt; n;                                  // duyệt thường (không ảo hoá): n tham chiếu</code></pre></details>
<p>Đếm như bộ mô phỏng: với mỗi trong 4 tầng của guest, dịch địa chỉ guest-physical của bảng qua 4 tầng của host (4 lần đọc) rồi đọc mục của guest (1 lần) = 4 × (4 + 1) = 20; sau đó dịch trang dữ liệu cuối qua 4 tầng của host (thêm 4) = <strong>24 lần đọc mục bảng</strong>, so với 4 trên máy thật — công thức chung là <em>n·m + n + m</em> (Bhargava và cs., ASPLOS 2008: "gấp sáu lần" duyệt thường). Chỉ sau đó mới đọc dữ liệu. Vì thế TLB còn quan trọng hơn trong máy ảo, và vì thế hypervisor đỡ bộ nhớ của guest bằng <strong>trang lớn (huge pages)</strong>: duyệt phía host ngắn hơn.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/72250ca1c72117dc823713cc2588e3037e8336cd.svg" alt="Chi phí xấu nhất đổi thế nào theo cỡ trang của host và với phân trang 5 tầng của Intel" loading="lazy" /><p class="chu-thich">🧮 Chi phí xấu nhất đổi thế nào theo cỡ trang của host và với phân trang 5 tầng của Intel</p></div>
<table>
<thead><tr><th>Cấu hình</th><th>Số lần đọc</th></tr></thead>
<tbody>
<tr><td>máy thật, 4 tầng</td><td>4</td></tr>
<tr><td>VM 4+4 tầng</td><td>4·4 + 4 + 4 = 24</td></tr>
<tr><td>VM, host trang 2 MiB (3)</td><td>4·3 + 4 + 3 = 19</td></tr>
<tr><td>VM, host trang 1 GiB (2)</td><td>4·2 + 4 + 2 = 14</td></tr>
<tr><td>VM 5+5 tầng</td><td>5·5 + 5 + 5 = 35</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">function duyet(n, m) {
  const buoc = [];                                    // { k: tầng guest (1..n+1), j: hàng (1..m+1), loai: 'long' | 'guest' | 'du-lieu' }
  for (let k = 1; k &lt;= n; k++) {
    for (let j = 1; j &lt;= m; j++) buoc.push({ k, j, loai: 'long' });     // đổi địa chỉ bảng tầng k của guest qua host
    buoc.push({ k, j: m + 1, loai: 'guest' });                           // đọc mục bảng tầng k của guest
  }
  for (let j = 1; j &lt;= m; j++) buoc.push({ k: n + 1, j, loai: 'long' }); // đổi địa chỉ trang dữ liệu qua host
  const thamChieu = buoc.length;                                          // = n·m + n + m
  buoc.push({ k: n + 1, j: m + 1, loai: 'du-lieu' });                     // truy cập dữ liệu thật
  return { buoc, thamChieu };
}
const goc = (n) =&gt; n;                                  // duyệt thường (không ảo hoá): n tham chiếu</code></pre></details>
<p>Hình vẽ trường hợp xấu nhất; chương trình thật trúng TLB (và bộ đệm duyệt trang của CPU) phần lớn thời gian, nên chi phí đo được chỉ vài phần trăm với tải thông thường và chỉ lớn hơn nhiều với chương trình hụt TLB liên tục — cơ sở dữ liệu quét bộ nhớ ngẫu nhiên. Phân trang 5 tầng mới của Intel thêm một tầng cho mỗi bên và đẩy trường hợp xấu nhất lên 35.</p>
<p class="pitfall">⚠️ Câu FE "Đánh giá vai trò của ảo hoá bộ nhớ trong tối ưu cấp phát tài nguyên … ảnh hưởng thế nào tới hiệu năng chung?" có đáp án ngân hàng là "<em>It enhances resource allocation efficiency, improving system performance</em>" (FE1#19, FE10#49). Câu hỏi mơ hồ: ảo hoá bộ nhớ cho phép nhiều VM chia chung một RAM (cấp phát hiệu quả) nhưng tốn thêm việc dịch địa chỉ (tới 24 lần đọc mỗi lần hụt) — nó không làm một chương trình đơn lẻ chạy <em>nhanh hơn</em>. Trong kỳ thi cứ chọn phương án của ngân hàng, nhưng hãy biết sự đánh đổi cho phần thuyết trình.</p>`],
      [10, 'Clouds',
        `<p class="y-chinh">🎯 The U.S. <strong>National Institute of Standards and Technology (NIST)</strong> defines a "cloud" by five characteristics: <strong>on-demand self-service</strong>, <strong>broad network access</strong>, <strong>resource pooling</strong>, <strong>rapid elasticity</strong> and <strong>measured service</strong>. Virtualization is what makes the third and fourth possible.</p>
<p>Think of the water company. You open the tap yourself, no phone call (<em>on-demand self-service</em>); water arrives through a standard pipe that any house can connect to (<em>broad network access</em>); everyone draws from the same reservoir, and the company decides which litres go where (<em>resource pooling</em> — "multi-tenancy"); on a hot day you use ten times more and nobody has to build you a new tank (<em>rapid elasticity</em>); and there is a meter on the wall, so you pay for what you used (<em>measured service</em>). A cloud is the same deal for computers: you request a server through an API, it exists in seconds, and the bill counts seconds. Pooling and elasticity need exactly what this chapter described — a hypervisor that carves one big machine into isolated small ones, moves them around, and starts a new one in moments.</p>
<p>➕ The slide stops at the characteristics; the NIST definition (Special Publication 800-145, September 2011) goes on to <strong>three service models</strong> — what the customer rents — and <strong>four deployment models</strong>:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/7a5b8d4b0d718341ac2fe6d2cc1d295752b23aa3.svg" alt="Three service models: who manages which layer" loading="lazy" /><p class="chu-thich">🧩 Three service models: who manages which layer</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' NIST SP 800-145 service models: who manages which layer (slide 10 lists characteristics but not the models)
skinparam defaultFontSize 12
rectangle "&lt;b&gt;IaaS&lt;/b&gt;  e.g. a VPS, EC2\\nyou manage:  application · data · runtime · guest OS\\nprovider manages:  hypervisor · servers · storage · network" as IAAS #BFDBFE
rectangle "&lt;b&gt;PaaS&lt;/b&gt;  e.g. a managed app platform, Cloud Run\\nyou manage:  application · data\\nprovider manages:  runtime · OS · hypervisor · servers · storage · network" as PAAS #BBF7D0
rectangle "&lt;b&gt;SaaS&lt;/b&gt;  e.g. Gmail, GitHub\\nyou manage:  your settings and content only\\nprovider manages:  everything else" as SAAS #FDE68A
IAAS -[hidden]down-&gt; PAAS
PAAS -[hidden]down-&gt; SAAS
@enduml</code></pre></details>
<table>
<thead><tr><th>Model</th><th>You rent</th><th>Real example (backend view)</th></tr></thead>
<tbody>
<tr><td>IaaS — Infrastructure as a Service</td><td>virtual machines, disks, networks</td><td>a VPS or an AWS EC2 instance: you install Docker, patch the OS, run PostgreSQL</td></tr>
<tr><td>PaaS — Platform as a Service</td><td>a place to run your code</td><td>you push a container or source code to a managed platform; it handles OS, scaling and restarts</td></tr>
<tr><td>SaaS — Software as a Service</td><td>a finished application</td><td>GitHub, Gmail, a hosted database you only log into</td></tr>
<tr><td>Deployment: private · community · public · hybrid</td><td>who shares the infrastructure</td><td>an in-house cluster, a university cluster, AWS or Google Cloud, or a mix</td></tr>
</tbody>
</table>
<p>The project this course runs on is a small example of all this: its backend and frontend are Docker containers on a rented VPS (IaaS — a KVM virtual machine you administer), its image files sit in an object-storage service (a PaaS/SaaS-style service you only call), and its code is hosted on GitHub (SaaS). On the provider side, virtualization has been rebuilt for the cloud: since the C5 instances of November 2017, Amazon's <strong>Nitro</strong> system runs a lightweight hypervisor based on KVM and moves device handling to dedicated cards, so no management domain (Dom0) sits on the host any more — an idea you can read as "Type 1 done again, with less in the way" (AWS whitepaper, <em>The Nitro System journey</em>).</p>
<p class="pitfall">⚠️ FE question: "In a thin client setup, where is most of the software and data processing performed?" = <strong>on a central server or cloud infrastructure</strong> (FE15#43, FE14#45 — the second bank copy prints option b as "ud infrastructure", a broken word in the image, but it is still the answer). A thin client (a Chromebook, a browser, a remote desktop) only draws the screen and sends keystrokes. Also do not mix the models: "I rent a bare VM and install everything" is IaaS, not PaaS.</p>`,
        `<p class="y-chinh">🎯 <strong>Viện Tiêu chuẩn và Công nghệ Quốc gia Hoa Kỳ (NIST)</strong> định nghĩa "đám mây" bằng năm đặc tính: <strong>tự phục vụ theo yêu cầu (on-demand self-service)</strong>, <strong>truy cập mạng rộng (broad network access)</strong>, <strong>gom chung tài nguyên (resource pooling)</strong>, <strong>co giãn nhanh (rapid elasticity)</strong> và <strong>dịch vụ có đo đếm (measured service)</strong>. Ảo hoá là thứ làm cho đặc tính thứ ba và thứ tư khả thi.</p>
<p>Nghĩ tới công ty cấp nước. Bạn tự mở vòi, không cần gọi điện (<em>tự phục vụ theo yêu cầu</em>); nước tới qua đường ống chuẩn mà nhà nào cũng nối được (<em>truy cập mạng rộng</em>); mọi người lấy từ cùng một hồ chứa, và công ty quyết định lít nước nào đi đâu (<em>gom chung tài nguyên</em> — "đa người thuê"); ngày nóng bạn dùng gấp mười mà không ai phải xây thêm bồn cho bạn (<em>co giãn nhanh</em>); và có đồng hồ trên tường, nên bạn trả tiền theo lượng đã dùng (<em>dịch vụ có đo đếm</em>). Đám mây là cùng thoả thuận đó cho máy tính: bạn yêu cầu một máy chủ qua API, nó có sau vài giây, và hoá đơn đếm theo giây. Gom chung và co giãn cần đúng thứ chương này mô tả — hypervisor chia một máy lớn thành nhiều máy nhỏ cô lập, di chuyển chúng, và khởi động máy mới trong chốc lát.</p>
<p>➕ Slide dừng ở các đặc tính; định nghĩa của NIST (Special Publication 800-145, tháng 9/2011) còn có <strong>ba mô hình dịch vụ</strong> — khách hàng thuê gì — và <strong>bốn mô hình triển khai</strong>:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/7a5b8d4b0d718341ac2fe6d2cc1d295752b23aa3.svg" alt="Ba mô hình dịch vụ: ai quản lý tầng nào" loading="lazy" /><p class="chu-thich">🧩 Ba mô hình dịch vụ: ai quản lý tầng nào</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Mô hình dịch vụ của NIST SP 800-145: ai quản lý tầng nào (slide 10 liệt kê đặc tính nhưng không có các mô hình)
skinparam defaultFontSize 12
rectangle "&lt;b&gt;IaaS&lt;/b&gt;  e.g. a VPS, EC2\\nyou manage:  application · data · runtime · guest OS\\nprovider manages:  hypervisor · servers · storage · network" as IAAS #BFDBFE
rectangle "&lt;b&gt;PaaS&lt;/b&gt;  e.g. a managed app platform, Cloud Run\\nyou manage:  application · data\\nprovider manages:  runtime · OS · hypervisor · servers · storage · network" as PAAS #BBF7D0
rectangle "&lt;b&gt;SaaS&lt;/b&gt;  e.g. Gmail, GitHub\\nyou manage:  your settings and content only\\nprovider manages:  everything else" as SAAS #FDE68A
IAAS -[hidden]down-&gt; PAAS
PAAS -[hidden]down-&gt; SAAS
@enduml</code></pre></details>
<table>
<thead><tr><th>Mô hình</th><th>Bạn thuê</th><th>Ví dụ thật (góc nhìn backend)</th></tr></thead>
<tbody>
<tr><td>IaaS — Hạ tầng như một dịch vụ</td><td>máy ảo, đĩa, mạng</td><td>một VPS hay máy AWS EC2: bạn tự cài Docker, vá HĐH, chạy PostgreSQL</td></tr>
<tr><td>PaaS — Nền tảng như một dịch vụ</td><td>một chỗ để chạy mã</td><td>bạn đẩy container hay mã nguồn lên nền tảng quản lý sẵn; nó lo HĐH, co giãn và khởi động lại</td></tr>
<tr><td>SaaS — Phần mềm như một dịch vụ</td><td>một ứng dụng hoàn chỉnh</td><td>GitHub, Gmail, một cơ sở dữ liệu thuê sẵn chỉ việc đăng nhập</td></tr>
<tr><td>Triển khai: riêng · cộng đồng · công cộng · lai</td><td>ai dùng chung hạ tầng</td><td>cụm nội bộ, cụm của trường đại học, AWS hay Google Cloud, hoặc trộn</td></tr>
</tbody>
</table>
<p>Dự án mà khoá học này chạy trên đó là một ví dụ nhỏ của tất cả: backend và frontend là các container Docker trên một VPS thuê (IaaS — một máy ảo KVM bạn tự quản trị), ảnh nằm trong một dịch vụ lưu trữ đối tượng (dịch vụ kiểu PaaS/SaaS bạn chỉ việc gọi), và mã được lưu trên GitHub (SaaS). Về phía nhà cung cấp, ảo hoá đã được dựng lại cho đám mây: từ các máy C5 tháng 11/2017, hệ thống <strong>Nitro</strong> của Amazon chạy một hypervisor nhẹ dựa trên KVM và chuyển việc xử lý thiết bị sang card chuyên dụng, nên không còn miền quản lý (Dom0) nào nằm trên máy chủ — bạn có thể đọc đó là "loại 1 làm lại, ít thứ chắn đường hơn" (AWS whitepaper, <em>The Nitro System journey</em>).</p>
<p class="pitfall">⚠️ Câu FE: "Trong mô hình thin client, phần lớn xử lý phần mềm và dữ liệu diễn ra ở đâu?" = <strong>trên máy chủ trung tâm hoặc hạ tầng đám mây</strong> (FE15#43, FE14#45 — bản ngân hàng thứ hai in phương án b là "ud infrastructure", một chữ hỏng trong ảnh, nhưng vẫn là đáp án). Thin client (Chromebook, trình duyệt, màn hình từ xa) chỉ vẽ màn hình và gửi phím bấm. Cũng đừng lẫn các mô hình: "tôi thuê một máy ảo trần và tự cài mọi thứ" là IaaS, không phải PaaS.</p>`],
      [11, 'Challenges in Bringing Virtualization to the x86 (1)',
        `<p class="y-chinh">🎯 VMware's three core goals for a virtual machine on the x86 platform: <strong>Compatibility</strong> (run any x86 operating system and application, unmodified), <strong>Performance</strong> (close to the speed of the real machine) and <strong>Isolation</strong> (a VM can neither see nor harm another VM or the monitor).</p>
<p>Slides 11–20 are a case study of one real product, <strong>VMware</strong>, taken from the paper by Bugnion, Devine, Rosenblum, Sugerman and Wang (<em>Bringing Virtualization to the x86 Architecture with the Original VMware Workstation</em>, ACM Transactions on Computer Systems 30(4), 2012). The history behind it (section 7.1): IBM built virtual machines for its mainframes in the late 1960s and early 1970s (CP/CMS, then VM/370, 1972) — the machines Popek and Goldberg analysed in 1974; then the idea slept while cheap PCs took over; Stanford's Disco project (1997) revived it for multiprocessors, and in 1999 VMware shipped Workstation, the first widely used virtual machine for the PC.</p>
<p>The three goals are the chapter's S-F-E trio in industrial clothes: <strong>Compatibility ≈ Fidelity</strong> (the guest must not need to know), <strong>Performance ≈ Efficiency</strong> (most instructions run directly), <strong>Isolation ≈ Safety</strong> (the monitor keeps control). The difference is the emphasis: a product also has customers, so compatibility means "the Windows and Linux CDs customers already own must install and run", not just "the same results". When you present, use this mapping — it shows the audience that an academic theory and a real product answer the same question.</p>
<p class="meo">🧠 A quick memory aid for the pairs: <em>Compatibility = it looks the same, Performance = it feels the same, Isolation = it stays apart.</em></p>
<p class="pitfall">⚠️ The "x86 virtual machine" here is the <em>computer</em>-level machine (VMware's), not the <em>Java Virtual Machine</em> or the .NET runtime — those virtualize a software instruction set, not a PC. A good answer to "what is a virtual machine?" names the level: system virtual machine (hardware), process virtual machine (JVM, .NET), or container (OS view).</p>`,
        `<p class="y-chinh">🎯 Ba mục tiêu cốt lõi của VMware cho một máy ảo trên nền x86: <strong>Tương thích (Compatibility)</strong> (chạy mọi HĐH và ứng dụng x86, không sửa), <strong>Hiệu năng (Performance)</strong> (gần tốc độ của máy thật) và <strong>Cô lập (Isolation)</strong> (một VM không thấy cũng không hại được VM khác hay bộ giám sát).</p>
<p>Slide 11–20 là ca nghiên cứu một sản phẩm thật, <strong>VMware</strong>, lấy từ bài báo của Bugnion, Devine, Rosenblum, Sugerman và Wang (<em>Bringing Virtualization to the x86 Architecture with the Original VMware Workstation</em>, ACM Transactions on Computer Systems 30(4), 2012). Lịch sử đằng sau (mục 7.1): IBM làm máy ảo cho máy chủ lớn cuối thập niên 1960 đầu 1970 (CP/CMS, rồi VM/370, 1972) — chính các máy Popek và Goldberg phân tích năm 1974; rồi ý tưởng ngủ yên khi PC rẻ lên ngôi; dự án Disco của Stanford (1997) hồi sinh nó cho máy đa xử lý, và năm 1999 VMware phát hành Workstation, máy ảo cho PC được dùng rộng rãi đầu tiên.</p>
<p>Ba mục tiêu chính là bộ ba S-F-E của chương trong áo công nghiệp: <strong>Tương thích ≈ Trung thực</strong> (guest không cần biết), <strong>Hiệu năng ≈ Hiệu quả</strong> (phần lớn lệnh chạy thẳng), <strong>Cô lập ≈ An toàn</strong> (bộ giám sát giữ quyền). Khác biệt là điểm nhấn: sản phẩm còn có khách hàng, nên tương thích nghĩa là "đĩa Windows và Linux khách đang có phải cài và chạy được", không chỉ "cùng kết quả". Khi thuyết trình, dùng phép ghép này — nó cho khán giả thấy một lý thuyết hàn lâm và một sản phẩm thật trả lời cùng một câu hỏi.</p>
<p class="meo">🧠 Mẹo nhớ các cặp: <em>Tương thích = trông giống, Hiệu năng = cảm giác giống, Cô lập = ở riêng.</em></p>
<p class="pitfall">⚠️ "Máy ảo x86" ở đây là máy ở mức <em>máy tính</em> (của VMware), không phải <em>Java Virtual Machine</em> hay runtime .NET — những thứ đó ảo hoá một tập lệnh phần mềm, không phải một cái PC. Câu trả lời tốt cho "máy ảo là gì?" nêu rõ mức: máy ảo hệ thống (phần cứng), máy ảo tiến trình (JVM, .NET), hay container (góc nhìn HĐH).</p>`],
      [12, 'Challenges in Bringing Virtualization to the x86 (2)',
        `<p class="y-chinh">🎯 Four major challenges: (1) the x86 architecture was <strong>not virtualizable</strong>; (2) it was of <strong>daunting complexity</strong>; (3) x86 machines had <strong>diverse peripherals</strong>; (4) there was a need for a <strong>simple user experience</strong>.</p>
<table>
<thead><tr><th>Challenge</th><th>What made it hard</th><th>VMware's answer</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Not virtualizable</td><td>sensitive instructions that do not trap (PUSHF, POPF, SGDT …)</td><td>binary translation of guest kernel code</td><td>6, 13–14</td></tr>
<tr><td>Daunting complexity</td><td>three decades of modes (real, protected, virtual-8086), segments, rings, odd instructions</td><td>a monitor that decodes only what it must; reuse as much as possible of the host</td><td>13</td></tr>
<tr><td>Diverse peripherals</td><td>thousands of different disk, network and graphics cards and drivers</td><td>present ONE small fixed set of virtual devices, back them with the host's drivers</td><td>15–17</td></tr>
<tr><td>Simple user experience</td><td>a VMM is kernel-level, hard to install</td><td>install like an application: the hosted architecture</td><td>17–18</td></tr>
</tbody>
</table>
<p>Challenge 1 is Popek–Goldberg again (slide 6). Challenge 2 is a different kind of difficulty: x86 had grown by accretion since 1978 — 16-bit real mode for compatibility with DOS, 32-bit protected mode with four rings and segmentation, a virtual-8086 mode inside it — and a monitor that wants to run any operating system must get every corner right, including the ones nobody remembers why they exist. Challenge 3 is the PC's weakness and its gift: there is no single "PC hardware", but every OS ships drivers for the common old devices, so the VM exposes <em>those</em> (slide 16). Challenge 4 explains a design choice that looks odd today — VMware Workstation was a <em>hosted</em> (type 2) product precisely so users could install it with a normal installer on the Windows or Linux they already had, and so the host's drivers could serve the virtual devices.</p>
<p>➕ How much of this is still true? Challenge 1 is solved in hardware (since VT-x / AMD-V; slide 6). Challenge 3 is solved by <strong>virtio</strong> and SR-IOV (a physical network card that presents several "virtual functions", each given directly to one VM, with an <em>IOMMU</em> keeping the card's DMA inside that VM's memory). Challenge 4 is solved by the cloud, where nobody installs a hypervisor — they click "create server". Challenge 2 never went away, and is why a mature hypervisor is millions of lines of code or a large part of the Linux kernel.</p>
<p class="pitfall">⚠️ Do not read "x86 was not virtualizable" as "impossible": it means <em>not by trap-and-emulate alone</em>. VMware did virtualize it — in software, with binary translation — and that is the next two slides.</p>`,
        `<p class="y-chinh">🎯 Bốn thách thức lớn: (1) kiến trúc x86 <strong>không ảo hoá được</strong>; (2) nó <strong>phức tạp đáng sợ</strong>; (3) máy x86 có <strong>ngoại vi muôn hình</strong>; (4) cần một <strong>trải nghiệm người dùng đơn giản</strong>.</p>
<table>
<thead><tr><th>Thách thức</th><th>Cái khó</th><th>Cách VMware trả lời</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Không ảo hoá được</td><td>lệnh nhạy cảm không bẫy (PUSHF, POPF, SGDT …)</td><td>dịch nhị phân mã nhân của guest</td><td>6, 13–14</td></tr>
<tr><td>Phức tạp đáng sợ</td><td>ba thập kỷ các chế độ (real, protected, virtual-8086), đoạn, vòng, lệnh lạ</td><td>bộ giám sát chỉ giải mã cái cần thiết; tái dùng tối đa phần của HĐH chủ</td><td>13</td></tr>
<tr><td>Ngoại vi muôn hình</td><td>hàng nghìn loại card đĩa, mạng, đồ hoạ và driver</td><td>đưa ra MỘT bộ thiết bị ảo nhỏ cố định, đỡ lưng bằng driver của HĐH chủ</td><td>15–17</td></tr>
<tr><td>Trải nghiệm đơn giản</td><td>VMM ở mức nhân, khó cài</td><td>cài như một ứng dụng: kiến trúc hosted</td><td>17–18</td></tr>
</tbody>
</table>
<p>Thách thức 1 lại là Popek–Goldberg (slide 6). Thách thức 2 khó theo kiểu khác: x86 lớn lên bằng cách chắp vá từ 1978 — chế độ real 16 bit để tương thích DOS, chế độ protected 32 bit với bốn vòng và phân đoạn, chế độ virtual-8086 bên trong nó — và một bộ giám sát muốn chạy HĐH bất kỳ phải làm đúng từng ngóc ngách, kể cả những chỗ không ai nhớ vì sao tồn tại. Thách thức 3 vừa là điểm yếu vừa là món quà của PC: không có "phần cứng PC" duy nhất, nhưng mọi HĐH đều kèm driver cho các thiết bị cũ phổ biến, nên VM đưa ra <em>chính những thiết bị đó</em> (slide 16). Thách thức 4 giải thích một lựa chọn thiết kế hôm nay trông lạ — VMware Workstation là sản phẩm <em>hosted</em> (loại 2) chính để người dùng cài bằng trình cài đặt thường trên Windows hay Linux sẵn có, và để driver của HĐH chủ phục vụ các thiết bị ảo.</p>
<p>➕ Hôm nay còn đúng tới đâu? Thách thức 1 đã được giải bằng phần cứng (từ VT-x / AMD-V; slide 6). Thách thức 3 được giải bằng <strong>virtio</strong> và SR-IOV (một card mạng vật lý đưa ra nhiều "virtual function", mỗi cái giao thẳng cho một VM, với <em>IOMMU</em> giữ DMA của card nằm trong bộ nhớ của VM đó). Thách thức 4 được giải bằng đám mây, nơi không ai cài hypervisor — họ bấm "create server". Thách thức 2 chưa bao giờ biến mất, và đó là lý do một hypervisor trưởng thành là hàng triệu dòng mã hay một phần lớn nhân Linux.</p>
<p class="pitfall">⚠️ Đừng đọc "x86 không ảo hoá được" là "bất khả thi": nó có nghĩa là <em>không chỉ bằng trap-and-emulate</em>. VMware đã ảo hoá nó — bằng phần mềm, với dịch nhị phân — và đó là hai slide kế tiếp.</p>`],
      [13, 'Virtualizing the x86 Architecture (1)',
        `<p class="y-chinh">🎯 Figure 7-8: the high-level components of the VMware virtual machine monitor (without hardware support). A <strong>decision algorithm</strong> looks at the virtual CPU's state and sends the code either to <strong>direct execution</strong> or to <strong>binary translation</strong>; both rely on <strong>shared modules</strong> — the <em>shadow MMU</em> (shadow page tables, slide 9) and <em>I/O handling</em>.</p>
<p>Picture an airport. Most passengers (guest <em>user</em> programs) walk through the green lane and board directly — <strong>direct execution</strong>, at full hardware speed, because user-mode code contains no sensitive instruction that matters to the monitor. A few bags (the guest <em>kernel</em>, the only code that uses privileged state) go through the X-ray machine first — <strong>binary translation</strong>: the monitor scans the code, and anything dangerous is replaced by a safe equivalent before it is allowed to run. The "decision algorithm" is the officer who picks the lane for each passenger; slide 14 gives the exact rules.</p>
<p>The two shared modules are what let both paths agree on the same virtual machine. The <strong>shadow MMU</strong> keeps the page tables the real CPU uses (guest virtual → host physical) in step with the guest's own tables, which the guest believes the CPU uses. The <strong>I/O handling</strong> module turns the guest's accesses to its virtual devices into operations on real resources (a file, a window, a network socket) — in the hosted architecture of slides 17–18 that means leaving the monitor to call the host OS. VMware also takes care that the translated code, and the monitor itself, sit in a part of the address space the guest cannot reach (the segment-limit trick of slide 6) — that is how the monitor stays safe without any trap.</p>
<p class="meo">🧠 To remember the figure: <em>decide → (run directly | translate) → both call the same helpers.</em> If you only have ten seconds in the presentation: "user code runs natively, kernel code is rewritten on the fly".</p>
<p class="pitfall">⚠️ This figure is the <em>software-only</em> monitor; with VT-x / AMD-V the box "binary translation" disappears and the decision algorithm reduces to "run the guest in hardware guest mode". The figure is still how you explain <em>why</em> hardware assist was a relief: it deleted the hardest part.</p>`,
        `<p class="y-chinh">🎯 Hình 7-8: các thành phần mức cao của bộ giám sát máy ảo VMware (khi không có hỗ trợ phần cứng). Một <strong>thuật toán quyết định</strong> nhìn trạng thái CPU ảo và gửi mã tới <strong>thực thi trực tiếp (direct execution)</strong> hoặc tới <strong>dịch nhị phân (binary translation)</strong>; cả hai dựa vào các <strong>mô-đun chung</strong> — <em>shadow MMU</em> (bảng trang bóng, slide 9) và <em>xử lý I/O</em>.</p>
<p>Hình dung một sân bay. Đa số hành khách (chương trình <em>người dùng</em> của guest) đi làn xanh và lên máy bay thẳng — <strong>thực thi trực tiếp</strong>, hết tốc độ phần cứng, vì mã chế độ người dùng không chứa lệnh nhạy cảm nào quan trọng với bộ giám sát. Vài hành lý (<em>nhân</em> của guest, mã duy nhất dùng trạng thái đặc quyền) phải qua máy soi trước — <strong>dịch nhị phân</strong>: bộ giám sát quét mã, thứ gì nguy hiểm được thay bằng bản tương đương an toàn trước khi cho chạy. "Thuật toán quyết định" là nhân viên chọn làn cho từng hành khách; slide 14 cho luật chính xác.</p>
<p>Hai mô-đun chung là thứ giúp hai đường thống nhất về cùng một máy ảo. <strong>Shadow MMU</strong> giữ các bảng trang CPU thật dùng (guest virtual → host physical) đồng bộ với bảng của chính guest, thứ guest tin rằng CPU đang dùng. Mô-đun <strong>xử lý I/O</strong> biến các truy cập của guest vào thiết bị ảo thành thao tác trên tài nguyên thật (một tệp, một cửa sổ, một socket mạng) — trong kiến trúc hosted ở slide 17–18 điều đó nghĩa là rời bộ giám sát để gọi HĐH chủ. VMware cũng bảo đảm mã đã dịch, và chính bộ giám sát, nằm ở phần không gian địa chỉ mà guest không với tới (mẹo giới hạn đoạn ở slide 6) — đó là cách bộ giám sát giữ an toàn mà không cần cú bẫy nào.</p>
<p class="meo">🧠 Nhớ hình bằng: <em>quyết định → (chạy thẳng | dịch) → cả hai gọi cùng các hàm hỗ trợ.</em> Nếu chỉ có mười giây khi thuyết trình: "mã người dùng chạy nguyên bản, mã nhân được viết lại ngay khi chạy".</p>
<p class="pitfall">⚠️ Hình này là bộ giám sát <em>chỉ-phần-mềm</em>; với VT-x / AMD-V ô "binary translation" biến mất và thuật toán quyết định rút còn "chạy guest ở chế độ guest của phần cứng". Hình vẫn là cách giải thích <em>vì sao</em> hỗ trợ phần cứng là một sự nhẹ nhõm: nó xoá phần khó nhất.</p>`],
      [14, 'Virtualizing the x86 Architecture (2)',
        `<p class="y-chinh">🎯 Binary translation must be used if any of these is true: (1) the virtual machine is currently running in <strong>kernel mode</strong>; (2) the virtual machine <strong>can disable interrupts and issue I/O</strong> instructions; (3) the virtual machine is currently running in <strong>real mode</strong>. Otherwise the code runs by direct execution.</p>
<p>Each condition names a situation where sensitive instructions can appear: (1) the guest kernel is the only code that touches privileged state; (2) code that can clear the interrupt flag or do port I/O can change the machine in ways the monitor must see — a guest application with I/O privilege qualifies; (3) real mode is the 16-bit mode the PC boots in (BIOS, boot loader, DOS) where everything is privileged-looking and segments work differently. All other code — ordinary user programs — cannot hurt the monitor, so it runs untouched. This is why the guest <em>applications</em> run at native speed and only the guest <em>kernel</em> pays for translation.</p>
<p>What translation does, in miniature: the monitor takes a short run of guest instructions up to the next jump (a <em>basic block</em>), copies the harmless ones, replaces each sensitive one with a call into the monitor's own emulation routine, and stores the result in a <strong>translation cache</strong> — the next time the guest runs that code (a loop, a frequently called kernel function) the translated block is reused, so the translation cost is paid once. The program below does this on a toy block:</p>
<pre><code class="language-javascript">// Binary translation in miniature (slides 13-14): scan a block of "guest kernel" code, copy the safe instructions,
// replace each SENSITIVE one by a call into the monitor, and keep the result in a translation cache.
const SENSITIVE = new Set(['CLI', 'STI', 'POPF', 'PUSHF', 'MOV_CR3']);   // would misbehave or leak the real state
const guestBlock = ['MOV r1,10', 'CLI', 'ADD r1,r1', 'PUSHF', 'POPF', 'STI', 'JNZ loop'];   // one basic block, ends at the jump

const cache = new Map();                 // guest address -&gt; translated block
let translations = 0, monitorCalls = 0, direct = 0;

function translate(addr, block) {
  translations++;
  return block.map((ins) =&gt; {
    const op = ins.split(/[ ,]/)[0];
    return SENSITIVE.has(op) ? { text: &#96;CALL monitor_emulate_&#36;{op.toLowerCase()}&#96;, sens: true } : { text: ins, sens: false };
  });
}
function run(addr, block) {
  if (!cache.has(addr)) cache.set(addr, translate(addr, block));
  for (const t of cache.get(addr)) { if (t.sens) monitorCalls++; else direct++; }
}

console.log('translated block (the guest never sees the original):');
run(0x1000, guestBlock);
for (const t of cache.get(0x1000)) console.log(&#96;  &#36;{t.sens ? '*' : ' '} &#36;{t.text}&#96;);
for (let i = 1; i &lt; 3; i++) run(0x1000, guestBlock);     // the loop runs two more times: cache hits
console.log(&#96;block executed 3 times -&gt; translated &#36;{translations} time(s)&#96;);
console.log(&#96;instructions run directly: &#36;{direct}, calls into the monitor: &#36;{monitorCalls}&#96;);
console.log(&#96;share handled by the monitor: &#36;{(monitorCalls / (direct + monitorCalls) * 100).toFixed(1)} %&#96;);</code></pre>
<div class="out">$ node dich-nhi-phan.js<br>
translated block (the guest never sees the original):<br>
&nbsp;&nbsp;&nbsp;&nbsp;MOV r1,10<br>
&nbsp;&nbsp;* CALL monitor_emulate_cli<br>
&nbsp;&nbsp;&nbsp;&nbsp;ADD r1,r1<br>
&nbsp;&nbsp;* CALL monitor_emulate_pushf<br>
&nbsp;&nbsp;* CALL monitor_emulate_popf<br>
&nbsp;&nbsp;* CALL monitor_emulate_sti<br>
&nbsp;&nbsp;&nbsp;&nbsp;JNZ loop<br>
block executed 3 times -&gt; translated 1 time(s)<br>
instructions run directly: 9, calls into the monitor: 12<br>
share handled by the monitor: 57.1 %</div>
<p>The block ran three times but was translated once. Each sensitive instruction (<code>CLI</code>, <code>PUSHF</code>, <code>POPF</code>, <code>STI</code>) became a call to a monitor routine that edits the <em>virtual</em> flags — no hardware trap, so each costs far less than the trap of slide 5. In this toy block 57% of instructions end up as monitor calls only because the block is built from sensitive instructions on purpose; in real guest kernel code they are a small fraction. VMware's real translator was more refined: it retranslated blocks <em>adaptively</em> — an instruction that kept causing expensive events was replaced by a cheaper sequence next time (Bugnion et al., 2012).</p>
<p>➕ A famous result: Adams and Agesen (ASPLOS 2006, <em>A Comparison of Software and Hardware Techniques for x86 Virtualization</em>) found that VMware's software monitor was often <em>faster</em> than the first VT-x implementation — first-generation hardware paid a full VM exit for every sensitive event, while translation turned most of them into a few inline instructions. Hardware caught up with later generations (cheaper exits, nested paging — slide 9), and today binary translation is a historical technique for running guests whose kernel cannot use hardware assist.</p>
<p class="pitfall">⚠️ Binary translation is <strong>not</strong> emulation of a different CPU (QEMU without KVM translates ARM to x86, for instance). Here the source and target instruction set are both x86; the translator only rewrites the few instructions that matter. And it is not the same as the "JIT compiler" of a Java VM, although the cache-of-translated-blocks idea is shared.</p>`,
        `<p class="y-chinh">🎯 Phải dùng dịch nhị phân nếu một trong các điều sau đúng: (1) máy ảo đang chạy ở <strong>chế độ nhân</strong>; (2) máy ảo <strong>có thể tắt ngắt và thực hiện lệnh I/O</strong>; (3) máy ảo đang chạy ở <strong>chế độ real</strong>. Ngược lại mã chạy bằng thực thi trực tiếp.</p>
<p>Mỗi điều kiện gọi tên một tình huống mà lệnh nhạy cảm có thể xuất hiện: (1) nhân của guest là mã duy nhất chạm trạng thái đặc quyền; (2) mã có thể xoá cờ ngắt hoặc làm I/O qua cổng có thể đổi máy theo cách bộ giám sát phải biết — một ứng dụng guest có đặc quyền I/O cũng thuộc loại này; (3) chế độ real là chế độ 16 bit mà PC khởi động vào (BIOS, bộ nạp khởi động, DOS) nơi mọi thứ trông như đặc quyền và đoạn hoạt động khác. Mọi mã còn lại — chương trình người dùng thường — không hại được bộ giám sát, nên chạy nguyên si. Đó là lý do <em>ứng dụng</em> của guest chạy với tốc độ nguyên bản và chỉ <em>nhân</em> của guest trả giá cho việc dịch.</p>
<p>Việc dịch làm gì, thu nhỏ lại: bộ giám sát lấy một đoạn ngắn lệnh của guest tới lệnh nhảy kế (một <em>khối cơ bản</em>), chép các lệnh vô hại, thay mỗi lệnh nhạy cảm bằng một lời gọi vào thủ tục giả lập của bộ giám sát, và cất kết quả trong một <strong>bộ nhớ đệm dịch</strong> — lần sau guest chạy đoạn mã đó (một vòng lặp, một hàm nhân hay được gọi) khối đã dịch được dùng lại, nên chi phí dịch chỉ trả một lần. Chương trình dưới đây làm điều này trên một khối đồ chơi:</p>
<pre><code class="language-javascript">// Dịch nhị phân thu nhỏ (slide 13-14): quét một khối mã "nhân của guest", chép các lệnh an toàn,
// thay mỗi lệnh NHẠY CẢM bằng một lời gọi vào bộ giám sát, và giữ kết quả trong bộ nhớ đệm dịch.
const SENSITIVE = new Set(['CLI', 'STI', 'POPF', 'PUSHF', 'MOV_CR3']);   // sẽ hỏng hoặc lộ trạng thái thật
const guestBlock = ['MOV r1,10', 'CLI', 'ADD r1,r1', 'PUSHF', 'POPF', 'STI', 'JNZ loop'];   // một khối cơ bản, kết thúc ở lệnh nhảy

const cache = new Map();                 // địa chỉ guest -&gt; khối đã dịch
let translations = 0, monitorCalls = 0, direct = 0;

function translate(addr, block) {
  translations++;
  return block.map((ins) =&gt; {
    const op = ins.split(/[ ,]/)[0];
    return SENSITIVE.has(op) ? { text: &#96;CALL monitor_emulate_&#36;{op.toLowerCase()}&#96;, sens: true } : { text: ins, sens: false };
  });
}
function run(addr, block) {
  if (!cache.has(addr)) cache.set(addr, translate(addr, block));
  for (const t of cache.get(addr)) { if (t.sens) monitorCalls++; else direct++; }
}

console.log('translated block (the guest never sees the original):');
run(0x1000, guestBlock);
for (const t of cache.get(0x1000)) console.log(&#96;  &#36;{t.sens ? '*' : ' '} &#36;{t.text}&#96;);
for (let i = 1; i &lt; 3; i++) run(0x1000, guestBlock);     // vòng lặp chạy thêm hai lần: trúng bộ nhớ đệm
console.log(&#96;block executed 3 times -&gt; translated &#36;{translations} time(s)&#96;);
console.log(&#96;instructions run directly: &#36;{direct}, calls into the monitor: &#36;{monitorCalls}&#96;);
console.log(&#96;share handled by the monitor: &#36;{(monitorCalls / (direct + monitorCalls) * 100).toFixed(1)} %&#96;);</code></pre>
<div class="out">$ node dich-nhi-phan.js<br>
translated block (the guest never sees the original):<br>
&nbsp;&nbsp;&nbsp;&nbsp;MOV r1,10<br>
&nbsp;&nbsp;* CALL monitor_emulate_cli<br>
&nbsp;&nbsp;&nbsp;&nbsp;ADD r1,r1<br>
&nbsp;&nbsp;* CALL monitor_emulate_pushf<br>
&nbsp;&nbsp;* CALL monitor_emulate_popf<br>
&nbsp;&nbsp;* CALL monitor_emulate_sti<br>
&nbsp;&nbsp;&nbsp;&nbsp;JNZ loop<br>
block executed 3 times -&gt; translated 1 time(s)<br>
instructions run directly: 9, calls into the monitor: 12<br>
share handled by the monitor: 57.1 %</div>
<p>Khối chạy ba lần nhưng chỉ dịch một lần. Mỗi lệnh nhạy cảm (<code>CLI</code>, <code>PUSHF</code>, <code>POPF</code>, <code>STI</code>) thành một lời gọi tới thủ tục của bộ giám sát sửa cờ <em>ảo</em> — không có cú bẫy phần cứng, nên mỗi cái rẻ hơn nhiều so với cú bẫy ở slide 5. Trong khối đồ chơi này 57% lệnh thành lời gọi giám sát chỉ vì khối được dựng cố ý từ lệnh nhạy cảm; trong mã nhân guest thật chúng là một phần nhỏ. Bộ dịch thật của VMware tinh vi hơn: nó dịch lại các khối <em>thích nghi</em> — lệnh cứ gây sự kiện đắt đỏ thì lần sau được thay bằng chuỗi rẻ hơn (Bugnion và cs., 2012).</p>
<p>➕ Một kết quả nổi tiếng: Adams và Agesen (ASPLOS 2006, <em>A Comparison of Software and Hardware Techniques for x86 Virtualization</em>) thấy bộ giám sát phần mềm của VMware thường <em>nhanh hơn</em> bản VT-x đầu tiên — phần cứng thế hệ đầu trả một VM exit đầy đủ cho mỗi sự kiện nhạy cảm, còn dịch nhị phân biến phần lớn chúng thành vài lệnh nội tuyến. Phần cứng đuổi kịp ở các thế hệ sau (exit rẻ hơn, phân trang lồng — slide 9), và ngày nay dịch nhị phân là kỹ thuật lịch sử để chạy guest mà nhân của nó không dùng được hỗ trợ phần cứng.</p>
<p class="pitfall">⚠️ Dịch nhị phân <strong>không phải</strong> giả lập một CPU khác (ví dụ QEMU không có KVM dịch ARM sang x86). Ở đây tập lệnh nguồn và đích đều là x86; bộ dịch chỉ viết lại vài lệnh quan trọng. Và nó không giống "trình biên dịch JIT" của máy ảo Java, dù ý tưởng bộ nhớ đệm các khối đã dịch thì chung.</p>`],
      [15, 'Virtual Hardware Platform (1)',
        `<p class="y-chinh">🎯 Figure 7-9 (first half): the virtual hardware of the early VMware Workstation (about 2000) has a <strong>front end</strong> (what the guest sees) and a <strong>back end</strong> (what the host does for it). The CPU and the memory are <strong>multiplexed</strong>: one virtual x86 CPU, scheduled by the host OS on a uniprocessor or multiprocessor host; up to 512 MB of contiguous DRAM, allocated and managed by the host OS page by page.</p>
<p>A restaurant helps. The <em>front end</em> is the menu — the same dishes every day, in a form every customer understands. The <em>back end</em> is the kitchen: it changes with what the restaurant has in stock and who is cooking. The guest operating system reads only the menu: "1 CPU with these instruction-set extensions, 512 MB of RAM". The host decides how to deliver it. For the CPU the host <em>multiplexes</em>: the virtual CPU is a thread of the host's scheduler, which gives it a time slice on whatever real core is free (the same scheduling as Chapter 2, so a guest's CPU time is competed for like any process's). For memory the host gives the VM a region of its own address space, page by page, and may page it out like any other memory.</p>
<p>The 2000 numbers (one virtual CPU, 512 MB) look tiny; cloud VMs today have dozens or hundreds of virtual CPUs and terabytes of RAM. But the <em>principle</em> is unchanged, and so is one consequence: the sum of what the VMs are promised can exceed what the host has — <strong>overcommit</strong>. The Docker virtual machine you saw in slide 1 reported 10 CPUs and about 8 GB; the Mac underneath has to schedule those 10 virtual CPUs among all of its own work. Memory overcommit works by taking pages back from idle VMs — the <em>balloon driver</em> inside the guest (a <code>virtio_balloon</code> device is in the list of slide 16) inflates, the guest OS swaps or drops its own cache, and the host reuses the freed pages (slide 20).</p>
<p class="pitfall">⚠️ "Multiplexed" and "emulated" are the slide's own words for the two sides of the table: a <em>multiplexed</em> resource is shared out of the real thing (CPU time, RAM pages); an <em>emulated</em> device is a software imitation of a piece of hardware (next slide). In an exam, "the virtual CPU is scheduled by the host operating system" is true for a <em>type 2</em> product like Workstation; in a type 1 hypervisor the hypervisor's own scheduler does it.</p>`,
        `<p class="y-chinh">🎯 Hình 7-9 (nửa đầu): phần cứng ảo của VMware Workstation thời đầu (khoảng 2000) có <strong>front end</strong> (guest thấy gì) và <strong>back end</strong> (host làm gì cho nó). CPU và bộ nhớ được <strong>ghép kênh (multiplexed)</strong>: một CPU x86 ảo, do HĐH chủ lập lịch trên máy chủ một hoặc nhiều bộ xử lý; tối đa 512 MB DRAM liền khối, do HĐH chủ cấp phát và quản lý theo từng trang.</p>
<p>Hình dung một nhà hàng. <em>Front end</em> là thực đơn — mỗi ngày cùng các món, ở dạng mọi khách hiểu. <em>Back end</em> là nhà bếp: nó đổi theo kho có gì và ai đang nấu. HĐH guest chỉ đọc thực đơn: "1 CPU với các phần mở rộng tập lệnh này, 512 MB RAM". Máy chủ quyết định giao thế nào. Với CPU, máy chủ <em>ghép kênh</em>: CPU ảo là một luồng của bộ lập lịch của máy chủ, nó cho một lát thời gian trên nhân thật nào đang rảnh (cùng lập lịch như Chương 2, nên thời gian CPU của guest bị tranh giành như tiến trình thường). Với bộ nhớ, máy chủ cho VM một vùng trong không gian địa chỉ của chính nó, theo từng trang, và có thể đẩy ra đĩa như bộ nhớ khác.</p>
<p>Con số năm 2000 (một CPU ảo, 512 MB) trông nhỏ xíu; máy ảo đám mây ngày nay có hàng chục đến hàng trăm CPU ảo và hàng terabyte RAM. Nhưng <em>nguyên lý</em> không đổi, và một hệ quả cũng không đổi: tổng những gì hứa cho các VM có thể vượt những gì máy chủ có — <strong>overcommit</strong> (cam kết quá mức). Máy ảo Docker bạn thấy ở slide 1 báo 10 CPU và khoảng 8 GB; chiếc Mac bên dưới phải lập lịch 10 CPU ảo đó giữa mọi việc của chính nó. Overcommit bộ nhớ hoạt động bằng cách lấy lại trang từ các VM rảnh — <em>driver balloon</em> trong guest (thiết bị <code>virtio_balloon</code> có trong danh sách ở slide 16) phồng lên, HĐH guest đẩy ra đĩa hoặc bỏ bộ đệm của mình, và máy chủ dùng lại các trang đã giải phóng (slide 20).</p>
<p class="pitfall">⚠️ "Multiplexed" và "emulated" là chữ của chính slide cho hai nửa của bảng: tài nguyên <em>ghép kênh</em> được chia từ đồ thật (thời gian CPU, trang RAM); thiết bị <em>giả lập</em> là bản bắt chước bằng phần mềm của một món phần cứng (slide kế). Trong thi cử, "CPU ảo được HĐH chủ lập lịch" đúng với sản phẩm <em>loại 2</em> như Workstation; với hypervisor loại 1, bộ lập lịch của chính hypervisor làm việc đó.</p>`],
      [16, 'Virtual Hardware Platform (2)',
        `<p class="y-chinh">🎯 Figure 7-9 (second half): the <strong>emulated</strong> devices of the early VMware Workstation — a fully emulated PCI bus; 4 IDE disks and 7 BusLogic SCSI disks (stored as <em>files</em> on the host, or raw access to a real device); an IDE CD-ROM (an ISO image or the real drive); 2 floppy drives; a VMware graphics card with VGA/SVGA; 2 serial ports; a printer port; a 104-key keyboard and a PS/2 mouse (events generated by the VMware window); 3 AMD Lance Ethernet cards (bridged or host-only); a Sound Blaster.</p>
<p>Look at the choice: <em>old, common, boring</em> hardware. The reason is challenge 3 of slide 12 — the guest operating system needs a driver for every device it sees, and the one set of drivers <strong>every</strong> PC operating system of 2000 already contained was for an AMD Lance network card, a BusLogic SCSI controller, an IDE disk and a Sound Blaster. By imitating those, VMware needed no changes to the guest. There was a second benefit: because the <em>virtual</em> hardware is always the same, a VM image runs on any host — you can copy a disk file to a different physical machine and the guest does not notice, because the virtual hardware did not change when the real one did. The price: each guest access to such a device's registers is a trap (slide 5), so emulating old cards is slow.</p>
<p>What replaced the Lance and BusLogic emulations is the answer of slide 7: guest drivers that <em>know</em> they are virtual. Here is the "virtual hardware platform" of the machine this course runs on today:</p>
<div class="out"># Slides 15-16 list the virtual hardware of VMware Workstation (year 2000). Here is the virtual hardware of THIS machine<br>
# Device ID -&gt; kind (virtio spec, section "Device Types")<br>
$ for d in /sys/bus/virtio/devices/*; do printf '%-9s id=%s &nbsp;%-14s driver=%s\\n' "$(basename $d)" "$(cat $d/device)" "$(kind $(cat $d/device))" "$(basename $(readlink $d/driver))"; done<br>
virtio0 &nbsp;&nbsp;id=0x0001 &nbsp;network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtio_net<br>
virtio1 &nbsp;&nbsp;id=0x0003 &nbsp;console &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtio_console<br>
virtio10 &nbsp;id=0x0013 &nbsp;vsock &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=vmw_vsock_virtio_transport<br>
virtio11 &nbsp;id=0x0004 &nbsp;entropy-rng &nbsp;&nbsp;&nbsp;driver=virtio_rng<br>
virtio12 &nbsp;id=0x0005 &nbsp;memory-balloon driver=virtio_balloon<br>
virtio2 &nbsp;&nbsp;id=0x0002 &nbsp;block-disk &nbsp;&nbsp;&nbsp;&nbsp;driver=virtio_blk<br>
virtio3 &nbsp;&nbsp;id=0x0002 &nbsp;block-disk &nbsp;&nbsp;&nbsp;&nbsp;driver=virtio_blk<br>
virtio4 &nbsp;&nbsp;id=0x001a &nbsp;shared-fs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtiofs<br>
virtio5 &nbsp;&nbsp;id=0x001a &nbsp;shared-fs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtiofs<br>
virtio6 &nbsp;&nbsp;id=0x001a &nbsp;shared-fs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtiofs<br>
virtio7 &nbsp;&nbsp;id=0x001a &nbsp;shared-fs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtiofs<br>
virtio8 &nbsp;&nbsp;id=0x001a &nbsp;shared-fs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtiofs<br>
virtio9 &nbsp;&nbsp;id=0x001a &nbsp;shared-fs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtiofs<br>
# The virtio disk is a block device whose parent is a virtio device, not a SATA/IDE controller<br>
$ readlink /sys/block/vda/device | sed 's|.*/||; s|^|vda belongs to |'<br>
vda belongs to virtio2<br>
# Guest and host agree on a set of FEATURES at start-up (one bit per feature)<br>
$ f=$(cat /sys/bus/virtio/devices/virtio2/features); echo "virtio-blk feature bits negotiated: &#36;{#f} bits, $(echo -n $f | tr -cd 1 | wc -c) of them set"<br>
virtio-blk feature bits negotiated: 128 bits, 9 of them set</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Not one Lance or BusLogic: this virtual machine has a <code>virtio-net</code> network card, two <code>virtio-blk</code> disks, a console, a random-number generator, a memory balloon, a <code>vsock</code> (a socket between host and guest) and six <code>virtiofs</code> shared file systems — all <em>paravirtual</em>, defined by the OASIS virtio specification. The disk <code>vda</code> hangs off <code>virtio2</code>, not off any SATA controller. Guest and host also <em>negotiate features</em>: the 128-bit feature word shows 9 bits set — the capabilities both sides agreed to use — so a new host can serve an old guest driver and vice versa. A cloud server's table looks the same; only the count changes.</p>
<p>➕ Beyond emulation and paravirtualization there is a third way to give a VM a device: <strong>pass it through</strong>. With SR-IOV a physical network card or an NVMe disk splits into several <em>virtual functions</em> and each is assigned to one VM, which drives the hardware directly with near-native speed; an <strong>IOMMU</strong> (Intel VT-d, AMD-Vi, ARM SMMU) makes sure the device's DMA (Chapter 5) can only reach that VM's memory. GPU instances in the cloud work this way. The cost is flexibility: a VM with a passed-through device is hard to live-migrate (slide 20).</p>
<p class="pitfall">⚠️ Do not copy the 2000 table into a modern presentation as "what a VM contains"; present it as the <em>historical</em> design (emulate old common hardware) and contrast it with today's virtio list. Remember too that the slide numbers its figures twice as "7-9": the two slides are two halves of one figure.</p>`,
        `<p class="y-chinh">🎯 Hình 7-9 (nửa sau): các thiết bị <strong>giả lập (emulated)</strong> của VMware Workstation thời đầu — bus PCI giả lập đầy đủ; 4 đĩa IDE và 7 đĩa SCSI BusLogic (lưu thành <em>tệp</em> trên máy chủ, hoặc truy cập thô tới thiết bị thật); ổ CD-ROM IDE (ảnh ISO hoặc ổ thật); 2 ổ đĩa mềm; card đồ hoạ VMware với VGA/SVGA; 2 cổng nối tiếp; một cổng máy in; bàn phím 104 phím và chuột PS/2 (sự kiện sinh từ cửa sổ của VMware); 3 card Ethernet AMD Lance (bridged hoặc host-only); một Sound Blaster.</p>
<p>Nhìn lựa chọn: phần cứng <em>cũ, phổ biến, nhàm chán</em>. Lý do là thách thức 3 ở slide 12 — HĐH guest cần driver cho mọi thiết bị nó thấy, và bộ driver duy nhất mà <strong>mọi</strong> HĐH PC năm 2000 đều có sẵn là cho card mạng AMD Lance, bộ điều khiển SCSI BusLogic, đĩa IDE và Sound Blaster. Bắt chước chúng, VMware không phải sửa gì ở guest. Có lợi ích thứ hai: vì phần cứng <em>ảo</em> luôn như nhau, ảnh VM chạy trên máy chủ nào cũng được — bạn chép tệp đĩa sang máy vật lý khác mà guest không hay, vì phần cứng ảo không đổi khi phần cứng thật đổi. Cái giá: mỗi lần guest truy cập thanh ghi của thiết bị như vậy là một cú bẫy (slide 5), nên giả lập card cũ chậm.</p>
<p>Thứ thay cho các bản giả lập Lance và BusLogic là câu trả lời ở slide 7: driver guest <em>biết</em> mình là ảo. Đây là "nền phần cứng ảo" của chính chiếc máy mà khoá học này chạy hôm nay:</p>
<div class="out"># Slide 15-16 liệt kê phần cứng ảo của VMware Workstation (năm 2000). Đây là phần cứng ảo của máy NÀY<br>
# Mã thiết bị -&gt; loại (đặc tả virtio, mục "Device Types")<br>
$ for d in /sys/bus/virtio/devices/*; do printf '%-9s id=%s &nbsp;%-14s driver=%s\\n' "$(basename $d)" "$(cat $d/device)" "$(kind $(cat $d/device))" "$(basename $(readlink $d/driver))"; done<br>
virtio0 &nbsp;&nbsp;id=0x0001 &nbsp;network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtio_net<br>
virtio1 &nbsp;&nbsp;id=0x0003 &nbsp;console &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtio_console<br>
virtio10 &nbsp;id=0x0013 &nbsp;vsock &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=vmw_vsock_virtio_transport<br>
virtio11 &nbsp;id=0x0004 &nbsp;entropy-rng &nbsp;&nbsp;&nbsp;driver=virtio_rng<br>
virtio12 &nbsp;id=0x0005 &nbsp;memory-balloon driver=virtio_balloon<br>
virtio2 &nbsp;&nbsp;id=0x0002 &nbsp;block-disk &nbsp;&nbsp;&nbsp;&nbsp;driver=virtio_blk<br>
virtio3 &nbsp;&nbsp;id=0x0002 &nbsp;block-disk &nbsp;&nbsp;&nbsp;&nbsp;driver=virtio_blk<br>
virtio4 &nbsp;&nbsp;id=0x001a &nbsp;shared-fs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtiofs<br>
virtio5 &nbsp;&nbsp;id=0x001a &nbsp;shared-fs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtiofs<br>
virtio6 &nbsp;&nbsp;id=0x001a &nbsp;shared-fs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtiofs<br>
virtio7 &nbsp;&nbsp;id=0x001a &nbsp;shared-fs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtiofs<br>
virtio8 &nbsp;&nbsp;id=0x001a &nbsp;shared-fs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtiofs<br>
virtio9 &nbsp;&nbsp;id=0x001a &nbsp;shared-fs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver=virtiofs<br>
# Đĩa virtio là thiết bị khối có cha là một thiết bị virtio, không phải bộ điều khiển SATA/IDE<br>
$ readlink /sys/block/vda/device | sed 's|.*/||; s|^|vda belongs to |'<br>
vda belongs to virtio2<br>
# Guest và host thoả thuận một tập TÍNH NĂNG lúc khởi động (mỗi tính năng một bit)<br>
$ f=$(cat /sys/bus/virtio/devices/virtio2/features); echo "virtio-blk feature bits negotiated: &#36;{#f} bits, $(echo -n $f | tr -cd 1 | wc -c) of them set"<br>
virtio-blk feature bits negotiated: 128 bits, 9 of them set</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Không có Lance hay BusLogic nào: máy ảo này có card mạng <code>virtio-net</code>, hai đĩa <code>virtio-blk</code>, một console, một bộ sinh số ngẫu nhiên, một balloon bộ nhớ, một <code>vsock</code> (socket giữa host và guest) và sáu hệ thống tệp chung <code>virtiofs</code> — tất cả đều <em>paravirtual</em>, theo đặc tả virtio của OASIS. Đĩa <code>vda</code> treo vào <code>virtio2</code>, không vào bộ điều khiển SATA nào. Guest và host còn <em>thương lượng tính năng</em>: từ tính năng 128 bit cho thấy 9 bit bật — những khả năng hai bên đồng ý dùng — nên host mới phục vụ được driver guest cũ và ngược lại. Bảng của một máy chủ đám mây trông y hệt; chỉ số lượng khác.</p>
<p>➕ Ngoài giả lập và paravirtualization còn cách thứ ba đưa thiết bị cho VM: <strong>chuyển thẳng (passthrough)</strong>. Với SR-IOV một card mạng hay đĩa NVMe vật lý tách thành nhiều <em>virtual function</em> và mỗi cái giao cho một VM, VM điều khiển phần cứng trực tiếp với tốc độ gần nguyên bản; một <strong>IOMMU</strong> (Intel VT-d, AMD-Vi, ARM SMMU) bảo đảm DMA của thiết bị (Chương 5) chỉ tới được bộ nhớ của VM đó. Máy GPU trên đám mây hoạt động thế. Cái giá là sự linh hoạt: VM có thiết bị chuyển thẳng khó di trú trực tiếp (slide 20).</p>
<p class="pitfall">⚠️ Đừng chép bảng năm 2000 vào bài thuyết trình hiện đại như "một VM chứa gì"; hãy trình bày nó là thiết kế <em>lịch sử</em> (giả lập phần cứng cũ phổ biến) và đối chiếu với danh sách virtio hôm nay. Nhớ rằng slide đánh số hình hai lần là "7-9": hai slide là hai nửa của một hình.</p>`],
      [17, 'Role of the Host Operating System (1)',
        `<p class="y-chinh">🎯 Figure 7-10: the <strong>VMware hosted architecture</strong> has three components — the <strong>VMX</strong> (an ordinary user-mode process of the host OS that represents the virtual machine and performs its I/O), the <strong>VMM driver</strong> (a kernel module loaded into the host OS) and the <strong>VMM</strong> (the monitor itself, which runs in its own "VMM world" with full hardware privilege and executes the guest).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/e614a2f32162f0b7d209f274399d6b406da4cba4.svg" alt="A guest disk write in the hosted architecture: the VMM cannot call the host OS, so control must leave its world and come back" loading="lazy" /><p class="chu-thich">🧩 A guest disk write in the hosted architecture: the VMM cannot call the host OS, so control must leave its world and come back</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figures 7-10 / 7-11: VMware's hosted architecture — a guest disk write crosses from the VMM world to the host world and back
participant "Guest OS\\n(runs inside the VMM world)" as G
participant "VMM\\n(kernel mode, special address space)" as M
participant "VMM driver\\n(kernel module in the host OS)" as D
participant "VMX\\n(ordinary host process)" as X
participant "Host OS" as H
G -&gt; M : I/O instruction to the virtual disk — trapped
M -&gt; D : WORLD SWITCH: save the VMM context,\\nrestore the host OS context
D -&gt; X : return from the ioctl: "the guest wants I/O"
X -&gt; H : write() to the file that stores the virtual disk
H -&gt; H : normal host file system and disk driver
H -&gt; X : write completes
X -&gt; D : ioctl: "run the guest again"
D -&gt; M : WORLD SWITCH back: restore the VMM context
M -&gt; G : virtual interrupt: I/O done
note over D, M : a world switch swaps ALL machine state\\n(page tables, descriptor tables, interrupt table) — heavier than\\na normal context switch between two host processes
@enduml</code></pre></details>
<p>An embassy is a good picture. The guest (the diplomat) lives inside the embassy (the VMM world) and cannot walk around town. When it needs something from the city — a file written, a packet sent — a messenger (the VMX, an ordinary resident of the host OS) goes out and buys it. The gate between embassy and town is the VMM driver, because only code inside the host kernel may switch the processor between the two worlds. The sequence in the diagram is Figure 7-10's numbered steps: (1) the guest executes an I/O instruction; the monitor traps it; (2) the monitor cannot run host code, so it asks the driver for a <em>world switch</em> to the host; (3) in the host, the driver "returns" to the VMX — from the VMX's point of view it was blocked in an <code>ioctl</code> waiting for the guest's next request; (4) the VMX performs the I/O with ordinary system calls (<code>write</code> to the file that stores the virtual disk), using every driver and cache the host already has; (5) a second world switch resumes the guest, with a virtual interrupt for "I/O complete".</p>
<p>That is the quiet strength of the hosted design — it is also the answer to challenges 3 and 4 of slide 12: VMware did not have to write drivers for thousands of cards (the host already owns them), and the user installs a normal program. VMware Workstation, Oracle VirtualBox and Parallels follow this pattern: the hypervisor appears as a driver plus a user process.</p>
<p>➕ KVM + QEMU uses almost the same split with different names: the QEMU process is the VMX (it draws the virtual devices and does the I/O); <code>/dev/kvm</code> and the kernel module are the VMM driver; the guest runs in hardware guest mode in place of the VMM world. You can see it on any Linux KVM host — each virtual machine is one <code>qemu-system-*</code> process whose threads include one per virtual CPU.</p>
<p class="pitfall">⚠️ The VMX is a <em>user process</em> — it shows up in the host's task manager, can be killed, and its memory is the guest's RAM. Do not draw it inside the monitor. And the "VMM driver" is not a hypervisor by itself; it only gives the monitor a way to run and to switch worlds.</p>`,
        `<p class="y-chinh">🎯 Hình 7-10: <strong>kiến trúc hosted của VMware</strong> có ba thành phần — <strong>VMX</strong> (một tiến trình người dùng bình thường của HĐH chủ, đại diện cho máy ảo và thực hiện I/O của nó), <strong>VMM driver</strong> (một mô-đun nhân nạp vào HĐH chủ) và <strong>VMM</strong> (chính bộ giám sát, chạy trong "thế giới VMM" riêng với đặc quyền phần cứng đầy đủ và thực thi guest).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/e614a2f32162f0b7d209f274399d6b406da4cba4.svg" alt="Một lần ghi đĩa của guest trong kiến trúc hosted: VMM không gọi được HĐH chủ, nên quyền điều khiển phải rời thế giới của nó rồi quay về" loading="lazy" /><p class="chu-thich">🧩 Một lần ghi đĩa của guest trong kiến trúc hosted: VMM không gọi được HĐH chủ, nên quyền điều khiển phải rời thế giới của nó rồi quay về</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 7-10 / 7-11: kiến trúc hosted của VMware — một lần ghi đĩa của guest đi từ thế giới VMM sang thế giới host rồi về
participant "Guest OS\\n(runs inside the VMM world)" as G
participant "VMM\\n(kernel mode, special address space)" as M
participant "VMM driver\\n(kernel module in the host OS)" as D
participant "VMX\\n(ordinary host process)" as X
participant "Host OS" as H
G -&gt; M : I/O instruction to the virtual disk — trapped
M -&gt; D : WORLD SWITCH: save the VMM context,\\nrestore the host OS context
D -&gt; X : return from the ioctl: "the guest wants I/O"
X -&gt; H : write() to the file that stores the virtual disk
H -&gt; H : normal host file system and disk driver
H -&gt; X : write completes
X -&gt; D : ioctl: "run the guest again"
D -&gt; M : WORLD SWITCH back: restore the VMM context
M -&gt; G : virtual interrupt: I/O done
note over D, M : a world switch swaps ALL machine state\\n(page tables, descriptor tables, interrupt table) — heavier than\\na normal context switch between two host processes
@enduml</code></pre></details>
<p>Đại sứ quán là một hình ảnh tốt. Guest (nhà ngoại giao) sống bên trong đại sứ quán (thế giới VMM) và không đi dạo quanh thành phố được. Khi cần gì từ thành phố — một tệp được ghi, một gói tin được gửi — một người đưa tin (VMX, cư dân bình thường của HĐH chủ) ra ngoài mua về. Cổng giữa đại sứ quán và thành phố là VMM driver, vì chỉ mã nằm trong nhân của HĐH chủ mới đổi được bộ xử lý giữa hai thế giới. Dãy bước trong sơ đồ là các bước đánh số của Hình 7-10: (1) guest thực hiện một lệnh I/O; bộ giám sát bẫy nó; (2) bộ giám sát không chạy được mã của HĐH chủ, nên nhờ driver làm một <em>world switch</em> sang HĐH chủ; (3) ở HĐH chủ, driver "quay về" VMX — theo quan điểm của VMX thì nó đang bị chặn trong một <code>ioctl</code> chờ yêu cầu kế của guest; (4) VMX thực hiện I/O bằng lời gọi hệ thống thường (<code>write</code> vào tệp chứa đĩa ảo), dùng mọi driver và bộ đệm mà HĐH chủ đã có; (5) world switch lần hai cho guest chạy lại, kèm một ngắt ảo "I/O xong".</p>
<p>Đó là sức mạnh thầm lặng của thiết kế hosted — cũng là câu trả lời cho thách thức 3 và 4 ở slide 12: VMware không phải viết driver cho hàng nghìn loại card (HĐH chủ đã có) và người dùng cài một chương trình bình thường. VMware Workstation, Oracle VirtualBox và Parallels theo mẫu này: hypervisor hiện ra như một driver cộng một tiến trình người dùng.</p>
<p>➕ KVM + QEMU dùng cách chia gần y hệt với tên khác: tiến trình QEMU là VMX (nó vẽ thiết bị ảo và làm I/O); <code>/dev/kvm</code> và mô-đun nhân là VMM driver; guest chạy ở chế độ guest của phần cứng thay cho thế giới VMM. Bạn thấy nó trên mọi máy chủ Linux KVM — mỗi máy ảo là một tiến trình <code>qemu-system-*</code> mà các luồng của nó gồm một luồng cho mỗi CPU ảo.</p>
<p class="pitfall">⚠️ VMX là một <em>tiến trình người dùng</em> — nó hiện trong trình quản lý tác vụ của máy chủ, giết được, và bộ nhớ của nó là RAM của guest. Đừng vẽ nó bên trong bộ giám sát. Và "VMM driver" tự nó không phải hypervisor; nó chỉ cho bộ giám sát một cách để chạy và đổi thế giới.</p>`],
      [18, 'Role of the Host Operating System (2)',
        `<p class="y-chinh">🎯 Figure 7-11: a <strong>normal context switch</strong> between host processes A and B swaps only the user-space part of the address space — the kernel part stays; a <strong>world switch</strong> between the host OS context and the VMM context swaps <em>everything</em>: the whole linear address space (host user + host kernel ↔ virtual machine + monitor), the descriptor and interrupt tables, the control registers — the entire machine state.</p>
<p>Moving house is the analogy: a context switch is changing the person sitting at the desk in the same office (the furniture, the walls, the filing cabinets — the kernel — stay); a world switch is moving the whole office to another building (new walls, new cabinets, even the address on the door). It is correspondingly dearer, and happens at least twice for every guest I/O in the hosted design (slide 17). To see the scale of the <em>ordinary</em> switch on this machine, two processes pinned to one CPU pass a byte back and forth through pipes:</p>
<pre><code class="language-c">// What a NORMAL context switch costs: two processes on ONE CPU hand a byte back and forth through two pipes
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;sched.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static double now_ns(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t); return t.tv_sec * 1e9 + t.tv_nsec; }

int main(void) {
    int a[2], b[2]; char c = 'x';
    pipe(a); pipe(b);
    cpu_set_t one; CPU_ZERO(&amp;one); CPU_SET(0, &amp;one);
    sched_setaffinity(0, sizeof one, &amp;one);                  // both processes inherit: same CPU, so every hand-over is a real switch
    const int N = 100000;
    if (fork() == 0) {
        for (int i = 0; i &lt; N; i++) { read(a[0], &amp;c, 1); write(b[1], &amp;c, 1); }
        _exit(0);
    }
    double t0 = now_ns();
    for (int i = 0; i &lt; N; i++) { write(a[1], &amp;c, 1); read(b[0], &amp;c, 1); }
    double t1 = now_ns();
    wait(NULL);
    // one round trip = 2 switches + 4 system calls (2 write + 2 read)
    printf("%d round trips, each switch costs about %.0f ns (system calls included)\\n", N, (t1 - t0) / N / 2);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread doi-ngu-canh.c -o doi-ngu-canh &amp;&amp; ./doi-ngu-canh<br>
100000 round trips, each switch costs about 1165 ns (system calls included)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>About a microsecond per hand-over — and that figure includes the two system calls (<code>write</code>, <code>read</code>) of each leg, so the switch itself is the smaller part, in the same range as the trapped instruction measured in slide 5. A world switch must reload far more state than a switch between two processes of the same kernel, and a guest I/O needs two of them plus the host's own system call; that is why the hosted design is convenient but not the fastest for I/O-heavy guests, and why the type-1 design of the next slide exists. (The book gives no number for a world switch and neither does this lesson; the figure's lesson is <em>what</em> gets swapped.)</p>
<p class="meo">🧠 One line for the presentation: <em>"A context switch changes the process; a world switch changes the universe."</em></p>
<p class="pitfall">⚠️ Two slides in a row are labelled "Figure 7-11" (this one and slide 19's ESX diagram) — different pictures, same number on the slides; cite them by title, not by number. And "world switch" is VMware's own term for the hosted architecture; in KVM the equivalent events are a <em>VM exit</em> and a <em>VM entry</em> (slide 5).</p>`,
        `<p class="y-chinh">🎯 Hình 7-11: một <strong>đổi ngữ cảnh thường (context switch)</strong> giữa các tiến trình A và B của HĐH chủ chỉ đổi phần không gian người dùng của không gian địa chỉ — phần nhân giữ nguyên; một <strong>world switch</strong> giữa ngữ cảnh HĐH chủ và ngữ cảnh VMM đổi <em>tất cả</em>: toàn bộ không gian địa chỉ tuyến tính (người dùng + nhân của chủ ↔ máy ảo + bộ giám sát), các bảng mô tả và bảng ngắt, các thanh ghi điều khiển — toàn bộ trạng thái máy.</p>
<p>Chuyển nhà là phép so sánh: đổi ngữ cảnh là đổi người ngồi ở bàn trong cùng văn phòng (đồ đạc, tường, tủ hồ sơ — nhân — vẫn đó); world switch là dời cả văn phòng sang toà nhà khác (tường mới, tủ mới, cả địa chỉ trên cửa). Nó đắt tương ứng, và xảy ra ít nhất hai lần cho mỗi I/O của guest trong thiết kế hosted (slide 17). Để thấy cỡ của lần đổi <em>thường</em> trên máy này, hai tiến trình ghim vào một CPU chuyền một byte qua lại bằng pipe:</p>
<pre><code class="language-c">// Một lần đổi ngữ cảnh THƯỜNG tốn bao nhiêu: hai tiến trình trên MỘT CPU chuyền một byte qua lại bằng hai pipe
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;sched.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static double now_ns(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t); return t.tv_sec * 1e9 + t.tv_nsec; }

int main(void) {
    int a[2], b[2]; char c = 'x';
    pipe(a); pipe(b);
    cpu_set_t one; CPU_ZERO(&amp;one); CPU_SET(0, &amp;one);
    sched_setaffinity(0, sizeof one, &amp;one);                  // cả hai tiến trình thừa kế: cùng CPU, nên mỗi lần chuyền là một lần đổi ngữ cảnh thật
    const int N = 100000;
    if (fork() == 0) {
        for (int i = 0; i &lt; N; i++) { read(a[0], &amp;c, 1); write(b[1], &amp;c, 1); }
        _exit(0);
    }
    double t0 = now_ns();
    for (int i = 0; i &lt; N; i++) { write(a[1], &amp;c, 1); read(b[0], &amp;c, 1); }
    double t1 = now_ns();
    wait(NULL);
    // một vòng đi-về = 2 lần đổi ngữ cảnh + 4 lời gọi hệ thống (2 write + 2 read)
    printf("%d round trips, each switch costs about %.0f ns (system calls included)\\n", N, (t1 - t0) / N / 2);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread doi-ngu-canh.c -o doi-ngu-canh &amp;&amp; ./doi-ngu-canh<br>
100000 round trips, each switch costs about 1165 ns (system calls included)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Khoảng một micro giây mỗi lần chuyền — và con số đó gồm cả hai lời gọi hệ thống (<code>write</code>, <code>read</code>) của mỗi chặng, nên bản thân việc đổi là phần nhỏ hơn, cùng cỡ với lệnh bị bẫy đo ở slide 5. World switch phải nạp lại nhiều trạng thái hơn hẳn việc đổi giữa hai tiến trình của cùng một nhân, và một I/O của guest cần hai lần cộng một lời gọi hệ thống của chính HĐH chủ; đó là lý do thiết kế hosted tiện nhưng không nhanh nhất cho guest nặng I/O, và là lý do thiết kế loại 1 của slide kế tồn tại. (Sách không đưa con số cho world switch và bài này cũng không; bài học của hình là <em>cái gì</em> bị đổi.)</p>
<p class="meo">🧠 Một câu cho buổi thuyết trình: <em>"Đổi ngữ cảnh đổi tiến trình; world switch đổi cả vũ trụ."</em></p>
<p class="pitfall">⚠️ Hai slide liên tiếp cùng ghi "Figure 7-11" (slide này và sơ đồ ESX ở slide 19) — hai hình khác nhau, trùng số trên slide; hãy trích dẫn theo tên chứ không theo số. Và "world switch" là thuật ngữ riêng của VMware cho kiến trúc hosted; ở KVM các sự kiện tương đương là <em>VM exit</em> và <em>VM entry</em> (slide 5).</p>`],
      [19, 'ESX Server: VMware’s type-1 Hypervisor (1)',
        `<p class="y-chinh">🎯 The figure shows <strong>ESX Server</strong>, VMware's <strong>type-1</strong> hypervisor: four virtual machines, each with its own VMM, all running on the <strong>ESX hypervisor</strong>, which runs directly on the x86 hardware — no host operating system between them.</p>
<p>Take the previous slide's embassy and give it its own city: ESX does not ask a host OS to do I/O for it, it <em>is</em> the operating system of the machine. The hypervisor contains its own scheduler for virtual CPUs, its own memory manager, its own network and storage stack, and drivers for the server hardware it supports (a short list — enterprise servers, not every PC). The VMM of the previous slides is still there, one per VM, doing the CPU virtualization; what disappears is the host OS and the world switch to reach it. An I/O of a guest goes: guest → VMM → hypervisor → driver → device, all inside one kernel. ESX started as a product for datacentre servers in the early 2000s; its successor <strong>ESXi</strong> removed the Linux-based management console of the original ESX and became a small installable hypervisor image — the type-1 product that fills the datacentres the slide's Figure 7-2 shows next to Xen and Hyper-V.</p>
<p>The price of the type-1 design is the mirror of the hosted design's benefit: a supported-hardware list, and an installation that replaces whatever ran on the machine. It suits a rack of identical servers and not a laptop, which is exactly how VMware divided its products: Workstation (type 2) for developers, ESX (type 1) for production.</p>
<p>➕ Two notes for an up-to-date presentation. (1) The slide's picture has a rotated label reading "68" on the left of the stack, a conversion error — the book's original figure labels the layers; do not repeat the "68". (2) VMware is now owned by Broadcom (the acquisition closed in late 2023), whose changed licensing has pushed many organisations to compare alternatives built on KVM — the Linux hypervisor of slide 3 — such as Proxmox VE or the clouds' own platforms; if you cite the market situation, put the date next to it.</p>
<p class="pitfall">⚠️ "ESX = type 1" is the answer; "VMware Workstation = type 2" is the FE's favourite (FE21#37, FE23#33, FE24#7). Do not let a question about <em>VMware</em> make you answer "type 1": the company sells both.</p>`,
        `<p class="y-chinh">🎯 Hình vẽ <strong>ESX Server</strong>, hypervisor <strong>loại 1</strong> của VMware: bốn máy ảo, mỗi cái có VMM riêng, tất cả chạy trên <strong>hypervisor ESX</strong>, thứ chạy thẳng trên phần cứng x86 — không có hệ điều hành chủ ở giữa.</p>
<p>Lấy đại sứ quán của slide trước và cho nó một thành phố riêng: ESX không nhờ một HĐH chủ làm I/O hộ, nó <em>chính là</em> hệ điều hành của máy. Hypervisor chứa bộ lập lịch CPU ảo riêng, bộ quản lý bộ nhớ riêng, ngăn xếp mạng và lưu trữ riêng, và driver cho phần cứng máy chủ nó hỗ trợ (danh sách ngắn — máy chủ doanh nghiệp, không phải PC nào cũng được). VMM của các slide trước vẫn còn, mỗi VM một cái, làm việc ảo hoá CPU; thứ biến mất là HĐH chủ và world switch để tới nó. I/O của guest đi: guest → VMM → hypervisor → driver → thiết bị, tất cả trong một nhân. ESX bắt đầu là sản phẩm cho máy chủ trung tâm dữ liệu đầu những năm 2000; người kế nhiệm <strong>ESXi</strong> bỏ bảng điều khiển quản lý dựa trên Linux của ESX gốc và thành một ảnh hypervisor nhỏ cài được — sản phẩm loại 1 lấp đầy các trung tâm dữ liệu mà Hình 7-2 ở slide 4 xếp cạnh Xen và Hyper-V.</p>
<p>Cái giá của thiết kế loại 1 là hình ảnh phản chiếu của lợi ích thiết kế hosted: một danh sách phần cứng được hỗ trợ, và một bản cài thay thế thứ gì đang chạy trên máy. Nó hợp một giá máy chủ giống nhau chứ không hợp laptop, đúng như cách VMware chia sản phẩm: Workstation (loại 2) cho lập trình viên, ESX (loại 1) cho sản xuất.</p>
<p>➕ Hai ghi chú để bài thuyết trình cập nhật. (1) Hình trên slide có một nhãn xoay dọc ghi "68" ở bên trái chồng tầng, đó là lỗi chuyển đổi — hình gốc của sách ghi nhãn các tầng; đừng lặp lại số "68". (2) VMware nay thuộc Broadcom (thương vụ hoàn tất cuối 2023), chính sách cấp phép thay đổi đã khiến nhiều tổ chức so sánh các lựa chọn dựa trên KVM — hypervisor Linux ở slide 3 — như Proxmox VE hay nền tảng riêng của các đám mây; nếu nêu tình hình thị trường, ghi ngày tháng bên cạnh.</p>
<p class="pitfall">⚠️ "ESX = loại 1" là đáp án; "VMware Workstation = loại 2" là món FE thích nhất (FE21#37, FE23#33, FE24#7). Đừng để một câu hỏi về <em>VMware</em> khiến bạn trả lời "loại 1": công ty bán cả hai.</p>`],
      [20, 'ESX Server: VMware’s type-1 Hypervisor (2)',
        `<p class="y-chinh">🎯 The ESX Server architecture brings substantial benefits: (1) the <strong>CPU scheduler</strong> ensures each virtual machine gets a fair share of the CPU; (2) the <strong>memory manager</strong> is optimized for scalability; (3) the <strong>I/O subsystem</strong> is optimized for performance; (4) back ends also typically rely on abstractions provided by a host operating system; (5) ESX made it <strong>easy to introduce new capabilities</strong>.</p>
<p>Items 1–3 are the three jobs of an operating system from Chapters 2, 3 and 5, done for virtual machines. <em>CPU</em>: a proportional-share scheduler — each VM has "shares" and optional reservations and limits, so a noisy VM cannot starve a quiet one (Chapter 2's fair scheduling, one level up). <em>Memory</em>: besides paging, ESX reclaims RAM from idle VMs with <strong>ballooning</strong> — a driver in the guest (the <code>virtio_balloon</code> of slide 16 is the open-source version) asks the guest OS for memory, the guest swaps or drops its cache to give it, and the host hands those pages to a busy VM; this is what lets a host promise more total RAM than it owns. <em>I/O</em>: drivers live inside the hypervisor, so a guest I/O avoids the world switch of slide 18. Item 4 is a slip of the slide: back ends relying on a <em>host OS</em> describes the <em>hosted</em> architecture (slide 17); ESX has no host OS.</p>
<p>Item 5 deserves the most attention, and a measurement. A hypervisor sees and controls all of a VM's state, so it can do what no physical server can: <strong>snapshot</strong> it, <strong>clone</strong> it, and — the famous one — <strong>live-migrate</strong> it to another physical host while it keeps running (VMware calls it vMotion). The standard method is <em>pre-copy</em> (Clark et al., NSDI 2005): copy all memory while the VM runs, re-send the pages it dirtied meanwhile, repeat until what remains is small, then pause the VM for the last few megabytes and resume it on the new host. Clark's measured downtimes: 60 ms for a Quake 3 game server and 210 ms for a web server. The program models the arithmetic:</p>
<pre><code class="language-javascript">// Live migration, pre-copy (Clark et al., NSDI 2005): copy the memory while the VM keeps running,
// then re-send the pages dirtied meanwhile, round after round, until the rest is small enough to stop the VM briefly.
function preCopy({ memMiB, linkMiBs, dirtyMiBs, stopMs, maxRounds = 30 }) {
  let todo = memMiB, total = 0, t = 0;
  const rounds = [];
  for (let r = 1; r &lt;= maxRounds; r++) {
    const sec = todo / linkMiBs;                          // time to send this round
    if (sec * 1000 &lt;= stopMs) {                           // small enough: stop the VM and send the rest
      rounds.push({ r, todo, sec, last: true });
      return { rounds, total: total + todo, downtimeMs: sec * 1000, totalSec: t + sec, converged: true };
    }
    rounds.push({ r, todo, sec, last: false });
    total += todo; t += sec;
    todo = Math.min(memMiB, dirtyMiBs * sec);             // pages dirtied while we were sending
  }
  return { rounds, total, downtimeMs: todo / linkMiBs * 1000, totalSec: t, converged: false };   // gave up: forced stop-and-copy
}
function show(name, p) {
  console.log(&#96;== &#36;{name}: memory &#36;{p.memMiB} MiB, link &#36;{p.linkMiBs} MiB/s, dirty rate &#36;{p.dirtyMiBs} MiB/s, stop when the rest sends in &lt;= &#36;{p.stopMs} ms&#96;);
  const r = preCopy(p);
  for (const x of r.rounds) console.log(&#96;  round &#36;{String(x.r).padStart(2)}: send &#36;{x.todo.toFixed(1).padStart(8)} MiB in &#36;{(x.sec * 1000).toFixed(0).padStart(6)} ms&#36;{x.last ? '   &lt;- VM STOPPED here' : ''}&#96;);
  console.log(&#96;  &#36;{r.converged ? 'converged' : 'DID NOT CONVERGE (forced stop-and-copy)'}: downtime &#36;{r.downtimeMs.toFixed(0)} ms, total sent &#36;{r.total.toFixed(0)} MiB, total time &#36;{r.totalSec.toFixed(1)} s&#96;);
}
show('calm web server', { memMiB: 8192, linkMiBs: 1000, dirtyMiBs: 200, stopMs: 100 });
show('busy in-memory database', { memMiB: 8192, linkMiBs: 1000, dirtyMiBs: 900, stopMs: 100, maxRounds: 8 });
show('writing faster than the link', { memMiB: 8192, linkMiBs: 1000, dirtyMiBs: 1200, stopMs: 100, maxRounds: 8 });</code></pre>
<div class="out">$ node di-tru-truc-tiep.js<br>
== calm web server: memory 8192 MiB, link 1000 MiB/s, dirty rate 200 MiB/s, stop when the rest sends in &lt;= 100 ms<br>
&nbsp;&nbsp;round &nbsp;1: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;2: send &nbsp;&nbsp;1638.4 MiB in &nbsp;&nbsp;1638 ms<br>
&nbsp;&nbsp;round &nbsp;3: send &nbsp;&nbsp;&nbsp;327.7 MiB in &nbsp;&nbsp;&nbsp;328 ms<br>
&nbsp;&nbsp;round &nbsp;4: send &nbsp;&nbsp;&nbsp;&nbsp;65.5 MiB in &nbsp;&nbsp;&nbsp;&nbsp;66 ms &nbsp;&nbsp;&lt;- VM STOPPED here<br>
&nbsp;&nbsp;converged: downtime 66 ms, total sent 10224 MiB, total time 10.2 s<br>
== busy in-memory database: memory 8192 MiB, link 1000 MiB/s, dirty rate 900 MiB/s, stop when the rest sends in &lt;= 100 ms<br>
&nbsp;&nbsp;round &nbsp;1: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;2: send &nbsp;&nbsp;7372.8 MiB in &nbsp;&nbsp;7373 ms<br>
&nbsp;&nbsp;round &nbsp;3: send &nbsp;&nbsp;6635.5 MiB in &nbsp;&nbsp;6636 ms<br>
&nbsp;&nbsp;round &nbsp;4: send &nbsp;&nbsp;5972.0 MiB in &nbsp;&nbsp;5972 ms<br>
&nbsp;&nbsp;round &nbsp;5: send &nbsp;&nbsp;5374.8 MiB in &nbsp;&nbsp;5375 ms<br>
&nbsp;&nbsp;round &nbsp;6: send &nbsp;&nbsp;4837.3 MiB in &nbsp;&nbsp;4837 ms<br>
&nbsp;&nbsp;round &nbsp;7: send &nbsp;&nbsp;4353.6 MiB in &nbsp;&nbsp;4354 ms<br>
&nbsp;&nbsp;round &nbsp;8: send &nbsp;&nbsp;3918.2 MiB in &nbsp;&nbsp;3918 ms<br>
&nbsp;&nbsp;DID NOT CONVERGE (forced stop-and-copy): downtime 3526 ms, total sent 46656 MiB, total time 46.7 s<br>
== writing faster than the link: memory 8192 MiB, link 1000 MiB/s, dirty rate 1200 MiB/s, stop when the rest sends in &lt;= 100 ms<br>
&nbsp;&nbsp;round &nbsp;1: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;2: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;3: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;4: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;5: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;6: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;7: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;8: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;DID NOT CONVERGE (forced stop-and-copy): downtime 8192 ms, total sent 65536 MiB, total time 65.5 s</div>
<p>For a calm server writing 200 MiB/s over a 1000 MiB/s link, each round is five times smaller than the last (8192 → 1638 → 328 → 66 MiB) and the VM stops for only <strong>66 ms</strong> — the same order as Clark's 60 ms. For a database that dirties pages at 900 MiB/s, rounds shrink only 10% at a time and the algorithm gives up with a multi-second pause; when the dirty rate exceeds the link speed, <em>pre-copy can never converge</em>. Real hypervisors then throttle the guest's CPU, compress memory, or use post-copy. The deciding ratio is <strong>dirty rate ÷ link speed</strong>: below 1 it converges, geometrically, with ratio equal to that number.</p>
<p>➕ The same idea moved down in size for cloud functions. AWS's <strong>Firecracker</strong> (Agache et al., NSDI 2020) is a minimal KVM-based virtual-machine monitor with a tiny device model (virtio net and block, a vsock, a serial console): it starts a guest to user-space <code>init</code> in up to 125 ms and the VMM costs at most 5 MiB of memory for a 1-vCPU, 128-MiB microVM (the project's specification, read 26 October 2026) — so a <em>virtual machine</em> can be as cheap as a container while keeping the hardware wall; it carries AWS Lambda and Fargate. On Apple silicon laptops, Docker Desktop's Linux VM runs on Apple's Virtualization framework or Docker's own VMM (slide 4) — the "type 2 on a laptop" case, the very VM you ran the programs of this lesson in.</p>
<p class="pitfall">⚠️ Do not say "live migration has zero downtime": there is always a short pause — tens to hundreds of milliseconds — for the last round. And a VM with a <em>passed-through</em> device (slide 16) usually cannot be live-migrated, because the device's state lives in hardware.</p>`,
        `<p class="y-chinh">🎯 Kiến trúc ESX Server mang lại lợi ích đáng kể: (1) <strong>bộ lập lịch CPU</strong> bảo đảm mỗi máy ảo nhận phần CPU công bằng; (2) <strong>bộ quản lý bộ nhớ</strong> được tối ưu cho khả năng mở rộng; (3) <strong>hệ thống con I/O</strong> được tối ưu cho hiệu năng; (4) các back end cũng thường dựa vào trừu tượng do một hệ điều hành chủ cung cấp; (5) ESX giúp <strong>dễ đưa vào khả năng mới</strong>.</p>
<p>Mục 1–3 là ba việc của một hệ điều hành ở Chương 2, 3 và 5, làm cho máy ảo. <em>CPU</em>: bộ lập lịch chia theo tỉ lệ — mỗi VM có "shares" và tuỳ chọn mức đặt trước và giới hạn, nên một VM ồn ào không bỏ đói được VM yên lặng (lập lịch công bằng của Chương 2, lên một tầng). <em>Bộ nhớ</em>: ngoài phân trang, ESX thu hồi RAM từ các VM rảnh bằng <strong>ballooning</strong> (bơm bóng) — một driver trong guest (<code>virtio_balloon</code> ở slide 16 là bản mã nguồn mở) xin HĐH guest bộ nhớ, guest đẩy ra đĩa hoặc bỏ bộ đệm để nhường, và máy chủ đưa các trang đó cho VM đang bận; đó là điều cho phép một máy chủ hứa tổng RAM nhiều hơn mình có. <em>I/O</em>: driver nằm trong hypervisor, nên I/O của guest tránh được world switch ở slide 18. Mục 4 là sơ suất của slide: back end dựa vào <em>HĐH chủ</em> mô tả kiến trúc <em>hosted</em> (slide 17); ESX không có HĐH chủ.</p>
<p>Mục 5 đáng chú ý nhất, kèm một phép đo. Hypervisor thấy và điều khiển toàn bộ trạng thái của một VM, nên làm được điều không máy chủ vật lý nào làm được: <strong>chụp snapshot</strong>, <strong>nhân bản (clone)</strong>, và — nổi tiếng nhất — <strong>di trú trực tiếp (live migration)</strong> sang máy vật lý khác trong khi nó vẫn chạy (VMware gọi là vMotion). Phương pháp chuẩn là <em>pre-copy</em> (Clark và cs., NSDI 2005): chép toàn bộ bộ nhớ trong khi VM chạy, gửi lại các trang nó ghi trong lúc đó, lặp tới khi phần còn lại nhỏ, rồi tạm dừng VM để chép vài megabyte cuối và cho nó chạy tiếp ở máy mới. Thời gian ngừng Clark đo được: 60 ms cho một máy chủ game Quake 3 và 210 ms cho một máy chủ web. Chương trình mô hình hoá phép tính:</p>
<pre><code class="language-javascript">// Di trú trực tiếp, pre-copy (Clark và cs., NSDI 2005): chép bộ nhớ trong khi VM vẫn chạy,
// rồi gửi lại các trang bị ghi trong lúc đó, hết vòng này tới vòng khác, tới khi phần còn lại đủ nhỏ để dừng VM thật ngắn.
function preCopy({ memMiB, linkMiBs, dirtyMiBs, stopMs, maxRounds = 30 }) {
  let todo = memMiB, total = 0, t = 0;
  const rounds = [];
  for (let r = 1; r &lt;= maxRounds; r++) {
    const sec = todo / linkMiBs;                          // thời gian gửi vòng này
    if (sec * 1000 &lt;= stopMs) {                           // đủ nhỏ: dừng VM và gửi phần còn lại
      rounds.push({ r, todo, sec, last: true });
      return { rounds, total: total + todo, downtimeMs: sec * 1000, totalSec: t + sec, converged: true };
    }
    rounds.push({ r, todo, sec, last: false });
    total += todo; t += sec;
    todo = Math.min(memMiB, dirtyMiBs * sec);             // trang bị ghi trong lúc ta gửi
  }
  return { rounds, total, downtimeMs: todo / linkMiBs * 1000, totalSec: t, converged: false };   // bỏ cuộc: ép dừng-và-chép
}
function show(name, p) {
  console.log(&#96;== &#36;{name}: memory &#36;{p.memMiB} MiB, link &#36;{p.linkMiBs} MiB/s, dirty rate &#36;{p.dirtyMiBs} MiB/s, stop when the rest sends in &lt;= &#36;{p.stopMs} ms&#96;);
  const r = preCopy(p);
  for (const x of r.rounds) console.log(&#96;  round &#36;{String(x.r).padStart(2)}: send &#36;{x.todo.toFixed(1).padStart(8)} MiB in &#36;{(x.sec * 1000).toFixed(0).padStart(6)} ms&#36;{x.last ? '   &lt;- VM STOPPED here' : ''}&#96;);
  console.log(&#96;  &#36;{r.converged ? 'converged' : 'DID NOT CONVERGE (forced stop-and-copy)'}: downtime &#36;{r.downtimeMs.toFixed(0)} ms, total sent &#36;{r.total.toFixed(0)} MiB, total time &#36;{r.totalSec.toFixed(1)} s&#96;);
}
show('calm web server', { memMiB: 8192, linkMiBs: 1000, dirtyMiBs: 200, stopMs: 100 });
show('busy in-memory database', { memMiB: 8192, linkMiBs: 1000, dirtyMiBs: 900, stopMs: 100, maxRounds: 8 });
show('writing faster than the link', { memMiB: 8192, linkMiBs: 1000, dirtyMiBs: 1200, stopMs: 100, maxRounds: 8 });</code></pre>
<div class="out">$ node di-tru-truc-tiep.js<br>
== calm web server: memory 8192 MiB, link 1000 MiB/s, dirty rate 200 MiB/s, stop when the rest sends in &lt;= 100 ms<br>
&nbsp;&nbsp;round &nbsp;1: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;2: send &nbsp;&nbsp;1638.4 MiB in &nbsp;&nbsp;1638 ms<br>
&nbsp;&nbsp;round &nbsp;3: send &nbsp;&nbsp;&nbsp;327.7 MiB in &nbsp;&nbsp;&nbsp;328 ms<br>
&nbsp;&nbsp;round &nbsp;4: send &nbsp;&nbsp;&nbsp;&nbsp;65.5 MiB in &nbsp;&nbsp;&nbsp;&nbsp;66 ms &nbsp;&nbsp;&lt;- VM STOPPED here<br>
&nbsp;&nbsp;converged: downtime 66 ms, total sent 10224 MiB, total time 10.2 s<br>
== busy in-memory database: memory 8192 MiB, link 1000 MiB/s, dirty rate 900 MiB/s, stop when the rest sends in &lt;= 100 ms<br>
&nbsp;&nbsp;round &nbsp;1: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;2: send &nbsp;&nbsp;7372.8 MiB in &nbsp;&nbsp;7373 ms<br>
&nbsp;&nbsp;round &nbsp;3: send &nbsp;&nbsp;6635.5 MiB in &nbsp;&nbsp;6636 ms<br>
&nbsp;&nbsp;round &nbsp;4: send &nbsp;&nbsp;5972.0 MiB in &nbsp;&nbsp;5972 ms<br>
&nbsp;&nbsp;round &nbsp;5: send &nbsp;&nbsp;5374.8 MiB in &nbsp;&nbsp;5375 ms<br>
&nbsp;&nbsp;round &nbsp;6: send &nbsp;&nbsp;4837.3 MiB in &nbsp;&nbsp;4837 ms<br>
&nbsp;&nbsp;round &nbsp;7: send &nbsp;&nbsp;4353.6 MiB in &nbsp;&nbsp;4354 ms<br>
&nbsp;&nbsp;round &nbsp;8: send &nbsp;&nbsp;3918.2 MiB in &nbsp;&nbsp;3918 ms<br>
&nbsp;&nbsp;DID NOT CONVERGE (forced stop-and-copy): downtime 3526 ms, total sent 46656 MiB, total time 46.7 s<br>
== writing faster than the link: memory 8192 MiB, link 1000 MiB/s, dirty rate 1200 MiB/s, stop when the rest sends in &lt;= 100 ms<br>
&nbsp;&nbsp;round &nbsp;1: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;2: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;3: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;4: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;5: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;6: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;7: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;round &nbsp;8: send &nbsp;&nbsp;8192.0 MiB in &nbsp;&nbsp;8192 ms<br>
&nbsp;&nbsp;DID NOT CONVERGE (forced stop-and-copy): downtime 8192 ms, total sent 65536 MiB, total time 65.5 s</div>
<p>Với một máy chủ yên tĩnh ghi 200 MiB/s qua đường truyền 1000 MiB/s, mỗi vòng nhỏ hơn vòng trước năm lần (8192 → 1638 → 328 → 66 MiB) và VM chỉ dừng <strong>66 ms</strong> — cùng cỡ với 60 ms của Clark. Với cơ sở dữ liệu làm bẩn trang ở 900 MiB/s, các vòng chỉ nhỏ đi 10% mỗi lần và thuật toán bỏ cuộc với một lần dừng nhiều giây; khi tốc độ ghi vượt tốc độ đường truyền, <em>pre-copy không bao giờ hội tụ</em>. Hypervisor thật khi đó giảm tốc CPU của guest, nén bộ nhớ, hoặc dùng post-copy. Tỉ số quyết định là <strong>tốc độ ghi ÷ tốc độ đường truyền</strong>: dưới 1 thì hội tụ, theo cấp số nhân, với công bội đúng bằng con số đó.</p>
<p>➕ Cùng ý tưởng được thu nhỏ cho hàm đám mây. <strong>Firecracker</strong> của AWS (Agache và cs., NSDI 2020) là bộ giám sát máy ảo tối giản dựa trên KVM với mô hình thiết bị bé xíu (mạng và khối virtio, vsock, console nối tiếp): nó khởi động guest tới <code>init</code> ở không gian người dùng trong tối đa 125 ms và VMM tốn tối đa 5 MiB bộ nhớ cho microVM 1 vCPU, 128 MiB (đặc tả của dự án, đọc 26/10/2026) — nên một <em>máy ảo</em> có thể rẻ như container mà vẫn giữ bức tường phần cứng; nó chở AWS Lambda và Fargate. Trên laptop Apple silicon, máy ảo Linux của Docker Desktop chạy trên Virtualization framework của Apple hoặc VMM riêng của Docker (slide 4) — trường hợp "loại 2 trên laptop", chính máy ảo bạn đã chạy các chương trình của bài này.</p>
<p class="pitfall">⚠️ Đừng nói "di trú trực tiếp không có thời gian ngừng": luôn có một lần dừng ngắn — vài chục tới vài trăm mili giây — cho vòng cuối. Và VM có thiết bị <em>chuyển thẳng</em> (slide 16) thường không di trú trực tiếp được, vì trạng thái thiết bị nằm trong phần cứng.</p>`],
      [21, 'End',
        `<p class="y-chinh">🎯 End of Chapter 7: a hypervisor is a small kernel whose "programs" are operating systems; it must be <strong>safe, faithful and efficient</strong>; it is built from trapping, rewriting, cooperating guests or — today — CPU hardware support; memory and devices are virtualized by nested page tables and virtio; the cloud turns all this into a metered, elastic service.</p>
<table>
<thead><tr><th>Idea</th><th>One sentence to remember</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Requirements</td><td>Safety, Fidelity, Efficiency; sensitive ⊆ privileged ⇒ trap-and-emulate works</td><td>2, 5</td></tr>
<tr><td>Hypervisor types</td><td>type 1 on bare metal, type 2 on a host OS, KVM = the Linux kernel itself</td><td>3–4</td></tr>
<tr><td>x86 problem and fixes</td><td>non-trapping sensitive instructions ⇒ binary translation, paravirtualization, then VT-x / AMD-V</td><td>6–8, 11–14</td></tr>
<tr><td>Memory</td><td>guest-virtual → guest-physical → host-physical; nested tables make a TLB miss cost 24 reads</td><td>9</td></tr>
<tr><td>Devices</td><td>emulate old hardware → paravirtual virtio → pass-through with SR-IOV + IOMMU</td><td>15–16</td></tr>
<tr><td>Cloud</td><td>five NIST characteristics, IaaS / PaaS / SaaS; built on virtualization</td><td>10</td></tr>
<tr><td>VMware</td><td>hosted (VMX + driver + VMM, world switch) vs type-1 ESX; live migration</td><td>17–20</td></tr>
<tr><td>Containers</td><td>not VMs: namespaces + cgroups on ONE shared kernel</td><td>4</td></tr>
</tbody>
</table>
<p>Where this connects next. Chapter 8 (multiple processors) explains the multicore hosts these VMs share. Chapter 9 (security) revisits isolation — the walls between VMs are only as strong as the shared hardware, and side-channel attacks such as Spectre and Meltdown (2018) showed that caches leak across them. Chapter 10 (Linux) contains KVM itself, namespaces and cgroups inside the same kernel. In your own work: next time you click "create server", you are asking a hypervisor for a slice of a machine; next time you write <code>docker run</code>, you are asking one kernel for a fenced-off view of itself. Read the papers behind this lesson if you present: Popek and Goldberg (CACM, 1974), Barham et al. (SOSP, 2003), Clark et al. (NSDI, 2005), Bugnion et al. (ACM TOCS, 2012), Agache et al. (NSDI, 2020).</p>`,
        `<p class="y-chinh">🎯 Hết Chương 7: hypervisor là một nhân nhỏ mà các "chương trình" của nó là hệ điều hành; nó phải <strong>an toàn, trung thực và hiệu quả</strong>; nó được dựng từ việc bẫy, viết lại, guest hợp tác hay — ngày nay — hỗ trợ phần cứng của CPU; bộ nhớ và thiết bị được ảo hoá bằng bảng trang lồng và virtio; đám mây biến tất cả thành một dịch vụ có đo đếm và co giãn.</p>
<table>
<thead><tr><th>Ý</th><th>Một câu để nhớ</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Yêu cầu</td><td>An toàn, Trung thực, Hiệu quả; nhạy cảm ⊆ đặc quyền ⇒ trap-and-emulate chạy được</td><td>2, 5</td></tr>
<tr><td>Loại hypervisor</td><td>loại 1 trên phần cứng trần, loại 2 trên HĐH chủ, KVM = chính nhân Linux</td><td>3–4</td></tr>
<tr><td>Vấn đề của x86 và cách sửa</td><td>lệnh nhạy cảm không bẫy ⇒ dịch nhị phân, paravirtualization, rồi VT-x / AMD-V</td><td>6–8, 11–14</td></tr>
<tr><td>Bộ nhớ</td><td>guest-virtual → guest-physical → host-physical; bảng lồng làm một lần TLB hụt tốn 24 lần đọc</td><td>9</td></tr>
<tr><td>Thiết bị</td><td>giả lập phần cứng cũ → virtio paravirtual → chuyển thẳng bằng SR-IOV + IOMMU</td><td>15–16</td></tr>
<tr><td>Đám mây</td><td>năm đặc tính NIST, IaaS / PaaS / SaaS; xây trên ảo hoá</td><td>10</td></tr>
<tr><td>VMware</td><td>hosted (VMX + driver + VMM, world switch) so với ESX loại 1; di trú trực tiếp</td><td>17–20</td></tr>
<tr><td>Container</td><td>không phải VM: namespace + cgroup trên MỘT nhân dùng chung</td><td>4</td></tr>
</tbody>
</table>
<p>Chương này nối tiếp sang đâu. Chương 8 (nhiều bộ xử lý) giải thích các máy chủ đa nhân mà các VM này dùng chung. Chương 9 (bảo mật) xét lại sự cô lập — các bức tường giữa VM chỉ vững bằng phần cứng dùng chung, và các tấn công kênh kề như Spectre và Meltdown (2018) cho thấy bộ đệm rò rỉ xuyên qua chúng. Chương 10 (Linux) chứa chính KVM, namespace và cgroup trong cùng một nhân. Trong công việc của bạn: lần tới bấm "create server", bạn đang xin hypervisor một lát của một cỗ máy; lần tới gõ <code>docker run</code>, bạn đang xin một nhân một góc nhìn được rào lại của chính nó. Nếu thuyết trình, hãy đọc các bài báo đứng sau bài này: Popek và Goldberg (CACM, 1974), Barham và cs. (SOSP, 2003), Clark và cs. (NSDI, 2005), Bugnion và cs. (ACM TOCS, 2012), Agache và cs. (NSDI, 2020).</p>`],
    ]),
    bi(`<h2>🎤 Presentation outline — 20 minutes, for a group of 4–5</h2>
<p>Chapter 7 is an official presentation topic (about 20 minutes per group; ask your lecturer for the current rubric — this outline does not guess the marks). The talk below fits the time, gives every member a speaking part, and keeps one live demonstration that cannot go wrong badly because you also record it.</p>
<table>
<thead><tr><th>Minutes</th><th>Part</th><th>Speaker</th><th>Slides / material from this lesson</th></tr></thead>
<tbody>
<tr><td>0–2</td><td>Hook: "Where does your VPS live?" — one machine, many machines (apartment picture)</td><td>1</td><td>lesson slide 1, demo 1 below</td></tr>
<tr><td>2–6</td><td>Why and what: S-F-E requirements, Popek–Goldberg, type 1 vs type 2 vs KVM</td><td>2</td><td>slides 2–4, picture "Figure 7-1 redrawn"</td></tr>
<tr><td>6–10</td><td>How the CPU is virtualized: trap-and-emulate, why x86 failed, binary translation, paravirtualization, hardware assist</td><td>3</td><td>slides 5–8, 13–14, the two-way table of the simulator</td></tr>
<tr><td>10–13</td><td>Memory and devices: nested page tables (24 reads), virtio, SR-IOV</td><td>4</td><td>slides 9, 15–16</td></tr>
<tr><td>13–16</td><td>The cloud and containers: NIST, IaaS/PaaS/SaaS, namespaces + cgroups, live migration</td><td>5 (or 1)</td><td>slides 10, 4, 20, demo 2</td></tr>
<tr><td>16–18</td><td>Case study: VMware hosted vs ESX; Firecracker today</td><td>2</td><td>slides 17–20</td></tr>
<tr><td>18–20</td><td>Summary table (slide 21) + questions</td><td>all</td><td>slide 21</td></tr>
</tbody>
</table>
<ul>
<li><strong>Demo 1 (1 minute) — whose kernel?</strong> In a terminal: <code>uname -r</code> on your laptop, then <code>docker run --rm alpine uname -r</code>. On Mac or Windows the two differ (the container shows the Linux VM's kernel); on Linux they are equal. Say: "container = same kernel, VM = its own kernel".</li>
<li><strong>Demo 2 (2 minutes) — build a container by hand</strong> on Linux or WSL: <code>sudo unshare --fork --pid --mount-proc --uts bash</code>, then <code>hostname demo; ps -e; hostname</code> in the new shell and <code>hostname</code> outside. Compare the output with slide 4.</li>
<li><strong>Backup:</strong> record both demos as a 30-second screen video and keep screenshots on a slide; a live demo that fails costs more marks than a recorded one that works.</li>
<li><strong>Slide design for an audience that reads English slowly:</strong> one idea per slide, at most six lines, a figure from this lesson instead of a paragraph, English keywords on the slide and Vietnamese explanation spoken. Rehearse once with a timer — most groups run 30% over.</li>
</ul>
<h3>Questions the audience (and lecturer) tend to ask — with short answers</h3>
<table>
<thead><tr><th>Question</th><th>Short answer</th></tr></thead>
<tbody>
<tr><td>Container or VM — what is the difference?</td><td>VM: hypervisor + its own guest kernel, hardware-level wall. Container: one shared kernel, namespaces (what it sees) + cgroups (how much it uses); lighter, faster, weaker wall.</td></tr>
<tr><td>Why did x86 need binary translation?</td><td>Some sensitive instructions (POPF, PUSHF, SGDT…) did not trap outside ring 0, so trap-and-emulate gave wrong results; VMware rewrote the guest kernel's code instead; VT-x / AMD-V (2005–2006) later fixed the CPU.</td></tr>
<tr><td>Is KVM type 1 or type 2?</td><td>Both arguments are valid: it is part of the Linux kernel (type-1-like) but each VM is a Linux process run by QEMU (type-2-like). Say why, and say the book's table lists it as type 2.</td></tr>
<tr><td>Hypercall versus system call?</td><td>A system call: user program → its kernel. A hypercall: guest kernel → hypervisor. Same mechanism (a trapping instruction), one level up.</td></tr>
<tr><td>Why is a TLB miss slower in a VM?</td><td>Two page-table walks: every guest-physical address, including those of the guest's own table, must be translated by the host's table — up to 24 reads for 4 + 4 levels instead of 4.</td></tr>
<tr><td>Is the cloud "just someone else's computer"?</td><td>It is that plus virtualization, automation (self-service API) and metering — the NIST characteristics.</td></tr>
<tr><td>How can live migration pause a VM for only tens of milliseconds?</td><td>Pre-copy: most memory is sent while the VM runs; only the last, small dirty set is sent while it is paused. It fails to converge if the VM dirties memory faster than the link.</td></tr>
<tr><td>Do VMs fully isolate tenants?</td><td>Not perfectly: they share CPU caches and other hardware, and side-channel attacks (Spectre, Meltdown, 2018) crossed the wall; clouds add mitigations and sometimes dedicate hosts.</td></tr>
</tbody>
</table>
<h3>Useful English for the talk</h3>
<ul>
<li>"In this part we will explain how …" · "As you can see on this figure, …" · "The main difference is that …" · "For example, …" · "This is important because …" · "To sum up, …" · "Thank you — we are happy to take questions."</li>
<li>Words to pronounce: <em>hypervisor</em> (HY-per-vy-zer), <em>virtualization</em>, <em>paravirtualization</em>, <em>emulate</em>, <em>privileged</em>, <em>fidelity</em> (fi-DEL-i-ty), <em>namespace</em>, <em>elasticity</em>.</li>
</ul>
<h2>📌 What you can now do</h2>
<ul>
<li>State the three requirements of a hypervisor (safety, fidelity, efficiency) and the Popek–Goldberg condition: sensitive instructions must be privileged.</li>
<li>Draw type 1 and type 2 hypervisors, place ESXi, Xen, Hyper-V, KVM, Workstation and VirtualBox, and explain why KVM is argued about.</li>
<li>Explain trap-and-emulate, why x86 was unvirtualizable (POPF, PUSHF), and how binary translation, paravirtualization (hypercalls, virtio) and hardware support each fix it.</li>
<li>Compute the 24 memory reads of a nested page-table walk and say why huge pages help.</li>
<li>List NIST's five characteristics and map IaaS, PaaS and SaaS to real products; say why a container is not a VM, with a demonstration.</li>
<li>Describe VMware's hosted architecture (VMX, VMM driver, VMM, world switch) and ESX, and explain pre-copy live migration and when it fails to converge.</li>
</ul>`,
    `<h2>🎤 Dàn ý thuyết trình — 20 phút, cho nhóm 4–5 người</h2>
<p>Chương 7 là một chủ đề thuyết trình chính thức (khoảng 20 phút mỗi nhóm; hãy hỏi giảng viên thang chấm hiện hành — dàn ý này không đoán điểm). Bài nói dưới đây vừa thời gian, cho mỗi thành viên một phần nói, và giữ một demo sống mà nếu hỏng cũng không sao vì bạn đã quay sẵn.</p>
<table>
<thead><tr><th>Phút</th><th>Phần</th><th>Người nói</th><th>Slide / tư liệu từ bài này</th></tr></thead>
<tbody>
<tr><td>0–2</td><td>Mở đầu: "VPS của bạn nằm ở đâu?" — một máy, nhiều máy (hình toà chung cư)</td><td>1</td><td>slide 1 của bài, demo 1 bên dưới</td></tr>
<tr><td>2–6</td><td>Vì sao và là gì: yêu cầu S-F-E, Popek–Goldberg, loại 1 và loại 2 và KVM</td><td>2</td><td>slide 2–4, hình "Hình 7-1 vẽ lại"</td></tr>
<tr><td>6–10</td><td>CPU được ảo hoá thế nào: trap-and-emulate, vì sao x86 trượt, dịch nhị phân, paravirtualization, hỗ trợ phần cứng</td><td>3</td><td>slide 5–8, 13–14, bảng hai chiều của bộ mô phỏng</td></tr>
<tr><td>10–13</td><td>Bộ nhớ và thiết bị: bảng trang lồng (24 lần đọc), virtio, SR-IOV</td><td>4</td><td>slide 9, 15–16</td></tr>
<tr><td>13–16</td><td>Đám mây và container: NIST, IaaS/PaaS/SaaS, namespace + cgroup, di trú trực tiếp</td><td>5 (hoặc 1)</td><td>slide 10, 4, 20, demo 2</td></tr>
<tr><td>16–18</td><td>Ca nghiên cứu: VMware hosted so với ESX; Firecracker ngày nay</td><td>2</td><td>slide 17–20</td></tr>
<tr><td>18–20</td><td>Bảng tóm tắt (slide 21) + câu hỏi</td><td>cả nhóm</td><td>slide 21</td></tr>
</tbody>
</table>
<ul>
<li><strong>Demo 1 (1 phút) — nhân của ai?</strong> Trong terminal: <code>uname -r</code> trên laptop, rồi <code>docker run --rm alpine uname -r</code>. Trên Mac hay Windows hai kết quả khác nhau (container hiện nhân của máy ảo Linux); trên Linux thì bằng nhau. Nói: "container = cùng nhân, VM = nhân riêng".</li>
<li><strong>Demo 2 (2 phút) — dựng container bằng tay</strong> trên Linux hay WSL: <code>sudo unshare --fork --pid --mount-proc --uts bash</code>, rồi trong shell mới gõ <code>hostname demo; ps -e; hostname</code> và <code>hostname</code> ở bên ngoài. So kết quả với slide 4.</li>
<li><strong>Dự phòng:</strong> quay cả hai demo thành video màn hình 30 giây và giữ ảnh chụp trên một slide; demo sống bị hỏng mất điểm hơn demo quay sẵn chạy tốt.</li>
<li><strong>Thiết kế slide cho khán giả đọc tiếng Anh chậm:</strong> mỗi slide một ý, tối đa sáu dòng, dùng một hình của bài này thay cho đoạn văn, từ khoá tiếng Anh trên slide còn lời giải thích nói bằng tiếng Việt. Tập thử một lần có bấm giờ — đa số nhóm quá giờ 30%.</li>
</ul>
<h3>Câu hỏi khán giả (và giảng viên) hay hỏi — kèm đáp án ngắn</h3>
<table>
<thead><tr><th>Câu hỏi</th><th>Đáp án ngắn</th></tr></thead>
<tbody>
<tr><td>Container hay VM — khác nhau thế nào?</td><td>VM: hypervisor + nhân guest riêng, bức tường ở mức phần cứng. Container: một nhân dùng chung, namespace (thấy gì) + cgroup (dùng bao nhiêu); nhẹ, nhanh, tường yếu hơn.</td></tr>
<tr><td>Vì sao x86 cần dịch nhị phân?</td><td>Một số lệnh nhạy cảm (POPF, PUSHF, SGDT…) không bẫy ngoài vòng 0, nên trap-and-emulate cho kết quả sai; VMware viết lại mã nhân của guest; VT-x / AMD-V (2005–2006) sau đó sửa chính CPU.</td></tr>
<tr><td>KVM là loại 1 hay loại 2?</td><td>Cả hai lập luận đều đúng: nó là một phần nhân Linux (giống loại 1) nhưng mỗi VM là một tiến trình Linux do QEMU chạy (giống loại 2). Hãy nói vì sao, và nói bảng của sách xếp nó loại 2.</td></tr>
<tr><td>Hypercall so với system call?</td><td>System call: chương trình người dùng → nhân của nó. Hypercall: nhân guest → hypervisor. Cùng cơ chế (một lệnh gây bẫy), lên một tầng.</td></tr>
<tr><td>Vì sao TLB hụt chậm hơn trong VM?</td><td>Hai lần duyệt bảng trang: mọi địa chỉ guest-physical, kể cả của bảng của chính guest, phải được bảng của host dịch — tới 24 lần đọc cho 4 + 4 tầng thay vì 4.</td></tr>
<tr><td>Đám mây có phải "máy tính của người khác"?</td><td>Nó là thế cộng với ảo hoá, tự động hoá (API tự phục vụ) và đo đếm — các đặc tính của NIST.</td></tr>
<tr><td>Sao di trú trực tiếp chỉ dừng VM vài chục mili giây?</td><td>Pre-copy: phần lớn bộ nhớ gửi khi VM chạy; chỉ tập trang bẩn cuối nhỏ xíu được gửi khi nó dừng. Không hội tụ nếu VM làm bẩn bộ nhớ nhanh hơn đường truyền.</td></tr>
<tr><td>VM có cô lập hoàn toàn người thuê không?</td><td>Không hoàn hảo: chúng dùng chung bộ đệm CPU và phần cứng khác, và các tấn công kênh kề (Spectre, Meltdown, 2018) đã vượt tường; đám mây thêm biện pháp giảm nhẹ và đôi khi dành riêng máy chủ.</td></tr>
</tbody>
</table>
<h3>Tiếng Anh hữu ích khi nói</h3>
<ul>
<li>"In this part we will explain how …" (Ở phần này chúng tôi sẽ giải thích …) · "As you can see on this figure, …" (Như bạn thấy trên hình này, …) · "The main difference is that …" (Khác biệt chính là …) · "For example, …" · "This is important because …" · "To sum up, …" (Tóm lại, …) · "Thank you — we are happy to take questions."</li>
<li>Từ cần luyện phát âm: <em>hypervisor</em> (HY-per-vy-zer), <em>virtualization</em>, <em>paravirtualization</em>, <em>emulate</em>, <em>privileged</em>, <em>fidelity</em> (fi-DEL-i-ty), <em>namespace</em>, <em>elasticity</em>.</li>
</ul>
<h2>📌 Bạn đã làm được gì</h2>
<ul>
<li>Nêu ba yêu cầu của hypervisor (an toàn, trung thực, hiệu quả) và điều kiện Popek–Goldberg: lệnh nhạy cảm phải là lệnh đặc quyền.</li>
<li>Vẽ hypervisor loại 1 và loại 2, xếp ESXi, Xen, Hyper-V, KVM, Workstation, VirtualBox vào đúng chỗ, và giải thích vì sao KVM bị tranh cãi.</li>
<li>Giải thích trap-and-emulate, vì sao x86 không ảo hoá được (POPF, PUSHF), và dịch nhị phân, paravirtualization (hypercall, virtio), hỗ trợ phần cứng mỗi thứ sửa nó thế nào.</li>
<li>Tính 24 lần đọc bộ nhớ của một lần duyệt bảng trang lồng và nói vì sao trang lớn giúp ích.</li>
<li>Kể năm đặc tính NIST và gắn IaaS, PaaS, SaaS với sản phẩm thật; nói vì sao container không phải VM, kèm một demo.</li>
<li>Mô tả kiến trúc hosted của VMware (VMX, VMM driver, VMM, world switch) và ESX, và giải thích di trú trực tiếp pre-copy cùng lúc nào nó không hội tụ.</li>
</ul>`),
    books([
      ['mos4', 'Chapter 7 "Virtualization and the Cloud", sections 7.1–7.12, Figures 7-1 to 7-11', 'Chương 7 "Virtualization and the Cloud", mục 7.1–7.12, Hình 7-1 tới 7-11'],
      ['man7', 'namespaces(7), cgroups(7), unshare(1), clone(2)', 'namespaces(7), cgroups(7), unshare(1), clone(2)'],
      ['kernelDocs', 'Documentation/virt/kvm (the KVM API and hypercalls), the virtio driver API guide, arm64/cpu-feature-registers (EL0 MRS emulation)', 'Documentation/virt/kvm (API và hypercall của KVM), hướng dẫn API driver virtio, arm64/cpu-feature-registers (giả lập MRS ở EL0)'],
    ]),
  ].join('\n'),
};

/* ───────── N1.B — 🧪 Practice + 🗂 Glossary + 📌 Summary · Advanced 1: virtualization, containers, nested paging, live migration ───────── */
const L_on_n1 = {
  title: 'N1.B — 🧪 Practice + 🗂 Glossary + 📌 Summary · Advanced 1: virtualization, containers, nested paging, live migration|||N1.B — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Nâng cao 1: ảo hoá, container, bảng trang lồng, di trú trực tiếp',
  slug: 'osg202-on-n1',
  type: 'VIDEO',
  description: '7 bài tập về ảo hoá và đám mây có lời giải chạy thật trên Linux: tính số lần đọc bảng trang lồng và chi phí khi TLB hụt (kèm hình do bộ mô phỏng vẽ), phân loại lệnh đặc quyền và nhạy cảm và xem lệnh nào làm x86 cũ chạy sai, đo lời gọi hệ thống so với vDSO, dùng cgroup giới hạn số tiến trình và nhận ra mình đang ở trong container hay máy ảo, tính overcommit và co giãn của đám mây, tính di trú trực tiếp pre-copy với số liệu mới, và phân loại sản phẩm thật (Docker, VPS, Lambda, Hyper-V, WSL 2…); kèm bảng thuật ngữ Anh–Việt và tóm tắt chương.',
  content: [
    bi(`<span class="eyebrow">Advanced 1 · Lesson N1.B · Practice &amp; review</span>
<h2>Seven exercises: virtualization and the cloud, computed and run</h2>
<p class="lead">The FE asks few questions on this chapter (definitions: hypervisor, hypercall, type 1 and 2, thin client), but it is a presentation topic, and a presenter is asked <em>why</em> and <em>how much</em>. These exercises train both: calculations on new numbers (exercises 1, 5, 6), reasoning about instructions and products (2, 7), and Linux practice that makes the walls of a container and the cost of a trap visible (3, 4). Every number is produced by a simulator or a program. Try each first (the time is a target), then open the solution.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Lesson N1.A slides</th></tr></thead>
<tbody>
<tr><td>1</td><td>nested page-table walk and its average cost</td><td>9</td></tr>
<tr><td>2</td><td>privileged vs sensitive instructions; which ones break old x86</td><td>2, 5, 6, 14</td></tr>
<tr><td>3</td><td>the cost of a system call versus a call that never enters the kernel</td><td>5, 18</td></tr>
<tr><td>4</td><td>limiting a process group with a cgroup; container, VM or bare metal?</td><td>4, 16</td></tr>
<tr><td>5</td><td>overcommit of vCPUs and RAM; elasticity and cost</td><td>10, 15, 20</td></tr>
<tr><td>6</td><td>pre-copy live migration with new numbers</td><td>20</td></tr>
<tr><td>7</td><td>classify real products: type 1 / 2, container, IaaS / PaaS / SaaS</td><td>3–4, 10</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Nâng cao 1 · Bài N1.B · Thực hành &amp; ôn tập</span>
<h2>Bảy bài tập: ảo hoá và đám mây, tính ra và chạy thật</h2>
<p class="lead">FE hỏi ít câu về chương này (định nghĩa: hypervisor, hypercall, loại 1 và 2, thin client), nhưng nó là chủ đề thuyết trình, và người thuyết trình được hỏi <em>vì sao</em> và <em>bao nhiêu</em>. Các bài tập này rèn cả hai: phép tính trên số mới (bài 1, 5, 6), suy luận về lệnh và sản phẩm (2, 7), và thực hành Linux làm hiện ra các bức tường của container và chi phí của một cú bẫy (3, 4). Mọi con số đều do bộ mô phỏng hay chương trình tính ra. Tự làm từng bài trước (thời gian ghi kèm là mục tiêu), rồi mới mở lời giải.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide của bài N1.A</th></tr></thead>
<tbody>
<tr><td>1</td><td>duyệt bảng trang lồng và chi phí trung bình</td><td>9</td></tr>
<tr><td>2</td><td>lệnh đặc quyền với lệnh nhạy cảm; lệnh nào làm x86 cũ hỏng</td><td>2, 5, 6, 14</td></tr>
<tr><td>3</td><td>chi phí của lời gọi hệ thống so với một lời gọi không bao giờ vào nhân</td><td>5, 18</td></tr>
<tr><td>4</td><td>giới hạn một nhóm tiến trình bằng cgroup; container, máy ảo hay máy thật?</td><td>4, 16</td></tr>
<tr><td>5</td><td>overcommit vCPU và RAM; co giãn và chi phí</td><td>10, 15, 20</td></tr>
<tr><td>6</td><td>di trú trực tiếp pre-copy với số liệu mới</td><td>20</td></tr>
<tr><td>7</td><td>phân loại sản phẩm thật: loại 1 / 2, container, IaaS / PaaS / SaaS</td><td>3–4, 10</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — the nested page-table walk (15 min)</h3>
<p>A guest uses 5-level page tables; the host's nested tables have 4 levels. (a) How many page-table entries are read on a worst-case TLB miss, and how many times the native 5-level walk is that? (b) The hypervisor now backs guest memory with 2 MiB host pages, so the host walk has 3 levels (guest still 5): how many reads? (c) A 4 + 4-level VM misses the TLB on 1% of its memory accesses: how many page-table reads per access on average, versus a native 4-level machine?</p>
<details><summary>Solution — drawn by the simulator and computed by a program</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b32d8e237efcb16e7462b5d12c93076bf8296707.svg" alt="Guest 5 levels, host 4 levels: 29 reads (numbers 1–29), then the data access (30)" loading="lazy" /><p class="chu-thich">🧮 Guest 5 levels, host 4 levels: 29 reads (numbers 1–29), then the data access (30)</p></div>
<p>5·4 + 5 + 4 = <strong>29</strong> page-table references (a native 5-level walk needs 5), plus 1 data access.</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">function duyet(n, m) {
  const buoc = [];                                    // { k: tầng guest (1..n+1), j: hàng (1..m+1), loai: 'long' | 'guest' | 'du-lieu' }
  for (let k = 1; k &lt;= n; k++) {
    for (let j = 1; j &lt;= m; j++) buoc.push({ k, j, loai: 'long' });     // đổi địa chỉ bảng tầng k của guest qua host
    buoc.push({ k, j: m + 1, loai: 'guest' });                           // đọc mục bảng tầng k của guest
  }
  for (let j = 1; j &lt;= m; j++) buoc.push({ k: n + 1, j, loai: 'long' }); // đổi địa chỉ trang dữ liệu qua host
  const thamChieu = buoc.length;                                          // = n·m + n + m
  buoc.push({ k: n + 1, j: m + 1, loai: 'du-lieu' });                     // truy cập dữ liệu thật
  return { buoc, thamChieu };
}
const goc = (n) =&gt; n;                                  // duyệt thường (không ảo hoá): n tham chiếu</code></pre></details>
<pre><code class="language-javascript">// Four FE-style calculations for virtualization
// (a) nested page-table walk: n guest levels, m host levels  =&gt;  n*m + n + m page-entry reads
const walk = (n, m) =&gt; n * m + n + m;
for (const [n, m] of [[4, 4], [5, 4], [5, 3], [4, 3], [3, 3]]) console.log(&#96;walk &#36;{n}+&#36;{m} levels: &#36;{walk(n, m)} reads (native &#36;{n}) = &#36;{(walk(n, m) / n).toFixed(2)}x&#96;);
// (b) average extra reads per memory access for a TLB miss rate
for (const miss of [0.001, 0.01, 0.05]) console.log(&#96;TLB miss rate &#36;{miss * 100}%: &#36;{(miss * walk(4, 4)).toFixed(3)} table reads per access in a VM, &#36;{(miss * 4).toFixed(3)} native&#96;);
// (c) overcommit: host with 16 cores and 64 GiB; 12 VMs of 4 vCPU and 20 VMs of 8 GiB? (one fleet of 12 VMs: 4 vCPU, 8 GiB each)
const vms = 12, vcpu = 4, gib = 8, cores = 16, ram = 64;
console.log(&#96;vCPU promised &#36;{vms * vcpu} on &#36;{cores} cores = &#36;{(vms * vcpu / cores).toFixed(1)}:1 ; RAM promised &#36;{vms * gib} GiB on &#36;{ram} GiB = &#36;{(vms * gib / ram).toFixed(2)}:1&#96;);
const idle = 0.4;                                   // if 40% of the promised RAM is idle and the balloon reclaims it
console.log(&#96;RAM really needed if &#36;{idle * 100}% of it is idle: &#36;{(vms * gib * (1 - idle)).toFixed(1)} GiB -&gt; fits in &#36;{ram} GiB: &#36;{vms * gib * (1 - idle) &lt;= ram}&#96;);
// (d) elasticity: a shop needs 10 servers for 3 hours of a flash sale and 2 servers for the other 21 hours
const fixed = 10 * 24, elastic = 10 * 3 + 2 * 21;
console.log(&#96;server-hours per day: fixed for the peak &#36;{fixed}, elastic &#36;{elastic} -&gt; &#36;{(100 * (1 - elastic / fixed)).toFixed(0)}% fewer&#96;);</code></pre>
<div class="out">$ node tinh-ao-hoa.js<br>
walk 4+4 levels: 24 reads (native 4) = 6.00x<br>
walk 5+4 levels: 29 reads (native 5) = 5.80x<br>
walk 5+3 levels: 23 reads (native 5) = 4.60x<br>
walk 4+3 levels: 19 reads (native 4) = 4.75x<br>
walk 3+3 levels: 15 reads (native 3) = 5.00x<br>
TLB miss rate 0.1%: 0.024 table reads per access in a VM, 0.004 native<br>
TLB miss rate 1%: 0.240 table reads per access in a VM, 0.040 native<br>
TLB miss rate 5%: 1.200 table reads per access in a VM, 0.200 native<br>
vCPU promised 48 on 16 cores = 3.0:1 ; RAM promised 96 GiB on 64 GiB = 1.50:1<br>
RAM really needed if 40% of it is idle: 57.6 GiB -&gt; fits in 64 GiB: true<br>
server-hours per day: fixed for the peak 240, elastic 72 -&gt; 70% fewer</div>
<ul>
<li>(a) n·m + n + m = 5·4 + 5 + 4 = <strong>29</strong> reads, versus 5 natively: 5.8 times. The picture shows why: five columns of "translate through the host, then read the guest entry" (5 × 5 = 25) plus the final translation of the data page (4).</li>
<li>(b) 5·3 + 5 + 3 = <strong>23</strong> — a shorter host walk is a gain on every one of the six translations. That is why hypervisors back guest RAM with huge pages.</li>
<li>(c) 0.01 × 24 = <strong>0.24</strong> reads per access in the VM against 0.01 × 4 = 0.04 natively: six times the page-walk traffic, but still a small number because 99% of accesses hit the TLB — the reason virtualized programs are usually only a few percent slower.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 1 — duyệt bảng trang lồng (15 phút)</h3>
<p>Một guest dùng bảng trang 5 tầng; bảng lồng của host có 4 tầng. (a) Một lần TLB hụt xấu nhất đọc bao nhiêu mục bảng trang, và gấp bao nhiêu lần duyệt thường 5 tầng? (b) Hypervisor giờ đỡ bộ nhớ guest bằng trang host 2 MiB, nên phía host chỉ duyệt 3 tầng (guest vẫn 5): bao nhiêu lần đọc? (c) Một VM 4 + 4 tầng hụt TLB ở 1% số lần truy cập bộ nhớ: trung bình mỗi lần truy cập tốn bao nhiêu lần đọc bảng trang, so với máy thật 4 tầng?</p>
<details><summary>Lời giải — bộ mô phỏng vẽ và chương trình tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e29c6ac4b9c999238ad17d74cdbad487f3756073.svg" alt="Guest 5 tầng, host 4 tầng: 29 lần đọc (số 1–29), rồi lần truy cập dữ liệu (30)" loading="lazy" /><p class="chu-thich">🧮 Guest 5 tầng, host 4 tầng: 29 lần đọc (số 1–29), rồi lần truy cập dữ liệu (30)</p></div>
<p>5·4 + 5 + 4 = <strong>29</strong> lần đọc mục bảng trang (duyệt thường 5 tầng chỉ cần 5), cộng 1 lần truy cập dữ liệu.</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">function duyet(n, m) {
  const buoc = [];                                    // { k: tầng guest (1..n+1), j: hàng (1..m+1), loai: 'long' | 'guest' | 'du-lieu' }
  for (let k = 1; k &lt;= n; k++) {
    for (let j = 1; j &lt;= m; j++) buoc.push({ k, j, loai: 'long' });     // đổi địa chỉ bảng tầng k của guest qua host
    buoc.push({ k, j: m + 1, loai: 'guest' });                           // đọc mục bảng tầng k của guest
  }
  for (let j = 1; j &lt;= m; j++) buoc.push({ k: n + 1, j, loai: 'long' }); // đổi địa chỉ trang dữ liệu qua host
  const thamChieu = buoc.length;                                          // = n·m + n + m
  buoc.push({ k: n + 1, j: m + 1, loai: 'du-lieu' });                     // truy cập dữ liệu thật
  return { buoc, thamChieu };
}
const goc = (n) =&gt; n;                                  // duyệt thường (không ảo hoá): n tham chiếu</code></pre></details>
<pre><code class="language-javascript">// Bốn phép tính kiểu FE về ảo hoá
// (a) duyệt bảng trang lồng: n tầng guest, m tầng host =&gt; n*m + n + m lần đọc mục bảng
const walk = (n, m) =&gt; n * m + n + m;
for (const [n, m] of [[4, 4], [5, 4], [5, 3], [4, 3], [3, 3]]) console.log(&#96;walk &#36;{n}+&#36;{m} levels: &#36;{walk(n, m)} reads (native &#36;{n}) = &#36;{(walk(n, m) / n).toFixed(2)}x&#96;);
// (b) số lần đọc bảng trung bình mỗi lần truy cập bộ nhớ theo tỉ lệ TLB hụt
for (const miss of [0.001, 0.01, 0.05]) console.log(&#96;TLB miss rate &#36;{miss * 100}%: &#36;{(miss * walk(4, 4)).toFixed(3)} table reads per access in a VM, &#36;{(miss * 4).toFixed(3)} native&#96;);
// (c) overcommit: máy chủ 16 nhân và 64 GiB; 12 VM, mỗi VM 4 vCPU và 8 GiB
const vms = 12, vcpu = 4, gib = 8, cores = 16, ram = 64;
console.log(&#96;vCPU promised &#36;{vms * vcpu} on &#36;{cores} cores = &#36;{(vms * vcpu / cores).toFixed(1)}:1 ; RAM promised &#36;{vms * gib} GiB on &#36;{ram} GiB = &#36;{(vms * gib / ram).toFixed(2)}:1&#96;);
const idle = 0.4;                                   // nếu 40% RAM đã hứa đang rảnh và balloon thu hồi được
console.log(&#96;RAM really needed if &#36;{idle * 100}% of it is idle: &#36;{(vms * gib * (1 - idle)).toFixed(1)} GiB -&gt; fits in &#36;{ram} GiB: &#36;{vms * gib * (1 - idle) &lt;= ram}&#96;);
// (d) co giãn: một cửa hàng cần 10 máy trong 3 giờ khuyến mãi chớp nhoáng và 2 máy trong 21 giờ còn lại
const fixed = 10 * 24, elastic = 10 * 3 + 2 * 21;
console.log(&#96;server-hours per day: fixed for the peak &#36;{fixed}, elastic &#36;{elastic} -&gt; &#36;{(100 * (1 - elastic / fixed)).toFixed(0)}% fewer&#96;);</code></pre>
<div class="out">$ node tinh-ao-hoa.js<br>
walk 4+4 levels: 24 reads (native 4) = 6.00x<br>
walk 5+4 levels: 29 reads (native 5) = 5.80x<br>
walk 5+3 levels: 23 reads (native 5) = 4.60x<br>
walk 4+3 levels: 19 reads (native 4) = 4.75x<br>
walk 3+3 levels: 15 reads (native 3) = 5.00x<br>
TLB miss rate 0.1%: 0.024 table reads per access in a VM, 0.004 native<br>
TLB miss rate 1%: 0.240 table reads per access in a VM, 0.040 native<br>
TLB miss rate 5%: 1.200 table reads per access in a VM, 0.200 native<br>
vCPU promised 48 on 16 cores = 3.0:1 ; RAM promised 96 GiB on 64 GiB = 1.50:1<br>
RAM really needed if 40% of it is idle: 57.6 GiB -&gt; fits in 64 GiB: true<br>
server-hours per day: fixed for the peak 240, elastic 72 -&gt; 70% fewer</div>
<ul>
<li>(a) n·m + n + m = 5·4 + 5 + 4 = <strong>29</strong> lần đọc, so với 5 trên máy thật: 5,8 lần. Hình cho thấy vì sao: năm cột "dịch qua host rồi đọc mục của guest" (5 × 5 = 25) cộng phép dịch cuối của trang dữ liệu (4).</li>
<li>(b) 5·3 + 5 + 3 = <strong>23</strong> — duyệt phía host ngắn hơn là lợi ở cả sáu phép dịch. Đó là lý do hypervisor đỡ RAM guest bằng trang lớn.</li>
<li>(c) 0,01 × 24 = <strong>0,24</strong> lần đọc mỗi truy cập trong VM so với 0,01 × 4 = 0,04 trên máy thật: lưu lượng duyệt trang gấp sáu lần, nhưng vẫn là con số nhỏ vì 99% truy cập trúng TLB — lý do chương trình ảo hoá thường chỉ chậm vài phần trăm.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 2 — which instructions break trap-and-emulate? (15 min)</h3>
<p>Classify each x86 instruction as <em>privileged</em> (traps outside ring 0), <em>sensitive</em> (reads or changes privileged state or resources), both, or harmless: <code>ADD</code>, <code>CLI</code> (disable interrupts), <code>MOV CR3, reg</code> (load the page-table register), <code>IN</code>/<code>OUT</code> (port I/O), <code>POPF</code>, <code>PUSHF</code>, <code>SGDT</code> (store the descriptor-table register). Which of them make the machine "unvirtualizable" by Popek–Goldberg? Then use the simulator: what does the guest push with <code>PUSHF</code> on the old x86 when its virtual interrupt flag is 0, and what happens with hardware support?</p>
<details><summary>Solution — the three simulator runs</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4bd0e1b6b259129bd02be69c5f739d7c32f48bd8.svg" alt="Old x86, program B (PUSHF with virtual IF = 0): the real flag IF = 1 is pushed — the guest learns a lie" loading="lazy" /><p class="chu-thich">🧮 Old x86, program B (PUSHF with virtual IF = 0): the real flag IF = 1 is pushed — the guest learns a lie</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const NHAY_CAM = new Set(['CLI', 'STI', 'PUSHF', 'POPF']);       // đọc/ghi trạng thái đặc quyền
const DAC_QUYEN = new Set(['CLI', 'STI']);                       // x86 cũ: chỉ hai lệnh này bẫy khi không ở vòng 0
const CT = {
  A: { ifDau: 1, lenh: ['PUSHF', 'CLI', 'ADD', 'POPF'] },
  B: { ifDau: 0, lenh: ['PUSHF'] },
};
function chay(cach, ct) {
  const { ifDau, lenh } = CT[ct];
  let ifAo = ifDau, ifThat = 1, stack = null, bay = 0, goiGS = 0;
  const hang = [];
  for (const l of lenh) {
    let cachChay = 'direct', ghiChu = '';
    const nhay = NHAY_CAM.has(l);
    if (!nhay) { cachChay = 'direct'; }
    else if (cach === 'may-that' || cach === 'vt-x') cachChay = 'native';
    else if (cach === 'dich-nhi-phan') { cachChay = 'rewrite'; goiGS++; }
    else if (cach === 'ly-tuong') { cachChay = 'trap'; bay++; }
    else if (cach === 'x86-cu') cachChay = DAC_QUYEN.has(l) ? 'trap' : 'silent';
    if (cach === 'x86-cu' &amp;&amp; cachChay === 'trap') bay++;
    const emulate = cachChay === 'trap' || cachChay === 'rewrite';
    // tác dụng lên trạng thái
    let truocIf = ifAo;
    if (l === 'CLI') ifAo = 0;
    else if (l === 'STI') ifAo = 1;
    else if (l === 'PUSHF') stack = (cachChay === 'silent') ? ifThat : ifAo;     // x86 cũ: lộ IF THẬT
    else if (l === 'POPF') { if (cachChay !== 'silent') ifAo = stack; }          // x86 cũ: bị bỏ qua
    hang.push({ l, cachChay, ifAo, stack: l === 'PUSHF' ? stack : null, emulate, truocIf });
  }
  return { hang, ifCuoi: ifAo, stack, bay, goiGS };
}
const TEN_CACH = ['may-that', 'ly-tuong', 'x86-cu', 'dich-nhi-phan', 'vt-x'];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3033f93dc095ad3e1aac1ee5cc9f1c97e0932203.svg" alt="With VT-x / AMD-V: no traps for these instructions, and the result is right" loading="lazy" /><p class="chu-thich">🧮 With VT-x / AMD-V: no traps for these instructions, and the result is right</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const NHAY_CAM = new Set(['CLI', 'STI', 'PUSHF', 'POPF']);       // đọc/ghi trạng thái đặc quyền
const DAC_QUYEN = new Set(['CLI', 'STI']);                       // x86 cũ: chỉ hai lệnh này bẫy khi không ở vòng 0
const CT = {
  A: { ifDau: 1, lenh: ['PUSHF', 'CLI', 'ADD', 'POPF'] },
  B: { ifDau: 0, lenh: ['PUSHF'] },
};
function chay(cach, ct) {
  const { ifDau, lenh } = CT[ct];
  let ifAo = ifDau, ifThat = 1, stack = null, bay = 0, goiGS = 0;
  const hang = [];
  for (const l of lenh) {
    let cachChay = 'direct', ghiChu = '';
    const nhay = NHAY_CAM.has(l);
    if (!nhay) { cachChay = 'direct'; }
    else if (cach === 'may-that' || cach === 'vt-x') cachChay = 'native';
    else if (cach === 'dich-nhi-phan') { cachChay = 'rewrite'; goiGS++; }
    else if (cach === 'ly-tuong') { cachChay = 'trap'; bay++; }
    else if (cach === 'x86-cu') cachChay = DAC_QUYEN.has(l) ? 'trap' : 'silent';
    if (cach === 'x86-cu' &amp;&amp; cachChay === 'trap') bay++;
    const emulate = cachChay === 'trap' || cachChay === 'rewrite';
    // tác dụng lên trạng thái
    let truocIf = ifAo;
    if (l === 'CLI') ifAo = 0;
    else if (l === 'STI') ifAo = 1;
    else if (l === 'PUSHF') stack = (cachChay === 'silent') ? ifThat : ifAo;     // x86 cũ: lộ IF THẬT
    else if (l === 'POPF') { if (cachChay !== 'silent') ifAo = stack; }          // x86 cũ: bị bỏ qua
    hang.push({ l, cachChay, ifAo, stack: l === 'PUSHF' ? stack : null, emulate, truocIf });
  }
  return { hang, ifCuoi: ifAo, stack, bay, goiGS };
}
const TEN_CACH = ['may-that', 'ly-tuong', 'x86-cu', 'dich-nhi-phan', 'vt-x'];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5c5691bbfec3fc4ee049c075855c941bdccc88af.svg" alt="Binary translation: the three sensitive instructions become three monitor calls (ADD runs directly)" loading="lazy" /><p class="chu-thich">🧮 Binary translation: the three sensitive instructions become three monitor calls (ADD runs directly)</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const NHAY_CAM = new Set(['CLI', 'STI', 'PUSHF', 'POPF']);       // đọc/ghi trạng thái đặc quyền
const DAC_QUYEN = new Set(['CLI', 'STI']);                       // x86 cũ: chỉ hai lệnh này bẫy khi không ở vòng 0
const CT = {
  A: { ifDau: 1, lenh: ['PUSHF', 'CLI', 'ADD', 'POPF'] },
  B: { ifDau: 0, lenh: ['PUSHF'] },
};
function chay(cach, ct) {
  const { ifDau, lenh } = CT[ct];
  let ifAo = ifDau, ifThat = 1, stack = null, bay = 0, goiGS = 0;
  const hang = [];
  for (const l of lenh) {
    let cachChay = 'direct', ghiChu = '';
    const nhay = NHAY_CAM.has(l);
    if (!nhay) { cachChay = 'direct'; }
    else if (cach === 'may-that' || cach === 'vt-x') cachChay = 'native';
    else if (cach === 'dich-nhi-phan') { cachChay = 'rewrite'; goiGS++; }
    else if (cach === 'ly-tuong') { cachChay = 'trap'; bay++; }
    else if (cach === 'x86-cu') cachChay = DAC_QUYEN.has(l) ? 'trap' : 'silent';
    if (cach === 'x86-cu' &amp;&amp; cachChay === 'trap') bay++;
    const emulate = cachChay === 'trap' || cachChay === 'rewrite';
    // tác dụng lên trạng thái
    let truocIf = ifAo;
    if (l === 'CLI') ifAo = 0;
    else if (l === 'STI') ifAo = 1;
    else if (l === 'PUSHF') stack = (cachChay === 'silent') ? ifThat : ifAo;     // x86 cũ: lộ IF THẬT
    else if (l === 'POPF') { if (cachChay !== 'silent') ifAo = stack; }          // x86 cũ: bị bỏ qua
    hang.push({ l, cachChay, ifAo, stack: l === 'PUSHF' ? stack : null, emulate, truocIf });
  }
  return { hang, ifCuoi: ifAo, stack, bay, goiGS };
}
const TEN_CACH = ['may-that', 'ly-tuong', 'x86-cu', 'dich-nhi-phan', 'vt-x'];</code></pre></details>
<ul>
<li><code>ADD</code> — harmless. <code>CLI</code>, <code>MOV CR3</code>, <code>IN</code>/<code>OUT</code> — privileged <em>and</em> sensitive (they fault outside ring 0 or without I/O privilege): good, trap-and-emulate handles them. <code>POPF</code>, <code>PUSHF</code>, <code>SGDT</code> — sensitive but <strong>not</strong> privileged on the old x86 (no trap, wrong result or leaked real state): these violate the theorem and are the reason for binary translation.</li>
<li>Program B on the old x86: <code>PUSHF</code> pushes the <em>real</em> flags, where the hypervisor keeps IF = 1, although the guest's virtual IF is 0 — the guest would later "restore" interrupts it never had. Compare the first row of the second table with the others.</li>
<li>With hardware support the guest kernel works on its own flags register: 0 traps and the right answer. With binary translation: 0 hardware traps, but one monitor call per sensitive instruction.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 2 — lệnh nào làm hỏng trap-and-emulate? (15 phút)</h3>
<p>Phân loại mỗi lệnh x86 là <em>đặc quyền</em> (bẫy ngoài vòng 0), <em>nhạy cảm</em> (đọc hoặc đổi trạng thái đặc quyền hay tài nguyên), cả hai, hoặc vô hại: <code>ADD</code>, <code>CLI</code> (tắt ngắt), <code>MOV CR3, reg</code> (nạp thanh ghi bảng trang), <code>IN</code>/<code>OUT</code> (I/O qua cổng), <code>POPF</code>, <code>PUSHF</code>, <code>SGDT</code> (lưu thanh ghi bảng mô tả). Lệnh nào làm máy "không ảo hoá được" theo Popek–Goldberg? Rồi dùng bộ mô phỏng: guest đẩy gì bằng <code>PUSHF</code> trên x86 cũ khi cờ ngắt ảo của nó bằng 0, và có hỗ trợ phần cứng thì chuyện gì xảy ra?</p>
<details><summary>Lời giải — ba lần chạy mô phỏng</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/daaa8c7d2817bc84e6aeab9418cd51d8f8f09174.svg" alt="x86 cũ, chương trình B (PUSHF khi IF ảo = 0): cờ IF thật = 1 bị đẩy lên — guest biết một điều sai" loading="lazy" /><p class="chu-thich">🧮 x86 cũ, chương trình B (PUSHF khi IF ảo = 0): cờ IF thật = 1 bị đẩy lên — guest biết một điều sai</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const NHAY_CAM = new Set(['CLI', 'STI', 'PUSHF', 'POPF']);       // đọc/ghi trạng thái đặc quyền
const DAC_QUYEN = new Set(['CLI', 'STI']);                       // x86 cũ: chỉ hai lệnh này bẫy khi không ở vòng 0
const CT = {
  A: { ifDau: 1, lenh: ['PUSHF', 'CLI', 'ADD', 'POPF'] },
  B: { ifDau: 0, lenh: ['PUSHF'] },
};
function chay(cach, ct) {
  const { ifDau, lenh } = CT[ct];
  let ifAo = ifDau, ifThat = 1, stack = null, bay = 0, goiGS = 0;
  const hang = [];
  for (const l of lenh) {
    let cachChay = 'direct', ghiChu = '';
    const nhay = NHAY_CAM.has(l);
    if (!nhay) { cachChay = 'direct'; }
    else if (cach === 'may-that' || cach === 'vt-x') cachChay = 'native';
    else if (cach === 'dich-nhi-phan') { cachChay = 'rewrite'; goiGS++; }
    else if (cach === 'ly-tuong') { cachChay = 'trap'; bay++; }
    else if (cach === 'x86-cu') cachChay = DAC_QUYEN.has(l) ? 'trap' : 'silent';
    if (cach === 'x86-cu' &amp;&amp; cachChay === 'trap') bay++;
    const emulate = cachChay === 'trap' || cachChay === 'rewrite';
    // tác dụng lên trạng thái
    let truocIf = ifAo;
    if (l === 'CLI') ifAo = 0;
    else if (l === 'STI') ifAo = 1;
    else if (l === 'PUSHF') stack = (cachChay === 'silent') ? ifThat : ifAo;     // x86 cũ: lộ IF THẬT
    else if (l === 'POPF') { if (cachChay !== 'silent') ifAo = stack; }          // x86 cũ: bị bỏ qua
    hang.push({ l, cachChay, ifAo, stack: l === 'PUSHF' ? stack : null, emulate, truocIf });
  }
  return { hang, ifCuoi: ifAo, stack, bay, goiGS };
}
const TEN_CACH = ['may-that', 'ly-tuong', 'x86-cu', 'dich-nhi-phan', 'vt-x'];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/dfbbab35430dde27ae17ffb2fb204edce8c5b2dc.svg" alt="Có VT-x / AMD-V: các lệnh này không bẫy, và kết quả đúng" loading="lazy" /><p class="chu-thich">🧮 Có VT-x / AMD-V: các lệnh này không bẫy, và kết quả đúng</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const NHAY_CAM = new Set(['CLI', 'STI', 'PUSHF', 'POPF']);       // đọc/ghi trạng thái đặc quyền
const DAC_QUYEN = new Set(['CLI', 'STI']);                       // x86 cũ: chỉ hai lệnh này bẫy khi không ở vòng 0
const CT = {
  A: { ifDau: 1, lenh: ['PUSHF', 'CLI', 'ADD', 'POPF'] },
  B: { ifDau: 0, lenh: ['PUSHF'] },
};
function chay(cach, ct) {
  const { ifDau, lenh } = CT[ct];
  let ifAo = ifDau, ifThat = 1, stack = null, bay = 0, goiGS = 0;
  const hang = [];
  for (const l of lenh) {
    let cachChay = 'direct', ghiChu = '';
    const nhay = NHAY_CAM.has(l);
    if (!nhay) { cachChay = 'direct'; }
    else if (cach === 'may-that' || cach === 'vt-x') cachChay = 'native';
    else if (cach === 'dich-nhi-phan') { cachChay = 'rewrite'; goiGS++; }
    else if (cach === 'ly-tuong') { cachChay = 'trap'; bay++; }
    else if (cach === 'x86-cu') cachChay = DAC_QUYEN.has(l) ? 'trap' : 'silent';
    if (cach === 'x86-cu' &amp;&amp; cachChay === 'trap') bay++;
    const emulate = cachChay === 'trap' || cachChay === 'rewrite';
    // tác dụng lên trạng thái
    let truocIf = ifAo;
    if (l === 'CLI') ifAo = 0;
    else if (l === 'STI') ifAo = 1;
    else if (l === 'PUSHF') stack = (cachChay === 'silent') ? ifThat : ifAo;     // x86 cũ: lộ IF THẬT
    else if (l === 'POPF') { if (cachChay !== 'silent') ifAo = stack; }          // x86 cũ: bị bỏ qua
    hang.push({ l, cachChay, ifAo, stack: l === 'PUSHF' ? stack : null, emulate, truocIf });
  }
  return { hang, ifCuoi: ifAo, stack, bay, goiGS };
}
const TEN_CACH = ['may-that', 'ly-tuong', 'x86-cu', 'dich-nhi-phan', 'vt-x'];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/bd3e2519f71fcfc14e9636ea16b3c8ff0364be40.svg" alt="Dịch nhị phân: ba lệnh nhạy cảm thành ba lời gọi giám sát (ADD chạy thẳng)" loading="lazy" /><p class="chu-thich">🧮 Dịch nhị phân: ba lệnh nhạy cảm thành ba lời gọi giám sát (ADD chạy thẳng)</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const NHAY_CAM = new Set(['CLI', 'STI', 'PUSHF', 'POPF']);       // đọc/ghi trạng thái đặc quyền
const DAC_QUYEN = new Set(['CLI', 'STI']);                       // x86 cũ: chỉ hai lệnh này bẫy khi không ở vòng 0
const CT = {
  A: { ifDau: 1, lenh: ['PUSHF', 'CLI', 'ADD', 'POPF'] },
  B: { ifDau: 0, lenh: ['PUSHF'] },
};
function chay(cach, ct) {
  const { ifDau, lenh } = CT[ct];
  let ifAo = ifDau, ifThat = 1, stack = null, bay = 0, goiGS = 0;
  const hang = [];
  for (const l of lenh) {
    let cachChay = 'direct', ghiChu = '';
    const nhay = NHAY_CAM.has(l);
    if (!nhay) { cachChay = 'direct'; }
    else if (cach === 'may-that' || cach === 'vt-x') cachChay = 'native';
    else if (cach === 'dich-nhi-phan') { cachChay = 'rewrite'; goiGS++; }
    else if (cach === 'ly-tuong') { cachChay = 'trap'; bay++; }
    else if (cach === 'x86-cu') cachChay = DAC_QUYEN.has(l) ? 'trap' : 'silent';
    if (cach === 'x86-cu' &amp;&amp; cachChay === 'trap') bay++;
    const emulate = cachChay === 'trap' || cachChay === 'rewrite';
    // tác dụng lên trạng thái
    let truocIf = ifAo;
    if (l === 'CLI') ifAo = 0;
    else if (l === 'STI') ifAo = 1;
    else if (l === 'PUSHF') stack = (cachChay === 'silent') ? ifThat : ifAo;     // x86 cũ: lộ IF THẬT
    else if (l === 'POPF') { if (cachChay !== 'silent') ifAo = stack; }          // x86 cũ: bị bỏ qua
    hang.push({ l, cachChay, ifAo, stack: l === 'PUSHF' ? stack : null, emulate, truocIf });
  }
  return { hang, ifCuoi: ifAo, stack, bay, goiGS };
}
const TEN_CACH = ['may-that', 'ly-tuong', 'x86-cu', 'dich-nhi-phan', 'vt-x'];</code></pre></details>
<ul>
<li><code>ADD</code> — vô hại. <code>CLI</code>, <code>MOV CR3</code>, <code>IN</code>/<code>OUT</code> — vừa đặc quyền <em>vừa</em> nhạy cảm (gây lỗi ngoài vòng 0 hay khi không có đặc quyền I/O): tốt, trap-and-emulate xử lý được. <code>POPF</code>, <code>PUSHF</code>, <code>SGDT</code> — nhạy cảm nhưng <strong>không</strong> đặc quyền trên x86 cũ (không bẫy, kết quả sai hoặc lộ trạng thái thật): chúng vi phạm định lý và là lý do có dịch nhị phân.</li>
<li>Chương trình B trên x86 cũ: <code>PUSHF</code> đẩy cờ <em>thật</em>, nơi hypervisor giữ IF = 1, dù IF ảo của guest bằng 0 — guest sau đó sẽ "khôi phục" ngắt mà nó chưa từng có. So hàng đầu của bảng thứ hai với các hàng khác.</li>
<li>Có hỗ trợ phần cứng, nhân guest làm việc trên thanh ghi cờ của riêng nó: 0 cú bẫy và đáp án đúng. Với dịch nhị phân: 0 cú bẫy phần cứng, nhưng mỗi lệnh nhạy cảm là một lời gọi giám sát.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 3 — a "call" that never enters the kernel (10 min)</h3>
<p>Time <code>clock_gettime</code> a million times in two ways: through libc, and forced through the system-call gate with <code>syscall(SYS_clock_gettime, …)</code>. (a) Which is faster and by roughly what factor? (b) How can a "system call" avoid entering the kernel at all? (c) What does this have to do with virtualization?</p>
<details><summary>Solution — measured on this machine</summary>
<pre><code class="language-c">// Some "calls" never enter the kernel: the vDSO
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/syscall.h&gt;

static double now_ns(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t); return t.tv_sec * 1e9 + t.tv_nsec; }

int main(void) {
    const int N = 1000000;
    struct timespec ts;
    double t0 = now_ns();
    for (int i = 0; i &lt; N; i++) clock_gettime(CLOCK_REALTIME, &amp;ts);               // libc: reads a page the kernel maps into the process
    double t1 = now_ns();
    for (int i = 0; i &lt; N; i++) syscall(SYS_clock_gettime, CLOCK_REALTIME, &amp;ts);  // forced through the system-call gate
    double t2 = now_ns();
    printf("clock_gettime via the vDSO        %4.0f ns per call\\n", (t1 - t0) / N);
    printf("clock_gettime as a real system call %4.0f ns per call\\n", (t2 - t1) / N);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread vdso.c -o vdso &amp;&amp; ./vdso<br>
clock_gettime via the vDSO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;78 ns per call<br>
clock_gettime as a real system call &nbsp;392 ns per call</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<ul>
<li>(a) The libc call is several times faster (one run on one machine: the system call costs about 5 times more; the number varies, the order does not).</li>
<li>(b) The kernel maps a small page of code and data, the <strong>vDSO</strong>, into every process. <code>clock_gettime</code> in libc reads the time from that page with ordinary instructions — no trap. Only the forced <code>syscall(…)</code> pays the mode switch measured in lesson N1.A, slide 5.</li>
<li>(c) Same strategy as the whole chapter: <em>make the common case avoid the expensive crossing</em>. Direct execution keeps user code from trapping; paravirtual clocks and virtio batches keep guests from exiting to the hypervisor; the vDSO keeps programs from entering the kernel. Remember the ladder of costs: plain call ≪ system call ≈ trapped instruction ≪ VM exit ≪ world switch.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 3 — một "lời gọi" không bao giờ vào nhân (10 phút)</h3>
<p>Đo <code>clock_gettime</code> một triệu lần theo hai cách: qua libc, và ép đi qua cổng lời gọi hệ thống bằng <code>syscall(SYS_clock_gettime, …)</code>. (a) Cách nào nhanh hơn và khoảng bao nhiêu lần? (b) Làm sao một "lời gọi hệ thống" tránh được việc vào nhân? (c) Việc này liên quan gì tới ảo hoá?</p>
<details><summary>Lời giải — đo trên máy này</summary>
<pre><code class="language-c">// Có những "lời gọi" không bao giờ vào nhân: vDSO
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/syscall.h&gt;

static double now_ns(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t); return t.tv_sec * 1e9 + t.tv_nsec; }

int main(void) {
    const int N = 1000000;
    struct timespec ts;
    double t0 = now_ns();
    for (int i = 0; i &lt; N; i++) clock_gettime(CLOCK_REALTIME, &amp;ts);               // libc: đọc một trang mà nhân ánh xạ vào tiến trình
    double t1 = now_ns();
    for (int i = 0; i &lt; N; i++) syscall(SYS_clock_gettime, CLOCK_REALTIME, &amp;ts);  // ép đi qua cổng lời gọi hệ thống
    double t2 = now_ns();
    printf("clock_gettime via the vDSO        %4.0f ns per call\\n", (t1 - t0) / N);
    printf("clock_gettime as a real system call %4.0f ns per call\\n", (t2 - t1) / N);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread vdso.c -o vdso &amp;&amp; ./vdso<br>
clock_gettime via the vDSO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;78 ns per call<br>
clock_gettime as a real system call &nbsp;392 ns per call</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<ul>
<li>(a) Lời gọi qua libc nhanh hơn nhiều lần (một lần chạy trên một máy: lời gọi hệ thống tốn gấp khoảng 5 lần; con số thay đổi, bậc độ lớn thì không).</li>
<li>(b) Nhân ánh xạ một trang nhỏ chứa mã và dữ liệu, <strong>vDSO</strong>, vào mọi tiến trình. <code>clock_gettime</code> trong libc đọc giờ từ trang đó bằng lệnh thường — không bẫy. Chỉ <code>syscall(…)</code> ép buộc mới trả chi phí đổi chế độ đã đo ở bài N1.A, slide 5.</li>
<li>(c) Cùng chiến lược của cả chương: <em>làm cho trường hợp phổ biến tránh được cú băng qua đắt đỏ</em>. Thực thi trực tiếp giữ mã người dùng khỏi bẫy; đồng hồ paravirtual và các mẻ virtio giữ guest khỏi thoát ra hypervisor; vDSO giữ chương trình khỏi vào nhân. Nhớ nấc thang chi phí: lời gọi hàm thường ≪ lời gọi hệ thống ≈ lệnh bị bẫy ≪ VM exit ≪ world switch.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 4 — fence a process group, then ask "where am I?" (20 min)</h3>
<p>(a) Create a cgroup that allows at most <strong>4</strong> processes, enter it, and try to <code>fork()</code> eight children. How many succeed, and where does the kernel record the refusals? (b) Write a few commands that decide, from inside, whether the shell is in a container and whether it runs on virtual hardware. How reliable is such a verdict?</p>
<details><summary>Solution — run in the container (root, --privileged)</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># A cgroup can limit the NUMBER of processes (stops a fork bomb from taking the whole machine)<br>
$ gcc -o /tmp/fork-nhieu _fork-nhieu.c<br>
$ mkdir /sys/fs/cgroup/init &amp;&amp; echo $$ &gt; /sys/fs/cgroup/init/cgroup.procs<br>
$ echo "+pids" &gt; /sys/fs/cgroup/cgroup.subtree_control<br>
$ mkdir /sys/fs/cgroup/nho &amp;&amp; echo 4 &gt; /sys/fs/cgroup/nho/pids.max<br>
$ echo "pids.max = $(cat /sys/fs/cgroup/nho/pids.max)"<br>
pids.max = 4<br>
# Enter the group, then try to fork 8 children (the program itself counts as 1)<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/nho/cgroup.procs; exec /tmp/fork-nhieu'<br>
fork #4 refused: Resource temporarily unavailable<br>
fork #5 refused: Resource temporarily unavailable<br>
fork #6 refused: Resource temporarily unavailable<br>
fork #7 refused: Resource temporarily unavailable<br>
fork #8 refused: Resource temporarily unavailable<br>
forked 3 of 8<br>
$ grep -E "^max" /sys/fs/cgroup/nho/pids.events | sed 's/^max/refusals: max/'<br>
refusals: max 5</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The program counts as one of the four allowed processes, so <strong>3</strong> forks succeed and the 4th to 8th get <code>EAGAIN</code> ("Resource temporarily unavailable"); the kernel counts them in <code>pids.events</code> (<code>max 5</code>). That is the cgroup defence against a fork bomb — only that group is hurt, not the machine.</p>
<div class="out"># Where am I running? Four clues, then a verdict<br>
$ [ -f /.dockerenv ] &amp;&amp; c1=yes || c1=no; echo "1. /.dockerenv exists (Docker's marker file): $c1"<br>
1. /.dockerenv exists (Docker's marker file): yes<br>
$ c2=$(grep -c -E "docker|kubepods|containerd" /proc/1/cgroup); echo "2. /proc/1/cgroup mentions a container runtime: $c2 line(s) ($(cat /proc/1/cgroup))"<br>
2. /proc/1/cgroup mentions a container runtime: 0 line(s) (0::/)<br>
$ v=$(ls /sys/bus/virtio/devices 2&gt;/dev/null | wc -l); echo "3. virtio devices (paravirtual hardware): $v"<br>
3. virtio devices (paravirtual hardware): 13<br>
$ h=$(grep -c -w hypervisor /proc/cpuinfo); echo "4. CPU hypervisor flag (x86 only): $h"<br>
4. CPU hypervisor flag (x86 only): 0<br>
$ if [ "$c1" = yes ] || [ "$(cat /proc/self/cgroup)" = "0::/" ]; then k="a container"; else k="not a container (or an unmarked one)"; fi<br>
$ if [ "$v" -gt 0 ] || [ "$h" -gt 0 ]; then m="on virtual hardware (a virtual machine)"; else m="on bare metal as far as these clues go"; fi<br>
$ echo "verdict: $k, $m"<br>
verdict: a container, on virtual hardware (a virtual machine)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Four clues: Docker's marker file <code>/.dockerenv</code>; a cgroup path that is just <code>/</code> (the container's own cgroup namespace); virtio devices (paravirtual hardware); and, on x86, the CPUID <code>hypervisor</code> flag. Here the verdict is "a container, on virtual hardware" — correct. These are <strong>heuristics, not proofs</strong>: another runtime may not create <code>/.dockerenv</code>, a hypervisor can hide its flag, and a hostile guest can fake all of them. For a security decision, never trust what the guest says about itself.</p>
</details>`,
    `<h3>🧪 Bài 4 — rào một nhóm tiến trình, rồi hỏi "tôi đang ở đâu?" (20 phút)</h3>
<p>(a) Tạo một cgroup cho phép tối đa <strong>4</strong> tiến trình, vào nhóm đó, và thử <code>fork()</code> tám tiến trình con. Bao nhiêu cái thành công, và nhân ghi các lần từ chối ở đâu? (b) Viết vài lệnh quyết định, từ bên trong, shell có ở trong container không và có chạy trên phần cứng ảo không. Kết luận như vậy đáng tin tới đâu?</p>
<details><summary>Lời giải — chạy trong container (root, --privileged)</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Một cgroup có thể giới hạn SỐ tiến trình (chặn bom fork chiếm cả máy)<br>
$ gcc -o /tmp/fork-nhieu _fork-nhieu.c<br>
$ mkdir /sys/fs/cgroup/init &amp;&amp; echo $$ &gt; /sys/fs/cgroup/init/cgroup.procs<br>
$ echo "+pids" &gt; /sys/fs/cgroup/cgroup.subtree_control<br>
$ mkdir /sys/fs/cgroup/nho &amp;&amp; echo 4 &gt; /sys/fs/cgroup/nho/pids.max<br>
$ echo "pids.max = $(cat /sys/fs/cgroup/nho/pids.max)"<br>
pids.max = 4<br>
# Vào nhóm, rồi thử fork 8 tiến trình con (bản thân chương trình tính là 1)<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/nho/cgroup.procs; exec /tmp/fork-nhieu'<br>
fork #4 refused: Resource temporarily unavailable<br>
fork #5 refused: Resource temporarily unavailable<br>
fork #6 refused: Resource temporarily unavailable<br>
fork #7 refused: Resource temporarily unavailable<br>
fork #8 refused: Resource temporarily unavailable<br>
forked 3 of 8<br>
$ grep -E "^max" /sys/fs/cgroup/nho/pids.events | sed 's/^max/refusals: max/'<br>
refusals: max 5</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Bản thân chương trình tính là một trong bốn tiến trình được phép, nên <strong>3</strong> lần fork thành công và các lần 4 đến 8 nhận <code>EAGAIN</code> ("Resource temporarily unavailable"); nhân đếm chúng trong <code>pids.events</code> (<code>max 5</code>). Đó là cách cgroup chặn bom fork — chỉ nhóm đó bị hại, không phải cả máy.</p>
<div class="out"># Tôi đang chạy ở đâu? Bốn manh mối, rồi kết luận<br>
$ [ -f /.dockerenv ] &amp;&amp; c1=yes || c1=no; echo "1. /.dockerenv exists (Docker's marker file): $c1"<br>
1. /.dockerenv exists (Docker's marker file): yes<br>
$ c2=$(grep -c -E "docker|kubepods|containerd" /proc/1/cgroup); echo "2. /proc/1/cgroup mentions a container runtime: $c2 line(s) ($(cat /proc/1/cgroup))"<br>
2. /proc/1/cgroup mentions a container runtime: 0 line(s) (0::/)<br>
$ v=$(ls /sys/bus/virtio/devices 2&gt;/dev/null | wc -l); echo "3. virtio devices (paravirtual hardware): $v"<br>
3. virtio devices (paravirtual hardware): 13<br>
$ h=$(grep -c -w hypervisor /proc/cpuinfo); echo "4. CPU hypervisor flag (x86 only): $h"<br>
4. CPU hypervisor flag (x86 only): 0<br>
$ if [ "$c1" = yes ] || [ "$(cat /proc/self/cgroup)" = "0::/" ]; then k="a container"; else k="not a container (or an unmarked one)"; fi<br>
$ if [ "$v" -gt 0 ] || [ "$h" -gt 0 ]; then m="on virtual hardware (a virtual machine)"; else m="on bare metal as far as these clues go"; fi<br>
$ echo "verdict: $k, $m"<br>
verdict: a container, on virtual hardware (a virtual machine)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Bốn manh mối: tệp đánh dấu của Docker <code>/.dockerenv</code>; đường cgroup chỉ là <code>/</code> (cgroup namespace riêng của container); các thiết bị virtio (phần cứng paravirtual); và, trên x86, cờ <code>hypervisor</code> của CPUID. Ở đây kết luận là "một container, trên phần cứng ảo" — đúng. Đây là <strong>suy đoán, không phải chứng minh</strong>: runtime khác có thể không tạo <code>/.dockerenv</code>, hypervisor có thể giấu cờ của nó, và một guest thù địch có thể làm giả tất cả. Với quyết định bảo mật, đừng bao giờ tin những gì guest nói về chính nó.</p>
</details>`),
    bi(`<h3>🧪 Exercise 5 — overcommit and elasticity (15 min)</h3>
<p>A host has 16 cores and 64 GiB of RAM. It runs 12 VMs of 4 vCPUs and 8 GiB each. (a) What are the vCPU and RAM overcommit ratios? (b) If 40% of the promised RAM is idle and ballooning can reclaim it, does the real demand fit? (c) A shop needs 10 servers for a 3-hour flash sale and 2 for the other 21 hours of a day. How many server-hours per day does an elastic cloud bill, compared with servers bought for the peak?</p>
<details><summary>Solution — computed by a program</summary>
<pre><code class="language-javascript">// Four FE-style calculations for virtualization
// (a) nested page-table walk: n guest levels, m host levels  =&gt;  n*m + n + m page-entry reads
const walk = (n, m) =&gt; n * m + n + m;
for (const [n, m] of [[4, 4], [5, 4], [5, 3], [4, 3], [3, 3]]) console.log(&#96;walk &#36;{n}+&#36;{m} levels: &#36;{walk(n, m)} reads (native &#36;{n}) = &#36;{(walk(n, m) / n).toFixed(2)}x&#96;);
// (b) average extra reads per memory access for a TLB miss rate
for (const miss of [0.001, 0.01, 0.05]) console.log(&#96;TLB miss rate &#36;{miss * 100}%: &#36;{(miss * walk(4, 4)).toFixed(3)} table reads per access in a VM, &#36;{(miss * 4).toFixed(3)} native&#96;);
// (c) overcommit: host with 16 cores and 64 GiB; 12 VMs of 4 vCPU and 20 VMs of 8 GiB? (one fleet of 12 VMs: 4 vCPU, 8 GiB each)
const vms = 12, vcpu = 4, gib = 8, cores = 16, ram = 64;
console.log(&#96;vCPU promised &#36;{vms * vcpu} on &#36;{cores} cores = &#36;{(vms * vcpu / cores).toFixed(1)}:1 ; RAM promised &#36;{vms * gib} GiB on &#36;{ram} GiB = &#36;{(vms * gib / ram).toFixed(2)}:1&#96;);
const idle = 0.4;                                   // if 40% of the promised RAM is idle and the balloon reclaims it
console.log(&#96;RAM really needed if &#36;{idle * 100}% of it is idle: &#36;{(vms * gib * (1 - idle)).toFixed(1)} GiB -&gt; fits in &#36;{ram} GiB: &#36;{vms * gib * (1 - idle) &lt;= ram}&#96;);
// (d) elasticity: a shop needs 10 servers for 3 hours of a flash sale and 2 servers for the other 21 hours
const fixed = 10 * 24, elastic = 10 * 3 + 2 * 21;
console.log(&#96;server-hours per day: fixed for the peak &#36;{fixed}, elastic &#36;{elastic} -&gt; &#36;{(100 * (1 - elastic / fixed)).toFixed(0)}% fewer&#96;);</code></pre>
<div class="out">$ node tinh-ao-hoa.js<br>
walk 4+4 levels: 24 reads (native 4) = 6.00x<br>
walk 5+4 levels: 29 reads (native 5) = 5.80x<br>
walk 5+3 levels: 23 reads (native 5) = 4.60x<br>
walk 4+3 levels: 19 reads (native 4) = 4.75x<br>
walk 3+3 levels: 15 reads (native 3) = 5.00x<br>
TLB miss rate 0.1%: 0.024 table reads per access in a VM, 0.004 native<br>
TLB miss rate 1%: 0.240 table reads per access in a VM, 0.040 native<br>
TLB miss rate 5%: 1.200 table reads per access in a VM, 0.200 native<br>
vCPU promised 48 on 16 cores = 3.0:1 ; RAM promised 96 GiB on 64 GiB = 1.50:1<br>
RAM really needed if 40% of it is idle: 57.6 GiB -&gt; fits in 64 GiB: true<br>
server-hours per day: fixed for the peak 240, elastic 72 -&gt; 70% fewer</div>
<ul>
<li>(a) 12 × 4 = 48 vCPUs on 16 cores = <strong>3 : 1</strong>; 12 × 8 = 96 GiB on 64 GiB = <strong>1.5 : 1</strong>. Overcommit is normal: most VMs are idle most of the time — but if all of them demand their share at once, the host must make someone wait (CPU) or swap (RAM).</li>
<li>(b) 96 × 0.6 = <strong>57.6 GiB</strong>, which fits in 64 GiB — as long as the balloon drivers (slide 20) can take the idle pages back in time.</li>
<li>(c) Peak-sized: 10 × 24 = 240 server-hours; elastic: 10 × 3 + 2 × 21 = <strong>72</strong>, 70% fewer — the economic meaning of "rapid elasticity" and "measured service".</li>
</ul>
</details>`,
    `<h3>🧪 Bài 5 — overcommit và co giãn (15 phút)</h3>
<p>Một máy chủ có 16 nhân và 64 GiB RAM. Nó chạy 12 VM, mỗi VM 4 vCPU và 8 GiB. (a) Tỉ lệ overcommit vCPU và RAM là bao nhiêu? (b) Nếu 40% RAM đã hứa đang rảnh và ballooning thu hồi được, nhu cầu thật có vừa không? (c) Một cửa hàng cần 10 máy cho đợt khuyến mãi chớp nhoáng 3 giờ và 2 máy cho 21 giờ còn lại của ngày. Đám mây co giãn tính bao nhiêu server-giờ mỗi ngày, so với mua máy theo đỉnh?</p>
<details><summary>Lời giải — chương trình tính</summary>
<pre><code class="language-javascript">// Bốn phép tính kiểu FE về ảo hoá
// (a) duyệt bảng trang lồng: n tầng guest, m tầng host =&gt; n*m + n + m lần đọc mục bảng
const walk = (n, m) =&gt; n * m + n + m;
for (const [n, m] of [[4, 4], [5, 4], [5, 3], [4, 3], [3, 3]]) console.log(&#96;walk &#36;{n}+&#36;{m} levels: &#36;{walk(n, m)} reads (native &#36;{n}) = &#36;{(walk(n, m) / n).toFixed(2)}x&#96;);
// (b) số lần đọc bảng trung bình mỗi lần truy cập bộ nhớ theo tỉ lệ TLB hụt
for (const miss of [0.001, 0.01, 0.05]) console.log(&#96;TLB miss rate &#36;{miss * 100}%: &#36;{(miss * walk(4, 4)).toFixed(3)} table reads per access in a VM, &#36;{(miss * 4).toFixed(3)} native&#96;);
// (c) overcommit: máy chủ 16 nhân và 64 GiB; 12 VM, mỗi VM 4 vCPU và 8 GiB
const vms = 12, vcpu = 4, gib = 8, cores = 16, ram = 64;
console.log(&#96;vCPU promised &#36;{vms * vcpu} on &#36;{cores} cores = &#36;{(vms * vcpu / cores).toFixed(1)}:1 ; RAM promised &#36;{vms * gib} GiB on &#36;{ram} GiB = &#36;{(vms * gib / ram).toFixed(2)}:1&#96;);
const idle = 0.4;                                   // nếu 40% RAM đã hứa đang rảnh và balloon thu hồi được
console.log(&#96;RAM really needed if &#36;{idle * 100}% of it is idle: &#36;{(vms * gib * (1 - idle)).toFixed(1)} GiB -&gt; fits in &#36;{ram} GiB: &#36;{vms * gib * (1 - idle) &lt;= ram}&#96;);
// (d) co giãn: một cửa hàng cần 10 máy trong 3 giờ khuyến mãi chớp nhoáng và 2 máy trong 21 giờ còn lại
const fixed = 10 * 24, elastic = 10 * 3 + 2 * 21;
console.log(&#96;server-hours per day: fixed for the peak &#36;{fixed}, elastic &#36;{elastic} -&gt; &#36;{(100 * (1 - elastic / fixed)).toFixed(0)}% fewer&#96;);</code></pre>
<div class="out">$ node tinh-ao-hoa.js<br>
walk 4+4 levels: 24 reads (native 4) = 6.00x<br>
walk 5+4 levels: 29 reads (native 5) = 5.80x<br>
walk 5+3 levels: 23 reads (native 5) = 4.60x<br>
walk 4+3 levels: 19 reads (native 4) = 4.75x<br>
walk 3+3 levels: 15 reads (native 3) = 5.00x<br>
TLB miss rate 0.1%: 0.024 table reads per access in a VM, 0.004 native<br>
TLB miss rate 1%: 0.240 table reads per access in a VM, 0.040 native<br>
TLB miss rate 5%: 1.200 table reads per access in a VM, 0.200 native<br>
vCPU promised 48 on 16 cores = 3.0:1 ; RAM promised 96 GiB on 64 GiB = 1.50:1<br>
RAM really needed if 40% of it is idle: 57.6 GiB -&gt; fits in 64 GiB: true<br>
server-hours per day: fixed for the peak 240, elastic 72 -&gt; 70% fewer</div>
<ul>
<li>(a) 12 × 4 = 48 vCPU trên 16 nhân = <strong>3 : 1</strong>; 12 × 8 = 96 GiB trên 64 GiB = <strong>1,5 : 1</strong>. Overcommit là bình thường: đa số VM rảnh phần lớn thời gian — nhưng nếu tất cả cùng đòi phần của mình một lúc, máy chủ phải bắt ai đó chờ (CPU) hay swap (RAM).</li>
<li>(b) 96 × 0,6 = <strong>57,6 GiB</strong>, vừa trong 64 GiB — miễn là các driver balloon (slide 20) thu hồi được trang rảnh kịp lúc.</li>
<li>(c) Theo đỉnh: 10 × 24 = 240 server-giờ; co giãn: 10 × 3 + 2 × 21 = <strong>72</strong>, ít hơn 70% — ý nghĩa kinh tế của "co giãn nhanh" và "dịch vụ có đo đếm".</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 6 — pre-copy live migration on new numbers (20 min)</h3>
<p>A 16 GiB (16384 MiB) VM is migrated; stop the VM when the remaining dirty memory can be sent in 50 ms. (a) Link 2000 MiB/s, dirty rate 500 MiB/s: how many rounds and what downtime? (b) The link is only 600 MiB/s: what happens? (c) What is the smallest link speed (steps of 50 MiB/s) that converges within 10 rounds, and what is the ratio dirty rate ÷ link then?</p>
<details><summary>Solution — computed by a program</summary>
<pre><code class="language-javascript">// Pre-copy live migration: your own numbers
function preCopy(memMiB, link, dirty, stopMs, maxRounds = 30) {
  let todo = memMiB, t = 0, sent = 0, rounds = 0;
  while (rounds &lt; maxRounds) {
    rounds++;
    const sec = todo / link;
    if (sec * 1000 &lt;= stopMs) return { ok: true, rounds, downtimeMs: sec * 1000, totalSec: t + sec, sent: sent + todo };
    sent += todo; t += sec; todo = Math.min(memMiB, dirty * sec);
  }
  return { ok: false, rounds, downtimeMs: (todo / link) * 1000, totalSec: t, sent };
}
const show = (name, r) =&gt; console.log(&#96;&#36;{name}: &#36;{r.ok ? 'converges' : 'NO convergence'} after &#36;{r.rounds} round(s), downtime &#36;{r.downtimeMs.toFixed(0)} ms, total &#36;{r.totalSec.toFixed(1)} s, sent &#36;{r.sent.toFixed(0)} MiB&#96;);
// (a) 16 GiB VM, 2000 MiB/s link, dirty rate 500 MiB/s, stop when the rest sends in 50 ms
show('(a) 16 GiB, 2000 MiB/s, dirty 500', preCopy(16384, 2000, 500, 50));
// (b) same VM, a slower 600 MiB/s link
show('(b) 16 GiB,  600 MiB/s, dirty 500', preCopy(16384, 600, 500, 50));
// (c) the smallest link speed (step 50 MiB/s) at which (a)'s VM converges within 10 rounds
let min = 50; while (!(preCopy(16384, min, 500, 50, 10).ok)) min += 50;
console.log(&#96;(c) smallest link that converges within 10 rounds: &#36;{min} MiB/s (dirty rate / link = &#36;{(500 / min).toFixed(2)})&#96;);</code></pre>
<div class="out">$ node di-tru-thu.js<br>
(a) 16 GiB, 2000 MiB/s, dirty 500: converges after 5 round(s), downtime 32 ms, total 10.9 s, sent 21824 MiB<br>
(b) 16 GiB, &nbsp;600 MiB/s, dirty 500: NO convergence after 30 round(s), downtime 115 ms, total 163.1 s, sent 97890 MiB<br>
(c) smallest link that converges within 10 rounds: 1000 MiB/s (dirty rate / link = 0.50)</div>
<ul>
<li>(a) The ratio is 500 ÷ 2000 = 0.25, so every round is four times smaller: 16384, 4096, 1024, 256, 64 MiB; the last round of 64 MiB takes 32 ms (under 50), so the VM is paused for <strong>32 ms</strong> after 5 rounds and about 11 seconds in total, sending 21,824 MiB (1.3 times the memory).</li>
<li>(b) Ratio 500 ÷ 600 = 0.83: it still shrinks, but so slowly that after 30 rounds 115 ms of data remain — you would need about 35 rounds, and 98,000 MiB (six times the VM) would cross the link. A hypervisor gives up and either forces a long pause or throttles the guest. With a ratio ≥ 1 it never converges.</li>
<li>(c) <strong>1000 MiB/s</strong>, ratio 0.5: sizes halve each round (16384 → 32 MiB in 9 rounds, the 10th round sends the rest). The rule of thumb: the link should be at least about twice the dirty rate.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 6 — di trú trực tiếp pre-copy với số liệu mới (20 phút)</h3>
<p>Một VM 16 GiB (16384 MiB) được di trú; dừng VM khi phần bộ nhớ bẩn còn lại gửi được trong 50 ms. (a) Đường truyền 2000 MiB/s, tốc độ ghi 500 MiB/s: bao nhiêu vòng và thời gian ngừng là bao nhiêu? (b) Đường truyền chỉ 600 MiB/s: chuyện gì xảy ra? (c) Tốc độ đường truyền nhỏ nhất (bước 50 MiB/s) để hội tụ trong 10 vòng là bao nhiêu, và khi đó tỉ số tốc độ ghi ÷ đường truyền là bao nhiêu?</p>
<details><summary>Lời giải — chương trình tính</summary>
<pre><code class="language-javascript">// Di trú trực tiếp pre-copy: với số liệu của riêng bạn
function preCopy(memMiB, link, dirty, stopMs, maxRounds = 30) {
  let todo = memMiB, t = 0, sent = 0, rounds = 0;
  while (rounds &lt; maxRounds) {
    rounds++;
    const sec = todo / link;
    if (sec * 1000 &lt;= stopMs) return { ok: true, rounds, downtimeMs: sec * 1000, totalSec: t + sec, sent: sent + todo };
    sent += todo; t += sec; todo = Math.min(memMiB, dirty * sec);
  }
  return { ok: false, rounds, downtimeMs: (todo / link) * 1000, totalSec: t, sent };
}
const show = (name, r) =&gt; console.log(&#96;&#36;{name}: &#36;{r.ok ? 'converges' : 'NO convergence'} after &#36;{r.rounds} round(s), downtime &#36;{r.downtimeMs.toFixed(0)} ms, total &#36;{r.totalSec.toFixed(1)} s, sent &#36;{r.sent.toFixed(0)} MiB&#96;);
// (a) VM 16 GiB, đường truyền 2000 MiB/s, tốc độ ghi 500 MiB/s, dừng khi phần còn lại gửi được trong 50 ms
show('(a) 16 GiB, 2000 MiB/s, dirty 500', preCopy(16384, 2000, 500, 50));
// (b) cùng VM, đường truyền chậm hơn 600 MiB/s
show('(b) 16 GiB,  600 MiB/s, dirty 500', preCopy(16384, 600, 500, 50));
// (c) tốc độ đường truyền nhỏ nhất (bước 50 MiB/s) để VM của (a) hội tụ trong 10 vòng
let min = 50; while (!(preCopy(16384, min, 500, 50, 10).ok)) min += 50;
console.log(&#96;(c) smallest link that converges within 10 rounds: &#36;{min} MiB/s (dirty rate / link = &#36;{(500 / min).toFixed(2)})&#96;);</code></pre>
<div class="out">$ node di-tru-thu.js<br>
(a) 16 GiB, 2000 MiB/s, dirty 500: converges after 5 round(s), downtime 32 ms, total 10.9 s, sent 21824 MiB<br>
(b) 16 GiB, &nbsp;600 MiB/s, dirty 500: NO convergence after 30 round(s), downtime 115 ms, total 163.1 s, sent 97890 MiB<br>
(c) smallest link that converges within 10 rounds: 1000 MiB/s (dirty rate / link = 0.50)</div>
<ul>
<li>(a) Tỉ số là 500 ÷ 2000 = 0,25, nên mỗi vòng nhỏ hơn bốn lần: 16384, 4096, 1024, 256, 64 MiB; vòng cuối 64 MiB mất 32 ms (dưới 50), nên VM bị dừng <strong>32 ms</strong> sau 5 vòng và tổng cộng khoảng 11 giây, gửi 21.824 MiB (1,3 lần bộ nhớ).</li>
<li>(b) Tỉ số 500 ÷ 600 = 0,83: vẫn nhỏ dần nhưng chậm tới mức sau 30 vòng còn 115 ms dữ liệu — cần khoảng 35 vòng, và 98.000 MiB (sáu lần cỡ VM) sẽ đi qua đường truyền. Hypervisor bỏ cuộc và hoặc ép một lần dừng dài hoặc giảm tốc guest. Với tỉ số ≥ 1 thì không bao giờ hội tụ.</li>
<li>(c) <strong>1000 MiB/s</strong>, tỉ số 0,5: kích thước giảm một nửa mỗi vòng (16384 → 32 MiB sau 9 vòng, vòng thứ 10 gửi nốt phần còn lại). Quy tắc ngón tay cái: đường truyền nên nhanh gấp ít nhất khoảng hai lần tốc độ ghi.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 7 — classify real products (10 min)</h3>
<p>For each, say what kind of virtualization it is (hypervisor type 1 or 2, container, process virtualization, none) and, for services, the NIST model: (a) Docker on a Linux server; (b) Docker Desktop on a Mac; (c) a VPS from a hosting company; (d) AWS Lambda; (e) Gmail; (f) VirtualBox; (g) Hyper-V on a Windows Server; (h) Wine; (i) WSL 2.</p>
<details><summary>Solution — with the reason</summary>
<ul>
<li>(a) <strong>Container</strong> — no hypervisor at all; processes with namespaces and cgroups on the server's own kernel (slide 4).</li>
<li>(b) <strong>A type 2 virtual machine that holds containers</strong> — a hidden Linux VM (Apple's Virtualization framework or Docker's VMM), with the containers sharing that VM's kernel; you saw its kernel in lesson N1.A, slide 1.</li>
<li>(c) <strong>IaaS</strong>, almost always a KVM virtual machine (type-1-like) that you administer yourself.</li>
<li>(d) <strong>A serverless platform</strong> (you upload only code, the provider manages everything else — PaaS-like); under it, AWS runs each function in a <strong>Firecracker microVM</strong> (KVM-based) — VM-grade isolation at container-like cost (slide 20).</li>
<li>(e) <strong>SaaS</strong> — you use a finished application; the virtualization is the provider's business.</li>
<li>(f) <strong>Type 2 hypervisor</strong> — installed like an application on a host OS (same family as VMware Workstation, FE21#37).</li>
<li>(g) <strong>Type 1 hypervisor</strong> — it runs on the hardware, and Windows itself becomes the privileged "root partition" (the control domain of Figure 7-1a).</li>
<li>(h) <strong>Process virtualization</strong> — Wine translates Windows system calls for one program; there is no guest OS (slide 4).</li>
<li>(i) <strong>A lightweight virtual machine</strong> running a real Linux kernel on Microsoft's hypervisor technology — which is why <code>uname -r</code> in WSL 2 shows a Linux kernel ending in "microsoft-standard-WSL2" even though the PC runs Windows.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 7 — phân loại sản phẩm thật (10 phút)</h3>
<p>Với mỗi mục, nói đó là loại ảo hoá nào (hypervisor loại 1 hay 2, container, ảo hoá tiến trình, không có) và, với dịch vụ, mô hình NIST: (a) Docker trên máy chủ Linux; (b) Docker Desktop trên Mac; (c) một VPS của công ty hosting; (d) AWS Lambda; (e) Gmail; (f) VirtualBox; (g) Hyper-V trên Windows Server; (h) Wine; (i) WSL 2.</p>
<details><summary>Lời giải — kèm lý do</summary>
<ul>
<li>(a) <strong>Container</strong> — hoàn toàn không có hypervisor; các tiến trình với namespace và cgroup trên nhân của chính máy chủ (slide 4).</li>
<li>(b) <strong>Một máy ảo loại 2 chứa các container</strong> — một VM Linux ẩn (Virtualization framework của Apple hay VMM của Docker), các container dùng chung nhân của VM đó; bạn đã thấy nhân của nó ở bài N1.A, slide 1.</li>
<li>(c) <strong>IaaS</strong>, hầu như luôn là một máy ảo KVM (giống loại 1) mà bạn tự quản trị.</li>
<li>(d) <strong>Một nền tảng serverless</strong> (bạn chỉ tải mã lên, nhà cung cấp quản lý mọi thứ còn lại — kiểu PaaS); bên dưới, AWS chạy mỗi hàm trong một <strong>microVM Firecracker</strong> (dựa trên KVM) — cô lập cấp máy ảo với chi phí cỡ container (slide 20).</li>
<li>(e) <strong>SaaS</strong> — bạn dùng một ứng dụng hoàn chỉnh; ảo hoá là việc của nhà cung cấp.</li>
<li>(f) <strong>Hypervisor loại 2</strong> — cài như một ứng dụng trên HĐH chủ (cùng họ với VMware Workstation, FE21#37).</li>
<li>(g) <strong>Hypervisor loại 1</strong> — nó chạy trên phần cứng, và chính Windows trở thành "root partition" đặc quyền (control domain của Hình 7-1a).</li>
<li>(h) <strong>Ảo hoá tiến trình</strong> — Wine dịch lời gọi hệ thống Windows cho một chương trình; không có HĐH guest (slide 4).</li>
<li>(i) <strong>Một máy ảo nhẹ</strong> chạy một nhân Linux thật trên công nghệ hypervisor của Microsoft — vì thế <code>uname -r</code> trong WSL 2 hiện một nhân Linux kết thúc bằng "microsoft-standard-WSL2" dù máy tính chạy Windows.</li>
</ul>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>virtualization</strong></td><td>ảo hoá</td><td>Making one physical machine behave like several separate machines (or giving each client the illusion of owning a resource).</td></tr>
<tr><td><strong>hypervisor / VMM</strong></td><td>bộ giám sát máy ảo</td><td>The program that creates and runs virtual machines; also called virtual machine monitor.</td></tr>
<tr><td><strong>type 1 hypervisor</strong></td><td>hypervisor loại 1</td><td>Runs directly on the hardware, with no host operating system (ESXi, Xen, Hyper-V).</td></tr>
<tr><td><strong>type 2 hypervisor</strong></td><td>hypervisor loại 2</td><td>Runs as a program on a host operating system (VMware Workstation, VirtualBox).</td></tr>
<tr><td><strong>guest / host</strong></td><td>HĐH guest / HĐH chủ</td><td>The operating system inside a virtual machine / the one that runs the hypervisor (type 2) or the machine itself.</td></tr>
<tr><td><strong>safety, fidelity, efficiency</strong></td><td>an toàn, trung thực, hiệu quả</td><td>Popek–Goldberg requirements: the hypervisor controls everything, the VM behaves like real hardware, most code runs without the hypervisor.</td></tr>
<tr><td><strong>privileged / sensitive instruction</strong></td><td>lệnh đặc quyền / lệnh nhạy cảm</td><td>Privileged: traps when run in user mode. Sensitive: reads or changes privileged state or resources.</td></tr>
<tr><td><strong>trap-and-emulate</strong></td><td>bẫy rồi giả lập</td><td>Run the guest kernel in user mode; each privileged instruction traps to the hypervisor, which emulates it on virtual state.</td></tr>
<tr><td><strong>VM exit / VM entry</strong></td><td>thoát khỏi VM / vào VM</td><td>The hardware-assisted trap from guest to hypervisor and the return to the guest.</td></tr>
<tr><td><strong>binary translation</strong></td><td>dịch nhị phân</td><td>Rewriting guest kernel code before it runs so sensitive instructions become safe calls into the monitor.</td></tr>
<tr><td><strong>paravirtualization / hypercall</strong></td><td>paravirtualization / hypercall</td><td>A modified guest that calls the hypervisor on purpose; the call is a hypercall (like a system call, one level up).</td></tr>
<tr><td><strong>hardware-assisted virtualization</strong></td><td>ảo hoá có hỗ trợ phần cứng</td><td>CPU modes (Intel VT-x, AMD-V, ARM EL2) in which an unmodified guest kernel runs natively.</td></tr>
<tr><td><strong>shadow / nested page tables</strong></td><td>bảng trang bóng / bảng trang lồng</td><td>Two ways to map guest-virtual to host-physical: software copy kept in step by traps, or two hardware walks (EPT, NPT).</td></tr>
<tr><td><strong>virtio</strong></td><td>virtio</td><td>A standard for paravirtual devices: guest driver and host back end share rings (virtqueues) in memory.</td></tr>
<tr><td><strong>SR-IOV / IOMMU</strong></td><td>SR-IOV / IOMMU</td><td>One physical device presents several virtual functions given directly to VMs; the IOMMU confines the device's DMA.</td></tr>
<tr><td><strong>world switch</strong></td><td>world switch</td><td>VMware's swap of the whole machine state between the host OS world and the VMM world.</td></tr>
<tr><td><strong>live migration (pre-copy)</strong></td><td>di trú trực tiếp (pre-copy)</td><td>Moving a running VM: copy memory while it runs, resend dirtied pages, pause briefly for the last few.</td></tr>
<tr><td><strong>ballooning / overcommit</strong></td><td>ballooning / overcommit</td><td>Taking idle memory back from VMs through a guest driver, so the host can promise more than it owns.</td></tr>
<tr><td><strong>container</strong></td><td>container</td><td>Processes isolated by namespaces and limited by cgroups on one shared kernel — not a virtual machine.</td></tr>
<tr><td><strong>namespace / cgroup</strong></td><td>namespace / cgroup</td><td>Linux features: what a process can see (PIDs, mounts, network…) / how much it can use (memory, CPU, processes).</td></tr>
<tr><td><strong>vDSO</strong></td><td>vDSO</td><td>A kernel-provided page mapped into every process so some calls (clock_gettime) never trap.</td></tr>
<tr><td><strong>microVM (Firecracker)</strong></td><td>microVM (Firecracker)</td><td>A tiny KVM-based virtual machine with a minimal device model, starting in about 125 ms.</td></tr>
<tr><td><strong>NIST cloud characteristics</strong></td><td>năm đặc tính đám mây của NIST</td><td>On-demand self-service, broad network access, resource pooling, rapid elasticity, measured service.</td></tr>
<tr><td><strong>IaaS / PaaS / SaaS</strong></td><td>IaaS / PaaS / SaaS</td><td>Rent infrastructure (virtual machines) / a platform to run code / a finished application.</td></tr>
<tr><td><strong>thin client</strong></td><td>máy khách mỏng</td><td>A device that only displays the user interface; processing happens on a server or in the cloud.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>virtualization</strong></td><td>ảo hoá</td><td>Làm một máy vật lý cư xử như nhiều máy riêng biệt (hoặc cho mỗi khách ảo giác sở hữu một tài nguyên).</td></tr>
<tr><td><strong>hypervisor / VMM</strong></td><td>bộ giám sát máy ảo</td><td>Chương trình tạo và chạy các máy ảo; còn gọi là virtual machine monitor.</td></tr>
<tr><td><strong>type 1 hypervisor</strong></td><td>hypervisor loại 1</td><td>Chạy thẳng trên phần cứng, không có HĐH chủ (ESXi, Xen, Hyper-V).</td></tr>
<tr><td><strong>type 2 hypervisor</strong></td><td>hypervisor loại 2</td><td>Chạy như một chương trình trên HĐH chủ (VMware Workstation, VirtualBox).</td></tr>
<tr><td><strong>guest / host</strong></td><td>HĐH guest / HĐH chủ</td><td>HĐH bên trong máy ảo / HĐH chạy hypervisor (loại 2) hoặc chính máy thật.</td></tr>
<tr><td><strong>safety, fidelity, efficiency</strong></td><td>an toàn, trung thực, hiệu quả</td><td>Yêu cầu của Popek–Goldberg: hypervisor kiểm soát mọi thứ, VM cư xử như phần cứng thật, phần lớn mã chạy không cần hypervisor.</td></tr>
<tr><td><strong>privileged / sensitive instruction</strong></td><td>lệnh đặc quyền / lệnh nhạy cảm</td><td>Đặc quyền: bẫy khi chạy ở chế độ người dùng. Nhạy cảm: đọc hoặc đổi trạng thái hay tài nguyên đặc quyền.</td></tr>
<tr><td><strong>trap-and-emulate</strong></td><td>bẫy rồi giả lập</td><td>Chạy nhân guest ở chế độ người dùng; mỗi lệnh đặc quyền bẫy sang hypervisor, nó giả lập lên trạng thái ảo.</td></tr>
<tr><td><strong>VM exit / VM entry</strong></td><td>thoát khỏi VM / vào VM</td><td>Cú bẫy có phần cứng hỗ trợ từ guest sang hypervisor và cú quay về guest.</td></tr>
<tr><td><strong>binary translation</strong></td><td>dịch nhị phân</td><td>Viết lại mã nhân guest trước khi chạy để lệnh nhạy cảm thành lời gọi an toàn vào bộ giám sát.</td></tr>
<tr><td><strong>paravirtualization / hypercall</strong></td><td>paravirtualization / hypercall</td><td>Guest đã sửa chủ động gọi hypervisor; lời gọi đó là hypercall (như lời gọi hệ thống, lên một tầng).</td></tr>
<tr><td><strong>hardware-assisted virtualization</strong></td><td>ảo hoá có hỗ trợ phần cứng</td><td>Các chế độ CPU (Intel VT-x, AMD-V, ARM EL2) trong đó nhân guest không sửa chạy nguyên bản.</td></tr>
<tr><td><strong>shadow / nested page tables</strong></td><td>bảng trang bóng / bảng trang lồng</td><td>Hai cách ánh xạ guest-virtual sang host-physical: bản sao phần mềm giữ đồng bộ bằng cú bẫy, hoặc hai lần duyệt bằng phần cứng (EPT, NPT).</td></tr>
<tr><td><strong>virtio</strong></td><td>virtio</td><td>Chuẩn cho thiết bị paravirtual: driver guest và back end của host dùng chung các vòng (virtqueue) trong bộ nhớ.</td></tr>
<tr><td><strong>SR-IOV / IOMMU</strong></td><td>SR-IOV / IOMMU</td><td>Một thiết bị vật lý đưa ra nhiều virtual function giao thẳng cho VM; IOMMU giới hạn DMA của thiết bị.</td></tr>
<tr><td><strong>world switch</strong></td><td>world switch</td><td>Việc VMware đổi toàn bộ trạng thái máy giữa thế giới HĐH chủ và thế giới VMM.</td></tr>
<tr><td><strong>live migration (pre-copy)</strong></td><td>di trú trực tiếp (pre-copy)</td><td>Chuyển một VM đang chạy: chép bộ nhớ khi nó chạy, gửi lại trang bị ghi, dừng ngắn cho phần cuối cùng.</td></tr>
<tr><td><strong>ballooning / overcommit</strong></td><td>ballooning / overcommit</td><td>Lấy lại bộ nhớ rảnh từ các VM qua driver trong guest, để máy chủ hứa nhiều hơn mình có.</td></tr>
<tr><td><strong>container</strong></td><td>container</td><td>Các tiến trình được cô lập bằng namespace và giới hạn bằng cgroup trên một nhân dùng chung — không phải máy ảo.</td></tr>
<tr><td><strong>namespace / cgroup</strong></td><td>namespace / cgroup</td><td>Tính năng Linux: tiến trình thấy gì (PID, mount, mạng…) / được dùng bao nhiêu (bộ nhớ, CPU, số tiến trình).</td></tr>
<tr><td><strong>vDSO</strong></td><td>vDSO</td><td>Trang do nhân cung cấp ánh xạ vào mọi tiến trình để một số lời gọi (clock_gettime) không bao giờ bẫy.</td></tr>
<tr><td><strong>microVM (Firecracker)</strong></td><td>microVM (Firecracker)</td><td>Máy ảo rất nhỏ dựa trên KVM với mô hình thiết bị tối giản, khởi động trong khoảng 125 ms.</td></tr>
<tr><td><strong>NIST cloud characteristics</strong></td><td>năm đặc tính đám mây của NIST</td><td>Tự phục vụ theo yêu cầu, truy cập mạng rộng, gom chung tài nguyên, co giãn nhanh, dịch vụ có đo đếm.</td></tr>
<tr><td><strong>IaaS / PaaS / SaaS</strong></td><td>IaaS / PaaS / SaaS</td><td>Thuê hạ tầng (máy ảo) / nền tảng chạy mã / ứng dụng hoàn chỉnh.</td></tr>
<tr><td><strong>thin client</strong></td><td>máy khách mỏng</td><td>Thiết bị chỉ hiển thị giao diện; việc xử lý diễn ra trên máy chủ hay đám mây.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember about virtualization and the cloud</h2>
<ol>
<li>A <strong>hypervisor</strong> gives each guest OS the illusion of a whole machine. It must be <strong>safe</strong> (it keeps control), <strong>faithful</strong> (same behaviour) and <strong>efficient</strong> (most code runs with no intervention) — Popek and Goldberg, 1974.</li>
<li><strong>Type 1</strong> runs on bare metal (ESXi, Xen, Hyper-V); <strong>type 2</strong> runs on a host OS (VMware Workstation, VirtualBox); <strong>KVM</strong> turns the Linux kernel into a hypervisor and QEMU runs each VM as a process.</li>
<li><strong>Trap-and-emulate</strong> works when every sensitive instruction is privileged. Old x86 had sensitive instructions that do not trap (POPF, PUSHF, SGDT …), so VMware used <strong>binary translation</strong>, Xen used <strong>paravirtualization</strong> (<strong>hypercalls</strong>), and Intel VT-x (2005) / AMD-V (2006) fixed the CPU.</li>
<li>Traps are expensive (hundreds of nanoseconds for a plain mode switch, more for a VM exit): good designs keep most execution trap-free — direct execution, paravirtual drivers, batching, the vDSO.</li>
<li><strong>Nested page tables</strong> remove the hypervisor's trapping on page-table writes, at the price of a two-dimensional walk: n·m + n + m reads on a TLB miss (24 for 4 + 4 levels); huge pages shorten it.</li>
<li>Devices: <strong>emulate</strong> old hardware (slow, compatible) → <strong>virtio</strong> paravirtual devices (the norm; see <code>/sys/bus/virtio</code>) → <strong>pass-through</strong> with SR-IOV + IOMMU (fast, hard to migrate).</li>
<li>A <strong>container</strong> is not a VM: namespaces + cgroups on one shared kernel. Docker Desktop on Mac and Windows runs containers inside a Linux VM. Micro-VMs (Firecracker) combine VM isolation with container-like cost.</li>
<li>The <strong>cloud</strong> (NIST): five characteristics — on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service — and three models: IaaS, PaaS, SaaS. Virtualization supplies pooling and elasticity; <strong>live migration</strong> (pre-copy) moves running VMs with a pause of tens of milliseconds, if the dirty rate stays well below the link speed.</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ về ảo hoá và đám mây</h2>
<ol>
<li><strong>Hypervisor</strong> cho mỗi HĐH guest ảo giác về cả một máy. Nó phải <strong>an toàn</strong> (giữ quyền kiểm soát), <strong>trung thực</strong> (cùng hành vi) và <strong>hiệu quả</strong> (phần lớn mã chạy không cần can thiệp) — Popek và Goldberg, 1974.</li>
<li><strong>Loại 1</strong> chạy trên phần cứng trần (ESXi, Xen, Hyper-V); <strong>loại 2</strong> chạy trên HĐH chủ (VMware Workstation, VirtualBox); <strong>KVM</strong> biến nhân Linux thành hypervisor và QEMU chạy mỗi VM như một tiến trình.</li>
<li><strong>Trap-and-emulate</strong> chạy được khi mọi lệnh nhạy cảm đều đặc quyền. x86 cũ có lệnh nhạy cảm không bẫy (POPF, PUSHF, SGDT …), nên VMware dùng <strong>dịch nhị phân</strong>, Xen dùng <strong>paravirtualization</strong> (<strong>hypercall</strong>), và Intel VT-x (2005) / AMD-V (2006) sửa chính CPU.</li>
<li>Cú bẫy đắt (hàng trăm nano giây cho một lần đổi chế độ thường, nhiều hơn cho VM exit): thiết kế tốt giữ phần lớn việc thực thi không bẫy — thực thi trực tiếp, driver paravirtual, gom mẻ, vDSO.</li>
<li><strong>Bảng trang lồng</strong> bỏ cú bẫy của hypervisor khi ghi bảng trang, đổi lại là một lần duyệt hai chiều: n·m + n + m lần đọc khi TLB hụt (24 cho 4 + 4 tầng); trang lớn làm nó ngắn lại.</li>
<li>Thiết bị: <strong>giả lập</strong> phần cứng cũ (chậm, tương thích) → thiết bị paravirtual <strong>virtio</strong> (chuẩn hiện nay; xem <code>/sys/bus/virtio</code>) → <strong>chuyển thẳng</strong> bằng SR-IOV + IOMMU (nhanh, khó di trú).</li>
<li><strong>Container</strong> không phải VM: namespace + cgroup trên một nhân dùng chung. Docker Desktop trên Mac và Windows chạy container trong một VM Linux. Micro-VM (Firecracker) kết hợp cô lập của VM với chi phí cỡ container.</li>
<li><strong>Đám mây</strong> (NIST): năm đặc tính — tự phục vụ theo yêu cầu, truy cập mạng rộng, gom chung tài nguyên, co giãn nhanh, dịch vụ có đo đếm — và ba mô hình: IaaS, PaaS, SaaS. Ảo hoá cung cấp gom chung và co giãn; <strong>di trú trực tiếp</strong> (pre-copy) chuyển VM đang chạy với một lần dừng vài chục mili giây, nếu tốc độ ghi vẫn thấp xa tốc độ đường truyền.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-n1) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) A VMM (Virtual Machine Monitor) creates the illusion of multiple (virtual) machines on the same physical hardware. What is a VMM also known as?|||(Dạng câu FE) VMM (Virtual Machine Monitor) tạo ảo giác về nhiều máy (ảo) trên cùng một phần cứng vật lý. VMM còn được gọi là gì?',
      options: ['Hypovisor|||Hypovisor', 'Console|||Console', 'Hypervisor|||Hypervisor', 'Shell|||Shell'],
      correctIndex: 2,
      points: 1,
      explanation: 'A VMM is the same thing as a <em>hypervisor</em>: the "supervisor of supervisors", the program that sits under the guest operating systems the way an operating system sits under programs. "Hypovisor" is a spelling trap, and a shell or console is just a user interface. Lesson N1.A, slide 3.|||VMM chính là <em>hypervisor</em>: "bộ giám sát của các bộ giám sát", chương trình nằm dưới các hệ điều hành guest giống như hệ điều hành nằm dưới các chương trình. "Hypovisor" là bẫy chính tả, còn shell hay console chỉ là giao diện người dùng. Bài N1.A, slide 3.' },
    { id: 'q2',
      question: '(FE question type) Paravirtualization modifies the source code of the guest operating system instead of letting it perform sensitive instructions. Which statement is true?|||(Dạng câu FE) Paravirtualization sửa mã nguồn của HĐH guest thay vì để nó chạy lệnh nhạy cảm. Phát biểu nào đúng?',
      options: ['The paravirtualized guest executes hypercalls|||Guest paravirtualized thực hiện hypercall', 'The paravirtualized guest executes system calls to reach the hypervisor|||Guest paravirtualized thực hiện lời gọi hệ thống để tới hypervisor', 'The paravirtualized guest executes virtual calls|||Guest paravirtualized thực hiện virtual call', 'The paravirtualized guest executes Hyper commands|||Guest paravirtualized thực hiện Hyper command'],
      correctIndex: 0,
      points: 1,
      explanation: 'The edited guest asks the hypervisor for privileged services on purpose with a <strong>hypercall</strong> — like a system call, but the callee is the hypervisor (HVC on ARM64, VMCALL on Intel). A system call goes from a program to its own kernel, and "virtual call" and "Hyper command" do not exist. Lesson N1.A, slide 7.|||Guest đã sửa chủ động xin hypervisor các dịch vụ đặc quyền bằng một <strong>hypercall</strong> — giống lời gọi hệ thống nhưng bên được gọi là hypervisor (HVC trên ARM64, VMCALL trên Intel). Lời gọi hệ thống đi từ một chương trình tới nhân của chính nó, còn "virtual call" và "Hyper command" không tồn tại. Bài N1.A, slide 7.' },
    { id: 'q3',
      question: 'According to Popek and Goldberg, a virtual machine monitor can be built for a processor if which condition holds?|||Theo Popek và Goldberg, có thể xây một bộ giám sát máy ảo cho một bộ xử lý nếu điều kiện nào đúng?',
      options: ['Every privileged instruction is also sensitive|||Mọi lệnh đặc quyền đều là lệnh nhạy cảm', 'The processor has at least four privilege rings|||Bộ xử lý có ít nhất bốn vòng đặc quyền', 'All instructions trap when executed in user mode|||Mọi lệnh đều bẫy khi chạy ở chế độ người dùng', 'Every sensitive instruction is privileged|||Mọi lệnh nhạy cảm đều là lệnh đặc quyền'],
      correctIndex: 3,
      points: 1,
      explanation: 'Theorem 1 of the 1974 paper: if the set of <em>sensitive</em> instructions (those that read or change privileged machine state) is contained in the set of <em>privileged</em> instructions (those that trap in user mode), trap-and-emulate works — every dangerous act reaches the hypervisor. Option a is the converse and proves nothing; rings are irrelevant; and if ALL instructions trapped the guest would be unusably slow (it violates efficiency). Lesson N1.A, slide 2.|||Định lý 1 của bài báo năm 1974: nếu tập lệnh <em>nhạy cảm</em> (đọc hoặc đổi trạng thái đặc quyền của máy) nằm trong tập lệnh <em>đặc quyền</em> (bẫy ở chế độ người dùng) thì trap-and-emulate chạy được — mọi hành động nguy hiểm đều tới hypervisor. Phương án a là mệnh đề đảo và không chứng minh gì; vòng đặc quyền không liên quan; và nếu MỌI lệnh đều bẫy thì guest chậm không dùng nổi (vi phạm tính hiệu quả). Bài N1.A, slide 2.' },
    { id: 'q4',
      question: '(FE question type) Which statement about hypervisor types is correct?|||(Dạng câu FE) Phát biểu nào về các loại hypervisor là đúng?',
      options: ['VMware Workstation is a type 1 hypervisor because it is installed on the hardware|||VMware Workstation là hypervisor loại 1 vì nó được cài trên phần cứng', 'VMware Workstation is a type 2 hypervisor; ESX Server is type 1|||VMware Workstation là hypervisor loại 2; ESX Server là loại 1', 'A type 2 hypervisor runs without any operating system underneath|||Hypervisor loại 2 chạy mà không có hệ điều hành nào bên dưới', 'Both types are equally efficient for servers, so the choice does not matter|||Cả hai loại hiệu quả như nhau cho máy chủ nên chọn loại nào cũng được'],
      correctIndex: 1,
      points: 1,
      explanation: "A type 2 hypervisor is installed like an application on a host OS — VMware Workstation, VirtualBox, Parallels (FE21#37, FE23#33, FE24#7). A type 1 hypervisor such as ESX Server, Xen or Hyper-V runs directly on the hardware and is generally more efficient for enterprise servers (FE9#50). Option c describes type 1; option d is false because type 2 sends every I/O through the host's drivers. Lesson N1.A, slides 3–4 and 19.|||Hypervisor loại 2 được cài như một ứng dụng trên HĐH chủ — VMware Workstation, VirtualBox, Parallels (FE21#37, FE23#33, FE24#7). Hypervisor loại 1 như ESX Server, Xen hay Hyper-V chạy thẳng trên phần cứng và thường hiệu quả hơn cho máy chủ doanh nghiệp (FE9#50). Phương án c mô tả loại 1; phương án d sai vì loại 2 cho mọi I/O đi qua driver của HĐH chủ. Bài N1.A, slide 3–4 và 19." },
    { id: 'q5',
      question: 'A virtual machine has 4-level guest page tables and the host uses 4-level nested page tables. In the worst case (TLB miss), how many page-table entries must be read before the data itself can be read?|||Một máy ảo có bảng trang guest 4 tầng và host dùng bảng trang lồng 4 tầng. Trong trường hợp xấu nhất (TLB hụt), phải đọc bao nhiêu mục bảng trang trước khi đọc được chính dữ liệu?',
      options: ['24|||24', '20|||20', '16|||16', '8|||8'],
      correctIndex: 0,
      points: 1,
      explanation: "Computed by the simulator: each of the guest's 4 levels needs its table address translated by 4 host reads and then 1 read of the guest entry = 4 × (4 + 1) = 20; the final data page needs 4 more host reads: n·m + n + m = 24 (a native walk needs 4). 20 forgets the last translation, 16 is n·m alone, 8 is n + m. Lesson N1.A, slide 9.|||Bộ mô phỏng tính: mỗi trong 4 tầng của guest cần địa chỉ bảng của nó được dịch bằng 4 lần đọc của host rồi 1 lần đọc mục của guest = 4 × (4 + 1) = 20; trang dữ liệu cuối cần thêm 4 lần đọc của host: n·m + n + m = 24 (duyệt thường chỉ cần 4). 20 quên phép dịch cuối, 16 chỉ là n·m, 8 là n + m. Bài N1.A, slide 9." },
    { id: 'q6',
      question: 'A guest kernel on an old x86 (before VT-x / AMD-V), pushed to ring 1, runs the usual critical-section pattern PUSHF ; CLI ; ADD ; POPF with the virtual interrupt flag starting at 1. The hypervisor uses trap-and-emulate only. What is the virtual interrupt flag at the end? (Correct would be 1.)|||Nhân guest trên x86 cũ (trước VT-x / AMD-V), bị đẩy ra vòng 1, chạy mẫu vùng tới hạn quen thuộc PUSHF ; CLI ; ADD ; POPF với cờ ngắt ảo lúc đầu bằng 1. Hypervisor chỉ dùng trap-and-emulate. Cuối cùng cờ ngắt ảo bằng bao nhiêu? (Đúng ra phải là 1.)',
      options: ['IF=1|||IF=1', 'IF=1, but the machine crashes|||IF=1, nhưng máy bị treo', 'IF=0|||IF=0', 'Undefined — it depends on the guest|||Không xác định — tuỳ guest'],
      correctIndex: 2,
      points: 1,
      explanation: 'Computed by the simulator: CLI is privileged and traps (virtual IF becomes 0), but POPF is NOT privileged on x86 — outside ring 0 it silently ignores the interrupt-flag bit and does not trap, so the restore never happens: the guest ends with IF=0 and believes interrupts are enabled again — the guest would run with interrupts off. This non-trapping sensitive instruction is exactly why x86 was "unvirtualizable" until binary translation or hardware support. Lesson N1.A, slide 6.|||Bộ mô phỏng tính: CLI là lệnh đặc quyền và bẫy (IF ảo thành 0), nhưng POPF KHÔNG đặc quyền trên x86 — ngoài vòng 0 nó lặng lẽ bỏ qua bit cờ ngắt và không bẫy, nên việc khôi phục không bao giờ xảy ra: guest kết thúc với IF=0 trong khi tin rằng ngắt đã bật lại — guest sẽ chạy với ngắt tắt. Chính lệnh nhạy cảm không bẫy này là lý do x86 "không ảo hoá được" cho tới khi có dịch nhị phân hoặc hỗ trợ phần cứng. Bài N1.A, slide 6.' },
    { id: 'q7',
      question: 'You rent a virtual machine from a provider, install Docker and PostgreSQL yourself and patch its operating system. Which NIST service model is this?|||Bạn thuê một máy ảo từ nhà cung cấp, tự cài Docker và PostgreSQL và tự vá hệ điều hành của nó. Đây là mô hình dịch vụ nào của NIST?',
      options: ['SaaS — Software as a Service|||SaaS — Software as a Service', 'PaaS — Platform as a Service|||PaaS — Platform as a Service', 'A private cloud deployment|||Triển khai đám mây riêng', 'IaaS — Infrastructure as a Service|||IaaS — Infrastructure as a Service'],
      correctIndex: 3,
      points: 1,
      explanation: 'In <strong>IaaS</strong> the provider manages the hypervisor, servers, storage and network, and you manage everything from the guest operating system up — a VPS or an EC2 instance. In PaaS the provider also manages the OS and runtime and you only deploy code; in SaaS you just use a finished application. "Private cloud" is a <em>deployment</em> model, not a service model. Lesson N1.A, slide 10.|||Ở <strong>IaaS</strong> nhà cung cấp quản lý hypervisor, máy chủ, lưu trữ và mạng, còn bạn quản lý mọi thứ từ hệ điều hành guest trở lên — một VPS hay máy EC2. Ở PaaS nhà cung cấp còn quản lý cả HĐH và runtime và bạn chỉ triển khai mã; ở SaaS bạn chỉ dùng ứng dụng hoàn chỉnh. "Đám mây riêng" là mô hình <em>triển khai</em>, không phải mô hình dịch vụ. Bài N1.A, slide 10.' },
    { id: 'q8',
      question: 'A VM has 8192 MiB of memory and is live-migrated over a 1000 MiB/s link while it dirties 200 MiB/s. Pre-copy rounds repeat until the remaining dirty memory can be sent in 100 ms, then the VM is paused. About how long is the pause?|||Một VM có 8192 MiB bộ nhớ được di trú trực tiếp qua đường truyền 1000 MiB/s trong khi nó làm bẩn 200 MiB/s. Các vòng pre-copy lặp tới khi phần bộ nhớ bẩn còn lại gửi được trong 100 ms, rồi VM bị tạm dừng. Thời gian dừng khoảng bao nhiêu?',
      options: ['8192 ms|||8192 ms', '66 ms|||66 ms', '0 ms|||0 ms', '1638 ms|||1638 ms'],
      correctIndex: 1,
      points: 1,
      explanation: 'Computed by the program: the rounds shrink by the ratio dirty rate ÷ link speed = 0.2 — 8192, 1638, 328 and 66 MiB — and the round of 66 MiB takes 66 ms, which is under 100 ms, so the VM is paused for the last ~66 ms (Clark et al. measured 60 ms for a game server). 8192 ms is the first full copy (done while the VM runs), 1638 ms the second round, and 0 ms is impossible because the last small set must be copied while the VM is stopped. Lesson N1.A, slide 20.|||Chương trình tính: các vòng nhỏ dần theo tỉ số tốc độ ghi ÷ tốc độ đường truyền = 0,2 — 8192, 1638, 328 và 66 MiB — và vòng 66 MiB mất 66 ms, dưới 100 ms, nên VM bị dừng khoảng 66 ms cuối (Clark và cs. đo được 60 ms cho một máy chủ game). 8192 ms là lần chép đầy đủ đầu tiên (làm khi VM đang chạy), 1638 ms là vòng thứ hai, còn 0 ms là bất khả vì tập nhỏ cuối phải chép khi VM đã dừng. Bài N1.A, slide 20.' },
    { id: 'q9',
      question: 'On a Mac running Docker Desktop, a container prints its kernel with uname -r. Which kernel is it?|||Trên một máy Mac chạy Docker Desktop, một container in nhân của nó bằng uname -r. Đó là nhân nào?',
      options: ['The macOS (Darwin) kernel of the Mac|||Nhân macOS (Darwin) của chiếc Mac', 'A private kernel that the container brought with it|||Một nhân riêng mà container mang theo', 'The Linux kernel of the small virtual machine that Docker Desktop runs|||Nhân Linux của máy ảo nhỏ mà Docker Desktop chạy', 'The kernel of the Docker program itself|||Nhân của chính chương trình Docker'],
      correctIndex: 2,
      points: 1,
      explanation: "A container has no kernel of its own — it is a process with namespaces and cgroups, and all containers share one kernel. Containers need a Linux kernel, so on Mac and Windows Docker Desktop first boots a small Linux virtual machine; <code>uname -r</code> shows that VM's kernel (here 7.0.12-linuxkit), which is why \"a container is not a lightweight VM\". Lesson N1.A, slides 1 and 4.|||Container không có nhân riêng — nó là một tiến trình có namespace và cgroup, và mọi container dùng chung một nhân. Container cần nhân Linux, nên trên Mac và Windows Docker Desktop trước hết khởi động một máy ảo Linux nhỏ; <code>uname -r</code> hiện nhân của máy ảo đó (ở đây 7.0.12-linuxkit), vì vậy \"container không phải máy ảo nhẹ\". Bài N1.A, slide 1 và 4." },
    { id: 'q10',
      question: 'Which of the following is NOT one of the five essential characteristics of cloud computing defined by NIST?|||Điều nào sau đây KHÔNG phải một trong năm đặc tính thiết yếu của điện toán đám mây theo NIST?',
      options: ['Fixed capacity|||Dung lượng cố định', 'Rapid elasticity|||Co giãn nhanh', 'Measured service|||Dịch vụ có đo đếm', 'Resource pooling|||Gom chung tài nguyên'],
      correctIndex: 0,
      points: 1,
      explanation: 'NIST SP 800-145 lists on-demand self-service, broad network access, resource pooling, rapid elasticity and measured service. "Fixed capacity" is the opposite of elasticity — the whole point of the cloud is that capacity grows and shrinks on demand and is billed by what you use. Lesson N1.A, slide 10.|||NIST SP 800-145 liệt kê tự phục vụ theo yêu cầu, truy cập mạng rộng, gom chung tài nguyên, co giãn nhanh và dịch vụ có đo đếm. "Dung lượng cố định" là điều ngược lại với co giãn — cả ý nghĩa của đám mây là dung lượng lớn lên, nhỏ đi theo nhu cầu và tính tiền theo cái bạn dùng. Bài N1.A, slide 10.' },
  ],
};

const QUIZ_LESSON = {
  title: 'Advanced 1 Quiz|||Quiz Nâng cao 1',
  slug: 'osg202-quiz-n1',
  type: 'QUIZ',
  description: '10 câu ôn Chương 7 (Ảo hoá và đám mây) theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ, câu tính toán và câu "in ra gì" có đáp án kiểm bằng bộ mô phỏng hoặc chương trình chạy thật: VMM còn gọi là gì, hypercall của paravirtualization, điều kiện Popek–Goldberg, loại hypervisor của VMware Workstation, số lần đọc bảng trang lồng, kết quả của POPF trên x86 cũ, IaaS/PaaS/SaaS, thời gian ngừng khi di trú trực tiếp, nhân mà container nhìn thấy và các đặc tính của đám mây theo NIST.',
  quiz: QUIZ,
};

export default {
  slides: [L_osg7_1],
  practice: L_on_n1,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 7 (Ảo hoá và đám mây) theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ, câu tính toán và câu "in ra gì" có đáp án kiểm bằng bộ mô phỏng hoặc chương trình chạy thật: VMM còn gọi là gì, hypercall của paravirtualization, điều kiện Popek–Goldberg, loại hypervisor của VMware Workstation, số lần đọc bảng trang lồng, kết quả của POPF trên x86 cũ, IaaS/PaaS/SaaS, thời gian ngừng khi di trú trực tiếp, nhân mà container nhìn thấy và các đặc tính của đám mây theo NIST.',
  quizLesson: QUIZ_LESSON,
};
