/**
 * genStats.service.ts — what the content generators are doing, right now.
 *
 * The bulk generators (My Language vocab/grammar/…, interview deepen, the
 * English backfill) run detached on the VPS and are invisible from the admin UI:
 * the only way to know whether they were alive, throttled or long dead was to
 * SSH in and read logs. Every call they make is already written to
 * InterviewLLMCallLog, so their pulse can be read straight from the database —
 * no new table, no new writes, nothing the generators need to cooperate with.
 *
 * READ-ONLY: aggregate queries over an existing log table. It cannot disturb a
 * running generator.
 */
import { prisma } from '../config/database.js';
import { isAiAvailable, isForceStatic, hasKey } from './interview/llm/index.js';

// ── Per-user Pro AI usage ────────────────────────────────────────
export interface FeatureUserRow {
  userId: number;
  username: string;
  fullName: string | null;
  email: string | null;
  isPro: boolean;
  proExpiresAt: string | null;
  isAdmin: boolean;
  calls: number;
  failed: number;
  tokens: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  firstUsedAt: string | null;
  lastUsedAt: string | null;
  breakdown: Array<{ key: string; calls: number; tokens: number }>;
}

/** Attach the identity + Pro standing to rows that only carry a user id. The
 *  question is "which users are spending Pro AI", so a name and a Pro flag are
 *  the point, not a number. */
async function withUsers(
  rows: Array<{ userId: number | null; calls: number; failed: number; inputTokens: number; outputTokens: number; costUsd: number; first: Date | null; last: Date | null; breakdown: Map<string, { calls: number; tokens: number }> }>,
): Promise<FeatureUserRow[]> {
  const ids = rows.map((r) => r.userId).filter((id): id is number => id != null);
  if (!ids.length) return [];
  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: {
      id: true, username: true, fullName: true, email: true, isPro: true, proExpiresAt: true,
      roles: { select: { role: { select: { name: true } } } },
    },
  });
  const byId = new Map(users.map((u) => [u.id, u]));
  return rows
    .filter((r) => r.userId != null)
    .map((r) => {
      const u = byId.get(r.userId as number);
      return {
        userId: r.userId as number,
        username: u?.username ?? `#${r.userId}`,
        fullName: u?.fullName ?? null,
        email: u?.email ?? null,
        isPro: u?.isPro ?? false,
        proExpiresAt: u?.proExpiresAt ? u.proExpiresAt.toISOString() : null,
        isAdmin: (u?.roles ?? []).some((x) => x.role.name.toUpperCase() === 'ADMIN'),
        calls: r.calls,
        failed: r.failed,
        tokens: r.inputTokens + r.outputTokens,
        inputTokens: r.inputTokens,
        outputTokens: r.outputTokens,
        costUsd: r.costUsd,
        firstUsedAt: r.first ? r.first.toISOString() : null,
        lastUsedAt: r.last ? r.last.toISOString() : null,
        breakdown: [...r.breakdown.entries()]
          .map(([key, v]) => ({ key, calls: v.calls, tokens: v.tokens }))
          .sort((a, b) => b.calls - a.calls),
      };
    })
    .sort((a, b) => b.tokens - a.tokens);
}

/**
 * Per-user usage of one AI product.
 *
 * `interview` and `language` share InterviewLLMCallLog and both log
 * step='interview', so they are told apart by the `feature` column. Rows written
 * before that column existed carry NULL and are reported under 'không rõ'
 * instead of being credited to whichever feature we guessed.
 * `cv` has always had its own table with a `task` column.
 */
export async function getFeatureUsers(feature: 'interview' | 'language' | 'cv'): Promise<FeatureUserRow[]> {
  if (feature === 'cv') {
    const logs = await prisma.cvLLMCallLog.findMany({
      where: { userId: { not: null } },
      select: { userId: true, task: true, inputTokens: true, outputTokens: true, costUsd: true, success: true, createdAt: true },
    });
    return withUsers(foldByUser(logs.map((l) => ({ ...l, key: l.task }))));
  }
  const logs = await prisma.interviewLLMCallLog.findMany({
    where: { userId: { not: null }, feature },
    select: { userId: true, step: true, inputTokens: true, outputTokens: true, costUsd: true, success: true, createdAt: true },
  });
  return withUsers(foldByUser(logs.map((l) => ({ ...l, key: l.step }))));
}

function foldByUser(
  logs: Array<{ userId: number | null; key: string; inputTokens: number; outputTokens: number; costUsd: unknown; success: boolean; createdAt: Date }>,
) {
  const map = new Map<number, { userId: number | null; calls: number; failed: number; inputTokens: number; outputTokens: number; costUsd: number; first: Date | null; last: Date | null; breakdown: Map<string, { calls: number; tokens: number }> }>();
  for (const l of logs) {
    if (l.userId == null) continue;
    const cur = map.get(l.userId) ?? {
      userId: l.userId, calls: 0, failed: 0, inputTokens: 0, outputTokens: 0, costUsd: 0,
      first: null as Date | null, last: null as Date | null, breakdown: new Map<string, { calls: number; tokens: number }>(),
    };
    cur.calls++;
    if (!l.success) cur.failed++;
    // A failed call returns no tokens, so it costs nothing — counting it would
    // overstate what a user actually spent.
    if (l.success) {
      cur.inputTokens += l.inputTokens;
      cur.outputTokens += l.outputTokens;
      cur.costUsd += Number(l.costUsd ?? 0);
    }
    if (!cur.first || l.createdAt < cur.first) cur.first = l.createdAt;
    if (!cur.last || l.createdAt > cur.last) cur.last = l.createdAt;
    const b = cur.breakdown.get(l.key) ?? { calls: 0, tokens: 0 };
    b.calls++;
    if (l.success) b.tokens += l.inputTokens + l.outputTokens;
    cur.breakdown.set(l.key, b);
    map.set(l.userId, cur);
  }
  return [...map.values()];
}

const WINDOW_MS = 5 * 60 * 60 * 1000; // the rate-limit window the generators throttle against
const LIVE_MS = 5 * 60 * 1000; // a model that called within 5 minutes is "running"

export interface GenModelStat {
  model: string;
  provider: 'claude' | 'openai_compat' | 'other';
  running: boolean;
  lastCallAt: string | null;
  secondsSinceLastCall: number | null;
  window: { calls: number; failed: number; tokens: number; inputTokens: number; outputTokens: number; costUsd: number };
  hour: { calls: number; tokens: number };
  day: { calls: number; tokens: number; costUsd: number };
  avgTokensPerCall: number;
  successRatePct: number;
}

export interface GenContentStat {
  key: string;
  label: string;
  total: number;
  lastHour: number;
  last24h: number;
}

export interface GenStats {
  generatedAt: string;
  ai: { available: boolean; forceStatic: boolean; hasKey: boolean };
  models: GenModelStat[];
  content: GenContentStat[];
  totals: { windowTokens: number; dayTokens: number; dayCostUsd: number; runningModels: number };
  languageByLevel: Array<{ code: string; level: string | null; words: number }>;
  interview: { published: number; draft: number; withEnglish: number; topicsAtTarget: number; topicsTotal: number };
}

/** A model id only tells us which upstream served it; that is what a quota
 *  follows, so it is also how the throttle counts. Same mapping here. */
function providerOf(model: string): GenModelStat['provider'] {
  if (model.startsWith('claude') || model.startsWith('rb-')) return 'claude';
  if (model.startsWith('gpt')) return 'openai_compat';
  return 'other';
}

export async function getGenStats(): Promise<GenStats> {
  const now = Date.now();
  const windowFrom = new Date(now - WINDOW_MS);
  const hourFrom = new Date(now - 60 * 60 * 1000);
  const dayFrom = new Date(now - 24 * 60 * 60 * 1000);

  const [windowRows, hourRows, dayRows, lastCalls] = await Promise.all([
    prisma.interviewLLMCallLog.groupBy({
      by: ['model', 'success'],
      where: { createdAt: { gte: windowFrom } },
      _sum: { inputTokens: true, outputTokens: true, costUsd: true },
      _count: { _all: true },
    }),
    prisma.interviewLLMCallLog.groupBy({
      by: ['model'],
      where: { createdAt: { gte: hourFrom }, success: true },
      _sum: { inputTokens: true, outputTokens: true },
      _count: { _all: true },
    }),
    prisma.interviewLLMCallLog.groupBy({
      by: ['model'],
      where: { createdAt: { gte: dayFrom }, success: true },
      _sum: { inputTokens: true, outputTokens: true, costUsd: true },
      _count: { _all: true },
    }),
    // Most recent call per model — the "is it still alive" signal.
    prisma.interviewLLMCallLog.groupBy({
      by: ['model'],
      where: { createdAt: { gte: dayFrom } },
      _max: { createdAt: true },
    }),
  ]);

  const lastByModel = new Map(lastCalls.map((r) => [r.model, r._max.createdAt]));
  const hourByModel = new Map(hourRows.map((r) => [r.model, r]));
  const dayByModel = new Map(dayRows.map((r) => [r.model, r]));

  const models = new Map<string, GenModelStat>();
  for (const r of windowRows) {
    const cur =
      models.get(r.model) ??
      ({
        model: r.model,
        provider: providerOf(r.model),
        running: false,
        lastCallAt: null,
        secondsSinceLastCall: null,
        window: { calls: 0, failed: 0, tokens: 0, inputTokens: 0, outputTokens: 0, costUsd: 0 },
        hour: { calls: 0, tokens: 0 },
        day: { calls: 0, tokens: 0, costUsd: 0 },
        avgTokensPerCall: 0,
        successRatePct: 100,
      } as GenModelStat);

    const inTok = r._sum.inputTokens ?? 0;
    const outTok = r._sum.outputTokens ?? 0;
    cur.window.calls += r._count._all;
    if (!r.success) cur.window.failed += r._count._all;
    // Only successful calls burn quota — matching how the generators count.
    if (r.success) {
      cur.window.inputTokens += inTok;
      cur.window.outputTokens += outTok;
      cur.window.tokens += inTok + outTok;
      cur.window.costUsd += Number(r._sum.costUsd ?? 0);
    }
    models.set(r.model, cur);
  }

  // Models that were busy earlier today but are silent inside the window still
  // matter — "stopped 3 hours ago" is exactly what an admin needs to see.
  for (const r of dayRows) {
    if (models.has(r.model)) continue;
    models.set(r.model, {
      model: r.model,
      provider: providerOf(r.model),
      running: false,
      lastCallAt: null,
      secondsSinceLastCall: null,
      window: { calls: 0, failed: 0, tokens: 0, inputTokens: 0, outputTokens: 0, costUsd: 0 },
      hour: { calls: 0, tokens: 0 },
      day: { calls: 0, tokens: 0, costUsd: 0 },
      avgTokensPerCall: 0,
      successRatePct: 100,
    });
  }

  for (const m of models.values()) {
    const h = hourByModel.get(m.model);
    m.hour = { calls: h?._count._all ?? 0, tokens: (h?._sum.inputTokens ?? 0) + (h?._sum.outputTokens ?? 0) };
    const d = dayByModel.get(m.model);
    m.day = {
      calls: d?._count._all ?? 0,
      tokens: (d?._sum.inputTokens ?? 0) + (d?._sum.outputTokens ?? 0),
      costUsd: Number(d?._sum.costUsd ?? 0),
    };
    const last = lastByModel.get(m.model) ?? null;
    m.lastCallAt = last ? last.toISOString() : null;
    m.secondsSinceLastCall = last ? Math.round((now - last.getTime()) / 1000) : null;
    m.running = m.secondsSinceLastCall != null && m.secondsSinceLastCall <= LIVE_MS / 1000;
    const ok = m.window.calls - m.window.failed;
    m.avgTokensPerCall = ok > 0 ? Math.round(m.window.tokens / ok) : 0;
    m.successRatePct = m.window.calls > 0 ? Math.round((ok / m.window.calls) * 100) : 100;
  }

  const sorted = [...models.values()].sort((a, b) => b.window.calls - a.window.calls);

  // ── What all those calls actually produced ──
  const [
    vocabTotal, vocabHour, vocabDay,
    grammarTotal, grammarHour, grammarDay,
    convTotal, convHour, convDay,
    qnaTotal, qnaDay,
    readTotal, readDay,
    qPublished, qDraft, qWithEn,
    byLevel, topicCounts,
  ] = await Promise.all([
    prisma.langVocabWord.count(),
    prisma.langVocabWord.count({ where: { createdAt: { gte: hourFrom } } }),
    prisma.langVocabWord.count({ where: { createdAt: { gte: dayFrom } } }),
    prisma.langGrammarPoint.count(),
    prisma.langGrammarPoint.count({ where: { createdAt: { gte: hourFrom } } }),
    prisma.langGrammarPoint.count({ where: { createdAt: { gte: dayFrom } } }),
    prisma.langConversationItem.count(),
    prisma.langConversationItem.count({ where: { createdAt: { gte: hourFrom } } }),
    prisma.langConversationItem.count({ where: { createdAt: { gte: dayFrom } } }),
    prisma.langQnaItem.count(),
    prisma.langQnaItem.count({ where: { createdAt: { gte: dayFrom } } }),
    prisma.langReadingArticle.count(),
    prisma.langReadingArticle.count({ where: { createdAt: { gte: dayFrom } } }),
    prisma.interviewQuestion.count({ where: { status: 'PUBLISHED' } }),
    prisma.interviewQuestion.count({ where: { status: 'DRAFT' } }),
    prisma.interviewQuestion.count({ where: { NOT: [{ bodyEn: null }, { bodyEn: '' }] } }),
    prisma.$queryRaw<Array<{ code: string; level: string | null; words: bigint }>>`
      SELECT l.code, c.level, COUNT(w.id) AS words
      FROM lang_vocab_categories c
      JOIN languages l ON l.id = c.language_id
      LEFT JOIN lang_vocab_words w ON w.category_id = c.id
      GROUP BY l.code, c.level
      HAVING COUNT(w.id) > 0
      ORDER BY l.code, c.level
    `,
    prisma.$queryRaw<Array<{ at_target: bigint; total: bigint }>>`
      SELECT
        COUNT(*) FILTER (WHERE n >= 50) AS at_target,
        (SELECT COUNT(*) FROM interview_topics) AS total
      FROM (
        SELECT topic_id, COUNT(*) n FROM interview_questions
        WHERE status = 'PUBLISHED' GROUP BY topic_id
      ) s
    `,
  ]);

  const content: GenContentStat[] = [
    { key: 'vocab', label: 'Từ vựng', total: vocabTotal, lastHour: vocabHour, last24h: vocabDay },
    { key: 'grammar', label: 'Ngữ pháp', total: grammarTotal, lastHour: grammarHour, last24h: grammarDay },
    { key: 'conversation', label: 'Hội thoại', total: convTotal, lastHour: convHour, last24h: convDay },
    { key: 'qna', label: 'Q&A', total: qnaTotal, lastHour: 0, last24h: qnaDay },
    { key: 'reading', label: 'Bài đọc', total: readTotal, lastHour: 0, last24h: readDay },
    { key: 'interview', label: 'Câu hỏi phỏng vấn', total: qPublished, lastHour: 0, last24h: 0 },
  ];

  return {
    generatedAt: new Date(now).toISOString(),
    ai: { available: isAiAvailable(), forceStatic: isForceStatic(), hasKey: hasKey() },
    models: sorted,
    content,
    totals: {
      windowTokens: sorted.reduce((s, m) => s + m.window.tokens, 0),
      dayTokens: sorted.reduce((s, m) => s + m.day.tokens, 0),
      dayCostUsd: sorted.reduce((s, m) => s + m.day.costUsd, 0),
      runningModels: sorted.filter((m) => m.running).length,
    },
    languageByLevel: byLevel.map((r) => ({ code: r.code, level: r.level, words: Number(r.words) })),
    interview: {
      published: qPublished,
      draft: qDraft,
      withEnglish: qWithEn,
      topicsAtTarget: Number(topicCounts[0]?.at_target ?? 0),
      topicsTotal: Number(topicCounts[0]?.total ?? 0),
    },
  };
}
