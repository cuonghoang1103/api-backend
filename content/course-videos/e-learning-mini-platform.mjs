/**
 * Curated YouTube reference track for INT605 — E-Learning Mini Platform.
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/e-learning-mini-platform.mjs
 */
export default {
  courseSlug: 'e-learning-mini-platform',
  defaultVideoTrack: 'YT',
  lessons: {
    "int605-erd": { yt: "7V95C43ujlU", credit: "Neso Academy — ER Diagram for University Database" },
    "int605-schema": { yt: "CYH04BJzamo", credit: "Traversy Media — Prisma Crash Course" },
    "int605-setup-route-handlers": { yt: "27Uj6BeIDV0", credit: "Codevolution — Next.js 15 Tutorial - 35 - Route Handlers" },
    "int605-server-components": { yt: "bKm1rNaCFOo", credit: "ByteGrad — This Next.js Data Fetching Pattern Is CRITICAL For Every Developer" },
    "int605-auth": { yt: "ay-atEUGIc4", credit: "Dave Gray — Next.js Role-Based User Authorization & Access Control | Next Auth Protected Routes" },
    "int605-one-attempt": { yt: "4ri417sC_A8", credit: "Jamie King — SQL Unique Constraints" },
    "int605-quiz-client": { yt: "_OZgf-8wtXY", credit: "Cosden Solutions — Combining Server and Client Components in React" },
    "int605-docker": { yt: "DCJiQBag6Fs", credit: "ByteGrad — Dockerize Next.js 16 & Deploy To VPS (+ Custom Domain, SSL, CDN Cloudflare, Docker Compose)" },
  },
};
