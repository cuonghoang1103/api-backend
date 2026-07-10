import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getServerApiBaseUrl } from '@/lib/server-api';
import ShopProductPageClient from './ShopProductPageClient';

// SEO / social-share metadata rendered SERVER-side; the interactive product
// page stays client-side and fetches its own data as before. `force-dynamic`
// keeps generateMetadata out of the build (backend isn't up during build).
export const dynamic = 'force-dynamic';

const CACHE_TTL_SECONDS = 300;

interface PageProps {
  params: { slug: string };
}

async function getProduct(slug: string) {
  try {
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/v1/shop/products/${encodeURIComponent(slug)}`,
      {
        headers: { cookie: headers().get('cookie') ?? '', accept: 'application/json' },
        next: { revalidate: CACHE_TTL_SECONDS },
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

const toText = (s?: string, n = 200) =>
  (s ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`>_~]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, n);

const toNumber = (v: unknown): number | undefined => {
  const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Sản phẩm | CuongThai' };

  const rawTitle: string = product.name || product.title || 'Sản phẩm';
  const title = `${rawTitle} | Cửa hàng | CuongThai`;
  const description =
    toText(product.shortDescription || product.summary || product.description) ||
    'Sản phẩm trên CuongThai.';
  const image: string | undefined =
    product.thumbnail || product.thumbnailUrl || product.coverImage || product.image || undefined;
  const url = `https://cuongthai.com/shop/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: rawTitle,
      description,
      url,
      type: 'website',
      images: image ? [image] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: rawTitle,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.slug);

  const price = product ? toNumber(product.price ?? product.salePrice) : undefined;
  const image = product
    ? product.thumbnail || product.thumbnailUrl || product.coverImage || product.image || undefined
    : undefined;

  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name || product.title,
        description: toText(product.shortDescription || product.summary || product.description),
        image: image || undefined,
        url: `https://cuongthai.com/shop/${params.slug}`,
        ...(price
          ? {
              offers: {
                '@type': 'Offer',
                price: String(price),
                priceCurrency: 'VND',
                availability: 'https://schema.org/InStock',
                url: `https://cuongthai.com/shop/${params.slug}`,
              },
            }
          : {}),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <ShopProductPageClient />
    </>
  );
}
