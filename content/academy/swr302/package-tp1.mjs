/**
 * SWR302 · Worked requirements package for assignment topic TP1 — the Campus
 * Academic and Registration System (CARS) of the fictional Northern Regional
 * University.
 *
 * All eight deliverables in full. The documents are in English (that is what is
 * submitted); the guidance around each one is bilingual.
 *
 * Generated from the source Markdown by scratchpad/tp1.py — edit the Markdown,
 * regenerate, do not hand-edit this file.
 */
import { bi } from './_slides.mjs';

const TP1L1 = {
  title: "W1.1 — Deliverable 1: Vision & Scope (full document)|||W1.1 — Deliverable 1: Vision & Scope (tài liệu đầy đủ)",
  slug: "swr302-tp1-goi-01-vision-scope",
  type: 'DOCUMENT',
  isFreePreview: true,
  description: "Vision & Scope hoàn chỉnh cho CARS theo template Chapter 5: 6 nỗi đau có định lượng, 6 business objective baseline–target–deadline, 6 rủi ro, 14 feature, 3 bản phát hành, 8 loại trừ, hồ sơ 8 stakeholder và bảng ưu tiên dự án.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP1 · Deliverable 1</span>
<h2>Vision &amp; Scope — the complete document</h2>
<p class="lead">TP1 gives you a brief with <strong>no numbers in it</strong>. This document shows what to do about that: every baseline in §1.3 is invented, and every one is declared as an assumption in §1.7 so a grader can see it was a decision rather than an accident.</p>
<p>Four things worth stealing:</p>
<ul>
<li><strong>§1.2 quantifies each of the six pains separately.</strong> The brief mentions prerequisites, overrides, tuition checks, cancellations and visibility in a single paragraph; separating them is what makes six measurable objectives possible instead of one vague one.</li>
<li><strong>§1.3 objectives include a "zero" target twice.</strong> Zero outages, zero incorrect enrollments. A target of zero is only credible when you also say how it is measured — §1.4 does.</li>
<li><strong>§2.4 exclusions name the systems a reader would assume are included</strong> — the LMS, the finance system, the timetable system, admissions. Each one is a scope argument settled in advance.</li>
<li><strong>§3.3 explains why this project cannot be piloted.</strong> Sections are shared across faculties, so a partial rollout would split one section's capacity across two systems. Recognising that a phased rollout is <em>impossible</em>, and substituting a rehearsal window, is the kind of judgement the deployment section is for.</li>
</ul>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP1 · Deliverable 1</span>
<h2>Vision &amp; Scope — tài liệu hoàn chỉnh</h2>
<p class="lead">TP1 cho bạn một đề bài <strong>không có con số nào</strong>. Tài liệu này cho thấy phải xử lý điều đó ra sao: mọi baseline ở §1.3 đều do nhóm tự đặt, và mọi cái đều được khai thành giả định ở §1.7 để người chấm thấy đó là một quyết định chứ không phải sự tình cờ.</p>
<p>Bốn thứ đáng "mượn":</p>
<ul>
<li><strong>§1.2 định lượng RIÊNG từng nỗi đau trong sáu cái.</strong> Đề gộp môn tiên quyết, vượt sĩ số, đối chiếu học phí, huỷ lớp và thiếu minh bạch vào một đoạn; tách chúng ra mới có được sáu mục tiêu đo được thay vì một mục tiêu mơ hồ.</li>
<li><strong>§1.3 có tới hai mục tiêu đặt đích bằng "không".</strong> Không sập lần nào, không có lượt ghi danh sai. Đích bằng không chỉ đáng tin khi bạn đồng thời nói rõ đo nó ra sao — §1.4 làm việc đó.</li>
<li><strong>§2.4 phần loại trừ gọi đích danh những hệ thống người đọc dễ tưởng là có</strong> — LMS, hệ thống tài chính, hệ thống thời khoá biểu, tuyển sinh. Mỗi cái là một tranh cãi phạm vi được dập tắt từ trước.</li>
<li><strong>§3.3 giải thích vì sao dự án này KHÔNG thể triển khai thí điểm.</strong> Các lớp dùng chung giữa các khoa, nên triển khai một phần sẽ chia sĩ số của cùng một lớp cho hai hệ thống. Nhận ra rằng triển khai theo giai đoạn là <em>bất khả</em>, rồi thay bằng một buổi tổng duyệt, đúng là loại phán đoán mà mục triển khai sinh ra để chứa.</li>
</ul>`,
    ),
    `<h2>Vision and Scope Document</h2>
<h2>for the Campus Academic and Registration System (CARS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Team Leader name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Northern Regional University (NRU)
17 September 2026</p>
<hr />
<h3>Revision History</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Date</th>
<th>Reason For Changes</th>
<th>Version</th>
</tr>
</thead>
<tbody>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Initial draft after stakeholder elicitation round 1</td>
<td>0.9</td>
</tr>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Baseline approved by the Vice-Rector for Academic Affairs</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Business Requirements</h3>
<h3>1.1 Background</h3>
<p>Northern Regional University (NRU) is a public university with <strong>12,000 enrolled
students</strong> across six faculties, offering approximately <strong>1,400 course sections</strong> each
semester. Its academic administration has been run since 2012 on a locally built
student information system, now fourteen years old, which was designed for a student
body of roughly 3,000 and for registration handled at a service counter.</p>
<p>The university moved registration online in 2019 without re-architecting the
underlying system. Since then the student body has grown by 47%, the number of
sections by 38%, and the registration window has been compressed from two weeks to
<strong>72 hours</strong> in three priority waves. Everything else in the academic office — the
checks performed before an enrollment is confirmed, and the decisions made about
sections that do not fill — is still done by hand, as it was when there were 3,000
students.</p>
<p>Two consecutive semesters have ended with a formal complaint to the Rector: one about
registration outages, one about students discovering in their final year that a
graduation requirement had been missed. The university has funded this project in
response.</p>
<h3>1.2 Business Opportunity</h3>
<p>Five distinct problems, all named in the situation the academic office has described:</p>
<p><strong>P1 — The system fails under registration load.</strong> The 72-hour registration window
opens at 08:00 for each priority wave. Measured in Semester 2, 2025–26, <strong>peak
concurrent logins reached 4,200</strong> against a system that degrades past 1,800 and has
crashed outright in three of the last four windows. Each outage extends the window,
which pushes registration into teaching weeks and forces late timetable changes.</p>
<p><strong>P2 — Prerequisite completion is verified by hand.</strong> Academic office staff check each
enrollment against the student's transcript manually. Measured over the last two
semesters, this consumes approximately <strong>640 staff-hours per semester</strong>, and errors
survive: 61 students in 2025–26 were allowed into a course whose prerequisite they had
not passed, and had to be withdrawn after teaching had started.</p>
<p><strong>P3 — Capacity override requests are handled on paper.</strong> A student who wants a place
in a full section emails the department, which forwards to the academic office, which
consults the lecturer. There were <strong>2,300 override requests in 2025–26</strong>, and the
average time to a decision was <strong>6 days</strong> — long enough that the student has usually
committed to an alternative timetable by the time the answer arrives. There is no
record of who decided what, or why.</p>
<p><strong>P4 — Tuition status is cross-checked separately from enrollment.</strong> The finance
system and the academic system do not talk to each other. Three staff spend
approximately <strong>two weeks each semester</strong> exporting, matching and re-keying payment
status before enrollments can be confirmed. Students with a cleared payment are
sometimes blocked, and students with an outstanding balance are sometimes enrolled.</p>
<p><strong>P5 — Under-enrolled sections are found late.</strong> Nobody is systematically watching
which sections have failed to fill. In 2025–26 the average section cancellation was
confirmed <strong>9 days after the add/drop period opened</strong>, by which time affected students
had built timetables around it.</p>
<p><strong>P6 — Students cannot see their own position.</strong> There is no real-time degree audit
and no visible account balance. Students ask instead: the six faculty advising offices
logged approximately <strong>4,800 enquiries in 2025–26</strong> that consisted of a student asking
what they still had to take, or what they owed. Most of these questions are answerable
from data the university already holds.</p>
<h3>1.3 Business Objectives</h3>
<table>
<thead>
<tr>
<th>ID</th>
<th>Business Objective</th>
<th>Baseline (2025–26)</th>
<th>Target</th>
<th>Deadline</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>BO-1</strong></td>
<td>Eliminate registration-window outages and sustain peak concurrent load</td>
<td>4,200 peak concurrent; 3 outages in 4 windows</td>
<td>6,000 concurrent sessions, <strong>zero</strong> outages, p95 response ≤ 2 s</td>
<td>First registration window after Release 1.0</td>
</tr>
<tr>
<td><strong>BO-2</strong></td>
<td>Automate prerequisite verification</td>
<td>640 staff-hours/semester; 61 incorrect enrollments</td>
<td>≥ 98% of enrollment attempts decided automatically; ≤ 64 staff-hours/semester; <strong>zero</strong> incorrect enrollments</td>
<td>End of first semester after Release 1.0</td>
</tr>
<tr>
<td><strong>BO-3</strong></td>
<td>Put every capacity override into a tracked workflow with a decision deadline</td>
<td>2,300 requests/semester, 6 days average, no audit record</td>
<td>100% tracked; ≤ 48 hours to decision for ≥ 90% of requests</td>
<td>End of first semester after Release 1.0</td>
</tr>
<tr>
<td><strong>BO-4</strong></td>
<td>Evaluate financial eligibility automatically at the moment of registration</td>
<td>~240 staff-hours/semester of manual matching</td>
<td>≤ 20 staff-hours/semester; <strong>zero</strong> incorrectly blocked or incorrectly enrolled students</td>
<td>End of first semester after Release 1.0</td>
</tr>
<tr>
<td><strong>BO-5</strong></td>
<td>Identify under-enrolled sections before the add/drop period opens</td>
<td>9 days after opening</td>
<td>Flagged <strong>7 days before</strong> add/drop opens, automatically</td>
<td>Second semester after Release 1.0</td>
</tr>
<tr>
<td><strong>BO-6</strong></td>
<td>Give every student a real-time degree audit and account balance</td>
<td>~4,800 advising enquiries/semester</td>
<td>≥ 50% reduction (≤ 2,400/semester)</td>
<td>Second semester after Release 1.0</td>
</tr>
</tbody>
</table>
<h3>1.4 Success Metrics</h3>
<table>
<thead>
<tr>
<th>Metric</th>
<th>Measurement method</th>
<th>Source of data</th>
<th>Reporting frequency</th>
</tr>
</thead>
<tbody>
<tr>
<td>Peak concurrent sessions sustained</td>
<td>Maximum simultaneous authenticated sessions with p95 response ≤ 2 s</td>
<td>Application performance monitoring</td>
<td>Per registration window</td>
</tr>
<tr>
<td>Registration availability</td>
<td>Minutes of unavailability during a registration window ÷ total window minutes</td>
<td>Uptime monitoring</td>
<td>Per registration window</td>
</tr>
<tr>
<td>Automated prerequisite decisions</td>
<td>(Enrollment attempts decided without staff intervention ÷ total attempts) × 100</td>
<td>CARS enrollment audit log</td>
<td>Per semester</td>
</tr>
<tr>
<td>Incorrect enrollments</td>
<td>Count of students withdrawn after teaching started for an unmet prerequisite</td>
<td>Registrar withdrawal records</td>
<td>Per semester</td>
</tr>
<tr>
<td>Override decision time</td>
<td>Median and 90th-percentile hours from request submitted to decision recorded</td>
<td>CARS override workflow records</td>
<td>Weekly during registration</td>
</tr>
<tr>
<td>Manual finance-matching hours</td>
<td>Staff-recorded hours spent on payment reconciliation</td>
<td>Academic office timesheet</td>
<td>Per semester</td>
</tr>
<tr>
<td>Section cancellation lead time</td>
<td>Days between a section being flagged under-enrolled and the add/drop period opening</td>
<td>CARS section records</td>
<td>Per semester</td>
</tr>
<tr>
<td>Advising enquiry volume</td>
<td>Enquiries tagged "degree progress" or "account balance"</td>
<td>Advising office ticket log</td>
<td>Per semester</td>
</tr>
</tbody>
</table>
<p><strong>Factors with the greatest impact on success (inside NRU's control):</strong> the accuracy
of the curriculum rules migrated into the degree audit engine; the willingness of
department heads to decide overrides inside 48 hours; the quality of the historical
transcript data.</p>
<p><strong>Factors outside NRU's control:</strong> the finance system vendor's willingness to expose an
API; Ministry-level curriculum changes mid-project; student behaviour on the opening
minute of a registration wave.</p>
<h3>1.5 Vision Statement</h3>
<div class="callout">
<p><strong>For</strong> the students, academic advisors, academic office staff and department heads
of Northern Regional University
<strong>who</strong> must complete 12,000 students' registration inside a 72-hour window while
verifying prerequisites, capacity and financial standing for every enrollment,
<strong>the Campus Academic and Registration System (CARS)</strong> is an academic administration
platform
<strong>that</strong> decides every enrollment automatically against the curriculum, capacity and
finance rules at the moment the student clicks, and shows each student their own
degree progress and account balance continuously rather than on request.
<strong>Unlike</strong> the current fourteen-year-old system, in which registration is a queue
that falls over and every check behind it is performed by a person after the fact,
<strong>CARS</strong> treats the enrollment decision as a single automated transaction, so that
students learn the answer immediately and staff handle only the exceptions.</p>
</div>
<h3>1.6 Business Risks</h3>
<table>
<thead>
<tr>
<th>ID</th>
<th>Risk</th>
<th>Severity</th>
<th>Probability</th>
<th>Mitigation</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>RI-1</strong></td>
<td>The finance system vendor will not expose an API, forcing continued manual matching and defeating BO-4</td>
<td>High</td>
<td>Medium</td>
<td>Confirm vendor position in Week 3; design the finance interface behind an adapter so a nightly file exchange can substitute without changing enrollment logic</td>
</tr>
<tr>
<td><strong>RI-2</strong></td>
<td>Historical transcript and curriculum data are too inconsistent to drive an automated degree audit</td>
<td>High</td>
<td>High</td>
<td>Run a curriculum-rule and transcript data audit before design; define acceptance thresholds; degrade to advisor-confirmed audit for affected cohorts rather than showing a wrong one</td>
</tr>
<tr>
<td><strong>RI-3</strong></td>
<td>Peak load is not reproduced in testing and the first live window fails again, destroying confidence</td>
<td>High</td>
<td>Medium</td>
<td>Load test at 1.5× the historical peak before the first window; run the first window in three waves with a manual throttle</td>
</tr>
<tr>
<td><strong>RI-4</strong></td>
<td>Department heads do not decide overrides within 48 hours, so BO-3 fails for reasons the software cannot fix</td>
<td>Medium</td>
<td>High</td>
<td>Escalation and visible ageing built into the workflow; the Registrar reviews breaches weekly; the SLA is a university policy decision, recorded as a dependency</td>
</tr>
<tr>
<td><strong>RI-5</strong></td>
<td>Academic staff resist losing discretion to an automated rule and continue to grant exceptions off-system</td>
<td>Medium</td>
<td>Medium</td>
<td>Every rule is overridable by a named role with a recorded reason, so discretion is preserved but auditable</td>
</tr>
<tr>
<td><strong>RI-6</strong></td>
<td>Curriculum changes during the project invalidate the rules already encoded</td>
<td>Medium</td>
<td>Medium</td>
<td>Curriculum rules are configuration, not code; a change is a data change</td>
</tr>
</tbody>
</table>
<h3>1.7 Business Assumptions and Dependencies</h3>
<p><strong>Assumptions</strong></p>
<ul>
<li>A1: NRU will continue to operate a 72-hour registration window in three priority waves.</li>
<li>A2: Curriculum requirements can be expressed as machine-evaluable rules for at least 90% of programmes.</li>
<li>A3: The transcript data held in the legacy system is complete for students enrolled from 2019 onward.</li>
<li>A4: Student identity and authentication continue to be provided by the existing university SSO.</li>
<li>A5: The timetable and room allocation system remains the authority for when and where a section meets.</li>
<li>A6: Every enrolled student has a university email address reachable by the notification service.</li>
</ul>
<p><strong>Dependencies</strong></p>
<ul>
<li>D1: An interface to the finance/bursar system, whose form depends on the vendor (RI-1).</li>
<li>D2: A signed university policy setting the 48-hour override decision SLA (BO-3).</li>
<li>D3: Faculty curriculum committees to validate the encoded degree requirements before Release 1.0.</li>
<li>D4: A data steward from the Registrar's office available 8 hours per week during requirements and migration.</li>
</ul>
<hr />
<h3>2. Scope and Limitations</h3>
<h3>2.1 Major Features</h3>
<table>
<thead>
<tr>
<th>ID</th>
<th>Feature</th>
<th>Addresses</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>FE-1</strong></td>
<td>Course catalog search and section browsing</td>
<td>P1</td>
</tr>
<tr>
<td><strong>FE-2</strong></td>
<td>Schedule planning before the window opens ("shopping cart")</td>
<td>P1</td>
</tr>
<tr>
<td><strong>FE-3</strong></td>
<td>Enrollment transaction — a single automated decision on prerequisite, capacity and finance</td>
<td>P1, P2, P4</td>
</tr>
<tr>
<td><strong>FE-4</strong></td>
<td>Prerequisite and co-requisite rule engine</td>
<td>P2</td>
</tr>
<tr>
<td><strong>FE-5</strong></td>
<td>Financial eligibility evaluation at registration time</td>
<td>P4</td>
</tr>
<tr>
<td><strong>FE-6</strong></td>
<td>Capacity override request and decision workflow</td>
<td>P3</td>
</tr>
<tr>
<td><strong>FE-7</strong></td>
<td>Waitlist management and automatic promotion</td>
<td>P3</td>
</tr>
<tr>
<td><strong>FE-8</strong></td>
<td>Drop, swap and add/drop period handling</td>
<td>—</td>
</tr>
<tr>
<td><strong>FE-9</strong></td>
<td>Real-time degree audit</td>
<td>P6</td>
</tr>
<tr>
<td><strong>FE-10</strong></td>
<td>Student account balance and payment history view</td>
<td>P6</td>
</tr>
<tr>
<td><strong>FE-11</strong></td>
<td>Under-enrolled section detection and cancellation</td>
<td>P5</td>
</tr>
<tr>
<td><strong>FE-12</strong></td>
<td>Registration window and priority wave administration</td>
<td>P1</td>
</tr>
<tr>
<td><strong>FE-13</strong></td>
<td>Advising records and advising holds</td>
<td>P6</td>
</tr>
<tr>
<td><strong>FE-14</strong></td>
<td>Enrollment, capacity and workload reporting</td>
<td>P5, all</td>
</tr>
</tbody>
</table>
<h3>2.2 Scope of Initial Release (Release 1.0)</h3>
<p>Release 1.0 targets <strong>BO-1, BO-2, BO-3 and BO-4</strong> — the registration window itself and
the three checks that sit behind it. It must be live for a full registration window.</p>
<p>Included: <strong>FE-1, FE-2, FE-3, FE-4, FE-5, FE-6, FE-7, FE-8, FE-12</strong>.</p>
<p>Scope boundaries for Release 1.0:
- All six faculties from day one. Registration cannot be piloted on part of the student body, because sections are shared across faculties.
- Degree audit (FE-9) is <strong>not</strong> included; prerequisite checking (FE-4) is, and the two use the same curriculum rules, so FE-9 becomes largely configuration in 1.1.
- Financial eligibility uses whichever interface the vendor makes available (RI-1).</p>
<h3>2.3 Scope of Subsequent Releases</h3>
<table>
<thead>
<tr>
<th>Release</th>
<th>Target</th>
<th>Contents</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>1.1</strong></td>
<td>+1 semester</td>
<td><strong>FE-9</strong> real-time degree audit and <strong>FE-10</strong> account balance view. Delivers BO-6.</td>
</tr>
<tr>
<td><strong>1.2</strong></td>
<td>+2 semesters</td>
<td><strong>FE-11</strong> under-enrolled section detection and cancellation; <strong>FE-13</strong> advising records and holds. Delivers BO-5.</td>
</tr>
<tr>
<td><strong>2.0</strong></td>
<td>+3 semesters</td>
<td><strong>FE-14</strong> reporting and analytics; graduation application; transcript issuance; programme-change workflow.</td>
</tr>
</tbody>
</table>
<h3>2.4 Limitations and Exclusions</h3>
<ul>
<li><strong>EX-1</strong> CARS does not replace the learning management system. Course content, assignments and grades entered by lecturers remain there; CARS consumes final grades.</li>
<li><strong>EX-2</strong> CARS does not replace the finance/bursar system. It reads eligibility and does not process payments, refunds or scholarships.</li>
<li><strong>EX-3</strong> CARS does not build timetables or allocate rooms. It consumes the published timetable.</li>
<li><strong>EX-4</strong> CARS does not manage admissions or applicant records. A student exists in CARS from matriculation.</li>
<li><strong>EX-5</strong> CARS does not manage staff HR records, workload contracts or payroll.</li>
<li><strong>EX-6</strong> CARS does not issue official transcripts or degree certificates in releases 1.0–1.2.</li>
<li><strong>EX-7</strong> CARS does not support registration by proxy — a staff member registering on a student's behalf — except through the documented override path.</li>
<li><strong>EX-8</strong> CARS does not replace the university SSO or maintain its own student password store.</li>
</ul>
<hr />
<h3>3. Business Context</h3>
<h3>3.1 Stakeholder Profiles</h3>
<table>
<thead>
<tr>
<th>Stakeholder</th>
<th>Major Value</th>
<th>Attitudes</th>
<th>Major Interests</th>
<th>Constraints</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Vice-Rector, Academic Affairs</strong> (sponsor)</td>
<td>No further registration failures reaching the Rector</td>
<td>Strongly supportive; owns the business case</td>
<td>BO-1 above all; a visible, outage-free window</td>
<td>Maximum budget USD 950,000; must be live for the Semester 1 window</td>
</tr>
<tr>
<td><strong>Registrar</strong></td>
<td>Academic rules enforced consistently instead of by memory</td>
<td>Supportive but protective of academic discretion</td>
<td>Every automated decision must be overridable and auditable</td>
<td>Cannot change university academic regulations to suit the software</td>
</tr>
<tr>
<td><strong>Academic Office Staff</strong> (14 users)</td>
<td>640 hours a semester of manual checking disappears</td>
<td>Cautious — some fear the role shrinks with the workload</td>
<td>Exception handling must be genuinely easier, not just different</td>
<td>Peak-period overtime is already at its contractual limit</td>
</tr>
<tr>
<td><strong>Academic Advisor</strong> (~40 users)</td>
<td>Students arrive having already seen their own degree audit</td>
<td>Very receptive; the most enthusiastic class</td>
<td>Accuracy of the audit; ability to record advice and place holds</td>
<td>Deferred to Release 1.1; needs a read-only view in 1.0</td>
</tr>
<tr>
<td><strong>Department Head</strong> (6 users)</td>
<td>Override decisions arrive in one queue instead of a mail thread</td>
<td>Mixed — welcomes visibility, resists a 48-hour SLA</td>
<td>Section capacity and workload impact of each decision</td>
<td>Teaching load leaves limited time; the SLA depends on university policy (D2)</td>
</tr>
<tr>
<td><strong>Student</strong> (12,000)</td>
<td>Registration that works, and knowing where they stand</td>
<td>Currently dissatisfied and vocal</td>
<td>Speed and fairness of the window; accurate degree audit</td>
<td>Represented by the Student Union as product champion</td>
</tr>
<tr>
<td><strong>Finance Officer</strong> (3 users)</td>
<td>Two weeks a semester of re-keying disappears</td>
<td>Supportive but sceptical the vendor will cooperate</td>
<td>Correctness of the eligibility rule; a clear audit trail</td>
<td>Bound by the finance system vendor contract (RI-1)</td>
</tr>
<tr>
<td><strong>IT Operations</strong></td>
<td>One supported platform instead of a fourteen-year-old one</td>
<td>Neutral; concerned about the load profile</td>
<td>Monitoring, capacity, deployment and data retention</td>
<td>Must run within the existing university data centre and security policy</td>
</tr>
</tbody>
</table>
<h3>3.2 Project Priorities</h3>
<table>
<thead>
<tr>
<th>Dimension</th>
<th>Driver (state objective)</th>
<th>Constraint (state limits)</th>
<th>Degree of Freedom (state allowable range)</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Schedule</strong></td>
<td>Release 1.0 live for the <strong>Semester 1 registration window</strong></td>
<td>The academic calendar is fixed by Ministry regulation and will not move</td>
<td>—</td>
</tr>
<tr>
<td><strong>Features</strong></td>
<td>—</td>
<td>FE-1 … FE-8 and FE-12 are mandatory for Release 1.0</td>
<td>FE-7 waitlist may ship in a reduced form if the schedule is at risk</td>
</tr>
<tr>
<td><strong>Quality</strong></td>
<td><strong>Zero registration outages</strong> is the acceptance criterion for the business case</td>
<td>No incorrect enrollment may be permitted by an automated decision</td>
<td>90–95% of user acceptance tests must pass for Release 1.0</td>
</tr>
<tr>
<td><strong>Staff</strong></td>
<td>—</td>
<td>Maximum team size is 1 PM, 3 BAs, 10 developers, 4 testers</td>
<td>BA count may vary between 2 and 3 during requirements work</td>
</tr>
<tr>
<td><strong>Cost</strong></td>
<td>—</td>
<td>Total project budget USD 950,000</td>
<td>Budget overrun up to 10% acceptable without sponsor review</td>
</tr>
</tbody>
</table>
<h3>3.3 Deployment Considerations</h3>
<ul>
<li><strong>Environment.</strong> CARS is deployed into the existing university data centre, with capacity provisioned for the registration peak rather than the average — the load profile is extreme and brief, and sizing for the average is what broke the legacy system.</li>
<li><strong>Rollout strategy.</strong> Unlike a warehouse or a store network, registration <strong>cannot be piloted on part of the population</strong>: sections are shared across faculties, so a partial rollout would split the same section's capacity across two systems. Release 1.0 therefore goes live for all 12,000 students in one window. The risk this creates is managed by the parallel-window rehearsal below, not by phasing.</li>
<li><strong>Rehearsal.</strong> A full-scale mock registration window is run with volunteer students two weeks before the live window, at 1.5× expected peak load. This is a release gate, not a test.</li>
<li><strong>Cutover window.</strong> The legacy system is frozen for the 48 hours before the window opens. Enrollment data is migrated and verified against control totals before the freeze is lifted.</li>
<li><strong>Data migration.</strong> Student records, transcripts from 2019 onward, curriculum rules and section catalog are migrated. Pre-2019 transcripts are migrated read-only and flagged, because assumption A3 does not cover them.</li>
<li><strong>Training.</strong> Students receive no training — a registration system that needs training has failed. Academic office staff and department heads receive a half-day workshop per faculty before the first window.</li>
<li><strong>Support.</strong> Extended on-call covering the full 72-hour window, with the academic office staffed throughout and a documented manual fallback for a single enrollment.</li>
<li><strong>Back-out plan.</strong> The legacy system remains readable and can accept manual enrollments for the duration of the first window. It is decommissioned only after one complete, successful window.</li>
</ul>`,
  ].join('\n'),
};

const TP1L2 = {
  title: "W1.2 — Deliverable 2: 14 use case specifications (full)|||W1.2 — Deliverable 2: 14 đặc tả use case (đầy đủ)",
  slug: "swr302-tp1-goi-02-use-cases",
  type: 'DOCUMENT',
  description: "Trọn 14 đặc tả use case theo template 15 dòng của Chapter 8, cộng bảng actor, danh sách use case và bảng quan hệ include/extend. UC-03 có tới 7 ngoại lệ — nhiều nhất trong cả hai bộ tài liệu mẫu.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP1 · Deliverable 2</span>
<h2>Fourteen use cases, and one that carries the whole system</h2>
<p class="lead">Read <strong>UC-03 Register for a course section</strong> first. It has <strong>seven exceptions</strong> — more than any use case in either worked package — and that is not padding. Seven independent things can refuse an enrollment, and the brief's central complaint is that the legacy system checked none of them at the moment the student clicked.</p>
<p>Three details a grader looks for, all visible in UC-03:</p>
<ul>
<li><strong>POST-1 forbids a half-finished state.</strong> "The student is enrolled and a seat is consumed, <em>or</em> no state has changed at all." Seven checks and a capacity claim must succeed or fail together.</li>
<li><strong>Exception 3.0.E6 states a policy, not a mechanism.</strong> When the finance system does not answer, CARS <em>refuses</em> rather than assuming eligibility — a decision taken with the Finance Officer, recorded in Other Information with the reason.</li>
<li><strong>Frequency of use is a real number.</strong> 67,000 enrollments a semester, 85% inside 72 hours, bursts of ~180 attempts per second. That number is what later justifies the performance quality attributes in the SRS.</li>
</ul>
<div class="callout ok"><strong>Also worth reading: UC-07, flow 7.4 and exception 7.0.E3.</strong> A waitlisted student who is temporarily ineligible keeps their queue position, and a seat declined for a timetable clash is held for one hour before passing on. Neither rule is obvious; both came from the Student Union representative, and together they are what makes a waitlist <em>fair</em> rather than merely automatic.</div>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP1 · Deliverable 2</span>
<h2>Mười bốn use case, và một cái gánh cả hệ thống</h2>
<p class="lead">Hãy đọc <strong>UC-03 Đăng ký lớp học phần</strong> trước. Nó có <strong>bảy ngoại lệ</strong> — nhiều hơn mọi use case trong cả hai bộ tài liệu mẫu — và đó không phải độn thêm. Có bảy thứ độc lập có thể từ chối một lượt ghi danh, mà than phiền trung tâm của đề bài chính là hệ thống cũ không kiểm cái nào ngay lúc sinh viên bấm.</p>
<p>Ba chi tiết người chấm tìm, đều thấy được trong UC-03:</p>
<ul>
<li><strong>POST-1 cấm trạng thái dở dang.</strong> "Sinh viên được ghi danh và một chỗ bị chiếm, <em>hoặc</em> không có gì thay đổi." Bảy phép kiểm và một lượt chiếm chỗ phải cùng thành công hoặc cùng thất bại.</li>
<li><strong>Ngoại lệ 3.0.E6 phát biểu một CHÍNH SÁCH, không phải một cơ chế.</strong> Khi hệ thống tài chính không trả lời, CARS <em>từ chối</em> chứ không giả định là đủ điều kiện — quyết định này lấy từ Cán bộ Tài chính, và được ghi kèm lý do ở mục Other Information.</li>
<li><strong>Tần suất dùng là con số thật.</strong> 67.000 lượt ghi danh mỗi kỳ, 85% nằm trong 72 giờ, có lúc bùng lên ~180 lượt/giây. Chính con số đó sau này biện minh cho các thuộc tính chất lượng về hiệu năng trong SRS.</li>
</ul>
<div class="callout ok"><strong>Cũng đáng đọc: UC-07, luồng 7.4 và ngoại lệ 7.0.E3.</strong> Sinh viên trong danh sách chờ tạm thời không đủ điều kiện thì vẫn GIỮ vị trí, và một chỗ bị từ chối vì trùng giờ sẽ được giữ lại một tiếng trước khi chuyển cho người kế. Cả hai luật đều không hiển nhiên; cả hai đều đến từ đại diện Hội sinh viên, và cùng nhau chúng làm danh sách chờ trở nên <em>công bằng</em> chứ không chỉ là tự động.</div>`,
    ),
    `<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/SWR302/v1/assignment-tp1/001.webp" alt="📐 Figure B-3 — CARS use case diagram · 14 use cases · 12 actors · 5 «include» · 3 «extend»" loading="lazy" width="1620" height="1020" /><p class="chu-thich">📐 <strong>Figure B-3</strong> — CARS use case diagram · 14 use cases · 12 actors · 5 «include» · 3 «extend»</p></div>`,
    `<h2>Use Cases</h2>
<h2>for the Campus Academic and Registration System (CARS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Team Leader name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Northern Regional University (NRU)
17 September 2026</p>
<hr />
<h3>Revision History</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Date</th>
<th>Reason For Changes</th>
<th>Version</th>
</tr>
</thead>
<tbody>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Initial use case list from elicitation sessions 1–3</td>
<td>0.9</td>
</tr>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>All 14 specifications completed and cross-reviewed</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Actors</h3>
<h3>1.1 Primary actors</h3>
<table>
<thead>
<tr>
<th>Actor</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Student</strong></td>
<td>12,000 users. Plans a schedule, registers, drops, requests overrides, views their own degree audit and balance.</td>
</tr>
<tr>
<td><strong>Academic Advisor</strong></td>
<td>~40 users. Advises students, records advice, places and lifts advising holds.</td>
</tr>
<tr>
<td><strong>Academic Office Staff</strong></td>
<td>14 users. Handles enrollment exceptions the automated rules could not resolve.</td>
</tr>
<tr>
<td><strong>Department Head</strong></td>
<td>6 users. Decides capacity overrides for their department's sections; cancels under-enrolled sections.</td>
</tr>
<tr>
<td><strong>Registrar</strong></td>
<td>2 users. Opens, extends and closes registration windows; owns academic regulation configuration.</td>
</tr>
<tr>
<td><strong>Finance Officer</strong></td>
<td>3 users. Reviews and resolves finance holds raised at registration.</td>
</tr>
<tr>
<td><strong>System Administrator</strong></td>
<td>2 users. Configures curriculum rules, programmes, credit limits and integrations.</td>
</tr>
</tbody>
</table>
<h3>1.2 Secondary actors (external systems)</h3>
<table>
<thead>
<tr>
<th>Actor</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Finance / Bursar System</strong></td>
<td>Holds each student's balance and payment history. Read-only from CARS (EX-2).</td>
</tr>
<tr>
<td><strong>University SSO</strong></td>
<td>Authenticates every user. CARS holds no student password (EX-8).</td>
</tr>
<tr>
<td><strong>Timetable System</strong></td>
<td>Publishes when and where each section meets. CARS consumes it and never edits it (EX-3).</td>
</tr>
<tr>
<td><strong>Learning Management System</strong></td>
<td>Receives confirmed enrollments; supplies final grades back to the transcript.</td>
</tr>
<tr>
<td><strong>Notification Service</strong></td>
<td>Sends email and SMS to students and staff on behalf of CARS.</td>
</tr>
</tbody>
</table>
<div class="callout">
<p><strong>Why the student information system of record is not listed as an actor.</strong> CARS
<em>becomes</em> that system at cutover; it is not an external party. Legacy data is a
one-time migration described in Vision &amp; Scope §3.3, not a runtime interface, and it
therefore appears in SRS §4.4 rather than here.</p>
</div>
<hr />
<h3>2. Use Case List</h3>
<table>
<thead>
<tr>
<th>ID</th>
<th>Primary Actor</th>
<th>Secondary Actor</th>
<th>Use Case name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>UC-01</td>
<td>Student</td>
<td>Timetable System</td>
<td>Search and browse the course catalog</td>
<td>Find sections by course, faculty, time or lecturer, with live remaining capacity</td>
</tr>
<tr>
<td>UC-02</td>
<td>Student</td>
<td>—</td>
<td>Build a planned schedule</td>
<td>Assemble a provisional timetable before the window opens, with conflicts flagged</td>
</tr>
<tr>
<td>UC-03</td>
<td>Student</td>
<td>Finance System</td>
<td>Register for a course section</td>
<td>The single enrollment transaction — prerequisite, capacity, conflict and finance decided at once</td>
</tr>
<tr>
<td>UC-04</td>
<td>CARS (event)</td>
<td>—</td>
<td>Validate prerequisites and co-requisites</td>
<td>Evaluate a student's transcript against the curriculum rules for a course</td>
</tr>
<tr>
<td>UC-05</td>
<td>CARS (event)</td>
<td>Finance System</td>
<td>Evaluate financial eligibility</td>
<td>Decide whether a student's financial standing permits enrollment</td>
</tr>
<tr>
<td>UC-06</td>
<td>Student → Department Head</td>
<td>Notification Service</td>
<td>Request and decide a capacity override</td>
<td>A tracked request-and-decision workflow with a 48-hour deadline</td>
</tr>
<tr>
<td>UC-07</td>
<td>Student</td>
<td>Notification Service</td>
<td>Join and be promoted from a waitlist</td>
<td>Queue for a full section and be offered a seat automatically when one is released</td>
</tr>
<tr>
<td>UC-08</td>
<td>Student</td>
<td>—</td>
<td>Drop or swap a section</td>
<td>Leave a section, or exchange one for another atomically, inside the add/drop period</td>
</tr>
<tr>
<td>UC-09</td>
<td>Student</td>
<td>—</td>
<td>View the real-time degree audit</td>
<td>See which programme requirements are met, in progress and outstanding</td>
</tr>
<tr>
<td>UC-10</td>
<td>Student</td>
<td>Finance System</td>
<td>View account balance and payment history</td>
<td>See what is owed and what has been paid, without contacting the office</td>
</tr>
<tr>
<td>UC-11</td>
<td>Department Head</td>
<td>Notification Service</td>
<td>Identify and cancel an under-enrolled section</td>
<td>Detect sections below minimum viable enrollment and cancel them in time</td>
</tr>
<tr>
<td>UC-12</td>
<td>Registrar</td>
<td>—</td>
<td>Open, extend or close a registration window</td>
<td>Control the window and its priority waves</td>
</tr>
<tr>
<td>UC-13</td>
<td>Academic Advisor</td>
<td>—</td>
<td>Advise a student and manage an advising hold</td>
<td>Record advice; place or lift a hold that blocks enrollment</td>
</tr>
<tr>
<td>UC-14</td>
<td>Registrar</td>
<td>—</td>
<td>Produce enrollment and capacity reports</td>
<td>Report on enrollment, capacity utilisation and override activity</td>
</tr>
</tbody>
</table>
<div class="callout">
<p><strong>Traceability to Vision &amp; Scope features:</strong> UC-01→FE-1 · UC-02→FE-2 · UC-03→FE-3 · UC-04→FE-4 · UC-05→FE-5 · UC-06→FE-6 · UC-07→FE-7 · UC-08→FE-8 · UC-09→FE-9 · UC-10→FE-10 · UC-11→FE-11 · UC-12→FE-12 · UC-13→FE-13 · UC-14→FE-14</p>
</div>
<hr />
<h3>3. Use Case Specifications</h3>
<h3>UC-01 — Search and browse the course catalog</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-01 — Search and browse the course catalog</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Student</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>The student opens the catalog, from the portal or from the planner in UC-02.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>A student finds the sections available to them in the coming semester, filtered by course, faculty, meeting time, lecturer or remaining capacity. The catalog is by far the highest-volume read in the system and most of the registration-window load lands here rather than on enrollment itself.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The student is authenticated through the university SSO. <br> PRE-2: A section catalog has been published for the semester being browsed.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: No enrollment state is changed by browsing. <br> POST-2: Remaining capacity shown is computed at read time per BR-03, not cached beyond 60 seconds.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>1.0</strong> <br> 1. The student opens the catalog for the current registration semester. <br> 2. The system displays the sections the student's programme permits, with course code, title, credits, lecturer, meeting pattern and remaining capacity. <br> 3. The student applies filters — faculty, day, time, remaining capacity greater than zero, keyword. <br> 4. The system returns the filtered sections. <br> 5. The student opens a section to see its prerequisites, co-requisites and full description.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>1.1 — Browse before a window is open.</strong> The catalog is browsable at any time; the system marks each section "registration opens &lt;date&gt;" rather than offering an enroll action. <br> <strong>1.2 — Browse another programme's courses.</strong> The student removes the programme filter; the system shows all sections but marks those outside their programme as ineligible with the reason. <br> <strong>1.3 — Search by lecturer.</strong> The student searches by lecturer name and the system returns that lecturer's sections.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>1.0.E1 — Timetable not yet published.</strong> At step 2 the timetable system has no meeting pattern for a section. The system lists the section with "times to be confirmed" and permits planning but not enrollment. <br> <strong>1.0.E2 — Catalog unavailable.</strong> The catalog service does not respond. The system presents a cached catalog no older than 15 minutes, marked with its age, rather than an error page. <br> <strong>1.0.E3 — Search returns nothing.</strong> The system states which filter excluded everything and offers to relax it, rather than showing an empty list.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>Extreme and concentrated: ~12,000 students, an average of 40 catalog reads each during the 72-hour window, with ~65% in the first 30 minutes of each of the three waves. Peak ~2,800 reads/second.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-03, BR-06</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>This use case, not UC-03, is what determines whether the system survives the window (objective BO-1). The legacy system failed here: it recomputed capacity per row per request. POST-2 permits a short cache precisely so that capacity can be read cheaply without being wrong enough to matter.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>The timetable system publishes the complete section catalog at least 14 days before a window opens.</td>
</tr>
</tbody>
</table>
<h3>UC-02 — Build a planned schedule</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-02 — Build a planned schedule</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Student</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>The student adds a section to their plan from the catalog.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Before the window opens, the student assembles a provisional timetable and the system tells them, in advance, everything that would block it — time conflicts, missing prerequisites, credit limit, holds. <strong>This is the principal defence against the load problem P1:</strong> a student who has planned needs seconds inside the window, not minutes.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The student is authenticated. <br> PRE-2: A section catalog has been published for the semester.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: The plan holds no seats and confers no priority — it is provisional and the system says so. <br> POST-2: Every blocking condition detectable before the window is shown against the plan.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>2.0</strong> <br> 1. The student adds a section to the plan. <br> 2. The system checks the plan for meeting-time conflicts (BR-07) and marks any it finds. <br> 3. The system evaluates prerequisites for each planned section via UC-04 and marks any unmet. <br> 4. The system totals planned credits and compares them with the student's credit limit (BR-04). <br> 5. The system displays the plan as a weekly grid with every warning attached to the section that caused it. <br> 6. The student adjusts the plan and repeats from step 1.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>2.1 — Alternatives for a section.</strong> The student asks for other sections of the same course; the system lists them with conflict and capacity status, so a fallback is ready before the window. <br> <strong>2.2 — Multiple saved plans.</strong> The student saves up to three named plans and compares them side by side. <br> <strong>2.3 — Register the whole plan.</strong> When the window opens, the student submits the plan; the system executes UC-03 for each section in the student's chosen order and reports the outcome per section.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>2.0.E1 — Planned section is cancelled.</strong> A planned section is cancelled before the window opens. The system marks it in the plan and suggests alternatives; it does not silently remove it. <br> <strong>2.0.E2 — Prerequisite becomes unmet.</strong> A grade posted after planning turns a met prerequisite into an unmet one. The system re-evaluates on plan open and marks it. <br> <strong>2.0.E3 — Credit limit exceeded.</strong> The plan exceeds the limit (BR-04). The system permits the plan to be saved but marks it un-registerable and states by how many credits.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>~9,000 students build at least one plan per semester; ~2.4 plan edits each. Load is spread over the two weeks before the window, which is the point.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-02, BR-04, BR-07, BR-14, BR-20</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>POST-1 is a requirement, not a disclaimer. In elicitation session 2 the Registrar was explicit that a plan must confer no advantage, or students will treat planning as a queue and the fairness of the priority wave system (BR-06) collapses.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Students will plan in advance if the tool is useful; the 2019 online move showed they do when given one.</td>
</tr>
</tbody>
</table>
<h3>UC-03 — Register for a course section</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-03 — Register for a course section</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Student</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>The student requests enrollment in a section during their open registration wave.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>The core transaction of the whole system. Prerequisite, co-requisite, capacity, time conflict, credit limit, advising hold and financial standing are all evaluated <strong>as one decision at the moment the student clicks</strong>, and the student is told the answer immediately. This replaces a process in which the student was enrolled first and the checks happened afterwards, by hand, sometimes weeks later.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The student is authenticated and their priority wave is open (BR-06). <br> PRE-2: The section exists and belongs to the open semester. <br> PRE-3: The student is not already enrolled in this section (BR-01).</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: The student is enrolled in the section and a seat is consumed, <strong>or</strong> no state has changed at all. A partially applied enrollment is never left behind. <br> POST-2: The decision, its reason and every rule evaluated are recorded against the attempt, whether it succeeded or failed. <br> POST-3: On success, the enrollment is published to the learning management system.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>3.0</strong> <br> 1. The student requests enrollment in a section. <br> 2. The system verifies the student's wave is open (BR-06) and no advising hold is active (BR-14). <br> 3. The system evaluates prerequisites and co-requisites via UC-04. <br> 4. The system evaluates financial eligibility via UC-05. <br> 5. The system checks for a meeting-time conflict with the student's existing enrollments (BR-07). <br> 6. The system checks the resulting credit total against the credit limit (BR-04). <br> 7. The system claims a seat, provided remaining capacity is greater than zero (BR-03). <br> 8. The system records the enrollment, releases nothing, and confirms to the student. <br> 9. The system publishes the enrollment to the learning management system.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>3.1 — Section full, waitlist offered.</strong> At step 7 remaining capacity is zero. The system offers the waitlist and, if accepted, executes UC-07 instead of enrolling. <br> <strong>3.2 — Section full, override offered.</strong> At step 7 remaining capacity is zero and the course permits overrides. The system offers to raise a capacity override request (UC-06). <br> <strong>3.3 — Co-requisite pair.</strong> The course has a co-requisite (BR-20). The system enrolls the student in both sections as a single transaction, or in neither. <br> <strong>3.4 — Staff-assisted enrollment.</strong> Academic Office Staff perform the enrollment on the student's behalf after resolving an exception, with a recorded reason.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>3.0.E1 — Prerequisite not met.</strong> At step 3 a prerequisite is unmet (BR-02). The system refuses, names the specific course and the grade required, and offers to raise an override request. No seat is claimed. <br> <strong>3.0.E2 — Financial hold.</strong> At step 4 the student's balance exceeds the threshold (BR-05). The system refuses, states the amount outstanding, and directs the student to UC-10. It does not reveal payment detail beyond the balance. <br> <strong>3.0.E3 — Time conflict.</strong> At step 5 the section overlaps an existing enrollment (BR-07). The system refuses and names the conflicting section and the overlapping time. <br> <strong>3.0.E4 — Credit limit exceeded.</strong> At step 6 the enrollment would exceed the limit (BR-04). The system refuses and states the limit and the current total. <br> <strong>3.0.E5 — Seat lost to a concurrent request.</strong> At step 7 another student claims the last seat first. The system re-reads capacity, retries once, then offers the waitlist per 3.1. <strong>No seat is double-issued.</strong> <br> <strong>3.0.E6 — Finance system unavailable.</strong> At step 4 the finance system does not respond within 5 seconds. The system <strong>refuses the enrollment</strong> with a retry action rather than assuming eligibility, and raises an integration alert. <br> <strong>3.0.E7 — Advising hold active.</strong> At step 2 a hold is present (BR-14). The system refuses and names the advisor to contact.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>~12,000 students × ~5.6 sections = ~67,000 successful enrollments per semester, ~85% of them inside the 72-hour window, with peak bursts of ~180 enrollment attempts per second in the opening minute of each wave.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-01, BR-02, BR-03, BR-04, BR-05, BR-06, BR-07, BR-14, BR-20</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>POST-1 makes this the most demanding transaction in the system: seven independent checks and a capacity claim must succeed or fail together, under the load described above. Exception 3.0.E6 is a deliberate policy choice made with the Finance Officer in session 3 — CARS refuses rather than guesses, because a wrongly enrolled student with an unpaid balance is harder to unwind than a student asked to retry.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>The finance system can answer an eligibility query in under 5 seconds at peak; if not, RI-1's adapter design substitutes a nightly snapshot and the exception path changes accordingly.</td>
</tr>
</tbody>
</table>
<h3>UC-04 — Validate prerequisites and co-requisites</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-04 — Validate prerequisites and co-requisites</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>CARS (system, invoked)</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>Invoked by UC-02 during planning or UC-03 during enrollment; or run in bulk by staff to audit a cohort.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>The rule engine that replaces 640 staff-hours a semester. It evaluates a student's transcript against the curriculum rules attached to a course and returns a decision with a reason. It is deliberately a separate use case from UC-03 because it is invoked from four places and must behave identically in all of them.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: Curriculum rules exist for the course and have been validated by the faculty curriculum committee (dependency D3). <br> PRE-2: The student's transcript is available.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: The result is a decision of Met, Unmet or Indeterminate, never a silent pass. <br> POST-2: An Unmet result names the specific unsatisfied rule and the course that would satisfy it. <br> POST-3: An Indeterminate result — usually pre-2019 transcript data outside assumption A3 — is routed to Academic Office Staff rather than resolved by guessing.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>4.0</strong> <br> 1. The system retrieves the curriculum rules attached to the course. <br> 2. The system retrieves the student's completed courses and grades. <br> 3. The system evaluates each prerequisite rule, including minimum grade where specified (BR-02). <br> 4. The system evaluates co-requisite rules against the student's in-progress and planned enrollments (BR-20). <br> 5. All rules are satisfied; the system returns Met.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>4.1 — In-progress prerequisite.</strong> A prerequisite is currently being taken and its grade is not yet posted. The system returns Met-Provisional, permits enrollment, and re-evaluates when the grade is posted. <br> <strong>4.2 — Equivalent course.</strong> The student passed a course mapped as equivalent to the prerequisite; the system accepts the equivalence and records which mapping was used. <br> <strong>4.3 — Transfer credit.</strong> The prerequisite was satisfied by credit transferred from another institution and already approved; the system accepts it. <br> <strong>4.4 — Bulk audit.</strong> Staff run the engine across a cohort to find enrollments that are no longer valid after grades were posted.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>4.0.E1 — No curriculum rules for the course.</strong> At step 1 the course has no rules. The system returns Indeterminate and raises a configuration alert — it does <strong>not</strong> return Met. An absent rule is a missing rule, not a permissive one. <br> <strong>4.0.E2 — Incomplete transcript.</strong> At step 2 the student's transcript predates 2019 and is flagged (A3). The system returns Indeterminate and routes to staff. <br> <strong>4.0.E3 — Provisional prerequisite fails.</strong> Under 4.1 the posted grade does not satisfy the rule. The system raises an enrollment-invalid exception for staff and notifies the student and their advisor <strong>before</strong> teaching starts where the calendar allows. <br> <strong>4.0.E4 — Circular co-requisite.</strong> Two courses list each other as prerequisites rather than co-requisites. The system returns Indeterminate and raises a configuration alert naming both courses.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>Invoked roughly 4× per enrollment attempt across planning and registration: ~600,000 evaluations per semester, peak ~700/second.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-02, BR-20</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>Exception 4.0.E1 is the single most important line in this specification. The legacy process treated "no rule found" as "no prerequisite", which is how 61 students entered courses they were not qualified for. Returning Indeterminate converts a silent wrong answer into a visible piece of work.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>At least 90% of programmes can be expressed as machine-evaluable rules (A2); the remainder are handled as Indeterminate by design, not by failure.</td>
</tr>
</tbody>
</table>
<h3>UC-05 — Evaluate financial eligibility</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-05 — Evaluate financial eligibility</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 3</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>CARS (system, invoked)</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>Invoked by UC-03 at enrollment; or by the nightly re-evaluation of existing enrollments.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Replaces three staff spending two weeks a semester exporting and matching payment data. CARS asks the finance system whether this student's standing permits enrollment, and acts on the answer immediately rather than weeks later.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The student exists in the finance system. <br> PRE-2: The eligibility threshold and any grace rules are configured (BR-05).</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: The result is Eligible, Blocked or Unknown — never silently Eligible. <br> POST-2: A Blocked result records the outstanding amount at the time of the decision. <br> POST-3: CARS stores no payment instrument or transaction detail (EX-2, SRS CO-4).</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>5.0</strong> <br> 1. The system requests the student's outstanding balance and hold status from the finance system. <br> 2. The finance system returns a balance and any explicit registration hold. <br> 3. The system compares the balance with the configured threshold (BR-05). <br> 4. The balance is within threshold and no hold exists; the system returns Eligible.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>5.1 — Approved payment plan.</strong> The finance system reports an active instalment plan in good standing; the system returns Eligible regardless of the balance. <br> <strong>5.2 — Scholarship pending.</strong> A scholarship is approved but not yet applied; the system returns Eligible and records that the balance is expected to reduce. <br> <strong>5.3 — Finance Officer override.</strong> A Finance Officer clears a block for a named student with a recorded reason and an expiry date. <br> <strong>5.4 — Nightly re-evaluation.</strong> The system re-evaluates enrolled students and raises a finance exception for any who have moved out of eligibility, rather than removing enrollments automatically.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>5.0.E1 — Balance exceeds threshold.</strong> The system returns Blocked with the amount outstanding. <br> <strong>5.0.E2 — Explicit registration hold.</strong> The finance system reports a hold irrespective of balance; the system returns Blocked with the hold reason. <br> <strong>5.0.E3 — Finance system unavailable.</strong> The system retries twice within 5 seconds, then returns <strong>Unknown</strong>, which UC-03 treats as a refusal with a retry action. It never assumes Eligible. <br> <strong>5.0.E4 — Student not found in finance system.</strong> The system returns Unknown and raises a data-quality exception for the Finance Officer — this usually means a matriculation record has not synchronised.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>Once per enrollment attempt (~90,000 per semester including refusals) plus a nightly batch across all enrolled students (~12,000).</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-05, BR-17</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>The distinction between Blocked and Unknown exists because they call for different responses: Blocked is the student's problem to resolve, Unknown is the university's. Collapsing them into one refusal would tell a student to pay a bill that may not exist. Flow 5.4 deliberately raises an exception instead of unenrolling — removing a student from classes because a payment slipped is a decision a person must make.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>The finance vendor exposes a balance-and-hold query (RI-1). If not, the adapter substitutes a nightly snapshot and 5.0.E3 becomes the normal case for same-day payments.</td>
</tr>
</tbody>
</table>
<h3>UC-06 — Request and decide a capacity override</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-06 — Request and decide a capacity override</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 3</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Student (requester), Department Head (decider)</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>A student requests a place in a section that is full, or whose prerequisite they do not meet.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Replaces an email thread that took 6 days on average and left no record. The request, its justification, the decision, the decider and the reason all live in one tracked workflow with a 48-hour deadline (BR-12).</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The student is authenticated and their wave is open. <br> PRE-2: The section permits overrides — some do not, by faculty policy. <br> PRE-3: The student has no undecided override request outstanding for the same section.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: Every request reaches a recorded decision of Approved, Declined or Expired — a request is never silently abandoned. <br> POST-2: An approved override results in an enrollment <strong>or</strong> in a recorded reason why it did not. <br> POST-3: The decider, the decision time and the reason are recorded for every outcome (audit requirement from the Registrar).</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>6.0</strong> <br> 1. The student selects the section and states the ground for the request — full section, unmet prerequisite, or timetable necessity — and gives a justification. <br> 2. The system records the request, timestamps it, and starts the 48-hour clock (BR-12). <br> 3. The system routes the request to the Department Head owning the section (BR-11) and notifies them. <br> 4. The Department Head opens the request and sees the student's transcript extract, the section's current enrollment against capacity, the room capacity, and any other pending requests for the same section. <br> 5. The Department Head approves, and records a reason. <br> 6. The system raises the section's effective capacity by one for this student only, and enrolls the student via UC-03 with the override applied. <br> 7. The system notifies the student of the outcome.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>6.1 — Decline.</strong> At step 5 the Department Head declines with a reason; the system notifies the student and offers the waitlist (UC-07) or alternative sections. <br> <strong>6.2 — Batch decision.</strong> Several requests exist for the same section; the Department Head sees them together with the cumulative capacity impact and decides them in one action. <br> <strong>6.3 — Delegate.</strong> The Department Head delegates the decision to a named deputy for a fixed period; the delegate's identity is recorded as the decider. <br> <strong>6.4 — Withdraw.</strong> The student withdraws the request before a decision; the system records it as Withdrawn and stops the clock.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>6.0.E1 — Deadline breached.</strong> 48 hours elapse without a decision (BR-12). The system escalates to the Registrar, marks the request Overdue, and continues to count. The request is <strong>not</strong> auto-approved and <strong>not</strong> auto-declined — both would remove the academic judgement the workflow exists to capture. <br> <strong>6.0.E2 — Approved but no longer enrollable.</strong> At step 6 the student has since acquired a time conflict or a finance hold. The system records the approval, does not enroll, notifies both parties with the specific blocker, and leaves the approval valid for 72 hours. <br> <strong>6.0.E3 — Room capacity exceeded.</strong> The approval would push enrollment past the physical room capacity from the timetable system. The system warns the Department Head <strong>before</strong> the decision is recorded and requires explicit confirmation. <br> <strong>6.0.E4 — Section cancelled while pending.</strong> The system closes the request as Void, notifies the student, and offers alternatives. <br> <strong>6.0.E5 — Window closed before enrollment.</strong> The approval arrives after the registration window has closed. The system routes the enrollment to Academic Office Staff to apply manually.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>~2,300 requests per semester, ~78% of them within the 72-hour window; peak ~90 requests/hour.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-02, BR-03, BR-11, BR-12</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>6.0.E1 was the hardest decision in elicitation. The Registrar wanted auto-approval on breach to guarantee the SLA; the Department Heads refused, on the ground that the software would then be granting academic exceptions nobody had agreed to. The resolution — escalate and keep counting — makes the breach visible to the person who owns the policy (dependency D2) without the system inventing an academic decision.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>A university policy setting the 48-hour SLA is signed before Release 1.0 (D2). Without it, BR-12 is a target with no authority behind it.</td>
</tr>
</tbody>
</table>
<h3>UC-07 — Join and be promoted from a waitlist</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-07 — Join and be promoted from a waitlist</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 3</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Student</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>A student joins the waitlist for a full section, or a seat is released in a section that has a waitlist.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>The fair alternative to an override: a queue that the system administers itself. When a seat is released, the first eligible student on the list is offered it automatically and has 24 hours to accept (BR-08, BR-09).</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The section is full (BR-03). <br> PRE-2: The student satisfies every enrollment rule except capacity — a student who cannot take the course must not occupy a queue position.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: A student holds at most one waitlist position per course. <br> POST-2: A released seat is offered to exactly one student at a time; two students are never offered the same seat. <br> POST-3: Queue position is determined by join time within priority wave and is never altered except by the rules stated here.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>7.0</strong> <br> 1. The student requests the waitlist for a full section. <br> 2. The system verifies every rule except capacity via UC-04 and UC-05. <br> 3. The system adds the student to the queue and states their position. <br> 4. A seat is released — by a drop (UC-08), a cancelled override or an administrative change. <br> 5. The system identifies the first student on the queue who still satisfies all rules. <br> 6. The system reserves the seat for that student and notifies them, starting the 24-hour offer clock (BR-09). <br> 7. The student accepts; the system enrolls them via UC-03 and removes them from the queue.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>7.1 — Decline the offer.</strong> The student declines; the system releases the seat immediately and offers it to the next eligible student. <br> <strong>7.2 — Leave the queue.</strong> The student leaves voluntarily; everyone behind moves up. <br> <strong>7.3 — Auto-accept.</strong> The student opted in to automatic acceptance when joining; the system enrolls them at step 6 without waiting and notifies them afterwards. <br> <strong>7.4 — Ineligible at promotion.</strong> At step 5 the next student now has a conflict or a hold; the system skips them <strong>without removing them from the queue</strong>, notifies them why they were skipped, and offers the seat to the next student.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>7.0.E1 — Offer expires.</strong> 24 hours pass without a response (BR-09). The system releases the seat, removes the student from the queue, and notifies them. <br> <strong>7.0.E2 — Seat lost between offer and acceptance.</strong> The section is cancelled, or capacity is reduced, while an offer is outstanding. The system voids the offer and notifies the student with the reason. <br> <strong>7.0.E3 — Time conflict at acceptance.</strong> The student accepts but has since enrolled in a conflicting section (BR-07). The system refuses, names the conflict, and offers the seat to the next student after 1 hour, giving the first student a chance to drop the conflict. <br> <strong>7.0.E4 — Registration window closes with offers outstanding.</strong> Outstanding offers remain valid for their full 24 hours; acceptances after the window are applied by the system, which records that they were post-window.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>Medium</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>~3,400 waitlist joins per semester across ~290 sections; ~1,100 promotions.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-03, BR-07, BR-08, BR-09</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>POST-2 and exception 7.0.E3 together are what make a waitlist fair rather than merely automatic. The one-hour pause in 7.0.E3 was requested by the Student Union representative in session 4: the common case is a student holding a placeholder section they intend to drop the moment their real choice comes through, and instantly passing the seat on punishes exactly the behaviour the waitlist is supposed to reward.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Students check university email at least daily during registration; the 24-hour window in BR-09 rests on this and is configurable if it proves wrong.</td>
</tr>
</tbody>
</table>
<h3>UC-08 — Drop or swap a section</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-08 — Drop or swap a section</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 3</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Student</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>The student drops an enrolled section, or exchanges one section for another.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Leaving a section releases a seat, which is what feeds the waitlist. A <strong>swap</strong> is the important case: dropping A and adding B as two separate actions can lose the seat in A without gaining B, which is exactly the trap students fall into during a 72-hour window.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The student is enrolled in the section. <br> PRE-2: The current date is within a period that permits the action (BR-16).</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: A swap either completes entirely or changes nothing — the student never ends with neither section. <br> POST-2: A released seat is offered to the waitlist within 60 seconds (BR-08). <br> POST-3: The drop is published to the learning management system and recorded against the transcript according to the period in which it occurred (BR-16).</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>8.0</strong> <br> 1. The student selects an enrolled section and chooses Drop. <br> 2. The system states the consequence for the current period — no record, or a recorded withdrawal (BR-16) — and asks for confirmation. <br> 3. The student confirms. <br> 4. The system removes the enrollment and releases the seat. <br> 5. The system triggers the waitlist promotion in UC-07. <br> 6. The system publishes the change to the learning management system.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>8.1 — Swap.</strong> The student selects an enrolled section and a replacement. The system validates the replacement fully (UC-04, UC-05, BR-07, BR-04) <strong>before</strong> releasing the original seat, then performs both operations as one transaction. If the replacement fails validation, the original enrollment is untouched. <br> <strong>8.2 — Drop a co-requisite pair.</strong> Dropping one half of a co-requisite pair (BR-20) drops both; the system says so before confirmation. <br> <strong>8.3 — Staff-assisted drop.</strong> Academic Office Staff drop a student after the period closes, with a recorded reason and authority.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>8.0.E1 — Outside the permitted period.</strong> The add/drop period has closed (BR-16). The system refuses and explains the withdrawal process, which is outside CARS in releases 1.0–1.2. <br> <strong>8.0.E2 — Swap target became unavailable.</strong> In flow 8.1 the replacement section fills between validation and the transaction. The system abandons the swap, leaves the original enrollment intact, and offers the waitlist for the target. <br> <strong>8.0.E3 — Drop would break a co-requisite.</strong> The student drops one half and declines to drop the other. The system refuses and explains BR-20. <br> <strong>8.0.E4 — Drop would leave the student below minimum enrolled credits.</strong> The system warns, names the consequence for scholarship or visa status where flagged, and requires explicit confirmation. It does not refuse — that is the student's decision to make.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>~18,000 drops and ~7,000 swaps per semester; ~60% inside the 72-hour window.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-04, BR-07, BR-08, BR-16, BR-20</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>Flow 8.1 exists because of a specific complaint recorded in session 1: under the legacy system a student had to drop before adding, and during a busy window the seat they wanted was routinely taken in the seconds between. Making swap atomic is the single most requested change from the Student Union.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>The academic calendar defines add/drop and withdrawal periods per semester and is configured before a window opens.</td>
</tr>
</tbody>
</table>
<h3>UC-09 — View the real-time degree audit</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-09 — View the real-time degree audit</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Student</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>The student opens their degree audit, or an advisor opens a student's audit from the advising record.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Shows every requirement of the student's programme as Satisfied, In Progress or Outstanding, computed from the same curriculum rules the enrollment engine uses. <strong>This is the use case that removes ~4,800 advising enquiries a semester</strong> (objective BO-6), and it is the most complex read model in the system.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The viewer is authenticated and is either the student themselves or an advisor assigned to them. <br> PRE-2: The student's programme has validated curriculum rules (D3).</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: The audit reflects enrollments and grades as of the moment it is viewed; nothing is served from a cache older than 5 minutes. <br> POST-2: Every requirement shown states which specific courses satisfied it. <br> POST-3: A requirement the engine cannot evaluate is shown as <strong>Needs review</strong> with the reason, never as Satisfied or Outstanding.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>9.0</strong> <br> 1. The viewer opens the audit. <br> 2. The system retrieves the student's programme and its requirement groups — core, major, elective, general education, credit total. <br> 3. The system evaluates each group against completed courses, in-progress enrollments and approved transfer credit. <br> 4. The system computes overall completion (BR-13). <br> 5. The system displays each group with its status, the courses that satisfied it, and what remains. <br> 6. The system displays remaining credits and the expected graduation semester.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>9.1 — What-if planning.</strong> The student adds a prospective course; the system re-evaluates and shows which requirements it would satisfy, <strong>without changing any state</strong>. <br> <strong>9.2 — What-if programme change.</strong> The student selects another programme; the system evaluates their existing record against that programme's rules and shows the gap. <br> <strong>9.3 — Advisor view.</strong> An advisor sees the same audit plus advising notes and hold status, and can export it for a meeting. <br> <strong>9.4 — Include planned sections.</strong> The student includes their UC-02 plan; the system marks which requirements the plan would advance.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>9.0.E1 — Requirement cannot be evaluated.</strong> A rule references a course that no longer exists, or the student's record predates 2019 (A3). The system shows <strong>Needs review</strong> with the reason and offers to contact an advisor. It never guesses. <br> <strong>9.0.E2 — Programme rules changed mid-degree.</strong> The student's catalog-year rules differ from the current ones. The system evaluates against the <strong>catalog year the student matriculated under</strong> and states which year it used. <br> <strong>9.0.E3 — Grade under appeal.</strong> A grade is provisional pending appeal. The system evaluates using the current grade, marks the affected requirement as provisional, and names the course. <br> <strong>9.0.E4 — Audit computation exceeds its time budget.</strong> The system shows the requirement groups that completed and marks the rest as pending with a retry, rather than failing the whole page.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>Medium — deferred to Release 1.1</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>Assumed 70% of students view it twice per semester, plus advisor views: ~19,000 views per semester, concentrated before registration windows.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-02, BR-13, BR-18, BR-20</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>POST-3 and exception 9.0.E1 exist because a <em>wrong</em> degree audit is worse than none: a student who is told they have satisfied a requirement they have not is the exact failure that produced the complaint to the Rector described in Vision &amp; Scope §1.1. Exception 9.0.E2 — evaluating against the matriculation catalog year — is a university regulation, not a design preference.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Curriculum rules are versioned by catalog year and the student's catalog year is recorded.</td>
</tr>
</tbody>
</table>
<h3>UC-10 — View account balance and payment history</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-10 — View account balance and payment history</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Student</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>The student opens their account view, or follows the link from a refused enrollment (UC-03 exception 3.0.E2).</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Shows what the student owes, what they have paid, and what any current block means — the other half of objective BO-6. CARS displays this data; it does not own it and does not take payment (EX-2).</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The viewer is authenticated and is the student themselves. <br> PRE-2: The student exists in the finance system.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: No student sees another student's financial data. <br> POST-2: CARS stores no payment instrument detail. <br> POST-3: Every figure displays the time it was retrieved from the finance system.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>10.0</strong> <br> 1. The student opens the account view. <br> 2. The system requests the balance, charges and payment history from the finance system. <br> 3. The system displays the current balance, the charges making it up, payments received, and the registration eligibility threshold (BR-05). <br> 4. If a block is active, the system states the amount that must be paid to clear it. <br> 5. The system links to the university payment channel, which is outside CARS.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>10.1 — Instalment plan.</strong> An active plan exists; the system shows the schedule and the next due date. <br> <strong>10.2 — Scholarship applied.</strong> A scholarship reduces the balance; the system shows it as a distinct line. <br> <strong>10.3 — Estimate for a planned schedule.</strong> The student asks what their UC-02 plan would cost; the system computes it per BR-17 and labels it an <strong>estimate</strong>, not a charge.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>10.0.E1 — Finance system unavailable.</strong> The system shows the last retrieved figures with their timestamp and an explicit note that they may be out of date. It does not show a blank page and does not show a zero balance. <br> <strong>10.0.E2 — Student not found in the finance system.</strong> The system says the account could not be retrieved and gives the Finance Office contact; it raises a data-quality exception rather than showing a zero balance. <br> <strong>10.0.E3 — Balance disputed.</strong> A dispute is flagged; the system shows the disputed amount separately and states that the block remains until resolved.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>Medium — deferred to Release 1.1</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>~12,000 students × ~3 views per semester, spiking after each enrollment refusal for a finance hold.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-05, BR-17</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>Exception 10.0.E1 is the same principle as UC-09 POST-3: showing a stale figure with its age is honest, showing zero is a lie that will generate the phone call this feature exists to prevent.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>The finance system exposes charges and payments, not only a net balance; otherwise flow 10.1 and 10.2 degrade to a single figure.</td>
</tr>
</tbody>
</table>
<h3>UC-11 — Identify and cancel an under-enrolled section</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-11 — Identify and cancel an under-enrolled section</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 3</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Department Head</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>The scheduled under-enrolment check runs, or a Department Head opens the section viability view.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Finds sections that will not reach minimum viable enrollment <strong>before</strong> the add/drop period opens, so that affected students can rebuild a timetable rather than discover the cancellation nine days into it.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The user holds the Department Head role for the section's department, or the Registrar role. <br> PRE-2: A minimum viable enrollment is configured for the section or inherited from its faculty (BR-15).</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: A cancelled section has every enrolled student notified and every seat released, or the cancellation does not complete (BR-19). <br> POST-2: The cancellation records who decided it, when and why. <br> POST-3: A cancelled section is removed from the catalog and from every student plan that referenced it.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>11.0</strong> <br> 1. The system evaluates every section against its minimum viable enrollment 7 days before add/drop opens (BR-10, BR-15). <br> 2. The system lists flagged sections for the Department Head with current enrollment, minimum, waitlist depth and the lecturer. <br> 3. The Department Head reviews a flagged section and chooses to cancel. <br> 4. The system shows exactly who is affected — enrolled students, waitlisted students — and which of them would drop below minimum credits as a result. <br> 5. The Department Head confirms and records a reason. <br> 6. The system releases every enrollment, notifies every affected student with alternatives, and removes the section from the catalog (BR-19). <br> 7. The system notifies the Registrar and the timetable system that the room and slot are free.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>11.1 — Keep the section open.</strong> The Department Head decides to run it below minimum and records the justification; the section is removed from the flag list for the semester. <br> <strong>11.2 — Merge sections.</strong> Two under-enrolled sections of the same course are merged; the system moves students from one to the other, checking each for time conflicts (BR-07) and reporting any it cannot move. <br> <strong>11.3 — Registrar-initiated cancellation.</strong> The Registrar cancels across departments, for example when a lecturer becomes unavailable.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>11.0.E1 — A student cannot be moved in a merge.</strong> In flow 11.2 a student has a time conflict with the surviving section. The system completes the merge for everyone else and raises an exception listing the students who must be handled individually. It does not silently unenroll them. <br> <strong>11.0.E2 — Cancellation would leave a student unable to graduate.</strong> A student needs this section to complete their programme this semester (BR-18). The system warns <strong>before</strong> confirmation, names the students, and requires explicit acknowledgement. <br> <strong>11.0.E3 — Notification fails.</strong> A student's notification cannot be delivered. The cancellation stands but the system raises a follow-up task for the academic office; a student is never left unnotified and unrecorded. <br> <strong>11.0.E4 — Cancellation attempted after teaching starts.</strong> The system refuses and routes the request to the Registrar, since this is a regulated academic decision outside the workflow.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>Low — deferred to Release 1.2</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>~1,400 sections evaluated per semester; ~70 flagged; ~45 cancelled.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-07, BR-10, BR-15, BR-18, BR-19</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>Exception 11.0.E2 is the reason this use case is worth automating at all. The legacy process found under-enrolled sections late and cancelled them without checking who needed them to graduate; identifying that student <em>before</em> the decision is the difference between an administrative action and an academic one.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Minimum viable enrollment is a faculty-level policy with per-section override, and is configured before the window opens.</td>
</tr>
</tbody>
</table>
<h3>UC-12 — Open, extend or close a registration window</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-12 — Open, extend or close a registration window</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Registrar</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>The Registrar configures a window, or a scheduled wave boundary is reached.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Controls who may register and when. The 72-hour window runs in three priority waves (BR-06); this use case is how those waves are defined, opened, extended in an incident and closed.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The user holds the Registrar role. <br> PRE-2: A section catalog exists for the semester.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: At any moment the system can state, for any student, whether their wave is open — there is no ambiguous state. <br> POST-2: Every change to a window is recorded with the actor, the time and the reason. <br> POST-3: Extending a window never retroactively invalidates an enrollment already made.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>12.0</strong> <br> 1. The Registrar defines the semester's window: start, end, and the three priority waves with their eligibility rules (BR-06). <br> 2. The system validates that the waves do not overlap and that they cover every student exactly once. <br> 3. The Registrar publishes the window; the system notifies students of their wave time. <br> 4. At each wave boundary the system opens registration for that cohort. <br> 5. At the window end the system closes registration and reports the outcome — enrollments, refusals by reason, outstanding overrides and waitlists.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>12.1 — Extend during an incident.</strong> The Registrar extends the window; the system notifies every affected student and records the reason. <br> <strong>12.2 — Reopen for a cohort.</strong> A group was unable to register — a cancelled section, a system fault. The Registrar reopens for named students only. <br> <strong>12.3 — Emergency close.</strong> The Registrar closes registration immediately; in-flight transactions are allowed to complete, no new ones start.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>12.0.E1 — Waves do not cover every student.</strong> At step 2 some students fall in no wave. The system refuses to publish and lists them. <br> <strong>12.0.E2 — Waves overlap.</strong> The system refuses to publish and names the overlap, because an overlap silently destroys the fairness BR-06 exists to create. <br> <strong>12.0.E3 — Window opens with no catalog.</strong> No sections are published for the semester. The system refuses to open. <br> <strong>12.0.E4 — Extension requested after close.</strong> The system treats it as a reopen (flow 12.2), requiring named students, rather than silently re-opening for everyone.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>2 windows per year, 3 waves each; extensions historically 1–2 per year.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-06</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>Low in volume, high in consequence: every other use case in the system reads the state this one writes. POST-1 is what makes UC-03 step 2 answerable in single-digit milliseconds under peak load.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>The academic calendar fixes window dates; the Registrar configures waves within them.</td>
</tr>
</tbody>
</table>
<h3>UC-13 — Advise a student and manage an advising hold</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-13 — Advise a student and manage an advising hold</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 3</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Academic Advisor</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>An advising meeting takes place, or a policy requires a hold to be placed on a cohort.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Records what a student was advised and, where policy requires it, places a hold that blocks enrollment until the student has met their advisor (BR-14). The hold is the mechanism that makes advising happen before registration rather than after it.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The advisor is authenticated and assigned to the student. <br> PRE-2: The student is enrolled in a programme.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: A hold exists or it does not; there is no partially applied hold. <br> POST-2: Placing and lifting a hold both record the actor, the time and the reason. <br> POST-3: A student can always see that a hold exists and who to contact, even though they cannot see the advising notes.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>13.0</strong> <br> 1. The advisor opens the student's record and reviews their degree audit (UC-09). <br> 2. The advisor records advice given and any agreed plan. <br> 3. The advisor lifts the advising hold for the coming registration window. <br> 4. The system records the lift and notifies the student that they may now register.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>13.1 — Place a hold on a cohort.</strong> The Registrar or an advisor places holds on all students in a cohort — for example every first-year student before their first window. <br> <strong>13.2 — Place an individual hold.</strong> An advisor places a hold on one student, for instance after academic probation. <br> <strong>13.3 — Hold with an expiry.</strong> A hold is placed with an automatic expiry date, so it cannot outlive its purpose by neglect. <br> <strong>13.4 — Student views hold status.</strong> The student sees that a hold exists, the reason category and the advisor to contact — but not the advising notes.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>13.0.E1 — Advisor not assigned.</strong> The advisor is not this student's assigned advisor. The system refuses and offers to request temporary access, recording the request. <br> <strong>13.0.E2 — Hold lifted during an open window.</strong> The student is mid-registration. The lift takes effect immediately; the system notifies the student so they can continue without re-checking. <br> <strong>13.0.E3 — Hold placed during an open window.</strong> The system places the hold but does <strong>not</strong> reverse enrollments already made — a hold restricts future action only. <br> <strong>13.0.E4 — Every advisor unavailable before a window.</strong> Holds remain in place and the window would exclude those students. The system reports the count to the Registrar 72 hours before the window, so that a policy decision can be taken while there is still time.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>Low — deferred to Release 1.2</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>~40 advisors × ~55 students each, ~2 meetings per semester: ~4,400 advising records, ~6,000 hold transactions.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-14</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>Exception 13.0.E3 is a deliberate boundary: a hold is a gate on future enrollment, not a retroactive cancellation. Making it retroactive would give one advisor the power to unenroll a student mid-window, which no stakeholder asked for and the Registrar explicitly rejected in session 2.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Every student has exactly one assigned advisor at any time.</td>
</tr>
</tbody>
</table>
<h3>UC-14 — Produce enrollment and capacity reports</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-14 — Produce enrollment and capacity reports</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Registrar</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>The user opens a report, or a scheduled report is generated.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Reporting on enrollment, capacity utilisation, override activity and the objectives from the Vision &amp; Scope document. Its purpose is to make the six business objectives continuously measurable rather than reconstructed at the end of a semester.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The user holds a role that grants reporting access. <br> PRE-2: At least one registration window has completed.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: A user sees only the faculties and departments their role permits. <br> POST-2: Every figure states the period it covers and when the data was last refreshed. <br> POST-3: No report discloses an individual student's financial detail to an academic user.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>14.0</strong> <br> 1. The user opens the report list and selects a report and a period. <br> 2. The system applies the user's data scope (POST-1). <br> 3. The system computes and displays the report with its definitions visible. <br> 4. The user filters by faculty, department, programme or section. <br> 5. The system recomputes and redisplays.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>14.1 — Drill down.</strong> The user clicks a figure and sees the underlying sections or enrollments. <br> <strong>14.2 — Export.</strong> The user exports the current view as CSV. <br> <strong>14.3 — Scheduled window report.</strong> The system produces the registration-window summary automatically when a window closes and sends it to the Registrar and Vice-Rector. <br> <strong>14.4 — Override activity report.</strong> A Department Head reviews their own override decisions, decision times against the 48-hour SLA (BR-12) and approval rate.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>14.0.E1 — No data for the period.</strong> The system states that no data exists for the period, distinctly from a figure of zero. <br> <strong>14.0.E2 — Computation times out.</strong> The system shows the sections that completed and marks the rest with a retry, rather than failing the page. <br> <strong>14.0.E3 — Report requested across a permission boundary.</strong> The system returns only the permitted scope and states that the result was limited by permission.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>Low — deferred to Release 2.0</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>~15 regular users, ~3 views/week each, plus 2 scheduled window reports per year.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-03, BR-10, BR-12, BR-13</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>Report definitions must be <strong>identical</strong> to the success metrics in Vision &amp; Scope §1.4. If the override-activity report measures decision time differently from the success metric for BO-3, the university cannot prove the objective was met. Report specifications are in SRS §4.3.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Near-real-time aggregation is acceptable; figures may lag live data by up to 15 minutes.</td>
</tr>
</tbody>
</table>
<hr />
<h3>4. Use Case Diagram</h3>
<p>See <code>diagrams/use-case-diagram.drawio</code> (editable) and <code>diagrams/use-case-diagram.png</code> (for the SRS Appendix B).</p>
<p><strong>Reading the diagram</strong>
- Primary actors are on the <strong>left</strong>, secondary (system) actors on the <strong>right</strong>.
- The rectangle is the <strong>system boundary</strong>. The finance system, SSO, timetable system and LMS sit outside it deliberately (Vision &amp; Scope §2.4).
- <code>«include»</code> arrows point <strong>from</strong> the base use case <strong>to</strong> the always-executed use case.
- <code>«extend»</code> arrows point <strong>from</strong> the optional use case <strong>to</strong> the base it extends.</p>
<p><strong>Relationships shown</strong></p>
<table>
<thead>
<tr>
<th>Relationship</th>
<th>From</th>
<th>To</th>
<th>Why</th>
</tr>
</thead>
<tbody>
<tr>
<td>«include»</td>
<td>UC-03 Register for a section</td>
<td>UC-04 Validate prerequisites</td>
<td>Every enrollment evaluates prerequisites, always</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-03 Register for a section</td>
<td>UC-05 Evaluate financial eligibility</td>
<td>Every enrollment evaluates finance, always</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-02 Build a planned schedule</td>
<td>UC-04 Validate prerequisites</td>
<td>Planning warns on prerequisites, always</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-08 Drop or swap</td>
<td>UC-07 Waitlist promotion</td>
<td>A released seat always triggers promotion</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-11 Cancel a section</td>
<td>UC-08 Drop or swap</td>
<td>Cancellation always releases every enrollment</td>
</tr>
<tr>
<td>«extend»</td>
<td>UC-06 Request an override</td>
<td>UC-03 Register for a section</td>
<td>Only when the section is full or a prerequisite is unmet</td>
</tr>
<tr>
<td>«extend»</td>
<td>UC-07 Join a waitlist</td>
<td>UC-03 Register for a section</td>
<td>Only when the section is full</td>
</tr>
<tr>
<td>«extend»</td>
<td>UC-09 Degree audit</td>
<td>UC-13 Advise a student</td>
<td>Only when an advisor reviews progress during advising</td>
</tr>
</tbody>
</table>`,
  ].join('\n'),
};

const TP1L3 = {
  title: "W1.3 — Deliverable 3: 20 business rules, all five types|||W1.3 — Deliverable 3: 20 business rule, đủ năm loại",
  slug: "swr302-tp1-goi-03-business-rules",
  type: 'DOCUMENT',
  description: "Catalog 20 rule đủ năm loại, đánh dấu tĩnh/động, nguồn từng rule — bảy rule đến từ ĐỌC TÀI LIỆU Quy chế học vụ chứ không từ phỏng vấn. Kèm vấn đề \"catalog year\" và ma trận truy vết.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP1 · Deliverable 3</span>
<h2>Twenty rules — and seven of them nobody mentioned</h2>
<p class="lead">The discovery table in §4 is the part to study. <strong>Seven of the twenty rules came from reading the Academic Regulations</strong>, not from any interview. Nobody mentioned them because everybody assumed they were obvious.</p>
<div class="callout warn"><strong>The lesson generalises.</strong> In a regulated organisation — a university, a bank, a hospital — read the regulations <em>before</em> the first interview. Otherwise you spend the interview being told things you could have read, and you still miss the rules nobody thinks to say out loud. This is the exact opposite of TP2, where the rules existed only as staff habits and document analysis would have found nothing.</div>
<h3>The catalog-year problem</h3>
<p>Read §2.2 carefully. Twelve rules are dynamic, and three of them — BR-02, BR-04, BR-13 — must additionally be <strong>versioned by catalog year</strong>: a student is assessed against the regulations in force when they matriculated. A configuration model that simply overwrites the current value would silently re-assess every existing student against new rules. That is wrong, and under Academic Regulations §9.1 it is not permitted.</p>
<p>Most teams never notice this. Spotting it is worth more than any other single observation in the TP1 topic, because it changes the data model (SRS §4.1), a constraint (CO-6) and a data dictionary entry (Catalog Year).</p>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP1 · Deliverable 3</span>
<h2>Hai mươi rule — và bảy cái không ai nhắc tới</h2>
<p class="lead">Bảng khám phá ở §4 mới là phần đáng học. <strong>Bảy trong hai mươi rule đến từ việc ĐỌC Quy chế học vụ</strong>, không từ buổi phỏng vấn nào. Không ai nhắc tới chúng vì ai cũng cho rằng chúng hiển nhiên.</p>
<div class="callout warn"><strong>Bài học này áp dụng rộng.</strong> Trong một tổ chức có quy chế — trường đại học, ngân hàng, bệnh viện — hãy đọc quy chế <em>trước</em> buổi phỏng vấn đầu tiên. Nếu không, bạn tốn cả buổi để nghe những thứ lẽ ra đọc được, mà vẫn bỏ sót những luật chẳng ai nghĩ tới việc nói ra. Đây đúng là điều ngược lại với TP2, nơi các rule chỉ tồn tại dưới dạng thói quen của nhân viên và đọc tài liệu sẽ chẳng tìm ra gì.</div>
<h3>Vấn đề "catalog year"</h3>
<p>Hãy đọc kỹ §2.2. Mười hai rule là động, và ba trong số đó — BR-02, BR-04, BR-13 — còn phải được <strong>đánh phiên bản theo catalog year</strong>: sinh viên được đánh giá theo quy chế có hiệu lực lúc họ nhập học. Một mô hình cấu hình chỉ ghi đè giá trị hiện tại sẽ âm thầm đánh giá lại mọi sinh viên đang học theo luật mới. Điều đó vừa sai, vừa không được phép theo Quy chế §9.1.</p>
<p>Phần lớn nhóm không bao giờ nhận ra điều này. Phát hiện được nó đáng giá hơn bất kỳ nhận xét đơn lẻ nào khác trong đề TP1, vì nó làm thay đổi mô hình dữ liệu (SRS §4.1), một ràng buộc (CO-6) và một mục data dictionary (Catalog Year).</p>`,
    ),
    `<h2>Business Rules</h2>
<h2>for the Campus Academic and Registration System (CARS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Team Leader name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Northern Regional University (NRU)
17 September 2026</p>
<hr />
<h3>Revision History</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Date</th>
<th>Reason For Changes</th>
<th>Version</th>
</tr>
</thead>
<tbody>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Rules harvested from elicitation sessions 1–4 and the Academic Regulations</td>
<td>0.9</td>
</tr>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Classified, de-duplicated and cross-referenced to use cases</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Purpose and scope</h3>
<p>This document is NRU's catalog of the business rules that govern registration and
academic progression. A <strong>business rule</strong> is a policy, regulation, standard,
computation or definition that exists <strong>independently of any software</strong> — in NRU's case
most of them exist in the Academic Regulations, which is why the <em>Source</em> column
matters more here than in a commercial project. Rules are recorded <strong>once</strong>; use cases
and functional requirements refer to them <strong>by ID only</strong>.</p>
<p>The five-type taxonomy is from Wiegers &amp; Beatty, Chapter 9:</p>
<table>
<thead>
<tr>
<th>Type</th>
<th>Meaning</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Fact</strong></td>
<td>A true statement about the business; an invariant of the domain</td>
</tr>
<tr>
<td><strong>Constraint</strong></td>
<td>Something that must or must not happen; restricts an action</td>
</tr>
<tr>
<td><strong>Action enabler</strong></td>
<td>A condition that, when true, triggers an action</td>
</tr>
<tr>
<td><strong>Inference</strong></td>
<td>New knowledge derived from existing facts</td>
</tr>
<tr>
<td><strong>Computation</strong></td>
<td>A formula that produces a value</td>
</tr>
</tbody>
</table>
<p><strong>Static or Dynamic</strong> records whether the <em>rule itself</em> is expected to change.
Dynamic rules must be <strong>configurable</strong>, not compiled in. In a university this
distinction is unusually important: regulations are revised by committee on an annual
cycle, and a rule that requires a software release to change will be out of date
within a year.</p>
<hr />
<h3>2. The rules</h3>
<table>
<thead>
<tr>
<th>ID</th>
<th>Rule Definition</th>
<th>Type of Rule</th>
<th>Static or Dynamic</th>
<th>Source</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>BR-01</strong></td>
<td>A student may hold at most one enrollment in a given course section at any time.</td>
<td>Fact</td>
<td>Static</td>
<td>Registrar, session 2</td>
</tr>
<tr>
<td><strong>BR-02</strong></td>
<td>A student may enroll in a course only if every prerequisite course has been completed with at least the minimum grade specified for that prerequisite.</td>
<td>Constraint</td>
<td>Dynamic</td>
<td>Academic Regulations §7.2</td>
</tr>
<tr>
<td><strong>BR-03</strong></td>
<td>Remaining capacity of a section = published capacity − confirmed enrollments − approved overrides not yet enrolled.</td>
<td>Computation</td>
<td>Static</td>
<td>Registrar, session 2</td>
</tr>
<tr>
<td><strong>BR-04</strong></td>
<td>A student may not enroll in more than the credit limit for their year of study in a semester. The default limit is 24 credits.</td>
<td>Constraint</td>
<td>Dynamic</td>
<td>Academic Regulations §5.1</td>
</tr>
<tr>
<td><strong>BR-05</strong></td>
<td>A student whose outstanding balance exceeds the registration threshold, or who carries an explicit finance hold, may not enroll until the block is cleared.</td>
<td>Action enabler</td>
<td>Dynamic</td>
<td>Finance Officer, session 3; Academic Regulations §11.4</td>
</tr>
<tr>
<td><strong>BR-06</strong></td>
<td>Registration opens in three priority waves in this order: final-year students, then second- and third-year students, then first-year students.</td>
<td>Fact</td>
<td>Dynamic</td>
<td>Registrar, session 1</td>
</tr>
<tr>
<td><strong>BR-07</strong></td>
<td>A student may not hold two enrollments whose scheduled meeting times overlap by any amount.</td>
<td>Constraint</td>
<td>Static</td>
<td>Registrar, session 2</td>
</tr>
<tr>
<td><strong>BR-08</strong></td>
<td>When a seat is released in a section that has a waitlist, it is offered to the highest-placed student on that waitlist who still satisfies every other enrollment rule.</td>
<td>Action enabler</td>
<td>Static</td>
<td>Registrar, session 2</td>
</tr>
<tr>
<td><strong>BR-09</strong></td>
<td>A waitlist offer expires 24 hours after it is issued, after which the seat is offered to the next eligible student.</td>
<td>Constraint</td>
<td>Dynamic</td>
<td>Registrar, session 2</td>
</tr>
<tr>
<td><strong>BR-10</strong></td>
<td>A section is "under-enrolled" when its confirmed enrollment is below its minimum viable enrollment at the checkpoint 7 days before the add/drop period opens.</td>
<td>Inference</td>
<td>Dynamic</td>
<td>Department Heads, session 3</td>
</tr>
<tr>
<td><strong>BR-11</strong></td>
<td>Only the Department Head owning a section, or a delegate they have named, may approve a capacity override for that section.</td>
<td>Constraint</td>
<td>Static</td>
<td>Academic Regulations §7.6</td>
</tr>
<tr>
<td><strong>BR-12</strong></td>
<td>A capacity override request must have a recorded decision within 48 hours of submission.</td>
<td>Constraint</td>
<td>Dynamic</td>
<td>University policy (pending signature — dependency D2)</td>
</tr>
<tr>
<td><strong>BR-13</strong></td>
<td>Degree completion percentage = credits earned toward the programme ÷ total credits required by the programme × 100.</td>
<td>Computation</td>
<td>Static</td>
<td>Academic Regulations §9.1</td>
</tr>
<tr>
<td><strong>BR-14</strong></td>
<td>A student carrying an active advising hold may not enroll in any section until an authorised advisor lifts it.</td>
<td>Constraint</td>
<td>Dynamic</td>
<td>Academic Regulations §6.3</td>
</tr>
<tr>
<td><strong>BR-15</strong></td>
<td>The minimum viable enrollment for a section is 15 students, configurable per faculty and overridable per section.</td>
<td>Fact</td>
<td>Dynamic</td>
<td>Vice-Rector, session 1</td>
</tr>
<tr>
<td><strong>BR-16</strong></td>
<td>A student may drop a section with no transcript record only within the add/drop period. After it, a drop is recorded as a withdrawal.</td>
<td>Constraint</td>
<td>Dynamic</td>
<td>Academic Regulations §8.2</td>
</tr>
<tr>
<td><strong>BR-17</strong></td>
<td>Tuition due = Σ (section credits × the per-credit rate for the student's programme) + mandatory fees − scholarships applied.</td>
<td>Computation</td>
<td>Dynamic</td>
<td>Finance Officer, session 3</td>
</tr>
<tr>
<td><strong>BR-18</strong></td>
<td>A student is "at risk of late graduation" when the credits still required exceed what can be taken in their remaining semesters at the maximum credit limit.</td>
<td>Inference</td>
<td>Dynamic</td>
<td>Academic Advisors, session 4</td>
</tr>
<tr>
<td><strong>BR-19</strong></td>
<td>When a section is cancelled, every enrolled and waitlisted student is notified and every seat is released.</td>
<td>Action enabler</td>
<td>Static</td>
<td>Registrar, session 2</td>
</tr>
<tr>
<td><strong>BR-20</strong></td>
<td>Courses declared as co-requisites must be enrolled in the same semester; a student may enroll in both or neither.</td>
<td>Constraint</td>
<td>Static</td>
<td>Academic Regulations §7.4</td>
</tr>
</tbody>
</table>
<h3>2.1 Coverage by type</h3>
<table>
<thead>
<tr>
<th>Type</th>
<th>Rules</th>
<th>Count</th>
</tr>
</thead>
<tbody>
<tr>
<td>Fact</td>
<td>BR-01, BR-06, BR-15</td>
<td>3</td>
</tr>
<tr>
<td>Constraint</td>
<td>BR-02, BR-04, BR-07, BR-09, BR-11, BR-12, BR-14, BR-16, BR-20</td>
<td>9</td>
</tr>
<tr>
<td>Action enabler</td>
<td>BR-05, BR-08, BR-19</td>
<td>3</td>
</tr>
<tr>
<td>Inference</td>
<td>BR-10, BR-18</td>
<td>2</td>
</tr>
<tr>
<td>Computation</td>
<td>BR-03, BR-13, BR-17</td>
<td>3</td>
</tr>
<tr>
<td></td>
<td><strong>Total</strong></td>
<td><strong>20</strong></td>
</tr>
</tbody>
</table>
<h3>2.2 Static versus dynamic — what it means for the build</h3>
<p>Twelve of the twenty rules are <strong>dynamic</strong>. In a university this is not a minor
engineering note: the Academic Regulations are revised annually by committee, and
several of these values are the exact things a committee changes.</p>
<table>
<thead>
<tr>
<th>Rule</th>
<th>Configurable value</th>
<th>Who may change it</th>
</tr>
</thead>
<tbody>
<tr>
<td>BR-02</td>
<td>Minimum grade per prerequisite; the rules themselves</td>
<td>Faculty curriculum committee, via the Registrar</td>
</tr>
<tr>
<td>BR-04</td>
<td>Credit limit, per year of study and per programme</td>
<td>Registrar</td>
</tr>
<tr>
<td>BR-05</td>
<td>Registration balance threshold; grace rules</td>
<td>Finance Officer</td>
</tr>
<tr>
<td>BR-06</td>
<td>Wave definitions and their order</td>
<td>Registrar</td>
</tr>
<tr>
<td>BR-09</td>
<td>Waitlist offer window (24 h)</td>
<td>Registrar</td>
</tr>
<tr>
<td>BR-10</td>
<td>The 7-day checkpoint</td>
<td>Registrar</td>
</tr>
<tr>
<td>BR-12</td>
<td>Override decision SLA (48 h)</td>
<td>Registrar, once D2 is signed</td>
</tr>
<tr>
<td>BR-14</td>
<td>Which cohorts carry an automatic hold</td>
<td>Registrar</td>
</tr>
<tr>
<td>BR-15</td>
<td>Minimum viable enrollment, per faculty and per section</td>
<td>Department Head</td>
</tr>
<tr>
<td>BR-16</td>
<td>Add/drop period dates, per semester</td>
<td>Registrar</td>
</tr>
<tr>
<td>BR-17</td>
<td>Per-credit rates, fees</td>
<td>Finance Officer</td>
</tr>
<tr>
<td>BR-18</td>
<td>Remaining-semester assumption</td>
<td>Academic Advisors</td>
</tr>
</tbody>
</table>
<div class="callout">
<p><strong>The catalog-year problem.</strong> BR-02, BR-04 and BR-13 are dynamic <em>and</em> must be
<strong>versioned by catalog year</strong>: a student is assessed against the regulations in force
when they matriculated (UC-09 exception 9.0.E2). A configuration model that simply
overwrites the current value would silently re-assess every existing student against
new rules — which is both wrong and, under Academic Regulations §9.1, not permitted.</p>
</div>
<hr />
<h3>3. Rules that are deliberately NOT enforced in software</h3>
<table>
<thead>
<tr>
<th>Rule</th>
<th>Why it is not enforced by CARS</th>
</tr>
</thead>
<tbody>
<tr>
<td>A student must meet their advisor at least once per semester</td>
<td>CARS enforces the <em>hold</em> (BR-14); whether a meeting happened is an advisor's judgement</td>
</tr>
<tr>
<td>Lecturers must submit grades within 14 days of the final assessment</td>
<td>Enforced by the Registrar administratively; CARS reports lateness but does not block</td>
</tr>
<tr>
<td>A student on academic probation must reduce their credit load</td>
<td>Applied by placing an individual credit limit under BR-04, not by a separate rule</td>
</tr>
<tr>
<td>Scholarship eligibility criteria</td>
<td>Owned entirely by the finance system (EX-2); CARS reads the outcome</td>
</tr>
<tr>
<td>Room capacity must not be exceeded</td>
<td>Owned by the timetable system (EX-3); CARS warns at UC-06 exception 6.0.E3 but does not enforce</td>
</tr>
</tbody>
</table>
<hr />
<h3>4. How the rules were discovered</h3>
<table>
<thead>
<tr>
<th>Session</th>
<th>Date</th>
<th>Stakeholder role played</th>
<th>Technique</th>
<th>Rules yielded</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>2026-09-08</td>
<td>Vice-Rector (sponsor) + Registrar</td>
<td>Structured interview, 9 prepared questions</td>
<td>BR-06, BR-15</td>
</tr>
<tr>
<td>2</td>
<td>2026-09-09</td>
<td>Registrar + Academic Office Staff</td>
<td>Facilitated workshop, current-state walkthrough of one enrollment</td>
<td>BR-01, BR-03, BR-07, BR-08, BR-09, BR-19</td>
</tr>
<tr>
<td>3</td>
<td>2026-09-11</td>
<td>Finance Officer + Department Heads</td>
<td>Structured interview</td>
<td>BR-05, BR-10, BR-12, BR-17</td>
</tr>
<tr>
<td>4</td>
<td>2026-09-12</td>
<td>Academic Advisors</td>
<td>Follow-up on degree-audit questions</td>
<td>BR-18</td>
</tr>
<tr>
<td>—</td>
<td>2026-09-10</td>
<td>—</td>
<td><strong>Document analysis</strong> of the Academic Regulations</td>
<td>BR-02, BR-04, BR-11, BR-13, BR-14, BR-16, BR-20</td>
</tr>
</tbody>
</table>
<p><strong>Technique note.</strong> Seven of the twenty rules came from <strong>document analysis</strong>, not from
interviews — they were already written down in the Academic Regulations and nobody
mentioned them, because everybody assumed they were obvious. This is the opposite of
the TP2 situation, where rules existed only as staff habits. The lesson generalises:
in a regulated organisation, read the regulations <em>before</em> the first interview, or you
will spend the interview being told things you could have read, and still miss the
rules nobody thinks to say out loud.</p>
<p><strong>Open questions carried into the SRS TBD list</strong></p>
<table>
<thead>
<tr>
<th>#</th>
<th>Question</th>
<th>Owner</th>
<th>Target</th>
</tr>
</thead>
<tbody>
<tr>
<td>TBD-1</td>
<td>Does the credit limit in BR-04 count in-progress repeats, or only new enrollments?</td>
<td>Registrar</td>
<td>Week 6</td>
</tr>
<tr>
<td>TBD-2</td>
<td>Is the 48-hour SLA in BR-12 working hours or calendar hours? Department Heads and the Registrar answered differently.</td>
<td>Registrar</td>
<td>Week 6</td>
</tr>
<tr>
<td>TBD-3</td>
<td>When a co-requisite pair (BR-20) is broken by a section cancellation, is the surviving enrollment dropped automatically or referred to an advisor?</td>
<td>Registrar</td>
<td>Week 7</td>
</tr>
<tr>
<td>TBD-4</td>
<td>Does the finance threshold in BR-05 apply per semester or cumulatively?</td>
<td>Finance Officer</td>
<td>Week 7</td>
</tr>
</tbody>
</table>
<hr />
<h3>5. Traceability: rule → use case → requirement</h3>
<table>
<thead>
<tr>
<th>Rule</th>
<th>Enforced in use case(s)</th>
<th>SRS functional requirement(s)</th>
</tr>
</thead>
<tbody>
<tr>
<td>BR-01</td>
<td>UC-03</td>
<td>Enroll-2</td>
</tr>
<tr>
<td>BR-02</td>
<td>UC-02, UC-03, UC-04, UC-06, UC-09</td>
<td>Prereq-1, Prereq-2</td>
</tr>
<tr>
<td>BR-03</td>
<td>UC-01, UC-03, UC-06, UC-07, UC-14</td>
<td>Catalog-3, Enroll-6</td>
</tr>
<tr>
<td>BR-04</td>
<td>UC-02, UC-03, UC-08</td>
<td>Enroll-5</td>
</tr>
<tr>
<td>BR-05</td>
<td>UC-03, UC-05, UC-10</td>
<td>Finance-1, Finance-2</td>
</tr>
<tr>
<td>BR-06</td>
<td>UC-01, UC-03, UC-12</td>
<td>Window-1, Enroll-1</td>
</tr>
<tr>
<td>BR-07</td>
<td>UC-02, UC-03, UC-07, UC-08, UC-11</td>
<td>Enroll-4, Plan-2</td>
</tr>
<tr>
<td>BR-08</td>
<td>UC-07, UC-08</td>
<td>Wait-3</td>
</tr>
<tr>
<td>BR-09</td>
<td>UC-07</td>
<td>Wait-4</td>
</tr>
<tr>
<td>BR-10</td>
<td>UC-11, UC-14</td>
<td>Viability-1</td>
</tr>
<tr>
<td>BR-11</td>
<td>UC-06</td>
<td>Override-2</td>
</tr>
<tr>
<td>BR-12</td>
<td>UC-06, UC-14</td>
<td>Override-3, Override-6</td>
</tr>
<tr>
<td>BR-13</td>
<td>UC-09, UC-14</td>
<td>Audit-3</td>
</tr>
<tr>
<td>BR-14</td>
<td>UC-02, UC-03, UC-13</td>
<td>Enroll-3, Advise-2</td>
</tr>
<tr>
<td>BR-15</td>
<td>UC-11</td>
<td>Viability-2</td>
</tr>
<tr>
<td>BR-16</td>
<td>UC-08</td>
<td>Drop-1</td>
</tr>
<tr>
<td>BR-17</td>
<td>UC-05, UC-10</td>
<td>Account-2</td>
</tr>
<tr>
<td>BR-18</td>
<td>UC-09, UC-11</td>
<td>Audit-6, Viability-5</td>
</tr>
<tr>
<td>BR-19</td>
<td>UC-11</td>
<td>Viability-3</td>
</tr>
<tr>
<td>BR-20</td>
<td>UC-02, UC-03, UC-04, UC-08, UC-09</td>
<td>Prereq-4, Enroll-7</td>
</tr>
</tbody>
</table>
<p><strong>Every rule in this catalog is enforced by at least one use case.</strong> That check was run
before baselining and is repeated before submission.</p>`,
  ].join('\n'),
};

const TP1L4 = {
  title: "W1.4 — Deliverable 4: the SRS, all sections (109 requirements)|||W1.4 — Deliverable 4: SRS đầy đủ mọi mục (109 yêu cầu)",
  slug: "swr302-tp1-goi-04-srs",
  type: 'DOCUMENT',
  description: "SRS hoàn chỉnh theo template Chapter 10: 14 nhóm tính năng với 109 functional requirement, 15 thuộc tính chất lượng Planguage (tải đỉnh 6.000 phiên đồng thời, 0 chỗ bị cấp trùng), yêu cầu dữ liệu, 8 giao tiếp, glossary, TBD list và ma trận truy vết.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP1 · Deliverable 4</span>
<h2>The SRS — where load stops being a feeling and becomes a number</h2>
<p class="lead">Three parts repay close reading.</p>
<ul>
<li><strong>§6.1 QA-1 through QA-4.</strong> The brief's first complaint is "severe system slowdowns and frequent crashes". That is not a requirement. QA-1 turns it into: 4,200 concurrent sessions must be sustained with 95th-percentile response ≤ 2 s, measured at a rehearsal window, planned for 6,000. <strong>QA-4 is the one to copy</strong> — zero seats issued twice or lost, measured by daily reconciliation <em>and</em> fault-injection at peak concurrency. A double-issued seat is discovered by a student arriving at a full classroom.</li>
<li><strong>§2.5, the callout.</strong> "If A2 is wrong, Release 1.0 is wrong." Naming the assumption the whole specification rests on, and saying what happens if it fails, is the difference between an analyst and a typist.</li>
<li><strong>Appendix C, TBD-5.</strong> Marked <strong>"blocks the BO-2 commitment"</strong>. An open item that blocks an objective should say so — a TBD list that does not distinguish the dangerous item from the cosmetic one is just a to-do list.</li>
</ul>
<div class="callout ok"><strong>Notice CO-6 and QA-15 together.</strong> The Academic Regulations are revised annually by committee. CO-6 requires every catalog-year version to be retained; QA-15 requires a regulation change to be applied in ≤ 3 days with no code change. A system that needs a release to absorb the annual revision is out of date within a year of going live — so a maintainability attribute here is a business requirement, not an engineering preference.</div>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP1 · Deliverable 4</span>
<h2>SRS — nơi "tải nặng" thôi là cảm giác và trở thành con số</h2>
<p class="lead">Ba phần đáng đọc kỹ.</p>
<ul>
<li><strong>§6.1, từ QA-1 tới QA-4.</strong> Than phiền đầu tiên của đề là "hệ thống chậm nghiêm trọng và sập thường xuyên". Đó không phải một yêu cầu. QA-1 biến nó thành: phải chịu được 4.200 phiên đồng thời với phân vị 95 ≤ 2 giây, đo tại buổi tổng duyệt, nhắm tới 6.000. <strong>QA-4 là cái đáng chép</strong> — không chỗ nào bị cấp hai lần hay mất đi, đo bằng đối soát hằng ngày <em>và</em> tiêm lỗi ở mức đồng thời cao nhất. Một chỗ bị cấp trùng sẽ được phát hiện bởi một sinh viên bước vào phòng học đã đầy.</li>
<li><strong>§2.5, khung nhấn mạnh.</strong> "Nếu A2 sai thì bản 1.0 sai." Gọi tên đúng cái giả định mà cả bản đặc tả đang đứng lên, và nói rõ chuyện gì xảy ra nếu nó sụp, là khác biệt giữa một analyst và một người đánh máy.</li>
<li><strong>Phụ lục C, mục TBD-5.</strong> Được đánh dấu <strong>"chặn cam kết BO-2"</strong>. Một mục còn mở mà đang chặn một mục tiêu thì phải nói ra — một danh sách TBD không phân biệt được cái nguy hiểm với cái trang trí thì chỉ là danh sách việc vặt.</li>
</ul>
<div class="callout ok"><strong>Hãy để ý CO-6 và QA-15 cùng nhau.</strong> Quy chế học vụ được uỷ ban sửa hằng năm. CO-6 buộc giữ lại mọi phiên bản theo catalog year; QA-15 buộc một thay đổi quy chế phải áp dụng được trong ≤ 3 ngày mà không sửa mã. Một hệ thống cần ra bản mới để hấp thụ lần sửa quy chế hằng năm sẽ lỗi thời trong vòng một năm sau khi lên — nên ở đây một thuộc tính về khả năng bảo trì chính là yêu cầu nghiệp vụ, không phải sở thích kỹ thuật.</div>`,
    ),
    `<h2>Software Requirements Specification</h2>
<h2>for the Campus Academic and Registration System (CARS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Team Leader name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Northern Regional University (NRU)
17 September 2026</p>
<hr />
<h3>Revision History</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Date</th>
<th>Reason For Changes</th>
<th>Version</th>
</tr>
</thead>
<tbody>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Initial draft — sections 1–2 from Vision &amp; Scope, section 3 from use cases</td>
<td>0.9</td>
</tr>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Quality attributes quantified, all sections complete, baselined</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h2>Table of Contents</h2>
<ol>
<li>Introduction · 2. Overall Description · 3. System Features · 4. Data Requirements ·</li>
<li>External Interface Requirements · 6. Quality Attributes ·</li>
<li>Internationalization and Localization Requirements · 8. Other Requirements ·
Appendix A: Glossary · Appendix B: Analysis Models · Appendix C: TBD List ·
Appendix D: Requirements Traceability Matrix</li>
</ol>
<hr />
<h3>1. Introduction</h3>
<h3>1.1 Purpose</h3>
<p>This document specifies the software requirements for releases <strong>1.0 through 2.0</strong> of
the <strong>Campus Academic and Registration System (CARS)</strong>, which replaces Northern
Regional University's fourteen-year-old student information system for course
registration and academic administration.</p>
<table>
<thead>
<tr>
<th>Reader</th>
<th>Uses this document to</th>
</tr>
</thead>
<tbody>
<tr>
<td>Development team</td>
<td>Understand what to build and what "done" means for each capability</td>
</tr>
<tr>
<td>Test team</td>
<td>Derive test cases; every functional requirement is written to be pass/fail testable</td>
</tr>
<tr>
<td>Project manager</td>
<td>Scope releases and estimate effort</td>
</tr>
<tr>
<td>Registrar and academic office</td>
<td>Confirm that the encoded rules match the Academic Regulations</td>
</tr>
</tbody>
</table>
<h3>1.2 Document Conventions</h3>
<p><strong>Requirement identifiers</strong> have the form <code>&amp;lt;Feature&amp;gt;-&amp;lt;n&amp;gt;</code> — for example <code>Enroll-4</code>,
<code>Prereq-1</code>, <code>Override-3</code>. Identifiers are permanent; a deleted requirement's number is
never reused. Quality attribute requirements use <code>QA-&amp;lt;n&amp;gt;</code>.</p>
<p><strong>The word "shall"</strong> expresses an obligation. Sentences using "should", "may" or "will"
are explanatory text, not requirements.</p>
<p><strong>Priority</strong> — High, Medium or Low — is taken from the requirement prioritization
worksheet (R6), which is the master.</p>
<p><strong>References.</strong> Business rules appear as <code>BR-n</code> only; rule text lives in the Business
Rules document. Use cases appear as <code>UC-nn</code>. Data elements are defined in the Data
Dictionary.</p>
<p><strong>Quality attributes</strong> are written in Planguage (Gilb) with SCALE, METER, MUST and PLAN.</p>
<h3>1.3 Project Scope</h3>
<p>CARS is the authoritative record of a student's enrollment from matriculation to
graduation. It publishes the section catalog, lets students plan and register, decides
each enrollment against curriculum, capacity, timetable and financial rules in one
transaction, administers overrides and waitlists, and shows each student their degree
progress and account balance.</p>
<p>CARS does <strong>not</strong> replace the finance system, the learning management system, the
timetable system or the university SSO. The controlling statement of scope, release
content and exclusions is the <strong>Vision and Scope document</strong> §2.1–2.4.</p>
<p>The business objectives CARS exists to achieve are BO-1 … BO-6 in Vision and Scope
§1.3. Every system feature in section 3 traces to at least one of them.</p>
<h3>1.4 References</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Document</th>
<th>Version</th>
<th>Location</th>
</tr>
</thead>
<tbody>
<tr>
<td>R1</td>
<td>Vision and Scope Document for CARS</td>
<td>1.0</td>
<td><code>deliverables/01-Vision-and-Scope.md</code></td>
</tr>
<tr>
<td>R2</td>
<td>Use Cases for CARS</td>
<td>1.0</td>
<td><code>deliverables/02-Use-Cases.md</code></td>
</tr>
<tr>
<td>R3</td>
<td>Business Rules for CARS</td>
<td>1.0</td>
<td><code>deliverables/03-Business-Rules.md</code></td>
</tr>
<tr>
<td>R4</td>
<td>Data Dictionary for CARS</td>
<td>1.0</td>
<td><code>deliverables/05-Data-Dictionary.md</code></td>
</tr>
<tr>
<td>R5</td>
<td>Mock-ups for Complex Use Cases</td>
<td>1.0</td>
<td><code>deliverables/06-Mockups.md</code></td>
</tr>
<tr>
<td>R6</td>
<td>Requirement Prioritization Worksheet</td>
<td>1.0</td>
<td><code>deliverables/07-Requirements-Prioritization.xlsx</code></td>
</tr>
<tr>
<td>R7</td>
<td>Requirement Estimation</td>
<td>1.0</td>
<td><code>deliverables/08-Requirements-Estimation.xlsx</code></td>
</tr>
<tr>
<td>R8</td>
<td>NRU Academic Regulations</td>
<td>2026 edition</td>
<td>Registrar's office</td>
</tr>
<tr>
<td>R9</td>
<td>Wiegers, K. &amp; Beatty, J., <em>Software Requirements</em>, 3rd ed.</td>
<td>2013</td>
<td>Microsoft Press</td>
</tr>
<tr>
<td>R10</td>
<td>Elicitation session notes 1–4</td>
<td>—</td>
<td>Team shared folder, <code>elicitation/</code></td>
</tr>
</tbody>
</table>
<p><strong>Elicitation method note.</strong> Stakeholder input came from four simulated stakeholder
sessions (R10) plus <strong>document analysis of the Academic Regulations</strong> (R8), which
yielded seven of the twenty business rules. Where an answer was unavailable the item is
recorded in the TBD list (Appendix C) rather than invented.</p>
<hr />
<h3>2. Overall Description</h3>
<h3>2.1 Product Perspective</h3>
<p>CARS is a <strong>replacement</strong> for an existing system, which makes it an enhancement and
replacement project in the sense of Wiegers Chapter 21: the requirements are
constrained by an existing process, existing data and existing regulations, and a gap
analysis matters more than a greenfield feature list.</p>
<p>The legacy system is decommissioned only after one complete, successful registration
window (R1 §3.3). The context diagram is in Appendix B.</p>
<p><strong>Systems CARS exchanges data with</strong></p>
<table>
<thead>
<tr>
<th>External system</th>
<th>Direction</th>
<th>What crosses the boundary</th>
</tr>
</thead>
<tbody>
<tr>
<td>University SSO</td>
<td>In</td>
<td>Authentication assertion and role claims</td>
</tr>
<tr>
<td>Finance / bursar system</td>
<td>In</td>
<td>Outstanding balance and registration hold status</td>
</tr>
<tr>
<td>Timetable system</td>
<td>In</td>
<td>Section meeting patterns, rooms, lecturers</td>
</tr>
<tr>
<td>Learning management system</td>
<td>Out / in</td>
<td>Confirmed enrollments out; final grades in</td>
</tr>
<tr>
<td>Notification service</td>
<td>Out</td>
<td>Student and staff email and SMS</td>
</tr>
</tbody>
</table>
<h3>2.2 User Classes and Characteristics</h3>
<table>
<thead>
<tr>
<th>User class</th>
<th>Size</th>
<th>Frequency of use</th>
<th>Technical skill</th>
<th>Favored</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Student</strong></td>
<td>12,000</td>
<td>Intense during a 72-hour window; occasional otherwise</td>
<td>Varies; assume none</td>
<td><strong>Yes</strong></td>
</tr>
<tr>
<td><strong>Academic Office Staff</strong></td>
<td>14</td>
<td>Continuously during registration</td>
<td>Medium</td>
<td><strong>Yes</strong></td>
</tr>
<tr>
<td><strong>Department Head</strong></td>
<td>6</td>
<td>Daily during registration</td>
<td>Low — teaching staff, not administrators</td>
<td>No</td>
</tr>
<tr>
<td><strong>Academic Advisor</strong></td>
<td>~40</td>
<td>Weekly, peaking before windows</td>
<td>Medium</td>
<td>No</td>
</tr>
<tr>
<td><strong>Registrar</strong></td>
<td>2</td>
<td>Daily</td>
<td>High</td>
<td>No</td>
</tr>
<tr>
<td><strong>Finance Officer</strong></td>
<td>3</td>
<td>Weekly, peaking at registration</td>
<td>Medium</td>
<td>No</td>
</tr>
<tr>
<td><strong>System Administrator</strong></td>
<td>2</td>
<td>Occasionally</td>
<td>High</td>
<td>No</td>
</tr>
</tbody>
</table>
<p><strong>Favored user classes.</strong> Student and Academic Office Staff. Where their needs conflict
with another class's, theirs win. This is the Vice-Rector's decision: the project exists
because students could not register and staff could not keep up.</p>
<p><strong>The consequence for design.</strong> The Student class is both favored <em>and</em> the largest,
least trained and most concentrated in time. It is why QA-1 through QA-4 exist, and why
UC-02 (planning before the window) is in Release 1.0 rather than deferred.</p>
<h3>2.3 Operating Environment</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Requirement</th>
</tr>
</thead>
<tbody>
<tr>
<td>OE-1</td>
<td>CARS shall operate in the university data centre, sized for the registration peak rather than the average.</td>
</tr>
<tr>
<td>OE-2</td>
<td>Student-facing interfaces shall run in current versions of Chrome, Edge, Safari and Firefox, at a minimum viewport width of 360 px.</td>
</tr>
<tr>
<td>OE-3</td>
<td>Staff interfaces shall run in the same browsers at a minimum viewport width of 1280 px.</td>
</tr>
<tr>
<td>OE-4</td>
<td>CARS shall remain usable on a 3G mobile connection for the catalog, planning and enrollment paths.</td>
</tr>
<tr>
<td>OE-5</td>
<td>CARS shall present all times in Asia/Ho_Chi_Minh and store them with an explicit UTC offset.</td>
</tr>
</tbody>
</table>
<h3>2.4 Design and Implementation Constraints</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Constraint</th>
<th>Origin</th>
</tr>
</thead>
<tbody>
<tr>
<td>CO-1</td>
<td>CARS shall authenticate every user through the university SSO and shall not maintain a student password store.</td>
<td>EX-8, corporate security policy</td>
</tr>
<tr>
<td>CO-2</td>
<td>CARS shall not build or modify timetables; it consumes the published timetable.</td>
<td>EX-3</td>
</tr>
<tr>
<td>CO-3</td>
<td>CARS shall not process payments, refunds or scholarship decisions.</td>
<td>EX-2</td>
</tr>
<tr>
<td>CO-4</td>
<td>CARS shall store no payment instrument detail at any time.</td>
<td>Finance policy</td>
</tr>
<tr>
<td>CO-5</td>
<td>Every rule marked Dynamic in R3 §2.2 shall be changeable by configuration by the named role, without a software release.</td>
<td>Business Rules §2.2</td>
</tr>
<tr>
<td>CO-6</td>
<td>Rules versioned by catalog year — BR-02, BR-04, BR-13 — shall retain every prior version, and shall never re-assess an existing student against a later version.</td>
<td>Academic Regulations §9.1</td>
</tr>
<tr>
<td>CO-7</td>
<td>The finance interface shall be isolated behind an adapter so that a synchronous API and a nightly file exchange are interchangeable without changing enrollment logic.</td>
<td>RI-1</td>
</tr>
</tbody>
</table>
<h3>2.5 Assumptions and Dependencies</h3>
<p><strong>Assumptions</strong> (from R1 §1.7)</p>
<ul>
<li>A1: A 72-hour window in three priority waves continues to be the registration model.</li>
<li>A2: At least 90% of programmes can be expressed as machine-evaluable curriculum rules.</li>
<li>A3: Transcript data is complete for students enrolled from 2019 onward.</li>
<li>A4: Student authentication continues to be provided by the university SSO.</li>
<li>A5: The timetable system remains the authority for when and where a section meets.</li>
<li>A6: Every enrolled student has a reachable university email address.</li>
</ul>
<p><strong>Dependencies</strong></p>
<ul>
<li>D1: A finance system interface, whose form depends on the vendor (RI-1).</li>
<li>D2: A signed university policy setting the 48-hour override SLA (BR-12).</li>
<li>D3: Faculty curriculum committees to validate encoded degree requirements before Release 1.0.</li>
<li>D4: A Registrar's office data steward, 8 hours per week during requirements and migration.</li>
</ul>
<div class="callout">
<p><strong>If A2 is wrong, Release 1.0 is wrong.</strong> Every enrollment decision in §3.3 depends
on prerequisite rules being machine-evaluable. Programmes that cannot be expressed are
handled as Indeterminate by design (Prereq-5), but if the proportion is materially
above 10% the staff-hours objective BO-2 is unreachable and scope must be revisited.</p>
</div>
<hr />
<h3>3. System Features</h3>
<h3>3.1 Course catalog search and browsing</h3>
<p><strong>Description.</strong> Publication and search of the section catalog. Realizes FE-1 · UC-01 ·
Objective BO-1. <strong>Priority:</strong> High · <strong>Release:</strong> 1.0</p>
<p><strong>Catalog-1:</strong> The system shall display, for each section, the course code, title, credits, lecturer, meeting pattern, published capacity and remaining capacity.</p>
<p><strong>Catalog-2:</strong> The system shall permit a student to filter sections by faculty, course code, keyword, day, time range, lecturer and availability.</p>
<p><strong>Catalog-3:</strong> The system shall compute remaining capacity in accordance with BR-03 and shall serve no capacity figure older than 60 seconds.</p>
<p><strong>Catalog-4:</strong> The system shall mark as ineligible, with the reason, any section the viewing student's programme does not permit.</p>
<p><strong>Catalog-5:</strong> The system shall display a section whose meeting pattern has not been published by the timetable system, marked as having times to be confirmed, and shall not permit enrollment in it.</p>
<p><strong>Catalog-6:</strong> The system shall state which filter excluded all results when a search returns nothing.</p>
<p><strong>Catalog-7:</strong> The system shall serve a cached catalog no more than 15 minutes old, marked with its age, when the catalog source is unavailable.</p>
<h3>3.2 Schedule planning</h3>
<p><strong>Description.</strong> Provisional timetable building before a window opens. Realizes FE-2 ·
UC-02 · Objective BO-1. <strong>Priority:</strong> High · <strong>Release:</strong> 1.0</p>
<p><strong>Plan-1:</strong> The system shall permit a student to add sections to a named plan and to hold up to three plans concurrently.</p>
<p><strong>Plan-2:</strong> The system shall identify and mark every meeting-time overlap between sections in a plan, in accordance with BR-07.</p>
<p><strong>Plan-3:</strong> The system shall evaluate prerequisites for every planned section and shall mark each section whose prerequisites are not satisfied.</p>
<p><strong>Plan-4:</strong> The system shall total the credits in a plan and shall mark the plan when the total exceeds the student's credit limit, stating the excess.</p>
<p><strong>Plan-5:</strong> The system shall confer no seat, no reservation and no registration priority on a plan, and shall state this to the student.</p>
<p><strong>Plan-6:</strong> The system shall mark a planned section that has been cancelled and shall offer alternative sections of the same course.</p>
<p><strong>Plan-7:</strong> The system shall submit every section of a plan for enrollment in the order the student specifies, and shall report the outcome of each section separately.</p>
<h3>3.3 Enrollment transaction</h3>
<p><strong>Description.</strong> The single automated enrollment decision. Realizes FE-3 · UC-03 ·
Objectives BO-1, BO-2, BO-4. <strong>Priority:</strong> High · <strong>Release:</strong> 1.0</p>
<p><strong>Enroll-1:</strong> The system shall accept an enrollment request only while the requesting student's priority wave is open, in accordance with BR-06.</p>
<p><strong>Enroll-2:</strong> The system shall reject an enrollment request for a section in which the student already holds an enrollment, in accordance with BR-01.</p>
<p><strong>Enroll-3:</strong> The system shall reject an enrollment request from a student carrying an active advising hold, in accordance with BR-14, and shall name the advisor to contact.</p>
<p><strong>Enroll-4:</strong> The system shall reject an enrollment request whose section overlaps in meeting time with any section the student is already enrolled in, in accordance with BR-07, and shall name the conflicting section.</p>
<p><strong>Enroll-5:</strong> The system shall reject an enrollment request that would take the student above the credit limit for their year of study, in accordance with BR-04, and shall state the limit and the current total.</p>
<p><strong>Enroll-6:</strong> The system shall claim a seat only while remaining capacity computed per BR-03 is greater than zero, and shall never issue the same seat to two students.</p>
<p><strong>Enroll-7:</strong> The system shall enroll a student in both sections of a co-requisite pair as a single transaction, or in neither, in accordance with BR-20.</p>
<p><strong>Enroll-8:</strong> The system shall complete an enrollment in full or shall change no state, and shall record the decision, its reason and every rule evaluated whether the request succeeded or failed.</p>
<p><strong>Enroll-9:</strong> The system shall publish a confirmed enrollment to the learning management system.</p>
<p><strong>Enroll-10:</strong> The system shall offer the waitlist or a capacity override request, where the course permits one, when an enrollment is rejected for capacity.</p>
<h3>3.4 Prerequisite and co-requisite rule engine</h3>
<p><strong>Description.</strong> Automated evaluation of curriculum rules. Realizes FE-4 · UC-04 ·
Objective BO-2. <strong>Priority:</strong> High · <strong>Release:</strong> 1.0</p>
<p><strong>Prereq-1:</strong> The system shall evaluate a student's completed courses against every prerequisite rule attached to a course, including the minimum grade specified, in accordance with BR-02.</p>
<p><strong>Prereq-2:</strong> The system shall return a result of Met, Unmet or Indeterminate for every evaluation, and shall name the specific unsatisfied rule for an Unmet result.</p>
<p><strong>Prereq-3:</strong> The system shall treat a prerequisite currently in progress as provisionally met, and shall re-evaluate the enrollment when the final grade is posted.</p>
<p><strong>Prereq-4:</strong> The system shall evaluate co-requisite rules against the student's in-progress and planned enrollments, in accordance with BR-20.</p>
<p><strong>Prereq-5:</strong> The system shall return Indeterminate, and shall raise a configuration alert, when a course has no curriculum rules attached, and shall not return Met.</p>
<p><strong>Prereq-6:</strong> The system shall return Indeterminate for a student whose transcript is flagged as incomplete, and shall route the evaluation to Academic Office Staff.</p>
<p><strong>Prereq-7:</strong> The system shall accept a course recorded as equivalent to a prerequisite, and shall record which equivalence mapping was applied.</p>
<p><strong>Prereq-8:</strong> The system shall evaluate curriculum rules using the version in force for the student's catalog year, in accordance with CO-6.</p>
<p><strong>Prereq-9:</strong> The system shall raise an enrollment-invalid exception, and shall notify the student and their advisor, when a posted grade makes a provisionally met prerequisite unmet.</p>
<h3>3.5 Financial eligibility evaluation</h3>
<p><strong>Description.</strong> Automated financial standing check at enrollment. Realizes FE-5 ·
UC-05 · Objective BO-4. <strong>Priority:</strong> High · <strong>Release:</strong> 1.0</p>
<p><strong>Finance-1:</strong> The system shall obtain the outstanding balance and registration hold status of a student from the finance system before confirming an enrollment, in accordance with BR-05.</p>
<p><strong>Finance-2:</strong> The system shall return a result of Eligible, Blocked or Unknown, and shall record the outstanding amount at the time of a Blocked result.</p>
<p><strong>Finance-3:</strong> The system shall treat a result of Unknown as a refusal with a retry action, and shall not treat it as Eligible.</p>
<p><strong>Finance-4:</strong> The system shall treat a student with an active instalment plan in good standing as Eligible irrespective of the outstanding balance.</p>
<p><strong>Finance-5:</strong> The system shall permit a Finance Officer to clear a block for a named student, and shall record the officer, the reason and an expiry date.</p>
<p><strong>Finance-6:</strong> The system shall re-evaluate the financial standing of every enrolled student nightly, and shall raise a finance exception rather than removing any enrollment.</p>
<p><strong>Finance-7:</strong> The system shall store no payment instrument detail and no transaction record, in accordance with CO-4.</p>
<h3>3.6 Capacity override workflow</h3>
<p><strong>Description.</strong> Tracked request and decision for a place a student cannot otherwise
take. Realizes FE-6 · UC-06 · Objective BO-3. <strong>Priority:</strong> High · <strong>Release:</strong> 1.0</p>
<p><strong>Override-1:</strong> The system shall permit a student to submit a capacity override request stating a ground and a justification, for a section that permits overrides.</p>
<p><strong>Override-2:</strong> The system shall route a request to the Department Head owning the section, and shall accept a decision only from that Department Head or a delegate they have named, in accordance with BR-11.</p>
<p><strong>Override-3:</strong> The system shall record the elapsed time from submission to decision for every request, measured against the deadline in BR-12.</p>
<p><strong>Override-4:</strong> The system shall present to the decider the student's transcript extract, the section's current enrollment against capacity, the room capacity and every other pending request for the same section.</p>
<p><strong>Override-5:</strong> The system shall record the decider, the decision time and a mandatory reason for every approval and every decline.</p>
<p><strong>Override-6:</strong> The system shall escalate to the Registrar any request undecided after the deadline in BR-12, and shall neither approve nor decline it automatically.</p>
<p><strong>Override-7:</strong> The system shall raise the effective capacity of the section by one for the requesting student only when an override is approved, and shall enroll that student.</p>
<p><strong>Override-8:</strong> The system shall record an approval that cannot be enrolled, shall notify the student and the decider with the specific blocking condition, and shall hold the approval valid for 72 hours.</p>
<p><strong>Override-9:</strong> The system shall require explicit confirmation from the decider when an approval would take enrollment above the room capacity published by the timetable system.</p>
<h3>3.7 Waitlist management</h3>
<p><strong>Description.</strong> A fair queue for full sections, administered automatically. Realizes
FE-7 · UC-07 · Objective BO-3. <strong>Priority:</strong> Medium · <strong>Release:</strong> 1.0</p>
<p><strong>Wait-1:</strong> The system shall permit a student to join the waitlist of a full section only when that student satisfies every enrollment rule other than capacity.</p>
<p><strong>Wait-2:</strong> The system shall hold at most one waitlist position per student per course.</p>
<p><strong>Wait-3:</strong> The system shall offer a released seat to the highest-placed student on the waitlist who still satisfies every enrollment rule, in accordance with BR-08, and shall offer a seat to only one student at a time.</p>
<p><strong>Wait-4:</strong> The system shall expire an unanswered waitlist offer after the interval defined by BR-09 and shall offer the seat to the next eligible student.</p>
<p><strong>Wait-5:</strong> The system shall retain the queue position of a student skipped for ineligibility, and shall notify that student why they were skipped.</p>
<p><strong>Wait-6:</strong> The system shall enroll a student who has opted into automatic acceptance without waiting for a response, and shall notify them afterwards.</p>
<p><strong>Wait-7:</strong> The system shall delay by one hour the re-offer of a seat declined because of a meeting-time conflict, so that the student may drop the conflicting section.</p>
<p><strong>Wait-8:</strong> The system shall void an outstanding offer, and shall notify the student with the reason, when the section is cancelled or its capacity is reduced.</p>
<h3>3.8 Drop, swap and add/drop handling</h3>
<p><strong>Description.</strong> Leaving a section, and exchanging one atomically for another. Realizes
FE-8 · UC-08. <strong>Priority:</strong> High · <strong>Release:</strong> 1.0</p>
<p><strong>Drop-1:</strong> The system shall permit a drop with no transcript record only within the add/drop period, in accordance with BR-16, and shall state the consequence before asking for confirmation.</p>
<p><strong>Drop-2:</strong> The system shall release the seat of a dropped section and shall trigger waitlist promotion within 60 seconds.</p>
<p><strong>Drop-3:</strong> The system shall validate a replacement section in full before releasing the seat of the section being replaced, and shall complete a swap entirely or change nothing.</p>
<p><strong>Drop-4:</strong> The system shall drop both sections of a co-requisite pair when either is dropped, in accordance with BR-20, and shall state this before confirmation.</p>
<p><strong>Drop-5:</strong> The system shall warn a student whose drop would take them below the minimum enrolled credits, shall name the recorded consequence, and shall proceed on explicit confirmation.</p>
<p><strong>Drop-6:</strong> The system shall publish every drop to the learning management system.</p>
<h3>3.9 Real-time degree audit</h3>
<p><strong>Description.</strong> Continuous visibility of programme progress. Realizes FE-9 · UC-09 ·
Objective BO-6. <strong>Priority:</strong> Medium · <strong>Release:</strong> 1.1</p>
<p><strong>Audit-1:</strong> The system shall evaluate every requirement group of a student's programme against completed courses, in-progress enrollments and approved transfer credit.</p>
<p><strong>Audit-2:</strong> The system shall assign each requirement group a status of Satisfied, InProgress, Outstanding or NeedsReview, and shall name the courses that satisfied it.</p>
<p><strong>Audit-3:</strong> The system shall compute overall completion in accordance with BR-13.</p>
<p><strong>Audit-4:</strong> The system shall assign NeedsReview, with the reason, to any requirement it cannot evaluate, and shall not assign Satisfied or Outstanding to it.</p>
<p><strong>Audit-5:</strong> The system shall evaluate a student's programme requirements using the rules in force for their catalog year, and shall state which catalog year was used, in accordance with CO-6.</p>
<p><strong>Audit-6:</strong> The system shall identify a student as at risk of late graduation in accordance with BR-18.</p>
<p><strong>Audit-7:</strong> The system shall permit a student to evaluate a prospective course or a prospective programme against their record without changing any stored state.</p>
<p><strong>Audit-8:</strong> The system shall serve no audit result computed more than 5 minutes earlier.</p>
<p><strong>Audit-9:</strong> The system shall mark as provisional any requirement whose evaluation depends on a grade under appeal, and shall name the course.</p>
<p><strong>Audit-10:</strong> The system shall present the requirement groups that completed, and shall mark the remainder as pending with a retry action, when evaluation does not complete within its time budget.</p>
<h3>3.10 Account balance and payment history</h3>
<p><strong>Description.</strong> The student's view of what they owe. Realizes FE-10 · UC-10 ·
Objective BO-6. <strong>Priority:</strong> Medium · <strong>Release:</strong> 1.1</p>
<p><strong>Account-1:</strong> The system shall present a student's outstanding balance, the charges composing it, and payments received, obtained from the finance system.</p>
<p><strong>Account-2:</strong> The system shall compute an estimated cost for a planned schedule in accordance with BR-17, and shall label it as an estimate.</p>
<p><strong>Account-3:</strong> The system shall state, when a registration block is active, the amount that must be paid to clear it.</p>
<p><strong>Account-4:</strong> The system shall disclose financial information relating only to the authenticated student themselves.</p>
<p><strong>Account-5:</strong> The system shall present the time at which financial figures were obtained from the finance system.</p>
<p><strong>Account-6:</strong> The system shall present the most recently obtained figures together with their age when the finance system is unavailable, and shall not present a balance of zero in that circumstance.</p>
<h3>3.11 Section viability and cancellation</h3>
<p><strong>Description.</strong> Finding and cancelling under-enrolled sections in time. Realizes FE-11
· UC-11 · Objective BO-5. <strong>Priority:</strong> Low · <strong>Release:</strong> 1.2</p>
<p><strong>Viability-1:</strong> The system shall evaluate every section against its minimum viable enrollment at the checkpoint defined by BR-10 and shall flag those below it.</p>
<p><strong>Viability-2:</strong> The system shall apply the minimum viable enrollment configured for the section, or that of its faculty where none is configured, in accordance with BR-15.</p>
<p><strong>Viability-3:</strong> The system shall release every enrollment and notify every enrolled and waitlisted student when a section is cancelled, in accordance with BR-19, and shall complete the cancellation only when every release has been applied.</p>
<p><strong>Viability-4:</strong> The system shall present the students affected by a proposed cancellation, and those who would fall below minimum enrolled credits, before the decision is confirmed.</p>
<p><strong>Viability-5:</strong> The system shall identify, before a cancellation is confirmed, any student for whom the section is required to complete their programme this semester, in accordance with BR-18, and shall require explicit acknowledgement.</p>
<p><strong>Viability-6:</strong> The system shall record the decider, the time and a reason for every cancellation and for every decision to run a section below its minimum.</p>
<p><strong>Viability-7:</strong> The system shall move students between merged sections only where no meeting-time conflict results, and shall list those who could not be moved.</p>
<p><strong>Viability-8:</strong> The system shall raise a follow-up task for the academic office when a cancellation notification cannot be delivered.</p>
<h3>3.12 Registration window administration</h3>
<p><strong>Description.</strong> Control of the window and its priority waves. Realizes FE-12 · UC-12 ·
Objective BO-1. <strong>Priority:</strong> High · <strong>Release:</strong> 1.0</p>
<p><strong>Window-1:</strong> The system shall determine, for any student at any moment, whether their priority wave is open, in accordance with BR-06.</p>
<p><strong>Window-2:</strong> The system shall reject a window configuration whose waves overlap or whose waves do not include every active student exactly once, and shall name the students or the overlap concerned.</p>
<p><strong>Window-3:</strong> The system shall reject the opening of a window for a semester that has no published section catalog.</p>
<p><strong>Window-4:</strong> The system shall record the actor, the time and a reason for every change to a window.</p>
<p><strong>Window-5:</strong> The system shall permit the Registrar to extend an open window, and shall notify every affected student.</p>
<p><strong>Window-6:</strong> The system shall permit the Registrar to reopen registration for named students only.</p>
<p><strong>Window-7:</strong> The system shall allow in-flight enrollment transactions to complete, and shall accept no new ones, when a window is closed.</p>
<p><strong>Window-8:</strong> The system shall produce, at the close of a window, a summary of enrollments, refusals by reason, outstanding override requests and waitlist depth.</p>
<h3>3.13 Advising records and holds</h3>
<p><strong>Description.</strong> Recording advice and controlling the advising hold. Realizes FE-13 ·
UC-13. <strong>Priority:</strong> Low · <strong>Release:</strong> 1.2</p>
<p><strong>Advise-1:</strong> The system shall permit an advisor assigned to a student to record advice given and any agreed plan.</p>
<p><strong>Advise-2:</strong> The system shall prevent enrollment by a student carrying an active advising hold, in accordance with BR-14.</p>
<p><strong>Advise-3:</strong> The system shall record the actor, the time and a reason whenever an advising hold is placed or lifted.</p>
<p><strong>Advise-4:</strong> The system shall permit a hold to be placed with an expiry date, after which it ceases to apply.</p>
<p><strong>Advise-5:</strong> The system shall present to a student the existence of a hold, its reason category and the advisor to contact, and shall not present the advising notes to the student.</p>
<p><strong>Advise-6:</strong> The system shall apply a hold to future enrollment only, and shall not reverse enrollments already made.</p>
<p><strong>Advise-7:</strong> The system shall report to the Registrar, 72 hours before a window opens, the number of students still carrying an unlifted hold.</p>
<h3>3.14 Enrollment and capacity reporting</h3>
<p><strong>Description.</strong> Reporting against the six business objectives. Realizes FE-14 · UC-14.
<strong>Priority:</strong> Low · <strong>Release:</strong> 2.0</p>
<p><strong>Report-1:</strong> The system shall present enrollment counts, capacity utilisation, refusal reasons and override activity for a selected period and scope.</p>
<p><strong>Report-2:</strong> The system shall compute every reported figure using the definition recorded for the corresponding success metric in Vision and Scope §1.4.</p>
<p><strong>Report-3:</strong> The system shall restrict the faculties, departments and programmes visible in a report to those permitted by the requesting user's role, and shall state when a result has been limited by permission.</p>
<p><strong>Report-4:</strong> The system shall present override decision times measured against the deadline in BR-12, per department.</p>
<p><strong>Report-5:</strong> The system shall present a state indicating that no data exists for a selected period, distinct from a value of zero.</p>
<p><strong>Report-6:</strong> The system shall exclude individual student financial detail from every report available to an academic user.</p>
<p><strong>Report-7:</strong> The system shall produce a registration-window summary automatically when a window closes.</p>
<hr />
<h3>4. Data Requirements</h3>
<h3>4.1 Logical Data Model</h3>
<p>The entity-relationship model is in <strong>Appendix B</strong>, Figure B-2. It is a <em>logical</em> model
describing the data the university deals with, not a database schema.</p>
<table>
<thead>
<tr>
<th>Entity</th>
<th>Relationship</th>
</tr>
</thead>
<tbody>
<tr>
<td>Programme</td>
<td>1 → n Requirement Group · 1 → n Student</td>
</tr>
<tr>
<td>Requirement Group</td>
<td>n → n Course</td>
</tr>
<tr>
<td>Course</td>
<td>1 → n Section · 1 → 0..n Prerequisite Rule · n → 0..n Course (co-requisite)</td>
</tr>
<tr>
<td>Section</td>
<td>1 → n Meeting Pattern · 1 → n Enrollment · 1 → 0..n Waitlist Entry · 1 → 0..n Override Request</td>
</tr>
<tr>
<td>Student</td>
<td>1 → n Enrollment · 1 → n Transcript Entry · 1 → 0..n Advising Hold · 1 → 0..n Advising Record · 1 → 0..1 Financial Standing</td>
</tr>
<tr>
<td>Registration Window</td>
<td>1 → 3 Priority Wave</td>
</tr>
<tr>
<td>Degree Audit Result</td>
<td>1 → n Requirement Group Result · 1 → 1 Student</td>
</tr>
</tbody>
</table>
<p>Two relationships constrain design more than the rest. <strong>Course → Course
(co-requisite)</strong> is symmetric and must be stored as such, or BR-20 becomes
unenforceable in one direction. <strong>Programme rules are versioned by catalog year</strong>
(CO-6), so the Programme → Requirement Group relationship is not simply current-state:
every prior version must remain retrievable.</p>
<h3>4.2 Data Dictionary</h3>
<p>The definition, composition, type, length and allowed values of every data element are
held in the separate <strong>Data Dictionary</strong> document (R4), which contains 91 entries.</p>
<h3>4.3 Reports</h3>
<table>
<thead>
<tr>
<th>ID</th>
<th>Report</th>
<th>Content and sort order</th>
<th>Audience</th>
<th>Frequency</th>
</tr>
</thead>
<tbody>
<tr>
<td>RPT-1</td>
<td>Registration window summary</td>
<td>Enrollments, refusals by reason, overrides outstanding, waitlist depth; by faculty</td>
<td>Registrar, Vice-Rector</td>
<td>At window close</td>
</tr>
<tr>
<td>RPT-2</td>
<td>Capacity utilisation</td>
<td>Enrollment against capacity per section; sorted by utilisation ascending</td>
<td>Department Head</td>
<td>Weekly during registration</td>
</tr>
<tr>
<td>RPT-3</td>
<td>Override activity and SLA</td>
<td>Requests, decisions, median and 90th-percentile decision time against BR-12; by department</td>
<td>Registrar</td>
<td>Weekly during registration</td>
</tr>
<tr>
<td>RPT-4</td>
<td>Section viability</td>
<td>Sections below minimum viable enrollment with days to add/drop; sorted by shortfall</td>
<td>Department Head</td>
<td>Daily from the BR-10 checkpoint</td>
</tr>
<tr>
<td>RPT-5</td>
<td>Prerequisite exceptions</td>
<td>Enrollments returned Indeterminate or invalidated; sorted by date</td>
<td>Academic Office Staff</td>
<td>Daily during registration</td>
</tr>
<tr>
<td>RPT-6</td>
<td>Finance block impact</td>
<td>Students blocked at registration, with amount outstanding banded; <strong>no individual amounts to academic users</strong></td>
<td>Finance Officer</td>
<td>Daily during registration</td>
</tr>
<tr>
<td>RPT-7</td>
<td>Graduation risk</td>
<td>Students identified at risk of late graduation per BR-18; sorted by shortfall</td>
<td>Academic Advisor</td>
<td>Per semester</td>
</tr>
</tbody>
</table>
<p>Report layouts are deferred to design; this section specifies content, sort order,
audience and frequency.</p>
<h3>4.4 Data Acquisition, Integrity, Retention and Disposal</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Requirement</th>
</tr>
</thead>
<tbody>
<tr>
<td>DA-1</td>
<td>The system shall acquire student, transcript, curriculum and catalog data from the legacy system by a one-time migration, verified against control totals before the legacy freeze is lifted.</td>
</tr>
<tr>
<td>DA-2</td>
<td>The system shall flag as incomplete every transcript predating 2019, and shall cause prerequisite evaluation against it to return Indeterminate, in accordance with assumption A3.</td>
</tr>
<tr>
<td>DA-3</td>
<td>The system shall record, for every enrollment decision, the time, the outcome, the reason and every rule evaluated, whether the decision succeeded or failed.</td>
</tr>
<tr>
<td>DA-4</td>
<td>The system shall retain enrollment and academic records for the lifetime of the student record and shall not delete a transcript entry.</td>
</tr>
<tr>
<td>DA-5</td>
<td>The system shall retain advising notes for 7 years after a student's graduation or withdrawal, after which they shall be deleted.</td>
</tr>
<tr>
<td>DA-6</td>
<td>The system shall retain registration audit logs for 3 years.</td>
</tr>
<tr>
<td>DA-7</td>
<td>The system shall verify daily that every seat claimed is matched by exactly one enrollment or one approved override, and shall raise a data-quality alert on any discrepancy.</td>
</tr>
<tr>
<td>DA-8</td>
<td>The system shall retain every prior version of a catalog-year-versioned rule, in accordance with CO-6.</td>
</tr>
</tbody>
</table>
<hr />
<h3>5. External Interface Requirements</h3>
<h3>5.1 User Interfaces</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Requirement</th>
</tr>
</thead>
<tbody>
<tr>
<td>UI-1</td>
<td>The system shall provide four interfaces: the student interface, the academic staff interface, the department head interface and the advisor interface.</td>
</tr>
<tr>
<td>UI-2</td>
<td>The student interface shall be usable on a mobile device at 360 px viewport width for catalog, planning, enrollment, degree audit and account views.</td>
</tr>
<tr>
<td>UI-3</td>
<td>Every refusal shall state which specific rule refused the request, the value that caused it, and what the user can do next.</td>
</tr>
<tr>
<td>UI-4</td>
<td>Every irreversible action shall require a confirmation that names the object being acted on and states the consequence.</td>
</tr>
<tr>
<td>UI-5</td>
<td>The system shall require no training material for the student interface; a student shall be able to complete an enrollment without instruction.</td>
</tr>
<tr>
<td>UI-6</td>
<td>Screen designs for the three most complex use cases are illustrated in R5; where R5 and this document differ, this document governs.</td>
</tr>
</tbody>
</table>
<h3>5.2 Software Interfaces</h3>
<table>
<thead>
<tr>
<th>ID</th>
<th>Interface</th>
<th>Direction</th>
<th>Content</th>
<th>Service level</th>
</tr>
</thead>
<tbody>
<tr>
<td>SI-1</td>
<td>University SSO — authentication</td>
<td>In</td>
<td>Authentication assertion and role claims (CO-1)</td>
<td>Per university standard</td>
</tr>
<tr>
<td>SI-2</td>
<td>Finance system — eligibility query</td>
<td>In</td>
<td>Outstanding balance and registration hold (CO-7)</td>
<td>Response within 5 s; Unknown after retry (Finance-3)</td>
</tr>
<tr>
<td>SI-3</td>
<td>Finance system — account detail</td>
<td>In</td>
<td>Charges, payments, instalment plan</td>
<td>Best effort; stale display permitted (Account-6)</td>
</tr>
<tr>
<td>SI-4</td>
<td>Timetable system — section catalog</td>
<td>In</td>
<td>Sections, meeting patterns, rooms, lecturers</td>
<td>Published at least 14 days before a window</td>
</tr>
<tr>
<td>SI-5</td>
<td>Timetable system — room capacity</td>
<td>In</td>
<td>Physical room capacity per section</td>
<td>Read at override decision time (Override-9)</td>
</tr>
<tr>
<td>SI-6</td>
<td>Learning management system — enrollment publication</td>
<td>Out</td>
<td>Confirmed enrollments and drops</td>
<td>Within 5 minutes of the change</td>
</tr>
<tr>
<td>SI-7</td>
<td>Learning management system — grade import</td>
<td>In</td>
<td>Final grades per student per section</td>
<td>Nightly; triggers Prereq-9 re-evaluation</td>
</tr>
<tr>
<td>SI-8</td>
<td>Notification service — student and staff messages</td>
<td>Out</td>
<td>Wave opening, override outcome, waitlist offer, cancellation</td>
<td>Within 5 minutes of the triggering event</td>
</tr>
</tbody>
</table>
<p><strong>SI-2 and SI-3 shall be isolated behind an adapter</strong> so that a synchronous API and a
nightly file exchange are interchangeable (CO-7, risk RI-1).</p>
<h3>5.3 Hardware Interfaces</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Requirement</th>
</tr>
</thead>
<tbody>
<tr>
<td>HI-1</td>
<td>The system shall require no special-purpose hardware.</td>
</tr>
<tr>
<td>HI-2</td>
<td>The system shall function on the student-owned devices in common use at NRU, including devices four years old on a 3G connection (OE-4).</td>
</tr>
</tbody>
</table>
<h3>5.4 Communications Interfaces</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Requirement</th>
</tr>
</thead>
<tbody>
<tr>
<td>CI-1</td>
<td>All communication between a browser and CARS shall use HTTPS with TLS 1.2 or later.</td>
</tr>
<tr>
<td>CI-2</td>
<td>All communication between CARS and any external system shall use HTTPS with TLS 1.2 or later.</td>
</tr>
<tr>
<td>CI-3</td>
<td>The system shall place no student identifier and no personal data in a URL query string that is written to an access log.</td>
</tr>
<tr>
<td>CI-4</td>
<td>Notifications shall contain no financial amount and no advising note; they shall link to the authenticated view instead.</td>
</tr>
</tbody>
</table>
<hr />
<h3>6. Quality Attributes</h3>
<p>Written in Planguage: SCALE, METER, MUST, PLAN. An attribute without a number is an
opinion, not a requirement.</p>
<h3>6.1 Performance and Scalability</h3>
<h4>QA-1 — Peak concurrent registration load</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Simultaneous authenticated sessions sustained with 95th-percentile response ≤ 2 s across catalog, planning and enrollment</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Load test at the rehearsal window, then observed live</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>4,200 concurrent sessions — the historical peak the legacy system could not serve</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>6,000 concurrent sessions (objective BO-1)</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>The legacy system degraded past 1,800 and crashed in three of the last four windows. This is the single number the project is judged on.</td>
</tr>
</tbody>
</table>
<h4>QA-2 — Enrollment transaction latency</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Seconds from a student submitting an enrollment request to receiving the decision</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Instrumented timing, 95th percentile, per wave opening</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 4 s at peak</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 1.5 s at peak; ≤ 0.8 s off peak</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>Seven rule evaluations and a capacity claim happen inside this number. A slow decision at a wave opening produces retries, which multiply the load that caused it.</td>
</tr>
</tbody>
</table>
<h4>QA-3 — Catalog read throughput</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Catalog reads served per second with 95th-percentile response ≤ 1 s</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Load test at 1.5× the projected peak</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>2,800 reads/second</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>4,200 reads/second</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>Browsing, not enrollment, is where the volume is (UC-01). The legacy system recomputed capacity per row per request; Catalog-3 permits a 60-second cache for exactly this reason.</td>
</tr>
</tbody>
</table>
<h4>QA-4 — Seat integrity under contention</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Number of seats issued to more than one student, or lost without being issued, per registration window</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Reconciliation per DA-7, plus fault-injection testing at peak concurrency</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>0</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>0</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>Requirement Enroll-6. A double-issued seat is discovered by a student arriving at a full classroom, which is the most expensive possible time to discover it.</td>
</tr>
</tbody>
</table>
<h3>6.2 Availability and Reliability</h3>
<h4>QA-5 — Availability during a registration window</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Percentage of minutes in an open registration window during which catalog, planning and enrollment are all available</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Uptime monitoring, per window</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>99.5%</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>100% — <strong>zero outages</strong> is the acceptance criterion in Vision and Scope §3.2</td>
</tr>
</tbody>
</table>
<h4>QA-6 — Recovery time during a window</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Minutes from an unplanned outage being detected to registration resuming</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Disaster-recovery rehearsal before each window</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 30 minutes with no enrollment lost</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 10 minutes with no enrollment lost</td>
</tr>
</tbody>
</table>
<h4>QA-7 — Atomicity of academic transactions</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Number of students left in a partial state — half a co-requisite pair, a swap with neither section, an override approved and neither enrolled nor recorded</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Fault-injection testing of enrollment, swap and override</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>0</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>0 (Enroll-8, Drop-3, Override-8)</td>
</tr>
</tbody>
</table>
<h3>6.3 Usability and Accessibility</h3>
<h4>QA-8 — Enrollment without instruction</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Percentage of first-time students who complete an enrollment unaided at the first attempt</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Observed session with 20 first-year volunteers before the rehearsal window</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≥ 90%</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≥ 97%</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>Requirement UI-5. There are 12,000 students and a 72-hour window; an interface needing support cannot be supported.</td>
</tr>
</tbody>
</table>
<h4>QA-9 — Comprehensibility of a refusal</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Percentage of refused students who can state, unprompted, why they were refused and what to do next</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Same observed session, refusal scenarios</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≥ 90%</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≥ 95%</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>A refusal nobody understands becomes an advising enquiry, which is the cost objective BO-6 exists to reduce.</td>
</tr>
</tbody>
</table>
<h4>QA-10 — Accessibility</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Conformance level achieved against WCAG 2.1 for the student interface</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Automated scan plus manual audit of the enrollment path</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>Level A, with no blocking issue on the enrollment path</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>Level AA</td>
</tr>
</tbody>
</table>
<h4>QA-11 — Mobile performance</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Seconds to interactive for the catalog on a four-year-old mid-range Android device on a 3G connection</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Device testing on the reference handset</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 6 s</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 3 s</td>
</tr>
</tbody>
</table>
<h3>6.4 Security and Privacy</h3>
<h4>QA-12 — Authorization enforcement</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Percentage of privileged operations enforcing the required role on the server rather than only in the interface</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Security review of every operation in section 3 before release</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>100%</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>100%, with automated tests covering override decision (BR-11), hold management and window configuration</td>
</tr>
</tbody>
</table>
<h4>QA-13 — Data isolation between students</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Number of requests in which one student can obtain another student's transcript, audit, advising note or financial data</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Penetration test of every student-facing endpoint, including identifier substitution</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>0</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>0</td>
</tr>
</tbody>
</table>
<h4>QA-14 — Audit completeness</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Percentage of enrollment decisions, override decisions and hold changes for which actor, time and reason can be retrieved</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Sampling of 50 records per category during requirements validation</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>100%</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>100%, retrievable within 5 seconds</td>
</tr>
</tbody>
</table>
<h3>6.5 Maintainability</h3>
<h4>QA-15 — Cost of a regulation change</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Working days to apply a change to any rule marked Dynamic in R3 §2.2, for the next catalog year, without a software release</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Measured when the 2027 Academic Regulations are applied</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 3 days, with no code change</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 1 day (constraints CO-5, CO-6)</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>The regulations are revised annually. A system that needs a release to absorb that is out of date within a year of going live.</td>
</tr>
</tbody>
</table>
<hr />
<h3>7. Internationalization and Localization Requirements</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Requirement</th>
</tr>
</thead>
<tbody>
<tr>
<td>IL-1</td>
<td>The system shall present student-facing interfaces in Vietnamese, with English available for programmes taught in English.</td>
</tr>
<tr>
<td>IL-2</td>
<td>The system shall accept and store Vietnamese diacritics in every name field, and shall sort Vietnamese text using Vietnamese collation rules.</td>
</tr>
<tr>
<td>IL-3</td>
<td>The system shall present dates as DD/MM/YYYY and times in 24-hour form.</td>
</tr>
<tr>
<td>IL-4</td>
<td>The system shall present monetary amounts in Vietnamese dong with no decimal fraction.</td>
</tr>
<tr>
<td>IL-5</td>
<td>The system shall store every timestamp with an explicit UTC offset and present it in Asia/Ho_Chi_Minh.</td>
</tr>
</tbody>
</table>
<hr />
<h3>8. Other Requirements</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Requirement</th>
</tr>
</thead>
<tbody>
<tr>
<td>OR-1</td>
<td>The system shall retain and erase personal data in accordance with Decree 13/2023/ND-CP and the university records retention schedule (DA-4 to DA-6).</td>
</tr>
<tr>
<td>OR-2</td>
<td>The system shall be installable into a new environment from version-controlled configuration with no undocumented manual step.</td>
</tr>
<tr>
<td>OR-3</td>
<td>The system shall be delivered with an operational runbook covering window opening, load incidents and the manual enrollment fallback.</td>
</tr>
<tr>
<td>OR-4</td>
<td>The migration in DA-1 shall be repeatable against a non-production environment without residue from previous runs.</td>
</tr>
<tr>
<td>OR-5</td>
<td>The system shall provide a documented manual fallback permitting Academic Office Staff to record a single enrollment during an incident, with reconciliation afterwards.</td>
</tr>
</tbody>
</table>
<hr />
<h2>Appendix A: Glossary</h2>
<table>
<thead>
<tr>
<th>Term</th>
<th>Definition</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Add/drop period</strong></td>
<td>The period after a window in which a student may drop with no transcript record; BR-16</td>
</tr>
<tr>
<td><strong>Advising hold</strong></td>
<td>A block preventing enrollment until an advisor lifts it; BR-14</td>
</tr>
<tr>
<td><strong>Catalog year</strong></td>
<td>The academic year whose regulations a student is assessed against; CO-6</td>
</tr>
<tr>
<td><strong>Co-requisite</strong></td>
<td>A course that must be taken in the same semester as another; BR-20</td>
</tr>
<tr>
<td><strong>Credit limit</strong></td>
<td>Maximum credits a student may enroll in per semester; BR-04</td>
</tr>
<tr>
<td><strong>Degree audit</strong></td>
<td>The evaluation of a student's record against their programme's requirements</td>
</tr>
<tr>
<td><strong>Minimum viable enrollment</strong></td>
<td>Enrollment below which a section is under-enrolled; BR-15</td>
</tr>
<tr>
<td><strong>Override</strong></td>
<td>Permission for a student to enter a section they cannot otherwise take; UC-06</td>
</tr>
<tr>
<td><strong>Prerequisite</strong></td>
<td>A course that must be completed before another; BR-02</td>
</tr>
<tr>
<td><strong>Priority wave</strong></td>
<td>One cohort's registration opening period; BR-06</td>
</tr>
<tr>
<td><strong>Registration window</strong></td>
<td>The 72-hour period in which registration is open</td>
</tr>
<tr>
<td><strong>Remaining capacity</strong></td>
<td>Seats still available in a section; BR-03</td>
</tr>
<tr>
<td><strong>Section</strong></td>
<td>One scheduled offering of a course in one semester</td>
</tr>
<tr>
<td><strong>Waitlist</strong></td>
<td>The queue for a full section; BR-08, BR-09</td>
</tr>
</tbody>
</table>
<h2>Appendix B: Analysis Models</h2>
<table>
<thead>
<tr>
<th>Figure</th>
<th>Model</th>
<th>Location</th>
</tr>
</thead>
<tbody>
<tr>
<td>B-1</td>
<td>System context diagram</td>
<td><code>diagrams/use-case-diagram.png</code> (boundary and external actors)</td>
</tr>
<tr>
<td>B-2</td>
<td>Logical data model (ERD)</td>
<td><em>to be produced in design; entities and relationships listed in §4.1</em></td>
</tr>
<tr>
<td>B-3</td>
<td>Use case diagram</td>
<td><code>diagrams/use-case-diagram.png</code> · editable source <code>diagrams/use-case-diagram.drawio</code></td>
</tr>
<tr>
<td>B-4</td>
<td>Enrollment state model</td>
<td>States listed under <em>Enrollment Status</em> in the Data Dictionary; transitions given by use case postconditions</td>
</tr>
<tr>
<td>B-5</td>
<td>Override request state model</td>
<td>States listed under <em>Request Status</em>; transitions given by UC-06</td>
</tr>
<tr>
<td>B-6</td>
<td>Screen mock-ups</td>
<td><code>mockups/</code> — see R5</td>
</tr>
</tbody>
</table>
<h2>Appendix C: TBD List</h2>
<table>
<thead>
<tr>
<th>#</th>
<th>Open question</th>
<th>Affects</th>
<th>Owner</th>
<th>Target</th>
</tr>
</thead>
<tbody>
<tr>
<td>TBD-1</td>
<td>Does the credit limit in BR-04 count in-progress repeats, or only new enrollments?</td>
<td>Enroll-5</td>
<td>Registrar</td>
<td>Week 6</td>
</tr>
<tr>
<td>TBD-2</td>
<td>Is the 48-hour SLA in BR-12 working hours or calendar hours?</td>
<td>Override-3, Override-6</td>
<td>Registrar</td>
<td>Week 6</td>
</tr>
<tr>
<td>TBD-3</td>
<td>When a co-requisite pair is broken by a cancellation, is the survivor dropped automatically or referred to an advisor?</td>
<td>Drop-4, Viability-3</td>
<td>Registrar</td>
<td>Week 7</td>
</tr>
<tr>
<td>TBD-4</td>
<td>Does the finance threshold in BR-05 apply per semester or cumulatively?</td>
<td>Finance-1</td>
<td>Finance Officer</td>
<td>Week 7</td>
</tr>
<tr>
<td>TBD-5</td>
<td>Which programmes cannot be expressed as machine-evaluable rules, and how many students do they affect?</td>
<td>Prereq-5, assumption A2</td>
<td>Registrar, curriculum committees</td>
<td>Week 8 — <strong>blocks the BO-2 commitment</strong></td>
</tr>
</tbody>
</table>
<h2>Appendix D: Requirements Traceability Matrix</h2>
<table>
<thead>
<tr>
<th>Feature (R1 §2.1)</th>
<th>SRS section</th>
<th>Use case (R2)</th>
<th>Functional requirements</th>
<th>Business rules (R3)</th>
<th>Objective</th>
</tr>
</thead>
<tbody>
<tr>
<td>FE-1 Catalog search</td>
<td>3.1</td>
<td>UC-01</td>
<td>Catalog-1 … Catalog-7</td>
<td>BR-03, BR-06</td>
<td>BO-1</td>
</tr>
<tr>
<td>FE-2 Schedule planning</td>
<td>3.2</td>
<td>UC-02</td>
<td>Plan-1 … Plan-7</td>
<td>BR-02, BR-04, BR-07, BR-14, BR-20</td>
<td>BO-1</td>
</tr>
<tr>
<td>FE-3 Enrollment transaction</td>
<td>3.3</td>
<td>UC-03</td>
<td>Enroll-1 … Enroll-10</td>
<td>BR-01, BR-03, BR-04, BR-06, BR-07, BR-14, BR-20</td>
<td>BO-1, BO-2, BO-4</td>
</tr>
<tr>
<td>FE-4 Prerequisite engine</td>
<td>3.4</td>
<td>UC-04</td>
<td>Prereq-1 … Prereq-9</td>
<td>BR-02, BR-20</td>
<td>BO-2</td>
</tr>
<tr>
<td>FE-5 Financial eligibility</td>
<td>3.5</td>
<td>UC-05</td>
<td>Finance-1 … Finance-7</td>
<td>BR-05, BR-17</td>
<td>BO-4</td>
</tr>
<tr>
<td>FE-6 Override workflow</td>
<td>3.6</td>
<td>UC-06</td>
<td>Override-1 … Override-9</td>
<td>BR-02, BR-03, BR-11, BR-12</td>
<td>BO-3</td>
</tr>
<tr>
<td>FE-7 Waitlist</td>
<td>3.7</td>
<td>UC-07</td>
<td>Wait-1 … Wait-8</td>
<td>BR-03, BR-07, BR-08, BR-09</td>
<td>BO-3</td>
</tr>
<tr>
<td>FE-8 Drop and swap</td>
<td>3.8</td>
<td>UC-08</td>
<td>Drop-1 … Drop-6</td>
<td>BR-04, BR-07, BR-08, BR-16, BR-20</td>
<td>—</td>
</tr>
<tr>
<td>FE-9 Degree audit</td>
<td>3.9</td>
<td>UC-09</td>
<td>Audit-1 … Audit-10</td>
<td>BR-02, BR-13, BR-18, BR-20</td>
<td>BO-6</td>
</tr>
<tr>
<td>FE-10 Account balance</td>
<td>3.10</td>
<td>UC-10</td>
<td>Account-1 … Account-6</td>
<td>BR-05, BR-17</td>
<td>BO-6</td>
</tr>
<tr>
<td>FE-11 Section viability</td>
<td>3.11</td>
<td>UC-11</td>
<td>Viability-1 … Viability-8</td>
<td>BR-07, BR-10, BR-15, BR-18, BR-19</td>
<td>BO-5</td>
</tr>
<tr>
<td>FE-12 Window administration</td>
<td>3.12</td>
<td>UC-12</td>
<td>Window-1 … Window-8</td>
<td>BR-06</td>
<td>BO-1</td>
</tr>
<tr>
<td>FE-13 Advising and holds</td>
<td>3.13</td>
<td>UC-13</td>
<td>Advise-1 … Advise-7</td>
<td>BR-14</td>
<td>BO-6</td>
</tr>
<tr>
<td>FE-14 Reporting</td>
<td>3.14</td>
<td>UC-14</td>
<td>Report-1 … Report-7</td>
<td>BR-03, BR-10, BR-12, BR-13</td>
<td>All</td>
</tr>
</tbody>
</table>
<p><strong>Objectives covered by quality attributes rather than features:</strong> the outage half of
BO-1 by QA-1, QA-3 and QA-5; the "zero incorrect enrollments" half of BO-2 by QA-4 and
Prereq-5; the advising-reduction half of BO-6 by QA-9.</p>`,
  ].join('\n'),
};

const TP1L5 = {
  title: "W1.5 — Deliverable 5: data dictionary, 91 entries|||W1.5 — Deliverable 5: data dictionary, 91 mục",
  slug: "swr302-tp1-goi-05-data-dictionary",
  type: 'DOCUMENT',
  description: "Data dictionary đầy đủ theo Chapter 13: 91 mục theo bảng chữ cái, đúng ký pháp, mọi phần tử trong cấu trúc có mục riêng. Ghi chú giải thích vì sao Catalog Year, NeedsReview và Queue Position phải tồn tại.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP1 · Deliverable 5</span>
<h2>91 entries, and four that carry an argument</h2>
<p class="lead">Section 3 is where a data dictionary stops being clerical. Four entries exist for reasons worth understanding:</p>
<ul>
<li><strong>Catalog Year</strong> — the most consequential entry and the easiest to omit. Without it, every annual curriculum revision silently re-assesses every existing student.</li>
<li><strong>Group Status includes NeedsReview</strong> — the three obvious values (Satisfied, InProgress, Outstanding) force the engine to guess when it cannot evaluate a requirement. A degree audit that guesses is the failure that produced the complaint to the Rector.</li>
<li><strong>Queue Position is stored, not computed</strong> — computing it from Joined At would be equivalent, until a student is skipped for ineligibility (UC-07 flow 7.4) and must keep their place. Storing it makes the fairness rule expressible.</li>
<li><strong>Financial Standing carries Retrieved At</strong> — CARS does not own this data, so it shows the age rather than hiding it.</li>
</ul>
<div class="pitfall"><strong>The check a grader actually runs:</strong> pick a structure at random and follow every name inside it. <code>Ship To Address</code> in TP2, <code>Section</code> here — Section Identifier, Course Code, Semester Code, Lecturer Name, Published Capacity, Minimum Viable Enrollment, Section Status and Meeting Pattern all have their own alphabetical entries, and Meeting Pattern's four components do too.</div>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP1 · Deliverable 5</span>
<h2>91 mục, và bốn mục mang theo một lập luận</h2>
<p class="lead">Mục 3 là chỗ data dictionary thôi là việc bàn giấy. Bốn mục tồn tại vì những lý do đáng hiểu:</p>
<ul>
<li><strong>Catalog Year</strong> — mục hệ trọng nhất và dễ bỏ sót nhất. Thiếu nó, mỗi lần sửa chương trình hằng năm sẽ âm thầm đánh giá lại mọi sinh viên đang học.</li>
<li><strong>Group Status có giá trị NeedsReview</strong> — ba giá trị hiển nhiên (Satisfied, InProgress, Outstanding) buộc bộ máy phải ĐOÁN khi không đánh giá được một yêu cầu. Một degree audit biết đoán chính là thất bại đã dẫn tới đơn thư gửi Hiệu trưởng.</li>
<li><strong>Queue Position được LƯU, không phải tính ra</strong> — tính từ Joined At thì tương đương, cho tới khi một sinh viên bị bỏ qua vì tạm không đủ điều kiện (UC-07 luồng 7.4) và phải giữ nguyên chỗ. Lưu lại mới diễn đạt được luật công bằng đó.</li>
<li><strong>Financial Standing có Retrieved At</strong> — CARS không sở hữu dữ liệu này, nên nó hiện tuổi của số liệu thay vì giấu đi.</li>
</ul>
<div class="pitfall"><strong>Phép kiểm người chấm thật sự chạy:</strong> bốc ngẫu nhiên một cấu trúc rồi dò từng cái tên bên trong. <code>Ship To Address</code> ở TP2, <code>Section</code> ở đây — Section Identifier, Course Code, Semester Code, Lecturer Name, Published Capacity, Minimum Viable Enrollment, Section Status và Meeting Pattern đều có mục riêng theo bảng chữ cái, và bốn thành phần của Meeting Pattern cũng vậy.</div>`,
    ),
    `<h2>Data Dictionary</h2>
<h2>for the Campus Academic and Registration System (CARS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Member 4 name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Northern Regional University (NRU)
Last updated 17 September 2026</p>
<hr />
<h3>Revision History</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Date</th>
<th>Reason For Changes</th>
<th>Version</th>
</tr>
</thead>
<tbody>
<tr>
<td>Member 4, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Elements harvested while use cases UC-01…UC-14 were written</td>
<td>0.9</td>
</tr>
<tr>
<td>Member 4, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Structures completed, cross-checked against business rules</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Notation</h3>
<p>Per <em>Guidance for Data Dictionaries</em> (Wiegers &amp; Beatty, Chapter 13):</p>
<table>
<thead>
<tr>
<th>Symbol</th>
<th>Meaning</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>+</code></td>
<td>composed of / and</td>
</tr>
<tr>
<td><code>( )</code></td>
<td>optional element</td>
</tr>
<tr>
<td><code>{ }</code></td>
<td>repeating group</td>
</tr>
<tr>
<td><code>min:max</code></td>
<td>allowed number of repeats; <code>n</code> means unlimited</td>
</tr>
<tr>
<td><code>[ a \\| b ]</code></td>
<td>either–or</td>
</tr>
<tr>
<td><code>" "</code></td>
<td>literal text</td>
</tr>
</tbody>
</table>
<p>Entries are ordered <strong>alphabetically</strong>. Structures leave <em>Length</em> and <em>Values</em> blank.
Every element named inside a structure has <strong>its own entry</strong>. Where a value is governed
by a business rule, the <em>Values</em> column cites the rule ID rather than repeating it.</p>
<hr />
<h3>2. Data Dictionary</h3>
<table>
<thead>
<tr>
<th>Data Element</th>
<th>Description</th>
<th>Composition or Data Type</th>
<th>Length</th>
<th>Values</th>
</tr>
</thead>
<tbody>
<tr>
<td>Advice Notes</td>
<td>What an advisor recorded during an advising meeting</td>
<td>alphanumeric</td>
<td>4000</td>
<td>Visible to the advisor and the student's other advisors; <strong>not</strong> visible to the student (UC-13 flow 13.4)</td>
</tr>
<tr>
<td>Advising Hold</td>
<td>A block placed on a student that prevents enrollment until an advisor lifts it</td>
<td>Hold Identifier + Student Identifier + Hold Reason + Placed By + Placed At + (Expires At) + (Lifted By) + (Lifted At)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Advising Record</td>
<td>The record of one advising meeting</td>
<td>Record Identifier + Student Identifier + Advisor Identifier + Meeting Date + Advice Notes</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Advisor Identifier</td>
<td>Unique identifier of an academic advisor</td>
<td>alphanumeric</td>
<td>12</td>
<td>Must exist as a staff record</td>
</tr>
<tr>
<td>Catalog Year</td>
<td>The academic year whose regulations a student is assessed against</td>
<td>numeric, YYYY</td>
<td>4</td>
<td>Set at matriculation and never changed; governs BR-02, BR-04 and BR-13 (UC-09 exception 9.0.E2)</td>
</tr>
<tr>
<td>Completion Percentage</td>
<td>Proportion of a programme a student has completed</td>
<td>decimal</td>
<td>5</td>
<td>0.00–100.00; computed per BR-13</td>
</tr>
<tr>
<td>Corequisite Course Code</td>
<td>A course that must be taken in the same semester as another</td>
<td>alphanumeric</td>
<td>12</td>
<td>Must exist as a Course Code; see BR-20</td>
</tr>
<tr>
<td>Course</td>
<td>A unit of study offered by a faculty</td>
<td>Course Code + Course Title + Credits + Faculty Code + 0:n{Prerequisite Rule} + 0:n{Corequisite Course Code}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Course Code</td>
<td>Unique identifier of a course</td>
<td>alphanumeric</td>
<td>12</td>
<td>Format: three to four letters then three digits, e.g. SWR302</td>
</tr>
<tr>
<td>Course Title</td>
<td>Human-readable name of a course</td>
<td>alphanumeric</td>
<td>200</td>
<td>Not blank</td>
</tr>
<tr>
<td>Credits</td>
<td>Credit value of a course</td>
<td>integer</td>
<td>2</td>
<td>1–6</td>
</tr>
<tr>
<td>Credits Applied</td>
<td>Credits counted toward one requirement group</td>
<td>integer</td>
<td>3</td>
<td>≥ 0</td>
</tr>
<tr>
<td>Credits Earned</td>
<td>Credits a student obtained from a completed course</td>
<td>integer</td>
<td>2</td>
<td>0 if the course was failed</td>
</tr>
<tr>
<td>Credits Required</td>
<td>Credits a requirement group demands</td>
<td>integer</td>
<td>3</td>
<td>&gt; 0</td>
</tr>
<tr>
<td>Day Of Week</td>
<td>Day on which a section meets</td>
<td>alphabetic</td>
<td>10</td>
<td>[ Monday | Tuesday | Wednesday | Thursday | Friday | Saturday ]</td>
</tr>
<tr>
<td>Decided At</td>
<td>Time an override decision was recorded</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Blank while the request is pending; drives the 48-hour measurement in BR-12</td>
</tr>
<tr>
<td>Decided By</td>
<td>The Department Head or delegate who decided an override</td>
<td>alphanumeric</td>
<td>12</td>
<td>Must hold the Department Head role for the section's department (BR-11)</td>
</tr>
<tr>
<td>Decision Reason</td>
<td>Free text explaining an override decision</td>
<td>alphanumeric</td>
<td>1000</td>
<td>Mandatory for both approval and decline (UC-06 POST-3)</td>
</tr>
<tr>
<td>Degree Audit Result</td>
<td>The evaluated state of a student's progress toward their programme</td>
<td>Student Identifier + Programme Code + Catalog Year + Completion Percentage + 1:n{Requirement Group Result}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Eligibility Rule</td>
<td>The expression that determines which students belong to a priority wave</td>
<td>alphanumeric</td>
<td>500</td>
<td>Evaluated against Year Of Study and Programme Code; waves must not overlap (UC-12 exception 12.0.E2)</td>
</tr>
<tr>
<td>Email Address</td>
<td>University email address used for notifications</td>
<td>alphanumeric</td>
<td>254</td>
<td>Must contain exactly one "@"; assumption A6</td>
</tr>
<tr>
<td>End Time</td>
<td>Time a section's meeting ends</td>
<td>time, HH:MM</td>
<td>5</td>
<td>Later than Start Time</td>
</tr>
<tr>
<td>Enrolled At</td>
<td>Time an enrollment was recorded</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>System-generated</td>
</tr>
<tr>
<td>Enrollment</td>
<td>A student's registration in one section</td>
<td>Enrollment Identifier + Student Identifier + Section Identifier + Enrollment Status + Enrolled At + (Override Request Identifier)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Enrollment Identifier</td>
<td>Unique identifier of an enrollment</td>
<td>alphanumeric</td>
<td>20</td>
<td>System-generated</td>
</tr>
<tr>
<td>Enrollment Status</td>
<td>Current state of an enrollment</td>
<td>alphabetic</td>
<td>14</td>
<td>[ Enrolled | Dropped | Withdrawn | Cancelled | Invalidated ]; Invalidated results from UC-04 exception 4.0.E3</td>
</tr>
<tr>
<td>Expires At</td>
<td>Time a hold or an offer ceases to apply</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>For a waitlist offer, 24 hours after issue (BR-09)</td>
</tr>
<tr>
<td>Faculty Code</td>
<td>Identifier of the faculty owning a course or programme</td>
<td>alphanumeric</td>
<td>8</td>
<td>One of the six NRU faculties</td>
</tr>
<tr>
<td>Final Grade</td>
<td>Grade awarded for a completed course</td>
<td>alphanumeric</td>
<td>4</td>
<td>[ A | B+ | B | C+ | C | D+ | D | F | P | W ]; compared against Minimum Grade for BR-02</td>
</tr>
<tr>
<td>Financial Standing</td>
<td>A student's financial position as reported by the finance system</td>
<td>Student Identifier + Outstanding Balance + Finance Hold Flag + Retrieved At</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Finance Hold Flag</td>
<td>Whether the finance system has placed an explicit registration block</td>
<td>alphabetic</td>
<td>3</td>
<td>[ Yes | No ]; blocks enrollment regardless of balance (BR-05)</td>
</tr>
<tr>
<td>Full Name</td>
<td>Student's name as recorded at matriculation</td>
<td>alphabetic</td>
<td>100</td>
<td>Not blank; stores Vietnamese diacritics</td>
</tr>
<tr>
<td>Group Name</td>
<td>Name of a requirement group within a programme</td>
<td>alphanumeric</td>
<td>100</td>
<td>e.g. "Core", "Major electives", "General education"</td>
</tr>
<tr>
<td>Group Status</td>
<td>Evaluated state of one requirement group</td>
<td>alphabetic</td>
<td>14</td>
<td>[ Satisfied | InProgress | Outstanding | NeedsReview ]; NeedsReview per UC-09 POST-3</td>
</tr>
<tr>
<td>Group Type</td>
<td>Kind of requirement group</td>
<td>alphabetic</td>
<td>14</td>
<td>[ Core | Major | Elective | General | CreditTotal ]</td>
</tr>
<tr>
<td>Hold Identifier</td>
<td>Unique identifier of an advising hold</td>
<td>alphanumeric</td>
<td>20</td>
<td>System-generated</td>
</tr>
<tr>
<td>Hold Reason</td>
<td>Category and explanation of an advising hold</td>
<td>alphanumeric</td>
<td>500</td>
<td>Category visible to the student; explanation is not (UC-13 flow 13.4)</td>
</tr>
<tr>
<td>Joined At</td>
<td>Time a student joined a waitlist</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Determines queue position within a priority wave</td>
</tr>
<tr>
<td>Justification</td>
<td>The student's stated reason for requesting a capacity override</td>
<td>alphanumeric</td>
<td>1000</td>
<td>Mandatory; shown to the Department Head at UC-06 step 4</td>
</tr>
<tr>
<td>Lecturer Name</td>
<td>Name of the lecturer teaching a section</td>
<td>alphabetic</td>
<td>100</td>
<td>Supplied by the timetable system</td>
</tr>
<tr>
<td>Lifted At</td>
<td>Time an advising hold was lifted</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Blank while the hold is active</td>
</tr>
<tr>
<td>Lifted By</td>
<td>Advisor who lifted an advising hold</td>
<td>alphanumeric</td>
<td>12</td>
<td>Must be an advisor assigned to the student</td>
</tr>
<tr>
<td>Meeting Date</td>
<td>Date of an advising meeting</td>
<td>date, YYYY-MM-DD</td>
<td>10</td>
<td>Not in the future</td>
</tr>
<tr>
<td>Meeting Pattern</td>
<td>One scheduled meeting of a section</td>
<td>Day Of Week + Start Time + End Time + Room Code</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Minimum Grade</td>
<td>Lowest grade that satisfies a prerequisite</td>
<td>alphanumeric</td>
<td>4</td>
<td>A Final Grade value; default "D"</td>
</tr>
<tr>
<td>Minimum Viable Enrollment</td>
<td>Enrollment below which a section is under-enrolled</td>
<td>integer</td>
<td>3</td>
<td>Default 15, configurable per faculty and per section (BR-15)</td>
</tr>
<tr>
<td>Outstanding Balance</td>
<td>Amount a student currently owes</td>
<td>decimal, VND</td>
<td>12</td>
<td>≥ 0; compared against the registration threshold in BR-05</td>
</tr>
<tr>
<td>Override Request</td>
<td>A student's request for a place in a section they cannot otherwise take</td>
<td>Override Request Identifier + Student Identifier + Section Identifier + Request Ground + Justification + Submitted At + Request Status + (Decided By) + (Decided At) + (Decision Reason)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Override Request Identifier</td>
<td>Unique identifier of an override request</td>
<td>alphanumeric</td>
<td>20</td>
<td>System-generated</td>
</tr>
<tr>
<td>Placed At</td>
<td>Time an advising hold was placed</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>System-generated</td>
</tr>
<tr>
<td>Placed By</td>
<td>Advisor or registrar who placed an advising hold</td>
<td>alphanumeric</td>
<td>12</td>
<td>Must hold an authorised role</td>
</tr>
<tr>
<td>Prerequisite Course Code</td>
<td>A course that must be completed before another</td>
<td>alphanumeric</td>
<td>12</td>
<td>Must exist as a Course Code</td>
</tr>
<tr>
<td>Prerequisite Rule</td>
<td>One prerequisite condition attached to a course</td>
<td>Prerequisite Course Code + Minimum Grade</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Priority Wave</td>
<td>One cohort's registration opening period</td>
<td>Wave Name + Wave Start + Wave End + Eligibility Rule</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Programme</td>
<td>A degree programme a student is enrolled in</td>
<td>Programme Code + Programme Name + Faculty Code + Total Credits Required + 1:n{Requirement Group}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Programme Code</td>
<td>Unique identifier of a degree programme</td>
<td>alphanumeric</td>
<td>12</td>
<td>Versioned by Catalog Year</td>
</tr>
<tr>
<td>Programme Name</td>
<td>Human-readable name of a programme</td>
<td>alphanumeric</td>
<td>200</td>
<td>Not blank</td>
</tr>
<tr>
<td>Published Capacity</td>
<td>Number of seats a section offers</td>
<td>integer</td>
<td>4</td>
<td>&gt; 0; used by BR-03</td>
</tr>
<tr>
<td>Queue Position</td>
<td>A student's place in a waitlist</td>
<td>integer</td>
<td>4</td>
<td>≥ 1; assigned by Joined At within priority wave; never altered except per UC-07</td>
</tr>
<tr>
<td>Record Identifier</td>
<td>Unique identifier of an advising record</td>
<td>alphanumeric</td>
<td>20</td>
<td>System-generated</td>
</tr>
<tr>
<td>Request Ground</td>
<td>The basis on which an override is requested</td>
<td>alphabetic</td>
<td>20</td>
<td>[ SectionFull | PrerequisiteUnmet | TimetableNecessity ]</td>
</tr>
<tr>
<td>Request Status</td>
<td>Current state of an override request</td>
<td>alphabetic</td>
<td>12</td>
<td>[ Pending | Approved | Declined | Expired | Withdrawn | Void ]; a request never leaves Pending silently (UC-06 POST-1)</td>
</tr>
<tr>
<td>Requirement Group</td>
<td>One set of programme requirements</td>
<td>Group Name + Group Type + Credits Required + 1:n{Course Code}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Requirement Group Result</td>
<td>The evaluated state of one requirement group for one student</td>
<td>Group Name + Group Status + Credits Applied + 1:n{Course Code}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Retrieved At</td>
<td>Time financial data was read from the finance system</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Displayed with the figures (UC-10 POST-3)</td>
</tr>
<tr>
<td>Room Code</td>
<td>Identifier of the room a section meets in</td>
<td>alphanumeric</td>
<td>12</td>
<td>Supplied by the timetable system; CARS never edits it (EX-3)</td>
</tr>
<tr>
<td>Section</td>
<td>One scheduled offering of a course in one semester</td>
<td>Section Identifier + Course Code + Semester Code + Lecturer Name + Published Capacity + Minimum Viable Enrollment + Section Status + 1:n{Meeting Pattern}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Section Identifier</td>
<td>Unique identifier of a section</td>
<td>alphanumeric</td>
<td>20</td>
<td>System-generated</td>
</tr>
<tr>
<td>Section Status</td>
<td>Current state of a section</td>
<td>alphabetic</td>
<td>14</td>
<td>[ Planned | Open | Full | Cancelled | Closed ]</td>
</tr>
<tr>
<td>Semester Code</td>
<td>Identifier of an academic semester</td>
<td>alphanumeric</td>
<td>10</td>
<td>Format YYYY-S, e.g. 2026-1</td>
</tr>
<tr>
<td>Start Time</td>
<td>Time a section's meeting begins</td>
<td>time, HH:MM</td>
<td>5</td>
<td>Earlier than End Time</td>
</tr>
<tr>
<td>Student</td>
<td>A person enrolled in a programme at the university</td>
<td>Student Identifier + Full Name + Email Address + Programme Code + Catalog Year + Year Of Study + Advisor Identifier + Student Status</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Student Identifier</td>
<td>Unique identifier of a student</td>
<td>alphanumeric</td>
<td>12</td>
<td>Assigned at matriculation; the join key across CARS, the finance system and the learning management system</td>
</tr>
<tr>
<td>Student Status</td>
<td>Current enrolment standing of a student</td>
<td>alphabetic</td>
<td>14</td>
<td>[ Active | Suspended | Graduated | Withdrawn | OnLeave ]; only Active students may register</td>
</tr>
<tr>
<td>Submitted At</td>
<td>Time an override request was submitted</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Starts the 48-hour clock in BR-12</td>
</tr>
<tr>
<td>Total Credits Required</td>
<td>Credits needed to complete a programme</td>
<td>integer</td>
<td>3</td>
<td>&gt; 0; the denominator in BR-13</td>
</tr>
<tr>
<td>Transcript Entry</td>
<td>One completed course on a student's academic record</td>
<td>Student Identifier + Course Code + Semester Code + Final Grade + Credits Earned + (Transfer Institution)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Transfer Institution</td>
<td>Institution from which a credit was transferred</td>
<td>alphanumeric</td>
<td>200</td>
<td>Present only for approved transfer credit (UC-04 flow 4.3)</td>
</tr>
<tr>
<td>Waitlist Entry</td>
<td>A student's position in a section's waitlist</td>
<td>Waitlist Entry Identifier + Student Identifier + Section Identifier + Queue Position + Joined At + Waitlist Status + (Expires At)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Waitlist Entry Identifier</td>
<td>Unique identifier of a waitlist entry</td>
<td>alphanumeric</td>
<td>20</td>
<td>System-generated</td>
</tr>
<tr>
<td>Waitlist Status</td>
<td>Current state of a waitlist entry</td>
<td>alphabetic</td>
<td>12</td>
<td>[ Queued | Offered | Accepted | Declined | Expired | Removed ]</td>
</tr>
<tr>
<td>Wave End</td>
<td>Time a priority wave closes</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Later than Wave Start</td>
</tr>
<tr>
<td>Wave Name</td>
<td>Name of a priority wave</td>
<td>alphanumeric</td>
<td>40</td>
<td>e.g. "Wave 1 — final year"</td>
</tr>
<tr>
<td>Wave Start</td>
<td>Time a priority wave opens</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Waves must not overlap (BR-06)</td>
</tr>
<tr>
<td>Window End</td>
<td>Time the registration window closes</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Later than Window Start</td>
</tr>
<tr>
<td>Window Start</td>
<td>Time the registration window opens</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Fixed by the academic calendar</td>
</tr>
<tr>
<td>Year Of Study</td>
<td>The student's year within their programme</td>
<td>integer</td>
<td>1</td>
<td>1–6; determines priority wave (BR-06) and credit limit (BR-04)</td>
</tr>
</tbody>
</table>
<hr />
<h3>3. Notes on selected entries</h3>
<p><strong>Catalog Year</strong> is the most consequential entry in this dictionary and the easiest to
omit. A student is assessed against the regulations in force when they matriculated,
not the current ones. Without this element, every annual curriculum revision silently
re-assesses every existing student — which is wrong, and is not permitted under
Academic Regulations §9.1. Three dynamic rules (BR-02, BR-04, BR-13) must be versioned
by it.</p>
<p><strong>Group Status includes NeedsReview</strong> rather than only Satisfied, InProgress and
Outstanding. The three obvious values force the engine to guess when it cannot
evaluate a requirement — and a degree audit that guesses is the exact failure that
produced the complaint described in Vision &amp; Scope §1.1.</p>
<p><strong>Queue Position exists as stored data, not as a computed rank.</strong> Computing position
from Joined At on every read would be equivalent, until a student is skipped for
ineligibility (UC-07 flow 7.4) and must keep their place. Storing the position makes
the fairness rule expressible.</p>
<p><strong>Financial Standing carries Retrieved At</strong> because CARS does not own this data. When
the finance system is unreachable (UC-10 exception 10.0.E1) the figures are shown with
their age rather than hidden or replaced with zero.</p>`,
  ].join('\n'),
};

const TP1L6 = {
  title: "W1.6 — Deliverable 6: mock-ups and how the three were chosen|||W1.6 — Deliverable 6: mock-up và cách chọn ba use case",
  slug: "swr302-tp1-goi-06-mockups",
  type: 'DOCUMENT',
  description: "Ba mock-up cho use case phức tạp nhất, bảng xếp hạng để chọn, quyết định thiết kế mỗi mock-up đem đi hỏi, và năm câu hỏi nó sinh ra để chốt — trong đó một câu để mở thành TBD.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP1 · Deliverable 6</span>
<h2>Three mock-ups, all of them showing something going wrong</h2>
<p class="lead">All three screens here show a <strong>failure or an unresolved state</strong> — a refused registration, a breached deadline, a requirement the system cannot evaluate. That is deliberate. A mock-up set with only happy paths proves nothing about whether the design survives reality, and reality is where this project's complaints came from.</p>
<ul>
<li><strong>M1</strong> shows the full check table on a refusal, including the checks that were <em>not</em> run because the request stopped earlier. The legacy system said "prerequisite not met" and generated an advising enquiry every time.</li>
<li><strong>M2</strong> puts the 48-hour breach on screen and states that the system will not decide for the Department Head. That sentence is the resolution of the hardest disagreement in elicitation.</li>
<li><strong>M3</strong> shows a degree audit admitting it cannot evaluate one requirement group, and naming who to ask.</li>
</ul>
<div class="callout ok"><strong>§4 is the part most teams skip.</strong> Five questions the mock-ups were built to settle, four with answers and one left open as <strong>TBD-6</strong> — whether a Department Head should see a student's GPA on the override screen. The Registrar wants legal advice. Recording that is better than inventing a privacy position nobody has taken.</div>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP1 · Deliverable 6</span>
<h2>Ba mock-up, cả ba đều cho thấy một thứ đang hỏng</h2>
<p class="lead">Cả ba màn hình ở đây đều thể hiện một <strong>trạng thái hỏng hoặc chưa giải quyết</strong> — một lượt đăng ký bị từ chối, một hạn chót bị vỡ, một yêu cầu hệ thống không đánh giá nổi. Đó là cố ý. Một bộ mock-up chỉ có luồng thuận thì không chứng minh được thiết kế chịu nổi thực tế, mà thực tế mới là nơi sinh ra những than phiền của dự án này.</p>
<ul>
<li><strong>M1</strong> hiện đủ bảng các phép kiểm khi từ chối, kể cả những phép <em>chưa</em> chạy vì yêu cầu đã dừng sớm hơn. Hệ thống cũ chỉ nói "chưa đạt môn tiên quyết" và lần nào cũng đẻ ra một lượt hỏi cố vấn.</li>
<li><strong>M2</strong> đưa việc vỡ hạn 48 giờ lên màn hình và nói rõ hệ thống sẽ KHÔNG quyết thay Trưởng bộ môn. Câu đó chính là lời giải cho bất đồng khó nhất trong quá trình elicitation.</li>
<li><strong>M3</strong> cho thấy một degree audit thừa nhận nó không đánh giá được một nhóm yêu cầu, và chỉ rõ phải hỏi ai.</li>
</ul>
<div class="callout ok"><strong>§4 là phần phần lớn nhóm bỏ qua.</strong> Năm câu hỏi mà mock-up được dựng lên để chốt, bốn câu có đáp án và một câu để mở thành <strong>TBD-6</strong> — Trưởng bộ môn có nên thấy GPA của sinh viên trên màn hình duyệt vượt sĩ số không. Phòng Đào tạo muốn hỏi ý kiến pháp lý. Ghi nhận điều đó tốt hơn là bịa ra một lập trường về quyền riêng tư mà chưa ai đưa ra.</div>`,
    ),
    `<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/SWR302/v1/assignment-tp1/002.webp" alt="🖥️ M1 — UC-03 Register for a section, exception 3.0.E1 (prerequisite not met)" loading="lazy" width="1220" height="937" /><p class="chu-thich">🖥️ <strong>M1</strong> — UC-03 Register for a section, exception 3.0.E1 (prerequisite not met)</p></div>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/SWR302/v1/assignment-tp1/003.webp" alt="🖥️ M2 — UC-06 Override decision, exception 6.0.E1 (48-hour deadline breached)" loading="lazy" width="1220" height="1004" /><p class="chu-thich">🖥️ <strong>M2</strong> — UC-06 Override decision, exception 6.0.E1 (48-hour deadline breached)</p></div>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/SWR302/v1/assignment-tp1/004.webp" alt="🖥️ M3 — UC-09 Degree audit, exception 9.0.E1 (a requirement group it cannot evaluate)" loading="lazy" width="1220" height="1040" /><p class="chu-thich">🖥️ <strong>M3</strong> — UC-09 Degree audit, exception 9.0.E1 (a requirement group it cannot evaluate)</p></div>`,
    `<h2>Mock-ups for Complex Use Cases</h2>
<h2>for the Campus Academic and Registration System (CARS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Member 4 name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Northern Regional University (NRU)
17 September 2026</p>
<hr />
<h3>1. Purpose and approach</h3>
<p>Per Wiegers &amp; Beatty Chapter 15, these are <strong>throwaway, low-fidelity mock-ups</strong>. Their
job is to let a stakeholder say "no, that is not what I meant" — not to look finished.
They are deliberately grey: a polished mock-up moves the conversation to colour and
makes management believe the system is nearly built.</p>
<p><strong>The SRS remains the source of truth.</strong> Where a mock-up and the SRS disagree, the SRS
is correct.</p>
<h3>2. How the three were chosen</h3>
<p><em>Complex</em> means many decisions and many states, not many fields. Candidates ranked on
alternative flows + exceptions + participating actors:</p>
<table>
<thead>
<tr>
<th>Use case</th>
<th>Alt. flows</th>
<th>Exceptions</th>
<th>Actors</th>
<th>Total</th>
<th>Selected</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC-03</strong> Register for a course section</td>
<td>4</td>
<td><strong>7</strong></td>
<td>3</td>
<td><strong>14</strong></td>
<td>✅</td>
</tr>
<tr>
<td><strong>UC-06</strong> Request and decide an override</td>
<td>4</td>
<td>5</td>
<td>4</td>
<td><strong>13</strong></td>
<td>✅</td>
</tr>
<tr>
<td><strong>UC-09</strong> View the real-time degree audit</td>
<td>4</td>
<td>4</td>
<td>2</td>
<td><strong>10</strong></td>
<td>✅</td>
</tr>
<tr>
<td>UC-07 Waitlist and promotion</td>
<td>4</td>
<td>4</td>
<td>2</td>
<td>10</td>
<td>— covered by M1's refusal path</td>
</tr>
<tr>
<td>UC-11 Cancel an under-enrolled section</td>
<td>3</td>
<td>4</td>
<td>4</td>
<td>11</td>
<td>deferred to Release 1.2</td>
</tr>
<tr>
<td>UC-02 Build a planned schedule</td>
<td>3</td>
<td>3</td>
<td>1</td>
<td>7</td>
<td>—</td>
</tr>
</tbody>
</table>
<p>UC-11 scores highly but is deferred to Release 1.2, so prototyping it now would design
something nobody builds this year. UC-03 is the obvious first choice: seven exceptions
is more than any other use case in the system, and it is the transaction the whole
project exists to fix.</p>
<h3>3. The mock-ups</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>File</th>
<th>Use case</th>
<th>Flow shown</th>
<th>State</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>M1</strong></td>
<td><code>mockups/M1-UC03-register-refused.png</code></td>
<td>UC-03</td>
<td>Exception 3.0.E1</td>
<td><strong>Refusal</strong></td>
</tr>
<tr>
<td><strong>M2</strong></td>
<td><code>mockups/M2-UC06-override-decision.png</code></td>
<td>UC-06</td>
<td>Normal flow 6.0 + exception 6.0.E1</td>
<td>Decider view, <strong>deadline breached</strong></td>
</tr>
<tr>
<td><strong>M3</strong></td>
<td><code>mockups/M3-UC09-degree-audit.png</code></td>
<td>UC-09</td>
<td>Normal flow 9.0 + alt flow 9.1 + exception 9.0.E1</td>
<td><strong>Cannot evaluate one group</strong></td>
</tr>
</tbody>
</table>
<p>Editable source for each is the matching <code>.html</code> file in <code>mockups/</code>.</p>
<h3>3.1 M1 — Registration refused (UC-03, exception 3.0.E1)</h3>
<p>Shows a <strong>refusal</strong>, not a success, because the refusal is where this system either
removes an advising enquiry or creates one. It names the exact course and grade, lists
every check with its result, and marks the checks that were <strong>not</strong> evaluated because
the request stopped earlier.</p>
<p><em>Design decisions under test:</em> (1) showing the full check table so the student can see
what was and was not evaluated; (2) naming the specific course and grade rather than
"prerequisite not met", which is what the legacy system said and what generated a phone
call every time.</p>
<p><em>Realizes:</em> Enroll-1 … Enroll-8, Prereq-1, Prereq-2. <em>Rules visible:</em> BR-02, BR-06, BR-14.</p>
<h3>3.2 M2 — Override decision (UC-06, flow 6.0 with exception 6.0.E1)</h3>
<p>The Department Head's queue and one decision, with everything they need in front of
them: section capacity, room capacity, the other pending requests for the same section,
the student's record, and the graduation consequence of declining.</p>
<p><em>Design decision under test:</em> the banner. On a breached 48-hour deadline the system
<strong>escalates and keeps counting</strong> — it does not auto-approve and does not auto-decline.
This was the hardest disagreement in elicitation: the Registrar wanted auto-approval to
guarantee the SLA, the Department Heads refused to let software grant academic
exceptions. The screen states the resolution rather than hiding it.</p>
<p><em>Realizes:</em> Override-1 … Override-9. <em>Rules visible:</em> BR-03, BR-11, BR-12.</p>
<h3>3.3 M3 — Degree audit with a group it cannot evaluate (UC-09)</h3>
<p>Every requirement group with its status, plus a <strong>Needs review</strong> row for transfer credit
recorded before 2019, plus the what-if projection.</p>
<p><em>Design decisions under test:</em> (1) the <strong>Needs review</strong> state — a degree audit that
guesses is the exact failure that produced the complaint to the Rector in Vision &amp;
Scope §1.1, so the screen says it does not know and names who to ask; (2) stating the
<strong>catalog year used</strong>, which is a regulation (Academic Regulations §9.1), not a nicety.</p>
<p><em>Realizes:</em> Audit-1 … Audit-7. <em>Rules visible:</em> BR-02, BR-13, BR-18.</p>
<h3>4. Questions these mock-ups were built to settle</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Question</th>
<th>Asked of</th>
<th>Answer</th>
</tr>
</thead>
<tbody>
<tr>
<td>Q1</td>
<td>Should a refused student see every check, or only the one that failed?</td>
<td>Academic Office Staff</td>
<td>Every check, with the unevaluated ones marked — it stops the "but what about…" follow-up call</td>
</tr>
<tr>
<td>Q2</td>
<td>On a breached override deadline, should the system decide?</td>
<td>Registrar, Department Heads</td>
<td>No. Escalate and keep counting (UC-06 exception 6.0.E1)</td>
</tr>
<tr>
<td>Q3</td>
<td>Should a degree audit show a requirement it cannot evaluate, or hide it?</td>
<td>Academic Advisors</td>
<td>Show it as Needs review, with the reason and who to contact</td>
</tr>
<tr>
<td>Q4</td>
<td>Should the what-if projection show the cost of <em>not</em> taking a course?</td>
<td>Academic Advisors</td>
<td>Yes — it is the single most common advising question</td>
</tr>
<tr>
<td>Q5</td>
<td>Should a student see their own GPA on the override screen the Department Head sees?</td>
<td>Registrar</td>
<td><strong>Open — TBD-6.</strong> A privacy question the Registrar wants legal advice on</td>
</tr>
</tbody>
</table>
<p><strong>TBD-6</strong> is carried into the SRS TBD list. Leaving it open and tracked is correct;
inventing a privacy position the Registrar has not taken would be worse.</p>`,
  ].join('\n'),
};

const TP1L7 = {
  title: "W1.7 — Deliverable 7: prioritization, and why the ranking was overruled|||W1.7 — Deliverable 7: xếp ưu tiên, và vì sao thứ hạng bị bác",
  slug: "swr302-tp1-goi-07-prioritization",
  type: 'DOCUMENT',
  description: "Bảng value/cost/risk Chapter 16 với trọng số có biện minh, mục bắt buộc tách riêng, thứ hạng thật của 13 feature — và lập luận vì sao ba feature giá trị NHẤT lại xếp hạng 9, 12, 13.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP1 · Deliverable 7</span>
<h2>The three most valuable features rank 9th, 12th and 13th</h2>
<p class="lead">This is the sharpest example of the point in either package. <strong>FE-4, FE-5 and FE-9 carry the three highest Value % scores in the whole table</strong> — 10.19, 9.06 and 9.43. The model knows they are the most valuable things in the project. It ranks them 9th, 12th and 13th anyway, because they are also the most expensive and the riskiest.</p>
<p>Meanwhile FE-12 (registration window administration) wins on being cheap, safe and unavoidable — not on being important.</p>
<h3>Why the release plan overrules it</h3>
<ul>
<li><strong>The model cannot see the business case.</strong> Only FE-4 and FE-5 deliver BO-2 and BO-4 — the 880 staff-hours a semester that justified the funding. A Release 1.0 built from the top of the ranking would open a registration window beautifully and still check every prerequisite by hand.</li>
<li><strong>The model treats risk as a reason to defer.</strong> FE-5's risk is entirely the finance vendor (RI-1). Deferring it does not reduce that risk — it discovers it later, with less time to route around it.</li>
<li><strong>The model cannot see dependency.</strong> FE-10 ranks 6th and is worthless without FE-5, whose data it displays.</li>
</ul>
<div class="callout ok"><strong>The sensitivity row that turns this into action.</strong> Lower FE-5's risk from 8 to 4 — that is, the vendor confirms an API — and FE-5 rises from rank 12 to rank 5. The worksheet has just converted "we should chase the finance vendor" into "resolving RI-1 moves our fourth-most-valuable feature up seven places." That is what a prioritization model is actually for.</div>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP1 · Deliverable 7</span>
<h2>Ba feature giá trị nhất lại xếp hạng 9, 12 và 13</h2>
<p class="lead">Đây là ví dụ sắc nhất cho luận điểm này trong cả hai bộ tài liệu. <strong>FE-4, FE-5 và FE-9 mang ba điểm Value % cao nhất toàn bảng</strong> — 10,19; 9,06 và 9,43. Mô hình BIẾT chúng là những thứ giá trị nhất dự án. Nó vẫn xếp chúng hạng 9, 12 và 13, vì chúng đồng thời đắt nhất và rủi ro nhất.</p>
<p>Trong khi đó FE-12 (quản trị khung đăng ký) thắng nhờ rẻ, an toàn và không thể không có — chứ không phải nhờ quan trọng.</p>
<h3>Vì sao kế hoạch phát hành bác nó</h3>
<ul>
<li><strong>Mô hình không nhìn thấy bài toán kinh doanh.</strong> Chỉ FE-4 và FE-5 tạo ra BO-2 và BO-4 — tức 880 giờ công mỗi kỳ, thứ đã biện minh cho khoản đầu tư. Một bản 1.0 xây từ đầu bảng xếp hạng sẽ mở khung đăng ký rất mượt mà vẫn kiểm từng môn tiên quyết bằng tay.</li>
<li><strong>Mô hình coi rủi ro là lý do để hoãn.</strong> Rủi ro của FE-5 hoàn toàn nằm ở nhà cung cấp hệ thống tài chính (RI-1). Hoãn nó không làm rủi ro giảm — chỉ làm ta phát hiện muộn hơn, lúc còn ít thời gian để lách.</li>
<li><strong>Mô hình không nhìn thấy phụ thuộc.</strong> FE-10 xếp hạng 6 và vô giá trị nếu thiếu FE-5, vì nó chỉ hiển thị dữ liệu FE-5 lấy về.</li>
</ul>
<div class="callout ok"><strong>Dòng phân tích độ nhạy biến việc này thành hành động.</strong> Hạ rủi ro của FE-5 từ 8 xuống 4 — tức nhà cung cấp xác nhận có API — thì FE-5 nhảy từ hạng 12 lên hạng 5. Bảng tính vừa biến "nên đi hỏi nhà cung cấp tài chính" thành "giải quyết RI-1 đẩy feature giá trị thứ tư của chúng ta lên bảy bậc". Đó mới là việc mà một mô hình xếp ưu tiên sinh ra để làm.</div>`,
    ),
    `<h2>Requirement Prioritization — Analysis</h2>
<h2>for the Campus Academic and Registration System (CARS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Member 5 name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Northern Regional University (NRU)
17 September 2026</p>
<div class="callout">
<p>The worksheet is <code>deliverables/07-Requirements-Prioritization.xlsx</code>, built on the
Chapter 16 template with its formulas unchanged. This document explains the inputs
and what the output does and does not mean.</p>
</div>
<hr />
<h3>1. The model</h3>
<p><code>Total Value = Benefit × w_benefit + Penalty × w_penalty
Priority    = Value %  ÷  ( Cost % × w_cost  +  Risk % × w_risk )</code></p>
<p><strong>Benefit and Penalty are different questions.</strong> Benefit is the value if the feature is
present; penalty is the damage if it is absent. FE-12 (window administration) is the
clearest example in this project: nobody is excited by it, but without it no
registration window can open at all — benefit 7, penalty 9.</p>
<h3>2. Weights, and why</h3>
<table>
<thead>
<tr>
<th>Dimension</th>
<th>Weight</th>
<th>Justification</th>
</tr>
</thead>
<tbody>
<tr>
<td>Benefit</td>
<td><strong>2</strong></td>
<td>The Vice-Rector funded this project to end registration failures and free staff time. Value delivered outweighs damage avoided.</td>
</tr>
<tr>
<td>Penalty</td>
<td><strong>1</strong></td>
<td>Baseline.</td>
</tr>
<tr>
<td>Cost</td>
<td><strong>1</strong></td>
<td>Baseline.</td>
</tr>
<tr>
<td>Risk</td>
<td><strong>0.5</strong></td>
<td>Every risk in Vision &amp; Scope §1.6 has a named mitigation. Weighting risk equally with cost would push FE-5 and FE-9 — the two features carrying RI-1 and RI-2 — to the bottom, which would amount to letting a <em>managed</em> risk make the scope decision.</td>
</tr>
</tbody>
</table>
<h3>3. What was excluded from scoring</h3>
<table>
<thead>
<tr>
<th>Item</th>
<th>Why it cannot be traded away</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>FE-3</strong> Enrollment transaction</td>
<td>The system exists to make this one transaction work</td>
</tr>
<tr>
<td><strong>CO-1</strong> University SSO</td>
<td>Corporate security policy</td>
</tr>
<tr>
<td><strong>CO-6</strong> Catalog-year rule versioning</td>
<td>Academic Regulations §9.1</td>
</tr>
<tr>
<td><strong>OR-1</strong> Personal data retention</td>
<td>Decree 13/2023/ND-CP</td>
</tr>
</tbody>
</table>
<p>Thirteen features were scored in a single pass, because every percentage in the sheet
is a share of the column total.</p>
<h3>4. The result</h3>
<table>
<thead>
<tr>
<th style="text-align: right;">Rank</th>
<th>Feature</th>
<th style="text-align: right;">Value %</th>
<th style="text-align: right;">Cost %</th>
<th style="text-align: right;">Risk %</th>
<th style="text-align: right;"><strong>Priority</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: right;">1</td>
<td>FE-12 Registration window administration</td>
<td style="text-align: right;">8.68</td>
<td style="text-align: right;">5.08</td>
<td style="text-align: right;">4.17</td>
<td style="text-align: right;"><strong>1.211</strong></td>
</tr>
<tr>
<td style="text-align: right;">2</td>
<td>FE-2 Schedule planning before the window</td>
<td style="text-align: right;">8.30</td>
<td style="text-align: right;">6.78</td>
<td style="text-align: right;">4.17</td>
<td style="text-align: right;"><strong>0.937</strong></td>
</tr>
<tr>
<td style="text-align: right;">3</td>
<td>FE-13 Advising records and holds</td>
<td style="text-align: right;">6.04</td>
<td style="text-align: right;">5.08</td>
<td style="text-align: right;">4.17</td>
<td style="text-align: right;"><strong>0.842</strong></td>
</tr>
<tr>
<td style="text-align: right;">4</td>
<td>FE-1 Course catalog search and browsing</td>
<td style="text-align: right;">8.30</td>
<td style="text-align: right;">6.78</td>
<td style="text-align: right;">6.25</td>
<td style="text-align: right;"><strong>0.838</strong></td>
</tr>
<tr>
<td style="text-align: right;">5</td>
<td>FE-8 Drop, swap and add/drop handling</td>
<td style="text-align: right;">7.55</td>
<td style="text-align: right;">6.78</td>
<td style="text-align: right;">6.25</td>
<td style="text-align: right;"><strong>0.762</strong></td>
</tr>
<tr>
<td style="text-align: right;">6</td>
<td>FE-10 Account balance and payment history</td>
<td style="text-align: right;">6.42</td>
<td style="text-align: right;">5.08</td>
<td style="text-align: right;">8.33</td>
<td style="text-align: right;"><strong>0.693</strong></td>
</tr>
<tr>
<td style="text-align: right;">7</td>
<td>FE-6 Capacity override workflow</td>
<td style="text-align: right;">8.68</td>
<td style="text-align: right;">8.47</td>
<td style="text-align: right;">8.33</td>
<td style="text-align: right;"><strong>0.687</strong></td>
</tr>
<tr>
<td style="text-align: right;">8</td>
<td>FE-11 Section viability and cancellation</td>
<td style="text-align: right;">6.04</td>
<td style="text-align: right;">6.78</td>
<td style="text-align: right;">4.17</td>
<td style="text-align: right;"><strong>0.681</strong></td>
</tr>
<tr>
<td style="text-align: right;">9</td>
<td>FE-4 Prerequisite and co-requisite rule engine</td>
<td style="text-align: right;">10.19</td>
<td style="text-align: right;">11.86</td>
<td style="text-align: right;">12.50</td>
<td style="text-align: right;"><strong>0.562</strong></td>
</tr>
<tr>
<td style="text-align: right;">10</td>
<td>FE-14 Enrollment and capacity reporting</td>
<td style="text-align: right;">4.91</td>
<td style="text-align: right;">6.78</td>
<td style="text-align: right;">4.17</td>
<td style="text-align: right;"><strong>0.553</strong></td>
</tr>
<tr>
<td style="text-align: right;">11</td>
<td>FE-7 Waitlist management</td>
<td style="text-align: right;">6.42</td>
<td style="text-align: right;">8.47</td>
<td style="text-align: right;">6.25</td>
<td style="text-align: right;"><strong>0.553</strong></td>
</tr>
<tr>
<td style="text-align: right;">12</td>
<td>FE-5 Financial eligibility evaluation</td>
<td style="text-align: right;">9.06</td>
<td style="text-align: right;">8.47</td>
<td style="text-align: right;">16.67</td>
<td style="text-align: right;"><strong>0.539</strong></td>
</tr>
<tr>
<td style="text-align: right;">13</td>
<td>FE-9 Real-time degree audit</td>
<td style="text-align: right;">9.43</td>
<td style="text-align: right;">13.56</td>
<td style="text-align: right;">14.58</td>
<td style="text-align: right;"><strong>0.452</strong></td>
</tr>
</tbody>
</table>
<h3>5. Reconciling the ranking with the release plan — the important part</h3>
<p><strong>The ranking and the release plan disagree, and the release plan is right.</strong></p>
<p>Look at what the model rewards and what it punishes:</p>
<ul>
<li><strong>FE-4, FE-5 and FE-9 carry the three highest Value % scores in the table</strong> — 10.19,
  9.06 and 9.43. They are the most valuable things in the project, and the model knows
  it. They rank 9th, 12th and 13th anyway, because they are also the most expensive and
  the riskiest.</li>
<li><strong>FE-12 wins</strong> on being cheap, safe and unavoidable — not on being important.</li>
<li><strong>FE-13 ranks 3rd</strong> and is deferred to Release 1.2, which nobody disputes.</li>
</ul>
<p>This is the model working correctly and then being overruled for reasons it cannot see:</p>
<ol>
<li><strong>The model has no concept of the business case.</strong> BO-2 (640 staff-hours) and BO-4
   (240 staff-hours) are what the Vice-Rector funded. Only FE-4 and FE-5 deliver them.
   A Release 1.0 built from the top of this ranking would open a registration window
   beautifully and still check every prerequisite by hand.</li>
<li><strong>The model treats risk as a reason to defer.</strong> FE-5's risk of 8 is entirely RI-1 —
   the finance vendor. Deferring FE-5 does not reduce that risk; it discovers it later,
   when there is less time to route around it. Constraint CO-7 (the adapter) exists
   precisely so the project can start FE-5 <em>before</em> the vendor's answer is known.</li>
<li><strong>The model cannot see dependency.</strong> FE-10 ranks 6th but is worthless without FE-5:
   it displays the data FE-5 obtains.</li>
</ol>
<p><strong>Decision:</strong> the release plan in Vision &amp; Scope §2.2 stands. The worksheet is used for
two narrower questions instead:</p>
<ul>
<li><strong>Sequencing inside Release 1.0.</strong> Build FE-12, FE-1 and FE-2 first — they are cheap,
  low-risk and they are what a rehearsal window needs in order to load-test anything at
  all.</li>
<li><strong>What to drop if the schedule slips.</strong> Rank order says <strong>FE-7 (waitlist) goes
  first</strong> — rank 11, and UC-06 overrides cover the same need less fairly but adequately
  for one semester. <strong>FE-4 and FE-5 cannot be dropped</strong>, because dropping them means
  the project delivers a faster registration window and none of the staff-hour savings
  that justified it.</li>
</ul>
<div class="callout">
<p>A prioritization worksheet whose output is simply obeyed is a worksheet nobody
thought about.</p>
</div>
<h3>6. Sensitivity</h3>
<table>
<thead>
<tr>
<th>Change</th>
<th>Effect</th>
</tr>
</thead>
<tbody>
<tr>
<td>Risk weight raised from 0.5 to 1.0</td>
<td>FE-5 falls to last and FE-9 to 12th. The features carrying the project's value sink further — confirming that under this model <em>risk</em> is what buries them, not <em>cost</em>.</td>
</tr>
<tr>
<td>FE-5 risk lowered from 8 to 4 (i.e. the vendor confirms an API)</td>
<td>FE-5 rises from rank 12 to rank 5. The single most valuable thing the team can do in Week 3 is get that answer, and this table quantifies why.</td>
</tr>
</tbody>
</table>
<p>The second row is the useful output of the whole exercise: it converts "we should chase
the finance vendor" into "resolving RI-1 moves our fourth-most-valuable feature up
seven places."</p>`,
  ].join('\n'),
};

const TP1L8 = {
  title: "W1.8 — Deliverable 8: BA budget and headcount, three ways|||W1.8 — Deliverable 8: ngân sách và số BA, ba cách tính",
  slug: "swr302-tp1-goi-08-estimation",
  type: 'DOCUMENT',
  description: "Công cụ ước lượng Chapter 19 với đầu vào lấy từ chính tài liệu nhóm, ba phương pháp cho 2,04 / 1,67 / 1,59 BA — lần này chúng gần nhau, và lý do vì sao sự đồng thuận đó vừa đáng tin vừa chưa đủ.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP1 · Deliverable 8</span>
<h2>Three answers that nearly agree — and why that is not the end of it</h2>
<table>
<thead><tr><th>Method</th><th>BAs</th><th>Requirements-phase budget</th></tr></thead>
<tbody>
<tr><td>A — 15% of total project budget</td><td>2.04</td><td>USD 143,000</td></tr>
<tr><td>B — 6 developers per BA</td><td>1.67</td><td>USD 117,000</td></tr>
<tr><td>C — Activity-based, 893 hours</td><td>1.59</td><td>USD 112,000</td></tr>
</tbody>
</table>
<p>Unlike TP2, where the three methods spread from 1.71 to 2.25 for opposite reasons, here they land within 0.45 of each other. <strong>That is a finding, not a coincidence:</strong> CARS is a mid-sized system with only five interfacing systems and none of them large, so the three methods — which measure quite different things — happen to agree.</p>
<div class="callout warn"><strong>Agreement raises confidence in the number, but does not make it complete.</strong> All three methods price artifacts and headcount. None of them prices the two things this project's own risk register says will consume analyst time: <strong>RI-2</strong>, the curriculum-rule data audit, and <strong>TBD-5</strong>, finding out which programmes cannot be expressed as machine-evaluable rules at all.</div>
<h3>The commitment, and the honesty in §5</h3>
<p>Two BAs at USD 143,000 — method A's figure, because it is the only one with headroom for the curriculum-rule audit that assumption A2 makes a precondition of Release 1.0.</p>
<p>Then §5 undercuts its own argument, deliberately. At a local blended rate of USD 45/hour, method A jumps from 2.04 to 5.66 while B and C do not move at all — so the "headroom" used to justify the second BA is an artefact of a US rate. <strong>The document says so, and re-grounds the justification on RI-2 and TBD-5 instead.</strong> Noticing that your own supporting argument is rate-dependent, and saying it out loud, is worth more marks than an estimate that looks tidy.</p>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP1 · Deliverable 8</span>
<h2>Ba đáp số gần trùng nhau — và vì sao thế vẫn chưa xong chuyện</h2>
<table>
<thead><tr><th>Cách</th><th>Số BA</th><th>Ngân sách giai đoạn yêu cầu</th></tr></thead>
<tbody>
<tr><td>A — 15% tổng ngân sách dự án</td><td>2,04</td><td>143.000 USD</td></tr>
<tr><td>B — 6 lập trình viên một BA</td><td>1,67</td><td>117.000 USD</td></tr>
<tr><td>C — Theo hoạt động, 893 giờ</td><td>1,59</td><td>112.000 USD</td></tr>
</tbody>
</table>
<p>Khác với TP2, nơi ba cách trải từ 1,71 đến 2,25 vì những lý do trái ngược nhau, ở đây chúng nằm trong khoảng cách 0,45. <strong>Đó là một phát hiện, không phải trùng hợp:</strong> CARS là hệ thống cỡ vừa, chỉ có năm hệ thống giao tiếp và không cái nào lớn, nên ba cách — vốn đo những thứ khá khác nhau — tình cờ gặp nhau.</p>
<div class="callout warn"><strong>Đồng thuận làm tăng độ tin cậy của con số, nhưng không làm nó đầy đủ.</strong> Cả ba cách đều định giá sản phẩm làm ra và nhân sự. Không cách nào định giá hai thứ mà chính sổ rủi ro của dự án nói là sẽ ngốn thời gian analyst: <strong>RI-2</strong>, cuộc rà dữ liệu quy tắc chương trình, và <strong>TBD-5</strong>, việc tìm ra những ngành nào không thể diễn đạt thành luật máy đọc được.</div>
<h3>Cam kết, và sự trung thực ở §5</h3>
<p>Hai BA với 143.000 USD — lấy theo cách A, vì đó là cách duy nhất còn dư chỗ cho cuộc rà quy tắc chương trình mà giả định A2 biến thành điều kiện tiên quyết của bản 1.0.</p>
<p>Rồi §5 tự đánh sập lập luận của chính mình, một cách có chủ ý. Với giá BA nội địa 45 USD/giờ, cách A nhảy từ 2,04 lên 5,66 trong khi B và C không nhúc nhích — vậy cái "phần dư" dùng để biện minh cho BA thứ hai chỉ là sản phẩm phụ của một mức giá Mỹ. <strong>Tài liệu nói thẳng điều đó, rồi neo lại lập luận vào RI-2 và TBD-5.</strong> Nhận ra rằng chính luận cứ của mình phụ thuộc vào mức giá, và nói ra, đáng điểm hơn một bản ước lượng trông gọn gàng.</p>`,
    ),
    `<h2>Requirement Estimation — BA budget and number of BAs</h2>
<h2>for the Campus Academic and Registration System (CARS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Member 5 name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Northern Regional University (NRU)
17 September 2026</p>
<div class="callout">
<p>The tool is <code>deliverables/08-Requirements-Estimation.xlsx</code>, the Chapter 19
Requirements Estimation Tool with its formulas unchanged. Only the yellow input cells
were filled; each carries a comment naming where its value came from.</p>
</div>
<hr />
<h3>1. Inputs, and where each number came from</h3>
<p><strong>These counts come from our own deliverables.</strong> A count that disagrees with the
documents it describes invalidates everything downstream.</p>
<table>
<thead>
<tr>
<th>Input</th>
<th>Value</th>
<th>Source</th>
</tr>
</thead>
<tbody>
<tr>
<td>Existing pages of documentation for review</td>
<td>120</td>
<td>Legacy system documentation + NRU Academic Regulations 2026 + current-state notes</td>
</tr>
<tr>
<td>Existing systems being updated or replaced</td>
<td>1</td>
<td>The legacy student information system</td>
</tr>
<tr>
<td>Stakeholders</td>
<td>20</td>
<td>Named participants across elicitation sessions 1–4</td>
</tr>
<tr>
<td>Interfacing systems — small</td>
<td>2</td>
<td>University SSO, notification service</td>
</tr>
<tr>
<td>Interfacing systems — medium</td>
<td>3</td>
<td>Finance/bursar, timetable, learning management (SRS §5.2)</td>
</tr>
<tr>
<td>Interfacing systems — large</td>
<td>0</td>
<td>None at runtime; the legacy migration is counted above</td>
</tr>
<tr>
<td><strong>Process flows and/or use cases</strong></td>
<td><strong>14</strong></td>
<td><strong>Counted from Deliverable 2 — UC-01 … UC-14</strong></td>
</tr>
<tr>
<td>Business data diagrams</td>
<td>2</td>
<td>Context diagram + logical data model</td>
</tr>
<tr>
<td><strong>Screens / user interfaces</strong></td>
<td><strong>26</strong></td>
<td>Student 10 + staff 6 + department head 4 + advisor 3 + registrar 3</td>
</tr>
<tr>
<td><strong>Reports</strong></td>
<td><strong>7</strong></td>
<td>RPT-1 … RPT-7, counted from SRS §4.3</td>
</tr>
<tr>
<td>Total project budget</td>
<td>USD 950,000</td>
<td>Vision &amp; Scope §3.2</td>
</tr>
<tr>
<td>BA blended hourly cost</td>
<td>USD 125</td>
<td>Tool default, retained — see §5</td>
</tr>
<tr>
<td>Type of project</td>
<td>Standard</td>
<td>Custom build replacing a legacy system</td>
</tr>
<tr>
<td>Number of developers</td>
<td>10</td>
<td>Vision &amp; Scope §3.2 Staff constraint</td>
</tr>
<tr>
<td>Is your team remote?</td>
<td>No</td>
<td>Team co-located on campus</td>
</tr>
<tr>
<td>Project duration</td>
<td>40 weeks</td>
<td>Release 1.0 live for the Semester 1 window</td>
</tr>
<tr>
<td>Requirements work duration</td>
<td>14 weeks</td>
<td>Weeks 1–14</td>
</tr>
</tbody>
</table>
<h3>2. Three answers</h3>
<table>
<thead>
<tr>
<th>Method</th>
<th style="text-align: right;">Number of BAs</th>
<th style="text-align: right;">BA budget — requirements phase</th>
<th style="text-align: right;">BA budget — whole project</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>A</strong> — 15% of total project budget</td>
<td style="text-align: right;"><strong>2.04</strong></td>
<td style="text-align: right;">USD 143,000</td>
<td style="text-align: right;">USD 407,000</td>
</tr>
<tr>
<td><strong>B</strong> — 6 developers per BA (Standard)</td>
<td style="text-align: right;"><strong>1.67</strong></td>
<td style="text-align: right;">USD 117,000</td>
<td style="text-align: right;">USD 333,000</td>
</tr>
<tr>
<td><strong>C</strong> — Activity-based, 893 hours</td>
<td style="text-align: right;"><strong>1.59</strong></td>
<td style="text-align: right;">USD 112,000</td>
<td style="text-align: right;">USD 319,000</td>
</tr>
</tbody>
</table>
<p>893 hours ÷ 40 hours ÷ 14 weeks = <strong>1.59 BAs</strong>. No remote buffer applies — the team is
co-located.</p>
<h3>3. Reading the spread</h3>
<p>The three answers are unusually close (1.59 to 2.04), and the reason is worth stating:
<strong>CARS is a mid-sized system with few interfaces.</strong> Fourteen use cases, twenty-six
screens and only five interfacing systems, none of them large. The three methods
measure different things but, on a system this shaped, they land in the same place.</p>
<p>That is a genuine finding rather than a coincidence, and it cuts both ways:</p>
<ul>
<li><strong>It raises confidence in the number.</strong> Three independent methods agreeing within
  0.45 of a BA is stronger evidence than any one of them alone.</li>
<li><strong>It does not mean the estimate is complete.</strong> All three methods price <em>artifacts and
  headcount</em>. None of them prices the two things this project's own risk register says
  will consume analyst time: <strong>RI-2</strong>, the curriculum-rule data audit, and <strong>TBD-5</strong>,
  finding out which programmes cannot be expressed as machine-evaluable rules.</li>
</ul>
<h3>4. What we commit to, and what would change it</h3>
<div class="callout">
<p><strong>We staff 2 BAs for the 14-week requirements phase, at a budget of USD 143,000.</strong></p>
</div>
<p><strong>Why 2 and not 1.59 or 1.67.</strong> Methods B and C price the system as specified. They do
not contain the curriculum-rule audit, which assumption A2 makes a precondition of
Release 1.0 and which the team cannot start without a BA. Method A's 2.04 is the only
figure with headroom for it, and rounding to 2 makes the headroom explicit rather than
accidental.</p>
<p><strong>What would change our mind — stated in advance:</strong></p>
<table>
<thead>
<tr>
<th>Trigger</th>
<th>Revised commitment</th>
</tr>
</thead>
<tbody>
<tr>
<td>TBD-5 shows more than 10% of programmes cannot be expressed as rules</td>
<td>Escalate to 3 BAs; assumption A2 fails and the rule work grows substantially</td>
</tr>
<tr>
<td>The finance vendor confirms a synchronous API in Week 3 (RI-1 closed)</td>
<td>Hold at 2 BAs; the adapter work in CO-7 shrinks but does not disappear</td>
</tr>
<tr>
<td>The finance vendor refuses, forcing a nightly file exchange</td>
<td>Hold at 2 BAs, but re-plan UC-05 — the exception paths multiply and Finance-3 becomes the normal case</td>
</tr>
<tr>
<td>Requirements phase compressed from 14 weeks to 10</td>
<td>Escalate to 2.5 BAs — the work does not shrink with the calendar</td>
</tr>
</tbody>
</table>
<p><strong>BA cost for the whole project:</strong> USD 407,000 at 2 BAs across 40 weeks. This is the
honest figure for the sponsor. Analysts do not stop at the baseline — they answer
questions, run change control and maintain traceability until release.</p>
<h3>5. Sensitivity: the hourly rate</h3>
<p>The USD 125 blended rate is the tool's default, from the book's US context. At a
Vietnamese blended BA rate of roughly USD 45/hour:</p>
<table>
<thead>
<tr>
<th>Method</th>
<th style="text-align: right;">BAs at USD 125/h</th>
<th style="text-align: right;">BAs at USD 45/h</th>
</tr>
</thead>
<tbody>
<tr>
<td>A — 15% of budget</td>
<td style="text-align: right;">2.04</td>
<td style="text-align: right;"><strong>5.66</strong></td>
</tr>
<tr>
<td>B — developer ratio</td>
<td style="text-align: right;">1.67</td>
<td style="text-align: right;">1.67</td>
</tr>
<tr>
<td>C — activity-based</td>
<td style="text-align: right;">1.59</td>
<td style="text-align: right;">1.59</td>
</tr>
</tbody>
</table>
<p><strong>Only method A moves.</strong> That exposes what it measures: not how much analysis the
project needs, but how many analyst-hours 15% of the budget happens to buy. At local
rates the agreement described in §3 disappears entirely, and method A becomes an upper
bound on <em>affordable</em> effort rather than an estimate of <em>necessary</em> effort.</p>
<p>This matters for the §4 commitment. We used method A's headroom to justify rounding up
to 2 BAs — but that headroom is an artefact of a US rate. If NRU staffs the project at
local rates, the honest justification for the second BA is <strong>RI-2 and TBD-5</strong>, not the
15% rule. We state it that way rather than letting a rate assumption carry the argument.</p>`,
  ].join('\n'),
};

export default {
  title: "Worked package — TP1: Campus Academic & Registration (CARS)|||Bộ tài liệu mẫu — TP1: Học vụ & Đăng ký môn (CARS)",
  description: "Trọn bộ 8 deliverable của một bài Assignment làm trên đề TP1, cho hệ thống CARS của trường đại học giả định Northern Regional University. Tài liệu giữ nguyên tiếng Anh như khi nộp; phần dẫn giải mỗi tài liệu là song ngữ. Đọc kèm mục Assignment và bộ TP2 để so sánh hai cách xử lý khác nhau của cùng một khuôn.",
  lessons: [TP1L1, TP1L2, TP1L3, TP1L4, TP1L5, TP1L6, TP1L7, TP1L8],
};
