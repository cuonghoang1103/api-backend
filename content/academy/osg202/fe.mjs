/**
 * OSG202 · Thi cuối kỳ — 🎯 Ôn FE: chiến thuật 60 phút + chữa 3 đề mới nhất.
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs từ gen/src/**, gen/code/**, gen/sim/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node OSG202/gen/gen.mjs`.
 */

import { bi } from './_slides.mjs';

/* ───────── 🎯 FE prep — the 60-minute plan, the map of question types, every computed type ───────── */
const L_x_on_fe_chien_thuat = {
  title: '🎯 FE prep — the 60-minute plan, the map of question types, every computed type|||🎯 Ôn FE — chiến thuật 60 phút, bản đồ dạng câu, mọi dạng câu tính',
  slug: 'osg202-on-fe-chien-thuat',
  type: 'VIDEO',
  description: 'Bài ôn thi cuối kỳ tự thêm, dựa trên đếm thật 1 395 câu của 29 đề FE trong Phòng thi: chương nào chiếm bao nhiêu phần trăm, câu nào lặp lại nhiều nhất, mười hai dạng câu tính toán (lập lịch CPU, mô hình đa chương, thay trang, dịch địa chỉ, cấp phát lỗ trống, nhà băng, lập lịch đĩa, i-node và FAT, công thức một dòng) mỗi dạng có cách làm nhanh trên giấy và một câu đề thật tính lại bằng mô phỏng, phân bổ 60 phút, các bẫy chữ (NOT, EXCEPT, with và without), cách chọn khi ngân hàng mâu thuẫn, và bảng từ vựng tiếng Anh hay gặp trong đề.',
  content: [
    bi(`<span class="eyebrow">🎯 Final Exam · FE prep · strategy</span>
<h2>The FE in one paragraph</h2>
<p class="lead">The final exam is worth <strong>40%</strong> of the course, lasts <strong>60 minutes</strong>, is all <strong>multiple choice in English</strong>, and you need <strong>at least 4/10</strong> on it to pass (syllabus 13166). A real paper has 50 questions — about <strong>72 seconds per question</strong>. This lesson is built from counting, not from feelings: a program read all <strong>1 395 questions of the 29 real papers</strong> in the <a href="/exam?course=OSG202">Exam Room</a>, sorted them by chapter and by type, and every computed question shown here was recomputed by a simulator and compared with the bank's key.</p>
<p>How to use it: read sections 1–2 once (where the marks are), drill section 3 until each computed type takes you under 3 minutes on paper, then read section 4 (the 60-minute plan and the traps) the evening before the exam. After this lesson, the next one walks through a whole paper — <a href="/courses/operating-systems/learn?lessonSlug=osg202-chua-fe1">FE1 (SU26-RE), every question</a>.</p>
<table>
<thead><tr><th>Section</th><th>What you get</th><th>Time</th></tr></thead>
<tbody>
<tr><td>1</td><td>the map: share of questions per chapter, the most repeated questions</td><td>15 min</td></tr>
<tr><td>2</td><td>the question shapes and the traps of wording</td><td>10 min</td></tr>
<tr><td>3</td><td>12 computed types: paper method + one real question recomputed</td><td>2–3 h with practice</td></tr>
<tr><td>4</td><td>the 60-minute plan, conflicting bank keys, English vocabulary</td><td>20 min</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">🎯 Thi cuối kỳ · Ôn FE · chiến thuật</span>
<h2>FE trong một đoạn</h2>
<p class="lead">Thi cuối kỳ (final exam — FE) chiếm <strong>40%</strong> điểm môn, làm trong <strong>60 phút</strong>, toàn bộ là <strong>trắc nghiệm bằng tiếng Anh</strong>, và phải đạt <strong>ít nhất 4/10</strong> mới qua môn (đề cương 13166). Một đề thật có 50 câu — khoảng <strong>72 giây mỗi câu</strong>. Bài này dựng từ việc ĐẾM, không từ cảm giác: một chương trình đọc hết <strong>1 395 câu của 29 đề thật</strong> trong <a href="/exam?course=OSG202">Phòng thi</a>, xếp theo chương và theo dạng, và mọi câu tính toán trong bài đều được bộ mô phỏng tính lại rồi so với khoá (đáp án) của ngân hàng.</p>
<p>Cách dùng: đọc phần 1–2 một lần (điểm nằm ở đâu), luyện phần 3 cho tới khi mỗi dạng câu tính làm trên giấy dưới 3 phút, rồi đọc phần 4 (kế hoạch 60 phút và các bẫy) vào tối trước hôm thi. Bài kế tiếp chữa trọn một đề — <a href="/courses/operating-systems/learn?lessonSlug=osg202-chua-fe1">FE1 (SU26-RE), từng câu</a>.</p>
<table>
<thead><tr><th>Phần</th><th>Bạn có gì</th><th>Thời gian</th></tr></thead>
<tbody>
<tr><td>1</td><td>bản đồ: tỉ lệ câu theo chương, các câu lặp nhiều nhất</td><td>15 phút</td></tr>
<tr><td>2</td><td>hình dạng câu hỏi và bẫy chữ</td><td>10 phút</td></tr>
<tr><td>3</td><td>12 dạng câu tính: cách làm trên giấy + một câu thật tính lại</td><td>2–3 giờ kèm luyện</td></tr>
<tr><td>4</td><td>kế hoạch 60 phút, khoá ngân hàng mâu thuẫn, từ vựng tiếng Anh</td><td>20 phút</td></tr>
</tbody>
</table>`),
    bi(`<h2>1. The map — where the 1 395 questions come from</h2>
<p>Each question was assigned to a chapter of Tanenbaum &amp; Bos (the course book) by a keyword classifier: computed questions are recognised first by their data (a reference string, a list of cylinders, an Allocation matrix…), the others by weighted keywords in the stem and the options. About 150 questions were checked by hand to tune it, so read the percentages as <strong>estimates within a few points</strong>.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6be8a342e0cf1ec4acc41265929a1c2756490e3f.svg" alt="Share of all FE questions per chapter, counted on 29 real papers — the table links each chapter to its slide-by-slide lessons" loading="lazy" /><p class="chu-thich">🧮 Share of all FE questions per chapter, counted on 29 real papers — the table links each chapter to its slide-by-slide lessons</p></div>
<table>
<thead><tr><th>Chapter</th><th>Questions</th><th>Share</th><th>of which computed</th><th>In FE1–FE3</th><th>Lessons</th></tr></thead>
<tbody>
<tr><td>Ch.1 Introduction</td><td>163</td><td>11.7%</td><td>0</td><td>14 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a></td></tr>
<tr><td>Ch.2 Processes &amp; threads</td><td>271</td><td>19.4%</td><td>37</td><td>23 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-2">2.B</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a></td></tr>
<tr><td>Ch.3 Memory management</td><td>254</td><td>18.2%</td><td>66</td><td>20 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a></td></tr>
<tr><td>Ch.4 File systems</td><td>204</td><td>14.6%</td><td>17</td><td>17 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-2">4.B</a></td></tr>
<tr><td>Ch.5 Input/Output</td><td>278</td><td>19.9%</td><td>23</td><td>26 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a></td></tr>
<tr><td>Ch.6 Deadlocks</td><td>183</td><td>13.1%</td><td>13</td><td>22 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a></td></tr>
<tr><td>Ch.7 Virtualization &amp; cloud</td><td>14</td><td>1%</td><td>0</td><td>5 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg7-1">N1.A</a></td></tr>
<tr><td>Ch.8 Multiple processors</td><td>5</td><td>0.4%</td><td>0</td><td>0 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg8-1">8.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg8-2">8.B</a></td></tr>
<tr><td>Ch.9 Security</td><td>0</td><td>0%</td><td>0</td><td>0 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg9-1">9.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg9-2">9.B</a></td></tr>
<tr><td>Ch.10 UNIX, Linux, Android</td><td>15</td><td>1.1%</td><td>0</td><td>1 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg10-1">10.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg10-2">10.B</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg10-3">10.C</a></td></tr>
<tr><td>Ch.11 Windows</td><td>7</td><td>0.5%</td><td>0</td><td>2 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg11-1">11.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg11-2">11.B</a></td></tr>
<tr><td>Ch.12 OS design</td><td>0</td><td>0%</td><td>0</td><td>0 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg12-1">12.A</a></td></tr>
<tr><td>unclassified</td><td>1</td><td>0.1%</td><td>—</td><td>—</td><td>—</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const D = JSON.parse(readFileSync(new URL('./_de-fe.json', import.meta.url), 'utf8'));
const CAU = D.de.flatMap((d) =&gt; d.cau.map((q) =&gt; ({ ...q, de: d.de, ...phanLoai(q) })));
const MOI = new Set([1, 2, 3]);                                  // 3 đề mới nhất: FE1 SU26-RE · FE2 SP26-RE · FE3 SP26-FE
const chuan = (s) =&gt; s.toLowerCase().replace(/\\[[^\\]]*\\]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 90);</code></pre></details>
<p class="y-chinh">🎯 <strong>Chapters 1–6 make up about 97% of the FE.</strong> The three heaviest — Ch.5 I/O, Ch.2 processes &amp; threads, Ch.3 memory — are almost 60% on their own.</p>
<ul>
<li>This matches the syllabus: the FE examines LO1–LO6 = Chapters 1–6 (the ⭐ lesson <a href="/courses/operating-systems/learn?lessonSlug=osg202-hoc-the-nao">How to study OSG202</a>).</li>
<li>Chapter 7 (virtualisation) is small but <strong>not zero</strong>: FE1 alone has three questions on it (hypervisor, hypercalls, memory virtualisation). One evening on <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg7-1">N1.A</a> pays.</li>
<li>Chapters 8, 9 and 12 have essentially no FE questions; Chapters 10–11 appear only through a few Linux/Windows facts (<code>fork</code>, <code>/etc/passwd</code>, <code>ps aux</code>, Win32). They matter for the presentation and for your job — not for these 60 minutes.</li>
<li>Computed questions concentrate in Ch.3 (66) and Ch.2 (37): memory and scheduling are where the arithmetic is.</li>
</ul>
<h3>The bank repeats itself</h3>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6324f8f67689bab800fc895aea96620df74b94f8.svg" alt="1 395 questions, but only 713 different ones — and two thirds of FE1 had already appeared in another paper" loading="lazy" /><p class="chu-thich">🧮 1 395 questions, but only 713 different ones — and two thirds of FE1 had already appeared in another paper</p></div>
<table>
<thead><tr><th>#</th><th>Most repeated questions (English, as in the paper)</th><th>Papers</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>1</td><td>A computer with a 32-bit address uses a two-level page table. Virtual addresses are split into a 10-bit top-level pag…</td><td>15</td><td>Ch.3 Memory management</td></tr>
<tr><td>2</td><td>Which deadlock condition does "Take resources away" attack?</td><td>8</td><td>Ch.6 Deadlocks</td></tr>
<tr><td>3</td><td>Which file access method is often used to optimize access to large files in a file system?</td><td>7</td><td>Ch.4 File systems</td></tr>
<tr><td>4</td><td>If a process has begun to burn a Blu-ray, suddenly taking the Blu-ray recorder away from it and giving it to another …</td><td>7</td><td>Ch.6 Deadlocks</td></tr>
<tr><td>5</td><td>Which of the following information bits in the page table entry is used to indicate the types of access that are perm…</td><td>7</td><td>Ch.3 Memory management</td></tr>
<tr><td>6</td><td>Most virtual memory systems use a technique called ________?</td><td>6</td><td>Ch.3 Memory management</td></tr>
<tr><td>7</td><td>Which of the following best describes the difference between a process and a thread in the context of the Windows ope…</td><td>6</td><td>Ch.2 Processes &amp; threads</td></tr>
<tr><td>8</td><td>Which memory management technique involves dividing memory into fixed-sized partitions to accommodate varying process…</td><td>6</td><td>Ch.3 Memory management</td></tr>
<tr><td>9</td><td>Which of the following is an Operating System component?</td><td>6</td><td>Ch.2 Processes &amp; threads</td></tr>
<tr><td>10</td><td>Which of the following best describes the relationship between threads within a single process?</td><td>6</td><td>Ch.2 Processes &amp; threads</td></tr>
<tr><td>11</td><td>Disk can be divided up into one or more partitions. The first block of every partition is called:</td><td>6</td><td>Ch.4 File systems</td></tr>
<tr><td>12</td><td>A computer has 4GB RAM of which the operating system occupies 2GB. The processes are all 1024 MB and have the same ch…</td><td>6</td><td>Ch.2 Processes &amp; threads</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const D = JSON.parse(readFileSync(new URL('./_de-fe.json', import.meta.url), 'utf8'));
const CAU = D.de.flatMap((d) =&gt; d.cau.map((q) =&gt; ({ ...q, de: d.de, ...phanLoai(q) })));
const MOI = new Set([1, 2, 3]);                                  // 3 đề mới nhất: FE1 SU26-RE · FE2 SP26-RE · FE3 SP26-FE
const chuan = (s) =&gt; s.toLowerCase().replace(/\\[[^\\]]*\\]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 90);</code></pre></details>
<p>Half of all questions are re-used. One computed question — the 32-bit address with a two-level page table — is in <strong>15 of the 29 papers</strong>. That is the strongest argument for doing the three newest papers in the Exam Room under a timer: you will meet the same stems again. But do not memorise letters: the options are re-ordered between papers (FE28#30 puts "Circular wait" first where FE29#8 puts it last), and some repeats carry a <em>different</em> key (section 4.2).</p>`,
    `<h2>1. Bản đồ — 1 395 câu đến từ đâu</h2>
<p>Mỗi câu được xếp vào một chương của Tanenbaum &amp; Bos (giáo trình môn) bằng bộ phân loại từ khoá: câu tính toán nhận ra trước nhờ DỮ LIỆU (chuỗi tham chiếu, danh sách cylinder, ma trận Allocation…), câu còn lại nhờ từ khoá có trọng số trong đề và phương án. Khoảng 150 câu đã được đọc tay để chỉnh bộ phân loại, nên hãy đọc các tỉ lệ như <strong>ước lượng, sai vài điểm phần trăm</strong>.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9fcb275dfec3d9fa70b0f32e4f41cc771846dcb7.svg" alt="Tỉ lệ câu FE theo chương, đếm trên 29 đề thật — bảng có link tới các bài học theo slide của từng chương" loading="lazy" /><p class="chu-thich">🧮 Tỉ lệ câu FE theo chương, đếm trên 29 đề thật — bảng có link tới các bài học theo slide của từng chương</p></div>
<table>
<thead><tr><th>Chương</th><th>Số câu</th><th>Tỉ lệ</th><th>trong đó câu tính</th><th>Trong FE1–FE3</th><th>Bài nên ôn</th></tr></thead>
<tbody>
<tr><td>Ch.1 Nhập môn</td><td>163</td><td>11.7%</td><td>0</td><td>14 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a></td></tr>
<tr><td>Ch.2 Tiến trình &amp; luồng</td><td>271</td><td>19.4%</td><td>37</td><td>23 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-2">2.B</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a></td></tr>
<tr><td>Ch.3 Quản lý bộ nhớ</td><td>254</td><td>18.2%</td><td>66</td><td>20 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a></td></tr>
<tr><td>Ch.4 Hệ thống tệp</td><td>204</td><td>14.6%</td><td>17</td><td>17 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-2">4.B</a></td></tr>
<tr><td>Ch.5 Vào/Ra</td><td>278</td><td>19.9%</td><td>23</td><td>26 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a></td></tr>
<tr><td>Ch.6 Bế tắc</td><td>183</td><td>13.1%</td><td>13</td><td>22 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a></td></tr>
<tr><td>Ch.7 Ảo hoá &amp; đám mây</td><td>14</td><td>1%</td><td>0</td><td>5 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg7-1">N1.A</a></td></tr>
<tr><td>Ch.8 Nhiều bộ xử lý</td><td>5</td><td>0.4%</td><td>0</td><td>0 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg8-1">8.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg8-2">8.B</a></td></tr>
<tr><td>Ch.9 Bảo mật</td><td>0</td><td>0%</td><td>0</td><td>0 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg9-1">9.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg9-2">9.B</a></td></tr>
<tr><td>Ch.10 UNIX, Linux, Android</td><td>15</td><td>1.1%</td><td>0</td><td>1 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg10-1">10.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg10-2">10.B</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg10-3">10.C</a></td></tr>
<tr><td>Ch.11 Windows</td><td>7</td><td>0.5%</td><td>0</td><td>2 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg11-1">11.A</a> · <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg11-2">11.B</a></td></tr>
<tr><td>Ch.12 Thiết kế HĐH</td><td>0</td><td>0%</td><td>0</td><td>0 / 130</td><td><a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg12-1">12.A</a></td></tr>
<tr><td>chưa phân loại được</td><td>1</td><td>0.1%</td><td>—</td><td>—</td><td>—</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const D = JSON.parse(readFileSync(new URL('./_de-fe.json', import.meta.url), 'utf8'));
const CAU = D.de.flatMap((d) =&gt; d.cau.map((q) =&gt; ({ ...q, de: d.de, ...phanLoai(q) })));
const MOI = new Set([1, 2, 3]);                                  // 3 đề mới nhất: FE1 SU26-RE · FE2 SP26-RE · FE3 SP26-FE
const chuan = (s) =&gt; s.toLowerCase().replace(/\\[[^\\]]*\\]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 90);</code></pre></details>
<p class="y-chinh">🎯 <strong>Chương 1–6 chiếm khoảng 97% đề FE.</strong> Ba chương nặng nhất — Ch.5 vào/ra, Ch.2 tiến trình &amp; luồng, Ch.3 bộ nhớ — riêng chúng đã gần 60%.</p>
<ul>
<li>Khớp với đề cương: FE thi LO1–LO6 = Chương 1–6 (bài ⭐ <a href="/courses/operating-systems/learn?lessonSlug=osg202-hoc-the-nao">Học OSG202 thế nào</a>).</li>
<li>Chương 7 (ảo hoá) ít nhưng <strong>không bằng 0</strong>: riêng FE1 có ba câu (hypervisor, hypercall, ảo hoá bộ nhớ). Bỏ một buổi tối cho <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg7-1">N1.A</a> là đáng.</li>
<li>Chương 8, 9, 12 gần như không có câu FE; Chương 10–11 chỉ xuất hiện qua vài sự kiện Linux/Windows (<code>fork</code>, <code>/etc/passwd</code>, <code>ps aux</code>, Win32). Chúng quan trọng cho bài thuyết trình và cho công việc — không phải cho 60 phút này.</li>
<li>Câu tính toán dồn vào Ch.3 (66 câu) và Ch.2 (37 câu): bộ nhớ và lập lịch là nơi có số học.</li>
</ul>
<h3>Ngân hàng tự lặp lại</h3>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ee8011c0a24adaf6faa78bbf7429f43029783941.svg" alt="1 395 câu nhưng chỉ 713 câu khác nhau — và hai phần ba FE1 đã từng xuất hiện ở đề khác" loading="lazy" /><p class="chu-thich">🧮 1 395 câu nhưng chỉ 713 câu khác nhau — và hai phần ba FE1 đã từng xuất hiện ở đề khác</p></div>
<table>
<thead><tr><th>#</th><th>Câu lặp nhiều nhất (tiếng Anh, như trong đề)</th><th>Số đề</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>1</td><td>A computer with a 32-bit address uses a two-level page table. Virtual addresses are split into a 10-bit top-level pag…</td><td>15</td><td>Ch.3 Quản lý bộ nhớ</td></tr>
<tr><td>2</td><td>Which deadlock condition does "Take resources away" attack?</td><td>8</td><td>Ch.6 Bế tắc</td></tr>
<tr><td>3</td><td>Which file access method is often used to optimize access to large files in a file system?</td><td>7</td><td>Ch.4 Hệ thống tệp</td></tr>
<tr><td>4</td><td>If a process has begun to burn a Blu-ray, suddenly taking the Blu-ray recorder away from it and giving it to another …</td><td>7</td><td>Ch.6 Bế tắc</td></tr>
<tr><td>5</td><td>Which of the following information bits in the page table entry is used to indicate the types of access that are perm…</td><td>7</td><td>Ch.3 Quản lý bộ nhớ</td></tr>
<tr><td>6</td><td>Most virtual memory systems use a technique called ________?</td><td>6</td><td>Ch.3 Quản lý bộ nhớ</td></tr>
<tr><td>7</td><td>Which of the following best describes the difference between a process and a thread in the context of the Windows ope…</td><td>6</td><td>Ch.2 Tiến trình &amp; luồng</td></tr>
<tr><td>8</td><td>Which memory management technique involves dividing memory into fixed-sized partitions to accommodate varying process…</td><td>6</td><td>Ch.3 Quản lý bộ nhớ</td></tr>
<tr><td>9</td><td>Which of the following is an Operating System component?</td><td>6</td><td>Ch.2 Tiến trình &amp; luồng</td></tr>
<tr><td>10</td><td>Which of the following best describes the relationship between threads within a single process?</td><td>6</td><td>Ch.2 Tiến trình &amp; luồng</td></tr>
<tr><td>11</td><td>Disk can be divided up into one or more partitions. The first block of every partition is called:</td><td>6</td><td>Ch.4 Hệ thống tệp</td></tr>
<tr><td>12</td><td>A computer has 4GB RAM of which the operating system occupies 2GB. The processes are all 1024 MB and have the same ch…</td><td>6</td><td>Ch.2 Tiến trình &amp; luồng</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const D = JSON.parse(readFileSync(new URL('./_de-fe.json', import.meta.url), 'utf8'));
const CAU = D.de.flatMap((d) =&gt; d.cau.map((q) =&gt; ({ ...q, de: d.de, ...phanLoai(q) })));
const MOI = new Set([1, 2, 3]);                                  // 3 đề mới nhất: FE1 SU26-RE · FE2 SP26-RE · FE3 SP26-FE
const chuan = (s) =&gt; s.toLowerCase().replace(/\\[[^\\]]*\\]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 90);</code></pre></details>
<p>Một nửa số câu là câu dùng lại. Một câu tính — địa chỉ 32 bit với bảng trang hai mức — có mặt trong <strong>15 trên 29 đề</strong>. Đó là lý do mạnh nhất để làm ba đề mới nhất trong Phòng thi có bấm giờ: bạn sẽ gặp lại đúng những đề bài đó. Nhưng đừng học thuộc chữ cái đáp án: thứ tự phương án bị xáo giữa các đề (FE28#30 để "Circular wait" đầu tiên, FE29#8 để cuối), và vài câu lặp lại mang khoá KHÁC nhau (mục 4.2).</p>`),
    bi(`<h2>2. The shapes of a question — and the traps of wording</h2>
<p>Almost every question is one of four shapes: <strong>definition → name</strong> ("Time to move the arm to the proper cylinder is called?" — seek time), <strong>name → property</strong> ("What is the effect of using interrupts instead of polling?"), <strong>which statement is true / NOT true</strong>, and <strong>compute</strong> (section 3). The first two are 1-minute questions if you learned the slide's vocabulary; the third is where people lose marks by reading too fast.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/673470d5fb0880dbba2902a6abb91446c2281691.svg" alt="Features of the 1 395 questions, and how often an &quot;All of…&quot;, &quot;None of…&quot;, &quot;Both…&quot; or longest option is the bank's key" loading="lazy" /><p class="chu-thich">🧮 Features of the 1 395 questions, and how often an "All of…", "None of…", "Both…" or longest option is the bank's key</p></div>
<table>
<thead><tr><th>Question feature</th><th>Questions</th><th>Share</th></tr></thead>
<tbody>
<tr><td>negative stem (NOT, EXCEPT, incorrect, false, least…)</td><td>139</td><td>10%</td></tr>
<tr><td>…of which written in CAPITALS (NOT / EXCEPT)</td><td>20</td><td>1.4%</td></tr>
<tr><td>fill in the blank (____)</td><td>187</td><td>13.4%</td></tr>
<tr><td>choose TWO answers</td><td>11</td><td>0.8%</td></tr>
<tr><td>five options (A–E)</td><td>38</td><td>2.7%</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const D = JSON.parse(readFileSync(new URL('./_de-fe.json', import.meta.url), 'utf8'));
const CAU = D.de.flatMap((d) =&gt; d.cau.map((q) =&gt; ({ ...q, de: d.de, ...phanLoai(q) })));
const MOI = new Set([1, 2, 3]);                                  // 3 đề mới nhất: FE1 SU26-RE · FE2 SP26-RE · FE3 SP26-FE
const chuan = (s) =&gt; s.toLowerCase().replace(/\\[[^\\]]*\\]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 90);</code></pre></details>
<ul>
<li><strong>One question in ten asks for the FALSE statement</strong> (NOT, EXCEPT, incorrect, false, least). Only 20 of them shout it in capitals; the rest hide it — "Which of the following is <em>not</em> a benefit of segmentation?" (FE1#26). Circle the negative word on the paper before reading the options.</li>
<li><strong>with / without</strong> — the same nonpreemptable-resource question exists with "…cannot be taken away … <em>without</em> potentially causing failure" (FE7#42, the book's wording) and with "<em>with</em> potentially causing failure" (FE8#42 and three more papers — the bank's typo). Read every option to the end: two options often differ by one word.</li>
<li><strong>One in seven is fill-in-the-blank</strong> ("Most virtual memory systems use a technique called ____") — read the sentence with each option plugged in; grammar often kills two options.</li>
<li><strong>Typos are not traps</strong>: "preemtable" (FE1#17) means preemptable; "Hypovisor" (FE1#20) is a distractor that does not exist — the real word is <em>hypervisor</em>.</li>
<li><strong>Choose TWO</strong> appears in 11 questions; the platform only scores it if both are picked.</li>
</ul>
<p class="pitfall">⚠️ The chart above is a habit of the bank's authors, not a rule of operating systems. Use it <strong>only</strong> for a question you cannot reason about at all: an "All of the above" option was the key 60% of the time, "None of the above" only 7%, the longest option 39% (against 25% for a blind guess). Knowing the slide always beats this.</p>`,
    `<h2>2. Hình dạng một câu hỏi — và bẫy chữ</h2>
<p>Gần như mọi câu thuộc một trong bốn dạng: <strong>định nghĩa → tên</strong> ("Thời gian di chuyển cần tới đúng cylinder gọi là?" — seek time), <strong>tên → tính chất</strong> ("Dùng ngắt thay cho thăm dò (polling) thì được gì?"), <strong>phát biểu nào đúng / KHÔNG đúng</strong>, và <strong>tính toán</strong> (phần 3). Hai dạng đầu là câu 1 phút nếu bạn đã thuộc từ vựng của slide; dạng thứ ba là chỗ người ta mất điểm vì đọc quá nhanh.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fd93ce776be0ee690da551380af8dd39b1cf7a48.svg" alt="Đặc điểm của 1 395 câu, và tỉ lệ phương án &quot;All of…&quot;, &quot;None of…&quot;, &quot;Both…&quot; hay phương án dài nhất là khoá ngân hàng" loading="lazy" /><p class="chu-thich">🧮 Đặc điểm của 1 395 câu, và tỉ lệ phương án "All of…", "None of…", "Both…" hay phương án dài nhất là khoá ngân hàng</p></div>
<table>
<thead><tr><th>Đặc điểm câu</th><th>Số câu</th><th>Tỉ lệ</th></tr></thead>
<tbody>
<tr><td>đề hỏi PHỦ ĐỊNH (NOT, EXCEPT, incorrect, false, least…)</td><td>139</td><td>10%</td></tr>
<tr><td>…trong đó viết HOA (NOT / EXCEPT)</td><td>20</td><td>1.4%</td></tr>
<tr><td>điền chỗ trống (____)</td><td>187</td><td>13.4%</td></tr>
<tr><td>chọn HAI đáp án</td><td>11</td><td>0.8%</td></tr>
<tr><td>năm phương án (A–E)</td><td>38</td><td>2.7%</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const D = JSON.parse(readFileSync(new URL('./_de-fe.json', import.meta.url), 'utf8'));
const CAU = D.de.flatMap((d) =&gt; d.cau.map((q) =&gt; ({ ...q, de: d.de, ...phanLoai(q) })));
const MOI = new Set([1, 2, 3]);                                  // 3 đề mới nhất: FE1 SU26-RE · FE2 SP26-RE · FE3 SP26-FE
const chuan = (s) =&gt; s.toLowerCase().replace(/\\[[^\\]]*\\]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 90);</code></pre></details>
<ul>
<li><strong>Cứ mười câu có một câu hỏi phát biểu SAI</strong> (NOT, EXCEPT, incorrect, false, least). Chỉ 20 câu viết hoa cho bạn thấy; còn lại giấu trong chữ thường — "Which of the following is <em>not</em> a benefit of segmentation?" (FE1#26). Khoanh từ phủ định trên giấy nháp trước khi đọc phương án.</li>
<li><strong>with / without</strong> — cùng một câu về tài nguyên không trưng dụng được (nonpreemptable) có bản "…cannot be taken away … <em>without</em> potentially causing failure" (FE7#42, đúng chữ của sách) và bản "<em>with</em> potentially causing failure" (FE8#42 và ba đề khác — lỗi gõ của ngân hàng). Đọc mọi phương án tới chữ cuối: hai phương án thường chỉ khác nhau một từ.</li>
<li><strong>Cứ bảy câu có một câu điền chỗ trống</strong> ("Most virtual memory systems use a technique called ____") — đọc cả câu với từng phương án lắp vào; ngữ pháp thường loại được hai phương án.</li>
<li><strong>Lỗi chính tả không phải bẫy</strong>: "preemtable" (FE1#17) nghĩa là preemptable (trưng dụng được); "Hypovisor" (FE1#20) là phương án nhiễu không có thật — từ đúng là <em>hypervisor</em>.</li>
<li><strong>Chọn HAI đáp án</strong> có ở 11 câu; hệ thống chỉ cho điểm khi chọn đủ cả hai.</li>
</ul>
<p class="pitfall">⚠️ Biểu đồ trên là thói quen của người soạn ngân hàng, không phải quy luật của hệ điều hành. CHỈ dùng nó cho câu bạn hoàn toàn không suy luận được: phương án "All of the above" là khoá 60% số lần, "None of the above" chỉ 7%, phương án dài nhất 39% (so với 25% nếu đoán mò). Thuộc slide luôn thắng mẹo này.</p>`),
    bi(`<h2>3. The computed questions — twelve types, one method each</h2>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8679a21dbbe7c95ac9631ddfbddc41904e124637.svg" alt="The computed types across 29 papers: how many questions, how many papers — the table names the ones in FE1–FE3" loading="lazy" /><p class="chu-thich">🧮 The computed types across 29 papers: how many questions, how many papers — the table names the ones in FE1–FE3</p></div>
<table>
<thead><tr><th>Code</th><th>Type</th><th>Chapter</th><th>Questions</th><th>Papers</th><th>In FE1–FE3</th></tr></thead>
<tbody>
<tr><td><code>dia-chi-tinh</code></td><td>Address translation, page-table size, TLB / effective access time</td><td>Ch.3 Memory management</td><td>34</td><td>23</td><td>FE2#45, FE3#16</td></tr>
<tr><td><code>cpu-tinh</code></td><td>CPU scheduling: Gantt chart, waiting / turnaround time</td><td>Ch.2 Processes &amp; threads</td><td>19</td><td>13</td><td>—</td></tr>
<tr><td><code>trang-tinh</code></td><td>Page replacement: count page faults (FIFO / LRU / OPT / Clock)</td><td>Ch.3 Memory management</td><td>18</td><td>12</td><td>FE3#17</td></tr>
<tr><td><code>tep-tinh</code></td><td>File system numbers: i-node pointers, FAT size, block size, max file</td><td>Ch.4 File systems</td><td>17</td><td>14</td><td>FE3#26</td></tr>
<tr><td><code>da-chuong-tinh</code></td><td>Modelling multiprogramming: CPU utilization = 1 − pⁿ</td><td>Ch.2 Processes &amp; threads</td><td>17</td><td>14</td><td>FE3#9</td></tr>
<tr><td><code>dia-tinh</code></td><td>Disk-arm scheduling: total head movement / seek time</td><td>Ch.5 Input/Output</td><td>14</td><td>10</td><td>FE1#9, FE1#13</td></tr>
<tr><td><code>cap-phat-tinh</code></td><td>Contiguous allocation: first / best / worst / next fit</td><td>Ch.3 Memory management</td><td>14</td><td>14</td><td>FE3#23</td></tr>
<tr><td><code>banker-tinh</code></td><td>Banker’s algorithm / deadlock detection with matrices</td><td>Ch.6 Deadlocks</td><td>13</td><td>9</td><td>FE1#27, FE1#28, FE2#46, FE2#48, FE3#36, FE3#48</td></tr>
<tr><td><code>io-tinh</code></td><td>I/O speed: characters per second, interrupt cost</td><td>Ch.5 Input/Output</td><td>4</td><td>4</td><td>—</td></tr>
<tr><td><code>raid-tinh</code></td><td>Disk geometry numbers (cylinder skew, RAID capacity)</td><td>Ch.5 Input/Output</td><td>3</td><td>3</td><td>—</td></tr>
<tr><td><code>dong-ho-tinh</code></td><td>Programmable clock: holding-register value</td><td>Ch.5 Input/Output</td><td>2</td><td>2</td><td>—</td></tr>
<tr><td><code>luong-tinh</code></td><td>Threads: server throughput with/without threads</td><td>Ch.2 Processes &amp; threads</td><td>1</td><td>1</td><td>FE2#3</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const D = JSON.parse(readFileSync(new URL('./_de-fe.json', import.meta.url), 'utf8'));
const CAU = D.de.flatMap((d) =&gt; d.cau.map((q) =&gt; ({ ...q, de: d.de, ...phanLoai(q) })));
const MOI = new Set([1, 2, 3]);                                  // 3 đề mới nhất: FE1 SU26-RE · FE2 SP26-RE · FE3 SP26-FE
const chuan = (s) =&gt; s.toLowerCase().replace(/\\[[^\\]]*\\]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 90);</code></pre></details>
<p class="y-chinh">🎯 Every one of the 29 papers has computed questions — about 5 per paper, i.e. roughly <strong>1 point out of 10</strong>. They are the slowest questions and the easiest to get completely right, because the method never changes.</p>
<p>Below, each type has: the <strong>method on paper</strong> (what to write, in order), <strong>one real question recomputed</strong> by the course simulator (its answer was compared with the bank's key — a mismatch would stop the page from being built), and the trap. Under each picture, "see the simulator code" shows exactly what was computed.</p>
<h3>3.1 CPU scheduling — Gantt chart, waiting and turnaround time (Ch.2, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>)</h3>
<ol>
<li>Copy the table: process, arrival, burst (run time). Note the algorithm and, for RR, the quantum.</li>
<li>Draw one time line and fill it block by block: FCFS = arrival order; SJF = shortest burst <em>among those that have arrived</em>; SRTF = re-decide at every arrival; RR = queue, q units each, a newcomer joins the queue <em>before</em> the process whose quantum just expired.</li>
<li>Write the time under every block boundary. Then per process: <strong>turnaround = finish − arrival</strong>, <strong>waiting = turnaround − burst</strong>. Average = sum ÷ n.</li>
</ol>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/889124904ac9b7ce2a5bff4b926962d45cb3a9e5.svg" alt="FE18#16 (also FE19#45, FE21#31, FE24#15, FE27#24, FE29#3): five batch jobs A–E, FCFS" loading="lazy" /><p class="chu-thich">🧮 FE18#16 (also FE19#45, FE21#31, FE24#15, FE27#24, FE29#3): five batch jobs A–E, FCFS</p></div>
<table>
<thead><tr><th>Job</th><th>Run</th><th>Finishes at</th><th>Turnaround = finish − 0</th></tr></thead>
<tbody>
<tr><td>A</td><td>8</td><td>8</td><td>8</td></tr>
<tr><td>B</td><td>6</td><td>14</td><td>14</td></tr>
<tr><td>C</td><td>2</td><td>16</td><td>16</td></tr>
<tr><td>D</td><td>10</td><td>26</td><td>26</td></tr>
<tr><td>E</td><td>4</td><td>30</td><td>30</td></tr>
<tr><td colspan="3"><strong>Average</strong></td><td><strong>8 + 14 + 16 + 26 + 30 = 94 ÷ 5 = 18.8</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<p class="pitfall">⚠️ Read what is asked: <em>turnaround</em> (finish − arrival) or <em>waiting</em> (turnaround − burst) — the options always contain both. "Almost the same time" means all arrive at 0, in the listed order. If the question gives a picture of the table (FE9#16), copy it before computing.</p>`,
    `<h2>3. Câu tính toán — mười hai dạng, mỗi dạng một cách làm</h2>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3f82aac668716166cf8827d0ede293a67ec5df74.svg" alt="Các dạng câu tính trên 29 đề: bao nhiêu câu, có ở bao nhiêu đề — bảng ghi rõ câu nào nằm trong FE1–FE3" loading="lazy" /><p class="chu-thich">🧮 Các dạng câu tính trên 29 đề: bao nhiêu câu, có ở bao nhiêu đề — bảng ghi rõ câu nào nằm trong FE1–FE3</p></div>
<table>
<thead><tr><th>Mã</th><th>Dạng</th><th>Chương</th><th>Số câu</th><th>Số đề</th><th>Trong FE1–FE3</th></tr></thead>
<tbody>
<tr><td><code>dia-chi-tinh</code></td><td>Dịch địa chỉ, cỡ bảng trang, TLB / thời gian truy cập hiệu dụng</td><td>Ch.3 Quản lý bộ nhớ</td><td>34</td><td>23</td><td>FE2#45, FE3#16</td></tr>
<tr><td><code>cpu-tinh</code></td><td>Lập lịch CPU: biểu đồ Gantt, thời gian chờ / hoàn thành</td><td>Ch.2 Tiến trình &amp; luồng</td><td>19</td><td>13</td><td>—</td></tr>
<tr><td><code>trang-tinh</code></td><td>Thay trang: đếm lỗi trang (FIFO / LRU / OPT / Clock)</td><td>Ch.3 Quản lý bộ nhớ</td><td>18</td><td>12</td><td>FE3#17</td></tr>
<tr><td><code>tep-tinh</code></td><td>Số liệu hệ thống tệp: con trỏ i-node, cỡ FAT, cỡ khối, tệp tối đa</td><td>Ch.4 Hệ thống tệp</td><td>17</td><td>14</td><td>FE3#26</td></tr>
<tr><td><code>da-chuong-tinh</code></td><td>Mô hình đa chương: hiệu suất CPU = 1 − pⁿ</td><td>Ch.2 Tiến trình &amp; luồng</td><td>17</td><td>14</td><td>FE3#9</td></tr>
<tr><td><code>dia-tinh</code></td><td>Lập lịch đầu từ: tổng quãng / thời gian tìm</td><td>Ch.5 Vào/Ra</td><td>14</td><td>10</td><td>FE1#9, FE1#13</td></tr>
<tr><td><code>cap-phat-tinh</code></td><td>Cấp phát liên tục: first / best / worst / next fit</td><td>Ch.3 Quản lý bộ nhớ</td><td>14</td><td>14</td><td>FE3#23</td></tr>
<tr><td><code>banker-tinh</code></td><td>Nhà băng / phát hiện bế tắc với ma trận</td><td>Ch.6 Bế tắc</td><td>13</td><td>9</td><td>FE1#27, FE1#28, FE2#46, FE2#48, FE3#36, FE3#48</td></tr>
<tr><td><code>io-tinh</code></td><td>Tốc độ I/O: ký tự/giây, chi phí ngắt</td><td>Ch.5 Vào/Ra</td><td>4</td><td>4</td><td>—</td></tr>
<tr><td><code>raid-tinh</code></td><td>Số liệu hình học đĩa (cylinder skew, dung lượng RAID)</td><td>Ch.5 Vào/Ra</td><td>3</td><td>3</td><td>—</td></tr>
<tr><td><code>dong-ho-tinh</code></td><td>Đồng hồ lập trình được: giá trị thanh ghi giữ</td><td>Ch.5 Vào/Ra</td><td>2</td><td>2</td><td>—</td></tr>
<tr><td><code>luong-tinh</code></td><td>Luồng: thông lượng server có/không đa luồng</td><td>Ch.2 Tiến trình &amp; luồng</td><td>1</td><td>1</td><td>FE2#3</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const D = JSON.parse(readFileSync(new URL('./_de-fe.json', import.meta.url), 'utf8'));
const CAU = D.de.flatMap((d) =&gt; d.cau.map((q) =&gt; ({ ...q, de: d.de, ...phanLoai(q) })));
const MOI = new Set([1, 2, 3]);                                  // 3 đề mới nhất: FE1 SU26-RE · FE2 SP26-RE · FE3 SP26-FE
const chuan = (s) =&gt; s.toLowerCase().replace(/\\[[^\\]]*\\]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 90);</code></pre></details>
<p class="y-chinh">🎯 Cả 29 đề đều có câu tính — khoảng 5 câu mỗi đề, tức chừng <strong>1 điểm trên 10</strong>. Đó là những câu chậm nhất nhưng cũng dễ đúng trọn nhất, vì cách làm không bao giờ đổi.</p>
<p>Dưới đây mỗi dạng có: <strong>cách làm trên giấy</strong> (viết gì, theo thứ tự nào), <strong>một câu đề thật được tính lại</strong> bằng bộ mô phỏng của môn (đáp án đã so với khoá ngân hàng — lệch là trang không dựng được), và bẫy. Dưới mỗi hình, mục "xem mã mô phỏng" cho thấy chính xác máy đã tính gì.</p>
<h3>3.1 Lập lịch CPU — biểu đồ Gantt, thời gian chờ và thời gian hoàn thành (Ch.2, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>)</h3>
<ol>
<li>Chép bảng: tiến trình, thời điểm đến (arrival), thời gian chạy (burst). Ghi thuật toán và, với RR, lượng tử (quantum).</li>
<li>Vẽ một trục thời gian và lấp từng khối: FCFS = theo thứ tự đến; SJF = burst ngắn nhất <em>trong số đã đến</em>; SRTF = quyết lại mỗi khi có tiến trình mới đến; RR = hàng đợi, mỗi lượt q đơn vị, tiến trình mới đến vào hàng <em>trước</em> tiến trình vừa hết lượng tử.</li>
<li>Ghi thời điểm dưới mọi ranh giới khối. Rồi với từng tiến trình: <strong>hoàn thành (turnaround) = lúc xong − lúc đến</strong>, <strong>chờ (waiting) = hoàn thành − burst</strong>. Trung bình = tổng ÷ n.</li>
</ol>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/199d08ec5c94d02fd9c24ac6bfed56a1395d2ea5.svg" alt="FE18#16 (cũng là FE19#45, FE21#31, FE24#15, FE27#24, FE29#3): năm việc A–E, FCFS" loading="lazy" /><p class="chu-thich">🧮 FE18#16 (cũng là FE19#45, FE21#31, FE24#15, FE27#24, FE29#3): năm việc A–E, FCFS</p></div>
<table>
<thead><tr><th>Việc</th><th>Chạy</th><th>Xong lúc</th><th>Hoàn thành = xong − 0</th></tr></thead>
<tbody>
<tr><td>A</td><td>8</td><td>8</td><td>8</td></tr>
<tr><td>B</td><td>6</td><td>14</td><td>14</td></tr>
<tr><td>C</td><td>2</td><td>16</td><td>16</td></tr>
<tr><td>D</td><td>10</td><td>26</td><td>26</td></tr>
<tr><td>E</td><td>4</td><td>30</td><td>30</td></tr>
<tr><td colspan="3"><strong>Trung bình</strong></td><td><strong>8 + 14 + 16 + 26 + 30 = 94 ÷ 5 = 18.8</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<p class="pitfall">⚠️ Đọc đúng thứ được hỏi: <em>turnaround</em> (xong − đến) hay <em>waiting</em> (turnaround − burst) — phương án luôn có cả hai. "Almost the same time" nghĩa là cùng đến lúc 0, theo thứ tự liệt kê. Đề cho bảng bằng hình (FE9#16) thì chép bảng ra giấy trước khi tính.</p>`),
    bi(`<h3>3.2 Modelling multiprogramming — CPU utilization = 1 − pⁿ (Ch.2, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 12)</h3>
<ol>
<li>n = how many processes fit in memory: (RAM − OS) ÷ process size, <strong>rounded down</strong> (2 GB − 1 GB = 1 024 MB holds two 450 MB processes, not 2.27).</li>
<li>p = fraction of time a process waits for I/O (given as %).</li>
<li>CPU busy = <strong>1 − pⁿ</strong>; CPU wasted (idle) = <strong>pⁿ</strong>. Check which one the question asks.</li>
</ol>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/66979f9d3ca7ba17b6aeb66d9026a70488684015.svg" alt="FE5#11 (also FE7#10, FE8#10, FE12#8, FE13#8, FE16#11): 4 GB RAM, OS 2 GB, processes 1 GB, 50% I/O wait" loading="lazy" /><p class="chu-thich">🧮 FE5#11 (also FE7#10, FE8#10, FE12#8, FE13#8, FE16#11): 4 GB RAM, OS 2 GB, processes 1 GB, 50% I/O wait</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<p class="pitfall">⚠️ "How many percent of the CPU time is <em>wasted</em>" = pⁿ (FE21#6: 10% wait, two programs ⇒ 1%), "how many percent is CPU <em>utilization</em>" = 1 − pⁿ (FE20#36 ⇒ 99%). FE20#21 says "multiple programs" without a number; its key (1%) silently assumes two. And FE1#22 asks the shape of the curve in a real system: utilization rises, then <strong>falls</strong> once memory is over-committed (thrashing, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>) — the formula alone only rises.</p>
<h3>3.3 Page replacement — count page faults (Ch.3, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 20–29)</h3>
<ol>
<li>Write the reference string across the top, one column per reference, and one row per frame.</li>
<li>Column by column: already in a frame ⇒ hit (✓). Not there ⇒ <strong>fault</strong> (F); if a frame is empty, fill it — <strong>these first loads count as faults</strong>.</li>
<li>No empty frame ⇒ evict: <strong>FIFO</strong> the page loaded earliest; <strong>LRU</strong> the page used least recently (look <em>left</em>); <strong>OPT</strong> the page whose next use is farthest (look <em>right</em>); <strong>Clock</strong> sweep the hand, clearing R = 1 to 0, evict the first R = 0.</li>
<li>Count the F's.</li>
</ol>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/698151f36e1b730f30718b19bbc1816a91bd832b.svg" alt="FE5#23 (also FE12#20, FE16#27): LRU with three frames, 7 0 1 2 0 3" loading="lazy" /><p class="chu-thich">🧮 FE5#23 (also FE12#20, FE16#27): LRU with three frames, 7 0 1 2 0 3</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<p class="pitfall">⚠️ "0172327103" is a reference string written without spaces — ten references, not one number (FE3#17 = FE1 original question 17). FIFO can get <em>worse</em> with more frames (Belady's anomaly, FE4#19 → FIFO); LRU and OPT never do.</p>`,
    `<h3>3.2 Mô hình đa chương — hiệu suất CPU = 1 − pⁿ (Ch.2, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 12)</h3>
<ol>
<li>n = số tiến trình vừa bộ nhớ: (RAM − HĐH) ÷ cỡ tiến trình, <strong>làm tròn XUỐNG</strong> (2 GB − 1 GB = 1 024 MB chứa được hai tiến trình 450 MB, không phải 2,27).</li>
<li>p = tỉ lệ thời gian một tiến trình chờ I/O (đề cho bằng %).</li>
<li>CPU bận = <strong>1 − pⁿ</strong>; CPU phí (rảnh) = <strong>pⁿ</strong>. Xem đề hỏi cái nào.</li>
</ol>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1f6e1645a2272efb01b2497d0fa497f6be63b794.svg" alt="FE5#11 (cũng là FE7#10, FE8#10, FE12#8, FE13#8, FE16#11): RAM 4 GB, HĐH 2 GB, tiến trình 1 GB, chờ I/O 50%" loading="lazy" /><p class="chu-thich">🧮 FE5#11 (cũng là FE7#10, FE8#10, FE12#8, FE13#8, FE16#11): RAM 4 GB, HĐH 2 GB, tiến trình 1 GB, chờ I/O 50%</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<p class="pitfall">⚠️ "How many percent of the CPU time is <em>wasted</em>" (bao nhiêu % thời gian CPU bị phí) = pⁿ (FE21#6: chờ 10%, hai chương trình ⇒ 1%), "how many percent is CPU <em>utilization</em>" (hiệu suất CPU) = 1 − pⁿ (FE20#36 ⇒ 99%). FE20#21 ghi "multiple programs" (nhiều chương trình) mà không cho số; khoá 1% của nó ngầm định là hai. Còn FE1#22 hỏi hình dạng đường cong trong hệ thống thật: hiệu suất tăng rồi <strong>giảm</strong> khi bộ nhớ bị nhồi quá tải (thrashing, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>) — riêng công thức thì chỉ đi lên.</p>
<h3>3.3 Thay trang — đếm lỗi trang (Ch.3, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 20–29)</h3>
<ol>
<li>Viết chuỗi tham chiếu (reference string) ngang trên cùng, mỗi tham chiếu một cột, mỗi khung trang (frame) một hàng.</li>
<li>Từng cột: trang đã có trong khung ⇒ trúng (✓). Chưa có ⇒ <strong>lỗi trang</strong> (F); còn khung trống thì lấp vào — <strong>những lần nạp đầu này VẪN tính là lỗi trang</strong>.</li>
<li>Hết khung trống ⇒ đẩy một trang ra: <strong>FIFO</strong> trang nạp sớm nhất; <strong>LRU</strong> trang lâu nhất chưa dùng (nhìn sang <em>trái</em>); <strong>OPT</strong> trang mà lần dùng kế tiếp xa nhất (nhìn sang <em>phải</em>); <strong>Clock</strong> quay kim, gặp R = 1 thì xoá về 0, đẩy trang R = 0 đầu tiên.</li>
<li>Đếm số chữ F.</li>
</ol>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/27bf25342a459e88200960e32bbd48131532ed93.svg" alt="FE5#23 (cũng là FE12#20, FE16#27): LRU ba khung, 7 0 1 2 0 3" loading="lazy" /><p class="chu-thich">🧮 FE5#23 (cũng là FE12#20, FE16#27): LRU ba khung, 7 0 1 2 0 3</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<p class="pitfall">⚠️ "0172327103" là chuỗi tham chiếu viết liền không cách — mười tham chiếu, không phải một con số (FE3#17 = câu 17 đề gốc FE1). FIFO có thể TỆ hơn khi thêm khung (nghịch lý Belady, FE4#19 → FIFO); LRU và OPT thì không bao giờ.</p>`),
    bi(`<h3>3.4 Addresses — page number, offset, levels, table size (Ch.3, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 12–18)</h3>
<p>Everything here is one rule: <strong>an address is a row of bits cut into fields</strong>. Offset bits = log₂(page size). The fields on the left index the page table(s).</p>
<ul>
<li><strong>Page size from a split</strong>: offset = total − the table fields; page = 2^offset.</li>
<li><strong>Page number in hex</strong>: a 2^12 page ⇒ 12 offset bits = the last 3 hex digits; cut them off.</li>
<li><strong>Logical address length</strong> = log₂(pages) + log₂(page size): 128 pages × 32 K words = 7 + 15 = 22 bits (FE20#45).</li>
<li><strong>Page-table size</strong> = number of pages × entry size: 2^32 ÷ 16 KB = 2^18 entries × 4 B = 1 MB (FE28#23).</li>
</ul>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b536721af7f54823b5bef5b98912d630839cc5d7.svg" alt="FE3#16 — the most repeated question of the whole bank (15 papers): 32-bit address, 10-bit and 12-bit table fields" loading="lazy" /><p class="chu-thich">🧮 FE3#16 — the most repeated question of the whole bank (15 papers): 32-bit address, 10-bit and 12-bit table fields</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/40c69094f181708d653e3160ef3aa5eea54ffc6b.svg" alt="FE18#11 (also FE20#12, FE25#45, and variants with 2^28, 2^32 in FE21#11, FE22#3)" loading="lazy" /><p class="chu-thich">🧮 FE18#11 (also FE20#12, FE25#45, and variants with 2^28, 2^32 in FE21#11, FE22#3)</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<p class="pitfall">⚠️ The variants of FE3#16 change the field widths (9 + 11, 10 + 10, 9 + 12…): never memorise "1 KB", recompute 2^(32 − a − b) every time. "Words" and "bytes" are just units — the bit count is the same arithmetic.</p>
<h3>3.5 Contiguous allocation — first, next, best, worst fit (Ch.3, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 9–10)</h3>
<ol>
<li>Write the holes in address order. For each request, mark the holes that are big enough.</li>
<li><strong>First fit</strong> = the first big-enough hole; <strong>next fit</strong> = the same, but start from where the last search stopped; <strong>best fit</strong> = the smallest big-enough hole; <strong>worst fit</strong> = the largest hole.</li>
<li>Cut the request out of the chosen hole and <strong>keep the remainder as a smaller hole</strong> for the next request.</li>
</ol>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f78dd1c838244fbd9c0e69343120f7251c6f17fa.svg" alt="FE20#4 (also FE21#10): best fit, holes 10K 4K 20K 15K 9K, requests 8K, 12K, 10K" loading="lazy" /><p class="chu-thich">🧮 FE20#4 (also FE21#10): best fit, holes 10K 4K 20K 15K 9K, requests 8K, 12K, 10K</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<p class="pitfall">⚠️ Some questions ask "which holes are taken" (the original size), others ask the beginning address of the hole (FE19#14: best fit for 200 among 4075/105, 5225/5, 6785/600, 7560/20, 7600/205, 10250/4050 ⇒ 7600). FE18#21 (worst fit "20K, 15K, 10K") is only true if the remainder is <em>not</em> kept as a hole — see the ⚠️ box in lesson 3.A.</p>`,
    `<h3>3.4 Địa chỉ — số trang, độ dời, số mức, cỡ bảng trang (Ch.3, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 12–18)</h3>
<p>Mọi thứ ở đây là một luật: <strong>địa chỉ là một hàng bit cắt thành các trường</strong>. Số bit độ dời (offset) = log₂(cỡ trang). Các trường bên trái dùng để tra bảng trang.</p>
<ul>
<li><strong>Cỡ trang từ cách chia</strong>: offset = tổng − các trường bảng; trang = 2^offset.</li>
<li><strong>Số trang ở hệ 16</strong>: trang 2^12 ⇒ 12 bit offset = 3 chữ số hex cuối; cắt bỏ là xong.</li>
<li><strong>Độ dài địa chỉ logic</strong> = log₂(số trang) + log₂(cỡ trang): 128 trang × 32 K từ = 7 + 15 = 22 bit (FE20#45).</li>
<li><strong>Cỡ bảng trang</strong> = số trang × cỡ một mục: 2^32 ÷ 16 KB = 2^18 mục × 4 B = 1 MB (FE28#23).</li>
</ul>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/80a868075d18ee202e674ddc382cb0fe1891e21f.svg" alt="FE3#16 — câu lặp nhiều nhất của cả ngân hàng (15 đề): địa chỉ 32 bit, hai trường bảng 10 bit và 12 bit" loading="lazy" /><p class="chu-thich">🧮 FE3#16 — câu lặp nhiều nhất của cả ngân hàng (15 đề): địa chỉ 32 bit, hai trường bảng 10 bit và 12 bit</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1915baac83775482e2cf14e3e98be1b5211dc75f.svg" alt="FE18#11 (cũng là FE20#12, FE25#45, và các biến thể 2^28, 2^32 ở FE21#11, FE22#3)" loading="lazy" /><p class="chu-thich">🧮 FE18#11 (cũng là FE20#12, FE25#45, và các biến thể 2^28, 2^32 ở FE21#11, FE22#3)</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<p class="pitfall">⚠️ Các biến thể của FE3#16 đổi độ rộng trường (9 + 11, 10 + 10, 9 + 12…): đừng học thuộc "1 KB", lần nào cũng tính lại 2^(32 − a − b). "Word" (từ) hay "byte" chỉ là đơn vị — phép tính số bit y hệt.</p>
<h3>3.5 Cấp phát liên tục — first, next, best, worst fit (Ch.3, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 9–10)</h3>
<ol>
<li>Viết các lỗ trống (hole) theo thứ tự địa chỉ. Với mỗi yêu cầu, đánh dấu các lỗ đủ lớn.</li>
<li><strong>First fit</strong> = lỗ đủ lớn đầu tiên; <strong>next fit</strong> = như vậy nhưng tìm tiếp từ chỗ lần trước dừng; <strong>best fit</strong> = lỗ đủ lớn NHỎ nhất; <strong>worst fit</strong> = lỗ LỚN nhất.</li>
<li>Cắt yêu cầu ra khỏi lỗ được chọn và <strong>giữ phần còn lại làm một lỗ nhỏ hơn</strong> cho yêu cầu sau.</li>
</ol>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ffe0304b171ed57b98e0ca245f4e7c2450e47e47.svg" alt="FE20#4 (cũng là FE21#10): best fit, lỗ 10K 4K 20K 15K 9K, yêu cầu 8K, 12K, 10K" loading="lazy" /><p class="chu-thich">🧮 FE20#4 (cũng là FE21#10): best fit, lỗ 10K 4K 20K 15K 9K, yêu cầu 8K, 12K, 10K</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<p class="pitfall">⚠️ Có câu hỏi "lỗ nào bị lấy" (ghi cỡ GỐC của lỗ), có câu hỏi địa chỉ bắt đầu của lỗ (FE19#14: best fit cho 200 trong 4075/105, 5225/5, 6785/600, 7560/20, 7600/205, 10250/4050 ⇒ 7600). FE18#21 (worst fit "20K, 15K, 10K") chỉ đúng khi phần dư KHÔNG được giữ làm lỗ — xem ghi chú ngân hàng ở bài 3.A.</p>`),
    bi(`<h3>3.6 Deadlock — banker's algorithm and detection (Ch.6, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 16–25)</h3>
<ol>
<li>Decide which matrix you were given. <strong>Max</strong> (maximum claim) ⇒ banker: Need = Max − Allocation. <strong>Request / Requested</strong> ⇒ detection: use it as it is.</li>
<li>Available: given, or Total − sum of the Allocation columns.</li>
<li>Find a process whose Need (or Request) ≤ Available <em>in every column</em>; it finishes and gives back its Allocation: Available += Allocation. Repeat.</li>
<li>Everybody finishes ⇒ safe / no deadlock. Somebody can never run ⇒ unsafe (banker) or deadlocked (detection).</li>
<li><strong>If the options are sequences, check each option</strong> — do not compare with "your" sequence: the safe order is not unique.</li>
</ol>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f015bb544b9d057fc4cd28b5047cca26ca1db8b1.svg" alt="FE2#46 (SP26-RE): the bank's key is right, but scanning from P1 gives another valid order that is not among the options" loading="lazy" /><p class="chu-thich">🧮 FE2#46 (SP26-RE): the bank's key is right, but scanning from P1 gives another valid order that is not among the options</p></div>
<table>
<thead><tr><th>Scan from P1: runs</th><th>Request</th><th>Available before</th><th>Available after</th></tr></thead>
<tbody>
<tr><td>P1</td><td>(2 0 0 1)</td><td>(2 1 0 1)</td><td>(2 1 0 1) + (1 0 0 1) = (3 1 0 2)</td></tr>
<tr><td>P3</td><td>(1 1 0 0)</td><td>(3 1 0 2)</td><td>(3 1 0 2) + (0 1 2 0) = (3 2 2 2)</td></tr>
<tr><td>P2</td><td>(0 1 1 0)</td><td>(3 2 2 2)</td><td>(3 2 2 2) + (2 1 0 1) = (5 3 2 3)</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/267442b3bf254dce71947025c5fe7fa8dc9edb6a.svg" alt="FE3#48 (SP26-FE): one resource type, 10 units" loading="lazy" /><p class="chu-thich">🧮 FE3#48 (SP26-FE): one resource type, 10 units</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<p class="pitfall">⚠️ <strong>Unsafe is not deadlocked.</strong> In FE3#48 nobody has asked for more yet; "unsafe" only means the OS can no longer <em>guarantee</em> that all can finish. Options "deadlock" and "starvation" are there to catch that. Single-resource "Has / Max / Free" pictures (Fig. A, B, C in FE20#39, FE21#2, FE22#31, FE25#15) are the same method with one column — and note that FE18#12, FE20#39, FE22#31 key "Fig. B" although Fig. A is safe too.</p>
<h3>3.7 Disk-arm scheduling (Ch.5, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slides 31–33)</h3>
<ol>
<li>Draw a number line with the start position and all requested cylinders.</li>
<li><strong>FCFS</strong>: in the given order. <strong>SSF/SSTF</strong>: always the nearest pending request. <strong>Elevator/LOOK</strong>: keep going in the current direction to the last request, then turn. <strong>SCAN</strong> goes to the edge of the disk, <strong>C-SCAN / C-LOOK</strong> only serve one direction and jump back.</li>
<li>Total = sum of |jumps|; time = total × time per cylinder.</li>
</ol>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c4371aa206bb9783255c4ccc720fc5ea3ed34132.svg" alt="FE9#36 (also FE5#41): SSF from 53, queue 98, 37, 14, 65, 67" loading="lazy" /><p class="chu-thich">🧮 FE9#36 (also FE5#41): SSF from 53, queue 98, 37, 14, 65, 67</p></div>
<table>
<thead><tr><th>At</th><th>Distances to the pending requests</th><th>Go to</th></tr></thead>
<tbody>
<tr><td>53</td><td>65: 12 · 67: 14 · 37: 16 · 14: 39 · 98: 45</td><td><strong>65</strong> (12)</td></tr>
<tr><td>65</td><td>67: 2 · 37: 28 · 14: 51 · 98: 33</td><td><strong>67</strong> (2)</td></tr>
<tr><td>67</td><td>37: 30 · 14: 53 · 98: 31</td><td><strong>37</strong> (30)</td></tr>
<tr><td>37</td><td>14: 23 · 98: 61</td><td><strong>14</strong> (23)</td></tr>
<tr><td>14</td><td>98: 84</td><td><strong>98</strong> (84)</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<p class="pitfall">⚠️ FCFS needs no thinking — and FE1#13 still has a wrong key (135 is correct, no option matches): see the <a href="/courses/operating-systems/learn?lessonSlug=osg202-chua-fe1">FE1 walkthrough</a>. SCAN and C-SCAN need the disk size; if the question does not give it, the intended algorithm is FCFS, SSF or LOOK.</p>`,
    `<h3>3.6 Bế tắc — thuật toán nhà băng và phát hiện bế tắc (Ch.6, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 16–25)</h3>
<ol>
<li>Xác định đề cho ma trận gì. <strong>Max</strong> (nhu cầu tối đa) ⇒ nhà băng (banker): Need = Max − Allocation. <strong>Request / Requested</strong> (đang xin) ⇒ phát hiện bế tắc: dùng nguyên như vậy.</li>
<li>Available (đang rảnh): đề cho sẵn, hoặc Tổng − tổng từng cột Allocation.</li>
<li>Tìm một tiến trình có Need (hoặc Request) ≤ Available <em>ở mọi cột</em>; nó chạy xong và trả lại phần đang giữ: Available += Allocation. Lặp lại.</li>
<li>Ai cũng xong ⇒ an toàn / không bế tắc. Có tiến trình không bao giờ chạy được ⇒ không an toàn (banker) hoặc bế tắc (phát hiện).</li>
<li><strong>Nếu phương án là các chuỗi thứ tự, chấm TỪNG phương án</strong> — đừng so với chuỗi "của mình": thứ tự an toàn không duy nhất.</li>
</ol>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9a3cf9ed95d18ce2ad322e00dc935d3e812695b9.svg" alt="FE2#46 (SP26-RE): khoá ngân hàng đúng, nhưng quét từ P1 ra một thứ tự hợp lệ khác không có trong phương án" loading="lazy" /><p class="chu-thich">🧮 FE2#46 (SP26-RE): khoá ngân hàng đúng, nhưng quét từ P1 ra một thứ tự hợp lệ khác không có trong phương án</p></div>
<table>
<thead><tr><th>Quét từ P1: chạy</th><th>Request</th><th>Available trước</th><th>Available sau</th></tr></thead>
<tbody>
<tr><td>P1</td><td>(2 0 0 1)</td><td>(2 1 0 1)</td><td>(2 1 0 1) + (1 0 0 1) = (3 1 0 2)</td></tr>
<tr><td>P3</td><td>(1 1 0 0)</td><td>(3 1 0 2)</td><td>(3 1 0 2) + (0 1 2 0) = (3 2 2 2)</td></tr>
<tr><td>P2</td><td>(0 1 1 0)</td><td>(3 2 2 2)</td><td>(3 2 2 2) + (2 1 0 1) = (5 3 2 3)</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/732d0ed7c43ad72a0ce9bfc29c16148600dbb7db.svg" alt="FE3#48 (SP26-FE): một loại tài nguyên, 10 đơn vị" loading="lazy" /><p class="chu-thich">🧮 FE3#48 (SP26-FE): một loại tài nguyên, 10 đơn vị</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<p class="pitfall">⚠️ <strong>Không an toàn chưa phải là bế tắc.</strong> Ở FE3#48 chưa ai xin thêm; "không an toàn" (unsafe) chỉ có nghĩa HĐH không còn <em>bảo đảm</em> mọi tiến trình chạy xong. Phương án "deadlock" và "starvation" đặt ra để bắt chỗ đó. Các hình một loại tài nguyên "Has / Max / Free" (Fig. A, B, C ở FE20#39, FE21#2, FE22#31, FE25#15) là cùng cách làm với một cột — và lưu ý FE18#12, FE20#39, FE22#31 có khoá "Fig. B" dù Fig. A cũng an toàn.</p>
<h3>3.7 Lập lịch đầu từ đĩa (Ch.5, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 31–33)</h3>
<ol>
<li>Vẽ một trục số với vị trí xuất phát và mọi cylinder được yêu cầu.</li>
<li><strong>FCFS</strong>: đúng thứ tự đề cho. <strong>SSF/SSTF</strong>: luôn tới yêu cầu gần nhất còn chờ. <strong>Elevator/LOOK</strong> (thang máy): đi tiếp chiều đang đi tới yêu cầu cuối rồi mới quay. <strong>SCAN</strong> chạy tới mép đĩa, <strong>C-SCAN / C-LOOK</strong> chỉ phục vụ một chiều rồi nhảy về.</li>
<li>Tổng quãng = tổng |bước nhảy|; thời gian = tổng × thời gian mỗi cylinder.</li>
</ol>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a6b2ad9a2d21c942fe934ea47ca0232abd60b25c.svg" alt="FE9#36 (cũng là FE5#41): SSF từ 53, hàng đợi 98, 37, 14, 65, 67" loading="lazy" /><p class="chu-thich">🧮 FE9#36 (cũng là FE5#41): SSF từ 53, hàng đợi 98, 37, 14, 65, 67</p></div>
<table>
<thead><tr><th>Đang ở</th><th>Khoảng cách tới các yêu cầu còn chờ</th><th>Đi tới</th></tr></thead>
<tbody>
<tr><td>53</td><td>65: 12 · 67: 14 · 37: 16 · 14: 39 · 98: 45</td><td><strong>65</strong> (12)</td></tr>
<tr><td>65</td><td>67: 2 · 37: 28 · 14: 51 · 98: 33</td><td><strong>67</strong> (2)</td></tr>
<tr><td>67</td><td>37: 30 · 14: 53 · 98: 31</td><td><strong>37</strong> (30)</td></tr>
<tr><td>37</td><td>14: 23 · 98: 61</td><td><strong>14</strong> (23)</td></tr>
<tr><td>14</td><td>98: 84</td><td><strong>98</strong> (84)</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<p class="pitfall">⚠️ FCFS không cần nghĩ — vậy mà FE1#13 vẫn có khoá sai (đúng là 135, không phương án nào khớp): xem <a href="/courses/operating-systems/learn?lessonSlug=osg202-chua-fe1">bài chữa FE1</a>. SCAN và C-SCAN cần biết cỡ đĩa; đề không cho thì thuật toán được nhắm tới là FCFS, SSF hoặc LOOK.</p>`),
    bi(`<h3>3.8 i-nodes and FAT (Ch.4, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a> slide 21, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-2">4.B</a> slides 41–45)</h3>
<ul>
<li><strong>Largest file with an i-node</strong> = (direct pointers + block ÷ address size for each single-indirect block + (block ÷ address)² for a double-indirect…) × block size.</li>
<li><strong>Largest FAT partition</strong> = 2^(FAT bits) × block size, with FAT-32 using 28 bits; the book's table caps FAT-32 at 2 TB.</li>
<li><strong>Free-list block</strong> = block size ÷ address size addresses; with a linked list one slot is the "next" pointer (1 KB ÷ 4 B − 1 = 255, FE10#35).</li>
</ul>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b1c9b644e1d370c7f2202853627eb43b69e4dabb.svg" alt="FE21#16 (also FE25#48): 10 direct addresses of 4 bytes, 1 KB blocks, one single-indirect block" loading="lazy" /><p class="chu-thich">🧮 FE21#16 (also FE25#48): 10 direct addresses of 4 bytes, 1 KB blocks, one single-indirect block</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<h3>3.9 The one-line formulas — run them all</h3>
<p>The remaining types are one line each. The program below holds the data of 25 real questions (copied from their stems), computes every answer and compares it with the bank's key — all of them match, and it also gives the TLB and RAID formulas that progress tests like.</p>
<pre><code class="language-javascript">// One-line formulas of the FE, each checked against the bank key
// data copied from the question text; key = the answer the bank marks
const K = 2 ** 10, M = 2 ** 20, G = 2 ** 30, T = 2 ** 40;
const size = (b) =&gt; (b &gt;= T ? &#96;&#36;{b / T} TB&#96; : b &gt;= G ? &#96;&#36;{b / G} GB&#96; : b &gt;= M ? &#96;&#36;{b / M} MB&#96; : &#96;&#36;{b / K} KB&#96;);
const log2 = (x) =&gt; Math.log2(x);
const pct = (x) =&gt; &#96;&#36;{+(100 * x).toFixed(2)}%&#96;;
const rows = [
  // logical address bits = log2(pages) + log2(page size)
  ['FE20#45', 'log2(128) + log2(32K)', &#96;&#36;{log2(128) + log2(32 * K)} bits&#96;, '22 bits'],
  ['FE18#17', 'log2(64) + log2(2048)', &#96;&#36;{log2(64) + log2(2048)} bits&#96;, '17 bits'],
  ['FE25#10', 'log2(256) + log2(4K)', &#96;&#36;{log2(256) + log2(4 * K)} bits&#96;, '20 bits'],
  // one-level page table entries = 2^(address bits - offset bits)
  ['FE5#20', '2^(16 - log2(4K))', &#96;&#36;{2 ** (16 - log2(4 * K))}&#96;, '16'],
  // page table size = entries x entry size
  ['FE28#23', '2^32 / 16K x 4 B', size((2 ** 32 / (16 * K)) * 4), '1 MB'],
  // FAT max partition = 2^(FAT bits) x block size; FAT-32 uses 28 bits, book table caps at 2 TB
  ['FE21#9', '2^12 x 2 KB', size(2 ** 12 * 2 * K), '8 MB'],
  ['FE3#26', '2^16 x 4 KB', size(2 ** 16 * 4 * K), '256 MB'],
  ['FE22#38', '2^28 x 4 KB', size(2 ** 28 * 4 * K), '1 TB'],
  ['FE5#26', 'min(2^28 x 16 KB, 2 TB)', size(Math.min(2 ** 28 * 16 * K, 2 * T)), '2 TB'],
  // i-node: (direct + block/address size) x block
  ['FE21#16', '(10 + 1K/4) x 1 KB', size((10 + K / 4) * K), '266 KB'],
  ['FE26#49', '10 x 1024 KB', size(10 * 1024 * K), '10 MB'],
  // free list: addresses per block; linked list keeps one slot for the next pointer
  ['FE9#31', '4 KB / 4 B (2^30 blocks need 32 bits)', &#96;&#36;{(4 * K) / 4} addresses&#96;, '1024 addresses'],
  ['FE10#35', '1 KB / 4 B - 1', &#96;&#36;{K / 4 - 1}&#96;, '255'],
  // multiprogramming: n = free RAM / process size, CPU = 1 - p^n
  ['FE5#11', 'n = 2/1 = 2, 1 - 0.5^2', pct(1 - 0.5 ** 2), '75%'],
  ['FE3#9', 'n = 6/3 = 2, 1 - 0.6^2', pct(1 - 0.6 ** 2), '64%'],
  ['FE17#25', 'n = floor(1024/450) = 2, wasted 0.2^2', pct(0.2 ** Math.floor(1024 / 450)), '4%'],
  ['FE20#36', 'n = 2, 1 - 0.1^2', pct(1 - 0.1 ** 2), '99%'],
  ['FE25#47', 'n = 2, wasted 0.5^2', pct(0.5 ** 2), '25%'],
  // interrupt cost = chars/s x service time
  ['FE24#22', '7000 x 10 us', pct(7000 * 10e-6), '7%'],
  ['FE19#27', '400 x 50 us', pct(400 * 50e-6), '2%'],
  // programmable clock: holding register = f x tick
  ['FE25#19', '500 MHz x 10 ms', (500e6 * 10e-3).toLocaleString('en-US'), '5,000,000'],
  ['FE26#16', '500 MHz x 100 us', Math.round(500e6 * 100e-6).toLocaleString('en-US'), '50,000'],
  // cylinder skew = ceil(seek / time per sector)
  ['FE25#5', '1 ms / (60 s / 3600 / 200)', &#96;&#36;{Math.ceil(1e-3 / (60 / 3600 / 200) - 1e-9)} sectors&#96;, '12 sectors'],
  ['FE26#3', '1 ms / (60 s / 5400 / 200)', &#96;&#36;{Math.ceil(1e-3 / (60 / 5400 / 200) - 1e-9)} sectors&#96;, '18 sectors'],
  // memory hierarchy: each level's time x share of accesses it serves (FE25#25 image cut: 10 ms + 99% reproduce the key)
  ['FE25#25', '.95x2 + .05x.99x20 + .05x.01x10ms', &#96;&#36;{(0.95 * 2 + 0.05 * 0.99 * 20 + 0.05 * 0.01 * 10e6).toLocaleString('en-US', { maximumFractionDigits: 2 })} nsec&#96;, '5,002.89 nsec'],
  // TLB: hit = TLB + 1 memory access, miss = TLB + 2 (one-level page table)
  ['(TLB)', '.8x(20+100) + .2x(20+200) ns', &#96;&#36;{0.8 * (20 + 100) + 0.2 * (20 + 2 * 100)} ns&#96;, null],
  // RAID usable capacity of 4 disks x 2 TB
  ['(RAID)', '0: 4x2 · 1: 4x2/2 · 5: (4-1)x2 · 6: (4-2)x2', &#96;&#36;{4 * 2}/&#36;{(4 * 2) / 2}/&#36;{(4 - 1) * 2}/&#36;{(4 - 2) * 2} TB&#96;, null],
];
const w = [8, Math.max(...rows.map((r) =&gt; r[1].length)), Math.max(...rows.map((r) =&gt; r[2].length))];
console.log(&#96;&#36;{'question'.padEnd(w[0])}  &#36;{'formula'.padEnd(w[1])}  &#36;{'computed'.padEnd(w[2])}  bank key&#96;);
let ok = 0, co = 0;
for (const [q, f, got, key] of rows) {
  if (key === null) { console.log(&#96;&#36;{q.padEnd(w[0])}  &#36;{f.padEnd(w[1])}  &#36;{got.padEnd(w[2])}  (not in the 29 papers)&#96;); continue; }
  const same = got === key;
  ok += same; co++;
  console.log(&#96;&#36;{q.padEnd(w[0])}  &#36;{f.padEnd(w[1])}  &#36;{got.padEnd(w[2])}  &#36;{key}&#36;{same ? '  ✓' : '  ✗ DIFFERENT'}&#96;);
}
console.log(&#96;&#36;{ok}/&#36;{co} match the bank key&#96;);</code></pre>
<div class="out">$ node cong-thuc.js<br>
question &nbsp;formula &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;computed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bank key<br>
FE20#45 &nbsp;&nbsp;log2(128) + log2(32K) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22 bits &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22 bits &nbsp;✓<br>
FE18#17 &nbsp;&nbsp;log2(64) + log2(2048) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17 bits &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17 bits &nbsp;✓<br>
FE25#10 &nbsp;&nbsp;log2(256) + log2(4K) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 bits &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 bits &nbsp;✓<br>
FE5#20 &nbsp;&nbsp;&nbsp;2^(16 - log2(4K)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;✓<br>
FE28#23 &nbsp;&nbsp;2^32 / 16K x 4 B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 MB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 MB &nbsp;✓<br>
FE21#9 &nbsp;&nbsp;&nbsp;2^12 x 2 KB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 MB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 MB &nbsp;✓<br>
FE3#26 &nbsp;&nbsp;&nbsp;2^16 x 4 KB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;256 MB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;256 MB &nbsp;✓<br>
FE22#38 &nbsp;&nbsp;2^28 x 4 KB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 TB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 TB &nbsp;✓<br>
FE5#26 &nbsp;&nbsp;&nbsp;min(2^28 x 16 KB, 2 TB) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 TB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 TB &nbsp;✓<br>
FE21#16 &nbsp;&nbsp;(10 + 1K/4) x 1 KB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;266 KB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;266 KB &nbsp;✓<br>
FE26#49 &nbsp;&nbsp;10 x 1024 KB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 MB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 MB &nbsp;✓<br>
FE9#31 &nbsp;&nbsp;&nbsp;4 KB / 4 B (2^30 blocks need 32 bits) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024 addresses &nbsp;1024 addresses &nbsp;✓<br>
FE10#35 &nbsp;&nbsp;1 KB / 4 B - 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;255 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;255 &nbsp;✓<br>
FE5#11 &nbsp;&nbsp;&nbsp;n = 2/1 = 2, 1 - 0.5^2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;75% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;75% &nbsp;✓<br>
FE3#9 &nbsp;&nbsp;&nbsp;&nbsp;n = 6/3 = 2, 1 - 0.6^2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64% &nbsp;✓<br>
FE17#25 &nbsp;&nbsp;n = floor(1024/450) = 2, wasted 0.2^2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4% &nbsp;✓<br>
FE20#36 &nbsp;&nbsp;n = 2, 1 - 0.1^2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;99% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;99% &nbsp;✓<br>
FE25#47 &nbsp;&nbsp;n = 2, wasted 0.5^2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25% &nbsp;✓<br>
FE24#22 &nbsp;&nbsp;7000 x 10 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7% &nbsp;✓<br>
FE19#27 &nbsp;&nbsp;400 x 50 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2% &nbsp;✓<br>
FE25#19 &nbsp;&nbsp;500 MHz x 10 ms &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5,000,000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5,000,000 &nbsp;✓<br>
FE26#16 &nbsp;&nbsp;500 MHz x 100 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50,000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50,000 &nbsp;✓<br>
FE25#5 &nbsp;&nbsp;&nbsp;1 ms / (60 s / 3600 / 200) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 sectors &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 sectors &nbsp;✓<br>
FE26#3 &nbsp;&nbsp;&nbsp;1 ms / (60 s / 5400 / 200) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;18 sectors &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;18 sectors &nbsp;✓<br>
FE25#25 &nbsp;&nbsp;.95x2 + .05x.99x20 + .05x.01x10ms &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5,002.89 nsec &nbsp;&nbsp;5,002.89 nsec &nbsp;✓<br>
(TLB) &nbsp;&nbsp;&nbsp;&nbsp;.8x(20+100) + .2x(20+200) ns &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;140 ns &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(not in the 29 papers)<br>
(RAID) &nbsp;&nbsp;&nbsp;0: 4x2 · 1: 4x2/2 · 5: (4-1)x2 · 6: (4-2)x2 &nbsp;8/4/6/4 TB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(not in the 29 papers)<br>
25/25 match the bank key</div>
<table>
<thead><tr><th>Type</th><th>Formula</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>interrupt cost</td><td>characters per second × service time</td><td>5.A slide 13</td></tr>
<tr><td>programmable clock</td><td>crystal frequency × tick = value of the holding register</td><td>5.B slide 37</td></tr>
<tr><td>cylinder skew</td><td>⌈track-to-track seek ÷ time of one sector⌉, one sector = 60 s ÷ rpm ÷ sectors per track</td><td>5.B slide 29</td></tr>
<tr><td>memory hierarchy</td><td>Σ (time of a level × share of accesses served there)</td><td>1.A slide 13</td></tr>
<tr><td>TLB</td><td>hit × (TLB + memory) + miss × (TLB + 2 × memory), one-level table</td><td>3.A slide 17</td></tr>
<tr><td>RAID capacity</td><td>RAID 0: n disks · RAID 1: n ÷ 2 · RAID 5: n − 1 · RAID 6: n − 2</td><td>5.B slide 26</td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ FE25#25 is printed with its numbers cut off (disk time and memory hit rate). The only pair that reproduces the key 5,002.89 ns is 10 ms and 99% — the values of the book's own exercise — so learn the formula, not the number.</p>`,
    `<h3>3.8 i-node và FAT (Ch.4, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a> slide 21, <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-2">4.B</a> slide 41–45)</h3>
<ul>
<li><strong>Tệp lớn nhất với i-node</strong> = (số con trỏ trực tiếp + cỡ khối ÷ cỡ địa chỉ cho mỗi khối gián tiếp đơn + (cỡ khối ÷ cỡ địa chỉ)² cho khối gián tiếp đôi…) × cỡ khối.</li>
<li><strong>Phân vùng FAT lớn nhất</strong> = 2^(số bit FAT) × cỡ khối, FAT-32 dùng 28 bit; bảng của sách chặn FAT-32 ở 2 TB.</li>
<li><strong>Khối của danh sách khối trống</strong> chứa cỡ khối ÷ cỡ địa chỉ địa chỉ; với danh sách liên kết, một ô dành cho con trỏ "khối kế" (1 KB ÷ 4 B − 1 = 255, FE10#35).</li>
</ul>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/71bf65c6862ab7ab75d0915508b6e19a3c5f5ca9.svg" alt="FE21#16 (cũng là FE25#48): 10 địa chỉ trực tiếp 4 byte, khối 1 KB, một khối gián tiếp đơn" loading="lazy" /><p class="chu-thich">🧮 FE21#16 (cũng là FE25#48): 10 địa chỉ trực tiếp 4 byte, khối 1 KB, một khối gián tiếp đơn</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// Mỗi câu: dữ liệu CHÉP TỪ ĐỀ → gọi thuật toán dùng chung (gen/sim/_thuat-toan) → đáp án.
const CPU = [['A', 8], ['B', 6], ['C', 2], ['D', 10], ['E', 4]].map(([ten, chay]) =&gt; ({ ten, den: 0, chay }));   // FE18#16
const tinhCpu = () =&gt; lapLich(CPU, 'fcfs');                                           // ⇒ tbQuayVong
const tinhDia = () =&gt; lapLichDia(53, [98, 37, 14, 65, 67], 'sstf');                   // FE9#36 ⇒ thuTu
const REF = [7, 0, 1, 2, 0, 3];                                                       // FE5#23
const tinhTrang = () =&gt; thayTrang(REF, 3, 'lru');                                     // ⇒ soLoi
const C = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A = [2, 1, 0, 1];   // FE2#46
const tinhPhatHien = () =&gt; phatHien({ A, C, R });                                     // ⇒ thuTuXong (quét từ P1)
/** Một thứ tự cho sẵn có chạy hết được không: từng tiến trình phải có Request ≤ Available lúc tới lượt. */
function kiemThuTu(tt) {
  let work = [...A];
  for (let k = 0; k &lt; tt.length; k++) {
    const i = tt[k];
    if (R[i].some((x, j) =&gt; x &gt; work[j])) return { dung: false, hong: k, work };
    work = work.map((x, j) =&gt; x + C[i][j]);
  }
  return { dung: true, hong: -1, work };
}
const HAS = [3, 4, 3], MAX = [6, 5, 7], FREE = 10 - HAS.reduce((s, x) =&gt; s + x, 0);  // FE3#48
const tinhBanker1 = () =&gt; motLoai({ has: HAS, max: MAX, free: FREE });                // ⇒ anToan
const OFFSET = 32 - 10 - 12, TRANG = 2 ** OFFSET;                                     // FE3#16: trang = 2^offset
const [SO_TRANG, DO_DOI] = tachBit(0x123456, [24 - 12, 12]);                          // FE18#11
const LO = [10, 4, 20, 15, 9], XIN = [8, 12, 10];                                     // FE20#4
const tinhFit = () =&gt; datCho(LO, XIN, 'best');
const MOI_KHOI = 1024 / 4, TOI_DA_KB = (10 + MOI_KHOI) * 1024 / 1024;                // FE21#16: (trực tiếp + gián tiếp) × cỡ khối
const N_DC = (4 - 2) / 1, P_IO = 0.5, HIEU_SUAT = 1 - P_IO ** N_DC;                 // FE5#11: 1 − pⁿ</code></pre></details>
<h3>3.9 Các công thức một dòng — chạy hết một lượt</h3>
<p>Các dạng còn lại mỗi dạng một dòng. Chương trình dưới chứa dữ liệu của 25 câu thật (chép từ đề), tính từng đáp án và so với khoá ngân hàng — tất cả khớp, kèm công thức TLB và RAID mà progress test hay hỏi.</p>
<pre><code class="language-javascript">// Các công thức một dòng của FE, mỗi câu so với khoá ngân hàng
// dữ liệu chép từ đề; key = đáp án ngân hàng đánh dấu
const K = 2 ** 10, M = 2 ** 20, G = 2 ** 30, T = 2 ** 40;
const size = (b) =&gt; (b &gt;= T ? &#96;&#36;{b / T} TB&#96; : b &gt;= G ? &#96;&#36;{b / G} GB&#96; : b &gt;= M ? &#96;&#36;{b / M} MB&#96; : &#96;&#36;{b / K} KB&#96;);
const log2 = (x) =&gt; Math.log2(x);
const pct = (x) =&gt; &#96;&#36;{+(100 * x).toFixed(2)}%&#96;;
const rows = [
  // số bit địa chỉ logic = log2(số trang) + log2(cỡ trang)
  ['FE20#45', 'log2(128) + log2(32K)', &#96;&#36;{log2(128) + log2(32 * K)} bits&#96;, '22 bits'],
  ['FE18#17', 'log2(64) + log2(2048)', &#96;&#36;{log2(64) + log2(2048)} bits&#96;, '17 bits'],
  ['FE25#10', 'log2(256) + log2(4K)', &#96;&#36;{log2(256) + log2(4 * K)} bits&#96;, '20 bits'],
  // số mục bảng trang một mức = 2^(bit địa chỉ - bit offset)
  ['FE5#20', '2^(16 - log2(4K))', &#96;&#36;{2 ** (16 - log2(4 * K))}&#96;, '16'],
  // cỡ bảng trang = số mục x cỡ một mục
  ['FE28#23', '2^32 / 16K x 4 B', size((2 ** 32 / (16 * K)) * 4), '1 MB'],
  // FAT-32 dùng 28 bit, bảng của sách chặn ở 2 TB
  ['FE21#9', '2^12 x 2 KB', size(2 ** 12 * 2 * K), '8 MB'],
  ['FE3#26', '2^16 x 4 KB', size(2 ** 16 * 4 * K), '256 MB'],
  ['FE22#38', '2^28 x 4 KB', size(2 ** 28 * 4 * K), '1 TB'],
  ['FE5#26', 'min(2^28 x 16 KB, 2 TB)', size(Math.min(2 ** 28 * 16 * K, 2 * T)), '2 TB'],
  // i-node: (trực tiếp + cỡ khối/cỡ địa chỉ) x cỡ khối
  ['FE21#16', '(10 + 1K/4) x 1 KB', size((10 + K / 4) * K), '266 KB'],
  ['FE26#49', '10 x 1024 KB', size(10 * 1024 * K), '10 MB'],
  // danh sách liên kết giữ một ô cho con trỏ kế
  ['FE9#31', '4 KB / 4 B (2^30 blocks need 32 bits)', &#96;&#36;{(4 * K) / 4} addresses&#96;, '1024 addresses'],
  ['FE10#35', '1 KB / 4 B - 1', &#96;&#36;{K / 4 - 1}&#96;, '255'],
  // đa chương: n = RAM trống / cỡ tiến trình, CPU = 1 - p^n
  ['FE5#11', 'n = 2/1 = 2, 1 - 0.5^2', pct(1 - 0.5 ** 2), '75%'],
  ['FE3#9', 'n = 6/3 = 2, 1 - 0.6^2', pct(1 - 0.6 ** 2), '64%'],
  ['FE17#25', 'n = floor(1024/450) = 2, wasted 0.2^2', pct(0.2 ** Math.floor(1024 / 450)), '4%'],
  ['FE20#36', 'n = 2, 1 - 0.1^2', pct(1 - 0.1 ** 2), '99%'],
  ['FE25#47', 'n = 2, wasted 0.5^2', pct(0.5 ** 2), '25%'],
  // chi phí ngắt = ký tự/giây x thời gian phục vụ
  ['FE24#22', '7000 x 10 us', pct(7000 * 10e-6), '7%'],
  ['FE19#27', '400 x 50 us', pct(400 * 50e-6), '2%'],
  // đồng hồ lập trình: thanh ghi giữ = tần số x tick
  ['FE25#19', '500 MHz x 10 ms', (500e6 * 10e-3).toLocaleString('en-US'), '5,000,000'],
  ['FE26#16', '500 MHz x 100 us', Math.round(500e6 * 100e-6).toLocaleString('en-US'), '50,000'],
  // độ lệch trụ = trần(seek / thời gian một sector)
  ['FE25#5', '1 ms / (60 s / 3600 / 200)', &#96;&#36;{Math.ceil(1e-3 / (60 / 3600 / 200) - 1e-9)} sectors&#96;, '12 sectors'],
  ['FE26#3', '1 ms / (60 s / 5400 / 200)', &#96;&#36;{Math.ceil(1e-3 / (60 / 5400 / 200) - 1e-9)} sectors&#96;, '18 sectors'],
  // mỗi tầng: thời gian x tỉ lệ truy cập nó phục vụ
  ['FE25#25', '.95x2 + .05x.99x20 + .05x.01x10ms', &#96;&#36;{(0.95 * 2 + 0.05 * 0.99 * 20 + 0.05 * 0.01 * 10e6).toLocaleString('en-US', { maximumFractionDigits: 2 })} nsec&#96;, '5,002.89 nsec'],
  // TLB: trúng = TLB + 1 lần nhớ, trượt = TLB + 2 lần
  ['(TLB)', '.8x(20+100) + .2x(20+200) ns', &#96;&#36;{0.8 * (20 + 100) + 0.2 * (20 + 2 * 100)} ns&#96;, null],
  // dung lượng dùng được của 4 đĩa x 2 TB
  ['(RAID)', '0: 4x2 · 1: 4x2/2 · 5: (4-1)x2 · 6: (4-2)x2', &#96;&#36;{4 * 2}/&#36;{(4 * 2) / 2}/&#36;{(4 - 1) * 2}/&#36;{(4 - 2) * 2} TB&#96;, null],
];
const w = [8, Math.max(...rows.map((r) =&gt; r[1].length)), Math.max(...rows.map((r) =&gt; r[2].length))];
console.log(&#96;&#36;{'question'.padEnd(w[0])}  &#36;{'formula'.padEnd(w[1])}  &#36;{'computed'.padEnd(w[2])}  bank key&#96;);
let ok = 0, co = 0;
for (const [q, f, got, key] of rows) {
  if (key === null) { console.log(&#96;&#36;{q.padEnd(w[0])}  &#36;{f.padEnd(w[1])}  &#36;{got.padEnd(w[2])}  (not in the 29 papers)&#96;); continue; }
  const same = got === key;
  ok += same; co++;
  console.log(&#96;&#36;{q.padEnd(w[0])}  &#36;{f.padEnd(w[1])}  &#36;{got.padEnd(w[2])}  &#36;{key}&#36;{same ? '  ✓' : '  ✗ DIFFERENT'}&#96;);
}
console.log(&#96;&#36;{ok}/&#36;{co} match the bank key&#96;);</code></pre>
<div class="out">$ node cong-thuc.js<br>
question &nbsp;formula &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;computed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bank key<br>
FE20#45 &nbsp;&nbsp;log2(128) + log2(32K) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22 bits &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22 bits &nbsp;✓<br>
FE18#17 &nbsp;&nbsp;log2(64) + log2(2048) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17 bits &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17 bits &nbsp;✓<br>
FE25#10 &nbsp;&nbsp;log2(256) + log2(4K) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 bits &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 bits &nbsp;✓<br>
FE5#20 &nbsp;&nbsp;&nbsp;2^(16 - log2(4K)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;✓<br>
FE28#23 &nbsp;&nbsp;2^32 / 16K x 4 B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 MB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 MB &nbsp;✓<br>
FE21#9 &nbsp;&nbsp;&nbsp;2^12 x 2 KB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 MB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 MB &nbsp;✓<br>
FE3#26 &nbsp;&nbsp;&nbsp;2^16 x 4 KB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;256 MB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;256 MB &nbsp;✓<br>
FE22#38 &nbsp;&nbsp;2^28 x 4 KB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 TB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 TB &nbsp;✓<br>
FE5#26 &nbsp;&nbsp;&nbsp;min(2^28 x 16 KB, 2 TB) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 TB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 TB &nbsp;✓<br>
FE21#16 &nbsp;&nbsp;(10 + 1K/4) x 1 KB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;266 KB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;266 KB &nbsp;✓<br>
FE26#49 &nbsp;&nbsp;10 x 1024 KB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 MB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 MB &nbsp;✓<br>
FE9#31 &nbsp;&nbsp;&nbsp;4 KB / 4 B (2^30 blocks need 32 bits) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024 addresses &nbsp;1024 addresses &nbsp;✓<br>
FE10#35 &nbsp;&nbsp;1 KB / 4 B - 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;255 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;255 &nbsp;✓<br>
FE5#11 &nbsp;&nbsp;&nbsp;n = 2/1 = 2, 1 - 0.5^2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;75% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;75% &nbsp;✓<br>
FE3#9 &nbsp;&nbsp;&nbsp;&nbsp;n = 6/3 = 2, 1 - 0.6^2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64% &nbsp;✓<br>
FE17#25 &nbsp;&nbsp;n = floor(1024/450) = 2, wasted 0.2^2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4% &nbsp;✓<br>
FE20#36 &nbsp;&nbsp;n = 2, 1 - 0.1^2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;99% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;99% &nbsp;✓<br>
FE25#47 &nbsp;&nbsp;n = 2, wasted 0.5^2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25% &nbsp;✓<br>
FE24#22 &nbsp;&nbsp;7000 x 10 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7% &nbsp;✓<br>
FE19#27 &nbsp;&nbsp;400 x 50 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2% &nbsp;✓<br>
FE25#19 &nbsp;&nbsp;500 MHz x 10 ms &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5,000,000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5,000,000 &nbsp;✓<br>
FE26#16 &nbsp;&nbsp;500 MHz x 100 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50,000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50,000 &nbsp;✓<br>
FE25#5 &nbsp;&nbsp;&nbsp;1 ms / (60 s / 3600 / 200) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 sectors &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 sectors &nbsp;✓<br>
FE26#3 &nbsp;&nbsp;&nbsp;1 ms / (60 s / 5400 / 200) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;18 sectors &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;18 sectors &nbsp;✓<br>
FE25#25 &nbsp;&nbsp;.95x2 + .05x.99x20 + .05x.01x10ms &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5,002.89 nsec &nbsp;&nbsp;5,002.89 nsec &nbsp;✓<br>
(TLB) &nbsp;&nbsp;&nbsp;&nbsp;.8x(20+100) + .2x(20+200) ns &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;140 ns &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(not in the 29 papers)<br>
(RAID) &nbsp;&nbsp;&nbsp;0: 4x2 · 1: 4x2/2 · 5: (4-1)x2 · 6: (4-2)x2 &nbsp;8/4/6/4 TB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(not in the 29 papers)<br>
25/25 match the bank key</div>
<table>
<thead><tr><th>Dạng</th><th>Công thức</th><th>Bài học</th></tr></thead>
<tbody>
<tr><td>chi phí ngắt</td><td>số ký tự mỗi giây × thời gian phục vụ một ngắt</td><td>5.A slide 13</td></tr>
<tr><td>đồng hồ lập trình được</td><td>tần số thạch anh × chu kỳ tick = giá trị thanh ghi giữ (holding register)</td><td>5.B slide 37</td></tr>
<tr><td>độ lệch trụ (cylinder skew)</td><td>⌈seek giữa hai rãnh ÷ thời gian một sector⌉, một sector = 60 s ÷ rpm ÷ số sector mỗi rãnh</td><td>5.B slide 29</td></tr>
<tr><td>phân cấp bộ nhớ</td><td>Σ (thời gian một tầng × tỉ lệ truy cập tầng đó phục vụ)</td><td>1.A slide 13</td></tr>
<tr><td>TLB</td><td>trúng × (TLB + bộ nhớ) + trượt × (TLB + 2 × bộ nhớ), bảng trang một mức</td><td>3.A slide 17</td></tr>
<tr><td>dung lượng RAID</td><td>RAID 0: n đĩa · RAID 1: n ÷ 2 · RAID 5: n − 1 · RAID 6: n − 2</td><td>5.B slide 26</td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ FE25#25 bị in mất số (thời gian đĩa và tỉ lệ trúng bộ nhớ). Cặp duy nhất tái tạo đúng khoá 5,002.89 ns là 10 ms và 99% — số liệu của chính bài tập trong sách — nên hãy nhớ công thức, đừng nhớ con số.</p>`),
    bi(`<h2>4. The 60 minutes</h2>
<h3>4.1 A time plan that leaves no question blank</h3>
<table>
<thead><tr><th>Minutes</th><th>What you do</th></tr></thead>
<tbody>
<tr><td>0–2</td><td>Scroll through the whole paper once. Mark the computed questions (data, matrices, reference strings) — usually 5–7.</td></tr>
<tr><td>2–27</td><td>Pass 1: every theory question, about 30 s each. Answer at once if you know it; otherwise pick your best guess, <strong>flag</strong> it and move on. Never think longer than 1 minute here.</td></tr>
<tr><td>27–47</td><td>Pass 2: the computed questions, method of section 3 on scrap paper, about 3 min each. Start with the type you are fastest at.</td></tr>
<tr><td>47–57</td><td>Pass 3: flagged questions. Re-read the stem for NOT / EXCEPT / without, then decide.</td></tr>
<tr><td>57–60</td><td>Check that every question has an answer and every "choose two" has two.</td></tr>
</tbody>
</table>
<ul>
<li><strong>Theory first</strong>: 43-odd questions at 30 s secure most of the paper before the slow ones can eat your time.</li>
<li><strong>Nothing stays blank</strong>: a wrong choice costs the same as an empty one in a multiple-choice paper scored right/wrong, so a guess is free (check your exam rules with your lecturer).</li>
<li><strong>The 2-minute rule for computed questions</strong>: if your result matches no option, redo it once; still no match ⇒ choose the closest option, flag it, go on. FE1#13 is exactly that case.</li>
</ul>
<h3>4.2 When the bank contradicts itself or the book</h3>
<p>The question bank is collected by students, and the course team keeps a list of the questions whose key is wrong or unstable (each chapter lesson names them in its ⚠️ boxes). What to choose:</p>
<table>
<thead><tr><th>Situation</th><th>Example</th><th>Choose</th></tr></thead>
<tbody>
<tr><td>the stem copies a sentence of the book</td><td>"RAID level ___ works worst with OS that ask one sector at a time" — keys 3 (FE2#34, FE15#41) or 2 (FE8#38)</td><td>the book's word: <strong>RAID 0</strong></td></tr>
<tr><td>two keys for the same stem</td><td>"nonpreemptable … with / without potentially causing failure" (FE7#42 vs FE8#42)</td><td>the option that is <strong>true</strong> by the definition: cannot be taken away <em>without</em> causing failure</td></tr>
<tr><td>two book passages disagree</td><td>spooling: Fig. 6-14 says mutual exclusion (FE19#49, FE23#39), §6.6.3 uses it for no-preemption (FE2#50)</td><td>follow the words of the stem: "spool everything" ⇒ mutual exclusion; "spooling printer output so the daemon owns the printer" in a no-preemption question ⇒ that option</td></tr>
<tr><td>SJF called preemptive</td><td>FE24#50 "select 2: preemptive" keys SJF + RR</td><td>the book: SJF is non-preemptive, SRTF is its preemptive version; if forced to tick two, the bank wants SJF + RR</td></tr>
<tr><td>a computation with no matching option</td><td>FE1#13: FCFS = 135, options 108, 96, 83, 114 (key 114)</td><td>recompute once; then the closest option (114), flag, move on</td></tr>
<tr><td>a vague "evaluate" question</td><td>FE1#19 memory virtualization "enhances … improving performance"</td><td>the bank's key — the positive, textbook-sounding statement</td></tr>
</tbody>
</table>
<p class="meo">🧠 The rule behind the table: the lecturer's real key is written from the book. When the bank and the book disagree, the book wins; when the book itself is unclear, the exact words of the stem decide.</p>`,
    `<h2>4. Sáu mươi phút</h2>
<h3>4.1 Kế hoạch thời gian không để trống câu nào</h3>
<table>
<thead><tr><th>Phút</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td>0–2</td><td>Lướt toàn đề một lượt. Đánh dấu các câu tính (có số liệu, ma trận, chuỗi tham chiếu) — thường 5–7 câu.</td></tr>
<tr><td>2–27</td><td>Lượt 1: mọi câu lý thuyết, khoảng 30 giây mỗi câu. Biết thì trả lời ngay; chưa chắc thì chọn phương án tốt nhất, <strong>gắn cờ</strong> (flag) rồi đi tiếp. Không nghĩ quá 1 phút ở lượt này.</td></tr>
<tr><td>27–47</td><td>Lượt 2: các câu tính, theo cách làm ở phần 3 trên giấy nháp, khoảng 3 phút mỗi câu. Bắt đầu bằng dạng bạn nhanh nhất.</td></tr>
<tr><td>47–57</td><td>Lượt 3: các câu đã gắn cờ. Đọc lại đề tìm NOT / EXCEPT / without rồi mới quyết.</td></tr>
<tr><td>57–60</td><td>Kiểm câu nào cũng có đáp án và câu "chọn hai" đã chọn đủ hai.</td></tr>
</tbody>
</table>
<ul>
<li><strong>Lý thuyết trước</strong>: khoảng 43 câu × 30 giây giữ chắc phần lớn bài thi trước khi các câu chậm kịp ăn mất thời gian.</li>
<li><strong>Không để trống</strong>: với đề trắc nghiệm chấm đúng/sai, chọn sai và bỏ trống cùng mất điểm như nhau, nên đoán là miễn phí (hỏi lại giảng viên quy chế kỳ thi của bạn).</li>
<li><strong>Luật 2 phút cho câu tính</strong>: kết quả không khớp phương án nào thì làm lại một lần; vẫn không khớp ⇒ chọn phương án gần nhất, gắn cờ, đi tiếp. FE1#13 chính là trường hợp đó.</li>
</ul>
<h3>4.2 Khi ngân hàng tự mâu thuẫn hoặc trái sách</h3>
<p>Ngân hàng câu hỏi do sinh viên gom lại, và nhóm soạn môn giữ một danh sách các câu có khoá sai hoặc không ổn định (mỗi bài chương đã nêu tên chúng trong ô ⚠️). Chọn thế nào:</p>
<table>
<thead><tr><th>Tình huống</th><th>Ví dụ</th><th>Chọn</th></tr></thead>
<tbody>
<tr><td>đề chép nguyên câu của sách</td><td>"RAID level ___ works worst with OS that ask one sector at a time" — khoá 3 (FE2#34, FE15#41) hoặc 2 (FE8#38)</td><td>đúng chữ của sách: <strong>RAID 0</strong></td></tr>
<tr><td>cùng một đề, hai khoá</td><td>"nonpreemptable … with / without potentially causing failure" (FE7#42 so với FE8#42)</td><td>phương án ĐÚNG theo định nghĩa: không lấy đi được <em>mà không</em> gây hỏng</td></tr>
<tr><td>hai đoạn sách nói khác nhau</td><td>spooling: Hình 6-14 xếp vào loại trừ lẫn nhau (FE19#49, FE23#39), §6.6.3 dùng nó cho không trưng dụng (FE2#50)</td><td>theo đúng chữ trong đề: "spool everything" ⇒ mutual exclusion; "spooling printer output để daemon giữ máy in" trong câu hỏi về no-preemption ⇒ phương án đó</td></tr>
<tr><td>SJF bị gọi là chiếm quyền</td><td>FE24#50 "chọn 2: thuật toán chiếm quyền" khoá SJF + RR</td><td>sách: SJF không chiếm quyền, SRTF mới là bản chiếm quyền; nếu bị bắt tích hai ô thì ngân hàng muốn SJF + RR</td></tr>
<tr><td>câu tính không phương án nào khớp</td><td>FE1#13: FCFS = 135, phương án 108, 96, 83, 114 (khoá 114)</td><td>tính lại một lần; rồi chọn phương án gần nhất (114), gắn cờ, đi tiếp</td></tr>
<tr><td>câu "evaluate" mơ hồ</td><td>FE1#19 ảo hoá bộ nhớ "enhances … improving performance"</td><td>khoá ngân hàng — phát biểu tích cực, giống giọng sách</td></tr>
</tbody>
</table>
<p class="meo">🧠 Luật đằng sau bảng: khoá thật của giảng viên viết theo sách. Ngân hàng trái sách thì sách thắng; chính sách mập mờ thì đúng chữ trong đề quyết định.</p>`),
    bi(`<h2>5. English you will meet in the paper</h2>
<p>The exam is in English only. These words decide the meaning of a question; the left column is exactly how the paper writes them.</p>
<table>
<thead><tr><th>In the paper</th><th>Vietnamese</th><th>What it really asks</th></tr></thead>
<tbody>
<tr><td>Which of the following is NOT / EXCEPT</td><td>điều nào KHÔNG / trừ</td><td>find the one false statement</td></tr>
<tr><td>best describes</td><td>mô tả đúng nhất</td><td>several are partly true — take the most complete</td></tr>
<tr><td>primarily / primary purpose</td><td>chủ yếu / mục đích chính</td><td>the main role, not a side effect</td></tr>
<tr><td>respectively</td><td>lần lượt</td><td>values given in the same order as the names</td></tr>
<tr><td>successive requests</td><td>các yêu cầu nối tiếp</td><td>apply them one after another, the state carries over</td></tr>
<tr><td>initially empty</td><td>ban đầu rỗng</td><td>the first loads are page faults too</td></tr>
<tr><td>almost the same time</td><td>gần như cùng lúc</td><td>all arrive at 0, in the listed order</td></tr>
<tr><td>in progress</td><td>đang thực hiện</td><td>the head is there now (start position)</td></tr>
<tr><td>average turnaround / waiting time</td><td>thời gian hoàn thành / chờ trung bình</td><td>finish − arrival / turnaround − burst</td></tr>
<tr><td>throughput</td><td>thông lượng</td><td>jobs finished per unit of time</td></tr>
<tr><td>preempt / preemptive</td><td>trưng dụng / có chiếm quyền</td><td>the OS takes the CPU or resource away</td></tr>
<tr><td>starvation</td><td>chết đói</td><td>a process waits forever although the system runs</td></tr>
<tr><td>thrashing</td><td>trì trệ do phân trang</td><td>more time paging than executing</td></tr>
<tr><td>overhead</td><td>chi phí phụ</td><td>work that is not useful work</td></tr>
<tr><td>contiguous / noncontiguous</td><td>liên tục / không liên tục</td><td>blocks next to each other or scattered</td></tr>
<tr><td>fragmentation (internal / external)</td><td>phân mảnh (trong / ngoài)</td><td>waste inside a block / between blocks</td></tr>
<tr><td>seek time / rotational delay</td><td>thời gian tìm / độ trễ quay</td><td>move the arm / wait for the sector</td></tr>
<tr><td>granted / allocated / held</td><td>được cấp / đang giữ</td><td>resources the process owns now</td></tr>
<tr><td>requested / claim / need</td><td>đang xin / nhu cầu khai / còn cần</td><td>detection uses Request, banker uses Need</td></tr>
<tr><td>safe / unsafe state</td><td>trạng thái an toàn / không an toàn</td><td>can every process still finish, guaranteed?</td></tr>
<tr><td>hypervisor / VMM / guest / host</td><td>trình ảo hoá / máy ảo khách / máy chủ</td><td>type 1 runs on the hardware, type 2 on a host OS</td></tr>
</tbody>
</table>
<p class="meo">🧠 The full glossary of each chapter is at the end of its 🧪 practice lesson. For this exam, learn the twenty rows above until you can translate them without looking — they appear in more than half of the 1 395 questions.</p>
<h2>📌 Summary</h2>
<ul>
<li>FE = 60 minutes, 50 multiple-choice questions in English, 40% of the course, at least 4/10. About 72 seconds per question.</li>
<li>Chapters 1–6 ≈ 97% of the questions; Ch.5, Ch.2, Ch.3 ≈ 58%. Chapter 7 gives a few easy marks (hypervisor, hypercall).</li>
<li>Half of the bank repeats; the three newest papers in the Exam Room are the best practice — but learn the reason, not the letter.</li>
<li>Every paper has about 5 computed questions; each type has a fixed paper method (section 3) — drill them until each takes under 3 minutes.</li>
<li>Plan: theory first (25 min), computations second (20 min), flagged questions last (10 min), nothing blank.</li>
<li>Traps: NOT/EXCEPT hidden in lowercase, with vs without, unsafe ≠ deadlock, wasted vs utilization, first loads count as page faults.</li>
<li>When the bank and the book disagree, the book wins; a computation that matches no option: recompute once, then the closest option.</li>
</ul>`,
    `<h2>5. Tiếng Anh bạn sẽ gặp trong đề</h2>
<p>Đề thi chỉ có tiếng Anh. Những từ dưới đây quyết định nghĩa của câu hỏi; cột trái ghi đúng như đề viết.</p>
<table>
<thead><tr><th>Trong đề</th><th>Tiếng Việt</th><th>Thực chất hỏi gì</th></tr></thead>
<tbody>
<tr><td>Which of the following is NOT / EXCEPT</td><td>điều nào KHÔNG / trừ</td><td>tìm một phát biểu SAI</td></tr>
<tr><td>best describes</td><td>mô tả đúng nhất</td><td>nhiều phương án đúng một phần — lấy cái đầy đủ nhất</td></tr>
<tr><td>primarily / primary purpose</td><td>chủ yếu / mục đích chính</td><td>vai trò chính, không phải tác dụng phụ</td></tr>
<tr><td>respectively</td><td>lần lượt</td><td>số liệu cho theo đúng thứ tự các tên</td></tr>
<tr><td>successive requests</td><td>các yêu cầu nối tiếp</td><td>làm lần lượt, trạng thái mang sang yêu cầu sau</td></tr>
<tr><td>initially empty</td><td>ban đầu rỗng</td><td>các lần nạp đầu cũng là lỗi trang</td></tr>
<tr><td>almost the same time</td><td>gần như cùng lúc</td><td>cùng đến lúc 0, theo thứ tự liệt kê</td></tr>
<tr><td>in progress</td><td>đang thực hiện</td><td>đầu từ đang ở đó (vị trí xuất phát)</td></tr>
<tr><td>average turnaround / waiting time</td><td>thời gian hoàn thành / chờ trung bình</td><td>xong − đến / hoàn thành − burst</td></tr>
<tr><td>throughput</td><td>thông lượng</td><td>số việc xong trong một đơn vị thời gian</td></tr>
<tr><td>preempt / preemptive</td><td>trưng dụng / có chiếm quyền</td><td>HĐH giật CPU hay tài nguyên lại</td></tr>
<tr><td>starvation</td><td>chết đói</td><td>một tiến trình chờ mãi dù hệ thống vẫn chạy</td></tr>
<tr><td>thrashing</td><td>trì trệ do phân trang</td><td>tốn thời gian phân trang hơn thời gian chạy</td></tr>
<tr><td>overhead</td><td>chi phí phụ</td><td>công sức không phải việc có ích</td></tr>
<tr><td>contiguous / noncontiguous</td><td>liên tục / không liên tục</td><td>các khối liền nhau hay rải rác</td></tr>
<tr><td>fragmentation (internal / external)</td><td>phân mảnh (trong / ngoài)</td><td>phí bên trong một khối / giữa các khối</td></tr>
<tr><td>seek time / rotational delay</td><td>thời gian tìm / độ trễ quay</td><td>di chuyển cần / chờ sector quay tới</td></tr>
<tr><td>granted / allocated / held</td><td>được cấp / đang giữ</td><td>tài nguyên tiến trình đang sở hữu</td></tr>
<tr><td>requested / claim / need</td><td>đang xin / nhu cầu khai / còn cần</td><td>phát hiện bế tắc dùng Request, nhà băng dùng Need</td></tr>
<tr><td>safe / unsafe state</td><td>trạng thái an toàn / không an toàn</td><td>có còn BẢO ĐẢM mọi tiến trình chạy xong không</td></tr>
<tr><td>hypervisor / VMM / guest / host</td><td>trình ảo hoá / máy khách / máy chủ</td><td>loại 1 chạy trên phần cứng, loại 2 trên một HĐH chủ</td></tr>
</tbody>
</table>
<p class="meo">🧠 Bảng thuật ngữ đầy đủ của từng chương nằm cuối bài 🧪 thực hành của chương đó. Cho kỳ thi này, học hai mươi dòng trên tới mức dịch được không cần nhìn — chúng xuất hiện trong hơn một nửa số 1 395 câu.</p>
<h2>📌 Tóm tắt</h2>
<ul>
<li>FE = 60 phút, 50 câu trắc nghiệm tiếng Anh, 40% điểm môn, tối thiểu 4/10. Khoảng 72 giây mỗi câu.</li>
<li>Chương 1–6 ≈ 97% số câu; Ch.5, Ch.2, Ch.3 ≈ 58%. Chương 7 cho vài điểm dễ (hypervisor, hypercall).</li>
<li>Một nửa ngân hàng là câu lặp; ba đề mới nhất trong Phòng thi là bài luyện tốt nhất — nhưng học lý do, đừng học chữ cái.</li>
<li>Đề nào cũng có khoảng 5 câu tính; mỗi dạng có một cách làm cố định trên giấy (phần 3) — luyện tới khi mỗi dạng dưới 3 phút.</li>
<li>Kế hoạch: lý thuyết trước (25 phút), câu tính sau (20 phút), câu gắn cờ cuối cùng (10 phút), không để trống.</li>
<li>Bẫy: NOT/EXCEPT giấu trong chữ thường, with và without, không an toàn ≠ bế tắc, phí (wasted) và hiệu suất (utilization), lần nạp đầu vẫn là lỗi trang.</li>
<li>Ngân hàng trái sách thì sách thắng; câu tính không khớp phương án nào: tính lại một lần, rồi chọn phương án gần nhất.</li>
</ul>`),
  ].join('\n'),
};

/* ───────── 🎯 FE1 (SU26-RE) solved — all 50 questions: translation, vocabulary, every option explained ───────── */
const L_x_chua_fe1 = {
  title: '🎯 FE1 (SU26-RE) solved — all 50 questions: translation, vocabulary, every option explained|||🎯 Chữa trọn đề FE1 (SU26-RE) — 50 câu: dịch, từ vựng, giải thích từng phương án',
  slug: 'osg202-chua-fe1',
  type: 'VIDEO',
  description: 'Chữa trọn đề thi cuối kỳ mới nhất trong Phòng thi — FE1, kỳ SU26 thi lại — đủ 50 câu của đề gốc (Phòng thi có 30 câu, 20 câu đầu chép từ ảnh đề gốc), chia theo chương: mỗi câu có ảnh đề gốc, đề tiếng Anh nguyên văn, bản dịch, từ vựng khó, đáp án kèm lý do và vì sao từng phương án kia sai, link tới bài học; bảy câu tính toán (lập lịch đĩa, nhà băng, phát hiện bế tắc, thay trang, thanh ghi base và limit, số lịch có thể) tính lại bằng mô phỏng và chương trình chạy thật — trong đó câu FCFS có khoá ngân hàng sai.',
  content: [
    bi(`<span class="eyebrow">🎯 Final Exam · FE1 = SU26-RE (summer 2026, retake) · full walkthrough</span>
<h2>Before you read: do the paper first</h2>
<p class="lead">Open <a href="/exam?course=OSG202">the Exam Room</a>, take <strong>FE1</strong> with the 60-minute timer, and only then come back. A walkthrough read before trying is forgotten in a day; one read after your own mistakes is remembered.</p>
<p>The real SU26-RE paper has <strong>50 questions</strong>. The Exam Room version has the last 30 (questions 21–50, with the original scanned image); questions 1–20 survive only as images of the original paper, so they are copied here as text. Each heading gives both numbers: <em>Q33 · Exam Room #13</em>.</p>
<h3>The paper in numbers</h3>
<table>
<thead><tr><th>Chapter</th><th>Questions of this paper</th><th>Count</th><th>Computed</th></tr></thead>
<tbody>
<tr><td>Ch.1 Introduction</td><td>1, 2, 43, 44, 45, 50</td><td>6</td><td>—</td></tr>
<tr><td>Ch.2 Processes and threads</td><td>4, 5, 6, 7, 8, 9, 10, 28, 42</td><td>9</td><td>9</td></tr>
<tr><td>Ch.3 Memory management</td><td>3, 11, 12, 13, 14, 15, 16, 17, 18, 19, 46</td><td>11</td><td>15, 17</td></tr>
<tr><td>Ch.4 File systems</td><td>20, 21, 22, 23, 24, 25, 26</td><td>7</td><td>—</td></tr>
<tr><td>Ch.5 Input/output</td><td>27, 29, 30, 31, 32, 33, 34</td><td>7</td><td>29, 33</td></tr>
<tr><td>Ch.6 Deadlocks</td><td>35, 36, 37, 38, 47, 48, 49</td><td>7</td><td>47, 48</td></tr>
<tr><td>Ch.7 Virtualization</td><td>39, 40, 41</td><td>3</td><td>—</td></tr>
<tr><td>Total</td><td></td><td>50</td><td>7</td></tr>
</tbody>
</table>
<ul>
<li>Like every paper, Chapters 1–6 are 47 of 50 questions; Chapter 7 gives three easy marks.</li>
<li><strong>7 computed questions</strong>; each answer below was produced by the course simulator or a program run in the Linux container, and every option of the paper was checked against it.</li>
<li><strong>The bank's key is wrong once</strong> (Q33 · Exam Room #13: FCFS gives 135, no option is correct) and <strong>debatable once</strong> (Q39 · #19). Six of the first twenty questions have no key in any paper of the bank; their answers come from the book and are marked as such.</li>
<li>Two thirds of this paper's Exam Room questions had already appeared in older papers — the <a href="/courses/operating-systems/learn?lessonSlug=osg202-on-fe-chien-thuat">FE strategy lesson</a> shows the numbers.</li>
</ul>`,
    `<span class="eyebrow">🎯 Thi cuối kỳ · FE1 = SU26-RE (hè 2026, thi lại) · chữa trọn đề</span>
<h2>Trước khi đọc: làm đề trước đã</h2>
<p class="lead">Mở <a href="/exam?course=OSG202">Phòng thi</a>, làm <strong>FE1</strong> với đồng hồ 60 phút, rồi mới quay lại đây. Bài chữa đọc trước khi tự làm thì một ngày là quên; đọc sau khi đã tự sai thì nhớ lâu.</p>
<p>Đề SU26-RE thật có <strong>50 câu</strong>. Bản trong Phòng thi có 30 câu cuối (câu 21–50, kèm ảnh đề gốc); câu 1–20 chỉ còn trong ảnh của đề gốc, nên được chép lại thành chữ ở đây. Tiêu đề mỗi câu ghi cả hai số: <em>Câu 33 · Phòng thi #13</em>.</p>
<h3>Đề này qua các con số</h3>
<table>
<thead><tr><th>Chương</th><th>Các câu của đề</th><th>Số câu</th><th>Câu tính</th></tr></thead>
<tbody>
<tr><td>Ch.1 Nhập môn</td><td>1, 2, 43, 44, 45, 50</td><td>6</td><td>—</td></tr>
<tr><td>Ch.2 Tiến trình và luồng</td><td>4, 5, 6, 7, 8, 9, 10, 28, 42</td><td>9</td><td>9</td></tr>
<tr><td>Ch.3 Quản lý bộ nhớ</td><td>3, 11, 12, 13, 14, 15, 16, 17, 18, 19, 46</td><td>11</td><td>15, 17</td></tr>
<tr><td>Ch.4 Hệ thống tệp</td><td>20, 21, 22, 23, 24, 25, 26</td><td>7</td><td>—</td></tr>
<tr><td>Ch.5 Vào/ra</td><td>27, 29, 30, 31, 32, 33, 34</td><td>7</td><td>29, 33</td></tr>
<tr><td>Ch.6 Bế tắc</td><td>35, 36, 37, 38, 47, 48, 49</td><td>7</td><td>47, 48</td></tr>
<tr><td>Ch.7 Ảo hoá</td><td>39, 40, 41</td><td>3</td><td>—</td></tr>
<tr><td>Tổng</td><td></td><td>50</td><td>7</td></tr>
</tbody>
</table>
<ul>
<li>Như mọi đề, Chương 1–6 chiếm 47 trên 50 câu; Chương 7 cho ba điểm dễ.</li>
<li><strong>7 câu tính toán</strong>; mỗi đáp án dưới đây do bộ mô phỏng của môn hoặc một chương trình chạy thật trong container Linux tính ra, và mọi phương án của đề đều được chấm lại theo đó.</li>
<li><strong>Khoá ngân hàng sai một câu</strong> (Câu 33 · Phòng thi #13: FCFS ra 135, không phương án nào đúng) và <strong>gây tranh cãi một câu</strong> (Câu 39 · #19). Sáu trong hai mươi câu đầu không có khoá ở bất kỳ đề nào của ngân hàng; đáp án của chúng lấy từ sách và được ghi rõ như vậy.</li>
<li>Hai phần ba số câu Phòng thi của đề này đã từng xuất hiện ở đề cũ — <a href="/courses/operating-systems/learn?lessonSlug=osg202-on-fe-chien-thuat">bài chiến thuật FE</a> có số liệu.</li>
</ul>`),
    bi(`<h2>Chapter 1 — Introduction (6 questions)</h2>
<h3>Q1 · original paper only — the purpose of an OS</h3>
<p><em>What is the primary purpose of an operating system?</em><br>A. To execute application programs. · B. To provide a user-friendly interface. · C. To manage hardware resources and provide services to software. · D. To create computer games.</p>
<p class="dap-an">✅ <strong>C.</strong> The book gives the OS two jobs: <strong>resource manager</strong> (share CPU, memory, disks among programs) and <strong>extended machine</strong> (clean services/abstractions for programs). C says both. Same question in FE5#3, key C.</p>
<ul><li>A — running programs is one service, not the purpose. B — a GUI is a program on top of the OS (the shell), many servers have none. D — nonsense distractor.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slides 4–5.</p>
<h3>Q2 · original paper only — the shift that made time-sharing</h3>
<p><em>In the evolution of operating systems, which fundamental shift was the most critical in enabling modern multitasking and time-sharing capabilities?</em><br>A. The introduction of graphical user interfaces (GUIs) in the 1980s · B. The transition from batch processing to interactive computing in the 1960s · C. The development of single-user operating systems for personal computers in the 1970s · D. The adoption of cloud-based virtualization in the 2000s</p>
<p class="dap-an">✅ <strong>B.</strong> Third generation (1965–1980): multiprogramming, then time-sharing (CTSS, MULTICS) — many users at terminals, each getting quick turns of the CPU. That is the move from batch to interactive. Same question in FE2#2, key B.</p>
<ul><li>A — GUIs came after time-sharing existed. C — single-user PCs went the other way (one user). D — the cloud is 40 years later.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slides 6–10.</p>
<h3>Q43 · Exam Room #23 — cache hit</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q43.png" alt="Original question 43" loading="lazy" /></p></details>
<p><em>What is a cache hit in CPU cache memory?</em><br>A. When the requested data is found in the cache, avoiding access to main memory. · B. When the CPU fails to locate data in the cache and retrieves it from RAM. · C. When a new cache line is added to the cache memory and collides with previously stored data. · D. When all cache levels are fully utilized by the CPU</p>
<p class="dap-an">✅ <strong>A.</strong> Hit = found in the cache, so the slower RAM access is skipped.</p>
<ul><li>B is the definition of a <em>miss</em>. C describes a conflict on insertion (an eviction), not a hit. D is a made-up "full cache" state.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slides 13–14.</p>
<h3>Q44 · Exam Room #24 — the two functions of an OS</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q44.png" alt="Original question 44" loading="lazy" /></p></details>
<p><em>What are the two main functions of an operating system?</em><br>A. Debugging and memory allocation · B. Resource management and memory allocation · C. Resource management and providing abstractions · D. Networking and power saving</p>
<p class="dap-an">✅ <strong>C.</strong> Top-down: the OS gives programs <strong>abstractions</strong> (files, processes, address spaces) instead of raw hardware. Bottom-up: it <strong>manages resources</strong>. Same pair as Q1.</p>
<ul><li>B — memory allocation is a <em>part</em> of resource management, so B names one function twice. A, D — side jobs, not the definition.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slides 4–5.</p>
<h3>Q45 · Exam Room #25 — monolithic structure</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q45.png" alt="Original question 45" loading="lazy" /></p></details>
<p><em>Which of the following best describes a monolithic operating system structure?</em><br>A. A system where all functionalities are divided into separate processes. · B. A system where only file management is in the kernel. · C. A system where all components run in supervisor mode. · D. A system where drivers are executed in user space.</p>
<p class="dap-an">✅ <strong>C.</strong> Monolithic = the whole OS is one program running in kernel (supervisor) mode; any procedure can call any other.</p>
<ul><li>A — separate processes is the client-server / microkernel idea. B — nothing like that exists. D — user-space drivers are a microkernel feature (MINIX 3).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slides 38–41.</p>
<h3>Q50 · Exam Room #30 — fork() and exec()</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q50.png" alt="Original question 50" loading="lazy" /></p></details>
<p><em>In UNIX systems, what is the primary purpose of system calls like fork() and exec()?</em><br>A. To control peripheral devices. · B. To load device drivers into memory. · C. To create and execute new processes. · D. To switch between user and kernel mode.</p>
<p class="dap-an">✅ <strong>C.</strong> <code>fork()</code> creates a copy of the calling process; <code>exec()</code> replaces its memory image with a new program. Together: create and run a new program.</p>
<ul><li>A, B — that is <code>ioctl</code>/driver loading, not process calls. D — <em>every</em> system call switches mode through a trap; that is not what makes fork/exec special.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slide 32, and the running example in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 5.</p>`,
    `<h2>Chương 1 — Nhập môn (6 câu)</h2>
<h3>Câu 1 · chỉ có trong đề gốc — mục đích của HĐH</h3>
<p>🇬🇧 <em>What is the primary purpose of an operating system?</em><br>A. To execute application programs. · B. To provide a user-friendly interface. · C. To manage hardware resources and provide services to software. · D. To create computer games.</p>
<p>🇻🇳 Mục đích chính của hệ điều hành là gì? A. Chạy chương trình ứng dụng. · B. Cung cấp giao diện thân thiện. · C. Quản lý tài nguyên phần cứng và cung cấp dịch vụ cho phần mềm. · D. Tạo trò chơi máy tính.</p>
<p>📚 <strong>primary purpose</strong> = mục đích chính · <strong>hardware resources</strong> = tài nguyên phần cứng.</p>
<p class="dap-an">✅ <strong>C.</strong> Sách giao cho HĐH hai việc: <strong>quản lý tài nguyên</strong> (chia CPU, bộ nhớ, đĩa cho các chương trình) và <strong>máy mở rộng</strong> (extended machine — dịch vụ, trừu tượng gọn gàng cho chương trình). C nói đủ cả hai. Cùng câu ở FE5#3, khoá C.</p>
<ul><li>A — chạy chương trình là một dịch vụ, không phải mục đích. B — giao diện đồ hoạ là một chương trình nằm trên HĐH (shell), nhiều server không có. D — phương án nhiễu vô nghĩa.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 4–5.</p>
<h3>Câu 2 · chỉ có trong đề gốc — bước ngoặt sinh ra chia sẻ thời gian</h3>
<p>🇬🇧 <em>In the evolution of operating systems, which fundamental shift was the most critical in enabling modern multitasking and time-sharing capabilities?</em><br>A. The introduction of graphical user interfaces (GUIs) in the 1980s · B. The transition from batch processing to interactive computing in the 1960s · C. The development of single-user operating systems for personal computers in the 1970s · D. The adoption of cloud-based virtualization in the 2000s</p>
<p>🇻🇳 Trong quá trình phát triển của HĐH, bước chuyển nền tảng nào quan trọng nhất để có đa nhiệm và chia sẻ thời gian hiện đại? A. Giao diện đồ hoạ thập niên 1980 · B. Chuyển từ xử lý theo lô sang tương tác thập niên 1960 · C. HĐH một người dùng cho máy tính cá nhân thập niên 1970 · D. Ảo hoá trên đám mây thập niên 2000.</p>
<p>📚 <strong>evolution</strong> = quá trình phát triển · <strong>batch processing</strong> = xử lý theo lô · <strong>time-sharing</strong> = chia sẻ thời gian · <strong>interactive</strong> = tương tác.</p>
<p class="dap-an">✅ <strong>B.</strong> Thế hệ thứ ba (1965–1980): đa chương trình, rồi chia sẻ thời gian (CTSS, MULTICS) — nhiều người ngồi ở terminal, mỗi người nhận những lượt CPU ngắn. Đó chính là bước từ lô sang tương tác. Cùng câu ở FE2#2, khoá B.</p>
<ul><li>A — GUI ra đời khi chia sẻ thời gian đã có từ lâu. C — PC một người dùng đi theo hướng ngược lại. D — đám mây muộn hơn 40 năm.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 6–10.</p>
<h3>Câu 43 · Phòng thi #23 — cache hit</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q43.png" alt="Ảnh đề gốc câu 43" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is a cache hit in CPU cache memory?</em><br>A. When the requested data is found in the cache, avoiding access to main memory. · B. When the CPU fails to locate data in the cache and retrieves it from RAM. · C. When a new cache line is added to the cache memory and collides with previously stored data. · D. When all cache levels are fully utilized by the CPU</p>
<p>🇻🇳 "Cache hit" (trúng bộ đệm) trong bộ nhớ đệm CPU là gì? A. Dữ liệu cần tìm có sẵn trong cache, khỏi phải truy cập bộ nhớ chính. · B. CPU không tìm thấy trong cache và lấy từ RAM. · C. Một dòng cache mới được thêm và va chạm với dữ liệu cũ. · D. Mọi tầng cache đều bị CPU dùng hết.</p>
<p>📚 <strong>hit / miss</strong> = trúng / trượt · <strong>cache line</strong> = dòng cache (đơn vị chép giữa RAM và cache, thường 64 byte) · <strong>retrieve</strong> = lấy về.</p>
<p class="dap-an">✅ <strong>A.</strong> Trúng = tìm thấy trong cache, nên bỏ qua được lần truy cập RAM chậm hơn.</p>
<ul><li>B là định nghĩa của <em>miss</em> (trượt). C tả xung đột khi chèn (một lần đẩy dòng cũ ra), không phải trúng. D là trạng thái "cache đầy" bịa ra.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 13–14.</p>
<h3>Câu 44 · Phòng thi #24 — hai chức năng của HĐH</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q44.png" alt="Ảnh đề gốc câu 44" loading="lazy" /></p></details>
<p>🇬🇧 <em>What are the two main functions of an operating system?</em><br>A. Debugging and memory allocation · B. Resource management and memory allocation · C. Resource management and providing abstractions · D. Networking and power saving</p>
<p>🇻🇳 Hai chức năng chính của hệ điều hành là gì? A. Gỡ lỗi và cấp phát bộ nhớ · B. Quản lý tài nguyên và cấp phát bộ nhớ · C. Quản lý tài nguyên và cung cấp các trừu tượng · D. Mạng và tiết kiệm điện.</p>
<p>📚 <strong>abstraction</strong> = sự trừu tượng (giấu chi tiết phần cứng sau một khái niệm gọn: tệp, tiến trình) · <strong>resource management</strong> = quản lý tài nguyên.</p>
<p class="dap-an">✅ <strong>C.</strong> Nhìn từ trên xuống: HĐH cho chương trình các <strong>trừu tượng</strong> (tệp, tiến trình, không gian địa chỉ) thay cho phần cứng trần. Nhìn từ dưới lên: nó <strong>quản lý tài nguyên</strong>. Cùng cặp ý với câu 1.</p>
<ul><li>B — cấp phát bộ nhớ là <em>một phần</em> của quản lý tài nguyên, nên B nêu một chức năng hai lần. A, D — việc phụ, không phải định nghĩa.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 4–5.</p>
<h3>Câu 45 · Phòng thi #25 — cấu trúc nguyên khối</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q45.png" alt="Ảnh đề gốc câu 45" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which of the following best describes a monolithic operating system structure?</em><br>A. A system where all functionalities are divided into separate processes. · B. A system where only file management is in the kernel. · C. A system where all components run in supervisor mode. · D. A system where drivers are executed in user space.</p>
<p>🇻🇳 Phát biểu nào mô tả đúng nhất cấu trúc HĐH nguyên khối (monolithic)? A. Mọi chức năng tách thành các tiến trình riêng. · B. Chỉ quản lý tệp nằm trong nhân. · C. Mọi thành phần chạy ở chế độ giám sát (supervisor/kernel mode). · D. Driver chạy trong không gian người dùng.</p>
<p>📚 <strong>monolithic</strong> = nguyên khối · <strong>supervisor mode</strong> = chế độ giám sát = kernel mode · <strong>user space</strong> = không gian người dùng.</p>
<p class="dap-an">✅ <strong>C.</strong> Nguyên khối = cả HĐH là một chương trình duy nhất chạy ở kernel mode; thủ tục nào cũng gọi được thủ tục khác.</p>
<ul><li>A — tách thành tiến trình riêng là ý tưởng client-server / vi nhân (microkernel). B — không có kiểu nào như vậy. D — driver chạy ở user space là đặc điểm của vi nhân (MINIX 3).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slide 38–41.</p>
<h3>Câu 50 · Phòng thi #30 — fork() và exec()</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q50.png" alt="Ảnh đề gốc câu 50" loading="lazy" /></p></details>
<p>🇬🇧 <em>In UNIX systems, what is the primary purpose of system calls like fork() and exec()?</em><br>A. To control peripheral devices. · B. To load device drivers into memory. · C. To create and execute new processes. · D. To switch between user and kernel mode.</p>
<p>🇻🇳 Trong UNIX, lời gọi hệ thống như fork() và exec() dùng chủ yếu để làm gì? A. Điều khiển thiết bị ngoại vi. · B. Nạp driver vào bộ nhớ. · C. Tạo và chạy tiến trình mới. · D. Chuyển giữa user mode và kernel mode.</p>
<p>📚 <strong>system call</strong> = lời gọi hệ thống · <strong>peripheral device</strong> = thiết bị ngoại vi.</p>
<p class="dap-an">✅ <strong>C.</strong> <code>fork()</code> tạo bản sao của tiến trình gọi; <code>exec()</code> thay ảnh bộ nhớ của nó bằng một chương trình mới. Gộp lại: tạo và chạy một chương trình mới.</p>
<ul><li>A, B — đó là <code>ioctl</code> / nạp driver, không phải lời gọi về tiến trình. D — <em>mọi</em> system call đều chuyển chế độ qua lệnh trap; đó không phải điểm riêng của fork/exec.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slide 32, và ví dụ chạy thật ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 5.</p>`),
    bi(`<h2>Chapter 2 — Processes and threads (9 questions)</h2>
<h3>Q4 · original paper only — the web server's cache</h3>
<p><em>In threads, web servers use this fact to improve performance by maintaining a collection of heavily used pages in main memory to eliminate the need to go to disk to get them. What is a collection called?</em><br>A. Threads · B. Dispatcher · C. Buffer · D. Cache</p>
<p class="dap-an">✅ <strong>D — cache.</strong> The book's multithreaded web server (Fig. 2-8): the dispatcher thread hands requests to workers, and popular pages are kept in a <em>Web page cache</em> in RAM. Same question in FE3#5, key D.</p>
<ul><li>A, B — threads and the dispatcher are the actors, not the collection. C — a buffer holds data in transit once; a cache keeps data to be reused.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slides 13–14.</p>
<h3>Q5 · original paper only — preemptive priority</h3>
<p><em>In the preemptive priority scheduling algorithm, when a process arrives at the ready queue, its priority is compared with the priority of ____</em><br>A. all process · B. currently running process · C. parent process · D. init process</p>
<p class="dap-an">✅ <strong>B.</strong> Preemptive = the newcomer takes the CPU at once if it beats the process that is <em>running now</em>. Same question in FE5#9, key B.</p>
<ul><li>A — the queue is ordered anyway; the decision to preempt only needs the running one. C, D — family relations play no role in scheduling.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 63.</p>
<h3>Q6 · original paper only — end of a quantum</h3>
<p><em>In the Round-robin scheduling, what happens to a process when it runs out of the of time allocated by the system?</em><br>A. The process switches from running to a ready state. · B. The process switches from running to a blocked state. · C. The process switches from running to a suspended-ready state. · D. The process switches from running to a suspended state.</p>
<p class="dap-an">✅ <strong>A.</strong> Quantum used up ⇒ the process is still runnable, so it goes back to the <strong>end of the ready queue</strong> (transition 2 of the three-state diagram). Same question in FE3#6, FE11#10, FE14#10, key A.</p>
<ul><li>B — blocked means waiting for an event (I/O); nothing was requested. C, D — "suspended" states belong to swapping models, not to the book's three states.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 62; state diagram in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 7.</p>
<h3>Q7 · original paper only — parallelism with blocking calls</h3>
<p><em>Which programming model supports parallel execution but may involve blocking system calls during execution?</em><br>A. Single-threaded process · B. Finite-state machine · C. Threads · D. None of the above</p>
<p class="dap-an">✅ <strong>C.</strong> Fig. 2-10 of the book compares three ways to build a server: threads = parallelism + blocking system calls; single-threaded process = no parallelism + blocking calls; finite-state machine = parallelism + <em>non-blocking</em> calls and interrupts. Same question in FE3#7, key C.</p>
<ul><li>A — blocking but no parallelism. B — parallel but non-blocking. D — C is correct.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 16.</p>
<h3>Q8 · original paper only — a critical section</h3>
<p><em>What defines a critical section in the context of the Windows operating system?</em><br>A. It is a section of code where the processor gives priority to execute multiple threads simultaneously. · B. It is a section of code where hardware interrupts are disabled to ensure uninterrupted execution. · C. It is a segment of code that only one thread can execute at a time to avoid data inconsistency or conflicts. · D. It is a part of the kernel where system-level processes are given higher priority over user-level processes.</p>
<p class="dap-an">✅ <strong>C.</strong> A critical region is the part of a program that touches shared data; mutual exclusion lets only one thread in at a time. Windows even names its user-mode lock <code>CRITICAL_SECTION</code>. Same question in FE6#12, FE8#11, FE14#14, FE15#14, key C.</p>
<ul><li>A — the opposite of exclusion. B — disabling interrupts is one (bad) way to <em>implement</em> exclusion on one CPU, not the definition. D — that is priority, not a critical section.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-2">2.B</a>, slides 29–30; Windows locks in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg11-2">11.B</a>.</p>
<h3>Q9 · original paper only — how many schedules (computed)</h3>
<p><em>A CPU-scheduling algorithm determines an order for the execution of its scheduled processes. Given n processes to be scheduled on one processor, how many different schedules are possible?</em><br>A. n! · B. 2*n · C. log2n · D. n</p>
<p>No paper of the bank has this question with a key, so we count: the program lists every order of n processes and counts them.</p>
<pre><code class="language-javascript">// How many different schedules for n processes on one CPU? Enumerate them all and count
function orders(items) {
  if (items.length &lt;= 1) return [items];
  return items.flatMap((x, i) =&gt; orders([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) =&gt; [x, ...rest]));
}
const fact = (n) =&gt; (n &lt;= 1 ? 1 : n * fact(n - 1));
for (let n = 1; n &lt;= 6; n++) {
  const all = orders(Array.from({ length: n }, (_, i) =&gt; &#96;P&#36;{i + 1}&#96;));
  const sample = n &lt;= 3 ? '  ' + all.map((o) =&gt; o.join('')).join(' ') : '';
  console.log(&#96;n = &#36;{n}: &#36;{String(all.length).padStart(3)} schedules  n! = &#36;{String(fact(n)).padStart(3)}  2*n = &#36;{String(2 * n).padStart(2)}  log2 n = &#36;{Math.log2(n).toFixed(2)}&#36;{sample}&#96;);
}</code></pre>
<div class="out">$ node so-lich.js<br>
n = 1: &nbsp;&nbsp;1 schedules &nbsp;n! = &nbsp;&nbsp;1 &nbsp;2*n = &nbsp;2 &nbsp;log2 n = 0.00 &nbsp;P1<br>
n = 2: &nbsp;&nbsp;2 schedules &nbsp;n! = &nbsp;&nbsp;2 &nbsp;2*n = &nbsp;4 &nbsp;log2 n = 1.00 &nbsp;P1P2 P2P1<br>
n = 3: &nbsp;&nbsp;6 schedules &nbsp;n! = &nbsp;&nbsp;6 &nbsp;2*n = &nbsp;6 &nbsp;log2 n = 1.58 &nbsp;P1P2P3 P1P3P2 P2P1P3 P2P3P1 P3P1P2 P3P2P1<br>
n = 4: &nbsp;24 schedules &nbsp;n! = &nbsp;24 &nbsp;2*n = &nbsp;8 &nbsp;log2 n = 2.00<br>
n = 5: 120 schedules &nbsp;n! = 120 &nbsp;2*n = 10 &nbsp;log2 n = 2.32<br>
n = 6: 720 schedules &nbsp;n! = 720 &nbsp;2*n = 12 &nbsp;log2 n = 2.58</div>
<p class="dap-an">✅ <strong>A — n!</strong> The first slot can be any of n processes, the second any of the n − 1 left, … ⇒ n × (n − 1) × … × 1.</p>
<ul><li>B, C, D — grow far too slowly. Watch the trap in the output: for n = 3, 2*n = 6 = 3! — a quick check with three processes cannot tell A from B; try n = 4 (24 versus 8).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slides 56–59.</p>
<h3>Q10 · original paper only — the dining philosophers</h3>
<p><em>In the Dining Philosophers problem, what do the philosophers represent?</em><br>A. Real-world philosophers dining in a restaurant. · B. Concurrent processes that compete for access to shared resources. · C. Philosophical concepts unrelated to computing. · D. A form of computer virus.</p>
<p class="dap-an">✅ <strong>B.</strong> Dijkstra's 1965 problem models processes competing for a limited set of shared resources (the forks). Same question in FE4#13, FE7#16, FE12#14, FE13#14, key B.</p>
<ul><li>A, C, D — taken literally or unrelated.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slides 67–71.</p>
<h3>Q28 · Exam Room #8 — compute-bound versus I/O-bound</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q28.png" alt="Original question 28" loading="lazy" /></p></details>
<p><em>Which statement is true about the classification of a process based on its behavior?</em><br>A. A compute-bound process spent most of its time computing · B. A compute-bound process spent most of its time on IO processing · C. An I/O-bound process spent most of its time computing · D. A compute-bound process sometimes spent most of its time for IO waiting</p>
<p class="dap-an">✅ <strong>A.</strong> Compute-bound (CPU-bound): long CPU bursts, rare I/O. I/O-bound: short bursts, frequent waits.</p>
<ul><li>B, C swap the two definitions. D contradicts "compute-bound".</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 56.</p>
<h3>Q42 · Exam Room #22 — degree of multiprogramming</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q42.png" alt="Original question 42" loading="lazy" /></p></details>
<p><em>In a multiprogramming environment, if the degree of multiprogramming is increased, what will happen to CPU utilization in general?</em><br>A. Decrease first, then increase · B. Increase first, then decrease · C. Always decrease · D. Always increase · E. Remain constant</p>
<p class="dap-an">✅ <strong>B.</strong> More processes in memory ⇒ the CPU finds work more often (1 − pⁿ rises). Past a point the processes no longer fit in RAM, page faults explode and the CPU waits for the disk — <strong>thrashing</strong> — so utilization falls.</p>
<ul><li>D is the trap: it is what the 1 − pⁿ formula alone says, but the formula assumes everything fits in memory. A, C, E — no model gives those shapes.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 12 (the curve) and <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slides 30–31 (thrashing).</p>`,
    `<h2>Chương 2 — Tiến trình và luồng (9 câu)</h2>
<h3>Câu 4 · chỉ có trong đề gốc — cache của web server</h3>
<p>🇬🇧 <em>In threads, web servers use this fact to improve performance by maintaining a collection of heavily used pages in main memory to eliminate the need to go to disk to get them. What is a collection called?</em><br>A. Threads · B. Dispatcher · C. Buffer · D. Cache</p>
<p>🇻🇳 (Phần luồng) Web server tận dụng điều này để tăng hiệu năng: giữ một tập các trang được dùng nhiều trong bộ nhớ chính để khỏi phải lên đĩa lấy. Tập đó gọi là gì? A. Luồng · B. Bộ điều phối · C. Bộ đệm tạm · D. Cache.</p>
<p>📚 <strong>heavily used</strong> = được dùng nhiều · <strong>dispatcher</strong> = luồng điều phối · <strong>eliminate the need</strong> = khỏi phải.</p>
<p class="dap-an">✅ <strong>D — cache.</strong> Web server đa luồng của sách (Hình 2-8): luồng điều phối (dispatcher) giao yêu cầu cho các luồng làm việc, và các trang hay dùng được giữ trong <em>Web page cache</em> trên RAM. Cùng câu ở FE3#5, khoá D.</p>
<ul><li>A, B — luồng và dispatcher là "người làm", không phải tập dữ liệu. C — buffer giữ dữ liệu đang chuyển một lần; cache giữ dữ liệu để dùng lại.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 13–14.</p>
<h3>Câu 5 · chỉ có trong đề gốc — ưu tiên có chiếm quyền</h3>
<p>🇬🇧 <em>In the preemptive priority scheduling algorithm, when a process arrives at the ready queue, its priority is compared with the priority of ____</em><br>A. all process · B. currently running process · C. parent process · D. init process</p>
<p>🇻🇳 Trong lập lịch ưu tiên có chiếm quyền, khi một tiến trình vào hàng đợi sẵn sàng, độ ưu tiên của nó được so với độ ưu tiên của ____ A. mọi tiến trình · B. tiến trình đang chạy · C. tiến trình cha · D. tiến trình init.</p>
<p>📚 <strong>preemptive</strong> = có chiếm quyền (giật CPU) · <strong>ready queue</strong> = hàng đợi sẵn sàng.</p>
<p class="dap-an">✅ <strong>B.</strong> Chiếm quyền = tiến trình mới đến giành CPU ngay nếu nó ưu tiên hơn tiến trình <em>đang chạy</em>. Cùng câu ở FE5#9, khoá B.</p>
<ul><li>A — hàng đợi vốn đã xếp theo ưu tiên; quyết định chiếm quyền chỉ cần so với kẻ đang chạy. C, D — quan hệ cha con không dính gì tới lập lịch.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 63.</p>
<h3>Câu 6 · chỉ có trong đề gốc — hết lượng tử</h3>
<p>🇬🇧 <em>In the Round-robin scheduling, what happens to a process when it runs out of the of time allocated by the system?</em><br>A. The process switches from running to a ready state. · B. The process switches from running to a blocked state. · C. The process switches from running to a suspended-ready state. · D. The process switches from running to a suspended state.</p>
<p>🇻🇳 Trong lập lịch xoay vòng (round-robin), tiến trình dùng hết phần thời gian được cấp thì sao? A. Chuyển từ đang chạy sang sẵn sàng. · B. … sang bị chặn. · C. … sang treo-sẵn sàng. · D. … sang treo.</p>
<p>📚 <strong>runs out of</strong> = dùng hết · <strong>blocked</strong> = bị chặn (chờ sự kiện) · <strong>suspended</strong> = bị treo (bị đẩy ra đĩa).</p>
<p class="dap-an">✅ <strong>A.</strong> Hết lượng tử ⇒ tiến trình vẫn chạy được, nên quay về <strong>cuối hàng đợi sẵn sàng</strong> (chuyển trạng thái số 2 trong sơ đồ ba trạng thái). Cùng câu ở FE3#6, FE11#10, FE14#10, khoá A.</p>
<ul><li>B — bị chặn là chờ một sự kiện (I/O); ở đây không xin gì cả. C, D — trạng thái "suspended" thuộc mô hình có swap, không phải ba trạng thái của sách.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 62; sơ đồ trạng thái ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 7.</p>
<h3>Câu 7 · chỉ có trong đề gốc — song song nhưng lời gọi chặn</h3>
<p>🇬🇧 <em>Which programming model supports parallel execution but may involve blocking system calls during execution?</em><br>A. Single-threaded process · B. Finite-state machine · C. Threads · D. None of the above</p>
<p>🇻🇳 Mô hình lập trình nào chạy song song được nhưng có thể dùng lời gọi hệ thống chặn (blocking)? A. Tiến trình một luồng · B. Máy trạng thái hữu hạn · C. Luồng · D. Không cái nào.</p>
<p>📚 <strong>parallel execution</strong> = thực thi song song · <strong>blocking system call</strong> = lời gọi hệ thống làm người gọi phải chờ · <strong>finite-state machine</strong> = máy trạng thái hữu hạn.</p>
<p class="dap-an">✅ <strong>C.</strong> Hình 2-10 của sách so ba cách dựng server: luồng = song song + lời gọi chặn; tiến trình một luồng = không song song + lời gọi chặn; máy trạng thái hữu hạn = song song + lời gọi <em>không chặn</em> và ngắt. Cùng câu ở FE3#7, khoá C.</p>
<ul><li>A — có chặn nhưng không song song. B — song song nhưng không chặn. D — C đúng.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 16.</p>
<h3>Câu 8 · chỉ có trong đề gốc — vùng găng</h3>
<p>🇬🇧 <em>What defines a critical section in the context of the Windows operating system?</em><br>A. It is a section of code where the processor gives priority to execute multiple threads simultaneously. · B. It is a section of code where hardware interrupts are disabled to ensure uninterrupted execution. · C. It is a segment of code that only one thread can execute at a time to avoid data inconsistency or conflicts. · D. It is a part of the kernel where system-level processes are given higher priority over user-level processes.</p>
<p>🇻🇳 Trong Windows, vùng găng (critical section) được định nghĩa thế nào? A. Đoạn mã CPU ưu tiên chạy nhiều luồng cùng lúc. · B. Đoạn mã tắt ngắt phần cứng để chạy liền mạch. · C. Đoạn mã mà mỗi lúc chỉ một luồng được chạy, để tránh dữ liệu không nhất quán hay xung đột. · D. Một phần của nhân nơi tiến trình hệ thống được ưu tiên hơn tiến trình người dùng.</p>
<p>📚 <strong>critical section / region</strong> = vùng găng · <strong>data inconsistency</strong> = dữ liệu không nhất quán.</p>
<p class="dap-an">✅ <strong>C.</strong> Vùng găng là phần chương trình đụng vào dữ liệu dùng chung; loại trừ lẫn nhau chỉ cho một luồng vào mỗi lúc. Windows còn đặt đúng tên này cho khoá ở user mode: <code>CRITICAL_SECTION</code>. Cùng câu ở FE6#12, FE8#11, FE14#14, FE15#14, khoá C.</p>
<ul><li>A — ngược hẳn với loại trừ. B — tắt ngắt là một cách (dở) để <em>cài đặt</em> loại trừ trên một CPU, không phải định nghĩa. D — đó là ưu tiên, không phải vùng găng.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-2">2.B</a>, slide 29–30; khoá của Windows ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg11-2">11.B</a>.</p>
<h3>Câu 9 · chỉ có trong đề gốc — có bao nhiêu lịch (câu tính)</h3>
<p>🇬🇧 <em>A CPU-scheduling algorithm determines an order for the execution of its scheduled processes. Given n processes to be scheduled on one processor, how many different schedules are possible?</em><br>A. n! · B. 2*n · C. log2n · D. n</p>
<p>🇻🇳 Thuật toán lập lịch CPU quyết định thứ tự chạy các tiến trình. Có n tiến trình cần lập lịch trên một bộ xử lý thì có bao nhiêu lịch khác nhau?</p>
<p>📚 <strong>schedule</strong> = lịch (một thứ tự chạy) · <strong>n!</strong> = n giai thừa = n × (n − 1) × … × 1.</p>
<p>Không đề nào trong ngân hàng có câu này kèm khoá, nên ta đếm: chương trình liệt kê mọi thứ tự của n tiến trình rồi đếm.</p>
<pre><code class="language-javascript">// Có bao nhiêu lịch khác nhau cho n tiến trình trên một CPU? Liệt kê hết rồi đếm
function orders(items) {
  if (items.length &lt;= 1) return [items];
  return items.flatMap((x, i) =&gt; orders([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) =&gt; [x, ...rest]));
}
const fact = (n) =&gt; (n &lt;= 1 ? 1 : n * fact(n - 1));
for (let n = 1; n &lt;= 6; n++) {
  const all = orders(Array.from({ length: n }, (_, i) =&gt; &#96;P&#36;{i + 1}&#96;));
  const sample = n &lt;= 3 ? '  ' + all.map((o) =&gt; o.join('')).join(' ') : '';
  console.log(&#96;n = &#36;{n}: &#36;{String(all.length).padStart(3)} schedules  n! = &#36;{String(fact(n)).padStart(3)}  2*n = &#36;{String(2 * n).padStart(2)}  log2 n = &#36;{Math.log2(n).toFixed(2)}&#36;{sample}&#96;);
}</code></pre>
<div class="out">$ node so-lich.js<br>
n = 1: &nbsp;&nbsp;1 schedules &nbsp;n! = &nbsp;&nbsp;1 &nbsp;2*n = &nbsp;2 &nbsp;log2 n = 0.00 &nbsp;P1<br>
n = 2: &nbsp;&nbsp;2 schedules &nbsp;n! = &nbsp;&nbsp;2 &nbsp;2*n = &nbsp;4 &nbsp;log2 n = 1.00 &nbsp;P1P2 P2P1<br>
n = 3: &nbsp;&nbsp;6 schedules &nbsp;n! = &nbsp;&nbsp;6 &nbsp;2*n = &nbsp;6 &nbsp;log2 n = 1.58 &nbsp;P1P2P3 P1P3P2 P2P1P3 P2P3P1 P3P1P2 P3P2P1<br>
n = 4: &nbsp;24 schedules &nbsp;n! = &nbsp;24 &nbsp;2*n = &nbsp;8 &nbsp;log2 n = 2.00<br>
n = 5: 120 schedules &nbsp;n! = 120 &nbsp;2*n = 10 &nbsp;log2 n = 2.32<br>
n = 6: 720 schedules &nbsp;n! = 720 &nbsp;2*n = 12 &nbsp;log2 n = 2.58</div>
<p class="dap-an">✅ <strong>A — n!</strong> Vị trí đầu có n lựa chọn, vị trí hai còn n − 1, … ⇒ n × (n − 1) × … × 1.</p>
<ul><li>B, C, D — tăng quá chậm. Để ý bẫy trong output: với n = 3 thì 2*n = 6 = 3! — thử nhanh bằng ba tiến trình không phân biệt được A với B; hãy thử n = 4 (24 so với 8).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 56–59.</p>
<h3>Câu 10 · chỉ có trong đề gốc — bữa tối của các triết gia</h3>
<p>🇬🇧 <em>In the Dining Philosophers problem, what do the philosophers represent?</em><br>A. Real-world philosophers dining in a restaurant. · B. Concurrent processes that compete for access to shared resources. · C. Philosophical concepts unrelated to computing. · D. A form of computer virus.</p>
<p>🇻🇳 Trong bài toán Bữa tối của các triết gia, các triết gia đại diện cho gì? A. Triết gia thật ăn tối ở nhà hàng. · B. Các tiến trình đồng thời tranh nhau tài nguyên dùng chung. · C. Khái niệm triết học không liên quan máy tính. · D. Một loại virus.</p>
<p>📚 <strong>concurrent</strong> = đồng thời · <strong>compete for</strong> = tranh nhau.</p>
<p class="dap-an">✅ <strong>B.</strong> Bài toán Dijkstra nêu năm 1965 mô hình hoá các tiến trình tranh một tập tài nguyên có hạn (những chiếc nĩa). Cùng câu ở FE4#13, FE7#16, FE12#14, FE13#14, khoá B.</p>
<ul><li>A, C, D — hiểu theo nghĩa đen hoặc không liên quan.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 67–71.</p>
<h3>Câu 28 · Phòng thi #8 — nặng tính toán và nặng I/O</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q28.png" alt="Ảnh đề gốc câu 28" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which statement is true about the classification of a process based on its behavior?</em><br>A. A compute-bound process spent most of its time computing · B. A compute-bound process spent most of its time on IO processing · C. An I/O-bound process spent most of its time computing · D. A compute-bound process sometimes spent most of its time for IO waiting</p>
<p>🇻🇳 Phát biểu nào đúng về phân loại tiến trình theo hành vi? A. Tiến trình nặng tính toán dành phần lớn thời gian để tính. · B. … dành phần lớn thời gian cho I/O. · C. Tiến trình nặng I/O dành phần lớn thời gian để tính. · D. Tiến trình nặng tính toán đôi khi dành phần lớn thời gian chờ I/O.</p>
<p>📚 <strong>compute-bound (CPU-bound)</strong> = nặng tính toán · <strong>I/O-bound</strong> = nặng vào/ra · <strong>behavior</strong> = hành vi.</p>
<p class="dap-an">✅ <strong>A.</strong> Nặng tính toán: các đợt dùng CPU dài, ít I/O. Nặng I/O: đợt CPU ngắn, chờ thường xuyên.</p>
<ul><li>B, C đảo ngược hai định nghĩa. D mâu thuẫn với chữ "compute-bound".</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 56.</p>
<h3>Câu 42 · Phòng thi #22 — mức đa chương</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q42.png" alt="Ảnh đề gốc câu 42" loading="lazy" /></p></details>
<p>🇬🇧 <em>In a multiprogramming environment, if the degree of multiprogramming is increased, what will happen to CPU utilization in general?</em><br>A. Decrease first, then increase · B. Increase first, then decrease · C. Always decrease · D. Always increase · E. Remain constant</p>
<p>🇻🇳 Trong môi trường đa chương, nếu tăng mức đa chương (số tiến trình trong bộ nhớ) thì hiệu suất CPU nói chung sẽ thế nào? A. Giảm rồi tăng · B. Tăng rồi giảm · C. Luôn giảm · D. Luôn tăng · E. Không đổi.</p>
<p>📚 <strong>degree of multiprogramming</strong> = mức đa chương · <strong>CPU utilization</strong> = hiệu suất sử dụng CPU.</p>
<p class="dap-an">✅ <strong>B.</strong> Thêm tiến trình ⇒ CPU dễ tìm được việc hơn (1 − pⁿ tăng). Quá một ngưỡng thì các tiến trình không còn vừa RAM, lỗi trang bùng nổ, CPU ngồi chờ đĩa — <strong>thrashing</strong> — nên hiệu suất giảm.</p>
<ul><li>D là bẫy: đó là điều riêng công thức 1 − pⁿ nói, nhưng công thức giả định mọi thứ vừa bộ nhớ. A, C, E — không mô hình nào cho hình dạng đó.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 12 (đường cong) và <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slide 30–31 (thrashing).</p>`),
    bi(`<h2>Chapter 3 — Memory management (11 questions)</h2>
<h3>Q3 · original paper only — UNIX page replacement</h3>
<p><em>Which algorithm is used in UNIX for handling page replacement?</em><br>A. FIFO · B. LRU (Least Recently Used) · C. Optimal · D. Clock</p>
<p class="dap-an">✅ <strong>D — Clock</strong> (no paper of the bank has this question with a key; the answer follows the book). Real kernels cannot afford exact LRU (it needs a time stamp on every memory access), so BSD UNIX runs a <em>two-handed clock</em>, and Linux's page frame reclaiming algorithm is a clock-like approximation of LRU with active and inactive lists.</p>
<ul><li>A — plain FIFO throws out heavily used pages. B — exact LRU is the ideal clock approximates, not what is implemented. C — Optimal needs the future; it is only a yardstick.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 22–24, 29; Linux in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg10-2">10.B</a>.</p>
<h3>Q11 · original paper only — smaller pages (computed)</h3>
<p><em>With demand paging, what increases when page size is reduced?</em><br>A. Page fault rate · B. Internal fragmentation · C. External fragmentation · D. Hit ratio · E. None</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f5cae2052ab23dc0804a251ee70b4309422a7d2c.svg" alt="The same program, the same 32 KB of RAM, five page sizes: faults go up as pages shrink, the wasted tail goes down" loading="lazy" /><p class="chu-thich">🧮 The same program, the same 32 KB of RAM, five page sizes: faults go up as pages shrink, the wasted tail goes down</p></div>
<table>
<thead><tr><th>Page size</th><th>Page faults</th><th>Average waste in the last page (programs 10 000–29 999 B)</th></tr></thead>
<tbody>
<tr><td>512 B</td><td>192</td><td>255.5 B</td></tr>
<tr><td>1024 B</td><td>96</td><td>512.2 B</td></tr>
<tr><td>2048 B</td><td>48</td><td>1036.5 B</td></tr>
<tr><td>4096 B</td><td>24</td><td>2036 B</td></tr>
<tr><td>8192 B</td><td>12</td><td>4182.5 B</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<p class="dap-an">✅ <strong>A — page fault rate</strong> (no key in the bank; answer from the book and the simulation). Each fault brings in less data, so a program needs more faults to touch the same bytes; the page table also grows.</p>
<ul><li>B — internal fragmentation (the unused tail of the last page) <em>shrinks</em> with small pages — that is their advantage. C — paging has no external fragmentation at all. D — the hit ratio (TLB or page) falls, it does not rise. E — A is correct.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a> (paging design issues) — page size is a ➕ part of §3.5.3 of the book.</p>
<h3>Q12 · original paper only — clock versus second chance</h3>
<p><em>What is the main advantage of using the Clock Algorithm over the Second Chance Algorithm in terms of page replacement efficiency?</em><br>A. The Clock algorithm eliminates the need to move pages around, reducing overhead. · B. The Clock algorithm increases the complexity of implementation. · C. The Clock algorithm guarantees fewer page faults compared to Second Chance algorithm. · D. The Clock algorithm uses more memory to maintain the circular structure.</p>
<p class="dap-an">✅ <strong>A.</strong> Both make the same choice; second chance moves a page with R = 1 to the tail of a linked list, the clock just advances a hand over a circular list. Same decisions, less work. Same question in FE2#17, FE6#19, FE10#27, FE11#22, key A.</p>
<ul><li>B, D — disadvantages, not advantages (and false). C — identical choices ⇒ identical fault counts.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 22–23.</p>
<h3>Q13 · original paper only — virtual address spaces</h3>
<p><em>Which of the following is true about virtual address spaces?</em><br>A. They are the same as physical address spaces. · B. They allow multiple processes to run in the same memory area. · C. They provide isolation between processes. · D. They are managed by hardware only, without the operating system's involvement.</p>
<p class="dap-an">✅ <strong>C</strong> (no key in the bank; answer from the book). Each process gets its own address space; the same virtual address in two processes maps to different frames, so one cannot touch the other's memory.</p>
<ul><li>A — the whole point is that they differ. B — two processes may use the same <em>virtual</em> addresses, but never the same physical memory area unless they share on purpose. D — the MMU translates, but the OS builds and changes the page tables.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 4–5, 11.</p>
<h3>Q14 · original paper only — the MMU</h3>
<p><em>What is the role of the Memory Management Unit (MMU) in a computer system?</em><br>A. The MMU translates virtual addresses into physical addresses · B. It controls the allocation of memory to different processes. · C. It manages the paging and swapping of memory pages. · D. It is a data structure used in computer operating systems for virtual memory management</p>
<p class="dap-an">✅ <strong>A.</strong> The MMU is the hardware between the CPU and the memory bus that maps every virtual address to a physical one. Same question in FE2#14, FE6#14, FE7#17, FE11#15, key A.</p>
<ul><li>B, C — that is the OS's memory manager (software). D — it is hardware, not a data structure (the page table is the data structure).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 12.</p>
<h3>Q15 · original paper only — base and limit registers (computed)</h3>
<p><em>Given a memory system using Base and Limit Registers, where three programs P1, P2, and P3 are loaded with sizes 8KB, 4KB, and 16KB respectively, what are the values of the Base and Limit Registers for program P3?</em><br>A. Base: 8KB, Limit: 24KB · B. Base: 8KB, Limit: 28KB · C. Base: 12KB, Limit: 16KB · D. Base: 12KB, Limit: 28KB</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/332e9c99e2a85bace498acaa5cdb6714ec7f7864.svg" alt="P1, P2, P3 loaded back to back from address 0" loading="lazy" /><p class="chu-thich">🧮 P1, P2, P3 loaded back to back from address 0</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<p class="dap-an">✅ <strong>C.</strong> Base = where P3 starts = 8 + 4 = 12 KB; limit = its length = 16 KB. Same question in FE6#15, key C.</p>
<ul><li>A, B — 8 KB is where P2 starts. D — 28 KB is the end address; in the book the limit register holds the program's length.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 5.</p>
<h3>Q16 · original paper only — not a virtual-memory technique</h3>
<p><em>What technique is not used in the implementation of Virtual Memory?</em><br>A. Paging · B. Mapping · C. Segmentation · D. Partition</p>
<p class="dap-an">✅ <strong>D — partition.</strong> Fixed or variable partitions are the older scheme <em>without</em> virtual memory (a program must fit in one partition). Same question in FE13#17, FE15#22, key D.</p>
<ul><li>A, C — the two ways to build virtual memory. B — mapping virtual to physical is what it does.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 6–12.</p>
<h3>Q17 · original paper only — FIFO with four frames (computed)</h3>
<p><em>If FIFO page replacement algorithm is used with four page frames, how many page faults will occur with the reference string 0172327103 if the four frames are initially empty?</em><br>A. 4 Pages · B. 5 Pages · C. 6 Pages · D. 7 Pages</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/18c69d8258a561723bc1b4c45c2e541811fd067a.svg" alt="FIFO, four frames, 0 1 7 2 3 2 7 1 0 3" loading="lazy" /><p class="chu-thich">🧮 FIFO, four frames, 0 1 7 2 3 2 7 1 0 3</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<p class="dap-an">✅ <strong>C — 6.</strong> Four cold faults (0, 1, 7, 2), then 3 evicts 0, then 0 evicts 1. Same question in FE3#17, FE7#22, FE11#20, FE14#26, key C.</p>
<ul><li>A — forgets the two replacements. B, D — off by one: count the F row, do not estimate.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 20.</p>
<h3>Q18 · original paper only — what makes translation fast</h3>
<p><em>When designing a paging system, which of the following factors is the most critical in minimizing translation overhead?</em><br>A. Increasing the number of page table entries per process. · B. Using a Translation Lookaside Buffer (TLB) for faster lookups. · C. Storing page tables in slower secondary storage. · D. Assigning fixed-size page frames without considering process needs.</p>
<p class="dap-an">✅ <strong>B.</strong> Without a TLB every memory reference costs at least one extra reference to the page table; the TLB caches recent translations and hits most of the time. Same question in FE3#18, key B.</p>
<ul><li>A — more entries make tables bigger, not faster. C — slower storage makes it worse. D — unrelated to translation speed.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 16–17.</p>
<h3>Q19 · original paper only — while the page is loading</h3>
<p><em>What happens when the required page is being loaded from disk after a page fault?</em><br>A. Another user process may be scheduled to run · B. The CPU enters halt mode · C. The faulting process is permanently blocked · D. The system waits in a loop for disk I/O to complete</p>
<p class="dap-an">✅ <strong>A</strong> (no key in the bank; answer from the book's page-fault steps). The disk takes milliseconds, so the faulting process is suspended and the scheduler runs another process; the disk interrupt later marks the page present and the faulting instruction is restarted.</p>
<ul><li>B, D — wasting milliseconds of CPU on purpose. C — the block is temporary, not permanent.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slides 35–37.</p>
<h3>Q46 · Exam Room #26 — NOT a benefit of segmentation</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q46.png" alt="Original question 46" loading="lazy" /></p></details>
<p><em>Which of the following is not a benefit of segmentation in memory management?</em><br>A. Segments grow independently without collision · B. Programmers no longer manage memory overlays manually · C. Segments can be loaded into non-contiguous physical memory · D. Segment addresses automatically optimize CPU scheduling</p>
<p class="dap-an">✅ <strong>D.</strong> Note the <strong>not</strong>: three options are real benefits, one is not. Segmentation is about memory; it has nothing to do with CPU scheduling.</p>
<ul><li>A — the book's main argument (stack, symbol table… each grows on its own). B — virtual memory as a whole removed manual overlays. C — each segment can sit anywhere in RAM.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slides 42–45.</p>`,
    `<h2>Chương 3 — Quản lý bộ nhớ (11 câu)</h2>
<h3>Câu 3 · chỉ có trong đề gốc — UNIX thay trang bằng gì</h3>
<p>🇬🇧 <em>Which algorithm is used in UNIX for handling page replacement?</em><br>A. FIFO · B. LRU (Least Recently Used) · C. Optimal · D. Clock</p>
<p>🇻🇳 UNIX dùng thuật toán nào để thay trang? A. FIFO · B. LRU (lâu nhất chưa dùng) · C. Tối ưu · D. Đồng hồ (Clock).</p>
<p>📚 <strong>page replacement</strong> = thay trang (chọn trang bị đẩy ra khi bộ nhớ đầy).</p>
<p class="dap-an">✅ <strong>D — Clock</strong> (không đề nào trong ngân hàng có câu này kèm khoá; đáp án theo sách). Nhân thật không kham nổi LRU chính xác (phải ghi dấu thời gian ở MỌI lần truy cập bộ nhớ), nên BSD UNIX chạy <em>đồng hồ hai kim</em>, còn thuật toán thu hồi khung trang của Linux là một biến thể kiểu đồng hồ xấp xỉ LRU với hai danh sách active/inactive.</p>
<ul><li>A — FIFO trần đẩy cả trang đang dùng nhiều. B — LRU chính xác là lý tưởng mà đồng hồ xấp xỉ, không phải thứ được cài. C — Optimal cần biết tương lai; chỉ dùng làm thước đo.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 22–24, 29; Linux ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg10-2">10.B</a>.</p>
<h3>Câu 11 · chỉ có trong đề gốc — trang nhỏ đi (câu tính)</h3>
<p>🇬🇧 <em>With demand paging, what increases when page size is reduced?</em><br>A. Page fault rate · B. Internal fragmentation · C. External fragmentation · D. Hit ratio · E. None</p>
<p>🇻🇳 Với phân trang theo yêu cầu, khi giảm cỡ trang thì đại lượng nào tăng? A. Tỉ lệ lỗi trang · B. Phân mảnh trong · C. Phân mảnh ngoài · D. Tỉ lệ trúng · E. Không cái nào.</p>
<p>📚 <strong>demand paging</strong> = phân trang theo yêu cầu (chỉ nạp trang khi bị chạm tới) · <strong>internal / external fragmentation</strong> = phân mảnh trong / ngoài · <strong>hit ratio</strong> = tỉ lệ trúng.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4d6df20da6b18e2e0c3eb2494b31e4346da45d84.svg" alt="Cùng chương trình, cùng 32 KB RAM, năm cỡ trang: lỗi trang tăng khi trang nhỏ đi, phần thừa ở trang cuối thì giảm" loading="lazy" /><p class="chu-thich">🧮 Cùng chương trình, cùng 32 KB RAM, năm cỡ trang: lỗi trang tăng khi trang nhỏ đi, phần thừa ở trang cuối thì giảm</p></div>
<table>
<thead><tr><th>Cỡ trang</th><th>Số lỗi trang</th><th>Phần thừa TB ở trang cuối (chương trình 10 000–29 999 B)</th></tr></thead>
<tbody>
<tr><td>512 B</td><td>192</td><td>255.5 B</td></tr>
<tr><td>1024 B</td><td>96</td><td>512.2 B</td></tr>
<tr><td>2048 B</td><td>48</td><td>1036.5 B</td></tr>
<tr><td>4096 B</td><td>24</td><td>2036 B</td></tr>
<tr><td>8192 B</td><td>12</td><td>4182.5 B</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<p class="dap-an">✅ <strong>A — tỉ lệ lỗi trang</strong> (ngân hàng không có khoá; đáp án theo sách và mô phỏng). Mỗi lần lỗi chỉ nạp được ít dữ liệu hơn, nên chương trình cần nhiều lần lỗi hơn để chạm cùng số byte; bảng trang cũng phình ra.</p>
<ul><li>B — phân mảnh trong (phần thừa cuối trang cuối) <em>giảm</em> khi trang nhỏ — đó là ưu điểm của trang nhỏ. C — phân trang hoàn toàn không có phân mảnh ngoài. D — tỉ lệ trúng (TLB hay trang) giảm chứ không tăng. E — A đúng.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a> (các vấn đề thiết kế phân trang) — cỡ trang là phần ➕ của §3.5.3 trong sách.</p>
<h3>Câu 12 · chỉ có trong đề gốc — đồng hồ so với cơ hội thứ hai</h3>
<p>🇬🇧 <em>What is the main advantage of using the Clock Algorithm over the Second Chance Algorithm in terms of page replacement efficiency?</em><br>A. The Clock algorithm eliminates the need to move pages around, reducing overhead. · B. The Clock algorithm increases the complexity of implementation. · C. The Clock algorithm guarantees fewer page faults compared to Second Chance algorithm. · D. The Clock algorithm uses more memory to maintain the circular structure.</p>
<p>🇻🇳 Ưu điểm chính của thuật toán Đồng hồ so với Cơ hội thứ hai về hiệu quả thay trang là gì? A. Không phải di chuyển trang qua lại, giảm chi phí phụ. · B. Tăng độ phức tạp cài đặt. · C. Chắc chắn ít lỗi trang hơn. · D. Tốn thêm bộ nhớ cho cấu trúc vòng.</p>
<p>📚 <strong>second chance</strong> = cơ hội thứ hai · <strong>overhead</strong> = chi phí phụ · <strong>circular</strong> = vòng tròn.</p>
<p class="dap-an">✅ <strong>A.</strong> Hai thuật toán chọn y hệt nhau; cơ hội thứ hai chuyển trang có R = 1 xuống cuối danh sách liên kết, còn đồng hồ chỉ đẩy kim trên danh sách vòng. Cùng quyết định, ít việc hơn. Cùng câu ở FE2#17, FE6#19, FE10#27, FE11#22, khoá A.</p>
<ul><li>B, D — là nhược điểm, không phải ưu điểm (và cũng sai). C — chọn giống hệt ⇒ số lỗi trang giống hệt.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 22–23.</p>
<h3>Câu 13 · chỉ có trong đề gốc — không gian địa chỉ ảo</h3>
<p>🇬🇧 <em>Which of the following is true about virtual address spaces?</em><br>A. They are the same as physical address spaces. · B. They allow multiple processes to run in the same memory area. · C. They provide isolation between processes. · D. They are managed by hardware only, without the operating system's involvement.</p>
<p>🇻🇳 Phát biểu nào đúng về không gian địa chỉ ảo? A. Giống không gian địa chỉ vật lý. · B. Cho nhiều tiến trình chạy trên cùng một vùng nhớ. · C. Cô lập các tiến trình với nhau. · D. Chỉ phần cứng quản lý, không cần HĐH.</p>
<p>📚 <strong>address space</strong> = không gian địa chỉ · <strong>isolation</strong> = sự cô lập.</p>
<p class="dap-an">✅ <strong>C</strong> (ngân hàng không có khoá; đáp án theo sách). Mỗi tiến trình có không gian địa chỉ riêng; cùng một địa chỉ ảo ở hai tiến trình ánh xạ tới hai khung khác nhau, nên tiến trình này không đụng được bộ nhớ của tiến trình kia.</p>
<ul><li>A — điểm mấu chốt chính là chúng khác nhau. B — hai tiến trình có thể dùng cùng địa chỉ <em>ảo</em>, nhưng không bao giờ cùng vùng nhớ vật lý trừ khi cố ý chia sẻ. D — MMU dịch địa chỉ, nhưng HĐH dựng và sửa bảng trang.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 4–5, 11.</p>
<h3>Câu 14 · chỉ có trong đề gốc — MMU</h3>
<p>🇬🇧 <em>What is the role of the Memory Management Unit (MMU) in a computer system?</em><br>A. The MMU translates virtual addresses into physical addresses · B. It controls the allocation of memory to different processes. · C. It manages the paging and swapping of memory pages. · D. It is a data structure used in computer operating systems for virtual memory management</p>
<p>🇻🇳 Vai trò của khối quản lý bộ nhớ (MMU) là gì? A. Dịch địa chỉ ảo sang địa chỉ vật lý · B. Điều khiển việc cấp phát bộ nhớ cho các tiến trình · C. Quản lý phân trang và hoán đổi trang · D. Là một cấu trúc dữ liệu của HĐH để quản lý bộ nhớ ảo.</p>
<p>📚 <strong>translate</strong> = dịch (địa chỉ) · <strong>swapping</strong> = hoán đổi ra/vào đĩa.</p>
<p class="dap-an">✅ <strong>A.</strong> MMU là phần cứng nằm giữa CPU và bus bộ nhớ, ánh xạ mọi địa chỉ ảo sang địa chỉ vật lý. Cùng câu ở FE2#14, FE6#14, FE7#17, FE11#15, khoá A.</p>
<ul><li>B, C — là việc của bộ quản lý bộ nhớ trong HĐH (phần mềm). D — MMU là phần cứng, không phải cấu trúc dữ liệu (bảng trang mới là cấu trúc dữ liệu).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 12.</p>
<h3>Câu 15 · chỉ có trong đề gốc — thanh ghi base và limit (câu tính)</h3>
<p>🇬🇧 <em>Given a memory system using Base and Limit Registers, where three programs P1, P2, and P3 are loaded with sizes 8KB, 4KB, and 16KB respectively, what are the values of the Base and Limit Registers for program P3?</em><br>A. Base: 8KB, Limit: 24KB · B. Base: 8KB, Limit: 28KB · C. Base: 12KB, Limit: 16KB · D. Base: 12KB, Limit: 28KB</p>
<p>🇻🇳 Bộ nhớ dùng thanh ghi cơ sở (base) và giới hạn (limit); ba chương trình P1, P2, P3 lần lượt cỡ 8 KB, 4 KB, 16 KB được nạp vào. Base và limit của P3 là bao nhiêu?</p>
<p>📚 <strong>base register</strong> = thanh ghi cơ sở (địa chỉ bắt đầu) · <strong>limit register</strong> = thanh ghi giới hạn (độ dài) · <strong>respectively</strong> = lần lượt.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a5781a60d8eef1b2cab34f4c8eb0ef0351f61b67.svg" alt="P1, P2, P3 nạp liền nhau từ địa chỉ 0" loading="lazy" /><p class="chu-thich">🧮 P1, P2, P3 nạp liền nhau từ địa chỉ 0</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<p class="dap-an">✅ <strong>C.</strong> Base = chỗ P3 bắt đầu = 8 + 4 = 12 KB; limit = độ dài của nó = 16 KB. Cùng câu ở FE6#15, khoá C.</p>
<ul><li>A, B — 8 KB là chỗ P2 bắt đầu. D — 28 KB là địa chỉ cuối; trong sách thanh ghi limit chứa độ dài chương trình.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 5.</p>
<h3>Câu 16 · chỉ có trong đề gốc — kỹ thuật KHÔNG dùng cho bộ nhớ ảo</h3>
<p>🇬🇧 <em>What technique is not used in the implementation of Virtual Memory?</em><br>A. Paging · B. Mapping · C. Segmentation · D. Partition</p>
<p>🇻🇳 Kỹ thuật nào KHÔNG được dùng để cài đặt bộ nhớ ảo? A. Phân trang · B. Ánh xạ · C. Phân đoạn · D. Phân vùng.</p>
<p>📚 <strong>partition</strong> = phân vùng (chia bộ nhớ thành các vùng cố định) · <strong>mapping</strong> = ánh xạ.</p>
<p class="dap-an">✅ <strong>D — phân vùng.</strong> Phân vùng cố định hay thay đổi là kiểu cũ KHÔNG có bộ nhớ ảo (chương trình phải vừa trọn một vùng). Cùng câu ở FE13#17, FE15#22, khoá D.</p>
<ul><li>A, C — hai cách dựng bộ nhớ ảo. B — ánh xạ ảo → vật lý chính là việc của nó.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 6–12.</p>
<h3>Câu 17 · chỉ có trong đề gốc — FIFO bốn khung (câu tính)</h3>
<p>🇬🇧 <em>If FIFO page replacement algorithm is used with four page frames, how many page faults will occur with the reference string 0172327103 if the four frames are initially empty?</em><br>A. 4 Pages · B. 5 Pages · C. 6 Pages · D. 7 Pages</p>
<p>🇻🇳 Dùng thay trang FIFO với bốn khung, chuỗi tham chiếu 0172327103, các khung ban đầu rỗng — có bao nhiêu lỗi trang?</p>
<p>📚 <strong>reference string</strong> = chuỗi tham chiếu · <strong>initially empty</strong> = ban đầu rỗng (lần nạp đầu cũng tính lỗi).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fa6bc4c3f61e1fb0a7a80e79f49454f3e657a365.svg" alt="FIFO, bốn khung, 0 1 7 2 3 2 7 1 0 3" loading="lazy" /><p class="chu-thich">🧮 FIFO, bốn khung, 0 1 7 2 3 2 7 1 0 3</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<p class="dap-an">✅ <strong>C — 6.</strong> Bốn lỗi nạp đầu (0, 1, 7, 2), rồi 3 đẩy 0 ra, rồi 0 đẩy 1 ra. Cùng câu ở FE3#17, FE7#22, FE11#20, FE14#26, khoá C.</p>
<ul><li>A — quên hai lần thay. B, D — lệch một: đếm hàng F, đừng ước lượng.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 20.</p>
<h3>Câu 18 · chỉ có trong đề gốc — điều gì làm dịch địa chỉ nhanh</h3>
<p>🇬🇧 <em>When designing a paging system, which of the following factors is the most critical in minimizing translation overhead?</em><br>A. Increasing the number of page table entries per process. · B. Using a Translation Lookaside Buffer (TLB) for faster lookups. · C. Storing page tables in slower secondary storage. · D. Assigning fixed-size page frames without considering process needs.</p>
<p>🇻🇳 Khi thiết kế hệ thống phân trang, yếu tố nào quan trọng nhất để giảm chi phí dịch địa chỉ? A. Tăng số mục bảng trang mỗi tiến trình · B. Dùng TLB để tra nhanh · C. Để bảng trang ở bộ nhớ phụ chậm hơn · D. Cấp khung cỡ cố định bất kể nhu cầu tiến trình.</p>
<p>📚 <strong>translation overhead</strong> = chi phí phụ của việc dịch địa chỉ · <strong>lookup</strong> = tra cứu · <strong>secondary storage</strong> = bộ nhớ phụ (đĩa).</p>
<p class="dap-an">✅ <strong>B.</strong> Không có TLB thì mỗi lần truy cập bộ nhớ tốn ít nhất một lần truy cập thêm vào bảng trang; TLB giữ các bản dịch gần đây và trúng phần lớn thời gian. Cùng câu ở FE3#18, khoá B.</p>
<ul><li>A — nhiều mục hơn làm bảng to hơn, không nhanh hơn. C — chỗ chậm hơn chỉ tệ hơn. D — không liên quan tốc độ dịch.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 16–17.</p>
<h3>Câu 19 · chỉ có trong đề gốc — trong lúc nạp trang</h3>
<p>🇬🇧 <em>What happens when the required page is being loaded from disk after a page fault?</em><br>A. Another user process may be scheduled to run · B. The CPU enters halt mode · C. The faulting process is permanently blocked · D. The system waits in a loop for disk I/O to complete</p>
<p>🇻🇳 Khi trang cần dùng đang được nạp từ đĩa sau một lỗi trang thì điều gì xảy ra? A. Một tiến trình người dùng khác có thể được cho chạy · B. CPU vào chế độ dừng · C. Tiến trình gây lỗi bị chặn vĩnh viễn · D. Hệ thống quay vòng chờ đĩa xong.</p>
<p>📚 <strong>faulting process</strong> = tiến trình gây lỗi trang · <strong>halt</strong> = dừng · <strong>permanently</strong> = vĩnh viễn.</p>
<p class="dap-an">✅ <strong>A</strong> (ngân hàng không có khoá; đáp án theo các bước xử lý lỗi trang của sách). Đĩa mất cỡ mili giây, nên tiến trình gây lỗi bị tạm dừng và bộ lập lịch cho tiến trình khác chạy; sau đó ngắt đĩa đánh dấu trang đã có mặt và lệnh gây lỗi được chạy lại.</p>
<ul><li>B, D — cố tình phí hàng mili giây CPU. C — bị chặn tạm thời, không phải vĩnh viễn.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slide 35–37.</p>
<h3>Câu 46 · Phòng thi #26 — KHÔNG phải lợi ích của phân đoạn</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q46.png" alt="Ảnh đề gốc câu 46" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which of the following is not a benefit of segmentation in memory management?</em><br>A. Segments grow independently without collision · B. Programmers no longer manage memory overlays manually · C. Segments can be loaded into non-contiguous physical memory · D. Segment addresses automatically optimize CPU scheduling</p>
<p>🇻🇳 Điều nào KHÔNG phải lợi ích của phân đoạn trong quản lý bộ nhớ? A. Các đoạn lớn lên độc lập, không đụng nhau · B. Lập trình viên không còn phải tự quản lý overlay · C. Các đoạn có thể nạp vào bộ nhớ vật lý không liên tục · D. Địa chỉ đoạn tự động tối ưu lập lịch CPU.</p>
<p>📚 <strong>segmentation</strong> = phân đoạn · <strong>overlay</strong> = kỹ thuật chia chương trình thành mảnh nạp lần lượt (thời trước bộ nhớ ảo) · <strong>collision</strong> = va chạm.</p>
<p class="dap-an">✅ <strong>D.</strong> Chú ý chữ <strong>not</strong>: ba phương án là lợi ích thật, một cái không. Phân đoạn là chuyện bộ nhớ; nó chẳng dính gì tới lập lịch CPU.</p>
<ul><li>A — lập luận chính của sách (ngăn xếp, bảng ký hiệu… mỗi thứ lớn lên riêng). B — bộ nhớ ảo nói chung đã xoá bỏ overlay làm tay. C — mỗi đoạn nằm đâu trong RAM cũng được.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slide 42–45.</p>`),
    bi(`<h2>Chapter 4 — File systems (7 questions)</h2>
<h3>Q20 · original paper only — the file system seen from outside</h3>
<p><em>What are the primary functions associated with a file system as viewed from an external perspective?</em><br>A. Reading and writing files, creating and destroying directories, moving files between directories. · B. Storing data in memory, allocating disk space, managing I-nodes. · C. Allocating blocks to files, managing file-allocation tables, and performing system backups. · D. Executing system calls, managing disk caches, and optimizing read-ahead operations.</p>
<p class="dap-an">✅ <strong>A</strong> (no key in the bank; answer from the book). Chapter 4 separates the <em>user's</em> view (files and directories and the operations on them) from the <em>implementer's</em> view (blocks, i-nodes, FAT, caches). "External perspective" = the user's view.</p>
<ul><li>B, C, D — all implementation details, the inside of the file system.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slides 2–4, 9, 16.</p>
<h3>Q21 · Exam Room #1 — extent-based allocation</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q21.png" alt="Original question 21" loading="lazy" /></p></details>
<p><em>In file allocation, which strategy uses both index blocks and contiguous portions?</em><br>A. Contiguous · B. Linked · C. Indexed · D. Multilevel index · E. Extent-based</p>
<p class="dap-an">✅ <strong>E.</strong> An extent is a run of contiguous blocks; the file keeps an index of its extents (start, length). NTFS calls them <em>runs</em>, ext4 <em>extents</em>.</p>
<ul><li>A — contiguous only, no index. B — a chain of pointers. C, D — an index of single blocks, no contiguous runs.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slides 18–21; NTFS runs in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg11-2">11.B</a>.</p>
<h3>Q22 · Exam Room #2 — a regular file</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q22.png" alt="Original question 22" loading="lazy" /></p></details>
<p><em>Which of the following best describes a regular file in UNIX or Windows systems?</em><br>A. A file that stores printer configuration data · B. A user-created file containing ASCII or binary data · C. A system-level directory used for I/O mapping · D. A file representing a disk partition or mount point</p>
<p class="dap-an">✅ <strong>B.</strong> Regular files hold user information, either ASCII text or binary. The other file types are directories and character/block special files.</p>
<ul><li>A — too narrow (one possible content). C — a directory is not a regular file. D — a disk is a <em>block special file</em>.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 7.</p>
<h3>Q23 · Exam Room #3 — the directory structure</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q23.png" alt="Original question 23" loading="lazy" /></p></details>
<p><em>Which directory structure would be the most efficient in preventing filename conflicts while allowing quick lookups?</em><br>A. Single-level directory · B. Two-level directory · C. Tree-structured directory · D. Graph-based directory with soft links</p>
<p class="dap-an">✅ <strong>C.</strong> A hierarchy gives every user and every project its own name space (no conflicts) and a path finds a file in a few steps.</p>
<ul><li>A — one name space for everybody: conflicts. B — one level per user only: conflicts inside a user. D — links add sharing, not speed, and cycles complicate traversal.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slides 13–15.</p>
<h3>Q24 · Exam Room #4 — a file of type LINK</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q24.png" alt="Original question 24" loading="lazy" /></p></details>
<p><em>In file sharing, B links to one of C's files by having the system create a new file, of type LINK, and entering that file in B's directory. The new file contains just the path name of the file to which it is linked. When B reads from the linked file, the operating system sees that the file being read from is of type LINK, looks up the name of the file, and reads that file. Which of the following is the correct about the type of file sharing described above?</em><br>A. Synchronous Linking · B. Symbolic Linking · C. Traditional (hard) Linking · D. Synthetic Linking</p>
<p class="dap-an">✅ <strong>B.</strong> A new file whose content is only a path name = symbolic link — the book's own sentence.</p>
<ul><li>C — a hard link is a second directory entry pointing to the same i-node; no new file is created. A, D — do not exist.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slides 24–25.</p>
<h3>Q25 · Exam Room #5 — defragmenting an SSD</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q25.png" alt="Original question 25" loading="lazy" /></p></details>
<p><em>Why is defragmenting a Solid-State Drive (SSD) generally not recommended?</em><br>A. SSDs store data without needing contiguous blocks · B. SSDs can fail when defragmented more than once · C. SSDs degrade faster with unnecessary write cycles · D. SSDs auto-defrag and ignore manual optimization</p>
<p class="dap-an">✅ <strong>C.</strong> Flash cells survive a limited number of writes; defragmenting rewrites a lot of data for no gain, because an SSD has no seek time.</p>
<ul><li>A is half true (contiguity does not help an SSD) but it explains why defragmenting is <em>useless</em>, not why it is <em>harmful</em>. B — invented. D — the drive's internal wear-levelling is not a defragmenter.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-2">4.B</a>, slides 38–40.</p>
<h3>Q26 · Exam Room #6 — ISO 9660 levels</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q26.png" alt="Original question 26" loading="lazy" /></p></details>
<p><em>Which ISO 9660 level allows a file to consist of several extents (i.e., noncontiguous segments) by partially relaxing the contiguous file requirement?</em><br>A. Level 1 · B. Level 2 · C. Level 3 · D. None of the above</p>
<p class="dap-an">✅ <strong>C.</strong> Level 1: 8 + 3 names, contiguous files. Level 2: names up to 31 characters. Level 3: a file may be made of several sections (extents).</p>
<ul><li>A, B — still require contiguous files. D — C is correct.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-2">4.B</a>, slide 46.</p>`,
    `<h2>Chương 4 — Hệ thống tệp (7 câu)</h2>
<h3>Câu 20 · chỉ có trong đề gốc — hệ thống tệp nhìn từ bên ngoài</h3>
<p>🇬🇧 <em>What are the primary functions associated with a file system as viewed from an external perspective?</em><br>A. Reading and writing files, creating and destroying directories, moving files between directories. · B. Storing data in memory, allocating disk space, managing I-nodes. · C. Allocating blocks to files, managing file-allocation tables, and performing system backups. · D. Executing system calls, managing disk caches, and optimizing read-ahead operations.</p>
<p>🇻🇳 Nhìn từ bên ngoài, các chức năng chính của hệ thống tệp là gì? A. Đọc ghi tệp, tạo và xoá thư mục, chuyển tệp giữa các thư mục. · B. Lưu dữ liệu trong bộ nhớ, cấp phát đĩa, quản lý i-node. · C. Cấp khối cho tệp, quản lý bảng FAT, sao lưu hệ thống. · D. Thực thi system call, quản lý cache đĩa, tối ưu đọc trước.</p>
<p>📚 <strong>external perspective</strong> = góc nhìn từ bên ngoài (của người dùng) · <strong>read-ahead</strong> = đọc trước.</p>
<p class="dap-an">✅ <strong>A</strong> (ngân hàng không có khoá; đáp án theo sách). Chương 4 tách góc nhìn của <em>người dùng</em> (tệp, thư mục và các thao tác trên chúng) khỏi góc nhìn của <em>người cài đặt</em> (khối, i-node, FAT, cache). "Từ bên ngoài" = góc nhìn người dùng.</p>
<ul><li>B, C, D — toàn chi tiết cài đặt, bên trong hệ thống tệp.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 2–4, 9, 16.</p>
<h3>Câu 21 · Phòng thi #1 — cấp phát theo extent</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q21.png" alt="Ảnh đề gốc câu 21" loading="lazy" /></p></details>
<p>🇬🇧 <em>In file allocation, which strategy uses both index blocks and contiguous portions?</em><br>A. Contiguous · B. Linked · C. Indexed · D. Multilevel index · E. Extent-based</p>
<p>🇻🇳 Trong cấp phát tệp, chiến lược nào dùng cả khối chỉ mục lẫn các đoạn liên tục? A. Liên tục · B. Liên kết · C. Chỉ mục · D. Chỉ mục nhiều mức · E. Theo extent.</p>
<p>📚 <strong>extent</strong> = một dải khối liên tục · <strong>index block</strong> = khối chỉ mục · <strong>contiguous portion</strong> = đoạn liên tục.</p>
<p class="dap-an">✅ <strong>E.</strong> Một extent là một dải khối liền nhau; tệp giữ một chỉ mục các extent của nó (vị trí đầu, độ dài). NTFS gọi là <em>run</em>, ext4 gọi là <em>extent</em>.</p>
<ul><li>A — chỉ liên tục, không có chỉ mục. B — chuỗi con trỏ. C, D — chỉ mục từng khối lẻ, không có dải liên tục.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 18–21; run của NTFS ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg11-2">11.B</a>.</p>
<h3>Câu 22 · Phòng thi #2 — tệp thường</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q22.png" alt="Ảnh đề gốc câu 22" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which of the following best describes a regular file in UNIX or Windows systems?</em><br>A. A file that stores printer configuration data · B. A user-created file containing ASCII or binary data · C. A system-level directory used for I/O mapping · D. A file representing a disk partition or mount point</p>
<p>🇻🇳 Phát biểu nào mô tả đúng nhất tệp thường (regular file) trong UNIX hay Windows? A. Tệp lưu cấu hình máy in · B. Tệp do người dùng tạo, chứa dữ liệu ASCII hoặc nhị phân · C. Thư mục hệ thống dùng ánh xạ I/O · D. Tệp đại diện cho một phân vùng đĩa hay điểm gắn kết.</p>
<p>📚 <strong>regular file</strong> = tệp thường · <strong>binary</strong> = nhị phân · <strong>mount point</strong> = điểm gắn kết.</p>
<p class="dap-an">✅ <strong>B.</strong> Tệp thường chứa thông tin của người dùng, dạng văn bản ASCII hoặc nhị phân. Các loại tệp khác là thư mục và tệp đặc biệt kiểu ký tự / kiểu khối.</p>
<ul><li>A — quá hẹp (một nội dung có thể có). C — thư mục không phải tệp thường. D — đĩa là <em>tệp đặc biệt kiểu khối</em> (block special file).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 7.</p>
<h3>Câu 23 · Phòng thi #3 — cấu trúc thư mục</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q23.png" alt="Ảnh đề gốc câu 23" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which directory structure would be the most efficient in preventing filename conflicts while allowing quick lookups?</em><br>A. Single-level directory · B. Two-level directory · C. Tree-structured directory · D. Graph-based directory with soft links</p>
<p>🇻🇳 Cấu trúc thư mục nào hiệu quả nhất để tránh trùng tên tệp mà vẫn tra cứu nhanh? A. Một mức · B. Hai mức · C. Dạng cây · D. Dạng đồ thị có liên kết mềm.</p>
<p>📚 <strong>filename conflict</strong> = trùng tên tệp · <strong>lookup</strong> = tra cứu · <strong>soft link</strong> = liên kết mềm.</p>
<p class="dap-an">✅ <strong>C.</strong> Phân cấp cho mỗi người dùng, mỗi dự án một không gian tên riêng (không trùng) và đường dẫn tìm ra tệp sau vài bước.</p>
<ul><li>A — một không gian tên cho tất cả: trùng tên. B — mỗi người dùng chỉ một mức: vẫn trùng trong một người. D — liên kết thêm khả năng chia sẻ chứ không thêm tốc độ, chu trình còn làm duyệt khó hơn.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 13–15.</p>
<h3>Câu 24 · Phòng thi #4 — tệp kiểu LINK</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q24.png" alt="Ảnh đề gốc câu 24" loading="lazy" /></p></details>
<p>🇬🇧 <em>In file sharing, B links to one of C's files by having the system create a new file, of type LINK, and entering that file in B's directory. The new file contains just the path name of the file to which it is linked. When B reads from the linked file, the operating system sees that the file being read from is of type LINK, looks up the name of the file, and reads that file. Which of the following is the correct about the type of file sharing described above?</em><br>A. Synchronous Linking · B. Symbolic Linking · C. Traditional (hard) Linking · D. Synthetic Linking</p>
<p>🇻🇳 Khi chia sẻ tệp, B liên kết tới một tệp của C bằng cách nhờ hệ thống tạo một tệp mới kiểu LINK đặt vào thư mục của B; tệp mới chỉ chứa đường dẫn tới tệp được liên kết. Khi B đọc, HĐH thấy tệp kiểu LINK, tra tên rồi đọc tệp đó. Đây là kiểu chia sẻ nào?</p>
<p>📚 <strong>path name</strong> = đường dẫn · <strong>symbolic link</strong> = liên kết tượng trưng (liên kết mềm) · <strong>hard link</strong> = liên kết cứng.</p>
<p class="dap-an">✅ <strong>B.</strong> Một tệp mới mà nội dung chỉ là một đường dẫn = liên kết tượng trưng — đúng nguyên văn câu của sách.</p>
<ul><li>C — liên kết cứng là một mục thư mục thứ hai trỏ cùng i-node; không tạo tệp mới nào. A, D — không tồn tại.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 24–25.</p>
<h3>Câu 25 · Phòng thi #5 — chống phân mảnh SSD</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q25.png" alt="Ảnh đề gốc câu 25" loading="lazy" /></p></details>
<p>🇬🇧 <em>Why is defragmenting a Solid-State Drive (SSD) generally not recommended?</em><br>A. SSDs store data without needing contiguous blocks · B. SSDs can fail when defragmented more than once · C. SSDs degrade faster with unnecessary write cycles · D. SSDs auto-defrag and ignore manual optimization</p>
<p>🇻🇳 Vì sao thường không nên chống phân mảnh (defragment) ổ SSD? A. SSD lưu dữ liệu không cần khối liên tục · B. SSD có thể hỏng nếu chống phân mảnh quá một lần · C. SSD xuống cấp nhanh hơn vì những chu kỳ ghi không cần thiết · D. SSD tự chống phân mảnh và bỏ qua tối ưu bằng tay.</p>
<p>📚 <strong>defragment</strong> = chống phân mảnh (dồn tệp về các khối liền nhau) · <strong>degrade</strong> = xuống cấp · <strong>write cycle</strong> = chu kỳ ghi.</p>
<p class="dap-an">✅ <strong>C.</strong> Ô nhớ flash chỉ chịu được số lần ghi có hạn; chống phân mảnh ghi lại rất nhiều dữ liệu mà không được gì, vì SSD không có thời gian tìm (seek).</p>
<ul><li>A đúng một nửa (liền nhau không giúp gì SSD) nhưng nó giải thích vì sao chống phân mảnh <em>vô ích</em>, không phải vì sao nó <em>có hại</em>. B — bịa. D — cơ chế cân bằng hao mòn bên trong ổ không phải trình chống phân mảnh.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-2">4.B</a>, slide 38–40.</p>
<h3>Câu 26 · Phòng thi #6 — các mức ISO 9660</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q26.png" alt="Ảnh đề gốc câu 26" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which ISO 9660 level allows a file to consist of several extents (i.e., noncontiguous segments) by partially relaxing the contiguous file requirement?</em><br>A. Level 1 · B. Level 2 · C. Level 3 · D. None of the above</p>
<p>🇻🇳 Mức ISO 9660 nào cho phép một tệp gồm nhiều extent (đoạn không liên tục), tức nới một phần yêu cầu tệp phải liên tục?</p>
<p>📚 <strong>relax a requirement</strong> = nới lỏng một yêu cầu · <strong>noncontiguous</strong> = không liên tục.</p>
<p class="dap-an">✅ <strong>C.</strong> Mức 1: tên 8 + 3, tệp liên tục. Mức 2: tên tới 31 ký tự. Mức 3: một tệp có thể gồm nhiều phần (extent).</p>
<ul><li>A, B — vẫn đòi tệp liên tục. D — C đúng.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-2">4.B</a>, slide 46.</p>`),
    bi(`<h2>Chapter 5 — Input/output (7 questions)</h2>
<h3>Q27 · Exam Room #7 — seek time</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q27.png" alt="Original question 27" loading="lazy" /></p></details>
<p><em>Time to move the arm to the proper cylinder is called?</em><br>A. Seek time · B. Rotational delay · C. Actual data transfer time · D. Access time</p>
<p class="dap-an">✅ <strong>A.</strong> Reading a block costs three times: <strong>seek</strong> (arm to the cylinder), <strong>rotational delay</strong> (sector comes under the head), <strong>transfer</strong>. Seek dominates, which is why the arm-scheduling algorithms exist.</p>
<ul><li>B, C — the other two components. D — access time is the total of all three.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slides 24–25, 31.</p>
<h3>Q29 · Exam Room #9 — SSF seek time (computed)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q29.png" alt="Original question 29" loading="lazy" /></p></details>
<p><em>In Disk Arm Scheduling Algorithms: Consider the seek to cylinder 11 is in progress, new requests come in for cylinders 1, 36, 16, 34, 9, and 12; A seek takes 6 msec per cylinder. Calculate Seek time with Shortest Seek First (SSF) algorithm?</em><br>A. 360ms · B. 366ms · C. 560ms · D. 566ms · E. 666ms</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/24e2c3046c31ce47ec7a010ac49dbe37cb840076.svg" alt="SSF from 11 — the book's own example (Fig. 5-24)" loading="lazy" /><p class="chu-thich">🧮 SSF from 11 — the book's own example (Fig. 5-24)</p></div>
<table>
<thead><tr><th>Move</th><th>Cylinders</th></tr></thead>
<tbody>
<tr><td>11 → 12</td><td>1</td></tr>
<tr><td>12 → 9</td><td>3</td></tr>
<tr><td>9 → 16</td><td>7</td></tr>
<tr><td>16 → 1</td><td>15</td></tr>
<tr><td>1 → 34</td><td>33</td></tr>
<tr><td>34 → 36</td><td>2</td></tr>
<tr><td><strong>Total</strong></td><td><strong>1 + 3 + 7 + 15 + 33 + 2 = 61</strong> × 6 ms = <strong>366 ms</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<p class="dap-an">✅ <strong>B — 366 ms</strong> (61 cylinders × 6 ms). This is exactly the textbook example, where SSF totals 61 cylinders against 111 for FCFS. The bank's key is B.</p>
<ul><li>A — 60 × 6: the elevator total, not SSF. C, D, E — no algorithm gives those.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slides 31–32.</p>
<h3>Q30 · Exam Room #10 — precise interrupt</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q30.png" alt="Original question 30" loading="lazy" /></p></details>
<p><em>An interrupt has four properties: 1. The PC is saved in a known place. 2. All instructions before the one pointed to by the PC have completed. 3. No instruction beyond the one pointed to by the PC has finished. 4. The execution state of the instruction pointed to by the PC is known. What type of Interrupt is it?</em><br>A. Imprecise interrupt · B. Synchronous interrupt · C. Sequential interrupt · D. Precise interrupt</p>
<p class="dap-an">✅ <strong>D.</strong> These four properties are the book's definition of a precise interrupt — the machine is left in a well-defined state.</p>
<ul><li>A — imprecise = one of the four fails (pipelined CPUs with half-done instructions). B, C — not the book's terms for this.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slides 8–9.</p>
<h3>Q31 · Exam Room #11 — interrupts instead of polling</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q31.png" alt="Original question 31" loading="lazy" /></p></details>
<p><em>What is the effect of using interrupts instead of polling for I/O?</em><br>A. Slower response time to external events · B. Higher CPU usage due to constant checking · C. More efficient use of processor cycles · D. Reduced control over process priorities</p>
<p class="dap-an">✅ <strong>C.</strong> With polling (programmed I/O) the CPU busy-waits on the device's status register; with interrupts it runs other processes and is told when the device is ready.</p>
<ul><li>B — constant checking is polling. A — interrupts react at once. D — unrelated.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slides 11–13.</p>
<h3>Q32 · Exam Room #12 — device drivers</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q32.png" alt="Original question 32" loading="lazy" /></p></details>
<p><em>Which I/O software layer is primarily responsible for handling device-specific details while maintaining a uniform interface for the upper layers?</em><br>A. User-space I/O libraries · B. Device drivers · C. Interrupt handlers · D. Hardware controllers</p>
<p class="dap-an">✅ <strong>B.</strong> Device-specific code lives in the driver; above it, the device-independent layer sees the same interface for every driver of a class.</p>
<ul><li>A — on top, device-independent. C — handle the interrupt, then wake the driver. D — hardware, not a software layer.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slides 15, 18–20.</p>
<h3>Q33 · Exam Room #13 — FCFS head movement (computed — the bank's key is WRONG)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q33.png" alt="Original question 33" loading="lazy" /></p></details>
<p><em>While processing cylinder 25, new requests appear for cylinders 5, 48, 32, 50, and 12. Using the FCFS (First-Come, First-Served) scheduling algorithm, what is the total number of disk head movements?</em><br>A. 108 · B. 96 · C. 83 · D. 114</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c80dae5721a40302812fd66671d5c6a4e1ff3df3.svg" alt="FCFS from 25: 20 + 43 + 16 + 18 + 38" loading="lazy" /><p class="chu-thich">🧮 FCFS from 25: 20 + 43 + 16 + 18 + 38</p></div>
<table>
<thead><tr><th>Move</th><th>Cylinders</th></tr></thead>
<tbody>
<tr><td>25 → 5</td><td>20</td></tr>
<tr><td>5 → 48</td><td>43</td></tr>
<tr><td>48 → 32</td><td>16</td></tr>
<tr><td>32 → 50</td><td>18</td></tr>
<tr><td>50 → 12</td><td>38</td></tr>
<tr><td><strong>Total</strong></td><td><strong>135</strong></td></tr>
<tr><td>from the 1st request on (does not depend on where the head starts)</td><td><strong>115</strong> &gt; 114</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9e1cd072ff0f49ded09c18bab685cfb3eb2281bd.svg" alt="The same requests under every algorithm that does not need the disk size" loading="lazy" /><p class="chu-thich">🧮 The same requests under every algorithm that does not need the disk size</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<div class="callout danger"><p><strong>Bank key: D (114). Correct answer: 135 — none of the options.</strong> The original image was checked: the numbers are as printed. Proof without any arithmetic doubt: whatever the starting cylinder, the moves after the first request are 48 − 5 + 48 − 32 + 50 − 32 + 50 − 12 = 115, already more than 114. No other standard algorithm gives 108, 96, 83 or 114 either.</p></div>
<p class="dap-an">✅ <strong>In the exam: choose D (114)</strong> — the closest to 135 and the key the bank expects — after one recomputation, then move on. Know that the true FCFS total is 135.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 31.</p>
<h3>Q34 · Exam Room #14 — watchdog timer</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q34.png" alt="Original question 34" loading="lazy" /></p></details>
<p><em>What is the main function of a watchdog timer in an operating system?</em><br>A. Measure the performance of user programs and evaluate them. · B. Detect system crashes and reset the system if necessary. · C. Schedule tasks to execute at predetermined real-time intervals. · D. Manage memory allocation.</p>
<p class="dap-an">✅ <strong>B.</strong> The system must "kick" the watchdog regularly; if it stops (hung), the timer expires and resets the machine. One of the clock-software duties in the book.</p>
<ul><li>A — profiling (another clock duty, but not the watchdog). C — alarm timers. D — unrelated.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slides 38–41.</p>`,
    `<h2>Chương 5 — Vào/ra (7 câu)</h2>
<h3>Câu 27 · Phòng thi #7 — thời gian tìm</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q27.png" alt="Ảnh đề gốc câu 27" loading="lazy" /></p></details>
<p>🇬🇧 <em>Time to move the arm to the proper cylinder is called?</em><br>A. Seek time · B. Rotational delay · C. Actual data transfer time · D. Access time</p>
<p>🇻🇳 Thời gian di chuyển cần đọc tới đúng cylinder gọi là gì? A. Thời gian tìm · B. Độ trễ quay · C. Thời gian truyền dữ liệu thực · D. Thời gian truy cập.</p>
<p>📚 <strong>arm</strong> = cần đọc · <strong>cylinder</strong> = trụ (tập các rãnh cùng bán kính) · <strong>seek</strong> = tìm.</p>
<p class="dap-an">✅ <strong>A.</strong> Đọc một khối tốn ba khoảng: <strong>tìm</strong> (đưa cần tới cylinder), <strong>độ trễ quay</strong> (chờ sector quay tới dưới đầu đọc), <strong>truyền</strong>. Tìm chiếm phần lớn, nên mới có các thuật toán lập lịch đầu từ.</p>
<ul><li>B, C — hai thành phần kia. D — thời gian truy cập là tổng cả ba.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 24–25, 31.</p>
<h3>Câu 29 · Phòng thi #9 — thời gian tìm với SSF (câu tính)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q29.png" alt="Ảnh đề gốc câu 29" loading="lazy" /></p></details>
<p>🇬🇧 <em>In Disk Arm Scheduling Algorithms: Consider the seek to cylinder 11 is in progress, new requests come in for cylinders 1, 36, 16, 34, 9, and 12; A seek takes 6 msec per cylinder. Calculate Seek time with Shortest Seek First (SSF) algorithm?</em><br>A. 360ms · B. 366ms · C. 560ms · D. 566ms · E. 666ms</p>
<p>🇻🇳 Đầu từ đang đi tới cylinder 11 thì có yêu cầu mới tới các cylinder 1, 36, 16, 34, 9, 12; mỗi cylinder tốn 6 ms. Tính thời gian tìm với thuật toán SSF (dịch ngắn nhất trước).</p>
<p>📚 <strong>in progress</strong> = đang diễn ra (đầu từ đang ở 11) · <strong>msec</strong> = mili giây · <strong>Shortest Seek First</strong> = dịch ngắn nhất trước.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3279e951560a078fcd2e3a831dc5f102463d3e83.svg" alt="SSF từ 11 — chính là ví dụ của sách (Hình 5-24)" loading="lazy" /><p class="chu-thich">🧮 SSF từ 11 — chính là ví dụ của sách (Hình 5-24)</p></div>
<table>
<thead><tr><th>Bước đi</th><th>Số cylinder</th></tr></thead>
<tbody>
<tr><td>11 → 12</td><td>1</td></tr>
<tr><td>12 → 9</td><td>3</td></tr>
<tr><td>9 → 16</td><td>7</td></tr>
<tr><td>16 → 1</td><td>15</td></tr>
<tr><td>1 → 34</td><td>33</td></tr>
<tr><td>34 → 36</td><td>2</td></tr>
<tr><td><strong>Tổng</strong></td><td><strong>1 + 3 + 7 + 15 + 33 + 2 = 61</strong> × 6 ms = <strong>366 ms</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<p class="dap-an">✅ <strong>B — 366 ms</strong> (61 cylinder × 6 ms). Đây đúng là ví dụ trong sách, nơi SSF tổng 61 cylinder so với 111 của FCFS. Khoá ngân hàng là B.</p>
<ul><li>A — 60 × 6: tổng của thuật toán thang máy (elevator), không phải SSF. C, D, E — không thuật toán nào ra.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 31–32.</p>
<h3>Câu 30 · Phòng thi #10 — ngắt chính xác</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q30.png" alt="Ảnh đề gốc câu 30" loading="lazy" /></p></details>
<p>🇬🇧 <em>An interrupt has four properties: 1. The PC is saved in a known place. 2. All instructions before the one pointed to by the PC have completed. 3. No instruction beyond the one pointed to by the PC has finished. 4. The execution state of the instruction pointed to by the PC is known. What type of Interrupt is it?</em><br>A. Imprecise interrupt · B. Synchronous interrupt · C. Sequential interrupt · D. Precise interrupt</p>
<p>🇻🇳 Một ngắt có bốn tính chất: (1) PC được lưu ở chỗ biết trước; (2) mọi lệnh trước lệnh PC trỏ tới đã xong; (3) không lệnh nào sau lệnh PC trỏ tới đã xong; (4) trạng thái thực thi của lệnh PC trỏ tới là biết được. Đó là loại ngắt gì?</p>
<p>📚 <strong>precise / imprecise interrupt</strong> = ngắt chính xác / không chính xác · <strong>PC (program counter)</strong> = bộ đếm chương trình.</p>
<p class="dap-an">✅ <strong>D.</strong> Bốn tính chất này là định nghĩa ngắt chính xác của sách — máy được để ở một trạng thái rõ ràng.</p>
<ul><li>A — không chính xác = một trong bốn điều không đúng (CPU đường ống còn lệnh làm dở). B, C — không phải thuật ngữ của sách cho chuyện này.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slide 8–9.</p>
<h3>Câu 31 · Phòng thi #11 — ngắt thay cho thăm dò</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q31.png" alt="Ảnh đề gốc câu 31" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is the effect of using interrupts instead of polling for I/O?</em><br>A. Slower response time to external events · B. Higher CPU usage due to constant checking · C. More efficient use of processor cycles · D. Reduced control over process priorities</p>
<p>🇻🇳 Dùng ngắt thay cho thăm dò (polling) khi làm I/O thì được gì? A. Phản ứng với sự kiện ngoài chậm hơn · B. CPU bận hơn vì kiểm liên tục · C. Dùng chu kỳ CPU hiệu quả hơn · D. Khó điều khiển ưu tiên tiến trình.</p>
<p>📚 <strong>polling</strong> = thăm dò liên tục trạng thái thiết bị · <strong>processor cycles</strong> = chu kỳ CPU.</p>
<p class="dap-an">✅ <strong>C.</strong> Thăm dò (programmed I/O) bắt CPU chờ bận trên thanh ghi trạng thái của thiết bị; có ngắt thì CPU chạy tiến trình khác và được báo khi thiết bị sẵn sàng.</p>
<ul><li>B — kiểm liên tục chính là thăm dò. A — ngắt phản ứng tức thì. D — không liên quan.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slide 11–13.</p>
<h3>Câu 32 · Phòng thi #12 — driver thiết bị</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q32.png" alt="Ảnh đề gốc câu 32" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which I/O software layer is primarily responsible for handling device-specific details while maintaining a uniform interface for the upper layers?</em><br>A. User-space I/O libraries · B. Device drivers · C. Interrupt handlers · D. Hardware controllers</p>
<p>🇻🇳 Tầng phần mềm I/O nào lo các chi tiết riêng của từng thiết bị mà vẫn giữ giao diện thống nhất cho các tầng trên? A. Thư viện I/O ở user space · B. Driver thiết bị · C. Trình xử lý ngắt · D. Bộ điều khiển phần cứng.</p>
<p>📚 <strong>device-specific</strong> = riêng của thiết bị · <strong>uniform interface</strong> = giao diện thống nhất · <strong>controller</strong> = bộ điều khiển.</p>
<p class="dap-an">✅ <strong>B.</strong> Mã riêng của từng thiết bị nằm trong driver; phía trên, tầng độc lập thiết bị thấy cùng một giao diện với mọi driver cùng loại.</p>
<ul><li>A — ở trên, độc lập thiết bị. C — xử lý ngắt rồi đánh thức driver. D — là phần cứng, không phải tầng phần mềm.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slide 15, 18–20.</p>
<h3>Câu 33 · Phòng thi #13 — quãng đầu từ FCFS (câu tính — khoá ngân hàng SAI)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q33.png" alt="Ảnh đề gốc câu 33" loading="lazy" /></p></details>
<p>🇬🇧 <em>While processing cylinder 25, new requests appear for cylinders 5, 48, 32, 50, and 12. Using the FCFS (First-Come, First-Served) scheduling algorithm, what is the total number of disk head movements?</em><br>A. 108 · B. 96 · C. 83 · D. 114</p>
<p>🇻🇳 Đang xử lý cylinder 25 thì có yêu cầu mới tới 5, 48, 32, 50, 12. Dùng FCFS (đến trước phục vụ trước), tổng quãng di chuyển của đầu từ là bao nhiêu?</p>
<p>📚 <strong>head movement</strong> = quãng di chuyển của đầu từ (tính bằng số cylinder) · <strong>First-Come, First-Served</strong> = đến trước phục vụ trước.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/635e4afe2173ab701cb08c53d87eed60187479a3.svg" alt="FCFS từ 25: 20 + 43 + 16 + 18 + 38" loading="lazy" /><p class="chu-thich">🧮 FCFS từ 25: 20 + 43 + 16 + 18 + 38</p></div>
<table>
<thead><tr><th>Bước đi</th><th>Số cylinder</th></tr></thead>
<tbody>
<tr><td>25 → 5</td><td>20</td></tr>
<tr><td>5 → 48</td><td>43</td></tr>
<tr><td>48 → 32</td><td>16</td></tr>
<tr><td>32 → 50</td><td>18</td></tr>
<tr><td>50 → 12</td><td>38</td></tr>
<tr><td><strong>Tổng</strong></td><td><strong>135</strong></td></tr>
<tr><td>từ yêu cầu thứ nhất trở đi (không phụ thuộc đầu từ xuất phát ở đâu)</td><td><strong>115</strong> &gt; 114</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c4ca4b9ec1d248981e1997be1920828d22187f35.svg" alt="Cùng các yêu cầu với mọi thuật toán không cần biết cỡ đĩa" loading="lazy" /><p class="chu-thich">🧮 Cùng các yêu cầu với mọi thuật toán không cần biết cỡ đĩa</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<div class="callout danger"><p><strong>Khoá ngân hàng: D (114). Đáp án đúng: 135 — không phương án nào.</strong> Đã đối chiếu ảnh đề gốc: số liệu đúng như in. Chứng minh khỏi ngờ phép cộng: dù đầu từ xuất phát ở đâu, các bước sau yêu cầu đầu tiên là 48 − 5 + 48 − 32 + 50 − 32 + 50 − 12 = 115, đã lớn hơn 114. Không thuật toán chuẩn nào khác ra 108, 96, 83 hay 114.</p></div>
<p class="dap-an">✅ <strong>Khi thi: chọn D (114)</strong> — gần 135 nhất và là khoá ngân hàng mong đợi — sau khi tính lại một lần, rồi đi tiếp. Nhưng hãy biết tổng FCFS thật là 135.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 31.</p>
<h3>Câu 34 · Phòng thi #14 — bộ định thời watchdog</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q34.png" alt="Ảnh đề gốc câu 34" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is the main function of a watchdog timer in an operating system?</em><br>A. Measure the performance of user programs and evaluate them. · B. Detect system crashes and reset the system if necessary. · C. Schedule tasks to execute at predetermined real-time intervals. · D. Manage memory allocation.</p>
<p>🇻🇳 Chức năng chính của bộ định thời watchdog trong HĐH là gì? A. Đo và đánh giá hiệu năng chương trình · B. Phát hiện hệ thống treo và khởi động lại khi cần · C. Lập lịch tác vụ chạy theo chu kỳ thời gian thực · D. Quản lý cấp phát bộ nhớ.</p>
<p>📚 <strong>watchdog timer</strong> = bộ định thời canh gác · <strong>crash</strong> = sập, treo · <strong>reset</strong> = khởi động lại.</p>
<p class="dap-an">✅ <strong>B.</strong> Hệ thống phải "đá" watchdog đều đặn; nếu ngừng (vì treo), bộ định thời hết hạn và khởi động lại máy. Đây là một trong các nhiệm vụ của phần mềm đồng hồ trong sách.</p>
<ul><li>A — đo hiệu năng (profiling, một nhiệm vụ khác của đồng hồ). C — bộ hẹn giờ báo thức. D — không liên quan.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 38–41.</p>`),
    bi(`<h2>Chapter 6 — Deadlocks (7 questions)</h2>
<h3>Q35 · Exam Room #15 — hold and wait</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q35.png" alt="Original question 35" loading="lazy" /></p></details>
<p><em>Processes currently holding resources that were granted earlier can request new resources</em><br>A. Mutual exclusion condition · B. Hold-and-wait condition · C. No-preemption condition · D. Circular wait condition</p>
<p class="dap-an">✅ <strong>B.</strong> The stem is the book's sentence for hold-and-wait, word for word.</p>
<ul><li>A — each resource is assigned to one process or free. C — resources cannot be taken away. D — a cycle of waiting processes.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 6.</p>
<h3>Q36 · Exam Room #16 — what avoidance examines</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q36.png" alt="Original question 36" loading="lazy" /></p></details>
<p><em>A deadlock avoidance algorithm dynamically examines the ___ to ensure that a circular wait condition can never exist.</em><br>A. system storage state · B. operating system · C. resources · D. resource allocation state</p>
<p class="dap-an">✅ <strong>D.</strong> Avoidance (the banker) looks at the <strong>resource-allocation state</strong> — available, allocated, maximum demands — before each grant, and only grants if the state stays safe.</p>
<ul><li>A, B, C — too vague or wrong object.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 20–22.</p>
<h3>Q37 · Exam Room #17 — a preemptable resource</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q37.png" alt="Original question 37" loading="lazy" /></p></details>
<p><em>What is a preemtable resource?</em><br>A. The one that can be taken away from the process owning it with no ill effects · B. The one that can be taken away from the process owning it with ill effects · C. The one that can not be taken away from the process owning it with no ill effects · D. The one that can not be taken away from the process owning it with ill effects</p>
<p class="dap-an">✅ <strong>A.</strong> "Preemtable" is a typo for preemptable. The book's example: memory can be taken away (swapped out) and given back with no harm; a Blu-ray recorder in the middle of a burn cannot.</p>
<ul><li>B — "with ill effects" describes a nonpreemptable one. C, D — "cannot be taken away" is the definition of nonpreemptable.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 2.</p>
<h3>Q38 · Exam Room #18 — no preemption</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q38.png" alt="Original question 38" loading="lazy" /></p></details>
<p><em>In deadlock, what is no-preemption condition?</em><br>A. Processes currently holding resources that were granted earlier can request new resources. · B. Resources previously granted cannot be forcibly taken away from a process. They must be explicitly released by the process holding them. · C. There must be a circular list of two or more processes, each of which is waiting for a resource held by the next member of the chain. · D. Each resource is either currently assigned to exactly one process or is available.</p>
<p class="dap-an">✅ <strong>B.</strong> The four options are the four Coffman conditions; match each sentence to its name.</p>
<ul><li>A = hold and wait, C = circular wait, D = mutual exclusion.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 6.</p>
<h3>Q47 · Exam Room #27 — is it safe? (computed)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q47.png" alt="Original question 47" loading="lazy" /></p></details>
<p><em>A system has four processes: P1, P2, P3, P4 and three resources: RS1, RS2, RS3. The allocation and request matrices are: Allocated C1 (1 0 1), C2 (2 1 0), C3 (0 2 2), C4 (1 0 1); Requested R1 (2 0 0), R2 (1 1 1), R3 (2 1 0), R4 (0 2 1). Available resources: (1,1,1). Is the system in a safe state?</em><br>A. No, it's unsafe · B. Yes, it's safe · C. The system is in a deadlock · D. The system experiences starvation</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/bf8326d29b3d7c5a5dbf6fe97132251fade6df9a.svg" alt="The detection algorithm with the &quot;Requested&quot; matrix" loading="lazy" /><p class="chu-thich">🧮 The detection algorithm with the "Requested" matrix</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<p class="dap-an">✅ <strong>B.</strong> With a <em>Request</em> matrix this is the detection algorithm (Fig. 6-6/6-7): P2's request fits, it finishes and returns (2 1 0); then P1, P3, P4 all fit. Nobody is left ⇒ no deadlock, every process can complete. Bank key B.</p>
<ul><li>A, C — would need at least one process that can never run. D — starvation is about unfair scheduling over time; the matrices cannot show it.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 16–18.</p>
<h3>Q48 · Exam Room #28 — the safe sequence (computed)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q48.png" alt="Original question 48" loading="lazy" /></p></details>
<p><em>A system has 3 types of resources (A, B, C) with total instances A = 10, B = 5, C = 7. The Allocation and Max for each process are: P0 (0,1,0)/(7,5,3), P1 (2,0,0)/(3,2,2), P2 (3,0,2)/(9,0,2), P3 (2,1,1)/(2,2,2), P4 (0,0,2)/(4,3,3). Which of the following is the correct safe sequence when applying the Banker's Algorithm?</em><br>A. P1 → P3 → P4 → P0 → P2 · B. P0 → P2 → P3 → P1 → P4 · C. P1 → P0 → P2 → P3 → P4 · D. P2 → P1 → P0 → P4 → P3</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9bd59fecf7ca91eea7689c42ea01e487d4dc39a9.svg" alt="Available = Total − ΣAllocation = (3 3 2); every option checked" loading="lazy" /><p class="chu-thich">🧮 Available = Total − ΣAllocation = (3 3 2); every option checked</p></div>
<table>
<thead><tr><th>Runs</th><th>Need</th><th>Work before</th><th>Work after (+ Allocation)</th></tr></thead>
<tbody>
<tr><td>P1</td><td>(1 2 2)</td><td>(3 3 2)</td><td>(5 3 2)</td></tr>
<tr><td>P3</td><td>(0 1 1)</td><td>(5 3 2)</td><td>(7 4 3)</td></tr>
<tr><td>P4</td><td>(4 3 1)</td><td>(7 4 3)</td><td>(7 4 5)</td></tr>
<tr><td>P0</td><td>(7 4 3)</td><td>(7 4 5)</td><td>(7 5 5)</td></tr>
<tr><td>P2</td><td>(6 0 0)</td><td>(7 5 5)</td><td>(10 5 7)</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<p class="dap-an">✅ <strong>A.</strong> This is Silberschatz's classic example. Need = Max − Allocation; P1's need (1 2 2) fits (3 3 2) ⇒ work (5 3 2); then P3, P4, P0, P2. Bank key A.</p>
<ul><li>B — P0 needs (7 4 3) at once. C — after P1, P0 still needs (7 4 3) &gt; (5 3 2). D — P2 needs (6 0 0) &gt; (3 3 2).</li></ul>
<p class="pitfall">⚠️ The trap is forgetting that Available is <em>not</em> given: it is Total − the column sums of Allocation (7 2 5).</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 24–25.</p>
<h3>Q49 · Exam Room #29 — attacking circular wait</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q49.png" alt="Original question 49" loading="lazy" /></p></details>
<p><em>Which approach to deadlock prevention eliminates circular wait?</em><br>A. Forcing all processes to request resources in a predefined order · B. Allowing processes to hold and wait for resources indefinitely · C. Preventing mutual exclusion for critical resources · D. Granting all resources to a process before execution begins</p>
<p class="dap-an">✅ <strong>A.</strong> Number the resources and request them only in increasing order: a cycle would need someone to wait for a lower number — impossible.</p>
<ul><li>B — that <em>creates</em> hold and wait. C — attacks mutual exclusion. D — attacks hold and wait.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 26–28.</p>`,
    `<h2>Chương 6 — Bế tắc (7 câu)</h2>
<h3>Câu 35 · Phòng thi #15 — giữ và chờ</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q35.png" alt="Ảnh đề gốc câu 35" loading="lazy" /></p></details>
<p>🇬🇧 <em>Processes currently holding resources that were granted earlier can request new resources</em><br>A. Mutual exclusion condition · B. Hold-and-wait condition · C. No-preemption condition · D. Circular wait condition</p>
<p>🇻🇳 Tiến trình đang giữ tài nguyên được cấp từ trước vẫn có thể xin tài nguyên mới — đó là điều kiện nào? A. Loại trừ lẫn nhau · B. Giữ và chờ · C. Không trưng dụng · D. Chờ vòng tròn.</p>
<p>📚 <strong>granted</strong> = đã được cấp · <strong>hold and wait</strong> = giữ và chờ.</p>
<p class="dap-an">✅ <strong>B.</strong> Đề bài là nguyên văn câu của sách cho điều kiện giữ và chờ.</p>
<ul><li>A — mỗi tài nguyên hoặc cấp cho đúng một tiến trình hoặc rảnh. C — không thể giật tài nguyên lại. D — một vòng các tiến trình chờ nhau.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 6.</p>
<h3>Câu 36 · Phòng thi #16 — thuật toán tránh bế tắc xem xét gì</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q36.png" alt="Ảnh đề gốc câu 36" loading="lazy" /></p></details>
<p>🇬🇧 <em>A deadlock avoidance algorithm dynamically examines the ___ to ensure that a circular wait condition can never exist.</em><br>A. system storage state · B. operating system · C. resources · D. resource allocation state</p>
<p>🇻🇳 Thuật toán tránh bế tắc liên tục xem xét ___ để bảo đảm điều kiện chờ vòng tròn không bao giờ xảy ra. A. trạng thái lưu trữ · B. hệ điều hành · C. tài nguyên · D. trạng thái cấp phát tài nguyên.</p>
<p>📚 <strong>avoidance</strong> = tránh (bế tắc) · <strong>dynamically</strong> = trong lúc chạy · <strong>resource allocation state</strong> = trạng thái cấp phát tài nguyên.</p>
<p class="dap-an">✅ <strong>D.</strong> Tránh bế tắc (nhà băng) nhìn vào <strong>trạng thái cấp phát tài nguyên</strong> — đang rảnh, đang cấp, nhu cầu tối đa — trước mỗi lần cấp, và chỉ cấp khi trạng thái vẫn an toàn.</p>
<ul><li>A, B, C — quá chung hoặc sai đối tượng.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 20–22.</p>
<h3>Câu 37 · Phòng thi #17 — tài nguyên trưng dụng được</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q37.png" alt="Ảnh đề gốc câu 37" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is a preemtable resource?</em><br>A. The one that can be taken away from the process owning it with no ill effects · B. The one that can be taken away from the process owning it with ill effects · C. The one that can not be taken away from the process owning it with no ill effects · D. The one that can not be taken away from the process owning it with ill effects</p>
<p>🇻🇳 Tài nguyên trưng dụng được (preemptable) là gì? A. Có thể lấy khỏi tiến trình đang giữ mà không gây hại · B. Lấy được nhưng gây hại · C. Không lấy được, không gây hại · D. Không lấy được, gây hại.</p>
<p>📚 <strong>preemptable</strong> = trưng dụng được ("preemtable" trong đề là lỗi gõ) · <strong>ill effects</strong> = tác hại.</p>
<p class="dap-an">✅ <strong>A.</strong> Ví dụ của sách: bộ nhớ có thể lấy lại (đẩy ra đĩa) rồi trả lại mà không hại gì; đầu ghi Blu-ray đang ghi dở thì không.</p>
<ul><li>B — "gây hại" là tả tài nguyên không trưng dụng được. C, D — "không lấy được" là định nghĩa của nonpreemptable.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 2.</p>
<h3>Câu 38 · Phòng thi #18 — không trưng dụng</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q38.png" alt="Ảnh đề gốc câu 38" loading="lazy" /></p></details>
<p>🇬🇧 <em>In deadlock, what is no-preemption condition?</em><br>A. Processes currently holding resources that were granted earlier can request new resources. · B. Resources previously granted cannot be forcibly taken away from a process. They must be explicitly released by the process holding them. · C. There must be a circular list of two or more processes, each of which is waiting for a resource held by the next member of the chain. · D. Each resource is either currently assigned to exactly one process or is available.</p>
<p>🇻🇳 Trong bế tắc, điều kiện không trưng dụng (no-preemption) là gì? A. Tiến trình đang giữ tài nguyên được cấp từ trước vẫn xin được tài nguyên mới. · B. Tài nguyên đã cấp không thể bị cưỡng ép lấy lại khỏi tiến trình; tiến trình đang giữ phải tự trả. · C. Phải có một vòng gồm hai tiến trình trở lên, mỗi tiến trình chờ tài nguyên do tiến trình kế tiếp giữ. · D. Mỗi tài nguyên hoặc đang cấp cho đúng một tiến trình, hoặc đang rảnh.</p>
<p>📚 <strong>forcibly</strong> = cưỡng ép · <strong>explicitly released</strong> = tự trả một cách rõ ràng.</p>
<p class="dap-an">✅ <strong>B.</strong> Bốn phương án là bốn điều kiện Coffman; ghép mỗi câu với tên của nó.</p>
<ul><li>A = giữ và chờ, C = chờ vòng tròn, D = loại trừ lẫn nhau.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 6.</p>
<h3>Câu 47 · Phòng thi #27 — có an toàn không? (câu tính)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q47.png" alt="Ảnh đề gốc câu 47" loading="lazy" /></p></details>
<p>🇬🇧 <em>A system has four processes: P1, P2, P3, P4 and three resources: RS1, RS2, RS3. The allocation and request matrices are: Allocated C1 (1 0 1), C2 (2 1 0), C3 (0 2 2), C4 (1 0 1); Requested R1 (2 0 0), R2 (1 1 1), R3 (2 1 0), R4 (0 2 1). Available resources: (1,1,1). Is the system in a safe state?</em><br>A. No, it's unsafe · B. Yes, it's safe · C. The system is in a deadlock · D. The system experiences starvation</p>
<p>🇻🇳 Hệ thống có bốn tiến trình và ba loại tài nguyên; cho ma trận đang cấp (Allocated) và đang xin (Requested), Available = (1, 1, 1). Hệ thống có ở trạng thái an toàn không?</p>
<p>📚 <strong>allocation matrix</strong> = ma trận đang cấp · <strong>request matrix</strong> = ma trận đang xin · <strong>available</strong> = đang rảnh.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3cd0b94e7b54f27354557a68f999e2f90aaaaab8.svg" alt="Thuật toán phát hiện bế tắc với ma trận &quot;Requested&quot;" loading="lazy" /><p class="chu-thich">🧮 Thuật toán phát hiện bế tắc với ma trận "Requested"</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<p class="dap-an">✅ <strong>B.</strong> Có ma trận <em>Request</em> thì đây là thuật toán phát hiện bế tắc (Hình 6-6/6-7): yêu cầu của P2 vừa đủ, P2 xong và trả (2 1 0); rồi P1, P3, P4 đều vừa. Không ai kẹt ⇒ không bế tắc, mọi tiến trình hoàn tất được. Khoá ngân hàng B.</p>
<ul><li>A, C — cần ít nhất một tiến trình không bao giờ chạy được. D — chết đói là chuyện lập lịch bất công theo thời gian; ma trận không cho thấy được.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 16–18.</p>
<h3>Câu 48 · Phòng thi #28 — chuỗi an toàn (câu tính)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q48.png" alt="Ảnh đề gốc câu 48" loading="lazy" /></p></details>
<p>🇬🇧 <em>A system has 3 types of resources (A, B, C) with total instances A = 10, B = 5, C = 7. The Allocation and Max for each process are: P0 (0,1,0)/(7,5,3), P1 (2,0,0)/(3,2,2), P2 (3,0,2)/(9,0,2), P3 (2,1,1)/(2,2,2), P4 (0,0,2)/(4,3,3). Which of the following is the correct safe sequence when applying the Banker's Algorithm?</em><br>A. P1 → P3 → P4 → P0 → P2 · B. P0 → P2 → P3 → P1 → P4 · C. P1 → P0 → P2 → P3 → P4 · D. P2 → P1 → P0 → P4 → P3</p>
<p>🇻🇳 Ba loại tài nguyên, tổng A = 10, B = 5, C = 7; cho Allocation và Max của năm tiến trình. Áp dụng thuật toán nhà băng, chuỗi an toàn nào đúng?</p>
<p>📚 <strong>total instances</strong> = tổng số thể hiện · <strong>safe sequence</strong> = chuỗi an toàn · <strong>Banker's Algorithm</strong> = thuật toán nhà băng.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/0ab93a89b5ff1ebb19d734b7ca36bc522ca451a2.svg" alt="Available = Tổng − ΣAllocation = (3 3 2); chấm từng phương án" loading="lazy" /><p class="chu-thich">🧮 Available = Tổng − ΣAllocation = (3 3 2); chấm từng phương án</p></div>
<table>
<thead><tr><th>Chạy</th><th>Need</th><th>Work trước</th><th>Work sau (+ Allocation)</th></tr></thead>
<tbody>
<tr><td>P1</td><td>(1 2 2)</td><td>(3 3 2)</td><td>(5 3 2)</td></tr>
<tr><td>P3</td><td>(0 1 1)</td><td>(5 3 2)</td><td>(7 4 3)</td></tr>
<tr><td>P4</td><td>(4 3 1)</td><td>(7 4 3)</td><td>(7 4 5)</td></tr>
<tr><td>P0</td><td>(7 4 3)</td><td>(7 4 5)</td><td>(7 5 5)</td></tr>
<tr><td>P2</td><td>(6 0 0)</td><td>(7 5 5)</td><td>(10 5 7)</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9 · p13: lập lịch đầu từ (MOS 4e §5.4.3) — dữ liệu chép từ đề
const P9 = { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], ms: 6 };
const P13 = { dau: 25, yeuCau: [5, 48, 32, 50, 12] };
const tinhP9 = () =&gt; lapLichDia(P9.dau, P9.yeuCau, 'sstf', { max: 39 });
const tinhP13 = (tt, huong = 'len') =&gt; lapLichDia(P13.dau, P13.yeuCau, tt, { max: 59, huong });
// p27: phát hiện bế tắc với ma trận Allocated (C) / Requested (R) — MOS 4e §6.4.2
const C27 = [[1, 0, 1], [2, 1, 0], [0, 2, 2], [1, 0, 1]], R27 = [[2, 0, 0], [1, 1, 1], [2, 1, 0], [0, 2, 1]], A27 = [1, 1, 1];
const tinhP27 = () =&gt; phatHien({ A: A27, C: C27, R: R27 });
// p28: nhà băng — Need = Max − Allocation, Available = Tổng − ΣAllocation
const E28 = [10, 5, 7];
const G28 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M28 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N28 = canThemTu(M28, G28);
const A28 = E28.map((x, j) =&gt; x - G28.reduce((s, r) =&gt; s + r[j], 0));
const PA28 = [[1, 3, 4, 0, 2], [0, 2, 3, 1, 4], [1, 0, 2, 3, 4], [2, 1, 0, 4, 3]];   // phương án A–D
// g15: các chương trình nạp liền nhau từ địa chỉ 0 ⇒ base = tổng cỡ các chương trình đứng trước, limit = cỡ chính nó
const G15 = [['P1', 8], ['P2', 4], ['P3', 16]];
const tinhG15 = () =&gt; G15.map(([ten, co], i) =&gt; ({ ten, co, base: G15.slice(0, i).reduce((s, [, c]) =&gt; s + c, 0) }));
// g17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// g11: một chương trình quét mảng 48 KB hai lượt (bước 64 B), RAM cho nó 32 KB, thay trang LRU; đổi cỡ trang
const CO_TRANG = [512, 1024, 2048, 4096, 8192];
// phân mảnh trong: phần thừa ở trang cuối, TRUNG BÌNH trên mọi cỡ chương trình 10 000 … 29 999 byte (một cỡ lẻ thì dao động)
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
function tinhG11(coTrang) {
  const vet = [];
  for (let luot = 0; luot &lt; 2; luot++) for (let b = 0; b &lt; 48 * 1024; b += 64) { const p = Math.floor(b / coTrang); if (vet[vet.length - 1] !== p) vet.push(p); }
  return thayTrang(vet, (32 * 1024) / coTrang, 'lru').soLoi;
}</code></pre></details>
<p class="dap-an">✅ <strong>A.</strong> Đây là ví dụ kinh điển của Silberschatz. Need = Max − Allocation; Need của P1 (1 2 2) vừa (3 3 2) ⇒ work (5 3 2); rồi P3, P4, P0, P2. Khoá ngân hàng A.</p>
<ul><li>B — P0 cần (7 4 3) ngay từ đầu. C — sau P1, P0 vẫn cần (7 4 3) &gt; (5 3 2). D — P2 cần (6 0 0) &gt; (3 3 2).</li></ul>
<p class="pitfall">⚠️ Bẫy là quên rằng đề KHÔNG cho Available: phải lấy Tổng − tổng cột Allocation (7 2 5).</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 24–25.</p>
<h3>Câu 49 · Phòng thi #29 — tấn công chờ vòng tròn</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q49.png" alt="Ảnh đề gốc câu 49" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which approach to deadlock prevention eliminates circular wait?</em><br>A. Forcing all processes to request resources in a predefined order · B. Allowing processes to hold and wait for resources indefinitely · C. Preventing mutual exclusion for critical resources · D. Granting all resources to a process before execution begins</p>
<p>🇻🇳 Cách ngăn bế tắc nào loại bỏ chờ vòng tròn? A. Buộc mọi tiến trình xin tài nguyên theo thứ tự định trước · B. Cho tiến trình giữ và chờ vô hạn · C. Bỏ loại trừ lẫn nhau với tài nguyên quan trọng · D. Cấp đủ mọi tài nguyên trước khi chạy.</p>
<p>📚 <strong>prevention</strong> = ngăn chặn · <strong>predefined order</strong> = thứ tự định trước · <strong>indefinitely</strong> = vô thời hạn.</p>
<p class="dap-an">✅ <strong>A.</strong> Đánh số tài nguyên và chỉ được xin theo thứ tự tăng: một vòng tròn sẽ cần ai đó chờ một số nhỏ hơn — không thể xảy ra.</p>
<ul><li>B — chính là <em>tạo ra</em> giữ và chờ. C — tấn công loại trừ lẫn nhau. D — tấn công giữ và chờ.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 26–28.</p>`),
    bi(`<h2>Chapter 7 — Virtualization (3 questions)</h2>
<h3>Q39 · Exam Room #19 — memory virtualization (debatable)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q39.png" alt="Original question 39" loading="lazy" /></p></details>
<p><em>Evaluate the role of memory virtualization in optimizing resource allocation in a virtualized environment. How does this technique impact overall system performance?</em><br>A. It effectively isolates processes from one another, which can lead to a reduction in overall system performance due to the additional resources required for maintaining this isolation. · B. It enhances resource allocation efficiency, improving system performance. · C. It complicates memory management, decreasing performance. · D. It only impacts I/O performance, not overall system performance.</p>
<p class="dap-an">✅ <strong>B</strong> — the bank's key (also FE10#49). Memory virtualization lets one machine's RAM be shared, over-committed and reclaimed (ballooning, page sharing) among many VMs: better allocation.</p>
<ul><li>A and C are not absurd — translating guest addresses twice does cost time, which is why nested page tables exist — so the question is vague. The bank wants the positive, textbook-sounding statement; take B in the exam. D — wrong: memory virtualization is about memory, not I/O.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg7-1">N1.A</a>, slide 9.</p>
<h3>Q40 · Exam Room #20 — another name for the VMM</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q40.png" alt="Original question 40" loading="lazy" /></p></details>
<p><em>A VMM (Virtual Machine Monitor) creates the illusion of multiple (virtual) machines on the same physical hardware. What is VMM also known as?</em><br>A. Hypovisor · B. hypervisor · C. shell · D. console</p>
<p class="dap-an">✅ <strong>B.</strong> VMM = hypervisor. Type 1 runs on the bare hardware, type 2 on a host OS.</p>
<ul><li>A — a misspelling used as a distractor; it does not exist. C — the command interpreter. D — a terminal.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg7-1">N1.A</a>, slides 2–4.</p>
<h3>Q41 · Exam Room #21 — hypercalls</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q41.png" alt="Original question 41" loading="lazy" /></p></details>
<p><em>Paravirtualization takes a different approach by modifying the source code of the guest operating system instead rather than performing sensitive instructions. In this context, which of the following is true?</em><br>A. the paravirtualized guest executes system calls · B. the paravirtualized guest executes virtual calls · C. the paravirtualized guest executes hyper calls · D. the paravirtualized guest executes Hyper commands</p>
<p class="dap-an">✅ <strong>C.</strong> The modified guest kernel replaces each sensitive instruction with a <strong>hypercall</strong> — a call into the hypervisor, the way an application makes a system call into a kernel.</p>
<ul><li>A — system calls go from the guest's programs to the guest kernel. B, D — not real terms.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg7-1">N1.A</a>, slides 5–6.</p>
<h2>📌 The traps of this paper</h2>
<ul>
<li><strong>Q33 (#13): a wrong key.</strong> FCFS from 25 is 135; even the part after the first request (115) exceeds every option. Recompute once, choose 114, move on.</li>
<li><strong>Q47 (#27): "safe" asked with a Request matrix</strong> — run the detection algorithm, not the banker; nobody is stuck ⇒ "Yes, it's safe".</li>
<li><strong>Q48 (#28): Available is not given</strong> — Total − column sums of Allocation = (3 3 2). And check every option; do not compare with "your" order.</li>
<li><strong>Q42 (#22): the formula is not the system.</strong> 1 − pⁿ only rises; real utilization rises then falls (thrashing).</li>
<li><strong>Q46 (#26): a lowercase "not".</strong> Three options are true benefits.</li>
<li><strong>Q9: 2*n = n! for n = 3.</strong> Test formulas with n = 4.</li>
<li><strong>Q15: Limit is the length</strong> (16 KB), not the end address (28 KB).</li>
<li><strong>Q17: "0172327103" is ten references</strong>, and the first four loads count as faults.</li>
<li><strong>Q37, Q40: typos are not traps</strong> — "preemtable" = preemptable; "Hypovisor" does not exist.</li>
<li><strong>Q39 (#19): a vague "evaluate" question</strong> — the bank takes the positive statement (B).</li>
<li><strong>Q25 (#5): "useless" versus "harmful"</strong> — A is true but answers a different question than C.</li>
</ul>`,
    `<h2>Chương 7 — Ảo hoá (3 câu)</h2>
<h3>Câu 39 · Phòng thi #19 — ảo hoá bộ nhớ (gây tranh cãi)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q39.png" alt="Ảnh đề gốc câu 39" loading="lazy" /></p></details>
<p>🇬🇧 <em>Evaluate the role of memory virtualization in optimizing resource allocation in a virtualized environment. How does this technique impact overall system performance?</em><br>A. It effectively isolates processes from one another, which can lead to a reduction in overall system performance due to the additional resources required for maintaining this isolation. · B. It enhances resource allocation efficiency, improving system performance. · C. It complicates memory management, decreasing performance. · D. It only impacts I/O performance, not overall system performance.</p>
<p>🇻🇳 Đánh giá vai trò của ảo hoá bộ nhớ trong tối ưu cấp phát tài nguyên ở môi trường ảo hoá. Kỹ thuật này ảnh hưởng thế nào tới hiệu năng chung? A. Cô lập tốt các tiến trình nhưng có thể làm giảm hiệu năng vì tốn thêm tài nguyên để duy trì cô lập · B. Tăng hiệu quả cấp phát tài nguyên, cải thiện hiệu năng · C. Làm quản lý bộ nhớ phức tạp, giảm hiệu năng · D. Chỉ ảnh hưởng hiệu năng I/O.</p>
<p>📚 <strong>evaluate</strong> = đánh giá · <strong>enhance</strong> = nâng cao · <strong>isolate</strong> = cô lập.</p>
<p class="dap-an">✅ <strong>B</strong> — khoá ngân hàng (cũng là FE10#49). Ảo hoá bộ nhớ cho phép RAM của một máy được chia, cấp vượt (over-commit) và thu hồi (ballooning, chia sẻ trang) giữa nhiều VM: cấp phát tốt hơn.</p>
<ul><li>A và C không vô lý — dịch địa chỉ của guest hai lần có tốn thời gian, nên mới có bảng trang lồng nhau (nested page tables) — vì vậy câu này mơ hồ. Ngân hàng muốn phát biểu tích cực, giống giọng sách; khi thi chọn B. D — sai: ảo hoá bộ nhớ là chuyện bộ nhớ, không phải I/O.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg7-1">N1.A</a>, slide 9.</p>
<h3>Câu 40 · Phòng thi #20 — tên khác của VMM</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q40.png" alt="Ảnh đề gốc câu 40" loading="lazy" /></p></details>
<p>🇬🇧 <em>A VMM (Virtual Machine Monitor) creates the illusion of multiple (virtual) machines on the same physical hardware. What is VMM also known as?</em><br>A. Hypovisor · B. hypervisor · C. shell · D. console</p>
<p>🇻🇳 VMM (trình giám sát máy ảo) tạo ảo giác có nhiều máy (ảo) trên cùng phần cứng vật lý. VMM còn gọi là gì?</p>
<p>📚 <strong>illusion</strong> = ảo giác · <strong>hypervisor</strong> = trình ảo hoá · <strong>also known as</strong> = còn gọi là.</p>
<p class="dap-an">✅ <strong>B.</strong> VMM = hypervisor. Loại 1 chạy thẳng trên phần cứng, loại 2 chạy trên một HĐH chủ.</p>
<ul><li>A — lỗi chính tả dùng làm phương án nhiễu, không tồn tại. C — trình thông dịch lệnh. D — thiết bị đầu cuối.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg7-1">N1.A</a>, slide 2–4.</p>
<h3>Câu 41 · Phòng thi #21 — hypercall</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D1/q41.png" alt="Ảnh đề gốc câu 41" loading="lazy" /></p></details>
<p>🇬🇧 <em>Paravirtualization takes a different approach by modifying the source code of the guest operating system instead rather than performing sensitive instructions. In this context, which of the following is true?</em><br>A. the paravirtualized guest executes system calls · B. the paravirtualized guest executes virtual calls · C. the paravirtualized guest executes hyper calls · D. the paravirtualized guest executes Hyper commands</p>
<p>🇻🇳 Ảo hoá song song (paravirtualization) đi hướng khác: sửa mã nguồn HĐH khách thay vì để nó chạy lệnh nhạy cảm. Trong bối cảnh đó, phát biểu nào đúng?</p>
<p>📚 <strong>paravirtualization</strong> = ảo hoá song song (HĐH khách được sửa để "biết" mình chạy trên hypervisor) · <strong>sensitive instruction</strong> = lệnh nhạy cảm · <strong>guest</strong> = khách.</p>
<p class="dap-an">✅ <strong>C.</strong> Nhân khách đã sửa thay mỗi lệnh nhạy cảm bằng một <strong>hypercall</strong> — lời gọi vào hypervisor, giống như ứng dụng gọi system call vào nhân.</p>
<ul><li>A — system call đi từ chương trình của khách vào nhân khách. B, D — không phải thuật ngữ có thật.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg7-1">N1.A</a>, slide 5–6.</p>
<h2>📌 Các bẫy của đề này</h2>
<ul>
<li><strong>Câu 33 (#13): khoá sai.</strong> FCFS từ 25 là 135; riêng phần sau yêu cầu đầu tiên (115) đã lớn hơn mọi phương án. Tính lại một lần, chọn 114, đi tiếp.</li>
<li><strong>Câu 47 (#27): hỏi "an toàn" nhưng cho ma trận Request</strong> — chạy thuật toán phát hiện bế tắc, không phải nhà băng; không ai kẹt ⇒ "Yes, it's safe".</li>
<li><strong>Câu 48 (#28): đề không cho Available</strong> — Tổng − tổng cột Allocation = (3 3 2). Và chấm từng phương án; đừng so với thứ tự "của mình".</li>
<li><strong>Câu 42 (#22): công thức không phải hệ thống.</strong> 1 − pⁿ chỉ tăng; hiệu suất thật tăng rồi giảm (thrashing).</li>
<li><strong>Câu 46 (#26): chữ "not" viết thường.</strong> Ba phương án là lợi ích thật.</li>
<li><strong>Câu 9: 2*n = n! khi n = 3.</strong> Thử công thức với n = 4.</li>
<li><strong>Câu 15: Limit là độ dài</strong> (16 KB), không phải địa chỉ cuối (28 KB).</li>
<li><strong>Câu 17: "0172327103" là mười tham chiếu</strong>, và bốn lần nạp đầu vẫn tính là lỗi trang.</li>
<li><strong>Câu 37, 40: lỗi gõ không phải bẫy</strong> — "preemtable" = preemptable; "Hypovisor" không tồn tại.</li>
<li><strong>Câu 39 (#19): câu "evaluate" mơ hồ</strong> — ngân hàng lấy phát biểu tích cực (B).</li>
<li><strong>Câu 25 (#5): "vô ích" khác "có hại"</strong> — A đúng nhưng trả lời một câu hỏi khác với C.</li>
</ul>`),
  ].join('\n'),
};

/* ───────── 🎯 FE2 (SP26-RE) solved — all 50 questions: translation, vocabulary, every option explained ───────── */
const L_x_chua_fe2 = {
  title: '🎯 FE2 (SP26-RE) solved — all 50 questions: translation, vocabulary, every option explained|||🎯 Chữa trọn đề FE2 (SP26-RE) — 50 câu: dịch, từ vựng, giải thích từng phương án',
  slug: 'osg202-chua-fe2',
  type: 'VIDEO',
  description: 'Chữa trọn đề thi cuối kỳ FE2 trong Phòng thi — kỳ SP26 thi lại — đủ 50 câu, chia theo chương: mỗi câu có ảnh đề gốc, đề tiếng Anh nguyên văn, bản dịch, từ vựng khó, đáp án kèm lý do và vì sao từng phương án kia sai, link tới bài học; bốn câu tính toán (thông lượng file server một luồng, bảng đoạn, phát hiện bế tắc, nhà băng một loại tài nguyên) tính lại bằng mô phỏng, câu /etc/passwd chạy thật trong container Linux — và nói thẳng năm câu có khoá ngân hàng sai, lỗi thời hoặc gây tranh cãi.',
  content: [
    bi(`<span class="eyebrow">🎯 Final Exam · FE2 = SP26-RE (spring 2026, retake) · full walkthrough</span>
<h2>Before you read: do the paper first</h2>
<p class="lead">Open <a href="/exam?course=OSG202">the Exam Room</a>, take <strong>FE2</strong> with the 60-minute timer, and only then come back. A walkthrough read before trying is forgotten in a day; one read after your own mistakes is remembered.</p>
<p>Unlike FE1, the Exam Room has <strong>all 50 questions</strong> of the real SP26-RE paper, in the original order, each with its scanned image — so <em>Q12</em> below is question 12 both on paper and in the Exam Room. Seven questions already appeared in FE1; they are solved again in full here, with a link to the FE1 walkthrough.</p>
<h3>The paper in numbers</h3>
<table>
<thead><tr><th>Chapter</th><th>Questions of this paper</th><th>Count</th><th>Computed</th></tr></thead>
<tbody>
<tr><td>Ch.1 Introduction</td><td>1, 2, 41, 42, 43, 44</td><td>6</td><td>—</td></tr>
<tr><td>Ch.2 Processes and threads</td><td>3, 4, 5, 6, 7, 8, 9, 10, 15, 19</td><td>10</td><td>3</td></tr>
<tr><td>Ch.3 Memory management</td><td>11, 12, 13, 14, 16, 17, 18, 45</td><td>8</td><td>45</td></tr>
<tr><td>Ch.4 File systems</td><td>20, 22, 23, 24, 25, 26, 27, 33</td><td>8</td><td>—</td></tr>
<tr><td>Ch.5 Input/output</td><td>21, 28, 29, 30, 31, 32, 34, 35</td><td>8</td><td>—</td></tr>
<tr><td>Ch.6 Deadlocks</td><td>36, 37, 38, 39, 46, 47, 48, 49, 50</td><td>9</td><td>46, 48</td></tr>
<tr><td>Ch.9–10 Security, Linux</td><td>40</td><td>1</td><td>(run for real)</td></tr>
<tr><td>Total</td><td></td><td>50</td><td>4</td></tr>
</tbody>
</table>
<ul>
<li>Chapters 1–6 are 49 of 50 questions; there is no virtualization question at all, and the only "Linux" question (/etc/passwd) is a security-file format you can check on any Linux machine.</li>
<li><strong>4 computed questions</strong> (3, 45, 46, 48); each answer below was produced by the course simulator and every option was checked against it. Q40 was run for real in the course's Linux container.</li>
<li><strong>Five bank keys need care.</strong> Wrong: Q29 (no option describes a spindle) and Q34 (the book says RAID 0, the key says 3). Out of date: Q43 (Win32 has had hard links since Windows XP). Debatable: Q19 (other papers key another option) and Q37 (three options are true). Q3 has no exact option: the true answer is 27.03 requests per second and the key is the nearest one, 28. Each case says what to choose in the exam.</li>
<li>The paper repeats itself: Q30 and Q35 both ask for "seek time"; Q32 is FE1's Q31 word for word.</li>
</ul>`,
    `<span class="eyebrow">🎯 Thi cuối kỳ · FE2 = SP26-RE (xuân 2026, thi lại) · chữa trọn đề</span>
<h2>Trước khi đọc: làm đề trước đã</h2>
<p class="lead">Mở <a href="/exam?course=OSG202">Phòng thi</a>, làm <strong>FE2</strong> với đồng hồ 60 phút, rồi mới quay lại đây. Bài chữa đọc trước khi tự làm thì một ngày là quên; đọc sau khi đã tự sai thì nhớ lâu.</p>
<p>Khác FE1, Phòng thi có <strong>đủ 50 câu</strong> của đề SP26-RE thật, đúng thứ tự gốc, câu nào cũng kèm ảnh đề — nên <em>Câu 12</em> dưới đây là câu 12 cả trên giấy lẫn trong Phòng thi. Bảy câu đã từng có trong FE1; ở đây vẫn giải đủ, kèm link sang bài chữa FE1.</p>
<h3>Đề này qua các con số</h3>
<table>
<thead><tr><th>Chương</th><th>Các câu của đề</th><th>Số câu</th><th>Câu tính</th></tr></thead>
<tbody>
<tr><td>Ch.1 Nhập môn</td><td>1, 2, 41, 42, 43, 44</td><td>6</td><td>—</td></tr>
<tr><td>Ch.2 Tiến trình và luồng</td><td>3, 4, 5, 6, 7, 8, 9, 10, 15, 19</td><td>10</td><td>3</td></tr>
<tr><td>Ch.3 Quản lý bộ nhớ</td><td>11, 12, 13, 14, 16, 17, 18, 45</td><td>8</td><td>45</td></tr>
<tr><td>Ch.4 Hệ thống tệp</td><td>20, 22, 23, 24, 25, 26, 27, 33</td><td>8</td><td>—</td></tr>
<tr><td>Ch.5 Vào/ra</td><td>21, 28, 29, 30, 31, 32, 34, 35</td><td>8</td><td>—</td></tr>
<tr><td>Ch.6 Bế tắc</td><td>36, 37, 38, 39, 46, 47, 48, 49, 50</td><td>9</td><td>46, 48</td></tr>
<tr><td>Ch.9–10 Bảo mật, Linux</td><td>40</td><td>1</td><td>(chạy thật)</td></tr>
<tr><td>Tổng</td><td></td><td>50</td><td>4</td></tr>
</tbody>
</table>
<ul>
<li>Chương 1–6 chiếm 49 trên 50 câu; đề không có câu ảo hoá nào, và câu "Linux" duy nhất (/etc/passwd) là định dạng một tệp bảo mật mà máy Linux nào cũng kiểm được.</li>
<li><strong>4 câu tính toán</strong> (3, 45, 46, 48); mỗi đáp án dưới đây do bộ mô phỏng của môn tính ra và mọi phương án đều được chấm lại theo đó. Câu 40 được chạy thật trong container Linux của môn.</li>
<li><strong>Năm khoá ngân hàng cần cẩn thận.</strong> Sai: câu 29 (không phương án nào tả đúng trục quay) và câu 34 (sách nói RAID 0, khoá ghi 3). Lỗi thời: câu 43 (Win32 có liên kết cứng từ Windows XP). Gây tranh cãi: câu 19 (đề khác khoá phương án khác) và câu 37 (ba phương án đều đúng). Câu 3 không có phương án đúng tuyệt đối: đáp số thật là 27,03 yêu cầu/giây, khoá là phương án gần nhất, 28. Câu nào cũng ghi rõ khi thi chọn gì.</li>
<li>Đề tự lặp: câu 30 và câu 35 cùng hỏi "seek time"; câu 32 chính là câu 31 của FE1, không sai một chữ.</li>
</ul>`),
    bi(`<h2>Chapter 1 — Introduction (6 questions)</h2>
<h3>Q1 — a true statement about Windows</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q1.png" alt="Original question 1" loading="lazy" /></p></details>
<p><em>Select the correct statement from the following options.</em><br>A. Mouse is unique tool to interface between user and computer · B. Windows operating system does not provide a work in network environment · C. The Windows operating system is viewed as an object that performs tasks. · D. The Windows operating system has a graphical interface.</p>
<p class="dap-an">✅ <strong>D.</strong> Windows has a graphical user interface (GUI); in the book's picture of a computer (Fig. 1-1) the GUI is a user-mode program that sits on top of the OS, next to the shell.</p>
<ul><li>A — "unique" = the only one: the keyboard, touch screen and voice are interfaces too. B — Windows has had a network stack (TCP/IP, file sharing) since the 1990s. C — a vague, made-up sentence: the OS <em>manages</em> objects (Windows' object manager, 11.A) but is not "viewed as an object".</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slides 2–3; Windows history in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg11-1">11.A</a>, slide 2.</p>
<h3>Q2 — the shift that made time-sharing (= FE1 Q2)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q2.png" alt="Original question 2" loading="lazy" /></p></details>
<p><em>In the evolution of operating systems, which fundamental shift was the most critical in enabling modern multitasking and time-sharing capabilities?</em><br>A. The introduction of graphical user interfaces (GUIs) in the 1980s · B. The transition from batch processing to interactive computing in the 1960s · C. The development of single-user operating systems for personal computers in the 1970s · D. The adoption of cloud-based virtualization in the 2000s</p>
<p class="dap-an">✅ <strong>B.</strong> Third generation (1965–1980): multiprogramming, then time-sharing (CTSS, MULTICS) — many users at terminals, each getting quick turns of the CPU. That is the move from batch to interactive. Word for word the same as Q2 of the <a href="/courses/operating-systems/learn?lessonSlug=osg202-chua-fe1">FE1 walkthrough</a>.</p>
<ul><li>A — GUIs came after time-sharing existed. C — single-user PCs went the other way (one user). D — the cloud is 40 years later.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slides 6–10.</p>
<h3>Q41 — NOT a core function</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q41.png" alt="Original question 41" loading="lazy" /></p></details>
<p><em>Which of the following is NOT a core function of an operating system?</em><br>A. Process management · B. Memory management · C. File management · D. Internet browsing · E. I/O management</p>
<p class="dap-an">✅ <strong>D.</strong> A browser is an application that runs <em>on</em> the OS. The other four are exactly the chapters of the course: processes (Ch. 2), memory (Ch. 3), files (Ch. 4), I/O (Ch. 5) — the resources the OS manages.</p>
<ul><li>A, B, C, E — all core functions; read the capital NOT.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slides 4–5.</p>
<h3>Q42 — cache hit (= FE1 Q43)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q42.png" alt="Original question 42" loading="lazy" /></p></details>
<p><em>What is a cache hit in CPU cache memory?</em><br>A. When the requested data is found in the cache, avoiding access to main memory. · B. When the CPU fails to locate data in the cache and retrieves it from RAM. · C. When a new cache line is added to the cache memory and collides with previously stored data · D. When all cache levels are fully utilized by the CPU</p>
<p class="dap-an">✅ <strong>A.</strong> Hit = found in the cache, so the slower RAM access is skipped. Same as FE1 Q43.</p>
<ul><li>B is the definition of a <em>miss</em>. C describes a conflict on insertion (an eviction), not a hit. D is a made-up "full cache" state.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slides 13–14.</p>
<h3>Q43 — link in Win32 (the key is out of date)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q43.png" alt="Original question 43" loading="lazy" /></p></details>
<p><em>Which of the following file system operations is NOT supported in Win32 but exists in UNIX?</em><br>A. rename · B. mkdir · C. link · D. rmdir</p>
<p class="dap-an">✅ <strong>C — link</strong>, because the question is the book's Figure 1-23 (UNIX system calls next to their Win32 equivalents): the row <code>link</code> has "(none)" in the Win32 column. Choose C in the exam.</p>
<div class="callout"><p><strong>Out of date, but not to be "fixed" in the exam.</strong> Win32 has had <code>CreateHardLink</code> since Windows 2000/XP and <code>CreateSymbolicLink</code> since Vista (Microsoft Learn), and NTFS stores hard links natively. The book's table describes the original Win32 API; the bank keeps its answer.</p></div>
<ul><li>A — <code>rename</code> ↔ <code>MoveFile</code>. B — <code>mkdir</code> ↔ <code>CreateDirectory</code>. D — <code>rmdir</code> ↔ <code>RemoveDirectory</code>. All three have a Win32 equivalent in the same table.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slides 36–37 (with the "out of date" note).</p>
<h3>Q44 — monolithic structure (= FE1 Q45)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q44.png" alt="Original question 44" loading="lazy" /></p></details>
<p><em>Which of the following best describes a monolithic operating system structure?</em><br>A. A system where all functionalities are divided into separate processes. · B. A system where only file management is in the kernel. · C. A system where all components run in supervisor mode. · D. A system where drivers are executed in user space.</p>
<p class="dap-an">✅ <strong>C.</strong> Monolithic = the whole OS is one program running in kernel (supervisor) mode; any procedure can call any other. Same as FE1 Q45.</p>
<ul><li>A — separate processes is the client-server / microkernel idea. B — no such design. D — user-space drivers are a microkernel feature (MINIX 3).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slides 38–41.</p>`,
    `<h2>Chương 1 — Nhập môn (6 câu)</h2>
<h3>Câu 1 — phát biểu đúng về Windows</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q1.png" alt="Ảnh đề gốc câu 1" loading="lazy" /></p></details>
<p>🇬🇧 <em>Select the correct statement from the following options.</em><br>A. Mouse is unique tool to interface between user and computer · B. Windows operating system does not provide a work in network environment · C. The Windows operating system is viewed as an object that performs tasks. · D. The Windows operating system has a graphical interface.</p>
<p>🇻🇳 Chọn phát biểu đúng. A. Chuột là công cụ duy nhất để giao tiếp giữa người và máy · B. Windows không hỗ trợ làm việc trong môi trường mạng · C. Windows được xem như một đối tượng thực hiện các tác vụ · D. Windows có giao diện đồ hoạ.</p>
<p>📚 <strong>unique</strong> = duy nhất · <strong>interface</strong> = giao diện, giao tiếp · <strong>graphical interface</strong> = giao diện đồ hoạ.</p>
<p class="dap-an">✅ <strong>D.</strong> Windows có giao diện đồ hoạ (GUI); trong hình máy tính của sách (Hình 1-1), GUI là một chương trình chế độ người dùng nằm trên HĐH, cạnh shell.</p>
<ul><li>A — "unique" = duy nhất: bàn phím, màn hình cảm ứng, giọng nói cũng là giao diện. B — Windows có ngăn xếp mạng (TCP/IP, chia sẻ tệp) từ thập niên 1990. C — câu mơ hồ bịa ra: HĐH <em>quản lý</em> các đối tượng (trình quản lý đối tượng của Windows, 11.A) chứ không "được xem như một đối tượng".</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 2–3; lịch sử Windows ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg11-1">11.A</a>, slide 2.</p>
<h3>Câu 2 — bước ngoặt sinh ra chia sẻ thời gian (= câu 2 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q2.png" alt="Ảnh đề gốc câu 2" loading="lazy" /></p></details>
<p>🇬🇧 <em>In the evolution of operating systems, which fundamental shift was the most critical in enabling modern multitasking and time-sharing capabilities?</em><br>A. The introduction of graphical user interfaces (GUIs) in the 1980s · B. The transition from batch processing to interactive computing in the 1960s · C. The development of single-user operating systems for personal computers in the 1970s · D. The adoption of cloud-based virtualization in the 2000s</p>
<p>🇻🇳 Trong quá trình phát triển của HĐH, bước chuyển nền tảng nào quan trọng nhất để có đa nhiệm và chia sẻ thời gian hiện đại? A. Giao diện đồ hoạ thập niên 1980 · B. Chuyển từ xử lý theo lô sang tương tác thập niên 1960 · C. HĐH một người dùng cho máy tính cá nhân thập niên 1970 · D. Ảo hoá trên đám mây thập niên 2000.</p>
<p>📚 <strong>evolution</strong> = quá trình phát triển · <strong>batch processing</strong> = xử lý theo lô · <strong>time-sharing</strong> = chia sẻ thời gian · <strong>interactive</strong> = tương tác.</p>
<p class="dap-an">✅ <strong>B.</strong> Thế hệ thứ ba (1965–1980): đa chương trình, rồi chia sẻ thời gian (CTSS, MULTICS) — nhiều người ngồi ở terminal, mỗi người nhận những lượt CPU ngắn. Đó chính là bước từ lô sang tương tác. Giống hệt câu 2 của <a href="/courses/operating-systems/learn?lessonSlug=osg202-chua-fe1">bài chữa FE1</a>.</p>
<ul><li>A — GUI ra đời khi chia sẻ thời gian đã có từ lâu. C — PC một người dùng đi theo hướng ngược lại. D — đám mây muộn hơn 40 năm.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 6–10.</p>
<h3>Câu 41 — KHÔNG phải chức năng cốt lõi</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q41.png" alt="Ảnh đề gốc câu 41" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which of the following is NOT a core function of an operating system?</em><br>A. Process management · B. Memory management · C. File management · D. Internet browsing · E. I/O management</p>
<p>🇻🇳 Đâu KHÔNG phải chức năng cốt lõi của HĐH? A. Quản lý tiến trình · B. Quản lý bộ nhớ · C. Quản lý tệp · D. Duyệt web · E. Quản lý vào/ra.</p>
<p>📚 <strong>core function</strong> = chức năng cốt lõi · <strong>browsing</strong> = duyệt (web).</p>
<p class="dap-an">✅ <strong>D.</strong> Trình duyệt là một ứng dụng chạy <em>trên</em> HĐH. Bốn mục còn lại chính là các chương của môn: tiến trình (Ch. 2), bộ nhớ (Ch. 3), tệp (Ch. 4), vào/ra (Ch. 5) — những tài nguyên HĐH quản lý.</p>
<ul><li>A, B, C, E — đều là chức năng cốt lõi; để ý chữ NOT viết hoa.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 4–5.</p>
<h3>Câu 42 — cache hit (= câu 43 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q42.png" alt="Ảnh đề gốc câu 42" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is a cache hit in CPU cache memory?</em><br>A. When the requested data is found in the cache, avoiding access to main memory. · B. When the CPU fails to locate data in the cache and retrieves it from RAM. · C. When a new cache line is added to the cache memory and collides with previously stored data · D. When all cache levels are fully utilized by the CPU</p>
<p>🇻🇳 "Cache hit" (trúng bộ đệm) trong bộ nhớ đệm CPU là gì? A. Dữ liệu cần tìm có sẵn trong cache, khỏi truy cập bộ nhớ chính · B. CPU không tìm thấy trong cache và lấy từ RAM · C. Một dòng cache mới được thêm và va chạm với dữ liệu cũ · D. Mọi tầng cache đều bị CPU dùng hết.</p>
<p>📚 <strong>hit / miss</strong> = trúng / trượt · <strong>cache line</strong> = dòng cache (đơn vị chép giữa RAM và cache, thường 64 byte) · <strong>retrieve</strong> = lấy về.</p>
<p class="dap-an">✅ <strong>A.</strong> Trúng = tìm thấy trong cache, nên bỏ qua được lần truy cập RAM chậm hơn. Giống câu 43 FE1.</p>
<ul><li>B là định nghĩa của <em>miss</em> (trượt). C tả xung đột khi chèn (đẩy dòng cũ ra), không phải trúng. D là trạng thái "cache đầy" bịa ra.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 13–14.</p>
<h3>Câu 43 — link trong Win32 (khoá đã lỗi thời)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q43.png" alt="Ảnh đề gốc câu 43" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which of the following file system operations is NOT supported in Win32 but exists in UNIX?</em><br>A. rename · B. mkdir · C. link · D. rmdir</p>
<p>🇻🇳 Thao tác hệ thống tệp nào KHÔNG được Win32 hỗ trợ nhưng có trong UNIX?</p>
<p>📚 <strong>supported</strong> = được hỗ trợ · <strong>link</strong> = liên kết (thêm một tên nữa cho cùng một tệp) · <strong>Win32</strong> = API lập trình của Windows.</p>
<p class="dap-an">✅ <strong>C — link</strong>, vì câu hỏi lấy từ Hình 1-23 của sách (lời gọi hệ thống UNIX đặt cạnh lời gọi Win32 tương ứng): hàng <code>link</code> ghi "(none)" ở cột Win32. Khi thi chọn C.</p>
<div class="callout"><p><strong>Lỗi thời, nhưng đừng "sửa" lúc đi thi.</strong> Win32 có <code>CreateHardLink</code> từ Windows 2000/XP và <code>CreateSymbolicLink</code> từ Vista (Microsoft Learn), NTFS lưu liên kết cứng ngay trong cấu trúc của nó. Bảng của sách tả Win32 nguyên thuỷ; ngân hàng giữ đáp án đó.</p></div>
<ul><li>A — <code>rename</code> ↔ <code>MoveFile</code>. B — <code>mkdir</code> ↔ <code>CreateDirectory</code>. D — <code>rmdir</code> ↔ <code>RemoveDirectory</code>. Cả ba đều có hàm Win32 tương ứng trong cùng bảng.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slide 36–37 (có ghi chú "lỗi thời").</p>
<h3>Câu 44 — cấu trúc nguyên khối (= câu 45 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q44.png" alt="Ảnh đề gốc câu 44" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which of the following best describes a monolithic operating system structure?</em><br>A. A system where all functionalities are divided into separate processes. · B. A system where only file management is in the kernel. · C. A system where all components run in supervisor mode. · D. A system where drivers are executed in user space.</p>
<p>🇻🇳 Phát biểu nào mô tả đúng nhất cấu trúc HĐH nguyên khối? A. Mọi chức năng tách thành các tiến trình riêng · B. Chỉ quản lý tệp nằm trong nhân · C. Mọi thành phần chạy ở chế độ giám sát (kernel mode) · D. Driver chạy trong không gian người dùng.</p>
<p>📚 <strong>monolithic</strong> = nguyên khối · <strong>supervisor mode</strong> = chế độ giám sát = kernel mode · <strong>user space</strong> = không gian người dùng.</p>
<p class="dap-an">✅ <strong>C.</strong> Nguyên khối = cả HĐH là một chương trình duy nhất chạy ở kernel mode; thủ tục nào cũng gọi được thủ tục khác. Giống câu 45 FE1.</p>
<ul><li>A — tách thành tiến trình riêng là ý tưởng client-server / vi nhân (microkernel). B — không có kiểu nào như vậy. D — driver chạy ở user space là đặc điểm của vi nhân (MINIX 3).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slide 38–41.</p>`),
    bi(`<h2>Chapter 2 — Processes and threads (10 questions)</h2>
<h3>Q3 — a single-threaded file server (computed — no option is exact)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q3.png" alt="Original question 3" loading="lazy" /></p></details>
<p><em>A computer is reading a file using single-threaded file server. It takes 12ms to get a request for work, dispatch and do the rest of the necessary processing. If disk operation is additionally required 75ms which is one-third of the total time. How many requests per second can the server can handle?</em><br>A. 30 · B. 37 · C. 35 · D. 28</p>
<p>The question is a garbled copy of a problem at the end of Chapter 2 of the book: every request costs 12 ms of processing; <strong>one request in three</strong> ("one-third of the time") also needs the disk, which adds 75 ms — and with a single thread, the server sleeps with it and serves nobody meanwhile.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/94415d2b38e30459e7fda880c5dfe8a326a30074.svg" alt="Average time per request, then requests per second — and how far each option is from it" loading="lazy" /><p class="chu-thich">🧮 Average time per request, then requests per second — and how far each option is from it</p></div>
<table>
<thead><tr><th>Request</th><th>Share</th><th>Time</th></tr></thead>
<tbody>
<tr><td>block in the cache</td><td>2/3</td><td>12 ms</td></tr>
<tr><td>needs the disk</td><td>1/3</td><td>12 + 75 = 87 ms</td></tr>
<tr><td><strong>Average</strong></td><td></td><td><strong>2/3 × 12 + 1/3 × 87 = 37 ms</strong></td></tr>
<tr><td><strong>Single-threaded</strong></td><td></td><td><strong>1000 / 37 = 27.03 requests/s</strong></td></tr>
<tr><td>Multithreaded</td><td></td><td>1000 / 12 = 83.33 requests/s</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p3: server một luồng — yêu cầu nào cũng tốn 12 ms CPU; 1/3 số yêu cầu (trượt cache khối) chờ thêm 75 ms đĩa, luồng duy nhất ngủ
//     theo ⇒ không phục vụ ai trong lúc đó. Xét một chu kỳ 3 yêu cầu (trúng, trúng, trượt) rồi chia.
const P3 = { cpu: 12, dia: 75, tiLeDia: [1, 3], phuongAn: [30, 37, 35, 28] };
function tinhP3() {
  const [a, b] = P3.tiLeDia;                                   // a trên b yêu cầu cần đĩa
  const chuKy = b * P3.cpu + a * P3.dia;                       // ms cho b yêu cầu, xử lý NỐI ĐUÔI
  const tb = chuKy / b;                                        // ms trung bình mỗi yêu cầu
  const motLuong = 1000 / tb;                                  // yêu cầu / giây, một luồng
  const nhieuLuong = 1000 / P3.cpu;                            // nhiều luồng: CPU không đứng chờ đĩa
  return { chuKy, tb, motLuong, nhieuLuong };
}
// p45: bảng đoạn — dữ liệu chép từ đề
const DOAN = [{ coSo: 219, gioiHan: 600 }, { coSo: 2300, gioiHan: 14 }, { coSo: 90, gioiHan: 100 }, { coSo: 1327, gioiHan: 580 }, { coSo: 1952, gioiHan: 96 }];
const tinhP45 = () =&gt; dichDoan(2, 50, DOAN);
// p46: Allocated (C) / Requested (R), Available — dùng đúng phép kiểm của nhà băng với "cần thêm" = Requested
const C46 = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R46 = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A46 = [2, 1, 0, 1];
const PA46 = [[2, 1, 0], [1, 0, 2], [0, 1, 2], [1, 2, 0]];      // phương án A–D (chỉ số 0 = P1)
const kiem46 = (chuoi) =&gt; kiemChuoi({ conLai: A46, giuLai: C46, canThem: R46, chuoi });
// p48: một loại tài nguyên (MOS 4e Hình 6-9) — tổng 15, đã cấp 3 + 4 + 3 = 10 ⇒ trống 5 (khớp số đề cho)
const HAS48 = [3, 4, 3], MAX48 = [8, 6, 5], TONG48 = 15, FREE48 = 5;</code></pre></details>
<p class="dap-an">✅ <strong>D — 28</strong>, the bank's key — but read why. The exact answer is 1000 / 37 = <strong>27.03 requests per second</strong>. No option is 27; 28 is the closest by far (0.97 away, the next is 30 at 2.97). In the exam: compute 37 ms, divide, choose D.</p>
<ul><li>A — 30 comes from 1000 / 33, i.e. 2/3 × 12 + 1/3 × 75: it forgets that a disk request <em>also</em> needs its 12 ms of processing (87 ms, not 75). B — 37 is the average <em>time</em> in ms, a trap for whoever stops one step early. C — no reading of the question gives 35.</li></ul>
<p class="meo">🧠 The book asks the second half too: with many threads, a worker that waits for the disk sleeps while another one uses the CPU, so the CPU is the only limit: 1000 / 12 ≈ 83 requests per second — three times better. That is the whole argument for threads in Fig. 2-8 to 2-10.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slides 13–16 (why threads: the web server and the three ways to build a server).</p>
<h3>Q4 — what the PCB does NOT store</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q4.png" alt="Original question 4" loading="lazy" /></p></details>
<p><em>The Process Control Block (PCB) does NOT store which of the following?</em><br>A. Process state · B. CPU registers · C. I/O status · D. Scheduling information · E. Source code</p>
<p class="dap-an">✅ <strong>E — source code.</strong> The PCB (one entry of the process table, Fig. 2-4) holds what the OS needs to stop and resume a process: state, saved registers and PC, priority and scheduling parameters, memory pointers, open files. The program itself — and certainly not its <em>source</em> code — lives in the process's memory; the PCB only points to the text segment.</p>
<ul><li>A, B, C, D — all four are fields of Fig. 2-4 (I/O status = open files, pending I/O).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slides 10–11.</p>
<h3>Q5 — turnaround time</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q5.png" alt="Original question 5" loading="lazy" /></p></details>
<p><em>The interval from the time of submission of a process to the time of completion is termed as</em><br>A. waiting time · B. turnaround time · C. response time · D. throughput</p>
<p class="dap-an">✅ <strong>B.</strong> Turnaround = completion − submission (everything: waiting, running, doing I/O).</p>
<ul><li>A — waiting time counts only the time spent in the ready queue. C — response time ends at the <em>first</em> response, not at completion. D — throughput is a rate (jobs per hour), not an interval.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 58.</p>
<h3>Q6 — the parent process</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q6.png" alt="Original question 6" loading="lazy" /></p></details>
<p><em>A process that creates another process is called the:</em><br>A. Child process · B. Root process · C. Parent process · D. Init process</p>
<p class="dap-an">✅ <strong>C.</strong> The creator is the parent, the created one the child; in UNIX they form a tree rooted at <code>init</code> (PID 1, today usually systemd).</p>
<ul><li>A — the one created. B — not a standard term. D — init is <em>one</em> particular parent (the ancestor of all), not the general name.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slides 5–6.</p>
<h3>Q7 — what threads share</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q7.png" alt="Original question 7" loading="lazy" /></p></details>
<p><em>Which of the following is shared among threads of the same process?</em><br>A. Stack memory and program counter for each thread · B. File descriptors, heap, and global variables · C. CPU registers and instruction pointer · D. Cache and clock speed of the CPU</p>
<p class="dap-an">✅ <strong>B.</strong> Fig. 2-12: per-process items (shared by all its threads) — address space (heap, globals), open files, child processes, signals; per-thread items — program counter, registers, stack, state.</p>
<ul><li>A, C — exactly the per-thread column: each thread has its own stack, PC and registers. D — hardware, not owned by a process.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slides 17–18.</p>
<h3>Q8 — the first step of a new process</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q8.png" alt="Original question 8" loading="lazy" /></p></details>
<p><em>Which of the following actions does the operating system take to execute a new process?</em><br>A. Provide immediate CPU for process. · B. Delivery the resources must be process. · C. Create immediate PCB blocks for process. · D. Provide immediate Register for process.</p>
<p class="dap-an">✅ <strong>C.</strong> To exist as a process, a program first needs an entry in the process table (its PCB): an ID, a state, room for its saved registers. Only then can it be put in the ready queue.</p>
<ul><li>A — a new process goes to the <em>ready</em> state; it gets the CPU when the scheduler picks it, not "immediately". B — broken English; resources are given over time, on request. D — registers are loaded only when the process is dispatched.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slides 5, 10.</p>
<h3>Q9 — real-time priority</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q9.png" alt="Original question 9" loading="lazy" /></p></details>
<p><em>In a real-time scheduling system, which type of process is given the highest priority?</em><br>A. Shortest processes · B. Processes with the highest computation time · C. Processes with the earliest deadlines · D. Background processes</p>
<p class="dap-an">✅ <strong>C.</strong> In real time, being late is a failure; earliest-deadline-first (EDF) runs the task whose deadline is closest.</p>
<ul><li>A — shortest first is SJF, a batch policy that minimises average turnaround, not missed deadlines. B — the opposite of any useful rule. D — background work has the lowest priority.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 64.</p>
<h3>Q10 — writer starvation</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q10.png" alt="Original question 10" loading="lazy" /></p></details>
<p><em>In the Classical IPC Problems, specifically the Readers-Writers problem, what condition may lead to writer starvation?</em><br>A. A continuous stream of incoming readers · B. A reader exits too early · C. The mutex semaphore remains locked · D. Too many writers writing at the same time</p>
<p class="dap-an">✅ <strong>A.</strong> In the book's solution (Fig. 2-48) a new reader is let in as long as at least one reader is inside. If readers keep arriving, the count never drops to zero and the writer waits forever.</p>
<ul><li>B — a reader leaving early <em>helps</em> the writer. C — a mutex locked forever would block everybody (a bug), not starve writers in particular. D — writers have exclusive access: two can never write at the same time.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slides 72–73.</p>
<h3>Q15 — Dijkstra, 1965</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q15.png" alt="Original question 15" loading="lazy" /></p></details>
<p><em>In 1965, Dijkstra posed and then solved a synchronization problem he called</em><br>A. the dining philosophers problem · B. the ostrich algorithm · C. the banker's algorithm · D. the allocation algorithm</p>
<p class="dap-an">✅ <strong>A.</strong> The stem is the first sentence of §2.5.1 of the book: five philosophers, five forks, each needs two forks to eat.</p>
<ul><li>C is the trap: the banker's algorithm is <em>also</em> Dijkstra's, also 1965 — but it is a deadlock-avoidance algorithm (Ch. 6), not a "synchronization problem he posed". B — "ignore the problem", Ch. 6. D — not a named algorithm.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 67.</p>
<h3>Q19 — process versus thread in Windows (the bank disagrees with itself)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q19.png" alt="Original question 19" loading="lazy" /></p></details>
<p><em>Which of the following best describes the difference between a process and a thread in the context of the Windows operating system?</em><br>A. A process contains multiple threads and shares resources, while a thread is an independent execution unit within a process. · B. A process is a program in execution, while a thread is a sequence of instructions that can execute independently. · C. A process and a thread are essentially the same in Windows OS, with no significant difference between them. · D. A process represents system resources, while a thread is responsible for user interface interactions in Windows OS.</p>
<p class="dap-an">✅ <strong>A</strong> on this paper (the bank's key for FE2) — and B is just as true.</p>
<div class="callout"><p><strong>The same question has two keys in the bank.</strong> FE2 keys A; FE4#22, FE7#24, FE12#22, FE13#22 and FE14#29 key B. Both are right: Windows treats a process as a <em>container</em> (address space, handles, security token) in which one or more threads run, and the thread is what the kernel schedules — that is A; Microsoft's own documentation opens with "a process, in the simplest terms, is an executing program", and a thread is the unit that gets CPU time — that is B. <strong>In the exam:</strong> nothing can make you sure; B is keyed in five papers out of six, so B is the safer bet when you meet this question elsewhere, while the FE2 page of the Exam Room marks A.</p></div>
<ul><li>C — false: a process owns resources, a thread runs code; a process may have many threads. D — threads are not "for the user interface"; every thread can run any code of its process.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slides 17–18; Windows in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg11-2">11.B</a>, slides 28, 34–35.</p>`,
    `<h2>Chương 2 — Tiến trình và luồng (10 câu)</h2>
<h3>Câu 3 — file server một luồng (câu tính — không phương án nào đúng tuyệt đối)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q3.png" alt="Ảnh đề gốc câu 3" loading="lazy" /></p></details>
<p>🇬🇧 <em>A computer is reading a file using single-threaded file server. It takes 12ms to get a request for work, dispatch and do the rest of the necessary processing. If disk operation is additionally required 75ms which is one-third of the total time. How many requests per second can the server can handle?</em><br>A. 30 · B. 37 · C. 35 · D. 28</p>
<p>🇻🇳 Một máy đọc tệp qua một file server <em>một luồng</em>. Nhận một yêu cầu, phân phát và làm phần xử lý còn lại tốn 12 ms. Nếu phải đọc đĩa thì tốn thêm 75 ms, chuyện này xảy ra một phần ba số lần. Server xử lý được bao nhiêu yêu cầu mỗi giây?</p>
<p>📚 <strong>single-threaded</strong> = một luồng · <strong>dispatch</strong> = phân phát (giao việc) · <strong>additionally</strong> = thêm vào · <strong>one-third</strong> = một phần ba · <strong>requests per second</strong> = số yêu cầu mỗi giây (thông lượng — throughput).</p>
<p>Câu này là bản chép méo của một bài tập cuối Chương 2 trong sách: yêu cầu nào cũng tốn 12 ms xử lý; <strong>một trên ba yêu cầu</strong> ("one-third of the time") phải đọc đĩa, thêm 75 ms — và vì chỉ có một luồng, server ngủ theo, không phục vụ ai trong lúc đó.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/0f240352226255522f6d1dcfbc45c9ec1d166cc3.svg" alt="Thời gian trung bình mỗi yêu cầu, rồi số yêu cầu mỗi giây — và mỗi phương án cách bao xa" loading="lazy" /><p class="chu-thich">🧮 Thời gian trung bình mỗi yêu cầu, rồi số yêu cầu mỗi giây — và mỗi phương án cách bao xa</p></div>
<table>
<thead><tr><th>Yêu cầu</th><th>Tỉ lệ</th><th>Thời gian</th></tr></thead>
<tbody>
<tr><td>khối có sẵn trong cache</td><td>2/3</td><td>12 ms</td></tr>
<tr><td>phải đọc đĩa</td><td>1/3</td><td>12 + 75 = 87 ms</td></tr>
<tr><td><strong>Trung bình</strong></td><td></td><td><strong>2/3 × 12 + 1/3 × 87 = 37 ms</strong></td></tr>
<tr><td><strong>Một luồng</strong></td><td></td><td><strong>1000 / 37 = 27.03 yêu cầu/giây</strong></td></tr>
<tr><td>Nhiều luồng</td><td></td><td>1000 / 12 = 83.33 yêu cầu/giây</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p3: server một luồng — yêu cầu nào cũng tốn 12 ms CPU; 1/3 số yêu cầu (trượt cache khối) chờ thêm 75 ms đĩa, luồng duy nhất ngủ
//     theo ⇒ không phục vụ ai trong lúc đó. Xét một chu kỳ 3 yêu cầu (trúng, trúng, trượt) rồi chia.
const P3 = { cpu: 12, dia: 75, tiLeDia: [1, 3], phuongAn: [30, 37, 35, 28] };
function tinhP3() {
  const [a, b] = P3.tiLeDia;                                   // a trên b yêu cầu cần đĩa
  const chuKy = b * P3.cpu + a * P3.dia;                       // ms cho b yêu cầu, xử lý NỐI ĐUÔI
  const tb = chuKy / b;                                        // ms trung bình mỗi yêu cầu
  const motLuong = 1000 / tb;                                  // yêu cầu / giây, một luồng
  const nhieuLuong = 1000 / P3.cpu;                            // nhiều luồng: CPU không đứng chờ đĩa
  return { chuKy, tb, motLuong, nhieuLuong };
}
// p45: bảng đoạn — dữ liệu chép từ đề
const DOAN = [{ coSo: 219, gioiHan: 600 }, { coSo: 2300, gioiHan: 14 }, { coSo: 90, gioiHan: 100 }, { coSo: 1327, gioiHan: 580 }, { coSo: 1952, gioiHan: 96 }];
const tinhP45 = () =&gt; dichDoan(2, 50, DOAN);
// p46: Allocated (C) / Requested (R), Available — dùng đúng phép kiểm của nhà băng với "cần thêm" = Requested
const C46 = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R46 = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A46 = [2, 1, 0, 1];
const PA46 = [[2, 1, 0], [1, 0, 2], [0, 1, 2], [1, 2, 0]];      // phương án A–D (chỉ số 0 = P1)
const kiem46 = (chuoi) =&gt; kiemChuoi({ conLai: A46, giuLai: C46, canThem: R46, chuoi });
// p48: một loại tài nguyên (MOS 4e Hình 6-9) — tổng 15, đã cấp 3 + 4 + 3 = 10 ⇒ trống 5 (khớp số đề cho)
const HAS48 = [3, 4, 3], MAX48 = [8, 6, 5], TONG48 = 15, FREE48 = 5;</code></pre></details>
<p class="dap-an">✅ <strong>D — 28</strong>, khoá ngân hàng — nhưng đọc kỹ lý do. Đáp số đúng là 1000 / 37 = <strong>27,03 yêu cầu/giây</strong>. Không phương án nào là 27; 28 gần nhất rõ rệt (lệch 0,97, phương án kế là 30 lệch 2,97). Khi thi: tính ra 37 ms, chia, chọn D.</p>
<ul><li>A — 30 ra từ 1000 / 33, tức 2/3 × 12 + 1/3 × 75: quên rằng yêu cầu phải đọc đĩa <em>cũng</em> cần 12 ms xử lý (87 ms chứ không phải 75). B — 37 là <em>thời gian</em> trung bình tính bằng ms, bẫy người dừng sớm một bước. C — không cách đọc đề nào ra 35.</li></ul>
<p class="meo">🧠 Sách hỏi cả nửa sau: nhiều luồng thì luồng nào chờ đĩa cứ ngủ, luồng khác dùng CPU, nên giới hạn chỉ còn là CPU: 1000 / 12 ≈ 83 yêu cầu/giây — gấp ba. Đó là toàn bộ lý lẽ ủng hộ luồng trong Hình 2-8 tới 2-10.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 13–16 (vì sao cần luồng: web server và ba cách dựng một server).</p>
<h3>Câu 4 — PCB KHÔNG lưu gì</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q4.png" alt="Ảnh đề gốc câu 4" loading="lazy" /></p></details>
<p>🇬🇧 <em>The Process Control Block (PCB) does NOT store which of the following?</em><br>A. Process state · B. CPU registers · C. I/O status · D. Scheduling information · E. Source code</p>
<p>🇻🇳 Khối điều khiển tiến trình (PCB) KHÔNG lưu thứ nào? A. Trạng thái tiến trình · B. Các thanh ghi CPU · C. Trạng thái I/O · D. Thông tin lập lịch · E. Mã nguồn.</p>
<p>📚 <strong>Process Control Block (PCB)</strong> = khối điều khiển tiến trình (một mục của bảng tiến trình) · <strong>source code</strong> = mã nguồn.</p>
<p class="dap-an">✅ <strong>E — mã nguồn.</strong> PCB (một mục của bảng tiến trình, Hình 2-4) giữ những gì HĐH cần để dừng rồi chạy tiếp một tiến trình: trạng thái, các thanh ghi và PC đã lưu, độ ưu tiên và tham số lập lịch, con trỏ vùng nhớ, các tệp đang mở. Bản thân chương trình — càng không phải <em>mã nguồn</em> — nằm trong bộ nhớ của tiến trình; PCB chỉ trỏ tới đoạn mã (text segment).</p>
<ul><li>A, B, C, D — cả bốn đều là trường của Hình 2-4 (trạng thái I/O = tệp đang mở, I/O đang chờ).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 10–11.</p>
<h3>Câu 5 — thời gian hoàn thành (turnaround)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q5.png" alt="Ảnh đề gốc câu 5" loading="lazy" /></p></details>
<p>🇬🇧 <em>The interval from the time of submission of a process to the time of completion is termed as</em><br>A. waiting time · B. turnaround time · C. response time · D. throughput</p>
<p>🇻🇳 Khoảng thời gian từ lúc nộp một tiến trình tới lúc nó hoàn tất được gọi là gì?</p>
<p>📚 <strong>submission</strong> = lúc nộp/gửi vào · <strong>completion</strong> = lúc hoàn tất · <strong>turnaround time</strong> = thời gian hoàn thành (quay vòng) · <strong>throughput</strong> = thông lượng.</p>
<p class="dap-an">✅ <strong>B.</strong> Turnaround = lúc xong − lúc nộp (tính hết: chờ, chạy, làm I/O).</p>
<ul><li>A — thời gian chờ chỉ tính lúc nằm trong hàng đợi sẵn sàng. C — thời gian đáp ứng dừng ở phản hồi <em>đầu tiên</em>, không phải lúc xong. D — thông lượng là một tốc độ (số việc mỗi giờ), không phải một khoảng thời gian.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 58.</p>
<h3>Câu 6 — tiến trình cha</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q6.png" alt="Ảnh đề gốc câu 6" loading="lazy" /></p></details>
<p>🇬🇧 <em>A process that creates another process is called the:</em><br>A. Child process · B. Root process · C. Parent process · D. Init process</p>
<p>🇻🇳 Tiến trình tạo ra một tiến trình khác được gọi là gì? A. Tiến trình con · B. Tiến trình gốc · C. Tiến trình cha · D. Tiến trình init.</p>
<p>📚 <strong>parent / child process</strong> = tiến trình cha / con · <strong>init</strong> = tiến trình đầu tiên của UNIX (PID 1).</p>
<p class="dap-an">✅ <strong>C.</strong> Bên tạo là cha, bên được tạo là con; trong UNIX chúng thành một cây có gốc là <code>init</code> (PID 1, ngày nay thường là systemd).</p>
<ul><li>A — bên được tạo. B — không phải thuật ngữ chuẩn. D — init chỉ là <em>một</em> tiến trình cha cụ thể (tổ tiên của tất cả), không phải tên gọi chung.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 5–6.</p>
<h3>Câu 7 — các luồng dùng chung gì</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q7.png" alt="Ảnh đề gốc câu 7" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which of the following is shared among threads of the same process?</em><br>A. Stack memory and program counter for each thread · B. File descriptors, heap, and global variables · C. CPU registers and instruction pointer · D. Cache and clock speed of the CPU</p>
<p>🇻🇳 Các luồng của cùng một tiến trình dùng chung thứ gì? A. Ngăn xếp và bộ đếm chương trình của từng luồng · B. Bộ mô tả tệp, heap và biến toàn cục · C. Thanh ghi CPU và con trỏ lệnh · D. Cache và tốc độ xung nhịp CPU.</p>
<p>📚 <strong>shared</strong> = dùng chung · <strong>file descriptor</strong> = bộ mô tả tệp (số hiệu tệp đang mở) · <strong>heap</strong> = vùng cấp phát động · <strong>global variable</strong> = biến toàn cục.</p>
<p class="dap-an">✅ <strong>B.</strong> Hình 2-12: mục riêng của tiến trình (mọi luồng dùng chung) — không gian địa chỉ (heap, biến toàn cục), tệp đang mở, tiến trình con, tín hiệu; mục riêng của từng luồng — bộ đếm chương trình, thanh ghi, ngăn xếp, trạng thái.</p>
<ul><li>A, C — đúng cột riêng-của-luồng: mỗi luồng có ngăn xếp, PC, thanh ghi của mình. D — phần cứng, không thuộc về tiến trình nào.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 17–18.</p>
<h3>Câu 8 — bước đầu tiên của một tiến trình mới</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q8.png" alt="Ảnh đề gốc câu 8" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which of the following actions does the operating system take to execute a new process?</em><br>A. Provide immediate CPU for process. · B. Delivery the resources must be process. · C. Create immediate PCB blocks for process. · D. Provide immediate Register for process.</p>
<p>🇻🇳 Để chạy một tiến trình mới, HĐH làm việc gì? A. Cấp CPU ngay · B. (câu tiếng Anh vỡ) giao tài nguyên · C. Tạo ngay khối PCB cho tiến trình · D. Cấp thanh ghi ngay.</p>
<p>📚 <strong>immediate</strong> = ngay lập tức · <strong>execute</strong> = thực thi.</p>
<p class="dap-an">✅ <strong>C.</strong> Muốn tồn tại như một tiến trình, chương trình trước hết cần một mục trong bảng tiến trình (PCB): mã số, trạng thái, chỗ lưu thanh ghi. Có rồi mới vào được hàng đợi sẵn sàng.</p>
<ul><li>A — tiến trình mới vào trạng thái <em>sẵn sàng</em>; nó nhận CPU khi bộ lập lịch chọn, không phải "ngay". B — câu tiếng Anh vỡ; tài nguyên được cấp dần, theo yêu cầu. D — thanh ghi chỉ được nạp khi tiến trình được điều phối lên CPU.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 5, 10.</p>
<h3>Câu 9 — ưu tiên trong hệ thời gian thực</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q9.png" alt="Ảnh đề gốc câu 9" loading="lazy" /></p></details>
<p>🇬🇧 <em>In a real-time scheduling system, which type of process is given the highest priority?</em><br>A. Shortest processes · B. Processes with the highest computation time · C. Processes with the earliest deadlines · D. Background processes</p>
<p>🇻🇳 Trong hệ lập lịch thời gian thực, loại tiến trình nào được ưu tiên cao nhất? A. Tiến trình ngắn nhất · B. Tiến trình tính toán lâu nhất · C. Tiến trình có hạn chót sớm nhất · D. Tiến trình nền.</p>
<p>📚 <strong>real-time</strong> = thời gian thực · <strong>deadline</strong> = hạn chót · <strong>background</strong> = nền.</p>
<p class="dap-an">✅ <strong>C.</strong> Trong thời gian thực, trễ là hỏng; "hạn chót sớm nhất trước" (EDF — earliest deadline first) chạy việc có hạn chót gần nhất.</p>
<ul><li>A — ngắn nhất trước là SJF, chính sách cho hệ lô để giảm thời gian hoàn thành TB, không phải để khỏi trễ hạn. B — ngược mọi quy tắc hữu ích. D — việc nền có ưu tiên thấp nhất.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 64.</p>
<h3>Câu 10 — người ghi bị bỏ đói</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q10.png" alt="Ảnh đề gốc câu 10" loading="lazy" /></p></details>
<p>🇬🇧 <em>In the Classical IPC Problems, specifically the Readers-Writers problem, what condition may lead to writer starvation?</em><br>A. A continuous stream of incoming readers · B. A reader exits too early · C. The mutex semaphore remains locked · D. Too many writers writing at the same time</p>
<p>🇻🇳 Trong bài toán Người đọc – Người ghi, điều kiện nào có thể làm người ghi bị bỏ đói? A. Người đọc tới liên tục không dứt · B. Một người đọc rời đi quá sớm · C. Semaphore mutex bị khoá mãi · D. Quá nhiều người ghi cùng ghi một lúc.</p>
<p>📚 <strong>starvation</strong> = bỏ đói (chờ mãi không tới lượt) · <strong>continuous stream</strong> = dòng liên tục · <strong>readers-writers</strong> = người đọc – người ghi.</p>
<p class="dap-an">✅ <strong>A.</strong> Trong lời giải của sách (Hình 2-48), người đọc mới được vào miễn là còn ít nhất một người đọc ở trong. Người đọc cứ tới liên tục thì bộ đếm không bao giờ về 0 và người ghi chờ mãi.</p>
<ul><li>B — người đọc rời sớm còn <em>giúp</em> người ghi. C — mutex khoá vĩnh viễn thì chặn tất cả (một lỗi), không riêng người ghi. D — người ghi được độc quyền: hai người không bao giờ ghi cùng lúc.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 72–73.</p>
<h3>Câu 15 — Dijkstra, 1965</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q15.png" alt="Ảnh đề gốc câu 15" loading="lazy" /></p></details>
<p>🇬🇧 <em>In 1965, Dijkstra posed and then solved a synchronization problem he called</em><br>A. the dining philosophers problem · B. the ostrich algorithm · C. the banker's algorithm · D. the allocation algorithm</p>
<p>🇻🇳 Năm 1965, Dijkstra đặt ra rồi tự giải một bài toán đồng bộ mà ông gọi là gì? A. Bữa tối của các triết gia · B. Thuật toán đà điểu · C. Thuật toán nhà băng · D. Thuật toán cấp phát.</p>
<p>📚 <strong>pose</strong> = đặt ra (một bài toán) · <strong>synchronization</strong> = đồng bộ hoá · <strong>dining philosophers</strong> = bữa tối của các triết gia.</p>
<p class="dap-an">✅ <strong>A.</strong> Đề là câu đầu tiên của mục 2.5.1 trong sách: năm triết gia, năm cái nĩa, mỗi người cần hai nĩa mới ăn được.</p>
<ul><li>C là bẫy: thuật toán nhà băng <em>cũng</em> của Dijkstra, <em>cũng</em> năm 1965 — nhưng đó là thuật toán tránh bế tắc (Ch. 6), không phải "bài toán đồng bộ ông đặt ra". B — "lờ vấn đề đi", Ch. 6. D — không phải thuật toán có tên.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 67.</p>
<h3>Câu 19 — tiến trình và luồng trong Windows (ngân hàng tự mâu thuẫn)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q19.png" alt="Ảnh đề gốc câu 19" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which of the following best describes the difference between a process and a thread in the context of the Windows operating system?</em><br>A. A process contains multiple threads and shares resources, while a thread is an independent execution unit within a process. · B. A process is a program in execution, while a thread is a sequence of instructions that can execute independently. · C. A process and a thread are essentially the same in Windows OS, with no significant difference between them. · D. A process represents system resources, while a thread is responsible for user interface interactions in Windows OS.</p>
<p>🇻🇳 Phát biểu nào mô tả đúng nhất khác biệt giữa tiến trình và luồng trong Windows? A. Tiến trình chứa nhiều luồng và chia sẻ tài nguyên, còn luồng là một đơn vị thực thi độc lập bên trong tiến trình · B. Tiến trình là chương trình đang chạy, còn luồng là một dãy lệnh có thể chạy độc lập · C. Trong Windows tiến trình và luồng về cơ bản là một · D. Tiến trình đại diện cho tài nguyên hệ thống, còn luồng lo tương tác giao diện.</p>
<p>📚 <strong>execution unit</strong> = đơn vị thực thi · <strong>in the context of</strong> = trong bối cảnh · <strong>essentially the same</strong> = về bản chất là một.</p>
<p class="dap-an">✅ <strong>A</strong> ở đề này (khoá ngân hàng của FE2) — và B cũng đúng y như vậy.</p>
<div class="callout"><p><strong>Cùng một câu, ngân hàng có hai khoá.</strong> FE2 khoá A; FE4#22, FE7#24, FE12#22, FE13#22 và FE14#29 khoá B. Cả hai đều đúng: Windows coi tiến trình là một <em>vật chứa</em> (không gian địa chỉ, handle, thẻ bảo mật) trong đó một hay nhiều luồng chạy, còn luồng là thứ nhân lập lịch — đó là A; tài liệu của chính Microsoft mở đầu bằng "nói đơn giản nhất, tiến trình là một chương trình đang chạy", và luồng là đơn vị được cấp thời gian CPU — đó là B. <strong>Khi thi:</strong> không có cách nào chắc chắn; B được khoá ở năm trên sáu đề, nên gặp câu này ở đề khác thì B an toàn hơn, còn trang FE2 của Phòng thi chấm A.</p></div>
<ul><li>C — sai: tiến trình sở hữu tài nguyên, luồng chạy mã; một tiến trình có thể có nhiều luồng. D — luồng không phải "để lo giao diện"; luồng nào cũng chạy được mọi đoạn mã của tiến trình.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 17–18; Windows ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg11-2">11.B</a>, slide 28, 34–35.</p>`),
    bi(`<h2>Chapter 3 — Memory management (8 questions)</h2>
<h3>Q11 — the benefit of paging</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q11.png" alt="Original question 11" loading="lazy" /></p></details>
<p><em>What is the benefit of using paging in virtual memory systems?</em><br>A. Enhanced CPU performance · B. Improved disk storage management · C. Efficient memory utilization · D. Faster network communication</p>
<p class="dap-an">✅ <strong>C.</strong> Any free frame fits any page, so there is no external fragmentation, and only the pages a program actually uses need to be in RAM — more programs fit in the same memory.</p>
<ul><li>A — paging costs CPU time (address translation, page faults); the TLB exists to limit that cost. B — the disk only serves as backing store. D — unrelated.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 11–13.</p>
<h3>Q12 — roll out, roll in</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q12.png" alt="Original question 12" loading="lazy" /></p></details>
<p><em>If a higher priority process arrives and wants service, the memory manager can swap out the lower priority process to execute the higher priority process. When the higher priority process finishes, the lower priority process is swapped back in and continues execution. This variant of swapping is sometimes called?</em><br>A. roll out, roll in · B. priority swapping · C. pull in, push out · D. pull out, push in</p>
<p class="dap-an">✅ <strong>A.</strong> "Roll out, roll in" is the classic name (Silberschatz) for swapping driven by priority. Same question in FE10#21.</p>
<ul><li>B — descriptive but not the name. C, D — invented word pairs.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 6.</p>
<h3>Q13 — growing structures plus sharing</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q13.png" alt="Original question 13" loading="lazy" /></p></details>
<p><em>Suppose a system aims to handle data structures that can dynamically change in size and simplify sharing. Which memory management technique would best suit this scenario?</em><br>A. Segmentation with paging · B. Swapping with page tables · C. Virtual memory with aging algorithms · D. Monolithic memory allocation</p>
<p class="dap-an">✅ <strong>A.</strong> Segments give each table, stack or library its own address space that can grow and be shared as one unit (Fig. 3-31); paging each segment (MULTICS, x86 of the 1990s) removes the external fragmentation of pure segmentation.</p>
<ul><li>B — page tables alone give one flat space: no per-structure growth or sharing. C — aging is a page-replacement algorithm, it says nothing about structures. D — not a technique.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slides 42–45, 47.</p>
<h3>Q14 — the MMU (= FE1 Q14)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q14.png" alt="Original question 14" loading="lazy" /></p></details>
<p><em>What is the role of the Memory Management Unit (MMU) in a computer system?</em><br>A. The MMU translates virtual addresses into physical addresses · B. It controls the allocation of memory to different processes. · C. It manages the paging and swapping of memory pages. · D. It is a data structure used in computer operating systems for virtual memory management</p>
<p class="dap-an">✅ <strong>A.</strong> The MMU is the hardware between the CPU and the memory bus that maps every virtual address to a physical one. Same as FE1 Q14.</p>
<ul><li>B, C — policy: the OS decides who gets memory and which page goes out. D — the MMU is hardware; the page table is the data structure it reads.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 12.</p>
<h3>Q16 — the technique of virtual memory</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q16.png" alt="Original question 16" loading="lazy" /></p></details>
<p><em>Most virtual memory systems use a technique called ________?</em><br>A. Page Fault · B. Page Frames · C. Page Table · D. Paging</p>
<p class="dap-an">✅ <strong>D.</strong> The book's sentence: "Most virtual memory systems use a technique called paging."</p>
<ul><li>A — an event (the trap when a page is absent). B — the units of physical memory. C — the data structure. All three are <em>parts</em> of paging, not the technique.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 11–12.</p>
<h3>Q17 — clock versus second chance (= FE1 Q12)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q17.png" alt="Original question 17" loading="lazy" /></p></details>
<p><em>What is the main advantage of using the Clock Algorithm over the Second Chance Algorithm in terms of page replacement efficiency?</em><br>A. The Clock algorithm eliminates the need to move pages around, reducing overhead. · B. The Clock algorithm increases the complexity of implementation. · C. The Clock algorithm guarantees fewer page faults compared to Second Chance algorithm. · D. The Clock algorithm uses more memory to maintain the circular structure.</p>
<p class="dap-an">✅ <strong>A.</strong> Both make the same choice; second chance moves a page with R = 1 to the tail of a linked list, the clock just advances a hand over a circular list. Same decisions, less work. Same as FE1 Q12.</p>
<ul><li>B, D — disadvantages, not advantages (and false). C — identical choices ⇒ identical fault counts.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 22–23.</p>
<h3>Q18 — the working set model</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q18.png" alt="Original question 18" loading="lazy" /></p></details>
<p><em>What is the primary goal of the "working set model" in page replacement algorithms?</em><br>A. To minimize internal fragmentation by using small page sizes. · B. To ensure that processes always run with a fixed number of pages in memory. · C. To prepage all pages a process might ever need into memory before execution. · D. To greatly reduce the page fault rate by keeping a process's active pages in memory</p>
<p class="dap-an">✅ <strong>D.</strong> The working set = the pages used in the recent past; keep it in memory (and load it before running: prepaging) and the process runs with few faults instead of thrashing.</p>
<ul><li>A — page size is a separate design choice. B — the working set grows and shrinks with the program's phase; that is the point. C — prepaging loads the <em>working set</em>, not every page the process might ever touch.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 25–26.</p>
<h3>Q45 — segment table (computed)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q45.png" alt="Original question 45" loading="lazy" /></p></details>
<p><em>Given the segment table below: Segment 0: Limit 600, Base 219 · Segment 1: Limit 14, Base 2300 · Segment 2: Limit 100, Base 90 · Segment 3: Limit 580, Base 1327 · Segment 4: Limit 96, Base 1952. What is the physical address for the logical address (2, 50)?</em><br>A. 140 · B. 130 · C. 150 · D. Invalid address</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/eea25c59083fe77d9cc4e69b3ef4819ccba52a1c.svg" alt="Segment 2: check the offset against the limit, then add the base" loading="lazy" /><p class="chu-thich">🧮 Segment 2: check the offset against the limit, then add the base</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p3: server một luồng — yêu cầu nào cũng tốn 12 ms CPU; 1/3 số yêu cầu (trượt cache khối) chờ thêm 75 ms đĩa, luồng duy nhất ngủ
//     theo ⇒ không phục vụ ai trong lúc đó. Xét một chu kỳ 3 yêu cầu (trúng, trúng, trượt) rồi chia.
const P3 = { cpu: 12, dia: 75, tiLeDia: [1, 3], phuongAn: [30, 37, 35, 28] };
function tinhP3() {
  const [a, b] = P3.tiLeDia;                                   // a trên b yêu cầu cần đĩa
  const chuKy = b * P3.cpu + a * P3.dia;                       // ms cho b yêu cầu, xử lý NỐI ĐUÔI
  const tb = chuKy / b;                                        // ms trung bình mỗi yêu cầu
  const motLuong = 1000 / tb;                                  // yêu cầu / giây, một luồng
  const nhieuLuong = 1000 / P3.cpu;                            // nhiều luồng: CPU không đứng chờ đĩa
  return { chuKy, tb, motLuong, nhieuLuong };
}
// p45: bảng đoạn — dữ liệu chép từ đề
const DOAN = [{ coSo: 219, gioiHan: 600 }, { coSo: 2300, gioiHan: 14 }, { coSo: 90, gioiHan: 100 }, { coSo: 1327, gioiHan: 580 }, { coSo: 1952, gioiHan: 96 }];
const tinhP45 = () =&gt; dichDoan(2, 50, DOAN);
// p46: Allocated (C) / Requested (R), Available — dùng đúng phép kiểm của nhà băng với "cần thêm" = Requested
const C46 = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R46 = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A46 = [2, 1, 0, 1];
const PA46 = [[2, 1, 0], [1, 0, 2], [0, 1, 2], [1, 2, 0]];      // phương án A–D (chỉ số 0 = P1)
const kiem46 = (chuoi) =&gt; kiemChuoi({ conLai: A46, giuLai: C46, canThem: R46, chuoi });
// p48: một loại tài nguyên (MOS 4e Hình 6-9) — tổng 15, đã cấp 3 + 4 + 3 = 10 ⇒ trống 5 (khớp số đề cho)
const HAS48 = [3, 4, 3], MAX48 = [8, 6, 5], TONG48 = 15, FREE48 = 5;</code></pre></details>
<p class="dap-an">✅ <strong>A — 140.</strong> Two steps, always in this order: (1) offset &lt; limit? 50 &lt; 100 — legal; (2) physical = base + offset = 90 + 50 = 140. Bank key A.</p>
<ul><li>B — no rule gives 130. C — 150 = limit + offset: the two columns swapped (the image prints Limit first, then Base — read the header). D — only when the offset is ≥ the limit (try (1, 20): 20 ≥ 14 ⇒ trap).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slides 44–46.</p>`,
    `<h2>Chương 3 — Quản lý bộ nhớ (8 câu)</h2>
<h3>Câu 11 — lợi ích của phân trang</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q11.png" alt="Ảnh đề gốc câu 11" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is the benefit of using paging in virtual memory systems?</em><br>A. Enhanced CPU performance · B. Improved disk storage management · C. Efficient memory utilization · D. Faster network communication</p>
<p>🇻🇳 Dùng phân trang trong hệ bộ nhớ ảo được lợi gì? A. CPU nhanh hơn · B. Quản lý đĩa tốt hơn · C. Dùng bộ nhớ hiệu quả · D. Truyền mạng nhanh hơn.</p>
<p>📚 <strong>paging</strong> = phân trang · <strong>utilization</strong> = mức sử dụng, tận dụng.</p>
<p class="dap-an">✅ <strong>C.</strong> Khung trống nào cũng vừa trang nào, nên không có phân mảnh ngoài, và chỉ những trang chương trình thật sự dùng mới cần nằm trong RAM — cùng bộ nhớ chứa được nhiều chương trình hơn.</p>
<ul><li>A — phân trang còn tốn thời gian CPU (dịch địa chỉ, lỗi trang); TLB sinh ra để giảm chi phí đó. B — đĩa chỉ là nơi chứa trang dự phòng. D — không liên quan.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 11–13.</p>
<h3>Câu 12 — roll out, roll in</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q12.png" alt="Ảnh đề gốc câu 12" loading="lazy" /></p></details>
<p>🇬🇧 <em>If a higher priority process arrives and wants service, the memory manager can swap out the lower priority process to execute the higher priority process. When the higher priority process finishes, the lower priority process is swapped back in and continues execution. This variant of swapping is sometimes called?</em><br>A. roll out, roll in · B. priority swapping · C. pull in, push out · D. pull out, push in</p>
<p>🇻🇳 Khi một tiến trình ưu tiên cao tới, bộ quản lý bộ nhớ đẩy tiến trình ưu tiên thấp ra đĩa để chạy nó; xong thì đưa tiến trình kia trở lại và chạy tiếp. Biến thể hoán đổi này đôi khi được gọi là gì?</p>
<p>📚 <strong>swap out / swap in</strong> = đẩy ra đĩa / nạp lại vào bộ nhớ · <strong>variant</strong> = biến thể.</p>
<p class="dap-an">✅ <strong>A.</strong> "Roll out, roll in" là tên kinh điển (Silberschatz) của kiểu hoán đổi theo độ ưu tiên. Cùng câu ở FE10#21.</p>
<ul><li>B — mô tả đúng ý nhưng không phải tên gọi. C, D — cặp từ bịa ra.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 6.</p>
<h3>Câu 13 — cấu trúc đổi cỡ và chia sẻ</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q13.png" alt="Ảnh đề gốc câu 13" loading="lazy" /></p></details>
<p>🇬🇧 <em>Suppose a system aims to handle data structures that can dynamically change in size and simplify sharing. Which memory management technique would best suit this scenario?</em><br>A. Segmentation with paging · B. Swapping with page tables · C. Virtual memory with aging algorithms · D. Monolithic memory allocation</p>
<p>🇻🇳 Một hệ thống muốn quản lý các cấu trúc dữ liệu thay đổi kích thước lúc chạy và chia sẻ cho đơn giản. Kỹ thuật quản lý bộ nhớ nào hợp nhất?</p>
<p>📚 <strong>dynamically change in size</strong> = đổi kích thước lúc chạy · <strong>segmentation</strong> = phân đoạn · <strong>sharing</strong> = chia sẻ.</p>
<p class="dap-an">✅ <strong>A.</strong> Phân đoạn cho mỗi bảng, ngăn xếp hay thư viện một không gian địa chỉ riêng, lớn lên được và chia sẻ được như một khối (Hình 3-31); phân trang bên trong từng đoạn (MULTICS, x86 thập niên 1990) xoá phân mảnh ngoài của phân đoạn thuần.</p>
<ul><li>B — chỉ có bảng trang thì chỉ có một không gian phẳng: không có lớn-lên hay chia-sẻ theo từng cấu trúc. C — aging là thuật toán thay trang, chẳng nói gì về cấu trúc. D — không phải một kỹ thuật.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slide 42–45, 47.</p>
<h3>Câu 14 — MMU (= câu 14 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q14.png" alt="Ảnh đề gốc câu 14" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is the role of the Memory Management Unit (MMU) in a computer system?</em><br>A. The MMU translates virtual addresses into physical addresses · B. It controls the allocation of memory to different processes. · C. It manages the paging and swapping of memory pages. · D. It is a data structure used in computer operating systems for virtual memory management</p>
<p>🇻🇳 Bộ quản lý bộ nhớ (MMU) có vai trò gì? A. Dịch địa chỉ ảo thành địa chỉ vật lý · B. Điều khiển cấp phát bộ nhớ cho các tiến trình · C. Quản lý phân trang và hoán đổi · D. Là một cấu trúc dữ liệu của HĐH cho bộ nhớ ảo.</p>
<p>📚 <strong>MMU (Memory Management Unit)</strong> = khối quản lý bộ nhớ (phần cứng) · <strong>translate</strong> = dịch, ánh xạ.</p>
<p class="dap-an">✅ <strong>A.</strong> MMU là phần cứng nằm giữa CPU và bus bộ nhớ, ánh xạ mọi địa chỉ ảo sang địa chỉ vật lý. Giống câu 14 FE1.</p>
<ul><li>B, C — là chính sách: HĐH quyết định ai được bộ nhớ, trang nào bị đẩy ra. D — MMU là phần cứng; bảng trang mới là cấu trúc dữ liệu mà nó đọc.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 12.</p>
<h3>Câu 16 — kỹ thuật của bộ nhớ ảo</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q16.png" alt="Ảnh đề gốc câu 16" loading="lazy" /></p></details>
<p>🇬🇧 <em>Most virtual memory systems use a technique called ________?</em><br>A. Page Fault · B. Page Frames · C. Page Table · D. Paging</p>
<p>🇻🇳 Đa số hệ bộ nhớ ảo dùng một kỹ thuật gọi là gì? A. Lỗi trang · B. Khung trang · C. Bảng trang · D. Phân trang.</p>
<p>📚 <strong>page fault</strong> = lỗi trang · <strong>page frame</strong> = khung trang · <strong>page table</strong> = bảng trang · <strong>paging</strong> = phân trang.</p>
<p class="dap-an">✅ <strong>D.</strong> Câu của sách: "Most virtual memory systems use a technique called paging."</p>
<ul><li>A — một sự kiện (bẫy khi trang vắng mặt). B — đơn vị của bộ nhớ vật lý. C — cấu trúc dữ liệu. Cả ba là <em>bộ phận</em> của phân trang, không phải tên kỹ thuật.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 11–12.</p>
<h3>Câu 17 — đồng hồ so với cơ hội thứ hai (= câu 12 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q17.png" alt="Ảnh đề gốc câu 17" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is the main advantage of using the Clock Algorithm over the Second Chance Algorithm in terms of page replacement efficiency?</em><br>A. The Clock algorithm eliminates the need to move pages around, reducing overhead. · B. The Clock algorithm increases the complexity of implementation. · C. The Clock algorithm guarantees fewer page faults compared to Second Chance algorithm. · D. The Clock algorithm uses more memory to maintain the circular structure.</p>
<p>🇻🇳 Ưu điểm chính của thuật toán đồng hồ (Clock) so với cơ hội thứ hai (Second Chance) về hiệu quả thay trang? A. Không phải dời các trang đi lại, giảm chi phí · B. Cài đặt phức tạp hơn · C. Bảo đảm ít lỗi trang hơn · D. Tốn thêm bộ nhớ cho cấu trúc vòng.</p>
<p>📚 <strong>overhead</strong> = chi phí phụ · <strong>circular</strong> = vòng tròn · <strong>second chance</strong> = cơ hội thứ hai.</p>
<p class="dap-an">✅ <strong>A.</strong> Hai thuật toán chọn giống hệt nhau; cơ hội thứ hai dời trang có R = 1 xuống cuối danh sách liên kết, còn đồng hồ chỉ nhích kim trên danh sách vòng. Quyết định như nhau, ít việc hơn. Giống câu 12 FE1.</p>
<ul><li>B, D — là nhược điểm, không phải ưu điểm (và sai). C — chọn giống nhau ⇒ số lỗi trang giống nhau.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 22–23.</p>
<h3>Câu 18 — mô hình tập làm việc</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q18.png" alt="Ảnh đề gốc câu 18" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is the primary goal of the "working set model" in page replacement algorithms?</em><br>A. To minimize internal fragmentation by using small page sizes. · B. To ensure that processes always run with a fixed number of pages in memory. · C. To prepage all pages a process might ever need into memory before execution. · D. To greatly reduce the page fault rate by keeping a process's active pages in memory</p>
<p>🇻🇳 Mục tiêu chính của "mô hình tập làm việc" là gì? A. Giảm phân mảnh trong bằng trang nhỏ · B. Bảo đảm tiến trình luôn chạy với số trang cố định · C. Nạp trước mọi trang tiến trình có thể cần · D. Giảm mạnh tỉ lệ lỗi trang bằng cách giữ các trang đang hoạt động trong bộ nhớ.</p>
<p>📚 <strong>working set</strong> = tập làm việc (các trang dùng gần đây) · <strong>prepage</strong> = nạp trước · <strong>page fault rate</strong> = tỉ lệ lỗi trang.</p>
<p class="dap-an">✅ <strong>D.</strong> Tập làm việc = các trang được dùng trong quá khứ gần; giữ nó trong bộ nhớ (và nạp nó trước khi chạy: prepaging) thì tiến trình chạy với ít lỗi trang thay vì thrashing.</p>
<ul><li>A — cỡ trang là một lựa chọn thiết kế riêng. B — tập làm việc lớn lên, nhỏ đi theo từng pha của chương trình; đó mới là ý chính. C — prepaging nạp <em>tập làm việc</em>, không phải mọi trang có thể dùng tới.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 25–26.</p>
<h3>Câu 45 — bảng đoạn (câu tính)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q45.png" alt="Ảnh đề gốc câu 45" loading="lazy" /></p></details>
<p>🇬🇧 <em>Given the segment table below: Segment 0: Limit 600, Base 219 · Segment 1: Limit 14, Base 2300 · Segment 2: Limit 100, Base 90 · Segment 3: Limit 580, Base 1327 · Segment 4: Limit 96, Base 1952. What is the physical address for the logical address (2, 50)?</em><br>A. 140 · B. 130 · C. 150 · D. Invalid address</p>
<p>🇻🇳 Cho bảng đoạn như trên. Địa chỉ vật lý của địa chỉ logic (2, 50) là bao nhiêu? (D. Địa chỉ không hợp lệ.)</p>
<p>📚 <strong>segment table</strong> = bảng đoạn · <strong>limit</strong> = giới hạn (độ dài đoạn) · <strong>base</strong> = cơ sở (địa chỉ bắt đầu) · <strong>logical address (s, d)</strong> = địa chỉ logic (số đoạn, độ dời).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ac48780e3d52440f7450c536fb776d1b42b2fcea.svg" alt="Đoạn 2: so độ dời với limit trước, rồi mới cộng base" loading="lazy" /><p class="chu-thich">🧮 Đoạn 2: so độ dời với limit trước, rồi mới cộng base</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p3: server một luồng — yêu cầu nào cũng tốn 12 ms CPU; 1/3 số yêu cầu (trượt cache khối) chờ thêm 75 ms đĩa, luồng duy nhất ngủ
//     theo ⇒ không phục vụ ai trong lúc đó. Xét một chu kỳ 3 yêu cầu (trúng, trúng, trượt) rồi chia.
const P3 = { cpu: 12, dia: 75, tiLeDia: [1, 3], phuongAn: [30, 37, 35, 28] };
function tinhP3() {
  const [a, b] = P3.tiLeDia;                                   // a trên b yêu cầu cần đĩa
  const chuKy = b * P3.cpu + a * P3.dia;                       // ms cho b yêu cầu, xử lý NỐI ĐUÔI
  const tb = chuKy / b;                                        // ms trung bình mỗi yêu cầu
  const motLuong = 1000 / tb;                                  // yêu cầu / giây, một luồng
  const nhieuLuong = 1000 / P3.cpu;                            // nhiều luồng: CPU không đứng chờ đĩa
  return { chuKy, tb, motLuong, nhieuLuong };
}
// p45: bảng đoạn — dữ liệu chép từ đề
const DOAN = [{ coSo: 219, gioiHan: 600 }, { coSo: 2300, gioiHan: 14 }, { coSo: 90, gioiHan: 100 }, { coSo: 1327, gioiHan: 580 }, { coSo: 1952, gioiHan: 96 }];
const tinhP45 = () =&gt; dichDoan(2, 50, DOAN);
// p46: Allocated (C) / Requested (R), Available — dùng đúng phép kiểm của nhà băng với "cần thêm" = Requested
const C46 = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R46 = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A46 = [2, 1, 0, 1];
const PA46 = [[2, 1, 0], [1, 0, 2], [0, 1, 2], [1, 2, 0]];      // phương án A–D (chỉ số 0 = P1)
const kiem46 = (chuoi) =&gt; kiemChuoi({ conLai: A46, giuLai: C46, canThem: R46, chuoi });
// p48: một loại tài nguyên (MOS 4e Hình 6-9) — tổng 15, đã cấp 3 + 4 + 3 = 10 ⇒ trống 5 (khớp số đề cho)
const HAS48 = [3, 4, 3], MAX48 = [8, 6, 5], TONG48 = 15, FREE48 = 5;</code></pre></details>
<p class="dap-an">✅ <strong>A — 140.</strong> Hai bước, luôn theo thứ tự này: (1) độ dời &lt; limit? 50 &lt; 100 — hợp lệ; (2) vật lý = base + độ dời = 90 + 50 = 140. Khoá ngân hàng A.</p>
<ul><li>B — không quy tắc nào ra 130. C — 150 = limit + độ dời: đọc lẫn hai cột (ảnh in Limit trước rồi mới tới Base — đọc tiêu đề cột). D — chỉ khi độ dời ≥ limit (thử (1, 20): 20 ≥ 14 ⇒ bẫy).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slide 44–46.</p>`),
    bi(`<h2>Chapter 4 — File systems (8 questions)</h2>
<h3>Q20 — contiguous allocation</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q20.png" alt="Original question 20" loading="lazy" /></p></details>
<p><em>What is Contiguous Allocation in file systems?</em><br>A. Files are stored in non-contiguous blocks on disk · B. Each file is allocated a contiguous block of disk space · C. Files are linked together to form a chain · D. Files are allocated using an index structure</p>
<p class="dap-an">✅ <strong>B.</strong> Each file is a run of consecutive blocks (Fig. 4-10): the directory only needs the first block and the length, and a whole file is read in one sweep — at the price of external fragmentation when files are deleted.</p>
<ul><li>A — the opposite. C — linked-list allocation (Fig. 4-11/4-12, FAT). D — indexed allocation (the i-node, Fig. 4-13).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 18.</p>
<h3>Q22 — the file type that models disks</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q22.png" alt="Original question 22" loading="lazy" /></p></details>
<p><em>In UNIX, which type of file is used to model disks?</em><br>A. Regular files. · B. Character special files. · C. Block special files. · D. Directories.</p>
<p class="dap-an">✅ <strong>C.</strong> The book's sentence: "Character special files are related to I/O and used to model serial I/O devices… Block special files are used to model disks." <code>ls -l /dev/sda</code> starts with <code>b</code>, <code>ls -l /dev/tty</code> with <code>c</code>.</p>
<ul><li>A — user data (ASCII or binary). B — terminals, printers, networks. D — system files that keep the structure of the file system.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 7; Linux devices in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg10-2">10.B</a>.</p>
<h3>Q23 — one directory for everything</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q23.png" alt="Original question 23" loading="lazy" /></p></details>
<p><em>The simplest form of directory system is having one directory containing all the files. It is called the</em><br>A. Root directory · B. User directory · C. Parent directory · D. Current directory</p>
<p class="dap-an">✅ <strong>A.</strong> §4.2.1 (single-level directory systems): "Sometimes it is called the root directory, but since it is the only one, the name does not matter much." Early personal computers and the first supercomputer (CDC 6600) worked like this.</p>
<ul><li>B — one directory per user is the two-level design. C — the directory above another one (<code>..</code>). D — the working directory of a process.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 13.</p>
<h3>Q24 — sector 0 of the disk</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q24.png" alt="Original question 24" loading="lazy" /></p></details>
<p><em>In file systems, what is sector 0 of the disk called?</em><br>A. Boot block · B. Superblock · C. MBR (Master Boot Record) · D. Free space mgmt</p>
<p class="dap-an">✅ <strong>C.</strong> Fig. 4-9: sector 0 holds the MBR (boot code + the partition table). The BIOS runs it; it finds the active partition and runs <em>its</em> first block.</p>
<ul><li>A — the boot block is the first block of <em>each partition</em>. B — the superblock follows it and holds the file-system parameters. D — the free-space bitmap or list comes after the superblock. Today's UEFI disks use GPT, which still keeps a "protective MBR" in sector 0.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 17.</p>
<h3>Q25 — access method for large files (wording outside the book)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q25.png" alt="Original question 25" loading="lazy" /></p></details>
<p><em>Which file access method is often used to optimize access to large files in a file system?</em><br>A. Sequential access · B. Direct access · C. Indexed access · D. Linked access</p>
<p class="dap-an">✅ <strong>C</strong> (bank key). Tanenbaum only names two access methods, sequential and random (= direct). "Indexed access" comes from Silberschatz: build an index on top of direct access, search the small index, then jump straight to the record — the method used for large files such as databases.</p>
<ul><li>A — reading from the start is the slowest way to reach the middle of a big file. B — direct access is what indexed access is built on, so it is not wrong — but "optimize large files" points to the index. D — "linked" is a way to <em>allocate</em> blocks, not to access a file.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 9 (sequential versus random access, <code>seek</code>).</p>
<h3>Q26 — the Rock Ridge field for another name</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q26.png" alt="Original question 26" loading="lazy" /></p></details>
<p><em>Which extension field provides an alternative name for a file or directory?</em><br>A. Alternate Name · B. Relocated Directory · C. Time Stamp · D. Parent Link</p>
<p class="dap-an">✅ <strong>A.</strong> The Rock Ridge extensions add UNIX features to an ISO 9660 CD-ROM in eight fields: PX, PN, SL, <strong>NM — alternative name</strong> (the long, case-sensitive UNIX name), CL, PL, RE, TF.</p>
<ul><li>B — RE, relocation (moves deep directories). C — TF, time stamps. D — PL, parent location. All are real fields, just not the one asked.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-2">4.B</a>, slide 47.</p>
<h3>Q27 — mounting a USB stick</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q27.png" alt="Original question 27" loading="lazy" /></p></details>
<p><em>What happens when a USB stick is mounted on the directory /usr/ast/backup in UNIX?</em><br>A. The USB stick becomes inaccessible through the regular file system · B. Files copied to /usr/ast/backup/monday are stored directly on the USB stick · C. Files on the USB stick are deleted · D. The directory /usr/ast/backup is overwritten by the contents of the USB stick</p>
<p class="dap-an">✅ <strong>B.</strong> After <code>mount</code>, the root of the stick's file system <em>appears at</em> /usr/ast/backup; any path below it — /usr/ast/backup/monday — lives on the stick.</p>
<ul><li>A — the opposite: mounting is what makes it reachable. C — mounting changes nothing on the stick. D — whatever was in /usr/ast/backup is <em>hidden</em> while the stick is mounted, not overwritten; it reappears after <code>umount</code>.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 24, and <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slide 35 (Fig. 1-22, mount); VFS in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 27.</p>
<h3>Q33 — the job of the file system</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q33.png" alt="Original question 33" loading="lazy" /></p></details>
<p><em>What is the role of the file system in disk management?</em><br>A. To allocate memory for disk operations. · B. To manage the disk's hardware components. · C. To organize and track files and data on the disk. · D. To design disk controllers.</p>
<p class="dap-an">✅ <strong>C.</strong> The file system turns a disk — a long array of blocks — into named files and directories, and keeps track of which blocks belong to which file and which are free.</p>
<ul><li>A — memory for buffers is the block cache's business. B — the driver and the controller handle the hardware. D — hardware engineers design controllers.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slides 2–4.</p>`,
    `<h2>Chương 4 — Hệ thống tệp (8 câu)</h2>
<h3>Câu 20 — cấp phát liên tục</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q20.png" alt="Ảnh đề gốc câu 20" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is Contiguous Allocation in file systems?</em><br>A. Files are stored in non-contiguous blocks on disk · B. Each file is allocated a contiguous block of disk space · C. Files are linked together to form a chain · D. Files are allocated using an index structure</p>
<p>🇻🇳 Cấp phát liên tục trong hệ thống tệp là gì? A. Tệp lưu ở các khối không liền nhau · B. Mỗi tệp được cấp một vùng đĩa liền nhau · C. Các tệp nối với nhau thành chuỗi · D. Tệp được cấp phát bằng một cấu trúc chỉ mục.</p>
<p>📚 <strong>contiguous</strong> = liền nhau, liên tục · <strong>allocation</strong> = cấp phát · <strong>index</strong> = chỉ mục.</p>
<p class="dap-an">✅ <strong>B.</strong> Mỗi tệp là một dãy khối liên tiếp (Hình 4-10): thư mục chỉ cần khối đầu và độ dài, đọc cả tệp chỉ một lượt quét — đổi lại là phân mảnh ngoài khi tệp bị xoá.</p>
<ul><li>A — ngược lại. C — cấp phát danh sách liên kết (Hình 4-11/4-12, FAT). D — cấp phát chỉ mục (i-node, Hình 4-13).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 18.</p>
<h3>Câu 22 — loại tệp mô hình hoá đĩa</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q22.png" alt="Ảnh đề gốc câu 22" loading="lazy" /></p></details>
<p>🇬🇧 <em>In UNIX, which type of file is used to model disks?</em><br>A. Regular files. · B. Character special files. · C. Block special files. · D. Directories.</p>
<p>🇻🇳 Trong UNIX, loại tệp nào dùng để mô hình hoá đĩa? A. Tệp thường · B. Tệp đặc biệt ký tự · C. Tệp đặc biệt khối · D. Thư mục.</p>
<p>📚 <strong>model</strong> = mô hình hoá, đại diện cho · <strong>block / character special file</strong> = tệp đặc biệt khối / ký tự (đại diện cho thiết bị).</p>
<p class="dap-an">✅ <strong>C.</strong> Câu của sách: "Tệp đặc biệt ký tự liên quan tới I/O, dùng mô hình hoá thiết bị I/O nối tiếp… Tệp đặc biệt khối dùng để mô hình hoá đĩa." <code>ls -l /dev/sda</code> bắt đầu bằng <code>b</code>, <code>ls -l /dev/tty</code> bằng <code>c</code>.</p>
<ul><li>A — dữ liệu người dùng (ASCII hoặc nhị phân). B — terminal, máy in, mạng. D — tệp hệ thống giữ cấu trúc của hệ thống tệp.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 7; thiết bị trong Linux ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg10-2">10.B</a>.</p>
<h3>Câu 23 — một thư mục chứa tất cả</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q23.png" alt="Ảnh đề gốc câu 23" loading="lazy" /></p></details>
<p>🇬🇧 <em>The simplest form of directory system is having one directory containing all the files. It is called the</em><br>A. Root directory · B. User directory · C. Parent directory · D. Current directory</p>
<p>🇻🇳 Dạng hệ thống thư mục đơn giản nhất là có một thư mục chứa mọi tệp. Nó được gọi là gì? A. Thư mục gốc · B. Thư mục người dùng · C. Thư mục cha · D. Thư mục hiện hành.</p>
<p>📚 <strong>root directory</strong> = thư mục gốc · <strong>single-level</strong> = một mức · <strong>current (working) directory</strong> = thư mục hiện hành.</p>
<p class="dap-an">✅ <strong>A.</strong> Mục 4.2.1 (hệ thống thư mục một mức): "Đôi khi nó được gọi là thư mục gốc, nhưng vì chỉ có một thư mục nên tên gọi không quan trọng." Máy tính cá nhân đời đầu và siêu máy tính đầu tiên (CDC 6600) làm đúng như vậy.</p>
<ul><li>B — mỗi người dùng một thư mục là thiết kế hai mức. C — thư mục nằm trên một thư mục khác (<code>..</code>). D — thư mục làm việc của một tiến trình.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 13.</p>
<h3>Câu 24 — sector 0 của đĩa</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q24.png" alt="Ảnh đề gốc câu 24" loading="lazy" /></p></details>
<p>🇬🇧 <em>In file systems, what is sector 0 of the disk called?</em><br>A. Boot block · B. Superblock · C. MBR (Master Boot Record) · D. Free space mgmt</p>
<p>🇻🇳 Trong hệ thống tệp, sector 0 của đĩa gọi là gì? A. Khối khởi động · B. Siêu khối · C. MBR (bản ghi khởi động chính) · D. Quản lý chỗ trống.</p>
<p>📚 <strong>sector</strong> = cung từ (đơn vị nhỏ nhất đọc/ghi được của đĩa) · <strong>boot block</strong> = khối khởi động · <strong>superblock</strong> = siêu khối · <strong>partition table</strong> = bảng phân vùng.</p>
<p class="dap-an">✅ <strong>C.</strong> Hình 4-9: sector 0 chứa MBR (mã khởi động + bảng phân vùng). BIOS chạy nó; nó tìm phân vùng đang hoạt động rồi chạy khối đầu tiên <em>của phân vùng đó</em>.</p>
<ul><li>A — khối khởi động là khối đầu của <em>từng phân vùng</em>. B — siêu khối nằm ngay sau, giữ các tham số của hệ thống tệp. D — bitmap hay danh sách chỗ trống đứng sau siêu khối. Đĩa UEFI ngày nay dùng GPT, vẫn giữ một "MBR bảo vệ" ở sector 0.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 17.</p>
<h3>Câu 25 — cách truy cập cho tệp lớn (chữ ngoài giáo trình)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q25.png" alt="Ảnh đề gốc câu 25" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which file access method is often used to optimize access to large files in a file system?</em><br>A. Sequential access · B. Direct access · C. Indexed access · D. Linked access</p>
<p>🇻🇳 Phương pháp truy cập tệp nào thường dùng để tối ưu việc truy cập tệp lớn? A. Truy cập tuần tự · B. Truy cập trực tiếp · C. Truy cập theo chỉ mục · D. Truy cập liên kết.</p>
<p>📚 <strong>access method</strong> = phương pháp truy cập · <strong>sequential</strong> = tuần tự · <strong>direct (random) access</strong> = truy cập trực tiếp (ngẫu nhiên) · <strong>optimize</strong> = tối ưu.</p>
<p class="dap-an">✅ <strong>C</strong> (khoá ngân hàng). Tanenbaum chỉ gọi tên hai cách truy cập: tuần tự và ngẫu nhiên (= trực tiếp). "Truy cập theo chỉ mục" lấy từ Silberschatz: dựng một chỉ mục trên nền truy cập trực tiếp, tìm trong chỉ mục nhỏ rồi nhảy thẳng tới bản ghi — cách dùng cho tệp lớn như cơ sở dữ liệu.</p>
<ul><li>A — đọc từ đầu là cách chậm nhất để tới giữa một tệp lớn. B — truy cập trực tiếp là nền của truy cập chỉ mục, nên không sai hẳn — nhưng "tối ưu tệp lớn" chỉ tới chỉ mục. D — "liên kết" là cách <em>cấp phát</em> khối, không phải cách truy cập tệp.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 9 (truy cập tuần tự và ngẫu nhiên, <code>seek</code>).</p>
<h3>Câu 26 — trường Rock Ridge cho tên khác</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q26.png" alt="Ảnh đề gốc câu 26" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which extension field provides an alternative name for a file or directory?</em><br>A. Alternate Name · B. Relocated Directory · C. Time Stamp · D. Parent Link</p>
<p>🇻🇳 Trường mở rộng nào cung cấp một tên thay thế cho tệp hoặc thư mục? A. Tên thay thế · B. Thư mục bị dời chỗ · C. Mốc thời gian · D. Liên kết tới cha.</p>
<p>📚 <strong>extension field</strong> = trường mở rộng · <strong>alternative name</strong> = tên thay thế · <strong>relocate</strong> = dời chỗ.</p>
<p class="dap-an">✅ <strong>A.</strong> Phần mở rộng Rock Ridge thêm tính năng UNIX cho đĩa CD-ROM ISO 9660 bằng tám trường: PX, PN, SL, <strong>NM — tên thay thế</strong> (tên UNIX dài, phân biệt hoa thường), CL, PL, RE, TF.</p>
<ul><li>B — RE, dời chỗ (chuyển thư mục quá sâu). C — TF, mốc thời gian. D — PL, vị trí thư mục cha. Đều là trường có thật, chỉ không phải trường được hỏi.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-2">4.B</a>, slide 47.</p>
<h3>Câu 27 — gắn (mount) USB</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q27.png" alt="Ảnh đề gốc câu 27" loading="lazy" /></p></details>
<p>🇬🇧 <em>What happens when a USB stick is mounted on the directory /usr/ast/backup in UNIX?</em><br>A. The USB stick becomes inaccessible through the regular file system · B. Files copied to /usr/ast/backup/monday are stored directly on the USB stick · C. Files on the USB stick are deleted · D. The directory /usr/ast/backup is overwritten by the contents of the USB stick</p>
<p>🇻🇳 Khi gắn một USB vào thư mục /usr/ast/backup trong UNIX thì điều gì xảy ra? A. USB không truy cập được qua hệ thống tệp · B. Tệp chép vào /usr/ast/backup/monday được lưu thẳng lên USB · C. Tệp trên USB bị xoá · D. Thư mục /usr/ast/backup bị nội dung USB ghi đè.</p>
<p>📚 <strong>mount</strong> = gắn (hệ thống tệp vào cây thư mục) · <strong>mount point</strong> = điểm gắn · <strong>overwrite</strong> = ghi đè.</p>
<p class="dap-an">✅ <strong>B.</strong> Sau <code>mount</code>, gốc hệ thống tệp của USB <em>hiện ra tại</em> /usr/ast/backup; mọi đường dẫn bên dưới — /usr/ast/backup/monday — nằm trên USB.</p>
<ul><li>A — ngược lại: gắn vào mới truy cập được. C — gắn không đổi gì trên USB. D — thứ đang có trong /usr/ast/backup bị <em>che</em> trong lúc gắn, không bị ghi đè; <code>umount</code> xong nó hiện lại.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 24, và <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slide 35 (Hình 1-22, mount); VFS ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 27.</p>
<h3>Câu 33 — việc của hệ thống tệp</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q33.png" alt="Ảnh đề gốc câu 33" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is the role of the file system in disk management?</em><br>A. To allocate memory for disk operations. · B. To manage the disk's hardware components. · C. To organize and track files and data on the disk. · D. To design disk controllers.</p>
<p>🇻🇳 Hệ thống tệp đóng vai trò gì trong quản lý đĩa? A. Cấp bộ nhớ cho thao tác đĩa · B. Quản lý linh kiện phần cứng của đĩa · C. Tổ chức và theo dõi tệp, dữ liệu trên đĩa · D. Thiết kế bộ điều khiển đĩa.</p>
<p>📚 <strong>organize</strong> = tổ chức · <strong>track</strong> = theo dõi · <strong>disk controller</strong> = bộ điều khiển đĩa.</p>
<p class="dap-an">✅ <strong>C.</strong> Hệ thống tệp biến cái đĩa — một mảng khối dài — thành các tệp và thư mục có tên, và ghi nhớ khối nào thuộc tệp nào, khối nào còn trống.</p>
<ul><li>A — bộ nhớ cho vùng đệm là việc của block cache. B — driver và bộ điều khiển lo phần cứng. D — kỹ sư phần cứng thiết kế bộ điều khiển.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 2–4.</p>`),
    bi(`<h2>Chapter 5 — Input/output (8 questions)</h2>
<h3>Q21 — the purpose of DMA</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q21.png" alt="Original question 21" loading="lazy" /></p></details>
<p><em>What is the purpose of Direct Memory Access (DMA) in an operating system?</em><br>A. To allocate memory to processes · B. To allow devices to transfer data to and from memory without CPU intervention · C. To provide direct access to the CPU · D. To prevent access to system memory · E. To manage virtual memory</p>
<p class="dap-an">✅ <strong>B.</strong> The CPU programs the DMA controller (memory address, byte count, direction) and goes back to other work; the controller moves the data over the bus and interrupts once at the end.</p>
<ul><li>A, E — memory management, Ch. 3. C — "direct" in DMA means direct to <em>memory</em>, bypassing the CPU. D — the opposite of its purpose.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slide 6.</p>
<h3>Q28 — how a device notifies the CPU</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q28.png" alt="Original question 28" loading="lazy" /></p></details>
<p><em>The hardware mechanism that allows a device to notify the CPU is called</em><br>A. interrupt · B. polling · C. driver · D. controlling</p>
<p class="dap-an">✅ <strong>A.</strong> The device's controller asserts a signal on a bus line; the interrupt controller passes it to the CPU, which jumps to the handler.</p>
<ul><li>B — polling is the CPU asking the device, the other direction. C — a driver is software. D — not a mechanism.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slides 7, 13.</p>
<h3>Q29 — the spindle (the key is WRONG)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q29.png" alt="Original question 29" loading="lazy" /></p></details>
<p><em>What is the purpose of the spindle in a hard disk drive?</em><br>A. To store data temporarily · B. To read and write data to the platters · C. To control the movement of the read/write head · D. To provide power to the disk · E. To cool the disk during operation</p>
<div class="callout danger"><p><strong>Bank key: B. Correct answer: none of the options.</strong> The spindle is the axle, driven by a motor, on which the platters are stacked; it <em>spins</em> them (5400–15 000 rpm) so that every sector of a track passes under the head. Reading and writing is the job of the <strong>heads</strong> (B); moving them is the <strong>actuator arm</strong> (C); temporary storage is the drive's <strong>cache/buffer</strong> (A); D and E are nonsense.</p></div>
<p class="dap-an">✅ <strong>In the exam: choose B</strong> — no option is right, and B is the one the bank expects (it at least names the platters the spindle carries). Know the real answer: the spindle rotates the platters.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slides 24–25 (magnetic disks: platters, heads, arm — the slides do not name the spindle).</p>
<h3>Q30 — seek time</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q30.png" alt="Original question 30" loading="lazy" /></p></details>
<p><em>What is the time it takes to move the arm to the proper cylinder called?</em><br>A. Seek time · B. Position time · C. Rotational delay · D. Transfer time</p>
<p class="dap-an">✅ <strong>A.</strong> Reading a block costs three times: <strong>seek</strong> (arm to the cylinder), <strong>rotational delay</strong> (the sector comes under the head), <strong>transfer</strong>. The same idea is asked again in Q35.</p>
<ul><li>B — not a term of the book. C, D — the other two components.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slides 24, 31.</p>
<h3>Q31 — the controller's second job</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q31.png" alt="Original question 31" loading="lazy" /></p></details>
<p><em>In data communication and I/O (Input/Output) operations, besides converting the serial bit stream into a block of bytes, what else does the controller's job do?</em><br>A. Perform any error correction necessary · B. Perform convert the sequence bit stream into a block of bytes · C. Perform connecting I/O devices · D. Perform read and write serial bit stream into a block of bytes</p>
<p class="dap-an">✅ <strong>A.</strong> §5.1.2, word for word: "The controller's job is to convert the serial bit stream into a block of bytes and perform any error correction necessary." A disk controller reads the preamble, the 4096 bits of a sector and the ECC, assembles the block in its buffer, checks the ECC, then copies the block to memory.</p>
<ul><li>B, D — repeat the conversion the stem has already excluded ("besides…"). C — the cable and the connector do that.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slides 2–3.</p>
<h3>Q32 — interrupts instead of polling (= FE1 Q31)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q32.png" alt="Original question 32" loading="lazy" /></p></details>
<p><em>What is the effect of using interrupts instead of polling for I/O?</em><br>A. Slower response time to external events · B. Higher CPU usage due to constant checking · C. More efficient use of processor cycles · D. Reduced control over process priorities</p>
<p class="dap-an">✅ <strong>C.</strong> With polling (programmed I/O) the CPU busy-waits on the device's status register; with interrupts it runs other processes and is told when the device is ready. Same as FE1 Q31.</p>
<ul><li>B — constant checking is polling. A — interrupts react at once. D — unrelated.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slides 11–13.</p>
<h3>Q34 — RAID and one-sector requests (the key is WRONG)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q34.png" alt="Original question 34" loading="lazy" /></p></details>
<p><em>RAID level ____ works worst with operating systems that habitually ask for data one sector at a time</em><br>A. 0 · B. 1 · C. 2 · D. 3</p>
<div class="callout danger"><p><strong>Bank key: D (3). Correct answer: A (0).</strong> The stem copies the book's paragraph on <strong>RAID level 0</strong>: data is cut into strips of k sectors spread round-robin over the drives, which is great for large requests (several drives work in parallel) — but "it works worst with operating systems that habitually ask for data one sector at a time. The results will be correct, but there is no parallelism and hence no performance gain." One sector lives in one strip on one drive. RAID 2 and 3 split even a single sector over all drives (bit/byte level), so a one-sector request <em>does</em> use them all in parallel. FE15#41 carries the same wrong key; FE8#38 keys 2.</p></div>
<p class="dap-an">✅ <strong>In the exam: choose A (0)</strong> — the book's own sentence. This is the "the stem copies a sentence of the book" case of the <a href="/courses/operating-systems/learn?lessonSlug=osg202-on-fe-chien-thuat">FE strategy lesson</a>.</p>
<ul><li>B — RAID 1 (mirroring) can even serve a single read from either copy; nothing "worst" about it.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slides 26–27 (Fig. 5-20).</p>
<h3>Q35 — seek time, again (= FE1 Q27)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q35.png" alt="Original question 35" loading="lazy" /></p></details>
<p><em>Time to move the arm to the proper cylinder is called?</em><br>A. Seek time · B. Rotational delay · C. Actual data transfer time · D. Access time</p>
<p class="dap-an">✅ <strong>A.</strong> Q30 in other words — the paper asks the same thing twice; it is also FE1 Q27 word for word. Seek dominates disk time, which is why the arm-scheduling algorithms exist.</p>
<ul><li>B, C — the other two components. D — access time is the total of all three.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slides 24–25, 31.</p>`,
    `<h2>Chương 5 — Vào/ra (8 câu)</h2>
<h3>Câu 21 — mục đích của DMA</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q21.png" alt="Ảnh đề gốc câu 21" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is the purpose of Direct Memory Access (DMA) in an operating system?</em><br>A. To allocate memory to processes · B. To allow devices to transfer data to and from memory without CPU intervention · C. To provide direct access to the CPU · D. To prevent access to system memory · E. To manage virtual memory</p>
<p>🇻🇳 Truy cập bộ nhớ trực tiếp (DMA) dùng để làm gì? A. Cấp bộ nhớ cho tiến trình · B. Cho thiết bị truyền dữ liệu tới/từ bộ nhớ mà CPU không phải can thiệp · C. Cho truy cập trực tiếp vào CPU · D. Ngăn truy cập bộ nhớ hệ thống · E. Quản lý bộ nhớ ảo.</p>
<p>📚 <strong>DMA (Direct Memory Access)</strong> = truy cập bộ nhớ trực tiếp · <strong>intervention</strong> = sự can thiệp.</p>
<p class="dap-an">✅ <strong>B.</strong> CPU lập trình bộ điều khiển DMA (địa chỉ bộ nhớ, số byte, chiều truyền) rồi quay về việc khác; bộ điều khiển tự chuyển dữ liệu qua bus và chỉ ngắt một lần khi xong.</p>
<ul><li>A, E — quản lý bộ nhớ, Ch. 3. C — "direct" trong DMA là trực tiếp tới <em>bộ nhớ</em>, vòng qua CPU. D — ngược với mục đích của nó.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slide 6.</p>
<h3>Câu 28 — thiết bị báo cho CPU bằng gì</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q28.png" alt="Ảnh đề gốc câu 28" loading="lazy" /></p></details>
<p>🇬🇧 <em>The hardware mechanism that allows a device to notify the CPU is called</em><br>A. interrupt · B. polling · C. driver · D. controlling</p>
<p>🇻🇳 Cơ chế phần cứng cho phép thiết bị báo cho CPU được gọi là gì? A. Ngắt · B. Thăm dò · C. Trình điều khiển · D. Điều khiển.</p>
<p>📚 <strong>notify</strong> = báo, thông báo · <strong>interrupt</strong> = ngắt · <strong>polling</strong> = thăm dò (hỏi vòng).</p>
<p class="dap-an">✅ <strong>A.</strong> Bộ điều khiển thiết bị bật tín hiệu trên một đường bus; bộ điều khiển ngắt chuyển nó tới CPU, CPU nhảy vào trình xử lý ngắt.</p>
<ul><li>B — thăm dò là CPU hỏi thiết bị, chiều ngược lại. C — driver là phần mềm. D — không phải một cơ chế.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slide 7, 13.</p>
<h3>Câu 29 — trục quay (khoá SAI)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q29.png" alt="Ảnh đề gốc câu 29" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is the purpose of the spindle in a hard disk drive?</em><br>A. To store data temporarily · B. To read and write data to the platters · C. To control the movement of the read/write head · D. To provide power to the disk · E. To cool the disk during operation</p>
<p>🇻🇳 Trục quay (spindle) trong ổ đĩa cứng dùng để làm gì? A. Lưu dữ liệu tạm · B. Đọc và ghi dữ liệu lên các đĩa từ · C. Điều khiển chuyển động của đầu đọc/ghi · D. Cấp điện cho đĩa · E. Làm mát đĩa khi chạy.</p>
<p>📚 <strong>spindle</strong> = trục quay · <strong>platter</strong> = đĩa từ (mặt đĩa) · <strong>read/write head</strong> = đầu đọc/ghi · <strong>actuator arm</strong> = cần dẫn động.</p>
<div class="callout danger"><p><strong>Khoá ngân hàng: B. Đáp án đúng: không phương án nào.</strong> Trục quay là cái trục, có động cơ kéo, trên đó xếp chồng các đĩa từ; nó <em>quay</em> chúng (5400–15 000 vòng/phút) để mọi sector của một rãnh lần lượt đi qua dưới đầu đọc. Đọc và ghi là việc của <strong>đầu đọc/ghi</strong> (B); di chuyển đầu là <strong>cần dẫn động</strong> (C); lưu tạm là <strong>bộ đệm/cache</strong> của ổ (A); D và E vô nghĩa.</p></div>
<p class="dap-an">✅ <strong>Khi thi: chọn B</strong> — không phương án nào đúng, và B là phương án ngân hàng chờ (ít ra nó nhắc tới các đĩa từ mà trục quay mang). Nhớ đáp án thật: trục quay làm các đĩa từ quay.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 24–25 (đĩa từ: mặt đĩa, đầu đọc, cần — slide không nhắc tên trục quay).</p>
<h3>Câu 30 — thời gian tìm</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q30.png" alt="Ảnh đề gốc câu 30" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is the time it takes to move the arm to the proper cylinder called?</em><br>A. Seek time · B. Position time · C. Rotational delay · D. Transfer time</p>
<p>🇻🇳 Thời gian đưa cần đọc tới đúng cylinder gọi là gì? A. Thời gian tìm · B. Thời gian định vị · C. Độ trễ quay · D. Thời gian truyền.</p>
<p>📚 <strong>seek time</strong> = thời gian tìm · <strong>rotational delay</strong> = độ trễ quay · <strong>cylinder</strong> = trụ (các rãnh cùng bán kính trên mọi mặt đĩa).</p>
<p class="dap-an">✅ <strong>A.</strong> Đọc một khối tốn ba khoảng: <strong>tìm</strong> (đưa cần tới cylinder), <strong>độ trễ quay</strong> (chờ sector quay tới dưới đầu đọc), <strong>truyền</strong>. Câu 35 hỏi lại đúng ý này.</p>
<ul><li>B — không phải thuật ngữ của sách. C, D — hai thành phần còn lại.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 24, 31.</p>
<h3>Câu 31 — việc thứ hai của bộ điều khiển</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q31.png" alt="Ảnh đề gốc câu 31" loading="lazy" /></p></details>
<p>🇬🇧 <em>In data communication and I/O (Input/Output) operations, besides converting the serial bit stream into a block of bytes, what else does the controller's job do?</em><br>A. Perform any error correction necessary · B. Perform convert the sequence bit stream into a block of bytes · C. Perform connecting I/O devices · D. Perform read and write serial bit stream into a block of bytes</p>
<p>🇻🇳 Trong thao tác I/O, ngoài việc đổi dòng bit nối tiếp thành một khối byte, bộ điều khiển còn làm gì? A. Sửa mọi lỗi cần sửa · B. Đổi dòng bit thành khối byte · C. Kết nối các thiết bị I/O · D. Đọc ghi dòng bit nối tiếp thành khối byte.</p>
<p>📚 <strong>controller</strong> = bộ điều khiển (phần cứng gắn với thiết bị) · <strong>serial bit stream</strong> = dòng bit nối tiếp · <strong>error correction</strong> = sửa lỗi (ECC).</p>
<p class="dap-an">✅ <strong>A.</strong> Mục 5.1.2, nguyên văn: "Việc của bộ điều khiển là đổi dòng bit nối tiếp thành một khối byte và sửa mọi lỗi cần sửa." Bộ điều khiển đĩa đọc phần mở đầu, 4096 bit của một sector và mã ECC, ráp khối trong vùng đệm của nó, kiểm ECC, rồi mới chép khối vào bộ nhớ.</p>
<ul><li>B, D — nhắc lại việc chuyển đổi mà đề đã loại ("besides…" = ngoài ra). C — đó là việc của dây cáp và đầu nối.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slide 2–3.</p>
<h3>Câu 32 — ngắt thay cho thăm dò (= câu 31 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q32.png" alt="Ảnh đề gốc câu 32" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is the effect of using interrupts instead of polling for I/O?</em><br>A. Slower response time to external events · B. Higher CPU usage due to constant checking · C. More efficient use of processor cycles · D. Reduced control over process priorities</p>
<p>🇻🇳 Dùng ngắt thay cho thăm dò (polling) khi làm I/O thì được gì? A. Phản ứng với sự kiện ngoài chậm hơn · B. CPU bận hơn vì kiểm liên tục · C. Dùng chu kỳ CPU hiệu quả hơn · D. Khó điều khiển ưu tiên tiến trình.</p>
<p>📚 <strong>processor cycles</strong> = chu kỳ của bộ xử lý · <strong>busy waiting</strong> = chờ bận.</p>
<p class="dap-an">✅ <strong>C.</strong> Thăm dò (I/O lập trình) thì CPU chờ bận trên thanh ghi trạng thái của thiết bị; dùng ngắt thì CPU chạy tiến trình khác và được báo khi thiết bị sẵn sàng. Giống câu 31 FE1.</p>
<ul><li>B — kiểm liên tục chính là thăm dò. A — ngắt phản ứng ngay. D — không liên quan.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slide 11–13.</p>
<h3>Câu 34 — RAID và yêu cầu từng sector (khoá SAI)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q34.png" alt="Ảnh đề gốc câu 34" loading="lazy" /></p></details>
<p>🇬🇧 <em>RAID level ____ works worst with operating systems that habitually ask for data one sector at a time</em><br>A. 0 · B. 1 · C. 2 · D. 3</p>
<p>🇻🇳 RAID mức ___ hoạt động tệ nhất với các HĐH có thói quen xin dữ liệu từng sector một.</p>
<p>📚 <strong>habitually</strong> = theo thói quen · <strong>works worst</strong> = chạy tệ nhất · <strong>strip</strong> = dải (k sector liên tiếp trên một ổ).</p>
<div class="callout danger"><p><strong>Khoá ngân hàng: D (3). Đáp án đúng: A (0).</strong> Đề chép đoạn văn của sách về <strong>RAID mức 0</strong>: dữ liệu cắt thành các dải k sector rải vòng tròn lên các ổ, rất tốt với yêu cầu lớn (nhiều ổ làm song song) — nhưng "nó chạy tệ nhất với các HĐH có thói quen xin dữ liệu từng sector một. Kết quả vẫn đúng, nhưng không có song song nên không được lợi gì về hiệu năng." Một sector nằm trong một dải trên một ổ. RAID 2 và 3 cắt cả một sector ra mọi ổ (mức bit/byte), nên yêu cầu một sector <em>vẫn</em> dùng song song mọi ổ. FE15#41 mang cùng khoá sai; FE8#38 khoá 2.</p></div>
<p class="dap-an">✅ <strong>Khi thi: chọn A (0)</strong> — đúng câu của sách. Đây là trường hợp "đề chép nguyên câu của sách" trong <a href="/courses/operating-systems/learn?lessonSlug=osg202-on-fe-chien-thuat">bài chiến thuật FE</a>.</p>
<ul><li>B — RAID 1 (nhân bản) còn đọc được một sector từ bản nào cũng được; chẳng có gì "tệ nhất".</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 26–27 (Hình 5-20).</p>
<h3>Câu 35 — lại thời gian tìm (= câu 27 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q35.png" alt="Ảnh đề gốc câu 35" loading="lazy" /></p></details>
<p>🇬🇧 <em>Time to move the arm to the proper cylinder is called?</em><br>A. Seek time · B. Rotational delay · C. Actual data transfer time · D. Access time</p>
<p>🇻🇳 Thời gian di chuyển cần đọc tới đúng cylinder gọi là gì? A. Thời gian tìm · B. Độ trễ quay · C. Thời gian truyền dữ liệu thực · D. Thời gian truy cập.</p>
<p>📚 <strong>access time</strong> = thời gian truy cập (tổng ba thành phần).</p>
<p class="dap-an">✅ <strong>A.</strong> Câu 30 nói bằng chữ khác — đề hỏi cùng một ý hai lần; nó cũng là câu 27 của FE1 không sai một chữ. Thời gian tìm chiếm phần lớn, nên mới có các thuật toán lập lịch đầu từ.</p>
<ul><li>B, C — hai thành phần kia. D — thời gian truy cập là tổng cả ba.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 24–25, 31.</p>`),
    bi(`<h2>Chapter 6 — Deadlocks (9 questions)</h2>
<h3>Q36 — what the banker checks</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q36.png" alt="Original question 36" loading="lazy" /></p></details>
<p><em>What does the Banker's Algorithm check before granting a resource request?</em><br>A. If granting the request will lead to a safe state. · B. If the request is within the current needs of the process. · C. If there are enough resources available. · D. If the requesting process has priority.</p>
<p class="dap-an">✅ <strong>A.</strong> The banker pretends to grant, then runs the safety check: can every process still finish in some order? Yes ⇒ grant; no ⇒ make the process wait, <em>even if</em> the resources are free right now.</p>
<ul><li>B, C — preliminary checks (a request above the declared maximum is an error; above what is free must wait) — necessary, but they are not what makes the banker avoid deadlock. D — the banker knows nothing about priorities.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 23–25.</p>
<h3>Q37 — preventing hold and wait (three options are true)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q37.png" alt="Original question 37" loading="lazy" /></p></details>
<p><em>To ensure that the hold and wait condition never occurs in the system, it must be ensured that __________</em><br>A. whenever a resource is requested by a process, it is not holding any other resources · B. each process must request and be allocated at least one of its resources before it begins its execution · C. each process must request and be allocated all its resources before it begins its execution · D. a process can request resources only when it has none</p>
<p class="dap-an">✅ <strong>A</strong> (bank key). A is the <em>condition</em> itself, in Silberschatz's words: "whenever a process requests a resource, it does not hold any other resources". C and D are the two <em>protocols</em> that guarantee it — ask for everything up front (Tanenbaum's version), or release everything before asking again. All three are true; A is the most general, so it is the key.</p>
<ul><li>B — "at least one" is the only false option: holding one resource and then asking for more is exactly hold and wait. C, D — true, but they are ways to reach A.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 26.</p>
<h3>Q38 — prevention that keeps utilization high</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q38.png" alt="Original question 38" loading="lazy" /></p></details>
<p><em>Which resource allocation strategy is most likely to prevent deadlock while still allowing high resource utilization?</em><br>A. Granting requests based on the order they arrive · B. Preempting resources whenever a higher-priority process arrives · C. Allowing processes to hold resources indefinitely until they complete · D. Allocating resources based on a resource hierarchy</p>
<p class="dap-an">✅ <strong>D.</strong> Number the resources and request them in increasing order (Fig. 6-13): circular wait becomes impossible, yet each process still asks only for what it needs, when it needs it — no idle reservations.</p>
<ul><li>A — FIFO granting prevents nothing. B — preempting a printer or a lock mid-use breaks the work, and it wastes what was done. C — that is hold and wait, one of the four conditions.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 27–28.</p>
<h3>Q39 — a necessary condition</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q39.png" alt="Original question 39" loading="lazy" /></p></details>
<p><em>Which condition must be present for deadlock to occur?</em><br>A. Preemption of processes during execution · B. Circular wait among resource holders · C. Dynamic allocation of memory blocks · D. Termination of all low-priority threads</p>
<p class="dap-an">✅ <strong>B.</strong> Coffman's four conditions: mutual exclusion, hold and wait, <strong>no</strong> preemption, circular wait. Only B is among the options.</p>
<ul><li>A — the trap: the condition is <em>no</em> preemption; preemption would break the deadlock. C, D — unrelated.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 6.</p>
<h3>Q46 — order of execution with a Request matrix (computed)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q46.png" alt="Original question 46" loading="lazy" /></p></details>
<p><em>A system has three processes: P1, P2, P3 and four resources: RS1, RS2, RS3, RS4. The following allocation (C1, C2, C3) and request (R1, R2, R3) matrices are given: Allocated: P1 = (1,0,0,1), P2 = (2,1,0,1), P3 = (0,1,2,0); Requested: P1 = (2,0,0,1), P2 = (0,1,1,0), P3 = (1,1,0,0). Available resources: (2,1,0,1). What is the correct execution order of processes?</em><br>A. P3 → P2 → P1 · B. P2 → P1 → P3 · C. P1 → P2 → P3 · D. P2 → P3 → P1</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d2933895cca6c89ce9c23948094a776d80b624c7.svg" alt="Each option played step by step against Available" loading="lazy" /><p class="chu-thich">🧮 Each option played step by step against Available</p></div>
<table>
<thead><tr><th>Option A runs</th><th>Request</th><th>Available before</th><th>Available after (+ Allocated)</th></tr></thead>
<tbody>
<tr><td>P3</td><td>(1 1 0 0)</td><td>(2 1 0 1)</td><td>(2 1 0 1) + (0 1 2 0) = (2 2 2 1)</td></tr>
<tr><td>P2</td><td>(0 1 1 0)</td><td>(2 2 2 1)</td><td>(2 2 2 1) + (2 1 0 1) = (4 3 2 2)</td></tr>
<tr><td>P1</td><td>(2 0 0 1)</td><td>(4 3 2 2)</td><td>(4 3 2 2) + (1 0 0 1) = (5 3 2 3)</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p3: server một luồng — yêu cầu nào cũng tốn 12 ms CPU; 1/3 số yêu cầu (trượt cache khối) chờ thêm 75 ms đĩa, luồng duy nhất ngủ
//     theo ⇒ không phục vụ ai trong lúc đó. Xét một chu kỳ 3 yêu cầu (trúng, trúng, trượt) rồi chia.
const P3 = { cpu: 12, dia: 75, tiLeDia: [1, 3], phuongAn: [30, 37, 35, 28] };
function tinhP3() {
  const [a, b] = P3.tiLeDia;                                   // a trên b yêu cầu cần đĩa
  const chuKy = b * P3.cpu + a * P3.dia;                       // ms cho b yêu cầu, xử lý NỐI ĐUÔI
  const tb = chuKy / b;                                        // ms trung bình mỗi yêu cầu
  const motLuong = 1000 / tb;                                  // yêu cầu / giây, một luồng
  const nhieuLuong = 1000 / P3.cpu;                            // nhiều luồng: CPU không đứng chờ đĩa
  return { chuKy, tb, motLuong, nhieuLuong };
}
// p45: bảng đoạn — dữ liệu chép từ đề
const DOAN = [{ coSo: 219, gioiHan: 600 }, { coSo: 2300, gioiHan: 14 }, { coSo: 90, gioiHan: 100 }, { coSo: 1327, gioiHan: 580 }, { coSo: 1952, gioiHan: 96 }];
const tinhP45 = () =&gt; dichDoan(2, 50, DOAN);
// p46: Allocated (C) / Requested (R), Available — dùng đúng phép kiểm của nhà băng với "cần thêm" = Requested
const C46 = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R46 = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A46 = [2, 1, 0, 1];
const PA46 = [[2, 1, 0], [1, 0, 2], [0, 1, 2], [1, 2, 0]];      // phương án A–D (chỉ số 0 = P1)
const kiem46 = (chuoi) =&gt; kiemChuoi({ conLai: A46, giuLai: C46, canThem: R46, chuoi });
// p48: một loại tài nguyên (MOS 4e Hình 6-9) — tổng 15, đã cấp 3 + 4 + 3 = 10 ⇒ trống 5 (khớp số đề cho)
const HAS48 = [3, 4, 3], MAX48 = [8, 6, 5], TONG48 = 15, FREE48 = 5;</code></pre></details>
<p class="dap-an">✅ <strong>A — P3 → P2 → P1</strong>, the bank's key. P3 asks (1 1 0 0) ≤ (2 1 0 1) ⇒ runs, returns (0 1 2 0) ⇒ Available (2 2 2 1); now P2's (0 1 1 0) fits ⇒ (4 3 2 2); P1 last.</p>
<ul><li>B, D — P2 first is impossible: it needs one RS3 and none is free. C — after P1, Available is (3 1 0 2): still no RS3 for P2.</li></ul>
<p class="pitfall">⚠️ Check the options, do not compute "your" order and look for it. The book's loop (scan from P1) finds <strong>P1 → P3 → P2</strong> — also valid, and not among the options. Whoever stops there wastes minutes looking for an answer that is not printed.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 16–18 (detection with a Request matrix, Fig. 6-6/6-7).</p>
<h3>Q47 — prevention in embedded and real-time systems</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q47.png" alt="Original question 47" loading="lazy" /></p></details>
<p><em>Why is deadlock prevention often favored in embedded or real-time systems over avoidance?</em><br>A. Guarantees fixed timing without complex runtime checks · B. Allows resource sharing in dynamic threads · C. Uses fewer memory segments during paging · D. Facilitate integration with authentication systems across process layers</p>
<p class="dap-an">✅ <strong>A.</strong> Prevention is decided once, at design time (e.g. a fixed lock order); avoidance runs the banker's safety check on every request — extra time whose length varies, which a real-time system cannot afford.</p>
<ul><li>B — prevention restricts sharing rather than allowing more. C, D — paging and authentication have nothing to do with it.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 25–26.</p>
<h3>Q48 — 15 memory blocks, is it safe? (computed)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q48.png" alt="Original question 48" loading="lazy" /></p></details>
<p><em>A system has 15 memory blocks and three processes: P1, P2, P3. Their memory requirements and allocations are given below: P1: Maximum Needed 8, Allocated 3 · P2: Maximum Needed 6, Allocated 4 · P3: Maximum Needed 5, Allocated 3. If the number of available memory blocks in the system at this moment is 5, what is the state of the system?</em><br>A. Safe · B. Unsafe · C. Deadlock · D. Starvation</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4556e36d34559e1da113a026ca5af5dd0989cfac.svg" alt="The banker for one resource type (Fig. 6-9): still needs ≤ free ⇒ run it to the end, take back what it has" loading="lazy" /><p class="chu-thich">🧮 The banker for one resource type (Fig. 6-9): still needs ≤ free ⇒ run it to the end, take back what it has</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p3: server một luồng — yêu cầu nào cũng tốn 12 ms CPU; 1/3 số yêu cầu (trượt cache khối) chờ thêm 75 ms đĩa, luồng duy nhất ngủ
//     theo ⇒ không phục vụ ai trong lúc đó. Xét một chu kỳ 3 yêu cầu (trúng, trúng, trượt) rồi chia.
const P3 = { cpu: 12, dia: 75, tiLeDia: [1, 3], phuongAn: [30, 37, 35, 28] };
function tinhP3() {
  const [a, b] = P3.tiLeDia;                                   // a trên b yêu cầu cần đĩa
  const chuKy = b * P3.cpu + a * P3.dia;                       // ms cho b yêu cầu, xử lý NỐI ĐUÔI
  const tb = chuKy / b;                                        // ms trung bình mỗi yêu cầu
  const motLuong = 1000 / tb;                                  // yêu cầu / giây, một luồng
  const nhieuLuong = 1000 / P3.cpu;                            // nhiều luồng: CPU không đứng chờ đĩa
  return { chuKy, tb, motLuong, nhieuLuong };
}
// p45: bảng đoạn — dữ liệu chép từ đề
const DOAN = [{ coSo: 219, gioiHan: 600 }, { coSo: 2300, gioiHan: 14 }, { coSo: 90, gioiHan: 100 }, { coSo: 1327, gioiHan: 580 }, { coSo: 1952, gioiHan: 96 }];
const tinhP45 = () =&gt; dichDoan(2, 50, DOAN);
// p46: Allocated (C) / Requested (R), Available — dùng đúng phép kiểm của nhà băng với "cần thêm" = Requested
const C46 = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R46 = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A46 = [2, 1, 0, 1];
const PA46 = [[2, 1, 0], [1, 0, 2], [0, 1, 2], [1, 2, 0]];      // phương án A–D (chỉ số 0 = P1)
const kiem46 = (chuoi) =&gt; kiemChuoi({ conLai: A46, giuLai: C46, canThem: R46, chuoi });
// p48: một loại tài nguyên (MOS 4e Hình 6-9) — tổng 15, đã cấp 3 + 4 + 3 = 10 ⇒ trống 5 (khớp số đề cho)
const HAS48 = [3, 4, 3], MAX48 = [8, 6, 5], TONG48 = 15, FREE48 = 5;</code></pre></details>
<p class="dap-an">✅ <strong>A — safe.</strong> Still needed: P1 5, P2 2, P3 2; free 5 (= 15 − 10, consistent with the question). Every one fits at the start; run P1 ⇒ 8 free, P2 ⇒ 12, P3 ⇒ 15. One finishing order is enough. Bank key A.</p>
<ul><li>B — would need a moment where nobody's remaining need fits. C — deadlock is about processes already blocked on each other; nobody is waiting here. D — starvation is a scheduling-over-time issue, a single table cannot show it.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 21–23.</p>
<h3>Q49 — safety-critical systems</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q49.png" alt="Original question 49" loading="lazy" /></p></details>
<p><em>In a system with limited resources, which deadlock handling strategy is most appropriate for safety-critical applications?</em><br>A. Ostrich algorithm · B. Deadlock detection and recovery · C. Deadlock avoidance using Banker's algorithm · D. Terminating all active tasks and reinitializing the system to recover from potential deadlock</p>
<p class="dap-an">✅ <strong>C.</strong> In a safety-critical system a deadlock must never happen at all; the banker never enters an unsafe state, so it never deadlocks.</p>
<ul><li>A — ignoring the problem is acceptable only when deadlocks are rare and cheap. B, D — they let the deadlock happen, then kill or restart work — unacceptable when the work is, say, a brake controller.</li></ul>
<p class="meo">🧠 Q47 and Q49 seem to contradict each other (real time ⇒ prevention; safety-critical ⇒ avoidance). Remember the reason given in each stem: Q47 asks for "no complex runtime checks", Q49 for "never deadlock with limited resources". Both are bank keys.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 20–25.</p>
<h3>Q50 — spooling against no preemption (two book passages disagree)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q50.png" alt="Original question 50" loading="lazy" /></p></details>
<p><em>Which of the following techniques attacks the "No Preemption" condition for preventing deadlocks?</em><br>A. Requiring processes to request all resources at once. · B. Allowing only one process to use a resource at a time. · C. Spooling printer output to disk to allow the printer daemon exclusive access. · D. Ordering resources numerically and requiring processes to request them in increasing order.</p>
<p class="dap-an">✅ <strong>C</strong> (bank key). §6.6.3 "Attacking the No-Preemption Condition" of the book uses exactly this example: when a resource cannot be taken away, <em>virtualize</em> it — spool printer output to disk and let only the printer daemon touch the real printer.</p>
<div class="callout"><p><strong>The book contradicts itself here.</strong> Its summary table, Fig. 6-14, files "spool everything" under <em>mutual exclusion</em>, and the bank follows that table in FE19#49, FE23#39, FE24#20. Rule: follow the words of the stem — "spool everything" ⇒ mutual exclusion; this long sentence inside a no-preemption question ⇒ C.</p></div>
<ul><li>A — attacks hold and wait. B — that <em>is</em> mutual exclusion, not an attack on anything. D — attacks circular wait.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 26, 28 (Fig. 6-14).</p>`,
    `<h2>Chương 6 — Bế tắc (9 câu)</h2>
<h3>Câu 36 — nhà băng kiểm gì</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q36.png" alt="Ảnh đề gốc câu 36" loading="lazy" /></p></details>
<p>🇬🇧 <em>What does the Banker's Algorithm check before granting a resource request?</em><br>A. If granting the request will lead to a safe state. · B. If the request is within the current needs of the process. · C. If there are enough resources available. · D. If the requesting process has priority.</p>
<p>🇻🇳 Trước khi cấp một yêu cầu tài nguyên, thuật toán nhà băng kiểm gì? A. Cấp xong có dẫn tới trạng thái an toàn không · B. Yêu cầu có nằm trong nhu cầu hiện tại của tiến trình không · C. Có đủ tài nguyên rảnh không · D. Tiến trình xin có được ưu tiên không.</p>
<p>📚 <strong>grant</strong> = cấp, chấp thuận · <strong>safe state</strong> = trạng thái an toàn.</p>
<p class="dap-an">✅ <strong>A.</strong> Nhà băng giả vờ cấp, rồi chạy phép kiểm an toàn: mọi tiến trình còn chạy xong được theo một thứ tự nào đó không? Được ⇒ cấp; không ⇒ bắt chờ, <em>dù</em> tài nguyên đang rảnh.</p>
<ul><li>B, C — kiểm sơ bộ (xin vượt mức tối đa đã khai là lỗi; xin nhiều hơn số rảnh thì phải chờ) — cần, nhưng không phải thứ làm nhà băng tránh được bế tắc. D — nhà băng không biết gì về độ ưu tiên.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 23–25.</p>
<h3>Câu 37 — ngăn giữ và chờ (ba phương án đều đúng)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q37.png" alt="Ảnh đề gốc câu 37" loading="lazy" /></p></details>
<p>🇬🇧 <em>To ensure that the hold and wait condition never occurs in the system, it must be ensured that __________</em><br>A. whenever a resource is requested by a process, it is not holding any other resources · B. each process must request and be allocated at least one of its resources before it begins its execution · C. each process must request and be allocated all its resources before it begins its execution · D. a process can request resources only when it has none</p>
<p>🇻🇳 Để điều kiện giữ và chờ không bao giờ xảy ra, phải bảo đảm rằng: A. hễ tiến trình xin tài nguyên thì nó không đang giữ tài nguyên nào khác · B. mỗi tiến trình phải xin và được cấp ít nhất một tài nguyên trước khi chạy · C. mỗi tiến trình phải xin và được cấp mọi tài nguyên trước khi chạy · D. tiến trình chỉ được xin khi không giữ gì.</p>
<p>📚 <strong>hold and wait</strong> = giữ và chờ · <strong>ensure</strong> = bảo đảm · <strong>at least one</strong> = ít nhất một.</p>
<p class="dap-an">✅ <strong>A</strong> (khoá ngân hàng). A chính là <em>điều kiện</em>, đúng chữ Silberschatz: "hễ một tiến trình xin tài nguyên thì nó không đang giữ tài nguyên nào khác". C và D là hai <em>cách làm</em> bảo đảm điều đó — xin hết một lần từ đầu (cách của Tanenbaum), hoặc trả hết rồi mới xin lại. Cả ba đều đúng; A tổng quát nhất nên là khoá.</p>
<ul><li>B — "ít nhất một" là phương án sai duy nhất: giữ một cái rồi xin thêm chính là giữ và chờ. C, D — đúng, nhưng là cách để đạt A.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 26.</p>
<h3>Câu 38 — ngăn bế tắc mà vẫn dùng tài nguyên tốt</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q38.png" alt="Ảnh đề gốc câu 38" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which resource allocation strategy is most likely to prevent deadlock while still allowing high resource utilization?</em><br>A. Granting requests based on the order they arrive · B. Preempting resources whenever a higher-priority process arrives · C. Allowing processes to hold resources indefinitely until they complete · D. Allocating resources based on a resource hierarchy</p>
<p>🇻🇳 Chiến lược cấp phát nào dễ ngăn được bế tắc nhất mà vẫn cho mức sử dụng tài nguyên cao? A. Cấp theo thứ tự yêu cầu tới · B. Giành lại tài nguyên mỗi khi có tiến trình ưu tiên cao hơn tới · C. Cho tiến trình giữ tài nguyên mãi tới khi xong · D. Cấp phát theo phân cấp tài nguyên.</p>
<p>📚 <strong>resource hierarchy</strong> = phân cấp (thứ tự đánh số) tài nguyên · <strong>utilization</strong> = mức sử dụng · <strong>indefinitely</strong> = vô thời hạn.</p>
<p class="dap-an">✅ <strong>D.</strong> Đánh số tài nguyên và chỉ xin theo thứ tự tăng dần (Hình 6-13): chờ vòng tròn không thể xảy ra, mà tiến trình vẫn chỉ xin đúng thứ nó cần, đúng lúc cần — không giữ chỗ phí.</p>
<ul><li>A — cấp theo hàng đợi chẳng ngăn được gì. B — giành máy in hay khoá đang dùng dở là làm hỏng việc, phí cả phần đã làm. C — đó chính là giữ và chờ, một trong bốn điều kiện.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 27–28.</p>
<h3>Câu 39 — một điều kiện cần</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q39.png" alt="Ảnh đề gốc câu 39" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which condition must be present for deadlock to occur?</em><br>A. Preemption of processes during execution · B. Circular wait among resource holders · C. Dynamic allocation of memory blocks · D. Termination of all low-priority threads</p>
<p>🇻🇳 Điều kiện nào phải có thì bế tắc mới xảy ra? A. Trưng dụng tiến trình khi đang chạy · B. Chờ vòng tròn giữa những tiến trình đang giữ tài nguyên · C. Cấp phát động các khối nhớ · D. Kết thúc mọi luồng ưu tiên thấp.</p>
<p>📚 <strong>circular wait</strong> = chờ vòng tròn · <strong>preemption</strong> = trưng dụng (lấy lại cưỡng bức).</p>
<p class="dap-an">✅ <strong>B.</strong> Bốn điều kiện Coffman: loại trừ lẫn nhau, giữ và chờ, <strong>không</strong> trưng dụng, chờ vòng tròn. Chỉ có B nằm trong phương án.</p>
<ul><li>A — bẫy: điều kiện là <em>không</em> trưng dụng; trưng dụng được thì phá được bế tắc. C, D — không liên quan.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 6.</p>
<h3>Câu 46 — thứ tự chạy với ma trận Request (câu tính)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q46.png" alt="Ảnh đề gốc câu 46" loading="lazy" /></p></details>
<p>🇬🇧 <em>A system has three processes: P1, P2, P3 and four resources: RS1, RS2, RS3, RS4. The following allocation (C1, C2, C3) and request (R1, R2, R3) matrices are given: Allocated: P1 = (1,0,0,1), P2 = (2,1,0,1), P3 = (0,1,2,0); Requested: P1 = (2,0,0,1), P2 = (0,1,1,0), P3 = (1,1,0,0). Available resources: (2,1,0,1). What is the correct execution order of processes?</em><br>A. P3 → P2 → P1 · B. P2 → P1 → P3 · C. P1 → P2 → P3 · D. P2 → P3 → P1</p>
<p>🇻🇳 Hệ thống có ba tiến trình và bốn loại tài nguyên; cho ma trận đã cấp (Allocated), ma trận yêu cầu (Requested) và vector rảnh (Available). Thứ tự chạy đúng của các tiến trình là gì?</p>
<p>📚 <strong>allocated</strong> = đã cấp · <strong>requested</strong> = đang xin · <strong>available</strong> = đang rảnh · <strong>execution order</strong> = thứ tự thực thi.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6f3adf8fca225c77c4e8a1bf23729f07aeb1fdb1.svg" alt="Chạy thử từng phương án, từng bước một, so với Available" loading="lazy" /><p class="chu-thich">🧮 Chạy thử từng phương án, từng bước một, so với Available</p></div>
<table>
<thead><tr><th>Phương án A chạy</th><th>Request</th><th>Available trước</th><th>Available sau (+ Allocated)</th></tr></thead>
<tbody>
<tr><td>P3</td><td>(1 1 0 0)</td><td>(2 1 0 1)</td><td>(2 1 0 1) + (0 1 2 0) = (2 2 2 1)</td></tr>
<tr><td>P2</td><td>(0 1 1 0)</td><td>(2 2 2 1)</td><td>(2 2 2 1) + (2 1 0 1) = (4 3 2 2)</td></tr>
<tr><td>P1</td><td>(2 0 0 1)</td><td>(4 3 2 2)</td><td>(4 3 2 2) + (1 0 0 1) = (5 3 2 3)</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p3: server một luồng — yêu cầu nào cũng tốn 12 ms CPU; 1/3 số yêu cầu (trượt cache khối) chờ thêm 75 ms đĩa, luồng duy nhất ngủ
//     theo ⇒ không phục vụ ai trong lúc đó. Xét một chu kỳ 3 yêu cầu (trúng, trúng, trượt) rồi chia.
const P3 = { cpu: 12, dia: 75, tiLeDia: [1, 3], phuongAn: [30, 37, 35, 28] };
function tinhP3() {
  const [a, b] = P3.tiLeDia;                                   // a trên b yêu cầu cần đĩa
  const chuKy = b * P3.cpu + a * P3.dia;                       // ms cho b yêu cầu, xử lý NỐI ĐUÔI
  const tb = chuKy / b;                                        // ms trung bình mỗi yêu cầu
  const motLuong = 1000 / tb;                                  // yêu cầu / giây, một luồng
  const nhieuLuong = 1000 / P3.cpu;                            // nhiều luồng: CPU không đứng chờ đĩa
  return { chuKy, tb, motLuong, nhieuLuong };
}
// p45: bảng đoạn — dữ liệu chép từ đề
const DOAN = [{ coSo: 219, gioiHan: 600 }, { coSo: 2300, gioiHan: 14 }, { coSo: 90, gioiHan: 100 }, { coSo: 1327, gioiHan: 580 }, { coSo: 1952, gioiHan: 96 }];
const tinhP45 = () =&gt; dichDoan(2, 50, DOAN);
// p46: Allocated (C) / Requested (R), Available — dùng đúng phép kiểm của nhà băng với "cần thêm" = Requested
const C46 = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R46 = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A46 = [2, 1, 0, 1];
const PA46 = [[2, 1, 0], [1, 0, 2], [0, 1, 2], [1, 2, 0]];      // phương án A–D (chỉ số 0 = P1)
const kiem46 = (chuoi) =&gt; kiemChuoi({ conLai: A46, giuLai: C46, canThem: R46, chuoi });
// p48: một loại tài nguyên (MOS 4e Hình 6-9) — tổng 15, đã cấp 3 + 4 + 3 = 10 ⇒ trống 5 (khớp số đề cho)
const HAS48 = [3, 4, 3], MAX48 = [8, 6, 5], TONG48 = 15, FREE48 = 5;</code></pre></details>
<p class="dap-an">✅ <strong>A — P3 → P2 → P1</strong>, khoá ngân hàng. P3 xin (1 1 0 0) ≤ (2 1 0 1) ⇒ chạy, trả (0 1 2 0) ⇒ Available (2 2 2 1); giờ (0 1 1 0) của P2 vừa ⇒ (4 3 2 2); P1 sau cùng.</p>
<ul><li>B, D — P2 không thể chạy đầu: nó cần một RS3 mà RS3 đang rảnh 0. C — sau P1, Available là (3 1 0 2): vẫn chưa có RS3 cho P2.</li></ul>
<p class="pitfall">⚠️ Chấm từng phương án, đừng tự tính thứ tự "của mình" rồi đi tìm. Vòng lặp của sách (quét từ P1) ra <strong>P1 → P3 → P2</strong> — cũng hợp lệ, nhưng không có trong phương án. Ai dừng ở đó sẽ mất vài phút tìm một đáp án không được in ra.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 16–18 (phát hiện bế tắc với ma trận Request, Hình 6-6/6-7).</p>
<h3>Câu 47 — ngăn ngừa trong hệ nhúng và thời gian thực</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q47.png" alt="Ảnh đề gốc câu 47" loading="lazy" /></p></details>
<p>🇬🇧 <em>Why is deadlock prevention often favored in embedded or real-time systems over avoidance?</em><br>A. Guarantees fixed timing without complex runtime checks · B. Allows resource sharing in dynamic threads · C. Uses fewer memory segments during paging · D. Facilitate integration with authentication systems across process layers</p>
<p>🇻🇳 Vì sao hệ nhúng hay thời gian thực thường ưa ngăn ngừa bế tắc hơn là tránh bế tắc? A. Bảo đảm thời gian cố định mà không cần kiểm tra phức tạp lúc chạy · B. Cho chia sẻ tài nguyên giữa các luồng động · C. Dùng ít đoạn bộ nhớ hơn khi phân trang · D. Dễ tích hợp với hệ thống xác thực.</p>
<p>📚 <strong>prevention / avoidance</strong> = ngăn ngừa / tránh · <strong>runtime check</strong> = kiểm tra lúc chạy · <strong>embedded</strong> = nhúng.</p>
<p class="dap-an">✅ <strong>A.</strong> Ngăn ngừa được quyết một lần lúc thiết kế (ví dụ thứ tự khoá cố định); tránh thì chạy phép kiểm an toàn của nhà băng ở mỗi yêu cầu — tốn thêm thời gian, lại dài ngắn thất thường, điều hệ thời gian thực không chịu được.</p>
<ul><li>B — ngăn ngừa còn hạn chế chia sẻ chứ không cho thêm. C, D — phân trang và xác thực chẳng liên quan.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 25–26.</p>
<h3>Câu 48 — 15 khối nhớ, có an toàn không? (câu tính)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q48.png" alt="Ảnh đề gốc câu 48" loading="lazy" /></p></details>
<p>🇬🇧 <em>A system has 15 memory blocks and three processes: P1, P2, P3. Their memory requirements and allocations are given below: P1: Maximum Needed 8, Allocated 3 · P2: Maximum Needed 6, Allocated 4 · P3: Maximum Needed 5, Allocated 3. If the number of available memory blocks in the system at this moment is 5, what is the state of the system?</em><br>A. Safe · B. Unsafe · C. Deadlock · D. Starvation</p>
<p>🇻🇳 Hệ thống có 15 khối nhớ, ba tiến trình với nhu cầu tối đa và số đã cấp như trên. Nếu lúc này còn rảnh 5 khối thì hệ thống ở trạng thái nào? A. An toàn · B. Không an toàn · C. Bế tắc · D. Bỏ đói.</p>
<p>📚 <strong>maximum needed</strong> = nhu cầu tối đa · <strong>allocated</strong> = đã cấp · <strong>available</strong> = còn rảnh.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ad4b97664938676f670388949133a9dcdb66a44c.svg" alt="Nhà băng một loại tài nguyên (Hình 6-9): còn cần ≤ trống ⇒ cho chạy tới cùng, thu lại phần nó giữ" loading="lazy" /><p class="chu-thich">🧮 Nhà băng một loại tài nguyên (Hình 6-9): còn cần ≤ trống ⇒ cho chạy tới cùng, thu lại phần nó giữ</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p3: server một luồng — yêu cầu nào cũng tốn 12 ms CPU; 1/3 số yêu cầu (trượt cache khối) chờ thêm 75 ms đĩa, luồng duy nhất ngủ
//     theo ⇒ không phục vụ ai trong lúc đó. Xét một chu kỳ 3 yêu cầu (trúng, trúng, trượt) rồi chia.
const P3 = { cpu: 12, dia: 75, tiLeDia: [1, 3], phuongAn: [30, 37, 35, 28] };
function tinhP3() {
  const [a, b] = P3.tiLeDia;                                   // a trên b yêu cầu cần đĩa
  const chuKy = b * P3.cpu + a * P3.dia;                       // ms cho b yêu cầu, xử lý NỐI ĐUÔI
  const tb = chuKy / b;                                        // ms trung bình mỗi yêu cầu
  const motLuong = 1000 / tb;                                  // yêu cầu / giây, một luồng
  const nhieuLuong = 1000 / P3.cpu;                            // nhiều luồng: CPU không đứng chờ đĩa
  return { chuKy, tb, motLuong, nhieuLuong };
}
// p45: bảng đoạn — dữ liệu chép từ đề
const DOAN = [{ coSo: 219, gioiHan: 600 }, { coSo: 2300, gioiHan: 14 }, { coSo: 90, gioiHan: 100 }, { coSo: 1327, gioiHan: 580 }, { coSo: 1952, gioiHan: 96 }];
const tinhP45 = () =&gt; dichDoan(2, 50, DOAN);
// p46: Allocated (C) / Requested (R), Available — dùng đúng phép kiểm của nhà băng với "cần thêm" = Requested
const C46 = [[1, 0, 0, 1], [2, 1, 0, 1], [0, 1, 2, 0]], R46 = [[2, 0, 0, 1], [0, 1, 1, 0], [1, 1, 0, 0]], A46 = [2, 1, 0, 1];
const PA46 = [[2, 1, 0], [1, 0, 2], [0, 1, 2], [1, 2, 0]];      // phương án A–D (chỉ số 0 = P1)
const kiem46 = (chuoi) =&gt; kiemChuoi({ conLai: A46, giuLai: C46, canThem: R46, chuoi });
// p48: một loại tài nguyên (MOS 4e Hình 6-9) — tổng 15, đã cấp 3 + 4 + 3 = 10 ⇒ trống 5 (khớp số đề cho)
const HAS48 = [3, 4, 3], MAX48 = [8, 6, 5], TONG48 = 15, FREE48 = 5;</code></pre></details>
<p class="dap-an">✅ <strong>A — an toàn.</strong> Còn cần: P1 5, P2 2, P3 2; trống 5 (= 15 − 10, khớp đề). Lúc đầu ai cũng vừa; chạy P1 ⇒ trống 8, P2 ⇒ 12, P3 ⇒ 15. Chỉ cần một thứ tự chạy hết là đủ. Khoá ngân hàng A.</p>
<ul><li>B — cần một thời điểm không ai còn vừa. C — bế tắc là các tiến trình đã bị chặn chờ nhau; ở đây chưa ai chờ. D — bỏ đói là chuyện lập lịch theo thời gian, một bảng số không thể hiện được.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 21–23.</p>
<h3>Câu 49 — hệ thống an toàn-sống-còn</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q49.png" alt="Ảnh đề gốc câu 49" loading="lazy" /></p></details>
<p>🇬🇧 <em>In a system with limited resources, which deadlock handling strategy is most appropriate for safety-critical applications?</em><br>A. Ostrich algorithm · B. Deadlock detection and recovery · C. Deadlock avoidance using Banker's algorithm · D. Terminating all active tasks and reinitializing the system to recover from potential deadlock</p>
<p>🇻🇳 Trong hệ thống ít tài nguyên, chiến lược xử lý bế tắc nào hợp nhất cho ứng dụng an toàn-sống-còn? A. Thuật toán đà điểu · B. Phát hiện và khôi phục · C. Tránh bế tắc bằng thuật toán nhà băng · D. Dừng mọi tác vụ rồi khởi động lại hệ thống.</p>
<p>📚 <strong>safety-critical</strong> = an toàn-sống-còn (hỏng là nguy hiểm) · <strong>recovery</strong> = khôi phục · <strong>reinitialize</strong> = khởi tạo lại.</p>
<p class="dap-an">✅ <strong>C.</strong> Hệ an toàn-sống-còn thì bế tắc không được phép xảy ra lần nào; nhà băng không bao giờ bước vào trạng thái không an toàn, nên không bao giờ bế tắc.</p>
<ul><li>A — lờ đi chỉ chấp nhận được khi bế tắc hiếm và rẻ. B, D — để bế tắc xảy ra rồi mới giết hay khởi động lại — không chấp nhận được khi việc đó là, chẳng hạn, bộ điều khiển phanh.</li></ul>
<p class="meo">🧠 Câu 47 và 49 trông như ngược nhau (thời gian thực ⇒ ngăn ngừa; an toàn-sống-còn ⇒ tránh). Nhớ lý do ghi trong từng đề: câu 47 đòi "không kiểm tra phức tạp lúc chạy", câu 49 đòi "không bao giờ bế tắc khi tài nguyên ít". Cả hai đều là khoá ngân hàng.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 20–25.</p>
<h3>Câu 50 — spooling tấn công không trưng dụng (hai đoạn sách nói khác nhau)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q50.png" alt="Ảnh đề gốc câu 50" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which of the following techniques attacks the "No Preemption" condition for preventing deadlocks?</em><br>A. Requiring processes to request all resources at once. · B. Allowing only one process to use a resource at a time. · C. Spooling printer output to disk to allow the printer daemon exclusive access. · D. Ordering resources numerically and requiring processes to request them in increasing order.</p>
<p>🇻🇳 Kỹ thuật nào tấn công điều kiện "không trưng dụng" để ngăn bế tắc? A. Bắt tiến trình xin mọi tài nguyên một lần · B. Chỉ cho một tiến trình dùng tài nguyên tại một thời điểm · C. Đưa (spool) bản in ra đĩa để chỉ daemon máy in được dùng máy in thật · D. Đánh số tài nguyên và bắt xin theo thứ tự tăng dần.</p>
<p>📚 <strong>spooling</strong> = đưa vào hàng đợi trên đĩa · <strong>daemon</strong> = tiến trình nền · <strong>exclusive access</strong> = truy cập độc quyền.</p>
<p class="dap-an">✅ <strong>C</strong> (khoá ngân hàng). Mục 6.6.3 "Tấn công điều kiện không trưng dụng" của sách dùng đúng ví dụ này: tài nguyên không lấy lại được thì <em>ảo hoá</em> nó — spool bản in ra đĩa và chỉ cho daemon máy in chạm vào máy in thật.</p>
<div class="callout"><p><strong>Ở đây sách tự mâu thuẫn.</strong> Bảng tóm tắt Hình 6-14 xếp "spool everything" vào <em>loại trừ lẫn nhau</em>, và ngân hàng theo bảng đó ở FE19#49, FE23#39, FE24#20. Luật: theo đúng chữ của đề — "spool everything" ⇒ loại trừ lẫn nhau; câu dài này trong một câu hỏi về không trưng dụng ⇒ C.</p></div>
<ul><li>A — tấn công giữ và chờ. B — đó <em>chính là</em> loại trừ lẫn nhau, chẳng tấn công gì. D — tấn công chờ vòng tròn.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 26, 28 (Hình 6-14).</p>`),
    bi(`<h2>Chapters 9–10 — Security and Linux (1 question)</h2>
<h3>Q40 — reading /etc/passwd (run for real)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q40.png" alt="Original question 40" loading="lazy" /></p></details>
<p><em>Assuming there is an entry in /etc/passwd file (file stores essential information, which is required during login) with the following content: john:x:1002:1000:Jonh Henry::/bin/bash. Choose the best correct statement:</em><br>A. Username = john and userid = 1002 · B. Username = Jonh Henry and userid = 1002 · C. Username = john and userid = 1000 · D. Username = Jonh Henry and userid = 1000</p>
<p>The original image prints <code>Jonh Henry::/bin/bash</code> with <strong>two</strong> colons — the Exam Room text lost one. Two colons are correct: the line has the usual seven fields and the home directory (field 6) is empty. Here is the line split by <code>awk</code>, then the same account created for real and read back:</p>
<div class="out"># FE2 question 40: the line exactly as the original image prints it — seven fields, the 6th (home) is empty<br>
$ echo 'john:x:1002:1000:Jonh Henry::/bin/bash' | awk -F: '{ print "1 username=" $1; print "2 password=" $2; print "3 UID=" $3; print "4 GID=" $4; print "5 comment(GECOS)=" $5; print "6 home=" $6; print "7 shell=" $7 }'<br>
1 username=john<br>
2 password=x<br>
3 UID=1002<br>
4 GID=1000<br>
5 comment(GECOS)=Jonh Henry<br>
6 home=<br>
7 shell=/bin/bash<br>
# Make the same account for real: UID 1002, primary group 1000 (that group already exists in this container)<br>
$ getent group 1000<br>
sv:x:1000:<br>
$ useradd -u 1002 -g 1000 -c "Jonh Henry" -M -s /bin/bash john<br>
$ grep '^john:' /etc/passwd<br>
john:x:1002:1000:Jonh Henry:/home/john:/bin/bash<br>
$ id john<br>
uid=1002(john) gid=1000(sv) groups=1000(sv)<br>
# The comment field is only a label: log in with the first field<br>
$ getent passwd 1002 | cut -d: -f1<br>
john</div>
<p class="dap-an">✅ <strong>A.</strong> The seven fields are <code>name:password:UID:GID:comment:home:shell</code>. Field 1 = the login name <code>john</code>; field 3 = the user ID 1002; field 4 = the primary group ID 1000 (here the group <code>sv</code>); <code>x</code> means the password hash is in <code>/etc/shadow</code>.</p>
<ul><li>B, D — "Jonh Henry" (with its typo) is field 5, the comment (GECOS): a full name for humans, not something you log in with. C, D — 1000 is the <em>group</em> ID; the user ID comes first.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg9-1">9.A</a>, slide 25 (UNIX password security); UID and GID in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg10-2">10.B</a>, slide 47.</p>
<h2>📌 The traps of this paper</h2>
<ul>
<li><strong>Q3: 37 is a time, not an answer.</strong> (2 × 12 + 87) / 3 = 37 ms ⇒ 27.03 requests/s; no option is 27, choose the nearest, 28.</li>
<li><strong>Q29: a wrong key.</strong> The spindle spins the platters; none of the options says so. Choose the bank's B and move on.</li>
<li><strong>Q34: a wrong key you can beat.</strong> "Works worst … one sector at a time" is the book's sentence about RAID 0 — choose 0, not the key 3.</li>
<li><strong>Q43: out of date on purpose.</strong> The answer is "link" because of the book's 2015 table, even though Win32 has CreateHardLink.</li>
<li><strong>Q46: check the options, not your order.</strong> Scanning from P1 gives P1 → P3 → P2, which is not printed; only P3 → P2 → P1 passes.</li>
<li><strong>Q45: limit before base.</strong> Check offset &lt; limit first; and read the column headers — the image prints Limit, then Base.</li>
<li><strong>Q15: Dijkstra 1965 is two things.</strong> The <em>problem</em> he posed is the dining philosophers; the banker's algorithm is his too, but it is not a synchronization problem.</li>
<li><strong>Q39: "preemption" versus "no preemption".</strong> The deadlock condition has the word "no".</li>
<li><strong>Q19, Q37, Q50: unstable keys.</strong> Two true options (Q19), three true options (Q37), two book passages that disagree (Q50) — follow the words of the stem.</li>
<li><strong>Q40: the comment field is not the user name</strong>, and the user ID comes before the group ID.</li>
<li><strong>Q30 = Q35</strong> — the paper asks "seek time" twice; do not doubt yourself because you have already answered it.</li>
</ul>`,
    `<h2>Chương 9–10 — Bảo mật và Linux (1 câu)</h2>
<h3>Câu 40 — đọc /etc/passwd (chạy thật)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D2/q40.png" alt="Ảnh đề gốc câu 40" loading="lazy" /></p></details>
<p>🇬🇧 <em>Assuming there is an entry in /etc/passwd file (file stores essential information, which is required during login) with the following content: john:x:1002:1000:Jonh Henry::/bin/bash. Choose the best correct statement:</em><br>A. Username = john and userid = 1002 · B. Username = Jonh Henry and userid = 1002 · C. Username = john and userid = 1000 · D. Username = Jonh Henry and userid = 1000</p>
<p>🇻🇳 Giả sử tệp /etc/passwd (lưu thông tin cần khi đăng nhập) có dòng trên. Chọn phát biểu đúng nhất: tên người dùng và mã người dùng (user ID) là gì?</p>
<p>📚 <strong>entry</strong> = mục, dòng · <strong>username</strong> = tên đăng nhập · <strong>user ID (UID)</strong> = mã người dùng · <strong>group ID (GID)</strong> = mã nhóm · <strong>GECOS</strong> = trường chú thích (họ tên đầy đủ).</p>
<p>Ảnh đề gốc in <code>Jonh Henry::/bin/bash</code> với <strong>hai</strong> dấu hai chấm — chữ trong Phòng thi rơi mất một dấu. Hai dấu mới đúng: dòng có đủ bảy trường như thường lệ và thư mục nhà (trường 6) để trống. Dưới đây là dòng đó được <code>awk</code> tách trường, rồi tạo đúng tài khoản ấy thật và đọc lại:</p>
<div class="out"># FE2 câu 40: đúng dòng trong ảnh đề gốc — bảy trường, trường thứ 6 (home) rỗng<br>
$ echo 'john:x:1002:1000:Jonh Henry::/bin/bash' | awk -F: '{ print "1 username=" $1; print "2 password=" $2; print "3 UID=" $3; print "4 GID=" $4; print "5 comment(GECOS)=" $5; print "6 home=" $6; print "7 shell=" $7 }'<br>
1 username=john<br>
2 password=x<br>
3 UID=1002<br>
4 GID=1000<br>
5 comment(GECOS)=Jonh Henry<br>
6 home=<br>
7 shell=/bin/bash<br>
# Tạo đúng tài khoản đó thật: UID 1002, nhóm chính 1000 (nhóm này đã có sẵn trong container)<br>
$ getent group 1000<br>
sv:x:1000:<br>
$ useradd -u 1002 -g 1000 -c "Jonh Henry" -M -s /bin/bash john<br>
$ grep '^john:' /etc/passwd<br>
john:x:1002:1000:Jonh Henry:/home/john:/bin/bash<br>
$ id john<br>
uid=1002(john) gid=1000(sv) groups=1000(sv)<br>
# Trường chú thích chỉ là nhãn: đăng nhập bằng trường thứ nhất<br>
$ getent passwd 1002 | cut -d: -f1<br>
john</div>
<p class="dap-an">✅ <strong>A.</strong> Bảy trường là <code>tên:mật khẩu:UID:GID:chú thích:thư mục nhà:shell</code>. Trường 1 = tên đăng nhập <code>john</code>; trường 3 = mã người dùng 1002; trường 4 = mã nhóm chính 1000 (ở đây là nhóm <code>sv</code>); <code>x</code> nghĩa là băm mật khẩu nằm trong <code>/etc/shadow</code>.</p>
<ul><li>B, D — "Jonh Henry" (kèm lỗi gõ) là trường 5, chú thích (GECOS): họ tên cho người đọc, không dùng để đăng nhập. C, D — 1000 là mã <em>nhóm</em>; mã người dùng đứng trước.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg9-1">9.A</a>, slide 25 (bảo mật mật khẩu UNIX); UID và GID ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg10-2">10.B</a>, slide 47.</p>
<h2>📌 Các bẫy của đề này</h2>
<ul>
<li><strong>Câu 3: 37 là thời gian, không phải đáp số.</strong> (2 × 12 + 87) / 3 = 37 ms ⇒ 27,03 yêu cầu/giây; không có phương án 27, chọn phương án gần nhất, 28.</li>
<li><strong>Câu 29: khoá sai.</strong> Trục quay làm các đĩa từ quay; không phương án nào nói vậy. Chọn B theo ngân hàng rồi đi tiếp.</li>
<li><strong>Câu 34: khoá sai mà vẫn thắng được.</strong> "Chạy tệ nhất … từng sector một" là câu của sách về RAID 0 — chọn 0, không chọn khoá 3.</li>
<li><strong>Câu 43: lỗi thời có chủ ý.</strong> Đáp án là "link" vì bảng của sách năm 2015, dù Win32 có CreateHardLink.</li>
<li><strong>Câu 46: chấm phương án, đừng tìm thứ tự của mình.</strong> Quét từ P1 ra P1 → P3 → P2, không được in ra; chỉ P3 → P2 → P1 qua được.</li>
<li><strong>Câu 45: limit trước, base sau.</strong> Kiểm độ dời &lt; limit trước; và đọc tiêu đề cột — ảnh in Limit rồi mới tới Base.</li>
<li><strong>Câu 15: Dijkstra 1965 có hai thứ.</strong> <em>Bài toán</em> ông đặt ra là bữa tối các triết gia; thuật toán nhà băng cũng của ông nhưng không phải bài toán đồng bộ.</li>
<li><strong>Câu 39: "preemption" khác "no preemption".</strong> Điều kiện bế tắc có chữ "no".</li>
<li><strong>Câu 19, 37, 50: khoá không ổn định.</strong> Hai phương án đúng (câu 19), ba phương án đúng (câu 37), hai đoạn sách nói khác nhau (câu 50) — theo đúng chữ của đề.</li>
<li><strong>Câu 40: trường chú thích không phải tên đăng nhập</strong>, và mã người dùng đứng trước mã nhóm.</li>
<li><strong>Câu 30 = câu 35</strong> — đề hỏi "seek time" hai lần; đừng nghi ngờ bản thân chỉ vì đã trả lời rồi.</li>
</ul>`),
  ].join('\n'),
};

/* ───────── 🎯 FE3 (SP26-FE) solved — all 50 questions: translation, vocabulary, every option explained ───────── */
const L_x_chua_fe3 = {
  title: '🎯 FE3 (SP26-FE) solved — all 50 questions: translation, vocabulary, every option explained|||🎯 Chữa trọn đề FE3 (SP26-FE) — 50 câu: dịch, từ vựng, giải thích từng phương án',
  slug: 'osg202-chua-fe3',
  type: 'VIDEO',
  description: 'Chữa trọn đề thi cuối kỳ FE3 trong Phòng thi — kỳ SP26 thi chính — đủ 50 câu, chia theo chương: mỗi câu có ảnh đề gốc, đề tiếng Anh nguyên văn, bản dịch, từ vựng khó, đáp án kèm lý do và vì sao từng phương án kia sai, link tới bài học; bảy câu tính toán (hiệu suất CPU đa chương, bảng trang hai mức, FIFO, best fit, cỡ phân vùng FAT, nhà băng nhiều và một loại tài nguyên) tính lại bằng mô phỏng và chấm từng phương án — kèm năm câu có khoá gây tranh cãi và mười lăm câu trùng đề FE1.',
  content: [
    bi(`<span class="eyebrow">🎯 Final Exam · FE3 = SP26-FE (spring 2026, main exam) · full walkthrough</span>
<h2>Before you read: do the paper first</h2>
<p class="lead">Open <a href="/exam?course=OSG202">the Exam Room</a>, take <strong>FE3</strong> with the 60-minute timer, and only then come back. A walkthrough read before trying is forgotten in a day; one read after your own mistakes is remembered.</p>
<p>The Exam Room has <strong>all 50 questions</strong> of the real SP26-FE paper in the original order, each with its scanned image, so <em>Q23</em> below is question 23 both on paper and in the Exam Room. <strong>Fourteen questions are word for word in FE1, and Q36 reuses FE1's banker data</strong> — fifteen in all; they are solved again in full here, with a link to the <a href="/courses/operating-systems/learn?lessonSlug=osg202-chua-fe1">FE1 walkthrough</a>. If you have done FE1, a third of this paper is free marks.</p>
<h3>The paper in numbers</h3>
<table>
<thead><tr><th>Chapter</th><th>Questions of this paper</th><th>Count</th><th>Computed</th></tr></thead>
<tbody>
<tr><td>Ch.1 Introduction</td><td>1, 2, 4, 42, 43, 44, 45, 50</td><td>8</td><td>—</td></tr>
<tr><td>Ch.2 Processes and threads</td><td>3, 5, 6, 7, 8, 9, 10, 20</td><td>8</td><td>9</td></tr>
<tr><td>Ch.3 Memory management</td><td>11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 46</td><td>11</td><td>16, 17, 23</td></tr>
<tr><td>Ch.4 File systems</td><td>21, 22, 24, 25, 26, 27</td><td>6</td><td>26</td></tr>
<tr><td>Ch.5 Input/output</td><td>28, 29, 30, 31, 32, 33, 34, 39</td><td>8</td><td>—</td></tr>
<tr><td>Ch.6 Deadlocks</td><td>35, 36, 37, 38, 47, 48, 49</td><td>7</td><td>36, 48</td></tr>
<tr><td>Ch.7 Virtualization</td><td>40, 41</td><td>2</td><td>—</td></tr>
<tr><td>Total</td><td></td><td>50</td><td>7</td></tr>
</tbody>
</table>
<ul>
<li>Memory management is the biggest block (11 questions, 3 computed) — Chapter 3 decides this paper.</li>
<li><strong>7 computed questions</strong>; each answer below was produced by the course simulator and every option was checked against it. Q13 (page size and internal fragmentation) is not a calculation, but a simulation shows why.</li>
<li><strong>No key is plainly wrong</strong>, but five are debatable: Q1 ("system mode" is another book's name for kernel mode), Q14 (another paper keys "paging"), Q20 (SJF can starve too), Q23 (the answer assumes holes are split) and Q38 (circular wait is sufficient only with one instance per resource). Each case says what to choose.</li>
<li><strong>Q31 is a multiple-answer question</strong> ("Choose correct answers"): three boxes to tick.</li>
</ul>`,
    `<span class="eyebrow">🎯 Thi cuối kỳ · FE3 = SP26-FE (xuân 2026, thi chính) · chữa trọn đề</span>
<h2>Trước khi đọc: làm đề trước đã</h2>
<p class="lead">Mở <a href="/exam?course=OSG202">Phòng thi</a>, làm <strong>FE3</strong> với đồng hồ 60 phút, rồi mới quay lại đây. Bài chữa đọc trước khi tự làm thì một ngày là quên; đọc sau khi đã tự sai thì nhớ lâu.</p>
<p>Phòng thi có <strong>đủ 50 câu</strong> của đề SP26-FE thật, đúng thứ tự gốc, câu nào cũng kèm ảnh đề, nên <em>Câu 23</em> dưới đây là câu 23 cả trên giấy lẫn trong Phòng thi. <strong>Mười bốn câu giống hệt FE1, và câu 36 dùng lại dữ liệu nhà băng của FE1</strong> — tổng cộng mười lăm câu; ở đây vẫn giải đủ, kèm link sang <a href="/courses/operating-systems/learn?lessonSlug=osg202-chua-fe1">bài chữa FE1</a>. Đã làm FE1 thì một phần ba đề này là điểm cho không.</p>
<h3>Đề này qua các con số</h3>
<table>
<thead><tr><th>Chương</th><th>Các câu của đề</th><th>Số câu</th><th>Câu tính</th></tr></thead>
<tbody>
<tr><td>Ch.1 Nhập môn</td><td>1, 2, 4, 42, 43, 44, 45, 50</td><td>8</td><td>—</td></tr>
<tr><td>Ch.2 Tiến trình và luồng</td><td>3, 5, 6, 7, 8, 9, 10, 20</td><td>8</td><td>9</td></tr>
<tr><td>Ch.3 Quản lý bộ nhớ</td><td>11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 46</td><td>11</td><td>16, 17, 23</td></tr>
<tr><td>Ch.4 Hệ thống tệp</td><td>21, 22, 24, 25, 26, 27</td><td>6</td><td>26</td></tr>
<tr><td>Ch.5 Vào/ra</td><td>28, 29, 30, 31, 32, 33, 34, 39</td><td>8</td><td>—</td></tr>
<tr><td>Ch.6 Bế tắc</td><td>35, 36, 37, 38, 47, 48, 49</td><td>7</td><td>36, 48</td></tr>
<tr><td>Ch.7 Ảo hoá</td><td>40, 41</td><td>2</td><td>—</td></tr>
<tr><td>Tổng</td><td></td><td>50</td><td>7</td></tr>
</tbody>
</table>
<ul>
<li>Quản lý bộ nhớ là khối lớn nhất (11 câu, 3 câu tính) — Chương 3 quyết định đề này.</li>
<li><strong>7 câu tính toán</strong>; mỗi đáp án dưới đây do bộ mô phỏng của môn tính ra và mọi phương án đều được chấm lại theo đó. Câu 13 (cỡ trang và phân mảnh trong) không phải phép tính, nhưng một mô phỏng cho thấy vì sao.</li>
<li><strong>Không khoá nào sai hẳn</strong>, nhưng năm khoá gây tranh cãi: câu 1 ("system mode" là tên kernel mode trong một cuốn sách khác), câu 14 (một đề khác khoá "paging"), câu 20 (SJF cũng gây bỏ đói), câu 23 (đáp án giả định lỗ được tách) và câu 38 (chờ vòng tròn chỉ là điều kiện đủ khi mỗi loại tài nguyên có một thể hiện). Câu nào cũng ghi rõ nên chọn gì.</li>
<li><strong>Câu 31 là câu nhiều đáp án</strong> ("Choose correct answers"): phải tích ba ô.</li>
</ul>`),
    bi(`<h2>Chapter 1 — Introduction (8 questions)</h2>
<h3>Q1 — NOT an operating-system mode (debatable)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q1.png" alt="Original question 1" loading="lazy" /></p></details>
<p><em>What is NOT an operating system mode?</em><br>A. System mode · B. User mode · C. Kernel mode · D. Supervisor mode</p>
<p class="dap-an">✅ <strong>A</strong> (bank key, also FE11#1, FE14#1, FE16#1). Tanenbaum names two CPU modes: <strong>kernel mode</strong>, also called <strong>supervisor mode</strong>, and <strong>user mode</strong>. "System mode" is not among them.</p>
<div class="callout"><p><strong>Why it is debatable.</strong> Silberschatz writes "kernel mode (also called supervisor mode, system mode, or privileged mode)" — in that book, A <em>is</em> a mode. This course follows Tanenbaum, and four papers agree on A: choose A.</p></div>
<ul><li>B, C, D — the two real modes, kernel mode appearing under both of its names.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slides 3, 11.</p>
<h3>Q2 — multiprogramming</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q2.png" alt="Original question 2" loading="lazy" /></p></details>
<p><em>What does the term "multiprogramming" mean?</em><br>A. Running multiple lines of the same program · B. Writing code in many languages · C. Running multiple programs at once · D. Debugging with multiple users</p>
<p class="dap-an">✅ <strong>C.</strong> Several jobs sit in memory at the same time; while one waits for I/O, the CPU runs another (Fig. 1-5, the third generation). On one CPU "at once" means interleaved, not truly simultaneous.</p>
<ul><li>A — that is closer to multithreading (or pipelining). B — multi-language programming, nothing to do with the OS. D — invented.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 10; the model in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 12.</p>
<h3>Q4 — fast, expensive and volatile</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q4.png" alt="Original question 4" loading="lazy" /></p></details>
<p><em>Which type of memory is typically very fast, expensive, and volatile in a memory hierarchy?</em><br>A. Main memory · B. Virtual memory · C. Cache memory · D. Secondary memory</p>
<p class="dap-an">✅ <strong>C.</strong> The memory hierarchy (Fig. 1-9): the higher the level, the faster, smaller and costlier per byte. Cache (SRAM, a few ns) sits just below the registers and loses its content without power.</p>
<ul><li>A — RAM is volatile but slower and far cheaper per byte than cache. B — virtual memory is a technique, not a type of memory. D — disk/SSD: slow, cheap, non-volatile.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slides 13–15.</p>
<h3>Q42 — between programs and hardware</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q42.png" alt="Original question 42" loading="lazy" /></p></details>
<p><em>Which component of the OS acts as an interface between user programs and hardware?</em><br>A. Compiler · B. Assembler · C. Kernel · D. Loader · E. Linker</p>
<p class="dap-an">✅ <strong>C.</strong> The kernel runs in kernel mode, owns the hardware and offers it to programs through system calls.</p>
<ul><li>A, B, E — tools that turn source into an executable, before anything runs. D — the loader places a program in memory (and in Linux it is <code>exec</code> + the dynamic linker), but it is not the interface to the hardware.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slides 2–3.</p>
<h3>Q43 — a unit the OS manages</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q43.png" alt="Original question 43" loading="lazy" /></p></details>
<p><em>Which hardware unit inside the computer is managed by the OS?</em><br>A. Scanner · B. USB · C. Memory · D. Browser</p>
<p class="dap-an">✅ <strong>C.</strong> Memory is one of the resources the OS manages directly (Ch. 3: who gets which frames).</p>
<ul><li>A — an external peripheral, "inside the computer" excludes it. B — USB is a bus standard; the OS does drive USB controllers through drivers, so B is not absurd, but the question wants a core resource. D — software, not hardware.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 5.</p>
<h3>Q44 — the two functions of an OS (= FE1 Q44)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q44.png" alt="Original question 44" loading="lazy" /></p></details>
<p><em>What are the two main functions of an operating system?</em><br>A. Debugging and memory allocation · B. Resource management and memory allocation · C. Resource management and providing abstractions · D. Networking and power saving</p>
<p class="dap-an">✅ <strong>C.</strong> Top-down: the OS gives programs <strong>abstractions</strong> (files, processes, address spaces) instead of raw hardware. Bottom-up: it <strong>manages resources</strong>. Same as FE1 Q44.</p>
<ul><li>B — memory allocation is a <em>part</em> of resource management, so B names one function twice. A, D — side jobs, not the definition.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slides 4–5.</p>
<h3>Q45 — the THE system's layer 1</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q45.png" alt="Original question 45" loading="lazy" /></p></details>
<p><em>Which layer in the Layered Operating System Model is responsible for managing memory and drum storage?</em><br>A. Layer 0 · B. Layer 1 · C. Layer 3 · D. Layer 2</p>
<p class="dap-an">✅ <strong>B.</strong> Dijkstra's THE system (Fig. 1-25): 0 processor allocation and multiprogramming · <strong>1 memory and drum management</strong> · 2 operator-process communication · 3 I/O management · 4 user programs · 5 the operator.</p>
<ul><li>A — layer 0 switches the CPU between processes. D — layer 2 talks to the operator console. C — layer 3 manages I/O devices. Note the options are not in order (3 before 2).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slide 40.</p>
<h3>Q50 — fork() and exec() (= FE1 Q50)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q50.png" alt="Original question 50" loading="lazy" /></p></details>
<p><em>In UNIX systems, what is the primary purpose of system calls like fork() and exec()?</em><br>A. To control peripheral devices. · B. To load device drivers into memory. · C. To create and execute new processes. · D. To switch between user and kernel mode.</p>
<p class="dap-an">✅ <strong>C.</strong> <code>fork()</code> creates a copy of the calling process; <code>exec()</code> replaces its memory image with a new program. Together: create and run a new program. Same as FE1 Q50.</p>
<ul><li>A, B — that is <code>ioctl</code>/driver loading, not process calls. D — <em>every</em> system call switches mode through a trap; that is not what makes fork/exec special.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slide 32, and the running example in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 5.</p>`,
    `<h2>Chương 1 — Nhập môn (8 câu)</h2>
<h3>Câu 1 — KHÔNG phải chế độ của HĐH (gây tranh cãi)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q1.png" alt="Ảnh đề gốc câu 1" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is NOT an operating system mode?</em><br>A. System mode · B. User mode · C. Kernel mode · D. Supervisor mode</p>
<p>🇻🇳 Đâu KHÔNG phải là một chế độ của hệ điều hành? A. Chế độ hệ thống · B. Chế độ người dùng · C. Chế độ nhân · D. Chế độ giám sát.</p>
<p>📚 <strong>mode</strong> = chế độ (của CPU) · <strong>kernel mode</strong> = chế độ nhân · <strong>supervisor mode</strong> = chế độ giám sát · <strong>user mode</strong> = chế độ người dùng.</p>
<p class="dap-an">✅ <strong>A</strong> (khoá ngân hàng, cũng là FE11#1, FE14#1, FE16#1). Tanenbaum gọi tên hai chế độ của CPU: <strong>chế độ nhân</strong>, còn gọi là <strong>chế độ giám sát</strong>, và <strong>chế độ người dùng</strong>. "System mode" không nằm trong số đó.</p>
<div class="callout"><p><strong>Vì sao gây tranh cãi.</strong> Silberschatz viết "kernel mode (còn gọi là supervisor mode, system mode, hay privileged mode)" — theo cuốn đó, A <em>là</em> một chế độ. Môn này theo Tanenbaum, và bốn đề cùng khoá A: chọn A.</p></div>
<ul><li>B, C, D — hai chế độ thật, chế độ nhân xuất hiện dưới cả hai tên của nó.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 3, 11.</p>
<h3>Câu 2 — đa chương trình</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q2.png" alt="Ảnh đề gốc câu 2" loading="lazy" /></p></details>
<p>🇬🇧 <em>What does the term "multiprogramming" mean?</em><br>A. Running multiple lines of the same program · B. Writing code in many languages · C. Running multiple programs at once · D. Debugging with multiple users</p>
<p>🇻🇳 Thuật ngữ "đa chương trình" (multiprogramming) nghĩa là gì? A. Chạy nhiều dòng của cùng một chương trình · B. Viết mã bằng nhiều ngôn ngữ · C. Chạy nhiều chương trình cùng lúc · D. Gỡ lỗi với nhiều người dùng.</p>
<p>📚 <strong>multiprogramming</strong> = đa chương trình · <strong>at once</strong> = cùng lúc.</p>
<p class="dap-an">✅ <strong>C.</strong> Nhiều việc cùng nằm trong bộ nhớ; việc này chờ I/O thì CPU chạy việc khác (Hình 1-5, thế hệ thứ ba). Trên một CPU, "cùng lúc" là xen kẽ, không phải đồng thời thật.</p>
<ul><li>A — gần với đa luồng (hoặc đường ống lệnh) hơn. B — lập trình đa ngôn ngữ, chẳng dính tới HĐH. D — bịa ra.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 10; mô hình ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 12.</p>
<h3>Câu 4 — nhanh, đắt và mất khi tắt điện</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q4.png" alt="Ảnh đề gốc câu 4" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which type of memory is typically very fast, expensive, and volatile in a memory hierarchy?</em><br>A. Main memory · B. Virtual memory · C. Cache memory · D. Secondary memory</p>
<p>🇻🇳 Trong phân cấp bộ nhớ, loại nào thường rất nhanh, đắt và khả biến (mất dữ liệu khi tắt điện)? A. Bộ nhớ chính · B. Bộ nhớ ảo · C. Bộ nhớ đệm (cache) · D. Bộ nhớ thứ cấp.</p>
<p>📚 <strong>volatile</strong> = khả biến (mất khi mất điện) · <strong>memory hierarchy</strong> = phân cấp bộ nhớ · <strong>secondary memory</strong> = bộ nhớ thứ cấp (đĩa).</p>
<p class="dap-an">✅ <strong>C.</strong> Phân cấp bộ nhớ (Hình 1-9): càng lên cao càng nhanh, càng nhỏ, càng đắt mỗi byte. Cache (SRAM, vài ns) nằm ngay dưới thanh ghi và mất nội dung khi mất điện.</p>
<ul><li>A — RAM cũng khả biến nhưng chậm hơn và rẻ hơn cache nhiều tính theo byte. B — bộ nhớ ảo là một kỹ thuật, không phải một loại bộ nhớ. D — đĩa/SSD: chậm, rẻ, không khả biến.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 13–15.</p>
<h3>Câu 42 — giao diện giữa chương trình và phần cứng</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q42.png" alt="Ảnh đề gốc câu 42" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which component of the OS acts as an interface between user programs and hardware?</em><br>A. Compiler · B. Assembler · C. Kernel · D. Loader · E. Linker</p>
<p>🇻🇳 Thành phần nào của HĐH đóng vai giao diện giữa chương trình người dùng và phần cứng? A. Trình biên dịch · B. Trình hợp dịch · C. Nhân · D. Trình nạp · E. Trình liên kết.</p>
<p>📚 <strong>kernel</strong> = nhân · <strong>compiler / assembler / linker / loader</strong> = trình biên dịch / hợp dịch / liên kết / nạp.</p>
<p class="dap-an">✅ <strong>C.</strong> Nhân chạy ở chế độ nhân, nắm phần cứng và đưa nó cho chương trình dùng qua lời gọi hệ thống.</p>
<ul><li>A, B, E — công cụ biến mã nguồn thành tệp chạy được, trước khi có gì chạy. D — trình nạp đặt chương trình vào bộ nhớ (trong Linux là <code>exec</code> + trình liên kết động), nhưng không phải giao diện tới phần cứng.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 2–3.</p>
<h3>Câu 43 — bộ phận do HĐH quản lý</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q43.png" alt="Ảnh đề gốc câu 43" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which hardware unit inside the computer is managed by the OS?</em><br>A. Scanner · B. USB · C. Memory · D. Browser</p>
<p>🇻🇳 Bộ phận phần cứng nào bên trong máy tính do HĐH quản lý? A. Máy quét · B. USB · C. Bộ nhớ · D. Trình duyệt.</p>
<p>📚 <strong>hardware unit</strong> = bộ phận phần cứng · <strong>managed</strong> = được quản lý.</p>
<p class="dap-an">✅ <strong>C.</strong> Bộ nhớ là một trong các tài nguyên HĐH quản lý trực tiếp (Ch. 3: ai được khung trang nào).</p>
<ul><li>A — thiết bị ngoại vi bên ngoài, chữ "inside the computer" loại nó. B — USB là một chuẩn bus; HĐH có điều khiển bộ điều khiển USB qua driver, nên B không vô lý, nhưng đề muốn một tài nguyên cốt lõi. D — phần mềm, không phải phần cứng.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 5.</p>
<h3>Câu 44 — hai chức năng của HĐH (= câu 44 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q44.png" alt="Ảnh đề gốc câu 44" loading="lazy" /></p></details>
<p>🇬🇧 <em>What are the two main functions of an operating system?</em><br>A. Debugging and memory allocation · B. Resource management and memory allocation · C. Resource management and providing abstractions · D. Networking and power saving</p>
<p>🇻🇳 Hai chức năng chính của hệ điều hành là gì? A. Gỡ lỗi và cấp phát bộ nhớ · B. Quản lý tài nguyên và cấp phát bộ nhớ · C. Quản lý tài nguyên và cung cấp các trừu tượng · D. Mạng và tiết kiệm điện.</p>
<p>📚 <strong>abstraction</strong> = sự trừu tượng (giấu chi tiết phần cứng sau một khái niệm gọn: tệp, tiến trình) · <strong>resource management</strong> = quản lý tài nguyên.</p>
<p class="dap-an">✅ <strong>C.</strong> Nhìn từ trên xuống: HĐH cho chương trình các <strong>trừu tượng</strong> (tệp, tiến trình, không gian địa chỉ) thay cho phần cứng trần. Nhìn từ dưới lên: nó <strong>quản lý tài nguyên</strong>. Giống câu 44 FE1.</p>
<ul><li>B — cấp phát bộ nhớ là <em>một phần</em> của quản lý tài nguyên, nên B nêu một chức năng hai lần. A, D — việc phụ, không phải định nghĩa.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-1">1.A</a>, slide 4–5.</p>
<h3>Câu 45 — tầng 1 của hệ THE</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q45.png" alt="Ảnh đề gốc câu 45" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which layer in the Layered Operating System Model is responsible for managing memory and drum storage?</em><br>A. Layer 0 · B. Layer 1 · C. Layer 3 · D. Layer 2</p>
<p>🇻🇳 Trong mô hình HĐH phân tầng, tầng nào lo quản lý bộ nhớ và trống từ?</p>
<p>📚 <strong>layered</strong> = phân tầng · <strong>drum</strong> = trống từ (thiết bị lưu trữ quay đời 1960, tiền thân của đĩa) · <strong>layer</strong> = tầng.</p>
<p class="dap-an">✅ <strong>B.</strong> Hệ THE của Dijkstra (Hình 1-25): 0 cấp phát bộ xử lý và đa chương trình · <strong>1 quản lý bộ nhớ và trống từ</strong> · 2 liên lạc giữa tiến trình và người vận hành · 3 quản lý I/O · 4 chương trình người dùng · 5 người vận hành.</p>
<ul><li>A — tầng 0 chuyển CPU giữa các tiến trình. D — tầng 2 nói chuyện với bàn điều khiển của người vận hành. C — tầng 3 quản lý thiết bị I/O. Để ý phương án không theo thứ tự (3 đứng trước 2).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slide 40.</p>
<h3>Câu 50 — fork() và exec() (= câu 50 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q50.png" alt="Ảnh đề gốc câu 50" loading="lazy" /></p></details>
<p>🇬🇧 <em>In UNIX systems, what is the primary purpose of system calls like fork() and exec()?</em><br>A. To control peripheral devices. · B. To load device drivers into memory. · C. To create and execute new processes. · D. To switch between user and kernel mode.</p>
<p>🇻🇳 Trong UNIX, lời gọi hệ thống như fork() và exec() dùng chủ yếu để làm gì? A. Điều khiển thiết bị ngoại vi · B. Nạp driver vào bộ nhớ · C. Tạo và chạy tiến trình mới · D. Chuyển giữa user mode và kernel mode.</p>
<p>📚 <strong>system call</strong> = lời gọi hệ thống · <strong>peripheral device</strong> = thiết bị ngoại vi.</p>
<p class="dap-an">✅ <strong>C.</strong> <code>fork()</code> tạo bản sao của tiến trình gọi; <code>exec()</code> thay ảnh bộ nhớ của nó bằng một chương trình mới. Gộp lại: tạo và chạy một chương trình mới. Giống câu 50 FE1.</p>
<ul><li>A, B — đó là <code>ioctl</code> / nạp driver, không phải lời gọi về tiến trình. D — <em>mọi</em> system call đều chuyển chế độ qua lệnh trap; đó không phải điểm riêng của fork/exec.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slide 32, và ví dụ chạy thật ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 5.</p>`),
    bi(`<h2>Chapter 2 — Processes and threads (8 questions)</h2>
<h3>Q3 — threads implemented in the kernel</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q3.png" alt="Original question 3" loading="lazy" /></p></details>
<p><em>Which statement is true about implementing Threads in Kernel?</em><br>A. The kernel has a thread table · B. The threads run on top of a runtime system · C. Suitable for OS that does not support threads · D. Thread switching and scheduling are faster</p>
<p class="dap-an">✅ <strong>A.</strong> Fig. 2-16(b): with kernel threads, the kernel keeps a thread table (registers, state of every thread) next to the process table, and creating or blocking a thread is a system call.</p>
<ul><li>B, C, D — the three features of <em>user-level</em> threads (Fig. 2-16(a)): a run-time system inside the process, works on an OS that knows nothing about threads, and switching without a trap is much faster.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slides 23–24.</p>
<h3>Q5 — the web server's cache (= FE1 Q4)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q5.png" alt="Original question 5" loading="lazy" /></p></details>
<p><em>In threads, web servers use this fact to improve performance by maintaining a collection of heavily used pages in main memory to eliminate the need to go to disk to get them. What is a collection called?</em><br>A. Threads · B. Dispatcher · C. Buffer · D. Cache</p>
<p class="dap-an">✅ <strong>D — cache.</strong> The book's multithreaded web server (Fig. 2-8): the dispatcher thread hands requests to workers, and popular pages are kept in a <em>Web page cache</em> in RAM. Same as FE1 Q4.</p>
<ul><li>A, B — threads and the dispatcher are the actors, not the collection. C — a buffer holds data in transit once; a cache keeps data to be reused.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slides 13–14.</p>
<h3>Q6 — end of a quantum (= FE1 Q6)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q6.png" alt="Original question 6" loading="lazy" /></p></details>
<p><em>In the Round-robin scheduling, what happens to a process when it runs out of the time allocated by the system?</em><br>A. The process switches from running to a ready state. · B. The process switches from running to a blocked state. · C. The process switches from running to a suspended-ready state. · D. The process switches from running to a suspended state.</p>
<p class="dap-an">✅ <strong>A.</strong> Quantum used up ⇒ the process is still runnable, so it goes back to the <strong>end of the ready queue</strong> (transition 2 of the three-state diagram). Same as FE1 Q6.</p>
<ul><li>B — blocked means waiting for an event (I/O); nothing was requested. C, D — "suspended" states belong to swapping models, not to the book's three states.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 62; state diagram in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 7.</p>
<h3>Q7 — parallelism with blocking calls (= FE1 Q7)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q7.png" alt="Original question 7" loading="lazy" /></p></details>
<p><em>Which programming model supports parallel execution but may involve blocking system calls during execution?</em><br>A. Single-threaded process · B. Finite-state machine · C. Threads · D. None of the above</p>
<p class="dap-an">✅ <strong>C.</strong> Fig. 2-10 compares three ways to build a server: threads = parallelism + blocking system calls; single-threaded process = no parallelism + blocking calls; finite-state machine = parallelism + <em>non-blocking</em> calls and interrupts. Same as FE1 Q7.</p>
<ul><li>A — blocking but no parallelism. B — parallel but non-blocking. D — C is correct.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 16.</p>
<h3>Q8 — one at a time in the critical zone</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q8.png" alt="Original question 8" loading="lazy" /></p></details>
<p><em>When a process is running in a contention zone, no other processes are running in the same zone. What is this condition called?</em><br>A. Mutual exclusion. · B. Bounded-waiting. · C. Progress. · D. Critical exclusion.</p>
<p class="dap-an">✅ <strong>A.</strong> The "contention zone" is the critical region; "no two processes inside at the same time" is mutual exclusion, condition 1 of a good solution.</p>
<ul><li>B — bounded waiting: no process waits forever to enter. C — progress: a process outside its critical region must not block others. D — invented term.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-2">2.B</a>, slides 29–30.</p>
<h3>Q9 — CPU utilization (computed)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q9.png" alt="Original question 9" loading="lazy" /></p></details>
<p><em>A computer has 8 GB of memory. The operating system occupies 2 GB, and each user program requires 3 GB. The average I/O wait time for each user program is 60%. What is the CPU utilization?</em><br>A. 64% · B. 60% · C. 66% · D. 70%</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/2304fcbff3c5ebcf4adc23295083c6fd0271ab24.svg" alt="First how many programs fit, then 1 − pⁿ" loading="lazy" /><p class="chu-thich">🧮 First how many programs fit, then 1 − pⁿ</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>A — 64%.</strong> Step 1: n = (8 − 2) / 3 = 2 programs fit. Step 2: the CPU is idle only when both wait for I/O at once: 0.6² = 0.36, so utilization = 1 − 0.36 = 0.64. Bank key A.</p>
<ul><li>B — 60% is the I/O-wait fraction p itself. C, D — no whole n gives them (n = 3 would be 78.4% and does not fit in RAM anyway).</li></ul>
<p class="pitfall">⚠️ The model assumes the programs wait independently — the book calls it "an approximation". Real CPUs are better than 1 − pⁿ when I/O waits do not overlap, worse when the system starts thrashing.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 12 (Fig. 2-6).</p>
<h3>Q10 — when a philosopher may eat</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q10.png" alt="Original question 10" loading="lazy" /></p></details>
<p><em>In the Classical IPC Problems, specifically in the deadlock-avoidance solution to the Dining Philosophers problem, when can a philosopher eat?</em><br>A. Both neighbors are not eating · B. Both neighbors are thinking or hungry · C. The philosopher hasn't eaten yet · D. Mutex is unlocked</p>
<p class="dap-an">✅ <strong>A</strong>, the wording of <code>test(i)</code> in Fig. 2-47: a hungry philosopher starts eating only if <code>state[LEFT] != EATING &amp;&amp; state[RIGHT] != EATING</code>.</p>
<ul><li>B — careful: with only three states (thinking, hungry, eating) "thinking or hungry" <em>means</em> "not eating", so B is logically the same; the bank keys the book's wording, A. C — eating history plays no role. D — the mutex only protects the <code>state</code> array for a moment; it is not the condition to eat.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slides 69–70.</p>
<h3>Q20 — which algorithm can starve (two options are true)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q20.png" alt="Original question 20" loading="lazy" /></p></details>
<p><em>Which scheduling algorithm could potentially lead to starvation?</em><br>A. FCFS · B. SJF · C. Round Robin · D. Priority Scheduling</p>
<p class="dap-an">✅ <strong>D</strong> (bank key) — the textbook example: a low-priority process may never run while higher-priority work keeps arriving.</p>
<div class="callout"><p><strong>B is true as well.</strong> SJF is priority scheduling where the priority is the (predicted) run time, so a long job can wait forever behind a stream of short ones — 2.C slide 60 says SJF "does NOT avoid starvation". The question asks for one answer: the classic one is priority scheduling. Choose D.</p></div>
<ul><li>A — FCFS serves everybody in turn. C — round robin gives everybody a quantum each round. Neither can starve.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slides 60, 63; starvation in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 30.</p>`,
    `<h2>Chương 2 — Tiến trình và luồng (8 câu)</h2>
<h3>Câu 3 — luồng cài trong nhân</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q3.png" alt="Ảnh đề gốc câu 3" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which statement is true about implementing Threads in Kernel?</em><br>A. The kernel has a thread table · B. The threads run on top of a runtime system · C. Suitable for OS that does not support threads · D. Thread switching and scheduling are faster</p>
<p>🇻🇳 Phát biểu nào đúng về việc cài luồng trong nhân? A. Nhân có một bảng luồng · B. Các luồng chạy trên một hệ thống thời gian chạy · C. Hợp với HĐH không hỗ trợ luồng · D. Chuyển luồng và lập lịch nhanh hơn.</p>
<p>📚 <strong>thread table</strong> = bảng luồng · <strong>runtime system</strong> = hệ thống thời gian chạy (thư viện quản lý luồng trong tiến trình) · <strong>kernel-level / user-level thread</strong> = luồng mức nhân / mức người dùng.</p>
<p class="dap-an">✅ <strong>A.</strong> Hình 2-16(b): với luồng mức nhân, nhân giữ một bảng luồng (thanh ghi, trạng thái của từng luồng) bên cạnh bảng tiến trình, và tạo hay chặn một luồng là một lời gọi hệ thống.</p>
<ul><li>B, C, D — ba đặc điểm của luồng <em>mức người dùng</em> (Hình 2-16(a)): có hệ thống thời gian chạy trong tiến trình, chạy được trên HĐH không biết gì về luồng, và chuyển luồng không cần bẫy vào nhân nên nhanh hơn nhiều.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 23–24.</p>
<h3>Câu 5 — cache của web server (= câu 4 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q5.png" alt="Ảnh đề gốc câu 5" loading="lazy" /></p></details>
<p>🇬🇧 <em>In threads, web servers use this fact to improve performance by maintaining a collection of heavily used pages in main memory to eliminate the need to go to disk to get them. What is a collection called?</em><br>A. Threads · B. Dispatcher · C. Buffer · D. Cache</p>
<p>🇻🇳 Web server cải thiện hiệu năng bằng cách giữ một tập các trang được dùng nhiều trong bộ nhớ chính để khỏi phải đọc đĩa. Tập đó gọi là gì? A. Luồng · B. Bộ phân phát · C. Vùng đệm · D. Bộ nhớ đệm (cache).</p>
<p>📚 <strong>heavily used</strong> = được dùng nhiều · <strong>dispatcher</strong> = luồng phân phát việc · <strong>buffer</strong> = vùng đệm (giữ tạm khi truyền) · <strong>cache</strong> = bộ nhớ đệm (giữ để dùng lại).</p>
<p class="dap-an">✅ <strong>D — cache.</strong> Web server đa luồng của sách (Hình 2-8): luồng phân phát giao yêu cầu cho luồng làm việc, các trang hay được xem nằm trong <em>Web page cache</em> ở RAM. Giống câu 4 FE1.</p>
<ul><li>A, B — luồng và bộ phân phát là "người làm", không phải tập dữ liệu. C — buffer giữ dữ liệu đang truyền một lần; cache giữ dữ liệu để dùng lại.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 13–14.</p>
<h3>Câu 6 — hết lượng tử (= câu 6 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q6.png" alt="Ảnh đề gốc câu 6" loading="lazy" /></p></details>
<p>🇬🇧 <em>In the Round-robin scheduling, what happens to a process when it runs out of the time allocated by the system?</em><br>A. The process switches from running to a ready state. · B. The process switches from running to a blocked state. · C. The process switches from running to a suspended-ready state. · D. The process switches from running to a suspended state.</p>
<p>🇻🇳 Trong lập lịch Round-robin, tiến trình dùng hết thời gian được cấp thì sao? A. Chuyển từ đang chạy sang sẵn sàng · B. Sang bị chặn · C. Sang treo-sẵn sàng · D. Sang bị treo.</p>
<p>📚 <strong>quantum</strong> = lượng tử thời gian · <strong>ready / blocked</strong> = sẵn sàng / bị chặn · <strong>suspended</strong> = bị treo (đẩy ra đĩa).</p>
<p class="dap-an">✅ <strong>A.</strong> Hết lượng tử ⇒ tiến trình vẫn chạy được, nên quay về <strong>cuối hàng đợi sẵn sàng</strong> (bước chuyển 2 trong sơ đồ ba trạng thái). Giống câu 6 FE1.</p>
<ul><li>B — bị chặn là chờ một sự kiện (I/O); nó đâu có xin gì. C, D — trạng thái "suspended" thuộc mô hình hoán đổi, không có trong ba trạng thái của sách.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 62; sơ đồ trạng thái ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 7.</p>
<h3>Câu 7 — song song nhưng lời gọi chặn (= câu 7 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q7.png" alt="Ảnh đề gốc câu 7" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which programming model supports parallel execution but may involve blocking system calls during execution?</em><br>A. Single-threaded process · B. Finite-state machine · C. Threads · D. None of the above</p>
<p>🇻🇳 Mô hình lập trình nào cho chạy song song nhưng có thể dùng lời gọi hệ thống chặn? A. Tiến trình một luồng · B. Máy trạng thái hữu hạn · C. Luồng · D. Không cái nào.</p>
<p>📚 <strong>blocking system call</strong> = lời gọi hệ thống chặn (gọi xong phải chờ) · <strong>finite-state machine</strong> = máy trạng thái hữu hạn.</p>
<p class="dap-an">✅ <strong>C.</strong> Hình 2-10 so ba cách dựng server: luồng = song song + lời gọi chặn; tiến trình một luồng = không song song + lời gọi chặn; máy trạng thái hữu hạn = song song + lời gọi <em>không chặn</em> và ngắt. Giống câu 7 FE1.</p>
<ul><li>A — chặn nhưng không song song. B — song song nhưng không chặn. D — C đúng.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 16.</p>
<h3>Câu 8 — mỗi lúc một người trong vùng tranh chấp</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q8.png" alt="Ảnh đề gốc câu 8" loading="lazy" /></p></details>
<p>🇬🇧 <em>When a process is running in a contention zone, no other processes are running in the same zone. What is this condition called?</em><br>A. Mutual exclusion. · B. Bounded-waiting. · C. Progress. · D. Critical exclusion.</p>
<p>🇻🇳 Khi một tiến trình đang chạy trong vùng tranh chấp thì không tiến trình nào khác chạy trong vùng đó. Điều kiện này gọi là gì? A. Loại trừ lẫn nhau · B. Chờ có giới hạn · C. Tiến triển · D. Loại trừ găng.</p>
<p>📚 <strong>contention zone</strong> = vùng tranh chấp (= vùng găng, critical region) · <strong>mutual exclusion</strong> = loại trừ lẫn nhau · <strong>bounded waiting</strong> = chờ có giới hạn.</p>
<p class="dap-an">✅ <strong>A.</strong> "Vùng tranh chấp" chính là vùng găng; "không bao giờ có hai tiến trình cùng ở trong" là loại trừ lẫn nhau, điều kiện 1 của một lời giải tốt.</p>
<ul><li>B — chờ có giới hạn: không ai phải chờ mãi mới vào được. C — tiến triển: tiến trình ở ngoài vùng găng không được chặn người khác. D — thuật ngữ bịa.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-2">2.B</a>, slide 29–30.</p>
<h3>Câu 9 — hiệu suất CPU (câu tính)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q9.png" alt="Ảnh đề gốc câu 9" loading="lazy" /></p></details>
<p>🇬🇧 <em>A computer has 8 GB of memory. The operating system occupies 2 GB, and each user program requires 3 GB. The average I/O wait time for each user program is 60%. What is the CPU utilization?</em><br>A. 64% · B. 60% · C. 66% · D. 70%</p>
<p>🇻🇳 Máy có 8 GB bộ nhớ, HĐH chiếm 2 GB, mỗi chương trình người dùng cần 3 GB. Mỗi chương trình trung bình chờ I/O 60% thời gian. Hiệu suất sử dụng CPU là bao nhiêu?</p>
<p>📚 <strong>CPU utilization</strong> = hiệu suất (mức sử dụng) CPU · <strong>I/O wait</strong> = chờ vào/ra · <strong>occupy</strong> = chiếm.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6dce1d7b5e68a0f0a34e4909f95d95964cd20878.svg" alt="Trước hết bao nhiêu chương trình vừa RAM, rồi mới 1 − pⁿ" loading="lazy" /><p class="chu-thich">🧮 Trước hết bao nhiêu chương trình vừa RAM, rồi mới 1 − pⁿ</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>A — 64%.</strong> Bước 1: n = (8 − 2) / 3 = 2 chương trình vừa RAM. Bước 2: CPU chỉ rảnh khi cả hai cùng chờ I/O: 0,6² = 0,36, nên hiệu suất = 1 − 0,36 = 0,64. Khoá ngân hàng A.</p>
<ul><li>B — 60% chính là tỉ lệ chờ I/O p. C, D — không n nguyên nào ra (n = 3 cho 78,4%, mà cũng không vừa RAM).</li></ul>
<p class="pitfall">⚠️ Mô hình giả định các chương trình chờ I/O độc lập nhau — sách gọi nó là "một xấp xỉ". CPU thật tốt hơn 1 − pⁿ khi các lần chờ không trùng nhau, tệ hơn khi hệ thống bắt đầu thrashing.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-1">2.A</a>, slide 12 (Hình 2-6).</p>
<h3>Câu 10 — khi nào triết gia được ăn</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q10.png" alt="Ảnh đề gốc câu 10" loading="lazy" /></p></details>
<p>🇬🇧 <em>In the Classical IPC Problems, specifically in the deadlock-avoidance solution to the Dining Philosophers problem, when can a philosopher eat?</em><br>A. Both neighbors are not eating · B. Both neighbors are thinking or hungry · C. The philosopher hasn't eaten yet · D. Mutex is unlocked</p>
<p>🇻🇳 Trong lời giải tránh bế tắc của bài toán Bữa tối các triết gia, khi nào một triết gia được ăn? A. Cả hai hàng xóm đều không đang ăn · B. Cả hai hàng xóm đang nghĩ hoặc đang đói · C. Triết gia chưa ăn lần nào · D. Mutex đang mở.</p>
<p>📚 <strong>neighbor</strong> = người ngồi cạnh · <strong>hungry</strong> = đói · <strong>deadlock-avoidance solution</strong> = lời giải tránh bế tắc.</p>
<p class="dap-an">✅ <strong>A</strong>, đúng chữ của hàm <code>test(i)</code> trong Hình 2-47: triết gia đang đói chỉ bắt đầu ăn khi <code>state[LEFT] != EATING &amp;&amp; state[RIGHT] != EATING</code>.</p>
<ul><li>B — cẩn thận: chỉ có ba trạng thái (nghĩ, đói, ăn) nên "nghĩ hoặc đói" <em>chính là</em> "không đang ăn", B về logic giống hệt A; ngân hàng khoá theo cách nói của sách, A. C — chuyện đã ăn hay chưa không quan trọng. D — mutex chỉ bảo vệ mảng <code>state</code> trong chốc lát; nó không phải điều kiện để ăn.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 69–70.</p>
<h3>Câu 20 — thuật toán nào gây bỏ đói (hai phương án đều đúng)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q20.png" alt="Ảnh đề gốc câu 20" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which scheduling algorithm could potentially lead to starvation?</em><br>A. FCFS · B. SJF · C. Round Robin · D. Priority Scheduling</p>
<p>🇻🇳 Thuật toán lập lịch nào có thể dẫn tới bỏ đói?</p>
<p>📚 <strong>starvation</strong> = bỏ đói (chờ mãi không tới lượt) · <strong>priority scheduling</strong> = lập lịch theo độ ưu tiên · <strong>SJF</strong> = việc ngắn nhất trước.</p>
<p class="dap-an">✅ <strong>D</strong> (khoá ngân hàng) — ví dụ kinh điển: tiến trình ưu tiên thấp có thể không bao giờ được chạy khi việc ưu tiên cao cứ tới liên tục.</p>
<div class="callout"><p><strong>B cũng đúng.</strong> SJF là lập lịch ưu tiên với độ ưu tiên là thời gian chạy (dự đoán), nên một việc dài có thể chờ mãi sau một dòng việc ngắn — slide 60 của 2.C ghi SJF "KHÔNG tránh được bỏ đói". Đề chỉ cho chọn một: câu trả lời kinh điển là lập lịch ưu tiên. Chọn D.</p></div>
<ul><li>A — FCFS phục vụ lần lượt từng người. C — round robin cho mỗi người một lượng tử mỗi vòng. Cả hai không thể bỏ đói ai.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg2-3">2.C</a>, slide 60, 63; bỏ đói ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 30.</p>`),
    bi(`<h2>Chapter 3 — Memory management (11 questions)</h2>
<h3>Q11 — x86-64 without real segmentation</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q11.png" alt="Original question 11" loading="lazy" /></p></details>
<p><em>Evaluate the impact of the absence of real segmentation support in the 64-bit version of the x86 architecture on modern operating systems, considering memory management efficiency and design choices.</em><br>A. The absence of real segmentation results in more efficient memory utilization but limits the diversity of memory management techniques in modern systems. · B. Real segmentation support significantly improves memory management performance, especially in handling dynamic data structures. · C. The lack of real segmentation simplifies memory management but limits the flexibility to handle changing memory requirements in modern operating systems. · D. The absence of real segmentation has no impact on modern operating systems as they rely solely on paging techniques for memory management.</p>
<p class="dap-an">✅ <strong>C</strong> (bank key). In 64-bit mode the segment bases and limits are ignored (only FS/GS survive, for thread-local storage), so every OS uses one flat address space with paging: simpler — but the "each structure grows on its own" benefit of segments is gone.</p>
<ul><li>A — memory efficiency comes from paging, not from dropping segments. B — states the opposite trade-off and no modern OS relied on it (OS/2 was the last big user). D — "no impact" is too absolute: the flat model is a design consequence. A vague "evaluate" question: take the balanced, book-like statement.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slides 52–55.</p>
<h3>Q12 — how the OS keeps track of memory</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q12.png" alt="Original question 12" loading="lazy" /></p></details>
<p><em>Which of the following methods is used to track memory?</em><br>A. Linked Lists · B. Best fit · C. Paging · D. Segmentation</p>
<p class="dap-an">✅ <strong>A.</strong> §3.2.3: two ways to keep track of memory usage — <strong>bitmaps</strong> and <strong>linked lists</strong> of allocated segments and holes (Fig. 3-6).</p>
<ul><li>B — an algorithm that <em>uses</em> the list to choose a hole. C, D — whole memory-management schemes, not bookkeeping methods.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 8–9.</p>
<h3>Q13 — bigger pages, more internal fragmentation</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q13.png" alt="Original question 13" loading="lazy" /></p></details>
<p><em>In paged memory systems, if the page size is increased, then the internal fragmentation generally ____.</em><br>A. becomes less · B. becomes more · C. remains constant · D. none of mentioned</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/29d8daf15439c30d8fd02a2a0dddde4084213bb8.svg" alt="The wasted tail of the last page, averaged over every program size, for five page sizes" loading="lazy" /><p class="chu-thich">🧮 The wasted tail of the last page, averaged over every program size, for five page sizes</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>B.</strong> A program rarely fills its last page; on average half a page is wasted (the book: "on the average, half of the final page will be empty"). Half of a bigger page is more bytes.</p>
<ul><li>A — the opposite (that is the argument <em>for</em> small pages). C — the waste is proportional to the page size. D — B is correct.</li></ul>
<p class="meo">🧠 The mirror question, FE1's original Q11: smaller pages ⇒ <em>more page faults</em> and a bigger page table. Page size is a trade-off between the two.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 16; page size (§3.5.3) in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>.</p>
<h3>Q14 — fixed-sized partitions (keys differ between papers)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q14.png" alt="Original question 14" loading="lazy" /></p></details>
<p><em>Which memory management technique involves dividing memory into fixed-sized partitions to accommodate varying process sizes?</em><br>A. Paging Management · B. Contiguous Allocation · C. Segmentation · D. Virtual Memory Management</p>
<p class="dap-an">✅ <strong>B</strong> (bank key here and in FE12#15, FE13#15, FE14#18, FE15#18). Silberschatz opens contiguous memory allocation with "one of the simplest methods for allocating memory is to divide memory into several fixed-sized partitions" — each partition holds one whole process (IBM OS/360 MFT).</p>
<div class="callout"><p><strong>FE5#18 keys A (paging) for the same stem</strong>, and the words fit paging too: frames are fixed-size, and a process of any size uses as many as it needs. Five papers to one, plus the textbook sentence: choose B.</p></div>
<ul><li>C — segments have <em>variable</em> sizes. D — a general concept built on paging, not a partitioning technique.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 3–4 (memory without abstraction); external fragmentation in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slide 46.</p>
<h3>Q15 — what address spaces give</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q15.png" alt="Original question 15" loading="lazy" /></p></details>
<p><em>How does memory abstraction through address spaces benefit a computer system?</em><br>A. It allows each process to access the entire physical memory directly. · B. It isolates processes from one another, preventing unauthorized access. · C. It eliminates the need for virtual memory. · D. It reduces CPU processing speed.</p>
<p class="dap-an">✅ <strong>B.</strong> An address space is the set of addresses a process may use, private to it: address 100 of one process is not address 100 of another (base and limit registers, Fig. 3-3; later page tables).</p>
<ul><li>A — that is the situation <em>without</em> abstraction (Fig. 3-2), which the book shows to be dangerous. C — virtual memory is the most general form of address spaces. D — not a benefit.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 3–5.</p>
<h3>Q16 — page size of a two-level page table (computed)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q16.png" alt="Original question 16" loading="lazy" /></p></details>
<p><em>A computer with a 32-bit address uses a two-level page table. Virtual addresses are split into a 10-bit top-level page table field, an 12-bit second-level page table field, and an offset. What is the size of the pages?</em><br>A. 512B page · B. 1-KB page · C. 2-KB page · D. 4-KB page</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9d2f6a9d5db1efe844ff0c8a195132db3b0c0c97.svg" alt="The offset is what is left: 32 − 10 − 12" loading="lazy" /><p class="chu-thich">🧮 The offset is what is left: 32 − 10 − 12</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>B — 1 KB.</strong> Offset = 32 − 10 − 12 = 10 bits ⇒ a page has 2¹⁰ = 1024 bytes. Bank key B.</p>
<ul><li>D — 4 KB is the trap: it is the book's own split (10 | 10 | 12, Fig. 3-13), memorised instead of recomputed. A, C — 9- and 11-bit offsets.</li></ul>
<p class="pitfall">⚠️ This is the most repeated question of the whole bank (15 papers), with changing field widths. Never remember "1 KB" — recompute 2^(32 − a − b).</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 18.</p>
<h3>Q17 — FIFO with four frames (computed, = FE1 Q17)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q17.png" alt="Original question 17" loading="lazy" /></p></details>
<p><em>If FIFO page replacement algorithm is used with four page frames, how many page faults will occur with the reference string 0172327103 if the four frames are initially empty?</em><br>A. 4 Pages · B. 5 Pages · C. 6 Pages · D. 7 Pages</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3cd90ae6d3d43eab25ef49ecf8bf3aef7e6a3608.svg" alt="FIFO, four frames, 0 1 7 2 3 2 7 1 0 3" loading="lazy" /><p class="chu-thich">🧮 FIFO, four frames, 0 1 7 2 3 2 7 1 0 3</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>C — 6.</strong> Four faults to fill the empty frames (0, 1, 7, 2), then 3 evicts 0 (the oldest), hits on 2, 7, 1, then 0 evicts 1, and 3 hits. Bank key C. Word for word FE1's original Q17.</p>
<ul><li>A — counts only the loads into empty frames, or forgets them. B, D — miscounting the hits after 3.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 20–22.</p>
<h3>Q18 — what makes translation fast (= FE1 Q18)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q18.png" alt="Original question 18" loading="lazy" /></p></details>
<p><em>When designing a paging system, which of the following factors is the most critical in minimizing translation overhead?</em><br>A. Increasing the number of page table entries per process. · B. Using a Translation Lookaside Buffer (TLB) for faster lookups. · C. Storing page tables in slower secondary storage. · D. Assigning fixed-size page frames without considering process needs.</p>
<p class="dap-an">✅ <strong>B.</strong> Without a TLB every memory reference costs at least one extra reference to the page table; the TLB caches recent translations and hits most of the time. Same as FE1 Q18.</p>
<ul><li>A — more entries make tables bigger, not faster. C — slower storage makes it worse. D — unrelated to translation speed.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 16–17.</p>
<h3>Q19 — who saves the registers after a page fault</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q19.png" alt="Original question 19" loading="lazy" /></p></details>
<p><em>After the page fault trap, which of the following is responsible for saving general-purpose registers and volatile state?</em><br>A. Disk controller · B. Operating system scheduler · C. Assembly-language routine · D. Page replacement algorithm</p>
<p class="dap-an">✅ <strong>C.</strong> Step 2 of the ten steps of page-fault handling (§3.6.1): "An assembly-code routine is started to save the general registers and other volatile information, to prevent the OS from destroying it." C cannot be used: it has no access to the registers directly.</p>
<ul><li>A — the disk only enters at step 6, to read the page. B — the scheduler runs another process while the page is read. D — chooses a victim frame later (step 4).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slides 35–37.</p>
<h3>Q23 — best fit on four holes (computed)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q23.png" alt="Original question 23" loading="lazy" /></p></details>
<p><em>In a memory system consisting of the following hole sizes: 10MB, 18MB, 9MB, and 14MB, suppose the Best Fit algorithm is used. Which holes are allocated in order for consecutive segment requests of 11MB, 2MB, 9MB, and 8MB?</em><br>A. 14MB, 3MB, 10MB, 9MB · B. 18MB, 7MB, 10MB, 9MB · C. 14MB, 3MB, 9MB, 10MB · D. 18MB, 7MB, 9MB, 10MB</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/077696cf9dea88536c560c10c590a1a0972e2ca0.svg" alt="Best fit, the chosen hole is split and its rest stays a hole" loading="lazy" /><p class="chu-thich">🧮 Best fit, the chosen hole is split and its rest stays a hole</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>C — 14, 3, 9, 10.</strong> 11 MB: the smallest hole ≥ 11 is 14 ⇒ 3 MB left. 2 MB: the smallest hole ≥ 2 is now that 3 MB rest. 9 MB: the 9 MB hole, an exact fit. 8 MB: 10 MB (18 is bigger). Bank key C.</p>
<ul><li>A — swaps the last two: 9 MB must take the exact 9, not 10. B, D — start with 18 MB: that is <em>worst</em> fit (18 − 11 = 7 MB is the rest you see in them).</li></ul>
<p class="pitfall">⚠️ The options contain "3MB", so the paper assumes holes are <strong>split</strong> (the book's way). If a whole hole were handed out, best fit would give 14, 9, 10, 18 — not an option:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/644292d53e47aad7d9887eb81495d32534541dbc.svg" alt="The same requests if holes were not split" loading="lazy" /><p class="chu-thich">🧮 The same requests if holes were not split</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slides 9–10.</p>
<h3>Q46 — NOT a benefit of segmentation (= FE1 Q46)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q46.png" alt="Original question 46" loading="lazy" /></p></details>
<p><em>Which of the following is not a benefit of segmentation in memory management?</em><br>A. Segments grow independently without collision · B. Programmers no longer manage memory overlays manually · C. Segments can be loaded into non-contiguous physical memory · D. Segment addresses automatically optimize CPU scheduling</p>
<p class="dap-an">✅ <strong>D.</strong> Note the <strong>not</strong>: three options are real benefits, one is not. Segmentation is about memory; it has nothing to do with CPU scheduling. Same as FE1 Q46.</p>
<ul><li>A — the book's main argument (stack, symbol table… each grows on its own). B — virtual memory as a whole removed manual overlays. C — each segment can sit anywhere in RAM.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slides 42–45.</p>`,
    `<h2>Chương 3 — Quản lý bộ nhớ (11 câu)</h2>
<h3>Câu 11 — x86-64 không còn phân đoạn thật</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q11.png" alt="Ảnh đề gốc câu 11" loading="lazy" /></p></details>
<p>🇬🇧 <em>Evaluate the impact of the absence of real segmentation support in the 64-bit version of the x86 architecture on modern operating systems, considering memory management efficiency and design choices.</em><br>A. The absence of real segmentation results in more efficient memory utilization but limits the diversity of memory management techniques in modern systems. · B. Real segmentation support significantly improves memory management performance, especially in handling dynamic data structures. · C. The lack of real segmentation simplifies memory management but limits the flexibility to handle changing memory requirements in modern operating systems. · D. The absence of real segmentation has no impact on modern operating systems as they rely solely on paging techniques for memory management.</p>
<p>🇻🇳 Đánh giá tác động của việc bản x86 64 bit không còn hỗ trợ phân đoạn thật lên các HĐH hiện đại (hiệu quả quản lý bộ nhớ, lựa chọn thiết kế). A. Dùng bộ nhớ hiệu quả hơn nhưng bớt đa dạng kỹ thuật · B. Phân đoạn thật cải thiện mạnh hiệu năng, nhất là với cấu trúc động · C. Quản lý bộ nhớ đơn giản hơn nhưng kém linh hoạt khi nhu cầu bộ nhớ thay đổi · D. Không ảnh hưởng gì vì HĐH chỉ dùng phân trang.</p>
<p>📚 <strong>absence</strong> = sự vắng mặt · <strong>flat address space</strong> = không gian địa chỉ phẳng · <strong>flexibility</strong> = sự linh hoạt.</p>
<p class="dap-an">✅ <strong>C</strong> (khoá ngân hàng). Ở chế độ 64 bit, base và limit của đoạn bị bỏ qua (chỉ FS/GS còn dùng, cho bộ nhớ riêng của luồng), nên mọi HĐH dùng một không gian địa chỉ phẳng với phân trang: đơn giản hơn — nhưng mất cái lợi "mỗi cấu trúc tự lớn lên" của phân đoạn.</p>
<ul><li>A — hiệu quả bộ nhớ đến từ phân trang, không phải từ việc bỏ đoạn. B — nói ngược sự đánh đổi, và chẳng HĐH hiện đại nào dựa vào nó (OS/2 là người dùng lớn cuối cùng). D — "không ảnh hưởng gì" quá tuyệt đối: mô hình phẳng là hệ quả thiết kế. Câu "evaluate" mơ hồ: chọn phát biểu cân bằng, giống giọng sách.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slide 52–55.</p>
<h3>Câu 12 — HĐH theo dõi bộ nhớ bằng gì</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q12.png" alt="Ảnh đề gốc câu 12" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which of the following methods is used to track memory?</em><br>A. Linked Lists · B. Best fit · C. Paging · D. Segmentation</p>
<p>🇻🇳 Phương pháp nào dùng để theo dõi bộ nhớ? A. Danh sách liên kết · B. Best fit · C. Phân trang · D. Phân đoạn.</p>
<p>📚 <strong>track</strong> = theo dõi · <strong>linked list</strong> = danh sách liên kết · <strong>bitmap</strong> = bảng bit.</p>
<p class="dap-an">✅ <strong>A.</strong> Mục 3.2.3: hai cách theo dõi bộ nhớ đã dùng — <strong>bitmap</strong> và <strong>danh sách liên kết</strong> các đoạn đã cấp và các lỗ (Hình 3-6).</p>
<ul><li>B — thuật toán <em>dùng</em> danh sách đó để chọn lỗ. C, D — cả một cơ chế quản lý bộ nhớ, không phải cách ghi sổ.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 8–9.</p>
<h3>Câu 13 — trang lớn hơn, phân mảnh trong nhiều hơn</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q13.png" alt="Ảnh đề gốc câu 13" loading="lazy" /></p></details>
<p>🇬🇧 <em>In paged memory systems, if the page size is increased, then the internal fragmentation generally ____.</em><br>A. becomes less · B. becomes more · C. remains constant · D. none of mentioned</p>
<p>🇻🇳 Trong hệ phân trang, nếu tăng cỡ trang thì phân mảnh trong nói chung sẽ thế nào? A. Ít đi · B. Nhiều hơn · C. Không đổi · D. Không phương án nào.</p>
<p>📚 <strong>internal fragmentation</strong> = phân mảnh trong (phần thừa bỏ phí bên trong một trang) · <strong>page size</strong> = cỡ trang.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/771a69a34fd5ffe4d93daa9dc4d90e2143e8e461.svg" alt="Phần thừa ở trang cuối, trung bình trên mọi cỡ chương trình, với năm cỡ trang" loading="lazy" /><p class="chu-thich">🧮 Phần thừa ở trang cuối, trung bình trên mọi cỡ chương trình, với năm cỡ trang</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>B.</strong> Chương trình hiếm khi lấp kín trang cuối; trung bình bỏ phí nửa trang (sách: "trung bình nửa trang cuối sẽ trống"). Nửa trang lớn thì nhiều byte hơn.</p>
<ul><li>A — ngược lại (đó là lý lẽ <em>ủng hộ</em> trang nhỏ). C — phần phí tỉ lệ với cỡ trang. D — B đúng.</li></ul>
<p class="meo">🧠 Câu soi gương, câu 11 đề gốc FE1: trang nhỏ hơn ⇒ <em>nhiều lỗi trang hơn</em> và bảng trang lớn hơn. Cỡ trang là sự đánh đổi giữa hai bên.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 16; cỡ trang (mục 3.5.3) ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>.</p>
<h3>Câu 14 — phân vùng cố định (các đề khoá khác nhau)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q14.png" alt="Ảnh đề gốc câu 14" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which memory management technique involves dividing memory into fixed-sized partitions to accommodate varying process sizes?</em><br>A. Paging Management · B. Contiguous Allocation · C. Segmentation · D. Virtual Memory Management</p>
<p>🇻🇳 Kỹ thuật quản lý bộ nhớ nào chia bộ nhớ thành các phân vùng cỡ cố định để chứa các tiến trình có cỡ khác nhau? A. Phân trang · B. Cấp phát liên tục · C. Phân đoạn · D. Quản lý bộ nhớ ảo.</p>
<p>📚 <strong>fixed-sized partition</strong> = phân vùng cỡ cố định · <strong>contiguous allocation</strong> = cấp phát liên tục · <strong>accommodate</strong> = chứa được.</p>
<p class="dap-an">✅ <strong>B</strong> (khoá ngân hàng ở đây và ở FE12#15, FE13#15, FE14#18, FE15#18). Silberschatz mở đầu mục cấp phát bộ nhớ liên tục bằng câu "một trong những cách cấp phát bộ nhớ đơn giản nhất là chia bộ nhớ thành nhiều phân vùng cỡ cố định" — mỗi phân vùng chứa trọn một tiến trình (MFT của IBM OS/360).</p>
<div class="callout"><p><strong>FE5#18 khoá A (phân trang) cho cùng câu</strong>, và chữ trong đề cũng hợp với phân trang: khung trang cỡ cố định, tiến trình cỡ nào cũng dùng đủ số khung nó cần. Năm đề so với một, cộng câu của giáo trình: chọn B.</p></div>
<ul><li>C — đoạn có cỡ <em>thay đổi</em>. D — một khái niệm chung xây trên phân trang, không phải kỹ thuật chia vùng.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 3–4 (bộ nhớ không trừu tượng); phân mảnh ngoài ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slide 46.</p>
<h3>Câu 15 — không gian địa chỉ mang lại gì</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q15.png" alt="Ảnh đề gốc câu 15" loading="lazy" /></p></details>
<p>🇬🇧 <em>How does memory abstraction through address spaces benefit a computer system?</em><br>A. It allows each process to access the entire physical memory directly. · B. It isolates processes from one another, preventing unauthorized access. · C. It eliminates the need for virtual memory. · D. It reduces CPU processing speed.</p>
<p>🇻🇳 Trừu tượng bộ nhớ bằng không gian địa chỉ có lợi gì? A. Mỗi tiến trình truy cập thẳng toàn bộ bộ nhớ vật lý · B. Cô lập các tiến trình với nhau, chặn truy cập trái phép · C. Không cần bộ nhớ ảo nữa · D. Giảm tốc độ xử lý của CPU.</p>
<p>📚 <strong>address space</strong> = không gian địa chỉ · <strong>isolate</strong> = cô lập · <strong>unauthorized</strong> = trái phép.</p>
<p class="dap-an">✅ <strong>B.</strong> Không gian địa chỉ là tập địa chỉ một tiến trình được dùng, riêng của nó: địa chỉ 100 của tiến trình này không phải địa chỉ 100 của tiến trình kia (thanh ghi base và limit, Hình 3-3; sau này là bảng trang).</p>
<ul><li>A — đó là tình trạng <em>không có</em> trừu tượng (Hình 3-2), sách cho thấy nó nguy hiểm. C — bộ nhớ ảo là dạng tổng quát nhất của không gian địa chỉ. D — không phải lợi ích.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 3–5.</p>
<h3>Câu 16 — cỡ trang của bảng trang hai mức (câu tính)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q16.png" alt="Ảnh đề gốc câu 16" loading="lazy" /></p></details>
<p>🇬🇧 <em>A computer with a 32-bit address uses a two-level page table. Virtual addresses are split into a 10-bit top-level page table field, an 12-bit second-level page table field, and an offset. What is the size of the pages?</em><br>A. 512B page · B. 1-KB page · C. 2-KB page · D. 4-KB page</p>
<p>🇻🇳 Máy địa chỉ 32 bit dùng bảng trang hai mức. Địa chỉ ảo chia thành trường bảng cấp 1 dài 10 bit, trường bảng cấp 2 dài 12 bit, và độ dời. Trang có kích thước bao nhiêu?</p>
<p>📚 <strong>two-level page table</strong> = bảng trang hai mức · <strong>top-level / second-level</strong> = cấp 1 / cấp 2 · <strong>offset</strong> = độ dời (vị trí trong trang).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6719fb8490c80a774ee65b05ad506fd3f6b1daae.svg" alt="Độ dời là phần còn lại: 32 − 10 − 12" loading="lazy" /><p class="chu-thich">🧮 Độ dời là phần còn lại: 32 − 10 − 12</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>B — 1 KB.</strong> Độ dời = 32 − 10 − 12 = 10 bit ⇒ một trang có 2¹⁰ = 1024 byte. Khoá ngân hàng B.</p>
<ul><li>D — 4 KB là bẫy: đó là cách chia của chính sách (10 | 10 | 12, Hình 3-13), học thuộc thay vì tính lại. A, C — độ dời 9 và 11 bit.</li></ul>
<p class="pitfall">⚠️ Đây là câu lặp nhiều nhất của cả ngân hàng (15 đề), độ rộng trường thay đổi. Đừng nhớ "1 KB" — lần nào cũng tính lại 2^(32 − a − b).</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 18.</p>
<h3>Câu 17 — FIFO bốn khung (câu tính, = câu 17 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q17.png" alt="Ảnh đề gốc câu 17" loading="lazy" /></p></details>
<p>🇬🇧 <em>If FIFO page replacement algorithm is used with four page frames, how many page faults will occur with the reference string 0172327103 if the four frames are initially empty?</em><br>A. 4 Pages · B. 5 Pages · C. 6 Pages · D. 7 Pages</p>
<p>🇻🇳 Dùng thay trang FIFO với bốn khung, ban đầu cả bốn trống, chuỗi tham chiếu 0172327103 gây bao nhiêu lỗi trang?</p>
<p>📚 <strong>reference string</strong> = chuỗi tham chiếu · <strong>page frame</strong> = khung trang · <strong>initially empty</strong> = ban đầu trống.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/41ddc48ba75d2c6f2cae6365eaa7dabcd705cc1f.svg" alt="FIFO, bốn khung, 0 1 7 2 3 2 7 1 0 3" loading="lazy" /><p class="chu-thich">🧮 FIFO, bốn khung, 0 1 7 2 3 2 7 1 0 3</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>C — 6.</strong> Bốn lỗi để lấp các khung trống (0, 1, 7, 2), rồi 3 đẩy 0 ra (cũ nhất), trúng 2, 7, 1, rồi 0 đẩy 1 ra, và 3 trúng. Khoá ngân hàng C. Giống hệt câu 17 đề gốc FE1.</p>
<ul><li>A — chỉ đếm (hoặc quên) các lần nạp vào khung trống. B, D — đếm sai số lần trúng sau số 3.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 20–22.</p>
<h3>Câu 18 — điều gì làm dịch địa chỉ nhanh (= câu 18 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q18.png" alt="Ảnh đề gốc câu 18" loading="lazy" /></p></details>
<p>🇬🇧 <em>When designing a paging system, which of the following factors is the most critical in minimizing translation overhead?</em><br>A. Increasing the number of page table entries per process. · B. Using a Translation Lookaside Buffer (TLB) for faster lookups. · C. Storing page tables in slower secondary storage. · D. Assigning fixed-size page frames without considering process needs.</p>
<p>🇻🇳 Khi thiết kế hệ phân trang, yếu tố nào quan trọng nhất để giảm chi phí dịch địa chỉ? A. Tăng số mục bảng trang mỗi tiến trình · B. Dùng TLB để tra nhanh · C. Để bảng trang ở bộ nhớ thứ cấp chậm hơn · D. Cấp khung cố định không xét nhu cầu tiến trình.</p>
<p>📚 <strong>translation overhead</strong> = chi phí dịch địa chỉ · <strong>TLB (Translation Lookaside Buffer)</strong> = bộ đệm dịch địa chỉ.</p>
<p class="dap-an">✅ <strong>B.</strong> Không có TLB thì mỗi lần truy cập bộ nhớ tốn thêm ít nhất một lần đọc bảng trang; TLB lưu các phép dịch gần đây và trúng gần như mọi lúc. Giống câu 18 FE1.</p>
<ul><li>A — thêm mục làm bảng lớn hơn, không nhanh hơn. C — bộ nhớ chậm hơn chỉ tệ hơn. D — không liên quan tới tốc độ dịch.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 16–17.</p>
<h3>Câu 19 — ai lưu thanh ghi sau lỗi trang</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q19.png" alt="Ảnh đề gốc câu 19" loading="lazy" /></p></details>
<p>🇬🇧 <em>After the page fault trap, which of the following is responsible for saving general-purpose registers and volatile state?</em><br>A. Disk controller · B. Operating system scheduler · C. Assembly-language routine · D. Page replacement algorithm</p>
<p>🇻🇳 Sau bẫy lỗi trang, ai lo lưu các thanh ghi đa dụng và trạng thái dễ mất? A. Bộ điều khiển đĩa · B. Bộ lập lịch của HĐH · C. Một thủ tục hợp ngữ · D. Thuật toán thay trang.</p>
<p>📚 <strong>trap</strong> = bẫy (ngắt mềm vào nhân) · <strong>general-purpose register</strong> = thanh ghi đa dụng · <strong>volatile state</strong> = trạng thái dễ mất · <strong>assembly-language routine</strong> = thủ tục hợp ngữ.</p>
<p class="dap-an">✅ <strong>C.</strong> Bước 2 trong mười bước xử lý lỗi trang (mục 3.6.1): "Một thủ tục hợp ngữ được chạy để lưu các thanh ghi đa dụng và thông tin dễ mất khác, để HĐH không phá chúng." Không dùng C được: C không đụng thẳng tới thanh ghi.</p>
<ul><li>A — đĩa chỉ vào cuộc ở bước 6, để đọc trang. B — bộ lập lịch chạy tiến trình khác trong lúc chờ đọc trang. D — chọn khung bị đẩy ra ở bước sau (bước 4).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slide 35–37.</p>
<h3>Câu 23 — best fit trên bốn lỗ (câu tính)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q23.png" alt="Ảnh đề gốc câu 23" loading="lazy" /></p></details>
<p>🇬🇧 <em>In a memory system consisting of the following hole sizes: 10MB, 18MB, 9MB, and 14MB, suppose the Best Fit algorithm is used. Which holes are allocated in order for consecutive segment requests of 11MB, 2MB, 9MB, and 8MB?</em><br>A. 14MB, 3MB, 10MB, 9MB · B. 18MB, 7MB, 10MB, 9MB · C. 14MB, 3MB, 9MB, 10MB · D. 18MB, 7MB, 9MB, 10MB</p>
<p>🇻🇳 Bộ nhớ có các lỗ trống 10, 18, 9, 14 MB; dùng Best Fit. Với các yêu cầu đoạn liên tiếp 11, 2, 9, 8 MB, lần lượt những lỗ nào được cấp?</p>
<p>📚 <strong>hole</strong> = lỗ trống · <strong>best fit</strong> = vừa khít nhất · <strong>consecutive</strong> = liên tiếp.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6cb7639bcf406bd1469ed0f7b7031a1e01bf3185.svg" alt="Best fit, lỗ được chọn bị tách và phần dư vẫn là một lỗ" loading="lazy" /><p class="chu-thich">🧮 Best fit, lỗ được chọn bị tách và phần dư vẫn là một lỗ</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>C — 14, 3, 9, 10.</strong> 11 MB: lỗ nhỏ nhất ≥ 11 là 14 ⇒ dư 3 MB. 2 MB: lỗ nhỏ nhất ≥ 2 giờ là phần dư 3 MB đó. 9 MB: lỗ 9 MB, vừa khít. 8 MB: 10 MB (18 lớn hơn). Khoá ngân hàng C.</p>
<ul><li>A — đảo hai bước cuối: 9 MB phải lấy lỗ 9 khít, không lấy 10. B, D — bắt đầu bằng 18 MB: đó là <em>worst</em> fit (18 − 11 = 7 MB là phần dư thấy trong hai phương án đó).</li></ul>
<p class="pitfall">⚠️ Phương án có "3MB", nên đề giả định lỗ được <strong>tách</strong> (cách của sách). Nếu cấp nguyên cả lỗ thì best fit ra 14, 9, 10, 18 — không có trong phương án:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/15f8341695d5e70cf00a8456b9a3e1c24f962815.svg" alt="Cùng các yêu cầu nếu lỗ không bị tách" loading="lazy" /><p class="chu-thich">🧮 Cùng các yêu cầu nếu lỗ không bị tách</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-1">3.A</a>, slide 9–10.</p>
<h3>Câu 46 — KHÔNG phải lợi ích của phân đoạn (= câu 46 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q46.png" alt="Ảnh đề gốc câu 46" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which of the following is not a benefit of segmentation in memory management?</em><br>A. Segments grow independently without collision · B. Programmers no longer manage memory overlays manually · C. Segments can be loaded into non-contiguous physical memory · D. Segment addresses automatically optimize CPU scheduling</p>
<p>🇻🇳 Đâu KHÔNG phải lợi ích của phân đoạn? A. Các đoạn lớn lên độc lập không va nhau · B. Lập trình viên khỏi tự quản lý overlay · C. Các đoạn nạp được vào bộ nhớ vật lý không liền nhau · D. Địa chỉ đoạn tự tối ưu lập lịch CPU.</p>
<p>📚 <strong>overlay</strong> = phủ chồng (tự chia chương trình thành phần nạp lần lượt) · <strong>collision</strong> = va chạm · <strong>non-contiguous</strong> = không liền nhau.</p>
<p class="dap-an">✅ <strong>D.</strong> Để ý chữ <strong>not</strong>: ba phương án là lợi ích thật, một thì không. Phân đoạn là chuyện bộ nhớ; nó chẳng dính gì tới lập lịch CPU. Giống câu 46 FE1.</p>
<ul><li>A — lý lẽ chính của sách (ngăn xếp, bảng ký hiệu… mỗi thứ tự lớn lên). B — bộ nhớ ảo nói chung đã xoá việc overlay bằng tay. C — mỗi đoạn nằm đâu trong RAM cũng được.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg3-2">3.B</a>, slide 42–45.</p>`),
    bi(`<h2>Chapter 4 — File systems (6 questions)</h2>
<h3>Q21 — indexed allocation</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q21.png" alt="Original question 21" loading="lazy" /></p></details>
<p><em>Indexed Allocation in file systems uses</em><br>A. A table of pointers for each file · B. Contiguous blocks of disk space · C. Linked lists to connect files · D. Hierarchical file structures</p>
<p class="dap-an">✅ <strong>A.</strong> Each file has its own index — in UNIX the i-node (Fig. 4-13): the file's attributes plus a table of block addresses (direct, then single/double/triple indirect).</p>
<ul><li>B — contiguous allocation. C — linked-list allocation (each block, or the FAT, points to the next). D — that is how directories are organised, not how blocks are allocated.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 21.</p>
<h3>Q22 — moving the file pointer</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q22.png" alt="Original question 22" loading="lazy" /></p></details>
<p><em>Which system call repositions the file pointer so that data can be read from or written to a specific location in the file?</em><br>A. Seek · B. Append · C. Rename · D. Write</p>
<p class="dap-an">✅ <strong>A.</strong> In the book's list of file operations, <strong>Seek</strong> repositions the current position for random access; in UNIX it is <code>lseek(fd, offset, whence)</code>, in Win32 <code>SetFilePointer</code>.</p>
<ul><li>B — writes only at the end. C — changes the name. D — writes at the current position and moves it, but cannot jump.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 9; <code>lseek</code> in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slide 33.</p>
<h3>Q24 — a pointer in each block</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q24.png" alt="Original question 24" loading="lazy" /></p></details>
<p><em>Which file allocation method uses pointers in each file block to the next block?</em><br>A. Contiguous allocation · B. Indexed allocation · C. Linked allocation · D. Hash-based allocation</p>
<p class="dap-an">✅ <strong>C.</strong> Fig. 4-11: the first word of each block points to the next one. No external fragmentation, but random access means following the chain — which is why FAT moves those pointers into a table in memory (Fig. 4-12).</p>
<ul><li>A — consecutive blocks, no pointers needed. B — pointers collected in one index block per file, not in every block. D — not a file-allocation method of the book.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slides 19–20.</p>
<h3>Q25 — defragmenting an SSD (= FE1 Q25)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q25.png" alt="Original question 25" loading="lazy" /></p></details>
<p><em>Why is defragmenting a Solid-State Drive (SSD) generally not recommended?</em><br>A. SSDs store data without needing contiguous blocks · B. SSDs can fail when defragmented more than once · C. SSDs degrade faster with unnecessary write cycles · D. SSDs auto-defrag and ignore manual optimization</p>
<p class="dap-an">✅ <strong>C.</strong> Flash cells survive a limited number of writes; defragmenting rewrites a lot of data for no gain, because an SSD has no seek time. Same as FE1 Q25.</p>
<ul><li>A is half true (contiguity does not help an SSD) but it explains why defragmenting is <em>useless</em>, not why it is <em>harmful</em>. B — invented. D — the drive's internal wear-levelling is not a defragmenter.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-2">4.B</a>, slides 38–40.</p>
<h3>Q26 — FAT-16 with 4 KB blocks (computed)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q26.png" alt="Original question 26" loading="lazy" /></p></details>
<p><em>In Windows 95, which is the maximum partition size, if the FAT type is FAT-16 and the block size is 4 KB?</em><br>A. 128MB · B. 256MB · C. 512MB · D. 1024MB</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/cd827fb0d9351d6901ef7fe9f18aa40e5dca9b6b.svg" alt="Figure 4-31 recomputed: number of addressable blocks × block size" loading="lazy" /><p class="chu-thich">🧮 Figure 4-31 recomputed: number of addressable blocks × block size</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>B — 256 MB.</strong> A FAT-16 entry is 16 bits ⇒ 2¹⁶ = 65 536 block numbers; × 4 KB = 262 144 KB = 256 MB. Bank key B (same question in FE4#32, FE12#32, FE14#36, FE15#33).</p>
<ul><li>A, C, D — the same formula with 2, 8 and 16 KB blocks: each option doubles the block size.</li></ul>
<p class="pitfall">⚠️ The sister question (FE5#26, FE7#33): FAT-32 with 16 KB blocks. 2²⁸ × 16 KB = 4 TB, but the book's table says <strong>2 TB</strong> — the MBR partition table counts sectors in 32 bits (2³² × 512 B). FAT-32 uses only 28 bits, not 32.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-2">4.B</a>, slides 41–42.</p>
<h3>Q27 — the file descriptor</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q27.png" alt="Original question 27" loading="lazy" /></p></details>
<p><em>What is the role of a file descriptor in Unix-based systems?</em><br>A. To keep track of file sizes · B. To store the file contents · C. To keep track of open files and their I/O operations · D. To store the file's metadata</p>
<p class="dap-an">✅ <strong>C.</strong> <code>open</code> returns a small integer — 0, 1, 2 are already stdin, stdout, stderr — that indexes the process's table of open files; every <code>read</code>, <code>write</code>, <code>lseek</code>, <code>close</code> names the file by it, and the current position travels with it.</p>
<ul><li>A, D — size and other metadata live in the i-node. B — contents live in the data blocks.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slides 10–12; Linux in <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg10-2">10.B</a>, slide 37.</p>`,
    `<h2>Chương 4 — Hệ thống tệp (6 câu)</h2>
<h3>Câu 21 — cấp phát chỉ mục</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q21.png" alt="Ảnh đề gốc câu 21" loading="lazy" /></p></details>
<p>🇬🇧 <em>Indexed Allocation in file systems uses</em><br>A. A table of pointers for each file · B. Contiguous blocks of disk space · C. Linked lists to connect files · D. Hierarchical file structures</p>
<p>🇻🇳 Cấp phát chỉ mục trong hệ thống tệp dùng gì? A. Một bảng con trỏ cho mỗi tệp · B. Các khối đĩa liền nhau · C. Danh sách liên kết nối các tệp · D. Cấu trúc tệp phân cấp.</p>
<p>📚 <strong>indexed allocation</strong> = cấp phát chỉ mục · <strong>pointer</strong> = con trỏ (địa chỉ khối) · <strong>i-node</strong> = nút chỉ mục.</p>
<p class="dap-an">✅ <strong>A.</strong> Mỗi tệp có chỉ mục riêng — trong UNIX là i-node (Hình 4-13): thuộc tính của tệp cộng một bảng địa chỉ khối (trực tiếp, rồi gián tiếp đơn/đôi/ba).</p>
<ul><li>B — cấp phát liên tục. C — cấp phát danh sách liên kết (mỗi khối, hoặc FAT, trỏ tới khối kế). D — đó là cách tổ chức thư mục, không phải cách cấp khối.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 21.</p>
<h3>Câu 22 — dời con trỏ tệp</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q22.png" alt="Ảnh đề gốc câu 22" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which system call repositions the file pointer so that data can be read from or written to a specific location in the file?</em><br>A. Seek · B. Append · C. Rename · D. Write</p>
<p>🇻🇳 Lời gọi hệ thống nào đặt lại con trỏ tệp để đọc/ghi ở một vị trí cụ thể trong tệp? A. Seek · B. Append (ghi nối đuôi) · C. Rename (đổi tên) · D. Write (ghi).</p>
<p>📚 <strong>reposition</strong> = đặt lại vị trí · <strong>file pointer</strong> = con trỏ tệp (vị trí hiện tại) · <strong>random access</strong> = truy cập ngẫu nhiên.</p>
<p class="dap-an">✅ <strong>A.</strong> Trong danh sách thao tác tệp của sách, <strong>Seek</strong> đặt lại vị trí hiện tại để truy cập ngẫu nhiên; trong UNIX là <code>lseek(fd, offset, whence)</code>, trong Win32 là <code>SetFilePointer</code>.</p>
<ul><li>B — chỉ ghi vào cuối. C — đổi tên. D — ghi ở vị trí hiện tại rồi dời nó, nhưng không nhảy được.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 9; <code>lseek</code> ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg1-2">1.B</a>, slide 33.</p>
<h3>Câu 24 — con trỏ nằm trong từng khối</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q24.png" alt="Ảnh đề gốc câu 24" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which file allocation method uses pointers in each file block to the next block?</em><br>A. Contiguous allocation · B. Indexed allocation · C. Linked allocation · D. Hash-based allocation</p>
<p>🇻🇳 Phương pháp cấp phát tệp nào đặt trong mỗi khối một con trỏ tới khối kế? A. Liên tục · B. Chỉ mục · C. Liên kết · D. Theo băm.</p>
<p>📚 <strong>linked allocation</strong> = cấp phát liên kết · <strong>next block</strong> = khối kế tiếp.</p>
<p class="dap-an">✅ <strong>C.</strong> Hình 4-11: từ đầu tiên của mỗi khối trỏ tới khối sau. Không có phân mảnh ngoài, nhưng truy cập ngẫu nhiên phải lần theo chuỗi — vì vậy FAT dời các con trỏ đó vào một bảng trong bộ nhớ (Hình 4-12).</p>
<ul><li>A — khối liền nhau, khỏi cần con trỏ. B — con trỏ gom vào một khối chỉ mục cho mỗi tệp, không nằm trong từng khối. D — không phải phương pháp cấp phát tệp của sách.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 19–20.</p>
<h3>Câu 25 — chống phân mảnh SSD (= câu 25 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q25.png" alt="Ảnh đề gốc câu 25" loading="lazy" /></p></details>
<p>🇬🇧 <em>Why is defragmenting a Solid-State Drive (SSD) generally not recommended?</em><br>A. SSDs store data without needing contiguous blocks · B. SSDs can fail when defragmented more than once · C. SSDs degrade faster with unnecessary write cycles · D. SSDs auto-defrag and ignore manual optimization</p>
<p>🇻🇳 Vì sao thường không nên chống phân mảnh (defrag) ổ SSD? A. SSD lưu dữ liệu không cần khối liền nhau · B. SSD có thể hỏng nếu defrag quá một lần · C. SSD xuống cấp nhanh hơn vì các lần ghi không cần thiết · D. SSD tự defrag và bỏ qua tối ưu bằng tay.</p>
<p>📚 <strong>defragment</strong> = chống phân mảnh · <strong>degrade</strong> = xuống cấp · <strong>write cycle</strong> = chu kỳ ghi · <strong>wear levelling</strong> = cân bằng hao mòn.</p>
<p class="dap-an">✅ <strong>C.</strong> Ô nhớ flash chỉ chịu được số lần ghi có hạn; defrag ghi lại rất nhiều dữ liệu mà chẳng được gì, vì SSD không có thời gian tìm. Giống câu 25 FE1.</p>
<ul><li>A đúng một nửa (liền nhau không giúp gì SSD) nhưng nó giải thích vì sao defrag <em>vô ích</em>, không phải vì sao <em>có hại</em>. B — bịa. D — cân bằng hao mòn bên trong ổ không phải là defrag.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-2">4.B</a>, slide 38–40.</p>
<h3>Câu 26 — FAT-16 với khối 4 KB (câu tính)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q26.png" alt="Ảnh đề gốc câu 26" loading="lazy" /></p></details>
<p>🇬🇧 <em>In Windows 95, which is the maximum partition size, if the FAT type is FAT-16 and the block size is 4 KB?</em><br>A. 128MB · B. 256MB · C. 512MB · D. 1024MB</p>
<p>🇻🇳 Trong Windows 95, nếu dùng FAT-16 với cỡ khối 4 KB thì phân vùng lớn nhất là bao nhiêu?</p>
<p>📚 <strong>partition</strong> = phân vùng · <strong>block (cluster) size</strong> = cỡ khối (cụm) · <strong>FAT entry</strong> = một mục của bảng FAT.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f297458628eb9747c51c1255af003b71b36fcb24.svg" alt="Hình 4-31 tính lại: số khối địa chỉ hoá được × cỡ khối" loading="lazy" /><p class="chu-thich">🧮 Hình 4-31 tính lại: số khối địa chỉ hoá được × cỡ khối</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>B — 256 MB.</strong> Một mục FAT-16 dài 16 bit ⇒ 2¹⁶ = 65 536 số hiệu khối; × 4 KB = 262 144 KB = 256 MB. Khoá ngân hàng B (cùng câu ở FE4#32, FE12#32, FE14#36, FE15#33).</p>
<ul><li>A, C, D — cùng công thức với khối 2, 8 và 16 KB: mỗi phương án gấp đôi cỡ khối.</li></ul>
<p class="pitfall">⚠️ Câu chị em (FE5#26, FE7#33): FAT-32 với khối 16 KB. 2²⁸ × 16 KB = 4 TB, nhưng bảng của sách ghi <strong>2 TB</strong> — bảng phân vùng MBR đếm sector bằng 32 bit (2³² × 512 B). FAT-32 chỉ dùng 28 bit chứ không phải 32.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-2">4.B</a>, slide 41–42.</p>
<h3>Câu 27 — bộ mô tả tệp</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q27.png" alt="Ảnh đề gốc câu 27" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is the role of a file descriptor in Unix-based systems?</em><br>A. To keep track of file sizes · B. To store the file contents · C. To keep track of open files and their I/O operations · D. To store the file's metadata</p>
<p>🇻🇳 Trong các hệ dựa trên UNIX, bộ mô tả tệp (file descriptor) có vai trò gì? A. Theo dõi kích thước tệp · B. Lưu nội dung tệp · C. Theo dõi các tệp đang mở và thao tác I/O trên chúng · D. Lưu siêu dữ liệu của tệp.</p>
<p>📚 <strong>file descriptor</strong> = bộ mô tả tệp (số nguyên nhỏ chỉ tệp đang mở) · <strong>metadata</strong> = siêu dữ liệu.</p>
<p class="dap-an">✅ <strong>C.</strong> <code>open</code> trả về một số nguyên nhỏ — 0, 1, 2 đã là stdin, stdout, stderr — làm chỉ số vào bảng tệp đang mở của tiến trình; mọi <code>read</code>, <code>write</code>, <code>lseek</code>, <code>close</code> gọi tên tệp bằng số này, và vị trí hiện tại đi kèm với nó.</p>
<ul><li>A, D — kích thước và siêu dữ liệu khác nằm trong i-node. B — nội dung nằm trong các khối dữ liệu.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg4-1">4.A</a>, slide 10–12; Linux ở <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg10-2">10.B</a>, slide 37.</p>`),
    bi(`<h2>Chapter 5 — Input/output (8 questions)</h2>
<h3>Q28 — the layer closest to the hardware</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q28.png" alt="Original question 28" loading="lazy" /></p></details>
<p><em>Which layer of the I/O software system is closest to the hardware?</em><br>A. Interrupt handlers · B. Device drivers · C. Device-independent operating system software · D. User-level I/O software</p>
<p class="dap-an">✅ <strong>A.</strong> Fig. 5-11, from the bottom: hardware → <strong>interrupt handlers</strong> → device drivers → device-independent OS software → user-level I/O software.</p>
<ul><li>B — second from the bottom. C — third. D — at the top, in user space.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slide 15.</p>
<h3>Q29 — C-SCAN at the end of the disk</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q29.png" alt="Original question 29" loading="lazy" /></p></details>
<p><em>In C-SCAN scheduling, what happens when the arm reaches the end?</em><br>A. Stops · B. Jumps back · C. Reverses · D. Skips requests · E. Ignores</p>
<p class="dap-an">✅ <strong>B.</strong> C-SCAN (circular SCAN) always serves in one direction: at the end it returns to the other end <em>without serving anything on the way</em> and starts upward again. That gives every cylinder the same maximum wait.</p>
<ul><li>C — reversing and serving on the way back is plain SCAN, the elevator (Fig. 5-25). A — the arm never "stops" while requests remain. D, E — it skips nothing; the requests behind it are served on the next sweep.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slides 31–33.</p>
<h3>Q30 — the two bus modes of DMA</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q30.png" alt="Original question 30" loading="lazy" /></p></details>
<p><em>In DMA transfer cycle, what two modes can many buses operate in?</em><br>A. Word-at-a-time mode and byte mode. · B. Word-at-a-time mode and block mode. · C. Word-at-a-time mode and bit mode. · D. Word-at-a-time mode and page mode.</p>
<p class="dap-an">✅ <strong>B.</strong> Word-at-a-time: the DMA controller "steals" one bus cycle per word (cycle stealing). Block mode: it acquires the bus, transfers a whole series, releases it (burst mode).</p>
<ul><li>A, C, D — bytes, bits and pages are not bus modes in the book.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slide 6.</p>
<h3>Q31 — the three ways to do I/O (choose three)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q31.png" alt="Original question 31" loading="lazy" /></p></details>
<p><em>Choose correct answers. What are the three basic different ways that IO operations in computer system can be performed?</em><br>A. Programmed I/O · B. Memory-mapped I/O · C. Interrupt-driven I/O · D. I/O using DMA</p>
<p class="dap-an">✅ <strong>A, C and D</strong> — tick all three. §5.2.2–5.2.4: programmed I/O (the CPU polls), interrupt-driven I/O (the device interrupts after each character), I/O using DMA (the DMA controller does the polling, one interrupt per block).</p>
<ul><li>B — memory-mapped I/O is how device registers are <em>addressed</em> (as memory instead of I/O ports, §5.1.3); any of the three methods can use it.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slides 11–14; memory-mapped I/O at slides 4–5.</p>
<h3>Q32 — device drivers (= FE1 Q32)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q32.png" alt="Original question 32" loading="lazy" /></p></details>
<p><em>Which I/O software layer is primarily responsible for handling device-specific details while maintaining a uniform interface for the upper layers?</em><br>A. User-space I/O libraries · B. Device drivers · C. Interrupt handlers · D. Hardware controllers</p>
<p class="dap-an">✅ <strong>B.</strong> Device-specific code lives in the driver; above it, the device-independent layer sees the same interface for every driver of a class. Same as FE1 Q32.</p>
<ul><li>A — on top, device-independent. C — handle the interrupt, then wake the driver. D — hardware, not a software layer.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slides 15, 18–20.</p>
<h3>Q33 — the weakness of RAID 0</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q33.png" alt="Original question 33" loading="lazy" /></p></details>
<p><em>What are the weaknesses of RAID 0?</em><br>A. Requires the highest number of disks in RAID modes · B. There is no data recovery mechanism · C. The unit of data transmitted is at the BIT level · D. Does not improve read and write speeds</p>
<p class="dap-an">✅ <strong>B.</strong> RAID 0 only stripes data; there is no copy and no parity, so one failed drive loses the data — and with N drives a failure is N times more likely than with one. It has no redundancy at all — the R of RAID is missing.</p>
<ul><li>A — two drives are enough. C — bit level is RAID 2 (and byte level RAID 3); RAID 0 stripes in blocks. D — false: large requests are served by several drives in parallel (only one-sector requests gain nothing — FE2 Q34).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slides 26–27.</p>
<h3>Q34 — NOT a duty of the clock software</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q34.png" alt="Original question 34" loading="lazy" /></p></details>
<p><em>Which of the following is NOT one of the usual duties of Clock Software?</em><br>A. Maintaining the time of day. · B. Helping processes in running longer than they are allowed to. · C. Accounting for CPU usage. · D. Handling the alarm system call made by user processes. · E. Doing profiling, monitoring, and statistics gathering.</p>
<p class="dap-an">✅ <strong>B.</strong> The book's list of duties: time of day, <em>preventing</em> processes from running longer than they are allowed to, CPU accounting, the <code>alarm</code> call, watchdog timers, profiling and statistics. B turns one duty upside down.</p>
<ul><li>A, C, D, E — four of the real duties, word for word.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slides 38–40.</p>
<h3>Q39 — the fairest disk algorithm</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q39.png" alt="Original question 39" loading="lazy" /></p></details>
<p><em>In disk scheduling, which algorithm is considered the fairest but may lead to high seek times?</em><br>A. FCFS · B. SSTF · C. SCAN · D. C-SCAN</p>
<p class="dap-an">✅ <strong>A.</strong> First-come first-served serves requests in arrival order: nobody waits longer than their turn, but the arm zig-zags across the disk (the book's example: 111 cylinders against 61 for SSF).</p>
<ul><li>B — the shortest seek is efficient but unfair: requests at the edges can starve. C, D — good compromises, but they still reorder requests.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 31.</p>`,
    `<h2>Chương 5 — Vào/ra (8 câu)</h2>
<h3>Câu 28 — tầng gần phần cứng nhất</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q28.png" alt="Ảnh đề gốc câu 28" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which layer of the I/O software system is closest to the hardware?</em><br>A. Interrupt handlers · B. Device drivers · C. Device-independent operating system software · D. User-level I/O software</p>
<p>🇻🇳 Tầng nào của phần mềm I/O nằm gần phần cứng nhất? A. Trình xử lý ngắt · B. Driver thiết bị · C. Phần mềm HĐH độc lập thiết bị · D. Phần mềm I/O mức người dùng.</p>
<p>📚 <strong>interrupt handler</strong> = trình xử lý ngắt · <strong>device-independent</strong> = độc lập thiết bị · <strong>layer</strong> = tầng.</p>
<p class="dap-an">✅ <strong>A.</strong> Hình 5-11, từ dưới lên: phần cứng → <strong>trình xử lý ngắt</strong> → driver → phần mềm HĐH độc lập thiết bị → phần mềm I/O mức người dùng.</p>
<ul><li>B — thứ hai từ dưới lên. C — thứ ba. D — trên cùng, trong không gian người dùng.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slide 15.</p>
<h3>Câu 29 — C-SCAN khi tới cuối đĩa</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q29.png" alt="Ảnh đề gốc câu 29" loading="lazy" /></p></details>
<p>🇬🇧 <em>In C-SCAN scheduling, what happens when the arm reaches the end?</em><br>A. Stops · B. Jumps back · C. Reverses · D. Skips requests · E. Ignores</p>
<p>🇻🇳 Trong lập lịch C-SCAN, khi cần đọc tới đầu mút thì sao? A. Dừng · B. Nhảy về · C. Quay đầu · D. Bỏ qua yêu cầu · E. Phớt lờ.</p>
<p>📚 <strong>reach the end</strong> = tới đầu mút · <strong>jump back</strong> = nhảy về · <strong>reverse</strong> = quay đầu, đổi chiều.</p>
<p class="dap-an">✅ <strong>B.</strong> C-SCAN (SCAN vòng) luôn phục vụ theo một chiều: tới mút thì quay về đầu kia <em>mà không phục vụ gì dọc đường</em> rồi lại đi lên. Nhờ vậy mọi cylinder có cùng thời gian chờ tối đa.</p>
<ul><li>C — quay đầu và phục vụ trên đường về là SCAN thường, thuật toán thang máy (Hình 5-25). A — còn yêu cầu thì cần không "dừng". D, E — không bỏ gì; yêu cầu nằm sau lưng được phục vụ ở lượt quét kế.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 31–33.</p>
<h3>Câu 30 — hai chế độ bus của DMA</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q30.png" alt="Ảnh đề gốc câu 30" loading="lazy" /></p></details>
<p>🇬🇧 <em>In DMA transfer cycle, what two modes can many buses operate in?</em><br>A. Word-at-a-time mode and byte mode. · B. Word-at-a-time mode and block mode. · C. Word-at-a-time mode and bit mode. · D. Word-at-a-time mode and page mode.</p>
<p>🇻🇳 Trong chu kỳ truyền DMA, nhiều bus có thể chạy ở hai chế độ nào? A. Từng từ và từng byte · B. Từng từ và theo khối · C. Từng từ và từng bit · D. Từng từ và theo trang.</p>
<p>📚 <strong>word-at-a-time</strong> = mỗi lần một từ · <strong>block mode</strong> = chế độ khối · <strong>cycle stealing</strong> = lấy trộm chu kỳ · <strong>burst mode</strong> = chế độ loạt.</p>
<p class="dap-an">✅ <strong>B.</strong> Từng từ: bộ điều khiển DMA "lấy trộm" một chu kỳ bus cho mỗi từ (cycle stealing). Chế độ khối: nó chiếm bus, truyền cả một loạt rồi mới nhả (burst mode).</p>
<ul><li>A, C, D — byte, bit và trang không phải chế độ bus trong sách.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slide 6.</p>
<h3>Câu 31 — ba cách làm I/O (chọn ba)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q31.png" alt="Ảnh đề gốc câu 31" loading="lazy" /></p></details>
<p>🇬🇧 <em>Choose correct answers. What are the three basic different ways that IO operations in computer system can be performed?</em><br>A. Programmed I/O · B. Memory-mapped I/O · C. Interrupt-driven I/O · D. I/O using DMA</p>
<p>🇻🇳 Chọn các đáp án đúng. Ba cách cơ bản để thực hiện I/O trong máy tính là gì? A. I/O lập trình · B. I/O ánh xạ bộ nhớ · C. I/O hướng ngắt · D. I/O dùng DMA.</p>
<p>📚 <strong>programmed I/O</strong> = I/O lập trình (CPU tự hỏi vòng) · <strong>interrupt-driven</strong> = hướng ngắt · <strong>memory-mapped I/O</strong> = I/O ánh xạ bộ nhớ.</p>
<p class="dap-an">✅ <strong>A, C và D</strong> — tích đủ ba ô. Mục 5.2.2–5.2.4: I/O lập trình (CPU hỏi vòng), I/O hướng ngắt (thiết bị ngắt sau mỗi ký tự), I/O dùng DMA (bộ điều khiển DMA hỏi vòng thay CPU, mỗi khối một ngắt).</p>
<ul><li>B — I/O ánh xạ bộ nhớ là cách <em>định địa chỉ</em> thanh ghi thiết bị (như ô nhớ thay cho cổng I/O, mục 5.1.3); cách nào trong ba cách trên cũng dùng được nó.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slide 11–14; I/O ánh xạ bộ nhớ ở slide 4–5.</p>
<h3>Câu 32 — driver thiết bị (= câu 32 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q32.png" alt="Ảnh đề gốc câu 32" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which I/O software layer is primarily responsible for handling device-specific details while maintaining a uniform interface for the upper layers?</em><br>A. User-space I/O libraries · B. Device drivers · C. Interrupt handlers · D. Hardware controllers</p>
<p>🇻🇳 Tầng phần mềm I/O nào lo các chi tiết riêng của từng thiết bị mà vẫn giữ giao diện thống nhất cho các tầng trên? A. Thư viện I/O ở user space · B. Driver thiết bị · C. Trình xử lý ngắt · D. Bộ điều khiển phần cứng.</p>
<p>📚 <strong>device-specific</strong> = riêng của thiết bị · <strong>uniform interface</strong> = giao diện thống nhất · <strong>controller</strong> = bộ điều khiển.</p>
<p class="dap-an">✅ <strong>B.</strong> Mã riêng của từng thiết bị nằm trong driver; phía trên, tầng độc lập thiết bị thấy cùng một giao diện với mọi driver cùng loại. Giống câu 32 FE1.</p>
<ul><li>A — ở trên, độc lập thiết bị. C — xử lý ngắt rồi đánh thức driver. D — là phần cứng, không phải tầng phần mềm.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-1">5.A</a>, slide 15, 18–20.</p>
<h3>Câu 33 — điểm yếu của RAID 0</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q33.png" alt="Ảnh đề gốc câu 33" loading="lazy" /></p></details>
<p>🇬🇧 <em>What are the weaknesses of RAID 0?</em><br>A. Requires the highest number of disks in RAID modes · B. There is no data recovery mechanism · C. The unit of data transmitted is at the BIT level · D. Does not improve read and write speeds</p>
<p>🇻🇳 Điểm yếu của RAID 0 là gì? A. Cần nhiều ổ nhất trong các mức RAID · B. Không có cơ chế khôi phục dữ liệu · C. Đơn vị truyền là mức BIT · D. Không làm đọc ghi nhanh hơn.</p>
<p>📚 <strong>striping</strong> = chia sọc (rải dữ liệu lên nhiều ổ) · <strong>parity</strong> = chẵn lẻ (dữ liệu dư để khôi phục) · <strong>data recovery</strong> = khôi phục dữ liệu.</p>
<p class="dap-an">✅ <strong>B.</strong> RAID 0 chỉ chia sọc; không có bản sao, không có chẵn lẻ, nên hỏng một ổ là mất dữ liệu — và với N ổ thì khả năng hỏng gấp N lần một ổ. Nó hoàn toàn không có dư thừa — thiếu đúng chữ R (redundant) của RAID.</p>
<ul><li>A — hai ổ là đủ. C — mức bit là RAID 2 (mức byte là RAID 3); RAID 0 chia theo khối. D — sai: yêu cầu lớn được nhiều ổ phục vụ song song (chỉ yêu cầu từng sector mới không được lợi — câu 34 FE2).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 26–27.</p>
<h3>Câu 34 — KHÔNG phải nhiệm vụ của phần mềm đồng hồ</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q34.png" alt="Ảnh đề gốc câu 34" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which of the following is NOT one of the usual duties of Clock Software?</em><br>A. Maintaining the time of day. · B. Helping processes in running longer than they are allowed to. · C. Accounting for CPU usage. · D. Handling the alarm system call made by user processes. · E. Doing profiling, monitoring, and statistics gathering.</p>
<p>🇻🇳 Đâu KHÔNG phải nhiệm vụ thường lệ của phần mềm đồng hồ? A. Giữ giờ trong ngày · B. Giúp tiến trình chạy lâu hơn mức cho phép · C. Tính lượng CPU đã dùng · D. Xử lý lời gọi alarm của tiến trình · E. Đo đạc, giám sát, thống kê.</p>
<p>📚 <strong>duty</strong> = nhiệm vụ · <strong>accounting</strong> = tính toán mức dùng · <strong>profiling</strong> = đo đạc hiệu năng · <strong>alarm</strong> = lời gọi đặt hẹn giờ.</p>
<p class="dap-an">✅ <strong>B.</strong> Danh sách nhiệm vụ của sách: giữ giờ trong ngày, <em>ngăn</em> tiến trình chạy lâu hơn mức cho phép, tính CPU đã dùng, lời gọi <code>alarm</code>, đồng hồ canh (watchdog), đo đạc và thống kê. B lật ngược một nhiệm vụ.</p>
<ul><li>A, C, D, E — bốn nhiệm vụ thật, đúng chữ.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 38–40.</p>
<h3>Câu 39 — thuật toán đĩa công bằng nhất</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q39.png" alt="Ảnh đề gốc câu 39" loading="lazy" /></p></details>
<p>🇬🇧 <em>In disk scheduling, which algorithm is considered the fairest but may lead to high seek times?</em><br>A. FCFS · B. SSTF · C. SCAN · D. C-SCAN</p>
<p>🇻🇳 Trong lập lịch đĩa, thuật toán nào được xem là công bằng nhất nhưng có thể khiến thời gian tìm lớn?</p>
<p>📚 <strong>fairest</strong> = công bằng nhất · <strong>seek time</strong> = thời gian tìm · <strong>SSTF</strong> = dịch ngắn nhất trước.</p>
<p class="dap-an">✅ <strong>A.</strong> Đến trước phục vụ trước theo thứ tự tới: không ai phải chờ quá lượt mình, nhưng cần đọc chạy ngoằn ngoèo khắp đĩa (ví dụ của sách: 111 cylinder so với 61 của SSF).</p>
<ul><li>B — dịch ngắn nhất hiệu quả nhưng bất công: yêu cầu ở rìa có thể bị bỏ đói. C, D — thoả hiệp tốt, nhưng vẫn sắp xếp lại yêu cầu.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg5-2">5.B</a>, slide 31.</p>`),
    bi(`<h2>Chapter 6 — Deadlocks (7 questions)</h2>
<h3>Q35 — all resources at once</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q35.png" alt="Original question 35" loading="lazy" /></p></details>
<p><em>Which strategy prevents deadlock by requiring all resources at once?</em><br>A. Resource ordering · B. Wait-die · C. Wound-wait · D. One-shot allocation · E. Preemption</p>
<p class="dap-an">✅ <strong>D.</strong> Ask for everything before starting, get all or nothing: nobody holds one resource while waiting for another, so hold and wait cannot happen. The price: resources sit idle, and the process must know its needs in advance.</p>
<ul><li>A — attacks circular wait. B, C — timestamp schemes (older/younger transaction waits or is rolled back), used in databases. E — attacks no preemption.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 26.</p>
<h3>Q36 — is it safe? (computed, FE1's banker data)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q36.png" alt="Original question 36" loading="lazy" /></p></details>
<p><em>System with 5 processes, 3 resources. Available [3,3,2], Allocation [[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]], Max [[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]]. Is safe?</em><br>A. Yes · B. No · C. Only if P1 first · D. Only if P3 first · E. Insufficient data</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/66840610e950902d344d2d91da46351e01bbbe57.svg" alt="Need = Max − Allocation, then the banker's loop — and a count of every safe order" loading="lazy" /><p class="chu-thich">🧮 Need = Max − Allocation, then the banker's loop — and a count of every safe order</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>A — yes.</strong> Need = Max − Allocation; P1's need (1 2 2) fits (3 3 2) ⇒ work (5 3 2); then P3, P4, P0, P2 all fit in turn. These are exactly the numbers of FE1 Q48 (Silberschatz's classic example), asked the other way. Bank key A.</p>
<ul><li>B — the loop finishes everybody. C, D — "only if" is false: safe sequences can start with P1 <em>or</em> with P3 (P3's need (0 1 1) also fits at the start); the simulation finds 16 safe orders. E — Available is given, nothing is missing (in FE1 Q48 it had to be computed from the totals).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 24–25.</p>
<h3>Q37 — a preemptable resource (= FE1 Q37)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q37.png" alt="Original question 37" loading="lazy" /></p></details>
<p><em>What is a preemtable resource?</em><br>A. The one that can be taken away from the process owning it with no ill effects · B. The one that can be taken away from the process owning it with ill effects · C. The one that can not be taken away from the process owning it with no ill effects · D. The one that can not be taken away from the process owning it with ill effects</p>
<p class="dap-an">✅ <strong>A.</strong> "Preemtable" is a typo for preemptable. The book's example: memory can be taken away (swapped out) and given back with no harm; a Blu-ray recorder in the middle of a burn cannot. Same as FE1 Q37.</p>
<ul><li>B — "with ill effects" describes a nonpreemptable one. C, D — "cannot be taken away" is the definition of nonpreemptable.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 2.</p>
<h3>Q38 — "necessary and sufficient" (true only for single resources)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q38.png" alt="Original question 38" loading="lazy" /></p></details>
<p><em>Which condition is both necessary and sufficient for a system to experience deadlock?</em><br>A. Mutual exclusion of resources · B. Circular wait among processes · C. Hold and wait for resources · D. No resource preemption</p>
<p class="dap-an">✅ <strong>B</strong> (bank key). All four Coffman conditions are necessary; A, C and D are each far from sufficient — they hold in almost every running system. A cycle of processes each waiting for the next is the one that, when every resource type has <strong>one instance</strong>, <em>is</em> a deadlock (§6.4.1: a cycle in the resource graph ⇔ deadlock).</p>
<div class="callout"><p><strong>The fine print.</strong> With several instances per type a cycle is necessary but not sufficient — another process outside the cycle may release an instance and break it (that is why §6.4.2 needs the matrix algorithm). Choose B.</p></div>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 6, 12–13.</p>
<h3>Q47 — recovery with the least performance impact</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q47.png" alt="Original question 47" loading="lazy" /></p></details>
<p><em>Which deadlock recovery technique is least likely to impact system performance but may lead to potential inconsistencies?</em><br>A. Killing one or more processes involved in the deadlock · B. Preempting resources from deadlocked processes · C. Increasing system resources dynamically · D. Restarting the entire system</p>
<p class="dap-an">✅ <strong>B.</strong> Taking a resource away from one process and giving it to another loses no finished work — but the victim was in the middle of using it, so what it had produced (half a printout, half-updated data) may be inconsistent.</p>
<ul><li>A — killing throws away all the victim's work, and is the bluntest tool. C — not a recovery technique of the book. D — the largest impact of all.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 19.</p>
<h3>Q48 — 10 units, nothing free (computed)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q48.png" alt="Original question 48" loading="lazy" /></p></details>
<p><em>A system has 10 units of a single resource. There are three processes: P1, P2, and P3. At a certain moment, their maximum needed and allocated units are: P1 Max=6 Allocated=3; P2 Max=5 Allocated=4; P3 Max=7 Allocated=3. What is the state of the system?</em><br>A. Unsafe. · B. Safe. · C. The system is in a deadlock. · D. The system experiences starvation.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6fbdc23dc6f3eb65c3b7a82ffb07f7e5201ef6b3.svg" alt="Free = 10 − 10 = 0: nobody's remaining need fits" loading="lazy" /><p class="chu-thich">🧮 Free = 10 − 10 = 0: nobody's remaining need fits</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>A — unsafe.</strong> Free = 10 − (3 + 4 + 3) = 0. Remaining needs 3, 1, 4 — none fits in 0, so no order can be guaranteed to finish. Bank key A.</p>
<ul><li>B — safe needs at least one order that finishes everybody. C — the trap: unsafe is not deadlocked; nobody has asked for more yet and nobody is blocked. D — starvation is about scheduling over time.</li></ul>
<p class="pitfall">⚠️ Compare with FE2 Q48: same picture, 15 blocks and 5 free ⇒ safe. Always compute Free first — here the question does not even print it.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 21–22.</p>
<h3>Q49 — attacking circular wait (= FE1 Q49)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q49.png" alt="Original question 49" loading="lazy" /></p></details>
<p><em>Which approach to deadlock prevention eliminates circular wait?</em><br>A. Forcing all processes to request resources in a predefined order · B. Allowing processes to hold and wait for resources indefinitely · C. Preventing mutual exclusion for critical resources · D. Granting all resources to a process before execution begins</p>
<p class="dap-an">✅ <strong>A.</strong> Number the resources and request them only in increasing order: a cycle would need someone to wait for a lower number — impossible. Same as FE1 Q49.</p>
<ul><li>B — that <em>creates</em> hold and wait. C — attacks mutual exclusion. D — attacks hold and wait (it is Q35's one-shot allocation).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slides 26–28.</p>`,
    `<h2>Chương 6 — Bế tắc (7 câu)</h2>
<h3>Câu 35 — xin mọi tài nguyên một lần</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q35.png" alt="Ảnh đề gốc câu 35" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which strategy prevents deadlock by requiring all resources at once?</em><br>A. Resource ordering · B. Wait-die · C. Wound-wait · D. One-shot allocation · E. Preemption</p>
<p>🇻🇳 Chiến lược nào ngăn bế tắc bằng cách bắt xin mọi tài nguyên một lần? A. Sắp thứ tự tài nguyên · B. Wait-die · C. Wound-wait · D. Cấp phát một lần · E. Trưng dụng.</p>
<p>📚 <strong>one-shot allocation</strong> = cấp phát một lần (xin trọn gói) · <strong>wait-die / wound-wait</strong> = hai lược đồ theo nhãn thời gian (chờ-chết / thương-chờ).</p>
<p class="dap-an">✅ <strong>D.</strong> Xin tất cả trước khi chạy, được hết hoặc không được gì: không ai vừa giữ một tài nguyên vừa chờ cái khác, nên giữ và chờ không xảy ra. Cái giá: tài nguyên nằm không, và tiến trình phải biết trước nhu cầu.</p>
<ul><li>A — tấn công chờ vòng tròn. B, C — lược đồ theo nhãn thời gian (giao dịch già/trẻ phải chờ hay bị huỷ), dùng trong cơ sở dữ liệu. E — tấn công không trưng dụng.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 26.</p>
<h3>Câu 36 — có an toàn không? (câu tính, dữ liệu nhà băng của FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q36.png" alt="Ảnh đề gốc câu 36" loading="lazy" /></p></details>
<p>🇬🇧 <em>System with 5 processes, 3 resources. Available [3,3,2], Allocation [[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]], Max [[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]]. Is safe?</em><br>A. Yes · B. No · C. Only if P1 first · D. Only if P3 first · E. Insufficient data</p>
<p>🇻🇳 Hệ thống 5 tiến trình, 3 loại tài nguyên, cho Available, Allocation, Max như trên. Có an toàn không? A. Có · B. Không · C. Chỉ khi P1 chạy trước · D. Chỉ khi P3 chạy trước · E. Thiếu dữ liệu.</p>
<p>📚 <strong>Need = Max − Allocation</strong> = phần còn cần · <strong>safe sequence</strong> = chuỗi an toàn · <strong>insufficient data</strong> = thiếu dữ liệu.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/60d1e2b340b3e634a74063328c7929e49b4c50e7.svg" alt="Need = Max − Allocation, rồi vòng lặp nhà băng — và đếm mọi thứ tự an toàn" loading="lazy" /><p class="chu-thich">🧮 Need = Max − Allocation, rồi vòng lặp nhà băng — và đếm mọi thứ tự an toàn</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>A — có.</strong> Need = Max − Allocation; need (1 2 2) của P1 vừa (3 3 2) ⇒ work (5 3 2); rồi P3, P4, P0, P2 lần lượt đều vừa. Đây đúng là bộ số của câu 48 FE1 (ví dụ kinh điển của Silberschatz), hỏi theo chiều khác. Khoá ngân hàng A.</p>
<ul><li>B — vòng lặp cho mọi tiến trình chạy xong. C, D — "chỉ khi" là sai: chuỗi an toàn có thể bắt đầu bằng P1 <em>hoặc</em> P3 (need (0 1 1) của P3 cũng vừa ngay từ đầu); mô phỏng đếm được 16 thứ tự an toàn. E — đề cho sẵn Available, chẳng thiếu gì (ở câu 48 FE1 mới phải tự tính từ tổng).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 24–25.</p>
<h3>Câu 37 — tài nguyên trưng dụng được (= câu 37 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q37.png" alt="Ảnh đề gốc câu 37" loading="lazy" /></p></details>
<p>🇬🇧 <em>What is a preemtable resource?</em><br>A. The one that can be taken away from the process owning it with no ill effects · B. The one that can be taken away from the process owning it with ill effects · C. The one that can not be taken away from the process owning it with no ill effects · D. The one that can not be taken away from the process owning it with ill effects</p>
<p>🇻🇳 Tài nguyên trưng dụng được (preemptable) là gì? A. Lấy lại được từ tiến trình đang giữ mà không gây hại · B. Lấy lại được nhưng gây hại · C. Không lấy lại được, không gây hại · D. Không lấy lại được, gây hại.</p>
<p>📚 <strong>preemptable</strong> = trưng dụng được (đề gõ thiếu chữ p) · <strong>ill effects</strong> = tác hại · <strong>take away</strong> = lấy lại.</p>
<p class="dap-an">✅ <strong>A.</strong> "Preemtable" là lỗi gõ của preemptable. Ví dụ của sách: bộ nhớ có thể bị lấy lại (đẩy ra đĩa) rồi trả lại mà không hại gì; ổ ghi Blu-ray đang ghi dở thì không. Giống câu 37 FE1.</p>
<ul><li>B — "gây hại" là tả tài nguyên không trưng dụng được. C, D — "không lấy lại được" là định nghĩa của không trưng dụng được.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 2.</p>
<h3>Câu 38 — "cần và đủ" (chỉ đúng với tài nguyên một thể hiện)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q38.png" alt="Ảnh đề gốc câu 38" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which condition is both necessary and sufficient for a system to experience deadlock?</em><br>A. Mutual exclusion of resources · B. Circular wait among processes · C. Hold and wait for resources · D. No resource preemption</p>
<p>🇻🇳 Điều kiện nào vừa cần vừa đủ để hệ thống bị bế tắc? A. Loại trừ lẫn nhau · B. Chờ vòng tròn giữa các tiến trình · C. Giữ và chờ · D. Không trưng dụng.</p>
<p>📚 <strong>necessary and sufficient</strong> = cần và đủ · <strong>instance</strong> = thể hiện (một đơn vị của một loại tài nguyên).</p>
<p class="dap-an">✅ <strong>B</strong> (khoá ngân hàng). Cả bốn điều kiện Coffman đều cần; A, C, D mỗi cái còn xa mới đủ — chúng đúng ở gần như mọi hệ thống đang chạy. Một vòng tiến trình, người này chờ người kia, là điều kiện mà khi mỗi loại tài nguyên có <strong>một thể hiện</strong> thì nó <em>chính là</em> bế tắc (mục 6.4.1: đồ thị tài nguyên có chu trình ⇔ bế tắc).</p>
<div class="callout"><p><strong>Chữ nhỏ.</strong> Khi mỗi loại có nhiều thể hiện, chu trình là điều kiện cần chứ chưa đủ — một tiến trình ngoài vòng có thể trả một thể hiện và phá vòng (vì vậy mục 6.4.2 phải dùng thuật toán ma trận). Chọn B.</p></div>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 6, 12–13.</p>
<h3>Câu 47 — khôi phục ít ảnh hưởng hiệu năng nhất</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q47.png" alt="Ảnh đề gốc câu 47" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which deadlock recovery technique is least likely to impact system performance but may lead to potential inconsistencies?</em><br>A. Killing one or more processes involved in the deadlock · B. Preempting resources from deadlocked processes · C. Increasing system resources dynamically · D. Restarting the entire system</p>
<p>🇻🇳 Kỹ thuật khôi phục bế tắc nào ít ảnh hưởng hiệu năng nhất nhưng có thể gây mất nhất quán? A. Giết một hay nhiều tiến trình trong vòng bế tắc · B. Trưng dụng tài nguyên của tiến trình bế tắc · C. Tăng tài nguyên hệ thống lúc chạy · D. Khởi động lại cả hệ thống.</p>
<p>📚 <strong>recovery</strong> = khôi phục · <strong>inconsistency</strong> = sự mất nhất quán · <strong>preempt</strong> = trưng dụng, giành lại.</p>
<p class="dap-an">✅ <strong>B.</strong> Lấy tài nguyên của một tiến trình đưa cho tiến trình khác thì không mất phần việc đã xong — nhưng nạn nhân đang dùng dở, nên thứ nó làm ra (nửa bản in, dữ liệu cập nhật dở) có thể mất nhất quán.</p>
<ul><li>A — giết là vứt hết việc của nạn nhân, công cụ thô nhất. C — không phải kỹ thuật khôi phục của sách. D — ảnh hưởng lớn nhất.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 19.</p>
<h3>Câu 48 — 10 đơn vị, không còn gì trống (câu tính)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q48.png" alt="Ảnh đề gốc câu 48" loading="lazy" /></p></details>
<p>🇬🇧 <em>A system has 10 units of a single resource. There are three processes: P1, P2, and P3. At a certain moment, their maximum needed and allocated units are: P1 Max=6 Allocated=3; P2 Max=5 Allocated=4; P3 Max=7 Allocated=3. What is the state of the system?</em><br>A. Unsafe. · B. Safe. · C. The system is in a deadlock. · D. The system experiences starvation.</p>
<p>🇻🇳 Hệ thống có 10 đơn vị của một loại tài nguyên, ba tiến trình với mức tối đa và số đã cấp như trên. Hệ thống đang ở trạng thái nào? A. Không an toàn · B. An toàn · C. Bế tắc · D. Bỏ đói.</p>
<p>📚 <strong>single resource</strong> = một loại tài nguyên · <strong>unsafe</strong> = không an toàn · <strong>units</strong> = đơn vị.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d531e5688e640ad500c86fd4e6da443dba14e08d.svg" alt="Trống = 10 − 10 = 0: phần còn cần của không ai vừa" loading="lazy" /><p class="chu-thich">🧮 Trống = 10 − 10 = 0: phần còn cần của không ai vừa</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">// p9: n = số chương trình VỪA RAM còn lại; hiệu suất CPU = 1 − pⁿ (MOS 4e §2.1.7)
const RAM9 = 8, HDH9 = 2, CT9 = 3, P9 = 0.6;
const N9 = Math.floor((RAM9 - HDH9) / CT9);
const cpu = (n) =&gt; 1 - P9 ** n;
// p13: phần thừa ở trang cuối (phân mảnh trong), trung bình trên mọi cỡ chương trình 10 000 … 29 999 byte
const CO_TRANG13 = [512, 1024, 2048, 4096, 8192];
const thuaTB = (c) =&gt; { let s = 0; for (let n = 10000; n &lt; 30000; n++) s += Math.ceil(n / c) * c - n; return s / 20000; };
// p16: hai trường bảng trang, phần còn lại là offset
const BIT16 = 32, PT1 = 10, PT2 = 12;
const OFFSET16 = BIT16 - PT1 - PT2;
// p17: FIFO 4 khung
const REF17 = [0, 1, 7, 2, 3, 2, 7, 1, 0, 3];
// p23: lỗ theo thứ tự địa chỉ, các yêu cầu lần lượt (MB)
const LO23 = [10, 18, 9, 14], XIN23 = [11, 2, 9, 8];
const PA23 = ['14, 3, 10, 9', '18, 7, 10, 9', '14, 3, 9, 10', '18, 7, 9, 10'];
// p26: cỡ phân vùng tối đa = 2^(số bit địa chỉ khối của FAT) × cỡ khối; FAT-32 chỉ dùng 28 bit và còn bị chặn ở 2 TB vì bảng
//      phân vùng MBR ghi số sector 32 bit (2^32 × 512 B). Ô bị cấm (để trống trên Hình 4-31, MOS 4e §4.5.1) ⇒ null.
const KB = 1024, MB = KB * KB;
const BIT_FAT = { 'FAT-12': 12, 'FAT-16': 16, 'FAT-32': 28 };
const CHO_PHEP = { 'FAT-12': [0.5, 1, 2, 4], 'FAT-16': [2, 4, 8, 16, 32], 'FAT-32': [4, 8, 16, 32] };
const TRAN_MBR = 2 ** 32 * 512;
const KHOI26 = [1, 2, 4, 8, 16];                                // KB
const congThuc = (loai, khoiKB) =&gt; 2 ** BIT_FAT[loai] * khoiKB * KB;
const phanVung = (loai, khoiKB) =&gt; (CHO_PHEP[loai].includes(khoiKB) ? Math.min(congThuc(loai, khoiKB), TRAN_MBR) : null);
// p36: nhà băng nhiều loại — Need = Max − Allocation
const A36 = [3, 3, 2];
const G36 = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], M36 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const N36 = canThemTu(M36, G36);
function hoanVi(a) { return a.length &lt;= 1 ? [a] : a.flatMap((x, i) =&gt; hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) =&gt; [x, ...r])); }
const moiChuoiAnToan = () =&gt; hoanVi([0, 1, 2, 3, 4]).filter((c) =&gt; kiemChuoi({ conLai: A36, giuLai: G36, canThem: N36, chuoi: c }).dung);
// p48: một loại tài nguyên, 10 đơn vị
const HAS48 = [3, 4, 3], MAX48 = [6, 5, 7], TONG48 = 10;</code></pre></details>
<p class="dap-an">✅ <strong>A — không an toàn.</strong> Trống = 10 − (3 + 4 + 3) = 0. Còn cần 3, 1, 4 — không ai vừa với 0, nên không thứ tự nào chắc chắn chạy xong. Khoá ngân hàng A.</p>
<ul><li>B — an toàn cần ít nhất một thứ tự cho mọi người chạy xong. C — bẫy: không an toàn không phải bế tắc; chưa ai xin thêm, chưa ai bị chặn. D — bỏ đói là chuyện lập lịch theo thời gian.</li></ul>
<p class="pitfall">⚠️ So với câu 48 FE2: cùng kiểu hình, 15 khối và trống 5 ⇒ an toàn. Luôn tính số trống trước — ở đây đề còn không in nó ra.</p>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 21–22.</p>
<h3>Câu 49 — tấn công chờ vòng tròn (= câu 49 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q49.png" alt="Ảnh đề gốc câu 49" loading="lazy" /></p></details>
<p>🇬🇧 <em>Which approach to deadlock prevention eliminates circular wait?</em><br>A. Forcing all processes to request resources in a predefined order · B. Allowing processes to hold and wait for resources indefinitely · C. Preventing mutual exclusion for critical resources · D. Granting all resources to a process before execution begins</p>
<p>🇻🇳 Cách ngăn bế tắc nào loại bỏ chờ vòng tròn? A. Buộc mọi tiến trình xin tài nguyên theo thứ tự định trước · B. Cho tiến trình giữ và chờ vô hạn · C. Bỏ loại trừ lẫn nhau với tài nguyên găng · D. Cấp mọi tài nguyên trước khi chạy.</p>
<p>📚 <strong>predefined order</strong> = thứ tự định trước · <strong>eliminate</strong> = loại bỏ.</p>
<p class="dap-an">✅ <strong>A.</strong> Đánh số tài nguyên và chỉ xin theo thứ tự tăng: muốn có vòng thì phải có người chờ một số nhỏ hơn — không thể. Giống câu 49 FE1.</p>
<ul><li>B — đó là <em>tạo ra</em> giữ và chờ. C — tấn công loại trừ lẫn nhau. D — tấn công giữ và chờ (chính là cấp phát một lần của câu 35).</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg6-1">6.A</a>, slide 26–28.</p>`),
    bi(`<h2>Chapter 7 — Virtualization (2 questions)</h2>
<h3>Q40 — another name for the VMM (= FE1 Q40)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q40.png" alt="Original question 40" loading="lazy" /></p></details>
<p><em>A VMM (Virtual Machine Monitor) creates the illusion of multiple (virtual) machines on the same physical hardware. What is VMM also known as?</em><br>A. Hypovisor · B. hypervisor · C. shell · D. console</p>
<p class="dap-an">✅ <strong>B.</strong> VMM = hypervisor. Type 1 runs on the bare hardware, type 2 on a host OS. Same as FE1 Q40.</p>
<ul><li>A — a misspelling used as a distractor; it does not exist. C — the command interpreter. D — a terminal.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg7-1">N1.A</a>, slides 2–4.</p>
<h3>Q41 — hypercalls (= FE1 Q41)</h3>
<details><summary>🖼 Original question image</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q41.png" alt="Original question 41" loading="lazy" /></p></details>
<p><em>Paravirtualization takes a different approach by modifying the source code of the guest operating system instead rather than performing sensitive instructions. In this context, which of the following is true?</em><br>A. the paravirtualized guest executes system calls · B. the paravirtualized guest executes virtual calls · C. the paravirtualized guest executes hyper calls · D. the paravirtualized guest executes Hyper commands</p>
<p class="dap-an">✅ <strong>C.</strong> The modified guest kernel replaces each sensitive instruction with a <strong>hypercall</strong> — a call into the hypervisor, the way an application makes a system call into a kernel. Same as FE1 Q41.</p>
<ul><li>A — system calls go from the guest's programs to the guest kernel. B, D — not real terms.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg7-1">N1.A</a>, slides 5–6.</p>
<h2>📌 The traps of this paper</h2>
<ul>
<li><strong>Fifteen questions are FE1's.</strong> Q5, 6, 7, 17, 18, 25, 32, 37, 40, 41, 44, 46, 49, 50 word for word, and Q36 reuses FE1 Q48's numbers — do FE1 first.</li>
<li><strong>Q9: count the programs first.</strong> n = (8 − 2) / 3 = 2, then 1 − 0.6² = 64%; 60% is just p.</li>
<li><strong>Q16: do not answer 4 KB by habit.</strong> 32 − 10 − 12 = 10 bits ⇒ 1 KB.</li>
<li><strong>Q17: "0172327103" is ten references</strong>, and the four loads into empty frames are faults.</li>
<li><strong>Q23: holes are split.</strong> "3MB" in the options tells you; 9 MB takes the exact 9 MB hole, 8 MB the 10 MB one.</li>
<li><strong>Q26: options double the block size</strong> — 2^16 × 4 KB = 256 MB; and FAT-32 is 28 bits, capped at 2 TB.</li>
<li><strong>Q31: three boxes.</strong> Memory-mapped I/O is an addressing scheme, not a way to perform I/O.</li>
<li><strong>Q34, Q46: NOT.</strong> Each has one wrong statement among true ones — and in Q34 it is a real duty turned upside down.</li>
<li><strong>Q36: "only if" is a trap.</strong> Safe sequences can start with P1 or P3.</li>
<li><strong>Q48: unsafe ≠ deadlock</strong>, and Free (0) is not printed — compute it.</li>
<li><strong>Q1, Q10, Q14, Q20, Q38: unstable keys.</strong> System mode exists in Silberschatz; "thinking or hungry" = "not eating"; paging also has fixed-size frames; SJF also starves; circular wait is sufficient only with single instances — choose the key given above for each.</li>
<li><strong>Q29: C-SCAN jumps back, SCAN reverses.</strong></li>
</ul>`,
    `<h2>Chương 7 — Ảo hoá (2 câu)</h2>
<h3>Câu 40 — tên khác của VMM (= câu 40 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q40.png" alt="Ảnh đề gốc câu 40" loading="lazy" /></p></details>
<p>🇬🇧 <em>A VMM (Virtual Machine Monitor) creates the illusion of multiple (virtual) machines on the same physical hardware. What is VMM also known as?</em><br>A. Hypovisor · B. hypervisor · C. shell · D. console</p>
<p>🇻🇳 VMM (trình giám sát máy ảo) tạo ảo giác có nhiều máy (ảo) trên cùng phần cứng vật lý. VMM còn gọi là gì?</p>
<p>📚 <strong>illusion</strong> = ảo giác · <strong>hypervisor</strong> = trình ảo hoá · <strong>also known as</strong> = còn gọi là.</p>
<p class="dap-an">✅ <strong>B.</strong> VMM = hypervisor. Loại 1 chạy thẳng trên phần cứng, loại 2 chạy trên một HĐH chủ. Giống câu 40 FE1.</p>
<ul><li>A — lỗi chính tả dùng làm phương án nhiễu, không tồn tại. C — trình thông dịch lệnh. D — thiết bị đầu cuối.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg7-1">N1.A</a>, slide 2–4.</p>
<h3>Câu 41 — hypercall (= câu 41 FE1)</h3>
<details><summary>🖼 Ảnh đề gốc</summary><p><img src="https://media.cuongthai.com/images/exam-questions/OSG202/D3/q41.png" alt="Ảnh đề gốc câu 41" loading="lazy" /></p></details>
<p>🇬🇧 <em>Paravirtualization takes a different approach by modifying the source code of the guest operating system instead rather than performing sensitive instructions. In this context, which of the following is true?</em><br>A. the paravirtualized guest executes system calls · B. the paravirtualized guest executes virtual calls · C. the paravirtualized guest executes hyper calls · D. the paravirtualized guest executes Hyper commands</p>
<p>🇻🇳 Ảo hoá song song (paravirtualization) đi hướng khác: sửa mã nguồn HĐH khách thay vì để nó chạy lệnh nhạy cảm. Trong bối cảnh đó, phát biểu nào đúng?</p>
<p>📚 <strong>paravirtualization</strong> = ảo hoá song song (HĐH khách được sửa để "biết" mình chạy trên hypervisor) · <strong>sensitive instruction</strong> = lệnh nhạy cảm · <strong>guest</strong> = khách.</p>
<p class="dap-an">✅ <strong>C.</strong> Nhân khách đã sửa thay mỗi lệnh nhạy cảm bằng một <strong>hypercall</strong> — lời gọi vào hypervisor, giống như ứng dụng gọi system call vào nhân. Giống câu 41 FE1.</p>
<ul><li>A — system call đi từ chương trình của khách vào nhân khách. B, D — không phải thuật ngữ có thật.</li></ul>
<p>📖 <a href="/courses/operating-systems/learn?lessonSlug=osg202-slide-osg7-1">N1.A</a>, slide 5–6.</p>
<h2>📌 Các bẫy của đề này</h2>
<ul>
<li><strong>Mười lăm câu là của FE1.</strong> Câu 5, 6, 7, 17, 18, 25, 32, 37, 40, 41, 44, 46, 49, 50 giống hệt, và câu 36 dùng lại bộ số của câu 48 FE1 — làm FE1 trước.</li>
<li><strong>Câu 9: đếm số chương trình trước.</strong> n = (8 − 2) / 3 = 2, rồi 1 − 0,6² = 64%; 60% chỉ là p.</li>
<li><strong>Câu 16: đừng trả lời 4 KB theo thói quen.</strong> 32 − 10 − 12 = 10 bit ⇒ 1 KB.</li>
<li><strong>Câu 17: "0172327103" là mười tham chiếu</strong>, và bốn lần nạp vào khung trống vẫn là lỗi trang.</li>
<li><strong>Câu 23: lỗ được tách.</strong> Chữ "3MB" trong phương án báo điều đó; 9 MB lấy lỗ 9 MB khít, 8 MB lấy lỗ 10 MB.</li>
<li><strong>Câu 26: các phương án gấp đôi cỡ khối</strong> — 2^16 × 4 KB = 256 MB; còn FAT-32 là 28 bit, chặn ở 2 TB.</li>
<li><strong>Câu 31: ba ô.</strong> I/O ánh xạ bộ nhớ là cách định địa chỉ, không phải cách thực hiện I/O.</li>
<li><strong>Câu 34, 46: NOT.</strong> Mỗi câu có một phát biểu sai giữa các phát biểu đúng — ở câu 34 nó là một nhiệm vụ thật bị lật ngược.</li>
<li><strong>Câu 36: "only if" là bẫy.</strong> Chuỗi an toàn bắt đầu được bằng P1 hoặc P3.</li>
<li><strong>Câu 48: không an toàn ≠ bế tắc</strong>, và số trống (0) không được in ra — tự tính.</li>
<li><strong>Câu 1, 10, 14, 20, 38: khoá không ổn định.</strong> System mode có trong Silberschatz; "nghĩ hoặc đói" = "không ăn"; phân trang cũng có khung cỡ cố định; SJF cũng bỏ đói; chờ vòng tròn chỉ đủ khi mỗi loại một thể hiện — chọn đúng khoá đã ghi ở từng câu.</li>
<li><strong>Câu 29: C-SCAN nhảy về, SCAN quay đầu.</strong></li>
</ul>`),
  ].join('\n'),
};

export default {
  extrasEnd: [L_x_on_fe_chien_thuat, L_x_chua_fe1, L_x_chua_fe2, L_x_chua_fe3],
};
