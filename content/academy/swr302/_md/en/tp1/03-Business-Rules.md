# Business Rules
## for the Campus Academic and Registration System (CARS)

Version 1.0 approved
Prepared by **<Team Leader name>**, Business Analysis Team — Group <N>
Northern Regional University (NRU)
17 September 2026

---

### Revision History

| Name | Date | Reason For Changes | Version |
|---|---|---|---|
| BA Team, Group <N> | 2026-09-17 | Rules harvested from elicitation sessions 1–4 and the Academic Regulations | 0.9 |
| BA Team, Group <N> | 2026-09-17 | Classified, de-duplicated and cross-referenced to use cases | 1.0 |

---

## 1. Purpose and scope

This document is NRU's catalog of the business rules that govern registration and
academic progression. A **business rule** is a policy, regulation, standard,
computation or definition that exists **independently of any software** — in NRU's case
most of them exist in the Academic Regulations, which is why the *Source* column
matters more here than in a commercial project. Rules are recorded **once**; use cases
and functional requirements refer to them **by ID only**.

The five-type taxonomy is from Wiegers & Beatty, Chapter 9:

| Type | Meaning |
|---|---|
| **Fact** | A true statement about the business; an invariant of the domain |
| **Constraint** | Something that must or must not happen; restricts an action |
| **Action enabler** | A condition that, when true, triggers an action |
| **Inference** | New knowledge derived from existing facts |
| **Computation** | A formula that produces a value |

**Static or Dynamic** records whether the *rule itself* is expected to change.
Dynamic rules must be **configurable**, not compiled in. In a university this
distinction is unusually important: regulations are revised by committee on an annual
cycle, and a rule that requires a software release to change will be out of date
within a year.

---

## 2. The rules

| ID | Rule Definition | Type of Rule | Static or Dynamic | Source |
|---|---|---|---|---|
| **BR-01** | A student may hold at most one enrollment in a given course section at any time. | Fact | Static | Registrar, session 2 |
| **BR-02** | A student may enroll in a course only if every prerequisite course has been completed with at least the minimum grade specified for that prerequisite. | Constraint | Dynamic | Academic Regulations §7.2 |
| **BR-03** | Remaining capacity of a section = published capacity − confirmed enrollments − approved overrides not yet enrolled. | Computation | Static | Registrar, session 2 |
| **BR-04** | A student may not enroll in more than the credit limit for their year of study in a semester. The default limit is 24 credits. | Constraint | Dynamic | Academic Regulations §5.1 |
| **BR-05** | A student whose outstanding balance exceeds the registration threshold, or who carries an explicit finance hold, may not enroll until the block is cleared. | Action enabler | Dynamic | Finance Officer, session 3; Academic Regulations §11.4 |
| **BR-06** | Registration opens in three priority waves in this order: final-year students, then second- and third-year students, then first-year students. | Fact | Dynamic | Registrar, session 1 |
| **BR-07** | A student may not hold two enrollments whose scheduled meeting times overlap by any amount. | Constraint | Static | Registrar, session 2 |
| **BR-08** | When a seat is released in a section that has a waitlist, it is offered to the highest-placed student on that waitlist who still satisfies every other enrollment rule. | Action enabler | Static | Registrar, session 2 |
| **BR-09** | A waitlist offer expires 24 hours after it is issued, after which the seat is offered to the next eligible student. | Constraint | Dynamic | Registrar, session 2 |
| **BR-10** | A section is "under-enrolled" when its confirmed enrollment is below its minimum viable enrollment at the checkpoint 7 days before the add/drop period opens. | Inference | Dynamic | Department Heads, session 3 |
| **BR-11** | Only the Department Head owning a section, or a delegate they have named, may approve a capacity override for that section. | Constraint | Static | Academic Regulations §7.6 |
| **BR-12** | A capacity override request must have a recorded decision within 48 hours of submission. | Constraint | Dynamic | University policy (pending signature — dependency D2) |
| **BR-13** | Degree completion percentage = credits earned toward the programme ÷ total credits required by the programme × 100. | Computation | Static | Academic Regulations §9.1 |
| **BR-14** | A student carrying an active advising hold may not enroll in any section until an authorised advisor lifts it. | Constraint | Dynamic | Academic Regulations §6.3 |
| **BR-15** | The minimum viable enrollment for a section is 15 students, configurable per faculty and overridable per section. | Fact | Dynamic | Vice-Rector, session 1 |
| **BR-16** | A student may drop a section with no transcript record only within the add/drop period. After it, a drop is recorded as a withdrawal. | Constraint | Dynamic | Academic Regulations §8.2 |
| **BR-17** | Tuition due = Σ (section credits × the per-credit rate for the student's programme) + mandatory fees − scholarships applied. | Computation | Dynamic | Finance Officer, session 3 |
| **BR-18** | A student is "at risk of late graduation" when the credits still required exceed what can be taken in their remaining semesters at the maximum credit limit. | Inference | Dynamic | Academic Advisors, session 4 |
| **BR-19** | When a section is cancelled, every enrolled and waitlisted student is notified and every seat is released. | Action enabler | Static | Registrar, session 2 |
| **BR-20** | Courses declared as co-requisites must be enrolled in the same semester; a student may enroll in both or neither. | Constraint | Static | Academic Regulations §7.4 |

### 2.1 Coverage by type

| Type | Rules | Count |
|---|---|---|
| Fact | BR-01, BR-06, BR-15 | 3 |
| Constraint | BR-02, BR-04, BR-07, BR-09, BR-11, BR-12, BR-14, BR-16, BR-20 | 9 |
| Action enabler | BR-05, BR-08, BR-19 | 3 |
| Inference | BR-10, BR-18 | 2 |
| Computation | BR-03, BR-13, BR-17 | 3 |
| | **Total** | **20** |

### 2.2 Static versus dynamic — what it means for the build

Twelve of the twenty rules are **dynamic**. In a university this is not a minor
engineering note: the Academic Regulations are revised annually by committee, and
several of these values are the exact things a committee changes.

| Rule | Configurable value | Who may change it |
|---|---|---|
| BR-02 | Minimum grade per prerequisite; the rules themselves | Faculty curriculum committee, via the Registrar |
| BR-04 | Credit limit, per year of study and per programme | Registrar |
| BR-05 | Registration balance threshold; grace rules | Finance Officer |
| BR-06 | Wave definitions and their order | Registrar |
| BR-09 | Waitlist offer window (24 h) | Registrar |
| BR-10 | The 7-day checkpoint | Registrar |
| BR-12 | Override decision SLA (48 h) | Registrar, once D2 is signed |
| BR-14 | Which cohorts carry an automatic hold | Registrar |
| BR-15 | Minimum viable enrollment, per faculty and per section | Department Head |
| BR-16 | Add/drop period dates, per semester | Registrar |
| BR-17 | Per-credit rates, fees | Finance Officer |
| BR-18 | Remaining-semester assumption | Academic Advisors |

> **The catalog-year problem.** BR-02, BR-04 and BR-13 are dynamic *and* must be
> **versioned by catalog year**: a student is assessed against the regulations in force
> when they matriculated (UC-09 exception 9.0.E2). A configuration model that simply
> overwrites the current value would silently re-assess every existing student against
> new rules — which is both wrong and, under Academic Regulations §9.1, not permitted.

---

## 3. Rules that are deliberately NOT enforced in software

| Rule | Why it is not enforced by CARS |
|---|---|
| A student must meet their advisor at least once per semester | CARS enforces the *hold* (BR-14); whether a meeting happened is an advisor's judgement |
| Lecturers must submit grades within 14 days of the final assessment | Enforced by the Registrar administratively; CARS reports lateness but does not block |
| A student on academic probation must reduce their credit load | Applied by placing an individual credit limit under BR-04, not by a separate rule |
| Scholarship eligibility criteria | Owned entirely by the finance system (EX-2); CARS reads the outcome |
| Room capacity must not be exceeded | Owned by the timetable system (EX-3); CARS warns at UC-06 exception 6.0.E3 but does not enforce |

---

## 4. How the rules were discovered

| Session | Date | Stakeholder role played | Technique | Rules yielded |
|---|---|---|---|---|
| 1 | 2026-09-08 | Vice-Rector (sponsor) + Registrar | Structured interview, 9 prepared questions | BR-06, BR-15 |
| 2 | 2026-09-09 | Registrar + Academic Office Staff | Facilitated workshop, current-state walkthrough of one enrollment | BR-01, BR-03, BR-07, BR-08, BR-09, BR-19 |
| 3 | 2026-09-11 | Finance Officer + Department Heads | Structured interview | BR-05, BR-10, BR-12, BR-17 |
| 4 | 2026-09-12 | Academic Advisors | Follow-up on degree-audit questions | BR-18 |
| — | 2026-09-10 | — | **Document analysis** of the Academic Regulations | BR-02, BR-04, BR-11, BR-13, BR-14, BR-16, BR-20 |

**Technique note.** Seven of the twenty rules came from **document analysis**, not from
interviews — they were already written down in the Academic Regulations and nobody
mentioned them, because everybody assumed they were obvious. This is the opposite of
the TP2 situation, where rules existed only as staff habits. The lesson generalises:
in a regulated organisation, read the regulations *before* the first interview, or you
will spend the interview being told things you could have read, and still miss the
rules nobody thinks to say out loud.

**Open questions carried into the SRS TBD list**

| # | Question | Owner | Target |
|---|---|---|---|
| TBD-1 | Does the credit limit in BR-04 count in-progress repeats, or only new enrollments? | Registrar | Week 6 |
| TBD-2 | Is the 48-hour SLA in BR-12 working hours or calendar hours? Department Heads and the Registrar answered differently. | Registrar | Week 6 |
| TBD-3 | When a co-requisite pair (BR-20) is broken by a section cancellation, is the surviving enrollment dropped automatically or referred to an advisor? | Registrar | Week 7 |
| TBD-4 | Does the finance threshold in BR-05 apply per semester or cumulatively? | Finance Officer | Week 7 |

---

## 5. Traceability: rule → use case → requirement

| Rule | Enforced in use case(s) | SRS functional requirement(s) |
|---|---|---|
| BR-01 | UC-03 | Enroll-2 |
| BR-02 | UC-02, UC-03, UC-04, UC-06, UC-09 | Prereq-1, Prereq-2 |
| BR-03 | UC-01, UC-03, UC-06, UC-07, UC-14 | Catalog-3, Enroll-6 |
| BR-04 | UC-02, UC-03, UC-08 | Enroll-5 |
| BR-05 | UC-03, UC-05, UC-10 | Finance-1, Finance-2 |
| BR-06 | UC-01, UC-03, UC-12 | Window-1, Enroll-1 |
| BR-07 | UC-02, UC-03, UC-07, UC-08, UC-11 | Enroll-4, Plan-2 |
| BR-08 | UC-07, UC-08 | Wait-3 |
| BR-09 | UC-07 | Wait-4 |
| BR-10 | UC-11, UC-14 | Viability-1 |
| BR-11 | UC-06 | Override-2 |
| BR-12 | UC-06, UC-14 | Override-3, Override-6 |
| BR-13 | UC-09, UC-14 | Audit-3 |
| BR-14 | UC-02, UC-03, UC-13 | Enroll-3, Advise-2 |
| BR-15 | UC-11 | Viability-2 |
| BR-16 | UC-08 | Drop-1 |
| BR-17 | UC-05, UC-10 | Account-2 |
| BR-18 | UC-09, UC-11 | Audit-6, Viability-5 |
| BR-19 | UC-11 | Viability-3 |
| BR-20 | UC-02, UC-03, UC-04, UC-08, UC-09 | Prereq-4, Enroll-7 |

**Every rule in this catalog is enforced by at least one use case.** That check was run
before baselining and is repeated before submission.
