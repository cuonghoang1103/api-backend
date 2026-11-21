## Bug: <one line: what is wrong, where>

**Steps to reproduce**
1. Open /recipes?page=1 (12 recipes in the database, page size 5)
2. Look at the first card

**Expected:** recipes 1–5
**Actual:** recipes 6–10 (recipes 1–5 never appear on any page)

**Smallest repro:** `page([1,2,3,4,5,6], 1, 5)` returns `[6]`
**Environment:** Chrome 149, macOS; commit a1b2c3d
**Evidence:** screenshot / Console error / failing test name
