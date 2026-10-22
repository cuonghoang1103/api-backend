/**
 * ============================================================
 * CT WORK — GIAO THỨC TRẢ LỜI CỦA TRỢ LÝ (22/10/2026)
 * ============================================================
 *
 * VÌ SAO CÓ FILE NÀY. Trước đây model phải trả MỘT khối JSON `{"reply":"<markdown>","actions":[…]}` (hoặc
 * `{"reply":"","reads":[…]}` để xin đọc). Với câu hỏi sâu ("tôi cần hiểu 100% hàm, code, luồng, test…") Claude
 * Sonnet hay bỏ khuôn: đo thật 22/10 bằng chính prompt production —
 *   (1) viết câu trả lời Markdown THƯỜNG rồi mới thêm ```json {"reply":"above","actions":[]}``` ⇒ người dùng nhận đúng
 *       chữ "above" (5 ký tự), còn cả câu trả lời dài bị vứt;
 *   (2) viết Markdown thường có code (dấu `{`) mà KHÔNG có JSON ⇒ `parseJson` thấy `{` nên không coi là chữ thường ⇒
 *       ném 502 WORK_AI_BAD_OUTPUT "AI trả về câu trả lời không đọc được" — đúng lỗi người dùng iOS gặp; hỏi lại thì
 *       lần sau model lại viết JSON đúng nên "hỏi lại đôi khi được";
 *   (3) cả câu nằm trong một chuỗi JSON ⇒ mọi `"`/`\` trong code phải escape đúng, sai một chỗ là cụt câu.
 * Ngoài ra luồng chữ chỉ chạy được khi model viết đúng JSON: kiểu (1) thì không có mẩu `delta` nào tới khi xong.
 *
 * GIAO THỨC MỚI (một khuôn cho cả ba cổng — rambo, Anthropic chính hãng, modelapi):
 *   - Câu trả lời là Markdown THƯỜNG, viết TRƯỚC — stream thẳng ra giao diện.
 *   - Đề xuất thao tác (nếu có) nằm SAU, trong MỘT khối `<ctw-actions>[…]</ctw-actions>`. Khối cụt/hỏng ⇒ chỉ mất
 *     đề xuất hỏng (đối tượng nào còn nguyên vẫn giữ), KHÔNG BAO GIỜ mất chữ trả lời.
 *   - Xin ĐỌC dữ liệu ⇒ tool gốc của cổng (`read_command` / `read_page` / `search_pages`), không còn JSON trong chữ.
 *   - Khuôn JSON cũ vẫn đọc được (model quen tay, hàm giả trong test) — kể cả kiểu (1): chữ trước + JSON sau.
 *   - Chữ khác rỗng mà không phải khuôn nào ⇒ CHÍNH NÓ là câu trả lời. Không có đường nào ném "không đọc được" nữa.
 *
 * `TraLoiStreamer` giữ chữ THÔ của cả lượt (kể cả các đoạn nối tiếp) và tính phần HIỂN THỊ được sau mỗi mẩu: giấu khối
 * đề xuất (kể cả lúc mới tới nửa thẻ `<ctw-ac`), giấu khối JSON kiểu cũ, giữ khoảng trắng cuối tới khi có chữ theo sau
 * — để bản nháp đã phát LUÔN là phần đầu của câu chuẩn (không phải `reset`).
 */

import type { LLMMessage, LLMTool, LLMToolCall } from '../interview/llm/index.js';
import { ReplyStreamer } from './aiReplyStream.js';

export const MO_DE_XUAT = '<ctw-actions>';
export const DONG_DE_XUAT = '</ctw-actions>';

/** Tối đa số lượt "viết tiếp" khi model dừng vì chạm trần độ dài (mỗi lượt tới `ASK_LIMITS.answerTokens`). */
export const MAX_NOI_TIEP = 3;
/** Giữ lại bao nhiêu ký tự đầu của đoạn nối tiếp để tìm phần model lỡ lặp lại (rồi cắt đi) trước khi phát. */
const GIU_NOI_TIEP = 400;

// ─── Khuôn trả lời (đưa vào system prompt) ───────────────────────

/** Luật khuôn trả lời cho model. `reads` = được dùng tool đọc; `actions` = được đề xuất thao tác. */
export function khuonTraLoi(o: { reads: boolean; actions: boolean; docs?: boolean }): string {
  const dong = [
    'OUTPUT FORMAT',
    '- Write your answer for the user directly as Markdown text. Do NOT wrap it in JSON and do NOT put the whole answer in a code fence.',
  ];
  if (o.reads) dong.push(`- Need more project data first? Call the read tools (${o.docs ? 'read_command / read_page / search_pages' : 'read_command'}) BEFORE writing any answer text — several calls in one turn are fine. You get the results, then you answer. Do not write "let me check" text in that turn.`);
  if (o.actions) {
    dong.push(`- Proposed actions (only when there are any): AFTER the whole answer add ONE block and nothing after it:
${MO_DE_XUAT}
[{"type":"…", …}]
${DONG_DE_XUAT}
  The block holds a valid JSON array. No block when there is nothing to propose. Never mention the block in the answer text.`);
  }
  return dong.join('\n');
}

// ─── Tool ĐỌC (tool gốc của cổng) ────────────────────────────────

/** Tool đọc cho trợ lý dự án. `docs` = được đọc trang Docs. Mô tả ngắn: mục lục lệnh đầy đủ nằm ở system prompt. */
export function congCuDoc(o: { docs: boolean }): LLMTool[] {
  const tools: LLMTool[] = [{
    name: 'read_command',
    description: 'Run ONE read command from the "READ commands" list in the instructions (issues, files, resources, test matrices, meetings, risks, sprint, member work…) and get its result. Call it several times in one turn to read several things.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Exact read command name, e.g. read_issue' },
        args: { type: 'object', description: 'Arguments as documented for that command. "project" is filled in for you — never pass it.', additionalProperties: true },
      },
      required: ['name'],
    },
  }];
  if (o.docs) {
    tools.push(
      {
        name: 'read_page',
        description: 'Read one project document (Docs page) in full by its number (e.g. 3 for "Docs #3").',
        parameters: { type: 'object', properties: { number: { type: 'integer', description: 'Docs page number' } }, required: ['number'] },
      },
      {
        name: 'search_pages',
        description: 'Search the project documents (Docs) by words; returns matching pages and snippets.',
        parameters: { type: 'object', properties: { query: { type: 'string', description: 'Words to search for' } }, required: ['query'] },
      },
    );
  }
  return tools;
}

/** Tool call ⇒ mục đọc thô cho `parseReads` (khoan dung: tool lạ coi là tên lệnh đọc, args lệch được sửa ở đó). */
export function readsTuToolCalls(calls: LLMToolCall[] | undefined): unknown[] {
  return (calls ?? []).map((c) => {
    const i = c.input ?? {};
    if (c.name === 'read_page') return { tool: 'read_page', number: i.number };
    if (c.name === 'search_pages') return { tool: 'search_pages', query: i.query };
    if (c.name === 'read_command') return { tool: 'command', name: i.name, args: i.args ?? null };
    return { tool: 'command', name: c.name, args: i };
  });
}

// ─── Đọc câu trả lời đã xong ─────────────────────────────────────

export interface TraLoiDaDoc {
  /** Câu trả lời Markdown (đã cắt khối đề xuất / JSON kiểu cũ, đã trim). */
  reply: string;
  actions?: unknown;
  /** Chỉ có ở khuôn JSON kiểu cũ (`{"reply":"","reads":[…]}`) — khuôn mới xin đọc bằng tool. */
  reads?: unknown;
  /** `text` = khuôn mới / chữ thường; `json` = khuôn JSON kiểu cũ. */
  cheDo: 'text' | 'json';
  /** Khối đề xuất: không có · đọc trọn · cứu được một phần (cụt) · hỏng hẳn. */
  deXuat: 'none' | 'ok' | 'partial' | 'bad';
}

/** `reply` lệch kiểu (null, mảng chuỗi, object) ⇒ chuỗi — không bao giờ để `${out.reply}` thành "undefined"/"[object Object]". */
export function coerceReply(v: unknown): string {
  if (typeof v === 'string') return v;
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) return v.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join('\n');
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>;
    for (const k of ['markdown', 'text', 'content', 'answer']) if (typeof o[k] === 'string') return o[k] as string;
    return JSON.stringify(v);
  }
  return String(v);
}

const KHOA_PHONG_BI = ['reply', 'actions', 'reads'];
const laPhongBi = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v) && KHOA_PHONG_BI.some((k) => k in (v as object));
const boRao = (t: string) => t.replace(/^\s*```[a-z]*[ \t]*\n?/i, '').replace(/\n?[ \t]*```\s*$/i, '').trim();

/**
 * Các đối tượng `{…}` TRỌN VẸN ở cấp ngoài cùng của một mảng JSON (hoặc của chuỗi, nếu không có mảng) — bỏ đối tượng
 * cụt cuối. Biết chuỗi/escape nên `{`/`}` trong chuỗi không làm lệch. THUẦN.
 */
export function cacDoiTuongTron(text: string): unknown[] {
  const out: unknown[] = [];
  const startArr = text.indexOf('[');
  const startObj = text.indexOf('{');
  const capDoiTuong = startArr >= 0 && (startObj < 0 || startArr < startObj) ? 1 : 0;
  let depth = 0;
  let inStr = false;
  let esc = false;
  let batDau = -1;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === '{' || ch === '[') {
      if (ch === '{' && depth === capDoiTuong) batDau = i;
      depth++;
    } else if (ch === '}' || ch === ']') {
      depth--;
      if (ch === '}' && depth === capDoiTuong && batDau >= 0) {
        try { out.push(JSON.parse(text.slice(batDau, i + 1).replace(/[\x00-\x1F]+/g, ' '))); } catch { /* đối tượng hỏng: bỏ */ }
        batDau = -1;
      }
      if (depth < 0) break;
    }
  }
  return out;
}

/** Thân khối `<ctw-actions>` ⇒ danh sách đề xuất. */
export function docKhoiDeXuat(than: string, coDong: boolean): { actions?: unknown[]; trangThai: 'ok' | 'partial' | 'bad' } {
  const t = boRao(than);
  if (!t) return { actions: [], trangThai: coDong ? 'ok' : 'partial' };
  try {
    const v = JSON.parse(t) as unknown;
    if (Array.isArray(v)) return { actions: v, trangThai: 'ok' };
    if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>;
      if (Array.isArray(o.actions)) return { actions: o.actions, trangThai: 'ok' };
      if (typeof o.type === 'string') return { actions: [o], trangThai: 'ok' };
    }
  } catch { /* cứu từng đối tượng */ }
  const cuu = cacDoiTuongTron(t).flatMap((x) => (laPhongBi(x) && Array.isArray(x.actions) ? x.actions : [x]));
  return cuu.length ? { actions: cuu, trangThai: 'partial' } : { trangThai: 'bad' };
}

/**
 * Khối JSON kiểu cũ `{"reply":…,"actions":…,"reads":…}` — KHOAN DUNG: đọc chuẩn → vá đuôi → rút từng trường (chuỗi
 * `reply` cụt giữa chừng vẫn giữ phần đã viết; `actions`/`reads` giữ các đối tượng trọn). Không phải khối ấy ⇒ null.
 */
export function docPhongBi(text: string): { reply: string; actions?: unknown; reads?: unknown } | null {
  const body = boRao(text);
  const first = body.indexOf('{');
  if (first < 0) return null;
  const last = body.lastIndexOf('}');
  const thu = (s: string): Record<string, unknown> | null => {
    try { const v = JSON.parse(s.replace(/[\x00-\x1F]+/g, ' ')) as unknown; return laPhongBi(v) ? v : null; } catch { return null; }
  };
  let v = last > first ? thu(body.slice(first, last + 1)) : null;
  if (!v) {
    const cut = body.slice(first).replace(/,\s*$/, '');
    for (const tail of ['', '}', '"}', ']}', '"]}', '}]}', '"}]}']) { v = thu(cut + tail); if (v) break; }
  }
  if (v) return { reply: coerceReply(v.reply), actions: v.actions, reads: v.reads };

  // Rút từng trường.
  const m = /"reply"\s*:\s*"((?:[^"\\]|\\.)*)("?)/.exec(body);
  const coActions = /"actions"\s*:\s*\[/.exec(body);
  const coReads = /"reads"\s*:\s*\[/.exec(body);
  if (!m && !coActions && !coReads) return null;
  let reply = '';
  if (m) {
    let s = m[1];
    if (!m[2]) s = s.replace(/\\(u[0-9a-fA-F]{0,3})?$/, ''); // cụt giữa một escape
    try { reply = JSON.parse(`"${s}"`) as string; } catch { reply = s.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\'); }
  }
  const mang = (k: RegExpExecArray | null) => (k ? cacDoiTuongTron(body.slice(k.index + k[0].length - 1)) : undefined);
  return { reply, actions: mang(coActions), reads: mang(coReads) };
}

/** Câu trả lời mở đầu bằng khối JSON (khuôn cũ)? `{` đầu tiên, hoặc rào ```json / ``` rồi `{`. */
function moDauJson(raw: string): boolean {
  const t = raw.replace(/^\s+/, '');
  if (t.startsWith('{')) return true;
  return /^```[ \t]*(json)?[ \t]*\n\s*\{/i.test(t);
}

/** Vị trí bắt đầu khối JSON kiểu cũ đặt SAU câu trả lời Markdown (có/không rào), hoặc -1. Lấy khối CUỐI. */
function viTriPhongBiSau(s: string): number {
  const re = /(^|\n)[ \t]*(```[ \t]*(?:json)?[ \t]*\n[ \t]*)?\{\s*"(?:reply|actions|reads)"\s*:/gi;
  let p = -1;
  for (let m = re.exec(s); m; m = re.exec(s)) p = m.index + m[1].length;
  return p;
}

/** Bỏ dòng mở rào ``` bị bỏ dở ở cuối (model mở rào ngay trước khối đề xuất). */
function boRaoDangDo(s: string): string {
  const raos = s.match(/^[ \t]*```/gm)?.length ?? 0;
  if (raos % 2 === 1) return s.replace(/\n?[ \t]*```[^\n`]*\s*$/, '').trimEnd();
  return s;
}

/**
 * Phần HIỂN THỊ được của chữ thô (khuôn mới). `xong=false` (đang stream): giữ lại nửa thẻ `<ctw-ac`, dòng cuối đang
 * mở rào/`{` (có thể là khối JSON kiểu cũ), khoảng trắng cuối. `xong=true`: đúng câu trả lời chuẩn.
 */
export function phanHien(raw: string, xong: boolean): string {
  let s = raw.replace(/^\s+/, '');
  const thap = s.toLowerCase();
  const iMo = thap.indexOf(MO_DE_XUAT);
  if (iMo >= 0) s = s.slice(0, iMo);
  else if (!xong) {
    for (let k = Math.min(MO_DE_XUAT.length - 1, s.length); k >= 1; k--) {
      if (thap.endsWith(MO_DE_XUAT.slice(0, k))) { s = s.slice(0, s.length - k); break; }
    }
  }
  const p = viTriPhongBiSau(s);
  if (p >= 0) s = s.slice(0, p);
  else if (!xong) {
    // Dòng cuối có thể đang thành rào ```json hoặc `{"reply"` — giữ lại tới khi rõ.
    const nl = s.lastIndexOf('\n');
    const cuoi = s.slice(nl + 1);
    if (/^[ \t]*(`{1,3}[ \t]*[a-z]{0,4}[ \t]*|\{[\s"a-z]{0,10})$/i.test(cuoi)) s = s.slice(0, nl + 1);
    // Rào ``` / ```json vừa mở, chưa thấy dòng nội dung ⇒ cũng giữ.
    const rao = /\n[ \t]*```[ \t]*(json)?[ \t]*\n[ \t]*(\{[\s"a-z]{0,10})?$/i.exec(s);
    if (rao) s = s.slice(0, rao.index + 1);
  }
  s = s.trimEnd();
  return xong ? boRaoDangDo(s) : s;
}

/** Đọc trọn một lượt trả lời (khuôn mới, khuôn JSON cũ, hay lẫn cả hai). Không bao giờ ném. */
export function docTraLoi(raw: string): TraLoiDaDoc {
  const text = raw ?? '';
  if (moDauJson(text)) {
    const pb = docPhongBi(text);
    // Không trim: bản nháp ReplyStreamer phát đúng từng ký tự của chuỗi `reply` — câu chuẩn phải nối tiếp được nó.
    if (pb) return { reply: pb.reply, actions: pb.actions, reads: pb.reads, cheDo: 'json', deXuat: pb.actions === undefined ? 'none' : 'ok' };
  }
  const reply0 = phanHien(text, true);
  let reply = reply0;
  let actions: unknown;
  let reads: unknown;
  let deXuat: TraLoiDaDoc['deXuat'] = 'none';

  const thap = text.toLowerCase();
  const iMo = thap.indexOf(MO_DE_XUAT);
  if (iMo >= 0) {
    const sau = text.slice(iMo + MO_DE_XUAT.length);
    const iDong = sau.toLowerCase().indexOf(DONG_DE_XUAT);
    const k = docKhoiDeXuat(iDong >= 0 ? sau.slice(0, iDong) : sau, iDong >= 0);
    actions = k.actions;
    deXuat = k.trangThai;
  }
  // Khối JSON kiểu cũ đặt SAU câu trả lời (kiểu (1) ở đầu file): đề xuất lấy từ đó; `reply` của khối chỉ thắng khi
  // phần chữ đứng trước gần như trống ("Here you go:") — "above"/"xem trên" không bao giờ thay được câu trả lời thật.
  const vungTruoc = iMo >= 0 ? text.slice(0, iMo) : text;
  const p = viTriPhongBiSau(vungTruoc.replace(/^\s+/, ''));
  if (p >= 0) {
    const pb = docPhongBi(vungTruoc.replace(/^\s+/, '').slice(p));
    if (pb) {
      if (actions === undefined && pb.actions !== undefined) { actions = pb.actions; deXuat = 'ok'; }
      if (pb.reads !== undefined) reads = pb.reads;
      const r = pb.reply.trim();
      if (r && reply0.length < 40 && r.length > reply0.length) reply = r;
    }
  }
  return { reply, actions, reads, cheDo: 'text', deXuat };
}

// ─── Nối tiếp (chạm trần độ dài / cổng chết giữa chừng) ──────────

/** Độ dài phần đầu của `sau` lặp lại đúng đuôi của `truoc` (≥ 12 ký tự mới tính). THUẦN. */
export function doDaiLap(truoc: string, sau: string): number {
  const max = Math.min(GIU_NOI_TIEP, truoc.length, sau.length);
  for (let k = max; k >= 12; k--) if (truoc.endsWith(sau.slice(0, k))) return k;
  return 0;
}

/**
 * Bộ tin cho lượt "viết TIẾP": câu hỏi gốc (giữ ảnh) · phần đã viết (vai assistant) · lời dặn viết tiếp đúng chỗ dở.
 * Không dùng "prefill" (tin cuối là assistant) — model đời mới của Anthropic từ chối, cổng bán lại xử lý không đều.
 */
export function tinNoiTiep(goc: LLMMessage['content'], daViet: string): LLMMessage[] {
  const duoi = daViet.slice(-300);
  return [
    { role: 'user', content: goc },
    { role: 'assistant', content: daViet.trimEnd() || '…' },
    {
      role: 'user',
      content: `Your answer above was cut off (the user already sees it). Continue it EXACTLY from where it stops — the very next characters, even mid-sentence or mid-code-block. Do not repeat anything, do not restart, no preamble, same language and formatting. It currently ends with:\n«${duoi}»\nFinish the answer, then add the ${MO_DE_XUAT} block if the instructions ask for one and it is not written yet.`,
    },
  ];
}

// ─── Streamer ────────────────────────────────────────────────────

/**
 * Giữ chữ THÔ của một lượt trả lời (mọi đoạn: lượt đầu + các lượt nối tiếp) và phát phần HIỂN THỊ dần qua `onDelta`.
 * Bản nháp phát ra luôn được giữ là phần đầu của `phanHien(raw)`; khi không giữ được (đoạn bị quay lại vì cổng thử lại,
 * model viết lại từ đầu…) ⇒ `onReset` rồi phát lại trọn phần hiển thị.
 */
export class TraLoiStreamer {
  private raw = '';
  private daPhat = '';
  /** Mốc đầu đoạn hiện tại (để quay lại khi cổng thử lại đoạn đó). */
  private moc = 0;
  /** Chữ thô nhận được trong đoạn hiện tại (trước khi khử lặp) — để đối chiếu với `text` cổng trả. */
  private doanTho = '';
  /** Đang ở đầu một đoạn nối tiếp: gom tới GIU_NOI_TIEP ký tự rồi mới khử phần lặp và nhập vào `raw`. */
  private noiTiep: { buf: string } | null = null;
  /** Khuôn JSON kiểu cũ ⇒ phần hiển thị do ReplyStreamer rút từ chuỗi `reply`. */
  private json: ReplyStreamer | null = null;
  private cheDo: 'cho' | 'text' | 'json' = 'cho';
  private batDau = 0;
  /** Thời điểm (ms, tính từ `batDau`) mẩu chữ đầu tiên tới — số đo TTFT. */
  ttftMs: number | null = null;

  /**
   * @param giuDau Lượt có tool đọc: giữ chữ tới khi đủ ngần này ký tự hiển thị rồi mới phát. Đo 22/10 (Sonnet 5): model
   *   hay viết một đoạn "Tôi cần đọc thêm… 1. … 2. …" (~260 ký tự) RỒI mới gọi tool — phát ngay thì người dùng thấy đoạn đó
   *   hiện ra rồi biến mất (`reset`). Giữ ~1–2 giây đầu (Sonnet stream ~190 ký tự/s) đổi lấy không nháy chữ.
   */
  constructor(private readonly onDelta?: (t: string) => void, private readonly onReset?: () => void, private giuDau = 0) {
    this.batDau = Date.now();
  }

  /** Toàn bộ chữ thô đã nhận (kể cả đoạn nối tiếp đã khử lặp). */
  get tho(): string { return this.raw + (this.noiTiep?.buf ?? ''); }
  get daPhatRa(): string { return this.daPhat; }
  get doanHienTai(): string { return this.doanTho; }
  /** Đã vào khối đề xuất (chữ trả lời coi như xong). */
  get trongDeXuat(): boolean { return this.raw.toLowerCase().includes(MO_DE_XUAT); }

  push(d: string): void {
    if (!d) return;
    if (this.ttftMs === null) this.ttftMs = Date.now() - this.batDau;
    this.doanTho += d;
    if (this.noiTiep) {
      this.noiTiep.buf += d;
      if (this.noiTiep.buf.length >= GIU_NOI_TIEP) this.nhapNoiTiep();
      return;
    }
    this.raw += d;
    this.capNhat(false, d);
  }

  /** Bắt đầu một đoạn MỚI ở cùng chỗ (lượt gọi mới — nối tiếp hay lượt đầu). */
  datMoc(): void {
    this.nhapNoiTiep();
    this.moc = this.raw.length;
    this.doanTho = '';
  }

  /** Đoạn kế tiếp là đoạn "viết tiếp" — khử phần model lỡ lặp lại ở đầu. */
  batDauNoiTiep(): void {
    this.datMoc();
    this.noiTiep = { buf: '' };
  }

  /** Cổng bỏ đoạn hiện tại (thử lại / đổi cổng làm lại từ đầu đoạn) ⇒ quay về mốc đầu đoạn. */
  quayVeMoc(): void {
    if (this.noiTiep) this.noiTiep.buf = '';
    this.doanTho = '';
    if (this.raw.length === this.moc) return;
    this.raw = this.raw.slice(0, this.moc);
    this.lamLaiJson();
    this.capNhat(false);
  }

  /** Bỏ trắng cả lượt (lượt hoá ra là lượt xin đọc) — báo client xoá nháp nếu đã phát. */
  boHet(): void {
    if (this.daPhat) this.onReset?.();
    this.raw = ''; this.daPhat = ''; this.moc = 0; this.doanTho = ''; this.noiTiep = null; this.json = null; this.cheDo = 'cho';
  }

  /**
   * Chốt đoạn hiện tại theo `text` cổng trả (bản CHUẨN của đoạn): cổng không stream ⇒ bù cả đoạn; stream thiếu đuôi ⇒
   * bù đuôi; chữ đã stream lệch bản chuẩn (cổng thử lại mà không báo) ⇒ thay cả đoạn (client nhận `reset` nếu cần).
   */
  chotDoan(text: string): void {
    if (!text) return;
    const da = this.doanTho;
    if (text === da) return;
    if (text.startsWith(da)) { this.push(text.slice(da.length)); return; }
    this.quayVeMoc();
    this.push(text);
  }

  /** Kết thúc lượt: nhập đoạn nối tiếp còn giữ, phát nốt phần hiển thị chuẩn. */
  ketThuc(): void {
    this.nhapNoiTiep();
    this.capNhat(true);
  }

  private nhapNoiTiep(): void {
    if (!this.noiTiep) return;
    const buf = this.noiTiep.buf;
    this.noiTiep = null;
    if (!buf) return;
    const truoc = this.raw.replace(/^\s+/, '');
    const sau = buf.replace(/^\s+/, '');
    if (truoc.length >= 60 && sau.startsWith(truoc.slice(0, 60))) {
      // Model viết lại từ đầu thay vì viết tiếp ⇒ lấy bản mới (client xoá nháp, nhận lại từ đầu).
      this.raw = buf;
      this.lamLaiJson();
      this.capNhat(false);
      return;
    }
    const k = doDaiLap(this.raw, buf);
    const them = buf.slice(k);
    this.raw += them;
    this.capNhat(false, them);
  }

  private lamLaiJson(): void {
    this.cheDo = 'cho';
    this.json = null;
  }

  private quyetCheDo(): void {
    if (this.cheDo !== 'cho') return;
    const t = this.raw.replace(/^\s+/, '');
    if (!t) return;
    if (t[0] === '{') { this.cheDo = 'json'; }
    else if (t[0] === '`') {
      const m = /^```[ \t]*([a-z]*)[ \t]*\n(\s*)(\S)?/i.exec(t);
      if (!m) { if (t.length < 16 && !t.includes('\n')) return; this.cheDo = 'text'; }
      else if (!m[3]) return; // chưa thấy ký tự đầu của nội dung rào
      else this.cheDo = m[3] === '{' && (!m[1] || m[1].toLowerCase() === 'json') ? 'json' : 'text';
    } else this.cheDo = 'text';
    if (this.cheDo === 'json') {
      this.json = new ReplyStreamer();
      this.json.push(this.raw);
    }
  }

  /** Tính lại phần hiển thị và phát chênh lệch (hoặc reset + trọn phần hiển thị). */
  private capNhat(xong: boolean, moi?: string): void {
    const cheDoTruoc = this.cheDo;
    this.quyetCheDo();
    let hien: string;
    if (this.cheDo === 'json') {
      if (moi && cheDoTruoc === 'json' && this.json) this.json.push(moi);
      else if (!this.json) { this.json = new ReplyStreamer(); this.json.push(this.raw); }
      hien = xong ? docTraLoi(this.raw).reply : this.json.emitted;
    } else if (this.cheDo === 'text') {
      hien = phanHien(this.raw, xong);
    } else {
      hien = xong ? docTraLoi(this.raw).reply : '';
    }
    if (!xong && this.giuDau > 0) {
      if (hien.length < this.giuDau) return;
      this.giuDau = 0;
    }
    if (!this.onDelta) { this.daPhat = hien; return; }
    if (hien.startsWith(this.daPhat)) {
      const them = hien.slice(this.daPhat.length);
      if (them) { this.daPhat = hien; this.onDelta(them); }
      return;
    }
    // Lệch: bản nháp không còn là phần đầu của bản hiển thị ⇒ xoá nháp, gửi lại trọn.
    if (this.daPhat) this.onReset?.();
    this.daPhat = hien;
    if (hien) this.onDelta(hien);
  }
}
