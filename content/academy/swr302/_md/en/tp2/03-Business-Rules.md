# Business Rules
## for the Order Management and Fulfillment System (OMFS)

Version 1.0 approved
Prepared by **<Team Leader name>**, Business Analysis Team — Group <N>
Nova Retail Group (NRG)
17 September 2026

---

### Revision History

| Name | Date | Reason For Changes | Version |
|---|---|---|---|
| BA Team, Group <N> | 2026-09-17 | Rules harvested from elicitation sessions 1–4 | 0.9 |
| BA Team, Group <N> | 2026-09-17 | Classified, de-duplicated and cross-referenced to use cases | 1.0 |

---

## 1. Purpose and scope

This document is NRG's catalog of the business rules that govern order fulfillment.
A **business rule** is a policy, regulation, standard, computation or definition that
exists in the business **independently of any software**, but which the software may
be required to enforce. Rules are recorded here **once**; every use case and every
functional requirement that enforces a rule refers to it **by ID only**, never by
copying its text (see §5, Traceability).

Rules are classified using the five-type taxonomy from Wiegers & Beatty, *Software
Requirements*, 3rd ed., Chapter 9:

| Type | Meaning |
|---|---|
| **Fact** | A true statement about the business; an invariant of the domain |
| **Constraint** | Something that must or must not happen; restricts an action |
| **Action enabler** | A condition that, when true, triggers an action |
| **Inference** | New knowledge derived from existing facts ("if A then B is true") |
| **Computation** | A formula that produces a value |

**Static or Dynamic** records whether the *rule itself* is expected to change over
time. Dynamic rules must be **configurable in the system**, not compiled into it;
this distinction is the single most useful thing in the table for the development
team.

---

## 2. The rules

| ID | Rule Definition | Type of Rule | Static or Dynamic | Source |
|---|---|---|---|---|
| **BR-01** | An order line is fulfilled from exactly one fulfillment center. A line is never split across centers; an *order* may be split, a *line* may not. | Fact | Static | Fulfillment Manager, session 2 |
| **BR-02** | Stock may be reserved for an order line only when available-to-promise for that SKU at the selected fulfillment center is greater than or equal to the ordered quantity. | Constraint | Static | Inventory Controller, session 2 |
| **BR-03** | All lines of a single order are delivered to one shipping address. A customer wanting two addresses must place two orders. | Constraint | Static | Fulfillment Manager, session 2 |
| **BR-04** | If payment authorization is not confirmed within 30 minutes of a reservation being created, the reservation is released. | Action enabler | Dynamic | Finance policy (COO), session 3 |
| **BR-05** | An order may be cancelled or modified only before its shipping label has been purchased. After that, the correct process is a return. | Constraint | Static | Customer Service Manager, session 3 |
| **BR-06** | Routing score = (w₁ × stock coverage) + (w₂ × proximity to destination) + (w₃ × expected shipping cost) + (w₄ × remaining center capacity), where w₁+w₂+w₃+w₄ = 1.0. The center with the highest score fulfills the order. | Computation | Dynamic | Fulfillment Manager, session 2 |
| **BR-07** | Available-to-promise (ATP) = on-hand − reserved − damaged − safety stock, computed per SKU per fulfillment center. | Computation | Dynamic | Inventory Controller, session 2 |
| **BR-08** | An order may be split across at most three fulfillment centers. An order requiring more than three becomes a fulfillment exception. | Constraint | Dynamic | Fulfillment Manager, session 2 |
| **BR-09** | An order is "at risk" when (promised delivery date − today) is less than the selected carrier's published transit time for the destination. | Inference | Dynamic | Logistics Manager, session 3 |
| **BR-10** | Orders routed to a fulfillment center after 14:00 local time are dispatched on the next working day. | Fact | Dynamic | Fulfillment Manager, session 2 |
| **BR-11** | A carrier is eligible for a shipment only if it serves the destination postcode **and** the parcel is within that carrier's weight and dimension limits **and** the carrier is marked Active. | Constraint | Dynamic | Logistics Manager, session 3 |
| **BR-12** | Landed shipping cost = base rate for the weight band + remote-area surcharge (if applicable) + fuel surcharge − contracted volume discount. | Computation | Dynamic | Logistics Manager, session 3 |
| **BR-13** | If a shipment released in a pick wave has not been picked within 24 hours of release, it is escalated to the Fulfillment Manager. | Action enabler | Dynamic | Fulfillment Manager, session 2 |
| **BR-14** | A return is accepted only within 30 days of the delivery date recorded against the shipment. | Constraint | Dynamic | Customer Service Manager, session 3 |
| **BR-15** | On return inspection, an item recorded as sellable is restocked to available inventory; an item recorded as damaged is moved to quarantine and must not re-enter sellable stock. | Action enabler | Static | Inventory Controller, session 4 |
| **BR-16** | Orders originating from a marketplace channel may not be modified after acceptance; they may only be cancelled in full. | Fact | Dynamic | Marketplace seller agreements (Brand Manager), session 3 |
| **BR-17** | Safety stock is held per SKU per fulfillment center and is excluded from available-to-promise. The default is 2 units and it is configurable per SKU. | Constraint | Dynamic | Inventory Controller, session 2 |
| **BR-18** | A SKU is "at risk of stockout" when its available-to-promise across all fulfillment centers is less than its average daily sales velocity over the previous 7 days. | Inference | Dynamic | Inventory Controller, session 4 |
| **BR-19** | Only a user holding the Fulfillment Manager role may override an automated routing decision, and every override must record a reason. | Constraint | Static | COO, session 1 |
| **BR-20** | When the sellable quantity of a SKU changes for any reason, the new quantity is published to every active sales channel selling that SKU within 60 seconds. | Action enabler | Dynamic | COO, session 1 |

### 2.1 Coverage by type

| Type | Rules | Count |
|---|---|---|
| Fact | BR-01, BR-10, BR-16 | 3 |
| Constraint | BR-02, BR-03, BR-05, BR-08, BR-11, BR-14, BR-17, BR-19 | 8 |
| Action enabler | BR-04, BR-13, BR-15, BR-20 | 4 |
| Inference | BR-09, BR-18 | 2 |
| Computation | BR-06, BR-07, BR-12 | 3 |
| | **Total** | **20** |

### 2.2 Static versus dynamic — what it means for the build

Fourteen of the twenty rules are **dynamic**, so their values must be held in
configuration and changed by a business user, not by a developer. Specifically:

| Rule | Configurable value | Who may change it |
|---|---|---|
| BR-04 | Reservation expiry (30 min) | System Administrator |
| BR-06 | Routing weights w₁…w₄ | Fulfillment Manager |
| BR-07 | Which stock buckets are deducted | System Administrator |
| BR-08 | Maximum split count (3) | Fulfillment Manager |
| BR-10 | Dispatch cut-off time (14:00) | Fulfillment Manager, per center |
| BR-11 | Carrier eligibility and limits | Logistics Manager |
| BR-12 | Rate card, surcharges, discount | Logistics Manager |
| BR-13 | Pick escalation window (24 h) | Fulfillment Manager |
| BR-14 | Return window (30 days) | Customer Service Manager |
| BR-17 | Safety stock default and per-SKU override | Inventory Controller |
| BR-18 | Velocity window (7 days) | Inventory Controller |
| BR-20 | Publication target (60 s) | System Administrator |

> This table is why the type column matters. A team that hard-codes a 30-day
> return window has not broken a requirement, but it has guaranteed a code change
> the first time the business runs a 45-day holiday returns promotion.

---

## 3. Rules that are deliberately NOT enforced in software

Not every business rule belongs in the system. Recording the ones that do not —
and why — prevents them being re-discovered and re-argued in a later release.

| Rule | Why it is not enforced by OMFS |
|---|---|
| Refunds are issued within 5 working days of a return being accepted | Refunds are executed in the payment gateway by the finance team; OMFS records that a refund is due (EX-5) |
| A damaged item must be photographed before being quarantined | A warehouse procedure, verified by supervisor audit, not by software |
| Marketplace seller ratings must stay above the Preferred threshold | An outcome the project targets, not a rule the system can enforce |
| Bin locations are reorganized quarterly | Belongs to warehouse management, explicitly out of scope (EX-3) |

---

## 4. How the rules were discovered

| Session | Date | Stakeholder role played | Technique | Rules yielded |
|---|---|---|---|---|
| 1 | 2026-09-08 | COO (project sponsor) | Structured interview, 8 prepared questions | BR-19, BR-20 |
| 2 | 2026-09-09 | Fulfillment Manager + Inventory Controller | Facilitated workshop with current-state process walkthrough | BR-01, BR-02, BR-03, BR-06, BR-07, BR-08, BR-10, BR-13, BR-17 |
| 3 | 2026-09-11 | Logistics Manager + Customer Service Manager + Brand Manager | Structured interview | BR-04, BR-05, BR-09, BR-11, BR-12, BR-14, BR-16 |
| 4 | 2026-09-12 | Inventory Controller | Follow-up on open questions from session 2 | BR-15, BR-18 |

**Technique note.** The richest source was session 2's **current-state process
walkthrough**: asking "and then what happens?" through the existing manual
fulfillment process surfaced nine rules, most of which nobody had ever written
down — they existed only as the habits of experienced staff. Rules discovered this
way (BR-01, BR-08, BR-10) were confirmed with the Fulfillment Manager before being
recorded, because a habit is not automatically a policy.

**Open questions carried into the SRS TBD list**

| # | Question | Owner | Target |
|---|---|---|---|
| TBD-1 | Does the 30-day return window (BR-14) run from delivery or from dispatch? Two stakeholders answered differently. | Customer Service Manager | Week 7 |
| TBD-2 | Are the routing weights (BR-06) the same for all five brands in Release 1.0, or per brand? | Fulfillment Manager | Week 6 |
| TBD-3 | Does safety stock (BR-17) apply per channel as well as per fulfillment center? | Inventory Controller | Week 7 |

---

## 5. Traceability: rule → use case → requirement

Each rule is enforced by one or more use cases and, through them, by specific
functional requirements in the SRS. **The rule text appears only in this document**;
everything else refers to the ID.

| Rule | Enforced in use case(s) | SRS functional requirement(s) |
|---|---|---|
| BR-01 | UC-03, UC-04 | Reserve-2, Route-1 |
| BR-02 | UC-03 | Reserve-2 |
| BR-03 | UC-02 | Validate-3 |
| BR-04 | UC-02, UC-03 | Reserve-3 |
| BR-05 | UC-10, UC-11 | Cancel-1, Cancel-2 |
| BR-06 | UC-04, UC-14 | Route-2, Route-3 |
| BR-07 | UC-03, UC-06, UC-13 | Reserve-1, Sync-1 |
| BR-08 | UC-03, UC-04 | Route-4 |
| BR-09 | UC-04, UC-08, UC-09, UC-10, UC-14 | Track-4, Except-1 |
| BR-10 | UC-04, UC-05 | Route-5, Wave-2 |
| BR-11 | UC-07 | Label-1 |
| BR-12 | UC-07 | Label-2 |
| BR-13 | UC-05, UC-06, UC-10 | Wave-4 |
| BR-14 | UC-12 | Return-1 |
| BR-15 | UC-12 | Return-4 |
| BR-16 | UC-01, UC-11 | Cancel-4 |
| BR-17 | UC-03, UC-06, UC-13 | Reserve-1, Sync-2 |
| BR-18 | UC-14 | Dash-3 |
| BR-19 | UC-04 | Route-6 |
| BR-20 | UC-13 | Sync-3 |

**Every rule in this catalog is enforced by at least one use case.** A rule with no
enforcing use case would be either out of scope (see §3) or a gap in the use case
set — this check was run before baselining and is repeated before submission.
