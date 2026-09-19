# Requirement Prioritization — Analysis
## for the Campus Academic and Registration System (CARS)

Version 1.0 approved
Prepared by **<Member 5 name>**, Business Analysis Team — Group <N>
Northern Regional University (NRU)
17 September 2026

> The worksheet is `deliverables/07-Requirements-Prioritization.xlsx`, built on the
> Chapter 16 template with its formulas unchanged. This document explains the inputs
> and what the output does and does not mean.

---

## 1. The model

```
Total Value = Benefit × w_benefit + Penalty × w_penalty
Priority    = Value %  ÷  ( Cost % × w_cost  +  Risk % × w_risk )
```

**Benefit and Penalty are different questions.** Benefit is the value if the feature is
present; penalty is the damage if it is absent. FE-12 (window administration) is the
clearest example in this project: nobody is excited by it, but without it no
registration window can open at all — benefit 7, penalty 9.

## 2. Weights, and why

| Dimension | Weight | Justification |
|---|---|---|
| Benefit | **2** | The Vice-Rector funded this project to end registration failures and free staff time. Value delivered outweighs damage avoided. |
| Penalty | **1** | Baseline. |
| Cost | **1** | Baseline. |
| Risk | **0.5** | Every risk in Vision & Scope §1.6 has a named mitigation. Weighting risk equally with cost would push FE-5 and FE-9 — the two features carrying RI-1 and RI-2 — to the bottom, which would amount to letting a *managed* risk make the scope decision. |

## 3. What was excluded from scoring

| Item | Why it cannot be traded away |
|---|---|
| **FE-3** Enrollment transaction | The system exists to make this one transaction work |
| **CO-1** University SSO | Corporate security policy |
| **CO-6** Catalog-year rule versioning | Academic Regulations §9.1 |
| **OR-1** Personal data retention | Decree 13/2023/ND-CP |

Thirteen features were scored in a single pass, because every percentage in the sheet
is a share of the column total.

## 4. The result

| Rank | Feature | Value % | Cost % | Risk % | **Priority** |
|---:|---|---:|---:|---:|---:|
| 1 | FE-12 Registration window administration | 8.68 | 5.08 | 4.17 | **1.211** |
| 2 | FE-2 Schedule planning before the window | 8.30 | 6.78 | 4.17 | **0.937** |
| 3 | FE-13 Advising records and holds | 6.04 | 5.08 | 4.17 | **0.842** |
| 4 | FE-1 Course catalog search and browsing | 8.30 | 6.78 | 6.25 | **0.838** |
| 5 | FE-8 Drop, swap and add/drop handling | 7.55 | 6.78 | 6.25 | **0.762** |
| 6 | FE-10 Account balance and payment history | 6.42 | 5.08 | 8.33 | **0.693** |
| 7 | FE-6 Capacity override workflow | 8.68 | 8.47 | 8.33 | **0.687** |
| 8 | FE-11 Section viability and cancellation | 6.04 | 6.78 | 4.17 | **0.681** |
| 9 | FE-4 Prerequisite and co-requisite rule engine | 10.19 | 11.86 | 12.50 | **0.562** |
| 10 | FE-14 Enrollment and capacity reporting | 4.91 | 6.78 | 4.17 | **0.553** |
| 11 | FE-7 Waitlist management | 6.42 | 8.47 | 6.25 | **0.553** |
| 12 | FE-5 Financial eligibility evaluation | 9.06 | 8.47 | 16.67 | **0.539** |
| 13 | FE-9 Real-time degree audit | 9.43 | 13.56 | 14.58 | **0.452** |

## 5. Reconciling the ranking with the release plan — the important part

**The ranking and the release plan disagree, and the release plan is right.**

Look at what the model rewards and what it punishes:

- **FE-4, FE-5 and FE-9 carry the three highest Value % scores in the table** — 10.19,
  9.06 and 9.43. They are the most valuable things in the project, and the model knows
  it. They rank 9th, 12th and 13th anyway, because they are also the most expensive and
  the riskiest.
- **FE-12 wins** on being cheap, safe and unavoidable — not on being important.
- **FE-13 ranks 3rd** and is deferred to Release 1.2, which nobody disputes.

This is the model working correctly and then being overruled for reasons it cannot see:

1. **The model has no concept of the business case.** BO-2 (640 staff-hours) and BO-4
   (240 staff-hours) are what the Vice-Rector funded. Only FE-4 and FE-5 deliver them.
   A Release 1.0 built from the top of this ranking would open a registration window
   beautifully and still check every prerequisite by hand.
2. **The model treats risk as a reason to defer.** FE-5's risk of 8 is entirely RI-1 —
   the finance vendor. Deferring FE-5 does not reduce that risk; it discovers it later,
   when there is less time to route around it. Constraint CO-7 (the adapter) exists
   precisely so the project can start FE-5 *before* the vendor's answer is known.
3. **The model cannot see dependency.** FE-10 ranks 6th but is worthless without FE-5:
   it displays the data FE-5 obtains.

**Decision:** the release plan in Vision & Scope §2.2 stands. The worksheet is used for
two narrower questions instead:

- **Sequencing inside Release 1.0.** Build FE-12, FE-1 and FE-2 first — they are cheap,
  low-risk and they are what a rehearsal window needs in order to load-test anything at
  all.
- **What to drop if the schedule slips.** Rank order says **FE-7 (waitlist) goes
  first** — rank 11, and UC-06 overrides cover the same need less fairly but adequately
  for one semester. **FE-4 and FE-5 cannot be dropped**, because dropping them means
  the project delivers a faster registration window and none of the staff-hour savings
  that justified it.

> A prioritization worksheet whose output is simply obeyed is a worksheet nobody
> thought about.

## 6. Sensitivity

| Change | Effect |
|---|---|
| Risk weight raised from 0.5 to 1.0 | FE-5 falls to last and FE-9 to 12th. The features carrying the project's value sink further — confirming that under this model *risk* is what buries them, not *cost*. |
| FE-5 risk lowered from 8 to 4 (i.e. the vendor confirms an API) | FE-5 rises from rank 12 to rank 5. The single most valuable thing the team can do in Week 3 is get that answer, and this table quantifies why. |

The second row is the useful output of the whole exercise: it converts "we should chase
the finance vendor" into "resolving RI-1 moves our fourth-most-valuable feature up
seven places."
