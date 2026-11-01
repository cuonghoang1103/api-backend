// store/issues-pg.js — Lab 12 (BẢN KHỞI ĐẦU): kho pg vẫn dùng báo hỏng TRONG RAM của từng instance.
// Việc của bạn: viết lại tệp này cho dữ liệu nằm trong PostgreSQL (bảng issues do migrations/004_issues.sql tạo),
// giữ NGUYÊN giao diện của issues-memory.js: listDeviceIssues, createIssue, listIssues, getIssue, resolveIssue.
export * from './issues-memory.js';
