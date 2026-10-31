/**
 * Testing — Chương 7: Test end-to-end với Playwright (soạn chi tiết 01/11/2026).
 * 7.1 playwright · 7.2 luong · 7.3 on-dinh · 7.4 da-trinh-duyet (slug giữ từ khung) · Lab 7 (MỚI) · Quiz Chương 7 (MỚI).
 * Code/output ở ./s07/_ma.mjs — sinh bằng scripts/tst/sinh-ma.mjs từ labflow-lite chạy thật (@playwright/test 1.64.1, Vite 8.3.5; Chromium, Firefox, WebKit).
 * TIÊU ĐỀ CHƯƠNG giữ như khung.
 */
import playwright from './s07/playwright.mjs';
import luong from './s07/luong.mjs';
import onDinh from './s07/on-dinh.mjs';
import daTrinhDuyet from './s07/da-trinh-duyet.mjs';
import lab from './s07/lab.mjs';
import quiz from './s07/quiz.mjs';

export default {
  title: 'Chapter 7 — End-to-end tests with Playwright|||Chương 7 — Test end-to-end với Playwright',
  description: 'LabFlow Lite chạy trọn trong trình duyệt thật: Vite build app React, một server e2e gồm API Chương 5 và đăng nhập demo, Playwright tự bật tất cả; locator theo role và label, strict mode, assertion web-first; đăng nhập một lần bằng setup project và storageState, một hành trình qua hai người dùng, dựng dữ liệu qua API; đo thật test chập chờn do dữ liệu dùng chung (và một lượt đặt trùng thật mà lần chạy xanh che mất), trace, error context, retry báo "flaky"; ba engine và hai điện thoại giả lập, so sánh ảnh chụp; rồi script cài 8 bug ở chỗ nối mà chỉ test đầu-cuối thấy.',
  lessons: [playwright, luong, onDinh, daTrinhDuyet, lab, quiz],
};
