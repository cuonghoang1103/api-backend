/**
 * Curated YouTube reference track for INT609 — AI Study Assistant.
 * Every id verified live+embeddable via YouTube oEmbed.
 *
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/ai-study-assistant.mjs
 *
 * Project-narrative / env-setup / demo-script and app-specific lessons
 * (0.1–0.5, plus 5.1 client citation rendering) are deliberately absent —
 * they map to no generic, teachable tutorial.
 */
export default {
  courseSlug: 'ai-study-assistant',
  defaultVideoTrack: 'YT',
  lessons: {
    'int609-erd': { yt: '26ls5lNiijk', credit: 'freeCodeCamp.org — Relational Database Design – Full Course' },
    'int609-schema': { yt: 'aP7huJs5kAI', credit: 'The Software Mentor — Vector Embeddings with pgvector - PostgreSQL for Developers' },
    'int609-server-proxy': { yt: '-MFiza7ZRzs', credit: 'Dave Gray — How to Build a REST API with Next.js 13' },
    'int609-ingestion': { yt: '8OJC21T2SL4', credit: 'Greg Kamradt — The 5 Levels Of Text Splitting For Retrieval' },
    'int609-retrieval': { yt: 'gl1r1XV0SLw', credit: 'IBM Technology — What is a Vector Database? Powering Semantic Search & AI Applications' },
    'int609-grounding-core': { yt: '_HQ2H_0Ayy0', credit: 'KodeKloud — RAG Explained For Beginners' },
    'int609-chat-endpoint': { yt: '5rhvyHvocaA', credit: 'Adam Thometz — How to Stream Responses from the OpenAI API' },
    'int609-docker': { yt: 'A9bA5HpOk30', credit: 'Ben Awad — Docker Compose Tutorial with PostgreSQL and Node.js' },
    'int609-advanced': { yt: '5ZA1lTxTH3c', credit: 'IBM Technology — Securing AI Agents: How to Prevent Hidden Prompt Injection Attacks' },
  },
};
