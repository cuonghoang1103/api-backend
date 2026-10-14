/**
 * Thẻ đề Code Lab — bóc ví dụ "Input:/Output:" khỏi đề văn xuôi:
 *   npx tsx --test frontend/src/components/code-lab/problemParse.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { extractExamples, splitConstraints, looksLikeHtml, htmlToText } from './problemParse';
import { sortEasyToHard } from '../../lib/codelabUi';

describe('extractExamples — HTML', () => {
  it('kiểu LeetCode: <p><strong>Example 1:</strong></p><pre>Input/Output/Explanation</pre>', () => {
    const html = '<p>Given an array, return the sum.</p>\n'
      + '<p><strong>Example 1:</strong></p>\n'
      + '<pre><strong>Input:</strong> nums = [1,2,3]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> 1 + 2 + 3 = 6.</pre>\n'
      + '<p><strong>Example 2:</strong></p>\n'
      + '<pre><strong>Input:</strong> nums = []\n<strong>Output:</strong> 0</pre>\n'
      + '<p>Follow-up: can you do it in one pass?</p>';
    const r = extractExamples(html, 'html');
    assert.deepEqual(r.examples, [
      { input: 'nums = [1,2,3]', output: '6', explanation: '1 + 2 + 3 = 6.' },
      { input: 'nums = []', output: '0' },
    ]);
    assert.ok(r.body.includes('Given an array'));
    assert.ok(r.body.includes('Follow-up'));
    assert.ok(!r.body.includes('Input:'));
    assert.ok(!r.body.includes('Example 1'));
  });

  it('các đoạn <p> liền nhau có tiêu đề Example: Input / Output / Explanation', () => {
    const html = '<p>Intro.</p><h4>Example</h4><p>Input: "abc"</p><p>Output: "cba"</p><p>Explanation: reversed.</p><p>More text.</p>';
    const r = extractExamples(html, 'html');
    assert.deepEqual(r.examples, [{ input: '"abc"', output: '"cba"', explanation: 'reversed.' }]);
    assert.equal(r.body, '<p>Intro.</p><p>More text.</p>');
  });

  it('pre nhiều dòng (kiểu thi đấu): giá trị trải nhiều dòng', () => {
    const html = '<pre>Input:\n3\n1 2 3\nOutput:\n6</pre>';
    const r = extractExamples(html, 'html');
    assert.deepEqual(r.examples, [{ input: '3\n1 2 3', output: '6' }]);
    assert.equal(r.body, '');
  });

  it('KHÔNG bóc: đặc tả LAB211 có "Input:" là gạch đầu dòng để trống', () => {
    const html = '<ul><li>Input:</li></ul><li>path: File path.</li><ul><li>Output:</li></ul><li>List of the person.</li>';
    const r = extractExamples(html, 'html');
    assert.equal(r.examples.length, 0);
    assert.equal(r.body, html);
  });

  it('KHÔNG bóc: đặc tả <p>Input:</p><p>Output: … containing:</p><ul> (không có tiêu đề Example)', () => {
    const html = '<p><strong>Input:</strong> A date range and a Stripe client.</p>\n<p><strong>Output:</strong> A report containing:</p>\n<ul><li>Total</li></ul>';
    assert.equal(extractExamples(html, 'html').examples.length, 0);
    // có tiêu đề Example nhưng Output kết bằng ":" ⇒ vẫn không bóc
    assert.equal(extractExamples('<p>Example:</p>' + html, 'html').examples.length, 0);
  });

  it('KHÔNG bóc: "Input:" nằm giữa câu văn', () => {
    const html = '<p>The function reads Input: a string, and prints Output: its length.</p>';
    const r = extractExamples(html, 'html');
    assert.equal(r.examples.length, 0);
  });

  it('KHÔNG bóc: có Input mà không có Output', () => {
    const html = '<p>Input: 5</p><p>Then do something.</p>';
    const r = extractExamples(html, 'html');
    assert.equal(r.examples.length, 0);
    assert.equal(r.body, html);
  });

  it('KHÔNG nuốt đoạn văn đứng sau Output trong cùng <p>', () => {
    const html = '<p>Input: 1<br>Output: 2<br>This is why it works.</p>';
    const r = extractExamples(html, 'html');
    assert.equal(r.examples.length, 0);
  });

  it('nhãn tiếng Việt', () => {
    const html = '<p><b>Ví dụ 1:</b></p><pre>Đầu vào: n = 4\nĐầu ra: 24\nGiải thích: 4! = 24</pre>';
    const r = extractExamples(html, 'html');
    assert.deepEqual(r.examples, [{ input: 'n = 4', output: '24', explanation: '4! = 24' }]);
  });

  it('giải mã thực thể HTML trong giá trị', () => {
    const r = extractExamples('<pre>Input: a &lt; b &amp;&amp; c\nOutput: true</pre>', 'html');
    assert.deepEqual(r.examples, [{ input: 'a < b && c', output: 'true' }]);
  });
});

describe('extractExamples — markdown', () => {
  it('**Input:** / **Output:** + khối ```', () => {
    const md = 'Reverse a string.\n\n**Example 1:**\n\n```\nInput: s = "hello"\nOutput: "olleh"\n```\n\nNotes follow.';
    const r = extractExamples(md, 'md');
    assert.deepEqual(r.examples, [{ input: 's = "hello"', output: '"olleh"' }]);
    assert.equal(r.body, 'Reverse a string.\n\nNotes follow.');
  });

  it('các dòng nhãn đậm liền nhau trong một đoạn', () => {
    const md = 'Intro\n\n**Example 1:**\n**Input:** `[1, 2]`\n**Output:** `3`\n**Explanation:** sum\n\nOutro';
    const r = extractExamples(md, 'md');
    assert.deepEqual(r.examples, [{ input: '[1, 2]', output: '3', explanation: 'sum' }]);
    assert.equal(r.body, 'Intro\n\nOutro');
    // không có tiêu đề Example và không trong khối code ⇒ coi là đặc tả, giữ nguyên
    const spec = 'Intro\n\n**Input:** a list\n**Output:** its sum';
    assert.equal(extractExamples(spec, 'md').examples.length, 0);
  });

  it('văn xuôi không có mẫu ⇒ giữ nguyên', () => {
    const md = 'Write a function that returns the input string reversed.';
    assert.deepEqual(extractExamples(md, 'md'), { body: md, examples: [] });
  });
});

describe('splitConstraints', () => {
  it('nhiều dòng gạch đầu dòng', () => {
    assert.deepEqual(splitConstraints('- 1 <= n <= 100\n- s only letters\n\n* no imports'), ['1 <= n <= 100', 's only letters', 'no imports']);
  });
  it('một dòng nhiều câu, giữ viết tắt và số thập phân', () => {
    assert.deepEqual(
      splitConstraints('The input string contains only letters, e.g. Abc. Format codes are case-sensitive. Size is 1.5 MB max.'),
      ['The input string contains only letters, e.g. Abc.', 'Format codes are case-sensitive.', 'Size is 1.5 MB max.'],
    );
  });
  it('rỗng', () => { assert.deepEqual(splitConstraints(null), []); });
});

describe('phụ trợ', () => {
  it('looksLikeHtml', () => {
    assert.equal(looksLikeHtml('<p>x</p>'), true);
    assert.equal(looksLikeHtml('**bold** and `a < b`'), false);
  });
  it('htmlToText giữ xuống dòng', () => {
    assert.equal(htmlToText('<p>a</p><p>b<br/>c</p>'), 'a\nb\nc\n');
  });
  it('sortEasyToHard: Dễ → Vừa → Khó, cùng mức giữ sortOrder', () => {
    const got = sortEasyToHard([
      { slug: 'h', difficulty: 'HARD' as const, sortOrder: 0 },
      { slug: 'm2', difficulty: 'MEDIUM' as const, sortOrder: 5 },
      { slug: 'e', difficulty: 'EASY' as const, sortOrder: 9 },
      { slug: 'm1', difficulty: 'MEDIUM' as const, sortOrder: 1 },
    ]).map((x) => x.slug);
    assert.deepEqual(got, ['e', 'm1', 'm2', 'h']);
  });
});
