/**
 * CT Work — dm5 G2 (27/11/2026): phần THUẦN của "Soát trước nộp" (B14) và khung Report 6 User Guide (B20) — test ở dm5b.test.ts.
 *
 *   B14 ucNameChecks  tên UC (SRS) ↔ tiêu đề thẻ gắn UC ↔ WBS (WBS dựng từ thẻ ⇒ khớp thẻ là khớp WBS): lệch / UC chưa có thẻ.
 *   B20 fillUserGuide "3. User Manual": mỗi actor (PERSON) một mục "3.k <Actor> Features", mỗi màn actor được vào (Screen
 *                     Authorization) một mục "3.k.m <Tên màn ĐÚNG như WorkSrsScreen>" có khung (mục đích · các bước · ảnh màn).
 *                     Mục đã có (theo tên) GIỮ NGUYÊN chữ người viết; chỉ thêm mục thiếu. Đề mục con không khớp tên màn nào ⇒
 *                     cảnh báo (kèm tên gần nhất) — đúng lỗi "tiêu đề 3.x.y lệch tên màn" người chấm bắt.
 */

import { plainText } from './docExport.js';
import type { PmNode } from './docMarkdown.js';
import { findHeading, sectionEnd, ucKey, type ActorLite, type ScreenLite } from './srs.js';

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const stripNum = (s: string) => s.replace(/^(?:[IVX]+\.|[A-Z]\.|\d+(?:\.\d+)*\.?)\s+/, '').trim();
const levelOf = (n: PmNode) => Number(n.attrs?.level ?? 1);

export interface UcNameCheck { uc: string; name: string; issue: string | null; issueTitle: string | null; ok: boolean; problem: 'NO_ISSUE' | 'NAME_MISMATCH' | null }

/** Tiêu đề thẻ "khớp" tên UC khi (bỏ dấu, bỏ mã UC-xx/ngoặc) bằng nhau hoặc chứa nhau. */
export function sameUcName(ucName: string, issueTitle: string): boolean {
  const a = fold(ucName.replace(/\bUC-?\d+\b/gi, '').replace(/\([^)]*\)/g, ''));
  const b = fold(issueTitle.replace(/\bUC-?\d+\b/gi, '').replace(/\([^)]*\)/g, '').replace(/^\[[^\]]*\]\s*/, ''));
  return !!a && !!b && (a === b || b.includes(a) || a.includes(b));
}

export function ucNameChecks(ucs: Array<{ number: number; name: string; status: string; issueKey?: string | null }>, issueTitle: (key: string) => string | null): UcNameCheck[] {
  return ucs.filter((u) => u.status !== 'PROPOSED').sort((a, b) => a.number - b.number).map((u) => {
    if (!u.issueKey) return { uc: ucKey(u.number), name: u.name, issue: null, issueTitle: null, ok: false, problem: 'NO_ISSUE' as const };
    const t = issueTitle(u.issueKey);
    const ok = !!t && sameUcName(u.name, t);
    return { uc: ucKey(u.number), name: u.name, issue: u.issueKey, issueTitle: t, ok, problem: ok ? null : ('NAME_MISMATCH' as const) };
  });
}

// ─── B20: Report 6 ───────────────────────────────────────────────

const t = (text: string): PmNode => ({ type: 'text', text });
const heading = (level: number, text: string): PmNode => ({ type: 'heading', attrs: { level: Math.min(level, 6) }, content: [t(text)] });
const para = (text: string): PmNode => ({ type: 'paragraph', content: [t(text)] });
const bold = (label: string, rest = ''): PmNode => ({ type: 'paragraph', content: [{ type: 'text', text: label, marks: [{ type: 'bold' }] }, ...(rest ? [t(rest)] : [])] });

/** Khung một màn: mục đích (mô tả màn trong SRS) · các bước (danh sách số) · ảnh màn — ghi chú hướng dẫn bị bỏ khi xuất. */
export function screenFrame(s: ScreenLite, actor: string): PmNode[] {
  return [
    { type: 'blockquote', content: [para(`Guide: how ${actor} uses "${s.name}" — one numbered step per action, a screenshot per step; button and field names exactly as on the screen.`)] },
    bold('Purpose: ', s.description?.trim() || (s.feature ? `${s.feature}.` : '')),
    bold('Steps:'),
    { type: 'orderedList', attrs: { start: 1 }, content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
    bold('Screenshot:'),
  ];
}

/** Gần đúng nhất (khoảng cách Levenshtein trên chữ đã gập) — để gợi ý "ý bạn là …". */
export function closest(name: string, options: string[]): string | null {
  const a = fold(name);
  let best: { o: string; d: number } | null = null;
  for (const o of options) {
    const b = fold(o);
    const dp = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      let prev = dp[0];
      dp[0] = i;
      for (let j = 1; j <= b.length; j++) { const tmp = dp[j]; dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = tmp; }
    }
    const d = dp[b.length] / Math.max(a.length, b.length, 1);
    if (!best || d < best.d) best = { o, d };
  }
  return best && best.d <= 0.5 ? best.o : null;
}

export interface UserGuideResult { added: string[]; kept: string[]; warnings: Array<{ heading: string; suggestion: string | null }> }

/**
 * Điền khung "User Manual" vào doc (biến đổi tại chỗ). Không có đề mục "User Manual" ⇒ null (trang không theo mẫu).
 * Actor SYSTEM bỏ qua; màn không gán actor nào ⇒ nhóm "Common Screens".
 */
export function fillUserGuide(doc: PmNode, d: { actors: ActorLite[]; screens: ScreenLite[]; auth: Array<[number, number]> }): UserGuideResult | null {
  const blocks = doc.content ?? [];
  const p = findHeading(blocks, /^User Manual$/i);
  if (p < 0) return null;
  const lv = levelOf(blocks[p]);
  const pNum = /^(\d+(?:\.\d+)*)/.exec(plainText(blocks[p]).trim())?.[1] ?? null;
  const screensSorted = [...d.screens].sort((a, b) => a.position - b.position || a.id - b.id);
  const people = [...d.actors].filter((a) => a.kind !== 'SYSTEM').sort((a, b) => a.position - b.position || a.id - b.id);
  const groups: Array<{ name: string; screens: ScreenLite[] }> = people.map((a) => ({ name: a.name, screens: screensSorted.filter((s) => d.auth.some(([sid, aid]) => sid === s.id && aid === a.id)) })).filter((g) => g.screens.length);
  const orphan = screensSorted.filter((s) => !d.auth.some(([sid]) => sid === s.id));
  if (orphan.length) groups.push({ name: 'Common', screens: orphan });
  const res: UserGuideResult = { added: [], kept: [], warnings: [] };
  // Bỏ mục mẫu "Feature name" chưa có chữ.
  {
    const end = sectionEnd(blocks, p);
    for (let k = p + 1; k < end; k++) {
      if (blocks[k].type === 'heading' && levelOf(blocks[k]) === lv + 1 && /^Feature name$/i.test(stripNum(plainText(blocks[k])))) {
        const e = sectionEnd(blocks, k);
        const body = blocks.slice(k + 1, e).filter((b) => b.type !== 'heading');
        const empty = body.every((b) => !plainText(b).replace(/Step \d+\s*:?/gi, '').trim());
        if (empty) blocks.splice(k, e - k);
        break;
      }
    }
  }
  const allScreenNames = screensSorted.map((s) => s.name);
  for (const g of groups) {
    const title = `${g.name} Features`;
    let end = sectionEnd(blocks, p);
    let hi = -1;
    let kids = 0;
    for (let k = p + 1; k < end; k++) {
      if (blocks[k].type !== 'heading' || levelOf(blocks[k]) !== lv + 1) continue;
      kids++;
      const tt = fold(stripNum(plainText(blocks[k])));
      if (tt === fold(title) || tt === fold(g.name) || tt === fold(`${g.name} guide`)) hi = k;
    }
    if (hi < 0) {
      blocks.splice(end, 0, heading(lv + 1, `${pNum ? `${pNum}.${kids + 1} ` : ''}${title}`));
      hi = end;
      res.added.push(title);
    }
    const gNum = /^(\d+(?:\.\d+)*)/.exec(plainText(blocks[hi]).trim())?.[1] ?? null;
    for (const s of g.screens) {
      const gEnd = sectionEnd(blocks, hi);
      let exists = false;
      let count = 0;
      for (let k = hi + 1; k < gEnd; k++) {
        if (blocks[k].type !== 'heading' || levelOf(blocks[k]) !== lv + 2) continue;
        count++;
        if (fold(stripNum(plainText(blocks[k]))) === fold(s.name)) exists = true;
      }
      if (exists) { res.kept.push(`${g.name} › ${s.name}`); continue; }
      blocks.splice(gEnd, 0, heading(lv + 2, `${gNum ? `${gNum}.${count + 1} ` : ''}${s.name}`), ...screenFrame(s, g.name));
      res.added.push(`${g.name} › ${s.name}`);
    }
  }
  // Cảnh báo: đề mục màn (mức lv+2) không trùng tên màn nào trong SRS.
  const end = sectionEnd(blocks, p);
  for (let k = p + 1; k < end; k++) {
    if (blocks[k].type !== 'heading' || levelOf(blocks[k]) !== lv + 2) continue;
    const h = stripNum(plainText(blocks[k]));
    if (!allScreenNames.some((n) => fold(n) === fold(h))) res.warnings.push({ heading: plainText(blocks[k]).trim(), suggestion: closest(h, allScreenNames) });
  }
  doc.content = blocks;
  return res;
}
