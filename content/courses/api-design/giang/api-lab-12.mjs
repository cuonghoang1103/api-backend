/** Giảng theo slide — bài Lab 12 "Lab 12 — Báo hỏng lên PostgreSQL" (deck api-lab-12, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-lab-12', 'Lab 12 — Issues on PostgreSQL', 'Lab 12 — Báo hỏng lên PostgreSQL', [
  [1, 'Cover', `<p>The resource left behind on purpose, graded on two instances.</p>`, `<p>Tài nguyên được cố ý để lại, chấm trên hai instance.</p>`],
  [2, 'Starter', `<p>Zero of ten: every failure is a lesson of this chapter.</p>`, `<p>Không trên mười: lỗi nào cũng là một bài của chương.</p>`],
  [3, 'Tasks', `<p>A migration, a store with the same five functions, and the proof.</p>`, `<p>Một migration, một store đúng năm hàm, và phần chứng minh.</p>`],
  [4, 'Rubric', `<p>Seven checks, ten points, run against both instances.</p>`, `<p>Bảy phép kiểm, mười điểm, chạy trên cả hai instance.</p>`],
  [5, 'Solution', `<p>A partial unique index, a two-table transaction, a conditional UPDATE: ten of ten.</p>`, `<p>Index duy nhất có điều kiện, transaction hai bảng, UPDATE có điều kiện: mười trên mười.</p>`],
  [6, 'Hand-in', `<p>Say which rule lives where, and why.</p>`, `<p>Nói luật nào nằm ở đâu, và vì sao.</p>`],
]);
