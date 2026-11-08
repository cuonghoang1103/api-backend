/** Node.js 17.3 — PID 1: ba cách viết CMD, SIGTERM/SIGKILL, thời gian ân hạn, exec trong entrypoint, --init, healthcheck --start-period. */
import { modul, cs, q, qn, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'Who is PID 1, and who hears SIGTERM', kho: 'EASY', phut: 7,
  en: 'Questions on lesson 17.3 (node:22-slim, docker stop, Docker Desktop 29.8.0).',
  vi: 'Câu hỏi về bài 17.3 (node:22-slim, docker stop, Docker Desktop 29.8.0).',
  cau: [
    q('c1', ['CMD node src/index.js (shell form, no brackets), then docker stop. Measured: 3.15 s, exit 137, nothing in the log after READY. Why?', 'CMD node src/index.js (dạng shell, không ngoặc), rồi docker stop. Đo được: 3,15 s, exit 137, log không có gì sau READY. Vì sao?'],
      ['/bin/sh is PID 1 and does not forward the signal; Docker sends SIGKILL when the grace ends', 'Node ignores SIGTERM unless it runs with --init, so it waits for SIGKILL', 'The shell form starts Node twice, and the second copy holds the port', 'docker stop always waits the full grace period before signalling'],
      ['Only the exec form ["node", "src/index.js"] puts Node at PID 1: it printed SIGTERM received, closed, exit 0 after 0.13 s. With npm start, npm dies at once and takes Node down (exit 1).', 'Chỉ dạng exec ["node", "src/index.js"] đặt Node ở PID 1: nó in SIGTERM received, closed, exit 0 sau 0,13 s. Với npm start, npm chết ngay và kéo Node theo (exit 1).']),
    q('c2', ['Docker’s “default” grace period: the docs say 10 s, the written lesson measured 1.26 s, this video measured 3.14 s. The lesson’s conclusion?', '“Mặc định” thời gian ân hạn của Docker: tài liệu nói 10 s, bài viết đo 1,26 s, video này đo 3,14 s. Kết luận của bài?'],
      ['Set it explicitly (stop_grace_period / docker stop -t), longer than the slowest request', 'Trust the documentation: 10 s is enough for any web request', 'Use -t 0, so that deploys are as fast as possible', 'Avoid long requests, because the grace period cannot be changed'],
      ['A 5-second request stopped 1 s in was lost with the default (killed at ~3.16 s, exit 137) and answered with -t 10. The grace is a ceiling, not a wait: a healthy app exits as soon as it is done.', 'Request 5 giây bị stop sau 1 s bị mất với mặc định (bị giết ở ~3,16 s, exit 137) và được trả lời với -t 10. Ân hạn là trần, không phải thời gian chờ: app khoẻ thoát ngay khi xong.']),
    q('c3', ['An entrypoint script runs a migration and then node dist/index.js. Docker stop -t 5: killed after 5.21 s, exit 137. The one-word fix?', 'Một script entrypoint chạy migration rồi node dist/index.js. docker stop -t 5: bị giết sau 5,21 s, exit 137. Sửa bằng một chữ?'],
      ['exec node dist/index.js — the shell is replaced by Node, which becomes PID 1', 'nohup node dist/index.js — Node keeps running after the shell exits', 'node dist/index.js & — Node runs in the background and the shell waits', 'sudo node dist/index.js — root processes always receive signals'],
      ['With exec: SIGTERM received, closed, exit 0 after 0.23 s. Alternative: docker run --init (tini at PID 1 forwards signals and reaps zombies).', 'Có exec: SIGTERM received, closed, exit 0 sau 0,23 s. Cách khác: docker run --init (tini ở PID 1 chuyển tín hiệu và dọn zombie).']),
    qn('c4', ['Which statements about health checks are true? (choose all that apply)', 'Những câu nào về health check là đúng? (chọn mọi câu đúng)'],
      ['Without --start-period a 12-second boot was marked unhealthy at 6 s', 'Plain Docker does not restart an unhealthy container (restart count stays 0)', 'slim images have no curl, so check with node -e and require("http")', 'A HEALTHCHECK that runs SELECT 1 is the right liveness check'],
      [0, 1, 2],
      ['The URL must be a liveness one that does not touch the database (chapter 15), or one DB blip marks every container unhealthy at once. Restart policies react to the process exiting, not to health.', 'URL phải là liveness không đụng CSDL (chương 15), không thì một lần CSDL trục trặc đánh dấu mọi container unhealthy cùng lúc. Chính sách restart phản ứng với tiến trình thoát, không phải với health.']),
  ],
  goiY: [['SIGTERM goes to exactly one process: PID 1.', 'SIGTERM chỉ tới đúng một tiến trình: PID 1.'], ['A shell does not forward signals to its children.', 'Shell không chuyển tín hiệu cho tiến trình con.']],
  loi: [['CMD ["npm", "start"]: the handler is in the code and never runs.', 'CMD ["npm", "start"]: handler có trong mã mà không bao giờ chạy.'], ['Inheriting the grace period instead of setting it.', 'Thừa hưởng thời gian ân hạn thay vì tự đặt.']],
  tns: [tn('PID 1', 'PID 1', 'the first process of the container; receives docker stop’s SIGTERM'), tn('exec form', 'dạng exec', 'CMD ["node", "x.js"]'), tn('grace period', 'thời gian ân hạn'), tn('zombie', 'tiến trình zombie', 'finished but never reaped')],
  kn: ['Docker', 'signals'],
});

function exitReason(code) {
  // > 128 nghĩa là tiến trình chết vì tín hiệu số (code − 128).
  const SIG = { 1: 'SIGHUP', 2: 'SIGINT', 6: 'SIGABRT', 9: 'SIGKILL', 15: 'SIGTERM' };
  if (code === 0) return { signal: null, meaning: 'clean exit' };
  if (code === 137) return { signal: 'SIGKILL', meaning: 'killed: grace period ran out, or the OOM killer' };
  if (code === 143) return { signal: 'SIGTERM', meaning: 'terminated by SIGTERM with no handler' };
  if (code === 134) return { signal: 'SIGABRT', meaning: 'aborted: e.g. JavaScript heap out of memory' };
  if (code > 128) return { signal: SIG[code - 128] || `signal ${code - 128}`, meaning: 'killed by a signal' };
  return { signal: null, meaning: 'the program exited with an error' };
}
const E2 = await jsBai({
  ten: 'exitReason(code): read the number in the deploy log', kho: 'EASY', phut: 6,
  en: '<p>An exit code above 128 means “killed by signal <code>code − 128</code>”. Write <code>exitReason(code)</code> returning <code>{ signal, meaning }</code>:</p><ul><li><code>0</code> → <code>{ signal: null, meaning: "clean exit" }</code>;</li><li><code>137</code> → <code>{ signal: "SIGKILL", meaning: "killed: grace period ran out, or the OOM killer" }</code>;</li><li><code>143</code> → <code>{ signal: "SIGTERM", meaning: "terminated by SIGTERM with no handler" }</code>;</li><li><code>134</code> → <code>{ signal: "SIGABRT", meaning: "aborted: e.g. JavaScript heap out of memory" }</code>;</li><li>other codes above 128 → <code>{ signal: &lt;name&gt;, meaning: "killed by a signal" }</code> using 1 SIGHUP, 2 SIGINT, 6 SIGABRT, 9 SIGKILL, 15 SIGTERM, else <code>"signal &lt;n&gt;"</code>;</li><li>anything else → <code>{ signal: null, meaning: "the program exited with an error" }</code>.</li></ul>',
  vi: '<p>Mã thoát trên 128 nghĩa là “bị giết bởi tín hiệu số <code>code − 128</code>”. Viết <code>exitReason(code)</code> trả về <code>{ signal, meaning }</code>:</p><ul><li><code>0</code> → <code>{ signal: null, meaning: "clean exit" }</code>;</li><li><code>137</code> → <code>{ signal: "SIGKILL", meaning: "killed: grace period ran out, or the OOM killer" }</code>;</li><li><code>143</code> → <code>{ signal: "SIGTERM", meaning: "terminated by SIGTERM with no handler" }</code>;</li><li><code>134</code> → <code>{ signal: "SIGABRT", meaning: "aborted: e.g. JavaScript heap out of memory" }</code>;</li><li>mã khác trên 128 → <code>{ signal: &lt;tên&gt;, meaning: "killed by a signal" }</code> theo 1 SIGHUP, 2 SIGINT, 6 SIGABRT, 9 SIGKILL, 15 SIGTERM, còn lại <code>"signal &lt;n&gt;"</code>;</li><li>còn lại → <code>{ signal: null, meaning: "the program exited with an error" }</code>.</li></ul>',
  goiY: [['137 = 128 + 9, 143 = 128 + 15, 134 = 128 + 6.', '137 = 128 + 9, 143 = 128 + 15, 134 = 128 + 6.'], ['Check the special codes first, then the general “> 128” rule.', 'Xét các mã đặc biệt trước, rồi tới luật chung “> 128”.']],
  loi: [['Reading 137 as “the app crashed”: the app may have been fine — Docker killed it when the grace ran out.', 'Đọc 137 là “app bị sập”: app có thể vẫn ổn — Docker giết nó khi hết ân hạn.'], ['Reading 1 as a signal: codes up to 128 are the program’s own exit status (npm prints “npm error signal SIGTERM” and exits 1).', 'Đọc 1 là tín hiệu: mã tới 128 là trạng thái thoát của chính chương trình (npm in “npm error signal SIGTERM” rồi thoát 1).']],
  gt: ['When you see 137 in a deploy log it is one of two things: the grace period ran out (this lesson) or the out-of-memory killer (16.5). The number points to the chapter to reopen.', 'Thấy 137 trong log deploy thì là một trong hai: hết ân hạn (bài này) hoặc trình diệt hết bộ nhớ (16.5). Con số chỉ ra chương cần mở lại.'],
  kn: ['signals', 'exit codes'],
  tns: [tn('SIGTERM', 'SIGTERM', 'polite stop; can be caught'), tn('SIGKILL', 'SIGKILL', 'cannot be caught; ends the process at once')],
  dau: `/** what does this exit code mean? */
function exitReason(code) {
  // Write your solution here
  if (code === 0) return { signal: null, meaning: 'clean exit' };
  return { signal: null, meaning: 'the program exited with an error' };
}
`,
  giai: '// Reference solution\n' + nguon(exitReason),
  cases: [
    { goi: '[exitReason(0), exitReason(137)]', moTa: ['Exec form vs shell form', 'Dạng exec và dạng shell'] },
    { goi: 'exitReason(1)', moTa: ['npm start: npm died on SIGTERM', 'npm start: npm chết vì SIGTERM'] },
    { goi: '[exitReason(143), exitReason(134)]', an: true },
    { goi: '[exitReason(130), exitReason(129), exitReason(140), exitReason(2)]', an: true },
  ],
});

function pid1(dockerfile, scripts = {}, { init = false } = {}) {
  const lines = dockerfile.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const last = (kw) => lines.filter((l) => new RegExp(`^${kw}\\s`, 'i').test(l)).pop();
  const parse = (l) => {
    if (!l) return null;
    const body = l.replace(/^\S+\s+/, '');
    return body.startsWith('[') ? { exec: true, argv: JSON.parse(body) } : { exec: false, argv: ['/bin/sh', '-c', body] };   // dạng shell ⇒ sh -c
  };
  if (init) return { pid1: 'tini', forwardsSignals: true, nodeGetsSigterm: true };   // --init: tini ở PID 1
  const ep = parse(last('ENTRYPOINT'));
  const cmd = parse(last('CMD'));
  const argv = ep ? [...ep.argv, ...(ep.exec && cmd ? cmd.argv : [])] : cmd ? cmd.argv : [];
  const prog = (argv[0] || '').split('/').pop();
  if (prog === 'tini' || prog === 'dumb-init') return { pid1: prog, forwardsSignals: true, nodeGetsSigterm: true };
  if (prog === 'node') return { pid1: 'node', forwardsSignals: false, nodeGetsSigterm: true };
  if (prog === 'npm') return { pid1: 'npm', forwardsSignals: false, nodeGetsSigterm: false };
  if (prog === 'sh' || prog === 'bash') {
    // sh script.sh: nếu dòng lệnh thật cuối của script là "exec node …" thì Node THAY shell và thành PID 1
    const file = argv[1] === '-c' ? null : argv[1];
    const body = file ? scripts[file] || scripts[file.replace(/^\.\//, '')] || '' : '';
    const lastCmd = body.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).pop() || '';
    if (/^exec\s+(\S*\/)?node\b/.test(lastCmd)) return { pid1: 'node', forwardsSignals: false, nodeGetsSigterm: true };
    return { pid1: 'sh', forwardsSignals: false, nodeGetsSigterm: false };
  }
  return { pid1: prog || null, forwardsSignals: false, nodeGetsSigterm: false };
}
const E3 = await jsBai({
  ten: 'pid1(dockerfile, scripts, opts): will your SIGTERM handler ever run?', kho: 'MEDIUM', phut: 18,
  en: '<p>Decide who is PID 1 from the last <code>ENTRYPOINT</code> and <code>CMD</code> of a Dockerfile. Exec form is a JSON array; shell form <code>CMD x y</code> means <code>["/bin/sh", "-c", "x y"]</code>. With an exec-form <code>ENTRYPOINT</code>, the exec-form <code>CMD</code> is appended to it. Return <code>{ pid1, forwardsSignals, nodeGetsSigterm }</code> from the first program (its file name):</p><ul><li><code>opts.init</code> (docker run --init) or <code>tini</code> / <code>dumb-init</code> → that init, <code>true, true</code> (<code>"tini"</code> for --init);</li><li><code>node</code> → <code>"node", false, true</code>; <code>npm</code> → <code>"npm", false, false</code>;</li><li><code>sh</code>/<code>bash</code> running a script file from <code>scripts</code> whose last command (ignoring blanks and <code>#</code>) starts with <code>exec node</code> (or <code>exec /path/node</code>) → <code>"node", false, true</code>; any other <code>sh</code>/<code>bash</code> (incl. <code>-c</code>) → <code>"sh", false, false</code>;</li><li>anything else → <code>&lt;name&gt;, false, false</code>.</li></ul>',
  vi: '<p>Xác định ai là PID 1 từ <code>ENTRYPOINT</code> và <code>CMD</code> cuối cùng của Dockerfile. Dạng exec là mảng JSON; dạng shell <code>CMD x y</code> nghĩa là <code>["/bin/sh", "-c", "x y"]</code>. Khi <code>ENTRYPOINT</code> dạng exec, <code>CMD</code> dạng exec được nối vào sau. Trả về <code>{ pid1, forwardsSignals, nodeGetsSigterm }</code> theo chương trình đầu tiên (tên tệp của nó):</p><ul><li><code>opts.init</code> (docker run --init) hoặc <code>tini</code> / <code>dumb-init</code> → init đó, <code>true, true</code> (<code>"tini"</code> cho --init);</li><li><code>node</code> → <code>"node", false, true</code>; <code>npm</code> → <code>"npm", false, false</code>;</li><li><code>sh</code>/<code>bash</code> chạy một tệp script trong <code>scripts</code> mà lệnh cuối (bỏ dòng trống và <code>#</code>) bắt đầu bằng <code>exec node</code> (hoặc <code>exec /đường/dẫn/node</code>) → <code>"node", false, true</code>; mọi <code>sh</code>/<code>bash</code> khác (kể cả <code>-c</code>) → <code>"sh", false, false</code>;</li><li>còn lại → <code>&lt;tên&gt;, false, false</code>.</li></ul>',
  goiY: [['Normalise both forms to an argv array first; then only argv[0] (and the script for sh) matters.', 'Chuẩn hoá cả hai dạng thành mảng argv trước; khi đó chỉ argv[0] (và script với sh) là quan trọng.'], ['"/usr/bin/tini".split("/").pop() is "tini".', '"/usr/bin/tini".split("/").pop() là "tini".']],
  loi: [['Treating any line that mentions node as “Node is PID 1”: CMD npm run start:prod runs node too, three processes down.', 'Coi mọi dòng nhắc tới node là “Node là PID 1”: CMD npm run start:prod cũng chạy node, nhưng ở ba tầng bên dưới.'], ['Forgetting that the last command of the script needs exec: without it sh stays PID 1.', 'Quên rằng lệnh cuối của script cần exec: thiếu nó sh vẫn là PID 1.']],
  gt: ['The handler in the code is necessary, not sufficient: the signal must reach it. The website gets it right — ENTRYPOINT tini, then a script that fixes upload-folder permissions and ends with exec "$@" — so Node gets SIGTERM and zombies are reaped.', 'Handler trong mã là cần, chưa đủ: tín hiệu phải tới được nó. Website làm đúng — ENTRYPOINT tini, rồi một script sửa quyền thư mục upload và kết thúc bằng exec "$@" — nên Node nhận SIGTERM và zombie được dọn.'],
  kn: ['Docker', 'signals', 'parsing'],
  tns: [tn('ENTRYPOINT', 'ENTRYPOINT'), tn('exec (shell)', 'exec (shell)', 'replace the shell process instead of starting a child'), tn('tini', 'tini', 'a tiny init: forwards signals, reaps zombies')],
  dau: `/** who is PID 1? */
function pid1(dockerfile, scripts = {}, { init = false } = {}) {
  // Write your solution here
  const cmd = dockerfile.split('\\n').filter((l) => /^CMD/i.test(l.trim())).pop() || '';
  const uses = cmd.includes('node');
  return { pid1: uses ? 'node' : 'sh', forwardsSignals: false, nodeGetsSigterm: uses };
}
`,
  giai: '// Reference solution\n' + nguon(pid1),
  cases: [
    { goi: '[pid1("FROM node:22-slim\\nCMD [\\"npm\\", \\"start\\"]"), pid1("FROM node:22-slim\\nCMD node src/index.js"), pid1("FROM node:22-slim\\nCMD [\\"node\\", \\"src/index.js\\"]")]', moTa: ['The three ways to write CMD', 'Ba cách viết CMD'] },
    { goi: 'pid1("FROM node:22-slim\\nCOPY start.sh ./\\nCMD [\\"sh\\", \\"start.sh\\"]", { "start.sh": "#!/bin/sh\\nnpx prisma migrate deploy\\nnode dist/index.js\\n" })', moTa: ['A start script without exec', 'Script khởi động thiếu exec'] },
    { goi: 'pid1("FROM node:22-slim\\nCMD [\\"sh\\", \\"./start.sh\\"]", { "start.sh": "npx prisma migrate deploy\\nexec node dist/index.js\\n# end\\n" })', an: true },
    { goi: 'pid1("FROM node:22-slim\\nENTRYPOINT [\\"/usr/bin/tini\\", \\"--\\", \\"/docker-entrypoint.sh\\"]\\nCMD [\\"node\\", \\"dist/index.js\\"]")', an: true },
    { goi: '[pid1("FROM node:22-slim\\nCMD npm run start:prod"), pid1("FROM node:22-slim\\nCMD [\\"npm\\", \\"start\\"]", {}, { init: true })]', an: true },
    { goi: 'pid1("FROM node:22-slim\\nENTRYPOINT [\\"node\\"]\\nCMD [\\"dist/index.js\\"]")', an: true },
  ],
});

function graceOutcome({ requests, stopAt, graceSec, pid1, forceExitSec = Infinity }) {
  // requests: [{ id, start, duration }] (giây). docker stop gửi SIGTERM lúc stopAt cho PID 1; SIGKILL lúc stopAt + graceSec.
  const killAt = stopAt + graceSec;
  const end = (r) => r.start + r.duration;
  const before = requests.filter((r) => end(r) <= stopAt);
  const inflight = requests.filter((r) => r.start <= stopAt && end(r) > stopAt);
  const after = requests.filter((r) => r.start > stopAt);
  let exitAt;
  let exitCode;
  let served;                                              // các request được phục vụ tới cùng
  if (pid1 === 'npm') {                                    // npm chết ngay và kéo Node theo: cắt mọi thứ
    exitAt = stopAt; exitCode = 1; served = [];
  } else if (pid1 === 'sh') {                              // sh không chuyển tín hiệu: Node không biết gì, vẫn nhận request, tới khi bị SIGKILL
    exitAt = killAt; exitCode = 137; served = [...inflight, ...after].filter((r) => end(r) <= killAt);
  } else {                                                 // Node ở PID 1: server.close() — thôi nhận request mới, xả request đang chạy
    const drained = inflight.length ? Math.max(...inflight.map(end)) : stopAt;
    const forced = stopAt + forceExitSec;
    if (drained <= Math.min(killAt, forced)) { exitAt = drained; exitCode = 0; }
    else if (forced < killAt) { exitAt = forced; exitCode = 1; }
    else { exitAt = killAt; exitCode = 137; }
    served = inflight.filter((r) => end(r) <= exitAt);
  }
  const ok = new Set([...before, ...served].map((r) => r.id));
  const refused = pid1 === 'node' ? after.map((r) => r.id) : [];
  return {
    answered: requests.filter((r) => ok.has(r.id)).map((r) => r.id),
    lost: requests.filter((r) => !ok.has(r.id) && !refused.includes(r.id)).map((r) => r.id),
    refused,
    exitAt: Number(exitAt.toFixed(2)),
    exitCode,
  };
}
const E4 = await jsBai({
  ten: 'graceOutcome(scenario): which in-flight requests survive the deploy?', kho: 'HARD', phut: 20,
  en: '<p>Model one <code>docker stop</code>. <code>requests = [{ id, start, duration }]</code> in seconds; SIGTERM goes to PID 1 at <code>stopAt</code>; Docker sends SIGKILL at <code>stopAt + graceSec</code>. Requests that ended by <code>stopAt</code> are always answered. Then it depends on <code>pid1</code>:</p><ul><li><code>"npm"</code> — npm dies at once and takes Node down: exit <code>1</code> at <code>stopAt</code>; every other request is lost;</li><li><code>"sh"</code> — the shell does not forward the signal, Node never hears it and keeps serving (new requests too) until SIGKILL: exit <code>137</code> at the kill time; requests that end by then are answered, the rest lost;</li><li><code>"node"</code> — the app stops accepting (requests starting after <code>stopAt</code> are <b>refused</b>) and drains the in-flight ones; it exits <code>0</code> when the last one ends — unless that is later than the SIGKILL or its own force-exit timer (<code>stopAt + forceExitSec</code>, default never); whichever comes first: SIGKILL ⇒ 137, the app’s timer ⇒ 1. In-flight requests that end by the exit are answered.</li></ul><p>Return <code>{ answered, lost, refused, exitAt, exitCode }</code> (ids in input order; <code>exitAt</code> rounded to 2 decimals).</p>',
  vi: '<p>Mô hình hoá một lần <code>docker stop</code>. <code>requests = [{ id, start, duration }]</code> tính bằng giây; SIGTERM tới PID 1 lúc <code>stopAt</code>; Docker gửi SIGKILL lúc <code>stopAt + graceSec</code>. Request đã xong trước <code>stopAt</code> luôn được trả lời. Phần còn lại tuỳ <code>pid1</code>:</p><ul><li><code>"npm"</code> — npm chết ngay và kéo Node theo: exit <code>1</code> lúc <code>stopAt</code>; mọi request khác bị mất;</li><li><code>"sh"</code> — shell không chuyển tín hiệu, Node không bao giờ nghe thấy và vẫn phục vụ (cả request mới) tới khi SIGKILL: exit <code>137</code> lúc giết; request xong trước lúc đó được trả lời, còn lại mất;</li><li><code>"node"</code> — app thôi nhận (request bắt đầu sau <code>stopAt</code> bị <b>từ chối</b>) và xả các request đang chạy; nó thoát <code>0</code> khi cái cuối xong — trừ khi thời điểm đó muộn hơn SIGKILL hoặc hẹn giờ ép thoát của chính nó (<code>stopAt + forceExitSec</code>, mặc định không bao giờ); cái nào tới trước: SIGKILL ⇒ 137, hẹn giờ của app ⇒ 1. Request đang chạy mà xong trước lúc thoát được trả lời.</li></ul><p>Trả về <code>{ answered, lost, refused, exitAt, exitCode }</code> (id theo thứ tự đầu vào; <code>exitAt</code> làm tròn 2 chữ số).</p>',
  goiY: [['Split the requests into three groups by comparing start and end with stopAt, then handle the three pid1 cases separately.', 'Chia request thành ba nhóm bằng cách so start và end với stopAt, rồi xử lý riêng ba trường hợp pid1.'], ['The drained time is the latest end among the in-flight requests (or stopAt when there are none); compare it with min(killAt, forcedAt).', 'Thời điểm xả xong là end muộn nhất trong các request đang chạy (hoặc stopAt nếu không có); so nó với min(killAt, forcedAt).']],
  loi: [['A force-exit timer longer than the grace period (the website: 30 s in the app, Docker default ~3–10 s): Docker kills first and the timer never matters.', 'Bộ hẹn giờ ép thoát dài hơn ân hạn (website: 30 s trong app, Docker mặc định ~3–10 s): Docker giết trước và hẹn giờ không có tác dụng.'], ['Thinking a long grace slows every deploy: a healthy app exits as soon as it has drained.', 'Nghĩ ân hạn dài làm chậm mọi lần deploy: app khoẻ thoát ngay khi xả xong.']],
  gt: ['This is the measured table: exec form, one 3-second request, stop 1 s in — -t 0 kills it (exit 137), the default and -t 10 answer it and the process exits by itself after ~2.1 s. A 5-second request with the default ~3.14 s is lost; with -t 10 it is answered. With npm at PID 1 the client got curl exit 52 — the connection cut mid-request.', 'Đây là bảng đã đo: dạng exec, một request 3 giây, stop sau 1 s — -t 0 giết nó (exit 137), mặc định và -t 10 trả lời được và tiến trình tự thoát sau ~2,1 s. Request 5 giây với mặc định ~3,14 s bị mất; với -t 10 được trả lời. Với npm ở PID 1 client nhận curl exit 52 — kết nối bị cắt giữa chừng.'],
  kn: ['graceful shutdown', 'signals', 'simulation'],
  tns: [tn('drain', 'xả dần', 'finish in-flight requests, accept no new ones'), tn('force-exit timer', 'hẹn giờ ép thoát'), tn('in-flight request', 'request đang xử lý')],
  dau: `/** what does one docker stop cost? */
function graceOutcome({ requests, stopAt, graceSec, pid1, forceExitSec = Infinity }) {
  // Write your solution here
  const done = requests.filter((r) => r.start + r.duration <= stopAt).map((r) => r.id);
  const lost = requests.filter((r) => r.start + r.duration > stopAt).map((r) => r.id);
  return { answered: done, lost, refused: [], exitAt: stopAt, exitCode: 0 };
}
`,
  giai: '// Reference solution\n' + nguon(graceOutcome),
  cases: [
    { goi: 'graceOutcome({ requests: [{ id: "slow", start: 0, duration: 3 }], stopAt: 1, graceSec: 3.14, pid1: "node" })', moTa: ['Exec form, a 3 s request, default grace', 'Dạng exec, request 3 s, ân hạn mặc định'] },
    { goi: 'graceOutcome({ requests: [{ id: "slow", start: 0, duration: 5 }], stopAt: 1, graceSec: 3.14, pid1: "node" })', moTa: ['A 5 s request, default grace', 'Request 5 s, ân hạn mặc định'] },
    { goi: 'graceOutcome({ requests: [{ id: "a", start: 0, duration: 0.5 }, { id: "b", start: 0.8, duration: 3 }, { id: "c", start: 1.5, duration: 0.1 }], stopAt: 1, graceSec: 5, pid1: "sh" })', an: true },
    { goi: 'graceOutcome({ requests: [{ id: "up", start: 0, duration: 40 }, { id: "q", start: 0.9, duration: 0.2 }], stopAt: 1, graceSec: 60, pid1: "node", forceExitSec: 30 })', an: true },
    { goi: 'graceOutcome({ requests: [{ id: "x", start: 0, duration: 0.2 }], stopAt: 1, graceSec: 0, pid1: "node" })', an: true },
    { goi: 'graceOutcome({ requests: [{ id: "up", start: 0, duration: 40 }], stopAt: 1, graceSec: 10, pid1: "node", forceExitSec: 30 })', an: true },
    { goi: 'graceOutcome({ requests: [{ id: "slow", start: 0, duration: 3 }, { id: "done", start: 0, duration: 0.4 }], stopAt: 1, graceSec: 5, pid1: "npm" })', an: true },
  ],
});

function installShutdown({ server, pool, exit, log, setTimer }, forceMs) {
  let stopping = false;
  return function onSigterm() {
    if (stopping) return;                                   // SIGTERM thứ hai: đang tắt rồi, không làm lại
    stopping = true;
    log('SIGTERM received');
    const timer = setTimer(() => { log('forced exit'); exit(1); }, forceMs);   // trần cho trường hợp kẹt
    server.close(async () => {                              // 1) thôi nhận kết nối mới; callback chạy khi request cuối xong
      await pool.end();                                     // 2) đóng pool DB (và worker hàng đợi…)
      clearTimeout(timer);
      log('closed');
      exit(0);                                              // 3) thoát TRƯỚC khi Docker hết ân hạn
    });
  };
}
const SHUT = `const events = []; let inflight = 2; let closeCb = null; let accepting = true;
  const server = { close(cb) { accepting = false; closeCb = cb; if (inflight === 0) cb(); }, finishOne() { inflight--; if (inflight === 0 && closeCb) closeCb(); } };
  const pool = { end: async () => { events.push('pool.end'); } };
  const log = (m) => events.push(m); const exit = (c) => events.push('exit ' + c);
  const setTimer = (fn, ms) => setTimeout(fn, ms);`;
const E5 = await jsBai({
  ten: 'installShutdown(deps, forceMs): the five-step handler, testable without Docker', kho: 'HARD', phut: 18,
  en: '<p>Write the SIGTERM handler of the sample app with its dependencies injected, so it can be tested without a container. <code>installShutdown({ server, pool, exit, log, setTimer }, forceMs)</code> returns <code>onSigterm()</code>, which:</p><ol><li>on a second call does nothing;</li><li>logs <code>"SIGTERM received"</code>;</li><li>starts a force-exit timer with <code>setTimer(fn, forceMs)</code> that logs <code>"forced exit"</code> and calls <code>exit(1)</code>;</li><li>calls <code>server.close(cb)</code> — it stops accepting and calls <code>cb</code> once the last in-flight request is done; in <code>cb</code>: <code>await pool.end()</code>, cancel the timer with <code>clearTimeout</code>, log <code>"closed"</code>, <code>exit(0)</code>.</li></ol>',
  vi: '<p>Viết handler SIGTERM của app mẫu với các phụ thuộc được tiêm vào, để kiểm thử được mà không cần container. <code>installShutdown({ server, pool, exit, log, setTimer }, forceMs)</code> trả về <code>onSigterm()</code>, hàm này:</p><ol><li>ở lần gọi thứ hai thì không làm gì;</li><li>ghi log <code>"SIGTERM received"</code>;</li><li>bật hẹn giờ ép thoát bằng <code>setTimer(fn, forceMs)</code>, khi chạy thì ghi <code>"forced exit"</code> và gọi <code>exit(1)</code>;</li><li>gọi <code>server.close(cb)</code> — nó thôi nhận kết nối và gọi <code>cb</code> khi request đang chạy cuối cùng xong; trong <code>cb</code>: <code>await pool.end()</code>, huỷ hẹn giờ bằng <code>clearTimeout</code>, ghi <code>"closed"</code>, <code>exit(0)</code>.</li></ol>',
  goiY: [['Keep a stopping flag in the closure of installShutdown.', 'Giữ một cờ stopping trong closure của installShutdown.'], ['The timer must be cleared on the clean path, or it fires later and exits with 1.', 'Hẹn giờ phải được huỷ ở đường thoát sạch, không thì nó chạy về sau và thoát với 1.']],
  loi: [['Calling exit(0) right after server.close(): in-flight requests are cut — the exact loss the handler exists to prevent.', 'Gọi exit(0) ngay sau server.close(): request đang chạy bị cắt — đúng thứ mất mát handler sinh ra để chặn.'], ['No force-exit timer: one stuck request keeps the process alive until SIGKILL, so the deploy always takes the full grace.', 'Không có hẹn giờ ép thoát: một request kẹt giữ tiến trình sống tới SIGKILL, nên mỗi lần deploy đều tốn trọn ân hạn.']],
  gt: ['(1) SIGTERM reaches PID 1, which must be Node; (2) server.close() stops accepting; (3) in-flight requests finish; (4) close the pool and queue workers, returning half-done jobs; (5) exit(0) before the grace runs out. Set stop_grace_period above both the slowest request and this forceMs.', '(1) SIGTERM tới PID 1, phải là Node; (2) server.close() thôi nhận kết nối; (3) request đang chạy hoàn tất; (4) đóng pool và worker hàng đợi, trả job dở về hàng; (5) exit(0) trước khi hết ân hạn. Đặt stop_grace_period lớn hơn cả request chậm nhất lẫn forceMs này.'],
  kn: ['graceful shutdown', 'dependency injection', 'async'],
  tns: [tn('server.close()', 'server.close()', 'stop accepting; callback when connections end'), tn('pool.end()', 'pool.end()')],
  dau: `/** SIGTERM handler */
function installShutdown({ server, pool, exit, log, setTimer }, forceMs) {
  return function onSigterm() {
    // Write your solution here
    log('SIGTERM received');
    server.close(() => {});
    exit(0);
  };
}
`,
  giai: '// Reference solution\n' + nguon(installShutdown),
  cases: [
    { chuanBi: `${SHUT} const on = installShutdown({ server, pool, exit, log, setTimer }, 1000); on(); events.push('accepting=' + accepting); server.finishOne(); server.finishOne(); await new Promise((r) => setTimeout(r, 30));`, goi: 'events', moTa: ['Two in-flight requests, then a clean exit', 'Hai request đang chạy, rồi thoát sạch'] },
    { chuanBi: `${SHUT} const on = installShutdown({ server, pool, exit, log, setTimer }, 40); on(); server.finishOne(); await new Promise((r) => setTimeout(r, 80));`, goi: 'events', moTa: ['One request is stuck: the timer forces the exit', 'Một request bị kẹt: hẹn giờ ép thoát'] },
    { chuanBi: `${SHUT} const on = installShutdown({ server, pool, exit, log, setTimer }, 50); on(); on(); server.finishOne(); server.finishOne(); await new Promise((r) => setTimeout(r, 100));`, goi: 'events', an: true },
    { chuanBi: `${SHUT} inflight = 0; const on = installShutdown({ server, pool, exit, log, setTimer }, 50); on(); await new Promise((r) => setTimeout(r, 100));`, goi: 'events', an: true },
  ],
});

export default modul('nodejs-17-3-pid-1-tat-em', '17.3 PID 1, signals and graceful shutdown', [E1, E2, E3, E5, E4]);
