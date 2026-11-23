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
    'nextjs-0-2-react-vs-nextjs': { yt: 'x7cQ3mrcKaY', credit: 'JSConf — Pete Hunt: React: Rethinking best practices -- JSConf EU', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/00-gioi-thieu/00-04-react-vs-nextjs-ca5ddae1.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-0-3-cai-dat': { yt: 'Sklc_fQBmcs', credit: 'Fireship — Next.js in 100 Seconds // Plus Full Beginner\'s Tutorial', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/00-gioi-thieu/00-05-cai-dat-c3fb108a.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-0-4-cach-hoc': { yt: '7DC3ZrxvUUU', credit: 'Codevolution — Next.js 15 Tutorial - 4 - Before We Start', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/00-gioi-thieu/00-06-cach-hoc-f7bc2b74.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 1 — JSX & mô hình render ────────────────────────────────── */
    'nextjs-1-1-react-lam-gi': { yt: 'H6QAY_VqvUc', credit: 'Codevolution — React 19 Tutorial - 1 - Introduction', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/01-jsx-mo-hinh-render/01-01-react-lam-gi-5cbeb5b7.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-1-2-jsx-la-javascript': { yt: '6sg98ju4O-w', credit: 'Codevolution — React 19 Tutorial - 6 - JSX', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/01-jsx-mo-hinh-render/01-02-jsx-la-javascript-1c46b48b.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-1-3-ngoac-nhon': { yt: '1IvSI_YKx-k', credit: 'Codevolution — React 19 Tutorial - 7 - Rules of JSX', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/01-jsx-mo-hinh-render/01-03-ngoac-nhon-f0eab968.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-1-4-danh-sach-dieu-kien': { yt: 'VwuwodgrIaU', credit: 'Codevolution — React 19 Tutorial - 10 - Conditional Rendering', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/01-jsx-mo-hinh-render/01-04-danh-sach-dieu-kien-d2af7f39.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-1-5-luat-jsx': { yt: 'zFdDdPMyIAo', credit: 'Codevolution — React 19 Tutorial - 4 - Components', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/01-jsx-mo-hinh-render/01-05-luat-jsx-48483f49.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 2 — Component, props & ghép ─────────────────────────────── */
    'nextjs-2-1-props': { yt: 'JQBaytmgmGo', credit: 'Codevolution — React 19 Tutorial - 8 - Props', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/02-component-props/02-01-props-f30d35e3.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-2-2-children-composition': { yt: '-FRGDF5gCjc', credit: 'Coding Addict — React 18 Tutorial - Children Prop', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/02-component-props/02-02-children-composition-13944ccf.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-2-3-khuon-props': { yt: 'pQLXUT94Hcg', credit: 'Codevolution — React 19 Tutorial - 9 - Props Patterns', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/02-component-props/02-03-khuon-props-e099237f.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-2-4-tu-duy-component': { yt: 'ACqQh7zdPiY', credit: 'Codevolution — React 19 Tutorial - 5 - Export and Import Components', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/02-component-props/02-04-tu-duy-component-3db0a5ef.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 3 — State & mô hình render lại ──────────────────────────── */
    'nextjs-3-1-usestate': { yt: 'akZJe9Mx-Xc', credit: 'Codevolution — React 19 Tutorial - 18 - useState Hook', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/03-state/03-01-usestate-d0d9ac0f.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-3-2-state-la-anh-chup': { yt: 'hjNExKVUHSw', credit: 'Codevolution — React 19 Tutorial - 21 - State as a Snapshot', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/03-state/03-02-state-la-anh-chup-daeba597.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-3-3-khong-mutate': { yt: 'm0FUyg5ntlM', credit: 'Codevolution — React 19 Tutorial - 25 - useState with Arrays', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/03-state/03-03-khong-mutate-19346a8b.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-3-4-state-o-dau': { yt: 'YpjvL5SvVhM', credit: 'Codevolution — React 19 Tutorial - 26 - Sharing State Between Components', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/03-state/03-04-state-o-dau-d44ecc21.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 4 — Sự kiện & form có kiểm soát ─────────────────────────── */
    'nextjs-4-1-su-kien': { yt: 'peewECGtPCI', credit: 'Codevolution — React 19 Tutorial - 15 - Event Handling', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/04-su-kien-form/04-01-su-kien-02010a9b.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-4-2-input-co-kiem-soat': { yt: 'MCIfZlQlmSc', credit: 'Codevolution — React 19 Tutorial - 24 - useState with Objects', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/04-su-kien-form/04-02-input-co-kiem-soat-87018a50.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-4-3-form-thật': { yt: 'XzZoUojeuF0', credit: 'Codevolution — React 19 Tutorial - 16 - Event Handlers as Props', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/04-su-kien-form/04-03-form-that-5520f2b9.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-4-4-controlled-vs-uncontrolled': { yt: 'yCS2m01bQ6w', credit: 'Codevolution — React Hooks Tutorial - 28 - useRef Hook Part 1', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/04-su-kien-form/04-04-controlled-vs-uncontrolled-2556b553.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 5 — useEffect ───────────────────────────────────────────── */
    'nextjs-5-1-effect-la-gi': { yt: 'dH6i3GurZW8', credit: 'Jack Herrington — Mastering React\'s useEffect', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/05-useeffect/05-01-effect-la-gi-7c8c4017.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-5-2-phu-thuoc-don-dep': { yt: 'DTlmk6QeOHY', credit: 'Codevolution — React Hooks Tutorial - 10 - useEffect with cleanup', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/05-useeffect/05-02-phu-thuoc-don-dep-0e93e45b.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-5-3-chay-hai-lan-dev': { yt: 'j8s01ThR7bQ', credit: 'Jack Herrington — React 18: useEffect Double Call; Mistake or Awesome?', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/05-useeffect/05-03-chay-hai-lan-dev-9292f4bf.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-5-4-effect-khong-nen-viet': { yt: 'SP-NrbQHFww', credit: 'Codevolution — React Hooks Tutorial - 11 - useEffect with incorrect dependency', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/05-useeffect/05-04-effect-khong-nen-viet-30b92ca4.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-5-5-fetch-va-cuoc-dua': { yt: 'bYFYF2GnMy8', credit: 'Codevolution — React Hooks Tutorial - 12 - Fetching data with useEffect Part 1', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/05-useeffect/05-05-fetch-va-cuoc-dua-1aba6a1a.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 6 — Bộ đồ nghề hooks ────────────────────────────────────── */
    'nextjs-6-1-useref': { yt: 'TNhaISOUy6Q', credit: 'Fireship — 10 React Hooks Explained // Plus Build your own from Scratch', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/06-hooks/06-01-useref-dcd15ce4.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-6-2-usememo-usecallback': { yt: 'qySZIzZvZOY', credit: 'Codevolution — React Hooks Tutorial - 27 - useMemo Hook', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/06-hooks/06-02-usememo-usecallback-0bac820f.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-6-3-usereducer': { yt: 'cVYp4u1m6iA', credit: 'Codevolution — React Hooks Tutorial - 18 - useReducer Hook', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/06-hooks/06-03-usereducer-69db0ee1.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-6-4-usecontext': { yt: 'BdKykWVTPtU', credit: 'Codevolution — React 19 Tutorial - 34 - Context and useContext Hook', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/06-hooks/06-04-usecontext-e3f99fd1.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-6-5-custom-hooks': { yt: 'l-s9MgoMwTI', credit: 'Codevolution — React Hooks Tutorial - 30 - Custom Hooks', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/06-hooks/06-05-custom-hooks-63cdb111.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 7 — Danh sách, key & hiệu năng render ───────────────────── */
    'nextjs-7-1-reconciliation': { yt: 'i793Qm6kv3U', credit: 'CrossComm, Inc. — Understanding React\'s UI Rendering Process', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/07-danh-sach-key-hieu-nang/07-01-reconciliation-286e702d.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-7-2-key': { yt: 'y_J0-bUoACc', credit: 'Codevolution — React 19 Tutorial - 12 - Lists and Keys', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/07-danh-sach-key-hieu-nang/07-02-key-e2a25440.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-7-3-vi-sao-render-lai': { yt: 'qiPHXVeNi_w', credit: 'Codevolution — React 19 Tutorial - 20 - How State Updates Work', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/07-danh-sach-key-hieu-nang/07-03-vi-sao-render-lai-a0e96498.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-7-4-react-memo': { yt: 'HA96JzJ_G1A', credit: 'Akilesh Rao — useMemo & useCallback DO NOT prevent re-renders (React Memoization Explained)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/07-danh-sach-key-hieu-nang/07-04-react-memo-6b266d63.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-7-5-do-dung-doan': { yt: '00RoZflFE34', credit: 'Ben Awad — How to use the React Profiler to find and fix Performance Problems', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/07-danh-sach-key-hieu-nang/07-05-do-dung-doan-988bc221.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 8 — App Router ──────────────────────────────────────────── */
    'nextjs-8-1-tu-react-toi-nextjs': { yt: 'ZjAqacIC_3c', credit: 'Codevolution — Next.js 14 Tutorial - 1 - Introduction', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/08-app-router/08-01-tu-react-toi-nextjs-82dbbf5f.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-8-2-cac-file-quy-uoc': { yt: '9602Yzvd7ik', credit: 'Codevolution — Next.js 15 Tutorial - 5 - Routing', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/08-app-router/08-02-cac-file-quy-uoc-55de9219.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-8-3-layout-long': { yt: 'TzF2RKFjRyk', credit: 'Codevolution — Next.js 15 Tutorial - 15 - Nested Layouts', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/08-app-router/08-03-layout-long-eb720958.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-8-4-dieu-huong-link': { yt: '9y7E44zHiGM', credit: 'Codevolution — Next.js 15 Tutorial - 19 - Link Component', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/08-app-router/08-04-dieu-huong-link-3cfea476.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-8-5-route-group-metadata': { yt: 'auXXk38rGgk', credit: 'Codevolution — Next.js 15 Tutorial - 13 - Route Groups', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/08-app-router/08-05-route-group-metadata-c7585404.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 9 — Server vs Client Component ──────────────────────────── */
    'nextjs-9-1-mac-dinh-la-server-component': { yt: 'gSSsZReIFRk', credit: 'Vercel — Next.js App Router: Routing, Data Fetching, Caching', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/09-server-client/09-01-mac-dinh-la-server-component-34c8f8f1.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-9-2-use-client': { yt: 'dMCSiA5gzkU', credit: 'Codevolution — Next.js 15 Tutorial - 52 - Server and Client Components', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/09-server-client/09-02-use-client-720d44bc.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-9-3-ranh-gioi-ghep': { yt: 'HQcxPCDwTuE', credit: 'Codevolution — Next.js 15 Tutorial - 59 - Server and Client Composition Patterns', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/09-server-client/09-03-ranh-gioi-ghep-09642f92.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-9-4-props-serialize': { yt: 'PM_STAq4MSg', credit: 'Codevolution — Next.js 15 Tutorial - 65 - Interleaving Server and Client Components', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/09-server-client/09-04-props-serialize-a67192f4.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-9-5-dat-ranh-gioi': { yt: 'yJNuVay1SHw', credit: 'Codevolution — Next.js 15 Tutorial - 64 - Client Component Placement', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/09-server-client/09-05-dat-ranh-gioi-b6fc4008.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 10 — Fetch, cache & revalidate ──────────────────────────── */
    'nextjs-10-1-fetch-trong-server-component': { yt: 'vwSlYG7hFk0', credit: 'ByteGrad — NextJS Tutorial - All 12 Concepts You Need to Know', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/10-fetch-cache-revalidate/10-01-fetch-trong-server-component-bc64bea9.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-10-2-cache': { yt: 'O6VFEwHujW0', credit: 'Codevolution — Next.js 15 Tutorial - 54 - Static Rendering', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/10-fetch-cache-revalidate/10-02-cache-a1b47e41.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-10-3-revalidate': { yt: 'Zmi8Ad8TBYY', credit: 'Codevolution — Next.js 15 Tutorial - 55 - Dynamic Rendering', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/10-fetch-cache-revalidate/10-03-revalidate-a36cfa45.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-10-4-streaming-suspense': { yt: 'oSf1gUDGJOA', credit: 'Codevolution — Next.js 15 Tutorial - 58 - Streaming', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/10-fetch-cache-revalidate/10-04-streaming-suspense-865c9b90.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-10-5-staleness-thuc-te': { yt: '1afNuqtb7q8', credit: 'Codevolution — Next.js 15 Tutorial - 45 - Caching in Route Handlers', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/10-fetch-cache-revalidate/10-05-staleness-thuc-te-627c821d.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 11 — Định tuyến chuyên sâu ──────────────────────────────── */
    'nextjs-11-1-catch-all': { yt: 'd46hLIg1B3Q', credit: 'Codevolution — Next.js 15 Tutorial - 9 - Catch all Segments', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/11-dinh-tuyen-chuyen-sau/11-01-catch-all-a9759f55.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-11-2-generate-static-params': { yt: '09aGB_Q6cqE', credit: 'Codevolution — Next.js 15 Tutorial - 56 - generateStaticParams', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/11-dinh-tuyen-chuyen-sau/11-02-generate-static-params-2bb6397e.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-11-3-route-handlers': { yt: '27Uj6BeIDV0', credit: 'Codevolution — Next.js 15 Tutorial - 35 - Route Handlers', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/11-dinh-tuyen-chuyen-sau/11-03-route-handlers-97b4da4f.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-11-4-parallel-routes': { yt: '697kNwfU-4M', credit: 'Codevolution — Next.js 15 Tutorial - 30 - Parallel Routes', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/11-dinh-tuyen-chuyen-sau/11-04-parallel-routes-90330305.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-11-5-intercepting-routes': { yt: 'FTiwIVxWC00', credit: 'Codevolution — Next.js 15 Tutorial - 33 - Intercepting Routes', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/11-dinh-tuyen-chuyen-sau/11-05-intercepting-routes-f52ae23c.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 12 — Server Actions ─────────────────────────────────────── */
    'nextjs-12-1-server-action-la-gi': { yt: 'UKupfEuUc1M', credit: 'developedbyed — Next.js 14 - Server Actions TUTORIAL | Type Safety, Error Handling, Pending States', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/12-server-actions/12-01-server-action-la-gi-3e088c8b.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-12-2-form-action': { yt: 'xWFbnrTap3M', credit: 'Codevolution — Next.js 15 Tutorial - 74 - Forms with Server Actions', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/12-server-actions/12-02-form-action-842634df.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-12-3-revalidate-sau-ghi': { yt: 'SbaKEqCRcDE', credit: 'Codevolution — Next.js 15 Tutorial - 79 - Update Server Action', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/12-server-actions/12-03-revalidate-sau-ghi-06fd2ccc.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-12-4-useactionstate-useformstatus': { yt: 'qpA-eGxASxo', credit: 'Codevolution — Next.js 15 Tutorial - 78 - useFormStatus vs useActionState', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/12-server-actions/12-04-useactionstate-useformstatus-9c0a95e5.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-12-5-bao-mat-action': { yt: 'UiQpt9b_ei4', credit: 'Codevolution — Next.js 15 Tutorial - 77 - Separating Server Actions', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/12-server-actions/12-05-bao-mat-action-550b117a.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 13 — Styling, Tailwind & theme ──────────────────────────── */
    'nextjs-13-1-styling-va-tailwind': { yt: 'UBOj6rqRUME', credit: 'Traversy Media — Tailwind CSS Crash Course', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/13-styling-tailwind/13-01-styling-va-tailwind-48978ed0.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-13-2-tailwind-nen-tang': { yt: '6biMWgD6_JY', credit: 'JavaScript Mastery — Tailwind CSS v4 Full Course 2026 | Master Tailwind in One Hour', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/13-styling-tailwind/13-02-tailwind-nen-tang-aefa074c.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-13-3-dark-mode': { yt: '7zqI4qMDdg8', credit: 'Dave Gray — Next.js Dark Mode with No Flicker + Tailwind CSS', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/13-styling-tailwind/13-03-dark-mode-6a280357.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-13-4-theme-css-variables': { yt: 'H_kSd4kn0E8', credit: 'PedroTech — Tailwind CSS V4 Crash Course 2025 | Become a Tailwind Pro in 1.5 Hours', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/13-styling-tailwind/13-04-theme-css-variables-686664bf.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-13-5-scale-va-bay-mau': { yt: 'UHciHtsuFnw', credit: 'Tom Is Loading — The Advanced TailwindCSS Crash Course', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/13-styling-tailwind/13-05-scale-va-bay-mau-bff45398.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 14 — Quản lý state ──────────────────────────────────────── */
    'nextjs-14-1-hai-loai-state': { yt: 'KkxPtimqaew', credit: 'Austin Davis — TanStack Query - How to Master God-Tier React Query', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/14-quan-ly-state/14-01-hai-loai-state-59017403.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-14-2-zustand': { yt: '-Y8brhQKvtA', credit: 'PedroTech — Zustand Beginner Tutorial - Learn React State Management With Zustand', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/14-quan-ly-state/14-02-zustand-7e4f1454.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-14-3-tanstack-query': { yt: '_EuPZrr3faU', credit: 'Coding in Flow — TanStack React Query v5 - Full Guide (Setup, Mutations, Infinite Loading, Optimistic Updates)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/14-quan-ly-state/14-03-tanstack-query-f4ce18bc.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-14-4-mutations': { yt: 'vaUUALXu8sw', credit: 'Akilesh Rao — Mutations | React/Tanstack Query Series - Part 10', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/14-quan-ly-state/14-04-mutations-fa195a59.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-14-5-chon-cong-cu': { yt: 'e74rB-14-m8', credit: 'PedroTech — React Query Crash Course - Learn Queries, Mutations, Caching, Optimistic Updates...', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/14-quan-ly-state/14-05-chon-cong-cu-7e74b232.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 15 — Xác thực, middleware, cookie ───────────────────────── */
    'nextjs-15-1-nen-tang-auth': { yt: 'H8RxNj492PY', credit: 'Code With Joel — Next.js JWT Auth Explained: Cookies, Refresh Tokens & 2FA (No Auth.js)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/15-auth-middleware/15-01-nen-tang-auth-dbe39e80.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-15-2-cookies': { yt: '7KEwSiD7VxY', credit: 'Codevolution — Next.js 15 Tutorial - 43 - Cookies in Route Handlers', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/15-auth-middleware/15-02-cookies-3f6b0169.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-15-3-middleware': { yt: 't1KTTZbqCm0', credit: 'Codevolution — Next.js 15 Tutorial - 46 - Middleware', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/15-auth-middleware/15-03-middleware-4ac6f314.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-15-4-doc-nguoi-dung': { yt: 'lUqOhq3YxnQ', credit: 'Codevolution — Next.js 15 Tutorial - 89 - Read Session and User Data', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/15-auth-middleware/15-04-doc-nguoi-dung-7e5615ba.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-15-5-refresh-token': { yt: 'j7K8WR7TPQ8', credit: 'Thabish Kader — JWT, Access Tokens, Refresh Tokens with secure cookies | With Complete Flow from Backend to Frontend', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/15-auth-middleware/15-05-refresh-token-869667a2.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 16 — Form, validation, upload ───────────────────────────── */
    'nextjs-16-1-hai-cach-form': { yt: 'T5n7dsQxVnE', credit: 'Code With Joel — Form Validation in Next.js with React Hook Form & Zod', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/16-form-upload/16-01-hai-cach-form-343077fc.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-16-2-react-hook-form': { yt: 'KejZXxFCe2k', credit: 'Codevolution — React Hook Form Tutorial - 1 - Introduction', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/16-form-upload/16-02-react-hook-form-bb3059f0.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-16-3-zod': { yt: 'U9PYyMhDc_k', credit: 'Cosden Solutions — Zod Validation in React (Complete Tutorial)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/16-form-upload/16-03-zod-97efdbb8.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-16-4-upload-file': { yt: 'awxLumuVR9I', credit: 'Tech Khan (Mohammed Khan) — How to Securely Upload Files to AWS S3 with Presigned URL | Node JS presigned url', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/16-form-upload/16-04-upload-file-6c6168f7.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-16-5-upload-bao-mat': { yt: 'O2F8XnsVKkg', credit: 'Coding Shiksha — Node.js Multer File Upload Type Validation Filters and Limit File Size and Error Handling in Express', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/16-form-upload/16-05-upload-bao-mat-f64ecc5d.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 17 — Chiến lược render & SEO ────────────────────────────── */
    'nextjs-17-1-bon-cach-render': { yt: 'AQouuIwjvtA', credit: 'FineGap — Rendering Techniques in Next.js Explained | SSR, SSG, ISR & CSR', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/17-render-seo/17-01-bon-cach-render-441efb41.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-17-2-tinh-vs-dong': { yt: '6-qMfLcPhOw', credit: 'Codevolution — Next.js 15 Tutorial -  47 - Rendering', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/17-render-seo/17-02-tinh-vs-dong-b9d4dde8.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-17-3-seo': { yt: 'a2ovCcxXqNo', credit: 'Codewalk Empire — Next.js 14 - SEO & Metadata Tutorial (Complete Guide)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/17-render-seo/17-03-seo-8c5aeb47.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-17-4-open-graph': { yt: 'FukseskiIkE', credit: 'Batuhan — SEO with Next.js 13 - Dynamic Sitemaps, OG Images and Metadata API', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/17-render-seo/17-04-open-graph-b83c014f.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-17-5-core-web-vitals': { yt: 'cGiSr0MilsI', credit: 'I Code It — Core Web Vitals Explained: LCP, INP & CLS', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/17-render-seo/17-05-core-web-vitals-db6f170c.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 18 — Hiệu năng ──────────────────────────────────────────── */
    'nextjs-18-1-do-truoc': { yt: 'TvrQnBDIDpI', credit: 'CoderOne — The Right way to Optimize Next.js to Score 100 in lighthouse', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/18-hieu-nang/18-01-do-truoc-2d0a006a.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-18-2-next-image': { yt: '7-MxyyDp9Fc', credit: 'Daweb Schools • Technology Tutorials & Courses — Next.js Image Optimization Explained with Real Stats - 99.4% File Size Reduction', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/18-hieu-nang/18-02-next-image-94df4d33.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-18-3-it-javascript': { yt: 'Sk2XRK3tO-A', credit: 'Ben Haig — How I got perfect web vitals on my website (Next.js)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/18-hieu-nang/18-03-it-javascript-7294a623.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-18-4-fonts-assets': { yt: 'owKXh_OsBkQ', credit: 'Blazity — Fix LCP in Next.js: Boost Core Web Vitals Fast | Next.js Optimization Tips #4', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/18-hieu-nang/18-04-fonts-assets-e5ea96d0.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-18-5-do-trung-thuc': { yt: 'KnK-iNA6wXE', credit: 'Code Review — How to properly make LCP Analysis for Next.js App. Largest Contentful Paint. Lighthouse', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/18-hieu-nang/18-05-do-trung-thuc-372c2661.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 19 — Kiểm thử ───────────────────────────────────────────── */
    'nextjs-19-1-vi-sao-test': { yt: '8Xwq35cPwYg', credit: 'Programming with Mosh — React Testing for Beginners: Start Here!', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/19-kiem-thu/19-01-vi-sao-test-d656d169.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-19-2-unit-test-vitest': { yt: 'CxSL0knFxAs', credit: 'PedroTech — React Vite Testing Tutorial For Beginners - Vitest Testing Crash Course', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/19-kiem-thu/19-02-unit-test-vitest-dc90e965.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-19-3-react-testing-library': { yt: '6dOpQIwyV6g', credit: 'RoadsideCoder — React Testing Full Course 2026 | Vitest and React Testing Library Tutorial', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/19-kiem-thu/19-03-react-testing-library-130f9ff4.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-19-4-playwright-e2e': { yt: '3NW0Mz943_E', credit: 'Cosden Solutions — React Testing with Playwright (Complete Tutorial)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/19-kiem-thu/19-04-playwright-e2e-b6831a8e.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-19-5-test-cai-gi': { yt: 'rPTj1fX_inE', credit: 'Codevolution — React Testing Tutorial - 16 - What to test?', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/19-kiem-thu/19-05-test-cai-gi-09eca3f3.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 20 — Build & deploy ─────────────────────────────────────── */
    'nextjs-20-1-build-vs-start': { yt: 'eJBQqzXmTeM', credit: 'Codevolution — Next.js 15 Tutorial - 92 - Deploying Next.js Apps to Vercel', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/20-build-deploy/20-01-build-vs-start-ed7f65da.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-20-2-env-next-public': { yt: 'nNShvLJgvcM', credit: 'Ado Kukic — Learn How to Use Next.js Environment Variables and NEXT_PUBLIC', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/20-build-deploy/20-02-env-next-public-580861a8.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-20-3-docker': { yt: 'd1ntel1pk7s', credit: 'Programming with Umair — Next.js 14+ Docker Tutorial - Dev and Prod Environments using Dockerfile and Docker Compose', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/20-build-deploy/20-03-docker-f718e117.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-20-4-vps-stale-build': { yt: 'DCJiQBag6Fs', credit: 'ByteGrad — Dockerize Next.js 16 & Deploy To VPS (+ Custom Domain, SSL, CDN Cloudflare, Docker Compose)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/20-build-deploy/20-04-vps-stale-build-49dc5006.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-20-5-quy-trinh-an-toan': { yt: 'ipDdja_PduE', credit: 'ByteGrad — Next.js + Postgres Dev / Prod (VPS Coolify, Prisma, Migrations)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/20-build-deploy/20-05-quy-trinh-an-toan-a27a0acd.mp4' }, defaultVideoTrack: 'VI'},
    'nextjs-0-0-bat-dau-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nextjs/00-gioi-thieu/00-02-bat-dau-tai-day-2-13c2dbb6.mp4' }, defaultVideoTrack: 'VI'},
  },
};
