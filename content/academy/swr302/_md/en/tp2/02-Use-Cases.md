# Use Cases
## for the Order Management and Fulfillment System (OMFS)

Version 1.0 approved
Prepared by **<Team Leader name>**, Business Analysis Team — Group <N>
Nova Retail Group (NRG)
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
| **Warehouse Operator** | Picks and packs orders inside a fulfillment center using a handheld scanner. ~60 users across 3 FCs. |
| **Fulfillment Manager** | Owns throughput for one or more FCs. Releases pick waves, resolves exceptions, overrides routing decisions. |
| **Inventory Controller** | Owns stock accuracy. Configures safety stock, audits reservations, investigates discrepancies. |
| **Customer Service Agent** | Answers customer contacts. Cancels, modifies and initiates returns on the customer's behalf. ~25 users. |
| **Logistics Manager** | Owns carrier relationships and shipping cost. Configures carrier eligibility and reconciles 3PL invoices. |
| **Brand Manager** | Owns one of five brands. Consumes fulfillment reporting; does not operate the system daily. |
| **System Administrator** | Configures channels, fulfillment centers, users and routing parameters. |
| **Customer** | The buyer. Interacts with OMFS **only** through the self-service tracking page (UC-09). |

### 1.2 Secondary actors (external systems)

| Actor | Description |
|---|---|
| **Sales Channel** | The web storefront or a marketplace (Shopee, Lazada, TikTok Shop). Source of orders, destination of stock updates. |
| **3PL Carrier** | GHN, GHTK, Viettel Post or J&T Express. Provides rates, labels and tracking events over an API. |
| **Payment Gateway** | Holds payment authorization status for an order. Read-only from the OMFS side. |
| **Notification Service** | Sends email and SMS to customers on behalf of OMFS. |

> **Why the ERP / accounting system is not listed as an actor.** It receives a daily posting of shipped-order financials, but it participates in none of the fourteen use cases — nothing an actor does starts it and nothing it does appears in a flow. It is therefore specified as a **software interface in SRS §5.2**, not as a use case actor. Listing a system as an actor when it appears in no flow is a traceability defect, so it is deliberately excluded here.

---

## 2. Use Case List

| ID | Primary Actor | Secondary Actor | Use Case name | Description |
|---|---|---|---|---|
| UC-01 | Sales Channel | — | Ingest an order from a sales channel | Retrieve a new order from any channel and normalize it into a single OMFS order record |
| UC-02 | OMFS (time) | Payment Gateway | Screen and validate an order | Check address, payment authorization and fraud signals before the order consumes stock |
| UC-03 | OMFS (event) | — | Reserve inventory | Hold available-to-promise stock for every order line, or mark the order backordered |
| UC-04 | OMFS (event) | Fulfillment Manager | Route and split an order | Select the fulfillment center(s) that will ship each line, by a configurable scoring rule |
| UC-05 | Fulfillment Manager | — | Generate and release a pick wave | Group routed orders into a picking wave for one FC and release it to the floor |
| UC-06 | Warehouse Operator | — | Pick and pack with scan verification | Pick each item against the handheld, verify by barcode, and assign items to cartons |
| UC-07 | OMFS (event) | 3PL Carrier | Rate-shop carriers and purchase a label | Compare eligible carriers on cost and service level, then buy the label via API |
| UC-08 | 3PL Carrier | Notification Service | Ingest a carrier tracking event | Receive a carrier status event and apply it to the shipment and order |
| UC-09 | Customer | — | Track an order (self-service) | Let the customer see current, accurate order and shipment status without contacting support |
| UC-10 | Fulfillment Manager | Inventory Controller | Handle a fulfillment exception | Resolve backorder, split-failure, short-ship and address-failure exceptions from one console |
| UC-11 | Customer Service Agent | Sales Channel | Cancel or modify an order before dispatch | Cancel or change an order while it can still be stopped, releasing any reserved stock |
| UC-12 | Customer Service Agent | Warehouse Operator | Process a return and restock | Authorize a return, receive it, inspect it, and restock or quarantine the item |
| UC-13 | OMFS (event) | Sales Channel | Synchronize stock levels to sales channels | Push changed available quantities to every channel that sells the SKU |
| UC-14 | Fulfillment Manager | — | View the fulfillment performance dashboard | Monitor throughput, cycle time, exception volume and shipping cost against targets |

> **Traceability to Vision & Scope features:** UC-01→FE-1 · UC-02→FE-2 · UC-03→FE-3 · UC-04→FE-5 · UC-05→FE-6 · UC-06→FE-7 · UC-07→FE-8 · UC-08→FE-9 · UC-09→FE-10 · UC-10→FE-11 · UC-11→FE-12 · UC-12→FE-13 · UC-13→FE-4 · UC-14→FE-14

---

## 3. Use Case Specifications

### UC-01 — Ingest an order from a sales channel

| | |
|---|---|
| **UC ID and Name** | UC-01 — Ingest an order from a sales channel |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Sales Channel (system) | **Secondary Actors** | — |
| **Trigger** | A new order reaches "paid" or "placed" state on a sales channel, or the scheduled polling interval (60 s) elapses. |
| **Description** | OMFS retrieves new orders from each connected sales channel and converts each one into a single normalized OMFS order record, regardless of the channel's own data format. This is the entry point of the entire fulfillment lifecycle. |
| **Preconditions** | PRE-1: The sales channel is registered in OMFS and marked Active. <br> PRE-2: Valid API credentials for the channel are stored and not expired. |
| **Postconditions** | POST-1: Exactly one OMFS order exists for the channel order, with status Pending. <br> POST-2: Every order line references a SKU that exists in the item master, or the order is held in the Unmapped SKU queue. <br> POST-3: The channel order ID and OMFS order ID are linked, so re-ingesting the same channel order creates no duplicate. |
| **Normal Flow** | **1.0** <br> 1. The system requests orders created since the last successful ingestion watermark from the channel. <br> 2. The channel returns a set of orders. <br> 3. For each order, the system maps channel fields to the OMFS order structure (customer, ship-to address, lines, totals, payment method). <br> 4. The system resolves each channel SKU to an OMFS SKU using the channel SKU mapping table. <br> 5. The system creates the order with status Pending and records the channel order ID. <br> 6. The system advances the ingestion watermark. <br> 7. The system raises an order-created event that triggers UC-02. |
| **Alternative Flows** | **1.1 — Manual re-ingestion.** At step 1, a System Administrator requests re-ingestion of a specific channel order ID; the system fetches that single order and continues from step 3. <br> **1.2 — Backfill after outage.** At step 1, the watermark is older than 1 hour; the system pages through the channel's order list in batches of 100 and continues from step 3 for each batch. |
| **Exceptions** | **1.0.E1 — Channel unreachable.** At step 1 the channel API does not respond or returns 5xx. The system retries with exponential backoff up to 5 attempts, does not advance the watermark, and raises an integration alert after the final failure. No partial state is written. <br> **1.0.E2 — Unmapped SKU.** At step 4 a channel SKU has no mapping. The system creates the order with status Held-Unmapped, places it in the Unmapped SKU queue for the Inventory Controller, and does **not** raise the order-created event. <br> **1.0.E3 — Duplicate order.** At step 5 the channel order ID already exists in OMFS. The system logs the duplicate and discards it without creating a second order. <br> **1.0.E4 — Malformed order.** At step 3 a mandatory field (ship-to address, at least one line) is missing. The system creates the order with status Held-Invalid and raises a data-quality exception for UC-10. |
| **Priority** | High |
| **Frequency of Use** | 4,500 orders/day average; 18,000/day peak. Polling runs every 60 seconds per channel, 4 channels. |
| **Business Rules** | BR-16 |
| **Other Information** | Ingestion must be idempotent: the same channel order processed twice must produce one OMFS order (POST-3). If the process fails between steps 5 and 6, the next run re-reads the same window and relies on POST-3 to avoid duplication. Channel-specific field mapping is configuration, not code, so a new channel can be added without a release. |
| **Assumptions** | All four channels expose an order-retrieval API that supports filtering by creation timestamp. |

### UC-02 — Screen and validate an order

| | |
|---|---|
| **UC ID and Name** | UC-02 — Screen and validate an order |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | OMFS (system, event-driven) | **Secondary Actors** | Payment Gateway, Customer Service Agent |
| **Trigger** | An order-created event is raised by UC-01. |
| **Description** | Before an order is allowed to consume stock, OMFS verifies that the shipping address is deliverable, the payment is authorized (or the order is cash-on-delivery), and the order does not match a fraud pattern. Screening before reservation is what prevents stock being held for orders that will never ship. |
| **Preconditions** | PRE-1: The order exists with status Pending. <br> PRE-2: The order has at least one line and a ship-to address. |
| **Postconditions** | POST-1: The order status is Validated, or Held-Review, or Cancelled — never left in Pending. <br> POST-2: Every screening decision is recorded with its reason code and timestamp. |
| **Normal Flow** | **2.0** <br> 1. The system normalizes the ship-to address and verifies the postcode is serviceable by at least one carrier. <br> 2. The system reads payment authorization status from the payment gateway. <br> 3. The system evaluates the fraud ruleset (order value, address–payment mismatch, velocity from the same customer). <br> 4. All three checks pass; the system sets the order status to Validated. <br> 5. The system raises a validated event that triggers UC-03. |
| **Alternative Flows** | **2.1 — Cash on delivery.** At step 2 the payment method is COD; the system skips the authorization check and continues at step 3. <br> **2.2 — Agent override.** From Held-Review, a Customer Service Agent reviews the order, records a justification, and releases it; the system sets status Validated and continues at step 5. |
| **Exceptions** | **2.0.E1 — Undeliverable address.** At step 1 no carrier serves the postcode. The system sets status Held-Review with reason ADDRESS_UNSERVICEABLE and raises an exception for UC-10. <br> **2.0.E2 — Payment not authorized.** At step 2 the gateway reports declined or pending. The system sets status Held-Review with reason PAYMENT_NOT_AUTHORIZED and does not reserve stock. <br> **2.0.E3 — Payment gateway unavailable.** At step 2 the gateway does not respond. The system retries for up to 5 minutes, then sets status Held-Review with reason PAYMENT_UNKNOWN. It does **not** assume authorization. <br> **2.0.E4 — Fraud rule triggered.** At step 3 a fraud rule matches. The system sets status Held-Review with reason FRAUD_REVIEW and notifies the Customer Service queue. |
| **Priority** | High |
| **Frequency of Use** | Once per order — 4,500/day average, 18,000/day peak. |
| **Business Rules** | BR-03, BR-04 |
| **Other Information** | Screening must complete within 30 seconds of the order-created event under normal load, because every second before reservation is a second in which the same stock can be sold again. If the use case fails after step 4 but before step 5, a recovery job re-raises the validated event; UC-03 is idempotent per order so no double reservation occurs. |
| **Assumptions** | The payment gateway exposes an authorization-status query that does not itself capture funds. |

### UC-03 — Reserve inventory

| | |
|---|---|
| **UC ID and Name** | UC-03 — Reserve inventory |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | OMFS (system, event-driven) | **Secondary Actors** | Inventory Controller |
| **Trigger** | A validated event is raised by UC-02. |
| **Description** | OMFS computes available-to-promise per SKU per fulfillment center and places a hold on the stock needed by every line of the order. **This is the mechanism that solves overselling**: stock is committed at the moment of order acceptance, not at the moment of picking. |
| **Preconditions** | PRE-1: The order status is Validated. <br> PRE-2: Every SKU on the order exists in the item master. |
| **Postconditions** | POST-1: Either every line holds a reservation and the order status is Reserved, or no line holds a reservation and the order status is Backordered. A partially reserved order is never left in that state. <br> POST-2: Each reservation records SKU, fulfillment center, quantity, creation time and expiry time. <br> POST-3: A stock-changed event is raised for every affected SKU, triggering UC-13. |
| **Normal Flow** | **3.0** <br> 1. The system computes ATP per SKU per fulfillment center using BR-07. <br> 2. For each line, the system selects the fulfillment center with the highest ATP that satisfies the full line quantity. <br> 3. The system reserves the requested quantity at that fulfillment center. <br> 4. The system sets the reservation expiry to 30 minutes from creation (BR-04). <br> 5. The system sets order status to Reserved. <br> 6. The system raises a stock-changed event per SKU and a reserved event that triggers UC-04. |
| **Alternative Flows** | **3.1 — Split reservation.** At step 2 no single fulfillment center holds full ATP for a line, but the total across centers does. The system reserves the line across up to three centers (BR-08), flags the order as Split-Required for UC-04, and continues at step 4. <br> **3.2 — Re-reservation after release.** The order is in Backordered state and inbound stock arrives; a stock-changed event re-enters this use case at step 1 for that order only. |
| **Exceptions** | **3.0.E1 — Insufficient total ATP.** At step 1 the total ATP across all fulfillment centers is less than the ordered quantity for at least one line. The system reserves nothing for the whole order, sets status Backordered, and raises an exception for UC-10. <br> **3.0.E2 — Split limit exceeded.** In flow 3.1 a line would need more than three fulfillment centers (BR-08). The system reserves nothing, sets status Backordered with reason SPLIT_LIMIT, and raises an exception for UC-10. <br> **3.0.E3 — Reservation expired.** Thirty minutes elapse without payment confirmation (BR-04). The system releases every reservation on the order, reverts status to Pending, and raises a stock-changed event per SKU. <br> **3.0.E4 — Concurrent reservation conflict.** At step 3 another order reserves the same units first. The system re-reads ATP and retries from step 1, up to 3 attempts, then follows 3.0.E1. |
| **Priority** | High |
| **Frequency of Use** | Once per validated order — 4,500/day average, 18,000/day peak, with bursts of up to 60 reservations/second during campaign flash sales. |
| **Business Rules** | BR-01, BR-02, BR-04, BR-07, BR-08, BR-17 |
| **Other Information** | Reservation must be **atomic per order** (POST-1). If the process fails mid-way, every reservation already placed for that order is rolled back; the order returns to Validated and is retried. Reservation is the highest-contention operation in the system and drives the concurrency quality attributes in SRS §6.2. |
| **Assumptions** | Physical stock counts at migration are accurate to within 2%; a larger error would make ATP wrong from day one regardless of this logic. |

### UC-04 — Route and split an order

| | |
|---|---|
| **UC ID and Name** | UC-04 — Route and split an order across fulfillment centers |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | OMFS (system, event-driven) | **Secondary Actors** | Fulfillment Manager |
| **Trigger** | A reserved event is raised by UC-03, or a Fulfillment Manager requests re-routing of an order. |
| **Description** | OMFS decides which fulfillment center ships which lines, splitting the order into one shipment per center where necessary. It scores each candidate center on stock coverage, distance to the customer, expected shipping cost and current center workload, then picks the highest score. **This replaces the manual printing and sorting of order slips.** |
| **Preconditions** | PRE-1: The order status is Reserved. <br> PRE-2: At least one fulfillment center is Open and within its daily capacity. |
| **Postconditions** | POST-1: The order is decomposed into one or more shipments, each assigned to exactly one fulfillment center (BR-01). <br> POST-2: The routing decision records the score of every candidate center and the winning reason, so it can be explained and audited. <br> POST-3: The order status is Routed. |
| **Normal Flow** | **4.0** <br> 1. The system retrieves the reservations placed by UC-03 and groups lines by the center holding their stock. <br> 2. For each candidate grouping, the system computes the routing score using BR-06. <br> 3. The system selects the grouping with the highest score. <br> 4. The system checks the selected center against its remaining daily capacity and the 14:00 dispatch cut-off (BR-10). <br> 5. The system creates one shipment per fulfillment center in the winning grouping. <br> 6. The system records the full score table against the order (POST-2). <br> 7. The system sets order status to Routed and raises a routed event that triggers UC-05. |
| **Alternative Flows** | **4.1 — Single-center order.** At step 1 all lines are reserved at one center; the system skips scoring and creates one shipment, continuing at step 6. <br> **4.2 — Manual override.** A Fulfillment Manager opens the routing workbench, reviews the score table, selects a different center, and records a reason. The system re-creates the shipments accordingly and marks the order Manually-Routed (BR-19). <br> **4.3 — Re-route after capacity change.** A center is closed by the System Administrator; every Routed order not yet picked at that center re-enters this use case at step 1. |
| **Exceptions** | **4.0.E1 — All centers at capacity.** At step 4 every candidate center has exhausted its daily capacity. The system holds the order with status Routing-Deferred and re-attempts at the next capacity window; if the promised delivery date is at risk (BR-09) it raises an exception for UC-10. <br> **4.0.E2 — Split exceeds limit.** At step 3 the winning grouping needs more than three shipments (BR-08). The system raises an exception for UC-10 rather than creating the shipments. <br> **4.0.E3 — Routing configuration invalid.** At step 2 the routing weights do not sum to 1.0 or a weight is missing. The system falls back to nearest-center-with-stock, logs a configuration alert, and marks the decision Fallback-Routed. |
| **Priority** | High |
| **Frequency of Use** | Once per reserved order — 4,500/day average, 18,000/day peak. Re-routing: ~20/day. |
| **Business Rules** | BR-01, BR-06, BR-08, BR-09, BR-10, BR-19 |
| **Other Information** | The routing weights in BR-06 are configuration, adjustable by the Fulfillment Manager without a release; per-brand weight sets are deferred to Release 2.0. POST-2 exists because the Fulfillment Manager stated they will not trust an automated decision they cannot inspect — the score table is a requirement, not a debugging aid. |
| **Assumptions** | Distance between a fulfillment center and a destination postcode is available from a static lookup table maintained by the Logistics Manager. |

### UC-05 — Generate and release a pick wave

| | |
|---|---|
| **UC ID and Name** | UC-05 — Generate and release a pick wave |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Fulfillment Manager | **Secondary Actors** | Warehouse Operator |
| **Trigger** | The Fulfillment Manager starts a wave, or the scheduled wave timer fires (hourly, and at the 14:00 cut-off). |
| **Description** | Routed shipments waiting at a fulfillment center are grouped into a pick wave — a batch of work released to the floor together — so that operators walk the warehouse once for many orders instead of once per order. |
| **Preconditions** | PRE-1: At least one shipment at this fulfillment center has status Routed. <br> PRE-2: The Fulfillment Manager is authenticated and assigned to this fulfillment center. |
| **Postconditions** | POST-1: Every shipment in the released wave has status Picking and is linked to the wave. <br> POST-2: A shipment belongs to at most one open wave. |
| **Normal Flow** | **5.0** <br> 1. The Fulfillment Manager selects a fulfillment center and wave criteria (carrier cut-off, service level, order age, maximum wave size). <br> 2. The system lists the matching Routed shipments with a count and estimated pick time. <br> 3. The Fulfillment Manager confirms the wave. <br> 4. The system creates the wave, assigns every selected shipment to it, and sets their status to Picking. <br> 5. The system generates the pick list, sorted by storage location to minimise walking distance. <br> 6. The system makes the wave available to handheld devices at that fulfillment center. |
| **Alternative Flows** | **5.1 — Automatic wave.** The scheduled timer fires; the system applies the saved default criteria and executes steps 2, 4, 5, 6 without human confirmation. <br> **5.2 — Priority wave.** The Fulfillment Manager marks the wave Priority; the system places it at the head of every handheld queue. <br> **5.3 — Cancel a wave.** Before any item in the wave is picked, the Fulfillment Manager cancels it; every shipment returns to Routed. |
| **Exceptions** | **5.0.E1 — Shipment already in a wave.** At step 4 a selected shipment was added to another wave concurrently (POST-2). The system excludes it, completes the wave with the remaining shipments, and reports the exclusion. <br> **5.0.E2 — Stock not found at pick time.** Handled in UC-06, not here, but the wave remains open until every shipment reaches a terminal state. <br> **5.0.E3 — Wave exceeds maximum size.** At step 3 the selection exceeds the configured maximum. The system creates multiple waves rather than one oversized wave, and tells the manager how many. |
| **Priority** | High |
| **Frequency of Use** | ~12 waves per fulfillment center per day; 36/day across three centers. More on campaign days. |
| **Business Rules** | BR-10, BR-13 |
| **Other Information** | Pick-list sequence is a throughput lever, not a cosmetic choice: it is the single largest contributor to the order-to-ship objective BO-3 inside the warehouse. Bin-level optimisation belongs to a WMS and is explicitly out of scope (EX-3); OMFS sorts by the coarse storage location recorded against each SKU. |
| **Assumptions** | Each SKU carries one coarse storage location per fulfillment center, maintained by warehouse staff. |

### UC-06 — Pick and pack with scan verification

| | |
|---|---|
| **UC ID and Name** | UC-06 — Pick and pack with scan verification |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Warehouse Operator | **Secondary Actors** | — |
| **Trigger** | The Warehouse Operator opens the next task from the released wave on a handheld device. |
| **Description** | The operator is directed to each item in turn, scans it to prove the correct item was taken, and assigns picked items to cartons. Scanning replaces the printed slip and is what removes the manual sorting step entirely. |
| **Preconditions** | PRE-1: The operator is authenticated on a handheld assigned to this fulfillment center. <br> PRE-2: An open wave with unfinished tasks exists at this fulfillment center. |
| **Postconditions** | POST-1: Every line of the shipment is picked and verified, or the shipment carries a short-pick exception. <br> POST-2: On completion, the shipment status is Packed and its carton list, weight and dimensions are recorded. <br> POST-3: Picked quantities are deducted from on-hand stock and their reservations are released (the stock has now left). |
| **Normal Flow** | **6.0** <br> 1. The system presents the next pick task: SKU, description, image, quantity and storage location. <br> 2. The operator goes to the location and scans the item barcode. <br> 3. The system verifies the scanned barcode matches the expected SKU and confirms the pick. <br> 4. Steps 1–3 repeat until every line of the shipment is picked. <br> 5. The operator scans a carton label to open a carton and assigns picked items to it. <br> 6. The operator enters or scans the carton weight. <br> 7. The system sets the shipment status to Packed and raises a packed event that triggers UC-07. |
| **Alternative Flows** | **6.1 — Multi-carton shipment.** At step 5 the operator opens additional cartons; the system records the item-to-carton assignment for each. <br> **6.2 — Substitute location.** At step 2 the item is found at a different location; the operator scans the item and confirms the alternative location, and the system records a location correction for the Inventory Controller. <br> **6.3 — Hand off mid-wave.** The operator ends their shift; unfinished tasks return to the wave queue for another operator. |
| **Exceptions** | **6.0.E1 — Wrong item scanned.** At step 3 the barcode does not match the expected SKU. The system rejects the pick, shows the expected item, and does not advance. Three consecutive mismatches escalate the task to the Fulfillment Manager. <br> **6.0.E2 — Short pick.** At step 2 the physical quantity is less than required. The operator records the quantity actually found; the system creates a short-pick exception for UC-10, adjusts on-hand stock to the counted quantity, and raises a stock-changed event. <br> **6.0.E3 — Item damaged.** The operator marks the item damaged; the system moves that quantity to damaged stock (which BR-07 excludes from ATP) and treats the line as a short pick per 6.0.E2. <br> **6.0.E4 — Handheld loses connectivity.** The device queues scans locally and replays them on reconnection. Scans are idempotent per task, so a replayed scan does not double-deduct stock. |
| **Priority** | High |
| **Frequency of Use** | 4,500 shipments/day average, 18,000/day peak; ~2.3 lines per shipment, so ~10,000 scans/day average. |
| **Business Rules** | BR-07, BR-13, BR-17 |
| **Other Information** | The pick screen must be usable one-handed, with gloves, on a low-end Android handheld, and must tolerate intermittent Wi-Fi (6.0.E4) — these are the Warehouse Operator's stated constraints and they drive the usability and offline quality attributes in SRS §6.1. POST-3 is the point at which reserved stock becomes shipped stock; getting this wrong double-counts inventory. |
| **Assumptions** | Every sellable SKU carries a scannable barcode. SKUs without one are handled by manual confirmation with supervisor approval. |

### UC-07 — Rate-shop carriers and purchase a shipping label

| | |
|---|---|
| **UC ID and Name** | UC-07 — Rate-shop carriers and purchase a shipping label |
| **Created By** | Member 3 | **Date Created** | 2026-09-17 |
| **Primary Actor** | OMFS (system, event-driven) | **Secondary Actors** | 3PL Carrier, Logistics Manager |
| **Trigger** | A packed event is raised by UC-06. |
| **Description** | For a packed shipment, OMFS determines which carriers can actually deliver it, compares them on landed cost and service level, selects one, and buys the label through the carrier's API. **This replaces buying labels by hand in four separate carrier portals** and is what delivers the shipping-cost objective BO-5. |
| **Preconditions** | PRE-1: The shipment status is Packed with recorded weight and dimensions. <br> PRE-2: At least one carrier is configured Active with valid API credentials. |
| **Postconditions** | POST-1: The shipment carries exactly one purchased label with a tracking number, or it carries a labelling exception. <br> POST-2: The quoted rates from every eligible carrier are stored against the shipment for later invoice reconciliation. <br> POST-3: The shipment status is Labelled and the order status is updated. |
| **Normal Flow** | **7.0** <br> 1. The system determines carrier eligibility for the destination postcode, weight and dimensions (BR-11). <br> 2. The system requests a rate quote from each eligible carrier in parallel. <br> 3. The system computes the landed cost for each quote using BR-12. <br> 4. The system selects the cheapest carrier that meets the order's promised delivery date. <br> 5. The system requests a label from the selected carrier and receives a tracking number and label document. <br> 6. The system stores all quotes (POST-2), the purchased label and the tracking number. <br> 7. The system sets the shipment status to Labelled and notifies the customer via UC-09. |
| **Alternative Flows** | **7.1 — Preferred carrier.** The Logistics Manager has pinned a carrier for a destination region; the system uses it if eligible, skipping steps 3–4, and records the reason PREFERRED. <br> **7.2 — Expedited order.** The order carries an express service level; at step 4 the system selects the fastest carrier meeting the date, not the cheapest, and records the reason SERVICE_LEVEL. <br> **7.3 — Reprint.** A Warehouse Operator reports a damaged label; the system re-prints the same label without purchasing a new one. |
| **Exceptions** | **7.0.E1 — No eligible carrier.** At step 1 no carrier serves the destination or the parcel exceeds every carrier's limits. The system raises a labelling exception for UC-10 and leaves the shipment Packed. <br> **7.0.E2 — All quotes fail.** At step 2 every carrier API errors or times out. The system retries for up to 10 minutes, then raises an exception for UC-10; the shipment remains Packed and is never left in a half-labelled state. <br> **7.0.E3 — Label purchase fails after a successful quote.** At step 5 the chosen carrier rejects the label request. The system excludes that carrier and retries from step 4 with the next-best quote, up to three carriers, then follows 7.0.E2. <br> **7.0.E4 — Duplicate label.** The label request succeeds but the response is lost. On retry the system queries the carrier for an existing label against the shipment reference before purchasing again, so a shipment never carries two paid labels (POST-1). |
| **Priority** | Medium — deferred to Release 1.1 |
| **Frequency of Use** | Once per shipment — ~4,900/day average (orders plus splits), ~19,500/day peak. |
| **Business Rules** | BR-11, BR-12 |
| **Other Information** | Rate shopping is only as good as the weight and dimensions captured in UC-06 step 6; systematically under-recorded weights produce carrier invoice adjustments that wipe out the 12% saving, which is why POST-2 stores the quotes for reconciliation. Until Release 1.1, labels continue to be bought manually in the carrier portals and the tracking number is entered by hand. |
| **Assumptions** | All four carriers expose rating and label-purchase APIs. Any carrier without one is handled by the manual fallback behind the same internal interface. |

### UC-08 — Ingest a carrier tracking event

| | |
|---|---|
| **UC ID and Name** | UC-08 — Ingest a carrier tracking event |
| **Created By** | Member 3 | **Date Created** | 2026-09-17 |
| **Primary Actor** | 3PL Carrier (system) | **Secondary Actors** | Notification Service |
| **Trigger** | A carrier pushes a webhook event for a tracked shipment, or the polling interval (15 min) elapses for carriers without webhooks. |
| **Description** | OMFS receives carrier scan events — collected, in transit, out for delivery, delivered, failed — and applies them to the shipment and its order automatically. **This replaces the twice-daily manual CSV upload** and is what makes self-service tracking (UC-09) worth offering. |
| **Preconditions** | PRE-1: The shipment has a tracking number issued in UC-07. <br> PRE-2: The shipment has not yet reached a terminal status (Delivered, Returned, Lost). |
| **Postconditions** | POST-1: The event is stored against the shipment with the carrier's own event timestamp and the OMFS receipt timestamp, so lag can be measured (success metric for BO-4). <br> POST-2: The shipment status reflects the most recent event by **carrier timestamp**, not by arrival order. <br> POST-3: An out-of-order or duplicate event never moves a shipment backwards. |
| **Normal Flow** | **8.0** <br> 1. The system receives the event and authenticates the carrier. <br> 2. The system resolves the tracking number to a shipment. <br> 3. The system maps the carrier's own status code to the OMFS status vocabulary. <br> 4. The system compares the event timestamp with the latest stored event. <br> 5. The event is newer; the system stores it and updates the shipment status. <br> 6. If the new status is customer-visible, the system requests a notification via the Notification Service. <br> 7. If the status is Delivered, the system closes the shipment and, when all of an order's shipments are delivered, closes the order. |
| **Alternative Flows** | **8.1 — Polling carrier.** At step 1 the system polls the carrier for all open shipments instead of receiving a push, then continues from step 2 for each returned event. <br> **8.2 — Bulk backfill.** After an outage, the system requests all events since the last watermark and processes them in carrier-timestamp order. |
| **Exceptions** | **8.0.E1 — Unknown tracking number.** At step 2 no shipment matches. The system stores the event in an orphan queue for 30 days and raises an alert if the orphan count exceeds a threshold — it does not discard it, because it usually means a label was bought outside OMFS. <br> **8.0.E2 — Unmapped carrier status.** At step 3 the carrier sends a code OMFS does not recognise. The system stores the raw event, leaves the shipment status unchanged, and raises a configuration alert. <br> **8.0.E3 — Out-of-order event.** At step 4 the event is older than the stored latest. The system stores it for the audit trail but does not change the shipment status (POST-3). <br> **8.0.E4 — Delivery failed.** The carrier reports a failed delivery attempt. The system sets the shipment to Delivery-Exception and raises an exception for UC-10. <br> **8.0.E5 — Carrier silent.** No event for a shipment for 48 hours after collection. A monitor raises a stalled-shipment exception for UC-10. |
| **Priority** | Medium — deferred to Release 1.1 |
| **Frequency of Use** | ~6 events per shipment; ~29,000 events/day average, ~117,000/day peak. |
| **Business Rules** | BR-09 |
| **Other Information** | POST-2 matters more than it looks. Carriers deliver events late and out of order; ordering by arrival time makes an order appear to move from Delivered back to In Transit, which generates exactly the WISMO contacts this project exists to remove. The 15-minute p95 ingestion target in SRS §6.2 is the success metric for BO-4. |
| **Assumptions** | At least three of the four carriers support webhooks; the remainder are polled. |

### UC-09 — Track an order (customer self-service)

| | |
|---|---|
| **UC ID and Name** | UC-09 — Track an order (customer self-service) |
| **Created By** | Member 3 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Customer | **Secondary Actors** | Notification Service, Customer Service Agent |
| **Trigger** | The customer opens the tracking link sent by email or SMS, or a Customer Service Agent opens the same view from a contact. |
| **Description** | The customer sees the current, accurate status of their order and each of its shipments without contacting anyone. **This is the use case that delivers BO-4 — a 60% reduction in WISMO contacts** — and it only works because UC-08 keeps status fresh. |
| **Preconditions** | PRE-1: The order exists and has been validated. <br> PRE-2: The request carries a valid, order-specific tracking token. |
| **Postconditions** | POST-1: No customer data beyond the single order referenced by the token is disclosed. <br> POST-2: The view access is logged, so self-service usage can be measured against the WISMO objective. |
| **Normal Flow** | **9.0** <br> 1. The customer opens the tracking link. <br> 2. The system validates the token and resolves the order. <br> 3. The system displays the order summary, each shipment, its carrier and tracking number, its current status and the event history. <br> 4. The system displays the estimated delivery date per shipment. <br> 5. The customer optionally follows the carrier's own tracking link for carrier-side detail. |
| **Alternative Flows** | **9.1 — Split order.** At step 3 the order has multiple shipments; the system shows each separately with its own carrier and status, and explains that the order was split. <br> **9.2 — Agent view.** A Customer Service Agent opens the same order from the support console and additionally sees internal exception details not shown to the customer. <br> **9.3 — Pre-dispatch order.** The order has no shipment yet; the system shows the order-level status (Validated, Reserved, Routed, Picking) in customer-friendly wording rather than a blank page. |
| **Exceptions** | **9.0.E1 — Invalid or expired token.** At step 2 the token fails validation. The system shows a generic "link not valid" page and does **not** reveal whether the order exists. <br> **9.0.E2 — Order cancelled.** The order was cancelled; the system shows the cancellation and its date, not an error. <br> **9.0.E3 — Carrier status stale.** The last carrier event is older than 48 hours; the system shows the last known status with its timestamp and an explicit "no update since" note rather than implying current knowledge. |
| **Priority** | Medium — deferred to Release 1.2 |
| **Frequency of Use** | Assumed 35% of orders viewed at least once, ~1.8 views each: ~2,800 views/day average. |
| **Business Rules** | BR-09 |
| **Other Information** | This is the only customer-facing surface in OMFS and the only one exposed to the public internet, so the token model in PRE-2/POST-1 is a security requirement, not a convenience: guessing another customer's token must be infeasible (SRS §6.3). No login is required by design (EX-8) — requiring one would push customers back to the support queue. Exception 9.0.E3 is deliberate honesty: pretending to know is what destroys trust in a tracking page. |
| **Assumptions** | Customers receive the tracking link at dispatch by email or SMS through the Notification Service. |

### UC-10 — Handle a fulfillment exception

| | |
|---|---|
| **UC ID and Name** | UC-10 — Handle a fulfillment exception |
| **Created By** | Member 3 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Fulfillment Manager | **Secondary Actors** | Inventory Controller, Customer Service Agent |
| **Trigger** | Any use case raises an exception, or the Fulfillment Manager opens the exception console. |
| **Description** | Every failure in the fulfillment lifecycle — backorder, split limit, short pick, no eligible carrier, delivery failure, stalled shipment — surfaces in one queue with the resolution options appropriate to its type. Without this, exceptions are invisible until a customer complains. |
| **Preconditions** | PRE-1: The user is authenticated with the Fulfillment Manager or Inventory Controller role. <br> PRE-2: At least one open exception exists. |
| **Postconditions** | POST-1: Every exception ends in a recorded resolution with an actor, a timestamp and a reason — never silently disappears. <br> POST-2: The affected order or shipment is left in a valid, consistent state. |
| **Normal Flow** | **10.0** <br> 1. The manager opens the console; the system lists open exceptions sorted by age and delivery-date risk (BR-09). <br> 2. The manager selects an exception; the system shows the order, the cause, and the resolution options valid for that exception type. <br> 3. The manager selects a resolution. <br> 4. The system applies it, updating the order or shipment. <br> 5. The system records the resolution, the actor and the reason (POST-1). <br> 6. The system closes the exception and re-enters the lifecycle at the appropriate use case. |
| **Alternative Flows** | **10.1 — Backorder resolution.** Options: wait for inbound stock, source from another center by re-running UC-04, substitute a SKU with customer consent, or cancel the line via UC-11. <br> **10.2 — Short pick.** Options: re-pick at another location, re-route the line to another center, ship short and refund the difference, or cancel the line. <br> **10.3 — No eligible carrier.** Options: repack into smaller cartons and re-run UC-07, book a manual courier outside OMFS and record the tracking number, or cancel. <br> **10.4 — Delivery failure or stalled shipment.** Options: request re-delivery, redirect to a pickup point, or open a claim with the carrier. <br> **10.5 — Bulk resolution.** The manager selects several exceptions of the same type and cause and applies one resolution to all of them. |
| **Exceptions** | **10.0.E1 — Resolution no longer valid.** At step 4 the underlying state changed (stock arrived, the order was already cancelled). The system rejects the resolution, refreshes the exception, and asks the manager to choose again. <br> **10.0.E2 — Resolution partially applied.** The system applies resolutions transactionally; if any step fails, nothing is applied and the exception stays open (POST-2). <br> **10.0.E3 — Exception ages beyond its SLA.** An exception open longer than its configured SLA is escalated to the Fulfillment Manager's supervisor and flagged on the dashboard (UC-14). |
| **Priority** | Medium — deferred to Release 1.2; until then exceptions are worked from a report |
| **Frequency of Use** | Assumed ~4% of orders raise at least one exception: ~180/day average, ~720/day peak. |
| **Business Rules** | BR-05, BR-09, BR-13 |
| **Other Information** | The resolution options are deliberately **type-specific** (10.1–10.4): a generic "reassign / cancel / ignore" console pushes the real decision back onto the manager's memory, which is the manual process this project is replacing. POST-1 makes the exception log the source of the root-cause analysis that should, over time, reduce exception volume. |
| **Assumptions** | Substituting a SKU requires customer consent obtained by a Customer Service Agent outside OMFS. |

### UC-11 — Cancel or modify an order before dispatch

| | |
|---|---|
| **UC ID and Name** | UC-11 — Cancel or modify an order before dispatch |
| **Created By** | Member 3 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Customer Service Agent | **Secondary Actors** | Sales Channel, Payment Gateway |
| **Trigger** | A customer contacts support to cancel or change an order, or the marketplace pushes a cancellation. |
| **Description** | An order can be stopped or changed while it is still stoppable. The cut-off is the moment the shipping label is purchased (BR-05) — after that the parcel is a carrier's responsibility and the correct path is a return (UC-12). Cancelling must release reserved stock, or the oversell problem simply reappears in another form. |
| **Preconditions** | PRE-1: The order exists and is not yet Labelled. <br> PRE-2: The agent is authenticated with the Customer Service Agent role. |
| **Postconditions** | POST-1: All reservations for cancelled lines are released and a stock-changed event is raised per SKU (triggering UC-13). <br> POST-2: The cancellation or modification is reflected back to the originating sales channel. <br> POST-3: The change is recorded with actor, timestamp and reason. |
| **Normal Flow** | **11.0** <br> 1. The agent locates the order and opens it. <br> 2. The system shows the order, its current status, and which actions are still permitted at that status (BR-05). <br> 3. The agent selects Cancel whole order. <br> 4. The system asks for a cancellation reason. <br> 5. The system releases every reservation on the order and raises a stock-changed event per SKU. <br> 6. The system cancels any open shipment and removes it from its wave. <br> 7. The system sets the order status to Cancelled and notifies the sales channel and the customer. |
| **Alternative Flows** | **11.1 — Cancel one line.** At step 3 the agent cancels a single line; the system releases only that line's reservation and re-runs UC-04 for the remaining lines, since routing may now differ. <br> **11.2 — Change quantity.** The agent reduces a line quantity; the system releases the difference and continues at step 6. Increasing a quantity is not supported — it is a new order. <br> **11.3 — Change shipping address.** The agent edits the address before labelling; the system re-validates it via UC-02 step 1 and re-runs UC-04, because routing depends on destination. <br> **11.4 — Channel-initiated cancellation.** The marketplace pushes a cancellation; the system executes steps 5–7 without an agent and skips the channel notification in step 7. |
| **Exceptions** | **11.0.E1 — Order already labelled.** At step 2 the order is Labelled or later. The system refuses the cancellation (BR-05), explains why, and offers to start a return under UC-12 instead. <br> **11.0.E2 — Marketplace forbids modification.** At step 3 the order came from a channel whose policy forbids post-acceptance modification (BR-16). The system permits cancellation but refuses modification, and says which channel rule applies. <br> **11.0.E3 — Picking already started.** The shipment is Picking. The system flags the order for immediate stop, notifies the fulfillment center, and holds the cancellation as Pending-Stop until the center confirms; only then are reservations released. <br> **11.0.E4 — Channel notification fails.** At step 7 the channel API errors. The cancellation stands in OMFS and the channel notification is queued for retry; the order is never left cancelled in one system and open in the other without an alert. |
| **Priority** | Medium |
| **Frequency of Use** | Assumed 2.5% of orders: ~110/day average, ~450/day peak. |
| **Business Rules** | BR-05, BR-16 |
| **Other Information** | 11.0.E3 is the genuinely hard case and was the subject of elicitation session 4: between the wave release and the label purchase, the physical world is ahead of the system. The chosen answer — a two-phase stop confirmed by the fulfillment center — was preferred by the Fulfillment Manager over an optimistic cancel that risks shipping a cancelled order. |
| **Assumptions** | Refunds are issued by the finance team in the payment gateway; OMFS records that a refund is due but does not move money (EX-5). |

### UC-12 — Process a return and restock

| | |
|---|---|
| **UC ID and Name** | UC-12 — Process a return and restock (RMA) |
| **Created By** | Member 3 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Customer Service Agent | **Secondary Actors** | Warehouse Operator, 3PL Carrier |
| **Trigger** | A customer requests a return, or a carrier returns an undeliverable parcel to the fulfillment center. |
| **Description** | A return is authorized, the goods come back, they are inspected, and stock is either put back on the shelf or quarantined. Restocking matters to this project because returned units that never re-enter ATP are invisible stock — which pushes the oversell rate the wrong way. |
| **Preconditions** | PRE-1: The order contains at least one delivered line. <br> PRE-2: The return is requested within the return window (BR-14). |
| **Postconditions** | POST-1: Every returned unit ends in exactly one of: restocked to sellable, quarantined, or written off. <br> POST-2: Restocked units appear in ATP and a stock-changed event is raised (triggering UC-13). <br> POST-3: The return outcome is recorded against the original order line. |
| **Normal Flow** | **12.0** <br> 1. The agent opens the delivered order and selects the lines to return. <br> 2. The system checks the return window (BR-14) and creates an RMA with a return authorization number. <br> 3. The system issues return instructions and, where the carrier supports it, a return label. <br> 4. The customer sends the goods back; the carrier delivers them to the fulfillment center. <br> 5. A Warehouse Operator scans the RMA number and the returned items. <br> 6. The operator inspects each item and records the outcome: sellable, damaged or missing. <br> 7. For sellable items the system increases on-hand stock and raises a stock-changed event (BR-15). For damaged items it moves the quantity to quarantine. <br> 8. The system closes the RMA and records that a refund is due. |
| **Alternative Flows** | **12.1 — Carrier-returned undeliverable parcel.** The parcel comes back without a customer request; the system creates the RMA automatically at step 5 when the operator scans the original shipment label, and continues from step 6. <br> **12.2 — Partial return.** The customer returns fewer items than authorized; the system records the discrepancy and closes the RMA for the received quantity only. <br> **12.3 — Exchange.** The agent creates a replacement order linked to the RMA; the replacement follows the normal lifecycle from UC-02. |
| **Exceptions** | **12.0.E1 — Return window expired.** At step 2 the delivery date is outside the window (BR-14). The system refuses to create the RMA and shows the delivery date and the window; a supervisor may override with a recorded reason. <br> **12.0.E2 — Goods never arrive.** The RMA is open longer than 30 days after authorization. The system closes it as Not-Received and raises no refund. <br> **12.0.E3 — Unidentifiable return.** At step 5 the parcel carries no readable RMA or shipment reference. The operator records it in the unidentified-returns queue for the Customer Service Agent rather than guessing an order. <br> **12.0.E4 — Quantity mismatch.** The received quantity exceeds the authorized quantity. The system accepts the authorized quantity and raises an exception for UC-10 for the excess. |
| **Priority** | Low — deferred to Release 2.0 |
| **Frequency of Use** | Assumed 6% of delivered orders: ~270 RMAs/day average. |
| **Business Rules** | BR-14, BR-15 |
| **Other Information** | Inspection (step 6) is a human judgement that OMFS records rather than makes. The one rule the system does enforce is BR-15: a damaged item must not silently return to sellable stock. Refund execution is out of scope (EX-5); OMFS records the obligation and the finance team acts on it. |
| **Assumptions** | Each fulfillment center has a designated returns receiving area and a quarantine location. |

### UC-13 — Synchronize stock levels to sales channels

| | |
|---|---|
| **UC ID and Name** | UC-13 — Synchronize stock levels to sales channels |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | OMFS (system, event-driven) | **Secondary Actors** | Sales Channel |
| **Trigger** | A stock-changed event is raised by UC-03, UC-06, UC-11 or UC-12, or the reconciliation timer fires (hourly). |
| **Description** | Whenever the sellable quantity of a SKU changes for any reason, OMFS pushes the new figure to every channel that sells it. Together with reservation in UC-03, this is what closes the oversell gap: reservation stops the double sale, synchronization stops the channel offering stock that no longer exists. |
| **Preconditions** | PRE-1: The SKU is mapped to at least one Active sales channel. <br> PRE-2: The channel's API credentials are valid. |
| **Postconditions** | POST-1: Every Active channel selling the SKU has been sent the current sellable quantity, or a sync failure is recorded for that channel and SKU. <br> POST-2: The sent quantity and the send timestamp are recorded per channel and SKU, so drift can be detected. |
| **Normal Flow** | **13.0** <br> 1. The system receives a stock-changed event for a SKU. <br> 2. The system computes the sellable quantity to publish: total ATP across all Open fulfillment centers (BR-07), less any channel-specific buffer. <br> 3. The system determines which Active channels sell the SKU. <br> 4. The system batches updates per channel to stay inside the channel's rate limit. <br> 5. The system sends the update and stores the sent quantity and timestamp (POST-2). |
| **Alternative Flows** | **13.1 — Hourly reconciliation.** The timer fires; the system reads the quantity each channel currently believes it has, compares it with OMFS, and re-pushes any SKU that differs. This catches silently dropped updates. <br> **13.2 — Coalesced updates.** Several stock-changed events arrive for one SKU within the batching window; the system sends only the latest quantity, not one update per event. <br> **13.3 — Channel activation.** A channel is newly activated; the system performs a full push of every mapped SKU. |
| **Exceptions** | **13.0.E1 — Channel rejects the update.** The channel returns an error for a SKU. The system records the failure, retries with backoff, and after three failures raises an integration alert naming the SKU and the channel. <br> **13.0.E2 — Rate limit reached.** At step 4 the channel signals throttling. The system queues the remaining updates and resumes after the stated retry interval; updates are never dropped. <br> **13.0.E3 — Channel unreachable.** The channel API is down. The system queues updates and, when the outage exceeds 15 minutes, raises an alert because stale channel stock is the direct cause of overselling. <br> **13.0.E4 — Negative computed quantity.** At step 2 the computation yields a negative number, which indicates a data fault. The system publishes zero, raises a data-quality alert for the Inventory Controller, and does not publish the negative value. |
| **Priority** | High |
| **Frequency of Use** | ~25,000 stock-changed events/day average, coalesced to ~9,000 channel updates/day; ~4× on peak days. |
| **Business Rules** | BR-07, BR-17, BR-20 |
| **Other Information** | The 60-second publication target in BR-20 is the tightest latency requirement in the system and is the reason UC-13 is event-driven rather than scheduled. The hourly reconciliation in 13.1 exists because the team cannot assume every push succeeds — the current process fails silently and nobody notices until an oversell happens. |
| **Assumptions** | Every channel exposes both a stock-update endpoint and a stock-read endpoint; without the read, 13.1 degrades to a blind re-push. |

### UC-14 — View the fulfillment performance dashboard

| | |
|---|---|
| **UC ID and Name** | UC-14 — View the fulfillment performance dashboard |
| **Created By** | Member 2 | **Date Created** | 2026-09-17 |
| **Primary Actor** | Fulfillment Manager | **Secondary Actors** | Brand Manager, Logistics Manager |
| **Trigger** | The user opens the dashboard, or the scheduled daily summary is generated. |
| **Description** | One screen showing whether fulfillment is meeting its targets: throughput, order-to-ship cycle time, oversell rate, exception volume and shipping cost per order. Its purpose is to make the six business objectives from the Vision & Scope document continuously visible rather than reconstructed at quarter end. |
| **Preconditions** | PRE-1: The user is authenticated with a role that grants dashboard access. <br> PRE-2: At least one day of operating data exists. |
| **Postconditions** | POST-1: The user sees only the fulfillment centers, channels and brands their role permits. <br> POST-2: Every figure displays the period it covers and the time it was last refreshed. |
| **Normal Flow** | **14.0** <br> 1. The user opens the dashboard. <br> 2. The system applies the user's data scope (POST-1). <br> 3. The system displays the headline metrics against their targets: orders shipped, order-to-ship cycle time, oversell rate, automated routing rate, open exceptions and shipping cost per order. <br> 4. The system displays each metric's trend over the selected period. <br> 5. The user changes the period, fulfillment center, channel or brand filter. <br> 6. The system recomputes and redisplays. |
| **Alternative Flows** | **14.1 — Drill down.** The user clicks a metric; the system lists the underlying orders or exceptions. <br> **14.2 — Export.** The user exports the current view as CSV for offline analysis. <br> **14.3 — Scheduled summary.** The system emails a daily summary to subscribed managers at 07:00 local time. <br> **14.4 — Carrier cost view.** The Logistics Manager opens the cost breakdown by carrier, comparing quoted rates (UC-07 POST-2) with invoiced amounts. |
| **Exceptions** | **14.0.E1 — Insufficient data.** The selected period contains no data. The system shows an explicit "no data for this period" state rather than zeros, which would read as a catastrophic result. <br> **14.0.E2 — Metric computation times out.** The system displays the metrics that completed and marks the rest as unavailable with a retry action, rather than failing the whole page. <br> **14.0.E3 — Stale aggregates.** The aggregation job has not run recently. The system shows the last-refreshed timestamp prominently (POST-2) and warns that figures are stale. |
| **Priority** | Low — deferred to Release 2.0 |
| **Frequency of Use** | ~15 users, ~4 views/day each: ~60 views/day. Daily summary: 1/day. |
| **Business Rules** | BR-06, BR-09, BR-18 |
| **Other Information** | The metric definitions must be **identical** to the success metrics in Vision & Scope §1.4 — if the dashboard computes the oversell rate differently from the project's success criterion, the project cannot prove it succeeded. Report layouts are specified in SRS §4.3. |
| **Assumptions** | Near-real-time aggregation is acceptable; figures may lag live data by up to 15 minutes. |

---

## 4. Use Case Diagram

See `diagrams/use-case-diagram.drawio` (editable) and `diagrams/use-case-diagram.png` (for the SRS Appendix B).

**Reading the diagram**
- Primary actors are on the **left**, secondary (system) actors on the **right**.
- The rectangle is the **system boundary** — everything inside it is OMFS's responsibility; the web storefront, payment gateway and ERP sit outside deliberately (see Vision & Scope §2.4 Limitations and Exclusions).
- `«include»` arrows point **from** the base use case **to** the always-executed use case.
- `«extend»` arrows point **from** the optional use case **to** the base it extends.

**Relationships shown**
| Relationship | From | To | Why |
|---|---|---|---|
| «include» | UC-01 Ingest an order | UC-02 Screen and validate | Every ingested order is screened before it can reserve stock |
| «include» | UC-02 Screen and validate | UC-03 Reserve inventory | Every validated order reserves stock |
| «include» | UC-03 Reserve inventory | UC-04 Route and split | Every reserved order is routed |
| «include» | UC-06 Pick and pack | UC-07 Rate-shop and label | Every packed shipment is labelled |
| «include» | UC-03 Reserve inventory | UC-13 Synchronize stock | Every reservation changes sellable stock, always |
| «include» | UC-06 Pick and pack | UC-13 Synchronize stock | Picking deducts on-hand stock, always |
| «include» | UC-11 Cancel or modify | UC-13 Synchronize stock | Cancellation releases stock, always |
| «include» | UC-07 Rate-shop and label | UC-09 Track an order | Labelling always issues the customer tracking link |
| «extend» | UC-10 Handle exception | UC-03 Reserve inventory | Only when reservation fails |
| «extend» | UC-10 Handle exception | UC-04 Route and split | Only when routing fails |
| «extend» | UC-10 Handle exception | UC-07 Rate-shop and label | Only when no carrier is eligible |
| «extend» | UC-12 Process a return | UC-08 Ingest tracking event | Only when the carrier returns an undeliverable parcel |
