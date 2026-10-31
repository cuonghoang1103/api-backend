/** Giảng theo slide — Lab 4 (deck tst-lab-4, 8 slide). */
import { walkTst } from '../_slides.mjs';

export default walkTst('tst-lab-4', 'Lab 4 — the database adapter: kill 8 mutants', 'Lab 4 — adapter cơ sở dữ liệu: diệt 8 đột biến', [
  [1, 'Lab 4 — the database adapter: kill 8 mutants',
    `<p>The chapter lab: integration tests for the PostgreSQL adapter, the schema and <code>bookLab</code>. Every mutant gets a fresh database.</p>`,
    `<p>Lab của chương: test tích hợp cho adapter PostgreSQL, schema và <code>bookLab</code>. Mỗi đột biến được một cơ sở dữ liệu mới.</p>`],
  [2, 'Your mission',
    `<p>Write isolated integration tests, then run <code>dot-bien-4.mjs</code>. Two of the eight bugs live in the schema file — only a real database can notice them.</p>`,
    `<p>Viết test tích hợp cô lập, rồi chạy <code>dot-bien-4.mjs</code>. Hai trong tám con bug nằm trong file schema — chỉ cơ sở dữ liệu thật mới nhận ra chúng.</p>`],
  [3, 'The 8 planted bugs',
    `<p>Two boundary mistakes in SQL, a missing lab filter, a missing date filter, the wrong error code, inclusive bounds in the constraint, a missing CHECK, and the database’s OVERLAP turned into STORAGE_DOWN.</p>`,
    `<p>Hai lỗi biên trong SQL, thiếu điều kiện phòng, thiếu điều kiện ngày, sai mã lỗi, cận đóng trong ràng buộc, mất CHECK, và OVERLAP của cơ sở dữ liệu bị biến thành STORAGE_DOWN.</p>`],
  [4, 'A typical first attempt: 0 of 8',
    `<p>Three green tests with clearly overlapping times in one lab on one day. The second booking is stopped by <code>findOverlap</code>, so the constraint and the error mapping never run.</p>`,
    `<p>Ba test xanh với các giờ chồng nhau rõ ràng, một phòng, một ngày. Lượt đặt thứ hai bị <code>findOverlap</code> chặn, nên ràng buộc và phần đổi mã lỗi không bao giờ chạy.</p>`],
  [5, 'The reference solution: 8 of 8',
    `<p>Eleven tests: a table of neighbouring slots, direct inserts that reach the constraint, zero seats, and a “blind” repository whose <code>findOverlap</code> always says free.</p>`,
    `<p>Mười một test: một bảng các khung giờ lân cận, chèn trực tiếp để chạm tới ràng buộc, không chỗ, và một repository “mù” có <code>findOverlap</code> luôn báo còn trống.</p>`],
  [6, 'Rubric (10 points)',
    `<p>Four points for mutants; the rest for boundaries, isolation, error codes, and keeping the unit suite separate and Docker-free.</p>`,
    `<p>Bốn điểm cho đột biến; phần còn lại cho biên, cô lập, mã lỗi, và giữ bộ unit test tách riêng, không cần Docker.</p>`],
  [7, 'Hints, from gentle to strong',
    `<p>Ask <code>findOverlap</code> about six neighbours of one booking, insert directly to reach the constraint, blind the repository for mutant 8, and compare error codes, not messages.</p>`,
    `<p>Hỏi <code>findOverlap</code> về sáu khung lân cận của một lượt đặt, chèn trực tiếp để chạm ràng buộc, làm “mù” repository cho đột biến 8, và so mã lỗi chứ không so thông điệp.</p>`],
  [8, 'Before you call it done',
    `<p>Integration and unit suites green, 8/8, only test files changed, one clear commit.</p>`,
    `<p>Bộ test tích hợp và unit đều xanh, 8/8, chỉ file test thay đổi, một commit rõ ràng.</p>`],
]);
