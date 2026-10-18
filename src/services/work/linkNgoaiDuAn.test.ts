/**
 * CT Work — link ngoài trong thẻ (19/10/2026): trợ lý đọc NỘI DUNG Google Docs/GitHub gắn trong mô tả/bình luận
 * (trần mỗi link + trần tổng, bọc untrusted), link riêng tư ⇒ câu báo rõ; hình dạng token Figma. Không mạng, không CSDL
 * (chữ thẻ không có link Figma ⇒ không đọc token dự án).
 */
import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { __xoaDemLinkNgoai } from '../linkNgoai/docLink.js';
import { __datMangChoTest } from '../linkNgoai/taiAnToan.js';
import { docLinkCuaThe, hinhDangTokenFigma, LINK_NGOAI_LIMITS } from './linkNgoaiDuAn.js';

afterEach(() => { __datMangChoTest(null); __xoaDemLinkNgoai(); });

describe('docLinkCuaThe', () => {
  it('đọc Docs công khai + báo Docs riêng tư; bọc <ctwork-content untrusted>; không link ⇒ chuỗi rỗng', async () => {
    __datMangChoTest(async (url) => {
      if (url.includes('/document/d/1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/')) return new Response('Yêu cầu: bảng Users có cột email', { status: 200, headers: { 'content-type': 'text/plain' } });
      return new Response(null, { status: 307, headers: { location: 'https://accounts.google.com/ServiceLogin' } });
    }, async () => [{ address: '142.250.1.1' }]);
    __xoaDemLinkNgoai();
    const md = 'Mô tả: đọc https://docs.google.com/document/d/1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/edit và https://docs.google.com/document/d/1BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB/edit';
    const t = await docLinkCuaThe(1, md);
    assert.match(t, /<ctwork-content source="external links" untrusted="true">/);
    assert.match(t, /bảng Users có cột email/);
    assert.match(t, /\(not read\).*Bất kỳ ai có đường liên kết/);
    assert.equal(await docLinkCuaThe(1, 'không có link nào https://example.com'), '');
  });

  it('trần: tối đa 3 link, mỗi link ≤ perLink ký tự', async () => {
    __datMangChoTest(async () => new Response('x'.repeat(50_000), { status: 200, headers: { 'content-type': 'text/plain' } }), async () => [{ address: '142.250.1.1' }]);
    __xoaDemLinkNgoai();
    const ids = ['1CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC', '1DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD', '1EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', '1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'];
    const t = await docLinkCuaThe(1, ids.map((i) => `https://docs.google.com/document/d/${i}/edit`).join(' '));
    assert.equal((t.match(/^--- Google Docs/gm) ?? []).length, LINK_NGOAI_LIMITS.links);
    assert.ok(t.length < LINK_NGOAI_LIMITS.total + 2_000);
  });

  it('hình dạng token Figma', () => {
    assert.ok(hinhDangTokenFigma('fig' + 'd_abcdefghijklmnopqrstuvwxyz0123'));
    assert.ok(!hinhDangTokenFigma('ngắn'));
    assert.ok(!hinhDangTokenFigma('fig' + 'd_abc def ghi jkl mno pqr'));
  });
});
