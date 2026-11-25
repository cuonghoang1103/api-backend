/**
 * Chương 12 — Log cơ sở dữ liệu (soạn chi tiết 24/11/2026, agent lgz). Bài tách ở ./s12/.
 * Lệnh + output thật: ./_ma.mjs — sinh từ ./_demo/s12/ (bash _demo/s12/chay-s12.bash <thư mục làm việc>: PostgreSQL 17.12 + pgAudit + pgBadger 13.3
 * trong container lgz-pg12 --network none (máy khách = IP giả gắn lên lo), MySQL 8.4.13, SQL Server 2022 CU28, Lab 12 = compose PostgreSQL + API Node 22/pg 8.16),
 * rồi node scratchpad/lgz/cong-cu/sinh-ma.mjs (repo: scripts/log-khoa/sinh-ma.mjs). Tệp lệnh đuôi .bash — chay-demo.py không chạy chúng.
 */
import L121 from './s12/log-12-1-postgres-log.mjs';
import L122 from './s12/log-12-2-slow-query.mjs';
import L123 from './s12/log-12-3-kiem-toan-db.mjs';
import L124 from './s12/log-12-4-mysql-sqlserver.mjs';
import L125 from './s12/log-12-5-lab.mjs';
import L126 from './s12/log-12-6-quiz.mjs';

export default { lessons: [L121, L122, L123, L124, L125, L126] };
