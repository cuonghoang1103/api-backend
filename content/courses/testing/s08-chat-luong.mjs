/**
 * Testing — Chương 8: Độ phủ, chất lượng và test chập chờn (soạn chi tiết 01/11/2026).
 * 8.1 do-phu · 8.2 mutation · 8.3 flaky · 8.4 toc-do (slug giữ từ khung) · Lab 8 (MỚI) · Quiz Chương 8 (MỚI).
 * Code/output ở ./s08/_ma.mjs — sinh bằng scripts/tst/sinh-ma.mjs từ labflow-lite chạy thật
 * (Vitest 5.0.5 + @vitest/coverage-v8 / coverage-istanbul 5.0.5, StrykerJS 10.1.1 + @stryker-mutator/vitest-runner 10.1.1). TIÊU ĐỀ CHƯƠNG giữ như khung.
 */
import doPhu from './s08/do-phu.mjs';
import mutation from './s08/mutation.mjs';
import flaky from './s08/flaky.mjs';
import tocDo from './s08/toc-do.mjs';
import lab from './s08/lab.mjs';
import quiz from './s08/quiz.mjs';

export default {
  title: 'Chapter 8 — Coverage, quality and flaky tests|||Chương 8 — Độ phủ, chất lượng và test chập chờn',
  description: 'Đọc số liệu của bộ test cho đúng và giữ nó đáng tin, đo thật trên LabFlow Lite: độ phủ v8/istanbul (dòng, nhánh, hàm), 100% dòng mà vẫn để lọt bug, ngưỡng hợp lý và vì sao đuổi 100% là sai; mutation testing bằng StrykerJS (100% độ phủ nhưng chỉ 41,49% đột biến bị diệt, đọc đột biến sống rồi viết test diệt chúng, đột biến tương đương, chế độ incremental, cái giá thời gian); test chập chờn tái hiện có chủ đích — đồng hồ thật, số ngẫu nhiên, thứ tự và trạng thái chung, mạng, tranh chấp — đo tỉ lệ đỏ, retry che lỗi (17/50 thành 0/50), cách ly bằng tag, sửa tận gốc; tốc độ bộ test theo từng tầng, worker, cô lập, chi phí dựng dữ liệu, --changed và shard, số trước/sau; rồi Lab 8: bộ test yếu 100% dòng, 3/8 đột biến, đỏ 10/20 lần khi xáo thứ tự — nâng lên 8/8 và hết chập chờn.',
  lessons: [doPhu, mutation, flaky, tocDo, lab, quiz],
};
