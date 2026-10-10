/**
 * CT Work — Đóng góp: XUẤT TỆP.
 *   - .xlsx: Summary · Members (mọi chỉ số) · Daily activity · Peer review (+ nhận xét ẩn danh) · Definitions.
 *   - .pdf : MỘT trang A4 tóm tắt cho giảng viên (KPI nhóm, bảng thành viên, tín hiệu, điểm đánh giá chéo, ghi chú công bằng).
 * Chỉ người thấy được từng thành viên (ADMIN / TEACHER / cả nhóm khi bật) — `access.export`.
 */

import PDFDocument from 'pdfkit';
import { AppError } from '../../middleware/errorHandler.js';
import { notoSansViBoldBuffer, notoSansViBuffer } from '../cv/export/font.js';
import { displayName } from './common.js';
import { summary, type ContribQuery } from './contrib.service.js';
import { FAIRNESS_NOTE, FAIRNESS_NOTE_VI, metricDefinitions } from './contribRules.js';
import { peerSummaryForExport } from './contribPeer.service.js';
import { writeXlsx, XSheet, type XStyle } from './xlsxStyled.js';

const H: XStyle = { font: { b: true, color: 'FFFFFF' }, fill: '1F3B57', border: 'thin', align: { v: 'center', wrap: true } };
const C: XStyle = { border: 'thin', align: { v: 'top' } };
const N: XStyle = { border: 'thin', align: { h: 'right', v: 'top' } };
const T: XStyle = { font: { b: true, sz: 14 } };
const MUTED: XStyle = { font: { i: true, color: '555555' }, align: { wrap: true, v: 'top' } };

const nv = (v: number | null | undefined) => (v === null || v === undefined ? '—' : v);
const fileSafe = (s: string) => s.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-|-$/g, '') || 'range';

async function load(userId: number, projectId: number, q: ContribQuery) {
  const s = await summary(userId, projectId, q);
  if (!s.access.export) throw new AppError('Only project admins and teachers can export contribution reports', 403, 'FORBIDDEN');
  return s;
}

export async function exportXlsx(userId: number, projectId: number, q: ContribQuery & { lang?: 'en' | 'vi' }): Promise<{ buf: Buffer; fileName: string }> {
  const s = await load(userId, projectId, q);
  const peer = s.access.peerAdmin ? await peerSummaryForExport(projectId) : [];
  const unit = s.unit === 'HOURS' ? 'h' : 'pts';

  // ── Summary
  const sum = new XSheet('Summary');
  sum.width(1, 34).width(2, 18).width(3, 18).width(4, 12);
  sum.set(1, 1, `Team contribution — ${s.project.name} (${s.project.key})`, T);
  sum.set(2, 1, `Range: ${s.window.label} (${s.window.fromDay} → ${s.window.toDay}, ${s.window.tz})`);
  sum.set(3, 1, `Generated: ${new Date().toISOString().replace('T', ' ').slice(0, 16)} UTC`);
  sum.set(5, 1, 'Metric', H).set(5, 2, 'This period', H).set(5, 3, s.previous ? `Previous (${s.previous.fromDay} → ${s.previous.toDay})` : 'Previous', H).set(5, 4, 'Change %', H);
  const t = s.team.totals as Record<string, number | null>;
  const pt = (s.team.prevTotals ?? {}) as Record<string, number | null>;
  const kpis: Array<[string, string]> = [
    ['People (humans)', 'people'], ['Issues completed', 'completed'], [`Points done (${unit})`, 'points'], ['On-time rate %', 'onTimeRate'],
    ['Overdue open issues', 'overdueOpen'], ['Avg cycle time (days)', 'cycleDays'], ['Hours logged', 'hours'], ['Comments', 'comments'],
    ['Chat messages', 'chatMessages'], ['Reviews done', 'reviewsDone'], ['Commits', 'commits'], ['Pull requests', 'prs'],
    ['Doc versions', 'docVersions'], ['Test runs', 'testRuns'], ['UTCID executed (5.1)', 'utcidExecuted'], ['Meetings attended', 'meetingsAttended'],
  ];
  kpis.forEach(([label, k], i) => {
    const r = 6 + i;
    const d = (s.team.delta as Record<string, number | null> | null)?.[k];
    sum.set(r, 1, label, C).set(r, 2, nv(t[k]), N).set(r, 3, s.team.prevTotals ? nv(pt[k]) : '—', N).set(r, 4, d === null || d === undefined ? '—' : d, N);
  });
  const noteRow = 7 + kpis.length;
  sum.set(noteRow, 1, FAIRNESS_NOTE, MUTED).merge(noteRow, 1, noteRow, 4);
  sum.height(noteRow, 48);

  // ── Members
  const mem = new XSheet('Members');
  const cols: Array<[string, (r: (typeof s.members)[number]) => string | number | null]> = [
    ['Member', (r) => displayName(r.user)], ['Username', (r) => r.user.username], ['Role', (r) => r.user.role], ['Kind', (r) => (r.user.isAgent ? 'AI agent' : 'Person')],
    ['Assigned', (r) => r.metrics.assigned], ['Completed', (r) => r.metrics.completed], ['Sub-tasks done', (r) => r.metrics.subtasksDone], [`Points (${unit})`, (r) => r.metrics.points],
    ['With due date', (r) => r.metrics.withDue], ['On time', (r) => r.metrics.onTime], ['On-time %', (r) => r.metrics.onTimeRate], ['Avg days late', (r) => r.metrics.avgLateDays], ['Overdue open', (r) => r.metrics.overdueOpen],
    ['Cycle time (days)', (r) => r.metrics.cycleDays], ['Lead time (days)', (r) => r.metrics.leadDays], ['Hours logged', (r) => r.metrics.hours],
    ['Comments', (r) => r.metrics.comments], ['Voice notes', (r) => r.metrics.voiceNotes], ['Chat messages', (r) => r.metrics.chatMessages], ['@mentions', (r) => r.metrics.mentions],
    ['Mentions answered', (r) => r.metrics.mentionsAnswered], ['Median reply (h)', (r) => r.metrics.responseHours], ['Reviews done', (r) => r.metrics.reviewsDone], ['Review requests', (r) => r.metrics.reviewRequests],
    ['Commits', (r) => r.metrics.commits], ['PRs', (r) => r.metrics.prs], ['Lines +', (r) => r.metrics.additions], ['Lines −', (r) => r.metrics.deletions],
    ['Doc versions', (r) => r.metrics.docVersions], ['Pages edited', (r) => r.metrics.pagesEdited], ['Test cases created', (r) => r.metrics.testCasesCreated], ['Test runs', (r) => r.metrics.testRuns],
    ['Defects found', (r) => r.metrics.defectsFound], ['Bugs reported', (r) => r.metrics.bugsReported], ['UTCID created', (r) => r.metrics.utcidCreated], ['UTCID executed', (r) => r.metrics.utcidExecuted],
    ['5.2/5.3 runs', (r) => r.metrics.itExecuted], ['Meetings invited', (r) => r.metrics.meetingsInvited], ['Meetings attended', (r) => r.metrics.meetingsAttended],
    ['Actions', (r) => r.metrics.actions], ['Active days', (r) => r.metrics.activeDays], ['Longest streak', (r) => r.metrics.longestStreak], ['Days silent now', (r) => r.metrics.silentNow],
    ['Needs attention because', (r) => r.signals.map((x) => x.text).join('; ') || '—'],
  ];
  cols.forEach(([h], i) => { mem.set(1, i + 1, h, H).width(i + 1, i === 0 ? 24 : i === cols.length - 1 ? 48 : 12); });
  mem.height(1, 32);
  mem.freeze = { col: 1, row: 1 };
  s.members.forEach((r, ri) => cols.forEach(([, f], ci) => { const v = f(r); mem.set(ri + 2, ci + 1, nv(v as number | null), typeof v === 'number' ? N : C); }));

  // ── Daily activity (hành động/ngày của từng người)
  const daily = new XSheet('Activity');
  daily.set(1, 1, s.charts.bucket === 'day' ? 'Day' : 'Week of', H).width(1, 14);
  s.members.forEach((r, i) => daily.set(1, i + 2, displayName(r.user), H).width(i + 2, 14));
  daily.set(1, s.members.length + 2, 'Team (people)', H).width(s.members.length + 2, 14);
  s.charts.keys.forEach((k, i) => {
    daily.set(i + 2, 1, k, C);
    s.members.forEach((r, j) => daily.set(i + 2, j + 2, r.spark[i] ?? 0, N));
    daily.set(i + 2, s.members.length + 2, s.charts.teamActivity[i] ?? 0, N);
  });

  // ── Peer review
  const sheets = [sum, mem, daily];
  if (peer.length) {
    const pr = new XSheet('Peer review');
    const com = new XSheet('Peer comments');
    pr.width(1, 26);
    com.width(1, 28).width(2, 24).width(3, 80);
    com.set(1, 1, 'Round', H).set(1, 2, 'About', H).set(1, 3, 'Comment (anonymous)', H);
    let row = 1, crow = 2;
    for (const round of peer) {
      pr.set(row, 1, `${round.title} — ${round.status === 'OPEN' ? 'open' : 'closed'}`, { font: { b: true, sz: 12 } });
      row += 1;
      const head = ['Member', ...round.criteria.map((c) => c.label), 'Overall', 'Ratings received', 'Forms submitted'];
      head.forEach((h, i) => { pr.set(row, i + 1, h, H); if (i) pr.width(i + 1, 14); });
      row += 1;
      for (const x of round.rows) {
        pr.set(row, 1, displayName(x.user), C);
        round.criteria.forEach((c, i) => pr.set(row, i + 2, x.count ? (x.byCriterion as Record<string, number>)[c.key] ?? '—' : '—', N));
        pr.set(row, round.criteria.length + 2, nv(x.overall), N).set(row, round.criteria.length + 3, x.count, N).set(row, round.criteria.length + 4, `${x.submitted}/${x.expected}`, N);
        for (const c of x.comments) { com.set(crow, 1, round.title, C).set(crow, 2, displayName(x.user), C).set(crow, 3, c, { ...C, align: { wrap: true, v: 'top' } }); crow += 1; }
        row += 1;
      }
      row += 1;
    }
    pr.set(row, 1, 'Scores are 1–5 averages. Who rated whom is never stored in exports or shown to anyone.', MUTED);
    sheets.push(pr, com);
  }

  // ── Definitions
  const def = new XSheet('Definitions');
  def.width(1, 22).width(2, 110);
  // CTW đợt 8c: sheet định nghĩa theo ngôn ngữ người xuất (?lang=vi) — phần "how" trước chỉ có tiếng Anh.
  const vi = q.lang === 'vi';
  const defs = metricDefinitions(vi ? 'vi' : 'en');
  def.set(1, 1, vi ? 'Chỉ số' : 'Metric', H).set(1, 2, vi ? 'Cách tính' : 'How it is counted', H);
  Object.values(defs).forEach((d, i) => def.set(i + 2, 1, d.label, C).set(i + 2, 2, d.how, { ...C, align: { wrap: true, v: 'top' } }));
  const last = Object.keys(defs).length + 3;
  def.set(last, 1, vi ? 'Lưu ý' : 'Note', { font: { b: true } }).set(last, 2, vi ? FAIRNESS_NOTE_VI : FAIRNESS_NOTE, MUTED);
  sheets.push(def);

  return { buf: writeXlsx(sheets, { title: `${s.project.key} contributions`, creator: 'CT Work' }), fileName: `${s.project.key}-contributions-${fileSafe(s.window.fromDay)}_${fileSafe(s.window.toDay)}.xlsx` };
}

/** PDF MỘT trang cho giảng viên. Bảng tối đa 14 người (đồ án thường 4–6). */
export async function exportPdf(userId: number, projectId: number, q: ContribQuery): Promise<{ buf: Buffer; fileName: string }> {
  const s = await load(userId, projectId, q);
  const peer = s.access.peerAdmin ? await peerSummaryForExport(projectId) : [];
  const lastPeer = [...peer].reverse().find((r) => r.rows.some((x) => x.count > 0)) ?? null;
  const t = s.team.totals;
  const buf = await new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'portrait', margin: 36, info: { Title: `${s.project.key} — team contribution`, Creator: 'CT Work' } });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.registerFont('vi', notoSansViBuffer());
    doc.registerFont('vi-bold', notoSansViBoldBuffer());
    const left = 36, width = doc.page.width - 72;

    doc.font('vi-bold').fontSize(15).fillColor('#0f172a').text(`Team contribution — ${s.project.name}`, left, 36, { width });
    doc.font('vi').fontSize(8.5).fillColor('#64748b').text(`${s.project.key} · ${s.window.label} (${s.window.fromDay} → ${s.window.toDay}, ${s.window.tz}) · generated ${new Date().toISOString().slice(0, 10)}`, { width });
    doc.moveDown(0.6);

    // KPI hàng ngang
    const kpi: Array<[string, string]> = [
      ['Completed', `${t.completed}`], ['Points', `${t.points}`], ['On time', t.onTimeRate === null ? '—' : `${t.onTimeRate}%`], ['Overdue now', `${t.overdueOpen}`],
      ['Hours', `${t.hours}`], ['Comments + chat', `${t.comments + (t.chatMessages ?? 0)}`], ['Commits', `${t.commits}`], ['Doc versions', `${t.docVersions}`],
    ];
    const kw = width / 4;
    let y = doc.y;
    kpi.forEach(([label, v], i) => {
      const x = left + (i % 4) * kw;
      const yy = y + Math.floor(i / 4) * 34;
      doc.roundedRect(x + 2, yy, kw - 4, 30, 4).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.font('vi').fontSize(7.5).fillColor('#64748b').text(label, x + 8, yy + 4, { width: kw - 16 });
      doc.font('vi-bold').fontSize(12).fillColor('#0f172a').text(v, x + 8, yy + 13, { width: kw - 16 });
    });
    y += 74;

    // Bảng thành viên
    const cols: Array<{ label: string; w: number; get: (r: (typeof s.members)[number]) => string }> = [
      { label: 'Member', w: 108, get: (r) => `${displayName(r.user)}${r.user.isAgent ? ' (AI)' : ''}` },
      { label: 'Done', w: 32, get: (r) => `${r.metrics.completed}` },
      { label: 'Points', w: 36, get: (r) => `${r.metrics.points}` },
      { label: 'On time', w: 40, get: (r) => (r.metrics.onTimeRate === null ? '—' : `${r.metrics.onTimeRate}%`) },
      { label: 'Overdue', w: 40, get: (r) => `${r.metrics.overdueOpen}` },
      { label: 'Hours', w: 34, get: (r) => `${r.metrics.hours}` },
      { label: 'Talk', w: 32, get: (r) => `${r.metrics.comments + (r.metrics.chatMessages ?? 0)}` },
      { label: 'Code', w: 32, get: (r) => `${r.metrics.commits + r.metrics.prs}` },
      { label: 'Docs', w: 30, get: (r) => `${r.metrics.docVersions}` },
      { label: 'Tests', w: 32, get: (r) => `${r.metrics.testRuns + r.metrics.utcidExecuted + r.metrics.itExecuted + r.metrics.testCasesCreated}` },
      { label: 'Active d', w: 38, get: (r) => `${r.metrics.activeDays}/${s.window.days}` },
      { label: 'Peer', w: 30, get: (r) => { const x = lastPeer?.rows.find((p) => p.user.id === r.user.id); return x?.overall ? `${x.overall}` : '—'; } },
    ];
    let x = left;
    doc.font('vi-bold').fontSize(7.5).fillColor('#334155');
    for (const c of cols) { doc.text(c.label, x + 2, y, { width: c.w - 4 }); x += c.w; }
    doc.moveTo(left, y + 11).lineTo(left + cols.reduce((a, c) => a + c.w, 0), y + 11).strokeColor('#cbd5e1').lineWidth(0.6).stroke();
    y += 15;
    doc.font('vi').fontSize(8).fillColor('#0f172a');
    for (const r of s.members.slice(0, 14)) {
      x = left;
      for (const c of cols) { doc.text(c.get(r), x + 2, y, { width: c.w - 4, lineBreak: false, ellipsis: true }); x += c.w; }
      y += 14;
    }
    if (s.members.length > 14) { doc.fillColor('#64748b').text(`+ ${s.members.length - 14} more in the Excel export`, left, y); y += 12; }

    // Tín hiệu
    y += 8;
    doc.font('vi-bold').fontSize(9.5).fillColor('#0f172a').text('Needs attention (with reasons)', left, y);
    y = doc.y + 2;
    doc.font('vi').fontSize(8).fillColor('#0f172a');
    const sig = s.members.flatMap((r) => r.signals.map((g) => `${displayName(r.user)}: ${g.text}`)).slice(0, 10);
    if (!sig.length) doc.fillColor('#64748b').text('Nothing flagged in this range.', left, y);
    for (const line of sig) doc.text(`• ${line}`, left, doc.y, { width });

    // Đánh giá chéo
    if (lastPeer) {
      doc.moveDown(0.6);
      doc.font('vi-bold').fontSize(9.5).fillColor('#0f172a').text(`Peer review — ${lastPeer.title} (1–5, anonymous)`, left, doc.y);
      doc.font('vi').fontSize(8).fillColor('#0f172a');
      for (const r of lastPeer.rows) {
        const parts = lastPeer.criteria.map((c) => `${c.label} ${r.count ? (r.byCriterion as Record<string, number>)[c.key] ?? '—' : '—'}`).join(' · ');
        doc.text(`${displayName(r.user)} — overall ${r.overall ?? '—'} (${r.count} ratings): ${parts}`, left, doc.y, { width });
      }
    }

    // Ghi chú + định nghĩa ngắn
    doc.moveDown(0.8);
    doc.font('vi').fontSize(7.5).fillColor('#475569').text(`${FAIRNESS_NOTE} Done = issues resolved in the range credited to the current assignee; On time = finished by the due date; Talk = comments + chat messages; Active d = days with any recorded action. Full definitions: Excel export, sheet "Definitions".`, left, doc.y, { width });
    doc.end();
  });
  return { buf, fileName: `${s.project.key}-contributions-summary-${fileSafe(s.window.toDay)}.pdf` };
}
