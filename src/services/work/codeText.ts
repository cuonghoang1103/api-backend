/**
 * CT Work — chữ của MÃ NGUỒN cho model (27/10/2026: `code_read` + CuongMini review code). HÀM THUẦN, không DB, không mạng
 * (test: codeText.test.ts).
 *
 *   numberedFile   — tệp kèm số dòng ("  12| …"), cắt theo ngân sách ký tự và nói rõ đã cắt ở đâu.
 *   annotatePatch  — patch unified diff kèm SỐ DÒNG CỦA TỆP MỚI ở mỗi dòng thêm/giữ ⇒ model trích "file:line" khỏi đoán.
 *   patchLines     — tập số dòng (tệp mới) thật sự hiện trong patch ⇒ kiểm phát hiện của model không bịa dòng.
 *   diffText       — danh sách tệp đổi TRƯỚC, rồi patch từng tệp tới khi hết ngân sách (tệp bị bỏ được liệt kê).
 */

export interface DiffFileLike {
  filename: string;
  previous?: string | null;
  status: string;
  additions: number;
  deletions: number;
  patch: string | null;
  truncated?: boolean;
}

/** Tệp kèm số dòng, bắt đầu từ `fromLine` (1 = đầu tệp); vượt ngân sách ⇒ dừng và ghi "đã cắt". */
export function numberedFile(content: string, opts: { budget: number; fromLine?: number }): { text: string; shown: [number, number]; total: number; cut: boolean } {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
  const total = lines.length;
  const start = Math.min(Math.max(1, Math.floor(opts.fromLine ?? 1)), Math.max(1, total));
  const width = String(total).length;
  const out: string[] = [];
  let used = 0;
  let last = start - 1;
  for (let i = start - 1; i < total; i++) {
    const row = `${String(i + 1).padStart(width, ' ')}| ${lines[i].length > 2000 ? `${lines[i].slice(0, 2000)}…` : lines[i]}`;
    if (used + row.length + 1 > opts.budget && out.length) break;
    out.push(row);
    used += row.length + 1;
    last = i + 1;
  }
  const cut = last < total || start > 1;
  return { text: out.join('\n'), shown: [start, last], total, cut };
}

const HUNK = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/;

/** Patch kèm số dòng tệp MỚI: "  42 + code" (thêm), "  43   code" (giữ), "     - code" (xoá). */
export function annotatePatch(patch: string): string {
  const out: string[] = [];
  let n = 0;
  for (const line of patch.replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n')) {
    const h = HUNK.exec(line);
    if (h) { n = Number(h[3]); out.push(line); continue; }
    if (line.startsWith('\\')) { out.push(line); continue; } // "\ No newline at end of file"
    if (line.startsWith('+')) { out.push(`${String(n).padStart(5, ' ')} +${line.slice(1)}`); n++; continue; }
    if (line.startsWith('-')) { out.push(`      -${line.slice(1)}`); continue; }
    out.push(`${String(n).padStart(5, ' ')}  ${line.startsWith(' ') ? line.slice(1) : line}`);
    n++;
  }
  return out.join('\n');
}

/** Số dòng (tệp mới) có trong patch: `added` = dòng thêm, `all` = thêm + ngữ cảnh. */
export function patchLines(patch: string | null | undefined): { added: Set<number>; all: Set<number> } {
  const added = new Set<number>();
  const all = new Set<number>();
  if (!patch) return { added, all };
  let n = 0;
  let inHunk = false;
  for (const line of patch.replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n')) {
    const h = HUNK.exec(line);
    if (h) { n = Number(h[3]); inHunk = true; continue; }
    if (!inHunk || line.startsWith('\\') || line.startsWith('-')) continue;
    if (line.startsWith('+')) added.add(n);
    all.add(n);
    n++;
  }
  return { added, all };
}

const statusMark = (s: string) => (s === 'added' ? 'A' : s === 'removed' ? 'D' : s === 'renamed' ? 'R' : 'M');

/**
 * Danh sách tệp + patch (có số dòng) trong ngân sách. Tệp sinh tự động / khoá phụ thuộc (lock, min, dist…) xếp CUỐI —
 * ngân sách dành cho mã người viết. Trả `included` = tên tệp có patch đã đưa vào (để kiểm phát hiện).
 */
export function diffText(files: DiffFileLike[], budget: number): { text: string; included: string[]; omitted: string[] } {
  const head = files.map((f) => `${statusMark(f.status)} ${f.previous && f.previous !== f.filename ? `${f.previous} → ` : ''}${f.filename} (+${f.additions} −${f.deletions})${f.patch ? '' : f.truncated ? ' [diff too large — not shown]' : ' [no text diff]'}`);
  let text = `Changed files (${files.length}):\n${head.join('\n')}`;
  const order = [...files].sort((a, b) => Number(isNoise(a.filename)) - Number(isNoise(b.filename)));
  const included: string[] = [];
  const omitted: string[] = [];
  for (const f of order) {
    if (!f.patch) continue;
    const block = `\n\n--- ${f.filename} ---\n${annotatePatch(f.patch)}`;
    if (text.length + block.length > budget) { omitted.push(f.filename); continue; }
    text += block;
    included.push(f.filename);
  }
  if (omitted.length) text += `\n\n[Not shown — over the size budget: ${omitted.join(', ')}. Read one with action "file" or a smaller diff.]`;
  return { text, included, omitted };
}

/** Tệp "ồn" (sinh tự động / build / khoá phụ thuộc) — xếp sau, model thường không cần đọc. */
export function isNoise(path: string): boolean {
  return /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|composer\.lock|Gemfile\.lock|poetry\.lock|go\.sum|Cargo\.lock)$/i.test(path)
    || /\.(min\.(js|css)|map|svg|lock)$/i.test(path)
    || /(^|\/)(dist|build|out|target|node_modules|vendor|\.next)\//i.test(path);
}

/**
 * Mốc thời gian người dùng/model gõ: "2026-10-20", "7d" (7 ngày trước), "24h", "2w", "today", "yesterday". Ngày (không
 * giờ) tính theo giờ Việt Nam (UTC+7): `since` = 00:00, `until` = hết ngày. Sai ⇒ null.
 */
export function parseWhen(raw: string | null | undefined, now: Date, edge: 'start' | 'end' = 'start'): Date | null {
  const s = String(raw ?? '').trim().toLowerCase();
  if (!s) return null;
  const rel = /^(\d{1,3})\s*(h|d|w)$/.exec(s);
  if (rel) return new Date(now.getTime() - Number(rel[1]) * (rel[2] === 'h' ? 3_600_000 : rel[2] === 'd' ? 86_400_000 : 7 * 86_400_000));
  const vnMidnight = (d: Date) => {
    const vn = new Date(d.getTime() + 7 * 3_600_000);
    return new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate()) - 7 * 3_600_000);
  };
  let day: Date | null = null;
  if (s === 'today' || s === 'hom nay' || s === 'hôm nay') day = vnMidnight(now);
  else if (s === 'yesterday' || s === 'hom qua' || s === 'hôm qua') day = new Date(vnMidnight(now).getTime() - 86_400_000);
  else {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m) {
      const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) - 7 * 3_600_000;
      if (!Number.isNaN(t)) day = new Date(t);
    }
  }
  if (!day) return null;
  return edge === 'end' ? new Date(day.getTime() + 86_400_000 - 1) : day;
}
