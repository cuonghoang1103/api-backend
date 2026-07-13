/** Interview Simulator — shared frontend types (STATIC phase). */

export type InterviewLevel = 'INTERN' | 'FRESHER' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'PRINCIPAL';
export type InterviewQuestionType = 'CONCEPTUAL' | 'CODING' | 'SYSTEM_DESIGN' | 'BEHAVIORAL' | 'SCENARIO' | 'MCQ';
export type InterviewLanguage = 'VI' | 'EN';

export const LEVELS: InterviewLevel[] = ['INTERN', 'FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'PRINCIPAL'];

export interface RubricCriterion {
  id: string;
  criterion: string;
  weight: number;
}

export interface TaxonomyTopic {
  id: number;
  slug: string;
  name: string;
  nameVi?: string | null;
  weight: number;
}
export interface TaxonomyTrack {
  id: number;
  slug: string;
  name: string;
  nameVi?: string | null;
  topics: TaxonomyTopic[];
}
export interface TaxonomyDomain {
  id: number;
  slug: string;
  name: string;
  nameVi?: string | null;
  tracks: TaxonomyTrack[];
}
export interface CompanyProfile {
  id: number;
  slug: string;
  name: string;
  styleDescriptor: string;
  rigor: number;
}
export interface TaxonomyResponse {
  domains: TaxonomyDomain[];
  companyProfiles: CompanyProfile[];
}

export interface PublicTurn {
  order: number;
  questionText: string;
  type: InterviewQuestionType;
  mcqOptions?: { id: string; text: string }[];
  answered: boolean;
  userAnswer: string | null;
  referenceAnswer: string | null;
  rubric: RubricCriterion[] | null;
}

export interface SessionCreateResponse {
  id: number;
  trackName: string;
  level: InterviewLevel;
  language: InterviewLanguage;
  engineMode: string;
  total: number;
  turns: PublicTurn[];
}

export interface SessionState {
  id: number;
  status: string;
  trackName: string;
  level: InterviewLevel;
  language: InterviewLanguage;
  engineMode: string;
  focusedMode: boolean;
  companyStyle: string | null;
  total: number;
  hasReport: boolean;
  turns: PublicTurn[];
}

export interface DeterministicResult {
  mustHit: string[];
  mustMiss: string[];
  shouldHit: string[];
  shouldMiss: string[];
  redFlagsHit: string[];
  score: number;
  grade: string;
  injectionAttempted: boolean;
}

export interface SubmitAnswerResponse {
  order: number;
  type: string;
  referenceAnswer: string | null;
  rubric?: RubricCriterion[];
  deterministic?: DeterministicResult;
  injectionAttempted?: boolean;
  autoAdvance: boolean;
  // MCQ
  correct?: boolean;
  correctOptionId?: string | null;
  score?: number;
}

export interface SelfAssessResponse {
  order: number;
  self: { score: number; grade: string };
  deterministic: number | null;
  next: number | null;
}

export interface TopicBreakdown {
  topicId: number;
  topic: string;
  avgScore: number;
  questions: number;
  redFlags: number;
}
export interface ScoreBreakdown {
  byTopic: TopicBreakdown[];
  self: number | null;
  deterministic: number;
  divergence: number | null;
  redFlagTotal: number;
  answered: number;
  total: number;
}
export interface SuggestedResource {
  topicId: number;
  topic: string;
  note: string;
}

export interface InterviewReport {
  id: number;
  sessionId: number;
  overallScore: number | null;
  letterGrade: string | null;
  scoreBreakdown: ScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  actionableAdvice: string | null;
  suggestedResources: SuggestedResource[] | null;
  hireRecommendation: string | null;
}

export interface StoredTurnScore {
  deterministic: number | null;
  self: number | null;
  divergence: number | null;
  grade: string;
}
export interface StoredSelfScore {
  ratings?: Record<string, number>;
  score: number;
  grade: string;
}

export interface ReportTurn {
  order: number;
  topic: string | null;
  questionText: string;
  userAnswer: string | null;
  referenceAnswer: string | null;
  rubric: RubricCriterion[];
  deterministicScore: DeterministicResult | null;
  selfScore: StoredSelfScore | null;
  turnScore: StoredTurnScore | null;
  needsReview: boolean;
  injectionAttempted: boolean;
}
export interface ReportResponse {
  report: InterviewReport;
  turns: ReportTurn[];
}

export interface HistoryItem {
  id: number;
  track: string;
  level: string;
  status: string;
  engineMode: string;
  createdAt: string;
  overallScore: number | null;
  letterGrade: string | null;
}

export interface CreateSessionBody {
  trackId: number;
  level: InterviewLevel;
  companyProfileId?: number | null;
  language?: InterviewLanguage;
  numQuestions?: number;
  focusedMode?: boolean;
}

/** Client-collected integrity signals (non-invasive, informational). */
export interface IntegritySignals {
  pastes?: number;
  pastedChars?: number;
  tabBlurMs?: number;
  typedChars?: number;
  elapsedMs?: number;
}
