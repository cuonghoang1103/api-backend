// bao-cao.js — "báo cáo cuối tháng" bị viết hỏng: 3 luồng tính toán không bao giờ dừng (luồng chính + 2 worker_threads).
// Bài 2.1/2.2 cài nó làm thủ phạm ăn CPU để tập chẩn đoán. Chạy: node bao-cao.js
const { Worker } = require('worker_threads');
const spin = 'let x = 0; for (;;) { x = (x * 31 + 7) % 1000003; }';
for (let i = 0; i < 2; i++) new Worker(spin, { eval: true });
let x = 0; for (;;) { x = (x * 31 + 7) % 1000003; }
