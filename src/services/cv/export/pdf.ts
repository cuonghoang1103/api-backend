/**
 * CV Builder — PDF renderer (Phase 4, templated in Phase 11). pdfkit, pure JS
 * (NO headless Chromium). Real selectable/parseable text, embedded Unicode font
 * (Vietnamese), live hyperlinks. All templates are single-column and ATS-safe;
 * a CvTemplateSpec drives accent colour, header layout, section order, and the
 * VN-market DOB field.
 */
import PDFDocument from 'pdfkit';
import { notoSansViBuffer } from './font.js';
import type { RenderCv, RenderItem } from './cvData.js';
import { CV_TEMPLATES, type CvTemplateSpec } from './templates.js';
import { SECTION_LABELS, type ExportLang } from './labels.js';

const MUTED = '#555555';
const RULE = '#cccccc';

export function renderPdf(cv: RenderCv, spec: CvTemplateSpec = CV_TEMPLATES.ats, lang: ExportLang = 'VI'): Promise<Buffer> {
  const L = SECTION_LABELS[lang];
  const INK = spec.id === 'ats' ? '#1a1a1a' : '#1a1a1a';
  const ACCENT = spec.accent;
  const doc = new PDFDocument({ size: 'A4', margins: { top: 46, bottom: 46, left: 54, right: 54 }, bufferPages: true });
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

  doc.registerFont('vi', notoSansViBuffer());
  doc.font('vi');

  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;
  const width = right - left;
  const headerAlign: 'left' | 'center' = spec.centerHeader ? 'center' : 'left';

  // ── Header ──
  doc.fillColor(spec.id === 'senior' ? ACCENT : INK).fontSize(spec.nameSize).text(cv.fullName || 'Họ và tên', left, doc.y, { width, align: headerAlign });
  if (cv.headline) doc.fillColor(MUTED).fontSize(12).text(cv.headline, { width, align: headerAlign });
  const contactBits = [cv.email, cv.phone, cv.location, spec.showDob && cv.dateOfBirth ? `${L.dob}: ${cv.dateOfBirth}` : '']
    .filter(Boolean).join('  •  ');
  if (contactBits) doc.fillColor(MUTED).fontSize(9.5).text(contactBits, { width, align: headerAlign });
  if (cv.links.length) {
    doc.moveDown(0.2);
    for (const lnk of cv.links) {
      doc.fillColor(ACCENT).fontSize(9).text(`${lnk.label}: ${lnk.url}`, left, doc.y, { width, link: lnk.url, align: headerAlign });
    }
    doc.fillColor(INK);
  }
  doc.moveDown(0.6);

  const section = (title: string) => {
    if (doc.y > doc.page.height - 120) doc.addPage();
    doc.moveDown(0.4);
    doc.fillColor(ACCENT).fontSize(11).text(title.toUpperCase(), left, doc.y, { width, characterSpacing: 0.5 });
    const y = doc.y + 2;
    doc.moveTo(left, y).lineTo(right, y).lineWidth(spec.id === 'technical' ? 1.2 : 0.75).strokeColor(spec.id === 'ats' ? RULE : ACCENT).stroke();
    doc.moveDown(0.5);
  };

  const item = (it: RenderItem) => {
    if (doc.y > doc.page.height - 90) doc.addPage();
    const startY = doc.y;
    doc.fillColor(INK).fontSize(11).text(it.title, left, startY, { width: width - 120 });
    if (it.dateRange) doc.fillColor(MUTED).fontSize(9.5).text(it.dateRange, left, startY, { width, align: 'right' });
    const sub = [it.organization, it.location].filter(Boolean).join(' · ');
    if (sub) doc.fillColor(MUTED).fontSize(10).text(sub, left, doc.y, { width });
    if (it.gpa) doc.fillColor(MUTED).fontSize(9.5).text(`GPA: ${it.gpa}`, { width });
    if (it.techStack.length) doc.fillColor(spec.id === 'technical' ? ACCENT : MUTED).fontSize(9).text(it.techStack.join(' · '), { width });
    if (it.url) doc.fillColor(ACCENT).fontSize(9).text(it.url, { width, link: it.url });
    for (const b of it.bullets) {
      if (doc.y > doc.page.height - 70) doc.addPage();
      doc.fillColor(INK).fontSize(10).text(`•  ${b}`, left + 8, doc.y, { width: width - 8, align: 'left' });
    }
    doc.moveDown(0.5);
  };

  // ── Section order (template-driven) ──
  const blocks: Array<() => void> = [];
  const summaryBlock = () => { if (cv.summary) { section(L.summary); doc.fillColor(INK).fontSize(10).text(cv.summary, left, doc.y, { width, align: 'left' }); doc.moveDown(0.3); } };
  const experienceBlock = () => { if (cv.experiences.length) { section(L.experience); cv.experiences.forEach(item); } };
  const projectsBlock = () => { if (cv.projects.length) { section(L.projects); cv.projects.forEach(item); } };
  const educationBlock = () => { if (cv.education.length) { section(L.education); cv.education.forEach(item); } };

  blocks.push(summaryBlock); // summary is always near the top; summaryFirst just keeps it first
  if (spec.educationEarly) { blocks.push(educationBlock, experienceBlock, projectsBlock); }
  else { blocks.push(experienceBlock, projectsBlock, educationBlock); }
  for (const b of blocks) b();

  if (cv.skillGroups.length) {
    section(L.skills);
    for (const g of cv.skillGroups) doc.fillColor(INK).fontSize(10).text(`${g.category}: `, left, doc.y, { continued: true }).fillColor(MUTED).text(g.names.join(', '));
    doc.moveDown(0.3);
  }
  if (cv.languageSkills.length) {
    section(L.languages);
    for (const l of cv.languageSkills) doc.fillColor(INK).fontSize(10).text(`${l.language}${l.detail ? ' — ' + l.detail : ''}`, left, doc.y, { width });
    doc.moveDown(0.3);
  }
  if (cv.certifications.length) {
    section(L.certifications);
    for (const c of cv.certifications) doc.fillColor(INK).fontSize(10).text(`${c.name}${c.issuer ? ' — ' + c.issuer : ''}`, left, doc.y, { width });
    doc.moveDown(0.3);
  }
  if (cv.others.length) { section(L.other); cv.others.forEach(item); }

  doc.end();
  return done;
}
