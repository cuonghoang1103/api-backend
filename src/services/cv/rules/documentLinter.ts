/**
 * CV Builder — document-level linter (Phase 3, STATIC mode).
 * ─────────────────────────────────────────────────────────────────────────
 * Runs the deterministic rules engine over a whole CV: structural checks,
 * per-bullet analysis (via lintBullet), the skills-vs-evidence gap, and
 * market/level-aware conventions. Zero LLM calls — this is the free tier and
 * must deliver real, specific, correct feedback on its own.
 */
import { lintBullet, type BulletStrength, type BulletIssue, type Severity } from './bulletLinter.js';
import {
  MARKET_CONVENTIONS, LEVEL_CONVENTIONS, type CvMarket, type CvLevel,
} from './conventions.js';

export interface LintBulletInput { id: number; text: string }
export interface LintItemInput {
  id: number;
  kind: string; // CvItemKind
  title: string;
  organization?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent?: boolean;
  url?: string | null;
  techStack?: string[];
  bullets: LintBulletInput[];
}
export interface LintInput {
  market: CvMarket;
  level: CvLevel;
  contact: {
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
    links?: { github?: string; linkedin?: string; portfolio?: string; website?: string };
    hasPhoto?: boolean;
    dateOfBirth?: string | null;
  };
  summary?: string | null;
  items: LintItemInput[];
  skills: { name: string }[];
}

export interface DocIssue {
  code: string;
  severity: Severity;
  problem: string;
  suggestedFix?: string;
  location?: { itemId?: number; bulletId?: number; section?: string };
}
export interface BulletVerdictOut { bulletId: number; itemId: number; strength: BulletStrength; issues: BulletIssue[] }
export interface CvLintResult {
  score: number;
  band: 'INTERVIEW' | 'MAYBE' | 'REJECT';
  sixSecondTest: string;
  issues: DocIssue[];
  strengths: string[];
  bulletVerdicts: BulletVerdictOut[];
  skillGaps: string[];
  counts: { bullets: number; weakBullets: number; strongBullets: number; bulletsWithMetric: number; items: number };
  conventionNotes: { market: string; level: string };
}

const monthsBetween = (a: Date, b: Date) => (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
const parseDate = (s?: string | null): Date | null => {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};

export function lintCv(input: LintInput): CvLintResult {
  const market = MARKET_CONVENTIONS[input.market];
  const level = LEVEL_CONVENTIONS[input.level];
  const issues: DocIssue[] = [];
  const strengths: string[] = [];

  // ── Structural / contact ──
  if (!input.contact.fullName?.trim()) {
    issues.push({ code: 'no-name', severity: 'CRITICAL', problem: 'Thiếu họ tên.', suggestedFix: 'Thêm họ tên ở đầu CV.', location: { section: 'contact' } });
  }
  if (!input.contact.email?.trim() && !input.contact.phone?.trim()) {
    issues.push({ code: 'no-contact', severity: 'CRITICAL', problem: 'Không có cách liên hệ (email/điện thoại).', suggestedFix: 'Thêm email chuyên nghiệp.', location: { section: 'contact' } });
  }
  if (!input.contact.links?.github) {
    issues.push({ code: 'no-github', severity: 'MINOR', problem: 'Chưa có link GitHub — với kỹ sư, GitHub là bằng chứng.', suggestedFix: 'Thêm link GitHub (repo thật, có README).', location: { section: 'contact' } });
  }
  if (!input.summary?.trim()) {
    issues.push({ code: 'no-summary', severity: 'MINOR', problem: 'Chưa có phần tóm tắt.', suggestedFix: '2–3 câu: bạn là ai, mạnh gì, tìm vai trò nào.', location: { section: 'summary' } });
  }

  // ── Market conventions ──
  if (market.dobDiscouraged && input.contact.dateOfBirth) {
    issues.push({ code: 'intl-dob', severity: 'MAJOR', problem: 'CV quốc tế không nên có ngày sinh — một số ATS/nhà tuyển dụng loại vì lý do tuân thủ.', suggestedFix: 'Bỏ ngày sinh khi nhắm thị trường US/EU/remote.', location: { section: 'contact' } });
  }
  if (!market.photoAllowed && input.contact.hasPhoto) {
    issues.push({ code: 'intl-photo', severity: 'MAJOR', problem: 'CV quốc tế không nên có ảnh.', suggestedFix: 'Bỏ ảnh khi nhắm thị trường US/EU/remote.', location: { section: 'contact' } });
  }

  // ── Items: dates, ordering, gaps, level-aware ──
  const experiences = input.items.filter((i) => i.kind === 'EXPERIENCE');
  const projects = input.items.filter((i) => i.kind === 'PROJECT');

  for (const it of input.items) {
    const s = parseDate(it.startDate);
    const e = parseDate(it.endDate);
    if (s && e && e < s) {
      issues.push({ code: 'bad-dates', severity: 'MAJOR', problem: `"${it.title}": ngày kết thúc trước ngày bắt đầu.`, location: { itemId: it.id } });
    }
    if (level.expectProjectLinks && it.kind === 'PROJECT' && !it.url) {
      issues.push({ code: 'project-no-link', severity: 'MINOR', problem: `Dự án "${it.title}" không có link/repo/demo — một claim không kiểm chứng được.`, suggestedFix: 'Thêm link GitHub hoặc bản deploy.', location: { itemId: it.id } });
    }
  }

  // reverse-chronological (experiences should be newest-first)
  const dated = experiences.map((x) => ({ x, d: parseDate(x.startDate) })).filter((o) => o.d) as { x: LintItemInput; d: Date }[];
  for (let i = 1; i < dated.length; i++) {
    if (dated[i].d > dated[i - 1].d) {
      issues.push({ code: 'not-reverse-chron', severity: 'MINOR', problem: 'Kinh nghiệm chưa sắp theo thứ tự mới → cũ.', suggestedFix: 'Đưa công việc gần nhất lên đầu.' });
      break;
    }
  }

  // employment gaps > 6 months (skip for student/fresher)
  if (level.flagNoWorkExperience && dated.length >= 2) {
    const sorted = [...dated].sort((a, b) => a.d.getTime() - b.d.getTime());
    for (let i = 1; i < sorted.length; i++) {
      const prevEnd = parseDate(sorted[i - 1].x.endDate) ?? new Date();
      if (monthsBetween(prevEnd, sorted[i].d) > 6) {
        issues.push({ code: 'employment-gap', severity: 'MINOR', problem: `Có khoảng trống >6 tháng trước "${sorted[i].x.title}".`, suggestedFix: 'Nếu có lý do (học, dự án cá nhân), cân nhắc ghi rõ.' });
      }
    }
  }

  // missing experience — expected-state aware
  if (experiences.length === 0) {
    if (level.flagNoWorkExperience) {
      issues.push({ code: 'no-experience', severity: 'MAJOR', problem: 'Chưa có mục kinh nghiệm làm việc.', suggestedFix: 'Thêm các vai trò đã làm, kèm thành tích đo được.' });
    } else if (projects.length === 0) {
      issues.push({ code: 'fresher-no-projects', severity: 'MAJOR', problem: 'Là fresher/sinh viên thì DỰ ÁN là bằng chứng chính — nhưng chưa có mục nào.', suggestedFix: 'Thêm 2–3 dự án thật (cá nhân/đồ án/hackathon) có link.' });
    }
  }

  // ── Bullets ──
  const bulletVerdicts: BulletVerdictOut[] = [];
  let weakBullets = 0, strongBullets = 0, bulletsWithMetric = 0, totalBullets = 0;
  for (const it of input.items) {
    for (const b of it.bullets) {
      totalBullets++;
      const v = lintBullet(b.text);
      bulletVerdicts.push({ bulletId: b.id, itemId: it.id, strength: v.strength, issues: v.issues });
      if (v.strength === 'WEAK') weakBullets++;
      if (v.strength === 'STRONG') strongBullets++;
      if (v.hasMetric) bulletsWithMetric++;
      // Surface the single most severe issue per weak/flagged bullet as a doc issue.
      const top = v.issues.find((i) => i.severity === 'MAJOR') ?? (v.strength === 'WEAK' ? v.issues[0] : undefined);
      if (top) {
        issues.push({ code: top.code, severity: top.severity, problem: `"${truncate(b.text)}" — ${top.message}`, location: { itemId: it.id, bulletId: b.id } });
      }
    }
  }

  if (totalBullets >= 3 && bulletsWithMetric === 0) {
    issues.push({ code: 'no-numbers-anywhere', severity: 'MAJOR', problem: 'Cả CV không có dòng nào chứa con số — CV sẽ bị lướt qua và bỏ.', suggestedFix: 'Thêm số đo vào ít nhất vài bullet mạnh nhất (thời gian, %, quy mô).' });
  }

  // ── Skills vs evidence ──
  const evidenceHaystack = input.items
    .flatMap((i) => [...i.bullets.map((b) => b.text), ...(i.techStack ?? [])])
    .join(' ')
    .toLowerCase();
  const skillGaps: string[] = [];
  for (const s of input.skills) {
    const name = s.name.trim().toLowerCase();
    if (!name) continue;
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`(^|[^a-z0-9])${esc}([^a-z0-9]|$)`, 'i').test(evidenceHaystack)) skillGaps.push(s.name);
  }
  if (skillGaps.length > 0) {
    issues.push({
      code: 'skills-no-evidence',
      severity: skillGaps.length >= 5 ? 'MAJOR' : 'MINOR',
      problem: `${skillGaps.length} kỹ năng không có dòng nào chứng minh: ${skillGaps.slice(0, 8).join(', ')}${skillGaps.length > 8 ? '…' : ''}.`,
      suggestedFix: 'Mỗi kỹ năng nên có ít nhất một bullet thể hiện bạn đã dùng nó — nếu không, interviewer sẽ hỏi đúng chỗ đó. Hoặc bỏ kỹ năng bạn không thật sự vững.',
    });
  }

  // ── Strengths (say what's working) ──
  if (strongBullets > 0) strengths.push(`${strongBullets} dòng thành tích mạnh (động từ hành động + kết quả đo được).`);
  if (bulletsWithMetric >= Math.max(2, Math.ceil(totalBullets * 0.4))) strengths.push('Nhiều bullet có số liệu — nhà tuyển dụng tin được.');
  if (input.contact.links?.github) strengths.push('Có GitHub — bằng chứng kỹ thuật kiểm chứng được.');

  // ── Score & band ──
  const penalty = issues.reduce((sum, i) => sum + (i.severity === 'CRITICAL' ? 22 : i.severity === 'MAJOR' ? 8 : 3), 0);
  const score = Math.max(0, Math.min(100, 100 - penalty));
  const band: CvLintResult['band'] = score >= 75 ? 'INTERVIEW' : score >= 50 ? 'MAYBE' : 'REJECT';

  // ── Six-second test ──
  const latest = experiences[0] ?? projects[0] ?? input.items[0];
  const topSkills = input.skills.slice(0, 5).map((s) => s.name).join(', ');
  const sixSecondTest = [
    input.contact.fullName || '(chưa có tên)',
    latest ? `${latest.title}${latest.organization ? ' @ ' + latest.organization : ''}` : '(chưa rõ vai trò gần nhất)',
    topSkills || '(chưa có kỹ năng nổi bật)',
  ].join(' · ');

  return {
    score, band, sixSecondTest, issues, strengths, bulletVerdicts, skillGaps,
    counts: { bullets: totalBullets, weakBullets, strongBullets, bulletsWithMetric, items: input.items.length },
    conventionNotes: { market: market.note, level: level.note },
  };
}

function truncate(s: string, n = 60): string {
  return s.length > n ? s.slice(0, n).trim() + '…' : s;
}
