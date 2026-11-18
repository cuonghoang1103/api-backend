/**
 * Curated YouTube track for the "React" course.
 * ─────────────────────────────────────────────────────────────────────────────
 * One entry per non-quiz lesson slug → the third-party lecture shown on the YT
 * pill of the learn page, until the Vietnamese/English recordings are made.
 *
 * 26/09/2026: lần đầu cho cả khoá (15 phần, 80 bài không-quiz) — 77 bài có video, 3 bài cố ý để trống vì không có
 * video đạt: rx-3-4-tieng-viet (IME/composition trong React), rx-10-0-slides (dự án giữa khoá), rx-14-0-slides
 * (tổng quan production). Tiêu chí: đúng trọng tâm bài, React 18/19 + hooks; loại class component, React Router ≤ v6
 * cho bài data router, React Query v3, kênh vô danh/nghi AI, video < 3 phút, members-only.
 * Credit = đúng `author_name — title` của oEmbed. Ghép bằng scripts/ghep-video-khoa.mjs (TSV), kiểm bằng
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/react.mjs --cham
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'react',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Vì sao React ── */
    'rx-0-8-bat-dau-tai-day': { yt: '8pDqJVdNa44', credit: "CultRepo — How A Small Team of Developers Created React at Facebook | React.js: The Documentary", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/00-vi-sao-react/00-01-bat-dau-tai-day-react-la-gi-a3451ab3.mp4' }, defaultVideoTrack: 'VI'},
    'rx-0-9-bat-dau-khi-khong-co': { yt: 'WJ2PQe-pQJw', credit: "Academind — jQuery vs Vue, React and Angular", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/00-vi-sao-react/00-02-bat-dau-tai-day-khong-cau-truc-a119dbb3.mp4' }, defaultVideoTrack: 'VI'},
    'rx-0-0-slides': { yt: 'Tn6-PIqc4UM', credit: "Fireship — React in 100 Seconds", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/00-vi-sao-react/00-03-slide-muc-0-ef8fa539.mp4' }, defaultVideoTrack: 'VI'},
    'rx-0-1-cai-dat': { yt: 'RbZyQWOEmD0', credit: "dcode — How To Setup Your First React + TypeScript Project With Vite", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/00-vi-sao-react/00-04-cai-dat-vite-typescript-4d032dac.mp4' }, defaultVideoTrack: 'VI'},
    'rx-0-2-jsx': { yt: '6sg98ju4O-w', credit: "Codevolution — React 19 Tutorial - 6 - JSX", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/00-vi-sao-react/00-05-jsx-giai-thich-cho-ro-d3c0aa8d.mp4' }, defaultVideoTrack: 'VI'},
    'rx-0-3-js-cho-react': { yt: 'm55PTVUrlnA', credit: "PedroTech — All The JavaScript You Need To Know For React", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/00-vi-sao-react/00-06-javascript-cho-react-11759ba9.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 1 — Component và props ── */
    'rx-1-0-slides': { yt: 'zFdDdPMyIAo', credit: "Codevolution — React 19 Tutorial - 4 - Components", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/01-component-va-props/01-01-slide-chuong-1-796c6025.mp4' }, defaultVideoTrack: 'VI'},
    'rx-1-1-component': { yt: 'XUwzASyHr4Q', credit: "Web Dev Simplified — This One Line Of Code Catches React Bugs For You", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/01-component-va-props/01-02-component-la-ham-afc26ff5.mp4' }, defaultVideoTrack: 'VI'},
    'rx-1-2-props': { yt: 'KpA6oEaCHtk', credit: "Codevolution — React TypeScript Tutorial - 3 - Typing Props", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/01-component-va-props/01-03-props-va-kieu-4d3afae8.mp4' }, defaultVideoTrack: 'VI'},
    'rx-1-3-danh-sach': { yt: 'fGxKOmCuH5w', credit: "Cosden Solutions — React Keys and Lists - Complete Tutorial!", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/01-component-va-props/01-04-danh-sach-va-key-1eadd8f7.mp4' }, defaultVideoTrack: 'VI'},
    'rx-1-4-chia-nho': { yt: 'YJPSR9dEQV8', credit: "codeSTACKr — 5 Steps to THINK in React and Easily Create a ReactJS App From Scratch! (Bonus: Tailwind CSS)" },

    /* ── Chương 2 — State và sự kiện ── */
    'rx-2-0-slides': { yt: 'O6P86uwfdR0', credit: "Web Dev Simplified — Learn useState In 15 Minutes - React Hooks Explained", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/02-state-va-su-kien/02-01-slide-chuong-2-d490202b.mp4' }, defaultVideoTrack: 'VI'},
    'rx-2-1-use-state': { yt: 'hjNExKVUHSw', credit: "Codevolution — React 19 Tutorial - 21 - State as a Snapshot", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/02-state-va-su-kien/02-02-use-state-a8c21b6f.mp4' }, defaultVideoTrack: 'VI'},
    'rx-2-2-su-kien': { yt: 'peewECGtPCI', credit: "Codevolution — React 19 Tutorial - 15 - Event Handling", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/02-state-va-su-kien/02-03-su-kien-b4102126.mp4' }, defaultVideoTrack: 'VI'},
    'rx-2-3-object-array': { yt: 'MCIfZlQlmSc', credit: "Codevolution — React 19 Tutorial - 24 - useState with Objects" },
    'rx-2-4-dat-state': { yt: 'YpjvL5SvVhM', credit: "Codevolution — React 19 Tutorial - 26 - Sharing State Between Components", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/02-state-va-su-kien/02-05-dat-state-f1e23e22.mp4' }, defaultVideoTrack: 'VI'},
    'rx-2-5-man-hinh-bac-si': { yt: 'ZoayCCDHFiI', credit: "Dave Gray — Search Filter in React JS with Search Bar in React Example", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/02-state-va-su-kien/02-06-man-hinh-bac-si-446cd3a5.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 3 — Form ── */
    'rx-3-0-slides': { yt: '_QpTQrxzY8A', credit: "Cosden Solutions — The Correct Way to Use Form Data in React" },
    'rx-3-1-controlled': { yt: 'tIdNeoHniEY', credit: "Lama Dev — BEST Ways to Handle and Validate React Forms without a Library", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/03-form/03-02-controlled-bd4a545e.mp4' }, defaultVideoTrack: 'VI'},
    'rx-3-2-react-hook-form': { yt: 'cc_xmawJ8Kg', credit: "Cosden Solutions — React Hook Form - Complete Tutorial (with Zod)", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/03-form/03-03-react-hook-form-eab97e65.mp4' }, defaultVideoTrack: 'VI'},
    'rx-3-3-loi': { yt: 'u6PQ5xZAv7Q', credit: "ByteGrad — React Hook Form (+ Zod) - Complete Tutorial", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/03-form/03-04-loi-4b4f6a29.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 4 — Effect ── */
    'rx-4-0-slides': { yt: '-4XpG5_Lj_o', credit: "Cosden Solutions — Learn React Hooks: useEffect - Simply Explained!" },
    'rx-4-1-use-effect': { yt: 'dH6i3GurZW8', credit: "Jack Herrington — Mastering React's useEffect", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/04-effect/04-02-use-effect-adfde3cd.mp4' }, defaultVideoTrack: 'VI'},
    'rx-4-2-khong-can': { yt: 'V1f8MOQiHRw', credit: "Academind — You might not need useEffect() ...", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/04-effect/04-03-khong-can-9394d33f.mp4' }, defaultVideoTrack: 'VI'},
    'rx-4-3-vong-lap': { yt: 'hT2yWeHU37U', credit: "Jack Herrington — React 19.2 New useEffectEvent Hook: Game Changer or Gimmick?", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/04-effect/04-04-vong-lap-0c9f78bd.mp4' }, defaultVideoTrack: 'VI'},
    'rx-4-4-custom-hook': { yt: '6ThXsUwLWvc', credit: "Web Dev Simplified — Learn Custom Hooks In 10 Minutes", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/04-effect/04-05-custom-hook-98172737.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 5 — Chia sẻ state ── */
    'rx-5-0-slides': { yt: 'MpdFj8MEuJA', credit: "Jack Herrington — Mastering React Context: Do you NEED a state manager?", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/05-chia-se-state/05-01-slide-chuong-5-365067fe.mp4' }, defaultVideoTrack: 'VI'},
    'rx-5-1-context': { yt: '16yMmAJSGek', credit: "ByteGrad — This Context API Mistake Ruins Your Whole React App (All Components Re-Render)", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/05-chia-se-state/05-02-context-ad6166b1.mp4' }, defaultVideoTrack: 'VI'},
    'rx-5-2-reducer': { yt: 'rgp_iCVS8ys', credit: "Cosden Solutions — Learn React Hooks: useReducer - Simply Explained!" },
    'rx-5-3-zustand': { yt: '_ngCLZ5Iz-0', credit: "Cosden Solutions — Zustand - Complete Tutorial", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/05-chia-se-state/05-04-zustand-5a132d77.mp4' }, defaultVideoTrack: 'VI'},
    'rx-5-4-url-state': { yt: 'ukpgxEemXsk', credit: "ByteGrad — STOP using useState, instead put state in URL (in React & Next.js)", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/05-chia-se-state/05-05-url-state-b93e1845.mp4' }, defaultVideoTrack: 'VI'},
    'rx-5-5-du-an': { yt: 'vKJe95pqn8E', credit: "Cosden Solutions — Build a Multi-Step Form in React Like a Pro", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/05-chia-se-state/05-06-du-an-f2cf8504.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 6 — Lấy dữ liệu ── */
    'rx-6-0-slides': { yt: 'lVLz_ASqAio', credit: "Web Dev Simplified — React Query Makes Writing React Code 200% Better", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/06-lay-du-lieu/06-01-slide-chuong-6-795d0208.mp4' }, defaultVideoTrack: 'VI'},
    'rx-6-1-fetch': { yt: 'bGzanfKVFeU', credit: "BeJS — Goodbye, useEffect - David Khourshid", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/06-lay-du-lieu/06-02-fetch-41cd527c.mp4' }, defaultVideoTrack: 'VI'},
    'rx-6-2-tanstack': { yt: 'mPaCnwpFvZY', credit: "Austin Davis — TanStack Query - How to become a React Query God", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/06-lay-du-lieu/06-03-tanstack-a0c2a10a.mp4' }, defaultVideoTrack: 'VI'},
    'rx-6-3-mutation': { yt: 'e74rB-14-m8', credit: "PedroTech — React Query Crash Course - Learn Queries, Mutations, Caching, Optimistic Updates...", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/06-lay-du-lieu/06-04-mutation-26ec8cbf.mp4' }, defaultVideoTrack: 'VI'},
    'rx-6-4-loi-api': { yt: 'OQQAv8t3bfc', credit: "Cosden Solutions — Error Handling in React (Complete Tutorial)" },

    /* ── Chương 7 — Định tuyến và cấu trúc ── */
    'rx-7-0-slides': { yt: 'NVuxUktUvxc', credit: "Maximilian Schwarzmüller — React Router 7 is amazing - despite it's confusing docs!", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/07-dinh-tuyen-va-cau-truc/07-01-slide-chuong-7-0870e689.mp4' }, defaultVideoTrack: 'VI'},
    'rx-7-1-router': { yt: 'oTIJunBa6MA', credit: "Cosden Solutions — React Router - Complete Tutorial", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/07-dinh-tuyen-va-cau-truc/07-02-router-af67c20d.mp4' }, defaultVideoTrack: 'VI'},
    'rx-7-2-layout': { yt: 'l8CS9AMBSIQ', credit: "Net Ninja — React Router in Depth #4 - Nested Routes & Layouts", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/07-dinh-tuyen-va-cau-truc/07-03-layout-043a571a.mp4' }, defaultVideoTrack: 'VI'},
    'rx-7-3-cau-truc': { yt: 'xyxrB2Aa7KE', credit: "Web Dev Simplified — This Folder Structure Makes Me 100% More Productive", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/07-dinh-tuyen-va-cau-truc/07-04-cau-truc-8e8023d1.mp4' }, defaultVideoTrack: 'VI'},
    'rx-7-4-sang-nextjs': { yt: 'AdkNcFUsRQQ', credit: "Vercel — Using React 19 with Vite and Next.js", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/07-dinh-tuyen-va-cau-truc/07-05-sang-nextjs-11e40fdb.mp4' }, defaultVideoTrack: 'VI'},
    'rx-7-5-du-an': { yt: 'oUZjO00NkhY', credit: "Dave Gray — React Protected Routes | Role-Based Authorization | React Router v6", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/07-dinh-tuyen-va-cau-truc/07-06-du-an-7de49d96.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 8 — Hiệu năng và khả năng tiếp cận ── */
    'rx-8-0-slides': { yt: 'uAmRtE52mYk', credit: "React Conf — Exploring React Performance" },
    'rx-8-1-do': { yt: 'CclO4tPoebs', credit: "React Conf — Profiling with React Performance tracks", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/08-hieu-nang-va-tiep-can/08-02-do-4955bb35.mp4' }, defaultVideoTrack: 'VI'},
    'rx-8-2-memo': { yt: 'huBxeruVnAM', credit: "Developer Way — Mastering memoization in React - Advanced React course, Episode 5" },
    'rx-8-3-lazy': { yt: 'JU6sl_yyZqs', credit: "Web Dev Simplified — Speed Up Your React Apps With Code Splitting", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/08-hieu-nang-va-tiep-can/08-04-lazy-812b0aa4.mp4' }, defaultVideoTrack: 'VI'},
    'rx-8-4-a11y': { yt: 'UHjt2A6CS6A', credit: "React Conf — Demystifying accessibility in React apps | Kateryna Porshnieva", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/08-hieu-nang-va-tiep-can/08-05-a11y-92e0b037.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 9 — Test React ── */
    'rx-9-0-slides': { yt: '6dOpQIwyV6g', credit: "RoadsideCoder — React Testing Full Course 2026 | Vitest and React Testing Library Tutorial" },
    'rx-9-1-testing-library': { yt: 'CxSL0knFxAs', credit: "PedroTech — React Vite Testing Tutorial For Beginners - Vitest Testing Crash Course", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/09-test-react/09-02-testing-library-89f46af4.mp4' }, defaultVideoTrack: 'VI'},
    'rx-9-2-async': { yt: 'pP8FQnv6o7A', credit: "Anson — Mock Service Worker with React", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/09-test-react/09-03-async-8fda94a3.mp4' }, defaultVideoTrack: 'VI'},
    'rx-9-3-hook': { yt: 'bvdHVxqjv80', credit: "Jack Herrington — TypeScript/React Testing: Components, Hooks, Custom Hooks, Redux and Zustand", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/09-test-react/09-04-hook-2c57a0f1.mp4' }, defaultVideoTrack: 'VI'},
    'rx-9-4-phong-van': { yt: 'Fha2bVoC8SE', credit: "Paul Dowman's tech events and interviews — Kent C. Dodds – Write tests. Not too many. Mostly integration.", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/09-test-react/09-05-phong-van-6820655e.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 10 — Dự án giữa khoá: giao diện đặt lịch ── */
    'rx-10-1-thiet-ke': { yt: 'AGWyx96lP8U', credit: "Tech With Tim — How I Plan My Coding Projects - 9 Steps", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/10-du-an-giua-khoa/10-01-thiet-ke-cd4d0041.mp4' }, defaultVideoTrack: 'VI'},
    'rx-10-2-xay-dung': { yt: '9ySmMd5Cjc0', credit: "Sam Selikoff — Building an Interactive Calendar with Tailwind UI, React and date-fns", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/10-du-an-giua-khoa/10-03-xay-dung-64d929f2.mp4' }, defaultVideoTrack: 'VI'},
    'rx-10-3-chat-luong': { yt: '2oiBKSjOOFE', credit: "Web Dev Simplified — The Only Accessibility Video You Will Ever Need", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/10-du-an-giua-khoa/10-04-chat-luong-e5699a06.mp4' }, defaultVideoTrack: 'VI'},
    'rx-10-4-tong-ket': { yt: 'hTkS2hlpYbw', credit: "Codeching — Dockerizing a React Vite App for Production with Nginx, manage Environment Variables and Source Maps", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/10-du-an-giua-khoa/10-05-tong-ket-7cb78407.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 11 — React bên trong ── */
    'rx-11-0-slides': { yt: '7YhdqIR2Yzo', credit: "Philip Fabianek — How Does React Actually Work? React.js Deep Dive #1" },
    'rx-11-1-virtual-dom': { yt: 'rKk4XJYzSQA', credit: "Tejas Kumar — React Fiber Reconciliation: How it Works (Part 1)", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/11-react-ben-trong/11-02-virtual-dom-ab28d0a7.mp4' }, defaultVideoTrack: 'VI'},
    'rx-11-2-key-identity': { yt: '76OedwmXlYY', credit: "Developer Way — The mystery of React key: how to write performant lists", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/11-react-ben-trong/11-03-key-identity-b3a532a2.mp4' }, defaultVideoTrack: 'VI'},
    'rx-11-3-strict-mode-ref': { yt: '1UOAI7pFDek', credit: "Sam Selikoff — Why React Strict Mode breaks your app – on purpose" },
    'rx-11-4-portal-error-boundary': { yt: 'LyLa7dU5tp8', credit: "Web Dev Simplified — Learn React Portal In 12 Minutes By Building A Modal", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/11-react-ben-trong/11-05-portal-error-boundary-894fa25f.mp4' }, defaultVideoTrack: 'VI'},
    'rx-11-5-du-an': { yt: '_FuDMEgIy7I', credit: "Web Dev Simplified — Learn React Error Boundaries In 7 Minutes", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/11-react-ben-trong/11-06-du-an-081b0a01.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 12 — React 19 & concurrent ── */
    'rx-12-0-slides': { yt: 'B_2E96URooA', credit: "React Conf — Async React" },
    'rx-12-1-suspense-use': { yt: 't6MeFVF3V9I', credit: "Jack Herrington — Warning: React 19's use Hook Can Impact App Performance", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/12-react-19-concurrent/12-02-suspense-use-0ffcdece.mp4' }, defaultVideoTrack: 'VI'},
    'rx-12-2-transition': { yt: 'lDukIAymutM', credit: "Academind — useTransition() vs useDeferredValue | React 18", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/12-react-19-concurrent/12-03-transition-72caea7f.mp4' }, defaultVideoTrack: 'VI'},
    'rx-12-3-actions': { yt: 'I3AsmAWWGEs', credit: "Callstack — Modern React Patterns: Concurrent Rendering, Actions & What’s Next | Aurora Scharff at RUC 2025", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/12-react-19-concurrent/12-04-actions-ff53ba86.mp4' }, defaultVideoTrack: 'VI'},
    'rx-12-4-compiler-rsc': { yt: 'T-rHmWSZajc', credit: "React Conferences by GitNation — Nadia Makarevich – How React Compiler Performs on Real Code, React Advanced 2024", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/12-react-19-concurrent/12-05-compiler-rsc-4ac41a25.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 13 — Mẫu thiết kế & kiến trúc ── */
    'rx-13-0-slides': { yt: 'MdvzlDIdQ0o', credit: "Cosden Solutions — Design patterns in React" },
    'rx-13-1-compound-headless': { yt: 'N_WgBU3S9W8', credit: "Cosden Solutions — Compound Components in React (Design Patterns)", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/13-mau-thiet-ke-kien-truc/13-02-compound-headless-784bb0a5.mp4' }, defaultVideoTrack: 'VI'},
    'rx-13-2-hook-styling': { yt: 'I2Bgi0Qcdvc', credit: "Cosden Solutions — Custom Hooks in React (Design Patterns)", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/13-mau-thiet-ke-kien-truc/13-03-hook-styling-04ed4abf.mp4' }, defaultVideoTrack: 'VI'},
    'rx-13-3-danh-sach-dai': { yt: 'DBdo7mmuGx4', credit: "Austin Davis — TanStack Virtual - Lightning Fast React Pages" },
    'rx-13-4-bao-mat-i18n': { yt: 'fnQdZdxYxrU', credit: "Coding Garden — XSS Explained with React and Vanilla JS Examples | Cross Site Scripting | dangerouslySetInnerHTML" },

    /* ── Chương 14 — Lên production ── */
    'rx-14-1-xac-thuc': { yt: 'AcYF18oGn6Y', credit: "Cosden Solutions — Authentication in React with JWTs, Access & Refresh Tokens (Complete Tutorial)", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/14-len-production/14-02-xac-thuc-e3356ccc.mp4' }, defaultVideoTrack: 'VI'},
    'rx-14-2-api-that': { yt: 'XAccGbtl3Z8', credit: "Alex Hyett — Idempotency - What it is and How to Implement it", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/14-len-production/14-03-api-that-db8edc37.mp4' }, defaultVideoTrack: 'VI'},
    'rx-14-3-build-deploy': { yt: '9c4HLqk1ExA', credit: "Alexander Lichter — Vite Bundle Inspection made EASY", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/14-len-production/14-04-build-deploy-41ce3559.mp4' }, defaultVideoTrack: 'VI'},
    'rx-14-4-phong-van': { yt: '3BN-YHcJfOY', credit: "CoderOne — The React Interview Questions You need to Know", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/14-len-production/14-05-phong-van-af0aa288.mp4' }, defaultVideoTrack: 'VI'},
    'rx-3-4-tieng-viet': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/03-form/03-05-tieng-viet-f312feb5.mp4' }, defaultVideoTrack: 'VI'},
    'rx-10-0-slides': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/10-du-an-giua-khoa/10-02-slide-chuong-10-856e24a8.mp4' }, defaultVideoTrack: 'VI' },
    'rx-14-0-slides': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/react/14-len-production/14-01-slide-chuong-14-303440b3.mp4' }, defaultVideoTrack: 'VI' },
  },
};
