/**
 * os-13-2 — khoá "Operating Systems for Developers", bài 13.2 "Buffer overflow and its mitigations" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c132-overflow.out.txt (chạy thật trong ảnh os-lab) qua grab().
 * THUẦN PHÒNG THỦ: chỉ chương trình đồ chơi tự viết, không payload dùng được. Giảng: giang/os-13-2.mjs.
 */
import { lamDeck, sql, sh, two, box, cards } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-13-2', code: 'OS 13.2', title: 'Buffer overflow and its mitigations', sub: 'Operating Systems · Chapter 13 — OS security' };

const g = (pre, n = 1) => grab('c132-overflow', pre, n);
const clean = (t) => t.replace(/\/usr\/local\/bin\/phien: line \d+:\s*\d+ /, '');

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 13 — OS security', bai: '13.2',
}, [
  { cover: true, t: 'Buffer overflow', sub: 'what it overwrites — and six layers that stop it<br>(all on a toy you wrote, in a throwaway lab)' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>See an overflow overwrite a <b>local</b>, then the <b>return address</b></li>
<li>Read six defences off the binary: <b>canary, NX, ASLR/PIE, RELRO, FORTIFY</b></li>
<li>Watch each one stop the <i>same</i> overflow</li>
<li>Write the real fix: a bounded copy + length check</li>
<li>Catch format-string, use-after-free and double-free bugs</li>
</ul>` },

  { t: 'Overwriting the local next door', giua: true, body: `
${sh(g('./vuln hello') + '\n' + g('./vuln AAAAAAAAAAAAAAAAAAAA'))}
<p style="margin:0;font-size:21px">20 bytes into a 16-byte buffer: the four extra <code class="i">A</code> (0x41) spill onto the adjacent <code class="i">flag</code> ⇒ <b>0x41414141</b>. C does not bounds-check the copy.</p>` },

  { t: 'Reaching the return address', giua: true, body: `
${sh(clean(g('./retaddr AAAAAAAAAAAAAAAA')) + '\n' + clean(g('./retaddr $(python3')))}
<p style="margin:0;font-size:21px">16 bytes fit; 200 bytes overrun the saved return address ⇒ the CPU jumps to <code class="i">0x4141…</code> and the kernel kills it: <b>Bus error, exit 135</b> here (SIGSEGV/139 on x86-64). The payload is only A’s — the point is to <i>see</i> it is reachable.</p>` },

  { t: 'checksec in three greps: canary & NX', giua: true, body: two(
    sh('$ readelf -s vuln-hardened | grep -c __stack_chk_fail\n1          # canary present\n$ readelf -s vuln          | grep -c __stack_chk_fail\n0          # no canary\n$ readelf -l vuln-hardened | grep GNU_STACK\n  GNU_STACK  0x0 0x0 0x0 …  RW  0x10', { sm: true }),
    cards([
      ['Stack canary', 'hardened build links <b>__stack_chk_fail</b> (1); the -fno-stack-protector build does not (0).'],
      ['NX / W^X', 'GNU_STACK is <b>RW</b>, never RWE — injected stack bytes cannot run.'],
    ], 1)) },

  { t: 'PIE and Full RELRO', giua: true, body: `
${sh(g('readelf -h vuln-hardened') + '\n' + g('readelf -d vuln-hardened'))}
<p style="margin:0;font-size:20px"><b>PIE</b> (Type DYN) ⇒ ASLR moves the code every run. <b>Full RELRO</b> (BIND_NOW + a GNU_RELRO segment) ⇒ the GOT is read-only after start-up, so an overflow cannot redirect a library call.</p>` },

  { t: 'The canary turns a hijack into an abort', giua: true, body: `
${sh(clean(g('./retaddr-canary')))}
${box('Exit 134, not a hijack', 'The overflow still happened, but the canary — a random value before the return address — was found changed and the program called <code class="i">abort()</code> (SIGABRT, 128+6 = <b>134</b>) before the corrupted address was used. A controlled crash, not control of the program.', 'xanh')}` },

  { t: 'FORTIFY_SOURCE catches it even earlier', giua: true, body: `
${sh(clean(g('./retaddr-fortify')))}
<p style="margin:0;font-size:22px">At <code class="i">-O2 -D_FORTIFY_SOURCE=3</code> the compiler knows <code class="i">buf</code> is 16 bytes and swaps <code class="i">strcpy</code> for a checked version that aborts the moment the copy exceeds it — <b>at the copy</b>, before any return.</p>` },

  { t: 'The real fix: don’t overflow at all', giua: true, body: two(
    sql(`if (strlen(argv[1]) >= sizeof buf) {
    fprintf(stderr, "input too long\\n");
    return 1;                 // refuse
}
snprintf(buf, sizeof buf, "%s", argv[1]);`, { lang: 'c', sm: true }),
    sh(g('./safe hello') + '\n' + g('./safe $(python3'))) + `<p style="margin:10px 0 0;font-size:20px">Bounded copy + length check. Or use a memory-safe language (Rust, Go, Java, JS) so the whole class is gone.</p>` },

  { t: 'A user string is never the format', giua: true, body: `
${sh(g('./fmt good') + '\n' + g('./fmt bad'))}
<p style="margin:0;font-size:21px"><code class="i">printf(user)</code> lets <code class="i">%p</code> leak stack words (defeating ASLR); <code class="i">%n</code> can write memory. Fix: always <code class="i">printf("%s", user)</code>. Keep <code class="i">-Wformat-security</code> on.</p>` },

  { t: 'AddressSanitizer: use-after-free', giua: true, body: sh(
    g('./uaf 2').split('\n').filter((l) => /ERROR|freed by|previously|SUMMARY/.test(l)).join('\n'), { sm: true }) + `<p style="margin:10px 0 0;font-size:21px">ASan stops at <code class="i">uaf.c:10</code> with both the free and the allocation stacks. This is Chapter 7’s allocator, with a guard.</p>` },

  { t: 'AddressSanitizer: double-free', giua: true, body: `
${sh(g('./df 2').split('\n').filter((l) => /ERROR|double-free|SUMMARY/.test(l)).join('\n'), { sm: true })}
${box('Run tests and CI under ASan', 'A use-after-free or double-free that crashes randomly in production becomes a precise <code class="i">file:line</code> report in seconds. Add <code class="i">-fsanitize=address</code> (and Valgrind) to your test build.', 'lam')}` },

  { t: 'Takeaways', to: true, giua: true, body: `
<ul>
<li>An overflow writes past a buffer onto the next thing — a local, then the <b>return address</b> (a crash).</li>
<li>Six defences, read with <code class="i">readelf</code>: canary, NX/W^X, ASLR/PIE, RELRO, FORTIFY — each turned the same overflow into a controlled abort.</li>
<li>Mitigations make a hijack a crash; the fix is a <b>bounded copy + length check</b>, or a memory-safe language.</li>
<li>Never pass user input as a format string: <code class="i">printf("%s", user)</code>.</li>
<li><b>AddressSanitizer</b> catches use-after-free and double-free at the exact line.</li>
</ul>` },
]);
