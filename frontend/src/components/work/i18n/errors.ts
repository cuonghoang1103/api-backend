/**
 * Lỗi máy chủ ⇒ câu theo ngôn ngữ CT Work, CHỈ ở phía frontend (máy chủ giữ nguyên câu tiếng Anh + `code`).
 *
 * Thứ tự: mã riêng (WORK_*) → câu gốc khớp nguyên văn → mẫu "… not found" / "Someone else … changed this …" →
 * theo mã HTTP (401/403/413/429/5xx) → không khớp gì thì trả câu gốc của máy chủ.
 * Tiếng Anh: giữ câu máy chủ (trừ lỗi mạng / 5xx, vốn không có câu tử tế).
 */
import { translate, type WKey, type WorkLocale } from './core';

const BY_CODE: Record<string, WKey> = {
  WORK_EDIT_LOCKED: 'errors.editLocked',
  WORK_STALE: 'errors.staleGeneric',
  WORK_SPEC_STALE: 'errors.staleGeneric',
  WORK_AI_UNAVAILABLE: 'errors.aiUnavailable',
  WORK_AI_TOKEN_CAP: 'errors.aiTokenCap',
  WORK_AI_BAD_OUTPUT: 'errors.aiBadOutput',
  WORK_AI_BAD_REPLY: 'errors.aiBadOutput',
  WORK_AI_BAD_ANSWER: 'errors.aiBadOutput',
  WORK_AGENT_PAUSED: 'errors.agentPaused',
  WORK_AGENT_RETIRED: 'errors.agentRetired',
  WORK_INTERNAL_ONLY: 'errors.internalOnly',
  WORK_FINANCE_FORBIDDEN: 'errors.financeForbidden',
  WORK_EXPORT_EXPIRED: 'errors.exportExpired',
  WORK_EXPORT_LINK_EXPIRED: 'errors.exportExpired',
  WORK_EXPORT_RUNNING: 'errors.busy',
  WORK_EXPORT_BUSY: 'errors.busy',
  WORK_IMPORT_RUNNING: 'errors.busy',
  WORK_IMPORT_BUSY: 'errors.busy',
  WORK_IMPORT_TOO_LARGE: 'errors.importTooLarge',
  WORK_LEASE_TAKEN: 'errors.leaseTaken',
  WORK_STORAGE_OFF: 'errors.storageOff',
  WORK_URL_BLOCKED: 'errors.urlBlocked',
  WORK_WEB_LINK_DUPLICATE: 'errors.duplicateLink',
  WORK_APPROVAL_NOT_YOUR_TURN: 'errors.notYourTurn',
  PAYLOAD_TOO_LARGE: 'errors.tooLarge',
  UNAUTHORIZED: 'errors.unauthorized',
};

const BY_MESSAGE: Record<string, WKey> = {
  'Title is required': 'errors.titleRequired',
  'Nothing to change': 'errors.nothingToChange',
  'Files must be 25 MB or smaller': 'errors.fileTooBig25',
  '"From" must be before "to"': 'errors.fromBeforeTo',
  'The end date must be after the start date': 'errors.endAfterStart',
  'This issue is already done': 'errors.alreadyDone',
  'This invitation has already been used': 'errors.inviteUsed',
  'The file is empty': 'errors.fileEmpty',
  'Use a PNG, JPEG, WebP or GIF image': 'errors.imageType',
  'You can read this page but not edit it': 'errors.readNotEdit',
  'You cannot edit issues in this project': 'errors.cannotEditIssues',
  'You cannot comment in this project': 'errors.cannotComment',
  'Already linked': 'errors.alreadyLinked',
  'That workspace URL is taken, try another name': 'errors.workspaceUrlTaken',
  'The board changed while you were dragging. Reload and try again.': 'errors.boardChanged',
  'You do not have permission to do this in this project': 'errors.forbiddenProject',
  'You do not have permission to do this in this workspace': 'errors.forbiddenWorkspace',
  'Access denied': 'errors.forbidden',
  'Internal Server Error': 'errors.server',
};

const NOUN: Record<string, WKey> = {
  issue: 'errors.nIssue', project: 'errors.nProject', workspace: 'errors.nWorkspace', sprint: 'errors.nSprint',
  version: 'errors.nVersion', comment: 'errors.nComment', member: 'errors.nMember', document: 'errors.nDocument',
  meeting: 'errors.nMeeting', label: 'errors.nLabel', link: 'errors.nLink', stage: 'errors.nStage',
  function: 'errors.nFunction', rule: 'errors.nRule', attachment: 'errors.nAttachment', agent: 'errors.nAgent',
  report: 'errors.nReport', token: 'errors.nToken', 'change request': 'errors.nChangeRequest', 'use case': 'errors.nUseCase',
  item: 'errors.nItem', question: 'errors.nQuestion',
};

export interface ErrorShape { status?: number; code?: string; message?: string; network?: boolean }

/** Trả câu đã dịch, hoặc null = giữ câu gốc. */
export function localizeError(locale: WorkLocale, e: ErrorShape): string | null {
  if (e.network) return translate(locale, 'errors.network');
  if (e.status && e.status >= 500) return translate(locale, 'errors.server');
  if (locale === 'en') return null;
  const msg = (e.message ?? '').trim();
  if (e.code && BY_CODE[e.code]) return translate(locale, BY_CODE[e.code]);
  if (msg && BY_MESSAGE[msg]) return translate(locale, BY_MESSAGE[msg]);
  const nf = /^(.+?) not found(?: in this (?:project|workspace|team queue))?\.?$/i.exec(msg);
  if (nf) {
    const k = NOUN[nf[1].toLowerCase()];
    return k ? translate(locale, 'errors.notFound', { thing: translate(locale, k) }) : translate(locale, 'errors.notFoundGeneric');
  }
  const stale = /^Someone else (?:just )?changed this ([a-z ]+?)(?:\s*[—.-]|$)/i.exec(msg);
  if (stale) {
    const k = NOUN[stale[1].toLowerCase()];
    return k ? translate(locale, 'errors.staleThing', { thing: translate(locale, k) }) : translate(locale, 'errors.staleGeneric');
  }
  if (e.status === 401) return translate(locale, 'errors.unauthorized');
  if (e.status === 413) return translate(locale, 'errors.tooLarge');
  if (e.status === 429) return translate(locale, 'errors.rateLimited');
  if (e.status === 403) {
    // Câu từ chối cụ thể của máy chủ (vd "Only project admins can …") chưa có bản dịch ⇒ câu chung + nguyên văn.
    const generic = translate(locale, 'errors.forbidden');
    return !msg || /^(Forbidden|Access denied)$/i.test(msg) ? generic : `${generic} (${msg})`;
  }
  return null;
}
