/**
 * CTW-28 A8 — webhook ra ngoài: hàm thuần (kiểm URL chống SSRF, chữ ký HMAC). Phần gửi/thử lại/tự tắt: work.agents.db.test.ts.
 *   npx tsx --test src/services/work/webhooks.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseWebhookUrl, signWebhook, verifyWebhook } from './webhooks.service.js';

describe('webhook — URL (chống SSRF, phần cú pháp)', () => {
  it('chỉ https cổng 443, không thông tin đăng nhập, không IP/host nội bộ', () => {
    for (const bad of [
      'http://hooks.example.com/x', 'ftp://hooks.example.com', 'https://hooks.example.com:8443/x', 'https://u:p@hooks.example.com/x',
      'https://127.0.0.1/x', 'https://10.0.0.5/x', 'https://192.168.1.2/', 'https://169.254.169.254/latest/meta-data', 'https://[::1]/x',
      'https://localhost/x', 'https://metadata.google.internal/', 'not a url',
    ]) {
      assert.throws(() => parseWebhookUrl(bad), (e: { code?: string }) => e.code === 'WORK_WEBHOOK_URL', bad);
    }
    assert.equal(parseWebhookUrl('https://webhook.site/abc#frag').toString(), 'https://webhook.site/abc');
    assert.equal(parseWebhookUrl('https://hooks.example.com:443/x').host, 'hooks.example.com');
  });
});

describe('webhook — chữ ký HMAC-SHA256(secret, timestamp.body)', () => {
  const secret = 'whsec_test';
  const body = JSON.stringify({ id: 1, type: 'issue.assigned' });
  it('khớp; đổi body/secret/timestamp ⇒ không khớp; lệch > 5 phút ⇒ từ chối (chống phát lại)', () => {
    const ts = '1700000000';
    const sig = signWebhook(secret, ts, body);
    assert.match(sig, /^sha256=[0-9a-f]{64}$/);
    assert.equal(verifyWebhook(secret, { signature: sig, timestamp: ts }, body, 1700000000), true);
    assert.equal(verifyWebhook(secret, { signature: sig, timestamp: ts }, `${body} `, 1700000000), false);
    assert.equal(verifyWebhook('whsec_other', { signature: sig, timestamp: ts }, body, 1700000000), false);
    assert.equal(verifyWebhook(secret, { signature: sig, timestamp: '1700000001' }, body, 1700000000), false);
    assert.equal(verifyWebhook(secret, { signature: sig, timestamp: ts }, body, 1700000000 + 301), false);
  });
});
