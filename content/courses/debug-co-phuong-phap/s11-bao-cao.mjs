/**
 * Chương 11 — Bug report, ghi lại bản sửa và postmortem nhỏ (khoá debug-co-phuong-phap). Bài ĐÃ SOẠN, ghép vào khung bằng slug.
 * Mỗi bài một tệp trong s11/ (soạn 24/11/2026 trên máy nhà Linux; output chạy thật: Chrome 150 headless + CDP (HAR), Node 22,
 * node --test, git, PostgreSQL 16, dữ liệu sự cố Lab 10.5 — lưu ở vbg-dp/scratchpad/dbg/lab/ch11).
 * Mã lab: s11/_ma-11.mjs; output: s11/_ra-11.mjs (sinh tự động bởi lab/ch11/tools/sinh.mjs).
 */
import B1 from './s11/dbg-11-1-bug-report.mjs';
import B2 from './s11/dbg-11-2-ghi-lai-ban-sua.mjs';
import B3 from './s11/dbg-11-3-postmortem-nho.mjs';
import B4 from './s11/dbg-11-4-lab.mjs';
import B5 from './s11/dbg-11-5-quiz.mjs';

export default [B1, B2, B3, B4, B5];
