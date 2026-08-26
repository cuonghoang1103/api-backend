import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import BookReader from './BookReader';

export type TocItem = { n: string; title: string };

// Đọc file sách trong public/books, trích tiêu đề + mục lục chương từ chính cấu
// trúc của sách (.toc-row → .toc-n số, .toc-t tên; bỏ <small> phụ đề). Mọi cuốn
// đều có khối này (đã kiểm 25/25). Slug chỉ nhận [a-z0-9-] → chặn path traversal.
function readBook(slug: string): { title: string; toc: TocItem[] } | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = path.join(process.cwd(), 'public', 'books', `${slug}.html`);
  if (!existsSync(file)) return null;
  const html = readFileSync(file, 'utf8');

  const rawTitle = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() || '';
  const title = rawTitle || slug;

  const toc: TocItem[] = [];
  const rowRe = /<div class="toc-row[^"]*">[\s\S]*?<span class="toc-n">([\s\S]*?)<\/span>[\s\S]*?<span class="toc-t">([\s\S]*?)<\/span>/g;
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(html))) {
    const n = m[1].replace(/<[^>]+>/g, '').trim();
    const t = m[2]
      .replace(/<small>[\s\S]*?<\/small>/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (t) toc.push({ n, title: t });
  }
  return { title, toc };
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const book = readBook(params.slug);
  const title = book?.title || 'Book';
  return {
    title: `${title} · CuongThai Books`,
    description: `Đọc "${title}" — một tập trong bộ sách kỹ thuật CuongThai. Mục lục chương, đọc toàn màn hình.`,
  };
}

// Sinh sẵn 25 trang đọc lúc build (SSG) cho nhanh + SEO.
export function generateStaticParams() {
  return [
    '01-react-from-zero-to-production', '02-java-from-zero-to-lab211',
    '03-javascript-from-zero-to-production', '04-typescript-from-zero-to-type-safe',
    '05-nextjs-from-zero-to-production', '06-postgresql-from-zero-to-production',
    '07-nodejs-and-express-from-zero-to-production', '08-docker-from-zero-to-production',
    '09-git-from-zero-to-confident', '10-tailwind-css-from-zero-to-production',
    '11-prisma-from-zero-to-production', '12-redis-from-zero-to-production',
    '13-socketio-from-zero-to-production', '14-authentication-from-zero-to-production',
    '15-nginx-from-zero-to-production', '16-deploying-to-a-vps-from-zero-to-production',
    '17-linux-and-bash-from-zero-to-production', '18-github-actions-from-zero-to-production',
    '19-object-storage-from-zero-to-production', '20-domains-dns-and-tls-from-zero-to-production',
    '21-media-processing-from-zero-to-production', '22-observability-and-monitoring-from-zero-to-production',
    '23-payment-integration-from-zero-to-production', '24-the-terminal-from-zero-to-fluent',
    '25-networking-from-zero-to-production',
  ].map((slug) => ({ slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  const book = readBook(params.slug);
  if (!book) notFound();
  return <BookReader slug={params.slug} title={book.title} toc={book.toc} />;
}
