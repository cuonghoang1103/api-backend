/**
 * Nhận chữ viết tay theo nét — chạy THẬT trên dữ liệu hanzi-writer: vẽ lại một chữ từ chính đường tim của nó (có méo,
 * lệch, viết nhỏ) thì chữ đó phải nằm trong 3 ứng viên đầu. Đây là phép đo "nét đúng thứ tự thì nhận ra".
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { chuanHoa, khoangCach, layMau, nhanChu, type Net } from './vietTay.js';

const req = createRequire(import.meta.url);
const dir = path.dirname(req.resolve('hanzi-writer-data/package.json'));
const medians = (c: string): Net[] => (JSON.parse(readFileSync(path.join(dir, `${c}.json`), 'utf8')).medians as number[][][])
  .map((m) => m.map(([x, y]) => [x, 900 - y] as [number, number]));

/** "Viết tay" giả: co về 30%, dời góc, rung ±3% mỗi điểm (hạt cố định để test ổn định). */
function vietGia(net: Net[], hat = 7): Net[] {
  let s = hat;
  const ngau = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 - 0.5; };
  return net.map((n) => n.map(([x, y]) => [x * 0.3 + 40 + ngau() * 9, y * 0.3 + 70 + ngau() * 9] as [number, number]));
}

test('lấy mẫu + chuẩn hoá: N điểm, nằm trong [0,1], giữ tỉ lệ', () => {
  const m = layMau([[0, 0], [10, 0]]);
  assert.equal(m.length, 10);
  assert.deepEqual(m[9], [10, 0]);
  const c = chuanHoa([[[100, 100], [300, 100]], [[200, 50], [200, 150]]]);
  for (const p of c.flat()) assert.ok(p[0] >= 0 && p[0] <= 1 && p[1] >= 0 && p[1] <= 1);
  assert.equal(khoangCach(c.map((n) => layMau(n)), c.map((n) => layMau(n))), 0);
});

test('nhận chữ Trung từ nét vẽ méo: chữ đúng trong top 3', async () => {
  for (const c of ['人', '学', '中', '我', '水', '国', '大']) {
    const ra = await nhanChu('zh', vietGia(medians(c)));
    assert.ok(ra.slice(0, 3).includes(c), `${c} → ${ra.slice(0, 5).join('')}`);
  }
});

test('đủ nét, đúng thứ tự (không méo) ⇒ chữ đúng đứng hạng 1', async () => {
  // Đo 12/11: viết THIẾU nét thì tụt hạng mạnh (学 thiếu nét cuối ⇒ hạng 22) — chấp nhận được vì app hiện ứng viên lại
  // sau MỖI nét, người viết sẽ viết tiếp cho đủ. Chốt ở đây phần quan trọng: đủ nét là phải ra đúng ngay.
  for (const c of ['学', '我', '国', '水', '人', '爱', '书']) {
    const ra = await nhanChu('zh', medians(c));
    assert.equal(ra[0], c, `${c} → ${ra.slice(0, 5).join('')}`);
  }
});
