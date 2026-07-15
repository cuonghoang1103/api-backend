/**
 * CV Builder — JSON Resume export (Phase 4). jsonresume.org schema.
 * Cheap to add and it means the user's data is never trapped in the product —
 * it round-trips with our own JSON Resume import. Built from the raw profile
 * (not the render model) so ISO dates keep their precision.
 */
interface ProfileLike {
  fullName?: string | null; headline?: string | null; email?: string | null;
  phone?: string | null; location?: string | null; summary?: string | null; links?: unknown;
  items: Array<{
    kind: string; title: string; organization?: string | null; location?: string | null;
    startDate?: Date | null; endDate?: Date | null; url?: string | null; techStack?: string[];
    gpa?: string | null; bullets: Array<{ text: string }>;
  }>;
  skills: Array<{ name: string; category: string }>;
  languageSkills: Array<{ language: string; proficiency?: string | null }>;
  certifications: Array<{ name: string; issuer?: string | null; issueDate?: Date | null; url?: string | null }>;
}

const iso = (d?: Date | null) => (d ? d.toISOString().slice(0, 10) : undefined);

export function renderJsonResume(profile: ProfileLike): object {
  const links = (profile.links ?? {}) as Record<string, string>;
  const profiles = [
    links.github ? { network: 'GitHub', url: links.github } : null,
    links.linkedin ? { network: 'LinkedIn', url: links.linkedin } : null,
  ].filter(Boolean);

  const work = profile.items.filter((i) => i.kind === 'EXPERIENCE').map((i) => ({
    name: i.organization ?? undefined, position: i.title,
    startDate: iso(i.startDate), endDate: iso(i.endDate),
    url: i.url ?? undefined, highlights: i.bullets.map((b) => b.text),
  }));
  const projects = profile.items.filter((i) => i.kind === 'PROJECT' || i.kind === 'OPEN_SOURCE').map((i) => ({
    name: i.title, startDate: iso(i.startDate), endDate: iso(i.endDate),
    url: i.url ?? undefined, keywords: i.techStack ?? [], highlights: i.bullets.map((b) => b.text),
  }));
  const education = profile.items.filter((i) => i.kind === 'EDUCATION').map((i) => ({
    institution: i.organization ?? undefined, studyType: i.title,
    startDate: iso(i.startDate), endDate: iso(i.endDate), score: i.gpa ?? undefined,
  }));

  return {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: profile.fullName ?? '', label: profile.headline ?? '',
      email: profile.email ?? undefined, phone: profile.phone ?? undefined,
      summary: profile.summary ?? undefined,
      location: profile.location ? { address: profile.location } : undefined,
      profiles,
    },
    work,
    projects,
    education,
    skills: profile.skills.map((s) => ({ name: s.name, keywords: [] })),
    languages: profile.languageSkills.map((l) => ({ language: l.language, fluency: l.proficiency ?? undefined })),
    certificates: profile.certifications.map((c) => ({ name: c.name, issuer: c.issuer ?? undefined, date: iso(c.issueDate), url: c.url ?? undefined })),
  };
}
