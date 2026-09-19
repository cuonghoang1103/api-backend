# Software Requirements Specification
## for the Campus Academic and Registration System (CARS)

Version 1.0 approved
Prepared by **<Team Leader name>**, Business Analysis Team — Group <N>
Northern Regional University (NRU)
17 September 2026

---

### Revision History

| Name | Date | Reason For Changes | Version |
|---|---|---|---|
| BA Team, Group <N> | 2026-09-17 | Initial draft — sections 1–2 from Vision & Scope, section 3 from use cases | 0.9 |
| BA Team, Group <N> | 2026-09-17 | Quality attributes quantified, all sections complete, baselined | 1.0 |

---

## Table of Contents

1. Introduction · 2. Overall Description · 3. System Features · 4. Data Requirements ·
5. External Interface Requirements · 6. Quality Attributes ·
7. Internationalization and Localization Requirements · 8. Other Requirements ·
Appendix A: Glossary · Appendix B: Analysis Models · Appendix C: TBD List ·
Appendix D: Requirements Traceability Matrix

---

# 1. Introduction

## 1.1 Purpose

This document specifies the software requirements for releases **1.0 through 2.0** of
the **Campus Academic and Registration System (CARS)**, which replaces Northern
Regional University's fourteen-year-old student information system for course
registration and academic administration.

| Reader | Uses this document to |
|---|---|
| Development team | Understand what to build and what "done" means for each capability |
| Test team | Derive test cases; every functional requirement is written to be pass/fail testable |
| Project manager | Scope releases and estimate effort |
| Registrar and academic office | Confirm that the encoded rules match the Academic Regulations |

## 1.2 Document Conventions

**Requirement identifiers** have the form `<Feature>-<n>` — for example `Enroll-4`,
`Prereq-1`, `Override-3`. Identifiers are permanent; a deleted requirement's number is
never reused. Quality attribute requirements use `QA-<n>`.

**The word "shall"** expresses an obligation. Sentences using "should", "may" or "will"
are explanatory text, not requirements.

**Priority** — High, Medium or Low — is taken from the requirement prioritization
worksheet (R6), which is the master.

**References.** Business rules appear as `BR-n` only; rule text lives in the Business
Rules document. Use cases appear as `UC-nn`. Data elements are defined in the Data
Dictionary.

**Quality attributes** are written in Planguage (Gilb) with SCALE, METER, MUST and PLAN.

## 1.3 Project Scope

CARS is the authoritative record of a student's enrollment from matriculation to
graduation. It publishes the section catalog, lets students plan and register, decides
each enrollment against curriculum, capacity, timetable and financial rules in one
transaction, administers overrides and waitlists, and shows each student their degree
progress and account balance.

CARS does **not** replace the finance system, the learning management system, the
timetable system or the university SSO. The controlling statement of scope, release
content and exclusions is the **Vision and Scope document** §2.1–2.4.

The business objectives CARS exists to achieve are BO-1 … BO-6 in Vision and Scope
§1.3. Every system feature in section 3 traces to at least one of them.

## 1.4 References

| # | Document | Version | Location |
|---|---|---|---|
| R1 | Vision and Scope Document for CARS | 1.0 | `deliverables/01-Vision-and-Scope.md` |
| R2 | Use Cases for CARS | 1.0 | `deliverables/02-Use-Cases.md` |
| R3 | Business Rules for CARS | 1.0 | `deliverables/03-Business-Rules.md` |
| R4 | Data Dictionary for CARS | 1.0 | `deliverables/05-Data-Dictionary.md` |
| R5 | Mock-ups for Complex Use Cases | 1.0 | `deliverables/06-Mockups.md` |
| R6 | Requirement Prioritization Worksheet | 1.0 | `deliverables/07-Requirements-Prioritization.xlsx` |
| R7 | Requirement Estimation | 1.0 | `deliverables/08-Requirements-Estimation.xlsx` |
| R8 | NRU Academic Regulations | 2026 edition | Registrar's office |
| R9 | Wiegers, K. & Beatty, J., *Software Requirements*, 3rd ed. | 2013 | Microsoft Press |
| R10 | Elicitation session notes 1–4 | — | Team shared folder, `elicitation/` |

**Elicitation method note.** Stakeholder input came from four simulated stakeholder
sessions (R10) plus **document analysis of the Academic Regulations** (R8), which
yielded seven of the twenty business rules. Where an answer was unavailable the item is
recorded in the TBD list (Appendix C) rather than invented.

---

# 2. Overall Description

## 2.1 Product Perspective

CARS is a **replacement** for an existing system, which makes it an enhancement and
replacement project in the sense of Wiegers Chapter 21: the requirements are
constrained by an existing process, existing data and existing regulations, and a gap
analysis matters more than a greenfield feature list.

The legacy system is decommissioned only after one complete, successful registration
window (R1 §3.3). The context diagram is in Appendix B.

**Systems CARS exchanges data with**

| External system | Direction | What crosses the boundary |
|---|---|---|
| University SSO | In | Authentication assertion and role claims |
| Finance / bursar system | In | Outstanding balance and registration hold status |
| Timetable system | In | Section meeting patterns, rooms, lecturers |
| Learning management system | Out / in | Confirmed enrollments out; final grades in |
| Notification service | Out | Student and staff email and SMS |

## 2.2 User Classes and Characteristics

| User class | Size | Frequency of use | Technical skill | Favored |
|---|---|---|---|---|
| **Student** | 12,000 | Intense during a 72-hour window; occasional otherwise | Varies; assume none | **Yes** |
| **Academic Office Staff** | 14 | Continuously during registration | Medium | **Yes** |
| **Department Head** | 6 | Daily during registration | Low — teaching staff, not administrators | No |
| **Academic Advisor** | ~40 | Weekly, peaking before windows | Medium | No |
| **Registrar** | 2 | Daily | High | No |
| **Finance Officer** | 3 | Weekly, peaking at registration | Medium | No |
| **System Administrator** | 2 | Occasionally | High | No |

**Favored user classes.** Student and Academic Office Staff. Where their needs conflict
with another class's, theirs win. This is the Vice-Rector's decision: the project exists
because students could not register and staff could not keep up.

**The consequence for design.** The Student class is both favored *and* the largest,
least trained and most concentrated in time. It is why QA-1 through QA-4 exist, and why
UC-02 (planning before the window) is in Release 1.0 rather than deferred.

## 2.3 Operating Environment

| # | Requirement |
|---|---|
| OE-1 | CARS shall operate in the university data centre, sized for the registration peak rather than the average. |
| OE-2 | Student-facing interfaces shall run in current versions of Chrome, Edge, Safari and Firefox, at a minimum viewport width of 360 px. |
| OE-3 | Staff interfaces shall run in the same browsers at a minimum viewport width of 1280 px. |
| OE-4 | CARS shall remain usable on a 3G mobile connection for the catalog, planning and enrollment paths. |
| OE-5 | CARS shall present all times in Asia/Ho_Chi_Minh and store them with an explicit UTC offset. |

## 2.4 Design and Implementation Constraints

| # | Constraint | Origin |
|---|---|---|
| CO-1 | CARS shall authenticate every user through the university SSO and shall not maintain a student password store. | EX-8, corporate security policy |
| CO-2 | CARS shall not build or modify timetables; it consumes the published timetable. | EX-3 |
| CO-3 | CARS shall not process payments, refunds or scholarship decisions. | EX-2 |
| CO-4 | CARS shall store no payment instrument detail at any time. | Finance policy |
| CO-5 | Every rule marked Dynamic in R3 §2.2 shall be changeable by configuration by the named role, without a software release. | Business Rules §2.2 |
| CO-6 | Rules versioned by catalog year — BR-02, BR-04, BR-13 — shall retain every prior version, and shall never re-assess an existing student against a later version. | Academic Regulations §9.1 |
| CO-7 | The finance interface shall be isolated behind an adapter so that a synchronous API and a nightly file exchange are interchangeable without changing enrollment logic. | RI-1 |

## 2.5 Assumptions and Dependencies

**Assumptions** (from R1 §1.7)

- A1: A 72-hour window in three priority waves continues to be the registration model.
- A2: At least 90% of programmes can be expressed as machine-evaluable curriculum rules.
- A3: Transcript data is complete for students enrolled from 2019 onward.
- A4: Student authentication continues to be provided by the university SSO.
- A5: The timetable system remains the authority for when and where a section meets.
- A6: Every enrolled student has a reachable university email address.

**Dependencies**

- D1: A finance system interface, whose form depends on the vendor (RI-1).
- D2: A signed university policy setting the 48-hour override SLA (BR-12).
- D3: Faculty curriculum committees to validate encoded degree requirements before Release 1.0.
- D4: A Registrar's office data steward, 8 hours per week during requirements and migration.

> **If A2 is wrong, Release 1.0 is wrong.** Every enrollment decision in §3.3 depends
> on prerequisite rules being machine-evaluable. Programmes that cannot be expressed are
> handled as Indeterminate by design (Prereq-5), but if the proportion is materially
> above 10% the staff-hours objective BO-2 is unreachable and scope must be revisited.

---

# 3. System Features

## 3.1 Course catalog search and browsing

**Description.** Publication and search of the section catalog. Realizes FE-1 · UC-01 ·
Objective BO-1. **Priority:** High · **Release:** 1.0

**Catalog-1:** The system shall display, for each section, the course code, title, credits, lecturer, meeting pattern, published capacity and remaining capacity.

**Catalog-2:** The system shall permit a student to filter sections by faculty, course code, keyword, day, time range, lecturer and availability.

**Catalog-3:** The system shall compute remaining capacity in accordance with BR-03 and shall serve no capacity figure older than 60 seconds.

**Catalog-4:** The system shall mark as ineligible, with the reason, any section the viewing student's programme does not permit.

**Catalog-5:** The system shall display a section whose meeting pattern has not been published by the timetable system, marked as having times to be confirmed, and shall not permit enrollment in it.

**Catalog-6:** The system shall state which filter excluded all results when a search returns nothing.

**Catalog-7:** The system shall serve a cached catalog no more than 15 minutes old, marked with its age, when the catalog source is unavailable.

## 3.2 Schedule planning

**Description.** Provisional timetable building before a window opens. Realizes FE-2 ·
UC-02 · Objective BO-1. **Priority:** High · **Release:** 1.0

**Plan-1:** The system shall permit a student to add sections to a named plan and to hold up to three plans concurrently.

**Plan-2:** The system shall identify and mark every meeting-time overlap between sections in a plan, in accordance with BR-07.

**Plan-3:** The system shall evaluate prerequisites for every planned section and shall mark each section whose prerequisites are not satisfied.

**Plan-4:** The system shall total the credits in a plan and shall mark the plan when the total exceeds the student's credit limit, stating the excess.

**Plan-5:** The system shall confer no seat, no reservation and no registration priority on a plan, and shall state this to the student.

**Plan-6:** The system shall mark a planned section that has been cancelled and shall offer alternative sections of the same course.

**Plan-7:** The system shall submit every section of a plan for enrollment in the order the student specifies, and shall report the outcome of each section separately.

## 3.3 Enrollment transaction

**Description.** The single automated enrollment decision. Realizes FE-3 · UC-03 ·
Objectives BO-1, BO-2, BO-4. **Priority:** High · **Release:** 1.0

**Enroll-1:** The system shall accept an enrollment request only while the requesting student's priority wave is open, in accordance with BR-06.

**Enroll-2:** The system shall reject an enrollment request for a section in which the student already holds an enrollment, in accordance with BR-01.

**Enroll-3:** The system shall reject an enrollment request from a student carrying an active advising hold, in accordance with BR-14, and shall name the advisor to contact.

**Enroll-4:** The system shall reject an enrollment request whose section overlaps in meeting time with any section the student is already enrolled in, in accordance with BR-07, and shall name the conflicting section.

**Enroll-5:** The system shall reject an enrollment request that would take the student above the credit limit for their year of study, in accordance with BR-04, and shall state the limit and the current total.

**Enroll-6:** The system shall claim a seat only while remaining capacity computed per BR-03 is greater than zero, and shall never issue the same seat to two students.

**Enroll-7:** The system shall enroll a student in both sections of a co-requisite pair as a single transaction, or in neither, in accordance with BR-20.

**Enroll-8:** The system shall complete an enrollment in full or shall change no state, and shall record the decision, its reason and every rule evaluated whether the request succeeded or failed.

**Enroll-9:** The system shall publish a confirmed enrollment to the learning management system.

**Enroll-10:** The system shall offer the waitlist or a capacity override request, where the course permits one, when an enrollment is rejected for capacity.

## 3.4 Prerequisite and co-requisite rule engine

**Description.** Automated evaluation of curriculum rules. Realizes FE-4 · UC-04 ·
Objective BO-2. **Priority:** High · **Release:** 1.0

**Prereq-1:** The system shall evaluate a student's completed courses against every prerequisite rule attached to a course, including the minimum grade specified, in accordance with BR-02.

**Prereq-2:** The system shall return a result of Met, Unmet or Indeterminate for every evaluation, and shall name the specific unsatisfied rule for an Unmet result.

**Prereq-3:** The system shall treat a prerequisite currently in progress as provisionally met, and shall re-evaluate the enrollment when the final grade is posted.

**Prereq-4:** The system shall evaluate co-requisite rules against the student's in-progress and planned enrollments, in accordance with BR-20.

**Prereq-5:** The system shall return Indeterminate, and shall raise a configuration alert, when a course has no curriculum rules attached, and shall not return Met.

**Prereq-6:** The system shall return Indeterminate for a student whose transcript is flagged as incomplete, and shall route the evaluation to Academic Office Staff.

**Prereq-7:** The system shall accept a course recorded as equivalent to a prerequisite, and shall record which equivalence mapping was applied.

**Prereq-8:** The system shall evaluate curriculum rules using the version in force for the student's catalog year, in accordance with CO-6.

**Prereq-9:** The system shall raise an enrollment-invalid exception, and shall notify the student and their advisor, when a posted grade makes a provisionally met prerequisite unmet.

## 3.5 Financial eligibility evaluation

**Description.** Automated financial standing check at enrollment. Realizes FE-5 ·
UC-05 · Objective BO-4. **Priority:** High · **Release:** 1.0

**Finance-1:** The system shall obtain the outstanding balance and registration hold status of a student from the finance system before confirming an enrollment, in accordance with BR-05.

**Finance-2:** The system shall return a result of Eligible, Blocked or Unknown, and shall record the outstanding amount at the time of a Blocked result.

**Finance-3:** The system shall treat a result of Unknown as a refusal with a retry action, and shall not treat it as Eligible.

**Finance-4:** The system shall treat a student with an active instalment plan in good standing as Eligible irrespective of the outstanding balance.

**Finance-5:** The system shall permit a Finance Officer to clear a block for a named student, and shall record the officer, the reason and an expiry date.

**Finance-6:** The system shall re-evaluate the financial standing of every enrolled student nightly, and shall raise a finance exception rather than removing any enrollment.

**Finance-7:** The system shall store no payment instrument detail and no transaction record, in accordance with CO-4.

## 3.6 Capacity override workflow

**Description.** Tracked request and decision for a place a student cannot otherwise
take. Realizes FE-6 · UC-06 · Objective BO-3. **Priority:** High · **Release:** 1.0

**Override-1:** The system shall permit a student to submit a capacity override request stating a ground and a justification, for a section that permits overrides.

**Override-2:** The system shall route a request to the Department Head owning the section, and shall accept a decision only from that Department Head or a delegate they have named, in accordance with BR-11.

**Override-3:** The system shall record the elapsed time from submission to decision for every request, measured against the deadline in BR-12.

**Override-4:** The system shall present to the decider the student's transcript extract, the section's current enrollment against capacity, the room capacity and every other pending request for the same section.

**Override-5:** The system shall record the decider, the decision time and a mandatory reason for every approval and every decline.

**Override-6:** The system shall escalate to the Registrar any request undecided after the deadline in BR-12, and shall neither approve nor decline it automatically.

**Override-7:** The system shall raise the effective capacity of the section by one for the requesting student only when an override is approved, and shall enroll that student.

**Override-8:** The system shall record an approval that cannot be enrolled, shall notify the student and the decider with the specific blocking condition, and shall hold the approval valid for 72 hours.

**Override-9:** The system shall require explicit confirmation from the decider when an approval would take enrollment above the room capacity published by the timetable system.

## 3.7 Waitlist management

**Description.** A fair queue for full sections, administered automatically. Realizes
FE-7 · UC-07 · Objective BO-3. **Priority:** Medium · **Release:** 1.0

**Wait-1:** The system shall permit a student to join the waitlist of a full section only when that student satisfies every enrollment rule other than capacity.

**Wait-2:** The system shall hold at most one waitlist position per student per course.

**Wait-3:** The system shall offer a released seat to the highest-placed student on the waitlist who still satisfies every enrollment rule, in accordance with BR-08, and shall offer a seat to only one student at a time.

**Wait-4:** The system shall expire an unanswered waitlist offer after the interval defined by BR-09 and shall offer the seat to the next eligible student.

**Wait-5:** The system shall retain the queue position of a student skipped for ineligibility, and shall notify that student why they were skipped.

**Wait-6:** The system shall enroll a student who has opted into automatic acceptance without waiting for a response, and shall notify them afterwards.

**Wait-7:** The system shall delay by one hour the re-offer of a seat declined because of a meeting-time conflict, so that the student may drop the conflicting section.

**Wait-8:** The system shall void an outstanding offer, and shall notify the student with the reason, when the section is cancelled or its capacity is reduced.

## 3.8 Drop, swap and add/drop handling

**Description.** Leaving a section, and exchanging one atomically for another. Realizes
FE-8 · UC-08. **Priority:** High · **Release:** 1.0

**Drop-1:** The system shall permit a drop with no transcript record only within the add/drop period, in accordance with BR-16, and shall state the consequence before asking for confirmation.

**Drop-2:** The system shall release the seat of a dropped section and shall trigger waitlist promotion within 60 seconds.

**Drop-3:** The system shall validate a replacement section in full before releasing the seat of the section being replaced, and shall complete a swap entirely or change nothing.

**Drop-4:** The system shall drop both sections of a co-requisite pair when either is dropped, in accordance with BR-20, and shall state this before confirmation.

**Drop-5:** The system shall warn a student whose drop would take them below the minimum enrolled credits, shall name the recorded consequence, and shall proceed on explicit confirmation.

**Drop-6:** The system shall publish every drop to the learning management system.

## 3.9 Real-time degree audit

**Description.** Continuous visibility of programme progress. Realizes FE-9 · UC-09 ·
Objective BO-6. **Priority:** Medium · **Release:** 1.1

**Audit-1:** The system shall evaluate every requirement group of a student's programme against completed courses, in-progress enrollments and approved transfer credit.

**Audit-2:** The system shall assign each requirement group a status of Satisfied, InProgress, Outstanding or NeedsReview, and shall name the courses that satisfied it.

**Audit-3:** The system shall compute overall completion in accordance with BR-13.

**Audit-4:** The system shall assign NeedsReview, with the reason, to any requirement it cannot evaluate, and shall not assign Satisfied or Outstanding to it.

**Audit-5:** The system shall evaluate a student's programme requirements using the rules in force for their catalog year, and shall state which catalog year was used, in accordance with CO-6.

**Audit-6:** The system shall identify a student as at risk of late graduation in accordance with BR-18.

**Audit-7:** The system shall permit a student to evaluate a prospective course or a prospective programme against their record without changing any stored state.

**Audit-8:** The system shall serve no audit result computed more than 5 minutes earlier.

**Audit-9:** The system shall mark as provisional any requirement whose evaluation depends on a grade under appeal, and shall name the course.

**Audit-10:** The system shall present the requirement groups that completed, and shall mark the remainder as pending with a retry action, when evaluation does not complete within its time budget.

## 3.10 Account balance and payment history

**Description.** The student's view of what they owe. Realizes FE-10 · UC-10 ·
Objective BO-6. **Priority:** Medium · **Release:** 1.1

**Account-1:** The system shall present a student's outstanding balance, the charges composing it, and payments received, obtained from the finance system.

**Account-2:** The system shall compute an estimated cost for a planned schedule in accordance with BR-17, and shall label it as an estimate.

**Account-3:** The system shall state, when a registration block is active, the amount that must be paid to clear it.

**Account-4:** The system shall disclose financial information relating only to the authenticated student themselves.

**Account-5:** The system shall present the time at which financial figures were obtained from the finance system.

**Account-6:** The system shall present the most recently obtained figures together with their age when the finance system is unavailable, and shall not present a balance of zero in that circumstance.

## 3.11 Section viability and cancellation

**Description.** Finding and cancelling under-enrolled sections in time. Realizes FE-11
· UC-11 · Objective BO-5. **Priority:** Low · **Release:** 1.2

**Viability-1:** The system shall evaluate every section against its minimum viable enrollment at the checkpoint defined by BR-10 and shall flag those below it.

**Viability-2:** The system shall apply the minimum viable enrollment configured for the section, or that of its faculty where none is configured, in accordance with BR-15.

**Viability-3:** The system shall release every enrollment and notify every enrolled and waitlisted student when a section is cancelled, in accordance with BR-19, and shall complete the cancellation only when every release has been applied.

**Viability-4:** The system shall present the students affected by a proposed cancellation, and those who would fall below minimum enrolled credits, before the decision is confirmed.

**Viability-5:** The system shall identify, before a cancellation is confirmed, any student for whom the section is required to complete their programme this semester, in accordance with BR-18, and shall require explicit acknowledgement.

**Viability-6:** The system shall record the decider, the time and a reason for every cancellation and for every decision to run a section below its minimum.

**Viability-7:** The system shall move students between merged sections only where no meeting-time conflict results, and shall list those who could not be moved.

**Viability-8:** The system shall raise a follow-up task for the academic office when a cancellation notification cannot be delivered.

## 3.12 Registration window administration

**Description.** Control of the window and its priority waves. Realizes FE-12 · UC-12 ·
Objective BO-1. **Priority:** High · **Release:** 1.0

**Window-1:** The system shall determine, for any student at any moment, whether their priority wave is open, in accordance with BR-06.

**Window-2:** The system shall reject a window configuration whose waves overlap or whose waves do not include every active student exactly once, and shall name the students or the overlap concerned.

**Window-3:** The system shall reject the opening of a window for a semester that has no published section catalog.

**Window-4:** The system shall record the actor, the time and a reason for every change to a window.

**Window-5:** The system shall permit the Registrar to extend an open window, and shall notify every affected student.

**Window-6:** The system shall permit the Registrar to reopen registration for named students only.

**Window-7:** The system shall allow in-flight enrollment transactions to complete, and shall accept no new ones, when a window is closed.

**Window-8:** The system shall produce, at the close of a window, a summary of enrollments, refusals by reason, outstanding override requests and waitlist depth.

## 3.13 Advising records and holds

**Description.** Recording advice and controlling the advising hold. Realizes FE-13 ·
UC-13. **Priority:** Low · **Release:** 1.2

**Advise-1:** The system shall permit an advisor assigned to a student to record advice given and any agreed plan.

**Advise-2:** The system shall prevent enrollment by a student carrying an active advising hold, in accordance with BR-14.

**Advise-3:** The system shall record the actor, the time and a reason whenever an advising hold is placed or lifted.

**Advise-4:** The system shall permit a hold to be placed with an expiry date, after which it ceases to apply.

**Advise-5:** The system shall present to a student the existence of a hold, its reason category and the advisor to contact, and shall not present the advising notes to the student.

**Advise-6:** The system shall apply a hold to future enrollment only, and shall not reverse enrollments already made.

**Advise-7:** The system shall report to the Registrar, 72 hours before a window opens, the number of students still carrying an unlifted hold.

## 3.14 Enrollment and capacity reporting

**Description.** Reporting against the six business objectives. Realizes FE-14 · UC-14.
**Priority:** Low · **Release:** 2.0

**Report-1:** The system shall present enrollment counts, capacity utilisation, refusal reasons and override activity for a selected period and scope.

**Report-2:** The system shall compute every reported figure using the definition recorded for the corresponding success metric in Vision and Scope §1.4.

**Report-3:** The system shall restrict the faculties, departments and programmes visible in a report to those permitted by the requesting user's role, and shall state when a result has been limited by permission.

**Report-4:** The system shall present override decision times measured against the deadline in BR-12, per department.

**Report-5:** The system shall present a state indicating that no data exists for a selected period, distinct from a value of zero.

**Report-6:** The system shall exclude individual student financial detail from every report available to an academic user.

**Report-7:** The system shall produce a registration-window summary automatically when a window closes.

---

# 4. Data Requirements

## 4.1 Logical Data Model

The entity-relationship model is in **Appendix B**, Figure B-2. It is a *logical* model
describing the data the university deals with, not a database schema.

| Entity | Relationship |
|---|---|
| Programme | 1 → n Requirement Group · 1 → n Student |
| Requirement Group | n → n Course |
| Course | 1 → n Section · 1 → 0..n Prerequisite Rule · n → 0..n Course (co-requisite) |
| Section | 1 → n Meeting Pattern · 1 → n Enrollment · 1 → 0..n Waitlist Entry · 1 → 0..n Override Request |
| Student | 1 → n Enrollment · 1 → n Transcript Entry · 1 → 0..n Advising Hold · 1 → 0..n Advising Record · 1 → 0..1 Financial Standing |
| Registration Window | 1 → 3 Priority Wave |
| Degree Audit Result | 1 → n Requirement Group Result · 1 → 1 Student |

Two relationships constrain design more than the rest. **Course → Course
(co-requisite)** is symmetric and must be stored as such, or BR-20 becomes
unenforceable in one direction. **Programme rules are versioned by catalog year**
(CO-6), so the Programme → Requirement Group relationship is not simply current-state:
every prior version must remain retrievable.

## 4.2 Data Dictionary

The definition, composition, type, length and allowed values of every data element are
held in the separate **Data Dictionary** document (R4), which contains 91 entries.

## 4.3 Reports

| ID | Report | Content and sort order | Audience | Frequency |
|---|---|---|---|---|
| RPT-1 | Registration window summary | Enrollments, refusals by reason, overrides outstanding, waitlist depth; by faculty | Registrar, Vice-Rector | At window close |
| RPT-2 | Capacity utilisation | Enrollment against capacity per section; sorted by utilisation ascending | Department Head | Weekly during registration |
| RPT-3 | Override activity and SLA | Requests, decisions, median and 90th-percentile decision time against BR-12; by department | Registrar | Weekly during registration |
| RPT-4 | Section viability | Sections below minimum viable enrollment with days to add/drop; sorted by shortfall | Department Head | Daily from the BR-10 checkpoint |
| RPT-5 | Prerequisite exceptions | Enrollments returned Indeterminate or invalidated; sorted by date | Academic Office Staff | Daily during registration |
| RPT-6 | Finance block impact | Students blocked at registration, with amount outstanding banded; **no individual amounts to academic users** | Finance Officer | Daily during registration |
| RPT-7 | Graduation risk | Students identified at risk of late graduation per BR-18; sorted by shortfall | Academic Advisor | Per semester |

Report layouts are deferred to design; this section specifies content, sort order,
audience and frequency.

## 4.4 Data Acquisition, Integrity, Retention and Disposal

| # | Requirement |
|---|---|
| DA-1 | The system shall acquire student, transcript, curriculum and catalog data from the legacy system by a one-time migration, verified against control totals before the legacy freeze is lifted. |
| DA-2 | The system shall flag as incomplete every transcript predating 2019, and shall cause prerequisite evaluation against it to return Indeterminate, in accordance with assumption A3. |
| DA-3 | The system shall record, for every enrollment decision, the time, the outcome, the reason and every rule evaluated, whether the decision succeeded or failed. |
| DA-4 | The system shall retain enrollment and academic records for the lifetime of the student record and shall not delete a transcript entry. |
| DA-5 | The system shall retain advising notes for 7 years after a student's graduation or withdrawal, after which they shall be deleted. |
| DA-6 | The system shall retain registration audit logs for 3 years. |
| DA-7 | The system shall verify daily that every seat claimed is matched by exactly one enrollment or one approved override, and shall raise a data-quality alert on any discrepancy. |
| DA-8 | The system shall retain every prior version of a catalog-year-versioned rule, in accordance with CO-6. |

---

# 5. External Interface Requirements

## 5.1 User Interfaces

| # | Requirement |
|---|---|
| UI-1 | The system shall provide four interfaces: the student interface, the academic staff interface, the department head interface and the advisor interface. |
| UI-2 | The student interface shall be usable on a mobile device at 360 px viewport width for catalog, planning, enrollment, degree audit and account views. |
| UI-3 | Every refusal shall state which specific rule refused the request, the value that caused it, and what the user can do next. |
| UI-4 | Every irreversible action shall require a confirmation that names the object being acted on and states the consequence. |
| UI-5 | The system shall require no training material for the student interface; a student shall be able to complete an enrollment without instruction. |
| UI-6 | Screen designs for the three most complex use cases are illustrated in R5; where R5 and this document differ, this document governs. |

## 5.2 Software Interfaces

| ID | Interface | Direction | Content | Service level |
|---|---|---|---|---|
| SI-1 | University SSO — authentication | In | Authentication assertion and role claims (CO-1) | Per university standard |
| SI-2 | Finance system — eligibility query | In | Outstanding balance and registration hold (CO-7) | Response within 5 s; Unknown after retry (Finance-3) |
| SI-3 | Finance system — account detail | In | Charges, payments, instalment plan | Best effort; stale display permitted (Account-6) |
| SI-4 | Timetable system — section catalog | In | Sections, meeting patterns, rooms, lecturers | Published at least 14 days before a window |
| SI-5 | Timetable system — room capacity | In | Physical room capacity per section | Read at override decision time (Override-9) |
| SI-6 | Learning management system — enrollment publication | Out | Confirmed enrollments and drops | Within 5 minutes of the change |
| SI-7 | Learning management system — grade import | In | Final grades per student per section | Nightly; triggers Prereq-9 re-evaluation |
| SI-8 | Notification service — student and staff messages | Out | Wave opening, override outcome, waitlist offer, cancellation | Within 5 minutes of the triggering event |

**SI-2 and SI-3 shall be isolated behind an adapter** so that a synchronous API and a
nightly file exchange are interchangeable (CO-7, risk RI-1).

## 5.3 Hardware Interfaces

| # | Requirement |
|---|---|
| HI-1 | The system shall require no special-purpose hardware. |
| HI-2 | The system shall function on the student-owned devices in common use at NRU, including devices four years old on a 3G connection (OE-4). |

## 5.4 Communications Interfaces

| # | Requirement |
|---|---|
| CI-1 | All communication between a browser and CARS shall use HTTPS with TLS 1.2 or later. |
| CI-2 | All communication between CARS and any external system shall use HTTPS with TLS 1.2 or later. |
| CI-3 | The system shall place no student identifier and no personal data in a URL query string that is written to an access log. |
| CI-4 | Notifications shall contain no financial amount and no advising note; they shall link to the authenticated view instead. |

---

# 6. Quality Attributes

Written in Planguage: SCALE, METER, MUST, PLAN. An attribute without a number is an
opinion, not a requirement.

## 6.1 Performance and Scalability

#### QA-1 — Peak concurrent registration load
| | |
|---|---|
| **SCALE** | Simultaneous authenticated sessions sustained with 95th-percentile response ≤ 2 s across catalog, planning and enrollment |
| **METER** | Load test at the rehearsal window, then observed live |
| **MUST** | 4,200 concurrent sessions — the historical peak the legacy system could not serve |
| **PLAN** | 6,000 concurrent sessions (objective BO-1) |
| **Rationale** | The legacy system degraded past 1,800 and crashed in three of the last four windows. This is the single number the project is judged on. |

#### QA-2 — Enrollment transaction latency
| | |
|---|---|
| **SCALE** | Seconds from a student submitting an enrollment request to receiving the decision |
| **METER** | Instrumented timing, 95th percentile, per wave opening |
| **MUST** | ≤ 4 s at peak |
| **PLAN** | ≤ 1.5 s at peak; ≤ 0.8 s off peak |
| **Rationale** | Seven rule evaluations and a capacity claim happen inside this number. A slow decision at a wave opening produces retries, which multiply the load that caused it. |

#### QA-3 — Catalog read throughput
| | |
|---|---|
| **SCALE** | Catalog reads served per second with 95th-percentile response ≤ 1 s |
| **METER** | Load test at 1.5× the projected peak |
| **MUST** | 2,800 reads/second |
| **PLAN** | 4,200 reads/second |
| **Rationale** | Browsing, not enrollment, is where the volume is (UC-01). The legacy system recomputed capacity per row per request; Catalog-3 permits a 60-second cache for exactly this reason. |

#### QA-4 — Seat integrity under contention
| | |
|---|---|
| **SCALE** | Number of seats issued to more than one student, or lost without being issued, per registration window |
| **METER** | Reconciliation per DA-7, plus fault-injection testing at peak concurrency |
| **MUST** | 0 |
| **PLAN** | 0 |
| **Rationale** | Requirement Enroll-6. A double-issued seat is discovered by a student arriving at a full classroom, which is the most expensive possible time to discover it. |

## 6.2 Availability and Reliability

#### QA-5 — Availability during a registration window
| | |
|---|---|
| **SCALE** | Percentage of minutes in an open registration window during which catalog, planning and enrollment are all available |
| **METER** | Uptime monitoring, per window |
| **MUST** | 99.5% |
| **PLAN** | 100% — **zero outages** is the acceptance criterion in Vision and Scope §3.2 |

#### QA-6 — Recovery time during a window
| | |
|---|---|
| **SCALE** | Minutes from an unplanned outage being detected to registration resuming |
| **METER** | Disaster-recovery rehearsal before each window |
| **MUST** | ≤ 30 minutes with no enrollment lost |
| **PLAN** | ≤ 10 minutes with no enrollment lost |

#### QA-7 — Atomicity of academic transactions
| | |
|---|---|
| **SCALE** | Number of students left in a partial state — half a co-requisite pair, a swap with neither section, an override approved and neither enrolled nor recorded |
| **METER** | Fault-injection testing of enrollment, swap and override |
| **MUST** | 0 |
| **PLAN** | 0 (Enroll-8, Drop-3, Override-8) |

## 6.3 Usability and Accessibility

#### QA-8 — Enrollment without instruction
| | |
|---|---|
| **SCALE** | Percentage of first-time students who complete an enrollment unaided at the first attempt |
| **METER** | Observed session with 20 first-year volunteers before the rehearsal window |
| **MUST** | ≥ 90% |
| **PLAN** | ≥ 97% |
| **Rationale** | Requirement UI-5. There are 12,000 students and a 72-hour window; an interface needing support cannot be supported. |

#### QA-9 — Comprehensibility of a refusal
| | |
|---|---|
| **SCALE** | Percentage of refused students who can state, unprompted, why they were refused and what to do next |
| **METER** | Same observed session, refusal scenarios |
| **MUST** | ≥ 90% |
| **PLAN** | ≥ 95% |
| **Rationale** | A refusal nobody understands becomes an advising enquiry, which is the cost objective BO-6 exists to reduce. |

#### QA-10 — Accessibility
| | |
|---|---|
| **SCALE** | Conformance level achieved against WCAG 2.1 for the student interface |
| **METER** | Automated scan plus manual audit of the enrollment path |
| **MUST** | Level A, with no blocking issue on the enrollment path |
| **PLAN** | Level AA |

#### QA-11 — Mobile performance
| | |
|---|---|
| **SCALE** | Seconds to interactive for the catalog on a four-year-old mid-range Android device on a 3G connection |
| **METER** | Device testing on the reference handset |
| **MUST** | ≤ 6 s |
| **PLAN** | ≤ 3 s |

## 6.4 Security and Privacy

#### QA-12 — Authorization enforcement
| | |
|---|---|
| **SCALE** | Percentage of privileged operations enforcing the required role on the server rather than only in the interface |
| **METER** | Security review of every operation in section 3 before release |
| **MUST** | 100% |
| **PLAN** | 100%, with automated tests covering override decision (BR-11), hold management and window configuration |

#### QA-13 — Data isolation between students
| | |
|---|---|
| **SCALE** | Number of requests in which one student can obtain another student's transcript, audit, advising note or financial data |
| **METER** | Penetration test of every student-facing endpoint, including identifier substitution |
| **MUST** | 0 |
| **PLAN** | 0 |

#### QA-14 — Audit completeness
| | |
|---|---|
| **SCALE** | Percentage of enrollment decisions, override decisions and hold changes for which actor, time and reason can be retrieved |
| **METER** | Sampling of 50 records per category during requirements validation |
| **MUST** | 100% |
| **PLAN** | 100%, retrievable within 5 seconds |

## 6.5 Maintainability

#### QA-15 — Cost of a regulation change
| | |
|---|---|
| **SCALE** | Working days to apply a change to any rule marked Dynamic in R3 §2.2, for the next catalog year, without a software release |
| **METER** | Measured when the 2027 Academic Regulations are applied |
| **MUST** | ≤ 3 days, with no code change |
| **PLAN** | ≤ 1 day (constraints CO-5, CO-6) |
| **Rationale** | The regulations are revised annually. A system that needs a release to absorb that is out of date within a year of going live. |

---

# 7. Internationalization and Localization Requirements

| # | Requirement |
|---|---|
| IL-1 | The system shall present student-facing interfaces in Vietnamese, with English available for programmes taught in English. |
| IL-2 | The system shall accept and store Vietnamese diacritics in every name field, and shall sort Vietnamese text using Vietnamese collation rules. |
| IL-3 | The system shall present dates as DD/MM/YYYY and times in 24-hour form. |
| IL-4 | The system shall present monetary amounts in Vietnamese dong with no decimal fraction. |
| IL-5 | The system shall store every timestamp with an explicit UTC offset and present it in Asia/Ho_Chi_Minh. |

---

# 8. Other Requirements

| # | Requirement |
|---|---|
| OR-1 | The system shall retain and erase personal data in accordance with Decree 13/2023/ND-CP and the university records retention schedule (DA-4 to DA-6). |
| OR-2 | The system shall be installable into a new environment from version-controlled configuration with no undocumented manual step. |
| OR-3 | The system shall be delivered with an operational runbook covering window opening, load incidents and the manual enrollment fallback. |
| OR-4 | The migration in DA-1 shall be repeatable against a non-production environment without residue from previous runs. |
| OR-5 | The system shall provide a documented manual fallback permitting Academic Office Staff to record a single enrollment during an incident, with reconciliation afterwards. |

---

# Appendix A: Glossary

| Term | Definition |
|---|---|
| **Add/drop period** | The period after a window in which a student may drop with no transcript record; BR-16 |
| **Advising hold** | A block preventing enrollment until an advisor lifts it; BR-14 |
| **Catalog year** | The academic year whose regulations a student is assessed against; CO-6 |
| **Co-requisite** | A course that must be taken in the same semester as another; BR-20 |
| **Credit limit** | Maximum credits a student may enroll in per semester; BR-04 |
| **Degree audit** | The evaluation of a student's record against their programme's requirements |
| **Minimum viable enrollment** | Enrollment below which a section is under-enrolled; BR-15 |
| **Override** | Permission for a student to enter a section they cannot otherwise take; UC-06 |
| **Prerequisite** | A course that must be completed before another; BR-02 |
| **Priority wave** | One cohort's registration opening period; BR-06 |
| **Registration window** | The 72-hour period in which registration is open |
| **Remaining capacity** | Seats still available in a section; BR-03 |
| **Section** | One scheduled offering of a course in one semester |
| **Waitlist** | The queue for a full section; BR-08, BR-09 |

# Appendix B: Analysis Models

| Figure | Model | Location |
|---|---|---|
| B-1 | System context diagram | `diagrams/use-case-diagram.png` (boundary and external actors) |
| B-2 | Logical data model (ERD) | *to be produced in design; entities and relationships listed in §4.1* |
| B-3 | Use case diagram | `diagrams/use-case-diagram.png` · editable source `diagrams/use-case-diagram.drawio` |
| B-4 | Enrollment state model | States listed under *Enrollment Status* in the Data Dictionary; transitions given by use case postconditions |
| B-5 | Override request state model | States listed under *Request Status*; transitions given by UC-06 |
| B-6 | Screen mock-ups | `mockups/` — see R5 |

# Appendix C: TBD List

| # | Open question | Affects | Owner | Target |
|---|---|---|---|---|
| TBD-1 | Does the credit limit in BR-04 count in-progress repeats, or only new enrollments? | Enroll-5 | Registrar | Week 6 |
| TBD-2 | Is the 48-hour SLA in BR-12 working hours or calendar hours? | Override-3, Override-6 | Registrar | Week 6 |
| TBD-3 | When a co-requisite pair is broken by a cancellation, is the survivor dropped automatically or referred to an advisor? | Drop-4, Viability-3 | Registrar | Week 7 |
| TBD-4 | Does the finance threshold in BR-05 apply per semester or cumulatively? | Finance-1 | Finance Officer | Week 7 |
| TBD-5 | Which programmes cannot be expressed as machine-evaluable rules, and how many students do they affect? | Prereq-5, assumption A2 | Registrar, curriculum committees | Week 8 — **blocks the BO-2 commitment** |

# Appendix D: Requirements Traceability Matrix

| Feature (R1 §2.1) | SRS section | Use case (R2) | Functional requirements | Business rules (R3) | Objective |
|---|---|---|---|---|---|
| FE-1 Catalog search | 3.1 | UC-01 | Catalog-1 … Catalog-7 | BR-03, BR-06 | BO-1 |
| FE-2 Schedule planning | 3.2 | UC-02 | Plan-1 … Plan-7 | BR-02, BR-04, BR-07, BR-14, BR-20 | BO-1 |
| FE-3 Enrollment transaction | 3.3 | UC-03 | Enroll-1 … Enroll-10 | BR-01, BR-03, BR-04, BR-06, BR-07, BR-14, BR-20 | BO-1, BO-2, BO-4 |
| FE-4 Prerequisite engine | 3.4 | UC-04 | Prereq-1 … Prereq-9 | BR-02, BR-20 | BO-2 |
| FE-5 Financial eligibility | 3.5 | UC-05 | Finance-1 … Finance-7 | BR-05, BR-17 | BO-4 |
| FE-6 Override workflow | 3.6 | UC-06 | Override-1 … Override-9 | BR-02, BR-03, BR-11, BR-12 | BO-3 |
| FE-7 Waitlist | 3.7 | UC-07 | Wait-1 … Wait-8 | BR-03, BR-07, BR-08, BR-09 | BO-3 |
| FE-8 Drop and swap | 3.8 | UC-08 | Drop-1 … Drop-6 | BR-04, BR-07, BR-08, BR-16, BR-20 | — |
| FE-9 Degree audit | 3.9 | UC-09 | Audit-1 … Audit-10 | BR-02, BR-13, BR-18, BR-20 | BO-6 |
| FE-10 Account balance | 3.10 | UC-10 | Account-1 … Account-6 | BR-05, BR-17 | BO-6 |
| FE-11 Section viability | 3.11 | UC-11 | Viability-1 … Viability-8 | BR-07, BR-10, BR-15, BR-18, BR-19 | BO-5 |
| FE-12 Window administration | 3.12 | UC-12 | Window-1 … Window-8 | BR-06 | BO-1 |
| FE-13 Advising and holds | 3.13 | UC-13 | Advise-1 … Advise-7 | BR-14 | BO-6 |
| FE-14 Reporting | 3.14 | UC-14 | Report-1 … Report-7 | BR-03, BR-10, BR-12, BR-13 | All |

**Objectives covered by quality attributes rather than features:** the outage half of
BO-1 by QA-1, QA-3 and QA-5; the "zero incorrect enrollments" half of BO-2 by QA-4 and
Prereq-5; the advising-reduction half of BO-6 by QA-9.
