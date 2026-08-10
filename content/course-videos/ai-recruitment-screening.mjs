/**
 * Curated YouTube reference track for INT610 — AI Recruitment Screening.
 * Every id verified live+embeddable via YouTube oEmbed.
 *
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/ai-recruitment-screening.mjs
 *
 * Project-narrative / env-setup / demo-script and app-specific lessons
 * (0.1–0.5, the worked GET slice 2.3, human-in-the-loop 4.2, review screen
 * 5.1) are deliberately absent — they map to no generic, teachable tutorial.
 */
export default {
  courseSlug: 'ai-recruitment-screening',
  defaultVideoTrack: 'YT',
  lessons: {
    'int610-erd': { yt: 'lAtCySGDD48', credit: 'Dr. Daniel Soper — Creating Entity Relationship Diagrams using Draw.io' },
    'int610-schema': { yt: 'fpBYj55-zd8', credit: 'Prisma — How to model relationships (1-1, 1-m, m-m)' },
    'int610-backend-setup': { yt: 'Dco1gzVZKVk', credit: 'Dave Gray — MVC Model-View-Controller Example | CRUD REST API | Node.js & Express tutorials for Beginners' },
    'int610-data-layer': { yt: 'CYH04BJzamo', credit: 'Traversy Media — Prisma Crash Course' },
    'int610-auth': { yt: 'bgk1mI2pak4', credit: 'PedroTech — Managing User Roles - NodeJS Authorization' },
    'int610-structured-core': { yt: '9dSgp4MWpQ0', credit: 'Ian Wootten — OpenAI Function Calling: Structured Data from GPT is Now Much Simpler' },
    'int610-docker': { yt: 'A9bA5HpOk30', credit: 'Ben Awad — Docker Compose Tutorial with PostgreSQL and Node.js' },
    'int610-advanced': { yt: '5ZA1lTxTH3c', credit: 'IBM Technology — Securing AI Agents: How to Prevent Hidden Prompt Injection Attacks' },
  },
};
