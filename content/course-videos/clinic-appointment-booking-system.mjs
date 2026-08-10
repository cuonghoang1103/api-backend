/**
 * Curated YouTube reference track for INT601 — Clinic Appointment Booking System.
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/clinic-appointment-booking-system.mjs
 */
export default {
  courseSlug: 'clinic-appointment-booking-system',
  defaultVideoTrack: 'YT',
  lessons: {
    // 1.1 — Use cases, entities & the ERD
    "int601-erd": { yt: "6uwuNRUUimY", credit: "Cody Baldwin — Introduction to Entity Relationship Diagrams (ERDs)" },
    // 1.2 — Schema & the unique-index constraint that prevents double-booking
    "int601-schema": { yt: "D14wWW9EEx8", credit: "Net Ninja — Complete MongoDB Tutorial #24 - Indexes" },
    // 2.1 — Project setup & the layered architecture
    "int601-backend-setup": { yt: "4sk7n2l4qXg", credit: "Code with Nevyan — Node.js REST API Tutorial: Clean Architecture with Model-Router-Controller" },
    // 2.2 — Entities & repositories
    "int601-entities": { yt: "5hlcrDKnRvY", credit: "Code Legends — Typescript Design Patterns: Repository design pattern" },
    // 3.1 — Register, login & issue a JWT
    "int601-auth-jwt": { yt: "b9WlsQMGWMQ", credit: "PedroTech — Registration and Login with JWT Authentication Tutorial - NodeJS Tutorial" },
    // 3.2 — Role-based authorization
    "int601-roles": { yt: "5GG-VUvruzE", credit: "Web Dev Simplified — How To Handle Permissions Like A Senior Dev" },
    // 4.1 — Booking in a transaction & the race condition
    "int601-booking-core": { yt: "_95dCYv2Xv4", credit: "Hussein Nasser — How to Avoid Double Booking and Race Conditions in Online Web Applications" },
    // 5.1 — React setup, auth context & the axios interceptor
    "int601-react-auth": { yt: "16-1mTdGBoM", credit: "Dennis Ivy — Refreshing Tokens With Axios Interceptors" },
    // 6.1 — Unit, integration & the concurrency test
    "int601-testing": { yt: "4MwaWh86T64", credit: "Paul Arah — Intro to Testing & Testing Node.js APIs with Jest and Supertest" },
    // 7.1 — Dockerize & compose the whole system
    "int601-docker": { yt: "0B2raYYH2fE", credit: "DevOps Directive — Docker Compose in 6 minutes! Mongo, Express, React, Node (MERN) Application Tutorial" },
    // 8.1 — Pessimistic lock, concurrency
    "int601-advanced": { yt: "3unOa-OwOm8", credit: "Michael Olech Coding — Optimistic vs Pessimistic Locks: PostgreSQL Concurrency Explained!" },
  },
};
