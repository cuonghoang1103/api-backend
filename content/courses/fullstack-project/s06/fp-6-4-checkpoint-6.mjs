/**
 * 6.4 — Checkpoint 6: frontend chạy trọn trong một trình duyệt thật (soạn 24/11/2026, agent fsp).
 * Output THẬT: scripts/checkpoint-6.mjs (23 tiêu chí) điều khiển Google Chrome 150 bằng playwright-core 1.65.1, gọi lại
 * checkpoint-5 (→ 4 → 3 → 2 → 1). Repo chiase: commit d820cd3 + 43aa481, merge main 99a8bcd, tag ch6.
 * Đường tới 23/23 (24/11): lần 1 22/23 — phép kiểm grep "localStorage" khớp chính dòng CHÚ THÍCH trong client.ts ⇒ bắt cách dùng
 * (localStorage.x / dangerouslySetInnerHTML=); phá thử bỏ gộp refresh ⇒ bắt được (refresh 2,2,2; hai tab; hết hạn) NHƯNG script văng
 * ở bước sau (không đăng nhập ⇒ không thấy nút "Đăng bài") và để sót 2 tiến trình tsx watch + 46 bài thử sau 2 lần ⇒ bọc try/catch:
 * phá thử 13 đạt/4 trượt, 0 tiến trình, 0 bài sót; clone sạch + npm ci (13 s) ⇒ 23/23. vite build: JS 330,59 kB (gzip 104,44 kB).
 */
import { lienKet, spring } from '../_chung.mjs';

const SCRIPT = `// Checkpoint 6 — tự chấm frontend bằng một trình duyệt THẬT (Chrome cài trên máy bạn, điều khiển bằng playwright-core):
// feed cuộn hết không trùng/không sót, cổng đăng nhập + quay lại đúng trang, token KHÔNG nằm trong storage/cookie đọc được,
// F5 vẫn còn phiên (kể cả StrictMode và HAI tab F5 cùng lúc), token hết hạn ⇒ đúng MỘT lần refresh cho nhiều request,
// đăng bài kèm ảnh qua form, lỗi theo trường, không gửi trùng, bình luận chứa HTML hiện dạng chữ, API sập ⇒ hộp lỗi có "Thử lại".
// Cần: Postgres + MinIO đang chạy, đã migrate + seed + kho:chuan-bi; Google Chrome (hoặc CHROME_PATH=đường tới chrome/chromium).
// TẮT máy chủ dev đang chạy (API + Vite) trước — script tự bật một bản mỗi loại.  Chạy ở gốc repo:  node scripts/checkpoint-6.mjs
import { spawn, spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import sharp from 'sharp';
import { chromium } from 'playwright-core';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
let dat = 0;
let truot = 0;
const kiem = (moTa, dung) =&gt; {
  console.log(\`  \${dung ? '✔' : '✘'} \${moTa}\`);
  dung ? dat++ : truot++;
};
const ngu = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const laWin = process.platform === 'win32';
const docEnv = (tep) =&gt;
  existsSync(tep)
    ? Object.fromEntries(
        readFileSync(tep, 'utf8')
          .split(/\\r?\\n/)
          .filter((d) =&gt; /^[A-Z_0-9]+=/.test(d))
          .map((d) =&gt; [d.slice(0, d.indexOf('=')), d.slice(d.indexOf('=') + 1)]),
      )
    : {};

console.log('== 0. Checkpoint 5 vẫn đạt');
const cp5 = spawnSync(process.execPath, ['scripts/checkpoint-5.mjs'], { encoding: 'utf8' });
kiem(\`checkpoint-5: \${cp5.stdout.trim().split('\\n').at(-1)}\`, cp5.status === 0);

console.log('== 1. Mã nguồn web: kiểu, build, những thứ KHÔNG được có');
const tc = spawnSync('npm', ['run', 'typecheck', '-w', 'apps/web'], { encoding: 'utf8', shell: laWin });
kiem('tsc -b của web không lỗi (kiểu lỗi lấy từ hợp đồng PhanHoiLoi của API)', tc.status === 0);
const bd = spawnSync('npm', ['run', 'build', '-w', 'apps/web'], { encoding: 'utf8', shell: laWin });
kiem('vite build ra apps/web/dist', bd.status === 0 &amp;&amp; existsSync('apps/web/dist/index.html'));
const docHet = (thu) =&gt;
  readdirSync(thu, { recursive: true, withFileTypes: true })
    .filter((f) =&gt; f.isFile() &amp;&amp; /\\.(tsx?|js|css|html)$/.test(f.name))
    .map((f) =&gt; readFileSync(\`\${f.parentPath}/\${f.name}\`, 'utf8'))
    .join('\\n');
const src = docHet('apps/web/src');
kiem(
  'src/ không dùng localStorage/sessionStorage và không dangerouslySetInnerHTML',
  // Bắt CÁCH DÙNG (localStorage.x, dangerouslySetInnerHTML=…), không bắt chữ trong chú thích (lần chấm đầu trượt vì một dòng chú thích)
  !/\\b(localStorage|sessionStorage)\\s*\\.|dangerouslySetInnerHTML\\s*=/.test(src),
);
const envApi = docEnv('apps/api/.env');
const biMat = ['JWT_ACCESS_SECRET', 'S3_SECRET_ACCESS_KEY', 'DATABASE_URL']
  .map((k) =&gt; envApi[k])
  .filter(Boolean);
const dist = bd.status === 0 ? docHet('apps/web/dist') : '';
kiem(
  \`bundle dist/ không chứa bí mật của API (\${biMat.length} giá trị) và không kéo Zod/schema server vào\`,
  dist.length &gt; 0 &amp;&amp; biMat.every((b) =&gt; !dist.includes(b)) &amp;&amp; !dist.includes('loiSchema'),
);
const cong = envApi.PORT ?? '41810';
const envWeb = { ...docEnv('apps/web/.env'), ...docEnv('apps/web/.env.local') };
kiem(
  \`API_URL của web (\${envWeb.API_URL ?? 'mặc định http://localhost:41810'}) trỏ đúng cổng API (\${cong})\`,
  (envWeb.API_URL ?? 'http://localhost:41810').endsWith(\`:\${cong}\`),
);

console.log('== 2. Bật API (access token sống 4 s để thử hết hạn) + Vite');
const db = new pg.Client({ connectionString: envApi.DATABASE_URL });
await db.connect();
const sql = async (q, v = []) =&gt; (await db.query(q, v)).rows;
const bat = (ws, env = {}) =&gt;
  spawn('npm', ['run', 'dev', '-w', ws], {
    shell: laWin,
    detached: !laWin,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, ...env },
  });
let api = bat('apps/api', { ACCESS_TTL_S: '4' });
const web = bat('apps/web');
let logApi = '';
const ghiLog = (p) =&gt; {
  p.stdout.on('data', (d) =&gt; (logApi = (logApi + d).slice(-300_000)));
  p.stderr.on('data', (d) =&gt; (logApi = (logApi + d).slice(-300_000)));
};
ghiLog(api);
const tat = (p) =&gt; {
  if (!p || p.exitCode !== null) return;
  if (laWin) spawnSync('taskkill', ['/pid', String(p.pid), '/T', '/F']);
  else
    try {
      process.kill(-p.pid, 'SIGTERM');
    } catch {}
};
let trinhDuyet;
const nhan = \`cp6-\${Date.now().toString(36)}\`; // đánh dấu dữ liệu của lượt chấm này để dọn
const ketThuc = async () =&gt; {
  await trinhDuyet?.close().catch(() =&gt; {});
  await sql(\`DELETE FROM posts WHERE title LIKE $1 || '%'\`, [nhan]).catch(() =&gt; {});
  tat(api);
  tat(web);
  await db.end().catch(() =&gt; {});
  console.log(\`\\nKẾT QUẢ: \${dat} đạt, \${truot} trượt\`);
  process.exit(truot === 0 ? 0 : 1);
};
const WEB = 'http://localhost:41811';
const GOC = \`http://localhost:\${cong}/api\`;
const song = async (url) =&gt; {
  for (let i = 0; i &lt; 40; i++) {
    try {
      if ((await fetch(url, { signal: AbortSignal.timeout(2000) })).ok) return true;
    } catch {}
    await ngu(1000);
  }
  return false;
};
const apiSong = await song(\`\${GOC}/health\`);
const webSong = await song(\`\${WEB}/api/health\`); // đi qua proxy của Vite
kiem(\`API trả lời \${GOC}/health; Vite chuyển tiếp \${WEB}/api/health\`, apiSong &amp;&amp; webSong);
if (!apiSong || !webSong) {
  console.log('  ⇒ Cổng 41811 hoặc cổng API đang bị chiếm? Tắt máy chủ dev cũ rồi chạy lại.');
  await ketThuc();
}

// Dữ liệu: 23 bài published của An (kèm bài có sẵn) để feed có nhiều trang
const J = { 'content-type': 'application/json' };
const dangNhapApi = async (email) =&gt;
  (
    await (
      await fetch(\`\${GOC}/auth/login\`, {
        method: 'POST',
        headers: J,
        body: JSON.stringify({ email, password: process.env.SEED_PASSWORD ?? 'chiase-mau-2026' }),
      })
    ).json()
  ).accessToken;
const tokAn = await dangNhapApi('an@chiase.dev');
for (let i = 1; i &lt;= 23; i++)
  await fetch(\`\${GOC}/posts\`, {
    method: 'POST',
    headers: { ...J, authorization: \`Bearer \${tokAn}\` },
    body: JSON.stringify({ title: \`\${nhan} feed \${i}\`, body: 'bài để cuộn', status: 'published' }),
  });

console.log('== 3. Trình duyệt thật');
try {
  try {
    trinhDuyet = await chromium.launch(
      process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' },
    );
  } catch (e) {
    kiem(
      \`mở được Chrome (\${String(e.message).split('\\n')[0]}) — cài Google Chrome hoặc đặt CHROME_PATH\`,
      false,
    );
    await ketThuc();
  }
  const ctx = await trinhDuyet.newContext();
  const trang = await ctx.newPage();
  const loiConsole = [];
  const demRefresh = { n: 0 };
  const theoDoi = (p) =&gt; {
    p.on('console', (m) =&gt; m.type() === 'error' &amp;&amp; loiConsole.push(m.text()));
    p.on('request', (r) =&gt; r.url().endsWith('/api/auth/refresh') &amp;&amp; demRefresh.n++);
  };
  theoDoi(trang);
  const thanhTren = async (p = trang) =&gt; (await p.locator('header').innerText()).replace(/\\s+/g, ' ');

  // 3a. Feed cuộn tới hết
  await trang.goto(WEB);
  await trang.waitForSelector('.the-bai', { timeout: 10000 }).catch(() =&gt; {});
  for (let i = 0; i &lt; 30 &amp;&amp; !(await trang.getByText('— Hết bài —').count()); i++) {
    await trang.mouse.wheel(0, 30000);
    await ngu(400);
  }
  const hrefs = await trang
    .locator('.the-bai h2 a')
    .evaluateAll((as) =&gt; as.map((a) =&gt; a.getAttribute('href')));
  const [{ n: soDaDang }] = await sql(\`SELECT count(*)::int AS n FROM posts WHERE status = 'published'\`);
  kiem(
    \`feed cuộn tới "— Hết bài —": \${hrefs.length} bài hiện, \${new Set(hrefs).size} khác nhau, CSDL có \${soDaDang} bài đã đăng\`,
    hrefs.length === soDaDang &amp;&amp; new Set(hrefs).size === hrefs.length,
  );
  kiem(
    'không có lỗi "two children with the same key" (StrictMode không làm trùng trang đầu)',
    !loiConsole.some((l) =&gt; l.includes('same key')),
  );

  // 3b. Cổng đăng nhập
  await trang.goto(\`\${WEB}/viet\`);
  await trang.waitForURL(/dang-nhap/, { timeout: 5000 }).catch(() =&gt; {});
  kiem(
    \`khách mở /viet ⇒ \${new URL(trang.url()).pathname}\${new URL(trang.url()).search}\`,
    trang.url().endsWith('/dang-nhap?tiep=%2Fviet'),
  );
  await trang.fill('input[name=email]', 'an@chiase.dev');
  await trang.fill('input[name=password]', process.env.SEED_PASSWORD ?? 'chiase-mau-2026');
  await trang.click('button:has-text("Đăng nhập")');
  await trang.waitForURL(/\\/viet$/, { timeout: 5000 }).catch(() =&gt; {});
  kiem(
    \`đăng nhập xong quay về đúng /viet (đang ở \${new URL(trang.url()).pathname})\`,
    trang.url().endsWith('/viet'),
  );
  const kho = await trang.evaluate(() =&gt; ({
    cookie: document.cookie,
    storage: JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }),
  }));
  const rt = (await ctx.cookies()).find((c) =&gt; c.name === 'rt');
  kiem(
    \`JS của trang không thấy token: document.cookie="\${kho.cookie}", storage không có JWT; cookie rt httpOnly=\${rt?.httpOnly}\`,
    !kho.cookie.includes('rt=') &amp;&amp; !kho.storage.includes('eyJ') &amp;&amp; rt?.httpOnly === true,
  );
  await trang.goto(\`\${WEB}/dang-nhap?tiep=//vi-du-lua-dao.example/x\`);
  await ngu(800);
  kiem(
    \`?tiep=//site-khác không đưa người dùng ra ngoài (đang ở \${trang.url()})\`,
    trang.url().startsWith(WEB),
  );

  // 3c. F5 giữ phiên — StrictMode chạy effect 2 lần nhưng chỉ được MỘT lần refresh
  let f5Ok = true;
  let soRefresh = [];
  for (let i = 0; i &lt; 3; i++) {
    demRefresh.n = 0;
    await trang.goto(\`\${WEB}/\`);
    await trang.waitForSelector('header :text("Đăng xuất"), header :text("Đăng nhập")', { timeout: 5000 });
    await ngu(500);
    soRefresh.push(demRefresh.n);
    if (!(await thanhTren()).includes('Đăng xuất')) f5Ok = false;
  }
  kiem(
    \`mở lại trang 3 lần vẫn đăng nhập; số lần gọi /auth/refresh mỗi lần: \${soRefresh.join(', ')}\`,
    f5Ok &amp;&amp; soRefresh.every((n) =&gt; n === 1),
  );
  const tab2 = await ctx.newPage();
  theoDoi(tab2);
  await tab2.goto(\`\${WEB}/\`);
  await ngu(800);
  let haiTabOk = true;
  for (let i = 0; i &lt; 5 &amp;&amp; haiTabOk; i++) {
    await Promise.all([trang.reload(), tab2.reload()]);
    await ngu(1200);
    haiTabOk = (await thanhTren()).includes('Đăng xuất') &amp;&amp; (await thanhTren(tab2)).includes('Đăng xuất');
  }
  kiem('hai tab F5 cùng lúc 5 lần: cả hai vẫn đăng nhập (không ai gửi refresh token cũ)', haiTabOk);
  await tab2.close();

  // 3d. Access token hết hạn (4 s) ⇒ 3 request song song chỉ sinh MỘT refresh, cả 3 thành công
  await ngu(5000);
  demRefresh.n = 0;
  const ba = await trang
    .evaluate(async () =&gt; {
      const { api } = await import('/src/api/client.ts');
      const r = await Promise.all([api('/me'), api('/me'), api('/me')]);
      return r.map((u) =&gt; u.email).join(',');
    })
    .catch((e) =&gt; \`lỗi: \${e.message}\`);
  kiem(
    \`token hết hạn: 3 lời gọi /me song song ⇒ "\${ba.slice(0, 60)}", số refresh = \${demRefresh.n}\`,
    ba === 'an@chiase.dev,an@chiase.dev,an@chiase.dev' &amp;&amp; demRefresh.n === 1,
  );

  // 3e. Form viết bài
  await trang.goto(\`\${WEB}/viet\`);
  await trang.click('button:has-text("Đăng bài")');
  await ngu(800);
  const ohong = await trang.locator('[aria-invalid="true"]').count();
  kiem(\`gửi form trống: \${ohong} ô được đánh dấu aria-invalid kèm lời từ details[] của API\`, ohong &gt;= 2);
  const anh = await sharp({ create: { width: 320, height: 200, channels: 3, background: '#6b2fd6' } })
    .jpeg()
    .toBuffer();
  await trang.setInputFiles('input[type=file]', { name: 'thu.jpg', mimeType: 'image/jpeg', buffer: anh });
  await trang.fill('input[name=title]', \`\${nhan} có ảnh\`);
  await trang.fill('textarea[name=body]', 'Đăng từ checkpoint 6');
  await trang.evaluate(() =&gt; {
    const f = document.querySelector('form');
    f.requestSubmit();
    f.requestSubmit(); // gửi HAI lần trong cùng một tác vụ — chỉ được tạo một bài
  });
  await trang.waitForURL(/\\/bai\\//, { timeout: 15000 }).catch(() =&gt; {});
  await ngu(1000);
  const img = trang.locator('article img').first();
  const rong = await img.evaluate((i) =&gt; i.naturalWidth).catch(() =&gt; 0);
  const srcAnh = (await img.getAttribute('src').catch(() =&gt; '')) ?? '';
  kiem(
    \`đăng bài kèm ảnh qua form ⇒ sang trang bài, ảnh \${srcAnh.split('/').slice(-2).join('/')} hiện (rộng \${rong}px)\`,
    rong &gt; 0 &amp;&amp; srcAnh.endsWith('.webp'),
  );
  const [{ n: soBaiAnh }] = await sql(\`SELECT count(*)::int AS n FROM posts WHERE title = $1\`, [
    \`\${nhan} có ảnh\`,
  ]);
  kiem(\`requestSubmit() hai lần liền ⇒ \${soBaiAnh} bài trong CSDL\`, soBaiAnh === 1);

  // 3f. Bình luận chứa HTML
  const XSS = \`&lt;img src=x onerror="console.error('XSS-CHAY')"&gt;\${nhan}\`;
  const demTruoc = await trang.locator('h2:has-text("Bình luận")').innerText();
  await trang.fill('textarea[name=body]', XSS);
  await trang.click('button:has-text("Gửi bình luận")');
  await ngu(1000);
  await trang.reload();
  await trang.waitForSelector('.binh-luan li', { timeout: 5000 }).catch(() =&gt; {});
  await ngu(500);
  const chuBl = await trang
    .locator('.binh-luan li p')
    .first()
    .innerText()
    .catch(() =&gt; '');
  kiem(
    \`bình luận "&lt;img onerror=…&gt;" hiện nguyên văn, 0 thẻ img, không chạy (\${demTruoc} ⇒ \${await trang.locator('h2:has-text("Bình luận")').innerText()})\`,
    chuBl.startsWith('&lt;img') &amp;&amp;
      (await trang.locator('.binh-luan img').count()) === 0 &amp;&amp;
      !loiConsole.some((l) =&gt; l.includes('XSS-CHAY')),
  );

  // 3g. API sập ⇒ hộp lỗi + Thử lại; API sống lại ⇒ Thử lại được
  tat(api);
  await ngu(1500);
  await trang.goto(\`\${WEB}/\`);
  await trang.waitForSelector('[role=alert]', { timeout: 8000 }).catch(() =&gt; {});
  const hop = await trang
    .locator('[role=alert]')
    .innerText()
    .catch(() =&gt; '');
  kiem(
    \`API tắt ⇒ feed hiện hộp lỗi có nút Thử lại ("\${hop.split('\\n')[0].slice(0, 50)}…")\`,
    hop.includes('Thử lại'),
  );
  api = bat('apps/api');
  ghiLog(api);
  await song(\`\${GOC}/health\`);
  await trang.click('button:has-text("Thử lại")');
  await trang.waitForSelector('.the-bai', { timeout: 8000 }).catch(() =&gt; {});
  kiem('API sống lại ⇒ bấm Thử lại thì feed hiện bài', (await trang.locator('.the-bai').count()) &gt; 0);

  // 3h. Đăng xuất
  await trang.goto(\`\${WEB}/\`);
  await trang.waitForSelector('header button:has-text("Đăng xuất")', { timeout: 8000 }).catch(() =&gt; {});
  await trang.click('header button:has-text("Đăng xuất")').catch(() =&gt; {});
  await ngu(800);
  await trang.reload();
  await ngu(1500);
  kiem(
    \`đăng xuất rồi F5: thanh trên "\${await thanhTren()}", không còn cookie rt\`,
    (await thanhTren()).includes('Đăng nhập') &amp;&amp; !(await ctx.cookies()).some((c) =&gt; c.name === 'rt'),
  );
} catch (e) {
  // Một bước văng (vd chưa đăng nhập nên không thấy nút) ⇒ ghi trượt rồi VẪN dọn: tắt API/Vite, xoá dữ liệu thử.
  // Bản đầu không có khối này: phá thử làm script văng ⇒ để sót 2 tiến trình tsx watch + 46 bài thử.
  kiem(\`dừng giữa chừng: \${String(e.message).split('\\n')[0]}\`, false);
}
await ketThuc();`;

const CHAY = `$ node scripts/checkpoint-6.mjs
== 0. Checkpoint 5 vẫn đạt
  ✔ checkpoint-5: KẾT QUẢ: 23 đạt, 0 trượt
== 1. Mã nguồn web: kiểu, build, những thứ KHÔNG được có
  ✔ tsc -b của web không lỗi (kiểu lỗi lấy từ hợp đồng PhanHoiLoi của API)
  ✔ vite build ra apps/web/dist
  ✔ src/ không dùng localStorage/sessionStorage và không dangerouslySetInnerHTML
  ✔ bundle dist/ không chứa bí mật của API (3 giá trị) và không kéo Zod/schema server vào
  ✔ API_URL của web (http://localhost:41815) trỏ đúng cổng API (41815)
== 2. Bật API (access token sống 4 s để thử hết hạn) + Vite
  ✔ API trả lời http://localhost:41815/api/health; Vite chuyển tiếp http://localhost:41811/api/health
== 3. Trình duyệt thật
  ✔ feed cuộn tới "— Hết bài —": 58 bài hiện, 58 khác nhau, CSDL có 58 bài đã đăng
  ✔ không có lỗi "two children with the same key" (StrictMode không làm trùng trang đầu)
  ✔ khách mở /viet ⇒ /dang-nhap?tiep=%2Fviet
  ✔ đăng nhập xong quay về đúng /viet (đang ở /viet)
  ✔ JS của trang không thấy token: document.cookie="", storage không có JWT; cookie rt httpOnly=true
  ✔ ?tiep=//site-khác không đưa người dùng ra ngoài (đang ở http://localhost:41811/)
  ✔ mở lại trang 3 lần vẫn đăng nhập; số lần gọi /auth/refresh mỗi lần: 1, 1, 1
  ✔ hai tab F5 cùng lúc 5 lần: cả hai vẫn đăng nhập (không ai gửi refresh token cũ)
  ✔ token hết hạn: 3 lời gọi /me song song ⇒ "an@chiase.dev,an@chiase.dev,an@chiase.dev", số refresh = 1
  ✔ gửi form trống: 2 ô được đánh dấu aria-invalid kèm lời từ details[] của API
  ✔ đăng bài kèm ảnh qua form ⇒ sang trang bài, ảnh posts/c6f4700e-d131-4d9b-9ae9-c85989fcee29.webp hiện (rộng 320px)
  ✔ requestSubmit() hai lần liền ⇒ 1 bài trong CSDL
  ✔ bình luận "&lt;img onerror=…&gt;" hiện nguyên văn, 0 thẻ img, không chạy (Bình luận (0) ⇒ Bình luận (1))
  ✔ API tắt ⇒ feed hiện hộp lỗi có nút Thử lại ("Có sự cố phía máy chủ hoặc mạng. Bạn thử lại sau í…")
  ✔ API sống lại ⇒ bấm Thử lại thì feed hiện bài
  ✔ đăng xuất rồi F5: thanh trên "ChiaSe Đăng nhập", không còn cookie rt

KẾT QUẢ: 23 đạt, 0 trượt`;

const LAN1 = `$ node scripts/checkpoint-6.mjs        # lần đầu
  ✘ src/ không dùng localStorage/sessionStorage và không dangerouslySetInnerHTML
KẾT QUẢ: 22 đạt, 1 trượt
$ grep -rn "localStorage\\|sessionStorage\\|dangerouslySetInnerHTML" apps/web/src
apps/web/src/api/client.ts:3:// Access token CHỈ nằm trong biến này (bộ nhớ của tab). Không localStorage/s`;

const PHA_THU = `# phá thử: lamMoiToken KHÔNG gộp (dangLamMoi = guiLamMoi()…) — bản đầu của checkpoint, chưa có try/catch (chạy 2 lần)
$ node scripts/checkpoint-6.mjs
  …
  ✘ mở lại trang 3 lần vẫn đăng nhập; số lần gọi /auth/refresh mỗi lần: 2, 2, 2
  ✘ hai tab F5 cùng lúc 5 lần: cả hai vẫn đăng nhập (không ai gửi refresh token cũ)
  ✘ token hết hạn: 3 lời gọi /me song song ⇒ "lỗi: page.evaluate: ApiError: Cần đăng nhập …", số refresh = 0
page.click: Timeout 30000ms exceeded.
  - waiting for locator('button:has-text("Đăng bài")')
$ pgrep -af "fsp/chiase" | wc -l ; psql … "DELETE FROM posts WHERE title LIKE 'cp6-%'"     # sau 2 lần văng
2
DELETE 46
# sau khi bọc phần trình duyệt bằng try/catch, cùng phá thử:
  ✘ mở lại trang 3 lần vẫn đăng nhập; số lần gọi /auth/refresh mỗi lần: 2, 2, 2
  ✘ hai tab F5 cùng lúc 5 lần: cả hai vẫn đăng nhập (không ai gửi refresh token cũ)
  ✘ token hết hạn: 3 lời gọi /me song song ⇒ "lỗi: page.evaluate: ApiError: Cần đăng nhập
  ✘ dừng giữa chừng: page.click: Timeout 30000ms exceeded.
KẾT QUẢ: 13 đạt, 4 trượt
$ pgrep -af "fsp/chiase" | wc -l ; psql … "select count(*) from posts where title like 'cp6-%'"
0
0`;

const CLONE = `$ git clone -q chiase ../sach -b ch6/frontend &amp;&amp; cd ../sach &amp;&amp; time npm ci --no-audit --no-fund
added 334 packages in 13s
npm ci --no-audit --no-fund  9.42s user 3.34s system 98% cpu 12.938 total
$ cp ../chiase/apps/api/.env apps/api/ &amp;&amp; cp ../chiase/apps/web/.env.local apps/web/
$ node scripts/checkpoint-6.mjs
  ✔ checkpoint-5: KẾT QUẢ: 23 đạt, 0 trượt
KẾT QUẢ: 23 đạt, 0 trượt`;

const BUILD = `computing gzip size...
dist/index.html                   0.45 kB │ gzip:   0.29 kB
dist/assets/index-DNaxEmx3.css    1.28 kB │ gzip:   0.59 kB
dist/assets/index-BAf-VYlp.js   330.59 kB │ gzip: 104.44 kB

✓ built in 762ms`;

const GIT = `$ git log --oneline --first-parent main -2 &amp;&amp; git log --oneline ch5..ch6 --no-merges
99a8bcd Merge ch6/frontend: Checkpoint 6 đạt 23/23
c2bc235 Merge ch5/binh-luan: Checkpoint 5 đạt 23/23
2a3d042 docs: README — quyết định frontend Chương 6
43aa481 test: checkpoint-6 vẫn dọn API/Vite + dữ liệu thử khi một bước văng (phá thử để sót tiến trình)
d820cd3 test: checkpoint-6 (23 tiêu chí, Chrome thật qua playwright-core) — gọi checkpoint-5
8d67c74 feat(web): form viết bài kèm ảnh (vé → PUT có tiến độ → tạo bài), lỗi theo trường, chặn gửi hai lần, form bình luận hiện dạng chữ
6860f2b feat(web): đăng nhập/đăng ký, access token trong bộ nhớ, khôi phục phiên bằng cookie, gộp refresh + Web Locks giữa các tab, cổng /viet, chặn chuyển hướng mở
aa6eeb5 feat(web): proxy /api qua Vite, lớp gọi API (ApiError theo hợp đồng lỗi), feed cuộn vô tận theo cursor, trang bài viết`;

const THE = [
  lienKet({ khoa: 'testing', bai: 'tst-7-1-playwright', title: 'Testing 7.1 — Playwright: test trình duyệt đầu tiên', sub: 'Checkpoint này là một test e2e viết tay; khoá Testing dạy làm cho đúng chuẩn.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-7-3-on-dinh', title: 'Testing 7.3 — Làm test e2e ổn định', sub: 'Chờ theo điều kiện thay vì ngủ cố định — những chỗ checkpoint còn ngủ.', cta: 'Mở bài →' }),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Section</th><th>What it proves</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>0</td><td>Checkpoint 5 (and through it 4…1) still passes — the backend did not move</td><td>5.4</td></tr>
<tr><td>1</td><td><code>tsc -b</code> of the web passes with the API's error type; <code>vite build</code> works; <code>src/</code> never <em>uses</em> storage or <code>dangerouslySetInnerHTML</code>; the bundle contains none of the API's secrets and no server schema; <code>API_URL</code> points at the API's port</td><td>6.1, 6.2, 6.3</td></tr>
<tr><td>2</td><td>The API starts (access token 4 s) and Vite forwards <code>/api/health</code></td><td>6.1</td></tr>
<tr><td>3a</td><td>Scrolling the feed to "— Hết bài —" shows exactly the published posts in the database, no duplicates, no key warnings</td><td>6.1</td></tr>
<tr><td>3b</td><td>Guest on <code>/viet</code> ⇒ <code>/dang-nhap?tiep=%2Fviet</code>; after login back to <code>/viet</code>; no token visible to JS; <code>?tiep=//other-site</code> stays on the site</td><td>6.2</td></tr>
<tr><td>3c</td><td>Three reloads keep the session with exactly one refresh each; two tabs reloaded together five times both stay logged in</td><td>6.2</td></tr>
<tr><td>3d</td><td>After the access token expires, three parallel requests cause one refresh and all succeed</td><td>6.2</td></tr>
<tr><td>3e</td><td>Empty form ⇒ field errors; a post with an image through the form ⇒ WebP displayed; two <code>requestSubmit()</code> ⇒ one post</td><td>6.3</td></tr>
<tr><td>3f</td><td>A comment containing <code>&lt;img onerror&gt;</code> is text and does not run</td><td>6.3</td></tr>
<tr><td>3g–h</td><td>API down ⇒ error box with "Thử lại"; API back ⇒ retry works; logout ⇒ no cookie, header shows "Đăng nhập"</td><td>6.1, 6.2</td></tr>
</tbody></table>`;

const BANG_VI = `<table>
<thead><tr><th>Mục</th><th>Chứng minh điều gì</th><th>Bài</th></tr></thead>
<tbody>
<tr><td>0</td><td>Checkpoint 5 (và qua nó 4…1) vẫn đạt — backend không xê dịch</td><td>5.4</td></tr>
<tr><td>1</td><td><code>tsc -b</code> của web qua với kiểu lỗi của API; <code>vite build</code> chạy; <code>src/</code> không <em>dùng</em> storage hay <code>dangerouslySetInnerHTML</code>; bundle không chứa bí mật nào của API và không có schema server; <code>API_URL</code> trỏ đúng cổng API</td><td>6.1, 6.2, 6.3</td></tr>
<tr><td>2</td><td>API bật (access token 4 s) và Vite chuyển tiếp <code>/api/health</code></td><td>6.1</td></tr>
<tr><td>3a</td><td>Cuộn feed tới "— Hết bài —" thấy đúng số bài đã đăng trong CSDL, không trùng, không cảnh báo key</td><td>6.1</td></tr>
<tr><td>3b</td><td>Khách vào <code>/viet</code> ⇒ <code>/dang-nhap?tiep=%2Fviet</code>; đăng nhập xong về <code>/viet</code>; JS không thấy token; <code>?tiep=//site-khác</code> vẫn ở lại site</td><td>6.2</td></tr>
<tr><td>3c</td><td>Ba lần tải lại vẫn giữ phiên, mỗi lần đúng một refresh; hai tab tải lại cùng lúc năm lần đều còn đăng nhập</td><td>6.2</td></tr>
<tr><td>3d</td><td>Access token hết hạn ⇒ ba request song song sinh một refresh và đều thành công</td><td>6.2</td></tr>
<tr><td>3e</td><td>Form trống ⇒ lỗi theo trường; đăng bài có ảnh qua form ⇒ ảnh WebP hiện; hai <code>requestSubmit()</code> ⇒ một bài</td><td>6.3</td></tr>
<tr><td>3f</td><td>Bình luận chứa <code>&lt;img onerror&gt;</code> là chữ và không chạy</td><td>6.3</td></tr>
<tr><td>3g–h</td><td>API sập ⇒ hộp lỗi có "Thử lại"; API sống lại ⇒ thử lại được; đăng xuất ⇒ hết cookie, thanh trên hiện "Đăng nhập"</td><td>6.1, 6.2</td></tr>
</tbody></table>`;

export default {
  title: '6.4 — Checkpoint 6: the frontend works end to end in a real browser|||6.4 — Checkpoint 6: frontend chạy trọn trong một trình duyệt thật',
  slug: 'fp-6-4-checkpoint-6',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Checkpoint 6 chấm 23 tiêu chí bằng một lệnh, điều khiển Chrome thật qua playwright-core: feed cuộn hết đúng số bài, cổng đăng nhập và ?tiep=, token không lộ cho JavaScript, F5 và hai tab vẫn giữ phiên với đúng một refresh, token hết hạn sinh một refresh, đăng bài kèm ảnh qua form, không gửi trùng, bình luận HTML hiện chữ, API sập có nút Thử lại. Những lần trượt thật: phép kiểm khớp nhầm dòng chú thích, và script văng để sót tiến trình + 46 bài thử khi phá thử.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Checkpoint</span>
<h2>Twenty-three checks, one command, a real Chrome</h2>
<p class="lead">Checkpoints 1–5 spoke HTTP directly. The frontend can only be judged where it runs: in a browser, with StrictMode, cookies, two tabs and a slow API. Checkpoint 6 opens the Chrome installed on your machine, drives it like a user, and also reads the database to check what the screen claims. It runs Checkpoint 5 first, so one green line still means "everything from Chapter 1 to here works".</p>

<h3>What Checkpoint 6 checks, and why</h3>
${BANG_EN}
<p>Two design choices. <strong>It uses your installed Chrome</strong> through <code>playwright-core</code> (<code>channel: 'chrome'</code>, or <code>CHROME_PATH</code> for Chromium/Edge) instead of downloading a browser — one small dev dependency, no 150 MB download, and the real browser your users run. <strong>It never trusts the screen alone:</strong> "58 posts shown" is compared with <code>COUNT(*)</code>, "one post created" is checked in the database, the cookie flags are read from the browser context.</p>

<h3>The script</h3>
<pre><code class="language-js">${SCRIPT}</code></pre>

<h3>Running it</h3>
<p>Postgres and MinIO running, migrations, seed and <code>kho:chuan-bi</code> done, and <em>no</em> dev servers running (the script starts its own API with a 4-second access token, and Vite on 41811):</p>
<div class="out">${CHAY}</div>
<p>About two and a half minutes, most of it Checkpoint 5 and the deliberate waits (token expiry, reloads). The 58 posts are whatever is in your database plus the 23 the script adds; it deletes its own data at the end.</p>

<h3>Real failures on the way to 23/23</h3>
<p><strong>A check that read comments.</strong> The first run:</p>
<div class="out">${LAN1}</div>
<p>The rule "no storage in <code>src/</code>" matched the comment that <em>explains</em> why we do not use storage. Deleting the comment would have passed — and made the code worse. The check now looks for <em>use</em>: <code>localStorage.</code> followed by something, <code>dangerouslySetInnerHTML=</code>.</p>
<p><strong>A checkpoint that cleaned up only when it passed.</strong> To make sure the checkpoint catches the bug it was written for, we broke the code on purpose: <code>lamMoiToken</code> without the merge. It caught it — and then crashed:</p>
<div class="out">${PHA_THU}</div>
<p>Once the session was lost, the "write a post" step waited 30 seconds for a button that only logged-in users see, threw, and skipped the cleanup: two <code>tsx watch</code> processes holding the API port and 46 test posts were left behind after two runs. Every later run would fail on "port in use". The browser part is now wrapped in <code>try/catch</code>: a crash becomes one red line ("dừng giữa chừng: …") and the cleanup always runs. Same broken code, second time: 13 passed, 4 failed, nothing left behind.</p>
<p><strong>Clean clone.</strong> The checkpoint must work for someone who has only the repository:</p>
<div class="out">${CLONE}</div>
<p>And the production bundle that Chapter 9 will put in a container:</p>
<div class="out">${BUILD}</div>
<p>330 kB of JavaScript, 104 kB over the wire — React, React DOM, React Router and our code. The <code>import type</code> from the API added nothing, which the checkpoint confirms by looking for <code>loiSchema</code>.</p>

<h3>When a line is red</h3>
<ul>
<li><strong>"mở được Chrome" fails</strong> — install Google Chrome, or point <code>CHROME_PATH</code> at Chromium/Edge.</li>
<li><strong>"API trả lời … Vite chuyển tiếp" fails</strong> — a dev server is still running on 41811 or on the API port; stop it. On Windows, also check that <code>apps/web/.env.local</code> exists.</li>
<li><strong>Feed count differs from the database</strong> — a missing page (cursor not followed) or a duplicate (no merge by id, effect without abort). Open the page with DevTools and scroll.</li>
<li><strong>Refresh count 2, 2, 2</strong> — refresh not merged (lesson 6.2 §4). <strong>Two tabs fail</strong> — no cross-tab lock (§5).</li>
<li><strong>"requestSubmit() hai lần ⇒ 2 bài"</strong> — the ref guard is missing (lesson 6.3 §4).</li>
<li><strong>XSS line fails</strong> — something renders user content as HTML. Search for <code>innerHTML</code>.</li>
</ul>

<h3>Closing the chapter</h3>
<div class="out">${GIT}</div>
<p>Five commits on <code>ch6/frontend</code>, merged with <code>--no-ff</code> so <code>main</code> reads as one line per chapter, tag <code>ch6</code>. The README gained section 5e, "Decisions about the frontend", with the measurements behind each decision — the place a teammate (or an interviewer) reads first.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">backend still green</span><span class="lz-d">checkpoint-5 first</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">static checks</span><span class="lz-d">types, build, forbidden uses, no secrets in the bundle</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">real browser</span><span class="lz-d">drive Chrome like a user</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">cross-check</span><span class="lz-d">screen vs database vs network counts</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">always clean up</span><span class="lz-d">even when a step crashes</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Trap — a checkpoint you have never seen fail.</strong> A check that passes on correct code tells you nothing until you have seen it fail on broken code. Break the thing it protects, run it, and read the output: here that exercise found a crash and leftover processes that would have confused every later run.</p></div>

${spring(false, 'With a Spring backend this checkpoint needs only different start commands (<code>./mvnw spring-boot:run</code> instead of <code>npm run dev -w apps/api</code>) and the same contract. Spring projects often write this kind of test with Playwright for Java or Selenium; the questions asked are the same: does the browser keep the session, does it show server errors in the right place, does it render user content safely.', [
  ['sb-moc-22', 'Spring Boot — Project milestone 22: React ↔ Spring end to end'],
  ['sb-21-3-cors-loi', 'Spring Boot 21.3 — Errors and CORS end to end: ProblemDetail in a React form'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"How do you test a frontend end to end?"</strong> — Drive a real browser (Playwright, Cypress), act like the user, and assert on what the user sees <em>and</em> on the system's state (database, network) — not only on the DOM.</li>
<li><strong>"How do you make sure a test catches the bug it is meant for?"</strong> — Break the code on purpose (or use mutation testing) and watch it fail.</li>
<li><strong>"Your e2e test leaves data behind when it fails. Why is that bad?"</strong> — The next run starts from a different state: ports in use, counts off, flaky failures. Clean up in <code>finally</code>, label test data.</li>
<li><strong>"What do you check before shipping a frontend build?"</strong> — No secrets or server-only code in the bundle, size budget, types, lint, and that runtime configuration comes from the server, not <code>VITE_</code> variables.</li>
</ol>

<h3>🧪 Lab — Checkpoint 6 (60 minutes)</h3>
<div class="callout ok">
<ol>
<li>Add <code>playwright-core</code> as a root dev dependency (pinned). Write <code>scripts/checkpoint-6.mjs</code> section by section, running it after each.</li>
<li>Break three things, one at a time, and confirm each turns its own line red: remove the refresh merge; render comments with <code>dangerouslySetInnerHTML</code>; remove the ref guard in <code>VietBai</code>.</li>
<li>Make a step crash on purpose (wrong selector) and verify no process stays on 41811 or the API port and no <code>cp6-</code> post remains.</li>
<li>Clone the repository into a new folder, <code>npm ci</code>, copy the two env files, run the checkpoint.</li>
<li>Merge <code>ch6/frontend</code> with <code>--no-ff</code>, tag <code>ch6</code>, add the frontend decisions to the README.</li>
</ol>
<p><strong>Done when:</strong> 23/23 on a clean clone, and each of the three deliberate breaks is caught by its own line.</p>
<p><strong>Rubric (10):</strong> runs checkpoint 5 first (1) · static checks incl. secrets in bundle (2) · feed count vs database (1) · session checks incl. two tabs (2) · form + double submit + XSS (2) · cleanup on crash (1) · README + tag (1).</p>
</div>
<details><summary>Solution</summary>
<p>Commits <code>d820cd3</code> (checkpoint) and <code>43aa481</code> (try/catch + cleanup), merge <code>99a8bcd</code>, tag <code>ch6</code>. If <code>channel: 'chrome'</code> cannot find Chrome on Linux, it looks in <code>/opt/google/chrome</code>; with Chromium from a package manager set <code>CHROME_PATH=$(which chromium)</code>. The script still sleeps a fixed time in a few places (after reloads); Testing 7.3 shows how to replace sleeps with conditions — a good refactoring exercise once it is green.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">end-to-end (e2e)</span><span class="v">Test through the real UI in a real browser, against the real backend.</span></div>
  <div class="kv"><span class="k">playwright-core</span><span class="v">Playwright's library without bundled browsers; drives an installed Chrome.</span></div>
  <div class="kv"><span class="k">cross-check</span><span class="v">Assert on the screen and on an independent source (database, network log).</span></div>
  <div class="kv"><span class="k">break test</span><span class="v">Deliberately introducing the bug a check protects against, to see it fail.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>One command: Checkpoint 5, static checks on the web code and bundle, then Chrome driven like a user — 23 criteria.</li>
<li>The screen is cross-checked against the database and network counts.</li>
<li>First failure: a check matching a comment. Break test: caught the bug, but a crash skipped cleanup — fixed with try/catch.</li>
<li>Clean clone: 23/23. Bundle 330 kB (104 kB gzip), no server code.</li>
</ul>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Checkpoint</span>
<h2>Hai mươi ba phép kiểm, một lệnh, một Chrome thật</h2>
<p class="lead">Checkpoint 1–5 nói HTTP trực tiếp. Frontend chỉ chấm được ở nơi nó chạy: trong trình duyệt, với StrictMode, cookie, hai tab và một API chậm. Checkpoint 6 mở chính Chrome cài trên máy bạn, điều khiển nó như một người dùng, đồng thời đọc CSDL để đối chiếu những gì màn hình khẳng định. Nó chạy Checkpoint 5 trước, nên một dòng xanh vẫn nghĩa là "mọi thứ từ Chương 1 tới đây đều chạy".</p>

<h3>Checkpoint 6 kiểm gì, và vì sao</h3>
${BANG_VI}
<p>Hai lựa chọn thiết kế. <strong>Dùng Chrome đã cài sẵn</strong> qua <code>playwright-core</code> (<code>channel: 'chrome'</code>, hoặc <code>CHROME_PATH</code> cho Chromium/Edge) thay vì tải trình duyệt về — một phụ thuộc dev nhỏ, không tải 150 MB, và đúng trình duyệt người dùng của bạn chạy. <strong>Không bao giờ chỉ tin màn hình:</strong> "hiện 58 bài" được so với <code>COUNT(*)</code>, "tạo một bài" được kiểm trong CSDL, cờ của cookie đọc từ ngữ cảnh trình duyệt.</p>

<h3>Script</h3>
<pre><code class="language-js">${SCRIPT}</code></pre>

<h3>Chạy</h3>
<p>Postgres và MinIO đang chạy, đã migrate, seed và <code>kho:chuan-bi</code>, và <em>không</em> có máy chủ dev nào đang chạy (script tự bật API với access token 4 giây, và Vite ở 41811):</p>
<div class="out">${CHAY}</div>
<p>Khoảng hai phút rưỡi, phần lớn là Checkpoint 5 và những lần chờ có chủ đích (token hết hạn, tải lại). 58 bài là số có sẵn trong CSDL của bạn cộng 23 bài script thêm vào; cuối lượt nó tự xoá dữ liệu của mình.</p>

<h3>Những lần trượt thật trên đường tới 23/23</h3>
<p><strong>Một phép kiểm đọc cả chú thích.</strong> Lần chạy đầu:</p>
<div class="out">${LAN1}</div>
<p>Luật "không dùng storage trong <code>src/</code>" khớp đúng dòng chú thích <em>giải thích</em> vì sao ta không dùng storage. Xoá chú thích thì qua — và mã tệ hơn. Phép kiểm giờ tìm <em>cách dùng</em>: <code>localStorage.</code> kèm thứ gì đó phía sau, <code>dangerouslySetInnerHTML=</code>.</p>
<p><strong>Một checkpoint chỉ dọn khi đạt.</strong> Để chắc checkpoint bắt được đúng lỗi nó sinh ra để bắt, ta cố ý phá mã: <code>lamMoiToken</code> không gộp. Nó bắt được — rồi văng:</p>
<div class="out">${PHA_THU}</div>
<p>Khi phiên đã mất, bước "viết bài" chờ 30 giây một cái nút chỉ người đã đăng nhập mới thấy, ném lỗi, và bỏ qua phần dọn: sau hai lần chạy còn sót hai tiến trình <code>tsx watch</code> giữ cổng API và 46 bài thử. Mọi lần chạy sau sẽ trượt vì "cổng đang bị chiếm". Phần trình duyệt giờ được bọc <code>try/catch</code>: văng thì thành một dòng đỏ ("dừng giữa chừng: …") và phần dọn luôn chạy. Cùng mã hỏng, lần thứ hai: 13 đạt, 4 trượt, không sót gì.</p>
<p><strong>Clone sạch.</strong> Checkpoint phải chạy được với người chỉ có mỗi repo:</p>
<div class="out">${CLONE}</div>
<p>Và bundle production mà Chương 9 sẽ đưa vào container:</p>
<div class="out">${BUILD}</div>
<p>330 kB JavaScript, 104 kB khi truyền đi — React, React DOM, React Router và mã của ta. <code>import type</code> từ API không thêm byte nào, checkpoint xác nhận bằng cách tìm <code>loiSchema</code>.</p>

<h3>Khi một dòng đỏ</h3>
<ul>
<li><strong>"mở được Chrome" trượt</strong> — cài Google Chrome, hoặc trỏ <code>CHROME_PATH</code> tới Chromium/Edge.</li>
<li><strong>"API trả lời … Vite chuyển tiếp" trượt</strong> — còn máy chủ dev đang chạy ở 41811 hoặc cổng API; tắt đi. Trên Windows, kiểm thêm <code>apps/web/.env.local</code> đã có chưa.</li>
<li><strong>Số bài trên feed khác CSDL</strong> — thiếu trang (không đi theo cursor) hoặc trùng (không gộp theo id, effect không abort). Mở trang với DevTools rồi cuộn.</li>
<li><strong>Số refresh 2, 2, 2</strong> — refresh chưa gộp (bài 6.2 mục 4). <strong>Hai tab trượt</strong> — chưa có khoá giữa các tab (mục 5).</li>
<li><strong>"requestSubmit() hai lần ⇒ 2 bài"</strong> — thiếu chặn bằng ref (bài 6.3 mục 4).</li>
<li><strong>Dòng XSS trượt</strong> — có chỗ hiện nội dung người dùng dạng HTML. Tìm <code>innerHTML</code>.</li>
</ul>

<h3>Đóng chương</h3>
<div class="out">${GIT}</div>
<p>Năm commit trên <code>ch6/frontend</code>, merge bằng <code>--no-ff</code> để <code>main</code> đọc thành mỗi chương một dòng, tag <code>ch6</code>. README thêm mục 5e "Quyết định về frontend" kèm số đo đứng sau mỗi quyết định — chỗ đồng đội (hay người phỏng vấn) đọc đầu tiên.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">backend vẫn xanh</span><span class="lz-d">checkpoint-5 trước</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">kiểm tĩnh</span><span class="lz-d">kiểu, build, cách dùng bị cấm, không bí mật trong bundle</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">trình duyệt thật</span><span class="lz-d">điều khiển Chrome như người dùng</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">đối chiếu</span><span class="lz-d">màn hình vs CSDL vs số request mạng</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">luôn dọn</span><span class="lz-d">kể cả khi một bước văng</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — checkpoint chưa từng thấy trượt.</strong> Một phép kiểm qua trên mã đúng chưa nói lên gì cho tới khi bạn thấy nó trượt trên mã hỏng. Phá đúng thứ nó bảo vệ, chạy, và đọc output: ở đây việc đó lộ ra một cú văng và tiến trình bị bỏ sót, thứ sẽ làm rối mọi lần chạy sau.</p></div>

${spring(false, 'Với backend Spring, checkpoint này chỉ cần đổi lệnh khởi động (<code>./mvnw spring-boot:run</code> thay cho <code>npm run dev -w apps/api</code>) và giữ cùng hợp đồng. Dự án Spring hay viết loại test này bằng Playwright cho Java hoặc Selenium; câu hỏi vẫn vậy: trình duyệt có giữ phiên, có hiện lỗi server đúng chỗ, có hiện nội dung người dùng an toàn không.', [
  ['sb-moc-22', 'Spring Boot — Mốc dự án 22: React ↔ Spring trọn vẹn'],
  ['sb-21-3-cors-loi', 'Spring Boot 21.3 — Lỗi và CORS trọn tuyến: ProblemDetail trong form React'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Bạn test frontend đầu-cuối thế nào?"</strong> — Điều khiển trình duyệt thật (Playwright, Cypress), làm như người dùng, và kiểm cả thứ người dùng thấy <em>lẫn</em> trạng thái hệ thống (CSDL, mạng) — không chỉ DOM.</li>
<li><strong>"Làm sao chắc một test bắt được đúng lỗi nó nhắm tới?"</strong> — Cố ý phá mã (hoặc dùng mutation testing) và nhìn nó trượt.</li>
<li><strong>"Test e2e của bạn trượt thì để sót dữ liệu. Sao lại tệ?"</strong> — Lần chạy sau bắt đầu từ trạng thái khác: cổng bị chiếm, số đếm lệch, trượt chập chờn. Dọn trong <code>finally</code>, đánh dấu dữ liệu thử.</li>
<li><strong>"Trước khi phát hành một bản build frontend, bạn kiểm gì?"</strong> — Không bí mật hay mã chỉ dành cho server trong bundle, ngân sách kích thước, kiểu, lint, và cấu hình lúc chạy đến từ server chứ không từ biến <code>VITE_</code>.</li>
</ol>

<h3>🧪 Lab — Checkpoint 6 (60 phút)</h3>
<div class="callout ok">
<ol>
<li>Thêm <code>playwright-core</code> làm dev dependency ở gốc (ghim phiên bản). Viết <code>scripts/checkpoint-6.mjs</code> từng mục, chạy sau mỗi mục.</li>
<li>Phá ba thứ, mỗi lần một thứ, xác nhận mỗi thứ làm đỏ đúng dòng của nó: bỏ gộp refresh; hiện bình luận bằng <code>dangerouslySetInnerHTML</code>; bỏ chặn bằng ref trong <code>VietBai</code>.</li>
<li>Cố ý làm một bước văng (selector sai) và kiểm không còn tiến trình nào ở 41811 hay cổng API, không còn bài <code>cp6-</code> nào.</li>
<li>Clone repo sang thư mục mới, <code>npm ci</code>, chép hai tệp env, chạy checkpoint.</li>
<li>Merge <code>ch6/frontend</code> bằng <code>--no-ff</code>, tag <code>ch6</code>, thêm các quyết định frontend vào README.</li>
</ol>
<p><strong>Xong khi:</strong> 23/23 trên clone sạch, và mỗi lần phá trong ba lần phá đều bị đúng dòng của nó bắt.</p>
<p><strong>Thang điểm (10):</strong> chạy checkpoint 5 trước (1) · kiểm tĩnh kể cả bí mật trong bundle (2) · số bài feed so CSDL (1) · kiểm phiên kể cả hai tab (2) · form + gửi trùng + XSS (2) · dọn khi văng (1) · README + tag (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Commit <code>d820cd3</code> (checkpoint) và <code>43aa481</code> (try/catch + dọn), merge <code>99a8bcd</code>, tag <code>ch6</code>. Nếu <code>channel: 'chrome'</code> không tìm thấy Chrome trên Linux, nó tìm ở <code>/opt/google/chrome</code>; dùng Chromium cài từ trình quản lý gói thì đặt <code>CHROME_PATH=$(which chromium)</code>. Script vẫn còn vài chỗ ngủ cố định (sau khi tải lại); Testing 7.3 chỉ cách thay ngủ bằng điều kiện — bài tập tái cấu trúc hay khi đã xanh.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">đầu-cuối (e2e)</span><span class="v">Test qua giao diện thật trong trình duyệt thật, với backend thật.</span></div>
  <div class="kv"><span class="k">playwright-core</span><span class="v">Thư viện Playwright không kèm trình duyệt; điều khiển Chrome đã cài.</span></div>
  <div class="kv"><span class="k">đối chiếu</span><span class="v">Kiểm cả màn hình lẫn một nguồn độc lập (CSDL, log mạng).</span></div>
  <div class="kv"><span class="k">phá thử</span><span class="v">Cố ý đưa vào đúng lỗi mà phép kiểm canh, để thấy nó trượt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một lệnh: Checkpoint 5, kiểm tĩnh mã web và bundle, rồi Chrome được điều khiển như người dùng — 23 tiêu chí.</li>
<li>Màn hình được đối chiếu với CSDL và số request mạng.</li>
<li>Trượt đầu tiên: phép kiểm khớp chú thích. Phá thử: bắt được lỗi, nhưng cú văng bỏ qua phần dọn — sửa bằng try/catch.</li>
<li>Clone sạch: 23/23. Bundle 330 kB (gzip 104 kB), không có mã server.</li>
</ul>
${THE}
</div>
`,
};
