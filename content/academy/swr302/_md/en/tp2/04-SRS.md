# Software Requirements Specification
## for the Order Management and Fulfillment System (OMFS)

Version 1.0 approved
Prepared by **<Team Leader name>**, Business Analysis Team — Group <N>
Nova Retail Group (NRG)
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

This document specifies the software requirements for release **1.0 through 2.0** of
the **Order Management and Fulfillment System (OMFS)**, a centralized platform that
manages the fulfillment of orders arriving at Nova Retail Group (NRG) from four sales
channels across three fulfillment centers and four third-party logistics carriers.

It is written for four audiences:

| Reader | Uses this document to |
|---|---|
| Development team | Understand what to build and what "done" means for each capability |
| Test team | Derive test cases; every functional requirement is written to be pass/fail testable |
| Project manager | Scope releases and estimate effort |
| Business stakeholders | Confirm that what will be built is what they asked for |

The scope of this SRS is the **whole product across releases 1.0–2.0**; each functional
requirement carries the release in which it is delivered.

## 1.2 Document Conventions

**Requirement identifiers.** Every functional requirement has the form
`<Feature>-<n>`, where `<Feature>` is the short name of the system feature it belongs
to (for example `Reserve-2`, `Route-4`, `Label-1`). Identifiers are permanent: a
deleted requirement's number is never reused. Quality attribute requirements use
`QA-<n>`.

**The word "shall".** Every functional requirement uses **shall** to express an
obligation. Sentences using "should", "may" or "will" are explanatory text, not
requirements, and nothing is tested against them.

**Priority.** Each system feature carries High, Medium or Low, taken from the
requirement prioritization worksheet (deliverable 7). Priorities are dynamic and may
change; the worksheet, not this document, is the master.

**References to other documents.** Business rules appear as `BR-n` only — the rule
text lives in the Business Rules document and is never duplicated here. Use cases
appear as `UC-nn`. Data elements referenced in requirements are defined in the Data
Dictionary.

**Quality attributes** are written in Planguage (Gilb) with SCALE, METER, MUST and
PLAN, so that every one is measurable.

## 1.3 Project Scope

OMFS is the authoritative record of an order from the moment it is retrieved from a
sales channel until it is delivered, cancelled or returned. It maintains one real-time
view of inventory across all fulfillment centers, routes and splits each order
automatically, drives scan-verified picking, buys shipping labels by comparing carrier
rates, keeps order status current from carrier events, and gives customers
self-service visibility of that status.

OMFS does **not** replace the web storefront, the payment gateway, the ERP/accounting
system or a warehouse management system. The full statement of scope, release content
and exclusions is in the **Vision and Scope document**, sections 2.1–2.4, which is the
controlling document and is not duplicated here.

The business objectives OMFS exists to achieve are BO-1 … BO-6 in Vision and Scope
§1.3. Every system feature in section 3 traces to at least one of them.

## 1.4 References

| # | Document | Version | Location |
|---|---|---|---|
| R1 | Vision and Scope Document for OMFS | 1.0 | `deliverables/01-Vision-and-Scope.md` |
| R2 | Use Cases for OMFS | 1.0 | `deliverables/02-Use-Cases.md` |
| R3 | Business Rules for OMFS | 1.0 | `deliverables/03-Business-Rules.md` |
| R4 | Data Dictionary for OMFS | 1.0 | `deliverables/05-Data-Dictionary.md` |
| R5 | Mock-ups for Complex Use Cases | 1.0 | `deliverables/06-Mockups.md` |
| R6 | Requirement Prioritization Worksheet | 1.0 | `deliverables/07-Requirements-Prioritization.xlsx` |
| R7 | Requirement Estimation | 1.0 | `deliverables/08-Requirements-Estimation.xlsx` |
| R8 | Wiegers, K. & Beatty, J., *Software Requirements*, 3rd ed. | 2013 | Microsoft Press |
| R9 | Elicitation session notes 1–4 | — | Team shared folder, `elicitation/` |
| R10 | NRG marketplace seller agreements (Shopee, Lazada, TikTok Shop) | current | Brand Manager |

**Elicitation method note.** Stakeholder input was obtained through four simulated
stakeholder sessions (R9), in which team members played named roles and answered only
what that role would plausibly know. Where a stakeholder answer was unavailable, the
item is recorded in the TBD list (Appendix C) rather than invented.

---

# 2. Overall Description

## 2.1 Product Perspective

OMFS is a **new system replacing a manual process**, not a new version of an existing
product. The process it replaces — a shared inventory spreadsheet, printed picking
slips and four carrier web portals — remains in place until each fulfillment center is
cut over, and remains executable as a back-out route for two weeks after each cutover
(R1 §3.3).

OMFS sits **behind** the customer-facing storefront and **in front of** the physical
warehouse and the carriers. The context diagram is in Appendix B.

**Systems OMFS exchanges data with**

| External system | Direction | What crosses the boundary |
|---|---|---|
| Web storefront | In / out | Orders in; sellable quantities out |
| Marketplace channels (3) | In / out | Orders in; sellable quantities out; cancellations both ways |
| Payment gateway | In | Payment authorization status (read only) |
| 3PL carrier APIs (4) | Out / in | Rate requests and label purchases out; tracking events in |
| ERP / accounting | Out | Daily posting of shipped-order financials |
| Notification service | Out | Customer email and SMS |

## 2.2 User Classes and Characteristics

| User class | Size | Frequency of use | Technical skill | Favored |
|---|---|---|---|---|
| **Warehouse Operator** | ~60 | Continuously during a shift | Low — trained on the job, may not use a computer otherwise | **Yes** |
| **Fulfillment Manager** | 6 | Many times daily | Medium | **Yes** |
| **Inventory Controller** | 3 | Several times daily | Medium — spreadsheet-fluent | **Yes** |
| **Customer Service Agent** | ~25 | Continuously during a shift | Medium | No |
| **Logistics Manager** | 2 | Daily | Medium | No |
| **Brand Manager** | 5 | Weekly | Low | No |
| **System Administrator** | 2 | Occasionally | High | No |
| **Customer** | ~90,000/month | Once or twice per order | Unknown — assume none | No |

**Favored user classes.** Warehouse Operator, Fulfillment Manager and Inventory
Controller are favored: where their needs conflict with another class's, theirs win.
This is a deliberate decision by the COO, because these three classes are the ones
whose manual effort the project exists to remove.

**The consequence for design.** The Warehouse Operator being both favored *and* the
least technical class is the strongest single constraint on this product. It is why
QA-1 and QA-2 exist and why the pick flow is scan-driven rather than form-driven.

## 2.3 Operating Environment

| # | Requirement |
|---|---|
| OE-1 | OMFS shall operate on NRG's existing cloud tenancy; no new data centre is required. |
| OE-2 | Manager and agent interfaces shall run in current versions of Chrome, Edge and Safari on desktop, at a minimum viewport width of 1280 px. |
| OE-3 | The pick and pack interface shall run on Android 10 or later on the existing low-end handheld scanners (2 GB RAM, 5-inch screen). |
| OE-4 | The customer tracking page shall run on current mobile and desktop browsers at a minimum viewport width of 360 px. |
| OE-5 | OMFS shall operate with data stored in the Vietnam region and shall present all times in Asia/Ho_Chi_Minh (UTC+07) while storing them with an explicit offset. |

## 2.4 Design and Implementation Constraints

| # | Constraint | Origin |
|---|---|---|
| CO-1 | OMFS shall use the existing corporate identity provider for staff authentication; it shall not maintain its own staff password store. | Corporate security policy |
| CO-2 | Third-party API keys shall be held as server-side runtime configuration and shall never be delivered to a browser. | Corporate security policy |
| CO-3 | The handheld interface shall function for at least 15 minutes without network connectivity and shall reconcile queued scans on reconnection. | Warehouse Wi-Fi coverage (R1 dependency D3) |
| CO-4 | Every rule marked Dynamic in R3 §2.2 shall be changeable through configuration by the named business role, without a software release. | Business Rules §2.2 |
| CO-5 | OMFS shall not store full payment card data at any time. | PCI scope reduction |
| CO-6 | Channel and carrier integrations shall be isolated behind an internal interface so that adding a channel or carrier does not require changes to order, inventory or routing logic. | RI-1, RI-4 |

## 2.5 Assumptions and Dependencies

**Assumptions** (from R1 §1.7, repeated here because requirements depend on them)

- A1: All four marketplaces expose order-retrieval and stock-update APIs.
- A2: NRG operates exactly three fulfillment centers through releases 1.0 and 1.1.
- A3: Physical stock counts at migration are accurate to within 2%.
- A4: The web storefront remains the customer-facing checkout.
- A5: Handheld barcode scanners are available in all three fulfillment centers.
- A6: Every sellable SKU carries a scannable barcode.
- A7: At least three of the four carriers support webhook delivery of tracking events.

**Dependencies**

- D1: Carrier API credentials and sandbox access, obtained by the Logistics Manager.
- D2: The ERP accepts a daily financial posting in an agreed format.
- D3: Warehouse Wi-Fi coverage adequate for handheld use.
- D4: A master data steward available 8 hours per week during requirements and migration.

> **If A3 is wrong, this SRS is wrong.** Every inventory requirement in §3.3 computes
> from on-hand quantities migrated out of the legacy spreadsheet. Data cleansing is
> therefore a precondition of release, not a parallel activity (risk RI-2).

---

# 3. System Features

Each feature below realizes one major feature from R1 §2.1 and one or more use cases
from R2. Priorities come from the prioritization worksheet (R6).

## 3.1 Multi-channel order ingestion

**Description.** OMFS retrieves orders from every connected sales channel and converts
each into one normalized order record. Realizes FE-1 · Use case UC-01 · Objective BO-2.
**Priority:** High · **Release:** 1.0 (storefront + Shopee), 1.1 (Lazada + TikTok Shop)

**Functional requirements**

**Ingest-1:** The system shall retrieve orders created since the last successful ingestion watermark from each active sales channel at an interval configurable per channel, defaulting to 60 seconds.

**Ingest-2:** The system shall create exactly one order record for each distinct channel order identifier, and shall discard without error any order whose channel identifier already exists.

**Ingest-3:** The system shall map each channel product identifier to an OMFS SKU using the channel SKU mapping table, and shall place any order containing an unmapped identifier into the Unmapped SKU queue with the status Held-Unmapped.

**Ingest-4:** The system shall retain the ingestion watermark unchanged when a channel request fails, and shall retry the request up to five times with exponentially increasing delay before raising an integration alert.

**Ingest-5:** The system shall assign the status Held-Invalid to any retrieved order that lacks a shipping address or that contains no order line, and shall raise a data-quality exception for that order.

**Ingest-6:** The system shall permit a System Administrator to request re-ingestion of a single named channel order identifier.

## 3.2 Order screening and validation

**Description.** Address, payment and fraud checks performed before an order is allowed
to consume stock. Realizes FE-2 · Use case UC-02 · Objective BO-1.
**Priority:** High · **Release:** 1.0

**Validate-1:** The system shall verify that the shipping postcode of an order is served by at least one active carrier before assigning the order the status Validated.

**Validate-2:** The system shall read the payment authorization status for an order from the payment gateway, and shall assign the status Held-Review with the reason PAYMENT_NOT_AUTHORIZED when authorization is absent or declined.

**Validate-3:** The system shall reject any order whose lines specify more than one shipping address, in accordance with BR-03.

**Validate-4:** The system shall omit the payment authorization check for orders whose payment method is cash on delivery.

**Validate-5:** The system shall assign the status Held-Review with the reason PAYMENT_UNKNOWN when the payment gateway does not respond within five minutes, and shall not treat an absent response as an authorization.

**Validate-6:** The system shall permit a Customer Service Agent to release an order from Held-Review to Validated, and shall record the agent, the time and a mandatory justification.

## 3.3 Real-time inventory and available-to-promise

**Description.** The single authoritative stock position, and the reservation of stock
at order acceptance. Realizes FE-3 · Use case UC-03 · Objective BO-1.
**Priority:** High · **Release:** 1.0

**Reserve-1:** The system shall compute available-to-promise per SKU per fulfillment center in accordance with BR-07 whenever the on-hand, reserved, damaged or safety-stock quantity of that SKU at that fulfillment center changes.

**Reserve-2:** The system shall reserve stock for an order line only when available-to-promise for that SKU at the selected fulfillment center is greater than or equal to the ordered quantity, in accordance with BR-01 and BR-02.

**Reserve-3:** The system shall release every reservation belonging to an order that has not been confirmed by payment authorization within the reservation window defined by BR-04, and shall return that order to the status Pending.

**Reserve-4:** The system shall reserve stock for all lines of an order or for none of them, and shall assign the status Backordered to an order for which total available-to-promise across all fulfillment centers is less than the ordered quantity of any line.

**Reserve-5:** The system shall reserve a single order line across more than one fulfillment center when no single center holds sufficient available-to-promise, subject to the split limit in BR-08.

**Reserve-6:** The system shall permit an Inventory Controller to set a safety stock quantity per SKU per fulfillment center, and shall exclude that quantity from available-to-promise in accordance with BR-17.

**Reserve-7:** The system shall re-attempt reservation for a backordered order when the available-to-promise of any SKU on that order increases.

## 3.4 Channel stock synchronization

**Description.** Publication of sellable quantities to every channel that sells a SKU.
Realizes FE-4 · Use case UC-13 · Objective BO-1.
**Priority:** High · **Release:** 1.0

**Sync-1:** The system shall publish the sellable quantity of a SKU, computed in accordance with BR-07, to every active sales channel that sells that SKU whenever that quantity changes.

**Sync-2:** The system shall apply a per-channel buffer quantity, configurable by the Inventory Controller, when computing the quantity published to that channel, in accordance with BR-17.

**Sync-3:** The system shall complete publication of a changed quantity within the interval defined by BR-20, measured from the time the underlying stock change was recorded.

**Sync-4:** The system shall combine multiple stock changes affecting one SKU within a batching window into a single publication carrying the most recent quantity.

**Sync-5:** The system shall compare, at an interval configurable and defaulting to one hour, the quantity each active channel reports against the quantity OMFS holds, and shall republish any SKU where the two differ.

**Sync-6:** The system shall publish a quantity of zero, and shall raise a data-quality alert naming the SKU and fulfillment center, when the computed sellable quantity is less than zero.

**Sync-7:** The system shall queue publications that a channel rejects because of rate limiting, and shall resume them after the interval the channel specifies, without discarding any publication.

## 3.5 Automated order routing and splitting

**Description.** Selection of the fulfillment center or centers that will ship each
line. Realizes FE-5 · Use case UC-04 · Objectives BO-2, BO-3.
**Priority:** High · **Release:** 1.0

**Route-1:** The system shall assign every line of an order to exactly one fulfillment center, in accordance with BR-01.

**Route-2:** The system shall compute a routing score for every candidate fulfillment center in accordance with BR-06, and shall select the candidate grouping with the highest total score.

**Route-3:** The system shall record, against each routed order, the score of every candidate fulfillment center together with each score component and the reason the winner was selected.

**Route-4:** The system shall raise a fulfillment exception, and shall create no shipment, for any order whose routing would require more fulfillment centers than the limit defined by BR-08.

**Route-5:** The system shall assign a next-working-day dispatch date to any order routed to a fulfillment center after that center's dispatch cut-off time, in accordance with BR-10.

**Route-6:** The system shall permit only a user holding the Fulfillment Manager role to override an automated routing decision, and shall require a reason to be recorded with every override, in accordance with BR-19.

**Route-7:** The system shall re-route any routed order that has not entered picking when the fulfillment center it was routed to is closed by a System Administrator.

**Route-8:** The system shall permit a Fulfillment Manager to change the routing score weights without a software release, and shall reject any weight set whose components do not sum to one.

## 3.6 Pick wave generation and release

**Description.** Grouping of routed shipments into batches released to the warehouse
floor. Realizes FE-6 · Use case UC-05 · Objective BO-3.
**Priority:** High · **Release:** 1.0

**Wave-1:** The system shall permit a Fulfillment Manager to create a pick wave from the routed shipments at one fulfillment center, filtered by carrier cut-off, service level, order age and maximum wave size.

**Wave-2:** The system shall include in a wave, when the automatic wave timer runs, every routed shipment whose dispatch date is today and whose carrier cut-off has not passed, in accordance with BR-10.

**Wave-3:** The system shall assign each shipment to at most one open wave, and shall exclude from a wave being created any shipment already assigned to another open wave.

**Wave-4:** The system shall escalate to the Fulfillment Manager any shipment in a released wave that has not been picked within the interval defined by BR-13.

**Wave-5:** The system shall sequence the pick list of a wave by the storage location recorded against each SKU.

**Wave-6:** The system shall create multiple waves rather than one wave exceeding the configured maximum size, and shall report the number of waves created.

**Wave-7:** The system shall permit a Fulfillment Manager to cancel a wave in which no item has been picked, and shall return every shipment in that wave to the status Routed.

## 3.7 Scan-verified pick and pack

**Description.** Handheld-driven picking with barcode verification and carton
assignment. Realizes FE-7 · Use case UC-06 · Objectives BO-2, BO-3.
**Priority:** High · **Release:** 1.0

**Pick-1:** The system shall present to the operator, for each pick task, the SKU, item description, item image, required quantity and storage location.

**Pick-2:** The system shall confirm a pick only when the barcode scanned by the operator matches the barcode recorded against the expected SKU.

**Pick-3:** The system shall escalate a pick task to the Fulfillment Manager after three consecutive barcode mismatches on that task.

**Pick-4:** The system shall permit an operator to record a picked quantity lower than the required quantity, shall adjust the on-hand quantity of that SKU to the counted quantity, and shall raise a short-pick exception.

**Pick-5:** The system shall permit an operator to record a quantity as damaged, shall move that quantity to the damaged quantity for that SKU and fulfillment center, and shall exclude it from available-to-promise in accordance with BR-07.

**Pick-6:** The system shall record the assignment of each picked item to a carton, together with the weight of each carton.

**Pick-7:** The system shall deduct picked quantities from on-hand stock and release their reservations at the moment the shipment is recorded as packed.

**Pick-8:** The system shall accept scans recorded by a handheld device while that device had no network connectivity, and shall apply each such scan exactly once on reconnection.

## 3.8 Carrier rate shopping and label purchase

**Description.** Comparison of eligible carriers and purchase of the shipping label.
Realizes FE-8 · Use case UC-07 · Objective BO-5.
**Priority:** Medium · **Release:** 1.1

**Label-1:** The system shall treat a carrier as eligible for a shipment only when that carrier is active, serves the destination postcode, and accepts the weight and dimensions of every carton in the shipment, in accordance with BR-11.

**Label-2:** The system shall compute the landed cost of each carrier quote in accordance with BR-12.

**Label-3:** The system shall select the eligible carrier with the lowest landed cost whose published transit time does not exceed the number of days remaining until the promised delivery date.

**Label-4:** The system shall select the eligible carrier with the shortest transit time, rather than the lowest cost, for shipments whose order carries an express service level.

**Label-5:** The system shall store the quote obtained from every eligible carrier against the shipment, including the quotes not selected.

**Label-6:** The system shall purchase exactly one label per shipment, and shall query the selected carrier for an existing label against the shipment reference before purchasing when a previous purchase attempt returned no response.

**Label-7:** The system shall exclude a carrier that rejects a label request and shall attempt the next-best quote, up to three carriers, before raising a labelling exception.

**Label-8:** The system shall raise a labelling exception, and shall leave the shipment in the status Packed, when no carrier is eligible or when every carrier quote request fails.

## 3.9 Carrier tracking event ingestion

**Description.** Automatic receipt and application of carrier status events. Realizes
FE-9 · Use case UC-08 · Objective BO-4.
**Priority:** Medium · **Release:** 1.1

**Event-1:** The system shall accept tracking events pushed by a carrier and shall authenticate the sending carrier before applying any event.

**Event-2:** The system shall request tracking events for every open shipment of any carrier that does not push events, at an interval configurable and defaulting to 15 minutes.

**Event-3:** The system shall map each carrier status code to an OMFS status, and shall store without applying any event whose carrier status code has no mapping, raising a configuration alert.

**Event-4:** The system shall order tracking events by the event time recorded by the carrier, and shall not change a shipment status on receipt of an event older than the latest event already applied to that shipment.

**Event-5:** The system shall store, for every tracking event, both the carrier event time and the time OMFS received it.

**Event-6:** The system shall retain in an orphan queue, for 30 days, any tracking event whose tracking number matches no shipment.

**Event-7:** The system shall raise a fulfillment exception for any shipment that has been collected and has received no tracking event for 48 hours.

**Event-8:** The system shall close an order when every shipment belonging to that order has reached the status Delivered.

## 3.10 Customer notification and self-service tracking

**Description.** The customer-facing view of order and shipment status. Realizes FE-10
· Use case UC-09 · Objective BO-4.
**Priority:** Medium · **Release:** 1.2

**Track-1:** The system shall issue, at the time a shipment is labelled, a tracking link containing a token unique to one order, and shall send that link to the customer through the notification service.

**Track-2:** The system shall disclose, in response to a tracking request, information relating only to the single order identified by the token in that request.

**Track-3:** The system shall present each shipment of a split order separately, with its carrier, tracking number, current status and event history, together with an explanation that the order was split.

**Track-4:** The system shall display, for any shipment whose most recent carrier event is older than 48 hours, the time of that event and a statement that no later information has been received, in accordance with BR-09.

**Track-5:** The system shall return an identical response for an invalid token and for a token referring to a non-existent order.

**Track-6:** The system shall present the order-level status, expressed in customer-facing wording, for an order that has no shipment.

**Track-7:** The system shall record each tracking view, so that self-service usage can be measured against business objective BO-4.

## 3.11 Fulfillment exception management

**Description.** One queue for every failure in the fulfillment lifecycle. Realizes
FE-11 · Use case UC-10 · Objectives BO-1, BO-2.
**Priority:** Medium · **Release:** 1.2

**Except-1:** The system shall present open fulfillment exceptions ordered by delivery-date risk computed in accordance with BR-09, and shall identify exceptions that have exceeded the service level defined for their type.

**Except-2:** The system shall offer, for a selected exception, only the resolution options defined for that exception type.

**Except-3:** The system shall record, for every resolution applied, the resolving user, the time, the resolution chosen and a mandatory reason.

**Except-4:** The system shall apply a resolution in full or not at all, and shall leave the exception open when any part of the resolution fails.

**Except-5:** The system shall reject a resolution whose preconditions no longer hold, and shall present the refreshed exception to the user.

**Except-6:** The system shall permit a Fulfillment Manager to apply one resolution to several selected exceptions that share an exception type and cause.

**Except-7:** The system shall escalate to the supervisor of the assigned Fulfillment Manager any exception open longer than the service level defined for its type.

## 3.12 Order cancellation and modification

**Description.** Stopping or changing an order while it remains stoppable. Realizes
FE-12 · Use case UC-11 · Objective BO-1.
**Priority:** Medium · **Release:** 1.0

**Cancel-1:** The system shall permit cancellation or modification of an order only before a shipping label has been purchased for any of its shipments, in accordance with BR-05.

**Cancel-2:** The system shall release every reservation belonging to a cancelled order or cancelled order line, in accordance with BR-05, and shall publish the resulting stock change to every affected sales channel.

**Cancel-3:** The system shall re-route the remaining lines of an order after a line has been cancelled or its quantity reduced.

**Cancel-4:** The system shall permit cancellation but shall refuse modification of an order originating from a channel whose type is Marketplace, in accordance with BR-16, and shall state which channel policy applies.

**Cancel-5:** The system shall re-validate a changed shipping address and shall re-route the order before accepting the change.

**Cancel-6:** The system shall hold a cancellation requested for a shipment already in picking as Pending-Stop, and shall release reservations only after the fulfillment center confirms that picking has stopped.

**Cancel-7:** The system shall queue for retry any cancellation notification that a sales channel rejects, and shall raise an alert when the notification remains undelivered after three attempts.

## 3.13 Returns and restocking

**Description.** Authorization, receipt, inspection and restocking of returned goods.
Realizes FE-13 · Use case UC-12.
**Priority:** Low · **Release:** 2.0

**Return-1:** The system shall create a return authorization only for lines whose delivery date falls within the return window defined by BR-14.

**Return-2:** The system shall permit a supervisor to authorize a return outside the return window, and shall record the supervisor and a mandatory reason.

**Return-3:** The system shall record, for each returned line, the quantity received and the inspection outcome recorded by the operator.

**Return-4:** The system shall increase the on-hand quantity of a returned item recorded as sellable, and shall move to quarantine the quantity of any item recorded as damaged, in accordance with BR-15.

**Return-5:** The system shall close as not received any return authorization for which no goods have arrived within 30 days of authorization.

**Return-6:** The system shall place in an unidentified-returns queue any returned parcel that carries no readable return authorization or shipment reference.

**Return-7:** The system shall raise a fulfillment exception for any quantity received in excess of the authorized quantity.

## 3.14 Fulfillment performance dashboard and cost reconciliation

**Description.** Continuous visibility of the six business objectives. Realizes FE-14 ·
Use case UC-14 · All objectives.
**Priority:** Low · **Release:** 2.0

**Dash-1:** The system shall present orders shipped, order-to-ship cycle time, oversell rate, automated routing rate, open exception count and shipping cost per order, each against its target.

**Dash-2:** The system shall compute every dashboard metric using the definition recorded for the corresponding success metric in the Vision and Scope document §1.4.

**Dash-3:** The system shall identify every SKU whose available-to-promise meets the at-risk-of-stockout condition defined by BR-18.

**Dash-4:** The system shall restrict the fulfillment centers, sales channels and brands visible to a user to those permitted by that user's role.

**Dash-5:** The system shall display, with every metric, the period it covers and the time the underlying data was last refreshed.

**Dash-6:** The system shall present the quotes stored against shipments alongside the amounts invoiced by each carrier, for a period selected by the Logistics Manager.

**Dash-7:** The system shall present a state indicating that no data exists for a selected period, distinct from a state in which the metric value is zero.

**Dash-8:** The system shall present the metrics that completed, and shall identify those that did not, when computation of any metric does not complete.

---

# 4. Data Requirements

## 4.1 Logical Data Model

The entity-relationship model is in **Appendix B**, Figure B-2. It is a *logical*
model — it describes the data the business deals with, not a database schema. Table
design, indexing and physical storage are design decisions outside the scope of this
document.

Principal entities and relationships:

| Entity | Relationship |
|---|---|
| Sales Channel | 1 → n Order |
| Order | 1 → n Order Line · 1 → n Shipment · 1 → 0..n Fulfillment Exception · 1 → 0..n Return Authorization |
| Order Line | 1 → 0..n Reservation |
| Fulfillment Center | 1 → n Inventory Record · 1 → n Shipment · 1 → n Pick Wave |
| Item | 1 → n Inventory Record · 1 → n Order Line |
| Shipment | 1 → n Shipment Line · 1 → 0..n Carton · 1 → 0..n Tracking Event · n → 0..1 Pick Wave |
| Routing Decision | 1 → 1..3 Routing Score, 1 → 1 Order |
| Return Authorization | 1 → n Return Line |

The relationship that most constrains design is **Order → Shipment**: an order may
have several shipments (BR-08) while an order *line* may not be split across
fulfillment centers (BR-01). Collapsing shipment into order — a tempting
simplification — makes a split order unrepresentable.

## 4.2 Data Dictionary

The definition, composition, type, length and allowed values of every data element is
held in the separate **Data Dictionary** document (R4), which contains 110 entries. It
is maintained separately so it can be reused by later projects and so it can change
without re-baselining this SRS.

## 4.3 Reports

| ID | Report | Content and sort order | Audience | Frequency |
|---|---|---|---|---|
| RPT-1 | Daily fulfillment summary | Orders received, shipped, cancelled and backordered; cycle time; by fulfillment center; sorted by center | Fulfillment Manager | Daily 07:00 |
| RPT-2 | Oversell incidents | Every order cancelled or short-shipped for insufficient stock, with SKU, channel and timestamp; sorted by date descending | Inventory Controller | Weekly |
| RPT-3 | Exception ageing | Open exceptions by type and age band, with service-level breaches; sorted by age descending | Fulfillment Manager | Daily |
| RPT-4 | Carrier cost reconciliation | Quoted against invoiced cost per carrier per month, with variance; sorted by variance descending | Logistics Manager | Monthly |
| RPT-5 | Stock at risk | SKUs meeting the condition in BR-18, with velocity and available-to-promise; sorted by days of cover ascending | Inventory Controller | Daily |
| RPT-6 | Channel synchronization drift | SKUs where channel quantity differed from OMFS at reconciliation; sorted by channel | System Administrator | Daily |
| RPT-7 | Brand fulfillment performance | Cycle time, cancellation rate and delivery success by brand; sorted by brand | Brand Manager | Weekly |

Report layouts are deferred to design. This section specifies content, sort order,
audience and frequency only.

## 4.4 Data Acquisition, Integrity, Retention and Disposal

| # | Requirement |
|---|---|
| DA-1 | The system shall acquire order data only from connected sales channels, and shall not permit an order to be created manually. |
| DA-2 | The system shall acquire item master and opening stock data by a one-time migration, and shall reject any record failing the agreed validation rules rather than importing it partially. |
| DA-3 | The system shall record, for every change to a reservation or an on-hand quantity, the time, the cause and the user or process responsible. |
| DA-4 | The system shall retain order, shipment and tracking data for 24 months, after which it shall be archived and removed from the operational store. |
| DA-5 | The system shall retain the audit record of inventory movements for 7 years, in accordance with accounting retention policy. |
| DA-6 | The system shall remove customer name, address, telephone number and email address from archived orders after 24 months, retaining the order and its quantities. |
| DA-7 | The system shall verify daily that the sum of reserved quantities equals the sum of open reservations, and shall raise a data-quality alert on any discrepancy. |

---

# 5. External Interface Requirements

## 5.1 User Interfaces

| # | Requirement |
|---|---|
| UI-1 | The system shall provide four distinct interfaces: the handheld pick and pack interface, the manager web interface, the agent web interface, and the public customer tracking page. |
| UI-2 | The handheld interface shall be operable with one hand, shall present touch targets of at least 48 × 48 device-independent pixels, and shall remain legible when the operator is wearing gloves. |
| UI-3 | Every interface shall present an error message that states what happened, what the system did about it, and what the user can do next. |
| UI-4 | Every destructive action shall require a confirmation that names the object being acted on. |
| UI-5 | The customer tracking page shall be usable without sign-in and shall not request any personal data from the customer. |
| UI-6 | Screen designs for the three most complex use cases are illustrated in R5; where R5 and this document differ, this document governs. |

## 5.2 Software Interfaces

| ID | Interface | Direction | Content | Service level |
|---|---|---|---|---|
| SI-1 | Sales channel — order retrieval | In | Orders created since a watermark | Poll interval ≤ 60 s; retry per Ingest-4 |
| SI-2 | Sales channel — stock update | Out | SKU and sellable quantity | Publication within 60 s of change (Sync-3) |
| SI-3 | Sales channel — cancellation | Both | Cancellation of an order | Queued and retried per Cancel-7 |
| SI-4 | Payment gateway — authorization status | In | Authorization state for an order; **no card data** (CO-5) | Response expected within 5 s; timeout at 5 min (Validate-5) |
| SI-5 | Carrier — rate quote | Out / in | Origin, destination, weight, dimensions → cost and transit days | Quotes requested in parallel; overall timeout 10 min (Label-8) |
| SI-6 | Carrier — label purchase | Out / in | Shipment detail → tracking number and label document | Exactly-once per shipment (Label-6) |
| SI-7 | Carrier — tracking events | In | Status events, pushed or polled | Applied within 15 min p95 (QA-6) |
| SI-8 | ERP / accounting — financial posting | Out | Daily shipped-order totals per brand and channel | Once daily; failure raises an alert |
| SI-9 | Notification service — customer messages | Out | Email and SMS with the order tracking link | Sent within 5 min of the triggering event |
| SI-10 | Identity provider — staff authentication | In | Authentication assertion and role claims (CO-1) | Per corporate standard |

**SI-1 through SI-7 shall be isolated behind an internal interface** so that adding a
channel or a carrier requires no change to order, inventory or routing logic (CO-6).

## 5.3 Hardware Interfaces

| # | Requirement |
|---|---|
| HI-1 | The system shall accept barcode input from the integrated scanner of the Android handheld devices deployed in the fulfillment centers, delivered as keyboard input. |
| HI-2 | The system shall produce shipping labels in a format accepted by the thermal label printers installed at each fulfillment center. |
| HI-3 | The system shall function on handheld devices having 2 GB of memory and a 5-inch display (OE-3). |

## 5.4 Communications Interfaces

| # | Requirement |
|---|---|
| CI-1 | All communication between OMFS and any external system shall use HTTPS with TLS 1.2 or later. |
| CI-2 | All communication between a browser or handheld and OMFS shall use HTTPS with TLS 1.2 or later. |
| CI-3 | The system shall authenticate every inbound carrier webhook before applying the event it carries (Event-1). |
| CI-4 | Customer notifications shall be sent through the notification service and shall contain no personal data beyond the recipient's own order. |
| CI-5 | The system shall not place an order identifier, a tracking token or any personal data in a URL query string that is written to an access log. |

---

# 6. Quality Attributes

Every attribute below is written in **Planguage** (Gilb): SCALE says what is measured,
METER says how, MUST is the level below which the release is not acceptable, PLAN is
the level being designed for. An attribute without a number is not a requirement — it
is an opinion, and it is not testable.

## 6.1 Usability

#### QA-1 — Learnability of the pick and pack interface
| | |
|---|---|
| **SCALE** | Elapsed minutes for a Warehouse Operator who has never used OMFS to complete their first pick task correctly without assistance |
| **METER** | Timed observation of 10 operators during the Da Nang pilot |
| **MUST** | ≤ 20 minutes for 9 of 10 operators |
| **PLAN** | ≤ 15 minutes for 9 of 10 operators |
| **Rationale** | Warehouse Operator is a favored user class (§2.2) with low technical skill and shift-based turnover. Classroom training is not available at scale. |

#### QA-2 — Pick step responsiveness on a handheld
| | |
|---|---|
| **SCALE** | Seconds from barcode scan to the next pick task being displayed, on the deployed handheld hardware |
| **METER** | Instrumented timing on device, 95th percentile over one shift |
| **MUST** | ≤ 1.5 s |
| **PLAN** | ≤ 0.8 s |
| **Rationale** | An operator performs roughly 170 scans a shift. One second of added latency per scan costs three minutes per operator per shift, and directly opposes objective BO-3. |

#### QA-3 — Error recovery in the manager interface
| | |
|---|---|
| **SCALE** | Percentage of error states from which a user can proceed without leaving the page or losing entered data |
| **METER** | Review against the exception list in R2, during requirements validation |
| **MUST** | 100% for exception-console resolutions |
| **PLAN** | 100% for all manager interfaces |

## 6.2 Performance

#### QA-4 — Order acceptance latency
| | |
|---|---|
| **SCALE** | Seconds from an order being retrieved from a channel to its reservation being confirmed or refused |
| **METER** | Timestamps recorded on the order; 95th percentile, measured daily |
| **MUST** | ≤ 90 s at average load |
| **PLAN** | ≤ 30 s at average load; ≤ 90 s at peak load |
| **Rationale** | Every second between retrieval and reservation is a second in which the same unit can be sold again. This attribute is the latency half of objective BO-1. |

#### QA-5 — Reservation throughput under flash-sale load
| | |
|---|---|
| **SCALE** | Reservations confirmed per second without any reservation being lost or duplicated |
| **METER** | Load test against 1.5× the historical peak, before the first campaign date |
| **MUST** | 60 reservations/second sustained for 10 minutes |
| **PLAN** | 90 reservations/second sustained for 10 minutes |
| **Rationale** | Campaign-day bursts (risk RI-5). Reservation is the highest-contention operation in the system. |

#### QA-6 — Stock publication latency
| | |
|---|---|
| **SCALE** | Seconds from an on-hand or reserved quantity changing to the new sellable quantity being accepted by a sales channel |
| **METER** | Difference between the stock-change time and the publication time; 95th percentile, measured daily |
| **MUST** | ≤ 120 s |
| **PLAN** | ≤ 60 s (the target in BR-20) |

#### QA-7 — Tracking event ingestion lag
| | |
|---|---|
| **SCALE** | Minutes from a carrier's own event timestamp to the order status in OMFS reflecting that event |
| **METER** | Difference between Carrier Event Time and Received At; 95th percentile, measured daily |
| **MUST** | ≤ 30 minutes |
| **PLAN** | ≤ 15 minutes |
| **Rationale** | This is the measured success criterion for objective BO-4. A tracking page is only worth offering if what it shows is current. |

#### QA-8 — Manager interface responsiveness
| | |
|---|---|
| **SCALE** | Seconds to first meaningful display for the routing workbench, exception console and dashboard |
| **METER** | Synthetic monitoring from the office network; 95th percentile |
| **MUST** | ≤ 4 s |
| **PLAN** | ≤ 2 s |

## 6.3 Security

#### QA-9 — Tracking token resistance
| | |
|---|---|
| **SCALE** | Expected number of guesses to obtain a valid tracking token for any order |
| **METER** | Analysis of token entropy plus a rate-limiting test |
| **MUST** | ≥ 2⁶⁴ guesses, with requests rate-limited per source address |
| **PLAN** | ≥ 2¹²⁸ guesses |
| **Rationale** | The tracking page is the only publicly reachable surface and it carries a customer's name, address and order contents. Requirement Track-2 is meaningless without this number. |

#### QA-10 — Authorization enforcement
| | |
|---|---|
| **SCALE** | Percentage of privileged operations that enforce the required role on the server, not only in the interface |
| **METER** | Security review of every operation listed in section 3, before release |
| **MUST** | 100% |
| **PLAN** | 100%, with automated tests covering routing override (BR-19), exception resolution and configuration change |
| **Rationale** | Hiding a control in the interface is not authorization. BR-19 is enforceable only on the server. |

#### QA-11 — Audit completeness
| | |
|---|---|
| **SCALE** | Percentage of inventory movements, routing overrides and exception resolutions for which the actor, time and reason can be retrieved |
| **METER** | Sampling of 50 records per category during requirements validation |
| **MUST** | 100% |
| **PLAN** | 100%, retrievable within 5 seconds |

#### QA-12 — Credential handling
| | |
|---|---|
| **SCALE** | Number of third-party API keys or payment credentials retrievable from a browser or handheld |
| **METER** | Inspection of delivered bundles and network traffic |
| **MUST** | 0 |
| **PLAN** | 0 (constraints CO-2, CO-5) |

## 6.4 Safety and Integrity

#### QA-13 — Inventory conservation
| | |
|---|---|
| **SCALE** | Number of units of stock created or destroyed by the system rather than by a recorded physical event, per month |
| **METER** | Daily reconciliation per DA-7 |
| **MUST** | 0 |
| **PLAN** | 0, with any discrepancy alerted within 24 hours |
| **Rationale** | A double deduction or a lost reservation reintroduces the oversell problem the project exists to remove, and it does so silently. |

#### QA-14 — Atomicity of order state changes
| | |
|---|---|
| **SCALE** | Number of orders left in a partial state — partly reserved, partly routed, partly labelled — after a process failure |
| **METER** | Fault-injection testing of reservation, routing and labelling |
| **MUST** | 0 |
| **PLAN** | 0 (postconditions UC-03 POST-1, UC-04 POST-1, UC-07 POST-1) |

## 6.5 Availability, Scalability and Maintainability

#### QA-15 — Availability during the fulfillment day
| | |
|---|---|
| **SCALE** | Percentage of minutes between 06:00 and 22:00 local time in which order ingestion, reservation and picking are all available |
| **METER** | Synthetic monitoring, measured monthly |
| **MUST** | 99.5% |
| **PLAN** | 99.9%, and 99.95% on the five annual campaign dates |

#### QA-16 — Peak capacity
| | |
|---|---|
| **SCALE** | Orders ingested, reserved, routed and picked in one day without additional staff |
| **METER** | Load test before the first campaign date, then observed on the day |
| **MUST** | 18,000 orders/day (the historical peak) |
| **PLAN** | 20,000 orders/day (objective BO-6) |

#### QA-17 — Recovery time
| | |
|---|---|
| **SCALE** | Minutes from an unplanned outage being detected to fulfillment operations resuming |
| **METER** | Disaster-recovery rehearsal, twice yearly |
| **MUST** | ≤ 60 minutes, with no order lost |
| **PLAN** | ≤ 20 minutes, with no order lost |

#### QA-18 — Cost of adding a channel or carrier
| | |
|---|---|
| **SCALE** | Developer-days to add one further sales channel or one further carrier |
| **METER** | Measured when the fourth channel is added in release 1.1 |
| **MUST** | ≤ 10 developer-days, with no change to order, inventory or routing logic |
| **PLAN** | ≤ 5 developer-days (constraint CO-6) |
| **Rationale** | NRG has added four channels in 24 months and expects to add more. Integration cost is a business constraint, not a technical preference. |

---

# 7. Internationalization and Localization Requirements

| # | Requirement |
|---|---|
| IL-1 | The system shall present all staff and customer interfaces in Vietnamese, with English available for the System Administrator interface only. |
| IL-2 | The system shall store all monetary amounts in Vietnamese dong with no decimal fraction, and shall present them grouped by thousands using a full stop. |
| IL-3 | The system shall present dates in DD/MM/YYYY and times in 24-hour form. |
| IL-4 | The system shall store every timestamp with an explicit UTC offset and present it in Asia/Ho_Chi_Minh. |
| IL-5 | The system shall accept and correctly store Vietnamese diacritics in every name and address field, and shall transmit them to carriers in the encoding each carrier requires. |
| IL-6 | The system shall sort Vietnamese text according to Vietnamese collation rules, not byte order. |

Support for further languages or currencies is not required for releases 1.0–2.0. This
is recorded rather than omitted, because a later expansion beyond Vietnam would make
IL-1 and IL-2 obsolete rather than merely incomplete.

---

# 8. Other Requirements

| # | Requirement |
|---|---|
| OR-1 | The system shall retain personal data in accordance with Decree 13/2023/ND-CP on personal data protection, and shall permit the erasure of a customer's personal data from archived orders on request (DA-6). |
| OR-2 | The system shall be installable into a new environment from version-controlled configuration, with no manual step that is not documented. |
| OR-3 | The system shall be delivered with the operational runbook needed by the NRG IT service desk to diagnose failed ingestion, failed publication and stalled shipments. |
| OR-4 | The system shall permit data migration to be executed repeatedly against a non-production environment without residue from previous runs. |
| OR-5 | Every third-party library used shall carry a licence compatible with commercial internal use; copyleft licences requiring source distribution shall not be used. |

---

# Appendix A: Glossary

| Term | Definition |
|---|---|
| **ATP** | Available to promise — the quantity of a SKU that may be promised to a new order; see BR-07 and the Data Dictionary |
| **Backorder** | An order accepted but not fulfillable from current stock |
| **Carton** | One physical box within a shipment |
| **Cut-off** | The daily time after which orders dispatch the next working day; BR-10 |
| **Fulfillment center (FC)** | A warehouse from which orders are shipped |
| **Landed cost** | Total shipping cost including surcharges and discounts; BR-12 |
| **Order** | A customer purchase received from one sales channel |
| **Oversell** | Accepting an order for stock that does not exist |
| **Pick wave** | A batch of shipments released to the warehouse floor together |
| **Rate shopping** | Comparing carriers on cost and service level before buying a label |
| **Reservation** | A hold placed on stock for an order line |
| **RMA** | Return merchandise authorization |
| **Routing** | Deciding which fulfillment center ships which lines |
| **Shipment** | The portion of an order fulfilled from one fulfillment center |
| **Short pick** | Finding fewer units on the shelf than the pick task requires |
| **SKU** | Stock keeping unit — the unique identifier of a sellable product |
| **Split order** | An order fulfilled from more than one fulfillment center |
| **3PL** | Third-party logistics — an external carrier |
| **WISMO** | "Where is my order?" — a customer contact asking for order status |

# Appendix B: Analysis Models

| Figure | Model | Location |
|---|---|---|
| B-1 | System context diagram | `diagrams/use-case-diagram.png` (boundary and external actors) |
| B-2 | Logical data model (ERD) | *to be produced in design; entities and relationships listed in §4.1* |
| B-3 | Use case diagram | `diagrams/use-case-diagram.png` · editable source `diagrams/use-case-diagram.drawio` |
| B-4 | Order state model | States listed under *Order Status* in the Data Dictionary; transitions are given by the use case postconditions |
| B-5 | Screen mock-ups | `mockups/` — see R5 |

# Appendix C: TBD List

An SRS with no open items at this stage is not finished; it is unexamined. These are
tracked, owned and dated.

| # | Open question | Affects | Owner | Target |
|---|---|---|---|---|
| TBD-1 | Does the return window in BR-14 run from delivery or from dispatch? Two stakeholders answered differently. | Return-1 | Customer Service Manager | Week 7 |
| TBD-2 | Are the routing weights in BR-06 the same for all five brands in release 1.0, or per brand? | Route-2, Route-8 | Fulfillment Manager | Week 6 |
| TBD-3 | Does safety stock in BR-17 apply per channel as well as per fulfillment center? | Reserve-6, Sync-2 | Inventory Controller | Week 7 |
| TBD-4 | Exact customer-facing wording when a carrier has gone silent. | Track-4 | Brand Manager | Week 8 |
| TBD-5 | Does the ERP posting in SI-8 require per-brand or per-channel breakdown, or both? | SI-8 | Finance | Week 7 |

# Appendix D: Requirements Traceability Matrix

| Feature (R1 §2.1) | SRS section | Use case (R2) | Functional requirements | Business rules (R3) | Objective |
|---|---|---|---|---|---|
| FE-1 Order ingestion | 3.1 | UC-01 | Ingest-1 … Ingest-6 | BR-16 | BO-2 |
| FE-2 Screening and validation | 3.2 | UC-02 | Validate-1 … Validate-6 | BR-03, BR-04 | BO-1 |
| FE-3 Inventory and ATP | 3.3 | UC-03 | Reserve-1 … Reserve-7 | BR-01, BR-02, BR-04, BR-07, BR-08, BR-17 | BO-1 |
| FE-4 Channel stock sync | 3.4 | UC-13 | Sync-1 … Sync-7 | BR-07, BR-17, BR-20 | BO-1 |
| FE-5 Routing and splitting | 3.5 | UC-04 | Route-1 … Route-8 | BR-01, BR-06, BR-08, BR-09, BR-10, BR-19 | BO-2, BO-3 |
| FE-6 Pick wave | 3.6 | UC-05 | Wave-1 … Wave-7 | BR-10, BR-13 | BO-3 |
| FE-7 Scan-verified pick | 3.7 | UC-06 | Pick-1 … Pick-8 | BR-07, BR-13, BR-17 | BO-2, BO-3 |
| FE-8 Rate shopping and label | 3.8 | UC-07 | Label-1 … Label-8 | BR-11, BR-12 | BO-5 |
| FE-9 Tracking ingestion | 3.9 | UC-08 | Event-1 … Event-8 | BR-09 | BO-4 |
| FE-10 Notification and tracking | 3.10 | UC-09 | Track-1 … Track-7 | BR-09 | BO-4 |
| FE-11 Exception management | 3.11 | UC-10 | Except-1 … Except-7 | BR-05, BR-09, BR-13 | BO-1, BO-2 |
| FE-12 Cancel and modify | 3.12 | UC-11 | Cancel-1 … Cancel-7 | BR-05, BR-16 | BO-1 |
| FE-13 Returns and restocking | 3.13 | UC-12 | Return-1 … Return-7 | BR-14, BR-15 | — |
| FE-14 Dashboard and reconciliation | 3.14 | UC-14 | Dash-1 … Dash-8 | BR-06, BR-09, BR-18 | All |

**Objectives covered by quality attributes rather than features:** BO-6 (peak capacity)
is delivered by QA-16; the latency half of BO-1 by QA-4 and QA-6; the measurement of
BO-4 by QA-7.
