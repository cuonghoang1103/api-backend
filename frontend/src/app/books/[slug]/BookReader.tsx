'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, List, X, ChevronUp } from 'lucide-react';
import type { TocItem } from './page';
import styles from './reader.module.css';
import { collectBookBlockRefs, type BookBlockRef } from '@/lib/bookBlocks';

type LangMode = 'en' | 'bi' | 'vi';
const LANG_KEY = 'cts-books-lang';

// Mọi liên kết trong sách phải mở TAB MỚI. Không có id/anchor nội bộ nào
// dùng href="#..." (đã kiểm 25/25 cuốn) nên không mất điều hướng gì khi ép
// hết ra ngoài. Lý do bắt buộc: điều hướng NGAY TRONG khung đọc (iframe) thì
// (a) link ra ngoài domain thường bị X-Frame-Options/CSP của trang đích chặn
// nhúng iframe → Chrome hiện "This content is blocked" + trắng trang, (b)
// link nội bộ cuongthai.com thay hẳn nội dung trong khung đọc trong khi
// thanh trên/mục lục vẫn hiện như đang đọc sách → rối, không "Back" được về
// đúng chỗ. Gọi lại mỗi lần chèn bản dịch (không chỉ lúc nạp trang) vì bản
// dịch giữ nguyên thẻ <a> gốc bên trong — đó là thẻ MỚI, chưa được xử lý.
function openLinksInNewTab(doc: Document) {
  doc.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (!href || href.startsWith('javascript:')) return;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
}

export default function BookReader({ slug, title, toc }: { slug: string; title: string; toc: TocItem[] }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const chapsRef = useRef<HTMLElement[]>([]);
  const blocksRef = useRef<BookBlockRef[]>([]);
  const viMapRef = useRef<Map<string, string> | null>(null);
  const wrappedRef = useRef<WeakSet<HTMLElement>>(new WeakSet());
  const langRef = useRef<LangMode>('en');
  const loadingRef = useRef(false);
  // wireIframe() là useCallback([]) ổn định — nó gọi qua ref này để luôn
  // dùng bản mới nhất của ensureLangApplied (đóng gói đúng `slug` hiện tại)
  // mà không phải liệt kê nó vào dependency của wireIframe.
  const ensureLangAppliedRef = useRef<() => void>(() => {});
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tocOpen, setTocOpen] = useState(true);
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState<LangMode>('en');
  const [viLoading, setViLoading] = useState(false);
  // Tiêu đề chương đã dịch, cho mục lục — tra theo hash của CHÍNH thẻ <h2>
  // đầu chương (đã có sẵn trong bản dịch nội dung), không so khớp chữ với
  // toc-t gốc (hai chữ đôi khi không giống hệt nhau ở ~half số chương).
  const [tocVi, setTocVi] = useState<(string | null)[] | null>(null);

  // Mặc định đóng mục lục trên màn hẹp (đọc trước, mở mục lục khi cần).
  // Đọc lựa chọn ngôn ngữ đã lưu (song ngữ là sở thích chung của người đọc,
  // không phải riêng từng cuốn).
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 900) setTocOpen(false);
    try {
      const saved = window.localStorage.getItem(LANG_KEY);
      if (saved === 'en' || saved === 'bi' || saved === 'vi') setLang(saved);
    } catch {
      // localStorage có thể bị chặn (chế độ riêng tư) — cứ dùng mặc định EN.
    }
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
        /* Song ngữ: đoạn VI chèn ngay dưới đoạn EN gốc, chữ dịu + viền trái
           màu nhũ. Dùng cơ chế theme SẴN CÓ của chính cuốn sách
           (prefers-color-scheme / [data-theme]) — không đụng gì ngoài nó. */
        :root { --cts-gold: oklch(52% 0.13 82); }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) { --cts-gold: oklch(80% 0.12 82); }
        }
        :root[data-theme="dark"] { --cts-gold: oklch(80% 0.12 82); }
        .ctsVi {
          display: none;
          margin-top: 0.45em;
          padding: 1px 0 1px 14px;
          border-left: 2px solid var(--cts-gold);
          color: var(--ink-soft, inherit);
        }
        html[data-book-lang="vi"] .ctsEn { display: none; }
        html[data-book-lang="vi"] .ctsVi,
        html[data-book-lang="bi"] .ctsVi { display: block; }
      `;
      doc.head.appendChild(st);

      // Gán id cho từng chương (.chap-open phổ quát khắp 25 cuốn) để nhảy tới.
      const chaps = Array.from(doc.querySelectorAll<HTMLElement>('.chap-open'));
      chaps.forEach((el, i) => { if (!el.id) el.id = `ct-chap-${i}`; });
      chapsRef.current = chaps;

      openLinksInNewTab(doc);

      // Trích khối văn xuôi + hash NGAY LÚC NÀY (trước khi có bản dịch nào
      // được chèn) — cùng hàm dùng để dịch offline, nên hash luôn khớp.
      blocksRef.current = collectBookBlockRefs(doc);
      viMapRef.current = null;
      wrappedRef.current = new WeakSet();
      setTocVi(null);
      doc.documentElement.dataset.bookLang = langRef.current;
      // Sách vừa nạp lại (đổi cuốn, hoặc lần đầu mở) — nếu người đọc đã chọn
      // song ngữ/VI từ trước, nạp/áp lại bản dịch cho ĐÚNG cuốn này ngay.
      ensureLangAppliedRef.current();

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

  // Chèn bản dịch vào các khối đã khớp hash (còn khối nào không khớp thì cứ
  // để nguyên EN — thà thiếu một đoạn còn hơn lệch cả cuốn).
  const applyTranslations = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    const map = viMapRef.current;
    if (!doc || !map) return;
    let matched = 0;
    for (const { el, hash } of blocksRef.current) {
      const vi = map.get(hash);
      if (!vi) continue;
      matched++;
      if (wrappedRef.current.has(el)) continue;
      if (!el.querySelector(':scope > .ctsEn')) {
        const enWrap = doc.createElement('span');
        enWrap.className = 'ctsEn';
        while (el.firstChild) enWrap.appendChild(el.firstChild);
        el.appendChild(enWrap);
      }
      const viWrap = doc.createElement('span');
      viWrap.className = 'ctsVi';
      viWrap.innerHTML = vi;
      el.appendChild(viWrap);
      wrappedRef.current.add(el);
    }
    // Bản dịch giữ nguyên thẻ <a href> gốc bên trong — đó là link MỚI vừa
    // chèn, chưa qua vòng xử lý target=_blank lúc nạp trang.
    openLinksInNewTab(doc);
    if (blocksRef.current.length && matched < blocksRef.current.length) {
      console.warn(
        `[books/i18n] "${slug}": chỉ khớp ${matched}/${blocksRef.current.length} khối — phần còn lại giữ nguyên EN.`,
      );
    }

    // Mục lục: mỗi chương trong chapsRef ứng ĐÚNG 1-1 (cùng thứ tự DOM) với
    // toc prop — tra bản dịch tiêu đề qua hash của chính thẻ <h2> đầu
    // chương đó, không so chữ với TOC gốc (đã kiểm 25/25 cuốn, ~50% số
    // chương có chữ TOC hơi khác chữ <h2> thật). Dùng hash đã lưu SẴN trong
    // blocksRef (tính lúc DOM còn nguyên, trước khi chèn bản dịch) — KHÔNG
    // tính lại từ h2.textContent ở đây, vì nếu h2 đã được áp dụng bản dịch
    // ở vòng lặp trên rồi thì textContent lúc này đã lẫn cả EN+VI (span ẩn
    // vẫn tính vào textContent dù CSS display:none).
    setTocVi(
      chapsRef.current.map((chap) => {
        const h2 = chap.querySelector('h2');
        if (!h2) return null;
        const ref = blocksRef.current.find((b) => b.el === h2);
        return ref ? (map.get(ref.hash) ?? null) : null;
      }),
    );
  }, [slug]);

  // Nạp file dịch tĩnh (lười — chỉ gọi khi người đọc thật sự bật song ngữ/VI).
  const loadTranslation = useCallback(() => {
    if (viMapRef.current || loadingRef.current) return;
    loadingRef.current = true;
    setViLoading(true);
    fetch(`/books/i18n/${slug}.vi.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: { blocks?: { h: string; vi: string }[] }) => {
        const map = new Map<string, string>();
        for (const b of data.blocks || []) map.set(b.h, b.vi);
        viMapRef.current = map;
        applyTranslations();
      })
      .catch((err) => {
        console.warn(`[books/i18n] Không nạp được bản dịch cho "${slug}":`, err);
        viMapRef.current = new Map(); // đừng thử lại liên tục trong phiên này
      })
      .finally(() => {
        loadingRef.current = false;
        setViLoading(false);
      });
  }, [slug, applyTranslations]);

  const ensureLangApplied = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (doc?.documentElement) doc.documentElement.dataset.bookLang = langRef.current;
    if (langRef.current === 'en') return;
    if (viMapRef.current) applyTranslations();
    else loadTranslation();
  }, [applyTranslations, loadTranslation]);

  useEffect(() => {
    ensureLangAppliedRef.current = ensureLangApplied;
  }, [ensureLangApplied]);

  // Người đọc bấm đổi chế độ (hoặc lựa chọn đã lưu vừa nạp lúc mount).
  useEffect(() => {
    langRef.current = lang;
    ensureLangApplied();
  }, [lang, ensureLangApplied]);

  const setLangMode = (next: LangMode) => {
    setLang(next);
    try {
      window.localStorage.setItem(LANG_KEY, next);
    } catch {
      // riêng tư/chặn storage — chỉ mất ghi nhớ, không chặn tính năng
    }
  };

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
        <div className={styles.langSeg} role="group" aria-label="Ngôn ngữ đọc">
          {([
            ['en', 'EN', 'Chỉ tiếng Anh'],
            ['bi', 'EN+VI', 'Song ngữ Anh – Việt'],
            ['vi', 'VI', 'Chỉ tiếng Việt'],
          ] as const).map(([mode, label, ariaLabel]) => (
            <button
              key={mode}
              className={`${styles.langBtn} ${lang === mode ? styles.langBtnActive : ''}`}
              aria-pressed={lang === mode}
              aria-label={ariaLabel}
              onClick={() => setLangMode(mode)}
            >
              {label}
              {mode !== 'en' && lang === mode && viLoading && <span className={styles.langLoading} aria-hidden />}
            </button>
          ))}
        </div>
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
                  {lang !== 'en' && tocVi?.[i] ? (
                    <span className={styles.tocT} dangerouslySetInnerHTML={{ __html: tocVi[i]! }} />
                  ) : (
                    <span className={styles.tocT}>{c.title}</span>
                  )}
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
