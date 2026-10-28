/**
 * CT Work — TÌM LỆNH cho trợ lý web (28/10/2026, "trợ lý làm được mọi việc như trên web").
 *
 * VÌ SAO. Token người trên MCP thấy ~279 lệnh; trợ lý web (Ask AI) trước nay chỉ thấy ~145 lệnh "đường Ask" và nhét CẢ
 * mục lục chữ ký của chúng vào MỖI câu hỏi (~35k ký tự lệnh ghi + ~6k lệnh xoá). Mở thêm 130 lệnh theo kiểu đó là gấp đôi
 * tiền prompt. Thay vào đó (nạp lệnh ĐỘNG):
 *   - prompt chỉ mang ~20 lệnh hay dùng KÈM tham số + MỤC LỤC TÊN của mọi lệnh khác (một dòng mỗi nhóm);
 *   - model gọi tool `find_commands` (tên chính xác hoặc từ khoá) ⇒ nhận mô tả đầy đủ + tham số của ≤ 8 lệnh khớp;
 *   - đọc/đề xuất vẫn qua `read_command` / khối <ctw-actions> như cũ — CÙNG hàm `run` của registry, CÙNG quyền như MCP.
 *
 * File này THUẦN (không DB, không LLM): xếp hạng tìm kiếm, in tham số, dựng mục lục. Test: registry.test.ts + aiTroLyWeb.test.ts.
 */

import { z } from 'zod';
import type { ToolDef } from './types.js';

// ─── In kiểu tham số (sâu hơn mục lục trong prompt: model cần đủ để viết đúng args) ───

function kieu(t: z.ZodTypeAny, sau = 0): string {
  if (t instanceof z.ZodOptional) return kieu(t.unwrap(), sau);
  if (t instanceof z.ZodNullable) return `${kieu(t.unwrap(), sau)}|null`;
  if (t instanceof z.ZodDefault) return kieu(t._def.innerType, sau);
  if (t instanceof z.ZodEffects) return kieu(t.innerType(), sau);
  if (t instanceof z.ZodString) return 'string';
  if (t instanceof z.ZodNumber) return t.isInt ? 'int' : 'number';
  if (t instanceof z.ZodBoolean) return 'boolean';
  if (t instanceof z.ZodEnum) return (t.options as string[]).map((o) => JSON.stringify(o)).join('|');
  if (t instanceof z.ZodNativeEnum) return Object.values(t.enum as Record<string, string>).map((o) => JSON.stringify(o)).join('|');
  if (t instanceof z.ZodLiteral) return JSON.stringify(t.value);
  if (t instanceof z.ZodArray) {
    const max = (t._def.maxLength as { value: number } | null)?.value;
    return `${sau > 4 ? 'object' : `(${kieu(t.element, sau + 1)})`}[]${max ? `≤${max}` : ''}`;
  }
  if (t instanceof z.ZodUnion) return (t.options as z.ZodTypeAny[]).map((o) => kieu(o, sau + 1)).join('|');
  if (t instanceof z.ZodTuple) return `[${(t.items as z.ZodTypeAny[]).map((o) => kieu(o, sau + 1)).join(',')}]`;
  if (t instanceof z.ZodRecord) return 'object';
  if (t instanceof z.ZodObject) {
    if (sau > 4) return 'object';
    return `{${Object.entries(t.shape as Record<string, z.ZodTypeAny>).map(([k, v]) => `${k}${v.isOptional() ? '?' : ''}:${kieu(v, sau + 1)}`).join(', ')}}`;
  }
  return 'any';
}

function moTa(t: z.ZodTypeAny): string | undefined {
  let cur: z.ZodTypeAny | undefined = t;
  for (let i = 0; cur && i < 4; i++) {
    if (cur.description) return cur.description;
    cur = cur instanceof z.ZodOptional || cur instanceof z.ZodNullable ? cur.unwrap() : cur instanceof z.ZodDefault ? cur._def.innerType : undefined;
  }
  return undefined;
}

/** Mô tả ĐẦY ĐỦ một lệnh cho model: tên, loại (đọc/ghi/xoá), mô tả, từng tham số (bỏ `project` — mã tự điền). */
export function chiTietLenh(t: ToolDef): string {
  const nhan = t.destructive ? ' [WRITE · DELETE — becomes a deletion request the team lead approves]' : t.write ? ' [WRITE — propose it, the user applies]' : ' [READ — run it with read_command]';
  const thamSo = Object.entries(t.input.shape as Record<string, z.ZodTypeAny>)
    .filter(([k]) => k !== 'project')
    .map(([k, v]) => {
      const d = moTa(v);
      return `  - ${k}${v.isOptional() ? '?' : ''}: ${kieu(v)}${d ? ` — ${d.slice(0, 240)}` : ''}`;
    });
  return `${t.name}${nhan}\n  ${t.description.slice(0, 1200)}\n${thamSo.length ? `  args:\n${thamSo.join('\n')}` : '  args: none'}`;
}

// ─── Tìm theo từ khoá ────────────────────────────────────────────

/** Bỏ dấu tiếng Việt + chữ thường (người dùng hay gõ không dấu; model hay gõ có dấu). */
export function boDau(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

/**
 * Từ tiếng Việt (đã bỏ dấu) ⇒ từ khoá tiếng Anh của registry. Model thường tìm bằng tiếng Anh; bảng này cho câu tìm
 * tiếng Việt ("xoá dòng 5.1", "biên bản họp") ra đúng lệnh. Khoá nhiều chữ được thử trước khoá một chữ.
 */
const DONG_NGHIA: Array<[string, string[]]> = [
  ['5.1', ['fpt_unit', 'unit']], ['5.2', ['fpt_it', 'integration']], ['5.3', ['fpt_it', 'system']], ['report 3', ['report3']],
  ['utcid', ['fpt_unit', 'case']], ['bien ban', ['minutes', 'meeting']], ['cuoc hop', ['meeting']], ['rui ro', ['raid', 'risk']],
  ['thanh vien', ['member']], ['tai lieu', ['docs', 'page']], ['binh luan', ['comment']], ['ghi gio', ['log_work', 'worklog']],
  ['phien ban', ['version']], ['yeu cau', ['requirement', 'request']], ['man hinh', ['screen']], ['khao sat', ['survey']],
  ['cac ben', ['stakeholder']], ['thuat ngu', ['glossary']], ['hoi dap', ['qna']], ['so do', ['diagram']], ['thay doi', ['change']],
  ['bao cao', ['report']], ['ket qua', ['result', 'record']], ['kiem thu', ['test']], ['nhap excel', ['import', 'excel']],
  ['thung rac', ['restore', 'trash']], ['khoi phuc', ['restore']], ['dong gop', ['contrib']], ['bai tap', ['assignment']],
  ['use case', ['use_case']], ['quy tac', ['rule']], ['dieu kien', ['condition']], ['vong', ['round']], ['luong', ['workflow']],
  ['xoa', ['delete', 'remove']], ['sua', ['update', 'edit']], ['them', ['add', 'create']], ['tao', ['create', 'add']],
  ['doc', ['read', 'get', 'list']], ['tim', ['search', 'find']], ['hop', ['meeting']], ['nhan', ['label']], ['tuan', ['weekly']],
  ['xuat', ['export']], ['tai', ['export', 'download']], ['duyet', ['approval', 'review']], ['chay', ['run']], ['ham', ['function']],
  ['the', ['issue']], ['kenh', ['channel', 'chat']], ['lop', ['class']], ['gan', ['link', 'assign']], ['chuyen', ['move', 'transition']],
  ['dat lich', ['schedule', 'meeting']], ['sap xep', ['move', 'order']], ['nhan ban', ['duplicate', 'clone']], ['ma tran', ['matrix', 'fpt_unit']],
];

/** Câu tìm ⇒ các từ khoá (đã bỏ dấu, đã thêm từ đồng nghĩa). */
export function tuKhoa(q: string): string[] {
  let s = ` ${boDau(q).replace(/[^a-z0-9_.\s-]/g, ' ').replace(/\s+/g, ' ')} `;
  const out = new Set<string>();
  for (const [vi, en] of DONG_NGHIA) {
    if (s.includes(` ${vi} `)) {
      for (const e of en) out.add(e);
      s = s.replace(` ${vi} `, ' ');
    }
  }
  for (const w of s.split(/[\s-]+/)) if (w.length >= 2 && !BO_QUA.has(w)) out.add(w.replace(/\.$/, ''));
  return [...out];
}
const BO_QUA = new Set(['the', 'a', 'an', 'of', 'to', 'for', 'and', 'or', 'in', 'on', 'my', 'cua', 'cho', 'va', 'mot', 'cac', 'nhung', 'trong']);

function diem(t: ToolDef, kw: string[]): number {
  const ten = t.name.toLowerCase();
  const manh = ten.split('_');
  const tieuDe = boDau(t.title);
  const moTaLenh = boDau(t.description);
  let d = 0;
  for (const k of kw) {
    if (ten === k) d += 100;
    else if (k.includes('_') && ten.includes(k)) d += 12;
    else if (manh.includes(k)) d += 6;
    else if (ten.includes(k)) d += 3;
    if (new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(tieuDe)) d += 3;
    if ((t.group ?? '') === k) d += 2;
    if (moTaLenh.includes(k)) d += 1;
  }
  return d;
}

export interface TimLenhInput { query?: string | null; names?: string[] | null; group?: string | null; limit?: number | null }

/**
 * Tìm lệnh trong `list` (đã lọc theo quyền người hỏi). `names` ⇒ đúng các lệnh đó (tên lạ ⇒ báo không có); `query` ⇒ xếp
 * hạng theo tên/tiêu đề/nhóm/mô tả; `group` ⇒ lọc nhóm. Trả CHỮ cho model (mô tả đầy đủ + tham số), trần ~14k ký tự.
 */
export function timLenh(list: ToolDef[], input: TimLenhInput): string {
  const limit = Math.min(Math.max(input.limit ?? 6, 1), 10);
  const byName = new Map(list.map((t) => [t.name, t]));
  const parts: string[] = [];
  const names = (input.names ?? []).map((n) => String(n).trim()).filter(Boolean).slice(0, 10);
  const found: ToolDef[] = [];
  const missing: string[] = [];
  for (const n of names) {
    const t = byName.get(n);
    if (t) found.push(t); else missing.push(n);
  }
  let pool = input.group ? list.filter((t) => (t.group ?? 'other') === input.group) : list;
  if (input.query?.trim()) {
    const kw = tuKhoa(input.query);
    pool = pool.map((t) => [t, diem(t, kw)] as const).filter(([, d]) => d > 0).sort((a, b) => b[1] - a[1]).map(([t]) => t);
  } else if (!input.group) pool = [];
  for (const t of pool) {
    if (found.length >= limit) break;
    if (!found.includes(t)) found.push(t);
  }
  if (missing.length) parts.push(`Not available to this user here: ${missing.join(', ')} (unknown name, or this person's role cannot use it on the web).`);
  if (!found.length) parts.push('No matching command. Try other English keywords (e.g. "unit test rows", "meeting minutes", "risk"), or tell the user this cannot be done from the assistant.');
  let room = 14_000;
  for (const t of found) {
    const s = chiTietLenh(t);
    if (s.length > room) break;
    parts.push(s);
    room -= s.length;
  }
  return parts.join('\n\n');
}

// ─── Mục lục TÊN (một dòng mỗi nhóm) ─────────────────────────────

const TEN_NHOM: Record<string, string> = {
  issues: 'issues', docs: 'docs', tests: 'tests (5.1 = fpt_unit_*, 5.2/5.3 = fpt_it_*, Xray = test_*)', planning: 'planning (sprints, meetings, RAID, reports, members)',
  srs: 'requirements (SRS / SWR302)', chat: 'chat', export: 'export', other: 'other',
};

/**
 * Mọi lệnh theo nhóm, chỉ TÊN: `*` = ghi (đề xuất), `!` = xoá (thành yêu cầu chờ trưởng nhóm duyệt). Lệnh trong `boQua`
 * (đã in kèm tham số ở phần "hay dùng") không lặp lại.
 */
export function mucLucTen(list: ToolDef[], boQua: Set<string> = new Set()): string {
  const nhom = new Map<string, string[]>();
  for (const t of list) {
    if (boQua.has(t.name)) continue;
    const g = t.group ?? 'other';
    if (!nhom.has(g)) nhom.set(g, []);
    nhom.get(g)!.push(`${t.name}${t.destructive ? '!' : t.write ? '*' : ''}`);
  }
  return [...nhom.entries()].map(([g, ns]) => `- ${TEN_NHOM[g] ?? g}: ${ns.join(' ')}`).join('\n');
}
