/**
 * Testing — Chương 4: Test tích hợp với cơ sở dữ liệu thật (soạn chi tiết 01/11/2026).
 * 4.1 vi-sao · 4.2 docker-db · 4.3 testcontainers · 4.4 co-lap (slug giữ từ khung) · Lab 4 (MỚI) · Quiz Chương 4 (MỚI).
 * Code/output ở ./s04/_ma.mjs — sinh bằng scripts/tst/sinh-ma.mjs từ labflow-lite chạy thật (PostgreSQL 17, Testcontainers 12.2.1).
 * TIÊU ĐỀ CHƯƠNG giữ như khung.
 */
import viSao from './s04/vi-sao.mjs';
import dockerDb from './s04/docker-db.mjs';
import testcontainers from './s04/testcontainers.mjs';
import coLap from './s04/co-lap.mjs';
import lab from './s04/lab.mjs';
import quiz from './s04/quiz.mjs';

export default {
  title: 'Chapter 4 — Integration tests with a real database|||Chương 4 — Test tích hợp với cơ sở dữ liệu thật',
  description: 'Adapter PostgreSQL cho cùng port của LabFlow Lite; lỗi tranh chấp Chương 2 được ràng buộc loại trừ chặn và chứng minh trên PostgreSQL 17 thật; Postgres dùng một lần bằng Docker Compose (tmpfs) và Testcontainers; cô lập bằng TRUNCATE hoặc rollback; rồi script cài 8 bug vào SQL và schema.',
  lessons: [viSao, dockerDb, testcontainers, coLap, lab, quiz],
};
