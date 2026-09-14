import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { X509Certificate, createPrivateKey, sign as kySo } from 'node:crypto';
import { xacMinhJWS, LoiChuKyApple, gocApple, VAN_TAY_GOC_APPLE } from './chuKyApple.js';

// ════════════════════════════════════════════════════════════════
// Dựng một bộ chứng thư GIẢ hoàn chỉnh (gốc → trung gian → lá) rồi ký JWS
// bằng nó. Đây là đúng thứ kẻ tấn công làm được: chứng thư tự ký hợp lệ về
// mặt mật mã, chỉ khác mỗi chỗ nó không phải của Apple.
//
// Không có bộ này thì không chứng minh được cửa chặn có đóng hay không —
// mà đó chính là toàn bộ giá trị của file `chuKyApple.ts`.
// ════════════════════════════════════════════════════════════════

const D = mkdtempSync(join(tmpdir(), 'apple-jws-'));
const ossl = (...a: string[]) => execFileSync('openssl', a, { cwd: D, stdio: 'pipe' });

function khoaMoi(ten: string) {
  ossl('ecparam', '-name', 'prime256v1', '-genkey', '-noout', '-out', `${ten}.key`);
}

/** Dựng gốc → trung gian → lá. `ngay` âm = đã hết hạn. */
function dungChuoi(tienTo: string, ngay = 365) {
  writeFileSync(join(D, 'ca.ext'), 'basicConstraints=critical,CA:TRUE\n');
  khoaMoi(`${tienTo}root`);
  ossl('req', '-x509', '-new', '-key', `${tienTo}root.key`, '-sha256',
       '-days', String(Math.abs(ngay)), '-subj', `/CN=${tienTo} Root`, '-out', `${tienTo}root.pem`);

  khoaMoi(`${tienTo}inter`);
  ossl('req', '-new', '-key', `${tienTo}inter.key`, '-subj', `/CN=${tienTo} Inter`, '-out', `${tienTo}inter.csr`);
  ossl('x509', '-req', '-in', `${tienTo}inter.csr`, '-CA', `${tienTo}root.pem`, '-CAkey', `${tienTo}root.key`,
       '-CAcreateserial', '-days', String(Math.abs(ngay)), '-sha256', '-extfile', 'ca.ext', '-out', `${tienTo}inter.pem`);

  khoaMoi(`${tienTo}leaf`);
  ossl('req', '-new', '-key', `${tienTo}leaf.key`, '-subj', `/CN=${tienTo} Leaf`, '-out', `${tienTo}leaf.csr`);
  ossl('x509', '-req', '-in', `${tienTo}leaf.csr`, '-CA', `${tienTo}inter.pem`, '-CAkey', `${tienTo}inter.key`,
       '-CAcreateserial', '-days', String(Math.abs(ngay)), '-sha256', '-out', `${tienTo}leaf.pem`);

  const doc = (f: string) => new X509Certificate(readFileSync(join(D, f)));
  return {
    la: doc(`${tienTo}leaf.pem`),
    trungGian: doc(`${tienTo}inter.pem`),
    goc: doc(`${tienTo}root.pem`),
    khoaLa: createPrivateKey(readFileSync(join(D, `${tienTo}leaf.key`))),
  };
}

const der = (c: X509Certificate) => c.raw.toString('base64');
const b64u = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');

function taoJWS(bo: ReturnType<typeof dungChuoi>, payload: unknown, deChong?: { alg?: string; x5c?: string[] }) {
  const header = {
    alg: deChong?.alg ?? 'ES256',
    x5c: deChong?.x5c ?? [der(bo.la), der(bo.trungGian), der(bo.goc)],
  };
  const h = b64u(header), p = b64u(payload);
  // JWS cần chữ ký THÔ r||s, không phải DER.
  const s = kySo('sha256', Buffer.from(`${h}.${p}`), { key: bo.khoaLa, dsaEncoding: 'ieee-p1363' });
  return `${h}.${p}.${s.toString('base64url')}`;
}

const THAT = dungChuoi('that');
const KHAC = dungChuoi('khac');
const HANG = { transactionId: '2000000012345678', productId: 'PRO_12M' };

test('chuỗi hợp lệ + đúng gốc tin cậy ⇒ đọc được payload', () => {
  const ra = xacMinhJWS<typeof HANG>(taoJWS(THAT, HANG), { goc: THAT.goc });
  assert.deepEqual(ra, HANG);
});

test('⛔ CHUỖI TỰ KÝ bị TỪ CHỐI khi đối chiếu gốc Apple thật', () => {
  // Đây là phép kiểm đáng giá nhất cả file: chuỗi này hợp lệ hoàn hảo về mật
  // mã — chỉ mỗi tội không phải của Apple. Lọt được nó là ai cũng tự cấp Pro.
  assert.throws(
    () => xacMinhJWS(taoJWS(THAT, HANG)),          // không truyền goc ⇒ dùng Apple
    (e: Error) => e instanceof LoiChuKyApple && /không dẫn về gốc đã ghim/.test(e.message),
  );
});

test('⛔ đổi payload sau khi ký ⇒ chữ ký không khớp', () => {
  const jws = taoJWS(THAT, HANG);
  const [h, , s] = jws.split('.');
  const gia = `${h}.${b64u({ ...HANG, productId: 'PRO_12M', transactionId: '999' })}.${s}`;
  assert.throws(() => xacMinhJWS(gia, { goc: THAT.goc }),
    (e: Error) => /chữ ký không khớp/.test(e.message));
});

test('⛔ tráo chứng thư lá sang chuỗi khác ⇒ chuỗi đứt', () => {
  // Lá của bộ KHÁC, phần còn lại của bộ THẬT: gốc vẫn đúng, nhưng lá không
  // do trung gian ký.
  const jws = taoJWS(THAT, HANG, { x5c: [der(KHAC.la), der(THAT.trungGian), der(THAT.goc)] });
  assert.throws(() => xacMinhJWS(jws, { goc: THAT.goc }),
    (e: Error) => /không do chứng thư thứ 1 ký/.test(e.message));
});

test('⛔ alg none và HS256 đều bị chặn', () => {
  for (const alg of ['none', 'HS256', 'RS256']) {
    assert.throws(() => xacMinhJWS(taoJWS(THAT, HANG, { alg }), { goc: THAT.goc }),
      (e: Error) => /alg phải là ES256/.test(e.message), `alg=${alg} phải bị chặn`);
  }
});

test('⛔ chứng thư ngoài thời hạn bị từ chối', () => {
  const mai = new Date(Date.now() + 400 * 864e5);   // sau khi bộ test hết hạn
  assert.throws(() => xacMinhJWS(taoJWS(THAT, HANG), { goc: THAT.goc, bayGio: mai }),
    (e: Error) => /ngoài thời hạn hiệu lực/.test(e.message));
});

test('⛔ x5c thiếu / JWS méo ⇒ ném lỗi, không trả bừa', () => {
  assert.throws(() => xacMinhJWS('a.b', { goc: THAT.goc }), /ba khúc/);
  assert.throws(() => xacMinhJWS(taoJWS(THAT, HANG, { x5c: [der(THAT.la)] }), { goc: THAT.goc }),
    (e: Error) => /x5c/.test(e.message));
});

test('chứng thư gốc Apple kèm trong kho đúng vân tay đã ghim', () => {
  // Bắt được cả trường hợp file .cer bị thay mà mã không đổi.
  assert.equal(gocApple().fingerprint256, VAN_TAY_GOC_APPLE);
  assert.match(gocApple().subject, /Apple Root CA - G3/);
});
