'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, List, X, ChevronUp } from 'lucide-react';
import type { TocItem } from './page';
import styles from './reader.module.css';

export default function BookReader({ slug, title, toc }: { slug: string; title: string; toc: TocItem[] }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const chapsRef = useRef<HTMLElement[]>([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tocOpen, setTocOpen] = useState(true);
  const [ready, setReady] = useState(false);

  // Mặc định đóng mục lục trên màn hẹp (đọc trước, mở mục lục khi cần).
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 900) setTocOpen(false);
  }, []);

  const wireIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    let win: Window | null = null;
    let onScroll: (() => void) | null = null;
    try {
      const doc = iframe.contentDocument;
      win = iframe.contentWindow;
      if (!doc || !win) return;

      // CSS chèn vào TRONG sách: bỏ nút back hỏng của sách, cuộn mượt, chừa lề
      // trên để scrollIntoView không dính mép, và canh khối .page cho cân.
      const st = doc.createElement('style');
      st.textContent = `
        html { scroll-behavior: smooth; }
        .cv-back { display: none !important; }
        .chap-open { scroll-margin-top: 24px; }
        /* Canh giữa + nới rộng cột đọc. Sách vốn để cột .col hẹp (74ch) canh trái
           trong .page 1080px mà KHÔNG có margin-note (đã kiểm 25/25) → nhìn nhỏ,
           thừa hai bên. Bỏ giới hạn .page, cho .col rộng ~92ch và luôn canh GIỮA
           khung → dùng hết khung hình, dễ đọc, hết cảnh lệch trái. */
        .page, .fm, .chap { max-width: none !important; }
        .col {
          max-width: min(92ch, calc(100% - 72px)) !important;
          margin-left: auto !important;
          margin-right: auto !important;
          width: auto !important;
        }
      `;
      doc.head.appendChild(st);

      // Gán id cho từng chương (.chap-open phổ quát khắp 25 cuốn) để nhảy tới.
      const chaps = Array.from(doc.querySelectorAll<HTMLElement>('.chap-open'));
      chaps.forEach((el, i) => { if (!el.id) el.id = `ct-chap-${i}`; });
      chapsRef.current = chaps;

      const scroller = (doc.scrollingElement || doc.documentElement) as HTMLElement;
      onScroll = () => {
        const top = scroller.scrollTop;
        const max = scroller.scrollHeight - scroller.clientHeight;
        setProgress(max > 0 ? Math.min(100, Math.max(0, (top / max) * 100)) : 0);
        // Chương hiện tại = .chap-open cuối cùng có mép trên đã vượt qua ~1/4 màn.
        const threshold = (win?.innerHeight || 800) * 0.28;
        let idx = 0;
        for (let i = 0; i < chaps.length; i++) {
          if (chaps[i].getBoundingClientRect().top <= threshold) idx = i;
          else break;
        }
        setActive(idx);
      };
      win.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      setReady(true);
    } catch {
      // Same-origin nên không nên xảy ra; nếu có thì vẫn hiện sách, chỉ mất scroll-spy.
      setReady(true);
    }
    return () => { if (win && onScroll) win.removeEventListener('scroll', onScroll); };
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    let cleanup: void | (() => void);
    const onLoad = () => { cleanup = wireIframe(); };
    iframe.addEventListener('load', onLoad);
    // Nếu iframe đã load sẵn (cache), gọi luôn.
    if (iframe.contentDocument?.readyState === 'complete') onLoad();
    return () => {
      iframe.removeEventListener('load', onLoad);
      if (typeof cleanup === 'function') cleanup();
    };
  }, [wireIframe, slug]);

  const jump = (i: number) => {
    const el = chapsRef.current[i];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof window !== 'undefined' && window.innerWidth < 900) setTocOpen(false);
  };

  const toTop = () => {
    const doc = iframeRef.current?.contentDocument;
    (doc?.scrollingElement || doc?.documentElement)?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.reader}>
      <div className={styles.progressTrack}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>

      <header className={styles.bar}>
        <Link href="/books" className={styles.back}>
          <ArrowLeft size={16} />
          <span>Library</span>
        </Link>
        <button
          className={styles.tocToggle}
          onClick={() => setTocOpen((v) => !v)}
          aria-label={tocOpen ? 'Ẩn mục lục' : 'Hiện mục lục'}
          aria-expanded={tocOpen}
        >
          {tocOpen ? <X size={17} /> : <List size={17} />}
        </button>
        <div className={styles.barTitle} title={title}>{title}</div>
        <div className={styles.barPct}>{Math.round(progress)}%</div>
      </header>

      <div className={styles.body}>
        <nav className={`${styles.toc} ${tocOpen ? '' : styles.tocClosed}`} aria-label="Mục lục chương">
          <div className={styles.tocHead}>Contents · {toc.length} chapters</div>
          <ol className={styles.tocList}>
            {toc.map((c, i) => (
              <li key={i}>
                <button
                  className={i === active ? styles.tocActive : ''}
                  onClick={() => jump(i)}
                  disabled={!ready}
                >
                  <span className={styles.tocN}>{c.n}</span>
                  <span className={styles.tocT}>{c.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {tocOpen && <div className={styles.scrim} onClick={() => setTocOpen(false)} aria-hidden />}

        <div className={styles.stage}>
          <iframe
            ref={iframeRef}
            className={styles.frame}
            src={`/books/${slug}.html`}
            title={title}
          />
        </div>
      </div>

      <button className={styles.top} onClick={toTop} aria-label="Lên đầu sách">
        <ChevronUp size={18} />
      </button>
    </div>
  );
}
