/**
 * CV Builder — normalized render model (Phase 4 export).
 * Maps the master profile into a flat, format-agnostic shape that every
 * renderer (PDF/DOCX/TXT/MD/JSON) consumes, so date formatting, item grouping
 * and skill categorization live in ONE place.
 */
export interface RenderItem {
  kind: string;
  title: string;
  organization?: string | null;
  location?: string | null;
  dateRange: string;
  url?: string | null;
  techStack: string[];
  gpa?: string | null;
  bullets: string[];
}
export interface RenderCv {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth: string | null; // shown only by VN-market templates
  links: { label: string; url: string }[];
  summary: string;
  experiences: RenderItem[];
  projects: RenderItem[];
  education: RenderItem[];
  others: RenderItem[]; // open source / award / publication / volunteer
  skillGroups: { category: string; names: string[] }[];
  languageSkills: { language: string; detail: string }[];
  certifications: { name: string; issuer?: string | null }[];
}

const MONTHS_VI = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
function fmtMonth(d?: Date | null): string {
  if (!d) return '';
  return `${MONTHS_VI[d.getMonth()]}/${d.getFullYear()}`;
}
function dateRange(start?: Date | null, end?: Date | null, isCurrent?: boolean): string {
  const s = fmtMonth(start);
  const e = isCurrent ? 'nay' : fmtMonth(end);
  if (s && e) return `${s} – ${e}`;
  return s || e || '';
}

const SKILL_CAT_LABEL: Record<string, string> = {
  LANGUAGE: 'Ngôn ngữ', FRAMEWORK: 'Framework', DATABASE: 'Database',
  INFRA: 'Hạ tầng', TOOL: 'Công cụ', PRACTICE: 'Kỹ thuật', SOFT: 'Kỹ năng mềm',
};

// Loosely typed to accept the Prisma profile-with-includes without importing
// the generated types into every renderer.
interface ProfileLike {
  fullName?: string | null; headline?: string | null; email?: string | null;
  phone?: string | null; location?: string | null; summary?: string | null;
  dateOfBirth?: Date | null;
  links?: unknown;
  items: Array<{
    kind: string; title: string; organization?: string | null; location?: string | null;
    startDate?: Date | null; endDate?: Date | null; isCurrent?: boolean; url?: string | null;
    techStack?: string[]; gpa?: string | null; bullets: Array<{ text: string }>;
  }>;
  skills: Array<{ name: string; category: string }>;
  languageSkills: Array<{ language: string; proficiency?: string | null; certName?: string | null; certScore?: string | null }>;
  certifications: Array<{ name: string; issuer?: string | null }>;
}

export function toRenderCv(profile: ProfileLike): RenderCv {
  const linksObj = (profile.links ?? {}) as Record<string, string>;
  const links = ([
    ['GitHub', linksObj.github], ['LinkedIn', linksObj.linkedin],
    ['Portfolio', linksObj.portfolio], ['Website', linksObj.website],
  ] as [string, string | undefined][]).filter(([, u]) => !!u).map(([label, url]) => ({ label, url: url! }));

  const mapItem = (it: ProfileLike['items'][number]): RenderItem => ({
    kind: it.kind,
    title: it.title,
    organization: it.organization,
    location: it.location,
    dateRange: dateRange(it.startDate ?? null, it.endDate ?? null, it.isCurrent),
    url: it.url,
    techStack: it.techStack ?? [],
    gpa: it.gpa,
    bullets: it.bullets.map((b) => b.text),
  });
  const byKind = (k: string) => profile.items.filter((i) => i.kind === k).map(mapItem);

  const skillGroups: RenderCv['skillGroups'] = [];
  for (const cat of Object.keys(SKILL_CAT_LABEL)) {
    const names = profile.skills.filter((s) => s.category === cat).map((s) => s.name);
    if (names.length) skillGroups.push({ category: SKILL_CAT_LABEL[cat], names });
  }

  return {
    fullName: profile.fullName ?? '',
    headline: profile.headline ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    location: profile.location ?? '',
    dateOfBirth: profile.dateOfBirth
      ? `${String(profile.dateOfBirth.getDate()).padStart(2, '0')}/${String(profile.dateOfBirth.getMonth() + 1).padStart(2, '0')}/${profile.dateOfBirth.getFullYear()}`
      : null,
    links,
    summary: profile.summary ?? '',
    experiences: byKind('EXPERIENCE'),
    projects: [...byKind('PROJECT'), ...byKind('OPEN_SOURCE')],
    education: byKind('EDUCATION'),
    others: [...byKind('AWARD'), ...byKind('PUBLICATION'), ...byKind('VOLUNTEER')],
    skillGroups,
    languageSkills: profile.languageSkills.map((l) => ({
      language: l.language,
      detail: [l.proficiency, l.certName ? `${l.certName} ${l.certScore ?? ''}`.trim() : ''].filter(Boolean).join(' · '),
    })),
    certifications: profile.certifications.map((c) => ({ name: c.name, issuer: c.issuer })),
  };
}

/** Filename like NguyenVanA_Backend_Engineer_CV.pdf — recruiters see it. */
export function suggestFilename(cv: RenderCv, ext: string): string {
  const name = (cv.fullName || 'CV').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd');
  const role = (cv.headline || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
  return [name, role, 'CV'].filter(Boolean).join('_').replace(/[^a-zA-Z0-9_]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') + '.' + ext;
}
