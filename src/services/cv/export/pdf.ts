/**
 * CV Builder — PDF renderer (Phase 4). pdfkit, server-side, pure JS (NO headless
 * Chromium — too heavy for the VPS). Produces REAL selectable/parseable text
 * with an embedded Unicode font (Vietnamese diacritics) and live hyperlinks, so
 * ATS systems can read it. Single-column, standard headings, zero decoration —
 * the ATS-Optimized template (the default and the safe choice).
 */
import PDFDocument from 'pdfkit';
import { notoSansViBuffer } from './font.js';
import type { RenderCv, RenderItem } from './cvData.js';

const INK = '#1a1a1a';
const MUTED = '#555555';
const RULE = '#cccccc';

export function renderPdf(cv: RenderCv): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margins: { top: 48, bottom: 48, left: 54, right: 54 }, bufferPages: true });
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

  // Embed the Unicode font (Regular). pdfkit's built-in Helvetica can't render
  // Vietnamese; we use the embedded face for everything and lean on SIZE/CASE
  // for hierarchy since we only bundle the Regular weight.
  doc.registerFont('vi', notoSansViBuffer());
  doc.font('vi');

  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;
  const width = right - left;

  // ── Header ──
  doc.fillColor(INK).fontSize(22).text(cv.fullName || 'Họ và tên', left, doc.y, { width });
  if (cv.headline) doc.fillColor(MUTED).fontSize(12).text(cv.headline, { width });
  const contactBits = [cv.email, cv.phone, cv.location].filter(Boolean).join('  •  ');
  if (contactBits) doc.fillColor(MUTED).fontSize(9.5).text(contactBits, { width });
  if (cv.links.length) {
    doc.moveDown(0.2);
    // One link per line — reliable clickable rectangles (manual inline layout
    // produced NaN annotation coords in pdfkit).
    for (const lnk of cv.links) {
      doc.fillColor('#2456b8').fontSize(9).text(`${lnk.label}: ${lnk.url}`, left, doc.y, { width, link: lnk.url });
    }
    doc.fillColor(INK);
  }
  doc.moveDown(0.6);

  const section = (title: string) => {
    if (doc.y > doc.page.height - 120) doc.addPage();
    doc.moveDown(0.4);
    doc.fillColor(INK).fontSize(11).text(title.toUpperCase(), left, doc.y, { width, characterSpacing: 0.5 });
    const y = doc.y + 2;
    doc.moveTo(left, y).lineTo(right, y).lineWidth(0.75).strokeColor(RULE).stroke();
    doc.moveDown(0.5);
  };

  const item = (it: RenderItem) => {
    if (doc.y > doc.page.height - 90) doc.addPage();
    const startY = doc.y;
    // Title (left) + date range (right) on the same baseline.
    doc.fillColor(INK).fontSize(11).text(it.title, left, startY, { width: width - 120, continued: false });
    if (it.dateRange) {
      doc.fillColor(MUTED).fontSize(9.5).text(it.dateRange, left, startY, { width, align: 'right' });
    }
    const sub = [it.organization, it.location].filter(Boolean).join(' · ');
    if (sub) doc.fillColor(MUTED).fontSize(10).text(sub, left, doc.y, { width });
    if (it.gpa) doc.fillColor(MUTED).fontSize(9.5).text(`GPA: ${it.gpa}`, { width });
    if (it.techStack.length) doc.fillColor(MUTED).fontSize(9).text(it.techStack.join(' · '), { width });
    if (it.url) doc.fillColor('#2456b8').fontSize(9).text(it.url, { width, link: it.url });
    for (const b of it.bullets) {
      if (doc.y > doc.page.height - 70) doc.addPage();
      doc.fillColor(INK).fontSize(10).text(`•  ${b}`, left + 8, doc.y, { width: width - 8, align: 'left' });
    }
    doc.moveDown(0.5);
  };

  if (cv.summary) { section('Tóm tắt'); doc.fillColor(INK).fontSize(10).text(cv.summary, left, doc.y, { width, align: 'left' }); doc.moveDown(0.3); }
  if (cv.experiences.length) { section('Kinh nghiệm làm việc'); cv.experiences.forEach(item); }
  if (cv.projects.length) { section('Dự án'); cv.projects.forEach(item); }
  if (cv.education.length) { section('Học vấn'); cv.education.forEach(item); }
  if (cv.skillGroups.length) {
    section('Kỹ năng');
    for (const g of cv.skillGroups) {
      doc.fillColor(INK).fontSize(10).text(`${g.category}: `, left, doc.y, { continued: true }).fillColor(MUTED).text(g.names.join(', '));
    }
    doc.moveDown(0.3);
  }
  if (cv.languageSkills.length) {
    section('Ngoại ngữ');
    for (const l of cv.languageSkills) doc.fillColor(INK).fontSize(10).text(`${l.language}${l.detail ? ' — ' + l.detail : ''}`, left, doc.y, { width });
    doc.moveDown(0.3);
  }
  if (cv.certifications.length) {
    section('Chứng chỉ');
    for (const c of cv.certifications) doc.fillColor(INK).fontSize(10).text(`${c.name}${c.issuer ? ' — ' + c.issuer : ''}`, left, doc.y, { width });
    doc.moveDown(0.3);
  }
  if (cv.others.length) { section('Khác'); cv.others.forEach(item); }

  doc.end();
  return done;
}
