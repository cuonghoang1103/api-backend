/**
 * CT Work — CuongMini REVIEW CODE (27/10/2026): phần THUẦN (không DB, không mạng, không LLM) — test: codeReview.test.ts.
 *
 *   parseCodeReview  — đọc JSON model trả, KẸP mọi trường vào khung: phát hiện chỉ được trỏ tới tệp CÓ trong diff (tệp lạ ⇒
 *                      bỏ), số dòng chỉ giữ khi dòng đó THẬT SỰ hiện trong patch đã đưa model (không ⇒ bỏ số dòng, giữ phát
 *                      hiện ở mức tệp); mức độ/loại ngoài danh sách ⇒ mặc định; kết luận gợi ý không được APPROVE khi còn
 *                      BLOCKER hoặc tiêu chí chưa đạt. Một bài review sai còn tệ hơn không có — nên mọi thứ không kiểm được
 *                      thì bị bỏ hoặc hạ xuống "unknown", không bao giờ được "đoán cho đủ".
 *   reviewComment    — bình luận gửi thành viên (Markdown): kết luận gợi ý, phát hiện chính file:line, tiêu chí chưa đạt,
 *                      bước tiếp theo, link phiên review. Không gắn chữ "AI" (bình luận đã mang cờ isAi của hệ thống).
 */

import { patchLines } from './codeText.js';

export const VERDICTS = ['APPROVE', 'CHANGES', 'COMMENT'] as const;
export type Verdict = (typeof VERDICTS)[number];
export const FINDING_SEVERITIES = ['BLOCKER', 'MAJOR', 'MINOR', 'NIT'] as const;
export type FindingSeverity = (typeof FINDING_SEVERITIES)[number];
export const FINDING_CATEGORIES = ['correctness', 'security', 'style', 'tests', 'requirements'] as const;
export type FindingCategory = (typeof FINDING_CATEGORIES)[number];

export interface CodeFinding { file: string; line: number | null; severity: FindingSeverity; category: FindingCategory; message: string; suggestion: string | null }
export interface AcceptanceCheck { criterion: string; met: 'yes' | 'no' | 'unknown'; evidence: string | null }
export interface CodeReviewResult {
  summary: string;
  verdict: Verdict;
  /** Kết luận model đề xuất trước khi bị kẹp (để ghi chú khi bị hạ). */
  verdictRaw: string | null;
  findings: CodeFinding[];
  acceptance: AcceptanceCheck[];
  nextSteps: string[];
  /** Số phát hiện bị bỏ vì trỏ tới tệp không có trong diff / thiếu nội dung; số dòng bị gỡ vì không có trong patch. */
  dropped: number;
  linesCleared: number;
}

/** Tệp trong diff + patch (có thể null khi patch quá lớn / chưa đưa model). */
export interface DiffIndexFile { filename: string; patch: string | null; shown: boolean }

/** Map severity của phát hiện ⇒ severity của câu checklist / defect (srs.SEVERITIES). */
export const SEVERITY_TO_DEFECT: Record<FindingSeverity, 'CRITICAL' | 'MAJOR' | 'MINOR' | 'TRIVIAL'> = { BLOCKER: 'CRITICAL', MAJOR: 'MAJOR', MINOR: 'MINOR', NIT: 'TRIVIAL' };
const SEV_ORDER: Record<FindingSeverity, number> = { BLOCKER: 0, MAJOR: 1, MINOR: 2, NIT: 3 };

const str = (v: unknown, max: number): string | null => {
  if (typeof v !== 'string') return null;
  const s = v.replace(/\u0000/g, '').trim();
  return s ? (s.length > max ? `${s.slice(0, max - 1)}…` : s) : null;
};

/** Tìm tệp model nói tới: khớp đúng, bỏ "./" "a/" "b/" đầu, hoặc khớp ĐUÔI duy nhất ("UserDao.java" ⇒ "src/dao/UserDao.java"). */
export function matchFile(raw: string, files: DiffIndexFile[]): DiffIndexFile | null {
  const p = raw.trim().replace(/^\.?\//, '').replace(/^[ab]\//, '').replace(/:\d+(-\d+)?$/, '');
  if (!p) return null;
  const exact = files.find((f) => f.filename === p);
  if (exact) return exact;
  const tail = files.filter((f) => f.filename.endsWith(`/${p}`) || f.filename === p);
  return tail.length === 1 ? tail[0] : null;
}

export function parseCodeReview(raw: unknown, files: DiffIndexFile[]): CodeReviewResult {
  const o = (raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}) as Record<string, unknown>;
  const lineIndex = new Map(files.map((f) => [f.filename, f.shown ? patchLines(f.patch).all : new Set<number>()]));
  let dropped = 0;
  let linesCleared = 0;
  const findings: CodeFinding[] = [];
  for (const x of Array.isArray(o.findings) ? o.findings.slice(0, 60) : []) {
    const f = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>;
    const message = str(f.message, 1000);
    const file = typeof f.file === 'string' ? matchFile(f.file, files) : null;
    if (!message || !file) { dropped++; continue; }
    const n = typeof f.line === 'number' ? f.line : typeof f.line === 'string' && /^\d+$/.test(f.line.trim()) ? Number(f.line) : null;
    let line: number | null = n !== null && Number.isInteger(n) && n > 0 ? n : null;
    if (line !== null && !lineIndex.get(file.filename)?.has(line)) { line = null; linesCleared++; }
    const sev = String(f.severity ?? '').toUpperCase();
    const cat = String(f.category ?? '').toLowerCase();
    findings.push({
      file: file.filename, line,
      severity: (FINDING_SEVERITIES as readonly string[]).includes(sev) ? sev as FindingSeverity : 'MINOR',
      category: (FINDING_CATEGORIES as readonly string[]).includes(cat) ? cat as FindingCategory : 'correctness',
      message, suggestion: str(f.suggestion, 1500),
    });
  }
  // Trùng (cùng tệp + dòng + nội dung) ⇒ một. Nặng trước, rồi theo tệp/dòng. Tối đa 25.
  const seen = new Set<string>();
  const uniq = findings.filter((f) => { const k = `${f.file}|${f.line}|${f.message.toLowerCase()}`; if (seen.has(k)) return false; seen.add(k); return true; });
  uniq.sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity] || a.file.localeCompare(b.file) || (a.line ?? 0) - (b.line ?? 0));

  const acceptance: AcceptanceCheck[] = [];
  for (const x of Array.isArray(o.acceptance) ? o.acceptance.slice(0, 20) : []) {
    const a = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>;
    const criterion = str(a.criterion, 300);
    if (!criterion) continue;
    const m = String(a.met ?? '').toLowerCase();
    const evidence = str(a.evidence, 400);
    // "yes" mà không có bằng chứng ⇒ chưa kiểm được ⇒ unknown.
    const met: AcceptanceCheck['met'] = m === 'yes' && evidence ? 'yes' : m === 'no' ? 'no' : 'unknown';
    acceptance.push({ criterion, met, evidence });
  }

  const verdictRaw = typeof o.verdict === 'string' ? o.verdict.trim().toUpperCase() : null;
  let verdict: Verdict = (VERDICTS as readonly string[]).includes(verdictRaw ?? '') ? verdictRaw as Verdict : 'COMMENT';
  const blocking = uniq.some((f) => f.severity === 'BLOCKER') || acceptance.some((a) => a.met === 'no');
  if (blocking && verdict === 'APPROVE') verdict = 'CHANGES';
  if (uniq.some((f) => f.severity === 'BLOCKER')) verdict = 'CHANGES';

  const nextSteps = (Array.isArray(o.nextSteps) ? o.nextSteps : Array.isArray(o.next_steps) ? o.next_steps : [])
    .map((s) => str(s, 300)).filter((s): s is string => !!s).slice(0, 8);

  return {
    summary: str(o.summary, 2000) ?? '', verdict, verdictRaw, findings: uniq.slice(0, 25), acceptance, nextSteps,
    dropped: dropped + Math.max(0, uniq.length - 25), linesCleared,
  };
}

const VERDICT_LABEL: Record<Verdict, [en: string, vi: string]> = {
  APPROVE: ['Looks good to approve', 'Có thể duyệt'],
  CHANGES: ['Changes needed', 'Cần sửa trước khi duyệt'],
  COMMENT: ['Comments only', 'Chỉ góp ý'],
};
const MET_LABEL = { yes: ['met', 'đạt'], no: ['NOT met', 'CHƯA đạt'], unknown: ['could not verify', 'chưa kiểm được'] } as const;

export function reviewComment(input: {
  language: 'vi' | 'en'; target: string; reviewKey: string; reviewUrl: string; result: CodeReviewResult;
  coverage: { filesRead: number; filesTotal: number; omitted: string[] };
}): string {
  const vi = input.language === 'vi';
  const i = vi ? 1 : 0;
  const r = input.result;
  const at = (f: CodeFinding) => `\`${f.file}${f.line ? `:${f.line}` : ''}\``;
  const out: string[] = [];
  out.push(`**${vi ? 'Review code' : 'Code review'} — ${input.target}**`);
  out.push(`${vi ? 'Kết luận gợi ý' : 'Suggested verdict'}: **${VERDICT_LABEL[r.verdict][i]}** _(${vi ? 'người review quyết định' : 'the reviewer decides'})_`);
  if (r.summary) out.push(r.summary);
  const top = r.findings.filter((f) => f.severity !== 'NIT').slice(0, 8);
  if (top.length) {
    out.push(`**${vi ? 'Cần xem' : 'To look at'}**`);
    out.push(top.map((f) => `- [${f.severity}] ${at(f)} — ${f.message}${f.suggestion ? `\n  ${vi ? 'Gợi ý' : 'Suggestion'}: ${f.suggestion}` : ''}`).join('\n'));
  }
  const nits = r.findings.length - top.length;
  if (nits > 0) out.push(vi ? `_+${nits} góp ý nhỏ khác trong phiên review._` : `_+${nits} more minor notes in the review._`);
  const unmet = r.acceptance.filter((a) => a.met !== 'yes');
  if (unmet.length) {
    out.push(`**${vi ? 'Tiêu chí "Xong khi" chưa đạt / chưa kiểm được' : 'Acceptance criteria not met / not verified'}**`);
    out.push(unmet.slice(0, 10).map((a) => `- ${a.criterion} — ${MET_LABEL[a.met][i]}${a.evidence ? ` (${a.evidence})` : ''}`).join('\n'));
  }
  if (r.nextSteps.length) {
    out.push(`**${vi ? 'Bước tiếp theo' : 'Next steps'}**`);
    out.push(r.nextSteps.map((s, k) => `${k + 1}. ${s}`).join('\n'));
  }
  const cov = input.coverage;
  out.push(vi
    ? `Đã đọc diff ${cov.filesRead}/${cov.filesTotal} tệp${cov.omitted.length ? ` (chưa đọc: ${cov.omitted.slice(0, 6).join(', ')}${cov.omitted.length > 6 ? '…' : ''})` : ''}. Chi tiết: [${input.reviewKey}](${input.reviewUrl})`
    : `Read the diff of ${cov.filesRead}/${cov.filesTotal} files${cov.omitted.length ? ` (not read: ${cov.omitted.slice(0, 6).join(', ')}${cov.omitted.length > 6 ? '…' : ''})` : ''}. Details: [${input.reviewKey}](${input.reviewUrl})`);
  return out.join('\n\n');
}
