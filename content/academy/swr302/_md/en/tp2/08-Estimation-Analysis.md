# Requirement Estimation — BA budget and number of BAs
## for the Order Management and Fulfillment System (OMFS)

Version 1.0 approved
Prepared by **<Member 5 name>**, Business Analysis Team — Group <N>
Nova Retail Group (NRG)
17 September 2026

> The tool itself is `deliverables/08-Requirements-Estimation.xlsx`, the Chapter 19
> Requirements Estimation Tool by Wiegers & Beatty with its formulas unchanged. Only
> the yellow input cells were filled; every yellow cell carries a comment naming where
> its value came from.

---

## 1. Inputs, and where each number came from

**These counts are taken from our own deliverables, not estimated.** A count that
disagrees with the documents it claims to describe invalidates everything downstream.

| Input | Value | Source |
|---|---|---|
| Existing pages of documentation for review | 40 | Legacy inventory spreadsheet documentation, 4 carrier portal guides, current-state process notes |
| Existing systems being updated or replaced | 1 | The manual fulfillment process — spreadsheet, printed slips, carrier portals |
| Stakeholders | 16 | COO, 3 Fulfillment Managers, 3 Inventory Controllers, 2 Logistics, 5 Brand Managers, 2 System Administrators |
| Interfacing systems — small | 3 | Payment gateway, notification service, identity provider (SRS §5.2) |
| Interfacing systems — medium | 8 | 4 sales channels + 4 3PL carriers (SRS SI-1 … SI-7) |
| Interfacing systems — large | 1 | ERP / accounting (SRS SI-8) |
| **Process flows and/or use cases** | **14** | **Counted from Deliverable 2 — UC-01 … UC-14** |
| Business data diagrams | 2 | Context diagram + logical data model (SRS Appendix B) |
| **Screens / user interfaces** | **20** | Handheld 6 + manager 7 + agent 4 + customer 3 — SRS §5.1 and Deliverable 6 |
| **Reports** | **7** | **RPT-1 … RPT-7, counted from SRS §4.3** |
| Total project budget | USD 1,200,000 | Vision & Scope §3.2, Cost constraint |
| BA blended hourly cost | USD 125 | The tool's default, retained — see §4 |
| Type of project | Standard | Custom build, not a packaged/COTS implementation |
| Number of developers | 12 | Vision & Scope §3.2, Staff constraint |
| Is your team remote? | Yes | Team split between HCMC and Hanoi → the tool adds a 10% buffer |
| Project duration | 44 weeks | Release 1.0 must land before the 11.11 campaign |
| Requirements work duration | 16 weeks | Weeks 1–16 |

## 2. Three answers

The tool estimates the same two numbers three independent ways. They do not agree,
and the disagreement is the useful part.

| Method | Number of BAs | BA budget — requirements phase | BA budget — whole project |
|---|---:|---:|---:|
| **A** — 15% of total project budget | **2.25** | USD 180,000 | USD 495,000 |
| **B** — 6 developers per BA (Standard) | **2.00** | USD 160,000 | USD 440,000 |
| **C** — Activity-based, +10% remote buffer | **1.71** | USD 137,000 | USD 377,000 |

### Where method C's hours come from

| Category | Hours |
|---|---:|
| Project start and management | 140.6 |
| Model requirements — people (use cases, user stories, org charts) | 360.0 |
| Model requirements — system (context, interface models, display-action-response) | 300.8 |
| Model requirements — data (data diagrams, data dictionaries, report tables) | 195.5 |
| **Requirements work total** | **997.0** |
| Remote team buffer (+10%) | 99.7 |
| **Total** | **1,096.7** |

1,096.7 hours ÷ 40 hours ÷ 16 weeks = **1.71 BAs**.

## 3. Reading the spread — why C is the lowest

The most common expectation is that the activity-based method comes out **highest**,
because it counts real artifacts one by one. Here it comes out **lowest**, and the
reason is worth stating precisely:

- **OMFS is a small-artifact, high-integration system.** Only 14 use cases and 20
  screens — modest counts that the activity model prices cheaply — but **12 interfacing
  systems**, which is a large number for a project this size. Integration analysis is
  concentrated in the 300.8 hours of system modelling; it does not scale with the use
  case count that dominates the model elsewhere.
- **The activity model prices artifacts, not conversations.** It includes project
  kick-off, status reporting and traceability links, but it does not price the four
  elicitation sessions, the requirements inspections recommended in Chapter 17, or the
  change control that will run from the Week-8 baseline through to release.
- **Methods A and B are insensitive to what the system actually is.** Method A is a
  function of the budget alone; method B is a function of the developer count alone.
  Neither has looked at OMFS. That they land near each other is coincidence, not
  corroboration.

## 4. What we commit to, and what would change it

> **We staff 2 BAs for the 16-week requirements phase, at a budget of USD 160,000.**

**Why 2 and not 1.71.** Method C is the most grounded of the three, but it prices only
the artifacts we listed. The elicitation sessions, the peer inspections and the change
control from Week 8 onward are real work that its model does not contain. Rounding
1.71 up to 2 absorbs that, and it happens to coincide with method B — which is
reassurance, not proof.

**Why not 2.25.** Method A's figure is the upper bound, derived from a 15% rule of
thumb that has not looked at this system at all. Committing to it would mean funding a
third of a BA on the strength of an industry average.

**What would change our mind — stated in advance:**

| Trigger | Revised commitment |
|---|---|
| The TBD list in SRS Appendix C still has 3 or more open items at Week 10 | Escalate to 2.25 BAs; unresolved requirements consume analyst time at an accelerating rate |
| Lazada and TikTok Shop are pulled forward from Release 1.1 into 1.0 | Escalate to 2.5 BAs; that adds 2 medium interfacing systems and roughly 60 hours of interface modelling |
| Release 1.0 scope is cut to storefront only | Reduce to 1.5 BAs |
| Requirements phase is compressed from 16 weeks to 12 | Escalate to 2.5 BAs — the work does not shrink with the calendar |

**BA cost for the whole project, not just the requirements phase:** USD 440,000 at 2
BAs across 44 weeks. This is the honest number to quote to the sponsor. Analysts do not
stop when the SRS is baselined — they answer questions, run change control and maintain
traceability until release, which is exactly what methods A, B and C all price in their
third row.

## 5. Sensitivity: the hourly rate

The USD 125 blended rate is the tool's default, carried over from the book's US
context. At a Vietnamese blended BA rate of roughly USD 45/hour:

| Method | BAs at USD 125/h | BAs at USD 45/h |
|---|---:|---:|
| A — 15% of budget | 2.25 | **6.25** |
| B — developer ratio | 2.00 | 2.00 |
| C — activity-based | 1.71 | 1.71 |

**Method A is the only one that moves, and it moves a long way.** This exposes what
method A actually measures: not how much analysis the project needs, but how many
analyst-hours 15% of the budget happens to buy. At local rates it buys far more hours
than the work requires. We therefore treat method A as an upper bound on *affordable*
effort, never as an estimate of *necessary* effort — and this is the strongest reason
for preferring method C's grounding over method A's arithmetic.
