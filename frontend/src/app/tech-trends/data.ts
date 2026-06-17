// Mock data for the Tech Trends & Insights page.
//
// In a future iteration this would be replaced with a real
// API call (e.g. GET /api/v1/tech-trends). For now the data
// is hand-curated to cover the four categories required by
// the design spec:
//   - TechNews  : standard news / industry updates
//   - FixBug    : deep-dive bug post-mortems (with code blocks)
//   - Experience: interview / on-the-job stories
//   - Interviews: candidate-facing interview prep guides
//
// `featured: true` cards span 2 columns in the bento grid;
// everything else spans 1. `trendingScore` is used for the
// "Trending Tags" sidebar (top-N trending tags).
//
// The `codeBlock` field is intentionally typed as a tiny DSL
// (lang + lines) rather than raw HTML so the rendering stays
// inside React. The BugFix card uses this to render a
// Error → Solution side-by-side.

export type Category = 'TechNews' | 'FixBug' | 'Experience' | 'Interviews';

export type CodeBlock = {
  lang: 'tsx' | 'ts' | 'js' | 'java' | 'bash' | 'json' | 'css' | 'html' | 'sql';
  lines: string[];
};

export type Article = {
  id: string;
  category: Category;
  title: string;
  summary: string;
  body: string[];
  cover?: string;        // emoji fallback — no external image deps
  readTimeMin: number;
  publishedAt: string;   // ISO date
  author: Author;
  tags: string[];
  trendingScore: number; // 0-100; higher = more trending
  featured?: boolean;    // span 2 cols in the bento grid
  // Only used by FixBug cards
  codeBlock?: {
    before: CodeBlock;
    after: CodeBlock;
    takeaway: string;
  };
};

export type Author = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  // gradient classes (Tailwind) for the avatar circle
  gradient: string;
  bio: string;
};

export const AUTHORS: Author[] = [
  {
    id: 'cuong',
    name: 'Cuong Hoang',
    handle: '@cuonghoang',
    initials: 'CH',
    gradient: 'from-neon-indigo to-neon-violet',
    bio: 'Full-stack engineer — Spring Boot, Next.js, AI integrations.',
  },
  {
    id: 'linh',
    name: 'Linh Tran',
    handle: '@linhcodes',
    initials: 'LT',
    gradient: 'from-neon-cyan to-neon-blue',
    bio: 'Frontend perf nerd. Writes about React, RSC, and the platform.',
  },
  {
    id: 'khoi',
    name: 'Khoi Nguyen',
    handle: '@khoibuilds',
    initials: 'KN',
    gradient: 'from-neon-fuchsia to-neon-pink',
    bio: 'Backend infra, Kubernetes, the unglamorous 3am pages.',
  },
  {
    id: 'mai',
    name: 'Mai Phan',
    handle: '@maiinterviews',
    initials: 'MP',
    gradient: 'from-neon-emerald to-neon-green',
    bio: 'Ex-interviewer at 2 unicorns. Writes honest prep guides.',
  },
];

const findAuthor = (id: string): Author => {
  const a = AUTHORS.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown author id: ${id}`);
  return a;
};

export const ARTICLES: Article[] = [
  // 1. Hero / featured — TechNews
  {
    id: 'a-001',
    category: 'TechNews',
    title: 'React 20 ships with first-class Server Actions and the new "use cache" directive',
    summary:
      'The next major React release lands with a smaller client bundle, native streaming forms, and a built-in cache primitive that replaces 80% of the third-party state libraries most apps use today.',
    body: [
      'The React team announced React 20 this week, and the headline change is the stabilisation of Server Actions — the same primitive Next.js has been using in production for two years is now part of core.',
      'The second big change is a new "use cache" directive. Combined with the compiler that shipped in React 19, it means most apps can drop their useSWR / useQuery layer entirely for read-mostly data.',
      'Performance numbers published alongside the release show a 40% reduction in client bundle size for a typical SaaS app, mostly from removing the suspense-and-rerender plumbing that hand-rolled data layers still need.',
    ],
    cover: '⚛️',
    readTimeMin: 6,
    publishedAt: '2026-06-14',
    author: findAuthor('cuong'),
    tags: ['React', 'Next.js', 'Performance'],
    trendingScore: 95,
    featured: true,
  },

  // 2. BugFix — code block
  {
    id: 'a-002',
    category: 'FixBug',
    title: 'Bug fix: useEffect double-fire in React 19 strict mode after hot reload',
    summary:
      'After upgrading to React 19, our WebSocket connection opened twice on every dev hot reload. The bug turned out to be a missing cleanup that we thought strict mode was supposed to handle for us. Here is the exact diff.',
    body: [
      'We upgraded to React 19 on Monday. By Tuesday we had a bug report: the WebSocket connection was opening twice on every dev hot reload, and once in production whenever the user clicked back into a tab.',
      'The cause was simple but easy to miss: in dev, React 19 strict mode mounts → unmounts → remounts every effect, so any effect that opens a connection has to return a cleanup function that closes it. We had a cleanup, but it ran on the wrong reference.',
      'The fix is one line, but the diagnosis took an afternoon. Posting the diff in case it saves someone else the same chase.',
    ],
    cover: '🐛',
    readTimeMin: 8,
    publishedAt: '2026-06-12',
    author: findAuthor('linh'),
    tags: ['React', 'BugFix', 'WebSocket'],
    trendingScore: 88,
    codeBlock: {
      before: {
        lang: 'tsx',
        lines: [
          'useEffect(() => {',
          '  const socket = new WebSocket(WS_URL);',
          '  socket.onmessage = (e) => setMessages(e.data);',
          '  // BUG: stale closure of `socket` after remount',
          '  return () => socket.close();',
          '}, []);',
        ],
      },
      after: {
        lang: 'tsx',
        lines: [
          'useEffect(() => {',
          '  const socket = new WebSocket(WS_URL);',
          '  socket.onmessage = (e) => setMessages(e.data);',
          '  // FIX: return a cleanup that closes THIS socket',
          '  return () => socket.close();',
          '  // also: reconnect flag if you want auto-reconnect',
          '  return () => {',
          '    socket.close();',
          '    if (mountedRef.current) reconnect();',
          '  };',
          '}, []);',
        ],
      },
      takeaway:
        'Always return a cleanup that closes the EXACT instance of the resource you opened. The closure was correct — the instance was not.',
    },
  },

  // 3. Experience
  {
    id: 'a-003',
    category: 'Experience',
    title: 'My first month as the only on-call engineer at a 12-person startup',
    summary:
      'Three pages in week one, a runbook that did not exist, and the one Slack channel I wish I had set up on day zero. A retrospective of what worked and what I would do differently.',
    body: [
      'I joined a 12-person startup as the only backend engineer with on-call rotation. In my first month I took three pages. Here is what I learned, with the noise filtered out.',
      'Runbook gap #1: nobody had written down how to drain a stuck queue. The first page took 40 minutes. The third, after I wrote the runbook, took 4.',
      'The thing I wish I had set up on day zero: a private Slack channel between me and the founders where I could post every near-miss I saw. Two of my three pages were caused by something I had flagged two weeks earlier and forgot about.',
    ],
    cover: '📟',
    readTimeMin: 11,
    publishedAt: '2026-06-10',
    author: findAuthor('khoi'),
    tags: ['SRE', 'OnCall', 'Career'],
    trendingScore: 78,
    featured: true,
  },

  // 4. Interviews prep
  {
    id: 'a-004',
    category: 'Interviews',
    title: 'A senior backend interview loop, decoded: system design, code review, and the "explain your trade-off" question',
    summary:
      'After 30+ loops as both interviewer and candidate, here is the actual rubric most companies use, what each round is really testing, and the three answers that almost always sink a candidate.',
    body: [
      'A typical senior backend loop at a mid-large company has four rounds. Most candidates prep for the wrong ones.',
      'Round 1 is a system design deep-dive. The mistake here is jumping into a diagram in 30 seconds. The interviewer is grading your scoping, not your architecture.',
      'Round 2 is a code review of a real PR the team is about to merge. There is no "right" answer — they want to see if you can defend the design choices you would make as the reviewer.',
      'Round 3 is "explain your trade-off". Pick a project you shipped, walk through one decision you would make differently today. The trap is being too humble. They want to see the framework you use, not a confession.',
    ],
    cover: '🎯',
    readTimeMin: 14,
    publishedAt: '2026-06-08',
    author: findAuthor('mai'),
    tags: ['Interviews', 'Backend', 'Career'],
    trendingScore: 92,
  },

  // 5. Architecture tutorial
  {
    id: 'a-005',
    category: 'TechNews',
    title: 'Architecture: how we cut our p99 from 800ms to 90ms without changing the database',
    summary:
      'A small change to the way we fan out our reads — moving from a single in-process cache to a per-tenant LRU behind the API gateway — shaved 700ms off our p99. No schema change, no new infra.',
    body: [
      'Our p99 was 800ms on a single endpoint. The database was healthy, the CPU was fine, the network was fine. The fix was not in any of those layers.',
      'The endpoint did a fan-out read across three services. Each fan-out had its own connection pool, its own circuit breaker, its own timeout. We were stacking timeouts.',
      'We moved the fan-out behind a per-tenant LRU cache at the gateway. Cache hit = single-digit ms. Cache miss = the same fan-out we had before, but now we could see (and time) each leg separately.',
      'Net result: p99 dropped to 90ms, p50 dropped to 18ms, and our error budget for the month is back to comfortable.',
    ],
    cover: '🏗️',
    readTimeMin: 9,
    publishedAt: '2026-06-06',
    author: findAuthor('cuong'),
    tags: ['Architecture', 'Performance', 'Caching'],
    trendingScore: 84,
  },

  // 6. Quick tips + BugFix
  {
    id: 'a-006',
    category: 'FixBug',
    title: 'Why your Next.js server actions return undefined (and the one-line fix)',
    summary:
      'A subtle issue with how the App Router handles form data when the form is submitted from a nested layout. The action runs, the response is 200, but the form value is undefined on the next render.',
    body: [
      'You have a server action. It does its work. The response is 200. You call revalidatePath. The page re-renders. The form value is undefined.',
      'Cause: in the App Router, a server action invoked from a nested layout returns its value to the CLOSEST useFormState — not to the parent route. If the parent route reads from the same state hook, it sees the old (or undefined) value.',
      'Fix: lift the useFormState to the route segment that owns the read, not the one that owns the form.',
    ],
    cover: '🔧',
    readTimeMin: 5,
    publishedAt: '2026-06-05',
    author: findAuthor('linh'),
    tags: ['Next.js', 'ServerActions', 'BugFix'],
    trendingScore: 70,
    codeBlock: {
      before: {
        lang: 'tsx',
        lines: [
          '// /app/profile/page.tsx (parent)',
          'const [state, action] = useFormState(saveProfile, null);',
          '',
          '// /app/profile/Form.tsx (child)',
          '<form action={action}>...</form>',
          '// ^ returns undefined — child owns useFormState, not parent',
        ],
      },
      after: {
        lang: 'tsx',
        lines: [
          '// /app/profile/Form.tsx (child)',
          'const [state, action] = useFormState(saveProfile, null);',
          'return <form action={action}>...</form>;',
          '',
          '// /app/profile/page.tsx (parent)',
          '// receives the result via revalidatePath, not via useFormState',
        ],
      },
      takeaway:
        'useFormState scopes to the component that calls it. Lift it to wherever the form is rendered, not wherever the data is read.',
    },
  },

  // 7. Interview experience (candidate side)
  {
    id: 'a-007',
    category: 'Experience',
    title: 'I bombed a Google L5 loop. Here is exactly what went wrong, and what I would do differently.',
    summary:
      'An honest write-up of a Google L5 interview loop that ended in a "strong no-hire". The technical feedback, the meta-lessons, and the two things I changed in my prep for the next attempt.',
    body: [
      'I interviewed for L5 at Google in March. I got a "strong no-hire". The feedback was specific and fair, and I want to share it because I think most prep advice online is wrong about what these loops are actually testing.',
      'My system design round was "fine" — the interviewer said the design worked, but I missed the operational section entirely. I never talked about monitoring, rollback, or how I would detect a partial outage.',
      'My coding round was the killer. I solved the problem in 28 minutes but the interviewer wanted 12 minutes of edge-case discussion. I had treated coding as a "write code fast" round, not a "design a solution" round.',
    ],
    cover: '🪞',
    readTimeMin: 12,
    publishedAt: '2026-06-02',
    author: findAuthor('mai'),
    tags: ['Interviews', 'Google', 'Career'],
    trendingScore: 81,
  },
];

// ── Helpers used by the sidebar ──────────────────────────────────

export const TRENDING_TAGS = (n = 8) => {
  const tagScores = new Map<string, number>();
  for (const a of ARTICLES) {
    for (const t of a.tags) {
      tagScores.set(t, (tagScores.get(t) ?? 0) + a.trendingScore);
    }
  }
  return [...tagScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([tag, score]) => ({ tag, score }));
};

export const QUICK_TIPS = [
  {
    title: 'Use `useTransition` for any state change that touches a server action',
    body: 'It marks the update as non-urgent, so the user can keep typing while the request is in flight.',
  },
  {
    title: 'Profile before you optimise — `performance.now()` is your friend',
    body: '90% of the time the bottleneck is not where you think it is. Measure twice, optimise once.',
  },
  {
    title: 'When in doubt, return the cleanup function',
    body: 'Even if the effect is "obviously safe". Future-you will not remember why the cleanup was there.',
  },
  {
    title: 'Schema migrations are forever — never drop a column in the same deploy',
    body: 'Add the new column, dual-write, backfill, then drop in a follow-up deploy once the read traffic has moved.',
  },
];

export const TOP_AUTHORS = (n = 3) => {
  const authorScores = new Map<string, number>();
  for (const a of ARTICLES) {
    authorScores.set(a.author.id, (authorScores.get(a.author.id) ?? 0) + a.trendingScore);
  }
  return [...authorScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id, score]) => ({ author: findAuthor(id), score }));
};

export const CATEGORY_TABS: { id: 'All' | Category; label: string; emoji: string; accent: string }[] = [
  { id: 'All',         label: 'All',         emoji: '✨', accent: 'from-neon-indigo to-neon-violet' },
  { id: 'TechNews',    label: '#TechNews',   emoji: '📰', accent: 'from-neon-emerald to-neon-green'  },
  { id: 'FixBug',      label: '#FixBug',     emoji: '🐛', accent: 'from-neon-red to-neon-pink'       },
  { id: 'Experience',  label: '#Experience', emoji: '💼', accent: 'from-neon-cyan to-neon-blue'      },
  { id: 'Interviews',  label: '#Interviews', emoji: '🎯', accent: 'from-neon-fuchsia to-neon-violet' },
];
