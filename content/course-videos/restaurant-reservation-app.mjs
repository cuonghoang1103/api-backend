/**
 * Curated YouTube reference track for INT608 — Restaurant Reservation App.
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/restaurant-reservation-app.mjs
 */
export default {
  courseSlug: 'restaurant-reservation-app',
  defaultVideoTrack: 'YT',
  lessons: {
    // 1.1 — Use cases, entities & the ERD
    "int608-erd": { yt: "6uwuNRUUimY", credit: "Cody Baldwin — Introduction to Entity Relationship Diagrams (ERDs)" },
    // 1.2 — The schema, keys & constraints
    "int608-schema": { yt: "26ls5lNiijk", credit: "freeCodeCamp.org — Relational Database Design – Full Course" },
    // 2.1 — Project setup & the layered architecture
    "int608-backend-setup": { yt: "fc6o1gwqZuA", credit: "Software Developer Diaries — Node.js Project Structure and Architecture Best Practices" },
    // 3.1 — Register, login, issue a JWT
    "int608-auth-jwt": { yt: "favjC6EKFgw", credit: "Dave Gray — JWT Authentication | Node JS and Express tutorials for Beginners" },
    // 3.2 — Role-based authorization
    "int608-roles": { yt: "bgk1mI2pak4", credit: "PedroTech — Managing User Roles - NodeJS Authorization" },
    // 4.1 — Assigning a free table atomically (transactions/atomicity)
    "int608-reservation-core": { yt: "6vqzOjfZDco", credit: "Hussein Nasser — Relational Database Atomicity Explained By Example" },
    // 4.2 — Building the reservation endpoint & cancel flow (Express CRUD)
    "int608-reservation-endpoint": { yt: "_7UQPve99r4", credit: "freeCodeCamp.org — CRUD API Tutorial – Node, Express, MongoDB" },
    // 5.1 — The client: widgets, state & the reserve flow
    "int608-flutter-client": { yt: "1gDhl4leEzA", credit: "Traversy Media — Flutter Crash Course" },
    // 6.1 — Docker for the API
    "int608-docker": { yt: "9zUHg7xjIqQ", credit: "freeCodeCamp.org — Learn Docker - DevOps with Node.js & Express" },
    // 7.1 — Time zones (from the advanced/holds/reminders lesson)
    "int608-advanced": { yt: "-5wpm-gesOY", credit: "Computerphile — The Problem with Time & Timezones - Computerphile" },
  },
};
