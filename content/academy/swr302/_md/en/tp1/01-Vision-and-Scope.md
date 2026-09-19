# Vision and Scope Document
## for the Campus Academic and Registration System (CARS)

Version 1.0 approved
Prepared by **<Team Leader name>**, Business Analysis Team — Group <N>
Northern Regional University (NRU)
17 September 2026

---

### Revision History

| Name | Date | Reason For Changes | Version |
|---|---|---|---|
| BA Team, Group <N> | 2026-09-17 | Initial draft after stakeholder elicitation round 1 | 0.9 |
| BA Team, Group <N> | 2026-09-17 | Baseline approved by the Vice-Rector for Academic Affairs | 1.0 |

---

## 1. Business Requirements

### 1.1 Background

Northern Regional University (NRU) is a public university with **12,000 enrolled
students** across six faculties, offering approximately **1,400 course sections** each
semester. Its academic administration has been run since 2012 on a locally built
student information system, now fourteen years old, which was designed for a student
body of roughly 3,000 and for registration handled at a service counter.

The university moved registration online in 2019 without re-architecting the
underlying system. Since then the student body has grown by 47%, the number of
sections by 38%, and the registration window has been compressed from two weeks to
**72 hours** in three priority waves. Everything else in the academic office — the
checks performed before an enrollment is confirmed, and the decisions made about
sections that do not fill — is still done by hand, as it was when there were 3,000
students.

Two consecutive semesters have ended with a formal complaint to the Rector: one about
registration outages, one about students discovering in their final year that a
graduation requirement had been missed. The university has funded this project in
response.

### 1.2 Business Opportunity

Five distinct problems, all named in the situation the academic office has described:

**P1 — The system fails under registration load.** The 72-hour registration window
opens at 08:00 for each priority wave. Measured in Semester 2, 2025–26, **peak
concurrent logins reached 4,200** against a system that degrades past 1,800 and has
crashed outright in three of the last four windows. Each outage extends the window,
which pushes registration into teaching weeks and forces late timetable changes.

**P2 — Prerequisite completion is verified by hand.** Academic office staff check each
enrollment against the student's transcript manually. Measured over the last two
semesters, this consumes approximately **640 staff-hours per semester**, and errors
survive: 61 students in 2025–26 were allowed into a course whose prerequisite they had
not passed, and had to be withdrawn after teaching had started.

**P3 — Capacity override requests are handled on paper.** A student who wants a place
in a full section emails the department, which forwards to the academic office, which
consults the lecturer. There were **2,300 override requests in 2025–26**, and the
average time to a decision was **6 days** — long enough that the student has usually
committed to an alternative timetable by the time the answer arrives. There is no
record of who decided what, or why.

**P4 — Tuition status is cross-checked separately from enrollment.** The finance
system and the academic system do not talk to each other. Three staff spend
approximately **two weeks each semester** exporting, matching and re-keying payment
status before enrollments can be confirmed. Students with a cleared payment are
sometimes blocked, and students with an outstanding balance are sometimes enrolled.

**P5 — Under-enrolled sections are found late.** Nobody is systematically watching
which sections have failed to fill. In 2025–26 the average section cancellation was
confirmed **9 days after the add/drop period opened**, by which time affected students
had built timetables around it.

**P6 — Students cannot see their own position.** There is no real-time degree audit
and no visible account balance. Students ask instead: the six faculty advising offices
logged approximately **4,800 enquiries in 2025–26** that consisted of a student asking
what they still had to take, or what they owed. Most of these questions are answerable
from data the university already holds.

### 1.3 Business Objectives

| ID | Business Objective | Baseline (2025–26) | Target | Deadline |
|---|---|---|---|---|
| **BO-1** | Eliminate registration-window outages and sustain peak concurrent load | 4,200 peak concurrent; 3 outages in 4 windows | 6,000 concurrent sessions, **zero** outages, p95 response ≤ 2 s | First registration window after Release 1.0 |
| **BO-2** | Automate prerequisite verification | 640 staff-hours/semester; 61 incorrect enrollments | ≥ 98% of enrollment attempts decided automatically; ≤ 64 staff-hours/semester; **zero** incorrect enrollments | End of first semester after Release 1.0 |
| **BO-3** | Put every capacity override into a tracked workflow with a decision deadline | 2,300 requests/semester, 6 days average, no audit record | 100% tracked; ≤ 48 hours to decision for ≥ 90% of requests | End of first semester after Release 1.0 |
| **BO-4** | Evaluate financial eligibility automatically at the moment of registration | ~240 staff-hours/semester of manual matching | ≤ 20 staff-hours/semester; **zero** incorrectly blocked or incorrectly enrolled students | End of first semester after Release 1.0 |
| **BO-5** | Identify under-enrolled sections before the add/drop period opens | 9 days after opening | Flagged **7 days before** add/drop opens, automatically | Second semester after Release 1.0 |
| **BO-6** | Give every student a real-time degree audit and account balance | ~4,800 advising enquiries/semester | ≥ 50% reduction (≤ 2,400/semester) | Second semester after Release 1.0 |

### 1.4 Success Metrics

| Metric | Measurement method | Source of data | Reporting frequency |
|---|---|---|---|
| Peak concurrent sessions sustained | Maximum simultaneous authenticated sessions with p95 response ≤ 2 s | Application performance monitoring | Per registration window |
| Registration availability | Minutes of unavailability during a registration window ÷ total window minutes | Uptime monitoring | Per registration window |
| Automated prerequisite decisions | (Enrollment attempts decided without staff intervention ÷ total attempts) × 100 | CARS enrollment audit log | Per semester |
| Incorrect enrollments | Count of students withdrawn after teaching started for an unmet prerequisite | Registrar withdrawal records | Per semester |
| Override decision time | Median and 90th-percentile hours from request submitted to decision recorded | CARS override workflow records | Weekly during registration |
| Manual finance-matching hours | Staff-recorded hours spent on payment reconciliation | Academic office timesheet | Per semester |
| Section cancellation lead time | Days between a section being flagged under-enrolled and the add/drop period opening | CARS section records | Per semester |
| Advising enquiry volume | Enquiries tagged "degree progress" or "account balance" | Advising office ticket log | Per semester |

**Factors with the greatest impact on success (inside NRU's control):** the accuracy
of the curriculum rules migrated into the degree audit engine; the willingness of
department heads to decide overrides inside 48 hours; the quality of the historical
transcript data.

**Factors outside NRU's control:** the finance system vendor's willingness to expose an
API; Ministry-level curriculum changes mid-project; student behaviour on the opening
minute of a registration wave.

### 1.5 Vision Statement

> **For** the students, academic advisors, academic office staff and department heads
> of Northern Regional University
> **who** must complete 12,000 students' registration inside a 72-hour window while
> verifying prerequisites, capacity and financial standing for every enrollment,
> **the Campus Academic and Registration System (CARS)** is an academic administration
> platform
> **that** decides every enrollment automatically against the curriculum, capacity and
> finance rules at the moment the student clicks, and shows each student their own
> degree progress and account balance continuously rather than on request.
> **Unlike** the current fourteen-year-old system, in which registration is a queue
> that falls over and every check behind it is performed by a person after the fact,
> **CARS** treats the enrollment decision as a single automated transaction, so that
> students learn the answer immediately and staff handle only the exceptions.

### 1.6 Business Risks

| ID | Risk | Severity | Probability | Mitigation |
|---|---|---|---|---|
| **RI-1** | The finance system vendor will not expose an API, forcing continued manual matching and defeating BO-4 | High | Medium | Confirm vendor position in Week 3; design the finance interface behind an adapter so a nightly file exchange can substitute without changing enrollment logic |
| **RI-2** | Historical transcript and curriculum data are too inconsistent to drive an automated degree audit | High | High | Run a curriculum-rule and transcript data audit before design; define acceptance thresholds; degrade to advisor-confirmed audit for affected cohorts rather than showing a wrong one |
| **RI-3** | Peak load is not reproduced in testing and the first live window fails again, destroying confidence | High | Medium | Load test at 1.5× the historical peak before the first window; run the first window in three waves with a manual throttle |
| **RI-4** | Department heads do not decide overrides within 48 hours, so BO-3 fails for reasons the software cannot fix | Medium | High | Escalation and visible ageing built into the workflow; the Registrar reviews breaches weekly; the SLA is a university policy decision, recorded as a dependency |
| **RI-5** | Academic staff resist losing discretion to an automated rule and continue to grant exceptions off-system | Medium | Medium | Every rule is overridable by a named role with a recorded reason, so discretion is preserved but auditable |
| **RI-6** | Curriculum changes during the project invalidate the rules already encoded | Medium | Medium | Curriculum rules are configuration, not code; a change is a data change |

### 1.7 Business Assumptions and Dependencies

**Assumptions**

- A1: NRU will continue to operate a 72-hour registration window in three priority waves.
- A2: Curriculum requirements can be expressed as machine-evaluable rules for at least 90% of programmes.
- A3: The transcript data held in the legacy system is complete for students enrolled from 2019 onward.
- A4: Student identity and authentication continue to be provided by the existing university SSO.
- A5: The timetable and room allocation system remains the authority for when and where a section meets.
- A6: Every enrolled student has a university email address reachable by the notification service.

**Dependencies**

- D1: An interface to the finance/bursar system, whose form depends on the vendor (RI-1).
- D2: A signed university policy setting the 48-hour override decision SLA (BO-3).
- D3: Faculty curriculum committees to validate the encoded degree requirements before Release 1.0.
- D4: A data steward from the Registrar's office available 8 hours per week during requirements and migration.

---

## 2. Scope and Limitations

### 2.1 Major Features

| ID | Feature | Addresses |
|---|---|---|
| **FE-1** | Course catalog search and section browsing | P1 |
| **FE-2** | Schedule planning before the window opens ("shopping cart") | P1 |
| **FE-3** | Enrollment transaction — a single automated decision on prerequisite, capacity and finance | P1, P2, P4 |
| **FE-4** | Prerequisite and co-requisite rule engine | P2 |
| **FE-5** | Financial eligibility evaluation at registration time | P4 |
| **FE-6** | Capacity override request and decision workflow | P3 |
| **FE-7** | Waitlist management and automatic promotion | P3 |
| **FE-8** | Drop, swap and add/drop period handling | — |
| **FE-9** | Real-time degree audit | P6 |
| **FE-10** | Student account balance and payment history view | P6 |
| **FE-11** | Under-enrolled section detection and cancellation | P5 |
| **FE-12** | Registration window and priority wave administration | P1 |
| **FE-13** | Advising records and advising holds | P6 |
| **FE-14** | Enrollment, capacity and workload reporting | P5, all |

### 2.2 Scope of Initial Release (Release 1.0)

Release 1.0 targets **BO-1, BO-2, BO-3 and BO-4** — the registration window itself and
the three checks that sit behind it. It must be live for a full registration window.

Included: **FE-1, FE-2, FE-3, FE-4, FE-5, FE-6, FE-7, FE-8, FE-12**.

Scope boundaries for Release 1.0:
- All six faculties from day one. Registration cannot be piloted on part of the student body, because sections are shared across faculties.
- Degree audit (FE-9) is **not** included; prerequisite checking (FE-4) is, and the two use the same curriculum rules, so FE-9 becomes largely configuration in 1.1.
- Financial eligibility uses whichever interface the vendor makes available (RI-1).

### 2.3 Scope of Subsequent Releases

| Release | Target | Contents |
|---|---|---|
| **1.1** | +1 semester | **FE-9** real-time degree audit and **FE-10** account balance view. Delivers BO-6. |
| **1.2** | +2 semesters | **FE-11** under-enrolled section detection and cancellation; **FE-13** advising records and holds. Delivers BO-5. |
| **2.0** | +3 semesters | **FE-14** reporting and analytics; graduation application; transcript issuance; programme-change workflow. |

### 2.4 Limitations and Exclusions

- **EX-1** CARS does not replace the learning management system. Course content, assignments and grades entered by lecturers remain there; CARS consumes final grades.
- **EX-2** CARS does not replace the finance/bursar system. It reads eligibility and does not process payments, refunds or scholarships.
- **EX-3** CARS does not build timetables or allocate rooms. It consumes the published timetable.
- **EX-4** CARS does not manage admissions or applicant records. A student exists in CARS from matriculation.
- **EX-5** CARS does not manage staff HR records, workload contracts or payroll.
- **EX-6** CARS does not issue official transcripts or degree certificates in releases 1.0–1.2.
- **EX-7** CARS does not support registration by proxy — a staff member registering on a student's behalf — except through the documented override path.
- **EX-8** CARS does not replace the university SSO or maintain its own student password store.

---

## 3. Business Context

### 3.1 Stakeholder Profiles

| Stakeholder | Major Value | Attitudes | Major Interests | Constraints |
|---|---|---|---|---|
| **Vice-Rector, Academic Affairs** (sponsor) | No further registration failures reaching the Rector | Strongly supportive; owns the business case | BO-1 above all; a visible, outage-free window | Maximum budget USD 950,000; must be live for the Semester 1 window |
| **Registrar** | Academic rules enforced consistently instead of by memory | Supportive but protective of academic discretion | Every automated decision must be overridable and auditable | Cannot change university academic regulations to suit the software |
| **Academic Office Staff** (14 users) | 640 hours a semester of manual checking disappears | Cautious — some fear the role shrinks with the workload | Exception handling must be genuinely easier, not just different | Peak-period overtime is already at its contractual limit |
| **Academic Advisor** (~40 users) | Students arrive having already seen their own degree audit | Very receptive; the most enthusiastic class | Accuracy of the audit; ability to record advice and place holds | Deferred to Release 1.1; needs a read-only view in 1.0 |
| **Department Head** (6 users) | Override decisions arrive in one queue instead of a mail thread | Mixed — welcomes visibility, resists a 48-hour SLA | Section capacity and workload impact of each decision | Teaching load leaves limited time; the SLA depends on university policy (D2) |
| **Student** (12,000) | Registration that works, and knowing where they stand | Currently dissatisfied and vocal | Speed and fairness of the window; accurate degree audit | Represented by the Student Union as product champion |
| **Finance Officer** (3 users) | Two weeks a semester of re-keying disappears | Supportive but sceptical the vendor will cooperate | Correctness of the eligibility rule; a clear audit trail | Bound by the finance system vendor contract (RI-1) |
| **IT Operations** | One supported platform instead of a fourteen-year-old one | Neutral; concerned about the load profile | Monitoring, capacity, deployment and data retention | Must run within the existing university data centre and security policy |

### 3.2 Project Priorities

| Dimension | Driver (state objective) | Constraint (state limits) | Degree of Freedom (state allowable range) |
|---|---|---|---|
| **Schedule** | Release 1.0 live for the **Semester 1 registration window** | The academic calendar is fixed by Ministry regulation and will not move | — |
| **Features** | — | FE-1 … FE-8 and FE-12 are mandatory for Release 1.0 | FE-7 waitlist may ship in a reduced form if the schedule is at risk |
| **Quality** | **Zero registration outages** is the acceptance criterion for the business case | No incorrect enrollment may be permitted by an automated decision | 90–95% of user acceptance tests must pass for Release 1.0 |
| **Staff** | — | Maximum team size is 1 PM, 3 BAs, 10 developers, 4 testers | BA count may vary between 2 and 3 during requirements work |
| **Cost** | — | Total project budget USD 950,000 | Budget overrun up to 10% acceptable without sponsor review |

### 3.3 Deployment Considerations

- **Environment.** CARS is deployed into the existing university data centre, with capacity provisioned for the registration peak rather than the average — the load profile is extreme and brief, and sizing for the average is what broke the legacy system.
- **Rollout strategy.** Unlike a warehouse or a store network, registration **cannot be piloted on part of the population**: sections are shared across faculties, so a partial rollout would split the same section's capacity across two systems. Release 1.0 therefore goes live for all 12,000 students in one window. The risk this creates is managed by the parallel-window rehearsal below, not by phasing.
- **Rehearsal.** A full-scale mock registration window is run with volunteer students two weeks before the live window, at 1.5× expected peak load. This is a release gate, not a test.
- **Cutover window.** The legacy system is frozen for the 48 hours before the window opens. Enrollment data is migrated and verified against control totals before the freeze is lifted.
- **Data migration.** Student records, transcripts from 2019 onward, curriculum rules and section catalog are migrated. Pre-2019 transcripts are migrated read-only and flagged, because assumption A3 does not cover them.
- **Training.** Students receive no training — a registration system that needs training has failed. Academic office staff and department heads receive a half-day workshop per faculty before the first window.
- **Support.** Extended on-call covering the full 72-hour window, with the academic office staffed throughout and a documented manual fallback for a single enrollment.
- **Back-out plan.** The legacy system remains readable and can accept manual enrollments for the duration of the first window. It is decommissioned only after one complete, successful window.
