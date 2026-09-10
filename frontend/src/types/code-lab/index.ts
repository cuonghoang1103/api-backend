/**
 * Code Lab — TypeScript types (shared by the public hub + admin console).
 * All content is authored in English.
 */
import type { DocBlock } from '@/types/exp-hub';

export type CodeLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type CodeDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
export type CodeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type CodeProgressStatus = 'IN_PROGRESS' | 'SOLVED';

export interface CodeBlock {
  name: string;
  language: string;
  code: string;
}
export interface ExampleIO {
  input: string;
  output: string;
  explanation: string;
}
export interface ImageItem {
  url: string;
  caption?: string;
}

export interface CodeGroup {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  tracks?: CodeTrack[];
}

export interface CodeTrack {
  id: number;
  groupId: number;
  name: string;
  slug: string;
  language: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  coverImageUrl?: string | null;
  docsUrl?: string | null;
  level: CodeLevel;
  sortOrder: number;
  status: CodeStatus;
  createdAt: string;
  updatedAt: string;
  exerciseCount?: number;
  moduleCount?: number;
  group?: { id: number; name: string; slug: string };
  modules?: CodeModule[];
}

export interface CodeModule {
  id: number;
  trackId: number;
  name: string;
  slug: string;
  description?: string | null;
  level: CodeLevel;
  sortOrder: number;
  exercises?: CodeExerciseListItem[];
  // NTU-style lesson: the block array isn't shipped in the roadmap tree — only
  // this flag. Fetch the full lesson on demand via codeLabApi.getLesson.
  hasLesson?: boolean;
}

// A module's NTU-style lesson reuses the SAME DocBlock system as Exp Hub docs.
export interface CodeLesson {
  id: number;
  name: string;
  blocks: DocBlock[];
  lessonGeneratedAt?: string | null;
}

export interface CodeExerciseListItem {
  id: number;
  moduleId: number;
  trackId: number;
  title: string;
  slug: string;
  difficulty: CodeDifficulty;
  sortOrder: number;
  status: CodeStatus;
  language: string;
  points: number;
  estimatedMinutes?: number | null;
  viewCount: number;
  solveCount: number;
  tags?: string[] | null;
  track?: { slug: string };
}

export interface CodeExercise extends CodeExerciseListItem {
  problemHtml?: string | null;
  problemHtmlVi?: string | null;
  concepts?: string[] | null;
  prerequisites?: string[] | null;
  inputSpec?: string | null;
  outputSpec?: string | null;
  constraints?: string | null;
  examplesJson?: ExampleIO[] | null;
  hintsJson?: string[] | null;
  starterCodeJson?: CodeBlock[] | null;
  solutionCodeJson?: CodeBlock[] | null;
  solutionExplanationHtml?: string | null;
  solutionExplanationHtmlVi?: string | null;
  diagramImageUrl?: string | null;
  briefPdfUrl?: string | null;
  briefFileUrl?: string | null;
  githubUrl?: string | null;
  sourceUrl?: string | null;
  diagramMermaid?: string | null;
  imagesJson?: ImageItem[] | null;
  youtubeUrl?: string | null;
  referenceUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  module?: { id: number; name: string; slug: string };
  track?: { id: number; name: string; slug: string; language: string; color?: string | null; groupId: number };
  author?: { id: number; username: string; fullName?: string | null; avatarUrl?: string | null } | null;
}

export interface CodeProgress {
  id: number;
  userId: number;
  exerciseId: number;
  status: CodeProgressStatus;
  savedCode?: CodeBlock[] | null;
  solvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MyProgressItem {
  exerciseId: number;
  status: CodeProgressStatus;
  solvedAt?: string | null;
  savedCode?: CodeBlock[] | null;
}

export interface CodeStats {
  groups: number;
  tracks: number;
  modules: number;
  exercises: number;
  solved: number;
  byDifficulty: Array<{ difficulty: CodeDifficulty; _count: number }>;
}

// ─── AI proposals ───────────────────────────────────────────────
export interface RoadmapModuleProposal {
  name: string;
  description: string;
  level: CodeLevel;
  exerciseTitles: string[];
}
export interface ExerciseProposal {
  title: string;
  difficulty: CodeDifficulty;
  estimatedMinutes: number;
  points: number;
  concepts: string[];
  prerequisites: string[];
  problemHtml: string;
  inputSpec: string;
  outputSpec: string;
  constraints: string;
  examples: ExampleIO[];
  hints: string[];
  starterCode: CodeBlock[];
  solutionCode: CodeBlock[];
  solutionExplanationHtml: string;
  tags: string[];
}


// ─── Practice coach (Pro) ───────────────────────────────────────
export type VivaMode = 'explain' | 'change';

export interface VivaQuestion {
  question: string; questionVi: string; hint: string; hintVi: string;
  focus: string; mode: VivaMode;
}

export interface VivaGrade {
  score: number; verdict: string; verdictVi: string;
  good: string[]; goodVi: string[]; missing: string[]; missingVi: string[];
  modelAnswer: string; modelAnswerVi: string;
}

export interface SpecCheckItem {
  requirement: string; requirementVi: string;
  status: 'met' | 'partial' | 'missing';
  evidence: string; evidenceVi: string; fix: string; fixVi: string;
}

export interface SpecCheck {
  summary: string; summaryVi: string; met: number; total: number;
  items: SpecCheckItem[]; risks: string[]; risksVi: string[];
}

/** One required class/package from the brief's project tree, located (or not). */
export interface ProjectStructureItem {
  expected: string; expectedVi: string;
  status: 'ok' | 'misplaced' | 'missing';
  actual: string; actualVi: string;
}
/** A whole-project review: the checklist, plus what only a project can show. */
export interface ProjectCheck extends SpecCheck {
  structure: ProjectStructureItem[];
  vivaQuestions: string[]; vivaQuestionsVi: string[];
  files: { included: number; skipped: number; truncated: boolean; tree: string[] };
}

export interface SkillCoverageItem { skill: string; total: number; solved: number; inProgress: number }
export interface SkillCoverageResponse {
  track: { id: number; name: string; slug: string };
  skills: SkillCoverageItem[];
  totalExercises: number;
  solvedExercises: number;
}

// ─── Phòng Lab ──────────────────────────────────────────────────
// Chọn một nhóm bài trong track, đặt mục tiêu LOC, làm từng bài có gia sư AI
// kèm và một vòng nộp .zip cho AI chấm thay thầy.

export type LabRoomItemStatus = 'PENDING' | 'IN_PROGRESS' | 'PASSED';

export interface LabRoomItem {
  id: number;
  exerciseId: number;
  slug: string;
  title: string;
  difficulty: CodeDifficulty;
  estimatedMinutes: number | null;
  /** LOC chốt lúc chọn — cố ý KHÔNG đọc lại từ đề, xem chú thích ở service. */
  loc: number;
  status: LabRoomItemStatus;
  passedAt: string | null;
  coGioiThieu: boolean;
  coKetQuaCham: boolean;
  coHuongDanReview: boolean;
}

export interface LabRoom {
  id: number;
  name: string;
  locGoal: number;
  /** Cộng dồn LOC của những bài ĐÃ ĐẠT. */
  locDaDat: number;
  /** Cộng dồn LOC của mọi bài đã chọn vào phòng. */
  locDaChon: number;
  soBai: number;
  soBaiDat: number;
  activeItemId: number | null;
  track: { id: number; slug: string; name: string; color: string | null };
  createdAt: string;
  updatedAt: string;
  items: LabRoomItem[];
}

export type LabRoomSummary = Omit<LabRoom, 'items' | 'activeItemId' | 'createdAt'>;

export interface LabRoomIntro {
  tongQuan: string;
  yeuCauBatBuoc: string[];
  kienTruc: {
    tang: Array<{ goi: string; file: string; viec: string }>;
    viSao: string;
  };
  cacBuoc: string[];
  bayCanTranh: string[];
  cauHoiVanDap: string[];
  locUocTinh: number;
}

export interface LabRoomReview {
  dat: boolean;
  diem: number | null;
  chay: {
    bienDichDuoc: boolean | null;
    lyDo?: string | null;
    khopManHinh: 'khop' | 'lech' | 'khong-chac';
    lechChoNao?: string[];
  };
  theoQuyTac: Array<{ muc: string; ket: 'dat' | 'thieu' | 'sai'; chiTiet: string; file?: string | null; dong?: number | null }>;
  thieuSoVoiDe: string[];
  hieuBaiKhong: Array<{ hoi: string; viSao: string; traLoiTot: string }>;
  phaiSuaTruocKhiNop: string[];
  diemManh: string[];
  nhanXet: string;
  chamLuc: string;
}

export interface LabRoomGuide {
  moDau: string;
  thuTuTrinhBay: Array<{ buoc: string; noiGi: string; moFileNao: string; viSao: string }>;
  chiVaoDau: Array<{ khiThayHoi: string; moFileNao: string; noiGi: string }>;
  cauHoiChacChanBiHoi: Array<{ hoi: string; traLoiNgan: string }>;
  dungLam: string[];
  chotHa: string;
}

export interface LabRoomChatTurn {
  role: 'user' | 'assistant';
  content: string;
}
