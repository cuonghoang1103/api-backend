# Report 5.0 – Test Plan

> **Purpose:** the plan behind Report 5.1 (Unit), 5.2 (Integration) and 5.3 (System): what is tested, at which level, by whom, with which entry and exit criteria, on which dates. Written before the first test round, updated after each round.
> **Who fills:** hat C5 QA/Tester; reviewed by C1 and the supervisor.
> **Guide:** exit criteria are numbers ("≥ 95% of System Test cases passed, 0 open Critical defects"), never "testing is complete". Preconditions never go inside steps.

## 1. Scope of Testing

### 1.1 Features to be Tested

| ID | Feature / Use case | Test levels |
|---|---|---|
| UC-01 | | Unit · Integration · System |

### 1.2 Features not to be Tested

| ID | Feature | Reason |
|---|---|---|
| | | |

## 2. Test Strategy

### 2.1 Test Levels

| Level | What is tested | Technique | Tool | Report |
|---|---|---|---|---|
| Unit | service / repository methods | EP, BVA, decision table | JUnit 5, Mockito, JaCoCo | 5.1 |
| Integration | API ↔ database ↔ external services | scenario | Postman / RestAssured, Testcontainers | 5.2 |
| System | end-to-end user flows per use case | use-case based | manual + Selenium/Playwright | 5.3 |
| Acceptance | UAT with real users | scripted UAT | CT Work client portal | UAT minutes |

### 2.2 Testing Types

| Type | In scope? | Notes |
|---|---|---|
| Functional | Yes | |
| Security (authz, input validation, OWASP Top 10) | Yes | |
| Performance (NFR) | | |
| Usability | | |

## 3. Entry & Exit Criteria

| Level | Entry criteria | Exit criteria |
|---|---|---|
| Unit | code merged to develop, CI build green | ≥ 80% line coverage on services, 100% of UTCIDs executed |
| Integration | unit exit met, test database seeded | 100% of IT cases executed, 0 open Critical |
| System | integration exit met, staging deployed | ≥ 95% passed, 0 open Critical/Major |

## 4. Test Environment

| Purpose | Tool | Provider | Version |
|---|---|---|---|
| | | | |

## 5. Test Schedule

| Round | From – to | Scope | Owner |
|---|---|---|---|
| Round 1 | | | |
| Round 2 | | | |
| Round 3 | | | |

## 6. Defect Management

Severity (Critical / Major / Minor / Trivial), life cycle (Open → Fixed → Retest → Closed / Reopen), who may close a defect (QA only), Defect vs Leakage (found by AT).

## 7. Risks & Contingencies

| # | Risk | Contingency |
|---|---|---|
| 1 | | |
