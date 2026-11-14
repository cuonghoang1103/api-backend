/*DU_LIEU*/
const DU_LIEU = {
 "n20-3:file:src/app/ver/page.tsx": "// app/ver/page.tsx — a static page that says which version it is\nexport default function Page() {\n  return <main className=\"p-6\"><h1 className=\"text-2xl font-bold\">Release v1</h1></main>;\n}\n",
 "n20-3:file:src/app/env/khach/Hi.tsx": "'use client';\n// app/env/khach/Hi.tsx — a public value, pasted into the JS at build\nexport default function Hi() {\n  return <p id=\"pub\">NEXT_PUBLIC_SHOP_NAME = {process.env.NEXT_PUBLIC_SHOP_NAME}</p>;\n}\n",
 "n20-3:file:src/app/env/khach/page.tsx": "import Hi from './Hi';\nexport default function Page() { return <main className=\"p-6\"><Hi /></main>; }\n",
 "n20-3:file:.dockerignore": "node_modules\n.next\n.git\n",
 "n20-3:file:Dockerfile.simple": "# the lesson's Dockerfile, with the comments on their OWN lines\nFROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\n# install exact dependencies\nRUN npm ci\nCOPY . .\n# next build → the production build\nRUN npm run build\n# next start when the container runs\nCMD [\"npm\", \"start\"]\n",
 "n20-3:lab": "$ docker build -f Dockerfile.simple -t nxj-simple .\nbuilt nxj-simple in 149 s",
 "n20-3:file:next.config.ts": "import type { NextConfig } from \"next\";\n\nconst nextConfig: NextConfig = {\n  output: \"standalone\",\n  turbopack: {\n    rules: {\n      \"*.css\": {\n        loaders: [\"@tailwindcss/turbopack\"],\n        as: \"*.css\",\n      },\n    },\n  },\n};\n\nexport default nextConfig;\n",
 "n20-3:file:Dockerfile": "# Dockerfile — multi-stage + output: 'standalone'\nFROM node:22-alpine AS deps\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\n\nFROM node:22-alpine AS builder\nWORKDIR /app\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY . .\nARG NEXT_PUBLIC_SHOP_NAME\nENV NEXT_PUBLIC_SHOP_NAME=$NEXT_PUBLIC_SHOP_NAME\nRUN npm run build\n\nFROM node:22-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0\nCOPY --from=builder /app/public ./public\nCOPY --from=builder /app/.next/standalone ./\nCOPY --from=builder /app/.next/static ./.next/static\nUSER node\nCMD [\"node\", \"server.js\"]\n",
 "n20-3:std": "$ docker build -t nxj-std --build-arg NEXT_PUBLIC_SHOP_NAME=Alpha .\nbuilt nxj-std in 118 s\n$ docker build -t nxj-noarg .   # forgot the build arg\nbuilt nxj-noarg in 10 s (layers cached)\n$ docker images --format '{{.Repository}}  {{.Size}}' | grep -E '^nxj-(simple|std|noarg) ' | sort\nnxj-noarg  331MB\nnxj-simple  1.84GB\nnxj-std  331MB",
 "n20-3:chay": "$ docker run -d --name nxj-simple-c -p 127.0.0.1:19344:3000 nxj-simple >/dev/null; docker run -d --name nxj-std-c -p 127.0.0.1:19345:3000 nxj-std >/dev/null; docker run -d --name nxj-noarg-c -p 127.0.0.1:19346:3000 -e NEXT_PUBLIC_SHOP_NAME=Beta nxj-noarg >/dev/null; sleep 6; echo \"3 containers up\"\n3 containers up\n$ for p in 19344 19345; do echo \"$p /ver: $(curl -s http://127.0.0.1:$p/ver | grep -o 'Release v[0-9]' | head -1)\"; done\n19344 /ver: \n19345 /ver: Release v1\n$ docker ps -a --filter name=nxj-simple-c --format '{{.Names}}: {{.Status}}'; docker logs nxj-simple-c 2>&1 | tail -1; docker inspect -f 'CMD as Docker read it: {{json .Config.Cmd}}' nxj-simple\nnxj-simple-c: Exited (127) 6 seconds ago\n/bin/sh: [npm,: not found\nCMD as Docker read it: [\"/bin/sh\",\"-c\",\"[\\\"npm\\\", \\\"start\\\"]       # next start when the container runs\"]\n$ for c in nxj-std-c; do echo \"$c: $(docker exec $c du -sh /app | cut -f1) in /app · $(docker exec $c sh -c 'ls node_modules 2>/dev/null | wc -l' | tr -d ' ') packages in node_modules\"; done\nnxj-std-c: 67.8M in /app · 12 packages in node_modules\n$ curl localhost:3002/env/khach   # image built WITHOUT the arg, container started with -e NEXT_PUBLIC_SHOP_NAME=Beta\n19345: NEXT_PUBLIC_SHOP_NAME = Alpha\n19346: NEXT_PUBLIC_SHOP_NAME = ",
 "n20-3:libc": "$ for i in node:22-alpine node:22-slim; do echo \"$i: glibc $(docker run --rm $i node -p 'process.report.getReport().header.glibcVersionRuntime || \"none (musl)\"')\"; done\nnode:22-alpine: glibc none (musl)\nnode:22-slim: glibc 2.36\n$ docker run --rm nxj-std sh -c 'ls node_modules/@next 2>/dev/null; ls /app/node_modules/@next 2>/dev/null' | head -3; docker run --rm nxj-simple sh -c 'ls node_modules/@next | grep swc'\nenv\nenv\nswc-linux-arm64-gnu\nswc-linux-arm64-musl",
 "n20-3:kho": "$ grep -n '^FROM' frontend/Dockerfile Dockerfile.backend | head -6\nfrontend/Dockerfile:10:FROM node:22-slim AS deps\nfrontend/Dockerfile:42:FROM node:22-slim AS builder\nfrontend/Dockerfile:145:FROM node:22-slim AS runner\nDockerfile.backend:7:FROM node:22-slim AS builder\nDockerfile.backend:92:FROM node:22-slim AS runner\n$ grep -n 'build xanh không có' CLAUDE.md | cut -c1-140\n280:thêm chốt kiểm libc ↔ engine **trước khi đẩy**. Bài học: *build xanh không có",
 "n20-3:cmd": "$ S=$(date +%s); docker build -q -f Dockerfile.simple -t nxj-simple . >/dev/null 2>&1 && echo \"rebuilt nxj-simple in $(( $(date +%s) - S )) s\"; docker inspect -f 'CMD as Docker read it: {{json .Config.Cmd}}' nxj-simple\nrebuilt nxj-simple in 58 s\nCMD as Docker read it: [\"npm\",\"start\"]\n$ docker run -d --name nxj-simple-c -p 127.0.0.1:19344:3000 nxj-simple >/dev/null; sleep 6; echo \"19344 /ver: $(curl -s http://127.0.0.1:19344/ver | grep -o 'Release v[0-9]' | head -1)\"; echo \"nxj-simple-c: $(docker exec nxj-simple-c du -sh /app | cut -f1) in /app · $(docker exec nxj-simple-c sh -c 'ls node_modules | wc -l' | tr -d ' ') packages in node_modules\"\n19344 /ver: Release v1\nnxj-simple-c: 851.6M in /app · 387 packages in node_modules\n$ docker images --format '{{.Repository}}  {{.Size}}' | grep -E '^nxj-(simple|std) ' | sort\nnxj-simple  1.84GB\nnxj-std  331MB"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, meter, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n20-3 · lab c20 · Docker Desktop 29.8 trên Mac (arm64) · node:22-alpine · Next.js 16.4.6)
export const deck = { key: 'nxj-20-3', code: 'NXJ 20.3', title: 'Docker: packaging the app to run anywhere', sub: 'Chapter 20 · Lesson 20.3' };
const O = (k) => { const v = DU_LIEU[`n20-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (khoi, dau) => { const l = O(khoi).split('\n'); const i = l.findIndex((x) => x.startsWith('$ ') && x.includes(dau)); if (i < 0) throw new Error('thiếu lệnh ' + dau); const r = []; for (let j = i + 1; j < l.length && !l[j].startsWith('$ '); j++) r.push(l[j]); return r; };
const tim = (ds, re) => { const l = ds.find((x) => re.test(x)); if (!l) throw new Error('thiếu dòng ' + re); return l; };
const so = (s, re) => { const m = s.match(re); if (!m) throw new Error('không khớp ' + re + ' ' + s); return +m[1]; };
const sach = (ds) => ds.map((l) => l.trim()).filter(Boolean);
const B1 = doan('lab', 'Dockerfile.simple'), B2 = doan('std', 'NEXT_PUBLIC_SHOP_NAME=Alpha .'), B3 = doan('std', 'forgot the build arg');
const LOI = doan('chay', 'docker ps -a'), STD = doan('chay', 'for c in nxj-std-c'), ARGS = doan('chay', 'WITHOUT the arg');
const FIX = doan('cmd', 'docker build -q -f Dockerfile.simple'), RUNS = doan('cmd', 'docker run -d --name nxj-simple-c'), IMG = doan('cmd', 'docker images');
const LIBC = doan('libc', 'glibcVersionRuntime'), SWC = doan('libc', 'grep swc'), KHO = O('kho').split('\n').filter((l) => !l.startsWith('$ '));
const SZ = (n) => { const l = tim(IMG, new RegExp('^' + n + ' ')); const m = l.match(/([\d.]+)(GB|MB)/); return Math.round(+m[1] * (m[2] === 'GB' ? 1000 : 1)); };
const T1 = so(tim(B1, /built/), /in (\d+) s/), T2 = so(tim(B2, /built/), /in (\d+) s/);
const APP1 = tim(RUNS, /nxj-simple-c:/), APP2 = tim(STD, /nxj-std-c:/);
const MB = (s) => { const m = s.match(/: ([\d.]+)M in/); return Math.round(+m[1]); };
if (!/CMD \["node", "server.js"\]/.test(O('file:Dockerfile'))) throw new Error('mã lab đổi');
const H_LESSON = "# the lesson's Dockerfile, exactly\nFROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci                 # install exact dependencies\nCOPY . .\nRUN npm run build          # next build → the production build\nCMD [\"npm\", \"start\"]       # next start when the container runs";
const H_STD = "FROM node:22-alpine AS deps\nCOPY package*.json ./\nRUN npm ci\n\nFROM node:22-alpine AS builder\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY . .\nARG NEXT_PUBLIC_SHOP_NAME\nENV NEXT_PUBLIC_SHOP_NAME=$NEXT_PUBLIC_SHOP_NAME\nRUN npm run build\n\nFROM node:22-alpine AS runner\nCOPY --from=builder /app/public ./public\nCOPY --from=builder /app/.next/standalone ./\nCOPY --from=builder /app/.next/static ./.next/static\nUSER node\nCMD [\"node\", \"server.js\"]";

export const S = [
  { cover: true, nhan: 'Chapter 20 · Lesson 20.3', t: 'Docker: packaging the<br>app to run anywhere', sub: 'The lesson’s Dockerfile, built for real — a container that never starts, a 1.84 GB image cut to 331 MB, a build argument you forget, and libc',
    en: 'Lesson twenty point three: Docker, packaging the app to run anywhere. The lesson’s Dockerfile built for real: a container that never starts, an image cut from one point eight four gigabytes to three hundred and thirty-one megabytes, a forgotten build argument, and libc.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The lesson’s Dockerfile builds — and the container exits: <b>/bin/sh: [npm,: not found</b></li>
    <li>One comment moved, and it runs: <b>${SZ('nxj-simple').toLocaleString('en-US')} MB</b> image, ${MB(APP1)} MB of <code>/app</code></li>
    <li>Multi-stage + <code>output: 'standalone'</code>: <b>${SZ('nxj-std')} MB</b>, ${MB(APP2)} MB of <code>/app</code></li>
    <li><code>NEXT_PUBLIC_*</code> without <code>--build-arg</code>: empty, even with <code>-e</code> at run</li>
    <li>alpine = musl, slim = glibc: native binaries must match</li></ul>`,
    en: 'Five takeaways. The lesson’s Dockerfile builds, and the container exits immediately. Move one comment and it runs, in a very large image. Multi-stage with standalone output cuts it to about a sixth. A public variable without a build argument is empty. And alpine and slim use different C libraries.' },
  { t: 'Image, container, Dockerfile', body: two(D(box('Image = the packed box', 'Node, your dependencies and your <b>build</b>, frozen into layers. Built once, copied to any machine.', 'lam'),
      box('Container = the box, running', '<code>docker run</code> starts a process from the image, with its own files and ports. Delete it, start another — the image does not change.', 'lam'),
      box('Dockerfile = the recipe', 'Each line adds a layer. Lines whose inputs did not change come from cache — that is why <code>package.json</code> is copied before the source.', 'xanh')),
    D(tsx(H_LESSON, { hl: [8] })), 'r46'),
    en: 'An image is the packed box: Node, dependencies and your build, frozen into layers. A container is that box, running. The Dockerfile is the recipe, one layer per line, cached when its inputs do not change. On the right, the lesson’s Dockerfile, exactly.' },
  { t: 'The lesson’s Dockerfile: built, then dead', body: two(D(tn([...sach(B1)].join('\n'), { fs: 15, wrap: 60, title: 'docker build -f Dockerfile.simple (real)' }), tn(sach(LOI).join('\n'), { fs: 13, wrap: 64, title: 'docker run · logs · inspect (real)' })),
    D(box('A comment broke CMD', 'Docker has no trailing comments. <code>CMD ["npm","start"]   # …</code> is not valid JSON any more, so Docker falls back to the shell form and runs the literal text <code>["npm", "start"] # …</code>.', 'do2'),
      box('Build green ≠ image runs', 'The build passed in ' + T1 + ' s. The container exited with 127 the moment it started. Always <code>docker run</code> + <code>curl</code> before you push.', 'lam')), 'r64'),
    en: `The lesson’s Dockerfile, built for real: ${T1} seconds, green. Run it: exited with code one hundred and twenty-seven, slash bin slash sh: open-bracket npm comma, not found. Docker does not support trailing comments, so the CMD stopped being JSON and Docker ran the whole line as a shell command. A green build does not mean the image runs.` },
  { t: 'Comments on their own line — it runs', body: two(D(tsx("# next start when the container runs\nCMD [\"npm\", \"start\"]", { hl: [2] }), tn([...sach(FIX), ...sach(RUNS)].join('\n'), { fs: 14, wrap: 60, title: 'rebuild (cached) + run (real)' })),
    D(box('But look at the size', `${SZ('nxj-simple').toLocaleString('en-US')} MB image; <code>/app</code> holds ${MB(APP1)} MB and every dev dependency — Vitest, Playwright, the AWS SDK — in production.`, 'do2'),
      box('And the source', '<code>COPY . .</code> put your source, tests and config in the image too.', 'lam')), 'r64'),
    en: `Comments on their own line, rebuild from cache, and it runs: Release v1. But look at the size: ${SZ('nxj-simple').toLocaleString('en-US')} megabytes, with ${MB(APP1)} megabytes in the app folder, including every development dependency and the whole source.` },
  { t: 'Multi-stage + standalone: ship only what runs', body: two(D(tsx(H_STD, { hl: [8, 9, 14, 17], sm: true })),
    D(meter([['lesson Dockerfile (fixed)', SZ('nxj-simple'), '#dc2626'], ['multi-stage + standalone', SZ('nxj-std'), '#16a34a']], { don: 'MB image', w: 470, nhan: 230, fs: 15 }),
      meter([['/app — lesson', MB(APP1), '#dc2626'], ['/app — standalone', MB(APP2), '#16a34a']], { don: 'MB', w: 470, nhan: 230, fs: 15 }),
      tn([...sach(IMG), APP1, APP2].join('\n'), { fs: 13, wrap: 56, title: 'docker images · du (real)' }),
      box('Why it shrinks', '<code>output: \'standalone\'</code> traces the files <code>server.js</code> needs (12 packages, not 387); the last stage copies only that.', 'xanh')), 'r46'),
    en: `Multi-stage with output standalone. Three stages: install, build, run. Next traces exactly the files the server needs, and only the last stage ships. ${SZ('nxj-simple').toLocaleString('en-US')} megabytes down to ${SZ('nxj-std')}; twelve packages instead of three hundred and eighty-seven.` },
  { t: 'NEXT_PUBLIC_ is a build argument', body: two(D(tsx("ARG NEXT_PUBLIC_SHOP_NAME\nENV NEXT_PUBLIC_SHOP_NAME=$NEXT_PUBLIC_SHOP_NAME\nRUN npm run build", { hl: [1, 2] }),
      tn([...sach(B2), ...sach(B3)].join('\n'), { fs: 14, wrap: 60, title: 'docker build (real)' }), tn(sach(ARGS).join('\n'), { fs: 14, wrap: 60, title: 'curl /env/khach (real)' })),
    D(box('-e at run is too late', 'The image built <i>without</i> <code>--build-arg</code> shows an empty value, even when the container starts with <code>-e NEXT_PUBLIC_SHOP_NAME=Beta</code>. The JS was written during <code>RUN npm run build</code> (20.2).', 'do2'),
      box('Secrets are the opposite', 'Server-only secrets go in at <b>run</b> time (<code>-e</code>, env file) — never as build args, which are recorded in the build cache (and in the history of a single-stage image).', 'lam')), 'r64'),
    en: 'NEXT_PUBLIC is a build argument. The image built without it shows an empty value, even if the container is started with minus e and Beta: the JavaScript was written during the build. Secrets are the opposite: inject them at run time, never as build arguments.' },
  { t: 'alpine is musl, slim is glibc', body: two(D(tn([...sach(LIBC), '$ ls node_modules/@next | grep swc   # inside the lesson image', ...sach(SWC).filter((l) => /swc/.test(l))].join('\n'), { fs: 15, wrap: 60, title: 'docker run --rm … (real)' })),
    D(box('Native binaries are built for one libc', 'npm installed both SWC binaries; at runtime Next picks the one matching the image. A native module compiled for glibc will not load on alpine (musl).', 'do2'),
      box('cuongthai.com, 18/08/2026', 'An image built on alpine carried a Prisma engine for glibc: build green, push green, swap green — then the backend restarted forever, API 502 for seven minutes. Since then the deploy checks libc ↔ engine before pushing.', 'lam')), 'r46'),
    en: 'alpine is musl, slim is glibc. Native binaries are compiled for one of them; npm installed both SWC binaries here. On the eighteenth of August, this course’s backend image carried a database engine for the wrong libc: everything was green until the container restarted forever. The deploy now checks the match before pushing.' },
  { t: 'cuongthai.com: what its images use', body: two(D(tn(KHO.join('\n'), { fs: 14, wrap: 60, title: 'api-backend (real)' })),
    D(box('node:22-slim everywhere', 'Frontend and backend use the glibc image in every stage — the engine and the base agree.', 'xanh'),
      box('The frontend runner', '<code>COPY .next/standalone</code> + <code>.next/static</code> + <code>public</code>, then <code>node server.js</code> — the same shape as the lab.', 'lam')), 'r64'),
    en: 'This course’s own images use node twenty-two slim in every stage, so the libc and the native engines agree, and the frontend runner copies the standalone output and starts node server dot js, the same shape as our lab.' },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['📦', '“It builds on CI”', ['and the container exits 127', 'nobody ran docker run before the push']],
      neu: ['❓', 'What if you COPY . . everything?', ['source, tests, .env files in the image', 'anyone with the image has them']],
      xau: ['🕵️', 'Images are archives', ['docker history shows build args (single-stage)', 'layers keep files you deleted later']],
      phong: ['🛡️', 'Small, checked, secret-free', ['.dockerignore; multi-stage; USER node', 'run + curl before push; secrets at run']],
    }),
    en: 'Real life: it builds on CI, and the container exits immediately because nobody ran it. What if you copy everything? Source, tests and env files end up in the image. Images are archives: history shows build arguments, and layers keep files you deleted later. Keep images small, checked and free of secrets.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Image', 'the packed box'), kw('Container', 'the box, running'), kw('Layer', 'one per line, cached'), kw('Multi-stage', 'build here, ship there'),
      kw('output: standalone', 'server.js + traced files'), kw('Build ARG', 'NEXT_PUBLIC_ at build'), kw('Exec vs shell form', 'CMD ["…"] vs CMD …'), kw('musl / glibc', 'alpine / slim'), kw('.dockerignore', 'keep it out'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: image; container; layer; multi-stage; output standalone; build argument; exec versus shell form; musl and glibc; and dot dockerignore.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build the lesson’s Dockerfile; ${c('docker run')}; read ${c('docker logs')}`,
      `Add ${c("output: 'standalone'")} + a 3-stage Dockerfile; compare sizes`,
      `Build once without ${c('--build-arg')}; curl a NEXT_PUBLIC_ value`,
      `Check your base: ${c('node -p process.report.getReport().header.glibcVersionRuntime')}`,
    ]), box('Keep these', `<ul><li>No trailing comments in a Dockerfile</li><li>Standalone + multi-stage</li><li>NEXT_PUBLIC_ = build arg; secrets = run time</li><li>Run + curl the image before pushing</li></ul>`, 'lam'), ''),
    en: 'Your turn: build and run the lesson’s Dockerfile and read the logs; switch to standalone with three stages and compare sizes; build once without the build argument; and check which libc your base image uses.' },
];
export const slides = lamDeck({ chuong: 'Chapter 20 — Build and deploy to production', bai: '20.3' }, S);
