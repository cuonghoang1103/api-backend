/**
 * os-13-3 — khoá "Operating Systems for Developers", bài 13.3 "Privilege escalation" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c133-dacquyen.out.txt (chạy thật trong ảnh os-lab) qua grab().
 * THUẦN PHÒNG THỦ: chương trình đồ chơi tự viết + người dùng "dev" trong container vứt đi. Giảng: giang/os-13-3.mjs.
 */
import { lamDeck, sql, sh, two, box, cards } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-13-3', code: 'OS 13.3', title: 'Privilege: SUID, capabilities, TOCTOU, /proc', sub: 'Operating Systems · Chapter 13 — OS security' };

const g = (pre, n = 1) => grab('c133-dacquyen', pre, n);

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 13 — OS security', bai: '13.3',
}, [
  { cover: true, t: 'Privilege escalation', sub: 'SUID, capabilities, TOCTOU and /proc leaks —<br>how a small misconfiguration becomes root, and the fix' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why a <b>SUID-root</b> helper that trusts <code class="i">$PATH</code> is dangerous — and the fix</li>
<li>One <b>capability</b> instead of full root</li>
<li>Permission audits; the <b>TOCTOU</b> race and its fix</li>
<li>Secrets leaking through <code class="i">/proc</code> — env vs argv</li>
<li>Designing a service that has little to lose if compromised</li>
</ul>
<p class="nho">All on toys you build as the unprivileged user "dev" in a throwaway container.</p>` },

  { t: 'A setuid-root helper that trusts $PATH', giua: true, body: `
${sh(g('ls -l /srv/lab/greetsuid') + '\n' + g('runuser -u dev -- /srv/lab/greetsuid'))}
<p style="margin:0;font-size:21px">The <code class="i">s</code> in <code class="i">-rwsr-xr-x</code> is the SUID bit; <code class="i">euid=0</code> means <code class="i">dev</code> runs as root. The bug: it calls <code class="i">hostname</code> <b>by name</b>, trusting the caller’s <code class="i">$PATH</code>.</p>` },

  { t: 'A measured subtlety: dash drops privilege', giua: true, body: `
${sh(g('runuser -u dev -- env PATH=/srv/evil /srv/lab/greetsuid'))}
${box('Never rely on this', 'With <code class="i">system()</code>, /bin/sh is <b>dash</b>, which drops the extra privilege when euid != uid — so the planted binary ran as <b>1001</b>, not root. That is a property of one shell, not a defence you can depend on.', 'lam')}` },

  { t: 'execlp has no shell to drop privilege', giua: true, body: two(
    sh(g('runuser -u dev -- env PATH=/srv/evil /srv/lab/greetexec'), { sm: true }),
    sh(g('runuser -u dev -- env PATH=/srv/evil /srv/lab/greetfix'), { sm: true })) + `<p style="margin:10px 0 0;font-size:20px">execlp does a PATH search with no shell ⇒ the planted binary runs as <b>root (euid 0)</b>. The fix (right): drop privilege, then <code class="i">execle</code> an absolute path with a clean env.</p>` },

  { t: 'One capability instead of full root', giua: true, body: `
${sh(g('runuser -u dev -- /srv/lab/bind80') + '\n' + g('setcap cap_net_bind_service=+ep') + '\n' + g('runuser -u dev -- /srv/lab/bind80   # now'))}
<p style="margin:0;font-size:21px">Binding :80 fails for <code class="i">dev</code>; grant exactly <b>CAP_NET_BIND_SERVICE</b> and it works with no root at all. One power, not all of them — this is how to run a service on :80 without root.</p>` },

  { t: 'Audit permissions', giua: true, body: two(
    sh(g('find /srv/app', 1), { sm: true }) + `<p style="margin:8px 0 0;font-size:19px">world-writable config ⇒ anyone can rewrite it</p>`,
    sh(g('find /usr/bin -perm -4000'), { sm: true }) + `<p style="margin:8px 0 0;font-size:19px">every SUID-root binary is attack surface</p>`) + `<p style="margin:10px 0 0;font-size:20px"><code class="i">find -perm -0002</code> (world-writable) and <code class="i">-perm -4000</code> (SUID) are standard audit steps. Keep configs 600/640, secrets not world-readable.</p>` },

  { t: 'TOCTOU: the gap between check and use', giua: true, body: `
${sh(g('/tmp/toctou vuln link') + '\n' + g('ln -sf secret.txt link'))}
<p style="margin:0;font-size:21px">The program checks a path with <code class="i">access()</code>, then opens it with <code class="i">open()</code>. An attacker repoints the symlink in between, and the vulnerable path follows it to the secret.</p>` },

  { t: 'The fix: same object, checked once', giua: true, body: `
${sh(g('/tmp/toctou fixed'))}
${box('O_NOFOLLOW / openat', 'Open once with <code class="i">O_NOFOLLOW</code> (refuses a symlink at the final component — here ELOOP), or use <code class="i">openat</code> on a directory fd. Check and use must act on the <b>same object</b>, never a re-resolved name.', 'xanh')}` },

  { t: 'Secrets leak through /proc: env', giua: true, body: `
${sh(g('ls -l /proc/$SP/environ'))}
<p style="margin:0;font-size:21px"><code class="i">/proc/&lt;pid&gt;/environ</code> is mode 0400 — but readable by the <b>same user</b>. A sidecar or a second service sharing the account reads your <code class="i">DB_PASSWORD</code>.</p>` },

  { t: 'Secrets leak through /proc: argv', giua: true, body: `
${sh(g('tr') + '\n' + g('runuser -u dev -- ps -eo'))}
${box('Where CuongThai keeps secrets', 'A token in <code class="i">argv</code> is in <code class="i">/proc/&lt;pid&gt;/cmdline</code> and <code class="i">ps</code> — visible to <b>every</b> user. So production secrets live in a mode-restricted <code class="i">.env</code> file, loaded as env, never on the command line; and each service runs as its own user.', 'do2')}` },

  { t: 'And a word on sudo', giua: true, body: box('A misconfigured sudo rule is instant root — conceptually',
    'If a user may run an editor, interpreter or pager via <code class="i">sudo</code> (even NOPASSWD on <code class="i">vi</code>, <code class="i">less</code>, <code class="i">python</code>, <code class="i">find</code>), they can usually spawn a root shell from inside it. Grant sudo only for specific, argument-locked commands that cannot shell out; prefer a service account with capabilities; review sudoers like code. (Described, not demonstrated.)', 'lam') },

  { t: 'Takeaways', to: true, giua: true, body: `
<ul>
<li>A <b>SUID-root</b> helper that trusts <code class="i">$PATH</code> can run a planted binary as root; fix = drop privilege + execle an absolute path.</li>
<li>Prefer one <b>capability</b> (CAP_NET_BIND_SERVICE) over a full setuid-root binary.</li>
<li>Audit permissions; <b>TOCTOU</b> ⇒ O_NOFOLLOW/openat, never re-resolve a name.</li>
<li>Secrets leak via <code class="i">/proc</code>: environ to the same user, cmdline to everyone — keep them in a restricted file, never in argv.</li>
</ul>` },
]);
