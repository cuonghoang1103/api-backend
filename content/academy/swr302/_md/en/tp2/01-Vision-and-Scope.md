# Vision and Scope Document
## for the Order Management and Fulfillment System (OMFS)

Version 1.0 approved
Prepared by **<Team Leader name>**, Business Analysis Team — Group <N>
Nova Retail Group (NRG)
17 September 2026

---

### Revision History

| Name | Date | Reason For Changes | Version |
|---|---|---|---|
| BA Team, Group <N> | 2026-09-17 | Initial draft after stakeholder elicitation round 1 | 0.9 |
| BA Team, Group <N> | 2026-09-17 | Baseline approved by Project Sponsor | 1.0 |

---

## 1. Business Requirements

### 1.1 Background

Nova Retail Group (NRG) is a multi-brand retail company operating five consumer
brands across apparel, home goods and personal care, with approximately 12,000
active SKUs. Until 2024 NRG was primarily a physical-store business with a single
warehouse in Ho Chi Minh City and a small web storefront used mainly as a catalogue.

Over the past 24 months NRG expanded aggressively into online sales. It now sells
through **four sales channels** — its own web storefront plus three marketplaces
(Shopee, Lazada, TikTok Shop) — and operates **three fulfillment centers (FCs)** in
Ho Chi Minh City, Hanoi and Da Nang, shipping through **four third-party logistics
(3PL) carriers** (GHN, GHTK, Viettel Post, J&T Express).

The customer-facing side of this expansion succeeded: the storefront handles
browsing, promotion and checkout well, and average daily order volume grew from
about 600 to **4,500 orders per day**, peaking near **18,000 orders per day** on
campaign dates (9.9, 11.11, 12.12).

The back office did not scale with it. Order fulfillment is still coordinated the
way it was when NRG had one warehouse and one channel: a spreadsheet for inventory,
printed picking slips, and manual carrier uploads. Each new channel, FC and carrier
was bolted onto that manual process rather than integrated into a system. NRG
management has recognized that fulfillment operations, not demand, are now the
constraint on growth.

### 1.2 Business Opportunity

NRG's back-office fulfillment operations are fragmented and uncoordinated. Four
specific problems dominate:

**P1 — Inventory is not synchronized in real time.** Stock levels are pushed from
the warehouse spreadsheet to each channel on a twice-daily batch. Between batches,
the same physical unit can be sold on the storefront and on two marketplaces.
Measured over Q2 2026, **3.8% of all orders were oversold** — roughly 170 orders per
day that must be cancelled, delayed or substituted. Marketplace penalties for
seller-initiated cancellation have twice pushed NRG's Shopee seller rating below the
Preferred Seller threshold.

**P2 — Order routing is manual and unoptimized.** Warehouse staff print every order,
sort the slips by hand, and decide which FC fulfills which order using personal
judgement. There is no automated routing logic, no consideration of stock coverage,
distance or carrier cost, and no ability to split an order across FCs. Staff spend
about **6 hours per day** on printing and sorting alone, and orders are regularly
routed to an FC that must then backorder an item another FC has on the shelf.

**P3 — 3PL integration is a manual file exchange.** Shipping labels are bought in
each carrier's own web portal, and tracking events come back as CSV files that an
operations clerk uploads twice a day. Order status visible to the customer therefore
lags physical reality by up to **12 hours**, and label purchase is done on whichever
carrier the operator prefers rather than on cost or service level.

**P4 — Customer support is overwhelmed by "Where is my order?" (WISMO) enquiries.**
Because status is stale and no self-service tracking exists, **62% of the ~900
support tickets received each day are WISMO** — about 560 tickets per day that a
human answers by opening three different carrier portals.

No commercially available package NRG has evaluated covers all four channels, all
three FCs and all four Vietnamese carriers without heavy customization. A
centralized Order Management and Fulfillment System, specified around NRG's actual
operating model, is the proposed solution.

### 1.3 Business Objectives

| ID | Business Objective | Baseline (Q2 2026) | Target | Deadline |
|---|---|---|---|---|
| **BO-1** | Reduce the oversell rate by synchronizing inventory across all sales channels in near real time | 3.8% of orders | ≤ 0.5% of orders | 6 months after Release 1.0 |
| **BO-2** | Automate order routing so that human intervention is the exception, not the rule | 0% automated | ≥ 95% of orders routed with no manual touch | 3 months after Release 1.0 |
| **BO-3** | Reduce order-to-ship cycle time | 26 hours average | ≤ 8 hours average | 6 months after Release 1.0 |
| **BO-4** | Reduce WISMO contact volume through accurate, self-service order tracking | ~560 tickets/day | ≥ 60% reduction (≤ 224 tickets/day) | 6 months after Release 1.0 |
| **BO-5** | Reduce average outbound shipping cost per order through automated carrier rate shopping | 38,000 VND/order | ≥ 12% reduction (≤ 33,440 VND/order) | 9 months after Release 1.0 |
| **BO-6** | Absorb campaign-day peaks without adding fulfillment headcount | 18,000 orders/day requires 22 temporary staff | 20,000 orders/day with permanent staff only | First campaign after Release 1.0 |

### 1.4 Success Metrics

| Metric | Measurement method | Source of data | Reporting frequency |
|---|---|---|---|
| Oversell rate | (Orders cancelled or short-shipped due to insufficient stock ÷ total orders) × 100 | OMFS order and exception records | Weekly |
| Automated routing rate | (Orders routed with no operator override ÷ total orders) × 100 | OMFS routing audit log | Weekly |
| Order-to-ship cycle time | Median and mean hours from order acceptance to carrier pickup scan | OMFS timestamps + carrier events | Daily |
| WISMO ticket share | WISMO-tagged tickets ÷ total support tickets | Support desk tagging | Weekly |
| Shipping cost per order | Total 3PL invoice ÷ orders shipped, per month | 3PL invoice reconciliation | Monthly |
| Tracking freshness | 95th percentile delay between carrier event time and OMFS status update | OMFS event ingestion log | Daily |

**Factors with the greatest impact on success (inside NRG's control):** quality of
the master SKU data migrated into OMFS; willingness of FC supervisors to abandon
paper slips; timely provision of carrier API credentials.

**Factors outside NRG's control:** marketplace API rate limits and breaking changes;
3PL carriers' API availability and event accuracy; campaign-day traffic from the
marketplaces themselves.

### 1.5 Vision Statement

> **For** the operations, warehouse and customer service teams of Nova Retail Group
> **who** must fulfill orders arriving from four sales channels across three
> fulfillment centers and four carriers,
> **the Order Management and Fulfillment System (OMFS)** is a centralized
> order management and fulfillment platform
> **that** maintains a single, real-time view of inventory, routes and splits every
> order automatically to the fulfillment center that can ship it fastest and
> cheapest, and keeps order status accurate end-to-end without manual file uploads.
> **Unlike** the current mix of spreadsheets, printed picking slips and per-carrier
> web portals,
> **OMFS** treats the order — not the channel and not the warehouse — as the unit of
> work, so that inventory, routing, shipping and customer communication are driven
> from one authoritative record.

### 1.6 Business Risks

| ID | Risk | Severity | Probability | Mitigation |
|---|---|---|---|---|
| **RI-1** | Marketplace APIs change or throttle without notice, breaking order ingestion or stock push | High | Medium | Build an anti-corruption adapter layer per channel; queue-and-retry with alerting; contractual notification with marketplace account managers |
| **RI-2** | Master SKU and inventory data are too dirty to migrate, so OMFS starts with an inaccurate stock picture and does not fix P1 | High | High | Run a data quality audit and cleansing project *before* cutover; define acceptance thresholds for data migration |
| **RI-3** | FC staff resist abandoning paper slips, continuing to work around the system | Medium | Medium | Involve FC supervisors as product champions from elicitation onward; phased FC-by-FC rollout; scan-verify makes paper unnecessary rather than forbidden |
| **RI-4** | A 3PL carrier cannot or will not provide a usable label/tracking API | Medium | Medium | Verify API availability with all four carriers during Release 1.0 analysis; retain manual fallback for any carrier without an API, isolated behind the same internal interface |
| **RI-5** | Peak-day volume exceeds the system's designed throughput, causing a worse outage than the current manual process | High | Low | Explicit peak-load quality attributes; load testing at 1.5× the historical peak before the first campaign date |
| **RI-6** | Project cost or schedule overrun causes cancellation before Release 1.0 delivers measurable benefit | Medium | Medium | Release 1.0 scoped to the two highest-value objectives (BO-1, BO-2) only; features prioritized per the prioritization worksheet (Deliverable 7) |

### 1.7 Business Assumptions and Dependencies

**Assumptions**

- A1: All four marketplaces expose an order-retrieval and a stock-update API under NRG's existing seller agreements.
- A2: NRG will continue to operate exactly three FCs for the duration of Release 1.0 and 1.1.
- A3: Physical inventory counts in each FC are accurate to within 2% at the time of data migration.
- A4: The existing web storefront will remain the customer-facing checkout; OMFS does not replace it.
- A5: Warehouse staff have, or will be issued, handheld barcode scanners in all three FCs.

**Dependencies**

- D1: API credentials and sandbox access from all four 3PL carriers, obtained by the NRG Logistics Manager.
- D2: The existing ERP/accounting system must accept a daily posting of shipped-order financials.
- D3: Network and Wi-Fi coverage adequate for handheld scanners throughout each FC (facilities project, tracked separately).
- D4: Availability of the Cafeteria-of-record master data steward for 8 hours per week during requirements and migration.

---

## 2. Scope and Limitations

### 2.1 Major Features

| ID | Feature | Addresses |
|---|---|---|
| **FE-1** | Multi-channel order ingestion — pull and normalize orders from the storefront and all marketplaces into one order record | P2, P4 |
| **FE-2** | Order screening and validation — address, payment and fraud checks before an order consumes stock | P1 |
| **FE-3** | Real-time inventory and ATP (available-to-promise) management across FCs, with reservation on order acceptance | P1, BO-1 |
| **FE-4** | Channel stock synchronization — push available quantities back to every sales channel on change | P1, BO-1 |
| **FE-5** | Automated order routing and splitting — select the FC(s) that fulfill each order line by a configurable scoring rule | P2, BO-2, BO-3 |
| **FE-6** | Pick wave generation and release — group routed orders into picking waves per FC | P2, BO-3 |
| **FE-7** | Scan-verified pick and pack — handheld-driven picking with item verification and carton assignment | P2, BO-3 |
| **FE-8** | Carrier rate shopping and label purchase — compare eligible carriers by cost and service level, then buy the label via API | P3, BO-5 |
| **FE-9** | Carrier tracking event ingestion — receive and apply carrier status events automatically | P3, BO-4 |
| **FE-10** | Customer notification and self-service order tracking | P4, BO-4 |
| **FE-11** | Fulfillment exception management — backorder, split, short-ship and address-failure handling in one operator console | P1, P2 |
| **FE-12** | Order cancellation and modification before dispatch | P1 |
| **FE-13** | Returns and restocking (RMA) | — |
| **FE-14** | Fulfillment performance dashboard and 3PL invoice reconciliation | BO-5, all |

### 2.2 Scope of Initial Release (Release 1.0)

Release 1.0 targets **BO-1 (oversell), BO-2 (routing automation) and BO-3 (cycle
time)** — the objectives that unblock growth — and establishes the order record that
every later feature depends on.

Included: **FE-1, FE-2, FE-3, FE-4, FE-5, FE-6, FE-7**, plus manual label purchase
retained as-is.

Scope boundaries for Release 1.0:
- Storefront and Shopee channels only; Lazada and TikTok Shop follow in 1.1.
- All three FCs from day one (routing is meaningless with one FC).
- Routing rule configurable by an operations administrator, but with a single
  scoring formula; multi-formula per-brand routing is deferred.

### 2.3 Scope of Subsequent Releases

| Release | Target | Contents |
|---|---|---|
| **1.1** | +3 months | **FE-8** carrier rate shopping and API label purchase; **FE-9** automated tracking ingestion; remaining two marketplace channels (Lazada, TikTok Shop). Delivers BO-5 and the data needed for BO-4. |
| **1.2** | +6 months | **FE-10** customer notification and self-service tracking; **FE-11** exception console. Delivers BO-4. |
| **2.0** | +12 months | **FE-13** returns and restocking; **FE-14** dashboard and 3PL invoice reconciliation; per-brand routing formulas; supplier drop-ship as a virtual FC. |

### 2.4 Limitations and Exclusions

The following are explicitly **not** in scope for any release covered by this document:

- **EX-1** OMFS does not replace the web storefront, its catalogue, pricing, promotions or checkout.
- **EX-2** OMFS does not replace the ERP/accounting system; it posts to it.
- **EX-3** OMFS is not a warehouse management system (WMS). It does not manage bin locations, putaway, cycle counting or labour scheduling inside an FC.
- **EX-4** OMFS does not manage procurement, purchase orders or inbound receiving.
- **EX-5** OMFS does not process payments. It reads authorization status from the payment gateway.
- **EX-6** OMFS does not provide demand forecasting or replenishment planning.
- **EX-7** Physical in-store (POS) orders and in-store pickup are out of scope for Releases 1.0–2.0.
- **EX-8** OMFS does not host a customer account portal; self-service tracking (FE-10) is reachable by order-specific link only.

---

## 3. Business Context

### 3.1 Stakeholder Profiles

| Stakeholder | Major Value | Attitudes | Major Interests | Constraints |
|---|---|---|---|---|
| **Chief Operating Officer** (project sponsor) | Growth no longer limited by fulfillment capacity | Strongly supportive; owns the business case | BO-1 and BO-3 above all; visible ROI within 2 quarters | Maximum budget USD 1.2M; Release 1.0 must land before the 11.11 campaign |
| **Fulfillment Manager** | Automated routing replaces daily judgement calls; visibility across all three FCs | Supportive but sceptical that software can route better than experienced staff | Routing rule must be inspectable and overridable; split-order handling | Cannot pause operations for cutover; no more than 4 hours' downtime |
| **Warehouse Operator** (3 FCs, ~60 users) | No more sorting printed slips; scanner tells them what to pick | Cautious; fear of being measured and of a system that slows them down | Speed of the pick screen; works with gloves and on low-end handhelds | Low-end Android handhelds; intermittent Wi-Fi in FC aisles; shift-based, low tolerance for training |
| **Inventory Controller** | One authoritative stock figure instead of reconciling four | Highly receptive — this role exists only because of the current problem | Accuracy of ATP; auditability of every reservation and release | Must keep the legacy spreadsheet in parallel for the first month |
| **Customer Service Agent** (~25 users) | Stops answering 560 WISMO tickets a day by hand | Very receptive | Accurate status on one screen; ability to answer without opening carrier portals | Deferred to Release 1.2; needs an interim read-only view in 1.0 |
| **Brand Manager** (5 brands) | Fewer cancellations, protected marketplace seller ratings | Interested but not engaged day-to-day | Per-brand fulfillment SLAs and reporting | Wants per-brand routing rules, deferred to 2.0 |
| **Logistics Manager** | Carrier cost becomes a managed number instead of an operator preference | Supportive; owns BO-5 | Rate shopping logic; invoice reconciliation | Carrier API access depends on contract renegotiation |
| **IT Operations / System Administrator** | Fewer manual file transfers to babysit | Neutral; concerned about another system to run | Monitoring, alerting, deployment and data retention | Must run on NRG's existing cloud tenancy and follow corporate security policy |
| **Customer** (indirect) | Accurate delivery expectations; self-service tracking | Currently dissatisfied | Correct status; no cancellation after purchase | Not consulted directly; represented by Customer Service Agent as product champion |

### 3.2 Project Priorities

| Dimension | Driver (state objective) | Constraint (state limits) | Degree of Freedom (state allowable range) |
|---|---|---|---|
| **Schedule** | Release 1.0 live and stable **before the 11.11 campaign** | Hard date; the campaign will not move | — |
| **Features** | — | FE-1 … FE-7 are mandatory for Release 1.0 | 70–80% of high-priority features must ship in 1.0; medium and low priority may slip to 1.1 |
| **Quality** | Oversell rate ≤ 0.5% is the acceptance criterion for the business case | Zero tolerance for lost or duplicated orders | 90–95% of user acceptance tests must pass for Release 1.0; 95–98% for 1.1 |
| **Staff** | — | Maximum team size is 1 PM, 3 BAs, 12 developers, 4 testers | BA count may vary between 2 and 3 during requirements work |
| **Cost** | — | Total project budget USD 1,200,000 | Budget overrun up to 10% acceptable without sponsor review |

### 3.3 Deployment Considerations

- **Environment.** OMFS is deployed to NRG's existing cloud tenancy. No new data centre or on-premises hardware is required, other than handheld scanners already covered by a separate facilities project (D3).
- **Rollout strategy.** FC-by-FC, starting with Da Nang (lowest volume, ~8% of orders) as the pilot, then Hanoi, then Ho Chi Minh City. Each FC runs OMFS in parallel with the legacy spreadsheet for its first two weeks, with the Inventory Controller reconciling daily.
- **Channel strategy.** Storefront first, then Shopee, in that order. A channel is cut over only after its stock-sync accuracy has been observed at ≥ 99.5% for five consecutive days.
- **Cutover window.** Maximum 4 hours of fulfillment downtime, scheduled on a Sunday night outside any campaign period.
- **Data migration.** Master SKU data and opening stock balances are migrated from the legacy spreadsheet after the cleansing project (RI-2). Historical orders are **not** migrated; the legacy records remain available read-only for 24 months.
- **Training.** Warehouse Operators require no classroom training — the scan-verify flow is designed to be learned at the handheld in under 15 minutes (see the usability quality attributes in the SRS). Fulfillment Managers and Inventory Controllers receive a half-day workshop per FC.
- **Support.** Standard NRG IT service desk, with an elevated on-call rota covering the first 30 days after each FC cutover and every campaign date.
- **Back-out plan.** For the first two weeks of each FC's cutover, the legacy spreadsheet process remains executable, so an FC can revert within one shift.
