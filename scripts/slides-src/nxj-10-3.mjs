/*DU_LIEU*/
const DU_LIEU = {
 "n10-3:file:goi.sh": "#!/bin/bash\n# goi.sh <đường dẫn> — gọi trang 1 lần, in: giờ · tiêu đề x-nextjs-cache · giá trên trang · thời gian trả lời\nh=$(mktemp); b=$(mktemp)\nt=$(curl -s -D \"$h\" -o \"$b\" -w '%{time_total}' \"localhost:19386$1\")\nc=$(grep -i '^x-nextjs-cache' \"$h\" | tr -d '\\r' | cut -d' ' -f2); g=$(sed 's/<!-- -->//g' \"$b\" | grep -o 'giá [0-9]*' | head -1)\necho \"$(date +%T) $1 · x-nextjs-cache: ${c:--} · $g · ${t} s\"; rm -f \"$h\" \"$b\"\n",
 "n10-3:api": "",
 "n10-3:file:src/app/isr/page.tsx": "// trang tĩnh, làm mới theo thời gian: tối đa 10 giây một lần (bài dùng 60 — lab rút ngắn để đo)\nexport const revalidate = 10;\n\nexport default async function Isr() {\n  const d = await (await fetch('http://127.0.0.1:19385/gia?ms=800&isr=1')).json();   // API chậm 800 ms\n  return <p id=\"gia\">giá {d.gia} · API trả lúc {d.luc}</p>;\n}\n",
 "n10-3:thoigian": "$ npm run build\nRoute (app)           Revalidate  Expire\n├ ○ /isr                     10s      1y\n├ ○ /nghin/isr                1m      1y\n○  (Static)   prerendered as static content\n$ ./goi.sh /isr\n22:11:33 /isr · x-nextjs-cache: HIT · giá 100 · 0.021816 s\n$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo '   ← nguồn đổi'\n{\"gia\":250}   ← nguồn đổi\n$ ./goi.sh /isr\n22:11:33 /isr · x-nextjs-cache: HIT · giá 100 · 0.003175 s\n$ sleep 11; ./goi.sh /isr\n22:11:44 /isr · x-nextjs-cache: STALE · giá 100 · 0.003367 s\n$ sleep 2; ./goi.sh /isr\n22:11:46 /isr · x-nextjs-cache: HIT · giá 250 · 0.002557 s\n$ ./goi.sh /isr\n22:11:46 /isr · x-nextjs-cache: HIT · giá 250 · 0.002691 s\n$ (log API giả — các lượt /gia?ms=800&isr=1)\n  [api] 22:11:28.412 GET /gia?ms=800&isr=1 · lượt #1 · chờ 800 ms\n  [api] 22:11:44.847 GET /gia?ms=800&isr=1 · lượt #2 · chờ 800 ms",
 "n10-3:file:ban/sai-tag.ts": "import { revalidateTag } from 'next/cache';\n// đúng dòng của bài: một đối số\nrevalidateTag('courses');\n",
 "n10-3:file:src/app/the/page.tsx": "// trang tĩnh, fetch GẮN NHÃN 'gia' — chỉ làm mới khi có người gọi revalidateTag('gia', …)\nexport default async function The() {\n  const d = await (await fetch('http://127.0.0.1:19385/gia?the=1', { next: { tags: ['gia'] } })).json();\n  return <p id=\"gia\">giá {d.gia} · API trả lúc {d.luc}</p>;\n}\n",
 "n10-3:file:src/app/duong/page.tsx": "// trang tĩnh khác, fetch KHÔNG nhãn — làm mới bằng revalidatePath('/duong')\nexport default async function Duong() {\n  const d = await (await fetch('http://127.0.0.1:19385/gia?duong=1')).json();\n  return <p id=\"gia\">giá {d.gia} · API trả lúc {d.luc}</p>;\n}\n",
 "n10-3:file:src/app/api/lam-moi/route.ts": "import { revalidatePath, revalidateTag } from 'next/cache';\n\n// POST /api/lam-moi?tag=gia  hoặc  ?path=/duong   (trong ứng dụng thật: webhook của CMS, có kiểm khoá bí mật)\nexport async function POST(req: Request) {\n  const u = new URL(req.url);\n  const tag = u.searchParams.get('tag'), path = u.searchParams.get('path');\n  if (tag) revalidateTag(tag, 'max');      // Next.js 16: đối số thứ hai là BẮT BUỘC\n  if (path) revalidatePath(path);\n  return Response.json({ daLamMoi: tag ?? path });\n}\n",
 "n10-3:tag": "$ npx tsc --noEmit 2>&1 | grep -E 'sai-tag' | head -3\nban/sai-tag.ts(3,1): error TS2554: Expected 2 arguments, but got 1.\n$ npm run build\n├ ƒ /api/lam-moi\n├ ○ /duong\n├ ○ /the\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand\n$ ./goi.sh /the; ./goi.sh /duong\n22:10:43 /the · x-nextjs-cache: HIT · giá 100 · 0.021322 s\n22:10:43 /duong · x-nextjs-cache: HIT · giá 100 · 0.006925 s\n$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo '   ← nguồn đổi'\n{\"gia\":250}   ← nguồn đổi\n$ ./goi.sh /the; ./goi.sh /duong\n22:10:43 /the · x-nextjs-cache: HIT · giá 100 · 0.002407 s\n22:10:43 /duong · x-nextjs-cache: HIT · giá 100 · 0.002163 s\n$ curl -s -XPOST 'localhost:19386/api/lam-moi?tag=gia'; echo\n{\"daLamMoi\":\"gia\"}\n$ ./goi.sh /the; sleep 1; ./goi.sh /the; ./goi.sh /duong\n22:10:43 /the · x-nextjs-cache: STALE · giá 100 · 0.002805 s\n22:10:44 /the · x-nextjs-cache: HIT · giá 250 · 0.002925 s\n22:10:45 /duong · x-nextjs-cache: HIT · giá 100 · 0.002184 s\n$ curl -s -XPOST 'localhost:19386/api/lam-moi?path=/duong'; echo\n{\"daLamMoi\":\"/duong\"}\n$ ./goi.sh /duong; sleep 1; ./goi.sh /duong\n22:10:45 /duong · x-nextjs-cache: MISS · giá 250 · 0.012987 s\n22:10:46 /duong · x-nextjs-cache: HIT · giá 250 · 0.003469 s",
 "n10-3:file:src/app/nghin/dong/page.tsx": "// \"chữa nhanh\" một giá cũ: tắt MỌI cache của route\nexport const dynamic = 'force-dynamic';\n\nexport default async function Dong() {\n  const d = await (await fetch('http://127.0.0.1:19385/gia?ms=50&nghin=dong')).json();\n  return <p id=\"gia\">giá {d.gia}</p>;\n}\n",
 "n10-3:file:src/app/nghin/isr/page.tsx": "// công cụ hẹp nhất: làm mới đúng dữ liệu này mỗi 60 giây\nexport const revalidate = 60;\n\nexport default async function Isr60() {\n  const d = await (await fetch('http://127.0.0.1:19385/gia?ms=50&nghin=isr')).json();\n  return <p id=\"gia\">giá {d.gia}</p>;\n}\n",
 "n10-3:nghin": "$ npm run build\n├ ƒ /nghin/dong\n├ ○ /nghin/isr                1m      1y\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand\n$ for p in dong isr; do t=$( { /usr/bin/time -p bash -c \"for i in \\$(seq 100); do curl -s -o /dev/null localhost:19386/nghin/$p; done\"; } 2>&1 | awk '/real/{print $2}'); echo \"/nghin/$p · 100 lượt xem · $t s\"; done\n/nghin/dong · 100 lượt xem · 6.70 s\n/nghin/isr · 100 lượt xem · 1.13 s\n$ curl -s 127.0.0.1:19385/dem; echo\n{\"/gia?ms=50&nghin=dong\":100}",
 "n10-3:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, icards, seq, meter, path } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-10-3', code: 'NXJ 10.3', title: 'Revalidate: by time and on demand', sub: 'Chapter 10 · Lesson 10.3' };
const O = (k) => { const v = DU_LIEU[`n10-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const goc = (s) => s.replace(/\s+\/\/ .*$/gm, '');
const bo = (s) => s.split('\n').filter((l) => !l.startsWith('//')).join('\n');
const L = (k, re) => O(k).split('\n').filter((l) => !l.startsWith('$ ') && re.test(l));
const GOI = (k) => L(k, /x-nextjs-cache/).map((l) => { const m = /^(\S+) (\S+) · x-nextjs-cache: (\S+) · giá (\d+) · ([\d.]+) s/.exec(l); if (!m) throw new Error('dòng goi lạ: ' + l); return { gio: m[1], p: m[2], c: m[3], gia: +m[4], ms: Math.round(parseFloat(m[5]) * 1000) }; });

// ── số đo (chặn: dữ liệu đổi ⇒ deck không dựng)
const TG = GOI('thoigian'), TA = GOI('tag');
const BUILD_ISR = L('thoigian', /^(Route \(app\)|[├└┌] ○ \/isr )/);
const LOG_ISR = L('thoigian', /isr=1/).map((l) => l.trim().replace(/ · lượt.*$/, ''));
const TSC = L('tag', /TS2554/)[0];
const NG = L('nghin', /100 lượt xem/), DEM = JSON.parse(L('nghin', /^\{/)[0]);
const BUILD_NG = L('nghin', /^[├└┌].*\/nghin/);
if (TG.map((g) => `${g.c}${g.gia}`).join() !== 'HIT100,HIT100,STALE100,HIT250,HIT250' || TG[2].ms > 50 || LOG_ISR.length !== 2) throw new Error('số đo ISR 10.3 đổi');
if (!TSC || !/Expected 2 arguments, but got 1/.test(TSC)) throw new Error('tsc revalidateTag đổi');
if (TA.map((g) => `${g.p}${g.c}${g.gia}`).join() !== '/theHIT100,/duongHIT100,/theHIT100,/duongHIT100,/theSTALE100,/theHIT250,/duongHIT100,/duongMISS250,/duongHIT250') throw new Error('số đo theo yêu cầu đổi');
if (DEM['/gia?ms=50&nghin=dong'] !== 100 || DEM['/gia?ms=50&nghin=isr'] !== undefined || NG.length !== 2) throw new Error('số đo 100 lượt đổi');
const giay = (p) => parseFloat(NG.find((l) => l.includes(`/nghin/${p} `)).split(' · ')[2]);
const T_DONG = giay('dong'), T_ISR = giay('isr');
const hang = (ds) => ds.map((g) => [g.gio, g.p, `<b style="color:${g.c === 'STALE' ? '#c2410c' : g.c === 'MISS' ? '#7c3aed' : '#1f8a3b'}">${g.c}</b>`, g.gia, `${g.ms} ms`]);

export const S = [
  { cover: true, nhan: 'Chapter 10 · Lesson 10.3', t: 'Revalidate:<br>by time and on demand', sub: 'A cache that never lets go is dead data. Measured: the stale-while-revalidate window, revalidateTag vs revalidatePath, and the cost of force-dynamic',
    en: 'Lesson ten point three: revalidate. A cache that never lets go becomes dead data. We measure the stale-while-revalidate window request by request, compare revalidateTag and revalidatePath, and put a number on the cost of force-dynamic.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Time-based: <code>revalidate: N</code> — who sees the old page, who waits (nobody), measured</li>
    <li>On-demand: <code>revalidateTag</code> vs <code>revalidatePath</code> — not the same next request</li>
    <li>Next.js 16 changed <code>revalidateTag</code>: the lesson's one-argument call no longer compiles</li>
    <li>Mental model: <code>cache</code> decides <i>whether</i> to store, <code>revalidate</code> decides <i>when to let go</i></li>
    <li>The <code>force-dynamic</code> "fix", priced: 100 views, measured</li></ul>`,
    en: 'Five takeaways: time-based revalidation and who sees the old page; on-demand revalidation, where revalidateTag and revalidatePath do not give the same next request; the Next.js sixteen change that breaks the lesson\'s one-argument revalidateTag; the mental model; and the force-dynamic fix, priced.' },
  { t: 'Time-based: refresh at most every N seconds', body: two(D(tsx(goc(F('src/app/isr/page.tsx')).split('\n').filter((l) => !l.startsWith('//')).join('\n').replace("'http://127.0.0.1:19385/gia?ms=800&isr=1'", "API + '/gia'"), { sm: true, hl: [1] }),
      tsx(`// the same, for ONE fetch instead of the whole route:
await fetch(url, { next: { revalidate: 60 } });`, { sm: true }),
      tn(BUILD_ISR.join('\n'), { fs: 16, title: 'npm run build (real) — the new columns' })),
    D(box('Lab numbers', 'The lesson uses <b>60 s</b>; the lab uses <b>10 s</b> so we can watch it. The API is slow on purpose: <b>800 ms</b> per call.', 'lam'),
      box('ISR', 'Static page + a time limit = <b>Incremental Static Regeneration</b>. The build table shows it: <code>○</code> static, <b>Revalidate 10s</b>, <b>Expire 1y</b>.', 'xanh')), 'r64'),
    en: 'Time-based revalidation: export const revalidate equals N for a whole route, or next revalidate on one fetch. The lesson uses sixty seconds; the lab uses ten so we can watch it, and the API waits eight hundred milliseconds on purpose. The build table now shows the page as static, with Revalidate ten seconds and Expire one year. This is ISR — incremental static regeneration.' },
  { t: 'Measured: who sees the old page — and who waits', body: two(cmp(['time', 'page', 'x-nextjs-cache', 'price', 'answer'], hang(TG).map((r, i) => i === 1 ? [r[0], r[1] + ' <i>(source → 250)</i>', ...r.slice(2)] : r), { hl: [2] }),
      D(tn(LOG_ISR.join('\n'), { fs: 15, title: 'fake API log (real) — each call waits 800 ms' }),
        box('Stale-while-revalidate', `Inside the window: HIT, old price — fine, that is the deal. First visit <b>after</b> 10 s: <b>STALE</b> — the old page, in <b>${TG[2].ms} ms</b>, while the 800 ms refresh runs <i>behind</i> it (log: call #2 starts after that answer). Next visit: HIT, new price. <b>Nobody waited.</b>`, 'xanh')), ''),
    en: 'Measured, request by request. Inside the window the page is a HIT with the old price — that is the deal. The source changes to two fifty. The first visit after ten seconds gets STALE: the old page, in three milliseconds, while the eight hundred millisecond refresh runs behind it — the API log shows call number two starting after that answer. The next visit: HIT, two fifty. Nobody waited for the slow API.' },
  { t: 'The same story as a timeline', body: seq(['Visitor', 'Next.js (cached page)', 'API'], [
      [0, 1, 'GET /isr  (inside 10 s)'], [1, 0, 'HIT · 100', '#1f8a3b', true],
      [0, 1, 'GET /isr  (after 10 s)'], [1, 0, `STALE · 100 · ${TG[2].ms} ms`, '#c2410c', true], [1, 2, 'background: fetch (800 ms)', '#0070f3'], [2, 1, '250 → new page stored', '#0070f3', true],
      [0, 1, 'GET /isr'], [1, 0, 'HIT · 250', '#1f8a3b', true],
    ], { w: 1100, rh: 40, fs: 16, top: 52 }) + box('So "60 seconds" means…', 'The data is <b>at most one visit + 60 s</b> old — the visitor who triggers the refresh still gets the old copy. Good for listings and feeds; wrong for a balance or a stock count.', 'lam'),
    en: 'The same story as a timeline. Inside the window: HIT. After the window, the visitor gets STALE immediately and Next.js fetches in the background; the new page is stored, and the next visitor gets it. So sixty seconds really means at most one visit plus sixty seconds old — fine for listings and feeds, wrong for a balance or a stock count.' },
  { t: 'On demand: clear it exactly when the data changed', body: path([{ t: 'admin / CMS edits', s: 'the data changed' }, { t: 'POST /api/lam-moi', s: 'webhook or button' }, { t: 'revalidateTag / Path', s: 'drop the copy', on: true }, { t: 'next visit', s: 'new data', mau: '#1f8a3b' }], { h: 110, fs: 18 }) +
    two(tsx(goc(F('src/app/api/lam-moi/route.ts')).split('\n').filter((l) => !l.startsWith('//')).join('\n').replace(", path = u.searchParams.get('path');", ";\n  const path = u.searchParams.get('path');").replace("import { revalidatePath, revalidateTag } from", "import { revalidatePath, revalidateTag }\n  from"), { sm: true, hl: [7, 8] }),
      D(tsx(goc(F('src/app/the/page.tsx')).split('\n').filter((l) => !l.startsWith('//')).join('\n').replace("'http://127.0.0.1:19385/gia?the=1'", 'url').replace('fetch(url, {', 'fetch(url,\n    {'), { sm: true, hl: [3] }),
        box('Tags', 'Attach a tag when fetching — <code>next: { tags: [\'gia\'] }</code> — then one <code>revalidateTag(\'gia\', …)</code> invalidates every fetch carrying it, wherever it lives. <code>revalidatePath(\'/duong\')</code> targets one route.', 'lam')), 'r64'),
    en: 'On demand: clear the cache exactly when the data changed — here from a route handler that a CMS webhook could call. revalidateTag invalidates every fetch tagged with that name, wherever it lives; revalidatePath targets one route. Note the second argument of revalidateTag — next slide.' },
  { t: 'Next.js 16 trap: revalidateTag needs 2 arguments', body: two(D(tsx(`import { revalidateTag } from 'next/cache';
revalidateTag('courses');           // the lesson's line`, { sm: true, hl: [2] }),
      tn('$ npx tsc --noEmit\n' + TSC.replace(': error', ':\n  error'), { fs: 15, title: 'tsc (real) — next build stops here too' })),
    D(cmp(['Call (Next.js 16)', 'Next request'], [
      ['<code>revalidateTag(tag, \'max\')</code>', 'one more old copy, then new'],
      ['<code>updateTag(tag)</code>', 'Server Action only: expired now (Ch. 12)'],
      ['<code>revalidatePath(path)</code>', 'next visit re-renders: fresh'],
    ]), box('Fix', 'Write <code>revalidateTag(\'courses\', \'max\')</code>. In a Server Action, after the user\'s own write: <code>updateTag</code>.', 'xanh')), ''),
    en: 'The Next.js sixteen trap: the lesson\'s revalidateTag with one argument no longer compiles — tsc says expected two arguments, but got one, and next build stops at the same check. Pass a profile: revalidateTag with max gives stale-while-revalidate. In a Server Action, updateTag expires it immediately so the user reads their own write — chapter twelve.' },
  { t: 'Measured: tag vs path — the next request differs', body: cmp(['time', 'page', 'x-nextjs-cache', 'price', 'answer'], hang(TA).map((r, i) => {
      const ghi = { 2: ' <i>(source → 250)</i>', 4: ' <i>(after revalidateTag)</i>', 7: ' <i>(after revalidatePath)</i>' }[i];
      return ghi ? [r[0], r[1] + ghi, ...r.slice(2)] : r; }), { hl: [4, 7] }) +
    two(box('revalidateTag(\'gia\', \'max\')', '<code>/the</code>: one more <b>STALE</b> (100) while it refreshes, then HIT 250. <code>/duong</code> (no tag) was not touched: still 100.', 'cam'),
      box('revalidatePath(\'/duong\')', 'The very next visit: <b>MISS</b> — rendered on demand, <b>250</b>, in 13 ms. Then HIT.', 'tim'), ''),
    en: 'Measured: tag versus path. After revalidateTag with max, the tagged page gives one more STALE copy — one hundred — then two fifty; the other page, without the tag, is untouched. After revalidatePath, the very next visit is a MISS: rendered on demand with two fifty. Tag with max means one more old copy; path means the next visitor gets fresh data.' },
  { t: 'Which one fits your data?', body: icards([
      ['clock', 'Time-based (revalidate: N)', 'Data that drifts on its own and may be a little old: feeds, listings, stats, a leaderboard that can lag a minute.'],
      ['bolt', 'On demand (tag / path)', 'Data with a clear "it just changed" moment: publish, edit, delete. Call it from the code — or webhook — that made the change.'],
      ['layers', 'Both', 'Real apps combine them: <code>revalidate: 3600</code> as a safety net, plus <code>revalidateTag</code> on every write.'],
    ], 3) + box('Mental model', '<code>cache</code> decides <b>whether</b> to store. <code>revalidate</code> decides <b>when to let go</b>. Start uncached while building, cache what is slow or hit often, and give every cache a way to let go.', 'lam'),
    en: 'Which one fits? Time-based for data that drifts on its own and may be a little old. On demand for data with a clear it just changed moment — call it from the code that made the change. Real apps combine both. The mental model: cache decides whether to store, revalidate decides when to let go.' },
  { t: 'Pitfall: force-dynamic to fix one stale value — priced', body: two(D(tsx(bo(F('src/app/nghin/dong/page.tsx')).split('\n').slice(0, 1).join('\n') + '\n// vs\n' + bo(F('src/app/nghin/isr/page.tsx')).split('\n').slice(0, 1).join('\n'), { sm: true }),
      tn(BUILD_NG.join('\n'), { fs: 16, title: 'npm run build (real)' }),
      tn(NG.join('\n') + '\nAPI calls: ' + JSON.stringify(DEM), { fs: 15, title: '100 views each (real, API 50 ms)' })),
    D(meter([['force-dynamic', T_DONG, '#b91c1c', '100 API calls'], ['revalidate = 60', T_ISR, '#1f8a3b', '0 API calls']], { w: 560, nhan: 200, don: 's', fs: 17 }),
      box('The narrowest tool', `It "works" instantly — and opts the whole route out of every cache: <b>${DEM['/gia?ms=50&nghin=dong']} API calls</b> for 100 views, ${T_DONG} s vs ${T_ISR} s. A thousand visits an hour = a thousand DB round trips to keep one number fresh. Use <code>revalidate</code> on the stale fetch, or <code>revalidateTag</code> from the code that changes it — and check the ○/ƒ table.`, 'do2')), ''),
    en: 'The pitfall, priced. force-dynamic fixes one stale value instantly — and opts the whole route out of every cache. One hundred views: one hundred API calls, six point seven seconds. The same page with revalidate sixty: zero API calls, about one point one seconds. Use the narrowest tool — revalidate on the stale fetch, or revalidateTag from the code that changes it — and check the build table: f is dynamic, the circle is static.' },
  { t: 'Cheat sheet: how fresh, and how', body: cmp(['You want', 'Write', 'Next request after a change (measured)'], [
      ['changes only on deploy', 'a bare fetch in a static page', 'old until next build (revalidate 1 year)'],
      ['at most N s old', '<code>export const revalidate = N</code> / <code>next.revalidate</code>', 'HIT old → after N s: STALE old (3 ms) → new'],
      ['fresh right after a write', '<code>revalidatePath(path)</code>', 'MISS — re-rendered, new'],
      ['every fetch with a tag', '<code>revalidateTag(tag, \'max\')</code>', 'one more STALE, then new'],
      ['always live', '<code>cache: \'no-store\'</code> (route ƒ)', 'always new — and always a DB call'],
    ], { hl: [1] }),
    en: 'The cheat sheet. Changes only on deploy: a bare fetch in a static page. At most N seconds old: revalidate N — after the window, one stale copy, then new. Fresh right after a write: revalidatePath, the next visit re-renders. Every fetch with a tag: revalidateTag with max. Always live: no-store, and always a database call.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Revalidation', 'letting a cached value go, without a full rebuild'), kw('revalidate: N', 'time-based: at most every N seconds (ISR)'),
      kw('ISR', 'Incremental Static Regeneration — static pages refreshed over time'), kw('Stale-while-revalidate', 'serve the old copy now, refresh behind it'),
      kw('revalidateTag(tag, profile)', 'on demand, every fetch with that tag (16: 2 arguments)'), kw('revalidatePath', 'on demand, one route: next visit re-renders'),
      kw('updateTag', 'Server Action only: expire now, read your own write'), kw('x-nextjs-cache', 'HIT · STALE · MISS — the evidence'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: revalidation; revalidate N; ISR; stale-while-revalidate; revalidateTag with its profile; revalidatePath; updateTag; and the x-nextjs-cache header as evidence.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Add ${c('export const revalidate = 10')} to a static page; build: read the Revalidate column`,
      `Change the source, then call it with ${c('curl -D -')} before and after 10 s: HIT, STALE, HIT`,
      `Tag a fetch, call ${c("revalidateTag(tag, 'max')")} from a route handler; compare with ${c('revalidatePath')}`,
      `Write ${c("revalidateTag('x')")} with one argument and read the tsc error`,
    ]), box('Keep these', `<ul><li><code>cache</code> = whether · <code>revalidate</code> = when to let go</li><li>After N s: one STALE copy, nobody waits</li><li>Tag (max) ⇒ one more old copy · path ⇒ fresh</li><li>16: <code>revalidateTag(tag, profile)</code></li><li>Narrowest tool, not <code>force-dynamic</code></li></ul>`, 'lam'), ''),
    en: 'Your turn: add revalidate ten to a static page and read the build table; change the source and call it before and after ten seconds — HIT, STALE, HIT; tag a fetch and compare revalidateTag with revalidatePath; and write the one-argument revalidateTag to read the error. Keep: cache is whether, revalidate is when to let go; after the window one stale copy and nobody waits; tag with max gives one more old copy, path gives fresh; and pick the narrowest tool, not force-dynamic.' },
];
export const slides = lamDeck({ chuong: 'Chapter 10 — Data fetching, caching and revalidating', bai: '10.3' }, S);
