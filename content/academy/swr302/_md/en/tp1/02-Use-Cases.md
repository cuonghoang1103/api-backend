# Use Cases
## for the Campus Academic and Registration System (CARS)

Version 1.0 approved
Prepared by **<Team Leader name>**, Business Analysis Team — Group <N>
Northern Regional University (NRU)
17 September 2026

---

### Revision History

| Name | Date | Reason For Changes | Version |
|---|---|---|---|
| BA Team, Group <N> | 2026-09-17 | Initial use case list from elicitation sessions 1–3 | 0.9 |
| BA Team, Group <N> | 2026-09-17 | All 14 specifications completed and cross-reviewed | 1.0 |

---

## 1. Actors

### 1.1 Primary actors

| Actor | Description |
|---|---|
| **Student** | 12,000 users. Plans a schedule, registers, drops, requests overrides, views their own degree audit and balance. |
| **Academic Advisor** | ~40 users. Advises students, records advice, places and lifts advising holds. |
| **Academic Office Staff** | 14 users. Handles enrollment exceptions the automated rules could not resolve. |
| **Department Head** | 6 users. Decides capacity overrides for their department's sections; cancels under-enrolled sections. |
| **Registrar** | 2 users. Opens, extends and closes registration windows; owns academic regulation configuration. |
| **Finance Officer** | 3 users. Reviews and resolves finance holds raised at registration. |
| **System Administrator** | 2 users. Configures curriculum rules, programmes, credit limits and integrations. |

### 1.2 Secondary actors (external systems)

| Actor | Description |
|---|---|
| **Finance / Bursar System** | Holds each student's balance and payment history. Read-only from CARS (EX-2). |
| **University SSO** | Authenticates every user. CARS holds no student password (EX-8). |
| **Timetable System** | Publishes when and where each section meets. CARS consumes it and never edits it (EX-3). |
| **Learning Management System** | Receives confirmed enrollments; supplies final grades back to the transcript. |
| **Notification Service** | Sends email and SMS to students and staff on behalf of CARS. |

> **Why the student information system of record is not listed as an actor.** CARS
> *becomes* that system at cutover; it is not an external party. Legacy data is a
> one-time migration described in Vision & Scope §3.3, not a runtime interface, and it
> therefore appears in SRS §4.4 rather than here.

---

## 2. Use Case List

| ID | Primary Actor | Secondary Actor | Use Case name | Description |
|---|---|---|---|---|
| UC-01 | Student | Timetable System | Search and browse the course catalog | Find sections by course, faculty, time or lecturer, with live remaining capacity |
| UC-02 | Student | — | Build a planned schedule | Assemble a provisional timetable before the window opens, with conflicts flagged |
| UC-03 | Student | Finance System | Register for a course section | The single enrollment transaction — prerequisite, capacity, conflict and finance decided at once |
| UC-04 | CARS (event) | — | Validate prerequisites and co-requisites | Evaluate a student's transcript against the curriculum rules for a course |
| UC-05 | CARS (event) | Finance System | Evaluate financial eligibility | Decide whether a student's financial standing permits enrollment |
| UC-06 | Student → Department Head | Notification Service | Request and decide a capacity override | A tracked request-and-decision workflow with a 48-hour deadline |
| UC-07 | Student | Notification Service | Join and be promoted from a waitlist | Queue for a full section and be offered a seat automatically when one is released |
| UC-08 | Student | — | Drop or swap a section | Leave a section, or exchange one for another atomically, inside the add/drop period |
| UC-09 | Student | — | View the real-time degree audit | See which programme requirements are met, in progress and outstanding |
| UC-10 | Student | Finance System | View account balance and payment history | See what is owed and what has been paid, without contacting the office |
| UC-11 | Department Head | Notification Service | Identify and cancel an under-enrolled section | Detect sections below minimum viable enrollment and cancel them in time |
| UC-12 | Registrar | — | Open, extend or close a registration window | Control the window and its priority waves |
| UC-13 | Academic Advisor | — | Advise a student and manage an advising hold | Record advice; place or lift a hold that blocks enrollment |
| UC-14 | Registrar | — | Produce enrollment and capacity reports | Report on enrollment, capacity utilisation and override activity |

> **Traceability to Vision & Scope features:** UC-01→FE-1 · UC-02→FE-2 · UC-03→FE-3 · UC-04→FE-4 · UC-05→FE-5 · UC-06→FE-6 · UC-07→FE-7 · UC-08→FE-8 · UC-09→FE-9 · UC-10→FE-10 · UC-11→FE-11 · UC-12→FE-12 · UC-13→FE-13 · UC-14→FE-14

---

## 3. Use Case Specifications

### UC-01 — Search and browse the course catalog

| | |
|---|---|
| **UC ID and Name** | UC-01 — Search and browse the course catalog |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Student | **Secondary Actors** | Timetable System |
| **Trigger** | The student opens the catalog, from the portal or from the planner in UC-02. |
| **Description** | A student finds the sections available to them in the coming semester, filtered by course, faculty, meeting time, lecturer or remaining capacity. The catalog is by far the highest-volume read in the system and most of the registration-window load lands here rather than on enrollment itself. |
| **Preconditions** | PRE-1: The student is authenticated through the university SSO. <br> PRE-2: A section catalog has been published for the semester being browsed. |
| **Postconditions** | POST-1: No enrollment state is changed by browsing. <br> POST-2: Remaining capacity shown is computed at read time per BR-03, not cached beyond 60 seconds. |
| **Normal Flow** | **1.0** <br> 1. The student opens the catalog for the current registration semester. <br> 2. The system displays the sections the student's programme permits, with course code, title, credits, lecturer, meeting pattern and remaining capacity. <br> 3. The student applies filters — faculty, day, time, remaining capacity greater than zero, keyword. <br> 4. The system returns the filtered sections. <br> 5. The student opens a section to see its prerequisites, co-requisites and full description. |
| **Alternative Flows** | **1.1 — Browse before a window is open.** The catalog is browsable at any time; the system marks each section "registration opens <date>" rather than offering an enroll action. <br> **1.2 — Browse another programme's courses.** The student removes the programme filter; the system shows all sections but marks those outside their programme as ineligible with the reason. <br> **1.3 — Search by lecturer.** The student searches by lecturer name and the system returns that lecturer's sections. |
| **Exceptions** | **1.0.E1 — Timetable not yet published.** At step 2 the timetable system has no meeting pattern for a section. The system lists the section with "times to be confirmed" and permits planning but not enrollment. <br> **1.0.E2 — Catalog unavailable.** The catalog service does not respond. The system presents a cached catalog no older than 15 minutes, marked with its age, rather than an error page. <br> **1.0.E3 — Search returns nothing.** The system states which filter excluded everything and offers to relax it, rather than showing an empty list. |
| **Priority** | High |
| **Frequency of Use** | Extreme and concentrated: ~12,000 students, an average of 40 catalog reads each during the 72-hour window, with ~65% in the first 30 minutes of each of the three waves. Peak ~2,800 reads/second. |
| **Business Rules** | BR-03, BR-06 |
| **Other Information** | This use case, not UC-03, is what determines whether the system survives the window (objective BO-1). The legacy system failed here: it recomputed capacity per row per request. POST-2 permits a short cache precisely so that capacity can be read cheaply without being wrong enough to matter. |
| **Assumptions** | The timetable system publishes the complete section catalog at least 14 days before a window opens. |

### UC-02 — Build a planned schedule

| | |
|---|---|
| **UC ID and Name** | UC-02 — Build a planned schedule |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Student | **Secondary Actors** | — |
| **Trigger** | The student adds a section to their plan from the catalog. |
| **Description** | Before the window opens, the student assembles a provisional timetable and the system tells them, in advance, everything that would block it — time conflicts, missing prerequisites, credit limit, holds. **This is the principal defence against the load problem P1:** a student who has planned needs seconds inside the window, not minutes. |
| **Preconditions** | PRE-1: The student is authenticated. <br> PRE-2: A section catalog has been published for the semester. |
| **Postconditions** | POST-1: The plan holds no seats and confers no priority — it is provisional and the system says so. <br> POST-2: Every blocking condition detectable before the window is shown against the plan. |
| **Normal Flow** | **2.0** <br> 1. The student adds a section to the plan. <br> 2. The system checks the plan for meeting-time conflicts (BR-07) and marks any it finds. <br> 3. The system evaluates prerequisites for each planned section via UC-04 and marks any unmet. <br> 4. The system totals planned credits and compares them with the student's credit limit (BR-04). <br> 5. The system displays the plan as a weekly grid with every warning attached to the section that caused it. <br> 6. The student adjusts the plan and repeats from step 1. |
| **Alternative Flows** | **2.1 — Alternatives for a section.** The student asks for other sections of the same course; the system lists them with conflict and capacity status, so a fallback is ready before the window. <br> **2.2 — Multiple saved plans.** The student saves up to three named plans and compares them side by side. <br> **2.3 — Register the whole plan.** When the window opens, the student submits the plan; the system executes UC-03 for each section in the student's chosen order and reports the outcome per section. |
| **Exceptions** | **2.0.E1 — Planned section is cancelled.** A planned section is cancelled before the window opens. The system marks it in the plan and suggests alternatives; it does not silently remove it. <br> **2.0.E2 — Prerequisite becomes unmet.** A grade posted after planning turns a met prerequisite into an unmet one. The system re-evaluates on plan open and marks it. <br> **2.0.E3 — Credit limit exceeded.** The plan exceeds the limit (BR-04). The system permits the plan to be saved but marks it un-registerable and states by how many credits. |
| **Priority** | High |
| **Frequency of Use** | ~9,000 students build at least one plan per semester; ~2.4 plan edits each. Load is spread over the two weeks before the window, which is the point. |
| **Business Rules** | BR-02, BR-04, BR-07, BR-14, BR-20 |
| **Other Information** | POST-1 is a requirement, not a disclaimer. In elicitation session 2 the Registrar was explicit that a plan must confer no advantage, or students will treat planning as a queue and the fairness of the priority wave system (BR-06) collapses. |
| **Assumptions** | Students will plan in advance if the tool is useful; the 2019 online move showed they do when given one. |

### UC-03 — Register for a course section

| | |
|---|---|
| **UC ID and Name** | UC-03 — Register for a course section |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Student | **Secondary Actors** | Finance / Bursar System, Learning Management System |
| **Trigger** | The student requests enrollment in a section during their open registration wave. |
| **Description** | The core transaction of the whole system. Prerequisite, co-requisite, capacity, time conflict, credit limit, advising hold and financial standing are all evaluated **as one decision at the moment the student clicks**, and the student is told the answer immediately. This replaces a process in which the student was enrolled first and the checks happened afterwards, by hand, sometimes weeks later. |
| **Preconditions** | PRE-1: The student is authenticated and their priority wave is open (BR-06). <br> PRE-2: The section exists and belongs to the open semester. <br> PRE-3: The student is not already enrolled in this section (BR-01). |
| **Postconditions** | POST-1: The student is enrolled in the section and a seat is consumed, **or** no state has changed at all. A partially applied enrollment is never left behind. <br> POST-2: The decision, its reason and every rule evaluated are recorded against the attempt, whether it succeeded or failed. <br> POST-3: On success, the enrollment is published to the learning management system. |
| **Normal Flow** | **3.0** <br> 1. The student requests enrollment in a section. <br> 2. The system verifies the student's wave is open (BR-06) and no advising hold is active (BR-14). <br> 3. The system evaluates prerequisites and co-requisites via UC-04. <br> 4. The system evaluates financial eligibility via UC-05. <br> 5. The system checks for a meeting-time conflict with the student's existing enrollments (BR-07). <br> 6. The system checks the resulting credit total against the credit limit (BR-04). <br> 7. The system claims a seat, provided remaining capacity is greater than zero (BR-03). <br> 8. The system records the enrollment, releases nothing, and confirms to the student. <br> 9. The system publishes the enrollment to the learning management system. |
| **Alternative Flows** | **3.1 — Section full, waitlist offered.** At step 7 remaining capacity is zero. The system offers the waitlist and, if accepted, executes UC-07 instead of enrolling. <br> **3.2 — Section full, override offered.** At step 7 remaining capacity is zero and the course permits overrides. The system offers to raise a capacity override request (UC-06). <br> **3.3 — Co-requisite pair.** The course has a co-requisite (BR-20). The system enrolls the student in both sections as a single transaction, or in neither. <br> **3.4 — Staff-assisted enrollment.** Academic Office Staff perform the enrollment on the student's behalf after resolving an exception, with a recorded reason. |
| **Exceptions** | **3.0.E1 — Prerequisite not met.** At step 3 a prerequisite is unmet (BR-02). The system refuses, names the specific course and the grade required, and offers to raise an override request. No seat is claimed. <br> **3.0.E2 — Financial hold.** At step 4 the student's balance exceeds the threshold (BR-05). The system refuses, states the amount outstanding, and directs the student to UC-10. It does not reveal payment detail beyond the balance. <br> **3.0.E3 — Time conflict.** At step 5 the section overlaps an existing enrollment (BR-07). The system refuses and names the conflicting section and the overlapping time. <br> **3.0.E4 — Credit limit exceeded.** At step 6 the enrollment would exceed the limit (BR-04). The system refuses and states the limit and the current total. <br> **3.0.E5 — Seat lost to a concurrent request.** At step 7 another student claims the last seat first. The system re-reads capacity, retries once, then offers the waitlist per 3.1. **No seat is double-issued.** <br> **3.0.E6 — Finance system unavailable.** At step 4 the finance system does not respond within 5 seconds. The system **refuses the enrollment** with a retry action rather than assuming eligibility, and raises an integration alert. <br> **3.0.E7 — Advising hold active.** At step 2 a hold is present (BR-14). The system refuses and names the advisor to contact. |
| **Priority** | High |
| **Frequency of Use** | ~12,000 students × ~5.6 sections = ~67,000 successful enrollments per semester, ~85% of them inside the 72-hour window, with peak bursts of ~180 enrollment attempts per second in the opening minute of each wave. |
| **Business Rules** | BR-01, BR-02, BR-03, BR-04, BR-05, BR-06, BR-07, BR-14, BR-20 |
| **Other Information** | POST-1 makes this the most demanding transaction in the system: seven independent checks and a capacity claim must succeed or fail together, under the load described above. Exception 3.0.E6 is a deliberate policy choice made with the Finance Officer in session 3 — CARS refuses rather than guesses, because a wrongly enrolled student with an unpaid balance is harder to unwind than a student asked to retry. |
| **Assumptions** | The finance system can answer an eligibility query in under 5 seconds at peak; if not, RI-1's adapter design substitutes a nightly snapshot and the exception path changes accordingly. |

### UC-04 — Validate prerequisites and co-requisites

| | |
|---|---|
| **UC ID and Name** | UC-04 — Validate prerequisites and co-requisites |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | CARS (system, invoked) | **Secondary Actors** | Academic Office Staff |
| **Trigger** | Invoked by UC-02 during planning or UC-03 during enrollment; or run in bulk by staff to audit a cohort. |
| **Description** | The rule engine that replaces 640 staff-hours a semester. It evaluates a student's transcript against the curriculum rules attached to a course and returns a decision with a reason. It is deliberately a separate use case from UC-03 because it is invoked from four places and must behave identically in all of them. |
| **Preconditions** | PRE-1: Curriculum rules exist for the course and have been validated by the faculty curriculum committee (dependency D3). <br> PRE-2: The student's transcript is available. |
| **Postconditions** | POST-1: The result is a decision of Met, Unmet or Indeterminate, never a silent pass. <br> POST-2: An Unmet result names the specific unsatisfied rule and the course that would satisfy it. <br> POST-3: An Indeterminate result — usually pre-2019 transcript data outside assumption A3 — is routed to Academic Office Staff rather than resolved by guessing. |
| **Normal Flow** | **4.0** <br> 1. The system retrieves the curriculum rules attached to the course. <br> 2. The system retrieves the student's completed courses and grades. <br> 3. The system evaluates each prerequisite rule, including minimum grade where specified (BR-02). <br> 4. The system evaluates co-requisite rules against the student's in-progress and planned enrollments (BR-20). <br> 5. All rules are satisfied; the system returns Met. |
| **Alternative Flows** | **4.1 — In-progress prerequisite.** A prerequisite is currently being taken and its grade is not yet posted. The system returns Met-Provisional, permits enrollment, and re-evaluates when the grade is posted. <br> **4.2 — Equivalent course.** The student passed a course mapped as equivalent to the prerequisite; the system accepts the equivalence and records which mapping was used. <br> **4.3 — Transfer credit.** The prerequisite was satisfied by credit transferred from another institution and already approved; the system accepts it. <br> **4.4 — Bulk audit.** Staff run the engine across a cohort to find enrollments that are no longer valid after grades were posted. |
| **Exceptions** | **4.0.E1 — No curriculum rules for the course.** At step 1 the course has no rules. The system returns Indeterminate and raises a configuration alert — it does **not** return Met. An absent rule is a missing rule, not a permissive one. <br> **4.0.E2 — Incomplete transcript.** At step 2 the student's transcript predates 2019 and is flagged (A3). The system returns Indeterminate and routes to staff. <br> **4.0.E3 — Provisional prerequisite fails.** Under 4.1 the posted grade does not satisfy the rule. The system raises an enrollment-invalid exception for staff and notifies the student and their advisor **before** teaching starts where the calendar allows. <br> **4.0.E4 — Circular co-requisite.** Two courses list each other as prerequisites rather than co-requisites. The system returns Indeterminate and raises a configuration alert naming both courses. |
| **Priority** | High |
| **Frequency of Use** | Invoked roughly 4× per enrollment attempt across planning and registration: ~600,000 evaluations per semester, peak ~700/second. |
| **Business Rules** | BR-02, BR-20 |
| **Other Information** | Exception 4.0.E1 is the single most important line in this specification. The legacy process treated "no rule found" as "no prerequisite", which is how 61 students entered courses they were not qualified for. Returning Indeterminate converts a silent wrong answer into a visible piece of work. |
| **Assumptions** | At least 90% of programmes can be expressed as machine-evaluable rules (A2); the remainder are handled as Indeterminate by design, not by failure. |

### UC-05 — Evaluate financial eligibility

| | |
|---|---|
| **UC ID and Name** | UC-05 — Evaluate financial eligibility |
| **Created By** | Member 3 | **Date Created** | 2026-09-17 |
| **Primary Actor** | CARS (system, invoked) | **Secondary Actors** | Finance / Bursar System, Finance Officer |
| **Trigger** | Invoked by UC-03 at enrollment; or by the nightly re-evaluation of existing enrollments. |
| **Description** | Replaces three staff spending two weeks a semester exporting and matching payment data. CARS asks the finance system whether this student's standing permits enrollment, and acts on the answer immediately rather than weeks later. |
| **Preconditions** | PRE-1: The student exists in the finance system. <br> PRE-2: The eligibility threshold and any grace rules are configured (BR-05). |
| **Postconditions** | POST-1: The result is Eligible, Blocked or Unknown — never silently Eligible. <br> POST-2: A Blocked result records the outstanding amount at the time of the decision. <br> POST-3: CARS stores no payment instrument or transaction detail (EX-2, SRS CO-4). |
| **Normal Flow** | **5.0** <br> 1. The system requests the student's outstanding balance and hold status from the finance system. <br> 2. The finance system returns a balance and any explicit registration hold. <br> 3. The system compares the balance with the configured threshold (BR-05). <br> 4. The balance is within threshold and no hold exists; the system returns Eligible. |
| **Alternative Flows** | **5.1 — Approved payment plan.** The finance system reports an active instalment plan in good standing; the system returns Eligible regardless of the balance. <br> **5.2 — Scholarship pending.** A scholarship is approved but not yet applied; the system returns Eligible and records that the balance is expected to reduce. <br> **5.3 — Finance Officer override.** A Finance Officer clears a block for a named student with a recorded reason and an expiry date. <br> **5.4 — Nightly re-evaluation.** The system re-evaluates enrolled students and raises a finance exception for any who have moved out of eligibility, rather than removing enrollments automatically. |
| **Exceptions** | **5.0.E1 — Balance exceeds threshold.** The system returns Blocked with the amount outstanding. <br> **5.0.E2 — Explicit registration hold.** The finance system reports a hold irrespective of balance; the system returns Blocked with the hold reason. <br> **5.0.E3 — Finance system unavailable.** The system retries twice within 5 seconds, then returns **Unknown**, which UC-03 treats as a refusal with a retry action. It never assumes Eligible. <br> **5.0.E4 — Student not found in finance system.** The system returns Unknown and raises a data-quality exception for the Finance Officer — this usually means a matriculation record has not synchronised. |
| **Priority** | High |
| **Frequency of Use** | Once per enrollment attempt (~90,000 per semester including refusals) plus a nightly batch across all enrolled students (~12,000). |
| **Business Rules** | BR-05, BR-17 |
| **Other Information** | The distinction between Blocked and Unknown exists because they call for different responses: Blocked is the student's problem to resolve, Unknown is the university's. Collapsing them into one refusal would tell a student to pay a bill that may not exist. Flow 5.4 deliberately raises an exception instead of unenrolling — removing a student from classes because a payment slipped is a decision a person must make. |
| **Assumptions** | The finance vendor exposes a balance-and-hold query (RI-1). If not, the adapter substitutes a nightly snapshot and 5.0.E3 becomes the normal case for same-day payments. |

### UC-06 — Request and decide a capacity override

| | |
|---|---|
| **UC ID and Name** | UC-06 — Request and decide a capacity override |
| **Created By** | Member 3 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Student (requester), Department Head (decider) | **Secondary Actors** | Notification Service, Academic Office Staff |
| **Trigger** | A student requests a place in a section that is full, or whose prerequisite they do not meet. |
| **Description** | Replaces an email thread that took 6 days on average and left no record. The request, its justification, the decision, the decider and the reason all live in one tracked workflow with a 48-hour deadline (BR-12). |
| **Preconditions** | PRE-1: The student is authenticated and their wave is open. <br> PRE-2: The section permits overrides — some do not, by faculty policy. <br> PRE-3: The student has no undecided override request outstanding for the same section. |
| **Postconditions** | POST-1: Every request reaches a recorded decision of Approved, Declined or Expired — a request is never silently abandoned. <br> POST-2: An approved override results in an enrollment **or** in a recorded reason why it did not. <br> POST-3: The decider, the decision time and the reason are recorded for every outcome (audit requirement from the Registrar). |
| **Normal Flow** | **6.0** <br> 1. The student selects the section and states the ground for the request — full section, unmet prerequisite, or timetable necessity — and gives a justification. <br> 2. The system records the request, timestamps it, and starts the 48-hour clock (BR-12). <br> 3. The system routes the request to the Department Head owning the section (BR-11) and notifies them. <br> 4. The Department Head opens the request and sees the student's transcript extract, the section's current enrollment against capacity, the room capacity, and any other pending requests for the same section. <br> 5. The Department Head approves, and records a reason. <br> 6. The system raises the section's effective capacity by one for this student only, and enrolls the student via UC-03 with the override applied. <br> 7. The system notifies the student of the outcome. |
| **Alternative Flows** | **6.1 — Decline.** At step 5 the Department Head declines with a reason; the system notifies the student and offers the waitlist (UC-07) or alternative sections. <br> **6.2 — Batch decision.** Several requests exist for the same section; the Department Head sees them together with the cumulative capacity impact and decides them in one action. <br> **6.3 — Delegate.** The Department Head delegates the decision to a named deputy for a fixed period; the delegate's identity is recorded as the decider. <br> **6.4 — Withdraw.** The student withdraws the request before a decision; the system records it as Withdrawn and stops the clock. |
| **Exceptions** | **6.0.E1 — Deadline breached.** 48 hours elapse without a decision (BR-12). The system escalates to the Registrar, marks the request Overdue, and continues to count. The request is **not** auto-approved and **not** auto-declined — both would remove the academic judgement the workflow exists to capture. <br> **6.0.E2 — Approved but no longer enrollable.** At step 6 the student has since acquired a time conflict or a finance hold. The system records the approval, does not enroll, notifies both parties with the specific blocker, and leaves the approval valid for 72 hours. <br> **6.0.E3 — Room capacity exceeded.** The approval would push enrollment past the physical room capacity from the timetable system. The system warns the Department Head **before** the decision is recorded and requires explicit confirmation. <br> **6.0.E4 — Section cancelled while pending.** The system closes the request as Void, notifies the student, and offers alternatives. <br> **6.0.E5 — Window closed before enrollment.** The approval arrives after the registration window has closed. The system routes the enrollment to Academic Office Staff to apply manually. |
| **Priority** | High |
| **Frequency of Use** | ~2,300 requests per semester, ~78% of them within the 72-hour window; peak ~90 requests/hour. |
| **Business Rules** | BR-02, BR-03, BR-11, BR-12 |
| **Other Information** | 6.0.E1 was the hardest decision in elicitation. The Registrar wanted auto-approval on breach to guarantee the SLA; the Department Heads refused, on the ground that the software would then be granting academic exceptions nobody had agreed to. The resolution — escalate and keep counting — makes the breach visible to the person who owns the policy (dependency D2) without the system inventing an academic decision. |
| **Assumptions** | A university policy setting the 48-hour SLA is signed before Release 1.0 (D2). Without it, BR-12 is a target with no authority behind it. |

### UC-07 — Join and be promoted from a waitlist

| | |
|---|---|
| **UC ID and Name** | UC-07 — Join and be promoted from a waitlist |
| **Created By** | Member 3 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Student | **Secondary Actors** | Notification Service |
| **Trigger** | A student joins the waitlist for a full section, or a seat is released in a section that has a waitlist. |
| **Description** | The fair alternative to an override: a queue that the system administers itself. When a seat is released, the first eligible student on the list is offered it automatically and has 24 hours to accept (BR-08, BR-09). |
| **Preconditions** | PRE-1: The section is full (BR-03). <br> PRE-2: The student satisfies every enrollment rule except capacity — a student who cannot take the course must not occupy a queue position. |
| **Postconditions** | POST-1: A student holds at most one waitlist position per course. <br> POST-2: A released seat is offered to exactly one student at a time; two students are never offered the same seat. <br> POST-3: Queue position is determined by join time within priority wave and is never altered except by the rules stated here. |
| **Normal Flow** | **7.0** <br> 1. The student requests the waitlist for a full section. <br> 2. The system verifies every rule except capacity via UC-04 and UC-05. <br> 3. The system adds the student to the queue and states their position. <br> 4. A seat is released — by a drop (UC-08), a cancelled override or an administrative change. <br> 5. The system identifies the first student on the queue who still satisfies all rules. <br> 6. The system reserves the seat for that student and notifies them, starting the 24-hour offer clock (BR-09). <br> 7. The student accepts; the system enrolls them via UC-03 and removes them from the queue. |
| **Alternative Flows** | **7.1 — Decline the offer.** The student declines; the system releases the seat immediately and offers it to the next eligible student. <br> **7.2 — Leave the queue.** The student leaves voluntarily; everyone behind moves up. <br> **7.3 — Auto-accept.** The student opted in to automatic acceptance when joining; the system enrolls them at step 6 without waiting and notifies them afterwards. <br> **7.4 — Ineligible at promotion.** At step 5 the next student now has a conflict or a hold; the system skips them **without removing them from the queue**, notifies them why they were skipped, and offers the seat to the next student. |
| **Exceptions** | **7.0.E1 — Offer expires.** 24 hours pass without a response (BR-09). The system releases the seat, removes the student from the queue, and notifies them. <br> **7.0.E2 — Seat lost between offer and acceptance.** The section is cancelled, or capacity is reduced, while an offer is outstanding. The system voids the offer and notifies the student with the reason. <br> **7.0.E3 — Time conflict at acceptance.** The student accepts but has since enrolled in a conflicting section (BR-07). The system refuses, names the conflict, and offers the seat to the next student after 1 hour, giving the first student a chance to drop the conflict. <br> **7.0.E4 — Registration window closes with offers outstanding.** Outstanding offers remain valid for their full 24 hours; acceptances after the window are applied by the system, which records that they were post-window. |
| **Priority** | Medium |
| **Frequency of Use** | ~3,400 waitlist joins per semester across ~290 sections; ~1,100 promotions. |
| **Business Rules** | BR-03, BR-07, BR-08, BR-09 |
| **Other Information** | POST-2 and exception 7.0.E3 together are what make a waitlist fair rather than merely automatic. The one-hour pause in 7.0.E3 was requested by the Student Union representative in session 4: the common case is a student holding a placeholder section they intend to drop the moment their real choice comes through, and instantly passing the seat on punishes exactly the behaviour the waitlist is supposed to reward. |
| **Assumptions** | Students check university email at least daily during registration; the 24-hour window in BR-09 rests on this and is configurable if it proves wrong. |

### UC-08 — Drop or swap a section

| | |
|---|---|
| **UC ID and Name** | UC-08 — Drop or swap a section |
| **Created By** | Member 3 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Student | **Secondary Actors** | Learning Management System, Notification Service |
| **Trigger** | The student drops an enrolled section, or exchanges one section for another. |
| **Description** | Leaving a section releases a seat, which is what feeds the waitlist. A **swap** is the important case: dropping A and adding B as two separate actions can lose the seat in A without gaining B, which is exactly the trap students fall into during a 72-hour window. |
| **Preconditions** | PRE-1: The student is enrolled in the section. <br> PRE-2: The current date is within a period that permits the action (BR-16). |
| **Postconditions** | POST-1: A swap either completes entirely or changes nothing — the student never ends with neither section. <br> POST-2: A released seat is offered to the waitlist within 60 seconds (BR-08). <br> POST-3: The drop is published to the learning management system and recorded against the transcript according to the period in which it occurred (BR-16). |
| **Normal Flow** | **8.0** <br> 1. The student selects an enrolled section and chooses Drop. <br> 2. The system states the consequence for the current period — no record, or a recorded withdrawal (BR-16) — and asks for confirmation. <br> 3. The student confirms. <br> 4. The system removes the enrollment and releases the seat. <br> 5. The system triggers the waitlist promotion in UC-07. <br> 6. The system publishes the change to the learning management system. |
| **Alternative Flows** | **8.1 — Swap.** The student selects an enrolled section and a replacement. The system validates the replacement fully (UC-04, UC-05, BR-07, BR-04) **before** releasing the original seat, then performs both operations as one transaction. If the replacement fails validation, the original enrollment is untouched. <br> **8.2 — Drop a co-requisite pair.** Dropping one half of a co-requisite pair (BR-20) drops both; the system says so before confirmation. <br> **8.3 — Staff-assisted drop.** Academic Office Staff drop a student after the period closes, with a recorded reason and authority. |
| **Exceptions** | **8.0.E1 — Outside the permitted period.** The add/drop period has closed (BR-16). The system refuses and explains the withdrawal process, which is outside CARS in releases 1.0–1.2. <br> **8.0.E2 — Swap target became unavailable.** In flow 8.1 the replacement section fills between validation and the transaction. The system abandons the swap, leaves the original enrollment intact, and offers the waitlist for the target. <br> **8.0.E3 — Drop would break a co-requisite.** The student drops one half and declines to drop the other. The system refuses and explains BR-20. <br> **8.0.E4 — Drop would leave the student below minimum enrolled credits.** The system warns, names the consequence for scholarship or visa status where flagged, and requires explicit confirmation. It does not refuse — that is the student's decision to make. |
| **Priority** | High |
| **Frequency of Use** | ~18,000 drops and ~7,000 swaps per semester; ~60% inside the 72-hour window. |
| **Business Rules** | BR-04, BR-07, BR-08, BR-16, BR-20 |
| **Other Information** | Flow 8.1 exists because of a specific complaint recorded in session 1: under the legacy system a student had to drop before adding, and during a busy window the seat they wanted was routinely taken in the seconds between. Making swap atomic is the single most requested change from the Student Union. |
| **Assumptions** | The academic calendar defines add/drop and withdrawal periods per semester and is configured before a window opens. |

### UC-09 — View the real-time degree audit

| | |
|---|---|
| **UC ID and Name** | UC-09 — View the real-time degree audit |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Student | **Secondary Actors** | Academic Advisor |
| **Trigger** | The student opens their degree audit, or an advisor opens a student's audit from the advising record. |
| **Description** | Shows every requirement of the student's programme as Satisfied, In Progress or Outstanding, computed from the same curriculum rules the enrollment engine uses. **This is the use case that removes ~4,800 advising enquiries a semester** (objective BO-6), and it is the most complex read model in the system. |
| **Preconditions** | PRE-1: The viewer is authenticated and is either the student themselves or an advisor assigned to them. <br> PRE-2: The student's programme has validated curriculum rules (D3). |
| **Postconditions** | POST-1: The audit reflects enrollments and grades as of the moment it is viewed; nothing is served from a cache older than 5 minutes. <br> POST-2: Every requirement shown states which specific courses satisfied it. <br> POST-3: A requirement the engine cannot evaluate is shown as **Needs review** with the reason, never as Satisfied or Outstanding. |
| **Normal Flow** | **9.0** <br> 1. The viewer opens the audit. <br> 2. The system retrieves the student's programme and its requirement groups — core, major, elective, general education, credit total. <br> 3. The system evaluates each group against completed courses, in-progress enrollments and approved transfer credit. <br> 4. The system computes overall completion (BR-13). <br> 5. The system displays each group with its status, the courses that satisfied it, and what remains. <br> 6. The system displays remaining credits and the expected graduation semester. |
| **Alternative Flows** | **9.1 — What-if planning.** The student adds a prospective course; the system re-evaluates and shows which requirements it would satisfy, **without changing any state**. <br> **9.2 — What-if programme change.** The student selects another programme; the system evaluates their existing record against that programme's rules and shows the gap. <br> **9.3 — Advisor view.** An advisor sees the same audit plus advising notes and hold status, and can export it for a meeting. <br> **9.4 — Include planned sections.** The student includes their UC-02 plan; the system marks which requirements the plan would advance. |
| **Exceptions** | **9.0.E1 — Requirement cannot be evaluated.** A rule references a course that no longer exists, or the student's record predates 2019 (A3). The system shows **Needs review** with the reason and offers to contact an advisor. It never guesses. <br> **9.0.E2 — Programme rules changed mid-degree.** The student's catalog-year rules differ from the current ones. The system evaluates against the **catalog year the student matriculated under** and states which year it used. <br> **9.0.E3 — Grade under appeal.** A grade is provisional pending appeal. The system evaluates using the current grade, marks the affected requirement as provisional, and names the course. <br> **9.0.E4 — Audit computation exceeds its time budget.** The system shows the requirement groups that completed and marks the rest as pending with a retry, rather than failing the whole page. |
| **Priority** | Medium — deferred to Release 1.1 |
| **Frequency of Use** | Assumed 70% of students view it twice per semester, plus advisor views: ~19,000 views per semester, concentrated before registration windows. |
| **Business Rules** | BR-02, BR-13, BR-18, BR-20 |
| **Other Information** | POST-3 and exception 9.0.E1 exist because a *wrong* degree audit is worse than none: a student who is told they have satisfied a requirement they have not is the exact failure that produced the complaint to the Rector described in Vision & Scope §1.1. Exception 9.0.E2 — evaluating against the matriculation catalog year — is a university regulation, not a design preference. |
| **Assumptions** | Curriculum rules are versioned by catalog year and the student's catalog year is recorded. |

### UC-10 — View account balance and payment history

| | |
|---|---|
| **UC ID and Name** | UC-10 — View account balance and payment history |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Student | **Secondary Actors** | Finance / Bursar System |
| **Trigger** | The student opens their account view, or follows the link from a refused enrollment (UC-03 exception 3.0.E2). |
| **Description** | Shows what the student owes, what they have paid, and what any current block means — the other half of objective BO-6. CARS displays this data; it does not own it and does not take payment (EX-2). |
| **Preconditions** | PRE-1: The viewer is authenticated and is the student themselves. <br> PRE-2: The student exists in the finance system. |
| **Postconditions** | POST-1: No student sees another student's financial data. <br> POST-2: CARS stores no payment instrument detail. <br> POST-3: Every figure displays the time it was retrieved from the finance system. |
| **Normal Flow** | **10.0** <br> 1. The student opens the account view. <br> 2. The system requests the balance, charges and payment history from the finance system. <br> 3. The system displays the current balance, the charges making it up, payments received, and the registration eligibility threshold (BR-05). <br> 4. If a block is active, the system states the amount that must be paid to clear it. <br> 5. The system links to the university payment channel, which is outside CARS. |
| **Alternative Flows** | **10.1 — Instalment plan.** An active plan exists; the system shows the schedule and the next due date. <br> **10.2 — Scholarship applied.** A scholarship reduces the balance; the system shows it as a distinct line. <br> **10.3 — Estimate for a planned schedule.** The student asks what their UC-02 plan would cost; the system computes it per BR-17 and labels it an **estimate**, not a charge. |
| **Exceptions** | **10.0.E1 — Finance system unavailable.** The system shows the last retrieved figures with their timestamp and an explicit note that they may be out of date. It does not show a blank page and does not show a zero balance. <br> **10.0.E2 — Student not found in the finance system.** The system says the account could not be retrieved and gives the Finance Office contact; it raises a data-quality exception rather than showing a zero balance. <br> **10.0.E3 — Balance disputed.** A dispute is flagged; the system shows the disputed amount separately and states that the block remains until resolved. |
| **Priority** | Medium — deferred to Release 1.1 |
| **Frequency of Use** | ~12,000 students × ~3 views per semester, spiking after each enrollment refusal for a finance hold. |
| **Business Rules** | BR-05, BR-17 |
| **Other Information** | Exception 10.0.E1 is the same principle as UC-09 POST-3: showing a stale figure with its age is honest, showing zero is a lie that will generate the phone call this feature exists to prevent. |
| **Assumptions** | The finance system exposes charges and payments, not only a net balance; otherwise flow 10.1 and 10.2 degrade to a single figure. |

### UC-11 — Identify and cancel an under-enrolled section

| | |
|---|---|
| **UC ID and Name** | UC-11 — Identify and cancel an under-enrolled section |
| **Created By** | Member 3 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Department Head | **Secondary Actors** | Registrar, Notification Service, Timetable System |
| **Trigger** | The scheduled under-enrolment check runs, or a Department Head opens the section viability view. |
| **Description** | Finds sections that will not reach minimum viable enrollment **before** the add/drop period opens, so that affected students can rebuild a timetable rather than discover the cancellation nine days into it. |
| **Preconditions** | PRE-1: The user holds the Department Head role for the section's department, or the Registrar role. <br> PRE-2: A minimum viable enrollment is configured for the section or inherited from its faculty (BR-15). |
| **Postconditions** | POST-1: A cancelled section has every enrolled student notified and every seat released, or the cancellation does not complete (BR-19). <br> POST-2: The cancellation records who decided it, when and why. <br> POST-3: A cancelled section is removed from the catalog and from every student plan that referenced it. |
| **Normal Flow** | **11.0** <br> 1. The system evaluates every section against its minimum viable enrollment 7 days before add/drop opens (BR-10, BR-15). <br> 2. The system lists flagged sections for the Department Head with current enrollment, minimum, waitlist depth and the lecturer. <br> 3. The Department Head reviews a flagged section and chooses to cancel. <br> 4. The system shows exactly who is affected — enrolled students, waitlisted students — and which of them would drop below minimum credits as a result. <br> 5. The Department Head confirms and records a reason. <br> 6. The system releases every enrollment, notifies every affected student with alternatives, and removes the section from the catalog (BR-19). <br> 7. The system notifies the Registrar and the timetable system that the room and slot are free. |
| **Alternative Flows** | **11.1 — Keep the section open.** The Department Head decides to run it below minimum and records the justification; the section is removed from the flag list for the semester. <br> **11.2 — Merge sections.** Two under-enrolled sections of the same course are merged; the system moves students from one to the other, checking each for time conflicts (BR-07) and reporting any it cannot move. <br> **11.3 — Registrar-initiated cancellation.** The Registrar cancels across departments, for example when a lecturer becomes unavailable. |
| **Exceptions** | **11.0.E1 — A student cannot be moved in a merge.** In flow 11.2 a student has a time conflict with the surviving section. The system completes the merge for everyone else and raises an exception listing the students who must be handled individually. It does not silently unenroll them. <br> **11.0.E2 — Cancellation would leave a student unable to graduate.** A student needs this section to complete their programme this semester (BR-18). The system warns **before** confirmation, names the students, and requires explicit acknowledgement. <br> **11.0.E3 — Notification fails.** A student's notification cannot be delivered. The cancellation stands but the system raises a follow-up task for the academic office; a student is never left unnotified and unrecorded. <br> **11.0.E4 — Cancellation attempted after teaching starts.** The system refuses and routes the request to the Registrar, since this is a regulated academic decision outside the workflow. |
| **Priority** | Low — deferred to Release 1.2 |
| **Frequency of Use** | ~1,400 sections evaluated per semester; ~70 flagged; ~45 cancelled. |
| **Business Rules** | BR-07, BR-10, BR-15, BR-18, BR-19 |
| **Other Information** | Exception 11.0.E2 is the reason this use case is worth automating at all. The legacy process found under-enrolled sections late and cancelled them without checking who needed them to graduate; identifying that student *before* the decision is the difference between an administrative action and an academic one. |
| **Assumptions** | Minimum viable enrollment is a faculty-level policy with per-section override, and is configured before the window opens. |

### UC-12 — Open, extend or close a registration window

| | |
|---|---|
| **UC ID and Name** | UC-12 — Open, extend or close a registration window |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Registrar | **Secondary Actors** | Notification Service |
| **Trigger** | The Registrar configures a window, or a scheduled wave boundary is reached. |
| **Description** | Controls who may register and when. The 72-hour window runs in three priority waves (BR-06); this use case is how those waves are defined, opened, extended in an incident and closed. |
| **Preconditions** | PRE-1: The user holds the Registrar role. <br> PRE-2: A section catalog exists for the semester. |
| **Postconditions** | POST-1: At any moment the system can state, for any student, whether their wave is open — there is no ambiguous state. <br> POST-2: Every change to a window is recorded with the actor, the time and the reason. <br> POST-3: Extending a window never retroactively invalidates an enrollment already made. |
| **Normal Flow** | **12.0** <br> 1. The Registrar defines the semester's window: start, end, and the three priority waves with their eligibility rules (BR-06). <br> 2. The system validates that the waves do not overlap and that they cover every student exactly once. <br> 3. The Registrar publishes the window; the system notifies students of their wave time. <br> 4. At each wave boundary the system opens registration for that cohort. <br> 5. At the window end the system closes registration and reports the outcome — enrollments, refusals by reason, outstanding overrides and waitlists. |
| **Alternative Flows** | **12.1 — Extend during an incident.** The Registrar extends the window; the system notifies every affected student and records the reason. <br> **12.2 — Reopen for a cohort.** A group was unable to register — a cancelled section, a system fault. The Registrar reopens for named students only. <br> **12.3 — Emergency close.** The Registrar closes registration immediately; in-flight transactions are allowed to complete, no new ones start. |
| **Exceptions** | **12.0.E1 — Waves do not cover every student.** At step 2 some students fall in no wave. The system refuses to publish and lists them. <br> **12.0.E2 — Waves overlap.** The system refuses to publish and names the overlap, because an overlap silently destroys the fairness BR-06 exists to create. <br> **12.0.E3 — Window opens with no catalog.** No sections are published for the semester. The system refuses to open. <br> **12.0.E4 — Extension requested after close.** The system treats it as a reopen (flow 12.2), requiring named students, rather than silently re-opening for everyone. |
| **Priority** | High |
| **Frequency of Use** | 2 windows per year, 3 waves each; extensions historically 1–2 per year. |
| **Business Rules** | BR-06 |
| **Other Information** | Low in volume, high in consequence: every other use case in the system reads the state this one writes. POST-1 is what makes UC-03 step 2 answerable in single-digit milliseconds under peak load. |
| **Assumptions** | The academic calendar fixes window dates; the Registrar configures waves within them. |

### UC-13 — Advise a student and manage an advising hold

| | |
|---|---|
| **UC ID and Name** | UC-13 — Advise a student and manage an advising hold |
| **Created By** | Member 3 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Academic Advisor | **Secondary Actors** | Notification Service |
| **Trigger** | An advising meeting takes place, or a policy requires a hold to be placed on a cohort. |
| **Description** | Records what a student was advised and, where policy requires it, places a hold that blocks enrollment until the student has met their advisor (BR-14). The hold is the mechanism that makes advising happen before registration rather than after it. |
| **Preconditions** | PRE-1: The advisor is authenticated and assigned to the student. <br> PRE-2: The student is enrolled in a programme. |
| **Postconditions** | POST-1: A hold exists or it does not; there is no partially applied hold. <br> POST-2: Placing and lifting a hold both record the actor, the time and the reason. <br> POST-3: A student can always see that a hold exists and who to contact, even though they cannot see the advising notes. |
| **Normal Flow** | **13.0** <br> 1. The advisor opens the student's record and reviews their degree audit (UC-09). <br> 2. The advisor records advice given and any agreed plan. <br> 3. The advisor lifts the advising hold for the coming registration window. <br> 4. The system records the lift and notifies the student that they may now register. |
| **Alternative Flows** | **13.1 — Place a hold on a cohort.** The Registrar or an advisor places holds on all students in a cohort — for example every first-year student before their first window. <br> **13.2 — Place an individual hold.** An advisor places a hold on one student, for instance after academic probation. <br> **13.3 — Hold with an expiry.** A hold is placed with an automatic expiry date, so it cannot outlive its purpose by neglect. <br> **13.4 — Student views hold status.** The student sees that a hold exists, the reason category and the advisor to contact — but not the advising notes. |
| **Exceptions** | **13.0.E1 — Advisor not assigned.** The advisor is not this student's assigned advisor. The system refuses and offers to request temporary access, recording the request. <br> **13.0.E2 — Hold lifted during an open window.** The student is mid-registration. The lift takes effect immediately; the system notifies the student so they can continue without re-checking. <br> **13.0.E3 — Hold placed during an open window.** The system places the hold but does **not** reverse enrollments already made — a hold restricts future action only. <br> **13.0.E4 — Every advisor unavailable before a window.** Holds remain in place and the window would exclude those students. The system reports the count to the Registrar 72 hours before the window, so that a policy decision can be taken while there is still time. |
| **Priority** | Low — deferred to Release 1.2 |
| **Frequency of Use** | ~40 advisors × ~55 students each, ~2 meetings per semester: ~4,400 advising records, ~6,000 hold transactions. |
| **Business Rules** | BR-14 |
| **Other Information** | Exception 13.0.E3 is a deliberate boundary: a hold is a gate on future enrollment, not a retroactive cancellation. Making it retroactive would give one advisor the power to unenroll a student mid-window, which no stakeholder asked for and the Registrar explicitly rejected in session 2. |
| **Assumptions** | Every student has exactly one assigned advisor at any time. |

### UC-14 — Produce enrollment and capacity reports

| | |
|---|---|
| **UC ID and Name** | UC-14 — Produce enrollment and capacity reports |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Registrar | **Secondary Actors** | Department Head, Vice-Rector |
| **Trigger** | The user opens a report, or a scheduled report is generated. |
| **Description** | Reporting on enrollment, capacity utilisation, override activity and the objectives from the Vision & Scope document. Its purpose is to make the six business objectives continuously measurable rather than reconstructed at the end of a semester. |
| **Preconditions** | PRE-1: The user holds a role that grants reporting access. <br> PRE-2: At least one registration window has completed. |
| **Postconditions** | POST-1: A user sees only the faculties and departments their role permits. <br> POST-2: Every figure states the period it covers and when the data was last refreshed. <br> POST-3: No report discloses an individual student's financial detail to an academic user. |
| **Normal Flow** | **14.0** <br> 1. The user opens the report list and selects a report and a period. <br> 2. The system applies the user's data scope (POST-1). <br> 3. The system computes and displays the report with its definitions visible. <br> 4. The user filters by faculty, department, programme or section. <br> 5. The system recomputes and redisplays. |
| **Alternative Flows** | **14.1 — Drill down.** The user clicks a figure and sees the underlying sections or enrollments. <br> **14.2 — Export.** The user exports the current view as CSV. <br> **14.3 — Scheduled window report.** The system produces the registration-window summary automatically when a window closes and sends it to the Registrar and Vice-Rector. <br> **14.4 — Override activity report.** A Department Head reviews their own override decisions, decision times against the 48-hour SLA (BR-12) and approval rate. |
| **Exceptions** | **14.0.E1 — No data for the period.** The system states that no data exists for the period, distinctly from a figure of zero. <br> **14.0.E2 — Computation times out.** The system shows the sections that completed and marks the rest with a retry, rather than failing the page. <br> **14.0.E3 — Report requested across a permission boundary.** The system returns only the permitted scope and states that the result was limited by permission. |
| **Priority** | Low — deferred to Release 2.0 |
| **Frequency of Use** | ~15 regular users, ~3 views/week each, plus 2 scheduled window reports per year. |
| **Business Rules** | BR-03, BR-10, BR-12, BR-13 |
| **Other Information** | Report definitions must be **identical** to the success metrics in Vision & Scope §1.4. If the override-activity report measures decision time differently from the success metric for BO-3, the university cannot prove the objective was met. Report specifications are in SRS §4.3. |
| **Assumptions** | Near-real-time aggregation is acceptable; figures may lag live data by up to 15 minutes. |

---

## 4. Use Case Diagram

See `diagrams/use-case-diagram.drawio` (editable) and `diagrams/use-case-diagram.png` (for the SRS Appendix B).

**Reading the diagram**
- Primary actors are on the **left**, secondary (system) actors on the **right**.
- The rectangle is the **system boundary**. The finance system, SSO, timetable system and LMS sit outside it deliberately (Vision & Scope §2.4).
- `«include»` arrows point **from** the base use case **to** the always-executed use case.
- `«extend»` arrows point **from** the optional use case **to** the base it extends.

**Relationships shown**

| Relationship | From | To | Why |
|---|---|---|---|
| «include» | UC-03 Register for a section | UC-04 Validate prerequisites | Every enrollment evaluates prerequisites, always |
| «include» | UC-03 Register for a section | UC-05 Evaluate financial eligibility | Every enrollment evaluates finance, always |
| «include» | UC-02 Build a planned schedule | UC-04 Validate prerequisites | Planning warns on prerequisites, always |
| «include» | UC-08 Drop or swap | UC-07 Waitlist promotion | A released seat always triggers promotion |
| «include» | UC-11 Cancel a section | UC-08 Drop or swap | Cancellation always releases every enrollment |
| «extend» | UC-06 Request an override | UC-03 Register for a section | Only when the section is full or a prerequisite is unmet |
| «extend» | UC-07 Join a waitlist | UC-03 Register for a section | Only when the section is full |
| «extend» | UC-09 Degree audit | UC-13 Advise a student | Only when an advisor reviews progress during advising |
