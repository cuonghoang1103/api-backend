# Liên kết chéo khoá Nền tảng Web (Courses `web-foundations`) ↔ các khoá/môn khác

Ghi 02/11/2026 khi nâng cấp Ch1 (1.2, 1.4) và Ch11–14. Mỗi cặp có thẻ ở CẢ HAI phía: phía Nền tảng Web là `lienKet()` cuối khối
`ml-en`/`ml-vi` của bài; phía bên kia là thẻ `link-card lien-ket-cheo` chèn vào **cuối content** của đúng bài bằng
`scripts/wf/the-nguoc.py` (chạy lại an toàn — bài đã có thẻ tới cùng slug thì bỏ qua). Trước khi chèn đã kiểm `git status --short`
(mọi tệp đích sạch) và đầu tệp không có "FILE SINH TỰ ĐỘNG"; sau khi chèn: content-check 8 khoá đích 0 lỗi, 44/44 thẻ nằm đúng bài (EN + VI).

| Nền tảng Web | Bên kia | Tệp phía bên kia | Nền tảng Web dạy gì ở đây |
|---|---|---|---|
| `wf-1-2-vscode` | Git & GitHub `git-14-1-vs-code` | `content/courses/git/s14-cong-cu-hang-ngay.mjs` | Prettier/ESLint/F2 cho người mới, output thật |
| `wf-1-4-github` | Git & GitHub `git-15-1-ho-so-github` | `content/courses/git/s15-github-sinh-vien.mjs` | push/clone/rejected → pull --rebase trên kho trần |
| `wf-1-4-github` | Git & GitHub `git-5-1-remote-fetch-pull` | `content/courses/git/s05-remote-github.mjs` | push/clone/rejected → pull --rebase trên kho trần |
| `wf-1-4-github` | Git & GitHub `git-5-2-xac-thuc` | `content/courses/git/s05-remote-github.mjs` | push/clone/rejected → pull --rebase trên kho trần |
| `wf-1-4-github` | Git & GitHub `git-6-1-giai-phau-pr` | `content/courses/git/s06-pull-request.mjs` | push/clone/rejected → pull --rebase trên kho trần |
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
