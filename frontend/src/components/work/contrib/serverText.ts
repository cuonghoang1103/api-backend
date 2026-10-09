/**
 * i18n GĐ2 — chữ do MÁY CHỦ sinh ở trang Đóng góp (contribRules.ts / contrib.service.ts) ⇒ dịch ở frontend.
 * Máy chủ giữ câu tiếng Anh (tệp xuất xlsx/PDF dùng chung); ở đây map theo mã (signal.code, khoá chỉ số,
 * preset khoảng) hoặc theo mẫu câu cố định. Không khớp mẫu nào ⇒ trả nguyên câu của máy chủ.
 */
import { currentWorkLocale, wt, type WKey } from '../i18n';

const vi = () => currentWorkLocale() === 'vi';
const nums = (s: string) => (s.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);

/** Tín hiệu "đáng trò chuyện" — theo mã. */
export function trSignal(s: { code: string; text: string }): string {
  if (!vi()) return s.text;
  const n = nums(s.text);
  switch (s.code) {
    case 'never_active': return wt('contrib.sigNever');
    case 'silent': return wt('contrib.sigSilent', { n: n[0] ?? 0 });
    case 'overdue': return wt('contrib.sigOverdue', { n: n[0] ?? 0 });
    case 'no_time': return wt('contrib.sigNoTime');
    case 'mentions': return wt('contrib.sigMentions', { n: n[0] ?? 0 });
    case 'late': return wt('contrib.sigLate', { a: n[0] ?? 0, b: n[1] ?? 0 });
    case 'no_done': return wt('contrib.sigNoDone', { n: n[0] ?? 0 });
    default: return s.text;
  }
}

const METRIC_KEYS = ['assigned', 'completed', 'points', 'onTimeRate', 'avgLateDays', 'overdueOpen', 'cycleDays', 'leadDays', 'hours', 'comments', 'voiceNotes', 'chatMessages', 'responseHours', 'reviewsDone', 'reviewRequests', 'commits', 'prs', 'lines', 'docVersions', 'pagesEdited', 'testRuns', 'testCasesCreated', 'utcid', 'itExecuted', 'defectsFound', 'bugsReported', 'meetings', 'activeDays', 'streak', 'silent'];

/** Định nghĩa chỉ số (METRIC_DEFINITIONS) — tên + cách tính. */
export function trDef(key: string, d: { label: string; how: string } | undefined): { label: string; how: string } | undefined {
  if (!d || !vi() || !METRIC_KEYS.includes(key)) return d;
  return { label: wt(`contrib.ml_${key}` as WKey), how: wt(`contrib.mh_${key}` as WKey) };
}

/** Ghi chú công bằng + nhãn khoảng thời gian (preset). */
export function trNote(note: string): string {
  if (!vi()) return note;
  return note.startsWith('Counts show activity') ? wt('contrib.fairness') : note;
}
export function trWindowLabel(label: string): string {
  if (!vi()) return label;
  const m: Record<string, WKey> = { Today: 'common.today', 'Last 7 days': 'contrib.p7d', 'Last 30 days': 'contrib.p30d', 'This week': 'finance.thisWeek', 'Whole project': 'ai.focusAll', 'Previous period': 'contrib.prevPeriod' };
  return m[label] ? wt(m[label]) : label;
}

/** Dòng thời gian của một thành viên (contrib.service memberDetail). */
export function trTimeline(text: string): string {
  if (!vi()) return text;
  const FIELD: Record<string, WKey> = { Created: 'contrib.tlCreated', Moved: 'contrib.tlMoved', Reassigned: 'contrib.tlReassigned', Renamed: 'contrib.tlRenamed', 'Edited the description of': 'contrib.tlDesc', 'Changed priority of': 'contrib.tlPrio', 'Changed the due date of': 'contrib.tlDue', Estimated: 'contrib.tlEstimated', Commented: 'contrib.tlCommented', 'Sent a chat message': 'contrib.tlChat' };
  if (FIELD[text]) return wt(FIELD[text]);
  let m: RegExpMatchArray | null;
  if ((m = text.match(/^Updated (.+) of$/))) return wt('contrib.tlUpdated', { f: m[1] });
  if ((m = text.match(/^Logged ([\d.]+) h(?: · (.+))?$/))) return wt('contrib.tlLogged', { h: m[1] }) + (m[2] ? ` · ${m[2]}` : '');
  if ((m = text.match(/^(Created|Edited) page "(.*)"$/))) return wt(m[1] === 'Created' ? 'contrib.tlPageCreated' : 'contrib.tlPageEdited', { t: m[2] });
  if ((m = text.match(/^Ran a test — (.+)$/))) return wt('contrib.tlRan', { s: m[1] });
  if ((m = text.match(/^(Approved|Rejected) "(.*)"$/))) return wt(m[1] === 'Approved' ? 'contrib.tlApproved' : 'contrib.tlRejected', { t: m[2] });
  if ((m = text.match(/^Asked for review: "(.*)"$/))) return wt('contrib.tlAsked', { t: m[1] });
  if ((m = text.match(/^Pull request: ([\s\S]*)$/))) return `${wt('contrib.tlPr')}: ${m[1]}`;
  if ((m = text.match(/^(Attended|Invited to) "(.*)"$/))) return wt(m[1] === 'Attended' ? 'contrib.tlAttended' : 'contrib.tlInvited', { t: m[2] });
  return text;
}

/** Sự kiện trên một thẻ (contrib.service taskDetail). */
export function trEvent(text: string): string {
  if (!vi()) return text;
  let m: RegExpMatchArray | null;
  if (text === 'created the issue') return wt('contrib.evCreated');
  if (text === 'Voice note') return wt('chat.voiceNote');
  if (text === 'approved the review') return wt('contrib.evApproved');
  if (text === 'rejected the review') return wt('contrib.evRejected');
  if ((m = text.match(/^changed (.+)$/))) return wt('contrib.evChanged', { f: m[1] });
  if ((m = text.match(/^logged ([\d.]+) h(?: \((.+)\))?$/))) return wt('contrib.evLogged', { h: m[1] }) + (m[2] ? ` (${m[2]})` : '');
  if ((m = text.match(/^ran the test — (.+)$/))) return wt('contrib.evRan', { s: m[1] });
  if ((m = text.match(/^pull request ([\s\S]*)$/))) return `${wt('contrib.tlPr').toLowerCase()} ${m[1]}`;
  if ((m = text.match(/^review: (.+)$/))) return `${wt('contrib.evReview')}: ${m[1]}`;
  return text;
}

/** Tiêu chí mặc định của đánh giá chéo (DEFAULT_CRITERIA) — tiêu chí tự đặt giữ nguyên. */
export function trCriterion(c: { key: string; label: string; description: string }): { label: string; description: string } {
  const KEYS = ['contribution', 'deadlines', 'collaboration', 'quality'];
  const DEF_EN: Record<string, string> = { contribution: 'Contribution', deadlines: 'Deadlines', collaboration: 'Collaboration', quality: 'Quality' };
  if (!vi() || !KEYS.includes(c.key) || DEF_EN[c.key] !== c.label) return c;
  return { label: wt(`contrib.cr_${c.key}` as WKey), description: wt(`contrib.crd_${c.key}` as WKey) };
}

/** Lý do ẩn điểm của đánh giá chéo (contribPeer.service). */
export function trPeerReason(text: string | null | undefined): string {
  if (!text || !vi()) return text ?? '';
  let m: RegExpMatchArray | null;
  if ((m = text.match(/^Scores show for people rated by at least (\d+) teammates\.$/))) return wt('contrib.peerMinRated', { n: m[1] });
  if (text.startsWith('Scores appear when the review is closed')) return wt('contrib.peerWhenClosed');
  if ((m = text.match(/^Shown when at least (\d+) teammates have rated you$/))) return wt('contrib.peerShownWhen', { n: m[1] });
  return text;
}
