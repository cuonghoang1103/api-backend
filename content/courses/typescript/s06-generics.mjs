/**
 * TypeScript — Chương 6: Generics (soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md).
 * 6.1 why-generics · 6.2 constraints-keyof · 6.3 generic-types-classes · 6.4 generics-in-practice (slug giữ) · Lab 6 (MỚI: typescript-6-6-lab-repository-generic)
 * · Quiz Chương 6 (slug giữ typescript-6-5-quiz, → 10 câu). Lab đứng TRƯỚC quiz (syncOrder: true).
 * Cả chương xoay quanh một ý: Result<T, E> và Repo<T extends { id }> + groupBy — lời giải Lab 6 ở ./_labflow-ts/src/rules/repo.ts.
 * Code/output mỗi bài ở ./s06/_ma-<deck>.mjs — SINH TỰ ĐỘNG (đừng sửa tay). TIÊU ĐỀ CHƯƠNG giữ nguyên. Bản cũ (một tệp) đã thay hẳn.
 */
import whyGenerics from './s06/why-generics.mjs';
import constraintsKeyof from './s06/constraints-keyof.mjs';
import genericTypesClasses from './s06/generic-types-classes.mjs';
import genericsInPractice from './s06/generics-in-practice.mjs';
import lab from './s06/lab.mjs';
import quiz from './s06/quiz.mjs';

export default {
  title: 'Chapter 6 — Generics|||Chương 6 — Generics (kiểu tổng quát)',
  description: 'Viết code dùng lại được mà vẫn an toàn kiểu: một tham số kiểu T giữ lại kiểu nơi any vứt nó đi (firstOf<T>(arr: T[]): T | undefined ⇒ firstOf(users) là User | undefined, tsc tự suy T). Ràng buộc T extends { id: number } cho dùng item.id; keyof T và truy cập theo chỉ mục T[K] (getProp, User[\'role\']=Role). Interface, class và type alias đều generic, có tham số kiểu mặc định — Result<T, E = string> và Repo<T> của LabFlow; bẫy parameter property với erasableSyntaxOnly (TS1294). Suy kiểu và bốn bẫy thực chiến (generic chỉ-trả-về không kiểm gì, generic thừa, literal nới rộng, const type parameter). Rồi Lab 6 (Repo generic + groupBy; any điểm 4.5, ràng buộc bắt kiểu sai, lời giải 10/10).',
  lessons: [whyGenerics, constraintsKeyof, genericTypesClasses, genericsInPractice, lab, quiz],
};
