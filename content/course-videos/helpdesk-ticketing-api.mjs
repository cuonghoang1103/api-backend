/**
 * Curated YouTube reference track for INT604 — Helpdesk Ticketing API.
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/helpdesk-ticketing-api.mjs
 *
 * Project-narrative / admin lessons (0.1 intro, 0.2 scope, 0.3 tech-stack,
 * 0.4 env setup, 0.5 demo script) are intentionally left unmapped — no
 * generic teachable topic to point at.
 */
export default {
  courseSlug: 'helpdesk-ticketing-api',
  defaultVideoTrack: 'YT',
  lessons: {
    // 1.1 — Use cases, entities & the ERD → data modeling / ERD
    "int604-erd": { yt: "xsg9BDiwiJE", credit: "Lucid Software — Entity Relationship Diagram (ERD) Tutorial - Part 1" },
    // 1.2 — The schema, status enum & version column → relational schema design
    "int604-schema": { yt: "26ls5lNiijk", credit: "freeCodeCamp.org — Relational Database Design – Full Course" },
    // 2.1 — Project structure & layered architecture
    "int604-backend-setup": { yt: "fc6o1gwqZuA", credit: "Software Developer Diaries — Node.js Project Structure and Architecture Best Practices" },
    // 2.2 — Entities & a GET slice → building an Express REST/CRUD API
    "int604-entities": { yt: "_7UQPve99r4", credit: "freeCodeCamp.org — CRUD API Tutorial – Node, Express, MongoDB" },
    // 3.1 — Register, login & issuing a JWT
    "int604-auth-jwt": { yt: "mbsmsi7l3r4", credit: "Web Dev Simplified — JWT Authentication Tutorial - Node.js" },
    // 3.2 — Roles: who can do what → role-based authorization
    "int604-roles": { yt: "5GG-VUvruzE", credit: "Web Dev Simplified — How To Handle Permissions Like A Senior Dev" },
    // 4.1 — The state machine & atomic assignment → State pattern / state machine
    "int604-assign-core": { yt: "abX4xzaAsoc", credit: "Geekific — The State Pattern Explained and Implemented in Java | Behavioral Design Patterns | Geekific" },
    // 4.2 — Transition endpoints & error responses → Express error handling
    "int604-transition-endpoint": { yt: "WXa1yzLR3hw", credit: "procademy — #91 Global Error Handling Middleware | Error Handling in Express | A Complete NODE JS Course" },
    // 5.1 — Unit / integration / concurrency testing → testing in JS
    "int604-testing": { yt: "FgnxcUQ5vho", credit: "Web Dev Simplified — Introduction To Testing In JavaScript With Jest" },
    // 6.1 — API + Postgres in one Compose file
    "int604-docker": { yt: "sDPw2Yp4JwE", credit: "Smoljames — Build a CRUD API with Docker Node.JS Express.JS & PostgreSQL" },
    // 7.1 — SLA/reports/audit & pessimistic locking → row-level database locks
    "int604-advanced": { yt: "nuBi2XbHH18", credit: "Hussein Nasser — Row-Level Database Locks Explained - (Read vs Exclusive)" },
  },
};
