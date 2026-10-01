import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEPT_KEYS, DEPT_NAMES, LOOP, STAGES, phaseOf } from '../data';
import StageDoc from '../StageDoc';

/**
 * /about/quy-trinh/<slug> — trang tài liệu của MỘT giai đoạn.
 * Slug cố định trong data.ts (15 slug bản 1 đã công bố — không đổi).
 * Dựng tĩnh lúc build; slug lạ ⇒ 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return STAGES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = STAGES.find((x) => x.slug === params.slug);
  if (!s) return {};
  const url = `https://cuongthai.com/about/quy-trinh/${s.slug}`;
  const num = String(s.n).padStart(2, '0');
  const title = `${num} · ${s.title[0]} — Quy trình dự án`;
  const description = `Giai đoạn ${num}/${String(STAGES.length - 1).padStart(2, '0')} (${phaseOf(s.phase).label[0]}): ${s.goal[0]}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} — CuongHoang`, description, url, type: 'article' },
  };
}

export default function StagePage({ params }: { params: { slug: string } }) {
  const i = STAGES.findIndex((s) => s.slug === params.slug);
  if (i < 0) notFound();
  const stage = STAGES[i];
  // Chỉ truyền đúng giai đoạn này + hai giai đoạn kề — không gửi cả data.ts xuống trình duyệt.
  return (
    <StageDoc
      stage={stage}
      prev={i > 0 ? STAGES[i - 1] : null}
      next={i < STAGES.length - 1 ? STAGES[i + 1] : null}
      total={STAGES.length}
      phase={phaseOf(stage.phase)}
      loop={{ from: LOOP.from, to: LOOP.to }}
      deptKeys={DEPT_KEYS}
      deptNames={DEPT_NAMES}
    />
  );
}
