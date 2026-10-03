/**
 * Tra cứu phiếu công khai (/about/nhan-du-an/tra-cuu) — phần KHÔNG cần CSDL:
 *   · chuẩn hoá mã/email (hoa thường, khoảng trắng) và chặn mã sai định dạng;
 *   · so email không phân biệt hoa thường;
 *   · bản công khai là DANH SÁCH TRẮNG — ghi chú nội bộ, SĐT, IP… không bao giờ lọt,
 *     kể cả khi hàng CSDL đưa vào có đủ các trường đó.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emailMatches, normalizeLookup, toPublicView } from './projectRequest.service.js';

test('normalizeLookup: chuẩn hoá mã + email, sai định dạng ⇒ null', () => {
  assert.deepEqual(normalizeLookup('  yc-2026-0001 ', ' Khach@Example.COM '), { code: 'YC-2026-0001', email: 'khach@example.com' });
  assert.equal(normalizeLookup('YC-2026', 'a@b.c'), null);
  assert.equal(normalizeLookup("YC-2026-0001' OR 1=1", 'a@b.c'), null);
  assert.equal(normalizeLookup('YC-2026-0001', 'khong-co-a-cong'), null);
});

test('emailMatches: không phân biệt hoa thường, khác email ⇒ false', () => {
  assert.equal(emailMatches('khach@example.com', 'KHACH@Example.com'), true);
  assert.equal(emailMatches('khach@example.com', 'khach2@example.com'), false);
});

test('toPublicView: chỉ trả trường cho phép — ghi chú nội bộ và dữ liệu cá nhân không lọt', () => {
  const row = {
    code: 'YC-2026-0007', email: 'khach@example.com', status: 'QUALIFYING',
    createdAt: new Date('2026-10-01T00:00:00Z'), updatedAt: new Date('2026-10-02T00:00:00Z'), statusChangedAt: null,
    productTypes: ['WEB'], organization: '[NHẬP VAI] Công ty A', needs: 'x'.repeat(500), clientNote: '  Hẹn gọi thứ Hai  ',
    // Những trường dưới đây KHÔNG được xuất hiện ở đầu ra:
    internalNote: 'BÍ MẬT-NỘI-BỘ', phone: '0900000000', ip: '1.2.3.4', name: 'Nguyễn Văn A', budgetRange: '100 triệu',
  };
  const v = toPublicView(row, null);
  const json = JSON.stringify(v);
  for (const leak of ['BÍ MẬT-NỘI-BỘ', '0900000000', '1.2.3.4', 'khach@example.com', 'Nguyễn Văn A', '100 triệu']) {
    assert.ok(!json.includes(leak), `lộ: ${leak}`);
  }
  assert.deepEqual(Object.keys(v).sort(), ['clientNote', 'code', 'createdAt', 'organization', 'productTypes', 'progressUrl', 'status', 'statusChangedAt', 'summary', 'updatedAt']);
  assert.equal(v.clientNote, 'Hẹn gọi thứ Hai');
  assert.equal(v.organization, 'Công ty A');
  assert.ok(v.summary.length <= 240 && v.summary.endsWith('…'));
});
