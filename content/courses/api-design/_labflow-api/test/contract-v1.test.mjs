// test/contract-v1.test.mjs — hợp đồng v1 viết thành test: thay đổi nào làm client v1 vỡ thì test ĐỎ
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { app } from '../src/app.js';

const V1_DEVICE = JSON.parse(readFileSync(new URL('./contract/v1-device.json', import.meta.url)));
let server, base;
before(() => new Promise((ok) => {
  server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); });
}));
after(() => server.close());

const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);
// v1 ĐÃ ĐÓNG BĂNG: đúng tập trường, đúng kiểu — thiếu, thừa hay đổi kiểu đều đỏ
function assertShape(obj, contract) {
  assert.deepEqual(Object.keys(obj).sort(), Object.keys(contract).sort(), 'tập trường của v1 đã đổi');
  for (const [k, types] of Object.entries(contract))
    assert.ok(types.split('|').includes(typeOf(obj[k])), `${k}: ${typeOf(obj[k])} không thuộc ${types}`);
}
const MANAGER = { Authorization: 'Bearer tok_lan', 'Content-Type': 'application/json' };

test('GET /v1/devices/:id giữ hình dạng v1', async () => {
  const res = await fetch(`${base}/v1/devices/dev_3`);
  assert.equal(res.status, 200);
  assertShape(await res.json(), V1_DEVICE);
});

test('mọi phần tử của GET /v1/devices giữ hình dạng v1', async () => {
  const { data } = await (await fetch(`${base}/v1/devices`)).json();
  assert.ok(data.length >= 3);
  for (const d of data) assertShape(d, V1_DEVICE);
});

test('POST /v1/devices vẫn nhận serialNo', async () => {
  const res = await fetch(`${base}/v1/devices`, { method: 'POST', headers: MANAGER,
    body: JSON.stringify({ labId: 'lab_1', name: 'Cisco Switch 2960 #2', type: 'SWITCH', serialNo: 'FOC1932X0K8', status: 'AVAILABLE' }) });
  assert.equal(res.status, 201);
  assert.match(res.headers.get('location'), /^\/v1\/devices\/dev_\d+$/);
  assertShape(await res.json(), V1_DEVICE);
});

test('v1 báo khai tử đúng chuẩn (RFC 9745 + RFC 8594)', async () => {
  const res = await fetch(`${base}/v1/devices/dev_1`);
  const dep = res.headers.get('deprecation'), sunset = res.headers.get('sunset');
  assert.match(dep, /^@\d+$/);
  assert.ok(Date.parse(sunset) >= Number(dep.slice(1)) * 1000, 'Sunset không được sớm hơn Deprecation');
  assert.match(res.headers.get('link'), /<\/v2\/devices\/dev_1>; rel="successor-version"/);
});

test('v2 dùng serialNumber và cùng dữ liệu với v1', async () => {
  const v1 = await (await fetch(`${base}/v1/devices/dev_1`)).json();
  const v2 = await (await fetch(`${base}/v2/devices/dev_1`)).json();
  assert.equal(v2.serialNumber, v1.serialNo);
  assert.equal('serialNo' in v2, false);
});
