/**
 * OSG202 · CS.5 — Bộ nhớ trên máy chủ thật: mã thoát 128+n, OOM killer, VSZ/RSS.
 */
import { doiDau, KHOA, bi, hai, giai, tinh, jsDe, mc, tn, nguon } from './_os.mjs';

const SIG = { 1: 'SIGHUP', 2: 'SIGINT', 3: 'SIGQUIT', 6: 'SIGABRT', 9: 'SIGKILL', 11: 'SIGSEGV', 13: 'SIGPIPE', 15: 'SIGTERM' };
const E1 = tinh({
  tieuDe: 'Server memory 1 — Resident memory, overcommit and the OOM killer',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five questions on memory on a real Linux server.</p>', '<p>Năm câu về bộ nhớ trên máy chủ Linux thật.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['What is the difference between VSZ and RSS in <code>ps</code>?', 'VSZ và RSS trong <code>ps</code> khác nhau thế nào?'], [['a', 'VSZ is the virtual address space size; RSS is the part currently resident in RAM'], ['b', 'VSZ is swap; RSS is disk'], ['c', 'They are always equal'], ['d', 'RSS counts shared libraries once per process only']], 'a', ['A process may reserve far more virtual memory than it touches.', 'Tiến trình có thể giữ chỗ bộ nhớ ảo nhiều hơn rất nhiều so với phần nó chạm tới.']),
    mc('c2', ['Linux memory overcommit means that …', 'Memory overcommit của Linux nghĩa là …'], [['a', 'malloc can succeed even if RAM + swap cannot back all the memory promised; the problem appears when pages are touched'], ['b', 'malloc always fails as soon as RAM is full, even when swap is still free'], ['c', 'pages are compressed in RAM so that every malloc is fully backed before it returns'], ['d', 'the kernel never swaps, so all the memory promised must fit in physical RAM']], 'a', ['Allocation is lazy; real pages are assigned on first touch.', 'Cấp phát là lười; trang thật được gán lúc chạm lần đầu.']),
    mc('c3', ['When RAM and swap are exhausted, the kernel’s OOM killer …', 'Khi RAM và swap cạn, OOM killer của kernel …'], [['a', 'kills a process chosen by badness score (oom_score) with SIGKILL'], ['b', 'reboots the machine'], ['c', 'asks processes to free memory politely'], ['d', 'pauses all processes']], 'a', ['You can bias the choice with oom_score_adj (−1000 disables killing the process).', 'Có thể thiên lệch lựa chọn bằng oom_score_adj (−1000 là không bị giết).']),
    mc('c4', ['A container with a 512 MB memory limit grows past it. What happens?', 'Container có giới hạn bộ nhớ 512 MB vượt quá giới hạn. Điều gì xảy ra?'], [['a', 'The cgroup OOM killer kills a process of the container (exit code 137)'], ['b', 'The kernel of the host panics and the whole host reboots'], ['c', 'The limit is raised automatically by the container runtime'], ['d', 'The limit is ignored as long as the host still has free RAM']], 'a', ['The cgroup limit is enforced inside the container’s control group.', 'Giới hạn cgroup được áp ngay trong nhóm kiểm soát của container.']),
    mc('c5', ['Which setting protects the database process from the OOM killer first?', 'Thiết lập nào bảo vệ tiến trình cơ sở dữ liệu khỏi OOM killer trước tiên?'], [['a', 'A very low (negative) oom_score_adj for that process'], ['b', 'Using a larger page size for the shared buffers'], ['c', 'Adding more swap and leaving the score unchanged'], ['d', 'Running the database process as the root user']], 'a', ['oom_score_adj = −1000 exempts it; the killer picks other victims.', 'oom_score_adj = −1000 miễn trừ; killer chọn nạn nhân khác.']),
  ],
  goiY: ['VSZ = promised, RSS = used.', 'Think “lazy allocation, eager consequences”.'],
  loiHayGap: ['Reading VSZ as memory used.', 'Thinking malloc failing is the usual sign of memory exhaustion on Linux.'],
  thuatNgu: [tn('RSS', 'bộ nhớ thường trú: trang đang nằm trong RAM'), tn('OOM killer', 'trình giết tiến trình khi hết bộ nhớ'), tn('overcommit', 'cấp phát vượt khả năng đáp ứng')],
  khaiNiem: ['VSZ vs RSS', 'overcommit', 'OOM killer'],
});

const CODES = [137, 139, 143, 130, 134, 141];
const nameOf = (c) => SIG[c - 128] || `SIG${c - 128}`;
const E2 = tinh({
  tieuDe: 'Server memory 2 — Decode the exit code 128 + n',
  doKho: 'MEDIUM', phut: 8,
  moTa: bi('<p>When a process dies from a signal, the shell reports <b>128 + signal number</b>. Name the signal that produced each exit code (SIGHUP 1, SIGINT 2, SIGQUIT 3, SIGABRT 6, SIGKILL 9, SIGSEGV 11, SIGPIPE 13, SIGTERM 15).</p>', '<p>Khi một tiến trình chết vì tín hiệu, shell báo <b>128 + số tín hiệu</b>. Gọi tên tín hiệu gây ra mỗi mã thoát (SIGHUP 1, SIGINT 2, SIGQUIT 3, SIGABRT 6, SIGKILL 9, SIGSEGV 11, SIGPIPE 13, SIGTERM 15).</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Exit code → signal', 'Mã thoát → tín hiệu'),
    cot: [{ ma: 'c', ten: 'Exit code' }, { ma: 's', ten: 'Signal', luaChon: Object.values(SIG) }],
    hang: CODES.map((c) => ({ ma: `c${c}`, o: { c: String(c) } })),
    dapAn: Object.fromEntries(CODES.map((c) => [`c${c}.s`, nameOf(c)])),
    giaiThich: giai(CODES.map((c) => `${c} = 128 + ${c - 128} → ${nameOf(c)}`).join('; ') + '. 137 in a container usually means the OOM killer; 143 is a clean docker stop; 139 a crash.', CODES.map((c) => `${c} = 128 + ${c - 128} → ${nameOf(c)}`).join('; ') + '. 137 trong container thường là OOM killer; 143 là docker stop sạch; 139 là sập chương trình.'),
  }],
  goiY: ['Subtract 128, then look the number up.', 'SIGKILL cannot be caught, so a service killed by it had no chance to clean up.'],
  loiHayGap: ['Reading 134 as an exit(134) call instead of SIGABRT.', 'Confusing 137 (KILL) with 143 (TERM).'],
  giaiThich: '<p>' + CODES.map((c) => nameOf(c)).join(' · ') + '</p>',
  thuatNgu: [tn('exit status', 'mã thoát'), tn('SIGKILL', 'tín hiệu giết không thể bắt')],
  khaiNiem: ['exit codes', 'signals'],
});

function explainExit(code) {
  var names = { 1: 'SIGHUP', 2: 'SIGINT', 3: 'SIGQUIT', 6: 'SIGABRT', 9: 'SIGKILL', 11: 'SIGSEGV', 13: 'SIGPIPE', 15: 'SIGTERM' };
  if (code === 0) return { kind: 'success' };
  if (code > 128 && code < 256) { var n = code - 128; return { kind: 'signal', signal: names[n] || 'SIG' + n, number: n }; }
  return { kind: 'error', code: code };
}
const E3 = jsDe({
  tieuDe: 'Server memory 3 — Write an exit-code explainer',
  doKho: 'HARD', phut: 15,
  moTa: bi(`<p>Write <code>explainExit(code)</code> for a monitoring tool. Return <code>{ kind: 'success' }</code> for 0; <code>{ kind: 'signal', signal, number }</code> for codes 129–255 (<code>number = code − 128</code>; <code>signal</code> is the name from the table SIGHUP 1, SIGINT 2, SIGQUIT 3, SIGABRT 6, SIGKILL 9, SIGSEGV 11, SIGPIPE 13, SIGTERM 15, otherwise <code>'SIG' + number</code>); and <code>{ kind: 'error', code }</code> for every other code (1–128).</p>`,
    `<p>Viết <code>explainExit(code)</code> cho công cụ giám sát. Trả <code>{ kind: 'success' }</code> với 0; <code>{ kind: 'signal', signal, number }</code> với mã 129–255 (<code>number = code − 128</code>; <code>signal</code> là tên theo bảng SIGHUP 1, SIGINT 2, SIGQUIT 3, SIGABRT 6, SIGKILL 9, SIGSEGV 11, SIGPIPE 13, SIGTERM 15, còn lại <code>'SIG' + number</code>); và <code>{ kind: 'error', code }</code> với mọi mã khác (1–128).</p>`),
  yeuCau: [bi('Do not hard-code individual codes: compute 128 + n.', 'Đừng viết cứng từng mã: tính 128 + n.')],
  viDu: [{ input: 'explainExit(137)', output: JSON.stringify(explainExit(137)), explanation: '137 − 128 = 9 → SIGKILL (often the OOM killer).|||137 − 128 = 9 → SIGKILL (thường là OOM killer).' }],
  goiY: ['Check 0 first, then the 129–255 range, then everything else.', 'A lookup object for the known names; fall back to "SIG" + n.'],
  loiHayGap: ['Treating 128 itself as a signal (it is an ordinary error code).', 'Forgetting the fallback name for signals not in the table.'],
  giaiThich: '<p>This is the first thing to do when a container restarts: map the exit code back to a cause (137 OOM/kill -9, 139 segfault, 143 graceful stop).</p>',
  khaiNiem: ['exit codes', 'signals'],
  fn: 'explainExit',
  dau: "function explainExit(code) {\n  return { kind: 'error', code: code };\n}\n",
  giaiMa: '// 0 = success, 129..255 = 128 + signal, otherwise an error code.\n' + nguon(explainExit),
  ref: explainExit,
  cases: [{ args: [0] }, { args: [137] }, { args: [143] }, { args: [1] }, { args: [139], an: true }, { args: [128], an: true }, { args: [255], an: true }, { args: [134], an: true }],
});

export default doiDau({
  slug: 'osg202-14-cs5-memory-oom',
  ten: '14.5 CS.5 Memory on a real server: RSS, OOM and exit codes',
  khoa: KHOA,
  baiHoc: 'osg202-cs5-on',
  de: [E1, E2, E3],
});
void hai;
