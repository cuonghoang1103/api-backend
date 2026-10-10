/**
 * CT Work — CTW đợt 7b (C21 Knowledge base): luật thuần — tách từ khoá, chấm điểm bài viết cho TÌM KIẾM và GỢI Ý khi khách
 * gõ yêu cầu (deflection). Không dấu (foldVi — khớp cột *_fold của work_pages), bỏ từ dừng Anh + Việt.
 *
 * Điểm: từ khớp TIÊU ĐỀ ×3, khớp từ khoá do người soạn gắn ×3, khớp NỘI DUNG ×1 (đếm tối đa 3 lần/từ), cộng thưởng nhỏ
 * theo tỷ lệ "hữu ích" (đã có ≥ 3 phiếu). Ngưỡng gợi ý: ≥ 2 điểm và ít nhất HAI từ khác nhau khớp (một từ chung chung
 * như "login" không đủ để chặn khách gửi yêu cầu).
 */

import { foldVi } from './fold.js';

const STOP = new Set([
  'the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'is', 'it', 'my', 'i', 'we', 'you', 'can', 'not', 'cannot', 'how', 'do', 'does',
  'with', 'at', 'be', 'are', 'this', 'that', 'when', 'what', 'why', 'from', 'please', 'help', 'have', 'has', 'get', 'got', 'there', 'any',
  'toi', 'ban', 'cua', 'va', 'la', 'co', 'khong', 'duoc', 'cho', 'voi', 'nhu', 'the', 'nao', 'gi', 'thi', 'mot', 'cac', 'nhung', 'bi', 'da',
  'dang', 'se', 'nay', 'do', 'oi', 'giup', 'minh', 'em', 'anh', 'chi', 've', 'trong', 'tren', 'khi', 'lam', 'sao',
]);

export function tokens(text: string): string[] {
  return [...new Set(foldVi(text).split(/[^a-z0-9]+/).filter((w) => w.length >= 2 && !STOP.has(w)))].slice(0, 30);
}

export interface KbCandidate { id: number; title: string; content: string; keywords: string | null; helpful: number; notHelpful: number }

export function scoreArticle(a: KbCandidate, qTokens: string[]): { score: number; matched: number } {
  if (!qTokens.length) return { score: 0, matched: 0 };
  const title = foldVi(a.title);
  const kw = foldVi(a.keywords ?? '');
  const body = foldVi(a.content);
  let score = 0;
  let matched = 0;
  for (const t of qTokens) {
    const re = new RegExp(`(^|[^a-z0-9])${t}`, 'g');
    let s = 0;
    if (re.test(title)) s += 3;
    re.lastIndex = 0;
    if (re.test(kw)) s += 3;
    re.lastIndex = 0;
    const n = Math.min(3, (body.match(re) ?? []).length);
    s += n;
    if (s > 0) matched += 1;
    score += s;
  }
  const votes = a.helpful + a.notHelpful;
  if (votes >= 3 && score > 0) score += Math.round((a.helpful / votes) * 2 * 10) / 10;
  return { score, matched };
}

export function rankArticles<T extends KbCandidate>(list: T[], query: string, opts: { limit?: number; deflect?: boolean } = {}): Array<T & { score: number }> {
  const q = tokens(query);
  return list
    .map((a) => ({ a, ...scoreArticle(a, q) }))
    .filter((x) => (opts.deflect ? x.score >= 2 && x.matched >= Math.min(2, q.length) : x.score > 0))
    .sort((x, y) => y.score - x.score || x.a.id - y.a.id)
    .slice(0, opts.limit ?? 20)
    .map((x) => ({ ...x.a, score: x.score }));
}

/** Đoạn trích quanh từ khớp đầu tiên (≤ 220 ký tự). */
export function excerpt(content: string, query: string, max = 220): string {
  const text = content.replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  const folded = foldVi(text);
  const hit = tokens(query).map((t) => folded.indexOf(t)).filter((i) => i >= 0).sort((a, b) => a - b)[0] ?? 0;
  const start = Math.max(0, hit - 60);
  return `${start > 0 ? '…' : ''}${text.slice(start, start + max).trim()}${start + max < text.length ? '…' : ''}`;
}
