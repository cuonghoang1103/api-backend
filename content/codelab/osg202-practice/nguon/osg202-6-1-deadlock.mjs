/**
 * OSG202 · 6.1 — Deadlock: the four conditions, resource-allocation graphs, handling strategies.
 */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, dat, mc, tn } from './_os.mjs';

const E1 = tinh({
  tieuDe: 'Deadlock 1 — The four conditions and the ostrich',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five questions on the theory of deadlock.</p>', '<p>Năm câu về lý thuyết deadlock.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['Which set lists the four necessary conditions for deadlock?', 'Tập nào liệt kê bốn điều kiện cần của deadlock?'], [['a', 'Mutual exclusion, hold and wait, no preemption, circular wait'], ['b', 'Mutual exclusion, starvation, paging, circular wait'], ['c', 'Hold and wait, aging, no preemption, spooling'], ['d', 'Race, hold and wait, preemption, circular wait']], 'a', ['All four must hold simultaneously (Coffman 1971). Break any one and deadlock is impossible.', 'Cả bốn phải đồng thời xảy ra (Coffman 1971). Phá một điều kiện là hết deadlock.']),
    mc('c2', ['The “ostrich algorithm” for deadlock means …', '“Thuật toán đà điểu” với deadlock nghĩa là …'], [['a', 'ignore the problem and let the user reboot if it happens'], ['b', 'detect the cycle and kill one process in it at once'], ['c', 'never grant a resource that could lead to a cycle'], ['d', 'preempt every resource as soon as a cycle shows up']], 'a', ['Used by UNIX and Windows for most resources: deadlock is rare and prevention is costly.', 'UNIX và Windows dùng cho hầu hết tài nguyên: deadlock hiếm, ngăn chặn thì đắt.']),
    mc('c3', ['Which condition is broken by the rule “a process must request ALL its resources at once before it starts”?', 'Điều kiện nào bị phá bởi quy tắc “tiến trình phải xin TẤT CẢ tài nguyên một lần trước khi bắt đầu”?'], [['a', 'Hold and wait'], ['b', 'Mutual exclusion'], ['c', 'No preemption'], ['d', 'Circular wait']], 'a', ['A process never holds one resource while waiting for another.', 'Tiến trình không bao giờ giữ một tài nguyên trong khi chờ tài nguyên khác.']),
    mc('c4', ['“Number all resource types and require processes to request them in increasing order” breaks …', '“Đánh số mọi loại tài nguyên và buộc tiến trình xin theo thứ tự tăng dần” phá …'], [['a', 'Circular wait'], ['b', 'Hold and wait'], ['c', 'Mutual exclusion'], ['d', 'No preemption']], 'a', ['A cycle would need some process to wait for a lower-numbered resource while holding a higher one, which the rule forbids.', 'Chu trình cần một tiến trình chờ tài nguyên số thấp khi đang giữ số cao, điều quy tắc cấm.']),
    mc('c5', ['Deadlock versus starvation: which statement is correct?', 'Deadlock so với starvation: phát biểu nào đúng?'], [['a', 'In deadlock a set of processes is blocked forever waiting for each other; in starvation a process waits indefinitely while others progress'], ['b', 'They are the same: in both, every process of the system is blocked forever waiting for an event'], ['c', 'Starvation needs a cycle in the wait-for graph; in deadlock a process waits indefinitely while others progress'], ['d', 'Deadlock happens only with CPU scheduling; starvation happens only with memory and I/O resources']], 'a', ['Starvation can be cured by aging; deadlock needs prevention, avoidance or recovery.', 'Starvation chữa bằng aging; deadlock cần ngăn chặn, tránh hoặc phục hồi.']),
  ],
  goiY: ['All four conditions are necessary, none alone is sufficient.', 'Match each prevention rule to the condition it attacks.'],
  loiHayGap: ['Listing starvation as a Coffman condition.', 'Believing that breaking mutual exclusion is always possible (printers cannot be shared).'],
  thuatNgu: [tn('deadlock', 'bế tắc'), tn('ostrich algorithm', 'thuật toán đà điểu: lờ đi'), tn('no preemption', 'tài nguyên không thể bị thu hồi cưỡng bức')],
  khaiNiem: ['deadlock', 'Coffman conditions'],
});

const G = [
  ['Graph A', ['P1>R1', 'R1>P2', 'P2>R2', 'R2>P1']],
  ['Graph B', ['P1>R1', 'R1>P2', 'P2>R2', 'R2>P3']],
  ['Graph C', ['P1>R1', 'R1>P2', 'P2>R2', 'R2>P3', 'P3>R3', 'R3>P1', 'P4>R2']],
  ['Graph D', ['R1>P1', 'R2>P2', 'P1>R2', 'P2>R3', 'R3>P3']],
];
const E2 = tinh({
  tieuDe: 'Deadlock 2 — Read a resource-allocation graph (one instance per resource)',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi(`<p>Each resource has ONE instance. <code>P&gt;R</code> means process P is waiting for (requests) resource R; <code>R&gt;P</code> means R is allocated to P. Is there a deadlock? Give the number of nodes on the cycle (0 if none).</p>${'<ul>' + G.map(([n, e]) => `<li><b>${n}</b>: ${e.map((x) => x.replace('>', ' → ')).join(', ')}</li>`).join('') + '</ul>'}`,
    `<p>Mỗi tài nguyên chỉ có MỘT bản. <code>P&gt;R</code> nghĩa là tiến trình P đang chờ (yêu cầu) tài nguyên R; <code>R&gt;P</code> nghĩa là R đã cấp cho P. Có deadlock không? Cho số nút trên chu trình (0 nếu không có).</p>${'<ul>' + G.map(([n, e]) => `<li><b>${n}</b>: ${e.map((x) => x.replace('>', ' → ')).join(', ')}</li>`).join('') + '</ul>'}`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Deadlock?', 'Có deadlock không?'),
    cot: [{ ma: 'g', ten: 'Graph' }, { ma: 'd', ten: 'Deadlock?', luaChon: ['Yes', 'No'] }, { ma: 'n', ten: 'Nodes on the cycle' }],
    hang: G.map(([n]) => ({ ma: n.slice(-1), o: { g: n } })),
    dapAn: Object.fromEntries(G.flatMap(([n, e]) => { const r = S.rag(e); return [[`${n.slice(-1)}.d`, r.deadlock ? 'Yes' : 'No'], [`${n.slice(-1)}.n`, String(r.cycle.length)]]; })),
    giaiThich: giai(G.map(([n, e]) => { const r = S.rag(e); return `${n}: ${r.deadlock ? 'cycle ' + r.cycle.join(' → ') : 'no cycle'}`; }).join('; ') + '. With single-instance resources a cycle is both necessary and sufficient. In Graph C, P4 is blocked too (waiting for R2) but is not on the cycle.', G.map(([n, e]) => { const r = S.rag(e); return `${n}: ${r.deadlock ? 'chu trình ' + r.cycle.join(' → ') : 'không chu trình'}`; }).join('; ') + '. Với tài nguyên một bản, chu trình vừa cần vừa đủ. Ở đồ thị C, P4 cũng bị kẹt (chờ R2) nhưng không nằm trên chu trình.'),
  }],
  goiY: ['Follow the arrows: process → resource (waiting), resource → process (held).', 'Count the nodes of the closed loop, processes AND resources.'],
  loiHayGap: ['Counting only the processes on the cycle.', 'Calling a chain without a loop a deadlock (Graph B ends at P3, which is not waiting).'],
  giaiThich: '<p>' + G.map(([n, e]) => `${n.slice(-1)}: ${S.rag(e).deadlock ? 'Yes/' + S.rag(e).cycle.length : 'No/0'}`).join(' · ') + '</p>',
  thuatNgu: [tn('resource-allocation graph', 'đồ thị cấp phát tài nguyên'), tn('wait-for graph', 'đồ thị chờ')],
  khaiNiem: ['resource allocation graph', 'cycle'],
});

const CC = ['Mutual exclusion', 'Hold and wait', 'No preemption', 'Circular wait'];
const E3 = tinh({
  tieuDe: 'Deadlock 3 — Which condition does each prevention technique attack?',
  doKho: 'MEDIUM', phut: 9,
  moTa: bi('<p>Match each technique with the necessary condition it eliminates.</p>', '<p>Ghép mỗi kỹ thuật với điều kiện cần mà nó loại bỏ.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Technique → condition', 'Kỹ thuật → điều kiện'),
    cot: [{ ma: 't', ten: 'Technique' }, { ma: 'c', ten: 'Condition', luaChon: CC }],
    hang: [
      'Spooling: only the printer daemon touches the printer; users write files',
      'A process asking for a resource that is busy must first release everything it holds',
      'The OS may take a resource away from a waiting process and give it to another',
      'Resources are numbered and must be requested in increasing order',
      'A process must obtain every resource it will need before it starts running',
    ].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.c': CC[0], 'r1.c': CC[1], 'r2.c': CC[2], 'r3.c': CC[3], 'r4.c': CC[1] },
    giaiThich: giai('Spooling avoids mutual exclusion on the device (only the daemon holds it); “release first” and “all at once” both attack hold-and-wait; preemption attacks no-preemption; ordering attacks circular wait.', 'Spooling tránh loại trừ tương hỗ trên thiết bị (chỉ daemon giữ nó); “nhả trước” và “xin hết một lần” cùng phá giữ-và-chờ; thu hồi cưỡng bức phá điều kiện không-thu-hồi; đánh thứ tự phá chờ vòng.'),
  }],
  goiY: ['Ask: what is the process no longer allowed to do — hold while waiting, wait in a cycle, keep a resource against the OS’s will, or hold it exclusively?', 'Two of the techniques attack the same condition.'],
  loiHayGap: ['Assigning spooling to hold-and-wait.', 'Thinking ordering removes mutual exclusion.'],
  giaiThich: '<p>Mutual exclusion · Hold and wait · No preemption · Circular wait · Hold and wait.</p>',
  thuatNgu: [tn('spooling', 'ghi đệm ra hàng đợi để một daemon độc quyền thiết bị')],
  khaiNiem: ['deadlock prevention'],
});

const E4 = tinh({
  tieuDe: 'Deadlock 4 — Prevention, avoidance, detection or recovery?',
  doKho: 'MEDIUM', phut: 9,
  moTa: bi('<p>Five scenario questions on handling deadlock.</p>', '<p>Năm câu tình huống về xử lý deadlock.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['The OS lets deadlock happen, periodically runs a cycle search and then kills one process of the cycle. This is …', 'OS để deadlock xảy ra, định kỳ tìm chu trình rồi giết một tiến trình trong chu trình. Đây là …'], [['a', 'Detection and recovery'], ['b', 'Prevention'], ['c', 'Avoidance'], ['d', 'The ostrich algorithm']], 'a', ['Detection needs the allocation state and a recovery action (kill, rollback, preempt).', 'Phát hiện cần trạng thái cấp phát và một hành động phục hồi (giết, quay lui, thu hồi).']),
    mc('c2', ['The OS refuses a request because granting it would lead to an unsafe state. This is …', 'OS từ chối yêu cầu vì cấp phát sẽ dẫn tới trạng thái không an toàn. Đây là …'], [['a', 'Deadlock avoidance (Banker’s algorithm)'], ['b', 'Detection'], ['c', 'Ostrich'], ['d', 'Recovery']], 'a', ['Avoidance needs advance knowledge of each process’s maximum demand.', 'Tránh cần biết trước nhu cầu tối đa của mỗi tiến trình.']),
    mc('c3', ['Which statement about safe states is TRUE?', 'Phát biểu nào về trạng thái an toàn là ĐÚNG?'], [['a', 'Every deadlocked state is unsafe, but an unsafe state is not necessarily deadlocked yet'], ['b', 'A safe state can contain a deadlock'], ['c', 'Unsafe = deadlocked'], ['d', 'Safe states do not exist with multiple resource types']], 'a', ['Unsafe means there is no guaranteed order of completion; deadlock may or may not follow depending on future requests.', 'Không an toàn nghĩa là không có thứ tự hoàn thành được đảm bảo; deadlock có xảy ra hay không còn tuỳ yêu cầu sau này.']),
    mc('c4', ['Recovery by rollback to a checkpoint is possible only if …', 'Phục hồi bằng quay về điểm kiểm tra (checkpoint) chỉ làm được nếu …'], [['a', 'processes save their state periodically'], ['b', 'resources are infinite'], ['c', 'the process is a zombie'], ['d', 'there is a single CPU']], 'a', ['Without saved state, the work of the victim process is lost.', 'Không lưu trạng thái thì công việc của tiến trình nạn nhân bị mất.']),
    mc('c5', ['Why do general-purpose OSes mostly use the ostrich algorithm?', 'Vì sao hệ điều hành đa dụng chủ yếu dùng thuật toán đà điểu?'], [['a', 'Deadlock is rare and prevention/avoidance would restrict users and cost performance'], ['b', 'Deadlocks are impossible in UNIX, because files can always be locked in order'], ['c', 'The Banker’s algorithm runs in O(1), so the OS can call it on every request'], ['d', 'The hardware detects each cycle and restarts the blocked processes']], 'a', ['The engineering trade-off: pay a small probability of a reboot rather than constant overhead.', 'Đánh đổi kỹ thuật: chấp nhận xác suất nhỏ phải khởi động lại thay vì chịu chi phí liên tục.']),
  ],
  goiY: ['Prevention breaks a condition by design; avoidance steers around unsafe states; detection waits and cleans up.', 'Safe ⊂ not-deadlocked; unsafe ⊃ deadlocked.'],
  loiHayGap: ['Confusing avoidance (before granting) with detection (after the fact).', 'Treating unsafe as already deadlocked.'],
  thuatNgu: [tn('safe state', 'trạng thái an toàn: có thứ tự hoàn thành đảm bảo'), tn('rollback', 'quay lui về checkpoint')],
  khaiNiem: ['deadlock avoidance', 'detection', 'recovery'],
});

const E5 = jsDe({
  tieuDe: 'Deadlock 5 — Detect a cycle in a resource-allocation graph',
  doKho: 'HARD', phut: 20,
  moTa: bi(`<p>Write <code>findDeadlock(edges)</code>. <code>edges</code> is an array of strings <code>'P1&gt;R1'</code> (process P1 requests R1) and <code>'R1&gt;P2'</code> (R1 is held by P2); every resource has ONE instance. Return <code>{ deadlock, cycle }</code> where <code>cycle</code> is the first cycle found by a depth-first search that starts from the alphabetically smallest unvisited node and visits successors in alphabetical order; list the nodes in the order they are visited along the cycle starting with the first node of the cycle that DFS entered (empty array when there is no cycle).</p>`,
    `<p>Viết <code>findDeadlock(edges)</code>. <code>edges</code> là mảng chuỗi <code>'P1&gt;R1'</code> (tiến trình P1 yêu cầu R1) và <code>'R1&gt;P2'</code> (R1 do P2 giữ); mỗi tài nguyên có MỘT bản. Trả <code>{ deadlock, cycle }</code> với <code>cycle</code> là chu trình đầu tiên tìm được bằng DFS bắt đầu từ nút chưa thăm nhỏ nhất theo bảng chữ cái và thăm các nút kề theo thứ tự chữ cái; liệt kê nút theo thứ tự thăm dọc chu trình, bắt đầu từ nút của chu trình mà DFS vào trước (mảng rỗng nếu không có chu trình).</p>`),
  yeuCau: [bi('Colour nodes white/grey/black; a grey neighbour closes a cycle.', 'Tô màu nút trắng/xám/đen; gặp nút xám kề là đóng chu trình.')],
  viDu: [{ input: "findDeadlock(['P1>R1','R1>P2','P2>R2','R2>P1'])", output: JSON.stringify(S.rag(['P1>R1', 'R1>P2', 'P2>R2', 'R2>P1'])), explanation: 'P1 → R1 → P2 → R2 → P1.|||P1 → R1 → P2 → R2 → P1.' }],
  goiY: ['Build an adjacency map first; sort the neighbours.', 'Keep the current DFS path in a stack; when you reach a node already on the stack, slice the stack from that node.'],
  loiHayGap: ['Reporting a cycle for a node reached twice by DIFFERENT paths (a black node is not a cycle).', 'Ignoring isolated edges whose target never appears as a source.'],
  giaiThich: '<p>With single-instance resources the allocation graph is the wait-for graph in disguise; deadlock ⇔ cycle.</p>',
  khaiNiem: ['cycle detection', 'resource allocation graph'],
  fn: 'findDeadlock',
  dau: "function findDeadlock(edges) {\n  return { deadlock: false, cycle: [] };\n}\n",
  giaiMa: '// DFS with white/grey/black colouring.\n' + dat(S.rag, 'findDeadlock'),
  ref: (e) => S.rag(e),
  cases: [{ args: [G[0][1]] }, { args: [G[1][1]] }, { args: [G[2][1]] }, { args: [G[3][1]] }, { args: [[]], an: true }, { args: [['B>A', 'A>C', 'C>B', 'D>A']], an: true }, { args: [['P1>R1', 'R1>P2', 'P2>R2', 'R2>P3', 'P3>R1']], an: true }],
});

export default doiDau({
  slug: 'osg202-6-1-deadlock',
  ten: '6.1 Deadlock: conditions & handling',
  khoa: KHOA,
  baiHoc: 'osg202-6-1-deadlock',
  de: [E1, E2, E3, E4, E5],
});
void hai;
