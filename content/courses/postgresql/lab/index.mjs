/**
 * Lab CT Shop — chèn vào chương bằng manifest (postgresql.mjs), KHÔNG sửa tệp chương.
 * LAB_SAU[<số chương>] = [bài lab…] ⇒ lab đứng SAU các bài học, TRƯỚC bài quiz (slug *-quiz) của chương đó.
 * Agent lab chỉ sửa tệp này + lab/lab-N.mjs + lab/sql/*. Khuôn cho Lab 3–9: lab/README-LAB.md.
 */
import lab1 from './lab-1.mjs';

export const LAB_SAU = { 3: [lab1] };
