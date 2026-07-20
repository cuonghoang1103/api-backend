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
