'use client';
/**
 * Bố cục bộ nhớ của một tiến trình: text/rodata/data/bss/heap/mmap/stack/kernel, ASLR xáo địa chỉ mỗi lần chạy,
 * malloc nhỏ (heap/brk) vs lớn (mmap), và khung stack lớn dần khi gọi hàm — chuẩn bị cho chương bảo mật
 * (tràn bộ đệm, stack canary). Minh hoạ phòng thủ: không có mã khai thác nào ở đây.
 */
import { useMemo, useState } from 'react';
import { Shuffle } from 'lucide-react';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, rng, tx, usePlayer, type Lang } from './ui';

type Arch = 'x86_64' | 'aarch64';
// target ES2017 ⇒ không viết được literal 123n; dựng BigInt từ chuỗi
const B = (v: string) => BigInt(v);
const hex = (n: bigint) => '0x' + n.toString(16).padStart(12, '0');

function addresses(arch: Arch, aslr: boolean, seed: number) {
  const r = rng(seed * 7919 + 13);
  const pages = (bits: number) => BigInt(Math.floor(r() * 2 ** bits)) * B('0x1000');
  const x86 = arch === 'x86_64';
  const pie = aslr ? (x86 ? B('0x550000000000') : B('0xaaaa00000000')) + pages(x86 ? 28 : 20) : (x86 ? B('0x555555554000') : B('0xaaaaaaaa0000'));
  const text = pie + B('0x1000'), rodata = pie + B('0x2000'), data = pie + B('0x3f00'), bss = pie + B('0x4010');
  const heap = (pie + B('0x5000')) + (aslr ? pages(13) : B('0'));
  const mmapTop = aslr ? (x86 ? B('0x7f0000000000') : B('0xffff00000000')) + pages(x86 ? 28 : 18) : (x86 ? B('0x7ffff7fc3000') : B('0xfffff7ff0000'));
  const libc = mmapTop - B('0x228000');
  const big = libc - B('0x101000');
  const stack = aslr ? (x86 ? B('0x7ffc00000000') : B('0xffffc0000000')) + BigInt(Math.floor(r() * 2 ** 30)) * B('0x10') : (x86 ? B('0x7fffffffe3c0') : B('0xfffffffff2c0'));
  return { pie, text, rodata, data, bss, heap, libc, big, stack, mainAddr: text + B('0x189'), printfAddr: libc + B('0x60100') };
}

const SEGS: Array<{ k: string; en: string; vi: string; c: string; noteEn: string; noteVi: string }> = [
  { k: 'kernel', en: 'kernel space', vi: 'vùng của nhân', c: '#64748b', noteEn: 'Mapped in every process but off-limits in user mode — touching it is a segfault. System calls are the only door.', noteVi: 'Có mặt trong mọi tiến trình nhưng cấm truy cập ở chế độ người dùng — chạm vào là segfault. System call là cửa duy nhất.' },
  { k: 'stack', en: '[stack] — grows down ↓', vi: '[stack] — lớn dần xuống ↓', c: '#dc2626', noteEn: 'One frame per function call: return address, saved registers, local variables. Default limit 8 MiB (ulimit -s); go past it and you hit a guard page → SIGSEGV.', noteVi: 'Mỗi lần gọi hàm một khung: địa chỉ trả về, thanh ghi đã lưu, biến cục bộ. Giới hạn mặc định 8 MiB (ulimit -s); vượt quá là đụng trang bảo vệ → SIGSEGV.' },
  { k: 'mmap', en: 'mmap area: libraries, big mallocs', vi: 'vùng mmap: thư viện, malloc lớn', c: '#7c3aed', noteEn: 'Shared libraries are mapped here (shared between processes through the page cache). glibc serves malloc ≥ 128 KiB with its own mmap, and every pthread gets its stack here.', noteVi: 'Thư viện dùng chung được ánh xạ ở đây (chung giữa các tiến trình nhờ page cache). glibc phục vụ malloc ≥ 128 KiB bằng mmap riêng, và mỗi pthread có stack nằm ở đây.' },
  { k: 'heap', en: '[heap] — grows up ↑ (brk)', vi: '[heap] — lớn dần lên ↑ (brk)', c: '#059669', noteEn: 'Small malloc/new comes from here; the allocator grows it with brk(). Memory you malloc and never free stays here until the process exits — a leak.', noteVi: 'malloc/new nhỏ lấy từ đây; bộ cấp phát nới nó bằng brk(). Bộ nhớ malloc mà không free nằm lại đây tới khi tiến trình thoát — rò rỉ.' },
  { k: 'bss', en: '.bss — zeroed globals', vi: '.bss — biến toàn cục bằng 0', c: '#0891b2', noteEn: 'Globals without an initial value. Takes no space in the file — the kernel hands out zero-filled pages.', noteVi: 'Biến toàn cục không có giá trị khởi tạo. Không tốn chỗ trong file — nhân cấp trang toàn số 0.' },
  { k: 'data', en: '.data — initialised globals', vi: '.data — biến toàn cục có giá trị đầu', c: '#2563eb', noteEn: 'int count = 42; lives here, read-write, copied from the ELF file.', noteVi: 'int count = 42; nằm ở đây, đọc-ghi được, chép từ file ELF.' },
  { k: 'rodata', en: '.rodata — constants, string literals', vi: '.rodata — hằng, chuỗi cố định', c: '#d97706', noteEn: '"Hello" lives here, read-only: writing to a string literal crashes.', noteVi: '"Hello" nằm ở đây, chỉ đọc: ghi vào chuỗi cố định là sập.' },
  { k: 'text', en: '.text — machine code', vi: '.text — mã máy', c: '#b45309', noteEn: 'Your compiled functions. Read + execute, never write (W^X). With PIE + ASLR its base moves every run.', noteVi: 'Các hàm đã biên dịch. Đọc + thực thi, không bao giờ ghi (W^X). Có PIE + ASLR thì địa chỉ gốc đổi mỗi lần chạy.' },
  { k: 'null', en: 'unmapped low pages (NULL)', vi: 'trang thấp không ánh xạ (NULL)', c: '#94a3b8', noteEn: 'Address 0 and the pages above it are never mapped (vm.mmap_min_addr), so dereferencing NULL is a clean SIGSEGV instead of silent corruption.', noteVi: 'Địa chỉ 0 và vài trang trên nó không bao giờ được ánh xạ (vm.mmap_min_addr), nên truy cập NULL là SIGSEGV rõ ràng thay vì âm thầm hỏng dữ liệu.' },
];

/* ── Tab 2: khung stack và tràn bộ đệm ── */
interface Slot { label: string; bytes: number; kind: 'ret' | 'fp' | 'canary' | 'buf' | 'local' }
function frames(canary: boolean): Array<{ fn: string; slots: Slot[] }> {
  return [
    { fn: 'main', slots: [{ label: 'return → __libc_start_call_main', bytes: 8, kind: 'ret' }, { label: 'saved frame pointer', bytes: 8, kind: 'fp' }, { label: 'int n', bytes: 8, kind: 'local' }] },
    { fn: 'handle_request(req)', slots: [{ label: 'return → main+0x2c', bytes: 8, kind: 'ret' }, { label: 'saved frame pointer', bytes: 8, kind: 'fp' }, { label: 'struct req *r', bytes: 8, kind: 'local' }] },
    { fn: 'parse_header(input)', slots: [{ label: 'return → handle_request+0x41', bytes: 8, kind: 'ret' }, { label: 'saved frame pointer', bytes: 8, kind: 'fp' }, ...(canary ? [{ label: 'stack canary', bytes: 8, kind: 'canary' as const }] : []), { label: 'char buf[16]', bytes: 16, kind: 'buf' }] },
  ];
}
const KIND_COLOR: Record<Slot['kind'], string> = { ret: '#dc2626', fp: '#7c3aed', canary: '#d97706', buf: '#059669', local: '#2563eb' };

export default function MemoryLayoutSim({ lang = 'vi', preset = 'layout' }: { lang?: Lang; preset?: string }) {
  const [tab, setTab] = useState<'layout' | 'stack'>(preset === 'stack' || preset === 'overflow' ? 'stack' : 'layout');
  const [arch, setArch] = useState<Arch>('x86_64');
  const [aslr, setAslr] = useState(true);
  const [seed, setSeed] = useState(1);
  const [runs, setRuns] = useState<string[]>([]);
  const A = useMemo(() => addresses(arch, aslr, seed), [arch, aslr, seed]);
  const tour = usePlayer(SEGS.length, 2200);

  const [canary, setCanary] = useState(true);
  const [len, setLen] = useState(preset === 'overflow' ? 30 : 11);
  const sp = usePlayer(6, 1600);

  const printed: Array<[string, string, bigint]> = [
    ['&main', '.text', A.mainAddr], ['&greeting (const char[])', '.rodata', A.rodata + B('0x10')], ['&count (= 42)', '.data', A.data + B('0x10')], ['&zeros (int[1024])', '.bss', A.bss + B('0x20')],
    ['malloc(32)', '[heap]', A.heap + B('0x2a0')], ['malloc(1 MiB)', 'mmap', A.big + B('0x10')], ['&printf', 'libc.so.6', A.printfAddr], ['&local (int)', '[stack]', A.stack - B('0x14')],
  ];
  const rerun = () => { setRuns((r) => [...r.slice(-3), `${hex(A.mainAddr)}  ${hex(A.heap + B('0x2a0'))}  ${hex(A.stack - B('0x14'))}`]); setSeed((x) => x + 1); };

  // ── vẽ bản đồ (không theo tỉ lệ) ──
  const top = 8, bandH = [40, 64, 78, 60, 30, 30, 30, 36, 26];
  let y = top;
  const bands = SEGS.map((g, k) => { const b = { ...g, y, h: bandH[k] }; y += bandH[k] + (k === 1 || k === 2 ? 26 : 4); return b; });
  const H = y + 16;
  const SUB: Record<string, [string, string]> = { stack: ['one frame per call · 8 MiB limit', 'mỗi lời gọi một khung · giới hạn 8 MiB'], mmap: ['libc.so, ld.so · malloc ≥ 128 KiB · thread stacks', 'libc.so, ld.so · malloc ≥ 128 KiB · stack luồng'], heap: ['malloc / new (small objects)', 'malloc / new (đối tượng nhỏ)'] };
  const addrFor: Record<string, string> = {
    kernel: arch === 'x86_64' ? '0xffff800000000000+' : '0xffff000000000000+ (TTBR1)', stack: hex(A.stack), mmap: hex(A.libc), heap: hex(A.heap), bss: hex(A.bss),
    data: hex(A.data), rodata: hex(A.rodata), text: hex(A.text), null: '0x000000000000',
  };
  const cur = SEGS[tour.i].k;

  // ── tab stack ──
  const fr = frames(canary);
  const visible = sp.i === 0 ? 1 : sp.i === 1 ? 2 : sp.i <= 4 ? 3 : sp.i === 5 ? 2 : 1;
  const parse = fr[2];
  const written = sp.i >= 3 && sp.i <= 4 ? len + 1 : 0; // strcpy chép len byte + 1 byte NUL
  // offsets từ buf[0] trở lên
  const order = [...parse.slots].reverse(); // buf → canary → fp → ret
  let off = 0;
  const ranges = order.map((sl) => { const r = { sl, from: off, to: off + sl.bytes }; off += sl.bytes; return r; });
  const hit = (k: Slot['kind']) => ranges.some((r) => r.sl.kind === k && written > r.from);
  const outcome = !written ? null : hit('canary') ? 'abort' : hit('ret') ? 'segv' : hit('fp') ? 'fp' : 'ok';
  const steps = [
    ['The process starts: main() has a frame on the stack.', 'Tiến trình khởi động: main() có một khung trên stack.'],
    ['main calls handle_request(): call pushes the return address, the callee saves the frame pointer and makes room for its locals.', 'main gọi handle_request(): lệnh call đẩy địa chỉ trả về, hàm được gọi lưu frame pointer và dành chỗ cho biến cục bộ.'],
    [`handle_request calls parse_header(input): a 16-byte buffer${canary ? ' and, just above it, a random canary placed by -fstack-protector' : ' (canary disabled: -fno-stack-protector)'}.`, `handle_request gọi parse_header(input): một bộ đệm 16 byte${canary ? ' và ngay phía trên nó là một canary ngẫu nhiên do -fstack-protector đặt' : ' (đã tắt canary: -fno-stack-protector)'}.`],
    [`strcpy(buf, input) copies ${len} bytes + a terminating NUL = ${len + 1} bytes, from buf[0] UPWARDS — towards the saved data, not away from it.`, `strcpy(buf, input) chép ${len} byte + 1 byte NUL kết thúc = ${len + 1} byte, từ buf[0] ĐI LÊN — tiến về phía dữ liệu đã lưu, chứ không xa ra.`],
    ['parse_header returns: the epilogue checks the canary, restores the frame pointer and jumps to the saved return address.', 'parse_header trả về: phần kết của hàm kiểm canary, khôi phục frame pointer rồi nhảy tới địa chỉ trả về đã lưu.'],
    ['Back in handle_request; its frame is popped next and execution returns to main.', 'Quay lại handle_request; khung của nó sẽ được gỡ tiếp và chạy về main.'],
  ];
  const OUT: Record<string, [string, string, 'ok' | 'bad' | 'warn']> = {
    ok: ['Fits: the copy stayed inside buf. Normal return.', 'Vừa: dữ liệu chép nằm gọn trong buf. Trả về bình thường.', 'ok'],
    fp: ['The saved frame pointer was overwritten: this function returns, but its caller now works with a garbage frame and will likely crash later — far from the real bug.', 'Frame pointer đã lưu bị ghi đè: hàm này trả về được, nhưng hàm gọi nó giờ dùng một khung rác và nhiều khả năng sập sau đó — ở xa chỗ lỗi thật.', 'warn'],
    segv: ['The return address became 0x4141414141414141 ("AAAAAAAA"): the CPU jumps there → SIGSEGV, exit 139. An attacker who controls those 8 bytes controls where the program goes next — that is why ASLR, NX and PIE exist (Chapter 13).', 'Địa chỉ trả về thành 0x4141414141414141 ("AAAAAAAA"): CPU nhảy tới đó → SIGSEGV, mã thoát 139. Kẻ tấn công kiểm soát 8 byte đó là kiểm soát chương trình đi đâu tiếp — vì thế mới có ASLR, NX và PIE (Chương 13).', 'bad'],
    abort: ['The canary changed → glibc prints "*** stack smashing detected ***: terminated" and calls abort() (SIGABRT, exit 134) BEFORE using the corrupted return address. The bug is still there, but it can no longer be steered.', 'Canary bị đổi → glibc in "*** stack smashing detected ***: terminated" và gọi abort() (SIGABRT, mã thoát 134) TRƯỚC khi dùng địa chỉ trả về đã hỏng. Lỗi vẫn còn, nhưng không ai điều khiển được nó nữa.', 'bad'],
  };

  return (
    <Frame badge={tx(lang, 'OS lab', 'Phòng lab OS')} title={tx(lang, 'Inside a process’s memory', 'Bên trong bộ nhớ của một tiến trình')} sub={tx(lang, 'Where your code, globals, heap and stack really live', 'Mã, biến toàn cục, heap và stack của bạn thật ra nằm ở đâu')}>
      <div className={s.tabs} role="tablist">
        <button type="button" role="tab" className={cx(s.tab, tab === 'layout' && s.on)} onClick={() => setTab('layout')}>{tx(lang, 'Address space & ASLR', 'Không gian địa chỉ & ASLR')}</button>
        <button type="button" role="tab" className={cx(s.tab, tab === 'stack' && s.on)} onClick={() => setTab('stack')}>{tx(lang, 'Stack frames & overflow', 'Khung stack & tràn bộ đệm')}</button>
      </div>

      {tab === 'layout' ? (
        <>
          <div className={s.bar}>
            <Seg label={tx(lang, 'CPU', 'CPU')} value={arch} options={[['x86_64', 'x86-64'], ['aarch64', 'ARM64']]} onChange={(v) => { setArch(v); setRuns([]); }} />
            <Seg label="ASLR" value={aslr ? 'on' : 'off'} options={[['on', tx(lang, 'on (default)', 'bật (mặc định)')], ['off', tx(lang, 'off (setarch -R)', 'tắt (setarch -R)')]]} onChange={(v) => { setAslr(v === 'on'); setRuns([]); }} />
            <button type="button" className={cx(s.btn, s.primary)} onClick={rerun}><Shuffle />{tx(lang, 'Run the program again', 'Chạy lại chương trình')}</button>
          </div>
          <Controls p={tour} lang={lang} label={tx(lang, `tour ${tour.i + 1}/${SEGS.length}`, `tham quan ${tour.i + 1}/${SEGS.length}`)} />
          <div className={s.grid2}>
            <div className={s.svgWrap}>
              <svg width="100%" viewBox={`0 0 470 ${H}`} role="img" aria-label="address space" style={{ maxWidth: 470, height: 'auto', minWidth: 330 }}>
                <text x={4} y={H - 2} fontSize={10} className={s.svgMuted}>{tx(lang, 'not to scale · low addresses at the bottom', 'không theo tỉ lệ · địa chỉ thấp ở dưới')}</text>
                {bands.map((b) => {
                  const on = b.k === cur;
                  return (
                    <g key={b.k}>
                      <rect x={150} y={b.y} width={300} height={b.h} rx={6} fill={b.c} opacity={on ? 0.95 : b.k === 'kernel' || b.k === 'null' ? 0.25 : 0.55} stroke={on ? 'var(--ol-text)' : 'none'} strokeWidth={2.5} />
                      <text x={160} y={b.y + Math.min(b.h / 2 + 5, 22)} fontSize={12.5} fontWeight={800} fill="#fff">{tx(lang, b.en, b.vi)}</text>
                      {SUB[b.k] && <text x={160} y={b.y + 40} fontSize={10.5} fill="#fff" opacity={0.92}>{tx(lang, SUB[b.k][0], SUB[b.k][1])}</text>}
                      <text x={144} y={b.y + 14} fontSize={10.5} textAnchor="end" className={cx(s.svgMuted)} fontFamily="Menlo,monospace">{addrFor[b.k]}</text>
                    </g>
                  );
                })}
                {/* mũi tên lớn dần */}
                <path d={`M300,${bands[1].y + bands[1].h + 2} l0,14 l-7,0 l7,9 l7,-9 l-7,0`} stroke="#dc2626" strokeWidth={2.5} fill="#dc2626" />
                <path d={`M300,${bands[3].y - 2} l0,-14 l-7,0 l7,-9 l7,9 l-7,0`} stroke="#059669" strokeWidth={2.5} fill="#059669" />
                <text x={318} y={bands[2].y + bands[2].h + 17} fontSize={10.5} className={s.svgMuted}>{tx(lang, 'free space between heap and mmap', 'khoảng trống giữa heap và mmap')}</text>
              </svg>
            </div>
            <div className={s.stack}>
              <Explain>
                <b>{tx(lang, SEGS[tour.i].en, SEGS[tour.i].vi)}.</b> {tx(lang, SEGS[tour.i].noteEn, SEGS[tour.i].noteVi)}
              </Explain>
              <div className={s.scrollX}>
                <table className={s.tbl}>
                  <thead><tr><th>{tx(lang, 'printf("%p") of…', 'printf("%p") của…')}</th><th>{tx(lang, 'region', 'vùng')}</th><th>{tx(lang, 'address this run', 'địa chỉ lần chạy này')}</th></tr></thead>
                  <tbody>
                    {printed.map(([what, reg, a]) => (
                      <tr key={what} className={SEGS.find((g) => reg.includes(g.k) || (g.k === 'mmap' && /mmap|libc/.test(reg)))?.k === cur ? s.hl : undefined}>
                        <td className={s.mono}>{what}</td><td>{reg}</td><td className={s.mono}>{hex(a)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {runs.length > 0 && (
                <div className={s.term}>{tx(lang, '# earlier runs: &main  malloc(32)  &local', '# các lần chạy trước: &main  malloc(32)  &local')}{'\n'}{runs.join('\n')}{'\n'}{`${hex(A.mainAddr)}  ${hex(A.heap + B('0x2a0'))}  ${hex(A.stack - B('0x14'))}   ← ${tx(lang, 'now', 'bây giờ')}`}</div>
              )}
              <div className={s.small}>{aslr
                ? tx(lang, 'ASLR on: every run gets new random bases for the program (PIE), heap, libraries and stack — the last 12 bits (offset inside a 4 KiB page) never change. Press "Run again".', 'ASLR bật: mỗi lần chạy, chương trình (PIE), heap, thư viện và stack có gốc ngẫu nhiên mới — riêng 12 bit cuối (vị trí trong trang 4 KiB) không đổi. Bấm "Chạy lại".')
                : tx(lang, 'ASLR off: the same addresses every run — handy in gdb, terrible for security. Debuggers turn it off for you; production must not.', 'ASLR tắt: lần nào cũng đúng các địa chỉ đó — tiện khi dùng gdb, tệ cho bảo mật. Trình gỡ lỗi tự tắt cho bạn; production thì không được tắt.')}</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={s.bar}>
            <span className={s.lbl}>{tx(lang, 'Input length (bytes)', 'Độ dài dữ liệu vào (byte)')}
              <input type="range" min={0} max={48} value={len} onChange={(e) => setLen(Number(e.target.value))} style={{ width: 160 }} /><b className={s.mono}>{len}</b></span>
            <Seg label={tx(lang, 'Stack protector', 'Bảo vệ stack')} value={canary ? 'on' : 'off'} options={[['on', '-fstack-protector-strong'], ['off', '-fno-stack-protector']]} onChange={(v) => setCanary(v === 'on')} />
          </div>
          <Controls p={sp} lang={lang} />
          <Explain tone={sp.i === 4 && outcome ? OUT[outcome][2] : undefined}>
            {tx(lang, steps[sp.i][0], steps[sp.i][1])}
            {sp.i === 4 && outcome && <> <b>{tx(lang, OUT[outcome][0], OUT[outcome][1])}</b></>}
          </Explain>
          <div className={s.grid2} style={{ marginTop: 10 }}>
            <div className={s.panel}>
              <div className={s.panelTitle}>{tx(lang, 'Call stack (high addresses on top, grows down)', 'Ngăn xếp lời gọi (địa chỉ cao ở trên, lớn dần xuống)')}</div>
              {fr.slice(0, visible).map((f, fi) => (
                <div key={f.fn} style={{ border: '2px solid var(--ol-border)', borderRadius: 9, marginBottom: 6, padding: 6, background: fi === visible - 1 ? 'var(--ol-accent-bg)' : 'var(--ol-bg)' }}>
                  <div className={s.mono} style={{ fontWeight: 800, marginBottom: 4 }}>{f.fn}</div>
                  {f.slots.map((sl) => {
                    const r = fi === 2 ? ranges.find((x) => x.sl === sl) : undefined;
                    const dirty = r && written > r.from;
                    return (
                      <div key={sl.label} className={s.mono} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '2px 6px', borderLeft: `5px solid ${KIND_COLOR[sl.kind]}`, marginBottom: 2, background: dirty && sl.kind !== 'buf' ? 'var(--ol-bad-bg)' : 'transparent' }}>
                        <span>{sl.label}</span><span className={s.small}>{sl.bytes} B{dirty && sl.kind !== 'buf' ? ' ✗' : ''}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className={s.small}>{tx(lang, 'rsp (stack pointer) points at the bottom of the newest frame.', 'rsp (con trỏ stack) trỏ vào đáy của khung mới nhất.')}</div>
            </div>
            <div className={s.panel}>
              <div className={s.panelTitle}>{tx(lang, 'parse_header’s frame, byte by byte (buf[0] at the bottom)', 'Khung của parse_header, từng byte (buf[0] ở dưới)')}</div>
              {visible >= 3 ? (
                <div className={s.stack} style={{ gap: 4 }}>
                  {[...ranges].reverse().map(({ sl, from }) => (
                    <div key={sl.label}>
                      <div className={s.small} style={{ color: KIND_COLOR[sl.kind], fontWeight: 800 }}>{sl.label}</div>
                      <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {Array.from({ length: sl.bytes }, (_, b) => {
                          const pos = from + b, w = pos < written;
                          const ch = w ? (pos === written - 1 ? '00' : '41') : sl.kind === 'canary' ? (b === 0 ? '00' : 'c3') : sl.kind === 'ret' ? ['5b', '12', '40', '55', '55', '55', '00', '00'][b] ?? '00' : sl.kind === 'fp' ? 'e0' : '..';
                          return <span key={b} className={s.mono} style={{ width: 22, textAlign: 'center', borderRadius: 3, fontSize: 10.5, padding: '2px 0', background: w ? (sl.kind === 'buf' ? 'var(--ol-ok-bg)' : 'var(--ol-bad)') : 'var(--ol-panel2)', color: w && sl.kind !== 'buf' ? '#fff' : 'var(--ol-text)' }}>{ch}</span>;
                        })}
                      </div>
                    </div>
                  ))}
                  <div className={s.kpis} style={{ marginTop: 4 }}>
                    <Kpi k={tx(lang, 'bytes written', 'byte đã ghi')} v={written} tone={written > 16 ? 'bad' : undefined} />
                    <Kpi k={tx(lang, 'buffer size', 'cỡ bộ đệm')} v={16} />
                  </div>
                  <div className={s.small}>{tx(lang, '41 = "A". On little-endian CPUs the lowest byte is stored first. The canary’s lowest byte is 00 on purpose, so string functions stop at it.', '41 = "A". CPU little-endian lưu byte thấp trước. Byte thấp nhất của canary cố ý là 00 để các hàm xử lý chuỗi dừng ở đó.')}</div>
                </div>
              ) : <div className={s.empty}>{tx(lang, 'Step forward until parse_header is called.', 'Bấm tới cho đến khi parse_header được gọi.')}</div>}
            </div>
          </div>
        </>
      )}
    </Frame>
  );
}
