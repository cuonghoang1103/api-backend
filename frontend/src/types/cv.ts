/**
 * CV Builder — shared frontend types. Mirror of the Prisma models the UI
 * touches in Phase 1 (master profile + its children). Dates arrive as ISO
 * strings over JSON.
 */
export type CvItemKind =
  | 'EXPERIENCE' | 'PROJECT' | 'EDUCATION' | 'OPEN_SOURCE'
  | 'PUBLICATION' | 'AWARD' | 'VOLUNTEER';

export type CvEmploymentType =
  | 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE' | 'VOLUNTEER';

export type CvSkillCategory =
  | 'LANGUAGE' | 'FRAMEWORK' | 'DATABASE' | 'INFRA' | 'TOOL' | 'PRACTICE' | 'SOFT';

export type CvBulletStrength = 'WEAK' | 'OK' | 'STRONG';

export type CvExperienceLevel = 'STUDENT' | 'FRESHER' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';

export interface CvBullet {
  id: number;
  itemId: number;
  text: string;
  userStatedFacts: string | null;
  verified: boolean;
  aiGenerated: boolean;
  skillsEvidenced: string[];
  strength: CvBulletStrength;
  sortOrder: number;
}

export interface CvItem {
  id: number;
  kind: CvItemKind;
  title: string;
  organization: string | null;
  location: string | null;
  employmentType: CvEmploymentType | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  url: string | null;
  techStack: string[];
  context: string | null;
  gpa: string | null;
  sortOrder: number;
  bullets: CvBullet[];
}

export interface CvSkill {
  id: number;
  name: string;
  category: CvSkillCategory;
  proficiency: string | null;
  yearsUsed: number | null;
  sortOrder: number;
}

export interface CvCertification {
  id: number;
  name: string;
  issuer: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  credentialId: string | null;
  url: string | null;
  sortOrder: number;
}

export interface CvLanguageSkill {
  id: number;
  language: string;
  proficiency: string | null;
  certName: string | null;
  certScore: string | null;
  sortOrder: number;
}

export interface CvProfileLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  website?: string;
  [k: string]: string | undefined;
}

export interface CvProfile {
  id: number;
  userId: number;
  fullName: string | null;
  headline: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  links: CvProfileLinks;
  photoR2Key: string | null;
  dateOfBirth: string | null;
  summary: string | null;
  targetRoles: string[];
  seniority: CvExperienceLevel | null;
  locationsPref: string[];
  remotePref: string | null;
  items: CvItem[];
  skills: CvSkill[];
  certifications: CvCertification[];
  languageSkills: CvLanguageSkill[];
}

export interface CvCompletenessCheck {
  key: string;
  label: string;
  done: boolean;
}

export interface CvCompleteness {
  percent: number;
  checks: CvCompletenessCheck[];
  counts: {
    items: number;
    bullets: number;
    skills: number;
    certifications: number;
    languageSkills: number;
    documents: number;
  };
}

// Bodies for create/update (partial-friendly). The backend zod schema is the
// source of truth; these are the shapes the editor sends.
export type CvProfilePatch = Partial<
  Pick<
    CvProfile,
    'fullName' | 'headline' | 'email' | 'phone' | 'location' | 'links'
    | 'dateOfBirth' | 'summary' | 'targetRoles' | 'seniority' | 'locationsPref' | 'remotePref'
  >
>;

// ── Import (Phase 2) ────────────────────────────────────────────
export type CvImportSource = 'PDF' | 'DOCX' | 'GITHUB' | 'LINKEDIN_ARCHIVE' | 'JSON_RESUME' | 'PASTE';
export type CvImportStatus = 'PENDING' | 'PARSING' | 'PARSED' | 'COMMITTED' | 'FAILED';

export interface DraftBullet { text: string; userStatedFacts?: string | null }
export interface DraftItem {
  kind: CvItemKind;
  title: string;
  organization?: string | null;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent?: boolean;
  url?: string | null;
  techStack?: string[];
  gpa?: string | null;
  bullets: DraftBullet[];
}
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
  skills: { name: string; category?: CvSkillCategory }[];
  languageSkills: { language: string; proficiency?: string | null; certName?: string | null; certScore?: string | null }[];
  certifications: { name: string; issuer?: string | null }[];
}
export interface ConfidenceFlag { field: string; reason: string }

export interface CvImportJob {
  id: number;
  source: CvImportSource;
  status: CvImportStatus;
  rawText?: string | null;
  parsedResult: ParsedDraft | null;
  confidenceFlags: ConfidenceFlag[] | null;
  hiddenTextFound: boolean;
  reviewedByUser: boolean;
  createdAt: string;
}

export interface GhCandidate {
  name: string;
  url: string | null;
  description: string | null;
  language: string | null;
  stars: number;
  topics: string[];
  pushedAt?: string;
  score: number;
  reason: string;
  hasReadme: boolean;
}

export interface CvImportCommitBody {
  applyContact?: boolean;
  applySummary?: boolean;
  draft: ParsedDraft;
}

// ── Tailored documents (Phase 11.2) ─────────────────────────────
export interface CvDocumentSummary {
  id: number;
  name: string;
  market: string;
  language: string;
  templateKey: string | null;
  status: string;
  outcomeLabel: string | null;
  updatedAt: string;
}
export interface CvDocumentReview {
  id: number;
  mode: string;
  verdict: string | null;
  score: number | null;
  sixSecondTest: string | null;
  createdAt: string;
}
export interface CvDocumentDetail {
  id: number;
  name: string;
  market: string;
  language: string;
  templateKey: string | null;
  experienceLevel: string;
  cvType: string;
  includedItemIds: { items?: number[]; skills?: number[] };
  pageTarget: number;
  outcomeLabel: string | null;
  status: string;
  targetJobId: number | null;
  reviews: CvDocumentReview[];
}
export type CvDocumentPatch = Partial<{
  name: string; market: string; language: string; experienceLevel: string; cvType: string;
  templateKey: string; includedItemIds: { items?: number[]; skills?: number[] };
  pageTarget: number; outcomeLabel: string | null; status: string; targetJobId: number | null;
}>;

// ── Job targeting (Phase 8a) ────────────────────────────────────
export interface CvJobSummary { id: number; title: string; company: string | null; createdAt: string }
export type CvCoverageLevel = 'GREEN' | 'AMBER' | 'RED';
export interface CvCoverageRow {
  skill: string;
  category: string;
  required: boolean;
  level: CvCoverageLevel;
  evidence: string | null;
}
export interface CvCoverage {
  job: { id: number; title: string; company: string | null; injectionAttempted: boolean };
  rows: CvCoverageRow[];
  summary: {
    verdict: 'STRONG' | 'STRETCH' | 'POOR';
    message: string;
    mustHaveTotal: number;
    mustHaveMatched: number;
    mustHaveStrong: number;
    gaps: string[];
  };
}
export interface CvTailor {
  note: string;
  reorder: { itemId: number; title: string; reason: string }[];
  consider_dropping: { itemId: number; title: string; reason: string }[];
}

// ── Rules engine / lint (Phase 3) ───────────────────────────────
export type CvSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR';
export interface CvBulletIssue { code: string; severity: CvSeverity; message: string }
export interface CvBulletVerdict {
  bulletId: number;
  itemId: number;
  strength: CvBulletStrength;
  issues: CvBulletIssue[];
}
export interface CvDocIssue {
  code: string;
  severity: CvSeverity;
  problem: string;
  suggestedFix?: string;
  location?: { itemId?: number; bulletId?: number; section?: string };
}
// ── AI Critique (Phase 7) ───────────────────────────────────────
export interface CvCritiqueIssue {
  severity: CvSeverity;
  location: string;
  problem: string;
  whyItMatters: string;
  suggestedFix: string;
  needsUserInput: boolean;
  clarifyingQuestion: string | null;
}
export interface CvInterviewRisk {
  claim: string;
  likelyQuestion: string;
  canYouAnswerIt: string;
}
export interface CvCritiqueResult {
  overallVerdict: 'INTERVIEW' | 'MAYBE' | 'REJECT';
  sixSecondTest: string;
  issues: CvCritiqueIssue[];
  strengths: string[];
  interviewRisks: CvInterviewRisk[];
  injectionAttempted: boolean;
  mode: 'AI';
}

export interface CvLintResult {
  market: string;
  level: string;
  score: number;
  band: 'INTERVIEW' | 'MAYBE' | 'REJECT';
  sixSecondTest: string;
  issues: CvDocIssue[];
  strengths: string[];
  bulletVerdicts: CvBulletVerdict[];
  skillGaps: string[];
  counts: { bullets: number; weakBullets: number; strongBullets: number; bulletsWithMetric: number; items: number };
  conventionNotes: { market: string; level: string };
}

export type CvItemInput = Partial<Omit<CvItem, 'id' | 'bullets'>> & { kind?: CvItemKind; title?: string };
export type CvBulletInput = Partial<Pick<CvBullet, 'text' | 'userStatedFacts' | 'skillsEvidenced' | 'strength' | 'sortOrder'>>;
export type CvSkillInput = Partial<Omit<CvSkill, 'id'>> & { name?: string };
export type CvCertInput = Partial<Omit<CvCertification, 'id'>> & { name?: string };
export type CvLangInput = Partial<Omit<CvLanguageSkill, 'id'>> & { language?: string };
