/**
 * CV Builder — DOCX renderer (Phase 4). The `docx` library, pure JS. Many
 * Vietnamese recruiters and outsourcing HR teams explicitly ask for an editable
 * Word file, and some internal ATS only accept .docx. This produces a CLEAN,
 * semantically structured document — real heading styles, real bullet lists,
 * NO text boxes, NO tables-for-layout — not an HTML dump renamed to .docx.
 * Word renders Unicode with its own fonts, so no font embedding is needed.
 */
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, ExternalHyperlink, BorderStyle,
} from 'docx';
import type { RenderCv, RenderItem } from './cvData.js';
import { SECTION_LABELS, type ExportLang } from './labels.js';

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 220, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'BBBBBB', space: 1 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22 })],
  });
}

function itemParagraphs(it: RenderItem): Paragraph[] {
  const out: Paragraph[] = [];
  out.push(new Paragraph({
    spacing: { before: 120, after: 20 },
    children: [
      new TextRun({ text: it.title, bold: true, size: 22 }),
      ...(it.dateRange ? [new TextRun({ text: `\t${it.dateRange}`, color: '555555', size: 19 })] : []),
    ],
    tabStops: [{ type: 'right', position: 9360 }],
  }));
  const sub = [it.organization, it.location].filter(Boolean).join(' · ');
  if (sub) out.push(new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: sub, italics: true, color: '555555', size: 20 })] }));
  if (it.gpa) out.push(new Paragraph({ children: [new TextRun({ text: `GPA: ${it.gpa}`, color: '555555', size: 19 })] }));
  if (it.techStack.length) out.push(new Paragraph({ children: [new TextRun({ text: it.techStack.join(' · '), color: '555555', size: 19 })] }));
  if (it.url) out.push(new Paragraph({ children: [new ExternalHyperlink({ link: it.url, children: [new TextRun({ text: it.url, style: 'Hyperlink', size: 19 })] })] }));
  for (const b of it.bullets) {
    out.push(new Paragraph({ bullet: { level: 0 }, spacing: { after: 20 }, children: [new TextRun({ text: b, size: 20 })] }));
  }
  return out;
}

export async function renderDocx(cv: RenderCv, lang: ExportLang = 'VI'): Promise<Buffer> {
  const L = SECTION_LABELS[lang];
  const body: Paragraph[] = [];

  // Header
  body.push(new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: cv.fullName || 'Họ và tên', bold: true, size: 40 })] }));
  if (cv.headline) body.push(new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: cv.headline, size: 24, color: '555555' })] }));
  const contact = [cv.email, cv.phone, cv.location].filter(Boolean).join('  •  ');
  if (contact) body.push(new Paragraph({ children: [new TextRun({ text: contact, size: 19, color: '555555' })] }));
  if (cv.links.length) {
    body.push(new Paragraph({
      spacing: { after: 60 },
      children: cv.links.flatMap((l, i) => [
        ...(i > 0 ? [new TextRun({ text: '   ', size: 19 })] : []),
        new ExternalHyperlink({ link: l.url, children: [new TextRun({ text: `${l.label}: ${l.url}`, style: 'Hyperlink', size: 18 })] }),
      ]),
    }));
  }

  if (cv.summary) { body.push(sectionHeading(L.summary)); body.push(new Paragraph({ children: [new TextRun({ text: cv.summary, size: 20 })] })); }
  if (cv.experiences.length) { body.push(sectionHeading(L.experience)); cv.experiences.forEach((it) => body.push(...itemParagraphs(it))); }
  if (cv.projects.length) { body.push(sectionHeading(L.projects)); cv.projects.forEach((it) => body.push(...itemParagraphs(it))); }
  if (cv.education.length) { body.push(sectionHeading(L.education)); cv.education.forEach((it) => body.push(...itemParagraphs(it))); }
  if (cv.skillGroups.length) {
    body.push(sectionHeading(L.skills));
    for (const g of cv.skillGroups) body.push(new Paragraph({ children: [new TextRun({ text: `${g.category}: `, bold: true, size: 20 }), new TextRun({ text: g.names.join(', '), size: 20 })] }));
  }
  if (cv.languageSkills.length) {
    body.push(sectionHeading(L.languages));
    for (const l of cv.languageSkills) body.push(new Paragraph({ children: [new TextRun({ text: `${l.language}${l.detail ? ' — ' + l.detail : ''}`, size: 20 })] }));
  }
  if (cv.certifications.length) {
    body.push(sectionHeading(L.certifications));
    for (const c of cv.certifications) body.push(new Paragraph({ children: [new TextRun({ text: `${c.name}${c.issuer ? ' — ' + c.issuer : ''}`, size: 20 })] }));
  }
  if (cv.others.length) { body.push(sectionHeading(L.other)); cv.others.forEach((it) => body.push(...itemParagraphs(it))); }

  const doc = new Document({
    styles: { default: { document: { run: { font: 'Calibri' } } } },
    sections: [{ properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } }, children: body }],
  });
  return Packer.toBuffer(doc) as unknown as Promise<Buffer>;
}
