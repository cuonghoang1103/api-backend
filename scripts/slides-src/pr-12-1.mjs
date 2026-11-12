/**
 * pr-12-1 — Prisma ORM · Chapter 12 · Lesson 12.1 "The first five minutes" (deck video, 12/11/2026). Bài web: pr-12-1-nam-phut-dau.
 * Output THẬT (`chay.sh p12-1` → out/p12-1/su-co.txt; container riêng prisma-pg12 PostgreSQL 16, Prisma 6.19.3, Mac arm64): ứng dụng nhỏ (pool 5, pool_timeout 3) nhận ~50 request/s;
 * t≈2 s docker stop CSDL, t≈7 s docker start · lệnh 1: Exited (0) · lệnh 2: "Please make sure your database server is running" (errorCode undefined ở đường khởi tạo) ·
 * lệnh 3: idle 5 · lệnh 4: lỗi ĐẦU TIÊN P1017 lúc 2,2 s (5 lần = 5 kết nối của pool bị cắt), rồi P1001 × 180; hồi lại sau khi CSDL lên.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p12-1/su-co.txt": "$ bash p12/chay.sh su-co\n# t≈2 s: docker stop prisma-pg12 (giả lập: CSDL biến mất)\n$ docker ps -a --filter name=prisma-pg12 --format \"table {{.Names}}\\t{{.Status}}\"   # lệnh 1\nNAMES         STATUS\nprisma-pg12   Exited (0) 1 second ago\n$ node -e \"new PrismaClient().$queryRaw`SELECT 1` …\"                              # lệnh 2\nLOI undefined Please make sure your database server is running at `127.0.0.1:55493`.\n# t≈7 s: docker start prisma-pg12\n$ psql -c \"SELECT state, count(*) FROM pg_stat_activity WHERE datname = 'c12' GROUP BY state\"   # lệnh 3\n state | count \n-------+-------\n idle  |     5\n(1 row)\n\n$ grep -E \"P[0-9]{4}\" app.log | head -3                                            # lệnh 4: lỗi ĐẦU TIÊN\n[  2.2] P1017 — Server has closed the connection.\n[  2.2] P1017 — Server has closed the connection.\n[  2.2] P1017 — Server has closed the connection.\n$ grep -oE \" P[0-9]{4}|Prisma[A-Za-z]+Error\" app.log | sort | uniq -c                # đếm theo mã\n 180 P1001\n   5 P1017\n$ cat app.log   # (dòng thời gian, rút gọn)\n[  0.0] nghe cổng 3120\n[  2.2] P1017 — Server has closed the connection.\n[  2.3] P1001 — Please make sure your database server is running at `127.0.0.1:55493`.\n[  2.4] P1001 — Please make sure your database server is running at `127.0.0.1:55493`.\n[  2.5] P1001 — Please make sure your database server is running at `127.0.0.1:55493`.\n[  2.6] P1001 — Please make sure your database server is running at `127.0.0.1:55493`.\n[  2.7] P1001 — Please make sure your database server is running at `127.0.0.1:55493`.\n[  2.8] P1001 — Please make sure your database server is running at `127.0.0.1:55493`.\n[  1.0] ok × 45\n[ 11.0] ok × 10\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, two, box, cards, c, tbl, steps, icards, cmp, bars, tiers, flow, hub, tc } from './_pr-chung.mjs';

export const deck = { key: 'pr-12-1', code: 'PR 12.1', title: 'The first five minutes', sub: 'Chapter 12 · Lesson 12.1' };

const DEMO = 'demo';
const L = fs.readFileSync(`${DEMO}/out/p12-1/su-co.txt`, 'utf8').replace(/\n+$/, '').split('\n').filter((l) => !/^\$ bash /.test(l));
const khoi = (tu, den) => { const a = L.findIndex((l) => l.startsWith(tu)); const b = den ? L.findIndex((l, i) => i > a && l.startsWith(den)) : L.length; return L.slice(a, b < 0 ? L.length : b).filter((l) => l.trim() !== ''); };
const MOI = 'terminal — prisma-pg12 PostgreSQL 16 · Prisma 6.19.3 · Mac arm64';
const T = (s, o = {}) => tc(s, { title: MOI, ...o });
const LOG = (() => { const a = L.findIndex((l) => l.startsWith('$ cat app.log')); const xs = L.slice(a + 1); const seen = new Set(); return xs.filter((l) => { const k = l.replace(/^\[\s*[\d.]+\]\s*/, ''); if (/ok ×/.test(l)) return true; if (seen.has(k)) return false; seen.add(k); return true; }); })();

export const slides = lamDeck({ chuong: 'Chapter 12 — Diagnosing Prisma, and where to go next', bai: '12.1' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 12 · Lesson 12.1', t: 'The first five minutes', sub: 'Ordered triage beats an hour of guessing — rehearsed on a real outage' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['clock', 'Question 0: what changed?', 'Before "what is the error?"'],
      ['list', 'A triage order', 'Five questions, always in the same order'],
      ['search', 'Four commands', 'Run on a staged outage, outputs real'],
      ['flag', 'The first error, not the loudest', '5 lines versus 180'],
      ['warn', 'What not to do', 'Ranked by how much it costs'],
    ], 2) },
  /* 3 */ { t: 'Question 0 — what changed?', body: hub('what\nchanged?', [
      ['box', 'A deploy', 'docker inspect … Created'],
      ['layers', 'A migration', 'prisma migrate status'],
      ['wrench', 'A config / env var', 'the .env on the server'],
      ['db', 'The data', 'a table crossed a size'],
      ['server', 'The infrastructure', 'disk, certificate, restart'],
      ['code', 'The code', 'git log --oneline -10'],
    ], { h: 340 }) + box('A database that ran fine for weeks does not break by itself', 'Something moved. Answering "what changed in the last hour?" usually names the incident before any error message is read.', 'lam') },
  /* 4 */ { t: 'The triage order', body: tiers([
      ['power', '1 · Is the process alive?', 'docker ps — Restarting is Lesson 11.1', '#336791'],
      ['plug', '2 · Can it reach the database?', 'one query from inside the container', '#336791'],
      ['layers', '3 · Is the schema current?', 'prisma migrate status', '#336791'],
      ['gauge', '4 · Slow, or failing?', 'failing → codes (12.2) · slow → measure (9.1)', '#b85a2b'],
      ['eye', '5 · Everyone, or one user?', 'one user usually means data', '#2f7d32'],
    ], { th: 58, gap: 18 }) },
  /* 5 */ { t: 'A staged outage: the database disappears', body: flow([
      { t: '0 s', s: 'app: pool 5 · ~50 req/s' },
      { t: '2 s', s: 'docker stop the DB', mau: '#c62828' },
      { t: '3.5 s', s: 'run commands 1 and 2', mau: '#b85a2b' },
      { t: '7 s', s: 'docker start the DB', mau: '#2f7d32' },
    ], { h: 120, fs: 18 }) + T(khoi('$ docker ps -a', '# t≈7 s').join('\n'), { wrap: 112, fs: 14 }) +
      box('Commands 1 and 2 split the problem', 'The container is Exited, and one query from the app&#39;s side fails with "make sure your database server is running". Prisma is fine; the database is gone — two commands, two seconds.', 'lam') },
  /* 6 */ { t: 'Commands 3 and 4: the database&#39;s view, then the log', body: two(T(khoi('$ psql -c "SELECT state', '$ grep -E').join('\n'), { wrap: 58, fs: 13 }),
      T(khoi('$ grep -oE', '$ cat app.log').join('\n'), { wrap: 58, fs: 13 }), '') +
      bars([['P1001  can&#39;t reach database server', 180, '#b85a2b'], ['P1017  server closed the connection', 5, '#c62828', 'came FIRST']], { don: 'log lines', nhan: 360, fs: 16, rh: 38 }) +
      box('Two numbers, two different questions', 'Command 3 asks whether the database is back and the pool reconnected: five idle connections, yes. Command 4 asks what happened, in order — and the order matters more than the count.', 'lam') },
  /* 7 */ { t: 'Read the first error, not the loudest', body: T(LOG.join('\n'), { wrap: 112, fs: 13 }) +
      cards([
        ['2.2 s · P1017 × 5', 'The five pooled connections were cut the moment the database stopped. That is the event.'],
        ['2.3 s onward · P1001 × 180', 'Every request after that tried to connect and could not. Consequences, repeated.'],
        ['11 s · ok again', 'The database came back; the pool reconnected on its own. Nobody restarted the app.'],
      ], 3) },
  /* 8 */ { t: 'What not to do — in order of how much it costs', body: cmp(['Tempting command', 'What it does', 'Cost'], [
      [c('prisma migrate reset'), 'drops the database and replays history', 'every row'],
      [c('prisma db push') + ' on production', 'forces the schema, no migration record', 'history and DB disagree from then on'],
      [c('migrate resolve') + ' on a failed migration', 'marks it, without checking what ran', 'hides a partial apply (Lesson 12.2)'],
      ['raise ' + c('pool_timeout') + ' on P2024', 'turns fast failures into slow ones', 'the queue moves up the stack'],
      ['restart first', 'clears the symptom — and the evidence', 'pool state, metrics, log context'],
    ], { hl: [0] }) },
  /* 9 */ { t: 'Habits that shorten every incident', body: icards([
      ['clock', 'Write the timeline as you go', '2.2 s P1017 · 2.3 s P1001 · 7 s DB started · 11 s ok — three lines beat memory'],
      ['eye', 'Capture before you restart', 'docker logs --since, pg_stat_activity, migrate status — then act'],
      ['flag', 'Group by code', 'sort | uniq -c turns "errors are up" into a diagnosis'],
      ['check', 'Confirm the recovery', 'The same four commands, run again, all green'],
    ], 2) },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Run a small app under load; stop its database`,
      `Run the four commands while it is down`,
      `Start the database; watch the pool recover`,
      `Count log lines by code; find the first one`,
      `Write the three-line timeline`,
    ]), box('Keep these', `<ul><li>Ask what changed, first</li><li>Same order every time</li><li>First error, not the loudest</li><li>Capture before restarting</li></ul>`, 'lam'), '') },
]);
