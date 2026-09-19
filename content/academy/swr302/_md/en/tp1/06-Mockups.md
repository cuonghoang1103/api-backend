# Mock-ups for Complex Use Cases
## for the Campus Academic and Registration System (CARS)

Version 1.0 approved
Prepared by **<Member 4 name>**, Business Analysis Team — Group <N>
Northern Regional University (NRU)
17 September 2026

---

## 1. Purpose and approach

Per Wiegers & Beatty Chapter 15, these are **throwaway, low-fidelity mock-ups**. Their
job is to let a stakeholder say "no, that is not what I meant" — not to look finished.
They are deliberately grey: a polished mock-up moves the conversation to colour and
makes management believe the system is nearly built.

**The SRS remains the source of truth.** Where a mock-up and the SRS disagree, the SRS
is correct.

## 2. How the three were chosen

*Complex* means many decisions and many states, not many fields. Candidates ranked on
alternative flows + exceptions + participating actors:

| Use case | Alt. flows | Exceptions | Actors | Total | Selected |
|---|---|---|---|---|---|
| **UC-03** Register for a course section | 4 | **7** | 3 | **14** | ✅ |
| **UC-06** Request and decide an override | 4 | 5 | 4 | **13** | ✅ |
| **UC-09** View the real-time degree audit | 4 | 4 | 2 | **10** | ✅ |
| UC-07 Waitlist and promotion | 4 | 4 | 2 | 10 | — covered by M1's refusal path |
| UC-11 Cancel an under-enrolled section | 3 | 4 | 4 | 11 | deferred to Release 1.2 |
| UC-02 Build a planned schedule | 3 | 3 | 1 | 7 | — |

UC-11 scores highly but is deferred to Release 1.2, so prototyping it now would design
something nobody builds this year. UC-03 is the obvious first choice: seven exceptions
is more than any other use case in the system, and it is the transaction the whole
project exists to fix.

## 3. The mock-ups

| # | File | Use case | Flow shown | State |
|---|---|---|---|---|
| **M1** | `mockups/M1-UC03-register-refused.png` | UC-03 | Exception 3.0.E1 | **Refusal** |
| **M2** | `mockups/M2-UC06-override-decision.png` | UC-06 | Normal flow 6.0 + exception 6.0.E1 | Decider view, **deadline breached** |
| **M3** | `mockups/M3-UC09-degree-audit.png` | UC-09 | Normal flow 9.0 + alt flow 9.1 + exception 9.0.E1 | **Cannot evaluate one group** |

Editable source for each is the matching `.html` file in `mockups/`.

### 3.1 M1 — Registration refused (UC-03, exception 3.0.E1)

Shows a **refusal**, not a success, because the refusal is where this system either
removes an advising enquiry or creates one. It names the exact course and grade, lists
every check with its result, and marks the checks that were **not** evaluated because
the request stopped earlier.

*Design decisions under test:* (1) showing the full check table so the student can see
what was and was not evaluated; (2) naming the specific course and grade rather than
"prerequisite not met", which is what the legacy system said and what generated a phone
call every time.

*Realizes:* Enroll-1 … Enroll-8, Prereq-1, Prereq-2. *Rules visible:* BR-02, BR-06, BR-14.

### 3.2 M2 — Override decision (UC-06, flow 6.0 with exception 6.0.E1)

The Department Head's queue and one decision, with everything they need in front of
them: section capacity, room capacity, the other pending requests for the same section,
the student's record, and the graduation consequence of declining.

*Design decision under test:* the banner. On a breached 48-hour deadline the system
**escalates and keeps counting** — it does not auto-approve and does not auto-decline.
This was the hardest disagreement in elicitation: the Registrar wanted auto-approval to
guarantee the SLA, the Department Heads refused to let software grant academic
exceptions. The screen states the resolution rather than hiding it.

*Realizes:* Override-1 … Override-9. *Rules visible:* BR-03, BR-11, BR-12.

### 3.3 M3 — Degree audit with a group it cannot evaluate (UC-09)

Every requirement group with its status, plus a **Needs review** row for transfer credit
recorded before 2019, plus the what-if projection.

*Design decisions under test:* (1) the **Needs review** state — a degree audit that
guesses is the exact failure that produced the complaint to the Rector in Vision &
Scope §1.1, so the screen says it does not know and names who to ask; (2) stating the
**catalog year used**, which is a regulation (Academic Regulations §9.1), not a nicety.

*Realizes:* Audit-1 … Audit-7. *Rules visible:* BR-02, BR-13, BR-18.

## 4. Questions these mock-ups were built to settle

| # | Question | Asked of | Answer |
|---|---|---|---|
| Q1 | Should a refused student see every check, or only the one that failed? | Academic Office Staff | Every check, with the unevaluated ones marked — it stops the "but what about…" follow-up call |
| Q2 | On a breached override deadline, should the system decide? | Registrar, Department Heads | No. Escalate and keep counting (UC-06 exception 6.0.E1) |
| Q3 | Should a degree audit show a requirement it cannot evaluate, or hide it? | Academic Advisors | Show it as Needs review, with the reason and who to contact |
| Q4 | Should the what-if projection show the cost of *not* taking a course? | Academic Advisors | Yes — it is the single most common advising question |
| Q5 | Should a student see their own GPA on the override screen the Department Head sees? | Registrar | **Open — TBD-6.** A privacy question the Registrar wants legal advice on |

**TBD-6** is carried into the SRS TBD list. Leaving it open and tracked is correct;
inventing a privacy position the Registrar has not taken would be worse.
