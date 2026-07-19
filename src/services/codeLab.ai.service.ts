/**
 * ============================================================
 * Code Lab — ADMIN AI generator
 * ============================================================
 *
 * Two admin-only generators, both ENGLISH-only, NTU-exercise-style:
 *   1. generateRoadmap  — propose an ordered set of modules (+ exercise
 *      titles) for a track. Preview only, no DB write.
 *   2. generateExercises — propose a batch of FULL exercises (problem,
 *      I/O, worked examples, concepts, hints, starter + official solution
 *      + explanation) for a module. Preview only.
 * commitExercises persists the (admin-reviewed / edited) proposals.
 *
 * Reuses the interview LLM gateway (step 'generation' = strongest model,
 * feature 'exphub') and the shared per-user token quota — no new vendor/key.
 */
import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';
import { looseJson } from './myLanguage.ai.service.js';
import * as codeLab from './codeLab.service.js';

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
const DIFFS = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as const;
type Level = (typeof LEVELS)[number];
type Diff = (typeof DIFFS)[number];

function s(v: unknown): string {
  return typeof v === 'string' ? v.trim() : v == null ? '' : String(v);
}

async function ensureAi(userId: number) {
  if (!isAiAvailable()) throw new BadRequestError('AI is currently disabled. Please try again later.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Daily AI limit reached. Please try again tomorrow.');
}

// ─── 1) Roadmap generator ───────────────────────────────────────

export interface RoadmapModuleProposal {
  name: string;
  description: string;
  level: Level;
  exerciseTitles: string[];
}

export async function generateRoadmap(
  userId: number,
  body: { trackId?: number | string; moduleCount?: number; titlesPerModule?: number },
): Promise<{ trackId: number; trackName: string; modules: RoadmapModuleProposal[]; model: string }> {
  await ensureAi(userId);
  const trackId = Number(body?.trackId) || 0;
  if (!trackId) throw new BadRequestError('A track is required.');
  const track = await prisma.codeTrack.findUnique({
    where: { id: trackId },
    include: { group: true },
  });
  if (!track) throw new NotFoundError('Track not found.');

  const moduleCount = Math.min(20, Math.max(3, Number(body?.moduleCount) || 8));
  const titlesPer = Math.min(30, Math.max(4, Number(body?.titlesPerModule) || 8));

  const system =
    `You are a senior software instructor designing a complete, professional learning ROADMAP ` +
    `in ENGLISH for the track "${track.name}" (primary language/tech: ${track.language}), which sits in ` +
    `the "${track.group.name}" group. Design a path that takes a learner from ZERO to ADVANCED, ` +
    `ordered logically so each module builds on the previous ones.\n\n` +
    `Produce EXACTLY ${moduleCount} modules. For each module give: a short "name", a one-sentence ` +
    `"description", a "level" (one of BEGINNER, INTERMEDIATE, ADVANCED), and ${titlesPer} concrete, ` +
    `varied "exerciseTitles" (short imperative problem titles, increasing in difficulty). Titles must be ` +
    `real, specific coding exercises — not chapter headings.\n\n` +
    `Return ONLY minified JSON of this exact shape (no text outside the JSON):\n` +
    `{"modules":[{"name":string,"description":string,"level":string,"exerciseTitles":[string,...]}]}`;

  const user = `Design the roadmap for "${track.name}".${track.description ? ` Context: ${track.description}` : ''}`;

  let raw = '';
  let model = 'generation';
  try {
    const res = await llmComplete({
      step: 'generation',
      feature: 'exphub',
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 6000,
      maxRetries: 1,
      timeoutMs: 120_000,
      userId,
    });
    raw = res.text;
    model = res.model || model;
  } catch {
    throw new BadRequestError('Roadmap generation is busy, please try again shortly.');
  }

  const parsed = looseJson(raw) as { modules?: unknown };
  const modules = normalizeRoadmap(parsed.modules);
  if (!modules.length) throw new BadRequestError('Roadmap generation returned nothing, please retry.');
  return { trackId: track.id, trackName: track.name, modules, model };
}

function normalizeLevel(v: unknown): Level {
  const up = s(v).toUpperCase();
  return (LEVELS as readonly string[]).includes(up) ? (up as Level) : 'BEGINNER';
}
function normalizeDiff(v: unknown): Diff {
  const up = s(v).toUpperCase();
  return (DIFFS as readonly string[]).includes(up) ? (up as Diff) : 'EASY';
}

function normalizeRoadmap(raw: unknown): RoadmapModuleProposal[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((m) => {
      const o = (m ?? {}) as Record<string, unknown>;
      const name = s(o.name).slice(0, 150);
      if (!name) return null;
      const titles = Array.isArray(o.exerciseTitles)
        ? o.exerciseTitles.map((t) => s(t).slice(0, 200)).filter(Boolean).slice(0, 40)
        : [];
      return {
        name,
        description: s(o.description).slice(0, 500),
        level: normalizeLevel(o.level),
        exerciseTitles: titles,
      };
    })
    .filter((x): x is RoadmapModuleProposal => !!x)
    .slice(0, 20);
}

// ─── 2) Full exercise batch generator ───────────────────────────

export interface ExerciseProposal {
  title: string;
  difficulty: Diff;
  estimatedMinutes: number;
  points: number;
  concepts: string[];
  prerequisites: string[];
  problemHtml: string;
  inputSpec: string;
  outputSpec: string;
  constraints: string;
  examples: Array<{ input: string; output: string; explanation: string }>;
  hints: string[];
  starterCode: Array<{ name: string; language: string; code: string }>;
  solutionCode: Array<{ name: string; language: string; code: string }>;
  solutionExplanationHtml: string;
  tags: string[];
  diagramMermaid: string;
}

export async function generateExercises(
  userId: number,
  body: {
    moduleId?: number | string;
    count?: number;
    difficulty?: string;
    topic?: string;
    titles?: string[];
  },
): Promise<{ moduleId: number; moduleName: string; trackName: string; language: string; exercises: ExerciseProposal[]; model: string }> {
  await ensureAi(userId);
  const moduleId = Number(body?.moduleId) || 0;
  if (!moduleId) throw new BadRequestError('A module is required.');
  const mod = await prisma.codeModule.findUnique({
    where: { id: moduleId },
    include: { track: { include: { group: true } } },
  });
  if (!mod) throw new NotFoundError('Module not found.');

  const language = mod.track.language;
  const givenTitles = Array.isArray(body?.titles) ? body!.titles!.map((t) => s(t)).filter(Boolean).slice(0, 20) : [];
  const count = Math.min(20, Math.max(1, Number(body?.count) || (givenTitles.length || 5)));
  const difficulty = body?.difficulty ? normalizeDiff(body.difficulty) : null;
  const topic = s(body?.topic);

  const titlesNote = givenTitles.length
    ? `Use EXACTLY these titles, in order (one exercise each): ${givenTitles.map((t) => `"${t}"`).join(', ')}.`
    : `Invent ${count} distinct, progressively harder exercise titles suitable for this module.`;
  const diffNote = difficulty ? `Target difficulty for ALL exercises: ${difficulty}.` : `Vary difficulty across EASY/MEDIUM/HARD as appropriate.`;
  const topicNote = topic ? ` Focus the exercises on: ${topic}.` : '';

  const system =
    `You are a senior software instructor writing complete, professional coding EXERCISES in ENGLISH, ` +
    `in the style of a university programming course (like the NTU "programming notes" exercises). ` +
    `The exercises are for the module "${mod.name}" of the track "${mod.track.name}" ` +
    `(language/tech: ${language}, group: ${mod.track.group.name}).\n\n` +
    `${titlesNote} ${diffNote}${topicNote}\n\n` +
    `For EACH exercise produce a rigorous, self-contained problem with a worked official solution. Fields:\n` +
    `- "title": short imperative title.\n` +
    `- "difficulty": one of EASY, MEDIUM, HARD, EXPERT.\n` +
    `- "estimatedMinutes": integer.\n` +
    `- "points": integer 5-100 scaled to difficulty.\n` +
    `- "concepts": array of the concepts the learner must KNOW & APPLY (e.g. "for loops","recursion").\n` +
    `- "prerequisites": array of prior concepts assumed.\n` +
    `- "problemHtml": the full problem statement as clean HTML using ONLY <p><ul><ol><li><strong><em><code><pre><a href>. ` +
    `Be concrete and complete; describe exactly what to build.\n` +
    `- "inputSpec": what the input is (plain text; "None" if not applicable).\n` +
    `- "outputSpec": what the expected output is (plain text).\n` +
    `- "constraints": limits/edge cases as plain text (or "").\n` +
    `- "examples": array of {input, output, explanation} worked examples (at least 1).\n` +
    `- "hints": array of progressive hints (2-4), from gentle nudge to strong.\n` +
    `- "starterCode": array of {name, language, code} — a minimal scaffold with TODOs (language "${language}").\n` +
    `- "solutionCode": array of {name, language, code} — a correct, idiomatic, RUNNABLE official solution.\n` +
    `- "solutionExplanationHtml": a walkthrough of the solution as HTML (same allowed tags as problemHtml).\n` +
    `- "tags": array of short lowercase tags.\n` +
    `- "diagramMermaid": a SMALL Mermaid diagram that helps the learner picture the problem — a CLASS diagram ` +
    `for OOP/class tasks (fields + methods, like a UML class box), or a FLOWCHART for algorithm/logic tasks, ` +
    `or a sequence/data-flow where it fits. Use valid, simple Mermaid (classDiagram / flowchart TD / graph LR). ` +
    `Empty string "" only if a diagram genuinely does not apply.\n\n` +
    `Never invent APIs, packages, or syntax that do not exist. Code must be real and correct.\n` +
    `Return ONLY minified JSON of this exact shape (no text outside the JSON), escaping quotes/newlines so it parses:\n` +
    `{"exercises":[{"title":string,"difficulty":string,"estimatedMinutes":number,"points":number,"concepts":[string],` +
    `"prerequisites":[string],"problemHtml":string,"inputSpec":string,"outputSpec":string,"constraints":string,` +
    `"examples":[{"input":string,"output":string,"explanation":string}],"hints":[string],` +
    `"starterCode":[{"name":string,"language":string,"code":string}],` +
    `"solutionCode":[{"name":string,"language":string,"code":string}],"solutionExplanationHtml":string,"tags":[string],` +
    `"diagramMermaid":string}]}`;

  const user = `Write ${count} exercise(s) now for "${mod.name}".${mod.description ? ` Module context: ${mod.description}` : ''}`;

  let raw = '';
  let model = 'generation';
  try {
    const res = await llmComplete({
      step: 'generation',
      feature: 'exphub',
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 12000,
      maxRetries: 1,
      timeoutMs: 180_000,
      userId,
    });
    raw = res.text;
    model = res.model || model;
  } catch {
    throw new BadRequestError('Exercise generation is busy, please try again shortly.');
  }

  const parsed = looseJson(raw) as { exercises?: unknown };
  const exercises = normalizeProposals(parsed.exercises, language);
  if (!exercises.length) throw new BadRequestError('Exercise generation returned nothing, please retry.');
  return { moduleId: mod.id, moduleName: mod.name, trackName: mod.track.name, language, exercises, model };
}

function normalizeProposals(raw: unknown, fallbackLang: string): ExerciseProposal[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((e) => {
      const o = (e ?? {}) as Record<string, unknown>;
      const title = s(o.title).slice(0, 255);
      if (!title) return null;
      const arr = (v: unknown, cap = 30): string[] =>
        Array.isArray(v) ? v.map((x) => s(x)).filter(Boolean).slice(0, cap) : [];
      const blocks = (v: unknown) =>
        Array.isArray(v)
          ? v
              .map((b, i) => {
                const bo = (b ?? {}) as Record<string, unknown>;
                const code = s(bo.code);
                if (!code) return null;
                return { name: s(bo.name) || `Code ${i + 1}`, language: (s(bo.language) || fallbackLang).toLowerCase(), code };
              })
              .filter((x): x is { name: string; language: string; code: string } => !!x)
              .slice(0, 10)
          : [];
      const examples = Array.isArray(o.examples)
        ? o.examples
            .map((ex) => {
              const xo = (ex ?? {}) as Record<string, unknown>;
              return { input: s(xo.input), output: s(xo.output), explanation: s(xo.explanation) };
            })
            .filter((x) => x.input || x.output || x.explanation)
            .slice(0, 20)
        : [];
      return {
        title,
        difficulty: normalizeDiff(o.difficulty),
        estimatedMinutes: Math.max(1, Math.min(600, Number(o.estimatedMinutes) || 15)),
        points: Math.max(5, Math.min(100, Number(o.points) || 10)),
        concepts: arr(o.concepts),
        prerequisites: arr(o.prerequisites),
        problemHtml: s(o.problemHtml),
        inputSpec: s(o.inputSpec),
        outputSpec: s(o.outputSpec),
        constraints: s(o.constraints),
        examples,
        hints: arr(o.hints, 8),
        starterCode: blocks(o.starterCode),
        solutionCode: blocks(o.solutionCode),
        solutionExplanationHtml: s(o.solutionExplanationHtml),
        tags: arr(o.tags, 15),
        diagramMermaid: s(o.diagramMermaid),
      };
    })
    .filter((x): x is ExerciseProposal => !!x)
    .slice(0, 20);
}

// ─── Commit (persist reviewed proposals) ────────────────────────

export async function commitExercises(
  userId: number,
  body: { moduleId?: number | string; exercises?: unknown; startSortOrder?: number },
): Promise<{ moduleId: number; created: number; ids: number[] }> {
  const moduleId = Number(body?.moduleId) || 0;
  if (!moduleId) throw new BadRequestError('A module is required.');
  const mod = await prisma.codeModule.findUnique({ where: { id: moduleId }, select: { id: true, track: { select: { language: true } } } });
  if (!mod) throw new NotFoundError('Module not found.');
  const list = Array.isArray(body?.exercises) ? body!.exercises! : [];
  if (!list.length) throw new BadRequestError('No exercises to save.');

  // Append after the current max sortOrder in the module.
  const last = await prisma.codeExercise.findFirst({ where: { moduleId }, orderBy: { sortOrder: 'desc' }, select: { sortOrder: true } });
  let sortOrder = body?.startSortOrder != null ? Number(body.startSortOrder) : (last?.sortOrder ?? -1) + 1;

  const ids: number[] = [];
  for (const raw of list) {
    const p = normalizeProposals([raw], mod.track.language)[0];
    if (!p) continue;
    const created = await codeLab.createExercise(
      {
        moduleId,
        title: p.title,
        language: mod.track.language,
        difficulty: p.difficulty,
        status: 'PUBLISHED',
        sortOrder: sortOrder++,
        problemHtml: p.problemHtml,
        concepts: p.concepts,
        prerequisites: p.prerequisites,
        inputSpec: p.inputSpec,
        outputSpec: p.outputSpec,
        constraints: p.constraints,
        examplesJson: p.examples,
        hintsJson: p.hints,
        starterCodeJson: p.starterCode,
        solutionCodeJson: p.solutionCode,
        solutionExplanationHtml: p.solutionExplanationHtml,
        tags: p.tags,
        estimatedMinutes: p.estimatedMinutes,
        points: p.points,
        diagramMermaid: p.diagramMermaid || null,
      },
      userId,
    );
    ids.push(created.id);
  }
  return { moduleId, created: ids.length, ids };
}
