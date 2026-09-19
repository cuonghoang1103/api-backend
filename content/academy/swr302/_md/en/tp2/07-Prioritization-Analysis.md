# Requirement Prioritization — Analysis
## for the Order Management and Fulfillment System (OMFS)

Version 1.0 approved
Prepared by **<Member 5 name>**, Business Analysis Team — Group <N>
Nova Retail Group (NRG)
17 September 2026

> The worksheet itself is `deliverables/07-Requirements-Prioritization.xlsx`, built on
> the Chapter 16 template by Wiegers & Beatty with its formulas unchanged. This
> document explains the inputs and what the output does and does not mean.

---

## 1. The model

Each candidate feature is rated 1–9 on four dimensions and the sheet computes:

```
Total Value = Benefit × w_benefit + Penalty × w_penalty
Priority    = Value %  ÷  ( Cost % × w_cost  +  Risk % × w_risk )
```

**Benefit** and **Penalty** are different questions and both are asked deliberately.
Benefit is the value if the feature is present; penalty is the damage if it is absent.
A feature can score low on benefit and high on penalty — FE-12 (cancellation) is
exactly that: nobody is delighted by it, but without it reserved stock stays locked
and the oversell problem reappears in another form.

## 2. Weights, and why

| Dimension | Weight | Justification |
|---|---|---|
| Benefit | **2** | The COO's business case rests on removing the constraint on growth. Value delivered outweighs damage avoided. |
| Penalty | **1** | Baseline. |
| Cost | **1** | Baseline. |
| Risk | **0.5** | Every technical risk in this project has a named mitigation in Vision & Scope §1.6, so risk is real but managed. Weighting it equally with cost would over-penalise the two integration-heavy features, which are the ones delivering objective BO-5. |

## 3. What was excluded from scoring

Wiegers is explicit that features which must be included regardless — for political,
contractual or regulatory reasons — should not be scored, because ranking something
that cannot be dropped produces a meaningless number. Excluded (see the *Must-do (not
scored)* sheet):

| Item | Why it cannot be traded away |
|---|---|
| **FE-1** Multi-channel order ingestion | Nothing else in OMFS can run without an order record |
| **CO-1** Corporate identity provider | Corporate security policy |
| **CO-5** No storage of payment card data | Keeps OMFS out of PCI scope |
| **OR-1** Personal data retention and erasure | Decree 13/2023/ND-CP |

Thirteen features remain and were scored in a single pass, which matters because every
percentage in the sheet is a share of the column total.

## 4. The result

| Rank | Feature | Value % | Cost % | Risk % | **Priority** |
|---:|---|---:|---:|---:|---:|
| 1 | FE-10 Customer notification and self-service tracking | 7.84 | 5.17 | 4.00 | **1.094** |
| 2 | FE-2 Order screening and validation | 7.45 | 5.17 | 4.00 | **1.039** |
| 3 | FE-6 Pick wave generation and release | 6.67 | 5.17 | 4.00 | **0.929** |
| 4 | FE-12 Order cancellation and modification | 6.67 | 5.17 | 6.00 | **0.816** |
| 5 | FE-11 Fulfillment exception management | 7.45 | 6.90 | 6.00 | **0.753** |
| 6 | FE-3 Real-time inventory and ATP | 10.59 | 10.34 | 10.00 | **0.690** |
| 7 | FE-7 Scan-verified pick and pack | 8.63 | 8.62 | 8.00 | **0.684** |
| 8 | FE-4 Channel stock synchronization | 9.41 | 8.62 | 12.00 | **0.644** |
| 9 | FE-9 Carrier tracking event ingestion | 8.24 | 6.90 | 12.00 | **0.639** |
| 10 | FE-5 Automated routing and splitting | 9.80 | 12.07 | 10.00 | **0.574** |
| 11 | FE-14 Dashboard and cost reconciliation | 5.10 | 6.90 | 4.00 | **0.573** |
| 12 | FE-8 Carrier rate shopping and label purchase | 7.45 | 10.34 | 14.00 | **0.430** |
| 13 | FE-13 Returns and restocking | 4.71 | 8.62 | 6.00 | **0.405** |

## 5. Reconciling the ranking with the release plan — the important part

**The ranking and the release plan disagree, and the release plan is right.**

Release 1.0 ships FE-2, FE-3, FE-4, FE-5, FE-6, FE-7 and FE-12. Three of those —
FE-3, FE-4 and FE-5 — sit at ranks 6, 8 and 10. Meanwhile FE-10, which the model ranks
**first**, is deferred to Release 1.2.

This is not an error in the model and not an error in the plan. It is the model working
as designed and then being overruled for a reason the model cannot see:

- **The model rewards cheap, safe, useful features.** FE-10 is genuinely cheap, safe
  and useful, which is why it wins. FE-5 is expensive and complex, which is why it loses.
- **The model has no concept of dependency or sequencing.** FE-10 shows customers their
  order status. Showing a customer a status that is wrong — because stock was oversold
  (FE-3) and the order is about to be cancelled — is worse than showing them nothing.
  FE-10 delivers its value only *after* status is trustworthy.
- **The model has no concept of the business case.** BO-1 and BO-2 are what the COO
  funded. FE-3, FE-4 and FE-5 are the only features that deliver them.

**Decision:** the release plan in Vision & Scope §2.2 stands. The worksheet is used for
two things instead — sequencing **within** a release, and deciding what to drop if the
release runs late. On that second question the model is directly useful: if Release 1.0
must shed scope, **FE-6 and FE-12 go last** (ranks 3 and 4, cheap and low risk, so
keeping them costs little), and **FE-7 is the first candidate to defer** (rank 7, the
most expensive thing in 1.0 that is not FE-3 or FE-5, and the warehouse can continue
with printed slips for one more release).

> A prioritization worksheet whose output is simply obeyed is a worksheet nobody
> thought about. Its value is that it forces the disagreement into the open and makes
> someone state a reason.

## 6. Sensitivity

Two ratings were tested for their effect on the ranking:

| Change | Effect |
|---|---|
| Risk weight raised from 0.5 to 1.0 | FE-8 falls from rank 12 to last, FE-4 and FE-9 each fall two places. No change to the top four. The conclusion in §5 is unaffected. |
| FE-3 benefit lowered from 9 to 7 | FE-3 falls from rank 6 to rank 9. Still mid-table — confirming that FE-3's position is driven by its *cost*, not its rating, and that no plausible rating makes the model agree with the release plan. |

The second test is the more important one. It shows the disagreement in §5 is
structural, not an artefact of one generous rating.
