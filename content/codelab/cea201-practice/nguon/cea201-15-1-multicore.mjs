/** CEA201 · 15.1 — Multicore: Flynn, SMP, cache coherence (MESI), Amdahl on n cores. Trạng thái MESI do S.mesi tính. */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, r2, dat } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Multicore 1 — Parallel organizations and cache coherence: concepts',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Concept questions on multiprocessors and multicore chips.</p>', '<p>Câu hỏi khái niệm về đa xử lý và chip đa lõi.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Why did processor makers move to multicore?', 'Vì sao các hãng chuyển sang đa lõi?'], ['Power and heat limited single-core clock speed and ILP', 'Software became easier to write', 'Caches stopped working', 'Memory became infinitely fast'], ['The “power wall”: more performance needs more cores at modest clocks.', '“Bức tường công suất”: muốn hiệu năng thì thêm lõi ở xung nhịp vừa phải.']),
    q('c2', ['In an SMP system …', 'Trong hệ SMP …'], ['all processors share the main memory and are controlled by one OS', 'each processor has private memory and its own OS', 'only one processor can access memory', 'processors cannot have caches'], ['Symmetric multiprocessors: equal access to memory and I/O.', 'Đa xử lý đối xứng: truy cập bộ nhớ và I/O bình đẳng.']),
    q('c3', ['The cache coherence problem arises because …', 'Bài toán nhất quán cache nảy sinh vì …'], ['several caches may hold different copies of the same memory block', 'private caches are too small to hold a whole block', 'the shared bus is too slow to serve several cores', 'the TLB of one core is full and evicts valid translations'], ['A write in one cache must become visible to the others.', 'Một lần ghi ở cache này phải hiện ra với các cache khác.']),
    q('c4', ['In MESI, a line in the M (Modified) state …', 'Trong MESI, dòng ở trạng thái M (Modified) …'], ['is dirty and the only valid copy; memory is stale', 'is clean, shared, and may be dropped silently', 'is invalid and must be fetched again', 'exists in every cache and matches memory'], ['It must be written back (or supplied to a requester) before others can use it.', 'Phải ghi trả (hoặc cung cấp cho bên yêu cầu) trước khi người khác dùng.']),
    q('c5', ['SIMD (Flynn) means …', 'SIMD (Flynn) nghĩa là …'], ['one instruction stream applied to many data items', 'many instruction streams on one datum', 'one stream on one datum', 'many instruction streams on many data'], ['GPUs and vector units are SIMD-like.', 'GPU và khối vector giống SIMD.']),
    q('c6', ['Hardware multithreading (SMT) lets a core …', 'Đa luồng phần cứng (SMT) cho phép một lõi …'], ['hold the state of several threads and fill idle issue slots with another thread', 'run at a higher clock by switching threads on every rising and falling edge', 'avoid using a cache, because each thread keeps its own private memory', 'run several programs without an OS, because the threads schedule themselves'], ['When one thread stalls, another uses the functional units.', 'Khi một luồng đình trệ, luồng khác dùng khối chức năng.']),
  ],
  goiY: ['MESI = Modified, Exclusive, Shared, Invalid.', 'Flynn: SISD, SIMD, MISD, MIMD.'],
  loiHayGap: ['Thinking cache coherence is a software problem only.', 'Mixing up Shared and Exclusive.'],
  thuatNgu: [tn('cache coherence', 'nhất quán cache'), tn('SMT', 'đa luồng đồng thời')],
  khaiNiem: ['SMP', 'MESI', 'Flynn'],
});

const FL = [['A single-core scalar CPU running one program', 'SISD'], ['A GPU applying the same instruction to thousands of pixels', 'SIMD'], ['An 8-core desktop CPU running 8 different programs', 'MIMD'], ['A cluster of servers each running its own code on its own data', 'MIMD'], ['A vector unit adding two arrays element by element in one instruction', 'SIMD']];
const E2 = tinh({
  tieuDe: 'Multicore 2 — Classify with Flynn’s taxonomy',
  doKho: 'EASY', phut: 6,
  moTa: bi('<p>Choose SISD, SIMD, MISD or MIMD for each system.</p>', '<p>Chọn SISD, SIMD, MISD hoặc MIMD cho mỗi hệ thống.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Flynn classes', 'Phân loại Flynn'], [{ ma: 's', ten: 'System' }, { ma: 'c', ten: 'Class', luaChon: ['SISD', 'SIMD', 'MISD', 'MIMD'] }],
    FL.map(([s, c]) => ({ o: { s }, a: { c } })),
    ['Count the instruction streams and the data streams: 1/1 = SISD, 1/many = SIMD, many/many = MIMD (MISD is rare).', 'Đếm luồng lệnh và luồng dữ liệu: 1/1 = SISD, 1/nhiều = SIMD, nhiều/nhiều = MIMD (MISD hiếm).'])],
  goiY: ['One instruction applied to many data = SIMD.', 'Independent programs = MIMD.'],
  loiHayGap: ['Calling a multi-core CPU SIMD.', 'Calling a GPU MIMD at the instruction level.'],
  thuatNgu: [tn('Flynn’s taxonomy', 'phân loại Flynn')],
  khaiNiem: ['Flynn'],
});

const EV3 = [[0, 'R'], [1, 'R'], [2, 'R'], [0, 'W'], [1, 'R'], [2, 'W'], [2, 'R'], [0, 'R']];
const m3 = S.mesi(3, EV3);
const E3 = tinh({
  tieuDe: 'Multicore 3 — MESI trace for one memory block',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Three cores (P0, P1, P2) share one memory block; all caches start with the block <b>Invalid</b>. A read miss with no other copy loads the block <b>Exclusive</b>; a read miss with another copy makes every copy <b>Shared</b> (a Modified owner supplies the data); a write invalidates all other copies and leaves the writer in <b>Modified</b>; hits in M, E or S need no change except a write to E (silently becomes M) or S (invalidates the others, bus upgrade). For each event give the states of <b>P0 P1 P2</b> as three letters (e.g. <code>SSI</code>) and the bus transaction (BusRd, BusRdX, BusUpgr or —).</p>', '<p>Ba lõi (P0, P1, P2) chia sẻ một khối nhớ; mọi cache bắt đầu ở <b>Invalid</b>. Đọc trượt khi không ai có bản sao nạp khối ở <b>Exclusive</b>; đọc trượt khi có bản sao khác làm mọi bản thành <b>Shared</b> (chủ Modified cung cấp dữ liệu); ghi làm mọi bản sao khác Invalid và để bên ghi ở <b>Modified</b>; hit ở M, E hoặc S không đổi gì trừ ghi vào E (âm thầm thành M) hoặc S (vô hiệu hoá bản khác, bus upgrade). Với mỗi sự kiện cho trạng thái của <b>P0 P1 P2</b> dưới dạng ba chữ cái (vd <code>SSI</code>) và giao dịch bus (BusRd, BusRdX, BusUpgr hoặc —).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['MESI states', 'Trạng thái MESI'], [{ ma: 'e', ten: 'Event' }, { ma: 's', ten: 'States P0 P1 P2' }, { ma: 'b', ten: 'Bus', luaChon: ['BusRd', 'BusRdX', 'BusUpgr', '—'] }],
    EV3.map(([c, o], i) => ({ o: { e: `#${i + 1}: P${c} ${o === 'R' ? 'reads' : 'writes'}` }, a: { s: [m3.states[i], m3.states[i].split('').join(' ')], b: m3.bus[i] === '-' ? ['—', '-'] : m3.bus[i] } })),
    ['States after each event: ' + m3.states.join(', ') + '. Bus: ' + m3.bus.join(', ') + '. A write to a Shared line broadcasts an upgrade; a write miss uses BusRdX.', 'Trạng thái sau mỗi sự kiện: ' + m3.states.join(', ') + '. Bus: ' + m3.bus.join(', ') + '.'])],
  goiY: ['Track one letter per core after every event.', 'A write always leaves exactly one valid copy (M).'],
  loiHayGap: ['Leaving other copies Shared after a write.', 'Forgetting that the first reader gets E, not S.'],
  thuatNgu: [tn('bus snooping', 'nghe lén bus')],
  khaiNiem: ['MESI protocol'],
});

const AMD = [[0.9, 4], [0.9, 16], [0.95, 8], [0.95, 64], [0.5, 8]];
const E4 = tinh({
  tieuDe: 'Multicore 4 — Amdahl on n cores: speedup and efficiency',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>A program has a parallel fraction <b>f</b> and runs on <b>n</b> identical cores. Give the speedup 1 / ((1 − f) + f / n) (2 decimals), the efficiency speedup / n in % (1 decimal) and the maximum possible speedup with unlimited cores 1 / (1 − f) (2 decimals).</p>', '<p>Chương trình có phần song song <b>f</b> và chạy trên <b>n</b> lõi giống nhau. Cho tăng tốc 1 / ((1 − f) + f / n) (2 chữ số), hiệu suất tăng tốc / n theo % (1 chữ số) và tăng tốc tối đa với số lõi vô hạn 1 / (1 − f) (2 chữ số).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Speedup and efficiency', 'Tăng tốc và hiệu suất'], [{ ma: 'p', ten: 'f, n' }, { ma: 's', ten: 'Speedup' }, { ma: 'e', ten: 'Efficiency (%)' }, { ma: 'm', ten: 'Max speedup' }],
    AMD.map(([f, n]) => ({ o: { p: `f = ${f}, n = ${n}` }, a: { s: r2(S.amdahl(f, n), 2), e: r2(S.amdahl(f, n) / n * 100, 1), m: r2(1 / (1 - f), 2) } })),
    [AMD.map(([f, n]) => `f=${f}, n=${n}: ${S.amdahl(f, n).toFixed(2)}×, ${(S.amdahl(f, n) / n * 100).toFixed(1)}%, limit ${(1 / (1 - f)).toFixed(2)}`).join('; ') + '. More cores raise the speedup but efficiency collapses.', AMD.map(([f, n]) => `f=${f}, n=${n}: ${S.amdahl(f, n).toFixed(2)}×, ${(S.amdahl(f, n) / n * 100).toFixed(1)}%`).join('; ') + '. Thêm lõi tăng tốc nhưng hiệu suất sụp.'])],
  goiY: ['Use speedup(n) = 1 / ((1 − f) + f/n).', 'Efficiency is speedup divided by the number of cores.'],
  loiHayGap: ['Confusing speedup with efficiency.', 'Using f as the serial fraction.'],
  thuatNgu: [tn('efficiency', 'hiệu suất')],
  khaiNiem: ['Amdahl', 'parallel efficiency'],
});

const mesiTrace = function mesiTrace(nCores, events) {
  var st = [], i, j, out = [], bus = [];
  for (i = 0; i < nCores; i++) st.push('I');
  for (var k = 0; k < events.length; k++) {
    var c = events[k][0], op = events[k][1], b = '-', other = false;
    for (j = 0; j < nCores; j++) if (j !== c && st[j] !== 'I') other = true;
    if (op === 'R') {
      if (st[c] === 'I') {
        b = 'BusRd';
        if (other) { for (j = 0; j < nCores; j++) if (st[j] !== 'I') st[j] = 'S'; st[c] = 'S'; } else st[c] = 'E';
      }
    } else {
      if (st[c] === 'I') b = 'BusRdX'; else if (st[c] === 'S') b = 'BusUpgr';
      for (j = 0; j < nCores; j++) if (j !== c) st[j] = 'I';
      st[c] = 'M';
    }
    out.push(st.join('')); bus.push(b);
  }
  return { states: out, bus: bus };
};
const E5 = jsDe({
  tieuDe: 'Multicore 5 — Write a MESI coherence simulator',
  doKho: 'HARD', phut: 25,
  moTa: bi('<p>Write <code>mesiTrace(nCores, events)</code> for ONE memory block. <code>events</code> is a list of <code>[core, "R"|"W"]</code>. States per core are <code>I</code>, <code>S</code>, <code>E</code>, <code>M</code>; all start <code>I</code>. Rules: <b>read</b> — a hit (S, E, M) changes nothing; a read miss (I) uses <code>BusRd</code>: if any other core holds the block, every holder (including a Modified owner that supplies the data) becomes <code>S</code> and so does the reader, otherwise the reader gets <code>E</code>. <b>write</b> — in <code>M</code> or <code>E</code> no bus transaction (E becomes M silently); in <code>S</code> the bus transaction is <code>BusUpgr</code>; in <code>I</code> it is <code>BusRdX</code>; in every case all other cores go to <code>I</code> and the writer to <code>M</code>. Return <code>{ states, bus }</code>: <code>states[i]</code> is a string of one letter per core after event <i>i</i>, <code>bus[i]</code> the transaction name or <code>"-"</code>.</p>', '<p>Viết <code>mesiTrace(nCores, events)</code> cho MỘT khối nhớ. <code>events</code> là danh sách <code>[lõi, "R"|"W"]</code>. Trạng thái mỗi lõi là <code>I</code>, <code>S</code>, <code>E</code>, <code>M</code>; tất cả bắt đầu <code>I</code>. Quy tắc: <b>đọc</b> — hit (S, E, M) không đổi gì; đọc trượt (I) dùng <code>BusRd</code>: nếu lõi khác đang giữ khối thì mọi bên giữ (kể cả chủ Modified cung cấp dữ liệu) và bên đọc đều thành <code>S</code>, ngược lại bên đọc nhận <code>E</code>. <b>ghi</b> — ở <code>M</code> hoặc <code>E</code> không có giao dịch bus (E thành M âm thầm); ở <code>S</code> giao dịch là <code>BusUpgr</code>; ở <code>I</code> là <code>BusRdX</code>; mọi trường hợp các lõi khác về <code>I</code> và bên ghi thành <code>M</code>. Trả <code>{ states, bus }</code>: <code>states[i]</code> là chuỗi một chữ cái mỗi lõi sau sự kiện <i>i</i>, <code>bus[i]</code> là tên giao dịch hoặc <code>"-"</code>.</p>'),
  viDu: [{ input: 'mesiTrace(2, [[0,"R"],[1,"R"],[1,"W"]])', output: JSON.stringify(mesiTrace(2, [[0, 'R'], [1, 'R'], [1, 'W']])), explanation: 'P0 reads: E; P1 reads: both S; P1 writes: upgrade, P0 invalid, P1 modified.|||P0 đọc: E; P1 đọc: cả hai S; P1 ghi: upgrade, P0 invalid, P1 modified.' }],
  goiY: ['Keep an array of states; handle R and W separately.', 'Before changing states, check whether any OTHER core holds the block.', 'A write ends in the same state for every case: writer M, the rest I.'],
  loiHayGap: ['Giving the reader E when another core holds the block.', 'Emitting a bus transaction for a write that hits in E or M.'],
  giaiThich: '<p>MESI is a four-state machine per cache line; the bus transaction types make the sharing visible to the other caches so exactly one writer exists at any time.</p>',
  khaiNiem: ['MESI', 'cache coherence'],
  fn: 'mesiTrace',
  dau: 'function mesiTrace(nCores, events) {\n  return { states: [], bus: [] };\n}\n',
  giaiMa: dat(mesiTrace, 'mesiTrace'),
  ref: mesiTrace,
  cases: [{ args: [2, [[0, 'R'], [1, 'R'], [1, 'W']]] }, { args: [3, EV3] }, { args: [2, [[0, 'W'], [0, 'R'], [1, 'R']]] }, { args: [2, [[0, 'R'], [0, 'W'], [1, 'W'], [0, 'W']]] }, { args: [4, [[3, 'R'], [1, 'R'], [0, 'W'], [2, 'R'], [2, 'W']]], an: true }, { args: [1, [[0, 'R'], [0, 'W'], [0, 'R']]], an: true }, { args: [3, []], an: true }],
});

export default doiDau({
  slug: 'cea201-15-1-multicore',
  ten: '15.1 Multicore & cache coherence',
  khoa: KHOA,
  baiHoc: 'cea201-15-1-multicore',
  de: [E1, E2, E3, E4, E5],
});
void hai; void giai; void mc;
