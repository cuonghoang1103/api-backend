/**
 * Thứ tự tuyến cộng đồng CT Language — `npx tsx --test src/routes/ctlanguage.congDong.routes.test.ts` (không cần CSDL).
 *
 * Lỗi 13/11/2026: `GET /cong-dong/chan` khai SAU `GET /cong-dong/:nn` ⇒ Express đưa "chan" vào `:nn` ⇒ 400 CTL_NN_SAI,
 * màn "Người đã chặn" luôn trống. Phép kiểm này giữ luật: mọi tuyến `/cong-dong/<chữ cố định>…` cùng phương thức phải
 * đứng TRƯỚC tuyến `/cong-dong/:nn` (và `/cong-dong/:nn/<x>` không bị một tuyến động khác che).
 */
import 'dotenv/config';
import { strict as assert } from 'node:assert';
import { test } from 'node:test';

test('mọi tuyến /cong-dong/<chữ> khai trước /cong-dong/:nn (cùng phương thức)', async () => {
  const router = (await import('./ctlanguage.routes.js')).default as unknown as {
    stack: { route?: { path: string; methods: Record<string, boolean> } }[];
  };
  const ds = router.stack.filter((l) => l.route?.path.startsWith('/cong-dong')).map((l, i) => ({
    i, path: l.route!.path, method: Object.keys(l.route!.methods)[0],
  }));
  for (const method of ['get', 'post', 'delete', 'patch']) {
    const dong = ds.find((x) => x.method === method && x.path === '/cong-dong/:nn');
    if (!dong) continue;
    const sau = ds.filter((x) => x.method === method && x.i > dong.i && /^\/cong-dong\/[a-z-]+$/.test(x.path));
    assert.deepEqual(sau.map((x) => x.path), [], `${method.toUpperCase()} khai sau /cong-dong/:nn sẽ bị nuốt`);
  }
  const co = (m: string, p: string) => ds.some((x) => x.method === m && x.path === p);
  for (const [m, p] of [
    ['get', '/cong-dong/chan'], ['get', '/cong-dong/thong-bao'], ['get', '/cong-dong/nguoi/:id'], ['get', '/cong-dong/:nn/xep-hang'],
    ['post', '/cong-dong/bai/:id/thich'], ['post', '/cong-dong/bai/:id/ai/tra-loi'], ['patch', '/cong-dong/bai/:id'],
    ['post', '/cong-dong/admin/bai/:id/btv'], ['post', '/cong-dong/theo-doi/:userId'],
  ]) assert.ok(co(m, p), `thiếu ${m.toUpperCase()} ${p}`);
});
