/**
 * CTW đợt 8b — chuyển block Notion ⇄ Docs (thuần, fixture tự dựng — KHÔNG gọi Notion thật).
 *   npx tsx --test src/services/work/notionBlocks.test.ts
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { Node as PmNodeClass } from '@tiptap/pm/model';
import { collabSchema } from './collabSchema.js';
import type { PmNode } from './docMarkdown.js';
import {
  chunkBlocks, docsLangToNotion, inlineToRich, notionLangToDocs, notionPageTitle, notionRowsToTable, notionToTiptap, suggestNotionMapping, tiptapToNotion,
  type NotionBlock, type NotionDbRow,
} from './notionBlocks.js';
import { parseTable } from './importParsers.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '__fixtures__', 'ctw8b');
const fixture = JSON.parse(readFileSync(path.join(dir, 'notion-page.json'), 'utf8')) as { page: any; blocks: NotionBlock[] };
const db = JSON.parse(readFileSync(path.join(dir, 'notion-database.json'), 'utf8')) as { schema: Array<{ name: string; type: string }>; rows: NotionDbRow[] };

/** Hợp lệ với lược đồ Docs (cùng lược đồ đồng soạn thảo dùng) — sai cấu trúc ⇒ ném lỗi. */
function assertValidDoc(doc: unknown) {
  const node = PmNodeClass.fromJSON(collabSchema(), doc as Record<string, unknown>);
  node.check();
  return node;
}
const find = (doc: PmNode, type: string): PmNode[] => {
  const out: PmNode[] = [];
  const walk = (n: PmNode) => { if (n.type === type) out.push(n); (n.content ?? []).forEach(walk); };
  walk(doc);
  return out;
};
const text = (n: PmNode | undefined): string => (n ? (n.text ?? '') + (n.content ?? []).map(text).join('') : '');

describe('Notion ⇒ Docs', () => {
  const r = notionToTiptap(fixture.blocks, {
    imageSrc: (b) => (b.id === 'img-ok' ? '/api/v1/work/projects/7/images/42' : null),
    childPageLabel: (b) => (b.id === 'b17' ? 'DOC-9' : null),
  });

  it('kết quả hợp lệ với lược đồ Docs', () => {
    assertValidDoc(r.doc);
  });

  it('tiêu đề trang', () => {
    assert.equal(notionPageTitle(fixture.page), 'Kế hoạch dự án — Sprint 3');
    assert.equal(notionPageTitle({ properties: {} }), 'Untitled');
  });

  it('heading, đoạn văn có mark, link an toàn, mention, equation', () => {
    const h = find(r.doc, 'heading')[0];
    assert.equal(h.attrs?.level, 1);
    assert.equal(text(h), 'Mục tiêu');
    const p = r.doc.content![1];
    assert.equal(p.type, 'paragraph');
    const bold = p.content!.find((n) => n.text === 'đăng nhập')!;
    assert.deepEqual(bold.marks?.map((m) => m.type), ['bold'], 'underline + màu bị bỏ (Docs không có)');
    const link = p.content!.find((n) => n.text === 'tài liệu')!;
    assert.deepEqual(link.marks?.map((m) => m.type), ['italic', 'link']);
    assert.equal(link.marks?.[1].attrs?.href, 'https://example.com/spec');
    const js = p.content!.find((n) => n.text === 'js:')!;
    assert.equal(js.marks, undefined, 'link javascript: bị bỏ');
    assert.ok(p.content!.some((n) => n.text === '@Lan Pham'));
    const eq = p.content!.find((n) => n.text === 'E=mc^2')!;
    assert.deepEqual(eq.marks?.map((m) => m.type), ['code']);
  });

  it('danh sách gộp mục liền nhau, con lồng trong mục; todo giữ trạng thái', () => {
    const bl = find(r.doc, 'bulletList');
    assert.equal(bl.length, 2, 'một danh sách cha + một danh sách con');
    assert.equal(bl[0].content!.length, 2);
    assert.equal(text(bl[1]), 'Việc A.1');
    const ol = find(r.doc, 'orderedList')[0];
    assert.equal(ol.content!.length, 2);
    const tl = find(r.doc, 'taskList')[0];
    assert.deepEqual(tl.content!.map((t) => t.attrs?.checked), [true, false]);
  });

  it('code giữ ngôn ngữ (mermaid giữ nguyên, plain text ⇒ null)', () => {
    const cbs = find(r.doc, 'codeBlock');
    assert.equal(cbs[0].attrs?.language, 'mermaid');
    assert.equal(text(cbs[0]), 'graph TD\n  A-->B');
    assert.equal(cbs[1].attrs?.language, null);
  });

  it('quote, callout có biểu tượng, toggle ⇒ tiêu đề đậm + nội dung trong blockquote, divider', () => {
    const quotes = find(r.doc, 'blockquote');
    assert.ok(quotes.some((q) => text(q) === 'Chất lượng trước tốc độ'));
    assert.ok(quotes.some((q) => text(q).startsWith('⚠️ Hạn nộp 20/10')));
    const tog = r.doc.content!.find((n) => n.type === 'paragraph' && text(n).startsWith('▸ '));
    assert.ok(tog, 'có đoạn toggle');
    assert.ok(quotes.some((q) => text(q) === 'Thiếu người test'));
    assert.equal(find(r.doc, 'horizontalRule').length, 1);
  });

  it('bảng: hàng tiêu đề, đệm ô thiếu', () => {
    const t = find(r.doc, 'table')[0];
    assert.equal(t.content!.length, 2);
    assert.ok(t.content![0].content!.every((c) => c.type === 'tableHeader'));
    assert.equal(t.content![1].content!.length, 3, 'hàng thiếu ô được đệm');
    assert.equal(text(t.content![1].content![2]), '');
  });

  it('ảnh: tải được ⇒ ảnh kho dự án; không ⇒ chữ thay thế + cảnh báo (không dán link ký hết hạn)', () => {
    const imgs = find(r.doc, 'image');
    assert.equal(imgs.length, 1);
    assert.equal(imgs[0].attrs?.src, '/api/v1/work/projects/7/images/42');
    assert.equal(imgs[0].attrs?.alt, 'Màn hình chính');
    assert.ok(r.warnings.some((w) => /image could not be copied/i.test(w)));
    assert.ok(!JSON.stringify(r.doc).includes('X-Amz-Signature'), 'không lộ URL ký của Notion');
  });

  it('bookmark ⇒ liên kết; trang con ⇒ ghi lại + nhãn; cột trải phẳng; block lạ ⇒ chữ + cảnh báo', () => {
    assert.ok(JSON.stringify(r.doc).includes('https://cuongthai.com'));
    assert.deepEqual(r.childPages, [{ id: 'b17', title: 'Biên bản họp 1' }]);
    assert.ok(r.doc.content!.some((n) => text(n).includes('Biên bản họp 1 → DOC-9')));
    assert.ok(r.doc.content!.some((n) => text(n) === 'Cột trái'));
    assert.ok(r.warnings.some((w) => w.includes('ai_block')));
  });

  it('trang trống ⇒ một đoạn rỗng hợp lệ', () => {
    const e = notionToTiptap([]);
    assert.deepEqual(e.doc, { type: 'doc', content: [{ type: 'paragraph' }] });
    assertValidDoc(e.doc);
  });

  it('ngôn ngữ code hai chiều', () => {
    assert.equal(notionLangToDocs('c++'), 'cpp');
    assert.equal(notionLangToDocs('plain text'), null);
    assert.equal(docsLangToNotion('cpp'), 'c++');
    assert.equal(docsLangToNotion('ts'), 'typescript');
    assert.equal(docsLangToNotion('brainfuck'), 'plain text');
    assert.equal(docsLangToNotion('mermaid'), 'mermaid');
  });
});

describe('Docs ⇒ Notion', () => {
  const imported = notionToTiptap(fixture.blocks, { imageSrc: (b) => (b.id === 'img-ok' ? '/api/v1/work/projects/7/images/42' : null) }).doc;

  it('khứ hồi Notion ⇒ Docs ⇒ Notion giữ các loại block chính', () => {
    const out = tiptapToNotion(imported, { imageUpload: (src) => (src.endsWith('/42') ? 'fu_123' : null) });
    const types = out.blocks.map((b) => b.type);
    for (const t of ['heading_1', 'paragraph', 'bulleted_list_item', 'numbered_list_item', 'to_do', 'code', 'quote', 'divider', 'table', 'image']) {
      assert.ok(types.includes(t), `thiếu ${t}`);
    }
    const img = out.blocks.find((b) => b.type === 'image') as any;
    assert.deepEqual(img.image.file_upload, { id: 'fu_123' });
    const todo = out.blocks.filter((b) => b.type === 'to_do') as any[];
    assert.deepEqual(todo.map((t) => t.to_do.checked), [true, false]);
    const code = out.blocks.find((b) => b.type === 'code') as any;
    assert.equal(code.code.language, 'mermaid');
    const list = out.blocks.find((b) => b.type === 'bulleted_list_item') as any;
    assert.equal(list.bulleted_list_item.children[0].type, 'bulleted_list_item', 'con lồng trong mục');
    const table = out.blocks.find((b) => b.type === 'table') as any;
    assert.equal(table.table.table_width, 3);
    assert.equal(table.table.has_column_header, true);
    assert.equal(table.table.children.length, 2);
  });

  it('mark ⇒ annotations; link chỉ http(s)', () => {
    const rich = inlineToRich([
      { type: 'text', text: 'đậm', marks: [{ type: 'bold' }] },
      { type: 'text', text: 'link', marks: [{ type: 'link', attrs: { href: 'https://a.example' } }] },
      { type: 'text', text: 'xấu', marks: [{ type: 'link', attrs: { href: 'javascript:x' } }] },
      { type: 'hardBreak' },
      { type: 'mention', attrs: { label: 'Lan' } },
    ]);
    assert.equal(rich[0].annotations?.bold, true);
    assert.equal(rich[1].text?.link?.url, 'https://a.example');
    assert.equal(rich[2].text?.link, null);
    assert.ok(rich.map((r) => r.text?.content).join('').includes('\n@Lan'));
  });

  it('chữ dài > 2000 ký tự bị chia mẩu', () => {
    const long = 'x'.repeat(4500);
    const out = tiptapToNotion({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: long }] }] });
    const rt = (out.blocks[0] as any).paragraph.rich_text as Array<{ text: { content: string } }>;
    assert.equal(rt.length, 3);
    assert.ok(rt.every((x) => x.text.content.length <= 2000));
    assert.equal(rt.map((x) => x.text.content).join(''), long);
  });

  it('lồng quá 2 tầng ⇒ trải phẳng có thụt; heading 4 ⇒ heading_3; ảnh không tải được ⇒ chữ + cảnh báo', () => {
    const li = (t: string, kids?: PmNode) => ({ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: t }] }, ...(kids ? [kids] : [])] });
    const deep = { type: 'bulletList', content: [li('1', { type: 'bulletList', content: [li('2', { type: 'bulletList', content: [li('3', { type: 'bulletList', content: [li('4')] })] })] })] };
    const out = tiptapToNotion({ type: 'doc', content: [deep, { type: 'heading', attrs: { level: 4 }, content: [{ type: 'text', text: 'H4' }] }, { type: 'image', attrs: { src: '/api/v1/work/projects/7/images/1', alt: 'Sơ đồ' } }] });
    const l1 = out.blocks[0] as any;
    const l2 = l1.bulleted_list_item.children[0];
    const l3 = l2.bulleted_list_item.children;
    assert.equal(l3.length, 2, 'tầng 4 trải lên cạnh tầng 3 (Notion chỉ nhận 2 tầng con mỗi lần tạo)');
    assert.equal(l3[0].bulleted_list_item.children, undefined);
    assert.equal(l3[1].bulleted_list_item.rich_text[0].text.content, '  ', 'giữ thụt bằng chữ');
    assert.equal(out.blocks[1].type, 'heading_3');
    assert.equal(out.blocks[2].type, 'paragraph');
    assert.ok(out.warnings.some((w) => w.includes('Sơ đồ')));
  });

  it('chia lô 100', () => {
    assert.deepEqual(chunkBlocks([...Array(250).keys()]).map((c) => c.length), [100, 100, 50]);
  });
});

describe('Database Notion ⇒ bảng nhập', () => {
  it('bảng có cột Notion ID + thuộc tính; gợi ý ghép theo kiểu; parseTable đọc đúng', () => {
    const table = notionRowsToTable(db.schema, db.rows);
    assert.deepEqual(table[0], ['Notion ID', 'Name', 'Status', 'Assignee', 'Due', 'Tags', 'Priority', 'Points', 'Notes']);
    assert.equal(table[1][0], 'aaaaaaaa-0000-0000-0000-000000000001');
    assert.equal(table[1][5], 'ui, auth');
    const m = suggestNotionMapping(db.schema.filter((s) => s.type !== 'files'));
    assert.equal(m.externalId, 0);
    assert.equal(m.title, 1);
    assert.equal(m.status, 2);
    assert.equal(m.assignee, 3);
    assert.equal(m.due, 4);
    assert.equal(m.labels, 5);
    assert.equal(m.priority, 6);
    assert.equal(m.storyPoints, 7);
    assert.equal(m.description, 8);
    const parsed = parseTable(table, m as never);
    assert.equal(parsed.items.length, 2);
    assert.equal(parsed.items[0].externalId, 'aaaaaaaa-0000-0000-0000-000000000001');
    assert.equal(parsed.items[0].title, 'Thiết kế màn đăng nhập');
    assert.equal(parsed.items[0].due, '2026-10-20');
    assert.deepEqual(parsed.items[0].labels, ['ui', 'auth']);
    assert.equal(parsed.items[0].storyPoints, 3);
    assert.equal(parsed.items[1].statusCategory, 'DONE');
  });
});
