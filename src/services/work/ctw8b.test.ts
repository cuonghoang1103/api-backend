/**
 * CTW đợt 8b — luật thuần: chữ ký Slack, lệnh /ctwork, link unfurl, kỳ lịch gửi, bố cục + mẫu sẵn, biểu đồ SVG (chữ = đường),
 * vẽ PDF/DOCX báo cáo (font tiếng Việt). Không DB, không mạng.
 *   npx tsx --test src/services/work/ctw8b.test.ts
 */

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import sharp from 'sharp';
import { parseIssueLink, parseSlash, slackEsc, slackNoticeBlocks, slackSign, verifySlack } from './slackRules.js';
import {
  BUILTIN_KEYS, builtinTemplate, isoWeek, localWeekdayHour, parseLayout, periodFor, renderChartSvg, scheduleDue, textWidth, validEmail,
} from './reportBuilder.js';
import { renderReportDocx, renderReportPdf, type ResolvedReport } from './reportBuilderExport.js';

const SECRET = '8f14e45fceea167a5a36dedd4bea2543';

describe('Slack — chữ ký v0, chống phát lại', () => {
  const body = Buffer.from('token=x&team_id=T1&channel_id=C123ABC&text=new+S%E1%BB%ADa+l%E1%BB%97i');
  const now = Date.UTC(2026, 9, 12, 3, 0, 0);
  const ts = String(Math.floor(now / 1000));
  it('đúng chữ ký ⇒ ok + nonce ổn định', () => {
    const sig = slackSign(SECRET, ts, body);
    const v = verifySlack(SECRET, { signature: sig, timestamp: ts }, body, now);
    assert.equal(v.ok, true);
    const v2 = verifySlack(SECRET, { signature: sig, timestamp: ts }, body, now + 1000);
    assert.equal(v.ok && v2.ok && v.nonce === v2.nonce, true, 'cùng gói ⇒ cùng nonce (DB chặn lần hai)');
  });
  it('sai chữ ký / sai bí mật / sửa thân ⇒ BAD_SIGNATURE', () => {
    const sig = slackSign(SECRET, ts, body);
    assert.deepEqual(verifySlack('other-secret', { signature: sig, timestamp: ts }, body, now), { ok: false, reason: 'BAD_SIGNATURE' });
    assert.deepEqual(verifySlack(SECRET, { signature: sig, timestamp: ts }, Buffer.from(`${body}&x=1`), now), { ok: false, reason: 'BAD_SIGNATURE' });
    assert.deepEqual(verifySlack(SECRET, { signature: 'v0=zz', timestamp: ts }, body, now), { ok: false, reason: 'BAD_SIGNATURE' });
  });
  it('lệch giờ > 5 phút ⇒ STALE; thiếu header/bí mật ⇒ MISSING', () => {
    const old = String(Math.floor(now / 1000) - 301);
    assert.deepEqual(verifySlack(SECRET, { signature: slackSign(SECRET, old, body), timestamp: old }, body, now), { ok: false, reason: 'STALE' });
    assert.equal(verifySlack(SECRET, { signature: slackSign(SECRET, String(Math.floor(now / 1000) - 299), body), timestamp: String(Math.floor(now / 1000) - 299) }, body, now).ok, true);
    assert.deepEqual(verifySlack('', { signature: 'v0=a', timestamp: ts }, body, now), { ok: false, reason: 'MISSING' });
    assert.deepEqual(verifySlack(SECRET, { timestamp: ts }, body, now), { ok: false, reason: 'MISSING' });
  });
  it('lệnh /ctwork', () => {
    assert.deepEqual(parseSlash('new Sửa lỗi đăng nhập | bấm nút không chạy'), { kind: 'new', title: 'Sửa lỗi đăng nhập', details: 'bấm nút không chạy' });
    assert.deepEqual(parseSlash('new Chỉ tiêu đề'), { kind: 'new', title: 'Chỉ tiêu đề', details: null });
    assert.deepEqual(parseSlash('new Dòng 1\nchi tiết dòng 2'), { kind: 'new', title: 'Dòng 1', details: 'chi tiết dòng 2' });
    assert.deepEqual(parseSlash(''), { kind: 'help' });
    assert.deepEqual(parseSlash('new'), { kind: 'help' });
    assert.equal(parseSlash('delete everything').kind, 'unknown');
  });
  it('thoát mrkdwn — không ping cả kênh', () => {
    assert.equal(slackEsc('<!channel> & <@U1>'), '&lt;!channel&gt; &amp; &lt;@U1&gt;');
    const m = slackNoticeBlocks({ title: '<!here> boom', url: 'https://cuongthai.com/x', footer: 'P' });
    assert.ok(!JSON.stringify(m.blocks).includes('<!here>'));
  });
  it('link thẻ cần unfurl', () => {
    const hosts = ['cuongthai.com'];
    assert.deepEqual(parseIssueLink('https://cuongthai.com/work/lab-team/LFD/issue/12', hosts), { ws: 'lab-team', key: 'LFD', number: 12 });
    assert.deepEqual(parseIssueLink('https://cuongthai.com/work/lab-team/LFD/board?issue=7', hosts), { ws: 'lab-team', key: 'LFD', number: 7 });
    assert.equal(parseIssueLink('https://evil.com/work/lab-team/LFD/issue/12', hosts), null);
    assert.equal(parseIssueLink('https://cuongthai.com/work/lab-team/LFD/docs/3', hosts), null);
    assert.equal(parseIssueLink('javascript:alert(1)', hosts), null);
  });
});

describe('Lịch tự gửi — kỳ', () => {
  const s = { cadence: 'WEEKLY', weekday: 5, hour: 16, timezone: 'Asia/Ho_Chi_Minh', enabled: true };
  it('WEEKLY: đúng thứ + qua giờ ⇒ một khoá kỳ cho cả ngày (gửi bù)', () => {
    const fri1600 = new Date('2026-10-16T09:00:00Z'); // 16:00 VN thứ Sáu
    const fri2300 = new Date('2026-10-16T16:00:00Z'); // 23:00 VN
    const a = scheduleDue(s, fri1600);
    const b = scheduleDue(s, fri2300);
    assert.equal(a.due && b.due && a.periodKey === b.periodKey, true);
    assert.equal(a.due && a.periodKey, `W:${isoWeek('2026-10-16')}`);
    assert.equal(scheduleDue(s, new Date('2026-10-16T08:00:00Z')).due, false, '15:00 VN — chưa tới giờ');
    assert.equal(scheduleDue(s, new Date('2026-10-17T09:00:00Z')).due, false, 'thứ Bảy');
    assert.equal(scheduleDue({ ...s, enabled: false }, fri1600).due, false);
    const next = scheduleDue(s, new Date('2026-10-23T09:00:00Z'));
    assert.ok(next.due && a.due && next.periodKey !== a.periodKey, 'tuần sau ⇒ khoá kỳ mới');
  });
  it('SPRINT: sprint đóng trong 3 ngày ⇒ khoá theo sprint; cũ hơn ⇒ không', () => {
    const sp = { ...s, cadence: 'SPRINT' };
    const now = new Date('2026-10-16T10:00:00Z');
    assert.deepEqual(scheduleDue(sp, now, { id: 42, completedAt: new Date('2026-10-15T03:00:00Z') }), { due: true, periodKey: 'S:42' });
    assert.equal(scheduleDue(sp, now, { id: 41, completedAt: new Date('2026-10-10T03:00:00Z') }).due, false);
    assert.equal(scheduleDue(sp, now, null).due, false);
  });
  it('giờ địa phương + kỳ báo cáo', () => {
    assert.deepEqual(localWeekdayHour(new Date('2026-10-16T09:30:00Z'), 'Asia/Ho_Chi_Minh'), { weekday: 5, hour: 16, day: '2026-10-16' });
    assert.deepEqual(periodFor('week', new Date('2026-10-16T09:30:00Z'), 'Asia/Ho_Chi_Minh'), { from: '2026-10-10', to: '2026-10-16', kind: 'week', sprint: null });
    const p = periodFor('sprint', new Date('2026-10-16T09:30:00Z'), 'Asia/Ho_Chi_Minh', { id: 3, name: 'Sprint 3', startAt: new Date('2026-10-05T01:00:00Z'), endAt: new Date('2026-10-19T01:00:00Z'), completedAt: null });
    assert.equal(p.from, '2026-10-05');
    assert.equal(p.sprint?.name, 'Sprint 3');
  });
  it('email người nhận', () => {
    assert.equal(validEmail('gv@fpt.edu.vn'), true);
    assert.equal(validEmail('bot@agents.invalid'), false);
    assert.equal(validEmail('khong-phai-email'), false);
  });
});

describe('Bố cục + mẫu sẵn', () => {
  it('bốn mẫu sẵn hợp lệ, cả en lẫn vi', () => {
    for (const k of BUILTIN_KEYS) for (const lang of ['en', 'vi'] as const) {
      const t = builtinTemplate(k, lang);
      assert.ok(t.layout.blocks.length >= 5, k);
      assert.doesNotThrow(() => parseLayout(JSON.parse(JSON.stringify(t.layout))));
    }
    assert.equal(builtinTemplate('lecturer', 'vi').name, 'Báo cáo cho giảng viên');
  });
  it('khối lạ / quá dài bị từ chối', () => {
    assert.throws(() => parseLayout({ title: 'X', blocks: [{ id: 'a', type: 'script', text: '<script>' }] }));
    assert.throws(() => parseLayout({ title: 'X', blocks: [{ id: 'a', type: 'text', text: 'x'.repeat(9000) }] }));
    assert.throws(() => parseLayout({ title: '', blocks: [] }));
    assert.throws(() => parseLayout({ title: 'X', options: { accent: 'red' }, blocks: [] }));
  });
});

describe('Biểu đồ SVG — chữ là đường (không cần font máy chủ)', () => {
  it('đường, vùng, cột, thanh ngang, rỗng ⇒ SVG hợp lệ, không <text>, đổi PNG được', async () => {
    const specs = [
      { kind: 'line', title: 'Burndown — Sprint 3', x: ['2026-10-01', '2026-10-02', '2026-10-03'], series: [{ name: 'Còn lại', values: [10, 6, null] }, { name: 'Lý tưởng', values: [10, 5, 0], dashed: true }] },
      { kind: 'area', title: 'CFD', x: ['2026-10-01', '2026-10-02'], series: [{ name: 'Đã xong', values: [1, 3] }, { name: 'Đang làm', values: [4, 2] }] },
      { kind: 'bar', title: 'Velocity', x: ['S1', 'S2'], series: [{ name: 'Cam kết', values: [10, 12] }, { name: 'Hoàn thành', values: [8, 12] }] },
      { kind: 'hbar', title: 'OKR', items: [{ label: 'Nâng chất lượng mã nguồn', value: 64 }], max: 100, suffix: '%' },
      { kind: 'empty', title: 'Lỗi', message: 'Chưa ghi nhận lỗi' },
    ] as const;
    for (const sp of specs) {
      const svg = renderChartSvg(sp as never, { accent: '#0f766e' });
      assert.ok(svg.startsWith('<svg'), sp.kind);
      assert.ok(!svg.includes('<text'), `${sp.kind}: chữ phải là path`);
      const png = await sharp(Buffer.from(svg)).png().toBuffer();
      const meta = await sharp(png).metadata();
      assert.equal(meta.width, 720);
    }
    assert.ok(textWidth('Đang làm', 12) > textWidth('Đang', 12));
  });
});

const sample = (): ResolvedReport => ({
  title: 'Báo cáo tuần — Nhóm Lab', subtitle: 'Gửi giảng viên hướng dẫn', lang: 'vi',
  period: { from: '2026-10-10', to: '2026-10-16', kind: 'week', sprint: null },
  project: { name: 'LabFlow AI', key: 'LFD' }, workspace: { name: 'SWT301 Nhóm 4' }, accent: '#0f766e', generatedAt: '2026-10-16T09:00:00.000Z',
  options: { cover: true, toc: true, logo: true, coverImage: true }, brand: { logoUrl: null, coverUrl: null },
  blocks: [
    { id: 'h1', type: 'heading', text: 'Tóm tắt tiến độ', level: 1 },
    { id: 'k', type: 'kpis', title: null, items: [{ key: 'open', label: 'Thẻ đang mở', value: '23', hint: '25 tuần trước' }, { key: 'doneInPeriod', label: 'Xong trong kỳ', value: '9', hint: null }, { key: 'overdue', label: 'Trễ hạn', value: '2', hint: null }] },
    { id: 't', type: 'text', text: 'Nhóm đã hoàn thành chức năng đăng nhập và quản lý phòng thí nghiệm.\n\n- Việc tiếp theo: kiểm thử tích hợp\n- Rủi ro: thiếu dữ liệu mẫu' },
    { id: 'c', type: 'chart', title: 'Burndown', svg: renderChartSvg({ kind: 'line', title: 'Burndown — Sprint 3', x: ['2026-10-10', '2026-10-16'], series: [{ name: 'Còn lại', values: [12, 4] }] }) },
    { id: 'h2', type: 'heading', text: 'Việc đã hoàn thành', level: 1 },
    { id: 'i', type: 'issues', title: null, columns: ['Mã', 'Tiêu đề', 'Người làm'], colKeys: ['key', 'title', 'assignee'], rows: Array.from({ length: 40 }, (_, n) => [`LFD-${n + 1}`, `Thiết kế màn hình quản lý thiết bị số ${n + 1}`, 'Nguyễn Văn Đức']), total: 52 },
    { id: 'r', type: 'risks', title: 'Rủi ro hàng đầu', items: [{ key: 'R-1', title: 'Thiếu người kiểm thử', level: 'HIGH', score: 16, owner: 'Trần Thị Hà', mitigation: 'Mời thêm bạn lớp khác' }], note: null },
    { id: 'a', type: 'ai', title: 'Nhận xét của AI', text: '## Tóm tắt\nNhóm đang đúng tiến độ, cần **ưu tiên** kiểm thử.', generatedAt: '2026-10-16T08:00:00Z', note: 'Do AI viết từ số liệu trong báo cáo — hãy kiểm lại trước khi dùng.' },
    { id: 'e', type: 'error', message: 'Dự án chưa bật kiểm thử' },
  ],
});

describe('Xuất PDF / DOCX', () => {
  it('PDF: nhúng font, có mục lục + số trang; chữ tiếng Việt đọc lại được', async () => {
    const r = sample();
    const svgPng = await sharp(Buffer.from((r.blocks[3] as { svg: string }).svg), { density: 144 }).png().toBuffer({ resolveWithObject: true });
    const pdf = await renderReportPdf(r, { logo: null, cover: null, charts: new Map([['c', { buffer: svgPng.data, width: svgPng.info.width, height: svgPng.info.height }]]) });
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
    assert.ok(pdf.includes('FontFile2'), 'font nhúng (không phải Helvetica)');
    if (existsSync('/opt/homebrew/bin/pdftotext') || existsSync('/usr/bin/pdftotext')) {
      const dir = mkdtempSync(path.join(os.tmpdir(), 'ctw8b-'));
      const f = path.join(dir, 'r.pdf');
      writeFileSync(f, pdf);
      const text = execFileSync('pdftotext', ['-layout', f, '-']).toString('utf8');
      for (const w of ['Báo cáo tuần', 'Mục lục', 'Tóm tắt tiến độ', 'Thẻ đang mở', 'Nguyễn Văn Đức', 'Trần Thị Hà', 'Trang 2 /']) assert.ok(text.includes(w), `thiếu “${w}” trong PDF`);
    }
  });
  it('DOCX: có mục lục, ảnh biểu đồ, chân trang Trang X / Y', async () => {
    const r = sample();
    const png = await sharp(Buffer.from((r.blocks[3] as { svg: string }).svg)).png().toBuffer();
    const docx = await renderReportDocx(r, { logo: null, cover: null, charts: new Map([['c', { buffer: png, width: 720, height: 300 }]]) });
    assert.equal(docx.subarray(0, 2).toString(), 'PK');
    const { default: JSZip } = await import('jszip');
    const zip = await JSZip.loadAsync(docx);
    const xml = await zip.file('word/document.xml')!.async('string');
    assert.ok(/TOC \\h \\o/.test(xml), 'trường mục lục');
    assert.ok(xml.includes('Tóm tắt tiến độ'));
    assert.ok(Object.keys(zip.files).some((n) => n.startsWith('word/media/')), 'ảnh biểu đồ');
    const footers = await Promise.all(Object.keys(zip.files).filter((n) => /word\/footer\d+\.xml/.test(n)).map((n) => zip.file(n)!.async('string')));
    assert.ok(footers.some((x) => x.includes('Trang') && x.includes('NUMPAGES')));
  });
});
