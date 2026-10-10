/**
 * CT Work — kiểm kho chủ đề hướng dẫn + bộ phân tích đầu ra model (THUẦN, không DB,
 * không gọi model). Chạy: WORK_DB_TEST=1 npx tsx --test src/services/work/helpGuide.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { HELP_TOPICS, HELP_TOPIC_BY_ID, parseTopics, linksForTopics, type HelpScope } from './helpGuide.js';

const SCOPES: HelpScope[] = ['project', 'workspace', 'global'];

describe('helpGuide — kho chủ đề', () => {
  it('có đủ chủ đề (≥ 25) và id là duy nhất', () => {
    assert.ok(HELP_TOPICS.length >= 25, `chỉ có ${HELP_TOPICS.length} chủ đề`);
    const ids = HELP_TOPICS.map((t) => t.id);
    assert.equal(new Set(ids).size, ids.length, 'id bị trùng');
  });

  it('mỗi chủ đề có tiêu đề + tóm tắt song ngữ (en/vi) không rỗng', () => {
    for (const t of HELP_TOPICS) {
      for (const field of ['title', 'summary'] as const) {
        assert.ok(t[field].en.trim().length > 0, `${t.id}.${field}.en rỗng`);
        assert.ok(t[field].vi.trim().length > 0, `${t.id}.${field}.vi rỗng`);
      }
      assert.ok(Array.isArray(t.keywords) && t.keywords.length > 0, `${t.id} thiếu keywords`);
    }
  });

  it('mỗi liên kết có scope hợp lệ, path chuỗi không rỗng, nhãn song ngữ', () => {
    for (const t of HELP_TOPICS) {
      assert.ok(t.pages.length > 0, `${t.id} không có pages`);
      for (const p of t.pages) {
        assert.ok(SCOPES.includes(p.scope), `${t.id} scope lạ: ${p.scope}`);
        assert.equal(typeof p.path, 'string');
        assert.ok(p.path.trim().length > 0, `${t.id} path rỗng`);
        // Quy ước usePageHref: global = đường tuyệt đối (bắt đầu '/'); project/workspace = đường trần.
        if (p.scope === 'global') assert.ok(p.path.startsWith('/'), `${t.id} global path phải bắt đầu '/': ${p.path}`);
        else assert.ok(!p.path.startsWith('/'), `${t.id} ${p.scope} path không được bắt đầu '/': ${p.path}`);
        assert.ok(p.label.en.trim().length > 0 && p.label.vi.trim().length > 0, `${t.id} nhãn link rỗng`);
      }
    }
  });

  it('HELP_TOPIC_BY_ID khớp mảng', () => {
    assert.equal(Object.keys(HELP_TOPIC_BY_ID).length, HELP_TOPICS.length);
    for (const t of HELP_TOPICS) assert.equal(HELP_TOPIC_BY_ID[t.id], t);
  });
});

describe('helpGuide — parseTopics (phân tích đầu ra model)', () => {
  it('tách dòng TOPICS cuối và trả câu trả lời đã bỏ dòng đó', () => {
    const first = HELP_TOPICS[0].id;
    const second = HELP_TOPICS[1].id;
    const text = `Here is how you do it.\n\nTOPICS: ${first}, ${second}`;
    const { answer, ids } = parseTopics(text);
    assert.equal(answer, 'Here is how you do it.');
    assert.deepEqual(ids, [first, second]);
  });

  it('bỏ id lạ (model bịa) và giữ id hợp lệ', () => {
    const good = HELP_TOPICS[0].id;
    const { ids } = parseTopics(`ok\nTOPICS: ${good}, not-a-real-topic, ${good}`);
    assert.deepEqual(ids, [good], 'id lạ phải bị bỏ, id trùng không lặp');
  });

  it('cắt tối đa 3 id', () => {
    const picked = HELP_TOPICS.slice(0, 5).map((t) => t.id);
    const { ids } = parseTopics(`x\nTOPICS: ${picked.join(',')}`);
    assert.equal(ids.length, 3);
  });

  it('không có dòng TOPICS ⇒ ids rỗng, giữ nguyên câu trả lời', () => {
    const { answer, ids } = parseTopics('Just an answer with no topic line.');
    assert.equal(answer, 'Just an answer with no topic line.');
    assert.deepEqual(ids, []);
  });

  it('TOPICS rỗng ⇒ ids rỗng', () => {
    const { ids } = parseTopics('answer\nTOPICS:');
    assert.deepEqual(ids, []);
  });
});

describe('helpGuide — linksForTopics (mã sở hữu liên kết)', () => {
  it('ánh xạ id đã biết sang đúng pages của chúng', () => {
    const t = HELP_TOPICS[0];
    const links = linksForTopics([t.id]);
    assert.deepEqual(links, t.pages);
  });

  it('bỏ qua id không biết', () => {
    assert.deepEqual(linksForTopics(['khong-ton-tai']), []);
  });

  it('gộp nhiều chủ đề và bỏ trùng theo scope+path', () => {
    const a = HELP_TOPICS[0];
    const links = linksForTopics([a.id, a.id]);
    // cùng một chủ đề hai lần ⇒ không nhân đôi
    assert.equal(links.length, a.pages.length);
  });
});
