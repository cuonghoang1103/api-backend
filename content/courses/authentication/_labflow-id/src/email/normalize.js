// src/email/normalize.js — one normalised form of an email for the UNIQUE index and every lookup (lesson 6.1).
// Trim, take the LAST '@' (the local part may contain others), lowercase the domain, then NFKC + lowercase the whole.
// Returns null for a syntactically impossible address. NFKC folds Unicode duplicates — but NOT confusable letters
// from different scripts (the Cyrillic 'а' U+0430 renders like Latin 'a' U+0061 yet stays a different string), so a
// separate mixed-script check flags those for review.
export function normalizeEmail(raw) {
  const t = String(raw ?? '').trim();
  const at = t.lastIndexOf('@');
  if (at <= 0 || at === t.length - 1 || /\s/.test(t) || t.length > 254) return null;
  const local = t.slice(0, at);
  const domain = t.slice(at + 1).toLowerCase();
  return (local + '@' + domain).normalize('NFKC').toLowerCase();
}

const SCRIPTS = [['latin', /[a-z]/i], ['cyrillic', /[Ѐ-ӿ]/], ['greek', /[Ͱ-Ͽ]/]];
/** Does the local part mix letters from more than one script? ⇒ the scripts, else null (a homograph red flag). */
export function mixesScripts(raw) {
  const local = String(raw ?? '').split('@')[0] ?? '';
  const hit = SCRIPTS.filter(([, re]) => re.test(local)).map(([n]) => n);
  return hit.length > 1 ? hit : null;
}
