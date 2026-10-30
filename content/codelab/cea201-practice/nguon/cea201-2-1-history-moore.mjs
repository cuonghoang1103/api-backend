/** CEA201 · 2.1 — History of computers and Moore's law. */
import { doiDau, KHOA, bi, hai, giai, tinh, mc, q, tn, bang1, r2 } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'History 1 — Generations of computers and Moore’s law: concepts',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on the evolution of computer hardware.</p>', '<p>Câu hỏi khái niệm về sự tiến hoá của phần cứng máy tính.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Moore’s law states that …', 'Định luật Moore nói rằng …'], ['the number of transistors on a chip doubles roughly every two years', 'the clock speed of a processor doubles roughly every two years', 'the price of a memory chip doubles roughly every two years', 'the size of typical programs doubles roughly every two years'], ['An observation, not a law of physics; it drove cheaper and faster chips for decades.', 'Một quan sát, không phải định luật vật lý; nó thúc đẩy chip rẻ và nhanh hơn suốt nhiều thập kỷ.']),
    q('c2', ['The main technology of the second generation of computers was …', 'Công nghệ chính của thế hệ máy tính thứ hai là …'], ['transistors', 'vacuum tubes', 'integrated circuits', 'microprocessors'], ['First: vacuum tubes; second: transistors; third: ICs; later: LSI/VLSI and microprocessors.', 'Thứ nhất: đèn chân không; thứ hai: transistor; thứ ba: IC; sau đó LSI/VLSI và vi xử lý.']),
    q('c3', ['The IAS machine is important because it introduced …', 'Máy IAS quan trọng vì nó giới thiệu …'], ['the stored-program concept that von Neumann described', 'the transistor as a replacement for vacuum tubes', 'the hard disk as a store for programs and data', 'the time-sharing operating system with terminals'], ['Program and data in the same memory.', 'Chương trình và dữ liệu trong cùng một bộ nhớ.']),
    q('c4', ['The “memory wall” refers to …', '“Bức tường bộ nhớ” nói đến …'], ['processor speed growing much faster than memory speed', 'a physical barrier that shields memory chips in a data centre', 'a fixed limit on how much memory a processor can address', 'an OS security feature separating the memory of two processes'], ['It motivates caches and the memory hierarchy.', 'Nó là động cơ cho cache và phân cấp bộ nhớ.']),
    q('c5', ['Why did clock rates stop rising around 2004?', 'Vì sao tốc độ clock ngừng tăng khoảng năm 2004?'], ['Power density and heat grow with frequency', 'Transistors stopped shrinking', 'Software could not use faster clocks', 'Memory became faster than the processors'], ['The “power wall” moved the industry to multicore.', '“Bức tường công suất” đẩy ngành sang đa lõi.']),
  ],
  goiY: ['Moore’s law counts transistors, not speed.', 'Each generation is named after its main component technology.'],
  loiHayGap: ['Reading Moore’s law as a statement about clock speed.', 'Confusing the first and second generations.'],
  thuatNgu: [tn('Moore’s law', 'định luật Moore')],
  khaiNiem: ['history of computing', 'Moore’s law'],
});

const MP = [[10, 2], [20, 2], [15, 1.5], [30, 2.5], [12, 3]];
const E2 = tinh({
  tieuDe: 'History 2 — Moore’s law as arithmetic',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>If the transistor count doubles every <b>T</b> years, after <b>t</b> years it has grown by the factor 2^(t/T). Give the growth factor (integer) for each row. Then, for each doubling period T, how many years does it take for the count to grow by a factor of <b>1000</b>? (t = T × log₂ 1000, 1 decimal)</p>', '<p>Nếu số transistor tăng gấp đôi sau mỗi <b>T</b> năm thì sau <b>t</b> năm nó tăng theo hệ số 2^(t/T). Cho hệ số tăng (số nguyên) mỗi dòng. Rồi với mỗi chu kỳ gấp đôi T, mất bao nhiêu năm để số lượng tăng <b>1000</b> lần? (t = T × log₂ 1000, 1 chữ số thập phân)</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Growth factor', 'Hệ số tăng'], [{ ma: 'p', ten: 't, T' }, { ma: 'f', ten: 'Factor' }], MP.map(([t, T]) => ({ o: { p: `t = ${t} years, T = ${T} years` }, a: { f: String(2 ** (t / T)) } })),
    [MP.map(([t, T]) => `2^(${t}/${T}) = ${2 ** (t / T)}`).join('; ') + '.', MP.map(([t, T]) => `2^(${t}/${T}) = ${2 ** (t / T)}`).join('; ') + '.']),
  bang1('b2', ['Years for ×1000', 'Số năm để ×1000'], [{ ma: 'T', ten: 'Doubling period T' }, { ma: 'y', ten: 'Years' }], [1, 2, 3].map((T) => ({ o: { T: `${T} year${T > 1 ? 's' : ''}` }, a: { y: r2(T * Math.log2(1000), 1) } })),
    [[1, 2, 3].map((T) => `T=${T}: ${(T * Math.log2(1000)).toFixed(1)} years`).join('; ') + ' (log₂ 1000 ≈ 9.97 doublings).', [1, 2, 3].map((T) => `T=${T}: ${(T * Math.log2(1000)).toFixed(1)} năm`).join('; ') + ' (log₂ 1000 ≈ 9,97 lần gấp đôi).'])],
  goiY: ['Number of doublings = t / T.', '1000 ≈ 2¹⁰, so about 10 doublings.'],
  loiHayGap: ['Multiplying t by T instead of dividing.', 'Treating Moore’s law as linear growth.'],
  thuatNgu: [tn('exponential growth', 'tăng trưởng mũ')],
  khaiNiem: ['Moore’s law'],
});

export default doiDau({
  slug: 'cea201-2-1-history-moore',
  ten: '2.1 A brief history & Moore’s law',
  khoa: KHOA,
  baiHoc: 'cea201-2-1-history-moore',
  de: [E1, E2],
});
void hai; void giai; void mc;
