import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { X509Certificate, createPrivateKey, sign as kySo } from 'node:crypto';
import { ghiNhanGiaoDich } from './capPro.js';
import { BadRequestError } from '../../middleware/errorHandler.js';

// ════════════════════════════════════════════════════════════════
// Kiểm CỬA VÀO của endpoint `POST /api/v1/pro/apple/transactions`.
//
// Mọi ca ở đây phải bị chặn TRƯỚC khi chạm cơ sở dữ liệu — nên phép kiểm
// chạy được mà không cần Postgres, và đó cũng chính là điều cần chứng minh:
// JWS giả không bao giờ đi tới chỗ ghi bảng hay cấp Pro.
// ════════════════════════════════════════════════════════════════

const D = mkdtempSync(join(tmpdir(), 'iap-e2e-'));
const ossl = (...a: string[]) => execFileSync('openssl', a, { cwd: D, stdio: 'pipe' });

function chuoiGia() {
  writeFileSync(join(D, 'ca.ext'), 'basicConstraints=critical,CA:TRUE\n');
  for (const t of ['root', 'inter', 'leaf']) {
    ossl('ecparam', '-name', 'prime256v1', '-genkey', '-noout', '-out', `${t}.key`);
  }
  ossl('req', '-x509', '-new', '-key', 'root.key', '-sha256', '-days', '365', '-subj', '/CN=Gia Root', '-out', 'root.pem');
  ossl('req', '-new', '-key', 'inter.key', '-subj', '/CN=Gia Inter', '-out', 'inter.csr');
  ossl('x509', '-req', '-in', 'inter.csr', '-CA', 'root.pem', '-CAkey', 'root.key', '-CAcreateserial',
       '-days', '365', '-sha256', '-extfile', 'ca.ext', '-out', 'inter.pem');
  ossl('req', '-new', '-key', 'leaf.key', '-subj', '/CN=Gia Leaf', '-out', 'leaf.csr');
  ossl('x509', '-req', '-in', 'leaf.csr', '-CA', 'inter.pem', '-CAkey', 'inter.key', '-CAcreateserial',
       '-days', '365', '-sha256', '-out', 'leaf.pem');
  const doc = (f: string) => new X509Certificate(readFileSync(join(D, f)));
  return { la: doc('leaf.pem'), trungGian: doc('inter.pem'), goc: doc('root.pem'),
           khoa: createPrivateKey(readFileSync(join(D, 'leaf.key'))) };
}

const BO = chuoiGia();
const b64u = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');

/// Một JWS trông hoàn hảo: đúng bundleId, đúng sản phẩm, chuỗi chứng thư nối
/// liền. Chỉ khác mỗi chỗ gốc không phải Apple — tức đúng thứ kẻ tấn công
/// làm được mà không cần khoá riêng của Apple.
function jwsGia(payload: Record<string, unknown>) {
  const h = b64u({ alg: 'ES256', x5c: [BO.la, BO.trungGian, BO.goc].map((c) => c.raw.toString('base64')) });
  const p = b64u(payload);
  const s = kySo('sha256', Buffer.from(`${h}.${p}`), { key: BO.khoa, dsaEncoding: 'ieee-p1363' });
  return `${h}.${p}.${s.toString('base64url')}`;
}

const HANG = {
  transactionId: '2000000900000042',
  originalTransactionId: '2000000900000042',
  bundleId: 'com.cuongthai.app',
  productId: 'com.cuongthai.app.pro.12m',
  purchaseDate: Date.now(),
  environment: 'Production',
};

test('⛔ JWS tự ký — dù nội dung hoàn hảo — KHÔNG cấp Pro', async () => {
  await assert.rejects(
    () => ghiNhanGiaoDich(999_999, jwsGia(HANG)),
    (e: Error) => e instanceof BadRequestError && /không dẫn về gốc đã ghim/.test(e.message),
  );
});

test('⛔ JWS méo ⇒ BadRequestError, không phải lỗi 500', async () => {
  // Quan trọng: lỗi phải là 400 có câu giải thích, không được rơi ra thành
  // exception chưa bắt rồi thành 500 — người dùng sẽ đọc thành "app hỏng".
  for (const rac of ['', 'khong-phai-jws', 'a.b', 'a.b.c']) {
    await assert.rejects(() => ghiNhanGiaoDich(999_999, rac),
      (e: Error) => e instanceof BadRequestError, `"${rac}" phải ra BadRequestError`);
  }
});

test('⛔ header alg bị đổi sang none cũng bị chặn ở cửa', async () => {
  const h = b64u({ alg: 'none', x5c: [BO.la.raw.toString('base64')] });
  const p = b64u(HANG);
  await assert.rejects(() => ghiNhanGiaoDich(999_999, `${h}.${p}.`),
    (e: Error) => e instanceof BadRequestError && /ES256/.test(e.message));
});
