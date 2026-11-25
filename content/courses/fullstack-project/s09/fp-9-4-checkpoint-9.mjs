/**
 * 9.4 — Checkpoint 9: cả hệ thống chạy bằng một lệnh (soạn 25/11/2026, phiên Mac tiếp quản agent fsp).
 * Output THẬT: scripts/checkpoint-9.mjs (20 tiêu chí; 21 khi gọi checkpoint-8 --bo-cp7) trên bản chép sạch, dự án compose
 * fsp-cp9, cổng 41830. Lần 1: 16/18 — "docker compose port" thoát 0 cả khi không mở cổng (phép kiểm sai), và "fetch failed" sau
 * down/up vì fetch của Node dùng lại kết nối keep-alive đã chết (UND_ERR_SOCKET). Lần 2: 20/21 — checkpoint-8 so git diff với
 * HEAD nên báo trượt oan khi src/ có thay đổi chưa commit ⇒ so với ảnh chụp diff trước khi cài lỗi. Lần 3: 21/21.
 */
import { lienKet, spring } from '../_chung.mjs';

const SCRIPT = `// Checkpoint 9 — cả ChiaSe chạy bằng MỘT lệnh "docker compose up" trên một BẢN CHÉP SẠCH (không node_modules, không dist,
// không .env của máy dev): dựng ảnh, migrate, chuẩn bị kho, rồi kiểm qua ĐÚNG MỘT cổng trình duyệt thấy (41830) như người
// dùng thật — trang, API, tải ảnh bằng URL ký sẵn, WebSocket — cộng các tính chất của ảnh (không root, không bí mật) và dữ liệu
// sống sót qua down/up. Xong thì down -v: không để lại container, volume, mạng.
// Cần: Docker + Compose v2, Node ≥ 22.12, cổng 41830 trống (tắt stack dev đang chạy trước). Chạy ở gốc repo:
//   node scripts/checkpoint-9.mjs            (gọi checkpoint-8 --bo-cp7 trước: bộ test vẫn xanh)
//   node scripts/checkpoint-9.mjs --bo-cp8   (chỉ kiểm phần Docker)
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { io } from 'socket.io-client';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
let dat = 0;
let truot = 0;
const kiem = (moTa, dung) =&gt; {
  console.log(\`  \${dung ? '✔' : '✘'} \${moTa}\`);
  dung ? dat++ : truot++;
};
const W = 'http://localhost:41830';
const DU_AN = 'fsp-cp9'; // tên dự án compose riêng ⇒ không đụng stack dev của bạn
const chay = (lenh, thamSo, opt = {}) =&gt; spawnSync(lenh, thamSo, { encoding: 'utf8', ...opt });
let thuMuc = '';
const dc = (...thamSo) =&gt; chay('docker', ['compose', '-p', DU_AN, ...thamSo], { cwd: thuMuc });
// fetch của Node GIỮ kết nối cũ để dùng lại (keep-alive). Sau "compose down/up" hay restart api, kết nối đó đã chết mà
// fetch không biết ⇒ "fetch failed" dù Nginx đã lên lại (lần chạy đầu của checkpoint này vấp đúng chỗ đó) ⇒ thử lại, có in ra.
const goi = async (url, opt) =&gt; {
  for (let lan = 1; ; lan++) {
    try {
      return await fetch(url, opt);
    } catch (e) {
      if (lan &gt;= 4) throw e;
      console.log(\`    (fetch \${url.replace(W, '')}: \${e.cause?.code ?? e.message} — thử lại lần \${lan})\`);
      await new Promise((r) =&gt; setTimeout(r, 1000));
    }
  }
};
const json = async (duong, opt = {}) =&gt; {
  const r = await goi(W + duong, opt);
  return { status: r.status, body: await r.json().catch(() =&gt; null), headers: r.headers };
};

if (!process.argv.includes('--bo-cp8')) {
  console.log('== 0. Checkpoint 8 vẫn đạt (bộ test xanh, bắt được lỗi cài thử)');
  const cp8 = chay(process.execPath, ['scripts/checkpoint-8.mjs', '--bo-cp7']);
  kiem(\`checkpoint-8: \${cp8.stdout.trim().split('\\n').at(-1)}\`, cp8.status === 0);
}

console.log('== 1. Tệp cấu hình (đọc, chưa chạy)');
const di = readFileSync('.dockerignore', 'utf8');
kiem(
  '.dockerignore chặn node_modules, dist và .env (thứ không có trong ngữ cảnh thì không thể lọt vào ảnh)',
  /node_modules/.test(di) &amp;&amp; /dist/.test(di) &amp;&amp; /^\\*\\*\\/\\.env$/m.test(di),
);
const dfApi = readFileSync('apps/api/Dockerfile', 'utf8');
const runtime = dfApi.slice(dfApi.lastIndexOf('AS runtime'));
kiem(
  'ảnh API: tầng runtime có USER node, HEALTHCHECK, CMD ["node", …] (node là PID 1, không qua npm)',
  /USER node/.test(runtime) &amp;&amp; /HEALTHCHECK/.test(runtime) &amp;&amp; /CMD \\["node",/.test(runtime),
);
const compose = readFileSync('compose.yaml', 'utf8');
const soPorts = (compose.match(/^\\s+ports:/gm) ?? []).length;
kiem(
  \`compose mở ĐÚNG MỘT cổng ra máy, và chỉ trên 127.0.0.1 (có \${soPorts} khối ports)\`,
  soPorts === 1 &amp;&amp; /- 127\\.0\\.0\\.1:41830:80/.test(compose),
);
kiem(
  'compose: mọi dịch vụ có trần RAM (mem_limit) và healthcheck/điều kiện chờ',
  /mem_limit/.test(compose) &amp;&amp;
    /service_healthy/.test(compose) &amp;&amp;
    /service_completed_successfully/.test(compose),
);

console.log('== 2. Bản chép sạch ⇒ docker compose up --build --wait');
const cong = chay('docker', ['ps', '--format', '{{.Names}} {{.Ports}}'])
  .stdout.split('\\n')
  .filter((d) =&gt; d.includes(':41830-&gt;'));
if (cong.length) {
  console.log(
    \`  ✘ cổng 41830 đang bị container khác giữ: \${cong.join(', ')} — tắt nó (docker compose down) rồi chạy lại\`,
  );
  process.exit(1);
}
thuMuc = mkdtempSync(join(tmpdir(), 'chiase-cp9-'));
cpSync('.', thuMuc, {
  recursive: true,
  filter: (t) =&gt;
    !/(^|[\\\\/])(node_modules|dist|coverage|\\.git|generated)([\\\\/]|$)/.test(t) &amp;&amp;
    !/[\\\\/]\\.env(\\.[^\\\\/]*)?$/.test(t.replace(/\\.env\\.example$/, '')),
});
// .env MỚI cho bản chép: mỗi máy một bộ bí mật, sinh ngẫu nhiên — không bao giờ chép .env của máy dev
const ngauNhien = () =&gt; randomBytes(32).toString('base64url');
writeFileSync(
  join(thuMuc, '.env'),
  \`POSTGRES_PASSWORD=\${ngauNhien()}\\nMINIO_ROOT_PASSWORD=\${ngauNhien()}\\nJWT_ACCESS_SECRET=\${ngauNhien()}\\n\`,
);
let ketThuc = false;
const don = () =&gt; {
  if (ketThuc) return;
  ketThuc = true;
  dc('down', '-v', '--remove-orphans');
  rmSync(thuMuc, { recursive: true, force: true });
};
process.on('SIGINT', () =&gt; {
  don();
  process.exit(130);
});

try {
  const t0 = Date.now();
  const up = dc('up', '-d', '--build', '--wait');
  const giay = Math.round((Date.now() - t0) / 1000);
  kiem(
    \`compose up --build --wait thoát 0 trong \${giay} s (bản chép không node_modules, không .env dev)\`,
    up.status === 0,
  );
  if (up.status !== 0) {
    console.log(up.stderr.split('\\n').slice(-15).join('\\n'));
    throw new Error('compose up thất bại');
  }
  const ps = JSON.parse(\`[\${dc('ps', '-a', '--format', 'json').stdout.trim().split('\\n').join(',')}]\`);
  const tt = Object.fromEntries(ps.map((c) =&gt; [c.Service, c]));
  kiem(
    \`db, kho, api healthy; web chạy; chuan-bi thoát 0 (\${ps.map((c) =&gt; \`\${c.Service}:\${c.Health || c.State}\`).join(' ')})\`,
    ['db', 'kho', 'api'].every((s) =&gt; tt[s]?.Health === 'healthy') &amp;&amp;
      tt.web?.State === 'running' &amp;&amp;
      tt['chuan-bi']?.State === 'exited' &amp;&amp;
      tt['chuan-bi']?.ExitCode === 0,
  );

  console.log('== 3. Qua cổng 41830, như trình duyệt');
  const trang = await goi(W + '/');
  const html = await trang.text();
  const js = html.match(/\\/assets\\/[^"]+\\.js/)?.[0];
  const tepJs = js ? await goi(W + js) : null;
  kiem(
    '/ ⇒ index.html no-cache; /assets/*.js ⇒ cache 1 năm immutable',
    trang.headers.get('cache-control') === 'no-cache' &amp;&amp;
      /immutable/.test(tepJs?.headers.get('cache-control') ?? ''),
  );
  const spa = await goi(W + '/bai/khong-co-that');
  const thieu = await goi(W + '/logo-cu.png');
  kiem(
    \`đường của React (/bai/…) ⇒ \${spa.status} text/html no-cache; tệp thiếu (/logo-cu.png) ⇒ \${thieu.status}\`,
    spa.status === 200 &amp;&amp; spa.headers.get('cache-control') === 'no-cache' &amp;&amp; thieu.status === 404,
  );
  const health = await json('/api/health');
  kiem(
    \`/api/health qua Nginx ⇒ \${health.status} db=\${health.body?.db}\`,
    health.status === 200 &amp;&amp; health.body?.db === 'ok',
  );

  const email = \`cp9-\${Date.now()}@chiase.dev\`;
  const matKhau = 'chiase-mau-2026';
  const hdr = { 'content-type': 'application/json' };
  await json('/api/auth/register', {
    method: 'POST',
    headers: hdr,
    body: JSON.stringify({ email, password: matKhau, displayName: 'CP9' }),
  });
  const dn = await json('/api/auth/login', {
    method: 'POST',
    headers: hdr,
    body: JSON.stringify({ email, password: matKhau }),
  });
  const token = dn.body?.accessToken;
  kiem(
    \`đăng ký + đăng nhập qua Nginx ⇒ \${dn.status}, cookie refresh Path=/api/auth\`,
    dn.status === 200 &amp;&amp; /Path=\\/api\\/auth/.test(dn.headers.get('set-cookie') ?? ''),
  );
  const auth = { ...hdr, authorization: \`Bearer \${token}\` };

  // Ảnh PNG 64×64 hợp lệ, dựng bằng sharp của API (bản chép không cần ảnh mẫu)
  const sharp = (await import('sharp')).default;
  const anh = await sharp({ create: { width: 64, height: 64, channels: 3, background: '#2a6' } })
    .png()
    .toBuffer();
  const ve = await json('/api/uploads', {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ contentType: 'image/png', size: anh.length }),
  });
  const put = ve.body?.url
    ? await goi(ve.body.url, { method: 'PUT', headers: { 'content-type': 'image/png' }, body: anh })
    : null;
  kiem(
    \`URL ký sẵn trỏ về \${ve.body?.url?.slice(0, 29)}… (trình duyệt tới được) và PUT ⇒ \${put?.status}\`,
    ve.body?.url?.startsWith(W + '/chiase/tmp/') &amp;&amp; put?.status === 200,
  );
  const bai = await json('/api/posts', {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      title: 'CP9',
      body: 'ảnh qua compose',
      status: 'published',
      imageKey: ve.body?.key,
    }),
  });
  const xemAnh = bai.body?.imageUrl ? await goi(bai.body.imageUrl) : null;
  kiem(
    \`đăng bài kèm ảnh ⇒ \${bai.status}; imageUrl ⇒ \${xemAnh?.status} \${xemAnh?.headers.get('content-type')}\`,
    bai.status === 201 &amp;&amp; xemAnh?.status === 200 &amp;&amp; xemAnh.headers.get('content-type') === 'image/webp',
  );

  const kieu = await new Promise((xong) =&gt; {
    const s = io(W, { auth: { token }, reconnection: false, timeout: 4000 });
    s.on('connect', () =&gt;
      s.io.engine.on('upgrade', (tr) =&gt; {
        xong(tr.name);
        s.close();
      }),
    );
    s.on('connect_error', (e) =&gt; {
      xong(\`lỗi \${e.message}\`);
      s.close();
    });
    setTimeout(() =&gt; {
      xong(s.connected ? s.io.engine.transport.name : 'không kết nối');
      s.close();
    }, 3000);
  });
  kiem(\`Socket.IO qua Nginx nâng cấp lên WebSocket (được: \${kieu})\`, kieu === 'websocket');

  console.log('== 4. Ảnh và container');
  const id = dc('exec', '-T', 'api', 'id', '-u').stdout.trim();
  const trong = dc(
    'exec',
    '-T',
    'api',
    'sh',
    '-c',
    'ls -A /app/apps/api; ls /app/node_modules | grep -cE "^(typescript|vitest|tsx|oxlint|vite)$" || true',
  ).stdout;
  kiem(
    \`api chạy uid \${id} (không phải root); trong ảnh không có .env, src/, công cụ dev\`,
    id !== '0' &amp;&amp; id !== '' &amp;&amp; !/\\.env|^src$/m.test(trong) &amp;&amp; /^0$/m.test(trong),
  );
  const pid1 = dc('exec', '-T', 'api', 'cat', '/proc/1/cmdline').stdout.replaceAll('\\0', ' ').trim();
  kiem(\`PID 1 trong container api là "\${pid1}"\`, pid1.startsWith('node '));
  kiem(
    'db, kho, api không có cổng nào trên máy (chỉ web)',
    // "docker compose port" thoát 0 cả khi không công bố cổng ⇒ hỏi thẳng docker port của từng container
    ['db', 'kho', 'api'].every((d) =&gt; chay('docker', ['port', \`\${DU_AN}-\${d}-1\`]).stdout.trim() === ''),
  );

  console.log('== 5. Dữ liệu và vòng đời');
  dc('down');
  const lai = dc('up', '-d', '--wait');
  const dn2 = await json('/api/auth/login', {
    method: 'POST',
    headers: hdr,
    body: JSON.stringify({ email, password: matKhau }),
  });
  const bai2 = await json(\`/api/posts/\${bai.body?.id}\`);
  kiem(
    \`down (không -v) rồi up: tài khoản còn (\${dn2.status}), bài còn (\${bai2.status}) — volume pgdata/kho giữ dữ liệu\`,
    lai.status === 0 &amp;&amp; dn2.status === 200 &amp;&amp; bai2.status === 200,
  );
  const t1 = Date.now();
  dc('stop', 'api');
  const giayDung = (Date.now() - t1) / 1000;
  const thoat = chay('docker', ['inspect', '-f', '{{.State.ExitCode}}', \`\${DU_AN}-api-1\`]).stdout.trim();
  const log = dc('logs', '--no-log-prefix', 'api').stdout;
  kiem(
    \`docker compose stop api: \${giayDung.toFixed(1)} s, mã thoát \${thoat}, log "Đã đóng HTTP và kết nối CSDL."\`,
    giayDung &lt; 5 &amp;&amp; thoat === '0' &amp;&amp; log.includes('Đã đóng HTTP và kết nối CSDL.'),
  );
  dc('start', 'api');
  dc('up', '-d', '--wait', 'api');
  // Cuối cùng (vì nó tiêu hết lượt đăng nhập của IP này): X-Forwarded-For giả KHÔNG lách được giới hạn
  const ma = [];
  for (let i = 0; i &lt; 12; i++) {
    const r = await goi(W + '/api/auth/login', {
      method: 'POST',
      headers: { ...hdr, 'x-forwarded-for': \`10.9.0.\${i}\` },
      body: JSON.stringify({ email, password: \`sai-\${i}\` }),
    });
    ma.push(r.status);
  }
  kiem(
    \`12 lần đăng nhập sai, mỗi lần một X-Forwarded-For giả ⇒ vẫn bị chặn (\${ma.join(' ')})\`,
    ma.includes(429),
  );
} catch (e) {
  kiem(\`lỗi khi chạy: \${e.message}\`, false);
} finally {
  don();
  const sot = chay('docker', [
    'ps',
    '-aq',
    '--filter',
    \`label=com.docker.compose.project=\${DU_AN}\`,
  ]).stdout.trim();
  const vol = chay('docker', [
    'volume',
    'ls',
    '-q',
    '--filter',
    \`label=com.docker.compose.project=\${DU_AN}\`,
  ]).stdout.trim();
  kiem('down -v: không còn container, volume nào của dự án', !sot &amp;&amp; !vol);
}

console.log(\`\\nCheckpoint 9: \${dat}/\${dat + truot} tiêu chí đạt\`);
process.exit(truot ? 1 : 0);`;

const CP_1 = `== 1. Tệp cấu hình (đọc, chưa chạy)
  ✔ .dockerignore chặn node_modules, dist và .env (thứ không có trong ngữ cảnh thì không thể lọt vào ảnh)
  ✔ ảnh API: tầng runtime có USER node, HEALTHCHECK, CMD ["node", …] (node là PID 1, không qua npm)
  ✔ compose mở ĐÚNG MỘT cổng ra máy, và chỉ trên 127.0.0.1 (có 1 khối ports)
  ✔ compose: mọi dịch vụ có trần RAM (mem_limit) và healthcheck/điều kiện chờ
== 2. Bản chép sạch ⇒ docker compose up --build --wait
  ✔ compose up --build --wait thoát 0 trong 23 s (bản chép không node_modules, không .env dev)
  ✔ db, kho, api healthy; web chạy; chuan-bi thoát 0 (api:healthy chuan-bi:exited db:healthy kho:healthy web:running)
== 3. Qua cổng 41830, như trình duyệt
  ✔ / ⇒ index.html no-cache; /assets/*.js ⇒ cache 1 năm immutable
  ✔ đường của React (/bai/…) ⇒ 200 text/html no-cache; tệp thiếu (/logo-cu.png) ⇒ 404
  ✔ /api/health qua Nginx ⇒ 200 db=ok
  ✔ đăng ký + đăng nhập qua Nginx ⇒ 200, cookie refresh Path=/api/auth
  ✔ URL ký sẵn trỏ về http://localhost:41830/chiase… (trình duyệt tới được) và PUT ⇒ 200
  ✔ đăng bài kèm ảnh ⇒ 201; imageUrl ⇒ 200 image/webp
  ✔ Socket.IO qua Nginx nâng cấp lên WebSocket (được: websocket)
== 4. Ảnh và container
  ✔ api chạy uid 1000 (không phải root); trong ảnh không có .env, src/, công cụ dev
  ✔ PID 1 trong container api là "node apps/api/dist/server.js"
  ✘ CSDL và kho không có cổng trên máy (chỉ web)
== 5. Dữ liệu và vòng đời
  ✘ lỗi khi chạy: fetch failed
  ✔ down -v: không còn container, volume nào của dự án

Checkpoint 9: 16/18 tiêu chí đạt`;

const CP_2 = `== 0. Checkpoint 8 vẫn đạt (bộ test xanh, bắt được lỗi cài thử)
  ✘ checkpoint-8: Checkpoint 8: 22/23 tiêu chí đạt — 1 trượt
== 1. Tệp cấu hình (đọc, chưa chạy)
  ✔ .dockerignore chặn node_modules, dist và .env (thứ không có trong ngữ cảnh thì không thể lọt vào ảnh)
  ✔ ảnh API: tầng runtime có USER node, HEALTHCHECK, CMD ["node", …] (node là PID 1, không qua npm)
  ✔ compose mở ĐÚNG MỘT cổng ra máy, và chỉ trên 127.0.0.1 (có 1 khối ports)
  ✔ compose: mọi dịch vụ có trần RAM (mem_limit) và healthcheck/điều kiện chờ
== 2. Bản chép sạch ⇒ docker compose up --build --wait
  ✔ compose up --build --wait thoát 0 trong 20 s (bản chép không node_modules, không .env dev)
  ✔ db, kho, api healthy; web chạy; chuan-bi thoát 0 (api:healthy chuan-bi:exited db:healthy kho:healthy web:running)
== 3. Qua cổng 41830, như trình duyệt
  ✔ / ⇒ index.html no-cache; /assets/*.js ⇒ cache 1 năm immutable
  ✔ đường của React (/bai/…) ⇒ 200 text/html no-cache; tệp thiếu (/logo-cu.png) ⇒ 404
  ✔ /api/health qua Nginx ⇒ 200 db=ok
  ✔ đăng ký + đăng nhập qua Nginx ⇒ 200, cookie refresh Path=/api/auth
  ✔ URL ký sẵn trỏ về http://localhost:41830/chiase… (trình duyệt tới được) và PUT ⇒ 200
  ✔ đăng bài kèm ảnh ⇒ 201; imageUrl ⇒ 200 image/webp
  ✔ Socket.IO qua Nginx nâng cấp lên WebSocket (được: websocket)
== 4. Ảnh và container
  ✔ api chạy uid 1000 (không phải root); trong ảnh không có .env, src/, công cụ dev
  ✔ PID 1 trong container api là "node apps/api/dist/server.js"
  ✔ db, kho, api không có cổng nào trên máy (chỉ web)
== 5. Dữ liệu và vòng đời
    (fetch /api/auth/login: UND_ERR_SOCKET — thử lại lần 1)
  ✔ down (không -v) rồi up: tài khoản còn (200), bài còn (200) — volume pgdata/kho giữ dữ liệu
  ✔ docker compose stop api: 0.5 s, mã thoát 0, log "Đã đóng HTTP và kết nối CSDL."
  ✔ 12 lần đăng nhập sai, mỗi lần một X-Forwarded-For giả ⇒ vẫn bị chặn (401 401 401 401 401 401 401 401 401 401 429 429)
  ✔ down -v: không còn container, volume nào của dự án

Checkpoint 9: 20/21 tiêu chí đạt`;

const CP_DU = `== 0. Checkpoint 8 vẫn đạt (bộ test xanh, bắt được lỗi cài thử)
  ✔ checkpoint-8: Checkpoint 8: 23/23 tiêu chí đạt
== 1. Tệp cấu hình (đọc, chưa chạy)
  ✔ .dockerignore chặn node_modules, dist và .env (thứ không có trong ngữ cảnh thì không thể lọt vào ảnh)
  ✔ ảnh API: tầng runtime có USER node, HEALTHCHECK, CMD ["node", …] (node là PID 1, không qua npm)
  ✔ compose mở ĐÚNG MỘT cổng ra máy, và chỉ trên 127.0.0.1 (có 1 khối ports)
  ✔ compose: mọi dịch vụ có trần RAM (mem_limit) và healthcheck/điều kiện chờ
== 2. Bản chép sạch ⇒ docker compose up --build --wait
  ✔ compose up --build --wait thoát 0 trong 19 s (bản chép không node_modules, không .env dev)
  ✔ db, kho, api healthy; web chạy; chuan-bi thoát 0 (api:healthy chuan-bi:exited db:healthy kho:healthy web:running)
== 3. Qua cổng 41830, như trình duyệt
  ✔ / ⇒ index.html no-cache; /assets/*.js ⇒ cache 1 năm immutable
  ✔ đường của React (/bai/…) ⇒ 200 text/html no-cache; tệp thiếu (/logo-cu.png) ⇒ 404
  ✔ /api/health qua Nginx ⇒ 200 db=ok
  ✔ đăng ký + đăng nhập qua Nginx ⇒ 200, cookie refresh Path=/api/auth
  ✔ URL ký sẵn trỏ về http://localhost:41830/chiase… (trình duyệt tới được) và PUT ⇒ 200
  ✔ đăng bài kèm ảnh ⇒ 201; imageUrl ⇒ 200 image/webp
  ✔ Socket.IO qua Nginx nâng cấp lên WebSocket (được: websocket)
== 4. Ảnh và container
  ✔ api chạy uid 1000 (không phải root); trong ảnh không có .env, src/, công cụ dev
  ✔ PID 1 trong container api là "node apps/api/dist/server.js"
  ✔ db, kho, api không có cổng nào trên máy (chỉ web)
== 5. Dữ liệu và vòng đời
    (fetch /api/auth/login: UND_ERR_SOCKET — thử lại lần 1)
  ✔ down (không -v) rồi up: tài khoản còn (200), bài còn (200) — volume pgdata/kho giữ dữ liệu
  ✔ docker compose stop api: 0.3 s, mã thoát 0, log "Đã đóng HTTP và kết nối CSDL."
  ✔ 12 lần đăng nhập sai, mỗi lần một X-Forwarded-For giả ⇒ vẫn bị chặn (401 401 401 401 401 401 401 401 401 401 429 429)
  ✔ down -v: không còn container, volume nào của dự án

Checkpoint 9: 21/21 tiêu chí đạt`;


const THE = [
  lienKet({ khoa: 'docker', bai: 'dk-9-3-thu-tu-khoi-dong', title: 'Docker 9.3 — depends_on, healthcheck, thứ tự khởi động', sub: 'Vì sao --wait chỉ tin được khi mọi dịch vụ có healthcheck.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-11-4-cap-nhat-quay-lui', title: 'Docker 11.4 — Cập nhật, CI/CD, và quay lui', sub: 'Chương 10–11 của dự án đi đúng đường này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-17-6-deploy-hong-quay-lui', title: 'Node.js 17.6 — Khi deploy nói dối', sub: 'Build cũ, smoke test — kiểm thứ người dùng thấy.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-0-1-may-toi-chay-duoc', title: 'GitHub Actions 0.1 — "Máy tôi chạy được" không phải một bằng chứng', sub: 'Chương 10: chạy checkpoint này trên mỗi pull request.', cta: 'Mở khoá →' }),
].join('\n');

export default {
  title: '9.4 — Checkpoint 9: the whole system runs with one command|||9.4 — Checkpoint 9: cả hệ thống chạy bằng một lệnh',
  slug: 'fp-9-4-checkpoint-9',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Checkpoint 9 chép repo ra một thư mục sạch (không node_modules, không dist, không .env của máy dev), sinh .env ngẫu nhiên, chạy docker compose up --build --wait rồi kiểm như người dùng thật qua đúng một cổng: trang, định tuyến, cache, đăng nhập, tải ảnh bằng URL ký sẵn, WebSocket; rồi tính chất của ảnh (không root, không bí mật, node là PID 1, CSDL không có cổng), dữ liệu sống qua down/up, tắt êm, giới hạn đăng nhập không bị lách, và down -v sạch. Ba lần chạy, hai lỗi nằm ở CHÍNH bộ kiểm: một phép kiểm không bao giờ đạt, một kết nối keep-alive chết, và checkpoint-8 so với HEAD.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Checkpoint</span>
<h2>"One command" means one command on a machine that is not yours</h2>
<p class="lead">The chapter's promise: anyone runs ChiaSe with <code>docker compose up</code>. "Works for me" proves nothing — your folder has <code>node_modules</code>, a built <code>dist</code>, a filled-in <code>.env</code> and warm caches. Checkpoint 9 copies the repo without any of that, generates fresh secrets, starts the stack under its own project name, and then behaves like a user who can only reach port 41830.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">read</span><span class="lz-d">.dockerignore, Dockerfile runtime, compose ports and limits</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">clean copy</span><span class="lz-d">no node_modules/dist/.env ⇒ new .env ⇒ up --build --wait</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">as a browser</span><span class="lz-d">pages, cache, login, upload, image, WebSocket via 41830</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">image &amp; data</span><span class="lz-d">uid, no secrets, PID 1, no db port, down/up, stop, rate limit</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">clean up</span><span class="lz-d">down -v: no container, no volume left</span></div>
</div>

<h3>1. The script</h3>
<pre><code class="language-js">${SCRIPT}</code></pre>
<p>Design notes: its own project name (<code>fsp-cp9</code>) so it never touches your dev stack; it refuses to start if port 41830 is taken instead of testing somebody else's containers; it generates a PNG with sharp so the copy needs no sample files; the rate-limit check runs last because it uses up this IP's login budget; cleanup runs in <code>finally</code> and on Ctrl+C.</p>

<h3>2. Run 1: the checker had two bugs</h3>
<div class="out">${CP_1}</div>
<p><strong>"db and kho have no port" failed although they have none.</strong> The first version asked <code>docker compose port db 5432</code> and expected a non-zero exit — but that command exits 0 even when nothing is published. A check that cannot pass is as useless as one that cannot fail; it now asks <code>docker port</code> of each container and expects empty output.</p>
<p><strong>"fetch failed" right after down/up</strong>, while a manual curl at the same moment answered 200. Node's <code>fetch</code> keeps connections alive and reuses them; after <code>compose down</code> the old socket is dead and the next request fails with <code>UND_ERR_SOCKET</code>. Browsers retry such requests; scripts must too. The fix prints when it happens, so you can see it in run 3.</p>

<h3>3. Run 2: Checkpoint 8 failed for a reason that was not a bug in the tests</h3>
<div class="out">${CP_2}</div>
<p>Checkpoint 8 plants 8 bugs and then checks "the source is back to its original state" with <code>git diff --quiet</code> — against HEAD. This chapter changed <code>src/</code> (trust proxy, public S3 endpoint) without committing, so the check failed even though all 8 bugs were caught and every file was restored. A checker that assumes a clean working tree breaks exactly when you are mid-change. It now snapshots <code>git diff</code> before planting bugs and compares with that snapshot.</p>

<h3>4. Run 3</h3>
<div class="out">${CP_DU}</div>
<p>19 s to build and start from a clean copy, because BuildKit's cache is keyed by content, not by folder: the copied files are identical, so every <code>npm ci</code> layer is reused. On a cold machine (Chapter 10's CI runner) expect minutes — lesson 10.2 shares the cache. Note the one retry line: real, harmless, and visible.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — testing the stack you happen to have running.</strong> Checking <code>localhost:41830</code> while your dev stack is up proves your dev stack works, built from your folder, with your old volume. The script refuses to run when the port is taken, builds from the copy, and deletes its volumes at the end. If a checkpoint passes only on your machine, it is not a checkpoint.</p></div>

${spring(true, 'The Spring course has the same checkpoint: the whole system with one command, verified through the front door. Its lab adds the interview questions for this chapter.', [
  ['sb-17-4-checkpoint-9', 'Spring Boot 17.4 — Checkpoint: the whole system with one command'],
  ['sb-17-5-lab-17', 'Spring Boot 17.5 — Lab 17 + interview questions'],
])}

<h3>Everyday analogy</h3>
<p>Testing a recipe in your own kitchen proves you can cook it. Handing it to a friend with an empty fridge and a list of what to buy proves the recipe is complete. The clean copy is the empty fridge.</p>

<h3>On the job</h3>
<p>In a team the first person to try your compose file is usually the newest member, on the first day. If something fails it is "the new person did something wrong" — unless you can show a script that starts from a clean copy and passes 20/20. Attach the output to the pull request that introduces the Docker setup.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"How do you know your docker-compose works for others?"</strong> — Run it from a clean clone with fresh secrets and check through the public port only; CI does the same.</li>
<li><strong>"How do you verify a container is healthy, not just running?"</strong> — Healthcheck that exercises dependencies, <code>--wait</code>, plus an end-to-end request.</li>
<li><strong>"What would you check in an image before shipping?"</strong> — User, contents (no secrets, no source, no dev tools), PID 1, exposed ports, size.</li>
<li><strong>"Your checker passes on your machine and fails in CI — where do you look?"</strong> — Local state: caches, untracked files, .env, running containers, uncommitted changes.</li>
</ol>

<h3>🧪 Checkpoint 9</h3>
<div class="callout ok">
<pre><code class="language-bash">docker compose down                  # free port 41830 (your dev stack)
node scripts/checkpoint-9.mjs --bo-cp8   # Docker part only, ~1 min with a warm cache
node scripts/checkpoint-9.mjs            # + Checkpoint 8 (npm test, 8 planted bugs), ~4 min</code></pre>
<p><strong>Done when:</strong> 20/20 (21/21 with Checkpoint 8), nothing left in <code>docker ps -a</code> or <code>docker volume ls</code> for project <code>fsp-cp9</code>, and you have broken the checker at least once (e.g. remove <code>^~</code> from <code>/chiase/</code>, or set <code>TRUST_PROXY: 0</code>) and seen the matching line turn ✘.</p>
<p><strong>Rubric (10):</strong> clean copy builds and starts with one command (2) · everything through one port: pages, API, upload, WebSocket (3) · image hygiene: non-root, no secrets/source/tools, node PID 1 (2) · data survives down/up, graceful stop, private db (2) · rate limit correct behind the proxy (1).</p>
</div>
<details><summary>Solution</summary>
<p>Branch <code>ch9/docker</code>: <code>scripts/checkpoint-9.mjs</code> as printed above; the snapshot fix in <code>scripts/checkpoint-8.mjs</code> (<code>diffTruoc</code>).</p>
</details>

<h3>📌 Summary</h3>
<ul>
<li>A checkpoint for "one command" must start from a copy without node_modules, dist and .env.</li>
<li>Check through the only public port, like a user: pages, cache, login, upload, image, WebSocket.</li>
<li>Check the image itself: uid, contents, PID 1, no published db port.</li>
<li>Test the checker: a check that could never pass and a dead keep-alive connection were bugs in the script, not in ChiaSe.</li>
<li>Checkers must not assume a clean working tree: compare with a snapshot, not with HEAD.</li>
</ul>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Checkpoint</span>
<h2>"Một lệnh" nghĩa là một lệnh trên máy không phải của bạn</h2>
<p class="lead">Lời hứa của chương: ai cũng chạy được ChiaSe bằng <code>docker compose up</code>. "Máy em chạy được" không chứng minh gì — thư mục của bạn có <code>node_modules</code>, có <code>dist</code> đã dựng, có <code>.env</code> đã điền và cache còn nóng. Checkpoint 9 chép repo ra mà không mang theo những thứ đó, sinh bí mật mới, bật stack dưới tên dự án riêng, rồi cư xử như một người dùng chỉ tới được cổng 41830.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">đọc</span><span class="lz-d">.dockerignore, tầng runtime của Dockerfile, cổng và trần RAM của compose</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">bản chép sạch</span><span class="lz-d">không node_modules/dist/.env ⇒ .env mới ⇒ up --build --wait</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">như trình duyệt</span><span class="lz-d">trang, cache, đăng nhập, tải ảnh, xem ảnh, WebSocket qua 41830</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">ảnh &amp; dữ liệu</span><span class="lz-d">uid, không bí mật, PID 1, db không cổng, down/up, stop, giới hạn</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">dọn</span><span class="lz-d">down -v: không còn container, volume nào</span></div>
</div>

<h3>1. Script</h3>
<pre><code class="language-js">${SCRIPT}</code></pre>
<p>Ghi chú thiết kế: tên dự án riêng (<code>fsp-cp9</code>) nên không bao giờ đụng stack dev của bạn; cổng 41830 bị chiếm thì từ chối chạy thay vì đi kiểm container của người khác; tự tạo ảnh PNG bằng sharp nên bản chép không cần tệp mẫu; phép kiểm giới hạn đăng nhập chạy cuối vì nó tiêu hết lượt đăng nhập của IP này; việc dọn nằm trong <code>finally</code> và cả khi bấm Ctrl+C.</p>

<h3>2. Lần 1: bộ kiểm có hai lỗi</h3>
<div class="out">${CP_1}</div>
<p><strong>"db và kho không có cổng" trượt dù chúng không có cổng nào.</strong> Bản đầu hỏi <code>docker compose port db 5432</code> và mong mã thoát khác 0 — nhưng lệnh đó thoát 0 kể cả khi không công bố gì. Một phép kiểm không thể đạt cũng vô dụng như phép kiểm không thể trượt; giờ nó hỏi <code>docker port</code> của từng container và đòi kết quả rỗng.</p>
<p><strong>"fetch failed" ngay sau down/up</strong>, trong khi curl tay cùng lúc trả 200. <code>fetch</code> của Node giữ kết nối sống để dùng lại; sau <code>compose down</code> socket cũ đã chết và request kế tiếp hỏng với <code>UND_ERR_SOCKET</code>. Trình duyệt tự thử lại loại request này; script cũng phải vậy. Bản sửa in ra khi chuyện đó xảy ra, nên bạn thấy nó ở lần 3.</p>

<h3>3. Lần 2: Checkpoint 8 trượt vì một lý do không phải lỗi của bộ test</h3>
<div class="out">${CP_2}</div>
<p>Checkpoint 8 cài 8 lỗi rồi kiểm "mã nguồn đã trả về nguyên trạng" bằng <code>git diff --quiet</code> — so với HEAD. Chương này sửa <code>src/</code> (trust proxy, địa chỉ S3 công khai) mà chưa commit, nên phép kiểm trượt dù cả 8 lỗi đều bị bắt và mọi tệp đã được trả lại. Bộ kiểm giả định cây làm việc sạch thì hỏng đúng lúc bạn đang sửa dở. Giờ nó chụp <code>git diff</code> TRƯỚC khi cài lỗi rồi so với ảnh chụp đó.</p>

<h3>4. Lần 3</h3>
<div class="out">${CP_DU}</div>
<p>19 s để dựng và khởi động từ bản chép sạch, vì cache của BuildKit tính theo nội dung, không theo thư mục: tệp chép ra giống hệt nên mọi tầng <code>npm ci</code> được dùng lại. Trên máy nguội (máy chạy CI ở Chương 10) hãy chờ cỡ vài phút — bài 10.2 chia sẻ cache. Để ý dòng thử lại: có thật, vô hại, và hiện rõ.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — kiểm đúng cái stack đang tình cờ chạy.</strong> Kiểm <code>localhost:41830</code> trong lúc stack dev đang bật chỉ chứng minh stack dev của bạn chạy, dựng từ thư mục của bạn, với volume cũ của bạn. Script từ chối chạy khi cổng bị chiếm, dựng từ bản chép, và xoá volume của nó khi xong. Checkpoint chỉ đạt trên máy bạn thì không phải checkpoint.</p></div>

${spring(false, 'Khoá Spring có đúng checkpoint này: cả hệ thống bằng một lệnh, kiểm qua cửa chính. Bài lab kèm câu hỏi phỏng vấn của chương.', [
  ['sb-17-4-checkpoint-9', 'Spring Boot 17.4 — Checkpoint: cả hệ thống chạy bằng một lệnh'],
  ['sb-17-5-lab-17', 'Spring Boot 17.5 — Lab chương 17 + câu hỏi phỏng vấn'],
])}

<h3>Liên hệ đời thường</h3>
<p>Thử công thức nấu ăn trong bếp nhà mình chỉ chứng minh bạn nấu được. Đưa nó cho một người bạn có tủ lạnh trống cùng danh sách đồ cần mua mới chứng minh công thức đủ. Bản chép sạch chính là cái tủ lạnh trống.</p>

<h3>Tình huống đi làm thật</h3>
<p>Trong nhóm, người đầu tiên thử tệp compose của bạn thường là người mới nhất, vào ngày đầu tiên. Có gì hỏng thì thành "bạn mới làm sai gì đó" — trừ khi bạn đưa ra được một script chạy từ bản chép sạch và đạt 20/20. Đính kèm output vào pull request đưa Docker vào dự án.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Sao biết docker-compose của bạn chạy được cho người khác?"</strong> — Chạy từ bản clone sạch với bí mật mới và chỉ kiểm qua cổng công khai; CI làm đúng như vậy.</li>
<li><strong>"Kiểm container healthy chứ không chỉ running thế nào?"</strong> — Healthcheck có chạm tới phụ thuộc, <code>--wait</code>, cộng một request từ đầu tới cuối.</li>
<li><strong>"Trước khi giao một ảnh bạn kiểm gì?"</strong> — Người dùng chạy, nội dung (không bí mật, không mã nguồn, không công cụ dev), PID 1, cổng mở, cỡ ảnh.</li>
<li><strong>"Bộ kiểm đạt ở máy bạn mà trượt trên CI — tìm ở đâu?"</strong> — Trạng thái cục bộ: cache, tệp chưa theo dõi, .env, container đang chạy, thay đổi chưa commit.</li>
</ol>

<h3>🧪 Checkpoint 9</h3>
<div class="callout ok">
<pre><code class="language-bash">docker compose down                  # nhả cổng 41830 (stack dev của bạn)
node scripts/checkpoint-9.mjs --bo-cp8   # chỉ phần Docker, ~1 phút khi cache nóng
node scripts/checkpoint-9.mjs            # + Checkpoint 8 (npm test, 8 lỗi cài thử), ~4 phút</code></pre>
<p><strong>Xong khi:</strong> 20/20 (21/21 khi gọi Checkpoint 8), <code>docker ps -a</code> và <code>docker volume ls</code> không còn gì của dự án <code>fsp-cp9</code>, và bạn đã tự phá bộ kiểm ít nhất một lần (vd bỏ <code>^~</code> ở <code>/chiase/</code>, hoặc đặt <code>TRUST_PROXY: 0</code>) rồi thấy đúng dòng tương ứng chuyển ✘.</p>
<p><strong>Thang điểm (10):</strong> bản chép sạch dựng và chạy bằng một lệnh (2) · mọi thứ qua một cổng: trang, API, tải ảnh, WebSocket (3) · vệ sinh ảnh: không root, không bí mật/mã nguồn/công cụ, node là PID 1 (2) · dữ liệu sống qua down/up, tắt êm, CSDL kín (2) · giới hạn đăng nhập đúng sau proxy (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Nhánh <code>ch9/docker</code>: <code>scripts/checkpoint-9.mjs</code> in ở trên; bản sửa ảnh chụp trong <code>scripts/checkpoint-8.mjs</code> (<code>diffTruoc</code>).</p>
</details>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Checkpoint cho "một lệnh" phải bắt đầu từ bản chép không node_modules, dist, .env.</li>
<li>Kiểm qua cổng công khai duy nhất, như người dùng: trang, cache, đăng nhập, tải ảnh, xem ảnh, WebSocket.</li>
<li>Kiểm chính cái ảnh: uid, nội dung, PID 1, CSDL không có cổng.</li>
<li>Kiểm bộ kiểm: một phép kiểm không bao giờ đạt và một kết nối keep-alive chết là lỗi của script, không phải của ChiaSe.</li>
<li>Bộ kiểm không được giả định cây làm việc sạch: so với ảnh chụp, không so với HEAD.</li>
</ul>
${THE}
</div>
`,
};
