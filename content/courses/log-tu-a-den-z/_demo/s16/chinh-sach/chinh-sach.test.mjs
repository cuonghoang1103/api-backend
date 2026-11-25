// chinh-sach.test.mjs — chính sách log viết thành phép thử: chạy trong CI, PR nào phá chính sách thì đỏ.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Writable } from 'node:stream';
import { readFileSync, readdirSync } from 'node:fs';
import { taoLogger } from './logger.mjs';

const ghiVao = () => { const dong = []; const s = new Writable({ write(c, _e, cb) { dong.push(JSON.parse(c)); cb(); } }); return { s, dong }; };

test('mật khẩu, token, OTP, CCCD không bao giờ ra log', () => {
  const { s, dong } = ghiVao(); const log = taoLogger(s);
  log.info({ body: { email: 'a@example.com', password: 'GIA-1', otp: '123456' }, kh: { cccd: '001203016789' } }, 'đăng ký');
  log.info({ req: { headers: { authorization: 'Bearer GIA', cookie: 'sid=GIA' } } }, 'request');
  const chu = JSON.stringify(dong);
  for (const bimat of ['GIA-1', '123456', '001203016789', 'Bearer GIA', 'sid=GIA']) assert.ok(!chu.includes(bimat), `lọt: ${bimat}`);
});

test('mọi dòng có service, level, time, msg', () => {
  const { s, dong } = ghiVao(); taoLogger(s).warn('thử');
  for (const k of ['service', 'level', 'time', 'msg']) assert.ok(k in dong[0], `thiếu ${k}`);
});

test('production không chạy mức debug', () => {
  const { s } = ghiVao(); process.env.LOG_LEVEL = 'info';
  assert.equal(taoLogger(s).isLevelEnabled('debug'), false);
});

test('mã nguồn không console.log dữ liệu request', () => {
  const vi_pham = readdirSync('src').filter((f) => /console\.log\([^)]*req\.(body|headers)/.test(readFileSync(`src/${f}`, 'utf8')));
  assert.deepEqual(vi_pham, [], `vi phạm ở: ${vi_pham.join(', ')}`);
});
