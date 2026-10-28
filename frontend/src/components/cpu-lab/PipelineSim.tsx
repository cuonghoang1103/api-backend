'use client';
/**
 * Từ mã C tới chương trình đang chạy — dữ liệu THẬT của gcc 15 / binutils 2.46 (sinh offline trong Docker bằng
 * frontend/scripts/cpu-lab/gen-pipeline.sh, commit dưới dạng data/pipeline.json). Trang không gọi trình biên dịch nào.
 */
import { useState } from 'react';
import data from './data/pipeline.json';
import { Controls, Explain, Seg, css as s, usePlayer } from '../os-lab/ui';
import { CpuFrame, cc as c, cx, tx, type Lang } from './parts';
import { EXAMPLES } from './engine/marie';

type Prog = 'add' | 'sum' | 'max';
type Arch = 'x86_64' | 'aarch64';
type Opt = 'O0' | 'O2';
interface Build {
  asm: string; objdump: Array<{ name: string; addr: number; insns: Array<{ addr: number; bytes: string; text: string }> }>;
  sections: Array<{ name: string; type: string; addr: number; off: number; size: number; flags: string }>;
  segments: Array<{ off: number; vaddr: number; filesz: number; memsz: number; flags: string }>;
  header: { type: string; machine: string; entry: string }; symbols: Array<{ name: string; addr: number; type: string }>;
  head64: string; fileBytes: number; exit: number | null;
}
const D = data as unknown as { generatedAt: string; toolchain: { x86: string; arm: string; binutils: string }; flags: string; programs: Record<Prog, { source: string; builds: Record<string, Build> }> };
const hx = (n: number) => '0x' + n.toString(16);
const SEC_COLOR: Record<string, string> = { '.text': '#2563eb', '.rodata': '#7c3aed', '.data': '#059669', '.bss': '#d97706' };
const EXPECT: Record<Prog, number> = { add: 12, sum: 15, max: 9 };

const STAGES: Array<[string, string]> = [
  ['C source', 'Mã C'], ['Assembly', 'Hợp ngữ'], ['Machine code', 'Mã máy'], ['Executable file', 'Tệp thực thi'], ['Loaded in memory', 'Nạp vào bộ nhớ'], ['CPU runs it', 'CPU chạy'],
];

export default function PipelineSim({ lang = 'vi', preset }: { lang?: Lang; preset?: string }) {
  const [prog, setProg] = useState<Prog>(preset === 'sum' || preset === 'max' ? preset : 'add');
  const [arch, setArch] = useState<Arch>('x86_64');
  const [opt, setOpt] = useState<Opt>('O0');
  const p = usePlayer(STAGES.length, 2600);
  const P = D.programs[prog];
  const B = P.builds[`${arch}-${opt}`];
  const stage = p.i;
  const isX86 = arch === 'x86_64';
  const nInsn = B.objdump.reduce((n, f) => n + f.insns.length, 0);
  const codeBytes = B.objdump.reduce((n, f) => n + f.insns.reduce((m, i) => m + i.bytes.split(' ').length, 0), 0);
  const key = B.sections.filter((x) => SEC_COLOR[x.name]);
  const keyTotal = key.reduce((n, x) => n + Math.max(x.size, 1), 0);
  const sym = (n: string) => B.symbols.find((x) => x.name === n);
  const data0 = prog === 'add' ? ['x', 'y', 'z'] : prog === 'max' ? ['arr'] : [];
  const entryFn = prog === 'add' ? 'main' : prog === 'sum' ? 'sum_to' : 'max_of';

  const msg: Array<[string, string]> = [
    [`A human writes C. The CPU cannot read this text at all — it only executes bit patterns. Everything below turns these ${P.source.split('\n').length} lines into bits, step by step, using the real gcc ${isX86 ? 'for x86-64' : 'for ARM64'}.`,
      `Con người viết C. CPU hoàn toàn không đọc được chữ này — nó chỉ thực thi dãy bit. Mọi bước dưới đây biến ${P.source.split('\n').length} dòng này thành bit, từng bước một, bằng gcc thật ${isX86 ? 'cho x86-64' : 'cho ARM64'}.`],
    [`gcc -S: the compiler translates C into assembly for ONE specific CPU family. ${isX86 ? 'x86-64 (Intel/AMD, Intel syntax: destination first).' : 'ARM64 (Apple M-series, phones, Graviton).'} ${opt === 'O2' ? 'With -O2 the optimiser rewrote the code — compare with -O0.' : '-O0 = no optimisation: each C statement maps to a few instructions, and variables live in memory on the stack.'}`,
      `gcc -S: trình biên dịch dịch C sang hợp ngữ cho MỘT dòng CPU cụ thể. ${isX86 ? 'x86-64 (Intel/AMD, cú pháp Intel: đích đứng trước).' : 'ARM64 (Apple M, điện thoại, Graviton).'} ${opt === 'O2' ? 'Với -O2 bộ tối ưu đã viết lại mã — so với -O0.' : '-O0 = không tối ưu: mỗi câu lệnh C thành vài lệnh máy, biến nằm trong bộ nhớ trên stack.'}`],
    [`The assembler (as) turns each line into bytes: ${nInsn} instructions = ${codeBytes} bytes. ${isX86 ? 'x86 instructions vary from 1 to 15 bytes (CISC) — "ret" is the single byte C3.' : 'Every ARM64 instruction is exactly 4 bytes (RISC). Bytes are shown in memory order (little-endian).'} These bytes are what the CPU fetches — exactly like the toy CPU's 16-bit words.`,
      `Trình hợp dịch (as) biến mỗi dòng thành byte: ${nInsn} lệnh = ${codeBytes} byte. ${isX86 ? 'Lệnh x86 dài từ 1 tới 15 byte (CISC) — "ret" là đúng một byte C3.' : 'Mọi lệnh ARM64 dài đúng 4 byte (RISC). Byte hiện theo thứ tự trong bộ nhớ (little-endian).'} Đây chính là thứ CPU nạp về — y như các từ 16 bit của CPU đồ chơi.`],
    [`The linker (ld) adds start-up code and writes an ELF file of ${B.fileBytes.toLocaleString('en')} bytes. It starts with the magic bytes 7F 45 4C 46 ("\\x7FELF"). Code goes to .text, initialised globals to .data, zero-initialised ones to .bss (which takes NO space in the file).`,
      `Trình liên kết (ld) thêm mã khởi động và ghi ra tệp ELF ${B.fileBytes.toLocaleString('vi')} byte. Tệp mở đầu bằng các byte "thần chú" 7F 45 4C 46 ("\\x7FELF"). Mã vào .text, biến toàn cục có giá trị đầu vào .data, biến bằng 0 vào .bss (KHÔNG chiếm chỗ trong tệp).`],
    [`./prog: the OS kernel (execve) maps the LOAD segments into a fresh virtual address space: code read+execute, data read+write. With ASLR the real addresses are shifted by a random base each run. This is the "text / data / bss / heap / stack" picture from the OS lab.`,
      `./prog: nhân hệ điều hành (execve) ánh xạ các segment LOAD vào một không gian địa chỉ ảo mới: mã được đọc+chạy, dữ liệu được đọc+ghi. Có ASLR thì địa chỉ thật dịch đi một gốc ngẫu nhiên mỗi lần chạy. Đây chính là bức tranh "text / data / bss / heap / stack" trong phòng lab OS.`],
    [`The CPU sets its program counter (${isX86 ? 'rip' : 'pc'}) to the entry point ${B.header.entry} and runs fetch → decode → execute billions of times per second — the same cycle you stepped through on the toy CPU. main returns ${EXPECT[prog]}, which becomes the exit code: echo $? prints ${EXPECT[prog]}${B.exit !== null ? ` (measured: ${B.exit})` : ''}.`,
      `CPU đặt bộ đếm chương trình (${isX86 ? 'rip' : 'pc'}) vào điểm vào ${B.header.entry} rồi chạy nạp → giải mã → thực thi hàng tỉ lần mỗi giây — đúng chu trình bạn đã đi từng bước trên CPU đồ chơi. main trả về ${EXPECT[prog]}, thành mã thoát: echo $? in ra ${EXPECT[prog]}${B.exit !== null ? ` (đo thật: ${B.exit})` : ''}.`],
  ];

  return (
    <CpuFrame lang={lang} title={tx(lang, 'From C source to a running program', 'Từ mã C tới chương trình đang chạy')} sub={tx(lang, 'Real gcc output, not made up', 'Output thật của gcc, không bịa')}>
      <div className={s.bar}>
        <Seg label={tx(lang, 'Program', 'Chương trình')} value={prog} options={[['add', 'add.c'], ['sum', 'sum.c'], ['max', 'max.c']]} onChange={setProg} />
        <Seg label="CPU" value={arch} options={[['x86_64', 'x86-64'], ['aarch64', 'ARM64']]} onChange={setArch} />
        <Seg label={tx(lang, 'Optimise', 'Tối ưu')} value={opt} options={[['O0', '-O0'], ['O2', '-O2']]} onChange={setOpt} />
      </div>
      <div className={c.stages}>
        {STAGES.map(([en, vi], k) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <button type="button" className={cx(c.stage, stage === k && c.on)} onClick={() => { p.setPlaying(false); p.setI(k); }}>{k + 1}. {tx(lang, en, vi)}</button>
            {k < STAGES.length - 1 && <span className={c.arrow}>→</span>}
          </span>
        ))}
      </div>
      <Controls p={p} lang={lang} label={`${stage + 1}/${STAGES.length}`} />
      <Explain tone={stage === 5 ? 'ok' : undefined}>{tx(lang, msg[stage][0], msg[stage][1])}</Explain>

      <div className={s.grid2} style={{ marginTop: 10, alignItems: 'start' }}>
        <div className={s.panel}>
          <div className={s.panelTitle}>{prog}.c</div>
          <pre className={s.code} style={{ margin: 0, padding: '8px 12px', whiteSpace: 'pre', maxHeight: 340 }}>{P.source}</pre>
        </div>

        {stage === 0 && (
          <div className={s.panel}>
            <div className={s.panelTitle}>{tx(lang, 'The same idea on the toy CPU', 'Cùng bài toán trên CPU đồ chơi')}</div>
            <pre className={s.code} style={{ margin: 0, padding: '8px 12px', maxHeight: 340 }}>{EXAMPLES[prog].src}</pre>
            <a href={`/cpu-lab?sim=cpu&preset=${prog}&lang=${lang}`} target="_blank" rel="noopener" style={{ fontWeight: 700, fontSize: 13, color: 'var(--ol-accent)' }}>{tx(lang, 'Run it on the toy CPU →', 'Chạy nó trên CPU đồ chơi →')}</a>
          </div>
        )}
        {stage === 1 && (
          <div className={s.panel}>
            <div className={s.panelTitle}>gcc -{opt} -S {isX86 ? '-masm=intel ' : ''}{prog}.c → {prog}.s</div>
            <pre className={s.code} style={{ margin: 0, padding: '8px 12px', maxHeight: 340 }}>{B.asm}</pre>
          </div>
        )}
        {stage === 2 && (
          <div className={s.panel} style={{ overflowX: 'auto' }}>
            <div className={s.panelTitle}>objdump -d {prog}.o</div>
            <div className={c.listing} style={{ maxHeight: 340 }}>
              {B.objdump.map((f) => (
                <div key={f.name}>
                  <div className={c.row} style={{ color: '#dcdcaa' }}><span /><span /><span>&lt;{f.name}&gt;:</span><span /></div>
                  {f.insns.map((i, k) => (
                    <div key={k} className={c.row} style={{ gridTemplateColumns: '34px 150px minmax(0,1fr)' }}>
                      <span className={c.a}>{i.addr.toString(16)}</span>
                      <span className={c.w}>{i.bytes}</span>
                      <span className={c.op}>{i.text}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        {stage === 3 && (
          <div className={s.panel} style={{ overflowX: 'auto' }}>
            <div className={s.panelTitle}>readelf -S prog · {B.header.machine} · {B.header.type}</div>
            <div className={s.mono} style={{ fontSize: 11.5, wordBreak: 'break-all', marginBottom: 6 }}><b style={{ color: 'var(--ol-bad)' }}>{B.head64.slice(0, 11)}</b>{B.head64.slice(11, 96)} …</div>
            <div className={c.secBar}>
              {key.map((x) => <div key={x.name} style={{ flex: Math.max(x.size, 1) / keyTotal, background: SEC_COLOR[x.name] }} title={`${x.name} ${x.size} B`}>{x.size / keyTotal > 0.08 ? x.name : ''}</div>)}
            </div>
            <table className={cx(s.tbl, s.compact)} style={{ marginTop: 8 }}>
              <thead><tr><th>section</th><th>{tx(lang, 'type', 'loại')}</th><th className={s.num}>{tx(lang, 'address', 'địa chỉ')}</th><th className={s.num}>{tx(lang, 'size', 'cỡ')}</th><th>flags</th></tr></thead>
              <tbody>{B.sections.filter((x) => SEC_COLOR[x.name] || ['.interp', '.dynsym', '.plt', '.got', '.symtab', '.strtab', '.comment'].includes(x.name)).map((x) => (
                <tr key={x.name}><td className={s.mono} style={{ color: SEC_COLOR[x.name], fontWeight: SEC_COLOR[x.name] ? 800 : 400 }}>{x.name}</td><td className={s.mono}>{x.type}</td><td className={cx(s.num, s.mono)}>{x.addr ? hx(x.addr) : '—'}</td><td className={cx(s.num, s.mono)}>{x.size}</td><td className={s.mono}>{x.flags}</td></tr>
              ))}</tbody>
            </table>
            <div className={s.small} style={{ marginTop: 4 }}>{tx(lang, `${B.sections.length} sections in total; A = allocated in memory, X = executable, W = writable.`, `Tổng cộng ${B.sections.length} section; A = có trong bộ nhớ, X = chạy được, W = ghi được.`)}</div>
          </div>
        )}
        {stage === 4 && (
          <div className={s.panel} style={{ overflowX: 'auto' }}>
            <div className={s.panelTitle}>{tx(lang, 'Program headers: what execve maps', 'Program header: thứ execve ánh xạ')}</div>
            <table className={cx(s.tbl, s.compact)}>
              <thead><tr><th>LOAD</th><th className={s.num}>{tx(lang, 'virtual addr', 'địa chỉ ảo')}</th><th className={s.num}>{tx(lang, 'in file', 'trong tệp')}</th><th className={s.num}>{tx(lang, 'in memory', 'trong bộ nhớ')}</th><th>{tx(lang, 'rights', 'quyền')}</th></tr></thead>
              <tbody>{B.segments.map((x, k) => (
                <tr key={k}><td>#{k}</td><td className={cx(s.num, s.mono)}>{hx(x.vaddr)}</td><td className={cx(s.num, s.mono)}>{x.filesz}</td><td className={cx(s.num, s.mono)}>{x.memsz}</td><td className={s.mono}>{x.flags.split('').map((f) => ({ R: 'r', W: 'w', E: 'x' } as Record<string, string>)[f]).join('')}</td></tr>
              ))}</tbody>
            </table>
            <div className={s.panelTitle} style={{ marginTop: 10 }}>{tx(lang, 'Where our names ended up (nm)', 'Tên của ta nằm ở đâu (nm)')}</div>
            <table className={cx(s.tbl, s.compact)}>
              <tbody>{[entryFn, 'main', ...data0].filter((n, k, a) => a.indexOf(n) === k).map((n) => { const y = sym(n); return y ? (
                <tr key={n}><td className={s.mono}><b>{n}</b></td><td className={s.mono}>{hx(y.addr)}</td><td>{y.type === 'T' ? tx(lang, 'code (.text)', 'mã (.text)') : y.type === 'D' ? '.data' : y.type === 'B' ? tx(lang, '.bss (zeroed)', '.bss (bằng 0)') : y.type}</td></tr>
              ) : null; })}</tbody>
            </table>
            <a href={`/os-lab?sim=memory&preset=layout&lang=${lang}`} target="_blank" rel="noopener" style={{ fontWeight: 700, fontSize: 13, color: 'var(--ol-accent)' }}>{tx(lang, 'See the whole process memory layout in the OS lab →', 'Xem toàn bộ bố cục bộ nhớ tiến trình trong phòng lab OS →')}</a>
          </div>
        )}
        {stage === 5 && (
          <div className={s.panel} style={{ overflowX: 'auto' }}>
            <div className={s.term} style={{ marginBottom: 8 }}>
              <span className={s.pr}>$</span> gcc -{opt} {prog}.c -o prog && ./prog; echo $?{'\n'}{EXPECT[prog]}
            </div>
            <div className={s.panelTitle}>{tx(lang, 'Toy CPU ↔ real CPU', 'CPU đồ chơi ↔ CPU thật')}</div>
            <table className={cx(s.tbl, s.compact)}>
              <thead><tr><th>MARIE</th><th>x86-64</th><th>ARM64</th></tr></thead>
              <tbody>
                <tr><td>AC ({tx(lang, '1 register', '1 thanh ghi')})</td><td>rax…r15 (16)</td><td>x0…x30 (31)</td></tr>
                <tr><td>PC</td><td>rip</td><td>pc</td></tr>
                <tr><td>IR, MAR, MBR</td><td colSpan={2}>{tx(lang, 'hidden inside the core (decoders, load/store units)', 'ẩn trong lõi (bộ giải mã, khối nạp/ghi)')}</td></tr>
                <tr><td>Load X · Store X</td><td>mov eax, [x] · mov [z], eax</td><td>ldr w0, [x1] · str w0, [x1]</td></tr>
                <tr><td>Add Y</td><td>add eax, [y] ({tx(lang, 'memory operand OK', 'được lấy thẳng bộ nhớ')})</td><td>add w0, w0, w1 ({tx(lang, 'registers only', 'chỉ thanh ghi')})</td></tr>
                <tr><td>Skipcond + Jump</td><td>cmp + jle / jne</td><td>cmp + b.le / bne</td></tr>
                <tr><td>Halt</td><td colSpan={2}>{tx(lang, 'ret from main → libc calls exit() → the kernel ends the process', 'ret khỏi main → libc gọi exit() → nhân kết thúc tiến trình')}</td></tr>
                <tr><td>{tx(lang, '16-bit word, 4096 cells', 'từ 16 bit, 4096 ô')}</td><td colSpan={2}>{tx(lang, '64-bit registers, byte-addressed, 2⁴⁸ bytes of virtual space', 'thanh ghi 64 bit, đánh địa chỉ theo byte, không gian ảo 2⁴⁸ byte')}</td></tr>
                <tr><td>{tx(lang, 'fixed 16-bit instructions', 'lệnh cố định 16 bit')}</td><td>{tx(lang, '1–15 bytes (CISC)', '1–15 byte (CISC)')}</td><td>{tx(lang, '4 bytes (RISC)', '4 byte (RISC)')}</td></tr>
                <tr><td>{tx(lang, 'one step at a time', 'mỗi lúc một bước')}</td><td colSpan={2}>{tx(lang, 'pipelined, superscalar, out-of-order, with caches and branch prediction (CEA201 Ch12–14)', 'pipeline, siêu vô hướng, thực thi không theo thứ tự, có cache và dự đoán rẽ nhánh (CEA201 Ch12–14)')}</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className={s.small} style={{ marginTop: 8 }}>{tx(lang, 'Toolchain', 'Bộ công cụ')}: {D.toolchain.x86} · {D.toolchain.arm} (aarch64) · {D.toolchain.binutils} · {tx(lang, 'flags', 'cờ')}: {D.flags} · {tx(lang, 'generated', 'sinh ngày')} {D.generatedAt}</div>
    </CpuFrame>
  );
}
