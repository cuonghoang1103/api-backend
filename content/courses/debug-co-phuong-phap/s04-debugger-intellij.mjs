/**
 * Chương 4 — Debugger IntelliJ IDEA cho Java và Spring Boot (khoá debug-co-phuong-phap). Bài ĐÃ SOẠN, ghép vào khung bằng slug.
 * Mỗi bài một tệp trong s04/ (soạn 24/11/2026 trên máy nhà Linux, output chạy thật trong /tmp/dbg-lab/ch4 — lưu ở vbg-dp/scratchpad/dbg/lab/ch4).
 * Ứng dụng mẫu LabFlow Java (Spring Boot 4.1.1 + JPA/Hibernate 7 + Spring Security 7 + PostgreSQL 16) — dựng ở bài 4.1; mã ở s04/_ma-4.mjs.
 * Máy soạn không có GUI: output debugger từ jdb/JDI trên JDWP (cùng giao thức IntelliJ); thao tác IntelliJ theo tài liệu JetBrains.
 */
import B1 from './s04/dbg-4-1-co-ban.mjs';
import B2 from './s04/dbg-4-2-breakpoint-nang-cao.mjs';
import B3 from './s04/dbg-4-3-stream-hotswap.mjs';
import B4 from './s04/dbg-4-4-spring.mjs';
import B5 from './s04/dbg-4-5-remote-jvm.mjs';
import B6 from './s04/dbg-4-6-lab.mjs';
import B7 from './s04/dbg-4-7-quiz.mjs';

export default [B1, B2, B3, B4, B5, B6, B7];
