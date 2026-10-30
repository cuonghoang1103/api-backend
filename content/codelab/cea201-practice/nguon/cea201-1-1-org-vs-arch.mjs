/** CEA201 · 1.1 — Computer organization versus architecture. */
import { doiDau, KHOA, bi, hai, giai, tinh, mc, q, tn, bang1 } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Basics 1 — Organization versus architecture: concepts',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on the two views of a computer.</p>', '<p>Câu hỏi khái niệm về hai góc nhìn của một máy tính.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Computer architecture refers to …', 'Kiến trúc máy tính đề cập đến …'], ['the attributes visible to the programmer that affect the logical execution of a program', 'the physical layout of the chips and the circuit boards inside the machine', 'the hardware details hidden from the programmer, such as control signals and memory technology', 'the operating system and the compilers that are shipped together with the machine'], ['Instruction set, data representation, addressing and I/O mechanisms are architectural.', 'Tập lệnh, biểu diễn dữ liệu, định địa chỉ và cơ chế I/O thuộc kiến trúc.']),
    q('c2', ['Computer organization refers to …', 'Tổ chức máy tính đề cập đến …'], ['the operational units and their interconnections that realize the architecture', 'the instruction set and the addressing modes that a programmer can use', 'the languages and compilers available for the machine', 'the file system and the other services of the OS'], ['Control signals, interfaces and memory technology are organizational.', 'Tín hiệu điều khiển, giao diện và công nghệ bộ nhớ thuộc tổ chức.']),
    q('c3', ['Why can a family of computers share an architecture but differ in organization?', 'Vì sao một họ máy có thể chung kiến trúc nhưng khác tổ chức?'], ['Price/performance points differ by implementing one instruction set with different hardware', 'Organization is decided by each programmer, so different programs see different hardware', 'The instruction set must be redesigned for every model, while the hardware stays exactly the same', 'Organization is only a marketing name; all models of a family use identical hardware'], ['Binary compatibility across generations (e.g. x86) relies on this separation.', 'Tương thích nhị phân giữa các thế hệ (vd x86) dựa trên sự tách biệt này.']),
    q('c4', ['Which of the following is a FUNCTION of a computer?', 'Cái nào sau đây là CHỨC NĂNG của máy tính?'], ['Data processing', 'The main memory', 'The system bus', 'The control unit'], ['The four functions are data processing, data storage, data movement and control; the others are structure.', 'Bốn chức năng là xử lý, lưu trữ, di chuyển dữ liệu và điều khiển; các mục còn lại là cấu trúc.']),
    q('c5', ['The four main structural components of a computer are …', 'Bốn thành phần cấu trúc chính của máy tính là …'], ['CPU, main memory, I/O and system interconnection', 'ALU, registers, control unit, cache and the internal bus', 'keyboard, monitor, mouse and printer', 'compiler, linker, loader and OS'], ['Each top-level component can be decomposed again (CPU = ALU + registers + control unit).', 'Mỗi thành phần cấp cao lại phân rã tiếp (CPU = ALU + thanh ghi + đơn vị điều khiển).']),
  ],
  goiY: ['Architecture = what the programmer sees; organization = how it is built.', 'Function = what it does; structure = how the parts are related.'],
  loiHayGap: ['Treating cache size as architecture.', 'Mixing function and structure.'],
  thuatNgu: [tn('architecture', 'kiến trúc'), tn('organization', 'tổ chức')],
  khaiNiem: ['organization vs architecture', 'structure and function'],
});

const AO = [['The instruction set', 'Architecture'], ['The number of bits used to represent data types', 'Architecture'], ['The addressing modes available to the programmer', 'Architecture'], ['The control signals that execute an instruction', 'Organization'], ['The size of the cache and its mapping function', 'Organization'], ['Whether memory is built from SRAM or DRAM', 'Organization'], ['The interface between the computer and its peripherals (hardware)', 'Organization'], ['The I/O mechanisms the programmer can invoke (instructions, ports)', 'Architecture']];
const E2 = tinh({
  tieuDe: 'Basics 2 — Is it architecture or organization?',
  doKho: 'EASY', phut: 6,
  moTa: bi('<p>Classify each attribute.</p>', '<p>Phân loại từng thuộc tính.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Architecture or organization', 'Kiến trúc hay tổ chức'], [{ ma: 'a', ten: 'Attribute' }, { ma: 'c', ten: 'Category', luaChon: ['Architecture', 'Organization'] }],
    AO.map(([a, c]) => ({ o: { a }, a: { c } })),
    ['If a programmer (or compiler) can see it and it changes how a program must be written, it is architecture; if it is a hardware implementation detail, it is organization.', 'Nếu lập trình viên (hay trình biên dịch) thấy được và nó đổi cách viết chương trình thì là kiến trúc; nếu là chi tiết cài đặt phần cứng thì là tổ chức.'])],
  goiY: ['Would a program’s source or machine code change if this attribute changed?', 'Implementation techniques are organization.'],
  loiHayGap: ['Putting the cache in the architecture box.', 'Putting the I/O instructions in the organization box.'],
  thuatNgu: [tn('binary compatibility', 'tương thích nhị phân')],
  khaiNiem: ['architecture', 'organization'],
});

export default doiDau({
  slug: 'cea201-1-1-org-vs-arch',
  ten: '1.1 Organization vs Architecture',
  khoa: KHOA,
  baiHoc: 'cea201-1-1-org-vs-arch',
  de: [E1, E2],
});
void hai; void giai; void mc;
