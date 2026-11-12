/**
 * ngx-00-2 — Nginx · Section 0 · Lesson 0.2 "Install, run, and read the process tree" (deck video + web, 12/11/2026). Bài web: nginx-0-2-cai-va-chay.
 * Output THẬT (scratchpad/ngx/demo/n0-2.txt; ngx-lab --cpuset-cpus 0-3, nginx/1.24.0 gói 1.24.0-2ubuntu7.19): 32 cờ --with; master root + 4 worker nobody;
 * BẪY CONTAINER: worker_processes auto ⇒ 10 worker trong khi nproc = 4 (nginx 1.24 đếm CPU của máy chủ, không theo cpuset); reload: master giữ pid,
 * worker đổi hết; thư mục 700 ⇒ 403 + "13: Permission denied"; mv log ⇒ ghi tiếp vào access.log.1 tới -s reopen; pid sai ⇒ kill failed / invalid PID.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-2:file:/tmp/ng/conf/nginx.conf": "worker_processes 4;\npid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents { worker_connections 1024; }\nhttp {\n  access_log /tmp/ng/logs/access.log;\n  server {\n    listen 8080;\n    location / { return 200 \"phien ban MOT\\n\"; }\n    location /rieng/ { alias /srv/riengtu/; }\n  }\n}\n",
 "n0-2:setup": "",
 "n0-2:cai": "$ nginx -v\nnginx version: nginx/1.24.0 (Ubuntu)\n$ dpkg -s nginx | grep -E '^(Package|Version)'\nPackage: nginx\nVersion: 1.24.0-2ubuntu7.19\n$ nginx -V 2>&1 | tr ' ' '\\n' | grep -c '^--with'\n32\n$ nginx -V 2>&1 | tr ' ' '\\n' | grep '^--with' | head -n 6\n--with-cc-opt='-g\n--with-ld-opt='-Wl,-Bsymbolic-functions\n--with-compat\n--with-debug\n--with-pcre-jit\n--with-http_ssl_module",
 "n0-2:cay": "$ nginx -c /tmp/ng/conf/nginx.conf -t\nnginx: the configuration file /tmp/ng/conf/nginx.conf syntax is ok\nnginx: configuration file /tmp/ng/conf/nginx.conf test is successful\n$ nginx -c /tmp/ng/conf/nginx.conf\n$ ps -eo pid,ppid,user,args | grep '[n]ginx'\n    493       1 root     nginx: master process nginx -c /tmp/ng/conf/nginx.conf\n    494     493 nobody   nginx: worker process\n    495     493 nobody   nginx: worker process\n    496     493 nobody   nginx: worker process\n    497     493 nobody   nginx: worker process\n$ nproc\n4",
 "n0-2:auto": "$ grep worker_processes /tmp/ng/conf/nginx.conf\nworker_processes auto;\n$ nginx -c /tmp/ng/conf/nginx.conf -s reload\n2026/11/12 10:58:57 [notice] 532#532: signal process started\n$ nproc; ps -eo args | grep -c '[n]ginx: worker'\n4\n10\n$ grep -c ^processor /proc/cpuinfo\n10",
 "n0-2:reload": "$ curl -s http://127.0.0.1:8080/\nphien ban MOT\n$ cat /tmp/ng/logs/nginx.pid; ps -eo pid,args | grep '[n]ginx: worker' | awk '{print $1}' | xargs\n493\n594 595 596 597\n$ nginx -c /tmp/ng/conf/nginx.conf -t && nginx -c /tmp/ng/conf/nginx.conf -s reload\nnginx: the configuration file /tmp/ng/conf/nginx.conf syntax is ok\nnginx: configuration file /tmp/ng/conf/nginx.conf test is successful\n2026/11/12 10:58:59 [notice] 628#628: signal process started\n$ curl -s http://127.0.0.1:8080/\nphien ban HAI\n$ cat /tmp/ng/logs/nginx.pid; ps -eo pid,args | grep '[n]ginx: worker' | awk '{print $1}' | xargs\n493\n637 638 639 640",
 "n0-2:quyen": "$ ls -ld /srv/riengtu; cat /srv/riengtu/a.txt\ndrwx------ 2 root root 4096 Nov 12 10:59 /srv/riengtu\nbi mat\n$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/rieng/a.txt\n403\n$ tail -n 1 /tmp/ng/logs/error.log\n2026/11/12 10:59:01 [error] 639#639: *3 open() \"/srv/riengtu/a.txt\" failed (13: Permission denied), client: 127.0.0.1, server: , request: \"GET /rieng/a.txt HTTP/1.1\", host: \"127.0.0.1:8080\"\n$ chmod 755 /srv/riengtu\n$ curl -s http://127.0.0.1:8080/rieng/a.txt\nbi mat",
 "n0-2:reopen": "$ mv /tmp/ng/logs/access.log /tmp/ng/logs/access.log.1\n$ curl -s -o /dev/null http://127.0.0.1:8080/sau-khi-doi-ten\n$ ls /tmp/ng/logs/; tail -n 1 /tmp/ng/logs/access.log.1\naccess.log.1\nerror.log\nnginx.pid\n127.0.0.1 - - [12/Nov/2026:10:59:01 +0000] \"GET /sau-khi-doi-ten HTTP/1.1\" 200 14 \"-\" \"curl/8.5.0\"\n$ nginx -c /tmp/ng/conf/nginx.conf -s reopen\n2026/11/12 10:59:01 [notice] 747#747: signal process started\n$ curl -s -o /dev/null http://127.0.0.1:8080/sau-reopen\n$ ls /tmp/ng/logs/; cat /tmp/ng/logs/access.log\naccess.log\naccess.log.1\nerror.log\nnginx.pid\n127.0.0.1 - - [12/Nov/2026:10:59:02 +0000] \"GET /sau-reopen HTTP/1.1\" 200 14 \"-\" \"curl/8.5.0\"",
 "n0-2:pid": "$ nginx -c /tmp/ng/conf/nginx.conf -s stop\n2026/11/12 10:59:02 [notice] 780#780: signal process started\n$ echo 99999 > /tmp/ng/logs/nginx.pid; nginx -c /tmp/ng/conf/nginx.conf -s reload\n2026/11/12 10:59:02 [notice] 796#796: signal process started\n2026/11/12 10:59:02 [alert] 796#796: kill(99999, 1) failed (3: No such process)\n$ echo \"\" > /tmp/ng/logs/nginx.pid; nginx -c /tmp/ng/conf/nginx.conf -s reload\n2026/11/12 10:59:03 [notice] 804#804: signal process started\n2026/11/12 10:59:03 [error] 804#804: invalid PID number \"\" in \"/tmp/ng/logs/nginx.pid\"\n$ rm /tmp/ng/logs/nginx.pid; nginx -c /tmp/ng/conf/nginx.conf && cat /tmp/ng/logs/nginx.pid\n822"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, cay, seq, icards, cmp, box, two, steps, kw, c } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-00-2', code: 'NGX 0.2', title: 'Install, run, and read the process tree', sub: 'Section 0 · Lesson 0.2' };
const O = (k) => { const v = DU_LIEU[`n0-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const lenh = (blk, re, n = 99) => { const ls = O(blk).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && re.test(l)); const out = [ls[i]]; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && out.length <= n; j++) out.push(ls[j]); return out.join('\n'); };

export const S = [
  { cover: true, nhan: 'Section 0 · Lesson 0.2', t: 'Install, run,<br>and read the process tree', sub: 'Five minutes on what you just started explains privilege separation, reload, and half the error messages you will ever see',
    en: 'Lesson 0.2: install Nginx, run it, and read what you just started — because the process model explains reload, permissions and many error messages.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Install, check the version, and list what was compiled in</li>
    <li>Master and workers — who runs as root, who serves requests</li>
    <li>A container trap: <code>worker_processes auto</code> counted 10 CPUs on a 4-CPU box</li>
    <li>Reload versus restart — measured by process IDs</li>
    <li>Three everyday failures: Permission denied, log rotation, a stale pid file</li></ul>`,
    en: 'Five takeaways: installing and checking what you have; master and workers; a real container trap with worker_processes auto; reload versus restart; and three everyday failures — permission denied, log rotation, and a stale pid file.' },
  { t: 'Two minutes to a running server', body: two(
      ngc(`# Ubuntu / Debian
sudo apt-get update && sudo apt-get install -y nginx

# run with YOUR file — no root, no systemd
nginx -c /tmp/ng/conf/nginx.conf -t       # test only
nginx -c /tmp/ng/conf/nginx.conf          # start
nginx -c /tmp/ng/conf/nginx.conf -s stop  # stop`, { sm: true }),
      tn(O('cai'), { fs: 14 })) +
    box('Modules are compiled IN, not loaded at run time', 'This Ubuntu build has 32 <code>--with</code> flags. A directive the docs show but your build rejects as "unknown" usually means it was not compiled in — <code>nginx -V</code> is the first place to look.', 'lam'),
    en: 'Install with one command, then run Nginx with your own file using -c: -t to test, start, and -s stop. nginx -V lists what was compiled into the binary — this Ubuntu build has thirty-two --with flags.' },
  { t: 'Four habits from the first day', body: icards([
      ['check', 'ALWAYS -t first', 'Parses the whole config, names the FILE and LINE of the first problem, and never touches the running server.'],
      ['server', '-c lets you experiment', 'Point it at a file in /tmp, listen on 8080: a full Nginx to learn on, no root, no systemd.'],
      ['list', '-V tells you what you HAVE', 'Modules are compiled in — the build decides which directives exist.'],
      ['clock', 'Version matters', 'Directives and defaults change between releases; distributions ship old versions for years.'],
    ], 2),
    en: 'Four habits: always run -t first; use -c to experiment safely; read -V to know which modules your build has; and check the version before blaming yourself when a blog config does not work.' },
  { t: 'What you just started', body: two(tn(O('cay').split('\n').slice(3).join('\n'), { fs: 14, wrap: 44 }),
      cay({ t: 'master · pid 493', s: 'root', mau: '#c0392b' }, [494, 495, 496, 497].map((p) => ({ t: 'worker', s: `${p} · nobody`, mau: '#008a34' })), { w: 540, h: 280 })) +
    box('One master, four workers', '<code>worker_processes 4</code> on a machine where <code>nproc</code> says 4. The master (parent pid 1) is root; every worker is <code>nobody</code>.', 'xanh'),
    en: 'ps shows one master process owned by root and four worker processes owned by nobody, each with the master as its parent. Four workers because the config says worker_processes 4 and the machine has four CPUs.' },
  { t: 'Master and worker: two very different jobs', body: cmp(['', 'Master', 'Worker'], [
      ['Runs as', '<b>root</b>', '<b>unprivileged</b> (nobody / www-data)'],
      ['Does', 'reads config, binds ports &lt; 1024, opens logs, supervises workers', 'handles EVERY request'],
      ['Serves traffic?', 'no — never', 'yes — thousands of connections in ONE thread'],
      ['How many', 'one', 'worker_processes (one per CPU is plenty)'],
      ['If it crashes', 'everything stops', 'master starts a new one; only its connections drop'],
    ]) + box('The split IS the security', 'A bug while handling a request runs as an unprivileged user — the process facing the Internet cannot read what the worker user cannot read.', 'lam'),
    en: 'The master runs as root, reads the config, binds ports and supervises — and never serves traffic. Workers run unprivileged and handle every request, thousands of connections in one thread each. That split is the security model.' },
  { t: 'A container trap: "auto" counted the wrong CPUs', body: tn(O('auto'), { fs: 15 }) + two(
      box('What happened', '<code>nproc</code> says 4 (the container is pinned to 4 CPUs), but nginx 1.24 started <b>10</b> workers: <code>auto</code> counted every CPU the host has.', 'do2'),
      box('What to do', 'In containers and on CPU-limited VMs, set <code>worker_processes</code> to a number. More workers than CPUs buys nothing — they fight over the same cores.', 'xanh')),
    en: 'A real trap. Inside a container pinned to four CPUs, nproc says four, but worker_processes auto started ten workers: Nginx 1.24 counted every CPU of the host. In containers, set worker_processes to an explicit number.' },
  { t: '"Permission denied" is almost always the WORKER', body: tn(O('quyen'), { wrap: 112, fs: 14 }) +
    box('The trap', 'root can <code>cat</code> the file, so it "looks fine" — but the worker runs as <code>nobody</code>. It needs read on the file AND execute (x) on EVERY parent directory. <code>chmod 755</code> on the directory fixed it.', 'do2'),
    en: 'A directory with mode 700: root can read the file, but Nginx answers 403, and the error log says 13: Permission denied. The worker runs as nobody and needs execute permission on every parent directory. chmod 755 fixed it.' },
  { t: 'Reload: same master, brand-new workers', body: two(tn(O('reload'), { wrap: 52, fs: 14 }),
      seq(['master 493', 'old workers', 'new workers'], [[0, 0, 'reads + checks config'], [0, 2, 'start 637–640'], [0, 1, 'stop accepting'], [1, 1, 'finish open requests', '#7c3aed'], [1, 0, 'exit', '#64748b', true]], { w: 540, rh: 56, fs: 16 })),
    en: 'Reload measured by process IDs. Before: master 493 with workers 594 to 597. After the reload: master is still 493, and the workers are 637 to 640 — all replaced. Old workers stop accepting, finish what they have, then exit.' },
  { t: 'reload is not restart', body: cmp(['', 'nginx -s reload', 'systemctl restart nginx'], [
      ['Master process', 'kept', 'killed and started again'],
      ['Listening sockets', 'kept open', 'closed — connections refused for a moment'],
      ['Requests in flight', 'finished by the old workers', 'dropped'],
      ['Broken config', 'stops at the check — nothing changes', 'Nginx does not come back up'],
      ['Use it for', 'every config change', 'binary upgrades, some core settings'],
    ]) + ngc('nginx -t && nginx -s reload    # one line, joined by &&, every time'),
    en: 'Reload keeps the master and the listening sockets; requests in flight are finished by the old workers, and a broken config stops at the check. Restart kills everything. Use reload for config changes, always behind nginx -t.' },
  { t: 'Log files are held open by the master', body: tn(O('reopen'), { wrap: 112, fs: 14 }) +
    box('Rotate by renaming? Then send -s reopen', 'After <code>mv</code>, Nginx keeps writing into the renamed file (same inode). <code>-s reopen</code> makes it open a fresh <code>access.log</code> — exactly what every distribution\'s logrotate config ends with.', 'lam'),
    en: 'The master holds the log files open. After renaming access.log, the next request still went into access.log.1 — the same file under a new name. Only after -s reopen did Nginx create a fresh access.log.' },
  { t: 'The pid file is how signals find the master', body: tn(O('pid'), { wrap: 112, fs: 14 }) +
    box('Stale pid file', 'A pid that no longer exists ⇒ <code>kill(99999, 1) failed</code>; an empty file ⇒ <code>invalid PID number ""</code>. Remove the stale file and start Nginx normally.', 'do2'),
    en: 'Signals find the master through the pid file. A stale number gives kill failed: No such process; an empty file gives invalid PID number. Delete the stale file and start Nginx again — it writes its new pid.' },
  { t: 'Three commands worth memorising now', body: icards([
      ['check', 'nginx -t', 'before EVERY change — file and line of the first problem'],
      ['loop', 'nginx -t && nginx -s reload', 'apply a change; a syntax error never reaches the reload'],
      ['search', 'nginx -T', 'capital T: print the WHOLE effective config with every include expanded'],
    ], 3) + box('Why -T matters', 'On a real server with a dozen files under sites-enabled, "which file does this setting come from?" is a question you will ask constantly — -T is the only reliable answer.', 'xanh'),
    en: 'Three commands to memorise: nginx -t before every change; nginx -t && nginx -s reload to apply one; and nginx -T, with a capital T, to print the whole effective configuration with every include expanded.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('nginx -t', 'syntax check only; names file and line'),
      kw('nginx -c', 'run with your own config file'),
      kw('nginx -V', 'list compiled-in modules'),
      kw('Master process', 'root; binds ports, opens logs, supervises — serves nothing'),
      kw('Worker process', 'unprivileged; handles every request in one thread'),
      kw('nginx -s reload', 'replace workers without dropping a connection'),
      kw('-s reopen', 'reopen log files after rotation'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: nginx -t, -c and -V; the master process and the worker process; nginx -s reload, which replaces workers without dropping connections; and -s reopen, which reopens log files after rotation.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Start nginx with ${c('-c')}; read ${c('ps -eo pid,ppid,user,args')}`,
      `Change a reply, ${c('-t && -s reload')}; compare the pids`,
      `Serve a file from a ${c('chmod 700')} directory; read error.log`,
      `${c('mv')} the access log, curl, then ${c('-s reopen')}`,
    ]), box('Keep these', `<ul><li>Master = root, serves nothing; workers serve everything</li><li>Containers: set worker_processes explicitly</li><li>Permission denied ⇒ think worker + parent dirs</li><li>reload, never restart, for config</li></ul>`, 'lam'), ''),
    en: 'Your turn: read the process tree, reload and compare the pids, reproduce a permission error, and rotate a log with mv and -s reopen. Keep: master serves nothing, set worker_processes in containers, think worker when you see permission denied, and reload instead of restart.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — The problem, and a build that runs', bai: '0.2' }, S);
