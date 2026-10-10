/**
 * CT Work đợt 7a (11/10/2026) — LUẬT THUẦN cho OKR · planning poker · retro board · timer.
 * Không đọc DB, không I/O ⇒ test bằng bảng (agileRules.test.ts). Service (okr/poker/retro/timer.service.ts) chỉ nạp dữ
 * liệu rồi gọi các hàm ở đây — một luật, một chỗ.
 */

// ═══ OKR ═════════════════════════════════════════════════════════

export const KR_METRICS = ['PERCENT', 'NUMBER', 'BOOLEAN'] as const;
export type KrMetric = (typeof KR_METRICS)[number];
export const KR_SOURCES = ['MANUAL', 'ISSUES', 'POINTS'] as const;
export type KrSource = (typeof KR_SOURCES)[number];
export const KR_LINK_KINDS = ['ISSUE', 'EPIC', 'SPRINT'] as const;
export type KrLinkKind = (typeof KR_LINK_KINDS)[number];
export type OkrStatus = 'NOT_STARTED' | 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK' | 'DONE' | 'SCORED';

const clamp01 = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);
const round3 = (n: number) => Math.round(n * 1000) / 1000;

/**
 * Tiến độ 0–1 của KR nhập tay. Hướng tính theo start → target nên KR "giảm" (vd thời gian phản hồi 800ms → 200ms) vẫn
 * đúng. BOOLEAN: current ≥ 1 ⇒ xong. start = target (sai cấu hình) ⇒ đạt khi current đã chạm target.
 */
export function krProgress(metric: KrMetric, start: number, target: number, current: number): number {
  if (metric === 'BOOLEAN') return current >= 1 ? 1 : 0;
  if (target === start) return (target >= start ? current >= target : current <= target) ? 1 : 0;
  return round3(clamp01((current - start) / (target - start)));
}

export interface LinkedIssue { id: number; done: boolean; points: number | null }

/**
 * Tiến độ từ thẻ liên kết (đã khử trùng theo id). ISSUES = số thẻ xong / tổng thẻ. POINTS = điểm xong / tổng điểm —
 * không thẻ nào có điểm ⇒ lùi về đếm thẻ (KR không bị kẹt 0% chỉ vì nhóm chưa ước lượng).
 */
export function linkedProgress(source: 'ISSUES' | 'POINTS', issues: LinkedIssue[]): { progress: number; done: number; total: number; unit: 'issues' | 'points' } {
  const uniq = [...new Map(issues.map((i) => [i.id, i])).values()];
  if (!uniq.length) return { progress: 0, done: 0, total: 0, unit: source === 'POINTS' ? 'points' : 'issues' };
  if (source === 'POINTS') {
    const total = uniq.reduce((s, i) => s + (i.points ?? 0), 0);
    if (total > 0) {
      const done = uniq.reduce((s, i) => s + (i.done ? i.points ?? 0 : 0), 0);
      return { progress: round3(clamp01(done / total)), done, total, unit: 'points' };
    }
  }
  const done = uniq.filter((i) => i.done).length;
  return { progress: round3(done / uniq.length), done, total: uniq.length, unit: 'issues' };
}

/** Tiến độ objective = trung bình tiến độ các KR (KR ngang trọng số, như cách đọc OKR phổ biến). */
export function objectiveProgress(krProgresses: number[]): number {
  if (!krProgresses.length) return 0;
  return round3(krProgresses.reduce((s, p) => s + clamp01(p), 0) / krProgresses.length);
}

/** Phần thời gian đã trôi của chu kỳ (0–1), tính theo ngày. */
export function cycleElapsed(start: Date, end: Date, now: Date): number {
  const s = start.getTime();
  const e = end.getTime() + 86_400_000; // endDate là ngày CUỐI (tính trọn ngày)
  if (now.getTime() <= s) return 0;
  if (now.getTime() >= e) return 1;
  return round3((now.getTime() - s) / (e - s));
}

/**
 * Trạng thái so với nhịp mong đợi (tiến độ tuyến tính theo thời gian). Độ tự tin check-in gần nhất ≤ 3/10 kéo trạng
 * thái xuống ít nhất AT_RISK — nhóm tự báo khó khăn thì tin nhóm, kể cả khi số còn đẹp.
 */
export function okrStatus(progress: number, elapsed: number, confidence: number | null, scored = false): OkrStatus {
  if (scored) return 'SCORED';
  if (progress >= 1) return 'DONE';
  if (elapsed <= 0) return 'NOT_STARTED';
  const gap = elapsed - progress;
  let s: OkrStatus = gap <= 0.1 ? 'ON_TRACK' : gap <= 0.25 ? 'AT_RISK' : 'OFF_TRACK';
  if (confidence !== null && confidence <= 3 && s === 'ON_TRACK') s = 'AT_RISK';
  return s;
}

/** Điểm cuối kỳ gợi ý cho KR: tiến độ làm tròn tới 0.1 (thang 0.0–1.0 kiểu Google). */
export function suggestedScore(progress: number): number {
  return Math.round(clamp01(progress) * 10) / 10;
}

/** Điểm objective = trung bình điểm KR (bỏ KR chưa chấm); không KR nào chấm ⇒ null. */
export function objectiveScore(krScores: Array<number | null>): number | null {
  const s = krScores.filter((x): x is number => typeof x === 'number');
  if (!s.length) return null;
  return Math.round((s.reduce((a, b) => a + b, 0) / s.length) * 100) / 100;
}

/** Dải màu chấm điểm: 0.0–0.3 đỏ (không đạt), 0.4–0.6 vàng (tiến bộ), 0.7–1.0 xanh (đạt). */
export function scoreBand(score: number): 'RED' | 'YELLOW' | 'GREEN' {
  return score >= 0.7 ? 'GREEN' : score >= 0.4 ? 'YELLOW' : 'RED';
}

export function validScore(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1;
}

/** Thứ Hai của tuần (giờ Việt Nam, UTC+7) dạng 'YYYY-MM-DD' — khoá một check-in mỗi tuần. */
export function weekStartVN(d: Date): string {
  const local = new Date(d.getTime() + 7 * 3_600_000);
  const dow = (local.getUTCDay() + 6) % 7; // 0 = thứ Hai
  local.setUTCDate(local.getUTCDate() - dow);
  return local.toISOString().slice(0, 10);
}

// ═══ Planning poker ══════════════════════════════════════════════

export const POKER_DECKS = {
  FIBONACCI: ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'],
  TSHIRT: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕'],
} as const;
export type PokerDeck = keyof typeof POKER_DECKS;
export const POKER_DECK_KEYS = Object.keys(POKER_DECKS) as PokerDeck[];
/** Áo → điểm khi chốt (ghi vào story_points của thẻ). */
export const TSHIRT_POINTS: Record<string, number> = { XS: 1, S: 2, M: 3, L: 5, XL: 8, XXL: 13 };
export const POKER_STATES = ['PENDING', 'VOTING', 'REVEALED', 'ESTIMATED', 'SKIPPED'] as const;
export type PokerState = (typeof POKER_STATES)[number];
export const POKER_TIMERS = [0, 30, 60, 90, 120, 180, 300] as const;

export function validCard(deck: PokerDeck, value: string): boolean {
  return (POKER_DECKS[deck] as readonly string[]).includes(value);
}

/** Lá bài có số điểm (bỏ '?' và '☕'). */
export function cardPoints(deck: PokerDeck, value: string): number | null {
  if (deck === 'TSHIRT') return TSHIRT_POINTS[value] ?? null;
  const n = Number(value);
  return value !== '' && Number.isFinite(n) ? n : null;
}

export interface PokerDistribution {
  counts: Array<{ value: string; count: number }>;
  voters: number;
  numeric: number;
  average: number | null;
  median: number | null;
  /** Mọi lá có số đều trùng nhau (≥ 2 người). */
  consensus: boolean;
  /** Lá xuất hiện nhiều nhất (hoà ⇒ lá lớn hơn — ước lượng thận trọng). */
  mode: string | null;
  /** Lá nhỏ nhất / lớn nhất ⇒ mời hai người này nói trước khi bỏ phiếu lại. */
  low: string | null;
  high: string | null;
  /** Lá gần trung vị nhất trong bộ bài — gợi ý chốt. */
  suggested: string | null;
}

function nearestCard(deck: PokerDeck, pts: number): string | null {
  let best: string | null = null;
  let bestD = Infinity;
  for (const c of POKER_DECKS[deck]) {
    const p = cardPoints(deck, c);
    if (p === null) continue;
    const dd = Math.abs(p - pts);
    if (dd < bestD || (dd === bestD && best !== null && (cardPoints(deck, best) ?? 0) < p)) { best = c; bestD = dd; }
  }
  return best;
}

export function pokerDistribution(deck: PokerDeck, votes: string[]): PokerDistribution {
  const order = POKER_DECKS[deck] as readonly string[];
  const tally = new Map<string, number>();
  for (const v of votes) tally.set(v, (tally.get(v) ?? 0) + 1);
  const counts = [...tally.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value));
  const nums = votes.map((v) => ({ v, p: cardPoints(deck, v) })).filter((x): x is { v: string; p: number } => x.p !== null).sort((a, b) => a.p - b.p);
  const average = nums.length ? Math.round((nums.reduce((s, x) => s + x.p, 0) / nums.length) * 10) / 10 : null;
  const median = nums.length ? (nums.length % 2 ? nums[(nums.length - 1) / 2].p : (nums[nums.length / 2 - 1].p + nums[nums.length / 2].p) / 2) : null;
  let mode: string | null = null;
  let modeN = 0;
  for (const c of counts) {
    if (cardPoints(deck, c.value) === null) continue;
    if (c.count > modeN || (c.count === modeN && mode !== null && (cardPoints(deck, c.value) ?? 0) > (cardPoints(deck, mode) ?? 0))) { mode = c.value; modeN = c.count; }
  }
  return {
    counts, voters: votes.length, numeric: nums.length, average, median,
    consensus: nums.length >= 2 && nums.every((x) => x.v === nums[0].v),
    mode, low: nums[0]?.v ?? null, high: nums[nums.length - 1]?.v ?? null,
    suggested: median === null ? null : nearestCard(deck, median),
  };
}

/** Tách từ cho so độ giống tiêu đề (bỏ dấu tiếng Việt, từ ≤ 2 ký tự, từ vô nghĩa). */
const STOP = new Set(['the', 'and', 'for', 'with', 'from', 'into', 'của', 'cho', 'các', 'một', 'những', 'trong', 'khi', 'được', 'theo', 'that', 'this', 'add', 'new']);
export function titleTokens(s: string): Set<string> {
  const plain = s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase();
  return new Set(plain.split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w)));
}

export function similarity(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  return round3(inter / (a.size + b.size - inter));
}

export interface EstimatedPeer { key: string; title: string; points: number; typeKey: string }

/**
 * GỢI Ý điểm (chỉ đọc, KHÔNG ghi gì): thẻ đã ước lượng giống nhất (Jaccard tiêu đề, cùng loại thẻ +0.1), lấy trung vị có
 * trọng số rồi bám lá gần nhất trong bộ bài. Ít hơn một thẻ đủ giống (≥ 0.15) ⇒ không gợi ý.
 */
export function suggestFromPeers(deck: PokerDeck, target: { title: string; typeKey: string }, peers: EstimatedPeer[], limit = 5) {
  const t = titleTokens(target.title);
  const scored = peers
    .map((p) => ({ ...p, similarity: round3(Math.min(1, similarity(t, titleTokens(p.title)) + (p.typeKey === target.typeKey ? 0.1 : 0))) }))
    .filter((p) => p.similarity >= 0.15)
    .sort((a, b) => b.similarity - a.similarity || a.points - b.points)
    .slice(0, limit);
  if (!scored.length) return { suggested: null as string | null, points: null as number | null, basis: scored };
  const sorted = [...scored].sort((a, b) => a.points - b.points);
  const half = sorted.reduce((s, p) => s + p.similarity, 0) / 2;
  let acc = 0;
  let med = sorted[sorted.length - 1].points;
  for (const p of sorted) { acc += p.similarity; if (acc >= half) { med = p.points; break; } }
  const card = deck === 'TSHIRT'
    ? Object.entries(TSHIRT_POINTS).reduce((b, [k, v]) => (Math.abs(v - med) < Math.abs(TSHIRT_POINTS[b] - med) ? k : b), 'M')
    : nearestCard(deck, med);
  return { suggested: card, points: card === null ? null : cardPoints(deck, card), basis: scored };
}

// ═══ Retro ═══════════════════════════════════════════════════════

export const RETRO_TEMPLATES = {
  SSC: ['START', 'STOP', 'CONTINUE'],
  MSG: ['MAD', 'SAD', 'GLAD'],
  FOUR_L: ['LIKED', 'LEARNED', 'LACKED', 'LONGED_FOR'],
} as const;
export type RetroTemplate = keyof typeof RETRO_TEMPLATES;
export const RETRO_TEMPLATE_KEYS = Object.keys(RETRO_TEMPLATES) as RetroTemplate[];
/** Tên cột tiếng Anh (bản xuất + AI) — giao diện dịch qua i18n. */
export const RETRO_COLUMN_LABEL: Record<string, string> = {
  START: 'Start', STOP: 'Stop', CONTINUE: 'Continue', MAD: 'Mad', SAD: 'Sad', GLAD: 'Glad',
  LIKED: 'Liked', LEARNED: 'Learned', LACKED: 'Lacked', LONGED_FOR: 'Longed for',
};

export function validColumn(template: RetroTemplate, column: string): boolean {
  return (RETRO_TEMPLATES[template] as readonly string[]).includes(column);
}

export function retroLocked(r: { lockAt: Date | null; lockedAt: Date | null }, now: Date): boolean {
  return !!r.lockedAt || (!!r.lockAt && r.lockAt.getTime() <= now.getTime());
}

/**
 * Hình dạng một thẻ retro gửi cho NGƯỜI XEM. Ẩn danh ⇒ không có trường tác giả nào (kể cả id), chỉ cờ `mine` của chính
 * người xem. Đây là chốt duy nhất mọi đường đọc đi qua (list, chi tiết, socket không mang nội dung).
 */
export function cardView<A>(card: { id: number; column: string; body: string; authorId: number; groupId: number | null; position: number; createdAt: Date }, opts: {
  viewerId: number; anonymous: boolean; author: A | null; votes: number; myVotes: number;
}) {
  const base = {
    id: card.id, column: card.column, body: card.body, groupId: card.groupId, position: card.position,
    votes: opts.votes, myVotes: opts.myVotes, mine: card.authorId === opts.viewerId,
  };
  return opts.anonymous ? { ...base, author: null } : { ...base, author: opts.author, createdAt: card.createdAt };
}

/** Còn bao nhiêu chấm vote (trần votesPerPerson trên cả retro). */
export function votesLeft(perPerson: number, used: number): number {
  return Math.max(0, perPerson - used);
}

// ═══ Timer ═══════════════════════════════════════════════════════

export const TIMER_MAX_MIN = 24 * 60;

/** Giây đã chạy (cộng phần đang chạy nếu chưa tạm dừng). */
export function timerElapsedSec(t: { accumulatedSec: number; runningSince: Date | null }, now: Date): number {
  return t.accumulatedSec + (t.runningSince ? Math.max(0, Math.floor((now.getTime() - t.runningSince.getTime()) / 1000)) : 0);
}

/**
 * Giây ⇒ phút ghi worklog: làm tròn tới phút gần nhất; dưới 30 giây ⇒ 0 (không ghi gì); trần 24 giờ (giới hạn của
 * worklog) kèm cờ `capped` để giao diện nói rõ.
 */
export function timerMinutes(sec: number): { minutes: number; capped: boolean } {
  const m = Math.round(Math.max(0, sec) / 60);
  return m > TIMER_MAX_MIN ? { minutes: TIMER_MAX_MIN, capped: true } : { minutes: m, capped: false };
}

/** Chạy quá ngưỡng nhắc (phút) chưa. */
export function timerOverdue(sec: number, remindMin: number): boolean {
  return remindMin > 0 && sec >= remindMin * 60;
}
