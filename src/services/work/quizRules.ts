/**
 * CT Work đợt 9c — QUIZ TRẮC NGHIỆM TỰ CHẤM: phần THUẦN (không DB, không mạng) để test bằng `tsx --test`.
 *
 *   - Kiểu câu: SINGLE (một đáp án), MULTI (nhiều đáp án, chấm từng phần tuỳ chọn), TRUE_FALSE, SHORT (điền ngắn — nhiều
 *     đáp án chấp nhận, tuỳ chọn phân biệt hoa thường / dấu), MATCH (ghép cặp, chấm theo từng cặp).
 *   - Kiểm hợp lệ câu hỏi (`validateQuestion`), rút đề có SEED (`buildPaper`: rút N câu ngẫu nhiên theo chủ đề, trộn câu,
 *     trộn đáp án — cùng seed ⇒ cùng đề), chấm (`gradeItem` / `gradePaper`), gộp điểm nhiều lần làm (`aggregateScore`).
 *   - ĐÁP ÁN KHÔNG BAO GIỜ XUỐNG TRÌNH DUYỆT SV khi chưa được phép: mọi thứ gửi cho SV đi qua `studentPaper()` — chỉ giữ
 *     nội dung đề, id HIỂN THỊ mờ (o0, o1… / L0…, R0…) do lượt làm cấp. id gốc của phương án (thứ tự giảng viên soạn) và
 *     ánh xạ ghép cặp chỉ nằm trong bản chụp đề ở máy chủ.
 *   - Thống kê kiểu Classical Test Theory: độ khó p, độ phân biệt D (nhóm 27% trên − 27% dưới), phương án nhiễu bị chọn.
 *   - Nhập câu hỏi: bảng (CSV/xlsx theo mẫu), Aiken, GIFT (tập con thông dụng) — trả lỗi theo từng dòng/khối để xem trước.
 */

export const QUESTION_TYPES = ['SINGLE', 'MULTI', 'TRUE_FALSE', 'SHORT', 'MATCH'] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];
export const SHOW_ANSWERS = ['IMMEDIATE', 'AFTER_DUE', 'NEVER'] as const;
export type ShowAnswers = (typeof SHOW_ANSWERS)[number];
export const SCORING = ['HIGHEST', 'LAST', 'AVERAGE'] as const;
export type Scoring = (typeof SCORING)[number];
export const LAYOUTS = ['ALL', 'ONE_PER_PAGE'] as const;
export type QuizLayout = (typeof LAYOUTS)[number];

export const LIMITS = {
  prompt: 4000, option: 500, options: 10, pairs: 10, accepted: 20, explanation: 4000, topic: 60,
  maxPoints: 100, questionsPerQuiz: 200, bankPerClass: 3000, importRows: 500,
} as const;

export interface QOption { id: string; text: string }
export interface QPair { id: string; left: string; right: string }
export interface QAnswer {
  /** SINGLE: đúng 1 id; MULTI: ≥ 1 id. */
  correct?: string[];
  /** TRUE_FALSE. */
  value?: boolean;
  /** SHORT: các đáp án chấp nhận. */
  accepted?: string[];
}
export interface QSettings {
  /** MULTI / MATCH: chấm từng phần. MULTI mặc định TẮT (đúng hết mới có điểm), MATCH mặc định BẬT. */
  partial?: boolean;
  /** SHORT: phân biệt hoa thường (mặc định không). */
  caseSensitive?: boolean;
  /** SHORT: phân biệt dấu tiếng Việt (mặc định không — "Ha Noi" = "Hà Nội"). */
  accentSensitive?: boolean;
}
export interface QuestionData {
  type: QuestionType;
  topic: string;
  prompt: string;
  imageUrl: string | null;
  points: number;
  explanation: string | null;
  /** SINGLE/MULTI: QOption[]; MATCH: QPair[]; khác: []. */
  options: QOption[] | QPair[];
  answer: QAnswer;
  settings: QSettings;
}

// ─── Kiểm hợp lệ ─────────────────────────────────────────────────

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/\r\n?/g, '\n').trim().slice(0, max) : '');

/** Đầu vào thô (từ API / nhập tệp / AI) ⇒ câu hỏi chuẩn + danh sách lỗi (rỗng = hợp lệ). id phương án tự cấp nếu thiếu. */
export function validateQuestion(raw: unknown): { q: QuestionData; errors: string[] } {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, any>;
  const errors: string[] = [];
  const type = String(r.type ?? '').toUpperCase() as QuestionType;
  if (!QUESTION_TYPES.includes(type)) errors.push('Unknown question type');
  const prompt = str(r.prompt, LIMITS.prompt);
  if (!prompt) errors.push('The question text is empty');
  const pts = Number(r.points ?? 1);
  const points = Number.isFinite(pts) ? Math.round(pts * 100) / 100 : NaN;
  if (!(points > 0 && points <= LIMITS.maxPoints)) errors.push(`Points must be between 0.01 and ${LIMITS.maxPoints}`);
  const imageUrl = typeof r.imageUrl === 'string' && /^https?:\/\/\S+$/i.test(r.imageUrl.trim()) ? r.imageUrl.trim().slice(0, 500) : null;
  if (r.imageUrl && typeof r.imageUrl === 'string' && r.imageUrl.trim() && !imageUrl) errors.push('The image must be an http(s) link');
  const s = (r.settings && typeof r.settings === 'object' ? r.settings : {}) as Record<string, unknown>;
  const a = (r.answer && typeof r.answer === 'object' ? r.answer : {}) as Record<string, unknown>;
  const q: QuestionData = {
    type: QUESTION_TYPES.includes(type) ? type : 'SINGLE',
    topic: str(r.topic, LIMITS.topic) || 'General',
    prompt, imageUrl, points: Number.isFinite(points) ? points : 1,
    explanation: str(r.explanation, LIMITS.explanation) || null,
    options: [], answer: {}, settings: {},
  };
  if (type === 'SINGLE' || type === 'MULTI') {
    const raws = Array.isArray(r.options) ? r.options : [];
    const seen = new Set<string>();
    const opts: QOption[] = [];
    raws.slice(0, LIMITS.options + 1).forEach((o: any, i: number) => {
      const text = str(typeof o === 'string' ? o : o?.text, LIMITS.option);
      let id = typeof o === 'object' && o && typeof o.id === 'string' && /^[\w-]{1,24}$/.test(o.id) ? o.id : `o${i + 1}`;
      while (seen.has(id)) id = `${id}_`;
      seen.add(id);
      opts.push({ id, text });
    });
    if (raws.length > LIMITS.options) errors.push(`At most ${LIMITS.options} options`);
    if (opts.length < 2) errors.push('Add at least two options');
    if (opts.some((o) => !o.text)) errors.push('An option is empty');
    const texts = opts.map((o) => o.text.toLowerCase());
    if (new Set(texts).size !== texts.length) errors.push('Two options have the same text');
    const correct = (Array.isArray(a.correct) ? a.correct : []).map(String).filter((id, i, arr) => arr.indexOf(id) === i);
    const valid = correct.filter((id) => opts.some((o) => o.id === id));
    if (valid.length !== correct.length) errors.push('The answer points to an option that does not exist');
    if (type === 'SINGLE' && valid.length !== 1) errors.push('Mark exactly one correct option');
    if (type === 'MULTI' && valid.length < 1) errors.push('Mark at least one correct option');
    q.options = opts.slice(0, LIMITS.options);
    q.answer = { correct: valid };
    if (type === 'MULTI') q.settings = { partial: s.partial === true };
  } else if (type === 'TRUE_FALSE') {
    if (typeof a.value !== 'boolean') errors.push('Choose whether the statement is true or false');
    q.answer = { value: a.value === true };
  } else if (type === 'SHORT') {
    const acc = (Array.isArray(a.accepted) ? a.accepted : []).map((x) => str(x, LIMITS.option)).filter(Boolean);
    const uniq = [...new Set(acc)];
    if (!uniq.length) errors.push('Add at least one accepted answer');
    if (uniq.length > LIMITS.accepted) errors.push(`At most ${LIMITS.accepted} accepted answers`);
    q.answer = { accepted: uniq.slice(0, LIMITS.accepted) };
    q.settings = { caseSensitive: s.caseSensitive === true, accentSensitive: s.accentSensitive === true };
  } else if (type === 'MATCH') {
    const raws = Array.isArray(r.options) ? r.options : [];
    const seen = new Set<string>();
    const pairs: QPair[] = [];
    raws.slice(0, LIMITS.pairs + 1).forEach((p: any, i: number) => {
      let id = p && typeof p.id === 'string' && /^[\w-]{1,24}$/.test(p.id) ? p.id : `p${i + 1}`;
      while (seen.has(id)) id = `${id}_`;
      seen.add(id);
      pairs.push({ id, left: str(p?.left, LIMITS.option), right: str(p?.right, LIMITS.option) });
    });
    if (raws.length > LIMITS.pairs) errors.push(`At most ${LIMITS.pairs} pairs`);
    if (pairs.length < 2) errors.push('Add at least two pairs');
    if (pairs.some((p) => !p.left || !p.right)) errors.push('A pair is missing a side');
    const lefts = pairs.map((p) => p.left.toLowerCase());
    const rights = pairs.map((p) => p.right.toLowerCase());
    if (new Set(lefts).size !== lefts.length || new Set(rights).size !== rights.length) errors.push('Two pairs share the same text');
    q.options = pairs.slice(0, LIMITS.pairs);
    q.settings = { partial: s.partial !== false };
  }
  return { q, errors };
}

// ─── Chuẩn hoá điền ngắn ─────────────────────────────────────────

export function normalizeShort(text: string, opts: { caseSensitive?: boolean; accentSensitive?: boolean } = {}): string {
  let t = String(text ?? '').normalize('NFC').trim().replace(/\s+/g, ' ').replace(/[.!?。]+$/u, '').trim();
  if (!opts.accentSensitive) t = t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').normalize('NFC');
  if (!opts.caseSensitive) t = t.toLowerCase();
  return t;
}

// ─── PRNG có seed + trộn ─────────────────────────────────────────

/** mulberry32 — nhanh, đủ đều cho việc trộn đề; cùng seed ⇒ cùng dãy. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffled<T>(arr: readonly T[], rand: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ─── Đề của một lượt làm (bản chụp ở máy chủ) ───────────────────

export interface BankQuestion extends QuestionData { id: number }
/** Mục trong quiz: câu cố định, hoặc rút ngẫu nhiên N câu từ một chủ đề của ngân hàng. */
export type QuizItem =
  | { kind: 'Q'; questionId: number; points?: number | null }
  | { kind: 'DRAW'; topic: string; count: number; points?: number | null };

export interface PaperItem {
  /** Khoá hiển thị trong lượt làm (q1, q2…) — SV gửi câu trả lời theo khoá này. */
  key: string;
  questionId: number;
  type: QuestionType;
  topic: string;
  prompt: string;
  imageUrl: string | null;
  points: number;
  explanation: string | null;
  /** SINGLE/MULTI: id hiển thị → id gốc. */
  options?: Array<{ id: string; text: string; src: string }>;
  /** MATCH: vế trái (L…) / vế phải (R…), `src` = id cặp gốc. */
  left?: Array<{ id: string; text: string; src: string }>;
  right?: Array<{ id: string; text: string; src: string }>;
  answer: QAnswer;
  settings: QSettings;
}

export interface PaperConfig { shuffleQuestions: boolean; shuffleOptions: boolean }

/**
 * Dựng đề theo seed. Mục DRAW rút từ câu cùng chủ đề CHƯA được chọn cố định (không trùng câu trong một đề).
 * Trả `missing` > 0 khi ngân hàng không đủ câu cho một mục rút.
 */
export function buildPaper(items: readonly QuizItem[], bank: readonly BankQuestion[], cfg: PaperConfig, seed: number): { paper: PaperItem[]; missing: number } {
  const rand = seededRandom(seed);
  const byId = new Map(bank.map((q) => [q.id, q]));
  const used = new Set<number>();
  const picked: Array<{ q: BankQuestion; points: number }> = [];
  let missing = 0;
  for (const it of items) if (it.kind === 'Q') used.add(it.questionId);
  for (const it of items) {
    if (it.kind === 'Q') {
      const q = byId.get(it.questionId);
      if (!q) { missing += 1; continue; }
      picked.push({ q, points: it.points && it.points > 0 ? it.points : q.points });
    } else {
      const pool = bank.filter((q) => !used.has(q.id) && q.topic.toLowerCase() === it.topic.toLowerCase()).sort((a, b) => a.id - b.id);
      const take = shuffled(pool, rand).slice(0, Math.max(0, it.count));
      missing += Math.max(0, it.count - take.length);
      for (const q of take) { used.add(q.id); picked.push({ q, points: it.points && it.points > 0 ? it.points : q.points }); }
    }
  }
  const ordered = cfg.shuffleQuestions ? shuffled(picked, rand) : picked;
  const paper = ordered.map(({ q, points }, i): PaperItem => {
    const base: PaperItem = {
      key: `q${i + 1}`, questionId: q.id, type: q.type, topic: q.topic, prompt: q.prompt, imageUrl: q.imageUrl, points,
      explanation: q.explanation, answer: q.answer, settings: q.settings,
    };
    if (q.type === 'SINGLE' || q.type === 'MULTI') {
      const opts = q.options as QOption[];
      const order = cfg.shuffleOptions ? shuffled(opts, rand) : opts.slice();
      base.options = order.map((o, j) => ({ id: `o${j}`, text: o.text, src: o.id }));
    } else if (q.type === 'MATCH') {
      const pairs = q.options as QPair[];
      // Vế trái giữ thứ tự soạn (trừ khi trộn đáp án); vế phải LUÔN trộn — không thì vị trí lộ đáp án.
      const left = cfg.shuffleOptions ? shuffled(pairs, rand) : pairs.slice();
      let right = shuffled(pairs, rand);
      // Trộn ra đúng thứ tự trái (hiếm, với 2 cặp là 50%) ⇒ xoay một nấc để không "đáp án nằm thẳng hàng".
      if (right.length > 1 && right.every((p, j) => p.id === left[j].id)) right = [...right.slice(1), right[0]];
      base.left = left.map((p, j) => ({ id: `L${j}`, text: p.left, src: p.id }));
      base.right = right.map((p, j) => ({ id: `R${j}`, text: p.right, src: p.id }));
    }
    return base;
  });
  return { paper, missing };
}

/** Bản đề GỬI CHO SINH VIÊN khi đang làm: không đáp án, không giải thích, không id gốc, không cài đặt chấm. */
export function studentPaper(paper: readonly PaperItem[]) {
  return paper.map((p) => ({
    key: p.key, type: p.type, prompt: p.prompt, imageUrl: p.imageUrl, points: p.points,
    ...(p.options ? { options: p.options.map((o) => ({ id: o.id, text: o.text })) } : {}),
    ...(p.left ? { left: p.left.map((o) => ({ id: o.id, text: o.text })) } : {}),
    ...(p.right ? { right: p.right.map((o) => ({ id: o.id, text: o.text })) } : {}),
  }));
}
export type StudentPaperItem = ReturnType<typeof studentPaper>[number];

/** Đáp án đúng nói bằng id HIỂN THỊ của lượt làm — chỉ gửi khi đã được phép xem. */
export function displayAnswer(p: PaperItem): { correct?: string[]; value?: boolean; accepted?: string[]; pairs?: Record<string, string> } {
  if (p.type === 'SINGLE' || p.type === 'MULTI') {
    const set = new Set(p.answer.correct ?? []);
    return { correct: (p.options ?? []).filter((o) => set.has(o.src)).map((o) => o.id) };
  }
  if (p.type === 'TRUE_FALSE') return { value: p.answer.value === true };
  if (p.type === 'SHORT') return { accepted: p.answer.accepted ?? [] };
  const pairs: Record<string, string> = {};
  for (const l of p.left ?? []) { const r = (p.right ?? []).find((x) => x.src === l.src); if (r) pairs[l.id] = r.id; }
  return { pairs };
}

// ─── Câu trả lời + chấm ─────────────────────────────────────────

export type Response =
  | { choice?: string | null; choices?: string[]; value?: boolean | null; text?: string | null; pairs?: Record<string, string> }
  | null
  | undefined;

/** Làm sạch câu trả lời SV gửi lên theo đúng kiểu câu; rác ⇒ null (coi như bỏ trống). */
export function cleanResponse(p: PaperItem, raw: unknown): Response {
  if (raw === null || raw === undefined || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (p.type === 'SINGLE') {
    const c = typeof r.choice === 'string' && (p.options ?? []).some((o) => o.id === r.choice) ? r.choice : null;
    return c ? { choice: c } : null;
  }
  if (p.type === 'MULTI') {
    const ids = Array.isArray(r.choices) ? [...new Set(r.choices.filter((x): x is string => typeof x === 'string'))] : [];
    const ok = ids.filter((id) => (p.options ?? []).some((o) => o.id === id));
    return ok.length ? { choices: ok } : null;
  }
  if (p.type === 'TRUE_FALSE') return typeof r.value === 'boolean' ? { value: r.value } : null;
  if (p.type === 'SHORT') {
    const t = typeof r.text === 'string' ? r.text.slice(0, LIMITS.option) : '';
    return t.trim() ? { text: t } : null;
  }
  if (p.type === 'MATCH') {
    const src = r.pairs && typeof r.pairs === 'object' ? (r.pairs as Record<string, unknown>) : {};
    const out: Record<string, string> = {};
    for (const l of p.left ?? []) {
      const v = src[l.id];
      if (typeof v === 'string' && (p.right ?? []).some((x) => x.id === v)) out[l.id] = v;
    }
    return Object.keys(out).length ? { pairs: out } : null;
  }
  return null;
}

export interface ItemResult { earned: number; max: number; correct: boolean; partial: boolean; answered: boolean }
const round2 = (n: number) => Math.round(n * 100) / 100;

export function gradeItem(p: PaperItem, resp: Response): ItemResult {
  const max = p.points;
  const none: ItemResult = { earned: 0, max, correct: false, partial: false, answered: false };
  if (!resp) return none;
  const done = (fraction: number): ItemResult => {
    const f = Math.min(1, Math.max(0, fraction));
    return { earned: round2(max * f), max, correct: f >= 1, partial: f > 0 && f < 1, answered: true };
  };
  if (p.type === 'SINGLE') {
    const src = (p.options ?? []).find((o) => o.id === resp.choice)?.src;
    return done(src !== undefined && (p.answer.correct ?? []).includes(src) ? 1 : 0);
  }
  if (p.type === 'MULTI') {
    const correct = new Set(p.answer.correct ?? []);
    const chosen = new Set((resp.choices ?? []).map((id) => (p.options ?? []).find((o) => o.id === id)?.src).filter((x): x is string => !!x));
    if (!chosen.size) return none;
    const right = [...chosen].filter((s) => correct.has(s)).length;
    const wrong = chosen.size - right;
    if (right === correct.size && wrong === 0) return done(1);
    if (!p.settings.partial) return done(0);
    // Từng phần: mỗi đáp án đúng chọn được +1/k, mỗi đáp án sai chọn −1/k (k = số đáp án đúng), không âm.
    return done((right - wrong) / Math.max(1, correct.size));
  }
  if (p.type === 'TRUE_FALSE') return typeof resp.value === 'boolean' ? done(resp.value === p.answer.value ? 1 : 0) : none;
  if (p.type === 'SHORT') {
    if (!resp.text?.trim()) return none;
    const mine = normalizeShort(resp.text, p.settings);
    return done((p.answer.accepted ?? []).some((a) => normalizeShort(a, p.settings) === mine) ? 1 : 0);
  }
  // MATCH
  const total = (p.left ?? []).length;
  const pairs = resp.pairs ?? {};
  if (!Object.keys(pairs).length || !total) return none;
  let hit = 0;
  for (const l of p.left ?? []) {
    const r = (p.right ?? []).find((x) => x.id === pairs[l.id]);
    if (r && r.src === l.src) hit += 1;
  }
  if (hit === total) return done(1);
  return done(p.settings.partial === false ? 0 : hit / total);
}

export interface PaperResult { score: number; max: number; items: Record<string, ItemResult & { manual?: number | null }> }

/** Chấm cả đề; `manual[key]` (giảng viên chỉnh tay) THẮNG điểm tự chấm của câu đó. */
export function gradePaper(paper: readonly PaperItem[], responses: Record<string, Response>, manual: Record<string, number> = {}): PaperResult {
  const items: PaperResult['items'] = {};
  let score = 0, max = 0;
  for (const p of paper) {
    const auto = gradeItem(p, responses[p.key]);
    const m = typeof manual[p.key] === 'number' ? Math.min(p.points, Math.max(0, manual[p.key])) : null;
    const earned = m ?? auto.earned;
    items[p.key] = { ...auto, earned, correct: m === null ? auto.correct : m >= p.points, partial: m === null ? auto.partial : m > 0 && m < p.points, manual: m };
    score += earned;
    max += p.points;
  }
  return { score: round2(score), max: round2(max), items };
}

/** Điểm tính vào sổ điểm từ các lượt ĐÃ NỘP (theo thứ tự lượt). */
export function aggregateScore(attempts: ReadonlyArray<{ score: number; max: number }>, policy: Scoring): { score: number; max: number } | null {
  if (!attempts.length) return null;
  const max = attempts[attempts.length - 1].max;
  // Đề rút ngẫu nhiên có thể khác tổng điểm giữa các lượt ⇒ quy về thang của lượt cuối theo tỉ lệ.
  const pct = attempts.map((a) => (a.max > 0 ? a.score / a.max : 0));
  let p: number;
  if (policy === 'LAST') p = pct[pct.length - 1];
  else if (policy === 'AVERAGE') p = pct.reduce((s, x) => s + x, 0) / pct.length;
  else p = Math.max(...pct);
  return { score: round2(p * max), max };
}

/** Được xem đáp án + giải thích của một lượt ĐÃ NỘP chưa. */
export function answersVisible(policy: ShowAnswers, closeAt: Date | null, submitted: boolean, now: Date): boolean {
  if (!submitted) return false;
  if (policy === 'IMMEDIATE') return true;
  if (policy === 'AFTER_DUE') return !closeAt || now.getTime() >= closeAt.getTime();
  return false;
}

/** Hạn của một lượt: sớm hơn giữa (bắt đầu + thời gian làm) và giờ đóng quiz. null = không giới hạn. */
export function attemptDeadline(startedAt: Date, timeLimitMin: number | null, closeAt: Date | null): Date | null {
  const byLimit = timeLimitMin && timeLimitMin > 0 ? new Date(startedAt.getTime() + timeLimitMin * 60_000) : null;
  if (byLimit && closeAt) return byLimit < closeAt ? byLimit : closeAt;
  return byLimit ?? closeAt ?? null;
}

// ─── Thống kê ───────────────────────────────────────────────────

export interface StatAttempt { userId: number; score: number; max: number; paper: PaperItem[]; responses: Record<string, Response>; items: PaperResult['items'] }

export interface QuestionStat {
  questionId: number; prompt: string; type: QuestionType; n: number;
  /** Độ khó p = điểm TB / điểm tối đa (0 = không ai làm được, 1 = ai cũng đúng). */
  difficulty: number | null;
  /** Độ phân biệt D = p(27% trên) − p(27% dưới). < 0,2 ⇒ nên xem lại câu. null khi < 4 bài. */
  discrimination: number | null;
  /** SINGLE/MULTI: số lần mỗi phương án (theo id gốc) được chọn; TRUE_FALSE: 'true'/'false'. */
  choices: Array<{ src: string; text: string; count: number; correct: boolean }>;
  /** Phương án SAI bị chọn nhiều nhất (≥ 25% số bài làm câu này) — "đáp án nhiễu" hút người làm. */
  topDistractor: { text: string; share: number } | null;
  blank: number;
}

export function quizStats(attempts: readonly StatAttempt[]) {
  const pcts = attempts.map((a) => (a.max > 0 ? a.score / a.max : 0));
  const n = attempts.length;
  const mean = n ? pcts.reduce((s, x) => s + x, 0) / n : null;
  const sorted = pcts.slice().sort((a, b) => a - b);
  const median = n ? (n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2) : null;
  const sd = n > 1 && mean !== null ? Math.sqrt(pcts.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1)) : null;
  const bins = Array.from({ length: 10 }, (_, i) => ({ from: i * 10, to: i * 10 + 10, count: 0 }));
  for (const p of pcts) bins[Math.min(9, Math.floor(p * 10))].count += 1;

  // Nhóm trên / dưới theo tổng điểm.
  const order = attempts.map((a, i) => ({ i, p: pcts[i] })).sort((a, b) => b.p - a.p);
  const k = n >= 4 ? Math.max(1, Math.round(n * 0.27)) : 0;
  const upper = new Set(order.slice(0, k).map((x) => x.i));
  const lower = new Set(order.slice(n - k).map((x) => x.i));

  const byQ = new Map<number, { item: PaperItem; rows: Array<{ i: number; frac: number; resp: Response }> }>();
  attempts.forEach((a, i) => {
    for (const p of a.paper) {
      const r = a.items[p.key];
      const entry = byQ.get(p.questionId) ?? { item: p, rows: [] };
      entry.rows.push({ i, frac: r && r.max > 0 ? r.earned / r.max : 0, resp: a.responses[p.key] ?? null });
      byQ.set(p.questionId, entry);
    }
  });

  const questions: QuestionStat[] = [...byQ.values()].map(({ item, rows }) => {
    const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null);
    const up = avg(rows.filter((r) => upper.has(r.i)).map((r) => r.frac));
    const lo = avg(rows.filter((r) => lower.has(r.i)).map((r) => r.frac));
    const choices: QuestionStat['choices'] = [];
    if (item.type === 'SINGLE' || item.type === 'MULTI') {
      const correct = new Set(item.answer.correct ?? []);
      const count = new Map<string, number>();
      for (const r of rows) {
        // Mỗi lượt có id hiển thị riêng ⇒ quy về id gốc qua bản chụp của CHÍNH lượt đó.
        const paperItem = attempts[r.i].paper.find((p) => p.questionId === item.questionId);
        const ids = r.resp?.choices ?? (r.resp?.choice ? [r.resp.choice] : []);
        for (const id of ids) {
          const src = paperItem?.options?.find((o) => o.id === id)?.src;
          if (src) count.set(src, (count.get(src) ?? 0) + 1);
        }
      }
      for (const o of item.options ?? []) choices.push({ src: o.src, text: o.text, count: count.get(o.src) ?? 0, correct: correct.has(o.src) });
      choices.sort((a, b) => a.src.localeCompare(b.src, undefined, { numeric: true }));
    } else if (item.type === 'TRUE_FALSE') {
      const t = rows.filter((r) => r.resp?.value === true).length;
      const f = rows.filter((r) => r.resp?.value === false).length;
      choices.push({ src: 'true', text: 'True', count: t, correct: item.answer.value === true }, { src: 'false', text: 'False', count: f, correct: item.answer.value === false });
    }
    const wrong = choices.filter((c) => !c.correct).sort((a, b) => b.count - a.count)[0];
    const share = wrong && rows.length ? wrong.count / rows.length : 0;
    return {
      questionId: item.questionId, prompt: item.prompt, type: item.type, n: rows.length,
      difficulty: avg(rows.map((r) => r.frac)) === null ? null : round3(avg(rows.map((r) => r.frac))!),
      discrimination: k && up !== null && lo !== null ? round3(up - lo) : null,
      choices,
      topDistractor: wrong && wrong.count > 0 && share >= 0.25 ? { text: wrong.text, share: round3(share) } : null,
      blank: rows.filter((r) => !r.resp).length,
    };
  });
  return {
    attempts: n,
    mean: mean === null ? null : round3(mean), median: median === null ? null : round3(median), sd: sd === null ? null : round3(sd),
    bins, questions,
  };
}
const round3 = (x: number) => Math.round(x * 1000) / 1000;

// ─── Nhập câu hỏi ───────────────────────────────────────────────

export interface ImportRow { line: number; question: QuestionData | null; errors: string[]; source: string }

const LETTERS = 'ABCDEFGHIJ';
const TYPE_ALIASES: Record<string, QuestionType> = {
  single: 'SINGLE', mc: 'SINGLE', 'one': 'SINGLE', 'mot': 'SINGLE', 'một': 'SINGLE', 'single choice': 'SINGLE',
  multi: 'MULTI', multiple: 'MULTI', 'nhieu': 'MULTI', 'nhiều': 'MULTI', 'multiple choice': 'MULTI', ma: 'MULTI',
  tf: 'TRUE_FALSE', true_false: 'TRUE_FALSE', 'true/false': 'TRUE_FALSE', 'dung/sai': 'TRUE_FALSE', 'đúng/sai': 'TRUE_FALSE', truefalse: 'TRUE_FALSE',
  short: 'SHORT', 'short answer': 'SHORT', 'dien': 'SHORT', 'điền': 'SHORT', 'điền ngắn': 'SHORT', fill: 'SHORT',
  match: 'MATCH', matching: 'MATCH', 'ghep': 'MATCH', 'ghép': 'MATCH', 'ghép cặp': 'MATCH',
};
const TRUE_WORDS = ['true', 't', 'đúng', 'dung', 'yes', 'y', '1', 'đ'];
const FALSE_WORDS = ['false', 'f', 'sai', 'no', 'n', '0', 's'];

/** Cột mẫu (khớp không phân biệt hoa thường/dấu). */
export const TEMPLATE_HEADERS = ['Type', 'Topic', 'Question', 'A', 'B', 'C', 'D', 'E', 'F', 'Answer', 'Points', 'Explanation', 'Image URL'] as const;
const headerKey = (h: string) => normalizeShort(h, {}).replace(/[^a-z0-9]/g, '');
const HEADER_MAP: Record<string, string> = {
  type: 'type', loai: 'type', loaicau: 'type', topic: 'topic', chude: 'topic', question: 'question', cauhoi: 'question', noidung: 'question',
  a: 'A', b: 'B', c: 'C', d: 'D', e: 'E', f: 'F', optiona: 'A', optionb: 'B', optionc: 'C', optiond: 'D', optione: 'E', optionf: 'F',
  answer: 'answer', dapan: 'answer', correct: 'answer', points: 'points', diem: 'points', explanation: 'explanation', giaithich: 'explanation',
  imageurl: 'image', image: 'image', anh: 'image',
};

/** Bảng (hàng đầu = tiêu đề) ⇒ câu hỏi. Ô ghép cặp viết "trái => phải" (hoặc "trái -> phải", "trái | phải"). */
export function parseQuestionTable(rows: string[][], defaultTopic = ''): ImportRow[] {
  const out: ImportRow[] = [];
  const hi = rows.findIndex((r) => r.some((c) => HEADER_MAP[headerKey(c)] === 'question'));
  if (hi < 0) return [{ line: 1, question: null, errors: ['No "Question" column — use the template'], source: '' }];
  const cols = rows[hi].map((c) => HEADER_MAP[headerKey(c)] ?? '');
  for (let i = hi + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row.some((c) => String(c ?? '').trim())) continue;
    if (out.length >= LIMITS.importRows) { out.push({ line: i + 1, question: null, errors: [`Only the first ${LIMITS.importRows} rows are read`], source: '' }); break; }
    const get = (k: string) => String(row[cols.indexOf(k)] ?? '').trim();
    const errors: string[] = [];
    const typeRaw = get('type').toLowerCase();
    const type: QuestionType | undefined = typeRaw ? (TYPE_ALIASES[typeRaw] ?? (QUESTION_TYPES.includes(typeRaw.toUpperCase() as QuestionType) ? typeRaw.toUpperCase() as QuestionType : undefined)) : 'SINGLE';
    if (!type) errors.push(`Unknown type "${get('type')}"`);
    const opts = ['A', 'B', 'C', 'D', 'E', 'F'].map((L) => get(L)).filter(Boolean);
    const ans = get('answer');
    const raw: Record<string, unknown> = {
      type: type ?? 'SINGLE', topic: get('topic') || defaultTopic, prompt: get('question'), points: get('points') ? Number(get('points').replace(',', '.')) : 1,
      explanation: get('explanation'), imageUrl: get('image') || null,
    };
    fillAnswer(raw, type ?? 'SINGLE', opts, ans, errors);
    const { q, errors: ve } = validateQuestion(raw);
    out.push({ line: i + 1, question: errors.length || ve.length ? null : q, errors: [...errors, ...ve], source: get('question').slice(0, 120) });
  }
  return out;
}

function fillAnswer(raw: Record<string, unknown>, type: QuestionType, opts: string[], ans: string, errors: string[]) {
  if (type === 'SINGLE' || type === 'MULTI') {
    raw.options = opts.map((text, i) => ({ id: `o${i + 1}`, text }));
    const letters = ans.toUpperCase().split(/[\s,;/|]+/).filter(Boolean);
    const bad = letters.filter((L) => L.length !== 1 || LETTERS.indexOf(L) < 0 || LETTERS.indexOf(L) >= opts.length);
    if (!letters.length) errors.push('The Answer cell is empty (use letters, e.g. B or A,C)');
    else if (bad.length) errors.push(`Answer "${ans}" does not match the options`);
    raw.answer = { correct: letters.filter((L) => !bad.includes(L)).map((L) => `o${LETTERS.indexOf(L) + 1}`) };
    if (type === 'SINGLE' && letters.length > 1) errors.push('Single choice has more than one answer — use type "multi"');
  } else if (type === 'TRUE_FALSE') {
    const a = normalizeShort(ans, {});
    const v = TRUE_WORDS.includes(a) ? true : FALSE_WORDS.includes(a) ? false : undefined;
    if (v === undefined) errors.push('Answer must be TRUE or FALSE');
    raw.answer = { value: v };
  } else if (type === 'SHORT') {
    raw.answer = { accepted: ans.split('|').map((s) => s.trim()).filter(Boolean) };
  } else {
    raw.options = opts.map((cell, i) => {
      const m = /^(.*?)\s*(?:=>|->|→|\|)\s*(.*)$/.exec(cell);
      if (!m) errors.push(`Pair ${LETTERS[i]} must look like "left => right"`);
      return { id: `p${i + 1}`, left: m?.[1] ?? cell, right: m?.[2] ?? '' };
    });
  }
}

/** Aiken: câu hỏi (một hoặc nhiều dòng), các dòng "A. …"/"A) …", rồi "ANSWER: B". Khối cách nhau bằng dòng trống (không bắt buộc). */
export function parseAiken(text: string, topic = ''): ImportRow[] {
  const out: ImportRow[] = [];
  const lines = text.replace(/^﻿/, '').split(/\r?\n/);
  let buf: { start: number; prompt: string[]; opts: string[]; } | null = null;
  const flush = (line: number, answer: string | null) => {
    if (!buf) return;
    const errors: string[] = [];
    if (answer === null) errors.push('Missing "ANSWER:" line');
    const raw: Record<string, unknown> = { type: 'SINGLE', topic, prompt: buf.prompt.join('\n'), points: 1 };
    fillAnswer(raw, 'SINGLE', buf.opts, answer ?? '', errors);
    const { q, errors: ve } = validateQuestion(raw);
    const all = [...new Set([...errors, ...ve])];
    out.push({ line: buf.start, question: all.length ? null : q, errors: all, source: buf.prompt.join(' ').slice(0, 120) });
    buf = null;
    void line;
  };
  lines.forEach((l, i) => {
    const t = l.trim();
    if (!t) return;
    const ans = /^ANSWER\s*:\s*(.+)$/i.exec(t);
    if (ans) { if (buf) flush(i + 1, ans[1].trim()); else out.push({ line: i + 1, question: null, errors: ['"ANSWER:" without a question'], source: t }); return; }
    const opt = /^([A-J])\s*[.)]\s+(.*)$/.exec(t);
    if (opt && buf && (buf.opts.length || buf.prompt.length)) {
      if (LETTERS.indexOf(opt[1]) !== buf.opts.length) { buf.opts.push(opt[2]); return; }
      buf.opts.push(opt[2]);
      return;
    }
    if (buf && buf.opts.length) flush(i + 1, null); // câu mới bắt đầu khi câu cũ chưa có ANSWER
    if (!buf) buf = { start: i + 1, prompt: [], opts: [] };
    buf.prompt.push(t);
  });
  if (buf) flush(lines.length, null);
  return out.slice(0, LIMITS.importRows);
}

/**
 * GIFT (tập con thông dụng của Moodle):
 *   // chú thích     ::Tiêu đề:: Câu hỏi { =đúng ~sai ~sai #phản hồi ####giải thích chung }
 *   {T} {F} {TRUE} {FALSE}          đúng/sai
 *   { =Hà Nội =Ha Noi }             điền ngắn (chỉ có "=")
 *   { ~%50%A ~%50%B ~%-100%C }      nhiều đáp án (trọng số dương = đúng)
 *   { =trái -> phải =trái2 -> phải2 }   ghép cặp
 *   $CATEGORY: chủ đề              đổi chủ đề cho các câu sau
 * Ký tự thoát: \= \~ \# \{ \} \:
 */
export function parseGift(text: string, defaultTopic = ''): ImportRow[] {
  const out: ImportRow[] = [];
  const src = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  let topic = defaultTopic;
  // Tách khối theo dòng trống; giữ số dòng bắt đầu.
  const blocks: Array<{ line: number; text: string }> = [];
  let cur: string[] = [];
  let start = 1;
  src.split('\n').forEach((l, i) => {
    if (/^\s*\/\//.test(l)) return;
    if (!l.trim()) { if (cur.length) blocks.push({ line: start, text: cur.join('\n') }); cur = []; return; }
    if (!cur.length) start = i + 1;
    cur.push(l);
  });
  if (cur.length) blocks.push({ line: start, text: cur.join('\n') });
  const ESC: Record<string, string> = { '=': '\u0001', '~': '\u0002', '#': '\u0003', '{': '\u0004', '}': '\u0005', ':': '\u0006' };
  const unesc = (s: string) => s.replace(/[\u0001-\u0006]/g, (c) => '=~#{}:'['\u0001\u0002\u0003\u0004\u0005\u0006'.indexOf(c)]).trim();
  for (const b of blocks) {
    if (out.length >= LIMITS.importRows) break;
    const cat = /^\$CATEGORY:\s*(.+)$/im.exec(b.text);
    if (cat && !b.text.includes('{')) { topic = cat[1].trim().split('/').pop() ?? topic; continue; }
    const t = b.text.replace(/\\([=~#{}:])/g, (_, c: string) => ESC[c]);
    const m = /^(?:::(.*?)::)?([\s\S]*?)\{([\s\S]*)\}([\s\S]*)$/.exec(t.trim());
    if (!m) { out.push({ line: b.line, question: null, errors: ['No answer block { … }'], source: unesc(t).slice(0, 120) }); continue; }
    const prompt = unesc(`${m[2]} ${m[4].trim() ? '_____ ' + m[4] : ''}`.replace(/\[(?:html|moodle|markdown|plain)\]/gi, ''));
    let body = m[3];
    let explanation = '';
    const gen = /####([\s\S]*)$/.exec(body);
    if (gen) { explanation = unesc(gen[1]); body = body.slice(0, gen.index); }
    const errors: string[] = [];
    const tf = /^\s*(T|TRUE|F|FALSE)\s*(#.*)?$/i.exec(body.trim());
    let raw: Record<string, unknown>;
    if (tf) {
      raw = { type: 'TRUE_FALSE', answer: { value: /^t/i.test(tf[1]) } };
    } else {
      const parts = [...body.matchAll(/([=~])(%-?\d+(?:\.\d+)?%)?([^=~]*)/g)].map((x) => ({
        mark: x[1], weight: x[2] ? Number(x[2].slice(1, -1)) : null, text: unesc(x[3].replace(/#[\s\S]*$/, '')),
      })).filter((p) => p.text);
      if (!parts.length) errors.push('Empty answer block');
      const isMatch = parts.length > 0 && parts.every((p) => p.mark === '=' && p.text.includes('->'));
      const allEq = parts.length > 0 && parts.every((p) => p.mark === '=');
      if (isMatch) {
        raw = { type: 'MATCH', options: parts.map((p, i) => { const [l, ...r] = p.text.split('->'); return { id: `p${i + 1}`, left: l.trim(), right: r.join('->').trim() }; }) };
      } else if (allEq) {
        raw = { type: 'SHORT', answer: { accepted: parts.map((p) => p.text) } };
      } else {
        const weighted = parts.some((p) => p.weight !== null);
        const correctIdx = parts.map((p, i) => ((p.mark === '=' || (p.weight ?? 0) > 0) ? i : -1)).filter((i) => i >= 0);
        const multi = weighted && correctIdx.length > 1;
        raw = {
          type: multi ? 'MULTI' : 'SINGLE',
          options: parts.map((p, i) => ({ id: `o${i + 1}`, text: p.text })),
          answer: { correct: correctIdx.map((i) => `o${i + 1}`) },
          settings: multi ? { partial: true } : {},
        };
      }
    }
    const title = m[1] ? unesc(m[1]) : '';
    const { q, errors: ve } = validateQuestion({ ...raw, topic, prompt: prompt || title, explanation, points: 1 });
    const all = [...errors, ...ve];
    out.push({ line: b.line, question: all.length ? null : q, errors: all, source: (prompt || title).slice(0, 120) });
  }
  return out;
}

// ─── AI gợi ý: đọc JSON model trả ⇒ câu hỏi (luôn là NHÁP) ──────

export function parseAiQuestions(text: string, topic: string): ImportRow[] {
  let arr: unknown[] = [];
  try {
    const m = /\[[\s\S]*\]|\{[\s\S]*\}/.exec(text);
    const j = m ? JSON.parse(m[0]) : null;
    arr = Array.isArray(j) ? j : Array.isArray(j?.questions) ? j.questions : [];
  } catch { arr = []; }
  return arr.slice(0, 30).map((x, i) => {
    const r = (x && typeof x === 'object' ? x : {}) as Record<string, any>;
    const type = String(r.type ?? 'SINGLE').toUpperCase();
    const raw: Record<string, unknown> = { ...r, type, topic: r.topic || topic, points: r.points ?? 1 };
    if ((type === 'SINGLE' || type === 'MULTI') && Array.isArray(r.options)) {
      raw.options = r.options.map((o: unknown, k: number) => ({ id: `o${k + 1}`, text: typeof o === 'string' ? o : (o as any)?.text }));
      const idx: number[] = (Array.isArray(r.correct) ? r.correct : [r.correct]).map((c: unknown) => (typeof c === 'number' ? c : LETTERS.indexOf(String(c ?? '').toUpperCase()))).filter((n: number) => n >= 0);
      raw.answer = { correct: idx.map((k) => `o${k + 1}`) };
    } else if (type === 'TRUE_FALSE') raw.answer = { value: r.value === true || r.answer === true || String(r.answer).toLowerCase() === 'true' };
    else if (type === 'SHORT') raw.answer = { accepted: Array.isArray(r.accepted) ? r.accepted : [r.answer].filter(Boolean) };
    else if (type === 'MATCH' && Array.isArray(r.pairs)) raw.options = r.pairs.map((p: any, k: number) => ({ id: `p${k + 1}`, left: p?.left, right: p?.right }));
    const { q, errors } = validateQuestion(raw);
    return { line: i + 1, question: errors.length ? null : q, errors, source: String(r.prompt ?? '').slice(0, 120) };
  });
}
