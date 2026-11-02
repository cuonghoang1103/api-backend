# Liên kết chéo khoá Nền tảng Web (Courses `web-foundations`) ↔ các khoá/môn khác

Ghi 02/11/2026 khi nâng cấp Ch1 (1.2, 1.4) và Ch11–14. Mỗi cặp có thẻ ở CẢ HAI phía: phía Nền tảng Web là `lienKet()` cuối khối
`ml-en`/`ml-vi` của bài; phía bên kia là thẻ `link-card lien-ket-cheo` chèn vào **cuối content** của đúng bài bằng
`scripts/wf/the-nguoc.py` (chạy lại an toàn — bài đã có thẻ tới cùng slug thì bỏ qua). Trước khi chèn đã kiểm `git status --short`
(mọi tệp đích sạch) và đầu tệp không có "FILE SINH TỰ ĐỘNG"; sau khi chèn: content-check 8 khoá đích 0 lỗi, 44/44 thẻ nằm đúng bài (EN + VI).

| Nền tảng Web | Bên kia | Tệp phía bên kia | Nền tảng Web dạy gì ở đây |
|---|---|---|---|
| `wf-0-1-gioi-thieu-lo-trinh` | Node.js `nodejs-0-1-gioi-thieu` | `content/courses/nodejs/s00-intro.mjs` | bốn tầng, bản đồ 15 chương — chưa vững thì quay về đây |
| `wf-0-2-web-hoat-dong` | Mạng cho lập trình viên `netdev-0-2-go-dia-chi` | `content/courses/networking-for-developers/bai/002-go-dia-chi.mjs` | năm bước tải trang, máy chủ 13 dòng cho người mới |
| `wf-0-3-cai-dat-may` | Node.js `nodejs-0-3-cai-dat` | `content/courses/nodejs/s00-intro.mjs` | PATH, command not found, script kiểm máy |
| `wf-0-4-cach-hoc` | Node.js `nodejs-0-2-cach-hoc` | `content/courses/nodejs/s00-intro.mjs` | bảy thói quen học trên mã thật |
| `wf-1-2-vscode` | Git & GitHub `git-14-1-vs-code` | `content/courses/git/s14-cong-cu-hang-ngay.mjs` | Prettier/ESLint/F2 cho người mới, output thật |
| `wf-1-4-github` | Git & GitHub `git-15-1-ho-so-github` | `content/courses/git/s15-github-sinh-vien.mjs` | push/clone/rejected → pull --rebase trên kho trần |
| `wf-1-4-github` | Git & GitHub `git-5-1-remote-fetch-pull` | `content/courses/git/s05-remote-github.mjs` | push/clone/rejected → pull --rebase trên kho trần |
| `wf-1-4-github` | Git & GitHub `git-5-2-xac-thuc` | `content/courses/git/s05-remote-github.mjs` | push/clone/rejected → pull --rebase trên kho trần |
| `wf-1-4-github` | Git & GitHub `git-6-1-giai-phau-pr` | `content/courses/git/s06-pull-request.mjs` | push/clone/rejected → pull --rebase trên kho trần |
| `wf-2-1-html-basics` | WED201c (Academy) `wed201c-html` | `content/academy/WED201c.mjs` | cây DOM, sửa lỗi âm thầm, thuộc tính boolean |
| `wf-2-1-html-basics` | React `rx-0-2-jsx` | `content/courses/react/s00-intro.mjs` | HTML bên dưới JSX |
| `wf-2-2-text-links-images` | WED201c (Academy) `wed201c-html-noi-dung` | `content/academy/WED201c.mjs` | liên kết tương đối, alt, nhảy bố cục đo thật |
| `wf-2-3-semantic-html` | Testing `tst-6-1-testing-library` | `content/courses/testing/s06/testing-library.mjs` | cây trợ năng mà getByRole truy vấn |
| `wf-2-4-forms` | WED201c (Academy) `wed201c-html-form` | `content/academy/WED201c.mjs` | form thật gửi tới máy chủ thật |
| `wf-2-4-forms` | React `rx-3-1-controlled` | `content/courses/react/s03-form.mjs` | form khi chưa có React |
| `wf-2-5-tables-media-a11y` | WED201c (Academy) `wed201c-a11y-xuat-ban` | `content/academy/WED201c.mjs` | tương phản, thứ tự Tab, phép kiểm năm phút |
| `wf-3-1-css-basics` | WED201c (Academy) `wed201c-cascade` | `content/academy/WED201c.mjs` | sáu cuộc đấu cascade, độ cụ thể |
| `wf-3-1-css-basics` | Next.js `nextjs-13-1-styling-va-tailwind` | `content/courses/nextjs/s13-styling-tailwind.mjs` | cascade bên dưới Tailwind |
| `wf-3-2-box-model` | WED201c (Academy) `wed201c-css-basics` | `content/academy/WED201c.mjs` | box-sizing đo thật, gộp margin |
| `wf-3-3-flexbox` | WED201c (Academy) `wed201c-flexbox-grid` | `content/academy/WED201c.mjs` | hai trục, lỗi min-width |
| `wf-3-4-css-grid` | WED201c (Academy) `wed201c-flexbox-grid` | `content/academy/WED201c.mjs` | fr, vùng có tên, auto-fit |
| `wf-3-5-responsive` | WED201c (Academy) `wed201c-responsive` | `content/academy/WED201c.mjs` | viewport, mobile first, clamp |
| `wf-4-1-variables-types` | WED201c (Academy) `wed201c-js-co-ban` | `content/academy/WED201c.mjs` | ép kiểu, ===, truthy, tham chiếu |
| `wf-4-3-functions` | Node.js `nodejs-1-2-ham-closure-this` | `content/courses/nodejs/s01-javascript.mjs` | hàm từ số 0 trước closure |
| `wf-4-4-arrays-objects` | React `rx-0-3-js-cho-react` | `content/courses/react/s00-intro.mjs` | map/filter/reduce, sao chép nông, JSON |
| `wf-4-5-dom-events` | WED201c (Academy) `wed201c-dom` | `content/academy/WED201c.mjs` | XSS đo thật, defer, ủy quyền, app todo |
| `wf-5-1-event-loop` | Node.js `nodejs-2-2-event-loop` | `content/courses/nodejs/s02-runtime.mjs` | thứ tự microtask/task, trang đơ đo bằng khung hình |
| `wf-5-3-async-await` | Node.js `nodejs-1-4-bat-dong-bo` | `content/courses/nodejs/s01-javascript.mjs` | thiếu await, tuần tự vs song song, forEach |
| `wf-5-4-fetch-apis` | FER202 (Academy) `fer202-11-1-fetch-async` | `content/academy/FER202.mjs` | res.ok, bốn trạng thái, POST JSON, timeout |
| `wf-5-5-es-modules` | Node.js `nodejs-1-5-module` | `content/courses/nodejs/s01-javascript.mjs` | export/import, chạy một lần, file:// bị chặn |
| `wf-6-1-request-response` | API Design `api-0-1-http` | `content/courses/api-design/s00-intro.mjs` | request/response thô, curl -v, phi trạng thái |
| `wf-6-2-http-methods` | API Design `api-1-2-phuong-thuc` | `content/courses/api-design/s01-tai-nguyen.mjs` | POST hai lần, PUT vs PATCH, prefetch GET-xoá |
| `wf-6-3-status-codes` | API Design `api-1-3-status` | `content/courses/api-design/s01-tai-nguyen.mjs` | 14 mã thật, fetch thấy gì, requestJson |
| `wf-6-4-headers-json` | Node.js `nodejs-3-5-http-server` | `content/courses/nodejs/s03-core-modules.mjs` | Content-Type/415, Accept, ETag/304, JSON |
| `wf-6-5-rest-params-query` | Node.js `nodejs-5-2-dinh-tuyen` | `content/courses/nodejs/s05-express.mjs` | đường dẫn vs query, chuỗi, IDOR |
| `wf-7-1-auth-basics` | API Design `api-6-1-xac-thuc` | `content/courses/api-design/s06-bao-mat.mjs` | 401 vs 403, Basic = base64, không tin vai trò client |
| `wf-7-2-cookies-sessions` | Node.js `nodejs-8-4-cookie-csrf-thu-hoi` | `content/courses/nodejs/s08-auth.mjs` | HttpOnly, đăng xuất thật, CSRF Lax vs None |
| `wf-7-3-jwt` | Authentication `auth-4-1-giai-ma-bang-tay` | `content/courses/authentication/s04-jwt.mjs` | JWT tự ký, alg none, vấn đề đăng xuất |
| `wf-7-4-passwords` | Node.js `nodejs-8-1-mat-khau-va-bam` | `content/courses/nodejs/s08-auth.mjs` | muối, sha256 vs bcrypt đo thật |
| `wf-7-5-https-cors` | API Design `api-6-4-cors` | `content/courses/api-design/s06-bao-mat.mjs` | TLS trong curl, CORS không chặn request |
| `wf-8-1-databases` | PostgreSQL `postgresql-1-1-mo-hinh-quan-he` | `content/courses/postgresql/s01-vi-sao.mjs` | tệp JSON mất cập nhật, ràng buộc |
| `wf-8-2-select` | PostgreSQL `postgresql-4-2-select-where` | `content/courses/postgresql/s04-chen-truy-van.mjs` | WHERE, NULL, GROUP BY, chỉ mục |
| `wf-8-3-crud` | PostgreSQL `postgresql-4-4-update-delete` | `content/courses/postgresql/s04-chen-truy-van.mjs` | thiếu WHERE, giao dịch, injection |
| `wf-8-4-relationships-joins` | PostgreSQL `postgresql-5-2-outer-join` | `content/courses/postgresql/s05-join.mjs` | INNER/LEFT, đếm 0, CASCADE, N+1 |
| `wf-8-5-orm-prisma` | Prisma ORM `pr-1-3-thanh-sql` | `content/courses/prisma-orm/s01-orm.mjs` | lời gọi → SQL, P2002/P2025, $queryRaw |
| `wf-9-1-why-typescript` | TypeScript `typescript-1-1-ba-con-bug` | `content/courses/typescript/s01/ba-con-bug.mjs` | lỗi giỏ hàng "5000", tsc bắt, kiểu bị xoá lúc chạy |
| `wf-9-2-basic-types` | TypeScript `typescript-2-1-primitive` | `content/courses/typescript/s02/primitive.mjs` | suy kiểu, union, literal, any vs unknown |
| `wf-9-3-interfaces` | TypeScript `typescript-4-2-interface-vs-type` | `content/courses/typescript/s04/interface-type.mjs` | kiểu cho API Chương 6, Omit/Partial/Record, kind + never |
| `wf-9-4-functions-generics` | TypeScript `typescript-6-1-why-generics` | `content/courses/typescript/s06-generics.mjs` | tham số/kiểu trả về, first<T>, T extends, generic nói dối |
| `wf-9-5-ts-in-practice` | TypeScript `typescript-9-1-tsc-and-tsconfig` | `content/courses/typescript/s09-tsconfig-compiler.mjs` | strict 0→7 lỗi, build dist, @types, strip-types, zod |
| `wf-11-1-closure` | FER202 (Academy) `fer202-2-1-es6-basics` | `content/academy/FER202.mjs` | closure từ số 0, câu đố var |
| `wf-11-1-closure` | Node.js `nodejs-1-2-ham-closure-this` | `content/courses/nodejs/s01-javascript.mjs` | closure từ số 0, câu đố var |
| `wf-11-1-closure` | React `rx-4-3-vong-lap` | `content/courses/react/s04-effect.mjs` | closure từ số 0, câu đố var |
| `wf-11-2-this` | Node.js `nodejs-1-2-ham-closure-this` | `content/courses/nodejs/s01-javascript.mjs` | bốn luật this |
| `wf-11-2-this` | TypeScript `typescript-3-4-this` | `content/courses/typescript/s03/this.mjs` | bốn luật this |
| `wf-11-3-prototype-class` | FER202 (Academy) `fer202-5-2-state-class-vs-function` | `content/academy/FER202.mjs` | chuỗi prototype dưới class |
| `wf-11-3-prototype-class` | TypeScript `typescript-14-1-classes-access` | `content/courses/typescript/s14-classes-decorators.mjs` | chuỗi prototype dưới class |
| `wf-11-4-map-set-immutable` | FER202 (Academy) `fer202-2-2-destructuring-spread-modules` | `content/academy/FER202.mjs` | sửa tại chỗ vs thay mới, chép nông |
| `wf-11-4-map-set-immutable` | React `rx-2-3-object-array` | `content/courses/react/s02-state.mjs` | sửa tại chỗ vs thay mới, chép nông |
| `wf-11-5-regex` | Node.js `nodejs-6-3-validate-schema` | `content/courses/nodejs/s06-rest.mjs` | regex kiểm đầu vào, ^…$, Unicode |
| `wf-11-5-regex` | Node.js `nodejs-9-3-dau-vao-doc-hai` | `content/courses/nodejs/s09-security.mjs` | regex kiểm đầu vào, ^…$, Unicode |
| `wf-11-5-regex` | React `rx-3-4-tieng-viet` | `content/courses/react/s03-form.mjs` | regex kiểm đầu vào, ^…$, Unicode |
| `wf-12-1-position-stacking` | FER202 (Academy) `fer202-7-2-render-props` | `content/academy/FER202.mjs` | z-index & ngữ cảnh xếp chồng |
| `wf-12-1-position-stacking` | Next.js `nextjs-13-4-theme-css-variables` | `content/courses/nextjs/s13-styling-tailwind.mjs` | z-index & ngữ cảnh xếp chồng |
| `wf-12-2-transition-animation` | Next.js `nextjs-17-5-core-web-vitals` | `content/courses/nextjs/s17-rendering-seo.mjs` | thuộc tính rẻ/đắt khi làm động |
| `wf-12-2-transition-animation` | React `rx-12-2-transition` | `content/courses/react/s12-react-19.mjs` | thuộc tính rẻ/đắt khi làm động |
| `wf-12-3-css-architecture` | Next.js `nextjs-13-4-theme-css-variables` | `content/courses/nextjs/s13-styling-tailwind.mjs` | BEM, CSS Modules, @layer |
| `wf-12-3-css-architecture` | React `rx-13-2-hook-styling` | `content/courses/react/s13-kien-truc.mjs` | BEM, CSS Modules, @layer |
| `wf-12-4-tokens-theming` | Next.js `nextjs-13-4-theme-css-variables` | `content/courses/nextjs/s13-styling-tailwind.mjs` | token + chế độ tối |
| `wf-12-4-tokens-theming` | React `rx-13-2-hook-styling` | `content/courses/react/s13-kien-truc.mjs` | token + chế độ tối |
| `wf-13-1-why-test` | Node.js `nodejs-14-1-vi-sao-test` | `content/courses/nodejs/s14-testing.mjs` | tháp kiểm thử, hồi quy |
| `wf-13-1-why-test` | Testing `tst-0-1-kim-tu-thap` | `content/courses/testing/s00/kim-tu-thap.mjs` | tháp kiểm thử, hồi quy |
| `wf-13-2-unit-tests` | Testing `tst-1-1-cau-truc` | `content/courses/testing/s01/cau-truc.mjs` | Vitest AAA, matcher |
| `wf-13-2-unit-tests` | Testing `tst-1-4-ham-thuan` | `content/courses/testing/s01/ham-thuan.mjs` | Vitest AAA, matcher |
| `wf-13-3-testing-library` | React `rx-9-1-testing-library` | `content/courses/react/s09-test.mjs` | truy vấn theo vai trò, findBy |
| `wf-13-3-testing-library` | Testing `tst-6-1-testing-library` | `content/courses/testing/s06/testing-library.mjs` | truy vấn theo vai trò, findBy |
| `wf-13-4-mocking-ci` | Git & GitHub `git-11-2-actions` | `content/courses/git/s11-nen-tang-github.mjs` | vi.fn, fake timers, workflow CI |
| `wf-13-4-mocking-ci` | GitHub Actions `ga-15-1-ci-cho-pr` | `content/courses/github-actions/s15-du-an-cuoi-khoa.mjs` | vi.fn, fake timers, workflow CI |
| `wf-13-4-mocking-ci` | Testing `tst-3-1-phan-loai` | `content/courses/testing/s03/phan-loai.mjs` | vi.fn, fake timers, workflow CI |
| `wf-14-1-build` | Deploy VPS `deploy-1-3-tao-tac-phai-dung` | `content/courses/deploy-vps/s01-tao-tac.mjs` | dev vs build đo thật |
| `wf-14-1-build` | Next.js `nextjs-20-1-build-vs-start` | `content/courses/nextjs/s20-build-deploy.mjs` | dev vs build đo thật |
| `wf-14-2-env-secrets` | Deploy VPS `deploy-4-4-bi-mat-trong-lich-su-git` | `content/courses/deploy-vps/s04-cau-hinh.mjs` | VITE_ lộ trong bundle, xoay khoá |
| `wf-14-2-env-secrets` | Deploy VPS `deploy-4-5-xoay-bi-mat` | `content/courses/deploy-vps/s04-cau-hinh.mjs` | VITE_ lộ trong bundle, xoay khoá |
| `wf-14-2-env-secrets` | Next.js `nextjs-20-2-env-next-public` | `content/courses/nextjs/s20-build-deploy.mjs` | VITE_ lộ trong bundle, xoay khoá |
| `wf-14-3-deploy` | Deploy VPS `deploy-0-1-bon-buoc` | `content/courses/deploy-vps/s00-intro.mjs` | SPA fallback, cache, smoke-test |
| `wf-14-3-deploy` | Git & GitHub `git-15-2-github-pages` | `content/courses/git/s15-github-sinh-vien.mjs` | SPA fallback, cache, smoke-test |
| `wf-14-3-deploy` | Next.js `nextjs-20-4-vps-stale-build` | `content/courses/nextjs/s20-build-deploy.mjs` | SPA fallback, cache, smoke-test |
| `wf-14-4-performance` | Next.js `nextjs-17-5-core-web-vitals` | `content/courses/nextjs/s17-rendering-seo.mjs` | LCP/CLS/TBT đo thật |
| `wf-14-4-performance` | Next.js `nextjs-18-4-fonts-assets` | `content/courses/nextjs/s18-performance.mjs` | LCP/CLS/TBT đo thật |

## Liên kết trong khoá (không cần thẻ ngược)
- `wf-1-2-vscode` → `wf-10-2-reading-errors-debugging`, `wf-13-4-mocking-ci`.

## Chưa cặp (lý do)
- Ch2–Ch10 (bài cũ, chưa nâng cấp sâu) chưa đặt lienKet; khi nâng cấp các chương đó thì thêm hàng vào bảng này.
- PRJ301 (Academy): chưa có bài tương ứng đúng với Ch11–14 (PRJ301 là Java web), nên không ép cặp.
