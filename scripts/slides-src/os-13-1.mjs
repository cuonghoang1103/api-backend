/**
 * os-13-1 — khoá "Operating Systems for Developers", bài 13.1 "Reading a binary" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c131-doc.out.txt (chạy thật trong ảnh os-lab) qua grab().
 * THUẦN PHÒNG THỦ: chỉ đọc một chương trình đồ chơi tự viết. Giảng: giang/os-13-1.mjs.
 */
import { lamDeck, sql, sh, two, box, cards, tbl } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-13-1', code: 'OS 13.1', title: 'Reading a binary: ELF, stack frames, calling convention', sub: 'Operating Systems · Chapter 13 — OS security' };

const g = (pre, n = 1) => grab('c131-doc', pre, n);
const cut = (pre, n, k) => { const L = g(pre, n).split('\n'); return L.length > k ? L.slice(0, k).join('\n') + '\n…' : L.join('\n'); };

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 13 — OS security', bai: '13.1',
}, [
  { cover: true, t: 'Reading a binary', sub: 'ELF, disassembly, stack frames —<br>the foundation of defence and reverse engineering' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Open an <b>ELF</b> file with <code class="i">readelf</code>, <code class="i">nm</code>, <code class="i">objdump</code></li>
<li>Read one function back from its <b>machine code</b></li>
<li>Know the <b>calling convention</b>: where arguments and return values go</li>
<li>See a call build a <b>stack frame</b> and save a return address</li>
<li>Step through a running function in <code class="i">gdb</code></li>
</ul>
<p class="nho">Strictly defensive — every program here is a toy you wrote, in a throwaway lab.</p>` },

  { t: 'A C program is not what runs', giua: true, body: two(
    sql(`int total(int price, int qty) {
    int sub  = price * qty;
    int disc = sub / 10;        // 10% off
    return (sub - disc)
         + (sub - disc) / 20;   // + 5% tax
}`, { lang: 'c', sm: true }),
    sh(g('file add').replace(', for GNU/Linux 3.7.0, with debug_info, not stripped', '\n   … with debug_info, not stripped'), { sm: true }) + `<p style="margin:0;font-size:20px">The compiler makes an <b>ELF</b> file of machine code; the CPU runs that.</p>`) },

  { t: 'The ELF header the kernel reads first', giua: true, body: `
${sh(g('readelf -h add').split('\n').filter((l) => /Class|Type|Machine|Entry/.test(l)).join('\n'))}
${box('Type: DYN = PIE', 'A position-independent executable: the loader can place the code anywhere, so <b>ASLR</b> randomises it each run (lesson 7.1). A fixed code address would be a gift to an attacker.', 'lam')}` },

  { t: 'Sections: where code and data live', giua: true, body: two(
    sh(g('readelf -S add').split('\n').filter((l) => /\.text|\.rodata|\.data|\.bss|\.plt|\.got/.test(l)).join('\n'), { sm: true }),
    cards([
      ['.text / .rodata', 'Machine code; read-only constants.'],
      ['.data / .bss', 'Globals with a value; zero globals.'],
      ['.plt / .got', 'Tables to call library functions — the GOT returns in 13.2 (RELRO).'],
    ], 1)) },

  { t: 'nm: find a function by name', giua: true, body: `
${sh(g('nm add').split('\n').filter((l) => / T /.test(l)).join('\n'))}
<p style="margin:0;font-size:21px"><b>T</b> = a function in <code class="i">.text</code>. Stripping a binary removes these names — then a reverse engineer works with addresses only.</p>` },

  { t: 'objdump: one function, read back', giua: true, body: two(
    sh(cut('objdump -d --no-show-raw-insn add', 1, 13), { sm: true }),
    `<p style="margin:0;font-size:21px"><code class="i">sub sp, #0x20</code> opens the frame; <code class="i">str w0/w1</code> save the two arguments; <code class="i">mul</code> is the subtotal; the <code class="i">#0x6667/smull</code> dance divides by 10 without a divide; <code class="i">ret</code> closes it.</p>`) },

  { t: 'The calling convention, two architectures', giua: true, body: tbl(
    ['', 'arm64 (this lab)', 'x86-64'],
    [['integer args', 'x0, x1, x2 … x7', 'rdi, rsi, rdx, rcx, r8, r9'],
     ['return value', 'x0 (w0 for int)', 'rax'],
     ['frame pointer', 'x29', 'rbp'],
     ['return address', 'x30 (link register)', 'pushed on the stack'],
     ['stack pointer', 'sp', 'rsp']]) + `<p style="margin:10px 0 0;font-size:20px">Fixed rules ⇒ you can read any function’s arguments and return value.</p>` },

  { t: 'gdb: stop inside the running function', giua: true, body: sh(
    g('gdb -q -batch').split('\n').filter((l) => /Breakpoint 1,|price=100|^price|^qty|^#0|^#1/.test(l)).join('\n')) },

  { t: 'The return address lives in the frame', giua: true, body: `
${sh(g('gdb -q -batch').split('\n').filter((l) => /pc = |saved pc|Locals at|called by/.test(l)).join('\n'))}
${box('Hold on to the saved pc', 'That <b>saved pc</b> is the <b>return address</b> — where <code class="i">total</code> jumps back into <code class="i">main</code>. Lesson 13.2 is entirely about a bug that overwrites it.', 'do2')}` },

  { t: 'A debugger turns ASLR off', giua: true, body: box('Why a bug can “vanish under gdb”',
    'gdb launches the program with ASLR disabled, so addresses are stable between runs (the recurring <code class="i">0xaaaa…</code>). The same program started normally gets a fresh random layout, so an address you noted under gdb will not match. Reason about <b>offsets within a function</b> (fixed), not absolute addresses (they move).', 'lam') },

  { t: 'No debug info? The frame still shows', giua: true, body: two(
    sh(cut('objdump -d --no-show-raw-insn greet', 1, 12), { sm: true }),
    `<p style="margin:0;font-size:21px"><code class="i">sub sp, #0x40</code> opens the frame; <code class="i">stp x29, x30</code> saves the frame pointer and return address together; the load/store/reload around <code class="i">sp, #40</code> is the <b>stack canary</b> being planted and checked — lesson 13.2.</p>`) },

  { t: 'Takeaways', to: true, giua: true, body: `
<ul>
<li>A C program becomes an <b>ELF</b> of machine code for one architecture.</li>
<li><code class="i">readelf</code> (header, sections) · <code class="i">nm</code> (symbols) · <code class="i">objdump -d</code> (disassembly).</li>
<li>The <b>calling convention</b> (arm64 x0…/x0; x86-64 rdi…/rax) lets you read any function.</li>
<li>Each call builds a <b>stack frame</b> with saved <code class="i">x29/x30</code> — the return address is the next lesson.</li>
<li><code class="i">gdb</code>: break, run, info args, bt, info frame — debugging and reverse engineering.</li>
</ul>` },
]);
