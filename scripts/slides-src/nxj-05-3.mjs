/*DU_LIEU*/
const DU_LIEU = {
 "n5-3:file:src/app/hai-lan/page.tsx": "'use client';\nimport { useEffect, useRef, useState } from 'react';\n\nconst nhatKy: string[] = [];\nfunction GhiLog() {\n  useEffect(() => {\n    nhatKy.push('run');\n    return () => { nhatKy.push('clean'); };\n  }, []);\n  return null;\n}\n\nconst ketNoi = { thieu: { mo: 0, nhip: 0 }, du: { mo: 0, nhip: 0 } };\nfunction KetNoi({ ten, donDep }: { ten: 'thieu' | 'du'; donDep: boolean }) {\n  useEffect(() => {\n    const k = ketNoi[ten];\n    k.mo++;                                          // mở một kết nối\n    const id = setInterval(() => { k.nhip++; }, 100);\n    if (!donDep) return;                             // ✗ không dọn\n    return () => { k.mo--; clearInterval(id); };     // ✓ đóng đúng cái đã mở\n  }, [ten, donDep]);\n  return null;\n}\n\nconst chot = { post: 0, mo: 0 };\nfunction ChotRef() {\n  const ran = useRef(false);\n  useEffect(() => {\n    if (ran.current) return;                         // ✗ chốt \"chỉ chạy một lần\"\n    ran.current = true;\n    chot.post++;                                     // giả lập POST analytics\n    chot.mo++;                                       // mở kết nối\n    return () => { chot.mo--; };                     // đóng kết nối\n  }, []);\n  return null;\n}\n\nif (typeof window !== 'undefined') Object.assign(window, { __nhatKy: nhatKy, __ketNoi: ketNoi, __chot: chot });   // để đo\n\nexport default function HaiLan() {\n  const [k, setK] = useState(0);\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <GhiLog />\n      <KetNoi ten=\"thieu\" donDep={false} />\n      <KetNoi ten=\"du\" donDep />\n      <ChotRef key={k} />\n      <p>Trang đo effect chạy mấy lần <button id=\"gan-lai\" onClick={() => setK(k + 1)} className=\"rounded border px-2\">gắn lại ChotRef (đổi key)</button></p>\n    </div>\n  );\n}\n",
 "n5-3:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|hai-lan'\n✓ Compiled successfully in 1158ms\n├ ○ /hai-lan",
 "n5-3:mo": "$ curl -s -o /dev/null -w 'next start GET /hai-lan → %{http_code}\\n' localhost:19341/hai-lan\nnext start GET /hai-lan → 200\n$ curl -s -o /dev/null -w 'next dev   GET /hai-lan → %{http_code}\\n' localhost:19340/hai-lan\nnext dev   GET /hai-lan → 200",
 "n5-3:dung": "",
 "anh-nxj-5-3:hl-dev": {
  "url": "http://127.0.0.1:19340/hai-lan",
  "vp": [
   640,
   160
  ],
  "rect": {
   "#gan-lai": [
    266,
    24,
    219,
    30
   ]
  },
  "console": [
   {
    "kieu": "info",
    "chu": "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold"
   },
   {
    "kieu": "log",
    "chu": "[HMR] connected"
   }
  ],
  "ketQua": {
   "log": "[\"run\",\"clean\",\"run\"]",
   "ketNoi": {
    "thieu": {
     "mo": 2,
     "nhipGiay": 20
    },
    "du": {
     "mo": 1,
     "nhipGiay": 10
    }
   },
   "chotTai": "{\"post\":1,\"mo\":0}",
   "chotGanLai": "{\"post\":2,\"mo\":0}",
   "logSau": "[\"run\",\"clean\",\"run\"]"
  }
 },
 "anh-nxj-5-3:hl-start": {
  "url": "http://127.0.0.1:19341/hai-lan",
  "vp": [
   640,
   160
  ],
  "rect": {
   "#gan-lai": [
    266,
    24,
    219,
    30
   ]
  },
  "console": [],
  "ketQua": {
   "log": "[\"run\"]",
   "ketNoi": {
    "thieu": {
     "mo": 1,
     "nhipGiay": 10
    },
    "du": {
     "mo": 1,
     "nhipGiay": 10
    }
   },
   "chotTai": "{\"post\":1,\"mo\":1}",
   "chotGanLai": "{\"post\":2,\"mo\":1}",
   "logSau": "[\"run\"]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, cmp, tiers, path } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-05-3', code: 'NXJ 5.3', title: 'Why effects run twice in dev', sub: 'Chapter 5 · Lesson 5.3' };
const O = (k) => { const v = DU_LIEU[`n5-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-5-3:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const J = (s) => JSON.parse(s);
const DV = AN('hl-dev').ketQua, ST = AN('hl-start').ketQua;
const P = O('file:src/app/hai-lan/page.tsx');
for (const s of ["nhatKy.push('run');", "return () => { nhatKy.push('clean'); };", 'if (!donDep) return;', 'return () => { k.mo--; clearInterval(id); };', 'if (ran.current) return;', 'return () => { chot.mo--; };'])
  if (!P.includes(s)) throw new Error('hai-lan/page.tsx không có: ' + s);
const CD = J(DV.chotTai), CDG = J(DV.chotGanLai), CS = J(ST.chotTai), CSG = J(ST.chotGanLai);
if (DV.log !== '["run","clean","run"]' || ST.log !== '["run"]' || DV.ketNoi.thieu.mo !== 2 || DV.ketNoi.thieu.nhipGiay !== 20 || DV.ketNoi.du.mo !== 1 || DV.ketNoi.du.nhipGiay !== 10
  || ST.ketNoi.thieu.mo !== 1 || ST.ketNoi.thieu.nhipGiay !== 10 || CD.post !== 1 || CD.mo !== 0 || CDG.post !== 2 || CDG.mo !== 0 || CS.mo !== 1 || CSG.post !== 2 || CSG.mo !== 1)
  throw new Error('số đo 5.3 đổi — xem lại slide');

export const S = [
  { cover: true, nhan: 'Chapter 5 · Lesson 5.3', t: '"My effect runs twice!"<br>— React is helping you', sub: 'In development, Strict Mode mounts, unmounts and mounts again — a free test of your cleanup',
    en: 'Lesson five point three: why effects run twice in development. Everyone is surprised by it. It is not a bug, and you must not fix it by removing Strict Mode: React is deliberately testing your cleanup, so a real bug shows up on your machine instead of in production.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What Strict Mode does: mount → unmount → mount — <b>measured</b> in dev and in production</li>
    <li>Why React does it: the cheapest test for a missing cleanup</li>
    <li>A missing cleanup, doubled in dev — <b>measured</b></li>
    <li>The fix is always the same: an idempotent setup/cleanup pair</li>
    <li>The ref-guard trap — <b>measured</b>: it breaks dev and does not even stop real remounts</li></ul>`,
    en: 'Five takeaways: what Strict Mode does, measured in development and production; why React does it; a missing cleanup doubled in dev, measured; the fix, an idempotent pair; and the ref-guard trap, measured — it breaks development and does not even stop real remounts.' },
  { t: 'Strict Mode: mount, unmount, mount — measured', body: two(tsx(`function GhiLog() {
  useEffect(() => {
    nhatKy.push('run');
    return () => { nhatKy.push('clean'); };
  }, []);
  return null;
}`, { hl: [3, 4] }),
      D(cmp(['Same page', 'Effect log after load'], [[c('next dev'), `<code>${DV.log}</code>`], [c('next start'), `<code>${ST.log}</code>`]], { hl: [0] }),
        box('Dev only, on purpose', 'Next.js turns on React Strict Mode in development. On the first mount of every component it runs each effect, its cleanup, then the effect again. The production build runs it once.', 'lam'))) +
    path([{ t: 'mount', s: 'effect: run' }, { t: 'simulated unmount', s: 'cleanup: clean', mau: '#c0392b' }, { t: 'mount again', s: 'effect: run', on: true }], { h: 130, fs: 20 }),
    en: 'Strict Mode, measured. An effect that logs run in its setup and clean in its cleanup, on one page served two ways. Under next dev the log after load is run, clean, run. Under next start, the production build, it is just run. Next.js enables React Strict Mode in development: on the first mount, every effect runs, is cleaned up, and runs again.' },
  { t: 'Why on earth would React do that?', body: tsx(`useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);   // ← without this line,
}, []);                             //   Strict Mode leaves 2 intervals`, { hl: [3] }) +
      icards([
        ['warn', 'The most common effect bug', 'A setup with no matching cleanup: a connection never closed, an interval never cleared, a listener never removed.'],
        ['bolt', 'Run it twice, see it at once', 'Two runs without a cleanup leave two connections, two intervals — the bug shows up immediately, on your machine.'],
        ['check', 'The pass mark', 'An effect that survives two runs with no harm is a correct effect.'],
      ], 3),
    en: 'Why would React do that? Because it is the cheapest possible way to catch the most common effect bug: a setup without a matching cleanup. If your effect opens a connection, starts an interval or adds a listener without returning a cleanup, running it twice leaves two of them — and the bug appears right away on your machine, instead of as a slow leak in production.' },
  { t: 'A missing cleanup, doubled in dev — measured', body: tsx(`function KetNoi({ ten, donDep }) {
  useEffect(() => {
    const k = ketNoi[ten];
    k.mo++;                                          // open a connection
    const id = setInterval(() => { k.nhip++; }, 100);
    if (!donDep) return;                             // ✗ no cleanup
    return () => { k.mo--; clearInterval(id); };     // ✓ close what was opened
  }, [ten, donDep]);
}`, { sm: true, hl: [6, 7] }) + cmp(['After load', 'next dev', 'next start'], [
      ['no cleanup: open connections', `<b>${DV.ketNoi.thieu.mo}</b>`, `<b>${ST.ketNoi.thieu.mo}</b>`],
      ['no cleanup: ticks per second', `<b>${DV.ketNoi.thieu.nhipGiay}</b>`, `<b>${ST.ketNoi.thieu.nhipGiay}</b>`],
      ['with cleanup: open connections · ticks/s', `<b>${DV.ketNoi.du.mo} · ${DV.ketNoi.du.nhipGiay}</b>`, `<b>${ST.ketNoi.du.mo} · ${ST.ketNoi.du.nhipGiay}</b>`],
    ], { hl: [0, 1] }) + box('Read it as a gift', 'In production the leaky version looks fine — until the component remounts. In dev, Strict Mode remounted it once and the leak was already visible: 2 connections, 20 ticks a second.', 'xanh'),
    en: 'A missing cleanup, doubled in dev, measured. A component that opens a connection and starts a one-hundred-millisecond interval. Without a cleanup, after loading under next dev: two open connections and twenty ticks a second; under next start: one and ten — it looks fine. With the cleanup: one connection and ten ticks in both. The dev double run showed the leak immediately.' },
  { t: 'The fix is always the same: make the effect idempotent', body: cmp(['If the setup does…', 'the cleanup does…'], [
      ['subscribe', 'unsubscribe'], [`${c('setInterval')} / ${c('setTimeout')}`, `${c('clearInterval')} / ${c('clearTimeout')}`],
      [c('addEventListener(type, fn)'), `${c('removeEventListener(type, fn)')} — the same function`], ['open a connection', 'close / disconnect'], [c('fetch(…)'), 'ignore the result or abort it (Lesson 5.5)'],
    ]) + box('Do not ask "is this the second run?"', 'That fights the tool. Make setup and cleanup a perfect pair, so that running the pair any number of times leaves the world in the same state. If you cannot write a cleanup for something, it probably does not belong in an effect — Lesson 5.4.', 'lam'),
    en: 'The fix is always the same: make the effect idempotent. Do not try to detect the second run — that fights the tool. Pair every setup with a cleanup that undoes it: subscribe and unsubscribe, set and clear an interval, add and remove a listener with the same function, open and close a connection. Then running the pair any number of times leaves the world in the same state.' },
  { t: 'The ref-guard trap — measured', body: tsx(`function ChotRef() {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;    // ✗ "only once"
    ran.current = true;
    chot.post++;                // analytics POST
    chot.mo++;                  // open a connection
    return () => { chot.mo--; };// close it
  }, []);
}`, { sm: true, hl: [4] }) + two(cmp(['', 'dev: POSTs', 'dev: open', 'start: POSTs', 'start: open'], [
        ['after load', CD.post, `<b>${CD.mo}</b>`, CS.post, CS.mo],
        ['after a remount (key)', `<b>${CDG.post}</b>`, `<b>${CDG.mo}</b>`, `<b>${CSG.post}</b>`, CSG.mo],
      ], { hl: [0, 1] }), box('It hides one bug and adds another', 'In dev the guard let the cleanup close the connection, then blocked the setup from reopening it: <b>0 open</b>. And a real remount creates a new ref, so the POST ran <b>again</b> anyway — the guard never guaranteed "once".', 'do2'), 'r64'),
    en: 'The ref-guard trap, measured. An effect sends an analytics POST and opens a connection, and someone adds a ref guard so it only happens once. In dev, the POST count is one — silence — but the open connection count is zero: the cleanup closed it and the guard blocked the setup from reopening it. And after a real remount, a key change, the ref is new: the POST ran again, in dev and in production. The guard never guaranteed once.' },
  { t: 'The honest fixes', body: tiers([
      ['shield', 'Make the operation idempotent', 'send an id; the server deduplicates — running twice is harmless', '#15803d'],
      ['bolt', 'Move it out of the effect', 'a POST caused by a click belongs in the click handler (Lesson 5.4)', '#0070f3'],
      ['trash', 'Never: turn off Strict Mode', 'it hides the symptom and keeps the bug', '#c0392b'],
    ], { th: 80, gap: 24 }) + box('How cuongthai.com does it', 'Strict Mode stays on in dev. The Socket.IO connection, the <code>window</code> listeners and the feed\'s IntersectionObserver each pair setup with a cleanup, so the double invoke leaves exactly one live connection or observer. When a feature "connects twice" in dev, the fix is the missing cleanup.', 'lam'),
    en: 'The honest fixes. Make the operation idempotent — send an id the server deduplicates on — so running twice is harmless. Or move it out of the effect: a POST caused by a click belongs in the click handler, where it happens exactly as often as the user asked. Never turn off Strict Mode. cuongthai.com keeps it on: its Socket.IO connection, window listeners and IntersectionObserver each pair setup with cleanup.' },
  { t: 'Why Strict Mode runs your effects twice — in four lines', body: steps([
      '<b>Development only, Strict Mode only</b> — the production build runs once. It is a test React runs on your code, not behaviour your users see',
      '<b>It mounts, unmounts, then mounts again</b> — so the sequence is effect, cleanup, effect. If your cleanup is right, the end state is identical to running once',
      '<b>Doubled results mean a missing cleanup</b> — two sockets, two listeners, two requests: each is exactly the bug that appears in production when the component remounts',
      '<b>So do not switch it off</b> — the double invoke is finding a real defect. Removing Strict Mode hides the symptom and keeps the bug',
    ]),
    en: 'In four lines. Development only, Strict Mode only. It mounts, unmounts and mounts again — effect, cleanup, effect — and with a correct cleanup the end state is the same. Doubled results mean a missing cleanup. So do not switch it off.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Strict Mode', 'a dev-only wrapper that runs effects twice to expose bugs'), kw('Dev vs production', 'the double run happens only in development'),
      kw('Idempotent effect', 'safe to run twice because it cleans up after itself'), kw('Mount / unmount probe', 'mount, clean up, mount again'),
      kw('Missing cleanup', 'the leak the double run makes visible'), kw('Ref guard', 'if (ran.current) return — hides the test, breaks the effect'),
      kw('Remount', 'a new instance (key or route change): refs start fresh'), kw('Deduplicate', 'the server ignores a repeated id — safe retries'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: Strict Mode; dev versus production; idempotent effect; the mount and unmount probe; missing cleanup; ref guard; remount; and deduplicate.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Log in an effect with ${c('[]')}; run ${c('next dev')} — twice; then build + start — once`,
      'Add a cleanup that logs, and read the run → clean → run sequence',
      'Start an interval without a cleanup in dev and count the ticks; add the cleanup and count again',
      'Explain why the double run is a feature that exposes missing cleanup, not a bug to silence',
    ]), box('Keep these', `<ul><li>Dev double run = a free cleanup test</li><li>Doubled resources ⇒ a cleanup is missing</li><li>Fix the pair, never the probe</li><li>No ref guards, no turning off Strict Mode</li></ul>`, 'lam'), ''),
    en: 'Your turn: log in an effect with an empty array and compare dev and production; add a cleanup that logs and read run, clean, run; start an interval without a cleanup and count ticks, then add the cleanup; and explain why the double run is a feature. Keep: the dev double run is a free cleanup test; doubled resources mean a missing cleanup; fix the pair, never the probe.' },
];
export const slides = lamDeck({ chuong: 'Chapter 5 — Effects', bai: '5.3' }, S);
