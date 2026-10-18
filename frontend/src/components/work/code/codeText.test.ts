/**
 * Trang "Code" — hàm thuần của trình xem mã / diff.
 *   npx tsx --test frontend/src/components/work/code/codeText.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { languageOf, parsePatch, safeHref, sizeLabel, splitHighlighted } from './codeText';

describe('splitHighlighted', () => {
  it('giữ thẻ span mở qua nhiều dòng (chú thích dài)', () => {
    const html = 'a <span class="hljs-comment">/* x\ny */</span> b\nc';
    assert.deepEqual(splitHighlighted(html), [
      'a <span class="hljs-comment">/* x</span>',
      '<span class="hljs-comment">y */</span> b',
      'c',
    ]);
  });
  it('lồng nhau', () => {
    const html = '<span class="a"><span class="b">1\n2</span>3</span>';
    assert.deepEqual(splitHighlighted(html), ['<span class="a"><span class="b">1</span></span>', '<span class="a"><span class="b">2</span>3</span>']);
  });
  it('dòng trống vẫn là một dòng', () => {
    assert.deepEqual(splitHighlighted('x\n\ny'), ['x', '', 'y']);
  });
});

describe('parsePatch', () => {
  it('đánh số dòng cũ / mới theo hunk', () => {
    const rows = parsePatch('@@ -10,3 +10,4 @@ class A\n ctx\n-old\n+new\n+added\n ctx2');
    assert.deepEqual(rows.map((r) => [r.kind, r.oldNo, r.newNo, r.text]), [
      ['hunk', null, null, '@@ -10,3 +10,4 @@ class A'],
      ['ctx', 10, 10, 'ctx'],
      ['del', 11, null, 'old'],
      ['add', null, 11, 'new'],
      ['add', null, 12, 'added'],
      ['ctx', 12, 13, 'ctx2'],
    ]);
  });
  it('dòng "\\ No newline" là meta, không đánh số', () => {
    const rows = parsePatch('@@ -1 +1 @@\n-a\n\\ No newline at end of file\n+b');
    assert.equal(rows[2].kind, 'meta');
    assert.equal(rows[3].newNo, 1);
  });
});

describe('languageOf / sizeLabel', () => {
  it('đuôi tệp ⇒ ngôn ngữ', () => {
    assert.equal(languageOf('src/main/java/App.java'), 'java');
    assert.equal(languageOf('web/index.JSP'), 'xml');
    assert.equal(languageOf('Dockerfile'), 'dockerfile');
    assert.equal(languageOf('a/b/c.tsx'), 'typescript');
    assert.equal(languageOf('README'), null);
  });
  it('kích thước', () => {
    assert.equal(sizeLabel(512), '512 B');
    assert.equal(sizeLabel(2048), '2.0 KB');
    assert.equal(sizeLabel(3 * 1024 * 1024), '3.0 MB');
  });
});

describe('safeHref (QA 18/10/2026 — liên kết từ webhook/host)', () => {
  it('chỉ cho http(s); javascript:/data:/vbscript:/tương đối ⇒ undefined', () => {
    assert.equal(safeHref('https://github.com/o/r/commit/abc'), 'https://github.com/o/r/commit/abc');
    assert.equal(safeHref('http://gitlab.local/x'), 'http://gitlab.local/x');
    for (const bad of ['javascript:alert(1)', ' JavaScript:alert(1)', 'data:text/html,x', 'vbscript:x', '//evil.com', '/relative', '', null, undefined, 42]) {
      assert.equal(safeHref(bad), undefined, String(bad));
    }
  });
});
