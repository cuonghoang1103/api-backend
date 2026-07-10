/**
 * VNPay signature verification tests (P1-13). Run with node:test via tsx.
 *
 * This is the money-security crown jewel: `verifyReturnUrl` /
 * `verifyIpnCall` are what stop an attacker forging a "payment succeeded"
 * callback. We build a payment URL with a known test secret, then assert
 * that the same params verify as authentic and that tampering with the
 * amount breaks the signature.
 *
 * getClient() reads the VNPAY_* vars from process.env at call time, so we
 * set a self-contained test config here BEFORE importing the service. No
 * DB, no network — pure crypto.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.VNPAY_TMN_CODE = 'TESTTMN01';
process.env.VNPAY_HASH_SECRET = 'UNITTESTSECRET0123456789ABCDEF';
process.env.VNPAY_RETURN_URL = 'http://localhost:3000/payment/return';
process.env.VNPAY_IPN_URL = 'http://localhost:3000/api/v1/payments/vnpay-ipn';
process.env.VNPAY_SANDBOX = '1';

const { buildVnpayPaymentUrl, verifyReturnUrl } = await import('./vnpay.service.js');

function parseQuery(url: string): Record<string, string> {
  const out: Record<string, string> = {};
  new URL(url).searchParams.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

test('a URL signed with our secret verifies as authentic', () => {
  const url = buildVnpayPaymentUrl('TXNREF123', 50_000, 'Thanh toan test', '127.0.0.1');
  const res = verifyReturnUrl(parseQuery(url));
  assert.equal(res.isVerified, true);
});

test('tampering with the amount breaks the signature (forged callback rejected)', () => {
  const url = buildVnpayPaymentUrl('TXNREF123', 50_000, 'Thanh toan test', '127.0.0.1');
  const query = parseQuery(url);
  query.vnp_Amount = '1'; // attacker tries to pay 1 unit for a 50,000 order
  const res = verifyReturnUrl(query);
  assert.equal(res.isVerified, false);
});

test('a callback with no signature does not verify', () => {
  const res = verifyReturnUrl({ vnp_Amount: '5000000', vnp_TxnRef: 'X', vnp_ResponseCode: '00' });
  assert.equal(res.isVerified, false);
});
