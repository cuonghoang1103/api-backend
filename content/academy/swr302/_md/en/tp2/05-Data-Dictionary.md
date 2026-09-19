# Data Dictionary
## for the Order Management and Fulfillment System (OMFS)

Version 1.0 approved
Prepared by **<Member 4 name>**, Business Analysis Team — Group <N>
Nova Retail Group (NRG)
Last updated 17 September 2026

---

### Revision History

| Name | Date | Reason For Changes | Version |
|---|---|---|---|
| Member 4, Group <N> | 2026-09-17 | Elements harvested while use cases UC-01…UC-14 were written | 0.9 |
| Member 4, Group <N> | 2026-09-17 | Structures completed, cross-checked against business rules | 1.0 |

---

## 1. Notation

Per *Guidance for Data Dictionaries* (Wiegers & Beatty, Chapter 13):

| Symbol | Meaning |
|---|---|
| `+` | composed of / and |
| `( )` | optional element |
| `{ }` | repeating group |
| `min:max` | allowed number of repeats; `n` means unlimited |
| `[ a \| b ]` | either–or |
| `" "` | literal text |

**Conventions used in this document**

- Entries are ordered **alphabetically**.
- For a **data structure**, the *Length* and *Values* columns are left blank — they apply to primitive elements only.
- Every element named inside a structure has **its own entry** in this dictionary.
- Where a value is governed by a business rule, the *Values* column cites the rule ID rather than repeating the rule text.

---

## 2. Data Dictionary

| Data Element | Description | Composition or Data Type | Length | Values |
|---|---|---|---|---|
| Authorized Quantity | Quantity of a SKU a customer has been authorized to return | integer | 4 | ≥ 1; not greater than the delivered quantity |
| Available To Promise | Quantity of a SKU at one fulfillment center that may be promised to a new order | integer | 6 | ≥ 0; computed per BR-07; may not be negative — a negative computation is a data fault (UC-13 exception 13.0.E4) |
| Barcode | Scannable code printed on the physical item, used to verify a pick | alphanumeric | 20 | EAN-13 or internal code; unique per SKU |
| Capacity Score | Component of the routing score reflecting a center's remaining daily capacity | decimal | 5 | 0.00–1.00; see BR-06 |
| Carrier Code | Identifier of a third-party logistics carrier | alphabetic | 10 | GHN, GHTK, VTP, JNT |
| Carrier Event Time | Time the carrier itself recorded a tracking event | datetime, ISO 8601 with offset | 25 | Used for ordering events (UC-08 POST-2); may be earlier than Received At |
| Carrier Quote | A price and service offer from one carrier for one shipment | Carrier Code + Service Level + Quoted Cost + Estimated Transit Days + Quoted At | | |
| Carrier Status Code | The carrier's own status value, before mapping | alphanumeric | 30 | Carrier-specific; unmapped values raise a configuration alert |
| Carton | One physical box within a shipment | Carton ID + Carton Weight + Carton Length + Carton Width + Carton Height | | |
| Carton ID | Unique identifier of a carton | alphanumeric | 20 | System-generated; printed as a scannable label |
| Carton Height | Height of a packed carton | decimal, centimetres | 5 | > 0 |
| Carton Length | Length of a packed carton | decimal, centimetres | 5 | > 0 |
| Carton Weight | Gross weight of a packed carton | decimal, kilograms | 6 | > 0; drives carrier eligibility per BR-11 and cost per BR-12 |
| Carton Width | Width of a packed carton | decimal, centimetres | 5 | > 0 |
| Center Status | Operating state of a fulfillment center | alphabetic | 10 | [ Open \| Closed \| Suspended ]; only Open centers are routing candidates |
| Channel ID | Unique identifier of a sales channel | alphanumeric | 12 | System-assigned |
| Channel Name | Display name of a sales channel | alphanumeric | 40 | e.g. Web Storefront, Shopee, Lazada, TikTok Shop |
| Channel Status | Whether OMFS currently exchanges data with a channel | alphabetic | 10 | [ Active \| Inactive ]; only Active channels receive stock publications |
| Channel Stock Publication | A record of the sellable quantity most recently sent to one channel for one SKU | SKU + Channel ID + Published Quantity + Published At | | |
| Channel Type | Category of sales channel, which determines its modification policy | alphabetic | 12 | [ Storefront \| Marketplace ]; Marketplace orders may not be modified (BR-16) |
| Cost Score | Component of the routing score reflecting expected shipping cost | decimal | 5 | 0.00–1.00; see BR-06 |
| Created At | Time a record was created | datetime, ISO 8601 with offset | 25 | System-generated |
| Customer | The buyer named on an order | Customer Name + Email Address + (Phone Number) | | |
| Customer Name | Name of the buyer as supplied by the sales channel | alphabetic | 100 | Not blank |
| Daily Capacity | Number of shipments a fulfillment center can dispatch in one working day | integer | 6 | > 0; configurable per center; used by BR-06 and UC-04 |
| Damaged Quantity | Quantity of a SKU at a center recorded as damaged and not sellable | integer | 6 | ≥ 0; excluded from Available To Promise per BR-07 |
| Decided At | Time a routing decision was made | datetime, ISO 8601 with offset | 25 | System-generated |
| Decision Mode | How a routing decision was reached | alphabetic | 16 | [ Automatic \| Manual \| Fallback ]; Manual requires Override Reason per BR-19 |
| Dispatch Cut Off Time | Local time after which orders routed to a center dispatch the next working day | time, HH:MM | 5 | Default 14:00; configurable per center; see BR-10 |
| District | District of the delivery address | alphabetic | 60 | From the national administrative list |
| Email Address | Electronic mail address used to send order notifications | alphanumeric | 254 | Must contain exactly one "@" |
| Estimated Transit Days | Carrier's published transit time for the destination | integer | 2 | ≥ 0; used by BR-09 to determine at-risk orders |
| Event ID | Unique identifier of a tracking event | alphanumeric | 36 | System-generated |
| Exception ID | Unique identifier of a fulfillment exception | alphanumeric | 20 | System-generated |
| Exception Status | Current state of a fulfillment exception | alphabetic | 12 | [ Open \| Resolved \| Escalated ]; never deleted, always resolved (UC-10 POST-1) |
| Exception Type | Category of fulfillment exception, which determines the resolution options offered | alphabetic | 24 | [ Backorder \| SplitLimit \| ShortPick \| NoCarrier \| DeliveryFailure \| StalledShipment \| AddressUnserviceable \| DataQuality ] |
| Expires At | Time at which a reservation is released if not confirmed | datetime, ISO 8601 with offset | 25 | Created At + the reservation window; see BR-04 |
| Fulfillment Center | A warehouse from which orders are shipped | Fulfillment Center ID + Fulfillment Center Name + Ship To Address + Center Status + Daily Capacity + Dispatch Cut Off Time | | |
| Fulfillment Center ID | Unique identifier of a fulfillment center | alphanumeric | 10 | HCM, HAN, DAD |
| Fulfillment Center Name | Display name of a fulfillment center | alphanumeric | 60 | Not blank |
| Fulfillment Exception | A failure in the fulfillment lifecycle that requires a human decision | Exception ID + Exception Type + Order ID + (Shipment ID) + Raised At + Exception Status + (Resolution Code) + (Resolution Reason) + (Resolved By) + (Resolved At) | | |
| Inspection Outcome | Result of inspecting a returned item | alphabetic | 10 | [ Sellable \| Damaged \| Missing ]; Damaged must be quarantined per BR-15 |
| Inventory Record | The stock position of one SKU at one fulfillment center | SKU + Fulfillment Center ID + On Hand Quantity + Reserved Quantity + Damaged Quantity + Safety Stock Quantity + Available To Promise | | |
| Item | A sellable product as OMFS knows it | SKU + Item Description + Item Weight + Barcode + Storage Location | | |
| Item Description | Human-readable product name shown on the pick screen | alphanumeric | 200 | Not blank |
| Item Weight | Unit weight of one item, used to estimate carton weight | decimal, kilograms | 6 | > 0 |
| Line Number | Position of a line within its order | integer | 3 | ≥ 1; unique within an order |
| Line Status | Current state of one order line | alphabetic | 14 | [ Pending \| Reserved \| Backordered \| Picked \| Shipped \| Cancelled \| Returned ] |
| OMFS Status | Tracking event status after mapping to the OMFS vocabulary | alphabetic | 20 | [ Collected \| InTransit \| OutForDelivery \| Delivered \| DeliveryFailed \| Returned \| Lost ] |
| On Hand Quantity | Physical quantity of a SKU present at a fulfillment center | integer | 6 | ≥ 0 |
| Order | A customer purchase received from one sales channel | Order ID + Channel ID + Order Date + Customer + Ship To Address + Payment Method + Order Status + 1:n{Order Line} | | |
| Order Date | Time the order was placed on the sales channel | datetime, ISO 8601 with offset | 25 | Supplied by the channel, not the time of ingestion |
| Order ID | Unique OMFS identifier of an order | alphanumeric | 20 | System-generated; distinct from the channel's own order reference |
| Order Line | One SKU and quantity within an order | Line Number + SKU + Ordered Quantity + Unit Price + Line Status | | |
| Order Status | Current position of an order in the fulfillment lifecycle | alphabetic | 18 | [ Pending \| HeldUnmapped \| HeldInvalid \| HeldReview \| Validated \| Reserved \| Backordered \| Routed \| Picking \| Packed \| Labelled \| Shipped \| Delivered \| Cancelled ] |
| Ordered Quantity | Quantity of a SKU the customer ordered on a line | integer | 4 | ≥ 1 |
| Override Reason | Free text a Fulfillment Manager must supply when overriding an automated routing decision | alphanumeric | 500 | Mandatory when Decision Mode is Manual; see BR-19 |
| Payment Method | How the customer paid or will pay | alphabetic | 16 | [ Card \| BankTransfer \| EWallet \| COD ]; COD skips the authorization check (UC-02 flow 2.1) |
| Phone Number | Contact telephone number for delivery | "+84" + Subscriber Number | | |
| Pick Wave | A batch of shipments released to a fulfillment center floor together | Wave ID + Fulfillment Center ID + Created At + (Released At) + Wave Status + 1:n{Shipment ID} | | |
| Postcode | Postal code of the delivery destination | numeric | 6 | Must be served by at least one carrier (BR-11) |
| Proximity Score | Component of the routing score reflecting distance from center to destination | decimal | 5 | 0.00–1.00; see BR-06 |
| Province | Province or centrally governed city of the delivery address | alphabetic | 60 | From the national administrative list |
| Published At | Time a stock quantity was sent to a channel | datetime, ISO 8601 with offset | 25 | Used to measure the 60-second target in BR-20 |
| Published Quantity | Sellable quantity most recently sent to a channel for a SKU | integer | 6 | ≥ 0 |
| Quoted At | Time a carrier rate quote was obtained | datetime, ISO 8601 with offset | 25 | Stored for invoice reconciliation (UC-07 POST-2) |
| Quoted Cost | Landed shipping cost quoted by a carrier | decimal, VND | 12 | ≥ 0; computed per BR-12 |
| RMA Number | Unique return authorization number given to the customer | alphanumeric | 20 | System-generated; printed on return instructions |
| RMA Status | Current state of a return authorization | alphabetic | 14 | [ Authorized \| Received \| Inspected \| Closed \| NotReceived ] |
| Raised At | Time a fulfillment exception was created | datetime, ISO 8601 with offset | 25 | System-generated |
| Received At | Time OMFS received a tracking event | datetime, ISO 8601 with offset | 25 | Compared with Carrier Event Time to measure ingestion lag (BO-4 metric) |
| Received Quantity | Quantity actually received back at the fulfillment center | integer | 4 | ≥ 0; a value above Authorized Quantity raises an exception (UC-12 exception 12.0.E4) |
| Recipient Name | Name of the person receiving the delivery | alphabetic | 100 | Not blank; may differ from Customer Name |
| Released At | Time a pick wave was released to the floor | datetime, ISO 8601 with offset | 25 | Blank until release; starts the 24-hour escalation window in BR-13 |
| Reservation | A hold placed on stock for one order line | Reservation ID + SKU + Fulfillment Center ID + Reserved Quantity + Created At + Expires At | | |
| Reservation ID | Unique identifier of a reservation | alphanumeric | 20 | System-generated |
| Reserved Quantity | Quantity of a SKU held for orders and not available to new ones | integer | 6 | ≥ 0; excluded from Available To Promise per BR-07 |
| Resolution Code | The action chosen to resolve a fulfillment exception | alphabetic | 24 | Valid values depend on Exception Type (UC-10 flows 10.1–10.4) |
| Resolution Reason | Free text explaining why a resolution was chosen | alphanumeric | 500 | Mandatory; see UC-10 POST-1 |
| Resolved At | Time a fulfillment exception was resolved | datetime, ISO 8601 with offset | 25 | Blank while the exception is Open |
| Resolved By | User who resolved a fulfillment exception | alphanumeric | 60 | Blank while the exception is Open |
| Return Authorization | A customer's authorized return of one or more delivered lines | RMA Number + Order ID + Created At + RMA Status + 1:n{Return Line} | | |
| Return Line | One SKU and quantity within a return authorization | SKU + Authorized Quantity + (Received Quantity) + (Inspection Outcome) | | |
| Routing Decision | The record of how an order was routed, retained so the decision can be explained | Order ID + Decided At + Decision Mode + 1:3{Routing Score} + (Override Reason) | | |
| Routing Score | One fulfillment center's score in a routing decision | Fulfillment Center ID + Stock Coverage Score + Proximity Score + Cost Score + Capacity Score + Total Score | | |
| SKU | Stock keeping unit — the unique identifier of a sellable product | alphanumeric | 24 | Unique across all brands; the join key between channels, inventory and shipments |
| Safety Stock Quantity | Quantity of a SKU withheld from sale at a center as a buffer | integer | 5 | ≥ 0; default 2, configurable per SKU; see BR-17 |
| Sales Channel | A storefront or marketplace through which NRG sells | Channel ID + Channel Name + Channel Type + Channel Status | | |
| Service Level | Speed tier of a carrier offering | alphabetic | 12 | [ Standard \| Express \| SameDay ] |
| Ship To Address | The destination to which a shipment is delivered | Recipient Name + Street Address + Ward + District + Province + Postcode + Phone Number | | |
| Shipment | The portion of an order fulfilled from one fulfillment center | Shipment ID + Order ID + Fulfillment Center ID + Shipment Status + 1:n{Shipment Line} + (Carrier Code) + (Tracking Number) + 0:n{Carton} | | |
| Shipment ID | Unique identifier of a shipment | alphanumeric | 20 | System-generated |
| Shipment Line | One SKU and quantity within a shipment | SKU + Shipped Quantity | | |
| Shipment Status | Current state of a shipment | alphabetic | 18 | [ Routed \| Picking \| Packed \| Labelled \| Collected \| InTransit \| Delivered \| DeliveryException \| Returned \| Cancelled ] |
| Shipped Quantity | Quantity of a SKU actually packed into a shipment | integer | 4 | ≥ 0; may be less than Ordered Quantity after a short pick |
| Stock Coverage Score | Component of the routing score reflecting how much of the order a center can fill | decimal | 5 | 0.00–1.00; see BR-06 |
| Storage Location | Coarse location of a SKU within a fulfillment center, used to sequence the pick list | alphanumeric | 20 | Maintained by warehouse staff; bin-level detail is out of scope (EX-3) |
| Street Address | House number and street of the delivery address | alphanumeric | 200 | Not blank |
| Subscriber Number | National subscriber portion of a telephone number, without the leading zero | numeric | 9 | 9 digits |
| Total Score | Weighted sum of a center's routing score components | decimal | 6 | 0.00–1.00; computed per BR-06; the highest wins |
| Tracking Event | One carrier scan or status update for a shipment | Event ID + Tracking Number + Carrier Code + Carrier Status Code + OMFS Status + Carrier Event Time + Received At | | |
| Tracking Number | Carrier's identifier for a parcel, used by the customer to track it | alphanumeric | 40 | Issued by the carrier at label purchase; unique per carrier |
| Unit Price | Price of one unit of a SKU as charged by the sales channel | decimal, VND | 12 | ≥ 0; supplied by the channel, never recalculated by OMFS |
| Ward | Ward or commune of the delivery address | alphabetic | 60 | From the national administrative list |
| Wave ID | Unique identifier of a pick wave | alphanumeric | 20 | System-generated |
| Wave Status | Current state of a pick wave | alphabetic | 12 | [ Draft \| Released \| Complete \| Cancelled ] |

---

## 3. Notes on selected entries

**Available To Promise** is the most important entry in this dictionary. It is not
stored data — it is derived, and its derivation (BR-07) is what closes the oversell
gap that motivated the whole project. Every place a quantity is shown to a channel,
an operator or a customer, this is the number, not On Hand Quantity.

**Order Status versus Shipment Status** are deliberately different vocabularies. An
order can be partially shipped when it has been split (BR-08), so its status is not
simply the status of its shipments. Merging the two lists — a tempting
simplification — would make a split order unrepresentable.

**Carrier Event Time versus Received At** exist as a pair so that ingestion lag can
be measured. The 15-minute p95 target that delivers business objective BO-4 is
computed from the difference, and UC-08 orders events by Carrier Event Time rather
than Received At precisely because carriers deliver events out of order.

**Override Reason and Resolution Reason** are mandatory free text. They exist
because BR-19 and UC-10 POST-1 require that a human decision be explainable later;
without them the audit trail records *what* happened but never *why*.
