/**
 * node-17-4 — Node.js · Chapter 17 · Lesson 17.4 "Secrets: still there after you deleted them" (slide EN, đợt 12 — 08/11/2026). MỘT deck, MỘT tập node-17-4.
 * Nguồn: nodejs-17-4-bi-mat-cau-hinh. Output THẬT: that/c17/{secrets, envcheck, prod-secret} (Docker Desktop 29.8.0, BuildKit; mọi bí mật là GIẢ, registry riêng .invalid).
 * Thêm so với web: file .env COPY rồi rm ở tầng SAU vẫn đọc được từ `docker save` · multi-stage giữ ARG+ENV của builder khỏi ảnh cuối (0/0) ·
 *   env lúc chạy không vào ẢNH nhưng hiện trong `docker inspect` CONTAINER · website: frontend/Dockerfile nhận 4 bí mật làm ARG+ENV ở builder (ảnh cuối sạch nhờ multi-stage),
 *   ARG/ENV NEXT_PUBLIC_GIPHY_API_KEY còn nối trong Dockerfile + compose dù frontend/src không còn dùng (0 tệp).
 */
import { lamDeck, two, box, cards, flow, bang, TT, steps, sql } from './_c9-chung.mjs';

export const deck = { key: 'node-17-4', code: 'NODE 17.4', title: 'Secrets: still there after you deleted them', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const D = (src, o = {}) => sql(src, { lang: 'dockerfile', sm: o.sm ?? true, hl: o.hl });
const B = (src, o = {}) => sql(src, { lang: 'bash', sm: o.sm ?? true, hl: o.hl });
const JS = (src, o = {}) => sql(src, { lang: 'javascript', sm: o.sm ?? true, hl: o.hl });

export const slides = lamDeck({ chuong: 'Chapter 17 — Docker and deployment', bai: '17.4' }, [
  { cover: true, t: 'Secrets: still there<br>after you deleted them', sub: 'An image is a stack of layers that never change. Deleting a file only hides it — and some secrets never were files at all. Every value in this lesson is fake.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>A careful-looking Dockerfile that leaks two secrets, measured</li>
<li>Why rm in a later layer deletes nothing</li>
<li>The right tool: a secret mount — zero traces, measured</li>
<li>Build-time vs runtime: where every production secret belongs</li>
<li>Fail fast on missing config, and what to do once a secret has shipped</li>
</ul>` + two(box('Why it matters to you', 'Anyone who can pull your image can read whatever it contains — without running it.', 'lam'), box('Rule of thumb', 'If a value appears anywhere in the Dockerfile or the build command, assume it is public.', 'do2')) },

  { t: 'An image is not a folder', to: true, giua: true, body: flow([{ t: 'layer 1', s: 'COPY .env .', mau: DO }, { t: 'layer 2', s: 'RUN rm .env', mau: CAM }, { t: 'what ls shows', s: 'no .env', mau: NODE }, { t: 'what the image holds', s: 'BOTH layers', mau: DO }], { h: 130 }) +
    cards([['Layers are immutable', 'Every instruction adds a new layer on top. Nothing ever edits a layer below.'], ['Delete = a hiding note', 'rm in a later layer writes "this file is gone" on top. The bytes stay in the layer below.'], ['Everyone gets every layer', 'docker pull downloads all of them. Anyone with the image can open any layer.']], 3) +
    box('Like a notebook where you can only add pages', 'Crossing a line out on page 5 does not erase what is written on page 3. Anyone holding the notebook can still turn back to page 3.', 'lam') },

  { t: 'The Dockerfile that looks correct', to: true, giua: true, body: D(`FROM node:22-slim
WORKDIR /app
ARG NPM_TOKEN
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
COPY package*.json ./
RUN echo "@acme:registry=https://npm.acme.invalid/" > .npmrc \\
    && echo "//npm.acme.invalid/:_authToken=\${NPM_TOKEN}" >> .npmrc \\
    && npm ci --omit=dev \\
    && rm -f .npmrc                  # deleted IN THE SAME RUN
COPY src ./src
CMD ["node", "src/index.js"]`, { sm: false, hl: [3, 4, 5, 10] }) +
    box('The deletion is genuinely correct', 'Created and removed inside one RUN, the .npmrc exists in no layer\'s filesystem. That part works. Look at what is still there.', 'cam') },

  { t: 'Search the built image', to: true, giua: true, body: TT('c17/secrets', 3, 11, 'docker build --build-arg NPM_TOKEN=… --build-arg DATABASE_URL=… (FAKE values) · real', { n: 104, hl: [2, 4, 5, 7, 9], sm: false }) +
    two(box('No .npmrc anywhere', 'ls -a /app: the file really is gone.', 'xanh'), box('Both secrets are in the image anyway', 'One in the build history, one in the image configuration — and in every container started from it.', 'do2')) },

  { t: 'Where they were hiding', to: true, giua: true, body: cards([['docker history', 'Stores the command that built each layer, with the build arguments written next to it: NPM_TOKEN=npm_FAKE… in plain text. No unpacking needed.'], ['ENV DATABASE_URL=$…', 'Copied the build argument into Config.Env: readable with docker image inspect, and present in the environment of every container.'], ['The image can now run in ONE place', 'An image that contains a database URL only fits one database — and has already published it.']], 3) +
    TT('c17/secrets', 5, 7, 'what docker history actually stores · real', { n: 104, hl: [3], sm: false }) +
    box('Why this class of leak survives review', 'The mistake looks like the fix. Someone thought about the secret, added rm -f, and the review approved the deletion without asking whether deleting was the right mechanism.', 'do2') },

  { t: 'rm in a later layer deletes nothing', to: true, giua: true, body: two(D(`FROM node:22-slim
WORKDIR /app
COPY .env .          # layer A: the file
RUN rm .env          # layer B: "it is gone"
CMD ["node", "-e", "0"]`, { sm: false, hl: [3, 4] }), box('A different mistake, the same result', 'Here the secret IS a file — copied in one layer, deleted in the next.', 'cam')) +
    TT('c17/secrets', 13, 17, 'docker save, then read app/.env out of every layer tarball · real', { n: 104, hl: [3, 5], sm: false }) +
    box('ls says it is gone; the layer says otherwise', 'Really removing it means rebuilding WITHOUT the COPY — and rotating the secret, because the old image already exists.', 'do2') },

  { t: 'The right tool: a secret mount', to: true, giua: true, body: D(`# syntax=docker/dockerfile:1
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci --omit=dev
COPY src ./src
CMD ["node", "src/index.js"]`, { sm: false, hl: [5] }) +
    B(`docker build --secret id=npmrc,src=$HOME/.npmrc -t app .`, { sm: false }) +
    box('What BuildKit does', 'Mounts the file into that ONE command, in memory (tmpfs). It is never written to a layer and never appears in the history. No rm needed — nothing was created.', 'xanh') },

  { t: 'A secret mount, measured', to: true, giua: true, body: TT('c17/secrets', 19, 25, 'the same FAKE token, the same app · real', { n: 104, hl: [3, 5], sm: false }) +
    cards([['history: 0', 'The command is recorded; the secret is not.'], ['every layer: 0', 'docker save, unpack every layer, search every file: no trace.'], ['/root: no .npmrc', 'The file existed for exactly one RUN.']], 3) +
    box('Works in CI too', 'docker/build-push-action takes secrets: and hands them to BuildKit the same way; the secret stays in the CI secret store.', 'lam') },

  { t: 'Multi-stage keeps builder arguments out — measured', to: true, giua: true, body: TT('c17/secrets', 27, 33, 'ARG + ENV AUTH_SECRET in the builder stage only (FAKE value) · real', { n: 104, hl: [3, 5], sm: false }) +
    two(box('The final image is clean', 'Only the runner stage\'s instructions and config travel. The builder, with its ARG and ENV, is thrown away.', 'xanh'), box('Still not the right tool', 'Build args are printed in build logs and CI output. A secret mount is clean everywhere, not just in the final image.', 'cam')) },

  { t: 'Build-time vs runtime: the line that decides everything', to: true, giua: true, body: cards([['Build-time (ARG)', 'Exists only during the build, visible in docker history. For versions and flags — NEVER for secrets.'], ['Secret mount', 'Exists for exactly one RUN, in no layer and no history. For private registry tokens, build-time SSH keys.'], ['Runtime (container env)', 'Given at docker run / compose time. NOT in the image. The right place for EVERY production secret.']], 3) +
    flow([{ t: 'one image', s: 'app:7d2e801', mau: LAM }, { t: 'staging env', s: 'staging DB, test keys', mau: CAM }, { t: 'production env', s: 'real DB, real keys', mau: NODE }], { h: 120 }) +
    box('One image, many environments', 'The same tag runs in staging and production; only the environment handed to it at start differs. An image with a secret inside can never be promoted.', 'lam') },

  { t: 'Runtime env: not in the image, but not invisible', to: true, giua: true, body: TT('c17/secrets', 35, 39, 'docker run -e DATABASE_URL=… (FAKE) · real', { n: 104, hl: [3, 5], sm: false }) +
    two(box('The image: 0', 'Push it anywhere; the database URL does not travel with it.', 'xanh'), box('The container on this host: 1', 'docker inspect shows the environment. Anyone who can run docker on that machine can read it — docker access is root access.', 'cam')) +
    box('So keep the docker group tiny', 'On a server, being able to run docker is equivalent to being root: you can mount the host\'s disk into a container.', 'do2') },

  { t: 'The Next.js exception, and it catches everyone', to: true, giua: true, body: cards([['NEXT_PUBLIC_* is source code', 'Next.js inlines these values into the JavaScript bundle at BUILD time. They ship to every browser.'], ['Changing one = a rebuild', 'Not a restart. The value is baked into files, not read from the environment.'], ['A third-party key there is published', 'Every visitor can read it from the bundle.']], 3) +
    box('This project learned it the expensive way', 'A GIPHY key shipped as NEXT_PUBLIC_GIPHY_API_KEY; the build-time value went missing, the client fell back to a revoked public key and returned 403 in production. The fix: a backend proxy that reads the key from runtime env.', 'do2') +
    JS(`// src/routes/gifs.routes.ts (the website) — the key never leaves the server
const apiKey = process.env.GIPHY_API_KEY;   // runtime env; rotating it = a restart`, { sm: false, hl: [2] }) },

  { t: 'Where runtime secrets should live', to: true, giua: true, body: cards([['A .env file on the server', 'Fine for one VPS: chmod 600, OUTSIDE the deployed directory, in .gitignore AND .dockerignore.'], ['Docker secrets / Swarm', 'Mounted as files under /run/secrets/*, not environment variables — so docker inspect does not show them.'], ['Vault, SSM, Secret Manager', 'Rotation, access logs, permissions. Right for many servers, overkill for one.'], ['CI secrets', 'GitHub Actions secrets do NOT reach the VPS by themselves. Configure the server separately.']], 2) +
    box('Whatever you choose', 'The secret must never be in git, never in the image, and readable only by the process that needs it.', 'xanh') },

  { t: 'A real trap: the variable that never reached the server', to: true, giua: true, body: JS(`// config/env.js — dead at boot beats broken at runtime
const required = ['DATABASE_URL', 'JWT_SECRET', 'R2_ACCESS_KEY_ID'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('MISSING ENVIRONMENT VARIABLES:', missing.join(', '));
  process.exit(1);
}`, { sm: true, hl: [3, 6] }) + TT('c17/envcheck', 2, 7, 'the same check, two containers (FAKE values) · real', { n: 104, hl: [2, 5], sm: true }) +
    box('The most common config failure', 'A new variable goes into the local .env and .env.example — and never onto the server. Build and CI pass, the container starts, the feature dies at its first request. Check at boot: fail loudly, immediately.', 'cam') },

  { t: 'If a secret has already shipped', to: true, giua: true, body: steps([
    '<b>Rotate it</b> — make the leaked value worthless: new token, new password',
    '<b>Do not just rebuild</b> — deleting the layer does not un-pull the image from anyone who has it',
    '<b>Old tags still exist</b> — in the registry, in CI caches, on developers\' laptops',
    '<b>Then fix the mechanism</b> — secret mount, runtime env, .dockerignore',
    '<b>Check the git history too</b> — a secret in an old commit is a leaked secret (.git in the build context, 17.2)',
  ]) + two(box('Rotation is the only action that actually helps', 'Everything else is cleanup after the fact.', 'do2'), box('Plan for it before it happens', 'Know how to rotate each secret without logging everyone out (deploy course 4.5).', 'lam')) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: two(TT('c17/prod-secret', 1, 12, 'grep: .dockerignore, deploy-nha.sh, frontend/Dockerfile · real', { n: 58, sm: true }), TT('c17/prod-secret', 13, 21, 'grep: gifs.routes.ts, frontend/src, compose · real', { n: 58, sm: true })) +
    two(box('Right', 'Runtime env in /opt/cuonghoangdev/.env, .env in .dockerignore, GIPHY via a backend proxy.', 'xanh'), box('Worth a look', '4 secrets as ARG + ENV in the frontend builder (multi-stage keeps them out); a dead NEXT_PUBLIC_GIPHY_API_KEY still wired.', 'cam')) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'A Dockerfile has ARG STRIPE_KEY and ENV STRIPE_KEY=$STRIPE_KEY, and the team says "it is fine, we delete the .env at the end". (1) Name two places the key can be read from the image. (2) Where should STRIPE_KEY come from instead? (3) The image was already pushed last week. What is the first thing to do?', '') +
    box('Hint', 'Slides 5, 11 and 16.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) docker history (the build argument) and docker image inspect Config.Env — plus the environment of every container. (2) Runtime: an env file on the server or a secret store, handed to the container at start; never ARG/ENV in the Dockerfile. (3) Rotate the Stripe key — the old image may already be on other machines.', 'xanh')}</div>` },

  { t: 'Lesson 17.4 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['rm in the same RUN', 'file gone · token in history · URL in Config.Env', 'ARG/ENV are not for secrets'],
    ['rm in a later layer', '.env read back from docker save', 'deleting adds a layer, removes nothing'],
    ['secret mount', '0 in history · 0 in every layer', 'the build-time tool for secrets'],
    ['runtime env', 'image 0 · container inspect 1', 'every production secret goes here'],
    ['missing variable', 'exit 1 at boot, named', 'fail fast, never half-work'],
  ], { co: 22 }) + box('Next: 17.5 — zero downtime: 5.3% lost, or 0%', 'Three ways to deploy, measured by firing requests through the whole switch.', 'lam') },
]);
