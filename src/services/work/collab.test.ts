/**
 * CTW K-3b — đồng soạn thảo Docs: luật thuần + chuyển đổi JSON ↔ Yjs (không DB).
 *   npx tsx --test src/services/work/collab.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as Y from 'yjs';
import { blockAuthors, clientIdsOfUpdate, collabRoomMode, contentHashOf, mergeBlocks, projectCollabOn, type CollabRoomInput } from './collabRules.js';
import { docJson, seedDoc, writeJsonInto } from './collabDoc.js';

const P = (t: string) => ({ type: 'paragraph', content: [{ type: 'text', text: t }] });
const doc = (...blocks: unknown[]) => ({ type: 'doc', content: blocks });

/** Bỏ attrs null (mặc định do lược đồ thêm) để so nội dung thật. */
function clean(n: unknown): unknown {
  if (Array.isArray(n)) return n.map(clean);
  if (!n || typeof n !== 'object') return n;
  const o: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(n as Record<string, unknown>)) {
    if (k === 'attrs' && v && typeof v === 'object') {
      const a = Object.fromEntries(Object.entries(v as Record<string, unknown>).filter(([, x]) => x !== null && x !== undefined));
      if (Object.keys(a).length) o.attrs = a;
    } else o[k] = clean(v);
  }
  return o;
}

function sync(a: Y.Doc, b: Y.Doc) {
  Y.applyUpdate(b, Y.encodeStateAsUpdate(a, Y.encodeStateVector(b)));
  Y.applyUpdate(a, Y.encodeStateAsUpdate(b, Y.encodeStateVector(a)));
}

describe('collabRoomMode — ai vào phòng Yjs', () => {
  const base: CollabRoomInput = {
    role: 'MEMBER', principal: 'HUMAN', clientScoped: false, docsModule: true, view: 'ALL', edit: true,
    pageVisibility: 'INTERNAL', pageStatus: 'DRAFT', pageDeleted: false, editLocked: false, collabEnabled: true,
  };
  it('MEMBER sửa được ⇒ edit', () => assert.equal(collabRoomMode(base).mode, 'edit'));
  it('VIEWER / TEACHER (đọc mọi trang, không sửa) ⇒ read', () => {
    assert.equal(collabRoomMode({ ...base, role: 'VIEWER', edit: false }).mode, 'read');
    assert.equal(collabRoomMode({ ...base, role: 'TEACHER', edit: false }).mode, 'read');
  });
  it('agent ⇒ deny (kể cả khi vai cho sửa)', () => assert.equal(collabRoomMode({ ...base, principal: 'AGENT' }).mode, 'deny'));
  it('khách cổng (CLIENT) ⇒ deny, cả trang CLIENT', () => {
    assert.equal(collabRoomMode({ ...base, role: 'CLIENT', clientScoped: true, view: 'CLIENT', edit: false, pageVisibility: 'CLIENT' }).mode, 'deny');
  });
  it('GUEST bị giới hạn (view CLIENT) ⇒ deny; trang nội bộ ⇒ deny như 404', () => {
    assert.equal(collabRoomMode({ ...base, role: 'VIEWER', view: 'CLIENT', edit: false, pageVisibility: 'CLIENT' }).mode, 'deny');
    assert.equal(collabRoomMode({ ...base, role: 'VIEWER', view: 'CLIENT', edit: false }).reason, 'Document not found');
  });
  it('người ngoài / mô-đun tắt / trang xoá / collab tắt ⇒ deny', () => {
    assert.equal(collabRoomMode({ ...base, role: null, view: null }).mode, 'deny');
    assert.equal(collabRoomMode({ ...base, docsModule: false }).mode, 'deny');
    assert.equal(collabRoomMode({ ...base, pageDeleted: true }).mode, 'deny');
    assert.equal(collabRoomMode({ ...base, collabEnabled: false }).mode, 'deny');
  });
  it('trang ARCHIVED hoặc đang khoá chỉnh sửa ⇒ read', () => {
    assert.equal(collabRoomMode({ ...base, pageStatus: 'ARCHIVED' }).mode, 'read');
    assert.equal(collabRoomMode({ ...base, editLocked: true }).mode, 'read');
  });
  it('công tắc dự án mặc định BẬT', () => {
    assert.equal(projectCollabOn(null), true);
    assert.equal(projectCollabOn({ modules: { docs: true } }), true);
    assert.equal(projectCollabOn({ collab: { enabled: false } }), false);
    assert.equal(projectCollabOn({ collab: { enabled: true } }), true);
  });
});

describe('JSON ↔ Yjs giữ nguyên khối Docs', () => {
  const rich = doc(
    { type: 'heading', attrs: { level: 4 }, content: [{ type: 'text', text: 'Mục 2.1' }] },
    { type: 'paragraph', content: [
      { type: 'text', text: 'Xem ' }, { type: 'text', text: 'SRS', marks: [{ type: 'link', attrs: { href: '/work/a/B/docs/3', target: '_blank', rel: 'noopener noreferrer nofollow', class: null } }] },
      { type: 'text', text: ' và ' }, { type: 'mention', attrs: { id: '42', label: 'An' } },
      { type: 'text', text: ' câu được bình luận', marks: [{ type: 'bold' }, { type: 'commentAnchor', attrs: { id: 'anc_abc123' } }] },
    ] },
    { type: 'image', attrs: { src: 'https://cdn.example.com/work/1/img.png', alt: 'ctw-diagram:7@latest', title: 'Figure: D-7' } },
    { type: 'codeBlock', attrs: { language: 'mermaid' }, content: [{ type: 'text', text: '%% ctw-diagram:9@2\nflowchart TD\n  A-->B' }] },
    { type: 'table', content: [
      { type: 'tableRow', content: [
        { type: 'tableHeader', attrs: { colspan: 2, rowspan: 1, colwidth: null }, content: [P('Actor')] },
      ] },
      { type: 'tableRow', content: [
        { type: 'tableCell', attrs: { colspan: 1, rowspan: 1, colwidth: [120] }, content: [P('Student')] },
        { type: 'tableCell', attrs: { colspan: 1, rowspan: 1, colwidth: null }, content: [P('Lab')] },
      ] },
    ] },
    { type: 'taskList', content: [{ type: 'taskItem', attrs: { checked: true }, content: [P('Done')] }] },
    { type: 'bulletList', content: [{ type: 'listItem', content: [P('một'), { type: 'bulletList', content: [{ type: 'listItem', content: [P('hai')] }] }] }] },
    { type: 'blockquote', content: [P('trích')] },
    { type: 'horizontalRule' },
    { type: 'orderedList', attrs: { start: 3 }, content: [{ type: 'listItem', content: [P('ba')] }] },
  );

  it('giữ nguyên ảnh, Mermaid, sơ đồ nhúng, bảng, mention, link, neo bình luận', () => {
    const y = seedDoc(rich, 'Report 3');
    const back = docJson(y);
    assert.deepEqual(clean(back), clean(rich));
    assert.equal(y.getMap('metadata').get('title'), 'Report 3');
  });

  it('trang trống / JSON lạ ⇒ một đoạn rỗng (không vỡ)', () => {
    assert.deepEqual(docJson(seedDoc(null, 'x')), { type: 'doc', content: [{ type: 'paragraph' }] });
    assert.deepEqual(docJson(seedDoc({ type: 'nope' }, 'x')), { type: 'doc', content: [{ type: 'paragraph' }] });
  });

  it('writeJsonInto là DIFF: khối không đổi giữ nguyên danh tính Yjs', () => {
    const y = seedDoc(doc(P('a'), P('b'), P('c')), 't');
    const before = y.getXmlFragment('default').get(0);
    writeJsonInto(y, doc(P('a'), P('b2'), P('c'), P('d')));
    assert.deepEqual(clean(docJson(y)), clean(doc(P('a'), P('b2'), P('c'), P('d'))));
    assert.equal(y.getXmlFragment('default').get(0), before);
  });

  it('băm nội dung ổn định theo thứ tự khoá', () => {
    assert.equal(contentHashOf({ a: 1, b: [1, 2] }), contentHashOf({ b: [1, 2], a: 1 }));
    assert.notEqual(contentHashOf(doc(P('a'))), contentHashOf(doc(P('b'))));
  });
});

describe('hai client Yjs sửa đồng thời rồi hội tụ', () => {
  it('cùng gõ ở hai đoạn khác nhau + cùng một đoạn ⇒ hai bản giống hệt, không mất chữ', () => {
    const server = seedDoc(doc(P('Mở đầu'), P('Phạm vi')), 'R1');
    const a = new Y.Doc();
    const b = new Y.Doc();
    sync(server, a);
    sync(server, b);
    const fa = a.getXmlFragment('default');
    const fb = b.getXmlFragment('default');
    // A gõ cuối đoạn 1, B gõ cuối đoạn 2, rồi cả hai cùng chèn vào đầu đoạn 1 — KHÔNG đồng bộ giữa chừng (offline).
    ((fa.get(0) as Y.XmlElement).get(0) as Y.XmlText).insert(6, ' của An');
    ((fb.get(1) as Y.XmlElement).get(0) as Y.XmlText).insert(7, ' của Bình');
    ((fa.get(0) as Y.XmlElement).get(0) as Y.XmlText).insert(0, '[A]');
    ((fb.get(0) as Y.XmlElement).get(0) as Y.XmlText).insert(0, '[B]');
    sync(a, server);
    sync(b, server);
    sync(a, server);
    const ja = JSON.stringify(docJson(a));
    assert.equal(ja, JSON.stringify(docJson(b)));
    assert.equal(ja, JSON.stringify(docJson(server)));
    const text = ja;
    for (const s of ['của An', 'của Bình', '[A]', '[B]', 'Mở đầu', 'Phạm vi']) assert.ok(text.includes(s), s);
  });

  it('tự điền của máy chủ chạy KHI người khác đang gõ ⇒ gộp, không đè', () => {
    const base = doc(P('Intro'), P('Team: TBD'), P('Risks: TBD'));
    const server = seedDoc(base, 'R2');
    const a = new Y.Doc();
    sync(server, a);
    // An đang gõ vào đoạn Intro (chưa kịp lưu xuống DB ⇒ base của tác vụ tự điền không có chữ này).
    ((a.getXmlFragment('default').get(0) as Y.XmlElement).get(0) as Y.XmlText).insert(5, ' — written by An');
    sync(a, server);
    // Tác vụ tự điền: đọc base, thay đoạn Team + Risks.
    const next = doc(P('Intro'), P('Team: An, Bình'), P('Risks: R-1 scope creep'));
    const merged = mergeBlocks(base, docJson(server), next);
    writeJsonInto(server, merged.doc);
    sync(server, a);
    const out = JSON.stringify(docJson(a));
    assert.ok(out.includes('Intro — written by An'), 'chữ của An còn');
    assert.ok(out.includes('Team: An, Bình') && out.includes('R-1 scope creep'), 'phần tự điền vào');
    assert.ok(!out.includes('TBD'));
    assert.equal(merged.conflicts, 0);
  });
});

describe('mergeBlocks — gộp ba chiều theo khối', () => {
  it('live == base ⇒ lấy next', () => {
    const r = mergeBlocks(doc(P('a')), doc(P('a')), doc(P('a'), P('b')));
    assert.deepEqual(r.doc.content, [P('a'), P('b')]);
  });
  it('đoạn người khác vừa sửa ĐÚNG chỗ tự điền định thay ⇒ giữ bản của họ + chèn bản mới ngay sau', () => {
    const r = mergeBlocks(doc(P('a'), P('team'), P('c')), doc(P('a'), P('team (đang sửa)'), P('c')), doc(P('a'), P('team v2'), P('c')));
    assert.deepEqual(r.doc.content, [P('a'), P('team (đang sửa)'), P('team v2'), P('c')]);
    assert.equal(r.conflicts, 1);
  });
  it('vùng thay có khối bị sửa lẫn khối còn nguyên ⇒ thay khối nguyên, giữ khối bị sửa', () => {
    const r = mergeBlocks(doc(P('a'), P('t1'), P('t2'), P('c')), doc(P('a'), P('t1 sửa'), P('t2'), P('c')), doc(P('a'), P('n1'), P('n2'), P('c')));
    assert.deepEqual(r.doc.content, [P('a'), P('t1 sửa'), P('n1'), P('n2'), P('c')]);
  });
  it('khối người khác vừa thêm được giữ; chèn cuối của tự điền vẫn vào', () => {
    const r = mergeBlocks(doc(P('a'), P('b')), doc(P('a'), P('mới của An'), P('b')), doc(P('a'), P('b'), P('Record of changes')));
    assert.deepEqual(r.doc.content, [P('a'), P('mới của An'), P('b'), P('Record of changes')]);
  });
  it('tự điền xoá một khối người khác không đụng ⇒ xoá', () => {
    const r = mergeBlocks(doc(P('a'), P('x'), P('b')), doc(P('a'), P('x'), P('b'), P('cuối')), doc(P('a'), P('b')));
    assert.deepEqual(r.doc.content, [P('a'), P('b'), P('cuối')]);
  });
});

describe('tác giả theo đoạn', () => {
  it('đếm ký tự còn sống theo clientID; clientIdsOfUpdate đọc đúng clientID của người gửi', () => {
    const server = seedDoc(doc(P('xin chào')), 't');
    const a = new Y.Doc();
    sync(server, a);
    let upd: Uint8Array | null = null;
    a.on('update', (u: Uint8Array) => { upd = u; });
    ((a.getXmlFragment('default').get(0) as Y.XmlElement).get(0) as Y.XmlText).insert(8, ' các bạn');
    assert.deepEqual(clientIdsOfUpdate(upd!), [a.clientID]);
    sync(a, server);
    const [b0] = blockAuthors(server.getXmlFragment('default'));
    assert.equal(b0.chars[String(a.clientID)], ' các bạn'.length);
    assert.equal(b0.chars[String(server.clientID)], 'xin chào'.length);
    assert.equal(b0.preview, 'xin chào các bạn');
  });
});
