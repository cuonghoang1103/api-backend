/**
 * Công thức cho cột FORMULA của database Notes — cú pháp kiểu Notion.
 *
 *   if(prop("Trạng thái") == "Xong", "✅ Xong", "⏳ Đang xử lý")
 *   dateBetween(prop("Hạn"), now(), "days")
 *   round(prop("Đã làm") / prop("Tổng") * 100)
 *
 * ─── TUYỆT ĐỐI KHÔNG dùng `eval` hay `new Function` ───
 * Cám dỗ là đổi `prop("x")` thành biến rồi ném cả chuỗi cho `new Function`.
 * Làm thế là cho phép BẤT KỲ ai có quyền sửa một bảng chạy mã tuỳ ý trên máy
 * chủ: `process.env`, `require('fs')`, gọi mạng ra ngoài — toàn bộ tiến trình
 * backend nằm trong tay họ. Và bảng thì CHIA SẺ ĐƯỢC, nên "người có quyền
 * sửa" không nhất thiết là chủ tài khoản.
 *
 * Vì thế ở đây có một trình phân tích riêng: chỉ hiểu đúng những gì được liệt
 * kê, và mọi thứ khác là lỗi cú pháp.
 *
 * ─── Ngôn ngữ này KHÔNG có vòng lặp và KHÔNG có hàm tự định nghĩa ───
 * Nên không thể viết ra một công thức chạy mãi. Cái duy nhất cần chặn là biểu
 * thức lồng quá sâu làm tràn ngăn xếp, và chuỗi quá dài — cả hai đều có trần
 * ở dưới.
 */

// ─── Giới hạn ──────────────────────────────────────────────────

const MAX_LENGTH = 1000;
const MAX_DEPTH = 40;
/** Trần độ dài chuỗi kết quả — `concat` lồng nhau có thể phình theo cấp số nhân. */
const MAX_STRING = 5000;

export class FormulaError extends Error {}

// ─── Giá trị ───────────────────────────────────────────────────

export type FormulaValue = number | string | boolean | Date | null;

// ─── Tách từ ───────────────────────────────────────────────────

type TokenType = 'num' | 'str' | 'ident' | 'op' | 'lparen' | 'rparen' | 'comma' | 'end';
interface Token { type: TokenType; value: string }

const OPERATORS = ['==', '!=', '<=', '>=', '&&', '||', '<', '>', '+', '-', '*', '/', '%'];

function tokenize(input: string): Token[] {
  if (input.length > MAX_LENGTH) throw new FormulaError(`Công thức quá dài (tối đa ${MAX_LENGTH} ký tự)`);
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i]!;
    if (/\s/.test(ch)) { i += 1; continue; }

    if (ch === '(') { tokens.push({ type: 'lparen', value: ch }); i += 1; continue; }
    if (ch === ')') { tokens.push({ type: 'rparen', value: ch }); i += 1; continue; }
    if (ch === ',') { tokens.push({ type: 'comma', value: ch }); i += 1; continue; }

    // Chuỗi: nháy kép hoặc nháy đơn, có thoát bằng \
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let value = '';
      i += 1;
      while (i < input.length && input[i] !== quote) {
        if (input[i] === '\\' && i + 1 < input.length) { value += input[i + 1]; i += 2; }
        else { value += input[i]; i += 1; }
      }
      if (i >= input.length) throw new FormulaError('Chuỗi chưa đóng nháy');
      i += 1;
      tokens.push({ type: 'str', value });
      continue;
    }

    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(input[i + 1] ?? ''))) {
      let value = '';
      while (i < input.length && /[0-9.]/.test(input[i]!)) { value += input[i]; i += 1; }
      if ((value.match(/\./g) ?? []).length > 1) throw new FormulaError(`Số không hợp lệ: ${value}`);
      tokens.push({ type: 'num', value });
      continue;
    }

    // Tên hàm / từ khoá. Cho phép chữ cái Unicode để viết được `prop` lẫn tên
    // tiếng Việt nếu sau này mở rộng.
    if (/[A-Za-z_À-ɏḀ-ỿ]/.test(ch)) {
      let value = '';
      while (i < input.length && /[A-Za-z0-9_À-ɏḀ-ỿ]/.test(input[i]!)) { value += input[i]; i += 1; }
      tokens.push({ type: 'ident', value });
      continue;
    }

    const op = OPERATORS.find((o) => input.startsWith(o, i));
    if (op) { tokens.push({ type: 'op', value: op }); i += op.length; continue; }

    throw new FormulaError(`Ký tự không hiểu: "${ch}"`);
  }

  tokens.push({ type: 'end', value: '' });
  return tokens;
}

// ─── Cây cú pháp ───────────────────────────────────────────────

type Node =
  | { kind: 'literal'; value: FormulaValue }
  | { kind: 'call'; name: string; args: Node[] }
  | { kind: 'binary'; op: string; left: Node; right: Node }
  | { kind: 'unary'; op: string; operand: Node };

function parse(tokens: Token[]): Node {
  let pos = 0;
  let depth = 0;

  const peek = () => tokens[pos]!;
  const eat = (type: TokenType, value?: string) => {
    const token = peek();
    if (token.type !== type || (value !== undefined && token.value !== value)) {
      throw new FormulaError(`Mong đợi ${value ?? type} nhưng gặp "${token.value || 'hết công thức'}"`);
    }
    pos += 1;
    return token;
  };

  const guard = <T>(fn: () => T): T => {
    depth += 1;
    if (depth > MAX_DEPTH) throw new FormulaError('Công thức lồng quá sâu');
    try { return fn(); } finally { depth -= 1; }
  };

  /** Toán tử nhị phân theo thứ tự ưu tiên TĂNG DẦN. */
  const LEVELS = [
    ['||'],
    ['&&'],
    ['==', '!=', '<', '>', '<=', '>='],
    ['+', '-'],
    ['*', '/', '%'],
  ];

  const parseBinary = (level: number): Node => guard(() => {
    if (level >= LEVELS.length) return parseUnary();
    let left = parseBinary(level + 1);
    while (peek().type === 'op' && LEVELS[level]!.includes(peek().value)) {
      const op = eat('op').value;
      const right = parseBinary(level + 1);
      left = { kind: 'binary', op, left, right };
    }
    return left;
  });

  const parseUnary = (): Node => guard(() => {
    if (peek().type === 'op' && (peek().value === '-' || peek().value === '+')) {
      const op = eat('op').value;
      return { kind: 'unary', op, operand: parseUnary() };
    }
    if (peek().type === 'ident' && peek().value.toLowerCase() === 'not') {
      eat('ident');
      return { kind: 'unary', op: 'not', operand: parseUnary() };
    }
    return parsePrimary();
  });

  const parsePrimary = (): Node => guard(() => {
    const token = peek();

    if (token.type === 'num') { eat('num'); return { kind: 'literal', value: Number(token.value) }; }
    if (token.type === 'str') { eat('str'); return { kind: 'literal', value: token.value }; }

    if (token.type === 'lparen') {
      eat('lparen');
      const inner = parseBinary(0);
      eat('rparen');
      return inner;
    }

    if (token.type === 'ident') {
      eat('ident');
      const lower = token.value.toLowerCase();
      if (lower === 'true') return { kind: 'literal', value: true };
      if (lower === 'false') return { kind: 'literal', value: false };
      // `and` / `or` viết dạng chữ: đổi thành toán tử tương ứng ở tầng trên.
      // Ở đây chúng chỉ hợp lệ khi đứng làm tên hàm — `and(a, b)`.
      if (peek().type !== 'lparen') {
        throw new FormulaError(`"${token.value}" phải đi kèm dấu ngoặc, ví dụ ${token.value}(...)`);
      }
      eat('lparen');
      const args: Node[] = [];
      if (peek().type !== 'rparen') {
        args.push(parseBinary(0));
        while (peek().type === 'comma') { eat('comma'); args.push(parseBinary(0)); }
      }
      eat('rparen');
      return { kind: 'call', name: lower, args };
    }

    throw new FormulaError(`Không hiểu "${token.value || 'hết công thức'}"`);
  });

  // `and` / `or` dạng chữ giữa hai biểu thức: xử lý bằng cách thay trước khi
  // tách từ (xem `normalizeWords`), nên tới đây chỉ còn `&&` / `||`.
  const result = parseBinary(0);
  if (peek().type !== 'end') throw new FormulaError(`Thừa nội dung sau công thức: "${peek().value}"`);
  return result;
}

/**
 * Đổi `and` / `or` viết dạng chữ thành `&&` / `||` khi chúng nằm GIỮA hai
 * biểu thức.
 *
 * Notion cho viết cả `a and b` lẫn `and(a, b)`. Xử lý ở tầng tách từ thì phải
 * nhìn trước nhìn sau để đoán, còn ở đây chỉ cần một luật: `and` theo sau bởi
 * dấu ngoặc mở là LỜI GỌI HÀM, còn lại là toán tử.
 */
function normalizeWords(input: string): string {
  return input.replace(/\b(and|or)\b(\s*)(\()?/gi, (match, word: string, space: string, paren?: string) => {
    if (paren) return match;                       // and( … ) — giữ nguyên
    return (word.toLowerCase() === 'and' ? '&&' : '||') + space;
  });
}

// ─── Ép kiểu ───────────────────────────────────────────────────

function toNumber(value: FormulaValue): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (value instanceof Date) return value.getTime();
  if (value === null) return 0;
  const n = Number(String(value).replace(/\s/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : Number.NaN;
}

function toText(value: FormulaValue): string {
  if (value === null) return '';
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

function toBool(value: FormulaValue): boolean {
  if (typeof value === 'boolean') return value;
  if (value === null) return false;
  if (typeof value === 'number') return value !== 0;
  if (value instanceof Date) return true;
  return value !== '';
}

function toDate(value: FormulaValue): Date | null {
  if (value instanceof Date) return value;
  if (value === null || value === '') return null;
  const d = new Date(typeof value === 'number' ? value : String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

// ─── Tính ──────────────────────────────────────────────────────

export interface FormulaContext {
  /** Giá trị của một cột trong dòng đang tính, tra theo TÊN cột. */
  prop: (name: string) => FormulaValue;
  /** Thời điểm coi là "bây giờ" — truyền vào để kiểm được kết quả. */
  now: Date;
}

const DAY_MS = 86_400_000;

function evaluate(node: Node, ctx: FormulaContext, depth = 0): FormulaValue {
  if (depth > MAX_DEPTH) throw new FormulaError('Công thức lồng quá sâu');
  const ev = (n: Node) => evaluate(n, ctx, depth + 1);

  switch (node.kind) {
    case 'literal':
      return node.value;

    case 'unary': {
      if (node.op === 'not') return !toBool(ev(node.operand));
      const n = toNumber(ev(node.operand));
      return node.op === '-' ? -n : n;
    }

    case 'binary': {
      const { op } = node;
      // `&&` và `||` tính NGẮN MẠCH: `prop("a") != "" and 10 / prop("a") > 1`
      // không được chia cho 0 khi vế trái đã sai.
      if (op === '&&') return toBool(ev(node.left)) ? toBool(ev(node.right)) : false;
      if (op === '||') return toBool(ev(node.left)) ? true : toBool(ev(node.right));

      const left = ev(node.left);
      const right = ev(node.right);

      if (op === '==' || op === '!=') {
        // So sánh theo CHUỖI khi cả hai không phải số: "Xong" == "Xong" phải
        // đúng, mà ép sang số thì cả hai thành NaN và NaN != NaN.
        const bothNumeric = Number.isFinite(toNumber(left)) && Number.isFinite(toNumber(right))
          && !(typeof left === 'string' && left !== '' && !Number.isFinite(Number(left)))
          && !(typeof right === 'string' && right !== '' && !Number.isFinite(Number(right)));
        const same = bothNumeric ? toNumber(left) === toNumber(right) : toText(left) === toText(right);
        return op === '==' ? same : !same;
      }

      if (op === '+') {
        // `+` là CỘNG SỐ trừ khi có vế là chuỗi không phải số — lúc đó nối
        // chuỗi, giống hành vi người dùng mong đợi từ bảng tính.
        const leftIsText = typeof left === 'string' && !Number.isFinite(Number(left));
        const rightIsText = typeof right === 'string' && !Number.isFinite(Number(right));
        if (leftIsText || rightIsText) {
          const joined = toText(left) + toText(right);
          if (joined.length > MAX_STRING) throw new FormulaError('Kết quả chuỗi quá dài');
          return joined;
        }
      }

      const a = toNumber(left);
      const b = toNumber(right);
      switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        // Chia cho 0 trả null chứ KHÔNG trả Infinity: Infinity hiện ra ô là
        // "∞" và mọi phép tính sau đó cũng thành Infinity, lan ra cả cột.
        case '/': return b === 0 ? null : a / b;
        case '%': return b === 0 ? null : a % b;
        case '<': return a < b;
        case '>': return a > b;
        case '<=': return a <= b;
        case '>=': return a >= b;
        default: throw new FormulaError(`Toán tử không hỗ trợ: ${op}`);
      }
    }

    case 'call': {
      const { name, args } = node;
      const arg = (i: number) => (args[i] === undefined ? null : ev(args[i]!));
      const need = (n: number) => {
        if (args.length < n) throw new FormulaError(`${name}() cần ít nhất ${n} tham số`);
      };

      switch (name) {
        case 'prop': {
          need(1);
          const key = toText(arg(0));
          return ctx.prop(key);
        }
        case 'if': {
          need(3);
          // Chỉ tính nhánh ĐƯỢC CHỌN — nhánh kia có thể chia cho 0 hoặc gọi
          // prop() của cột không tồn tại, và người dùng không cần biết.
          return toBool(ev(args[0]!)) ? ev(args[1]!) : ev(args[2]!);
        }
        case 'and': need(2); return args.every((a) => toBool(ev(a)));
        case 'or': need(2); return args.some((a) => toBool(ev(a)));
        case 'not': need(1); return !toBool(arg(0));
        case 'empty': need(1); { const v = arg(0); return v === null || v === '' || (Array.isArray(v) && v.length === 0); }
        case 'concat': {
          const joined = args.map((a) => toText(ev(a))).join('');
          if (joined.length > MAX_STRING) throw new FormulaError('Kết quả chuỗi quá dài');
          return joined;
        }
        case 'length': need(1); return toText(arg(0)).length;
        case 'upper': need(1); return toText(arg(0)).toUpperCase();
        case 'lower': need(1); return toText(arg(0)).toLowerCase();
        case 'contains': need(2); return toText(arg(0)).toLowerCase().includes(toText(arg(1)).toLowerCase());
        case 'replace': need(3); return toText(arg(0)).split(toText(arg(1))).join(toText(arg(2)));
        case 'slice': {
          need(2);
          const text = toText(arg(0));
          const from = Math.trunc(toNumber(arg(1)));
          return args.length >= 3 ? text.slice(from, Math.trunc(toNumber(arg(2)))) : text.slice(from);
        }
        case 'tonumber': need(1); { const n = toNumber(arg(0)); return Number.isFinite(n) ? n : null; }
        case 'round': {
          need(1);
          const value = toNumber(arg(0));
          if (!Number.isFinite(value)) return null;
          const digits = args.length >= 2 ? Math.max(0, Math.min(10, Math.trunc(toNumber(arg(1))))) : 0;
          const factor = 10 ** digits;
          return Math.round(value * factor) / factor;
        }
        case 'floor': need(1); { const v = toNumber(arg(0)); return Number.isFinite(v) ? Math.floor(v) : null; }
        case 'ceil': need(1); { const v = toNumber(arg(0)); return Number.isFinite(v) ? Math.ceil(v) : null; }
        case 'abs': need(1); { const v = toNumber(arg(0)); return Number.isFinite(v) ? Math.abs(v) : null; }
        case 'min': { const ns = args.map((a) => toNumber(ev(a))).filter(Number.isFinite); return ns.length ? Math.min(...ns) : null; }
        case 'max': { const ns = args.map((a) => toNumber(ev(a))).filter(Number.isFinite); return ns.length ? Math.max(...ns) : null; }
        case 'now': return ctx.now;
        case 'today': { const d = new Date(ctx.now); d.setUTCHours(0, 0, 0, 0); return d; }
        case 'year': need(1); { const d = toDate(arg(0)); return d ? d.getUTCFullYear() : null; }
        case 'month': need(1); { const d = toDate(arg(0)); return d ? d.getUTCMonth() + 1 : null; }
        case 'day': need(1); { const d = toDate(arg(0)); return d ? d.getUTCDate() : null; }
        case 'datebetween': {
          need(2);
          const a = toDate(arg(0));
          const b = toDate(arg(1));
          if (!a || !b) return null;
          const unit = args.length >= 3 ? toText(arg(2)).toLowerCase() : 'days';
          // Tính theo NGÀY LỊCH, không theo số mili giây chia ra: hai mốc cách
          // nhau 23 giờ nhưng khác ngày phải ra 1, không phải 0.
          const dayA = Math.floor(a.getTime() / DAY_MS);
          const dayB = Math.floor(b.getTime() / DAY_MS);
          const days = dayB - dayA;
          if (unit === 'days') return days;
          if (unit === 'weeks') return Math.trunc(days / 7);
          if (unit === 'months') return (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
          if (unit === 'years') return b.getUTCFullYear() - a.getUTCFullYear();
          if (unit === 'hours') return Math.trunc((b.getTime() - a.getTime()) / 3_600_000);
          throw new FormulaError(`Đơn vị không hỗ trợ: ${unit}`);
        }
        case 'dateadd': {
          need(2);
          const d = toDate(arg(0));
          if (!d) return null;
          const amount = Math.trunc(toNumber(arg(1)));
          const unit = args.length >= 3 ? toText(arg(2)).toLowerCase() : 'days';
          const out = new Date(d.getTime());
          if (unit === 'days') out.setUTCDate(out.getUTCDate() + amount);
          else if (unit === 'weeks') out.setUTCDate(out.getUTCDate() + amount * 7);
          else if (unit === 'months') out.setUTCMonth(out.getUTCMonth() + amount);
          else if (unit === 'years') out.setUTCFullYear(out.getUTCFullYear() + amount);
          else throw new FormulaError(`Đơn vị không hỗ trợ: ${unit}`);
          return out;
        }
        case 'formatdate': {
          need(1);
          const d = toDate(arg(0));
          if (!d) return '';
          const pattern = args.length >= 2 ? toText(arg(1)) : 'DD/MM/YYYY';
          const pad = (n: number) => String(n).padStart(2, '0');
          return pattern
            .replace(/YYYY/g, String(d.getUTCFullYear()))
            .replace(/MM/g, pad(d.getUTCMonth() + 1))
            .replace(/DD/g, pad(d.getUTCDate()))
            .replace(/HH/g, pad(d.getUTCHours()))
            .replace(/mm/g, pad(d.getUTCMinutes()));
        }
        default:
          throw new FormulaError(`Hàm không tồn tại: ${name}()`);
      }
    }

    default:
      throw new FormulaError('Công thức không hợp lệ');
  }
}

// ─── Bề mặt công khai ──────────────────────────────────────────

/** Phân tích một lần, dùng lại cho mọi dòng. Ném `FormulaError` nếu sai cú pháp. */
export function compileFormula(expression: string): Node {
  return parse(tokenize(normalizeWords(expression)));
}

/** Chạy cây đã phân tích trên một dòng. */
export function runFormula(compiled: Node, ctx: FormulaContext): FormulaValue {
  const value = evaluate(compiled, ctx);
  if (typeof value === 'number' && !Number.isFinite(value)) return null;
  return value;
}

/**
 * Tính công thức cho MỘT dòng, từ chuỗi thô.
 *
 * Lỗi cú pháp trả về chuỗi bắt đầu bằng "⚠" chứ không ném lên: một công thức
 * gõ sai không được phép làm hỏng cả lượt đọc bảng, và người dùng cần THẤY
 * lỗi ngay trong ô để biết đường sửa.
 */
export function evaluateFormula(
  expression: string,
  ctx: FormulaContext,
): FormulaValue {
  try {
    return runFormula(compileFormula(expression), ctx);
  } catch (error) {
    return `⚠ ${error instanceof Error ? error.message : 'Công thức lỗi'}`;
  }
}

/** Kiểm cú pháp mà không cần dữ liệu — dùng cho ô nhập công thức ở giao diện. */
export function checkFormula(expression: string): { ok: true } | { ok: false; message: string } {
  try {
    compileFormula(expression);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Công thức lỗi' };
  }
}
