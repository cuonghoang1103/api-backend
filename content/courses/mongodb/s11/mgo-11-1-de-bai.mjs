/**
 * 11.1 — Đề dự án cuối khoá và rubric (soạn 25/11/2026, tiếp quản agent mgo; demo chạy trên máy nhà, mgo-lab MongoDB 8.0.38).
 * Output thật: ../_ma.mjs OUT['s11-1-tu-kiem'] (kịch bản scratchpad/mgo/demo/s11/s11-1-tu-kiem.txt). Khối: 0 nạp CT Shop · 1 tự kiểm lần 1 (8 ✘)
 *   · 2–5 sửa theo Chương 1 + 4 · 6 tự kiểm lần 2 (4 ✘) · 7–8 explain không tính vào $indexStats.
 * Tệp đọc nguyên văn lúc nạp module: ../_demo/kiem-du-an.js, ../_demo/truy-van-ctshop.js.
 * KHÔNG lặp lại _du-an.mjs: đề tài + 10 mốc + phòng bảo vệ (rubric 10 điểm, câu hội đồng) nằm ở bài mgo-moc-N và mgo-bao-ve-du-an;
 * bài này là HỒ SƠ NỘP: cấu trúc repo, yêu cầu phi chức năng có số, SO-DO.md, rubric chi tiết 100 điểm quy đổi về rubric bảo vệ.
 * Sự cố thật: FTC 12/04/2018 (Uber 2016: khoá truy cập đăng lên trang chia sẻ mã) — GET kiểm 25/11/2026.
 */
import fs from 'node:fs';
import { lenh, ma, kv, loiGiai, lienKet, nguon } from '../_chung.mjs';

const K = 's11-1-tu-kiem';
const tep = (p) => fs.readFileSync(new URL('../_demo/' + p, import.meta.url), 'utf8').trimEnd();

const CAY = `du-an-mongodb/
├── README.md              ← chạy từ bản clone sạch: docker compose up + 1 lệnh nạp; liệt kê MỌI lệnh
├── THIET-KE.md            ← truy vấn chính → schema (nhúng/tham chiếu, pattern, giới hạn tăng trưởng)
├── SO-DO.md               ← bảng số đo: explain trước/sau, bài thử đồng thời, diễn tập mất primary, khôi phục, đo tải
├── compose.yaml           ← replica set 3 thành viên, cổng chỉ 127.0.0.1, có mem_limit
├── .env.example           ← tên biến, KHÔNG có giá trị thật (.env nằm trong .gitignore)
├── db/
│   ├── 01-validator.js    ← $jsonSchema mọi collection
│   ├── 02-index.js        ← mỗi index một dòng chú thích: phục vụ truy vấn nào
│   ├── 03-nguoi-dung.js   ← tài khoản ứng dụng quyền tối thiểu (mật khẩu đọc từ biến môi trường)
│   ├── nap-du-lieu.js     ← dữ liệu mẫu TẤT ĐỊNH (hạt giống cố định)
│   └── truy-van-chinh.js  ← TRUY_VAN = [...] cho kiem-du-an.js
├── app/                   ← Express + Mongoose hoặc Spring Boot + Spring Data
├── test/
│   ├── dong-thoi.*        ← bắn đồng thời thao tác then chốt
│   └── chen-toan-tu.*     ← gửi {"$ne": null}, {"$regex": …} vào mọi endpoint nhận đầu vào
└── van-hanh/
    ├── sao-luu.sh  kiem-khoi-phuc.sh  hon-loan.sh  do-tai.mjs
    └── postmortem-dien-tap.md`;

const SO_DO = `# SO-DO.md — số đo của dự án <tên> (máy đo: <CPU, RAM, giới hạn container>; ngày đo: …)

## 1. Truy vấn chính (kiem-du-an.js + explain("executionStats"))
| Màn hình / endpoint | Index      | Trước: kế hoạch · quét/trả · ms | Sau: kế hoạch · quét/trả · ms |
|---------------------|------------|----------------------------------|-------------------------------|
| đơn của tôi         | {khach, tao:-1} | SORT←COLLSCAN · 2000/13 · 1 | LIMIT←FETCH←IXSCAN · 13/13 · 1 |

## 2. Thao tác then chốt chạy đồng thời
bất biến: <ví dụ: không ghế nào thuộc hai vé> · <N> tiến trình × <M> lượt · vi phạm: 0 · lệnh chạy lại: …

## 3. Diễn tập mất primary (hon-loan.sh)
thời gian bầu lại: … s · API lỗi trong: … s · lần ghi đã xác nhận bị mất: 0

## 4. Khôi phục
sao lưu: … (cỡ, thời gian) · khôi phục thử tự động: mã thoát 0, số tài liệu khớp · PITR tới trước sự cố: … · RPO … / RTO …

## 5. Đo tải (mô hình mở)
tốc độ mục tiêu … yêu cầu/s · p50/p95/p99 … ms · điểm gãy … yêu cầu/s · nút thắt: …

## 6. Giới hạn đã biết (trung thực — hội đồng sẽ hỏi)
- …`;

const RUBRIC_EN = `
<table>
<tr><th>Criterion (defence points)</th><th>Excellent</th><th>Pass</th><th>Loses the points</th></tr>
<tr><td>Schema from queries (20 → 2)</td><td>Every embed/reference decision traced to a query in THIET-KE.md; growth of the largest document estimated for one year; at least one pattern used on purpose</td><td>Design document exists, choices mostly justified</td><td>Collections copied from an ER diagram; an unbounded array; "it was easier"</td></tr>
<tr><td>Indexes and evidence (20 → 2)</td><td>All main queries ✔ in kiem-du-an.js; explain before/after in SO-DO.md; ESR reasoning; one index you decided <em>not</em> to create, with the reason</td><td>Main queries use an index, some SORT left</td><td>COLLSCAN on a main screen; an index per field "just in case"</td></tr>
<tr><td>Correct under concurrency (15 → 1.5)</td><td>Invariant named; one atomic operation or transaction; concurrent test with N processes, 0 violations, re-runnable</td><td>Correct code, tested only sequentially</td><td>Check-then-act; no test</td></tr>
<tr><td>Reports (10 → 1)</td><td>Correct numbers checked by an independent count; Vietnam time zone; first stage uses an index</td><td>Correct numbers</td><td>UTC month boundaries; double for money</td></tr>
<tr><td>Availability and recovery (15 → 1.5)</td><td>3-member replica set; primary killed during writes with 0 acknowledged writes lost; automatic restore check; PITR drill documented</td><td>Replica set and a backup that was restored once</td><td>Single node; backup never restored</td></tr>
<tr><td>Security (10 → 1)</td><td>Auth on; application user with least privilege; injection tests on every input endpoint; no secret in git history</td><td>Auth on, one app user</td><td>Auth off; root user in the app; a key in a commit</td></tr>
<tr><td>Explaining (10 → 1)</td><td>Answers with the code open; names trade-offs and limits honestly</td><td>Explains what the code does</td><td>Cannot explain own code</td></tr>
</table>`;

const RUBRIC_VI = `
<table>
<tr><th>Tiêu chí (điểm bảo vệ)</th><th>Giỏi</th><th>Đạt</th><th>Mất điểm</th></tr>
<tr><td>Schema từ truy vấn (20 → 2)</td><td>Mọi quyết định nhúng/tham chiếu lần ra được một truy vấn trong THIET-KE.md; ước lượng tài liệu lớn nhất sau một năm; ít nhất một pattern dùng có chủ đích</td><td>Có tài liệu thiết kế, phần lớn lựa chọn có lý do</td><td>Collection chép từ sơ đồ ER; một mảng không giới hạn; "làm vậy cho dễ"</td></tr>
<tr><td>Index và bằng chứng (20 → 2)</td><td>Mọi truy vấn chính ✔ trong kiem-du-an.js; explain trước/sau trong SO-DO.md; lập luận ESR; một index bạn quyết định <em>không</em> tạo, kèm lý do</td><td>Truy vấn chính có dùng index, còn vài SORT</td><td>COLLSCAN ở một màn hình chính; mỗi trường một index "cho chắc"</td></tr>
<tr><td>Đúng khi đồng thời (15 → 1,5)</td><td>Gọi tên bất biến; một thao tác nguyên tử hoặc transaction; bài thử N tiến trình, 0 vi phạm, chạy lại được</td><td>Mã đúng, chỉ thử tuần tự</td><td>Kiểm rồi ghi; không có bài thử</td></tr>
<tr><td>Báo cáo (10 → 1)</td><td>Số đúng, đối chiếu bằng một phép đếm độc lập; múi giờ Việt Nam; stage đầu dùng index</td><td>Số đúng</td><td>Ranh giới tháng theo UTC; tiền kiểu double</td></tr>
<tr><td>Sẵn sàng và khôi phục (15 → 1,5)</td><td>Replica set 3 thành viên; giết primary giữa lúc ghi, 0 lần ghi đã xác nhận bị mất; kiểm khôi phục tự động; diễn tập PITR có tài liệu</td><td>Replica set và một bản sao lưu đã khôi phục thử một lần</td><td>Một máy; bản sao lưu chưa từng khôi phục</td></tr>
<tr><td>Bảo mật (10 → 1)</td><td>Bật xác thực; tài khoản ứng dụng quyền tối thiểu; test chèn toán tử ở mọi endpoint nhận đầu vào; không bí mật nào trong lịch sử git</td><td>Bật xác thực, một tài khoản ứng dụng</td><td>Tắt xác thực; ứng dụng dùng root; một khoá nằm trong commit</td></tr>
<tr><td>Giải thích (10 → 1)</td><td>Trả lời khi mở mã; nói thẳng đánh đổi và giới hạn</td><td>Giải thích được mã làm gì</td><td>Không giải thích được mã của mình</td></tr>
</table>`;

export default {
  title: '11.1 — Final project brief and rubric|||11.1 — Đề dự án cuối khoá và rubric',
  slug: 'mgo-11-1-de-bai',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Hồ sơ nộp dự án cuối khoá MongoDB: cấu trúc repo, yêu cầu chức năng và phi chức năng có con số (không COLLSCAN, w:majority, 0 lần ghi mất khi giết primary, khôi phục thử tự động, p99 theo tốc độ mục tiêu), mẫu SO-DO.md, rubric 100 điểm quy đổi về rubric bảo vệ 10 điểm. Script tự kiểm kiem-du-an.js chạy thật trên CT Shop: lần đầu 8 ✘ (không validator, 3 truy vấn COLLSCAN, một máy, tắt xác thực), sửa theo Chương 1 + 4 còn 4 ✘; explain không tính vào $indexStats. Sự cố thật: Uber 2016 — khoá truy cập đăng lên trang chia sẻ mã (FTC 2018).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Final project brief and rubric</h2>
<p class="lead">Ten milestones built your project a piece at a time. This lesson turns those pieces into one hand-in: what the repository must contain, which numbers you must measure and write down, how each criterion is graded, and a script that finds your missing points before the committee does. The topics, milestones and the AI defence room are in the project lessons; here is the file you submit.</p>
<p>Think of applying for a building permit. The inspector does not start by walking through the house; they read the folder — drawings, load-test results, the electrician's sign-off. If a document is missing, the visit does not happen. A committee reading your repository works the same way: README, design, numbers, then questions.</p>
${lienKet({ cta: 'Open lesson', khoa: 'mongodb', bai: 'mgo-bao-ve-du-an', title: 'MongoDB course · Finish & defend your course project', sub: 'checklist, 10-point defence rubric, 18 committee questions and the AI defence room' })}

<h3>1. What you hand in</h3>
<p>One repository that a stranger can clone and run. The layout below is a contract, not a suggestion — the committee and the self-check script look for these files by name.</p>
${ma('text', CAY)}

<h3>2. Functional requirements (every topic)</h3>
<ul>
<li>The main flows of your topic (milestone 2 and 8): create, list with filters, detail, update, cancel/soft delete — through the API, not only in mongosh.</li>
<li>At least three reports written as aggregation pipelines (milestone 5), one of them by day or month in Vietnam time.</li>
<li>One critical operation where money, stock or a seat is at stake, correct under concurrency (milestone 6).</li>
<li>Login and search endpoints that resist operator injection (milestone 9).</li>
</ul>

<h3>3. Non-functional requirements — with numbers</h3>
<table>
<tr><th>Area</th><th>Requirement</th><th>Proof</th></tr>
<tr><td>Queries</td><td>No COLLSCAN on a main screen; keys and documents examined ≤ 3 × returned</td><td><code>kiem-du-an.js</code> section 3, explain in SO-DO.md</td></tr>
<tr><td>Documents</td><td>Largest document &lt; 1 MB today and estimated &lt; 4 MB after one year of growth</td><td>Section 2 of the script + your estimate in THIET-KE.md</td></tr>
<tr><td>Durability</td><td><code>w: "majority"</code>; killing the primary during writes loses 0 acknowledged writes</td><td><code>hon-loan.sh</code> output (Lesson 7.2)</td></tr>
<tr><td>Recovery</td><td>Nightly backup restored automatically and checked by exit code + counts; PITR drill to just before a bad write</td><td><code>kiem-khoi-phuc.sh</code> (Lesson 10.1), drill postmortem</td></tr>
<tr><td>Security</td><td>Auth on; the application user has only the roles it needs; no secret in any commit</td><td>Script section 5, <code>db/03-nguoi-dung.js</code>, gitleaks/history scan</td></tr>
<tr><td>Performance</td><td>p99 under your stated target at your stated rate, open-model load test</td><td><code>do-tai.mjs</code> output (Lesson 10.4)</td></tr>
</table>

<h3>4. The numbers file</h3>
<p>Every claim in the defence must point at a measured number. Copy this template into <code>SO-DO.md</code> and fill it from real runs — the same habit as every output in this course.</p>
${ma('markdown', SO_DO)}

<h3>5. Check yourself before the committee does</h3>
<p><code>kiem-du-an.js</code> is read-only. It looks at the database your application uses and reports, section by section, what the rubric will punish: collections without a validator, too many document shapes, oversized documents, unused indexes, main queries that scan, a single-node deployment, a weak write concern, auth off. You give it your main queries in a small file.</p>
<details><summary>Show the self-check script (kiem-du-an.js)</summary>
${ma('js', tep('kiem-du-an.js'))}
</details>
${ma('js', tep('truy-van-ctshop.js'))}
<p>Run it on CT Shop exactly as it was in Section 0 — freshly loaded, no indexes, no validators:</p>
${lenh(K, 0)}
${lenh(K, 1)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">8 ✘</span><span class="lz-t">CT Shop as loaded in Section 0</span><span class="lz-d">no validators · 3 main queries SORT ← COLLSCAN · one node · auth off</span></div>
  <div class="lz-step"><span class="lz-k">Fix</span><span class="lz-t">three indexes by ESR + one validator</span><span class="lz-d">Chapter 4 and Chapter 1, four commands</span></div>
  <div class="lz-step"><span class="lz-k">4 ✘</span><span class="lz-t">every main query: keys = documents = returned</span><span class="lz-d">left: two validators, one node, auth — the lab, not your project</span></div>
</div>
${lenh(K, 2)}
${lenh(K, 3)}
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
<p>All three main queries went from <code>SORT ← COLLSCAN</code> over 2,000 documents to <code>IXSCAN</code> reading exactly what they return (13/13, 20/20, 5/5). The remaining ✘ are honest: the lab of Lesson 0.2 is deliberately a one-node replica set without auth so that every chapter starts quickly. Your project must not be — run it on the three-node set of Lesson 7.1 with auth as in Lab 9.5, and the last two ✘ become ✔.</p>
<p>Look at the ⚠ in section 3: the new indexes are "not used since start-up", even though the script just explained queries that use them. <code>explain</code> does not count as an access in <code>$indexStats</code>; only real queries do:</p>
${lenh(K, 7)}
${lenh(K, 8)}

<div class="pitfall co-tieu-de">
<p><strong>Trap — dropping an index because <code>$indexStats</code> says 0.</strong> The counter starts at zero on every restart and ignores explain. An index used only by the monthly report looks unused for 29 days. Before dropping, hide it (<code>hideIndex</code>, Lesson 4.4), watch a full business cycle, then drop.</p>
</div>

<h3>6. Rubric — 100 points, the same seven criteria as the defence</h3>
<p>The defence rubric has 10 points. To grade the product precisely, each criterion is scored out of 10× its weight and divided back. "Excellent" means the full share; "Pass" about 60%; the right-hand column is what loses the criterion entirely.</p>
${RUBRIC_EN}

<h3>7. Where projects really lose points</h3>
<ul>
<li>The README works only on the author's machine (a missing seed step, a hard-coded path, a port already used).</li>
<li>SO-DO.md contains numbers that nobody can reproduce — no command, no machine description.</li>
<li>The concurrent test passes because it never actually ran concurrently (processes started one after another).</li>
<li>Money as <code>double</code> in one collection and Decimal128 in another.</li>
<li>A real password in <code>compose.yaml</code> or in the history of a deleted file.</li>
</ul>

<h3>8. A two-week plan</h3>
<table>
<tr><th>Days</th><th>Work</th></tr>
<tr><td>1–2</td><td>Clean clone test: delete everything, follow your README word for word on another folder; fix until it works</td></tr>
<tr><td>3–5</td><td>Write THIET-KE.md from milestones 1–3; run <code>kiem-du-an.js</code>, fix every ✘ in sections 1–3</td></tr>
<tr><td>6–8</td><td>Re-run concurrency, failover and restore drills on the final code; fill SO-DO.md sections 2–4</td></tr>
<tr><td>9–10</td><td>Auth + app user + injection tests; history scan for secrets</td></tr>
<tr><td>11–12</td><td>Load test, SO-DO.md section 5–6</td></tr>
<tr><td>13–14</td><td>Rehearse the defence out loud with the 18 questions; then the AI defence room</td></tr>
</table>

<h3>Hacker's corner — a key in a repository (Uber, 2016)</h3>
<p>According to the US Federal Trade Commission, intruders reached Uber's cloud storage in 2016 with an access key that an Uber engineer had posted on a code-sharing website. They downloaded unencrypted files with about 25 million names and email addresses, 22 million names and phone numbers, and 600,000 driver's licence numbers. Uber learned of it in November 2016, paid the intruders $100,000 through its bug bounty programme, and did not disclose it until November 2017.</p>
<p>The lesson for your hand-in is concrete. A secret in any commit is public the moment the repository is, and deleting the file later does not remove it from history. Keep only <code>.env.example</code> with names; read passwords from the environment (<code>db/03-nguoi-dung.js</code>); scan the whole history before you share the link (<code>gitleaks detect</code>, or at least <code>git log -p | grep -i -E "password|secret|key"</code>); and if a key ever leaked, rotate it — removing it from git is not enough. In this course every password in a demo is a placeholder such as <code>$MK</code>.</p>
${nguon('⚖️', 'FTC (12/04/2018) — Uber agrees to expanded settlement', '2016 breach: access key posted on a code-sharing website; 25M + 22M + 600k records; disclosed November 2017', 'https://www.ftc.gov/news-events/news/press-releases/2018/04/uber-agrees-expanded-settlement-ftc-related-privacy-security-claims')}

<h3>On the job</h3>
<p>At the end of an outsourcing contract you hand over a "deliverables package": source, deployment guide, test report, known issues. The client's engineers run the guide on their own machines during UAT; if step 3 fails, the payment milestone moves. Your README, SO-DO.md and "known limits" section are a small version of exactly that package — practising it now is practising your first handover at FPT Software.</p>

<h3>Practice</h3>
<ol>
<li>Write <code>db/truy-van-chinh.js</code> for your project (every main screen, one line each) and run <code>kiem-du-an.js</code> on your database. Fix until sections 1–3 have no ✘.</li>
<li>Do the clean-clone test: clone your repository into a new folder, follow only the README. Count the steps that failed.</li>
<li>Scan your history: how many commits mention a password-like string? Rotate anything real.</li>
</ol>
${loiGiai('Show what "done" looks like', `<p>(1) Section 3 shows <code>IXSCAN</code> for every main query with quét ≈ trả; section 4 shows three data-bearing members and w=majority; section 5 shows auth on. A ⚠ for TLS is acceptable on a lab if you say so in "known limits". (2) Zero failed steps — typical first-time failures are a seed that assumes an existing database, a script that needs <code>chmod +x</code>, and a port already used on the committee's machine. (3) Zero real secrets; placeholders are fine. If you found a real one, rotation is the fix; rewriting history is optional on top.</p>`)}

<h3>Interview questions</h3>
<ol>
<li>"Walk me through how you would hand this database over to an operations team."</li>
<li>"How do you know an index is unused?"</li>
<li>"Someone committed a database password six months ago and deleted it the next day. Are we safe?"</li>
</ol>
${loiGiai('Show model answers', `<ol>
<li>Runbook in the repository: how to start, seed, back up and restore (with the automatic restore check), who gets which alert (four metric groups of Lesson 10.2), the failover drill result, the users and their roles, and the known limits. Numbers come from SO-DO.md, not memory.</li>
<li><code>$indexStats</code> over a full business cycle on every member (counters are per node and reset on restart; explain is not counted), then <code>hideIndex</code> and watch slow-query logs before dropping.</li>
<li>No. The password is in the history of every clone and fork; deleting the file changed nothing. Rotate it now, check the audit trail / logs for its use, then clean history if needed and add a pre-commit secret scanner.</li>
</ol>`)}

<h3>Key terms</h3>
${kv([
  ['Deliverables package', 'Everything handed over at the end of a contract: source, guide, test report, known issues'],
  ['Clean-clone test', 'Run the project from a fresh clone using only the README'],
  ['SO-DO.md', 'The numbers file: every claim in the defence points to a measured, reproducible number'],
  ['$indexStats', 'Per-index access counter since the node started; explain is not counted'],
  ['Secret rotation', 'Replacing a leaked credential — the only real fix once it has been committed'],
])}

<h3>Summary</h3>
<ul>
<li>The hand-in is a repository a stranger can run: README, THIET-KE.md, SO-DO.md, scripts by name.</li>
<li>Non-functional requirements have numbers, and each number has a command that reproduces it.</li>
<li><code>kiem-du-an.js</code> finds missing validators, scans, weak durability and auth before the committee does.</li>
<li>The 100-point rubric is the defence rubric in detail: schema 20, indexes 20, concurrency 15, availability 15, reports 10, security 10, explaining 10.</li>
<li>A secret in history is a leaked secret: scan, rotate, use placeholders.</li>
</ul>
${lienKet({ cta: 'Open lesson', khoa: 'mongodb', bai: 'mgo-10-1-sao-luu', title: 'MongoDB course · 10.1 — Backup, restore check and PITR', sub: 'kiem-khoi-phuc.sh for SO-DO.md section 4' })}
${lienKet({ cta: 'Open lesson', khoa: 'mongodb', bai: 'mgo-7-2-failover', title: 'MongoDB course · 7.2 — Failover for real', sub: 'the kill-the-primary drill for SO-DO.md section 3' })}
${nguon('📘', 'MongoDB Docs — $indexStats', 'accesses.ops counts operations since the server started; statistics reset on restart', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/indexStats/')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Đề dự án cuối khoá và rubric</h2>
<p class="lead">Mười mốc đã dựng dự án của bạn từng mảnh. Bài này gom các mảnh đó thành một lần nộp: repo phải chứa gì, phải đo và ghi lại những con số nào, mỗi tiêu chí chấm ra sao, và một script tìm ra chỗ mất điểm trước khi hội đồng tìm ra. Đề tài, các mốc và phòng bảo vệ AI nằm ở các bài dự án; ở đây là hồ sơ bạn nộp.</p>
<p>Hãy nghĩ tới việc xin giấy phép xây nhà. Cán bộ không bắt đầu bằng việc đi quanh căn nhà; họ đọc tập hồ sơ — bản vẽ, kết quả thử tải, biên bản nghiệm thu điện. Thiếu một giấy là không có buổi kiểm tra. Hội đồng đọc repo của bạn cũng vậy: README, thiết kế, số đo, rồi mới tới câu hỏi.</p>
${lienKet({ khoa: 'mongodb', bai: 'mgo-bao-ve-du-an', title: 'Khoá MongoDB · Hoàn thiện & bảo vệ dự án cuối khoá', sub: 'checklist, rubric bảo vệ 10 điểm, 18 câu hội đồng và phòng bảo vệ AI' })}

<h3>1. Nộp những gì</h3>
<p>Một repo mà người lạ clone về là chạy được. Cấu trúc dưới đây là hợp đồng, không phải gợi ý — hội đồng và script tự kiểm tìm các tệp này theo đúng tên.</p>
${ma('text', CAY)}

<h3>2. Yêu cầu chức năng (đề tài nào cũng phải có)</h3>
<ul>
<li>Các luồng chính của đề tài (mốc 2 và 8): tạo, liệt kê có lọc, xem chi tiết, cập nhật, huỷ/xoá mềm — qua API, không chỉ trong mongosh.</li>
<li>Ít nhất ba báo cáo viết bằng aggregation pipeline (mốc 5), một báo cáo theo ngày hoặc tháng giờ Việt Nam.</li>
<li>Một thao tác then chốt dính tới tiền, tồn kho hoặc chỗ ngồi, đúng khi đồng thời (mốc 6).</li>
<li>Endpoint đăng nhập và tìm kiếm chống được chèn toán tử (mốc 9).</li>
</ul>

<h3>3. Yêu cầu phi chức năng — có con số</h3>
<table>
<tr><th>Mảng</th><th>Yêu cầu</th><th>Bằng chứng</th></tr>
<tr><td>Truy vấn</td><td>Không COLLSCAN ở màn hình chính; số khoá và tài liệu quét ≤ 3 × số trả về</td><td><code>kiem-du-an.js</code> mục 3, explain trong SO-DO.md</td></tr>
<tr><td>Tài liệu</td><td>Tài liệu lớn nhất &lt; 1 MB hôm nay và ước lượng &lt; 4 MB sau một năm tăng trưởng</td><td>Mục 2 của script + ước lượng trong THIET-KE.md</td></tr>
<tr><td>Bền dữ liệu</td><td><code>w: "majority"</code>; giết primary giữa lúc ghi thì mất 0 lần ghi đã xác nhận</td><td>Output <code>hon-loan.sh</code> (Bài 7.2)</td></tr>
<tr><td>Khôi phục</td><td>Sao lưu hằng đêm, tự khôi phục thử và kiểm bằng mã thoát + số lượng; diễn tập PITR tới ngay trước lần ghi sai</td><td><code>kiem-khoi-phuc.sh</code> (Bài 10.1), postmortem diễn tập</td></tr>
<tr><td>Bảo mật</td><td>Bật xác thực; tài khoản ứng dụng chỉ có vai trò cần thiết; không bí mật nào trong commit</td><td>Mục 5 của script, <code>db/03-nguoi-dung.js</code>, quét lịch sử bằng gitleaks</td></tr>
<tr><td>Hiệu năng</td><td>p99 dưới mục tiêu bạn tự đặt ở tốc độ bạn tự đặt, đo theo mô hình mở</td><td>Output <code>do-tai.mjs</code> (Bài 10.4)</td></tr>
</table>

<h3>4. Tệp số đo</h3>
<p>Mọi khẳng định trong buổi bảo vệ phải chỉ được vào một con số đã đo. Chép mẫu này vào <code>SO-DO.md</code> và điền từ các lượt chạy thật — cùng thói quen với mọi output trong khoá này.</p>
${ma('markdown', SO_DO)}

<h3>5. Tự kiểm trước khi hội đồng kiểm</h3>
<p><code>kiem-du-an.js</code> chỉ đọc. Nó nhìn vào database ứng dụng của bạn dùng và báo theo từng mục những gì rubric sẽ trừ điểm: collection không có validator, quá nhiều hình dạng tài liệu, tài liệu quá to, index không dùng, truy vấn chính phải quét, triển khai một máy, write concern yếu, tắt xác thực. Bạn khai các truy vấn chính trong một tệp nhỏ.</p>
<details><summary>Xem script tự kiểm (kiem-du-an.js)</summary>
${ma('js', tep('kiem-du-an.js'))}
</details>
${ma('js', tep('truy-van-ctshop.js'))}
<p>Chạy trên CT Shop đúng như hồi Mục 0 — vừa nạp, chưa index, chưa validator:</p>
${lenh(K, 0)}
${lenh(K, 1)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">8 ✘</span><span class="lz-t">CT Shop như lúc nạp ở Mục 0</span><span class="lz-d">không validator · 3 truy vấn chính SORT ← COLLSCAN · một máy · tắt xác thực</span></div>
  <div class="lz-step"><span class="lz-k">Sửa</span><span class="lz-t">ba index theo ESR + một validator</span><span class="lz-d">Chương 4 và Chương 1, bốn lệnh</span></div>
  <div class="lz-step"><span class="lz-k">4 ✘</span><span class="lz-t">mọi truy vấn chính: khoá = tài liệu = trả về</span><span class="lz-d">còn lại: hai validator, một máy, xác thực — đó là lab, không phải dự án của bạn</span></div>
</div>
${lenh(K, 2)}
${lenh(K, 3)}
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
<p>Cả ba truy vấn chính đi từ <code>SORT ← COLLSCAN</code> trên 2.000 tài liệu sang <code>IXSCAN</code> đọc đúng số nó trả về (13/13, 20/20, 5/5). Các ✘ còn lại là trung thực: lab của Bài 0.2 cố ý là replica set một máy không xác thực để chương nào cũng bắt đầu nhanh. Dự án của bạn thì không được như vậy — hãy chạy nó trên cụm ba máy của Bài 7.1 và bật xác thực như Lab 9.5, hai ✘ cuối sẽ thành ✔.</p>
<p>Để ý dấu ⚠ ở mục 3: index mới "chưa được dùng từ lúc khởi động", dù script vừa explain các truy vấn dùng chúng. <code>explain</code> không được tính là một lần truy cập trong <code>$indexStats</code>; chỉ truy vấn thật mới được tính:</p>
${lenh(K, 7)}
${lenh(K, 8)}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — xoá index vì <code>$indexStats</code> báo 0.</strong> Bộ đếm về 0 mỗi lần khởi động lại và bỏ qua explain. Một index chỉ báo cáo cuối tháng dùng sẽ trông như vô dụng suốt 29 ngày. Trước khi xoá, hãy ẩn nó (<code>hideIndex</code>, Bài 4.4), theo dõi trọn một chu kỳ kinh doanh, rồi mới xoá.</p>
</div>

<h3>6. Rubric — 100 điểm, đúng bảy tiêu chí của buổi bảo vệ</h3>
<p>Rubric bảo vệ có 10 điểm. Để chấm sản phẩm cho kỹ, mỗi tiêu chí chấm trên thang gấp 10 lần trọng số rồi chia lại. "Giỏi" là trọn phần điểm; "Đạt" khoảng 60%; cột bên phải là những gì làm mất trọn tiêu chí.</p>
${RUBRIC_VI}

<h3>7. Dự án thật sự mất điểm ở đâu</h3>
<ul>
<li>README chỉ chạy trên máy tác giả (thiếu bước nạp dữ liệu, đường dẫn viết cứng, cổng đã bị chiếm).</li>
<li>SO-DO.md có những con số không ai tái tạo được — không có lệnh, không mô tả máy đo.</li>
<li>Bài thử đồng thời qua vì thật ra nó không hề chạy đồng thời (các tiến trình khởi động lần lượt).</li>
<li>Tiền là <code>double</code> ở collection này, Decimal128 ở collection kia.</li>
<li>Một mật khẩu thật trong <code>compose.yaml</code> hoặc trong lịch sử của một tệp đã xoá.</li>
</ul>

<h3>8. Kế hoạch hai tuần</h3>
<table>
<tr><th>Ngày</th><th>Việc</th></tr>
<tr><td>1–2</td><td>Thử clone sạch: xoá hết, làm đúng từng chữ README ở một thư mục khác; sửa tới khi chạy</td></tr>
<tr><td>3–5</td><td>Viết THIET-KE.md từ mốc 1–3; chạy <code>kiem-du-an.js</code>, sửa mọi ✘ ở mục 1–3</td></tr>
<tr><td>6–8</td><td>Chạy lại diễn tập đồng thời, mất primary, khôi phục trên mã cuối cùng; điền SO-DO.md mục 2–4</td></tr>
<tr><td>9–10</td><td>Xác thực + tài khoản ứng dụng + test chèn toán tử; quét lịch sử tìm bí mật</td></tr>
<tr><td>11–12</td><td>Đo tải, SO-DO.md mục 5–6</td></tr>
<tr><td>13–14</td><td>Tập bảo vệ thành tiếng với 18 câu hỏi; rồi vào phòng bảo vệ AI</td></tr>
</table>

<h3>Góc hacker — một chiếc khoá trong repo (Uber, 2016)</h3>
<p>Theo Uỷ ban Thương mại Liên bang Mỹ (FTC), năm 2016 kẻ xâm nhập vào được kho lưu trữ đám mây của Uber nhờ một khoá truy cập mà một kỹ sư Uber đã đăng lên một trang chia sẻ mã. Chúng tải về các tệp không mã hoá chứa khoảng 25 triệu tên và email, 22 triệu tên và số điện thoại, và 600.000 số giấy phép lái xe. Uber biết chuyện vào tháng 11/2016, trả kẻ xâm nhập 100.000 USD qua chương trình bug bounty, và tới tháng 11/2017 mới công bố.</p>
<p>Bài học cho hồ sơ nộp rất cụ thể. Bí mật nằm trong bất kỳ commit nào là công khai ngay khi repo công khai, và xoá tệp sau đó không xoá nó khỏi lịch sử. Chỉ giữ <code>.env.example</code> có tên biến; đọc mật khẩu từ biến môi trường (<code>db/03-nguoi-dung.js</code>); quét cả lịch sử trước khi gửi liên kết (<code>gitleaks detect</code>, hoặc ít nhất <code>git log -p | grep -i -E "password|secret|key"</code>); và nếu một khoá từng lộ thì phải đổi khoá — gỡ khỏi git là không đủ. Trong khoá này, mọi mật khẩu trong demo đều là chỗ giữ chỗ như <code>$MK</code>.</p>
${nguon('⚖️', 'FTC (12/04/2018) — Uber đồng ý mở rộng thoả thuận dàn xếp', 'vụ lộ 2016: khoá truy cập đăng lên trang chia sẻ mã; 25 triệu + 22 triệu + 600 nghìn bản ghi; công bố tháng 11/2017', 'https://www.ftc.gov/news-events/news/press-releases/2018/04/uber-agrees-expanded-settlement-ftc-related-privacy-security-claims')}

<h3>Khi đi làm</h3>
<p>Cuối một hợp đồng outsourcing, bạn bàn giao một "gói sản phẩm": mã nguồn, hướng dẫn triển khai, báo cáo kiểm thử, danh sách lỗi đã biết. Kỹ sư phía khách chạy hướng dẫn đó trên máy của họ trong đợt UAT; bước 3 hỏng là mốc thanh toán lùi lại. README, SO-DO.md và mục "giới hạn đã biết" của bạn là bản thu nhỏ của đúng gói đó — tập bây giờ là tập cho lần bàn giao đầu tiên ở FPT Software.</p>

<h3>Thực hành</h3>
<ol>
<li>Viết <code>db/truy-van-chinh.js</code> cho dự án của bạn (mỗi màn hình chính một dòng) và chạy <code>kiem-du-an.js</code> trên database của bạn. Sửa tới khi mục 1–3 không còn ✘.</li>
<li>Thử clone sạch: clone repo vào thư mục mới, chỉ làm theo README. Đếm số bước bị hỏng.</li>
<li>Quét lịch sử: bao nhiêu commit có chuỗi trông như mật khẩu? Đổi mọi thứ là thật.</li>
</ol>
${loiGiai('Xem thế nào là "xong"', `<p>(1) Mục 3 hiện <code>IXSCAN</code> cho mọi truy vấn chính với quét ≈ trả; mục 4 hiện ba thành viên mang dữ liệu và w=majority; mục 5 hiện đã bật xác thực. ⚠ ở TLS chấp nhận được trên lab nếu bạn ghi rõ trong "giới hạn đã biết". (2) Không bước nào hỏng — các lỗi lần đầu hay gặp là lệnh nạp dữ liệu giả định database đã có, script cần <code>chmod +x</code>, và cổng đã bị chiếm trên máy hội đồng. (3) Không có bí mật thật nào; chỗ giữ chỗ thì được. Nếu tìm thấy một cái thật, cách sửa là đổi khoá; viết lại lịch sử là việc thêm, không thay được.</p>`)}

<h3>Câu hỏi phỏng vấn</h3>
<ol>
<li>"Kể cho tôi cách bạn bàn giao database này cho một đội vận hành."</li>
<li>"Làm sao bạn biết một index không được dùng?"</li>
<li>"Có người commit mật khẩu database sáu tháng trước, hôm sau đã xoá. Chúng ta an toàn chưa?"</li>
</ol>
${loiGiai('Xem đáp án mẫu', `<ol>
<li>Runbook nằm trong repo: cách khởi động, nạp, sao lưu và khôi phục (kèm bước kiểm khôi phục tự động), ai nhận cảnh báo nào (bốn nhóm chỉ số của Bài 10.2), kết quả diễn tập mất primary, các tài khoản và vai trò, và các giới hạn đã biết. Con số lấy từ SO-DO.md, không lấy từ trí nhớ.</li>
<li><code>$indexStats</code> qua trọn một chu kỳ kinh doanh trên mọi thành viên (bộ đếm tính riêng từng máy và về 0 khi khởi động lại; explain không được tính), rồi <code>hideIndex</code> và theo dõi log truy vấn chậm trước khi xoá.</li>
<li>Chưa. Mật khẩu nằm trong lịch sử của mọi bản clone và fork; xoá tệp không thay đổi gì. Đổi mật khẩu ngay, kiểm nhật ký xem nó đã bị dùng chưa, rồi mới làm sạch lịch sử nếu cần và thêm bộ quét bí mật trước commit.</li>
</ol>`)}

<h3>Thuật ngữ</h3>
${kv([
  ['Gói bàn giao', 'Mọi thứ giao ở cuối hợp đồng: mã nguồn, hướng dẫn, báo cáo kiểm thử, lỗi đã biết'],
  ['Thử clone sạch', 'Chạy dự án từ một bản clone mới, chỉ dựa vào README'],
  ['SO-DO.md', 'Tệp số đo: mọi khẳng định khi bảo vệ chỉ vào một con số đã đo, tái tạo được'],
  ['$indexStats', 'Bộ đếm lượt truy cập từng index kể từ lúc máy khởi động; explain không được tính'],
  ['Đổi khoá (rotation)', 'Thay một thông tin xác thực đã lộ — cách sửa thật duy nhất khi nó đã vào commit'],
])}

<h3>Tóm tắt</h3>
<ul>
<li>Hồ sơ nộp là một repo người lạ chạy được: README, THIET-KE.md, SO-DO.md, các script đúng tên.</li>
<li>Yêu cầu phi chức năng có con số, và con số nào cũng có lệnh tái tạo nó.</li>
<li><code>kiem-du-an.js</code> tìm validator còn thiếu, truy vấn phải quét, độ bền yếu và xác thực tắt trước khi hội đồng tìm ra.</li>
<li>Rubric 100 điểm là rubric bảo vệ viết chi tiết: schema 20, index 20, đồng thời 15, sẵn sàng 15, báo cáo 10, bảo mật 10, giải thích 10.</li>
<li>Bí mật trong lịch sử là bí mật đã lộ: quét, đổi khoá, dùng chỗ giữ chỗ.</li>
</ul>
${lienKet({ khoa: 'mongodb', bai: 'mgo-10-1-sao-luu', title: 'Khoá MongoDB · 10.1 — Sao lưu, kiểm khôi phục và PITR', sub: 'kiem-khoi-phuc.sh cho SO-DO.md mục 4' })}
${lienKet({ khoa: 'mongodb', bai: 'mgo-7-2-failover', title: 'Khoá MongoDB · 7.2 — Chuyển dự phòng thật', sub: 'diễn tập giết primary cho SO-DO.md mục 3' })}
${nguon('📘', 'MongoDB Docs — $indexStats', 'accesses.ops đếm thao tác từ lúc máy chủ khởi động; thống kê về 0 khi khởi động lại', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/indexStats/')}
</div>
`,
};
