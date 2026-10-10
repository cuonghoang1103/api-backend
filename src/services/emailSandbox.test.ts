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
