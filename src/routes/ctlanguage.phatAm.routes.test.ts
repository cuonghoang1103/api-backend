/**
 * Tuyến luyện phát âm CT Language — `npx tsx --test src/routes/ctlanguage.phatAm.routes.test.ts`.
 *   · đủ tuyến, đường chấm có `/ai/` (app xin đồng ý chia sẻ AI — 5.1.2(i)); khách ⇒ 401 (KHÔNG 404);
 *   · index.ts gắn `/ctlanguage/phat-am` TRƯỚC `/ctlanguage`;
 *   · `WORK_DB_TEST=1` (cần CSDL local có ≥ 1 user): multipart thật đi hết đường — thiếu khoá Azure ⇒ 200 `chua_co_khoa`
 *     (không gọi Azure), tệp quá 600 KB ⇒ 400, không phải WAV ⇒ 400. Không bao giờ gọi Azure thật (xoá khoá trước khi chạy).
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { after, test } from 'node:test';
import express from 'express';

after(() => { setTimeout(() => process.exit(process.exitCode ?? 0), 200).unref(); });

function wav(giay: number): Buffer {
  const du = Math.round(16_000 * giay) * 2;
  const b = Buffer.alloc(44 + du);
  b.write('RIFF', 0); b.writeUInt32LE(36 + du, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(16_000, 24);
  b.writeUInt32LE(32_000, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(du, 40);
  return b;
}

async function dungApp() {
  const router = (await import('./ctlanguage.phatAm.routes.js')).default;
  const app = express();
  app.use(express.json());
  app.use('/api/v1/ctlanguage/phat-am', router);
  app.use((e: { statusCode?: number; message?: string; code?: string }, _q: express.Request, s: express.Response, _n: express.NextFunction) => {
    s.status(e.statusCode ?? 500).json({ success: false, message: e.message, code: e.code });
  });
  const sv = app.listen(0);
  return { sv, goc: `http://127.0.0.1:${(sv.address() as { port: number }).port}/api/v1/ctlanguage/phat-am` };
}

test('đủ tuyến, đường chấm có /ai/', async () => {
  const router = (await import('./ctlanguage.phatAm.routes.js')).default as unknown as {
    stack: { route?: { path: string; methods: Record<string, boolean> } }[];
  };
  const ds = router.stack.filter((l) => l.route).map((l) => `${Object.keys(l.route!.methods)[0].toUpperCase()} ${l.route!.path}`);
  assert.deepEqual(ds.sort(), ['GET /luot', 'POST /ai/cham'].sort());
});

test('khách không token ⇒ 401 ở mọi tuyến', async () => {
  const { sv, goc } = await dungApp();
  try {
    assert.equal((await fetch(`${goc}/luot`)).status, 401);
    assert.equal((await fetch(`${goc}/ai/cham`, { method: 'POST', body: new FormData() })).status, 401);
  } finally { sv.close(); }
});

test('index.ts gắn /ctlanguage/phat-am trước /ctlanguage', () => {
  const s = readFileSync(new URL('../index.ts', import.meta.url), 'utf8');
  const a = s.indexOf("app.use('/api/v1/ctlanguage/phat-am'");
  const b = s.indexOf("app.use('/api/v1/ctlanguage', ");
  assert.ok(a > 0 && b > a, `phat-am ${a} / ctlanguage ${b}`);
});

test('multipart thật (CSDL local): thiếu khoá ⇒ chua_co_khoa; quá cỡ / không phải WAV ⇒ 400', { skip: process.env.WORK_DB_TEST !== '1' }, async () => {
  delete process.env.AZURE_SPEECH_KEY;
  const { prisma } = await import('../config/database.js');
  const jwt = (await import('jsonwebtoken')).default;
  const { config } = await import('../config/env.js');
  const u = await prisma.user.findFirst({ where: { enabled: true, accountNonLocked: true, kind: { not: 'AGENT' } }, select: { id: true, email: true } });
  assert.ok(u, 'CSDL local không có user nào');
  const tok = jwt.sign({ userId: u!.id, email: u!.email }, config.jwtSecret, { expiresIn: '5m' });
  const { sv, goc } = await dungApp();
  const gui = (audio: Buffer) => {
    const f = new FormData();
    f.set('cau', 'I think so.'); f.set('nn', 'en');
    f.set('audio', new Blob([new Uint8Array(audio)], { type: 'audio/wav' }), 'a.wav');
    return fetch(`${goc}/ai/cham`, { method: 'POST', headers: { Authorization: `Bearer ${tok}` }, body: f });
  };
  try {
    const luot = await (await fetch(`${goc}/luot`, { headers: { Authorization: `Bearer ${tok}` } })).json() as { data: { batChua: boolean; tran: number } };
    assert.equal(luot.data.batChua, false);
    const r = await gui(wav(2));
    assert.equal(r.status, 200);
    const j = await r.json() as { data: { ketQua: unknown; lyDo: string; thongBao: string } };
    assert.equal(j.data.ketQua, null);
    assert.equal(j.data.lyDo, 'chua_co_khoa');
    assert.match(j.data.thongBao, /chưa bật chấm phát âm/);
    const qua = await gui(wav(20));
    assert.equal(qua.status, 400);
    assert.equal(((await qua.json()) as { code: string }).code, 'CTL_PHAT_AM_AUDIO');
    assert.equal((await gui(Buffer.from('x'.repeat(2000)))).status, 400);
  } finally { sv.close(); await prisma.$disconnect(); }
});
