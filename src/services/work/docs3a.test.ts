/**
 * CTW đợt 3A — phần THUẦN (chạy trong `npm test`): ảnh trong Markdown ⇄ TipTap, xuất .docx/PDF (mở lại tệp .docx bằng
 * jszip, đọc document.xml), Record of Changes từ lịch sử phiên bản, "Fill from project data" trên mẫu Report 2 thật.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import JSZip from 'jszip';
import sharp from 'sharp';
import { markdownToTiptap, safeImageSrc, tiptapToMarkdown, type PmNode } from './docMarkdown.js';
import { fitImage, isGuideNote, pdfSafe, plainText, prepareDoc, renderDocx, renderPdf, ANCHOR_RE, type ExportImage } from './docExport.js';
import { recordOfChanges, replaceTableAfterHeading, scheduleTable, tableRowsText, buildTable, raciTable } from './docFill.js';
import { applyFill } from './docs3a.service.js';
import { getTemplate } from './docTemplates.js';

const IMG = '/api/v1/work/projects/7/images/3';

describe('ảnh + Mermaid trong Markdown ⇄ TipTap', () => {
  it('ảnh đứng riêng ⇒ nút image; xuất ngược ra ![alt](src)', () => {
    const { doc } = markdownToTiptap(`# T\n\n![Use case diagram](${IMG})\n\ntext ![x](${IMG}) inline`);
    assert.deepEqual(doc.content?.[1], { type: 'image', attrs: { src: IMG, alt: 'Use case diagram', title: null } });
    assert.equal(doc.content?.[2]?.type, 'paragraph', 'ảnh lẫn trong chữ vẫn là đoạn');
    assert.match(tiptapToMarkdown(doc), /!\[Use case diagram\]\(\/api\/v1\/work\/projects\/7\/images\/3\)/);
  });
  it('nguồn ảnh lạ bị chặn (data:, javascript:, http thường, đường lạ)', () => {
    for (const bad of ['data:image/png;base64,AAAA', 'javascript:alert(1)', 'http://x.y/a.png', '/api/v1/other/1', '/api/v1/work/projects/1/images/1?x']) assert.equal(safeImageSrc(bad), null, bad);
    assert.equal(safeImageSrc('https://cdn.example.com/a.png'), 'https://cdn.example.com/a.png');
    const { doc } = markdownToTiptap('![x](javascript:alert(1))');
    assert.notEqual(doc.content?.[0]?.type, 'image');
  });
  it('```mermaid giữ hai chiều', () => {
    const { doc } = markdownToTiptap('```mermaid\ngraph TD; A-->B\n```');
    assert.deepEqual(doc.content?.[0]?.attrs, { language: 'mermaid' });
    assert.match(tiptapToMarkdown(doc), /```mermaid\ngraph TD; A-->B\n```/);
  });
});

async function png(w: number, h: number): Promise<ExportImage> {
  return { buffer: await sharp({ create: { width: w, height: h, channels: 3, background: { r: 20, g: 90, b: 160 } } }).png().toBuffer(), type: 'png', width: w, height: h };
}

const META = { title: 'Report 2 – Project Management Plan', projectName: 'Hệ thống quản lý phòng lab', projectKey: 'LAB', docLabel: 'DOC-4', version: 3, date: new Date('2026-10-09T03:00:00Z'), capstone: true };

async function sampleDoc(): Promise<PmNode> {
  const doc = JSON.parse(JSON.stringify((await getTemplate('fpt-report2-project-management-plan')).doc)) as PmNode;
  doc.content!.push(
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '6. Diagrams' }] },
    { type: 'image', attrs: { src: IMG, alt: 'Figure 1. Context diagram' } },
    { type: 'image', attrs: { src: 'https://example.com/x.png', alt: 'external' } },
    { type: 'codeBlock', attrs: { language: 'mermaid' }, content: [{ type: 'text', text: 'graph TD; A-->B' }] },
    { type: 'codeBlock', attrs: { language: 'mermaid' }, content: [{ type: 'text', text: 'sequenceDiagram; A->>B: hi' }] },
    { type: 'codeBlock', attrs: { language: 'java' }, content: [{ type: 'text', text: 'public class LabService {\n  // ghi chú tiếng Việt\n}' }] },
    { type: 'orderedList', attrs: { start: 1 }, content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Bước một', marks: [{ type: 'bold' }] }] }] }] },
  );
  return doc;
}

describe('xuất Word (.docx)', () => {
  it('đề mục là Heading thật + bookmark, mục lục TOC có sẵn mục, bảng/ảnh/code giữ đúng, ghi chú Guide bị bỏ', async () => {
    const doc = await sampleDoc();
    const p = prepareDoc(doc, { stripGuides: true });
    assert.ok(p.headings.every((h) => ANCHOR_RE.test(h.anchor) && h.anchor.length <= 40));
    assert.equal(p.mermaidIndex.size, 2);
    assert.ok(!p.blocks.some(isGuideNote));
    const img = await png(1600, 800);
    const buf = await renderDocx(doc, META, { resolveImage: async (src) => (src === IMG ? img : null), diagrams: [await png(400, 300), null] });
    const zip = await JSZip.loadAsync(buf);
    const xml = await zip.file('word/document.xml')!.async('string');
    for (const h of ['I. Record of Changes', 'II. Project Management Plan', '1.1 Cost &amp; Time Estimations', '5.3 Tools &amp; Infrastructures', '6. Diagrams']) assert.ok(xml.includes(h), h);
    assert.equal((xml.match(/<w:pStyle w:val="Heading1"\/>/g) ?? []).length, 2);
    assert.equal((xml.match(/<w:pStyle w:val="Heading3"\/>/g) ?? []).length, 9);
    assert.match(xml, /TOC \\h \\o &quot;1-4&quot;/);
    assert.match(xml, /w:anchor="_Toc_ctw1"/);
    const ids = [...xml.matchAll(/<w:bookmarkStart w:name="(_Toc_ctw\d+)" w:id="(\d+)"\/>/g)].map((m) => m[2]);
    assert.equal(ids.length, p.headings.length, 'mỗi đề mục một bookmark');
    assert.equal(new Set(ids).size, ids.length, 'w:id của bookmark không trùng');
    assert.equal((xml.match(/<w:tbl>/g) ?? []).length, 8, '8 bảng của Report 2');
    assert.equal((xml.match(/<w:drawing>/g) ?? []).length, 2, 'ảnh của dự án + 1 sơ đồ Mermaid đã vẽ');
    assert.ok(xml.includes('[Image: external — https://example.com/x.png]'));
    assert.ok(xml.includes('sequenceDiagram; A-&gt;&gt;B: hi'), 'sơ đồ client không vẽ được ⇒ in mã nguồn');
    assert.ok(xml.includes('// ghi chú tiếng Việt'));
    assert.ok(!xml.includes('Guide:'), 'ghi chú hướng dẫn không lọt vào bản nộp');
    assert.ok(xml.includes('CAPSTONE PROJECT REPORT'));
    assert.equal(Object.values(zip.files).filter((f) => !f.dir && f.name.startsWith('word/media/')).length, 2);
  });
  it('ảnh quá rộng thu về khung trang, giữ tỉ lệ', () => {
    assert.deepEqual(fitImage(1600, 800, 600), { width: 600, height: 300 });
    assert.deepEqual(fitImage(300, 200, 600), { width: 300, height: 200 });
    assert.deepEqual(fitImage(500, 4000, 600, 820), { width: 103, height: 820 });
  });
});

describe('xuất PDF', () => {
  it('là PDF nhiều trang, có outline + liên kết mục lục, ảnh nhúng', async () => {
    const doc = await sampleDoc();
    const buf = await renderPdf(doc, META, { resolveImage: async () => png(800, 400), diagrams: [await png(400, 300)] });
    assert.equal(buf.subarray(0, 5).toString(), '%PDF-');
    const s = buf.toString('latin1');
    const pages = (s.match(/\/Type \/Page\b/g) ?? []).length;
    assert.ok(pages >= 4 && pages <= 12, `số trang hợp lý (${pages})`);
    assert.match(s, /\/Outlines/);
    assert.match(s, /_Toc_ctw1/);
    assert.ok((s.match(/\/Subtype \/Image/g) ?? []).length >= 2);
  });
  it('ký tự ngoài font nhúng (mũi tên, ô tích) đổi sang chữ thường — không in ô trống', () => {
    assert.equal(pdfSafe('SRS v0.9 → v1.2 ☑ ≤ 5'), 'SRS v0.9 -> v1.2 [x] <= 5');
    assert.equal(pdfSafe('Tiếng Việt có dấu'), 'Tiếng Việt có dấu');
  });
});

describe('Record of Changes từ lịch sử phiên bản (A10)', () => {
  const h = (t: string, l = 2): PmNode => ({ type: 'heading', attrs: { level: l }, content: [{ type: 'text', text: t }] });
  const para = (t: string): PmNode => ({ type: 'paragraph', content: [{ type: 'text', text: t }] });
  const d = (...c: PmNode[]) => ({ type: 'doc', content: c });
  const at = (s: string) => new Date(`${s}T10:00:00`);
  it('A cho bản đầu, A/D theo đề mục thêm/xoá, M khi sửa nội dung; ghi chú phiên bản thay mô tả', () => {
    const rows = recordOfChanges([
      { n: 1, kind: 'CREATE', note: 'Created from template “X”', createdAt: at('2026-09-01'), author: 'Cuong', contentJson: d(h('1. Overview'), para('a')) },
      { n: 2, kind: 'EDIT', note: null, createdAt: at('2026-09-03'), author: 'An', contentJson: d(h('1. Overview'), para('a'), h('2. Scope'), para('b')) },
      { n: 3, kind: 'EDIT', note: null, createdAt: at('2026-09-05'), author: 'Cuong', contentJson: d(h('1. Overview'), para('a2'), h('2. Scope'), para('b')) },
      { n: 4, kind: 'MANUAL', note: 'v1.0 sent to supervisor', createdAt: at('2026-09-06'), author: 'Cuong', contentJson: d(h('1. Overview'), para('a2')) },
      { n: 5, kind: 'RESTORE', note: null, createdAt: at('2026-09-07'), author: 'An', contentJson: d(h('1. Overview'), para('a')) },
    ]);
    assert.deepEqual(rows.map((r) => `${r.date}|${r.action}|${r.inCharge}|${r.description}`), [
      '01/09/2026|A|Cuong|First version: 1. Overview',
      '03/09/2026|A|An|Added 2. Scope',
      '05/09/2026|M|Cuong|Updated 1. Overview',
      '06/09/2026|D|Cuong|v1.0 sent to supervisor',
      '07/09/2026|M|An|Restored an earlier version',
    ]);
  });
});

describe('Fill from project data (Report 2 thật)', () => {
  it('thay đúng bảng sau đề mục; không có dữ liệu ⇒ giữ nguyên mẫu', async () => {
    const doc = JSON.parse(JSON.stringify((await getTemplate('fpt-report2-project-management-plan')).doc)) as PmNode;
    const filled = applyFill(doc, {
      changes: [{ date: '01/10/2026', action: 'A', inCharge: 'Cuong', description: 'First version' }],
      team: [{ name: 'Cuong', role: 'Leader' }, { name: 'An', role: 'Member' }, { name: 'Thầy Dũng', role: 'Lecturer' }],
      risks: [{ title: 'Requirement churn', description: 'Lecturer changes scope', probability: 3, impact: 5, mitigation: 'Freeze SRS v1.0 with sign-off', response: 'MITIGATE' }],
      stages: [{ n: 1, name: 'Project Initiating', issues: [{ title: 'Report 1 — Project Introduction', isEpic: true, effortDays: 7, due: new Date('2026-10-12T00:00:00') }] }],
      versions: [{ name: 'Software Package v1', releaseDate: new Date('2026-11-20T00:00:00'), status: 'UNRELEASED' }],
    });
    assert.deepEqual(filled, ['recordOfChanges', 'risks', 'schedule', 'raci']);
    const tables = (doc.content ?? []).filter((b) => b.type === 'table').map(tableRowsText);
    assert.deepEqual(tables[0][1], ['01/10/2026', 'A', 'Cuong', 'First version']);
    assert.deepEqual(tables[1].slice(1), [['1', 'Stage 1: Project Initiating', '7', '12/10/2026'], ['1.1', 'Report 1 — Project Introduction', '7', '12/10/2026'], ['2', 'Milestones (releases)', '', ''], ['2.1', 'Software Package v1', '', '20/11/2026']]);
    assert.deepEqual(tables[3][1], ['1', 'Requirement churn — Lecturer changes scope', 'High', 'Medium', 'Freeze SRS v1.0 with sign-off']);
    const raci = tables.find((t) => t[0][0] === 'Work Package')!;
    assert.deepEqual(raci[0], ['Work Package', 'Cuong', 'An'], 'giảng viên không có cột RACI');
    assert.equal(raci[1][0], 'Project Planning & Tracking', 'giữ các dòng work package của mẫu');
    // Report 2 KHÔNG có bảng Project Team ⇒ không chèn bừa.
    const empty = JSON.parse(JSON.stringify((await getTemplate('fpt-report2-project-management-plan')).doc)) as PmNode;
    assert.deepEqual(applyFill(empty, { changes: [], team: [], risks: [], stages: [], versions: [] }), []);
  });
  it('Report 1: bảng Project Team lấy thành viên', async () => {
    const doc = JSON.parse(JSON.stringify((await getTemplate('fpt-report1-project-introduction')).doc)) as PmNode;
    assert.deepEqual(applyFill(doc, { changes: [], team: [{ name: 'Cuong', role: 'Leader' }], risks: [], stages: [], versions: [] }), ['team']);
    const team = (doc.content ?? []).filter((b) => b.type === 'table').map(tableRowsText).find((t) => t[0][0] === 'Full Name')!;
    assert.deepEqual(team, [['Full Name', 'Role', 'Email', 'Mobile'], ['Cuong', 'Leader', '', '']]);
  });
  it('đề mục không có bảng ⇒ chèn bảng ngay sau đề mục; đề mục khác tên ⇒ không đụng', () => {
    const doc: PmNode = { type: 'doc', content: [{ type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: '1.3 Project Risks' }] }, { type: 'paragraph' }, { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Other' }] }] };
    assert.equal(replaceTableAfterHeading(doc, /^Project Risks$/i, () => buildTable(['#'], [['1']])), 1);
    assert.equal(doc.content?.[1]?.type, 'table');
    assert.equal(replaceTableAfterHeading(doc, /^Nope$/i, () => buildTable(['#'], [])), 0);
    assert.equal(plainText(scheduleTable([], [])), '#Work PackageEst. Effort (pds)Deadline');
    assert.equal(raciTable(null, []), null);
  });
});
