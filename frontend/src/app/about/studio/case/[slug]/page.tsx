import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import codebase from '@/data/codebaseStats.json';
import { CASES, COUNTED_ON, getCase } from '../../cases';
import CaseClient from '../CaseClient';

/**
 * /about/studio/case/<slug> — case study của MỘT sản phẩm trên /about/studio.
 * Dữ liệu ở `../../cases.ts` (luật số liệu ở đầu file đó). Dựng tĩnh lúc build;
 * slug lạ ⇒ 404. Chỉ gửi xuống trình duyệt đúng case đang xem + tên hai case kề,
 * không gửi cả cases.ts.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCase(params.slug);
  if (!c) return {};
  const url = `https://cuongthai.com/about/studio/case/${c.slug}`;
  const title = `${c.name} — Case study`;
  const description = c.summary[0];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} — CuongHoang Studio`, description, url, type: 'article' },
  };
}

export default function CasePage({ params }: { params: { slug: string } }) {
  const i = CASES.findIndex((c) => c.slug === params.slug);
  if (i < 0) notFound();
  const near = (j: number) => (j >= 0 && j < CASES.length ? { slug: CASES[j].slug, name: CASES[j].name } : null);
  return (
    <CaseClient
      cs={CASES[i]}
      index={i}
      total={CASES.length}
      prev={near(i - 1)}
      next={near(i + 1)}
      countedOn={COUNTED_ON}
      codebaseOn={codebase.generatedAt}
    />
  );
}
