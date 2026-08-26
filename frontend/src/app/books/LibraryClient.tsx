'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BOOK_GROUPS, BOOK_LOGOS, SERIES_STATS, type Book } from './booksData';
import styles from './books.module.css';

const STAT_ORDER: Array<[keyof typeof SERIES_STATS, string]> = [
  ['volumes', 'Volumes'], ['chapters', 'Chapters'], ['practice', 'Exercises'],
  ['listings', 'Listings'], ['tables', 'Tables'], ['words', 'Words'],
];
const UPCOMING = ['Business', 'Product & Design', 'Mindset', 'Languages'];
const slugOf = (file: string) => file.replace(/\.html$/, '');
const shelfId = (title: string) => 'shelf-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// "Start here" — bốn cửa vào tự nhiên của bộ sách.
const FEATURED = ['24', '09', '03', '17'];
const allBooks = BOOK_GROUPS.flatMap((g) => g.books);
const featured = FEATURED.map((v) => allBooks.find((b) => b.vol === v)).filter(Boolean) as Book[];

// Thẻ sách 3D: bìa (mặt trước) + gáy (mặt trái xoay 90°). Hover → nghiêng như rút
// khỏi kệ. Toàn CSS transform, không thư viện ngoài.
function Book3D({ book, big = false }: { book: Book; big?: boolean }) {
  const logo = BOOK_LOGOS[book.vol];
  return (
    <Link
      href={`/books/${slugOf(book.file)}`}
      className={`${styles.book3d} ${big ? styles.book3dBig : ''} ${styles.reveal}`}
      style={{ '--c': book.color } as React.CSSProperties}
      aria-label={`${book.title} — Volume ${book.vol}`}
    >
      <span className={styles.book3dInner}>
        <span className={styles.spine}>
          <span className={styles.spineVol}>{book.vol}</span>
          <span className={styles.spineTitle}>{book.title}</span>
        </span>
        <span className={styles.cover}>
          <span className={styles.coverHead}>
            <span className={styles.coverVol}>No. {book.vol}</span>
            <span className={styles.coverSeries}>CuongThai</span>
          </span>
          <span className={styles.coverMark} aria-hidden>
            {logo ? (
              <span className={styles.brand} style={{ '--logo': `url(/books/logos/${logo}.svg)` } as React.CSSProperties} />
            ) : (
              <span className={styles.glyph} dangerouslySetInnerHTML={{ __html: book.icon }} />
            )}
          </span>
          <span className={styles.coverBody}>
            <span className={styles.coverTitle}>{book.title}</span>
            <span className={styles.coverMeta}>{book.chapters} chapters · {book.words} words</span>
          </span>
        </span>
      </span>
    </Link>
  );
}

export default function LibraryClient() {
  const [activeShelf, setActiveShelf] = useState(BOOK_GROUPS[0]?.title || '');
  const rootRef = useRef<HTMLDivElement>(null);

  // Scroll-spy cho thanh danh mục (tô sáng kệ đang xem). Entrance là CSS thuần
  // nên KHÔNG có observer ẩn nội dung — JS lỗi cũng không sao.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const shelves = Array.from(root.querySelectorAll('[data-shelf]')) as HTMLElement[];
    const spyIO = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setActiveShelf((vis.target as HTMLElement).dataset.shelf || '');
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    shelves.forEach((el) => spyIO.observe(el));
    return () => spyIO.disconnect();
  }, []);

  return (
    <div className={styles.library} ref={rootRef}>
      <div className={styles.wrap}>
        <div className={`${styles.eyebrow} ${styles.reveal}`}>The CuongThai Library</div>
        <h1 className={`${styles.h1} ${styles.reveal}`}>A technical library, written from scratch</h1>
        <p className={`${styles.lede} ${styles.reveal}`}>
          Written from zero by Cuong Hoang on one rule: nothing is printed that was not run first.
          Every volume is a single self-contained page — read it here, or open it offline in any
          browser. It follows your system&rsquo;s light or dark setting.
        </p>

        <dl className={`${styles.stats} ${styles.reveal}`}>
          {STAT_ORDER.map(([key, label]) => (
            <div key={key}><dt>{label}</dt><dd>{SERIES_STATS[key]}</dd></div>
          ))}
        </dl>
      </div>

      {/* Danh mục dính — nhảy tới từng kệ, tô sáng kệ đang xem. */}
      <div className={styles.catBar}>
        <div className={styles.catInner}>
          {BOOK_GROUPS.map((g) => (
            <a
              key={g.title}
              href={`#${shelfId(g.title)}`}
              className={`${styles.catChip} ${activeShelf === g.title ? styles.catActive : ''}`}
            >
              {g.title}
            </a>
          ))}
        </div>
      </div>

      <div className={styles.wrap}>
        {/* Khu bắt đầu đọc — reading room, bốn cuốn 3D lớn. */}
        <section className={styles.reading}>
          <div className={styles.readingHead}>
            <h2 className={`${styles.readingTitle} ${styles.reveal}`}>Start here</h2>
            <p className={`${styles.readingSub} ${styles.reveal}`}>Four natural doors into the series.</p>
          </div>
          <div className={styles.shelfRow}>
            {featured.map((b) => <Book3D key={b.file} book={b} big />)}
          </div>
          <div className={styles.shelfPlank} aria-hidden />
        </section>

        <section className={styles.collection}>
          <div className={`${styles.collHead} ${styles.reveal}`}>
            <h2 className={styles.collName}>Technology</h2>
            <span className={styles.collCount}>25 volumes · 7 shelves</span>
          </div>
          <p className={`${styles.collLede} ${styles.reveal}`}>
            The full path from the command line to running a product in production.
          </p>

          {BOOK_GROUPS.map((group) => (
            <section className={styles.grp} key={group.title} id={shelfId(group.title)} data-shelf={group.title}>
              <h3 className={`${styles.grpHead} ${styles.reveal}`}>{group.title}</h3>
              <p className={`${styles.grpDesc} ${styles.reveal}`}>{group.desc}</p>
              <div className={styles.shelf}>
                <div className={styles.shelfRow}>
                  {group.books.map((book) => <Book3D key={book.file} book={book} />)}
                </div>
                <div className={styles.shelfPlank} aria-hidden />
              </div>
            </section>
          ))}
        </section>

        <section className={`${styles.upcoming} ${styles.reveal}`}>
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

        <div className={`${styles.note} ${styles.reveal}`}>
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
