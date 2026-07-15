/**
 * CV Builder — plain text & Markdown renderers (Phase 4).
 * Text/MD are for pasting into web application forms that mangle rich text.
 * Always available, no deps.
 */
import type { RenderCv, RenderItem } from './cvData.js';
import { SECTION_LABELS, type ExportLang } from './labels.js';

function itemTxt(it: RenderItem): string[] {
  const lines: string[] = [];
  lines.push([it.title, it.dateRange].filter(Boolean).join('  —  '));
  const sub = [it.organization, it.location].filter(Boolean).join(' · ');
  if (sub) lines.push(sub);
  if (it.gpa) lines.push(`GPA: ${it.gpa}`);
  if (it.techStack.length) lines.push(`Tech: ${it.techStack.join(', ')}`);
  if (it.url) lines.push(it.url);
  for (const b of it.bullets) lines.push(`- ${b}`);
  lines.push('');
  return lines;
}

export function renderTxt(cv: RenderCv, lang: ExportLang = 'VI'): string {
  const S = SECTION_LABELS[lang];
  const L: string[] = [];
  L.push(cv.fullName || '');
  if (cv.headline) L.push(cv.headline);
  L.push([cv.email, cv.phone, cv.location].filter(Boolean).join(' | '));
  for (const lnk of cv.links) L.push(`${lnk.label}: ${lnk.url}`);
  L.push('');
  const sec = (t: string) => { L.push(t.toUpperCase()); L.push('='.repeat(t.length)); };
  if (cv.summary) { sec(S.summary); L.push(cv.summary, ''); }
  if (cv.experiences.length) { sec(S.experience); cv.experiences.forEach((i) => L.push(...itemTxt(i))); }
  if (cv.projects.length) { sec(S.projects); cv.projects.forEach((i) => L.push(...itemTxt(i))); }
  if (cv.education.length) { sec(S.education); cv.education.forEach((i) => L.push(...itemTxt(i))); }
  if (cv.skillGroups.length) { sec(S.skills); cv.skillGroups.forEach((g) => L.push(`${g.category}: ${g.names.join(', ')}`)); L.push(''); }
  if (cv.languageSkills.length) { sec(S.languages); cv.languageSkills.forEach((l) => L.push(`${l.language}${l.detail ? ' — ' + l.detail : ''}`)); L.push(''); }
  if (cv.certifications.length) { sec(S.certifications); cv.certifications.forEach((c) => L.push(`${c.name}${c.issuer ? ' — ' + c.issuer : ''}`)); L.push(''); }
  if (cv.others.length) { sec(S.other); cv.others.forEach((i) => L.push(...itemTxt(i))); }
  return L.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function itemMd(it: RenderItem): string[] {
  const L: string[] = [];
  L.push(`### ${it.title}${it.dateRange ? `  \`${it.dateRange}\`` : ''}`);
  const sub = [it.organization, it.location].filter(Boolean).join(' · ');
  if (sub) L.push(`*${sub}*`);
  if (it.gpa) L.push(`GPA: ${it.gpa}`);
  if (it.techStack.length) L.push(`**Tech:** ${it.techStack.join(', ')}`);
  if (it.url) L.push(`<${it.url}>`);
  for (const b of it.bullets) L.push(`- ${b}`);
  L.push('');
  return L;
}

export function renderMarkdown(cv: RenderCv, lang: ExportLang = 'VI'): string {
  const S = SECTION_LABELS[lang];
  const L: string[] = [];
  L.push(`# ${cv.fullName || ''}`);
  if (cv.headline) L.push(`**${cv.headline}**`);
  L.push([cv.email, cv.phone, cv.location].filter(Boolean).join(' | '));
  if (cv.links.length) L.push(cv.links.map((l) => `[${l.label}](${l.url})`).join(' · '));
  L.push('');
  if (cv.summary) { L.push(`## ${S.summary}`, cv.summary, ''); }
  if (cv.experiences.length) { L.push(`## ${S.experience}`); cv.experiences.forEach((i) => L.push(...itemMd(i))); }
  if (cv.projects.length) { L.push(`## ${S.projects}`); cv.projects.forEach((i) => L.push(...itemMd(i))); }
  if (cv.education.length) { L.push(`## ${S.education}`); cv.education.forEach((i) => L.push(...itemMd(i))); }
  if (cv.skillGroups.length) { L.push(`## ${S.skills}`); cv.skillGroups.forEach((g) => L.push(`- **${g.category}:** ${g.names.join(', ')}`)); L.push(''); }
  if (cv.languageSkills.length) { L.push(`## ${S.languages}`); cv.languageSkills.forEach((l) => L.push(`- ${l.language}${l.detail ? ' — ' + l.detail : ''}`)); L.push(''); }
  if (cv.certifications.length) { L.push(`## ${S.certifications}`); cv.certifications.forEach((c) => L.push(`- ${c.name}${c.issuer ? ' — ' + c.issuer : ''}`)); L.push(''); }
  if (cv.others.length) { L.push(`## ${S.other}`); cv.others.forEach((i) => L.push(...itemMd(i))); }
  return L.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
