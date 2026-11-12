/**
 * pr-11-2 — Prisma ORM · Chapter 11 · Lesson 11.2 "A Dockerfile that generates in the right place" (deck video, 12/11/2026). Bài web: pr-11-2-dockerfile.
 * Output THẬT (`chay.sh p11-2` → out/p11-2/docker.txt; Mac arm64, Docker Desktop, node:22-alpine/slim, npm 10, Prisma 6.19.3, CSDL c112 trên prisma-pg):
 * Dockerfile ngây thơ ⇒ postinstall prisma generate "Could not find Prisma Schema" · ba tầng build được; node:22-alpine 234 MB → ảnh 595 MB; node_modules 258,8M ·
 * npm prune --omit=dev GIỮ prisma (peerOptional của @prisma/client) 65,1M + typescript 22,9M ⇒ migrate deploy chạy được từ ảnh runtime · tầng deps cũng chạy được ·
 * deps+build trên slim, runtime alpine ⇒ "could not locate the Query Engine … linux-musl-arm64-openssl-3.0.x" (ảnh có 2 engine glibc arm64).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p11-2/docker.txt": "$ bash p11/112/chay.sh\n$ docker build -f Dockerfile.ngay-tho -t p112:ngay-tho .   # COPY package*.json; RUN npm install; COPY . .\n> postinstall\n> prisma generate\nError: Could not find Prisma Schema that is required for this command.\nChecked following paths:\nschema.prisma: file not found\nprisma/schema.prisma: file not found\nnpm error command sh -c prisma generate\n#8 ERROR: process \"/bin/sh -c npm install --no-audit --no-fund\" did not complete successfully: exit code: 1\n56.04 npm error command sh -c prisma generate\n$ docker build -t p112:ba-tang .   # Dockerfile ba tầng (deps / build / runtime)\n[build 5/7] RUN npx prisma generate\n[build 6/7] RUN npm run build\n[build 7/7] RUN npm prune --omit=dev\n[deps 2/6] RUN apk add --no-cache openssl\n[deps 5/6] COPY prisma ./prisma\n[deps 6/6] RUN npm install --no-audit --no-fund\n  (tong thoi gian build: 4 s, may Mac M-series, Docker Desktop, cache lanh tru anh nen)\n$ docker image inspect node:22-alpine p112:ba-tang --format \"{{.RepoTags}} {{.Size}}\"\nnode:22-alpine     234377612 B  (~234 MB)\np112:ba-tang       595498716 B  (~595 MB)\n$ docker run --rm --entrypoint sh p112:ba-tang -c \"ls node_modules/.prisma/client | grep so.node; ls node_modules/.bin | grep -c prisma; du -sh node_modules\"\nlibquery_engine-linux-musl-arm64-openssl-3.0.x.so.node\nnode_modules/.bin/prisma: 1\n258.8M\n$ docker run --rm -e DATABASE_URL=… p112:ba-tang npx prisma migrate deploy   # prisma la devDependency, da bi prune\n1 migration found in prisma/migrations\nApplying migration `20261112000000_init`\nThe following migration(s) have been applied:\nmigrations/\n$ docker run --rm --entrypoint sh p112:ba-tang -c \"npm explain prisma; du -sh node_modules/prisma node_modules/typescript\"\nprisma@6.19.3\nnode_modules/prisma\n  dev prisma@\"6.19.3\" from the root project\n  peerOptional prisma@\"*\" from @prisma/client@6.19.3\n  node_modules/@prisma/client\n65.1M\tnode_modules/prisma\n22.9M\tnode_modules/typescript\n17.3M\tnode_modules/.prisma\n$ docker build --target deps -t p112:deps . && docker run --rm -e DATABASE_URL=… p112:deps npx prisma migrate deploy   # cach B: tang co CLI\nDatasource \"db\": PostgreSQL database \"c112\", schema \"public\" at \"host.docker.internal:55491\"\n1 migration found in prisma/migrations\nNo pending migrations to apply.\n$ docker run --rm -e DATABASE_URL=… p112:ba-tang   # chay app\nusers = 0\n$ docker build -f Dockerfile.lech-nen -t p112:lech-nen .   # deps+build tren node:22-slim, runtime node:22-alpine\n#27 exporting to image\n$ docker run --rm -e DATABASE_URL=… p112:lech-nen\nPrismaClientInitializationError\nPrisma Client could not locate the Query Engine for runtime \"linux-musl-arm64-openssl-3.0.x\".\nThis happened because Prisma Client was generated for \"linux-arm64-openssl-1.1.x\", but the actual deployment required \"linux-musl-arm64-openssl-3.0.x\".\n$ docker run --rm --entrypoint sh p112:lech-nen -c \"ls node_modules/.prisma/client | grep so.node\"\nlibquery_engine-linux-arm64-openssl-1.1.x.so.node\nlibquery_engine-linux-arm64-openssl-3.0.x.so.node\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, two, box, cards, c, tbl, steps, icards, cmp, bars, tiers, flow, sql, tc } from './_pr-chung.mjs';

export const deck = { key: 'pr-11-2', code: 'PR 11.2', title: 'A Dockerfile that generates in the right place', sub: 'Chapter 11 · Lesson 11.2' };

const DEMO = 'demo';
const L = fs.readFileSync(`${DEMO}/out/p11-2/docker.txt`, 'utf8').replace(/\n+$/, '').split('\n').filter((l) => !/^\$ bash /.test(l));
const khoi = (tu, den) => { const a = L.findIndex((l) => l.startsWith(tu)); const b = den ? L.findIndex((l, i) => i > a && l.startsWith(den)) : L.length; return L.slice(a, b < 0 ? L.length : b); };
const MOI = 'terminal — Mac arm64 · Docker Desktop · npm 10 · Prisma 6.19.3';
const T = (s, o = {}) => tc(s, { title: MOI, ...o });
const df = (s, o = {}) => sql(s, { lang: 'dockerfile', sm: true, ...o });

export const slides = lamDeck({ chuong: 'Chapter 11 — Shipping to production', bai: '11.2' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 11 · Lesson 11.2', t: 'A Dockerfile that generates in the right place', sub: 'Three rules, each one broken on purpose and measured' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['page', 'Rule 1 — the schema before install', 'Why postinstall fails'],
      ['box', 'Rule 2 — generate on the runtime base', 'The mismatch, built for real'],
      ['cut', 'Rule 3 — where the CLI really is', 'What npm prune kept'],
      ['layers', 'The three-stage file, and its size', ''],
      ['check', 'Verify the image, not the build', ''],
    ], 2) },
  /* 3 */ { t: 'Rule 1 — the schema must exist before npm install', body: two(df(`FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install        # postinstall: prisma generate
COPY . .               # schema arrives here — too late
RUN npm run build`), T(khoi('> postinstall', '$ docker build -t p112:ba-tang').filter((l) => !/^\d/.test(l)).join('\n'), { wrap: 58, fs: 13 }), '') +
      flow([
        { t: 'COPY package*.json' },
        { t: 'npm install', s: 'runs postinstall' },
        { t: 'prisma generate', s: 'looks for the schema' },
        { t: 'no schema yet', s: 'exit 1', mau: '#c62828' },
      ], { h: 120, fs: 18 }) },
  /* 4 */ { t: 'The fix — and why it is also the fast order', body: df(`COPY package*.json ./
COPY prisma ./prisma          # ← before install: generate finds the schema
RUN npm install
COPY . .                      # src/ changes every commit; the install layer stays cached`) +
      cmp(['', 'Changes', 'Layer cache'], [
        [c('package-lock.json'), 'when dependencies change', 'install re-runs'],
        [c('prisma/'), 'when the schema changes', 'install + generate re-run'],
        [c('src/'), 'almost every commit', 'only the build re-runs'],
      ], { hl: [2] }) +
      box('Order layers by how often they change', 'Rarely-changing inputs first, the source tree last. The same order that makes generate find its schema keeps the slow install layer cached — the Docker course, lesson 5.2, measures that cache.', 'lam') },
  /* 5 */ { t: 'Rule 2 — generate on the base you will run on', body: two(df(`FROM node:22-slim AS deps      # glibc
...
FROM node:22-slim AS build     # generate here
...
FROM node:22-alpine AS runtime # musl
COPY --from=build /app/node_modules ./node_modules`), T([...khoi('$ docker run --rm -e DATABASE_URL=… p112:lech-nen'), ''].join('\n').trim(), { wrap: 60, fs: 13 }), '') +
      flow([
        { t: 'build: node:22-slim', s: 'glibc engines' },
        { t: 'COPY node_modules', s: 'engines travel along' },
        { t: 'runtime: alpine', s: 'needs musl', mau: '#c62828' },
      ], { h: 120, fs: 18 }) +
      box('One base for every stage', 'If all three stages say node:22-alpine, the engine generated in stage two loads in stage three. Different bases are legitimate only with the runtime declared in binaryTargets (Lesson 11.1).', 'xanh') },
  /* 6 */ { t: 'Rule 3 — the CLI did not disappear', body: T(khoi('$ docker run --rm -e DATABASE_URL=… p112:ba-tang npx', '$ docker build --target deps').filter((l) => !/^\$ docker run --rm --entrypoint|^  node_modules\/@prisma|^migrations\//.test(l)).join('\n').replace(/   # prisma la devDependency, da bi prune/, ''), { wrap: 112, fs: 13 }) +
      bars([['node_modules/prisma', 65.1, '#b85a2b', 'the CLI'], ['node_modules/typescript', 22.9, '#b85a2b', 'kept with it'], ['node_modules/.prisma', 17.3, '#336791', 'client + engine']], { don: 'MB', nhan: 290, fs: 16, rh: 32 }) +
      box('npm prune --omit=dev kept the CLI', '@prisma/client declares prisma as an optional peer, so npm 10 kept it — and typescript too. Check with npm explain prisma; do not assume.', 'do2') },
  /* 7 */ { t: 'Where migrate deploy runs — pick one place', body: cmp(['', 'Where the CLI lives', 'Trade-off'], [
      ['A · runtime image', 'prisma in dependencies (here: kept anyway, ~65 MB)', 'simplest; one container does it all'],
      ['B · a stage with the CLI', c('--target deps') + ' image runs migrate deploy', 'lean runtime, one more image'],
      ['C · CI job', 'the pipeline runs it before the swap', 'ordering lives in Lesson 11.3'],
    ]) + T(khoi('$ docker build --target deps', '$ docker build -f Dockerfile.lech-nen').join('\n'), { wrap: 112, fs: 13 }) +
      box('Never two places at once', 'An entrypoint and a CI job both running migrate deploy race for the same advisory lock. One wins; the other reports a timeout, and the deploy log becomes ambiguous.', 'lam') },
  /* 8 */ { t: 'The whole file', body: two(df(`FROM node:22-alpine AS deps
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm install --no-audit --no-fund
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev
FROM node:22-alpine AS runtime
RUN apk add --no-cache openssl dumb-init
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
USER node
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]`, { sm: true }), tiers([
        ['page', 'deps', 'schema before install', '#336791'],
        ['code', 'build', 'generate · tsc · prune', '#336791'],
        ['box', 'runtime', 'same base · non-root', '#2f7d32'],
        ['power', 'dumb-init as PID 1', 'Lesson 11.5', '#b85a2b'],
      ], { w: 520, th: 60, gap: 22 }), '') },
  /* 9 */ { t: 'What the image weighs, measured', body: T(khoi('$ docker image inspect', '$ docker run --rm -e DATABASE_URL=… p112:ba-tang npx').join('\n'), { wrap: 112, fs: 13 }) +
      bars([['node:22-alpine', 234, '#336791', 'the base'], ['p112:ba-tang', 595, '#b85a2b', 'base + 259 MB node_modules + layers']], { don: 'MB', nhan: 220, fs: 16, rh: 38 }) +
      icards([
        ['eye', '.dockerignore: node_modules', 'Never ship the host&#39;s engine'],
        ['lock', '.dockerignore: .env', 'A copied secret lives in a layer forever'],
        ['check', 'Load the engine at the end', 'Lesson 11.1: await a query in the image'],
      ], 3) },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Build the naive Dockerfile; read the postinstall error`,
      `Move ${c('COPY prisma')} above the install`,
      `Build on slim, run on alpine; read the engine error`,
      `Run ${c('npm explain prisma')} in your runtime image`,
      `Compare the image with its base`,
    ]), box('Keep these', `<ul><li>Schema before install</li><li>Generate on the runtime base</li><li>Know where the CLI is — measure it</li><li>Verify the image, not the build</li></ul>`, 'lam'), '') },
]);
