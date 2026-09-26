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
    'rx-0-8-bat-dau-tai-day': { yt: '8pDqJVdNa44', credit: "CultRepo — How A Small Team of Developers Created React at Facebook | React.js: The Documentary" },
    'rx-0-9-bat-dau-khi-khong-co': { yt: 'WJ2PQe-pQJw', credit: "Academind — jQuery vs Vue, React and Angular" },
    'rx-0-0-slides': { yt: 'Tn6-PIqc4UM', credit: "Fireship — React in 100 Seconds" },
    'rx-0-1-cai-dat': { yt: 'RbZyQWOEmD0', credit: "dcode — How To Setup Your First React + TypeScript Project With Vite" },
    'rx-0-2-jsx': { yt: '6sg98ju4O-w', credit: "Codevolution — React 19 Tutorial - 6 - JSX" },
    'rx-0-3-js-cho-react': { yt: 'm55PTVUrlnA', credit: "PedroTech — All The JavaScript You Need To Know For React" },

    /* ── Chương 1 — Component và props ── */
    'rx-1-0-slides': { yt: 'zFdDdPMyIAo', credit: "Codevolution — React 19 Tutorial - 4 - Components" },
    'rx-1-1-component': { yt: 'XUwzASyHr4Q', credit: "Web Dev Simplified — This One Line Of Code Catches React Bugs For You" },
    'rx-1-2-props': { yt: 'KpA6oEaCHtk', credit: "Codevolution — React TypeScript Tutorial - 3 - Typing Props" },
    'rx-1-3-danh-sach': { yt: 'fGxKOmCuH5w', credit: "Cosden Solutions — React Keys and Lists - Complete Tutorial!" },
    'rx-1-4-chia-nho': { yt: 'YJPSR9dEQV8', credit: "codeSTACKr — 5 Steps to THINK in React and Easily Create a ReactJS App From Scratch! (Bonus: Tailwind CSS)" },

    /* ── Chương 2 — State và sự kiện ── */
    'rx-2-0-slides': { yt: 'O6P86uwfdR0', credit: "Web Dev Simplified — Learn useState In 15 Minutes - React Hooks Explained" },
    'rx-2-1-use-state': { yt: 'hjNExKVUHSw', credit: "Codevolution — React 19 Tutorial - 21 - State as a Snapshot" },
    'rx-2-2-su-kien': { yt: 'peewECGtPCI', credit: "Codevolution — React 19 Tutorial - 15 - Event Handling" },
    'rx-2-3-object-array': { yt: 'MCIfZlQlmSc', credit: "Codevolution — React 19 Tutorial - 24 - useState with Objects" },
    'rx-2-4-dat-state': { yt: 'YpjvL5SvVhM', credit: "Codevolution — React 19 Tutorial - 26 - Sharing State Between Components" },
    'rx-2-5-man-hinh-bac-si': { yt: 'ZoayCCDHFiI', credit: "Dave Gray — Search Filter in React JS with Search Bar in React Example" },

    /* ── Chương 3 — Form ── */
    'rx-3-0-slides': { yt: '_QpTQrxzY8A', credit: "Cosden Solutions — The Correct Way to Use Form Data in React" },
    'rx-3-1-controlled': { yt: 'tIdNeoHniEY', credit: "Lama Dev — BEST Ways to Handle and Validate React Forms without a Library" },
    'rx-3-2-react-hook-form': { yt: 'cc_xmawJ8Kg', credit: "Cosden Solutions — React Hook Form - Complete Tutorial (with Zod)" },
    'rx-3-3-loi': { yt: 'u6PQ5xZAv7Q', credit: "ByteGrad — React Hook Form (+ Zod) - Complete Tutorial" },

    /* ── Chương 4 — Effect ── */
    'rx-4-0-slides': { yt: '-4XpG5_Lj_o', credit: "Cosden Solutions — Learn React Hooks: useEffect - Simply Explained!" },
    'rx-4-1-use-effect': { yt: 'dH6i3GurZW8', credit: "Jack Herrington — Mastering React's useEffect" },
    'rx-4-2-khong-can': { yt: 'V1f8MOQiHRw', credit: "Academind — You might not need useEffect() ..." },
    'rx-4-3-vong-lap': { yt: 'hT2yWeHU37U', credit: "Jack Herrington — React 19.2 New useEffectEvent Hook: Game Changer or Gimmick?" },
    'rx-4-4-custom-hook': { yt: '6ThXsUwLWvc', credit: "Web Dev Simplified — Learn Custom Hooks In 10 Minutes" },

    /* ── Chương 5 — Chia sẻ state ── */
    'rx-5-0-slides': { yt: 'MpdFj8MEuJA', credit: "Jack Herrington — Mastering React Context: Do you NEED a state manager?" },
    'rx-5-1-context': { yt: '16yMmAJSGek', credit: "ByteGrad — This Context API Mistake Ruins Your Whole React App (All Components Re-Render)" },
    'rx-5-2-reducer': { yt: 'rgp_iCVS8ys', credit: "Cosden Solutions — Learn React Hooks: useReducer - Simply Explained!" },
    'rx-5-3-zustand': { yt: '_ngCLZ5Iz-0', credit: "Cosden Solutions — Zustand - Complete Tutorial" },
    'rx-5-4-url-state': { yt: 'ukpgxEemXsk', credit: "ByteGrad — STOP using useState, instead put state in URL (in React & Next.js)" },
    'rx-5-5-du-an': { yt: 'vKJe95pqn8E', credit: "Cosden Solutions — Build a Multi-Step Form in React Like a Pro" },

    /* ── Chương 6 — Lấy dữ liệu ── */
    'rx-6-0-slides': { yt: 'lVLz_ASqAio', credit: "Web Dev Simplified — React Query Makes Writing React Code 200% Better" },
    'rx-6-1-fetch': { yt: 'bGzanfKVFeU', credit: "BeJS — Goodbye, useEffect - David Khourshid" },
    'rx-6-2-tanstack': { yt: 'mPaCnwpFvZY', credit: "Austin Davis — TanStack Query - How to become a React Query God" },
    'rx-6-3-mutation': { yt: 'e74rB-14-m8', credit: "PedroTech — React Query Crash Course - Learn Queries, Mutations, Caching, Optimistic Updates..." },
    'rx-6-4-loi-api': { yt: 'OQQAv8t3bfc', credit: "Cosden Solutions — Error Handling in React (Complete Tutorial)" },

    /* ── Chương 7 — Định tuyến và cấu trúc ── */
    'rx-7-0-slides': { yt: 'NVuxUktUvxc', credit: "Maximilian Schwarzmüller — React Router 7 is amazing - despite it's confusing docs!" },
    'rx-7-1-router': { yt: 'oTIJunBa6MA', credit: "Cosden Solutions — React Router - Complete Tutorial" },
    'rx-7-2-layout': { yt: 'l8CS9AMBSIQ', credit: "Net Ninja — React Router in Depth #4 - Nested Routes & Layouts" },
    'rx-7-3-cau-truc': { yt: 'xyxrB2Aa7KE', credit: "Web Dev Simplified — This Folder Structure Makes Me 100% More Productive" },
    'rx-7-4-sang-nextjs': { yt: 'AdkNcFUsRQQ', credit: "Vercel — Using React 19 with Vite and Next.js" },
    'rx-7-5-du-an': { yt: 'oUZjO00NkhY', credit: "Dave Gray — React Protected Routes | Role-Based Authorization | React Router v6" },

    /* ── Chương 8 — Hiệu năng và khả năng tiếp cận ── */
    'rx-8-0-slides': { yt: 'uAmRtE52mYk', credit: "React Conf — Exploring React Performance" },
    'rx-8-1-do': { yt: 'CclO4tPoebs', credit: "React Conf — Profiling with React Performance tracks" },
    'rx-8-2-memo': { yt: 'huBxeruVnAM', credit: "Developer Way — Mastering memoization in React - Advanced React course, Episode 5" },
    'rx-8-3-lazy': { yt: 'JU6sl_yyZqs', credit: "Web Dev Simplified — Speed Up Your React Apps With Code Splitting" },
    'rx-8-4-a11y': { yt: 'UHjt2A6CS6A', credit: "React Conf — Demystifying accessibility in React apps | Kateryna Porshnieva" },

    /* ── Chương 9 — Test React ── */
    'rx-9-0-slides': { yt: '6dOpQIwyV6g', credit: "RoadsideCoder — React Testing Full Course 2026 | Vitest and React Testing Library Tutorial" },
    'rx-9-1-testing-library': { yt: 'CxSL0knFxAs', credit: "PedroTech — React Vite Testing Tutorial For Beginners - Vitest Testing Crash Course" },
    'rx-9-2-async': { yt: 'pP8FQnv6o7A', credit: "Anson — Mock Service Worker with React" },
    'rx-9-3-hook': { yt: 'bvdHVxqjv80', credit: "Jack Herrington — TypeScript/React Testing: Components, Hooks, Custom Hooks, Redux and Zustand" },
    'rx-9-4-phong-van': { yt: 'Fha2bVoC8SE', credit: "Paul Dowman's tech events and interviews — Kent C. Dodds – Write tests. Not too many. Mostly integration." },

    /* ── Chương 10 — Dự án giữa khoá: giao diện đặt lịch ── */
    'rx-10-1-thiet-ke': { yt: 'AGWyx96lP8U', credit: "Tech With Tim — How I Plan My Coding Projects - 9 Steps" },
    'rx-10-2-xay-dung': { yt: '9ySmMd5Cjc0', credit: "Sam Selikoff — Building an Interactive Calendar with Tailwind UI, React and date-fns" },
    'rx-10-3-chat-luong': { yt: '2oiBKSjOOFE', credit: "Web Dev Simplified — The Only Accessibility Video You Will Ever Need" },
    'rx-10-4-tong-ket': { yt: 'hTkS2hlpYbw', credit: "Codeching — Dockerizing a React Vite App for Production with Nginx, manage Environment Variables and Source Maps" },

    /* ── Chương 11 — React bên trong ── */
    'rx-11-0-slides': { yt: '7YhdqIR2Yzo', credit: "Philip Fabianek — How Does React Actually Work? React.js Deep Dive #1" },
    'rx-11-1-virtual-dom': { yt: 'rKk4XJYzSQA', credit: "Tejas Kumar — React Fiber Reconciliation: How it Works (Part 1)" },
    'rx-11-2-key-identity': { yt: '76OedwmXlYY', credit: "Developer Way — The mystery of React key: how to write performant lists" },
    'rx-11-3-strict-mode-ref': { yt: '1UOAI7pFDek', credit: "Sam Selikoff — Why React Strict Mode breaks your app – on purpose" },
    'rx-11-4-portal-error-boundary': { yt: 'LyLa7dU5tp8', credit: "Web Dev Simplified — Learn React Portal In 12 Minutes By Building A Modal" },
    'rx-11-5-du-an': { yt: '_FuDMEgIy7I', credit: "Web Dev Simplified — Learn React Error Boundaries In 7 Minutes" },

    /* ── Chương 12 — React 19 & concurrent ── */
    'rx-12-0-slides': { yt: 'B_2E96URooA', credit: "React Conf — Async React" },
    'rx-12-1-suspense-use': { yt: 't6MeFVF3V9I', credit: "Jack Herrington — Warning: React 19's use Hook Can Impact App Performance" },
    'rx-12-2-transition': { yt: 'lDukIAymutM', credit: "Academind — useTransition() vs useDeferredValue | React 18" },
    'rx-12-3-actions': { yt: 'I3AsmAWWGEs', credit: "Callstack — Modern React Patterns: Concurrent Rendering, Actions & What’s Next | Aurora Scharff at RUC 2025" },
    'rx-12-4-compiler-rsc': { yt: 'T-rHmWSZajc', credit: "React Conferences by GitNation — Nadia Makarevich – How React Compiler Performs on Real Code, React Advanced 2024" },

    /* ── Chương 13 — Mẫu thiết kế & kiến trúc ── */
    'rx-13-0-slides': { yt: 'MdvzlDIdQ0o', credit: "Cosden Solutions — Design patterns in React" },
    'rx-13-1-compound-headless': { yt: 'N_WgBU3S9W8', credit: "Cosden Solutions — Compound Components in React (Design Patterns)" },
    'rx-13-2-hook-styling': { yt: 'I2Bgi0Qcdvc', credit: "Cosden Solutions — Custom Hooks in React (Design Patterns)" },
    'rx-13-3-danh-sach-dai': { yt: 'DBdo7mmuGx4', credit: "Austin Davis — TanStack Virtual - Lightning Fast React Pages" },
    'rx-13-4-bao-mat-i18n': { yt: 'fnQdZdxYxrU', credit: "Coding Garden — XSS Explained with React and Vanilla JS Examples | Cross Site Scripting | dangerouslySetInnerHTML" },

    /* ── Chương 14 — Lên production ── */
    'rx-14-1-xac-thuc': { yt: 'AcYF18oGn6Y', credit: "Cosden Solutions — Authentication in React with JWTs, Access & Refresh Tokens (Complete Tutorial)" },
    'rx-14-2-api-that': { yt: 'XAccGbtl3Z8', credit: "Alex Hyett — Idempotency - What it is and How to Implement it" },
    'rx-14-3-build-deploy': { yt: '9c4HLqk1ExA', credit: "Alexander Lichter — Vite Bundle Inspection made EASY" },
    'rx-14-4-phong-van': { yt: '3BN-YHcJfOY', credit: "CoderOne — The React Interview Questions You need to Know" },
  },
};
