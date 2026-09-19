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
    `<div class="ml-en"><h2>Vision and Scope Document</h2>
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
<p>Scope boundaries for Release 1.0:</p>
<ul>
<li>All six faculties from day one. Registration cannot be piloted on part of the student body, because sections are shared across faculties.</li>
<li>Degree audit (FE-9) is <strong>not</strong> included; prerequisite checking (FE-4) is, and the two use the same curriculum rules, so FE-9 becomes largely configuration in 1.1.</li>
<li>Financial eligibility uses whichever interface the vendor makes available (RI-1).</li>
</ul>
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
</ul></div>
<div class="ml-vi"><h2>Tài liệu Vision and Scope</h2>
<h2>cho Hệ thống Học vụ và Đăng ký môn (CARS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên nhóm trưởng&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Northern Regional University (NRU)
17 tháng 9 năm 2026</p>
<hr />
<h3>Lịch sử sửa đổi</h3>
<table>
<thead>
<tr>
<th>Người</th>
<th>Ngày</th>
<th>Lý do sửa</th>
<th>Phiên bản</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Bản nháp đầu sau vòng khai thác yêu cầu thứ 1</td>
<td>0.9</td>
</tr>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Bản cơ sở được Phó hiệu trưởng phụ trách Đào tạo duyệt</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Yêu cầu nghiệp vụ</h3>
<h3>1.1 Bối cảnh</h3>
<p>Northern Regional University (NRU) là một trường đại học công lập với <strong>12.000 sinh viên
đang theo học</strong> ở sáu khoa, mở khoảng <strong>1.400 lớp học phần</strong> mỗi học kỳ. Công tác quản lý
học vụ của trường từ năm 2012 tới nay chạy trên một hệ thống thông tin sinh viên tự xây,
nay đã mười bốn năm tuổi, vốn được thiết kế cho quy mô khoảng 3.000 sinh viên và cho việc
đăng ký làm tại quầy.</p>
<p>Năm 2019 trường đưa việc đăng ký lên mạng mà không thiết kế lại hệ thống bên dưới. Từ đó
tới nay, số sinh viên tăng 47%, số lớp tăng 38%, và cửa sổ đăng ký bị nén từ hai tuần
xuống <strong>72 giờ</strong> chia ba đợt ưu tiên. Mọi thứ còn lại trong phòng học vụ — các phép kiểm
chạy trước khi xác nhận một lượt ghi danh, và các quyết định về những lớp không đủ sĩ số
— vẫn làm bằng tay, y như hồi trường có 3.000 sinh viên.</p>
<p>Hai học kỳ liên tiếp kết thúc bằng một lá đơn khiếu nại chính thức gửi Hiệu trưởng: một
về việc hệ thống đăng ký sập, một về việc sinh viên tới năm cuối mới phát hiện mình bỏ
sót một điều kiện tốt nghiệp. Trường cấp kinh phí cho dự án này để đáp lại.</p>
<h3>1.2 Cơ hội nghiệp vụ</h3>
<p>Năm vấn đề tách bạch, đều được gọi tên trong tình hình mà phòng học vụ mô tả:</p>
<p><strong>P1 — Hệ thống sập dưới tải đăng ký.</strong> Cửa sổ đăng ký 72 giờ mở lúc 08:00 cho từng đợt
ưu tiên. Đo ở học kỳ 2 năm 2025–26, <strong>số phiên đăng nhập đồng thời đỉnh đạt 4.200</strong>,
trong khi hệ thống bắt đầu xuống cấp từ mốc 1.800 và đã sập hẳn ở ba trên bốn đợt gần
nhất. Mỗi lần sập lại kéo dài cửa sổ, đẩy việc đăng ký lấn sang tuần học và buộc phải
sửa thời khoá biểu muộn.</p>
<p><strong>P2 — Điều kiện tiên quyết được kiểm bằng tay.</strong> Nhân viên học vụ đối chiếu từng lượt
ghi danh với bảng điểm của sinh viên một cách thủ công. Đo trong hai học kỳ gần nhất,
việc này ngốn khoảng <strong>640 giờ-người mỗi học kỳ</strong>, và lỗi vẫn lọt: năm 2025–26 có 61 sinh
viên được vào một môn mà chưa qua môn tiên quyết, phải rút ra sau khi đã bắt đầu học.</p>
<p><strong>P3 — Yêu cầu vượt sĩ số xử lý trên giấy.</strong> Sinh viên muốn một chỗ trong lớp đã đầy thì
gửi email cho bộ môn, bộ môn chuyển sang phòng học vụ, phòng học vụ hỏi giảng viên. Năm
2025–26 có <strong>2.300 yêu cầu vượt sĩ số</strong>, và thời gian trung bình tới lúc có quyết định là
<strong>6 ngày</strong> — đủ lâu để tới lúc có câu trả lời thì sinh viên thường đã chốt một thời khoá
biểu thay thế. Không có bất kỳ bản ghi nào về việc ai đã quyết cái gì, và vì sao.</p>
<p><strong>P4 — Tình trạng học phí được đối chiếu tách rời khỏi việc ghi danh.</strong> Hệ thống tài
chính và hệ thống học vụ không nói chuyện với nhau. Ba nhân viên mất khoảng <strong>hai tuần
mỗi học kỳ</strong> để xuất dữ liệu, ghép và gõ lại tình trạng thanh toán trước khi có thể xác
nhận các lượt ghi danh. Có lúc sinh viên đã đóng tiền vẫn bị chặn, và có lúc sinh viên
còn nợ vẫn được ghi danh.</p>
<p><strong>P5 — Lớp không đủ sĩ số bị phát hiện muộn.</strong> Không ai theo dõi một cách có hệ thống xem
lớp nào không tuyển đủ. Năm 2025–26, trung bình việc huỷ lớp được xác nhận <strong>9 ngày sau
khi đợt thêm/bớt môn mở ra</strong>, mà tới lúc đó thì các sinh viên bị ảnh hưởng đã dựng thời
khoá biểu quanh lớp đó rồi.</p>
<p><strong>P6 — Sinh viên không thấy được vị trí của chính mình.</strong> Không có bản kiểm tra tiến độ
tốt nghiệp thời gian thực, cũng không có số dư tài khoản hiển thị. Nên sinh viên đi hỏi:
sáu văn phòng cố vấn của các khoa ghi nhận khoảng <strong>4.800 lượt hỏi trong năm 2025–26</strong>,
nội dung là sinh viên hỏi mình còn phải học gì, hoặc mình còn nợ bao nhiêu. Phần lớn
những câu đó trả lời được từ dữ liệu trường đã có sẵn.</p>
<h3>1.3 Mục tiêu nghiệp vụ</h3>
<table>
<thead>
<tr>
<th>Mã</th>
<th>Mục tiêu nghiệp vụ</th>
<th>Mốc hiện tại (2025–26)</th>
<th>Mốc đích</th>
<th>Hạn</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>BO-1</strong></td>
<td>Chấm dứt sập hệ thống trong cửa sổ đăng ký và chịu được tải đỉnh</td>
<td>4.200 phiên đồng thời đỉnh; 3 lần sập trong 4 đợt</td>
<td>6.000 phiên đồng thời, <strong>không</strong> lần sập nào, p95 phản hồi ≤ 2 giây</td>
<td>Cửa sổ đăng ký đầu tiên sau bản 1.0</td>
</tr>
<tr>
<td><strong>BO-2</strong></td>
<td>Tự động hoá việc kiểm môn tiên quyết</td>
<td>640 giờ-người/học kỳ; 61 lượt ghi danh sai</td>
<td>≥ 98% lượt đăng ký được quyết định tự động; ≤ 64 giờ-người/học kỳ; <strong>không</strong> lượt ghi danh sai nào</td>
<td>Cuối học kỳ đầu tiên sau bản 1.0</td>
</tr>
<tr>
<td><strong>BO-3</strong></td>
<td>Đưa mọi yêu cầu vượt sĩ số vào một quy trình có theo dõi và có hạn quyết định</td>
<td>2.300 yêu cầu/học kỳ, trung bình 6 ngày, không có bản ghi kiểm toán</td>
<td>100% được theo dõi; ≤ 48 giờ tới lúc có quyết định cho ≥ 90% yêu cầu</td>
<td>Cuối học kỳ đầu tiên sau bản 1.0</td>
</tr>
<tr>
<td><strong>BO-4</strong></td>
<td>Đánh giá điều kiện tài chính tự động ngay lúc đăng ký</td>
<td>~240 giờ-người/học kỳ cho việc ghép tay</td>
<td>≤ 20 giờ-người/học kỳ; <strong>không</strong> sinh viên nào bị chặn sai hoặc được ghi danh sai</td>
<td>Cuối học kỳ đầu tiên sau bản 1.0</td>
</tr>
<tr>
<td><strong>BO-5</strong></td>
<td>Phát hiện lớp không đủ sĩ số trước khi mở đợt thêm/bớt môn</td>
<td>9 ngày sau khi mở</td>
<td>Được đánh dấu <strong>7 ngày trước</strong> khi mở thêm/bớt môn, tự động</td>
<td>Học kỳ thứ hai sau bản 1.0</td>
</tr>
<tr>
<td><strong>BO-6</strong></td>
<td>Cho mọi sinh viên một bản kiểm tra tiến độ và số dư tài khoản thời gian thực</td>
<td>~4.800 lượt hỏi cố vấn/học kỳ</td>
<td>Giảm ≥ 50% (≤ 2.400/học kỳ)</td>
<td>Học kỳ thứ hai sau bản 1.0</td>
</tr>
</tbody>
</table>
<h3>1.4 Thước đo thành công</h3>
<table>
<thead>
<tr>
<th>Thước đo</th>
<th>Cách đo</th>
<th>Nguồn dữ liệu</th>
<th>Tần suất báo cáo</th>
</tr>
</thead>
<tbody>
<tr>
<td>Số phiên đồng thời đỉnh chịu được</td>
<td>Số phiên đã xác thực đồng thời lớn nhất mà p95 phản hồi vẫn ≤ 2 giây</td>
<td>Giám sát hiệu năng ứng dụng</td>
<td>Mỗi cửa sổ đăng ký</td>
</tr>
<tr>
<td>Độ sẵn sàng của hệ đăng ký</td>
<td>Số phút không khả dụng trong một cửa sổ ÷ tổng số phút của cửa sổ</td>
<td>Giám sát uptime</td>
<td>Mỗi cửa sổ đăng ký</td>
</tr>
<tr>
<td>Tỉ lệ quyết định tiên quyết tự động</td>
<td>(Số lượt đăng ký được quyết mà không cần nhân viên can thiệp ÷ tổng số lượt) × 100</td>
<td>Nhật ký kiểm toán ghi danh của CARS</td>
<td>Mỗi học kỳ</td>
</tr>
<tr>
<td>Số lượt ghi danh sai</td>
<td>Số sinh viên bị rút sau khi đã bắt đầu học vì chưa đạt môn tiên quyết</td>
<td>Hồ sơ rút học phần của Phòng Đào tạo</td>
<td>Mỗi học kỳ</td>
</tr>
<tr>
<td>Thời gian quyết định vượt sĩ số</td>
<td>Trung vị và percentile 90 số giờ từ lúc gửi yêu cầu tới lúc ghi nhận quyết định</td>
<td>Bản ghi quy trình vượt sĩ số của CARS</td>
<td>Hằng tuần trong đợt đăng ký</td>
</tr>
<tr>
<td>Số giờ ghép dữ liệu tài chính bằng tay</td>
<td>Số giờ nhân viên tự ghi cho việc đối soát thanh toán</td>
<td>Bảng chấm công phòng học vụ</td>
<td>Mỗi học kỳ</td>
</tr>
<tr>
<td>Thời gian báo trước khi huỷ lớp</td>
<td>Số ngày giữa lúc một lớp bị đánh dấu không đủ sĩ số và lúc mở đợt thêm/bớt môn</td>
<td>Bản ghi lớp học phần của CARS</td>
<td>Mỗi học kỳ</td>
</tr>
<tr>
<td>Lượng câu hỏi tư vấn</td>
<td>Số lượt hỏi được gắn nhãn "tiến độ tốt nghiệp" hoặc "số dư tài khoản"</td>
<td>Nhật ký ticket của văn phòng cố vấn</td>
<td>Mỗi học kỳ</td>
</tr>
</tbody>
</table>
<p><strong>Những yếu tố ảnh hưởng lớn nhất tới thành công (nằm trong tầm kiểm soát của NRU):</strong>
độ chính xác của các luật chương trình đào tạo được chuyển vào bộ kiểm tra tiến độ; mức
độ sẵn sàng của các trưởng bộ môn trong việc quyết định vượt sĩ số trong 48 giờ; chất
lượng dữ liệu bảng điểm lịch sử.</p>
<p><strong>Những yếu tố ngoài tầm kiểm soát của NRU:</strong> việc nhà cung cấp hệ tài chính có chịu mở
API hay không; các thay đổi chương trình đào tạo ở cấp Bộ giữa chừng dự án; hành vi của
sinh viên trong phút đầu tiên mở đợt đăng ký.</p>
<h3>1.5 Vision Statement</h3>
<div class="callout">
<p><strong>Cho</strong> sinh viên, cố vấn học tập, nhân viên học vụ và trưởng bộ môn của Northern
Regional University
<strong>những người</strong> phải hoàn tất việc đăng ký cho 12.000 sinh viên trong một cửa sổ 72
giờ, đồng thời kiểm môn tiên quyết, sĩ số và tình trạng tài chính cho từng lượt ghi
danh,
<strong>Hệ thống Học vụ và Đăng ký môn (CARS)</strong> là một nền tảng quản trị học vụ
<strong>giúp</strong> quyết định mọi lượt ghi danh một cách tự động theo các luật chương trình đào
tạo, sĩ số và tài chính ngay tại thời điểm sinh viên bấm nút, và cho mỗi sinh viên
thấy tiến độ học tập cùng số dư tài khoản của chính mình một cách liên tục thay vì
phải đi hỏi.
<strong>Khác với</strong> hệ thống mười bốn năm tuổi hiện tại, nơi việc đăng ký là một hàng chờ hay
sập và mọi phép kiểm phía sau đều do con người làm sau đó,
<strong>CARS</strong> coi quyết định ghi danh là một giao dịch tự động duy nhất, để sinh viên biết
câu trả lời ngay lập tức còn nhân viên chỉ phải xử lý các ngoại lệ.</p>
</div>
<h3>1.6 Rủi ro nghiệp vụ</h3>
<table>
<thead>
<tr>
<th>Mã</th>
<th>Rủi ro</th>
<th>Mức độ</th>
<th>Xác suất</th>
<th>Biện pháp giảm thiểu</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>RI-1</strong></td>
<td>Nhà cung cấp hệ tài chính không mở API, buộc phải tiếp tục ghép tay và làm hỏng BO-4</td>
<td>Cao</td>
<td>Trung bình</td>
<td>Chốt lập trường của nhà cung cấp trong tuần 3; thiết kế giao tiếp tài chính nằm sau một lớp adapter để có thể thay bằng trao đổi tệp theo đêm mà không đụng tới logic ghi danh</td>
</tr>
<tr>
<td><strong>RI-2</strong></td>
<td>Dữ liệu bảng điểm và chương trình đào tạo lịch sử quá thiếu nhất quán để chạy kiểm tra tiến độ tự động</td>
<td>Cao</td>
<td>Cao</td>
<td>Rà soát dữ liệu luật chương trình và bảng điểm trước khi thiết kế; định nghĩa ngưỡng chấp nhận; với các nhóm sinh viên bị ảnh hưởng thì lùi về chế độ cố vấn xác nhận thay vì hiện một kết quả sai</td>
</tr>
<tr>
<td><strong>RI-3</strong></td>
<td>Tải đỉnh không được tái hiện trong khâu kiểm thử và cửa sổ chạy thật đầu tiên lại hỏng, phá huỷ niềm tin</td>
<td>Cao</td>
<td>Trung bình</td>
<td>Thử tải ở mức 1,5 lần đỉnh lịch sử trước cửa sổ đầu tiên; chạy cửa sổ đầu tiên theo ba đợt kèm một van tiết lưu thủ công</td>
</tr>
<tr>
<td><strong>RI-4</strong></td>
<td>Trưởng bộ môn không quyết định trong 48 giờ, nên BO-3 hỏng vì lý do phần mềm không sửa được</td>
<td>Trung bình</td>
<td>Cao</td>
<td>Cơ chế leo thang và hiển thị độ trễ ngay trong quy trình; Phòng Đào tạo rà các trường hợp vượt hạn hằng tuần; SLA là một quyết định chính sách của trường, được ghi nhận thành một phụ thuộc</td>
</tr>
<tr>
<td><strong>RI-5</strong></td>
<td>Cán bộ học vụ phản đối việc mất quyền quyết định vào tay một luật tự động và tiếp tục cấp ngoại lệ ngoài hệ thống</td>
<td>Trung bình</td>
<td>Trung bình</td>
<td>Mọi luật đều ghi đè được bởi một vai có tên, kèm lý do được ghi lại, nên quyền quyết định vẫn còn nhưng kiểm toán được</td>
</tr>
<tr>
<td><strong>RI-6</strong></td>
<td>Chương trình đào tạo thay đổi giữa chừng dự án làm vô hiệu các luật đã mã hoá</td>
<td>Trung bình</td>
<td>Trung bình</td>
<td>Luật chương trình là cấu hình, không phải mã; một thay đổi là một thay đổi dữ liệu</td>
</tr>
</tbody>
</table>
<h3>1.7 Giả định và phụ thuộc nghiệp vụ</h3>
<p><strong>Giả định</strong></p>
<ul>
<li>A1: NRU tiếp tục vận hành cửa sổ đăng ký 72 giờ chia ba đợt ưu tiên.</li>
<li>A2: Điều kiện chương trình đào tạo diễn đạt được thành luật máy đánh giá được cho ít nhất 90% số ngành.</li>
<li>A3: Dữ liệu bảng điểm trong hệ thống cũ là đầy đủ với sinh viên nhập học từ 2019 trở đi.</li>
<li>A4: Việc định danh và xác thực sinh viên tiếp tục do hệ SSO hiện có của trường cung cấp.</li>
<li>A5: Hệ thống thời khoá biểu và phân phòng vẫn là nơi có thẩm quyền về việc lớp học khi nào và ở đâu.</li>
<li>A6: Mọi sinh viên đang theo học đều có một địa chỉ email của trường mà dịch vụ thông báo gửi tới được.</li>
</ul>
<p><strong>Phụ thuộc</strong></p>
<ul>
<li>D1: Một giao tiếp tới hệ thống tài chính/học phí, hình thức phụ thuộc vào nhà cung cấp (RI-1).</li>
<li>D2: Một văn bản chính sách của trường đã ký, ấn định SLA quyết định vượt sĩ số 48 giờ (BO-3).</li>
<li>D3: Các hội đồng chương trình của khoa xác nhận các điều kiện tốt nghiệp đã mã hoá trước bản 1.0.</li>
<li>D4: Một người quản lý dữ liệu từ Phòng Đào tạo, dành được 8 giờ mỗi tuần trong giai đoạn yêu cầu và chuyển đổi dữ liệu.</li>
</ul>
<hr />
<h3>2. Phạm vi và giới hạn</h3>
<h3>2.1 Các tính năng chính</h3>
<table>
<thead>
<tr>
<th>Mã</th>
<th>Tính năng</th>
<th>Giải quyết</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>FE-1</strong></td>
<td>Tra cứu danh mục môn học và duyệt lớp học phần</td>
<td>P1</td>
</tr>
<tr>
<td><strong>FE-2</strong></td>
<td>Lập kế hoạch thời khoá biểu trước khi mở đăng ký ("giỏ hàng")</td>
<td>P1</td>
</tr>
<tr>
<td><strong>FE-3</strong></td>
<td>Giao dịch ghi danh — một quyết định tự động duy nhất về tiên quyết, sĩ số và tài chính</td>
<td>P1, P2, P4</td>
</tr>
<tr>
<td><strong>FE-4</strong></td>
<td>Bộ luật môn tiên quyết và môn song hành</td>
<td>P2</td>
</tr>
<tr>
<td><strong>FE-5</strong></td>
<td>Đánh giá điều kiện tài chính ngay lúc đăng ký</td>
<td>P4</td>
</tr>
<tr>
<td><strong>FE-6</strong></td>
<td>Quy trình xin và quyết định vượt sĩ số</td>
<td>P3</td>
</tr>
<tr>
<td><strong>FE-7</strong></td>
<td>Quản lý danh sách chờ và tự động thăng suất</td>
<td>P3</td>
</tr>
<tr>
<td><strong>FE-8</strong></td>
<td>Rút, đổi môn và xử lý đợt thêm/bớt môn</td>
<td>—</td>
</tr>
<tr>
<td><strong>FE-9</strong></td>
<td>Kiểm tra tiến độ tốt nghiệp thời gian thực</td>
<td>P6</td>
</tr>
<tr>
<td><strong>FE-10</strong></td>
<td>Màn hình số dư tài khoản và lịch sử thanh toán của sinh viên</td>
<td>P6</td>
</tr>
<tr>
<td><strong>FE-11</strong></td>
<td>Phát hiện lớp không đủ sĩ số và huỷ lớp</td>
<td>P5</td>
</tr>
<tr>
<td><strong>FE-12</strong></td>
<td>Quản trị cửa sổ đăng ký và các đợt ưu tiên</td>
<td>P1</td>
</tr>
<tr>
<td><strong>FE-13</strong></td>
<td>Hồ sơ cố vấn và các khoá chặn cố vấn</td>
<td>P6</td>
</tr>
<tr>
<td><strong>FE-14</strong></td>
<td>Báo cáo ghi danh, sĩ số và khối lượng công việc</td>
<td>P5, tất cả</td>
</tr>
</tbody>
</table>
<h3>2.2 Phạm vi bản phát hành đầu tiên (bản 1.0)</h3>
<p>Bản 1.0 nhắm tới <strong>BO-1, BO-2, BO-3 và BO-4</strong> — tức bản thân cửa sổ đăng ký và ba phép
kiểm nằm phía sau nó. Nó phải chạy thật được cho trọn một cửa sổ đăng ký.</p>
<p>Bao gồm: <strong>FE-1, FE-2, FE-3, FE-4, FE-5, FE-6, FE-7, FE-8, FE-12</strong>.</p>
<p>Ranh giới phạm vi của bản 1.0:</p>
<ul>
<li>Cả sáu khoa ngay từ ngày đầu. Việc đăng ký không thể chạy thí điểm trên một phần sinh viên, vì các lớp được dùng chung giữa các khoa.</li>
<li>Kiểm tra tiến độ tốt nghiệp (FE-9) <strong>không</strong> nằm trong bản này; phần kiểm môn tiên quyết (FE-4) thì có, và hai thứ dùng chung bộ luật chương trình đào tạo, nên FE-9 ở bản 1.1 phần lớn chỉ còn là cấu hình.</li>
<li>Việc đánh giá điều kiện tài chính dùng bất kỳ giao tiếp nào mà nhà cung cấp mở ra (RI-1).</li>
</ul>
<h3>2.3 Phạm vi các bản phát hành tiếp theo</h3>
<table>
<thead>
<tr>
<th>Bản</th>
<th>Mốc</th>
<th>Nội dung</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>1.1</strong></td>
<td>+1 học kỳ</td>
<td><strong>FE-9</strong> kiểm tra tiến độ tốt nghiệp thời gian thực và <strong>FE-10</strong> màn hình số dư tài khoản. Đạt BO-6.</td>
</tr>
<tr>
<td><strong>1.2</strong></td>
<td>+2 học kỳ</td>
<td><strong>FE-11</strong> phát hiện và huỷ lớp không đủ sĩ số; <strong>FE-13</strong> hồ sơ cố vấn và khoá chặn. Đạt BO-5.</td>
</tr>
<tr>
<td><strong>2.0</strong></td>
<td>+3 học kỳ</td>
<td><strong>FE-14</strong> báo cáo và phân tích; đăng ký xét tốt nghiệp; cấp bảng điểm; quy trình chuyển ngành.</td>
</tr>
</tbody>
</table>
<h3>2.4 Giới hạn và loại trừ</h3>
<ul>
<li><strong>EX-1</strong> CARS không thay thế hệ quản lý học tập. Nội dung môn học, bài tập và điểm do giảng viên nhập vẫn nằm ở đó; CARS chỉ tiêu thụ điểm cuối cùng.</li>
<li><strong>EX-2</strong> CARS không thay thế hệ thống tài chính/học phí. Nó đọc điều kiện đủ và không xử lý thanh toán, hoàn tiền hay học bổng.</li>
<li><strong>EX-3</strong> CARS không dựng thời khoá biểu và không phân phòng. Nó tiêu thụ thời khoá biểu đã công bố.</li>
<li><strong>EX-4</strong> CARS không quản lý tuyển sinh hay hồ sơ thí sinh. Một sinh viên tồn tại trong CARS kể từ lúc nhập học.</li>
<li><strong>EX-5</strong> CARS không quản lý hồ sơ nhân sự, hợp đồng khối lượng giảng dạy hay bảng lương.</li>
<li><strong>EX-6</strong> CARS không cấp bảng điểm chính thức hay bằng tốt nghiệp trong các bản 1.0–1.2.</li>
<li><strong>EX-7</strong> CARS không hỗ trợ đăng ký hộ — nhân viên đăng ký thay sinh viên — trừ qua đường vượt sĩ số đã được tài liệu hoá.</li>
<li><strong>EX-8</strong> CARS không thay thế hệ SSO của trường và không tự lưu kho mật khẩu sinh viên.</li>
</ul>
<hr />
<h3>3. Bối cảnh nghiệp vụ</h3>
<h3>3.1 Hồ sơ các bên liên quan</h3>
<table>
<thead>
<tr>
<th>Bên liên quan</th>
<th>Giá trị lớn nhất</th>
<th>Thái độ</th>
<th>Mối quan tâm chính</th>
<th>Ràng buộc</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Phó hiệu trưởng phụ trách Đào tạo</strong> (người tài trợ)</td>
<td>Không còn sự cố đăng ký nào tới tai Hiệu trưởng</td>
<td>Ủng hộ mạnh; sở hữu bài toán kinh doanh</td>
<td>BO-1 trên hết; một cửa sổ đăng ký nhìn thấy được và không sập</td>
<td>Ngân sách tối đa 950.000 USD; phải chạy thật kịp cửa sổ học kỳ 1</td>
</tr>
<tr>
<td><strong>Phòng Đào tạo</strong></td>
<td>Luật học vụ được cưỡng chế nhất quán thay vì dựa vào trí nhớ</td>
<td>Ủng hộ nhưng giữ gìn quyền quyết định học vụ</td>
<td>Mọi quyết định tự động phải ghi đè được và kiểm toán được</td>
<td>Không thể sửa quy chế học vụ của trường cho vừa phần mềm</td>
</tr>
<tr>
<td><strong>Nhân viên học vụ</strong> (14 người dùng)</td>
<td>640 giờ kiểm tay mỗi học kỳ biến mất</td>
<td>Dè dặt — một số lo rằng vai trò co lại theo khối lượng công việc</td>
<td>Việc xử lý ngoại lệ phải thật sự dễ hơn, không chỉ là khác đi</td>
<td>Giờ làm thêm mùa cao điểm đã kịch trần hợp đồng</td>
</tr>
<tr>
<td><strong>Cố vấn học tập</strong> (~40 người dùng)</td>
<td>Sinh viên tới gặp khi đã tự xem bản kiểm tra tiến độ của mình</td>
<td>Rất tiếp nhận; là nhóm hào hứng nhất</td>
<td>Độ chính xác của bản kiểm tra; khả năng ghi lại lời tư vấn và đặt khoá chặn</td>
<td>Hoãn sang bản 1.1; cần một màn hình chỉ-đọc ở bản 1.0</td>
</tr>
<tr>
<td><strong>Trưởng bộ môn</strong> (6 người dùng)</td>
<td>Quyết định vượt sĩ số về trong một hàng chờ thay vì một chuỗi email</td>
<td>Pha trộn — hoan nghênh tính minh bạch, phản đối SLA 48 giờ</td>
<td>Sĩ số lớp và tác động khối lượng công việc của từng quyết định</td>
<td>Khối lượng giảng dạy khiến thời gian hạn chế; SLA phụ thuộc vào chính sách trường (D2)</td>
</tr>
<tr>
<td><strong>Sinh viên</strong> (12.000)</td>
<td>Việc đăng ký chạy được, và biết mình đang ở đâu</td>
<td>Hiện đang bất mãn và lên tiếng</td>
<td>Tốc độ và sự công bằng của cửa sổ đăng ký; độ chính xác của bản kiểm tra tiến độ</td>
<td>Được Hội Sinh viên đại diện với vai trò người bảo vệ sản phẩm</td>
</tr>
<tr>
<td><strong>Cán bộ Tài chính</strong> (3 người dùng)</td>
<td>Hai tuần gõ lại dữ liệu mỗi học kỳ biến mất</td>
<td>Ủng hộ nhưng hoài nghi việc nhà cung cấp sẽ hợp tác</td>
<td>Tính đúng đắn của luật xét điều kiện; một vết kiểm toán rõ ràng</td>
<td>Bị ràng buộc bởi hợp đồng với nhà cung cấp hệ tài chính (RI-1)</td>
</tr>
<tr>
<td><strong>Vận hành CNTT</strong></td>
<td>Một nền tảng được hỗ trợ thay vì một hệ mười bốn năm tuổi</td>
<td>Trung lập; lo về hình dạng tải</td>
<td>Giám sát, năng lực, triển khai và lưu trữ dữ liệu</td>
<td>Phải chạy trong trung tâm dữ liệu hiện có và theo chính sách an ninh của trường</td>
</tr>
</tbody>
</table>
<h3>3.2 Ưu tiên dự án</h3>
<table>
<thead>
<tr>
<th>Chiều</th>
<th>Động lực (nêu mục tiêu)</th>
<th>Ràng buộc (nêu giới hạn)</th>
<th>Bậc tự do (nêu khoảng cho phép)</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Tiến độ</strong></td>
<td>Bản 1.0 chạy thật kịp <strong>cửa sổ đăng ký học kỳ 1</strong></td>
<td>Lịch năm học do quy định của Bộ ấn định và sẽ không dời</td>
<td>—</td>
</tr>
<tr>
<td><strong>Tính năng</strong></td>
<td>—</td>
<td>FE-1 … FE-8 và FE-12 là bắt buộc cho bản 1.0</td>
<td>FE-7 danh sách chờ có thể ra ở dạng rút gọn nếu tiến độ bị đe doạ</td>
</tr>
<tr>
<td><strong>Chất lượng</strong></td>
<td><strong>Không lần sập nào trong đợt đăng ký</strong> là tiêu chí chấp nhận của bài toán kinh doanh</td>
<td>Không được để một quyết định tự động cho phép bất kỳ lượt ghi danh sai nào</td>
<td>90–95% số phép kiểm chấp nhận của người dùng phải đạt cho bản 1.0</td>
</tr>
<tr>
<td><strong>Nhân sự</strong></td>
<td>—</td>
<td>Quy mô nhóm tối đa là 1 PM, 3 BA, 10 lập trình viên, 4 kiểm thử viên</td>
<td>Số BA có thể dao động từ 2 tới 3 trong giai đoạn làm yêu cầu</td>
</tr>
<tr>
<td><strong>Chi phí</strong></td>
<td>—</td>
<td>Tổng ngân sách dự án 950.000 USD</td>
<td>Vượt ngân sách tới 10% vẫn chấp nhận được mà không cần người tài trợ xem lại</td>
</tr>
</tbody>
</table>
<h3>3.3 Cân nhắc khi triển khai</h3>
<ul>
<li><strong>Môi trường.</strong> CARS được triển khai vào trung tâm dữ liệu hiện có của trường, với năng lực cấp phát theo mức đỉnh của đợt đăng ký chứ không theo mức trung bình — hình dạng tải ở đây cực đoan và ngắn, và chính việc tính theo trung bình đã làm hỏng hệ thống cũ.</li>
<li><strong>Chiến lược triển khai.</strong> Khác với một kho hàng hay một chuỗi cửa hàng, việc đăng ký <strong>không thể chạy thí điểm trên một phần dân số</strong>: các lớp được dùng chung giữa các khoa, nên triển khai một phần sẽ chia sĩ số của cùng một lớp ra hai hệ thống. Vì thế bản 1.0 chạy thật cho cả 12.000 sinh viên trong một cửa sổ. Rủi ro do điều này tạo ra được quản lý bằng buổi tổng duyệt song song nói dưới đây, chứ không bằng cách chia giai đoạn.</li>
<li><strong>Tổng duyệt.</strong> Một cửa sổ đăng ký giả lập quy mô đầy đủ được chạy với sinh viên tình nguyện, hai tuần trước cửa sổ thật, ở mức 1,5 lần tải đỉnh dự kiến. Đây là một cổng chặn phát hành, không phải một phép kiểm thử.</li>
<li><strong>Cửa sổ chuyển đổi.</strong> Hệ thống cũ bị đóng băng trong 48 giờ trước khi cửa sổ mở. Dữ liệu ghi danh được chuyển sang và đối chiếu với các tổng kiểm soát trước khi gỡ đóng băng.</li>
<li><strong>Chuyển đổi dữ liệu.</strong> Hồ sơ sinh viên, bảng điểm từ 2019 trở đi, luật chương trình đào tạo và danh mục lớp được chuyển sang. Bảng điểm trước 2019 được chuyển ở chế độ chỉ-đọc và có đánh dấu, vì giả định A3 không phủ tới chúng.</li>
<li><strong>Đào tạo.</strong> Sinh viên không được đào tạo gì — một hệ thống đăng ký mà cần đào tạo là một hệ thống đã thất bại. Nhân viên học vụ và trưởng bộ môn được tập huấn nửa ngày theo từng khoa trước cửa sổ đầu tiên.</li>
<li><strong>Hỗ trợ.</strong> Trực mở rộng phủ trọn cửa sổ 72 giờ, phòng học vụ có người suốt thời gian đó, kèm một phương án dự phòng thủ công đã được tài liệu hoá cho một lượt ghi danh đơn lẻ.</li>
<li><strong>Phương án lùi.</strong> Hệ thống cũ vẫn đọc được và vẫn nhận ghi danh thủ công trong suốt cửa sổ đầu tiên. Nó chỉ bị gỡ bỏ sau khi đã có một cửa sổ trọn vẹn và thành công.</li>
</ul></div>`,
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
    `<div class="ml-en"><h2>Use Cases</h2>
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
<p><strong>Reading the diagram</strong></p>
<ul>
<li>Primary actors are on the <strong>left</strong>, secondary (system) actors on the <strong>right</strong>.</li>
<li>The rectangle is the <strong>system boundary</strong>. The finance system, SSO, timetable system and LMS sit outside it deliberately (Vision &amp; Scope §2.4).</li>
<li><code>«include»</code> arrows point <strong>from</strong> the base use case <strong>to</strong> the always-executed use case.</li>
<li><code>«extend»</code> arrows point <strong>from</strong> the optional use case <strong>to</strong> the base it extends.</li>
</ul>
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
</table></div>
<div class="ml-vi"><h2>Use Cases</h2>
<h2>cho Hệ thống Học vụ và Đăng ký môn (CARS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên nhóm trưởng&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Northern Regional University (NRU)
17 tháng 9 năm 2026</p>
<hr />
<h3>Lịch sử sửa đổi</h3>
<table>
<thead>
<tr>
<th>Người</th>
<th>Ngày</th>
<th>Lý do sửa</th>
<th>Phiên bản</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Danh sách use case ban đầu từ các buổi khai thác 1–3</td>
<td>0.9</td>
</tr>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Hoàn thành và rà soát chéo cả 14 đặc tả</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Actor</h3>
<h3>1.1 Actor chính</h3>
<table>
<thead>
<tr>
<th>Actor</th>
<th>Mô tả</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Sinh viên</strong></td>
<td>12.000 người dùng. Lập kế hoạch thời khoá biểu, đăng ký, rút môn, xin vượt sĩ số, xem bản kiểm tra tiến độ và số dư của chính mình.</td>
</tr>
<tr>
<td><strong>Cố vấn học tập</strong></td>
<td>~40 người dùng. Tư vấn sinh viên, ghi lại lời tư vấn, đặt và gỡ khoá chặn cố vấn.</td>
</tr>
<tr>
<td><strong>Nhân viên học vụ</strong></td>
<td>14 người dùng. Xử lý các ngoại lệ ghi danh mà luật tự động không giải quyết được.</td>
</tr>
<tr>
<td><strong>Trưởng bộ môn</strong></td>
<td>6 người dùng. Quyết định vượt sĩ số cho các lớp của bộ môn mình; huỷ lớp không đủ sĩ số.</td>
</tr>
<tr>
<td><strong>Phòng Đào tạo</strong></td>
<td>2 người dùng. Mở, gia hạn và đóng cửa sổ đăng ký; sở hữu phần cấu hình quy chế học vụ.</td>
</tr>
<tr>
<td><strong>Cán bộ Tài chính</strong></td>
<td>3 người dùng. Xem xét và giải quyết các khoá chặn tài chính phát sinh lúc đăng ký.</td>
</tr>
<tr>
<td><strong>Quản trị hệ thống</strong></td>
<td>2 người dùng. Cấu hình luật chương trình đào tạo, ngành, trần tín chỉ và các tích hợp.</td>
</tr>
</tbody>
</table>
<h3>1.2 Actor phụ (hệ thống ngoài)</h3>
<table>
<thead>
<tr>
<th>Actor</th>
<th>Mô tả</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Hệ thống Tài chính / Học phí</strong></td>
<td>Giữ số dư và lịch sử thanh toán của từng sinh viên. CARS chỉ đọc (EX-2).</td>
</tr>
<tr>
<td><strong>SSO của trường</strong></td>
<td>Xác thực mọi người dùng. CARS không giữ mật khẩu sinh viên nào (EX-8).</td>
</tr>
<tr>
<td><strong>Hệ thống Thời khoá biểu</strong></td>
<td>Công bố mỗi lớp học khi nào và ở đâu. CARS tiêu thụ và không bao giờ sửa (EX-3).</td>
</tr>
<tr>
<td><strong>Hệ quản lý học tập (LMS)</strong></td>
<td>Nhận các lượt ghi danh đã xác nhận; trả điểm cuối kỳ về cho bảng điểm.</td>
</tr>
<tr>
<td><strong>Dịch vụ Thông báo</strong></td>
<td>Gửi email và SMS tới sinh viên và nhân viên thay mặt CARS.</td>
</tr>
</tbody>
</table>
<div class="callout">
<p><strong>Vì sao hệ thống thông tin sinh viên gốc không được liệt kê là actor.</strong> CARS <em>trở
thành</em> chính hệ thống đó lúc chuyển đổi; nó không phải một bên ngoài. Dữ liệu cũ là một
lần chuyển đổi duy nhất, mô tả ở Vision &amp; Scope §3.3, không phải một giao tiếp lúc chạy,
nên nó xuất hiện ở SRS §4.4 chứ không phải ở đây.</p>
</div>
<hr />
<h3>2. Danh sách Use Case</h3>
<table>
<thead>
<tr>
<th>Mã</th>
<th>Actor chính</th>
<th>Actor phụ</th>
<th>Tên use case</th>
<th>Mô tả</th>
</tr>
</thead>
<tbody>
<tr>
<td>UC-01</td>
<td>Sinh viên</td>
<td>Hệ thống Thời khoá biểu</td>
<td>Tra cứu và duyệt danh mục môn học</td>
<td>Tìm lớp theo môn, khoa, giờ học hoặc giảng viên, kèm sĩ số còn lại theo thời gian thực</td>
</tr>
<tr>
<td>UC-02</td>
<td>Sinh viên</td>
<td>—</td>
<td>Dựng thời khoá biểu dự kiến</td>
<td>Lắp một thời khoá biểu tạm trước khi mở đăng ký, có đánh dấu các xung đột</td>
</tr>
<tr>
<td>UC-03</td>
<td>Sinh viên</td>
<td>Hệ thống Tài chính</td>
<td>Đăng ký vào một lớp học phần</td>
<td>Giao dịch ghi danh duy nhất — tiên quyết, sĩ số, xung đột giờ và tài chính cùng được quyết một lúc</td>
</tr>
<tr>
<td>UC-04</td>
<td>CARS (sự kiện)</td>
<td>—</td>
<td>Kiểm môn tiên quyết và môn song hành</td>
<td>Đánh giá bảng điểm của sinh viên theo các luật chương trình đào tạo của một môn</td>
</tr>
<tr>
<td>UC-05</td>
<td>CARS (sự kiện)</td>
<td>Hệ thống Tài chính</td>
<td>Đánh giá điều kiện tài chính</td>
<td>Quyết định tình trạng tài chính của sinh viên có cho phép ghi danh hay không</td>
</tr>
<tr>
<td>UC-06</td>
<td>Sinh viên → Trưởng bộ môn</td>
<td>Dịch vụ Thông báo</td>
<td>Xin và quyết định vượt sĩ số</td>
<td>Một quy trình xin-và-quyết có theo dõi, kèm hạn 48 giờ</td>
</tr>
<tr>
<td>UC-07</td>
<td>Sinh viên</td>
<td>Dịch vụ Thông báo</td>
<td>Vào danh sách chờ và được thăng suất</td>
<td>Xếp hàng cho một lớp đã đầy và được mời chỗ tự động khi có chỗ nhả ra</td>
</tr>
<tr>
<td>UC-08</td>
<td>Sinh viên</td>
<td>—</td>
<td>Rút hoặc đổi lớp</td>
<td>Rời một lớp, hoặc đổi lớp này lấy lớp khác một cách nguyên tử, trong thời gian thêm/bớt môn</td>
</tr>
<tr>
<td>UC-09</td>
<td>Sinh viên</td>
<td>—</td>
<td>Xem kiểm tra tiến độ tốt nghiệp thời gian thực</td>
<td>Thấy điều kiện chương trình nào đã đạt, đang học và còn thiếu</td>
</tr>
<tr>
<td>UC-10</td>
<td>Sinh viên</td>
<td>Hệ thống Tài chính</td>
<td>Xem số dư tài khoản và lịch sử thanh toán</td>
<td>Thấy mình nợ bao nhiêu và đã trả bao nhiêu, không cần liên hệ phòng ban nào</td>
</tr>
<tr>
<td>UC-11</td>
<td>Trưởng bộ môn</td>
<td>Dịch vụ Thông báo</td>
<td>Phát hiện và huỷ lớp không đủ sĩ số</td>
<td>Phát hiện các lớp dưới sĩ số tối thiểu và huỷ chúng kịp thời</td>
</tr>
<tr>
<td>UC-12</td>
<td>Phòng Đào tạo</td>
<td>—</td>
<td>Mở, gia hạn hoặc đóng cửa sổ đăng ký</td>
<td>Điều khiển cửa sổ và các đợt ưu tiên của nó</td>
</tr>
<tr>
<td>UC-13</td>
<td>Cố vấn học tập</td>
<td>—</td>
<td>Tư vấn sinh viên và quản lý khoá chặn cố vấn</td>
<td>Ghi lại lời tư vấn; đặt hoặc gỡ một khoá chặn ngăn ghi danh</td>
</tr>
<tr>
<td>UC-14</td>
<td>Phòng Đào tạo</td>
<td>—</td>
<td>Xuất báo cáo ghi danh và sĩ số</td>
<td>Báo cáo về ghi danh, mức sử dụng sĩ số và hoạt động vượt sĩ số</td>
</tr>
</tbody>
</table>
<div class="callout">
<p><strong>Truy vết về các tính năng ở Vision &amp; Scope:</strong> UC-01→FE-1 · UC-02→FE-2 · UC-03→FE-3 · UC-04→FE-4 · UC-05→FE-5 · UC-06→FE-6 · UC-07→FE-7 · UC-08→FE-8 · UC-09→FE-9 · UC-10→FE-10 · UC-11→FE-11 · UC-12→FE-12 · UC-13→FE-13 · UC-14→FE-14</p>
</div>
<hr />
<h3>3. Đặc tả Use Case</h3>
<h3>UC-01 — Tra cứu và duyệt danh mục môn học</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-01 — Tra cứu và duyệt danh mục môn học</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Sinh viên</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Sinh viên mở danh mục môn học, từ cổng thông tin hoặc từ trình lập kế hoạch ở UC-02.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Sinh viên tìm các lớp mở cho mình trong học kỳ tới, lọc theo môn, khoa, giờ học, giảng viên hoặc sĩ số còn lại. Danh mục là thao tác đọc có sản lượng lớn nhất hệ thống, và phần lớn tải của cửa sổ đăng ký rơi vào đây chứ không rơi vào bản thân việc ghi danh.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Sinh viên đã xác thực qua SSO của trường. <br> PRE-2: Danh mục lớp của học kỳ đang duyệt đã được công bố.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Việc duyệt không làm thay đổi trạng thái ghi danh nào. <br> POST-2: Sĩ số còn lại hiển thị được tính lúc đọc theo BR-03, không cache quá 60 giây.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>1.0</strong> <br> 1. Sinh viên mở danh mục của học kỳ đang mở đăng ký. <br> 2. Hệ thống hiển thị các lớp mà chương trình của sinh viên cho phép, kèm mã môn, tên, tín chỉ, giảng viên, lịch học và sĩ số còn lại. <br> 3. Sinh viên áp dụng bộ lọc — khoa, ngày, giờ, sĩ số còn lại lớn hơn không, từ khoá. <br> 4. Hệ thống trả về các lớp đã lọc. <br> 5. Sinh viên mở một lớp để xem môn tiên quyết, môn song hành và mô tả đầy đủ.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>1.1 — Duyệt khi chưa mở cửa sổ.</strong> Danh mục duyệt được bất cứ lúc nào; hệ thống đánh dấu từng lớp "mở đăng ký từ &lt;ngày&gt;" thay vì đưa ra nút ghi danh. <br> <strong>1.2 — Duyệt môn của chương trình khác.</strong> Sinh viên bỏ bộ lọc theo chương trình; hệ thống hiện mọi lớp nhưng đánh dấu những lớp ngoài chương trình là không đủ điều kiện kèm lý do. <br> <strong>1.3 — Tìm theo giảng viên.</strong> Sinh viên tìm theo tên giảng viên và hệ thống trả về các lớp của giảng viên đó.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>1.0.E1 — Thời khoá biểu chưa công bố.</strong> Ở bước 2, hệ thống thời khoá biểu chưa có lịch học cho một lớp. Hệ thống vẫn liệt kê lớp đó kèm "giờ học sẽ xác nhận sau" và cho phép lập kế hoạch nhưng không cho ghi danh. <br> <strong>1.0.E2 — Danh mục không truy cập được.</strong> Dịch vụ danh mục không phản hồi. Hệ thống trình ra bản danh mục cache không cũ quá 15 phút, có ghi rõ độ cũ, thay vì một trang báo lỗi. <br> <strong>1.0.E3 — Tìm không ra kết quả.</strong> Hệ thống nói rõ bộ lọc nào đã loại hết và mời nới lỏng nó, thay vì hiện một danh sách rỗng.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Cực lớn và dồn cục: ~12.000 sinh viên, trung bình 40 lượt đọc danh mục mỗi người trong cửa sổ 72 giờ, với ~65% rơi vào 30 phút đầu của mỗi đợt trong ba đợt. Đỉnh ~2.800 lượt đọc/giây.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-03, BR-06</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Chính use case này, không phải UC-03, mới quyết định hệ thống có sống sót qua cửa sổ đăng ký hay không (mục tiêu BO-1). Hệ cũ hỏng ở đúng đây: nó tính lại sĩ số cho từng dòng ở từng lượt yêu cầu. POST-2 cho phép một khoảng cache ngắn đúng để sĩ số đọc được rẻ mà không sai tới mức gây hậu quả.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Hệ thống thời khoá biểu công bố danh mục lớp đầy đủ ít nhất 14 ngày trước khi mở cửa sổ đăng ký.</td>
</tr>
</tbody>
</table>
<h3>UC-02 — Dựng thời khoá biểu dự kiến</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-02 — Dựng thời khoá biểu dự kiến</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Sinh viên</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Sinh viên thêm một lớp vào kế hoạch của mình từ danh mục.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Trước khi mở cửa sổ, sinh viên lắp một thời khoá biểu tạm và hệ thống nói trước cho họ mọi thứ có thể chặn nó — xung đột giờ, thiếu môn tiên quyết, trần tín chỉ, khoá chặn. <strong>Đây là tuyến phòng thủ chính trước vấn đề tải P1:</strong> một sinh viên đã lập kế hoạch chỉ cần vài giây trong cửa sổ, không cần vài phút.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Sinh viên đã xác thực. <br> PRE-2: Danh mục lớp của học kỳ đã được công bố.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Kế hoạch không giữ chỗ nào và không tạo ra ưu tiên nào — nó là tạm thời, và hệ thống nói thẳng điều đó. <br> POST-2: Mọi điều kiện gây chặn mà phát hiện được trước cửa sổ đều được hiện ra trên kế hoạch.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>2.0</strong> <br> 1. Sinh viên thêm một lớp vào kế hoạch. <br> 2. Hệ thống kiểm kế hoạch xem có xung đột giờ học không (BR-07) và đánh dấu nếu có. <br> 3. Hệ thống đánh giá môn tiên quyết cho từng lớp trong kế hoạch qua UC-04 và đánh dấu những cái chưa đạt. <br> 4. Hệ thống cộng tổng tín chỉ dự kiến và so với trần tín chỉ của sinh viên (BR-04). <br> 5. Hệ thống hiển thị kế hoạch dưới dạng lưới theo tuần, mỗi cảnh báo gắn vào đúng lớp đã gây ra nó. <br> 6. Sinh viên chỉnh kế hoạch và lặp lại từ bước 1.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>2.1 — Tìm lớp thay thế.</strong> Sinh viên hỏi các lớp khác của cùng môn; hệ thống liệt kê kèm tình trạng xung đột và sĩ số, để có sẵn phương án dự phòng trước khi mở cửa sổ. <br> <strong>2.2 — Lưu nhiều kế hoạch.</strong> Sinh viên lưu tối đa ba kế hoạch có tên và so sánh cạnh nhau. <br> <strong>2.3 — Đăng ký cả kế hoạch.</strong> Khi cửa sổ mở, sinh viên gửi cả kế hoạch; hệ thống thực thi UC-03 cho từng lớp theo thứ tự sinh viên chọn và báo kết quả theo từng lớp.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>2.0.E1 — Lớp trong kế hoạch bị huỷ.</strong> Một lớp trong kế hoạch bị huỷ trước khi mở cửa sổ. Hệ thống đánh dấu nó trong kế hoạch và gợi ý lớp thay thế; nó không âm thầm gỡ bỏ. <br> <strong>2.0.E2 — Môn tiên quyết chuyển thành chưa đạt.</strong> Một điểm được nhập sau khi lập kế hoạch biến một môn tiên quyết đã đạt thành chưa đạt. Hệ thống đánh giá lại khi mở kế hoạch và đánh dấu. <br> <strong>2.0.E3 — Vượt trần tín chỉ.</strong> Kế hoạch vượt trần (BR-04). Hệ thống vẫn cho lưu kế hoạch nhưng đánh dấu là không đăng ký được và nói rõ vượt bao nhiêu tín chỉ.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>~9.000 sinh viên dựng ít nhất một kế hoạch mỗi học kỳ; trung bình ~2,4 lần chỉnh sửa mỗi người. Tải trải đều trong hai tuần trước cửa sổ, và đó chính là mục đích.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-02, BR-04, BR-07, BR-14, BR-20</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>POST-1 là một yêu cầu, không phải một dòng miễn trừ trách nhiệm. Trong buổi khai thác thứ 2, Phòng Đào tạo nói rõ rằng kế hoạch không được tạo ra lợi thế nào, nếu không sinh viên sẽ coi việc lập kế hoạch như một hàng chờ và tính công bằng của hệ thống đợt ưu tiên (BR-06) sẽ sụp đổ.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Sinh viên sẽ lập kế hoạch trước nếu công cụ hữu dụng; lần chuyển lên mạng năm 2019 cho thấy họ có làm khi được đưa cho một công cụ.</td>
</tr>
</tbody>
</table>
<h3>UC-03 — Đăng ký vào một lớp học phần</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-03 — Đăng ký vào một lớp học phần</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Sinh viên</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Sinh viên yêu cầu ghi danh vào một lớp trong đợt đăng ký đang mở của mình.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Giao dịch lõi của cả hệ thống. Môn tiên quyết, môn song hành, sĩ số, xung đột giờ, trần tín chỉ, khoá chặn cố vấn và tình trạng tài chính đều được đánh giá <strong>như một quyết định duy nhất ngay tại thời điểm sinh viên bấm nút</strong>, và sinh viên được báo câu trả lời ngay lập tức. Điều này thay thế một quy trình mà sinh viên được ghi danh trước rồi các phép kiểm mới diễn ra sau đó, bằng tay, đôi khi hàng tuần sau.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Sinh viên đã xác thực và đợt ưu tiên của họ đang mở (BR-06). <br> PRE-2: Lớp tồn tại và thuộc học kỳ đang mở. <br> PRE-3: Sinh viên chưa ghi danh vào lớp này (BR-01).</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Sinh viên được ghi danh vào lớp và một chỗ bị chiếm, <strong>hoặc</strong> không có trạng thái nào thay đổi. Không bao giờ để sót lại một lượt ghi danh làm dở. <br> POST-2: Quyết định, lý do của nó và mọi luật đã được đánh giá đều được ghi lại cho lần thử đó, dù thành công hay thất bại. <br> POST-3: Khi thành công, lượt ghi danh được công bố sang hệ quản lý học tập.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>3.0</strong> <br> 1. Sinh viên yêu cầu ghi danh vào một lớp. <br> 2. Hệ thống xác minh đợt của sinh viên đang mở (BR-06) và không có khoá chặn cố vấn nào đang hiệu lực (BR-14). <br> 3. Hệ thống đánh giá môn tiên quyết và môn song hành qua UC-04. <br> 4. Hệ thống đánh giá điều kiện tài chính qua UC-05. <br> 5. Hệ thống kiểm xung đột giờ học với các lượt ghi danh hiện có của sinh viên (BR-07). <br> 6. Hệ thống kiểm tổng tín chỉ sau khi ghi danh so với trần tín chỉ (BR-04). <br> 7. Hệ thống chiếm một chỗ, với điều kiện sĩ số còn lại lớn hơn không (BR-03). <br> 8. Hệ thống ghi nhận lượt ghi danh, không nhả gì cả, và xác nhận với sinh viên. <br> 9. Hệ thống công bố lượt ghi danh sang hệ quản lý học tập.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>3.1 — Lớp đầy, mời vào danh sách chờ.</strong> Ở bước 7, sĩ số còn lại bằng không. Hệ thống mời vào danh sách chờ và nếu sinh viên đồng ý thì thực thi UC-07 thay vì ghi danh. <br> <strong>3.2 — Lớp đầy, mời xin vượt sĩ số.</strong> Ở bước 7, sĩ số còn lại bằng không và môn đó cho phép vượt sĩ số. Hệ thống mời tạo một yêu cầu vượt sĩ số (UC-06). <br> <strong>3.3 — Cặp môn song hành.</strong> Môn có môn song hành (BR-20). Hệ thống ghi danh sinh viên vào cả hai lớp như một giao dịch duy nhất, hoặc không lớp nào. <br> <strong>3.4 — Ghi danh có nhân viên hỗ trợ.</strong> Nhân viên học vụ thực hiện việc ghi danh thay sinh viên sau khi xử lý một ngoại lệ, kèm lý do được ghi lại.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>3.0.E1 — Chưa đạt môn tiên quyết.</strong> Ở bước 3, một môn tiên quyết chưa đạt (BR-02). Hệ thống từ chối, gọi tên đúng môn học và mức điểm yêu cầu, rồi mời tạo yêu cầu vượt sĩ số. Không chỗ nào bị chiếm. <br> <strong>3.0.E2 — Khoá chặn tài chính.</strong> Ở bước 4, số dư của sinh viên vượt ngưỡng (BR-05). Hệ thống từ chối, nói rõ số tiền còn nợ, và hướng sinh viên sang UC-10. Nó không tiết lộ chi tiết thanh toán ngoài con số số dư. <br> <strong>3.0.E3 — Xung đột giờ.</strong> Ở bước 5, lớp trùng giờ với một lượt ghi danh hiện có (BR-07). Hệ thống từ chối và gọi tên lớp bị trùng cùng khoảng giờ chồng nhau. <br> <strong>3.0.E4 — Vượt trần tín chỉ.</strong> Ở bước 6, lượt ghi danh sẽ vượt trần (BR-04). Hệ thống từ chối và nói rõ trần là bao nhiêu và tổng hiện tại là bao nhiêu. <br> <strong>3.0.E5 — Mất chỗ vào tay một yêu cầu đồng thời.</strong> Ở bước 7, một sinh viên khác chiếm chỗ cuối cùng trước. Hệ thống đọc lại sĩ số, thử lại một lần, rồi mời vào danh sách chờ theo 3.1. <strong>Không chỗ nào bị cấp hai lần.</strong> <br> <strong>3.0.E6 — Hệ thống tài chính không truy cập được.</strong> Ở bước 4, hệ thống tài chính không phản hồi trong 5 giây. Hệ thống <strong>từ chối lượt ghi danh</strong> kèm một nút thử lại, chứ không giả định là đủ điều kiện, và phát một cảnh báo tích hợp. <br> <strong>3.0.E7 — Đang có khoá chặn cố vấn.</strong> Ở bước 2 có một khoá chặn (BR-14). Hệ thống từ chối và gọi tên cố vấn cần liên hệ.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>~12.000 sinh viên × ~5,6 lớp = ~67.000 lượt ghi danh thành công mỗi học kỳ, ~85% trong số đó nằm trong cửa sổ 72 giờ, với các đợt bùng đỉnh ~180 lượt thử ghi danh mỗi giây trong phút đầu của mỗi đợt.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-01, BR-02, BR-03, BR-04, BR-05, BR-06, BR-07, BR-14, BR-20</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>POST-1 làm cho đây trở thành giao dịch đòi hỏi cao nhất hệ thống: bảy phép kiểm độc lập và một lần chiếm chỗ phải cùng thành công hoặc cùng thất bại, dưới mức tải nói trên. Ngoại lệ 3.0.E6 là một lựa chọn chính sách có chủ đích, chốt với Cán bộ Tài chính ở buổi 3 — CARS từ chối chứ không đoán, vì một sinh viên bị ghi danh nhầm trong khi đang nợ tiền thì gỡ ra khó hơn nhiều so với một sinh viên được mời thử lại.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Hệ thống tài chính trả lời được một truy vấn xét điều kiện trong dưới 5 giây ở mức đỉnh; nếu không, thiết kế adapter ở RI-1 sẽ thay bằng một bản chụp theo đêm và đường ngoại lệ đổi theo.</td>
</tr>
</tbody>
</table>
<h3>UC-04 — Kiểm môn tiên quyết và môn song hành</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-04 — Kiểm môn tiên quyết và môn song hành</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>CARS (hệ thống, được gọi)</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Được UC-02 gọi lúc lập kế hoạch hoặc UC-03 gọi lúc ghi danh; hoặc nhân viên chạy hàng loạt để rà một khoá sinh viên.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Bộ máy luật thay thế 640 giờ-người mỗi học kỳ. Nó đánh giá bảng điểm của sinh viên theo các luật chương trình đào tạo gắn với một môn và trả về một quyết định kèm lý do. Nó cố ý là một use case tách khỏi UC-03 vì nó được gọi từ bốn chỗ và phải hành xử giống hệt nhau ở cả bốn.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Luật chương trình đào tạo của môn đó tồn tại và đã được hội đồng chương trình của khoa xác nhận (phụ thuộc D3). <br> PRE-2: Bảng điểm của sinh viên truy cập được.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Kết quả là một quyết định Đạt, Chưa đạt hoặc Không xác định, không bao giờ là một lần cho qua âm thầm. <br> POST-2: Kết quả Chưa đạt phải gọi tên đúng luật chưa thoả và môn học sẽ thoả được nó. <br> POST-3: Kết quả Không xác định — thường là dữ liệu bảng điểm trước 2019, nằm ngoài giả định A3 — được chuyển tới Nhân viên học vụ chứ không giải quyết bằng cách đoán.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>4.0</strong> <br> 1. Hệ thống lấy các luật chương trình đào tạo gắn với môn học. <br> 2. Hệ thống lấy các môn đã hoàn thành và điểm của sinh viên. <br> 3. Hệ thống đánh giá từng luật tiên quyết, kể cả mức điểm tối thiểu nếu có quy định (BR-02). <br> 4. Hệ thống đánh giá các luật môn song hành theo các lượt ghi danh đang học và đang dự kiến của sinh viên (BR-20). <br> 5. Mọi luật đều thoả; hệ thống trả về Đạt.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>4.1 — Môn tiên quyết đang học.</strong> Một môn tiên quyết đang được học và chưa có điểm. Hệ thống trả về Đạt-tạm, cho phép ghi danh, và đánh giá lại khi điểm được nhập. <br> <strong>4.2 — Môn tương đương.</strong> Sinh viên đã qua một môn được ánh xạ là tương đương với môn tiên quyết; hệ thống chấp nhận sự tương đương và ghi lại đã dùng ánh xạ nào. <br> <strong>4.3 — Tín chỉ chuyển đổi.</strong> Môn tiên quyết đã được thoả bằng tín chỉ chuyển từ cơ sở đào tạo khác và đã được duyệt; hệ thống chấp nhận. <br> <strong>4.4 — Rà hàng loạt.</strong> Nhân viên chạy bộ máy này trên cả một khoá để tìm các lượt ghi danh không còn hợp lệ sau khi điểm được nhập.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>4.0.E1 — Môn không có luật chương trình nào.</strong> Ở bước 1, môn học không có luật nào. Hệ thống trả về Không xác định và phát một cảnh báo cấu hình — nó <strong>không</strong> trả về Đạt. Một luật vắng mặt là một luật bị thiếu, không phải một luật dễ dãi. <br> <strong>4.0.E2 — Bảng điểm không đầy đủ.</strong> Ở bước 2, bảng điểm của sinh viên có từ trước 2019 và đã bị đánh dấu (A3). Hệ thống trả về Không xác định và chuyển cho nhân viên. <br> <strong>4.0.E3 — Môn tiên quyết tạm thời bị trượt.</strong> Theo 4.1, điểm được nhập không thoả luật. Hệ thống phát một ngoại lệ ghi-danh-không-hợp-lệ cho nhân viên và báo cho sinh viên cùng cố vấn của họ <strong>trước khi</strong> bắt đầu học, nếu lịch cho phép. <br> <strong>4.0.E4 — Môn song hành vòng tròn.</strong> Hai môn khai nhau là môn tiên quyết thay vì môn song hành. Hệ thống trả về Không xác định và phát cảnh báo cấu hình có nêu tên cả hai môn.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Được gọi khoảng 4 lần cho mỗi lượt thử ghi danh, tính cả lập kế hoạch và đăng ký: ~600.000 lượt đánh giá mỗi học kỳ, đỉnh ~700/giây.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-02, BR-20</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Ngoại lệ 4.0.E1 là dòng quan trọng nhất của cả đặc tả này. Quy trình cũ coi "không tìm thấy luật" là "không có môn tiên quyết", và đó là cách 61 sinh viên lọt vào những môn họ không đủ điều kiện. Trả về Không xác định biến một câu trả lời sai âm thầm thành một đầu việc nhìn thấy được.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Ít nhất 90% số ngành diễn đạt được thành luật máy đánh giá được (A2); phần còn lại được xử lý dưới dạng Không xác định theo thiết kế, không phải do hỏng hóc.</td>
</tr>
</tbody>
</table>
<h3>UC-05 — Đánh giá điều kiện tài chính</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-05 — Đánh giá điều kiện tài chính</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 3</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>CARS (hệ thống, được gọi)</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Được UC-03 gọi lúc ghi danh; hoặc bởi lượt đánh giá lại hằng đêm với các lượt ghi danh hiện có.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Thay thế ba nhân viên mất hai tuần mỗi học kỳ để xuất và ghép dữ liệu thanh toán. CARS hỏi hệ thống tài chính xem tình trạng của sinh viên này có cho phép ghi danh không, và hành động theo câu trả lời ngay lập tức chứ không phải vài tuần sau.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Sinh viên tồn tại trong hệ thống tài chính. <br> PRE-2: Ngưỡng xét điều kiện và các luật ân hạn đã được cấu hình (BR-05).</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Kết quả là Đủ điều kiện, Bị chặn hoặc Không rõ — không bao giờ âm thầm là Đủ điều kiện. <br> POST-2: Kết quả Bị chặn ghi lại số tiền còn nợ tại thời điểm ra quyết định. <br> POST-3: CARS không lưu phương tiện thanh toán hay chi tiết giao dịch nào (EX-2, SRS CO-4).</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>5.0</strong> <br> 1. Hệ thống hỏi hệ thống tài chính về số dư còn nợ và trạng thái khoá chặn của sinh viên. <br> 2. Hệ thống tài chính trả về một số dư và khoá chặn đăng ký tường minh nếu có. <br> 3. Hệ thống so số dư với ngưỡng đã cấu hình (BR-05). <br> 4. Số dư nằm trong ngưỡng và không có khoá chặn nào; hệ thống trả về Đủ điều kiện.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>5.1 — Có kế hoạch trả góp đã duyệt.</strong> Hệ thống tài chính báo có một kế hoạch trả góp đang hiệu lực và không vi phạm; hệ thống trả về Đủ điều kiện bất kể số dư. <br> <strong>5.2 — Học bổng đang chờ áp dụng.</strong> Một học bổng đã được duyệt nhưng chưa áp; hệ thống trả về Đủ điều kiện và ghi nhận rằng số dư dự kiến sẽ giảm. <br> <strong>5.3 — Cán bộ Tài chính ghi đè.</strong> Một Cán bộ Tài chính gỡ khoá chặn cho một sinh viên có tên, kèm lý do được ghi lại và một ngày hết hiệu lực. <br> <strong>5.4 — Đánh giá lại hằng đêm.</strong> Hệ thống đánh giá lại các sinh viên đã ghi danh và phát một ngoại lệ tài chính cho những ai đã rơi ra khỏi diện đủ điều kiện, chứ không tự động gỡ bỏ lượt ghi danh.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>5.0.E1 — Số dư vượt ngưỡng.</strong> Hệ thống trả về Bị chặn kèm số tiền còn nợ. <br> <strong>5.0.E2 — Có khoá chặn đăng ký tường minh.</strong> Hệ thống tài chính báo có khoá chặn bất kể số dư; hệ thống trả về Bị chặn kèm lý do khoá chặn. <br> <strong>5.0.E3 — Hệ thống tài chính không truy cập được.</strong> Hệ thống thử lại hai lần trong 5 giây, rồi trả về <strong>Không rõ</strong>, và UC-03 coi đó là một lần từ chối kèm nút thử lại. Nó không bao giờ giả định là Đủ điều kiện. <br> <strong>5.0.E4 — Không tìm thấy sinh viên trong hệ thống tài chính.</strong> Hệ thống trả về Không rõ và phát một ngoại lệ chất lượng dữ liệu cho Cán bộ Tài chính — chuyện này thường nghĩa là một bản ghi nhập học chưa được đồng bộ.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Một lần cho mỗi lượt thử ghi danh (~90.000 mỗi học kỳ, tính cả các lần bị từ chối) cộng một lượt chạy lô hằng đêm trên toàn bộ sinh viên đã ghi danh (~12.000).</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-05, BR-17</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Việc phân biệt Bị chặn với Không rõ tồn tại vì hai cái đòi hai cách phản ứng khác nhau: Bị chặn là vấn đề sinh viên phải giải quyết, Không rõ là vấn đề của nhà trường. Gộp chúng thành một lần từ chối sẽ bảo sinh viên đi trả một hoá đơn có thể không tồn tại. Luồng 5.4 cố ý phát một ngoại lệ thay vì gỡ ghi danh — loại một sinh viên khỏi lớp học vì một khoản thanh toán bị sót là một quyết định con người phải làm.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Nhà cung cấp hệ tài chính mở ra một truy vấn số-dư-và-khoá-chặn (RI-1). Nếu không, lớp adapter sẽ thay bằng một bản chụp theo đêm và 5.0.E3 trở thành trường hợp thông thường với các khoản thanh toán trong ngày.</td>
</tr>
</tbody>
</table>
<h3>UC-06 — Xin và quyết định vượt sĩ số</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-06 — Xin và quyết định vượt sĩ số</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 3</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Sinh viên (người xin), Trưởng bộ môn (người quyết)</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Một sinh viên xin một chỗ trong lớp đã đầy, hoặc trong lớp mà họ chưa đạt môn tiên quyết.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Thay thế một chuỗi email trung bình mất 6 ngày và không để lại bản ghi nào. Yêu cầu, lý do của nó, quyết định, người quyết và lý do quyết đều nằm trong một quy trình có theo dõi kèm hạn 48 giờ (BR-12).</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Sinh viên đã xác thực và đợt của họ đang mở. <br> PRE-2: Lớp cho phép vượt sĩ số — một số lớp thì không, theo chính sách của khoa. <br> PRE-3: Sinh viên không có yêu cầu vượt sĩ số nào chưa quyết định cho cùng lớp đó.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Mọi yêu cầu đều đi tới một quyết định được ghi lại là Duyệt, Từ chối hoặc Hết hạn — một yêu cầu không bao giờ bị bỏ rơi âm thầm. <br> POST-2: Một lần vượt sĩ số được duyệt dẫn tới một lượt ghi danh <strong>hoặc</strong> dẫn tới một lý do được ghi lại vì sao nó không thành. <br> POST-3: Người quyết, thời điểm quyết và lý do đều được ghi lại cho mọi kết cục (yêu cầu kiểm toán từ Phòng Đào tạo).</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>6.0</strong> <br> 1. Sinh viên chọn lớp và nêu căn cứ xin — lớp đầy, chưa đạt tiên quyết, hoặc bắt buộc vì thời khoá biểu — kèm một lời giải trình. <br> 2. Hệ thống ghi nhận yêu cầu, đóng dấu thời gian, và bắt đầu đếm 48 giờ (BR-12). <br> 3. Hệ thống định tuyến yêu cầu tới Trưởng bộ môn sở hữu lớp đó (BR-11) và báo cho họ. <br> 4. Trưởng bộ môn mở yêu cầu và thấy trích lục bảng điểm của sinh viên, sĩ số hiện tại của lớp so với sức chứa, sức chứa phòng học, và mọi yêu cầu đang chờ khác của cùng lớp. <br> 5. Trưởng bộ môn duyệt, và ghi lại lý do. <br> 6. Hệ thống nâng sức chứa hiệu lực của lớp thêm một, chỉ dành cho sinh viên này, và ghi danh sinh viên qua UC-03 với cờ vượt sĩ số được áp. <br> 7. Hệ thống báo kết quả cho sinh viên.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>6.1 — Từ chối.</strong> Ở bước 5, Trưởng bộ môn từ chối kèm lý do; hệ thống báo cho sinh viên và mời vào danh sách chờ (UC-07) hoặc gợi ý lớp thay thế. <br> <strong>6.2 — Quyết định theo lô.</strong> Có nhiều yêu cầu cho cùng một lớp; Trưởng bộ môn thấy chúng cùng lúc kèm tác động tích luỹ lên sĩ số và quyết cả lô trong một thao tác. <br> <strong>6.3 — Uỷ quyền.</strong> Trưởng bộ môn uỷ quyền quyết định cho một người phó có tên trong một khoảng thời gian cố định; danh tính người được uỷ quyền được ghi là người quyết. <br> <strong>6.4 — Rút yêu cầu.</strong> Sinh viên rút yêu cầu trước khi có quyết định; hệ thống ghi nhận là Đã rút và dừng đồng hồ.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>6.0.E1 — Quá hạn.</strong> 48 giờ trôi qua mà chưa có quyết định (BR-12). Hệ thống leo thang lên Phòng Đào tạo, đánh dấu yêu cầu là Quá hạn, và tiếp tục đếm. Yêu cầu <strong>không</strong> bị tự duyệt và <strong>không</strong> bị tự từ chối — cả hai đều sẽ xoá mất đúng cái phán đoán học vụ mà quy trình này sinh ra để ghi lại. <br> <strong>6.0.E2 — Đã duyệt nhưng không còn ghi danh được.</strong> Ở bước 6, sinh viên từ lúc đó đã phát sinh một xung đột giờ hoặc một khoá chặn tài chính. Hệ thống ghi nhận việc đã duyệt, không ghi danh, báo cho cả hai bên kèm đúng thứ đang chặn, và giữ hiệu lực của lần duyệt đó trong 72 giờ. <br> <strong>6.0.E3 — Vượt sức chứa phòng.</strong> Việc duyệt sẽ đẩy sĩ số vượt quá sức chứa vật lý của phòng lấy từ hệ thống thời khoá biểu. Hệ thống cảnh báo Trưởng bộ môn <strong>trước khi</strong> quyết định được ghi lại và đòi phải xác nhận tường minh. <br> <strong>6.0.E4 — Lớp bị huỷ khi yêu cầu còn treo.</strong> Hệ thống đóng yêu cầu với trạng thái Vô hiệu, báo cho sinh viên, và gợi ý lớp thay thế. <br> <strong>6.0.E5 — Cửa sổ đóng trước khi kịp ghi danh.</strong> Quyết định duyệt về sau khi cửa sổ đăng ký đã đóng. Hệ thống chuyển việc ghi danh cho Nhân viên học vụ áp dụng bằng tay.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>~2.300 yêu cầu mỗi học kỳ, ~78% trong số đó nằm trong cửa sổ 72 giờ; đỉnh ~90 yêu cầu/giờ.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-02, BR-03, BR-11, BR-12</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>6.0.E1 là quyết định khó nhất trong khâu khai thác yêu cầu. Phòng Đào tạo muốn tự duyệt khi quá hạn để bảo đảm SLA; các Trưởng bộ môn từ chối, với lý do khi đó phần mềm sẽ đang ban phát những ngoại lệ học vụ mà không ai đồng ý. Cách giải quyết — leo thang và tiếp tục đếm — làm cho việc quá hạn hiện ra trước mắt người sở hữu chính sách (phụ thuộc D2) mà hệ thống không phải bịa ra một quyết định học vụ.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Một văn bản chính sách của trường ấn định SLA 48 giờ được ký trước bản 1.0 (D2). Không có nó thì BR-12 chỉ là một mốc mà không có thẩm quyền nào đứng sau.</td>
</tr>
</tbody>
</table>
<h3>UC-07 — Vào danh sách chờ và được thăng suất</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-07 — Vào danh sách chờ và được thăng suất</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 3</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Sinh viên</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Một sinh viên vào danh sách chờ của một lớp đã đầy, hoặc một chỗ được nhả ra trong lớp có danh sách chờ.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Phương án công bằng thay cho việc xin vượt sĩ số: một hàng chờ mà chính hệ thống tự vận hành. Khi một chỗ được nhả, sinh viên đủ điều kiện đứng đầu danh sách được mời tự động và có 24 giờ để nhận (BR-08, BR-09).</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Lớp đã đầy (BR-03). <br> PRE-2: Sinh viên thoả mọi luật ghi danh trừ sĩ số — một sinh viên không học được môn đó thì không được chiếm một vị trí trong hàng chờ.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Mỗi sinh viên giữ tối đa một vị trí chờ cho mỗi môn. <br> POST-2: Một chỗ được nhả ra chỉ được mời cho đúng một sinh viên tại một thời điểm; không bao giờ hai sinh viên được mời cùng một chỗ. <br> POST-3: Vị trí trong hàng chờ được xác định theo thời điểm vào hàng trong phạm vi đợt ưu tiên, và không bao giờ bị thay đổi ngoài các luật nêu ở đây.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>7.0</strong> <br> 1. Sinh viên xin vào danh sách chờ của một lớp đã đầy. <br> 2. Hệ thống xác minh mọi luật trừ sĩ số qua UC-04 và UC-05. <br> 3. Hệ thống thêm sinh viên vào hàng chờ và nói rõ vị trí của họ. <br> 4. Một chỗ được nhả — do rút môn (UC-08), do một lần vượt sĩ số bị huỷ, hoặc do một thay đổi hành chính. <br> 5. Hệ thống xác định sinh viên đầu tiên trong hàng mà vẫn thoả mọi luật. <br> 6. Hệ thống giữ chỗ cho sinh viên đó và báo cho họ, bắt đầu đếm đồng hồ 24 giờ của lời mời (BR-09). <br> 7. Sinh viên nhận; hệ thống ghi danh họ qua UC-03 và gỡ họ khỏi hàng chờ.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>7.1 — Từ chối lời mời.</strong> Sinh viên từ chối; hệ thống nhả chỗ ngay lập tức và mời sinh viên đủ điều kiện kế tiếp. <br> <strong>7.2 — Rời hàng chờ.</strong> Sinh viên tự rời; mọi người phía sau tiến lên. <br> <strong>7.3 — Tự động nhận.</strong> Sinh viên đã chọn tự động nhận lúc vào hàng; hệ thống ghi danh họ ngay ở bước 6 mà không chờ, rồi báo sau. <br> <strong>7.4 — Không đủ điều kiện lúc được thăng suất.</strong> Ở bước 5, sinh viên kế tiếp nay đã có xung đột hoặc khoá chặn; hệ thống bỏ qua họ <strong>mà không gỡ họ khỏi hàng chờ</strong>, báo cho họ vì sao bị bỏ qua, và mời chỗ đó cho sinh viên kế tiếp.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>7.0.E1 — Lời mời hết hạn.</strong> 24 giờ trôi qua không có phản hồi (BR-09). Hệ thống nhả chỗ, gỡ sinh viên khỏi hàng chờ, và báo cho họ. <br> <strong>7.0.E2 — Mất chỗ giữa lúc mời và lúc nhận.</strong> Lớp bị huỷ, hoặc sĩ số bị giảm, trong khi một lời mời còn treo. Hệ thống vô hiệu lời mời và báo cho sinh viên kèm lý do. <br> <strong>7.0.E3 — Xung đột giờ lúc nhận.</strong> Sinh viên nhận nhưng từ lúc đó đã ghi danh một lớp trùng giờ (BR-07). Hệ thống từ chối, gọi tên chỗ trùng, và mời chỗ đó cho sinh viên kế tiếp sau 1 giờ, cho sinh viên đầu một cơ hội rút lớp gây xung đột. <br> <strong>7.0.E4 — Cửa sổ đăng ký đóng khi còn lời mời treo.</strong> Các lời mời còn treo vẫn hiệu lực trọn 24 giờ của chúng; các lượt nhận sau khi cửa sổ đóng vẫn được hệ thống áp dụng, và hệ thống ghi lại rằng chúng diễn ra sau cửa sổ.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Trung bình</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>~3.400 lượt vào danh sách chờ mỗi học kỳ trên khoảng 290 lớp; ~1.100 lượt được thăng suất.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-03, BR-07, BR-08, BR-09</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>POST-2 và ngoại lệ 7.0.E3 đi cùng nhau mới là thứ làm cho danh sách chờ trở nên công bằng chứ không chỉ là tự động. Khoảng dừng một giờ ở 7.0.E3 do đại diện Hội Sinh viên yêu cầu ở buổi 4: trường hợp phổ biến là sinh viên giữ tạm một lớp lót chỗ mà họ định rút ngay khi lớp thật sự mình muốn mở ra, và chuyển chỗ đi ngay lập tức chính là trừng phạt đúng cái hành vi mà danh sách chờ đáng ra phải khuyến khích.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Sinh viên kiểm email của trường ít nhất mỗi ngày một lần trong đợt đăng ký; cửa sổ 24 giờ ở BR-09 dựa trên điều này và cấu hình được nếu hoá ra giả định sai.</td>
</tr>
</tbody>
</table>
<h3>UC-08 — Rút hoặc đổi lớp</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-08 — Rút hoặc đổi lớp</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 3</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Sinh viên</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Sinh viên rút một lớp đã ghi danh, hoặc đổi lớp này lấy lớp khác.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Rời một lớp sẽ nhả ra một chỗ, và đó chính là thứ nuôi danh sách chờ. <strong>Đổi lớp</strong> mới là trường hợp quan trọng: rút A rồi thêm B thành hai thao tác riêng có thể làm mất chỗ ở A mà không lấy được B, và đó đúng là cái bẫy sinh viên hay sa vào trong một cửa sổ 72 giờ.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Sinh viên đang ghi danh lớp đó. <br> PRE-2: Ngày hiện tại nằm trong một giai đoạn cho phép thao tác đó (BR-16).</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Một lần đổi lớp hoặc hoàn tất trọn vẹn, hoặc không thay đổi gì — sinh viên không bao giờ kết thúc mà không có lớp nào. <br> POST-2: Một chỗ được nhả ra sẽ được mời cho danh sách chờ trong vòng 60 giây (BR-08). <br> POST-3: Việc rút được công bố sang hệ quản lý học tập và được ghi nhận trên bảng điểm theo đúng giai đoạn mà nó diễn ra (BR-16).</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>8.0</strong> <br> 1. Sinh viên chọn một lớp đã ghi danh và chọn Rút. <br> 2. Hệ thống nói rõ hệ quả ở giai đoạn hiện tại — không để lại dấu, hay ghi nhận là rút học phần (BR-16) — và hỏi xác nhận. <br> 3. Sinh viên xác nhận. <br> 4. Hệ thống gỡ lượt ghi danh và nhả chỗ. <br> 5. Hệ thống kích hoạt việc thăng suất danh sách chờ ở UC-07. <br> 6. Hệ thống công bố thay đổi sang hệ quản lý học tập.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>8.1 — Đổi lớp.</strong> Sinh viên chọn một lớp đã ghi danh và một lớp thay thế. Hệ thống kiểm toàn bộ lớp thay thế (UC-04, UC-05, BR-07, BR-04) <strong>trước khi</strong> nhả chỗ cũ, rồi thực hiện cả hai thao tác như một giao dịch duy nhất. Nếu lớp thay thế không qua được phép kiểm, lượt ghi danh gốc không bị đụng tới. <br> <strong>8.2 — Rút một cặp môn song hành.</strong> Rút một nửa của cặp môn song hành (BR-20) sẽ rút cả hai; hệ thống nói rõ điều đó trước khi xác nhận. <br> <strong>8.3 — Rút có nhân viên hỗ trợ.</strong> Nhân viên học vụ rút cho sinh viên sau khi giai đoạn đã đóng, kèm lý do và thẩm quyền được ghi lại.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>8.0.E1 — Ngoài giai đoạn cho phép.</strong> Đợt thêm/bớt môn đã đóng (BR-16). Hệ thống từ chối và giải thích quy trình rút học phần, vốn nằm ngoài CARS ở các bản 1.0–1.2. <br> <strong>8.0.E2 — Lớp muốn đổi sang đã hết chỗ.</strong> Ở luồng 8.1, lớp thay thế đầy lên giữa lúc kiểm và lúc thực hiện giao dịch. Hệ thống bỏ dở việc đổi, giữ nguyên lượt ghi danh gốc, và mời vào danh sách chờ của lớp muốn đổi sang. <br> <strong>8.0.E3 — Rút sẽ phá vỡ một cặp môn song hành.</strong> Sinh viên rút một nửa và từ chối rút nửa kia. Hệ thống từ chối và giải thích BR-20. <br> <strong>8.0.E4 — Rút sẽ làm sinh viên xuống dưới số tín chỉ tối thiểu.</strong> Hệ thống cảnh báo, nêu rõ hệ quả với học bổng hoặc tình trạng thị thực nếu có đánh dấu, và đòi xác nhận tường minh. Nó không từ chối — đó là quyết định của sinh viên.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>~18.000 lượt rút và ~7.000 lượt đổi lớp mỗi học kỳ; ~60% nằm trong cửa sổ 72 giờ.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-04, BR-07, BR-08, BR-16, BR-20</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Luồng 8.1 tồn tại vì một lời phàn nàn cụ thể được ghi lại ở buổi 1: với hệ cũ, sinh viên phải rút trước rồi mới thêm được, và trong một cửa sổ đông đúc thì chỗ họ muốn thường xuyên bị người khác lấy mất trong đúng mấy giây ở giữa. Làm cho việc đổi lớp trở nên nguyên tử là thay đổi được Hội Sinh viên yêu cầu nhiều nhất.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Lịch năm học định nghĩa các giai đoạn thêm/bớt môn và rút học phần cho từng học kỳ, và được cấu hình trước khi mở một cửa sổ.</td>
</tr>
</tbody>
</table>
<h3>UC-09 — Xem kiểm tra tiến độ tốt nghiệp thời gian thực</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-09 — Xem kiểm tra tiến độ tốt nghiệp thời gian thực</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Sinh viên</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Sinh viên mở bản kiểm tra tiến độ của mình, hoặc cố vấn mở bản của một sinh viên từ hồ sơ tư vấn.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Hiện mọi điều kiện của chương trình sinh viên đang học ở trạng thái Đã đạt, Đang học hoặc Còn thiếu, tính từ chính bộ luật chương trình mà bộ máy ghi danh dùng. <strong>Đây là use case xoá đi khoảng 4.800 lượt hỏi cố vấn mỗi học kỳ</strong> (mục tiêu BO-6), và là mô hình đọc phức tạp nhất hệ thống.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Người xem đã xác thực và là chính sinh viên đó hoặc một cố vấn được phân công cho họ. <br> PRE-2: Chương trình của sinh viên có luật chương trình đã được xác nhận (D3).</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Bản kiểm tra phản ánh các lượt ghi danh và điểm tính tới đúng thời điểm xem; không phục vụ từ cache cũ quá 5 phút. <br> POST-2: Mọi điều kiện hiện ra đều nói rõ những môn cụ thể nào đã thoả nó. <br> POST-3: Điều kiện mà bộ máy không đánh giá nổi được hiện là <strong>Cần xem lại</strong> kèm lý do, không bao giờ là Đã đạt hay Còn thiếu.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>9.0</strong> <br> 1. Người xem mở bản kiểm tra. <br> 2. Hệ thống lấy chương trình của sinh viên và các nhóm điều kiện của nó — cơ sở ngành, chuyên ngành, tự chọn, đại cương, tổng tín chỉ. <br> 3. Hệ thống đánh giá từng nhóm theo các môn đã hoàn thành, các lượt ghi danh đang học và tín chỉ chuyển đổi đã duyệt. <br> 4. Hệ thống tính tỉ lệ hoàn thành tổng thể (BR-13). <br> 5. Hệ thống hiển thị từng nhóm kèm trạng thái, các môn đã thoả nó, và phần còn lại. <br> 6. Hệ thống hiển thị số tín chỉ còn lại và học kỳ dự kiến tốt nghiệp.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>9.1 — Lập kế hoạch "nếu như".</strong> Sinh viên thêm một môn dự kiến; hệ thống đánh giá lại và cho thấy môn đó sẽ thoả những điều kiện nào, <strong>mà không thay đổi trạng thái nào</strong>. <br> <strong>9.2 — "Nếu như" đổi ngành.</strong> Sinh viên chọn một chương trình khác; hệ thống đánh giá hồ sơ hiện có của họ theo luật của chương trình đó và cho thấy khoảng cách. <br> <strong>9.3 — Màn hình của cố vấn.</strong> Cố vấn thấy đúng bản kiểm tra đó cộng thêm ghi chú tư vấn và trạng thái khoá chặn, và xuất được ra để dùng trong buổi gặp. <br> <strong>9.4 — Tính cả các lớp dự kiến.</strong> Sinh viên đưa cả kế hoạch ở UC-02 vào; hệ thống đánh dấu kế hoạch đó sẽ đẩy tiến độ của những điều kiện nào.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>9.0.E1 — Không đánh giá được một điều kiện.</strong> Một luật tham chiếu tới một môn không còn tồn tại, hoặc hồ sơ sinh viên có từ trước 2019 (A3). Hệ thống hiện <strong>Cần xem lại</strong> kèm lý do và mời liên hệ cố vấn. Nó không bao giờ đoán. <br> <strong>9.0.E2 — Luật chương trình đổi giữa chừng khoá học.</strong> Luật theo năm quy chế của sinh viên khác với luật hiện hành. Hệ thống đánh giá theo <strong>năm quy chế lúc sinh viên nhập học</strong> và ghi rõ đã dùng năm nào. <br> <strong>9.0.E3 — Điểm đang bị phúc khảo.</strong> Một điểm còn tạm trong khi chờ phúc khảo. Hệ thống đánh giá theo điểm hiện tại, đánh dấu điều kiện bị ảnh hưởng là tạm, và gọi tên môn học đó. <br> <strong>9.0.E4 — Phép tính vượt quá ngân sách thời gian.</strong> Hệ thống hiện các nhóm điều kiện đã tính xong và đánh dấu phần còn lại là đang chờ kèm nút thử lại, thay vì làm hỏng cả trang.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Trung bình — hoãn sang bản 1.1</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Giả định 70% sinh viên xem hai lần mỗi học kỳ, cộng các lượt cố vấn xem: ~19.000 lượt mỗi học kỳ, dồn vào trước các cửa sổ đăng ký.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-02, BR-13, BR-18, BR-20</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>POST-3 và ngoại lệ 9.0.E1 tồn tại vì một bản kiểm tra tiến độ <em>sai</em> còn tệ hơn là không có: một sinh viên bị báo rằng mình đã thoả một điều kiện mà thực ra chưa chính là kiểu hỏng đã sinh ra lá đơn gửi Hiệu trưởng mô tả ở Vision &amp; Scope §1.1. Ngoại lệ 9.0.E2 — đánh giá theo năm quy chế lúc nhập học — là một quy định của trường, không phải một sở thích thiết kế.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Luật chương trình được phiên bản hoá theo năm quy chế và năm quy chế của sinh viên có được ghi lại.</td>
</tr>
</tbody>
</table>
<h3>UC-10 — Xem số dư tài khoản và lịch sử thanh toán</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-10 — Xem số dư tài khoản và lịch sử thanh toán</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Sinh viên</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Sinh viên mở màn hình tài khoản, hoặc đi theo đường dẫn từ một lần ghi danh bị từ chối (UC-03 ngoại lệ 3.0.E2).</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Cho thấy sinh viên nợ gì, đã trả gì, và một khoá chặn hiện tại nghĩa là gì — nửa còn lại của mục tiêu BO-6. CARS hiển thị dữ liệu này; nó không sở hữu và không thu tiền (EX-2).</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Người xem đã xác thực và chính là sinh viên đó. <br> PRE-2: Sinh viên tồn tại trong hệ thống tài chính.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Không sinh viên nào thấy dữ liệu tài chính của sinh viên khác. <br> POST-2: CARS không lưu chi tiết phương tiện thanh toán nào. <br> POST-3: Mọi con số đều hiển thị thời điểm nó được lấy về từ hệ thống tài chính.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>10.0</strong> <br> 1. Sinh viên mở màn hình tài khoản. <br> 2. Hệ thống hỏi hệ thống tài chính về số dư, các khoản phải nộp và lịch sử thanh toán. <br> 3. Hệ thống hiển thị số dư hiện tại, các khoản cấu thành nó, các lần đã nộp, và ngưỡng đủ điều kiện đăng ký (BR-05). <br> 4. Nếu đang có khoá chặn, hệ thống nói rõ số tiền phải nộp để gỡ. <br> 5. Hệ thống dẫn tới kênh thanh toán của trường, vốn nằm ngoài CARS.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>10.1 — Kế hoạch trả góp.</strong> Có một kế hoạch đang hiệu lực; hệ thống hiện lịch trả và ngày tới hạn kế tiếp. <br> <strong>10.2 — Học bổng đã áp.</strong> Một học bổng làm giảm số dư; hệ thống hiện nó thành một dòng riêng. <br> <strong>10.3 — Ước tính cho một kế hoạch thời khoá biểu.</strong> Sinh viên hỏi kế hoạch ở UC-02 sẽ tốn bao nhiêu; hệ thống tính theo BR-17 và ghi rõ đó là <strong>ước tính</strong>, không phải một khoản phải nộp.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>10.0.E1 — Hệ thống tài chính không truy cập được.</strong> Hệ thống hiện các con số lấy về gần nhất kèm dấu thời gian và một dòng ghi rõ rằng chúng có thể đã cũ. Nó không hiện một trang trắng và không hiện số dư bằng không. <br> <strong>10.0.E2 — Không tìm thấy sinh viên trong hệ thống tài chính.</strong> Hệ thống nói rằng không lấy được tài khoản và đưa thông tin liên hệ Phòng Tài chính; nó phát một ngoại lệ chất lượng dữ liệu thay vì hiện số dư bằng không. <br> <strong>10.0.E3 — Số dư đang bị khiếu nại.</strong> Có một khiếu nại được đánh dấu; hệ thống hiện số tiền đang tranh chấp riêng ra và nói rõ khoá chặn vẫn còn cho tới khi giải quyết xong.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Trung bình — hoãn sang bản 1.1</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>~12.000 sinh viên × ~3 lượt xem mỗi học kỳ, tăng vọt sau mỗi lần ghi danh bị từ chối vì khoá chặn tài chính.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-05, BR-17</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Ngoại lệ 10.0.E1 cùng một nguyên tắc với UC-09 POST-3: hiện một con số cũ kèm độ cũ của nó là trung thực, hiện số không là một lời nói dối sẽ sinh ra đúng cuộc gọi điện mà tính năng này ra đời để ngăn.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Hệ thống tài chính mở ra cả các khoản phải nộp và các lần đã nộp, không chỉ một số dư ròng; nếu không thì luồng 10.1 và 10.2 thoái hoá thành một con số duy nhất.</td>
</tr>
</tbody>
</table>
<h3>UC-11 — Phát hiện và huỷ lớp không đủ sĩ số</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-11 — Phát hiện và huỷ lớp không đủ sĩ số</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 3</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Trưởng bộ môn</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Phép kiểm sĩ số theo lịch chạy, hoặc một Trưởng bộ môn mở màn hình khả năng duy trì lớp.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Tìm ra các lớp sẽ không đạt sĩ số tối thiểu duy trì được <strong>trước khi</strong> mở đợt thêm/bớt môn, để sinh viên bị ảnh hưởng còn kịp dựng lại thời khoá biểu thay vì phát hiện việc huỷ lớp khi đã vào đợt được chín ngày.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Người dùng giữ vai Trưởng bộ môn của bộ môn sở hữu lớp, hoặc vai Phòng Đào tạo. <br> PRE-2: Sĩ số tối thiểu duy trì được đã cấu hình cho lớp hoặc kế thừa từ khoa (BR-15).</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Một lớp bị huỷ thì mọi sinh viên đã ghi danh đều được báo và mọi chỗ đều được nhả, hoặc việc huỷ không hoàn tất (BR-19). <br> POST-2: Việc huỷ ghi lại ai quyết định, lúc nào và vì sao. <br> POST-3: Lớp bị huỷ được gỡ khỏi danh mục và khỏi mọi kế hoạch sinh viên có tham chiếu tới nó.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>11.0</strong> <br> 1. Hệ thống đánh giá mọi lớp so với sĩ số tối thiểu duy trì được, 7 ngày trước khi mở thêm/bớt môn (BR-10, BR-15). <br> 2. Hệ thống liệt kê các lớp bị đánh dấu cho Trưởng bộ môn, kèm sĩ số hiện tại, mức tối thiểu, độ dài danh sách chờ và giảng viên. <br> 3. Trưởng bộ môn xem xét một lớp bị đánh dấu và chọn huỷ. <br> 4. Hệ thống cho thấy chính xác ai bị ảnh hưởng — sinh viên đã ghi danh, sinh viên đang chờ — và ai trong số đó sẽ rơi xuống dưới số tín chỉ tối thiểu do việc này. <br> 5. Trưởng bộ môn xác nhận và ghi lại lý do. <br> 6. Hệ thống nhả mọi lượt ghi danh, báo cho từng sinh viên bị ảnh hưởng kèm các phương án thay thế, và gỡ lớp khỏi danh mục (BR-19). <br> 7. Hệ thống báo cho Phòng Đào tạo và hệ thống thời khoá biểu rằng phòng học và khung giờ đã trống.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>11.1 — Giữ lớp lại.</strong> Trưởng bộ môn quyết định vẫn mở lớp dù dưới mức tối thiểu và ghi lại lý do; lớp được gỡ khỏi danh sách đánh dấu cho học kỳ đó. <br> <strong>11.2 — Gộp lớp.</strong> Hai lớp không đủ sĩ số của cùng một môn được gộp; hệ thống chuyển sinh viên từ lớp này sang lớp kia, kiểm xung đột giờ cho từng người (BR-07) và báo lại những ai nó không chuyển được. <br> <strong>11.3 — Phòng Đào tạo chủ động huỷ.</strong> Phòng Đào tạo huỷ xuyên các bộ môn, ví dụ khi một giảng viên không còn dạy được.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>11.0.E1 — Một sinh viên không chuyển được khi gộp lớp.</strong> Ở luồng 11.2, một sinh viên bị xung đột giờ với lớp còn lại. Hệ thống hoàn tất việc gộp cho tất cả những người khác và phát một ngoại lệ liệt kê những sinh viên phải xử lý riêng. Nó không âm thầm gỡ ghi danh của họ. <br> <strong>11.0.E2 — Việc huỷ sẽ khiến một sinh viên không tốt nghiệp được.</strong> Một sinh viên cần lớp này để hoàn thành chương trình ngay học kỳ này (BR-18). Hệ thống cảnh báo <strong>trước</strong> khi xác nhận, gọi tên các sinh viên đó, và đòi phải xác nhận tường minh. <br> <strong>11.0.E3 — Gửi thông báo thất bại.</strong> Thông báo tới một sinh viên không gửi được. Việc huỷ vẫn có hiệu lực nhưng hệ thống phát một đầu việc theo dõi cho phòng học vụ; không sinh viên nào bị bỏ mặc mà không được báo và không được ghi nhận. <br> <strong>11.0.E4 — Xin huỷ sau khi đã bắt đầu dạy.</strong> Hệ thống từ chối và chuyển yêu cầu tới Phòng Đào tạo, vì đây là một quyết định học vụ chịu quy định, nằm ngoài quy trình này.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Thấp — hoãn sang bản 1.2</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>~1.400 lớp được đánh giá mỗi học kỳ; ~70 lớp bị đánh dấu; ~45 lớp bị huỷ.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-07, BR-10, BR-15, BR-18, BR-19</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Ngoại lệ 11.0.E2 mới là lý do use case này đáng được tự động hoá. Quy trình cũ tìm ra các lớp không đủ sĩ số muộn và huỷ chúng mà không kiểm xem ai cần chúng để tốt nghiệp; xác định được sinh viên đó <em>trước</em> khi ra quyết định chính là khác biệt giữa một hành động hành chính và một hành động học vụ.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Sĩ số tối thiểu duy trì được là một chính sách cấp khoa, có thể ghi đè theo từng lớp, và được cấu hình trước khi mở cửa sổ.</td>
</tr>
</tbody>
</table>
<h3>UC-12 — Mở, gia hạn hoặc đóng cửa sổ đăng ký</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-12 — Mở, gia hạn hoặc đóng cửa sổ đăng ký</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Phòng Đào tạo</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Phòng Đào tạo cấu hình một cửa sổ, hoặc một ranh giới đợt theo lịch tới hạn.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Điều khiển ai được đăng ký và khi nào. Cửa sổ 72 giờ chạy theo ba đợt ưu tiên (BR-06); use case này là cách các đợt đó được định nghĩa, mở ra, gia hạn khi có sự cố và đóng lại.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Người dùng giữ vai Phòng Đào tạo. <br> PRE-2: Danh mục lớp của học kỳ đã tồn tại.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Tại bất kỳ thời điểm nào, hệ thống nói được, với bất kỳ sinh viên nào, rằng đợt của họ có đang mở hay không — không có trạng thái mập mờ. <br> POST-2: Mọi thay đổi với một cửa sổ đều được ghi lại kèm người làm, thời điểm và lý do. <br> POST-3: Việc gia hạn cửa sổ không bao giờ làm vô hiệu ngược một lượt ghi danh đã thực hiện.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>12.0</strong> <br> 1. Phòng Đào tạo định nghĩa cửa sổ của học kỳ: thời điểm bắt đầu, kết thúc, và ba đợt ưu tiên kèm luật xét điều kiện của chúng (BR-06). <br> 2. Hệ thống kiểm rằng các đợt không chồng nhau và chúng phủ mỗi sinh viên đúng một lần. <br> 3. Phòng Đào tạo công bố cửa sổ; hệ thống báo cho sinh viên giờ đợt của mình. <br> 4. Ở mỗi ranh giới đợt, hệ thống mở đăng ký cho nhóm đó. <br> 5. Khi cửa sổ kết thúc, hệ thống đóng đăng ký và báo cáo kết quả — số lượt ghi danh, số lượt bị từ chối theo lý do, các yêu cầu vượt sĩ số còn treo và các danh sách chờ.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>12.1 — Gia hạn khi có sự cố.</strong> Phòng Đào tạo gia hạn cửa sổ; hệ thống báo cho mọi sinh viên bị ảnh hưởng và ghi lại lý do. <br> <strong>12.2 — Mở lại cho một nhóm.</strong> Một nhóm không đăng ký được — vì một lớp bị huỷ, vì một lỗi hệ thống. Phòng Đào tạo mở lại chỉ cho những sinh viên có tên. <br> <strong>12.3 — Đóng khẩn cấp.</strong> Phòng Đào tạo đóng đăng ký ngay lập tức; các giao dịch đang bay được phép hoàn tất, không giao dịch mới nào được bắt đầu.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>12.0.E1 — Các đợt không phủ hết sinh viên.</strong> Ở bước 2, một số sinh viên không rơi vào đợt nào. Hệ thống từ chối công bố và liệt kê họ ra. <br> <strong>12.0.E2 — Các đợt chồng nhau.</strong> Hệ thống từ chối công bố và gọi tên chỗ chồng, vì một chỗ chồng sẽ âm thầm phá huỷ tính công bằng mà BR-06 sinh ra để tạo. <br> <strong>12.0.E3 — Mở cửa sổ khi chưa có danh mục.</strong> Chưa có lớp nào được công bố cho học kỳ. Hệ thống từ chối mở. <br> <strong>12.0.E4 — Xin gia hạn sau khi đã đóng.</strong> Hệ thống coi đó là một lần mở lại (luồng 12.2), đòi phải nêu tên sinh viên, chứ không âm thầm mở lại cho tất cả mọi người.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>2 cửa sổ mỗi năm, mỗi cửa sổ 3 đợt; theo lịch sử thì gia hạn 1–2 lần mỗi năm.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-06</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Sản lượng thấp nhưng hệ quả cao: mọi use case khác trong hệ thống đều đọc cái trạng thái mà use case này ghi. POST-1 chính là thứ làm cho bước 2 của UC-03 trả lời được trong vài mili giây ở mức tải đỉnh.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Lịch năm học ấn định ngày mở cửa sổ; Phòng Đào tạo cấu hình các đợt bên trong khoảng đó.</td>
</tr>
</tbody>
</table>
<h3>UC-13 — Tư vấn sinh viên và quản lý khoá chặn cố vấn</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-13 — Tư vấn sinh viên và quản lý khoá chặn cố vấn</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 3</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Cố vấn học tập</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Một buổi tư vấn diễn ra, hoặc một chính sách đòi phải đặt khoá chặn lên một nhóm sinh viên.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Ghi lại sinh viên đã được tư vấn những gì và, ở nơi chính sách đòi hỏi, đặt một khoá chặn ngăn ghi danh cho tới khi sinh viên đã gặp cố vấn (BR-14). Khoá chặn chính là cơ chế làm cho việc tư vấn diễn ra trước khi đăng ký chứ không phải sau đó.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Cố vấn đã xác thực và được phân công cho sinh viên. <br> PRE-2: Sinh viên đang theo học một chương trình.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Một khoá chặn hoặc tồn tại hoặc không; không có khoá chặn nửa vời. <br> POST-2: Cả việc đặt lẫn việc gỡ khoá chặn đều ghi lại người làm, thời điểm và lý do. <br> POST-3: Sinh viên luôn thấy được rằng có một khoá chặn và cần liên hệ ai, dù họ không xem được nội dung ghi chú tư vấn.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>13.0</strong> <br> 1. Cố vấn mở hồ sơ của sinh viên và xem bản kiểm tra tiến độ của họ (UC-09). <br> 2. Cố vấn ghi lại lời tư vấn đã đưa ra và kế hoạch đã thống nhất nếu có. <br> 3. Cố vấn gỡ khoá chặn cho cửa sổ đăng ký sắp tới. <br> 4. Hệ thống ghi nhận việc gỡ và báo cho sinh viên rằng họ đã có thể đăng ký.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>13.1 — Đặt khoá chặn cho cả một nhóm.</strong> Phòng Đào tạo hoặc một cố vấn đặt khoá chặn lên toàn bộ sinh viên một nhóm — ví dụ mọi sinh viên năm nhất trước cửa sổ đầu tiên của họ. <br> <strong>13.2 — Đặt khoá chặn cá nhân.</strong> Cố vấn đặt khoá chặn lên một sinh viên, chẳng hạn sau khi bị cảnh cáo học vụ. <br> <strong>13.3 — Khoá chặn có hạn.</strong> Một khoá chặn được đặt kèm ngày tự hết hiệu lực, để nó không sống lâu hơn mục đích của mình chỉ vì bị quên. <br> <strong>13.4 — Sinh viên xem trạng thái khoá chặn.</strong> Sinh viên thấy rằng có một khoá chặn, thấy phân loại lý do và thấy cố vấn cần liên hệ — nhưng không thấy nội dung ghi chú tư vấn.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>13.0.E1 — Cố vấn không được phân công.</strong> Cố vấn không phải người được phân công cho sinh viên này. Hệ thống từ chối và mời xin quyền truy cập tạm thời, có ghi lại yêu cầu đó. <br> <strong>13.0.E2 — Khoá chặn được gỡ giữa lúc cửa sổ đang mở.</strong> Sinh viên đang đăng ký dở. Việc gỡ có hiệu lực ngay lập tức; hệ thống báo cho sinh viên để họ tiếp tục mà không phải kiểm lại. <br> <strong>13.0.E3 — Khoá chặn được đặt giữa lúc cửa sổ đang mở.</strong> Hệ thống đặt khoá chặn nhưng <strong>không</strong> đảo ngược các lượt ghi danh đã thực hiện — khoá chặn chỉ hạn chế hành động trong tương lai. <br> <strong>13.0.E4 — Mọi cố vấn đều không có mặt trước một cửa sổ.</strong> Các khoá chặn vẫn còn nguyên và cửa sổ sẽ loại những sinh viên đó ra. Hệ thống báo số lượng cho Phòng Đào tạo 72 giờ trước cửa sổ, để một quyết định chính sách còn kịp được đưa ra.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Thấp — hoãn sang bản 1.2</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>~40 cố vấn × ~55 sinh viên mỗi người, ~2 buổi gặp mỗi học kỳ: ~4.400 bản ghi tư vấn, ~6.000 giao dịch khoá chặn.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-14</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Ngoại lệ 13.0.E3 là một ranh giới có chủ đích: khoá chặn là một cánh cổng chặn việc ghi danh trong tương lai, không phải một lệnh huỷ hồi tố. Làm cho nó hồi tố sẽ trao cho một cố vấn quyền gỡ ghi danh của sinh viên giữa cửa sổ, điều mà không bên liên quan nào yêu cầu và Phòng Đào tạo đã bác thẳng ở buổi 2.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Mỗi sinh viên tại một thời điểm có đúng một cố vấn được phân công.</td>
</tr>
</tbody>
</table>
<h3>UC-14 — Xuất báo cáo ghi danh và sĩ số</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-14 — Xuất báo cáo ghi danh và sĩ số</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Phòng Đào tạo</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Người dùng mở một báo cáo, hoặc một báo cáo theo lịch được sinh ra.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Báo cáo về ghi danh, mức sử dụng sĩ số, hoạt động vượt sĩ số và các mục tiêu trong tài liệu Vision &amp; Scope. Mục đích của nó là làm cho sáu mục tiêu nghiệp vụ đo được liên tục thay vì phải dựng lại vào cuối học kỳ.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Người dùng giữ một vai có quyền truy cập báo cáo. <br> PRE-2: Ít nhất một cửa sổ đăng ký đã kết thúc.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Người dùng chỉ thấy những khoa và bộ môn mà vai của họ cho phép. <br> POST-2: Mọi con số đều nói rõ nó phủ giai đoạn nào và dữ liệu được làm mới lần cuối lúc nào. <br> POST-3: Không báo cáo nào tiết lộ chi tiết tài chính của một sinh viên cụ thể cho một người dùng khối học vụ.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>14.0</strong> <br> 1. Người dùng mở danh sách báo cáo và chọn một báo cáo cùng một giai đoạn. <br> 2. Hệ thống áp phạm vi dữ liệu của người dùng (POST-1). <br> 3. Hệ thống tính và hiển thị báo cáo, kèm các định nghĩa nhìn thấy được. <br> 4. Người dùng lọc theo khoa, bộ môn, chương trình hoặc lớp. <br> 5. Hệ thống tính lại và hiển thị lại.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>14.1 — Đào sâu.</strong> Người dùng bấm vào một con số và thấy các lớp hoặc lượt ghi danh nằm dưới nó. <br> <strong>14.2 — Xuất dữ liệu.</strong> Người dùng xuất màn hình hiện tại ra CSV. <br> <strong>14.3 — Báo cáo cửa sổ theo lịch.</strong> Hệ thống tự sinh bản tổng kết cửa sổ đăng ký khi một cửa sổ đóng và gửi cho Phòng Đào tạo và Phó hiệu trưởng. <br> <strong>14.4 — Báo cáo hoạt động vượt sĩ số.</strong> Một Trưởng bộ môn xem lại các quyết định vượt sĩ số của chính mình, thời gian quyết định so với SLA 48 giờ (BR-12) và tỉ lệ duyệt.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>14.0.E1 — Không có dữ liệu cho giai đoạn đó.</strong> Hệ thống nói rõ rằng không có dữ liệu cho giai đoạn đó, khác hẳn với việc hiện một con số bằng không. <br> <strong>14.0.E2 — Phép tính quá hạn thời gian.</strong> Hệ thống hiện các phần đã tính xong và đánh dấu phần còn lại kèm nút thử lại, thay vì làm hỏng cả trang. <br> <strong>14.0.E3 — Xin báo cáo vượt ranh giới quyền.</strong> Hệ thống chỉ trả về phần được phép và nói rõ rằng kết quả đã bị giới hạn bởi quyền hạn.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Thấp — hoãn sang bản 2.0</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>~15 người dùng thường xuyên, mỗi người ~3 lượt xem/tuần, cộng 2 báo cáo cửa sổ theo lịch mỗi năm.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-03, BR-10, BR-12, BR-13</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Định nghĩa báo cáo phải <strong>giống hệt</strong> các thước đo thành công ở Vision &amp; Scope §1.4. Nếu báo cáo hoạt động vượt sĩ số đo thời gian quyết định khác với thước đo thành công của BO-3, nhà trường không chứng minh được mục tiêu đã đạt. Đặc tả báo cáo nằm ở SRS §4.3.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Việc tổng hợp gần-thời-gian-thực là chấp nhận được; các con số có thể trễ so với dữ liệu sống tới 15 phút.</td>
</tr>
</tbody>
</table>
<hr />
<h3>4. Use Case Diagram</h3>
<p>Xem <code>diagrams/use-case-diagram.drawio</code> (sửa được) và <code>diagrams/use-case-diagram.png</code> (dùng cho SRS Phụ lục B).</p>
<p><strong>Cách đọc sơ đồ</strong></p>
<ul>
<li>Actor chính nằm bên <strong>trái</strong>, actor phụ (hệ thống) nằm bên <strong>phải</strong>.</li>
<li>Hình chữ nhật là <strong>ranh giới hệ thống</strong>. Hệ thống tài chính, SSO, hệ thống thời khoá biểu và LMS nằm ngoài nó một cách có chủ đích (Vision &amp; Scope §2.4).</li>
<li>Mũi tên <code>«include»</code> đi <strong>từ</strong> use case cơ sở <strong>tới</strong> use case luôn luôn được thực thi.</li>
<li>Mũi tên <code>«extend»</code> đi <strong>từ</strong> use case tuỳ chọn <strong>tới</strong> use case cơ sở mà nó mở rộng.</li>
</ul>
<p><strong>Các quan hệ được thể hiện</strong></p>
<table>
<thead>
<tr>
<th>Quan hệ</th>
<th>Từ</th>
<th>Tới</th>
<th>Vì sao</th>
</tr>
</thead>
<tbody>
<tr>
<td>«include»</td>
<td>UC-03 Đăng ký vào một lớp</td>
<td>UC-04 Kiểm môn tiên quyết</td>
<td>Mọi lượt ghi danh đều đánh giá môn tiên quyết, luôn luôn</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-03 Đăng ký vào một lớp</td>
<td>UC-05 Đánh giá điều kiện tài chính</td>
<td>Mọi lượt ghi danh đều đánh giá tài chính, luôn luôn</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-02 Dựng thời khoá biểu dự kiến</td>
<td>UC-04 Kiểm môn tiên quyết</td>
<td>Việc lập kế hoạch luôn cảnh báo về môn tiên quyết</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-08 Rút hoặc đổi lớp</td>
<td>UC-07 Thăng suất danh sách chờ</td>
<td>Một chỗ được nhả ra luôn kích hoạt việc thăng suất</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-11 Huỷ một lớp</td>
<td>UC-08 Rút hoặc đổi lớp</td>
<td>Việc huỷ lớp luôn nhả mọi lượt ghi danh</td>
</tr>
<tr>
<td>«extend»</td>
<td>UC-06 Xin vượt sĩ số</td>
<td>UC-03 Đăng ký vào một lớp</td>
<td>Chỉ khi lớp đã đầy hoặc chưa đạt môn tiên quyết</td>
</tr>
<tr>
<td>«extend»</td>
<td>UC-07 Vào danh sách chờ</td>
<td>UC-03 Đăng ký vào một lớp</td>
<td>Chỉ khi lớp đã đầy</td>
</tr>
<tr>
<td>«extend»</td>
<td>UC-09 Kiểm tra tiến độ tốt nghiệp</td>
<td>UC-13 Tư vấn sinh viên</td>
<td>Chỉ khi một cố vấn xem lại tiến độ trong buổi tư vấn</td>
</tr>
</tbody>
</table></div>`,
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
    `<div class="ml-en"><h2>Business Rules</h2>
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
before baselining and is repeated before submission.</p></div>
<div class="ml-vi"><h2>Business Rules — Luật nghiệp vụ</h2>
<h2>cho Hệ thống Học vụ và Đăng ký môn (CARS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên nhóm trưởng&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Northern Regional University (NRU)
17 tháng 9 năm 2026</p>
<hr />
<h3>Lịch sử sửa đổi</h3>
<table>
<thead>
<tr>
<th>Người</th>
<th>Ngày</th>
<th>Lý do sửa</th>
<th>Phiên bản</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Thu thập luật từ các buổi khai thác 1–4 và từ Quy chế học vụ</td>
<td>0.9</td>
</tr>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Phân loại, khử trùng lặp và tham chiếu chéo sang use case</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Mục đích và phạm vi</h3>
<p>Tài liệu này là catalog các luật nghiệp vụ của NRU chi phối việc đăng ký môn và tiến độ
học tập. Một <strong>business rule</strong> là một chính sách, quy định, chuẩn mực, phép tính hoặc
định nghĩa tồn tại <strong>độc lập với mọi phần mềm</strong> — trong trường hợp của NRU thì phần lớn
chúng nằm trong Quy chế học vụ, và đó là lý do cột <em>Nguồn</em> ở đây quan trọng hơn so với
một dự án thương mại. Mỗi luật được ghi <strong>một lần duy nhất</strong>; use case và yêu cầu chức
năng chỉ tham chiếu tới nó <strong>bằng mã</strong>.</p>
<p>Bảng phân loại năm kiểu lấy từ Wiegers &amp; Beatty, chương 9:</p>
<table>
<thead>
<tr>
<th>Kiểu</th>
<th>Nghĩa</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Fact</strong></td>
<td>Một phát biểu luôn đúng về nghiệp vụ; một bất biến của lĩnh vực</td>
</tr>
<tr>
<td><strong>Constraint</strong></td>
<td>Điều phải hoặc không được xảy ra; nó hạn chế một hành động</td>
</tr>
<tr>
<td><strong>Action enabler</strong></td>
<td>Một điều kiện mà khi đúng thì kích hoạt một hành động</td>
</tr>
<tr>
<td><strong>Inference</strong></td>
<td>Tri thức mới suy ra từ các sự kiện đã có</td>
</tr>
<tr>
<td><strong>Computation</strong></td>
<td>Một công thức sinh ra một giá trị</td>
</tr>
</tbody>
</table>
<p><strong>Tĩnh hay Động</strong> ghi lại việc <em>bản thân luật đó</em> có được dự kiến sẽ thay đổi hay không.
Luật động phải <strong>cấu hình được</strong>, không được biên dịch cứng vào mã. Trong một trường đại
học, sự phân biệt này quan trọng khác thường: quy chế được hội đồng sửa theo chu kỳ hằng
năm, và một luật muốn đổi phải ra bản phần mềm mới thì trong vòng một năm sẽ lạc hậu.</p>
<hr />
<h3>2. Danh mục luật</h3>
<table>
<thead>
<tr>
<th>Mã</th>
<th>Định nghĩa luật</th>
<th>Kiểu</th>
<th>Tĩnh/Động</th>
<th>Nguồn</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>BR-01</strong></td>
<td>Tại một thời điểm, một sinh viên chỉ được giữ tối đa một lượt ghi danh trong cùng một lớp học phần.</td>
<td>Fact</td>
<td>Tĩnh</td>
<td>Phòng Đào tạo, buổi 2</td>
</tr>
<tr>
<td><strong>BR-02</strong></td>
<td>Sinh viên chỉ được ghi danh một môn nếu đã hoàn thành mọi môn tiên quyết với ít nhất mức điểm tối thiểu quy định cho môn tiên quyết đó.</td>
<td>Constraint</td>
<td>Động</td>
<td>Quy chế học vụ §7.2</td>
</tr>
<tr>
<td><strong>BR-03</strong></td>
<td>Sức chứa còn lại của một lớp = sĩ số công bố − số ghi danh đã xác nhận − số vượt sĩ số đã duyệt mà chưa ghi danh.</td>
<td>Computation</td>
<td>Tĩnh</td>
<td>Phòng Đào tạo, buổi 2</td>
</tr>
<tr>
<td><strong>BR-04</strong></td>
<td>Sinh viên không được ghi danh vượt quá trần tín chỉ của năm học của mình trong một học kỳ. Trần mặc định là 24 tín chỉ.</td>
<td>Constraint</td>
<td>Động</td>
<td>Quy chế học vụ §5.1</td>
</tr>
<tr>
<td><strong>BR-05</strong></td>
<td>Sinh viên có công nợ vượt ngưỡng đăng ký, hoặc đang mang một khoá chặn tài chính tường minh, không được ghi danh cho tới khi gỡ được khoá chặn đó.</td>
<td>Action enabler</td>
<td>Động</td>
<td>Cán bộ Tài chính, buổi 3; Quy chế học vụ §11.4</td>
</tr>
<tr>
<td><strong>BR-06</strong></td>
<td>Cửa sổ đăng ký mở theo ba đợt ưu tiên, thứ tự: sinh viên năm cuối, rồi sinh viên năm hai và năm ba, rồi sinh viên năm nhất.</td>
<td>Fact</td>
<td>Động</td>
<td>Phòng Đào tạo, buổi 1</td>
</tr>
<tr>
<td><strong>BR-07</strong></td>
<td>Sinh viên không được giữ hai lượt ghi danh có giờ học trùng nhau dù chỉ một phần.</td>
<td>Constraint</td>
<td>Tĩnh</td>
<td>Phòng Đào tạo, buổi 2</td>
</tr>
<tr>
<td><strong>BR-08</strong></td>
<td>Khi một chỗ trong lớp có danh sách chờ được nhả ra, nó được mời cho sinh viên đứng cao nhất trong danh sách chờ đó mà vẫn thoả mọi luật ghi danh khác.</td>
<td>Action enabler</td>
<td>Tĩnh</td>
<td>Phòng Đào tạo, buổi 2</td>
</tr>
<tr>
<td><strong>BR-09</strong></td>
<td>Lời mời từ danh sách chờ hết hạn sau 24 giờ kể từ lúc phát ra, sau đó chỗ được mời cho sinh viên đủ điều kiện kế tiếp.</td>
<td>Constraint</td>
<td>Động</td>
<td>Phòng Đào tạo, buổi 2</td>
</tr>
<tr>
<td><strong>BR-10</strong></td>
<td>Một lớp bị coi là "không đủ sĩ số" khi số ghi danh đã xác nhận thấp hơn sĩ số tối thiểu duy trì được, tính tại mốc kiểm 7 ngày trước khi mở đợt thêm/bớt môn.</td>
<td>Inference</td>
<td>Động</td>
<td>Các Trưởng bộ môn, buổi 3</td>
</tr>
<tr>
<td><strong>BR-11</strong></td>
<td>Chỉ Trưởng bộ môn sở hữu lớp đó, hoặc người được họ uỷ quyền có tên, mới được duyệt vượt sĩ số cho lớp đó.</td>
<td>Constraint</td>
<td>Tĩnh</td>
<td>Quy chế học vụ §7.6</td>
</tr>
<tr>
<td><strong>BR-12</strong></td>
<td>Một yêu cầu vượt sĩ số phải có quyết định được ghi nhận trong vòng 48 giờ kể từ lúc gửi.</td>
<td>Constraint</td>
<td>Động</td>
<td>Chính sách của trường (đang chờ ký — phụ thuộc D2)</td>
</tr>
<tr>
<td><strong>BR-13</strong></td>
<td>Tỉ lệ hoàn thành chương trình = số tín chỉ đã tích luỹ cho ngành ÷ tổng tín chỉ ngành yêu cầu × 100.</td>
<td>Computation</td>
<td>Tĩnh</td>
<td>Quy chế học vụ §9.1</td>
</tr>
<tr>
<td><strong>BR-14</strong></td>
<td>Sinh viên đang mang khoá chặn cố vấn còn hiệu lực không được ghi danh vào bất kỳ lớp nào cho tới khi một cố vấn có thẩm quyền gỡ khoá.</td>
<td>Constraint</td>
<td>Động</td>
<td>Quy chế học vụ §6.3</td>
</tr>
<tr>
<td><strong>BR-15</strong></td>
<td>Sĩ số tối thiểu duy trì được của một lớp là 15 sinh viên, cấu hình được theo từng khoa và ghi đè được theo từng lớp.</td>
<td>Fact</td>
<td>Động</td>
<td>Phó hiệu trưởng, buổi 1</td>
</tr>
<tr>
<td><strong>BR-16</strong></td>
<td>Sinh viên chỉ được rút một lớp mà không để lại dấu trên bảng điểm trong thời gian thêm/bớt môn. Sau thời hạn đó, việc rút được ghi nhận là rút học phần.</td>
<td>Constraint</td>
<td>Động</td>
<td>Quy chế học vụ §8.2</td>
</tr>
<tr>
<td><strong>BR-17</strong></td>
<td>Học phí phải nộp = Σ (số tín chỉ của lớp × đơn giá mỗi tín chỉ theo ngành của sinh viên) + các khoản phí bắt buộc − học bổng được áp dụng.</td>
<td>Computation</td>
<td>Động</td>
<td>Cán bộ Tài chính, buổi 3</td>
</tr>
<tr>
<td><strong>BR-18</strong></td>
<td>Sinh viên bị coi là "có nguy cơ tốt nghiệp trễ" khi số tín chỉ còn phải học vượt quá lượng có thể học hết trong số học kỳ còn lại ở mức trần tín chỉ tối đa.</td>
<td>Inference</td>
<td>Động</td>
<td>Cố vấn học tập, buổi 4</td>
</tr>
<tr>
<td><strong>BR-19</strong></td>
<td>Khi một lớp bị huỷ, mọi sinh viên đã ghi danh và đang trong danh sách chờ đều được thông báo, và mọi chỗ đều được nhả ra.</td>
<td>Action enabler</td>
<td>Tĩnh</td>
<td>Phòng Đào tạo, buổi 2</td>
</tr>
<tr>
<td><strong>BR-20</strong></td>
<td>Các môn được khai là môn song hành phải được ghi danh trong cùng một học kỳ; sinh viên ghi danh cả hai hoặc không môn nào.</td>
<td>Constraint</td>
<td>Tĩnh</td>
<td>Quy chế học vụ §7.4</td>
</tr>
</tbody>
</table>
<h3>2.1 Độ phủ theo kiểu</h3>
<table>
<thead>
<tr>
<th>Kiểu</th>
<th>Các luật</th>
<th>Số lượng</th>
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
<td><strong>Tổng</strong></td>
<td><strong>20</strong></td>
</tr>
</tbody>
</table>
<h3>2.2 Tĩnh và động — nó có nghĩa gì với việc xây dựng</h3>
<p>Mười hai trong hai mươi luật là <strong>động</strong>. Ở một trường đại học, đây không phải một ghi
chú kỹ thuật vặt: Quy chế học vụ được hội đồng sửa hằng năm, và vài giá trị trong số này
đúng là những thứ hội đồng hay thay đổi.</p>
<table>
<thead>
<tr>
<th>Luật</th>
<th>Giá trị cấu hình được</th>
<th>Ai được đổi</th>
</tr>
</thead>
<tbody>
<tr>
<td>BR-02</td>
<td>Mức điểm tối thiểu của từng môn tiên quyết; và chính các luật đó</td>
<td>Hội đồng chương trình của khoa, thông qua Phòng Đào tạo</td>
</tr>
<tr>
<td>BR-04</td>
<td>Trần tín chỉ, theo năm học và theo ngành</td>
<td>Phòng Đào tạo</td>
</tr>
<tr>
<td>BR-05</td>
<td>Ngưỡng công nợ để đăng ký; các luật ân hạn</td>
<td>Cán bộ Tài chính</td>
</tr>
<tr>
<td>BR-06</td>
<td>Định nghĩa các đợt và thứ tự của chúng</td>
<td>Phòng Đào tạo</td>
</tr>
<tr>
<td>BR-09</td>
<td>Thời hạn giữ lời mời danh sách chờ (24 giờ)</td>
<td>Phòng Đào tạo</td>
</tr>
<tr>
<td>BR-10</td>
<td>Mốc kiểm 7 ngày</td>
<td>Phòng Đào tạo</td>
</tr>
<tr>
<td>BR-12</td>
<td>SLA quyết định vượt sĩ số (48 giờ)</td>
<td>Phòng Đào tạo, sau khi D2 được ký</td>
</tr>
<tr>
<td>BR-14</td>
<td>Nhóm sinh viên nào bị khoá chặn tự động</td>
<td>Phòng Đào tạo</td>
</tr>
<tr>
<td>BR-15</td>
<td>Sĩ số tối thiểu duy trì được, theo khoa và theo lớp</td>
<td>Trưởng bộ môn</td>
</tr>
<tr>
<td>BR-16</td>
<td>Ngày mở/đóng đợt thêm-bớt môn, theo từng học kỳ</td>
<td>Phòng Đào tạo</td>
</tr>
<tr>
<td>BR-17</td>
<td>Đơn giá tín chỉ, các khoản phí</td>
<td>Cán bộ Tài chính</td>
</tr>
<tr>
<td>BR-18</td>
<td>Giả định về số học kỳ còn lại</td>
<td>Cố vấn học tập</td>
</tr>
</tbody>
</table>
<div class="callout">
<p><strong>Vấn đề năm quy chế (catalog year).</strong> BR-02, BR-04 và BR-13 vừa động <em>vừa</em> phải được
<strong>phiên bản hoá theo năm quy chế</strong>: sinh viên được đánh giá theo quy chế có hiệu lực
lúc họ nhập học (UC-09 ngoại lệ 9.0.E2). Một mô hình cấu hình chỉ đơn giản ghi đè giá
trị hiện tại sẽ âm thầm đánh giá lại mọi sinh viên đang học theo luật mới — vừa sai,
vừa không được phép theo Quy chế học vụ §9.1.</p>
</div>
<hr />
<h3>3. Những luật CỐ Ý không cưỡng chế bằng phần mềm</h3>
<table>
<thead>
<tr>
<th>Luật</th>
<th>Vì sao CARS không cưỡng chế</th>
</tr>
</thead>
<tbody>
<tr>
<td>Sinh viên phải gặp cố vấn ít nhất một lần mỗi học kỳ</td>
<td>CARS cưỡng chế <em>khoá chặn</em> (BR-14); còn cuộc gặp có diễn ra hay không là phán đoán của cố vấn</td>
</tr>
<tr>
<td>Giảng viên phải nộp điểm trong vòng 14 ngày sau kỳ đánh giá cuối</td>
<td>Phòng Đào tạo cưỡng chế bằng biện pháp hành chính; CARS báo cáo tình trạng trễ nhưng không chặn</td>
</tr>
<tr>
<td>Sinh viên đang bị cảnh cáo học vụ phải giảm khối lượng tín chỉ</td>
<td>Áp dụng bằng cách đặt một trần tín chỉ riêng cho cá nhân theo BR-04, không phải bằng một luật riêng</td>
</tr>
<tr>
<td>Tiêu chí xét học bổng</td>
<td>Thuộc hoàn toàn về hệ thống tài chính (EX-2); CARS chỉ đọc kết quả</td>
</tr>
<tr>
<td>Không được vượt sức chứa phòng học</td>
<td>Thuộc về hệ thống thời khoá biểu (EX-3); CARS cảnh báo ở UC-06 ngoại lệ 6.0.E3 nhưng không cưỡng chế</td>
</tr>
</tbody>
</table>
<hr />
<h3>4. Các luật được phát hiện như thế nào</h3>
<table>
<thead>
<tr>
<th>Buổi</th>
<th>Ngày</th>
<th>Vai bên liên quan được đóng</th>
<th>Kỹ thuật</th>
<th>Luật thu được</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>08-09-2026</td>
<td>Phó hiệu trưởng (người tài trợ) + Phòng Đào tạo</td>
<td>Phỏng vấn có cấu trúc, 9 câu hỏi chuẩn bị sẵn</td>
<td>BR-06, BR-15</td>
</tr>
<tr>
<td>2</td>
<td>09-09-2026</td>
<td>Phòng Đào tạo + Nhân viên học vụ</td>
<td>Workshop có điều phối, đi lại hiện trạng của một lượt ghi danh</td>
<td>BR-01, BR-03, BR-07, BR-08, BR-09, BR-19</td>
</tr>
<tr>
<td>3</td>
<td>11-09-2026</td>
<td>Cán bộ Tài chính + các Trưởng bộ môn</td>
<td>Phỏng vấn có cấu trúc</td>
<td>BR-05, BR-10, BR-12, BR-17</td>
</tr>
<tr>
<td>4</td>
<td>12-09-2026</td>
<td>Cố vấn học tập</td>
<td>Hỏi tiếp về các vấn đề kiểm tra tiến độ tốt nghiệp</td>
<td>BR-18</td>
</tr>
<tr>
<td>—</td>
<td>10-09-2026</td>
<td>—</td>
<td><strong>Phân tích tài liệu</strong> Quy chế học vụ</td>
<td>BR-02, BR-04, BR-11, BR-13, BR-14, BR-16, BR-20</td>
</tr>
</tbody>
</table>
<p><strong>Ghi chú về kỹ thuật.</strong> Bảy trong hai mươi luật đến từ <strong>phân tích tài liệu</strong>, không phải
từ phỏng vấn — chúng đã được viết sẵn trong Quy chế học vụ và không ai nhắc tới, vì ai
cũng cho rằng chúng hiển nhiên. Đây là điều ngược hẳn với tình huống của TP2, nơi các luật
chỉ tồn tại dưới dạng thói quen của nhân viên. Bài học rút ra có tính tổng quát: trong một
tổ chức chịu quy định, hãy đọc quy định <em>trước</em> buổi phỏng vấn đầu tiên, nếu không bạn sẽ
ngồi cả buổi để nghe kể những thứ mình có thể tự đọc, mà vẫn bỏ sót đúng những luật không
ai nghĩ tới việc nói thành lời.</p>
<p><strong>Những câu hỏi còn treo, mang sang danh sách TBD của SRS</strong></p>
<table>
<thead>
<tr>
<th>#</th>
<th>Câu hỏi</th>
<th>Người chịu trách nhiệm</th>
<th>Hạn</th>
</tr>
</thead>
<tbody>
<tr>
<td>TBD-1</td>
<td>Trần tín chỉ ở BR-04 có tính các môn học lại đang trong tiến trình không, hay chỉ tính các lượt ghi danh mới?</td>
<td>Phòng Đào tạo</td>
<td>Tuần 6</td>
</tr>
<tr>
<td>TBD-2</td>
<td>SLA 48 giờ ở BR-12 là giờ làm việc hay giờ theo lịch? Các Trưởng bộ môn và Phòng Đào tạo trả lời khác nhau.</td>
<td>Phòng Đào tạo</td>
<td>Tuần 6</td>
</tr>
<tr>
<td>TBD-3</td>
<td>Khi một cặp môn song hành (BR-20) bị phá vỡ do một lớp bị huỷ, lượt ghi danh còn lại bị tự động rút hay chuyển cho cố vấn xử lý?</td>
<td>Phòng Đào tạo</td>
<td>Tuần 7</td>
</tr>
<tr>
<td>TBD-4</td>
<td>Ngưỡng tài chính ở BR-05 áp theo từng học kỳ hay cộng dồn?</td>
<td>Cán bộ Tài chính</td>
<td>Tuần 7</td>
</tr>
</tbody>
</table>
<hr />
<h3>5. Truy vết: luật → use case → yêu cầu</h3>
<table>
<thead>
<tr>
<th>Luật</th>
<th>Được cưỡng chế trong use case</th>
<th>Yêu cầu chức năng trong SRS</th>
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
<p><strong>Mọi luật trong catalog này đều được ít nhất một use case cưỡng chế.</strong> Phép kiểm đó đã
chạy trước khi chốt bản cơ sở, và được chạy lại trước khi nộp.</p></div>`,
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
    `<div class="ml-en"><h2>Software Requirements Specification</h2>
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
Prereq-5; the advising-reduction half of BO-6 by QA-9.</p></div>
<div class="ml-vi"><h2>Đặc tả Yêu cầu Phần mềm (SRS)</h2>
<h2>cho Hệ thống Học vụ và Đăng ký môn (CARS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên nhóm trưởng&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Northern Regional University (NRU)
17 tháng 9 năm 2026</p>
<hr />
<h3>Lịch sử sửa đổi</h3>
<table>
<thead>
<tr>
<th>Người</th>
<th>Ngày</th>
<th>Lý do sửa</th>
<th>Phiên bản</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Bản nháp đầu — mục 1–2 lấy từ Vision &amp; Scope, mục 3 lấy từ use case</td>
<td>0.9</td>
</tr>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Đã định lượng các thuộc tính chất lượng, hoàn tất mọi mục, chốt bản cơ sở</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h2>Mục lục</h2>
<ol>
<li>Giới thiệu · 2. Mô tả tổng thể · 3. Tính năng hệ thống · 4. Yêu cầu dữ liệu ·</li>
<li>Yêu cầu giao tiếp ngoài · 6. Thuộc tính chất lượng ·</li>
<li>Yêu cầu quốc tế hoá và bản địa hoá · 8. Yêu cầu khác ·
Phụ lục A: Bảng thuật ngữ · Phụ lục B: Mô hình phân tích · Phụ lục C: Danh sách TBD ·
Phụ lục D: Ma trận truy vết yêu cầu</li>
</ol>
<hr />
<h3>1. Giới thiệu</h3>
<h3>1.1 Mục đích</h3>
<p>Tài liệu này đặc tả các yêu cầu phần mềm cho các bản phát hành <strong>1.0 tới 2.0</strong> của <strong>Hệ
thống Học vụ và Đăng ký môn (CARS)</strong>, hệ thống thay thế cho hệ thông tin sinh viên mười
bốn năm tuổi của Northern Regional University trong việc đăng ký môn và quản trị học vụ.</p>
<table>
<thead>
<tr>
<th>Người đọc</th>
<th>Dùng tài liệu này để</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nhóm phát triển</td>
<td>Hiểu phải xây cái gì và "xong" nghĩa là gì với từng năng lực</td>
</tr>
<tr>
<td>Nhóm kiểm thử</td>
<td>Suy ra các ca kiểm thử; mọi yêu cầu chức năng đều được viết sao cho kiểm được đạt/không đạt</td>
</tr>
<tr>
<td>Quản lý dự án</td>
<td>Khoanh phạm vi các bản phát hành và ước lượng công sức</td>
</tr>
<tr>
<td>Phòng Đào tạo và phòng học vụ</td>
<td>Xác nhận rằng các luật đã mã hoá khớp với Quy chế học vụ</td>
</tr>
</tbody>
</table>
<h3>1.2 Quy ước của tài liệu</h3>
<p><strong>Mã yêu cầu</strong> có dạng <code>&amp;lt;Tính năng&amp;gt;-&amp;lt;n&amp;gt;</code> — ví dụ <code>Enroll-4</code>, <code>Prereq-1</code>, <code>Override-3</code>.
Mã là vĩnh viễn; số của một yêu cầu đã bị xoá không bao giờ được dùng lại. Yêu cầu thuộc
tính chất lượng dùng mã <code>QA-&amp;lt;n&amp;gt;</code>.</p>
<p><strong>Từ "shall" (phải)</strong> diễn đạt một nghĩa vụ. Các câu dùng "should", "may" hay "will" là
văn giải thích, không phải yêu cầu.</p>
<p><strong>Độ ưu tiên</strong> — Cao, Trung bình hoặc Thấp — lấy từ bảng tính xếp ưu tiên yêu cầu (R6),
và bảng tính đó là bản gốc.</p>
<p><strong>Tham chiếu.</strong> Business rule chỉ xuất hiện dưới dạng <code>BR-n</code>; nội dung luật nằm trong
tài liệu Business Rules. Use case xuất hiện dưới dạng <code>UC-nn</code>. Phần tử dữ liệu được định
nghĩa trong Data Dictionary.</p>
<p><strong>Thuộc tính chất lượng</strong> được viết bằng Planguage (Gilb) với SCALE, METER, MUST và PLAN.</p>
<h3>1.3 Phạm vi dự án</h3>
<p>CARS là bản ghi có thẩm quyền về việc theo học của một sinh viên từ lúc nhập học tới lúc
tốt nghiệp. Nó công bố danh mục lớp, cho sinh viên lập kế hoạch và đăng ký, quyết định
từng lượt ghi danh theo luật chương trình đào tạo, sĩ số, thời khoá biểu và tài chính
trong một giao dịch duy nhất, vận hành việc vượt sĩ số và danh sách chờ, và cho mỗi sinh
viên thấy tiến độ tốt nghiệp cùng số dư tài khoản của mình.</p>
<p>CARS <strong>không</strong> thay thế hệ thống tài chính, hệ quản lý học tập, hệ thống thời khoá biểu
hay SSO của trường. Phát biểu có thẩm quyền về phạm vi, nội dung từng bản phát hành và
các loại trừ nằm ở <strong>tài liệu Vision and Scope</strong> §2.1–2.4.</p>
<p>Các mục tiêu nghiệp vụ mà CARS sinh ra để đạt được là BO-1 … BO-6 ở Vision and Scope
§1.3. Mọi tính năng hệ thống ở mục 3 đều truy vết được về ít nhất một trong số đó.</p>
<h3>1.4 Tài liệu tham chiếu</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Tài liệu</th>
<th>Phiên bản</th>
<th>Vị trí</th>
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
<td>Quy chế học vụ NRU</td>
<td>Bản 2026</td>
<td>Phòng Đào tạo</td>
</tr>
<tr>
<td>R9</td>
<td>Wiegers, K. &amp; Beatty, J., <em>Software Requirements</em>, tái bản lần 3</td>
<td>2013</td>
<td>Microsoft Press</td>
</tr>
<tr>
<td>R10</td>
<td>Ghi chép các buổi khai thác yêu cầu 1–4</td>
<td>—</td>
<td>Thư mục chung của nhóm, <code>elicitation/</code></td>
</tr>
</tbody>
</table>
<p><strong>Ghi chú về phương pháp khai thác yêu cầu.</strong> Đầu vào từ bên liên quan đến từ bốn buổi
mô phỏng bên liên quan (R10) cộng với <strong>phân tích tài liệu Quy chế học vụ</strong> (R8), vốn cho
ra bảy trong hai mươi business rule. Chỗ nào không có câu trả lời thì mục đó được ghi vào
danh sách TBD (Phụ lục C) chứ không bịa ra.</p>
<hr />
<h3>2. Mô tả tổng thể</h3>
<h3>2.1 Góc nhìn sản phẩm</h3>
<p>CARS là một hệ <strong>thay thế</strong> cho một hệ thống đang tồn tại, nên nó là một dự án nâng cấp
và thay thế theo nghĩa của Wiegers chương 21: các yêu cầu bị ràng buộc bởi một quy trình
đang có, dữ liệu đang có và quy định đang có, và việc phân tích khoảng cách quan trọng
hơn một danh sách tính năng dựng từ đầu.</p>
<p>Hệ thống cũ chỉ bị gỡ bỏ sau một cửa sổ đăng ký trọn vẹn và thành công (R1 §3.3). Context
diagram nằm ở Phụ lục B.</p>
<p><strong>Các hệ thống mà CARS trao đổi dữ liệu</strong></p>
<table>
<thead>
<tr>
<th>Hệ thống ngoài</th>
<th>Chiều</th>
<th>Cái gì đi qua ranh giới</th>
</tr>
</thead>
<tbody>
<tr>
<td>SSO của trường</td>
<td>Vào</td>
<td>Khẳng định xác thực và các khai báo vai trò</td>
</tr>
<tr>
<td>Hệ thống tài chính / học phí</td>
<td>Vào</td>
<td>Số dư còn nợ và trạng thái khoá chặn đăng ký</td>
</tr>
<tr>
<td>Hệ thống thời khoá biểu</td>
<td>Vào</td>
<td>Lịch học của lớp, phòng, giảng viên</td>
</tr>
<tr>
<td>Hệ quản lý học tập</td>
<td>Ra / vào</td>
<td>Lượt ghi danh đã xác nhận đi ra; điểm cuối kỳ đi vào</td>
</tr>
<tr>
<td>Dịch vụ thông báo</td>
<td>Ra</td>
<td>Email và SMS tới sinh viên và nhân viên</td>
</tr>
</tbody>
</table>
<h3>2.2 Các lớp người dùng và đặc điểm</h3>
<table>
<thead>
<tr>
<th>Lớp người dùng</th>
<th>Quy mô</th>
<th>Tần suất dùng</th>
<th>Trình độ kỹ thuật</th>
<th>Được ưu tiên</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Sinh viên</strong></td>
<td>12.000</td>
<td>Dồn dập trong cửa sổ 72 giờ; thi thoảng ở thời gian khác</td>
<td>Khác nhau; giả định là không có</td>
<td><strong>Có</strong></td>
</tr>
<tr>
<td><strong>Nhân viên học vụ</strong></td>
<td>14</td>
<td>Liên tục trong đợt đăng ký</td>
<td>Trung bình</td>
<td><strong>Có</strong></td>
</tr>
<tr>
<td><strong>Trưởng bộ môn</strong></td>
<td>6</td>
<td>Hằng ngày trong đợt đăng ký</td>
<td>Thấp — họ là giảng viên, không phải cán bộ hành chính</td>
<td>Không</td>
</tr>
<tr>
<td><strong>Cố vấn học tập</strong></td>
<td>~40</td>
<td>Hằng tuần, cao điểm trước các cửa sổ</td>
<td>Trung bình</td>
<td>Không</td>
</tr>
<tr>
<td><strong>Phòng Đào tạo</strong></td>
<td>2</td>
<td>Hằng ngày</td>
<td>Cao</td>
<td>Không</td>
</tr>
<tr>
<td><strong>Cán bộ Tài chính</strong></td>
<td>3</td>
<td>Hằng tuần, cao điểm lúc đăng ký</td>
<td>Trung bình</td>
<td>Không</td>
</tr>
<tr>
<td><strong>Quản trị hệ thống</strong></td>
<td>2</td>
<td>Thi thoảng</td>
<td>Cao</td>
<td>Không</td>
</tr>
</tbody>
</table>
<p><strong>Các lớp người dùng được ưu tiên.</strong> Sinh viên và Nhân viên học vụ. Chỗ nào nhu cầu của
họ xung đột với một lớp khác thì nhu cầu của họ thắng. Đây là quyết định của Phó hiệu
trưởng: dự án tồn tại vì sinh viên không đăng ký được và nhân viên không theo kịp.</p>
<p><strong>Hệ quả với thiết kế.</strong> Lớp Sinh viên vừa được ưu tiên <em>vừa</em> đông nhất, ít được đào tạo
nhất và dồn cục về thời gian nhất. Đó là lý do QA-1 tới QA-4 tồn tại, và là lý do UC-02
(lập kế hoạch trước cửa sổ) nằm trong bản 1.0 thay vì bị hoãn.</p>
<h3>2.3 Môi trường vận hành</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Yêu cầu</th>
</tr>
</thead>
<tbody>
<tr>
<td>OE-1</td>
<td>CARS phải chạy trong trung tâm dữ liệu của trường, cấp phát theo mức đỉnh của đợt đăng ký chứ không theo mức trung bình.</td>
</tr>
<tr>
<td>OE-2</td>
<td>Các giao diện hướng tới sinh viên phải chạy trên các phiên bản hiện hành của Chrome, Edge, Safari và Firefox, ở bề rộng khung nhìn tối thiểu 360 px.</td>
</tr>
<tr>
<td>OE-3</td>
<td>Các giao diện cho nhân viên phải chạy trên cùng những trình duyệt đó ở bề rộng khung nhìn tối thiểu 1280 px.</td>
</tr>
<tr>
<td>OE-4</td>
<td>CARS phải vẫn dùng được trên kết nối di động 3G cho các đường danh mục, lập kế hoạch và ghi danh.</td>
</tr>
<tr>
<td>OE-5</td>
<td>CARS phải trình bày mọi thời điểm theo múi Asia/Ho_Chi_Minh và lưu chúng kèm độ lệch UTC tường minh.</td>
</tr>
</tbody>
</table>
<h3>2.4 Ràng buộc thiết kế và hiện thực</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Ràng buộc</th>
<th>Nguồn gốc</th>
</tr>
</thead>
<tbody>
<tr>
<td>CO-1</td>
<td>CARS phải xác thực mọi người dùng qua SSO của trường và không được duy trì kho mật khẩu sinh viên.</td>
<td>EX-8, chính sách an ninh của tổ chức</td>
</tr>
<tr>
<td>CO-2</td>
<td>CARS không được dựng hay sửa thời khoá biểu; nó tiêu thụ thời khoá biểu đã công bố.</td>
<td>EX-3</td>
</tr>
<tr>
<td>CO-3</td>
<td>CARS không được xử lý thanh toán, hoàn tiền hay quyết định học bổng.</td>
<td>EX-2</td>
</tr>
<tr>
<td>CO-4</td>
<td>CARS không được lưu chi tiết phương tiện thanh toán ở bất kỳ thời điểm nào.</td>
<td>Chính sách tài chính</td>
</tr>
<tr>
<td>CO-5</td>
<td>Mọi luật được đánh dấu Động ở R3 §2.2 phải đổi được bằng cấu hình, do đúng vai đã nêu tên, mà không cần ra bản phần mềm mới.</td>
<td>Business Rules §2.2</td>
</tr>
<tr>
<td>CO-6</td>
<td>Các luật phiên bản hoá theo năm quy chế — BR-02, BR-04, BR-13 — phải giữ lại mọi phiên bản trước, và không bao giờ được đánh giá lại một sinh viên đang học theo một phiên bản sau này.</td>
<td>Quy chế học vụ §9.1</td>
</tr>
<tr>
<td>CO-7</td>
<td>Giao tiếp tài chính phải được cô lập sau một lớp adapter, sao cho một API đồng bộ và một lượt trao đổi tệp theo đêm thay thế được cho nhau mà không đụng tới logic ghi danh.</td>
<td>RI-1</td>
</tr>
</tbody>
</table>
<h3>2.5 Giả định và phụ thuộc</h3>
<p><strong>Giả định</strong> (lấy từ R1 §1.7)</p>
<ul>
<li>A1: Mô hình đăng ký tiếp tục là một cửa sổ 72 giờ chia ba đợt ưu tiên.</li>
<li>A2: Ít nhất 90% số ngành diễn đạt được thành luật chương trình máy đánh giá được.</li>
<li>A3: Dữ liệu bảng điểm đầy đủ với sinh viên nhập học từ 2019 trở đi.</li>
<li>A4: Việc xác thực sinh viên tiếp tục do SSO của trường cung cấp.</li>
<li>A5: Hệ thống thời khoá biểu vẫn là nơi có thẩm quyền về việc lớp học khi nào và ở đâu.</li>
<li>A6: Mọi sinh viên đang theo học đều có một địa chỉ email của trường gửi tới được.</li>
</ul>
<p><strong>Phụ thuộc</strong></p>
<ul>
<li>D1: Một giao tiếp tới hệ thống tài chính, hình thức phụ thuộc vào nhà cung cấp (RI-1).</li>
<li>D2: Một văn bản chính sách của trường đã ký, ấn định SLA vượt sĩ số 48 giờ (BR-12).</li>
<li>D3: Các hội đồng chương trình của khoa xác nhận các điều kiện tốt nghiệp đã mã hoá trước bản 1.0.</li>
<li>D4: Một người quản lý dữ liệu của Phòng Đào tạo, 8 giờ mỗi tuần trong giai đoạn yêu cầu và chuyển đổi dữ liệu.</li>
</ul>
<div class="callout">
<p><strong>Nếu A2 sai thì bản 1.0 sai.</strong> Mọi quyết định ghi danh ở §3.3 đều phụ thuộc vào việc
luật tiên quyết máy đánh giá được. Các ngành không diễn đạt được thì xử lý dưới dạng
Không xác định theo thiết kế (Prereq-5), nhưng nếu tỉ lệ đó cao hơn 10% một cách đáng
kể thì mục tiêu tiết kiệm giờ công BO-2 trở nên không thể đạt và phải xem lại phạm vi.</p>
</div>
<hr />
<h3>3. Tính năng hệ thống</h3>
<h3>3.1 Tra cứu và duyệt danh mục môn học</h3>
<p><strong>Mô tả.</strong> Việc công bố và tra cứu danh mục lớp. Hiện thực FE-1 · UC-01 · Mục tiêu BO-1.
<strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Catalog-1:</strong> Hệ thống phải hiển thị, với từng lớp, mã môn, tên môn, số tín chỉ, giảng viên, lịch học, sĩ số công bố và sĩ số còn lại.</p>
<p><strong>Catalog-2:</strong> Hệ thống phải cho phép sinh viên lọc lớp theo khoa, mã môn, từ khoá, ngày, khoảng giờ, giảng viên và tình trạng còn chỗ.</p>
<p><strong>Catalog-3:</strong> Hệ thống phải tính sĩ số còn lại theo đúng BR-03 và không được phục vụ con số sĩ số nào cũ quá 60 giây.</p>
<p><strong>Catalog-4:</strong> Hệ thống phải đánh dấu là không đủ điều kiện, kèm lý do, mọi lớp mà chương trình của sinh viên đang xem không cho phép.</p>
<p><strong>Catalog-5:</strong> Hệ thống phải hiển thị lớp mà hệ thống thời khoá biểu chưa công bố lịch học, đánh dấu là giờ học sẽ xác nhận sau, và không được cho phép ghi danh vào lớp đó.</p>
<p><strong>Catalog-6:</strong> Hệ thống phải nói rõ bộ lọc nào đã loại hết kết quả khi một lượt tìm kiếm không trả về gì.</p>
<p><strong>Catalog-7:</strong> Hệ thống phải phục vụ một bản danh mục cache không cũ quá 15 phút, có ghi rõ độ cũ, khi nguồn danh mục không truy cập được.</p>
<h3>3.2 Lập kế hoạch thời khoá biểu</h3>
<p><strong>Mô tả.</strong> Việc dựng thời khoá biểu tạm trước khi mở cửa sổ. Hiện thực FE-2 · UC-02 ·
Mục tiêu BO-1. <strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Plan-1:</strong> Hệ thống phải cho phép sinh viên thêm lớp vào một kế hoạch có tên và giữ đồng thời tối đa ba kế hoạch.</p>
<p><strong>Plan-2:</strong> Hệ thống phải phát hiện và đánh dấu mọi chỗ trùng giờ học giữa các lớp trong một kế hoạch, theo đúng BR-07.</p>
<p><strong>Plan-3:</strong> Hệ thống phải đánh giá môn tiên quyết cho mọi lớp trong kế hoạch và phải đánh dấu từng lớp có môn tiên quyết chưa thoả.</p>
<p><strong>Plan-4:</strong> Hệ thống phải cộng tổng tín chỉ trong một kế hoạch và phải đánh dấu kế hoạch khi tổng vượt trần tín chỉ của sinh viên, nêu rõ phần vượt.</p>
<p><strong>Plan-5:</strong> Hệ thống không được trao cho một kế hoạch bất kỳ chỗ nào, lượt giữ nào hay quyền ưu tiên đăng ký nào, và phải nói rõ điều này với sinh viên.</p>
<p><strong>Plan-6:</strong> Hệ thống phải đánh dấu lớp trong kế hoạch đã bị huỷ và phải gợi ý các lớp thay thế của cùng môn.</p>
<p><strong>Plan-7:</strong> Hệ thống phải gửi từng lớp của kế hoạch đi ghi danh theo đúng thứ tự sinh viên chỉ định, và phải báo kết quả của từng lớp riêng biệt.</p>
<h3>3.3 Giao dịch ghi danh</h3>
<p><strong>Mô tả.</strong> Quyết định ghi danh tự động duy nhất. Hiện thực FE-3 · UC-03 · Mục tiêu BO-1,
BO-2, BO-4. <strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Enroll-1:</strong> Hệ thống chỉ được nhận một yêu cầu ghi danh khi đợt ưu tiên của sinh viên gửi yêu cầu đang mở, theo đúng BR-06.</p>
<p><strong>Enroll-2:</strong> Hệ thống phải từ chối yêu cầu ghi danh vào một lớp mà sinh viên đã có một lượt ghi danh, theo đúng BR-01.</p>
<p><strong>Enroll-3:</strong> Hệ thống phải từ chối yêu cầu ghi danh từ một sinh viên đang mang khoá chặn cố vấn còn hiệu lực, theo đúng BR-14, và phải gọi tên cố vấn cần liên hệ.</p>
<p><strong>Enroll-4:</strong> Hệ thống phải từ chối yêu cầu ghi danh mà lớp của nó trùng giờ học với bất kỳ lớp nào sinh viên đã ghi danh, theo đúng BR-07, và phải gọi tên lớp bị trùng.</p>
<p><strong>Enroll-5:</strong> Hệ thống phải từ chối yêu cầu ghi danh sẽ đưa sinh viên vượt trần tín chỉ của năm học của họ, theo đúng BR-04, và phải nói rõ trần là bao nhiêu và tổng hiện tại là bao nhiêu.</p>
<p><strong>Enroll-6:</strong> Hệ thống chỉ được chiếm một chỗ khi sĩ số còn lại tính theo BR-03 lớn hơn không, và không bao giờ được cấp cùng một chỗ cho hai sinh viên.</p>
<p><strong>Enroll-7:</strong> Hệ thống phải ghi danh sinh viên vào cả hai lớp của một cặp môn song hành như một giao dịch duy nhất, hoặc không lớp nào, theo đúng BR-20.</p>
<p><strong>Enroll-8:</strong> Hệ thống phải hoàn tất trọn vẹn một lượt ghi danh hoặc không thay đổi trạng thái nào, và phải ghi lại quyết định, lý do của nó cùng mọi luật đã đánh giá, dù yêu cầu thành công hay thất bại.</p>
<p><strong>Enroll-9:</strong> Hệ thống phải công bố một lượt ghi danh đã xác nhận sang hệ quản lý học tập.</p>
<p><strong>Enroll-10:</strong> Hệ thống phải mời vào danh sách chờ hoặc mời tạo yêu cầu vượt sĩ số, nếu môn đó cho phép, khi một lượt ghi danh bị từ chối vì hết chỗ.</p>
<h3>3.4 Bộ luật môn tiên quyết và môn song hành</h3>
<p><strong>Mô tả.</strong> Việc đánh giá tự động các luật chương trình đào tạo. Hiện thực FE-4 · UC-04 ·
Mục tiêu BO-2. <strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Prereq-1:</strong> Hệ thống phải đánh giá các môn đã hoàn thành của sinh viên theo mọi luật tiên quyết gắn với một môn học, kể cả mức điểm tối thiểu đã quy định, theo đúng BR-02.</p>
<p><strong>Prereq-2:</strong> Hệ thống phải trả về kết quả Đạt, Chưa đạt hoặc Không xác định cho mọi lượt đánh giá, và phải gọi tên đúng luật chưa thoả với kết quả Chưa đạt.</p>
<p><strong>Prereq-3:</strong> Hệ thống phải coi một môn tiên quyết đang được học là đạt tạm thời, và phải đánh giá lại lượt ghi danh khi điểm cuối kỳ được nhập.</p>
<p><strong>Prereq-4:</strong> Hệ thống phải đánh giá các luật môn song hành theo các lượt ghi danh đang học và đang dự kiến của sinh viên, theo đúng BR-20.</p>
<p><strong>Prereq-5:</strong> Hệ thống phải trả về Không xác định, và phải phát một cảnh báo cấu hình, khi một môn học không có luật chương trình nào gắn vào, và không được trả về Đạt.</p>
<p><strong>Prereq-6:</strong> Hệ thống phải trả về Không xác định với sinh viên có bảng điểm bị đánh dấu là không đầy đủ, và phải chuyển lượt đánh giá đó tới Nhân viên học vụ.</p>
<p><strong>Prereq-7:</strong> Hệ thống phải chấp nhận một môn được ghi nhận là tương đương với môn tiên quyết, và phải ghi lại đã áp dụng ánh xạ tương đương nào.</p>
<p><strong>Prereq-8:</strong> Hệ thống phải đánh giá luật chương trình bằng phiên bản có hiệu lực theo năm quy chế của sinh viên, theo đúng CO-6.</p>
<p><strong>Prereq-9:</strong> Hệ thống phải phát một ngoại lệ ghi-danh-không-hợp-lệ, và phải báo cho sinh viên cùng cố vấn của họ, khi một điểm được nhập làm cho một môn tiên quyết đạt tạm thời trở thành chưa đạt.</p>
<h3>3.5 Đánh giá điều kiện tài chính</h3>
<p><strong>Mô tả.</strong> Phép kiểm tình trạng tài chính tự động lúc ghi danh. Hiện thực FE-5 · UC-05 ·
Mục tiêu BO-4. <strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Finance-1:</strong> Hệ thống phải lấy số dư còn nợ và trạng thái khoá chặn đăng ký của sinh viên từ hệ thống tài chính trước khi xác nhận một lượt ghi danh, theo đúng BR-05.</p>
<p><strong>Finance-2:</strong> Hệ thống phải trả về kết quả Đủ điều kiện, Bị chặn hoặc Không rõ, và phải ghi lại số tiền còn nợ tại thời điểm cho ra kết quả Bị chặn.</p>
<p><strong>Finance-3:</strong> Hệ thống phải coi kết quả Không rõ là một lần từ chối kèm nút thử lại, và không được coi nó là Đủ điều kiện.</p>
<p><strong>Finance-4:</strong> Hệ thống phải coi sinh viên có kế hoạch trả góp đang hiệu lực và không vi phạm là Đủ điều kiện, bất kể số dư còn nợ.</p>
<p><strong>Finance-5:</strong> Hệ thống phải cho phép một Cán bộ Tài chính gỡ khoá chặn cho một sinh viên có tên, và phải ghi lại cán bộ đó, lý do và một ngày hết hiệu lực.</p>
<p><strong>Finance-6:</strong> Hệ thống phải đánh giá lại tình trạng tài chính của mọi sinh viên đã ghi danh mỗi đêm, và phải phát một ngoại lệ tài chính chứ không được gỡ bỏ lượt ghi danh nào.</p>
<p><strong>Finance-7:</strong> Hệ thống không được lưu chi tiết phương tiện thanh toán nào và bản ghi giao dịch nào, theo đúng CO-4.</p>
<h3>3.6 Quy trình vượt sĩ số</h3>
<p><strong>Mô tả.</strong> Việc xin và quyết định có theo dõi cho một chỗ mà bình thường sinh viên không
vào được. Hiện thực FE-6 · UC-06 · Mục tiêu BO-3. <strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Override-1:</strong> Hệ thống phải cho phép sinh viên gửi một yêu cầu vượt sĩ số có nêu căn cứ và lời giải trình, cho một lớp có cho phép vượt sĩ số.</p>
<p><strong>Override-2:</strong> Hệ thống phải định tuyến yêu cầu tới Trưởng bộ môn sở hữu lớp đó, và chỉ được nhận quyết định từ chính Trưởng bộ môn đó hoặc người được họ uỷ quyền có tên, theo đúng BR-11.</p>
<p><strong>Override-3:</strong> Hệ thống phải ghi lại thời gian trôi qua từ lúc gửi tới lúc có quyết định cho mọi yêu cầu, đo theo hạn đặt ra ở BR-12.</p>
<p><strong>Override-4:</strong> Hệ thống phải trình cho người quyết định trích lục bảng điểm của sinh viên, sĩ số hiện tại của lớp so với sức chứa, sức chứa phòng học và mọi yêu cầu đang chờ khác của cùng lớp đó.</p>
<p><strong>Override-5:</strong> Hệ thống phải ghi lại người quyết, thời điểm quyết và một lý do bắt buộc cho mọi lần duyệt và mọi lần từ chối.</p>
<p><strong>Override-6:</strong> Hệ thống phải leo thang lên Phòng Đào tạo mọi yêu cầu chưa được quyết sau thời hạn ở BR-12, và không được tự duyệt cũng không được tự từ chối.</p>
<p><strong>Override-7:</strong> Hệ thống phải nâng sức chứa hiệu lực của lớp thêm một, chỉ dành cho sinh viên gửi yêu cầu, khi một lần vượt sĩ số được duyệt, và phải ghi danh sinh viên đó.</p>
<p><strong>Override-8:</strong> Hệ thống phải ghi lại một lần duyệt mà không ghi danh được, phải báo cho sinh viên và người quyết định kèm đúng điều kiện đang chặn, và phải giữ hiệu lực của lần duyệt đó trong 72 giờ.</p>
<p><strong>Override-9:</strong> Hệ thống phải đòi người quyết định xác nhận tường minh khi một lần duyệt sẽ đẩy sĩ số vượt quá sức chứa phòng học do hệ thống thời khoá biểu công bố.</p>
<h3>3.7 Quản lý danh sách chờ</h3>
<p><strong>Mô tả.</strong> Một hàng chờ công bằng cho các lớp đã đầy, do hệ thống tự vận hành. Hiện thực
FE-7 · UC-07 · Mục tiêu BO-3. <strong>Độ ưu tiên:</strong> Trung bình · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Wait-1:</strong> Hệ thống chỉ được cho phép sinh viên vào danh sách chờ của một lớp đã đầy khi sinh viên đó thoả mọi luật ghi danh khác ngoài sĩ số.</p>
<p><strong>Wait-2:</strong> Hệ thống phải giữ tối đa một vị trí chờ cho mỗi sinh viên với mỗi môn học.</p>
<p><strong>Wait-3:</strong> Hệ thống phải mời chỗ được nhả ra cho sinh viên đứng cao nhất trong danh sách chờ mà vẫn thoả mọi luật ghi danh, theo đúng BR-08, và chỉ được mời một chỗ cho một sinh viên tại một thời điểm.</p>
<p><strong>Wait-4:</strong> Hệ thống phải cho hết hạn một lời mời danh sách chờ không được trả lời sau khoảng thời gian định ra ở BR-09 và phải mời chỗ đó cho sinh viên đủ điều kiện kế tiếp.</p>
<p><strong>Wait-5:</strong> Hệ thống phải giữ nguyên vị trí trong hàng chờ của sinh viên bị bỏ qua vì không đủ điều kiện, và phải báo cho sinh viên đó vì sao họ bị bỏ qua.</p>
<p><strong>Wait-6:</strong> Hệ thống phải ghi danh sinh viên đã chọn tự động nhận mà không chờ phản hồi, và phải báo cho họ sau đó.</p>
<p><strong>Wait-7:</strong> Hệ thống phải hoãn một giờ trước khi mời lại chỗ bị từ chối vì xung đột giờ học, để sinh viên đó có thể rút lớp gây xung đột.</p>
<p><strong>Wait-8:</strong> Hệ thống phải vô hiệu một lời mời còn treo, và phải báo cho sinh viên kèm lý do, khi lớp bị huỷ hoặc sĩ số của nó bị giảm.</p>
<h3>3.8 Rút, đổi và xử lý đợt thêm/bớt môn</h3>
<p><strong>Mô tả.</strong> Việc rời một lớp, và việc đổi lớp này lấy lớp khác một cách nguyên tử. Hiện
thực FE-8 · UC-08. <strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Drop-1:</strong> Hệ thống chỉ được cho phép rút mà không để lại dấu trên bảng điểm trong thời gian thêm/bớt môn, theo đúng BR-16, và phải nói rõ hệ quả trước khi hỏi xác nhận.</p>
<p><strong>Drop-2:</strong> Hệ thống phải nhả chỗ của lớp bị rút và phải kích hoạt việc thăng suất danh sách chờ trong vòng 60 giây.</p>
<p><strong>Drop-3:</strong> Hệ thống phải kiểm toàn bộ lớp thay thế trước khi nhả chỗ của lớp bị thay, và phải hoàn tất trọn vẹn một lần đổi lớp hoặc không thay đổi gì.</p>
<p><strong>Drop-4:</strong> Hệ thống phải rút cả hai lớp của một cặp môn song hành khi một trong hai bị rút, theo đúng BR-20, và phải nói rõ điều này trước khi xác nhận.</p>
<p><strong>Drop-5:</strong> Hệ thống phải cảnh báo sinh viên mà việc rút sẽ đưa họ xuống dưới số tín chỉ tối thiểu, phải gọi tên hệ quả đã được ghi nhận, và chỉ được tiến hành khi có xác nhận tường minh.</p>
<p><strong>Drop-6:</strong> Hệ thống phải công bố mọi lượt rút sang hệ quản lý học tập.</p>
<h3>3.9 Kiểm tra tiến độ tốt nghiệp thời gian thực</h3>
<p><strong>Mô tả.</strong> Việc nhìn thấy tiến độ chương trình một cách liên tục. Hiện thực FE-9 · UC-09 ·
Mục tiêu BO-6. <strong>Độ ưu tiên:</strong> Trung bình · <strong>Bản phát hành:</strong> 1.1</p>
<p><strong>Audit-1:</strong> Hệ thống phải đánh giá mọi nhóm điều kiện của chương trình sinh viên đang học theo các môn đã hoàn thành, các lượt ghi danh đang học và tín chỉ chuyển đổi đã duyệt.</p>
<p><strong>Audit-2:</strong> Hệ thống phải gán cho mỗi nhóm điều kiện một trạng thái Satisfied, InProgress, Outstanding hoặc NeedsReview, và phải gọi tên các môn đã thoả nó.</p>
<p><strong>Audit-3:</strong> Hệ thống phải tính tỉ lệ hoàn thành tổng thể theo đúng BR-13.</p>
<p><strong>Audit-4:</strong> Hệ thống phải gán NeedsReview, kèm lý do, cho mọi điều kiện nó không đánh giá nổi, và không được gán Satisfied hay Outstanding cho điều kiện đó.</p>
<p><strong>Audit-5:</strong> Hệ thống phải đánh giá điều kiện chương trình của sinh viên bằng bộ luật có hiệu lực theo năm quy chế của họ, và phải nói rõ đã dùng năm quy chế nào, theo đúng CO-6.</p>
<p><strong>Audit-6:</strong> Hệ thống phải nhận diện sinh viên có nguy cơ tốt nghiệp trễ theo đúng BR-18.</p>
<p><strong>Audit-7:</strong> Hệ thống phải cho phép sinh viên đánh giá thử một môn dự kiến hoặc một chương trình dự kiến theo hồ sơ của mình mà không làm thay đổi bất kỳ trạng thái lưu trữ nào.</p>
<p><strong>Audit-8:</strong> Hệ thống không được phục vụ kết quả kiểm tra nào được tính từ hơn 5 phút trước.</p>
<p><strong>Audit-9:</strong> Hệ thống phải đánh dấu là tạm mọi điều kiện mà việc đánh giá nó phụ thuộc vào một điểm đang bị phúc khảo, và phải gọi tên môn học đó.</p>
<p><strong>Audit-10:</strong> Hệ thống phải trình ra các nhóm điều kiện đã tính xong, và phải đánh dấu phần còn lại là đang chờ kèm nút thử lại, khi việc đánh giá không hoàn tất trong ngân sách thời gian của nó.</p>
<h3>3.10 Số dư tài khoản và lịch sử thanh toán</h3>
<p><strong>Mô tả.</strong> Màn hình sinh viên xem mình nợ gì. Hiện thực FE-10 · UC-10 · Mục tiêu BO-6.
<strong>Độ ưu tiên:</strong> Trung bình · <strong>Bản phát hành:</strong> 1.1</p>
<p><strong>Account-1:</strong> Hệ thống phải trình ra số dư còn nợ của sinh viên, các khoản cấu thành nó, và các lần đã nộp, lấy về từ hệ thống tài chính.</p>
<p><strong>Account-2:</strong> Hệ thống phải tính chi phí ước tính cho một kế hoạch thời khoá biểu theo đúng BR-17, và phải ghi rõ đó là một ước tính.</p>
<p><strong>Account-3:</strong> Hệ thống phải nói rõ, khi đang có một khoá chặn đăng ký, số tiền phải nộp để gỡ nó.</p>
<p><strong>Account-4:</strong> Hệ thống chỉ được tiết lộ thông tin tài chính liên quan tới chính sinh viên đã xác thực.</p>
<p><strong>Account-5:</strong> Hệ thống phải trình ra thời điểm các con số tài chính được lấy về từ hệ thống tài chính.</p>
<p><strong>Account-6:</strong> Hệ thống phải trình ra các con số lấy về gần nhất kèm độ cũ của chúng khi hệ thống tài chính không truy cập được, và không được trình ra số dư bằng không trong hoàn cảnh đó.</p>
<h3>3.11 Khả năng duy trì lớp và việc huỷ lớp</h3>
<p><strong>Mô tả.</strong> Việc tìm ra và huỷ kịp thời các lớp không đủ sĩ số. Hiện thực FE-11 · UC-11 ·
Mục tiêu BO-5. <strong>Độ ưu tiên:</strong> Thấp · <strong>Bản phát hành:</strong> 1.2</p>
<p><strong>Viability-1:</strong> Hệ thống phải đánh giá mọi lớp so với sĩ số tối thiểu duy trì được của nó tại mốc kiểm định ra ở BR-10 và phải đánh dấu những lớp thấp hơn mức đó.</p>
<p><strong>Viability-2:</strong> Hệ thống phải áp sĩ số tối thiểu duy trì được đã cấu hình cho lớp, hoặc của khoa nếu lớp chưa cấu hình, theo đúng BR-15.</p>
<p><strong>Viability-3:</strong> Hệ thống phải nhả mọi lượt ghi danh và báo cho mọi sinh viên đã ghi danh và đang chờ khi một lớp bị huỷ, theo đúng BR-19, và chỉ được hoàn tất việc huỷ khi mọi lượt nhả đã được áp dụng.</p>
<p><strong>Viability-4:</strong> Hệ thống phải trình ra các sinh viên bị ảnh hưởng bởi một đề xuất huỷ lớp, và những ai sẽ rơi xuống dưới số tín chỉ tối thiểu, trước khi quyết định được xác nhận.</p>
<p><strong>Viability-5:</strong> Hệ thống phải nhận diện, trước khi xác nhận việc huỷ, mọi sinh viên mà lớp đó là bắt buộc để họ hoàn thành chương trình ngay học kỳ này, theo đúng BR-18, và phải đòi xác nhận tường minh.</p>
<p><strong>Viability-6:</strong> Hệ thống phải ghi lại người quyết, thời điểm và một lý do cho mọi lần huỷ lớp và mọi quyết định vẫn mở lớp dưới mức tối thiểu.</p>
<p><strong>Viability-7:</strong> Hệ thống chỉ được chuyển sinh viên giữa các lớp được gộp ở nơi không phát sinh xung đột giờ học, và phải liệt kê những ai không chuyển được.</p>
<p><strong>Viability-8:</strong> Hệ thống phải phát một đầu việc theo dõi cho phòng học vụ khi một thông báo huỷ lớp không gửi tới nơi được.</p>
<h3>3.12 Quản trị cửa sổ đăng ký</h3>
<p><strong>Mô tả.</strong> Việc điều khiển cửa sổ và các đợt ưu tiên của nó. Hiện thực FE-12 · UC-12 ·
Mục tiêu BO-1. <strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Window-1:</strong> Hệ thống phải xác định được, với bất kỳ sinh viên nào tại bất kỳ thời điểm nào, rằng đợt ưu tiên của họ có đang mở hay không, theo đúng BR-06.</p>
<p><strong>Window-2:</strong> Hệ thống phải từ chối một cấu hình cửa sổ mà các đợt chồng nhau hoặc các đợt không bao gồm mỗi sinh viên đang hoạt động đúng một lần, và phải gọi tên các sinh viên hoặc chỗ chồng liên quan.</p>
<p><strong>Window-3:</strong> Hệ thống phải từ chối việc mở cửa sổ cho một học kỳ chưa có danh mục lớp được công bố.</p>
<p><strong>Window-4:</strong> Hệ thống phải ghi lại người làm, thời điểm và một lý do cho mọi thay đổi với một cửa sổ.</p>
<p><strong>Window-5:</strong> Hệ thống phải cho phép Phòng Đào tạo gia hạn một cửa sổ đang mở, và phải báo cho mọi sinh viên bị ảnh hưởng.</p>
<p><strong>Window-6:</strong> Hệ thống phải cho phép Phòng Đào tạo mở lại đăng ký chỉ cho những sinh viên có tên.</p>
<p><strong>Window-7:</strong> Hệ thống phải cho các giao dịch ghi danh đang bay hoàn tất, và không được nhận giao dịch mới nào, khi một cửa sổ bị đóng.</p>
<p><strong>Window-8:</strong> Hệ thống phải sinh ra, vào lúc cửa sổ đóng, một bản tổng kết về lượt ghi danh, lượt bị từ chối theo lý do, yêu cầu vượt sĩ số còn treo và độ dài danh sách chờ.</p>
<h3>3.13 Hồ sơ cố vấn và khoá chặn</h3>
<p><strong>Mô tả.</strong> Việc ghi lại lời tư vấn và điều khiển khoá chặn cố vấn. Hiện thực FE-13 ·
UC-13. <strong>Độ ưu tiên:</strong> Thấp · <strong>Bản phát hành:</strong> 1.2</p>
<p><strong>Advise-1:</strong> Hệ thống phải cho phép cố vấn được phân công cho một sinh viên ghi lại lời tư vấn đã đưa ra và kế hoạch đã thống nhất nếu có.</p>
<p><strong>Advise-2:</strong> Hệ thống phải ngăn việc ghi danh của sinh viên đang mang khoá chặn cố vấn còn hiệu lực, theo đúng BR-14.</p>
<p><strong>Advise-3:</strong> Hệ thống phải ghi lại người làm, thời điểm và một lý do mỗi khi một khoá chặn cố vấn được đặt hoặc được gỡ.</p>
<p><strong>Advise-4:</strong> Hệ thống phải cho phép đặt một khoá chặn kèm ngày hết hiệu lực, sau ngày đó nó thôi áp dụng.</p>
<p><strong>Advise-5:</strong> Hệ thống phải trình ra cho sinh viên việc có tồn tại một khoá chặn, phân loại lý do của nó và cố vấn cần liên hệ, và không được trình ra nội dung ghi chú tư vấn cho sinh viên.</p>
<p><strong>Advise-6:</strong> Hệ thống chỉ được áp khoá chặn lên việc ghi danh trong tương lai, và không được đảo ngược các lượt ghi danh đã thực hiện.</p>
<p><strong>Advise-7:</strong> Hệ thống phải báo cho Phòng Đào tạo, 72 giờ trước khi một cửa sổ mở, số lượng sinh viên còn đang mang khoá chặn chưa được gỡ.</p>
<h3>3.14 Báo cáo ghi danh và sĩ số</h3>
<p><strong>Mô tả.</strong> Việc báo cáo theo sáu mục tiêu nghiệp vụ. Hiện thực FE-14 · UC-14.
<strong>Độ ưu tiên:</strong> Thấp · <strong>Bản phát hành:</strong> 2.0</p>
<p><strong>Report-1:</strong> Hệ thống phải trình ra số lượt ghi danh, mức sử dụng sĩ số, lý do từ chối và hoạt động vượt sĩ số cho một giai đoạn và phạm vi được chọn.</p>
<p><strong>Report-2:</strong> Hệ thống phải tính mọi con số được báo cáo bằng đúng định nghĩa đã ghi cho thước đo thành công tương ứng ở Vision and Scope §1.4.</p>
<p><strong>Report-3:</strong> Hệ thống phải giới hạn các khoa, bộ môn và chương trình nhìn thấy được trong một báo cáo theo đúng những gì vai của người yêu cầu cho phép, và phải nói rõ khi một kết quả đã bị giới hạn bởi quyền hạn.</p>
<p><strong>Report-4:</strong> Hệ thống phải trình ra thời gian quyết định vượt sĩ số đo theo hạn ở BR-12, theo từng bộ môn.</p>
<p><strong>Report-5:</strong> Hệ thống phải trình ra một trạng thái cho biết không có dữ liệu nào cho giai đoạn được chọn, khác biệt với một giá trị bằng không.</p>
<p><strong>Report-6:</strong> Hệ thống phải loại chi tiết tài chính của từng sinh viên ra khỏi mọi báo cáo mà người dùng khối học vụ truy cập được.</p>
<p><strong>Report-7:</strong> Hệ thống phải tự sinh một bản tổng kết cửa sổ đăng ký khi một cửa sổ đóng.</p>
<hr />
<h3>4. Yêu cầu dữ liệu</h3>
<h3>4.1 Mô hình dữ liệu logic</h3>
<p>Mô hình thực thể-quan hệ nằm ở <strong>Phụ lục B</strong>, Hình B-2. Nó là một mô hình <em>logic</em> mô tả
dữ liệu mà nhà trường làm việc cùng, không phải một schema cơ sở dữ liệu.</p>
<table>
<thead>
<tr>
<th>Thực thể</th>
<th>Quan hệ</th>
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
<td>1 → n Section · 1 → 0..n Prerequisite Rule · n → 0..n Course (môn song hành)</td>
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
<p>Có hai quan hệ ràng buộc thiết kế nhiều hơn những cái còn lại. <strong>Course → Course (môn
song hành)</strong> là quan hệ đối xứng và phải được lưu như vậy, nếu không BR-20 sẽ không cưỡng
chế nổi theo một chiều. Và <strong>luật chương trình được phiên bản hoá theo năm quy chế</strong>
(CO-6), nên quan hệ Programme → Requirement Group không đơn thuần là trạng thái hiện tại:
mọi phiên bản trước đều phải lấy lại được.</p>
<h3>4.2 Từ điển dữ liệu</h3>
<p>Định nghĩa, cấu thành, kiểu, độ dài và các giá trị cho phép của từng phần tử dữ liệu nằm
trong tài liệu <strong>Data Dictionary</strong> riêng (R4), gồm 91 mục.</p>
<h3>4.3 Báo cáo</h3>
<table>
<thead>
<tr>
<th>Mã</th>
<th>Báo cáo</th>
<th>Nội dung và thứ tự sắp xếp</th>
<th>Đối tượng đọc</th>
<th>Tần suất</th>
</tr>
</thead>
<tbody>
<tr>
<td>RPT-1</td>
<td>Tổng kết cửa sổ đăng ký</td>
<td>Lượt ghi danh, lượt từ chối theo lý do, vượt sĩ số còn treo, độ dài danh sách chờ; theo khoa</td>
<td>Phòng Đào tạo, Phó hiệu trưởng</td>
<td>Lúc cửa sổ đóng</td>
</tr>
<tr>
<td>RPT-2</td>
<td>Mức sử dụng sĩ số</td>
<td>Sĩ số so với sức chứa theo từng lớp; sắp theo mức sử dụng tăng dần</td>
<td>Trưởng bộ môn</td>
<td>Hằng tuần trong đợt đăng ký</td>
</tr>
<tr>
<td>RPT-3</td>
<td>Hoạt động vượt sĩ số và SLA</td>
<td>Số yêu cầu, số quyết định, thời gian quyết định trung vị và percentile 90 so với BR-12; theo bộ môn</td>
<td>Phòng Đào tạo</td>
<td>Hằng tuần trong đợt đăng ký</td>
</tr>
<tr>
<td>RPT-4</td>
<td>Khả năng duy trì lớp</td>
<td>Các lớp dưới sĩ số tối thiểu kèm số ngày còn lại tới thêm/bớt môn; sắp theo mức thiếu hụt</td>
<td>Trưởng bộ môn</td>
<td>Hằng ngày kể từ mốc kiểm BR-10</td>
</tr>
<tr>
<td>RPT-5</td>
<td>Ngoại lệ môn tiên quyết</td>
<td>Các lượt ghi danh trả về Không xác định hoặc bị vô hiệu; sắp theo ngày</td>
<td>Nhân viên học vụ</td>
<td>Hằng ngày trong đợt đăng ký</td>
</tr>
<tr>
<td>RPT-6</td>
<td>Tác động của khoá chặn tài chính</td>
<td>Sinh viên bị chặn lúc đăng ký, số tiền còn nợ chia theo dải; <strong>không hiện số tiền của từng cá nhân cho người dùng khối học vụ</strong></td>
<td>Cán bộ Tài chính</td>
<td>Hằng ngày trong đợt đăng ký</td>
</tr>
<tr>
<td>RPT-7</td>
<td>Nguy cơ tốt nghiệp trễ</td>
<td>Các sinh viên được nhận diện có nguy cơ tốt nghiệp trễ theo BR-18; sắp theo mức thiếu hụt</td>
<td>Cố vấn học tập</td>
<td>Mỗi học kỳ</td>
</tr>
</tbody>
</table>
<p>Bố cục báo cáo để lại cho khâu thiết kế; mục này đặc tả nội dung, thứ tự sắp xếp, đối
tượng đọc và tần suất.</p>
<h3>4.4 Thu thập, toàn vẹn, lưu trữ và huỷ dữ liệu</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Yêu cầu</th>
</tr>
</thead>
<tbody>
<tr>
<td>DA-1</td>
<td>Hệ thống phải thu nạp dữ liệu sinh viên, bảng điểm, chương trình đào tạo và danh mục từ hệ thống cũ bằng một lần chuyển đổi duy nhất, có đối chiếu với các tổng kiểm soát trước khi gỡ đóng băng hệ cũ.</td>
</tr>
<tr>
<td>DA-2</td>
<td>Hệ thống phải đánh dấu là không đầy đủ mọi bảng điểm có từ trước 2019, và phải khiến việc đánh giá môn tiên quyết dựa trên nó trả về Không xác định, theo đúng giả định A3.</td>
</tr>
<tr>
<td>DA-3</td>
<td>Hệ thống phải ghi lại, với mọi quyết định ghi danh, thời điểm, kết cục, lý do và mọi luật đã đánh giá, dù quyết định thành công hay thất bại.</td>
</tr>
<tr>
<td>DA-4</td>
<td>Hệ thống phải lưu giữ hồ sơ ghi danh và hồ sơ học vụ suốt vòng đời của bản ghi sinh viên và không được xoá một mục bảng điểm nào.</td>
</tr>
<tr>
<td>DA-5</td>
<td>Hệ thống phải lưu giữ ghi chú tư vấn trong 7 năm sau khi sinh viên tốt nghiệp hoặc thôi học, sau đó phải xoá chúng.</td>
</tr>
<tr>
<td>DA-6</td>
<td>Hệ thống phải lưu giữ nhật ký kiểm toán đăng ký trong 3 năm.</td>
</tr>
<tr>
<td>DA-7</td>
<td>Hệ thống phải kiểm hằng ngày rằng mọi chỗ đã bị chiếm đều khớp với đúng một lượt ghi danh hoặc đúng một lần vượt sĩ số đã duyệt, và phải phát cảnh báo chất lượng dữ liệu với mọi sai lệch.</td>
</tr>
<tr>
<td>DA-8</td>
<td>Hệ thống phải lưu giữ mọi phiên bản trước của một luật được phiên bản hoá theo năm quy chế, theo đúng CO-6.</td>
</tr>
</tbody>
</table>
<hr />
<h3>5. Yêu cầu giao tiếp ngoài</h3>
<h3>5.1 Giao diện người dùng</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Yêu cầu</th>
</tr>
</thead>
<tbody>
<tr>
<td>UI-1</td>
<td>Hệ thống phải cung cấp bốn giao diện: giao diện sinh viên, giao diện nhân viên học vụ, giao diện trưởng bộ môn và giao diện cố vấn.</td>
</tr>
<tr>
<td>UI-2</td>
<td>Giao diện sinh viên phải dùng được trên thiết bị di động ở bề rộng khung nhìn 360 px cho các màn hình danh mục, lập kế hoạch, ghi danh, kiểm tra tiến độ và tài khoản.</td>
</tr>
<tr>
<td>UI-3</td>
<td>Mọi lần từ chối phải nói rõ luật cụ thể nào đã từ chối yêu cầu, giá trị nào gây ra điều đó, và người dùng làm được gì tiếp theo.</td>
</tr>
<tr>
<td>UI-4</td>
<td>Mọi hành động không đảo ngược được phải đòi một lần xác nhận có gọi tên đối tượng bị tác động và nêu rõ hệ quả.</td>
</tr>
<tr>
<td>UI-5</td>
<td>Hệ thống không được đòi hỏi tài liệu đào tạo nào cho giao diện sinh viên; một sinh viên phải hoàn tất được một lượt ghi danh mà không cần hướng dẫn.</td>
</tr>
<tr>
<td>UI-6</td>
<td>Thiết kế màn hình cho ba use case phức tạp nhất được minh hoạ ở R5; chỗ nào R5 và tài liệu này khác nhau thì tài liệu này có thẩm quyền.</td>
</tr>
</tbody>
</table>
<h3>5.2 Giao tiếp phần mềm</h3>
<table>
<thead>
<tr>
<th>Mã</th>
<th>Giao tiếp</th>
<th>Chiều</th>
<th>Nội dung</th>
<th>Mức dịch vụ</th>
</tr>
</thead>
<tbody>
<tr>
<td>SI-1</td>
<td>SSO của trường — xác thực</td>
<td>Vào</td>
<td>Khẳng định xác thực và khai báo vai trò (CO-1)</td>
<td>Theo chuẩn của trường</td>
</tr>
<tr>
<td>SI-2</td>
<td>Hệ tài chính — truy vấn điều kiện</td>
<td>Vào</td>
<td>Số dư còn nợ và khoá chặn đăng ký (CO-7)</td>
<td>Phản hồi trong 5 giây; Không rõ sau khi thử lại (Finance-3)</td>
</tr>
<tr>
<td>SI-3</td>
<td>Hệ tài chính — chi tiết tài khoản</td>
<td>Vào</td>
<td>Các khoản phải nộp, các lần đã nộp, kế hoạch trả góp</td>
<td>Nỗ lực tốt nhất; cho phép hiển thị dữ liệu cũ (Account-6)</td>
</tr>
<tr>
<td>SI-4</td>
<td>Hệ thời khoá biểu — danh mục lớp</td>
<td>Vào</td>
<td>Lớp, lịch học, phòng, giảng viên</td>
<td>Công bố ít nhất 14 ngày trước một cửa sổ</td>
</tr>
<tr>
<td>SI-5</td>
<td>Hệ thời khoá biểu — sức chứa phòng</td>
<td>Vào</td>
<td>Sức chứa vật lý của phòng theo từng lớp</td>
<td>Đọc lúc ra quyết định vượt sĩ số (Override-9)</td>
</tr>
<tr>
<td>SI-6</td>
<td>Hệ quản lý học tập — công bố ghi danh</td>
<td>Ra</td>
<td>Lượt ghi danh đã xác nhận và lượt rút</td>
<td>Trong vòng 5 phút kể từ khi thay đổi</td>
</tr>
<tr>
<td>SI-7</td>
<td>Hệ quản lý học tập — nhập điểm</td>
<td>Vào</td>
<td>Điểm cuối kỳ theo từng sinh viên, từng lớp</td>
<td>Hằng đêm; kích hoạt việc đánh giá lại Prereq-9</td>
</tr>
<tr>
<td>SI-8</td>
<td>Dịch vụ thông báo — tin nhắn cho sinh viên và nhân viên</td>
<td>Ra</td>
<td>Mở đợt, kết quả vượt sĩ số, lời mời danh sách chờ, việc huỷ lớp</td>
<td>Trong vòng 5 phút kể từ sự kiện kích hoạt</td>
</tr>
</tbody>
</table>
<p><strong>SI-2 và SI-3 phải được cô lập sau một lớp adapter</strong> sao cho một API đồng bộ và một lượt
trao đổi tệp theo đêm thay thế được cho nhau (CO-7, rủi ro RI-1).</p>
<h3>5.3 Giao tiếp phần cứng</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Yêu cầu</th>
</tr>
</thead>
<tbody>
<tr>
<td>HI-1</td>
<td>Hệ thống không được đòi hỏi phần cứng chuyên dụng nào.</td>
</tr>
<tr>
<td>HI-2</td>
<td>Hệ thống phải hoạt động được trên các thiết bị cá nhân của sinh viên đang dùng phổ biến tại NRU, kể cả thiết bị đã bốn năm tuổi trên kết nối 3G (OE-4).</td>
</tr>
</tbody>
</table>
<h3>5.4 Giao tiếp truyền thông</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Yêu cầu</th>
</tr>
</thead>
<tbody>
<tr>
<td>CI-1</td>
<td>Mọi liên lạc giữa trình duyệt và CARS phải dùng HTTPS với TLS 1.2 trở lên.</td>
</tr>
<tr>
<td>CI-2</td>
<td>Mọi liên lạc giữa CARS và bất kỳ hệ thống ngoài nào phải dùng HTTPS với TLS 1.2 trở lên.</td>
</tr>
<tr>
<td>CI-3</td>
<td>Hệ thống không được đặt mã định danh sinh viên và dữ liệu cá nhân nào vào chuỗi truy vấn của URL, vốn được ghi vào nhật ký truy cập.</td>
</tr>
<tr>
<td>CI-4</td>
<td>Thông báo không được chứa số tiền nào và ghi chú tư vấn nào; chúng phải dẫn tới màn hình đã xác thực thay vì chứa nội dung đó.</td>
</tr>
</tbody>
</table>
<hr />
<h3>6. Thuộc tính chất lượng</h3>
<p>Viết bằng Planguage: SCALE, METER, MUST, PLAN. Một thuộc tính không có con số là một ý
kiến, không phải một yêu cầu.</p>
<h3>6.1 Hiệu năng và khả năng mở rộng</h3>
<h4>QA-1 — Tải đăng ký đồng thời ở mức đỉnh</h4>
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
<td>Số phiên đã xác thực đồng thời chịu được với percentile 95 phản hồi ≤ 2 giây trên các màn hình danh mục, lập kế hoạch và ghi danh</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Thử tải ở buổi tổng duyệt, rồi quan sát khi chạy thật</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>4.200 phiên đồng thời — mức đỉnh lịch sử mà hệ cũ không phục vụ nổi</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>6.000 phiên đồng thời (mục tiêu BO-1)</td>
</tr>
<tr>
<td><strong>Lý do</strong></td>
<td>Hệ cũ xuống cấp từ mốc 1.800 và sập ở ba trên bốn cửa sổ gần nhất. Đây là con số duy nhất mà dự án bị đem ra đánh giá.</td>
</tr>
</tbody>
</table>
<h4>QA-2 — Độ trễ của giao dịch ghi danh</h4>
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
<td>Số giây từ lúc sinh viên gửi yêu cầu ghi danh tới lúc nhận được quyết định</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Đo bằng công cụ đo thời gian, percentile 95, theo từng lần mở đợt</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 4 giây ở mức đỉnh</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 1,5 giây ở mức đỉnh; ≤ 0,8 giây ngoài mức đỉnh</td>
</tr>
<tr>
<td><strong>Lý do</strong></td>
<td>Bảy lượt đánh giá luật và một lần chiếm chỗ diễn ra bên trong con số này. Một quyết định chậm lúc mở đợt sẽ sinh ra các lần thử lại, và chúng nhân lên chính cái tải đã gây ra nó.</td>
</tr>
</tbody>
</table>
<h4>QA-3 — Thông lượng đọc danh mục</h4>
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
<td>Số lượt đọc danh mục phục vụ được mỗi giây với percentile 95 phản hồi ≤ 1 giây</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Thử tải ở mức 1,5 lần đỉnh dự phóng</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>2.800 lượt đọc/giây</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>4.200 lượt đọc/giây</td>
</tr>
<tr>
<td><strong>Lý do</strong></td>
<td>Sản lượng nằm ở việc duyệt, không nằm ở việc ghi danh (UC-01). Hệ cũ tính lại sĩ số cho từng dòng ở từng lượt yêu cầu; Catalog-3 cho phép cache 60 giây đúng vì lý do này.</td>
</tr>
</tbody>
</table>
<h4>QA-4 — Tính toàn vẹn của chỗ dưới tranh chấp</h4>
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
<td>Số chỗ bị cấp cho nhiều hơn một sinh viên, hoặc bị mất mà không được cấp cho ai, trong một cửa sổ đăng ký</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Đối soát theo DA-7, cộng với kiểm thử tiêm lỗi ở mức đồng thời đỉnh</td>
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
<td><strong>Lý do</strong></td>
<td>Yêu cầu Enroll-6. Một chỗ bị cấp hai lần sẽ bị phát hiện bởi một sinh viên tới lớp và thấy phòng đã đầy, tức là thời điểm tốn kém nhất có thể để phát hiện ra nó.</td>
</tr>
</tbody>
</table>
<h3>6.2 Độ sẵn sàng và độ tin cậy</h3>
<h4>QA-5 — Độ sẵn sàng trong một cửa sổ đăng ký</h4>
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
<td>Tỉ lệ phần trăm số phút trong một cửa sổ đăng ký đang mở mà cả danh mục, lập kế hoạch và ghi danh đều khả dụng</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Giám sát uptime, theo từng cửa sổ</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>99,5%</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>100% — <strong>không lần sập nào</strong> là tiêu chí chấp nhận ở Vision and Scope §3.2</td>
</tr>
</tbody>
</table>
<h4>QA-6 — Thời gian khôi phục trong một cửa sổ</h4>
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
<td>Số phút từ lúc phát hiện một sự cố ngoài kế hoạch tới lúc việc đăng ký chạy lại được</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Diễn tập khôi phục thảm hoạ trước mỗi cửa sổ</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 30 phút mà không mất lượt ghi danh nào</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 10 phút mà không mất lượt ghi danh nào</td>
</tr>
</tbody>
</table>
<h4>QA-7 — Tính nguyên tử của các giao dịch học vụ</h4>
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
<td>Số sinh viên bị bỏ lại ở trạng thái dở dang — nửa cặp môn song hành, một lần đổi lớp mà không có lớp nào, một lần vượt sĩ số đã duyệt mà không được ghi danh cũng không được ghi nhận</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Kiểm thử tiêm lỗi cho việc ghi danh, đổi lớp và vượt sĩ số</td>
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
<h3>6.3 Khả dụng và khả năng tiếp cận</h3>
<h4>QA-8 — Ghi danh không cần hướng dẫn</h4>
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
<td>Tỉ lệ phần trăm sinh viên lần đầu hoàn tất được một lượt ghi danh mà không cần trợ giúp, ngay lần thử đầu tiên</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Buổi quan sát có 20 sinh viên năm nhất tình nguyện, trước buổi tổng duyệt</td>
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
<td><strong>Lý do</strong></td>
<td>Yêu cầu UI-5. Có 12.000 sinh viên và một cửa sổ 72 giờ; một giao diện cần hỗ trợ là một giao diện không hỗ trợ nổi.</td>
</tr>
</tbody>
</table>
<h4>QA-9 — Mức độ hiểu được của một lần từ chối</h4>
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
<td>Tỉ lệ phần trăm sinh viên bị từ chối mà nói được, không cần gợi ý, vì sao họ bị từ chối và cần làm gì tiếp theo</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Cùng buổi quan sát đó, với các kịch bản bị từ chối</td>
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
<td><strong>Lý do</strong></td>
<td>Một lần từ chối không ai hiểu sẽ trở thành một lượt hỏi cố vấn, tức là đúng cái chi phí mà mục tiêu BO-6 sinh ra để giảm.</td>
</tr>
</tbody>
</table>
<h4>QA-10 — Khả năng tiếp cận</h4>
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
<td>Mức tuân thủ đạt được so với WCAG 2.1 cho giao diện sinh viên</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Quét tự động cộng với rà soát thủ công đường ghi danh</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>Mức A, không có vấn đề gây chặn nào trên đường ghi danh</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>Mức AA</td>
</tr>
</tbody>
</table>
<h4>QA-11 — Hiệu năng trên di động</h4>
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
<td>Số giây tới lúc tương tác được với danh mục trên một máy Android tầm trung đã bốn năm tuổi, dùng kết nối 3G</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Kiểm thử trên máy tham chiếu</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 6 giây</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 3 giây</td>
</tr>
</tbody>
</table>
<h3>6.4 An ninh và quyền riêng tư</h3>
<h4>QA-12 — Việc cưỡng chế phân quyền</h4>
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
<td>Tỉ lệ phần trăm các thao tác có đặc quyền mà việc kiểm vai được cưỡng chế ở phía máy chủ chứ không chỉ ở giao diện</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Rà soát an ninh mọi thao tác ở mục 3 trước khi phát hành</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>100%</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>100%, kèm các phép kiểm tự động phủ việc quyết định vượt sĩ số (BR-11), quản lý khoá chặn và cấu hình cửa sổ</td>
</tr>
</tbody>
</table>
<h4>QA-13 — Cách ly dữ liệu giữa các sinh viên</h4>
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
<td>Số lượt yêu cầu mà một sinh viên lấy được bảng điểm, bản kiểm tra tiến độ, ghi chú tư vấn hay dữ liệu tài chính của sinh viên khác</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Kiểm thử xâm nhập mọi endpoint hướng tới sinh viên, kể cả việc thay thế mã định danh</td>
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
<h4>QA-14 — Tính đầy đủ của vết kiểm toán</h4>
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
<td>Tỉ lệ phần trăm các quyết định ghi danh, quyết định vượt sĩ số và thay đổi khoá chặn mà truy xuất được người làm, thời điểm và lý do</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Lấy mẫu 50 bản ghi mỗi loại trong quá trình thẩm định yêu cầu</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>100%</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>100%, truy xuất được trong vòng 5 giây</td>
</tr>
</tbody>
</table>
<h3>6.5 Khả năng bảo trì</h3>
<h4>QA-15 — Chi phí của một lần đổi quy chế</h4>
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
<td>Số ngày làm việc để áp một thay đổi lên bất kỳ luật nào được đánh dấu Động ở R3 §2.2, cho năm quy chế kế tiếp, mà không cần ra bản phần mềm mới</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Đo khi áp Quy chế học vụ 2027</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 3 ngày, không sửa mã</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 1 ngày (ràng buộc CO-5, CO-6)</td>
</tr>
<tr>
<td><strong>Lý do</strong></td>
<td>Quy chế được sửa hằng năm. Một hệ thống cần ra bản mới mới hấp thụ nổi điều đó sẽ lạc hậu trong vòng một năm kể từ lúc chạy thật.</td>
</tr>
</tbody>
</table>
<hr />
<h3>7. Yêu cầu quốc tế hoá và bản địa hoá</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Yêu cầu</th>
</tr>
</thead>
<tbody>
<tr>
<td>IL-1</td>
<td>Hệ thống phải trình bày các giao diện hướng tới sinh viên bằng tiếng Việt, kèm tiếng Anh cho các chương trình dạy bằng tiếng Anh.</td>
</tr>
<tr>
<td>IL-2</td>
<td>Hệ thống phải nhận và lưu được dấu tiếng Việt ở mọi trường tên, và phải sắp xếp văn bản tiếng Việt theo luật đối chiếu tiếng Việt.</td>
</tr>
<tr>
<td>IL-3</td>
<td>Hệ thống phải trình bày ngày theo dạng DD/MM/YYYY và giờ theo dạng 24 giờ.</td>
</tr>
<tr>
<td>IL-4</td>
<td>Hệ thống phải trình bày số tiền theo đồng Việt Nam, không có phần thập phân.</td>
</tr>
<tr>
<td>IL-5</td>
<td>Hệ thống phải lưu mọi dấu thời gian kèm độ lệch UTC tường minh và trình bày theo múi Asia/Ho_Chi_Minh.</td>
</tr>
</tbody>
</table>
<hr />
<h3>8. Yêu cầu khác</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Yêu cầu</th>
</tr>
</thead>
<tbody>
<tr>
<td>OR-1</td>
<td>Hệ thống phải lưu giữ và xoá dữ liệu cá nhân theo đúng Nghị định 13/2023/NĐ-CP và lịch lưu trữ hồ sơ của trường (DA-4 tới DA-6).</td>
</tr>
<tr>
<td>OR-2</td>
<td>Hệ thống phải cài đặt được vào một môi trường mới từ cấu hình đã đưa vào quản lý phiên bản, không có bước thủ công nào chưa được tài liệu hoá.</td>
</tr>
<tr>
<td>OR-3</td>
<td>Hệ thống phải được bàn giao kèm một sổ tay vận hành phủ việc mở cửa sổ, các sự cố về tải và phương án ghi danh thủ công dự phòng.</td>
</tr>
<tr>
<td>OR-4</td>
<td>Việc chuyển đổi dữ liệu ở DA-1 phải lặp lại được trên một môi trường không phải production mà không còn dư lại gì từ các lần chạy trước.</td>
</tr>
<tr>
<td>OR-5</td>
<td>Hệ thống phải cung cấp một phương án dự phòng thủ công đã được tài liệu hoá, cho phép Nhân viên học vụ ghi nhận một lượt ghi danh đơn lẻ trong lúc có sự cố, có đối soát về sau.</td>
</tr>
</tbody>
</table>
<hr />
<h2>Phụ lục A: Bảng thuật ngữ</h2>
<table>
<thead>
<tr>
<th>Thuật ngữ</th>
<th>Định nghĩa</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Add/drop period</strong> — Đợt thêm/bớt môn</td>
<td>Giai đoạn sau một cửa sổ, trong đó sinh viên được rút mà không để lại dấu trên bảng điểm; BR-16</td>
</tr>
<tr>
<td><strong>Advising hold</strong> — Khoá chặn cố vấn</td>
<td>Một khoá chặn ngăn ghi danh cho tới khi cố vấn gỡ nó; BR-14</td>
</tr>
<tr>
<td><strong>Catalog year</strong> — Năm quy chế</td>
<td>Năm học mà sinh viên được đánh giá theo quy chế của năm đó; CO-6</td>
</tr>
<tr>
<td><strong>Co-requisite</strong> — Môn song hành</td>
<td>Môn phải học trong cùng học kỳ với một môn khác; BR-20</td>
</tr>
<tr>
<td><strong>Credit limit</strong> — Trần tín chỉ</td>
<td>Số tín chỉ tối đa sinh viên được ghi danh mỗi học kỳ; BR-04</td>
</tr>
<tr>
<td><strong>Degree audit</strong> — Kiểm tra tiến độ tốt nghiệp</td>
<td>Việc đánh giá hồ sơ của sinh viên theo các điều kiện của chương trình họ học</td>
</tr>
<tr>
<td><strong>Minimum viable enrollment</strong> — Sĩ số tối thiểu duy trì được</td>
<td>Mức sĩ số mà dưới đó lớp bị coi là không đủ sĩ số; BR-15</td>
</tr>
<tr>
<td><strong>Override</strong> — Vượt sĩ số</td>
<td>Việc cho phép sinh viên vào một lớp mà bình thường họ không vào được; UC-06</td>
</tr>
<tr>
<td><strong>Prerequisite</strong> — Môn tiên quyết</td>
<td>Môn phải hoàn thành trước một môn khác; BR-02</td>
</tr>
<tr>
<td><strong>Priority wave</strong> — Đợt ưu tiên</td>
<td>Khoảng thời gian mở đăng ký của một nhóm sinh viên; BR-06</td>
</tr>
<tr>
<td><strong>Registration window</strong> — Cửa sổ đăng ký</td>
<td>Khoảng 72 giờ mà việc đăng ký được mở</td>
</tr>
<tr>
<td><strong>Remaining capacity</strong> — Sĩ số còn lại</td>
<td>Số chỗ vẫn còn trong một lớp; BR-03</td>
</tr>
<tr>
<td><strong>Section</strong> — Lớp học phần</td>
<td>Một lần mở lớp theo lịch của một môn trong một học kỳ</td>
</tr>
<tr>
<td><strong>Waitlist</strong> — Danh sách chờ</td>
<td>Hàng chờ của một lớp đã đầy; BR-08, BR-09</td>
</tr>
</tbody>
</table>
<h2>Phụ lục B: Mô hình phân tích</h2>
<table>
<thead>
<tr>
<th>Hình</th>
<th>Mô hình</th>
<th>Vị trí</th>
</tr>
</thead>
<tbody>
<tr>
<td>B-1</td>
<td>Context diagram của hệ thống</td>
<td><code>diagrams/use-case-diagram.png</code> (ranh giới và các actor ngoài)</td>
</tr>
<tr>
<td>B-2</td>
<td>Mô hình dữ liệu logic (ERD)</td>
<td><em>sẽ dựng ở khâu thiết kế; thực thể và quan hệ liệt kê ở §4.1</em></td>
</tr>
<tr>
<td>B-3</td>
<td>Use case diagram</td>
<td><code>diagrams/use-case-diagram.png</code> · bản nguồn sửa được <code>diagrams/use-case-diagram.drawio</code></td>
</tr>
<tr>
<td>B-4</td>
<td>Mô hình trạng thái của lượt ghi danh</td>
<td>Các trạng thái liệt kê ở mục <em>Enrollment Status</em> trong Data Dictionary; chuyển tiếp cho bởi hậu điều kiện của các use case</td>
</tr>
<tr>
<td>B-5</td>
<td>Mô hình trạng thái của yêu cầu vượt sĩ số</td>
<td>Các trạng thái liệt kê ở mục <em>Request Status</em>; chuyển tiếp cho bởi UC-06</td>
</tr>
<tr>
<td>B-6</td>
<td>Mock-up màn hình</td>
<td><code>mockups/</code> — xem R5</td>
</tr>
</tbody>
</table>
<h2>Phụ lục C: Danh sách TBD</h2>
<table>
<thead>
<tr>
<th>#</th>
<th>Câu hỏi còn treo</th>
<th>Ảnh hưởng tới</th>
<th>Người chịu trách nhiệm</th>
<th>Hạn</th>
</tr>
</thead>
<tbody>
<tr>
<td>TBD-1</td>
<td>Trần tín chỉ ở BR-04 có tính các môn học lại đang trong tiến trình không, hay chỉ tính các lượt ghi danh mới?</td>
<td>Enroll-5</td>
<td>Phòng Đào tạo</td>
<td>Tuần 6</td>
</tr>
<tr>
<td>TBD-2</td>
<td>SLA 48 giờ ở BR-12 là giờ làm việc hay giờ theo lịch?</td>
<td>Override-3, Override-6</td>
<td>Phòng Đào tạo</td>
<td>Tuần 6</td>
</tr>
<tr>
<td>TBD-3</td>
<td>Khi một cặp môn song hành bị phá vỡ do huỷ lớp, lớp còn lại bị tự động rút hay chuyển cho cố vấn xử lý?</td>
<td>Drop-4, Viability-3</td>
<td>Phòng Đào tạo</td>
<td>Tuần 7</td>
</tr>
<tr>
<td>TBD-4</td>
<td>Ngưỡng tài chính ở BR-05 áp theo từng học kỳ hay cộng dồn?</td>
<td>Finance-1</td>
<td>Cán bộ Tài chính</td>
<td>Tuần 7</td>
</tr>
<tr>
<td>TBD-5</td>
<td>Những ngành nào không diễn đạt được thành luật máy đánh giá được, và chúng ảnh hưởng tới bao nhiêu sinh viên?</td>
<td>Prereq-5, giả định A2</td>
<td>Phòng Đào tạo, các hội đồng chương trình</td>
<td>Tuần 8 — <strong>chặn cam kết BO-2</strong></td>
</tr>
</tbody>
</table>
<h2>Phụ lục D: Ma trận truy vết yêu cầu</h2>
<table>
<thead>
<tr>
<th>Tính năng (R1 §2.1)</th>
<th>Mục SRS</th>
<th>Use case (R2)</th>
<th>Yêu cầu chức năng</th>
<th>Business rule (R3)</th>
<th>Mục tiêu</th>
</tr>
</thead>
<tbody>
<tr>
<td>FE-1 Tra cứu danh mục</td>
<td>3.1</td>
<td>UC-01</td>
<td>Catalog-1 … Catalog-7</td>
<td>BR-03, BR-06</td>
<td>BO-1</td>
</tr>
<tr>
<td>FE-2 Lập kế hoạch thời khoá biểu</td>
<td>3.2</td>
<td>UC-02</td>
<td>Plan-1 … Plan-7</td>
<td>BR-02, BR-04, BR-07, BR-14, BR-20</td>
<td>BO-1</td>
</tr>
<tr>
<td>FE-3 Giao dịch ghi danh</td>
<td>3.3</td>
<td>UC-03</td>
<td>Enroll-1 … Enroll-10</td>
<td>BR-01, BR-03, BR-04, BR-06, BR-07, BR-14, BR-20</td>
<td>BO-1, BO-2, BO-4</td>
</tr>
<tr>
<td>FE-4 Bộ luật môn tiên quyết</td>
<td>3.4</td>
<td>UC-04</td>
<td>Prereq-1 … Prereq-9</td>
<td>BR-02, BR-20</td>
<td>BO-2</td>
</tr>
<tr>
<td>FE-5 Điều kiện tài chính</td>
<td>3.5</td>
<td>UC-05</td>
<td>Finance-1 … Finance-7</td>
<td>BR-05, BR-17</td>
<td>BO-4</td>
</tr>
<tr>
<td>FE-6 Quy trình vượt sĩ số</td>
<td>3.6</td>
<td>UC-06</td>
<td>Override-1 … Override-9</td>
<td>BR-02, BR-03, BR-11, BR-12</td>
<td>BO-3</td>
</tr>
<tr>
<td>FE-7 Danh sách chờ</td>
<td>3.7</td>
<td>UC-07</td>
<td>Wait-1 … Wait-8</td>
<td>BR-03, BR-07, BR-08, BR-09</td>
<td>BO-3</td>
</tr>
<tr>
<td>FE-8 Rút và đổi lớp</td>
<td>3.8</td>
<td>UC-08</td>
<td>Drop-1 … Drop-6</td>
<td>BR-04, BR-07, BR-08, BR-16, BR-20</td>
<td>—</td>
</tr>
<tr>
<td>FE-9 Kiểm tra tiến độ tốt nghiệp</td>
<td>3.9</td>
<td>UC-09</td>
<td>Audit-1 … Audit-10</td>
<td>BR-02, BR-13, BR-18, BR-20</td>
<td>BO-6</td>
</tr>
<tr>
<td>FE-10 Số dư tài khoản</td>
<td>3.10</td>
<td>UC-10</td>
<td>Account-1 … Account-6</td>
<td>BR-05, BR-17</td>
<td>BO-6</td>
</tr>
<tr>
<td>FE-11 Khả năng duy trì lớp</td>
<td>3.11</td>
<td>UC-11</td>
<td>Viability-1 … Viability-8</td>
<td>BR-07, BR-10, BR-15, BR-18, BR-19</td>
<td>BO-5</td>
</tr>
<tr>
<td>FE-12 Quản trị cửa sổ đăng ký</td>
<td>3.12</td>
<td>UC-12</td>
<td>Window-1 … Window-8</td>
<td>BR-06</td>
<td>BO-1</td>
</tr>
</tbody>
</table></div>`,
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
    `<div class="ml-en"><h2>Data Dictionary</h2>
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
their age rather than hidden or replaced with zero.</p></div>
<div class="ml-vi"><h2>Từ điển dữ liệu</h2>
<h2>cho Hệ thống Học vụ và Đăng ký môn (CARS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên thành viên 4&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Northern Regional University (NRU)
Cập nhật lần cuối 17 tháng 9 năm 2026</p>
<hr />
<h3>Lịch sử sửa đổi</h3>
<table>
<thead>
<tr>
<th>Người</th>
<th>Ngày</th>
<th>Lý do sửa</th>
<th>Phiên bản</th>
</tr>
</thead>
<tbody>
<tr>
<td>Thành viên 4, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Thu thập phần tử trong lúc viết use case UC-01…UC-14</td>
<td>0.9</td>
</tr>
<tr>
<td>Thành viên 4, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Hoàn thiện các cấu trúc, đối chiếu chéo với business rule</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Ký pháp</h3>
<p>Theo <em>Guidance for Data Dictionaries</em> (Wiegers &amp; Beatty, chương 13):</p>
<table>
<thead>
<tr>
<th>Ký hiệu</th>
<th>Nghĩa</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>+</code></td>
<td>gồm có / và</td>
</tr>
<tr>
<td><code>( )</code></td>
<td>phần tử tuỳ chọn</td>
</tr>
<tr>
<td><code>{ }</code></td>
<td>nhóm lặp lại</td>
</tr>
<tr>
<td><code>min:max</code></td>
<td>số lần lặp cho phép; <code>n</code> nghĩa là không giới hạn</td>
</tr>
<tr>
<td><code>[ a \\| b ]</code></td>
<td>chọn một trong các phương án</td>
</tr>
<tr>
<td><code>" "</code></td>
<td>chuỗi ký tự nguyên văn</td>
</tr>
</tbody>
</table>
<p>Các mục xếp theo <strong>thứ tự bảng chữ cái</strong> (theo tên tiếng Anh, vì đó là tên dùng trong
đặc tả). Các cấu trúc để trống cột <em>Độ dài</em> và <em>Giá trị</em>. Mọi phần tử được gọi tên bên
trong một cấu trúc đều có <strong>mục riêng của nó</strong>. Chỗ nào giá trị bị một business rule chi
phối thì cột <em>Giá trị</em> trích mã luật chứ không chép lại nội dung luật.</p>
<hr />
<h3>2. Từ điển dữ liệu</h3>
<table>
<thead>
<tr>
<th>Phần tử dữ liệu</th>
<th>Mô tả</th>
<th>Cấu thành hoặc kiểu dữ liệu</th>
<th>Độ dài</th>
<th>Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td>Advice Notes</td>
<td>Nội dung cố vấn ghi lại trong một buổi tư vấn</td>
<td>chữ và số</td>
<td>4000</td>
<td>Cố vấn và các cố vấn khác của sinh viên xem được; sinh viên <strong>không</strong> xem được (UC-13 luồng 13.4)</td>
</tr>
<tr>
<td>Advising Hold</td>
<td>Khoá chặn đặt lên một sinh viên, ngăn ghi danh cho tới khi cố vấn gỡ</td>
<td>Hold Identifier + Student Identifier + Hold Reason + Placed By + Placed At + (Expires At) + (Lifted By) + (Lifted At)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Advising Record</td>
<td>Bản ghi của một buổi tư vấn</td>
<td>Record Identifier + Student Identifier + Advisor Identifier + Meeting Date + Advice Notes</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Advisor Identifier</td>
<td>Mã định danh duy nhất của một cố vấn học tập</td>
<td>chữ và số</td>
<td>12</td>
<td>Phải tồn tại dưới dạng một hồ sơ nhân sự</td>
</tr>
<tr>
<td>Catalog Year</td>
<td>Năm học mà sinh viên được đánh giá theo quy chế của năm đó</td>
<td>số, YYYY</td>
<td>4</td>
<td>Đặt lúc nhập học và không bao giờ đổi; chi phối BR-02, BR-04 và BR-13 (UC-09 ngoại lệ 9.0.E2)</td>
</tr>
<tr>
<td>Completion Percentage</td>
<td>Tỉ lệ chương trình mà sinh viên đã hoàn thành</td>
<td>số thập phân</td>
<td>5</td>
<td>0,00–100,00; tính theo BR-13</td>
</tr>
<tr>
<td>Corequisite Course Code</td>
<td>Môn phải học trong cùng học kỳ với một môn khác</td>
<td>chữ và số</td>
<td>12</td>
<td>Phải tồn tại dưới dạng một Course Code; xem BR-20</td>
</tr>
<tr>
<td>Course</td>
<td>Một đơn vị học tập do một khoa mở</td>
<td>Course Code + Course Title + Credits + Faculty Code + 0:n{Prerequisite Rule} + 0:n{Corequisite Course Code}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Course Code</td>
<td>Mã định danh duy nhất của một môn học</td>
<td>chữ và số</td>
<td>12</td>
<td>Định dạng: ba tới bốn chữ cái rồi ba chữ số, ví dụ SWR302</td>
</tr>
<tr>
<td>Course Title</td>
<td>Tên môn học đọc được</td>
<td>chữ và số</td>
<td>200</td>
<td>Không để trống</td>
</tr>
<tr>
<td>Credits</td>
<td>Số tín chỉ của một môn</td>
<td>số nguyên</td>
<td>2</td>
<td>1–6</td>
</tr>
<tr>
<td>Credits Applied</td>
<td>Số tín chỉ được tính cho một nhóm điều kiện</td>
<td>số nguyên</td>
<td>3</td>
<td>≥ 0</td>
</tr>
<tr>
<td>Credits Earned</td>
<td>Số tín chỉ sinh viên đạt được từ một môn đã hoàn thành</td>
<td>số nguyên</td>
<td>2</td>
<td>Bằng 0 nếu môn đó trượt</td>
</tr>
<tr>
<td>Credits Required</td>
<td>Số tín chỉ mà một nhóm điều kiện yêu cầu</td>
<td>số nguyên</td>
<td>3</td>
<td>&gt; 0</td>
</tr>
<tr>
<td>Day Of Week</td>
<td>Ngày trong tuần lớp học</td>
<td>chữ cái</td>
<td>10</td>
<td>[ Monday | Tuesday | Wednesday | Thursday | Friday | Saturday ]</td>
</tr>
<tr>
<td>Decided At</td>
<td>Thời điểm một quyết định vượt sĩ số được ghi nhận</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Để trống khi yêu cầu còn chờ; là mốc đo 48 giờ trong BR-12</td>
</tr>
<tr>
<td>Decided By</td>
<td>Trưởng bộ môn hoặc người được uỷ quyền đã quyết định vượt sĩ số</td>
<td>chữ và số</td>
<td>12</td>
<td>Phải giữ vai Trưởng bộ môn của bộ môn sở hữu lớp đó (BR-11)</td>
</tr>
<tr>
<td>Decision Reason</td>
<td>Văn bản tự do giải thích một quyết định vượt sĩ số</td>
<td>chữ và số</td>
<td>1000</td>
<td>Bắt buộc cho cả duyệt lẫn từ chối (UC-06 POST-3)</td>
</tr>
<tr>
<td>Degree Audit Result</td>
<td>Trạng thái đã đánh giá của tiến độ sinh viên với chương trình của mình</td>
<td>Student Identifier + Programme Code + Catalog Year + Completion Percentage + 1:n{Requirement Group Result}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Eligibility Rule</td>
<td>Biểu thức xác định sinh viên nào thuộc một đợt ưu tiên</td>
<td>chữ và số</td>
<td>500</td>
<td>Đánh giá theo Year Of Study và Programme Code; các đợt không được chồng nhau (UC-12 ngoại lệ 12.0.E2)</td>
</tr>
<tr>
<td>Email Address</td>
<td>Địa chỉ email của trường dùng để gửi thông báo</td>
<td>chữ và số</td>
<td>254</td>
<td>Phải chứa đúng một dấu "@"; giả định A6</td>
</tr>
<tr>
<td>End Time</td>
<td>Giờ kết thúc một buổi học của lớp</td>
<td>giờ, HH:MM</td>
<td>5</td>
<td>Muộn hơn Start Time</td>
</tr>
<tr>
<td>Enrolled At</td>
<td>Thời điểm một lượt ghi danh được ghi nhận</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Enrollment</td>
<td>Việc một sinh viên đăng ký vào một lớp</td>
<td>Enrollment Identifier + Student Identifier + Section Identifier + Enrollment Status + Enrolled At + (Override Request Identifier)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Enrollment Identifier</td>
<td>Mã định danh duy nhất của một lượt ghi danh</td>
<td>chữ và số</td>
<td>20</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Enrollment Status</td>
<td>Trạng thái hiện tại của một lượt ghi danh</td>
<td>chữ cái</td>
<td>14</td>
<td>[ Enrolled | Dropped | Withdrawn | Cancelled | Invalidated ]; Invalidated sinh ra từ UC-04 ngoại lệ 4.0.E3</td>
</tr>
<tr>
<td>Expires At</td>
<td>Thời điểm một khoá chặn hoặc một lời mời hết hiệu lực</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Với lời mời danh sách chờ là 24 giờ sau khi phát ra (BR-09)</td>
</tr>
<tr>
<td>Faculty Code</td>
<td>Mã của khoa sở hữu một môn học hoặc một ngành</td>
<td>chữ và số</td>
<td>8</td>
<td>Một trong sáu khoa của NRU</td>
</tr>
<tr>
<td>Final Grade</td>
<td>Điểm được cấp cho một môn đã hoàn thành</td>
<td>chữ và số</td>
<td>4</td>
<td>[ A | B+ | B | C+ | C | D+ | D | F | P | W ]; đem so với Minimum Grade cho BR-02</td>
</tr>
<tr>
<td>Financial Standing</td>
<td>Tình trạng tài chính của sinh viên do hệ thống tài chính báo về</td>
<td>Student Identifier + Outstanding Balance + Finance Hold Flag + Retrieved At</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Finance Hold Flag</td>
<td>Hệ thống tài chính có đặt khoá chặn đăng ký tường minh hay không</td>
<td>chữ cái</td>
<td>3</td>
<td>[ Yes | No ]; chặn ghi danh bất kể số dư là bao nhiêu (BR-05)</td>
</tr>
<tr>
<td>Full Name</td>
<td>Họ tên sinh viên như đã ghi lúc nhập học</td>
<td>chữ cái</td>
<td>100</td>
<td>Không để trống; lưu được dấu tiếng Việt</td>
</tr>
<tr>
<td>Group Name</td>
<td>Tên của một nhóm điều kiện trong một chương trình</td>
<td>chữ và số</td>
<td>100</td>
<td>Ví dụ "Cơ sở ngành", "Tự chọn chuyên ngành", "Đại cương"</td>
</tr>
<tr>
<td>Group Status</td>
<td>Trạng thái đã đánh giá của một nhóm điều kiện</td>
<td>chữ cái</td>
<td>14</td>
<td>[ Satisfied | InProgress | Outstanding | NeedsReview ]; NeedsReview theo UC-09 POST-3</td>
</tr>
<tr>
<td>Group Type</td>
<td>Loại nhóm điều kiện</td>
<td>chữ cái</td>
<td>14</td>
<td>[ Core | Major | Elective | General | CreditTotal ]</td>
</tr>
<tr>
<td>Hold Identifier</td>
<td>Mã định danh duy nhất của một khoá chặn cố vấn</td>
<td>chữ và số</td>
<td>20</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Hold Reason</td>
<td>Phân loại và lời giải thích của một khoá chặn cố vấn</td>
<td>chữ và số</td>
<td>500</td>
<td>Sinh viên thấy được phần phân loại; không thấy lời giải thích (UC-13 luồng 13.4)</td>
</tr>
<tr>
<td>Joined At</td>
<td>Thời điểm sinh viên vào danh sách chờ</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Quyết định vị trí trong hàng chờ, bên trong cùng một đợt ưu tiên</td>
</tr>
<tr>
<td>Justification</td>
<td>Lý do sinh viên nêu ra khi xin vượt sĩ số</td>
<td>chữ và số</td>
<td>1000</td>
<td>Bắt buộc; hiện cho Trưởng bộ môn ở UC-06 bước 4</td>
</tr>
<tr>
<td>Lecturer Name</td>
<td>Tên giảng viên dạy lớp</td>
<td>chữ cái</td>
<td>100</td>
<td>Do hệ thống thời khoá biểu cung cấp</td>
</tr>
<tr>
<td>Lifted At</td>
<td>Thời điểm một khoá chặn cố vấn được gỡ</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Để trống khi khoá chặn còn hiệu lực</td>
</tr>
<tr>
<td>Lifted By</td>
<td>Cố vấn đã gỡ khoá chặn</td>
<td>chữ và số</td>
<td>12</td>
<td>Phải là cố vấn được phân công cho sinh viên đó</td>
</tr>
<tr>
<td>Meeting Date</td>
<td>Ngày diễn ra buổi tư vấn</td>
<td>ngày, YYYY-MM-DD</td>
<td>10</td>
<td>Không được ở tương lai</td>
</tr>
<tr>
<td>Meeting Pattern</td>
<td>Một buổi học theo lịch của một lớp</td>
<td>Day Of Week + Start Time + End Time + Room Code</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Minimum Grade</td>
<td>Mức điểm thấp nhất thoả một môn tiên quyết</td>
<td>chữ và số</td>
<td>4</td>
<td>Một giá trị của Final Grade; mặc định "D"</td>
</tr>
<tr>
<td>Minimum Viable Enrollment</td>
<td>Mức sĩ số mà dưới đó lớp bị coi là không đủ sĩ số</td>
<td>số nguyên</td>
<td>3</td>
<td>Mặc định 15, cấu hình được theo khoa và theo lớp (BR-15)</td>
</tr>
<tr>
<td>Outstanding Balance</td>
<td>Số tiền sinh viên đang nợ</td>
<td>số thập phân, VND</td>
<td>12</td>
<td>≥ 0; đem so với ngưỡng đăng ký trong BR-05</td>
</tr>
<tr>
<td>Override Request</td>
<td>Yêu cầu của sinh viên xin một chỗ trong lớp mà bình thường họ không vào được</td>
<td>Override Request Identifier + Student Identifier + Section Identifier + Request Ground + Justification + Submitted At + Request Status + (Decided By) + (Decided At) + (Decision Reason)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Override Request Identifier</td>
<td>Mã định danh duy nhất của một yêu cầu vượt sĩ số</td>
<td>chữ và số</td>
<td>20</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Placed At</td>
<td>Thời điểm một khoá chặn cố vấn được đặt</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Placed By</td>
<td>Cố vấn hoặc cán bộ phòng đào tạo đã đặt khoá chặn</td>
<td>chữ và số</td>
<td>12</td>
<td>Phải giữ một vai có thẩm quyền</td>
</tr>
<tr>
<td>Prerequisite Course Code</td>
<td>Môn phải hoàn thành trước một môn khác</td>
<td>chữ và số</td>
<td>12</td>
<td>Phải tồn tại dưới dạng một Course Code</td>
</tr>
<tr>
<td>Prerequisite Rule</td>
<td>Một điều kiện tiên quyết gắn vào một môn học</td>
<td>Prerequisite Course Code + Minimum Grade</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Priority Wave</td>
<td>Khoảng thời gian mở đăng ký của một nhóm sinh viên</td>
<td>Wave Name + Wave Start + Wave End + Eligibility Rule</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Programme</td>
<td>Một chương trình đào tạo mà sinh viên theo học</td>
<td>Programme Code + Programme Name + Faculty Code + Total Credits Required + 1:n{Requirement Group}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Programme Code</td>
<td>Mã định danh duy nhất của một chương trình đào tạo</td>
<td>chữ và số</td>
<td>12</td>
<td>Được phiên bản hoá theo Catalog Year</td>
</tr>
<tr>
<td>Programme Name</td>
<td>Tên chương trình đào tạo đọc được</td>
<td>chữ và số</td>
<td>200</td>
<td>Không để trống</td>
</tr>
<tr>
<td>Published Capacity</td>
<td>Số chỗ một lớp mở ra</td>
<td>số nguyên</td>
<td>4</td>
<td>&gt; 0; dùng trong BR-03</td>
</tr>
<tr>
<td>Queue Position</td>
<td>Vị trí của sinh viên trong một danh sách chờ</td>
<td>số nguyên</td>
<td>4</td>
<td>≥ 1; gán theo Joined At bên trong đợt ưu tiên; không bao giờ bị đổi trừ trường hợp ở UC-07</td>
</tr>
<tr>
<td>Record Identifier</td>
<td>Mã định danh duy nhất của một bản ghi tư vấn</td>
<td>chữ và số</td>
<td>20</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Request Ground</td>
<td>Căn cứ để xin vượt sĩ số</td>
<td>chữ cái</td>
<td>20</td>
<td>[ SectionFull | PrerequisiteUnmet | TimetableNecessity ]</td>
</tr>
<tr>
<td>Request Status</td>
<td>Trạng thái hiện tại của một yêu cầu vượt sĩ số</td>
<td>chữ cái</td>
<td>12</td>
<td>[ Pending | Approved | Declined | Expired | Withdrawn | Void ]; một yêu cầu không bao giờ rời trạng thái Pending một cách âm thầm (UC-06 POST-1)</td>
</tr>
<tr>
<td>Requirement Group</td>
<td>Một nhóm điều kiện của chương trình</td>
<td>Group Name + Group Type + Credits Required + 1:n{Course Code}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Requirement Group Result</td>
<td>Trạng thái đã đánh giá của một nhóm điều kiện với một sinh viên</td>
<td>Group Name + Group Status + Credits Applied + 1:n{Course Code}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Retrieved At</td>
<td>Thời điểm dữ liệu tài chính được đọc về từ hệ thống tài chính</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Hiển thị kèm với các con số (UC-10 POST-3)</td>
</tr>
<tr>
<td>Room Code</td>
<td>Mã phòng học nơi lớp diễn ra</td>
<td>chữ và số</td>
<td>12</td>
<td>Do hệ thống thời khoá biểu cung cấp; CARS không bao giờ sửa nó (EX-3)</td>
</tr>
<tr>
<td>Section</td>
<td>Một lần mở lớp theo lịch của một môn trong một học kỳ</td>
<td>Section Identifier + Course Code + Semester Code + Lecturer Name + Published Capacity + Minimum Viable Enrollment + Section Status + 1:n{Meeting Pattern}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Section Identifier</td>
<td>Mã định danh duy nhất của một lớp học phần</td>
<td>chữ và số</td>
<td>20</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Section Status</td>
<td>Trạng thái hiện tại của một lớp</td>
<td>chữ cái</td>
<td>14</td>
<td>[ Planned | Open | Full | Cancelled | Closed ]</td>
</tr>
<tr>
<td>Semester Code</td>
<td>Mã của một học kỳ</td>
<td>chữ và số</td>
<td>10</td>
<td>Định dạng YYYY-S, ví dụ 2026-1</td>
</tr>
<tr>
<td>Start Time</td>
<td>Giờ bắt đầu một buổi học của lớp</td>
<td>giờ, HH:MM</td>
<td>5</td>
<td>Sớm hơn End Time</td>
</tr>
<tr>
<td>Student</td>
<td>Một người đang theo học một chương trình tại trường</td>
<td>Student Identifier + Full Name + Email Address + Programme Code + Catalog Year + Year Of Study + Advisor Identifier + Student Status</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Student Identifier</td>
<td>Mã định danh duy nhất của một sinh viên</td>
<td>chữ và số</td>
<td>12</td>
<td>Gán lúc nhập học; là khoá nối giữa CARS, hệ thống tài chính và hệ quản lý học tập</td>
</tr>
<tr>
<td>Student Status</td>
<td>Tình trạng theo học hiện tại của sinh viên</td>
<td>chữ cái</td>
<td>14</td>
<td>[ Active | Suspended | Graduated | Withdrawn | OnLeave ]; chỉ sinh viên Active mới được đăng ký</td>
</tr>
<tr>
<td>Submitted At</td>
<td>Thời điểm một yêu cầu vượt sĩ số được gửi</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Bắt đầu đếm đồng hồ 48 giờ trong BR-12</td>
</tr>
<tr>
<td>Total Credits Required</td>
<td>Số tín chỉ cần để hoàn thành một chương trình</td>
<td>số nguyên</td>
<td>3</td>
<td>&gt; 0; là mẫu số trong BR-13</td>
</tr>
<tr>
<td>Transcript Entry</td>
<td>Một môn đã hoàn thành trên bảng điểm của sinh viên</td>
<td>Student Identifier + Course Code + Semester Code + Final Grade + Credits Earned + (Transfer Institution)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Transfer Institution</td>
<td>Cơ sở đào tạo nơi tín chỉ được chuyển đổi từ đó</td>
<td>chữ và số</td>
<td>200</td>
<td>Chỉ có mặt với tín chỉ chuyển đổi đã được duyệt (UC-04 luồng 4.3)</td>
</tr>
<tr>
<td>Waitlist Entry</td>
<td>Vị trí của sinh viên trong danh sách chờ của một lớp</td>
<td>Waitlist Entry Identifier + Student Identifier + Section Identifier + Queue Position + Joined At + Waitlist Status + (Expires At)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Waitlist Entry Identifier</td>
<td>Mã định danh duy nhất của một mục trong danh sách chờ</td>
<td>chữ và số</td>
<td>20</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Waitlist Status</td>
<td>Trạng thái hiện tại của một mục danh sách chờ</td>
<td>chữ cái</td>
<td>12</td>
<td>[ Queued | Offered | Accepted | Declined | Expired | Removed ]</td>
</tr>
<tr>
<td>Wave End</td>
<td>Thời điểm một đợt ưu tiên đóng lại</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Muộn hơn Wave Start</td>
</tr>
<tr>
<td>Wave Name</td>
<td>Tên của một đợt ưu tiên</td>
<td>chữ và số</td>
<td>40</td>
<td>Ví dụ "Đợt 1 — năm cuối"</td>
</tr>
<tr>
<td>Wave Start</td>
<td>Thời điểm một đợt ưu tiên mở ra</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Các đợt không được chồng nhau (BR-06)</td>
</tr>
<tr>
<td>Window End</td>
<td>Thời điểm cửa sổ đăng ký đóng lại</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Muộn hơn Window Start</td>
</tr>
<tr>
<td>Window Start</td>
<td>Thời điểm cửa sổ đăng ký mở ra</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Ấn định theo lịch năm học</td>
</tr>
<tr>
<td>Year Of Study</td>
<td>Năm thứ mấy của sinh viên trong chương trình</td>
<td>số nguyên</td>
<td>1</td>
<td>1–6; quyết định đợt ưu tiên (BR-06) và trần tín chỉ (BR-04)</td>
</tr>
</tbody>
</table>
<hr />
<h3>3. Ghi chú cho vài mục đáng chú ý</h3>
<p><strong>Catalog Year</strong> là mục có hệ quả lớn nhất trong từ điển này và cũng là mục dễ bỏ sót
nhất. Sinh viên được đánh giá theo quy chế có hiệu lực lúc họ nhập học, không phải quy
chế hiện hành. Thiếu phần tử này thì mỗi lần sửa chương trình đào tạo hằng năm sẽ âm thầm
đánh giá lại toàn bộ sinh viên đang học — vừa sai, vừa không được phép theo Quy chế học
vụ §9.1. Ba luật động (BR-02, BR-04, BR-13) bắt buộc phải phiên bản hoá theo nó.</p>
<p><strong>Group Status có thêm giá trị NeedsReview</strong> chứ không chỉ có Satisfied, InProgress và
Outstanding. Ba giá trị hiển nhiên kia ép bộ xử lý phải đoán khi nó không đánh giá nổi
một điều kiện — mà một bản kiểm tra tiến độ biết đoán chính là kiểu hỏng đã sinh ra lá
đơn khiếu nại mô tả ở Vision &amp; Scope §1.1.</p>
<p><strong>Queue Position tồn tại dưới dạng dữ liệu được lưu, không phải thứ hạng tính ra.</strong> Tính
vị trí từ Joined At mỗi lần đọc sẽ tương đương — cho tới khi một sinh viên bị bỏ qua vì
không đủ điều kiện (UC-07 luồng 7.4) mà vẫn phải giữ nguyên chỗ của mình. Lưu vị trí lại
mới làm cho luật công bằng đó diễn đạt được.</p>
<p><strong>Financial Standing mang theo Retrieved At</strong> vì CARS không sở hữu dữ liệu này. Khi hệ
thống tài chính không liên lạc được (UC-10 ngoại lệ 10.0.E1), các con số vẫn được hiển
thị kèm theo độ cũ của chúng, thay vì bị giấu đi hoặc bị thay bằng số không.</p></div>`,
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
    `<div class="ml-en"><h2>Mock-ups for Complex Use Cases</h2>
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
inventing a privacy position the Registrar has not taken would be worse.</p></div>
<div class="ml-vi"><h2>Mock-up cho các use case phức tạp</h2>
<h2>cho Hệ thống Học vụ và Đăng ký môn (CARS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên thành viên 4&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Northern Regional University (NRU)
17 tháng 9 năm 2026</p>
<hr />
<h3>1. Mục đích và cách tiếp cận</h3>
<p>Theo Wiegers &amp; Beatty chương 15, đây là <strong>mock-up dùng một lần, độ trung thực thấp</strong>.
Nhiệm vụ của chúng là để một bên liên quan nói được câu "không, ý tôi không phải thế" —
chứ không phải để trông như đã hoàn thiện. Chúng cố ý để màu xám: một mock-up bóng bẩy
sẽ kéo câu chuyện sang màu sắc, và làm ban lãnh đạo tưởng hệ thống sắp xong tới nơi.</p>
<p><strong>SRS vẫn là nguồn sự thật.</strong> Chỗ nào mock-up và SRS nói khác nhau thì SRS đúng.</p>
<h3>2. Ba cái này được chọn thế nào</h3>
<p><em>Phức tạp</em> nghĩa là nhiều quyết định và nhiều trạng thái, không phải nhiều ô nhập. Các
ứng viên được xếp hạng theo: luồng thay thế + ngoại lệ + số actor tham gia:</p>
<table>
<thead>
<tr>
<th>Use case</th>
<th>Luồng thay thế</th>
<th>Ngoại lệ</th>
<th>Actor</th>
<th>Tổng</th>
<th>Được chọn</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC-03</strong> Đăng ký vào một lớp học phần</td>
<td>4</td>
<td><strong>7</strong></td>
<td>3</td>
<td><strong>14</strong></td>
<td>✅</td>
</tr>
<tr>
<td><strong>UC-06</strong> Xin và quyết định vượt sĩ số</td>
<td>4</td>
<td>5</td>
<td>4</td>
<td><strong>13</strong></td>
<td>✅</td>
</tr>
<tr>
<td><strong>UC-09</strong> Xem kiểm tra tiến độ tốt nghiệp thời gian thực</td>
<td>4</td>
<td>4</td>
<td>2</td>
<td><strong>10</strong></td>
<td>✅</td>
</tr>
<tr>
<td>UC-07 Danh sách chờ và thăng suất</td>
<td>4</td>
<td>4</td>
<td>2</td>
<td>10</td>
<td>— đã được đường từ chối của M1 phủ</td>
</tr>
<tr>
<td>UC-11 Huỷ lớp không đủ sĩ số</td>
<td>3</td>
<td>4</td>
<td>4</td>
<td>11</td>
<td>hoãn sang bản 1.2</td>
</tr>
<tr>
<td>UC-02 Dựng thời khoá biểu dự kiến</td>
<td>3</td>
<td>3</td>
<td>1</td>
<td>7</td>
<td>—</td>
</tr>
</tbody>
</table>
<p>UC-11 có điểm cao nhưng bị hoãn sang bản 1.2, nên làm bản mẫu cho nó lúc này là thiết kế
một thứ năm nay không ai dựng. UC-03 là lựa chọn hiển nhiên đứng đầu: bảy ngoại lệ, nhiều
hơn bất kỳ use case nào khác trong hệ thống, và nó chính là giao dịch mà cả dự án sinh ra
để sửa.</p>
<h3>3. Các mock-up</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Tệp</th>
<th>Use case</th>
<th>Luồng được thể hiện</th>
<th>Trạng thái</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>M1</strong></td>
<td><code>mockups/M1-UC03-register-refused.png</code></td>
<td>UC-03</td>
<td>Ngoại lệ 3.0.E1</td>
<td><strong>Từ chối</strong></td>
</tr>
<tr>
<td><strong>M2</strong></td>
<td><code>mockups/M2-UC06-override-decision.png</code></td>
<td>UC-06</td>
<td>Luồng chính 6.0 + ngoại lệ 6.0.E1</td>
<td>Màn hình người quyết định, <strong>đã quá hạn</strong></td>
</tr>
<tr>
<td><strong>M3</strong></td>
<td><code>mockups/M3-UC09-degree-audit.png</code></td>
<td>UC-09</td>
<td>Luồng chính 9.0 + luồng thay thế 9.1 + ngoại lệ 9.0.E1</td>
<td><strong>Không đánh giá được một nhóm điều kiện</strong></td>
</tr>
</tbody>
</table>
<p>Bản nguồn sửa được của từng cái là tệp <code>.html</code> tương ứng trong thư mục <code>mockups/</code>.</p>
<h3>3.1 M1 — Đăng ký bị từ chối (UC-03, ngoại lệ 3.0.E1)</h3>
<p>Thể hiện một lần <strong>bị từ chối</strong>, không phải một lần thành công, vì chính lúc từ chối mới
là lúc hệ thống này hoặc xoá bớt được một lượt sinh viên đi hỏi cố vấn, hoặc tạo thêm một
lượt. Màn hình gọi tên chính xác môn học và điểm số, liệt kê từng phép kiểm kèm kết quả,
và đánh dấu những phép kiểm <strong>chưa</strong> được chạy vì yêu cầu đã dừng từ trước đó.</p>
<p><em>Quyết định thiết kế đem đi hỏi:</em> (1) hiện đủ bảng kiểm để sinh viên thấy cái gì đã được
đánh giá và cái gì chưa; (2) gọi tên môn học và điểm cụ thể thay vì câu "chưa đạt môn tiên
quyết" — đó là câu hệ cũ nói, và lần nào nó cũng sinh ra một cuộc gọi điện.</p>
<p><em>Hiện thực:</em> Enroll-1 … Enroll-8, Prereq-1, Prereq-2. <em>Luật nhìn thấy được:</em> BR-02, BR-06, BR-14.</p>
<h3>3.2 M2 — Quyết định vượt sĩ số (UC-06, luồng 6.0 kèm ngoại lệ 6.0.E1)</h3>
<p>Hàng chờ của Trưởng bộ môn và một lần ra quyết định, với mọi thứ họ cần bày ngay trước
mắt: sĩ số lớp, sức chứa phòng, các yêu cầu đang chờ khác của cùng lớp đó, hồ sơ sinh
viên, và hậu quả với việc tốt nghiệp nếu từ chối.</p>
<p><em>Quyết định thiết kế đem đi hỏi:</em> dải thông báo. Khi hạn 48 giờ bị vượt, hệ thống <strong>leo
thang và tiếp tục đếm giờ</strong> — nó không tự duyệt, cũng không tự từ chối. Đây là bất đồng
khó nhất trong quá trình khai thác yêu cầu: Trưởng phòng Đào tạo muốn tự duyệt để bảo đảm
SLA, còn các Trưởng bộ môn từ chối để phần mềm ban phát ngoại lệ học vụ. Màn hình nói
thẳng ra cách giải quyết thay vì giấu nó đi.</p>
<p><em>Hiện thực:</em> Override-1 … Override-9. <em>Luật nhìn thấy được:</em> BR-03, BR-11, BR-12.</p>
<h3>3.3 M3 — Kiểm tra tiến độ tốt nghiệp với một nhóm không đánh giá được (UC-09)</h3>
<p>Từng nhóm điều kiện kèm trạng thái, cộng thêm một dòng <strong>Cần xem lại</strong> cho tín chỉ chuyển
đổi được ghi nhận trước năm 2019, cộng thêm phần dự báo "nếu như".</p>
<p><em>Quyết định thiết kế đem đi hỏi:</em> (1) trạng thái <strong>Cần xem lại</strong> — một bản kiểm tra tiến
độ mà lại đoán mò chính là kiểu hỏng đã sinh ra lá đơn khiếu nại gửi Hiệu trưởng nhắc ở
Vision &amp; Scope §1.1, nên màn hình nói thẳng là nó không biết và chỉ ra phải hỏi ai;
(2) ghi rõ <strong>năm quy chế đang áp dụng</strong>, vốn là một quy định (Quy chế học vụ §9.1), không
phải một chi tiết cho đẹp.</p>
<p><em>Hiện thực:</em> Audit-1 … Audit-7. <em>Luật nhìn thấy được:</em> BR-02, BR-13, BR-18.</p>
<h3>4. Những câu hỏi mà các mock-up này sinh ra để chốt</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Câu hỏi</th>
<th>Hỏi ai</th>
<th>Trả lời</th>
</tr>
</thead>
<tbody>
<tr>
<td>Q1</td>
<td>Sinh viên bị từ chối nên thấy mọi phép kiểm, hay chỉ thấy phép kiểm đã hỏng?</td>
<td>Nhân viên học vụ</td>
<td>Mọi phép kiểm, có đánh dấu cái chưa chạy — nó chặn được cuộc gọi hỏi tiếp kiểu "thế còn…"</td>
</tr>
<tr>
<td>Q2</td>
<td>Khi quá hạn quyết định vượt sĩ số, hệ thống có nên tự quyết không?</td>
<td>Trưởng phòng Đào tạo, các Trưởng bộ môn</td>
<td>Không. Leo thang và tiếp tục đếm giờ (UC-06 ngoại lệ 6.0.E1)</td>
</tr>
<tr>
<td>Q3</td>
<td>Bản kiểm tra tiến độ nên hiện ra điều kiện mà nó không đánh giá được, hay giấu đi?</td>
<td>Cố vấn học tập</td>
<td>Hiện ra ở trạng thái Cần xem lại, kèm lý do và người cần liên hệ</td>
</tr>
<tr>
<td>Q4</td>
<td>Phần dự báo "nếu như" có nên cho thấy cái giá của việc <em>không</em> học một môn?</td>
<td>Cố vấn học tập</td>
<td>Có — đó là câu hỏi tư vấn phổ biến nhất</td>
</tr>
<tr>
<td>Q5</td>
<td>Sinh viên có nên thấy GPA của chính mình trên màn hình vượt sĩ số mà Trưởng bộ môn nhìn?</td>
<td>Trưởng phòng Đào tạo</td>
<td><strong>Còn treo — TBD-6.</strong> Một câu hỏi về quyền riêng tư mà Trưởng phòng muốn hỏi ý kiến pháp chế</td>
</tr>
</tbody>
</table>
<p><strong>TBD-6</strong> được mang sang danh sách TBD của SRS. Để nó treo và có theo dõi là đúng; bịa ra
một lập trường về quyền riêng tư mà Trưởng phòng Đào tạo chưa hề đưa ra thì tệ hơn nhiều.</p></div>`,
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
    `<div class="ml-en"><h2>Requirement Prioritization — Analysis</h2>
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
<li>
<p><strong>FE-4, FE-5 and FE-9 carry the three highest Value % scores in the table</strong> — 10.19,
  9.06 and 9.43. They are the most valuable things in the project, and the model knows
  it. They rank 9th, 12th and 13th anyway, because they are also the most expensive and
  the riskiest.</p>
</li>
<li>
<p><strong>FE-12 wins</strong> on being cheap, safe and unavoidable — not on being important.</p>
</li>
<li><strong>FE-13 ranks 3rd</strong> and is deferred to Release 1.2, which nobody disputes.</li>
</ul>
<p>This is the model working correctly and then being overruled for reasons it cannot see:</p>
<ol>
<li>
<p><strong>The model has no concept of the business case.</strong> BO-2 (640 staff-hours) and BO-4
   (240 staff-hours) are what the Vice-Rector funded. Only FE-4 and FE-5 deliver them.
   A Release 1.0 built from the top of this ranking would open a registration window
   beautifully and still check every prerequisite by hand.</p>
</li>
<li>
<p><strong>The model treats risk as a reason to defer.</strong> FE-5's risk of 8 is entirely RI-1 —
   the finance vendor. Deferring FE-5 does not reduce that risk; it discovers it later,
   when there is less time to route around it. Constraint CO-7 (the adapter) exists
   precisely so the project can start FE-5 <em>before</em> the vendor's answer is known.</p>
</li>
<li>
<p><strong>The model cannot see dependency.</strong> FE-10 ranks 6th but is worthless without FE-5:
   it displays the data FE-5 obtains.</p>
</li>
</ol>
<p><strong>Decision:</strong> the release plan in Vision &amp; Scope §2.2 stands. The worksheet is used for
two narrower questions instead:</p>
<ul>
<li>
<p><strong>Sequencing inside Release 1.0.</strong> Build FE-12, FE-1 and FE-2 first — they are cheap,
  low-risk and they are what a rehearsal window needs in order to load-test anything at
  all.</p>
</li>
<li>
<p><strong>What to drop if the schedule slips.</strong> Rank order says <strong>FE-7 (waitlist) goes
  first</strong> — rank 11, and UC-06 overrides cover the same need less fairly but adequately
  for one semester. <strong>FE-4 and FE-5 cannot be dropped</strong>, because dropping them means
  the project delivers a faster registration window and none of the staff-hour savings
  that justified it.</p>
</li>
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
seven places."</p></div>
<div class="ml-vi"><h2>Xếp ưu tiên yêu cầu — Phân tích</h2>
<h2>cho Hệ thống Học vụ và Đăng ký môn (CARS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên thành viên 5&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Northern Regional University (NRU)
17 tháng 9 năm 2026</p>
<div class="callout">
<p>Bảng tính nằm ở <code>deliverables/07-Requirements-Prioritization.xlsx</code>, dựng trên template
chương 16 và giữ nguyên các công thức. Tài liệu này giải thích đầu vào, và giải thích
đầu ra có nghĩa gì — cũng như không có nghĩa gì.</p>
</div>
<hr />
<h3>1. Mô hình</h3>
<p><code>Total Value = Benefit × w_benefit + Penalty × w_penalty
Priority    = Value %  ÷  ( Cost % × w_cost  +  Risk % × w_risk )</code></p>
<p><strong>Benefit và Penalty là hai câu hỏi khác nhau.</strong> Benefit là giá trị khi tính năng có mặt;
penalty là thiệt hại khi nó vắng mặt. FE-12 (quản trị cửa sổ đăng ký) là ví dụ rõ nhất
của dự án này: chẳng ai hào hứng với nó, nhưng thiếu nó thì không mở nổi một đợt đăng ký
nào — benefit 7, penalty 9.</p>
<h3>2. Trọng số, và vì sao</h3>
<table>
<thead>
<tr>
<th>Chiều</th>
<th>Trọng số</th>
<th>Biện minh</th>
</tr>
</thead>
<tbody>
<tr>
<td>Benefit</td>
<td><strong>2</strong></td>
<td>Phó hiệu trưởng cấp tiền cho dự án này để chấm dứt tình trạng đăng ký thất bại và giải phóng giờ công nhân viên. Giá trị tạo ra nặng hơn thiệt hại tránh được.</td>
</tr>
<tr>
<td>Penalty</td>
<td><strong>1</strong></td>
<td>Mốc cơ sở.</td>
</tr>
<tr>
<td>Cost</td>
<td><strong>1</strong></td>
<td>Mốc cơ sở.</td>
</tr>
<tr>
<td>Risk</td>
<td><strong>0,5</strong></td>
<td>Mọi rủi ro trong Vision &amp; Scope §1.6 đều có biện pháp giảm thiểu được gọi tên. Đặt trọng số rủi ro ngang chi phí sẽ đẩy FE-5 và FE-9 — hai tính năng gánh RI-1 và RI-2 — xuống đáy bảng, tức là để một rủi ro <em>đã được kiểm soát</em> đứng ra quyết định phạm vi.</td>
</tr>
</tbody>
</table>
<h3>3. Những mục bị loại khỏi phần chấm điểm</h3>
<table>
<thead>
<tr>
<th>Mục</th>
<th>Vì sao không đánh đổi được</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>FE-3</strong> Giao dịch ghi danh</td>
<td>Hệ thống sinh ra để làm cho đúng một giao dịch này chạy được</td>
</tr>
<tr>
<td><strong>CO-1</strong> SSO của trường</td>
<td>Chính sách an ninh của tổ chức</td>
</tr>
<tr>
<td><strong>CO-6</strong> Phiên bản hoá luật theo năm quy chế</td>
<td>Quy chế học vụ §9.1</td>
</tr>
<tr>
<td><strong>OR-1</strong> Lưu trữ dữ liệu cá nhân</td>
<td>Nghị định 13/2023/NĐ-CP</td>
</tr>
</tbody>
</table>
<p>Mười ba tính năng được chấm trong một lượt duy nhất, vì mọi phần trăm trong bảng tính
đều là tỉ lệ trên tổng của cột.</p>
<h3>4. Kết quả</h3>
<table>
<thead>
<tr>
<th style="text-align: right;">Hạng</th>
<th>Tính năng</th>
<th style="text-align: right;">Value %</th>
<th style="text-align: right;">Cost %</th>
<th style="text-align: right;">Risk %</th>
<th style="text-align: right;"><strong>Priority</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: right;">1</td>
<td>FE-12 Quản trị cửa sổ đăng ký</td>
<td style="text-align: right;">8,68</td>
<td style="text-align: right;">5,08</td>
<td style="text-align: right;">4,17</td>
<td style="text-align: right;"><strong>1,211</strong></td>
</tr>
<tr>
<td style="text-align: right;">2</td>
<td>FE-2 Lập kế hoạch thời khoá biểu trước đợt đăng ký</td>
<td style="text-align: right;">8,30</td>
<td style="text-align: right;">6,78</td>
<td style="text-align: right;">4,17</td>
<td style="text-align: right;"><strong>0,937</strong></td>
</tr>
<tr>
<td style="text-align: right;">3</td>
<td>FE-13 Hồ sơ cố vấn và các khoá chặn</td>
<td style="text-align: right;">6,04</td>
<td style="text-align: right;">5,08</td>
<td style="text-align: right;">4,17</td>
<td style="text-align: right;"><strong>0,842</strong></td>
</tr>
<tr>
<td style="text-align: right;">4</td>
<td>FE-1 Tra cứu và duyệt danh mục môn học</td>
<td style="text-align: right;">8,30</td>
<td style="text-align: right;">6,78</td>
<td style="text-align: right;">6,25</td>
<td style="text-align: right;"><strong>0,838</strong></td>
</tr>
<tr>
<td style="text-align: right;">5</td>
<td>FE-8 Rút, đổi và xử lý thêm/bớt môn</td>
<td style="text-align: right;">7,55</td>
<td style="text-align: right;">6,78</td>
<td style="text-align: right;">6,25</td>
<td style="text-align: right;"><strong>0,762</strong></td>
</tr>
<tr>
<td style="text-align: right;">6</td>
<td>FE-10 Số dư tài khoản và lịch sử thanh toán</td>
<td style="text-align: right;">6,42</td>
<td style="text-align: right;">5,08</td>
<td style="text-align: right;">8,33</td>
<td style="text-align: right;"><strong>0,693</strong></td>
</tr>
<tr>
<td style="text-align: right;">7</td>
<td>FE-6 Quy trình xin vượt sĩ số</td>
<td style="text-align: right;">8,68</td>
<td style="text-align: right;">8,47</td>
<td style="text-align: right;">8,33</td>
<td style="text-align: right;"><strong>0,687</strong></td>
</tr>
<tr>
<td style="text-align: right;">8</td>
<td>FE-11 Khả năng duy trì lớp và việc huỷ lớp</td>
<td style="text-align: right;">6,04</td>
<td style="text-align: right;">6,78</td>
<td style="text-align: right;">4,17</td>
<td style="text-align: right;"><strong>0,681</strong></td>
</tr>
<tr>
<td style="text-align: right;">9</td>
<td>FE-4 Bộ luật môn tiên quyết và môn song hành</td>
<td style="text-align: right;">10,19</td>
<td style="text-align: right;">11,86</td>
<td style="text-align: right;">12,50</td>
<td style="text-align: right;"><strong>0,562</strong></td>
</tr>
<tr>
<td style="text-align: right;">10</td>
<td>FE-14 Báo cáo ghi danh và sĩ số</td>
<td style="text-align: right;">4,91</td>
<td style="text-align: right;">6,78</td>
<td style="text-align: right;">4,17</td>
<td style="text-align: right;"><strong>0,553</strong></td>
</tr>
<tr>
<td style="text-align: right;">11</td>
<td>FE-7 Quản lý danh sách chờ</td>
<td style="text-align: right;">6,42</td>
<td style="text-align: right;">8,47</td>
<td style="text-align: right;">6,25</td>
<td style="text-align: right;"><strong>0,553</strong></td>
</tr>
<tr>
<td style="text-align: right;">12</td>
<td>FE-5 Đánh giá điều kiện tài chính</td>
<td style="text-align: right;">9,06</td>
<td style="text-align: right;">8,47</td>
<td style="text-align: right;">16,67</td>
<td style="text-align: right;"><strong>0,539</strong></td>
</tr>
<tr>
<td style="text-align: right;">13</td>
<td>FE-9 Kiểm tra tiến độ tốt nghiệp thời gian thực</td>
<td style="text-align: right;">9,43</td>
<td style="text-align: right;">13,56</td>
<td style="text-align: right;">14,58</td>
<td style="text-align: right;"><strong>0,452</strong></td>
</tr>
</tbody>
</table>
<h3>5. Đối chiếu thứ hạng với kế hoạch phát hành — phần quan trọng nhất</h3>
<p><strong>Thứ hạng và kế hoạch phát hành mâu thuẫn nhau, và kế hoạch phát hành mới là cái đúng.</strong></p>
<p>Hãy nhìn xem mô hình thưởng cho cái gì và phạt cái gì:</p>
<ul>
<li>
<p><strong>FE-4, FE-5 và FE-9 giữ ba điểm Value % cao nhất bảng</strong> — 10,19, 9,06 và 9,43. Chúng
  là những thứ giá trị nhất của dự án, và mô hình biết điều đó. Chúng vẫn xếp hạng 9, 12
  và 13, vì chúng đồng thời cũng đắt nhất và rủi ro nhất.</p>
</li>
<li>
<p><strong>FE-12 thắng</strong> nhờ rẻ, an toàn và không thể né — chứ không phải nhờ quan trọng.</p>
</li>
<li><strong>FE-13 xếp hạng 3</strong> mà lại bị hoãn sang bản 1.2, và không ai tranh cãi chuyện đó.</li>
</ul>
<p>Đây là mô hình chạy đúng, rồi bị bác vì những lý do nó không nhìn thấy được:</p>
<ol>
<li>
<p><strong>Mô hình không có khái niệm về bài toán kinh doanh.</strong> BO-2 (640 giờ-người) và BO-4
   (240 giờ-người) mới là thứ Phó hiệu trưởng bỏ tiền ra mua. Chỉ FE-4 và FE-5 mang lại
   chúng. Một bản 1.0 dựng từ đỉnh bảng xếp hạng này sẽ mở được cửa sổ đăng ký rất đẹp mà
   vẫn kiểm từng môn tiên quyết bằng tay.</p>
</li>
<li>
<p><strong>Mô hình coi rủi ro là lý do để hoãn.</strong> Rủi ro 8 của FE-5 hoàn toàn là RI-1 — nhà
   cung cấp hệ tài chính. Hoãn FE-5 không làm rủi ro đó giảm đi; nó chỉ làm ta phát hiện
   muộn hơn, lúc còn ít thời gian để vòng tránh. Ràng buộc CO-7 (lớp adapter) tồn tại
   đúng để dự án bắt đầu FE-5 được <em>trước khi</em> biết câu trả lời của nhà cung cấp.</p>
</li>
<li>
<p><strong>Mô hình không nhìn thấy quan hệ phụ thuộc.</strong> FE-10 xếp hạng 6 nhưng vô giá trị nếu
   thiếu FE-5: nó hiển thị chính dữ liệu mà FE-5 lấy về.</p>
</li>
</ol>
<p><strong>Quyết định:</strong> kế hoạch phát hành ở Vision &amp; Scope §2.2 giữ nguyên. Bảng tính được dùng
cho hai câu hỏi hẹp hơn:</p>
<ul>
<li>
<p><strong>Xếp thứ tự bên trong bản 1.0.</strong> Dựng FE-12, FE-1 và FE-2 trước — chúng rẻ, ít rủi ro,
  và chúng là những thứ một đợt đăng ký thử cần có thì mới thử tải được bất cứ điều gì.</p>
</li>
<li>
<p><strong>Bỏ cái gì nếu trễ tiến độ.</strong> Theo thứ hạng thì <strong>FE-7 (danh sách chờ) bỏ trước</strong> —
  hạng 11, và cơ chế vượt sĩ số ở UC-06 phủ được cùng nhu cầu đó, kém công bằng hơn nhưng
  đủ dùng cho một học kỳ. <strong>FE-4 và FE-5 thì không được bỏ</strong>, vì bỏ chúng nghĩa là dự án
  giao ra một cửa sổ đăng ký nhanh hơn và không có chút tiết kiệm giờ công nào — mà chính
  phần tiết kiệm đó mới là lý do dự án được duyệt.</p>
</li>
</ul>
<div class="callout">
<p>Một bảng xếp ưu tiên mà đầu ra chỉ để tuân theo là một bảng chưa ai suy nghĩ về nó.</p>
</div>
<h3>6. Độ nhạy</h3>
<table>
<thead>
<tr>
<th>Thay đổi</th>
<th>Ảnh hưởng</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nâng trọng số rủi ro từ 0,5 lên 1,0</td>
<td>FE-5 rơi xuống cuối bảng và FE-9 xuống hạng 12. Những tính năng gánh giá trị của dự án còn chìm sâu hơn — xác nhận rằng trong mô hình này, thứ chôn chúng là <em>rủi ro</em> chứ không phải <em>chi phí</em>.</td>
</tr>
<tr>
<td>Hạ rủi ro của FE-5 từ 8 xuống 4 (tức nhà cung cấp xác nhận có API)</td>
<td>FE-5 leo từ hạng 12 lên hạng 5. Việc giá trị nhất mà nhóm có thể làm trong tuần 3 là đi lấy cho được câu trả lời đó, và cái bảng này định lượng lý do.</td>
</tr>
</tbody>
</table>
<p>Dòng thứ hai mới là đầu ra hữu ích của cả bài tập: nó biến câu "chắc phải đi thúc nhà
cung cấp hệ tài chính" thành câu "giải quyết xong RI-1 thì tính năng giá trị thứ tư của
chúng ta nhảy lên bảy bậc".</p></div>`,
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
    `<div class="ml-en"><h2>Requirement Estimation — BA budget and number of BAs</h2>
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
<li>
<p><strong>It raises confidence in the number.</strong> Three independent methods agreeing within
  0.45 of a BA is stronger evidence than any one of them alone.</p>
</li>
<li>
<p><strong>It does not mean the estimate is complete.</strong> All three methods price <em>artifacts and
  headcount</em>. None of them prices the two things this project's own risk register says
  will consume analyst time: <strong>RI-2</strong>, the curriculum-rule data audit, and <strong>TBD-5</strong>,
  finding out which programmes cannot be expressed as machine-evaluable rules.</p>
</li>
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
15% rule. We state it that way rather than letting a rate assumption carry the argument.</p></div>
<div class="ml-vi"><h2>Ước lượng yêu cầu — Ngân sách BA và số lượng BA</h2>
<h2>cho Hệ thống Học vụ và Đăng ký môn (CARS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên thành viên 5&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Northern Regional University (NRU)
17 tháng 9 năm 2026</p>
<div class="callout">
<p>Công cụ là <code>deliverables/08-Requirements-Estimation.xlsx</code>, chính là Requirements
Estimation Tool của chương 19, giữ nguyên công thức. Chỉ các ô nhập màu vàng được
điền; mỗi ô có một chú thích ghi rõ giá trị đó lấy từ đâu.</p>
</div>
<hr />
<h3>1. Đầu vào, và từng con số lấy từ đâu</h3>
<p><strong>Những con số đếm này lấy từ chính các deliverable của nhóm.</strong> Một con số mâu thuẫn với
tài liệu mà nó mô tả sẽ làm hỏng toàn bộ phần phía sau.</p>
<table>
<thead>
<tr>
<th>Đầu vào</th>
<th>Giá trị</th>
<th>Nguồn</th>
</tr>
</thead>
<tbody>
<tr>
<td>Số trang tài liệu hiện có phải đọc rà</td>
<td>120</td>
<td>Tài liệu hệ cũ + Quy chế học vụ NRU 2026 + ghi chép hiện trạng</td>
</tr>
<tr>
<td>Số hệ thống đang có bị nâng cấp hoặc thay thế</td>
<td>1</td>
<td>Hệ thống thông tin sinh viên cũ</td>
</tr>
<tr>
<td>Bên liên quan</td>
<td>20</td>
<td>Những người có tên tham dự các buổi khai thác yêu cầu 1–4</td>
</tr>
<tr>
<td>Hệ thống giao tiếp — nhỏ</td>
<td>2</td>
<td>SSO của trường, dịch vụ thông báo</td>
</tr>
<tr>
<td>Hệ thống giao tiếp — vừa</td>
<td>3</td>
<td>Tài chính/học phí, thời khoá biểu, hệ quản lý học tập (SRS §5.2)</td>
</tr>
<tr>
<td>Hệ thống giao tiếp — lớn</td>
<td>0</td>
<td>Không có lúc chạy; phần chuyển đổi từ hệ cũ đã tính ở trên</td>
</tr>
<tr>
<td><strong>Luồng quy trình và/hoặc use case</strong></td>
<td><strong>14</strong></td>
<td><strong>Đếm từ Deliverable 2 — UC-01 … UC-14</strong></td>
</tr>
<tr>
<td>Sơ đồ dữ liệu nghiệp vụ</td>
<td>2</td>
<td>Context diagram + mô hình dữ liệu logic</td>
</tr>
<tr>
<td><strong>Màn hình / giao diện người dùng</strong></td>
<td><strong>26</strong></td>
<td>Sinh viên 10 + nhân viên 6 + trưởng bộ môn 4 + cố vấn 3 + phòng đào tạo 3</td>
</tr>
<tr>
<td><strong>Báo cáo</strong></td>
<td><strong>7</strong></td>
<td>RPT-1 … RPT-7, đếm từ SRS §4.3</td>
</tr>
<tr>
<td>Tổng ngân sách dự án</td>
<td>950.000 USD</td>
<td>Vision &amp; Scope §3.2</td>
</tr>
<tr>
<td>Đơn giá BA bình quân theo giờ</td>
<td>125 USD</td>
<td>Mặc định của công cụ, giữ nguyên — xem §5</td>
</tr>
<tr>
<td>Loại dự án</td>
<td>Standard</td>
<td>Xây riêng để thay thế một hệ thống cũ</td>
</tr>
<tr>
<td>Số lập trình viên</td>
<td>10</td>
<td>Ràng buộc nhân sự, Vision &amp; Scope §3.2</td>
</tr>
<tr>
<td>Nhóm có làm từ xa không?</td>
<td>Không</td>
<td>Nhóm ngồi cùng chỗ trong trường</td>
</tr>
<tr>
<td>Thời lượng dự án</td>
<td>40 tuần</td>
<td>Bản 1.0 chạy thật kịp đợt đăng ký học kỳ 1</td>
</tr>
<tr>
<td>Thời lượng phần việc yêu cầu</td>
<td>14 tuần</td>
<td>Tuần 1–14</td>
</tr>
</tbody>
</table>
<h3>2. Ba đáp số</h3>
<table>
<thead>
<tr>
<th>Phương pháp</th>
<th style="text-align: right;">Số BA</th>
<th style="text-align: right;">Ngân sách BA — giai đoạn yêu cầu</th>
<th style="text-align: right;">Ngân sách BA — cả dự án</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>A</strong> — 15% tổng ngân sách dự án</td>
<td style="text-align: right;"><strong>2,04</strong></td>
<td style="text-align: right;">143.000 USD</td>
<td style="text-align: right;">407.000 USD</td>
</tr>
<tr>
<td><strong>B</strong> — 6 lập trình viên trên 1 BA (Standard)</td>
<td style="text-align: right;"><strong>1,67</strong></td>
<td style="text-align: right;">117.000 USD</td>
<td style="text-align: right;">333.000 USD</td>
</tr>
<tr>
<td><strong>C</strong> — Theo hoạt động, 893 giờ</td>
<td style="text-align: right;"><strong>1,59</strong></td>
<td style="text-align: right;">112.000 USD</td>
<td style="text-align: right;">319.000 USD</td>
</tr>
</tbody>
</table>
<p>893 giờ ÷ 40 giờ ÷ 14 tuần = <strong>1,59 BA</strong>. Không áp dụng phần đệm cho làm từ xa — nhóm
ngồi cùng chỗ.</p>
<h3>3. Đọc khoảng chênh lệch</h3>
<p>Ba đáp số gần nhau bất thường (1,59 đến 2,04), và lý do đáng nói ra: <strong>CARS là một hệ
thống cỡ vừa với ít giao tiếp.</strong> Mười bốn use case, hai mươi sáu màn hình và chỉ năm hệ
thống giao tiếp, không cái nào lớn. Ba phương pháp đo những thứ khác nhau, nhưng trên một
hệ thống có hình dạng như thế này, chúng rơi vào cùng một chỗ.</p>
<p>Đó là một phát hiện thật chứ không phải trùng hợp, và nó cắt về cả hai phía:</p>
<ul>
<li>
<p><strong>Nó nâng độ tin cậy của con số.</strong> Ba phương pháp độc lập đồng ý với nhau trong phạm vi
  0,45 BA là bằng chứng mạnh hơn bất kỳ phương pháp đơn lẻ nào.</p>
</li>
<li>
<p><strong>Nó KHÔNG có nghĩa là ước lượng đã đầy đủ.</strong> Cả ba phương pháp đều định giá <em>sản phẩm
  và nhân sự</em>. Không phương pháp nào định giá hai thứ mà chính sổ rủi ro của dự án này
  nói là sẽ ngốn thời gian analyst: <strong>RI-2</strong>, việc rà soát dữ liệu luật chương trình đào
  tạo, và <strong>TBD-5</strong>, việc tìm ra ngành nào không diễn đạt được thành luật máy đánh giá
  được.</p>
</li>
</ul>
<h3>4. Chúng tôi cam kết gì, và điều gì sẽ làm thay đổi</h3>
<div class="callout">
<p><strong>Bố trí 2 BA cho 14 tuần của giai đoạn yêu cầu, ngân sách 143.000 USD.</strong></p>
</div>
<p><strong>Vì sao là 2 chứ không phải 1,59 hay 1,67.</strong> Phương pháp B và C định giá hệ thống đúng
như đã đặc tả. Chúng không chứa phần rà soát luật chương trình đào tạo — thứ mà giả định
A2 đặt làm điều kiện tiên quyết của bản 1.0, và nhóm không thể bắt đầu nếu không có BA.
Con số 2,04 của phương pháp A là con số duy nhất còn dư chỗ cho việc đó, và làm tròn lên
2 khiến phần dư đó trở nên tường minh thay vì tình cờ.</p>
<p><strong>Điều gì sẽ khiến chúng tôi đổi ý — nói trước:</strong></p>
<table>
<thead>
<tr>
<th>Ngưỡng kích hoạt</th>
<th>Cam kết sửa lại</th>
</tr>
</thead>
<tbody>
<tr>
<td>TBD-5 cho thấy hơn 10% số ngành không diễn đạt được thành luật</td>
<td>Nâng lên 3 BA; giả định A2 đổ, phần việc về luật phình ra đáng kể</td>
</tr>
<tr>
<td>Nhà cung cấp hệ tài chính xác nhận có API đồng bộ trong tuần 3 (RI-1 đóng)</td>
<td>Giữ 2 BA; phần việc adapter ở CO-7 co lại nhưng không biến mất</td>
</tr>
<tr>
<td>Nhà cung cấp từ chối, buộc phải trao đổi tệp theo đêm</td>
<td>Giữ 2 BA, nhưng lập lại kế hoạch UC-05 — các đường ngoại lệ nhân lên và Finance-3 trở thành trường hợp bình thường</td>
</tr>
<tr>
<td>Giai đoạn yêu cầu bị nén từ 14 tuần xuống 10</td>
<td>Nâng lên 2,5 BA — khối lượng công việc không co lại theo lịch</td>
</tr>
</tbody>
</table>
<p><strong>Chi phí BA cho cả dự án:</strong> 407.000 USD với 2 BA trong 40 tuần. Đây là con số trung thực
để trình người tài trợ. Analyst không dừng lại ở bản cơ sở — họ còn trả lời câu hỏi, chạy
quy trình kiểm soát thay đổi và duy trì truy vết cho tới lúc phát hành.</p>
<h3>5. Độ nhạy: đơn giá theo giờ</h3>
<p>Đơn giá bình quân 125 USD là mặc định của công cụ, lấy từ bối cảnh Mỹ của cuốn sách. Với
đơn giá BA bình quân ở Việt Nam khoảng 45 USD/giờ:</p>
<table>
<thead>
<tr>
<th>Phương pháp</th>
<th style="text-align: right;">Số BA ở 125 USD/h</th>
<th style="text-align: right;">Số BA ở 45 USD/h</th>
</tr>
</thead>
<tbody>
<tr>
<td>A — 15% ngân sách</td>
<td style="text-align: right;">2,04</td>
<td style="text-align: right;"><strong>5,66</strong></td>
</tr>
<tr>
<td>B — tỉ lệ theo lập trình viên</td>
<td style="text-align: right;">1,67</td>
<td style="text-align: right;">1,67</td>
</tr>
<tr>
<td>C — theo hoạt động</td>
<td style="text-align: right;">1,59</td>
<td style="text-align: right;">1,59</td>
</tr>
</tbody>
</table>
<p><strong>Chỉ phương pháp A nhúc nhích.</strong> Điều đó phơi ra thứ nó thật sự đo: không phải dự án cần
bao nhiêu phân tích, mà 15% ngân sách tình cờ mua được bao nhiêu giờ công analyst. Ở đơn
giá nội địa, sự đồng thuận mô tả ở §3 biến mất hoàn toàn, và phương pháp A trở thành cận
trên của công sức <em>chi trả nổi</em> chứ không phải ước lượng của công sức <em>cần thiết</em>.</p>
<p>Điều này quan trọng với cam kết ở §4. Chúng tôi đã dùng phần dư của phương pháp A để biện
minh cho việc làm tròn lên 2 BA — nhưng phần dư ấy là hệ quả của một đơn giá Mỹ. Nếu NRU
bố trí nhân sự theo đơn giá nội địa, biện minh trung thực cho BA thứ hai là <strong>RI-2 và
TBD-5</strong>, không phải quy tắc 15%. Chúng tôi nói thẳng như vậy thay vì để một giả định về
đơn giá gánh lập luận thay mình.</p></div>`,
  ].join('\n'),
};

export default {
  title: "Worked package — TP1: Campus Academic & Registration (CARS)|||Bộ tài liệu mẫu — TP1: Học vụ & Đăng ký môn (CARS)",
  description: "Trọn bộ 8 deliverable của một bài Assignment làm trên đề TP1, cho hệ thống CARS của trường đại học giả định Northern Regional University. Tài liệu giữ nguyên tiếng Anh như khi nộp; phần dẫn giải mỗi tài liệu là song ngữ. Đọc kèm mục Assignment và bộ TP2 để so sánh hai cách xử lý khác nhau của cùng một khuôn.",
  lessons: [TP1L1, TP1L2, TP1L3, TP1L4, TP1L5, TP1L6, TP1L7, TP1L8],
};
