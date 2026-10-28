/**
 * os-14-3 — khoá "Operating Systems for Developers", bài 14.3 "Services and observability on three systems" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c143-mac.out.txt (Mac thật, đã ẩn danh) và c26-log.out.txt (systemd của
 * Chương 2) qua grab(); mã đọc thẳng từ lab/code. Phần Windows: theo tài liệu — slide ghi "per the docs".
 * Giảng: content/courses/operating-systems-for-developers/giang/os-14-3.mjs.
 */
import fs from 'node:fs';
import { lamDeck, sh, sql, two, box, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-14-3', code: 'OS 14.3', title: 'Services and observability on three systems', sub: 'Operating Systems · Chapter 14 — Windows & macOS' };

const m = (pre, n = 1) => grab('c143-mac', pre, n);
const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const bang = (cols, rows, fs = 20) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
const code = (rel) => fs.readFileSync(new URL(`../../content/courses/operating-systems-for-developers/lab/code/${rel}`, import.meta.url), 'utf8');
const c = (t) => `<code class="i">${t}</code>`;

const unit = code('ch02/systemd/ctw-api.service').split('\n').filter((x) => !x.startsWith('#')).join('\n').trim();
const plist = code('ch14/com.cuongthai.hot.plist').split('\n').filter((x) => !/^<\?xml|^<!DOCTYPE|^<!--|^\s+KHÔNG|^<plist|^<\/plist|^<dict>|^<\/dict>/.test(x)).map((x) => x.replace(/^  /, '')).join('\n').trim();

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 14 — Windows & macOS', bai: '14.3',
}, [
  { cover: true, t: 'Services and observability<br>on three systems', sub: 'systemd vs launchd vs Windows Services · top vs Activity Monitor vs Task Manager — measured on a real Mac' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Who supervises services: <b>systemd</b>, <b>launchd</b>, the Windows <b>SCM</b></li>
<li>The same service as a unit file and as a <b>plist</b></li>
<li>One question, three commands: CPU, memory, ports, files, syscalls, logs</li>
<li><b>top, lsof, sample</b> on a real Mac — and what refuses to run</li>
<li>Why Task Manager’s CPU % is not top’s CPU %</li>
</ul>` },

  { t: 'PID 1 is the supervisor on every system', giua: true, body: bang(['', 'Linux: systemd', 'macOS: launchd', 'Windows: SCM (per the docs)'], [
    ['who', 'PID 1', 'PID 1', 'services.exe'],
    ['definition', 'unit file (INI)', 'plist (XML): LaunchDaemons, LaunchAgents', 'registry key …\\Services\\&lt;name&gt;'],
    ['control', c('systemctl'), c('launchctl'), c('sc') + ', services.msc, ' + c('Get-Service')],
    ['restart on crash', c('Restart=always'), c('KeepAlive'), 'Recovery tab, ' + c('sc failure')],
    ['scheduled jobs', 'timers, cron', c('StartCalendarInterval'), 'Task Scheduler'],
    ['logs', c('journalctl'), c('log show') + ', Console.app', 'Event Viewer, ' + c('Get-WinEvent')],
  ], 21) },

  { t: 'launchd starts almost everything on the Mac', giua: true, body: term(m('ps -o pid,ppid,user,comm -p 1', 3), 21) +
    box('', '549 of 724 processes are <b>direct children of launchd</b>, defined by 425 system daemons and 486 per-user agents shipped with macOS.', 'lam') },

  { t: 'A plist plays the role of a unit file', giua: true, body: two(
    term(m('plutil -p /System/Library/LaunchDaemons/com.apple.newsyslog.plist').replace('/System/Library/LaunchDaemons/', '…/LaunchDaemons/'), 21, 540),
    '<div>' + term(m('launchctl print system/com.apple.newsyslog').split('\n').slice(1).map((x) => x.replace('/System/Library/LaunchDaemons/', '…/')).join('\n'), 20, 540) +
    box('', c('StartCalendarInterval {Minute = 30}') + ' = a systemd timer with ' + c('OnCalendar=*:30') + '. It has run 110 times, last exit 0.', 'lam') + '</div>') },

  { t: 'The same ideas in INI: the Linux unit of Chapter 2', giua: true, body: two(
    sql(unit, { lang: 'ini' }).replace('<pre class="vs">', '<pre class="vs" style="font-size:16.5px;line-height:1.5">'),
    term(grab('c26-log', 'systemctl status ctw-api --no-pager', 1).split('\n').filter((x, i) => i < 11 && !/Invocation|CGroup|└─/.test(x)).join('\n'), 16, 560)) +
    box('', c('Restart=always') + ', ' + c('RestartSec=2') + ' and a cgroup cap ' + c('MemoryMax=300M') + ' — systemd shows memory against that cap.', 'lam') },

  { t: 'The same service as a macOS LaunchAgent', giua: true, body: sql(plist, { lang: 'xml' }).replace('<pre class="vs">', '<pre class="vs" style="font-size:14.5px">') + two(
    term(m('plutil -lint'), 19, 420),
    bang(['systemd', 'launchd'], [
      [c('Restart=on-failure'), c('KeepAlive / SuccessfulExit=false')],
      [c('RestartSec=10'), c('ThrottleInterval 10')],
      [c('Environment='), c('EnvironmentVariables')],
      [c('MemoryMax='), '— (no cgroups on macOS)'],
    ], 17)) +
    box('', 'Written for this lesson and only syntax-checked — <b>not loaded</b>. Load: ' + c('launchctl bootstrap gui/$(id -u) file') + '.', 'lam') },

  { t: 'One question, three commands', giua: true, body: bang(['question', 'Linux', 'macOS', 'Windows (per the docs)'], [
    ['who eats the CPU?', c('top') + ', ' + c('ps --sort'), c('top -o cpu') + ', Activity Monitor', 'Task Manager, ' + c('Get-Process')],
    ['memory', c('free -m'), c('vm_stat') + ', ' + c('memory_pressure'), 'Performance tab, Resource Monitor'],
    ['who holds a port?', c('ss -tlnp'), c('lsof -iTCP -sTCP:LISTEN'), c('Get-NetTCPConnection')],
    ['open files', c('lsof -p') + ', /proc/PID/fd', c('lsof -p'), 'Process Explorer, handle.exe'],
    ['trace syscalls', c('strace'), c('dtruss') + ' (root + SIP), ' + c('fs_usage') + ' (root)', 'Process Monitor'],
    ['CPU profile', c('perf'), c('sample') + ', Instruments', 'WPR, PerfView'],
    ['logs', c('journalctl'), c('log show'), 'Event Viewer'],
  ], 20) },

  { t: 'macOS top: a summary in five lines', giua: true, to: true, body: term(m('top -l 1 -n 0 -s 0'), 20) +
    bang(['PhysMem field', 'meaning', 'Linux cousin'], [
      ['used 29G', 'everything not free — apps, cache, compressor', 'used + buff/cache'],
      ['wired 3440M', 'kernel memory, never paged out', 'kernel / unevictable'],
      ['compressor 10G', 'RAM holding compressed pages', '(zswap, if enabled)'],
    ], 19) +
    box('', '722 processes, 5,397 threads, load 16.8 on 10 cores. "<b>1882M unused</b>" is the cousin of Linux’s <code class="i">free</code> — and just as misleading (lesson 14.4).', 'lam') },

  { t: 'A hot Node server: ps and lsof work the same', giua: true, body: term(m('node hot.cjs', 2), 21) +
    box('', c('ps') + ' shows <b>46 % CPU</b> — like Linux top, 100 % means one full core. ' + c('lsof') + ' finds the socket on ' + c('*:3141') + ' with the same syntax as on Linux.', 'lam') +
    box('', 'Activity Monitor shows the same 46 % (per core). Task Manager on Windows would show this process as a share of the whole machine (per the docs) — see the pitfall.', 'xanh') },

  { t: 'sample: a one-second profiler, like perf record', giua: true, body: term(m('sample'), 20) +
    box('', 'Most samples are threads <b>waiting</b>: libuv workers on a condition variable, the event loop in <b>kevent</b> (kqueue = macOS’s epoll), a Mach semaphore. The hot JavaScript shows only as <code class="i">???</code> — JIT code has no symbols.', 'lam') },

  { t: 'The strace habit does not work on a Mac', giua: true, to: true, body: term(m('fs_usage', 2), 19) +
    box('', c('fs_usage') + ' needs root; ' + c('dtruss') + ' (DTrace) is blocked by <b>System Integrity Protection</b> even for root. Trace in the Linux lab with ' + c('strace') + ', or use Instruments.', 'do2') +
    box('', 'Windows (per the docs): Sysinternals <b>Process Monitor</b> plays the strace role; <b>Process Explorer</b> replaces lsof / ps -T.', 'lam') },

  { t: 'Logs: logger + log show = journalctl -t', giua: true, to: true, body: term(m('logger -t ch14'), 20) +
    bang(['', 'Linux', 'macOS', 'Windows (per the docs)'], [
      ['write a log line', c('logger -t app msg'), c('logger -t app msg'), c('Write-EventLog')],
      ['read it back', c('journalctl -t app'), c('log show --predicate …'), c('Get-WinEvent')],
      ['follow live', c('journalctl -f'), c('log stream'), 'Event Viewer'],
    ], 24) },

  { t: 'Pitfall: "Task Manager says 10 %, top said 100 %"', giua: true, to: true, body: vsd(
    'Compare Task Manager’s Processes tab (share of the <b>whole machine</b>) with top on the VPS (per <b>core</b>) and conclude the Windows box is faster. Disable SIP to get dtruss.',
    'One saturated thread on 10 logical cores ≈ 10 % in Task Manager, 100 % in top / Activity Monitor (per the docs). Compare like with like. Keep SIP on — trace in the Linux lab.') +
    box('', 'Measured here: <code class="i">hot.cjs</code> = <b>46 %</b> in <code class="i">ps</code> (per core). The same load in Task Manager’s Processes tab would read about a tenth of that.', 'lam') },

  { t: 'Practice: who holds port 3000?', giua: true, body: `
<ol>
<li>Mac: ${c('lsof -nP -iTCP:3000 -sTCP:LISTEN')}</li>
<li>Lab: ${c("ss -tlnp 'sport = :3000'")}</li>
<li>Windows: ${c('Get-NetTCPConnection -LocalPort 3000')} → ${c('Get-Process -Id &lt;pid&gt;')}</li>
<li>${c('sample &lt;pid&gt; 1')} on the Mac, ${c('top -b -n 1 -p &lt;pid&gt;')} in the lab — note each CPU %</li>
<li>Write the restart policy three ways: unit, plist, ${c('sc failure')}</li>
</ol>` + box('Done when', 'one row per OS naming the PID on port 3000, the CPU % each tool showed and why they differ, and three restart policies that mean the same thing.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>PID 1 supervises everywhere: <b>systemd</b>, <b>launchd</b> (549 of 724 processes here), the <b>SCM</b></li>
<li>Restart, schedule, log map one-to-one across the three</li>
<li><code class="i">ps</code>, <code class="i">top</code>, <code class="i">lsof</code> work on macOS; <code class="i">sample</code> is a quick profiler</li>
<li>Tracing on a Mac needs root and is blocked by SIP — use the Linux lab</li>
<li>CPU %: per core in top, per machine in Task Manager</li>
</ul>` },
]);
