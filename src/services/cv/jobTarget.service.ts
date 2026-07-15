/**
 * CV Builder — job-targeted tailoring (Phase 8a).
 * ─────────────────────────────────────────────────────────────────────────
 * Paste a JD → parse required skills → show coverage (your evidence × the
 * requirement) → deliver an HONEST fit verdict. Most CV tools never tell a user
 * a job is a bad fit; that silence is not kindness. And we NEVER suggest adding
 * a skill the user doesn't have to pass an ATS filter — that just gets them into
 * an interview they can't survive.
 *
 * Fully deterministic (no LLM needed) — a JD is untrusted text, so it is also
 * screened for injection and never fed to a model raw.
 */
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../middleware/errorHandler.js';
import { getOrCreateProfile } from './profile.service.js';
import { extractTechTerms, textHasTerm, categoryOf } from './rules/techTerms.js';
import { detectInjection } from './llm/injection.js';

const createSchema = z.object({
  title: z.string().trim().min(1).max(250),
  company: z.string().trim().max(200).optional().nullable(),
  sourceUrl: z.string().trim().max(500).optional().nullable(),
  rawJobDescription: z.string().trim().min(30, 'Dán mô tả công việc đầy đủ hơn').max(30000),
});

// Markers after which a mentioned skill is "nice to have" rather than required.
const NICE_MARKERS = /\b(nice to have|nice-to-have|preferred|a plus|bonus|would be a plus|good to have|ưu tiên|là lợi thế|điểm cộng)\b/i;

interface ParsedRequirements {
  mustHave: string[];
  niceToHave: string[];
  allKeywords: string[];
}

function parseRequirements(jd: string): ParsedRequirements {
  const terms = extractTechTerms(jd);
  const niceIdx = jd.toLowerCase().search(NICE_MARKERS);
  const mustHave: string[] = [];
  const niceToHave: string[] = [];
  for (const term of terms) {
    // A term is nice-to-have if ALL its occurrences fall after the nice marker.
    if (niceIdx >= 0 && !textHasTerm(jd.slice(0, niceIdx), term)) niceToHave.push(term);
    else mustHave.push(term);
  }
  return { mustHave, niceToHave, allKeywords: terms };
}

export async function createJobTarget(userId: number, body: unknown) {
  const data = createSchema.parse(body);
  const parsed = parseRequirements(data.rawJobDescription);
  const injection = detectInjection(data.rawJobDescription);
  return prisma.cvJobTarget.create({
    data: {
      userId,
      title: data.title,
      company: data.company ?? null,
      sourceUrl: data.sourceUrl ?? null,
      rawJobDescription: data.rawJobDescription,
      parsedRequirements: parsed as unknown as object,
      injectionAttempted: injection.injected,
    },
  });
}

export async function listJobTargets(userId: number) {
  return prisma.cvJobTarget.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 30,
    select: { id: true, title: true, company: true, createdAt: true },
  });
}

async function ownedJob(userId: number, jobId: number) {
  const job = await prisma.cvJobTarget.findFirst({ where: { id: jobId, userId } });
  if (!job) throw new NotFoundError('Không tìm thấy job');
  return job;
}

export async function getJobTarget(userId: number, jobId: number) {
  return ownedJob(userId, jobId);
}

export async function deleteJobTarget(userId: number, jobId: number) {
  await ownedJob(userId, jobId);
  await prisma.cvJobTarget.delete({ where: { id: jobId } });
  return { id: jobId };
}

export type CoverageLevel = 'GREEN' | 'AMBER' | 'RED';
export interface CoverageRow { skill: string; category: string; required: boolean; level: CoverageLevel; evidence: string | null }

export async function getCoverage(userId: number, jobId: number) {
  const job = await ownedJob(userId, jobId);
  const profile = await getOrCreateProfile(userId);
  const parsed = (job.parsedRequirements ?? { mustHave: [], niceToHave: [], allKeywords: [] }) as unknown as ParsedRequirements;

  // Build the evidence sources from the profile.
  const profileSkillNames = profile.skills.map((s) => s.name);
  const bulletText = profile.items.flatMap((i) => i.bullets.map((b) => b.text));
  const techStacks = profile.items.flatMap((i) => i.techStack);
  const demonstratedHay = bulletText.join(' \n ') + ' \n ' + techStacks.join(' \n '); // bullet/tech-stack = real proof
  const listedLower = new Set(profileSkillNames.map((s) => s.toLowerCase()));
  const profileTerms = extractTechTerms([...profileSkillNames, ...bulletText, ...techStacks].join(' \n '));

  const assess = (skill: string, required: boolean): CoverageRow => {
    const cat = categoryOf(skill);
    const demonstrated = textHasTerm(demonstratedHay, skill);
    if (demonstrated) return { skill, category: cat, required, level: 'GREEN', evidence: 'Có dòng thành tích chứng minh' };
    const listed = listedLower.has(skill.toLowerCase()) || textHasTerm(profileSkillNames.join(' \n '), skill);
    if (listed) return { skill, category: cat, required, level: 'AMBER', evidence: 'Bạn có ghi kỹ năng này nhưng chưa dòng nào chứng minh — interviewer sẽ hỏi đúng chỗ đó.' };
    // Genuinely absent = a RED GAP. We may point at an adjacent experience to
    // surface for bridging, but we DO NOT upgrade the level or hide the gap —
    // and we never tell the user to add a skill they don't have.
    const adjacent = profileTerms.filter((t) => categoryOf(t) === cat && t.toLowerCase() !== skill.toLowerCase());
    return { skill, category: cat, required, level: 'RED', evidence: adjacent.length ? `Không có bằng chứng. Có kinh nghiệm lân cận (${adjacent.slice(0, 3).join(', ')}) — có thể nêu để bắc cầu, nhưng đây vẫn là khoảng trống thật.` : null };
  };

  const rows: CoverageRow[] = [
    ...parsed.mustHave.map((s) => assess(s, true)),
    ...parsed.niceToHave.map((s) => assess(s, false)),
  ];

  const must = rows.filter((r) => r.required);
  const mustGreen = must.filter((r) => r.level === 'GREEN');
  const mustRed = must.filter((r) => r.level === 'RED');
  const matchedCount = must.filter((r) => r.level !== 'RED').length;

  // Honest fit verdict — never inflated, never keyword-stuffed.
  let verdict: 'STRONG' | 'STRETCH' | 'POOR';
  let message: string;
  const total = must.length || 1;
  const ratio = matchedCount / total;
  if (ratio >= 0.8 && mustGreen.length >= Math.ceil(total * 0.5)) {
    verdict = 'STRONG';
    message = `Bạn khớp ${matchedCount}/${must.length} yêu cầu bắt buộc, ${mustGreen.length} có bằng chứng rõ. Đây là job hợp — nộp đi.`;
  } else if (ratio >= 0.5) {
    verdict = 'STRETCH';
    message = `Khớp ${matchedCount}/${must.length} must-have. ${mustRed.length ? 'Thiếu: ' + mustRed.map((r) => r.skill).join(', ') + '. ' : ''}Job với tay — nộp nếu bạn muốn, nhưng cân nhắc dồn sức vào job hợp hơn. ĐỪNG thêm kỹ năng bạn không có để qua ATS — bạn sẽ bị hỏi ngay vòng 1.`;
  } else {
    verdict = 'POOR';
    message = `Chỉ khớp ${matchedCount}/${must.length} must-have. ${mustRed.length ? 'Các khoảng trống (' + mustRed.map((r) => r.skill).join(', ') + ') là lõi của vai trò. ' : ''}Đây là job lệch — thời gian có thể dùng tốt hơn cho vai trò bạn là ứng viên mạnh.`;
  }

  return {
    job: { id: job.id, title: job.title, company: job.company, injectionAttempted: job.injectionAttempted },
    rows,
    summary: { verdict, message, mustHaveTotal: must.length, mustHaveMatched: matchedCount, mustHaveStrong: mustGreen.length, gaps: mustRed.map((r) => r.skill) },
  };
}

/**
 * Tailoring suggestions — RECOMMEND, never auto-apply, never invent. Ranks the
 * user's existing items by keyword overlap with the JD and flags low-relevance
 * ones. Suggests surfacing skills the user HAS evidence for that the JD wants.
 */
export async function getTailorSuggestions(userId: number, jobId: number) {
  const job = await ownedJob(userId, jobId);
  const profile = await getOrCreateProfile(userId);
  const parsed = (job.parsedRequirements ?? { mustHave: [], niceToHave: [], allKeywords: [] }) as unknown as ParsedRequirements;
  const jdTerms = new Set(parsed.allKeywords.map((t) => t.toLowerCase()));

  const ranked = profile.items.map((it) => {
    const itemText = [it.title, ...(it.techStack ?? []), ...it.bullets.map((b) => b.text)].join(' \n ');
    const matched = extractTechTerms(itemText).filter((t) => jdTerms.has(t.toLowerCase()));
    return { itemId: it.id, title: it.title, kind: it.kind, matchCount: matched.length, matchedTerms: matched };
  }).sort((a, b) => b.matchCount - a.matchCount);

  const reorder = ranked.filter((r) => r.matchCount > 0).map((r) => ({ itemId: r.itemId, title: r.title, reason: `Khớp ${r.matchCount} từ khoá JD (${r.matchedTerms.join(', ')}) — đưa lên trên.` }));
  const consider_dropping = ranked.filter((r) => r.matchCount === 0 && (r.kind === 'PROJECT' || r.kind === 'EXPERIENCE')).map((r) => ({ itemId: r.itemId, title: r.title, reason: 'Không khớp từ khoá nào của JD — cân nhắc rút gọn hoặc bỏ cho bản CV này.' }));

  return {
    note: 'Đây là GỢI Ý, không tự áp dụng. Chỉ sắp xếp / chọn lại nội dung bạn ĐÃ có — không bịa thêm gì.',
    reorder,
    consider_dropping,
  };
}
