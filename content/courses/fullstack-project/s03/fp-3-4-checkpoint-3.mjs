/**
 * 3.4 — Checkpoint 3: đăng ký → đăng nhập → gọi route bảo vệ bằng curl (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà: scripts/checkpoint-3.mjs (23 phép kiểm, gọi lại checkpoint-2 → checkpoint-1) đạt 23/23 trên repo chiase tag ch3;
 * clone sạch + npm ci + Postgres mới: lần 1 trượt (thiếu JWT_ACCESS_SECRET — script in đúng dòng lỗi khởi động), lần 2 trượt
 * (chưa migrate ⇒ 500), lần 3 đạt 23/23. Phát hiện thật khi viết script: API không lên ⇒ bản đầu văng TypeError và để lại
 * tiến trình tsx watch mồ côi giữ cổng ⇒ thêm ketThuc() luôn tắt máy chủ dev.
 */
import { spring } from '../_chung.mjs';

const OUT_BA = `$ curl -s -X POST localhost:41815/api/auth/register -H "Content-Type: application/json" -d '{"email":"dao@mail.com","password":"dao thu checkpoint ba","displayName":"Đào"}'; echo
{"message":"Nếu email này chưa có tài khoản, tài khoản đã được tạo. Hãy đăng nhập."}
$ TOKEN=$(curl -s -c jar.txt -X POST localhost:41815/api/auth/login -H "Content-Type: application/json" -d '{"email":"dao@mail.com","password":"dao thu checkpoint ba"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).accessToken'); echo "\${TOKEN:0:40}…"; echo "$TOKEN" &gt; token.txt
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ…
$ curl -s localhost:41815/api/me -H "Authorization: Bearer $(cat token.txt)"; echo
{"id":"01a20da1-ad5d-7b9a-9f99-2d297b807b32","email":"dao@mail.com","displayName":"Đào","createdAt":"2026-11-24T12:57:09.134Z"}
$ curl -s -b jar.txt -c jar.txt -X POST localhost:41815/api/auth/refresh | cut -c1-60; echo "…"
{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWI
…`;

const MA_CP3 = `// Checkpoint 3 — tự chấm: đăng ký → đăng nhập → route bảo vệ → hết hạn → refresh xoay vòng → đăng xuất → giới hạn tần suất.
// Cần: Postgres đang chạy, apps/api/.env có DATABASE_URL + JWT_ACCESS_SECRET, đã chạy npm run db:migrate -w apps/api.
// TẮT máy chủ dev đang chạy trước (script tự bật một bản, cùng cổng).  Chạy ở gốc repo:  node scripts/checkpoint-3.mjs
import { execSync, spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SignJWT } from 'jose';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
let dat = 0;
let truot = 0;
const kiem = (moTa, dung) =&gt; {
  console.log(\`  \${dung ? '✔' : '✘'} \${moTa}\`);
  dung ? dat++ : truot++;
};
const ngu = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const API = 'apps/api';

console.log('== 0. Checkpoint 2 vẫn đạt');
const cp2 = spawnSync(process.execPath, ['scripts/checkpoint-2.mjs'], { encoding: 'utf8' });
kiem(\`checkpoint-2: \${cp2.stdout.trim().split('\\n').at(-1)}\`, cp2.status === 0);

console.log('== 1. Bí mật nằm đúng chỗ');
const env = Object.fromEntries(
  readFileSync(\`\${API}/.env\`, 'utf8')
    .split(/\\r?\\n/)
    .filter((d) =&gt; /^[A-Z_]+=/.test(d))
    .map((d) =&gt; [d.slice(0, d.indexOf('=')), d.slice(d.indexOf('=') + 1)]),
);
const khoa = env.JWT_ACCESS_SECRET ?? '';
kiem(\`.env có JWT_ACCESS_SECRET ≥ 32 byte (đang \${Buffer.byteLength(khoa)})\`, Buffer.byteLength(khoa) &gt;= 32);
const mau = readFileSync(\`\${API}/.env.example\`, 'utf8');
kiem(
  '.env.example có dòng JWT_ACCESS_SECRET= nhưng KHÔNG chứa khoá thật',
  /^JWT_ACCESS_SECRET=$/m.test(mau) &amp;&amp; (khoa === '' || !mau.includes(khoa)),
);
const git = (l) =&gt; execSync(l, { encoding: 'utf8' });
kiem('.env không nằm trong git', git('git ls-files apps/api/.env').trim() === '');
const logBody = git(
  'git grep -n -E "console\\\\.(log|info|warn|error)\\\\(.*req\\\\.body" -- apps/api/src || true',
).trim();
kiem(\`không log req.body \${logBody ? \`(thấy: \${logBody})\` : ''}\`, logBody === '');

console.log('== 2. Luồng xác thực (bật API ở cổng trong .env)');
const cong = env.PORT ?? '41810';
const goc = \`http://localhost:\${cong}/api\`;
const laWin = process.platform === 'win32';
const api = spawn('npm', ['run', 'dev', '-w', API], {
  shell: laWin,
  detached: !laWin,
  stdio: ['ignore', 'ignore', 'pipe'],
});
let loiApi = '';
api.stderr.on('data', (d) =&gt; (loiApi = (loiApi + d).slice(-2000)));
// Dọn máy chủ dev DÙ checkpoint kết thúc kiểu gì (tsx watch không tự thoát khi mã lỗi ⇒ tiến trình mồ côi giữ cổng)
const tatApi = () =&gt; {
  if (laWin) spawnSync('taskkill', ['/pid', String(api.pid), '/T', '/F']);
  else
    try {
      process.kill(-api.pid, 'SIGTERM');
    } catch {}
};
const ketThuc = () =&gt; {
  tatApi();
  console.log(\`\\nKẾT QUẢ: \${dat} đạt, \${truot} trượt\`);
  process.exit(truot === 0 ? 0 : 1);
};
const goi = async (duong, { body, token, cookie, method = body ? 'POST' : 'GET' } = {}) =&gt; {
  try {
    const r = await fetch(\`\${goc}\${duong}\`, {
      method,
      headers: {
        ...(body ? { 'content-type': 'application/json' } : {}),
        ...(token ? { authorization: \`Bearer \${token}\` } : {}),
        ...(cookie ? { cookie } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(5000),
    });
    const sc = r.headers.get('set-cookie') ?? '';
    return { ma: r.status, sc, rt: sc.match(/^rt=([^;]*)/)?.[1] ?? '', text: await r.text() };
  } catch {
    return { ma: 0, sc: '', rt: '', text: '' };
  }
};
const js = (r) =&gt; {
  try {
    return JSON.parse(r.text);
  } catch {
    return {};
  }
};
let h = { ma: 0 };
for (let i = 0; i &lt; 40 &amp;&amp; h.ma === 0; i++) {
  await ngu(1000);
  h = await goi('/health');
}
kiem(\`API sống (\${goc}/health → \${h.ma})\`, h.ma === 200);
if (h.ma !== 200) {
  const dong = loiApi.split('\\n').find((d) =&gt; /^\\w*Error:|Không mở được cổng/.test(d));
  console.log(
    \`  ⇒ API không lên. Lỗi khởi động: \${dong?.trim() ?? '(không có) — thử: npm run dev -w apps/api'}\`,
  );
  ketThuc();
}

const email = \`cp3-\${Date.now()}@chiase.dev\`;
const mk = 'mat-khau-checkpoint-3';
const dk1 = await goi('/auth/register', {
  body: { email: \`  \${email.toUpperCase()} \`, password: mk, displayName: 'CP3' },
});
const dk2 = await goi('/auth/register', {
  body: { email, password: 'mat-khau-khac-han', displayName: 'Trùng' },
});
kiem(
  \`đăng ký mới → \${dk1.ma}; đăng ký TRÙNG → \${dk2.ma}; hai body giống hệt\`,
  dk1.ma === 202 &amp;&amp; dk2.ma === 202 &amp;&amp; dk1.text === dk2.text,
);
const sai = await goi('/auth/register', {
  body: { email: 'khong-phai-email', password: '123', displayName: '' },
});
kiem(
  \`đăng ký dữ liệu sai → \${sai.ma} \${js(sai).error?.code}\`,
  sai.ma === 400 &amp;&amp; js(sai).error?.code === 'DU_LIEU_SAI',
);

const saiMk = await goi('/auth/login', { body: { email, password: 'sai-mat-khau-roi' } });
const khongCo = await goi('/auth/login', { body: { email: \`khong-co-\${email}\`, password: mk } });
kiem(
  \`sai mật khẩu → \${saiMk.ma}; email không có → \${khongCo.ma}; hai body giống hệt\`,
  saiMk.ma === 401 &amp;&amp; saiMk.text === khongCo.text,
);

const dn = await goi('/auth/login', { body: { email, password: mk } });
const phien = js(dn);
kiem(
  \`đăng nhập đúng (email gõ hoa/thường khác lúc đăng ký) → \${dn.ma}, có accessToken\`,
  dn.ma === 200 &amp;&amp; typeof phien.accessToken === 'string',
);
if (dn.ma !== 200) ketThuc(); // các bước sau cần một phiên đăng nhập
kiem(
  'cookie rt: HttpOnly + SameSite=Strict + Path=/api/auth',
  /HttpOnly/i.test(dn.sc) &amp;&amp; /SameSite=Strict/i.test(dn.sc) &amp;&amp; /Path=\\/api\\/auth/i.test(dn.sc),
);
kiem(
  'body đăng nhập KHÔNG chứa refresh token, KHÔNG chứa passwordHash',
  !!dn.rt &amp;&amp; !dn.text.includes(dn.rt) &amp;&amp; !/password/i.test(dn.text),
);

// Danh sách route CẦN đăng nhập — thêm route bảo vệ mới (Chương 4, 5…) thì thêm vào đây
const BAO_VE = ['/me', '/users/00000000-0000-7000-8000-000000000000/sessions'];
for (const d of BAO_VE) {
  const r = await goi(d);
  kiem(\`GET \${d} không token → \${r.ma}\`, r.ma === 401);
}
const me0 = await goi('/me');
const me1 = await goi('/me', { token: phien.accessToken });
kiem(
  \`GET /me không token → \${me0.ma}; có token → \${me1.ma} (\${js(me1).email})\`,
  me0.ma === 401 &amp;&amp; me1.ma === 200 &amp;&amp; js(me1).email === email,
);

const k = new TextEncoder().encode(khoa);
const bay = Math.floor(Date.now() / 1000);
const het = await new SignJWT({})
  .setProtectedHeader({ alg: 'HS256' })
  .setSubject(phien.user.id)
  .setIssuer('chiase-api')
  .setAudience('chiase-web')
  .setIssuedAt(bay - 1000)
  .setExpirationTime(bay - 60)
  .sign(k);
const rHet = await goi('/me', { token: het });
kiem(
  \`token hết hạn → \${rHet.ma} \${js(rHet).error?.code}\`,
  rHet.ma === 401 &amp;&amp; js(rHet).error?.code === 'TOKEN_HET_HAN',
);
const b64 = (o) =&gt; Buffer.from(JSON.stringify(o)).toString('base64url');
const none = \`\${b64({ alg: 'none', typ: 'JWT' })}.\${b64({ sub: phien.user.id, iss: 'chiase-api', aud: 'chiase-web', exp: bay + 900 })}.\`;
const rNone = await goi('/me', { token: none });
kiem(\`token alg "none" → \${rNone.ma}\`, rNone.ma === 401);

const cu = dn.rt;
const lm = await goi('/auth/refresh', { method: 'POST', cookie: \`rt=\${cu}\` });
kiem(
  \`refresh → \${lm.ma}, access token mới + refresh token MỚI (xoay vòng)\`,
  lm.ma === 200 &amp;&amp; !!js(lm).accessToken &amp;&amp; !!lm.rt &amp;&amp; lm.rt !== cu,
);
const me2 = await goi('/me', { token: js(lm).accessToken });
kiem(\`access token mới gọi /me → \${me2.ma}\`, me2.ma === 200);
const dungLai = await goi('/auth/refresh', { method: 'POST', cookie: \`rt=\${cu}\` });
const moiNhat = await goi('/auth/refresh', { method: 'POST', cookie: \`rt=\${lm.rt}\` });
kiem(
  \`dùng lại token CŨ → \${dungLai.ma} \${js(dungLai).error?.code}; token mới nhất cũng bị thu hồi → \${moiNhat.ma}\`,
  dungLai.ma === 401 &amp;&amp; js(dungLai).error?.code === 'REFRESH_DUNG_LAI' &amp;&amp; moiNhat.ma === 401,
);

const dn2 = await goi('/auth/login', { body: { email, password: mk } });
const ra = await goi('/auth/logout', { method: 'POST', cookie: \`rt=\${dn2.rt}\` });
const sauRa = await goi('/auth/refresh', { method: 'POST', cookie: \`rt=\${dn2.rt}\` });
kiem(
  \`đăng xuất → \${ra.ma}; refresh bằng cookie vừa đăng xuất → \${sauRa.ma}\`,
  ra.ma === 204 &amp;&amp; sauRa.ma === 401,
);

const an = await goi('/auth/login', {
  body: { email: 'an@chiase.dev', password: process.env.SEED_PASSWORD ?? 'chiase-mau-2026' },
});
const xem = await goi(\`/users/\${phien.user.id}/sessions\`, { token: js(an).accessToken });
kiem(
  \`seed có mật khẩu thật (An đăng nhập → \${an.ma}); An xem phiên của người khác → \${xem.ma}\`,
  an.ma === 200 &amp;&amp; xem.ma === 403,
);

let lan = 0;
let r429 = { ma: 0 };
while (lan &lt; 15 &amp;&amp; r429.ma !== 429) {
  r429 = await goi('/auth/login', { body: { email, password: \`doan-\${lan++}\` } });
}
kiem(
  \`dò mật khẩu bị chặn: 429 ở lần thử thứ \${lan} (đăng ký + đăng nhập phía trên đã dùng chung 8 lượt của giới hạn 10)\`,
  r429.ma === 429,
);

ketThuc();`;

const OUT_CP = `$ node scripts/checkpoint-3.mjs
== 0. Checkpoint 2 vẫn đạt
  ✔ checkpoint-2: KẾT QUẢ: 15 đạt, 0 trượt
== 1. Bí mật nằm đúng chỗ
  ✔ .env có JWT_ACCESS_SECRET ≥ 32 byte (đang 43)
  ✔ .env.example có dòng JWT_ACCESS_SECRET= nhưng KHÔNG chứa khoá thật
  ✔ .env không nằm trong git
  ✔ không log req.body 
== 2. Luồng xác thực (bật API ở cổng trong .env)
  ✔ API sống (http://localhost:41815/api/health → 200)
  ✔ đăng ký mới → 202; đăng ký TRÙNG → 202; hai body giống hệt
  ✔ đăng ký dữ liệu sai → 400 DU_LIEU_SAI
  ✔ sai mật khẩu → 401; email không có → 401; hai body giống hệt
  ✔ đăng nhập đúng (email gõ hoa/thường khác lúc đăng ký) → 200, có accessToken
  ✔ cookie rt: HttpOnly + SameSite=Strict + Path=/api/auth
  ✔ body đăng nhập KHÔNG chứa refresh token, KHÔNG chứa passwordHash
  ✔ GET /me không token → 401
  ✔ GET /users/00000000-0000-7000-8000-000000000000/sessions không token → 401
  ✔ GET /me không token → 401; có token → 200 (cp3-1795524523946@chiase.dev)
  ✔ token hết hạn → 401 TOKEN_HET_HAN
  ✔ token alg "none" → 401
  ✔ refresh → 200, access token mới + refresh token MỚI (xoay vòng)
  ✔ access token mới gọi /me → 200
  ✔ dùng lại token CŨ → 401 REFRESH_DUNG_LAI; token mới nhất cũng bị thu hồi → 401
  ✔ đăng xuất → 204; refresh bằng cookie vừa đăng xuất → 401
  ✔ seed có mật khẩu thật (An đăng nhập → 200); An xem phiên của người khác → 403
  ✔ dò mật khẩu bị chặn: 429 ở lần thử thứ 3 (đăng ký + đăng nhập phía trên đã dùng chung 8 lượt của giới hạn 10)

KẾT QUẢ: 23 đạt, 0 trượt`;

const OUT_CLONE_1 = `$ node scripts/checkpoint-3.mjs      # lần 1: clone sạch, .env chép từ .env.example
== 0. Checkpoint 2 vẫn đạt
  ✘ checkpoint-2: KẾT QUẢ: 9 đạt, 6 trượt
== 1. Bí mật nằm đúng chỗ
  ✘ .env có JWT_ACCESS_SECRET ≥ 32 byte (đang 0)
== 2. Luồng xác thực (bật API ở cổng trong .env)
  ✘ API sống (http://localhost:41815/api/health → 0)
  ⇒ API không lên. Lỗi khởi động: Error: Thiếu biến môi trường JWT_ACCESS_SECRET — chép .env.example thành .env rồi điền

KẾT QUẢ: 3 đạt, 3 trượt`;

const OUT_CLONE_2 = `$ node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"   # dán vào JWT_ACCESS_SECRET= trong apps/api/.env
$ node scripts/checkpoint-3.mjs      # lần 2
== 0. Checkpoint 2 vẫn đạt
  ✘ checkpoint-2: KẾT QUẢ: 13 đạt, 2 trượt
== 1. Bí mật nằm đúng chỗ
== 2. Luồng xác thực (bật API ở cổng trong .env)
  ✘ đăng ký mới → 500; đăng ký TRÙNG → 500; hai body giống hệt
  ✘ sai mật khẩu → 500; email không có → 500; hai body giống hệt
  ✘ đăng nhập đúng (email gõ hoa/thường khác lúc đăng ký) → 500, có accessToken

KẾT QUẢ: 6 đạt, 4 trượt`;

const OUT_CLONE_3 = `$ npm run db:migrate -w apps/api
Applying migration \`20261124120000_init_users\`
Applying migration \`20261124120015_users_db_defaults\`
Applying migration \`20261124122750_refresh_tokens\`
The following migration(s) have been applied:
  └─ 20261124120000_init_users/
    └─ migration.sql
  └─ 20261124120015_users_db_defaults/
    └─ migration.sql
  └─ 20261124122750_refresh_tokens/
    └─ migration.sql
Your database is now in sync with your schema.
$ node scripts/checkpoint-3.mjs      # lần 3
  ✔ seed có mật khẩu thật (An đăng nhập → 200); An xem phiên của người khác → 403
  ✔ dò mật khẩu bị chặn: 429 ở lần thử thứ 3 (đăng ký + đăng nhập phía trên đã dùng chung 8 lượt của giới hạn 10)

KẾT QUẢ: 23 đạt, 0 trượt`;

export default {
  title: '3.4 — Checkpoint 3: register → login → call a protected route with curl|||3.4 — Checkpoint 3: đăng ký → đăng nhập → gọi route bảo vệ bằng curl',
  slug: 'fp-3-4-checkpoint-3',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba lệnh curl tay rồi 23 phép kiểm tự động: bí mật đúng chỗ, đăng ký/đăng nhập không lộ email, cookie đủ thuộc tính, mọi route bảo vệ trả 401, token hết hạn và alg "none" bị từ chối, xoay vòng + thu hồi cả họ, đăng xuất, 403, 429. Chạy trên bản clone sạch (thiếu khoá → chưa migrate → đạt), đọc dòng đỏ, đóng chương bằng merge + tag ch3.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Checkpoint</span>
<h2>Twenty-three checks that prove authentication works — including the ways it must fail</h2>
<p class="lead">A login form that lets the right person in proves almost nothing; the bugs that end up in the news are the ones that let the <em>wrong</em> person in, or leak who has an account. So this checkpoint spends most of its checks on failures: wrong password, unknown email, expired token, forged token, reused refresh token, someone else's data, too many attempts. First three curl commands by hand, then the script, then the same script on a clean clone.</p>

<h3>Everyday analogy: testing a new lock</h3>
<p>When a locksmith fits a new door lock, they do not only open it with the right key. They try the wrong key, a copy of the old key, the key half-turned, the door slammed. The customer pays for the lock that stays shut.</p>

<h3>By hand first: three curl calls</h3>
<p>Start Postgres and the API (<code>npm run dev -w apps/api</code>), then:</p>
<div class="out">${OUT_BA}</div>
<p>Register → 202, log in → access token in the body and the refresh cookie in <code>jar.txt</code>, call <code>/api/me</code> → your own profile, refresh → a new access token. If these four work by hand, the script has a chance.</p>

<h3>What Checkpoint 3 checks, and why</h3>
<table>
<tr><th>Group</th><th>Checks</th><th>Why</th></tr>
<tr><td>0. Previous chapter</td><td>checkpoint-2 (which runs checkpoint-1)</td><td>Auth must not break the foundation — it already did once (lesson 3.3).</td></tr>
<tr><td>1. Secrets</td><td>key ≥ 32 bytes · example file has the variable but not the key · .env not in git · no <code>req.body</code> in logs</td><td>Most real leaks are configuration, not cryptography.</td></tr>
<tr><td>2a. Register / login</td><td>identical bodies for new/duplicate email · 400 on bad data · identical 401 for wrong password/unknown email · login with differently-cased email</td><td>No account enumeration; normalisation works end to end.</td></tr>
<tr><td>2b. Tokens</td><td>cookie attributes · no refresh token or password field in body · every protected route 401 anonymously · expired → TOKEN_HET_HAN · <code>alg: none</code> → 401</td><td>The middleware is the only gate; test the gate, not just the happy path.</td></tr>
<tr><td>2c. Sessions</td><td>rotation gives a new cookie · reuse kills the family · logout ends refresh · 403 on another user's sessions · 429 after the limit</td><td>The properties lessons 3.2–3.3 promised.</td></tr>
</table>

<h3>The script</h3>
<p>Plain Node (works on Windows, macOS, Linux), no test framework yet — Chapter 8 brings Vitest. It mints an expired token itself with your <code>JWT_ACCESS_SECRET</code>, so it never waits 15 minutes. It also shuts down the dev server it started <em>whatever happens</em>: the first version crashed when the API failed to start and left an orphan <code>tsx watch</code> holding the port, so the next run failed for a reason that had nothing to do with your code.</p>
<pre><code class="language-js">${MA_CP3}</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">checkpoint-2</span><span class="lz-d">which runs checkpoint-1</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">secrets</span><span class="lz-d">key length, example file, git, logs</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">start API</span><span class="lz-d">print the startup error if it does not come up</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">auth flows</span><span class="lz-d">register, login, tokens, refresh, logout, 403, 429</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">stop API</span><span class="lz-d">always — no orphan process holding the port</span></div>
</div>

<h3>Running it</h3>
<div class="out">${OUT_CP}</div>

<h3>On a machine that has never seen the project</h3>
<p>Clone into a new folder, <code>npm ci</code>, a new empty Postgres, <code>.env</code> copied from <code>.env.example</code>. Three runs:</p>
<div class="out">${OUT_CLONE_1}</div>
<p>The script does not just say "API not alive"; it prints the startup error line. <code>config.ts</code> refused to start without a key — the behaviour we wanted in Chapter 2 ("fail at startup, not at the first request").</p>
<div class="out">${OUT_CLONE_2}</div>
<p>Key present, API up, but every auth call returns 500: the new database has no tables. Checkpoint 2's failing line (shown in full when you run it alone) names the missing migrations and the command.</p>
<div class="out">${OUT_CLONE_3}</div>
<p>This is the experience a teammate — or the CI of Chapter 10 — will have with your repo. Two of the three failures were things the README must say, which is why the quick-start now includes the key step.</p>

<h3>When a line is red</h3>
<table>
<tr><th>Red line</th><th>Most likely cause</th></tr>
<tr><td>duplicate registration bodies differ / 500</td><td>P2002 not caught, or a different message for the duplicate path</td></tr>
<tr><td>wrong password and unknown email bodies differ</td><td>two different error messages; or the unknown path throws something else (no dummy hash → <code>user</code> is null)</td></tr>
<tr><td>login with uppercase email fails</td><td>email not normalised in the schema or the service</td></tr>
<tr><td>cookie attributes</td><td>missing <code>httpOnly</code>/<code>sameSite</code>/<code>path</code> in <code>res.cookie</code></td></tr>
<tr><td>protected route returns 200 anonymously</td><td><code>requireAuth</code> not attached to that route</td></tr>
<tr><td>expired token gives TOKEN_KHONG_HOP_LE</td><td>not checking <code>instanceof errors.JWTExpired</code></td></tr>
<tr><td>reusing the old cookie returns 200</td><td>refresh does not mark the token used, or looks it up without hashing</td></tr>
<tr><td>newest cookie still works after reuse</td><td>reuse detection revokes only the presented token, not the family</td></tr>
<tr><td>no 429</td><td>limiter not on the route, or <code>AUTH_RATE_LIMIT</code> set high in your shell</td></tr>
</table>

<h3>Closing the chapter</h3>
<pre><code class="language-bash">git add -A
git commit -m "feat(api): đăng ký, đăng nhập JWT, refresh xoay vòng, requireAuth, Checkpoint 3"
git switch main
git merge --no-ff ch3/xac-thuc -m "Merge ch3/xac-thuc: Checkpoint 3 đạt 23/23"
git tag ch3
docker stop chiase-pg</code></pre>
<p>Before the merge, read the README section "Known security decisions": the 15-minute window after logout, the two-tab race to fix in Chapter 6, enumeration through login, the in-memory limiter. A reviewer who finds a limitation written down trusts the rest of the code more.</p>

${spring(true, 'In a Spring Boot project the same checkpoint is a set of <code>@SpringBootTest</code> + <code>MockMvc</code> tests (or a REST-assured suite) running these exact scenarios; the chapter 9 lab of the Spring Boot course has them.', [
  ['sb-9-7-lab-9', 'Spring Boot 9.7 — Chapter 9 lab + interview questions'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"How do you test authentication?"</strong> — Mostly negative cases: wrong credentials, expired/forged tokens, other users' data, reuse, rate limits — plus that protected routes reject anonymous calls.</li>
<li><strong>"How do you test token expiry without waiting?"</strong> — Mint a token with a past <code>exp</code> using the test key, or inject a clock.</li>
<li><strong>"What would you check before merging an auth feature?"</strong> — Secrets not committed, errors do not leak, logs do not contain credentials, limitations documented.</li>
</ol>

<h3>🧪 Lab — Checkpoint 3 (60 minutes)</h3>
<div class="callout ok">
<ol>
<li>Do the three curl calls by hand.</li>
<li>Write <code>scripts/checkpoint-3.mjs</code> (or copy it and read every line); run it until 23/23.</li>
<li>Break one thing at a time (remove the dummy hash; remove <code>path</code> from the cookie; remove <code>requireAuth</code> from <code>/me</code>; make refresh revoke only one token) and confirm the matching line goes red. Restore.</li>
<li>Clean clone in a temporary folder with a new database on another port; get to 23/23 using only the README.</li>
<li>Merge, tag <code>ch3</code>, stop the containers.</li>
</ol>
<p><strong>Done when:</strong> 23/23 on your repo and on a clean clone, and each of the four deliberate breaks was caught.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">negative test</span><span class="v">A test that checks something is correctly refused.</span></div>
  <div class="kv"><span class="k">orphan process</span><span class="v">A child process left running after its parent exited.</span></div>
  <div class="kv"><span class="k">regression</span><span class="v">Something that used to work and broke because of a new change.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Most of the 23 checks are failures that must happen.</li>
<li>The script mints its own expired token and always stops the server it started.</li>
<li>Clean clone: missing key → missing migration → pass; the README now covers both.</li>
<li>Merge + tag <code>ch3</code>; known limitations are written down, not hidden.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Checkpoint</span>
<h2>Hai mươi ba phép kiểm chứng minh xác thực chạy đúng — kể cả những cách nó BẮT BUỘC phải thất bại</h2>
<p class="lead">Một form đăng nhập cho đúng người vào thì gần như chẳng chứng minh được gì; những con bug lên báo là những con cho <em>sai</em> người vào, hoặc làm lộ ai có tài khoản. Vì vậy checkpoint này dành phần lớn phép kiểm cho các trường hợp thất bại: sai mật khẩu, email không tồn tại, token hết hạn, token giả, refresh token bị dùng lại, dữ liệu của người khác, thử quá nhiều lần. Đầu tiên là ba lệnh curl gõ tay, rồi tới script, rồi chạy chính script đó trên một bản clone sạch.</p>

<h3>Liên tưởng đời thường: nghiệm thu một ổ khoá mới</h3>
<p>Thợ lắp ổ khoá cửa mới không chỉ mở thử bằng đúng chìa. Họ thử chìa sai, chìa cũ đánh lại, chìa xoay nửa vòng, đóng sập cửa. Khách hàng trả tiền cho cái khoá giữ được cửa đóng.</p>

<h3>Gõ tay trước: ba lệnh curl</h3>
<p>Bật Postgres và API (<code>npm run dev -w apps/api</code>), rồi:</p>
<div class="out">${OUT_BA}</div>
<p>Đăng ký → 202, đăng nhập → access token trong body và cookie refresh trong <code>jar.txt</code>, gọi <code>/api/me</code> → hồ sơ của chính bạn, refresh → access token mới. Bốn bước này chạy bằng tay thì script mới có cơ hội đạt.</p>

<h3>Checkpoint 3 kiểm gì, và vì sao</h3>
<table>
<tr><th>Nhóm</th><th>Phép kiểm</th><th>Vì sao</th></tr>
<tr><td>0. Chương trước</td><td>checkpoint-2 (nó tự chạy checkpoint-1)</td><td>Xác thực không được làm hỏng phần nền — nó đã làm hỏng một lần (bài 3.3).</td></tr>
<tr><td>1. Bí mật</td><td>khoá ≥ 32 byte · tệp mẫu có tên biến nhưng không có khoá · .env không nằm trong git · không log <code>req.body</code></td><td>Phần lớn vụ rò rỉ thật nằm ở cấu hình, không nằm ở mật mã.</td></tr>
<tr><td>2a. Đăng ký / đăng nhập</td><td>body giống hệt cho email mới/trùng · 400 khi dữ liệu sai · 401 giống hệt cho sai mật khẩu/email không có · đăng nhập bằng email khác hoa thường</td><td>Không dò được tài khoản; chuẩn hoá chạy đúng từ đầu tới cuối.</td></tr>
<tr><td>2b. Token</td><td>thuộc tính cookie · body không chứa refresh token hay trường mật khẩu · mọi route bảo vệ trả 401 khi ẩn danh · hết hạn → TOKEN_HET_HAN · <code>alg: none</code> → 401</td><td>Middleware là cánh cổng duy nhất; thử cái cổng, không chỉ thử đường đi suôn sẻ.</td></tr>
<tr><td>2c. Phiên</td><td>xoay vòng cho cookie mới · dùng lại giết cả họ · đăng xuất chấm dứt refresh · 403 với phiên của người khác · 429 khi vượt giới hạn</td><td>Đúng những tính chất bài 3.2–3.3 đã hứa.</td></tr>
</table>

<h3>Script</h3>
<p>Node thuần (chạy được trên Windows, macOS, Linux), chưa dùng framework test — Chương 8 mới đưa Vitest vào. Nó tự tạo token hết hạn bằng chính <code>JWT_ACCESS_SECRET</code> của bạn, nên không bao giờ phải chờ 15 phút. Nó cũng tắt máy chủ dev mà nó đã bật <em>dù chuyện gì xảy ra</em>: bản đầu văng lỗi khi API không khởi động được và bỏ lại một tiến trình <code>tsx watch</code> mồ côi giữ cổng, nên lần chạy sau trượt vì một lý do chẳng liên quan gì tới mã của bạn.</p>
<pre><code class="language-js">${MA_CP3}</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">checkpoint-2</span><span class="lz-d">nó tự chạy checkpoint-1</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">bí mật</span><span class="lz-d">độ dài khoá, tệp mẫu, git, log</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">bật API</span><span class="lz-d">không lên thì in dòng lỗi khởi động</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">luồng xác thực</span><span class="lz-d">đăng ký, đăng nhập, token, refresh, đăng xuất, 403, 429</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">tắt API</span><span class="lz-d">luôn luôn — không để tiến trình mồ côi giữ cổng</span></div>
</div>

<h3>Chạy thật</h3>
<div class="out">${OUT_CP}</div>

<h3>Trên một máy chưa từng thấy dự án</h3>
<p>Clone vào thư mục mới, <code>npm ci</code>, một Postgres mới tinh, <code>.env</code> chép từ <code>.env.example</code>. Ba lần chạy:</p>
<div class="out">${OUT_CLONE_1}</div>
<p>Script không chỉ báo "API không sống"; nó in ra dòng lỗi lúc khởi động. <code>config.ts</code> từ chối chạy khi thiếu khoá — đúng hành vi ta muốn từ Chương 2 ("hỏng ngay lúc khởi động, đừng đợi tới request đầu tiên").</p>
<div class="out">${OUT_CLONE_2}</div>
<p>Có khoá, API đã lên, nhưng mọi lời gọi xác thực trả 500: CSDL mới chưa có bảng nào. Dòng trượt của Checkpoint 2 (chạy riêng sẽ thấy đầy đủ) nêu tên các migration còn thiếu và lệnh cần chạy.</p>
<div class="out">${OUT_CLONE_3}</div>
<p>Đây là trải nghiệm mà một đồng đội — hoặc CI ở Chương 10 — sẽ gặp với repo của bạn. Hai trong ba lần trượt là những điều README phải nói, vì vậy phần "Bắt đầu nhanh" giờ đã có thêm bước điền khoá.</p>

<h3>Khi có dòng đỏ</h3>
<table>
<tr><th>Dòng đỏ</th><th>Nguyên nhân hay gặp nhất</th></tr>
<tr><td>body đăng ký trùng khác nhau / 500</td><td>chưa bắt P2002, hoặc nhánh trùng có câu báo khác</td></tr>
<tr><td>body sai mật khẩu và email không có khác nhau</td><td>hai câu báo lỗi khác nhau; hoặc nhánh không có email ném lỗi khác (thiếu mã băm giả → <code>user</code> là null)</td></tr>
<tr><td>đăng nhập bằng email chữ hoa trượt</td><td>email chưa được chuẩn hoá trong schema hoặc service</td></tr>
<tr><td>thuộc tính cookie</td><td>thiếu <code>httpOnly</code>/<code>sameSite</code>/<code>path</code> trong <code>res.cookie</code></td></tr>
<tr><td>route bảo vệ trả 200 khi ẩn danh</td><td>chưa gắn <code>requireAuth</code> vào route đó</td></tr>
<tr><td>token hết hạn trả TOKEN_KHONG_HOP_LE</td><td>không kiểm <code>instanceof errors.JWTExpired</code></td></tr>
<tr><td>dùng lại cookie cũ vẫn 200</td><td>refresh không đánh dấu token đã dùng, hoặc tìm token mà không băm</td></tr>
<tr><td>cookie mới nhất vẫn chạy sau khi bị dùng lại</td><td>phát hiện dùng lại chỉ thu hồi token được gửi, không thu hồi cả họ</td></tr>
<tr><td>không có 429</td><td>limiter chưa gắn vào route, hoặc shell của bạn đang đặt <code>AUTH_RATE_LIMIT</code> cao</td></tr>
</table>

<h3>Đóng chương</h3>
<pre><code class="language-bash">git add -A
git commit -m "feat(api): đăng ký, đăng nhập JWT, refresh xoay vòng, requireAuth, Checkpoint 3"
git switch main
git merge --no-ff ch3/xac-thuc -m "Merge ch3/xac-thuc: Checkpoint 3 đạt 23/23"
git tag ch3
docker stop chiase-pg</code></pre>
<p>Trước khi merge, đọc lại mục "Quyết định bảo mật đã biết" trong README: khoảng hở 15 phút sau đăng xuất, cuộc đua hai tab phải sửa ở Chương 6, dò tài khoản qua đăng nhập, bộ đếm giới hạn nằm trong RAM. Người review thấy một giới hạn được ghi rõ thì tin phần mã còn lại hơn.</p>

${spring(false, 'Ở dự án Spring Boot, chính checkpoint này là một bộ test <code>@SpringBootTest</code> + <code>MockMvc</code> (hoặc REST-assured) chạy đúng các kịch bản trên; lab chương 9 của khoá Spring Boot có sẵn.', [
  ['sb-9-7-lab-9', 'Spring Boot 9.7 — Lab chương 9 + câu hỏi phỏng vấn'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Bạn test phần xác thực thế nào?"</strong> — Chủ yếu là các trường hợp phải thất bại: sai thông tin, token hết hạn/giả, dữ liệu của người khác, dùng lại, giới hạn tần suất — cộng với việc route bảo vệ từ chối lời gọi ẩn danh.</li>
<li><strong>"Test token hết hạn mà không phải chờ thế nào?"</strong> — Tự tạo token có <code>exp</code> trong quá khứ bằng khoá test, hoặc tiêm đồng hồ giả.</li>
<li><strong>"Kiểm gì trước khi merge một tính năng xác thực?"</strong> — Bí mật không bị commit, lỗi không lộ chi tiết, log không chứa thông tin đăng nhập, giới hạn đã ghi thành tài liệu.</li>
</ol>

<h3>🧪 Lab — Checkpoint 3 (60 phút)</h3>
<div class="callout ok">
<ol>
<li>Gõ tay ba lệnh curl.</li>
<li>Viết <code>scripts/checkpoint-3.mjs</code> (hoặc chép rồi đọc từng dòng); chạy tới khi đạt 23/23.</li>
<li>Phá từng thứ một (bỏ mã băm giả; bỏ <code>path</code> của cookie; bỏ <code>requireAuth</code> khỏi <code>/me</code>; cho refresh chỉ thu hồi một token) và xác nhận đúng dòng tương ứng chuyển đỏ. Khôi phục lại.</li>
<li>Clone sạch vào thư mục tạm với CSDL mới ở cổng khác; đạt 23/23 chỉ bằng cách làm theo README.</li>
<li>Merge, tag <code>ch3</code>, tắt container.</li>
</ol>
<p><strong>Xong khi:</strong> 23/23 trên repo của bạn và trên bản clone sạch, và cả bốn lần cố ý phá đều bị bắt.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">negative test</span><span class="v">Phép thử kiểm một điều bị từ chối đúng cách.</span></div>
  <div class="kv"><span class="k">orphan process</span><span class="v">Tiến trình mồ côi: tiến trình con còn chạy sau khi tiến trình cha đã thoát.</span></div>
  <div class="kv"><span class="k">regression</span><span class="v">Hồi quy: thứ từng chạy được bị hỏng vì một thay đổi mới.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Phần lớn trong 23 phép kiểm là những thất bại bắt buộc phải xảy ra.</li>
<li>Script tự tạo token hết hạn và luôn tắt máy chủ nó đã bật.</li>
<li>Clone sạch: thiếu khoá → thiếu migration → đạt; README giờ đã nói cả hai.</li>
<li>Merge + tag <code>ch3</code>; các giới hạn đã biết được ghi ra, không giấu đi.</li>
</ul>
</div>
`,
};
