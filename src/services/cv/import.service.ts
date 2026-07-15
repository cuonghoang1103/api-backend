/**
 * CV Builder — import pipeline (Phase 2a: paste + JSON Resume).
 * ─────────────────────────────────────────────────────────────────────────
 * Import is the front door: nobody retypes their career into a blank form.
 * Every source (paste today; PDF/DOCX/GitHub later) reduces to a structured
 * DRAFT that the user REVIEWS side-by-side before anything is written to the
 * master profile. Parsing is a first draft, never authoritative — low-confidence
 * fields are flagged so the user knows what to check.
 *
 * The heuristic parser here is deterministic (regex + section detection), so it
 * costs nothing and runs instantly. An LLM parse-fallback for the fields the
 * rules miss is a later phase (P6+), and will only ever fill gaps, never invent.
 */
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { NotFoundError, BadRequestError } from '../../middleware/errorHandler.js';
import type { CvItemKind, CvSkillCategory } from '@prisma/client';

// ─── The structured draft shape (what review UI renders + commit consumes) ──
export interface DraftBullet { text: string; userStatedFacts?: string | null }
export interface DraftItem {
  kind: CvItemKind;
  title: string;
  organization?: string | null;
  location?: string | null;
  startDate?: string | null; // "YYYY-MM" or "YYYY"
  endDate?: string | null;
  isCurrent?: boolean;
  url?: string | null;
  techStack?: string[];
  gpa?: string | null;
  bullets: DraftBullet[];
}
export interface DraftSkill { name: string; category?: CvSkillCategory }
export interface ParsedDraft {
  contact: {
    fullName?: string | null;
    headline?: string | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    links: { github?: string; linkedin?: string; portfolio?: string; website?: string };
  };
  summary?: string | null;
  items: DraftItem[];
  skills: DraftSkill[];
  languageSkills: { language: string; proficiency?: string | null; certName?: string | null; certScore?: string | null }[];
  certifications: { name: string; issuer?: string | null }[];
}
export interface ConfidenceFlag { field: string; reason: string }

// ─── Section-header dictionary (bilingual) ─────────────────────────────────
const SECTION_PATTERNS: { key: SectionKey; re: RegExp }[] = [
  { key: 'summary', re: /^(summary|profile|professional summary|objective|about( me)?|giới thiệu|tóm tắt|mục tiêu)\b/i },
  { key: 'experience', re: /^(work )?(experience|employment|work history|professional experience|kinh nghiệm( làm việc)?)\b/i },
  { key: 'projects', re: /^(projects?|personal projects?|dự án|sản phẩm)\b/i },
  { key: 'education', re: /^(education|academic|học vấn|học vấn & bằng cấp|trình độ học vấn)\b/i },
  { key: 'skills', re: /^(skills?|technical skills?|tech(nologies)?|kỹ năng|kỹ năng chuyên môn|công nghệ)\b/i },
  { key: 'languages', re: /^(languages?|ngoại ngữ|ngôn ngữ)\b/i },
  { key: 'certifications', re: /^(certifications?|certificates?|licenses?|chứng chỉ|chứng nhận)\b/i },
  { key: 'awards', re: /^(awards?|honou?rs?|achievements?|giải thưởng|thành tích)\b/i },
];
type SectionKey = 'summary' | 'experience' | 'projects' | 'education' | 'skills' | 'languages' | 'certifications' | 'awards';

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_RE = /(?:(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?){2,4}\d{2,4})/;
const URL_RE = /\b((?:https?:\/\/)?(?:www\.)?[a-z0-9-]+\.[a-z]{2,}(?:\/[^\s,]*)?)/gi;
const BULLET_RE = /^\s*[-•·*▪◦‣–]\s+/;
// A date range like "2021 - Present", "03/2020 – 2022", "Jan 2019 - Dec 2021"
const DATE_RANGE_RE = /((?:19|20)\d{2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|thg|tháng)[a-z]*\.?\s*(?:19|20)?\d{2,4}|\d{1,2}\/\d{4})\s*(?:[-–—to→]+|đến)\s*((?:present|now|current|hiện tại|nay)|(?:19|20)\d{2}|\d{1,2}\/\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*(?:19|20)?\d{2,4})/i;

function normalizeMonth(raw: string): string | null {
  const s = raw.trim().toLowerCase();
  if (/^(present|now|current|hiện tại|nay)$/.test(s)) return null;
  let m = s.match(/(\d{1,2})\/((?:19|20)\d{2})/);
  if (m) return `${m[2]}-${m[1].padStart(2, '0')}`;
  m = s.match(/((?:19|20)\d{2})/);
  if (m) return m[1];
  return null;
}

/**
 * The deterministic parser. Splits raw CV text into sections, then extracts
 * contact, summary, items (with bullets), skills, languages, certifications.
 * Returns the draft plus confidence flags for anything ambiguous.
 */
export function parseRawText(text: string): { draft: ParsedDraft; confidenceFlags: ConfidenceFlag[] } {
  const flags: ConfidenceFlag[] = [];
  const rawLines = text.replace(/\r/g, '').split('\n');
  const lines = rawLines.map((l) => l.replace(/\t/g, ' ').trimEnd());

  const draft: ParsedDraft = {
    contact: { links: {} },
    items: [],
    skills: [],
    languageSkills: [],
    certifications: [],
  };

  // ── Contact: scan the whole document for email/phone/links ──
  const joined = lines.join('\n');
  draft.contact.email = joined.match(EMAIL_RE)?.[0] ?? null;
  const phoneCand = joined.match(PHONE_RE)?.[0]?.trim();
  if (phoneCand && phoneCand.replace(/\D/g, '').length >= 8) draft.contact.phone = phoneCand;
  // Links live in the CV header, never the prose. Scanning the whole document
  // grabs tech terms from the summary ("Node.js", "Next.js") as fake websites.
  // Restrict to the top region, strip emails first, and reject file-extension-
  // like tokens. github/linkedin are matched by their distinctive domains.
  const headerText = lines.slice(0, 12).join('\n').replace(new RegExp(EMAIL_RE.source, 'gi'), ' ');
  const FILE_EXT_RE = /\.(js|ts|jsx|tsx|mjs|cjs|py|go|rb|rs|md|json|ya?ml|sh|css|s?html?|xml|sql|env|txt|png|jpe?g|pdf|docx?)$/i;
  const SAFE_TLD_RE = /\.(com|io|dev|me|net|org|vn|co|app|tech|page|xyz|info|pro|site|blog)(\/|$)/i;
  for (const m of headerText.matchAll(URL_RE)) {
    const raw = m[1];
    const u = raw.toLowerCase();
    if (u.includes('github.com')) { draft.contact.links.github ??= ensureHttp(raw); continue; }
    if (u.includes('linkedin.com')) { draft.contact.links.linkedin ??= ensureHttp(raw); continue; }
    if (draft.contact.links.website || u.includes('@')) continue;
    const host = u.replace(/^https?:\/\//, '').split('/')[0];
    const isExplicit = /^(https?:\/\/|www\.)/i.test(raw);
    if (FILE_EXT_RE.test(host)) continue; // "Node.js", "app.tsx" → not a website
    if (isExplicit || SAFE_TLD_RE.test(u)) draft.contact.links.website = ensureHttp(raw);
  }

  // ── Name + headline: first 1–2 non-empty lines that aren't contact noise ──
  const firstReal = lines.findIndex((l) => l.trim() && !EMAIL_RE.test(l) && !URL_RE.test(l));
  if (firstReal >= 0) {
    const nameLine = lines[firstReal].trim();
    if (nameLine.length <= 60 && !/[:@]/.test(nameLine)) {
      draft.contact.fullName = nameLine;
      const next = lines[firstReal + 1]?.trim();
      if (next && next.length <= 80 && !EMAIL_RE.test(next) && !DATE_RANGE_RE.test(next)) {
        draft.contact.headline = next;
      }
    } else {
      flags.push({ field: 'fullName', reason: 'Không chắc dòng nào là họ tên — kiểm tra lại' });
    }
  }
  if (!draft.contact.email) flags.push({ field: 'email', reason: 'Không tìm thấy email trong văn bản' });

  // ── Split into sections by header lines ──
  const sections = splitSections(lines);
  if (!sections.some((s) => s.key === 'experience' || s.key === 'projects')) {
    flags.push({ field: 'experience', reason: 'Không nhận ra mục kinh nghiệm/dự án — có thể cần chỉnh tay' });
  }

  for (const sec of sections) {
    const body = sec.lines;
    switch (sec.key) {
      case 'summary':
        draft.summary = body.join(' ').replace(/\s+/g, ' ').trim() || null;
        break;
      case 'experience':
        draft.items.push(...parseItems(body, 'EXPERIENCE', flags));
        break;
      case 'projects':
        draft.items.push(...parseItems(body, 'PROJECT', flags));
        break;
      case 'education':
        draft.items.push(...parseItems(body, 'EDUCATION', flags));
        break;
      case 'skills':
        draft.skills.push(...parseSkills(body));
        break;
      case 'languages':
        draft.languageSkills.push(...parseLanguages(body));
        break;
      case 'certifications':
        draft.certifications.push(...body.map((l) => l.replace(BULLET_RE, '').trim()).filter(Boolean).map((name) => ({ name })));
        break;
      case 'awards':
        // Model awards as items so they can carry a describing bullet.
        for (const l of body.map((x) => x.replace(BULLET_RE, '').trim()).filter(Boolean)) {
          draft.items.push({ kind: 'AWARD', title: l, bullets: [] });
        }
        break;
    }
  }

  if (draft.skills.length === 0) flags.push({ field: 'skills', reason: 'Chưa tách được kỹ năng — thêm ở bước sau nếu thiếu' });
  return { draft, confidenceFlags: flags };
}

function ensureHttp(u: string): string {
  return /^https?:\/\//i.test(u) ? u : `https://${u}`;
}

function splitSections(lines: string[]): { key: SectionKey | 'header'; lines: string[] }[] {
  const out: { key: SectionKey | 'header'; lines: string[] }[] = [];
  let current: { key: SectionKey | 'header'; lines: string[] } = { key: 'header', lines: [] };
  const isHeader = (line: string): SectionKey | null => {
    const t = line.trim();
    if (!t || t.length > 40) return null;
    // Header heuristic: short line, matches a known section word, few words.
    for (const p of SECTION_PATTERNS) if (p.re.test(t)) return p.key;
    return null;
  };
  for (const line of lines) {
    const key = isHeader(line);
    if (key) {
      if (current.lines.length || current.key !== 'header') out.push(current);
      current = { key, lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  out.push(current);
  return out.filter((s) => s.key !== 'header'); // drop the pre-first-header block
}

/**
 * Parse an experience/project/education section body into items. A non-bullet,
 * non-empty line (especially one carrying a date range) starts a new item; its
 * title/org are split heuristically. Bullet lines attach to the current item.
 */
function parseItems(body: string[], kind: CvItemKind, flags: ConfidenceFlag[]): DraftItem[] {
  const items: DraftItem[] = [];
  let cur: DraftItem | null = null;
  const push = () => { if (cur) items.push(cur); };

  for (const raw of body) {
    const line = raw.trim();
    if (!line) continue;
    if (BULLET_RE.test(raw)) {
      const text = raw.replace(BULLET_RE, '').trim();
      if (!cur) cur = { kind, title: '(chưa rõ tiêu đề)', bullets: [] };
      if (text) cur.bullets.push({ text });
      continue;
    }
    // A standalone GPA line belongs to the current item, not a new one.
    const gpaOnly = line.match(/^gpa[:\s]*([0-9.]+(?:\s*\/\s*[0-9.]+)?)\s*$/i);
    if (gpaOnly && cur) { cur.gpa = gpaOnly[1].replace(/\s/g, ''); continue; }
    // Header line for a new item.
    push();
    cur = { kind, title: line, bullets: [] };
    const dm = line.match(DATE_RANGE_RE);
    if (dm) {
      cur.startDate = normalizeMonth(dm[1]);
      const end = normalizeMonth(dm[2]);
      cur.endDate = end;
      cur.isCurrent = /present|now|current|hiện tại|nay/i.test(dm[2]);
      // Strip the date from the title, split remaining "Title — Org" / "Title, Org".
      cur.title = line.replace(dm[0], '').replace(/[|,–—-]\s*$/, '').trim() || line;
    }
    const parts = cur.title.split(/\s+(?:[-–—|@]|at|tại)\s+/i);
    if (parts.length >= 2) {
      cur.title = parts[0].trim();
      cur.organization = parts.slice(1).join(' ').trim();
    }
    if (kind === 'EDUCATION') {
      const gpa = line.match(/gpa[:\s]*([0-9.]+(?:\s*\/\s*[0-9.]+)?)/i);
      if (gpa) cur.gpa = gpa[1].replace(/\s/g, '');
    }
  }
  push();
  if (items.some((i) => i.title === '(chưa rõ tiêu đề)')) {
    flags.push({ field: `${kind.toLowerCase()}.title`, reason: 'Vài mục không rõ tiêu đề — kiểm tra lại' });
  }
  return items;
}

function parseSkills(body: string[]): DraftSkill[] {
  const names = new Set<string>();
  for (const raw of body) {
    // Skills often appear as "Category: a, b, c" or comma/pipe lists.
    const afterColon = raw.includes(':') ? raw.slice(raw.indexOf(':') + 1) : raw;
    for (const tok of afterColon.split(/[,•|/·]|\s{2,}/)) {
      const s = tok.replace(BULLET_RE, '').trim();
      if (s && s.length <= 40 && !/^[-–—]$/.test(s)) names.add(s);
    }
  }
  return [...names].slice(0, 80).map((name) => ({ name }));
}

function parseLanguages(body: string[]): ParsedDraft['languageSkills'] {
  const out: ParsedDraft['languageSkills'] = [];
  for (const raw of body) {
    const line = raw.replace(BULLET_RE, '').trim();
    if (!line) continue;
    const cert = line.match(/\b(IELTS|TOEIC|TOEFL|JLPT|HSK)\b[:\s]*([0-9.]+|N[1-5])?/i);
    // "English — Professional (IELTS 7.5)" style.
    const langPart = line.split(/[-–—:(]/)[0].trim();
    if (langPart) {
      out.push({
        language: langPart.slice(0, 60),
        proficiency: line.replace(langPart, '').replace(/^[-–—:()\s]+/, '').replace(/[()]/g, '').trim() || null,
        certName: cert?.[1]?.toUpperCase() ?? null,
        certScore: cert?.[2] ?? null,
      });
    }
  }
  return out;
}

// ─── JSON Resume mapping (jsonresume.org schema) ───────────────────────────
export function mapJsonResume(json: unknown): { draft: ParsedDraft; confidenceFlags: ConfidenceFlag[] } {
  const r = (json ?? {}) as Record<string, any>;
  const basics = r.basics ?? {};
  const draft: ParsedDraft = {
    contact: {
      fullName: basics.name ?? null,
      headline: basics.label ?? null,
      email: basics.email ?? null,
      phone: basics.phone ?? null,
      location: [basics.location?.city, basics.location?.region, basics.location?.countryCode].filter(Boolean).join(', ') || null,
      links: {},
    },
    summary: basics.summary ?? null,
    items: [],
    skills: [],
    languageSkills: [],
    certifications: [],
  };
  for (const p of basics.profiles ?? []) {
    const net = String(p.network ?? '').toLowerCase();
    const url = p.url ?? '';
    if (net.includes('github')) draft.contact.links.github = url;
    else if (net.includes('linkedin')) draft.contact.links.linkedin = url;
    else if (url) draft.contact.links.website ??= url;
  }
  if (basics.url) draft.contact.links.portfolio = basics.url;

  const asItem = (kind: CvItemKind, o: Record<string, any>, titleKey: string, orgKey: string): DraftItem => ({
    kind,
    title: o[titleKey] ?? o.name ?? o.title ?? '(chưa rõ)',
    organization: o[orgKey] ?? null,
    location: o.location ?? null,
    startDate: o.startDate ?? null,
    endDate: o.endDate ?? null,
    isCurrent: !!o.startDate && !o.endDate,
    url: o.url ?? null,
    techStack: Array.isArray(o.keywords) ? o.keywords : [],
    bullets: [
      // JSON Resume uses `summary` on work, `description` on projects.
      ...(o.summary ? [{ text: String(o.summary) }] : []),
      ...(o.description ? [{ text: String(o.description) }] : []),
      ...((o.highlights ?? []) as unknown[]).map((h) => ({ text: String(h) })),
    ],
  });

  for (const w of r.work ?? []) draft.items.push(asItem('EXPERIENCE', w, 'position', 'name'));
  for (const p of r.projects ?? []) draft.items.push(asItem('PROJECT', p, 'name', 'entity'));
  for (const e of r.education ?? []) {
    draft.items.push({
      kind: 'EDUCATION',
      title: [e.studyType, e.area].filter(Boolean).join(' '),
      organization: e.institution ?? null,
      startDate: e.startDate ?? null,
      endDate: e.endDate ?? null,
      gpa: e.score ?? null,
      bullets: [],
    });
  }
  for (const s of r.skills ?? []) {
    if (s.name) draft.skills.push({ name: s.name });
    for (const k of s.keywords ?? []) draft.skills.push({ name: String(k) });
  }
  for (const l of r.languages ?? []) {
    if (l.language) draft.languageSkills.push({ language: l.language, proficiency: l.fluency ?? null });
  }
  for (const c of [...(r.certificates ?? []), ...(r.awards ?? [])]) {
    if (c.name || c.title) draft.certifications.push({ name: c.name ?? c.title, issuer: c.issuer ?? c.awarder ?? null });
  }
  return { draft, confidenceFlags: [] };
}

// ─── ImportJob lifecycle ───────────────────────────────────────────────────
const pasteSchema = z.object({ text: z.string().min(20, 'Cần ít nhất vài dòng nội dung').max(60000) });

export async function createPasteImport(userId: number, body: unknown) {
  const { text } = pasteSchema.parse(body);
  const { draft, confidenceFlags } = parseRawText(text);
  return prisma.cvImportJob.create({
    data: {
      userId,
      source: 'PASTE',
      status: 'PARSED',
      rawText: text.slice(0, 60000),
      parsedResult: draft as unknown as object,
      confidenceFlags: confidenceFlags as unknown as object,
    },
  });
}

export async function createJsonResumeImport(userId: number, json: unknown) {
  if (!json || typeof json !== 'object') throw new BadRequestError('JSON Resume không hợp lệ');
  const { draft, confidenceFlags } = mapJsonResume(json);
  return prisma.cvImportJob.create({
    data: {
      userId,
      source: 'JSON_RESUME',
      status: 'PARSED',
      rawText: JSON.stringify(json).slice(0, 60000),
      parsedResult: draft as unknown as object,
      confidenceFlags: confidenceFlags as unknown as object,
    },
  });
}

export async function getImport(userId: number, jobId: number) {
  const job = await prisma.cvImportJob.findFirst({ where: { id: jobId, userId } });
  if (!job) throw new NotFoundError('Không tìm thấy phiên nhập');
  return job;
}

export async function listImports(userId: number) {
  return prisma.cvImportJob.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { id: true, source: true, status: true, reviewedByUser: true, hiddenTextFound: true, createdAt: true },
  });
}

// ── Commit: write the user-reviewed draft into the master profile ──────────
const commitSchema = z.object({
  applyContact: z.boolean().optional(),
  applySummary: z.boolean().optional(),
  draft: z.object({
    contact: z.object({
      fullName: z.string().nullish(),
      headline: z.string().nullish(),
      email: z.string().nullish(),
      phone: z.string().nullish(),
      location: z.string().nullish(),
      links: z.record(z.string()).optional(),
    }).optional(),
    summary: z.string().nullish(),
    items: z.array(z.object({
      kind: z.enum(['EXPERIENCE', 'PROJECT', 'EDUCATION', 'OPEN_SOURCE', 'PUBLICATION', 'AWARD', 'VOLUNTEER']),
      title: z.string().min(1),
      organization: z.string().nullish(),
      location: z.string().nullish(),
      startDate: z.string().nullish(),
      endDate: z.string().nullish(),
      isCurrent: z.boolean().optional(),
      url: z.string().nullish(),
      techStack: z.array(z.string()).optional(),
      gpa: z.string().nullish(),
      bullets: z.array(z.object({ text: z.string().min(1), userStatedFacts: z.string().nullish() })).optional(),
    })).optional(),
    skills: z.array(z.object({ name: z.string().min(1), category: z.string().optional() })).optional(),
    languageSkills: z.array(z.object({ language: z.string().min(1), proficiency: z.string().nullish(), certName: z.string().nullish(), certScore: z.string().nullish() })).optional(),
    certifications: z.array(z.object({ name: z.string().min(1), issuer: z.string().nullish() })).optional(),
  }),
});

const toDate = (v?: string | null): Date | null => {
  if (!v) return null;
  const d = new Date(v.length === 7 ? `${v}-01` : v.length === 4 ? `${v}-01-01` : v);
  return Number.isNaN(d.getTime()) ? null : d;
};

/**
 * Commit a reviewed draft. APPENDS to the profile (never destructive) — import
 * augments the master record, it doesn't replace it. Contact/summary are only
 * overwritten when the user opts in and the profile field is empty or they
 * explicitly asked to apply.
 */
export async function commitImport(userId: number, jobId: number, body: unknown) {
  const { draft, applyContact, applySummary } = commitSchema.parse(body);
  const job = await prisma.cvImportJob.findFirst({ where: { id: jobId, userId } });
  if (!job) throw new NotFoundError('Không tìm thấy phiên nhập');
  if (job.status === 'COMMITTED') throw new BadRequestError('Phiên nhập này đã được lưu rồi');

  const profile = await prisma.cvProfile.upsert({ where: { userId }, update: {}, create: { userId }, select: { id: true } });
  const profileId = profile.id;

  await prisma.$transaction(async (tx) => {
    // Contact / summary — opt-in overwrite.
    const c = draft.contact;
    if (applyContact && c) {
      await tx.cvProfile.update({
        where: { userId },
        data: {
          ...(c.fullName ? { fullName: c.fullName } : {}),
          ...(c.headline ? { headline: c.headline } : {}),
          ...(c.email ? { email: c.email } : {}),
          ...(c.phone ? { phone: c.phone } : {}),
          ...(c.location ? { location: c.location } : {}),
          ...(c.links ? { links: c.links } : {}),
        },
      });
    }
    if (applySummary && draft.summary) {
      await tx.cvProfile.update({ where: { userId }, data: { summary: draft.summary } });
    }

    // Items + their bullets — always appended.
    let itemOrder = await tx.cvItem.count({ where: { profileId } });
    for (const it of draft.items ?? []) {
      const created = await tx.cvItem.create({
        data: {
          profileId,
          kind: it.kind as CvItemKind,
          title: it.title,
          organization: it.organization ?? null,
          location: it.location ?? null,
          startDate: toDate(it.startDate),
          endDate: it.isCurrent ? null : toDate(it.endDate),
          isCurrent: it.isCurrent ?? false,
          url: it.url ?? null,
          techStack: it.techStack ?? [],
          gpa: it.gpa ?? null,
          sortOrder: itemOrder++,
        },
      });
      let bOrder = 0;
      for (const b of it.bullets ?? []) {
        await tx.cvBullet.create({
          data: {
            itemId: created.id,
            text: b.text,
            userStatedFacts: b.userStatedFacts ?? null,
            // Imported bullets are the user's own prior words → verified.
            verified: true,
            aiGenerated: false,
            sortOrder: bOrder++,
          },
        });
      }
    }

    // Skills / languages / certs — append, de-duped against existing by name.
    const existingSkills = new Set((await tx.cvSkill.findMany({ where: { profileId }, select: { name: true } })).map((s) => s.name.toLowerCase()));
    let sOrder = existingSkills.size;
    for (const s of draft.skills ?? []) {
      if (existingSkills.has(s.name.toLowerCase())) continue;
      existingSkills.add(s.name.toLowerCase());
      await tx.cvSkill.create({ data: { profileId, name: s.name, category: (s.category as CvSkillCategory) ?? 'TOOL', sortOrder: sOrder++ } });
    }
    let lOrder = await tx.cvLanguageSkill.count({ where: { profileId } });
    for (const l of draft.languageSkills ?? []) {
      await tx.cvLanguageSkill.create({ data: { profileId, language: l.language, proficiency: l.proficiency ?? null, certName: l.certName ?? null, certScore: l.certScore ?? null, sortOrder: lOrder++ } });
    }
    let cOrder = await tx.cvCertification.count({ where: { profileId } });
    for (const ct of draft.certifications ?? []) {
      await tx.cvCertification.create({ data: { profileId, name: ct.name, issuer: ct.issuer ?? null, sortOrder: cOrder++ } });
    }

    await tx.cvImportJob.update({ where: { id: jobId }, data: { status: 'COMMITTED', reviewedByUser: true } });
  });

  const counts = {
    items: (draft.items ?? []).length,
    skills: (draft.skills ?? []).length,
    languageSkills: (draft.languageSkills ?? []).length,
    certifications: (draft.certifications ?? []).length,
  };
  return { committed: true, counts };
}
