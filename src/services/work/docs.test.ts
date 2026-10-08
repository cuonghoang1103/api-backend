/**
 * Tài liệu dự án (đợt S2a) — phần THUẦN, chạy trong `npm test`:
 *   - 36 mẫu THẬT: Markdown → TipTap không lỗi, hợp lệ với schema của trình soạn
 *     thảo tài liệu (dựng bằng chính các extension TipTap trong repo), có tiêu đề
 *     và đề mục; xuất ngược ra Markdown còn đủ đề mục;
 *   - nguồn mẫu cho backend (content/quy-trinh/mau) ĐỒNG BỘ với bản web
 *     (frontend/public/quy-trinh/mau) và với DOCS trong data.ts của /about/quy-trinh;
 *   - ánh xạ mẫu ↔ giai đoạn đọc từ client-project-template.json phủ đủ 35 mẫu;
 *   - quyền xem/sửa tài liệu theo vai + chế độ hiển thị (docAccess);
 *   - so sánh dòng.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { getSchema } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Image from '@tiptap/extension-image';
import { Node as PmNodeClass } from '@tiptap/pm/model';

import type { ProjectRole, WorkspaceRole } from './constants.js';
import { lineDiff, markdownToTiptap, safeHref, tiptapToMarkdown, MAX_HEADING, type PmNode } from './docMarkdown.js';
import { listTemplates, stageTemplateMap, getTemplate } from './docTemplates.js';
import { canManagePage, canViewPage, docAccess } from './permissions.js';

const BACKEND_DIR = path.resolve('content/quy-trinh/mau');
const WEB_DIR = path.resolve('frontend/public/quy-trinh/mau');
const DATA_TS = path.resolve('frontend/src/app/about/quy-trinh/data.ts');

/** Cùng bộ extension với RichEditor chế độ `docs` (frontend/src/components/work/RichEditor.tsx). */
const schema = getSchema([
  StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
  Link, TaskList, TaskItem.configure({ nested: true }), Table, TableRow, TableHeader, TableCell,
  // CTW đợt 3A: ảnh khối (RichEditor bật Image cho mọi chế độ).
  Image,
]);

const mdFiles = fs.readdirSync(BACKEND_DIR).filter((f) => f.endsWith('.md')).sort();

function walk(n: PmNode, fn: (n: PmNode) => void) {
  fn(n);
  for (const c of n.content ?? []) walk(c, fn);
}

describe('mẫu tài liệu: Markdown → TipTap (36 mẫu thật)', () => {
  // CTW đợt 3A: +7 mẫu FPT Capstone (Report 1, 2, 3, 4, 5.0, 6, 7) — xem docTemplates.test.ts.
  it('có đủ 45 tệp mẫu', () => assert.equal(mdFiles.length, 45));

  for (const f of mdFiles) {
    it(f, () => {
      const md = fs.readFileSync(path.join(BACKEND_DIR, f), 'utf8');
      const { title, doc } = markdownToTiptap(md);
      assert.ok(title.length > 3, 'có tiêu đề # đầu tệp');
      // Hợp lệ với schema thật của editor — nút lạ / bảng méo / listItem sai đều ném ở đây.
      PmNodeClass.fromJSON(schema, doc).check();
      let headings = 0;
      let rows = 0;
      walk(doc, (n) => {
        if (n.type === 'heading') {
          headings++;
          assert.ok(Number(n.attrs?.level) >= 1 && Number(n.attrs?.level) <= MAX_HEADING);
        }
        if (n.type === 'table') {
          const widths = (n.content ?? []).map((r) => r.content?.length ?? 0);
          assert.ok(widths.every((w) => w === widths[0]), 'bảng chữ nhật');
          rows += widths.length;
        }
      });
      assert.ok(headings >= 2, `có đề mục (thấy ${headings})`);
      if (/^\|.*\|\s*$/m.test(md)) assert.ok(rows > 0, 'bảng Markdown ⇒ bảng TipTap');
      // Bỏ tiêu đề cho trang: nút đầu không còn là H1.
      const dropped = markdownToTiptap(md, { dropTitle: true }).doc;
      assert.notEqual(dropped.content?.[0]?.type === 'heading' && dropped.content?.[0]?.attrs?.level === 1, true);
      // Xuất ngược: còn tiêu đề và đủ số đề mục.
      const back = tiptapToMarkdown(doc);
      assert.equal((back.match(/^#{1,4} /gm) ?? []).length, headings);
    });
  }

  it('checklist "- [ ]" ⇒ taskList; liên kết lạ bị gỡ, liên kết http giữ', () => {
    const { doc } = markdownToTiptap('# T\n\n- [ ] a\n- [x] b\n\n[ok](https://cuongthai.com) [bad](javascript:alert(1))');
    assert.equal(doc.content?.[1]?.type, 'taskList');
    assert.equal(doc.content?.[1]?.content?.[1]?.attrs?.checked, true);
    const links: string[] = [];
    walk(doc, (n) => n.marks?.forEach((m) => m.type === 'link' && links.push(String(m.attrs?.href))));
    assert.deepEqual(links, ['https://cuongthai.com']);
    assert.equal(safeHref('javascript:alert(1)'), null);
    assert.equal(safeHref('/about/quy-trinh'), '/about/quy-trinh');
  });

  it('##### gộp về mức 4; HTML thô chỉ thành chữ', () => {
    const { doc } = markdownToTiptap('##### Deep\n\n<script>alert(1)</script>');
    assert.equal(doc.content?.[0]?.attrs?.level, 4);
    walk(doc, (n) => assert.notEqual(n.type, 'html'));
    PmNodeClass.fromJSON(schema, doc).check();
  });
});

describe('nguồn mẫu cho backend (ảnh Docker không có frontend/public)', () => {
  it('content/quy-trinh/mau/*.md GIỐNG HỆT frontend/public/quy-trinh/mau/*.md', () => {
    const web = fs.readdirSync(WEB_DIR).filter((f) => f.endsWith('.md')).sort();
    assert.deepEqual(mdFiles, web, 'cùng danh sách tệp — chạy: cp frontend/public/quy-trinh/mau/*.md content/quy-trinh/mau/');
    for (const f of web) {
      assert.equal(fs.readFileSync(path.join(BACKEND_DIR, f), 'utf8'), fs.readFileSync(path.join(WEB_DIR, f), 'utf8'), `${f} lệch — chép lại từ frontend/public`);
    }
  });

  it('catalog.json khớp DOCS của /about/quy-trinh (data.ts) + phủ mọi tệp', () => {
    const data = fs.readFileSync(DATA_TS, 'utf8');
    const docs = [...data.matchAll(/T\('([a-z0-9-]+)', '([^']*)', '([^']*)'\)/g)].map((m) => ({ key: m[1], titleVi: m[2], titleEn: m[3] }));
    assert.equal(docs.length, 37);
    const cat = JSON.parse(fs.readFileSync(path.join(BACKEND_DIR, 'catalog.json'), 'utf8')) as { templates: Array<{ key: string; titleVi: string; titleEn: string }> };
    for (const d of docs) assert.deepEqual(cat.templates.find((t) => t.key === d.key), d, d.key);
    assert.deepEqual(cat.templates.map((t) => `${t.key}.md`).sort(), mdFiles);
  });

  it('thư viện mẫu: 36 mẫu, tên tiếng Anh; 35 mẫu của quy trình đều thuộc ít nhất một giai đoạn', async () => {
    const list = await listTemplates();
    assert.equal(list.length, 45);
    assert.ok(list.every((t) => t.title && t.sections > 0));
    const stageMap = await stageTemplateMap();
    assert.equal(stageMap.size, 21);
    const used = new Set([...stageMap.values()].flatMap((v) => v.keys));
    assert.equal(used.size, 37);
    for (const k of used) assert.ok(list.some((t) => t.key === k), `giai đoạn trỏ tới mẫu không có tệp: ${k}`);
    const srs = await getTemplate('srs');
    assert.deepEqual(srs.stages.map((s) => s.slug), ['dac-ta-yeu-cau']);
    assert.notEqual(srs.doc.content?.[0]?.attrs?.level, 1, 'trang mẫu bỏ tiêu đề # (ô tiêu đề riêng)');
  });
});

describe('quyền tài liệu theo vai + chế độ hiển thị (docAccess)', () => {
  // [vai dự án, vai không gian, thấy INTERNAL, thấy CLIENT, sửa, quản lý]
  const rows: Array<[ProjectRole, WorkspaceRole, boolean, boolean, boolean, boolean]> = [
    ['ADMIN', 'OWNER', true, true, true, true],
    ['ADMIN', 'MEMBER', true, true, true, true],
    ['MEMBER', 'MEMBER', true, true, true, false],
    ['VIEWER', 'MEMBER', true, true, false, false],
    // Giảng viên là GUEST của không gian nhưng đọc được MỌI trang (chấm đồ án), không sửa.
    ['TEACHER', 'GUEST', true, true, false, false],
    ['CLIENT', 'GUEST', false, true, false, false],
    ['CLIENT', 'MEMBER', false, true, false, false],
    // Khách không gian được cho vai MEMBER trong dự án: vẫn là khách với tài liệu.
    ['MEMBER', 'GUEST', false, true, false, false],
  ];
  for (const [role, ws, internal, client, edit, manage] of rows) {
    it(`${role}/${ws}`, () => {
      assert.equal(canViewPage(role, ws, 'INTERNAL'), internal);
      assert.equal(canViewPage(role, ws, 'CLIENT'), client);
      assert.equal(docAccess(role, ws).edit, edit);
      assert.equal(docAccess(role, ws).manage, manage);
    });
  }
  it('người ngoài không thấy gì', () => {
    assert.equal(canViewPage(null, null, 'CLIENT'), false);
    assert.deepEqual(docAccess(null, 'MEMBER'), { view: null, edit: false, manage: false });
  });
  it('chủ trang (còn quyền sửa) hoặc ADMIN mới xoá/khôi phục', () => {
    assert.equal(canManagePage('MEMBER', 'MEMBER', 7, 7), true);
    assert.equal(canManagePage('MEMBER', 'MEMBER', 7, 8), false);
    assert.equal(canManagePage('ADMIN', 'MEMBER', 7, 8), true);
    assert.equal(canManagePage('VIEWER', 'MEMBER', 7, 7), false, 'chủ cũ bị hạ VIEWER thì mất quyền');
    assert.equal(canManagePage('CLIENT', 'GUEST', 7, 7), false);
  });
});

describe('so sánh dòng', () => {
  it('thêm/xoá đúng chỗ, phần chung giữ eq', () => {
    const d = lineDiff('a\nb\nc\nd', 'a\nB\nc\nd\ne');
    assert.equal(d.added, 2);
    assert.equal(d.removed, 1);
    assert.deepEqual(d.lines.map((l) => `${l.op}:${l.text}`), ['eq:a', 'del:b', 'add:B', 'eq:c', 'eq:d', 'add:e']);
  });
  it('giống hệt ⇒ không thêm không xoá', () => {
    const d = lineDiff('x\ny', 'x\ny');
    assert.equal(d.added + d.removed, 0);
  });
  it('tài liệu lớn khác hẳn nhau vẫn trả nhanh (không dựng bảng LCS khổng lồ)', () => {
    const big = (p: string) => Array.from({ length: 5000 }, (_, i) => `${p}${i}`).join('\n');
    const t = Date.now();
    const d = lineDiff(big('a'), big('b'));
    assert.equal(d.removed, 5000);
    assert.ok(Date.now() - t < 2000);
  });
});
