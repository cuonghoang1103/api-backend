/**
 * CT Work — đợt S6 (05/10/2026): SPEC FIDELITY. Hàm THUẦN (không DB, không LLM) — test ở `s6.test.ts`.
 *
 * Nguồn ý tưởng: báo cáo SDAD (arXiv 2608.20341) chấm "Spec Fidelity" theo 4 chiều, nền là các thuộc tính của
 * yêu cầu tốt trong ISO/IEC/IEEE 29148:
 *   - completeness   — có đủ phần cần có, có edge case + failure mode, không chỗ "TBD";
 *   - consistency    — không trùng, không mâu thuẫn, mã yêu cầu không định nghĩa hai lần;
 *   - unambiguity    — đọc ra MỘT cách hiểu (không "nhanh", "thân thiện", "etc", "tuỳ"…);
 *   - verifiability  — mỗi yêu cầu có tiêu chí đạt/trượt đo được + truy được tới test.
 *
 * Phần ở đây chạy TRƯỚC và không cần AI: từ mơ hồ (EN + VI), câu không đo được, thiếu acceptance criteria,
 * yêu cầu trùng, thiếu test liên kết (dữ liệu truy vết THẬT do service đưa vào), thiếu mục chuẩn của SRS.
 * LLM (specReview.service) chỉ BỔ SUNG nhận xét ngữ nghĩa (mâu thuẫn, thiếu edge case) — và bị chặn trần điểm trừ.
 *
 * ⚠️ Ranh giới từ tiếng Việt: KHÔNG dùng `\b` (bài học regex_word_boundary_breaks_vietnamese — `\b` coi chữ có dấu là
 * ranh giới nên "nhanh" khớp giữa "nhanhchóng"…). Dùng lookaround `\p{L}\p{N}` với cờ `u`.
 */

export type Dimension = 'completeness' | 'consistency' | 'unambiguity' | 'verifiability';
export type Severity = 'high' | 'medium' | 'low';
export const DIMENSIONS: readonly Dimension[] = ['completeness', 'consistency', 'unambiguity', 'verifiability'];

export interface FindingTarget {
  kind: 'PAGE' | 'ISSUE';
  pageNumber?: number;
  /** Thứ tự khối chữ trong trang (đoạn / mục danh sách / hàng bảng) — UI dùng để nhảy tới. */
  blockIndex?: number;
  issueNumber?: number;
}

export interface Finding {
  id: string;
  dimension: Dimension;
  severity: Severity;
  /** Mã luật: vague_term · placeholder · unmeasurable · missing_ac · no_test · duplicate · duplicate_id · empty_description ·
   *  no_edge_case · missing_section · no_failure_modes · no_requirements · weak_modal · ai_* (ngữ nghĩa). */
  rule: string;
  ref: string;
  excerpt: string;
  why: string;
  suggestion: string;
  /** Bản viết lại ÁP DỤNG ĐƯỢC (thay đúng `excerpt`, hoặc thêm khối AC cho `missing_ac`). Null = chỉ gợi ý. */
  rewrite: string | null;
  target: FindingTarget | null;
  source: 'rule' | 'ai';
  status: 'open' | 'applied' | 'dismissed';
  appliedAt?: string;
  appliedById?: number;
}

/** Một yêu cầu đem chấm: một thẻ REQUIREMENT/STORY, hoặc một câu yêu cầu rút từ trang. */
export interface SpecItem {
  ref: string;
  kind: 'ISSUE' | 'STATEMENT';
  /** Tiêu đề thẻ (ISSUE) — STATEMENT để trống. */
  title?: string;
  /** Chữ đem soi: mô tả thẻ / câu yêu cầu. */
  text: string;
  heading?: string | null;
  blockIndex?: number;
  issueNumber?: number;
  /** Nhãn mã yêu cầu trong câu (FR-01, NFR-3, UC-02…) nếu có. */
  label?: string | null;
  hasAcceptanceCriteria: boolean;
  acceptanceCriteriaCount: number;
  /** Số test (thẻ TEST) liên kết TESTS tới yêu cầu. */
  testCount: number;
  hasEdgeCase: boolean;
  /** Mã thẻ được nhắc trong câu (trang) — để truy test. */
  issueRefs?: number[];
}

export interface Scores {
  completeness: number;
  consistency: number;
  unambiguity: number;
  verifiability: number;
  overall: number;
}

export interface ReviewStats {
  items: number;
  withAcceptanceCriteria: number;
  withTests: number;
  measurable: number;
  acPct: number;
  testPct: number;
  /** Phần "câu đo được / không mơ hồ" của verifiability (100 − điểm trừ). */
  verifiabilityRules: number;
  testingEnabled: boolean;
}

export interface UntracedItem { ref: string; title: string; hasAcceptanceCriteria: boolean; target: FindingTarget | null }

// ─── Chữ ──────────────────────────────────────────────────────────

export const norm = (s: string) => s.normalize('NFC');
const L = '\\p{L}\\p{N}_';
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function termRegex(term: string): RegExp {
  const t = norm(term);
  const body = t.split(/\s+/).map(escapeRe).join('\\s+');
  // Từ toàn dấu câu ("...", "???") không có ranh giới chữ.
  if (!/[\p{L}\p{N}]/u.test(t)) return new RegExp(body, 'giu');
  const pre = /^[\p{L}\p{N}]/u.test(t) ? `(?<![${L}])` : '';
  const post = /[\p{L}\p{N}]$/u.test(t) ? `(?![${L}])` : '';
  return new RegExp(`${pre}${body}${post}`, 'giu');
}

// ─── Danh sách từ mơ hồ (EN + VI) ─────────────────────────────────

export interface VagueTerm {
  term: string;
  dimension: Dimension;
  severity: Severity;
  rule: 'vague_term' | 'placeholder' | 'weak_modal';
  hint: string;
  /** Cụm thay thế đo được — viết lại câu bằng cách thay đúng cụm này (người dùng sửa số trước khi áp dụng). */
  replace?: string;
}

const EN_SPEED = 'within 2 seconds for 95% of requests';
const VI_SPEED = 'trong vòng 2 giây cho 95% yêu cầu';
const EN_EASE = 'so that a first-time user completes the task in under 3 minutes without help';
const VI_EASE = 'sao cho người dùng mới hoàn thành tác vụ trong dưới 3 phút mà không cần hướng dẫn';

/** Cụm dài đứng TRƯỚC cụm ngắn chứa nó ("should be fast" trước "fast") — chồng lấn chỉ tính một lần. */
export const VAGUE_TERMS: VagueTerm[] = [
  // ── Chỗ trống ──
  { term: 'TBD', dimension: 'completeness', severity: 'high', rule: 'placeholder', hint: 'An open placeholder — the requirement is not finished.' },
  { term: 'TBC', dimension: 'completeness', severity: 'high', rule: 'placeholder', hint: 'An open placeholder — the requirement is not finished.' },
  { term: 'TODO', dimension: 'completeness', severity: 'high', rule: 'placeholder', hint: 'An open placeholder — the requirement is not finished.' },
  { term: '???', dimension: 'completeness', severity: 'high', rule: 'placeholder', hint: 'An open question left in the text.' },
  { term: 'chưa xác định', dimension: 'completeness', severity: 'high', rule: 'placeholder', hint: 'Chỗ còn bỏ ngỏ — yêu cầu chưa xong.' },
  { term: 'sẽ bổ sung sau', dimension: 'completeness', severity: 'high', rule: 'placeholder', hint: 'Chỗ còn bỏ ngỏ — yêu cầu chưa xong.' },
  // ── EN: cụm dài trước ──
  { term: 'should be fast', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Fast" has no number — every reader picks a different one.', replace: `shall respond ${EN_SPEED}` },
  { term: 'be fast', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Fast" has no number — every reader picks a different one.', replace: `respond ${EN_SPEED}` },
  { term: 'as soon as possible', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'No deadline a tester can check.', replace: 'within 5 minutes' },
  { term: 'user-friendly', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"User-friendly" cannot be tested as written.', replace: `usable ${EN_EASE}` },
  { term: 'user friendly', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"User-friendly" cannot be tested as written.', replace: `usable ${EN_EASE}` },
  { term: 'easy to use', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Easy to use" cannot be tested as written.', replace: `usable ${EN_EASE}` },
  { term: 'and so on', dimension: 'completeness', severity: 'medium', rule: 'vague_term', hint: 'An open-ended list: nobody knows what else is in scope.' },
  { term: 'and/or', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"and/or" allows two readings — say which one.' },
  { term: 'if possible', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Optional wording: a tester cannot fail it.' },
  { term: 'as needed', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Who decides when it is needed?' },
  { term: 'as appropriate', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Who decides what is appropriate?' },
  { term: 'where applicable', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Which cases are applicable?' },
  { term: 'state-of-the-art', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Marketing wording — not a requirement.' },
  { term: 'etc.', dimension: 'completeness', severity: 'medium', rule: 'vague_term', hint: 'An open-ended list: nobody knows what else is in scope.' },
  { term: 'etc', dimension: 'completeness', severity: 'medium', rule: 'vague_term', hint: 'An open-ended list: nobody knows what else is in scope.' },
  { term: 'fast', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Fast" has no number — every reader picks a different one.', replace: EN_SPEED },
  { term: 'quickly', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Quickly" has no number.', replace: EN_SPEED },
  { term: 'quick', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Quick" has no number.' },
  { term: 'easy', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Easy" cannot be tested as written.' },
  { term: 'intuitive', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Intuitive" cannot be tested as written.' },
  { term: 'simple', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: '"Simple" is a matter of taste.' },
  { term: 'efficient', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Efficient by which measure?' },
  { term: 'flexible', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Flexible in which way?' },
  { term: 'robust', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Robust against what?' },
  { term: 'seamless', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Marketing wording — not testable.' },
  { term: 'scalable', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Scalable to how many users / requests?' },
  { term: 'modern', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: '"Modern" is a matter of taste.' },
  { term: 'appropriate', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: 'Who decides what is appropriate?' },
  { term: 'reasonable', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Reasonable by whose standard?' },
  { term: 'sufficient', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: 'How much is sufficient?' },
  { term: 'approximately', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: 'Give a tolerance instead (e.g. ±5%).' },
  { term: 'several', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: 'Give the number.' },
  { term: 'various', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: 'List them.' },
  { term: 'normally', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: 'And in the abnormal case?' },
  { term: 'usually', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: 'And in the other cases?' },
  { term: 'should', dimension: 'unambiguity', severity: 'low', rule: 'weak_modal', hint: '"Should" reads as optional (ISO/IEC/IEEE 29148 keeps "shall" for mandatory requirements).', replace: 'shall' },
  { term: 'may', dimension: 'unambiguity', severity: 'low', rule: 'weak_modal', hint: '"May" makes the behaviour optional — is it required or not?' },
  { term: 'might', dimension: 'unambiguity', severity: 'low', rule: 'weak_modal', hint: '"Might" is not a requirement.' },
  // ── VI: cụm dài trước ──
  { term: 'phải nhanh', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Nhanh" không có con số — mỗi người hiểu một kiểu.', replace: `phải phản hồi ${VI_SPEED}` },
  { term: 'nhanh chóng', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Nhanh chóng" không có con số.', replace: VI_SPEED },
  { term: 'thân thiện với người dùng', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Thân thiện" không kiểm được.', replace: `dễ dùng ${VI_EASE}` },
  { term: 'thân thiện', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Thân thiện" không kiểm được.', replace: VI_EASE },
  { term: 'dễ sử dụng', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Dễ sử dụng" không kiểm được.', replace: `dễ sử dụng ${VI_EASE}` },
  { term: 'dễ dùng', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Dễ dùng" không kiểm được.', replace: `dễ dùng ${VI_EASE}` },
  { term: 'tuỳ trường hợp', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Trường hợp nào? Liệt kê từng trường hợp.' },
  { term: 'tùy trường hợp', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Trường hợp nào? Liệt kê từng trường hợp.' },
  { term: 'nếu có thể', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Cách nói tuỳ chọn — tester không thể đánh trượt.' },
  { term: 'nếu cần', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Ai quyết định khi nào là "cần"?' },
  { term: 'khi cần', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Ai quyết định khi nào là "cần"?' },
  { term: 'v.v.', dimension: 'completeness', severity: 'medium', rule: 'vague_term', hint: 'Danh sách bỏ ngỏ — không ai biết còn gì trong phạm vi.' },
  { term: 'v.v', dimension: 'completeness', severity: 'medium', rule: 'vague_term', hint: 'Danh sách bỏ ngỏ — không ai biết còn gì trong phạm vi.' },
  { term: 'vv', dimension: 'completeness', severity: 'medium', rule: 'vague_term', hint: 'Danh sách bỏ ngỏ — không ai biết còn gì trong phạm vi.' },
  { term: 'nhanh', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Nhanh" không có con số — mỗi người hiểu một kiểu.', replace: VI_SPEED },
  { term: 'mượt mà', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Mượt mà" không đo được (≥ 60 fps? không giật quá 100 ms?).' },
  { term: 'mượt', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Mượt" không đo được.' },
  { term: 'trực quan', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Trực quan" không kiểm được.' },
  { term: 'đơn giản', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: '"Đơn giản" là cảm nhận.' },
  { term: 'hiệu quả', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Hiệu quả theo thước đo nào?' },
  { term: 'linh hoạt', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Linh hoạt theo nghĩa nào?' },
  { term: 'hiện đại', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: '"Hiện đại" là cảm nhận.' },
  { term: 'đẹp', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: '"Đẹp" là cảm nhận — trỏ tới bản thiết kế (Figma) thay vì tả.' },
  { term: 'hợp lý', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: 'Hợp lý theo tiêu chuẩn của ai?' },
  { term: 'phù hợp', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: 'Phù hợp với cái gì?' },
  { term: 'một số', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: 'Bao nhiêu? Liệt kê ra.' },
  { term: 'khoảng', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: 'Ghi sai số cho phép (vd ±5%).' },
  { term: 'thông thường', dimension: 'unambiguity', severity: 'low', rule: 'vague_term', hint: 'Còn trường hợp bất thường thì sao?' },
  { term: 'tuỳ', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Tuỳ" vào cái gì? Nêu điều kiện cụ thể.' },
  { term: 'tùy', dimension: 'unambiguity', severity: 'medium', rule: 'vague_term', hint: '"Tùy" vào cái gì? Nêu điều kiện cụ thể.' },
  { term: 'có thể', dimension: 'unambiguity', severity: 'low', rule: 'weak_modal', hint: '"Có thể" đọc như tuỳ chọn — bắt buộc thì viết "phải" / "được phép".', replace: 'được phép' },
];

const VAGUE_RES = VAGUE_TERMS.map((t) => ({ t, re: termRegex(t.term) }));

export interface VagueHit { term: VagueTerm; index: number; length: number; match: string }

/** Các cụm mơ hồ trong một câu — cụm dài thắng cụm ngắn nằm trong nó; "etc." và "etc" không tính hai lần. */
export function findVagueTerms(text: string): VagueHit[] {
  const s = norm(text);
  const taken: Array<[number, number]> = [];
  const out: VagueHit[] = [];
  for (const { t, re } of VAGUE_RES) {
    re.lastIndex = 0;
    for (const m of s.matchAll(re)) {
      const a = m.index ?? 0;
      const b = a + m[0].length;
      if (taken.some(([x, y]) => a < y && b > x)) continue;
      // TBD/TODO viết thường trong câu thường ("todo list") không phải chỗ trống.
      const upperOnly = t.rule === 'placeholder' && /[A-Z]/.test(t.term) && t.term === t.term.toUpperCase();
      if (upperOnly && m[0] !== m[0].toUpperCase()) continue;
      taken.push([a, b]);
      out.push({ term: t, index: a, length: m[0].length, match: m[0] });
    }
  }
  return out.sort((x, y) => x.index - y.index);
}

// ─── Đo được ──────────────────────────────────────────────────────

const UNIT = '(?:ms|milliseconds?|s|secs?|seconds?|giây|phút|minutes?|mins?|h|hrs?|hours?|giờ|ngày|days?|tuần|weeks?|tháng|months?|%|percent|phần trăm|users?|người(?:\\s+dùng)?|requests?|req/s|rps|tps|qps|kb|mb|gb|tb|kib|mib|gib|lần|times|items?|records?|bản ghi|dòng|rows?|ký tự|characters?|chars?|px|fps|mbps|đ|vnđ|vnd|usd|\\$|lượt|đơn|orders?|attempts?|tries)';
const MEASURE_RE = new RegExp(`(?<![${L}])\\d+(?:[.,]\\d+)?\\s*(?:[\\p{L}-]+\\s+){0,2}${UNIT}(?![${L}])|\\bp(?:50|90|95|99)\\b|\\d+\\s*/\\s*\\d+`, 'iu');
export function isMeasurable(text: string): boolean {
  return MEASURE_RE.test(norm(text));
}

/** Từ chỉ thuộc tính chất lượng — có mặt mà không có con số ⇒ "không đo được". */
const QUALITY_WORDS = [
  'fast', 'quick', 'quickly', 'slow', 'responsive', 'performance', 'performant', 'scalable', 'scale', 'secure', 'security', 'reliable',
  'reliability', 'available', 'availability', 'uptime', 'smooth', 'response time', 'load time', 'latency', 'throughput',
  'nhanh', 'chậm', 'mượt', 'ổn định', 'bảo mật', 'an toàn', 'hiệu năng', 'chịu tải', 'sẵn sàng', 'tải trang', 'thời gian phản hồi', 'độ trễ',
].map(termRegex);
export function mentionsQuality(text: string): boolean {
  const s = norm(text);
  return QUALITY_WORDS.some((re) => { re.lastIndex = 0; return re.test(s); });
}

// ─── Acceptance criteria · edge case · câu yêu cầu ───────────────

const AC_HEADING = /(acceptance\s+criteria|tiêu\s+chí\s+(chấp\s+nhận|nghiệm\s+thu)|điều\s+kiện\s+(chấp\s+nhận|hoàn\s+thành)|definition\s+of\s+done|^\s*ac\s*[:\d])/imu;
const AC_LINE = /^\s*(?:[-*•]\s*)?(?:(?:given|then)\s|(?:happy|unhappy|ac\s*\d*|scenario|kịch\s*bản|cho\s*trước|khi|thì|tiêu\s*chí\s*\d*)\s*:)/iu;
const GHERKIN = /(?<![\p{L}])(given|cho trước)(?![\p{L}])[\s\S]{0,300}?(?<![\p{L}])(then|thì)(?![\p{L}])/iu;

/** Đếm tiêu chí chấp nhận trong mô tả thẻ: dòng Given/When/Then, Happy:/Unhappy:, AC1…, mục sau tiêu đề "Acceptance criteria". */
export function acceptanceCriteria(text: string, taskItems = 0): { has: boolean; count: number; unhappy: number } {
  const s = norm(text ?? '');
  const lines = s.split(/\n+/);
  let count = 0;
  let inSection = false;
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (AC_HEADING.test(t) && t.length < 80) { inSection = true; continue; }
    if (AC_LINE.test(t)) { count++; continue; }
    if (inSection && /^(\d+[.)]|[-*•])\s+/.test(t)) { count++; continue; }
    if (inSection && t.length < 300 && !/[:：]$/.test(t)) count++;
    // Tiêu đề mục khác (chữ ngắn kết thúc bằng ':') ⇒ ra khỏi khối AC.
    if (inSection && /[:：]$/.test(t)) inSection = false;
  }
  count += taskItems;
  const unhappy = (s.match(/(^|\n)\s*(?:[-*•]\s*)?unhappy\s*:/gi) ?? []).length;
  return { has: count > 0 || GHERKIN.test(s), count: Math.max(count, GHERKIN.test(s) ? 1 : 0), unhappy };
}

const EDGE_WORDS = [
  'error', 'errors', 'invalid', 'fail', 'fails', 'failed', 'failure', 'timeout', 'time out', 'empty', 'exceed', 'exceeds', 'unauthorized',
  'forbidden', 'not found', 'duplicate', 'offline', 'retry', 'reject', 'rejected', 'wrong', 'missing', 'expired', 'locked', 'unhappy',
  'edge case', 'otherwise', 'if not', 'cannot', 'limit',
  'lỗi', 'sai', 'không hợp lệ', 'thất bại', 'hết hạn', 'trống', 'rỗng', 'vượt quá', 'từ chối', 'bị khoá', 'bị khóa', 'mất kết nối',
  'không tìm thấy', 'trùng', 'thử lại', 'ngược lại', 'nếu không', 'giới hạn', 'tối đa', 'tối thiểu', 'không được',
].map(termRegex);
export function hasEdgeCase(text: string): boolean {
  const s = norm(text ?? '');
  return EDGE_WORDS.some((re) => { re.lastIndex = 0; return re.test(s); });
}

const MODAL_EN = /(?<![\p{L}])(shall|must|should|will|may|needs? to|is required to|are required to|has to|have to|is able to|can)(?![\p{L}])/iu;
const MODAL_VI = /(?<![\p{L}])(phải|cần|sẽ|được phép|có thể|không được|bắt buộc|cho phép|hỗ trợ|đảm bảo)(?![\p{L}])/iu;
const REQ_LABEL = /^\s*\(?((?:FR|NFR|REQ|RQ|UC|BR|US|SR|QR|CR|R)[-_ .]?\d+(?:\.\d+)*)\)?[\s:.)–—-]/iu;
const REQ_HEADING = /(requirement|yêu\s*cầu|chức\s*năng|function|feature|use\s*case|quy\s*tắc|business\s*rule|ràng\s*buộc|constraint|quality|chất\s*lượng|non-?functional|phi\s*chức\s*năng)/iu;
const NON_REQ_HEADING = /(revision|history|lịch\s*sử|glossary|thuật\s*ngữ|definitions?|định\s*nghĩa|references?|tài\s*liệu\s*tham\s*khảo|table\s*of\s*contents|mục\s*lục|approval|phê\s*duyệt|open\s*questions|câu\s*hỏi\s*mở)/iu;

export function requirementLabel(text: string): string | null {
  const m = REQ_LABEL.exec(norm(text));
  return m ? m[1].toUpperCase().replace(/[_ ]/g, '-') : null;
}

/** Câu có phải một yêu cầu không: có mã yêu cầu, hoặc có động từ khiếm khuyết (shall/must/phải…), hoặc nằm dưới mục yêu cầu. */
export function isRequirementStatement(sentence: string, heading?: string | null): boolean {
  const s = norm(sentence).trim();
  if (s.length < 12) return false;
  if (heading && NON_REQ_HEADING.test(heading)) return false;
  if (requirementLabel(s)) return true;
  if (MODAL_EN.test(s) || MODAL_VI.test(s)) return true;
  return !!heading && REQ_HEADING.test(heading) && s.split(/\s+/).length >= 5;
}

// ─── Trang tài liệu ⇒ khối chữ + câu yêu cầu ─────────────────────

export interface PmNodeLite { type?: string; text?: string; attrs?: Record<string, unknown>; content?: PmNodeLite[] }
export interface TextBlock { index: number; heading: string | null; text: string; type: string }

const inlineText = (n: PmNodeLite): string => {
  if (typeof n.text === 'string') return n.text;
  if (n.type === 'hardBreak') return '\n';
  if (n.type === 'mention') return `@${String(n.attrs?.label ?? n.attrs?.id ?? '')}`;
  return (n.content ?? []).map(inlineText).join('');
};

/** Khối chữ theo thứ tự đọc: đoạn, mục danh sách (từng đoạn), hàng bảng (ô nối bằng " | "). Tiêu đề đi kèm. */
export function textBlocks(doc: unknown): { blocks: TextBlock[]; headings: string[] } {
  const blocks: TextBlock[] = [];
  const headings: string[] = [];
  let heading: string | null = null;
  const walk = (n: PmNodeLite) => {
    if (!n || typeof n !== 'object') return;
    if (n.type === 'heading') {
      heading = inlineText(n).trim() || null;
      if (heading) headings.push(heading);
      return;
    }
    if (n.type === 'tableRow') {
      const cells = (n.content ?? []).map((c) => (c.content ?? []).map(inlineText).join(' ').trim());
      const text = cells.filter(Boolean).join(' | ');
      // Hàng tiêu đề bảng (mọi ô là tableHeader) không phải yêu cầu.
      const isHeaderRow = (n.content ?? []).every((c) => c.type === 'tableHeader');
      if (text && !isHeaderRow) blocks.push({ index: blocks.length, heading, text, type: 'tableRow' });
      return;
    }
    if (n.type === 'paragraph' || n.type === 'codeBlock') {
      const text = inlineText(n).trim();
      if (text && n.type === 'paragraph') blocks.push({ index: blocks.length, heading, text, type: 'paragraph' });
      return;
    }
    (n.content ?? []).forEach(walk);
  };
  walk(doc as PmNodeLite);
  return { blocks, headings };
}

/** Tách câu — giữ "v.v." / "etc." / số thập phân / "e.g." không bị cắt. */
export function splitSentences(text: string): string[] {
  const protectedText = norm(text)
    .replace(/(\d)\.(\d)/g, '$1․$2')
    .replace(/\b(e\.g|i\.e|etc|vs|v\.v|Mr|Dr|No)\./gi, (m) => m.replace(/\./g, '․'));
  return protectedText
    .split(/(?<=[.!?。])\s+|\n+/)
    .map((s) => s.replace(/․/g, '.').trim())
    .filter(Boolean);
}

export interface PageStatement { block: TextBlock; sentence: string; label: string | null }

export function pageStatements(doc: unknown): { statements: PageStatement[]; blocks: TextBlock[]; headings: string[] } {
  const { blocks, headings } = textBlocks(doc);
  const statements: PageStatement[] = [];
  for (const b of blocks) {
    // Hàng bảng = một yêu cầu (bảng "ID | Mô tả | Ưu tiên" của SRS).
    const parts = b.type === 'tableRow' ? [b.text] : splitSentences(b.text);
    const blockLabel = requirementLabel(b.text);
    for (const s of parts) {
      if (!isRequirementStatement(s, b.heading)) continue;
      statements.push({ block: b, sentence: s, label: requirementLabel(s) ?? blockLabel });
    }
  }
  return { statements, blocks, headings };
}

/** Mã thẻ KEY-n nhắc trong câu. */
export function issueRefsIn(text: string, key: string): number[] {
  const re = new RegExp(`(?<![A-Za-z0-9])${escapeRe(key)}-(\\d{1,7})(?![0-9])`, 'gi');
  return [...new Set([...text.matchAll(re)].map((m) => Number(m[1])))];
}

/** Mục chuẩn của một SRS (ISO/IEC/IEEE 29148 §9.6, rút gọn) — thiếu ⇒ completeness. */
export const SRS_SECTIONS: Array<{ key: string; label: string; re: RegExp; severity: Severity }> = [
  { key: 'purpose', label: 'Purpose / scope', re: /(purpose|scope|introduction|overview|giới\s*thiệu|mục\s*(đích|tiêu)|phạm\s*vi|tổng\s*quan)/iu, severity: 'medium' },
  { key: 'functional', label: 'Functional requirements', re: /(functional\s+requirement|features?|use\s*cases?|chức\s*năng|tính\s*năng|user\s*stor)/iu, severity: 'medium' },
  { key: 'quality', label: 'Non-functional / quality requirements', re: /(non-?\s*functional|quality|performance|security|usability|phi\s*chức\s*năng|chất\s*lượng|hiệu\s*năng|bảo\s*mật)/iu, severity: 'medium' },
  { key: 'constraints', label: 'Constraints & assumptions', re: /(constraint|assumption|dependenc|ràng\s*buộc|giả\s*định|phụ\s*thuộc)/iu, severity: 'low' },
  { key: 'acceptance', label: 'Acceptance criteria / verification', re: /(acceptance|verification|validation|test|chấp\s*nhận|nghiệm\s*thu|kiểm\s*(thử|tra))/iu, severity: 'medium' },
];

/**
 * CTW-12 (đợt 4, 09/10/2026): khung mục theo LOẠI TRANG — trước đây mọi trang (kể cả GDD) bị chấm theo khung SRS ISO 29148
 * ⇒ GDD thiếu "Functional requirements" oan. Mỗi loại một khung + bộ luật trang riêng:
 *   SRS   ISO/IEC/IEEE 29148 (như cũ) — mục chuẩn + "không có failure mode" + "thiếu tiêu chí chấp nhận".
 *   SDD   IEEE 1016 (Software Design Description) / FPT Report 4 — kiến trúc, dữ liệu, thành phần/giao diện, thiết kế chi
 *         tiết, lý do thiết kế. Không chấm AC/failure mode (tài liệu thiết kế không viết tiêu chí chấp nhận).
 *   GDD   Game Design Document — tổng quan/ý tưởng, gameplay & cơ chế, cốt truyện/nhân vật, màn chơi/thế giới, mỹ thuật &
 *         âm thanh, giao diện/điều khiển, kỹ thuật. Không chấm AC/failure mode.
 *   OTHER tài liệu khác (biên bản, kế hoạch…) — không kiểm mục, chỉ các luật câu chữ (mơ hồ, chỗ trống, trùng…).
 */
export const DOC_KINDS = ['SRS', 'SDD', 'GDD', 'OTHER'] as const;
export type DocKind = (typeof DOC_KINDS)[number];

export const SDD_SECTIONS: Array<{ key: string; label: string; re: RegExp; severity: Severity }> = [
  { key: 'architecture', label: 'Architecture / high-level design', re: /(architecture|high[\s-]*level|system design|overview|kiến\s*trúc|tổng\s*quan)/iu, severity: 'medium' },
  { key: 'data', label: 'Data / database design', re: /(database|data\s*(design|model)|\berd?\b|entity|schema|cơ\s*sở\s*dữ\s*liệu|dữ\s*liệu)/iu, severity: 'medium' },
  { key: 'components', label: 'Component / interface design', re: /(component|module|package|interface|\bapi\b|class\s*spec|thành\s*phần|giao\s*diện\s*lập\s*trình)/iu, severity: 'medium' },
  { key: 'detailed', label: 'Detailed design (class / sequence)', re: /(detailed|class\s*diagram|sequence|activity|chi\s*tiết|tuần\s*tự)/iu, severity: 'medium' },
  { key: 'rationale', label: 'Design rationale / constraints', re: /(rationale|decision|constraint|trade[\s-]*off|other design|lý\s*do|quyết\s*định|ràng\s*buộc)/iu, severity: 'low' },
];

export const GDD_SECTIONS: Array<{ key: string; label: string; re: RegExp; severity: Severity }> = [
  { key: 'concept', label: 'Game overview / concept', re: /(overview|concept|vision|pitch|summary|tổng\s*quan|ý\s*tưởng|giới\s*thiệu)/iu, severity: 'medium' },
  { key: 'gameplay', label: 'Gameplay & mechanics', re: /(gameplay|mechanic|core loop|rules?|controls?|lối\s*chơi|cơ\s*chế|luật\s*chơi)/iu, severity: 'medium' },
  { key: 'story', label: 'Story / characters', re: /(story|narrative|character|lore|cốt\s*truyện|nhân\s*vật|cốt\s*chuyện)/iu, severity: 'low' },
  { key: 'levels', label: 'Levels / world', re: /(level|world|map|mission|stage|màn\s*chơi|thế\s*giới|bản\s*đồ|nhiệm\s*vụ)/iu, severity: 'medium' },
  { key: 'art', label: 'Art & audio', re: /(\bart\b|visual|audio|sound|music|style|mỹ\s*thuật|hình\s*ảnh|âm\s*thanh|nhạc)/iu, severity: 'low' },
  { key: 'ui', label: 'UI / HUD / controls', re: /(\bui\b|\bhud\b|menu|interface|controls?|giao\s*diện|điều\s*khiển)/iu, severity: 'low' },
  { key: 'tech', label: 'Technical / platform', re: /(technical|technology|platform|engine|performance|kỹ\s*thuật|nền\s*tảng|công\s*nghệ)/iu, severity: 'low' },
];

export const DOC_KIND_LABEL: Record<DocKind, string> = { SRS: 'Software Requirements Specification', SDD: 'Software Design Description', GDD: 'Game Design Document', OTHER: 'Other document' };
const DOC_KIND_STANDARD: Record<DocKind, string> = { SRS: 'ISO/IEC/IEEE 29148 SRS outline', SDD: 'IEEE 1016 SDD outline', GDD: 'game design document outline', OTHER: '' };

export function sectionsFor(kind: DocKind) {
  return kind === 'SRS' ? SRS_SECTIONS : kind === 'SDD' ? SDD_SECTIONS : kind === 'GDD' ? GDD_SECTIONS : [];
}

/**
 * Loại trang: mẫu (templateKey) trước, rồi tiêu đề, rồi đề mục (≥ 2 đề mục đặc trưng). Không đoán được ⇒ OTHER — KHÔNG mặc
 * định SRS (đó chính là lỗi CTW-12).
 */
export function docKindOf(p: { templateKey?: string | null; title?: string | null; headings?: string[] }): DocKind {
  const k = (p.templateKey ?? '').toLowerCase();
  if (/^fpt-report3|^srs\b|^dac-ta|requirement/.test(k)) return 'SRS';
  if (/^fpt-report4|^sdd\b|^sds\b|thiet-ke|design/.test(k)) return 'SDD';
  if (/^gdd\b|game/.test(k)) return 'GDD';
  const t = p.title ?? '';
  if (/\bgdd\b|game\s*design/i.test(t)) return 'GDD';
  if (/\b(sdd|sds)\b|design\s*(spec|doc|desc)|report\s*4\b|thiết\s*kế/iu.test(t)) return 'SDD';
  if (/\bsrs\b|requirements?|report\s*3\b|yêu\s*cầu|đặc\s*tả/iu.test(t)) return 'SRS';
  const hs = (p.headings ?? []).map(norm);
  const hits = (list: typeof SRS_SECTIONS) => list.filter((s) => hs.some((h) => s.re.test(h))).length;
  const gdd = hs.filter((h) => /(gameplay|mechanic|core loop|level design|lối\s*chơi|màn\s*chơi|nhân\s*vật)/iu.test(h)).length;
  if (gdd >= 2) return 'GDD';
  const sdd = hs.filter((h) => /(architecture|class\s*diagram|sequence\s*diagram|database\s*design|package\s*diagram|kiến\s*trúc)/iu.test(h)).length;
  if (sdd >= 2) return 'SDD';
  if (hits(SRS_SECTIONS) >= 3 || hs.some((h) => /(functional\s+requirement|use\s*case|non-?\s*functional)/iu.test(h))) return 'SRS';
  return 'OTHER';
}

/** Luật bỏ qua theo cấu hình dự án (spec-settings `rules.disabled`). */
export function disabledRulesOf(settings: unknown): string[] {
  const r = ((settings ?? {}) as { specRules?: { disabled?: unknown } }).specRules?.disabled;
  return Array.isArray(r) ? [...new Set(r.filter((x): x is string => typeof x === 'string' && /^[a-z_]{2,40}$/.test(x)))].slice(0, 40) : [];
}
/** Luật tắt được (luật trang + luật câu chữ). */
export const TOGGLEABLE_RULES = ['missing_section', 'no_failure_modes', 'missing_ac', 'no_test', 'vague_term', 'weak_modal', 'placeholder', 'unmeasurable', 'duplicate', 'duplicate_id', 'no_edge_case', 'empty_description'] as const;

// ─── Phân tích xác định ───────────────────────────────────────────

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

function tokens(s: string): string[] {
  return norm(s).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 2);
}
export function jaccard(a: string, b: string): number {
  const A = new Set(tokens(a));
  const B = new Set(tokens(b));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

/** Thay MỘT cụm trong câu (giữ chữ hoa đầu câu nếu cụm đứng đầu). */
function substitute(sentence: string, hit: VagueHit, replacement: string): string {
  const before = sentence.slice(0, hit.index);
  const after = sentence.slice(hit.index + hit.length);
  const rep = hit.index === 0 ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
  return `${before}${rep}${after}`.replace(/\s{2,}/g, ' ');
}

export interface AnalyzeInput {
  scope: 'PAGE' | 'ISSUES';
  items: SpecItem[];
  /** Trang: tiêu đề các mục (kiểm mục chuẩn SRS). */
  headings?: string[];
  pageNumber?: number;
  /** Dự án có quản lý test (loại thẻ TEST) không. */
  testingEnabled: boolean;
  /** CTW-12: loại trang (PAGE) — chọn khung mục + luật trang. Không truyền ⇒ SRS (hành vi cũ, cho lời gọi cũ). */
  docKind?: DocKind;
  /** Luật dự án đã tắt (spec-settings). */
  disabledRules?: string[];
}

export interface AnalyzeResult { findings: Finding[]; untraced: UntracedItem[]; stats: Omit<ReviewStats, 'verifiabilityRules'> }

const targetOf = (input: AnalyzeInput, it: SpecItem): FindingTarget | null => (
  it.kind === 'ISSUE' ? { kind: 'ISSUE', issueNumber: it.issueNumber }
    : input.pageNumber ? { kind: 'PAGE', pageNumber: input.pageNumber, blockIndex: it.blockIndex } : null
);

export function analyze(input: AnalyzeInput): AnalyzeResult {
  const out: Omit<Finding, 'id'>[] = [];
  const push = (f: Omit<Finding, 'id' | 'source' | 'status'>) => out.push({ ...f, source: 'rule', status: 'open' });
  const { items } = input;

  if (!items.length) {
    push({
      dimension: 'completeness', severity: 'high', rule: 'no_requirements', ref: input.scope === 'PAGE' ? 'Document' : 'Scope', excerpt: '',
      why: input.scope === 'PAGE'
        ? 'No requirement statements were found (sentences with "shall/must/phải…", an ID like FR-01, or text under a requirements heading).'
        : 'There are no Requirement or Story issues in this scope.',
      suggestion: input.scope === 'PAGE' ? 'Write each requirement as one sentence: "FR-01 The system shall …".' : 'Create Requirement/Story issues, or pick a wider scope.',
      rewrite: null, target: input.pageNumber ? { kind: 'PAGE', pageNumber: input.pageNumber } : null,
    });
  }

  for (const it of items) {
    const tgt = targetOf(input, it);
    const sentences = it.kind === 'STATEMENT' ? [it.text] : splitSentences(`${it.title ?? ''}\n${it.text}`);
    // ── Từ mơ hồ / chỗ trống ──
    for (const s of sentences) {
      for (const h of findVagueTerms(s)) {
        const rewritable = !!h.term.replace && s.length <= 400 && it.kind === 'STATEMENT';
        const issueRewritable = !!h.term.replace && s.length <= 400 && it.kind === 'ISSUE';
        push({
          dimension: h.term.dimension, severity: h.term.severity, rule: h.term.rule, ref: it.ref, excerpt: clip(s, 400),
          why: `"${h.match}" — ${h.term.hint}`,
          suggestion: h.term.replace
            ? `Replace "${h.match}" with something a tester can check, e.g. "${h.term.replace}" — adjust the number to the real target.`
            : h.term.rule === 'placeholder' ? 'Finish this requirement or move it to "Open questions" with an owner and a date.'
              : 'Say exactly what is meant (a number, a list, or a condition).',
          rewrite: rewritable || issueRewritable ? substitute(s, h, h.term.replace!) : null,
          target: tgt,
        });
      }
      // ── Không đo được ──
      if (mentionsQuality(s) && !isMeasurable(s)) {
        push({
          dimension: 'verifiability', severity: 'medium', rule: 'unmeasurable', ref: it.ref, excerpt: clip(s, 400),
          why: 'Talks about a quality (speed, security, availability…) but gives no number, so no test can pass or fail it.',
          suggestion: 'Add a measurable target with a unit and condition, e.g. "p95 response time ≤ 2 s with 100 concurrent users".',
          rewrite: null, target: tgt,
        });
      }
    }
    // ── Thẻ: mô tả rỗng · thiếu AC · thiếu edge case ──
    if (it.kind === 'ISSUE') {
      if (!it.text.trim()) {
        push({
          dimension: 'completeness', severity: 'high', rule: 'empty_description', ref: it.ref, excerpt: clip(it.title ?? '', 200),
          why: 'The issue has a title but no description — the requirement lives only in someone’s head.',
          suggestion: 'Describe who needs what and why, then add acceptance criteria.', rewrite: null, target: tgt,
        });
      }
      if (!it.hasAcceptanceCriteria) {
        push({
          dimension: 'verifiability', severity: 'high', rule: 'missing_ac', ref: it.ref, excerpt: clip(it.title ?? it.text, 200),
          why: 'No acceptance criteria: nobody can say when this is done.',
          suggestion: 'Add an "Acceptance criteria" section with at least one happy path and the failure cases (Given/When/Then or Happy:/Unhappy: lines).',
          rewrite: [
            'Happy: Given <a valid starting state>, when <the user does the action>, then <the expected visible result>.',
            'Unhappy: Given <invalid or missing input>, when <the user does the action>, then <the error shown and nothing is saved>.',
          ].join('\n'),
          target: tgt,
        });
      } else if (!it.hasEdgeCase) {
        push({
          dimension: 'completeness', severity: 'medium', rule: 'no_edge_case', ref: it.ref, excerpt: clip(it.title ?? it.text, 200),
          why: 'Acceptance criteria only describe the happy path — no failure mode or edge case (invalid input, timeout, empty list, permission denied…).',
          suggestion: 'Add at least one "Unhappy:" criterion for invalid input and one for an external failure.',
          rewrite: null, target: tgt,
        });
      }
      if (it.testCount === 0 && input.testingEnabled) {
        push({
          dimension: 'verifiability', severity: 'medium', rule: 'no_test', ref: it.ref, excerpt: clip(it.title ?? '', 200),
          why: 'No test case is linked to this requirement (traceability matrix: Not covered).',
          suggestion: 'Create a test case for it (Tests → New test, or the AI "Generate tests") and link it with "tests".',
          rewrite: null, target: tgt,
        });
      }
    }
  }

  // ── Trùng / mã định nghĩa hai lần ──
  const seenLabels = new Map<string, SpecItem>();
  for (const it of items) {
    if (it.kind !== 'STATEMENT' || !it.label) continue;
    const prev = seenLabels.get(it.label);
    if (prev && prev.blockIndex !== it.blockIndex) {
      push({
        dimension: 'consistency', severity: 'high', rule: 'duplicate_id', ref: it.ref, excerpt: clip(it.text, 300),
        why: `${it.label} is defined twice (also: "${clip(prev.text, 120)}").`,
        suggestion: 'Give each requirement a unique ID; merge or renumber the second one.', rewrite: null, target: targetOf(input, it),
      });
    } else if (!prev) seenLabels.set(it.label, it);
  }
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length && j < i + 400; j++) {
      const a = items[i];
      const b = items[j];
      if (a.label && b.label && a.label === b.label) continue; // đã báo duplicate_id
      const ta = a.kind === 'ISSUE' ? (a.title ?? '') : a.text;
      const tb = b.kind === 'ISSUE' ? (b.title ?? '') : b.text;
      if (tokens(ta).length < 3 || tokens(tb).length < 3) continue;
      const sim = jaccard(ta, tb);
      if (sim >= 0.85) {
        push({
          dimension: 'consistency', severity: sim === 1 ? 'high' : 'medium', rule: 'duplicate', ref: b.ref, excerpt: clip(tb, 300),
          why: `Looks like a duplicate of ${a.ref} ("${clip(ta, 100)}") — ${Math.round(sim * 100)}% the same words. Two copies drift apart and contradict each other later.`,
          suggestion: `Merge it into ${a.ref}, or say how the two differ.`, rewrite: null, target: targetOf(input, b),
        });
      }
    }
  }

  // ── Trang: mục chuẩn theo LOẠI trang (CTW-12) · không có failure mode · AC tổng (hai luật sau chỉ cho SRS) ──
  const kind: DocKind = input.docKind ?? 'SRS';
  if (input.scope === 'PAGE' && items.length) {
    const hs = (input.headings ?? []).map(norm);
    for (const sec of sectionsFor(kind)) {
      if (hs.some((h) => sec.re.test(h))) continue;
      push({
        dimension: 'completeness', severity: sec.severity, rule: 'missing_section', ref: 'Document', excerpt: '',
        why: `No "${sec.label}" section (${DOC_KIND_STANDARD[kind]}).`,
        suggestion: `Add a "${sec.label}" heading, even if it only says "None" — then the gap is a decision, not an omission.`,
        rewrite: null, target: input.pageNumber ? { kind: 'PAGE', pageNumber: input.pageNumber } : null,
      });
    }
    if (kind === 'SRS' && !items.some((it) => it.hasEdgeCase)) {
      push({
        dimension: 'completeness', severity: 'high', rule: 'no_failure_modes', ref: 'Document', excerpt: '',
        why: 'No requirement says what happens on errors, invalid input, timeouts or limits — only the happy path is specified.',
        suggestion: 'For each main flow add the failure behaviour: "If the payment gateway does not answer within 30 s, the system shall …".',
        rewrite: null, target: input.pageNumber ? { kind: 'PAGE', pageNumber: input.pageNumber } : null,
      });
    }
    const noAc = items.filter((it) => !it.hasAcceptanceCriteria);
    if (kind === 'SRS' && noAc.length) {
      push({
        dimension: 'verifiability', severity: noAc.length / items.length > 0.5 ? 'high' : 'medium', rule: 'missing_ac', ref: 'Document',
        excerpt: noAc.slice(0, 6).map((it) => it.ref).join(', ') + (noAc.length > 6 ? ` +${noAc.length - 6} more` : ''),
        why: `${noAc.length} of ${items.length} requirement statements have no pass/fail criterion (no number, no Given/When/Then, no linked issue with acceptance criteria).`,
        suggestion: 'Add an "Acceptance criteria" section that names each requirement ID, or make each statement measurable.',
        rewrite: null, target: input.pageNumber ? { kind: 'PAGE', pageNumber: input.pageNumber } : null,
      });
    }
  }

  const withAc = items.filter((it) => it.hasAcceptanceCriteria).length;
  const withTests = items.filter((it) => it.testCount > 0).length;
  const measurable = items.filter((it) => isMeasurable(it.text)).length;
  const untraced: UntracedItem[] = items
    .filter((it) => it.testCount === 0)
    .slice(0, 200)
    .map((it) => ({ ref: it.ref, title: clip(it.kind === 'ISSUE' ? (it.title ?? '') : it.text, 200), hasAcceptanceCriteria: it.hasAcceptanceCriteria, target: targetOf(input, it) }));

  const off = new Set(input.disabledRules ?? []);
  return {
    findings: out.filter((f) => !off.has(f.rule)).map((f, i) => ({ ...f, id: `r${i + 1}` })),
    untraced,
    stats: {
      items: items.length, withAcceptanceCriteria: withAc, withTests, measurable,
      acPct: items.length ? Math.round((withAc / items.length) * 100) : 0,
      testPct: items.length ? Math.round((withTests / items.length) * 100) : 0,
      testingEnabled: input.testingEnabled,
    },
  };
}

// ─── Điểm ─────────────────────────────────────────────────────────

export const PENALTY: Record<Severity, number> = { high: 15, medium: 8, low: 3 };
/** Điểm trừ từ nhận xét AI bị chặn trần mỗi chiều — model không thể một mình kéo điểm về 0. */
export const AI_PENALTY_CAP = 40;
/** Luật đã có phần ĐỊNH LƯỢNG riêng trong verifiability (acPct/testPct) ⇒ không trừ thêm lần nữa. */
const QUANTIFIED_RULES = new Set(['missing_ac', 'no_test']);

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/**
 * Điểm 0–100 mỗi chiều. Điểm trừ mỗi phát hiện (cao 15 · vừa 8 · thấp 3) nhân hệ số cỡ `10 / max(10, N)` (N = số yêu
 * cầu) ⇒ đặc tả 50 yêu cầu có 5 lỗi không bị chấm như đặc tả 5 yêu cầu có 5 lỗi. Phát hiện đã ÁP DỤNG / BỎ QUA không trừ.
 * verifiability = 40% tỷ lệ có acceptance criteria + 30% tỷ lệ có test liên kết + 30% phần luật (câu đo được…).
 * overall = trung bình 4 chiều. Không có yêu cầu nào ⇒ mọi chiều 0.
 */
export function computeScores(findings: Finding[], stats: Pick<ReviewStats, 'items' | 'acPct' | 'testPct'>): Scores & { verifiabilityRules: number } {
  if (!stats.items) return { completeness: 0, consistency: 0, unambiguity: 0, verifiability: 0, overall: 0, verifiabilityRules: 0 };
  const k = 10 / Math.max(10, stats.items);
  const pen: Record<Dimension, { rule: number; ai: number }> = {
    completeness: { rule: 0, ai: 0 }, consistency: { rule: 0, ai: 0 }, unambiguity: { rule: 0, ai: 0 }, verifiability: { rule: 0, ai: 0 },
  };
  for (const f of findings) {
    if (f.status !== 'open') continue;
    if (f.dimension === 'verifiability' && QUANTIFIED_RULES.has(f.rule)) continue;
    pen[f.dimension][f.source === 'ai' ? 'ai' : 'rule'] += PENALTY[f.severity] * k;
  }
  const dim = (d: Dimension) => clamp(100 - pen[d].rule - Math.min(AI_PENALTY_CAP, pen[d].ai));
  const vRules = dim('verifiability');
  const verifiability = clamp(0.4 * stats.acPct + 0.3 * stats.testPct + 0.3 * vRules);
  const s = { completeness: dim('completeness'), consistency: dim('consistency'), unambiguity: dim('unambiguity'), verifiability };
  return { ...s, overall: clamp((s.completeness + s.consistency + s.unambiguity + s.verifiability) / 4), verifiabilityRules: vRules };
}

// ─── Cổng "Spec Fidelity gate" ────────────────────────────────────

export interface SpecGateConfig {
  enabled: boolean;
  /** Giai đoạn áp cổng. Rỗng ⇒ giai đoạn có slug `dac-ta-yeu-cau` (quy trình nhận dự án). */
  stageIds: number[];
  minOverall: number;
  minDimension: number;
}
export const DEFAULT_GATE: SpecGateConfig = { enabled: false, stageIds: [], minOverall: 70, minDimension: 50 };
export const DEFAULT_GATE_STAGE_SLUG = 'dac-ta-yeu-cau';

export function specGateOf(settings: unknown): SpecGateConfig {
  const g = ((settings ?? {}) as { specGate?: Record<string, unknown> }).specGate ?? {};
  const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.min(100, Math.round(v))) : d);
  return {
    enabled: g.enabled === true,
    stageIds: Array.isArray(g.stageIds) ? [...new Set(g.stageIds.filter((x): x is number => Number.isInteger(x) && x > 0))] : [],
    minOverall: num(g.minOverall, DEFAULT_GATE.minOverall),
    minDimension: num(g.minDimension, DEFAULT_GATE.minDimension),
  };
}

/** Cổng có áp cho giai đoạn này không. */
export function gateAppliesTo(cfg: SpecGateConfig, stage: { id: number; slug: string }): boolean {
  if (!cfg.enabled) return false;
  return cfg.stageIds.length ? cfg.stageIds.includes(stage.id) : stage.slug === DEFAULT_GATE_STAGE_SLUG;
}

export interface GateVerdict { pass: boolean; reasons: string[] }

/** Lần chấm có qua ngưỡng không. Chưa chấm ⇒ trượt với lý do "not run". */
export function evaluateGate(scores: Scores | null, cfg: Pick<SpecGateConfig, 'minOverall' | 'minDimension'>): GateVerdict {
  if (!scores) return { pass: false, reasons: ['Spec Fidelity has not been checked for this stage yet'] };
  const reasons: string[] = [];
  if (scores.overall < cfg.minOverall) reasons.push(`Overall ${scores.overall} is below ${cfg.minOverall}`);
  for (const d of DIMENSIONS) if (scores[d] < cfg.minDimension) reasons.push(`${d[0].toUpperCase()}${d.slice(1)} ${scores[d]} is below ${cfg.minDimension}`);
  return { pass: reasons.length === 0, reasons };
}

// ─── Nguồn gốc AI ─────────────────────────────────────────────────

export interface AiReviewRule { requireIndependentReviewer: boolean }
export function aiReviewRuleOf(settings: unknown): AiReviewRule {
  const r = ((settings ?? {}) as { aiReview?: { requireIndependentReviewer?: unknown } }).aiReview;
  return { requireIndependentReviewer: r?.requireIndependentReviewer === true };
}

const AI_NAME = /(claude|anthropic|openai|chatgpt|gpt-?\d|codex|copilot|gemini|bard|cursor|devin|llama|mistral|qwen|deepseek|grok|aider|windsurf|codeium|tabnine|codewhisperer|amazon\s*q|jules|cody)/i;

/** Model AI trong trailer `Co-Authored-By: <tên> <email>` của commit/PR. Không có ⇒ null. */
export function aiCoAuthorIn(text: string | null | undefined): string | null {
  if (!text) return null;
  for (const m of text.matchAll(/^[ \t>]*co-authored-by:\s*([^<\n]+?)\s*<([^>\n]*)>/gim)) {
    const name = m[1].trim();
    if (AI_NAME.test(name) || AI_NAME.test(m[2]) || /noreply@anthropic\.com/i.test(m[2])) return name.slice(0, 120);
  }
  return null;
}

/**
 * Luật "AI-assisted work needs an independent reviewer": có ít nhất MỘT phê duyệt ISSUE đã APPROVED, chữ ký còn khớp
 * nội dung hiện tại, và trong đó có một bước APPROVED của người KHÔNG phải người tạo thẻ / người áp dụng đề xuất AI.
 */
export function independentApprovalOk(
  approvals: Array<{ signedHash: string | null; steps: Array<{ approverId: number; decision: string }> }>,
  currentHash: string | null,
  excludedUserIds: Array<number | null | undefined>,
): boolean {
  const excluded = new Set(excludedUserIds.filter((x): x is number => typeof x === 'number'));
  return approvals.some((a) => a.signedHash !== null && a.signedHash === currentHash
    && a.steps.some((s) => s.decision === 'APPROVED' && !excluded.has(s.approverId)));
}

// ─── Áp dụng gợi ý vào tài liệu ───────────────────────────────────

/**
 * Thay `find` bằng `replacement` trong khối chữ ĐẦU TIÊN chứa nó (đoạn / ô bảng). Khối đó mất định dạng chữ (đậm,
 * nghiêng) — chấp nhận được với câu yêu cầu; các khối khác giữ nguyên. Không thấy ⇒ found=false.
 */
export function replaceTextInDoc(doc: unknown, find: string, replacement: string): { doc: PmNodeLite; found: boolean } {
  const target = norm(find).trim();
  let found = false;
  const visit = (n: PmNodeLite): PmNodeLite => {
    if (found || !n || typeof n !== 'object') return n;
    if (n.type === 'paragraph') {
      const text = norm(inlineText(n));
      const at = text.indexOf(target);
      if (at >= 0) {
        found = true;
        const next = text.slice(0, at) + replacement + text.slice(at + target.length);
        return { ...n, content: next ? [{ type: 'text', text: next }] : [] };
      }
      return n;
    }
    if (Array.isArray(n.content)) return { ...n, content: n.content.map(visit) };
    return n;
  };
  const out = visit((doc && typeof doc === 'object' ? doc : { type: 'doc', content: [] }) as PmNodeLite);
  return { doc: out, found };
}

/** Thêm khối "Acceptance criteria" (tiêu đề + danh sách) vào cuối mô tả thẻ. */
export function appendAcceptanceCriteria(doc: unknown, lines: string[]): PmNodeLite {
  const base = (doc && typeof doc === 'object' && (doc as PmNodeLite).type === 'doc' ? doc : { type: 'doc', content: [] }) as PmNodeLite;
  const content = [...(base.content ?? [])];
  content.push({ type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Acceptance criteria' }] });
  content.push({
    type: 'bulletList',
    content: lines.map((l) => l.trim()).filter(Boolean).map((l) => ({ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: l }] }] })),
  });
  return { ...base, type: 'doc', content };
}

// ─── Nhận xét ngữ nghĩa của LLM ───────────────────────────────────

export interface AiFindingRaw { dimension?: unknown; severity?: unknown; ref?: unknown; excerpt?: unknown; why?: unknown; suggestion?: unknown; rewrite?: unknown }

/**
 * Lọc nhận xét của model: chiều hợp lệ (không nhận "verifiability" — phần đó là dữ liệu), `ref` phải là một yêu cầu
 * CÓ THẬT, `excerpt` phải nằm NGUYÊN VĂN trong chữ của yêu cầu đó (không thì bỏ — chống bịa trích dẫn). Tối đa 25.
 */
export function sanitizeAiFindings(raw: unknown, items: SpecItem[], input: Pick<AnalyzeInput, 'pageNumber'>): Finding[] {
  if (!Array.isArray(raw)) return [];
  const byRef = new Map(items.map((it) => [it.ref.toUpperCase(), it]));
  const out: Finding[] = [];
  for (const r of raw.slice(0, 40) as AiFindingRaw[]) {
    if (!r || typeof r !== 'object') continue;
    const dimension = String(r.dimension ?? '').toLowerCase();
    if (!['completeness', 'consistency', 'unambiguity'].includes(dimension)) continue;
    const severity = (['high', 'medium', 'low'].includes(String(r.severity)) ? String(r.severity) : 'medium') as Severity;
    const it = byRef.get(String(r.ref ?? '').trim().toUpperCase());
    if (!it) continue;
    const hay = norm(it.kind === 'ISSUE' ? `${it.title ?? ''}\n${it.text}` : it.text);
    let excerpt = typeof r.excerpt === 'string' ? norm(r.excerpt).trim() : '';
    if (excerpt && !hay.includes(excerpt)) continue;
    if (!excerpt) excerpt = clip(it.kind === 'ISSUE' ? (it.title ?? it.text) : it.text, 300);
    const why = typeof r.why === 'string' ? r.why.trim().slice(0, 500) : '';
    if (!why) continue;
    const rewrite = typeof r.rewrite === 'string' && r.rewrite.trim() && excerpt.length <= 400 ? r.rewrite.trim().slice(0, 1200) : null;
    out.push({
      id: `a${out.length + 1}`, dimension: dimension as Dimension, severity, rule: `ai_${dimension}`, ref: it.ref, excerpt: clip(excerpt, 400),
      why, suggestion: typeof r.suggestion === 'string' ? r.suggestion.trim().slice(0, 500) : 'Rewrite this requirement so it has one reading.',
      rewrite, target: it.kind === 'ISSUE' ? { kind: 'ISSUE', issueNumber: it.issueNumber } : input.pageNumber ? { kind: 'PAGE', pageNumber: input.pageNumber, blockIndex: it.blockIndex } : null,
      source: 'ai', status: 'open',
    });
    if (out.length >= 25) break;
  }
  return out;
}
