# Requirement Estimation — BA budget and number of BAs
## for the Campus Academic and Registration System (CARS)

Version 1.0 approved
Prepared by **<Member 5 name>**, Business Analysis Team — Group <N>
Northern Regional University (NRU)
17 September 2026

> The tool is `deliverables/08-Requirements-Estimation.xlsx`, the Chapter 19
> Requirements Estimation Tool with its formulas unchanged. Only the yellow input cells
> were filled; each carries a comment naming where its value came from.

---

## 1. Inputs, and where each number came from

**These counts come from our own deliverables.** A count that disagrees with the
documents it describes invalidates everything downstream.

| Input | Value | Source |
|---|---|---|
| Existing pages of documentation for review | 120 | Legacy system documentation + NRU Academic Regulations 2026 + current-state notes |
| Existing systems being updated or replaced | 1 | The legacy student information system |
| Stakeholders | 20 | Named participants across elicitation sessions 1–4 |
| Interfacing systems — small | 2 | University SSO, notification service |
| Interfacing systems — medium | 3 | Finance/bursar, timetable, learning management (SRS §5.2) |
| Interfacing systems — large | 0 | None at runtime; the legacy migration is counted above |
| **Process flows and/or use cases** | **14** | **Counted from Deliverable 2 — UC-01 … UC-14** |
| Business data diagrams | 2 | Context diagram + logical data model |
| **Screens / user interfaces** | **26** | Student 10 + staff 6 + department head 4 + advisor 3 + registrar 3 |
| **Reports** | **7** | RPT-1 … RPT-7, counted from SRS §4.3 |
| Total project budget | USD 950,000 | Vision & Scope §3.2 |
| BA blended hourly cost | USD 125 | Tool default, retained — see §5 |
| Type of project | Standard | Custom build replacing a legacy system |
| Number of developers | 10 | Vision & Scope §3.2 Staff constraint |
| Is your team remote? | No | Team co-located on campus |
| Project duration | 40 weeks | Release 1.0 live for the Semester 1 window |
| Requirements work duration | 14 weeks | Weeks 1–14 |

## 2. Three answers

| Method | Number of BAs | BA budget — requirements phase | BA budget — whole project |
|---|---:|---:|---:|
| **A** — 15% of total project budget | **2.04** | USD 143,000 | USD 407,000 |
| **B** — 6 developers per BA (Standard) | **1.67** | USD 117,000 | USD 333,000 |
| **C** — Activity-based, 893 hours | **1.59** | USD 112,000 | USD 319,000 |

893 hours ÷ 40 hours ÷ 14 weeks = **1.59 BAs**. No remote buffer applies — the team is
co-located.

## 3. Reading the spread

The three answers are unusually close (1.59 to 2.04), and the reason is worth stating:
**CARS is a mid-sized system with few interfaces.** Fourteen use cases, twenty-six
screens and only five interfacing systems, none of them large. The three methods
measure different things but, on a system this shaped, they land in the same place.

That is a genuine finding rather than a coincidence, and it cuts both ways:

- **It raises confidence in the number.** Three independent methods agreeing within
  0.45 of a BA is stronger evidence than any one of them alone.
- **It does not mean the estimate is complete.** All three methods price *artifacts and
  headcount*. None of them prices the two things this project's own risk register says
  will consume analyst time: **RI-2**, the curriculum-rule data audit, and **TBD-5**,
  finding out which programmes cannot be expressed as machine-evaluable rules.

## 4. What we commit to, and what would change it

> **We staff 2 BAs for the 14-week requirements phase, at a budget of USD 143,000.**

**Why 2 and not 1.59 or 1.67.** Methods B and C price the system as specified. They do
not contain the curriculum-rule audit, which assumption A2 makes a precondition of
Release 1.0 and which the team cannot start without a BA. Method A's 2.04 is the only
figure with headroom for it, and rounding to 2 makes the headroom explicit rather than
accidental.

**What would change our mind — stated in advance:**

| Trigger | Revised commitment |
|---|---|
| TBD-5 shows more than 10% of programmes cannot be expressed as rules | Escalate to 3 BAs; assumption A2 fails and the rule work grows substantially |
| The finance vendor confirms a synchronous API in Week 3 (RI-1 closed) | Hold at 2 BAs; the adapter work in CO-7 shrinks but does not disappear |
| The finance vendor refuses, forcing a nightly file exchange | Hold at 2 BAs, but re-plan UC-05 — the exception paths multiply and Finance-3 becomes the normal case |
| Requirements phase compressed from 14 weeks to 10 | Escalate to 2.5 BAs — the work does not shrink with the calendar |

**BA cost for the whole project:** USD 407,000 at 2 BAs across 40 weeks. This is the
honest figure for the sponsor. Analysts do not stop at the baseline — they answer
questions, run change control and maintain traceability until release.

## 5. Sensitivity: the hourly rate

The USD 125 blended rate is the tool's default, from the book's US context. At a
Vietnamese blended BA rate of roughly USD 45/hour:

| Method | BAs at USD 125/h | BAs at USD 45/h |
|---|---:|---:|
| A — 15% of budget | 2.04 | **5.66** |
| B — developer ratio | 1.67 | 1.67 |
| C — activity-based | 1.59 | 1.59 |

**Only method A moves.** That exposes what it measures: not how much analysis the
project needs, but how many analyst-hours 15% of the budget happens to buy. At local
rates the agreement described in §3 disappears entirely, and method A becomes an upper
bound on *affordable* effort rather than an estimate of *necessary* effort.

This matters for the §4 commitment. We used method A's headroom to justify rounding up
to 2 BAs — but that headroom is an artefact of a US rate. If NRU staffs the project at
local rates, the honest justification for the second BA is **RI-2 and TBD-5**, not the
15% rule. We state it that way rather than letting a rate assumption carry the argument.
