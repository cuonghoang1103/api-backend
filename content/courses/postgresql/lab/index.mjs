/**
 * Lab CT Shop — chèn vào chương bằng manifest (postgresql.mjs), KHÔNG sửa tệp chương.
 * LAB_SAU[<số chương>] = [bài lab…] ⇒ lab đứng SAU các bài học, TRƯỚC bài quiz (slug *-quiz) của chương đó.
 * Agent lab chỉ sửa tệp này + lab/lab-N.mjs + lab/sql/*. Ví dụ:
 *   import lab1 from './lab-1.mjs';
 *   export const LAB_SAU = { 3: [lab1] };
 */
export const LAB_SAU = {};
