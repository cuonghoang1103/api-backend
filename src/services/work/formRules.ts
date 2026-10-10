/**
 * CT Work — CTW đợt 7b (C8 Forms): LUẬT THUẦN của biểu mẫu tạo thẻ (không DB) — test ở ctw7b.test.ts.
 *
 * Tổng quát hoá loại yêu cầu của service desk (slaRules.RequestTypeConfig: text/textarea/date, tối đa 8 trường, cố định
 * 4 loại) thành biểu mẫu tuỳ ý: 8 kiểu trường, logic ẩn/hiện một tầng ("hiện khi trường X = giá trị"), ánh xạ sang thẻ
 * (loại, nhãn, người làm, ưu tiên, trường tuỳ chỉnh, mẫu tiêu đề).
 *
 *   normalizeFields   — chuẩn hoá cấu hình người soạn gửi lên (id hợp lệ, không trùng, showIf trỏ về trường ĐỨNG TRƯỚC).
 *   visibleFields     — trường nào đang hiện với bộ câu trả lời này (ẩn ⇒ bỏ câu trả lời, không bắt buộc).
 *   validateAnswers   — kiểm từng câu theo kiểu ⇒ { values, errors[{ id, code }] } (code: REQUIRED | INVALID | TOO_MANY_FILES…).
 *   renderTitle       — "{field_id}" trong mẫu tiêu đề ⇒ câu trả lời; rỗng ⇒ "<tên form> — <người gửi/ngày>".
 *   describeAnswers   — mô tả thẻ dạng chữ: "Nhãn: giá trị" theo thứ tự trường.
 *   summarize         — tổng hợp câu trả lời (đếm lựa chọn, trung bình số, mẫu chữ gần nhất).
 */

export const FORM_FIELD_KINDS = ['text', 'longtext', 'select', 'multiselect', 'number', 'date', 'file', 'user'] as const;
export type FormFieldKind = (typeof FORM_FIELD_KINDS)[number];
export const FORM_ACCESS = ['PUBLIC', 'INTERNAL'] as const;
export type FormAccess = (typeof FORM_ACCESS)[number];
export const FORM_STATUSES = ['DRAFT', 'OPEN', 'CLOSED'] as const;
export type FormStatus = (typeof FORM_STATUSES)[number];

export const MAX_FORM_FIELDS = 30;
export const MAX_FILES_PER_FIELD = 3;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_FILES_TOTAL_BYTES = 10 * 1024 * 1024;
/** Kiểu tệp nhận từ form (ảnh, PDF, văn bản, bảng tính, zip) — không nhận HTML/SVG/thực thi. */
export const FORM_FILE_MIMES = [
  'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
] as const;

export interface FormField {
  id: string;
  kind: FormFieldKind;
  label: string;
  help: string | null;
  required: boolean;
  /** select / multiselect */
  options: string[];
  /** number */
  min: number | null;
  max: number | null;
  /** Hiện khi trường `field` (đứng TRƯỚC) có câu trả lời `equals` (multiselect: có chứa). */
  showIf: { field: string; equals: string } | null;
}

export interface FormMapping {
  typeKey: string | null;
  titleTemplate: string | null;
  labelIds: number[];
  assigneeId: number | null;
  priority: number | null;
  /** id trường tuỳ chỉnh của dự án ⇒ id trường form. */
  customFields: Record<string, string>;
}

export interface FileAnswer { name: string; type: string; size: number }
export type AnswerValue = string | number | string[] | FileAnswer[];
export interface AnswerError { id: string; code: 'REQUIRED' | 'INVALID' | 'TOO_MANY_FILES' | 'FILE_TOO_BIG' | 'FILE_TYPE' }

const ID_RE = /^[a-z][a-z0-9_]{0,31}$/;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const str = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

function slugId(label: string, taken: Set<string>): string {
  const base = label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 24) || 'field';
  let id = /^[a-z]/.test(base) ? base : `f_${base}`;
  for (let i = 2; taken.has(id); i++) id = `${base.slice(0, 20)}_${i}`;
  return id;
}

/** Chuẩn hoá danh sách trường người soạn gửi lên. Ném Error('…') với thông điệp đọc được khi cấu hình sai. */
export function normalizeFields(raw: unknown): FormField[] {
  if (!Array.isArray(raw)) throw new Error('Fields must be a list');
  if (raw.length > MAX_FORM_FIELDS) throw new Error(`A form can have at most ${MAX_FORM_FIELDS} fields`);
  const taken = new Set<string>();
  const out: FormField[] = [];
  for (const r of raw as Array<Record<string, unknown>>) {
    if (!r || typeof r !== 'object') continue;
    const kind = (FORM_FIELD_KINDS as readonly string[]).includes(r.kind as string) ? (r.kind as FormFieldKind) : null;
    if (!kind) throw new Error(`Unknown field type "${String(r.kind)}"`);
    const label = str(r.label, 200);
    if (!label) throw new Error('Every field needs a label');
    let id = typeof r.id === 'string' && ID_RE.test(r.id) && !taken.has(r.id) ? r.id : slugId(label, taken);
    if (taken.has(id)) id = slugId(`${label}_x`, taken);
    taken.add(id);
    const options = kind === 'select' || kind === 'multiselect'
      ? [...new Set((Array.isArray(r.options) ? r.options : []).map((o) => str(o, 120)).filter(Boolean))].slice(0, 50)
      : [];
    if ((kind === 'select' || kind === 'multiselect') && options.length < 1) throw new Error(`"${label}" needs at least one option`);
    const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
    let showIf: FormField['showIf'] = null;
    const si = r.showIf as { field?: unknown; equals?: unknown } | null | undefined;
    if (si && typeof si.field === 'string' && si.field) {
      const target = out.find((f) => f.id === si.field);
      if (!target) throw new Error(`"${label}": show-if must point to a field ABOVE it`);
      if (!['select', 'multiselect', 'text', 'number'].includes(target.kind)) throw new Error(`"${label}": show-if can only depend on a choice, text or number field`);
      const eq = typeof si.equals === 'number' ? String(si.equals) : str(si.equals, 120);
      if (!eq) throw new Error(`"${label}": show-if needs a value`);
      if ((target.kind === 'select' || target.kind === 'multiselect') && !target.options.includes(eq)) throw new Error(`"${label}": "${eq}" is not an option of "${target.label}"`);
      showIf = { field: target.id, equals: eq };
    }
    out.push({
      id, kind, label, help: str(r.help, 300) || null, required: r.required === true, options,
      min: kind === 'number' ? num(r.min) : null, max: kind === 'number' ? num(r.max) : null, showIf,
    });
  }
  return out;
}

/** Đọc lại cấu hình đã lưu (không ném — dữ liệu hỏng thì bỏ trường hỏng). */
export function parseFields(raw: unknown): FormField[] {
  try { return normalizeFields(raw); } catch {
    return Array.isArray(raw) ? (raw as FormField[]).filter((f) => f && typeof f.id === 'string' && (FORM_FIELD_KINDS as readonly string[]).includes(f.kind)) : [];
  }
}

export function normalizeMapping(raw: unknown): FormMapping {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const ints = (v: unknown) => (Array.isArray(v) ? [...new Set(v.filter((x): x is number => Number.isInteger(x) && (x as number) > 0))].slice(0, 20) : []);
  const cf: Record<string, string> = {};
  if (r.customFields && typeof r.customFields === 'object') {
    for (const [k, v] of Object.entries(r.customFields as Record<string, unknown>)) if (/^\d+$/.test(k) && typeof v === 'string' && ID_RE.test(v)) cf[k] = v;
  }
  const pr = Number(r.priority);
  return {
    typeKey: typeof r.typeKey === 'string' && /^[A-Z][A-Z0-9_]{0,31}$/.test(r.typeKey) ? r.typeKey : null,
    titleTemplate: str(r.titleTemplate, 200) || null,
    labelIds: ints(r.labelIds),
    assigneeId: Number.isInteger(r.assigneeId) && (r.assigneeId as number) > 0 ? (r.assigneeId as number) : null,
    priority: Number.isInteger(pr) && pr >= 1 && pr <= 5 ? pr : null,
    customFields: cf,
  };
}

function answerText(v: AnswerValue | undefined): string {
  if (v === undefined || v === null) return '';
  if (Array.isArray(v)) return v.map((x) => (typeof x === 'string' ? x : x.name)).join(', ');
  return String(v);
}

/** Trường đang hiện với bộ câu trả lời (theo thứ tự — trường phụ thuộc trường ẩn thì cũng ẩn). */
export function visibleFields(fields: FormField[], answers: Record<string, unknown>): FormField[] {
  const shown = new Set<string>();
  const out: FormField[] = [];
  for (const f of fields) {
    if (f.showIf) {
      if (!shown.has(f.showIf.field)) continue;
      const a = answers[f.showIf.field];
      const ok = Array.isArray(a) ? a.map(String).includes(f.showIf.equals) : a !== undefined && a !== null && String(a).trim() === f.showIf.equals;
      if (!ok) continue;
    }
    shown.add(f.id);
    out.push(f);
  }
  return out;
}

/**
 * Kiểm câu trả lời. `memberIds` = người chọn được cho trường "user" (form nội bộ). Trường tệp: client gửi mô tả tệp
 * ({ name, type, size }) — nội dung kiểm riêng ở service; ở đây chỉ luật số lượng/dung lượng/kiểu.
 */
export function validateAnswers(fields: FormField[], raw: unknown, memberIds: Set<number> = new Set()): { values: Record<string, AnswerValue>; errors: AnswerError[] } {
  const answers = (raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}) as Record<string, unknown>;
  const values: Record<string, AnswerValue> = {};
  const errors: AnswerError[] = [];
  let totalBytes = 0;
  for (const f of visibleFields(fields, answers)) {
    const a = answers[f.id];
    const empty = a === undefined || a === null || (typeof a === 'string' && !a.trim()) || (Array.isArray(a) && !a.length);
    if (empty) { if (f.required) errors.push({ id: f.id, code: 'REQUIRED' }); continue; }
    const bad = () => errors.push({ id: f.id, code: 'INVALID' });
    switch (f.kind) {
      case 'text': if (typeof a === 'string') values[f.id] = a.trim().slice(0, 500); else bad(); break;
      case 'longtext': if (typeof a === 'string') values[f.id] = a.trim().slice(0, 5000); else bad(); break;
      case 'select': if (typeof a === 'string' && f.options.includes(a)) values[f.id] = a; else bad(); break;
      case 'multiselect':
        if (Array.isArray(a) && a.every((x) => typeof x === 'string' && f.options.includes(x))) values[f.id] = [...new Set(a as string[])];
        else bad();
        break;
      case 'number': {
        const n = typeof a === 'number' ? a : typeof a === 'string' && a.trim() !== '' ? Number(a) : NaN;
        if (!Number.isFinite(n) || (f.min !== null && n < f.min) || (f.max !== null && n > f.max)) bad(); else values[f.id] = n;
        break;
      }
      case 'date': if (typeof a === 'string' && DAY_RE.test(a) && !Number.isNaN(Date.parse(`${a}T00:00:00Z`))) values[f.id] = a; else bad(); break;
      case 'user': {
        const n = Number(a);
        if (Number.isInteger(n) && memberIds.has(n)) values[f.id] = n; else bad();
        break;
      }
      case 'file': {
        if (!Array.isArray(a)) { bad(); break; }
        if (a.length > MAX_FILES_PER_FIELD) { errors.push({ id: f.id, code: 'TOO_MANY_FILES' }); break; }
        const files: FileAnswer[] = [];
        let err: AnswerError['code'] | null = null;
        for (const x of a as Array<Record<string, unknown>>) {
          const name = str(x?.name, 200).replace(/[\\/]/g, '_');
          const type = str(x?.type, 100).toLowerCase();
          const size = Number(x?.size);
          if (!name || !Number.isInteger(size) || size <= 0) { err = 'INVALID'; break; }
          if (!(FORM_FILE_MIMES as readonly string[]).includes(type)) { err = 'FILE_TYPE'; break; }
          if (size > MAX_FILE_BYTES) { err = 'FILE_TOO_BIG'; break; }
          totalBytes += size;
          files.push({ name, type, size });
        }
        if (!err && totalBytes > MAX_FILES_TOTAL_BYTES) err = 'FILE_TOO_BIG';
        if (err) errors.push({ id: f.id, code: err }); else values[f.id] = files;
        break;
      }
    }
  }
  return { values, errors };
}

/** Tiêu đề thẻ từ mẫu: "{id}" ⇒ câu trả lời (chữ). Không mẫu / ra rỗng ⇒ "<form> — <hậu tố>". */
export function renderTitle(template: string | null, fields: FormField[], values: Record<string, AnswerValue>, formTitle: string, suffix: string, people: Map<number, string> = new Map()): string {
  const memberName = (id: number) => people.get(id) ?? '';
  if (template) {
    const out = template.replace(/\{([a-z][a-z0-9_]{0,31})\}/g, (_, id: string) => {
      const f = fields.find((x) => x.id === id);
      if (!f) return '';
      const v = values[id];
      return f.kind === 'user' ? memberName(v as number) : answerText(v);
    }).replace(/\s+/g, ' ').trim();
    if (out.replace(/[\s\-—:|[\]()]/g, '')) return out.slice(0, 255);
  }
  // Không mẫu: lấy câu trả lời chữ ĐẦU TIÊN (thường là "Tiêu đề / Vấn đề là gì").
  const first = fields.find((f) => f.kind === 'text' && typeof values[f.id] === 'string');
  if (first) return String(values[first.id]).slice(0, 255);
  return `${formTitle} — ${suffix}`.slice(0, 255);
}

/** Mô tả thẻ dạng đoạn văn: một dòng "Nhãn: giá trị" mỗi trường đã trả lời. */
export function describeAnswers(fields: FormField[], values: Record<string, AnswerValue>, people: Map<number, string> = new Map()): string[] {
  const lines: string[] = [];
  for (const f of fields) {
    const v = values[f.id];
    if (v === undefined) continue;
    const text = f.kind === 'user' ? people.get(v as number) ?? `#${v}` : answerText(v);
    lines.push(f.kind === 'longtext' ? `${f.label}:\n${text}` : `${f.label}: ${text}`);
  }
  return lines;
}

export interface FieldSummary {
  id: string; label: string; kind: FormFieldKind; answered: number;
  counts?: Array<{ option: string; n: number }>;
  average?: number | null; min?: number | null; max?: number | null;
  earliest?: string | null; latest?: string | null;
  samples?: string[];
  files?: number;
}

/** Tổng hợp câu trả lời (mới nhất trước trong `responses`). */
export function summarize(fields: FormField[], responses: Array<{ answers: unknown }>, people: Map<number, string> = new Map()): FieldSummary[] {
  return fields.map((f) => {
    const vals = responses.map((r) => ((r.answers ?? {}) as Record<string, AnswerValue>)[f.id]).filter((v) => v !== undefined && v !== null);
    const base: FieldSummary = { id: f.id, label: f.label, kind: f.kind, answered: vals.length };
    if (f.kind === 'select' || f.kind === 'multiselect') {
      const c = new Map(f.options.map((o) => [o, 0]));
      for (const v of vals) for (const o of Array.isArray(v) ? v : [v]) if (typeof o === 'string' && c.has(o)) c.set(o, c.get(o)! + 1);
      return { ...base, counts: [...c].map(([option, n]) => ({ option, n })) };
    }
    if (f.kind === 'number') {
      const ns = vals.filter((v): v is number => typeof v === 'number');
      return { ...base, average: ns.length ? Math.round((ns.reduce((a, b) => a + b, 0) / ns.length) * 100) / 100 : null, min: ns.length ? Math.min(...ns) : null, max: ns.length ? Math.max(...ns) : null };
    }
    if (f.kind === 'date') {
      const ds = vals.filter((v): v is string => typeof v === 'string').sort();
      return { ...base, earliest: ds[0] ?? null, latest: ds[ds.length - 1] ?? null };
    }
    if (f.kind === 'user') {
      const c = new Map<string, number>();
      for (const v of vals) { const n = people.get(v as number) ?? `#${v}`; c.set(n, (c.get(n) ?? 0) + 1); }
      return { ...base, counts: [...c].sort((a, b) => b[1] - a[1]).map(([option, n]) => ({ option, n })) };
    }
    if (f.kind === 'file') return { ...base, files: vals.reduce<number>((s, v) => s + (Array.isArray(v) ? v.length : 0), 0) };
    return { ...base, samples: vals.slice(0, 20).map((v) => String(v).slice(0, 300)) };
  });
}

/** Form đóng vì sao (null = đang nhận). */
export function formClosedReason(f: { status: string; closesAt: Date | null; maxResponses: number | null }, responses: number, now = Date.now()): 'CLOSED' | 'EXPIRED' | 'FULL' | null {
  if (f.status !== 'OPEN') return 'CLOSED';
  if (f.closesAt && f.closesAt.getTime() <= now) return 'EXPIRED';
  if (f.maxResponses !== null && responses >= f.maxResponses) return 'FULL';
  return null;
}

/** Honeypot: trường ẩn `website` — người thật không thấy nên không điền; bot điền mọi ô. Gửi quá nhanh (< 2 s) cũng là bot. */
export function looksLikeBot(body: { website?: unknown; elapsedMs?: unknown }): boolean {
  if (typeof body.website === 'string' && body.website.trim()) return true;
  const ms = Number(body.elapsedMs);
  return Number.isFinite(ms) && ms >= 0 && ms < 2000;
}

/** Trần gửi theo IP cho MỖI form (đếm trong DB — sống qua khởi động lại, không phụ thuộc bộ đếm trong RAM). */
export const FORM_IP_WINDOW_MS = 10 * 60_000;
export const FORM_IP_MAX = 5;
