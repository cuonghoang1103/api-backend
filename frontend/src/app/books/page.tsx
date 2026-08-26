import type { Metadata } from 'next';
import { BOOK_GROUPS, SERIES_STATS } from './booksData';
import styles from './books.module.css';

// Bộ ba font của bản gốc (Source Serif 4 để đọc, Source Sans 3 cho nhãn, JetBrains
// Mono cho số). Nạp bằng <link> Google Fonts lúc chạy — GIỐNG chính các file sách,
// và theo đúng chủ trương của dự án (layout.tsx: tránh next/font/google để không
// phụ thuộc mạng lúc build). Offline thì tự rơi về font hệ thống, không vỡ.
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap';

export const metadata: Metadata = {
  title: 'Bộ sách · CuongThai Book Series',
  description:
    'Thư viện kỹ thuật 25 tập do Cuong Hoang tự viết — 412 chương, hơn 800.000 từ, mọi output đều chạy thật trước khi in. Mỗi tập là một file HTML tự chứa, đọc được offline.',
  openGraph: {
    title: 'CuongThai Book Series — 25 tập',
    description: '412 chương · 3.607 bài tập · 809.780 từ · 887 nguồn dẫn. Đọc trực tiếp trên trình duyệt, offline được.',
    type: 'website',
  },
};

const STAT_ORDER: Array<[keyof typeof SERIES_STATS, string]> = [
  ['volumes', 'Tập'],
  ['chapters', 'Chương'],
  ['practice', 'Bài tập'],
  ['listings', 'Đoạn mã'],
  ['tables', 'Bảng'],
  ['words', 'Từ'],
];

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
        <div className={styles.eyebrow}>CuongThai Book Series</div>
        <h1 className={styles.h1}>Hai mươi lăm tập, và nên bắt đầu từ đâu</h1>
        <p className={styles.lede}>
          Một thư viện kỹ thuật hoàn chỉnh do Cuong Hoang viết từ số 0, trên đúng một luật: không in
          ra thứ gì chưa chạy thật. Mỗi tập là một file HTML tự chứa — mở bằng bất kỳ trình duyệt nào,
          không cần internet, tự theo chế độ sáng/tối của máy bạn.
        </p>

        <dl className={styles.stats}>
          {STAT_ORDER.map(([key, label]) => (
            <div key={key}>
              <dt>{label}</dt>
              <dd>{SERIES_STATS[key]}</dd>
            </div>
          ))}
        </dl>

        {BOOK_GROUPS.map((group) => (
          <section className={styles.grp} key={group.title}>
            <h2 className={styles.grpHead}>{group.title}</h2>
            <p className={styles.grpDesc}>{group.desc}</p>
            <div className={styles.cards}>
              {group.books.map((book) => (
                <a
                  key={book.file}
                  className={styles.card}
                  style={{ '--c': book.color } as React.CSSProperties}
                  href={`/books/${book.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className={styles.cardTop}>
                    <span className={styles.vn}>VOL {book.vol}</span>
                    <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: book.icon }} />
                  </div>
                  <h3 className={styles.cardTitle}>{book.title}</h3>
                  <div className={styles.meta}>
                    {book.chapters} chương · {book.practice} bài tập · {book.words} từ
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}

        <div className={styles.note}>
          <b>Đọc offline.</b> Mỗi file mang sẵn stylesheet riêng, không cần mạng. Ba webfont lấy từ
          Google Fonts khi bạn online; offline thì trang dùng font hệ thống, không vỡ — chỉ trông
          hơi khác. Mọi tập đều tự theo chế độ sáng/tối của máy.
        </div>

        <footer className={styles.foot}>
          Cuong Hoang · cuongthai.com · First edition, Aug 2026. 887 nguồn dẫn gốc trải khắp bộ sách.
        </footer>
      </div>
    </div>
  );
}
