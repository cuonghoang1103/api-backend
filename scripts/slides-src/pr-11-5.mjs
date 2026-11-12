/**
 * pr-11-5 — Prisma ORM · Chapter 11 · Lesson 11.5 "One client, and how it should die" (deck video, 12/11/2026). Bài web: pr-11-5-vong-doi-client.
 * Output THẬT (`chay.sh p11-5` → out/p11-5/vong-doi.txt; prisma-pg PostgreSQL 16.14, CSDL c115; Prisma 6.19.3; Mac arm64, Node 26 + tsx; Docker Desktop 29.8, node:22-alpine):
 * client mỗi request ⇒ 10/20/30 kết nối sau 10/20/30 request, 0 sau khi tiến trình thoát · nạp lại module 10 lần ⇒ 10 kết nối, globalThis ⇒ 1 ·
 * SIGTERM khi đang có truy vấn 2 s: prisma-trước ⇒ $disconnect chờ truy vấn, request thứ hai (1,0 s) vẫn được nhận, pool mở lại, thoát 3,2 s; http-trước ⇒ request thứ hai bị từ chối, thoát 2,1 s; cả hai request đầu 200 ·
 * docker stop -t 10: node PID 1 không bắt ⇒ 10 s, exit 137; --init ⇒ 0 s, 143; có bắt SIGTERM ⇒ 0 s, 0 · log query in params (email, số điện thoại, địa chỉ).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p11-5/vong-doi.txt": "$ bash p11/115/chay.sh\nThe following migration(s) have been applied:\n== 1. Mỗi request một client\n$ npx tsx moi-request.mts\nsau 10 request: 10 kết nối mở tới CSDL\nsau 20 request: 20 kết nối mở tới CSDL\nsau 30 request: 30 kết nối mở tới CSDL\n   (sau khi tiến trình thoát: 0 kết nối)\n== 2. Hot reload trong cùng tiến trình (kiểu Next.js dev)\n$ npx tsx nap-lai.mts db-tran.mts     # client ở phạm vi module\ndb-tran.mts: nạp lại 10 lần ⇒ 10 kết nối mở\n$ npx tsx nap-lai.mts db-global.mts   # client gắn vào globalThis\ndb-global.mts: nạp lại 10 lần ⇒ 1 kết nối mở\n== 3. Thứ tự tắt khi có một request đang chạy (truy vấn 2 giây)\n$ THU_TU=prisma-truoc node --import tsx server.mts & ; curl /cham & ; 0,5 s: kill -TERM ; 1,0 s: curl /cham lần 2\n   [curl] 200 xong truy vấn\n   [curl] exit=0\n   [curl 2, gửi lúc 1,0 s] 200 xong truy vấn\n   [curl 2] exit=0\n   [server] nghe cổng 3115\n   [SIGTERM] bắt đầu tắt dần (0.6s)\n   [tắt] prisma đã ngắt (3.2s)\n   [tắt] http đã đóng (3.2s)\n   [server] exit=0\n$ THU_TU=http-truoc node --import tsx server.mts & ; curl /cham & ; 0,5 s: kill -TERM ; 1,0 s: curl /cham lần 2\n   [curl 2] exit=0\n   [curl] 200 xong truy vấn\n   [curl] exit=0\n   [server] nghe cổng 3115\n   [SIGTERM] bắt đầu tắt dần (0.6s)\n   [tắt] http đã đóng (2.1s)\n   [tắt] prisma đã ngắt (2.1s)\n   [server] exit=0\n== 4. Node là PID 1 trong container (docker stop -t 10 = hạn mặc định của compose; Docker Desktop 29.8)\n$ docker run  node:22-alpine node khong-bat.js ; docker stop -t 10   (node: PID 1)\n   docker stop mất 10 s · exit code 137 · log: nghe 3000, pid 1\n$ docker run --init node:22-alpine node khong-bat.js ; docker stop -t 10   (docker-init: PID 1)\n   docker stop mất 0 s · exit code 143 · log: nghe 3000, pid 7\n$ docker run  node:22-alpine node co-bat.js ; docker stop -t 10   (node: PID 1)\n   docker stop mất 0 s · exit code 0 · log: nhận SIGTERM, đóng\n== 5. log query in ra gì\n$ npx tsx log-params.mts\nprisma:query SELECT \"public\".\"users\".\"id\" FROM \"public\".\"users\" WHERE (\"public\".\"users\".\"email\" = $1 AND 1=1) LIMIT $2 OFFS\nprisma:query params: [\"an@vidu.com\",1,0] · 4 ms\nprisma:query UPDATE \"public\".\"users\" SET \"ho_ten\" = $1 WHERE (\"public\".\"users\".\"email\" = $2 AND 1=1) RETURNING \"public\".\"us\nprisma:query params: [\"SĐT 0912 345 678, nhà 12 ngõ 3\",\"an@vidu.com\"] · 1 ms\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, two, box, cards, c, tbl, steps, icards, cmp, bars, tiers, flow, ts, tc, vsd, hai_phien } from './_pr-chung.mjs';

export const deck = { key: 'pr-11-5', code: 'PR 11.5', title: 'One client, and how it should die', sub: 'Chapter 11 · Lesson 11.5' };

const DEMO = 'demo';
const L = fs.readFileSync(`${DEMO}/out/p11-5/vong-doi.txt`, 'utf8').replace(/\n+$/, '').split('\n').filter((l) => !/^\$ bash /.test(l));
const khoi = (tu, den) => { const a = L.findIndex((l) => l.startsWith(tu)); const b = den ? L.findIndex((l, i) => i > a && l.startsWith(den)) : L.length; return L.slice(a, b < 0 ? L.length : b).filter((l) => l.trim() !== ''); };
const MOI = 'terminal — PostgreSQL 16.14 · Prisma 6.19.3 · Mac arm64';
const T = (s, o = {}) => tc(s, { title: MOI, ...o });

export const slides = lamDeck({ chuong: 'Chapter 11 — Shipping to production', bai: '11.5' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 11 · Lesson 11.5', t: 'One client, and how it should die', sub: 'A PrismaClient owns a pool — count the pools, then shut them down in order' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['db', 'One client per process', 'What a client per request costs'],
      ['loop', 'Hot reload and globalThis', 'Measured: 10 pools vs 1'],
      ['power', 'Node as PID 1', 'SIGTERM, SIGKILL and exit code 137'],
      ['list', 'Shutdown order', 'HTTP first, Prisma second — and why'],
      ['eye', 'The query log is user data', ''],
    ], 2) },
  /* 3 */ { t: 'A client per request: a pool per request', body: two(ts(`app.get('/posts', async (req, res) => {
  const prisma = new PrismaClient(); // ❌ new pool
  res.json(await prisma.post.findMany());
}); // never disconnected`, { sm: true }), T(khoi('$ npx tsx moi-request.mts', '== 2.').join('\n'), { wrap: 58, fs: 14 }), '') +
      bars([['after 10 requests', 10, '#b85a2b'], ['after 20 requests', 20, '#b85a2b'], ['after 30 requests', 30, '#c62828']], { don: 'connections', nhan: 220, fs: 16, rh: 34 }) +
      box('One per process, imported everywhere', 'Each client opened its own connection and kept it until the process exited. At 100 requests you reach PostgreSQL&#39;s default max_connections.', 'do2') },
  /* 4 */ { t: 'Hot reload, and the globalThis pattern', body: ts(`// src/lib/prisma.ts
const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') g.prisma = prisma;`, { sm: true }) + T(khoi('$ npx tsx nap-lai.mts db-tran', '== 3.').join('\n'), { wrap: 112, fs: 14 }) +
      cmp(['', 'Reload replaces…', 'Pools after 10 reloads'], [
        ['Module-scope client', 'the module, and with it a new client', '10'],
        ['globalThis client', 'the module — globalThis survives', '1'],
        ['Process restart (tsx watch, nodemon)', 'the whole process: pools close on exit', '0 left behind'],
      ], { hl: [1] }) },
  /* 5 */ { t: 'Node as PID 1 does not hear SIGTERM', body: T(khoi('== 4.', '== 5.').join('\n'), { wrap: 112, fs: 13 }) +
      cmp(['Container', 'docker stop -t 10', 'Exit code'], [
        [c('node khong-bat.js') + ' as PID 1', '10 s, then SIGKILL', '137'],
        [c('--init') + ' (or dumb-init) as PID 1', 'immediate', '143 — default SIGTERM action'],
        [c('node co-bat.js') + ' with a SIGTERM handler', 'immediate', '0 — it closed itself'],
      ], { hl: [0] }) +
      box('Linux gives PID 1 no default signal actions', 'A Node process started as CMD ["node", …] ignores SIGTERM unless it registers a handler. Compose waits its 10-second grace period, then kills — every in-flight request dies with it.', 'lam') },
  /* 6 */ { t: 'Shutting down: HTTP first, Prisma second', body: ts(`async function tatDan(sig: string) {
  if (dangTat) return; dangTat = true;          // SIGTERM can arrive twice
  setTimeout(() => process.exit(1), 9000).unref();   // hard deadline
  await new Promise<void>((ok) => server.close(() => ok()));  // 1. stop accepting
  await prisma.$disconnect();                               // 2. close the pool
  process.exit(0);
}
process.on('SIGTERM', () => tatDan('SIGTERM'));`, { sm: true }) + T(khoi('$ THU_TU=http-truoc', '== 4.').join('\n'), { wrap: 112, fs: 12 }) +
      box('A 2-second query was in flight when SIGTERM arrived', 'server.close() waits for open requests; the query finished, the pool closed, exit 0 at 2.1 s. A request sent at 1.0 s was refused — the load balancer should already have stopped sending.', 'xanh') },
  /* 7 */ { t: 'What the wrong order actually does — measured', body: T(khoi('$ THU_TU=prisma-truoc', '$ THU_TU=http-truoc').join('\n'), { wrap: 112, fs: 13 }) +
      hai_phien([
        ['0.6 s', 'SIGTERM → $disconnect() first', 'SIGTERM → server.close() first', ''],
        ['1.0 s', 'request 2 accepted — pool reopens', 'request 2 refused', 'the server is still listening on the left', '#fdecea'],
        ['2.1 s', 'still serving request 2', 'pool closed, exit 0', ''],
        ['3.2 s', 'exit 0', '', 'shutdown took 50% longer'],
      ], { a: 'Prisma first', b: 'HTTP first', fs: 15 }) },
  /* 8 */ { t: 'Health checks: alive is not ready', body: icards([
      ['pulse', 'Liveness: never touch the database', 'A database blip must not restart every container at once'],
      ['db', 'Readiness: may — and should', 'SELECT 1 with a short timeout; a saturated pool takes one instance out of rotation'],
      ['power', 'Readiness says "shutting down"', 'Return 503 the moment SIGTERM arrives, so traffic moves before server.close()'],
      ['clock', 'Give the check a deadline', 'A readiness check that waits ten seconds is itself a hang'],
    ], 2) + tiers([
      ['power', 'SIGTERM', 'readiness → 503', '#b85a2b'],
      ['server', 'server.close()', 'in-flight requests finish', '#336791'],
      ['db', 'prisma.$disconnect()', 'pool closes, exit 0', '#2f7d32'],
    ], { th: 52, gap: 18 }) },
  /* 9 */ { t: 'The query log is full of user data', body: T(khoi('$ npx tsx log-params.mts').join('\n'), { wrap: 112, fs: 13 }) +
      vsd(ts(`new PrismaClient({ log: ['query'] })   // params included`, { sm: true }) + '<p>An email, a phone number and a home address — now in your log store, readable by everyone who can read logs.</p>',
        ts(`prisma.$on('query', (e) => {
  if (e.duration < 100) return;  // slow only
  logger.warn({ q: e.query.slice(0, 200),
                ms: e.duration });  // no params
});`, { sm: true }), '✗ log: [\'query\']', '✓ events, sampled, no params') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Open a client per request; count connections`,
      `Reload a module 10 times, with and without globalThis`,
      `${c('docker stop')} a Node PID 1 with no handler; read the exit code`,
      `Shut down in both orders with a request in flight`,
      `Print ${c('e.params')} once — then never log it`,
    ]), box('Keep these', `<ul><li>One client per process</li><li>globalThis for in-process reload</li><li>Handle SIGTERM, or run an init</li><li>HTTP first, Prisma second</li><li>Never log params</li></ul>`, 'lam'), '') },
]);
