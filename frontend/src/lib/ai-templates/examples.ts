/**
 * Bóc các khối `<example>` trong phần mô tả của agent.
 *
 * Mô tả agent không phải văn xuôi thuần: nó là prompt mà Claude Code đọc để
 * quyết định KHI NÀO gọi agent, và nó nhét sẵn vài đoạn hội thoại mẫu bằng thẻ
 * giả `<example>` / `<commentary>`. Đây chính là thông tin quý nhất trước khi
 * cài — "agent này kích hoạt trong tình huống nào".
 *
 * Trang gốc xử lý bằng cách GIẤU HẲN khối frontmatter đi. Ở đây làm ngược lại:
 * bóc ra và bày thành thẻ đọc được. Đổi lại phải chịu được dữ liệu bẩn — nên
 * mọi trường đều không bắt buộc, và phần nào không nhận dạng được thì rơi vào
 * `rest` chứ không bị vứt.
 */

export interface AgentExample {
  context?: string;
  user?: string;
  assistant?: string;
  commentary?: string;
  /** Phần trong khối mà không khớp trường nào — giữ lại thay vì vứt. */
  rest?: string;
}

export interface ParsedDescription {
  /** Đoạn mô tả đứng trước ví dụ đầu tiên. */
  intro: string;
  examples: AgentExample[];
}

/**
 * Chuẩn hoá `\n` CÒN SÓT sau khi YAML đã giải mã đúng.
 *
 * Vài tệp nguồn escape hai lần (`"…\\n\\n<example>"`). YAML giải `\\` thành một
 * dấu `\`, nên giá trị đúng chuẩn vẫn chứa hai ký tự `\` + `n`. js-yaml cho kết
 * quả y hệt — tức là lỗi nằm ở tệp gốc, không phải ở bộ đọc.
 *
 * Ở tầng hiển thị thì đổi chúng thành xuống dòng thật: trong văn xuôi tiếng
 * Anh, một dấu `\n` giữa câu không bao giờ là ý đồ của người viết.
 */
export function normalizeEscapes(s: string): string {
  return s
    .replace(/\\r\\n|\\n/g, '\n')
    .replace(/\\t/g, '  ')
    .replace(/\\"/g, '"');
}

/** Bỏ cặp nháy bao ngoài mà `user:` / `assistant:` hay có. */
function unquote(s: string): string {
  const t = s.trim();
  if (t.length > 1 && ((t[0] === '"' && t.endsWith('"')) || (t[0] === "'" && t.endsWith("'")))) {
    return t.slice(1, -1).trim();
  }
  return t;
}

const EXAMPLE_BLOCK = /<example>([\s\S]*?)(?:<\/example>|$)/gi;
const COMMENTARY = /<commentary>([\s\S]*?)(?:<\/commentary>|$)/i;

export function parseAgentDescription(raw: string): ParsedDescription {
  const text = normalizeEscapes(raw);

  const examples: AgentExample[] = [];
  let firstAt = -1;
  let m: RegExpExecArray | null;

  EXAMPLE_BLOCK.lastIndex = 0;
  while ((m = EXAMPLE_BLOCK.exec(text)) !== null) {
    if (firstAt === -1) firstAt = m.index;

    let block = m[1];

    const cm = COMMENTARY.exec(block);
    const commentary = cm ? cm[1].trim() : undefined;
    if (cm) block = block.slice(0, cm.index) + block.slice(cm.index + cm[0].length);

    const ex: AgentExample = {};
    if (commentary) ex.commentary = commentary;

    // Cắt theo NHÃN đứng đầu dòng. Không dùng regex một phát cho cả khối: câu
    // trả lời của assistant thường chứa cả chữ "user" lẫn dấu hai chấm, nên
    // tách bằng nhãn giữa dòng sẽ chặt nhầm giữa câu.
    const labels: [keyof AgentExample, RegExp][] = [
      ['context', /^\s*Context\s*:/i],
      ['user', /^\s*user\s*:/i],
      ['assistant', /^\s*assistant\s*:/i],
    ];

    const lines = block.split('\n');
    let current: keyof AgentExample | null = null;
    const buf: Partial<Record<keyof AgentExample, string[]>> = {};
    const rest: string[] = [];

    for (const line of lines) {
      const hit = labels.find(([, re]) => re.test(line));
      if (hit) {
        current = hit[0];
        buf[current] = buf[current] ?? [];
        buf[current]!.push(line.replace(hit[1], '').trim());
      } else if (current) {
        buf[current]!.push(line.trim());
      } else if (line.trim()) {
        rest.push(line.trim());
      }
    }

    for (const [k, v] of Object.entries(buf) as [keyof AgentExample, string[]][]) {
      const joined = v.join('\n').trim();
      if (joined) ex[k] = unquote(joined) as never;
    }
    if (rest.length) ex.rest = rest.join('\n');

    if (Object.keys(ex).length) examples.push(ex);
  }

  const intro = (firstAt === -1 ? text : text.slice(0, firstAt))
    // "Specifically:" / "Examples:" chỉ là câu dẫn sang phần ví dụ — bỏ đi vì
    // phần ví dụ đã có tiêu đề riêng, để lại thành ra dẫn vào khoảng không.
    .replace(/\s*(Specifically|Examples?)\s*:?\s*$/i, '')
    .trim();

  return { intro, examples };
}
