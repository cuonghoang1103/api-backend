/**
 * CT Work — trợ lý dự án, bản STREAM (20/10/2026): rút chuỗi `reply` ra khỏi JSON model đang viết dở.
 *
 * Model trả `{"reply":"<markdown>","actions":[…]}` (hoặc `{"reply":"","reads":[…]}` khi xin đọc). Để người dùng thấy chữ
 * chạy ngay thay vì nhìn màn hình trống tới khi model viết xong cả khối JSON, `ReplyStreamer` đọc từng mẩu văn bản thô
 * của luồng token và phát ra phần ĐÃ GIẢI MÃ của giá trị `reply` (cấp 1 của object ngoài cùng) ngay khi nó tới:
 *   - bỏ qua chữ/rào ```json trước dấu `{` đầu tiên;
 *   - giải mã escape JSON: \n \t \r \b \f \/ \\ \" và \uXXXX (kể cả cặp surrogate 😀) — escape bị cắt giữa hai
 *     mẩu thì chờ mẩu sau, không bao giờ phát nửa escape; nửa đầu cặp surrogate thô ở cuối mẩu cũng được giữ lại;
 *   - `reply` lồng sâu hơn (trong `actions`) không tính; khoá `reads` xuất hiện TRƯỚC `reply` ⇒ lượt này là lượt xin đọc,
 *     không phát gì.
 * Đây chỉ là bản NHÁP để hiển thị: câu trả lời chuẩn vẫn do `readModelOutput` đọc khi xong lượt, rồi `reconcileReply`
 * so với phần đã phát (thiếu đuôi ⇒ phát nốt; lệch ⇒ bảo client xoá nháp và nhận bản đầy đủ).
 */

const SIMPLE_ESCAPES: Record<string, string> = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', '/': '/', '\\': '\\', '"': '"' };

const isHigh = (c: number) => c >= 0xd800 && c <= 0xdbff;
const isLow = (c: number) => c >= 0xdc00 && c <= 0xdfff;

type State = 'seek' | 'obj' | 'reply' | 'end';

export class ReplyStreamer {
  private state: State = 'seek';
  private depth = 0;
  private inString = false;
  private escaped = false;
  /** Cấp 1: đang chờ một khoá (sau `{` hoặc `,`). */
  private expectKey = false;
  /** Cấp 1: đang đọc chuỗi khoá. */
  private readingKey = false;
  private key = '';
  /** Cấp 1: vừa qua `:` của khoá `key`, chờ ký tự đầu của giá trị. */
  private awaitValue = false;
  private replyStarted = false;
  private replyDone = false;
  private sawReadsFirst = false;
  /** Escape đang dở trong chuỗi reply (`\`, `\u12`…). */
  private esc = '';
  /** Nửa đầu cặp surrogate từ \uD83D chờ nửa sau. */
  private pendingHigh = '';
  /** Ký tự (thô) giữ lại vì là nửa đầu cặp surrogate ở cuối mẩu. */
  private heldRaw = '';
  private out = '';

  constructor(private readonly onDelta?: (text: string) => void) {}

  /** Phần reply đã phát ra (đã giải mã). */
  get emitted(): string { return this.out; }
  /** Model xin đọc trước khi viết reply ⇒ lượt này không phải câu trả lời. */
  get readsFirst(): boolean { return this.sawReadsFirst; }
  /** Chuỗi reply đã đóng (`"` kết thúc). */
  get complete(): boolean { return this.replyDone; }

  push(chunk: string): void {
    if (!chunk || this.state === 'end') return;
    let buf = '';
    for (let i = 0; i < chunk.length; i++) {
      const ch = chunk[i];
      const st = this.state as State; // objChar/replyChar đổi state giữa vòng — đừng để TS thu hẹp
      if (st === 'end') break;
      if (st === 'seek') {
        if (ch === '{') { this.state = 'obj'; this.depth = 1; this.expectKey = true; }
      } else if (st === 'reply') {
        buf += this.replyChar(ch);
      } else {
        this.objChar(ch);
      }
    }
    if (!buf) return;
    // Giữ nửa đầu cặp surrogate THÔ ở cuối mẩu (mẩu cắt giữa một emoji) — phát cùng nửa sau.
    const last = buf.charCodeAt(buf.length - 1);
    if (isHigh(last)) { this.heldRaw = buf.slice(-1); buf = buf.slice(0, -1); }
    if (!buf || this.sawReadsFirst) return;
    this.out += buf;
    this.onDelta?.(buf);
  }

  /** Một ký tự trong chuỗi reply ⇒ phần chữ đã giải mã (có thể rỗng khi đang chờ escape). */
  private replyChar(ch: string): string {
    let prefix = '';
    if (this.heldRaw) { prefix = this.heldRaw; this.heldRaw = ''; }
    if (this.esc) {
      this.esc += ch;
      if (this.esc.length === 2) {
        if (ch === 'u') return prefix;
        const s = SIMPLE_ESCAPES[ch];
        this.esc = '';
        return prefix + this.flushHigh() + (s ?? ch);
      }
      if (this.esc.length < 6) {
        if (!/[0-9a-fA-F]/.test(ch)) { const bad = this.esc; this.esc = ''; return prefix + this.flushHigh() + bad; }
        return prefix;
      }
      const code = parseInt(this.esc.slice(2), 16);
      this.esc = '';
      if (Number.isNaN(code)) return prefix;
      const c = String.fromCharCode(code);
      if (isHigh(code)) { const before = this.flushHigh(); this.pendingHigh = c; return prefix + before; }
      if (isLow(code) && this.pendingHigh) { const pair = this.pendingHigh + c; this.pendingHigh = ''; return prefix + pair; }
      return prefix + this.flushHigh() + c;
    }
    if (ch === '\\') { this.esc = '\\'; return prefix; }
    if (ch === '"') {
      this.state = 'obj';
      this.replyDone = true;
      return prefix + this.flushHigh();
    }
    return prefix + this.flushHigh() + ch;
  }

  /** \uD83D không có nửa sau ⇒ bỏ (một nửa surrogate lẻ không hiển thị được). */
  private flushHigh(): string {
    this.pendingHigh = '';
    return '';
  }

  private objChar(ch: string): void {
    if (this.inString) {
      if (this.escaped) { this.escaped = false; if (this.readingKey) this.key += ch; return; }
      if (ch === '\\') { this.escaped = true; return; }
      if (ch === '"') {
        this.inString = false;
        if (this.readingKey) { this.readingKey = false; this.expectKey = false; }
        return;
      }
      if (this.readingKey) this.key += ch;
      return;
    }
    if (/\s/.test(ch)) return;
    if (this.depth === 1 && this.awaitValue) {
      this.awaitValue = false;
      if (this.key === 'reply' && ch === '"' && !this.replyStarted) {
        this.replyStarted = true;
        this.state = 'reply';
        return;
      }
      if (this.key === 'reads' && !this.replyStarted) this.sawReadsFirst = true;
    }
    switch (ch) {
      case '"':
        this.inString = true;
        if (this.depth === 1 && this.expectKey) { this.readingKey = true; this.key = ''; }
        return;
      case '{': case '[':
        this.depth++;
        return;
      case '}': case ']':
        this.depth--;
        if (this.depth <= 0) this.state = 'end';
        return;
      case ',':
        if (this.depth === 1) this.expectKey = true;
        return;
      case ':':
        if (this.depth === 1) this.awaitValue = true;
        return;
      default:
    }
  }
}

/**
 * So phần nháp đã phát với câu trả lời chuẩn (sau khi đọc trọn JSON):
 *   - `none`   — khớp hoàn toàn;
 *   - `append` — nháp là phần đầu của câu chuẩn ⇒ phát nốt `text`;
 *   - `reset`  — lệch (model thử lại giữa chừng, JSON hỏng phải cứu…) ⇒ client xoá nháp, nhận `text` = toàn bộ câu chuẩn.
 */
export function reconcileReply(emitted: string, finalReply: string): { kind: 'none' | 'append' | 'reset'; text: string } {
  if (emitted === finalReply) return { kind: 'none', text: '' };
  if (finalReply.startsWith(emitted)) return { kind: 'append', text: finalReply.slice(emitted.length) };
  return { kind: 'reset', text: finalReply };
}
