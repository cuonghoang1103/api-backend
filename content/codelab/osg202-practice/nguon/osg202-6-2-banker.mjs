/**
 * OSG202 · 6.2 — The Banker's algorithm: Need matrix, safe sequence, request decisions, deadlock detection.
 * Trạng thái ví dụ lấy từ Silberschatz (5 tiến trình, A B C = 10 5 7).
 */
import { doiDau, KHOA, S, bi, hai, giai, tab, tinh, jsDe, dat, mc, tn, xoay } from './_os.mjs';

const alloc = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]];
const max = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const avail = [3, 3, 2];
const bk = S.banker(avail, alloc, max);
const matrix = (m) => tab(['', 'A', 'B', 'C'], m.map((r, i) => [`P${i}`, ...r]));
const estado = `<p>Available = (${avail.join(', ')}).</p><div style="display:flex;gap:24px;flex-wrap:wrap"><div><b>Allocation</b>${matrix(alloc)}</div><div><b>Max</b>${matrix(max)}</div></div>`;
const RULE = 'At every step choose the LOWEST-numbered unfinished process whose Need ≤ Work.';
const RULE_VI = 'Ở mỗi bước chọn tiến trình CHƯA XONG có số nhỏ nhất mà Need ≤ Work.';

const E1 = tinh({
  tieuDe: 'Banker 1 — Compute the Need matrix',
  doKho: 'EASY', phut: 7,
  moTa: bi(`<p>Need = Max − Allocation. Fill in the Need matrix of the state below.</p>${estado}`, `<p>Need = Max − Allocation. Điền ma trận Need của trạng thái dưới đây.</p>${estado}`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Need', 'Need'),
    cot: [{ ma: 'p', ten: 'Process' }, { ma: 'a', ten: 'A' }, { ma: 'b', ten: 'B' }, { ma: 'c', ten: 'C' }],
    hang: bk.need.map((_, i) => ({ ma: `P${i}`, o: { p: `P${i}` } })),
    dapAn: Object.fromEntries(bk.need.flatMap((r, i) => [[`P${i}.a`, String(r[0])], [`P${i}.b`, String(r[1])], [`P${i}.c`, String(r[2])]])),
    giaiThich: giai('Need = ' + bk.need.map((r, i) => `P${i}(${r.join(',')})`).join(' ') + '. Need tells how much more each process may still ask for.', 'Need = ' + bk.need.map((r, i) => `P${i}(${r.join(',')})`).join(' ') + '. Need cho biết mỗi tiến trình còn có thể xin thêm bao nhiêu.'),
  }],
  goiY: ['Subtract element by element: P0 = (7,5,3) − (0,1,0).', 'Check: Allocation + Need = Max for every cell.'],
  loiHayGap: ['Subtracting Max from Allocation (negative numbers).', 'Mixing up rows and columns.'],
  giaiThich: '<p>' + bk.need.map((r) => `(${r.join(',')})`).join(' ') + '</p>',
  thuatNgu: [tn('Need', 'nhu cầu còn lại = Max − Allocation'), tn('Available', 'số tài nguyên rảnh')],
  khaiNiem: ['banker algorithm', 'Need matrix'],
});

const SEQ = bk.seq.map((i) => `P${i}`);
const E2 = tinh({
  tieuDe: 'Banker 2 — Find the safe sequence',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>Is the state below safe? Put the processes in the order in which the safety algorithm finishes them. ${RULE} After a process finishes, its Allocation is added to Work (Work starts as Available).</p>${estado}`,
    `<p>Trạng thái dưới đây có an toàn không? Xếp các tiến trình theo thứ tự thuật toán an toàn cho chúng hoàn thành. ${RULE_VI} Khi một tiến trình xong, Allocation của nó được cộng vào Work (Work ban đầu là Available).</p>${estado}`),
  loai: 'order',
  cauHoi: [{
    ma: 'q1', de: hai('Safe sequence (lowest index first)', 'Dãy an toàn (số nhỏ trước)'),
    muc: xoay(SEQ.map((p) => ({ ma: p, noiDung: p })), 2), dapAn: SEQ,
    giaiThich: giai(`The state is SAFE. Trace: Work=(${avail.join(',')}) → ` + (() => { let w = avail.slice(); return bk.seq.map((i) => { w = w.map((v, j) => v + alloc[i][j]); return `P${i} (Work → ${w.join(',')})`; }).join(', '); })() + '. Other safe sequences exist (e.g. P1, P3, P4, P0, P2); the rule makes the answer unique.', `Trạng thái AN TOÀN. Vết: Work=(${avail.join(',')}) → ` + (() => { let w = avail.slice(); return bk.seq.map((i) => { w = w.map((v, j) => v + alloc[i][j]); return `P${i} (Work → ${w.join(',')})`; }).join(', '); })() + '. Còn các dãy an toàn khác (vd P1, P3, P4, P0, P2); quy tắc trên làm đáp án duy nhất.'),
  }],
  goiY: ['Compute Need first (previous exercise). Then loop: find a process with Need ≤ Work, “run” it, add its Allocation back.', 'After P1 finishes Work becomes (5,3,2), so P3 can run, and so on.'],
  loiHayGap: ['Adding Max instead of Allocation to Work when a process finishes.', 'Comparing Need with Available forever instead of with the growing Work.'],
  giaiThich: '<p>' + SEQ.join(' → ') + '</p>',
  thuatNgu: [tn('safe sequence', 'dãy an toàn'), tn('Work', 'vector làm việc của thuật toán an toàn')],
  khaiNiem: ['safety algorithm', 'safe state'],
});

const reqs = [[1, 1, [1, 0, 2]], [4, 4, [3, 3, 0]], [0, 0, [0, 2, 0]], [2, 2, [6, 0, 0]], [3, 3, [3, 0, 0]], [4, 1, [0, 0, 1]]];
const dec = reqs.map(([p, , r]) => S.banker_request(avail, alloc, max, p, r));
const OUT = ['GRANT', 'WAIT', 'DENY', 'UNSAFE'];
const E3 = tinh({
  tieuDe: 'Banker 3 — Resource-request decisions',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi(`<p>For each INDEPENDENT request (always starting from the state below) decide: <b>DENY</b> (the request exceeds the process’s Need: error), <b>WAIT</b> (exceeds Available: the process must wait), <b>UNSAFE</b> (resources are available but granting leads to an unsafe state, so the request is refused for now) or <b>GRANT</b> (safe).</p>${estado}`,
    `<p>Với mỗi yêu cầu ĐỘC LẬP (luôn xuất phát từ trạng thái dưới đây) hãy quyết định: <b>DENY</b> (yêu cầu vượt Need: lỗi), <b>WAIT</b> (vượt Available: tiến trình phải chờ), <b>UNSAFE</b> (có đủ tài nguyên nhưng cấp xong dẫn tới trạng thái không an toàn nên tạm từ chối) hoặc <b>GRANT</b> (an toàn).</p>${estado}`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Decisions', 'Quyết định'),
    cot: [{ ma: 'r', ten: 'Request' }, { ma: 'd', ten: 'Decision', luaChon: OUT }],
    hang: reqs.map(([p, , r], i) => ({ ma: `r${i}`, o: { r: `P${p} requests (${r.join(', ')})` } })),
    dapAn: Object.fromEntries(dec.map((d, i) => [`r${i}.d`, d])),
    giaiThich: giai(reqs.map(([p, , r], i) => `P${p} (${r.join(',')}): ${dec[i]}`).join('; ') + '. Order of tests: (1) request ≤ Need else error, (2) request ≤ Available else wait, (3) pretend to grant and run the safety algorithm.', reqs.map(([p, , r], i) => `P${p} (${r.join(',')}): ${dec[i]}`).join('; ') + '. Thứ tự kiểm: (1) yêu cầu ≤ Need nếu không là lỗi, (2) yêu cầu ≤ Available nếu không phải chờ, (3) giả vờ cấp và chạy thuật toán an toàn.'),
  }],
  goiY: ['Apply the three tests in order; stop at the first that fails.', 'For the third test copy the state, subtract from Available, add to Allocation, and rerun the safety algorithm.'],
  loiHayGap: ['Skipping the Need check and answering WAIT for an over-claim.', 'Granting because Available is big enough without checking safety.'],
  giaiThich: '<p>' + dec.join(' · ') + '</p>',
  thuatNgu: [tn('resource-request algorithm', 'thuật toán xét yêu cầu tài nguyên')],
  khaiNiem: ['banker algorithm', 'resource request'],
});

/* Bài 4: phát hiện bế tắc nhiều bản */
const A4 = [4, 2, 3]; // available
const AL4 = [[0, 0, 1], [2, 0, 0], [0, 1, 2], [1, 0, 0]];
const RQ4 = [[2, 0, 0], [1, 0, 1], [0, 3, 0], [4, 2, 1]];
const dl = S.deadlocked([0, 0, 0], AL4, RQ4);
const dl2 = S.deadlocked([2, 0, 0], AL4, RQ4);
const dl3 = S.deadlocked([3, 2, 1], AL4, RQ4);
const sc = [['Available = (0, 0, 0)', [0, 0, 0]], ['Available = (2, 0, 0)', [2, 0, 0]], ['Available = (3, 2, 1)', [3, 2, 1]]];
const E4 = tinh({
  tieuDe: 'Banker 4 — Deadlock detection with several instances per resource',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi(`<p>Four processes, three resource types. Allocation (current) and Request (what each process is waiting for) are given. A process whose Allocation is all zero holds nothing. The detection algorithm marks a process FINISHED if its Request ≤ Work and returns its Allocation to Work (Work starts as Available); processes that can never be marked are deadlocked. For each Available vector list the deadlocked processes (e.g. <code>P1,P3</code>; <code>none</code> if no deadlock).</p>${tab(['', 'Alloc A', 'B', 'C', 'Request A', 'B', 'C'], AL4.map((r, i) => [`P${i}`, ...r, ...RQ4[i]]))}`,
    `<p>Bốn tiến trình, ba loại tài nguyên. Cho Allocation (hiện giữ) và Request (đang chờ). Tiến trình có Allocation toàn 0 là không giữ gì. Thuật toán phát hiện đánh dấu một tiến trình XONG nếu Request ≤ Work rồi trả Allocation vào Work (Work ban đầu là Available); tiến trình không bao giờ được đánh dấu là bị deadlock. Với mỗi vector Available liệt kê các tiến trình bị deadlock (vd <code>P1,P3</code>; <code>none</code> nếu không có).</p>${tab(['', 'Alloc A', 'B', 'C', 'Request A', 'B', 'C'], AL4.map((r, i) => [`P${i}`, ...r, ...RQ4[i]]))}`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Deadlocked processes', 'Tiến trình bị deadlock'),
    cot: [{ ma: 's', ten: 'Scenario' }, { ma: 'd', ten: 'Deadlocked' }],
    hang: sc.map(([n], i) => ({ ma: `s${i}`, o: { s: n } })),
    dapAn: Object.fromEntries(sc.map(([, a], i) => { const d = S.deadlocked(a, AL4, RQ4); return [`s${i}.d`, d.length ? d.map((x) => `P${x}`).join(',') : 'none']; })),
    giaiThich: giai(sc.map(([n, a]) => { const d = S.deadlocked(a, AL4, RQ4); return `${n}: ${d.length ? d.map((x) => 'P' + x).join(',') : 'none'}`; }).join('; ') + '.', sc.map(([n, a]) => { const d = S.deadlocked(a, AL4, RQ4); return `${n}: ${d.length ? d.map((x) => 'P' + x).join(',') : 'none'}`; }).join('; ') + '.'),
  }],
  goiY: ['Unlike the Banker, detection uses Request, not Need: it asks “can the CURRENT requests be satisfied?”.', 'A process that finishes returns its Allocation, which may unblock others.'],
  loiHayGap: ['Using Max − Allocation (Need) instead of Request.', 'Forgetting to add the Allocation of a finished process back to Work.'],
  giaiThich: '<p>' + [dl, dl2, dl3].map((d) => (d.length ? d.map((x) => 'P' + x).join(',') : 'none')).join(' · ') + '</p>',
  thuatNgu: [tn('deadlock detection', 'phát hiện bế tắc')],
  khaiNiem: ['deadlock detection'],
});

const E5 = tinh({
  tieuDe: 'Banker 5 — What the Banker’s algorithm needs, and its limits',
  doKho: 'MEDIUM', phut: 9,
  moTa: bi('<p>Five questions on the assumptions and costs of deadlock avoidance.</p>', '<p>Năm câu về giả định và chi phí của việc tránh deadlock.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['Which assumption makes the Banker’s algorithm hard to use in a general-purpose OS?', 'Giả định nào khiến thuật toán nhà băng khó dùng trong OS đa dụng?'], [['a', 'Every process must declare its maximum resource claim in advance'], ['b', 'Every resource must be a printer or another slow device'], ['c', 'Exactly one process may run in the system at any time'], ['d', 'All memory must be paged, so that frames can be counted']], 'a', ['Real programs rarely know their maximum demand beforehand; the number of processes is also not fixed.', 'Chương trình thật hiếm khi biết trước nhu cầu tối đa; số tiến trình cũng không cố định.']),
    mc('c2', ['A state is safe if …', 'Một trạng thái là an toàn nếu …'], [['a', 'there exists an order in which every process can run to completion'], ['b', 'no process is waiting'], ['c', 'Available is positive'], ['d', 'all processes can finish in ANY order']], 'a', ['One good order is enough; the algorithm searches for it.', 'Chỉ cần MỘT thứ tự tốt; thuật toán đi tìm nó.']),
    mc('c3', ['The safety algorithm takes O(m·n²) steps for n processes and m resource types because …', 'Thuật toán an toàn có độ phức tạp O(m·n²) cho n tiến trình và m loại tài nguyên vì …'], [['a', 'up to n rounds each scan n processes comparing m numbers'], ['b', 'it sorts the n processes by need, then each of the m types'], ['c', 'it copies m tables of n rows to the disk before each round'], ['d', 'it simulates every interleaving of n processes on m resources']], 'a', ['Each round finds one process (n scans of m comparisons), at most n rounds.', 'Mỗi vòng tìm được một tiến trình (n lần duyệt, mỗi lần m phép so), tối đa n vòng.']),
    mc('c4', ['After the OS pretends to grant a request and finds the new state UNSAFE, it …', 'Sau khi OS giả vờ cấp một yêu cầu và thấy trạng thái mới KHÔNG an toàn, nó …'], [['a', 'restores the old state and makes the process wait'], ['b', 'kills the process and frees all it holds'], ['c', 'grants it anyway and marks the state safe'], ['d', 'keeps the new state and blocks all others']], 'a', ['The grant is only tentative; the request stays pending.', 'Việc cấp chỉ là tạm; yêu cầu vẫn chờ xử lý.']),
    mc('c5', ['Which pair is correct?', 'Cặp nào đúng?'], [['a', 'Banker’s algorithm = avoidance; cycle search in the allocation graph = detection'], ['b', 'Banker’s algorithm = detection; ordering resources = avoidance'], ['c', 'Spooling = avoidance; Banker = prevention'], ['d', 'Ostrich = avoidance; detection = prevention']], 'a', ['Avoidance decides at request time with extra information; detection looks at the state afterwards.', 'Tránh quyết định lúc yêu cầu bằng thông tin thêm; phát hiện xét trạng thái sau đó.']),
  ],
  goiY: ['“Safe” asks for the EXISTENCE of one good order.', 'Avoidance needs maximum claims; detection only needs current requests.'],
  loiHayGap: ['Believing every unsafe state is already a deadlock.', 'Believing safe means all orders work.'],
  thuatNgu: [tn('maximum claim', 'nhu cầu tối đa khai báo trước')],
  khaiNiem: ['avoidance', 'safe state', 'complexity'],
});

const refB = (a, al, mx) => { const r = S.banker(a, al, mx); return { safe: r.safe, seq: r.seq }; };
const A2 = [[2, 2, 2], [[1, 0, 1], [1, 1, 0], [1, 0, 0]], [[3, 2, 2], [1, 2, 2], [1, 0, 2]]];
const A3 = [[0, 0, 0], [[0, 1, 0], [2, 0, 0], [3, 0, 3]], [[7, 5, 3], [3, 2, 2], [9, 0, 5]]];
const E6 = jsDe({
  tieuDe: 'Banker 6 — Implement the safety and request algorithms',
  doKho: 'HARD', phut: 30,
  moTa: bi(`<p>Write <code>banker(avail, alloc, max)</code> returning <code>{ safe, seq }</code>: <code>seq</code> lists the process indices in the order they finish (${RULE} Stop when none can finish; <code>safe</code> is true iff all processes finished). Then write <code>request(avail, alloc, max, p, req)</code> returning one of <code>'DENY'</code> (req &gt; Need of p), <code>'WAIT'</code> (req &gt; avail), <code>'UNSAFE'</code> (the pretended grant leaves an unsafe state) or <code>'GRANT'</code>. Do not mutate the arguments.</p>`,
    `<p>Viết <code>banker(avail, alloc, max)</code> trả <code>{ safe, seq }</code>: <code>seq</code> là chỉ số tiến trình theo thứ tự hoàn thành (${RULE_VI} Dừng khi không ai xong được; <code>safe</code> là true khi tất cả đã xong). Rồi viết <code>request(avail, alloc, max, p, req)</code> trả <code>'DENY'</code> (req &gt; Need của p), <code>'WAIT'</code> (req &gt; avail), <code>'UNSAFE'</code> (cấp giả định dẫn tới trạng thái không an toàn) hoặc <code>'GRANT'</code>. Không sửa các đối số.</p>`),
  yeuCau: [bi('Both functions work for any number of resource types.', 'Cả hai hàm chạy với số loại tài nguyên bất kỳ.')],
  viDu: [{ input: 'banker([3,3,2], allocation, max)', output: JSON.stringify(refB(avail, alloc, max)), explanation: 'The textbook state: safe, P1 finishes first.|||Trạng thái trong giáo trình: an toàn, P1 xong đầu tiên.' }],
  goiY: ['Need[i][j] = max[i][j] − alloc[i][j]; Work starts as a copy of avail.', 'request() = two comparisons, then banker() on a COPY of the tentative state.'],
  loiHayGap: ['Mutating avail or alloc while testing a request.', 'Picking the process with the smallest Need instead of the lowest index (the rule is stated!).'],
  giaiThich: '<p>request() reduces to one safety check after two cheap comparisons; the safety check is a fixpoint iteration on Work.</p>',
  khaiNiem: ['banker algorithm', 'safety algorithm'],
  fn: 'banker',
  dau: "function banker(avail, alloc, max) {\n  return { safe: false, seq: [] };\n}\nfunction request(avail, alloc, max, p, req) {\n  return 'DENY';\n}\n",
  giaiMa: '// Safety algorithm + request algorithm.\n' + dat(S.banker, 'banker').replace('return { safe: seq.length === n, seq, need, work };', 'return { safe: seq.length === n, seq: seq };') + '\n' + dat(S.banker_request, 'request'),
  ref: refB,
  cases: [{ args: [avail, alloc, max] }, { args: A2 }, { args: A3 }, { args: [[0, 1, 0], alloc, max], an: true }, { args: [[10, 5, 7], [[0, 0, 0]], [[7, 5, 3]]], an: true }],
  kiemThem: [0, 1, 2, 3, 4, 5].map((i) => ({ moTa: bi(`request #${i + 1}`, `yêu cầu #${i + 1}`), goi: `request(${JSON.stringify(avail)}, ${JSON.stringify(alloc)}, ${JSON.stringify(max)}, ${reqs[i][0]}, ${JSON.stringify(reqs[i][2])})`, mongDoi: dec[i], ...(i > 2 ? { an: true } : {}) })),
});

export default doiDau({
  slug: 'osg202-6-2-banker',
  ten: '6.2 Resource graphs & the Banker’s algorithm',
  khoa: KHOA,
  baiHoc: 'osg202-6-2-banker',
  de: [E1, E2, E3, E4, E5, E6],
});
void hai;
