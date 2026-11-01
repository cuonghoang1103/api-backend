/**
 * auth-01-5 — Authentication · Chapter 1 · Lesson 1.5 "Where secrets leak without anyone attacking" (01/11/2026).
 * Slug bài: auth-1-5-bi-mat-ro-o-dau. Output = _ma.mjs của s01 (LabFlow ID chạy thật, env -i; mọi bí mật là GIẢ).
 */
import { lamDeck, js, sh, http, two, box, steps, cards, c, vsd } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s01/_ma.mjs';

export const deck = { key: 'auth-01-5', code: 'AUTH 1.5', title: 'Where secrets leak', sub: 'Without anyone attacking' };

const rows = (k, from, to) => OUT[k].split('\n').slice(from, to).join('\n');
const LOGS = OUT['15-log-server'].split('\n');
const V01 = OUT['15-v01-log'].split('\n');

export const slides = lamDeck({ chuong: 'Chapter 1 — Credentials and primitives', bai: '1.5' }, [
  { cover: true, t: 'Where secrets leak<br>without anyone attacking', sub: 'Chapter 1 · Lesson 1.5 — logs, errors, git, bundles, env' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Log with an <b>allow-list</b> — and see a deny-list fail</li>
    <li>Log errors without dumping the request that failed</li>
    <li>Why ${c('git rm')} does not remove a secret — and what does (<b>rotation</b>)</li>
    <li>Catch secrets before the commit with <b>gitleaks</b> + your own prefix rule</li>
    <li>Keep server secrets out of front-end bundles and child processes</li></ul>` },
  { t: 'Four places a secret lives', body: cards([
      ['In transit', 'TLS, and never in a URL (lesson 1.1)'],
      ['In logs', 'copied to log platforms, backups, dashboards — for years'],
      ['In the repo / bundle', 'git history is forever; a bundle goes to every visitor'],
      ['In the process', 'env vars are inherited by every child process'],
    ], 4) + box('No attacker needed', 'Facebook, 2019: internal apps had logged hundreds of millions of passwords in plain text, searchable by 20,000+ employees (KrebsOnSecurity, 21/03/2019).', 'do2') },
  { t: 'Day-one logging prints everything', body: two('<div>' + js(`app.post('/naive/sign-in', (req, res) => {
  console.log('sign-in',
    { headers: req.headers, body: req.body });
  res.json({ ok: true });
});`, { sm: true, hl: [2, 3] }) + box('That line now lives…', 'in the log file, the log platform, its backups, and every screen showing the dashboard.', 'do2') + '</div>',
      sh(LOGS.slice(2, 18).filter((l) => /sign-in|headers|x-session|authorization|body|email|password|Password|^  \}|^\}/.test(l)).join('\n'), { title: 'node demo1/log-demo.js (lines kept: credentials)', hl: [3, 4, 7, 8] })) +
      box('Four credentials in one line', `session (${c('x-session')}), API key (${c('authorization')}), current and new password — all real values, all copied wherever the log goes.`, 'lam') },
  { t: 'Deny-list vs allow-list', body: http(LOGS[18], { title: "pino redact: ['headers.authorization', 'headers.cookie', 'body.password']", wrap: 'any' }) +
      http(LOGS[19], { title: "redact(…, ['headers', 'host', 'user-agent', 'content-type', 'body', 'email'])", wrap: 'any' }) +
      vsd('<p>Hid the 3 names someone thought of; <b>x-session</b> and <b>newPassword</b> printed in clear. Fails open.</p>',
        '<p>Names what is safe; everything else is <b>[redacted]</b>, including fields added next year. Fails closed.</p>', '✗ Deny-list', '✓ Allow-list') },
  { t: 'LabFlow ID v0.1: one safe line per request', body: two(js(`log.info(redact({
  method: req.method,
  path: req.path, // never originalUrl
  status: res.statusCode,
  ms, ip: req.ip,
  headers: req.headers,
  body: req.body ?? null,
}, SAFE), 'request');`, { hl: [3] }), box('What survived', `${c('?debug_token=…')} pasted in the URL: gone (only ${c('/me')}). Password, session, accept: ${c('[redacted]')}. Email and user agent: kept.`, 'xanh')) +
      http([V01[2], V01[3]].join('\n'), { title: 'node src/server.js', wrap: 'any' }) },
  { t: 'Error objects carry the request that failed', body: js(`try { await axios.get(url, { headers: { Authorization: 'Bearer …' } }); }
catch (err) {
  log.error({ err }, 'payment API failed');          // ✗ the whole request
  log.error({ status: err.response?.status, code: err.code,
              error: err.message }, 'payment API failed (safe)'); // ✓
}`, { sm: true, hl: [3, 4] }) + http(rows('15-axios', 1, 6), { title: 'wc -c · grep -c the key · head · tail', wrap: 'any' }) +
      box('9,773 bytes, the key 5 times', 'One failed call. Error trackers capture the same context by design — configure their scrubbing on day one.', 'do2') },
  { t: 'Git: a committed secret is committed forever', body: sh(rows('15-git-1', 1, 7), { title: 'bash demo1/git/make-leak.sh tmp/shop lfid_key_… lfid_ses_…' }) +
      sh(rows('15-git-2', 0, 5).replace(/(lfid_key_[A-Za-z0-9_-]{6})[A-Za-z0-9_-]+/, '$1…'), { title: 'the history still has it' }) +
      box('git rm --cached + .gitignore', 'removes the file from <b>now</b>. Every commit, clone, fork and CI cache keeps the old one.', 'do2') },
  { t: 'gitleaks: default rules vs your own prefix', body: two(sh(rows('15-git-3', 1, 6), { title: 'gitleaks git . --redact (default rules)' }),
      sh(rows('15-git-4', 1, 9), { title: '… --config gitleaks-lfid.toml' })) +
      cards([
        ['Default rules', `found ${c('.env')} (the name says KEY), <b>missed</b> the session id in a test fixture`],
        ['Prefix rule', `${c('lfid_(?:key|ses|reset)_…')} — the prefix from 1.2 makes your secrets findable`],
        ['--redact', 'the scanner’s own output must not become the next leak: CI logs are logs'],
      ], 3) },
  { t: 'The bundle ships VITE_* to every visitor', body: http(OUT['15-vite'].replace(/^\$ .*\n/, ''), { title: 'VITE_PAYMENT_SECRET_KEY=sk_demo_payment_000 LFID_SIGNING_KEY=… npx vite build', wrap: 'any' }) +
      two(box('Inlined at build time', `${c('import.meta.env.VITE_*')} is replaced by its <b>value</b> in the shipped JS. Same for Next.js ${c('NEXT_PUBLIC_*')}.`, 'do2'),
        box('The fix', 'A third-party secret is used by the <b>server</b>: a small authenticated backend proxy reads it at runtime.', 'xanh')) +
      box('Check it in CI', `After every build: ${c('grep -r "sk_\\|lfid_" dist/')} must find nothing — the same prefix trick as gitleaks.`, 'lam') },
  { t: 'Env is inherited · after a leak, rotate', body: sh(rows('15-env-con', 1, 2), { title: 'LFID_SIGNING_KEY=lfid_key_demo_000 node -e "execSync(\'node -p process.env.LFID_SIGNING_KEY\')"' }) +
      box('A child process sees the parent’s env', 'npm scripts, postinstall hooks, tools you spawn — treat everything in the container as able to read it.', 'do2') +
      steps([
        '<b>Revoke and rotate</b> the secret at the provider — first, always',
        'Check the provider’s logs: was it used?',
        'Then clean history, add a pre-commit scanner, fix the logger',
      ]) + box('Secret managers', 'Vault, AWS Secrets Manager: audited access + rotation without redeploys. The value still ends up in memory. Chapter 11.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Real leaks need no attacker: logs, errors, git, bundles, env</li>
    <li>Allow-list logging; a deny-list leaked ${c('x-session')}, ${c('newPassword')}, ${c('otp')}</li>
    <li>Never log whole error objects (9,773 bytes, key × 5)</li>
    <li>Scan before the commit; once pushed, <b>rotate</b></li>
    <li>Next — Lab 1: build LabFlow ID’s toolkit, graded by a script</li></ul>` },
]);
