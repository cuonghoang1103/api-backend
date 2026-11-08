/**
 * Curated YouTube track for SDN302 — Server-Side Development (Node/Express/MongoDB).
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/server-side-development-nodejs-express-mongodb.mjs
 */
export default {
  courseSlug: 'server-side-development-nodejs-express-mongodb',
  defaultVideoTrack: 'YT',
  lessons: {
    "sdn302-gioi-thieu": { yt: "ENrzD9HAZK4", credit: "Fireship — Node.js Ultimate Beginner’s Guide in 7 Easy Steps", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/server-side-development-nodejs-express-mongodb/00-gioi-thieu-huong-dan-hoc/00-01-gioi-thieu-sdn302-2a7cdc68.mp4' }, defaultVideoTrack: 'VI'},
    "sdn302-1-1-node-event-loop": { yt: "8aGhZQkoFbQ", credit: "JSConf — What the heck is the event loop anyway? | Philip Roberts | JSConf EU", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/02-ben-trong-nodejs-runtime/02-01-nodejs-that-ra-la-gi-01d02e37.mp4' }, defaultVideoTrack: 'VI'},
    "sdn302-1-2-http-server": { yt: "VShtPwEkDD0", credit: "Web Dev Simplified — Your First Node.js Web Server", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/03-cac-module-loi/03-05-server-http-khong-framework-4f1f5ea2.mp4' }, defaultVideoTrack: 'VI'},
    "sdn302-2-1-express-routing": { yt: "SccSCuHhOw0", credit: "Web Dev Simplified — Learn Express JS In 35 Minutes", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/server-side-development-nodejs-express-mongodb/02-express-routing-middleware/02-01-express-routing-app-dau-tien-4dc9cbb2.mp4' }, defaultVideoTrack: 'VI'},
    "sdn302-2-2-middleware": { yt: "lY6icfhap2o", credit: "Web Dev Simplified — Learn Express Middleware In 14 Minutes", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/05-express/05-03-middleware-soi-day-chuyen-tron-8b15042c.mp4' }, defaultVideoTrack: 'VI'},
    "sdn302-3-1-mongodb-crud": { yt: "c2M-rlkkT5o", credit: "Bro Code — Learn MongoDB in 1 hour 🍃", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/server-side-development-nodejs-express-mongodb/03-mongodb-mongoose/03-01-nosql-mongodb-crud-tron-5c25662d.mp4' }, defaultVideoTrack: 'VI'},
    "sdn302-3-2-mongoose": { yt: "DZBGEVgL2eE", credit: "Web Dev Simplified — Mongoose Crash Course - Beginner Through Advanced", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/server-side-development-nodejs-express-mongodb/03-mongodb-mongoose/03-02-mongoose-schema-model-tron-22eff65b.mp4' }, defaultVideoTrack: 'VI'},
    "sdn302-4-1-rest-mvc": { yt: "fgTGADljAeg", credit: "Web Dev Simplified — Build A REST API With Node.js, Express, & MongoDB - Quick", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/server-side-development-nodejs-express-mongodb/04-rest-api-mvc-templating/04-01-rest-api-mvc-tron-c8bfbb78.mp4' }, defaultVideoTrack: 'VI'},
    "sdn302-4-2-templating": { yt: "yXEesONd_54", credit: "Net Ninja — Node.js Crash Course Tutorial #7 - View Engines", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/server-side-development-nodejs-express-mongodb/04-rest-api-mvc-templating/04-02-template-ejs-handlebars-973a212f.mp4' }, defaultVideoTrack: 'VI'},
    "sdn302-5-1-passwords-sessions": { yt: "-RCnNyD0L-s", credit: "Web Dev Simplified — Node.js Passport Login System Tutorial", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/server-side-development-nodejs-express-mongodb/05-xac-thuc-bao-mat/05-01-mat-khau-session-passport-f35cee3b.mp4' }, defaultVideoTrack: 'VI'},
    "sdn302-5-2-jwt-cors": { yt: "mbsmsi7l3r4", credit: "Web Dev Simplified — JWT Authentication Tutorial - Node.js", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/server-side-development-nodejs-express-mongodb/05-xac-thuc-bao-mat/05-02-jwt-https-cors-upload-tron-a91538d9.mp4' }, defaultVideoTrack: 'VI'},
    "sdn302-6-1-react-deploy": { yt: "XxS5srZC3Oc", credit: "CodeWithMasood — How to deploy Node/Express.js app on Render with MongoDB! (Step By Step)" },
    "sdn302-8-1-nestjs-hono": { yt: "wqhNoDE6pb4", credit: "Traversy Media — NestJS Crash Course" },
    "sdn302-8-2-production": { yt: "DYme1m4RiwI", credit: "Software Developer Diaries — Node.js Security Best Practices: JWT blacklisting, rate limiting, schema validation" },
    // YouTube bổ sung 31/10/2026
    'sdn302-cong-cu': { yt: 'bBA9rUdqmgY', credit: 'MongoDB — Getting Started with MongoDB Atlas - A Modern Database!', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/00-gioi-thieu-huong-dan-hoc/00-03-cai-dat-moi-truong-ae3e6b60.mp4' }, defaultVideoTrack: 'VI'},
    'sdn302-project-checklist': { yt: 'ICMnoKxlYYg', credit: 'Dipesh Malvia — JWT Authentication Tutorial With Express & MongoDB | Rest API Project | Node.js for Beginners #10' },
    'sdn302-ngan-hang-de-tai': { yt: 'CnailTcJV_U', credit: 'Dev Mastery — Using Clean Architecture for Microservice APIs in Node.js with MongoDB and Express', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/server-side-development-nodejs-express-mongodb/00-gioi-thieu-huong-dan-hoc/00-05-chon-de-tai-va-mat-diem-a978a37a.mp4' }, defaultVideoTrack: 'VI'},
    'sdn302-dieu-kien-qua-mon': { yt: '-MTSQjw5DrM', credit: 'Fireship — RESTful APIs in 100 Seconds // Build an API from Scratch with Node.js Express', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/server-side-development-nodejs-express-mongodb/00-gioi-thieu-huong-dan-hoc/00-01-gioi-thieu-sdn302-2a7cdc68.mp4' }, defaultVideoTrack: 'VI'},
    'sdn302-chuan-dau-ra': { yt: 'Dco1gzVZKVk', credit: 'Dave Gray — MVC Model-View-Controller Example | CRUD REST API | Node.js & Express tutorials for Beginners', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/server-side-development-nodejs-express-mongodb/00-gioi-thieu-huong-dan-hoc/00-01-gioi-thieu-sdn302-2a7cdc68.mp4' }, defaultVideoTrack: 'VI'},
    'sdn302-chong-mat-diem': { yt: 'FauTQ_g6xgM', credit: 'WittCode — Express Error Handling', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/server-side-development-nodejs-express-mongodb/00-gioi-thieu-huong-dan-hoc/00-05-chon-de-tai-va-mat-diem-a978a37a.mp4' }, defaultVideoTrack: 'VI'},
    // YouTube bổ sung 08/11/2026 (đợt 12b) — id đã dùng ở khoá khác, kiểm lại bằng verify-youtube-videos.mjs
    'sdn302-7-1-exam-question-bank': { yt: '1j_IFw6PXi8', credit: 'ConquerTheFear — What are HTTP Status Codes | REST API | Complete Guide and List of HTTP Status Codes | Cheat Sheet' },
  },
};
