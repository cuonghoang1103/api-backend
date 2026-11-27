# Release Go/No-Go – 10 Points

> **Purpose:** the release decision before a demo, UAT or the final defense build — ten checks, each with evidence. Any "No" on points 1–5 means No-Go.
> **Who fills:** hat C5 QA/Tester proposes, C1 Leader/PM decides, the supervisor is informed.
> **Guide:** link evidence (CI run, test report, version page) — "I think it works" is not evidence.

| Field | Value |
|---|---|
| Version / Git tag | |
| Commit SHA | |
| Date | |
| Decision | Go · No-Go |

| # | Check | Go? | Evidence |
|---|---|---|---|
| 1 | CI is green on the tagged commit (build + unit tests) | | |
| 2 | 0 open Critical defects, 0 open Major defects in the release scope | | |
| 3 | System Test exit criteria met (pass rate ≥ target in the Test Plan) | | |
| 4 | Database migrations apply cleanly on an empty database and on a copy of the previous release | | |
| 5 | Rollback tested: previous version can be restored in under the agreed time | | |
| 6 | All issues in the version are Done or moved out explicitly | | |
| 7 | Release notes written (features, fixes, known issues, tag + SHA) | | |
| 8 | User guide (Report 6) matches the screens of this build | | |
| 9 | Secrets and environment variables documented; no secret in the repository | | |
| 10 | Demo data and accounts ready (one per actor) | | |

## Decision & Sign-off

| Name | Role / hat | Decision | Date |
|---|---|---|---|
| | C1 Leader/PM | | |
| | C5 QA/Tester | | |
