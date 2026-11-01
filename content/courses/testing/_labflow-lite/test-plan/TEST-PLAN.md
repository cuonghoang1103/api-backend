# Test plan — LabFlow Lite 1.1: My bookings and cancel (US-11)

Owner: the LabFlow Lite team · Lesson 11.1 of the Testing course · Every number below was measured on this repository.

## 1. Scope

**In scope (release 1.1).** US-11 "My bookings": a student lists their own bookings and cancels one —
`GET /api/bookings`, `POST /api/bookings/:id/cancel`, the PostgreSQL adapter (`findById`, `listByUser`, `cancel`, the exclusion
constraint that now ignores cancelled rows), the `MyBookings` screen and the `/my-bookings` page. Regression of what US-11 touches:
booking a lab (BR-04, BR-05, BR-06, Lite-1, Lite-2) and the existing API.

**Out of scope.** BR-02 (account lock-out — the demo login does not use it), BR-07/BR-08 (check-in, no-show ban), BR-09 (waitlist),
BR-10 (weekly series): they exist as tested library code, but no endpoint calls them in 1.1. Load and security testing beyond
authorisation. Browsers other than Chromium on pull requests (the five run every night).

| Requirement | Risk | What it says |
|---|---|---|
| BR-04 | High | 30-minute grid inside 07:00–21:00; two bookings of one lab never overlap |
| BR-05 | Medium | At most 14 days ahead, counted in Viet Nam's calendar |
| BR-06 | High | A student's booking for more than 30 seats waits for approval |
| Lite-1 | Low | A booking lasts at most 4 hours |
| Lite-2 | Medium | Lecturers and admins never need approval |
| Lite-3 | High | A booking can be cancelled until 60 minutes before it starts (Viet Nam time) |
| US-11 AC1 | High | My bookings lists only my own bookings, by date and start, cancelled ones too |
| US-11 AC2 | High | I can cancel my own booking until 60 minutes before it starts; at 59 minutes: TOO_LATE_TO_CANCEL |
| US-11 AC3 | High | Someone else's booking looks missing (404): nobody learns it exists |
| US-11 AC4 | Medium | Cancelling twice — even at the same moment — succeeds once: ALREADY_CANCELLED |
| US-11 AC5 | High | A cancelled slot can be booked again |
| US-11 AC6 | Low | An admin may cancel any booking, at any time |

## 2. Risks

Score = likelihood × impact (1 low … 3 high). High = 6 or more: it needs a test above the Unit layer.

| # | Risk | L | I | Score | Where we test it |
|---|---|---:|---:|---:|---|
| R1 | Cancelling at the wrong minute: Lite-3 read in the server's time zone, not Viet Nam's | 3 | 3 | 9 | Unit decision table (60 / 59 minutes), Stryker in UTC, nightly unit run in Asia/Ho_Chi_Minh |
| R2 | A student sees or cancels someone else's booking (AC1, AC3) | 2 | 3 | 6 | API tests per role, contract test, E2E |
| R3 | PostgreSQL keeps a cancelled slot blocked (AC5) — the in-memory repository cannot show it | 3 | 2 | 6 | DB integration on PostgreSQL 17 |
| R4 | PostgreSQL hands dates back as JS Dates: the API breaks its contract (AC1) | 3 | 2 | 6 | DB integration + openapi.json check on the PostgreSQL-backed API |
| R5 | Changing the overlap query breaks booking (BR-04, BR-06) | 2 | 3 | 6 | Existing unit/DB suites, mutation testing, E2E |
| R6 | Two cancels at the same moment both succeed (AC4) | 2 | 2 | 4 | DB race test with two warm connections |
| R7 | The screen calls the wrong URL — every component test uses a stub client | 1 | 3 | 3 | One E2E journey |
| R8 | The user is not told what happened, or clicks twice (AC2) | 2 | 1 | 2 | Component tests (Testing Library) |

## 3. Approach — the test pyramid and its budget

| Layer | Tests | One run (median of 3) | Proves |
|---|---:|---:|---|
| Unit + API (`npm run test:unit`) | 299 | 1.6 s | rules, services, HTTP status codes, roles, the contract |
| UI components (`npm run test:web`) | 24 | 2.3 s | what the user sees in every state |
| DB integration (`npm run test:int`) | 19 | 1.5 s (database already running; Testcontainers adds its start-up) | SQL, constraints, races, data shapes |
| E2E, Chromium (`npm run test:e2e`) | 8 | 4.2 s | the wiring: screen → API → storage |
| E2E, 5 browsers/devices (nightly) | 40 | 24.1 s | browser and device differences |
| Mutation, `src/rules` (`npm run test:mutation`) | 433 mutants | 28.7 s | that the tests would notice a bug |

Budget: everything a developer runs before pushing (unit, UI, DB) stays **under 15 s**; the pull-request pipeline stays
**under 10 minutes** (rehearsed with act on a laptop: 8 min 48 s with a warm npm cache, 11 min cold — installing Chromium with its
system libraries is 6½ of those minutes); anything slower goes to the nightly run. New E2E tests only for journeys no lower layer
can see.

## 4. Environments and test data

Node 22.12+, Vitest 5, Testing Library (jsdom), Playwright 1.64 (Chromium on pull requests), PostgreSQL 17 (Testcontainers,
or `TEST_DATABASE_URL`), GitHub Actions (rehearsed locally with act). Data: every test builds its own — a fresh in-memory
repository, `TRUNCATE` per integration test, a lab code of its own per E2E test (`freshLab`). Clocks are injected (`now`);
E2E bookings are a few days after today, never a fixed date.

## 5. Entry criteria

- US-11's six acceptance criteria are agreed and written in `test-plan/requirements.json`.
- The feature branch builds, `npm ci` succeeds from the lockfile, the existing suites are green on `main`.
- Docker (or a PostgreSQL 17 URL) and Chromium are available to whoever runs the tests.

## 6. Exit criteria

- `ci-ok` is green: unit (Node 22 and 24), UI, DB, E2E (Chromium), mutation and the quality report.
- Coverage at least 97% lines, 91% branches, 96% functions, 97% statements; mutation score at least 95% on `src/rules`.
- Traceability: every in-scope requirement has a passing test; every High-risk one has one above the Unit layer.
- No open defect of High severity. A Medium one may ship with an owner and a date (see section 9).
- The last nightly run (5 browsers, shuffled order, Viet Nam time zone) is green.

## 7. Traceability

A test proves a requirement when its name carries the id — `(BR-04)`, `(Lite-3, AC2)`, or `(US-11)` on the describe and
`(AC4)` on the test. Tag the narrowest test, never a whole describe. `node scripts/rtm.mjs --run` prints the matrix from the
reports of the tests that really ran; the `report` job of the pipeline turns any gap into a red `ci-ok`.

## 8. Definition of done

A story is done when: every acceptance criterion has a passing test tagged with its id; the tests were reviewed with the
checklist of lesson 10.3; `openapi.json` describes every new status code; `ci-ok` is green; no `.only` or skipped test was
added; this plan is updated (scope, risks, numbers).

## 9. Known defects and accepted risks

| Id | Found | Severity | Description | Decision |
|---|---|---|---|---|
| LF-301 | While building the traceability matrix | Medium | BR-05 is tested only as a pure function: `POST /api/bookings` never calls it, so a booking 30 days ahead is accepted (201) | Accepted for 1.1 — owner: backend, fix in 1.2 with an API test first |
