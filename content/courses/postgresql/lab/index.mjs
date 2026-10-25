/**
 * Lab CT Shop — chèn vào chương bằng manifest (postgresql.mjs), KHÔNG sửa tệp chương.
 * LAB_SAU[<số chương>] = [bài lab…] ⇒ lab đứng SAU các bài học, TRƯỚC bài quiz (slug *-quiz) của chương đó.
 * Agent lab chỉ sửa tệp này + lab/lab-N.mjs + lab/sql/*. Khuôn cho Lab 3–9: lab/README-LAB.md.
 */
import lab1 from './lab-1.mjs';
import lab2 from './lab-2.mjs';
import lab3 from './lab-3.mjs';
import lab4 from './lab-4.mjs';
import lab5 from './lab-5.mjs';
import lab6 from './lab-6.mjs';
import lab7 from './lab-7.mjs';
import lab8 from './lab-8.mjs';

export const LAB_SAU = { 3: [lab1], 4: [lab2], 6: [lab3], 8: [lab4], 10: [lab5], 12: [lab6], 13: [lab7], 15: [lab8] };
