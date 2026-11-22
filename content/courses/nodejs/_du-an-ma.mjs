/**
 * Node.js — mã + output của "khung mẫu chạy thật" cho 18 mốc dự án (đề tài mẫu "Plant-care log").
 * SINH TỰ ĐỘNG 22/11/2026 từ các tệp đã chạy thật (Node v26.8.1, Express 5, Redis 8 cục bộ, Docker 29); không sửa tay.
 * Chuỗi JSON: dấu gạch chéo ngược là escape của JSON trong chuỗi nháy kép, KHÔNG nằm trong template literal.
 */
export const MA = {
 "1": [
  {
   "file": "plant.mjs",
   "lang": "javascript",
   "code": "// plant.mjs — the domain model, plain JavaScript, no framework\nconst DAY = 24 * 60 * 60 * 1000;\n\nexport function createPlant({ name, species, everyDays }) {\n  if (typeof name !== 'string' || name.trim().length < 2) throw new Error('name must have at least 2 characters');\n  if (!Number.isInteger(everyDays) || everyDays < 1) throw new Error('everyDays must be an integer >= 1');\n  return Object.freeze({ id: crypto.randomUUID(), name: name.trim(), species: species ?? null, everyDays });\n}\n\nexport function nextWatering(plant, lastWateredAt) {\n  return new Date(lastWateredAt.getTime() + plant.everyDays * DAY);\n}\n\nexport function isThirsty(plant, lastWateredAt, now = new Date()) {\n  return nextWatering(plant, lastWateredAt) <= now;\n}"
  },
  {
   "file": "m01.mjs",
   "lang": "javascript",
   "code": "import { readFile } from 'node:fs/promises';\nimport { createPlant, isThirsty } from './plant.mjs';\n\nconst rows = JSON.parse(await readFile(new URL('./seed.json', import.meta.url), 'utf8'));\nconst now = new Date('2026-11-22T08:00:00Z');\nfor (const r of rows) {\n  try {\n    const p = createPlant(r);\n    console.log(p.name.padEnd(10), isThirsty(p, new Date(r.lastWateredAt), now) ? 'THIRSTY' : 'ok');\n  } catch (err) {\n    console.log('rejected  ', JSON.stringify(r.name), '-', err.message);\n  }\n}"
  },
  {
   "cmd": "node m01.mjs",
   "out": "Monstera   THIRSTY\nCactus     ok\nrejected   \"x\" - name must have at least 2 characters\nrejected   \"Basil\" - everyDays must be an integer >= 1"
  }
 ],
 "2": [
  {
   "file": "m02.mjs",
   "lang": "javascript",
   "code": "import { Worker } from 'node:worker_threads';\n\n// yearlyReport = a CPU-heavy job of YOUR topic (here: a yearly care report)\nimport { yearlyReport } from './m02-lib.mjs';\n\nasync function measure(label, job) {\n  let ticks = 0;\n  const timer = setInterval(() => ticks++, 10); // what other requests would feel\n  const t0 = performance.now();\n  await job();\n  clearInterval(timer);\n  console.log(label.padEnd(18), Math.round(performance.now() - t0), 'ms, loop ticks during the job:', ticks);\n}\n\nconst N = 400_000_000;\nawait measure('inline (blocks)', async () => yearlyReport(N));\nawait measure('worker thread', () => new Promise((ok, fail) => {\n  const w = new Worker(new URL('./m02-worker.mjs', import.meta.url), { workerData: N });\n  w.once('message', ok); w.once('error', fail);\n}));"
  },
  {
   "file": "m02-lib.mjs",
   "lang": "javascript",
   "code": "export function yearlyReport(n) { let s = 0; for (let i = 0; i < n; i++) s += Math.sqrt(i); return Math.round(s); }"
  },
  {
   "file": "m02-worker.mjs",
   "lang": "javascript",
   "code": "import { parentPort, workerData } from 'node:worker_threads';\nimport { yearlyReport } from './m02-lib.mjs';\nparentPort.postMessage(yearlyReport(workerData));"
  },
  {
   "cmd": "node m02.mjs",
   "out": "inline (blocks)    465 ms, loop ticks during the job: 0\nworker thread      484 ms, loop ticks during the job: 43"
  }
 ],
 "3": [
  {
   "file": "m03.mjs",
   "lang": "javascript",
   "code": "import http from 'node:http';\nimport { readFile, writeFile } from 'node:fs/promises';\nimport { EventEmitter } from 'node:events';\n\nconst FILE = new URL('./plants.json', import.meta.url);\nconst events = new EventEmitter();\nevents.on('plant.created', (p) => console.log('[event] plant.created', p.name));\n\nasync function load() { try { return JSON.parse(await readFile(FILE, 'utf8')); } catch { return []; } }\nasync function readBody(req) { const chunks = []; for await (const c of req) chunks.push(c); return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); }\nfunction send(res, status, data) { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(data)); }\n\nconst server = http.createServer(async (req, res) => {\n  if (req.method === 'GET' && req.url === '/plants') return send(res, 200, await load());\n  if (req.method === 'POST' && req.url === '/plants') {\n    const body = await readBody(req);\n    const list = await load();\n    const plant = { id: list.length + 1, name: body.name };\n    list.push(plant); await writeFile(FILE, JSON.stringify(list, null, 2));\n    events.emit('plant.created', plant);\n    return send(res, 201, plant);\n  }\n  send(res, 404, { error: 'Not found' });\n});\n\nawait writeFile(FILE, '[]');\nserver.listen(3003, async () => {\n  const base = 'http://localhost:3003';\n  let r = await fetch(base + '/plants', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Monstera' }) });\n  console.log('POST /plants ->', r.status, await r.text());\n  r = await fetch(base + '/plants'); console.log('GET  /plants ->', r.status, await r.text());\n  r = await fetch(base + '/nope'); console.log('GET  /nope   ->', r.status, await r.text());\n  server.close();\n});"
  },
  {
   "cmd": "node m03.mjs",
   "out": "[event] plant.created Monstera\nPOST /plants -> 201 {\"id\":1,\"name\":\"Monstera\"}\nGET  /plants -> 200 [{\"id\":1,\"name\":\"Monstera\"}]\nGET  /nope   -> 404 {\"error\":\"Not found\"}"
  }
 ],
 "4": [
  {
   "file": "m04p/package.json",
   "lang": "json",
   "code": "{\n  \"name\": \"plant-care-api\",\n  \"version\": \"0.1.0\",\n  \"private\": true,\n  \"type\": \"module\",\n  \"engines\": { \"node\": \">=22\" },\n  \"scripts\": {\n    \"dev\": \"node --watch --env-file=.env src/server.js\",\n    \"start\": \"node src/server.js\",\n    \"test\": \"node --test\",\n    \"check\": \"node --check src/server.js && npm test\"\n  }\n}"
  },
  {
   "file": "m04p/.gitignore",
   "lang": "bash",
   "code": "node_modules/\n.env\ncoverage/"
  },
  {
   "cmd": "npm run",
   "out": "Lifecycle scripts included in plant-care-api@0.1.0:\n  start\n    node src/server.js\n  test\n    node --test\navailable via `npm run`:\n  dev\n    node --watch --env-file=.env src/server.js\n  check\n    node --check src/server.js && npm test"
  },
  {
   "cmd": "npm run check",
   "out": "> plant-care-api@0.1.0 check\n> node --check src/server.js && npm test\n> plant-care-api@0.1.0 test\n> node --test\n✔ the project runs its tests (0.45075ms)"
  },
  {
   "cmd": "git check-ignore -v .env node_modules/x .env.example",
   "out": ".gitignore:2:.env\t.env\n.gitignore:1:node_modules/\tnode_modules/x"
  }
 ],
 "5": [
  {
   "file": "m05.mjs",
   "lang": "javascript",
   "code": "import express from 'express';\n\nconst plants = [{ id: 1, name: 'Monstera' }];\nconst router = express.Router();\nrouter.get('/', (req, res) => res.json(plants));\nrouter.get('/:id', (req, res) => {\n  const p = plants.find((x) => x.id === Number(req.params.id));\n  if (!p) throw Object.assign(new Error('Plant not found'), { status: 404 });\n  res.json(p);\n});\nrouter.get('/:id/crash', async () => { throw new Error('database is down'); }); // async throw: Express 5 forwards it\n\nconst app = express();\napp.use(express.json());\napp.use((req, res, next) => { const t = Date.now(); res.on('finish', () => console.log('[log]', req.method, req.originalUrl, res.statusCode, (Date.now() - t) + 'ms')); next(); });\napp.use('/plants', router);\napp.use((req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'No route ' + req.method + ' ' + req.path } }));\napp.use((err, req, res, next) => {\n  const status = err.status ?? 500;\n  res.status(status).json({ error: { code: status === 500 ? 'INTERNAL' : 'NOT_FOUND', message: status === 500 ? 'Something went wrong' : err.message } });\n});\n\nconst server = app.listen(3005, async () => {\n  for (const path of ['/plants/1', '/plants/9', '/plants/1/crash', '/pots']) {\n    const r = await fetch('http://localhost:3005' + path);\n    console.log(path.padEnd(16), r.status, await r.text());\n  }\n  server.close();\n});"
  },
  {
   "cmd": "node m05.mjs",
   "out": "[log] GET /plants/1 200 4ms\n/plants/1        200 {\"id\":1,\"name\":\"Monstera\"}\n[log] GET /plants/9 404 0ms\n/plants/9        404 {\"error\":{\"code\":\"NOT_FOUND\",\"message\":\"Plant not found\"}}\n[log] GET /plants/1/crash 500 0ms\n/plants/1/crash  500 {\"error\":{\"code\":\"INTERNAL\",\"message\":\"Something went wrong\"}}\n[log] GET /pots 404 0ms\n/pots            404 {\"error\":{\"code\":\"NOT_FOUND\",\"message\":\"No route GET /pots\"}}"
  }
 ],
 "6": [
  {
   "file": "m06.mjs",
   "lang": "javascript",
   "code": "import express from 'express';\nimport { z } from 'zod';\n\nconst PlantIn = z.object({ name: z.string().trim().min(2).max(60), everyDays: z.number().int().min(1).max(90) });\nconst ListQuery = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(50).default(10), sort: z.enum(['name', '-name']).default('name') });\n\nconst db = ['Monstera', 'Cactus', 'Basil', 'Fern', 'Aloe'].map((name, i) => ({ id: i + 1, name, everyDays: 7 }));\nconst app = express();\napp.use(express.json());\napp.post('/plants', (req, res) => {\n  const r = PlantIn.safeParse(req.body);\n  if (!r.success) return res.status(400).json({ error: { code: 'VALIDATION', fields: r.error.flatten().fieldErrors } });\n  const plant = { id: db.length + 1, ...r.data }; db.push(plant);\n  res.status(201).location('/plants/' + plant.id).json(plant);\n});\napp.get('/plants', (req, res) => {\n  const q = ListQuery.parse(req.query);\n  const sorted = [...db].sort((a, b) => (q.sort === 'name' ? 1 : -1) * a.name.localeCompare(b.name));\n  const items = sorted.slice((q.page - 1) * q.limit, q.page * q.limit);\n  res.json({ items, meta: { page: q.page, limit: q.limit, total: db.length } });\n});\n\nconst server = app.listen(3006, async () => {\n  const base = 'http://localhost:3006';\n  let r = await fetch(base + '/plants', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'x', everyDays: 0 }) });\n  console.log('POST bad  ->', r.status, await r.text());\n  r = await fetch(base + '/plants', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: ' Ivy ', everyDays: 5 }) });\n  console.log('POST good ->', r.status, r.headers.get('location'), await r.text());\n  r = await fetch(base + '/plants?page=2&limit=2&sort=-name');\n  console.log('GET page 2 ->', r.status, await r.text());\n  server.close();\n});"
  },
  {
   "cmd": "node m06.mjs",
   "out": "POST bad  -> 400 {\"error\":{\"code\":\"VALIDATION\",\"fields\":{\"name\":[\"String must contain at least 2 character(s)\"],\"everyDays\":[\"Number must be greater than or equal to 1\"]}}}\nPOST good -> 201 /plants/6 {\"id\":6,\"name\":\"Ivy\",\"everyDays\":5}\nGET page 2 -> 200 {\"items\":[{\"id\":4,\"name\":\"Fern\",\"everyDays\":7},{\"id\":2,\"name\":\"Cactus\",\"everyDays\":7}],\"meta\":{\"page\":2,\"limit\":2,\"total\":6}}"
  }
 ],
 "7": [
  {
   "file": "m07/schema.prisma",
   "lang": "prisma",
   "code": "datasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id     Int     @id @default(autoincrement())\n  email  String  @unique\n  plants Plant[]\n}\n\nmodel Plant {\n  id        Int        @id @default(autoincrement())\n  ownerId   Int\n  owner     User       @relation(fields: [ownerId], references: [id], onDelete: Cascade)\n  name      String     @db.VarChar(60)\n  everyDays Int\n  waterings Watering[]\n\n  @@unique([ownerId, name])\n}\n\nmodel Watering {\n  id        Int      @id @default(autoincrement())\n  plantId   Int\n  plant     Plant    @relation(fields: [plantId], references: [id], onDelete: Cascade)\n  wateredAt DateTime @default(now()) @db.Timestamptz(3)\n\n  @@index([plantId, wateredAt(sort: Desc)])\n}"
  },
  {
   "cmd": "npx prisma migrate diff --from-empty --to-schema-datamodel m07/schema.prisma --script",
   "out": "-- CreateTable\nCREATE TABLE \"User\" (\n    \"id\" SERIAL NOT NULL,\n    \"email\" TEXT NOT NULL,\n    CONSTRAINT \"User_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"Plant\" (\n    \"id\" SERIAL NOT NULL,\n    \"ownerId\" INTEGER NOT NULL,\n    \"name\" VARCHAR(60) NOT NULL,\n    \"everyDays\" INTEGER NOT NULL,\n    CONSTRAINT \"Plant_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"Watering\" (\n    \"id\" SERIAL NOT NULL,\n    \"plantId\" INTEGER NOT NULL,\n    \"wateredAt\" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    CONSTRAINT \"Watering_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateIndex\nCREATE UNIQUE INDEX \"User_email_key\" ON \"User\"(\"email\");\n-- CreateIndex\nCREATE UNIQUE INDEX \"Plant_ownerId_name_key\" ON \"Plant\"(\"ownerId\", \"name\");\n-- CreateIndex\nCREATE INDEX \"Watering_plantId_wateredAt_idx\" ON \"Watering\"(\"plantId\", \"wateredAt\" DESC);\n-- AddForeignKey\nALTER TABLE \"Plant\" ADD CONSTRAINT \"Plant_ownerId_fkey\" FOREIGN KEY (\"ownerId\") REFERENCES \"User\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE;\n-- AddForeignKey\nALTER TABLE \"Watering\" ADD CONSTRAINT \"Watering_plantId_fkey\" FOREIGN KEY (\"plantId\") REFERENCES \"Plant\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE;"
  }
 ],
 "8": [
  {
   "file": "m08.mjs",
   "lang": "javascript",
   "code": "import express from 'express';\nimport bcrypt from 'bcryptjs';\nimport jwt from 'jsonwebtoken';\n\nconst SECRET = process.env.JWT_SECRET ?? 'dev-only-change-me';          // real value comes from .env\nconst users = [{ id: 1, email: 'an@example.com', hash: await bcrypt.hash('correct horse', 12) },\n               { id: 2, email: 'binh@example.com', hash: await bcrypt.hash('battery staple', 12) }];\nconst plants = [{ id: 10, ownerId: 1, name: 'Monstera' }];\nconsole.log('stored hash looks like:', users[0].hash.slice(0, 7) + '...', '(length ' + users[0].hash.length + ')');\n\nfunction requireAuth(req, res, next) {\n  const token = (req.get('authorization') ?? '').replace('Bearer ', '');\n  try { req.user = jwt.verify(token, SECRET); next(); }\n  catch { res.status(401).json({ error: { code: 'UNAUTHENTICATED' } }); }\n}\n\nconst app = express();\napp.use(express.json());\napp.post('/auth/login', async (req, res) => {\n  const u = users.find((x) => x.email === req.body.email);\n  if (!u || !(await bcrypt.compare(req.body.password, u.hash))) return res.status(401).json({ error: { code: 'BAD_CREDENTIALS' } });\n  res.json({ accessToken: jwt.sign({ sub: u.id }, SECRET, { expiresIn: '15m' }) });\n});\napp.delete('/plants/:id', requireAuth, (req, res) => {\n  const p = plants.find((x) => x.id === Number(req.params.id));\n  if (!p) return res.status(404).end();\n  if (p.ownerId !== req.user.sub) return res.status(403).json({ error: { code: 'NOT_OWNER' } }); // ownership checked on the SERVER\n  plants.splice(plants.indexOf(p), 1); res.status(204).end();\n});\n\nconst server = app.listen(3008, async () => {\n  const base = 'http://localhost:3008';\n  const login = async (email, password) => (await (await fetch(base + '/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) })).json()).accessToken;\n  const del = (token) => fetch(base + '/plants/10', { method: 'DELETE', headers: token ? { authorization: 'Bearer ' + token } : {} }).then((r) => r.status);\n  const bad = await fetch(base + '/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'an@example.com', password: 'guess' }) });\n  console.log('wrong password   ->', bad.status, await bad.text());\n  console.log('no token         ->', await del());\n  console.log('Binh deletes #10 ->', await del(await login('binh@example.com', 'battery staple')));\n  console.log('An deletes #10   ->', await del(await login('an@example.com', 'correct horse')));\n  server.close();\n});"
  },
  {
   "cmd": "node m08.mjs",
   "out": "stored hash looks like: $2b$12$... (length 60)\nwrong password   -> 401 {\"error\":{\"code\":\"BAD_CREDENTIALS\"}}\nno token         -> 401\nBinh deletes #10 -> 403\nAn deletes #10   -> 204"
  }
 ],
 "9": [
  {
   "file": "m09.mjs",
   "lang": "javascript",
   "code": "import express from 'express';\nimport helmet from 'helmet';\nimport rateLimit from 'express-rate-limit';\n\nconst app = express();\napp.use(helmet());                                   // security headers\napp.use(express.json({ limit: '10kb' }));            // a 5 MB JSON body is an attack, not a plant\nconst loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false });\napp.post('/auth/login', loginLimiter, (req, res) => res.status(401).json({ error: { code: 'BAD_CREDENTIALS' } }));\napp.use((err, req, res, next) => res.status(err.status ?? 500).json({ error: { code: err.type ?? 'INTERNAL' } })); // no stack trace to the client\n\nconst server = app.listen(3009, async () => {\n  const base = 'http://localhost:3009';\n  const post = (body) => fetch(base + '/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body });\n  const r = await post('{}');\n  for (const h of ['content-security-policy', 'x-content-type-options', 'strict-transport-security', 'x-powered-by']) console.log(h.padEnd(26), r.headers.get(h));\n  const codes = []; for (let i = 0; i < 6; i++) codes.push((await post('{}')).status);\n  console.log('6 more login attempts ->', codes.join(' '));\n  const big = await fetch(base + '/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ x: 'a'.repeat(20000) }) });\n  console.log('20 KB body ->', big.status, await big.text());\n  server.close();\n});"
  },
  {
   "cmd": "node m09.mjs",
   "out": "content-security-policy    default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests\nx-content-type-options     nosniff\nstrict-transport-security  max-age=31536000; includeSubDomains\nx-powered-by               null\n6 more login attempts -> 401 401 401 401 429 429\n20 KB body -> 413 {\"error\":{\"code\":\"entity.too.large\"}}"
  }
 ],
 "10": [
  {
   "file": "m10.mjs",
   "lang": "javascript",
   "code": "import { fileTypeFromBuffer } from 'file-type';\nimport { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';\nimport { getSignedUrl } from '@aws-sdk/s3-request-presigner';\n\nconst ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);\nconst MAX = 2 * 1024 * 1024;\n\nasync function checkUpload(name, buf) {\n  if (buf.length > MAX) return 'reject: too large';\n  const t = await fileTypeFromBuffer(buf);          // read the magic bytes, ignore the file name\n  if (!t || !ALLOWED.has(t.mime)) return 'reject: real type is ' + (t ? t.mime : 'unknown');\n  return 'accept as ' + t.mime + ' -> store as .' + t.ext;\n}\nconst png = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');\nconsole.log('photo.jpg (really a PNG) :', await checkUpload('photo.jpg', png));\nconsole.log('cute.png  (really a script):', await checkUpload('cute.png', Buffer.from('<?php system($_GET[1]); ?>')));\nconsole.log('huge.png                 :', await checkUpload('huge.png', Buffer.alloc(MAX + 1)));\n\n// Presigned URL: the browser uploads straight to object storage; the API never holds the bytes.\n// Local S3-compatible store (MinIO) — never your production bucket while developing.\nconst s3 = new S3Client({ region: 'auto', endpoint: 'http://localhost:9000', forcePathStyle: true,\n  credentials: { accessKeyId: 'local-dev', secretAccessKey: 'local-dev-secret' } });\nconst key = 'plants/10/' + crypto.randomUUID() + '.webp';\nconst url = new URL(await getSignedUrl(s3, new PutObjectCommand({ Bucket: 'plant-photos', Key: key, ContentType: 'image/webp' }), { expiresIn: 300 }));\nconsole.log('PUT to  :', url.origin + url.pathname.replace(/[0-9a-f-]{36}/, '<uuid>'));\nconsole.log('expires :', url.searchParams.get('X-Amz-Expires'), 's, signed headers:', url.searchParams.get('X-Amz-SignedHeaders'));"
  },
  {
   "cmd": "node m10.mjs",
   "out": "photo.jpg (really a PNG) : accept as image/png -> store as .png\ncute.png  (really a script): reject: real type is unknown\nhuge.png                 : reject: too large\nPUT to  : http://localhost:9000/plant-photos/plants/10/<uuid>.webp\nexpires : 300 s, signed headers: host"
  }
 ],
 "11": [
  {
   "file": "m11.mjs",
   "lang": "javascript",
   "code": "import { createServer } from 'node:http';\nimport { Server } from 'socket.io';\nimport { io as connect } from 'socket.io-client';\n\nconst TOKENS = { 'token-an': { id: 1 }, 'token-binh': { id: 2 } }; // stands in for jwt.verify\nconst owners = { 10: 1 };                                          // plant 10 belongs to user 1\n\nconst http = createServer();\nconst io = new Server(http);\nio.use((socket, next) => {                                         // authenticate ONCE, at the handshake\n  const user = TOKENS[socket.handshake.auth.token];\n  if (!user) return next(new Error('UNAUTHENTICATED'));\n  socket.data.user = user; next();\n});\nio.on('connection', (socket) => {\n  socket.on('plant:watch', (plantId, ack) => {                     // authorize EVERY action\n    if (owners[plantId] !== socket.data.user.id) return ack({ ok: false, error: 'NOT_OWNER' });\n    socket.join('plant:' + plantId); ack({ ok: true });\n  });\n});\n\nhttp.listen(3011, async () => {\n  const url = 'http://localhost:3011';\n  const bad = connect(url, { auth: { token: 'forged' } });\n  await new Promise((ok) => bad.on('connect_error', (e) => { console.log('forged token  ->', e.message); bad.close(); ok(); }));\n  const binh = connect(url, { auth: { token: 'token-binh' } });\n  console.log('binh watch 10 ->', JSON.stringify(await binh.emitWithAck('plant:watch', 10)));\n  const an = connect(url, { auth: { token: 'token-an' } });\n  console.log('an watch 10   ->', JSON.stringify(await an.emitWithAck('plant:watch', 10)));\n  binh.on('plant:watered', () => console.log('binh got it (BUG!)'));\n  an.on('plant:watered', (e) => {\n    console.log('an received   ->', JSON.stringify(e));\n    an.close(); binh.close(); io.close(); http.close();\n  });\n  io.to('plant:10').emit('plant:watered', { plantId: 10, at: '2026-11-22T08:00:00.000Z' }); // e.g. after POST /plants/10/waterings\n});"
  },
  {
   "cmd": "node m11.mjs",
   "out": "forged token  -> UNAUTHENTICATED\nbinh watch 10 -> {\"ok\":false,\"error\":\"NOT_OWNER\"}\nan watch 10   -> {\"ok\":true}\nan received   -> {\"plantId\":10,\"at\":\"2026-11-22T08:00:00.000Z\"}"
  }
 ],
 "12": [
  {
   "file": "m12.mjs",
   "lang": "javascript",
   "code": "import Redis from 'ioredis';\nconst redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6391');\n\nlet dbCalls = 0;\nasync function dbFindPlant(id) { dbCalls++; await new Promise((r) => setTimeout(r, 120)); return { id, name: 'Monstera', everyDays: 7 }; } // pretend slow query\n\nasync function getPlant(id) {                               // cache-aside\n  const key = 'plant:' + id;\n  const hit = await redis.get(key);\n  if (hit) return JSON.parse(hit);\n  const plant = await dbFindPlant(id);\n  await redis.set(key, JSON.stringify(plant), 'EX', 60);   // ALWAYS a TTL\n  return plant;\n}\nasync function updatePlant(id, patch) { /* UPDATE in the database first, then: */ await redis.del('plant:' + id); }\n\nasync function timed(label, fn) { const t = performance.now(); await fn(); console.log(label.padEnd(24), (performance.now() - t).toFixed(1), 'ms, db calls so far:', dbCalls); }\nawait redis.del('plant:10');\nawait timed('1st read (miss)', () => getPlant(10));\nawait timed('2nd read (hit)', () => getPlant(10));\nawait timed('update -> invalidate', () => updatePlant(10, { everyDays: 5 }));\nawait timed('read after update', () => getPlant(10));\nconsole.log('TTL left on key:', await redis.ttl('plant:10'), 's');\n\n// Atomic rate limit: INCR + EXPIRE in one MULTI, safe across many API processes\nasync function allow(userId, limit = 3) {\n  const key = 'rl:water:' + userId;\n  const [[, n]] = await redis.multi().incr(key).expire(key, 60, 'NX').exec();\n  return n <= limit;\n}\nawait redis.del('rl:water:1');\nconst r = []; for (let i = 0; i < 5; i++) r.push(await allow(1));\nconsole.log('5 waterings in a minute ->', r.join(' '));\nawait redis.quit();"
  },
  {
   "cmd": "redis-server --port 6391 --save \"\" --daemonize yes && node m12.mjs",
   "out": "1st read (miss)          122.1 ms, db calls so far: 1\n2nd read (hit)           0.5 ms, db calls so far: 1\nupdate -> invalidate     0.3 ms, db calls so far: 1\nread after update        122.0 ms, db calls so far: 2\nTTL left on key: 60 s\n5 waterings in a minute -> true true true false false"
  }
 ],
 "13": [
  {
   "file": "m13.mjs",
   "lang": "javascript",
   "code": "import { Queue, Worker } from 'bullmq';\nconst connection = { host: 'localhost', port: 6391 };\n\nconst queue = new Queue('reminders', { connection });\nawait queue.obliterate({ force: true });\n\nlet attempts = 0;\nconst sent = new Set();                                   // stands in for a \"sent_reminders\" table with a UNIQUE key\nconst worker = new Worker('reminders', async (job) => {\n  attempts++;\n  if (attempts < 3) throw new Error('mail server timeout (attempt ' + attempts + ')');\n  if (sent.has(job.id)) return 'already sent';            // idempotent: a retry never mails twice\n  sent.add(job.id);\n  return 'mailed ' + job.data.email + ' about plant ' + job.data.plantId;\n}, { connection });\n\nworker.on('failed', (job, err) => console.log('failed   ', job.id, '-', err.message, '| next retry in', job.opts.backoff.delay * 2 ** (job.attemptsMade - 1), 'ms'));\nworker.on('completed', async (job, result) => {\n  console.log('completed', job.id, '-', result, '| attempts:', job.attemptsMade);\n  console.log('jobs in queue:', JSON.stringify(await queue.getJobCounts('waiting', 'delayed', 'completed', 'failed')));\n  await worker.close(); await queue.close();\n});\n\nconst opts = { jobId: 'remind-10-2026-11-22', attempts: 5, backoff: { type: 'exponential', delay: 200 }, removeOnComplete: 100 };\nawait queue.add('remind', { plantId: 10, email: 'an@example.com' }, opts);\nawait queue.add('remind', { plantId: 10, email: 'an@example.com' }, opts); // same jobId: ignored, no duplicate"
  },
  {
   "cmd": "node m13.mjs",
   "out": "failed    remind-10-2026-11-22 - mail server timeout (attempt 1) | next retry in 200 ms\nfailed    remind-10-2026-11-22 - mail server timeout (attempt 2) | next retry in 400 ms\ncompleted remind-10-2026-11-22 - mailed an@example.com about plant 10 | attempts: 3\njobs in queue: {\"waiting\":0,\"delayed\":0,\"completed\":1,\"failed\":0}"
  }
 ],
 "14": [
  {
   "file": "m14/app.mjs",
   "lang": "javascript",
   "code": "import express from 'express';\nimport { isThirsty, createPlant } from '../plant.mjs';\nexport function buildApp(store = []) {                     // the app is built by a function: tests get a fresh one\n  const app = express();\n  app.use(express.json());\n  app.post('/plants', (req, res) => {\n    try { const p = createPlant(req.body); store.push(p); res.status(201).json(p); }\n    catch (e) { res.status(400).json({ error: { code: 'VALIDATION', message: e.message } }); }\n  });\n  app.get('/plants', (req, res) => res.json(store));\n  return app;\n}\nexport { isThirsty };"
  },
  {
   "file": "m14/plants.test.mjs",
   "lang": "javascript",
   "code": "import { test, describe } from 'node:test';\nimport assert from 'node:assert/strict';\nimport request from 'supertest';\nimport { buildApp, isThirsty } from './app.mjs';\n\ndescribe('isThirsty (unit)', () => {\n  const p = { everyDays: 7 };\n  test('exactly on the due day counts as thirsty (edge case)', () => {\n    assert.equal(isThirsty(p, new Date('2026-11-15T08:00:00Z'), new Date('2026-11-22T08:00:00Z')), true);\n  });\n  test('one minute before the due time is not thirsty', () => {\n    assert.equal(isThirsty(p, new Date('2026-11-15T08:00:00Z'), new Date('2026-11-22T07:59:00Z')), false);\n  });\n});\n\ndescribe('POST /plants (HTTP)', () => {\n  test('201 and the plant appears in the list', async () => {\n    const app = buildApp();\n    const res = await request(app).post('/plants').send({ name: 'Fern', everyDays: 3 }).expect(201);\n    assert.equal(res.body.name, 'Fern');\n    const list = await request(app).get('/plants').expect(200);\n    assert.equal(list.body.length, 1);\n  });\n  test('400 with a readable message for a bad body', async () => {\n    const res = await request(buildApp()).post('/plants').send({ name: 'F', everyDays: 3 }).expect(400);\n    assert.match(res.body.error.message, /at least 2/);\n  });\n});"
  },
  {
   "cmd": "node --test m14/",
   "out": "▶ isThirsty (unit)\n  ✔ exactly on the due day counts as thirsty (edge case) (1.109208ms)\n  ✔ one minute before the due time is not thirsty (0.098791ms)\n✔ isThirsty (unit) (1.877625ms)\n▶ POST /plants (HTTP)\n  ✔ 201 and the plant appears in the list (25.265167ms)\n  ✔ 400 with a readable message for a bad body (1.848875ms)\n✔ POST /plants (HTTP) (27.303125ms)\nℹ tests 4\nℹ pass 4\nℹ fail 0\nℹ duration_ms 177.296417"
  }
 ],
 "15": [
  {
   "file": "m15.mjs",
   "lang": "javascript",
   "code": "import express from 'express';\nimport pino from 'pino';\nimport client from 'prom-client';\nimport { randomUUID } from 'node:crypto';\n\nconst log = pino({ base: { service: 'plant-care-api' }, timestamp: pino.stdTimeFunctions.isoTime });\nconst httpDuration = new client.Histogram({ name: 'http_request_duration_seconds', help: 'HTTP latency', labelNames: ['method', 'route', 'status'], buckets: [0.05, 0.1, 0.5, 1] });\n\nconst app = express();\napp.use((req, res, next) => {\n  req.id = req.get('x-request-id') ?? randomUUID();          // one id through every layer\n  req.log = log.child({ reqId: req.id });\n  res.set('x-request-id', req.id);\n  const end = httpDuration.startTimer();\n  res.on('finish', () => {\n    const route = req.route?.path ?? 'unmatched';             // route TEMPLATE, never the raw URL (label explosion)\n    end({ method: req.method, route, status: res.statusCode });\n    req.log.info({ method: req.method, route, status: res.statusCode }, 'request done');\n  });\n  next();\n});\napp.get('/plants/:id', (req, res) => { req.log.info({ plantId: req.params.id }, 'loading plant'); res.json({ id: req.params.id }); });\napp.get('/healthz', (req, res) => res.json({ status: 'ok' }));\napp.get('/metrics', async (req, res) => { res.type(client.register.contentType); res.send(await client.register.metrics()); });\n\nconst server = app.listen(3015, async () => {\n  const base = 'http://localhost:3015';\n  await fetch(base + '/plants/10', { headers: { 'x-request-id': 'demo-req-1' } });\n  await fetch(base + '/plants/11');\n  const m = await (await fetch(base + '/metrics')).text();\n  console.log(m.match(/^http_request_duration_seconds_count.*$/gm).join(' | '));\n  server.close();\n});"
  },
  {
   "cmd": "node m15.mjs",
   "out": "{\"level\":30,\"time\":\"2026-11-22T12:47:46.056Z\",\"service\":\"plant-care-api\",\"reqId\":\"demo-req-1\",\"plantId\":\"10\",\"msg\":\"loading plant\"}\n{\"level\":30,\"time\":\"2026-11-22T12:47:46.058Z\",\"service\":\"plant-care-api\",\"reqId\":\"demo-req-1\",\"method\":\"GET\",\"route\":\"/plants/:id\",\"status\":200,\"msg\":\"request done\"}\n{\"level\":30,\"time\":\"2026-11-22T12:47:46.063Z\",\"service\":\"plant-care-api\",\"reqId\":\"20b92285-626a-444a-b994-a94a0ab954fb\",\"plantId\":\"11\",\"msg\":\"loading plant\"}\n{\"level\":30,\"time\":\"2026-11-22T12:47:46.064Z\",\"service\":\"plant-care-api\",\"reqId\":\"20b92285-626a-444a-b994-a94a0ab954fb\",\"method\":\"GET\",\"route\":\"/plants/:id\",\"status\":200,\"msg\":\"request done\"}\n{\"level\":30,\"time\":\"2026-11-22T12:47:46.067Z\",\"service\":\"plant-care-api\",\"reqId\":\"ae73cb6b-c57d-4aeb-833a-dc9adfa1dda4\",\"method\":\"GET\",\"route\":\"/metrics\",\"status\":200,\"msg\":\"request done\"}\nhttp_request_duration_seconds_count{method=\"GET\",route=\"/plants/:id\",status=\"200\"} 2"
  }
 ],
 "16": [
  {
   "file": "m16.mjs",
   "lang": "javascript",
   "code": "import express from 'express';\nimport autocannon from 'autocannon';\n\n// 50 000 waterings in memory stand in for a table\nconst waterings = Array.from({ length: 50_000 }, (_, i) => ({ plantId: i % 500, at: 1_700_000_000_000 + i * 60_000 }));\n\nfunction statsSlow() {                                   // what the first version did on EVERY request\n  const byPlant = {};\n  for (const w of [...waterings].sort((a, b) => b.at - a.at)) (byPlant[w.plantId] ??= []).push(w.at);\n  return Object.keys(byPlant).length;\n}\nlet cached = null;                                       // the fix: compute once, invalidate on write\nfunction statsFast() { return (cached ??= statsSlow()); }\n\nconst app = express();\napp.get('/stats/slow', (req, res) => res.json({ plants: statsSlow() }));\napp.get('/stats/fast', (req, res) => res.json({ plants: statsFast() }));\nconst server = app.listen(3016, async () => {\n  for (const path of ['/stats/slow', '/stats/fast']) {\n    const r = await autocannon({ url: 'http://localhost:3016' + path, connections: 20, duration: 5 });\n    console.log(path.padEnd(12), 'req/s avg', Math.round(r.requests.average), '| p50', r.latency.p50, 'ms | p99', r.latency.p99, 'ms | errors', r.errors);\n  }\n  server.close();\n});"
  },
  {
   "cmd": "node m16.mjs",
   "out": "/stats/slow  req/s avg 810 | p50 23 ms | p99 39 ms | errors 0\n/stats/fast  req/s avg 21208 | p50 0 ms | p99 1 ms | errors 0"
  }
 ],
 "17": [
  {
   "file": "m17.mjs",
   "lang": "javascript",
   "code": "import express from 'express';\nconst app = express();\napp.get('/plants/slow-report', async (req, res) => { await new Promise((r) => setTimeout(r, 1500)); res.json({ ok: true }); });\nconst server = app.listen(3017, () => console.log('listening, pid', process.pid));\n\nprocess.on('SIGTERM', () => {                             // docker stop / a deploy sends SIGTERM first\n  console.log('SIGTERM: stop accepting, finish in-flight requests');\n  server.close(() => { console.log('all requests done, closing DB/Redis, exit 0'); process.exit(0); });\n  setTimeout(() => { console.log('forced exit after 10 s'); process.exit(1); }, 10_000).unref();\n});\n\nif (process.argv[2] === 'demo') {\n  setTimeout(async () => {\n    const t = Date.now();\n    const p = fetch('http://localhost:3017/plants/slow-report').then(async (r) => console.log('in-flight request finished:', r.status, await r.text(), 'after', Date.now() - t, 'ms'));\n    setTimeout(() => process.kill(process.pid, 'SIGTERM'), 200);     // the deploy happens mid-request\n    await p;\n  }, 100);\n}"
  },
  {
   "file": "m17img/Dockerfile",
   "lang": "dockerfile",
   "code": "# syntax=docker/dockerfile:1\nFROM node:22-alpine AS deps\nWORKDIR /app\nCOPY package.json package-lock.json ./\nRUN npm ci --omit=dev\n\nFROM node:22-alpine\nENV NODE_ENV=production\nWORKDIR /app\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY package.json ./\nCOPY src ./src\nUSER node\nEXPOSE 3017\nCMD [\"node\", \"src/server.js\"]"
  },
  {
   "cmd": "node m17.mjs demo",
   "out": "listening, pid 76560\nSIGTERM: stop accepting, finish in-flight requests\nin-flight request finished: 200 {\"ok\":true} after 1537 ms\nall requests done, closing DB/Redis, exit 0"
  },
  {
   "cmd": "cp m17.mjs src/server.js && docker build -t plant-care-api:demo . && docker run -d --name plant-demo -p 3017:3017 plant-care-api:demo\ncurl -s localhost:3017/plants/slow-report & sleep 0.3; docker stop plant-demo; docker logs plant-demo",
   "out": "{\"ok\":true} <- HTTP 200\nlistening, pid 1\nSIGTERM: stop accepting, finish in-flight requests\nall requests done, closing DB/Redis, exit 0\nexit code 0"
  }
 ],
 "18": [
  {
   "file": "m18/check-layers.mjs",
   "lang": "javascript",
   "code": "// check-layers.mjs — the architecture rules, as a test that CI runs\nimport { readdir, readFile } from 'node:fs/promises';\nimport path from 'node:path';\n\nconst RULES = [\n  { file: /[.]routes[.]js$/, forbid: /lib[/]db[.]js|[.]repo[.]js/, why: 'routes call services, never the database or a repo' },\n  { file: /features[/]([^/]+)[/]/, forbidOtherFeatureRepo: true, why: 'a feature reads another feature only through its service' },\n];\nconst files = (await readdir('src', { recursive: true })).filter((f) => f.endsWith('.js')).map((f) => path.join('src', f));\nlet bad = 0;\nfor (const f of files) {\n  const imports = [...(await readFile(f, 'utf8')).matchAll(/from '([^']+)'/g)].map((m) => m[1]);\n  for (const imp of imports) {\n    if (RULES[0].file.test(f) && RULES[0].forbid.test(imp)) { bad++; console.log('✗', f, 'imports', imp, '-', RULES[0].why); }\n    const mine = f.match(RULES[1].file)?.[1];\n    const other = imp.match(/[.][.][/]([^/]+)[/][^/]+[.]repo[.]js$/)?.[1];\n    if (mine && other && other !== mine) { bad++; console.log('✗', f, 'imports', imp, '-', RULES[1].why); }\n  }\n}\nconsole.log(bad ? bad + ' violation(s)' : '✓ layers clean', '(' + files.length + ' files)');\nprocess.exitCode = bad ? 1 : 0;"
  },
  {
   "cmd": "node check-layers.mjs",
   "out": "✗ src/features/waterings/waterings.routes.js imports ../../lib/db.js - routes call services, never the database or a repo\n✗ src/features/waterings/waterings.routes.js imports ../plants/plants.repo.js - routes call services, never the database or a repo\n✗ src/features/waterings/waterings.routes.js imports ../plants/plants.repo.js - a feature reads another feature only through its service\n3 violation(s) (5 files)"
  }
 ]
};
