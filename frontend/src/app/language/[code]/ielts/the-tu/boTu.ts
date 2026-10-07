/**
 * Kho từ cho Flashcard IELTS (07/10/2026) — gom từ các nguồn đã có + bộ học thuật mới soạn.
 * Khoá thẻ (`k`) = từ viết thường — PHẢI khớp `chuanTu()` của máy chủ (vocab.service.ts).
 * Thứ tự bộ = thứ tự học từ mới khi chọn "Tất cả".
 */
import type { Block, Lesson } from '@/components/sach-hoc/types';
import type { VocabTopic } from '@/app/tech-trends/ielts/data/types';

export type Tu = { k: string; w: string; pos: string; ipa: string; vi: string; ex?: string; exVi?: string; col?: string; bo: string; chuDe?: string };
export type BoTu = { id: string; ten: string; mo: string; tai: () => Promise<Tu[]> };

const HOP_LE = /^[\p{L}\p{N}][\p{L}\p{N}\s'’\-./(),]*$/u;
export const chuanKhoa = (w: string) => w.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.!?;:]+$/, '');
const hopLe = (k: string) => k.length > 0 && k.length <= 80 && HOP_LE.test(k);

type VocabItem = { w: string; pos: string; ipa: string; vi: string; ex: string; exVi: string; more?: string };
function tuTuBai(ls: Lesson[], bo: string): Tu[] {
  const ra: Tu[] = [];
  const duyet = (bs: Block[] | undefined) => {
    for (const b of bs ?? []) {
      if (b.t === 'vocab') for (const it of (b as unknown as { items: VocabItem[] }).items) ra.push({ k: chuanKhoa(it.w), w: it.w, pos: it.pos, ipa: it.ipa, vi: it.vi, ex: it.ex, exVi: it.exVi, bo });
    }
  };
  for (const l of ls) duyet(l.blocks);
  return ra;
}

function tuTuChang(ds: VocabTopic[], bo: string): Tu[] {
  return ds.flatMap((t) => t.words.map((w) => ({ k: chuanKhoa(w.en), w: w.en, pos: w.pos ?? '', ipa: w.ipa, vi: w.vi, ex: w.ex, exVi: w.exVi, bo, chuDe: t.title })));
}

function tuTuDong(ds: { ten: string; ds: string }[], bo: string): Tu[] {
  const ra: Tu[] = [];
  for (const c of ds) {
    for (const dong of c.ds.split('\n')) {
      const x = dong.trim();
      if (!x) continue;
      const [w, pos, ipa, vi, ex, col] = x.split('|');
      if (!w || !vi) continue;
      ra.push({ k: chuanKhoa(w), w, pos, ipa, vi, ex, col, bo, chuDe: c.ten });
    }
  }
  return ra;
}

export const BO_TU: BoTu[] = [
  {
    id: 'khoa', ten: 'Từ của khoá (Ngày 1–6)', mo: 'Từ vựng các Ngày đã học trong khoá IELTS nền tảng',
    tai: async () => {
      const [{ DAYS }, { loadNgay }, { MANIFEST }] = await Promise.all([import('../data'), import('../ngay'), import('../ngay/manifest')]);
      const ngay = Object.keys(MANIFEST).map(Number).sort((a, b) => a - b);
      const ls = await Promise.all(ngay.map((n) => loadNgay(n) ?? Promise.resolve([] as Lesson[])));
      return [...tuTuBai(DAYS[0].lessons, 'khoa'), ...ls.flatMap((l) => tuTuBai(l, 'khoa'))];
    },
  },
  {
    id: 'nen1', ten: 'Nền tảng — chặng 1 (band 0 → 3)', mo: '300 từ đời sống cơ bản theo chủ đề',
    tai: async () => {
      const [a, b] = await Promise.all([import('@/app/tech-trends/ielts/data/stage1/vocab-a'), import('@/app/tech-trends/ielts/data/stage1/vocab-b')]);
      return [...tuTuChang(a.VOCAB_A, 'nen1'), ...tuTuChang(b.VOCAB_B, 'nen1')];
    },
  },
  {
    id: 'nen2', ten: 'Nền tảng — chặng 2 (band 3 → 5)', mo: '300 từ cho Speaking/Writing chặng giữa',
    tai: async () => {
      const [a, b] = await Promise.all([import('@/app/tech-trends/ielts/data/stage2/vocab-a'), import('@/app/tech-trends/ielts/data/stage2/vocab-b')]);
      return [...tuTuChang(a.VOCAB2_A, 'nen2'), ...tuTuChang(b.VOCAB2_B, 'nen2')];
    },
  },
  {
    id: 'hoc-thuat', ten: 'Học thuật IELTS theo chủ đề (600 từ)', mo: '30 chủ đề hay ra · có collocation · từ khung cho Writing',
    tai: async () => {
      const [a, b] = await Promise.all([import('./tuHocThuat1'), import('./tuHocThuat2')]);
      return [...tuTuDong(a.TU_HOC_THUAT_1, 'hoc-thuat'), ...tuTuDong(b.TU_HOC_THUAT_2, 'hoc-thuat')];
    },
  },
  {
    id: 'nen3', ten: 'Chặng 3 (band 5 → 6.5)', mo: '80 từ học thuật nâng cao',
    tai: async () => { const m = await import('@/app/tech-trends/ielts/data/stage3/vocab'); return tuTuChang(m.VOCAB3, 'nen3'); },
  },
];

/** Tải mọi bộ, bỏ trùng (bộ đứng trước giữ từ), bỏ khoá máy chủ không nhận. */
export async function taiKho(): Promise<{ tu: Tu[]; theoBo: Record<string, number> }> {
  const ds = await Promise.all(BO_TU.map((b) => b.tai().catch(() => [] as Tu[])));
  const daCo = new Set<string>();
  const tu: Tu[] = [];
  const theoBo: Record<string, number> = {};
  ds.forEach((list, i) => {
    for (const t of list) {
      if (!hopLe(t.k) || daCo.has(t.k)) continue;
      daCo.add(t.k);
      tu.push(t);
      theoBo[BO_TU[i].id] = (theoBo[BO_TU[i].id] ?? 0) + 1;
    }
  });
  return { tu, theoBo };
}
