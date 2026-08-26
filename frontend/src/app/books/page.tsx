import type { Metadata } from 'next';
import Link from 'next/link';
import { BOOK_GROUPS, SERIES_STATS } from './booksData';
import styles from './books.module.css';

// Font editorial nạp bằng <link> Google Fonts lúc chạy (theo chủ trương dự án:
// tránh next/font/google để không phụ thuộc mạng lúc build). CSP đã cho phép
// fonts.googleapis.com + gstatic.com. Offline thì tự rơi về font hệ thống.
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap';

export const metadata: Metadata = {
  title: 'The Library · CuongThai Books',
  description:
    'A technical library written from scratch by Cuong Hoang — 25 volumes, 412 chapters, 800,000+ words, on one rule: nothing is printed that was not run first. Read every volume in the browser.',
  openGraph: {
    title: 'The CuongThai Library',
    description: '25 volumes · 412 chapters · 809,780 words · 887 primary sources. Read online, chapter by chapter.',
    type: 'website',
  },
};

const STAT_ORDER: Array<[keyof typeof SERIES_STATS, string]> = [
  ['volumes', 'Volumes'],
  ['chapters', 'Chapters'],
  ['practice', 'Exercises'],
  ['listings', 'Listings'],
  ['tables', 'Tables'],
  ['words', 'Words'],
];

// Bộ sưu tập sắp có — để trống chỗ, người đọc thấy thư viện sẽ lớn dần. Khi viết
// xong loại nào thì thêm một collection thật ở trên.
const UPCOMING = ['Business', 'Product & Design', 'Mindset', 'Languages'];

const slugOf = (file: string) => file.replace(/\.html$/, '');

export default function BooksPage() {
  return (
    <div className={styles.library}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={FONTS_HREF} />

      <div className={styles.wrap}>
        <div className={styles.eyebrow}>The CuongThai Library</div>
        <h1 className={styles.h1}>A technical library, written from scratch</h1>
        <p className={styles.lede}>
          Written from zero by Cuong Hoang on one rule: nothing is printed that was not run first.
          Every volume is a single self-contained page — read it here, or open it offline in any
          browser. It follows your system&rsquo;s light or dark setting.
        </p>

        <dl className={styles.stats}>
          {STAT_ORDER.map(([key, label]) => (
            <div key={key}>
              <dt>{label}</dt>
              <dd>{SERIES_STATS[key]}</dd>
            </div>
          ))}
        </dl>

        {/* Collection: Technology (bộ hiện có). Cấu trúc này lặp lại được cho các
            collection tương lai — chỉ cần thêm một khối <section class=collection>. */}
        <section className={styles.collection}>
          <div className={styles.collHead}>
            <h2 className={styles.collName}>Technology</h2>
            <span className={styles.collCount}>25 volumes · 7 shelves</span>
          </div>
          <p className={styles.collLede}>
            The full path from the command line to running a product in production.
          </p>

          {BOOK_GROUPS.map((group) => (
            <section className={styles.grp} key={group.title}>
              <h3 className={styles.grpHead}>{group.title}</h3>
              <p className={styles.grpDesc}>{group.desc}</p>
              <div className={styles.cards}>
                {group.books.map((book) => (
                  <Link
                    key={book.file}
                    className={styles.card}
                    style={{ '--c': book.color } as React.CSSProperties}
                    href={`/books/${slugOf(book.file)}`}
                  >
                    <div className={styles.cardTop}>
                      <span className={styles.vn}>VOL {book.vol}</span>
                      <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: book.icon }} />
                    </div>
                    <h4 className={styles.cardTitle}>{book.title}</h4>
                    <div className={styles.meta}>
                      {book.chapters} chapters · {book.practice} exercises · {book.words} words
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </section>

        {/* Collection sắp có — báo hiệu thư viện sẽ mở rộng nhiều loại sách. */}
        <section className={styles.upcoming}>
          <div className={styles.collHead}>
            <h2 className={styles.collName}>More collections</h2>
            <span className={styles.collCount}>in the works</span>
          </div>
          <div className={styles.upList}>
            {UPCOMING.map((name) => (
              <div className={styles.upItem} key={name}>
                <span className={styles.upName}>{name}</span>
                <span className={styles.upSoon}>Coming soon</span>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.note}>
          <b>Read anywhere.</b> Each volume carries its own stylesheet and needs no network. The
          three webfonts load from Google Fonts when you&rsquo;re online; offline, the pages fall
          back to system faces — nothing breaks, it just looks a little different.
        </div>

        <footer className={styles.foot}>
          Cuong Hoang · cuongthai.com · First edition, Aug 2026 · 887 linked primary sources across the series.
        </footer>
      </div>
    </div>
  );
}
