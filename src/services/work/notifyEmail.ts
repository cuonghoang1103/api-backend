/**
 * THƯ THÔNG BÁO CT Work bằng TIẾNG VIỆT (27/10/2026).
 *
 * Trước đây mỗi thông báo trong web kèm một thư tiếng Anh máy móc ("NT-26: Khoa Pham pushed 1 commit to …",
 * "Change how you get these emails…") gửi cho sinh viên Việt, và thư không có chi tiết nào ngoài một dòng. Giờ:
 *   - Tiêu đề + nội dung tiếng Việt, MỘT dòng tiếng Anh ngắn ở cuối (người nhận quốc tế vẫn hiểu).
 *   - Giao việc / bình luận / @nhắc: kèm người gây ra (ảnh + tên), dự án, trạng thái, ưu tiên, hạn, trích đoạn.
 *   - Git (đẩy commit, mở/merge PR, nhờ review): đọc lại WorkGitEvent ⇒ danh sách commit (sha + dòng đầu thông điệp,
 *     có link), kho mã, nhánh, thẻ liên quan, nút "Xem trong CT Work" + "Xem trên GitHub/GitLab".
 *   - Thư gộp: "Bạn có 5 cập nhật mới trong CT Work", từng mục có link.
 * Phần DỰNG là hàm thuần (test không cần DB); phần NẠP dữ liệu (load*) đọc Prisma và không bao giờ ném.
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { alertVi } from './alertVi.js';
import { frontendUrl } from './common.js';
import { renderWorkEmail, type WorkEmailParts } from './workEmail.js';

type Built = { subject: string; html: string; text: string };
export type WorkNotifyType = 'WORK_INVITE' | 'WORK_ASSIGN' | 'WORK_COMMENT' | 'WORK_MENTION' | 'WORK_ALERT';

const abs = (url: string) => (/^https?:\/\//.test(url) ? url : frontendUrl(url));
const str = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v));
const firstLine = (s: string | null | undefined, max = 120) => {
  const l = (s ?? '').split('\n')[0].trim();
  return l.length > max ? `${l.slice(0, max - 1)}…` : l;
};

/** Dòng chân thư chung: đổi cách nhận email. */
export function manageLine(extra = ''): NonNullable<WorkEmailParts['manage']> {
  return { text: `Đổi cách nhận email (gửi ngay / gộp mỗi sáng / tắt${extra}):`, label: 'CT Work → Việc của tôi → Cài đặt thông báo', url: abs('/work?tab=my-work') };
}

// ─── Tiêu đề ─────────────────────────────────────────────────────

/** Tiêu đề tiếng Việt cho 5 loại thông báo (cũng là dòng trong thư gộp). */
export function notifySubjectVi(type: WorkNotifyType, p: Record<string, unknown>, senderName?: string | null): string {
  const key = str(p.issueKey);
  const title = str(p.title);
  const who = senderName || 'Một thành viên';
  const onIssue = key ? `${key}${title ? `: ${title}` : ''}` : title;
  switch (type) {
    case 'WORK_INVITE': return `Bạn đã được thêm vào ${str(p.workspaceName) || 'một không gian làm việc'}`;
    case 'WORK_ASSIGN': return `${key} vừa được giao cho bạn${title ? `: ${title}` : ''}`;
    case 'WORK_COMMENT': return p.reply ? `${who} trả lời bình luận của bạn trong ${onIssue}` : `${who} bình luận trong ${onIssue}`;
    case 'WORK_MENTION': return `${who} nhắc bạn trong ${onIssue}`;
    case 'WORK_ALERT': {
      const msg = alertVi(str(p.message)) || str(p.message) || title || 'Có việc cần bạn chú ý';
      return key && !msg.includes(key) ? `${key}: ${msg}` : msg;
    }
  }
}

// ─── Giao việc / bình luận / @nhắc / cảnh báo ───────────────────

export interface NotifySender { name: string; avatarUrl?: string | null }
export interface IssueInfo {
  key: string;
  title: string;
  projectName?: string | null;
  projectColor?: string | null;
  type?: string | null;
  status?: string | null;
  priority?: number | null;
  dueDate?: Date | null;
  description?: string | null;
}

const PRIORITY_VI: Record<number, string> = { 1: 'Cao nhất', 2: 'Cao', 3: 'Vừa', 4: 'Thấp', 5: 'Thấp nhất' };
const fmtDate = (d: Date) => d.toLocaleDateString('vi-VN', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });

export function buildNotifyEmail(i: { type: WorkNotifyType; payload: Record<string, unknown>; sender?: NotifySender | null; issue?: IssueInfo | null }): Built {
  const p = i.payload;
  const who = i.sender?.name || 'Một thành viên';
  const key = i.issue?.key || str(p.issueKey);
  const title = i.issue?.title || str(p.title);
  const excerpt = str(p.excerpt).trim();
  const url = str(p.url) ? abs(str(p.url)) : null;
  const subject = notifySubjectVi(i.type, p, i.sender?.name);
  const details: Array<{ label: string; value: string }> = [];
  if (i.issue) {
    if (i.issue.projectName) details.push({ label: 'Dự án', value: i.issue.projectName });
    if (i.issue.type) details.push({ label: 'Loại', value: i.issue.type });
    if (i.issue.status) details.push({ label: 'Trạng thái', value: i.issue.status });
    if (i.issue.priority && PRIORITY_VI[i.issue.priority]) details.push({ label: 'Ưu tiên', value: PRIORITY_VI[i.issue.priority] });
    if (i.issue.dueDate) details.push({ label: 'Hạn', value: fmtDate(i.issue.dueDate) });
  }
  const issueLine = key ? { rich: `**${key}** · ${title.replace(/[*`]/g, '')}` } : title ? { rich: `**${title.replace(/[*`]/g, '')}**` } : null;
  let parts: Omit<WorkEmailParts, 'reason'> & { reason: string };
  switch (i.type) {
    case 'WORK_ASSIGN':
      parts = {
        heading: 'Bạn được giao một việc mới',
        person: i.sender ? { name: who, avatarUrl: i.sender.avatarUrl, caption: 'đã giao việc cho bạn' } : null,
        lines: [...(issueLine ? [issueLine] : [])],
        details,
        quote: i.issue?.description ? { caption: 'Mô tả', text: i.issue.description } : null,
        cta: url ? { label: 'Mở trong CT Work', url } : null,
        secondary: [`${key} was assigned to you${title ? `: ${title}` : ''}.`],
        reason: `Bạn nhận thư này vì được giao thẻ ${key} trên CT Work.`,
      };
      break;
    case 'WORK_MENTION':
      parts = {
        heading: `${who} đã nhắc bạn trong ${key || 'một thẻ'}`,
        person: i.sender ? { name: who, avatarUrl: i.sender.avatarUrl, caption: 'đã nhắc bạn trong một bình luận' } : null,
        lines: [...(issueLine ? [issueLine] : [])],
        quote: excerpt ? { caption: 'Bình luận', text: excerpt } : null,
        details,
        cta: url ? { label: 'Trả lời trong CT Work', url } : null,
        secondary: [`${who} mentioned you in ${key}${title ? `: ${title}` : ''}.`],
        reason: `Bạn nhận thư này vì ${who} đã nhắc (@) bạn trên CT Work.`,
      };
      break;
    case 'WORK_COMMENT':
      parts = {
        heading: p.reply ? `${who} đã trả lời bình luận của bạn` : `Bình luận mới trong ${key || 'thẻ bạn theo dõi'}`,
        person: i.sender ? { name: who, avatarUrl: i.sender.avatarUrl, caption: p.reply ? 'đã trả lời bạn' : 'đã bình luận' } : null,
        lines: [...(issueLine ? [issueLine] : [])],
        quote: excerpt ? { caption: 'Bình luận', text: excerpt } : null,
        details,
        cta: url ? { label: 'Xem bình luận', url } : null,
        secondary: [p.reply ? `${who} replied to your comment on ${key}.` : `${who} commented on ${key}${title ? `: ${title}` : ''}.`],
        reason: p.reply ? 'Bạn nhận thư này vì có người trả lời bình luận của bạn trên CT Work.' : `Bạn nhận thư này vì đang theo dõi thẻ ${key} trên CT Work.`,
      };
      break;
    case 'WORK_INVITE':
      parts = {
        heading: subject,
        lines: [`Bạn đã có quyền vào không gian "${str(p.workspaceName)}" trên CT Work.`],
        cta: url ? { label: 'Mở không gian làm việc', url } : null,
        secondary: [`You were added to ${str(p.workspaceName) || 'a workspace'} on CT Work.`],
        reason: 'Bạn nhận thư này vì vừa được thêm vào một không gian làm việc trên CT Work.',
      };
      break;
    case 'WORK_ALERT':
    default: {
      // 28/10: câu cảnh báo tiếng Anh của ~45 nơi gọi ⇒ dịch ở alertVi.ts; câu gốc xuống dòng phụ tiếng Anh cuối thư.
      const goc = str(p.message).trim();
      const viMsg = alertVi(goc);
      const msg = viMsg ?? goc;
      parts = {
        heading: msg && msg.length <= 110 ? msg : key ? `Cập nhật trong ${key}` : 'Có việc cần bạn chú ý',
        person: i.sender ? { name: who, avatarUrl: i.sender.avatarUrl, caption: 'thông báo từ CT Work' } : null,
        lines: [...(msg.length > 110 ? [msg] : []), ...(issueLine ? [issueLine] : [])],
        quote: excerpt ? { text: excerpt } : null,
        details,
        cta: url ? { label: 'Mở trong CT Work', url } : null,
        ...(viMsg ? { secondary: [goc] } : {}),
        reason: 'Bạn nhận thư này vì có hoạt động liên quan tới bạn trên CT Work.',
      };
    }
  }
  const { html, text } = renderWorkEmail({
    lang: 'vi',
    preheader: excerpt || (key ? `${key} · ${title}` : title) || subject,
    hero: i.issue?.projectColor ? { url: null, color: i.issue.projectColor, alt: '' } : null,
    ignore: '',
    manage: manageLine(),
    ...parts,
  });
  return { subject, html, text };
}

/** Nạp chi tiết thẻ cho thư (null nếu không có / lỗi). */
export async function loadIssueInfo(issueId: number): Promise<IssueInfo | null> {
  try {
    const i = await prisma.workIssue.findUnique({
      where: { id: issueId },
      select: {
        number: true, title: true, priority: true, dueDate: true, descriptionText: true, deletedAt: true,
        status: { select: { name: true } }, type: { select: { name: true } },
        project: { select: { key: true, name: true, color: true } },
      },
    });
    if (!i || i.deletedAt) return null;
    const desc = (i.descriptionText ?? '').replace(/\s+\n/g, '\n').trim();
    return {
      key: `${i.project.key}-${i.number}`, title: i.title, projectName: i.project.name, projectColor: i.project.color,
      type: i.type?.name ?? null, status: i.status?.name ?? null, priority: i.priority, dueDate: i.dueDate,
      description: desc ? (desc.length > 280 ? `${desc.slice(0, 279)}…` : desc) : null,
    };
  } catch (err) {
    logger.warn('[work] email: không nạp được thẻ', { issueId, err: (err as Error).message });
    return null;
  }
}

/** Tên + ảnh của người gửi (displayName > fullName > username). */
export async function loadSender(userId: number): Promise<NotifySender | null> {
  try {
    const u = await prisma.user.findUnique({ where: { id: userId }, select: { username: true, fullName: true, displayName: true, avatarUrl: true } });
    return u ? { name: u.displayName || u.fullName || u.username, avatarUrl: u.avatarUrl } : null;
  } catch {
    return null;
  }
}

// ─── Git ─────────────────────────────────────────────────────────

export interface GitEmailInput {
  kind: string;
  actor: string;
  provider: string;
  repo?: string | null;
  ref?: string | null;
  prNumber?: number | null;
  title?: string | null;
  commitCount: number;
  commits: Array<{ sha: string; message: string; url?: string | null; author?: string | null }>;
  /** Link trên GitHub/GitLab (compare của lần đẩy, trang PR…). */
  externalUrl?: string | null;
  data?: { forced?: boolean; created?: boolean; baseRef?: string | null; headRef?: string | null } | null;
  project: { key: string; name: string; color?: string | null };
  issues: Array<{ key: string; title: string }>;
  /** Link (tương đối hoặc tuyệt đối) tới trang Code của CT Work. */
  url: string;
}

const hostName = (provider: string) => (provider.toUpperCase() === 'GITLAB' ? 'GitLab' : 'GitHub');
function prLabel(g: Pick<GitEmailInput, 'provider' | 'prNumber'>): string {
  const gl = g.provider.toUpperCase() === 'GITLAB';
  return g.prNumber ? (gl ? `MR !${g.prNumber}` : `PR #${g.prNumber}`) : gl ? 'merge request' : 'pull request';
}

/** Câu chính (tiêu đề thư = "[KEY] " + câu ngắn; tiêu đề trong thân = câu đầy đủ). */
function gitSentence(g: GitEmailInput, long: boolean): string {
  const n = g.commitCount;
  const pr = prLabel(g);
  const branch = g.ref ?? 'một nhánh';
  switch (g.kind) {
    // Tiêu đề trong thân KHÔNG chứa tên nhánh (tên dài kiểu nt-26-rental-dao bị ngắt giữa chừng) — nhánh nằm ở dòng dưới.
    case 'PUSH': return long ? `${g.actor} đã đẩy ${n} commit mới` : `${g.actor} đẩy ${n} commit lên ${branch}`;
    case 'BRANCH_CREATED': return long ? `${g.actor} đã tạo nhánh mới` : `${g.actor} tạo nhánh ${branch}`;
    case 'BRANCH_DELETED': return long ? `${g.actor} đã xoá một nhánh` : `${g.actor} xoá nhánh ${branch}`;
    case 'PR_OPENED': return `${g.actor} ${long ? 'đã ' : ''}mở ${pr}`;
    case 'PR_REOPENED': return `${g.actor} ${long ? 'đã ' : ''}mở lại ${pr}`;
    case 'PR_MERGED': return `${g.actor} đã merge ${pr}`;
    case 'PR_CLOSED': return `${g.actor} ${long ? 'đã ' : ''}đóng ${pr}`;
    case 'REVIEW_REQUESTED': return `${g.actor} nhờ bạn review ${pr}`;
    default: return `${g.actor} có hoạt động mới trên ${hostName(g.provider)}`;
  }
}
function gitEnglish(g: GitEmailInput): string {
  const n = g.commitCount;
  const pr = prLabel(g);
  switch (g.kind) {
    case 'PUSH': return `${g.actor} pushed ${n} commit${n === 1 ? '' : 's'} to ${g.ref ?? 'a branch'}.`;
    case 'BRANCH_CREATED': return `${g.actor} created branch ${g.ref ?? ''}.`;
    case 'BRANCH_DELETED': return `${g.actor} deleted branch ${g.ref ?? ''}.`;
    case 'PR_OPENED': return `${g.actor} opened ${pr}.`;
    case 'PR_REOPENED': return `${g.actor} reopened ${pr}.`;
    case 'PR_MERGED': return `${g.actor} merged ${pr}.`;
    case 'PR_CLOSED': return `${g.actor} closed ${pr}.`;
    case 'REVIEW_REQUESTED': return `${g.actor} requested your review on ${pr}.`;
    default: return `${g.actor}: new ${hostName(g.provider)} activity.`;
  }
}
/** Dòng tiêu đề của việc (commit cuối của lần đẩy / tiêu đề PR). */
function gitTopic(g: GitEmailInput): string {
  if (g.kind === 'PUSH') return firstLine(g.commits.length ? g.commits[g.commits.length - 1].message : g.title, 90) || firstLine(g.title, 90);
  return firstLine(g.title, 90);
}

export function gitSubject(g: GitEmailInput): string {
  const topic = gitTopic(g);
  return `[${g.project.key}] ${gitSentence(g, false)}${topic ? `: ${topic}` : ''}`.slice(0, 240);
}

export function buildGitEmail(g: GitEmailInput): Built {
  const isPr = g.kind.startsWith('PR_') || g.kind === 'REVIEW_REQUESTED';
  const host = hostName(g.provider);
  const lines: WorkEmailParts['lines'] = [];
  if (isPr && g.title) lines.push({ rich: `**${firstLine(g.title, 200).replace(/[*`]/g, '')}**` });
  const tick = (x: string) => `\`${x.replace(/`/g, '')}\``;
  const proj = `**${g.project.name.replace(/[*`]/g, '')}**`;
  if (!isPr && g.ref) lines.push({ rich: `${g.kind === 'BRANCH_DELETED' ? 'Nhánh' : g.kind === 'PUSH' ? 'Lên nhánh' : 'Nhánh'} ${tick(g.ref)} trong dự án ${proj}${g.repo ? ` · kho ${tick(g.repo)}` : ''}` });
  else lines.push({ rich: `Dự án ${proj}${g.repo ? ` · kho ${tick(g.repo)}` : ''}` });
  if (g.kind === 'REVIEW_REQUESTED') lines.push('Bạn được nhờ xem lại thay đổi này — hãy để lại góp ý hoặc chấp thuận trên ' + host + '.');
  // 5 commit MỚI NHẤT (commit cuối là cái tiêu đề thư nhắc tới), giữ thứ tự thời gian.
  const shown = g.commits.slice(-5);
  const list: WorkEmailParts['list'] = shown.length
    ? {
        title: g.kind === 'PUSH' ? 'Commit trong lần đẩy này' : 'Commit',
        items: shown.map((c) => ({ mono: c.sha.slice(0, 7), text: firstLine(c.message, 140) || '(không có thông điệp)', url: c.url || null })),
        more: g.commitCount > shown.length ? `… và ${g.commitCount - shown.length} commit trước đó` : null,
      }
    : null;
  const details: Array<{ label: string; value: string }> = [];
  if (isPr && (g.data?.headRef || g.data?.baseRef)) details.push({ label: 'Nhánh', value: `${g.data?.headRef ?? '?'} → ${g.data?.baseRef ?? '?'}` });
  if (g.issues.length) details.push({ label: 'Thẻ liên quan', value: g.issues.map((i) => `${i.key} · ${i.title}`).join(' ; ') });
  const note = g.kind === 'PUSH' && g.data?.forced
    ? 'Lần đẩy này ghi đè lịch sử nhánh (force push) — commit cũ trên nhánh có thể đã bị thay.'
    : g.kind === 'PUSH' && g.data?.created ? 'Đây là lần đẩy đầu tiên, tạo nhánh mới.' : null;
  const { html, text } = renderWorkEmail({
    lang: 'vi',
    preheader: gitTopic(g) || gitSentence(g, true),
    hero: g.project.color ? { url: null, color: g.project.color, alt: '' } : null,
    person: { name: g.actor, caption: `hoạt động trên ${host}` },
    heading: gitSentence(g, true),
    lines, list, details, note,
    cta: { label: 'Xem trong CT Work', url: abs(g.url) },
    secondaryLink: g.externalUrl ? { label: `Xem trên ${host}`, url: g.externalUrl } : null,
    secondary: [gitEnglish(g)],
    reason: g.kind === 'REVIEW_REQUESTED'
      ? `Bạn nhận thư này vì được nhờ review ${prLabel(g)} trong dự án ${g.project.name} trên CT Work.`
      : `Bạn nhận thư này vì được giao thẻ liên quan hoặc là quản trị dự án ${g.project.name} — dự án đã nối kho mã ${host} với CT Work.`,
    ignore: '',
    manage: manageLine(', hoặc tắt riêng thông báo Git'),
  });
  return { subject: gitSubject(g), html, text };
}

/** Nạp sự kiện Git (secondaryEntityId của thông báo) thành đầu vào thư. null ⇒ dùng thư thường. */
export async function loadGitEmailInput(eventId: number, payload: Record<string, unknown>): Promise<GitEmailInput | null> {
  try {
    const ev = await prisma.workGitEvent.findUnique({
      where: { id: eventId },
      select: {
        kind: true, provider: true, repo: true, ref: true, prNumber: true, title: true, commitCount: true, commits: true, url: true, data: true,
        issueNumbers: true, projectId: true, actorName: true, actorLogin: true,
        project: { select: { key: true, name: true, color: true } },
      },
    });
    if (!ev) return null;
    const nums = [...new Set(ev.issueNumbers)].slice(0, 3);
    const issues = nums.length
      ? await prisma.workIssue.findMany({ where: { projectId: ev.projectId, number: { in: nums }, deletedAt: null }, select: { number: true, title: true } })
      : [];
    const rawCommits = Array.isArray(ev.commits) ? (ev.commits as Array<Record<string, unknown>>) : [];
    const data = (ev.data ?? {}) as Record<string, unknown>;
    return {
      kind: ev.kind,
      actor: str(payload.actor) || ev.actorName || ev.actorLogin || 'Một thành viên',
      provider: ev.provider,
      repo: ev.repo, ref: ev.ref, prNumber: ev.prNumber, title: ev.title, commitCount: ev.commitCount || rawCommits.length,
      commits: rawCommits.filter((c) => c && typeof c.sha === 'string').map((c) => ({
        sha: str(c.sha), message: str(c.message), url: typeof c.url === 'string' ? c.url : null, author: str(c.authorName) || str(c.authorLogin) || null,
      })),
      externalUrl: (ev.kind === 'PUSH' && typeof data.compare === 'string' ? data.compare : null) || ev.url,
      data: { forced: data.forced === true, created: data.created === true, baseRef: typeof data.baseRef === 'string' ? data.baseRef : null, headRef: typeof data.headRef === 'string' ? data.headRef : null },
      project: ev.project,
      issues: nums.map((n) => issues.find((i) => i.number === n)).filter((i): i is { number: number; title: string } => !!i).map((i) => ({ key: `${ev.project.key}-${i.number}`, title: i.title })),
      url: str(payload.url) || `/work`,
    };
  } catch (err) {
    logger.warn('[work] email: không nạp được sự kiện Git', { eventId, err: (err as Error).message });
    return null;
  }
}

// ─── Thư gộp ─────────────────────────────────────────────────────

export function buildDigestEmail(items: Array<{ subject: string; url?: string | null }>): Built {
  const n = items.length;
  const shown = items.slice(0, 50);
  const { html, text } = renderWorkEmail({
    lang: 'vi',
    preheader: shown.slice(0, 3).map((i) => i.subject).join(' · '),
    heading: 'Tóm tắt CT Work của bạn',
    lines: [{ rich: `Bạn có **${n} cập nhật mới** kể từ thư tóm tắt trước.` }],
    list: { items: shown.map((i) => ({ text: i.subject, url: i.url ? abs(i.url) : null })), more: n > 50 ? `… và ${n - 50} cập nhật khác` : null },
    cta: { label: 'Mở Việc của tôi', url: abs('/work?tab=my-work') },
    secondary: [`You have ${n} new update${n === 1 ? '' : 's'} in CT Work.`],
    reason: 'Bạn nhận thư này vì đã chọn nhận email gộp (hoặc có cập nhật trong giờ im lặng) trên CT Work.',
    ignore: '',
    manage: manageLine(),
  });
  return { subject: `Bạn có ${n} cập nhật mới trong CT Work`, html, text };
}

// ─── Nhắc việc buổi sáng (My work) ───────────────────────────────

export function buildMyWorkReminderEmail(items: Array<{ key: string; title: string; bucket: string; dueDate: string | null; url: string }>): Built {
  const n = items.length;
  const overdue = items.filter((i) => i.bucket === 'overdue').length;
  const vnDate = (d: string | null) => (d && /^\d{4}-\d{2}-\d{2}/.test(d) ? `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}` : d ?? '');
  const shown = items.slice(0, 20);
  const { html, text } = renderWorkEmail({
    lang: 'vi',
    preheader: shown.slice(0, 3).map((i) => `${i.key} ${i.title}`).join(' · '),
    heading: 'Việc cần làm hôm nay',
    lines: [{ rich: overdue
      ? `Bạn có **${n} việc** cần chú ý hôm nay, trong đó **${overdue} việc đã quá hạn**.`
      : `Bạn có **${n} việc** đến hạn hôm nay.` }],
    list: {
      items: shown.map((i) => ({ mono: i.key, text: i.title, url: abs(i.url), meta: i.bucket === 'overdue' ? `Quá hạn từ ${vnDate(i.dueDate)}` : 'Đến hạn hôm nay' })),
      more: n > shown.length ? `… và ${n - shown.length} việc khác` : null,
    },
    cta: { label: 'Mở Việc của tôi', url: abs('/work?tab=my-work') },
    secondary: [`${n} issue${n === 1 ? ' needs' : 's need'} your attention today.`],
    reason: 'Bạn nhận thư này vì đã bật email nhắc việc buổi sáng trên CT Work.',
    ignore: '',
    manage: manageLine(),
  });
  return { subject: overdue ? `CT Work: ${n} việc cần chú ý hôm nay (${overdue} quá hạn)` : `CT Work: ${n} việc đến hạn hôm nay`, html, text };
}
