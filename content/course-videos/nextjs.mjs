/**
 * Curated YouTube track for the "Next.js & React" course.
 * ─────────────────────────────────────────────────────────────────────────────
 * One entry per lesson slug → the third-party lecture shown on the YT pill of
 * the learn page, until the Vietnamese and English recordings are made. The
 * `credit` line is displayed under the player, so the author is always named.
 *
 * Every id here was resolved through YouTube's oEmbed endpoint, which returns
 * the live title + channel and 404s on a dead / private / non-embeddable
 * video. Re-check the whole file any time with:
 *
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/nextjs.mjs
 *   node scripts/verify-youtube-videos.mjs --all --fix-credits   # refresh credits
 *
 * Apply to the database with:
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/nextjs.mjs --apply
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'nextjs',
  // Until the instructor's own recordings exist, every lesson opens on YT.
  // Seeding a `vi:` URL for a lesson flips that lesson to VI automatically.
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Giới thiệu ─────────────────────────────────────────────── */
    'nextjs-0-1-gioi-thieu': { yt: 'Tn6-PIqc4UM', credit: 'Fireship — React in 100 Seconds' },
    'nextjs-0-2-react-vs-nextjs': { yt: 'x7cQ3mrcKaY', credit: 'JSConf — Pete Hunt: React: Rethinking best practices -- JSConf EU' },
    'nextjs-0-3-cai-dat': { yt: 'Sklc_fQBmcs', credit: 'Fireship — Next.js in 100 Seconds // Plus Full Beginner\'s Tutorial' },
    'nextjs-0-4-cach-hoc': { yt: '7DC3ZrxvUUU', credit: 'Codevolution — Next.js 15 Tutorial - 4 - Before We Start' },

    /* ── Chương 1 — JSX & mô hình render ────────────────────────────────── */
    'nextjs-1-1-react-lam-gi': { yt: 'H6QAY_VqvUc', credit: 'Codevolution — React 19 Tutorial - 1 - Introduction' },
    'nextjs-1-2-jsx-la-javascript': { yt: '6sg98ju4O-w', credit: 'Codevolution — React 19 Tutorial - 6 - JSX' },
    'nextjs-1-3-ngoac-nhon': { yt: '1IvSI_YKx-k', credit: 'Codevolution — React 19 Tutorial - 7 - Rules of JSX' },
    'nextjs-1-4-danh-sach-dieu-kien': { yt: 'VwuwodgrIaU', credit: 'Codevolution — React 19 Tutorial - 10 - Conditional Rendering' },
    'nextjs-1-5-luat-jsx': { yt: 'zFdDdPMyIAo', credit: 'Codevolution — React 19 Tutorial - 4 - Components' },

    /* ── Chương 2 — Component, props & ghép ─────────────────────────────── */
    'nextjs-2-1-props': { yt: 'JQBaytmgmGo', credit: 'Codevolution — React 19 Tutorial - 8 - Props' },
    'nextjs-2-2-children-composition': { yt: '-FRGDF5gCjc', credit: 'Coding Addict — React 18 Tutorial - Children Prop' },
    'nextjs-2-3-khuon-props': { yt: 'pQLXUT94Hcg', credit: 'Codevolution — React 19 Tutorial - 9 - Props Patterns' },
    'nextjs-2-4-tu-duy-component': { yt: 'ACqQh7zdPiY', credit: 'Codevolution — React 19 Tutorial - 5 - Export and Import Components' },

    /* ── Chương 3 — State & mô hình render lại ──────────────────────────── */
    'nextjs-3-1-usestate': { yt: 'akZJe9Mx-Xc', credit: 'Codevolution — React 19 Tutorial - 18 - useState Hook' },
    'nextjs-3-2-state-la-anh-chup': { yt: 'hjNExKVUHSw', credit: 'Codevolution — React 19 Tutorial - 21 - State as a Snapshot' },
    'nextjs-3-3-khong-mutate': { yt: 'm0FUyg5ntlM', credit: 'Codevolution — React 19 Tutorial - 25 - useState with Arrays' },
    'nextjs-3-4-state-o-dau': { yt: 'YpjvL5SvVhM', credit: 'Codevolution — React 19 Tutorial - 26 - Sharing State Between Components' },

    /* ── Chương 4 — Sự kiện & form có kiểm soát ─────────────────────────── */
    'nextjs-4-1-su-kien': { yt: 'peewECGtPCI', credit: 'Codevolution — React 19 Tutorial - 15 - Event Handling' },
    'nextjs-4-2-input-co-kiem-soat': { yt: 'MCIfZlQlmSc', credit: 'Codevolution — React 19 Tutorial - 24 - useState with Objects' },
    'nextjs-4-3-form-thật': { yt: 'XzZoUojeuF0', credit: 'Codevolution — React 19 Tutorial - 16 - Event Handlers as Props' },
    'nextjs-4-4-controlled-vs-uncontrolled': { yt: 'yCS2m01bQ6w', credit: 'Codevolution — React Hooks Tutorial - 28 - useRef Hook Part 1' },

    /* ── Chương 5 — useEffect ───────────────────────────────────────────── */
    'nextjs-5-1-effect-la-gi': { yt: 'dH6i3GurZW8', credit: 'Jack Herrington — Mastering React\'s useEffect' },
    'nextjs-5-2-phu-thuoc-don-dep': { yt: 'DTlmk6QeOHY', credit: 'Codevolution — React Hooks Tutorial - 10 - useEffect with cleanup' },
    'nextjs-5-3-chay-hai-lan-dev': { yt: 'j8s01ThR7bQ', credit: 'Jack Herrington — React 18: useEffect Double Call; Mistake or Awesome?' },
    'nextjs-5-4-effect-khong-nen-viet': { yt: 'SP-NrbQHFww', credit: 'Codevolution — React Hooks Tutorial - 11 - useEffect with incorrect dependency' },
    'nextjs-5-5-fetch-va-cuoc-dua': { yt: 'bYFYF2GnMy8', credit: 'Codevolution — React Hooks Tutorial - 12 - Fetching data with useEffect Part 1' },

    /* ── Chương 6 — Bộ đồ nghề hooks ────────────────────────────────────── */
    'nextjs-6-1-useref': { yt: 'TNhaISOUy6Q', credit: 'Fireship — 10 React Hooks Explained // Plus Build your own from Scratch' },
    'nextjs-6-2-usememo-usecallback': { yt: 'qySZIzZvZOY', credit: 'Codevolution — React Hooks Tutorial - 27 - useMemo Hook' },
    'nextjs-6-3-usereducer': { yt: 'cVYp4u1m6iA', credit: 'Codevolution — React Hooks Tutorial - 18 - useReducer Hook' },
    'nextjs-6-4-usecontext': { yt: 'BdKykWVTPtU', credit: 'Codevolution — React 19 Tutorial - 34 - Context and useContext Hook' },
    'nextjs-6-5-custom-hooks': { yt: 'l-s9MgoMwTI', credit: 'Codevolution — React Hooks Tutorial - 30 - Custom Hooks' },

    /* ── Chương 7 — Danh sách, key & hiệu năng render ───────────────────── */
    'nextjs-7-1-reconciliation': { yt: 'i793Qm6kv3U', credit: 'CrossComm, Inc. — Understanding React\'s UI Rendering Process' },
    'nextjs-7-2-key': { yt: 'y_J0-bUoACc', credit: 'Codevolution — React 19 Tutorial - 12 - Lists and Keys' },
    'nextjs-7-3-vi-sao-render-lai': { yt: 'qiPHXVeNi_w', credit: 'Codevolution — React 19 Tutorial - 20 - How State Updates Work' },
    'nextjs-7-4-react-memo': { yt: 'HA96JzJ_G1A', credit: 'Akilesh Rao — useMemo & useCallback DO NOT prevent re-renders (React Memoization Explained)' },
    'nextjs-7-5-do-dung-doan': { yt: '00RoZflFE34', credit: 'Ben Awad — How to use the React Profiler to find and fix Performance Problems' },

    /* ── Chương 8 — App Router ──────────────────────────────────────────── */
    'nextjs-8-1-tu-react-toi-nextjs': { yt: 'ZjAqacIC_3c', credit: 'Codevolution — Next.js 14 Tutorial - 1 - Introduction' },
    'nextjs-8-2-cac-file-quy-uoc': { yt: '9602Yzvd7ik', credit: 'Codevolution — Next.js 15 Tutorial - 5 - Routing' },
    'nextjs-8-3-layout-long': { yt: 'TzF2RKFjRyk', credit: 'Codevolution — Next.js 15 Tutorial - 15 - Nested Layouts' },
    'nextjs-8-4-dieu-huong-link': { yt: '9y7E44zHiGM', credit: 'Codevolution — Next.js 15 Tutorial - 19 - Link Component' },
    'nextjs-8-5-route-group-metadata': { yt: 'auXXk38rGgk', credit: 'Codevolution — Next.js 15 Tutorial - 13 - Route Groups' },

    /* ── Chương 9 — Server vs Client Component ──────────────────────────── */
    'nextjs-9-1-mac-dinh-la-server-component': { yt: 'gSSsZReIFRk', credit: 'Vercel — Next.js App Router: Routing, Data Fetching, Caching' },
    'nextjs-9-2-use-client': { yt: 'dMCSiA5gzkU', credit: 'Codevolution — Next.js 15 Tutorial - 52 - Server and Client Components' },
    'nextjs-9-3-ranh-gioi-ghep': { yt: 'HQcxPCDwTuE', credit: 'Codevolution — Next.js 15 Tutorial - 59 - Server and Client Composition Patterns' },
    'nextjs-9-4-props-serialize': { yt: 'PM_STAq4MSg', credit: 'Codevolution — Next.js 15 Tutorial - 65 - Interleaving Server and Client Components' },
    'nextjs-9-5-dat-ranh-gioi': { yt: 'yJNuVay1SHw', credit: 'Codevolution — Next.js 15 Tutorial - 64 - Client Component Placement' },

    /* ── Chương 10 — Fetch, cache & revalidate ──────────────────────────── */
    'nextjs-10-1-fetch-trong-server-component': { yt: 'vwSlYG7hFk0', credit: 'ByteGrad — NextJS Tutorial - All 12 Concepts You Need to Know' },
    'nextjs-10-2-cache': { yt: 'O6VFEwHujW0', credit: 'Codevolution — Next.js 15 Tutorial - 54 - Static Rendering' },
    'nextjs-10-3-revalidate': { yt: 'Zmi8Ad8TBYY', credit: 'Codevolution — Next.js 15 Tutorial - 55 - Dynamic Rendering' },
    'nextjs-10-4-streaming-suspense': { yt: 'oSf1gUDGJOA', credit: 'Codevolution — Next.js 15 Tutorial - 58 - Streaming' },
    'nextjs-10-5-staleness-thuc-te': { yt: '1afNuqtb7q8', credit: 'Codevolution — Next.js 15 Tutorial - 45 - Caching in Route Handlers' },

    /* ── Chương 11 — Định tuyến chuyên sâu ──────────────────────────────── */
    'nextjs-11-1-catch-all': { yt: 'd46hLIg1B3Q', credit: 'Codevolution — Next.js 15 Tutorial - 9 - Catch all Segments' },
    'nextjs-11-2-generate-static-params': { yt: '09aGB_Q6cqE', credit: 'Codevolution — Next.js 15 Tutorial - 56 - generateStaticParams' },
    'nextjs-11-3-route-handlers': { yt: '27Uj6BeIDV0', credit: 'Codevolution — Next.js 15 Tutorial - 35 - Route Handlers' },
    'nextjs-11-4-parallel-routes': { yt: '697kNwfU-4M', credit: 'Codevolution — Next.js 15 Tutorial - 30 - Parallel Routes' },
    'nextjs-11-5-intercepting-routes': { yt: 'FTiwIVxWC00', credit: 'Codevolution — Next.js 15 Tutorial - 33 - Intercepting Routes' },

    /* ── Chương 12 — Server Actions ─────────────────────────────────────── */
    'nextjs-12-1-server-action-la-gi': { yt: 'UKupfEuUc1M', credit: 'developedbyed — Next.js 14 - Server Actions TUTORIAL | Type Safety, Error Handling, Pending States' },
    'nextjs-12-2-form-action': { yt: 'xWFbnrTap3M', credit: 'Codevolution — Next.js 15 Tutorial - 74 - Forms with Server Actions' },
    'nextjs-12-3-revalidate-sau-ghi': { yt: 'SbaKEqCRcDE', credit: 'Codevolution — Next.js 15 Tutorial - 79 - Update Server Action' },
    'nextjs-12-4-useactionstate-useformstatus': { yt: 'qpA-eGxASxo', credit: 'Codevolution — Next.js 15 Tutorial - 78 - useFormStatus vs useActionState' },
    'nextjs-12-5-bao-mat-action': { yt: 'UiQpt9b_ei4', credit: 'Codevolution — Next.js 15 Tutorial - 77 - Separating Server Actions' },

    /* ── Chương 13 — Styling, Tailwind & theme ──────────────────────────── */
    'nextjs-13-1-styling-va-tailwind': { yt: 'UBOj6rqRUME', credit: 'Traversy Media — Tailwind CSS Crash Course' },
    'nextjs-13-2-tailwind-nen-tang': { yt: '6biMWgD6_JY', credit: 'JavaScript Mastery — Tailwind CSS v4 Full Course 2026 | Master Tailwind in One Hour' },
    'nextjs-13-3-dark-mode': { yt: '7zqI4qMDdg8', credit: 'Dave Gray — Next.js Dark Mode with No Flicker + Tailwind CSS' },
    'nextjs-13-4-theme-css-variables': { yt: 'H_kSd4kn0E8', credit: 'PedroTech — Tailwind CSS V4 Crash Course 2025 | Become a Tailwind Pro in 1.5 Hours' },
    'nextjs-13-5-scale-va-bay-mau': { yt: 'UHciHtsuFnw', credit: 'Tom Is Loading — The Advanced TailwindCSS Crash Course' },

    /* ── Chương 14 — Quản lý state ──────────────────────────────────────── */
    'nextjs-14-1-hai-loai-state': { yt: 'KkxPtimqaew', credit: 'Austin Davis — TanStack Query - How to Master God-Tier React Query' },
    'nextjs-14-2-zustand': { yt: '-Y8brhQKvtA', credit: 'PedroTech — Zustand Beginner Tutorial - Learn React State Management With Zustand' },
    'nextjs-14-3-tanstack-query': { yt: '_EuPZrr3faU', credit: 'Coding in Flow — TanStack React Query v5 - Full Guide (Setup, Mutations, Infinite Loading, Optimistic Updates)' },
    'nextjs-14-4-mutations': { yt: 'vaUUALXu8sw', credit: 'Akilesh Rao — Mutations | React/Tanstack Query Series - Part 10' },
    'nextjs-14-5-chon-cong-cu': { yt: 'e74rB-14-m8', credit: 'PedroTech — React Query Crash Course - Learn Queries, Mutations, Caching, Optimistic Updates...' },

    /* ── Chương 15 — Xác thực, middleware, cookie ───────────────────────── */
    'nextjs-15-1-nen-tang-auth': { yt: 'H8RxNj492PY', credit: 'Code With Joel — Next.js JWT Auth Explained: Cookies, Refresh Tokens & 2FA (No Auth.js)' },
    'nextjs-15-2-cookies': { yt: '7KEwSiD7VxY', credit: 'Codevolution — Next.js 15 Tutorial - 43 - Cookies in Route Handlers' },
    'nextjs-15-3-middleware': { yt: 't1KTTZbqCm0', credit: 'Codevolution — Next.js 15 Tutorial - 46 - Middleware' },
    'nextjs-15-4-doc-nguoi-dung': { yt: 'lUqOhq3YxnQ', credit: 'Codevolution — Next.js 15 Tutorial - 89 - Read Session and User Data' },
    'nextjs-15-5-refresh-token': { yt: 'j7K8WR7TPQ8', credit: 'Thabish Kader — JWT, Access Tokens, Refresh Tokens with secure cookies | With Complete Flow from Backend to Frontend' },

    /* ── Chương 16 — Form, validation, upload ───────────────────────────── */
    'nextjs-16-1-hai-cach-form': { yt: 'T5n7dsQxVnE', credit: 'Code With Joel — Form Validation in Next.js with React Hook Form & Zod' },
    'nextjs-16-2-react-hook-form': { yt: 'KejZXxFCe2k', credit: 'Codevolution — React Hook Form Tutorial - 1 - Introduction' },
    'nextjs-16-3-zod': { yt: 'U9PYyMhDc_k', credit: 'Cosden Solutions — Zod Validation in React (Complete Tutorial)' },
    'nextjs-16-4-upload-file': { yt: 'awxLumuVR9I', credit: 'Tech Khan (Mohammed Khan) — How to Securely Upload Files to AWS S3 with Presigned URL | Node JS presigned url' },
    'nextjs-16-5-upload-bao-mat': { yt: 'O2F8XnsVKkg', credit: 'Coding Shiksha — Node.js Multer File Upload Type Validation Filters and Limit File Size and Error Handling in Express' },

    /* ── Chương 17 — Chiến lược render & SEO ────────────────────────────── */
    'nextjs-17-1-bon-cach-render': { yt: 'AQouuIwjvtA', credit: 'FineGap — Rendering Techniques in Next.js Explained | SSR, SSG, ISR & CSR' },
    'nextjs-17-2-tinh-vs-dong': { yt: '6-qMfLcPhOw', credit: 'Codevolution — Next.js 15 Tutorial -  47 - Rendering' },
    'nextjs-17-3-seo': { yt: 'a2ovCcxXqNo', credit: 'Codewalk Empire — Next.js 14 - SEO & Metadata Tutorial (Complete Guide)' },
    'nextjs-17-4-open-graph': { yt: 'FukseskiIkE', credit: 'Batuhan — SEO with Next.js 13 - Dynamic Sitemaps, OG Images and Metadata API' },
    'nextjs-17-5-core-web-vitals': { yt: 'cGiSr0MilsI', credit: 'I Code It — Core Web Vitals Explained: LCP, INP & CLS' },

    /* ── Chương 18 — Hiệu năng ──────────────────────────────────────────── */
    'nextjs-18-1-do-truoc': { yt: 'TvrQnBDIDpI', credit: 'CoderOne — The Right way to Optimize Next.js to Score 100 in lighthouse' },
    'nextjs-18-2-next-image': { yt: '7-MxyyDp9Fc', credit: 'Daweb Schools • Technology Tutorials & Courses — Next.js Image Optimization Explained with Real Stats - 99.4% File Size Reduction' },
    'nextjs-18-3-it-javascript': { yt: 'Sk2XRK3tO-A', credit: 'Ben Haig — How I got perfect web vitals on my website (Next.js)' },
    'nextjs-18-4-fonts-assets': { yt: 'owKXh_OsBkQ', credit: 'Blazity — Fix LCP in Next.js: Boost Core Web Vitals Fast | Next.js Optimization Tips #4' },
    'nextjs-18-5-do-trung-thuc': { yt: 'KnK-iNA6wXE', credit: 'Code Review — How to properly make LCP Analysis for Next.js App. Largest Contentful Paint. Lighthouse' },

    /* ── Chương 19 — Kiểm thử ───────────────────────────────────────────── */
    'nextjs-19-1-vi-sao-test': { yt: '8Xwq35cPwYg', credit: 'Programming with Mosh — React Testing for Beginners: Start Here!' },
    'nextjs-19-2-unit-test-vitest': { yt: 'CxSL0knFxAs', credit: 'PedroTech — React Vite Testing Tutorial For Beginners - Vitest Testing Crash Course' },
    'nextjs-19-3-react-testing-library': { yt: '6dOpQIwyV6g', credit: 'RoadsideCoder — React Testing Full Course 2026 | Vitest and React Testing Library Tutorial' },
    'nextjs-19-4-playwright-e2e': { yt: '3NW0Mz943_E', credit: 'Cosden Solutions — React Testing with Playwright (Complete Tutorial)' },
    'nextjs-19-5-test-cai-gi': { yt: 'rPTj1fX_inE', credit: 'Codevolution — React Testing Tutorial - 16 - What to test?' },

    /* ── Chương 20 — Build & deploy ─────────────────────────────────────── */
    'nextjs-20-1-build-vs-start': { yt: 'eJBQqzXmTeM', credit: 'Codevolution — Next.js 15 Tutorial - 92 - Deploying Next.js Apps to Vercel' },
    'nextjs-20-2-env-next-public': { yt: 'nNShvLJgvcM', credit: 'Ado Kukic — Learn How to Use Next.js Environment Variables and NEXT_PUBLIC' },
    'nextjs-20-3-docker': { yt: 'd1ntel1pk7s', credit: 'Programming with Umair — Next.js 14+ Docker Tutorial - Dev and Prod Environments using Dockerfile and Docker Compose' },
    'nextjs-20-4-vps-stale-build': { yt: 'DCJiQBag6Fs', credit: 'ByteGrad — Dockerize Next.js 16 & Deploy To VPS (+ Custom Domain, SSL, CDN Cloudflare, Docker Compose)' },
    'nextjs-20-5-quy-trinh-an-toan': { yt: 'ipDdja_PduE', credit: 'ByteGrad — Next.js + Postgres Dev / Prod (VPS Coolify, Prisma, Migrations)' },
  },
};
