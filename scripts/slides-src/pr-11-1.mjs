/**
 * pr-11-1 — Prisma ORM · Chapter 11 · Lesson 11.1 "The engine in the image, and the seven-minute outage" (deck video, 12/11/2026). Bài web: pr-11-1-engine-trong-anh.
 * Output THẬT (`chay.sh p11-1`: out/p11-1/engine.txt + kiem.txt; máy Mac Apple Silicon (arm64), Docker Desktop, ảnh node:22-alpine + node:22-slim, Prisma 6.19.3):
 * alpine = aarch64 musl, không có lệnh openssl; slim = Debian GLIBC 2.36, không có lệnh openssl ⇒ generate chọn linux-arm64-openssl-1.1.x (19,6 MB) + cảnh báo "Please manually install OpenSSL";
 * cùng node_modules chạy trên alpine ⇒ "could not locate the Query Engine for runtime linux-musl-arm64-openssl-3.0.x"; thêm target x86 musl vẫn hỏng trên arm64; thêm musl-arm64 ⇒ nạp được;
 * ba engine = 54M · new PrismaClient() in "xong, không lỗi" rồi tiến trình chết exit=1 · --no-engine = 144K (0 file engine), có engine = 22M.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p11-1/engine.txt": "$ bash p11/111/chay.sh\n$ docker run --rm node:22-alpine sh -c \"uname -m; ldd --version 2>&1 | head -1; openssl version\"\naarch64\nmusl libc (aarch64)\nsh: openssl: not found\n$ docker run --rm node:22-slim sh -c \"ldd --version 2>&1 | head -1; openssl version\"\nldd (Debian GLIBC 2.36-9+deb12u14) 2.36\nopenssl: khong co lenh (thu vien libssl3 van co)\n$ docker run node:22-slim: npm install && npx prisma generate   # (dung tren Debian)\n✔ Generated Prisma Client (v6.19.3) to ./node_modules/@prisma/client in 90ms\n6285 index-browser.js\n67926 index.d.ts\n5971 index.js\n19581616 libquery_engine-linux-arm64-openssl-1.1.x.so.node\n16927 query_engine_bg.js\n2297601 query_engine_bg.wasm\n215 schema.prisma\n$ docker run node:22-alpine node nap.cjs   # cung node_modules, chay tren Alpine\nPrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime \"linux-musl-arm64-openssl-3.0.x\". |   /tmp/prisma-engines\n$ docker run node:22-slim node nap.cjs     # dung noi da dung\nPlease manually install OpenSSL via `apt-get update -y && apt-get install -y openssl` and try installing Prisma again. If you're running Prisma on Docker, add this command to your Dockerfile, or switch to an image that already has OpenSSL installed.\nPrismaClientInitializationError: Can't reach database server at `127.0.0.1:1`\n$ (binaryTargets = [\"native\", \"linux-musl-openssl-3.0.x\"]) docker run node:22-slim: npx prisma generate\n✔ Generated Prisma Client (v6.19.3) to ./node_modules/@prisma/client in 90ms\n19581616 libquery_engine-linux-arm64-openssl-1.1.x.so.node\n17556136 libquery_engine-linux-musl-openssl-3.0.x.so.node\n16927 query_engine_bg.js\n2297601 query_engine_bg.wasm\n$ docker run node:22-alpine node nap.cjs\nPrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime \"linux-musl-arm64-openssl-3.0.x\". |   /tmp/prisma-engines\n$ (binaryTargets = [\"native\", \"linux-musl-arm64-openssl-3.0.x\"]) docker run node:22-slim: npx prisma generate\n✔ Generated Prisma Client (v6.19.3) to ./node_modules/@prisma/client in 84ms\n19581616 libquery_engine-linux-arm64-openssl-1.1.x.so.node\n15712408 libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node\n17556136 libquery_engine-linux-musl-openssl-3.0.x.so.node\n16927 query_engine_bg.js\n2297601 query_engine_bg.wasm\n$ docker run node:22-alpine node nap.cjs\nPrismaClientInitializationError: Can't reach database server at `127.0.0.1:1`\n$ du -sh node_modules/.prisma/client (ba engine)\n 54M\n",
 "demo/out/p11-1/kiem.txt": "$ docker run node:22-alpine node dung.cjs   # engine sai nen, chi new PrismaClient(), CHUA truy van\nnew PrismaClient() xong, khong loi\nPrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime \"linux-musl-arm64-openssl-3.0.x\".\nThis happened because Prisma Client was generated for \"linux-arm64-openssl-1.1.x\", but the actual deployment required \"linux-musl-arm64-openssl-3.0.x\".\nexit=1\n$ docker run node:22-alpine node -e \"...; await p.$connect()\"\nPrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime \"linux-musl-arm64-openssl-3.0.x\".\n$ npx prisma generate --no-engine\n✔ Generated Prisma Client (v6.19.3, engine=none) to ./node_modules/@prisma/client in 27ms\n0\n144K\n$ npx prisma generate   # (lai, co engine)\n✔ Generated Prisma Client (v6.19.3) to ./node_modules/@prisma/client in 81ms\n22M\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, two, box, cards, c, tbl, steps, icards, cmp, bars, tiers, flow, prs, tc } from './_pr-chung.mjs';

export const deck = { key: 'pr-11-1', code: 'PR 11.1', title: 'The engine in the image, and the seven-minute outage', sub: 'Chapter 11 · Lesson 11.1' };

const DEMO = 'demo';
const OUT = (t, ch = 'p11-1') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const E = OUT('engine').split('\n'), K = OUT('kiem').split('\n');
const khoi = (L, tu, den) => { const a = L.findIndex((l) => l.startsWith(tu)); const b = den ? L.findIndex((l, i) => i > a && l.startsWith(den)) : L.length; return L.slice(a, b < 0 ? L.length : b); };
const MOI = 'terminal — Mac arm64 · Docker Desktop · node:22 images · Prisma 6.19.3';
const T = (s, o = {}) => tc(s, { title: MOI, ...o });

export const slides = lamDeck({ chuong: 'Chapter 11 — Shipping to production', bai: '11.1' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 11 · Lesson 11.1', t: 'The engine in the image, and the seven-minute outage', sub: 'Build green, push green, swap green — and the API still dies' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['cpu', 'What prisma generate puts on disk', 'A compiled engine, one file per platform'],
      ['box', 'Reading a base image', 'libc, CPU, OpenSSL — measured, not guessed'],
      ['warn', 'The failure, exactly as it looks', 'And why every green step before it was honest'],
      ['check', 'binaryTargets, and a check that really loads the engine', ''],
      ['bolt', 'The engineless client', 'What it is for'],
    ], 2) },
  /* 3 */ { t: 'What prisma generate actually puts on disk', body: T(khoi(E, '$ docker run node:22-slim: npm install', '$ docker run node:22-alpine node nap.cjs').filter((l) => !/index-browser|query_engine_bg.js|schema.prisma/.test(l)).join('\n'), { wrap: 112, fs: 14 }) +
      bars([['engine (.so.node)', 19.58, '#b85a2b'], ['query_engine_bg.wasm', 2.30, '#336791'], ['index.d.ts', 0.068, '#336791']], { nhan: 260, don: 'MB', fs: 16, rh: 34 }) +
      cards([
        ['A compiled Rust library', 'It builds the SQL, owns the pool from Lesson 9.4 and speaks the PostgreSQL protocol. The JavaScript is an API over it.'],
        ['Named after the platform', 'linux-arm64-openssl-1.1.x: Linux, glibc, ARM, OpenSSL 1.1. A musl or x86 machine needs a different file.'],
        ['Produced by generate', 'npm install alone gives you no engine for your schema. The file comes from the machine that ran generate.'],
      ], 3) },
  /* 4 */ { t: 'Two base images, measured', body: T(khoi(E, '$ docker run --rm node:22-alpine', '$ docker run node:22-slim: npm install').join('\n'), { fs: 15 }) +
      cmp(['', 'node:22-alpine', 'node:22-slim'], [
        ['libc', 'musl', 'glibc 2.36 (Debian 12)'],
        ['CPU on this Mac', 'aarch64', 'aarch64'],
        ['openssl command', 'not found', 'not found (libssl3 is present)'],
        ['engine generate picked', '—', c('linux-arm64-openssl-1.1.x') + ' + a warning'],
      ], { hl: [3] }) +
      box('No openssl binary ⇒ Prisma guesses', 'On slim, generate could not detect OpenSSL, warned "Please manually install OpenSSL", and fell back to the 1.1.x engine. It still loaded here; install openssl in the image so the detection is not a guess.', 'lam') },
  /* 5 */ { t: 'The failure, exactly as it looks', body: T(khoi(E, '$ docker run node:22-alpine node nap.cjs', '$ (binaryTargets').join('\n'), { wrap: 112, fs: 14 }) +
      tiers([
        ['code', 'Build — green', 'nothing loads the engine at build time', '#2f7d32'],
        ['box', 'Push — green', 'the registry stores images, it does not run them', '#2f7d32'],
        ['loop', 'Swap — green', 'starting a container is not running it', '#2f7d32'],
        ['warn', 'Runtime — 502 on a loop', 'first query throws, process exits, restart policy repeats', '#c62828'],
      ], { th: 56, gap: 16 }) },
  /* 6 */ { t: 'CuongThai, 18/08/2026: seven minutes of 502', body: flow([
      { t: 'docker build .', s: 'default Dockerfile', mau: '#c62828' },
      { t: 'node:22-alpine', s: 'musl runtime' },
      { t: 'engine: debian', s: 'glibc file' },
      { t: 'restart loop', s: '502 for 7 min', mau: '#c62828' },
    ], { h: 140 }) +
      cards([
        ['The script built the wrong file', 'docker build . means -f Dockerfile — not the Dockerfile.backend that compose uses. Same repository, different base image.'],
        ['Every check before runtime passed', 'tsc, the build, the push and the swap were all correct about what they checked. None of them loaded the engine.'],
        ['The fix was a check, not a rule', 'The deploy script now compares libc with the engine name before pushing, and always passes -f.'],
      ], 3) + cmp(['', 'What it proved', 'What it did not'], [
        ['tsc + docker build', 'the code compiles, the layers assemble', 'that the engine matches the base'],
        ['push + compose up', 'the image exists, a container started', 'that the first query works'],
      ]) },
  /* 7 */ { t: 'Declaring the targets', body: prs(`generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x"]
}`, { sm: true }) + T([...khoi(E, '$ (binaryTargets = ["native", "linux-musl-openssl-3.0.x"])', '$ (binaryTargets = ["native", "linux-musl-arm64').filter((l) => !/query_engine_bg|Generated/.test(l)), ...khoi(E, '$ (binaryTargets = ["native", "linux-musl-arm64').filter((l) => !/query_engine_bg|Generated/.test(l))].join('\n'), { wrap: 112, fs: 12 }) +
      box('The CPU is part of the name', 'The x86 musl target changed nothing on this ARM machine; the arm64 one loaded. Three engines: 54 MB — list only what the runtime uses, plus native.', 'do2') },
  /* 8 */ { t: 'new PrismaClient() is not the check', body: T(khoi(K, '$ docker run node:22-alpine node dung.cjs', '$ npx prisma generate --no-engine').join('\n'), { wrap: 112, fs: 14 }) +
      two(steps([
        `The constructor returns — the engine loads in the background`,
        `${c('console.log')} prints "no error"`,
        `Moments later the load fails; the process exits with code 1`,
      ]), box('A check must wait for the engine', `Run ${c('await prisma.$connect()')} or one query inside the built image and test the exit code. Against an unreachable address, "Can&#39;t reach database server" means the engine loaded.`, 'xanh'), '') },
  /* 9 */ { t: 'The engineless client', body: two(T(khoi(K, '$ npx prisma generate --no-engine').join('\n'), { wrap: 58, fs: 14 }),
      bars([['with engine', 22, '#b85a2b'], ['--no-engine', 0.144, '#336791']], { w: 560, nhan: 150, don: 'MB', fs: 16 }), '') +
      cmp(['', 'Engine in the image', '--no-engine'], [
        ['Who runs the queries', 'the Rust engine in your container', 'a hosted service over HTTP (Accelerate)'],
        ['Fits', 'a container on a VPS', 'serverless bundles with size limits'],
        ['Costs', 'getting the platform right', 'a network hop and a vendor in the data path'],
      ]) + box('22 MB is small on a long-running container', 'The size argument matters for a serverless bundle with a hard limit. On a VPS with the database next door, the engineless client adds latency and solves a problem you do not have.', 'lam') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Print libc, CPU and openssl for two base images`,
      `Generate on one, run on the other; read the error`,
      `Add the target the error names; run again`,
      `Run ${c('new PrismaClient()')} alone; watch the exit code`,
      `Compare ${c('--no-engine')} with a normal generate`,
    ]), box('Keep these', `<ul><li>The engine is per libc, CPU and OpenSSL</li><li>Generate where you run, or declare the target</li><li>Build green ≠ runs</li><li>A check must load the engine and wait</li></ul>`, 'lam'), '') },
]);
