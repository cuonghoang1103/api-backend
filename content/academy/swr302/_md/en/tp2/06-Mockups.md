# Mock-ups for Complex Use Cases
## for the Order Management and Fulfillment System (OMFS)

Version 1.0 approved
Prepared by **<Member 4 name>**, Business Analysis Team — Group <N>
Nova Retail Group (NRG)
17 September 2026

---

## 1. Purpose and approach

Per Wiegers & Beatty Chapter 15, these are **throwaway, low-fidelity mock-ups**. Their
job is to make a design decision visible so a stakeholder can disagree with it — not
to look finished. They are deliberately grey and unstyled: a polished mock-up makes
stakeholders discuss colour instead of behaviour, and makes management believe the
system is nearly built.

**The SRS remains the source of truth.** These mock-ups illustrate it. Where a
mock-up and the SRS disagree, the SRS is correct and the mock-up is out of date.

## 2. How the three use cases were chosen

The brief asks for "at least 3 complex use cases". *Complex* here means **many
decisions and many states**, not many input fields. Candidates were ranked on
alternative flows + exceptions + participating actors:

| Use case | Alt. flows | Exceptions | Actors | Total | Selected |
|---|---|---|---|---|---|
| **UC-04** Route and split an order | 3 | 3 | 2 | **8** | ✅ |
| **UC-10** Handle a fulfillment exception | 5 | 3 | 3 | **11** | ✅ |
| **UC-07** Rate-shop and buy a label | 3 | 4 | 3 | **10** | ✅ |
| UC-09 Track an order | 3 | 3 | 3 | 9 | ✅ *(also drawn — see §3.5)* |
| UC-03 Reserve inventory | 2 | 4 | 2 | 8 | — covered inside M1 |
| UC-12 Process a return | 3 | 4 | 3 | 10 | deferred to Release 2.0 |
| UC-06 Pick and pack | 3 | 4 | 1 | 8 | — |

UC-12 scores highly but is deferred to Release 2.0, so mocking it now would prototype
something nobody will build this year. UC-09 was added as a fourth because it is the
only customer-facing screen in the system and it is what actually delivers business
objective BO-4.

## 3. The mock-ups

| # | File | Use case | Flow shown | State |
|---|---|---|---|---|
| **M1** | `mockups/M1-UC04-routing-workbench.png` | UC-04 | Normal flow 4.0 | Success |
| **M1b** | `mockups/M1b-UC04-split-limit-exception.png` | UC-04 → UC-10 | Exception 4.0.E2 | **Failure** |
| **M2** | `mockups/M2-UC07-carrier-rate-shopping.png` | UC-07 | Normal flow 7.0 | Success, with one ineligible carrier |
| **M3** | `mockups/M3-UC10-exception-console.png` | UC-10 | Normal flow 10.0 + alt flow 10.5 | Working queue |
| **M4** | `mockups/M4-UC09-customer-tracking.png` | UC-09 | Alt flow 9.1 + exception 9.0.E3 | **Split order + stale status** |

Editable source for every mock-up is the matching `.html` file in `mockups/`.

### 3.1 M1 — Routing workbench (UC-04, normal flow)

Shows the automated routing decision for a real order, with **the full score table for
every candidate fulfillment center** and a one-line explanation of why the winner won.

*Design decision under test:* the Fulfillment Manager said in elicitation session 2
that they would not trust a routing decision they could not inspect. UC-04 POST-2
therefore requires the score table to be stored, and this screen is where it is read.
The alternative — showing only the chosen center — was rejected.

*Realizes:* Route-1 … Route-5. *Rules visible:* BR-01, BR-06, BR-08, BR-09, BR-10.

### 3.2 M1b — Split limit exceeded (UC-04, exception 4.0.E2)

The failure state. Routing needs four fulfillment centers but BR-08 permits three, so
**nothing is created and no stock is released** — the banner says so explicitly,
because a manager's first question in this situation is "what has the system already
done?".

*Design decision under test:* four resolution options with one recommended, rather
than a bare error. The mandatory reason box implements UC-10 POST-1.

*Realizes:* Route-4, Except-1.

### 3.3 M2 — Carrier rate shopping (UC-07)

Four carriers quoted, three eligible, one shown **greyed with its disqualifying
reason** rather than hidden. The selection rule — cheapest carrier that still meets
the promised date — is stated on screen with the saving against the previous manual
default.

*Design decision under test:* showing the ineligible carrier. Hiding it would make the
comparison shorter but unauditable; the Logistics Manager reconciles these quotes
against the monthly 3PL invoice, which is how objective BO-5 is proved.

*Realizes:* Label-1, Label-2. *Rules visible:* BR-09, BR-11, BR-12.

### 3.4 M3 — Exception console (UC-10)

The working queue: every open exception sorted by delivery-date risk, with SLA
breaches marked, and — on selection — **the resolution options that are valid for that
exception type only**.

*Design decision under test:* type-specific resolutions (UC-10 flows 10.1–10.4) rather
than a generic reassign / cancel / ignore list. A generic console would put the real
decision back in the manager's memory, which is exactly the manual process the project
is replacing.

*Realizes:* Except-1 … Except-3. *Rules visible:* BR-08, BR-09.

### 3.5 M4 — Customer order tracking (UC-09)

The only customer-facing screen. Shows a **split order** as two explained parcels, and
a shipment whose carrier has gone quiet for 46 hours with an explicit "no update since"
notice and what NRG will do about it.

*Design decisions under test:* two of them. First, a split order is **explained** — an
unexplained partial delivery generates precisely the WISMO contact this page exists to
prevent. Second, stale status is **admitted** with its timestamp rather than displayed
as though current; pretending to know is what destroys trust in a tracking page.

*Realizes:* Track-1 … Track-4. *Rules visible:* BR-09.

## 4. Questions these mock-ups are meant to settle

Each was taken to the relevant stakeholder. Answers feed the SRS.

| # | Question | Asked of | Answer |
|---|---|---|---|
| Q1 | Is the score table enough to make an automated routing decision trustworthy, or is a manual approval step needed for every order? | Fulfillment Manager | Score table is enough; approval only for overrides. Confirms UC-04 runs unattended. |
| Q2 | Should an ineligible carrier be hidden or shown with a reason? | Logistics Manager | Shown with reason — needed for invoice reconciliation. |
| Q3 | Should the exception console offer a free-text resolution, or a fixed list per type? | Fulfillment Manager | Fixed list per type, plus a mandatory reason. |
| Q4 | Should a customer see that their order was split? | Customer Service Manager | Yes, and it must be explained in one sentence. |
| Q5 | What should the tracking page show when a carrier goes silent? | Customer Service Manager | The last known status, its age, and what NRG will do — **open TBD-4**: exact wording to be agreed with the brand team. |

**TBD-4** is carried into the SRS TBD list. Leaving it open and tracked is correct at
this stage; inventing wording the brand team has not approved would be worse.
