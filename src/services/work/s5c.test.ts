/**
 * CT Work đợt S5c — luật thuần: mô-đun "chưa quyết", thay mục trang Docs theo tiêu đề, gốc của lần xoá trang,
 * kiểm toàn vẹn ZIP xuất trọn, ánh xạ người theo email băm. Chạy trong `npm test` (không cần DB).
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import JSZip from 'jszip';
import { Prisma } from '@prisma/client';

import { applyKindDefaultsToUndecided, toggledKeysFrom, undecidedModules } from './moduleUpgrade.js';
import { noModules } from './studio.js';
import { normHeading, replaceSection, type PmNode } from './docSections.js';
import { deletionRoots, sameDeletionSubtree } from './pageTrash.service.js';
import { analyzeZip, mapPeople, SKIPPED_TABLES } from './projectImport.service.js';
import { EXPORT_TABLES, emailHash, sha256Hex } from './projectExport.service.js';

const P = (t: string): PmNode => ({ type: 'paragraph', content: [{ type: 'text', text: t }] });
const H = (level: number, t: string): PmNode => ({ type: 'heading', attrs: { level }, content: [{ type: 'text', text: t }] });
const texts = (d: PmNode) => (d.content ?? []).map((n) => `${n.type === 'heading' ? `h${n.attrs?.level}:` : ''}${(n.content ?? []).map((c) => c.text).join('')}`);

describe('S5c — mô-đun chưa quyết (Enable all recommended)', () => {
  const s1Era = new Date('2026-10-04T12:00:00+07:00');
  const after = new Date('2026-10-06T00:00:00+07:00');

  it('dự án cũ không có settings.modules ⇒ mọi khoá chưa quyết', () => {
    assert.equal(undecidedModules(undefined, new Date('2026-01-01'), new Set()).length, 12);
  });
  it('dự án tạo ở S1: docs=false là chỗ giữ (chưa quyết); reports/serviceDesk thiếu khoá; teams=true đã quyết', () => {
    const raw = { teams: true, stages: true, approvals: true, handoffs: true, docs: false, clientPortal: false, changeRequests: false, raid: false, meetings: false, finance: false };
    const u = undecidedModules(raw, s1Era, new Set());
    assert.deepEqual(u.sort(), ['changeRequests', 'clientPortal', 'docs', 'finance', 'meetings', 'raid', 'reports', 'serviceDesk'].sort());
  });
  it('khoá ai đó đã bật/tắt tay (audit) ⇒ đã quyết, không đụng', () => {
    const toggled = toggledKeysFrom(['Modules: docs off, raid on', 'Changed project type to CLIENT']);
    assert.deepEqual([...toggled].sort(), ['docs', 'raid']);
    const u = undecidedModules({ docs: false, raid: false }, s1Era, toggled);
    assert.ok(!u.includes('docs') && !u.includes('raid'));
    // "finance" không bị nhầm thành khoá khác.
    assert.equal(toggledKeysFrom(['Modules: serviceDesk on']).has('teams'), false);
  });
  it('false của dự án tạo SAU ngày mô-đun ra đời ⇒ người tạo đã bỏ chọn ⇒ đã quyết', () => {
    assert.deepEqual(undecidedModules({ ...noModules() }, after, new Set()), []);
  });
  it('áp mặc định CLIENT chỉ cho khoá chưa quyết; khoá đã quyết y nguyên', () => {
    const cur = { ...noModules(), teams: true };
    const { next, enabled } = applyKindDefaultsToUndecided(cur, 'CLIENT', ['docs', 'serviceDesk']);
    assert.deepEqual(enabled.sort(), ['docs', 'serviceDesk']);
    assert.equal(next.raid, false, 'raid đã quyết (không trong danh sách) ⇒ giữ tắt');
    assert.equal(next.teams, true);
    const school = applyKindDefaultsToUndecided(noModules(), 'SCHOOL', ['docs']);
    assert.deepEqual(school.enabled, []);
  });
});

describe('S5c — thay một mục của trang Docs', () => {
  const doc: PmNode = { type: 'doc', content: [H(1, 'SRS'), P('intro'), H(2, '1. Scope'), P('old scope'), H(3, '1.1 Detail'), P('detail'), H(2, '2. Functional requirements'), P('fr')] };
  it('chuẩn hoá tiêu đề: bỏ số mục, hoa/thường, dấu cuối', () => {
    assert.equal(normHeading('1. Scope:'), 'scope');
    assert.equal(normHeading('  2.1   Functional  Requirements '), 'functional requirements');
  });
  it('replace thay tới heading cùng/cao hơn mức (mục con đi theo), giữ phần khác', () => {
    const r = replaceSection(doc, 'scope', [P('new scope')]);
    assert.equal(r.found, true);
    assert.equal(r.replacedBlocks, 3);
    assert.deepEqual(texts(r.doc), ['h1:SRS', 'intro', 'h2:1. Scope', 'new scope', 'h2:2. Functional requirements', 'fr']);
  });
  it('append nối vào cuối mục; nội dung mở đầu bằng chính tiêu đề ⇒ không lặp tiêu đề', () => {
    const r = replaceSection(doc, '2. Functional requirements', [H(2, 'Functional requirements'), P('FR-9')], 'append');
    assert.deepEqual(texts(r.doc).slice(-3), ['h2:2. Functional requirements', 'fr', 'FR-9']);
  });
  it('không thấy mục ⇒ thêm heading mức 2 + nội dung ở cuối; trang rỗng không giữ đoạn trống', () => {
    const r = replaceSection(doc, 'Glossary', [P('API: …')]);
    assert.equal(r.found, false);
    assert.deepEqual(texts(r.doc).slice(-2), ['h2:Glossary', 'API: …']);
    const empty = replaceSection({ type: 'doc', content: [{ type: 'paragraph' }] }, 'Notes', [P('x')]);
    assert.deepEqual(texts(empty.doc), ['h2:Notes', 'x']);
  });
});

describe('S5c — thùng rác Docs: gốc của mỗi lần xoá', () => {
  const t1 = new Date('2026-10-05T01:00:00Z');
  const t2 = new Date('2026-10-05T02:00:00Z');
  const rows = [
    { id: 1, parentId: null, deletedAt: t2 }, // gốc lần xoá t2
    { id: 2, parentId: 1, deletedAt: t2 },
    { id: 3, parentId: 2, deletedAt: t2 },
    { id: 4, parentId: 1, deletedAt: t1 }, // con bị xoá RIÊNG trước đó ⇒ gốc riêng
    { id: 5, parentId: 99, deletedAt: t1 }, // cha còn sống
  ];
  it('gốc = cha null / cha không bị xoá / cha bị xoá lúc khác', () => {
    assert.deepEqual(deletionRoots(rows).map((r) => r.id).sort(), [1, 4, 5]);
  });
  it('cây con chỉ gồm trang cùng lần xoá', () => {
    assert.deepEqual(sameDeletionSubtree(rows, rows[0]).map((r) => r.id).sort(), [1, 2, 3]);
  });
});

describe('S5c — nhập lại: kiểm ZIP + ánh xạ người', () => {
  async function mkZip(mut?: (m: Record<string, unknown>, z: JSZip) => void): Promise<Buffer> {
    const z = new JSZip();
    const data: Record<string, unknown[]> = { project: [{ id: 1, key: 'ABC', name: 'Demo' }], issues: [{ id: 5, number: 1 }], workflows: [], statuses: [], issueTypes: [] };
    const checksums: Record<string, string> = {};
    for (const [k, v] of Object.entries(data)) {
      const b = Buffer.from(JSON.stringify(v));
      checksums[`data/${k}.json`] = sha256Hex(b);
      z.file(`data/${k}.json`, b);
    }
    const m: Record<string, unknown> = { format: 'ctwork-project-export', formatVersion: 1, project: { id: 1, key: 'ABC', name: 'Demo' }, tables: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.length])), checksums };
    mut?.(m, z);
    z.file('manifest.json', JSON.stringify(m));
    return z.generateAsync({ type: 'nodebuffer' });
  }
  it('ZIP hợp lệ ⇒ đọc được, kiểm đủ checksum', async () => {
    const a = await analyzeZip(await mkZip());
    assert.equal(a.tables.issues.length, 1);
    assert.equal(a.checksumsVerified, 5);
  });
  it('không phải ZIP / thiếu manifest / sai format / phiên bản mới hơn ⇒ lỗi rõ ràng', async () => {
    await assert.rejects(analyzeZip(Buffer.from('hello')), (e: any) => e.code === 'WORK_IMPORT_BAD_FILE' && /not a ZIP/.test(e.message));
    const noManifest = await new JSZip().file('a.txt', 'x').generateAsync({ type: 'nodebuffer' });
    await assert.rejects(analyzeZip(noManifest), /manifest\.json is missing/);
    await assert.rejects(analyzeZip(await mkZip((m) => { m.format = 'jira'; })), /not a CT Work project export/);
    await assert.rejects(analyzeZip(await mkZip((m) => { m.formatVersion = 2; })), /newer version of CT Work/);
  });
  it('số dòng lệch manifest / checksum lệch ⇒ báo hỏng đúng tệp', async () => {
    await assert.rejects(analyzeZip(await mkZip((m) => { (m.tables as Record<string, number>).issues = 3; })), /data\/issues\.json has 1 rows but the manifest says 3/);
    await assert.rejects(analyzeZip(await mkZip((m) => { (m.checksums as Record<string, string>)['data/issues.json'] = 'x'.repeat(64); })), /data\/issues\.json does not match its checksum/);
  });
  it('ánh xạ người: email băm (muối) ⇒ đúng người; bản cũ không băm ⇒ chỉ cùng tài khoản (id + username)', () => {
    const salt = 'abc';
    const members = [{ id: 10, username: 'an', email: 'An@X.io' }, { id: 11, username: 'binh', email: 'b@x.io' }];
    const m = mapPeople([
      { id: 1, username: 'an_old', name: 'An', emailHash: emailHash(salt, 'an@x.io') },
      { id: 11, username: 'binh', name: 'Bình' },
      { id: 12, username: 'binh', name: 'Kẻ trùng tên' },
      { id: 2, username: 'ghost', name: 'Ghost', emailHash: emailHash(salt, 'ghost@x.io') },
    ], members, salt);
    assert.equal(m.get(1)?.to?.id, 10);
    assert.equal(m.get(1)?.how, 'email');
    assert.equal(m.get(11)?.how, 'same-account');
    assert.equal(m.get(12)?.to, null, 'trùng username nhưng khác id ⇒ KHÔNG khớp');
    assert.equal(m.get(2)?.to, null);
  });
  it('mọi bảng của bản xuất đều ánh xạ ra một model Prisma (hoặc nằm trong danh sách bỏ qua)', () => {
    const models = new Set(Prisma.dmmf.datamodel.models.map((x) => x.name));
    for (const [name, load] of EXPORT_TABLES) {
      const mm = /prisma\.(\w+)\.find/.exec(load.toString());
      assert.ok(mm, `không đọc được model của bảng ${name}`);
      const model = mm[1][0].toUpperCase() + mm[1].slice(1);
      assert.ok(models.has(model) || SKIPPED_TABLES[name], `bảng ${name} ⇒ ${model} không có trong lược đồ`);
    }
  });
});
