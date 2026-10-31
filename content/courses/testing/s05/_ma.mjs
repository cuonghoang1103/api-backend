/**
 * _ma.mjs (Chương 5) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  server: `// LabFlow Lite HTTP API (Chapter 5). Express 5: errors thrown in async handlers reach the error middleware.
import express from 'express';
import { bookLab, BookingError } from '../booking/service.js';
import { BookingInput } from './schemas.js';

const RULE_CODES = ['OFF_GRID', 'END_BEFORE_START', 'OUTSIDE_HOURS', 'TOO_LONG'];
const fail = (res, status, code, extra = {}) => res.status(status).json({ error: { code, ...extra } });
const toPublic = (b) => ({ id: b.id, lab: b.lab, date: b.date, start: b.start, end: b.end, seats: b.seats, status: b.status, minutes: b.minutes });

export function createApp({ repo, auth }) {
  const app = express();
  app.use(express.json());

  const requireUser = async (req, res, next) => {
    const header = req.get('authorization') ?? '';
    if (!header.startsWith('Bearer ')) return fail(res, 401, 'UNAUTHENTICATED');
    try {
      req.user = await auth.verify(header.slice(7));
    } catch {
      return fail(res, 401, 'UNAUTHENTICATED');
    }
    next();
  };
  const requireRole = (role) => (req, res, next) => (req.user.role === role ? next() : fail(res, 403, 'FORBIDDEN'));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.post('/api/bookings', requireUser, async (req, res) => {
    const parsed = BookingInput.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
      return fail(res, 400, 'VALIDATION', { details });
    }
    const booking = await bookLab(repo, { ...parsed.data, role: req.user.role, userId: req.user.id });
    res.status(201).location('/api/bookings/' + booking.id).json(toPublic(booking));
  });

  app.get('/api/bookings/:id', requireUser, async (req, res) => {
    const booking = await repo.findById(Number(req.params.id));
    const mine = booking && (booking.userId === req.user.id || req.user.role === 'ADMIN');
    if (!mine) return fail(res, 404, 'NOT_FOUND');   // someone else's booking looks exactly like a missing one
    res.json(toPublic(booking));
  });

  app.get('/api/admin/bookings', requireUser, requireRole('ADMIN'), async (req, res) => {
    res.json((await repo.list()).map(toPublic));
  });

  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') return fail(res, 400, 'BAD_JSON');
    if (err instanceof BookingError) {
      if (RULE_CODES.includes(err.code)) return fail(res, 422, err.code);
      if (err.code === 'OVERLAP') return fail(res, 409, 'OVERLAP');
      if (err.code === 'STORAGE_DOWN') return fail(res, 503, 'STORAGE_DOWN');
    }
    return fail(res, 500, 'INTERNAL');
  });
  return app;
}`,
  auth: `// Sign and verify access tokens (JWT, HS256) with jose. The clock is a parameter, so tests can expire a token.
import { SignJWT, jwtVerify } from 'jose';

export function createAuth({ secret, now = () => new Date() }) {
  const key = new TextEncoder().encode(secret);
  return {
    async sign({ id, role }, ttlSeconds = 3600) {
      const iat = Math.floor(now().getTime() / 1000);
      return new SignJWT({ role })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(String(id))
        .setIssuedAt(iat)
        .setExpirationTime(iat + ttlSeconds)
        .sign(key);
    },
    async verify(token) {
      const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'], currentDate: now() });
      return { id: payload.sub, role: payload.role };
    },
  };
}`,
  schemas: `// What a client may send. Unknown keys are refused: the role comes from the token, never from the body.
import { z } from 'zod';

const time = z.string().regex(/^([01]\\d|2[0-3]):[0-5]\\d$/, 'time must be HH:MM between 00:00 and 23:59');

export const BookingInput = z.strictObject({
  lab: z.string().regex(/^[A-Z]{2}-\\d{3}$/, 'lab must look like BE-201'),
  date: z.iso.date(),
  start: time,
  end: time,
  seats: z.number().int().min(1).max(200),
});`,
  main: `// Start the real server: JWT_SECRET=… PORT=3000 node src/api/main.js
// Tests never import this file — they use createApp() and Supertest, which opens a temporary port by itself.
import { createApp } from './server.js';
import { createAuth } from './auth.js';
import { createMemoryRepo } from '../booking/service.js';

const app = createApp({ repo: createMemoryRepo(), auth: createAuth({ secret: process.env.JWT_SECRET }) });
const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log('LabFlow Lite API on http://localhost:' + port));`,
  service: `import { checkSlot, needsApproval } from '../rules/booking.js';

export class BookingError extends Error {
  constructor(code, options) {
    super(code, options);
    this.name = 'BookingError';
    this.code = code;
  }
}

// An in-memory "database" whose methods are async, like a real one.
export function createMemoryRepo() {
  const rows = [];
  const latency = () => new Promise((resolve) => setTimeout(resolve, 5));
  return {
    async findOverlap(lab, date, start, end) {
      await latency();
      return rows.find((b) => b.lab === lab && b.date === date && b.start < end && start < b.end) ?? null;
    },
    async insert(booking) {
      await latency();
      const row = { id: rows.length + 1, ...booking };
      rows.push(row);
      return row;
    },
    async findById(id) {
      await latency();
      return rows.find((b) => b.id === id) ?? null;
    },
    async list() {
      await latency();
      return [...rows];
    },
    count: () => rows.length,
  };
}

export async function bookLab(repo, input) {
  const slot = checkSlot(input.start, input.end);
  if (!slot.ok) throw new BookingError(slot.code);
  let clash;
  try {
    clash = await repo.findOverlap(input.lab, input.date, input.start, input.end);
  } catch (err) {
    throw new BookingError('STORAGE_DOWN', { cause: err });
  }
  if (clash) throw new BookingError('OVERLAP');
  const status = needsApproval(input) ? 'PENDING' : 'CONFIRMED';
  try {
    return await repo.insert({ ...input, minutes: slot.minutes, status });
  } catch (err) {
    if (err instanceof BookingError) throw err; // Chapter 4: the database itself can say OVERLAP
    throw new BookingError('STORAGE_DOWN', { cause: err });
  }
}`,
  apiSupport: `// One fresh app per test: its own in-memory repository, its own auth with a test secret, an optional fixed clock.
import { createApp } from '../../src/api/server.js';
import { createAuth } from '../../src/api/auth.js';
import { createMemoryRepo } from '../../src/booking/service.js';

export const SECRET = 'test-secret-not-for-production';

export function makeApi({ now } = {}) {
  const repo = createMemoryRepo();
  const auth = createAuth({ secret: SECRET, now });
  const app = createApp({ repo, auth });
  const bearer = async (id, role = 'STUDENT') => 'Bearer ' + (await auth.sign({ id, role }));
  return { app, repo, auth, bearer };
}

export const body = (overrides = {}) => ({ lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, ...overrides });`,
  contractSupport: `// Check a real response against openapi.json: the status must be documented, the body must match its schema.
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const doc = JSON.parse(readFileSync(new URL('../../openapi.json', import.meta.url), 'utf8'));
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
const local = (schema) => JSON.parse(JSON.stringify(schema).replaceAll('#/components/schemas/', ''));
for (const [name, schema] of Object.entries(doc.components.schemas)) ajv.addSchema(local(schema), name);

export function contractErrors(method, path, res) {
  const operation = doc.paths[path]?.[method];
  if (!operation) return [method.toUpperCase() + ' ' + path + ' is not in the contract'];
  const documented = operation.responses[String(res.status)];
  if (!documented) return ['status ' + res.status + ' is not documented for ' + method.toUpperCase() + ' ' + path];
  const schema = documented.content?.['application/json']?.schema;
  if (!schema) return [];
  const validate = ajv.compile(local(schema));
  return validate(res.body) ? [] : validate.errors.map((e) => (e.instancePath || '(body)') + ' ' + e.message + (e.params.additionalProperty ? ': ' + e.params.additionalProperty : ''));
}`,
  openapi: `{
  "openapi": "3.1.0",
  "info": { "title": "LabFlow Lite API", "version": "1.0.0" },
  "paths": {
    "/api/bookings": {
      "post": {
        "summary": "Book a lab",
        "responses": {
          "201": { "description": "Created", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Booking" } } } },
          "400": { "description": "Malformed request", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } },
          "401": { "description": "No valid token", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } },
          "409": { "description": "Slot taken", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } },
          "422": { "description": "Against a booking rule", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } }
        }
      }
    },
    "/api/bookings/{id}": {
      "get": {
        "summary": "One of my bookings",
        "responses": {
          "200": { "description": "OK", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Booking" } } } },
          "401": { "description": "No valid token", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } },
          "404": { "description": "Missing, or not mine", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } }
        }
      }
    },
    "/api/admin/bookings": {
      "get": {
        "summary": "All bookings (ADMIN)",
        "responses": {
          "200": { "description": "OK", "content": { "application/json": { "schema": { "type": "array", "items": { "$ref": "#/components/schemas/Booking" } } } } },
          "401": { "description": "No valid token", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } },
          "403": { "description": "Not an admin", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Error" } } } }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Booking": {
        "type": "object",
        "additionalProperties": false,
        "required": ["id", "lab", "date", "start", "end", "seats", "status", "minutes"],
        "properties": {
          "id": { "type": "integer", "minimum": 1 },
          "lab": { "type": "string", "pattern": "^[A-Z]{2}-[0-9]{3}$" },
          "date": { "type": "string", "format": "date" },
          "start": { "type": "string", "pattern": "^[0-2][0-9]:[0-5][0-9]$" },
          "end": { "type": "string", "pattern": "^[0-2][0-9]:[0-5][0-9]$" },
          "seats": { "type": "integer", "minimum": 1 },
          "status": { "enum": ["CONFIRMED", "PENDING"] },
          "minutes": { "type": "integer", "minimum": 30 }
        }
      },
      "Error": {
        "type": "object",
        "additionalProperties": false,
        "required": ["error"],
        "properties": {
          "error": {
            "type": "object",
            "required": ["code"],
            "properties": {
              "code": { "type": "string", "pattern": "^[A-Z_]+$" },
              "details": { "type": "array", "items": { "type": "object", "required": ["path", "message"] } }
            }
          }
        }
      }
    }
  }
}`,
  pkg: `{
  "name": "labflow-lite",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "vitest run",
    "test:unit": "vitest run src/",
    "test:watch": "vitest",
    "test:int": "vitest run --config vitest.integration.config.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "devDependencies": {
    "@testcontainers/postgresql": "^12.2.1",
    "ajv": "8.20.0",
    "ajv-formats": "3.0.1",
    "fast-check": "^4.10.2",
    "msw": "^3.0.3",
    "supertest": "^7.3.1",
    "testcontainers": "^12.2.1",
    "vitest": "^5.0.5"
  },
  "dependencies": {
    "express": "^5.3.0",
    "jose": "6.2.12",
    "pg": "^8.23.1",
    "zod": "4.6.7"
  }
}`,
  supertest: `import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';

describe('POST /api/bookings — through real HTTP, without starting the server', () => {
  it('GET /api/health answers 200 JSON', async () => {
    const { app } = makeApi();
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\\/json/);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('201 + Location, and the Location really serves the booking', async () => {
    const { app, bearer } = makeApi();
    const auth = await bearer('an');
    const res = await request(app).post('/api/bookings').set('Authorization', auth).send(body());
    expect(res.status).toBe(201);
    expect(res.headers.location).toBe('/api/bookings/1');
    expect(res.body).toEqual({ id: 1, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, status: 'CONFIRMED', minutes: 120 });
    const again = await request(app).get(res.headers.location).set('Authorization', auth);
    expect(again.body).toEqual(res.body);
  });

  it('a business-rule violation is 422 with the rule code', async () => {
    const { app, bearer } = makeApi();
    const res = await request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(body({ start: '06:00' }));
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ error: { code: 'OUTSIDE_HOURS' } });
  });

  it('the same slot twice is 409 OVERLAP', async () => {
    const { app, bearer } = makeApi();
    const auth = await bearer('an');
    await request(app).post('/api/bookings').set('Authorization', auth).send(body());
    const res = await request(app).post('/api/bookings').set('Authorization', auth).send(body());
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('OVERLAP');
  });
});`,
  chiStatus: `// A test that only looks at the status code.
import { it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';

it('creating a booking works (status only)', async () => {
  const { app, bearer } = makeApi();
  const res = await request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(body());
  expect(res.status).toBe(201);
});`,
  authTest: `import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';
import { createAuth } from '../src/api/auth.js';

describe('authentication: who are you? → 401', () => {
  it.each([
    ['no Authorization header', undefined],
    ['not a Bearer token', 'Basic YW46cGFzcw=='],
    ['a random string', 'Bearer not-a-jwt'],
  ])('%s → 401', async (_, header) => {
    const { app } = makeApi();
    const req = request(app).get('/api/bookings/1');
    const res = header ? await req.set('Authorization', header) : await req;
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: { code: 'UNAUTHENTICATED' } });
  });

  it('a token signed with another secret → 401', async () => {
    const { app } = makeApi();
    const forged = await createAuth({ secret: 'attacker-secret' }).sign({ id: 'an', role: 'ADMIN' });
    const res = await request(app).get('/api/admin/bookings').set('Authorization', 'Bearer ' + forged);
    expect(res.status).toBe(401);
  });

  it('a token issued at 09:00 for 1 hour is refused at 10:01', async () => {
    let clock = new Date('2030-01-01T09:00:00Z');
    const { app, bearer } = makeApi({ now: () => clock });
    const auth = await bearer('an');
    expect((await request(app).get('/api/bookings/1').set('Authorization', auth)).status).toBe(404); // valid token, no booking
    clock = new Date('2030-01-01T10:01:00Z');
    expect((await request(app).get('/api/bookings/1').set('Authorization', auth)).status).toBe(401);
  });
});

describe('authorisation: are you allowed? → 403 / 404', () => {
  it('a student on the admin list → 403; an admin → 200', async () => {
    const { app, bearer } = makeApi();
    expect((await request(app).get('/api/admin/bookings').set('Authorization', await bearer('an'))).status).toBe(403);
    expect((await request(app).get('/api/admin/bookings').set('Authorization', await bearer('boss', 'ADMIN'))).status).toBe(200);
  });

  it("student B cannot read student A's booking — it looks missing (404)", async () => {
    const { app, bearer } = makeApi();
    await request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(body());
    expect((await request(app).get('/api/bookings/1').set('Authorization', await bearer('an'))).status).toBe(200);
    expect((await request(app).get('/api/bookings/1').set('Authorization', await bearer('binh'))).status).toBe(404);
    expect((await request(app).get('/api/bookings/1').set('Authorization', await bearer('boss', 'ADMIN'))).status).toBe(200);
  });

  it('a student cannot make themselves ADMIN through the body', async () => {
    const { app, bearer } = makeApi();
    const res = await request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(body({ role: 'ADMIN', seats: 60 }));
    expect(res.status).toBe(400);
    expect(res.body.error.details).toContainEqual({ path: '', message: 'Unrecognized key: "role"' });
  });
});`,
  validation: `import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';

const post = async (payload) => {
  const { app, bearer } = makeApi();
  return request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(payload);
};

describe('400 VALIDATION: the request itself is malformed', () => {
  const { lab, ...noLab } = body();
  it.each([
    ['lab missing', 'lab', noLab],
    ['seats as a string', 'seats', body({ seats: '20' })],
    ['seats 2.5', 'seats', body({ seats: 2.5 })],
    ['date 2026-13-01', 'date', body({ date: '2026-13-01' })],
    ['start "7:00"', 'start', body({ start: '7:00' })],
    ['end "24:00"', 'end', body({ end: '24:00' })],
  ])('%s → 400 on path "%s"', async (_, path, payload) => {
    const res = await post(payload);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION');
    expect(res.body.error.details.map((d) => d.path)).toContain(path);
  });

  it('broken JSON → 400 BAD_JSON', async () => {
    const { app, bearer } = makeApi();
    const res = await request(app).post('/api/bookings').set('Authorization', await bearer('an'))
      .set('Content-Type', 'application/json').send('{"lab": "BE-201",');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: { code: 'BAD_JSON' } });
  });
});

describe('422: well-formed, but against a business rule', () => {
  it.each([
    ['08:15', '09:00', 'OFF_GRID'],
    ['10:00', '08:00', 'END_BEFORE_START'],
    ['08:00', '12:30', 'TOO_LONG'],
  ])('%s–%s → 422 %s', async (start, end, code) => {
    const res = await post(body({ start, end }));
    expect(res.status).toBe(422);
    expect(res.body).toEqual({ error: { code } });
  });
});`,
  hopDong: `import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';
import { contractErrors } from '../test/support/contract.js';

describe('every real response matches openapi.json', () => {
  it('POST /api/bookings: 201, 400, 401, 409, 422', async () => {
    const { app, bearer } = makeApi();
    const auth = await bearer('an');
    const post = (payload, header = auth) => request(app).post('/api/bookings').set('Authorization', header).send(payload);
    const responses = [
      await post(body()),                       // 201
      await post(body({ seats: 0 })),           // 400
      await post(body(), 'Bearer nope'),        // 401
      await post(body()),                       // 409
      await post(body({ start: '06:00' })),     // 422
    ];
    expect(responses.map((r) => r.status)).toEqual([201, 400, 401, 409, 422]);
    for (const res of responses) expect(contractErrors('post', '/api/bookings', res)).toEqual([]);
  });

  it('GET /api/bookings/{id} and GET /api/admin/bookings', async () => {
    const { app, bearer } = makeApi();
    await request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(body());
    const one = await request(app).get('/api/bookings/1').set('Authorization', await bearer('an'));
    const notMine = await request(app).get('/api/bookings/1').set('Authorization', await bearer('binh'));
    const list = await request(app).get('/api/admin/bookings').set('Authorization', await bearer('boss', 'ADMIN'));
    const denied = await request(app).get('/api/admin/bookings').set('Authorization', await bearer('an'));
    expect(contractErrors('get', '/api/bookings/{id}', one)).toEqual([]);
    expect(contractErrors('get', '/api/bookings/{id}', notMine)).toEqual([]);
    expect(contractErrors('get', '/api/admin/bookings', list)).toEqual([]);
    expect(contractErrors('get', '/api/admin/bookings', denied)).toEqual([]);
  });
});`,
  th51: `import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';

describe('practice 5.1', () => {
  it('a 31-seat student booking is 201 PENDING, and GET via Location agrees', async () => {
    const { app, bearer } = makeApi();
    const auth = await bearer('an');
    const created = await request(app).post('/api/bookings').set('Authorization', auth).send(body({ seats: 31 }));
    expect(created.status).toBe(201);
    expect(created.body.status).toBe('PENDING');
    const read = await request(app).get(created.headers.location).set('Authorization', auth);
    expect(read.body).toEqual(created.body);
  });

  it('a second student booking the next slot gets id 2 and Location /api/bookings/2', async () => {
    const { app, bearer } = makeApi();
    await request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(body());
    const res = await request(app).post('/api/bookings').set('Authorization', await bearer('binh')).send(body({ start: '10:00', end: '12:00' }));
    expect(res.status).toBe(201);
    expect(res.headers.location).toBe('/api/bookings/2');
  });
});`,
  th52: `import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi } from '../test/support/api.js';

describe('practice 5.2', () => {
  it('a lecturer on the admin list → 403', async () => {
    const { app, bearer } = makeApi();
    const res = await request(app).get('/api/admin/bookings').set('Authorization', await bearer('thay', 'LECTURER'));
    expect(res.status).toBe(403);
  });

  it.each([
    ['09:59:59', 404],   // still valid: no booking 1, so 404
    ['10:00:00', 401],   // exp reached: refused
  ])('a token issued at 09:00 for 1 hour, used at %s → %i', async (time, expected) => {
    let clock = new Date('2030-01-01T09:00:00Z');
    const { app, bearer } = makeApi({ now: () => clock });
    const auth = await bearer('an');
    clock = new Date('2030-01-01T' + time + 'Z');
    expect((await request(app).get('/api/bookings/1').set('Authorization', auth)).status).toBe(expected);
  });
});`,
  th53: `import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';

const post = async (payload) => {
  const { app, bearer } = makeApi();
  return request(app).post('/api/bookings').set('Authorization', await bearer('an')).send(payload);
};

describe('practice 5.3', () => {
  it('201 seats → 400 on seats; 200 seats is accepted', async () => {
    expect((await post(body({ seats: 201 }))).body.error.details[0].path).toBe('seats');
    expect((await post(body({ seats: 200 }))).status).toBe(201);
  });

  it('a client cannot choose the status: unknown key → 400', async () => {
    const res = await post(body({ status: 'CONFIRMED', seats: 31 }));
    expect(res.status).toBe(400);
    expect(res.body.error.details).toContainEqual({ path: '', message: 'Unrecognized key: "status"' });
  });
});`,
  th54: `import { it, expect } from 'vitest';
import request from 'supertest';
import { makeApi } from '../test/support/api.js';
import { contractErrors } from '../test/support/contract.js';

it('BAD_JSON and a missing token also match the contract', async () => {
  const { app, bearer } = makeApi();
  const badJson = await request(app).post('/api/bookings').set('Authorization', await bearer('an'))
    .set('Content-Type', 'application/json').send('{');
  const noToken = await request(app).get('/api/bookings/1');
  expect(contractErrors('post', '/api/bookings', badJson)).toEqual([]);
  expect(contractErrors('get', '/api/bookings/{id}', noToken)).toEqual([]);
});`,
  serverTest: `import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../../test/support/api.js';

const as = async (api, id, role) => api.bearer(id, role);

describe('POST /api/bookings', () => {
  it('201 with Location and the public booking', async () => {
    const api = makeApi();
    const res = await request(api.app).post('/api/bookings').set('Authorization', await as(api, 'an')).send(body());
    expect(res.status).toBe(201);
    expect(res.headers.location).toBe('/api/bookings/1');
    expect(res.body).toEqual({ id: 1, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, status: 'CONFIRMED', minutes: 120 });
  });

  it('401 without a token', async () => {
    const api = makeApi();
    expect((await request(api.app).post('/api/bookings').send(body())).status).toBe(401);
  });

  it('400 VALIDATION for seats 0, and for a role in the body', async () => {
    const api = makeApi();
    const auth = await as(api, 'an');
    const zero = await request(api.app).post('/api/bookings').set('Authorization', auth).send(body({ seats: 0 }));
    const role = await request(api.app).post('/api/bookings').set('Authorization', auth).send(body({ role: 'ADMIN' }));
    expect([zero.status, role.status]).toEqual([400, 400]);
    expect(role.body.error.details).toContainEqual({ path: '', message: 'Unrecognized key: "role"' });
  });

  it('422 for a rule, 409 for a taken slot', async () => {
    const api = makeApi();
    const auth = await as(api, 'an');
    const rule = await request(api.app).post('/api/bookings').set('Authorization', auth).send(body({ start: '06:00' }));
    await request(api.app).post('/api/bookings').set('Authorization', auth).send(body());
    const taken = await request(api.app).post('/api/bookings').set('Authorization', auth).send(body());
    expect([rule.status, rule.body.error.code]).toEqual([422, 'OUTSIDE_HOURS']);
    expect([taken.status, taken.body.error.code]).toEqual([409, 'OVERLAP']);
  });
});

describe('who may read what', () => {
  it.each([
    ['the owner', 200, 'an', 'STUDENT'],
    ['another student', 404, 'binh', 'STUDENT'],
    ['a lecturer', 404, 'thay', 'LECTURER'],
    ['an admin', 200, 'boss', 'ADMIN'],
  ])('%s reading booking 1 → %i', async (_, expected, id, role) => {
    const api = makeApi();
    await request(api.app).post('/api/bookings').set('Authorization', await as(api, 'an')).send(body());
    expect((await request(api.app).get('/api/bookings/1').set('Authorization', await as(api, id, role))).status).toBe(expected);
  });

  it.each([['STUDENT', 403], ['LECTURER', 403], ['ADMIN', 200]])('%s on the admin list → %i', async (role, expected) => {
    const api = makeApi();
    expect((await request(api.app).get('/api/admin/bookings').set('Authorization', await as(api, 'x', role))).status).toBe(expected);
  });

  it('an expired token → 401 (clock fixed in 2030)', async () => {
    let clock = new Date('2030-01-01T09:00:00Z');
    const api = makeApi({ now: () => clock });
    const auth = await as(api, 'an');
    clock = new Date('2030-01-01T10:00:00Z');
    expect((await request(api.app).get('/api/admin/bookings').set('Authorization', auth)).status).toBe(401);
  });
});`,
  weak5: `import { it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../test/support/api.js';

it('creates a booking', async () => {
  const api = makeApi();
  const res = await request(api.app).post('/api/bookings').set('Authorization', await api.bearer('an')).send(body());
  expect(res.status).toBeLessThan(300);
});

it('the owner can read the booking', async () => {
  const api = makeApi();
  const auth = await api.bearer('an');
  await request(api.app).post('/api/bookings').set('Authorization', auth).send(body());
  expect((await request(api.app).get('/api/bookings/1').set('Authorization', auth)).status).toBe(200);
});

it('requests without a token fail', async () => {
  const api = makeApi();
  expect((await request(api.app).get('/api/bookings/1')).status).toBeGreaterThanOrEqual(400);
});

it('a wrong booking is refused', async () => {
  const api = makeApi();
  const res = await request(api.app).post('/api/bookings').set('Authorization', await api.bearer('an')).send(body({ seats: 0 }));
  expect(res.status).toBeGreaterThanOrEqual(400);
});`,
  dotBien5: `// Lab 5 mutants (Chapter 5: HTTP API). Plant one bug at a time, run your tests, then restore the code.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const MUTANTS = [
  ['src/api/server.js', "booking.userId === req.user.id || req.user.role === 'ADMIN'", "booking.userId === req.user.id || req.user.role !== 'STUDENT'", "lecturers can read anyone's booking"],
  ['src/api/server.js', "if (!mine) return fail(res, 404, 'NOT_FOUND');", "if (!booking) return fail(res, 404, 'NOT_FOUND');", "anyone can read anyone's booking (IDOR)"],
  ['src/api/server.js', "next() : fail(res, 403, 'FORBIDDEN')", "next() : fail(res, 401, 'FORBIDDEN')", 'forbidden answered as 401'],
  ['src/api/schemas.js', 'z.strictObject({', 'z.object({', 'unknown fields (role) silently accepted'],
  ['src/api/server.js', 'res.status(201).location(', 'res.status(200).location(', 'created answered as 200'],
  ['src/api/server.js', ".location('/api/bookings/' + booking.id)", '', 'no Location header'],
  ['src/api/server.js', "return fail(res, 409, 'OVERLAP');", "return fail(res, 400, 'OVERLAP');", 'taken slot answered as 400'],
  ['src/api/auth.js', "{ algorithms: ['HS256'], currentDate: now() }", "{ algorithms: ['HS256'] }", 'expiry checked against the real clock, not the given one'],
];

let killed = 0;
for (const [i, [file, from, to, label]] of MUTANTS.entries()) {
  const original = readFileSync(file, 'utf8');
  if (!original.includes(from)) throw new Error('Mutant ' + (i + 1) + ': not found in ' + file);
  writeFileSync(file, original.replace(from, to));
  try {
    const run = spawnSync('npx', ['vitest', 'run', 'src/'], { encoding: 'utf8', shell: process.platform === 'win32' });
    const dead = run.status !== 0;
    if (dead) killed++;
    console.log((dead ? '✔ killed  ' : '✘ SURVIVED') + '  #' + (i + 1) + ' ' + label);
  } finally {
    writeFileSync(file, original);
  }
}
console.log();
console.log(killed + '/' + MUTANTS.length + ' mutants killed');
process.exitCode = killed === MUTANTS.length ? 0 : 1;`,
};
export const OUT = {
  '51-bo-status': `$ node scripts/thu-loi.mjs src/api/server.js "status: b.status, " "" demo5/chi-status.test.js demo5/supertest.test.js
planted in src/api/server.js:  status: b.status,   →  


 RUN  v5.0.5 …/labflow-lite

 ✓ demo5/chi-status.test.js (1 test) 36ms
   ✓ creating a booking works (status only) 35ms
 ❯ demo5/supertest.test.js (4 tests | 1 failed) 78ms
   ❯ POST /api/bookings — through real HTTP, without starting the server (4)
     ✓ GET /api/health answers 200 JSON 15ms
     × 201 + Location, and the Location really serves the booking 26ms
     ✓ a business-rule violation is 422 with the rule code 4ms
     ✓ the same slot twice is 409 OVERLAP 32ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo5/supertest.test.js > POST /api/bookings — through real HTTP, without starting the server > 201 + Location, and the Location really serves the booking
AssertionError: expected { id: 1, lab: 'BE-201', …(5) } to deeply equal { id: 1, lab: 'BE-201', …(6) }

- Expected
+ Received

@@ -4,7 +4,6 @@
    "id": 1,
    "lab": "BE-201",
    "minutes": 120,
    "seats": 20,
    "start": "08:00",
-   "status": "CONFIRMED",
  }

 ❯ demo5/supertest.test.js:20:22
     18|     expect(res.status).toBe(201);
     19|     expect(res.headers.location).toBe('/api/bookings/1');
     20|     expect(res.body).toEqual({ id: 1, lab: 'BE-201', date: '2026-11-16…
       |                      ^
     21|     const again = await request(app).get(res.headers.location).set('Au…
     22|     expect(again.body).toEqual(res.body);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 4 passed (5)
   Start at  03:07:17
   Duration  284ms (import 59%, tests 31%, transform 9%, worker 1%)`,
  '51-main': `$ JWT_SECRET=dev-only PORT=3999 node src/api/main.js & sleep 1; curl -s -i http://localhost:3999/api/health; echo; kill %1
LabFlow Lite API on http://localhost:3999
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 15
ETag: W/"f-VaSQ4oDUiZblZNAEkkN+sX+q3Sg"
Date: Sat, 31 Oct 2026 20:07:16 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"status":"ok"}`,
  '51-supertest': `$ npx vitest run demo5/supertest.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo5/supertest.test.js (4 tests) 75ms
   ✓ POST /api/bookings — through real HTTP, without starting the server (4)
     ✓ GET /api/health answers 200 JSON 14ms
     ✓ 201 + Location, and the Location really serves the booking 34ms
     ✓ a business-rule violation is 422 with the rule code 4ms
     ✓ the same slot twice is 409 OVERLAP 22ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  03:07:15
   Duration  348ms (import 61%, tests 28%, transform 10%, worker 1%)`,
  '51-th': `$ npx vitest run demo5/th51.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo5/th51.test.js (2 tests) 75ms
   ✓ practice 5.1 (2)
     ✓ a 31-seat student booking is 201 PENDING, and GET via Location agrees 44ms
     ✓ a second student booking the next slot gets id 2 and Location /api/bookings/2 30ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  03:07:17
   Duration  269ms (import 51%, tests 39%, transform 8%, worker 1%)`,
  '52-auth': `$ npx vitest run demo5/auth.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo5/auth.test.js (8 tests) 94ms
   ✓ authentication: who are you? → 401 (5)
     ✓ no Authorization header → 401 15ms
     ✓ not a Bearer token → 401 4ms
     ✓ a random string → 401 2ms
     ✓ a token signed with another secret → 401 4ms
     ✓ a token issued at 09:00 for 1 hour is refused at 10:01 10ms
   ✓ authorisation: are you allowed? → 403 / 404 (3)
     ✓ a student on the admin list → 403; an admin → 200 11ms
     ✓ student B cannot read student A's booking — it looks missing (404) 44ms
     ✓ a student cannot make themselves ADMIN through the body 3ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  03:07:18
   Duration  292ms (import 48%, tests 44%, transform 7%, worker 1%)`,
  '52-th': `$ npx vitest run demo5/th52.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo5/th52.test.js (3 tests) 32ms
   ✓ practice 5.2 (3)
     ✓ a lecturer on the admin list → 403 18ms
     ✓ a token issued at 09:00 for 1 hour, used at 09:59:59 → 404 11ms
     ✓ a token issued at 09:00 for 1 hour, used at 10:00:00 → 401 3ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  03:07:19
   Duration  239ms (import 68%, tests 20%, transform 11%, worker 1%)`,
  '53-th': `$ npx vitest run demo5/th53.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo5/th53.test.js (2 tests) 45ms
   ✓ practice 5.3 (2)
     ✓ 201 seats → 400 on seats; 200 seats is accepted 40ms
     ✓ a client cannot choose the status: unknown key → 400 4ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  03:07:20
   Duration  230ms (import 61%, tests 29%, transform 9%, worker 1%)`,
  '53-validation': `$ npx vitest run demo5/validation.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo5/validation.test.js (10 tests) 48ms
   ✓ 400 VALIDATION: the request itself is malformed (7)
     ✓ lab missing → 400 on path "lab" 22ms
     ✓ seats as a string → 400 on path "seats" 4ms
     ✓ seats 2.5 → 400 on path "seats" 3ms
     ✓ date 2026-13-01 → 400 on path "date" 2ms
     ✓ start "7:00" → 400 on path "start" 3ms
     ✓ end "24:00" → 400 on path "end" 2ms
     ✓ broken JSON → 400 BAD_JSON 2ms
   ✓ 422: well-formed, but against a business rule (3)
     ✓ 08:15–09:00 → 422 OFF_GRID 2ms
     ✓ 10:00–08:00 → 422 END_BEFORE_START 4ms
     ✓ 08:00–12:30 → 422 TOO_LONG 2ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  03:07:19
   Duration  235ms (import 60%, tests 30%, transform 9%, worker 1%)`,
  '54-doi-ten': `$ node scripts/thu-loi.mjs src/api/server.js "start: b.start," "startTime: b.start," demo5/chi-status.test.js demo5/hop-dong.test.js
planted in src/api/server.js:  start: b.start,  →  startTime: b.start,


 RUN  v5.0.5 …/labflow-lite

 ✓ demo5/chi-status.test.js (1 test) 37ms
   ✓ creating a booking works (status only) 36ms
 ❯ demo5/hop-dong.test.js (2 tests | 2 failed) 101ms
   ❯ every real response matches openapi.json (2)
     × POST /api/bookings: 201, 400, 401, 409, 422 56ms
     × GET /api/bookings/{id} and GET /api/admin/bookings 43ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo5/hop-dong.test.js > every real response matches openapi.json > POST /api/bookings: 201, 400, 401, 409, 422
AssertionError: expected [ …(2) ] to deeply equal []

- Expected
+ Received

- []
+ [
+   "(body) must have required property 'start'",
+   "(body) must NOT have additional properties: startTime",
+ ]

 ❯ demo5/hop-dong.test.js:19:87
     17|     ];
     18|     expect(responses.map((r) => r.status)).toEqual([201, 400, 401, 409…
     19|     for (const res of responses) expect(contractErrors('post', '/api/b…
       |                                                                                       ^
     20|   });
     21|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  demo5/hop-dong.test.js > every real response matches openapi.json > GET /api/bookings/{id} and GET /api/admin/bookings
AssertionError: expected [ …(2) ] to deeply equal []

- Expected
+ Received

- []
+ [
+   "(body) must have required property 'start'",
+   "(body) must NOT have additional properties: startTime",
+ ]

 ❯ demo5/hop-dong.test.js:29:62
     27|     const list = await request(app).get('/api/admin/bookings').set('Au…
     28|     const denied = await request(app).get('/api/admin/bookings').set('…
     29|     expect(contractErrors('get', '/api/bookings/{id}', one)).toEqual([…
       |                                                              ^
     30|     expect(contractErrors('get', '/api/bookings/{id}', notMine)).toEqu…
     31|     expect(contractErrors('get', '/api/admin/bookings', list)).toEqual…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  2 failed | 1 passed (3)
   Start at  03:07:22
   Duration  367ms (import 58%, tests 30%, transform 11%, worker 1%)`,
  '54-hop-dong': `$ npx vitest run demo5/hop-dong.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo5/hop-dong.test.js (2 tests) 103ms
   ✓ every real response matches openapi.json (2)
     ✓ POST /api/bookings: 201, 400, 401, 409, 422 56ms
     ✓ GET /api/bookings/{id} and GET /api/admin/bookings 46ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  03:07:21
   Duration  362ms (import 56%, tests 36%, transform 7%, worker 1%)`,
  '54-lo': `$ node scripts/thu-loi.mjs src/api/server.js "res.json(toPublic(booking));" "res.json(booking);" demo5/hop-dong.test.js
planted in src/api/server.js:  res.json(toPublic(booking));  →  res.json(booking);


 RUN  v5.0.5 …/labflow-lite

 ❯ demo5/hop-dong.test.js (2 tests | 1 failed) 103ms
   ❯ every real response matches openapi.json (2)
     ✓ POST /api/bookings: 201, 400, 401, 409, 422 56ms
     × GET /api/bookings/{id} and GET /api/admin/bookings 47ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo5/hop-dong.test.js > every real response matches openapi.json > GET /api/bookings/{id} and GET /api/admin/bookings
AssertionError: expected [ …(2) ] to deeply equal []

- Expected
+ Received

- []
+ [
+   "(body) must NOT have additional properties: role",
+   "(body) must NOT have additional properties: userId",
+ ]

 ❯ demo5/hop-dong.test.js:29:62
     27|     const list = await request(app).get('/api/admin/bookings').set('Au…
     28|     const denied = await request(app).get('/api/admin/bookings').set('…
     29|     expect(contractErrors('get', '/api/bookings/{id}', one)).toEqual([…
       |                                                              ^
     30|     expect(contractErrors('get', '/api/bookings/{id}', notMine)).toEqu…
     31|     expect(contractErrors('get', '/api/admin/bookings', list)).toEqual…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  03:07:22
   Duration  347ms (import 54%, tests 39%, transform 6%, worker 1%)`,
  '54-th': `$ npx vitest run demo5/th54.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo5/th54.test.js (1 test) 26ms
   ✓ BAD_JSON and a missing token also match the contract 26ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  03:07:23
   Duration  267ms (import 76%, tests 14%, transform 9%, worker 1%)`,
  'lab5-mut-strong': `$ node scripts/dot-bien-5.mjs
✔ killed    #1 lecturers can read anyone's booking
✔ killed    #2 anyone can read anyone's booking (IDOR)
✔ killed    #3 forbidden answered as 401
✔ killed    #4 unknown fields (role) silently accepted
✔ killed    #5 created answered as 200
✔ killed    #6 no Location header
✔ killed    #7 taken slot answered as 400
✔ killed    #8 expiry checked against the real clock, not the given one

8/8 mutants killed`,
  'lab5-mut-weak': `$ node scripts/dot-bien-5.mjs
✘ SURVIVED  #1 lecturers can read anyone's booking
✘ SURVIVED  #2 anyone can read anyone's booking (IDOR)
✘ SURVIVED  #3 forbidden answered as 401
✘ SURVIVED  #4 unknown fields (role) silently accepted
✘ SURVIVED  #5 created answered as 200
✘ SURVIVED  #6 no Location header
✘ SURVIVED  #7 taken slot answered as 400
✘ SURVIVED  #8 expiry checked against the real clock, not the given one

0/8 mutants killed`,
  'lab5-ref': `$ npx vitest run src/api

 RUN  v5.0.5 …/labflow-lite

 ✓ src/api/server.test.js (12 tests) 174ms
   ✓ POST /api/bookings (4)
     ✓ 201 with Location and the public booking 36ms
     ✓ 401 without a token 4ms
     ✓ 400 VALIDATION for seats 0, and for a role in the body 6ms
     ✓ 422 for a rule, 409 for a taken slot 25ms
   ✓ who may read what (8)
     ✓ the owner reading booking 1 → 200 25ms
     ✓ another student reading booking 1 → 404 21ms
     ✓ a lecturer reading booking 1 → 404 22ms
     ✓ an admin reading booking 1 → 200 22ms
     ✓ STUDENT on the admin list → 403 2ms
     ✓ LECTURER on the admin list → 403 1ms
     ✓ ADMIN on the admin list → 200 8ms
     ✓ an expired token → 401 (clock fixed in 2030) 2ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  03:07:30
   Duration  367ms (tests 59%, import 35%, transform 5%, worker 1%)`,
  'lab5-unit-utc': `$ TZ=UTC npm run test:unit

> labflow-lite@1.0.0 test:unit
> vitest run src/


 RUN  v5.0.5 …/labflow-lite

 ✓ src/auth/login-guard.test.js (5 tests) 3ms
   ✓ createLoginGuard (BR-02: 5 failures → locked 15 minutes) (5)
     ✓ 4 failures do not lock 1ms
     ✓ the 5th failure locks 0ms
     ✓ still locked at 14:59.999, unlocked at exactly 15:00 0ms
     ✓ a successful login resets the counter 0ms
     ✓ locks only the account that failed 0ms
 ✓ src/rules/days.test.js (4 tests) 4ms
   ✓ daysAheadVN (BR-05 counted in Viet Nam time) (4)
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-16 is 14 days ahead 2ms
     ✓ now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead 0ms
     ✓ now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead 0ms
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead 0ms
 ✓ src/lib/retry.test.js (3 tests) 9ms
   ✓ retry (3)
     ✓ returns at once when the first attempt works 3ms
     ✓ waits 1 s then 2 s between attempts 4ms
     ✓ gives up after 3 attempts and rethrows the last error 1ms
 ✓ src/rules/booking.test.js (28 tests) 5ms
   ✓ checkSlot (11)
     ✓ accepts (4)
       ✓ 07:00–08:00 (60 min) 1ms
       ✓ 20:00–21:00 (60 min) 0ms
       ✓ 08:00–08:30 (30 min) 0ms
       ✓ 08:00–12:00 (240 min) 0ms
     ✓ rejects (7)
       ✓ 06:30–08:00 with OUTSIDE_HOURS 0ms
       ✓ 20:00–21:30 with OUTSIDE_HOURS 0ms
       ✓ 08:15–09:00 with OFF_GRID 0ms
       ✓ 08:00–09:10 with OFF_GRID 0ms
       ✓ 10:00–09:00 with END_BEFORE_START 0ms
       ✓ 09:00–09:00 with END_BEFORE_START 0ms
       ✓ 08:00–12:30 with TOO_LONG 0ms
   ✓ isWithinBookingWindow (BR-05) (8)
     ✓ -1 days → false 0ms
     ✓ 0 days → true 0ms
     ✓ 14 days → true 0ms
     ✓ 15 days → false 0ms
     ✓ rejects 1.5 0ms
     ✓ rejects NaN 0ms
     ✓ rejects 3 0ms
     ✓ rejects null 0ms
   ✓ needsApproval (BR-06 decision table) (7)
     ✓ STUDENT, 30 seats → false 0ms
     ✓ STUDENT, 31 seats → true 0ms
     ✓ LECTURER, 31 seats → false 0ms
     ✓ ADMIN, 31 seats → false 0ms
     ✓ throws RangeError for 0 seats 0ms
     ✓ throws RangeError for -5 seats 0ms
     ✓ throws RangeError for 2.5 seats 0ms
   ✓ createBooking (2)
     ✓ builds a PENDING booking for 31 seats 0ms
     ✓ throws the rule code for a bad slot 0ms
 ✓ src/rules/time.test.js (12 tests) 8ms
   ✓ parseTime (10)
     ✓ 00:00 → 0 1ms
     ✓ 07:00 → 420 0ms
     ✓ 21:30 → 1290 0ms
     ✓ 23:59 → 1439 0ms
     ✓ throws TypeError for "7:00" 0ms
     ✓ throws TypeError for "07-00" 0ms
     ✓ throws TypeError for "" 0ms
     ✓ throws TypeError for "abc" 0ms
     ✓ throws RangeError for 24:00 0ms
     ✓ throws RangeError for 07:60 0ms
   ✓ formatTime (2)
     ✓ pads to HH:MM 0ms
     ✓ round-trips with parseTime for every minute of the day 4ms
 ✓ src/booking/service.test.js (6 tests) 61ms
   ✓ bookLab (6)
     ✓ stores a confirmed booking 14ms
     ✓ rejects a rule violation with its code before touching the database 1ms
     ✓ rejects an overlapping booking with OVERLAP 20ms
     ✓ accepts the slot that starts when the previous one ends 26ms
     ✓ turns a failing lookup into STORAGE_DOWN and keeps the cause 0ms
     ✓ turns a failing insert into STORAGE_DOWN 0ms
 ✓ src/notify/notify.test.js (7 tests) 57ms
   ✓ buildMail (pure) (2)
     ✓ CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn 1ms
     ✓ PENDING booking with 31 seats → mail to approvals@labflow.example 0ms
   ✓ bookAndNotify (5)
     ✓ a confirmed booking e-mails the student once 15ms
     ✓ a 31-seat student booking e-mails only the approver 13ms
     ✓ a failed e-mail keeps the booking and reports notified: false 13ms
     ✓ a failed e-mail is logged with the booking id and the reason 13ms
     ✓ a rejected booking sends no e-mail 1ms
 ✓ src/rules/cancel.test.js (4 tests) 2ms
   ✓ canCancel (Lite-3: until 60 minutes before the start) (4)
     ✓ at 07:00, a 09:00 booking can be cancelled → true 1ms
     ✓ at 08:00, a 09:00 booking can be cancelled → true 0ms
     ✓ at 08:01, a 09:00 booking can be cancelled → false 0ms
     ✓ at 09:30, a 09:00 booking can be cancelled → false 0ms
 ✓ src/lib/mailer.test.js (4 tests) 46ms
   ✓ createHttpMailer (4)
     ✓ posts { to, subject } with a Bearer key and returns the id 29ms
     ✓ 429 → RATE_LIMITED 4ms
     ✓ 400 → MAIL_FAILED with the status as the cause 5ms
     ✓ 503 → MAIL_FAILED with the status as the cause 3ms
 ✓ src/api/server.test.js (12 tests) 170ms
   ✓ POST /api/bookings (4)
     ✓ 201 with Location and the public booking 34ms
     ✓ 401 without a token 4ms
     ✓ 400 VALIDATION for seats 0, and for a role in the body 5ms
     ✓ 422 for a rule, 409 for a taken slot 24ms
   ✓ who may read what (8)
     ✓ the owner reading booking 1 → 200 24ms
     ✓ another student reading booking 1 → 404 22ms
     ✓ a lecturer reading booking 1 → 404 22ms
     ✓ an admin reading booking 1 → 200 21ms
     ✓ STUDENT on the admin list → 403 2ms
     ✓ LECTURER on the admin list → 403 2ms
     ✓ ADMIN on the admin list → 200 7ms
     ✓ an expired token → 401 (clock fixed in 2030) 1ms

 Test Files  10 passed (10)
      Tests  85 passed (85)
   Start at  20:07:31
   Duration  401ms (tests 52%, import 35%, transform 9%, worker 4%)`,
  'lab5-unit': `$ npm run test:unit

> labflow-lite@1.0.0 test:unit
> vitest run src/


 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/days.test.js (4 tests) 4ms
   ✓ daysAheadVN (BR-05 counted in Viet Nam time) (4)
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-16 is 14 days ahead 2ms
     ✓ now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead 0ms
     ✓ now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead 0ms
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead 0ms
 ✓ src/rules/booking.test.js (28 tests) 5ms
   ✓ checkSlot (11)
     ✓ accepts (4)
       ✓ 07:00–08:00 (60 min) 1ms
       ✓ 20:00–21:00 (60 min) 0ms
       ✓ 08:00–08:30 (30 min) 0ms
       ✓ 08:00–12:00 (240 min) 0ms
     ✓ rejects (7)
       ✓ 06:30–08:00 with OUTSIDE_HOURS 0ms
       ✓ 20:00–21:30 with OUTSIDE_HOURS 0ms
       ✓ 08:15–09:00 with OFF_GRID 0ms
       ✓ 08:00–09:10 with OFF_GRID 0ms
       ✓ 10:00–09:00 with END_BEFORE_START 0ms
       ✓ 09:00–09:00 with END_BEFORE_START 0ms
       ✓ 08:00–12:30 with TOO_LONG 0ms
   ✓ isWithinBookingWindow (BR-05) (8)
     ✓ -1 days → false 0ms
     ✓ 0 days → true 0ms
     ✓ 14 days → true 0ms
     ✓ 15 days → false 0ms
     ✓ rejects 1.5 0ms
     ✓ rejects NaN 0ms
     ✓ rejects 3 0ms
     ✓ rejects null 0ms
   ✓ needsApproval (BR-06 decision table) (7)
     ✓ STUDENT, 30 seats → false 0ms
     ✓ STUDENT, 31 seats → true 0ms
     ✓ LECTURER, 31 seats → false 0ms
     ✓ ADMIN, 31 seats → false 0ms
     ✓ throws RangeError for 0 seats 0ms
     ✓ throws RangeError for -5 seats 0ms
     ✓ throws RangeError for 2.5 seats 0ms
   ✓ createBooking (2)
     ✓ builds a PENDING booking for 31 seats 0ms
     ✓ throws the rule code for a bad slot 0ms
 ✓ src/rules/time.test.js (12 tests) 8ms
   ✓ parseTime (10)
     ✓ 00:00 → 0 1ms
     ✓ 07:00 → 420 0ms
     ✓ 21:30 → 1290 0ms
     ✓ 23:59 → 1439 0ms
     ✓ throws TypeError for "7:00" 0ms
     ✓ throws TypeError for "07-00" 0ms
     ✓ throws TypeError for "" 0ms
     ✓ throws TypeError for "abc" 0ms
     ✓ throws RangeError for 24:00 1ms
     ✓ throws RangeError for 07:60 0ms
   ✓ formatTime (2)
     ✓ pads to HH:MM 0ms
     ✓ round-trips with parseTime for every minute of the day 4ms
 ✓ src/lib/retry.test.js (3 tests) 7ms
   ✓ retry (3)
     ✓ returns at once when the first attempt works 3ms
     ✓ waits 1 s then 2 s between attempts 2ms
     ✓ gives up after 3 attempts and rethrows the last error 1ms
 ✓ src/auth/login-guard.test.js (5 tests) 3ms
   ✓ createLoginGuard (BR-02: 5 failures → locked 15 minutes) (5)
     ✓ 4 failures do not lock 1ms
     ✓ the 5th failure locks 0ms
     ✓ still locked at 14:59.999, unlocked at exactly 15:00 0ms
     ✓ a successful login resets the counter 0ms
     ✓ locks only the account that failed 0ms
 ✓ src/notify/notify.test.js (7 tests) 54ms
   ✓ buildMail (pure) (2)
     ✓ CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn 1ms
     ✓ PENDING booking with 31 seats → mail to approvals@labflow.example 0ms
   ✓ bookAndNotify (5)
     ✓ a confirmed booking e-mails the student once 14ms
     ✓ a 31-seat student booking e-mails only the approver 12ms
     ✓ a failed e-mail keeps the booking and reports notified: false 12ms
     ✓ a failed e-mail is logged with the booking id and the reason 12ms
     ✓ a rejected booking sends no e-mail 1ms
 ✓ src/booking/service.test.js (6 tests) 62ms
   ✓ bookLab (6)
     ✓ stores a confirmed booking 14ms
     ✓ rejects a rule violation with its code before touching the database 1ms
     ✓ rejects an overlapping booking with OVERLAP 20ms
     ✓ accepts the slot that starts when the previous one ends 26ms
     ✓ turns a failing lookup into STORAGE_DOWN and keeps the cause 0ms
     ✓ turns a failing insert into STORAGE_DOWN 0ms
 ✓ src/rules/cancel.test.js (4 tests) 2ms
   ✓ canCancel (Lite-3: until 60 minutes before the start) (4)
     ✓ at 07:00, a 09:00 booking can be cancelled → true 1ms
     ✓ at 08:00, a 09:00 booking can be cancelled → true 0ms
     ✓ at 08:01, a 09:00 booking can be cancelled → false 0ms
     ✓ at 09:30, a 09:00 booking can be cancelled → false 0ms
 ✓ src/lib/mailer.test.js (4 tests) 46ms
   ✓ createHttpMailer (4)
     ✓ posts { to, subject } with a Bearer key and returns the id 29ms
     ✓ 429 → RATE_LIMITED 5ms
     ✓ 400 → MAIL_FAILED with the status as the cause 6ms
     ✓ 503 → MAIL_FAILED with the status as the cause 3ms
 ✓ src/api/server.test.js (12 tests) 180ms
   ✓ POST /api/bookings (4)
     ✓ 201 with Location and the public booking 38ms
     ✓ 401 without a token 4ms
     ✓ 400 VALIDATION for seats 0, and for a role in the body 7ms
     ✓ 422 for a rule, 409 for a taken slot 24ms
   ✓ who may read what (8)
     ✓ the owner reading booking 1 → 200 25ms
     ✓ another student reading booking 1 → 404 23ms
     ✓ a lecturer reading booking 1 → 404 23ms
     ✓ an admin reading booking 1 → 200 22ms
     ✓ STUDENT on the admin list → 403 3ms
     ✓ LECTURER on the admin list → 403 2ms
     ✓ ADMIN on the admin list → 200 8ms
     ✓ an expired token → 401 (clock fixed in 2030) 2ms

 Test Files  10 passed (10)
      Tests  85 passed (85)
   Start at  03:07:31
   Duration  410ms (tests 50%, import 34%, transform 12%, worker 4%)`,
  'lab5-weak-run': `$ npx vitest run src/weak5.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/weak5.test.js (4 tests) 68ms
   ✓ creates a booking 35ms
   ✓ the owner can read the booking 26ms
   ✓ requests without a token fail 3ms
   ✓ a wrong booking is refused 3ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  03:07:24
   Duration  258ms (import 54%, tests 36%, transform 9%, worker 1%)`,
};
