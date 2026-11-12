/**
 * Hồ sơ học CT Language — phần kiểm hình dạng. App gửi bản đầy đủ mỗi lần; máy chủ phải từ chối thứ app
 * không thể vẽ lại (ngôn ngữ lạ, trình độ không có trong danh sách) và kẹp thứ vô hại (ngày tương lai).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chuanHoaHoSo } from './hoSo.js';

const BAY_GIO = new Date('2026-11-12T10:00:00.000Z');
const en = { level: 'b1', goal: 'thi', target: '7.0', minutesPerDay: 15 };

test('hồ sơ hợp lệ: giữ nguyên, startedAt mặc định = bây giờ', () => {
  const h = chuanHoaHoSo({ activeLang: 'en', langs: { en }, reminder: '20:30' }, BAY_GIO);
  assert.equal(h.activeLang, 'en');
  assert.deepEqual(h.langs.en, { ...en, startedAt: BAY_GIO.toISOString() });
  assert.equal(h.reminder, '20:30');
});

test('hai ngôn ngữ: đổi activeLang không mất lựa chọn của ngôn ngữ kia', () => {
  const ja = { level: '0', goal: 'giao-tiep', minutesPerDay: 10, startedAt: '2026-11-01T00:00:00.000Z' };
  const h = chuanHoaHoSo({ activeLang: 'ja', langs: { en, ja } }, BAY_GIO);
  assert.equal(h.activeLang, 'ja');
  assert.equal(h.langs.en?.level, 'b1');
  assert.equal(h.langs.ja?.target, null);
  assert.equal(h.langs.ja?.startedAt, '2026-11-01T00:00:00.000Z');
  assert.equal(h.reminder, null);
});

test('startedAt ở tương lai (đồng hồ máy lệch) ⇒ kẹp về bây giờ', () => {
  const h = chuanHoaHoSo({ activeLang: 'en', langs: { en: { ...en, startedAt: '2027-01-01T00:00:00Z' } } }, BAY_GIO);
  assert.equal(h.langs.en?.startedAt, BAY_GIO.toISOString());
});

test('từ chối: ngôn ngữ lạ, trình độ/mốc sai ngôn ngữ, phút lạ, giờ nhắc sai, activeLang không có trong langs', () => {
  const sai = (than: unknown) => assert.throws(() => chuanHoaHoSo(than, BAY_GIO), (e: { code?: string }) => e.code === 'CTL_HO_SO_SAI');
  sai(null);
  sai({ activeLang: 'ko', langs: { en } });
  sai({ activeLang: 'en', langs: { ko: en } });
  sai({ activeLang: 'en', langs: { en: { ...en, level: 'n3' } } });
  sai({ activeLang: 'ja', langs: { ja: { ...en, level: 'n3', target: '7.0' } } });
  sai({ activeLang: 'en', langs: { en: { ...en, minutesPerDay: 17 } } });
  sai({ activeLang: 'en', langs: { en: { ...en, goal: 'choi' } } });
  sai({ activeLang: 'en', langs: { en }, reminder: '25:00' });
  sai({ activeLang: 'zh', langs: { en } });
  sai({ activeLang: 'en', langs: { en: { ...en, startedAt: 'hôm qua' } } });
});
