/**
 * CV Builder — bilingual translation (Phase 11).
 * ─────────────────────────────────────────────────────────────────────────
 * Write the CV in Vietnamese, export a professional English version (or vice
 * versa) — AI translates the CONTENT faithfully into a CV register with correct
 * grammar. Strict rule: TRANSLATE ONLY. Never add, invent, inflate, or drop a
 * fact; keep proper nouns (company/product/tech names), URLs, emails, numbers
 * and dates unchanged. Degrades: no key → the caller falls back to no-translate.
 */
import { cvLlmComplete, isAiAvailable, extractJson } from './llm/index.js';
import type { RenderCv, RenderItem } from './export/cvData.js';
import type { ExportLang } from './export/labels.js';

export function translateAvailable(): boolean {
  return isAiAvailable('translate');
}

interface Payload {
  headline: string;
  summary: string;
  location: string;
  items: { t: string; o: string; l: string; b: string[] }[];
  skillCats: string[];
  langs: { lg: string; d: string }[];
  certs: { n: string; i: string }[];
}

/**
 * Translate a rendered CV's text into the target language. Returns a new RenderCv
 * with translated content (tech skill names, dates, URLs, emails preserved). On
 * any failure, returns the original unchanged (never blocks an export).
 */
export async function translateCv(userId: number, cv: RenderCv, target: ExportLang): Promise<RenderCv> {
  if (!isAiAvailable('translate')) return cv;

  // Flatten all bullet-bearing items in a fixed order so we can map back.
  const groups: [keyof RenderCv, RenderItem[]][] = [
    ['experiences', cv.experiences], ['projects', cv.projects], ['education', cv.education], ['others', cv.others],
  ];
  const allItems: RenderItem[] = groups.flatMap(([, arr]) => arr);

  const payload: Payload = {
    headline: cv.headline,
    summary: cv.summary,
    location: cv.location,
    items: allItems.map((it) => ({ t: it.title, o: it.organization ?? '', l: it.location ?? '', b: it.bullets })),
    skillCats: cv.skillGroups.map((g) => g.category),
    langs: cv.languageSkills.map((l) => ({ lg: l.language, d: l.detail })),
    certs: cv.certifications.map((c) => ({ n: c.name, i: c.issuer ?? '' })),
  };

  const targetName = target === 'EN' ? 'tiếng Anh (English)' : 'tiếng Việt';
  const system = [
    `Bạn dịch nội dung CV sang ${targetName}, văn phong CV chuyên nghiệp, đúng ngữ pháp.`,
    'LUẬT: CHỈ DỊCH. Không thêm/bịa/thổi phồng/bỏ bớt thông tin. Không đổi tên riêng (công ty, sản phẩm, tên công nghệ như Node.js/AWS/Kubernetes), URL, email, con số, ngày tháng — giữ NGUYÊN.',
    'Giữ NGUYÊN cấu trúc JSON và mọi khoá. Trả về ĐÚNG một JSON, không kèm chữ nào khác. Mảng "b" (bullets) phải giữ đúng số phần tử và thứ tự.',
  ].join('\n');

  let translated: Payload;
  try {
    const res = await cvLlmComplete({
      task: 'translate',
      system,
      messages: [{ role: 'user', content: 'Dịch JSON sau:\n' + JSON.stringify(payload) }],
      maxTokens: 4000,
      userId,
    });
    translated = extractJson<Payload>(res.text);
  } catch {
    return cv; // never block an export on a translation failure
  }

  // Map translated items back to their groups by the original order/lengths.
  const tItems = Array.isArray(translated.items) ? translated.items : [];
  let idx = 0;
  const rebuiltGroups: Record<string, RenderItem[]> = {};
  for (const [key, arr] of groups) {
    rebuiltGroups[key as string] = arr.map((orig) => {
      const t = tItems[idx++] ?? {};
      return {
        ...orig,
        title: str(t.t, orig.title),
        organization: t.o ? String(t.o) : orig.organization,
        location: t.l ? String(t.l) : orig.location,
        // Preserve bullet count: fall back to original bullet if the model dropped one.
        bullets: orig.bullets.map((ob, i) => str(Array.isArray(t.b) ? t.b[i] : undefined, ob)),
      };
    });
  }

  return {
    ...cv,
    headline: str(translated.headline, cv.headline),
    summary: str(translated.summary, cv.summary),
    location: str(translated.location, cv.location),
    experiences: rebuiltGroups.experiences,
    projects: rebuiltGroups.projects,
    education: rebuiltGroups.education,
    others: rebuiltGroups.others,
    skillGroups: cv.skillGroups.map((g, i) => ({ ...g, category: str(translated.skillCats?.[i], g.category) })),
    languageSkills: cv.languageSkills.map((l, i) => ({ language: str(translated.langs?.[i]?.lg, l.language), detail: str(translated.langs?.[i]?.d, l.detail) })),
    certifications: cv.certifications.map((c, i) => ({ name: str(translated.certs?.[i]?.n, c.name), issuer: translated.certs?.[i]?.i ? String(translated.certs[i].i) : c.issuer })),
  };
}

function str(v: unknown, fallback: string): string {
  return typeof v === 'string' && v.trim() ? v : fallback;
}
