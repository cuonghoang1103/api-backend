/**
 * SWR302 · Worked requirements package for assignment topic TP2 — the Order
 * Management and Fulfillment System (OMFS) of the fictional Nova Retail Group.
 *
 * All eight deliverables in full, so a student can read a complete, internally
 * consistent package rather than fragments. The documents themselves are in
 * English (that is what is submitted); the guidance around each one is bilingual.
 *
 * Generated from the source Markdown by scratchpad/tp2.py — edit the Markdown,
 * regenerate, do not hand-edit this file.
 */
import { bi } from './_slides.mjs';

const TP2L1 = {
  title: "W2.1 — Deliverable 1: Vision & Scope (full document)|||W2.1 — Deliverable 1: Vision & Scope (tài liệu đầy đủ)",
  slug: "swr302-tp2-goi-01-vision-scope",
  type: 'DOCUMENT',
  isFreePreview: true,
  description: "Tài liệu Vision & Scope hoàn chỉnh cho OMFS theo template Chapter 5: 6 business objective có baseline–target–deadline, thước đo thành công kèm nguồn dữ liệu, vision statement theo mẫu Moore, 6 rủi ro, 14 feature, 3 bản phát hành, 8 loại trừ, hồ sơ 9 stakeholder, bảng ưu tiên dự án.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP2 · Deliverable 1</span>
<h2>Vision &amp; Scope — the complete document</h2>
<p class="lead">This is the whole deliverable, not an extract. Read it once for content, then a second time asking a different question: <strong>where does each number come from?</strong> Every baseline in §1.3 is either measured or declared as an assumption in §1.7 — nothing is left floating.</p>
<p>Four things in here are worth stealing for your own topic:</p>
<ul>
<li><strong>§1.3 objectives are a table, not prose.</strong> Baseline → target → deadline, one row each. Prose hides missing numbers; a table exposes them.</li>
<li><strong>§1.4 metrics name their data source.</strong> "Oversell rate" is useless until you say it is computed from OMFS order and exception records, weekly. Without that nobody can ever prove the project worked.</li>
<li><strong>§2.4 exclusions are not empty.</strong> Eight of them, each a thing a reader would otherwise assume was included. This is the section graders open first.</li>
<li><strong>§3.2 makes a trade-off.</strong> Schedule is the driver, so features and quality become degrees of freedom. Marking every dimension a driver would prove no decision was made.</li>
</ul>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP2 · Deliverable 1</span>
<h2>Vision &amp; Scope — tài liệu hoàn chỉnh</h2>
<p class="lead">Đây là trọn vẹn deliverable, không phải trích đoạn. Hãy đọc lượt đầu lấy nội dung, rồi đọc lượt hai với một câu hỏi khác: <strong>mỗi con số ở đây từ đâu ra?</strong> Mọi baseline ở §1.3 đều hoặc là đo được, hoặc được khai là giả định ở §1.7 — không có con số nào lơ lửng.</p>
<p>Bốn thứ trong đây đáng "mượn" cho đề tài của bạn:</p>
<ul>
<li><strong>§1.3 mục tiêu là BẢNG, không phải văn xuôi.</strong> Baseline → đích → hạn chót, mỗi dòng một cái. Văn xuôi giấu được con số thiếu; bảng thì phơi ra.</li>
<li><strong>§1.4 thước đo có gọi tên nguồn dữ liệu.</strong> "Tỉ lệ bán vượt" vô dụng cho tới khi bạn nói nó được tính từ bản ghi đơn hàng và ngoại lệ của OMFS, hàng tuần. Thiếu điều đó thì chẳng ai chứng minh được dự án đã thành công.</li>
<li><strong>§2.4 phần loại trừ KHÔNG để trống.</strong> Tám mục, mỗi mục là thứ người đọc dễ mặc định là có. Đây là mục người chấm mở ra đầu tiên.</li>
<li><strong>§3.2 có một sự đánh đổi thật.</strong> Lịch là driver, nên tính năng và chất lượng thành degree of freedom. Đánh mọi chiều là driver tức là chứng minh chưa quyết định gì.</li>
</ul>`,
    ),
    `<div class="ml-en"><h2>Vision and Scope Document</h2>
<h2>for the Order Management and Fulfillment System (OMFS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Team Leader name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Nova Retail Group (NRG)
17 September 2026</p>
<hr />
<h3>Revision History</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Date</th>
<th>Reason For Changes</th>
<th>Version</th>
</tr>
</thead>
<tbody>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Initial draft after stakeholder elicitation round 1</td>
<td>0.9</td>
</tr>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Baseline approved by Project Sponsor</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Business Requirements</h3>
<h3>1.1 Background</h3>
<p>Nova Retail Group (NRG) is a multi-brand retail company operating five consumer
brands across apparel, home goods and personal care, with approximately 12,000
active SKUs. Until 2024 NRG was primarily a physical-store business with a single
warehouse in Ho Chi Minh City and a small web storefront used mainly as a catalogue.</p>
<p>Over the past 24 months NRG expanded aggressively into online sales. It now sells
through <strong>four sales channels</strong> — its own web storefront plus three marketplaces
(Shopee, Lazada, TikTok Shop) — and operates <strong>three fulfillment centers (FCs)</strong> in
Ho Chi Minh City, Hanoi and Da Nang, shipping through <strong>four third-party logistics
(3PL) carriers</strong> (GHN, GHTK, Viettel Post, J&amp;T Express).</p>
<p>The customer-facing side of this expansion succeeded: the storefront handles
browsing, promotion and checkout well, and average daily order volume grew from
about 600 to <strong>4,500 orders per day</strong>, peaking near <strong>18,000 orders per day</strong> on
campaign dates (9.9, 11.11, 12.12).</p>
<p>The back office did not scale with it. Order fulfillment is still coordinated the
way it was when NRG had one warehouse and one channel: a spreadsheet for inventory,
printed picking slips, and manual carrier uploads. Each new channel, FC and carrier
was bolted onto that manual process rather than integrated into a system. NRG
management has recognized that fulfillment operations, not demand, are now the
constraint on growth.</p>
<h3>1.2 Business Opportunity</h3>
<p>NRG's back-office fulfillment operations are fragmented and uncoordinated. Four
specific problems dominate:</p>
<p><strong>P1 — Inventory is not synchronized in real time.</strong> Stock levels are pushed from
the warehouse spreadsheet to each channel on a twice-daily batch. Between batches,
the same physical unit can be sold on the storefront and on two marketplaces.
Measured over Q2 2026, <strong>3.8% of all orders were oversold</strong> — roughly 170 orders per
day that must be cancelled, delayed or substituted. Marketplace penalties for
seller-initiated cancellation have twice pushed NRG's Shopee seller rating below the
Preferred Seller threshold.</p>
<p><strong>P2 — Order routing is manual and unoptimized.</strong> Warehouse staff print every order,
sort the slips by hand, and decide which FC fulfills which order using personal
judgement. There is no automated routing logic, no consideration of stock coverage,
distance or carrier cost, and no ability to split an order across FCs. Staff spend
about <strong>6 hours per day</strong> on printing and sorting alone, and orders are regularly
routed to an FC that must then backorder an item another FC has on the shelf.</p>
<p><strong>P3 — 3PL integration is a manual file exchange.</strong> Shipping labels are bought in
each carrier's own web portal, and tracking events come back as CSV files that an
operations clerk uploads twice a day. Order status visible to the customer therefore
lags physical reality by up to <strong>12 hours</strong>, and label purchase is done on whichever
carrier the operator prefers rather than on cost or service level.</p>
<p><strong>P4 — Customer support is overwhelmed by "Where is my order?" (WISMO) enquiries.</strong>
Because status is stale and no self-service tracking exists, <strong>62% of the ~900
support tickets received each day are WISMO</strong> — about 560 tickets per day that a
human answers by opening three different carrier portals.</p>
<p>No commercially available package NRG has evaluated covers all four channels, all
three FCs and all four Vietnamese carriers without heavy customization. A
centralized Order Management and Fulfillment System, specified around NRG's actual
operating model, is the proposed solution.</p>
<h3>1.3 Business Objectives</h3>
<table>
<thead>
<tr>
<th>ID</th>
<th>Business Objective</th>
<th>Baseline (Q2 2026)</th>
<th>Target</th>
<th>Deadline</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>BO-1</strong></td>
<td>Reduce the oversell rate by synchronizing inventory across all sales channels in near real time</td>
<td>3.8% of orders</td>
<td>≤ 0.5% of orders</td>
<td>6 months after Release 1.0</td>
</tr>
<tr>
<td><strong>BO-2</strong></td>
<td>Automate order routing so that human intervention is the exception, not the rule</td>
<td>0% automated</td>
<td>≥ 95% of orders routed with no manual touch</td>
<td>3 months after Release 1.0</td>
</tr>
<tr>
<td><strong>BO-3</strong></td>
<td>Reduce order-to-ship cycle time</td>
<td>26 hours average</td>
<td>≤ 8 hours average</td>
<td>6 months after Release 1.0</td>
</tr>
<tr>
<td><strong>BO-4</strong></td>
<td>Reduce WISMO contact volume through accurate, self-service order tracking</td>
<td>~560 tickets/day</td>
<td>≥ 60% reduction (≤ 224 tickets/day)</td>
<td>6 months after Release 1.0</td>
</tr>
<tr>
<td><strong>BO-5</strong></td>
<td>Reduce average outbound shipping cost per order through automated carrier rate shopping</td>
<td>38,000 VND/order</td>
<td>≥ 12% reduction (≤ 33,440 VND/order)</td>
<td>9 months after Release 1.0</td>
</tr>
<tr>
<td><strong>BO-6</strong></td>
<td>Absorb campaign-day peaks without adding fulfillment headcount</td>
<td>18,000 orders/day requires 22 temporary staff</td>
<td>20,000 orders/day with permanent staff only</td>
<td>First campaign after Release 1.0</td>
</tr>
</tbody>
</table>
<h3>1.4 Success Metrics</h3>
<table>
<thead>
<tr>
<th>Metric</th>
<th>Measurement method</th>
<th>Source of data</th>
<th>Reporting frequency</th>
</tr>
</thead>
<tbody>
<tr>
<td>Oversell rate</td>
<td>(Orders cancelled or short-shipped due to insufficient stock ÷ total orders) × 100</td>
<td>OMFS order and exception records</td>
<td>Weekly</td>
</tr>
<tr>
<td>Automated routing rate</td>
<td>(Orders routed with no operator override ÷ total orders) × 100</td>
<td>OMFS routing audit log</td>
<td>Weekly</td>
</tr>
<tr>
<td>Order-to-ship cycle time</td>
<td>Median and mean hours from order acceptance to carrier pickup scan</td>
<td>OMFS timestamps + carrier events</td>
<td>Daily</td>
</tr>
<tr>
<td>WISMO ticket share</td>
<td>WISMO-tagged tickets ÷ total support tickets</td>
<td>Support desk tagging</td>
<td>Weekly</td>
</tr>
<tr>
<td>Shipping cost per order</td>
<td>Total 3PL invoice ÷ orders shipped, per month</td>
<td>3PL invoice reconciliation</td>
<td>Monthly</td>
</tr>
<tr>
<td>Tracking freshness</td>
<td>95th percentile delay between carrier event time and OMFS status update</td>
<td>OMFS event ingestion log</td>
<td>Daily</td>
</tr>
</tbody>
</table>
<p><strong>Factors with the greatest impact on success (inside NRG's control):</strong> quality of
the master SKU data migrated into OMFS; willingness of FC supervisors to abandon
paper slips; timely provision of carrier API credentials.</p>
<p><strong>Factors outside NRG's control:</strong> marketplace API rate limits and breaking changes;
3PL carriers' API availability and event accuracy; campaign-day traffic from the
marketplaces themselves.</p>
<h3>1.5 Vision Statement</h3>
<div class="callout">
<p><strong>For</strong> the operations, warehouse and customer service teams of Nova Retail Group
<strong>who</strong> must fulfill orders arriving from four sales channels across three
fulfillment centers and four carriers,
<strong>the Order Management and Fulfillment System (OMFS)</strong> is a centralized
order management and fulfillment platform
<strong>that</strong> maintains a single, real-time view of inventory, routes and splits every
order automatically to the fulfillment center that can ship it fastest and
cheapest, and keeps order status accurate end-to-end without manual file uploads.
<strong>Unlike</strong> the current mix of spreadsheets, printed picking slips and per-carrier
web portals,
<strong>OMFS</strong> treats the order — not the channel and not the warehouse — as the unit of
work, so that inventory, routing, shipping and customer communication are driven
from one authoritative record.</p>
</div>
<h3>1.6 Business Risks</h3>
<table>
<thead>
<tr>
<th>ID</th>
<th>Risk</th>
<th>Severity</th>
<th>Probability</th>
<th>Mitigation</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>RI-1</strong></td>
<td>Marketplace APIs change or throttle without notice, breaking order ingestion or stock push</td>
<td>High</td>
<td>Medium</td>
<td>Build an anti-corruption adapter layer per channel; queue-and-retry with alerting; contractual notification with marketplace account managers</td>
</tr>
<tr>
<td><strong>RI-2</strong></td>
<td>Master SKU and inventory data are too dirty to migrate, so OMFS starts with an inaccurate stock picture and does not fix P1</td>
<td>High</td>
<td>High</td>
<td>Run a data quality audit and cleansing project <em>before</em> cutover; define acceptance thresholds for data migration</td>
</tr>
<tr>
<td><strong>RI-3</strong></td>
<td>FC staff resist abandoning paper slips, continuing to work around the system</td>
<td>Medium</td>
<td>Medium</td>
<td>Involve FC supervisors as product champions from elicitation onward; phased FC-by-FC rollout; scan-verify makes paper unnecessary rather than forbidden</td>
</tr>
<tr>
<td><strong>RI-4</strong></td>
<td>A 3PL carrier cannot or will not provide a usable label/tracking API</td>
<td>Medium</td>
<td>Medium</td>
<td>Verify API availability with all four carriers during Release 1.0 analysis; retain manual fallback for any carrier without an API, isolated behind the same internal interface</td>
</tr>
<tr>
<td><strong>RI-5</strong></td>
<td>Peak-day volume exceeds the system's designed throughput, causing a worse outage than the current manual process</td>
<td>High</td>
<td>Low</td>
<td>Explicit peak-load quality attributes; load testing at 1.5× the historical peak before the first campaign date</td>
</tr>
<tr>
<td><strong>RI-6</strong></td>
<td>Project cost or schedule overrun causes cancellation before Release 1.0 delivers measurable benefit</td>
<td>Medium</td>
<td>Medium</td>
<td>Release 1.0 scoped to the two highest-value objectives (BO-1, BO-2) only; features prioritized per the prioritization worksheet (Deliverable 7)</td>
</tr>
</tbody>
</table>
<h3>1.7 Business Assumptions and Dependencies</h3>
<p><strong>Assumptions</strong></p>
<ul>
<li>A1: All four marketplaces expose an order-retrieval and a stock-update API under NRG's existing seller agreements.</li>
<li>A2: NRG will continue to operate exactly three FCs for the duration of Release 1.0 and 1.1.</li>
<li>A3: Physical inventory counts in each FC are accurate to within 2% at the time of data migration.</li>
<li>A4: The existing web storefront will remain the customer-facing checkout; OMFS does not replace it.</li>
<li>A5: Warehouse staff have, or will be issued, handheld barcode scanners in all three FCs.</li>
</ul>
<p><strong>Dependencies</strong></p>
<ul>
<li>D1: API credentials and sandbox access from all four 3PL carriers, obtained by the NRG Logistics Manager.</li>
<li>D2: The existing ERP/accounting system must accept a daily posting of shipped-order financials.</li>
<li>D3: Network and Wi-Fi coverage adequate for handheld scanners throughout each FC (facilities project, tracked separately).</li>
<li>D4: Availability of the Cafeteria-of-record master data steward for 8 hours per week during requirements and migration.</li>
</ul>
<hr />
<h3>2. Scope and Limitations</h3>
<h3>2.1 Major Features</h3>
<table>
<thead>
<tr>
<th>ID</th>
<th>Feature</th>
<th>Addresses</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>FE-1</strong></td>
<td>Multi-channel order ingestion — pull and normalize orders from the storefront and all marketplaces into one order record</td>
<td>P2, P4</td>
</tr>
<tr>
<td><strong>FE-2</strong></td>
<td>Order screening and validation — address, payment and fraud checks before an order consumes stock</td>
<td>P1</td>
</tr>
<tr>
<td><strong>FE-3</strong></td>
<td>Real-time inventory and ATP (available-to-promise) management across FCs, with reservation on order acceptance</td>
<td>P1, BO-1</td>
</tr>
<tr>
<td><strong>FE-4</strong></td>
<td>Channel stock synchronization — push available quantities back to every sales channel on change</td>
<td>P1, BO-1</td>
</tr>
<tr>
<td><strong>FE-5</strong></td>
<td>Automated order routing and splitting — select the FC(s) that fulfill each order line by a configurable scoring rule</td>
<td>P2, BO-2, BO-3</td>
</tr>
<tr>
<td><strong>FE-6</strong></td>
<td>Pick wave generation and release — group routed orders into picking waves per FC</td>
<td>P2, BO-3</td>
</tr>
<tr>
<td><strong>FE-7</strong></td>
<td>Scan-verified pick and pack — handheld-driven picking with item verification and carton assignment</td>
<td>P2, BO-3</td>
</tr>
<tr>
<td><strong>FE-8</strong></td>
<td>Carrier rate shopping and label purchase — compare eligible carriers by cost and service level, then buy the label via API</td>
<td>P3, BO-5</td>
</tr>
<tr>
<td><strong>FE-9</strong></td>
<td>Carrier tracking event ingestion — receive and apply carrier status events automatically</td>
<td>P3, BO-4</td>
</tr>
<tr>
<td><strong>FE-10</strong></td>
<td>Customer notification and self-service order tracking</td>
<td>P4, BO-4</td>
</tr>
<tr>
<td><strong>FE-11</strong></td>
<td>Fulfillment exception management — backorder, split, short-ship and address-failure handling in one operator console</td>
<td>P1, P2</td>
</tr>
<tr>
<td><strong>FE-12</strong></td>
<td>Order cancellation and modification before dispatch</td>
<td>P1</td>
</tr>
<tr>
<td><strong>FE-13</strong></td>
<td>Returns and restocking (RMA)</td>
<td>—</td>
</tr>
<tr>
<td><strong>FE-14</strong></td>
<td>Fulfillment performance dashboard and 3PL invoice reconciliation</td>
<td>BO-5, all</td>
</tr>
</tbody>
</table>
<h3>2.2 Scope of Initial Release (Release 1.0)</h3>
<p>Release 1.0 targets <strong>BO-1 (oversell), BO-2 (routing automation) and BO-3 (cycle
time)</strong> — the objectives that unblock growth — and establishes the order record that
every later feature depends on.</p>
<p>Included: <strong>FE-1, FE-2, FE-3, FE-4, FE-5, FE-6, FE-7</strong>, plus manual label purchase
retained as-is.</p>
<p>Scope boundaries for Release 1.0:</p>
<ul>
<li>Storefront and Shopee channels only; Lazada and TikTok Shop follow in 1.1.</li>
<li>All three FCs from day one (routing is meaningless with one FC).</li>
<li>Routing rule configurable by an operations administrator, but with a single
  scoring formula; multi-formula per-brand routing is deferred.</li>
</ul>
<h3>2.3 Scope of Subsequent Releases</h3>
<table>
<thead>
<tr>
<th>Release</th>
<th>Target</th>
<th>Contents</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>1.1</strong></td>
<td>+3 months</td>
<td><strong>FE-8</strong> carrier rate shopping and API label purchase; <strong>FE-9</strong> automated tracking ingestion; remaining two marketplace channels (Lazada, TikTok Shop). Delivers BO-5 and the data needed for BO-4.</td>
</tr>
<tr>
<td><strong>1.2</strong></td>
<td>+6 months</td>
<td><strong>FE-10</strong> customer notification and self-service tracking; <strong>FE-11</strong> exception console. Delivers BO-4.</td>
</tr>
<tr>
<td><strong>2.0</strong></td>
<td>+12 months</td>
<td><strong>FE-13</strong> returns and restocking; <strong>FE-14</strong> dashboard and 3PL invoice reconciliation; per-brand routing formulas; supplier drop-ship as a virtual FC.</td>
</tr>
</tbody>
</table>
<h3>2.4 Limitations and Exclusions</h3>
<p>The following are explicitly <strong>not</strong> in scope for any release covered by this document:</p>
<ul>
<li><strong>EX-1</strong> OMFS does not replace the web storefront, its catalogue, pricing, promotions or checkout.</li>
<li><strong>EX-2</strong> OMFS does not replace the ERP/accounting system; it posts to it.</li>
<li><strong>EX-3</strong> OMFS is not a warehouse management system (WMS). It does not manage bin locations, putaway, cycle counting or labour scheduling inside an FC.</li>
<li><strong>EX-4</strong> OMFS does not manage procurement, purchase orders or inbound receiving.</li>
<li><strong>EX-5</strong> OMFS does not process payments. It reads authorization status from the payment gateway.</li>
<li><strong>EX-6</strong> OMFS does not provide demand forecasting or replenishment planning.</li>
<li><strong>EX-7</strong> Physical in-store (POS) orders and in-store pickup are out of scope for Releases 1.0–2.0.</li>
<li><strong>EX-8</strong> OMFS does not host a customer account portal; self-service tracking (FE-10) is reachable by order-specific link only.</li>
</ul>
<hr />
<h3>3. Business Context</h3>
<h3>3.1 Stakeholder Profiles</h3>
<table>
<thead>
<tr>
<th>Stakeholder</th>
<th>Major Value</th>
<th>Attitudes</th>
<th>Major Interests</th>
<th>Constraints</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Chief Operating Officer</strong> (project sponsor)</td>
<td>Growth no longer limited by fulfillment capacity</td>
<td>Strongly supportive; owns the business case</td>
<td>BO-1 and BO-3 above all; visible ROI within 2 quarters</td>
<td>Maximum budget USD 1.2M; Release 1.0 must land before the 11.11 campaign</td>
</tr>
<tr>
<td><strong>Fulfillment Manager</strong></td>
<td>Automated routing replaces daily judgement calls; visibility across all three FCs</td>
<td>Supportive but sceptical that software can route better than experienced staff</td>
<td>Routing rule must be inspectable and overridable; split-order handling</td>
<td>Cannot pause operations for cutover; no more than 4 hours' downtime</td>
</tr>
<tr>
<td><strong>Warehouse Operator</strong> (3 FCs, ~60 users)</td>
<td>No more sorting printed slips; scanner tells them what to pick</td>
<td>Cautious; fear of being measured and of a system that slows them down</td>
<td>Speed of the pick screen; works with gloves and on low-end handhelds</td>
<td>Low-end Android handhelds; intermittent Wi-Fi in FC aisles; shift-based, low tolerance for training</td>
</tr>
<tr>
<td><strong>Inventory Controller</strong></td>
<td>One authoritative stock figure instead of reconciling four</td>
<td>Highly receptive — this role exists only because of the current problem</td>
<td>Accuracy of ATP; auditability of every reservation and release</td>
<td>Must keep the legacy spreadsheet in parallel for the first month</td>
</tr>
<tr>
<td><strong>Customer Service Agent</strong> (~25 users)</td>
<td>Stops answering 560 WISMO tickets a day by hand</td>
<td>Very receptive</td>
<td>Accurate status on one screen; ability to answer without opening carrier portals</td>
<td>Deferred to Release 1.2; needs an interim read-only view in 1.0</td>
</tr>
<tr>
<td><strong>Brand Manager</strong> (5 brands)</td>
<td>Fewer cancellations, protected marketplace seller ratings</td>
<td>Interested but not engaged day-to-day</td>
<td>Per-brand fulfillment SLAs and reporting</td>
<td>Wants per-brand routing rules, deferred to 2.0</td>
</tr>
<tr>
<td><strong>Logistics Manager</strong></td>
<td>Carrier cost becomes a managed number instead of an operator preference</td>
<td>Supportive; owns BO-5</td>
<td>Rate shopping logic; invoice reconciliation</td>
<td>Carrier API access depends on contract renegotiation</td>
</tr>
<tr>
<td><strong>IT Operations / System Administrator</strong></td>
<td>Fewer manual file transfers to babysit</td>
<td>Neutral; concerned about another system to run</td>
<td>Monitoring, alerting, deployment and data retention</td>
<td>Must run on NRG's existing cloud tenancy and follow corporate security policy</td>
</tr>
<tr>
<td><strong>Customer</strong> (indirect)</td>
<td>Accurate delivery expectations; self-service tracking</td>
<td>Currently dissatisfied</td>
<td>Correct status; no cancellation after purchase</td>
<td>Not consulted directly; represented by Customer Service Agent as product champion</td>
</tr>
</tbody>
</table>
<h3>3.2 Project Priorities</h3>
<table>
<thead>
<tr>
<th>Dimension</th>
<th>Driver (state objective)</th>
<th>Constraint (state limits)</th>
<th>Degree of Freedom (state allowable range)</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Schedule</strong></td>
<td>Release 1.0 live and stable <strong>before the 11.11 campaign</strong></td>
<td>Hard date; the campaign will not move</td>
<td>—</td>
</tr>
<tr>
<td><strong>Features</strong></td>
<td>—</td>
<td>FE-1 … FE-7 are mandatory for Release 1.0</td>
<td>70–80% of high-priority features must ship in 1.0; medium and low priority may slip to 1.1</td>
</tr>
<tr>
<td><strong>Quality</strong></td>
<td>Oversell rate ≤ 0.5% is the acceptance criterion for the business case</td>
<td>Zero tolerance for lost or duplicated orders</td>
<td>90–95% of user acceptance tests must pass for Release 1.0; 95–98% for 1.1</td>
</tr>
<tr>
<td><strong>Staff</strong></td>
<td>—</td>
<td>Maximum team size is 1 PM, 3 BAs, 12 developers, 4 testers</td>
<td>BA count may vary between 2 and 3 during requirements work</td>
</tr>
<tr>
<td><strong>Cost</strong></td>
<td>—</td>
<td>Total project budget USD 1,200,000</td>
<td>Budget overrun up to 10% acceptable without sponsor review</td>
</tr>
</tbody>
</table>
<h3>3.3 Deployment Considerations</h3>
<ul>
<li><strong>Environment.</strong> OMFS is deployed to NRG's existing cloud tenancy. No new data centre or on-premises hardware is required, other than handheld scanners already covered by a separate facilities project (D3).</li>
<li><strong>Rollout strategy.</strong> FC-by-FC, starting with Da Nang (lowest volume, ~8% of orders) as the pilot, then Hanoi, then Ho Chi Minh City. Each FC runs OMFS in parallel with the legacy spreadsheet for its first two weeks, with the Inventory Controller reconciling daily.</li>
<li><strong>Channel strategy.</strong> Storefront first, then Shopee, in that order. A channel is cut over only after its stock-sync accuracy has been observed at ≥ 99.5% for five consecutive days.</li>
<li><strong>Cutover window.</strong> Maximum 4 hours of fulfillment downtime, scheduled on a Sunday night outside any campaign period.</li>
<li><strong>Data migration.</strong> Master SKU data and opening stock balances are migrated from the legacy spreadsheet after the cleansing project (RI-2). Historical orders are <strong>not</strong> migrated; the legacy records remain available read-only for 24 months.</li>
<li><strong>Training.</strong> Warehouse Operators require no classroom training — the scan-verify flow is designed to be learned at the handheld in under 15 minutes (see the usability quality attributes in the SRS). Fulfillment Managers and Inventory Controllers receive a half-day workshop per FC.</li>
<li><strong>Support.</strong> Standard NRG IT service desk, with an elevated on-call rota covering the first 30 days after each FC cutover and every campaign date.</li>
<li><strong>Back-out plan.</strong> For the first two weeks of each FC's cutover, the legacy spreadsheet process remains executable, so an FC can revert within one shift.</li>
</ul></div>
<div class="ml-vi"><h2>Tài liệu Vision and Scope</h2>
<h2>cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên nhóm trưởng&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Nova Retail Group (NRG)
17 tháng 9 năm 2026</p>
<hr />
<h3>Lịch sử sửa đổi</h3>
<table>
<thead>
<tr>
<th>Người</th>
<th>Ngày</th>
<th>Lý do sửa</th>
<th>Phiên bản</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Bản nháp đầu sau vòng khai thác yêu cầu thứ 1</td>
<td>0.9</td>
</tr>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Bản cơ sở được người tài trợ dự án duyệt</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Yêu cầu nghiệp vụ</h3>
<h3>1.1 Bối cảnh</h3>
<p>Nova Retail Group (NRG) là một công ty bán lẻ đa nhãn hàng, vận hành năm nhãn tiêu dùng
trải trên thời trang, đồ gia dụng và chăm sóc cá nhân, với khoảng 12.000 SKU đang hoạt
động. Tới năm 2024, NRG chủ yếu là doanh nghiệp bán tại cửa hàng, với một kho duy nhất ở
Thành phố Hồ Chí Minh và một storefront nhỏ trên web dùng chủ yếu như một cuốn catalogue.</p>
<p>Trong 24 tháng qua, NRG mở rộng mạnh sang bán hàng trực tuyến. Hiện họ bán qua <strong>bốn kênh
bán</strong> — storefront của chính mình cộng ba sàn TMĐT (Shopee, Lazada, TikTok Shop) — và vận
hành <strong>ba trung tâm hoàn tất đơn (FC)</strong> ở TP.HCM, Hà Nội và Đà Nẵng, giao hàng qua <strong>bốn
hãng logistics bên thứ ba (3PL)</strong> (GHN, GHTK, Viettel Post, J&amp;T Express).</p>
<p>Phía hướng tới khách hàng của cuộc mở rộng này đã thành công: storefront xử lý tốt việc
duyệt hàng, khuyến mãi và thanh toán, còn sản lượng đơn trung bình mỗi ngày tăng từ khoảng
600 lên <strong>4.500 đơn/ngày</strong>, đỉnh gần <strong>18.000 đơn/ngày</strong> vào các ngày chiến dịch (9.9,
11.11, 12.12).</p>
<p>Khối vận hành phía sau thì không lớn theo kịp. Việc hoàn tất đơn vẫn được điều phối y như
hồi NRG chỉ có một kho và một kênh: một bảng tính cho tồn kho, phiếu nhặt hàng in ra, và
việc tải dữ liệu lên hãng vận chuyển bằng tay. Mỗi kênh, mỗi FC và mỗi hãng mới đều được
chắp thêm vào cái quy trình thủ công đó chứ không được tích hợp vào một hệ thống. Ban lãnh
đạo NRG đã nhận ra rằng nút thắt của tăng trưởng bây giờ là khâu vận hành hoàn tất đơn,
không phải nhu cầu thị trường.</p>
<h3>1.2 Cơ hội nghiệp vụ</h3>
<p>Khối vận hành hoàn tất đơn của NRG đang phân mảnh và thiếu phối hợp. Bốn vấn đề cụ thể
nổi trội:</p>
<p><strong>P1 — Tồn kho không được đồng bộ theo thời gian thực.</strong> Số tồn được đẩy từ bảng tính của
kho sang từng kênh theo lô, hai lần mỗi ngày. Giữa hai lô, cùng một đơn vị hàng vật lý có
thể được bán trên storefront và trên hai sàn. Đo trong quý 2 năm 2026, <strong>3,8% tổng số đơn
bị bán vượt tồn</strong> — khoảng 170 đơn mỗi ngày phải huỷ, hoãn hoặc đổi hàng. Các án phạt của
sàn với việc người bán tự huỷ đơn đã hai lần đẩy điểm người bán Shopee của NRG xuống dưới
ngưỡng Người bán Ưu tiên.</p>
<p><strong>P2 — Việc định tuyến đơn làm thủ công và không tối ưu.</strong> Nhân viên kho in mọi đơn ra,
chia phiếu bằng tay, và quyết định FC nào hoàn tất đơn nào dựa trên phán đoán cá nhân.
Không có logic định tuyến tự động, không xét tới độ phủ tồn kho, khoảng cách hay chi phí
vận chuyển, và không có khả năng tách một đơn ra nhiều FC. Riêng việc in và chia phiếu đã
ngốn của nhân viên khoảng <strong>6 giờ mỗi ngày</strong>, và đơn thường xuyên bị đẩy về một FC rồi FC
đó lại phải đặt hàng bù trong khi một FC khác đang có món đó trên kệ.</p>
<p><strong>P3 — Tích hợp 3PL là việc trao đổi tệp bằng tay.</strong> Nhãn vận chuyển được mua trên cổng
web của từng hãng, còn sự kiện theo dõi quay về dưới dạng tệp CSV mà một nhân viên vận
hành tải lên hai lần mỗi ngày. Vì vậy trạng thái đơn mà khách nhìn thấy trễ so với thực
tế vật lý tới <strong>12 giờ</strong>, và việc mua nhãn được làm trên hãng nào tuỳ theo người vận hành
thích hãng nào, chứ không theo chi phí hay mức dịch vụ.</p>
<p><strong>P4 — Bộ phận CSKH quá tải vì câu hỏi "đơn của tôi đâu" (WISMO).</strong> Vì trạng thái đã cũ
và không có trang tự tra cứu, <strong>62% trong khoảng 900 ticket hỗ trợ mỗi ngày là WISMO</strong> —
tức khoảng 560 ticket mỗi ngày mà một con người phải trả lời bằng cách mở ba cổng hãng vận
chuyển khác nhau.</p>
<p>Không gói phần mềm thương mại nào mà NRG đã đánh giá phủ được cả bốn kênh, cả ba FC và cả
bốn hãng vận chuyển Việt Nam mà không phải tuỳ biến nặng. Giải pháp được đề xuất là một Hệ
thống Quản lý Đơn hàng và Hoàn tất đơn tập trung, đặc tả quanh đúng mô hình vận hành thật
của NRG.</p>
<h3>1.3 Mục tiêu nghiệp vụ</h3>
<table>
<thead>
<tr>
<th>Mã</th>
<th>Mục tiêu nghiệp vụ</th>
<th>Mốc hiện tại (Q2 2026)</th>
<th>Mốc đích</th>
<th>Hạn</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>BO-1</strong></td>
<td>Giảm tỉ lệ bán vượt tồn bằng cách đồng bộ tồn kho giữa mọi kênh bán gần như thời gian thực</td>
<td>3,8% số đơn</td>
<td>≤ 0,5% số đơn</td>
<td>6 tháng sau bản 1.0</td>
</tr>
<tr>
<td><strong>BO-2</strong></td>
<td>Tự động hoá việc định tuyến đơn để con người can thiệp trở thành ngoại lệ, không còn là thông lệ</td>
<td>0% tự động</td>
<td>≥ 95% số đơn được định tuyến không cần chạm tay</td>
<td>3 tháng sau bản 1.0</td>
</tr>
<tr>
<td><strong>BO-3</strong></td>
<td>Rút ngắn thời gian từ lúc nhận đơn tới lúc xuất hàng</td>
<td>trung bình 26 giờ</td>
<td>trung bình ≤ 8 giờ</td>
<td>6 tháng sau bản 1.0</td>
</tr>
<tr>
<td><strong>BO-4</strong></td>
<td>Giảm lượng liên hệ WISMO nhờ trang tự tra cứu đơn hàng chính xác</td>
<td>~560 ticket/ngày</td>
<td>Giảm ≥ 60% (≤ 224 ticket/ngày)</td>
<td>6 tháng sau bản 1.0</td>
</tr>
<tr>
<td><strong>BO-5</strong></td>
<td>Giảm chi phí vận chuyển trung bình trên mỗi đơn nhờ so giá hãng vận chuyển tự động</td>
<td>38.000 VND/đơn</td>
<td>Giảm ≥ 12% (≤ 33.440 VND/đơn)</td>
<td>9 tháng sau bản 1.0</td>
</tr>
<tr>
<td><strong>BO-6</strong></td>
<td>Hấp thụ được đỉnh ngày chiến dịch mà không phải tăng nhân sự hoàn tất đơn</td>
<td>18.000 đơn/ngày cần 22 nhân sự thời vụ</td>
<td>20.000 đơn/ngày chỉ với nhân sự chính thức</td>
<td>Chiến dịch đầu tiên sau bản 1.0</td>
</tr>
</tbody>
</table>
<h3>1.4 Thước đo thành công</h3>
<table>
<thead>
<tr>
<th>Thước đo</th>
<th>Cách đo</th>
<th>Nguồn dữ liệu</th>
<th>Tần suất báo cáo</th>
</tr>
</thead>
<tbody>
<tr>
<td>Tỉ lệ bán vượt tồn</td>
<td>(Số đơn bị huỷ hoặc giao thiếu do không đủ hàng ÷ tổng số đơn) × 100</td>
<td>Bản ghi đơn hàng và ngoại lệ của OMFS</td>
<td>Hằng tuần</td>
</tr>
<tr>
<td>Tỉ lệ định tuyến tự động</td>
<td>(Số đơn được định tuyến mà người vận hành không ghi đè ÷ tổng số đơn) × 100</td>
<td>Nhật ký kiểm toán định tuyến của OMFS</td>
<td>Hằng tuần</td>
</tr>
<tr>
<td>Thời gian từ nhận đơn tới xuất hàng</td>
<td>Trung vị và trung bình số giờ từ lúc nhận đơn tới lúc hãng quét lấy hàng</td>
<td>Mốc thời gian của OMFS + sự kiện từ hãng vận chuyển</td>
<td>Hằng ngày</td>
</tr>
<tr>
<td>Tỉ trọng ticket WISMO</td>
<td>Số ticket gắn nhãn WISMO ÷ tổng số ticket hỗ trợ</td>
<td>Việc gắn nhãn ở bộ phận hỗ trợ</td>
<td>Hằng tuần</td>
</tr>
<tr>
<td>Chi phí vận chuyển mỗi đơn</td>
<td>Tổng hoá đơn 3PL ÷ số đơn đã giao, theo tháng</td>
<td>Đối soát hoá đơn 3PL</td>
<td>Hằng tháng</td>
</tr>
<tr>
<td>Độ tươi của thông tin theo dõi</td>
<td>Percentile 95 của độ trễ giữa thời điểm sự kiện của hãng và lúc OMFS cập nhật trạng thái</td>
<td>Nhật ký nhận sự kiện của OMFS</td>
<td>Hằng ngày</td>
</tr>
</tbody>
</table>
<p><strong>Những yếu tố ảnh hưởng lớn nhất tới thành công (nằm trong tầm kiểm soát của NRG):</strong>
chất lượng dữ liệu SKU gốc được chuyển vào OMFS; mức độ sẵn sàng của các giám sát FC
trong việc từ bỏ phiếu giấy; việc cung cấp kịp thời thông tin xác thực API của các hãng
vận chuyển.</p>
<p><strong>Những yếu tố ngoài tầm kiểm soát của NRG:</strong> hạn mức gọi và các thay đổi phá vỡ tương
thích của API các sàn; mức độ sẵn sàng và độ chính xác sự kiện của API các hãng 3PL;
lượng truy cập ngày chiến dịch từ chính các sàn.</p>
<h3>1.5 Vision Statement</h3>
<div class="callout">
<p><strong>Cho</strong> các đội vận hành, kho và chăm sóc khách hàng của Nova Retail Group
<strong>những người</strong> phải hoàn tất các đơn hàng đổ về từ bốn kênh bán, qua ba trung tâm hoàn
tất đơn và bốn hãng vận chuyển,
<strong>Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)</strong> là một nền tảng quản lý đơn hàng
và hoàn tất đơn tập trung
<strong>giúp</strong> duy trì một bức tranh tồn kho duy nhất theo thời gian thực, định tuyến và tách
mọi đơn một cách tự động về trung tâm giao được nhanh nhất và rẻ nhất, đồng thời giữ
trạng thái đơn chính xác từ đầu tới cuối mà không cần tải tệp bằng tay.
<strong>Khác với</strong> mớ hỗn hợp bảng tính, phiếu nhặt hàng in ra và cổng web của từng hãng vận
chuyển hiện nay,
<strong>OMFS</strong> coi <em>đơn hàng</em> — chứ không phải kênh bán, cũng không phải nhà kho — là đơn vị
công việc, để tồn kho, định tuyến, vận chuyển và liên lạc với khách đều được điều khiển
từ một bản ghi có thẩm quyền duy nhất.</p>
</div>
<h3>1.6 Rủi ro nghiệp vụ</h3>
<table>
<thead>
<tr>
<th>Mã</th>
<th>Rủi ro</th>
<th>Mức độ</th>
<th>Xác suất</th>
<th>Biện pháp giảm thiểu</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>RI-1</strong></td>
<td>API của sàn thay đổi hoặc bóp băng thông mà không báo trước, làm hỏng việc nhận đơn hoặc đẩy tồn kho</td>
<td>Cao</td>
<td>Trung bình</td>
<td>Dựng một lớp adapter chống ăn mòn cho từng kênh; xếp hàng và thử lại kèm cảnh báo; thoả thuận với account manager của sàn về việc thông báo trước</td>
</tr>
<tr>
<td><strong>RI-2</strong></td>
<td>Dữ liệu SKU gốc và tồn kho quá bẩn để chuyển đổi, khiến OMFS khởi đầu với bức tranh tồn kho sai và không sửa được P1</td>
<td>Cao</td>
<td>Cao</td>
<td>Chạy một đợt rà soát và làm sạch dữ liệu <em>trước</em> khi chuyển đổi; định nghĩa ngưỡng chấp nhận cho việc chuyển dữ liệu</td>
</tr>
<tr>
<td><strong>RI-3</strong></td>
<td>Nhân viên FC phản đối việc bỏ phiếu giấy, tiếp tục lách hệ thống</td>
<td>Trung bình</td>
<td>Trung bình</td>
<td>Đưa giám sát FC vào vai người bảo vệ sản phẩm ngay từ khâu khai thác yêu cầu; triển khai từng FC một; cơ chế quét xác nhận làm cho phiếu giấy trở nên không cần thiết chứ không phải bị cấm</td>
</tr>
<tr>
<td><strong>RI-4</strong></td>
<td>Một hãng 3PL không thể hoặc không chịu cung cấp API nhãn/theo dõi dùng được</td>
<td>Trung bình</td>
<td>Trung bình</td>
<td>Xác minh mức độ sẵn có của API với cả bốn hãng trong giai đoạn phân tích bản 1.0; giữ phương án thủ công cho hãng nào không có API, cô lập sau cùng một giao tiếp nội bộ</td>
</tr>
<tr>
<td><strong>RI-5</strong></td>
<td>Sản lượng ngày đỉnh vượt quá thông lượng thiết kế, gây ra sự cố còn tệ hơn quy trình thủ công hiện tại</td>
<td>Cao</td>
<td>Thấp</td>
<td>Đặt tường minh các thuộc tính chất lượng về tải đỉnh; thử tải ở mức 1,5 lần đỉnh lịch sử trước ngày chiến dịch đầu tiên</td>
</tr>
<tr>
<td><strong>RI-6</strong></td>
<td>Vượt chi phí hoặc trễ tiến độ dẫn tới huỷ dự án trước khi bản 1.0 mang lại lợi ích đo được</td>
<td>Trung bình</td>
<td>Trung bình</td>
<td>Phạm vi bản 1.0 chỉ nhắm hai mục tiêu giá trị nhất (BO-1, BO-2); các tính năng được xếp ưu tiên theo bảng tính ở Deliverable 7</td>
</tr>
</tbody>
</table>
<h3>1.7 Giả định và phụ thuộc nghiệp vụ</h3>
<p><strong>Giả định</strong></p>
<ul>
<li>A1: Cả bốn sàn đều mở API lấy đơn và API cập nhật tồn kho theo các thoả thuận người bán hiện có của NRG.</li>
<li>A2: NRG tiếp tục vận hành đúng ba FC trong suốt bản 1.0 và 1.1.</li>
<li>A3: Số kiểm kê tồn kho vật lý ở mỗi FC chính xác trong phạm vi sai số 2% tại thời điểm chuyển đổi dữ liệu.</li>
<li>A4: Storefront hiện có tiếp tục là nơi khách thanh toán; OMFS không thay thế nó.</li>
<li>A5: Nhân viên kho đã có, hoặc sẽ được cấp, máy quét mã vạch cầm tay ở cả ba FC.</li>
</ul>
<p><strong>Phụ thuộc</strong></p>
<ul>
<li>D1: Thông tin xác thực API và quyền truy cập môi trường thử từ cả bốn hãng 3PL, do Quản lý logistics của NRG lấy về.</li>
<li>D2: Hệ thống ERP/kế toán hiện có phải nhận được một lượt ghi sổ hằng ngày về tài chính của các đơn đã giao.</li>
<li>D3: Hạ tầng mạng và Wi-Fi đủ phủ cho máy quét cầm tay trong toàn bộ từng FC (là một dự án cơ sở vật chất, theo dõi riêng).</li>
<li>D4: Người quản lý dữ liệu gốc phải dành được 8 giờ mỗi tuần trong giai đoạn yêu cầu và chuyển đổi dữ liệu.</li>
</ul>
<hr />
<h3>2. Phạm vi và giới hạn</h3>
<h3>2.1 Các tính năng chính</h3>
<table>
<thead>
<tr>
<th>Mã</th>
<th>Tính năng</th>
<th>Giải quyết</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>FE-1</strong></td>
<td>Nhận đơn đa kênh — kéo về và chuẩn hoá đơn từ storefront và mọi sàn vào một bản ghi đơn hàng duy nhất</td>
<td>P2, P4</td>
</tr>
<tr>
<td><strong>FE-2</strong></td>
<td>Sàng lọc và kiểm tính hợp lệ của đơn — kiểm địa chỉ, thanh toán và gian lận trước khi đơn chiếm tồn kho</td>
<td>P1</td>
</tr>
<tr>
<td><strong>FE-3</strong></td>
<td>Quản lý tồn kho và ATP (available-to-promise) thời gian thực trên các FC, giữ tồn ngay khi nhận đơn</td>
<td>P1, BO-1</td>
</tr>
<tr>
<td><strong>FE-4</strong></td>
<td>Đồng bộ tồn kho ra các kênh — đẩy số lượng khả dụng trở lại mọi kênh bán mỗi khi có thay đổi</td>
<td>P1, BO-1</td>
</tr>
<tr>
<td><strong>FE-5</strong></td>
<td>Định tuyến và tách đơn tự động — chọn FC hoàn tất từng dòng đơn bằng một luật chấm điểm cấu hình được</td>
<td>P2, BO-2, BO-3</td>
</tr>
<tr>
<td><strong>FE-6</strong></td>
<td>Sinh và phát đợt nhặt hàng — gom các đơn đã định tuyến thành từng đợt nhặt theo FC</td>
<td>P2, BO-3</td>
</tr>
<tr>
<td><strong>FE-7</strong></td>
<td>Nhặt và đóng gói có quét xác nhận — nhặt hàng điều khiển bằng máy cầm tay, có xác minh món hàng và gán thùng</td>
<td>P2, BO-3</td>
</tr>
<tr>
<td><strong>FE-8</strong></td>
<td>So giá hãng vận chuyển và mua nhãn — so các hãng đủ điều kiện theo chi phí và mức dịch vụ, rồi mua nhãn qua API</td>
<td>P3, BO-5</td>
</tr>
<tr>
<td><strong>FE-9</strong></td>
<td>Nhận sự kiện theo dõi từ hãng vận chuyển — nhận và áp dụng trạng thái của hãng một cách tự động</td>
<td>P3, BO-4</td>
</tr>
<tr>
<td><strong>FE-10</strong></td>
<td>Thông báo cho khách và trang tự tra cứu đơn hàng</td>
<td>P4, BO-4</td>
</tr>
<tr>
<td><strong>FE-11</strong></td>
<td>Quản lý ngoại lệ hoàn tất đơn — xử lý đặt hàng bù, tách đơn, giao thiếu và lỗi địa chỉ trong một bảng điều khiển duy nhất</td>
<td>P1, P2</td>
</tr>
<tr>
<td><strong>FE-12</strong></td>
<td>Huỷ và sửa đơn trước khi xuất hàng</td>
<td>P1</td>
</tr>
<tr>
<td><strong>FE-13</strong></td>
<td>Trả hàng và nhập lại kho (RMA)</td>
<td>—</td>
</tr>
<tr>
<td><strong>FE-14</strong></td>
<td>Bảng điều khiển hiệu suất hoàn tất đơn và đối soát hoá đơn 3PL</td>
<td>BO-5, tất cả</td>
</tr>
</tbody>
</table>
<h3>2.2 Phạm vi bản phát hành đầu tiên (bản 1.0)</h3>
<p>Bản 1.0 nhắm tới <strong>BO-1 (bán vượt tồn), BO-2 (tự động định tuyến) và BO-3 (thời gian chu
kỳ)</strong> — những mục tiêu gỡ nút thắt tăng trưởng — đồng thời dựng lên bản ghi đơn hàng mà
mọi tính năng sau này đều phụ thuộc vào.</p>
<p>Bao gồm: <strong>FE-1, FE-2, FE-3, FE-4, FE-5, FE-6, FE-7</strong>, cộng với việc mua nhãn thủ công
giữ nguyên như hiện tại.</p>
<p>Ranh giới phạm vi của bản 1.0:</p>
<ul>
<li>Chỉ kênh storefront và Shopee; Lazada và TikTok Shop theo sau ở bản 1.1.</li>
<li>Cả ba FC ngay từ ngày đầu (định tuyến trở nên vô nghĩa nếu chỉ có một FC).</li>
<li>Luật định tuyến cấu hình được bởi quản trị viên vận hành, nhưng chỉ với một công thức
  chấm điểm duy nhất; việc định tuyến nhiều công thức theo từng nhãn hàng thì hoãn lại.</li>
</ul>
<h3>2.3 Phạm vi các bản phát hành tiếp theo</h3>
<table>
<thead>
<tr>
<th>Bản</th>
<th>Mốc</th>
<th>Nội dung</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>1.1</strong></td>
<td>+3 tháng</td>
<td><strong>FE-8</strong> so giá hãng vận chuyển và mua nhãn qua API; <strong>FE-9</strong> nhận thông tin theo dõi tự động; hai kênh sàn còn lại (Lazada, TikTok Shop). Đạt BO-5 và tạo ra dữ liệu cần cho BO-4.</td>
</tr>
<tr>
<td><strong>1.2</strong></td>
<td>+6 tháng</td>
<td><strong>FE-10</strong> thông báo cho khách và trang tự tra cứu; <strong>FE-11</strong> bảng xử lý ngoại lệ. Đạt BO-4.</td>
</tr>
<tr>
<td><strong>2.0</strong></td>
<td>+12 tháng</td>
<td><strong>FE-13</strong> trả hàng và nhập lại kho; <strong>FE-14</strong> bảng điều khiển và đối soát hoá đơn 3PL; công thức định tuyến theo từng nhãn; giao thẳng từ nhà cung cấp như một FC ảo.</td>
</tr>
</tbody>
</table>
<h3>2.4 Giới hạn và loại trừ</h3>
<p>Những mục sau đây tường minh <strong>không</strong> nằm trong phạm vi của bất kỳ bản phát hành nào mà
tài liệu này phủ tới:</p>
<ul>
<li><strong>EX-1</strong> OMFS không thay thế storefront trên web, catalogue, giá, khuyến mãi hay khâu thanh toán của nó.</li>
<li><strong>EX-2</strong> OMFS không thay thế hệ ERP/kế toán; nó chỉ ghi sổ sang đó.</li>
<li><strong>EX-3</strong> OMFS không phải hệ quản lý kho (WMS). Nó không quản lý vị trí ô kệ, việc xếp hàng vào kho, kiểm kê luân phiên hay xếp ca lao động bên trong một FC.</li>
<li><strong>EX-4</strong> OMFS không quản lý mua hàng, đơn đặt hàng nhà cung cấp hay việc nhận hàng vào kho.</li>
<li><strong>EX-5</strong> OMFS không xử lý thanh toán. Nó chỉ đọc trạng thái uỷ quyền từ cổng thanh toán.</li>
<li><strong>EX-6</strong> OMFS không cung cấp dự báo nhu cầu hay lập kế hoạch bổ sung hàng.</li>
<li><strong>EX-7</strong> Đơn tại cửa hàng (POS) và nhận hàng tại cửa hàng nằm ngoài phạm vi của các bản 1.0–2.0.</li>
<li><strong>EX-8</strong> OMFS không vận hành một cổng tài khoản cho khách; trang tự tra cứu (FE-10) chỉ vào được bằng một đường liên kết riêng cho từng đơn.</li>
</ul>
<hr />
<h3>3. Bối cảnh nghiệp vụ</h3>
<h3>3.1 Hồ sơ các bên liên quan</h3>
<table>
<thead>
<tr>
<th>Bên liên quan</th>
<th>Giá trị lớn nhất</th>
<th>Thái độ</th>
<th>Mối quan tâm chính</th>
<th>Ràng buộc</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Giám đốc vận hành (COO)</strong> (người tài trợ dự án)</td>
<td>Tăng trưởng không còn bị năng lực hoàn tất đơn giới hạn</td>
<td>Ủng hộ mạnh; sở hữu bài toán kinh doanh</td>
<td>BO-1 và BO-3 trên hết; ROI nhìn thấy được trong 2 quý</td>
<td>Ngân sách tối đa 1,2 triệu USD; bản 1.0 phải kịp trước chiến dịch 11.11</td>
</tr>
<tr>
<td><strong>Quản lý hoàn tất đơn</strong></td>
<td>Định tuyến tự động thay cho các phán đoán hằng ngày; nhìn xuyên suốt cả ba FC</td>
<td>Ủng hộ nhưng hoài nghi việc phần mềm định tuyến giỏi hơn nhân viên lâu năm</td>
<td>Luật định tuyến phải soi được và ghi đè được; cách xử lý đơn bị tách</td>
<td>Không thể dừng vận hành để chuyển đổi; tối đa 4 giờ ngưng hoạt động</td>
</tr>
<tr>
<td><strong>Nhân viên kho</strong> (3 FC, ~60 người dùng)</td>
<td>Không còn phải chia phiếu in; máy quét bảo họ nhặt gì</td>
<td>Dè dặt; sợ bị đo lường và sợ một hệ thống làm mình chậm đi</td>
<td>Tốc độ của màn hình nhặt hàng; dùng được khi đeo găng và trên máy cầm tay đời thấp</td>
<td>Máy Android cầm tay đời thấp; Wi-Fi chập chờn trong các lối đi FC; làm theo ca, ít chịu được đào tạo dài</td>
</tr>
<tr>
<td><strong>Kiểm soát tồn kho</strong></td>
<td>Một con số tồn kho có thẩm quyền thay vì phải đối chiếu bốn nguồn</td>
<td>Rất tiếp nhận — vai trò này tồn tại chỉ vì chính vấn đề hiện tại</td>
<td>Độ chính xác của ATP; khả năng kiểm toán từng lượt giữ và nhả tồn</td>
<td>Phải duy trì bảng tính cũ chạy song song trong tháng đầu</td>
</tr>
<tr>
<td><strong>Nhân viên CSKH</strong> (~25 người dùng)</td>
<td>Thôi phải trả lời 560 ticket WISMO mỗi ngày bằng tay</td>
<td>Rất tiếp nhận</td>
<td>Trạng thái chính xác trên một màn hình; trả lời được mà không cần mở cổng hãng vận chuyển</td>
<td>Hoãn sang bản 1.2; cần một màn hình chỉ-đọc tạm thời ở bản 1.0</td>
</tr>
<tr>
<td><strong>Quản lý nhãn hàng</strong> (5 nhãn)</td>
<td>Ít lần huỷ đơn hơn, điểm người bán trên sàn được bảo vệ</td>
<td>Quan tâm nhưng không tham gia hằng ngày</td>
<td>SLA hoàn tất đơn và báo cáo theo từng nhãn</td>
<td>Muốn có luật định tuyến riêng theo nhãn, đã hoãn sang bản 2.0</td>
</tr>
<tr>
<td><strong>Quản lý logistics</strong></td>
<td>Chi phí hãng vận chuyển trở thành một con số được quản lý thay vì sở thích của người vận hành</td>
<td>Ủng hộ; sở hữu BO-5</td>
<td>Logic so giá; việc đối soát hoá đơn</td>
<td>Quyền truy cập API của hãng phụ thuộc vào việc đàm phán lại hợp đồng</td>
</tr>
<tr>
<td><strong>Vận hành CNTT / Quản trị hệ thống</strong></td>
<td>Bớt được các lượt chuyển tệp thủ công phải trông chừng</td>
<td>Trung lập; lo phải vận hành thêm một hệ thống nữa</td>
<td>Giám sát, cảnh báo, triển khai và lưu trữ dữ liệu</td>
<td>Phải chạy trên hạ tầng đám mây sẵn có của NRG và theo chính sách an ninh của tập đoàn</td>
</tr>
<tr>
<td><strong>Khách hàng</strong> (gián tiếp)</td>
<td>Kỳ vọng giao hàng chính xác; tự tra cứu được</td>
<td>Hiện đang bất mãn</td>
<td>Trạng thái đúng; không bị huỷ đơn sau khi đã mua</td>
<td>Không được hỏi ý trực tiếp; do Nhân viên CSKH đại diện với vai trò người bảo vệ sản phẩm</td>
</tr>
</tbody>
</table>
<h3>3.2 Ưu tiên dự án</h3>
<table>
<thead>
<tr>
<th>Chiều</th>
<th>Động lực (nêu mục tiêu)</th>
<th>Ràng buộc (nêu giới hạn)</th>
<th>Bậc tự do (nêu khoảng cho phép)</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Tiến độ</strong></td>
<td>Bản 1.0 chạy thật và ổn định <strong>trước chiến dịch 11.11</strong></td>
<td>Đây là mốc cứng; chiến dịch sẽ không dời</td>
<td>—</td>
</tr>
<tr>
<td><strong>Tính năng</strong></td>
<td>—</td>
<td>FE-1 … FE-7 là bắt buộc cho bản 1.0</td>
<td>70–80% số tính năng ưu tiên cao phải ra ở bản 1.0; loại ưu tiên trung bình và thấp có thể dời sang 1.1</td>
</tr>
<tr>
<td><strong>Chất lượng</strong></td>
<td>Tỉ lệ bán vượt tồn ≤ 0,5% là tiêu chí chấp nhận của bài toán kinh doanh</td>
<td>Tuyệt đối không chấp nhận mất đơn hay nhân đôi đơn</td>
<td>90–95% số phép kiểm chấp nhận của người dùng phải đạt cho bản 1.0; 95–98% cho bản 1.1</td>
</tr>
<tr>
<td><strong>Nhân sự</strong></td>
<td>—</td>
<td>Quy mô nhóm tối đa là 1 PM, 3 BA, 12 lập trình viên, 4 kiểm thử viên</td>
<td>Số BA có thể dao động từ 2 tới 3 trong giai đoạn làm yêu cầu</td>
</tr>
<tr>
<td><strong>Chi phí</strong></td>
<td>—</td>
<td>Tổng ngân sách dự án 1.200.000 USD</td>
<td>Vượt ngân sách tới 10% vẫn chấp nhận được mà không cần người tài trợ xem lại</td>
</tr>
</tbody>
</table>
<h3>3.3 Cân nhắc khi triển khai</h3>
<ul>
<li><strong>Môi trường.</strong> OMFS được triển khai lên hạ tầng đám mây sẵn có của NRG. Không cần trung tâm dữ liệu mới hay phần cứng đặt tại chỗ, ngoài các máy quét cầm tay vốn đã nằm trong một dự án cơ sở vật chất riêng (D3).</li>
<li><strong>Chiến lược triển khai.</strong> Lần lượt từng FC, bắt đầu từ Đà Nẵng (sản lượng thấp nhất, ~8% số đơn) làm nơi thí điểm, rồi tới Hà Nội, rồi TP.HCM. Mỗi FC chạy OMFS song song với bảng tính cũ trong hai tuần đầu, với Kiểm soát tồn kho đối chiếu hằng ngày.</li>
<li><strong>Chiến lược theo kênh.</strong> Storefront trước, rồi tới Shopee, theo đúng thứ tự đó. Một kênh chỉ được chuyển hẳn sang sau khi độ chính xác đồng bộ tồn kho của nó được quan sát ở mức ≥ 99,5% trong năm ngày liên tiếp.</li>
<li><strong>Cửa sổ chuyển đổi.</strong> Tối đa 4 giờ ngưng hoạt động hoàn tất đơn, xếp vào tối Chủ nhật, ngoài mọi giai đoạn chiến dịch.</li>
<li><strong>Chuyển đổi dữ liệu.</strong> Dữ liệu SKU gốc và số dư tồn kho đầu kỳ được chuyển từ bảng tính cũ sau khi hoàn thành đợt làm sạch (RI-2). Đơn hàng lịch sử <strong>không</strong> được chuyển; bản ghi cũ vẫn đọc được trong 24 tháng.</li>
<li><strong>Đào tạo.</strong> Nhân viên kho không cần đào tạo trên lớp — luồng quét xác nhận được thiết kế để học ngay trên máy cầm tay trong dưới 15 phút (xem các thuộc tính chất lượng về khả dụng trong SRS). Quản lý hoàn tất đơn và Kiểm soát tồn kho được tập huấn nửa ngày tại từng FC.</li>
<li><strong>Hỗ trợ.</strong> Dùng bộ phận hỗ trợ CNTT tiêu chuẩn của NRG, kèm lịch trực nâng cao phủ 30 ngày đầu sau khi mỗi FC chuyển đổi và phủ mọi ngày chiến dịch.</li>
<li><strong>Phương án lùi.</strong> Trong hai tuần đầu chuyển đổi của mỗi FC, quy trình bảng tính cũ vẫn chạy được, nên một FC có thể quay lại trong vòng một ca làm việc.</li>
</ul></div>`,
  ].join('\n'),
};

const TP2L2 = {
  title: "W2.2 — Deliverable 2: 14 use case specifications (full)|||W2.2 — Deliverable 2: 14 đặc tả use case (đầy đủ)",
  slug: "swr302-tp2-goi-02-use-cases",
  type: 'DOCUMENT',
  description: "Trọn 14 đặc tả use case theo template 15 dòng của Chapter 8, cộng danh sách use case, bảng actor và bảng quan hệ include/extend. Mỗi use case đều có ít nhất một exception — chỗ nhóm yếu hay bỏ trống.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP2 · Deliverable 2</span>
<h2>Fourteen use cases, written out in full</h2>
<p class="lead">The brief asks for at least ten. There are fourteen here for a reason: deliverable 7 asks you to <em>prioritize</em>, and a list in which everything is mandatory cannot be prioritized.</p>
<p>Read UC-03 <em>Reserve inventory</em> first. It is the use case that actually solves the problem in the brief, and it shows the three things a grader looks for:</p>
<ul>
<li><strong>A postcondition that forbids a half-finished state.</strong> POST-1 says every line is reserved or none is. That single sentence is what makes the use case implementable.</li>
<li><strong>Exceptions, plural.</strong> Four of them, including a concurrency conflict. A use case with only a happy path describes a world that does not exist.</li>
<li><strong>Business rules by ID only.</strong> BR-01, BR-02, BR-04, BR-07, BR-08, BR-17 — never the rule text. Copying rule text into three documents guarantees they disagree by Week 8.</li>
</ul>
<div class="callout warn"><strong>Notice the flow numbering.</strong> Normal flow is <code>X.0</code>, alternatives are <code>X.Y</code>, exceptions are <code>X.Y.EZ</code>. It is the Chapter 8 convention and it is free marks — an exception numbered <code>3.0.E2</code> tells the reader exactly where in the normal flow it can occur.</div>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP2 · Deliverable 2</span>
<h2>Mười bốn use case, viết đủ</h2>
<p class="lead">Đề chỉ đòi ít nhất mười. Ở đây có mười bốn vì một lý do: deliverable 7 bắt bạn <em>xếp ưu tiên</em>, mà một danh sách toàn thứ bắt buộc thì không xếp ưu tiên được.</p>
<p>Hãy đọc UC-03 <em>Giữ chỗ tồn kho</em> trước. Đó là use case thực sự giải quyết vấn đề trong đề, và nó thể hiện đúng ba thứ người chấm tìm:</p>
<ul>
<li><strong>Postcondition cấm trạng thái dở dang.</strong> POST-1 nói mọi dòng đều được giữ chỗ hoặc không dòng nào cả. Đúng một câu đó làm use case này hiện thực được.</li>
<li><strong>Ngoại lệ, số nhiều.</strong> Bốn cái, kể cả tranh chấp đồng thời. Use case chỉ có luồng thuận là mô tả một thế giới không tồn tại.</li>
<li><strong>Business rule chỉ ghi ID.</strong> BR-01, BR-02, BR-04, BR-07, BR-08, BR-17 — không bao giờ ghi nội dung rule. Chép nội dung rule vào ba tài liệu là bảo đảm tới tuần 8 chúng mâu thuẫn nhau.</li>
</ul>
<div class="callout warn"><strong>Để ý cách đánh số luồng.</strong> Luồng chính là <code>X.0</code>, thay thế là <code>X.Y</code>, ngoại lệ là <code>X.Y.EZ</code>. Đó là quy ước chương 8 và là điểm cho không — một ngoại lệ đánh số <code>3.0.E2</code> nói với người đọc chính xác nó xảy ra ở đâu trong luồng chính.</div>`,
    ),
    `<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/SWR302/v1/assignment-tp2/001.webp" alt="📐 Figure B-3 — OMFS use case diagram · 14 use cases · 12 actors · 8 «include» · 4 «extend»" loading="lazy" width="1620" height="1020" /><p class="chu-thich">📐 <strong>Figure B-3</strong> — OMFS use case diagram · 14 use cases · 12 actors · 8 «include» · 4 «extend»</p></div>`,
    `<div class="ml-en"><h2>Use Cases</h2>
<h2>for the Order Management and Fulfillment System (OMFS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Team Leader name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Nova Retail Group (NRG)
17 September 2026</p>
<hr />
<h3>Revision History</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Date</th>
<th>Reason For Changes</th>
<th>Version</th>
</tr>
</thead>
<tbody>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Initial use case list from elicitation sessions 1–3</td>
<td>0.9</td>
</tr>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>All 14 specifications completed and cross-reviewed</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Actors</h3>
<h3>1.1 Primary actors</h3>
<table>
<thead>
<tr>
<th>Actor</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Warehouse Operator</strong></td>
<td>Picks and packs orders inside a fulfillment center using a handheld scanner. ~60 users across 3 FCs.</td>
</tr>
<tr>
<td><strong>Fulfillment Manager</strong></td>
<td>Owns throughput for one or more FCs. Releases pick waves, resolves exceptions, overrides routing decisions.</td>
</tr>
<tr>
<td><strong>Inventory Controller</strong></td>
<td>Owns stock accuracy. Configures safety stock, audits reservations, investigates discrepancies.</td>
</tr>
<tr>
<td><strong>Customer Service Agent</strong></td>
<td>Answers customer contacts. Cancels, modifies and initiates returns on the customer's behalf. ~25 users.</td>
</tr>
<tr>
<td><strong>Logistics Manager</strong></td>
<td>Owns carrier relationships and shipping cost. Configures carrier eligibility and reconciles 3PL invoices.</td>
</tr>
<tr>
<td><strong>Brand Manager</strong></td>
<td>Owns one of five brands. Consumes fulfillment reporting; does not operate the system daily.</td>
</tr>
<tr>
<td><strong>System Administrator</strong></td>
<td>Configures channels, fulfillment centers, users and routing parameters.</td>
</tr>
<tr>
<td><strong>Customer</strong></td>
<td>The buyer. Interacts with OMFS <strong>only</strong> through the self-service tracking page (UC-09).</td>
</tr>
</tbody>
</table>
<h3>1.2 Secondary actors (external systems)</h3>
<table>
<thead>
<tr>
<th>Actor</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Sales Channel</strong></td>
<td>The web storefront or a marketplace (Shopee, Lazada, TikTok Shop). Source of orders, destination of stock updates.</td>
</tr>
<tr>
<td><strong>3PL Carrier</strong></td>
<td>GHN, GHTK, Viettel Post or J&amp;T Express. Provides rates, labels and tracking events over an API.</td>
</tr>
<tr>
<td><strong>Payment Gateway</strong></td>
<td>Holds payment authorization status for an order. Read-only from the OMFS side.</td>
</tr>
<tr>
<td><strong>Notification Service</strong></td>
<td>Sends email and SMS to customers on behalf of OMFS.</td>
</tr>
</tbody>
</table>
<div class="callout">
<p><strong>Why the ERP / accounting system is not listed as an actor.</strong> It receives a daily posting of shipped-order financials, but it participates in none of the fourteen use cases — nothing an actor does starts it and nothing it does appears in a flow. It is therefore specified as a <strong>software interface in SRS §5.2</strong>, not as a use case actor. Listing a system as an actor when it appears in no flow is a traceability defect, so it is deliberately excluded here.</p>
</div>
<hr />
<h3>2. Use Case List</h3>
<table>
<thead>
<tr>
<th>ID</th>
<th>Primary Actor</th>
<th>Secondary Actor</th>
<th>Use Case name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>UC-01</td>
<td>Sales Channel</td>
<td>—</td>
<td>Ingest an order from a sales channel</td>
<td>Retrieve a new order from any channel and normalize it into a single OMFS order record</td>
</tr>
<tr>
<td>UC-02</td>
<td>OMFS (time)</td>
<td>Payment Gateway</td>
<td>Screen and validate an order</td>
<td>Check address, payment authorization and fraud signals before the order consumes stock</td>
</tr>
<tr>
<td>UC-03</td>
<td>OMFS (event)</td>
<td>—</td>
<td>Reserve inventory</td>
<td>Hold available-to-promise stock for every order line, or mark the order backordered</td>
</tr>
<tr>
<td>UC-04</td>
<td>OMFS (event)</td>
<td>Fulfillment Manager</td>
<td>Route and split an order</td>
<td>Select the fulfillment center(s) that will ship each line, by a configurable scoring rule</td>
</tr>
<tr>
<td>UC-05</td>
<td>Fulfillment Manager</td>
<td>—</td>
<td>Generate and release a pick wave</td>
<td>Group routed orders into a picking wave for one FC and release it to the floor</td>
</tr>
<tr>
<td>UC-06</td>
<td>Warehouse Operator</td>
<td>—</td>
<td>Pick and pack with scan verification</td>
<td>Pick each item against the handheld, verify by barcode, and assign items to cartons</td>
</tr>
<tr>
<td>UC-07</td>
<td>OMFS (event)</td>
<td>3PL Carrier</td>
<td>Rate-shop carriers and purchase a label</td>
<td>Compare eligible carriers on cost and service level, then buy the label via API</td>
</tr>
<tr>
<td>UC-08</td>
<td>3PL Carrier</td>
<td>Notification Service</td>
<td>Ingest a carrier tracking event</td>
<td>Receive a carrier status event and apply it to the shipment and order</td>
</tr>
<tr>
<td>UC-09</td>
<td>Customer</td>
<td>—</td>
<td>Track an order (self-service)</td>
<td>Let the customer see current, accurate order and shipment status without contacting support</td>
</tr>
<tr>
<td>UC-10</td>
<td>Fulfillment Manager</td>
<td>Inventory Controller</td>
<td>Handle a fulfillment exception</td>
<td>Resolve backorder, split-failure, short-ship and address-failure exceptions from one console</td>
</tr>
<tr>
<td>UC-11</td>
<td>Customer Service Agent</td>
<td>Sales Channel</td>
<td>Cancel or modify an order before dispatch</td>
<td>Cancel or change an order while it can still be stopped, releasing any reserved stock</td>
</tr>
<tr>
<td>UC-12</td>
<td>Customer Service Agent</td>
<td>Warehouse Operator</td>
<td>Process a return and restock</td>
<td>Authorize a return, receive it, inspect it, and restock or quarantine the item</td>
</tr>
<tr>
<td>UC-13</td>
<td>OMFS (event)</td>
<td>Sales Channel</td>
<td>Synchronize stock levels to sales channels</td>
<td>Push changed available quantities to every channel that sells the SKU</td>
</tr>
<tr>
<td>UC-14</td>
<td>Fulfillment Manager</td>
<td>—</td>
<td>View the fulfillment performance dashboard</td>
<td>Monitor throughput, cycle time, exception volume and shipping cost against targets</td>
</tr>
</tbody>
</table>
<div class="callout">
<p><strong>Traceability to Vision &amp; Scope features:</strong> UC-01→FE-1 · UC-02→FE-2 · UC-03→FE-3 · UC-04→FE-5 · UC-05→FE-6 · UC-06→FE-7 · UC-07→FE-8 · UC-08→FE-9 · UC-09→FE-10 · UC-10→FE-11 · UC-11→FE-12 · UC-12→FE-13 · UC-13→FE-4 · UC-14→FE-14</p>
</div>
<hr />
<h3>3. Use Case Specifications</h3>
<h3>UC-01 — Ingest an order from a sales channel</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-01 — Ingest an order from a sales channel</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Sales Channel (system)</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>A new order reaches "paid" or "placed" state on a sales channel, or the scheduled polling interval (60 s) elapses.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>OMFS retrieves new orders from each connected sales channel and converts each one into a single normalized OMFS order record, regardless of the channel's own data format. This is the entry point of the entire fulfillment lifecycle.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The sales channel is registered in OMFS and marked Active. <br> PRE-2: Valid API credentials for the channel are stored and not expired.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: Exactly one OMFS order exists for the channel order, with status Pending. <br> POST-2: Every order line references a SKU that exists in the item master, or the order is held in the Unmapped SKU queue. <br> POST-3: The channel order ID and OMFS order ID are linked, so re-ingesting the same channel order creates no duplicate.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>1.0</strong> <br> 1. The system requests orders created since the last successful ingestion watermark from the channel. <br> 2. The channel returns a set of orders. <br> 3. For each order, the system maps channel fields to the OMFS order structure (customer, ship-to address, lines, totals, payment method). <br> 4. The system resolves each channel SKU to an OMFS SKU using the channel SKU mapping table. <br> 5. The system creates the order with status Pending and records the channel order ID. <br> 6. The system advances the ingestion watermark. <br> 7. The system raises an order-created event that triggers UC-02.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>1.1 — Manual re-ingestion.</strong> At step 1, a System Administrator requests re-ingestion of a specific channel order ID; the system fetches that single order and continues from step 3. <br> <strong>1.2 — Backfill after outage.</strong> At step 1, the watermark is older than 1 hour; the system pages through the channel's order list in batches of 100 and continues from step 3 for each batch.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>1.0.E1 — Channel unreachable.</strong> At step 1 the channel API does not respond or returns 5xx. The system retries with exponential backoff up to 5 attempts, does not advance the watermark, and raises an integration alert after the final failure. No partial state is written. <br> <strong>1.0.E2 — Unmapped SKU.</strong> At step 4 a channel SKU has no mapping. The system creates the order with status Held-Unmapped, places it in the Unmapped SKU queue for the Inventory Controller, and does <strong>not</strong> raise the order-created event. <br> <strong>1.0.E3 — Duplicate order.</strong> At step 5 the channel order ID already exists in OMFS. The system logs the duplicate and discards it without creating a second order. <br> <strong>1.0.E4 — Malformed order.</strong> At step 3 a mandatory field (ship-to address, at least one line) is missing. The system creates the order with status Held-Invalid and raises a data-quality exception for UC-10.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>4,500 orders/day average; 18,000/day peak. Polling runs every 60 seconds per channel, 4 channels.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-16</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>Ingestion must be idempotent: the same channel order processed twice must produce one OMFS order (POST-3). If the process fails between steps 5 and 6, the next run re-reads the same window and relies on POST-3 to avoid duplication. Channel-specific field mapping is configuration, not code, so a new channel can be added without a release.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>All four channels expose an order-retrieval API that supports filtering by creation timestamp.</td>
</tr>
</tbody>
</table>
<h3>UC-02 — Screen and validate an order</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-02 — Screen and validate an order</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>OMFS (system, event-driven)</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>An order-created event is raised by UC-01.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Before an order is allowed to consume stock, OMFS verifies that the shipping address is deliverable, the payment is authorized (or the order is cash-on-delivery), and the order does not match a fraud pattern. Screening before reservation is what prevents stock being held for orders that will never ship.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The order exists with status Pending. <br> PRE-2: The order has at least one line and a ship-to address.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: The order status is Validated, or Held-Review, or Cancelled — never left in Pending. <br> POST-2: Every screening decision is recorded with its reason code and timestamp.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>2.0</strong> <br> 1. The system normalizes the ship-to address and verifies the postcode is serviceable by at least one carrier. <br> 2. The system reads payment authorization status from the payment gateway. <br> 3. The system evaluates the fraud ruleset (order value, address–payment mismatch, velocity from the same customer). <br> 4. All three checks pass; the system sets the order status to Validated. <br> 5. The system raises a validated event that triggers UC-03.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>2.1 — Cash on delivery.</strong> At step 2 the payment method is COD; the system skips the authorization check and continues at step 3. <br> <strong>2.2 — Agent override.</strong> From Held-Review, a Customer Service Agent reviews the order, records a justification, and releases it; the system sets status Validated and continues at step 5.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>2.0.E1 — Undeliverable address.</strong> At step 1 no carrier serves the postcode. The system sets status Held-Review with reason ADDRESS_UNSERVICEABLE and raises an exception for UC-10. <br> <strong>2.0.E2 — Payment not authorized.</strong> At step 2 the gateway reports declined or pending. The system sets status Held-Review with reason PAYMENT_NOT_AUTHORIZED and does not reserve stock. <br> <strong>2.0.E3 — Payment gateway unavailable.</strong> At step 2 the gateway does not respond. The system retries for up to 5 minutes, then sets status Held-Review with reason PAYMENT_UNKNOWN. It does <strong>not</strong> assume authorization. <br> <strong>2.0.E4 — Fraud rule triggered.</strong> At step 3 a fraud rule matches. The system sets status Held-Review with reason FRAUD_REVIEW and notifies the Customer Service queue.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>Once per order — 4,500/day average, 18,000/day peak.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-03, BR-04</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>Screening must complete within 30 seconds of the order-created event under normal load, because every second before reservation is a second in which the same stock can be sold again. If the use case fails after step 4 but before step 5, a recovery job re-raises the validated event; UC-03 is idempotent per order so no double reservation occurs.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>The payment gateway exposes an authorization-status query that does not itself capture funds.</td>
</tr>
</tbody>
</table>
<h3>UC-03 — Reserve inventory</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-03 — Reserve inventory</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>OMFS (system, event-driven)</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>A validated event is raised by UC-02.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>OMFS computes available-to-promise per SKU per fulfillment center and places a hold on the stock needed by every line of the order. <strong>This is the mechanism that solves overselling</strong>: stock is committed at the moment of order acceptance, not at the moment of picking.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The order status is Validated. <br> PRE-2: Every SKU on the order exists in the item master.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: Either every line holds a reservation and the order status is Reserved, or no line holds a reservation and the order status is Backordered. A partially reserved order is never left in that state. <br> POST-2: Each reservation records SKU, fulfillment center, quantity, creation time and expiry time. <br> POST-3: A stock-changed event is raised for every affected SKU, triggering UC-13.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>3.0</strong> <br> 1. The system computes ATP per SKU per fulfillment center using BR-07. <br> 2. For each line, the system selects the fulfillment center with the highest ATP that satisfies the full line quantity. <br> 3. The system reserves the requested quantity at that fulfillment center. <br> 4. The system sets the reservation expiry to 30 minutes from creation (BR-04). <br> 5. The system sets order status to Reserved. <br> 6. The system raises a stock-changed event per SKU and a reserved event that triggers UC-04.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>3.1 — Split reservation.</strong> At step 2 no single fulfillment center holds full ATP for a line, but the total across centers does. The system reserves the line across up to three centers (BR-08), flags the order as Split-Required for UC-04, and continues at step 4. <br> <strong>3.2 — Re-reservation after release.</strong> The order is in Backordered state and inbound stock arrives; a stock-changed event re-enters this use case at step 1 for that order only.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>3.0.E1 — Insufficient total ATP.</strong> At step 1 the total ATP across all fulfillment centers is less than the ordered quantity for at least one line. The system reserves nothing for the whole order, sets status Backordered, and raises an exception for UC-10. <br> <strong>3.0.E2 — Split limit exceeded.</strong> In flow 3.1 a line would need more than three fulfillment centers (BR-08). The system reserves nothing, sets status Backordered with reason SPLIT_LIMIT, and raises an exception for UC-10. <br> <strong>3.0.E3 — Reservation expired.</strong> Thirty minutes elapse without payment confirmation (BR-04). The system releases every reservation on the order, reverts status to Pending, and raises a stock-changed event per SKU. <br> <strong>3.0.E4 — Concurrent reservation conflict.</strong> At step 3 another order reserves the same units first. The system re-reads ATP and retries from step 1, up to 3 attempts, then follows 3.0.E1.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>Once per validated order — 4,500/day average, 18,000/day peak, with bursts of up to 60 reservations/second during campaign flash sales.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-01, BR-02, BR-04, BR-07, BR-08, BR-17</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>Reservation must be <strong>atomic per order</strong> (POST-1). If the process fails mid-way, every reservation already placed for that order is rolled back; the order returns to Validated and is retried. Reservation is the highest-contention operation in the system and drives the concurrency quality attributes in SRS §6.2.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Physical stock counts at migration are accurate to within 2%; a larger error would make ATP wrong from day one regardless of this logic.</td>
</tr>
</tbody>
</table>
<h3>UC-04 — Route and split an order</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-04 — Route and split an order across fulfillment centers</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>OMFS (system, event-driven)</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>A reserved event is raised by UC-03, or a Fulfillment Manager requests re-routing of an order.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>OMFS decides which fulfillment center ships which lines, splitting the order into one shipment per center where necessary. It scores each candidate center on stock coverage, distance to the customer, expected shipping cost and current center workload, then picks the highest score. <strong>This replaces the manual printing and sorting of order slips.</strong></td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The order status is Reserved. <br> PRE-2: At least one fulfillment center is Open and within its daily capacity.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: The order is decomposed into one or more shipments, each assigned to exactly one fulfillment center (BR-01). <br> POST-2: The routing decision records the score of every candidate center and the winning reason, so it can be explained and audited. <br> POST-3: The order status is Routed.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>4.0</strong> <br> 1. The system retrieves the reservations placed by UC-03 and groups lines by the center holding their stock. <br> 2. For each candidate grouping, the system computes the routing score using BR-06. <br> 3. The system selects the grouping with the highest score. <br> 4. The system checks the selected center against its remaining daily capacity and the 14:00 dispatch cut-off (BR-10). <br> 5. The system creates one shipment per fulfillment center in the winning grouping. <br> 6. The system records the full score table against the order (POST-2). <br> 7. The system sets order status to Routed and raises a routed event that triggers UC-05.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>4.1 — Single-center order.</strong> At step 1 all lines are reserved at one center; the system skips scoring and creates one shipment, continuing at step 6. <br> <strong>4.2 — Manual override.</strong> A Fulfillment Manager opens the routing workbench, reviews the score table, selects a different center, and records a reason. The system re-creates the shipments accordingly and marks the order Manually-Routed (BR-19). <br> <strong>4.3 — Re-route after capacity change.</strong> A center is closed by the System Administrator; every Routed order not yet picked at that center re-enters this use case at step 1.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>4.0.E1 — All centers at capacity.</strong> At step 4 every candidate center has exhausted its daily capacity. The system holds the order with status Routing-Deferred and re-attempts at the next capacity window; if the promised delivery date is at risk (BR-09) it raises an exception for UC-10. <br> <strong>4.0.E2 — Split exceeds limit.</strong> At step 3 the winning grouping needs more than three shipments (BR-08). The system raises an exception for UC-10 rather than creating the shipments. <br> <strong>4.0.E3 — Routing configuration invalid.</strong> At step 2 the routing weights do not sum to 1.0 or a weight is missing. The system falls back to nearest-center-with-stock, logs a configuration alert, and marks the decision Fallback-Routed.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>Once per reserved order — 4,500/day average, 18,000/day peak. Re-routing: ~20/day.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-01, BR-06, BR-08, BR-09, BR-10, BR-19</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>The routing weights in BR-06 are configuration, adjustable by the Fulfillment Manager without a release; per-brand weight sets are deferred to Release 2.0. POST-2 exists because the Fulfillment Manager stated they will not trust an automated decision they cannot inspect — the score table is a requirement, not a debugging aid.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Distance between a fulfillment center and a destination postcode is available from a static lookup table maintained by the Logistics Manager.</td>
</tr>
</tbody>
</table>
<h3>UC-05 — Generate and release a pick wave</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-05 — Generate and release a pick wave</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Fulfillment Manager</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>The Fulfillment Manager starts a wave, or the scheduled wave timer fires (hourly, and at the 14:00 cut-off).</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Routed shipments waiting at a fulfillment center are grouped into a pick wave — a batch of work released to the floor together — so that operators walk the warehouse once for many orders instead of once per order.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: At least one shipment at this fulfillment center has status Routed. <br> PRE-2: The Fulfillment Manager is authenticated and assigned to this fulfillment center.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: Every shipment in the released wave has status Picking and is linked to the wave. <br> POST-2: A shipment belongs to at most one open wave.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>5.0</strong> <br> 1. The Fulfillment Manager selects a fulfillment center and wave criteria (carrier cut-off, service level, order age, maximum wave size). <br> 2. The system lists the matching Routed shipments with a count and estimated pick time. <br> 3. The Fulfillment Manager confirms the wave. <br> 4. The system creates the wave, assigns every selected shipment to it, and sets their status to Picking. <br> 5. The system generates the pick list, sorted by storage location to minimise walking distance. <br> 6. The system makes the wave available to handheld devices at that fulfillment center.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>5.1 — Automatic wave.</strong> The scheduled timer fires; the system applies the saved default criteria and executes steps 2, 4, 5, 6 without human confirmation. <br> <strong>5.2 — Priority wave.</strong> The Fulfillment Manager marks the wave Priority; the system places it at the head of every handheld queue. <br> <strong>5.3 — Cancel a wave.</strong> Before any item in the wave is picked, the Fulfillment Manager cancels it; every shipment returns to Routed.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>5.0.E1 — Shipment already in a wave.</strong> At step 4 a selected shipment was added to another wave concurrently (POST-2). The system excludes it, completes the wave with the remaining shipments, and reports the exclusion. <br> <strong>5.0.E2 — Stock not found at pick time.</strong> Handled in UC-06, not here, but the wave remains open until every shipment reaches a terminal state. <br> <strong>5.0.E3 — Wave exceeds maximum size.</strong> At step 3 the selection exceeds the configured maximum. The system creates multiple waves rather than one oversized wave, and tells the manager how many.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>~12 waves per fulfillment center per day; 36/day across three centers. More on campaign days.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-10, BR-13</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>Pick-list sequence is a throughput lever, not a cosmetic choice: it is the single largest contributor to the order-to-ship objective BO-3 inside the warehouse. Bin-level optimisation belongs to a WMS and is explicitly out of scope (EX-3); OMFS sorts by the coarse storage location recorded against each SKU.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Each SKU carries one coarse storage location per fulfillment center, maintained by warehouse staff.</td>
</tr>
</tbody>
</table>
<h3>UC-06 — Pick and pack with scan verification</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-06 — Pick and pack with scan verification</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Warehouse Operator</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>The Warehouse Operator opens the next task from the released wave on a handheld device.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>The operator is directed to each item in turn, scans it to prove the correct item was taken, and assigns picked items to cartons. Scanning replaces the printed slip and is what removes the manual sorting step entirely.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The operator is authenticated on a handheld assigned to this fulfillment center. <br> PRE-2: An open wave with unfinished tasks exists at this fulfillment center.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: Every line of the shipment is picked and verified, or the shipment carries a short-pick exception. <br> POST-2: On completion, the shipment status is Packed and its carton list, weight and dimensions are recorded. <br> POST-3: Picked quantities are deducted from on-hand stock and their reservations are released (the stock has now left).</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>6.0</strong> <br> 1. The system presents the next pick task: SKU, description, image, quantity and storage location. <br> 2. The operator goes to the location and scans the item barcode. <br> 3. The system verifies the scanned barcode matches the expected SKU and confirms the pick. <br> 4. Steps 1–3 repeat until every line of the shipment is picked. <br> 5. The operator scans a carton label to open a carton and assigns picked items to it. <br> 6. The operator enters or scans the carton weight. <br> 7. The system sets the shipment status to Packed and raises a packed event that triggers UC-07.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>6.1 — Multi-carton shipment.</strong> At step 5 the operator opens additional cartons; the system records the item-to-carton assignment for each. <br> <strong>6.2 — Substitute location.</strong> At step 2 the item is found at a different location; the operator scans the item and confirms the alternative location, and the system records a location correction for the Inventory Controller. <br> <strong>6.3 — Hand off mid-wave.</strong> The operator ends their shift; unfinished tasks return to the wave queue for another operator.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>6.0.E1 — Wrong item scanned.</strong> At step 3 the barcode does not match the expected SKU. The system rejects the pick, shows the expected item, and does not advance. Three consecutive mismatches escalate the task to the Fulfillment Manager. <br> <strong>6.0.E2 — Short pick.</strong> At step 2 the physical quantity is less than required. The operator records the quantity actually found; the system creates a short-pick exception for UC-10, adjusts on-hand stock to the counted quantity, and raises a stock-changed event. <br> <strong>6.0.E3 — Item damaged.</strong> The operator marks the item damaged; the system moves that quantity to damaged stock (which BR-07 excludes from ATP) and treats the line as a short pick per 6.0.E2. <br> <strong>6.0.E4 — Handheld loses connectivity.</strong> The device queues scans locally and replays them on reconnection. Scans are idempotent per task, so a replayed scan does not double-deduct stock.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>4,500 shipments/day average, 18,000/day peak; ~2.3 lines per shipment, so ~10,000 scans/day average.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-07, BR-13, BR-17</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>The pick screen must be usable one-handed, with gloves, on a low-end Android handheld, and must tolerate intermittent Wi-Fi (6.0.E4) — these are the Warehouse Operator's stated constraints and they drive the usability and offline quality attributes in SRS §6.1. POST-3 is the point at which reserved stock becomes shipped stock; getting this wrong double-counts inventory.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Every sellable SKU carries a scannable barcode. SKUs without one are handled by manual confirmation with supervisor approval.</td>
</tr>
</tbody>
</table>
<h3>UC-07 — Rate-shop carriers and purchase a shipping label</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-07 — Rate-shop carriers and purchase a shipping label</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 3</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>OMFS (system, event-driven)</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>A packed event is raised by UC-06.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>For a packed shipment, OMFS determines which carriers can actually deliver it, compares them on landed cost and service level, selects one, and buys the label through the carrier's API. <strong>This replaces buying labels by hand in four separate carrier portals</strong> and is what delivers the shipping-cost objective BO-5.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The shipment status is Packed with recorded weight and dimensions. <br> PRE-2: At least one carrier is configured Active with valid API credentials.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: The shipment carries exactly one purchased label with a tracking number, or it carries a labelling exception. <br> POST-2: The quoted rates from every eligible carrier are stored against the shipment for later invoice reconciliation. <br> POST-3: The shipment status is Labelled and the order status is updated.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>7.0</strong> <br> 1. The system determines carrier eligibility for the destination postcode, weight and dimensions (BR-11). <br> 2. The system requests a rate quote from each eligible carrier in parallel. <br> 3. The system computes the landed cost for each quote using BR-12. <br> 4. The system selects the cheapest carrier that meets the order's promised delivery date. <br> 5. The system requests a label from the selected carrier and receives a tracking number and label document. <br> 6. The system stores all quotes (POST-2), the purchased label and the tracking number. <br> 7. The system sets the shipment status to Labelled and notifies the customer via UC-09.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>7.1 — Preferred carrier.</strong> The Logistics Manager has pinned a carrier for a destination region; the system uses it if eligible, skipping steps 3–4, and records the reason PREFERRED. <br> <strong>7.2 — Expedited order.</strong> The order carries an express service level; at step 4 the system selects the fastest carrier meeting the date, not the cheapest, and records the reason SERVICE_LEVEL. <br> <strong>7.3 — Reprint.</strong> A Warehouse Operator reports a damaged label; the system re-prints the same label without purchasing a new one.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>7.0.E1 — No eligible carrier.</strong> At step 1 no carrier serves the destination or the parcel exceeds every carrier's limits. The system raises a labelling exception for UC-10 and leaves the shipment Packed. <br> <strong>7.0.E2 — All quotes fail.</strong> At step 2 every carrier API errors or times out. The system retries for up to 10 minutes, then raises an exception for UC-10; the shipment remains Packed and is never left in a half-labelled state. <br> <strong>7.0.E3 — Label purchase fails after a successful quote.</strong> At step 5 the chosen carrier rejects the label request. The system excludes that carrier and retries from step 4 with the next-best quote, up to three carriers, then follows 7.0.E2. <br> <strong>7.0.E4 — Duplicate label.</strong> The label request succeeds but the response is lost. On retry the system queries the carrier for an existing label against the shipment reference before purchasing again, so a shipment never carries two paid labels (POST-1).</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>Medium — deferred to Release 1.1</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>Once per shipment — ~4,900/day average (orders plus splits), ~19,500/day peak.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-11, BR-12</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>Rate shopping is only as good as the weight and dimensions captured in UC-06 step 6; systematically under-recorded weights produce carrier invoice adjustments that wipe out the 12% saving, which is why POST-2 stores the quotes for reconciliation. Until Release 1.1, labels continue to be bought manually in the carrier portals and the tracking number is entered by hand.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>All four carriers expose rating and label-purchase APIs. Any carrier without one is handled by the manual fallback behind the same internal interface.</td>
</tr>
</tbody>
</table>
<h3>UC-08 — Ingest a carrier tracking event</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-08 — Ingest a carrier tracking event</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 3</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>3PL Carrier (system)</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>A carrier pushes a webhook event for a tracked shipment, or the polling interval (15 min) elapses for carriers without webhooks.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>OMFS receives carrier scan events — collected, in transit, out for delivery, delivered, failed — and applies them to the shipment and its order automatically. <strong>This replaces the twice-daily manual CSV upload</strong> and is what makes self-service tracking (UC-09) worth offering.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The shipment has a tracking number issued in UC-07. <br> PRE-2: The shipment has not yet reached a terminal status (Delivered, Returned, Lost).</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: The event is stored against the shipment with the carrier's own event timestamp and the OMFS receipt timestamp, so lag can be measured (success metric for BO-4). <br> POST-2: The shipment status reflects the most recent event by <strong>carrier timestamp</strong>, not by arrival order. <br> POST-3: An out-of-order or duplicate event never moves a shipment backwards.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>8.0</strong> <br> 1. The system receives the event and authenticates the carrier. <br> 2. The system resolves the tracking number to a shipment. <br> 3. The system maps the carrier's own status code to the OMFS status vocabulary. <br> 4. The system compares the event timestamp with the latest stored event. <br> 5. The event is newer; the system stores it and updates the shipment status. <br> 6. If the new status is customer-visible, the system requests a notification via the Notification Service. <br> 7. If the status is Delivered, the system closes the shipment and, when all of an order's shipments are delivered, closes the order.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>8.1 — Polling carrier.</strong> At step 1 the system polls the carrier for all open shipments instead of receiving a push, then continues from step 2 for each returned event. <br> <strong>8.2 — Bulk backfill.</strong> After an outage, the system requests all events since the last watermark and processes them in carrier-timestamp order.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>8.0.E1 — Unknown tracking number.</strong> At step 2 no shipment matches. The system stores the event in an orphan queue for 30 days and raises an alert if the orphan count exceeds a threshold — it does not discard it, because it usually means a label was bought outside OMFS. <br> <strong>8.0.E2 — Unmapped carrier status.</strong> At step 3 the carrier sends a code OMFS does not recognise. The system stores the raw event, leaves the shipment status unchanged, and raises a configuration alert. <br> <strong>8.0.E3 — Out-of-order event.</strong> At step 4 the event is older than the stored latest. The system stores it for the audit trail but does not change the shipment status (POST-3). <br> <strong>8.0.E4 — Delivery failed.</strong> The carrier reports a failed delivery attempt. The system sets the shipment to Delivery-Exception and raises an exception for UC-10. <br> <strong>8.0.E5 — Carrier silent.</strong> No event for a shipment for 48 hours after collection. A monitor raises a stalled-shipment exception for UC-10.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>Medium — deferred to Release 1.1</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>~6 events per shipment; ~29,000 events/day average, ~117,000/day peak.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-09</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>POST-2 matters more than it looks. Carriers deliver events late and out of order; ordering by arrival time makes an order appear to move from Delivered back to In Transit, which generates exactly the WISMO contacts this project exists to remove. The 15-minute p95 ingestion target in SRS §6.2 is the success metric for BO-4.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>At least three of the four carriers support webhooks; the remainder are polled.</td>
</tr>
</tbody>
</table>
<h3>UC-09 — Track an order (customer self-service)</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-09 — Track an order (customer self-service)</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 3</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Customer</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>The customer opens the tracking link sent by email or SMS, or a Customer Service Agent opens the same view from a contact.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>The customer sees the current, accurate status of their order and each of its shipments without contacting anyone. <strong>This is the use case that delivers BO-4 — a 60% reduction in WISMO contacts</strong> — and it only works because UC-08 keeps status fresh.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The order exists and has been validated. <br> PRE-2: The request carries a valid, order-specific tracking token.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: No customer data beyond the single order referenced by the token is disclosed. <br> POST-2: The view access is logged, so self-service usage can be measured against the WISMO objective.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>9.0</strong> <br> 1. The customer opens the tracking link. <br> 2. The system validates the token and resolves the order. <br> 3. The system displays the order summary, each shipment, its carrier and tracking number, its current status and the event history. <br> 4. The system displays the estimated delivery date per shipment. <br> 5. The customer optionally follows the carrier's own tracking link for carrier-side detail.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>9.1 — Split order.</strong> At step 3 the order has multiple shipments; the system shows each separately with its own carrier and status, and explains that the order was split. <br> <strong>9.2 — Agent view.</strong> A Customer Service Agent opens the same order from the support console and additionally sees internal exception details not shown to the customer. <br> <strong>9.3 — Pre-dispatch order.</strong> The order has no shipment yet; the system shows the order-level status (Validated, Reserved, Routed, Picking) in customer-friendly wording rather than a blank page.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>9.0.E1 — Invalid or expired token.</strong> At step 2 the token fails validation. The system shows a generic "link not valid" page and does <strong>not</strong> reveal whether the order exists. <br> <strong>9.0.E2 — Order cancelled.</strong> The order was cancelled; the system shows the cancellation and its date, not an error. <br> <strong>9.0.E3 — Carrier status stale.</strong> The last carrier event is older than 48 hours; the system shows the last known status with its timestamp and an explicit "no update since" note rather than implying current knowledge.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>Medium — deferred to Release 1.2</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>Assumed 35% of orders viewed at least once, ~1.8 views each: ~2,800 views/day average.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-09</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>This is the only customer-facing surface in OMFS and the only one exposed to the public internet, so the token model in PRE-2/POST-1 is a security requirement, not a convenience: guessing another customer's token must be infeasible (SRS §6.3). No login is required by design (EX-8) — requiring one would push customers back to the support queue. Exception 9.0.E3 is deliberate honesty: pretending to know is what destroys trust in a tracking page.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Customers receive the tracking link at dispatch by email or SMS through the Notification Service.</td>
</tr>
</tbody>
</table>
<h3>UC-10 — Handle a fulfillment exception</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-10 — Handle a fulfillment exception</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 3</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Fulfillment Manager</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>Any use case raises an exception, or the Fulfillment Manager opens the exception console.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Every failure in the fulfillment lifecycle — backorder, split limit, short pick, no eligible carrier, delivery failure, stalled shipment — surfaces in one queue with the resolution options appropriate to its type. Without this, exceptions are invisible until a customer complains.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The user is authenticated with the Fulfillment Manager or Inventory Controller role. <br> PRE-2: At least one open exception exists.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: Every exception ends in a recorded resolution with an actor, a timestamp and a reason — never silently disappears. <br> POST-2: The affected order or shipment is left in a valid, consistent state.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>10.0</strong> <br> 1. The manager opens the console; the system lists open exceptions sorted by age and delivery-date risk (BR-09). <br> 2. The manager selects an exception; the system shows the order, the cause, and the resolution options valid for that exception type. <br> 3. The manager selects a resolution. <br> 4. The system applies it, updating the order or shipment. <br> 5. The system records the resolution, the actor and the reason (POST-1). <br> 6. The system closes the exception and re-enters the lifecycle at the appropriate use case.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>10.1 — Backorder resolution.</strong> Options: wait for inbound stock, source from another center by re-running UC-04, substitute a SKU with customer consent, or cancel the line via UC-11. <br> <strong>10.2 — Short pick.</strong> Options: re-pick at another location, re-route the line to another center, ship short and refund the difference, or cancel the line. <br> <strong>10.3 — No eligible carrier.</strong> Options: repack into smaller cartons and re-run UC-07, book a manual courier outside OMFS and record the tracking number, or cancel. <br> <strong>10.4 — Delivery failure or stalled shipment.</strong> Options: request re-delivery, redirect to a pickup point, or open a claim with the carrier. <br> <strong>10.5 — Bulk resolution.</strong> The manager selects several exceptions of the same type and cause and applies one resolution to all of them.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>10.0.E1 — Resolution no longer valid.</strong> At step 4 the underlying state changed (stock arrived, the order was already cancelled). The system rejects the resolution, refreshes the exception, and asks the manager to choose again. <br> <strong>10.0.E2 — Resolution partially applied.</strong> The system applies resolutions transactionally; if any step fails, nothing is applied and the exception stays open (POST-2). <br> <strong>10.0.E3 — Exception ages beyond its SLA.</strong> An exception open longer than its configured SLA is escalated to the Fulfillment Manager's supervisor and flagged on the dashboard (UC-14).</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>Medium — deferred to Release 1.2; until then exceptions are worked from a report</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>Assumed ~4% of orders raise at least one exception: ~180/day average, ~720/day peak.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-05, BR-09, BR-13</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>The resolution options are deliberately <strong>type-specific</strong> (10.1–10.4): a generic "reassign / cancel / ignore" console pushes the real decision back onto the manager's memory, which is the manual process this project is replacing. POST-1 makes the exception log the source of the root-cause analysis that should, over time, reduce exception volume.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Substituting a SKU requires customer consent obtained by a Customer Service Agent outside OMFS.</td>
</tr>
</tbody>
</table>
<h3>UC-11 — Cancel or modify an order before dispatch</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-11 — Cancel or modify an order before dispatch</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 3</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Customer Service Agent</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>A customer contacts support to cancel or change an order, or the marketplace pushes a cancellation.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>An order can be stopped or changed while it is still stoppable. The cut-off is the moment the shipping label is purchased (BR-05) — after that the parcel is a carrier's responsibility and the correct path is a return (UC-12). Cancelling must release reserved stock, or the oversell problem simply reappears in another form.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The order exists and is not yet Labelled. <br> PRE-2: The agent is authenticated with the Customer Service Agent role.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: All reservations for cancelled lines are released and a stock-changed event is raised per SKU (triggering UC-13). <br> POST-2: The cancellation or modification is reflected back to the originating sales channel. <br> POST-3: The change is recorded with actor, timestamp and reason.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>11.0</strong> <br> 1. The agent locates the order and opens it. <br> 2. The system shows the order, its current status, and which actions are still permitted at that status (BR-05). <br> 3. The agent selects Cancel whole order. <br> 4. The system asks for a cancellation reason. <br> 5. The system releases every reservation on the order and raises a stock-changed event per SKU. <br> 6. The system cancels any open shipment and removes it from its wave. <br> 7. The system sets the order status to Cancelled and notifies the sales channel and the customer.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>11.1 — Cancel one line.</strong> At step 3 the agent cancels a single line; the system releases only that line's reservation and re-runs UC-04 for the remaining lines, since routing may now differ. <br> <strong>11.2 — Change quantity.</strong> The agent reduces a line quantity; the system releases the difference and continues at step 6. Increasing a quantity is not supported — it is a new order. <br> <strong>11.3 — Change shipping address.</strong> The agent edits the address before labelling; the system re-validates it via UC-02 step 1 and re-runs UC-04, because routing depends on destination. <br> <strong>11.4 — Channel-initiated cancellation.</strong> The marketplace pushes a cancellation; the system executes steps 5–7 without an agent and skips the channel notification in step 7.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>11.0.E1 — Order already labelled.</strong> At step 2 the order is Labelled or later. The system refuses the cancellation (BR-05), explains why, and offers to start a return under UC-12 instead. <br> <strong>11.0.E2 — Marketplace forbids modification.</strong> At step 3 the order came from a channel whose policy forbids post-acceptance modification (BR-16). The system permits cancellation but refuses modification, and says which channel rule applies. <br> <strong>11.0.E3 — Picking already started.</strong> The shipment is Picking. The system flags the order for immediate stop, notifies the fulfillment center, and holds the cancellation as Pending-Stop until the center confirms; only then are reservations released. <br> <strong>11.0.E4 — Channel notification fails.</strong> At step 7 the channel API errors. The cancellation stands in OMFS and the channel notification is queued for retry; the order is never left cancelled in one system and open in the other without an alert.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>Medium</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>Assumed 2.5% of orders: ~110/day average, ~450/day peak.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-05, BR-16</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>11.0.E3 is the genuinely hard case and was the subject of elicitation session 4: between the wave release and the label purchase, the physical world is ahead of the system. The chosen answer — a two-phase stop confirmed by the fulfillment center — was preferred by the Fulfillment Manager over an optimistic cancel that risks shipping a cancelled order.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Refunds are issued by the finance team in the payment gateway; OMFS records that a refund is due but does not move money (EX-5).</td>
</tr>
</tbody>
</table>
<h3>UC-12 — Process a return and restock</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-12 — Process a return and restock (RMA)</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 3</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Customer Service Agent</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>A customer requests a return, or a carrier returns an undeliverable parcel to the fulfillment center.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>A return is authorized, the goods come back, they are inspected, and stock is either put back on the shelf or quarantined. Restocking matters to this project because returned units that never re-enter ATP are invisible stock — which pushes the oversell rate the wrong way.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The order contains at least one delivered line. <br> PRE-2: The return is requested within the return window (BR-14).</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: Every returned unit ends in exactly one of: restocked to sellable, quarantined, or written off. <br> POST-2: Restocked units appear in ATP and a stock-changed event is raised (triggering UC-13). <br> POST-3: The return outcome is recorded against the original order line.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>12.0</strong> <br> 1. The agent opens the delivered order and selects the lines to return. <br> 2. The system checks the return window (BR-14) and creates an RMA with a return authorization number. <br> 3. The system issues return instructions and, where the carrier supports it, a return label. <br> 4. The customer sends the goods back; the carrier delivers them to the fulfillment center. <br> 5. A Warehouse Operator scans the RMA number and the returned items. <br> 6. The operator inspects each item and records the outcome: sellable, damaged or missing. <br> 7. For sellable items the system increases on-hand stock and raises a stock-changed event (BR-15). For damaged items it moves the quantity to quarantine. <br> 8. The system closes the RMA and records that a refund is due.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>12.1 — Carrier-returned undeliverable parcel.</strong> The parcel comes back without a customer request; the system creates the RMA automatically at step 5 when the operator scans the original shipment label, and continues from step 6. <br> <strong>12.2 — Partial return.</strong> The customer returns fewer items than authorized; the system records the discrepancy and closes the RMA for the received quantity only. <br> <strong>12.3 — Exchange.</strong> The agent creates a replacement order linked to the RMA; the replacement follows the normal lifecycle from UC-02.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>12.0.E1 — Return window expired.</strong> At step 2 the delivery date is outside the window (BR-14). The system refuses to create the RMA and shows the delivery date and the window; a supervisor may override with a recorded reason. <br> <strong>12.0.E2 — Goods never arrive.</strong> The RMA is open longer than 30 days after authorization. The system closes it as Not-Received and raises no refund. <br> <strong>12.0.E3 — Unidentifiable return.</strong> At step 5 the parcel carries no readable RMA or shipment reference. The operator records it in the unidentified-returns queue for the Customer Service Agent rather than guessing an order. <br> <strong>12.0.E4 — Quantity mismatch.</strong> The received quantity exceeds the authorized quantity. The system accepts the authorized quantity and raises an exception for UC-10 for the excess.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>Low — deferred to Release 2.0</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>Assumed 6% of delivered orders: ~270 RMAs/day average.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-14, BR-15</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>Inspection (step 6) is a human judgement that OMFS records rather than makes. The one rule the system does enforce is BR-15: a damaged item must not silently return to sellable stock. Refund execution is out of scope (EX-5); OMFS records the obligation and the finance team acts on it.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Each fulfillment center has a designated returns receiving area and a quarantine location.</td>
</tr>
</tbody>
</table>
<h3>UC-13 — Synchronize stock levels to sales channels</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-13 — Synchronize stock levels to sales channels</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>OMFS (system, event-driven)</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>A stock-changed event is raised by UC-03, UC-06, UC-11 or UC-12, or the reconciliation timer fires (hourly).</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Whenever the sellable quantity of a SKU changes for any reason, OMFS pushes the new figure to every channel that sells it. Together with reservation in UC-03, this is what closes the oversell gap: reservation stops the double sale, synchronization stops the channel offering stock that no longer exists.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The SKU is mapped to at least one Active sales channel. <br> PRE-2: The channel's API credentials are valid.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: Every Active channel selling the SKU has been sent the current sellable quantity, or a sync failure is recorded for that channel and SKU. <br> POST-2: The sent quantity and the send timestamp are recorded per channel and SKU, so drift can be detected.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>13.0</strong> <br> 1. The system receives a stock-changed event for a SKU. <br> 2. The system computes the sellable quantity to publish: total ATP across all Open fulfillment centers (BR-07), less any channel-specific buffer. <br> 3. The system determines which Active channels sell the SKU. <br> 4. The system batches updates per channel to stay inside the channel's rate limit. <br> 5. The system sends the update and stores the sent quantity and timestamp (POST-2).</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>13.1 — Hourly reconciliation.</strong> The timer fires; the system reads the quantity each channel currently believes it has, compares it with OMFS, and re-pushes any SKU that differs. This catches silently dropped updates. <br> <strong>13.2 — Coalesced updates.</strong> Several stock-changed events arrive for one SKU within the batching window; the system sends only the latest quantity, not one update per event. <br> <strong>13.3 — Channel activation.</strong> A channel is newly activated; the system performs a full push of every mapped SKU.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>13.0.E1 — Channel rejects the update.</strong> The channel returns an error for a SKU. The system records the failure, retries with backoff, and after three failures raises an integration alert naming the SKU and the channel. <br> <strong>13.0.E2 — Rate limit reached.</strong> At step 4 the channel signals throttling. The system queues the remaining updates and resumes after the stated retry interval; updates are never dropped. <br> <strong>13.0.E3 — Channel unreachable.</strong> The channel API is down. The system queues updates and, when the outage exceeds 15 minutes, raises an alert because stale channel stock is the direct cause of overselling. <br> <strong>13.0.E4 — Negative computed quantity.</strong> At step 2 the computation yields a negative number, which indicates a data fault. The system publishes zero, raises a data-quality alert for the Inventory Controller, and does not publish the negative value.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>High</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>~25,000 stock-changed events/day average, coalesced to ~9,000 channel updates/day; ~4× on peak days.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-07, BR-17, BR-20</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>The 60-second publication target in BR-20 is the tightest latency requirement in the system and is the reason UC-13 is event-driven rather than scheduled. The hourly reconciliation in 13.1 exists because the team cannot assume every push succeeds — the current process fails silently and nobody notices until an oversell happens.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Every channel exposes both a stock-update endpoint and a stock-read endpoint; without the read, 13.1 degrades to a blind re-push.</td>
</tr>
</tbody>
</table>
<h3>UC-14 — View the fulfillment performance dashboard</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC ID and Name</strong></td>
<td>UC-14 — View the fulfillment performance dashboard</td>
</tr>
<tr>
<td><strong>Created By</strong></td>
<td>Member 2</td>
</tr>
<tr>
<td><strong>Primary Actor</strong></td>
<td>Fulfillment Manager</td>
</tr>
<tr>
<td><strong>Trigger</strong></td>
<td>The user opens the dashboard, or the scheduled daily summary is generated.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>One screen showing whether fulfillment is meeting its targets: throughput, order-to-ship cycle time, oversell rate, exception volume and shipping cost per order. Its purpose is to make the six business objectives from the Vision &amp; Scope document continuously visible rather than reconstructed at quarter end.</td>
</tr>
<tr>
<td><strong>Preconditions</strong></td>
<td>PRE-1: The user is authenticated with a role that grants dashboard access. <br> PRE-2: At least one day of operating data exists.</td>
</tr>
<tr>
<td><strong>Postconditions</strong></td>
<td>POST-1: The user sees only the fulfillment centers, channels and brands their role permits. <br> POST-2: Every figure displays the period it covers and the time it was last refreshed.</td>
</tr>
<tr>
<td><strong>Normal Flow</strong></td>
<td><strong>14.0</strong> <br> 1. The user opens the dashboard. <br> 2. The system applies the user's data scope (POST-1). <br> 3. The system displays the headline metrics against their targets: orders shipped, order-to-ship cycle time, oversell rate, automated routing rate, open exceptions and shipping cost per order. <br> 4. The system displays each metric's trend over the selected period. <br> 5. The user changes the period, fulfillment center, channel or brand filter. <br> 6. The system recomputes and redisplays.</td>
</tr>
<tr>
<td><strong>Alternative Flows</strong></td>
<td><strong>14.1 — Drill down.</strong> The user clicks a metric; the system lists the underlying orders or exceptions. <br> <strong>14.2 — Export.</strong> The user exports the current view as CSV for offline analysis. <br> <strong>14.3 — Scheduled summary.</strong> The system emails a daily summary to subscribed managers at 07:00 local time. <br> <strong>14.4 — Carrier cost view.</strong> The Logistics Manager opens the cost breakdown by carrier, comparing quoted rates (UC-07 POST-2) with invoiced amounts.</td>
</tr>
<tr>
<td><strong>Exceptions</strong></td>
<td><strong>14.0.E1 — Insufficient data.</strong> The selected period contains no data. The system shows an explicit "no data for this period" state rather than zeros, which would read as a catastrophic result. <br> <strong>14.0.E2 — Metric computation times out.</strong> The system displays the metrics that completed and marks the rest as unavailable with a retry action, rather than failing the whole page. <br> <strong>14.0.E3 — Stale aggregates.</strong> The aggregation job has not run recently. The system shows the last-refreshed timestamp prominently (POST-2) and warns that figures are stale.</td>
</tr>
<tr>
<td><strong>Priority</strong></td>
<td>Low — deferred to Release 2.0</td>
</tr>
<tr>
<td><strong>Frequency of Use</strong></td>
<td>~15 users, ~4 views/day each: ~60 views/day. Daily summary: 1/day.</td>
</tr>
<tr>
<td><strong>Business Rules</strong></td>
<td>BR-06, BR-09, BR-18</td>
</tr>
<tr>
<td><strong>Other Information</strong></td>
<td>The metric definitions must be <strong>identical</strong> to the success metrics in Vision &amp; Scope §1.4 — if the dashboard computes the oversell rate differently from the project's success criterion, the project cannot prove it succeeded. Report layouts are specified in SRS §4.3.</td>
</tr>
<tr>
<td><strong>Assumptions</strong></td>
<td>Near-real-time aggregation is acceptable; figures may lag live data by up to 15 minutes.</td>
</tr>
</tbody>
</table>
<hr />
<h3>4. Use Case Diagram</h3>
<p>See <code>diagrams/use-case-diagram.drawio</code> (editable) and <code>diagrams/use-case-diagram.png</code> (for the SRS Appendix B).</p>
<p><strong>Reading the diagram</strong></p>
<ul>
<li>Primary actors are on the <strong>left</strong>, secondary (system) actors on the <strong>right</strong>.</li>
<li>The rectangle is the <strong>system boundary</strong> — everything inside it is OMFS's responsibility; the web storefront, payment gateway and ERP sit outside deliberately (see Vision &amp; Scope §2.4 Limitations and Exclusions).</li>
<li><code>«include»</code> arrows point <strong>from</strong> the base use case <strong>to</strong> the always-executed use case.</li>
<li><code>«extend»</code> arrows point <strong>from</strong> the optional use case <strong>to</strong> the base it extends.</li>
</ul>
<p><strong>Relationships shown</strong></p>
<table>
<thead>
<tr>
<th>Relationship</th>
<th>From</th>
<th>To</th>
<th>Why</th>
</tr>
</thead>
<tbody>
<tr>
<td>«include»</td>
<td>UC-01 Ingest an order</td>
<td>UC-02 Screen and validate</td>
<td>Every ingested order is screened before it can reserve stock</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-02 Screen and validate</td>
<td>UC-03 Reserve inventory</td>
<td>Every validated order reserves stock</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-03 Reserve inventory</td>
<td>UC-04 Route and split</td>
<td>Every reserved order is routed</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-06 Pick and pack</td>
<td>UC-07 Rate-shop and label</td>
<td>Every packed shipment is labelled</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-03 Reserve inventory</td>
<td>UC-13 Synchronize stock</td>
<td>Every reservation changes sellable stock, always</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-06 Pick and pack</td>
<td>UC-13 Synchronize stock</td>
<td>Picking deducts on-hand stock, always</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-11 Cancel or modify</td>
<td>UC-13 Synchronize stock</td>
<td>Cancellation releases stock, always</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-07 Rate-shop and label</td>
<td>UC-09 Track an order</td>
<td>Labelling always issues the customer tracking link</td>
</tr>
<tr>
<td>«extend»</td>
<td>UC-10 Handle exception</td>
<td>UC-03 Reserve inventory</td>
<td>Only when reservation fails</td>
</tr>
<tr>
<td>«extend»</td>
<td>UC-10 Handle exception</td>
<td>UC-04 Route and split</td>
<td>Only when routing fails</td>
</tr>
<tr>
<td>«extend»</td>
<td>UC-10 Handle exception</td>
<td>UC-07 Rate-shop and label</td>
<td>Only when no carrier is eligible</td>
</tr>
<tr>
<td>«extend»</td>
<td>UC-12 Process a return</td>
<td>UC-08 Ingest tracking event</td>
<td>Only when the carrier returns an undeliverable parcel</td>
</tr>
</tbody>
</table></div>
<div class="ml-vi"><h2>Use Cases</h2>
<h2>cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên nhóm trưởng&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Nova Retail Group (NRG)
17 tháng 9 năm 2026</p>
<hr />
<h3>Lịch sử sửa đổi</h3>
<table>
<thead>
<tr>
<th>Người</th>
<th>Ngày</th>
<th>Lý do sửa</th>
<th>Phiên bản</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Danh sách use case ban đầu từ các buổi khai thác 1–3</td>
<td>0.9</td>
</tr>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Hoàn thành và rà soát chéo cả 14 đặc tả</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Actor</h3>
<h3>1.1 Actor chính</h3>
<table>
<thead>
<tr>
<th>Actor</th>
<th>Mô tả</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Nhân viên kho</strong></td>
<td>Nhặt và đóng gói đơn bên trong một trung tâm hoàn tất đơn bằng máy quét cầm tay. ~60 người dùng trên 3 FC.</td>
</tr>
<tr>
<td><strong>Quản lý hoàn tất đơn</strong></td>
<td>Chịu trách nhiệm về thông lượng của một hoặc nhiều FC. Phát các đợt nhặt hàng, xử lý ngoại lệ, ghi đè quyết định định tuyến.</td>
</tr>
<tr>
<td><strong>Kiểm soát tồn kho</strong></td>
<td>Chịu trách nhiệm về độ chính xác tồn kho. Cấu hình tồn an toàn, rà các lượt giữ tồn, điều tra sai lệch.</td>
</tr>
<tr>
<td><strong>Nhân viên CSKH</strong></td>
<td>Trả lời các liên hệ của khách. Huỷ, sửa và khởi tạo trả hàng thay mặt khách. ~25 người dùng.</td>
</tr>
<tr>
<td><strong>Quản lý logistics</strong></td>
<td>Chịu trách nhiệm về quan hệ với hãng vận chuyển và chi phí giao hàng. Cấu hình điều kiện hãng và đối soát hoá đơn 3PL.</td>
</tr>
<tr>
<td><strong>Quản lý nhãn hàng</strong></td>
<td>Phụ trách một trong năm nhãn. Đọc báo cáo hoàn tất đơn; không vận hành hệ thống hằng ngày.</td>
</tr>
<tr>
<td><strong>Quản trị hệ thống</strong></td>
<td>Cấu hình kênh bán, trung tâm hoàn tất đơn, người dùng và các tham số định tuyến.</td>
</tr>
<tr>
<td><strong>Khách hàng</strong></td>
<td>Người mua. <strong>Chỉ</strong> tương tác với OMFS qua trang tự tra cứu đơn hàng (UC-09).</td>
</tr>
</tbody>
</table>
<h3>1.2 Actor phụ (hệ thống ngoài)</h3>
<table>
<thead>
<tr>
<th>Actor</th>
<th>Mô tả</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Kênh bán</strong></td>
<td>Storefront trên web hoặc một sàn (Shopee, Lazada, TikTok Shop). Nguồn của đơn hàng, đích của các lượt cập nhật tồn kho.</td>
</tr>
<tr>
<td><strong>Hãng 3PL</strong></td>
<td>GHN, GHTK, Viettel Post hoặc J&amp;T Express. Cung cấp báo giá, nhãn vận chuyển và sự kiện theo dõi qua API.</td>
</tr>
<tr>
<td><strong>Cổng thanh toán</strong></td>
<td>Giữ trạng thái uỷ quyền thanh toán của một đơn. OMFS chỉ đọc.</td>
</tr>
<tr>
<td><strong>Dịch vụ Thông báo</strong></td>
<td>Gửi email và SMS tới khách hàng thay mặt OMFS.</td>
</tr>
</tbody>
</table>
<div class="callout">
<p><strong>Vì sao hệ ERP / kế toán không được liệt kê là actor.</strong> Nó nhận một lượt ghi sổ hằng
ngày về tài chính của các đơn đã giao, nhưng nó không tham gia use case nào trong mười
bốn cái — không actor nào làm gì để khởi động nó và không việc gì nó làm xuất hiện
trong một luồng nào. Vì thế nó được đặc tả như một <strong>giao tiếp phần mềm ở SRS §5.2</strong>,
không phải như một actor của use case. Liệt kê một hệ thống là actor khi nó không xuất
hiện trong luồng nào là một lỗi truy vết, nên ở đây nó được loại ra một cách có chủ ý.</p>
</div>
<hr />
<h3>2. Danh sách Use Case</h3>
<table>
<thead>
<tr>
<th>Mã</th>
<th>Actor chính</th>
<th>Actor phụ</th>
<th>Tên use case</th>
<th>Mô tả</th>
</tr>
</thead>
<tbody>
<tr>
<td>UC-01</td>
<td>Kênh bán</td>
<td>—</td>
<td>Nhận một đơn từ kênh bán</td>
<td>Lấy một đơn mới từ bất kỳ kênh nào và chuẩn hoá nó thành một bản ghi đơn hàng OMFS duy nhất</td>
</tr>
<tr>
<td>UC-02</td>
<td>OMFS (theo lịch)</td>
<td>Cổng thanh toán</td>
<td>Sàng lọc và kiểm tính hợp lệ của đơn</td>
<td>Kiểm địa chỉ, uỷ quyền thanh toán và dấu hiệu gian lận trước khi đơn chiếm tồn kho</td>
</tr>
<tr>
<td>UC-03</td>
<td>OMFS (sự kiện)</td>
<td>—</td>
<td>Giữ tồn kho</td>
<td>Giữ tồn available-to-promise cho mọi dòng của đơn, hoặc đánh dấu đơn là chờ hàng</td>
</tr>
<tr>
<td>UC-04</td>
<td>OMFS (sự kiện)</td>
<td>Quản lý hoàn tất đơn</td>
<td>Định tuyến và tách đơn</td>
<td>Chọn các trung tâm hoàn tất đơn sẽ giao từng dòng, theo một luật chấm điểm cấu hình được</td>
</tr>
<tr>
<td>UC-05</td>
<td>Quản lý hoàn tất đơn</td>
<td>—</td>
<td>Sinh và phát một đợt nhặt hàng</td>
<td>Gom các đơn đã định tuyến thành một đợt nhặt cho một FC và phát nó xuống sàn kho</td>
</tr>
<tr>
<td>UC-06</td>
<td>Nhân viên kho</td>
<td>—</td>
<td>Nhặt và đóng gói có quét xác nhận</td>
<td>Nhặt từng món theo máy cầm tay, xác minh bằng mã vạch, và gán món vào thùng</td>
</tr>
<tr>
<td>UC-07</td>
<td>OMFS (sự kiện)</td>
<td>Hãng 3PL</td>
<td>So giá hãng vận chuyển và mua nhãn</td>
<td>So các hãng đủ điều kiện theo chi phí và mức dịch vụ, rồi mua nhãn qua API</td>
</tr>
<tr>
<td>UC-08</td>
<td>Hãng 3PL</td>
<td>Dịch vụ Thông báo</td>
<td>Nhận một sự kiện theo dõi từ hãng</td>
<td>Nhận một sự kiện trạng thái của hãng và áp nó vào lô giao và đơn hàng</td>
</tr>
<tr>
<td>UC-09</td>
<td>Khách hàng</td>
<td>—</td>
<td>Theo dõi một đơn hàng (tự phục vụ)</td>
<td>Cho khách xem trạng thái đơn và lô giao hiện tại, chính xác, mà không cần liên hệ hỗ trợ</td>
</tr>
<tr>
<td>UC-10</td>
<td>Quản lý hoàn tất đơn</td>
<td>Kiểm soát tồn kho</td>
<td>Xử lý một ngoại lệ hoàn tất đơn</td>
<td>Giải quyết các ngoại lệ chờ hàng, tách đơn thất bại, giao thiếu và lỗi địa chỉ từ một bảng điều khiển duy nhất</td>
</tr>
<tr>
<td>UC-11</td>
<td>Nhân viên CSKH</td>
<td>Kênh bán</td>
<td>Huỷ hoặc sửa đơn trước khi xuất hàng</td>
<td>Huỷ hoặc đổi một đơn khi còn chặn được, đồng thời nhả mọi tồn kho đang giữ</td>
</tr>
<tr>
<td>UC-12</td>
<td>Nhân viên CSKH</td>
<td>Nhân viên kho</td>
<td>Xử lý trả hàng và nhập lại kho</td>
<td>Cho phép trả hàng, nhận hàng về, kiểm hàng, rồi nhập lại kho hoặc đưa vào khu cách ly</td>
</tr>
<tr>
<td>UC-13</td>
<td>OMFS (sự kiện)</td>
<td>Kênh bán</td>
<td>Đồng bộ số tồn kho ra các kênh bán</td>
<td>Đẩy số lượng khả dụng đã thay đổi tới mọi kênh có bán SKU đó</td>
</tr>
<tr>
<td>UC-14</td>
<td>Quản lý hoàn tất đơn</td>
<td>—</td>
<td>Xem bảng điều khiển hiệu suất hoàn tất đơn</td>
<td>Theo dõi thông lượng, thời gian chu kỳ, lượng ngoại lệ và chi phí vận chuyển so với mục tiêu</td>
</tr>
</tbody>
</table>
<div class="callout">
<p><strong>Truy vết về các tính năng ở Vision &amp; Scope:</strong> UC-01→FE-1 · UC-02→FE-2 · UC-03→FE-3 · UC-04→FE-5 · UC-05→FE-6 · UC-06→FE-7 · UC-07→FE-8 · UC-08→FE-9 · UC-09→FE-10 · UC-10→FE-11 · UC-11→FE-12 · UC-12→FE-13 · UC-13→FE-4 · UC-14→FE-14</p>
</div>
<hr />
<h3>3. Đặc tả Use Case</h3>
<h3>UC-01 — Nhận một đơn từ kênh bán</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-01 — Nhận một đơn từ kênh bán</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Kênh bán (hệ thống)</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Một đơn mới đạt trạng thái "đã thanh toán" hoặc "đã đặt" trên một kênh bán, hoặc khoảng thời gian hỏi định kỳ (60 giây) trôi qua.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>OMFS lấy các đơn mới từ từng kênh bán đã nối và chuyển mỗi đơn thành một bản ghi đơn hàng OMFS đã chuẩn hoá, bất kể định dạng dữ liệu riêng của kênh đó. Đây là điểm vào của toàn bộ vòng đời hoàn tất đơn.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Kênh bán đã được đăng ký trong OMFS và ở trạng thái Active. <br> PRE-2: Thông tin xác thực API hợp lệ của kênh đã được lưu và chưa hết hạn.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Tồn tại đúng một đơn OMFS cho một đơn của kênh, với trạng thái Pending. <br> POST-2: Mọi dòng đơn hàng đều tham chiếu một SKU có trong danh mục sản phẩm gốc, hoặc đơn bị giữ lại ở hàng chờ SKU chưa ánh xạ. <br> POST-3: Mã đơn của kênh và mã đơn OMFS được liên kết với nhau, nên nhận lại cùng một đơn của kênh sẽ không tạo ra bản trùng.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>1.0</strong> <br> 1. Hệ thống hỏi kênh về các đơn tạo ra kể từ mốc nước lần nhận thành công gần nhất. <br> 2. Kênh trả về một tập đơn hàng. <br> 3. Với từng đơn, hệ thống ánh xạ các trường của kênh sang cấu trúc đơn hàng OMFS (khách hàng, địa chỉ giao, các dòng, tổng tiền, phương thức thanh toán). <br> 4. Hệ thống phân giải từng SKU của kênh sang một SKU của OMFS bằng bảng ánh xạ SKU theo kênh. <br> 5. Hệ thống tạo đơn với trạng thái Pending và ghi lại mã đơn của kênh. <br> 6. Hệ thống đẩy mốc nước lần nhận tiến lên. <br> 7. Hệ thống phát một sự kiện đơn-đã-tạo, và sự kiện đó kích hoạt UC-02.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>1.1 — Nhận lại bằng tay.</strong> Ở bước 1, một Quản trị hệ thống yêu cầu nhận lại một mã đơn cụ thể của kênh; hệ thống lấy riêng đơn đó và tiếp tục từ bước 3. <br> <strong>1.2 — Lấy bù sau sự cố.</strong> Ở bước 1, mốc nước cũ hơn 1 giờ; hệ thống duyệt danh sách đơn của kênh theo lô 100 đơn và tiếp tục từ bước 3 cho từng lô.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>1.0.E1 — Không liên lạc được với kênh.</strong> Ở bước 1, API của kênh không phản hồi hoặc trả về 5xx. Hệ thống thử lại theo lùi bậc mũ tối đa 5 lần, không đẩy mốc nước, và phát một cảnh báo tích hợp sau lần hỏng cuối cùng. Không ghi trạng thái dở dang nào. <br> <strong>1.0.E2 — SKU chưa ánh xạ.</strong> Ở bước 4, một SKU của kênh không có ánh xạ. Hệ thống tạo đơn với trạng thái Held-Unmapped, đưa nó vào hàng chờ SKU chưa ánh xạ cho Kiểm soát tồn kho, và <strong>không</strong> phát sự kiện đơn-đã-tạo. <br> <strong>1.0.E3 — Đơn trùng.</strong> Ở bước 5, mã đơn của kênh đã tồn tại trong OMFS. Hệ thống ghi nhật ký lần trùng đó và bỏ qua, không tạo đơn thứ hai. <br> <strong>1.0.E4 — Đơn sai định dạng.</strong> Ở bước 3 thiếu một trường bắt buộc (địa chỉ giao, ít nhất một dòng). Hệ thống tạo đơn với trạng thái Held-Invalid và phát một ngoại lệ chất lượng dữ liệu cho UC-10.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Trung bình 4.500 đơn/ngày; đỉnh 18.000/ngày. Việc hỏi định kỳ chạy mỗi 60 giây cho mỗi kênh, 4 kênh.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-16</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Việc nhận đơn phải luỹ đẳng: cùng một đơn của kênh xử lý hai lần phải cho ra một đơn OMFS (POST-3). Nếu tiến trình hỏng giữa bước 5 và bước 6, lần chạy kế tiếp đọc lại đúng cửa sổ đó và dựa vào POST-3 để tránh nhân đôi. Việc ánh xạ trường theo từng kênh là cấu hình, không phải mã, nên thêm một kênh mới không cần ra bản phần mềm.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Cả bốn kênh đều mở một API lấy đơn có hỗ trợ lọc theo dấu thời gian tạo đơn.</td>
</tr>
</tbody>
</table>
<h3>UC-02 — Sàng lọc và kiểm tính hợp lệ của đơn</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-02 — Sàng lọc và kiểm tính hợp lệ của đơn</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>OMFS (hệ thống, theo sự kiện)</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>UC-01 phát ra một sự kiện đơn-đã-tạo.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Trước khi một đơn được phép chiếm tồn kho, OMFS xác minh rằng địa chỉ giao hàng giao được, việc thanh toán đã được uỷ quyền (hoặc đơn là thu tiền khi nhận hàng), và đơn không khớp một mẫu gian lận nào. Sàng lọc trước khi giữ tồn chính là thứ ngăn tồn kho bị giữ cho những đơn sẽ không bao giờ giao.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Đơn tồn tại với trạng thái Pending. <br> PRE-2: Đơn có ít nhất một dòng và một địa chỉ giao.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Trạng thái đơn là Validated, hoặc Held-Review, hoặc Cancelled — không bao giờ bị bỏ lại ở Pending. <br> POST-2: Mọi quyết định sàng lọc đều được ghi lại kèm mã lý do và dấu thời gian.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>2.0</strong> <br> 1. Hệ thống chuẩn hoá địa chỉ giao và xác minh rằng mã bưu chính có ít nhất một hãng phục vụ. <br> 2. Hệ thống đọc trạng thái uỷ quyền thanh toán từ cổng thanh toán. <br> 3. Hệ thống đánh giá bộ luật gian lận (giá trị đơn, lệch giữa địa chỉ và thanh toán, tần suất đặt từ cùng một khách). <br> 4. Cả ba phép kiểm đều đạt; hệ thống đặt trạng thái đơn là Validated. <br> 5. Hệ thống phát một sự kiện đã-kiểm, và sự kiện đó kích hoạt UC-03.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>2.1 — Thu tiền khi nhận hàng.</strong> Ở bước 2, phương thức thanh toán là COD; hệ thống bỏ qua phép kiểm uỷ quyền và tiếp tục ở bước 3. <br> <strong>2.2 — Nhân viên ghi đè.</strong> Từ trạng thái Held-Review, một Nhân viên CSKH xem lại đơn, ghi một lời giải trình, và thả nó ra; hệ thống đặt trạng thái Validated và tiếp tục ở bước 5.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>2.0.E1 — Địa chỉ không giao được.</strong> Ở bước 1, không hãng nào phục vụ mã bưu chính đó. Hệ thống đặt trạng thái Held-Review với lý do ADDRESS_UNSERVICEABLE và phát một ngoại lệ cho UC-10. <br> <strong>2.0.E2 — Thanh toán chưa được uỷ quyền.</strong> Ở bước 2, cổng báo bị từ chối hoặc đang chờ. Hệ thống đặt trạng thái Held-Review với lý do PAYMENT_NOT_AUTHORIZED và không giữ tồn. <br> <strong>2.0.E3 — Cổng thanh toán không truy cập được.</strong> Ở bước 2, cổng không phản hồi. Hệ thống thử lại trong tối đa 5 phút, rồi đặt trạng thái Held-Review với lý do PAYMENT_UNKNOWN. Nó <strong>không</strong> giả định là đã được uỷ quyền. <br> <strong>2.0.E4 — Kích hoạt luật gian lận.</strong> Ở bước 3, một luật gian lận khớp. Hệ thống đặt trạng thái Held-Review với lý do FRAUD_REVIEW và báo cho hàng chờ của CSKH.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Một lần cho mỗi đơn — trung bình 4.500/ngày, đỉnh 18.000/ngày.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-03, BR-04</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Việc sàng lọc phải hoàn tất trong vòng 30 giây kể từ sự kiện đơn-đã-tạo ở mức tải bình thường, vì mỗi giây trước khi giữ tồn là một giây mà cùng số hàng đó có thể bị bán lần nữa. Nếu use case hỏng sau bước 4 nhưng trước bước 5, một tác vụ khôi phục sẽ phát lại sự kiện đã-kiểm; UC-03 luỹ đẳng theo từng đơn nên không xảy ra việc giữ tồn hai lần.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Cổng thanh toán mở ra một truy vấn trạng thái uỷ quyền mà bản thân nó không thu tiền.</td>
</tr>
</tbody>
</table>
<h3>UC-03 — Giữ tồn kho</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-03 — Giữ tồn kho</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>OMFS (hệ thống, theo sự kiện)</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>UC-02 phát ra một sự kiện đã-kiểm.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>OMFS tính available-to-promise theo từng SKU tại từng trung tâm hoàn tất đơn và đặt một lượt giữ lên số hàng mà mọi dòng của đơn cần. <strong>Đây chính là cơ chế giải quyết việc bán vượt tồn</strong>: hàng được cam kết ngay tại thời điểm nhận đơn, không phải tại thời điểm nhặt hàng.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Trạng thái đơn là Validated. <br> PRE-2: Mọi SKU trên đơn đều tồn tại trong danh mục sản phẩm gốc.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Hoặc mọi dòng đều giữ được tồn và trạng thái đơn là Reserved, hoặc không dòng nào giữ được tồn và trạng thái đơn là Backordered. Một đơn giữ tồn dở dang không bao giờ bị bỏ lại ở trạng thái đó. <br> POST-2: Mỗi lượt giữ ghi lại SKU, trung tâm hoàn tất đơn, số lượng, thời điểm tạo và thời điểm hết hạn. <br> POST-3: Một sự kiện tồn-kho-đổi được phát cho mọi SKU bị ảnh hưởng, kích hoạt UC-13.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>3.0</strong> <br> 1. Hệ thống tính ATP theo từng SKU tại từng trung tâm bằng BR-07. <br> 2. Với từng dòng, hệ thống chọn trung tâm có ATP cao nhất mà đáp ứng đủ toàn bộ số lượng của dòng đó. <br> 3. Hệ thống giữ số lượng yêu cầu tại trung tâm đó. <br> 4. Hệ thống đặt thời điểm hết hạn giữ tồn là 30 phút kể từ lúc tạo (BR-04). <br> 5. Hệ thống đặt trạng thái đơn là Reserved. <br> 6. Hệ thống phát một sự kiện tồn-kho-đổi cho mỗi SKU và một sự kiện đã-giữ-tồn, và sự kiện sau kích hoạt UC-04.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>3.1 — Giữ tồn có tách.</strong> Ở bước 2, không một trung tâm nào đủ ATP cho cả dòng, nhưng tổng trên các trung tâm thì đủ. Hệ thống giữ tồn cho dòng đó trên tối đa ba trung tâm (BR-08), đánh dấu đơn là Split-Required cho UC-04, và tiếp tục ở bước 4. <br> <strong>3.2 — Giữ tồn lại sau khi đã nhả.</strong> Đơn đang ở trạng thái Backordered và hàng nhập về; một sự kiện tồn-kho-đổi đưa riêng đơn đó quay lại use case này ở bước 1.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>3.0.E1 — Tổng ATP không đủ.</strong> Ở bước 1, tổng ATP trên mọi trung tâm nhỏ hơn số lượng đặt của ít nhất một dòng. Hệ thống không giữ gì cho cả đơn, đặt trạng thái Backordered, và phát một ngoại lệ cho UC-10. <br> <strong>3.0.E2 — Vượt giới hạn tách.</strong> Ở luồng 3.1, một dòng sẽ cần hơn ba trung tâm (BR-08). Hệ thống không giữ gì, đặt trạng thái Backordered với lý do SPLIT_LIMIT, và phát một ngoại lệ cho UC-10. <br> <strong>3.0.E3 — Lượt giữ tồn hết hạn.</strong> Ba mươi phút trôi qua mà chưa xác nhận thanh toán (BR-04). Hệ thống nhả mọi lượt giữ của đơn, đưa trạng thái về Pending, và phát một sự kiện tồn-kho-đổi cho mỗi SKU. <br> <strong>3.0.E4 — Xung đột giữ tồn đồng thời.</strong> Ở bước 3, một đơn khác giữ cùng số hàng đó trước. Hệ thống đọc lại ATP và thử lại từ bước 1, tối đa 3 lần, rồi đi theo 3.0.E1.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Một lần cho mỗi đơn đã kiểm — trung bình 4.500/ngày, đỉnh 18.000/ngày, với các đợt bùng tới 60 lượt giữ tồn/giây trong các phiên sale chớp nhoáng ngày chiến dịch.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-01, BR-02, BR-04, BR-07, BR-08, BR-17</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Việc giữ tồn phải <strong>nguyên tử theo từng đơn</strong> (POST-1). Nếu tiến trình hỏng giữa chừng, mọi lượt giữ đã đặt cho đơn đó đều được lùi lại; đơn quay về Validated và được thử lại. Giữ tồn là thao tác có mức tranh chấp cao nhất hệ thống và chi phối các thuộc tính chất lượng về tính đồng thời ở SRS §6.2.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Số kiểm kê tồn kho vật lý lúc chuyển đổi chính xác trong phạm vi sai số 2%; sai số lớn hơn sẽ làm ATP sai ngay từ ngày đầu, bất kể logic này thế nào.</td>
</tr>
</tbody>
</table>
<h3>UC-04 — Định tuyến và tách đơn</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-04 — Định tuyến và tách đơn qua các trung tâm hoàn tất đơn</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>OMFS (hệ thống, theo sự kiện)</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>UC-03 phát ra một sự kiện đã-giữ-tồn, hoặc một Quản lý hoàn tất đơn yêu cầu định tuyến lại một đơn.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>OMFS quyết định trung tâm nào giao những dòng nào, tách đơn thành mỗi trung tâm một lô giao khi cần. Nó chấm điểm từng trung tâm ứng viên theo độ phủ tồn kho, khoảng cách tới khách, chi phí vận chuyển dự kiến và khối lượng công việc hiện tại của trung tâm, rồi chọn điểm cao nhất. <strong>Điều này thay thế việc in và chia phiếu đơn hàng bằng tay.</strong></td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Trạng thái đơn là Reserved. <br> PRE-2: Ít nhất một trung tâm hoàn tất đơn đang Open và còn trong hạn mức năng lực ngày của nó.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Đơn được phân rã thành một hoặc nhiều lô giao, mỗi lô gán cho đúng một trung tâm (BR-01). <br> POST-2: Quyết định định tuyến ghi lại điểm của mọi trung tâm ứng viên và lý do cái thắng đã thắng, để có thể giải thích và kiểm toán về sau. <br> POST-3: Trạng thái đơn là Routed.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>4.0</strong> <br> 1. Hệ thống lấy các lượt giữ tồn do UC-03 đặt và gom các dòng theo trung tâm đang giữ hàng của chúng. <br> 2. Với từng cách gom ứng viên, hệ thống tính điểm định tuyến bằng BR-06. <br> 3. Hệ thống chọn cách gom có điểm cao nhất. <br> 4. Hệ thống kiểm trung tâm được chọn so với năng lực ngày còn lại và giờ chốt xuất hàng 14:00 (BR-10). <br> 5. Hệ thống tạo mỗi trung tâm trong cách gom thắng cuộc một lô giao. <br> 6. Hệ thống ghi lại toàn bộ bảng điểm gắn với đơn (POST-2). <br> 7. Hệ thống đặt trạng thái đơn là Routed và phát một sự kiện đã-định-tuyến, kích hoạt UC-05.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>4.1 — Đơn một trung tâm.</strong> Ở bước 1, mọi dòng đều đã giữ tồn tại một trung tâm; hệ thống bỏ qua phần chấm điểm và tạo một lô giao, tiếp tục ở bước 6. <br> <strong>4.2 — Ghi đè bằng tay.</strong> Một Quản lý hoàn tất đơn mở bàn định tuyến, xem bảng điểm, chọn một trung tâm khác, và ghi một lý do. Hệ thống tạo lại các lô giao tương ứng và đánh dấu đơn là Manually-Routed (BR-19). <br> <strong>4.3 — Định tuyến lại sau khi đổi năng lực.</strong> Một trung tâm bị Quản trị hệ thống đóng lại; mọi đơn Routed chưa được nhặt hàng ở trung tâm đó sẽ quay lại use case này ở bước 1.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>4.0.E1 — Mọi trung tâm đều hết năng lực.</strong> Ở bước 4, mọi trung tâm ứng viên đều đã dùng hết năng lực ngày. Hệ thống giữ đơn ở trạng thái Routing-Deferred và thử lại ở cửa sổ năng lực kế tiếp; nếu ngày giao đã hứa có rủi ro (BR-09) thì nó phát một ngoại lệ cho UC-10. <br> <strong>4.0.E2 — Việc tách vượt giới hạn.</strong> Ở bước 3, cách gom thắng cuộc cần hơn ba lô giao (BR-08). Hệ thống phát một ngoại lệ cho UC-10 thay vì tạo các lô giao. <br> <strong>4.0.E3 — Cấu hình định tuyến không hợp lệ.</strong> Ở bước 2, các trọng số định tuyến không cộng bằng 1,0 hoặc thiếu một trọng số. Hệ thống lùi về quy tắc trung-tâm-gần-nhất-có-hàng, ghi một cảnh báo cấu hình, và đánh dấu quyết định là Fallback-Routed.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Một lần cho mỗi đơn đã giữ tồn — trung bình 4.500/ngày, đỉnh 18.000/ngày. Định tuyến lại: ~20/ngày.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-01, BR-06, BR-08, BR-09, BR-10, BR-19</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Các trọng số định tuyến ở BR-06 là cấu hình, Quản lý hoàn tất đơn chỉnh được mà không cần ra bản phần mềm; bộ trọng số riêng theo từng nhãn hàng hoãn sang bản 2.0. POST-2 tồn tại vì Quản lý hoàn tất đơn nói rõ rằng họ sẽ không tin một quyết định tự động mà mình không soi được — bảng điểm là một yêu cầu, không phải một công cụ hỗ trợ gỡ lỗi.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Khoảng cách giữa một trung tâm hoàn tất đơn và một mã bưu chính đích lấy được từ một bảng tra cứu tĩnh do Quản lý logistics duy trì.</td>
</tr>
</tbody>
</table>
<h3>UC-05 — Sinh và phát một đợt nhặt hàng</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-05 — Sinh và phát một đợt nhặt hàng</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Quản lý hoàn tất đơn</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Quản lý hoàn tất đơn khởi tạo một đợt, hoặc bộ hẹn giờ đợt theo lịch nổ (mỗi giờ, và tại mốc chốt 14:00).</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Các lô giao đã định tuyến đang chờ ở một trung tâm được gom thành một đợt nhặt hàng — một lô công việc phát xuống sàn kho cùng lúc — để nhân viên đi qua kho một lần cho nhiều đơn thay vì một lần cho mỗi đơn.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Ít nhất một lô giao tại trung tâm này có trạng thái Routed. <br> PRE-2: Quản lý hoàn tất đơn đã xác thực và được phân công cho trung tâm này.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Mọi lô giao trong đợt đã phát đều có trạng thái Picking và được liên kết với đợt đó. <br> POST-2: Một lô giao thuộc tối đa một đợt đang mở.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>5.0</strong> <br> 1. Quản lý hoàn tất đơn chọn một trung tâm và các tiêu chí đợt (giờ chốt của hãng, mức dịch vụ, tuổi đơn, kích cỡ đợt tối đa). <br> 2. Hệ thống liệt kê các lô giao Routed khớp tiêu chí, kèm số lượng và thời gian nhặt ước tính. <br> 3. Quản lý hoàn tất đơn xác nhận đợt. <br> 4. Hệ thống tạo đợt, gán mọi lô giao đã chọn vào đó, và đặt trạng thái của chúng là Picking. <br> 5. Hệ thống sinh danh sách nhặt hàng, sắp theo vị trí lưu trữ để giảm quãng đường đi lại. <br> 6. Hệ thống đưa đợt ra cho các máy cầm tay tại trung tâm đó.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>5.1 — Đợt tự động.</strong> Bộ hẹn giờ theo lịch nổ; hệ thống áp các tiêu chí mặc định đã lưu và thực thi bước 2, 4, 5, 6 mà không cần người xác nhận. <br> <strong>5.2 — Đợt ưu tiên.</strong> Quản lý hoàn tất đơn đánh dấu đợt là Priority; hệ thống đặt nó lên đầu mọi hàng chờ của máy cầm tay. <br> <strong>5.3 — Huỷ một đợt.</strong> Trước khi bất kỳ món nào trong đợt được nhặt, Quản lý hoàn tất đơn huỷ nó; mọi lô giao quay về Routed.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>5.0.E1 — Lô giao đã nằm trong một đợt khác.</strong> Ở bước 4, một lô giao đã chọn bị thêm vào một đợt khác một cách đồng thời (POST-2). Hệ thống loại nó ra, hoàn tất đợt với các lô giao còn lại, và báo lại phần bị loại. <br> <strong>5.0.E2 — Không tìm thấy hàng lúc nhặt.</strong> Xử lý ở UC-06, không phải ở đây, nhưng đợt vẫn mở cho tới khi mọi lô giao đạt một trạng thái kết thúc. <br> <strong>5.0.E3 — Đợt vượt kích cỡ tối đa.</strong> Ở bước 3, phần đã chọn vượt mức tối đa đã cấu hình. Hệ thống tạo nhiều đợt thay vì một đợt quá khổ, và nói cho người quản lý biết là bao nhiêu đợt.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>~12 đợt mỗi trung tâm mỗi ngày; 36/ngày trên ba trung tâm. Nhiều hơn vào ngày chiến dịch.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-10, BR-13</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Thứ tự của danh sách nhặt hàng là một đòn bẩy thông lượng, không phải một lựa chọn cho đẹp: nó là yếu tố đóng góp lớn nhất cho mục tiêu nhận-đơn-tới-xuất-hàng BO-3 ở bên trong kho. Việc tối ưu tới mức ô kệ thuộc về một hệ WMS và tường minh nằm ngoài phạm vi (EX-3); OMFS sắp theo vị trí lưu trữ thô ghi với từng SKU.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Mỗi SKU mang một vị trí lưu trữ thô ở mỗi trung tâm, do nhân viên kho duy trì.</td>
</tr>
</tbody>
</table>
<h3>UC-06 — Nhặt và đóng gói có quét xác nhận</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-06 — Nhặt và đóng gói có quét xác nhận</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Nhân viên kho</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Nhân viên kho mở đầu việc kế tiếp từ đợt đã phát, trên một máy cầm tay.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Nhân viên được dẫn tới từng món một, quét món đó để chứng minh đã lấy đúng, và gán các món đã nhặt vào thùng. Việc quét thay thế phiếu in và chính là thứ xoá bỏ hoàn toàn bước chia phiếu thủ công.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Nhân viên đã xác thực trên một máy cầm tay được gán cho trung tâm này. <br> PRE-2: Tồn tại một đợt đang mở có đầu việc chưa xong tại trung tâm này.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Mọi dòng của lô giao đều được nhặt và xác minh, hoặc lô giao mang một ngoại lệ nhặt thiếu. <br> POST-2: Khi hoàn tất, trạng thái lô giao là Packed và danh sách thùng, khối lượng cùng kích thước của nó được ghi lại. <br> POST-3: Số lượng đã nhặt bị trừ khỏi tồn thực tế và các lượt giữ tồn của chúng được nhả (hàng đã rời đi rồi).</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>6.0</strong> <br> 1. Hệ thống trình ra đầu việc nhặt kế tiếp: SKU, mô tả, ảnh, số lượng và vị trí lưu trữ. <br> 2. Nhân viên tới vị trí đó và quét mã vạch của món hàng. <br> 3. Hệ thống xác minh mã vạch vừa quét khớp với SKU mong đợi và xác nhận lượt nhặt. <br> 4. Bước 1–3 lặp lại cho tới khi mọi dòng của lô giao đều được nhặt. <br> 5. Nhân viên quét một nhãn thùng để mở một thùng và gán các món đã nhặt vào đó. <br> 6. Nhân viên nhập hoặc quét khối lượng của thùng. <br> 7. Hệ thống đặt trạng thái lô giao là Packed và phát một sự kiện đã-đóng-gói, kích hoạt UC-07.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>6.1 — Lô giao nhiều thùng.</strong> Ở bước 5, nhân viên mở thêm thùng; hệ thống ghi lại việc gán món-vào-thùng cho từng cái. <br> <strong>6.2 — Vị trí thay thế.</strong> Ở bước 2, món hàng được tìm thấy ở một vị trí khác; nhân viên quét món đó và xác nhận vị trí thay thế, và hệ thống ghi lại một lần đính chính vị trí cho Kiểm soát tồn kho. <br> <strong>6.3 — Bàn giao giữa đợt.</strong> Nhân viên hết ca; các đầu việc chưa xong quay lại hàng chờ của đợt cho một nhân viên khác.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>6.0.E1 — Quét nhầm món.</strong> Ở bước 3, mã vạch không khớp SKU mong đợi. Hệ thống từ chối lượt nhặt, hiện ra món hàng mong đợi, và không cho đi tiếp. Ba lần lệch liên tiếp sẽ đẩy đầu việc đó lên Quản lý hoàn tất đơn. <br> <strong>6.0.E2 — Nhặt thiếu.</strong> Ở bước 2, số lượng vật lý ít hơn số cần. Nhân viên ghi lại số thực sự tìm thấy; hệ thống tạo một ngoại lệ nhặt thiếu cho UC-10, điều chỉnh tồn thực tế về đúng số đã đếm, và phát một sự kiện tồn-kho-đổi. <br> <strong>6.0.E3 — Hàng bị hỏng.</strong> Nhân viên đánh dấu món hàng là hỏng; hệ thống chuyển số lượng đó sang tồn hỏng (mà BR-07 loại khỏi ATP) và coi dòng đó là nhặt thiếu theo 6.0.E2. <br> <strong>6.0.E4 — Máy cầm tay mất kết nối.</strong> Thiết bị xếp hàng các lượt quét ở máy và phát lại khi nối lại được. Lượt quét luỹ đẳng theo từng đầu việc, nên một lượt quét phát lại không trừ tồn kho hai lần.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Trung bình 4.500 lô giao/ngày, đỉnh 18.000/ngày; ~2,3 dòng mỗi lô giao, nên trung bình ~10.000 lượt quét/ngày.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-07, BR-13, BR-17</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Màn hình nhặt hàng phải dùng được bằng một tay, khi đeo găng, trên một máy Android cầm tay đời thấp, và phải chịu được Wi-Fi chập chờn (6.0.E4) — đó là những ràng buộc do chính Nhân viên kho nêu ra và chúng chi phối các thuộc tính chất lượng về khả dụng và hoạt động ngoại tuyến ở SRS §6.1. POST-3 là điểm mà tồn kho đang giữ trở thành tồn kho đã giao; làm sai chỗ này là đếm tồn kho hai lần.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Mọi SKU bán được đều mang một mã vạch quét được. SKU không có mã vạch được xử lý bằng cách xác nhận tay, có giám sát viên duyệt.</td>
</tr>
</tbody>
</table>
<h3>UC-07 — So giá hãng vận chuyển và mua nhãn</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-07 — So giá hãng vận chuyển và mua nhãn vận chuyển</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 3</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>OMFS (hệ thống, theo sự kiện)</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>UC-06 phát ra một sự kiện đã-đóng-gói.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Với một lô giao đã đóng gói, OMFS xác định những hãng nào thật sự giao được nó, so chúng theo chi phí trọn gói và mức dịch vụ, chọn một hãng, và mua nhãn qua API của hãng đó. <strong>Điều này thay thế việc mua nhãn bằng tay trên bốn cổng hãng riêng biệt</strong> và là thứ mang lại mục tiêu chi phí vận chuyển BO-5.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Trạng thái lô giao là Packed, có ghi khối lượng và kích thước. <br> PRE-2: Ít nhất một hãng được cấu hình Active với thông tin xác thực API hợp lệ.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Lô giao mang đúng một nhãn đã mua kèm mã theo dõi, hoặc nó mang một ngoại lệ dán nhãn. <br> POST-2: Các mức giá được báo từ mọi hãng đủ điều kiện đều được lưu gắn với lô giao để đối soát hoá đơn về sau. <br> POST-3: Trạng thái lô giao là Labelled và trạng thái đơn được cập nhật.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>7.0</strong> <br> 1. Hệ thống xác định điều kiện của các hãng theo mã bưu chính đích, khối lượng và kích thước (BR-11). <br> 2. Hệ thống xin báo giá từ từng hãng đủ điều kiện, song song. <br> 3. Hệ thống tính chi phí trọn gói cho từng báo giá bằng BR-12. <br> 4. Hệ thống chọn hãng rẻ nhất mà vẫn kịp ngày giao đã hứa của đơn. <br> 5. Hệ thống xin một nhãn từ hãng được chọn và nhận về mã theo dõi cùng tài liệu nhãn. <br> 6. Hệ thống lưu mọi báo giá (POST-2), nhãn đã mua và mã theo dõi. <br> 7. Hệ thống đặt trạng thái lô giao là Labelled và báo cho khách qua UC-09.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>7.1 — Hãng ưu tiên.</strong> Quản lý logistics đã ghim một hãng cho một vùng đích; hệ thống dùng hãng đó nếu đủ điều kiện, bỏ qua bước 3–4, và ghi lý do PREFERRED. <br> <strong>7.2 — Đơn giao gấp.</strong> Đơn mang mức dịch vụ express; ở bước 4, hệ thống chọn hãng nhanh nhất kịp ngày, không phải hãng rẻ nhất, và ghi lý do SERVICE_LEVEL. <br> <strong>7.3 — In lại.</strong> Một Nhân viên kho báo nhãn bị hỏng; hệ thống in lại đúng nhãn đó mà không mua nhãn mới.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>7.0.E1 — Không hãng nào đủ điều kiện.</strong> Ở bước 1, không hãng nào phục vụ điểm đến hoặc kiện hàng vượt giới hạn của mọi hãng. Hệ thống phát một ngoại lệ dán nhãn cho UC-10 và để lô giao ở trạng thái Packed. <br> <strong>7.0.E2 — Mọi báo giá đều hỏng.</strong> Ở bước 2, mọi API hãng đều lỗi hoặc hết giờ chờ. Hệ thống thử lại trong tối đa 10 phút, rồi phát một ngoại lệ cho UC-10; lô giao vẫn ở Packed và không bao giờ bị bỏ lại ở trạng thái dán nhãn dở dang. <br> <strong>7.0.E3 — Mua nhãn hỏng sau khi báo giá thành công.</strong> Ở bước 5, hãng được chọn từ chối yêu cầu nhãn. Hệ thống loại hãng đó ra và thử lại từ bước 4 với báo giá tốt kế tiếp, tối đa ba hãng, rồi đi theo 7.0.E2. <br> <strong>7.0.E4 — Nhãn bị trùng.</strong> Yêu cầu nhãn thành công nhưng phản hồi bị mất. Khi thử lại, hệ thống hỏi hãng xem đã có nhãn nào gắn với mã tham chiếu của lô giao chưa, trước khi mua lần nữa, nên một lô giao không bao giờ mang hai nhãn đã trả tiền (POST-1).</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Trung bình — hoãn sang bản 1.1</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Một lần cho mỗi lô giao — trung bình ~4.900/ngày (đơn cộng phần tách), đỉnh ~19.500/ngày.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-11, BR-12</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Việc so giá chỉ tốt bằng chất lượng khối lượng và kích thước ghi ở bước 6 của UC-06; khối lượng bị ghi thiếu một cách hệ thống sẽ sinh ra các khoản điều chỉnh hoá đơn từ hãng, xoá sạch khoản tiết kiệm 12% — và đó là lý do POST-2 lưu lại các báo giá để đối soát. Cho tới bản 1.1, nhãn vẫn tiếp tục được mua bằng tay trên cổng của hãng và mã theo dõi được nhập tay.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Cả bốn hãng đều mở API báo giá và mua nhãn. Hãng nào không có thì được xử lý bằng phương án thủ công nằm sau cùng một giao tiếp nội bộ.</td>
</tr>
</tbody>
</table>
<h3>UC-08 — Nhận một sự kiện theo dõi từ hãng vận chuyển</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-08 — Nhận một sự kiện theo dõi từ hãng vận chuyển</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 3</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Hãng 3PL (hệ thống)</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Một hãng đẩy một sự kiện webhook cho một lô giao đang theo dõi, hoặc khoảng hỏi định kỳ (15 phút) trôi qua với các hãng không có webhook.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>OMFS nhận các sự kiện quét của hãng — đã lấy hàng, đang vận chuyển, đang giao, đã giao, giao hỏng — và áp chúng vào lô giao cùng đơn hàng một cách tự động. <strong>Điều này thay thế việc tải tệp CSV bằng tay hai lần mỗi ngày</strong> và là thứ làm cho trang tự tra cứu (UC-09) trở nên đáng đưa ra.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Lô giao có một mã theo dõi được cấp ở UC-07. <br> PRE-2: Lô giao chưa đạt một trạng thái kết thúc (Delivered, Returned, Lost).</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Sự kiện được lưu gắn với lô giao, kèm dấu thời gian của chính hãng và dấu thời gian OMFS nhận được, để đo được độ trễ (thước đo thành công của BO-4). <br> POST-2: Trạng thái lô giao phản ánh sự kiện mới nhất theo <strong>dấu thời gian của hãng</strong>, không theo thứ tự đến. <br> POST-3: Một sự kiện tới trái thứ tự hoặc bị trùng không bao giờ được đẩy lô giao lùi lại.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>8.0</strong> <br> 1. Hệ thống nhận sự kiện và xác thực hãng. <br> 2. Hệ thống phân giải mã theo dõi thành một lô giao. <br> 3. Hệ thống ánh xạ mã trạng thái riêng của hãng sang bộ từ vựng trạng thái của OMFS. <br> 4. Hệ thống so dấu thời gian của sự kiện với sự kiện mới nhất đã lưu. <br> 5. Sự kiện mới hơn; hệ thống lưu nó và cập nhật trạng thái lô giao. <br> 6. Nếu trạng thái mới là loại khách nhìn thấy được, hệ thống xin gửi một thông báo qua Dịch vụ Thông báo. <br> 7. Nếu trạng thái là Delivered, hệ thống đóng lô giao, và khi mọi lô giao của một đơn đều đã giao thì đóng cả đơn.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>8.1 — Hãng dùng hỏi định kỳ.</strong> Ở bước 1, hệ thống hỏi hãng về mọi lô giao đang mở thay vì nhận đẩy, rồi tiếp tục từ bước 2 cho từng sự kiện trả về. <br> <strong>8.2 — Lấy bù hàng loạt.</strong> Sau một sự cố, hệ thống xin mọi sự kiện kể từ mốc nước gần nhất và xử lý chúng theo thứ tự dấu thời gian của hãng.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>8.0.E1 — Mã theo dõi lạ.</strong> Ở bước 2, không lô giao nào khớp. Hệ thống lưu sự kiện vào hàng chờ mồ côi trong 30 ngày và phát cảnh báo nếu số lượng mồ côi vượt một ngưỡng — nó không vứt bỏ, vì chuyện này thường nghĩa là một nhãn đã được mua bên ngoài OMFS. <br> <strong>8.0.E2 — Trạng thái hãng chưa ánh xạ.</strong> Ở bước 3, hãng gửi một mã mà OMFS không nhận ra. Hệ thống lưu sự kiện thô, giữ nguyên trạng thái lô giao, và phát một cảnh báo cấu hình. <br> <strong>8.0.E3 — Sự kiện tới trái thứ tự.</strong> Ở bước 4, sự kiện cũ hơn cái mới nhất đã lưu. Hệ thống lưu nó lại để làm vết kiểm toán nhưng không đổi trạng thái lô giao (POST-3). <br> <strong>8.0.E4 — Giao hàng thất bại.</strong> Hãng báo một lần giao hỏng. Hệ thống đặt lô giao thành Delivery-Exception và phát một ngoại lệ cho UC-10. <br> <strong>8.0.E5 — Hãng im lặng.</strong> Không có sự kiện nào cho một lô giao trong 48 giờ sau khi lấy hàng. Một bộ giám sát phát một ngoại lệ lô-giao-đứng-im cho UC-10.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Trung bình — hoãn sang bản 1.1</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>~6 sự kiện mỗi lô giao; trung bình ~29.000 sự kiện/ngày, đỉnh ~117.000/ngày.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-09</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>POST-2 quan trọng hơn vẻ ngoài của nó. Các hãng gửi sự kiện về muộn và trái thứ tự; sắp theo thời điểm đến sẽ làm một đơn trông như đi từ Đã giao lùi về Đang vận chuyển, và điều đó sinh ra đúng những cuộc gọi WISMO mà dự án này ra đời để xoá bỏ. Mốc nhận sự kiện p95 15 phút ở SRS §6.2 là thước đo thành công của BO-4.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Ít nhất ba trong bốn hãng hỗ trợ webhook; số còn lại được hỏi định kỳ.</td>
</tr>
</tbody>
</table>
<h3>UC-09 — Theo dõi một đơn hàng (khách tự phục vụ)</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-09 — Theo dõi một đơn hàng (khách tự phục vụ)</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 3</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Khách hàng</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Khách mở đường liên kết theo dõi được gửi qua email hoặc SMS, hoặc một Nhân viên CSKH mở đúng màn hình đó từ một lượt liên hệ.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Khách thấy trạng thái hiện tại, chính xác, của đơn hàng và từng lô giao của mình mà không phải liên hệ ai. <strong>Đây là use case mang lại BO-4 — giảm 60% số lượt liên hệ WISMO</strong> — và nó chỉ chạy được vì UC-08 giữ cho trạng thái luôn tươi.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Đơn tồn tại và đã được kiểm tính hợp lệ. <br> PRE-2: Yêu cầu mang một token theo dõi hợp lệ, riêng cho đơn đó.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Không tiết lộ dữ liệu khách hàng nào ngoài đúng một đơn mà token tham chiếu tới. <br> POST-2: Lượt xem được ghi nhật ký, để đo được mức sử dụng tự phục vụ so với mục tiêu WISMO.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>9.0</strong> <br> 1. Khách mở đường liên kết theo dõi. <br> 2. Hệ thống kiểm token và phân giải ra đơn hàng. <br> 3. Hệ thống hiển thị tóm tắt đơn, từng lô giao, hãng vận chuyển và mã theo dõi của nó, trạng thái hiện tại và lịch sử sự kiện. <br> 4. Hệ thống hiển thị ngày giao dự kiến của từng lô giao. <br> 5. Khách có thể đi theo đường liên kết theo dõi của chính hãng để xem chi tiết phía hãng.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>9.1 — Đơn bị tách.</strong> Ở bước 3, đơn có nhiều lô giao; hệ thống hiện từng cái riêng kèm hãng và trạng thái của nó, và giải thích rằng đơn đã bị tách. <br> <strong>9.2 — Màn hình của nhân viên.</strong> Một Nhân viên CSKH mở cùng đơn đó từ bảng điều khiển hỗ trợ và thấy thêm chi tiết ngoại lệ nội bộ vốn không hiện cho khách. <br> <strong>9.3 — Đơn chưa xuất hàng.</strong> Đơn chưa có lô giao nào; hệ thống hiện trạng thái ở mức đơn hàng (Validated, Reserved, Routed, Picking) bằng câu chữ thân thiện với khách, thay vì một trang trắng.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>9.0.E1 — Token sai hoặc hết hạn.</strong> Ở bước 2, token không qua được phép kiểm. Hệ thống hiện một trang chung "liên kết không hợp lệ" và <strong>không</strong> tiết lộ đơn đó có tồn tại hay không. <br> <strong>9.0.E2 — Đơn đã bị huỷ.</strong> Đơn đã bị huỷ; hệ thống hiện việc huỷ và ngày huỷ, không hiện một lỗi. <br> <strong>9.0.E3 — Trạng thái của hãng đã cũ.</strong> Sự kiện gần nhất của hãng cũ hơn 48 giờ; hệ thống hiện trạng thái biết được gần nhất kèm dấu thời gian và một dòng ghi rõ "chưa có cập nhật từ", thay vì ngụ ý rằng mình đang biết hiện trạng.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Trung bình — hoãn sang bản 1.2</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Giả định 35% số đơn được xem ít nhất một lần, mỗi đơn ~1,8 lượt: trung bình ~2.800 lượt xem/ngày.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-09</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Đây là bề mặt duy nhất của OMFS hướng tới khách và là bề mặt duy nhất phơi ra Internet công cộng, nên mô hình token ở PRE-2/POST-1 là một yêu cầu an ninh, không phải một tiện ích: việc đoán ra token của khách khác phải là bất khả thi (SRS §6.3). Việc không đòi đăng nhập là có chủ đích (EX-8) — đòi đăng nhập sẽ đẩy khách quay lại hàng chờ hỗ trợ. Ngoại lệ 9.0.E3 là sự trung thực có chủ đích: giả vờ như mình biết chính là thứ phá huỷ niềm tin vào một trang theo dõi.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Khách nhận được đường liên kết theo dõi lúc xuất hàng, qua email hoặc SMS thông qua Dịch vụ Thông báo.</td>
</tr>
</tbody>
</table>
<h3>UC-10 — Xử lý một ngoại lệ hoàn tất đơn</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-10 — Xử lý một ngoại lệ hoàn tất đơn</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 3</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Quản lý hoàn tất đơn</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Bất kỳ use case nào phát ra một ngoại lệ, hoặc Quản lý hoàn tất đơn mở bảng xử lý ngoại lệ.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Mọi sự cố trong vòng đời hoàn tất đơn — chờ hàng, vượt giới hạn tách, nhặt thiếu, không hãng nào đủ điều kiện, giao hỏng, lô giao đứng im — đều nổi lên trong một hàng chờ duy nhất, kèm các phương án xử lý phù hợp với đúng loại của nó. Thiếu cái này thì ngoại lệ vô hình cho tới khi có khách phàn nàn.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Người dùng đã xác thực với vai Quản lý hoàn tất đơn hoặc Kiểm soát tồn kho. <br> PRE-2: Tồn tại ít nhất một ngoại lệ đang mở.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Mọi ngoại lệ đều kết thúc bằng một cách xử lý được ghi lại kèm người làm, dấu thời gian và lý do — không bao giờ biến mất âm thầm. <br> POST-2: Đơn hàng hoặc lô giao bị ảnh hưởng được để lại ở một trạng thái hợp lệ và nhất quán.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>10.0</strong> <br> 1. Người quản lý mở bảng điều khiển; hệ thống liệt kê các ngoại lệ đang mở, sắp theo tuổi và mức rủi ro trễ ngày giao (BR-09). <br> 2. Người quản lý chọn một ngoại lệ; hệ thống hiện đơn hàng, nguyên nhân, và các phương án xử lý hợp lệ với đúng loại ngoại lệ đó. <br> 3. Người quản lý chọn một cách xử lý. <br> 4. Hệ thống áp dụng nó, cập nhật đơn hàng hoặc lô giao. <br> 5. Hệ thống ghi lại cách xử lý, người làm và lý do (POST-1). <br> 6. Hệ thống đóng ngoại lệ và đưa đơn quay lại vòng đời ở đúng use case tương ứng.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>10.1 — Xử lý chờ hàng.</strong> Các phương án: chờ hàng nhập về, lấy từ một trung tâm khác bằng cách chạy lại UC-04, đổi sang một SKU khác khi khách đồng ý, hoặc huỷ dòng đó qua UC-11. <br> <strong>10.2 — Nhặt thiếu.</strong> Các phương án: nhặt lại ở một vị trí khác, định tuyến lại dòng đó sang trung tâm khác, giao thiếu và hoàn lại phần chênh, hoặc huỷ dòng. <br> <strong>10.3 — Không hãng nào đủ điều kiện.</strong> Các phương án: đóng gói lại thành thùng nhỏ hơn rồi chạy lại UC-07, đặt một đơn vị chuyển phát thủ công bên ngoài OMFS và ghi mã theo dõi vào, hoặc huỷ. <br> <strong>10.4 — Giao hỏng hoặc lô giao đứng im.</strong> Các phương án: xin giao lại, chuyển hướng tới điểm nhận hàng, hoặc mở một khiếu nại với hãng. <br> <strong>10.5 — Xử lý hàng loạt.</strong> Người quản lý chọn nhiều ngoại lệ cùng loại và cùng nguyên nhân rồi áp một cách xử lý cho tất cả.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>10.0.E1 — Cách xử lý không còn hợp lệ.</strong> Ở bước 4, trạng thái nền đã đổi (hàng đã về, đơn đã bị huỷ rồi). Hệ thống từ chối cách xử lý đó, làm mới ngoại lệ, và mời người quản lý chọn lại. <br> <strong>10.0.E2 — Cách xử lý áp dụng dở dang.</strong> Hệ thống áp các cách xử lý theo kiểu giao dịch; nếu một bước hỏng thì không gì được áp dụng và ngoại lệ vẫn mở (POST-2). <br> <strong>10.0.E3 — Ngoại lệ quá hạn SLA.</strong> Một ngoại lệ mở lâu hơn SLA đã cấu hình sẽ được leo thang lên cấp trên của Quản lý hoàn tất đơn và được đánh dấu trên bảng điều khiển (UC-14).</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Trung bình — hoãn sang bản 1.2; tới lúc đó, ngoại lệ được xử lý từ một báo cáo</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Giả định ~4% số đơn phát sinh ít nhất một ngoại lệ: trung bình ~180/ngày, đỉnh ~720/ngày.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-05, BR-09, BR-13</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Các phương án xử lý cố ý <strong>riêng theo từng loại</strong> (10.1–10.4): một bảng điều khiển kiểu chung chung "chuyển lại / huỷ / bỏ qua" sẽ đẩy quyết định thật về lại trí nhớ của người quản lý, mà đó đúng là quy trình thủ công dự án này đang thay thế. POST-1 làm cho nhật ký ngoại lệ trở thành nguồn của việc phân tích nguyên nhân gốc, thứ theo thời gian phải làm giảm được lượng ngoại lệ.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Việc đổi sang một SKU khác đòi hỏi sự đồng ý của khách, do Nhân viên CSKH lấy được bên ngoài OMFS.</td>
</tr>
</tbody>
</table>
<h3>UC-11 — Huỷ hoặc sửa đơn trước khi xuất hàng</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-11 — Huỷ hoặc sửa đơn trước khi xuất hàng</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 3</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Nhân viên CSKH</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Khách liên hệ hỗ trợ để huỷ hoặc đổi một đơn, hoặc sàn đẩy về một lệnh huỷ.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Một đơn có thể bị chặn lại hoặc đổi khi nó còn chặn được. Mốc chốt là thời điểm mua nhãn vận chuyển (BR-05) — sau đó kiện hàng thuộc trách nhiệm của hãng và con đường đúng là trả hàng (UC-12). Việc huỷ bắt buộc phải nhả tồn kho đang giữ, nếu không thì vấn đề bán vượt tồn chỉ đơn giản xuất hiện lại dưới một hình dạng khác.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Đơn tồn tại và chưa ở trạng thái Labelled. <br> PRE-2: Nhân viên đã xác thực với vai Nhân viên CSKH.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Mọi lượt giữ tồn của các dòng bị huỷ đều được nhả và một sự kiện tồn-kho-đổi được phát cho mỗi SKU (kích hoạt UC-13). <br> POST-2: Việc huỷ hoặc sửa được phản ánh ngược về kênh bán đã sinh ra đơn. <br> POST-3: Thay đổi được ghi lại kèm người làm, dấu thời gian và lý do.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>11.0</strong> <br> 1. Nhân viên tìm ra đơn và mở nó. <br> 2. Hệ thống hiện đơn, trạng thái hiện tại của nó, và những thao tác nào còn được phép ở trạng thái đó (BR-05). <br> 3. Nhân viên chọn Huỷ cả đơn. <br> 4. Hệ thống hỏi lý do huỷ. <br> 5. Hệ thống nhả mọi lượt giữ tồn của đơn và phát một sự kiện tồn-kho-đổi cho mỗi SKU. <br> 6. Hệ thống huỷ mọi lô giao đang mở và gỡ nó khỏi đợt nhặt hàng của nó. <br> 7. Hệ thống đặt trạng thái đơn là Cancelled và báo cho kênh bán cùng khách hàng.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>11.1 — Huỷ một dòng.</strong> Ở bước 3, nhân viên huỷ một dòng đơn lẻ; hệ thống chỉ nhả lượt giữ tồn của dòng đó và chạy lại UC-04 cho các dòng còn lại, vì việc định tuyến giờ có thể khác đi. <br> <strong>11.2 — Đổi số lượng.</strong> Nhân viên giảm số lượng của một dòng; hệ thống nhả phần chênh và tiếp tục ở bước 6. Việc tăng số lượng không được hỗ trợ — đó là một đơn mới. <br> <strong>11.3 — Đổi địa chỉ giao.</strong> Nhân viên sửa địa chỉ trước khi dán nhãn; hệ thống kiểm lại nó qua bước 1 của UC-02 và chạy lại UC-04, vì việc định tuyến phụ thuộc vào điểm đến. <br> <strong>11.4 — Kênh chủ động huỷ.</strong> Sàn đẩy về một lệnh huỷ; hệ thống thực thi bước 5–7 mà không cần nhân viên và bỏ qua phần báo cho kênh ở bước 7.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>11.0.E1 — Đơn đã dán nhãn.</strong> Ở bước 2, đơn đang ở Labelled hoặc sau đó. Hệ thống từ chối lệnh huỷ (BR-05), giải thích vì sao, và mời khởi tạo một lượt trả hàng theo UC-12 thay thế. <br> <strong>11.0.E2 — Sàn cấm sửa đơn.</strong> Ở bước 3, đơn đến từ một kênh mà chính sách của nó cấm sửa sau khi đã nhận (BR-16). Hệ thống cho phép huỷ nhưng từ chối sửa, và nói rõ luật của kênh nào đang áp dụng. <br> <strong>11.0.E3 — Đã bắt đầu nhặt hàng.</strong> Lô giao đang ở Picking. Hệ thống đánh dấu đơn cần chặn ngay, báo cho trung tâm hoàn tất đơn, và giữ lệnh huỷ ở trạng thái Pending-Stop cho tới khi trung tâm xác nhận; chỉ khi đó tồn kho mới được nhả. <br> <strong>11.0.E4 — Báo cho kênh thất bại.</strong> Ở bước 7, API của kênh lỗi. Lệnh huỷ vẫn có hiệu lực trong OMFS và việc báo cho kênh được xếp hàng chờ thử lại; đơn không bao giờ bị bỏ lại ở trạng thái đã huỷ trong hệ này mà vẫn mở ở hệ kia mà không có cảnh báo.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Trung bình</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Giả định 2,5% số đơn: trung bình ~110/ngày, đỉnh ~450/ngày.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-05, BR-16</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>11.0.E3 là trường hợp thật sự khó và là chủ đề của buổi khai thác thứ 4: giữa lúc phát đợt nhặt hàng và lúc mua nhãn, thế giới vật lý đang đi trước hệ thống. Câu trả lời được chọn — một lệnh dừng hai pha, do trung tâm hoàn tất đơn xác nhận — được Quản lý hoàn tất đơn ưa hơn so với một lệnh huỷ lạc quan có nguy cơ giao đi một đơn đã huỷ.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Việc hoàn tiền do bộ phận tài chính thực hiện trên cổng thanh toán; OMFS ghi nhận rằng có một khoản hoàn tiền phải trả nhưng không chuyển tiền (EX-5).</td>
</tr>
</tbody>
</table>
<h3>UC-12 — Xử lý trả hàng và nhập lại kho</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-12 — Xử lý trả hàng và nhập lại kho (RMA)</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 3</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Nhân viên CSKH</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Khách xin trả hàng, hoặc một hãng trả về một kiện hàng không giao được cho trung tâm hoàn tất đơn.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Một lượt trả hàng được cho phép, hàng quay về, được kiểm tra, và tồn kho hoặc được đưa lại lên kệ hoặc bị đưa vào khu cách ly. Việc nhập lại kho quan trọng với dự án này vì những đơn vị hàng trả về mà không bao giờ quay lại ATP chính là tồn kho vô hình — và điều đó đẩy tỉ lệ bán vượt tồn đi sai hướng.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Đơn chứa ít nhất một dòng đã giao. <br> PRE-2: Việc trả hàng được xin trong cửa sổ trả hàng (BR-14).</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Mọi đơn vị hàng trả về đều kết thúc ở đúng một trong ba trạng thái: nhập lại kho bán được, đưa vào khu cách ly, hoặc ghi giảm. <br> POST-2: Các đơn vị nhập lại kho xuất hiện trong ATP và một sự kiện tồn-kho-đổi được phát (kích hoạt UC-13). <br> POST-3: Kết quả trả hàng được ghi lại gắn với dòng đơn hàng gốc.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>12.0</strong> <br> 1. Nhân viên mở đơn đã giao và chọn các dòng cần trả. <br> 2. Hệ thống kiểm cửa sổ trả hàng (BR-14) và tạo một RMA kèm số cho phép trả hàng. <br> 3. Hệ thống phát ra hướng dẫn trả hàng và, ở nơi hãng hỗ trợ, một nhãn trả hàng. <br> 4. Khách gửi hàng về; hãng giao hàng tới trung tâm hoàn tất đơn. <br> 5. Một Nhân viên kho quét số RMA và các món hàng trả về. <br> 6. Nhân viên kiểm từng món và ghi lại kết quả: còn bán được, hỏng, hoặc thiếu. <br> 7. Với món còn bán được, hệ thống tăng tồn thực tế và phát một sự kiện tồn-kho-đổi (BR-15). Với món hỏng, nó chuyển số lượng đó vào khu cách ly. <br> 8. Hệ thống đóng RMA và ghi nhận rằng có một khoản hoàn tiền phải trả.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>12.1 — Kiện hàng bị hãng trả về vì không giao được.</strong> Kiện hàng quay về mà không có yêu cầu của khách; hệ thống tự tạo RMA ở bước 5 khi nhân viên quét nhãn lô giao gốc, rồi tiếp tục từ bước 6. <br> <strong>12.2 — Trả một phần.</strong> Khách trả ít món hơn số đã được cho phép; hệ thống ghi lại phần chênh và chỉ đóng RMA cho số lượng thực nhận. <br> <strong>12.3 — Đổi hàng.</strong> Nhân viên tạo một đơn thay thế liên kết với RMA; đơn thay thế đi theo vòng đời bình thường từ UC-02.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>12.0.E1 — Hết cửa sổ trả hàng.</strong> Ở bước 2, ngày giao nằm ngoài cửa sổ (BR-14). Hệ thống từ chối tạo RMA và hiện ngày giao cùng cửa sổ; một giám sát viên có thể ghi đè kèm lý do được ghi lại. <br> <strong>12.0.E2 — Hàng không bao giờ về.</strong> RMA mở lâu hơn 30 ngày kể từ lúc cho phép. Hệ thống đóng nó với trạng thái Not-Received và không phát sinh khoản hoàn tiền nào. <br> <strong>12.0.E3 — Hàng trả về không nhận dạng được.</strong> Ở bước 5, kiện hàng không mang RMA hay mã lô giao nào đọc được. Nhân viên ghi nó vào hàng chờ hàng-trả-không-rõ cho Nhân viên CSKH thay vì đoán ra một đơn nào đó. <br> <strong>12.0.E4 — Lệch số lượng.</strong> Số lượng nhận về vượt số lượng đã cho phép. Hệ thống nhận đúng số đã cho phép và phát một ngoại lệ cho UC-10 với phần dư.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Thấp — hoãn sang bản 2.0</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Giả định 6% số đơn đã giao: trung bình ~270 RMA/ngày.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-14, BR-15</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Việc kiểm hàng (bước 6) là một phán đoán của con người mà OMFS ghi lại chứ không tự đưa ra. Luật duy nhất hệ thống cưỡng chế là BR-15: một món hàng hỏng không được âm thầm quay lại tồn kho bán được. Việc thực hiện hoàn tiền nằm ngoài phạm vi (EX-5); OMFS ghi nhận nghĩa vụ đó và bộ phận tài chính hành động theo.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Mỗi trung tâm hoàn tất đơn có một khu nhận hàng trả về và một vị trí cách ly được chỉ định.</td>
</tr>
</tbody>
</table>
<h3>UC-13 — Đồng bộ số tồn kho ra các kênh bán</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-13 — Đồng bộ số tồn kho ra các kênh bán</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>OMFS (hệ thống, theo sự kiện)</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>UC-03, UC-06, UC-11 hoặc UC-12 phát ra một sự kiện tồn-kho-đổi, hoặc bộ hẹn giờ đối soát nổ (mỗi giờ).</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Mỗi khi số lượng bán được của một SKU thay đổi vì bất kỳ lý do gì, OMFS đẩy con số mới tới mọi kênh có bán nó. Đi cùng với việc giữ tồn ở UC-03, đây là thứ khép lại lỗ hổng bán vượt tồn: giữ tồn chặn được lần bán thứ hai, còn đồng bộ chặn được việc kênh bán vẫn chào bán số hàng không còn tồn tại.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: SKU được ánh xạ tới ít nhất một kênh bán đang Active. <br> PRE-2: Thông tin xác thực API của kênh còn hợp lệ.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Mọi kênh Active có bán SKU đó đều đã được gửi số lượng bán được hiện tại, hoặc một lần đồng bộ thất bại được ghi lại cho đúng kênh và SKU đó. <br> POST-2: Số lượng đã gửi và dấu thời gian gửi được ghi lại theo từng kênh và từng SKU, để phát hiện được độ trôi.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>13.0</strong> <br> 1. Hệ thống nhận một sự kiện tồn-kho-đổi cho một SKU. <br> 2. Hệ thống tính số lượng bán được để công bố: tổng ATP trên mọi trung tâm đang Open (BR-07), trừ đi phần đệm riêng theo kênh nếu có. <br> 3. Hệ thống xác định những kênh Active nào bán SKU đó. <br> 4. Hệ thống gom các lượt cập nhật theo từng kênh để nằm trong hạn mức gọi của kênh. <br> 5. Hệ thống gửi lượt cập nhật và lưu số lượng đã gửi cùng dấu thời gian (POST-2).</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>13.1 — Đối soát hằng giờ.</strong> Bộ hẹn giờ nổ; hệ thống đọc số lượng mà từng kênh hiện đang tin là mình có, so với OMFS, và đẩy lại mọi SKU nào lệch. Việc này bắt được các lượt cập nhật bị rơi âm thầm. <br> <strong>13.2 — Gộp các lượt cập nhật.</strong> Nhiều sự kiện tồn-kho-đổi tới cho cùng một SKU trong cửa sổ gom; hệ thống chỉ gửi số lượng mới nhất, không gửi mỗi sự kiện một lượt. <br> <strong>13.3 — Kích hoạt kênh.</strong> Một kênh vừa được kích hoạt; hệ thống đẩy đầy đủ mọi SKU đã ánh xạ.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>13.0.E1 — Kênh từ chối lượt cập nhật.</strong> Kênh trả về lỗi cho một SKU. Hệ thống ghi lại lần hỏng, thử lại theo lùi bậc, và sau ba lần hỏng thì phát một cảnh báo tích hợp có nêu tên SKU và kênh. <br> <strong>13.0.E2 — Chạm hạn mức gọi.</strong> Ở bước 4, kênh báo hiệu đang bóp băng thông. Hệ thống xếp hàng các lượt cập nhật còn lại và tiếp tục sau khoảng thời gian thử lại mà kênh nêu ra; không lượt cập nhật nào bị bỏ. <br> <strong>13.0.E3 — Không liên lạc được với kênh.</strong> API của kênh chết. Hệ thống xếp hàng các lượt cập nhật và, khi sự cố vượt 15 phút, phát một cảnh báo, vì tồn kho cũ trên kênh chính là nguyên nhân trực tiếp của việc bán vượt tồn. <br> <strong>13.0.E4 — Số lượng tính ra bị âm.</strong> Ở bước 2, phép tính cho ra một số âm, và điều đó cho thấy có lỗi dữ liệu. Hệ thống công bố số không, phát một cảnh báo chất lượng dữ liệu cho Kiểm soát tồn kho, và không công bố giá trị âm.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Cao</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>Trung bình ~25.000 sự kiện tồn-kho-đổi/ngày, gộp lại thành ~9.000 lượt cập nhật kênh/ngày; ~4 lần con số đó vào ngày đỉnh.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-07, BR-17, BR-20</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Mốc công bố 60 giây ở BR-20 là yêu cầu độ trễ chặt nhất của cả hệ thống và là lý do UC-13 chạy theo sự kiện chứ không theo lịch. Phần đối soát hằng giờ ở 13.1 tồn tại vì nhóm không thể giả định rằng mọi lượt đẩy đều thành công — quy trình hiện tại hỏng một cách âm thầm và không ai để ý cho tới khi xảy ra một lần bán vượt tồn.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Mọi kênh đều mở cả một endpoint cập nhật tồn kho lẫn một endpoint đọc tồn kho; không có endpoint đọc thì 13.1 thoái hoá thành một lượt đẩy lại mù.</td>
</tr>
</tbody>
</table>
<h3>UC-14 — Xem bảng điều khiển hiệu suất hoàn tất đơn</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Mã và tên UC</strong></td>
<td>UC-14 — Xem bảng điều khiển hiệu suất hoàn tất đơn</td>
</tr>
<tr>
<td><strong>Người soạn</strong></td>
<td>Thành viên 2</td>
</tr>
<tr>
<td><strong>Actor chính</strong></td>
<td>Quản lý hoàn tất đơn</td>
</tr>
<tr>
<td><strong>Kích hoạt</strong></td>
<td>Người dùng mở bảng điều khiển, hoặc bản tóm tắt hằng ngày theo lịch được sinh ra.</td>
</tr>
<tr>
<td><strong>Mô tả</strong></td>
<td>Một màn hình duy nhất cho thấy khâu hoàn tất đơn có đạt mục tiêu hay không: thông lượng, thời gian từ nhận đơn tới xuất hàng, tỉ lệ bán vượt tồn, lượng ngoại lệ và chi phí vận chuyển mỗi đơn. Mục đích của nó là làm cho sáu mục tiêu nghiệp vụ trong tài liệu Vision &amp; Scope nhìn thấy được liên tục thay vì phải dựng lại vào cuối quý.</td>
</tr>
<tr>
<td><strong>Tiền điều kiện</strong></td>
<td>PRE-1: Người dùng đã xác thực với một vai có quyền truy cập bảng điều khiển. <br> PRE-2: Có ít nhất một ngày dữ liệu vận hành.</td>
</tr>
<tr>
<td><strong>Hậu điều kiện</strong></td>
<td>POST-1: Người dùng chỉ thấy những trung tâm, kênh bán và nhãn hàng mà vai của họ cho phép. <br> POST-2: Mọi con số đều hiển thị giai đoạn nó phủ và thời điểm nó được làm mới lần cuối.</td>
</tr>
<tr>
<td><strong>Luồng chính</strong></td>
<td><strong>14.0</strong> <br> 1. Người dùng mở bảng điều khiển. <br> 2. Hệ thống áp phạm vi dữ liệu của người dùng (POST-1). <br> 3. Hệ thống hiển thị các chỉ số đầu bảng so với mục tiêu của chúng: số đơn đã giao, thời gian từ nhận đơn tới xuất hàng, tỉ lệ bán vượt tồn, tỉ lệ định tuyến tự động, số ngoại lệ đang mở và chi phí vận chuyển mỗi đơn. <br> 4. Hệ thống hiển thị xu hướng của từng chỉ số trong giai đoạn được chọn. <br> 5. Người dùng đổi bộ lọc theo giai đoạn, trung tâm, kênh bán hoặc nhãn hàng. <br> 6. Hệ thống tính lại và hiển thị lại.</td>
</tr>
<tr>
<td><strong>Luồng thay thế</strong></td>
<td><strong>14.1 — Đào sâu.</strong> Người dùng bấm vào một chỉ số; hệ thống liệt kê các đơn hàng hoặc ngoại lệ nằm dưới nó. <br> <strong>14.2 — Xuất dữ liệu.</strong> Người dùng xuất màn hình hiện tại ra CSV để phân tích ngoại tuyến. <br> <strong>14.3 — Tóm tắt theo lịch.</strong> Hệ thống gửi email một bản tóm tắt hằng ngày tới các quản lý đã đăng ký, lúc 07:00 giờ địa phương. <br> <strong>14.4 — Màn hình chi phí theo hãng.</strong> Quản lý logistics mở phần bóc tách chi phí theo từng hãng, so mức giá đã báo (UC-07 POST-2) với số tiền trên hoá đơn.</td>
</tr>
<tr>
<td><strong>Ngoại lệ</strong></td>
<td><strong>14.0.E1 — Không đủ dữ liệu.</strong> Giai đoạn được chọn không có dữ liệu nào. Hệ thống hiện một trạng thái tường minh "không có dữ liệu cho giai đoạn này" thay vì hiện số không, vì số không sẽ bị đọc thành một kết quả thảm hoạ. <br> <strong>14.0.E2 — Phép tính chỉ số quá hạn thời gian.</strong> Hệ thống hiển thị các chỉ số đã tính xong và đánh dấu phần còn lại là không khả dụng kèm nút thử lại, thay vì làm hỏng cả trang. <br> <strong>14.0.E3 — Số liệu tổng hợp đã cũ.</strong> Tác vụ tổng hợp chưa chạy gần đây. Hệ thống hiện dấu thời gian làm mới lần cuối thật nổi bật (POST-2) và cảnh báo rằng các con số đã cũ.</td>
</tr>
<tr>
<td><strong>Độ ưu tiên</strong></td>
<td>Thấp — hoãn sang bản 2.0</td>
</tr>
<tr>
<td><strong>Tần suất dùng</strong></td>
<td>~15 người dùng, mỗi người ~4 lượt xem/ngày: ~60 lượt xem/ngày. Bản tóm tắt hằng ngày: 1/ngày.</td>
</tr>
<tr>
<td><strong>Business Rule</strong></td>
<td>BR-06, BR-09, BR-18</td>
</tr>
<tr>
<td><strong>Thông tin khác</strong></td>
<td>Định nghĩa các chỉ số phải <strong>giống hệt</strong> các thước đo thành công ở Vision &amp; Scope §1.4 — nếu bảng điều khiển tính tỉ lệ bán vượt tồn khác với tiêu chí thành công của dự án thì dự án không chứng minh được là mình đã thành công. Bố cục báo cáo được đặc tả ở SRS §4.3.</td>
</tr>
<tr>
<td><strong>Giả định</strong></td>
<td>Việc tổng hợp gần-thời-gian-thực là chấp nhận được; các con số có thể trễ so với dữ liệu sống tới 15 phút.</td>
</tr>
</tbody>
</table>
<hr />
<h3>4. Use Case Diagram</h3>
<p>Xem <code>diagrams/use-case-diagram.drawio</code> (sửa được) và <code>diagrams/use-case-diagram.png</code> (dùng cho SRS Phụ lục B).</p>
<p><strong>Cách đọc sơ đồ</strong></p>
<ul>
<li>Actor chính nằm bên <strong>trái</strong>, actor phụ (hệ thống) nằm bên <strong>phải</strong>.</li>
<li>Hình chữ nhật là <strong>ranh giới hệ thống</strong> — mọi thứ bên trong nó thuộc trách nhiệm của OMFS; storefront trên web, cổng thanh toán và ERP nằm ngoài một cách có chủ đích (xem Vision &amp; Scope §2.4 Giới hạn và loại trừ).</li>
<li>Mũi tên <code>«include»</code> đi <strong>từ</strong> use case cơ sở <strong>tới</strong> use case luôn luôn được thực thi.</li>
<li>Mũi tên <code>«extend»</code> đi <strong>từ</strong> use case tuỳ chọn <strong>tới</strong> use case cơ sở mà nó mở rộng.</li>
</ul>
<p><strong>Các quan hệ được thể hiện</strong></p>
<table>
<thead>
<tr>
<th>Quan hệ</th>
<th>Từ</th>
<th>Tới</th>
<th>Vì sao</th>
</tr>
</thead>
<tbody>
<tr>
<td>«include»</td>
<td>UC-01 Nhận một đơn</td>
<td>UC-02 Sàng lọc và kiểm tính hợp lệ</td>
<td>Mọi đơn nhận vào đều được sàng lọc trước khi nó chiếm được tồn kho</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-02 Sàng lọc và kiểm tính hợp lệ</td>
<td>UC-03 Giữ tồn kho</td>
<td>Mọi đơn đã kiểm đều giữ tồn</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-03 Giữ tồn kho</td>
<td>UC-04 Định tuyến và tách đơn</td>
<td>Mọi đơn đã giữ tồn đều được định tuyến</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-06 Nhặt và đóng gói</td>
<td>UC-07 So giá và mua nhãn</td>
<td>Mọi lô giao đã đóng gói đều được dán nhãn</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-03 Giữ tồn kho</td>
<td>UC-13 Đồng bộ tồn kho</td>
<td>Mọi lượt giữ tồn đều làm đổi số hàng bán được, luôn luôn</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-06 Nhặt và đóng gói</td>
<td>UC-13 Đồng bộ tồn kho</td>
<td>Việc nhặt hàng trừ tồn thực tế, luôn luôn</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-11 Huỷ hoặc sửa đơn</td>
<td>UC-13 Đồng bộ tồn kho</td>
<td>Việc huỷ nhả tồn kho ra, luôn luôn</td>
</tr>
<tr>
<td>«include»</td>
<td>UC-07 So giá và mua nhãn</td>
<td>UC-09 Theo dõi một đơn hàng</td>
<td>Việc dán nhãn luôn phát ra đường liên kết theo dõi cho khách</td>
</tr>
<tr>
<td>«extend»</td>
<td>UC-10 Xử lý ngoại lệ</td>
<td>UC-03 Giữ tồn kho</td>
<td>Chỉ khi việc giữ tồn thất bại</td>
</tr>
<tr>
<td>«extend»</td>
<td>UC-10 Xử lý ngoại lệ</td>
<td>UC-04 Định tuyến và tách đơn</td>
<td>Chỉ khi việc định tuyến thất bại</td>
</tr>
<tr>
<td>«extend»</td>
<td>UC-10 Xử lý ngoại lệ</td>
<td>UC-07 So giá và mua nhãn</td>
<td>Chỉ khi không hãng nào đủ điều kiện</td>
</tr>
<tr>
<td>«extend»</td>
<td>UC-12 Xử lý trả hàng</td>
<td>UC-08 Nhận sự kiện theo dõi</td>
<td>Chỉ khi hãng trả về một kiện hàng không giao được</td>
</tr>
</tbody>
</table></div>`,
  ].join('\n'),
};

const TP2L3 = {
  title: "W2.3 — Deliverable 3: 20 business rules, all five types|||W2.3 — Deliverable 3: 20 business rule, đủ năm loại",
  slug: "swr302-tp2-goi-03-business-rules",
  type: 'DOCUMENT',
  description: "Catalog 20 business rule phân loại đủ năm loại của Chapter 9, đánh dấu tĩnh/động, ghi nguồn từng rule, bảng những rule CỐ Ý không đưa vào phần mềm, cách khám phá rule, và ma trận truy vết rule → use case → requirement.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP2 · Deliverable 3</span>
<h2>Twenty rules, and three things most teams miss</h2>
<p class="lead">The table itself is easy. The marks are in the three sections around it.</p>
<ul>
<li><strong>§2.2 — what "dynamic" costs you.</strong> Fourteen of the twenty rules are dynamic, so their values must be configurable by a named business role. A team that hard-codes a 30-day return window has guaranteed a code change the first time marketing runs a 45-day holiday promotion.</li>
<li><strong>§3 — rules deliberately NOT enforced in software.</strong> Four of them, with reasons. Recording what you decided <em>not</em> to build stops it being re-argued in a later release, and it proves you distinguished a business rule from a system requirement.</li>
<li><strong>§5 — traceability, and a check that was actually run.</strong> Every rule maps to a use case and a requirement, and the document states that a rule with no enforcing use case would be a gap. That is an assertion the grader can test in thirty seconds.</li>
</ul>
<div class="callout ok"><strong>BR-07 is the rule that does the work.</strong> "ATP = on-hand − reserved − damaged − safety stock" is a <em>computation</em>, not a constraint. Teams that write only "inventory must be accurate" have named the symptom; this names the mechanism.</div>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP2 · Deliverable 3</span>
<h2>Hai mươi rule, và ba thứ phần lớn nhóm bỏ sót</h2>
<p class="lead">Bản thân cái bảng thì dễ. Điểm nằm ở ba mục bao quanh nó.</p>
<ul>
<li><strong>§2.2 — "động" khiến bạn tốn gì.</strong> Mười bốn trong hai mươi rule là động, nên giá trị của chúng phải cấu hình được bởi một vai nghiệp vụ cụ thể. Nhóm nhúng cứng cửa sổ trả hàng 30 ngày là đã bảo đảm sẽ phải sửa mã ngay lần đầu marketing chạy khuyến mãi 45 ngày dịp lễ.</li>
<li><strong>§3 — những rule CỐ Ý không đưa vào phần mềm.</strong> Bốn cái, có lý do. Ghi lại thứ bạn quyết định <em>không</em> làm sẽ chặn nó bị đem ra cãi lại ở bản sau, và chứng minh bạn phân biệt được business rule với system requirement.</li>
<li><strong>§5 — truy vết, và một phép kiểm ĐÃ CHẠY THẬT.</strong> Mọi rule đều ánh xạ tới một use case và một requirement, và tài liệu nói rõ rule không có use case nào thực thi là một lỗ hổng. Đó là khẳng định người chấm kiểm được trong ba mươi giây.</li>
</ul>
<div class="callout ok"><strong>BR-07 mới là rule làm việc thật.</strong> "ATP = tồn thực − đã giữ chỗ − hỏng − tồn an toàn" là một <em>computation</em>, không phải constraint. Nhóm chỉ viết "tồn kho phải chính xác" là mới gọi tên triệu chứng; câu này gọi tên cơ chế.</div>`,
    ),
    `<div class="ml-en"><h2>Business Rules</h2>
<h2>for the Order Management and Fulfillment System (OMFS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Team Leader name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Nova Retail Group (NRG)
17 September 2026</p>
<hr />
<h3>Revision History</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Date</th>
<th>Reason For Changes</th>
<th>Version</th>
</tr>
</thead>
<tbody>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Rules harvested from elicitation sessions 1–4</td>
<td>0.9</td>
</tr>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Classified, de-duplicated and cross-referenced to use cases</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Purpose and scope</h3>
<p>This document is NRG's catalog of the business rules that govern order fulfillment.
A <strong>business rule</strong> is a policy, regulation, standard, computation or definition that
exists in the business <strong>independently of any software</strong>, but which the software may
be required to enforce. Rules are recorded here <strong>once</strong>; every use case and every
functional requirement that enforces a rule refers to it <strong>by ID only</strong>, never by
copying its text (see §5, Traceability).</p>
<p>Rules are classified using the five-type taxonomy from Wiegers &amp; Beatty, <em>Software
Requirements</em>, 3rd ed., Chapter 9:</p>
<table>
<thead>
<tr>
<th>Type</th>
<th>Meaning</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Fact</strong></td>
<td>A true statement about the business; an invariant of the domain</td>
</tr>
<tr>
<td><strong>Constraint</strong></td>
<td>Something that must or must not happen; restricts an action</td>
</tr>
<tr>
<td><strong>Action enabler</strong></td>
<td>A condition that, when true, triggers an action</td>
</tr>
<tr>
<td><strong>Inference</strong></td>
<td>New knowledge derived from existing facts ("if A then B is true")</td>
</tr>
<tr>
<td><strong>Computation</strong></td>
<td>A formula that produces a value</td>
</tr>
</tbody>
</table>
<p><strong>Static or Dynamic</strong> records whether the <em>rule itself</em> is expected to change over
time. Dynamic rules must be <strong>configurable in the system</strong>, not compiled into it;
this distinction is the single most useful thing in the table for the development
team.</p>
<hr />
<h3>2. The rules</h3>
<table>
<thead>
<tr>
<th>ID</th>
<th>Rule Definition</th>
<th>Type of Rule</th>
<th>Static or Dynamic</th>
<th>Source</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>BR-01</strong></td>
<td>An order line is fulfilled from exactly one fulfillment center. A line is never split across centers; an <em>order</em> may be split, a <em>line</em> may not.</td>
<td>Fact</td>
<td>Static</td>
<td>Fulfillment Manager, session 2</td>
</tr>
<tr>
<td><strong>BR-02</strong></td>
<td>Stock may be reserved for an order line only when available-to-promise for that SKU at the selected fulfillment center is greater than or equal to the ordered quantity.</td>
<td>Constraint</td>
<td>Static</td>
<td>Inventory Controller, session 2</td>
</tr>
<tr>
<td><strong>BR-03</strong></td>
<td>All lines of a single order are delivered to one shipping address. A customer wanting two addresses must place two orders.</td>
<td>Constraint</td>
<td>Static</td>
<td>Fulfillment Manager, session 2</td>
</tr>
<tr>
<td><strong>BR-04</strong></td>
<td>If payment authorization is not confirmed within 30 minutes of a reservation being created, the reservation is released.</td>
<td>Action enabler</td>
<td>Dynamic</td>
<td>Finance policy (COO), session 3</td>
</tr>
<tr>
<td><strong>BR-05</strong></td>
<td>An order may be cancelled or modified only before its shipping label has been purchased. After that, the correct process is a return.</td>
<td>Constraint</td>
<td>Static</td>
<td>Customer Service Manager, session 3</td>
</tr>
<tr>
<td><strong>BR-06</strong></td>
<td>Routing score = (w₁ × stock coverage) + (w₂ × proximity to destination) + (w₃ × expected shipping cost) + (w₄ × remaining center capacity), where w₁+w₂+w₃+w₄ = 1.0. The center with the highest score fulfills the order.</td>
<td>Computation</td>
<td>Dynamic</td>
<td>Fulfillment Manager, session 2</td>
</tr>
<tr>
<td><strong>BR-07</strong></td>
<td>Available-to-promise (ATP) = on-hand − reserved − damaged − safety stock, computed per SKU per fulfillment center.</td>
<td>Computation</td>
<td>Dynamic</td>
<td>Inventory Controller, session 2</td>
</tr>
<tr>
<td><strong>BR-08</strong></td>
<td>An order may be split across at most three fulfillment centers. An order requiring more than three becomes a fulfillment exception.</td>
<td>Constraint</td>
<td>Dynamic</td>
<td>Fulfillment Manager, session 2</td>
</tr>
<tr>
<td><strong>BR-09</strong></td>
<td>An order is "at risk" when (promised delivery date − today) is less than the selected carrier's published transit time for the destination.</td>
<td>Inference</td>
<td>Dynamic</td>
<td>Logistics Manager, session 3</td>
</tr>
<tr>
<td><strong>BR-10</strong></td>
<td>Orders routed to a fulfillment center after 14:00 local time are dispatched on the next working day.</td>
<td>Fact</td>
<td>Dynamic</td>
<td>Fulfillment Manager, session 2</td>
</tr>
<tr>
<td><strong>BR-11</strong></td>
<td>A carrier is eligible for a shipment only if it serves the destination postcode <strong>and</strong> the parcel is within that carrier's weight and dimension limits <strong>and</strong> the carrier is marked Active.</td>
<td>Constraint</td>
<td>Dynamic</td>
<td>Logistics Manager, session 3</td>
</tr>
<tr>
<td><strong>BR-12</strong></td>
<td>Landed shipping cost = base rate for the weight band + remote-area surcharge (if applicable) + fuel surcharge − contracted volume discount.</td>
<td>Computation</td>
<td>Dynamic</td>
<td>Logistics Manager, session 3</td>
</tr>
<tr>
<td><strong>BR-13</strong></td>
<td>If a shipment released in a pick wave has not been picked within 24 hours of release, it is escalated to the Fulfillment Manager.</td>
<td>Action enabler</td>
<td>Dynamic</td>
<td>Fulfillment Manager, session 2</td>
</tr>
<tr>
<td><strong>BR-14</strong></td>
<td>A return is accepted only within 30 days of the delivery date recorded against the shipment.</td>
<td>Constraint</td>
<td>Dynamic</td>
<td>Customer Service Manager, session 3</td>
</tr>
<tr>
<td><strong>BR-15</strong></td>
<td>On return inspection, an item recorded as sellable is restocked to available inventory; an item recorded as damaged is moved to quarantine and must not re-enter sellable stock.</td>
<td>Action enabler</td>
<td>Static</td>
<td>Inventory Controller, session 4</td>
</tr>
<tr>
<td><strong>BR-16</strong></td>
<td>Orders originating from a marketplace channel may not be modified after acceptance; they may only be cancelled in full.</td>
<td>Fact</td>
<td>Dynamic</td>
<td>Marketplace seller agreements (Brand Manager), session 3</td>
</tr>
<tr>
<td><strong>BR-17</strong></td>
<td>Safety stock is held per SKU per fulfillment center and is excluded from available-to-promise. The default is 2 units and it is configurable per SKU.</td>
<td>Constraint</td>
<td>Dynamic</td>
<td>Inventory Controller, session 2</td>
</tr>
<tr>
<td><strong>BR-18</strong></td>
<td>A SKU is "at risk of stockout" when its available-to-promise across all fulfillment centers is less than its average daily sales velocity over the previous 7 days.</td>
<td>Inference</td>
<td>Dynamic</td>
<td>Inventory Controller, session 4</td>
</tr>
<tr>
<td><strong>BR-19</strong></td>
<td>Only a user holding the Fulfillment Manager role may override an automated routing decision, and every override must record a reason.</td>
<td>Constraint</td>
<td>Static</td>
<td>COO, session 1</td>
</tr>
<tr>
<td><strong>BR-20</strong></td>
<td>When the sellable quantity of a SKU changes for any reason, the new quantity is published to every active sales channel selling that SKU within 60 seconds.</td>
<td>Action enabler</td>
<td>Dynamic</td>
<td>COO, session 1</td>
</tr>
</tbody>
</table>
<h3>2.1 Coverage by type</h3>
<table>
<thead>
<tr>
<th>Type</th>
<th>Rules</th>
<th>Count</th>
</tr>
</thead>
<tbody>
<tr>
<td>Fact</td>
<td>BR-01, BR-10, BR-16</td>
<td>3</td>
</tr>
<tr>
<td>Constraint</td>
<td>BR-02, BR-03, BR-05, BR-08, BR-11, BR-14, BR-17, BR-19</td>
<td>8</td>
</tr>
<tr>
<td>Action enabler</td>
<td>BR-04, BR-13, BR-15, BR-20</td>
<td>4</td>
</tr>
<tr>
<td>Inference</td>
<td>BR-09, BR-18</td>
<td>2</td>
</tr>
<tr>
<td>Computation</td>
<td>BR-06, BR-07, BR-12</td>
<td>3</td>
</tr>
<tr>
<td></td>
<td><strong>Total</strong></td>
<td><strong>20</strong></td>
</tr>
</tbody>
</table>
<h3>2.2 Static versus dynamic — what it means for the build</h3>
<p>Fourteen of the twenty rules are <strong>dynamic</strong>, so their values must be held in
configuration and changed by a business user, not by a developer. Specifically:</p>
<table>
<thead>
<tr>
<th>Rule</th>
<th>Configurable value</th>
<th>Who may change it</th>
</tr>
</thead>
<tbody>
<tr>
<td>BR-04</td>
<td>Reservation expiry (30 min)</td>
<td>System Administrator</td>
</tr>
<tr>
<td>BR-06</td>
<td>Routing weights w₁…w₄</td>
<td>Fulfillment Manager</td>
</tr>
<tr>
<td>BR-07</td>
<td>Which stock buckets are deducted</td>
<td>System Administrator</td>
</tr>
<tr>
<td>BR-08</td>
<td>Maximum split count (3)</td>
<td>Fulfillment Manager</td>
</tr>
<tr>
<td>BR-10</td>
<td>Dispatch cut-off time (14:00)</td>
<td>Fulfillment Manager, per center</td>
</tr>
<tr>
<td>BR-11</td>
<td>Carrier eligibility and limits</td>
<td>Logistics Manager</td>
</tr>
<tr>
<td>BR-12</td>
<td>Rate card, surcharges, discount</td>
<td>Logistics Manager</td>
</tr>
<tr>
<td>BR-13</td>
<td>Pick escalation window (24 h)</td>
<td>Fulfillment Manager</td>
</tr>
<tr>
<td>BR-14</td>
<td>Return window (30 days)</td>
<td>Customer Service Manager</td>
</tr>
<tr>
<td>BR-17</td>
<td>Safety stock default and per-SKU override</td>
<td>Inventory Controller</td>
</tr>
<tr>
<td>BR-18</td>
<td>Velocity window (7 days)</td>
<td>Inventory Controller</td>
</tr>
<tr>
<td>BR-20</td>
<td>Publication target (60 s)</td>
<td>System Administrator</td>
</tr>
</tbody>
</table>
<div class="callout">
<p>This table is why the type column matters. A team that hard-codes a 30-day
return window has not broken a requirement, but it has guaranteed a code change
the first time the business runs a 45-day holiday returns promotion.</p>
</div>
<hr />
<h3>3. Rules that are deliberately NOT enforced in software</h3>
<p>Not every business rule belongs in the system. Recording the ones that do not —
and why — prevents them being re-discovered and re-argued in a later release.</p>
<table>
<thead>
<tr>
<th>Rule</th>
<th>Why it is not enforced by OMFS</th>
</tr>
</thead>
<tbody>
<tr>
<td>Refunds are issued within 5 working days of a return being accepted</td>
<td>Refunds are executed in the payment gateway by the finance team; OMFS records that a refund is due (EX-5)</td>
</tr>
<tr>
<td>A damaged item must be photographed before being quarantined</td>
<td>A warehouse procedure, verified by supervisor audit, not by software</td>
</tr>
<tr>
<td>Marketplace seller ratings must stay above the Preferred threshold</td>
<td>An outcome the project targets, not a rule the system can enforce</td>
</tr>
<tr>
<td>Bin locations are reorganized quarterly</td>
<td>Belongs to warehouse management, explicitly out of scope (EX-3)</td>
</tr>
</tbody>
</table>
<hr />
<h3>4. How the rules were discovered</h3>
<table>
<thead>
<tr>
<th>Session</th>
<th>Date</th>
<th>Stakeholder role played</th>
<th>Technique</th>
<th>Rules yielded</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>2026-09-08</td>
<td>COO (project sponsor)</td>
<td>Structured interview, 8 prepared questions</td>
<td>BR-19, BR-20</td>
</tr>
<tr>
<td>2</td>
<td>2026-09-09</td>
<td>Fulfillment Manager + Inventory Controller</td>
<td>Facilitated workshop with current-state process walkthrough</td>
<td>BR-01, BR-02, BR-03, BR-06, BR-07, BR-08, BR-10, BR-13, BR-17</td>
</tr>
<tr>
<td>3</td>
<td>2026-09-11</td>
<td>Logistics Manager + Customer Service Manager + Brand Manager</td>
<td>Structured interview</td>
<td>BR-04, BR-05, BR-09, BR-11, BR-12, BR-14, BR-16</td>
</tr>
<tr>
<td>4</td>
<td>2026-09-12</td>
<td>Inventory Controller</td>
<td>Follow-up on open questions from session 2</td>
<td>BR-15, BR-18</td>
</tr>
</tbody>
</table>
<p><strong>Technique note.</strong> The richest source was session 2's <strong>current-state process
walkthrough</strong>: asking "and then what happens?" through the existing manual
fulfillment process surfaced nine rules, most of which nobody had ever written
down — they existed only as the habits of experienced staff. Rules discovered this
way (BR-01, BR-08, BR-10) were confirmed with the Fulfillment Manager before being
recorded, because a habit is not automatically a policy.</p>
<p><strong>Open questions carried into the SRS TBD list</strong></p>
<table>
<thead>
<tr>
<th>#</th>
<th>Question</th>
<th>Owner</th>
<th>Target</th>
</tr>
</thead>
<tbody>
<tr>
<td>TBD-1</td>
<td>Does the 30-day return window (BR-14) run from delivery or from dispatch? Two stakeholders answered differently.</td>
<td>Customer Service Manager</td>
<td>Week 7</td>
</tr>
<tr>
<td>TBD-2</td>
<td>Are the routing weights (BR-06) the same for all five brands in Release 1.0, or per brand?</td>
<td>Fulfillment Manager</td>
<td>Week 6</td>
</tr>
<tr>
<td>TBD-3</td>
<td>Does safety stock (BR-17) apply per channel as well as per fulfillment center?</td>
<td>Inventory Controller</td>
<td>Week 7</td>
</tr>
</tbody>
</table>
<hr />
<h3>5. Traceability: rule → use case → requirement</h3>
<p>Each rule is enforced by one or more use cases and, through them, by specific
functional requirements in the SRS. <strong>The rule text appears only in this document</strong>;
everything else refers to the ID.</p>
<table>
<thead>
<tr>
<th>Rule</th>
<th>Enforced in use case(s)</th>
<th>SRS functional requirement(s)</th>
</tr>
</thead>
<tbody>
<tr>
<td>BR-01</td>
<td>UC-03, UC-04</td>
<td>Reserve-2, Route-1</td>
</tr>
<tr>
<td>BR-02</td>
<td>UC-03</td>
<td>Reserve-2</td>
</tr>
<tr>
<td>BR-03</td>
<td>UC-02</td>
<td>Validate-3</td>
</tr>
<tr>
<td>BR-04</td>
<td>UC-02, UC-03</td>
<td>Reserve-3</td>
</tr>
<tr>
<td>BR-05</td>
<td>UC-10, UC-11</td>
<td>Cancel-1, Cancel-2</td>
</tr>
<tr>
<td>BR-06</td>
<td>UC-04, UC-14</td>
<td>Route-2, Route-3</td>
</tr>
<tr>
<td>BR-07</td>
<td>UC-03, UC-06, UC-13</td>
<td>Reserve-1, Sync-1</td>
</tr>
<tr>
<td>BR-08</td>
<td>UC-03, UC-04</td>
<td>Route-4</td>
</tr>
<tr>
<td>BR-09</td>
<td>UC-04, UC-08, UC-09, UC-10, UC-14</td>
<td>Track-4, Except-1</td>
</tr>
<tr>
<td>BR-10</td>
<td>UC-04, UC-05</td>
<td>Route-5, Wave-2</td>
</tr>
<tr>
<td>BR-11</td>
<td>UC-07</td>
<td>Label-1</td>
</tr>
<tr>
<td>BR-12</td>
<td>UC-07</td>
<td>Label-2</td>
</tr>
<tr>
<td>BR-13</td>
<td>UC-05, UC-06, UC-10</td>
<td>Wave-4</td>
</tr>
<tr>
<td>BR-14</td>
<td>UC-12</td>
<td>Return-1</td>
</tr>
<tr>
<td>BR-15</td>
<td>UC-12</td>
<td>Return-4</td>
</tr>
<tr>
<td>BR-16</td>
<td>UC-01, UC-11</td>
<td>Cancel-4</td>
</tr>
<tr>
<td>BR-17</td>
<td>UC-03, UC-06, UC-13</td>
<td>Reserve-1, Sync-2</td>
</tr>
<tr>
<td>BR-18</td>
<td>UC-14</td>
<td>Dash-3</td>
</tr>
<tr>
<td>BR-19</td>
<td>UC-04</td>
<td>Route-6</td>
</tr>
<tr>
<td>BR-20</td>
<td>UC-13</td>
<td>Sync-3</td>
</tr>
</tbody>
</table>
<p><strong>Every rule in this catalog is enforced by at least one use case.</strong> A rule with no
enforcing use case would be either out of scope (see §3) or a gap in the use case
set — this check was run before baselining and is repeated before submission.</p></div>
<div class="ml-vi"><h2>Business Rules — Luật nghiệp vụ</h2>
<h2>cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên nhóm trưởng&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Nova Retail Group (NRG)
17 tháng 9 năm 2026</p>
<hr />
<h3>Lịch sử sửa đổi</h3>
<table>
<thead>
<tr>
<th>Người</th>
<th>Ngày</th>
<th>Lý do sửa</th>
<th>Phiên bản</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Thu thập luật từ các buổi khai thác 1–4</td>
<td>0.9</td>
</tr>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Phân loại, khử trùng lặp và tham chiếu chéo sang use case</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Mục đích và phạm vi</h3>
<p>Tài liệu này là catalog các luật nghiệp vụ của NRG chi phối việc hoàn tất đơn hàng. Một
<strong>business rule</strong> là một chính sách, quy định, chuẩn mực, phép tính hoặc định nghĩa tồn
tại trong doanh nghiệp <strong>độc lập với mọi phần mềm</strong>, nhưng phần mềm có thể được yêu cầu
phải cưỡng chế nó. Mỗi luật được ghi ở đây <strong>một lần duy nhất</strong>; mọi use case và mọi yêu
cầu chức năng cưỡng chế một luật đều chỉ tham chiếu tới nó <strong>bằng mã</strong>, không bao giờ
chép lại nội dung (xem §5, Truy vết).</p>
<p>Các luật được phân loại theo bảng năm kiểu của Wiegers &amp; Beatty, <em>Software Requirements</em>,
tái bản lần 3, chương 9:</p>
<table>
<thead>
<tr>
<th>Kiểu</th>
<th>Nghĩa</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Fact</strong></td>
<td>Một phát biểu luôn đúng về nghiệp vụ; một bất biến của lĩnh vực</td>
</tr>
<tr>
<td><strong>Constraint</strong></td>
<td>Điều phải hoặc không được xảy ra; nó hạn chế một hành động</td>
</tr>
<tr>
<td><strong>Action enabler</strong></td>
<td>Một điều kiện mà khi đúng thì kích hoạt một hành động</td>
</tr>
<tr>
<td><strong>Inference</strong></td>
<td>Tri thức mới suy ra từ các sự kiện đã có ("nếu A thì B đúng")</td>
</tr>
<tr>
<td><strong>Computation</strong></td>
<td>Một công thức sinh ra một giá trị</td>
</tr>
</tbody>
</table>
<p><strong>Tĩnh hay Động</strong> ghi lại việc <em>bản thân luật đó</em> có được dự kiến sẽ thay đổi theo thời
gian hay không. Luật động phải <strong>cấu hình được trong hệ thống</strong>, không được biên dịch
cứng vào nó; sự phân biệt này là thứ hữu ích nhất của cả cái bảng đối với nhóm phát triển.</p>
<hr />
<h3>2. Danh mục luật</h3>
<table>
<thead>
<tr>
<th>Mã</th>
<th>Định nghĩa luật</th>
<th>Kiểu</th>
<th>Tĩnh/Động</th>
<th>Nguồn</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>BR-01</strong></td>
<td>Một dòng đơn hàng được hoàn tất từ đúng một trung tâm hoàn tất đơn. Một dòng không bao giờ bị tách ra nhiều trung tâm; một <em>đơn</em> thì có thể bị tách, một <em>dòng</em> thì không.</td>
<td>Fact</td>
<td>Tĩnh</td>
<td>Quản lý hoàn tất đơn, buổi 2</td>
</tr>
<tr>
<td><strong>BR-02</strong></td>
<td>Chỉ được giữ tồn cho một dòng đơn hàng khi số available-to-promise của SKU đó tại trung tâm được chọn lớn hơn hoặc bằng số lượng đặt.</td>
<td>Constraint</td>
<td>Tĩnh</td>
<td>Kiểm soát tồn kho, buổi 2</td>
</tr>
<tr>
<td><strong>BR-03</strong></td>
<td>Mọi dòng của cùng một đơn đều giao tới một địa chỉ duy nhất. Khách muốn hai địa chỉ thì phải đặt hai đơn.</td>
<td>Constraint</td>
<td>Tĩnh</td>
<td>Quản lý hoàn tất đơn, buổi 2</td>
</tr>
<tr>
<td><strong>BR-04</strong></td>
<td>Nếu việc uỷ quyền thanh toán không được xác nhận trong vòng 30 phút kể từ lúc tạo lượt giữ tồn, lượt giữ đó bị nhả ra.</td>
<td>Action enabler</td>
<td>Động</td>
<td>Chính sách tài chính (COO), buổi 3</td>
</tr>
<tr>
<td><strong>BR-05</strong></td>
<td>Một đơn chỉ được huỷ hoặc sửa trước khi nhãn vận chuyển của nó được mua. Sau thời điểm đó, quy trình đúng là trả hàng.</td>
<td>Constraint</td>
<td>Tĩnh</td>
<td>Quản lý CSKH, buổi 3</td>
</tr>
<tr>
<td><strong>BR-06</strong></td>
<td>Điểm định tuyến = (w₁ × độ phủ tồn kho) + (w₂ × độ gần điểm đến) + (w₃ × chi phí vận chuyển dự kiến) + (w₄ × năng lực còn lại của trung tâm), với w₁+w₂+w₃+w₄ = 1,0. Trung tâm có điểm cao nhất sẽ hoàn tất đơn.</td>
<td>Computation</td>
<td>Động</td>
<td>Quản lý hoàn tất đơn, buổi 2</td>
</tr>
<tr>
<td><strong>BR-07</strong></td>
<td>Available-to-promise (ATP) = tồn thực tế − đã giữ − hỏng − tồn an toàn, tính theo từng SKU tại từng trung tâm hoàn tất đơn.</td>
<td>Computation</td>
<td>Động</td>
<td>Kiểm soát tồn kho, buổi 2</td>
</tr>
<tr>
<td><strong>BR-08</strong></td>
<td>Một đơn được tách ra tối đa ba trung tâm hoàn tất đơn. Đơn cần hơn ba trung tâm trở thành một ngoại lệ hoàn tất đơn.</td>
<td>Constraint</td>
<td>Động</td>
<td>Quản lý hoàn tất đơn, buổi 2</td>
</tr>
<tr>
<td><strong>BR-09</strong></td>
<td>Một đơn bị coi là "có rủi ro" khi (ngày giao đã hứa − hôm nay) nhỏ hơn thời gian vận chuyển công bố của hãng được chọn tới điểm đến đó.</td>
<td>Inference</td>
<td>Động</td>
<td>Quản lý logistics, buổi 3</td>
</tr>
<tr>
<td><strong>BR-10</strong></td>
<td>Đơn được định tuyến về một trung tâm sau 14:00 giờ địa phương sẽ được xuất đi vào ngày làm việc kế tiếp.</td>
<td>Fact</td>
<td>Động</td>
<td>Quản lý hoàn tất đơn, buổi 2</td>
</tr>
<tr>
<td><strong>BR-11</strong></td>
<td>Một hãng vận chuyển chỉ đủ điều kiện cho một lô giao nếu nó phục vụ mã bưu chính của điểm đến <strong>và</strong> kiện hàng nằm trong giới hạn khối lượng và kích thước của hãng đó <strong>và</strong> hãng đang ở trạng thái Active.</td>
<td>Constraint</td>
<td>Động</td>
<td>Quản lý logistics, buổi 3</td>
</tr>
<tr>
<td><strong>BR-12</strong></td>
<td>Chi phí vận chuyển trọn gói = giá cơ bản theo dải khối lượng + phụ phí vùng xa (nếu có) + phụ phí nhiên liệu − chiết khấu sản lượng theo hợp đồng.</td>
<td>Computation</td>
<td>Động</td>
<td>Quản lý logistics, buổi 3</td>
</tr>
<tr>
<td><strong>BR-13</strong></td>
<td>Nếu một lô giao đã phát trong một đợt nhặt hàng mà chưa được nhặt trong vòng 24 giờ kể từ lúc phát, nó được leo thang lên Quản lý hoàn tất đơn.</td>
<td>Action enabler</td>
<td>Động</td>
<td>Quản lý hoàn tất đơn, buổi 2</td>
</tr>
<tr>
<td><strong>BR-14</strong></td>
<td>Việc trả hàng chỉ được chấp nhận trong vòng 30 ngày kể từ ngày giao được ghi nhận cho lô hàng đó.</td>
<td>Constraint</td>
<td>Động</td>
<td>Quản lý CSKH, buổi 3</td>
</tr>
<tr>
<td><strong>BR-15</strong></td>
<td>Khi kiểm hàng trả, món được ghi nhận là còn bán được thì nhập lại vào tồn khả dụng; món được ghi nhận là hỏng thì chuyển vào khu cách ly và không được quay lại tồn bán được.</td>
<td>Action enabler</td>
<td>Tĩnh</td>
<td>Kiểm soát tồn kho, buổi 4</td>
</tr>
<tr>
<td><strong>BR-16</strong></td>
<td>Đơn xuất phát từ kênh sàn TMĐT không được sửa sau khi đã nhận; chúng chỉ được huỷ toàn bộ.</td>
<td>Fact</td>
<td>Động</td>
<td>Thoả thuận người bán trên sàn (Quản lý nhãn hàng), buổi 3</td>
</tr>
<tr>
<td><strong>BR-17</strong></td>
<td>Tồn an toàn được giữ theo từng SKU tại từng trung tâm hoàn tất đơn và bị loại khỏi available-to-promise. Mặc định là 2 đơn vị và cấu hình được theo từng SKU.</td>
<td>Constraint</td>
<td>Động</td>
<td>Kiểm soát tồn kho, buổi 2</td>
</tr>
<tr>
<td><strong>BR-18</strong></td>
<td>Một SKU bị coi là "có nguy cơ hết hàng" khi available-to-promise của nó trên toàn bộ các trung tâm nhỏ hơn tốc độ bán trung bình mỗi ngày trong 7 ngày trước đó.</td>
<td>Inference</td>
<td>Động</td>
<td>Kiểm soát tồn kho, buổi 4</td>
</tr>
<tr>
<td><strong>BR-19</strong></td>
<td>Chỉ người dùng giữ vai Quản lý hoàn tất đơn mới được ghi đè một quyết định định tuyến tự động, và mọi lần ghi đè đều phải ghi lại lý do.</td>
<td>Constraint</td>
<td>Tĩnh</td>
<td>COO, buổi 1</td>
</tr>
<tr>
<td><strong>BR-20</strong></td>
<td>Khi số lượng bán được của một SKU thay đổi vì bất kỳ lý do gì, số lượng mới được công bố tới mọi kênh bán đang hoạt động có bán SKU đó trong vòng 60 giây.</td>
<td>Action enabler</td>
<td>Động</td>
<td>COO, buổi 1</td>
</tr>
</tbody>
</table>
<h3>2.1 Độ phủ theo kiểu</h3>
<table>
<thead>
<tr>
<th>Kiểu</th>
<th>Các luật</th>
<th>Số lượng</th>
</tr>
</thead>
<tbody>
<tr>
<td>Fact</td>
<td>BR-01, BR-10, BR-16</td>
<td>3</td>
</tr>
<tr>
<td>Constraint</td>
<td>BR-02, BR-03, BR-05, BR-08, BR-11, BR-14, BR-17, BR-19</td>
<td>8</td>
</tr>
<tr>
<td>Action enabler</td>
<td>BR-04, BR-13, BR-15, BR-20</td>
<td>4</td>
</tr>
<tr>
<td>Inference</td>
<td>BR-09, BR-18</td>
<td>2</td>
</tr>
<tr>
<td>Computation</td>
<td>BR-06, BR-07, BR-12</td>
<td>3</td>
</tr>
<tr>
<td></td>
<td><strong>Tổng</strong></td>
<td><strong>20</strong></td>
</tr>
</tbody>
</table>
<h3>2.2 Tĩnh và động — nó có nghĩa gì với việc xây dựng</h3>
<p>Mười bốn trong hai mươi luật là <strong>động</strong>, nên giá trị của chúng phải nằm trong cấu hình
và do một người dùng nghiệp vụ đổi, không phải do lập trình viên. Cụ thể:</p>
<table>
<thead>
<tr>
<th>Luật</th>
<th>Giá trị cấu hình được</th>
<th>Ai được đổi</th>
</tr>
</thead>
<tbody>
<tr>
<td>BR-04</td>
<td>Thời hạn giữ tồn (30 phút)</td>
<td>Quản trị hệ thống</td>
</tr>
<tr>
<td>BR-06</td>
<td>Các trọng số định tuyến w₁…w₄</td>
<td>Quản lý hoàn tất đơn</td>
</tr>
<tr>
<td>BR-07</td>
<td>Những loại tồn nào bị trừ đi</td>
<td>Quản trị hệ thống</td>
</tr>
<tr>
<td>BR-08</td>
<td>Số lần tách tối đa (3)</td>
<td>Quản lý hoàn tất đơn</td>
</tr>
<tr>
<td>BR-10</td>
<td>Giờ chốt xuất hàng (14:00)</td>
<td>Quản lý hoàn tất đơn, theo từng trung tâm</td>
</tr>
<tr>
<td>BR-11</td>
<td>Điều kiện và giới hạn của hãng vận chuyển</td>
<td>Quản lý logistics</td>
</tr>
<tr>
<td>BR-12</td>
<td>Bảng giá, các phụ phí, chiết khấu</td>
<td>Quản lý logistics</td>
</tr>
<tr>
<td>BR-13</td>
<td>Cửa sổ leo thang khi nhặt hàng (24 giờ)</td>
<td>Quản lý hoàn tất đơn</td>
</tr>
<tr>
<td>BR-14</td>
<td>Cửa sổ trả hàng (30 ngày)</td>
<td>Quản lý CSKH</td>
</tr>
<tr>
<td>BR-17</td>
<td>Tồn an toàn mặc định và ghi đè theo từng SKU</td>
<td>Kiểm soát tồn kho</td>
</tr>
<tr>
<td>BR-18</td>
<td>Cửa sổ tính tốc độ bán (7 ngày)</td>
<td>Kiểm soát tồn kho</td>
</tr>
<tr>
<td>BR-20</td>
<td>Mốc thời gian công bố (60 giây)</td>
<td>Quản trị hệ thống</td>
</tr>
</tbody>
</table>
<div class="callout">
<p>Đây chính là lý do cột phân loại quan trọng. Một nhóm viết cứng cửa sổ trả hàng 30 ngày
vào mã thì chưa vi phạm yêu cầu nào, nhưng đã bảo đảm chắc chắn sẽ phải sửa mã ngay lần
đầu doanh nghiệp chạy chương trình khuyến mãi trả hàng 45 ngày dịp lễ.</p>
</div>
<hr />
<h3>3. Những luật CỐ Ý không cưỡng chế bằng phần mềm</h3>
<p>Không phải luật nghiệp vụ nào cũng thuộc về hệ thống. Ghi lại những luật không thuộc về
nó — và vì sao — giúp chúng không bị phát hiện lại và tranh cãi lại ở một bản phát hành
sau.</p>
<table>
<thead>
<tr>
<th>Luật</th>
<th>Vì sao OMFS không cưỡng chế</th>
</tr>
</thead>
<tbody>
<tr>
<td>Hoàn tiền được thực hiện trong vòng 5 ngày làm việc sau khi chấp nhận trả hàng</td>
<td>Việc hoàn tiền do bộ phận tài chính thực hiện trên cổng thanh toán; OMFS chỉ ghi nhận rằng có một khoản hoàn tiền phải trả (EX-5)</td>
</tr>
<tr>
<td>Món hàng hỏng phải được chụp ảnh trước khi đưa vào khu cách ly</td>
<td>Đây là quy trình trong kho, được giám sát viên kiểm tra, không phải phần mềm</td>
</tr>
<tr>
<td>Điểm đánh giá người bán trên sàn phải giữ trên ngưỡng Preferred</td>
<td>Đây là một kết quả dự án nhắm tới, không phải một luật hệ thống cưỡng chế được</td>
</tr>
<tr>
<td>Vị trí ô kệ được sắp xếp lại theo quý</td>
<td>Thuộc về quản lý kho, đã tường minh nằm ngoài phạm vi (EX-3)</td>
</tr>
</tbody>
</table>
<hr />
<h3>4. Các luật được phát hiện như thế nào</h3>
<table>
<thead>
<tr>
<th>Buổi</th>
<th>Ngày</th>
<th>Vai bên liên quan được đóng</th>
<th>Kỹ thuật</th>
<th>Luật thu được</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>08-09-2026</td>
<td>COO (người tài trợ dự án)</td>
<td>Phỏng vấn có cấu trúc, 8 câu hỏi chuẩn bị sẵn</td>
<td>BR-19, BR-20</td>
</tr>
<tr>
<td>2</td>
<td>09-09-2026</td>
<td>Quản lý hoàn tất đơn + Kiểm soát tồn kho</td>
<td>Workshop có điều phối, đi lại quy trình hiện trạng</td>
<td>BR-01, BR-02, BR-03, BR-06, BR-07, BR-08, BR-10, BR-13, BR-17</td>
</tr>
<tr>
<td>3</td>
<td>11-09-2026</td>
<td>Quản lý logistics + Quản lý CSKH + Quản lý nhãn hàng</td>
<td>Phỏng vấn có cấu trúc</td>
<td>BR-04, BR-05, BR-09, BR-11, BR-12, BR-14, BR-16</td>
</tr>
<tr>
<td>4</td>
<td>12-09-2026</td>
<td>Kiểm soát tồn kho</td>
<td>Hỏi tiếp các câu còn treo từ buổi 2</td>
<td>BR-15, BR-18</td>
</tr>
</tbody>
</table>
<p><strong>Ghi chú về kỹ thuật.</strong> Nguồn giàu nhất là <strong>buổi đi lại quy trình hiện trạng</strong> ở buổi
2: cứ hỏi "rồi sau đó thì sao?" xuyên suốt quy trình hoàn tất đơn thủ công đang chạy đã
làm lộ ra chín luật, mà phần lớn chưa từng được ai viết xuống — chúng chỉ tồn tại dưới
dạng thói quen của những nhân viên lâu năm. Các luật tìm ra theo cách này (BR-01, BR-08,
BR-10) đều được Quản lý hoàn tất đơn xác nhận trước khi ghi vào, vì một thói quen không
mặc nhiên là một chính sách.</p>
<p><strong>Những câu hỏi còn treo, mang sang danh sách TBD của SRS</strong></p>
<table>
<thead>
<tr>
<th>#</th>
<th>Câu hỏi</th>
<th>Người chịu trách nhiệm</th>
<th>Hạn</th>
</tr>
</thead>
<tbody>
<tr>
<td>TBD-1</td>
<td>Cửa sổ trả hàng 30 ngày (BR-14) tính từ lúc giao hay từ lúc xuất hàng? Hai bên liên quan trả lời khác nhau.</td>
<td>Quản lý CSKH</td>
<td>Tuần 7</td>
</tr>
<tr>
<td>TBD-2</td>
<td>Các trọng số định tuyến (BR-06) dùng chung cho cả năm nhãn hàng ở bản 1.0, hay theo từng nhãn?</td>
<td>Quản lý hoàn tất đơn</td>
<td>Tuần 6</td>
</tr>
<tr>
<td>TBD-3</td>
<td>Tồn an toàn (BR-17) có áp theo từng kênh bán nữa không, hay chỉ theo trung tâm hoàn tất đơn?</td>
<td>Kiểm soát tồn kho</td>
<td>Tuần 7</td>
</tr>
</tbody>
</table>
<hr />
<h3>5. Truy vết: luật → use case → yêu cầu</h3>
<p>Mỗi luật được một hoặc nhiều use case cưỡng chế, và thông qua chúng, được các yêu cầu
chức năng cụ thể trong SRS cưỡng chế. <strong>Nội dung luật chỉ xuất hiện trong tài liệu này</strong>;
mọi nơi khác đều tham chiếu bằng mã.</p>
<table>
<thead>
<tr>
<th>Luật</th>
<th>Được cưỡng chế trong use case</th>
<th>Yêu cầu chức năng trong SRS</th>
</tr>
</thead>
<tbody>
<tr>
<td>BR-01</td>
<td>UC-03, UC-04</td>
<td>Reserve-2, Route-1</td>
</tr>
<tr>
<td>BR-02</td>
<td>UC-03</td>
<td>Reserve-2</td>
</tr>
<tr>
<td>BR-03</td>
<td>UC-02</td>
<td>Validate-3</td>
</tr>
<tr>
<td>BR-04</td>
<td>UC-02, UC-03</td>
<td>Reserve-3</td>
</tr>
<tr>
<td>BR-05</td>
<td>UC-10, UC-11</td>
<td>Cancel-1, Cancel-2</td>
</tr>
<tr>
<td>BR-06</td>
<td>UC-04, UC-14</td>
<td>Route-2, Route-3</td>
</tr>
<tr>
<td>BR-07</td>
<td>UC-03, UC-06, UC-13</td>
<td>Reserve-1, Sync-1</td>
</tr>
<tr>
<td>BR-08</td>
<td>UC-03, UC-04</td>
<td>Route-4</td>
</tr>
<tr>
<td>BR-09</td>
<td>UC-04, UC-08, UC-09, UC-10, UC-14</td>
<td>Track-4, Except-1</td>
</tr>
<tr>
<td>BR-10</td>
<td>UC-04, UC-05</td>
<td>Route-5, Wave-2</td>
</tr>
<tr>
<td>BR-11</td>
<td>UC-07</td>
<td>Label-1</td>
</tr>
<tr>
<td>BR-12</td>
<td>UC-07</td>
<td>Label-2</td>
</tr>
<tr>
<td>BR-13</td>
<td>UC-05, UC-06, UC-10</td>
<td>Wave-4</td>
</tr>
<tr>
<td>BR-14</td>
<td>UC-12</td>
<td>Return-1</td>
</tr>
<tr>
<td>BR-15</td>
<td>UC-12</td>
<td>Return-4</td>
</tr>
<tr>
<td>BR-16</td>
<td>UC-01, UC-11</td>
<td>Cancel-4</td>
</tr>
<tr>
<td>BR-17</td>
<td>UC-03, UC-06, UC-13</td>
<td>Reserve-1, Sync-2</td>
</tr>
<tr>
<td>BR-18</td>
<td>UC-14</td>
<td>Dash-3</td>
</tr>
<tr>
<td>BR-19</td>
<td>UC-04</td>
<td>Route-6</td>
</tr>
<tr>
<td>BR-20</td>
<td>UC-13</td>
<td>Sync-3</td>
</tr>
</tbody>
</table>
<p><strong>Mọi luật trong catalog này đều được ít nhất một use case cưỡng chế.</strong> Một luật không có
use case nào cưỡng chế thì hoặc nằm ngoài phạm vi (xem §3), hoặc là một lỗ hổng trong bộ
use case — phép kiểm này đã chạy trước khi chốt bản cơ sở và được chạy lại trước khi nộp.</p></div>`,
  ].join('\n'),
};

const TP2L4 = {
  title: "W2.4 — Deliverable 4: the SRS, all sections (101 requirements)|||W2.4 — Deliverable 4: SRS đầy đủ mọi mục (101 yêu cầu)",
  slug: "swr302-tp2-goi-04-srs",
  type: 'DOCUMENT',
  description: "SRS hoàn chỉnh theo template Chapter 10: 14 nhóm tính năng với 101 functional requirement dùng \"shall\", 18 thuộc tính chất lượng viết bằng Planguage có SCALE/METER/MUST/PLAN, yêu cầu dữ liệu, 10 giao tiếp phần mềm, i18n, glossary, danh sách TBD và ma trận truy vết.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP2 · Deliverable 4</span>
<h2>The SRS — the document that integrates everything else</h2>
<p class="lead">This is long, and it is meant to be. It is where use cases, business rules, data and quality all have to agree with each other. Three parts repay close reading:</p>
<ul>
<li><strong>§3 — 101 functional requirements.</strong> Every one uses <em>shall</em>, names one actor and one observable behaviour, and cites the rule it enforces. Pick any sentence at random and try to write a pass/fail test from it; if you can, it is a requirement.</li>
<li><strong>§6 — quality attributes in Planguage.</strong> SCALE says what is measured, METER says how, MUST is the level below which the release is unacceptable, PLAN is the target. "The system shall be fast" is an opinion; QA-2 says ≤ 0.8 s at the 95th percentile on the deployed handheld, measured on device. Only one of those can be tested.</li>
<li><strong>Appendix C — the TBD list.</strong> Five open items, each with an owner and a date. An SRS with no open items at Week 8 is not finished; it is unexamined. Showing a tracked TBD list is requirements <em>management</em>, which is CLO9.</li>
</ul>
<div class="callout warn"><strong>Read §2.5 and notice the sentence in the callout:</strong> "If A3 is wrong, this SRS is wrong." Naming the assumption your whole specification rests on — and saying out loud what happens if it fails — is what separates an analyst from a typist.</div>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP2 · Deliverable 4</span>
<h2>SRS — tài liệu tích hợp mọi thứ còn lại</h2>
<p class="lead">Nó dài, và phải dài. Đây là nơi use case, business rule, dữ liệu và chất lượng buộc phải khớp nhau. Ba phần đáng đọc kỹ:</p>
<ul>
<li><strong>§3 — 101 functional requirement.</strong> Mỗi câu dùng <em>shall</em>, gọi tên một actor và một hành vi quan sát được, và trỏ rule nó thực thi. Hãy bốc ngẫu nhiên một câu và thử viết một ca kiểm thử đạt/trượt từ nó; viết được thì đó là requirement.</li>
<li><strong>§6 — thuộc tính chất lượng viết bằng Planguage.</strong> SCALE nói đo cái gì, METER nói đo thế nào, MUST là mức dưới đó thì không phát hành được, PLAN là đích nhắm. "Hệ thống phải nhanh" là ý kiến; QA-2 nói ≤ 0,8 giây ở phân vị 95 trên đúng máy cầm tay đang dùng, đo ngay trên máy. Chỉ một trong hai cái đó kiểm được.</li>
<li><strong>Phụ lục C — danh sách TBD.</strong> Năm mục mở, mỗi mục có người phụ trách và ngày. Một SRS không còn mục mở nào ở tuần 8 không phải là đã xong, mà là chưa ai soi. Trình ra danh sách TBD có theo dõi chính là <em>quản lý</em> yêu cầu, tức CLO9.</li>
</ul>
<div class="callout warn"><strong>Hãy đọc §2.5 và để ý câu trong khung:</strong> "Nếu A3 sai thì SRS này sai." Gọi tên đúng cái giả định mà cả bản đặc tả đang đứng lên — và nói thẳng chuyện gì xảy ra nếu nó sụp — là thứ tách một analyst khỏi một người đánh máy.</div>`,
    ),
    `<div class="ml-en"><h2>Software Requirements Specification</h2>
<h2>for the Order Management and Fulfillment System (OMFS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Team Leader name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Nova Retail Group (NRG)
17 September 2026</p>
<hr />
<h3>Revision History</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Date</th>
<th>Reason For Changes</th>
<th>Version</th>
</tr>
</thead>
<tbody>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Initial draft — sections 1–2 from Vision &amp; Scope, section 3 from use cases</td>
<td>0.9</td>
</tr>
<tr>
<td>BA Team, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Quality attributes quantified, all sections complete, baselined</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h2>Table of Contents</h2>
<ol>
<li>Introduction · 2. Overall Description · 3. System Features · 4. Data Requirements ·</li>
<li>External Interface Requirements · 6. Quality Attributes ·</li>
<li>Internationalization and Localization Requirements · 8. Other Requirements ·
Appendix A: Glossary · Appendix B: Analysis Models · Appendix C: TBD List ·
Appendix D: Requirements Traceability Matrix</li>
</ol>
<hr />
<h3>1. Introduction</h3>
<h3>1.1 Purpose</h3>
<p>This document specifies the software requirements for release <strong>1.0 through 2.0</strong> of
the <strong>Order Management and Fulfillment System (OMFS)</strong>, a centralized platform that
manages the fulfillment of orders arriving at Nova Retail Group (NRG) from four sales
channels across three fulfillment centers and four third-party logistics carriers.</p>
<p>It is written for four audiences:</p>
<table>
<thead>
<tr>
<th>Reader</th>
<th>Uses this document to</th>
</tr>
</thead>
<tbody>
<tr>
<td>Development team</td>
<td>Understand what to build and what "done" means for each capability</td>
</tr>
<tr>
<td>Test team</td>
<td>Derive test cases; every functional requirement is written to be pass/fail testable</td>
</tr>
<tr>
<td>Project manager</td>
<td>Scope releases and estimate effort</td>
</tr>
<tr>
<td>Business stakeholders</td>
<td>Confirm that what will be built is what they asked for</td>
</tr>
</tbody>
</table>
<p>The scope of this SRS is the <strong>whole product across releases 1.0–2.0</strong>; each functional
requirement carries the release in which it is delivered.</p>
<h3>1.2 Document Conventions</h3>
<p><strong>Requirement identifiers.</strong> Every functional requirement has the form
<code>&amp;lt;Feature&amp;gt;-&amp;lt;n&amp;gt;</code>, where <code>&amp;lt;Feature&amp;gt;</code> is the short name of the system feature it belongs
to (for example <code>Reserve-2</code>, <code>Route-4</code>, <code>Label-1</code>). Identifiers are permanent: a
deleted requirement's number is never reused. Quality attribute requirements use
<code>QA-&amp;lt;n&amp;gt;</code>.</p>
<p><strong>The word "shall".</strong> Every functional requirement uses <strong>shall</strong> to express an
obligation. Sentences using "should", "may" or "will" are explanatory text, not
requirements, and nothing is tested against them.</p>
<p><strong>Priority.</strong> Each system feature carries High, Medium or Low, taken from the
requirement prioritization worksheet (deliverable 7). Priorities are dynamic and may
change; the worksheet, not this document, is the master.</p>
<p><strong>References to other documents.</strong> Business rules appear as <code>BR-n</code> only — the rule
text lives in the Business Rules document and is never duplicated here. Use cases
appear as <code>UC-nn</code>. Data elements referenced in requirements are defined in the Data
Dictionary.</p>
<p><strong>Quality attributes</strong> are written in Planguage (Gilb) with SCALE, METER, MUST and
PLAN, so that every one is measurable.</p>
<h3>1.3 Project Scope</h3>
<p>OMFS is the authoritative record of an order from the moment it is retrieved from a
sales channel until it is delivered, cancelled or returned. It maintains one real-time
view of inventory across all fulfillment centers, routes and splits each order
automatically, drives scan-verified picking, buys shipping labels by comparing carrier
rates, keeps order status current from carrier events, and gives customers
self-service visibility of that status.</p>
<p>OMFS does <strong>not</strong> replace the web storefront, the payment gateway, the ERP/accounting
system or a warehouse management system. The full statement of scope, release content
and exclusions is in the <strong>Vision and Scope document</strong>, sections 2.1–2.4, which is the
controlling document and is not duplicated here.</p>
<p>The business objectives OMFS exists to achieve are BO-1 … BO-6 in Vision and Scope
§1.3. Every system feature in section 3 traces to at least one of them.</p>
<h3>1.4 References</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Document</th>
<th>Version</th>
<th>Location</th>
</tr>
</thead>
<tbody>
<tr>
<td>R1</td>
<td>Vision and Scope Document for OMFS</td>
<td>1.0</td>
<td><code>deliverables/01-Vision-and-Scope.md</code></td>
</tr>
<tr>
<td>R2</td>
<td>Use Cases for OMFS</td>
<td>1.0</td>
<td><code>deliverables/02-Use-Cases.md</code></td>
</tr>
<tr>
<td>R3</td>
<td>Business Rules for OMFS</td>
<td>1.0</td>
<td><code>deliverables/03-Business-Rules.md</code></td>
</tr>
<tr>
<td>R4</td>
<td>Data Dictionary for OMFS</td>
<td>1.0</td>
<td><code>deliverables/05-Data-Dictionary.md</code></td>
</tr>
<tr>
<td>R5</td>
<td>Mock-ups for Complex Use Cases</td>
<td>1.0</td>
<td><code>deliverables/06-Mockups.md</code></td>
</tr>
<tr>
<td>R6</td>
<td>Requirement Prioritization Worksheet</td>
<td>1.0</td>
<td><code>deliverables/07-Requirements-Prioritization.xlsx</code></td>
</tr>
<tr>
<td>R7</td>
<td>Requirement Estimation</td>
<td>1.0</td>
<td><code>deliverables/08-Requirements-Estimation.xlsx</code></td>
</tr>
<tr>
<td>R8</td>
<td>Wiegers, K. &amp; Beatty, J., <em>Software Requirements</em>, 3rd ed.</td>
<td>2013</td>
<td>Microsoft Press</td>
</tr>
<tr>
<td>R9</td>
<td>Elicitation session notes 1–4</td>
<td>—</td>
<td>Team shared folder, <code>elicitation/</code></td>
</tr>
<tr>
<td>R10</td>
<td>NRG marketplace seller agreements (Shopee, Lazada, TikTok Shop)</td>
<td>current</td>
<td>Brand Manager</td>
</tr>
</tbody>
</table>
<p><strong>Elicitation method note.</strong> Stakeholder input was obtained through four simulated
stakeholder sessions (R9), in which team members played named roles and answered only
what that role would plausibly know. Where a stakeholder answer was unavailable, the
item is recorded in the TBD list (Appendix C) rather than invented.</p>
<hr />
<h3>2. Overall Description</h3>
<h3>2.1 Product Perspective</h3>
<p>OMFS is a <strong>new system replacing a manual process</strong>, not a new version of an existing
product. The process it replaces — a shared inventory spreadsheet, printed picking
slips and four carrier web portals — remains in place until each fulfillment center is
cut over, and remains executable as a back-out route for two weeks after each cutover
(R1 §3.3).</p>
<p>OMFS sits <strong>behind</strong> the customer-facing storefront and <strong>in front of</strong> the physical
warehouse and the carriers. The context diagram is in Appendix B.</p>
<p><strong>Systems OMFS exchanges data with</strong></p>
<table>
<thead>
<tr>
<th>External system</th>
<th>Direction</th>
<th>What crosses the boundary</th>
</tr>
</thead>
<tbody>
<tr>
<td>Web storefront</td>
<td>In / out</td>
<td>Orders in; sellable quantities out</td>
</tr>
<tr>
<td>Marketplace channels (3)</td>
<td>In / out</td>
<td>Orders in; sellable quantities out; cancellations both ways</td>
</tr>
<tr>
<td>Payment gateway</td>
<td>In</td>
<td>Payment authorization status (read only)</td>
</tr>
<tr>
<td>3PL carrier APIs (4)</td>
<td>Out / in</td>
<td>Rate requests and label purchases out; tracking events in</td>
</tr>
<tr>
<td>ERP / accounting</td>
<td>Out</td>
<td>Daily posting of shipped-order financials</td>
</tr>
<tr>
<td>Notification service</td>
<td>Out</td>
<td>Customer email and SMS</td>
</tr>
</tbody>
</table>
<h3>2.2 User Classes and Characteristics</h3>
<table>
<thead>
<tr>
<th>User class</th>
<th>Size</th>
<th>Frequency of use</th>
<th>Technical skill</th>
<th>Favored</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Warehouse Operator</strong></td>
<td>~60</td>
<td>Continuously during a shift</td>
<td>Low — trained on the job, may not use a computer otherwise</td>
<td><strong>Yes</strong></td>
</tr>
<tr>
<td><strong>Fulfillment Manager</strong></td>
<td>6</td>
<td>Many times daily</td>
<td>Medium</td>
<td><strong>Yes</strong></td>
</tr>
<tr>
<td><strong>Inventory Controller</strong></td>
<td>3</td>
<td>Several times daily</td>
<td>Medium — spreadsheet-fluent</td>
<td><strong>Yes</strong></td>
</tr>
<tr>
<td><strong>Customer Service Agent</strong></td>
<td>~25</td>
<td>Continuously during a shift</td>
<td>Medium</td>
<td>No</td>
</tr>
<tr>
<td><strong>Logistics Manager</strong></td>
<td>2</td>
<td>Daily</td>
<td>Medium</td>
<td>No</td>
</tr>
<tr>
<td><strong>Brand Manager</strong></td>
<td>5</td>
<td>Weekly</td>
<td>Low</td>
<td>No</td>
</tr>
<tr>
<td><strong>System Administrator</strong></td>
<td>2</td>
<td>Occasionally</td>
<td>High</td>
<td>No</td>
</tr>
<tr>
<td><strong>Customer</strong></td>
<td>~90,000/month</td>
<td>Once or twice per order</td>
<td>Unknown — assume none</td>
<td>No</td>
</tr>
</tbody>
</table>
<p><strong>Favored user classes.</strong> Warehouse Operator, Fulfillment Manager and Inventory
Controller are favored: where their needs conflict with another class's, theirs win.
This is a deliberate decision by the COO, because these three classes are the ones
whose manual effort the project exists to remove.</p>
<p><strong>The consequence for design.</strong> The Warehouse Operator being both favored <em>and</em> the
least technical class is the strongest single constraint on this product. It is why
QA-1 and QA-2 exist and why the pick flow is scan-driven rather than form-driven.</p>
<h3>2.3 Operating Environment</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Requirement</th>
</tr>
</thead>
<tbody>
<tr>
<td>OE-1</td>
<td>OMFS shall operate on NRG's existing cloud tenancy; no new data centre is required.</td>
</tr>
<tr>
<td>OE-2</td>
<td>Manager and agent interfaces shall run in current versions of Chrome, Edge and Safari on desktop, at a minimum viewport width of 1280 px.</td>
</tr>
<tr>
<td>OE-3</td>
<td>The pick and pack interface shall run on Android 10 or later on the existing low-end handheld scanners (2 GB RAM, 5-inch screen).</td>
</tr>
<tr>
<td>OE-4</td>
<td>The customer tracking page shall run on current mobile and desktop browsers at a minimum viewport width of 360 px.</td>
</tr>
<tr>
<td>OE-5</td>
<td>OMFS shall operate with data stored in the Vietnam region and shall present all times in Asia/Ho_Chi_Minh (UTC+07) while storing them with an explicit offset.</td>
</tr>
</tbody>
</table>
<h3>2.4 Design and Implementation Constraints</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Constraint</th>
<th>Origin</th>
</tr>
</thead>
<tbody>
<tr>
<td>CO-1</td>
<td>OMFS shall use the existing corporate identity provider for staff authentication; it shall not maintain its own staff password store.</td>
<td>Corporate security policy</td>
</tr>
<tr>
<td>CO-2</td>
<td>Third-party API keys shall be held as server-side runtime configuration and shall never be delivered to a browser.</td>
<td>Corporate security policy</td>
</tr>
<tr>
<td>CO-3</td>
<td>The handheld interface shall function for at least 15 minutes without network connectivity and shall reconcile queued scans on reconnection.</td>
<td>Warehouse Wi-Fi coverage (R1 dependency D3)</td>
</tr>
<tr>
<td>CO-4</td>
<td>Every rule marked Dynamic in R3 §2.2 shall be changeable through configuration by the named business role, without a software release.</td>
<td>Business Rules §2.2</td>
</tr>
<tr>
<td>CO-5</td>
<td>OMFS shall not store full payment card data at any time.</td>
<td>PCI scope reduction</td>
</tr>
<tr>
<td>CO-6</td>
<td>Channel and carrier integrations shall be isolated behind an internal interface so that adding a channel or carrier does not require changes to order, inventory or routing logic.</td>
<td>RI-1, RI-4</td>
</tr>
</tbody>
</table>
<h3>2.5 Assumptions and Dependencies</h3>
<p><strong>Assumptions</strong> (from R1 §1.7, repeated here because requirements depend on them)</p>
<ul>
<li>A1: All four marketplaces expose order-retrieval and stock-update APIs.</li>
<li>A2: NRG operates exactly three fulfillment centers through releases 1.0 and 1.1.</li>
<li>A3: Physical stock counts at migration are accurate to within 2%.</li>
<li>A4: The web storefront remains the customer-facing checkout.</li>
<li>A5: Handheld barcode scanners are available in all three fulfillment centers.</li>
<li>A6: Every sellable SKU carries a scannable barcode.</li>
<li>A7: At least three of the four carriers support webhook delivery of tracking events.</li>
</ul>
<p><strong>Dependencies</strong></p>
<ul>
<li>D1: Carrier API credentials and sandbox access, obtained by the Logistics Manager.</li>
<li>D2: The ERP accepts a daily financial posting in an agreed format.</li>
<li>D3: Warehouse Wi-Fi coverage adequate for handheld use.</li>
<li>D4: A master data steward available 8 hours per week during requirements and migration.</li>
</ul>
<div class="callout">
<p><strong>If A3 is wrong, this SRS is wrong.</strong> Every inventory requirement in §3.3 computes
from on-hand quantities migrated out of the legacy spreadsheet. Data cleansing is
therefore a precondition of release, not a parallel activity (risk RI-2).</p>
</div>
<hr />
<h3>3. System Features</h3>
<p>Each feature below realizes one major feature from R1 §2.1 and one or more use cases
from R2. Priorities come from the prioritization worksheet (R6).</p>
<h3>3.1 Multi-channel order ingestion</h3>
<p><strong>Description.</strong> OMFS retrieves orders from every connected sales channel and converts
each into one normalized order record. Realizes FE-1 · Use case UC-01 · Objective BO-2.
<strong>Priority:</strong> High · <strong>Release:</strong> 1.0 (storefront + Shopee), 1.1 (Lazada + TikTok Shop)</p>
<p><strong>Functional requirements</strong></p>
<p><strong>Ingest-1:</strong> The system shall retrieve orders created since the last successful ingestion watermark from each active sales channel at an interval configurable per channel, defaulting to 60 seconds.</p>
<p><strong>Ingest-2:</strong> The system shall create exactly one order record for each distinct channel order identifier, and shall discard without error any order whose channel identifier already exists.</p>
<p><strong>Ingest-3:</strong> The system shall map each channel product identifier to an OMFS SKU using the channel SKU mapping table, and shall place any order containing an unmapped identifier into the Unmapped SKU queue with the status Held-Unmapped.</p>
<p><strong>Ingest-4:</strong> The system shall retain the ingestion watermark unchanged when a channel request fails, and shall retry the request up to five times with exponentially increasing delay before raising an integration alert.</p>
<p><strong>Ingest-5:</strong> The system shall assign the status Held-Invalid to any retrieved order that lacks a shipping address or that contains no order line, and shall raise a data-quality exception for that order.</p>
<p><strong>Ingest-6:</strong> The system shall permit a System Administrator to request re-ingestion of a single named channel order identifier.</p>
<h3>3.2 Order screening and validation</h3>
<p><strong>Description.</strong> Address, payment and fraud checks performed before an order is allowed
to consume stock. Realizes FE-2 · Use case UC-02 · Objective BO-1.
<strong>Priority:</strong> High · <strong>Release:</strong> 1.0</p>
<p><strong>Validate-1:</strong> The system shall verify that the shipping postcode of an order is served by at least one active carrier before assigning the order the status Validated.</p>
<p><strong>Validate-2:</strong> The system shall read the payment authorization status for an order from the payment gateway, and shall assign the status Held-Review with the reason PAYMENT_NOT_AUTHORIZED when authorization is absent or declined.</p>
<p><strong>Validate-3:</strong> The system shall reject any order whose lines specify more than one shipping address, in accordance with BR-03.</p>
<p><strong>Validate-4:</strong> The system shall omit the payment authorization check for orders whose payment method is cash on delivery.</p>
<p><strong>Validate-5:</strong> The system shall assign the status Held-Review with the reason PAYMENT_UNKNOWN when the payment gateway does not respond within five minutes, and shall not treat an absent response as an authorization.</p>
<p><strong>Validate-6:</strong> The system shall permit a Customer Service Agent to release an order from Held-Review to Validated, and shall record the agent, the time and a mandatory justification.</p>
<h3>3.3 Real-time inventory and available-to-promise</h3>
<p><strong>Description.</strong> The single authoritative stock position, and the reservation of stock
at order acceptance. Realizes FE-3 · Use case UC-03 · Objective BO-1.
<strong>Priority:</strong> High · <strong>Release:</strong> 1.0</p>
<p><strong>Reserve-1:</strong> The system shall compute available-to-promise per SKU per fulfillment center in accordance with BR-07 whenever the on-hand, reserved, damaged or safety-stock quantity of that SKU at that fulfillment center changes.</p>
<p><strong>Reserve-2:</strong> The system shall reserve stock for an order line only when available-to-promise for that SKU at the selected fulfillment center is greater than or equal to the ordered quantity, in accordance with BR-01 and BR-02.</p>
<p><strong>Reserve-3:</strong> The system shall release every reservation belonging to an order that has not been confirmed by payment authorization within the reservation window defined by BR-04, and shall return that order to the status Pending.</p>
<p><strong>Reserve-4:</strong> The system shall reserve stock for all lines of an order or for none of them, and shall assign the status Backordered to an order for which total available-to-promise across all fulfillment centers is less than the ordered quantity of any line.</p>
<p><strong>Reserve-5:</strong> The system shall reserve a single order line across more than one fulfillment center when no single center holds sufficient available-to-promise, subject to the split limit in BR-08.</p>
<p><strong>Reserve-6:</strong> The system shall permit an Inventory Controller to set a safety stock quantity per SKU per fulfillment center, and shall exclude that quantity from available-to-promise in accordance with BR-17.</p>
<p><strong>Reserve-7:</strong> The system shall re-attempt reservation for a backordered order when the available-to-promise of any SKU on that order increases.</p>
<h3>3.4 Channel stock synchronization</h3>
<p><strong>Description.</strong> Publication of sellable quantities to every channel that sells a SKU.
Realizes FE-4 · Use case UC-13 · Objective BO-1.
<strong>Priority:</strong> High · <strong>Release:</strong> 1.0</p>
<p><strong>Sync-1:</strong> The system shall publish the sellable quantity of a SKU, computed in accordance with BR-07, to every active sales channel that sells that SKU whenever that quantity changes.</p>
<p><strong>Sync-2:</strong> The system shall apply a per-channel buffer quantity, configurable by the Inventory Controller, when computing the quantity published to that channel, in accordance with BR-17.</p>
<p><strong>Sync-3:</strong> The system shall complete publication of a changed quantity within the interval defined by BR-20, measured from the time the underlying stock change was recorded.</p>
<p><strong>Sync-4:</strong> The system shall combine multiple stock changes affecting one SKU within a batching window into a single publication carrying the most recent quantity.</p>
<p><strong>Sync-5:</strong> The system shall compare, at an interval configurable and defaulting to one hour, the quantity each active channel reports against the quantity OMFS holds, and shall republish any SKU where the two differ.</p>
<p><strong>Sync-6:</strong> The system shall publish a quantity of zero, and shall raise a data-quality alert naming the SKU and fulfillment center, when the computed sellable quantity is less than zero.</p>
<p><strong>Sync-7:</strong> The system shall queue publications that a channel rejects because of rate limiting, and shall resume them after the interval the channel specifies, without discarding any publication.</p>
<h3>3.5 Automated order routing and splitting</h3>
<p><strong>Description.</strong> Selection of the fulfillment center or centers that will ship each
line. Realizes FE-5 · Use case UC-04 · Objectives BO-2, BO-3.
<strong>Priority:</strong> High · <strong>Release:</strong> 1.0</p>
<p><strong>Route-1:</strong> The system shall assign every line of an order to exactly one fulfillment center, in accordance with BR-01.</p>
<p><strong>Route-2:</strong> The system shall compute a routing score for every candidate fulfillment center in accordance with BR-06, and shall select the candidate grouping with the highest total score.</p>
<p><strong>Route-3:</strong> The system shall record, against each routed order, the score of every candidate fulfillment center together with each score component and the reason the winner was selected.</p>
<p><strong>Route-4:</strong> The system shall raise a fulfillment exception, and shall create no shipment, for any order whose routing would require more fulfillment centers than the limit defined by BR-08.</p>
<p><strong>Route-5:</strong> The system shall assign a next-working-day dispatch date to any order routed to a fulfillment center after that center's dispatch cut-off time, in accordance with BR-10.</p>
<p><strong>Route-6:</strong> The system shall permit only a user holding the Fulfillment Manager role to override an automated routing decision, and shall require a reason to be recorded with every override, in accordance with BR-19.</p>
<p><strong>Route-7:</strong> The system shall re-route any routed order that has not entered picking when the fulfillment center it was routed to is closed by a System Administrator.</p>
<p><strong>Route-8:</strong> The system shall permit a Fulfillment Manager to change the routing score weights without a software release, and shall reject any weight set whose components do not sum to one.</p>
<h3>3.6 Pick wave generation and release</h3>
<p><strong>Description.</strong> Grouping of routed shipments into batches released to the warehouse
floor. Realizes FE-6 · Use case UC-05 · Objective BO-3.
<strong>Priority:</strong> High · <strong>Release:</strong> 1.0</p>
<p><strong>Wave-1:</strong> The system shall permit a Fulfillment Manager to create a pick wave from the routed shipments at one fulfillment center, filtered by carrier cut-off, service level, order age and maximum wave size.</p>
<p><strong>Wave-2:</strong> The system shall include in a wave, when the automatic wave timer runs, every routed shipment whose dispatch date is today and whose carrier cut-off has not passed, in accordance with BR-10.</p>
<p><strong>Wave-3:</strong> The system shall assign each shipment to at most one open wave, and shall exclude from a wave being created any shipment already assigned to another open wave.</p>
<p><strong>Wave-4:</strong> The system shall escalate to the Fulfillment Manager any shipment in a released wave that has not been picked within the interval defined by BR-13.</p>
<p><strong>Wave-5:</strong> The system shall sequence the pick list of a wave by the storage location recorded against each SKU.</p>
<p><strong>Wave-6:</strong> The system shall create multiple waves rather than one wave exceeding the configured maximum size, and shall report the number of waves created.</p>
<p><strong>Wave-7:</strong> The system shall permit a Fulfillment Manager to cancel a wave in which no item has been picked, and shall return every shipment in that wave to the status Routed.</p>
<h3>3.7 Scan-verified pick and pack</h3>
<p><strong>Description.</strong> Handheld-driven picking with barcode verification and carton
assignment. Realizes FE-7 · Use case UC-06 · Objectives BO-2, BO-3.
<strong>Priority:</strong> High · <strong>Release:</strong> 1.0</p>
<p><strong>Pick-1:</strong> The system shall present to the operator, for each pick task, the SKU, item description, item image, required quantity and storage location.</p>
<p><strong>Pick-2:</strong> The system shall confirm a pick only when the barcode scanned by the operator matches the barcode recorded against the expected SKU.</p>
<p><strong>Pick-3:</strong> The system shall escalate a pick task to the Fulfillment Manager after three consecutive barcode mismatches on that task.</p>
<p><strong>Pick-4:</strong> The system shall permit an operator to record a picked quantity lower than the required quantity, shall adjust the on-hand quantity of that SKU to the counted quantity, and shall raise a short-pick exception.</p>
<p><strong>Pick-5:</strong> The system shall permit an operator to record a quantity as damaged, shall move that quantity to the damaged quantity for that SKU and fulfillment center, and shall exclude it from available-to-promise in accordance with BR-07.</p>
<p><strong>Pick-6:</strong> The system shall record the assignment of each picked item to a carton, together with the weight of each carton.</p>
<p><strong>Pick-7:</strong> The system shall deduct picked quantities from on-hand stock and release their reservations at the moment the shipment is recorded as packed.</p>
<p><strong>Pick-8:</strong> The system shall accept scans recorded by a handheld device while that device had no network connectivity, and shall apply each such scan exactly once on reconnection.</p>
<h3>3.8 Carrier rate shopping and label purchase</h3>
<p><strong>Description.</strong> Comparison of eligible carriers and purchase of the shipping label.
Realizes FE-8 · Use case UC-07 · Objective BO-5.
<strong>Priority:</strong> Medium · <strong>Release:</strong> 1.1</p>
<p><strong>Label-1:</strong> The system shall treat a carrier as eligible for a shipment only when that carrier is active, serves the destination postcode, and accepts the weight and dimensions of every carton in the shipment, in accordance with BR-11.</p>
<p><strong>Label-2:</strong> The system shall compute the landed cost of each carrier quote in accordance with BR-12.</p>
<p><strong>Label-3:</strong> The system shall select the eligible carrier with the lowest landed cost whose published transit time does not exceed the number of days remaining until the promised delivery date.</p>
<p><strong>Label-4:</strong> The system shall select the eligible carrier with the shortest transit time, rather than the lowest cost, for shipments whose order carries an express service level.</p>
<p><strong>Label-5:</strong> The system shall store the quote obtained from every eligible carrier against the shipment, including the quotes not selected.</p>
<p><strong>Label-6:</strong> The system shall purchase exactly one label per shipment, and shall query the selected carrier for an existing label against the shipment reference before purchasing when a previous purchase attempt returned no response.</p>
<p><strong>Label-7:</strong> The system shall exclude a carrier that rejects a label request and shall attempt the next-best quote, up to three carriers, before raising a labelling exception.</p>
<p><strong>Label-8:</strong> The system shall raise a labelling exception, and shall leave the shipment in the status Packed, when no carrier is eligible or when every carrier quote request fails.</p>
<h3>3.9 Carrier tracking event ingestion</h3>
<p><strong>Description.</strong> Automatic receipt and application of carrier status events. Realizes
FE-9 · Use case UC-08 · Objective BO-4.
<strong>Priority:</strong> Medium · <strong>Release:</strong> 1.1</p>
<p><strong>Event-1:</strong> The system shall accept tracking events pushed by a carrier and shall authenticate the sending carrier before applying any event.</p>
<p><strong>Event-2:</strong> The system shall request tracking events for every open shipment of any carrier that does not push events, at an interval configurable and defaulting to 15 minutes.</p>
<p><strong>Event-3:</strong> The system shall map each carrier status code to an OMFS status, and shall store without applying any event whose carrier status code has no mapping, raising a configuration alert.</p>
<p><strong>Event-4:</strong> The system shall order tracking events by the event time recorded by the carrier, and shall not change a shipment status on receipt of an event older than the latest event already applied to that shipment.</p>
<p><strong>Event-5:</strong> The system shall store, for every tracking event, both the carrier event time and the time OMFS received it.</p>
<p><strong>Event-6:</strong> The system shall retain in an orphan queue, for 30 days, any tracking event whose tracking number matches no shipment.</p>
<p><strong>Event-7:</strong> The system shall raise a fulfillment exception for any shipment that has been collected and has received no tracking event for 48 hours.</p>
<p><strong>Event-8:</strong> The system shall close an order when every shipment belonging to that order has reached the status Delivered.</p>
<h3>3.10 Customer notification and self-service tracking</h3>
<p><strong>Description.</strong> The customer-facing view of order and shipment status. Realizes FE-10
· Use case UC-09 · Objective BO-4.
<strong>Priority:</strong> Medium · <strong>Release:</strong> 1.2</p>
<p><strong>Track-1:</strong> The system shall issue, at the time a shipment is labelled, a tracking link containing a token unique to one order, and shall send that link to the customer through the notification service.</p>
<p><strong>Track-2:</strong> The system shall disclose, in response to a tracking request, information relating only to the single order identified by the token in that request.</p>
<p><strong>Track-3:</strong> The system shall present each shipment of a split order separately, with its carrier, tracking number, current status and event history, together with an explanation that the order was split.</p>
<p><strong>Track-4:</strong> The system shall display, for any shipment whose most recent carrier event is older than 48 hours, the time of that event and a statement that no later information has been received, in accordance with BR-09.</p>
<p><strong>Track-5:</strong> The system shall return an identical response for an invalid token and for a token referring to a non-existent order.</p>
<p><strong>Track-6:</strong> The system shall present the order-level status, expressed in customer-facing wording, for an order that has no shipment.</p>
<p><strong>Track-7:</strong> The system shall record each tracking view, so that self-service usage can be measured against business objective BO-4.</p>
<h3>3.11 Fulfillment exception management</h3>
<p><strong>Description.</strong> One queue for every failure in the fulfillment lifecycle. Realizes
FE-11 · Use case UC-10 · Objectives BO-1, BO-2.
<strong>Priority:</strong> Medium · <strong>Release:</strong> 1.2</p>
<p><strong>Except-1:</strong> The system shall present open fulfillment exceptions ordered by delivery-date risk computed in accordance with BR-09, and shall identify exceptions that have exceeded the service level defined for their type.</p>
<p><strong>Except-2:</strong> The system shall offer, for a selected exception, only the resolution options defined for that exception type.</p>
<p><strong>Except-3:</strong> The system shall record, for every resolution applied, the resolving user, the time, the resolution chosen and a mandatory reason.</p>
<p><strong>Except-4:</strong> The system shall apply a resolution in full or not at all, and shall leave the exception open when any part of the resolution fails.</p>
<p><strong>Except-5:</strong> The system shall reject a resolution whose preconditions no longer hold, and shall present the refreshed exception to the user.</p>
<p><strong>Except-6:</strong> The system shall permit a Fulfillment Manager to apply one resolution to several selected exceptions that share an exception type and cause.</p>
<p><strong>Except-7:</strong> The system shall escalate to the supervisor of the assigned Fulfillment Manager any exception open longer than the service level defined for its type.</p>
<h3>3.12 Order cancellation and modification</h3>
<p><strong>Description.</strong> Stopping or changing an order while it remains stoppable. Realizes
FE-12 · Use case UC-11 · Objective BO-1.
<strong>Priority:</strong> Medium · <strong>Release:</strong> 1.0</p>
<p><strong>Cancel-1:</strong> The system shall permit cancellation or modification of an order only before a shipping label has been purchased for any of its shipments, in accordance with BR-05.</p>
<p><strong>Cancel-2:</strong> The system shall release every reservation belonging to a cancelled order or cancelled order line, in accordance with BR-05, and shall publish the resulting stock change to every affected sales channel.</p>
<p><strong>Cancel-3:</strong> The system shall re-route the remaining lines of an order after a line has been cancelled or its quantity reduced.</p>
<p><strong>Cancel-4:</strong> The system shall permit cancellation but shall refuse modification of an order originating from a channel whose type is Marketplace, in accordance with BR-16, and shall state which channel policy applies.</p>
<p><strong>Cancel-5:</strong> The system shall re-validate a changed shipping address and shall re-route the order before accepting the change.</p>
<p><strong>Cancel-6:</strong> The system shall hold a cancellation requested for a shipment already in picking as Pending-Stop, and shall release reservations only after the fulfillment center confirms that picking has stopped.</p>
<p><strong>Cancel-7:</strong> The system shall queue for retry any cancellation notification that a sales channel rejects, and shall raise an alert when the notification remains undelivered after three attempts.</p>
<h3>3.13 Returns and restocking</h3>
<p><strong>Description.</strong> Authorization, receipt, inspection and restocking of returned goods.
Realizes FE-13 · Use case UC-12.
<strong>Priority:</strong> Low · <strong>Release:</strong> 2.0</p>
<p><strong>Return-1:</strong> The system shall create a return authorization only for lines whose delivery date falls within the return window defined by BR-14.</p>
<p><strong>Return-2:</strong> The system shall permit a supervisor to authorize a return outside the return window, and shall record the supervisor and a mandatory reason.</p>
<p><strong>Return-3:</strong> The system shall record, for each returned line, the quantity received and the inspection outcome recorded by the operator.</p>
<p><strong>Return-4:</strong> The system shall increase the on-hand quantity of a returned item recorded as sellable, and shall move to quarantine the quantity of any item recorded as damaged, in accordance with BR-15.</p>
<p><strong>Return-5:</strong> The system shall close as not received any return authorization for which no goods have arrived within 30 days of authorization.</p>
<p><strong>Return-6:</strong> The system shall place in an unidentified-returns queue any returned parcel that carries no readable return authorization or shipment reference.</p>
<p><strong>Return-7:</strong> The system shall raise a fulfillment exception for any quantity received in excess of the authorized quantity.</p>
<h3>3.14 Fulfillment performance dashboard and cost reconciliation</h3>
<p><strong>Description.</strong> Continuous visibility of the six business objectives. Realizes FE-14 ·
Use case UC-14 · All objectives.
<strong>Priority:</strong> Low · <strong>Release:</strong> 2.0</p>
<p><strong>Dash-1:</strong> The system shall present orders shipped, order-to-ship cycle time, oversell rate, automated routing rate, open exception count and shipping cost per order, each against its target.</p>
<p><strong>Dash-2:</strong> The system shall compute every dashboard metric using the definition recorded for the corresponding success metric in the Vision and Scope document §1.4.</p>
<p><strong>Dash-3:</strong> The system shall identify every SKU whose available-to-promise meets the at-risk-of-stockout condition defined by BR-18.</p>
<p><strong>Dash-4:</strong> The system shall restrict the fulfillment centers, sales channels and brands visible to a user to those permitted by that user's role.</p>
<p><strong>Dash-5:</strong> The system shall display, with every metric, the period it covers and the time the underlying data was last refreshed.</p>
<p><strong>Dash-6:</strong> The system shall present the quotes stored against shipments alongside the amounts invoiced by each carrier, for a period selected by the Logistics Manager.</p>
<p><strong>Dash-7:</strong> The system shall present a state indicating that no data exists for a selected period, distinct from a state in which the metric value is zero.</p>
<p><strong>Dash-8:</strong> The system shall present the metrics that completed, and shall identify those that did not, when computation of any metric does not complete.</p>
<hr />
<h3>4. Data Requirements</h3>
<h3>4.1 Logical Data Model</h3>
<p>The entity-relationship model is in <strong>Appendix B</strong>, Figure B-2. It is a <em>logical</em>
model — it describes the data the business deals with, not a database schema. Table
design, indexing and physical storage are design decisions outside the scope of this
document.</p>
<p>Principal entities and relationships:</p>
<table>
<thead>
<tr>
<th>Entity</th>
<th>Relationship</th>
</tr>
</thead>
<tbody>
<tr>
<td>Sales Channel</td>
<td>1 → n Order</td>
</tr>
<tr>
<td>Order</td>
<td>1 → n Order Line · 1 → n Shipment · 1 → 0..n Fulfillment Exception · 1 → 0..n Return Authorization</td>
</tr>
<tr>
<td>Order Line</td>
<td>1 → 0..n Reservation</td>
</tr>
<tr>
<td>Fulfillment Center</td>
<td>1 → n Inventory Record · 1 → n Shipment · 1 → n Pick Wave</td>
</tr>
<tr>
<td>Item</td>
<td>1 → n Inventory Record · 1 → n Order Line</td>
</tr>
<tr>
<td>Shipment</td>
<td>1 → n Shipment Line · 1 → 0..n Carton · 1 → 0..n Tracking Event · n → 0..1 Pick Wave</td>
</tr>
<tr>
<td>Routing Decision</td>
<td>1 → 1..3 Routing Score, 1 → 1 Order</td>
</tr>
<tr>
<td>Return Authorization</td>
<td>1 → n Return Line</td>
</tr>
</tbody>
</table>
<p>The relationship that most constrains design is <strong>Order → Shipment</strong>: an order may
have several shipments (BR-08) while an order <em>line</em> may not be split across
fulfillment centers (BR-01). Collapsing shipment into order — a tempting
simplification — makes a split order unrepresentable.</p>
<h3>4.2 Data Dictionary</h3>
<p>The definition, composition, type, length and allowed values of every data element is
held in the separate <strong>Data Dictionary</strong> document (R4), which contains 110 entries. It
is maintained separately so it can be reused by later projects and so it can change
without re-baselining this SRS.</p>
<h3>4.3 Reports</h3>
<table>
<thead>
<tr>
<th>ID</th>
<th>Report</th>
<th>Content and sort order</th>
<th>Audience</th>
<th>Frequency</th>
</tr>
</thead>
<tbody>
<tr>
<td>RPT-1</td>
<td>Daily fulfillment summary</td>
<td>Orders received, shipped, cancelled and backordered; cycle time; by fulfillment center; sorted by center</td>
<td>Fulfillment Manager</td>
<td>Daily 07:00</td>
</tr>
<tr>
<td>RPT-2</td>
<td>Oversell incidents</td>
<td>Every order cancelled or short-shipped for insufficient stock, with SKU, channel and timestamp; sorted by date descending</td>
<td>Inventory Controller</td>
<td>Weekly</td>
</tr>
<tr>
<td>RPT-3</td>
<td>Exception ageing</td>
<td>Open exceptions by type and age band, with service-level breaches; sorted by age descending</td>
<td>Fulfillment Manager</td>
<td>Daily</td>
</tr>
<tr>
<td>RPT-4</td>
<td>Carrier cost reconciliation</td>
<td>Quoted against invoiced cost per carrier per month, with variance; sorted by variance descending</td>
<td>Logistics Manager</td>
<td>Monthly</td>
</tr>
<tr>
<td>RPT-5</td>
<td>Stock at risk</td>
<td>SKUs meeting the condition in BR-18, with velocity and available-to-promise; sorted by days of cover ascending</td>
<td>Inventory Controller</td>
<td>Daily</td>
</tr>
<tr>
<td>RPT-6</td>
<td>Channel synchronization drift</td>
<td>SKUs where channel quantity differed from OMFS at reconciliation; sorted by channel</td>
<td>System Administrator</td>
<td>Daily</td>
</tr>
<tr>
<td>RPT-7</td>
<td>Brand fulfillment performance</td>
<td>Cycle time, cancellation rate and delivery success by brand; sorted by brand</td>
<td>Brand Manager</td>
<td>Weekly</td>
</tr>
</tbody>
</table>
<p>Report layouts are deferred to design. This section specifies content, sort order,
audience and frequency only.</p>
<h3>4.4 Data Acquisition, Integrity, Retention and Disposal</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Requirement</th>
</tr>
</thead>
<tbody>
<tr>
<td>DA-1</td>
<td>The system shall acquire order data only from connected sales channels, and shall not permit an order to be created manually.</td>
</tr>
<tr>
<td>DA-2</td>
<td>The system shall acquire item master and opening stock data by a one-time migration, and shall reject any record failing the agreed validation rules rather than importing it partially.</td>
</tr>
<tr>
<td>DA-3</td>
<td>The system shall record, for every change to a reservation or an on-hand quantity, the time, the cause and the user or process responsible.</td>
</tr>
<tr>
<td>DA-4</td>
<td>The system shall retain order, shipment and tracking data for 24 months, after which it shall be archived and removed from the operational store.</td>
</tr>
<tr>
<td>DA-5</td>
<td>The system shall retain the audit record of inventory movements for 7 years, in accordance with accounting retention policy.</td>
</tr>
<tr>
<td>DA-6</td>
<td>The system shall remove customer name, address, telephone number and email address from archived orders after 24 months, retaining the order and its quantities.</td>
</tr>
<tr>
<td>DA-7</td>
<td>The system shall verify daily that the sum of reserved quantities equals the sum of open reservations, and shall raise a data-quality alert on any discrepancy.</td>
</tr>
</tbody>
</table>
<hr />
<h3>5. External Interface Requirements</h3>
<h3>5.1 User Interfaces</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Requirement</th>
</tr>
</thead>
<tbody>
<tr>
<td>UI-1</td>
<td>The system shall provide four distinct interfaces: the handheld pick and pack interface, the manager web interface, the agent web interface, and the public customer tracking page.</td>
</tr>
<tr>
<td>UI-2</td>
<td>The handheld interface shall be operable with one hand, shall present touch targets of at least 48 × 48 device-independent pixels, and shall remain legible when the operator is wearing gloves.</td>
</tr>
<tr>
<td>UI-3</td>
<td>Every interface shall present an error message that states what happened, what the system did about it, and what the user can do next.</td>
</tr>
<tr>
<td>UI-4</td>
<td>Every destructive action shall require a confirmation that names the object being acted on.</td>
</tr>
<tr>
<td>UI-5</td>
<td>The customer tracking page shall be usable without sign-in and shall not request any personal data from the customer.</td>
</tr>
<tr>
<td>UI-6</td>
<td>Screen designs for the three most complex use cases are illustrated in R5; where R5 and this document differ, this document governs.</td>
</tr>
</tbody>
</table>
<h3>5.2 Software Interfaces</h3>
<table>
<thead>
<tr>
<th>ID</th>
<th>Interface</th>
<th>Direction</th>
<th>Content</th>
<th>Service level</th>
</tr>
</thead>
<tbody>
<tr>
<td>SI-1</td>
<td>Sales channel — order retrieval</td>
<td>In</td>
<td>Orders created since a watermark</td>
<td>Poll interval ≤ 60 s; retry per Ingest-4</td>
</tr>
<tr>
<td>SI-2</td>
<td>Sales channel — stock update</td>
<td>Out</td>
<td>SKU and sellable quantity</td>
<td>Publication within 60 s of change (Sync-3)</td>
</tr>
<tr>
<td>SI-3</td>
<td>Sales channel — cancellation</td>
<td>Both</td>
<td>Cancellation of an order</td>
<td>Queued and retried per Cancel-7</td>
</tr>
<tr>
<td>SI-4</td>
<td>Payment gateway — authorization status</td>
<td>In</td>
<td>Authorization state for an order; <strong>no card data</strong> (CO-5)</td>
<td>Response expected within 5 s; timeout at 5 min (Validate-5)</td>
</tr>
<tr>
<td>SI-5</td>
<td>Carrier — rate quote</td>
<td>Out / in</td>
<td>Origin, destination, weight, dimensions → cost and transit days</td>
<td>Quotes requested in parallel; overall timeout 10 min (Label-8)</td>
</tr>
<tr>
<td>SI-6</td>
<td>Carrier — label purchase</td>
<td>Out / in</td>
<td>Shipment detail → tracking number and label document</td>
<td>Exactly-once per shipment (Label-6)</td>
</tr>
<tr>
<td>SI-7</td>
<td>Carrier — tracking events</td>
<td>In</td>
<td>Status events, pushed or polled</td>
<td>Applied within 15 min p95 (QA-6)</td>
</tr>
<tr>
<td>SI-8</td>
<td>ERP / accounting — financial posting</td>
<td>Out</td>
<td>Daily shipped-order totals per brand and channel</td>
<td>Once daily; failure raises an alert</td>
</tr>
<tr>
<td>SI-9</td>
<td>Notification service — customer messages</td>
<td>Out</td>
<td>Email and SMS with the order tracking link</td>
<td>Sent within 5 min of the triggering event</td>
</tr>
<tr>
<td>SI-10</td>
<td>Identity provider — staff authentication</td>
<td>In</td>
<td>Authentication assertion and role claims (CO-1)</td>
<td>Per corporate standard</td>
</tr>
</tbody>
</table>
<p><strong>SI-1 through SI-7 shall be isolated behind an internal interface</strong> so that adding a
channel or a carrier requires no change to order, inventory or routing logic (CO-6).</p>
<h3>5.3 Hardware Interfaces</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Requirement</th>
</tr>
</thead>
<tbody>
<tr>
<td>HI-1</td>
<td>The system shall accept barcode input from the integrated scanner of the Android handheld devices deployed in the fulfillment centers, delivered as keyboard input.</td>
</tr>
<tr>
<td>HI-2</td>
<td>The system shall produce shipping labels in a format accepted by the thermal label printers installed at each fulfillment center.</td>
</tr>
<tr>
<td>HI-3</td>
<td>The system shall function on handheld devices having 2 GB of memory and a 5-inch display (OE-3).</td>
</tr>
</tbody>
</table>
<h3>5.4 Communications Interfaces</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Requirement</th>
</tr>
</thead>
<tbody>
<tr>
<td>CI-1</td>
<td>All communication between OMFS and any external system shall use HTTPS with TLS 1.2 or later.</td>
</tr>
<tr>
<td>CI-2</td>
<td>All communication between a browser or handheld and OMFS shall use HTTPS with TLS 1.2 or later.</td>
</tr>
<tr>
<td>CI-3</td>
<td>The system shall authenticate every inbound carrier webhook before applying the event it carries (Event-1).</td>
</tr>
<tr>
<td>CI-4</td>
<td>Customer notifications shall be sent through the notification service and shall contain no personal data beyond the recipient's own order.</td>
</tr>
<tr>
<td>CI-5</td>
<td>The system shall not place an order identifier, a tracking token or any personal data in a URL query string that is written to an access log.</td>
</tr>
</tbody>
</table>
<hr />
<h3>6. Quality Attributes</h3>
<p>Every attribute below is written in <strong>Planguage</strong> (Gilb): SCALE says what is measured,
METER says how, MUST is the level below which the release is not acceptable, PLAN is
the level being designed for. An attribute without a number is not a requirement — it
is an opinion, and it is not testable.</p>
<h3>6.1 Usability</h3>
<h4>QA-1 — Learnability of the pick and pack interface</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Elapsed minutes for a Warehouse Operator who has never used OMFS to complete their first pick task correctly without assistance</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Timed observation of 10 operators during the Da Nang pilot</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 20 minutes for 9 of 10 operators</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 15 minutes for 9 of 10 operators</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>Warehouse Operator is a favored user class (§2.2) with low technical skill and shift-based turnover. Classroom training is not available at scale.</td>
</tr>
</tbody>
</table>
<h4>QA-2 — Pick step responsiveness on a handheld</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Seconds from barcode scan to the next pick task being displayed, on the deployed handheld hardware</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Instrumented timing on device, 95th percentile over one shift</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 1.5 s</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 0.8 s</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>An operator performs roughly 170 scans a shift. One second of added latency per scan costs three minutes per operator per shift, and directly opposes objective BO-3.</td>
</tr>
</tbody>
</table>
<h4>QA-3 — Error recovery in the manager interface</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Percentage of error states from which a user can proceed without leaving the page or losing entered data</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Review against the exception list in R2, during requirements validation</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>100% for exception-console resolutions</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>100% for all manager interfaces</td>
</tr>
</tbody>
</table>
<h3>6.2 Performance</h3>
<h4>QA-4 — Order acceptance latency</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Seconds from an order being retrieved from a channel to its reservation being confirmed or refused</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Timestamps recorded on the order; 95th percentile, measured daily</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 90 s at average load</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 30 s at average load; ≤ 90 s at peak load</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>Every second between retrieval and reservation is a second in which the same unit can be sold again. This attribute is the latency half of objective BO-1.</td>
</tr>
</tbody>
</table>
<h4>QA-5 — Reservation throughput under flash-sale load</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Reservations confirmed per second without any reservation being lost or duplicated</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Load test against 1.5× the historical peak, before the first campaign date</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>60 reservations/second sustained for 10 minutes</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>90 reservations/second sustained for 10 minutes</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>Campaign-day bursts (risk RI-5). Reservation is the highest-contention operation in the system.</td>
</tr>
</tbody>
</table>
<h4>QA-6 — Stock publication latency</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Seconds from an on-hand or reserved quantity changing to the new sellable quantity being accepted by a sales channel</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Difference between the stock-change time and the publication time; 95th percentile, measured daily</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 120 s</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 60 s (the target in BR-20)</td>
</tr>
</tbody>
</table>
<h4>QA-7 — Tracking event ingestion lag</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Minutes from a carrier's own event timestamp to the order status in OMFS reflecting that event</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Difference between Carrier Event Time and Received At; 95th percentile, measured daily</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 30 minutes</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 15 minutes</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>This is the measured success criterion for objective BO-4. A tracking page is only worth offering if what it shows is current.</td>
</tr>
</tbody>
</table>
<h4>QA-8 — Manager interface responsiveness</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Seconds to first meaningful display for the routing workbench, exception console and dashboard</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Synthetic monitoring from the office network; 95th percentile</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 4 s</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 2 s</td>
</tr>
</tbody>
</table>
<h3>6.3 Security</h3>
<h4>QA-9 — Tracking token resistance</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Expected number of guesses to obtain a valid tracking token for any order</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Analysis of token entropy plus a rate-limiting test</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≥ 2⁶⁴ guesses, with requests rate-limited per source address</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≥ 2¹²⁸ guesses</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>The tracking page is the only publicly reachable surface and it carries a customer's name, address and order contents. Requirement Track-2 is meaningless without this number.</td>
</tr>
</tbody>
</table>
<h4>QA-10 — Authorization enforcement</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Percentage of privileged operations that enforce the required role on the server, not only in the interface</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Security review of every operation listed in section 3, before release</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>100%</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>100%, with automated tests covering routing override (BR-19), exception resolution and configuration change</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>Hiding a control in the interface is not authorization. BR-19 is enforceable only on the server.</td>
</tr>
</tbody>
</table>
<h4>QA-11 — Audit completeness</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Percentage of inventory movements, routing overrides and exception resolutions for which the actor, time and reason can be retrieved</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Sampling of 50 records per category during requirements validation</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>100%</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>100%, retrievable within 5 seconds</td>
</tr>
</tbody>
</table>
<h4>QA-12 — Credential handling</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Number of third-party API keys or payment credentials retrievable from a browser or handheld</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Inspection of delivered bundles and network traffic</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>0</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>0 (constraints CO-2, CO-5)</td>
</tr>
</tbody>
</table>
<h3>6.4 Safety and Integrity</h3>
<h4>QA-13 — Inventory conservation</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Number of units of stock created or destroyed by the system rather than by a recorded physical event, per month</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Daily reconciliation per DA-7</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>0</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>0, with any discrepancy alerted within 24 hours</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>A double deduction or a lost reservation reintroduces the oversell problem the project exists to remove, and it does so silently.</td>
</tr>
</tbody>
</table>
<h4>QA-14 — Atomicity of order state changes</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Number of orders left in a partial state — partly reserved, partly routed, partly labelled — after a process failure</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Fault-injection testing of reservation, routing and labelling</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>0</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>0 (postconditions UC-03 POST-1, UC-04 POST-1, UC-07 POST-1)</td>
</tr>
</tbody>
</table>
<h3>6.5 Availability, Scalability and Maintainability</h3>
<h4>QA-15 — Availability during the fulfillment day</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Percentage of minutes between 06:00 and 22:00 local time in which order ingestion, reservation and picking are all available</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Synthetic monitoring, measured monthly</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>99.5%</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>99.9%, and 99.95% on the five annual campaign dates</td>
</tr>
</tbody>
</table>
<h4>QA-16 — Peak capacity</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Orders ingested, reserved, routed and picked in one day without additional staff</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Load test before the first campaign date, then observed on the day</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>18,000 orders/day (the historical peak)</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>20,000 orders/day (objective BO-6)</td>
</tr>
</tbody>
</table>
<h4>QA-17 — Recovery time</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Minutes from an unplanned outage being detected to fulfillment operations resuming</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Disaster-recovery rehearsal, twice yearly</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 60 minutes, with no order lost</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 20 minutes, with no order lost</td>
</tr>
</tbody>
</table>
<h4>QA-18 — Cost of adding a channel or carrier</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Developer-days to add one further sales channel or one further carrier</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Measured when the fourth channel is added in release 1.1</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 10 developer-days, with no change to order, inventory or routing logic</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 5 developer-days (constraint CO-6)</td>
</tr>
<tr>
<td><strong>Rationale</strong></td>
<td>NRG has added four channels in 24 months and expects to add more. Integration cost is a business constraint, not a technical preference.</td>
</tr>
</tbody>
</table>
<hr />
<h3>7. Internationalization and Localization Requirements</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Requirement</th>
</tr>
</thead>
<tbody>
<tr>
<td>IL-1</td>
<td>The system shall present all staff and customer interfaces in Vietnamese, with English available for the System Administrator interface only.</td>
</tr>
<tr>
<td>IL-2</td>
<td>The system shall store all monetary amounts in Vietnamese dong with no decimal fraction, and shall present them grouped by thousands using a full stop.</td>
</tr>
<tr>
<td>IL-3</td>
<td>The system shall present dates in DD/MM/YYYY and times in 24-hour form.</td>
</tr>
<tr>
<td>IL-4</td>
<td>The system shall store every timestamp with an explicit UTC offset and present it in Asia/Ho_Chi_Minh.</td>
</tr>
<tr>
<td>IL-5</td>
<td>The system shall accept and correctly store Vietnamese diacritics in every name and address field, and shall transmit them to carriers in the encoding each carrier requires.</td>
</tr>
<tr>
<td>IL-6</td>
<td>The system shall sort Vietnamese text according to Vietnamese collation rules, not byte order.</td>
</tr>
</tbody>
</table>
<p>Support for further languages or currencies is not required for releases 1.0–2.0. This
is recorded rather than omitted, because a later expansion beyond Vietnam would make
IL-1 and IL-2 obsolete rather than merely incomplete.</p>
<hr />
<h3>8. Other Requirements</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Requirement</th>
</tr>
</thead>
<tbody>
<tr>
<td>OR-1</td>
<td>The system shall retain personal data in accordance with Decree 13/2023/ND-CP on personal data protection, and shall permit the erasure of a customer's personal data from archived orders on request (DA-6).</td>
</tr>
<tr>
<td>OR-2</td>
<td>The system shall be installable into a new environment from version-controlled configuration, with no manual step that is not documented.</td>
</tr>
<tr>
<td>OR-3</td>
<td>The system shall be delivered with the operational runbook needed by the NRG IT service desk to diagnose failed ingestion, failed publication and stalled shipments.</td>
</tr>
<tr>
<td>OR-4</td>
<td>The system shall permit data migration to be executed repeatedly against a non-production environment without residue from previous runs.</td>
</tr>
<tr>
<td>OR-5</td>
<td>Every third-party library used shall carry a licence compatible with commercial internal use; copyleft licences requiring source distribution shall not be used.</td>
</tr>
</tbody>
</table>
<hr />
<h2>Appendix A: Glossary</h2>
<table>
<thead>
<tr>
<th>Term</th>
<th>Definition</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>ATP</strong></td>
<td>Available to promise — the quantity of a SKU that may be promised to a new order; see BR-07 and the Data Dictionary</td>
</tr>
<tr>
<td><strong>Backorder</strong></td>
<td>An order accepted but not fulfillable from current stock</td>
</tr>
<tr>
<td><strong>Carton</strong></td>
<td>One physical box within a shipment</td>
</tr>
<tr>
<td><strong>Cut-off</strong></td>
<td>The daily time after which orders dispatch the next working day; BR-10</td>
</tr>
<tr>
<td><strong>Fulfillment center (FC)</strong></td>
<td>A warehouse from which orders are shipped</td>
</tr>
<tr>
<td><strong>Landed cost</strong></td>
<td>Total shipping cost including surcharges and discounts; BR-12</td>
</tr>
<tr>
<td><strong>Order</strong></td>
<td>A customer purchase received from one sales channel</td>
</tr>
<tr>
<td><strong>Oversell</strong></td>
<td>Accepting an order for stock that does not exist</td>
</tr>
<tr>
<td><strong>Pick wave</strong></td>
<td>A batch of shipments released to the warehouse floor together</td>
</tr>
<tr>
<td><strong>Rate shopping</strong></td>
<td>Comparing carriers on cost and service level before buying a label</td>
</tr>
<tr>
<td><strong>Reservation</strong></td>
<td>A hold placed on stock for an order line</td>
</tr>
<tr>
<td><strong>RMA</strong></td>
<td>Return merchandise authorization</td>
</tr>
<tr>
<td><strong>Routing</strong></td>
<td>Deciding which fulfillment center ships which lines</td>
</tr>
<tr>
<td><strong>Shipment</strong></td>
<td>The portion of an order fulfilled from one fulfillment center</td>
</tr>
<tr>
<td><strong>Short pick</strong></td>
<td>Finding fewer units on the shelf than the pick task requires</td>
</tr>
<tr>
<td><strong>SKU</strong></td>
<td>Stock keeping unit — the unique identifier of a sellable product</td>
</tr>
<tr>
<td><strong>Split order</strong></td>
<td>An order fulfilled from more than one fulfillment center</td>
</tr>
<tr>
<td><strong>3PL</strong></td>
<td>Third-party logistics — an external carrier</td>
</tr>
<tr>
<td><strong>WISMO</strong></td>
<td>"Where is my order?" — a customer contact asking for order status</td>
</tr>
</tbody>
</table>
<h2>Appendix B: Analysis Models</h2>
<table>
<thead>
<tr>
<th>Figure</th>
<th>Model</th>
<th>Location</th>
</tr>
</thead>
<tbody>
<tr>
<td>B-1</td>
<td>System context diagram</td>
<td><code>diagrams/use-case-diagram.png</code> (boundary and external actors)</td>
</tr>
<tr>
<td>B-2</td>
<td>Logical data model (ERD)</td>
<td><em>to be produced in design; entities and relationships listed in §4.1</em></td>
</tr>
<tr>
<td>B-3</td>
<td>Use case diagram</td>
<td><code>diagrams/use-case-diagram.png</code> · editable source <code>diagrams/use-case-diagram.drawio</code></td>
</tr>
<tr>
<td>B-4</td>
<td>Order state model</td>
<td>States listed under <em>Order Status</em> in the Data Dictionary; transitions are given by the use case postconditions</td>
</tr>
<tr>
<td>B-5</td>
<td>Screen mock-ups</td>
<td><code>mockups/</code> — see R5</td>
</tr>
</tbody>
</table>
<h2>Appendix C: TBD List</h2>
<p>An SRS with no open items at this stage is not finished; it is unexamined. These are
tracked, owned and dated.</p>
<table>
<thead>
<tr>
<th>#</th>
<th>Open question</th>
<th>Affects</th>
<th>Owner</th>
<th>Target</th>
</tr>
</thead>
<tbody>
<tr>
<td>TBD-1</td>
<td>Does the return window in BR-14 run from delivery or from dispatch? Two stakeholders answered differently.</td>
<td>Return-1</td>
<td>Customer Service Manager</td>
<td>Week 7</td>
</tr>
<tr>
<td>TBD-2</td>
<td>Are the routing weights in BR-06 the same for all five brands in release 1.0, or per brand?</td>
<td>Route-2, Route-8</td>
<td>Fulfillment Manager</td>
<td>Week 6</td>
</tr>
<tr>
<td>TBD-3</td>
<td>Does safety stock in BR-17 apply per channel as well as per fulfillment center?</td>
<td>Reserve-6, Sync-2</td>
<td>Inventory Controller</td>
<td>Week 7</td>
</tr>
<tr>
<td>TBD-4</td>
<td>Exact customer-facing wording when a carrier has gone silent.</td>
<td>Track-4</td>
<td>Brand Manager</td>
<td>Week 8</td>
</tr>
<tr>
<td>TBD-5</td>
<td>Does the ERP posting in SI-8 require per-brand or per-channel breakdown, or both?</td>
<td>SI-8</td>
<td>Finance</td>
<td>Week 7</td>
</tr>
</tbody>
</table>
<h2>Appendix D: Requirements Traceability Matrix</h2>
<table>
<thead>
<tr>
<th>Feature (R1 §2.1)</th>
<th>SRS section</th>
<th>Use case (R2)</th>
<th>Functional requirements</th>
<th>Business rules (R3)</th>
<th>Objective</th>
</tr>
</thead>
<tbody>
<tr>
<td>FE-1 Order ingestion</td>
<td>3.1</td>
<td>UC-01</td>
<td>Ingest-1 … Ingest-6</td>
<td>BR-16</td>
<td>BO-2</td>
</tr>
<tr>
<td>FE-2 Screening and validation</td>
<td>3.2</td>
<td>UC-02</td>
<td>Validate-1 … Validate-6</td>
<td>BR-03, BR-04</td>
<td>BO-1</td>
</tr>
<tr>
<td>FE-3 Inventory and ATP</td>
<td>3.3</td>
<td>UC-03</td>
<td>Reserve-1 … Reserve-7</td>
<td>BR-01, BR-02, BR-04, BR-07, BR-08, BR-17</td>
<td>BO-1</td>
</tr>
<tr>
<td>FE-4 Channel stock sync</td>
<td>3.4</td>
<td>UC-13</td>
<td>Sync-1 … Sync-7</td>
<td>BR-07, BR-17, BR-20</td>
<td>BO-1</td>
</tr>
<tr>
<td>FE-5 Routing and splitting</td>
<td>3.5</td>
<td>UC-04</td>
<td>Route-1 … Route-8</td>
<td>BR-01, BR-06, BR-08, BR-09, BR-10, BR-19</td>
<td>BO-2, BO-3</td>
</tr>
<tr>
<td>FE-6 Pick wave</td>
<td>3.6</td>
<td>UC-05</td>
<td>Wave-1 … Wave-7</td>
<td>BR-10, BR-13</td>
<td>BO-3</td>
</tr>
<tr>
<td>FE-7 Scan-verified pick</td>
<td>3.7</td>
<td>UC-06</td>
<td>Pick-1 … Pick-8</td>
<td>BR-07, BR-13, BR-17</td>
<td>BO-2, BO-3</td>
</tr>
<tr>
<td>FE-8 Rate shopping and label</td>
<td>3.8</td>
<td>UC-07</td>
<td>Label-1 … Label-8</td>
<td>BR-11, BR-12</td>
<td>BO-5</td>
</tr>
<tr>
<td>FE-9 Tracking ingestion</td>
<td>3.9</td>
<td>UC-08</td>
<td>Event-1 … Event-8</td>
<td>BR-09</td>
<td>BO-4</td>
</tr>
<tr>
<td>FE-10 Notification and tracking</td>
<td>3.10</td>
<td>UC-09</td>
<td>Track-1 … Track-7</td>
<td>BR-09</td>
<td>BO-4</td>
</tr>
<tr>
<td>FE-11 Exception management</td>
<td>3.11</td>
<td>UC-10</td>
<td>Except-1 … Except-7</td>
<td>BR-05, BR-09, BR-13</td>
<td>BO-1, BO-2</td>
</tr>
<tr>
<td>FE-12 Cancel and modify</td>
<td>3.12</td>
<td>UC-11</td>
<td>Cancel-1 … Cancel-7</td>
<td>BR-05, BR-16</td>
<td>BO-1</td>
</tr>
<tr>
<td>FE-13 Returns and restocking</td>
<td>3.13</td>
<td>UC-12</td>
<td>Return-1 … Return-7</td>
<td>BR-14, BR-15</td>
<td>—</td>
</tr>
<tr>
<td>FE-14 Dashboard and reconciliation</td>
<td>3.14</td>
<td>UC-14</td>
<td>Dash-1 … Dash-8</td>
<td>BR-06, BR-09, BR-18</td>
<td>All</td>
</tr>
</tbody>
</table>
<p><strong>Objectives covered by quality attributes rather than features:</strong> BO-6 (peak capacity)
is delivered by QA-16; the latency half of BO-1 by QA-4 and QA-6; the measurement of
BO-4 by QA-7.</p></div>
<div class="ml-vi"><h2>Đặc tả Yêu cầu Phần mềm (SRS)</h2>
<h2>cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên nhóm trưởng&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Nova Retail Group (NRG)
17 tháng 9 năm 2026</p>
<hr />
<h3>Lịch sử sửa đổi</h3>
<table>
<thead>
<tr>
<th>Người</th>
<th>Ngày</th>
<th>Lý do sửa</th>
<th>Phiên bản</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Bản nháp đầu — mục 1–2 lấy từ Vision &amp; Scope, mục 3 lấy từ use case</td>
<td>0.9</td>
</tr>
<tr>
<td>Nhóm BA, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Đã định lượng các thuộc tính chất lượng, hoàn tất mọi mục, chốt bản cơ sở</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h2>Mục lục</h2>
<ol>
<li>Giới thiệu · 2. Mô tả tổng thể · 3. Tính năng hệ thống · 4. Yêu cầu dữ liệu ·</li>
<li>Yêu cầu giao tiếp ngoài · 6. Thuộc tính chất lượng ·</li>
<li>Yêu cầu quốc tế hoá và bản địa hoá · 8. Yêu cầu khác ·
Phụ lục A: Bảng thuật ngữ · Phụ lục B: Mô hình phân tích · Phụ lục C: Danh sách TBD ·
Phụ lục D: Ma trận truy vết yêu cầu</li>
</ol>
<hr />
<h3>1. Giới thiệu</h3>
<h3>1.1 Mục đích</h3>
<p>Tài liệu này đặc tả các yêu cầu phần mềm cho các bản phát hành <strong>1.0 tới 2.0</strong> của <strong>Hệ
thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)</strong>, một nền tảng tập trung quản lý việc hoàn
tất các đơn đổ về Nova Retail Group (NRG) từ bốn kênh bán, qua ba trung tâm hoàn tất đơn
và bốn hãng logistics bên thứ ba.</p>
<p>Nó được viết cho bốn nhóm người đọc:</p>
<table>
<thead>
<tr>
<th>Người đọc</th>
<th>Dùng tài liệu này để</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nhóm phát triển</td>
<td>Hiểu phải xây cái gì và "xong" nghĩa là gì với từng năng lực</td>
</tr>
<tr>
<td>Nhóm kiểm thử</td>
<td>Suy ra các ca kiểm thử; mọi yêu cầu chức năng đều được viết sao cho kiểm được đạt/không đạt</td>
</tr>
<tr>
<td>Quản lý dự án</td>
<td>Khoanh phạm vi các bản phát hành và ước lượng công sức</td>
</tr>
<tr>
<td>Bên liên quan phía nghiệp vụ</td>
<td>Xác nhận rằng thứ sắp được xây đúng là thứ họ đã yêu cầu</td>
</tr>
</tbody>
</table>
<p>Phạm vi của SRS này là <strong>toàn bộ sản phẩm xuyên các bản 1.0–2.0</strong>; mỗi yêu cầu chức năng
đều ghi rõ nó được giao ở bản nào.</p>
<h3>1.2 Quy ước của tài liệu</h3>
<p><strong>Mã yêu cầu.</strong> Mọi yêu cầu chức năng có dạng <code>&amp;lt;Tính năng&amp;gt;-&amp;lt;n&amp;gt;</code>, trong đó <code>&amp;lt;Tính năng&amp;gt;</code>
là tên ngắn của tính năng hệ thống mà nó thuộc về (ví dụ <code>Reserve-2</code>, <code>Route-4</code>,
<code>Label-1</code>). Mã là vĩnh viễn: số của một yêu cầu đã bị xoá không bao giờ được dùng lại.
Yêu cầu thuộc tính chất lượng dùng mã <code>QA-&amp;lt;n&amp;gt;</code>.</p>
<p><strong>Từ "shall" (phải).</strong> Mọi yêu cầu chức năng đều dùng <strong>phải</strong> để diễn đạt một nghĩa vụ.
Các câu dùng "should", "may" hay "will" là văn giải thích, không phải yêu cầu, và không
có gì được kiểm thử theo chúng.</p>
<p><strong>Độ ưu tiên.</strong> Mỗi tính năng hệ thống mang mức Cao, Trung bình hoặc Thấp, lấy từ bảng
tính xếp ưu tiên yêu cầu (deliverable 7). Độ ưu tiên là động và có thể đổi; bảng tính,
chứ không phải tài liệu này, là bản gốc.</p>
<p><strong>Tham chiếu tới các tài liệu khác.</strong> Business rule chỉ xuất hiện dưới dạng <code>BR-n</code> —
nội dung luật nằm trong tài liệu Business Rules và không bao giờ bị chép lại ở đây. Use
case xuất hiện dưới dạng <code>UC-nn</code>. Các phần tử dữ liệu được tham chiếu trong yêu cầu đều
được định nghĩa trong Data Dictionary.</p>
<p><strong>Thuộc tính chất lượng</strong> được viết bằng Planguage (Gilb) với SCALE, METER, MUST và PLAN,
để mọi thuộc tính đều đo được.</p>
<h3>1.3 Phạm vi dự án</h3>
<p>OMFS là bản ghi có thẩm quyền về một đơn hàng, từ lúc nó được lấy về từ một kênh bán cho
tới lúc nó được giao, bị huỷ hoặc được trả lại. Nó duy trì một bức tranh tồn kho thời
gian thực duy nhất trên mọi trung tâm hoàn tất đơn, định tuyến và tách từng đơn một cách
tự động, điều khiển việc nhặt hàng có quét xác nhận, mua nhãn vận chuyển bằng cách so giá
các hãng, giữ cho trạng thái đơn luôn cập nhật từ sự kiện của hãng, và cho khách tự tra
cứu được trạng thái đó.</p>
<p>OMFS <strong>không</strong> thay thế storefront trên web, cổng thanh toán, hệ ERP/kế toán hay một hệ
quản lý kho. Phát biểu đầy đủ về phạm vi, nội dung từng bản phát hành và các loại trừ nằm
trong <strong>tài liệu Vision and Scope</strong>, mục 2.1–2.4, và đó là tài liệu có thẩm quyền, không
bị chép lại ở đây.</p>
<p>Các mục tiêu nghiệp vụ mà OMFS sinh ra để đạt được là BO-1 … BO-6 ở Vision and Scope
§1.3. Mọi tính năng hệ thống ở mục 3 đều truy vết được về ít nhất một trong số đó.</p>
<h3>1.4 Tài liệu tham chiếu</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Tài liệu</th>
<th>Phiên bản</th>
<th>Vị trí</th>
</tr>
</thead>
<tbody>
<tr>
<td>R1</td>
<td>Vision and Scope Document for OMFS</td>
<td>1.0</td>
<td><code>deliverables/01-Vision-and-Scope.md</code></td>
</tr>
<tr>
<td>R2</td>
<td>Use Cases for OMFS</td>
<td>1.0</td>
<td><code>deliverables/02-Use-Cases.md</code></td>
</tr>
<tr>
<td>R3</td>
<td>Business Rules for OMFS</td>
<td>1.0</td>
<td><code>deliverables/03-Business-Rules.md</code></td>
</tr>
<tr>
<td>R4</td>
<td>Data Dictionary for OMFS</td>
<td>1.0</td>
<td><code>deliverables/05-Data-Dictionary.md</code></td>
</tr>
<tr>
<td>R5</td>
<td>Mock-ups for Complex Use Cases</td>
<td>1.0</td>
<td><code>deliverables/06-Mockups.md</code></td>
</tr>
<tr>
<td>R6</td>
<td>Requirement Prioritization Worksheet</td>
<td>1.0</td>
<td><code>deliverables/07-Requirements-Prioritization.xlsx</code></td>
</tr>
<tr>
<td>R7</td>
<td>Requirement Estimation</td>
<td>1.0</td>
<td><code>deliverables/08-Requirements-Estimation.xlsx</code></td>
</tr>
<tr>
<td>R8</td>
<td>Wiegers, K. &amp; Beatty, J., <em>Software Requirements</em>, tái bản lần 3</td>
<td>2013</td>
<td>Microsoft Press</td>
</tr>
<tr>
<td>R9</td>
<td>Ghi chép các buổi khai thác yêu cầu 1–4</td>
<td>—</td>
<td>Thư mục chung của nhóm, <code>elicitation/</code></td>
</tr>
<tr>
<td>R10</td>
<td>Thoả thuận người bán của NRG với các sàn (Shopee, Lazada, TikTok Shop)</td>
<td>hiện hành</td>
<td>Quản lý nhãn hàng</td>
</tr>
</tbody>
</table>
<p><strong>Ghi chú về phương pháp khai thác yêu cầu.</strong> Đầu vào từ bên liên quan được lấy qua bốn
buổi mô phỏng bên liên quan (R9), trong đó thành viên nhóm đóng các vai có tên và chỉ trả
lời những gì vai đó hợp lý là biết. Chỗ nào không có câu trả lời từ bên liên quan thì mục
đó được ghi vào danh sách TBD (Phụ lục C) chứ không bịa ra.</p>
<hr />
<h3>2. Mô tả tổng thể</h3>
<h3>2.1 Góc nhìn sản phẩm</h3>
<p>OMFS là một <strong>hệ thống mới thay thế một quy trình thủ công</strong>, không phải một phiên bản
mới của một sản phẩm đang có. Quy trình mà nó thay thế — một bảng tính tồn kho dùng
chung, phiếu nhặt hàng in ra và bốn cổng web của hãng vận chuyển — vẫn còn nguyên cho tới
khi từng trung tâm được chuyển đổi, và vẫn chạy được như một đường lùi trong hai tuần sau
mỗi lần chuyển đổi (R1 §3.3).</p>
<p>OMFS nằm <strong>phía sau</strong> storefront hướng tới khách và <strong>phía trước</strong> nhà kho vật lý cùng
các hãng vận chuyển. Context diagram nằm ở Phụ lục B.</p>
<p><strong>Các hệ thống mà OMFS trao đổi dữ liệu</strong></p>
<table>
<thead>
<tr>
<th>Hệ thống ngoài</th>
<th>Chiều</th>
<th>Cái gì đi qua ranh giới</th>
</tr>
</thead>
<tbody>
<tr>
<td>Storefront trên web</td>
<td>Vào / ra</td>
<td>Đơn hàng đi vào; số lượng bán được đi ra</td>
</tr>
<tr>
<td>Các kênh sàn TMĐT (3)</td>
<td>Vào / ra</td>
<td>Đơn hàng đi vào; số lượng bán được đi ra; lệnh huỷ đi cả hai chiều</td>
</tr>
<tr>
<td>Cổng thanh toán</td>
<td>Vào</td>
<td>Trạng thái uỷ quyền thanh toán (chỉ đọc)</td>
</tr>
<tr>
<td>API các hãng 3PL (4)</td>
<td>Ra / vào</td>
<td>Yêu cầu báo giá và lệnh mua nhãn đi ra; sự kiện theo dõi đi vào</td>
</tr>
<tr>
<td>ERP / kế toán</td>
<td>Ra</td>
<td>Lượt ghi sổ hằng ngày về tài chính của các đơn đã giao</td>
</tr>
<tr>
<td>Dịch vụ thông báo</td>
<td>Ra</td>
<td>Email và SMS tới khách hàng</td>
</tr>
</tbody>
</table>
<h3>2.2 Các lớp người dùng và đặc điểm</h3>
<table>
<thead>
<tr>
<th>Lớp người dùng</th>
<th>Quy mô</th>
<th>Tần suất dùng</th>
<th>Trình độ kỹ thuật</th>
<th>Được ưu tiên</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Nhân viên kho</strong></td>
<td>~60</td>
<td>Liên tục trong suốt ca</td>
<td>Thấp — được đào tạo tại chỗ, có thể không dùng máy tính ngoài công việc</td>
<td><strong>Có</strong></td>
</tr>
<tr>
<td><strong>Quản lý hoàn tất đơn</strong></td>
<td>6</td>
<td>Nhiều lần mỗi ngày</td>
<td>Trung bình</td>
<td><strong>Có</strong></td>
</tr>
<tr>
<td><strong>Kiểm soát tồn kho</strong></td>
<td>3</td>
<td>Vài lần mỗi ngày</td>
<td>Trung bình — thạo bảng tính</td>
<td><strong>Có</strong></td>
</tr>
<tr>
<td><strong>Nhân viên CSKH</strong></td>
<td>~25</td>
<td>Liên tục trong suốt ca</td>
<td>Trung bình</td>
<td>Không</td>
</tr>
<tr>
<td><strong>Quản lý logistics</strong></td>
<td>2</td>
<td>Hằng ngày</td>
<td>Trung bình</td>
<td>Không</td>
</tr>
<tr>
<td><strong>Quản lý nhãn hàng</strong></td>
<td>5</td>
<td>Hằng tuần</td>
<td>Thấp</td>
<td>Không</td>
</tr>
<tr>
<td><strong>Quản trị hệ thống</strong></td>
<td>2</td>
<td>Thi thoảng</td>
<td>Cao</td>
<td>Không</td>
</tr>
<tr>
<td><strong>Khách hàng</strong></td>
<td>~90.000/tháng</td>
<td>Một tới hai lần cho mỗi đơn</td>
<td>Không rõ — giả định là không có</td>
<td>Không</td>
</tr>
</tbody>
</table>
<p><strong>Các lớp người dùng được ưu tiên.</strong> Nhân viên kho, Quản lý hoàn tất đơn và Kiểm soát tồn
kho được ưu tiên: chỗ nào nhu cầu của họ xung đột với một lớp khác thì nhu cầu của họ
thắng. Đây là quyết định có chủ đích của COO, vì ba lớp này chính là những người mà dự án
sinh ra để xoá bỏ công sức thủ công của họ.</p>
<p><strong>Hệ quả với thiết kế.</strong> Việc Nhân viên kho vừa được ưu tiên <em>vừa</em> là lớp ít kỹ thuật
nhất là ràng buộc đơn lẻ mạnh nhất với sản phẩm này. Đó là lý do QA-1 và QA-2 tồn tại và
là lý do luồng nhặt hàng chạy theo quét mã chứ không theo biểu mẫu.</p>
<h3>2.3 Môi trường vận hành</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Yêu cầu</th>
</tr>
</thead>
<tbody>
<tr>
<td>OE-1</td>
<td>OMFS phải chạy trên hạ tầng đám mây sẵn có của NRG; không cần trung tâm dữ liệu mới.</td>
</tr>
<tr>
<td>OE-2</td>
<td>Giao diện cho quản lý và nhân viên CSKH phải chạy trên các phiên bản hiện hành của Chrome, Edge và Safari trên máy để bàn, ở bề rộng khung nhìn tối thiểu 1280 px.</td>
</tr>
<tr>
<td>OE-3</td>
<td>Giao diện nhặt và đóng gói phải chạy trên Android 10 trở lên, trên các máy quét cầm tay đời thấp hiện có (RAM 2 GB, màn hình 5 inch).</td>
</tr>
<tr>
<td>OE-4</td>
<td>Trang theo dõi đơn của khách phải chạy trên các trình duyệt di động và máy để bàn hiện hành, ở bề rộng khung nhìn tối thiểu 360 px.</td>
</tr>
<tr>
<td>OE-5</td>
<td>OMFS phải vận hành với dữ liệu lưu trong vùng Việt Nam và phải trình bày mọi thời điểm theo múi Asia/Ho_Chi_Minh (UTC+07), đồng thời lưu chúng kèm độ lệch tường minh.</td>
</tr>
</tbody>
</table>
<h3>2.4 Ràng buộc thiết kế và hiện thực</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Ràng buộc</th>
<th>Nguồn gốc</th>
</tr>
</thead>
<tbody>
<tr>
<td>CO-1</td>
<td>OMFS phải dùng nhà cung cấp định danh sẵn có của tập đoàn để xác thực nhân viên; nó không được duy trì kho mật khẩu nhân viên của riêng mình.</td>
<td>Chính sách an ninh của tập đoàn</td>
</tr>
<tr>
<td>CO-2</td>
<td>Khoá API của bên thứ ba phải được giữ dưới dạng cấu hình lúc chạy ở phía máy chủ và không bao giờ được gửi tới trình duyệt.</td>
<td>Chính sách an ninh của tập đoàn</td>
</tr>
<tr>
<td>CO-3</td>
<td>Giao diện máy cầm tay phải hoạt động được ít nhất 15 phút khi không có mạng và phải đối soát các lượt quét đã xếp hàng khi nối lại được.</td>
<td>Độ phủ Wi-Fi trong kho (phụ thuộc D3 của R1)</td>
</tr>
<tr>
<td>CO-4</td>
<td>Mọi luật được đánh dấu Động ở R3 §2.2 phải đổi được qua cấu hình, do đúng vai nghiệp vụ đã nêu tên, mà không cần ra bản phần mềm mới.</td>
<td>Business Rules §2.2</td>
</tr>
<tr>
<td>CO-5</td>
<td>OMFS không được lưu dữ liệu thẻ thanh toán đầy đủ ở bất kỳ thời điểm nào.</td>
<td>Thu hẹp phạm vi PCI</td>
</tr>
<tr>
<td>CO-6</td>
<td>Các tích hợp kênh bán và hãng vận chuyển phải được cô lập sau một giao tiếp nội bộ, sao cho thêm một kênh hay một hãng không đòi phải sửa logic đơn hàng, tồn kho hay định tuyến.</td>
<td>RI-1, RI-4</td>
</tr>
</tbody>
</table>
<h3>2.5 Giả định và phụ thuộc</h3>
<p><strong>Giả định</strong> (lấy từ R1 §1.7, nhắc lại ở đây vì các yêu cầu phụ thuộc vào chúng)</p>
<ul>
<li>A1: Cả bốn sàn đều mở API lấy đơn và API cập nhật tồn kho.</li>
<li>A2: NRG vận hành đúng ba trung tâm hoàn tất đơn xuyên suốt bản 1.0 và 1.1.</li>
<li>A3: Số kiểm kê tồn kho vật lý lúc chuyển đổi chính xác trong phạm vi sai số 2%.</li>
<li>A4: Storefront trên web vẫn là nơi khách thanh toán.</li>
<li>A5: Máy quét mã vạch cầm tay có sẵn ở cả ba trung tâm hoàn tất đơn.</li>
<li>A6: Mọi SKU bán được đều mang một mã vạch quét được.</li>
<li>A7: Ít nhất ba trong bốn hãng hỗ trợ gửi sự kiện theo dõi qua webhook.</li>
</ul>
<p><strong>Phụ thuộc</strong></p>
<ul>
<li>D1: Thông tin xác thực API của hãng và quyền truy cập môi trường thử, do Quản lý logistics lấy về.</li>
<li>D2: Hệ ERP nhận được một lượt ghi sổ tài chính hằng ngày theo định dạng đã thống nhất.</li>
<li>D3: Độ phủ Wi-Fi trong kho đủ để dùng máy cầm tay.</li>
<li>D4: Một người quản lý dữ liệu gốc dành được 8 giờ mỗi tuần trong giai đoạn yêu cầu và chuyển đổi dữ liệu.</li>
</ul>
<div class="callout">
<p><strong>Nếu A3 sai thì SRS này sai.</strong> Mọi yêu cầu về tồn kho ở §3.3 đều tính từ số tồn thực
tế được chuyển ra khỏi bảng tính cũ. Vì thế việc làm sạch dữ liệu là điều kiện tiên
quyết của việc phát hành, không phải một hoạt động chạy song song (rủi ro RI-2).</p>
</div>
<hr />
<h3>3. Tính năng hệ thống</h3>
<p>Mỗi tính năng dưới đây hiện thực một tính năng chính ở R1 §2.1 và một hoặc nhiều use case
ở R2. Độ ưu tiên lấy từ bảng tính xếp ưu tiên (R6).</p>
<h3>3.1 Nhận đơn đa kênh</h3>
<p><strong>Mô tả.</strong> OMFS lấy đơn từ mọi kênh bán đã nối và chuyển từng đơn thành một bản ghi đơn
hàng đã chuẩn hoá. Hiện thực FE-1 · Use case UC-01 · Mục tiêu BO-2.
<strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0 (storefront + Shopee), 1.1 (Lazada + TikTok Shop)</p>
<p><strong>Yêu cầu chức năng</strong></p>
<p><strong>Ingest-1:</strong> Hệ thống phải lấy các đơn tạo ra kể từ mốc nước lần nhận thành công gần nhất từ từng kênh bán đang hoạt động, theo một khoảng thời gian cấu hình được cho từng kênh, mặc định 60 giây.</p>
<p><strong>Ingest-2:</strong> Hệ thống phải tạo đúng một bản ghi đơn hàng cho mỗi mã đơn khác nhau của kênh, và phải bỏ qua mà không báo lỗi mọi đơn có mã kênh đã tồn tại.</p>
<p><strong>Ingest-3:</strong> Hệ thống phải ánh xạ từng mã sản phẩm của kênh sang một SKU của OMFS bằng bảng ánh xạ SKU theo kênh, và phải đưa mọi đơn có chứa một mã chưa ánh xạ vào hàng chờ SKU chưa ánh xạ với trạng thái Held-Unmapped.</p>
<p><strong>Ingest-4:</strong> Hệ thống phải giữ nguyên mốc nước khi một yêu cầu tới kênh thất bại, và phải thử lại yêu cầu đó tối đa năm lần với độ trễ tăng theo bậc mũ trước khi phát một cảnh báo tích hợp.</p>
<p><strong>Ingest-5:</strong> Hệ thống phải gán trạng thái Held-Invalid cho mọi đơn lấy về mà thiếu địa chỉ giao hoặc không chứa dòng đơn hàng nào, và phải phát một ngoại lệ chất lượng dữ liệu cho đơn đó.</p>
<p><strong>Ingest-6:</strong> Hệ thống phải cho phép một Quản trị hệ thống yêu cầu nhận lại một mã đơn cụ thể của kênh.</p>
<h3>3.2 Sàng lọc và kiểm tính hợp lệ của đơn</h3>
<p><strong>Mô tả.</strong> Các phép kiểm địa chỉ, thanh toán và gian lận thực hiện trước khi một đơn được
phép chiếm tồn kho. Hiện thực FE-2 · Use case UC-02 · Mục tiêu BO-1.
<strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Validate-1:</strong> Hệ thống phải xác minh rằng mã bưu chính giao hàng của một đơn được ít nhất một hãng đang hoạt động phục vụ, trước khi gán cho đơn đó trạng thái Validated.</p>
<p><strong>Validate-2:</strong> Hệ thống phải đọc trạng thái uỷ quyền thanh toán của một đơn từ cổng thanh toán, và phải gán trạng thái Held-Review với lý do PAYMENT_NOT_AUTHORIZED khi việc uỷ quyền vắng mặt hoặc bị từ chối.</p>
<p><strong>Validate-3:</strong> Hệ thống phải từ chối mọi đơn mà các dòng của nó chỉ định nhiều hơn một địa chỉ giao hàng, theo đúng BR-03.</p>
<p><strong>Validate-4:</strong> Hệ thống phải bỏ qua phép kiểm uỷ quyền thanh toán với các đơn có phương thức thanh toán là thu tiền khi nhận hàng.</p>
<p><strong>Validate-5:</strong> Hệ thống phải gán trạng thái Held-Review với lý do PAYMENT_UNKNOWN khi cổng thanh toán không phản hồi trong vòng năm phút, và không được coi việc không có phản hồi là đã được uỷ quyền.</p>
<p><strong>Validate-6:</strong> Hệ thống phải cho phép một Nhân viên CSKH thả một đơn từ Held-Review sang Validated, và phải ghi lại nhân viên đó, thời điểm và một lời giải trình bắt buộc.</p>
<h3>3.3 Tồn kho thời gian thực và available-to-promise</h3>
<p><strong>Mô tả.</strong> Vị thế tồn kho có thẩm quyền duy nhất, và việc giữ tồn ngay khi nhận đơn.
Hiện thực FE-3 · Use case UC-03 · Mục tiêu BO-1.
<strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Reserve-1:</strong> Hệ thống phải tính available-to-promise theo từng SKU tại từng trung tâm hoàn tất đơn theo đúng BR-07, mỗi khi số tồn thực tế, số đang giữ, số hỏng hoặc số tồn an toàn của SKU đó tại trung tâm đó thay đổi.</p>
<p><strong>Reserve-2:</strong> Hệ thống chỉ được giữ tồn cho một dòng đơn hàng khi available-to-promise của SKU đó tại trung tâm được chọn lớn hơn hoặc bằng số lượng đặt, theo đúng BR-01 và BR-02.</p>
<p><strong>Reserve-3:</strong> Hệ thống phải nhả mọi lượt giữ tồn thuộc về một đơn chưa được xác nhận bằng uỷ quyền thanh toán trong cửa sổ giữ tồn định ra ở BR-04, và phải đưa đơn đó về trạng thái Pending.</p>
<p><strong>Reserve-4:</strong> Hệ thống phải giữ tồn cho mọi dòng của một đơn hoặc không dòng nào, và phải gán trạng thái Backordered cho đơn mà tổng available-to-promise trên mọi trung tâm nhỏ hơn số lượng đặt của bất kỳ dòng nào.</p>
<p><strong>Reserve-5:</strong> Hệ thống phải giữ tồn cho một dòng đơn hàng trải trên nhiều trung tâm khi không một trung tâm nào đủ available-to-promise, trong giới hạn tách nêu ở BR-08.</p>
<p><strong>Reserve-6:</strong> Hệ thống phải cho phép một Kiểm soát tồn kho đặt số tồn an toàn theo từng SKU tại từng trung tâm, và phải loại số lượng đó khỏi available-to-promise theo đúng BR-17.</p>
<p><strong>Reserve-7:</strong> Hệ thống phải thử giữ tồn lại cho một đơn đang chờ hàng khi available-to-promise của bất kỳ SKU nào trên đơn đó tăng lên.</p>
<h3>3.4 Đồng bộ tồn kho ra các kênh</h3>
<p><strong>Mô tả.</strong> Việc công bố số lượng bán được tới mọi kênh có bán một SKU.
Hiện thực FE-4 · Use case UC-13 · Mục tiêu BO-1.
<strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Sync-1:</strong> Hệ thống phải công bố số lượng bán được của một SKU, tính theo đúng BR-07, tới mọi kênh bán đang hoạt động có bán SKU đó, mỗi khi số lượng đó thay đổi.</p>
<p><strong>Sync-2:</strong> Hệ thống phải áp một số lượng đệm riêng theo từng kênh, do Kiểm soát tồn kho cấu hình, khi tính số lượng công bố tới kênh đó, theo đúng BR-17.</p>
<p><strong>Sync-3:</strong> Hệ thống phải hoàn tất việc công bố một số lượng đã thay đổi trong khoảng thời gian định ra ở BR-20, tính từ thời điểm thay đổi tồn kho nền được ghi nhận.</p>
<p><strong>Sync-4:</strong> Hệ thống phải gộp nhiều thay đổi tồn kho ảnh hưởng tới một SKU trong cùng một cửa sổ gom thành một lượt công bố duy nhất mang số lượng mới nhất.</p>
<p><strong>Sync-5:</strong> Hệ thống phải so, theo một khoảng thời gian cấu hình được và mặc định là một giờ, số lượng mà từng kênh đang hoạt động báo về với số lượng OMFS đang giữ, và phải công bố lại mọi SKU nào hai con số lệch nhau.</p>
<p><strong>Sync-6:</strong> Hệ thống phải công bố số lượng bằng không, và phải phát một cảnh báo chất lượng dữ liệu có nêu tên SKU và trung tâm hoàn tất đơn, khi số lượng bán được tính ra nhỏ hơn không.</p>
<p><strong>Sync-7:</strong> Hệ thống phải xếp hàng các lượt công bố bị một kênh từ chối vì bóp băng thông, và phải tiếp tục chúng sau khoảng thời gian mà kênh đó nêu ra, không được bỏ lượt công bố nào.</p>
<h3>3.5 Định tuyến và tách đơn tự động</h3>
<p><strong>Mô tả.</strong> Việc chọn trung tâm hoặc các trung tâm sẽ giao từng dòng. Hiện thực FE-5 ·
Use case UC-04 · Mục tiêu BO-2, BO-3.
<strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Route-1:</strong> Hệ thống phải gán mọi dòng của một đơn cho đúng một trung tâm hoàn tất đơn, theo đúng BR-01.</p>
<p><strong>Route-2:</strong> Hệ thống phải tính điểm định tuyến cho mọi trung tâm ứng viên theo đúng BR-06, và phải chọn cách gom có tổng điểm cao nhất.</p>
<p><strong>Route-3:</strong> Hệ thống phải ghi lại, gắn với từng đơn đã định tuyến, điểm của mọi trung tâm ứng viên cùng với từng thành phần điểm và lý do cái thắng đã được chọn.</p>
<p><strong>Route-4:</strong> Hệ thống phải phát một ngoại lệ hoàn tất đơn, và không được tạo lô giao nào, với mọi đơn mà việc định tuyến sẽ đòi nhiều trung tâm hơn giới hạn nêu ở BR-08.</p>
<p><strong>Route-5:</strong> Hệ thống phải gán ngày xuất hàng là ngày làm việc kế tiếp cho mọi đơn được định tuyến về một trung tâm sau giờ chốt xuất hàng của trung tâm đó, theo đúng BR-10.</p>
<p><strong>Route-6:</strong> Hệ thống chỉ được cho phép người dùng giữ vai Quản lý hoàn tất đơn ghi đè một quyết định định tuyến tự động, và phải đòi ghi lại một lý do với mọi lần ghi đè, theo đúng BR-19.</p>
<p><strong>Route-7:</strong> Hệ thống phải định tuyến lại mọi đơn đã định tuyến mà chưa vào giai đoạn nhặt hàng, khi trung tâm mà nó được định tuyến tới bị một Quản trị hệ thống đóng lại.</p>
<p><strong>Route-8:</strong> Hệ thống phải cho phép một Quản lý hoàn tất đơn đổi các trọng số điểm định tuyến mà không cần ra bản phần mềm mới, và phải từ chối mọi bộ trọng số mà các thành phần không cộng bằng một.</p>
<h3>3.6 Sinh và phát đợt nhặt hàng</h3>
<p><strong>Mô tả.</strong> Việc gom các lô giao đã định tuyến thành những lô công việc phát xuống sàn kho.
Hiện thực FE-6 · Use case UC-05 · Mục tiêu BO-3.
<strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Wave-1:</strong> Hệ thống phải cho phép một Quản lý hoàn tất đơn tạo một đợt nhặt hàng từ các lô giao đã định tuyến tại một trung tâm, lọc theo giờ chốt của hãng, mức dịch vụ, tuổi đơn và kích cỡ đợt tối đa.</p>
<p><strong>Wave-2:</strong> Hệ thống phải đưa vào một đợt, khi bộ hẹn giờ đợt tự động chạy, mọi lô giao đã định tuyến có ngày xuất hàng là hôm nay và chưa quá giờ chốt của hãng, theo đúng BR-10.</p>
<p><strong>Wave-3:</strong> Hệ thống phải gán mỗi lô giao vào tối đa một đợt đang mở, và phải loại khỏi đợt đang được tạo mọi lô giao đã được gán cho một đợt đang mở khác.</p>
<p><strong>Wave-4:</strong> Hệ thống phải leo thang lên Quản lý hoàn tất đơn mọi lô giao trong một đợt đã phát mà chưa được nhặt trong khoảng thời gian nêu ở BR-13.</p>
<p><strong>Wave-5:</strong> Hệ thống phải sắp thứ tự danh sách nhặt hàng của một đợt theo vị trí lưu trữ ghi với từng SKU.</p>
<p><strong>Wave-6:</strong> Hệ thống phải tạo nhiều đợt thay vì một đợt vượt kích cỡ tối đa đã cấu hình, và phải báo số đợt đã tạo.</p>
<p><strong>Wave-7:</strong> Hệ thống phải cho phép một Quản lý hoàn tất đơn huỷ một đợt mà chưa món nào được nhặt, và phải đưa mọi lô giao trong đợt đó về trạng thái Routed.</p>
<h3>3.7 Nhặt và đóng gói có quét xác nhận</h3>
<p><strong>Mô tả.</strong> Việc nhặt hàng điều khiển bằng máy cầm tay, có xác minh mã vạch và gán thùng.
Hiện thực FE-7 · Use case UC-06 · Mục tiêu BO-2, BO-3.
<strong>Độ ưu tiên:</strong> Cao · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Pick-1:</strong> Hệ thống phải trình ra cho nhân viên, với từng đầu việc nhặt, mã SKU, mô tả món hàng, ảnh món hàng, số lượng cần và vị trí lưu trữ.</p>
<p><strong>Pick-2:</strong> Hệ thống chỉ được xác nhận một lượt nhặt khi mã vạch nhân viên quét khớp với mã vạch ghi với SKU mong đợi.</p>
<p><strong>Pick-3:</strong> Hệ thống phải leo thang một đầu việc nhặt lên Quản lý hoàn tất đơn sau ba lần quét lệch mã vạch liên tiếp trên đầu việc đó.</p>
<p><strong>Pick-4:</strong> Hệ thống phải cho phép nhân viên ghi một số lượng đã nhặt thấp hơn số lượng cần, phải điều chỉnh số tồn thực tế của SKU đó về đúng số đã đếm, và phải phát một ngoại lệ nhặt thiếu.</p>
<p><strong>Pick-5:</strong> Hệ thống phải cho phép nhân viên ghi một số lượng là hàng hỏng, phải chuyển số lượng đó sang số hỏng của SKU và trung tâm đó, và phải loại nó khỏi available-to-promise theo đúng BR-07.</p>
<p><strong>Pick-6:</strong> Hệ thống phải ghi lại việc gán từng món đã nhặt vào một thùng, cùng với khối lượng của từng thùng.</p>
<p><strong>Pick-7:</strong> Hệ thống phải trừ số lượng đã nhặt khỏi tồn thực tế và nhả các lượt giữ tồn của chúng ngay tại thời điểm lô giao được ghi nhận là đã đóng gói.</p>
<p><strong>Pick-8:</strong> Hệ thống phải nhận các lượt quét mà một máy cầm tay ghi lại trong lúc máy đó không có mạng, và phải áp dụng mỗi lượt quét như vậy đúng một lần khi nối lại được.</p>
<h3>3.8 So giá hãng vận chuyển và mua nhãn</h3>
<p><strong>Mô tả.</strong> Việc so các hãng đủ điều kiện và mua nhãn vận chuyển. Hiện thực FE-8 ·
Use case UC-07 · Mục tiêu BO-5.
<strong>Độ ưu tiên:</strong> Trung bình · <strong>Bản phát hành:</strong> 1.1</p>
<p><strong>Label-1:</strong> Hệ thống chỉ được coi một hãng là đủ điều kiện cho một lô giao khi hãng đó đang hoạt động, phục vụ mã bưu chính đích, và chấp nhận khối lượng cùng kích thước của mọi thùng trong lô giao, theo đúng BR-11.</p>
<p><strong>Label-2:</strong> Hệ thống phải tính chi phí trọn gói của từng báo giá theo đúng BR-12.</p>
<p><strong>Label-3:</strong> Hệ thống phải chọn hãng đủ điều kiện có chi phí trọn gói thấp nhất mà thời gian vận chuyển công bố của nó không vượt quá số ngày còn lại tới ngày giao đã hứa.</p>
<p><strong>Label-4:</strong> Hệ thống phải chọn hãng đủ điều kiện có thời gian vận chuyển ngắn nhất, thay vì chi phí thấp nhất, với các lô giao mà đơn của nó mang mức dịch vụ express.</p>
<p><strong>Label-5:</strong> Hệ thống phải lưu báo giá lấy được từ mọi hãng đủ điều kiện gắn với lô giao, kể cả những báo giá không được chọn.</p>
<p><strong>Label-6:</strong> Hệ thống phải mua đúng một nhãn cho mỗi lô giao, và phải hỏi hãng được chọn xem đã có nhãn nào gắn với mã tham chiếu của lô giao chưa, trước khi mua, trong trường hợp một lần mua trước đó không trả về phản hồi nào.</p>
<p><strong>Label-7:</strong> Hệ thống phải loại ra hãng nào từ chối một yêu cầu nhãn và phải thử báo giá tốt kế tiếp, tối đa ba hãng, trước khi phát một ngoại lệ dán nhãn.</p>
<p><strong>Label-8:</strong> Hệ thống phải phát một ngoại lệ dán nhãn, và phải để lô giao ở trạng thái Packed, khi không hãng nào đủ điều kiện hoặc khi mọi yêu cầu báo giá đều thất bại.</p>
<h3>3.9 Nhận sự kiện theo dõi từ hãng vận chuyển</h3>
<p><strong>Mô tả.</strong> Việc tự động nhận và áp dụng các sự kiện trạng thái của hãng. Hiện thực FE-9 ·
Use case UC-08 · Mục tiêu BO-4.
<strong>Độ ưu tiên:</strong> Trung bình · <strong>Bản phát hành:</strong> 1.1</p>
<p><strong>Event-1:</strong> Hệ thống phải nhận các sự kiện theo dõi do một hãng đẩy tới và phải xác thực hãng gửi trước khi áp dụng bất kỳ sự kiện nào.</p>
<p><strong>Event-2:</strong> Hệ thống phải xin các sự kiện theo dõi cho mọi lô giao đang mở của bất kỳ hãng nào không đẩy sự kiện, theo một khoảng thời gian cấu hình được và mặc định là 15 phút.</p>
<p><strong>Event-3:</strong> Hệ thống phải ánh xạ từng mã trạng thái của hãng sang một trạng thái của OMFS, và phải lưu lại mà không áp dụng mọi sự kiện có mã trạng thái hãng chưa được ánh xạ, đồng thời phát một cảnh báo cấu hình.</p>
<p><strong>Event-4:</strong> Hệ thống phải sắp thứ tự các sự kiện theo dõi theo thời điểm sự kiện mà hãng ghi nhận, và không được đổi trạng thái lô giao khi nhận một sự kiện cũ hơn sự kiện mới nhất đã áp cho lô giao đó.</p>
<p><strong>Event-5:</strong> Hệ thống phải lưu, với mọi sự kiện theo dõi, cả thời điểm sự kiện của hãng lẫn thời điểm OMFS nhận được nó.</p>
<p><strong>Event-6:</strong> Hệ thống phải giữ trong một hàng chờ mồ côi, trong 30 ngày, mọi sự kiện theo dõi có mã theo dõi không khớp lô giao nào.</p>
<p><strong>Event-7:</strong> Hệ thống phải phát một ngoại lệ hoàn tất đơn cho mọi lô giao đã được lấy hàng mà không nhận được sự kiện theo dõi nào trong 48 giờ.</p>
<p><strong>Event-8:</strong> Hệ thống phải đóng một đơn khi mọi lô giao thuộc đơn đó đều đã đạt trạng thái Delivered.</p>
<h3>3.10 Thông báo cho khách và trang tự tra cứu</h3>
<p><strong>Mô tả.</strong> Màn hình hướng tới khách về trạng thái đơn và lô giao. Hiện thực FE-10 ·
Use case UC-09 · Mục tiêu BO-4.
<strong>Độ ưu tiên:</strong> Trung bình · <strong>Bản phát hành:</strong> 1.2</p>
<p><strong>Track-1:</strong> Hệ thống phải phát ra, vào thời điểm một lô giao được dán nhãn, một đường liên kết theo dõi chứa một token duy nhất cho một đơn, và phải gửi đường liên kết đó tới khách qua dịch vụ thông báo.</p>
<p><strong>Track-2:</strong> Hệ thống chỉ được tiết lộ, khi trả lời một yêu cầu theo dõi, thông tin liên quan tới đúng một đơn mà token trong yêu cầu đó chỉ tới.</p>
<p><strong>Track-3:</strong> Hệ thống phải trình ra từng lô giao của một đơn bị tách một cách riêng biệt, kèm hãng, mã theo dõi, trạng thái hiện tại và lịch sử sự kiện của nó, cùng một lời giải thích rằng đơn đã bị tách.</p>
<p><strong>Track-4:</strong> Hệ thống phải hiển thị, với mọi lô giao mà sự kiện gần nhất của hãng cũ hơn 48 giờ, thời điểm của sự kiện đó và một câu nói rõ rằng chưa nhận được thông tin nào mới hơn, theo đúng BR-09.</p>
<p><strong>Track-5:</strong> Hệ thống phải trả về phản hồi giống hệt nhau cho một token sai và cho một token trỏ tới một đơn không tồn tại.</p>
<p><strong>Track-6:</strong> Hệ thống phải trình ra trạng thái ở mức đơn hàng, diễn đạt bằng câu chữ hướng tới khách, với một đơn chưa có lô giao nào.</p>
<p><strong>Track-7:</strong> Hệ thống phải ghi lại từng lượt xem theo dõi, để đo được mức sử dụng tự phục vụ so với mục tiêu nghiệp vụ BO-4.</p>
<h3>3.11 Quản lý ngoại lệ hoàn tất đơn</h3>
<p><strong>Mô tả.</strong> Một hàng chờ duy nhất cho mọi sự cố trong vòng đời hoàn tất đơn. Hiện thực
FE-11 · Use case UC-10 · Mục tiêu BO-1, BO-2.
<strong>Độ ưu tiên:</strong> Trung bình · <strong>Bản phát hành:</strong> 1.2</p>
<p><strong>Except-1:</strong> Hệ thống phải trình ra các ngoại lệ hoàn tất đơn đang mở, sắp theo mức rủi ro trễ ngày giao tính theo đúng BR-09, và phải chỉ ra những ngoại lệ đã vượt mức dịch vụ định ra cho loại của chúng.</p>
<p><strong>Except-2:</strong> Hệ thống chỉ được đưa ra, với một ngoại lệ được chọn, những phương án xử lý đã định ra cho đúng loại ngoại lệ đó.</p>
<p><strong>Except-3:</strong> Hệ thống phải ghi lại, với mọi cách xử lý được áp dụng, người dùng đã xử lý, thời điểm, cách xử lý được chọn và một lý do bắt buộc.</p>
<p><strong>Except-4:</strong> Hệ thống phải áp một cách xử lý trọn vẹn hoặc không áp gì cả, và phải để ngoại lệ vẫn mở khi bất kỳ phần nào của cách xử lý thất bại.</p>
<p><strong>Except-5:</strong> Hệ thống phải từ chối một cách xử lý mà tiền điều kiện của nó không còn đúng, và phải trình ra cho người dùng phiên bản ngoại lệ đã được làm mới.</p>
<p><strong>Except-6:</strong> Hệ thống phải cho phép một Quản lý hoàn tất đơn áp một cách xử lý cho nhiều ngoại lệ đã chọn mà cùng loại và cùng nguyên nhân.</p>
<p><strong>Except-7:</strong> Hệ thống phải leo thang lên cấp trên của Quản lý hoàn tất đơn được phân công mọi ngoại lệ mở lâu hơn mức dịch vụ định ra cho loại của nó.</p>
<h3>3.12 Huỷ và sửa đơn hàng</h3>
<p><strong>Mô tả.</strong> Việc chặn hoặc đổi một đơn khi nó còn chặn được. Hiện thực FE-12 ·
Use case UC-11 · Mục tiêu BO-1.
<strong>Độ ưu tiên:</strong> Trung bình · <strong>Bản phát hành:</strong> 1.0</p>
<p><strong>Cancel-1:</strong> Hệ thống chỉ được cho phép huỷ hoặc sửa một đơn trước khi một nhãn vận chuyển được mua cho bất kỳ lô giao nào của nó, theo đúng BR-05.</p>
<p><strong>Cancel-2:</strong> Hệ thống phải nhả mọi lượt giữ tồn thuộc về một đơn bị huỷ hoặc một dòng đơn bị huỷ, theo đúng BR-05, và phải công bố thay đổi tồn kho kết quả tới mọi kênh bán bị ảnh hưởng.</p>
<p><strong>Cancel-3:</strong> Hệ thống phải định tuyến lại các dòng còn lại của một đơn sau khi một dòng bị huỷ hoặc bị giảm số lượng.</p>
<p><strong>Cancel-4:</strong> Hệ thống phải cho phép huỷ nhưng phải từ chối sửa một đơn xuất phát từ một kênh có loại là Marketplace, theo đúng BR-16, và phải nói rõ chính sách của kênh nào đang áp dụng.</p>
<p><strong>Cancel-5:</strong> Hệ thống phải kiểm lại một địa chỉ giao hàng đã thay đổi và phải định tuyến lại đơn trước khi chấp nhận thay đổi đó.</p>
<p><strong>Cancel-6:</strong> Hệ thống phải giữ một lệnh huỷ xin cho một lô giao đã vào giai đoạn nhặt hàng ở trạng thái Pending-Stop, và chỉ được nhả các lượt giữ tồn sau khi trung tâm hoàn tất đơn xác nhận rằng việc nhặt hàng đã dừng.</p>
<p><strong>Cancel-7:</strong> Hệ thống phải xếp hàng chờ thử lại mọi thông báo huỷ mà một kênh bán từ chối, và phải phát một cảnh báo khi thông báo vẫn chưa gửi được sau ba lần thử.</p>
<h3>3.13 Trả hàng và nhập lại kho</h3>
<p><strong>Mô tả.</strong> Việc cho phép, nhận, kiểm tra và nhập lại kho hàng trả về. Hiện thực FE-13 ·
Use case UC-12.
<strong>Độ ưu tiên:</strong> Thấp · <strong>Bản phát hành:</strong> 2.0</p>
<p><strong>Return-1:</strong> Hệ thống chỉ được tạo một lượt cho phép trả hàng cho các dòng mà ngày giao của chúng nằm trong cửa sổ trả hàng định ra ở BR-14.</p>
<p><strong>Return-2:</strong> Hệ thống phải cho phép một giám sát viên duyệt một lượt trả hàng ngoài cửa sổ trả hàng, và phải ghi lại giám sát viên đó cùng một lý do bắt buộc.</p>
<p><strong>Return-3:</strong> Hệ thống phải ghi lại, với từng dòng hàng trả về, số lượng nhận được và kết quả kiểm hàng mà nhân viên ghi nhận.</p>
<p><strong>Return-4:</strong> Hệ thống phải tăng số tồn thực tế của một món hàng trả về được ghi nhận là còn bán được, và phải chuyển vào khu cách ly số lượng của mọi món được ghi nhận là hỏng, theo đúng BR-15.</p>
<p><strong>Return-5:</strong> Hệ thống phải đóng với trạng thái không-nhận-được mọi lượt cho phép trả hàng mà không có hàng nào tới trong vòng 30 ngày kể từ lúc cho phép.</p>
<p><strong>Return-6:</strong> Hệ thống phải đưa vào hàng chờ hàng-trả-không-rõ mọi kiện hàng trả về không mang mã cho phép trả hàng hay mã lô giao nào đọc được.</p>
<p><strong>Return-7:</strong> Hệ thống phải phát một ngoại lệ hoàn tất đơn với mọi số lượng nhận được vượt quá số lượng đã cho phép.</p>
<h3>3.14 Bảng điều khiển hiệu suất hoàn tất đơn và đối soát chi phí</h3>
<p><strong>Mô tả.</strong> Việc nhìn thấy sáu mục tiêu nghiệp vụ một cách liên tục. Hiện thực FE-14 ·
Use case UC-14 · Mọi mục tiêu.
<strong>Độ ưu tiên:</strong> Thấp · <strong>Bản phát hành:</strong> 2.0</p>
<p><strong>Dash-1:</strong> Hệ thống phải trình ra số đơn đã giao, thời gian từ nhận đơn tới xuất hàng, tỉ lệ bán vượt tồn, tỉ lệ định tuyến tự động, số ngoại lệ đang mở và chi phí vận chuyển mỗi đơn, mỗi chỉ số đặt cạnh mục tiêu của nó.</p>
<p><strong>Dash-2:</strong> Hệ thống phải tính mọi chỉ số trên bảng điều khiển bằng đúng định nghĩa đã ghi cho thước đo thành công tương ứng ở tài liệu Vision and Scope §1.4.</p>
<p><strong>Dash-3:</strong> Hệ thống phải nhận diện mọi SKU mà available-to-promise của nó thoả điều kiện có-nguy-cơ-hết-hàng định ra ở BR-18.</p>
<p><strong>Dash-4:</strong> Hệ thống phải giới hạn các trung tâm hoàn tất đơn, kênh bán và nhãn hàng mà một người dùng nhìn thấy được, theo đúng những gì vai của người đó cho phép.</p>
<p><strong>Dash-5:</strong> Hệ thống phải hiển thị, cùng với mọi chỉ số, giai đoạn nó phủ và thời điểm dữ liệu nền được làm mới lần cuối.</p>
<p><strong>Dash-6:</strong> Hệ thống phải trình ra các báo giá đã lưu gắn với các lô giao, đặt cạnh số tiền mà từng hãng đã xuất hoá đơn, cho một giai đoạn do Quản lý logistics chọn.</p>
<p><strong>Dash-7:</strong> Hệ thống phải trình ra một trạng thái cho biết không có dữ liệu nào cho giai đoạn được chọn, khác biệt với trạng thái mà giá trị chỉ số bằng không.</p>
<p><strong>Dash-8:</strong> Hệ thống phải trình ra các chỉ số đã tính xong, và phải chỉ ra những chỉ số chưa xong, khi việc tính bất kỳ chỉ số nào không hoàn tất.</p>
<hr />
<h3>4. Yêu cầu dữ liệu</h3>
<h3>4.1 Mô hình dữ liệu logic</h3>
<p>Mô hình thực thể-quan hệ nằm ở <strong>Phụ lục B</strong>, Hình B-2. Nó là một mô hình <em>logic</em> — nó mô
tả dữ liệu mà doanh nghiệp làm việc cùng, không phải một schema cơ sở dữ liệu. Thiết kế
bảng, đánh chỉ mục và lưu trữ vật lý là các quyết định thiết kế nằm ngoài phạm vi tài
liệu này.</p>
<p>Các thực thể và quan hệ chính:</p>
<table>
<thead>
<tr>
<th>Thực thể</th>
<th>Quan hệ</th>
</tr>
</thead>
<tbody>
<tr>
<td>Sales Channel</td>
<td>1 → n Order</td>
</tr>
<tr>
<td>Order</td>
<td>1 → n Order Line · 1 → n Shipment · 1 → 0..n Fulfillment Exception · 1 → 0..n Return Authorization</td>
</tr>
<tr>
<td>Order Line</td>
<td>1 → 0..n Reservation</td>
</tr>
<tr>
<td>Fulfillment Center</td>
<td>1 → n Inventory Record · 1 → n Shipment · 1 → n Pick Wave</td>
</tr>
<tr>
<td>Item</td>
<td>1 → n Inventory Record · 1 → n Order Line</td>
</tr>
<tr>
<td>Shipment</td>
<td>1 → n Shipment Line · 1 → 0..n Carton · 1 → 0..n Tracking Event · n → 0..1 Pick Wave</td>
</tr>
<tr>
<td>Routing Decision</td>
<td>1 → 1..3 Routing Score, 1 → 1 Order</td>
</tr>
<tr>
<td>Return Authorization</td>
<td>1 → n Return Line</td>
</tr>
</tbody>
</table>
<p>Quan hệ ràng buộc thiết kế nhiều nhất là <strong>Order → Shipment</strong>: một đơn có thể có nhiều lô
giao (BR-08) trong khi một <em>dòng</em> đơn hàng thì không được tách qua nhiều trung tâm
(BR-01). Gộp lô giao vào đơn hàng — một phép đơn giản hoá rất hấp dẫn — sẽ làm cho một
đơn bị tách trở nên không biểu diễn nổi.</p>
<h3>4.2 Từ điển dữ liệu</h3>
<p>Định nghĩa, cấu thành, kiểu, độ dài và các giá trị cho phép của từng phần tử dữ liệu nằm
trong tài liệu <strong>Data Dictionary</strong> riêng (R4), gồm 110 mục. Nó được duy trì riêng để các
dự án sau dùng lại được và để nó đổi được mà không phải chốt lại bản cơ sở của SRS này.</p>
<h3>4.3 Báo cáo</h3>
<table>
<thead>
<tr>
<th>Mã</th>
<th>Báo cáo</th>
<th>Nội dung và thứ tự sắp xếp</th>
<th>Đối tượng đọc</th>
<th>Tần suất</th>
</tr>
</thead>
<tbody>
<tr>
<td>RPT-1</td>
<td>Tổng kết hoàn tất đơn hằng ngày</td>
<td>Số đơn nhận, giao, huỷ và chờ hàng; thời gian chu kỳ; theo từng trung tâm; sắp theo trung tâm</td>
<td>Quản lý hoàn tất đơn</td>
<td>Hằng ngày 07:00</td>
</tr>
<tr>
<td>RPT-2</td>
<td>Sự cố bán vượt tồn</td>
<td>Mọi đơn bị huỷ hoặc giao thiếu vì không đủ hàng, kèm SKU, kênh và dấu thời gian; sắp theo ngày giảm dần</td>
<td>Kiểm soát tồn kho</td>
<td>Hằng tuần</td>
</tr>
<tr>
<td>RPT-3</td>
<td>Tuổi của ngoại lệ</td>
<td>Ngoại lệ đang mở theo loại và dải tuổi, kèm các lần vượt mức dịch vụ; sắp theo tuổi giảm dần</td>
<td>Quản lý hoàn tất đơn</td>
<td>Hằng ngày</td>
</tr>
<tr>
<td>RPT-4</td>
<td>Đối soát chi phí hãng vận chuyển</td>
<td>Giá đã báo so với giá trên hoá đơn theo từng hãng từng tháng, kèm chênh lệch; sắp theo chênh lệch giảm dần</td>
<td>Quản lý logistics</td>
<td>Hằng tháng</td>
</tr>
<tr>
<td>RPT-5</td>
<td>Tồn kho có rủi ro</td>
<td>Các SKU thoả điều kiện ở BR-18, kèm tốc độ bán và available-to-promise; sắp theo số ngày còn đủ hàng tăng dần</td>
<td>Kiểm soát tồn kho</td>
<td>Hằng ngày</td>
</tr>
<tr>
<td>RPT-6</td>
<td>Độ trôi đồng bộ theo kênh</td>
<td>Các SKU mà số lượng trên kênh lệch với OMFS lúc đối soát; sắp theo kênh</td>
<td>Quản trị hệ thống</td>
<td>Hằng ngày</td>
</tr>
<tr>
<td>RPT-7</td>
<td>Hiệu suất hoàn tất đơn theo nhãn hàng</td>
<td>Thời gian chu kỳ, tỉ lệ huỷ đơn và tỉ lệ giao thành công theo từng nhãn; sắp theo nhãn</td>
<td>Quản lý nhãn hàng</td>
<td>Hằng tuần</td>
</tr>
</tbody>
</table>
<p>Bố cục báo cáo để lại cho khâu thiết kế. Mục này chỉ đặc tả nội dung, thứ tự sắp xếp, đối
tượng đọc và tần suất.</p>
<h3>4.4 Thu thập, toàn vẹn, lưu trữ và huỷ dữ liệu</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Yêu cầu</th>
</tr>
</thead>
<tbody>
<tr>
<td>DA-1</td>
<td>Hệ thống chỉ được thu nạp dữ liệu đơn hàng từ các kênh bán đã nối, và không được cho phép tạo một đơn bằng tay.</td>
</tr>
<tr>
<td>DA-2</td>
<td>Hệ thống phải thu nạp dữ liệu sản phẩm gốc và tồn kho đầu kỳ bằng một lần chuyển đổi duy nhất, và phải từ chối mọi bản ghi không qua được các luật kiểm đã thống nhất, thay vì nhập nó vào một cách dở dang.</td>
</tr>
<tr>
<td>DA-3</td>
<td>Hệ thống phải ghi lại, với mọi thay đổi của một lượt giữ tồn hay một số tồn thực tế, thời điểm, nguyên nhân và người hoặc tiến trình chịu trách nhiệm.</td>
</tr>
<tr>
<td>DA-4</td>
<td>Hệ thống phải lưu giữ dữ liệu đơn hàng, lô giao và theo dõi trong 24 tháng, sau đó phải lưu trữ lâu dài và gỡ khỏi kho dữ liệu vận hành.</td>
</tr>
<tr>
<td>DA-5</td>
<td>Hệ thống phải lưu giữ bản ghi kiểm toán các lượt dịch chuyển tồn kho trong 7 năm, theo đúng chính sách lưu trữ của kế toán.</td>
</tr>
<tr>
<td>DA-6</td>
<td>Hệ thống phải gỡ tên khách hàng, địa chỉ, số điện thoại và địa chỉ email khỏi các đơn đã lưu trữ lâu dài sau 24 tháng, vẫn giữ lại đơn hàng và số lượng của nó.</td>
</tr>
<tr>
<td>DA-7</td>
<td>Hệ thống phải kiểm hằng ngày rằng tổng số lượng đang giữ bằng tổng các lượt giữ tồn đang mở, và phải phát cảnh báo chất lượng dữ liệu với mọi sai lệch.</td>
</tr>
</tbody>
</table>
<hr />
<h3>5. Yêu cầu giao tiếp ngoài</h3>
<h3>5.1 Giao diện người dùng</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Yêu cầu</th>
</tr>
</thead>
<tbody>
<tr>
<td>UI-1</td>
<td>Hệ thống phải cung cấp bốn giao diện tách biệt: giao diện nhặt và đóng gói trên máy cầm tay, giao diện web cho quản lý, giao diện web cho nhân viên CSKH, và trang theo dõi đơn công khai cho khách.</td>
</tr>
<tr>
<td>UI-2</td>
<td>Giao diện máy cầm tay phải thao tác được bằng một tay, phải có vùng chạm ít nhất 48 × 48 pixel độc lập thiết bị, và phải vẫn đọc được khi nhân viên đang đeo găng.</td>
</tr>
<tr>
<td>UI-3</td>
<td>Mọi giao diện phải trình ra một thông báo lỗi nói rõ chuyện gì đã xảy ra, hệ thống đã làm gì với nó, và người dùng làm được gì tiếp theo.</td>
</tr>
<tr>
<td>UI-4</td>
<td>Mọi hành động có tính phá huỷ phải đòi một lần xác nhận có gọi tên đối tượng bị tác động.</td>
</tr>
<tr>
<td>UI-5</td>
<td>Trang theo dõi đơn của khách phải dùng được mà không cần đăng nhập và không được hỏi bất kỳ dữ liệu cá nhân nào từ khách.</td>
</tr>
<tr>
<td>UI-6</td>
<td>Thiết kế màn hình cho ba use case phức tạp nhất được minh hoạ ở R5; chỗ nào R5 và tài liệu này khác nhau thì tài liệu này có thẩm quyền.</td>
</tr>
</tbody>
</table>
<h3>5.2 Giao tiếp phần mềm</h3>
<table>
<thead>
<tr>
<th>Mã</th>
<th>Giao tiếp</th>
<th>Chiều</th>
<th>Nội dung</th>
<th>Mức dịch vụ</th>
</tr>
</thead>
<tbody>
<tr>
<td>SI-1</td>
<td>Kênh bán — lấy đơn</td>
<td>Vào</td>
<td>Các đơn tạo ra kể từ một mốc nước</td>
<td>Khoảng hỏi ≤ 60 giây; thử lại theo Ingest-4</td>
</tr>
<tr>
<td>SI-2</td>
<td>Kênh bán — cập nhật tồn kho</td>
<td>Ra</td>
<td>SKU và số lượng bán được</td>
<td>Công bố trong vòng 60 giây kể từ khi thay đổi (Sync-3)</td>
</tr>
<tr>
<td>SI-3</td>
<td>Kênh bán — huỷ đơn</td>
<td>Cả hai</td>
<td>Việc huỷ một đơn hàng</td>
<td>Xếp hàng và thử lại theo Cancel-7</td>
</tr>
<tr>
<td>SI-4</td>
<td>Cổng thanh toán — trạng thái uỷ quyền</td>
<td>Vào</td>
<td>Trạng thái uỷ quyền của một đơn; <strong>không có dữ liệu thẻ</strong> (CO-5)</td>
<td>Kỳ vọng phản hồi trong 5 giây; hết giờ chờ ở mốc 5 phút (Validate-5)</td>
</tr>
<tr>
<td>SI-5</td>
<td>Hãng vận chuyển — báo giá</td>
<td>Ra / vào</td>
<td>Điểm đi, điểm đến, khối lượng, kích thước → chi phí và số ngày vận chuyển</td>
<td>Xin báo giá song song; hết giờ chờ tổng thể 10 phút (Label-8)</td>
</tr>
<tr>
<td>SI-6</td>
<td>Hãng vận chuyển — mua nhãn</td>
<td>Ra / vào</td>
<td>Chi tiết lô giao → mã theo dõi và tài liệu nhãn</td>
<td>Đúng-một-lần cho mỗi lô giao (Label-6)</td>
</tr>
<tr>
<td>SI-7</td>
<td>Hãng vận chuyển — sự kiện theo dõi</td>
<td>Vào</td>
<td>Các sự kiện trạng thái, đẩy tới hoặc hỏi định kỳ</td>
<td>Áp dụng trong vòng 15 phút ở p95 (QA-6)</td>
</tr>
<tr>
<td>SI-8</td>
<td>ERP / kế toán — ghi sổ tài chính</td>
<td>Ra</td>
<td>Tổng các đơn đã giao trong ngày, theo nhãn hàng và kênh</td>
<td>Một lần mỗi ngày; thất bại thì phát cảnh báo</td>
</tr>
<tr>
<td>SI-9</td>
<td>Dịch vụ thông báo — tin nhắn cho khách</td>
<td>Ra</td>
<td>Email và SMS kèm đường liên kết theo dõi đơn</td>
<td>Gửi trong vòng 5 phút kể từ sự kiện kích hoạt</td>
</tr>
<tr>
<td>SI-10</td>
<td>Nhà cung cấp định danh — xác thực nhân viên</td>
<td>Vào</td>
<td>Khẳng định xác thực và khai báo vai trò (CO-1)</td>
<td>Theo chuẩn của tập đoàn</td>
</tr>
</tbody>
</table>
<p><strong>SI-1 tới SI-7 phải được cô lập sau một giao tiếp nội bộ</strong>, sao cho thêm một kênh hoặc
một hãng không đòi phải sửa logic đơn hàng, tồn kho hay định tuyến (CO-6).</p>
<h3>5.3 Giao tiếp phần cứng</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Yêu cầu</th>
</tr>
</thead>
<tbody>
<tr>
<td>HI-1</td>
<td>Hệ thống phải nhận đầu vào mã vạch từ máy quét tích hợp của các máy Android cầm tay đang triển khai ở các trung tâm, đưa vào dưới dạng gõ phím.</td>
</tr>
<tr>
<td>HI-2</td>
<td>Hệ thống phải sinh ra nhãn vận chuyển ở định dạng mà máy in nhãn nhiệt lắp tại từng trung tâm chấp nhận.</td>
</tr>
<tr>
<td>HI-3</td>
<td>Hệ thống phải hoạt động được trên máy cầm tay có bộ nhớ 2 GB và màn hình 5 inch (OE-3).</td>
</tr>
</tbody>
</table>
<h3>5.4 Giao tiếp truyền thông</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Yêu cầu</th>
</tr>
</thead>
<tbody>
<tr>
<td>CI-1</td>
<td>Mọi liên lạc giữa OMFS và bất kỳ hệ thống ngoài nào phải dùng HTTPS với TLS 1.2 trở lên.</td>
</tr>
<tr>
<td>CI-2</td>
<td>Mọi liên lạc giữa một trình duyệt hoặc máy cầm tay và OMFS phải dùng HTTPS với TLS 1.2 trở lên.</td>
</tr>
<tr>
<td>CI-3</td>
<td>Hệ thống phải xác thực mọi webhook của hãng gửi tới trước khi áp dụng sự kiện mà nó mang theo (Event-1).</td>
</tr>
<tr>
<td>CI-4</td>
<td>Thông báo cho khách phải được gửi qua dịch vụ thông báo và không được chứa dữ liệu cá nhân nào ngoài chính đơn hàng của người nhận.</td>
</tr>
<tr>
<td>CI-5</td>
<td>Hệ thống không được đặt mã đơn hàng, token theo dõi hay bất kỳ dữ liệu cá nhân nào vào chuỗi truy vấn của URL, vốn được ghi vào nhật ký truy cập.</td>
</tr>
</tbody>
</table>
<hr />
<h3>6. Thuộc tính chất lượng</h3>
<p>Mọi thuộc tính dưới đây đều viết bằng <strong>Planguage</strong> (Gilb): SCALE nói đo cái gì, METER nói
đo bằng cách nào, MUST là mức mà dưới đó bản phát hành không chấp nhận được, PLAN là mức
đang được thiết kế nhắm tới. Một thuộc tính không có con số thì không phải một yêu cầu —
nó là một ý kiến, và nó không kiểm thử được.</p>
<h3>6.1 Khả dụng</h3>
<h4>QA-1 — Mức dễ học của giao diện nhặt và đóng gói</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Số phút trôi qua để một Nhân viên kho chưa từng dùng OMFS hoàn tất đúng đầu việc nhặt đầu tiên của mình mà không cần trợ giúp</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Quan sát có bấm giờ với 10 nhân viên trong đợt thí điểm ở Đà Nẵng</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 20 phút với 9 trên 10 nhân viên</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 15 phút với 9 trên 10 nhân viên</td>
</tr>
<tr>
<td><strong>Lý do</strong></td>
<td>Nhân viên kho là một lớp người dùng được ưu tiên (§2.2) với trình độ kỹ thuật thấp và mức luân chuyển theo ca. Việc đào tạo trên lớp không làm được ở quy mô này.</td>
</tr>
</tbody>
</table>
<h4>QA-2 — Độ phản hồi của bước nhặt trên máy cầm tay</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Số giây từ lúc quét mã vạch tới lúc đầu việc nhặt kế tiếp hiện ra, trên đúng phần cứng cầm tay đang triển khai</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Đo bằng công cụ trên máy, percentile 95 trong một ca</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 1,5 giây</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 0,8 giây</td>
</tr>
<tr>
<td><strong>Lý do</strong></td>
<td>Một nhân viên thực hiện khoảng 170 lượt quét mỗi ca. Thêm một giây độ trễ cho mỗi lượt quét tốn ba phút mỗi nhân viên mỗi ca, và đi ngược thẳng vào mục tiêu BO-3.</td>
</tr>
</tbody>
</table>
<h4>QA-3 — Khả năng hồi phục sau lỗi ở giao diện quản lý</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Tỉ lệ phần trăm các trạng thái lỗi mà từ đó người dùng đi tiếp được mà không phải rời trang hay mất dữ liệu đã nhập</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Rà soát theo danh sách ngoại lệ ở R2, trong quá trình thẩm định yêu cầu</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>100% với các cách xử lý ở bảng ngoại lệ</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>100% với mọi giao diện quản lý</td>
</tr>
</tbody>
</table>
<h3>6.2 Hiệu năng</h3>
<h4>QA-4 — Độ trễ tới lúc nhận đơn</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Số giây từ lúc một đơn được lấy về từ một kênh tới lúc việc giữ tồn của nó được xác nhận hoặc bị từ chối</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Các dấu thời gian ghi trên đơn; percentile 95, đo hằng ngày</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 90 giây ở mức tải trung bình</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 30 giây ở mức tải trung bình; ≤ 90 giây ở mức tải đỉnh</td>
</tr>
<tr>
<td><strong>Lý do</strong></td>
<td>Mỗi giây giữa lúc lấy đơn về và lúc giữ tồn là một giây mà cùng đơn vị hàng đó có thể bị bán lần nữa. Thuộc tính này là nửa "độ trễ" của mục tiêu BO-1.</td>
</tr>
</tbody>
</table>
<h4>QA-5 — Thông lượng giữ tồn dưới tải sale chớp nhoáng</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Số lượt giữ tồn được xác nhận mỗi giây mà không lượt giữ nào bị mất hay bị nhân đôi</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Thử tải ở mức 1,5 lần đỉnh lịch sử, trước ngày chiến dịch đầu tiên</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>60 lượt giữ tồn/giây, duy trì trong 10 phút</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>90 lượt giữ tồn/giây, duy trì trong 10 phút</td>
</tr>
<tr>
<td><strong>Lý do</strong></td>
<td>Các đợt bùng ngày chiến dịch (rủi ro RI-5). Giữ tồn là thao tác có mức tranh chấp cao nhất hệ thống.</td>
</tr>
</tbody>
</table>
<h4>QA-6 — Độ trễ công bố tồn kho</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Số giây từ lúc một số tồn thực tế hoặc số đang giữ thay đổi tới lúc số lượng bán được mới được một kênh bán chấp nhận</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Hiệu giữa thời điểm tồn kho đổi và thời điểm công bố; percentile 95, đo hằng ngày</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 120 giây</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 60 giây (mốc ở BR-20)</td>
</tr>
</tbody>
</table>
<h4>QA-7 — Độ trễ nhận sự kiện theo dõi</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Số phút từ dấu thời gian sự kiện của chính hãng tới lúc trạng thái đơn trong OMFS phản ánh sự kiện đó</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Hiệu giữa Carrier Event Time và Received At; percentile 95, đo hằng ngày</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 30 phút</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 15 phút</td>
</tr>
<tr>
<td><strong>Lý do</strong></td>
<td>Đây là tiêu chí thành công đo được của mục tiêu BO-4. Một trang theo dõi chỉ đáng đưa ra nếu thứ nó hiển thị là hiện hành.</td>
</tr>
</tbody>
</table>
<h4>QA-8 — Độ phản hồi của giao diện quản lý</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Số giây tới lúc hiển thị có nghĩa đầu tiên của bàn định tuyến, bảng ngoại lệ và bảng điều khiển</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Giám sát tổng hợp từ mạng văn phòng; percentile 95</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 4 giây</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 2 giây</td>
</tr>
</tbody>
</table>
<h3>6.3 An ninh</h3>
<h4>QA-9 — Khả năng chống đoán của token theo dõi</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Số lần đoán kỳ vọng để lấy được một token theo dõi hợp lệ cho bất kỳ đơn nào</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Phân tích entropy của token cộng với một phép thử giới hạn tần suất</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≥ 2⁶⁴ lần đoán, kèm giới hạn tần suất theo từng địa chỉ nguồn</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≥ 2¹²⁸ lần đoán</td>
</tr>
<tr>
<td><strong>Lý do</strong></td>
<td>Trang theo dõi là bề mặt duy nhất vào được từ công cộng và nó mang tên, địa chỉ cùng nội dung đơn hàng của khách. Yêu cầu Track-2 trở nên vô nghĩa nếu thiếu con số này.</td>
</tr>
</tbody>
</table>
<h4>QA-10 — Việc cưỡng chế phân quyền</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Tỉ lệ phần trăm các thao tác có đặc quyền mà việc kiểm vai được cưỡng chế ở phía máy chủ, không chỉ ở giao diện</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Rà soát an ninh mọi thao tác liệt kê ở mục 3, trước khi phát hành</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>100%</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>100%, kèm các phép kiểm tự động phủ việc ghi đè định tuyến (BR-19), việc xử lý ngoại lệ và việc đổi cấu hình</td>
</tr>
<tr>
<td><strong>Lý do</strong></td>
<td>Giấu một nút điều khiển trong giao diện không phải là phân quyền. BR-19 chỉ cưỡng chế được ở phía máy chủ.</td>
</tr>
</tbody>
</table>
<h4>QA-11 — Tính đầy đủ của vết kiểm toán</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Tỉ lệ phần trăm các lượt dịch chuyển tồn kho, ghi đè định tuyến và xử lý ngoại lệ mà truy xuất được người làm, thời điểm và lý do</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Lấy mẫu 50 bản ghi mỗi loại trong quá trình thẩm định yêu cầu</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>100%</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>100%, truy xuất được trong vòng 5 giây</td>
</tr>
</tbody>
</table>
<h4>QA-12 — Việc xử lý thông tin xác thực</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Số khoá API của bên thứ ba hoặc thông tin xác thực thanh toán lấy ra được từ một trình duyệt hoặc máy cầm tay</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Soi các gói đã giao và lưu lượng mạng</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>0</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>0 (ràng buộc CO-2, CO-5)</td>
</tr>
</tbody>
</table>
<h3>6.4 An toàn và toàn vẹn</h3>
<h4>QA-13 — Bảo toàn tồn kho</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Số đơn vị hàng bị hệ thống tạo ra hoặc phá huỷ mà không phải do một sự kiện vật lý được ghi nhận, mỗi tháng</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Đối soát hằng ngày theo DA-7</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>0</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>0, và mọi sai lệch đều được cảnh báo trong vòng 24 giờ</td>
</tr>
<tr>
<td><strong>Lý do</strong></td>
<td>Một lần trừ kép hoặc một lượt giữ tồn bị mất sẽ đưa trở lại đúng vấn đề bán vượt tồn mà dự án sinh ra để xoá bỏ, và nó làm điều đó một cách âm thầm.</td>
</tr>
</tbody>
</table>
<h4>QA-14 — Tính nguyên tử của các thay đổi trạng thái đơn hàng</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Số đơn bị bỏ lại ở trạng thái dở dang — giữ tồn một phần, định tuyến một phần, dán nhãn một phần — sau một lần tiến trình hỏng</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Kiểm thử tiêm lỗi cho việc giữ tồn, định tuyến và dán nhãn</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>0</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>0 (hậu điều kiện UC-03 POST-1, UC-04 POST-1, UC-07 POST-1)</td>
</tr>
</tbody>
</table>
<h3>6.5 Độ sẵn sàng, khả năng mở rộng và khả năng bảo trì</h3>
<h4>QA-15 — Độ sẵn sàng trong ngày làm việc hoàn tất đơn</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Tỉ lệ phần trăm số phút trong khoảng 06:00 tới 22:00 giờ địa phương mà việc nhận đơn, giữ tồn và nhặt hàng đều khả dụng</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Giám sát tổng hợp, đo hằng tháng</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>99,5%</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>99,9%, và 99,95% vào năm ngày chiến dịch mỗi năm</td>
</tr>
</tbody>
</table>
<h4>QA-16 — Năng lực ở mức đỉnh</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Số đơn được nhận, giữ tồn, định tuyến và nhặt hàng trong một ngày mà không cần thêm nhân sự</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Thử tải trước ngày chiến dịch đầu tiên, rồi quan sát vào đúng ngày đó</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>18.000 đơn/ngày (mức đỉnh lịch sử)</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>20.000 đơn/ngày (mục tiêu BO-6)</td>
</tr>
</tbody>
</table>
<h4>QA-17 — Thời gian khôi phục</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Số phút từ lúc phát hiện một sự cố ngoài kế hoạch tới lúc hoạt động hoàn tất đơn chạy lại được</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Diễn tập khôi phục thảm hoạ, hai lần mỗi năm</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 60 phút, không mất đơn nào</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 20 phút, không mất đơn nào</td>
</tr>
</tbody>
</table>
<h4>QA-18 — Chi phí để thêm một kênh hoặc một hãng vận chuyển</h4>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SCALE</strong></td>
<td>Số ngày-công lập trình viên để thêm một kênh bán nữa hoặc một hãng vận chuyển nữa</td>
</tr>
<tr>
<td><strong>METER</strong></td>
<td>Đo khi thêm kênh thứ tư ở bản 1.1</td>
</tr>
<tr>
<td><strong>MUST</strong></td>
<td>≤ 10 ngày-công, không sửa logic đơn hàng, tồn kho hay định tuyến</td>
</tr>
<tr>
<td><strong>PLAN</strong></td>
<td>≤ 5 ngày-công (ràng buộc CO-6)</td>
</tr>
<tr>
<td><strong>Lý do</strong></td>
<td>NRG đã thêm bốn kênh trong 24 tháng và dự kiến còn thêm nữa. Chi phí tích hợp là một ràng buộc kinh doanh, không phải một sở thích kỹ thuật.</td>
</tr>
</tbody>
</table>
<hr />
<h3>7. Yêu cầu quốc tế hoá và bản địa hoá</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Yêu cầu</th>
</tr>
</thead>
<tbody>
<tr>
<td>IL-1</td>
<td>Hệ thống phải trình bày mọi giao diện cho nhân viên và khách hàng bằng tiếng Việt, kèm tiếng Anh chỉ cho giao diện Quản trị hệ thống.</td>
</tr>
<tr>
<td>IL-2</td>
<td>Hệ thống phải lưu mọi số tiền theo đồng Việt Nam, không có phần thập phân, và phải trình bày chúng nhóm theo hàng nghìn dùng dấu chấm.</td>
</tr>
<tr>
<td>IL-3</td>
<td>Hệ thống phải trình bày ngày theo dạng DD/MM/YYYY và giờ theo dạng 24 giờ.</td>
</tr>
<tr>
<td>IL-4</td>
<td>Hệ thống phải lưu mọi dấu thời gian kèm độ lệch UTC tường minh và trình bày theo múi Asia/Ho_Chi_Minh.</td>
</tr>
<tr>
<td>IL-5</td>
<td>Hệ thống phải nhận và lưu đúng dấu tiếng Việt ở mọi trường tên và địa chỉ, và phải truyền chúng tới các hãng vận chuyển theo đúng bảng mã mà từng hãng đòi hỏi.</td>
</tr>
<tr>
<td>IL-6</td>
<td>Hệ thống phải sắp xếp văn bản tiếng Việt theo luật đối chiếu tiếng Việt, không theo thứ tự byte.</td>
</tr>
</tbody>
</table>
<p>Việc hỗ trợ thêm ngôn ngữ hay đơn vị tiền tệ khác không bắt buộc với các bản 1.0–2.0.
Điều này được ghi lại chứ không bỏ qua, vì một lần mở rộng ra ngoài Việt Nam sau này sẽ
làm IL-1 và IL-2 trở nên lỗi thời chứ không chỉ là thiếu sót.</p>
<hr />
<h3>8. Yêu cầu khác</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Yêu cầu</th>
</tr>
</thead>
<tbody>
<tr>
<td>OR-1</td>
<td>Hệ thống phải lưu giữ dữ liệu cá nhân theo đúng Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, và phải cho phép xoá dữ liệu cá nhân của một khách khỏi các đơn đã lưu trữ lâu dài khi có yêu cầu (DA-6).</td>
</tr>
<tr>
<td>OR-2</td>
<td>Hệ thống phải cài đặt được vào một môi trường mới từ cấu hình đã đưa vào quản lý phiên bản, không có bước thủ công nào chưa được tài liệu hoá.</td>
</tr>
<tr>
<td>OR-3</td>
<td>Hệ thống phải được bàn giao kèm sổ tay vận hành mà bộ phận hỗ trợ CNTT của NRG cần để chẩn đoán việc nhận đơn thất bại, việc công bố thất bại và các lô giao đứng im.</td>
</tr>
<tr>
<td>OR-4</td>
<td>Hệ thống phải cho phép thực thi việc chuyển đổi dữ liệu lặp lại nhiều lần trên một môi trường không phải production mà không còn dư lại gì từ các lần chạy trước.</td>
</tr>
<tr>
<td>OR-5</td>
<td>Mọi thư viện của bên thứ ba được dùng đều phải mang một giấy phép tương thích với việc dùng nội bộ có tính thương mại; không được dùng các giấy phép copyleft đòi phải phân phối mã nguồn.</td>
</tr>
</tbody>
</table>
<hr />
<h2>Phụ lục A: Bảng thuật ngữ</h2>
<table>
<thead>
<tr>
<th>Thuật ngữ</th>
<th>Định nghĩa</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>ATP</strong></td>
<td>Available to promise — số lượng của một SKU có thể hứa cho một đơn mới; xem BR-07 và Data Dictionary</td>
</tr>
<tr>
<td><strong>Backorder</strong> — Chờ hàng</td>
<td>Một đơn đã nhận nhưng chưa hoàn tất được từ tồn kho hiện tại</td>
</tr>
<tr>
<td><strong>Carton</strong> — Thùng</td>
<td>Một hộp vật lý trong một lô giao</td>
</tr>
<tr>
<td><strong>Cut-off</strong> — Giờ chốt</td>
<td>Giờ trong ngày mà sau đó đơn xuất đi vào ngày làm việc kế tiếp; BR-10</td>
</tr>
<tr>
<td><strong>Fulfillment center (FC)</strong> — Trung tâm hoàn tất đơn</td>
<td>Một nhà kho mà từ đó đơn hàng được giao đi</td>
</tr>
<tr>
<td><strong>Landed cost</strong> — Chi phí trọn gói</td>
<td>Tổng chi phí vận chuyển gồm cả phụ phí và chiết khấu; BR-12</td>
</tr>
<tr>
<td><strong>Order</strong> — Đơn hàng</td>
<td>Một lượt mua của khách nhận về từ một kênh bán</td>
</tr>
<tr>
<td><strong>Oversell</strong> — Bán vượt tồn</td>
<td>Việc nhận một đơn cho số hàng không tồn tại</td>
</tr>
<tr>
<td><strong>Pick wave</strong> — Đợt nhặt hàng</td>
<td>Một lô các lô giao được phát xuống sàn kho cùng lúc</td>
</tr>
<tr>
<td><strong>Rate shopping</strong> — So giá vận chuyển</td>
<td>Việc so các hãng theo chi phí và mức dịch vụ trước khi mua nhãn</td>
</tr>
<tr>
<td><strong>Reservation</strong> — Lượt giữ tồn</td>
<td>Một lượt giữ hàng đặt cho một dòng đơn hàng</td>
</tr>
<tr>
<td><strong>RMA</strong></td>
<td>Return merchandise authorization — lượt cho phép trả hàng</td>
</tr>
<tr>
<td><strong>Routing</strong> — Định tuyến</td>
<td>Việc quyết định trung tâm nào giao những dòng nào</td>
</tr>
<tr>
<td><strong>Shipment</strong> — Lô giao</td>
<td>Phần của một đơn được hoàn tất từ một trung tâm hoàn tất đơn</td>
</tr>
<tr>
<td><strong>Short pick</strong> — Nhặt thiếu</td>
<td>Việc tìm thấy trên kệ ít đơn vị hơn số mà đầu việc nhặt đòi hỏi</td>
</tr>
<tr>
<td><strong>SKU</strong></td>
<td>Stock keeping unit — mã định danh duy nhất của một sản phẩm bán được</td>
</tr>
<tr>
<td><strong>Split order</strong> — Đơn bị tách</td>
<td>Một đơn được hoàn tất từ nhiều hơn một trung tâm hoàn tất đơn</td>
</tr>
<tr>
<td><strong>3PL</strong></td>
<td>Third-party logistics — một hãng vận chuyển bên ngoài</td>
</tr>
<tr>
<td><strong>WISMO</strong></td>
<td>"Đơn của tôi đâu?" — một lượt khách liên hệ hỏi trạng thái đơn</td>
</tr>
</tbody>
</table>
<h2>Phụ lục B: Mô hình phân tích</h2>
<table>
<thead>
<tr>
<th>Hình</th>
<th>Mô hình</th>
<th>Vị trí</th>
</tr>
</thead>
<tbody>
<tr>
<td>B-1</td>
<td>Context diagram của hệ thống</td>
<td><code>diagrams/use-case-diagram.png</code> (ranh giới và các actor ngoài)</td>
</tr>
<tr>
<td>B-2</td>
<td>Mô hình dữ liệu logic (ERD)</td>
<td><em>sẽ dựng ở khâu thiết kế; thực thể và quan hệ liệt kê ở §4.1</em></td>
</tr>
<tr>
<td>B-3</td>
<td>Use case diagram</td>
<td><code>diagrams/use-case-diagram.png</code> · bản nguồn sửa được <code>diagrams/use-case-diagram.drawio</code></td>
</tr>
<tr>
<td>B-4</td>
<td>Mô hình trạng thái đơn hàng</td>
<td>Các trạng thái liệt kê ở mục <em>Order Status</em> trong Data Dictionary; chuyển tiếp cho bởi hậu điều kiện của các use case</td>
</tr>
<tr>
<td>B-5</td>
<td>Mock-up màn hình</td>
<td><code>mockups/</code> — xem R5</td>
</tr>
</tbody>
</table>
<h2>Phụ lục C: Danh sách TBD</h2>
<p>Một SRS không còn mục nào treo ở giai đoạn này thì không phải là đã xong; nó là chưa được
soi xét. Những mục dưới đây đều có theo dõi, có người chịu trách nhiệm và có hạn.</p>
<table>
<thead>
<tr>
<th>#</th>
<th>Câu hỏi còn treo</th>
<th>Ảnh hưởng tới</th>
<th>Người chịu trách nhiệm</th>
<th>Hạn</th>
</tr>
</thead>
<tbody>
<tr>
<td>TBD-1</td>
<td>Cửa sổ trả hàng ở BR-14 tính từ lúc giao hay từ lúc xuất hàng? Hai bên liên quan trả lời khác nhau.</td>
<td>Return-1</td>
<td>Quản lý CSKH</td>
<td>Tuần 7</td>
</tr>
<tr>
<td>TBD-2</td>
<td>Các trọng số định tuyến ở BR-06 dùng chung cho cả năm nhãn hàng ở bản 1.0, hay theo từng nhãn?</td>
<td>Route-2, Route-8</td>
<td>Quản lý hoàn tất đơn</td>
<td>Tuần 6</td>
</tr>
<tr>
<td>TBD-3</td>
<td>Tồn an toàn ở BR-17 có áp theo từng kênh nữa không, hay chỉ theo trung tâm hoàn tất đơn?</td>
<td>Reserve-6, Sync-2</td>
<td>Kiểm soát tồn kho</td>
<td>Tuần 7</td>
</tr>
<tr>
<td>TBD-4</td>
<td>Câu chữ chính xác hướng tới khách khi một hãng vận chuyển im lặng.</td>
<td>Track-4</td>
<td>Quản lý nhãn hàng</td>
<td>Tuần 8</td>
</tr>
<tr>
<td>TBD-5</td>
<td>Lượt ghi sổ sang ERP ở SI-8 cần bóc tách theo nhãn hàng hay theo kênh, hay cả hai?</td>
<td>SI-8</td>
<td>Tài chính</td>
<td>Tuần 7</td>
</tr>
</tbody>
</table>
<h2>Phụ lục D: Ma trận truy vết yêu cầu</h2>
<table>
<thead>
<tr>
<th>Tính năng (R1 §2.1)</th>
<th>Mục SRS</th>
<th>Use case (R2)</th>
<th>Yêu cầu chức năng</th>
<th>Business rule (R3)</th>
<th>Mục tiêu</th>
</tr>
</thead>
<tbody>
<tr>
<td>FE-1 Nhận đơn</td>
<td>3.1</td>
<td>UC-01</td>
<td>Ingest-1 … Ingest-6</td>
<td>BR-16</td>
<td>BO-2</td>
</tr>
<tr>
<td>FE-2 Sàng lọc và kiểm hợp lệ</td>
<td>3.2</td>
<td>UC-02</td>
<td>Validate-1 … Validate-6</td>
<td>BR-03, BR-04</td>
<td>BO-1</td>
</tr>
<tr>
<td>FE-3 Tồn kho và ATP</td>
<td>3.3</td>
<td>UC-03</td>
<td>Reserve-1 … Reserve-7</td>
<td>BR-01, BR-02, BR-04, BR-07, BR-08, BR-17</td>
<td>BO-1</td>
</tr>
<tr>
<td>FE-4 Đồng bộ tồn kho ra kênh</td>
<td>3.4</td>
<td>UC-13</td>
<td>Sync-1 … Sync-7</td>
<td>BR-07, BR-17, BR-20</td>
<td>BO-1</td>
</tr>
<tr>
<td>FE-5 Định tuyến và tách đơn</td>
<td>3.5</td>
<td>UC-04</td>
<td>Route-1 … Route-8</td>
<td>BR-01, BR-06, BR-08, BR-09, BR-10, BR-19</td>
<td>BO-2, BO-3</td>
</tr>
<tr>
<td>FE-6 Đợt nhặt hàng</td>
<td>3.6</td>
<td>UC-05</td>
<td>Wave-1 … Wave-7</td>
<td>BR-10, BR-13</td>
<td>BO-3</td>
</tr>
<tr>
<td>FE-7 Nhặt hàng có quét xác nhận</td>
<td>3.7</td>
<td>UC-06</td>
<td>Pick-1 … Pick-8</td>
<td>BR-07, BR-13, BR-17</td>
<td>BO-2, BO-3</td>
</tr>
<tr>
<td>FE-8 So giá và mua nhãn</td>
<td>3.8</td>
<td>UC-07</td>
<td>Label-1 … Label-8</td>
<td>BR-11, BR-12</td>
<td>BO-5</td>
</tr>
<tr>
<td>FE-9 Nhận sự kiện theo dõi</td>
<td>3.9</td>
<td>UC-08</td>
<td>Event-1 … Event-8</td>
<td>BR-09</td>
<td>BO-4</td>
</tr>
<tr>
<td>FE-10 Thông báo và trang theo dõi</td>
<td>3.10</td>
<td>UC-09</td>
<td>Track-1 … Track-7</td>
<td>BR-09</td>
<td>BO-4</td>
</tr>
<tr>
<td>FE-11 Quản lý ngoại lệ</td>
<td>3.11</td>
<td>UC-10</td>
<td>Except-1 … Except-7</td>
<td>BR-05, BR-09, BR-13</td>
<td>BO-1, BO-2</td>
</tr>
<tr>
<td>FE-12 Huỷ và sửa đơn</td>
<td>3.12</td>
<td>UC-11</td>
<td>Cancel-1 … Cancel-7</td>
<td>BR-05, BR-16</td>
<td>BO-1</td>
</tr>
<tr>
<td>FE-13 Trả hàng và nhập lại kho</td>
<td>3.13</td>
<td>UC-12</td>
<td>Return-1 … Return-7</td>
<td>BR-14, BR-15</td>
<td>—</td>
</tr>
<tr>
<td>FE-14 Bảng điều khiển và đối soát</td>
<td>3.14</td>
<td>UC-14</td>
<td>Dash-1 … Dash-8</td>
<td>BR-06, BR-09, BR-18</td>
<td>Tất cả</td>
</tr>
</tbody>
</table></div>`,
  ].join('\n'),
};

const TP2L5 = {
  title: "W2.5 — Deliverable 5: data dictionary, 110 entries|||W2.5 — Deliverable 5: data dictionary, 110 mục",
  slug: "swr302-tp2-goi-05-data-dictionary",
  type: 'DOCUMENT',
  description: "Data dictionary đầy đủ theo hướng dẫn Chapter 13: 110 mục xếp theo bảng chữ cái, dùng đúng ký pháp +, ( ), { }, min:max, [ a | b ], mọi phần tử trong cấu trúc đều có mục riêng, cột Values trỏ business rule thay vì chép lại.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP2 · Deliverable 5</span>
<h2>110 entries, and the rule that is actually checked</h2>
<p class="lead">A data dictionary looks like clerical work and is graded like engineering. One check matters more than the rest: <strong>every element named inside a structure must have its own entry.</strong> Graders verify it by picking a structure at random and following each name.</p>
<p>Look at <code>Ship To Address</code>: it is composed of Recipient Name + Street Address + Ward + District + Province + Postcode + Phone Number, and all seven appear separately, alphabetically, elsewhere in the table. <code>Phone Number</code> is itself a structure — <code>"+84" + Subscriber Number</code> — so Subscriber Number has an entry too.</p>
<div class="callout ok"><strong>Two conventions worth copying.</strong> First, structures leave <em>Length</em> and <em>Values</em> blank; those columns apply to primitives only. Second, the <em>Values</em> column <strong>cites</strong> the governing business rule (<code>computed per BR-07</code>) instead of repeating it — same discipline as the use cases.</div>
<div class="pitfall"><strong>Build it while you write use cases, not afterwards.</strong> Every noun in a use case flow — "promised delivery date", "override reason", "inspection outcome" — is a candidate entry. Harvesting them at the end means reading everything twice.</div>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP2 · Deliverable 5</span>
<h2>110 mục, và cái luật thật sự bị kiểm</h2>
<p class="lead">Data dictionary trông như việc bàn giấy nhưng lại được chấm như việc kỹ thuật. Một phép kiểm quan trọng hơn cả: <strong>mọi phần tử được gọi tên bên trong một cấu trúc đều phải có mục riêng.</strong> Người chấm xác minh bằng cách bốc ngẫu nhiên một cấu trúc rồi dò từng cái tên.</p>
<p>Hãy nhìn <code>Ship To Address</code>: nó gồm Recipient Name + Street Address + Ward + District + Province + Postcode + Phone Number, và cả bảy đều xuất hiện riêng, theo bảng chữ cái, ở chỗ khác trong bảng. Bản thân <code>Phone Number</code> lại là một cấu trúc — <code>"+84" + Subscriber Number</code> — nên Subscriber Number cũng có mục riêng.</p>
<div class="callout ok"><strong>Hai quy ước đáng chép.</strong> Thứ nhất, cấu trúc thì để trống <em>Length</em> và <em>Values</em>; hai cột đó chỉ dành cho phần tử nguyên thuỷ. Thứ hai, cột <em>Values</em> <strong>trỏ</strong> tới business rule chi phối (<code>tính theo BR-07</code>) chứ không chép lại — cùng một kỷ luật với use case.</div>
<div class="pitfall"><strong>Hãy dựng nó TRONG LÚC viết use case, đừng để sau.</strong> Mỗi danh từ trong luồng use case — "ngày hứa giao", "lý do ghi đè", "kết quả kiểm tra" — là một mục ứng viên. Gom lại vào phút cuối nghĩa là phải đọc lại tất cả lần hai.</div>`,
    ),
    `<div class="ml-en"><h2>Data Dictionary</h2>
<h2>for the Order Management and Fulfillment System (OMFS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Member 4 name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Nova Retail Group (NRG)
Last updated 17 September 2026</p>
<hr />
<h3>Revision History</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Date</th>
<th>Reason For Changes</th>
<th>Version</th>
</tr>
</thead>
<tbody>
<tr>
<td>Member 4, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Elements harvested while use cases UC-01…UC-14 were written</td>
<td>0.9</td>
</tr>
<tr>
<td>Member 4, Group &lt;N&gt;</td>
<td>2026-09-17</td>
<td>Structures completed, cross-checked against business rules</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Notation</h3>
<p>Per <em>Guidance for Data Dictionaries</em> (Wiegers &amp; Beatty, Chapter 13):</p>
<table>
<thead>
<tr>
<th>Symbol</th>
<th>Meaning</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>+</code></td>
<td>composed of / and</td>
</tr>
<tr>
<td><code>( )</code></td>
<td>optional element</td>
</tr>
<tr>
<td><code>{ }</code></td>
<td>repeating group</td>
</tr>
<tr>
<td><code>min:max</code></td>
<td>allowed number of repeats; <code>n</code> means unlimited</td>
</tr>
<tr>
<td><code>[ a \\| b ]</code></td>
<td>either–or</td>
</tr>
<tr>
<td><code>" "</code></td>
<td>literal text</td>
</tr>
</tbody>
</table>
<p><strong>Conventions used in this document</strong></p>
<ul>
<li>Entries are ordered <strong>alphabetically</strong>.</li>
<li>For a <strong>data structure</strong>, the <em>Length</em> and <em>Values</em> columns are left blank — they apply to primitive elements only.</li>
<li>Every element named inside a structure has <strong>its own entry</strong> in this dictionary.</li>
<li>Where a value is governed by a business rule, the <em>Values</em> column cites the rule ID rather than repeating the rule text.</li>
</ul>
<hr />
<h3>2. Data Dictionary</h3>
<table>
<thead>
<tr>
<th>Data Element</th>
<th>Description</th>
<th>Composition or Data Type</th>
<th>Length</th>
<th>Values</th>
</tr>
</thead>
<tbody>
<tr>
<td>Authorized Quantity</td>
<td>Quantity of a SKU a customer has been authorized to return</td>
<td>integer</td>
<td>4</td>
<td>≥ 1; not greater than the delivered quantity</td>
</tr>
<tr>
<td>Available To Promise</td>
<td>Quantity of a SKU at one fulfillment center that may be promised to a new order</td>
<td>integer</td>
<td>6</td>
<td>≥ 0; computed per BR-07; may not be negative — a negative computation is a data fault (UC-13 exception 13.0.E4)</td>
</tr>
<tr>
<td>Barcode</td>
<td>Scannable code printed on the physical item, used to verify a pick</td>
<td>alphanumeric</td>
<td>20</td>
<td>EAN-13 or internal code; unique per SKU</td>
</tr>
<tr>
<td>Capacity Score</td>
<td>Component of the routing score reflecting a center's remaining daily capacity</td>
<td>decimal</td>
<td>5</td>
<td>0.00–1.00; see BR-06</td>
</tr>
<tr>
<td>Carrier Code</td>
<td>Identifier of a third-party logistics carrier</td>
<td>alphabetic</td>
<td>10</td>
<td>GHN, GHTK, VTP, JNT</td>
</tr>
<tr>
<td>Carrier Event Time</td>
<td>Time the carrier itself recorded a tracking event</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Used for ordering events (UC-08 POST-2); may be earlier than Received At</td>
</tr>
<tr>
<td>Carrier Quote</td>
<td>A price and service offer from one carrier for one shipment</td>
<td>Carrier Code + Service Level + Quoted Cost + Estimated Transit Days + Quoted At</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Carrier Status Code</td>
<td>The carrier's own status value, before mapping</td>
<td>alphanumeric</td>
<td>30</td>
<td>Carrier-specific; unmapped values raise a configuration alert</td>
</tr>
<tr>
<td>Carton</td>
<td>One physical box within a shipment</td>
<td>Carton ID + Carton Weight + Carton Length + Carton Width + Carton Height</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Carton ID</td>
<td>Unique identifier of a carton</td>
<td>alphanumeric</td>
<td>20</td>
<td>System-generated; printed as a scannable label</td>
</tr>
<tr>
<td>Carton Height</td>
<td>Height of a packed carton</td>
<td>decimal, centimetres</td>
<td>5</td>
<td>&gt; 0</td>
</tr>
<tr>
<td>Carton Length</td>
<td>Length of a packed carton</td>
<td>decimal, centimetres</td>
<td>5</td>
<td>&gt; 0</td>
</tr>
<tr>
<td>Carton Weight</td>
<td>Gross weight of a packed carton</td>
<td>decimal, kilograms</td>
<td>6</td>
<td>&gt; 0; drives carrier eligibility per BR-11 and cost per BR-12</td>
</tr>
<tr>
<td>Carton Width</td>
<td>Width of a packed carton</td>
<td>decimal, centimetres</td>
<td>5</td>
<td>&gt; 0</td>
</tr>
<tr>
<td>Center Status</td>
<td>Operating state of a fulfillment center</td>
<td>alphabetic</td>
<td>10</td>
<td>[ Open | Closed | Suspended ]; only Open centers are routing candidates</td>
</tr>
<tr>
<td>Channel ID</td>
<td>Unique identifier of a sales channel</td>
<td>alphanumeric</td>
<td>12</td>
<td>System-assigned</td>
</tr>
<tr>
<td>Channel Name</td>
<td>Display name of a sales channel</td>
<td>alphanumeric</td>
<td>40</td>
<td>e.g. Web Storefront, Shopee, Lazada, TikTok Shop</td>
</tr>
<tr>
<td>Channel Status</td>
<td>Whether OMFS currently exchanges data with a channel</td>
<td>alphabetic</td>
<td>10</td>
<td>[ Active | Inactive ]; only Active channels receive stock publications</td>
</tr>
<tr>
<td>Channel Stock Publication</td>
<td>A record of the sellable quantity most recently sent to one channel for one SKU</td>
<td>SKU + Channel ID + Published Quantity + Published At</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Channel Type</td>
<td>Category of sales channel, which determines its modification policy</td>
<td>alphabetic</td>
<td>12</td>
<td>[ Storefront | Marketplace ]; Marketplace orders may not be modified (BR-16)</td>
</tr>
<tr>
<td>Cost Score</td>
<td>Component of the routing score reflecting expected shipping cost</td>
<td>decimal</td>
<td>5</td>
<td>0.00–1.00; see BR-06</td>
</tr>
<tr>
<td>Created At</td>
<td>Time a record was created</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>System-generated</td>
</tr>
<tr>
<td>Customer</td>
<td>The buyer named on an order</td>
<td>Customer Name + Email Address + (Phone Number)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Customer Name</td>
<td>Name of the buyer as supplied by the sales channel</td>
<td>alphabetic</td>
<td>100</td>
<td>Not blank</td>
</tr>
<tr>
<td>Daily Capacity</td>
<td>Number of shipments a fulfillment center can dispatch in one working day</td>
<td>integer</td>
<td>6</td>
<td>&gt; 0; configurable per center; used by BR-06 and UC-04</td>
</tr>
<tr>
<td>Damaged Quantity</td>
<td>Quantity of a SKU at a center recorded as damaged and not sellable</td>
<td>integer</td>
<td>6</td>
<td>≥ 0; excluded from Available To Promise per BR-07</td>
</tr>
<tr>
<td>Decided At</td>
<td>Time a routing decision was made</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>System-generated</td>
</tr>
<tr>
<td>Decision Mode</td>
<td>How a routing decision was reached</td>
<td>alphabetic</td>
<td>16</td>
<td>[ Automatic | Manual | Fallback ]; Manual requires Override Reason per BR-19</td>
</tr>
<tr>
<td>Dispatch Cut Off Time</td>
<td>Local time after which orders routed to a center dispatch the next working day</td>
<td>time, HH:MM</td>
<td>5</td>
<td>Default 14:00; configurable per center; see BR-10</td>
</tr>
<tr>
<td>District</td>
<td>District of the delivery address</td>
<td>alphabetic</td>
<td>60</td>
<td>From the national administrative list</td>
</tr>
<tr>
<td>Email Address</td>
<td>Electronic mail address used to send order notifications</td>
<td>alphanumeric</td>
<td>254</td>
<td>Must contain exactly one "@"</td>
</tr>
<tr>
<td>Estimated Transit Days</td>
<td>Carrier's published transit time for the destination</td>
<td>integer</td>
<td>2</td>
<td>≥ 0; used by BR-09 to determine at-risk orders</td>
</tr>
<tr>
<td>Event ID</td>
<td>Unique identifier of a tracking event</td>
<td>alphanumeric</td>
<td>36</td>
<td>System-generated</td>
</tr>
<tr>
<td>Exception ID</td>
<td>Unique identifier of a fulfillment exception</td>
<td>alphanumeric</td>
<td>20</td>
<td>System-generated</td>
</tr>
<tr>
<td>Exception Status</td>
<td>Current state of a fulfillment exception</td>
<td>alphabetic</td>
<td>12</td>
<td>[ Open | Resolved | Escalated ]; never deleted, always resolved (UC-10 POST-1)</td>
</tr>
<tr>
<td>Exception Type</td>
<td>Category of fulfillment exception, which determines the resolution options offered</td>
<td>alphabetic</td>
<td>24</td>
<td>[ Backorder | SplitLimit | ShortPick | NoCarrier | DeliveryFailure | StalledShipment | AddressUnserviceable | DataQuality ]</td>
</tr>
<tr>
<td>Expires At</td>
<td>Time at which a reservation is released if not confirmed</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Created At + the reservation window; see BR-04</td>
</tr>
<tr>
<td>Fulfillment Center</td>
<td>A warehouse from which orders are shipped</td>
<td>Fulfillment Center ID + Fulfillment Center Name + Ship To Address + Center Status + Daily Capacity + Dispatch Cut Off Time</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Fulfillment Center ID</td>
<td>Unique identifier of a fulfillment center</td>
<td>alphanumeric</td>
<td>10</td>
<td>HCM, HAN, DAD</td>
</tr>
<tr>
<td>Fulfillment Center Name</td>
<td>Display name of a fulfillment center</td>
<td>alphanumeric</td>
<td>60</td>
<td>Not blank</td>
</tr>
<tr>
<td>Fulfillment Exception</td>
<td>A failure in the fulfillment lifecycle that requires a human decision</td>
<td>Exception ID + Exception Type + Order ID + (Shipment ID) + Raised At + Exception Status + (Resolution Code) + (Resolution Reason) + (Resolved By) + (Resolved At)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Inspection Outcome</td>
<td>Result of inspecting a returned item</td>
<td>alphabetic</td>
<td>10</td>
<td>[ Sellable | Damaged | Missing ]; Damaged must be quarantined per BR-15</td>
</tr>
<tr>
<td>Inventory Record</td>
<td>The stock position of one SKU at one fulfillment center</td>
<td>SKU + Fulfillment Center ID + On Hand Quantity + Reserved Quantity + Damaged Quantity + Safety Stock Quantity + Available To Promise</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Item</td>
<td>A sellable product as OMFS knows it</td>
<td>SKU + Item Description + Item Weight + Barcode + Storage Location</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Item Description</td>
<td>Human-readable product name shown on the pick screen</td>
<td>alphanumeric</td>
<td>200</td>
<td>Not blank</td>
</tr>
<tr>
<td>Item Weight</td>
<td>Unit weight of one item, used to estimate carton weight</td>
<td>decimal, kilograms</td>
<td>6</td>
<td>&gt; 0</td>
</tr>
<tr>
<td>Line Number</td>
<td>Position of a line within its order</td>
<td>integer</td>
<td>3</td>
<td>≥ 1; unique within an order</td>
</tr>
<tr>
<td>Line Status</td>
<td>Current state of one order line</td>
<td>alphabetic</td>
<td>14</td>
<td>[ Pending | Reserved | Backordered | Picked | Shipped | Cancelled | Returned ]</td>
</tr>
<tr>
<td>OMFS Status</td>
<td>Tracking event status after mapping to the OMFS vocabulary</td>
<td>alphabetic</td>
<td>20</td>
<td>[ Collected | InTransit | OutForDelivery | Delivered | DeliveryFailed | Returned | Lost ]</td>
</tr>
<tr>
<td>On Hand Quantity</td>
<td>Physical quantity of a SKU present at a fulfillment center</td>
<td>integer</td>
<td>6</td>
<td>≥ 0</td>
</tr>
<tr>
<td>Order</td>
<td>A customer purchase received from one sales channel</td>
<td>Order ID + Channel ID + Order Date + Customer + Ship To Address + Payment Method + Order Status + 1:n{Order Line}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Order Date</td>
<td>Time the order was placed on the sales channel</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Supplied by the channel, not the time of ingestion</td>
</tr>
<tr>
<td>Order ID</td>
<td>Unique OMFS identifier of an order</td>
<td>alphanumeric</td>
<td>20</td>
<td>System-generated; distinct from the channel's own order reference</td>
</tr>
<tr>
<td>Order Line</td>
<td>One SKU and quantity within an order</td>
<td>Line Number + SKU + Ordered Quantity + Unit Price + Line Status</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Order Status</td>
<td>Current position of an order in the fulfillment lifecycle</td>
<td>alphabetic</td>
<td>18</td>
<td>[ Pending | HeldUnmapped | HeldInvalid | HeldReview | Validated | Reserved | Backordered | Routed | Picking | Packed | Labelled | Shipped | Delivered | Cancelled ]</td>
</tr>
<tr>
<td>Ordered Quantity</td>
<td>Quantity of a SKU the customer ordered on a line</td>
<td>integer</td>
<td>4</td>
<td>≥ 1</td>
</tr>
<tr>
<td>Override Reason</td>
<td>Free text a Fulfillment Manager must supply when overriding an automated routing decision</td>
<td>alphanumeric</td>
<td>500</td>
<td>Mandatory when Decision Mode is Manual; see BR-19</td>
</tr>
<tr>
<td>Payment Method</td>
<td>How the customer paid or will pay</td>
<td>alphabetic</td>
<td>16</td>
<td>[ Card | BankTransfer | EWallet | COD ]; COD skips the authorization check (UC-02 flow 2.1)</td>
</tr>
<tr>
<td>Phone Number</td>
<td>Contact telephone number for delivery</td>
<td>"+84" + Subscriber Number</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Pick Wave</td>
<td>A batch of shipments released to a fulfillment center floor together</td>
<td>Wave ID + Fulfillment Center ID + Created At + (Released At) + Wave Status + 1:n{Shipment ID}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Postcode</td>
<td>Postal code of the delivery destination</td>
<td>numeric</td>
<td>6</td>
<td>Must be served by at least one carrier (BR-11)</td>
</tr>
<tr>
<td>Proximity Score</td>
<td>Component of the routing score reflecting distance from center to destination</td>
<td>decimal</td>
<td>5</td>
<td>0.00–1.00; see BR-06</td>
</tr>
<tr>
<td>Province</td>
<td>Province or centrally governed city of the delivery address</td>
<td>alphabetic</td>
<td>60</td>
<td>From the national administrative list</td>
</tr>
<tr>
<td>Published At</td>
<td>Time a stock quantity was sent to a channel</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Used to measure the 60-second target in BR-20</td>
</tr>
<tr>
<td>Published Quantity</td>
<td>Sellable quantity most recently sent to a channel for a SKU</td>
<td>integer</td>
<td>6</td>
<td>≥ 0</td>
</tr>
<tr>
<td>Quoted At</td>
<td>Time a carrier rate quote was obtained</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Stored for invoice reconciliation (UC-07 POST-2)</td>
</tr>
<tr>
<td>Quoted Cost</td>
<td>Landed shipping cost quoted by a carrier</td>
<td>decimal, VND</td>
<td>12</td>
<td>≥ 0; computed per BR-12</td>
</tr>
<tr>
<td>RMA Number</td>
<td>Unique return authorization number given to the customer</td>
<td>alphanumeric</td>
<td>20</td>
<td>System-generated; printed on return instructions</td>
</tr>
<tr>
<td>RMA Status</td>
<td>Current state of a return authorization</td>
<td>alphabetic</td>
<td>14</td>
<td>[ Authorized | Received | Inspected | Closed | NotReceived ]</td>
</tr>
<tr>
<td>Raised At</td>
<td>Time a fulfillment exception was created</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>System-generated</td>
</tr>
<tr>
<td>Received At</td>
<td>Time OMFS received a tracking event</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Compared with Carrier Event Time to measure ingestion lag (BO-4 metric)</td>
</tr>
<tr>
<td>Received Quantity</td>
<td>Quantity actually received back at the fulfillment center</td>
<td>integer</td>
<td>4</td>
<td>≥ 0; a value above Authorized Quantity raises an exception (UC-12 exception 12.0.E4)</td>
</tr>
<tr>
<td>Recipient Name</td>
<td>Name of the person receiving the delivery</td>
<td>alphabetic</td>
<td>100</td>
<td>Not blank; may differ from Customer Name</td>
</tr>
<tr>
<td>Released At</td>
<td>Time a pick wave was released to the floor</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Blank until release; starts the 24-hour escalation window in BR-13</td>
</tr>
<tr>
<td>Reservation</td>
<td>A hold placed on stock for one order line</td>
<td>Reservation ID + SKU + Fulfillment Center ID + Reserved Quantity + Created At + Expires At</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Reservation ID</td>
<td>Unique identifier of a reservation</td>
<td>alphanumeric</td>
<td>20</td>
<td>System-generated</td>
</tr>
<tr>
<td>Reserved Quantity</td>
<td>Quantity of a SKU held for orders and not available to new ones</td>
<td>integer</td>
<td>6</td>
<td>≥ 0; excluded from Available To Promise per BR-07</td>
</tr>
<tr>
<td>Resolution Code</td>
<td>The action chosen to resolve a fulfillment exception</td>
<td>alphabetic</td>
<td>24</td>
<td>Valid values depend on Exception Type (UC-10 flows 10.1–10.4)</td>
</tr>
<tr>
<td>Resolution Reason</td>
<td>Free text explaining why a resolution was chosen</td>
<td>alphanumeric</td>
<td>500</td>
<td>Mandatory; see UC-10 POST-1</td>
</tr>
<tr>
<td>Resolved At</td>
<td>Time a fulfillment exception was resolved</td>
<td>datetime, ISO 8601 with offset</td>
<td>25</td>
<td>Blank while the exception is Open</td>
</tr>
<tr>
<td>Resolved By</td>
<td>User who resolved a fulfillment exception</td>
<td>alphanumeric</td>
<td>60</td>
<td>Blank while the exception is Open</td>
</tr>
<tr>
<td>Return Authorization</td>
<td>A customer's authorized return of one or more delivered lines</td>
<td>RMA Number + Order ID + Created At + RMA Status + 1:n{Return Line}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Return Line</td>
<td>One SKU and quantity within a return authorization</td>
<td>SKU + Authorized Quantity + (Received Quantity) + (Inspection Outcome)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Routing Decision</td>
<td>The record of how an order was routed, retained so the decision can be explained</td>
<td>Order ID + Decided At + Decision Mode + 1:3{Routing Score} + (Override Reason)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Routing Score</td>
<td>One fulfillment center's score in a routing decision</td>
<td>Fulfillment Center ID + Stock Coverage Score + Proximity Score + Cost Score + Capacity Score + Total Score</td>
<td></td>
<td></td>
</tr>
<tr>
<td>SKU</td>
<td>Stock keeping unit — the unique identifier of a sellable product</td>
<td>alphanumeric</td>
<td>24</td>
<td>Unique across all brands; the join key between channels, inventory and shipments</td>
</tr>
<tr>
<td>Safety Stock Quantity</td>
<td>Quantity of a SKU withheld from sale at a center as a buffer</td>
<td>integer</td>
<td>5</td>
<td>≥ 0; default 2, configurable per SKU; see BR-17</td>
</tr>
<tr>
<td>Sales Channel</td>
<td>A storefront or marketplace through which NRG sells</td>
<td>Channel ID + Channel Name + Channel Type + Channel Status</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Service Level</td>
<td>Speed tier of a carrier offering</td>
<td>alphabetic</td>
<td>12</td>
<td>[ Standard | Express | SameDay ]</td>
</tr>
<tr>
<td>Ship To Address</td>
<td>The destination to which a shipment is delivered</td>
<td>Recipient Name + Street Address + Ward + District + Province + Postcode + Phone Number</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Shipment</td>
<td>The portion of an order fulfilled from one fulfillment center</td>
<td>Shipment ID + Order ID + Fulfillment Center ID + Shipment Status + 1:n{Shipment Line} + (Carrier Code) + (Tracking Number) + 0:n{Carton}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Shipment ID</td>
<td>Unique identifier of a shipment</td>
<td>alphanumeric</td>
<td>20</td>
<td>System-generated</td>
</tr>
<tr>
<td>Shipment Line</td>
<td>One SKU and quantity within a shipment</td>
<td>SKU + Shipped Quantity</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Shipment Status</td>
<td>Current state of a shipment</td>
<td>alphabetic</td>
<td>18</td>
<td>[ Routed | Picking | Packed | Labelled | Collected | InTransit | Delivered | DeliveryException | Returned | Cancelled ]</td>
</tr>
<tr>
<td>Shipped Quantity</td>
<td>Quantity of a SKU actually packed into a shipment</td>
<td>integer</td>
<td>4</td>
<td>≥ 0; may be less than Ordered Quantity after a short pick</td>
</tr>
<tr>
<td>Stock Coverage Score</td>
<td>Component of the routing score reflecting how much of the order a center can fill</td>
<td>decimal</td>
<td>5</td>
<td>0.00–1.00; see BR-06</td>
</tr>
<tr>
<td>Storage Location</td>
<td>Coarse location of a SKU within a fulfillment center, used to sequence the pick list</td>
<td>alphanumeric</td>
<td>20</td>
<td>Maintained by warehouse staff; bin-level detail is out of scope (EX-3)</td>
</tr>
<tr>
<td>Street Address</td>
<td>House number and street of the delivery address</td>
<td>alphanumeric</td>
<td>200</td>
<td>Not blank</td>
</tr>
<tr>
<td>Subscriber Number</td>
<td>National subscriber portion of a telephone number, without the leading zero</td>
<td>numeric</td>
<td>9</td>
<td>9 digits</td>
</tr>
<tr>
<td>Total Score</td>
<td>Weighted sum of a center's routing score components</td>
<td>decimal</td>
<td>6</td>
<td>0.00–1.00; computed per BR-06; the highest wins</td>
</tr>
<tr>
<td>Tracking Event</td>
<td>One carrier scan or status update for a shipment</td>
<td>Event ID + Tracking Number + Carrier Code + Carrier Status Code + OMFS Status + Carrier Event Time + Received At</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Tracking Number</td>
<td>Carrier's identifier for a parcel, used by the customer to track it</td>
<td>alphanumeric</td>
<td>40</td>
<td>Issued by the carrier at label purchase; unique per carrier</td>
</tr>
<tr>
<td>Unit Price</td>
<td>Price of one unit of a SKU as charged by the sales channel</td>
<td>decimal, VND</td>
<td>12</td>
<td>≥ 0; supplied by the channel, never recalculated by OMFS</td>
</tr>
<tr>
<td>Ward</td>
<td>Ward or commune of the delivery address</td>
<td>alphabetic</td>
<td>60</td>
<td>From the national administrative list</td>
</tr>
<tr>
<td>Wave ID</td>
<td>Unique identifier of a pick wave</td>
<td>alphanumeric</td>
<td>20</td>
<td>System-generated</td>
</tr>
<tr>
<td>Wave Status</td>
<td>Current state of a pick wave</td>
<td>alphabetic</td>
<td>12</td>
<td>[ Draft | Released | Complete | Cancelled ]</td>
</tr>
</tbody>
</table>
<hr />
<h3>3. Notes on selected entries</h3>
<p><strong>Available To Promise</strong> is the most important entry in this dictionary. It is not
stored data — it is derived, and its derivation (BR-07) is what closes the oversell
gap that motivated the whole project. Every place a quantity is shown to a channel,
an operator or a customer, this is the number, not On Hand Quantity.</p>
<p><strong>Order Status versus Shipment Status</strong> are deliberately different vocabularies. An
order can be partially shipped when it has been split (BR-08), so its status is not
simply the status of its shipments. Merging the two lists — a tempting
simplification — would make a split order unrepresentable.</p>
<p><strong>Carrier Event Time versus Received At</strong> exist as a pair so that ingestion lag can
be measured. The 15-minute p95 target that delivers business objective BO-4 is
computed from the difference, and UC-08 orders events by Carrier Event Time rather
than Received At precisely because carriers deliver events out of order.</p>
<p><strong>Override Reason and Resolution Reason</strong> are mandatory free text. They exist
because BR-19 and UC-10 POST-1 require that a human decision be explainable later;
without them the audit trail records <em>what</em> happened but never <em>why</em>.</p></div>
<div class="ml-vi"><h2>Từ điển dữ liệu</h2>
<h2>cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên thành viên 4&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Nova Retail Group (NRG)
Cập nhật lần cuối 17 tháng 9 năm 2026</p>
<hr />
<h3>Lịch sử sửa đổi</h3>
<table>
<thead>
<tr>
<th>Người</th>
<th>Ngày</th>
<th>Lý do sửa</th>
<th>Phiên bản</th>
</tr>
</thead>
<tbody>
<tr>
<td>Thành viên 4, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Thu thập phần tử trong lúc viết use case UC-01…UC-14</td>
<td>0.9</td>
</tr>
<tr>
<td>Thành viên 4, Nhóm &lt;N&gt;</td>
<td>17-09-2026</td>
<td>Hoàn thiện các cấu trúc, đối chiếu chéo với business rule</td>
<td>1.0</td>
</tr>
</tbody>
</table>
<hr />
<h3>1. Ký pháp</h3>
<p>Theo <em>Guidance for Data Dictionaries</em> (Wiegers &amp; Beatty, chương 13):</p>
<table>
<thead>
<tr>
<th>Ký hiệu</th>
<th>Nghĩa</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>+</code></td>
<td>gồm có / và</td>
</tr>
<tr>
<td><code>( )</code></td>
<td>phần tử tuỳ chọn</td>
</tr>
<tr>
<td><code>{ }</code></td>
<td>nhóm lặp lại</td>
</tr>
<tr>
<td><code>min:max</code></td>
<td>số lần lặp cho phép; <code>n</code> nghĩa là không giới hạn</td>
</tr>
<tr>
<td><code>[ a \\| b ]</code></td>
<td>chọn một trong các phương án</td>
</tr>
<tr>
<td><code>" "</code></td>
<td>chuỗi ký tự nguyên văn</td>
</tr>
</tbody>
</table>
<p><strong>Quy ước dùng trong tài liệu này</strong></p>
<ul>
<li>Các mục xếp theo <strong>thứ tự bảng chữ cái</strong> (theo tên tiếng Anh, vì đó là tên dùng trong đặc tả).</li>
<li>Với một <strong>cấu trúc dữ liệu</strong>, cột <em>Độ dài</em> và <em>Giá trị</em> để trống — hai cột đó chỉ áp cho phần tử nguyên thuỷ.</li>
<li>Mọi phần tử được gọi tên bên trong một cấu trúc đều có <strong>mục riêng của nó</strong> trong từ điển này.</li>
<li>Chỗ nào giá trị bị một business rule chi phối thì cột <em>Giá trị</em> trích mã luật chứ không chép lại nội dung luật.</li>
</ul>
<hr />
<h3>2. Từ điển dữ liệu</h3>
<table>
<thead>
<tr>
<th>Phần tử dữ liệu</th>
<th>Mô tả</th>
<th>Cấu thành hoặc kiểu dữ liệu</th>
<th>Độ dài</th>
<th>Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td>Authorized Quantity</td>
<td>Số lượng của một SKU mà khách được cho phép trả lại</td>
<td>số nguyên</td>
<td>4</td>
<td>≥ 1; không lớn hơn số lượng đã giao</td>
</tr>
<tr>
<td>Available To Promise</td>
<td>Số lượng của một SKU tại một trung tâm hoàn tất đơn có thể hứa cho một đơn mới</td>
<td>số nguyên</td>
<td>6</td>
<td>≥ 0; tính theo BR-07; không được âm — một kết quả âm là lỗi dữ liệu (UC-13 ngoại lệ 13.0.E4)</td>
</tr>
<tr>
<td>Barcode</td>
<td>Mã quét được in trên món hàng vật lý, dùng để xác minh lượt nhặt</td>
<td>chữ và số</td>
<td>20</td>
<td>EAN-13 hoặc mã nội bộ; duy nhất theo từng SKU</td>
</tr>
<tr>
<td>Capacity Score</td>
<td>Thành phần của điểm định tuyến, phản ánh năng lực còn lại trong ngày của một trung tâm</td>
<td>số thập phân</td>
<td>5</td>
<td>0,00–1,00; xem BR-06</td>
</tr>
<tr>
<td>Carrier Code</td>
<td>Mã của một hãng logistics bên thứ ba</td>
<td>chữ cái</td>
<td>10</td>
<td>GHN, GHTK, VTP, JNT</td>
</tr>
<tr>
<td>Carrier Event Time</td>
<td>Thời điểm chính hãng vận chuyển ghi nhận một sự kiện theo dõi</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Dùng để sắp thứ tự sự kiện (UC-08 POST-2); có thể sớm hơn Received At</td>
</tr>
<tr>
<td>Carrier Quote</td>
<td>Một mức giá và mức dịch vụ mà một hãng chào cho một lô giao</td>
<td>Carrier Code + Service Level + Quoted Cost + Estimated Transit Days + Quoted At</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Carrier Status Code</td>
<td>Giá trị trạng thái của chính hãng vận chuyển, trước khi ánh xạ</td>
<td>chữ và số</td>
<td>30</td>
<td>Riêng theo từng hãng; giá trị chưa ánh xạ sẽ sinh cảnh báo cấu hình</td>
</tr>
<tr>
<td>Carton</td>
<td>Một thùng hàng vật lý trong một lô giao</td>
<td>Carton ID + Carton Weight + Carton Length + Carton Width + Carton Height</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Carton ID</td>
<td>Mã định danh duy nhất của một thùng hàng</td>
<td>chữ và số</td>
<td>20</td>
<td>Hệ thống tự sinh; in ra thành nhãn quét được</td>
</tr>
<tr>
<td>Carton Height</td>
<td>Chiều cao của một thùng đã đóng gói</td>
<td>số thập phân, cm</td>
<td>5</td>
<td>&gt; 0</td>
</tr>
<tr>
<td>Carton Length</td>
<td>Chiều dài của một thùng đã đóng gói</td>
<td>số thập phân, cm</td>
<td>5</td>
<td>&gt; 0</td>
</tr>
<tr>
<td>Carton Weight</td>
<td>Khối lượng cả bì của một thùng đã đóng gói</td>
<td>số thập phân, kg</td>
<td>6</td>
<td>&gt; 0; quyết định điều kiện hãng theo BR-11 và chi phí theo BR-12</td>
</tr>
<tr>
<td>Carton Width</td>
<td>Chiều rộng của một thùng đã đóng gói</td>
<td>số thập phân, cm</td>
<td>5</td>
<td>&gt; 0</td>
</tr>
<tr>
<td>Center Status</td>
<td>Trạng thái vận hành của một trung tâm hoàn tất đơn</td>
<td>chữ cái</td>
<td>10</td>
<td>[ Open | Closed | Suspended ]; chỉ trung tâm Open mới là ứng viên định tuyến</td>
</tr>
<tr>
<td>Channel ID</td>
<td>Mã định danh duy nhất của một kênh bán</td>
<td>chữ và số</td>
<td>12</td>
<td>Hệ thống gán</td>
</tr>
<tr>
<td>Channel Name</td>
<td>Tên hiển thị của một kênh bán</td>
<td>chữ và số</td>
<td>40</td>
<td>Ví dụ Web Storefront, Shopee, Lazada, TikTok Shop</td>
</tr>
<tr>
<td>Channel Status</td>
<td>OMFS hiện có trao đổi dữ liệu với kênh đó hay không</td>
<td>chữ cái</td>
<td>10</td>
<td>[ Active | Inactive ]; chỉ kênh Active mới nhận công bố tồn kho</td>
</tr>
<tr>
<td>Channel Stock Publication</td>
<td>Bản ghi về số lượng bán được gần nhất đã gửi tới một kênh cho một SKU</td>
<td>SKU + Channel ID + Published Quantity + Published At</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Channel Type</td>
<td>Loại kênh bán, quyết định chính sách sửa đơn của kênh đó</td>
<td>chữ cái</td>
<td>12</td>
<td>[ Storefront | Marketplace ]; đơn từ Marketplace không được sửa (BR-16)</td>
</tr>
<tr>
<td>Cost Score</td>
<td>Thành phần của điểm định tuyến, phản ánh chi phí vận chuyển dự kiến</td>
<td>số thập phân</td>
<td>5</td>
<td>0,00–1,00; xem BR-06</td>
</tr>
<tr>
<td>Created At</td>
<td>Thời điểm một bản ghi được tạo</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Customer</td>
<td>Người mua có tên trên một đơn hàng</td>
<td>Customer Name + Email Address + (Phone Number)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Customer Name</td>
<td>Tên người mua do kênh bán cung cấp</td>
<td>chữ cái</td>
<td>100</td>
<td>Không để trống</td>
</tr>
<tr>
<td>Daily Capacity</td>
<td>Số lô giao mà một trung tâm hoàn tất đơn xuất được trong một ngày làm việc</td>
<td>số nguyên</td>
<td>6</td>
<td>&gt; 0; cấu hình được theo từng trung tâm; dùng trong BR-06 và UC-04</td>
</tr>
<tr>
<td>Damaged Quantity</td>
<td>Số lượng của một SKU tại một trung tâm được ghi nhận là hỏng, không bán được</td>
<td>số nguyên</td>
<td>6</td>
<td>≥ 0; bị loại khỏi Available To Promise theo BR-07</td>
</tr>
<tr>
<td>Decided At</td>
<td>Thời điểm một quyết định định tuyến được đưa ra</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Decision Mode</td>
<td>Cách một quyết định định tuyến được đưa ra</td>
<td>chữ cái</td>
<td>16</td>
<td>[ Automatic | Manual | Fallback ]; Manual bắt buộc phải có Override Reason theo BR-19</td>
</tr>
<tr>
<td>Dispatch Cut Off Time</td>
<td>Giờ địa phương mà sau đó đơn định tuyến về trung tâm sẽ xuất vào ngày làm việc kế tiếp</td>
<td>giờ, HH:MM</td>
<td>5</td>
<td>Mặc định 14:00; cấu hình được theo từng trung tâm; xem BR-10</td>
</tr>
<tr>
<td>District</td>
<td>Quận/huyện của địa chỉ giao hàng</td>
<td>chữ cái</td>
<td>60</td>
<td>Lấy từ danh mục đơn vị hành chính quốc gia</td>
</tr>
<tr>
<td>Email Address</td>
<td>Địa chỉ thư điện tử dùng để gửi thông báo đơn hàng</td>
<td>chữ và số</td>
<td>254</td>
<td>Phải chứa đúng một dấu "@"</td>
</tr>
<tr>
<td>Estimated Transit Days</td>
<td>Thời gian vận chuyển công bố của hãng tới điểm đến</td>
<td>số nguyên</td>
<td>2</td>
<td>≥ 0; dùng trong BR-09 để xác định đơn có rủi ro</td>
</tr>
<tr>
<td>Event ID</td>
<td>Mã định danh duy nhất của một sự kiện theo dõi</td>
<td>chữ và số</td>
<td>36</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Exception ID</td>
<td>Mã định danh duy nhất của một ngoại lệ hoàn tất đơn</td>
<td>chữ và số</td>
<td>20</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Exception Status</td>
<td>Trạng thái hiện tại của một ngoại lệ hoàn tất đơn</td>
<td>chữ cái</td>
<td>12</td>
<td>[ Open | Resolved | Escalated ]; không bao giờ bị xoá, luôn phải được xử lý (UC-10 POST-1)</td>
</tr>
<tr>
<td>Exception Type</td>
<td>Loại ngoại lệ hoàn tất đơn, quyết định các phương án xử lý được đưa ra</td>
<td>chữ cái</td>
<td>24</td>
<td>[ Backorder | SplitLimit | ShortPick | NoCarrier | DeliveryFailure | StalledShipment | AddressUnserviceable | DataQuality ]</td>
</tr>
<tr>
<td>Expires At</td>
<td>Thời điểm một lượt giữ tồn bị nhả ra nếu chưa được xác nhận</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Created At + cửa sổ giữ tồn; xem BR-04</td>
</tr>
<tr>
<td>Fulfillment Center</td>
<td>Một nhà kho mà từ đó đơn hàng được giao đi</td>
<td>Fulfillment Center ID + Fulfillment Center Name + Ship To Address + Center Status + Daily Capacity + Dispatch Cut Off Time</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Fulfillment Center ID</td>
<td>Mã định danh duy nhất của một trung tâm hoàn tất đơn</td>
<td>chữ và số</td>
<td>10</td>
<td>HCM, HAN, DAD</td>
</tr>
<tr>
<td>Fulfillment Center Name</td>
<td>Tên hiển thị của một trung tâm hoàn tất đơn</td>
<td>chữ và số</td>
<td>60</td>
<td>Không để trống</td>
</tr>
<tr>
<td>Fulfillment Exception</td>
<td>Một sự cố trong vòng đời hoàn tất đơn, đòi hỏi con người quyết định</td>
<td>Exception ID + Exception Type + Order ID + (Shipment ID) + Raised At + Exception Status + (Resolution Code) + (Resolution Reason) + (Resolved By) + (Resolved At)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Inspection Outcome</td>
<td>Kết quả kiểm tra một món hàng trả về</td>
<td>chữ cái</td>
<td>10</td>
<td>[ Sellable | Damaged | Missing ]; Damaged bắt buộc phải đưa vào khu cách ly theo BR-15</td>
</tr>
<tr>
<td>Inventory Record</td>
<td>Vị thế tồn kho của một SKU tại một trung tâm hoàn tất đơn</td>
<td>SKU + Fulfillment Center ID + On Hand Quantity + Reserved Quantity + Damaged Quantity + Safety Stock Quantity + Available To Promise</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Item</td>
<td>Một sản phẩm bán được theo cách OMFS hiểu về nó</td>
<td>SKU + Item Description + Item Weight + Barcode + Storage Location</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Item Description</td>
<td>Tên sản phẩm đọc được, hiện trên màn hình nhặt hàng</td>
<td>chữ và số</td>
<td>200</td>
<td>Không để trống</td>
</tr>
<tr>
<td>Item Weight</td>
<td>Khối lượng đơn vị của một món, dùng để ước tính khối lượng thùng</td>
<td>số thập phân, kg</td>
<td>6</td>
<td>&gt; 0</td>
</tr>
<tr>
<td>Line Number</td>
<td>Vị trí của một dòng trong đơn hàng của nó</td>
<td>số nguyên</td>
<td>3</td>
<td>≥ 1; duy nhất trong một đơn</td>
</tr>
<tr>
<td>Line Status</td>
<td>Trạng thái hiện tại của một dòng đơn hàng</td>
<td>chữ cái</td>
<td>14</td>
<td>[ Pending | Reserved | Backordered | Picked | Shipped | Cancelled | Returned ]</td>
</tr>
<tr>
<td>OMFS Status</td>
<td>Trạng thái sự kiện theo dõi sau khi ánh xạ về bộ từ vựng của OMFS</td>
<td>chữ cái</td>
<td>20</td>
<td>[ Collected | InTransit | OutForDelivery | Delivered | DeliveryFailed | Returned | Lost ]</td>
</tr>
<tr>
<td>On Hand Quantity</td>
<td>Số lượng vật lý của một SKU đang có tại một trung tâm hoàn tất đơn</td>
<td>số nguyên</td>
<td>6</td>
<td>≥ 0</td>
</tr>
<tr>
<td>Order</td>
<td>Một lượt mua của khách, nhận về từ một kênh bán</td>
<td>Order ID + Channel ID + Order Date + Customer + Ship To Address + Payment Method + Order Status + 1:n{Order Line}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Order Date</td>
<td>Thời điểm đơn được đặt trên kênh bán</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Do kênh cung cấp, không phải thời điểm OMFS nhận về</td>
</tr>
<tr>
<td>Order ID</td>
<td>Mã định danh đơn hàng duy nhất của OMFS</td>
<td>chữ và số</td>
<td>20</td>
<td>Hệ thống tự sinh; khác với mã đơn của chính kênh bán</td>
</tr>
<tr>
<td>Order Line</td>
<td>Một SKU kèm số lượng trong một đơn hàng</td>
<td>Line Number + SKU + Ordered Quantity + Unit Price + Line Status</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Order Status</td>
<td>Vị trí hiện tại của một đơn trong vòng đời hoàn tất đơn</td>
<td>chữ cái</td>
<td>18</td>
<td>[ Pending | HeldUnmapped | HeldInvalid | HeldReview | Validated | Reserved | Backordered | Routed | Picking | Packed | Labelled | Shipped | Delivered | Cancelled ]</td>
</tr>
<tr>
<td>Ordered Quantity</td>
<td>Số lượng của một SKU mà khách đặt trên một dòng</td>
<td>số nguyên</td>
<td>4</td>
<td>≥ 1</td>
</tr>
<tr>
<td>Override Reason</td>
<td>Văn bản tự do mà Quản lý hoàn tất đơn bắt buộc phải nhập khi ghi đè một quyết định định tuyến tự động</td>
<td>chữ và số</td>
<td>500</td>
<td>Bắt buộc khi Decision Mode là Manual; xem BR-19</td>
</tr>
<tr>
<td>Payment Method</td>
<td>Cách khách đã trả hoặc sẽ trả tiền</td>
<td>chữ cái</td>
<td>16</td>
<td>[ Card | BankTransfer | EWallet | COD ]; COD bỏ qua phép kiểm uỷ quyền (UC-02 luồng 2.1)</td>
</tr>
<tr>
<td>Phone Number</td>
<td>Số điện thoại liên hệ để giao hàng</td>
<td>"+84" + Subscriber Number</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Pick Wave</td>
<td>Một lô các lô giao được phát xuống sàn kho cùng lúc</td>
<td>Wave ID + Fulfillment Center ID + Created At + (Released At) + Wave Status + 1:n{Shipment ID}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Postcode</td>
<td>Mã bưu chính của điểm đến giao hàng</td>
<td>số</td>
<td>6</td>
<td>Phải được ít nhất một hãng phục vụ (BR-11)</td>
</tr>
<tr>
<td>Proximity Score</td>
<td>Thành phần của điểm định tuyến, phản ánh khoảng cách từ trung tâm tới điểm đến</td>
<td>số thập phân</td>
<td>5</td>
<td>0,00–1,00; xem BR-06</td>
</tr>
<tr>
<td>Province</td>
<td>Tỉnh hoặc thành phố trực thuộc trung ương của địa chỉ giao hàng</td>
<td>chữ cái</td>
<td>60</td>
<td>Lấy từ danh mục đơn vị hành chính quốc gia</td>
</tr>
<tr>
<td>Published At</td>
<td>Thời điểm một số lượng tồn kho được gửi tới một kênh</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Dùng để đo mốc 60 giây trong BR-20</td>
</tr>
<tr>
<td>Published Quantity</td>
<td>Số lượng bán được gần nhất đã gửi tới một kênh cho một SKU</td>
<td>số nguyên</td>
<td>6</td>
<td>≥ 0</td>
</tr>
<tr>
<td>Quoted At</td>
<td>Thời điểm lấy được một báo giá từ hãng vận chuyển</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Lưu lại để đối soát hoá đơn (UC-07 POST-2)</td>
</tr>
<tr>
<td>Quoted Cost</td>
<td>Chi phí vận chuyển trọn gói do một hãng báo</td>
<td>số thập phân, VND</td>
<td>12</td>
<td>≥ 0; tính theo BR-12</td>
</tr>
<tr>
<td>RMA Number</td>
<td>Số cho phép trả hàng duy nhất, cấp cho khách</td>
<td>chữ và số</td>
<td>20</td>
<td>Hệ thống tự sinh; in trên hướng dẫn trả hàng</td>
</tr>
<tr>
<td>RMA Status</td>
<td>Trạng thái hiện tại của một lượt cho phép trả hàng</td>
<td>chữ cái</td>
<td>14</td>
<td>[ Authorized | Received | Inspected | Closed | NotReceived ]</td>
</tr>
<tr>
<td>Raised At</td>
<td>Thời điểm một ngoại lệ hoàn tất đơn được tạo</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Received At</td>
<td>Thời điểm OMFS nhận được một sự kiện theo dõi</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Đem so với Carrier Event Time để đo độ trễ nhận sự kiện (thước đo của BO-4)</td>
</tr>
<tr>
<td>Received Quantity</td>
<td>Số lượng thực tế nhận lại được tại trung tâm hoàn tất đơn</td>
<td>số nguyên</td>
<td>4</td>
<td>≥ 0; giá trị lớn hơn Authorized Quantity sẽ sinh một ngoại lệ (UC-12 ngoại lệ 12.0.E4)</td>
</tr>
<tr>
<td>Recipient Name</td>
<td>Tên người nhận hàng</td>
<td>chữ cái</td>
<td>100</td>
<td>Không để trống; có thể khác Customer Name</td>
</tr>
<tr>
<td>Released At</td>
<td>Thời điểm một đợt nhặt hàng được phát xuống sàn</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Để trống tới lúc phát; bắt đầu cửa sổ leo thang 24 giờ trong BR-13</td>
</tr>
<tr>
<td>Reservation</td>
<td>Một lượt giữ tồn cho một dòng đơn hàng</td>
<td>Reservation ID + SKU + Fulfillment Center ID + Reserved Quantity + Created At + Expires At</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Reservation ID</td>
<td>Mã định danh duy nhất của một lượt giữ tồn</td>
<td>chữ và số</td>
<td>20</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Reserved Quantity</td>
<td>Số lượng của một SKU đang giữ cho các đơn và không còn khả dụng cho đơn mới</td>
<td>số nguyên</td>
<td>6</td>
<td>≥ 0; bị loại khỏi Available To Promise theo BR-07</td>
</tr>
<tr>
<td>Resolution Code</td>
<td>Hành động được chọn để xử lý một ngoại lệ hoàn tất đơn</td>
<td>chữ cái</td>
<td>24</td>
<td>Các giá trị hợp lệ phụ thuộc vào Exception Type (UC-10 luồng 10.1–10.4)</td>
</tr>
<tr>
<td>Resolution Reason</td>
<td>Văn bản tự do giải thích vì sao chọn cách xử lý đó</td>
<td>chữ và số</td>
<td>500</td>
<td>Bắt buộc; xem UC-10 POST-1</td>
</tr>
<tr>
<td>Resolved At</td>
<td>Thời điểm một ngoại lệ hoàn tất đơn được xử lý xong</td>
<td>ngày giờ, ISO 8601 kèm múi giờ</td>
<td>25</td>
<td>Để trống khi ngoại lệ còn Open</td>
</tr>
<tr>
<td>Resolved By</td>
<td>Người dùng đã xử lý một ngoại lệ hoàn tất đơn</td>
<td>chữ và số</td>
<td>60</td>
<td>Để trống khi ngoại lệ còn Open</td>
</tr>
<tr>
<td>Return Authorization</td>
<td>Một lượt trả hàng được cho phép, gồm một hoặc nhiều dòng đã giao</td>
<td>RMA Number + Order ID + Created At + RMA Status + 1:n{Return Line}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Return Line</td>
<td>Một SKU kèm số lượng trong một lượt cho phép trả hàng</td>
<td>SKU + Authorized Quantity + (Received Quantity) + (Inspection Outcome)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Routing Decision</td>
<td>Bản ghi về cách một đơn được định tuyến, giữ lại để sau này giải thích được quyết định</td>
<td>Order ID + Decided At + Decision Mode + 1:3{Routing Score} + (Override Reason)</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Routing Score</td>
<td>Điểm của một trung tâm hoàn tất đơn trong một quyết định định tuyến</td>
<td>Fulfillment Center ID + Stock Coverage Score + Proximity Score + Cost Score + Capacity Score + Total Score</td>
<td></td>
<td></td>
</tr>
<tr>
<td>SKU</td>
<td>Stock keeping unit — mã định danh duy nhất của một sản phẩm bán được</td>
<td>chữ và số</td>
<td>24</td>
<td>Duy nhất trên toàn bộ các nhãn hàng; là khoá nối giữa kênh bán, tồn kho và lô giao</td>
</tr>
<tr>
<td>Safety Stock Quantity</td>
<td>Số lượng của một SKU được giữ lại không bán tại một trung tâm, làm vùng đệm</td>
<td>số nguyên</td>
<td>5</td>
<td>≥ 0; mặc định 2, cấu hình được theo từng SKU; xem BR-17</td>
</tr>
<tr>
<td>Sales Channel</td>
<td>Một storefront hoặc một sàn mà NRG bán qua đó</td>
<td>Channel ID + Channel Name + Channel Type + Channel Status</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Service Level</td>
<td>Mức tốc độ của một dịch vụ hãng vận chuyển</td>
<td>chữ cái</td>
<td>12</td>
<td>[ Standard | Express | SameDay ]</td>
</tr>
<tr>
<td>Ship To Address</td>
<td>Điểm đến mà một lô giao được giao tới</td>
<td>Recipient Name + Street Address + Ward + District + Province + Postcode + Phone Number</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Shipment</td>
<td>Phần của một đơn được hoàn tất từ một trung tâm hoàn tất đơn</td>
<td>Shipment ID + Order ID + Fulfillment Center ID + Shipment Status + 1:n{Shipment Line} + (Carrier Code) + (Tracking Number) + 0:n{Carton}</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Shipment ID</td>
<td>Mã định danh duy nhất của một lô giao</td>
<td>chữ và số</td>
<td>20</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Shipment Line</td>
<td>Một SKU kèm số lượng trong một lô giao</td>
<td>SKU + Shipped Quantity</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Shipment Status</td>
<td>Trạng thái hiện tại của một lô giao</td>
<td>chữ cái</td>
<td>18</td>
<td>[ Routed | Picking | Packed | Labelled | Collected | InTransit | Delivered | DeliveryException | Returned | Cancelled ]</td>
</tr>
<tr>
<td>Shipped Quantity</td>
<td>Số lượng của một SKU thực sự được đóng vào một lô giao</td>
<td>số nguyên</td>
<td>4</td>
<td>≥ 0; có thể nhỏ hơn Ordered Quantity sau một lần nhặt thiếu</td>
</tr>
<tr>
<td>Stock Coverage Score</td>
<td>Thành phần của điểm định tuyến, phản ánh một trung tâm đáp ứng được bao nhiêu phần của đơn</td>
<td>số thập phân</td>
<td>5</td>
<td>0,00–1,00; xem BR-06</td>
</tr>
<tr>
<td>Storage Location</td>
<td>Vị trí thô của một SKU trong một trung tâm, dùng để sắp thứ tự danh sách nhặt hàng</td>
<td>chữ và số</td>
<td>20</td>
<td>Do nhân viên kho duy trì; chi tiết tới mức ô kệ nằm ngoài phạm vi (EX-3)</td>
</tr>
<tr>
<td>Street Address</td>
<td>Số nhà và tên đường của địa chỉ giao hàng</td>
<td>chữ và số</td>
<td>200</td>
<td>Không để trống</td>
</tr>
<tr>
<td>Subscriber Number</td>
<td>Phần số thuê bao trong nước của một số điện thoại, không có số 0 đứng đầu</td>
<td>số</td>
<td>9</td>
<td>9 chữ số</td>
</tr>
<tr>
<td>Total Score</td>
<td>Tổng có trọng số của các thành phần điểm định tuyến của một trung tâm</td>
<td>số thập phân</td>
<td>6</td>
<td>0,00–1,00; tính theo BR-06; cao nhất thì thắng</td>
</tr>
<tr>
<td>Tracking Event</td>
<td>Một lần quét hoặc một lần cập nhật trạng thái của hãng cho một lô giao</td>
<td>Event ID + Tracking Number + Carrier Code + Carrier Status Code + OMFS Status + Carrier Event Time + Received At</td>
<td></td>
<td></td>
</tr>
<tr>
<td>Tracking Number</td>
<td>Mã của hãng vận chuyển cho một kiện hàng, dùng để khách theo dõi</td>
<td>chữ và số</td>
<td>40</td>
<td>Hãng cấp lúc mua nhãn; duy nhất trong phạm vi từng hãng</td>
</tr>
<tr>
<td>Unit Price</td>
<td>Giá một đơn vị của một SKU theo mức kênh bán thu của khách</td>
<td>số thập phân, VND</td>
<td>12</td>
<td>≥ 0; do kênh cung cấp, OMFS không bao giờ tính lại</td>
</tr>
<tr>
<td>Ward</td>
<td>Phường/xã của địa chỉ giao hàng</td>
<td>chữ cái</td>
<td>60</td>
<td>Lấy từ danh mục đơn vị hành chính quốc gia</td>
</tr>
<tr>
<td>Wave ID</td>
<td>Mã định danh duy nhất của một đợt nhặt hàng</td>
<td>chữ và số</td>
<td>20</td>
<td>Hệ thống tự sinh</td>
</tr>
<tr>
<td>Wave Status</td>
<td>Trạng thái hiện tại của một đợt nhặt hàng</td>
<td>chữ cái</td>
<td>12</td>
<td>[ Draft | Released | Complete | Cancelled ]</td>
</tr>
</tbody>
</table>
<hr />
<h3>3. Ghi chú cho vài mục đáng chú ý</h3>
<p><strong>Available To Promise</strong> là mục quan trọng nhất trong từ điển này. Nó không phải dữ liệu
được lưu — nó được suy ra, và chính cách suy ra nó (BR-07) là thứ khép lại lỗ hổng bán
vượt tồn vốn là động cơ của cả dự án. Mọi chỗ mà một con số lượng được hiện ra cho một
kênh, một người vận hành hay một khách hàng, thì con số đó là nó, không phải On Hand
Quantity.</p>
<p><strong>Order Status và Shipment Status</strong> cố ý là hai bộ từ vựng khác nhau. Một đơn có thể được
giao một phần khi nó bị tách (BR-08), nên trạng thái của nó không đơn giản là trạng thái
của các lô giao. Gộp hai danh sách lại — một phép đơn giản hoá rất hấp dẫn — sẽ làm cho
một đơn bị tách trở nên không biểu diễn nổi.</p>
<p><strong>Carrier Event Time và Received At</strong> tồn tại thành một cặp để đo được độ trễ nhận sự
kiện. Mốc p95 15 phút mang lại mục tiêu nghiệp vụ BO-4 được tính từ hiệu số của hai cái,
và UC-08 sắp thứ tự sự kiện theo Carrier Event Time chứ không theo Received At, đúng vì
các hãng vận chuyển gửi sự kiện về không theo thứ tự.</p>
<p><strong>Override Reason và Resolution Reason</strong> là văn bản tự do bắt buộc. Chúng tồn tại vì
BR-19 và UC-10 POST-1 đòi hỏi một quyết định của con người phải giải thích được về sau;
thiếu chúng thì vết kiểm toán ghi lại <em>cái gì</em> đã xảy ra nhưng không bao giờ ghi <em>vì sao</em>.</p></div>`,
  ].join('\n'),
};

const TP2L6 = {
  title: "W2.6 — Deliverable 6: mock-ups and how the three were chosen|||W2.6 — Deliverable 6: mock-up và cách chọn ba use case",
  slug: "swr302-tp2-goi-06-mockups",
  type: 'DOCUMENT',
  description: "Năm mock-up cho các use case phức tạp nhất, cách xếp hạng để chọn ba cái, quyết định thiết kế mà mỗi mock-up đem đi hỏi stakeholder, và năm câu hỏi nó được sinh ra để chốt.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP2 · Deliverable 6</span>
<h2>Mock-ups that ask a question</h2>
<p class="lead">Chapter 15 is blunt about this: a mock-up exists to make a stakeholder say "no, that is not what I meant". It is not a picture of a finished product, and a polished one actively harms you — stakeholders discuss colour instead of behaviour, and management believes you are nearly done.</p>
<p>Two things in this deliverable are worth copying into your own:</p>
<ul>
<li><strong>The selection table.</strong> "Complex" is defined as alternative flows + exceptions + actors, and every candidate is scored. Choosing the three that are easiest to draw is the obvious temptation; this shows the work instead.</li>
<li><strong>Two of the five mock-ups show a FAILURE state.</strong> M1b is a routing attempt that hit the split limit; M4 is a tracking page whose carrier has gone silent for 46 hours. A mock-up set with no failure state proves nothing about whether the design handles reality.</li>
</ul>
<div class="callout ok"><strong>§4 is the part most teams skip.</strong> Five questions the mock-ups were built to settle, each with the stakeholder's answer — and one left open as TBD-4 because the brand team has not approved the wording. Inventing an answer would have been worse than recording that there is not one yet.</div>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP2 · Deliverable 6</span>
<h2>Mock-up để ĐẶT một câu hỏi</h2>
<p class="lead">Chương 15 nói thẳng: mock-up sinh ra để khiến một stakeholder nói "không, ý tôi không phải vậy". Nó không phải bức ảnh của sản phẩm hoàn thiện, và làm nó bóng bẩy còn hại — stakeholder sẽ bàn về màu sắc thay vì hành vi, còn quản lý thì tưởng bạn sắp xong.</p>
<p>Hai thứ trong deliverable này đáng chép sang bài của bạn:</p>
<ul>
<li><strong>Bảng chọn.</strong> "Phức tạp" được định nghĩa là số luồng thay thế + số ngoại lệ + số actor, và mọi ứng viên đều được chấm. Chọn ba cái dễ vẽ nhất là cám dỗ hiển nhiên; cái bảng này cho thấy bạn đã làm việc thật.</li>
<li><strong>Hai trong năm mock-up thể hiện trạng thái HỎNG.</strong> M1b là một lượt định tuyến chạm trần tách đơn; M4 là trang tra cứu mà hãng vận chuyển đã im lặng 46 giờ. Một bộ mock-up không có trạng thái hỏng thì không chứng minh được gì về việc thiết kế có chịu nổi thực tế hay không.</li>
</ul>
<div class="callout ok"><strong>§4 là phần phần lớn nhóm bỏ qua.</strong> Năm câu hỏi mà mock-up được dựng lên để chốt, mỗi câu kèm câu trả lời của stakeholder — và một câu để mở thành TBD-4 vì đội thương hiệu chưa duyệt cách diễn đạt. Bịa ra một câu trả lời còn tệ hơn là ghi nhận rằng chưa có.</div>`,
    ),
    `<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/SWR302/v1/assignment-tp2/002.webp" alt="🖥️ M1 — UC-04 Routing workbench, normal flow 4.0 with the full score table" loading="lazy" width="1220" height="755" /><p class="chu-thich">🖥️ <strong>M1</strong> — UC-04 Routing workbench, normal flow 4.0 with the full score table</p></div>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/SWR302/v1/assignment-tp2/003.webp" alt="🖥️ M1b — UC-04 exception 4.0.E2 (split limit exceeded, nothing created)" loading="lazy" width="1220" height="990" /><p class="chu-thich">🖥️ <strong>M1b</strong> — UC-04 exception 4.0.E2 (split limit exceeded, nothing created)</p></div>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/SWR302/v1/assignment-tp2/004.webp" alt="🖥️ M2 — UC-07 Carrier rate shopping, with one ineligible carrier and its reason" loading="lazy" width="1220" height="676" /><p class="chu-thich">🖥️ <strong>M2</strong> — UC-07 Carrier rate shopping, with one ineligible carrier and its reason</p></div>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/SWR302/v1/assignment-tp2/005.webp" alt="🖥️ M3 — UC-10 Exception console, type-specific resolutions" loading="lazy" width="1220" height="755" /><p class="chu-thich">🖥️ <strong>M3</strong> — UC-10 Exception console, type-specific resolutions</p></div>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/SWR302/v1/assignment-tp2/006.webp" alt="🖥️ M4 — UC-09 Customer tracking, split order + stale carrier status" loading="lazy" width="1220" height="935" /><p class="chu-thich">🖥️ <strong>M4</strong> — UC-09 Customer tracking, split order + stale carrier status</p></div>`,
    `<div class="ml-en"><h2>Mock-ups for Complex Use Cases</h2>
<h2>for the Order Management and Fulfillment System (OMFS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Member 4 name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Nova Retail Group (NRG)
17 September 2026</p>
<hr />
<h3>1. Purpose and approach</h3>
<p>Per Wiegers &amp; Beatty Chapter 15, these are <strong>throwaway, low-fidelity mock-ups</strong>. Their
job is to make a design decision visible so a stakeholder can disagree with it — not
to look finished. They are deliberately grey and unstyled: a polished mock-up makes
stakeholders discuss colour instead of behaviour, and makes management believe the
system is nearly built.</p>
<p><strong>The SRS remains the source of truth.</strong> These mock-ups illustrate it. Where a
mock-up and the SRS disagree, the SRS is correct and the mock-up is out of date.</p>
<h3>2. How the three use cases were chosen</h3>
<p>The brief asks for "at least 3 complex use cases". <em>Complex</em> here means <strong>many
decisions and many states</strong>, not many input fields. Candidates were ranked on
alternative flows + exceptions + participating actors:</p>
<table>
<thead>
<tr>
<th>Use case</th>
<th>Alt. flows</th>
<th>Exceptions</th>
<th>Actors</th>
<th>Total</th>
<th>Selected</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC-04</strong> Route and split an order</td>
<td>3</td>
<td>3</td>
<td>2</td>
<td><strong>8</strong></td>
<td>✅</td>
</tr>
<tr>
<td><strong>UC-10</strong> Handle a fulfillment exception</td>
<td>5</td>
<td>3</td>
<td>3</td>
<td><strong>11</strong></td>
<td>✅</td>
</tr>
<tr>
<td><strong>UC-07</strong> Rate-shop and buy a label</td>
<td>3</td>
<td>4</td>
<td>3</td>
<td><strong>10</strong></td>
<td>✅</td>
</tr>
<tr>
<td>UC-09 Track an order</td>
<td>3</td>
<td>3</td>
<td>3</td>
<td>9</td>
<td>✅ <em>(also drawn — see §3.5)</em></td>
</tr>
<tr>
<td>UC-03 Reserve inventory</td>
<td>2</td>
<td>4</td>
<td>2</td>
<td>8</td>
<td>— covered inside M1</td>
</tr>
<tr>
<td>UC-12 Process a return</td>
<td>3</td>
<td>4</td>
<td>3</td>
<td>10</td>
<td>deferred to Release 2.0</td>
</tr>
<tr>
<td>UC-06 Pick and pack</td>
<td>3</td>
<td>4</td>
<td>1</td>
<td>8</td>
<td>—</td>
</tr>
</tbody>
</table>
<p>UC-12 scores highly but is deferred to Release 2.0, so mocking it now would prototype
something nobody will build this year. UC-09 was added as a fourth because it is the
only customer-facing screen in the system and it is what actually delivers business
objective BO-4.</p>
<h3>3. The mock-ups</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>File</th>
<th>Use case</th>
<th>Flow shown</th>
<th>State</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>M1</strong></td>
<td><code>mockups/M1-UC04-routing-workbench.png</code></td>
<td>UC-04</td>
<td>Normal flow 4.0</td>
<td>Success</td>
</tr>
<tr>
<td><strong>M1b</strong></td>
<td><code>mockups/M1b-UC04-split-limit-exception.png</code></td>
<td>UC-04 → UC-10</td>
<td>Exception 4.0.E2</td>
<td><strong>Failure</strong></td>
</tr>
<tr>
<td><strong>M2</strong></td>
<td><code>mockups/M2-UC07-carrier-rate-shopping.png</code></td>
<td>UC-07</td>
<td>Normal flow 7.0</td>
<td>Success, with one ineligible carrier</td>
</tr>
<tr>
<td><strong>M3</strong></td>
<td><code>mockups/M3-UC10-exception-console.png</code></td>
<td>UC-10</td>
<td>Normal flow 10.0 + alt flow 10.5</td>
<td>Working queue</td>
</tr>
<tr>
<td><strong>M4</strong></td>
<td><code>mockups/M4-UC09-customer-tracking.png</code></td>
<td>UC-09</td>
<td>Alt flow 9.1 + exception 9.0.E3</td>
<td><strong>Split order + stale status</strong></td>
</tr>
</tbody>
</table>
<p>Editable source for every mock-up is the matching <code>.html</code> file in <code>mockups/</code>.</p>
<h3>3.1 M1 — Routing workbench (UC-04, normal flow)</h3>
<p>Shows the automated routing decision for a real order, with <strong>the full score table for
every candidate fulfillment center</strong> and a one-line explanation of why the winner won.</p>
<p><em>Design decision under test:</em> the Fulfillment Manager said in elicitation session 2
that they would not trust a routing decision they could not inspect. UC-04 POST-2
therefore requires the score table to be stored, and this screen is where it is read.
The alternative — showing only the chosen center — was rejected.</p>
<p><em>Realizes:</em> Route-1 … Route-5. <em>Rules visible:</em> BR-01, BR-06, BR-08, BR-09, BR-10.</p>
<h3>3.2 M1b — Split limit exceeded (UC-04, exception 4.0.E2)</h3>
<p>The failure state. Routing needs four fulfillment centers but BR-08 permits three, so
<strong>nothing is created and no stock is released</strong> — the banner says so explicitly,
because a manager's first question in this situation is "what has the system already
done?".</p>
<p><em>Design decision under test:</em> four resolution options with one recommended, rather
than a bare error. The mandatory reason box implements UC-10 POST-1.</p>
<p><em>Realizes:</em> Route-4, Except-1.</p>
<h3>3.3 M2 — Carrier rate shopping (UC-07)</h3>
<p>Four carriers quoted, three eligible, one shown <strong>greyed with its disqualifying
reason</strong> rather than hidden. The selection rule — cheapest carrier that still meets
the promised date — is stated on screen with the saving against the previous manual
default.</p>
<p><em>Design decision under test:</em> showing the ineligible carrier. Hiding it would make the
comparison shorter but unauditable; the Logistics Manager reconciles these quotes
against the monthly 3PL invoice, which is how objective BO-5 is proved.</p>
<p><em>Realizes:</em> Label-1, Label-2. <em>Rules visible:</em> BR-09, BR-11, BR-12.</p>
<h3>3.4 M3 — Exception console (UC-10)</h3>
<p>The working queue: every open exception sorted by delivery-date risk, with SLA
breaches marked, and — on selection — <strong>the resolution options that are valid for that
exception type only</strong>.</p>
<p><em>Design decision under test:</em> type-specific resolutions (UC-10 flows 10.1–10.4) rather
than a generic reassign / cancel / ignore list. A generic console would put the real
decision back in the manager's memory, which is exactly the manual process the project
is replacing.</p>
<p><em>Realizes:</em> Except-1 … Except-3. <em>Rules visible:</em> BR-08, BR-09.</p>
<h3>3.5 M4 — Customer order tracking (UC-09)</h3>
<p>The only customer-facing screen. Shows a <strong>split order</strong> as two explained parcels, and
a shipment whose carrier has gone quiet for 46 hours with an explicit "no update since"
notice and what NRG will do about it.</p>
<p><em>Design decisions under test:</em> two of them. First, a split order is <strong>explained</strong> — an
unexplained partial delivery generates precisely the WISMO contact this page exists to
prevent. Second, stale status is <strong>admitted</strong> with its timestamp rather than displayed
as though current; pretending to know is what destroys trust in a tracking page.</p>
<p><em>Realizes:</em> Track-1 … Track-4. <em>Rules visible:</em> BR-09.</p>
<h3>4. Questions these mock-ups are meant to settle</h3>
<p>Each was taken to the relevant stakeholder. Answers feed the SRS.</p>
<table>
<thead>
<tr>
<th>#</th>
<th>Question</th>
<th>Asked of</th>
<th>Answer</th>
</tr>
</thead>
<tbody>
<tr>
<td>Q1</td>
<td>Is the score table enough to make an automated routing decision trustworthy, or is a manual approval step needed for every order?</td>
<td>Fulfillment Manager</td>
<td>Score table is enough; approval only for overrides. Confirms UC-04 runs unattended.</td>
</tr>
<tr>
<td>Q2</td>
<td>Should an ineligible carrier be hidden or shown with a reason?</td>
<td>Logistics Manager</td>
<td>Shown with reason — needed for invoice reconciliation.</td>
</tr>
<tr>
<td>Q3</td>
<td>Should the exception console offer a free-text resolution, or a fixed list per type?</td>
<td>Fulfillment Manager</td>
<td>Fixed list per type, plus a mandatory reason.</td>
</tr>
<tr>
<td>Q4</td>
<td>Should a customer see that their order was split?</td>
<td>Customer Service Manager</td>
<td>Yes, and it must be explained in one sentence.</td>
</tr>
<tr>
<td>Q5</td>
<td>What should the tracking page show when a carrier goes silent?</td>
<td>Customer Service Manager</td>
<td>The last known status, its age, and what NRG will do — <strong>open TBD-4</strong>: exact wording to be agreed with the brand team.</td>
</tr>
</tbody>
</table>
<p><strong>TBD-4</strong> is carried into the SRS TBD list. Leaving it open and tracked is correct at
this stage; inventing wording the brand team has not approved would be worse.</p></div>
<div class="ml-vi"><h2>Mock-up cho các use case phức tạp</h2>
<h2>cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên thành viên 4&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Nova Retail Group (NRG)
17 tháng 9 năm 2026</p>
<hr />
<h3>1. Mục đích và cách tiếp cận</h3>
<p>Theo Wiegers &amp; Beatty chương 15, đây là <strong>mock-up dùng một lần, độ trung thực thấp</strong>.
Nhiệm vụ của chúng là làm một quyết định thiết kế hiện ra để bên liên quan có thể phản
đối nó — chứ không phải để trông như đã hoàn thiện. Chúng cố ý để xám và không tô vẽ:
một mock-up bóng bẩy sẽ khiến bên liên quan bàn về màu sắc thay vì về hành vi, và khiến
ban lãnh đạo tưởng hệ thống sắp xong tới nơi.</p>
<p><strong>SRS vẫn là nguồn sự thật.</strong> Các mock-up này minh hoạ cho nó. Chỗ nào mock-up và SRS
nói khác nhau thì SRS đúng còn mock-up là bản đã cũ.</p>
<h3>2. Ba use case này được chọn thế nào</h3>
<p>Đề bài yêu cầu "ít nhất 3 use case phức tạp". <em>Phức tạp</em> ở đây nghĩa là <strong>nhiều quyết
định và nhiều trạng thái</strong>, không phải nhiều ô nhập liệu. Các ứng viên được xếp hạng theo
luồng thay thế + ngoại lệ + số actor tham gia:</p>
<table>
<thead>
<tr>
<th>Use case</th>
<th>Luồng thay thế</th>
<th>Ngoại lệ</th>
<th>Actor</th>
<th>Tổng</th>
<th>Được chọn</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>UC-04</strong> Định tuyến và tách đơn</td>
<td>3</td>
<td>3</td>
<td>2</td>
<td><strong>8</strong></td>
<td>✅</td>
</tr>
<tr>
<td><strong>UC-10</strong> Xử lý một ngoại lệ hoàn tất đơn</td>
<td>5</td>
<td>3</td>
<td>3</td>
<td><strong>11</strong></td>
<td>✅</td>
</tr>
<tr>
<td><strong>UC-07</strong> So giá và mua nhãn vận chuyển</td>
<td>3</td>
<td>4</td>
<td>3</td>
<td><strong>10</strong></td>
<td>✅</td>
</tr>
<tr>
<td>UC-09 Theo dõi một đơn hàng</td>
<td>3</td>
<td>3</td>
<td>3</td>
<td>9</td>
<td>✅ <em>(cũng được vẽ — xem §3.5)</em></td>
</tr>
<tr>
<td>UC-03 Giữ tồn kho</td>
<td>2</td>
<td>4</td>
<td>2</td>
<td>8</td>
<td>— đã nằm trong M1</td>
</tr>
<tr>
<td>UC-12 Xử lý trả hàng</td>
<td>3</td>
<td>4</td>
<td>3</td>
<td>10</td>
<td>hoãn sang bản 2.0</td>
</tr>
<tr>
<td>UC-06 Nhặt và đóng gói</td>
<td>3</td>
<td>4</td>
<td>1</td>
<td>8</td>
<td>—</td>
</tr>
</tbody>
</table>
<p>UC-12 có điểm cao nhưng bị hoãn sang bản 2.0, nên vẽ mock-up cho nó lúc này là làm bản
mẫu cho một thứ năm nay không ai dựng. UC-09 được thêm vào làm cái thứ tư vì nó là màn
hình duy nhất của hệ thống mà khách hàng nhìn thấy, và nó chính là thứ mang lại mục tiêu
nghiệp vụ BO-4.</p>
<h3>3. Các mock-up</h3>
<table>
<thead>
<tr>
<th>#</th>
<th>Tệp</th>
<th>Use case</th>
<th>Luồng được thể hiện</th>
<th>Trạng thái</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>M1</strong></td>
<td><code>mockups/M1-UC04-routing-workbench.png</code></td>
<td>UC-04</td>
<td>Luồng chính 4.0</td>
<td>Thành công</td>
</tr>
<tr>
<td><strong>M1b</strong></td>
<td><code>mockups/M1b-UC04-split-limit-exception.png</code></td>
<td>UC-04 → UC-10</td>
<td>Ngoại lệ 4.0.E2</td>
<td><strong>Thất bại</strong></td>
</tr>
<tr>
<td><strong>M2</strong></td>
<td><code>mockups/M2-UC07-carrier-rate-shopping.png</code></td>
<td>UC-07</td>
<td>Luồng chính 7.0</td>
<td>Thành công, có một hãng không đủ điều kiện</td>
</tr>
<tr>
<td><strong>M3</strong></td>
<td><code>mockups/M3-UC10-exception-console.png</code></td>
<td>UC-10</td>
<td>Luồng chính 10.0 + luồng thay thế 10.5</td>
<td>Hàng chờ đang xử lý</td>
</tr>
<tr>
<td><strong>M4</strong></td>
<td><code>mockups/M4-UC09-customer-tracking.png</code></td>
<td>UC-09</td>
<td>Luồng thay thế 9.1 + ngoại lệ 9.0.E3</td>
<td><strong>Đơn bị tách + trạng thái đã cũ</strong></td>
</tr>
</tbody>
</table>
<p>Bản nguồn sửa được của từng mock-up là tệp <code>.html</code> tương ứng trong thư mục <code>mockups/</code>.</p>
<h3>3.1 M1 — Bàn định tuyến (UC-04, luồng chính)</h3>
<p>Thể hiện quyết định định tuyến tự động cho một đơn hàng thật, kèm <strong>bảng điểm đầy đủ của
từng trung tâm hoàn tất đơn ứng viên</strong> và một dòng giải thích vì sao cái thắng lại thắng.</p>
<p><em>Quyết định thiết kế đem đi hỏi:</em> Quản lý hoàn tất đơn nói trong buổi khai thác thứ 2
rằng họ sẽ không tin một quyết định định tuyến mà mình không soi được. Vì vậy UC-04
POST-2 yêu cầu phải lưu bảng điểm lại, và màn hình này là nơi đọc nó. Phương án còn lại —
chỉ hiện trung tâm được chọn — đã bị bác.</p>
<p><em>Hiện thực:</em> Route-1 … Route-5. <em>Luật nhìn thấy được:</em> BR-01, BR-06, BR-08, BR-09, BR-10.</p>
<h3>3.2 M1b — Vượt giới hạn tách đơn (UC-04, ngoại lệ 4.0.E2)</h3>
<p>Trạng thái thất bại. Việc định tuyến cần tới bốn trung tâm hoàn tất đơn trong khi BR-08
chỉ cho phép ba, nên <strong>không tạo ra gì cả và không nhả tồn kho nào</strong> — dải thông báo nói
thẳng điều đó, vì câu hỏi đầu tiên của một người quản lý trong tình huống này là "hệ
thống đã làm những gì rồi?".</p>
<p><em>Quyết định thiết kế đem đi hỏi:</em> bốn phương án xử lý kèm một phương án được khuyến nghị,
thay vì một thông báo lỗi trơ trọi. Ô nhập lý do bắt buộc chính là hiện thực của UC-10
POST-1.</p>
<p><em>Hiện thực:</em> Route-4, Except-1.</p>
<h3>3.3 M2 — So giá vận chuyển (UC-07)</h3>
<p>Bốn hãng báo giá, ba hãng đủ điều kiện, một hãng được hiện <strong>mờ đi kèm lý do bị loại</strong>
thay vì bị giấu. Luật chọn — hãng rẻ nhất mà vẫn kịp ngày đã hứa — được ghi ngay trên
màn hình cùng với khoản tiết kiệm so với lựa chọn mặc định thủ công trước đây.</p>
<p><em>Quyết định thiết kế đem đi hỏi:</em> việc hiện ra hãng không đủ điều kiện. Giấu nó đi sẽ làm
bảng so sánh ngắn hơn nhưng không kiểm toán được; Quản lý logistics đối chiếu các báo giá
này với hoá đơn 3PL hằng tháng, và đó là cách chứng minh mục tiêu BO-5.</p>
<p><em>Hiện thực:</em> Label-1, Label-2. <em>Luật nhìn thấy được:</em> BR-09, BR-11, BR-12.</p>
<h3>3.4 M3 — Bảng xử lý ngoại lệ (UC-10)</h3>
<p>Hàng chờ công việc: mọi ngoại lệ đang mở, sắp xếp theo mức rủi ro trễ ngày giao, có đánh
dấu các trường hợp vượt SLA, và — khi chọn một dòng — hiện ra <strong>chỉ những phương án xử lý
hợp lệ với đúng loại ngoại lệ đó</strong>.</p>
<p><em>Quyết định thiết kế đem đi hỏi:</em> phương án xử lý theo từng loại (UC-10 luồng 10.1–10.4)
thay vì một danh sách chung kiểu chuyển-lại / huỷ / bỏ qua. Một bảng điều khiển kiểu chung
chung sẽ đẩy quyết định thật về lại trí nhớ của người quản lý, mà đó đúng là quy trình thủ
công dự án này đang thay thế.</p>
<p><em>Hiện thực:</em> Except-1 … Except-3. <em>Luật nhìn thấy được:</em> BR-08, BR-09.</p>
<h3>3.5 M4 — Trang theo dõi đơn hàng cho khách (UC-09)</h3>
<p>Màn hình duy nhất khách hàng nhìn thấy. Thể hiện một <strong>đơn bị tách</strong> thành hai kiện hàng
có giải thích, và một lô giao mà hãng vận chuyển đã im lặng 46 giờ, kèm dòng thông báo rõ
ràng "chưa có cập nhật từ" và việc NRG sẽ làm gì với chuyện đó.</p>
<p><em>Quyết định thiết kế đem đi hỏi:</em> hai cái. Thứ nhất, đơn bị tách phải được <strong>giải thích</strong>
— một lần giao thiếu mà không giải thích sẽ sinh ra đúng cái cuộc gọi "đơn tôi đâu" mà
trang này sinh ra để ngăn. Thứ hai, trạng thái cũ phải được <strong>thừa nhận</strong> kèm mốc thời
gian, chứ không hiển thị như thể nó đang mới; giả vờ như mình biết chính là thứ phá huỷ
niềm tin vào một trang theo dõi đơn.</p>
<p><em>Hiện thực:</em> Track-1 … Track-4. <em>Luật nhìn thấy được:</em> BR-09.</p>
<h3>4. Những câu hỏi mà các mock-up này sinh ra để chốt</h3>
<p>Mỗi câu đã được mang tới đúng bên liên quan. Câu trả lời chảy vào SRS.</p>
<table>
<thead>
<tr>
<th>#</th>
<th>Câu hỏi</th>
<th>Hỏi ai</th>
<th>Trả lời</th>
</tr>
</thead>
<tbody>
<tr>
<td>Q1</td>
<td>Bảng điểm có đủ để một quyết định định tuyến tự động trở nên đáng tin không, hay cần một bước duyệt tay cho mọi đơn?</td>
<td>Quản lý hoàn tất đơn</td>
<td>Bảng điểm là đủ; chỉ cần duyệt với các trường hợp ghi đè. Xác nhận UC-04 chạy không cần người trực.</td>
</tr>
<tr>
<td>Q2</td>
<td>Hãng vận chuyển không đủ điều kiện nên giấu đi hay hiện ra kèm lý do?</td>
<td>Quản lý logistics</td>
<td>Hiện ra kèm lý do — cần cho việc đối chiếu hoá đơn.</td>
</tr>
<tr>
<td>Q3</td>
<td>Bảng xử lý ngoại lệ nên cho nhập lý do tự do, hay đưa một danh sách cố định theo từng loại?</td>
<td>Quản lý hoàn tất đơn</td>
<td>Danh sách cố định theo loại, cộng thêm một ô lý do bắt buộc.</td>
</tr>
<tr>
<td>Q4</td>
<td>Khách hàng có nên thấy đơn của mình đã bị tách không?</td>
<td>Quản lý CSKH</td>
<td>Có, và phải giải thích trong một câu.</td>
</tr>
<tr>
<td>Q5</td>
<td>Trang theo dõi nên hiện gì khi hãng vận chuyển im lặng?</td>
<td>Quản lý CSKH</td>
<td>Trạng thái biết được gần nhất, độ cũ của nó, và việc NRG sẽ làm — <strong>còn treo TBD-4</strong>: câu chữ chính xác cần thống nhất với bộ phận thương hiệu.</td>
</tr>
</tbody>
</table>
<p><strong>TBD-4</strong> được mang sang danh sách TBD của SRS. Ở giai đoạn này, để nó treo và có theo
dõi là đúng; bịa ra câu chữ mà bộ phận thương hiệu chưa duyệt thì tệ hơn.</p></div>`,
  ].join('\n'),
};

const TP2L7 = {
  title: "W2.7 — Deliverable 7: prioritization, and why the ranking was overruled|||W2.7 — Deliverable 7: xếp ưu tiên, và vì sao thứ hạng bị bác",
  slug: "swr302-tp2-goi-07-prioritization",
  type: 'DOCUMENT',
  description: "Bảng value/cost/risk của Chapter 16 với trọng số có biện minh, các mục bắt buộc tách riêng không chấm, thứ hạng thật của 13 feature, và — phần quan trọng nhất — lập luận vì sao kế hoạch phát hành không theo thứ hạng đó.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP2 · Deliverable 7</span>
<h2>The ranking says one thing, the release plan says another</h2>
<p class="lead">This is the deliverable where the marks are not in the spreadsheet. Anyone can type thirteen rows of numbers. The analysis is in §5, where the ranking and the release plan openly disagree and someone has to explain which one wins.</p>
<p>The model ranks <strong>FE-10 self-service tracking first</strong> — cheap, low risk, solid value. Release 1.0 ships FE-3, FE-4 and FE-5 instead, which sit at ranks 6, 8 and 10. Both are right, for reasons the model cannot see:</p>
<ul>
<li>The model has <strong>no concept of dependency</strong>. Showing a customer an order status that is wrong, because stock was oversold, is worse than showing them nothing. FE-10 only delivers value once status is trustworthy.</li>
<li>The model has <strong>no concept of the business case</strong>. BO-1 and BO-2 are what the sponsor funded, and only FE-3, FE-4 and FE-5 deliver them.</li>
</ul>
<div class="callout ok"><strong>Where the worksheet IS decisive:</strong> deciding what to drop when the release runs late. Rank order says defer FE-7 first — the most expensive item in Release 1.0 that is not FE-3 or FE-5, and the warehouse can live with printed slips for one more release. That is a real answer to a real question.</div>
<div class="pitfall"><strong>Note §3 — what was excluded from scoring.</strong> Wiegers says explicitly not to score features that must be included regardless. FE-1 order ingestion is not a candidate for prioritization; nothing else can run without it. A worksheet where a mandatory feature ranks low shows the tool was used without being read.</div>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP2 · Deliverable 7</span>
<h2>Thứ hạng nói một đằng, kế hoạch phát hành nói một nẻo</h2>
<p class="lead">Đây là deliverable mà điểm KHÔNG nằm trong bảng tính. Ai cũng gõ được mười ba dòng số. Phần phân tích nằm ở §5, nơi thứ hạng và kế hoạch phát hành công khai mâu thuẫn và phải có người giải thích bên nào thắng.</p>
<p>Mô hình xếp <strong>FE-10 tra cứu tự phục vụ hạng nhất</strong> — rẻ, ít rủi ro, giá trị chắc. Bản 1.0 lại ship FE-3, FE-4 và FE-5, những cái nằm ở hạng 6, 8 và 10. Cả hai đều đúng, vì những lý do mô hình không nhìn thấy:</p>
<ul>
<li>Mô hình <strong>không có khái niệm phụ thuộc</strong>. Cho khách xem một trạng thái đơn hàng sai, vì hàng đã bị bán vượt, còn tệ hơn là không cho xem gì. FE-10 chỉ tạo ra giá trị khi trạng thái đã đáng tin.</li>
<li>Mô hình <strong>không có khái niệm bài toán kinh doanh</strong>. BO-1 và BO-2 mới là thứ nhà tài trợ bỏ tiền, và chỉ FE-3, FE-4, FE-5 tạo ra chúng.</li>
</ul>
<div class="callout ok"><strong>Chỗ bảng ưu tiên THỰC SỰ quyết định:</strong> chọn bỏ cái gì khi bản phát hành trễ. Thứ hạng nói hoãn FE-7 trước — món đắt nhất trong bản 1.0 mà không phải FE-3 hay FE-5, và kho có thể sống với phiếu in thêm một bản nữa. Đó là câu trả lời thật cho một câu hỏi thật.</div>
<div class="pitfall"><strong>Để ý §3 — cái gì bị loại khỏi việc chấm.</strong> Wiegers nói thẳng là đừng chấm những tính năng buộc phải có. FE-1 tiếp nhận đơn không phải ứng viên xếp ưu tiên; không có nó thì chẳng thứ gì chạy được. Một bảng mà tính năng bắt buộc lại xếp hạng thấp cho thấy công cụ được dùng mà không được đọc.</div>`,
    ),
    `<div class="ml-en"><h2>Requirement Prioritization — Analysis</h2>
<h2>for the Order Management and Fulfillment System (OMFS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Member 5 name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Nova Retail Group (NRG)
17 September 2026</p>
<div class="callout">
<p>The worksheet itself is <code>deliverables/07-Requirements-Prioritization.xlsx</code>, built on
the Chapter 16 template by Wiegers &amp; Beatty with its formulas unchanged. This
document explains the inputs and what the output does and does not mean.</p>
</div>
<hr />
<h3>1. The model</h3>
<p>Each candidate feature is rated 1–9 on four dimensions and the sheet computes:</p>
<p><code>Total Value = Benefit × w_benefit + Penalty × w_penalty
Priority    = Value %  ÷  ( Cost % × w_cost  +  Risk % × w_risk )</code></p>
<p><strong>Benefit</strong> and <strong>Penalty</strong> are different questions and both are asked deliberately.
Benefit is the value if the feature is present; penalty is the damage if it is absent.
A feature can score low on benefit and high on penalty — FE-12 (cancellation) is
exactly that: nobody is delighted by it, but without it reserved stock stays locked
and the oversell problem reappears in another form.</p>
<h3>2. Weights, and why</h3>
<table>
<thead>
<tr>
<th>Dimension</th>
<th>Weight</th>
<th>Justification</th>
</tr>
</thead>
<tbody>
<tr>
<td>Benefit</td>
<td><strong>2</strong></td>
<td>The COO's business case rests on removing the constraint on growth. Value delivered outweighs damage avoided.</td>
</tr>
<tr>
<td>Penalty</td>
<td><strong>1</strong></td>
<td>Baseline.</td>
</tr>
<tr>
<td>Cost</td>
<td><strong>1</strong></td>
<td>Baseline.</td>
</tr>
<tr>
<td>Risk</td>
<td><strong>0.5</strong></td>
<td>Every technical risk in this project has a named mitigation in Vision &amp; Scope §1.6, so risk is real but managed. Weighting it equally with cost would over-penalise the two integration-heavy features, which are the ones delivering objective BO-5.</td>
</tr>
</tbody>
</table>
<h3>3. What was excluded from scoring</h3>
<p>Wiegers is explicit that features which must be included regardless — for political,
contractual or regulatory reasons — should not be scored, because ranking something
that cannot be dropped produces a meaningless number. Excluded (see the <em>Must-do (not
scored)</em> sheet):</p>
<table>
<thead>
<tr>
<th>Item</th>
<th>Why it cannot be traded away</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>FE-1</strong> Multi-channel order ingestion</td>
<td>Nothing else in OMFS can run without an order record</td>
</tr>
<tr>
<td><strong>CO-1</strong> Corporate identity provider</td>
<td>Corporate security policy</td>
</tr>
<tr>
<td><strong>CO-5</strong> No storage of payment card data</td>
<td>Keeps OMFS out of PCI scope</td>
</tr>
<tr>
<td><strong>OR-1</strong> Personal data retention and erasure</td>
<td>Decree 13/2023/ND-CP</td>
</tr>
</tbody>
</table>
<p>Thirteen features remain and were scored in a single pass, which matters because every
percentage in the sheet is a share of the column total.</p>
<h3>4. The result</h3>
<table>
<thead>
<tr>
<th style="text-align: right;">Rank</th>
<th>Feature</th>
<th style="text-align: right;">Value %</th>
<th style="text-align: right;">Cost %</th>
<th style="text-align: right;">Risk %</th>
<th style="text-align: right;"><strong>Priority</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: right;">1</td>
<td>FE-10 Customer notification and self-service tracking</td>
<td style="text-align: right;">7.84</td>
<td style="text-align: right;">5.17</td>
<td style="text-align: right;">4.00</td>
<td style="text-align: right;"><strong>1.094</strong></td>
</tr>
<tr>
<td style="text-align: right;">2</td>
<td>FE-2 Order screening and validation</td>
<td style="text-align: right;">7.45</td>
<td style="text-align: right;">5.17</td>
<td style="text-align: right;">4.00</td>
<td style="text-align: right;"><strong>1.039</strong></td>
</tr>
<tr>
<td style="text-align: right;">3</td>
<td>FE-6 Pick wave generation and release</td>
<td style="text-align: right;">6.67</td>
<td style="text-align: right;">5.17</td>
<td style="text-align: right;">4.00</td>
<td style="text-align: right;"><strong>0.929</strong></td>
</tr>
<tr>
<td style="text-align: right;">4</td>
<td>FE-12 Order cancellation and modification</td>
<td style="text-align: right;">6.67</td>
<td style="text-align: right;">5.17</td>
<td style="text-align: right;">6.00</td>
<td style="text-align: right;"><strong>0.816</strong></td>
</tr>
<tr>
<td style="text-align: right;">5</td>
<td>FE-11 Fulfillment exception management</td>
<td style="text-align: right;">7.45</td>
<td style="text-align: right;">6.90</td>
<td style="text-align: right;">6.00</td>
<td style="text-align: right;"><strong>0.753</strong></td>
</tr>
<tr>
<td style="text-align: right;">6</td>
<td>FE-3 Real-time inventory and ATP</td>
<td style="text-align: right;">10.59</td>
<td style="text-align: right;">10.34</td>
<td style="text-align: right;">10.00</td>
<td style="text-align: right;"><strong>0.690</strong></td>
</tr>
<tr>
<td style="text-align: right;">7</td>
<td>FE-7 Scan-verified pick and pack</td>
<td style="text-align: right;">8.63</td>
<td style="text-align: right;">8.62</td>
<td style="text-align: right;">8.00</td>
<td style="text-align: right;"><strong>0.684</strong></td>
</tr>
<tr>
<td style="text-align: right;">8</td>
<td>FE-4 Channel stock synchronization</td>
<td style="text-align: right;">9.41</td>
<td style="text-align: right;">8.62</td>
<td style="text-align: right;">12.00</td>
<td style="text-align: right;"><strong>0.644</strong></td>
</tr>
<tr>
<td style="text-align: right;">9</td>
<td>FE-9 Carrier tracking event ingestion</td>
<td style="text-align: right;">8.24</td>
<td style="text-align: right;">6.90</td>
<td style="text-align: right;">12.00</td>
<td style="text-align: right;"><strong>0.639</strong></td>
</tr>
<tr>
<td style="text-align: right;">10</td>
<td>FE-5 Automated routing and splitting</td>
<td style="text-align: right;">9.80</td>
<td style="text-align: right;">12.07</td>
<td style="text-align: right;">10.00</td>
<td style="text-align: right;"><strong>0.574</strong></td>
</tr>
<tr>
<td style="text-align: right;">11</td>
<td>FE-14 Dashboard and cost reconciliation</td>
<td style="text-align: right;">5.10</td>
<td style="text-align: right;">6.90</td>
<td style="text-align: right;">4.00</td>
<td style="text-align: right;"><strong>0.573</strong></td>
</tr>
<tr>
<td style="text-align: right;">12</td>
<td>FE-8 Carrier rate shopping and label purchase</td>
<td style="text-align: right;">7.45</td>
<td style="text-align: right;">10.34</td>
<td style="text-align: right;">14.00</td>
<td style="text-align: right;"><strong>0.430</strong></td>
</tr>
<tr>
<td style="text-align: right;">13</td>
<td>FE-13 Returns and restocking</td>
<td style="text-align: right;">4.71</td>
<td style="text-align: right;">8.62</td>
<td style="text-align: right;">6.00</td>
<td style="text-align: right;"><strong>0.405</strong></td>
</tr>
</tbody>
</table>
<h3>5. Reconciling the ranking with the release plan — the important part</h3>
<p><strong>The ranking and the release plan disagree, and the release plan is right.</strong></p>
<p>Release 1.0 ships FE-2, FE-3, FE-4, FE-5, FE-6, FE-7 and FE-12. Three of those —
FE-3, FE-4 and FE-5 — sit at ranks 6, 8 and 10. Meanwhile FE-10, which the model ranks
<strong>first</strong>, is deferred to Release 1.2.</p>
<p>This is not an error in the model and not an error in the plan. It is the model working
as designed and then being overruled for a reason the model cannot see:</p>
<ul>
<li>
<p><strong>The model rewards cheap, safe, useful features.</strong> FE-10 is genuinely cheap, safe
  and useful, which is why it wins. FE-5 is expensive and complex, which is why it loses.</p>
</li>
<li>
<p><strong>The model has no concept of dependency or sequencing.</strong> FE-10 shows customers their
  order status. Showing a customer a status that is wrong — because stock was oversold
  (FE-3) and the order is about to be cancelled — is worse than showing them nothing.
  FE-10 delivers its value only <em>after</em> status is trustworthy.</p>
</li>
<li>
<p><strong>The model has no concept of the business case.</strong> BO-1 and BO-2 are what the COO
  funded. FE-3, FE-4 and FE-5 are the only features that deliver them.</p>
</li>
</ul>
<p><strong>Decision:</strong> the release plan in Vision &amp; Scope §2.2 stands. The worksheet is used for
two things instead — sequencing <strong>within</strong> a release, and deciding what to drop if the
release runs late. On that second question the model is directly useful: if Release 1.0
must shed scope, <strong>FE-6 and FE-12 go last</strong> (ranks 3 and 4, cheap and low risk, so
keeping them costs little), and <strong>FE-7 is the first candidate to defer</strong> (rank 7, the
most expensive thing in 1.0 that is not FE-3 or FE-5, and the warehouse can continue
with printed slips for one more release).</p>
<div class="callout">
<p>A prioritization worksheet whose output is simply obeyed is a worksheet nobody
thought about. Its value is that it forces the disagreement into the open and makes
someone state a reason.</p>
</div>
<h3>6. Sensitivity</h3>
<p>Two ratings were tested for their effect on the ranking:</p>
<table>
<thead>
<tr>
<th>Change</th>
<th>Effect</th>
</tr>
</thead>
<tbody>
<tr>
<td>Risk weight raised from 0.5 to 1.0</td>
<td>FE-8 falls from rank 12 to last, FE-4 and FE-9 each fall two places. No change to the top four. The conclusion in §5 is unaffected.</td>
</tr>
<tr>
<td>FE-3 benefit lowered from 9 to 7</td>
<td>FE-3 falls from rank 6 to rank 9. Still mid-table — confirming that FE-3's position is driven by its <em>cost</em>, not its rating, and that no plausible rating makes the model agree with the release plan.</td>
</tr>
</tbody>
</table>
<p>The second test is the more important one. It shows the disagreement in §5 is
structural, not an artefact of one generous rating.</p></div>
<div class="ml-vi"><h2>Xếp ưu tiên yêu cầu — Phân tích</h2>
<h2>cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên thành viên 5&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Nova Retail Group (NRG)
17 tháng 9 năm 2026</p>
<div class="callout">
<p>Bảng tính nằm ở <code>deliverables/07-Requirements-Prioritization.xlsx</code>, dựng trên template
chương 16 của Wiegers &amp; Beatty và giữ nguyên công thức. Tài liệu này giải thích đầu
vào, và giải thích đầu ra có nghĩa gì — cũng như không có nghĩa gì.</p>
</div>
<hr />
<h3>1. Mô hình</h3>
<p>Mỗi tính năng ứng viên được chấm 1–9 trên bốn chiều, và bảng tính tính ra:</p>
<p><code>Total Value = Benefit × w_benefit + Penalty × w_penalty
Priority    = Value %  ÷  ( Cost % × w_cost  +  Risk % × w_risk )</code></p>
<p><strong>Benefit</strong> và <strong>Penalty</strong> là hai câu hỏi khác nhau, và cả hai đều được hỏi một cách có
chủ ý. Benefit là giá trị khi tính năng có mặt; penalty là thiệt hại khi nó vắng mặt. Một
tính năng có thể điểm benefit thấp mà penalty cao — FE-12 (huỷ đơn) đúng là như vậy:
chẳng ai thích thú gì với nó, nhưng thiếu nó thì tồn kho đã giữ cứ bị khoá lại và vấn đề
bán vượt tồn quay lại dưới một hình dạng khác.</p>
<h3>2. Trọng số, và vì sao</h3>
<table>
<thead>
<tr>
<th>Chiều</th>
<th>Trọng số</th>
<th>Biện minh</th>
</tr>
</thead>
<tbody>
<tr>
<td>Benefit</td>
<td><strong>2</strong></td>
<td>Bài toán kinh doanh của COO dựa trên việc gỡ bỏ nút thắt cản trở tăng trưởng. Giá trị tạo ra nặng hơn thiệt hại tránh được.</td>
</tr>
<tr>
<td>Penalty</td>
<td><strong>1</strong></td>
<td>Mốc cơ sở.</td>
</tr>
<tr>
<td>Cost</td>
<td><strong>1</strong></td>
<td>Mốc cơ sở.</td>
</tr>
<tr>
<td>Risk</td>
<td><strong>0,5</strong></td>
<td>Mọi rủi ro kỹ thuật của dự án này đều có biện pháp giảm thiểu được gọi tên ở Vision &amp; Scope §1.6, nên rủi ro là thật nhưng đã được kiểm soát. Đặt trọng số ngang chi phí sẽ phạt quá tay hai tính năng nặng về tích hợp, mà chúng lại chính là những cái mang lại mục tiêu BO-5.</td>
</tr>
</tbody>
</table>
<h3>3. Những mục bị loại khỏi phần chấm điểm</h3>
<p>Wiegers nói rõ rằng các tính năng bắt buộc phải có — vì lý do chính trị, hợp đồng hay
quy định — thì không nên chấm điểm, bởi xếp hạng một thứ không thể bỏ sẽ cho ra một con
số vô nghĩa. Các mục bị loại (xem sheet <em>Must-do (not scored)</em>):</p>
<table>
<thead>
<tr>
<th>Mục</th>
<th>Vì sao không đánh đổi được</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>FE-1</strong> Nhận đơn từ nhiều kênh</td>
<td>Không thứ gì khác trong OMFS chạy được nếu không có bản ghi đơn hàng</td>
</tr>
<tr>
<td><strong>CO-1</strong> Nhà cung cấp định danh của tập đoàn</td>
<td>Chính sách an ninh của tập đoàn</td>
</tr>
<tr>
<td><strong>CO-5</strong> Không lưu dữ liệu thẻ thanh toán</td>
<td>Giữ cho OMFS nằm ngoài phạm vi PCI</td>
</tr>
<tr>
<td><strong>OR-1</strong> Lưu trữ và xoá dữ liệu cá nhân</td>
<td>Nghị định 13/2023/NĐ-CP</td>
</tr>
</tbody>
</table>
<p>Còn lại mười ba tính năng, được chấm trong một lượt duy nhất — điều này quan trọng vì mọi
phần trăm trong bảng tính đều là tỉ lệ trên tổng của cột.</p>
<h3>4. Kết quả</h3>
<table>
<thead>
<tr>
<th style="text-align: right;">Hạng</th>
<th>Tính năng</th>
<th style="text-align: right;">Value %</th>
<th style="text-align: right;">Cost %</th>
<th style="text-align: right;">Risk %</th>
<th style="text-align: right;"><strong>Priority</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: right;">1</td>
<td>FE-10 Thông báo cho khách và trang tự tra cứu</td>
<td style="text-align: right;">7,84</td>
<td style="text-align: right;">5,17</td>
<td style="text-align: right;">4,00</td>
<td style="text-align: right;"><strong>1,094</strong></td>
</tr>
<tr>
<td style="text-align: right;">2</td>
<td>FE-2 Sàng lọc và kiểm tính hợp lệ của đơn</td>
<td style="text-align: right;">7,45</td>
<td style="text-align: right;">5,17</td>
<td style="text-align: right;">4,00</td>
<td style="text-align: right;"><strong>1,039</strong></td>
</tr>
<tr>
<td style="text-align: right;">3</td>
<td>FE-6 Sinh và phát đợt nhặt hàng</td>
<td style="text-align: right;">6,67</td>
<td style="text-align: right;">5,17</td>
<td style="text-align: right;">4,00</td>
<td style="text-align: right;"><strong>0,929</strong></td>
</tr>
<tr>
<td style="text-align: right;">4</td>
<td>FE-12 Huỷ và sửa đơn hàng</td>
<td style="text-align: right;">6,67</td>
<td style="text-align: right;">5,17</td>
<td style="text-align: right;">6,00</td>
<td style="text-align: right;"><strong>0,816</strong></td>
</tr>
<tr>
<td style="text-align: right;">5</td>
<td>FE-11 Quản lý ngoại lệ hoàn tất đơn</td>
<td style="text-align: right;">7,45</td>
<td style="text-align: right;">6,90</td>
<td style="text-align: right;">6,00</td>
<td style="text-align: right;"><strong>0,753</strong></td>
</tr>
<tr>
<td style="text-align: right;">6</td>
<td>FE-3 Tồn kho thời gian thực và ATP</td>
<td style="text-align: right;">10,59</td>
<td style="text-align: right;">10,34</td>
<td style="text-align: right;">10,00</td>
<td style="text-align: right;"><strong>0,690</strong></td>
</tr>
<tr>
<td style="text-align: right;">7</td>
<td>FE-7 Nhặt và đóng gói có quét xác nhận</td>
<td style="text-align: right;">8,63</td>
<td style="text-align: right;">8,62</td>
<td style="text-align: right;">8,00</td>
<td style="text-align: right;"><strong>0,684</strong></td>
</tr>
<tr>
<td style="text-align: right;">8</td>
<td>FE-4 Đồng bộ tồn kho ra các kênh</td>
<td style="text-align: right;">9,41</td>
<td style="text-align: right;">8,62</td>
<td style="text-align: right;">12,00</td>
<td style="text-align: right;"><strong>0,644</strong></td>
</tr>
<tr>
<td style="text-align: right;">9</td>
<td>FE-9 Nhận sự kiện theo dõi từ hãng vận chuyển</td>
<td style="text-align: right;">8,24</td>
<td style="text-align: right;">6,90</td>
<td style="text-align: right;">12,00</td>
<td style="text-align: right;"><strong>0,639</strong></td>
</tr>
<tr>
<td style="text-align: right;">10</td>
<td>FE-5 Định tuyến và tách đơn tự động</td>
<td style="text-align: right;">9,80</td>
<td style="text-align: right;">12,07</td>
<td style="text-align: right;">10,00</td>
<td style="text-align: right;"><strong>0,574</strong></td>
</tr>
<tr>
<td style="text-align: right;">11</td>
<td>FE-14 Bảng điều khiển và đối soát chi phí</td>
<td style="text-align: right;">5,10</td>
<td style="text-align: right;">6,90</td>
<td style="text-align: right;">4,00</td>
<td style="text-align: right;"><strong>0,573</strong></td>
</tr>
<tr>
<td style="text-align: right;">12</td>
<td>FE-8 So giá vận chuyển và mua nhãn</td>
<td style="text-align: right;">7,45</td>
<td style="text-align: right;">10,34</td>
<td style="text-align: right;">14,00</td>
<td style="text-align: right;"><strong>0,430</strong></td>
</tr>
<tr>
<td style="text-align: right;">13</td>
<td>FE-13 Trả hàng và nhập lại kho</td>
<td style="text-align: right;">4,71</td>
<td style="text-align: right;">8,62</td>
<td style="text-align: right;">6,00</td>
<td style="text-align: right;"><strong>0,405</strong></td>
</tr>
</tbody>
</table>
<h3>5. Đối chiếu thứ hạng với kế hoạch phát hành — phần quan trọng nhất</h3>
<p><strong>Thứ hạng và kế hoạch phát hành mâu thuẫn nhau, và kế hoạch phát hành mới là cái đúng.</strong></p>
<p>Bản 1.0 giao FE-2, FE-3, FE-4, FE-5, FE-6, FE-7 và FE-12. Ba trong số đó — FE-3, FE-4 và
FE-5 — nằm ở hạng 6, 8 và 10. Trong khi đó FE-10, cái mà mô hình xếp <strong>hạng nhất</strong>, lại
bị hoãn sang bản 1.2.</p>
<p>Đây không phải lỗi của mô hình, cũng không phải lỗi của kế hoạch. Đây là mô hình chạy
đúng như thiết kế, rồi bị bác vì một lý do mà mô hình không nhìn thấy được:</p>
<ul>
<li>
<p><strong>Mô hình thưởng cho các tính năng rẻ, an toàn, hữu ích.</strong> FE-10 thật sự rẻ, an toàn
  và hữu ích, nên nó thắng. FE-5 đắt và phức tạp, nên nó thua.</p>
</li>
<li>
<p><strong>Mô hình không có khái niệm về phụ thuộc hay thứ tự.</strong> FE-10 cho khách xem trạng thái
  đơn hàng. Cho khách xem một trạng thái sai — vì hàng đã bị bán vượt tồn (FE-3) và đơn
  sắp bị huỷ — còn tệ hơn là không cho xem gì. FE-10 chỉ mang lại giá trị <em>sau khi</em> trạng
  thái trở nên đáng tin.</p>
</li>
<li>
<p><strong>Mô hình không có khái niệm về bài toán kinh doanh.</strong> BO-1 và BO-2 mới là thứ COO bỏ
  tiền ra mua. FE-3, FE-4 và FE-5 là những tính năng duy nhất mang lại chúng.</p>
</li>
</ul>
<p><strong>Quyết định:</strong> kế hoạch phát hành ở Vision &amp; Scope §2.2 giữ nguyên. Bảng tính được dùng
cho hai việc khác — xếp thứ tự <strong>bên trong</strong> một bản phát hành, và quyết định bỏ cái gì
nếu bản phát hành bị trễ. Với câu hỏi thứ hai thì mô hình hữu dụng trực tiếp: nếu bản 1.0
buộc phải cắt phạm vi, <strong>FE-6 và FE-12 bỏ sau cùng</strong> (hạng 3 và 4, rẻ và ít rủi ro, nên
giữ chúng tốn rất ít), và <strong>FE-7 là ứng viên đầu tiên để hoãn</strong> (hạng 7, thứ đắt nhất
trong bản 1.0 mà không phải FE-3 hay FE-5, và kho vẫn có thể dùng phiếu in thêm một bản
phát hành nữa).</p>
<div class="callout">
<p>Một bảng xếp ưu tiên mà đầu ra chỉ để tuân theo là một bảng chưa ai suy nghĩ về nó. Giá
trị của nó là ép bất đồng lộ ra và buộc ai đó phải nêu một lý do.</p>
</div>
<h3>6. Độ nhạy</h3>
<p>Hai mức chấm đã được thử để xem ảnh hưởng tới thứ hạng:</p>
<table>
<thead>
<tr>
<th>Thay đổi</th>
<th>Ảnh hưởng</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nâng trọng số rủi ro từ 0,5 lên 1,0</td>
<td>FE-8 rơi từ hạng 12 xuống cuối bảng, FE-4 và FE-9 mỗi cái tụt hai bậc. Bốn vị trí đầu không đổi. Kết luận ở §5 không bị ảnh hưởng.</td>
</tr>
<tr>
<td>Hạ benefit của FE-3 từ 9 xuống 7</td>
<td>FE-3 rơi từ hạng 6 xuống hạng 9. Vẫn ở giữa bảng — xác nhận rằng vị trí của FE-3 bị chi phối bởi <em>chi phí</em> của nó chứ không phải mức chấm, và không có mức chấm hợp lý nào khiến mô hình đồng ý với kế hoạch phát hành.</td>
</tr>
</tbody>
</table>
<p>Phép thử thứ hai mới là cái quan trọng hơn. Nó cho thấy bất đồng ở §5 mang tính cấu trúc,
không phải hệ quả của một lần chấm điểm rộng tay.</p></div>`,
  ].join('\n'),
};

const TP2L8 = {
  title: "W2.8 — Deliverable 8: BA budget and headcount, three ways|||W2.8 — Deliverable 8: ngân sách và số BA, ba cách tính",
  slug: "swr302-tp2-goi-08-estimation",
  type: 'DOCUMENT',
  description: "Công cụ ước lượng Chapter 19 với đầu vào lấy từ chính tài liệu của nhóm, ba phương pháp cho ba đáp số (2,25 / 2,00 / 1,71 BA), lý do phương pháp theo hoạt động lại thấp nhất, con số được cam kết, và điều gì sẽ khiến đổi ý.",
  content: [
    bi(
      `<span class="eyebrow">Worked package · TP2 · Deliverable 8</span>
<h2>Three answers, and the one that was committed to</h2>
<p class="lead">The tool estimates the number of BAs and the BA budget three independent ways. They disagree — and the disagreement <em>is</em> the deliverable. Reporting three numbers without explaining the gap is filling in a spreadsheet, not estimating.</p>
<table>
<thead><tr><th>Method</th><th>BAs</th><th>Requirements-phase budget</th></tr></thead>
<tbody>
<tr><td>A — 15% of total project budget</td><td>2.25</td><td>USD 180,000</td></tr>
<tr><td>B — 6 developers per BA</td><td>2.00</td><td>USD 160,000</td></tr>
<tr><td>C — Activity-based, 1,097 hours</td><td><strong>1.71</strong></td><td>USD 137,000</td></tr>
</tbody>
</table>
<p><strong>The surprise worth explaining:</strong> method C came out <em>lowest</em>, not highest. OMFS has modest artifact counts — 14 use cases, 20 screens — but twelve interfacing systems, and the activity model prices use cases and screens heavily while pricing conversations not at all. It contains no line for the four elicitation sessions, the peer inspections or the change control that runs to release.</p>
<div class="callout ok"><strong>The commitment, and the trigger.</strong> Two BAs at USD 160,000 — rounding C up to absorb the work it does not price. Then, stated in advance: escalate to 2.25 if three or more TBD items are still open at Week 10. Saying what would change your mind <em>before</em> it happens is the difference between an estimate and a guess.</div>
<div class="pitfall"><strong>§5 exposes what method A actually measures.</strong> At a local blended rate of USD 45/hour instead of the tool's USD 125, method A jumps from 2.25 BAs to 6.25 while B and C do not move at all. Method A measures how many analyst-hours 15% of the budget happens to buy — not how much analysis the project needs.</div>`,
      `<span class="eyebrow">Bộ tài liệu mẫu · TP2 · Deliverable 8</span>
<h2>Ba đáp số, và cái được cam kết</h2>
<p class="lead">Công cụ ước tính số BA và ngân sách BA bằng ba cách độc lập. Chúng không khớp nhau — và chính sự không khớp đó <em>là</em> phần bài làm. Báo ba con số mà không giải thích khoảng chênh là điền bảng tính, không phải ước lượng.</p>
<table>
<thead><tr><th>Cách</th><th>Số BA</th><th>Ngân sách giai đoạn yêu cầu</th></tr></thead>
<tbody>
<tr><td>A — 15% tổng ngân sách dự án</td><td>2,25</td><td>180.000 USD</td></tr>
<tr><td>B — 6 lập trình viên một BA</td><td>2,00</td><td>160.000 USD</td></tr>
<tr><td>C — Theo hoạt động, 1.097 giờ</td><td><strong>1,71</strong></td><td>137.000 USD</td></tr>
</tbody>
</table>
<p><strong>Điều bất ngờ đáng giải thích:</strong> cách C ra <em>thấp nhất</em>, không phải cao nhất. OMFS có số sản phẩm khiêm tốn — 14 use case, 20 màn hình — nhưng tới mười hai hệ thống giao tiếp, mà mô hình hoạt động định giá use case và màn hình rất nặng còn các cuộc trao đổi thì không tính đồng nào. Nó không có dòng nào cho bốn buổi elicitation, các lượt review chéo hay việc kiểm soát thay đổi chạy tới lúc phát hành.</p>
<div class="callout ok"><strong>Cam kết, và cái ngưỡng kích hoạt.</strong> Hai BA với 160.000 USD — làm tròn C lên để hấp thụ phần việc nó không định giá. Rồi nói trước: nâng lên 2,25 nếu tới tuần 10 danh sách TBD vẫn còn từ ba mục trở lên. Nói ra điều gì sẽ khiến mình đổi ý <em>trước khi</em> nó xảy ra chính là khác biệt giữa một ước lượng và một phỏng đoán.</div>
<div class="pitfall"><strong>§5 phơi ra thứ mà cách A thật sự đo.</strong> Với giá BA nội địa 45 USD/giờ thay vì 125 USD của công cụ, cách A nhảy từ 2,25 BA lên 6,25 trong khi B và C không nhúc nhích. Cách A đo xem 15% ngân sách mua được bao nhiêu giờ công analyst — chứ không đo dự án cần bao nhiêu phân tích.</div>`,
    ),
    `<div class="ml-en"><h2>Requirement Estimation — BA budget and number of BAs</h2>
<h2>for the Order Management and Fulfillment System (OMFS)</h2>
<p>Version 1.0 approved
Prepared by <strong>&lt;Member 5 name&gt;</strong>, Business Analysis Team — Group &lt;N&gt;
Nova Retail Group (NRG)
17 September 2026</p>
<div class="callout">
<p>The tool itself is <code>deliverables/08-Requirements-Estimation.xlsx</code>, the Chapter 19
Requirements Estimation Tool by Wiegers &amp; Beatty with its formulas unchanged. Only
the yellow input cells were filled; every yellow cell carries a comment naming where
its value came from.</p>
</div>
<hr />
<h3>1. Inputs, and where each number came from</h3>
<p><strong>These counts are taken from our own deliverables, not estimated.</strong> A count that
disagrees with the documents it claims to describe invalidates everything downstream.</p>
<table>
<thead>
<tr>
<th>Input</th>
<th>Value</th>
<th>Source</th>
</tr>
</thead>
<tbody>
<tr>
<td>Existing pages of documentation for review</td>
<td>40</td>
<td>Legacy inventory spreadsheet documentation, 4 carrier portal guides, current-state process notes</td>
</tr>
<tr>
<td>Existing systems being updated or replaced</td>
<td>1</td>
<td>The manual fulfillment process — spreadsheet, printed slips, carrier portals</td>
</tr>
<tr>
<td>Stakeholders</td>
<td>16</td>
<td>COO, 3 Fulfillment Managers, 3 Inventory Controllers, 2 Logistics, 5 Brand Managers, 2 System Administrators</td>
</tr>
<tr>
<td>Interfacing systems — small</td>
<td>3</td>
<td>Payment gateway, notification service, identity provider (SRS §5.2)</td>
</tr>
<tr>
<td>Interfacing systems — medium</td>
<td>8</td>
<td>4 sales channels + 4 3PL carriers (SRS SI-1 … SI-7)</td>
</tr>
<tr>
<td>Interfacing systems — large</td>
<td>1</td>
<td>ERP / accounting (SRS SI-8)</td>
</tr>
<tr>
<td><strong>Process flows and/or use cases</strong></td>
<td><strong>14</strong></td>
<td><strong>Counted from Deliverable 2 — UC-01 … UC-14</strong></td>
</tr>
<tr>
<td>Business data diagrams</td>
<td>2</td>
<td>Context diagram + logical data model (SRS Appendix B)</td>
</tr>
<tr>
<td><strong>Screens / user interfaces</strong></td>
<td><strong>20</strong></td>
<td>Handheld 6 + manager 7 + agent 4 + customer 3 — SRS §5.1 and Deliverable 6</td>
</tr>
<tr>
<td><strong>Reports</strong></td>
<td><strong>7</strong></td>
<td><strong>RPT-1 … RPT-7, counted from SRS §4.3</strong></td>
</tr>
<tr>
<td>Total project budget</td>
<td>USD 1,200,000</td>
<td>Vision &amp; Scope §3.2, Cost constraint</td>
</tr>
<tr>
<td>BA blended hourly cost</td>
<td>USD 125</td>
<td>The tool's default, retained — see §4</td>
</tr>
<tr>
<td>Type of project</td>
<td>Standard</td>
<td>Custom build, not a packaged/COTS implementation</td>
</tr>
<tr>
<td>Number of developers</td>
<td>12</td>
<td>Vision &amp; Scope §3.2, Staff constraint</td>
</tr>
<tr>
<td>Is your team remote?</td>
<td>Yes</td>
<td>Team split between HCMC and Hanoi → the tool adds a 10% buffer</td>
</tr>
<tr>
<td>Project duration</td>
<td>44 weeks</td>
<td>Release 1.0 must land before the 11.11 campaign</td>
</tr>
<tr>
<td>Requirements work duration</td>
<td>16 weeks</td>
<td>Weeks 1–16</td>
</tr>
</tbody>
</table>
<h3>2. Three answers</h3>
<p>The tool estimates the same two numbers three independent ways. They do not agree,
and the disagreement is the useful part.</p>
<table>
<thead>
<tr>
<th>Method</th>
<th style="text-align: right;">Number of BAs</th>
<th style="text-align: right;">BA budget — requirements phase</th>
<th style="text-align: right;">BA budget — whole project</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>A</strong> — 15% of total project budget</td>
<td style="text-align: right;"><strong>2.25</strong></td>
<td style="text-align: right;">USD 180,000</td>
<td style="text-align: right;">USD 495,000</td>
</tr>
<tr>
<td><strong>B</strong> — 6 developers per BA (Standard)</td>
<td style="text-align: right;"><strong>2.00</strong></td>
<td style="text-align: right;">USD 160,000</td>
<td style="text-align: right;">USD 440,000</td>
</tr>
<tr>
<td><strong>C</strong> — Activity-based, +10% remote buffer</td>
<td style="text-align: right;"><strong>1.71</strong></td>
<td style="text-align: right;">USD 137,000</td>
<td style="text-align: right;">USD 377,000</td>
</tr>
</tbody>
</table>
<h3>Where method C's hours come from</h3>
<table>
<thead>
<tr>
<th>Category</th>
<th style="text-align: right;">Hours</th>
</tr>
</thead>
<tbody>
<tr>
<td>Project start and management</td>
<td style="text-align: right;">140.6</td>
</tr>
<tr>
<td>Model requirements — people (use cases, user stories, org charts)</td>
<td style="text-align: right;">360.0</td>
</tr>
<tr>
<td>Model requirements — system (context, interface models, display-action-response)</td>
<td style="text-align: right;">300.8</td>
</tr>
<tr>
<td>Model requirements — data (data diagrams, data dictionaries, report tables)</td>
<td style="text-align: right;">195.5</td>
</tr>
<tr>
<td><strong>Requirements work total</strong></td>
<td style="text-align: right;"><strong>997.0</strong></td>
</tr>
<tr>
<td>Remote team buffer (+10%)</td>
<td style="text-align: right;">99.7</td>
</tr>
<tr>
<td><strong>Total</strong></td>
<td style="text-align: right;"><strong>1,096.7</strong></td>
</tr>
</tbody>
</table>
<p>1,096.7 hours ÷ 40 hours ÷ 16 weeks = <strong>1.71 BAs</strong>.</p>
<h3>3. Reading the spread — why C is the lowest</h3>
<p>The most common expectation is that the activity-based method comes out <strong>highest</strong>,
because it counts real artifacts one by one. Here it comes out <strong>lowest</strong>, and the
reason is worth stating precisely:</p>
<ul>
<li>
<p><strong>OMFS is a small-artifact, high-integration system.</strong> Only 14 use cases and 20
  screens — modest counts that the activity model prices cheaply — but <strong>12 interfacing
  systems</strong>, which is a large number for a project this size. Integration analysis is
  concentrated in the 300.8 hours of system modelling; it does not scale with the use
  case count that dominates the model elsewhere.</p>
</li>
<li>
<p><strong>The activity model prices artifacts, not conversations.</strong> It includes project
  kick-off, status reporting and traceability links, but it does not price the four
  elicitation sessions, the requirements inspections recommended in Chapter 17, or the
  change control that will run from the Week-8 baseline through to release.</p>
</li>
<li>
<p><strong>Methods A and B are insensitive to what the system actually is.</strong> Method A is a
  function of the budget alone; method B is a function of the developer count alone.
  Neither has looked at OMFS. That they land near each other is coincidence, not
  corroboration.</p>
</li>
</ul>
<h3>4. What we commit to, and what would change it</h3>
<div class="callout">
<p><strong>We staff 2 BAs for the 16-week requirements phase, at a budget of USD 160,000.</strong></p>
</div>
<p><strong>Why 2 and not 1.71.</strong> Method C is the most grounded of the three, but it prices only
the artifacts we listed. The elicitation sessions, the peer inspections and the change
control from Week 8 onward are real work that its model does not contain. Rounding
1.71 up to 2 absorbs that, and it happens to coincide with method B — which is
reassurance, not proof.</p>
<p><strong>Why not 2.25.</strong> Method A's figure is the upper bound, derived from a 15% rule of
thumb that has not looked at this system at all. Committing to it would mean funding a
third of a BA on the strength of an industry average.</p>
<p><strong>What would change our mind — stated in advance:</strong></p>
<table>
<thead>
<tr>
<th>Trigger</th>
<th>Revised commitment</th>
</tr>
</thead>
<tbody>
<tr>
<td>The TBD list in SRS Appendix C still has 3 or more open items at Week 10</td>
<td>Escalate to 2.25 BAs; unresolved requirements consume analyst time at an accelerating rate</td>
</tr>
<tr>
<td>Lazada and TikTok Shop are pulled forward from Release 1.1 into 1.0</td>
<td>Escalate to 2.5 BAs; that adds 2 medium interfacing systems and roughly 60 hours of interface modelling</td>
</tr>
<tr>
<td>Release 1.0 scope is cut to storefront only</td>
<td>Reduce to 1.5 BAs</td>
</tr>
<tr>
<td>Requirements phase is compressed from 16 weeks to 12</td>
<td>Escalate to 2.5 BAs — the work does not shrink with the calendar</td>
</tr>
</tbody>
</table>
<p><strong>BA cost for the whole project, not just the requirements phase:</strong> USD 440,000 at 2
BAs across 44 weeks. This is the honest number to quote to the sponsor. Analysts do not
stop when the SRS is baselined — they answer questions, run change control and maintain
traceability until release, which is exactly what methods A, B and C all price in their
third row.</p>
<h3>5. Sensitivity: the hourly rate</h3>
<p>The USD 125 blended rate is the tool's default, carried over from the book's US
context. At a Vietnamese blended BA rate of roughly USD 45/hour:</p>
<table>
<thead>
<tr>
<th>Method</th>
<th style="text-align: right;">BAs at USD 125/h</th>
<th style="text-align: right;">BAs at USD 45/h</th>
</tr>
</thead>
<tbody>
<tr>
<td>A — 15% of budget</td>
<td style="text-align: right;">2.25</td>
<td style="text-align: right;"><strong>6.25</strong></td>
</tr>
<tr>
<td>B — developer ratio</td>
<td style="text-align: right;">2.00</td>
<td style="text-align: right;">2.00</td>
</tr>
<tr>
<td>C — activity-based</td>
<td style="text-align: right;">1.71</td>
<td style="text-align: right;">1.71</td>
</tr>
</tbody>
</table>
<p><strong>Method A is the only one that moves, and it moves a long way.</strong> This exposes what
method A actually measures: not how much analysis the project needs, but how many
analyst-hours 15% of the budget happens to buy. At local rates it buys far more hours
than the work requires. We therefore treat method A as an upper bound on <em>affordable</em>
effort, never as an estimate of <em>necessary</em> effort — and this is the strongest reason
for preferring method C's grounding over method A's arithmetic.</p></div>
<div class="ml-vi"><h2>Ước lượng yêu cầu — Ngân sách BA và số lượng BA</h2>
<h2>cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)</h2>
<p>Phiên bản 1.0 đã duyệt
Người soạn: <strong>&lt;Tên thành viên 5&gt;</strong>, Nhóm Phân tích nghiệp vụ — Nhóm &lt;N&gt;
Nova Retail Group (NRG)
17 tháng 9 năm 2026</p>
<div class="callout">
<p>Công cụ là <code>deliverables/08-Requirements-Estimation.xlsx</code>, chính là Requirements
Estimation Tool ở chương 19 của Wiegers &amp; Beatty, giữ nguyên công thức. Chỉ các ô nhập
màu vàng được điền; mỗi ô vàng đều có một chú thích ghi rõ giá trị lấy từ đâu.</p>
</div>
<hr />
<h3>1. Đầu vào, và từng con số lấy từ đâu</h3>
<p><strong>Những con số đếm này lấy từ chính các deliverable của nhóm, không phải ước chừng.</strong> Một
con số mâu thuẫn với tài liệu mà nó tự nhận là đang mô tả sẽ làm hỏng toàn bộ phần phía
sau.</p>
<table>
<thead>
<tr>
<th>Đầu vào</th>
<th>Giá trị</th>
<th>Nguồn</th>
</tr>
</thead>
<tbody>
<tr>
<td>Số trang tài liệu hiện có phải đọc rà</td>
<td>40</td>
<td>Tài liệu bảng tính tồn kho cũ, 4 hướng dẫn cổng hãng vận chuyển, ghi chép quy trình hiện trạng</td>
</tr>
<tr>
<td>Số hệ thống đang có bị nâng cấp hoặc thay thế</td>
<td>1</td>
<td>Quy trình hoàn tất đơn thủ công — bảng tính, phiếu in, cổng hãng vận chuyển</td>
</tr>
<tr>
<td>Bên liên quan</td>
<td>16</td>
<td>COO, 3 Quản lý hoàn tất đơn, 3 Kiểm soát tồn kho, 2 Logistics, 5 Quản lý nhãn hàng, 2 Quản trị hệ thống</td>
</tr>
<tr>
<td>Hệ thống giao tiếp — nhỏ</td>
<td>3</td>
<td>Cổng thanh toán, dịch vụ thông báo, nhà cung cấp định danh (SRS §5.2)</td>
</tr>
<tr>
<td>Hệ thống giao tiếp — vừa</td>
<td>8</td>
<td>4 kênh bán + 4 hãng 3PL (SRS SI-1 … SI-7)</td>
</tr>
<tr>
<td>Hệ thống giao tiếp — lớn</td>
<td>1</td>
<td>ERP / kế toán (SRS SI-8)</td>
</tr>
<tr>
<td><strong>Luồng quy trình và/hoặc use case</strong></td>
<td><strong>14</strong></td>
<td><strong>Đếm từ Deliverable 2 — UC-01 … UC-14</strong></td>
</tr>
<tr>
<td>Sơ đồ dữ liệu nghiệp vụ</td>
<td>2</td>
<td>Context diagram + mô hình dữ liệu logic (SRS Phụ lục B)</td>
</tr>
<tr>
<td><strong>Màn hình / giao diện người dùng</strong></td>
<td><strong>20</strong></td>
<td>Máy cầm tay 6 + quản lý 7 + nhân viên CSKH 4 + khách hàng 3 — SRS §5.1 và Deliverable 6</td>
</tr>
<tr>
<td><strong>Báo cáo</strong></td>
<td><strong>7</strong></td>
<td><strong>RPT-1 … RPT-7, đếm từ SRS §4.3</strong></td>
</tr>
<tr>
<td>Tổng ngân sách dự án</td>
<td>1.200.000 USD</td>
<td>Vision &amp; Scope §3.2, ràng buộc chi phí</td>
</tr>
<tr>
<td>Đơn giá BA bình quân theo giờ</td>
<td>125 USD</td>
<td>Mặc định của công cụ, giữ nguyên — xem §4</td>
</tr>
<tr>
<td>Loại dự án</td>
<td>Standard</td>
<td>Xây riêng, không phải triển khai gói phần mềm có sẵn</td>
</tr>
<tr>
<td>Số lập trình viên</td>
<td>12</td>
<td>Vision &amp; Scope §3.2, ràng buộc nhân sự</td>
</tr>
<tr>
<td>Nhóm có làm từ xa không?</td>
<td>Có</td>
<td>Nhóm chia giữa TP.HCM và Hà Nội → công cụ cộng thêm 10% đệm</td>
</tr>
<tr>
<td>Thời lượng dự án</td>
<td>44 tuần</td>
<td>Bản 1.0 phải kịp trước chiến dịch 11.11</td>
</tr>
<tr>
<td>Thời lượng phần việc yêu cầu</td>
<td>16 tuần</td>
<td>Tuần 1–16</td>
</tr>
</tbody>
</table>
<h3>2. Ba đáp số</h3>
<p>Công cụ ước lượng cùng hai con số đó theo ba cách độc lập. Chúng không đồng ý với nhau,
và chính chỗ bất đồng mới là phần hữu ích.</p>
<table>
<thead>
<tr>
<th>Phương pháp</th>
<th style="text-align: right;">Số BA</th>
<th style="text-align: right;">Ngân sách BA — giai đoạn yêu cầu</th>
<th style="text-align: right;">Ngân sách BA — cả dự án</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>A</strong> — 15% tổng ngân sách dự án</td>
<td style="text-align: right;"><strong>2,25</strong></td>
<td style="text-align: right;">180.000 USD</td>
<td style="text-align: right;">495.000 USD</td>
</tr>
<tr>
<td><strong>B</strong> — 6 lập trình viên trên 1 BA (Standard)</td>
<td style="text-align: right;"><strong>2,00</strong></td>
<td style="text-align: right;">160.000 USD</td>
<td style="text-align: right;">440.000 USD</td>
</tr>
<tr>
<td><strong>C</strong> — Theo hoạt động, +10% đệm làm từ xa</td>
<td style="text-align: right;"><strong>1,71</strong></td>
<td style="text-align: right;">137.000 USD</td>
<td style="text-align: right;">377.000 USD</td>
</tr>
</tbody>
</table>
<h3>Số giờ của phương pháp C đến từ đâu</h3>
<table>
<thead>
<tr>
<th>Hạng mục</th>
<th style="text-align: right;">Số giờ</th>
</tr>
</thead>
<tbody>
<tr>
<td>Khởi động và quản lý dự án</td>
<td style="text-align: right;">140,6</td>
</tr>
<tr>
<td>Mô hình hoá yêu cầu — phần người (use case, user story, sơ đồ tổ chức)</td>
<td style="text-align: right;">360,0</td>
</tr>
<tr>
<td>Mô hình hoá yêu cầu — phần hệ thống (context, mô hình giao tiếp, display-action-response)</td>
<td style="text-align: right;">300,8</td>
</tr>
<tr>
<td>Mô hình hoá yêu cầu — phần dữ liệu (sơ đồ dữ liệu, từ điển dữ liệu, bảng báo cáo)</td>
<td style="text-align: right;">195,5</td>
</tr>
<tr>
<td><strong>Tổng phần việc yêu cầu</strong></td>
<td style="text-align: right;"><strong>997,0</strong></td>
</tr>
<tr>
<td>Đệm cho nhóm làm từ xa (+10%)</td>
<td style="text-align: right;">99,7</td>
</tr>
<tr>
<td><strong>Tổng cộng</strong></td>
<td style="text-align: right;"><strong>1.096,7</strong></td>
</tr>
</tbody>
</table>
<p>1.096,7 giờ ÷ 40 giờ ÷ 16 tuần = <strong>1,71 BA</strong>.</p>
<h3>3. Đọc khoảng chênh lệch — vì sao C thấp nhất</h3>
<p>Kỳ vọng thường gặp nhất là phương pháp theo hoạt động sẽ ra <strong>cao nhất</strong>, vì nó đếm từng
sản phẩm cụ thể. Ở đây nó ra <strong>thấp nhất</strong>, và lý do đáng nói cho thật chính xác:</p>
<ul>
<li>
<p><strong>OMFS là hệ thống ít sản phẩm nhưng nặng tích hợp.</strong> Chỉ 14 use case và 20 màn hình —
  những con số khiêm tốn mà mô hình hoạt động định giá rẻ — nhưng có tới <strong>12 hệ thống
  giao tiếp</strong>, một con số lớn với một dự án cỡ này. Phần phân tích tích hợp dồn vào 300,8
  giờ mô hình hoá hệ thống; nó không tăng theo số use case, mà số use case mới là thứ chi
  phối mô hình ở những chỗ khác.</p>
</li>
<li>
<p><strong>Mô hình hoạt động định giá sản phẩm, không định giá các cuộc trao đổi.</strong> Nó có tính
  buổi khởi động dự án, việc báo cáo tiến độ và các liên kết truy vết, nhưng không định
  giá bốn buổi khai thác yêu cầu, các buổi rà soát yêu cầu mà chương 17 khuyến nghị, hay
  việc kiểm soát thay đổi sẽ chạy từ bản cơ sở tuần 8 cho tới lúc phát hành.</p>
</li>
<li>
<p><strong>Phương pháp A và B không hề nhạy với việc hệ thống thật sự là cái gì.</strong> Phương pháp A
  là hàm của riêng ngân sách; phương pháp B là hàm của riêng số lập trình viên. Không cái
  nào nhìn vào OMFS cả. Việc chúng rơi gần nhau là trùng hợp, không phải sự xác nhận lẫn
  nhau.</p>
</li>
</ul>
<h3>4. Chúng tôi cam kết gì, và điều gì sẽ làm thay đổi</h3>
<div class="callout">
<p><strong>Bố trí 2 BA cho 16 tuần của giai đoạn yêu cầu, ngân sách 160.000 USD.</strong></p>
</div>
<p><strong>Vì sao là 2 chứ không phải 1,71.</strong> Phương pháp C là cái bám thực tế nhất trong ba cái,
nhưng nó chỉ định giá những sản phẩm ta đã liệt kê. Các buổi khai thác yêu cầu, các buổi
rà soát chéo và việc kiểm soát thay đổi từ tuần 8 trở đi đều là công việc thật mà mô hình
của nó không chứa. Làm tròn 1,71 lên 2 hấp thụ phần đó, và nó tình cờ trùng với phương
pháp B — đó là sự yên tâm, không phải bằng chứng.</p>
<p><strong>Vì sao không phải 2,25.</strong> Con số của phương pháp A là cận trên, suy ra từ một quy tắc
ngón tay cái 15% vốn chưa hề nhìn vào hệ thống này. Cam kết theo nó nghĩa là cấp tiền cho
một phần ba BA chỉ dựa trên một con số trung bình ngành.</p>
<p><strong>Điều gì sẽ khiến chúng tôi đổi ý — nói trước:</strong></p>
<table>
<thead>
<tr>
<th>Ngưỡng kích hoạt</th>
<th>Cam kết sửa lại</th>
</tr>
</thead>
<tbody>
<tr>
<td>Danh sách TBD ở SRS Phụ lục C tới tuần 10 vẫn còn từ 3 mục trở lên</td>
<td>Nâng lên 2,25 BA; yêu cầu chưa chốt ngốn thời gian analyst với tốc độ tăng dần</td>
</tr>
<tr>
<td>Lazada và TikTok Shop bị kéo từ bản 1.1 lên bản 1.0</td>
<td>Nâng lên 2,5 BA; việc đó thêm 2 hệ thống giao tiếp cỡ vừa và khoảng 60 giờ mô hình hoá giao tiếp</td>
</tr>
<tr>
<td>Phạm vi bản 1.0 bị cắt xuống chỉ còn storefront</td>
<td>Giảm còn 1,5 BA</td>
</tr>
<tr>
<td>Giai đoạn yêu cầu bị nén từ 16 tuần xuống 12</td>
<td>Nâng lên 2,5 BA — khối lượng công việc không co lại theo lịch</td>
</tr>
</tbody>
</table>
<p><strong>Chi phí BA cho cả dự án, không chỉ giai đoạn yêu cầu:</strong> 440.000 USD với 2 BA trong 44
tuần. Đây là con số trung thực để trình người tài trợ. Analyst không dừng lại khi SRS
chốt bản cơ sở — họ còn trả lời câu hỏi, chạy kiểm soát thay đổi và duy trì truy vết cho
tới lúc phát hành, mà đó đúng là thứ cả ba phương pháp A, B và C đều tính vào dòng thứ ba
của mình.</p>
<h3>5. Độ nhạy: đơn giá theo giờ</h3>
<p>Đơn giá bình quân 125 USD là mặc định của công cụ, mang từ bối cảnh Mỹ của cuốn sách. Với
đơn giá BA bình quân ở Việt Nam khoảng 45 USD/giờ:</p>
<table>
<thead>
<tr>
<th>Phương pháp</th>
<th style="text-align: right;">Số BA ở 125 USD/h</th>
<th style="text-align: right;">Số BA ở 45 USD/h</th>
</tr>
</thead>
<tbody>
<tr>
<td>A — 15% ngân sách</td>
<td style="text-align: right;">2,25</td>
<td style="text-align: right;"><strong>6,25</strong></td>
</tr>
<tr>
<td>B — tỉ lệ theo lập trình viên</td>
<td style="text-align: right;">2,00</td>
<td style="text-align: right;">2,00</td>
</tr>
<tr>
<td>C — theo hoạt động</td>
<td style="text-align: right;">1,71</td>
<td style="text-align: right;">1,71</td>
</tr>
</tbody>
</table>
<p><strong>Phương pháp A là cái duy nhất nhúc nhích, và nó nhúc nhích rất xa.</strong> Điều này phơi ra
thứ phương pháp A thật sự đo: không phải dự án cần bao nhiêu phân tích, mà 15% ngân sách
tình cờ mua được bao nhiêu giờ công analyst. Ở đơn giá nội địa, nó mua được nhiều giờ hơn
hẳn so với lượng công việc đòi hỏi. Vì vậy chúng tôi coi phương pháp A là cận trên của
công sức <em>chi trả nổi</em>, không bao giờ coi nó là ước lượng của công sức <em>cần thiết</em> — và
đây là lý do mạnh nhất để ưu tiên sự bám thực tế của phương pháp C hơn phép tính số học
của phương pháp A.</p></div>`,
  ].join('\n'),
};

export default {
  title: "Worked package — TP2: E-Commerce Order Management (OMFS)|||Bộ tài liệu mẫu — TP2: Quản lý đơn hàng TMĐT (OMFS)",
  description: "Trọn bộ 8 deliverable của một bài Assignment làm trên đề TP2, cho hệ thống OMFS của công ty giả định Nova Retail Group. Tài liệu giữ nguyên tiếng Anh như khi nộp; phần dẫn giải mỗi tài liệu là song ngữ. Đọc kèm mục Assignment để biết vì sao mỗi phần được viết như vậy.",
  lessons: [TP2L1, TP2L2, TP2L3, TP2L4, TP2L5, TP2L6, TP2L7, TP2L8],
};
