/**
 * CT Work — CTW đợt 7b (C15): NHẬP từ Trello / Asana / Jira / CSV–Excel chung. Bộ đọc thuần ở importParsers.ts.
 *
 * Luồng (một tuyến, hai chế độ):
 *   1. dryRun = true  ⇒ đọc tệp, ghép cột (CSV/Excel), khớp NGƯỜI (email trước — tên chỉ là gợi ý), khớp TRẠNG THÁI, chỉ ra
 *      lỗi/cảnh báo TỪNG DÒNG + mục đã nhập trước (trùng) — KHÔNG ghi gì.
 *   2. dryRun = false ⇒ cùng tệp + lựa chọn người dùng đã chỉnh (people/statuses/mapping) ⇒ tạo thẻ theo thứ tự epic → thẻ →
 *      việc con, giữ bình luận (tác giả khớp được thì đứng tên, không thì ghi "originally by …"), nhãn, checklist ⇒ việc con
 *      (dự án không có loại Sub-task ⇒ checklist vào mô tả), hạn/bắt đầu/ngày tạo; người KHÔNG khớp ⇒ để trống + ghi chú
 *      trong mô tả. Kết quả lưu thành báo cáo (work_import_runs).
 *
 * Không trùng khi nhập lại: mỗi mục "giữ chỗ" một dòng work_import_records (UNIQUE dự án + nguồn + loại + mã ngoài) TRƯỚC khi
 * tạo thẻ ⇒ hai lượt nhập chạy song song cũng chỉ một lượt tạo được. Thẻ đã nhập bị xoá (thùng rác) ⇒ nhập lại được.
 *
 * Quyền: ADMIN dự án (như nhập CSV cũ); agent không nhập hàng loạt.
 */

import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { displayName } from './common.js';
import { emitWorkEvent } from './events.js';
import { parseCsv } from './exchange.service.js';
import { createIssue } from './issueChange.js';
import {
  crossCheck, IMPORT_SOURCES, MAP_FIELDS, parseAsana, parseJiraCsv, parseTable, parseTrello, tableFromSheet,
  type ColumnMapping, type ImportItem, type ImportPerson, type ImportSource, type ParsedImport,
} from './importParsers.js';
import { requireProject } from './permissions.js';
import { projectMembers } from './projects.service.js';
import { readXlsx } from './xlsxStyled.js';

export const importInput = z.object({
  source: z.enum(IMPORT_SOURCES),
  fileName: z.string().max(255).optional(),
  /** Chữ (JSON/CSV) hoặc base64 (Excel). */
  content: z.string().min(1).max(20_000_000),
  encoding: z.enum(['text', 'base64']).default('text'),
  mapping: z.record(z.enum(MAP_FIELDS), z.number().int().min(0).max(200).nullable()).optional(),
  /** personKey ⇒ id thành viên (null = để trống). */
  people: z.record(z.string().max(260), z.number().int().positive().nullable()).optional(),
  /** tên trạng thái nguồn (chữ thường) ⇒ id trạng thái của dự án. */
  statuses: z.record(z.string().max(120), z.number().int().positive()).optional(),
  dryRun: z.boolean().default(true),
});
export type ImportInput = z.infer<typeof importInput>;

const SOURCE_LABEL: Record<ImportSource, string> = { TRELLO: 'Trello', ASANA: 'Asana', JIRA: 'Jira', CSV: 'CSV/Excel', NOTION: 'Notion' };
const MAX_REPORT_LINES = 300;

// ─── Đọc tệp ─────────────────────────────────────────────────────

export function parseUpload(input: Pick<ImportInput, 'source' | 'content' | 'encoding' | 'mapping'>): ParsedImport {
  try {
    if (input.source === 'CSV' && input.encoding === 'base64') {
      const buf = Buffer.from(input.content, 'base64');
      if (buf.subarray(0, 4).toString('hex') === '504b0304') {
        let sheets;
        try { sheets = readXlsx(buf); } catch { throw new Error('Could not read this Excel file (.xlsx only — save .xls as .xlsx first)'); }
        const sheet = sheets.find((s) => s.maxRow >= 2) ?? sheets[0];
        if (!sheet) throw new Error('The workbook has no sheets');
        return parseTable(tableFromSheet(sheet), input.mapping as ColumnMapping | undefined);
      }
      return parseTable(parseCsv(buf.toString('utf8')), input.mapping as ColumnMapping | undefined);
    }
    const text = input.encoding === 'base64' ? Buffer.from(input.content, 'base64').toString('utf8') : input.content;
    switch (input.source) {
      case 'TRELLO': return parseTrello(text);
      case 'ASANA': return parseAsana(text);
      case 'JIRA': return parseJiraCsv(text);
      default: return parseTable(parseCsv(text), input.mapping as ColumnMapping | undefined);
    }
  } catch (e) {
    throw new BadRequestError((e as Error).message, 'WORK_IMPORT_BAD_FILE');
  }
}

// ─── Khớp người / trạng thái / loại ──────────────────────────────

interface Member { id: number; name: string; username: string; fullName: string | null; displayName: string | null; email: string | null }
export interface PersonMatch { key: string; name: string | null; email: string | null; userId: number | null; matchedBy: 'email' | 'name' | 'manual' | null; uses: number }

function collectPeople(items: ImportItem[]): Map<string, { p: ImportPerson; uses: number }> {
  const out = new Map<string, { p: ImportPerson; uses: number }>();
  const add = (p: ImportPerson | null) => { if (!p) return; const cur = out.get(p.key); if (cur) cur.uses += 1; else out.set(p.key, { p, uses: 1 }); };
  for (const it of items) { add(it.assignee); add(it.reporter); for (const c of it.comments) add(c.author); }
  return out;
}

export function matchPeople(items: ImportItem[], members: Member[], overrides: Record<string, number | null> = {}): Map<string, PersonMatch> {
  const byEmail = new Map(members.filter((m) => m.email).map((m) => [m.email!.toLowerCase(), m]));
  const out = new Map<string, PersonMatch>();
  for (const [key, { p, uses }] of collectPeople(items)) {
    let userId: number | null = null;
    let matchedBy: PersonMatch['matchedBy'] = null;
    if (Object.prototype.hasOwnProperty.call(overrides, key)) {
      const o = overrides[key];
      userId = o !== null && members.some((m) => m.id === o) ? o : null;
      matchedBy = userId ? 'manual' : null;
    } else if (p.email && byEmail.has(p.email)) {
      userId = byEmail.get(p.email)!.id; matchedBy = 'email';
    } else if (!p.email && p.name) {
      // Nguồn không xuất email (Trello, Jira) ⇒ gợi ý theo tên TRÙNG KHÍT (username / tên hiển thị / họ tên); người dùng sửa được.
      const n = p.name.trim().toLowerCase();
      const hit = members.filter((m) => [m.username, m.displayName, m.fullName].some((x) => x?.trim().toLowerCase() === n));
      if (hit.length === 1) { userId = hit[0].id; matchedBy = 'name'; }
    }
    out.set(key, { key, name: p.name, email: p.email, userId, matchedBy, uses });
  }
  return out;
}

// ─── Lõi ─────────────────────────────────────────────────────────

const textDoc = (text: string) => ({
  type: 'doc',
  content: text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p) => ({ type: 'paragraph', content: p.split('\n').flatMap((line, i) => [...(i ? [{ type: 'hardBreak' }] : []), ...(line ? [{ type: 'text', text: line.slice(0, 20_000) }] : [])]) })),
});

interface Plan {
  item: ImportItem;
  typeId: number;
  typeName: string;
  level: number;
  statusId: number | null;
  statusName: string;
  statusCat: string | null;
  duplicateOf: number | null;
  parentNote: string | null;
}

/** `preparsed` (CTW đợt 8b): nguồn đã đọc sẵn ngoài tệp (database Notion) — bỏ qua parseUpload, còn lại y nguyên. */
export async function runImport(userId: number, projectId: number, input: ImportInput, preparsed?: ParsedImport) {
  const access = await requireProject(userId, projectId, 'project.settings');
  if (access.principal === 'AGENT') throw new ForbiddenError('Agents cannot run bulk imports');
  const parsed = preparsed ?? parseUpload(input);
  const items = parsed.items;
  if (!items.length) throw new BadRequestError('The file has no items to import', 'WORK_IMPORT_EMPTY');
  crossCheck(items);

  const [types, statuses, membersRaw, labels, records, defaultWf] = await Promise.all([
    prisma.workIssueType.findMany({ where: { projectId, archived: false }, select: { id: true, key: true, name: true, level: true, workflowId: true } }),
    prisma.workStatus.findMany({ where: { workflow: { projectId } }, orderBy: { position: 'asc' }, select: { id: true, name: true, category: true, workflowId: true } }),
    projectMembers(projectId),
    prisma.workLabel.findMany({ where: { projectId }, select: { id: true, name: true } }),
    prisma.workImportRecord.findMany({ where: { projectId, source: parsed.source, kind: 'ISSUE' }, select: { id: true, externalId: true, issueId: true } }),
    prisma.workWorkflow.findFirst({ where: { projectId, isDefault: true }, select: { id: true } }),
  ]);
  if (!defaultWf) throw new BadRequestError('Project has no default workflow', 'WORK_NO_WORKFLOW');
  const emails = new Map((await prisma.user.findMany({ where: { id: { in: membersRaw.map((m) => m.id) } }, select: { id: true, email: true } })).map((u) => [u.id, u.email]));
  const members: Member[] = membersRaw.filter((m) => m.role !== 'CLIENT').map((m) => ({ id: m.id, name: displayName(m), username: m.username, fullName: m.fullName, displayName: m.displayName, email: emails.get(m.id) ?? null }));
  const people = matchPeople(items, members, input.people ?? {});
  const who = (p: ImportPerson | null) => (p ? people.get(p.key) ?? null : null);

  // Mục đã nhập trước: thẻ còn sống ⇒ trùng; thẻ đã xoá ⇒ được nhập lại.
  const alive = new Set((await prisma.workIssue.findMany({ where: { id: { in: records.map((r) => r.issueId) }, deletedAt: null }, select: { id: true } })).map((i) => i.id));
  const imported = new Map(records.map((r) => [r.externalId, r]));
  const issueNumbers = new Map((await prisma.workIssue.findMany({ where: { id: { in: [...alive] } }, select: { id: true, number: true } })).map((i) => [i.id, i.number]));

  const subtaskType = types.find((t) => t.level === -1) ?? null;
  const taskType = types.find((t) => t.key === 'TASK') ?? types.find((t) => t.level === 0);
  if (!taskType) throw new BadRequestError('This project has no standard issue type to import into', 'WORK_BAD_TYPE');
  const typeOf = (name: string | null) => {
    const s = (name ?? '').trim().toLowerCase();
    if (!s) return null;
    if (['sub-task', 'subtask', 'sub task', 'việc con'].includes(s)) return subtaskType;
    return types.find((t) => t.name.toLowerCase() === s || t.key.toLowerCase() === s) ?? null;
  };
  const statusChoice = new Map<string, { id: number; name: string; category: string } | null>();
  const statusFor = (it: ImportItem, workflowId: number) => {
    const raw = (it.statusName ?? '').trim();
    const k = raw.toLowerCase();
    const override = k && input.statuses?.[k];
    const inWf = statuses.filter((s) => s.workflowId === workflowId);
    let st = override ? inWf.find((s) => s.id === override) ?? null : null;
    if (!st && raw) st = inWf.find((s) => s.name.toLowerCase() === k) ?? null;
    if (!st && it.statusCategory) st = inWf.find((s) => s.category === it.statusCategory) ?? null;
    if (raw && workflowId === defaultWf.id) statusChoice.set(k, st);
    return st;
  };

  const plans: Plan[] = items.map((it) => {
    let t = typeOf(it.typeName);
    if (it.typeName && !t) { it.warnings.push(`Unknown type "${it.typeName}" — imported as ${taskType.name}`); }
    if (t && t.level === -1 && !it.parentExternalId) { it.warnings.push('A sub-task without a parent — imported as a task'); t = null; }
    if (t && t.level === -1 && !subtaskType) t = null;
    const type = t ?? taskType;
    const st = statusFor(it, type.workflowId ?? defaultWf.id);
    if (it.statusName && !st) it.warnings.push(`Status "${it.statusName}" not found — imported into the first status`);
    const rec = imported.get(it.externalId);
    const duplicateOf = rec && alive.has(rec.issueId) ? rec.issueId : null;
    for (const role of ['assignee', 'reporter'] as const) {
      const p = it[role];
      if (p && !who(p)?.userId) it.warnings.push(`${role === 'assignee' ? 'Assignee' : 'Reporter'} "${p.name ?? p.email}" has no matching member — left empty, noted in the description`);
    }
    return { item: it, typeId: type.id, typeName: type.name, level: type.level, statusId: st?.id ?? null, statusName: st?.name ?? '(first status)', statusCat: st?.category ?? null, duplicateOf, parentNote: null };
  });
  // Cha: trong tệp (theo mã) hoặc thẻ đã nhập từ lượt trước.
  const byExt = new Map(plans.map((p) => [p.item.externalId, p]));
  for (const p of plans) {
    const pe = p.item.parentExternalId;
    if (!pe) continue;
    const local = byExt.get(pe);
    const prevLevel = local ? local.level : imported.has(pe) && alive.has(imported.get(pe)!.issueId) ? 0 : null;
    if (prevLevel === null) {
      if (p.level === -1) { p.level = taskType.level; p.typeId = taskType.id; p.typeName = taskType.name; p.item.warnings.push('Parent not found — imported as a task'); }
      p.item.parentExternalId = null;
    } else if (prevLevel !== p.level + 1) {
      p.item.warnings.push(`Parent "${pe}" is not one level up — link ignored`);
      p.item.parentExternalId = null;
    }
  }

  const preview = plans.map((p) => ({
    row: p.item.row, externalId: p.item.externalId, title: p.item.title, type: p.typeName, status: p.statusName,
    assignee: p.item.assignee ? (who(p.item.assignee)?.userId ? members.find((m) => m.id === who(p.item.assignee)!.userId)?.name ?? null : null) : null,
    assigneeSource: p.item.assignee?.name ?? p.item.assignee?.email ?? null,
    labels: p.item.labels, due: p.item.due, comments: p.item.comments.length, checklist: p.item.checklist.length,
    duplicate: p.duplicateOf ? { issueNumber: issueNumbers.get(p.duplicateOf) ?? null } : null,
    errors: p.item.errors, warnings: p.item.warnings,
  }));
  const valid = plans.filter((p) => !p.item.errors.length);
  const summary = {
    total: plans.length, valid: valid.length, invalid: plans.length - valid.length,
    duplicates: valid.filter((p) => p.duplicateOf).length, toCreate: valid.filter((p) => !p.duplicateOf).length,
    comments: valid.filter((p) => !p.duplicateOf).reduce((s, p) => s + p.item.comments.length, 0),
    checklistItems: valid.filter((p) => !p.duplicateOf).reduce((s, p) => s + p.item.checklist.length, 0),
  };
  const peopleOut = [...people.values()].sort((a, b) => b.uses - a.uses);
  const statusesOut = [...statusChoice].map(([name, st]) => ({ name, statusId: st?.id ?? null, statusName: st?.name ?? null }));
  const common = {
    source: parsed.source, notes: parsed.notes, columns: parsed.columns ?? null, mapping: parsed.mapping ?? null, summary, people: peopleOut,
    statuses: statusesOut, members: members.map((m) => ({ id: m.id, name: m.name, email: m.email })),
    projectStatuses: statuses.filter((s) => s.workflowId === defaultWf.id).map((s) => ({ id: s.id, name: s.name, category: s.category })),
    hasSubtaskType: !!subtaskType,
  };
  if (input.dryRun) return { dryRun: true as const, ...common, rows: preview };

  // ── Nhập thật ──
  const run = await prisma.workImportRun.create({ data: { projectId, source: parsed.source, fileName: input.fileName?.slice(0, 255) ?? null, createdById: userId } });
  const actor = { kind: 'USER' as const, userId };
  const createdIds = new Map<string, number>(); // externalId ⇒ issue id
  for (const r of records) if (alive.has(r.issueId)) createdIds.set(r.externalId, r.issueId);
  const labelIds = new Map(labels.map((l) => [l.name.toLowerCase(), l.id]));
  const firstStatus = new Map<number, { id: number; cat: string }>();
  const doneStatus = new Map<number, number | null>();
  for (const s of statuses) {
    if (!firstStatus.has(s.workflowId)) firstStatus.set(s.workflowId, { id: s.id, cat: s.category });
    if (s.category === 'DONE' && !doneStatus.has(s.workflowId)) doneStatus.set(s.workflowId, s.id);
  }
  const failures: Array<{ row: number; error: string }> = [];
  const warnings: string[] = [];
  let created = 0, subtasks = 0, comments = 0, labelsAdded = 0;
  const unmatched = new Set<string>();
  const src = SOURCE_LABEL[parsed.source];

  /** Giữ chỗ mã ngoài (UNIQUE) — trả false nếu lượt khác đã giữ ⇒ bỏ qua (không tạo trùng). */
  const claim = async (kind: 'ISSUE' | 'SUBTASK', externalId: string) => {
    // Bản ghi cũ trỏ thẻ đã xoá ⇒ gỡ để nhập lại. issueId 0 = lượt khác đang tạo ⇒ nhường.
    const old = await prisma.workImportRecord.findFirst({ where: { projectId, source: parsed.source, kind, externalId: externalId.slice(0, 200) } });
    if (old) {
      if (!old.issueId) return null;
      const live = await prisma.workIssue.findFirst({ where: { id: old.issueId, deletedAt: null }, select: { id: true } });
      if (live) return null;
      await prisma.workImportRecord.deleteMany({ where: { id: old.id, issueId: old.issueId } });
    }
    try {
      const r = await prisma.workImportRecord.create({ data: { projectId, source: parsed.source, kind, externalId: externalId.slice(0, 200), issueId: 0, runId: run.id } });
      return r.id;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') return null;
      throw err;
    }
  };

  for (const level of [1, 0, -1]) {
    for (const p of valid.filter((x) => x.level === level && !x.duplicateOf)) {
      const it = p.item;
      const recId = await claim('ISSUE', it.externalId);
      if (!recId) { warnings.push(`Row ${it.row}: already imported by another run — skipped`); continue; }
      try {
        const notes: string[] = [];
        const a = who(it.assignee), rp = who(it.reporter);
        if (it.assignee && !a?.userId) { notes.push(`Originally assigned to ${it.assignee.name ?? it.assignee.email} (no matching CT Work member).`); unmatched.add(it.assignee.name ?? it.assignee.email ?? '?'); }
        if (it.reporter && !rp?.userId) { notes.push(`Originally reported by ${it.reporter.name ?? it.reporter.email}.`); unmatched.add(it.reporter.name ?? it.reporter.email ?? '?'); }
        const checklistInDesc = it.checklist.length && !subtaskType ? `Checklist:\n${it.checklist.map((c) => `${c.done ? '[x]' : '[ ]'} ${c.title}`).join('\n')}` : '';
        const body = [it.description, checklistInDesc, [`Imported from ${src} (${it.externalId}).`, ...notes].join(' ')].filter(Boolean).join('\n\n');
        const parentId = it.parentExternalId ? createdIds.get(it.parentExternalId) ?? null : null;
        const issue = await createIssue({
          projectId, typeId: p.typeId, title: it.title, statusId: p.statusId ?? undefined, parentId,
          priority: it.priority ?? undefined, assigneeId: a?.userId ?? null, reporterId: rp?.userId ?? userId,
          storyPoints: it.storyPoints, dueDate: it.due ? new Date(`${it.due}T00:00:00Z`) : null, startDate: it.start ? new Date(`${it.start}T00:00:00Z`) : null,
          descriptionJson: textDoc(body) as Prisma.InputJsonValue,
        }, actor);
        await prisma.workImportRecord.update({ where: { id: recId }, data: { issueId: issue.id } });
        alive.add(issue.id);
        createdIds.set(it.externalId, issue.id);
        created += 1;
        if (p.statusCat === 'DONE' || it.created) {
          await prisma.workIssue.update({ where: { id: issue.id }, data: { ...(p.statusCat === 'DONE' ? { resolvedAt: new Date(), resolution: 'DONE' } : {}), ...(it.created ? { createdAt: new Date(`${it.created}T00:00:00Z`) } : {}) } });
        }
        for (const n of it.labels) {
          const name = n.slice(0, 40);
          let lid = labelIds.get(name.toLowerCase());
          if (!lid) { lid = (await prisma.workLabel.upsert({ where: { uk_work_label: { projectId, name } }, create: { projectId, name }, update: {} })).id; labelIds.set(name.toLowerCase(), lid); }
          const r = await prisma.workIssueLabel.createMany({ data: [{ issueId: issue.id, labelId: lid }], skipDuplicates: true });
          labelsAdded += r.count;
        }
        for (const c of it.comments.slice(0, 500)) {
          const author = who(c.author);
          if (c.author && !author?.userId) unmatched.add(c.author.name ?? c.author.email ?? '?');
          const prefix = author?.userId ? '' : `[Imported from ${src}${c.author ? ` — originally by ${c.author.name ?? c.author.email}` : ''}${c.at ? `, ${c.at.slice(0, 10)}` : ''}]\n`;
          const text = `${prefix}${c.text}`.slice(0, 20_000);
          const at = c.at && !Number.isNaN(Date.parse(c.at)) ? new Date(c.at) : undefined;
          await prisma.workComment.create({ data: { issueId: issue.id, authorId: author?.userId ?? userId, bodyJson: textDoc(text) as Prisma.InputJsonValue, bodyText: text, visibility: 'INTERNAL', ...(at ? { createdAt: at } : {}) } });
          comments += 1;
        }
        if (subtaskType && it.checklist.length) {
          const wf = subtaskType.workflowId ?? defaultWf.id;
          for (const [i, c] of it.checklist.slice(0, 100).entries()) {
            const ext = `${it.externalId}#${i + 1}`;
            const sid = await claim('SUBTASK', ext);
            if (!sid) continue;
            const st = c.done ? doneStatus.get(wf) ?? null : null;
            const sub = await createIssue({ projectId, typeId: subtaskType.id, title: c.title, parentId: issue.id, statusId: st ?? undefined, reporterId: userId }, actor);
            if (st) await prisma.workIssue.update({ where: { id: sub.id }, data: { resolvedAt: new Date(), resolution: 'DONE' } });
            await prisma.workImportRecord.update({ where: { id: sid }, data: { issueId: sub.id } });
            subtasks += 1;
          }
        } else if (it.checklist.length) warnings.push(`Row ${it.row}: no Sub-task type in this project — checklist kept in the description`);
        for (const w of it.warnings) if (warnings.length < MAX_REPORT_LINES) warnings.push(`Row ${it.row}: ${w}`);
      } catch (err) {
        await prisma.workImportRecord.delete({ where: { id: recId } }).catch(() => {});
        failures.push({ row: it.row, error: err instanceof Error ? err.message : String(err) });
      }
    }
  }
  const duplicates = valid.filter((p) => p.duplicateOf).length;
  const report = {
    subtasks, comments, labels: labelsAdded, invalid: plans.length - valid.length,
    unmatchedPeople: [...unmatched].slice(0, 100), warnings: warnings.slice(0, MAX_REPORT_LINES), failures: failures.slice(0, MAX_REPORT_LINES),
    invalidRows: plans.filter((p) => p.item.errors.length).slice(0, MAX_REPORT_LINES).map((p) => ({ row: p.item.row, errors: p.item.errors })),
    notes: parsed.notes,
  };
  await prisma.workImportRun.update({ where: { id: run.id }, data: { created, duplicates, failed: failures.length, report: report as unknown as Prisma.InputJsonValue } });
  emitWorkEvent({ type: 'project.updated', projectId, actor });
  await auditProject(projectId, { actorId: userId, action: 'project.import', targetType: 'project', targetId: projectId, summary: `Imported ${created} issues from ${src} (${duplicates} already imported, ${failures.length} failed)`, detail: { runId: run.id, created, duplicates, failed: failures.length, subtasks, comments } });
  return { dryRun: false as const, runId: run.id, source: parsed.source, created, duplicates, failed: failures.length, ...report };
}

export async function listRuns(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const rows = await prisma.workImportRun.findMany({ where: { projectId }, orderBy: { id: 'desc' }, take: 30 });
  const users = new Map((await prisma.user.findMany({ where: { id: { in: rows.map((r) => r.createdById).filter((x): x is number => !!x) } }, select: { id: true, username: true, displayName: true, fullName: true } })).map((u) => [u.id, displayName(u)]));
  return rows.map((r) => ({ id: r.id, source: r.source, fileName: r.fileName, createdAt: r.createdAt, by: r.createdById ? users.get(r.createdById) ?? null : null, created: r.created, duplicates: r.duplicates, failed: r.failed, report: r.report }));
}
