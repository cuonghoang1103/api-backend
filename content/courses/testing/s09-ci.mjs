/**
 * Testing — Chương 9: Test trong CI (soạn chi tiết 01/11/2026).
 * 9.1 github-actions · 9.2 bao-cao · 9.3 bat-buoc · 9.4 ma-tran (slug giữ từ khung) · Lab 9 (MỚI) · Quiz Chương 9 (MỚI).
 * Code/output ở ./s09/_ma.mjs — sinh bằng scripts/tst/sinh-ma.mjs từ labflow-lite chạy thật: workflow chạy bằng act 0.2.94
 * (nektos/act, Docker, ảnh catthehacker/ubuntu:act-24.04) + actionlint 1.7.12 trên máy soạn; phần chỉ có trên GitHub (branch protection,
 * ruleset, skipped = success, fail-fast huỷ nhánh, artifact v4 từ chối tên trùng, concurrency) ghi là TÀI LIỆU đọc 01/11/2026, không phải số đo.
 * TIÊU ĐỀ CHƯƠNG giữ như khung.
 */
import githubActions from './s09/github-actions.mjs';
import baoCao from './s09/bao-cao.mjs';
import batBuoc from './s09/bat-buoc.mjs';
import maTran from './s09/ma-tran.mjs';
import lab from './s09/lab.mjs';
import quiz from './s09/quiz.mjs';

export default {
  title: 'Chapter 9 — Tests in CI|||Chương 9 — Test trong CI',
  description: 'Cắm cả bộ test của LabFlow Lite vào GitHub Actions và chặn merge khi đỏ, mọi lần chạy đều thật bằng act trên máy: workflow đầu tiên (npm ci, cache npm 49,6 s → 15,0 s, service PostgreSQL 17 qua localhost, Playwright --with-deps), đọc một PR đỏ có báo cáo (annotation, job summary — kể cả bản tóm tắt từng nói dối "174 of 174", JUnit, artifact báo cáo + trace), một check bắt buộc duy nhất ci-ok có if: always() (bị bỏ qua được tính là đạt), mã thoát và pipefail, test chập chờn cách ly không chặn ai, cái gì để chạy đêm; ma trận Node 20/22/24 (Node 20 đỏ 4 test qua MSW ⇒ engines >=22.12), shard cân theo thời gian và cái giá của nó (147 s so với 36 s); rồi Lab 9: sửa một pipeline hỏng tới khi một check bắt buộc chặn được bug thật.',
  lessons: [githubActions, baoCao, batBuoc, maTran, lab, quiz],
};
