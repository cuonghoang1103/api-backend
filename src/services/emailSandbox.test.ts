import assert from 'node:assert/strict';
import { test } from 'node:test';
import { emailSandboxReason } from './email.service.js';

test('hộp thư giả: tên miền dành riêng không bao giờ gửi thật, kể cả production', () => {
  const prod = { NODE_ENV: 'production' } as NodeJS.ProcessEnv;
  for (const to of ['a@e2e.local', 'x@foo.test', 'y@bar.invalid', 'z@example.com', 'q@sub.example.org']) {
    assert.equal(emailSandboxReason(to, prod), 'reserved-domain', to);
  }
  assert.equal(emailSandboxReason('giangvien@fpt.edu.vn', prod), null);
});

test('hộp thư giả: ngoài production mặc định không gửi; EMAIL_SANDBOX=0 mới gửi', () => {
  assert.equal(emailSandboxReason('a@gmail.com', { NODE_ENV: 'development' } as NodeJS.ProcessEnv), 'non-production');
  assert.equal(emailSandboxReason('a@gmail.com', {} as NodeJS.ProcessEnv), 'non-production');
  assert.equal(emailSandboxReason('a@gmail.com', { NODE_ENV: 'development', EMAIL_SANDBOX: '0' } as NodeJS.ProcessEnv), null);
});

test('hộp thư giả: thư dựng trên khung chung được ghi ra $TMPDIR/ctw-email-sandbox (không gửi)', async () => {
  const fs = await import('node:fs');
  const os = await import('node:os');
  const path = await import('node:path');
  const { emailService } = await import('./email.service.js');
  const res = await emailService.sendOtpEmail({ to: 'a@e2e.local', fullName: 'Thử', otp: '246810', type: 'verify' }) as { success: boolean; id?: string };
  assert.equal(res.success, true);
  assert.match(String(res.id), /^sandbox-/);
  const file = path.join(os.tmpdir(), 'ctw-email-sandbox', `${res.id}.html`);
  const html = fs.readFileSync(file, 'utf8');
  assert.ok(html.includes('subject: Mã xác thực CuongThai.com: 246810'));
  assert.ok(html.includes('https://cuongthai.com/favicon.png') && html.includes('>246810<'));
  fs.unlinkSync(file);
});
