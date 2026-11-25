/**
 * 7.4 — Checkpoint 7: hai tab trình duyệt thấy cùng một bình luận ngay lập tức (soạn 24/11/2026, agent fsp).
 * Output THẬT: scripts/checkpoint-7.mjs (16 tiêu chí) — hai context Chrome 150 (An, Bình) qua playwright-core 1.65.1 + socket.io-client
 * 4.8.4 từ Node, gọi checkpoint-6 (→ 5 → … → 1). Repo chiase: a90feae (checkpoint), 1c7d691 (sửa đua), merge main 942cbec, tag ch7.
 * Đường tới 16/16 (24/11): lần 1 trên repo 16/16; phá thử 3 lỗi ⇒ bắt 2, LỌT "tắt treo" (bước 6 đo tiến trình npm, mà tsx watch tự giết con)
 * ⇒ đo bằng socket ⇒ vẫn lọt ⇒ bật API KHÔNG watch, SIGTERM đúng tiến trình ⇒ bắt được ("VẪN CHẠY sau 4 s"); clone sạch + npm ci (13,7 s)
 * lần 1: 15/16 — "An 5 · Bình 4 · CSDL 5": GET bài sau khi nối lại (API vừa lên, chậm) về SAU một sự kiện sống ⇒ ghi đè số mới ⇒
 * hoiLaiBai() hỏi lại nếu có sự kiện chen giữa ⇒ clone lần 2, 3: 16/16. vite build: JS 375,32 kB (gzip 118,26) — Chương 6: 330,59 (104,44).
 */
import { lienKet, spring } from '../_chung.mjs';

const SCRIPT = `// Checkpoint 7 — tự chấm phần realtime bằng HAI trình duyệt thật (hai người: An và Bình) + socket.io-client từ Node:
// bình luận ở tab A hiện ở tab B dưới 1 giây, đúng một lần, số đếm khớp CSDL; lượt thích cập nhật sống;
// API khởi động lại (như deploy) ⇒ hai tab tự nối lại, KHÔNG mất bình luận đăng lúc đang mất kết nối — kể cả khi
// access token đã hết hạn đúng lúc bắt tay lại; socket token sai / origin lạ / vào phòng bài nháp / lũ 'bai:xem' bị chặn;
// SIGTERM khi đang có socket nối thì API vẫn tắt ngay.
// Cần: Postgres + MinIO đang chạy, đã migrate + seed + kho:chuan-bi; Google Chrome (hoặc CHROME_PATH).
// TẮT máy chủ dev đang chạy (API + Vite) trước — script tự bật.  Chạy ở gốc repo:  node scripts/checkpoint-7.mjs
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { io } from 'socket.io-client';
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

console.log('== 0. Checkpoint 6 vẫn đạt');
const cp6 = spawnSync(process.execPath, ['scripts/checkpoint-6.mjs'], { encoding: 'utf8' });
kiem(\`checkpoint-6: \${cp6.stdout.trim().split('\\n').at(-1)}\`, cp6.status === 0);

console.log('== 1. Mã nguồn: hợp đồng, một socket, proxy ws, tắt êm');
const tc = spawnSync('npm', ['run', 'typecheck'], { encoding: 'utf8', shell: laWin });
kiem('typecheck cả API lẫn web (web dùng chung kiểu sự kiện với API)', tc.status === 0);
const hopDong = readFileSync('apps/api/src/realtime/hop-dong.ts', 'utf8');
kiem(
  'realtime/hop-dong.ts chỉ có kiểu, KHÔNG import gì (web kiểm kiểu tệp này — import mã máy chủ là kéo cả API vào)',
  !/^\\s*import\\s/m.test(hopDong),
);
const vite = readFileSync('apps/web/vite.config.ts', 'utf8');
kiem("vite.config.ts chuyển tiếp '/socket.io' với ws: true", /'\\/socket\\.io'[^}]*ws:\\s*true/.test(vite));
const sk = readFileSync('apps/web/src/realtime/socket.ts', 'utf8');
kiem(
  'web tạo đúng MỘT socket, nối về chính origin của trang (io({ … }) không có URL), token đưa qua auth là HÀM',
  /\\bio\\(\\{/.test(sk) &amp;&amp; !/\\bio\\(\\s*['"\`]/.test(sk) &amp;&amp; /auth:\\s*\\(/.test(sk),
);

console.log('== 2. Bật API (access token sống 4 s) + Vite');
const envApi = docEnv('apps/api/.env');
const cong = envApi.PORT ?? '41810';
const GOC_HTTP = \`http://localhost:\${cong}\`;
const GOC = \`\${GOC_HTTP}/api\`;
const WEB = 'http://localhost:41811';
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
const tat = (p) =&gt; {
  if (!p || p.exitCode !== null) return;
  if (laWin) spawnSync('taskkill', ['/pid', String(p.pid), '/T', '/F']);
  else
    try {
      process.kill(-p.pid, 'SIGTERM');
    } catch {}
};
let api = bat('apps/api', { ACCESS_TTL_S: '4', AUTH_RATE_LIMIT: '1000' });
const web = bat('apps/web');
let trinhDuyet;
const socketCuaToi = [];
const nhan = \`cp7-\${Date.now().toString(36)}\`;
const ketThuc = async () =&gt; {
  socketCuaToi.forEach((s) =&gt; s.close());
  await trinhDuyet?.close().catch(() =&gt; {});
  await sql(\`DELETE FROM posts WHERE title LIKE $1 || '%'\`, [nhan]).catch(() =&gt; {});
  tat(api);
  tat(web);
  await db.end().catch(() =&gt; {});
  console.log(\`\\nKẾT QUẢ: \${dat} đạt, \${truot} trượt\`);
  process.exit(truot === 0 ? 0 : 1);
};
const song = async (url, lan = 40) =&gt; {
  for (let i = 0; i &lt; lan; i++) {
    try {
      if ((await fetch(url, { signal: AbortSignal.timeout(2000) })).ok) return true;
    } catch {}
    await ngu(250);
  }
  return false;
};
const apiSong = (await song(\`\${GOC}/health\`, 160)) &amp;&amp; (await song(\`\${WEB}/api/health\`, 160));
kiem(\`API \${GOC}/health và Vite \${WEB}/api/health trả lời\`, apiSong);
if (!apiSong) {
  console.log('  ⇒ Cổng đang bị chiếm? Tắt máy chủ dev cũ rồi chạy lại.');
  await ketThuc();
}

const J = { 'content-type': 'application/json' };
const matKhau = process.env.SEED_PASSWORD ?? 'chiase-mau-2026';
const dangNhapApi = async (email) =&gt;
  (
    await (
      await fetch(\`\${GOC}/auth/login\`, {
        method: 'POST',
        headers: J,
        body: JSON.stringify({ email, password: matKhau }),
      })
    ).json()
  ).accessToken;
const taoBai = async (tk, status) =&gt;
  (
    await (
      await fetch(\`\${GOC}/posts\`, {
        method: 'POST',
        headers: { ...J, authorization: \`Bearer \${tk}\` },
        body: JSON.stringify({ title: \`\${nhan} \${status}\`, body: 'bài để chấm realtime', status }),
      })
    ).json()
  ).id;
const binhLuanApi = (tk, postId, body) =&gt;
  fetch(\`\${GOC}/posts/\${postId}/comments\`, {
    method: 'POST',
    headers: { ...J, authorization: \`Bearer \${tk}\` },
    body: JSON.stringify({ body }),
  });
const tokAn = await dangNhapApi('an@chiase.dev');
const baiCongKhai = await taoBai(tokAn, 'published');
const baiNhap = await taoBai(tokAn, 'draft');

try {
  console.log('== 3. Socket từ Node: bắt tay, origin, phòng, lũ sự kiện');
  const noi = (opts) =&gt;
    new Promise((r) =&gt; {
      const s = io(GOC_HTTP, { transports: ['websocket'], reconnection: false, ...opts });
      socketCuaToi.push(s);
      s.on('connect', () =&gt; r({ s, ok: true }));
      s.on('connect_error', (e) =&gt; r({ s, ok: false, code: e.data?.code ?? e.message }));
    });
  const khach = await noi({});
  const rac = await noi({ auth: { token: 'khong-phai-jwt' } });
  const la = await noi({ extraHeaders: { origin: 'http://trang-la.example' } });
  kiem(
    \`khách nối được; token rác ⇒ \${rac.code}; Origin lạ ⇒ \${la.ok ? 'NỐI ĐƯỢC' : 'bị từ chối'}\`,
    khach.ok &amp;&amp; !rac.ok &amp;&amp; rac.code === 'TOKEN_KHONG_HOP_LE' &amp;&amp; !la.ok,
  );
  const binhNode = await noi({ auth: { token: await dangNhapApi('binh@chiase.dev') } });
  const anNode = await noi({ auth: { token: tokAn } });
  const vao = async (x) =&gt;
    (
      await x.s
        .timeout(3000)
        .emitWithAck('bai:xem', baiNhap)
        .catch(() =&gt; ({ ok: false, code: 'KHONG_DAP' }))
    ).ok;
  const [k1, b1, a1] = [await vao(khach), await vao(binhNode), await vao(anNode)];
  kiem(
    \`vào phòng bài NHÁP của An: khách \${k1 ? 'VÀO' : 'bị chặn'}, Bình \${b1 ? 'VÀO' : 'bị chặn'}, An \${a1 ? 'vào' : 'BỊ CHẶN'}\`,
    !k1 &amp;&amp; !b1 &amp;&amp; a1,
  );
  const lu = await noi({});
  let biNgat = false;
  lu.s.on('disconnect', () =&gt; (biNgat = true));
  for (let i = 0; i &lt; 200; i++) lu.s.emit('bai:xem', crypto.randomUUID(), () =&gt; {});
  await ngu(1000);
  kiem(
    \`200 lần 'bai:xem' liên tiếp từ một socket ⇒ máy chủ \${biNgat ? 'ngắt socket' : 'KHÔNG làm gì'}\`,
    biNgat,
  );
  socketCuaToi.forEach((s) =&gt; s.close());
  socketCuaToi.length = 0;

  console.log('== 4. Hai người, hai trình duyệt thật');
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
  const moNguoi = async (email) =&gt; {
    const ctx = await trinhDuyet.newContext();
    const p = await ctx.newPage();
    await p.goto(\`\${WEB}/dang-nhap\`);
    await p.fill('input[name=email]', email);
    await p.fill('input[name=password]', matKhau);
    await p.click('button:has-text("Đăng nhập")');
    await p.waitForSelector('header :text("Đăng xuất")', { timeout: 8000 });
    // Đi tới bài bằng điều hướng TRONG ứng dụng (không tải lại trang ⇒ không phải refresh lại token)
    await p.evaluate((u) =&gt; {
      history.pushState({}, '', u);
      dispatchEvent(new PopStateEvent('popstate'));
    }, \`/bai/\${baiCongKhai}\`);
    await p.waitForSelector('h2:has-text("Bình luận")', { timeout: 8000 });
    return p;
  };
  const pAn = await moNguoi('an@chiase.dev');
  const pBinh = await moNguoi('binh@chiase.dev');
  await ngu(800); // socket đã nối + đã vào phòng
  const demTrang = async (p) =&gt;
    Number(/\\((\\d+)\\)/.exec(await p.locator('h2:has-text("Bình luận")').innerText())?.[1]);
  const demCsdl = async () =&gt;
    (await sql('SELECT count(*)::int AS n FROM comments WHERE post_id = $1', [baiCongKhai]))[0].n;

  const tre = [];
  let lanHien = true;
  for (let i = 1; i &lt;= 3; i++) {
    const nd = \`\${nhan} An nói lần \${i}\`;
    await pAn.fill('textarea[name=body]', nd);
    const t0 = Date.now();
    await pAn.click('button:has-text("Gửi bình luận")');
    const thay = await pBinh
      .waitForSelector(\`.binh-luan :text("\${nd}")\`, { timeout: 5000 })
      .then(() =&gt; true)
      .catch(() =&gt; false);
    tre.push(thay ? Date.now() - t0 : Infinity);
    await ngu(300);
    if ((await pAn.locator(\`.binh-luan :text("\${nd}")\`).count()) !== 1) lanHien = false;
  }
  kiem(
    \`An bình luận 3 lần ⇒ Bình thấy sau \${tre.map((t) =&gt; (t === Infinity ? '∞' : \`\${t} ms\`)).join(', ')} (cần &lt; 1000 ms)\`,
    tre.every((t) =&gt; t &lt; 1000),
  );
  const [dA, dB, dC] = [await demTrang(pAn), await demTrang(pBinh), await demCsdl()];
  kiem(
    \`mỗi bình luận hiện ĐÚNG một lần ở trang An; số đếm An \${dA} · Bình \${dB} · CSDL \${dC}\`,
    lanHien &amp;&amp; dA === dC &amp;&amp; dB === dC,
  );

  const truocThich = await pBinh.locator('.thich').innerText();
  const t1 = Date.now();
  await pAn.click('button.thich');
  const doiThich = await pBinh
    .waitForFunction((t) =&gt; document.querySelector('.thich')?.textContent !== t, truocThich, {
      timeout: 3000,
    })
    .then(() =&gt; true)
    .catch(() =&gt; false);
  const [{ n: soThich }] = await sql('SELECT count(*)::int AS n FROM likes WHERE post_id = $1', [
    baiCongKhai,
  ]);
  kiem(
    \`An bấm Thích ⇒ trang Bình đổi sau \${doiThich ? \`\${Date.now() - t1} ms\` : '&gt; 3 s'}, hiện "\${(await pBinh.locator('.thich').innerText()).trim()}", CSDL \${soThich}\`,
    doiThich &amp;&amp; (await pBinh.locator('.thich').innerText()).includes(String(soThich)),
  );

  console.log('== 5. API khởi động lại (như deploy) — token của cả hai tab đã hết hạn');
  await ngu(4500); // access token sống 4 s ⇒ lúc bắt tay lại, token trong bộ nhớ hai tab đã hết hạn
  tat(api);
  await ngu(1500);
  const banner = await pBinh
    .locator('.ket-noi')
    .innerText()
    .catch(() =&gt; '');
  kiem(\`lúc API tắt, trang báo trạng thái: "\${banner.slice(0, 40)}…"\`, banner.length &gt; 0);
  api = bat('apps/api', { ACCESS_TTL_S: '4', AUTH_RATE_LIMIT: '1000' });
  await song(\`\${GOC}/health\`, 160);
  const ndLo = \`\${nhan} đăng lúc hai tab chưa kịp nối lại\`;
  const rLo = await binhLuanApi(await dangNhapApi('binh@chiase.dev'), baiCongKhai, ndLo);
  const thayLo = await Promise.all(
    [pAn, pBinh].map((p) =&gt;
      p
        .waitForSelector(\`.binh-luan :text("\${ndLo}")\`, { timeout: 12000 })
        .then(() =&gt; true)
        .catch(() =&gt; false),
    ),
  );
  kiem(
    \`bình luận đăng (\${rLo.status}) ngay khi API vừa lên, trước khi tab nối lại ⇒ An \${thayLo[0] ? 'thấy' : 'KHÔNG thấy'}, Bình \${thayLo[1] ? 'thấy' : 'KHÔNG thấy'}\`,
    thayLo.every(Boolean),
  );
  await ngu(500);
  const ndSau = \`\${nhan} sau khi đã nối lại\`;
  await binhLuanApi(await dangNhapApi('an@chiase.dev'), baiCongKhai, ndSau);
  const thaySau = await pBinh
    .waitForSelector(\`.binh-luan :text("\${ndSau}")\`, { timeout: 3000 })
    .then(() =&gt; true)
    .catch(() =&gt; false);
  const [eA, eB, eC] = [await demTrang(pAn), await demTrang(pBinh), await demCsdl()];
  kiem(
    \`sau khi nối lại realtime chạy tiếp (Bình \${thaySau ? 'thấy' : 'KHÔNG thấy'} bình luận mới), không còn thanh báo, số đếm An \${eA} · Bình \${eB} · CSDL \${eC}\`,
    thaySau &amp;&amp; (await pBinh.locator('.ket-noi').count()) === 0 &amp;&amp; eA === eC &amp;&amp; eB === eC,
  );

  console.log('== 6. Tắt êm khi còn socket nối');
  // Bật MỘT API như production (không "tsx watch": watch tự giết tiến trình con khi nhận SIGTERM ⇒ che mất chỗ treo —
  // phá thử lần đầu lọt qua chính vì vậy), nối một socket, gửi SIGTERM ĐÚNG tiến trình đó, đo nó có thoát không.
  tat(api);
  await ngu(1000);
  const apiThat = spawn(
    process.execPath,
    ['../../node_modules/tsx/dist/cli.mjs', '--env-file-if-exists=.env', 'src/server.ts'],
    {
      cwd: 'apps/api',
      stdio: 'ignore',
    },
  );
  await song(\`\${GOC}/health\`, 160);
  const canh = await noi({});
  const t2 = Date.now();
  apiThat.kill('SIGTERM');
  const thoat = await new Promise((r) =&gt; {
    apiThat.once('exit', () =&gt; r(true));
    setTimeout(() =&gt; r(false), 4000);
  });
  if (!thoat) apiThat.kill('SIGKILL');
  kiem(
    \`SIGTERM khi đang có socket nối ⇒ \${thoat ? \`API thoát sau \${Date.now() - t2} ms\` : 'API VẪN CHẠY sau 4 s — treo chờ WebSocket (quên io.close?)'}\`,
    canh.ok &amp;&amp; thoat,
  );
} catch (e) {
  // Một bước văng ⇒ ghi trượt rồi VẪN dọn (bài học của checkpoint-6)
  kiem(\`dừng giữa chừng: \${String(e.message).split('\\n')[0]}\`, false);
}
await ketThuc();`;

const LAN1 = `== 0. Checkpoint 6 vẫn đạt
  ✔ checkpoint-6: KẾT QUẢ: 23 đạt, 0 trượt
== 1. Mã nguồn: hợp đồng, một socket, proxy ws, tắt êm
  ✔ typecheck cả API lẫn web (web dùng chung kiểu sự kiện với API)
  ✔ realtime/hop-dong.ts chỉ có kiểu, KHÔNG import gì (web kiểm kiểu tệp này — import mã máy chủ là kéo cả API vào)
  ✔ vite.config.ts chuyển tiếp '/socket.io' với ws: true
  ✔ web tạo đúng MỘT socket, nối về chính origin của trang (io({ … }) không có URL), token đưa qua auth là HÀM
== 2. Bật API (access token sống 4 s) + Vite
  ✔ API http://localhost:41815/api/health và Vite http://localhost:41811/api/health trả lời
== 3. Socket từ Node: bắt tay, origin, phòng, lũ sự kiện
  ✔ khách nối được; token rác ⇒ TOKEN_KHONG_HOP_LE; Origin lạ ⇒ bị từ chối
  ✔ vào phòng bài NHÁP của An: khách bị chặn, Bình bị chặn, An vào
  ✔ 200 lần 'bai:xem' liên tiếp từ một socket ⇒ máy chủ ngắt socket
== 4. Hai người, hai trình duyệt thật
  ✔ An bình luận 3 lần ⇒ Bình thấy sau 80 ms, 91 ms, 142 ms (cần &lt; 1000 ms)
  ✔ mỗi bình luận hiện ĐÚNG một lần ở trang An; số đếm An 3 · Bình 3 · CSDL 3
  ✔ An bấm Thích ⇒ trang Bình đổi sau 174 ms, hiện "♥ 1", CSDL 1
== 5. API khởi động lại (như deploy) — token của cả hai tab đã hết hạn
  ✔ lúc API tắt, trang báo trạng thái: "Mất kết nối trực tiếp — đang thử nối lại…"
  ✔ bình luận đăng (201) ngay khi API vừa lên, trước khi tab nối lại ⇒ An thấy, Bình thấy
  ✔ sau khi nối lại realtime chạy tiếp (Bình thấy bình luận mới), không còn thanh báo, số đếm An 5 · Bình 5 · CSDL 5
== 6. Tắt êm khi còn socket nối
  ✔ SIGTERM khi hai tab đang nối ⇒ API thoát sau 53 ms

KẾT QUẢ: 16 đạt, 0 trượt`;

const PHA_THU = `--- PHÁ THỬ 1: bỏ bắt kịp (khiVaoLai) + bỏ xử lý TOKEN_HET_HAN + trả lại server.close() — bước 6 lúc đó đo "tiến trình npm đã thoát"
  ✘ checkpoint-6: KẾT QUẢ: 22 đạt, 1 trượt
  ✘ bình luận đăng (201) ngay khi API vừa lên, trước khi tab nối lại ⇒ An KHÔNG thấy, Bình KHÔNG thấy
  ✘ sau khi nối lại realtime chạy tiếp (Bình KHÔNG thấy bình luận mới), không còn thanh báo, số đếm An 3 · Bình 3 · CSDL 5
  ✔ SIGTERM khi hai tab đang nối ⇒ API thoát sau 48 ms
KẾT QUẢ: 13 đạt, 3 trượt

--- PHÁ THỬ 2: chỉ trả lại server.close() — bước 6 đo bằng API chạy KHÔNG watch, SIGTERM đúng tiến trình đó
  ✘ checkpoint-6: KẾT QUẢ: 22 đạt, 1 trượt
  ✘ SIGTERM khi đang có socket nối ⇒ API VẪN CHẠY sau 4 s — treo chờ WebSocket (quên io.close?)
KẾT QUẢ: 14 đạt, 2 trượt`;

const CLONE_LAN1 = `== 0. Checkpoint 6 vẫn đạt
  ✔ checkpoint-6: KẾT QUẢ: 23 đạt, 0 trượt
== 1. Mã nguồn: hợp đồng, một socket, proxy ws, tắt êm
  ✔ typecheck cả API lẫn web (web dùng chung kiểu sự kiện với API)
  ✔ realtime/hop-dong.ts chỉ có kiểu, KHÔNG import gì (web kiểm kiểu tệp này — import mã máy chủ là kéo cả API vào)
  ✔ vite.config.ts chuyển tiếp '/socket.io' với ws: true
  ✔ web tạo đúng MỘT socket, nối về chính origin của trang (io({ … }) không có URL), token đưa qua auth là HÀM
== 2. Bật API (access token sống 4 s) + Vite
  ✔ API http://localhost:41815/api/health và Vite http://localhost:41811/api/health trả lời
== 3. Socket từ Node: bắt tay, origin, phòng, lũ sự kiện
  ✔ khách nối được; token rác ⇒ TOKEN_KHONG_HOP_LE; Origin lạ ⇒ bị từ chối
  ✔ vào phòng bài NHÁP của An: khách bị chặn, Bình bị chặn, An vào
  ✔ 200 lần 'bai:xem' liên tiếp từ một socket ⇒ máy chủ ngắt socket
== 4. Hai người, hai trình duyệt thật
  ✔ An bình luận 3 lần ⇒ Bình thấy sau 97 ms, 87 ms, 80 ms (cần &lt; 1000 ms)
  ✔ mỗi bình luận hiện ĐÚNG một lần ở trang An; số đếm An 3 · Bình 3 · CSDL 3
  ✔ An bấm Thích ⇒ trang Bình đổi sau 222 ms, hiện "♥ 1", CSDL 1
== 5. API khởi động lại (như deploy) — token của cả hai tab đã hết hạn
  ✔ lúc API tắt, trang báo trạng thái: "Mất kết nối trực tiếp — đang thử nối lại…"
  ✔ bình luận đăng (201) ngay khi API vừa lên, trước khi tab nối lại ⇒ An thấy, Bình thấy
  ✘ sau khi nối lại realtime chạy tiếp (Bình thấy bình luận mới), không còn thanh báo, số đếm An 5 · Bình 4 · CSDL 5
== 6. Tắt êm khi còn socket nối
  ✔ SIGTERM khi đang có socket nối ⇒ API thoát sau 66 ms

KẾT QUẢ: 15 đạt, 1 trượt`;

const HOI_LAI = `  // ẢNH CHỤP CŨ GHI ĐÈ SỐ MỚI (bài 7.4 — checkpoint trên clone sạch trượt 1 lần: Bình 4, CSDL 5): API vừa khởi động nên
  // GET /posts/:id chậm; trong lúc nó bay, một bình luận MỚI tới qua socket (+1 ⇒ 5); rồi phản hồi GET — đọc TRƯỚC bình
  // luận đó — về sau và setBai(4). Luật: có sự kiện sống tới trong lúc đang hỏi ⇒ ảnh chụp có thể cũ ⇒ hỏi lại.
  async function hoiLaiBai() {
    for (let lan = 0; lan &lt; 3; lan++) {
      coSuKienMoi.current = false;
      const b = await api&lt;Bai&gt;(\`/posts/\${id}\`).catch(() =&gt; null);
      if (!b) return;
      if (!coSuKienMoi.current) return setBai(b);
    }
    // Ba lần liền đều bị sự kiện chen ngang (bài đang rất sôi động): giữ số đang có, sự kiện sống đang cập nhật nó.
  }`;

const CLONE_LAN3 = `== 0. Checkpoint 6 vẫn đạt
  ✔ checkpoint-6: KẾT QUẢ: 23 đạt, 0 trượt
== 1. Mã nguồn: hợp đồng, một socket, proxy ws, tắt êm
  ✔ typecheck cả API lẫn web (web dùng chung kiểu sự kiện với API)
  ✔ realtime/hop-dong.ts chỉ có kiểu, KHÔNG import gì (web kiểm kiểu tệp này — import mã máy chủ là kéo cả API vào)
  ✔ vite.config.ts chuyển tiếp '/socket.io' với ws: true
  ✔ web tạo đúng MỘT socket, nối về chính origin của trang (io({ … }) không có URL), token đưa qua auth là HÀM
== 2. Bật API (access token sống 4 s) + Vite
  ✔ API http://localhost:41815/api/health và Vite http://localhost:41811/api/health trả lời
== 3. Socket từ Node: bắt tay, origin, phòng, lũ sự kiện
  ✔ khách nối được; token rác ⇒ TOKEN_KHONG_HOP_LE; Origin lạ ⇒ bị từ chối
  ✔ vào phòng bài NHÁP của An: khách bị chặn, Bình bị chặn, An vào
  ✔ 200 lần 'bai:xem' liên tiếp từ một socket ⇒ máy chủ ngắt socket
== 4. Hai người, hai trình duyệt thật
  ✔ An bình luận 3 lần ⇒ Bình thấy sau 69 ms, 91 ms, 138 ms (cần &lt; 1000 ms)
  ✔ mỗi bình luận hiện ĐÚNG một lần ở trang An; số đếm An 3 · Bình 3 · CSDL 3
  ✔ An bấm Thích ⇒ trang Bình đổi sau 154 ms, hiện "♥ 1", CSDL 1
== 5. API khởi động lại (như deploy) — token của cả hai tab đã hết hạn
  ✔ lúc API tắt, trang báo trạng thái: "Mất kết nối trực tiếp — đang thử nối lại…"
  ✔ bình luận đăng (201) ngay khi API vừa lên, trước khi tab nối lại ⇒ An thấy, Bình thấy
  ✔ sau khi nối lại realtime chạy tiếp (Bình thấy bình luận mới), không còn thanh báo, số đếm An 5 · Bình 5 · CSDL 5
== 6. Tắt êm khi còn socket nối
  ✔ SIGTERM khi đang có socket nối ⇒ API thoát sau 68 ms

KẾT QUẢ: 16 đạt, 0 trượt`;

const BUILD = `dist/index.html                   0.45 kB │ gzip:   0.29 kB
dist/assets/index-TZ1GqKq9.css    1.48 kB │ gzip:   0.66 kB
dist/assets/index-C6rmR8vW.js   375.32 kB │ gzip: 118.26 kB
✓ built in 381ms`;

const GIT = `*   942cbec Merge ch7/realtime: Checkpoint 7 đạt 16/16
|\\  
| * 99aee22 docs: README — quyết định realtime Chương 7
| * 1c7d691 fix(web): ảnh chụp GET bài cũ ghi đè số đếm mới sau khi nối lại — có sự kiện sống chen giữa thì hỏi lại (checkpoint-7 trên clone sạch bắt được)
| * a90feae test: checkpoint-7 (16 tiêu chí: hai trình duyệt, khởi động lại khi token hết hạn, origin/phòng/lũ sự kiện, tắt êm đo trên API không watch) — gọi checkpoint-6
| * 8260713 feat(realtime): trạng thái kết nối, bắt kịp sau nối lại (vào phòng rồi mới hỏi HTTP), tự refresh khi bắt tay báo TOKEN_HET_HAN, Redis adapter tuỳ chọn cho nhiều instance
| * 0498e68 feat(realtime): phòng theo bài + xác thực bắt tay + kiểm Origin + giới hạn; lượt thích (bảng likes, PUT/DELETE idempotent, phát gộp số tuyệt đối); web: useBaiSong, gộp bình luận theo id, nút Thích, chờ danh tính trước khi tải bài
| * 7748985 feat(realtime): Socket.IO gắn cùng máy chủ HTTP, phát binh-luan:moi sau khi ghi; proxy Vite ws; tắt êm bằng io.close()
|/  
*   99a8bcd Merge ch6/frontend: Checkpoint 6 đạt 23/23
|\\  
| * 2a3d042 docs: README — quyết định frontend Chương 6`;


const LENH = `# máy chủ dev đang chạy thì TẮT trước (script tự bật API + Vite)
docker ps --filter name=chiase-     # Postgres + MinIO đang chạy
npm run db:migrate -w apps/api      # có migration likes của bài 7.2
node scripts/checkpoint-7.mjs       # ~5 phút: gọi checkpoint-6 (Chrome thật) rồi tới phần realtime

# bản chính thức: clone sạch
git clone . /tmp/chiase-sach && cp apps/api/.env /tmp/chiase-sach/apps/api/ && cp apps/web/.env.local /tmp/chiase-sach/apps/web/
cd /tmp/chiase-sach && npm ci && node scripts/checkpoint-7.mjs`;

const MERMAID = `flowchart TD
  C6["0. checkpoint-6 (→ 5 → … → 1)"] --> M["1. mã nguồn: kiểu, hợp đồng, proxy ws, một socket"]
  M --> N["3. socket từ Node: token, Origin, phòng nháp, lũ"]
  N --> T["4. hai trình duyệt: bình luận < 1 s, đếm khớp CSDL, lượt thích"]
  T --> R["5. API khởi động lại, token đã hết hạn: không mất bình luận"]
  R --> S["6. SIGTERM với socket mở: thoát ngay"]`;

const THE = [
  lienKet({ khoa: 'socket-io', bai: 'io-10-1-cay', title: 'Socket.IO 10.1 — Cây quyết định chẩn đoán', sub: 'Khi một tiêu chí realtime trượt: client có nối không, sự kiện có trên dây không…', cta: 'Mở bài →' }),
  lienKet({ khoa: 'socket-io', bai: 'io-10-5-cluster-bugs', title: 'Socket.IO 10.5 — Bug đặc thù cluster', sub: 'Những lỗi chỉ hiện khi có từ hai instance trở lên.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-0-8-bat-dau-tai-day', title: 'Testing — Bắt đầu tại đây (1/2)', sub: 'Chương 8 biến các checkpoint thành bộ test có cấu trúc; khoá Testing dạy nền.', cta: 'Mở khoá →' }),
].join('\n');

export default {
  title: '7.4 — Checkpoint 7: two browser tabs see the same comment instantly|||7.4 — Checkpoint 7: hai tab trình duyệt thấy cùng một bình luận ngay lập tức',
  slug: 'fp-7-4-checkpoint-7',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một script tự chấm 16 tiêu chí bằng hai trình duyệt Chrome thật (An và Bình) và socket từ Node: bình luận hiện ở tab kia dưới 1 giây và đúng một lần, số đếm khớp CSDL, lượt thích sống, API khởi động lại khi token đã hết hạn mà không mất bình luận, token sai/origin lạ/phòng bài nháp/lũ sự kiện bị chặn, và SIGTERM với socket đang mở thì thoát ngay. Kèm chuyện thật: phá thử để lọt lỗi "tắt treo" hai lần vì đo sai chỗ, và clone sạch bắt được một cuộc đua chỉ hiện khi API vừa khởi động.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Checkpoint</span>
<h2>Prove it with two real browsers</h2>
<p class="lead">"It works when I open two tabs" is a demo, not a check. Checkpoint 7 is a script you run before moving on: two real Chrome sessions logged in as two different people, plus raw sockets from Node to try what a browser would not. It re-runs Checkpoint 6 first, so nothing from earlier chapters may break. This lesson also shows the two things that happened while building it — a test that passed when it should have failed, and a race that only a clean clone revealed.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. What is checked, and why each line exists</h3>
<table>
<thead><tr><th>Criterion</th><th>Catches</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>Typecheck both apps; contract file imports nothing</td><td>web type-checking dragging in server code; event name typos</td><td>7.1</td></tr>
<tr><td><code>/socket.io</code> proxied with <code>ws: true</code>; one socket, same origin, <code>auth</code> as a function</td><td>silent long-polling; stale token on reconnect</td><td>7.1, 7.2</td></tr>
<tr><td>Guest OK, garbage token refused with a code, foreign Origin refused</td><td>CSWSH; clients unable to tell "expired" from "invalid"</td><td>7.2</td></tr>
<tr><td>Draft room: guest and Bình refused, An allowed</td><td>room join without authorization</td><td>7.2</td></tr>
<tr><td>200 joins from one socket ⇒ disconnected</td><td>room/DB flooding</td><td>7.2</td></tr>
<tr><td>Comment visible in the other browser &lt; 1 s, exactly once, counts = DB</td><td>broken rooms; double counting</td><td>7.2</td></tr>
<tr><td>Like updates the other browser, count = DB</td><td>likes not emitted / not coalesced</td><td>7.2</td></tr>
<tr><td>API restart with expired tokens: status bar, no lost comment, counts = DB</td><td>no catch-up; dead socket after expiry; stale snapshot</td><td>7.3</td></tr>
<tr><td>SIGTERM with a socket open ⇒ exits</td><td><code>server.close()</code> hanging</td><td>7.1</td></tr>
</tbody>
</table>

<h3>2. The script</h3>
<p>Same skeleton as Checkpoint 6: tagged test data deleted at the end, servers started and stopped by the script, and a <code>try/catch</code> so that a step that throws is recorded as a failure and cleanup still runs.</p>
<pre><code class="language-js">${SCRIPT}</code></pre>
<pre><code class="language-bash">${LENH}</code></pre>

<h3>3. First run: 16/16 — suspicious</h3>
<div class="out">${LAN1}</div>
<p>Everything green on the first try is exactly when you should break things on purpose. A check that has never failed has not proven it can.</p>

<h3>4. Break it on purpose — and the check that lied</h3>
<p>We removed three fixes at once (catch-up after reconnect, the <code>TOKEN_HET_HAN</code> handler, <code>io.close()</code>), ran the script, restored with <code>git checkout</code>, then repeated with only the shutdown bug:</p>
<div class="out">${PHA_THU}</div>
<p>The first run caught two of three; the shutdown hang slipped through twice. Step 6 originally waited for the <code>npm run dev</code> process to exit. But in development the API runs under <code>tsx watch</code>, and the watcher kills its child when it receives SIGTERM — so the process exited quickly no matter what the server code did. Our second attempt (watching a socket get disconnected) failed for the same reason. In production there is no watcher: <code>node dist/server.js</code> under <code>docker stop</code> hangs for real. The final version starts one API the production way (no watch), opens a socket, and sends SIGTERM to <em>that</em> process: "STILL RUNNING after 4 s". Lesson: measure the thing production does, not a convenient proxy for it. (Checkpoint 6, called inside, also failed one criterion in both broken runs.)</p>

<h3>5. Clean clone: a race that only appears there</h3>
<p>The official run is on a fresh clone with <code>npm ci</code> (13.7 s). First attempt:</p>
<div class="out">${CLONE_LAN1}</div>
<p>Bình saw both comments, but Bình's counter said 4 while the database had 5. The sequence: after the restart Bình's tab re-joined and sent <code>GET /posts/:id</code> to refresh counts. The API had just started (cold TypeScript loader, first database connections), so that response was slow. Meanwhile An's next comment arrived over the socket and the counter went to 5. Then the slow response — read <em>before</em> that comment existed — arrived and set it back to 4. On the warm repository the GET was fast enough to hide the race. The fix: if a live event arrives while the snapshot request is in flight, the snapshot may be stale, so ask again:</p>
<pre><code class="language-tsx">${HOI_LAI}</code></pre>
<p>Two more clean runs, both green (the second shown):</p>
<div class="out">${CLONE_LAN3}</div>
<p>This is the general rule for mixing snapshots (HTTP) with deltas (events): a snapshot must not overwrite state that is newer than the snapshot. Version numbers or timestamps on both are the robust form; "re-ask if something arrived meanwhile" is the small-app form.</p>

<h3>6. What realtime cost</h3>
<div class="out">${BUILD}</div>
<p>The JavaScript bundle went from 330.59 kB (104.44 kB gzip) in Chapter 6 to 375.32 kB (118.26 kB gzip): about 14 kB over the network for the Socket.IO client and this chapter's components. On the server: one open connection and a ping every 25 s per tab, and code paths that need graceful shutdown and rate limits. Write these numbers in your project's README — a reviewer will ask.</p>
<div class="out">${GIT}</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">cp6</span><span class="lz-d">everything from earlier chapters still passes</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">code</span><span class="lz-d">types, contract, proxy ws, one socket</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Node</span><span class="lz-d">token, Origin, draft room, flood</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">browsers</span><span class="lz-d">< 1 s, exactly once, counts = DB, likes</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">restart</span><span class="lz-d">expired tokens, no lost comment</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">break it</span><span class="lz-d">every fix removed ⇒ something turns red</span></div>
<div class="lz-step"><span class="lz-k">7</span><span class="lz-t">clean clone</span><span class="lz-d">npm ci, green twice</span></div>
</div>

<h3>If a criterion fails</h3>
<ul>
<li><strong>"Bình sees after ∞"</strong> — open DevTools → Network → WS in Bình's tab. No WS row: proxy (<code>ws: true</code>). Frames but no <code>42["binh-luan:moi"</code>: the join failed (look for the warning from <code>useBaiSong</code>) or the emit goes to the wrong room name.</li>
<li><strong>Counters differ from the DB</strong> — search for every place that changes <code>commentCount</code>; there must be exactly one (<code>themBinhLuan</code>) plus the snapshot.</li>
<li><strong>Restart step fails</strong> — check order: join, ack, <em>then</em> fetch; and that <code>useTrang</code> keeps the last cursor.</li>
<li><strong>Foreign Origin connects</strong> — <code>WEB_ORIGIN</code> in <code>apps/api/.env</code> must be exactly <code>http://localhost:41811</code>, no trailing slash.</li>
<li><strong>Port busy / "API does not answer"</strong> — a dev server is still running; stop it. On this machine port 41810 is often taken by outgoing connections (lesson 1.3), so the API uses <code>PORT=41815</code>.</li>
</ul>

<h3>On the job</h3>
<p>End-to-end tests with two browser contexts are how teams test chat, collaborative editing and notifications; Playwright makes them cheap. What makes them trustworthy is the habit shown here: break the feature and watch the test go red, run on a clean checkout, and when something is flaky, find the race instead of adding a retry. A flaky realtime test is usually a real bug that your users hit right after every deploy.</p>

${spring(false, 'The checkpoint is backend-agnostic except for the Socket.IO protocol. With a Spring STOMP backend, replace the Node socket checks with a STOMP client (for example <code>@stomp/stompjs</code>) and keep the browser part unchanged; the same scenarios — expired token on reconnect, restart during a conversation, SIGTERM with open sessions — apply to Spring (<code>server.shutdown=graceful</code> plus closing WebSocket sessions).', [
  ['sb-11-6-lab-11', 'Spring Boot 11.6 — Chapter 11 lab (testing) + interview questions'],
  ['sb-21-5-lab-21', 'Spring Boot 21.5 — Chapter 21 lab: React + Spring end to end'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"How do you test a realtime feature end to end?"</strong> — Two isolated browser contexts as two users; one acts, the other asserts within a time budget; also test disconnect/reconnect and server restart.</li>
<li><strong>"Your test is flaky. What do you do?"</strong> — Reproduce under the condition that makes it fail (here: a cold server), find the ordering problem, fix the code; do not add sleeps or retries to the test.</li>
<li><strong>"How do you know a test can fail?"</strong> — Break the code on purpose and see it go red; a check that never failed proves nothing.</li>
</ol>

<h3>🧪 Do it</h3>
<div class="callout ok">
<ol>
<li>Write <code>scripts/checkpoint-7.mjs</code> yourself from the criteria table; use the listing above only when stuck.</li>
<li>Run it until 16/16 on your repository.</li>
<li>Break three fixes and check that each one turns at least one criterion red; repair any check that stays green.</li>
<li>Clone, <code>npm ci</code>, copy the two env files, and run it on the clone until green twice in a row.</li>
<li>Commit, merge <code>ch7/realtime</code> into <code>main</code>, tag <code>ch7</code>.</li>
</ol>
<p><strong>Done when:</strong> 16/16 twice on a clean clone, every broken fix detected, no leftover processes (<code>ss -ltnp | grep 4181</code> is empty) and no leftover test posts.</p>
</div>
<details><summary>Solution</summary>
<p>Tag <code>ch7</code> (merge <code>942cbec</code>): <code>scripts/checkpoint-7.mjs</code>, the race fix in <code>apps/web/src/pages/BaiViet.tsx</code> (<code>hoiLaiBai</code>), README section 5f. If step 4 fails only on the first run after starting the containers, it is usually the cold Vite dependency optimizer: the first page load re-bundles dependencies and reloads once — run again.</p>
</details>

<h3>📌 Summary</h3>
<ul>
<li>16 criteria: code shape, socket security from Node, two real browsers, restart with expired tokens, shutdown.</li>
<li>Break things on purpose: our shutdown check passed twice while the bug was present, because it measured the dev watcher, not the server.</li>
<li>A clean clone exposed a stale-snapshot race (counter 4 vs DB 5); fixed in the code, not with a retry in the test.</li>
<li>Realtime costs ~14 kB gzip, one connection per tab, and operational care.</li>
</ul>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Checkpoint</span>
<h2>Chứng minh bằng hai trình duyệt thật</h2>
<p class="lead">"Mở hai tab thì chạy" là một màn demo, không phải phép kiểm. Checkpoint 7 là script bạn chạy trước khi sang chương sau: hai phiên Chrome thật đăng nhập bằng hai người khác nhau, cộng socket trần từ Node để thử những thứ trình duyệt không làm. Nó chạy lại Checkpoint 6 trước, nên không thứ gì của các chương trước được hỏng. Bài này còn kể hai chuyện xảy ra lúc dựng nó — một phép kiểm báo đạt khi lẽ ra phải trượt, và một cuộc đua chỉ clone sạch mới làm lộ ra.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Kiểm những gì, và vì sao có từng dòng</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Bắt được</th><th>Bài</th></tr></thead>
<tbody>
<tr><td>Kiểm kiểu cả hai ứng dụng; tệp hợp đồng không import gì</td><td>kiểm kiểu web kéo theo mã máy chủ; gõ sai tên sự kiện</td><td>7.1</td></tr>
<tr><td><code>/socket.io</code> được proxy với <code>ws: true</code>; một socket, cùng origin, <code>auth</code> là hàm</td><td>lặng lẽ ở lại long-polling; token cũ khi nối lại</td><td>7.1, 7.2</td></tr>
<tr><td>Khách nối được, token rác bị từ chối kèm mã, Origin lạ bị từ chối</td><td>CSWSH; client không phân biệt được "hết hạn" với "sai"</td><td>7.2</td></tr>
<tr><td>Phòng bài nháp: khách và Bình bị chặn, An vào được</td><td>vào phòng không phân quyền</td><td>7.2</td></tr>
<tr><td>200 lần vào phòng từ một socket ⇒ bị ngắt</td><td>lũ phòng / lũ truy vấn CSDL</td><td>7.2</td></tr>
<tr><td>Bình luận hiện ở trình duyệt kia &lt; 1 s, đúng một lần, số đếm = CSDL</td><td>phòng hỏng; đếm hai lần</td><td>7.2</td></tr>
<tr><td>Lượt thích cập nhật trình duyệt kia, số = CSDL</td><td>không phát / không gộp lượt thích</td><td>7.2</td></tr>
<tr><td>API khởi động lại khi token đã hết hạn: có thanh báo, không mất bình luận, số đếm = CSDL</td><td>không bắt kịp; socket chết sau khi hết hạn; ảnh chụp cũ</td><td>7.3</td></tr>
<tr><td>SIGTERM khi đang có socket ⇒ thoát</td><td><code>server.close()</code> treo</td><td>7.1</td></tr>
</tbody>
</table>

<h3>2. Script</h3>
<p>Cùng bộ khung với Checkpoint 6: dữ liệu thử có nhãn và bị xoá ở cuối, script tự bật và tắt máy chủ, và một khối <code>try/catch</code> để bước nào văng thì ghi là trượt mà phần dọn dẹp vẫn chạy.</p>
<pre><code class="language-js">${SCRIPT}</code></pre>
<pre><code class="language-bash">${LENH}</code></pre>

<h3>3. Lần chạy đầu: 16/16 — đáng ngờ</h3>
<div class="out">${LAN1}</div>
<p>Xanh hết ngay lần đầu chính là lúc phải cố tình làm hỏng. Một phép kiểm chưa từng trượt thì chưa chứng minh được là nó trượt được.</p>

<h3>4. Cố tình phá — và phép kiểm nói dối</h3>
<p>Ta gỡ cùng lúc ba chỗ sửa (bắt kịp sau nối lại, xử lý <code>TOKEN_HET_HAN</code>, <code>io.close()</code>), chạy script, khôi phục bằng <code>git checkout</code>, rồi lặp lại chỉ với lỗi tắt máy chủ:</p>
<div class="out">${PHA_THU}</div>
<p>Lần đầu bắt được hai trên ba; lỗi tắt treo lọt qua hai lần. Bước 6 ban đầu chờ tiến trình <code>npm run dev</code> thoát. Nhưng khi dev, API chạy dưới <code>tsx watch</code>, và trình theo dõi đó giết tiến trình con khi nhận SIGTERM — nên tiến trình thoát nhanh bất kể mã máy chủ làm gì. Lần sửa thứ hai (chờ một socket bị ngắt) hỏng cùng lý do. Ở production không có trình theo dõi: <code>node dist/server.js</code> dưới <code>docker stop</code> treo thật. Bản cuối bật một API theo đúng cách production (không watch), mở một socket, và gửi SIGTERM cho <em>đúng tiến trình đó</em>: "VẪN CHẠY sau 4 s". Bài học: đo đúng thứ production làm, đừng đo một thứ thay thế cho tiện. (Checkpoint 6 được gọi bên trong cũng trượt một tiêu chí ở cả hai lần phá.)</p>

<h3>5. Clone sạch: một cuộc đua chỉ hiện ở đó</h3>
<p>Lần chạy chính thức là trên một clone mới với <code>npm ci</code> (13,7 s). Lần đầu:</p>
<div class="out">${CLONE_LAN1}</div>
<p>Bình thấy cả hai bình luận, nhưng số đếm của Bình ghi 4 trong khi CSDL có 5. Trình tự: sau khi khởi động lại, tab của Bình vào lại phòng và gửi <code>GET /posts/:id</code> để lấy lại số đếm. API vừa mới lên (bộ nạp TypeScript còn nguội, kết nối CSDL đầu tiên), nên phản hồi đó chậm. Trong lúc ấy bình luận tiếp theo của An tới qua socket và số đếm lên 5. Rồi phản hồi chậm — đọc <em>trước</em> khi bình luận đó tồn tại — tới nơi và đặt lại về 4. Ở repo đã "ấm", GET đủ nhanh để che mất cuộc đua. Cách sửa: nếu có sự kiện sống tới trong lúc request ảnh chụp đang bay, ảnh chụp có thể đã cũ, nên hỏi lại:</p>
<pre><code class="language-tsx">${HOI_LAI}</code></pre>
<p>Thêm hai lần chạy trên clone sạch, cả hai xanh (dưới đây là lần thứ hai):</p>
<div class="out">${CLONE_LAN3}</div>
<p>Đây là luật chung khi trộn ảnh chụp (HTTP) với thay đổi (sự kiện): ảnh chụp không được ghi đè trạng thái mới hơn nó. Dạng chắc chắn là gắn số phiên bản hoặc mốc thời gian cho cả hai; "có gì tới trong lúc hỏi thì hỏi lại" là dạng cho ứng dụng nhỏ.</p>

<h3>6. Realtime tốn bao nhiêu</h3>
<div class="out">${BUILD}</div>
<p>Bundle JavaScript đi từ 330,59 kB (gzip 104,44 kB) ở Chương 6 lên 375,32 kB (gzip 118,26 kB): khoảng 14 kB qua mạng cho thư viện client Socket.IO và các component của chương này. Phía máy chủ: mỗi tab một kết nối mở và một ping mỗi 25 s, cộng những nhánh mã cần tắt êm và giới hạn tốc độ. Ghi các con số này vào README của dự án — người review sẽ hỏi.</p>
<div class="out">${GIT}</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">cp6</span><span class="lz-d">mọi thứ của các chương trước vẫn đạt</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">mã</span><span class="lz-d">kiểu, hợp đồng, proxy ws, một socket</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Node</span><span class="lz-d">token, Origin, phòng nháp, lũ</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">trình duyệt</span><span class="lz-d">< 1 s, đúng một lần, số đếm = CSDL, lượt thích</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">khởi động lại</span><span class="lz-d">token đã hết hạn, không mất bình luận</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">phá thử</span><span class="lz-d">gỡ mỗi chỗ sửa ⇒ có tiêu chí chuyển đỏ</span></div>
<div class="lz-step"><span class="lz-k">7</span><span class="lz-t">clone sạch</span><span class="lz-d">npm ci, xanh hai lần</span></div>
</div>

<h3>Khi một tiêu chí trượt</h3>
<ul>
<li><strong>"Bình thấy sau ∞"</strong> — mở DevTools → Network → WS ở tab của Bình. Không có dòng WS: proxy (<code>ws: true</code>). Có khung mà không có <code>42["binh-luan:moi"</code>: vào phòng thất bại (tìm cảnh báo từ <code>useBaiSong</code>) hoặc phát nhầm tên phòng.</li>
<li><strong>Số đếm khác CSDL</strong> — tìm mọi chỗ đổi <code>commentCount</code>; chỉ được có đúng một chỗ (<code>themBinhLuan</code>) cộng ảnh chụp.</li>
<li><strong>Bước khởi động lại trượt</strong> — kiểm thứ tự: vào phòng, ack, <em>rồi</em> mới hỏi; và <code>useTrang</code> có giữ cursor cuối.</li>
<li><strong>Origin lạ vẫn nối được</strong> — <code>WEB_ORIGIN</code> trong <code>apps/api/.env</code> phải đúng <code>http://localhost:41811</code>, không có dấu / cuối.</li>
<li><strong>Cổng bận / "API không trả lời"</strong> — một máy chủ dev còn chạy; tắt nó. Trên máy này cổng 41810 hay bị kết nối đi ra chiếm (bài 1.3), nên API dùng <code>PORT=41815</code>.</li>
</ul>

<h3>Tình huống đi làm thật</h3>
<p>Test đầu-cuối với hai ngữ cảnh trình duyệt là cách các team test chat, soạn thảo cộng tác và thông báo; Playwright làm chúng rẻ. Điều làm chúng đáng tin là thói quen trong bài này: làm hỏng tính năng và nhìn test chuyển đỏ, chạy trên bản checkout sạch, và khi có gì chập chờn thì đi tìm cuộc đua thay vì thêm lần thử lại. Một test realtime chập chờn thường là một lỗi thật mà người dùng gặp ngay sau mỗi lần deploy.</p>

${spring(false, 'Checkpoint không phụ thuộc backend, trừ giao thức Socket.IO. Với backend Spring STOMP, thay phần kiểm socket từ Node bằng một client STOMP (ví dụ <code>@stomp/stompjs</code>) và giữ nguyên phần trình duyệt; cùng những kịch bản — token hết hạn khi nối lại, khởi động lại giữa cuộc trò chuyện, SIGTERM khi còn phiên mở — áp dụng y hệt cho Spring (<code>server.shutdown=graceful</code> cộng đóng phiên WebSocket).', [
  ['sb-11-6-lab-11', 'Spring Boot 11.6 — Lab chương 11 (testing) + câu hỏi phỏng vấn'],
  ['sb-21-5-lab-21', 'Spring Boot 21.5 — Lab chương 21: React + Spring trọn tuyến'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Test đầu-cuối một tính năng realtime thế nào?"</strong> — Hai ngữ cảnh trình duyệt tách biệt cho hai người; một người làm, người kia kiểm trong một khoảng thời gian cho phép; kiểm cả mất/nối lại kết nối và khởi động lại máy chủ.</li>
<li><strong>"Test của bạn chập chờn. Làm gì?"</strong> — Tái hiện đúng điều kiện làm nó trượt (ở đây: máy chủ vừa khởi động), tìm vấn đề thứ tự, sửa mã; không thêm sleep hay thử lại vào test.</li>
<li><strong>"Làm sao biết một test có thể trượt?"</strong> — Cố tình làm hỏng mã và xem nó chuyển đỏ; phép kiểm chưa từng trượt không chứng minh gì.</li>
</ol>

<h3>🧪 Tự làm</h3>
<div class="callout ok">
<ol>
<li>Tự viết <code>scripts/checkpoint-7.mjs</code> từ bảng tiêu chí; chỉ xem mã ở trên khi bí.</li>
<li>Chạy tới khi 16/16 trên repo của bạn.</li>
<li>Phá ba chỗ sửa và kiểm rằng mỗi chỗ làm ít nhất một tiêu chí chuyển đỏ; sửa phép kiểm nào vẫn xanh.</li>
<li>Clone, <code>npm ci</code>, chép hai tệp env, chạy trên clone tới khi xanh hai lần liên tiếp.</li>
<li>Commit, merge <code>ch7/realtime</code> vào <code>main</code>, gắn tag <code>ch7</code>.</li>
</ol>
<p><strong>Xong khi:</strong> 16/16 hai lần trên clone sạch, mọi chỗ sửa bị gỡ đều bị phát hiện, không sót tiến trình (<code>ss -ltnp | grep 4181</code> rỗng) và không sót bài thử.</p>
</div>
<details><summary>Lời giải</summary>
<p>Tag <code>ch7</code> (merge <code>942cbec</code>): <code>scripts/checkpoint-7.mjs</code>, chỗ sửa cuộc đua trong <code>apps/web/src/pages/BaiViet.tsx</code> (<code>hoiLaiBai</code>), README mục 5f. Nếu bước 4 chỉ trượt ở lần chạy đầu tiên sau khi bật container, thường là do bộ tối ưu phụ thuộc của Vite còn nguội: lần tải trang đầu nó đóng gói lại phụ thuộc và tải lại trang một lần — chạy lại.</p>
</details>

<h3>📌 Tóm tắt</h3>
<ul>
<li>16 tiêu chí: hình dạng mã, bảo mật socket từ Node, hai trình duyệt thật, khởi động lại khi token đã hết hạn, tắt máy chủ.</li>
<li>Cố tình phá: phép kiểm tắt máy chủ báo đạt hai lần khi lỗi vẫn còn, vì nó đo trình theo dõi khi dev chứ không đo máy chủ.</li>
<li>Clone sạch làm lộ cuộc đua ảnh chụp cũ (số đếm 4 so với CSDL 5); sửa trong mã, không phải thêm thử lại vào test.</li>
<li>Realtime tốn ~14 kB gzip, mỗi tab một kết nối, và sự cẩn thận khi vận hành.</li>
</ul>
${THE}
</div>
`,
};
