/**
 * Trình đọc sách của app (05/10/2026) — `/books/<slug>`.
 *
 * Nội dung sách dựng trong SHADOW DOM (xem noiDungSach.ts vì sao không dùng iframe).
 * Thanh trên: quay lại · tên sách + chương đang đọc · % · cỡ chữ · nền · độ rộng ·
 * song ngữ · dấu trang · mục lục. Mục lục bên trái có hai thẻ: Chương / Dấu trang.
 *
 * Đọc tới đâu lưu lên máy chủ mỗi ~30 giây khi ĐANG đọc thật (cửa sổ được chọn +
 * có cuộn/di chuột/gõ phím trong 2 phút gần nhất) — kèm số giây, để mục tiêu ngày
 * và chuỗi ngày đếm đúng thời gian đọc chứ không phải thời gian để app mở.
 * Mở lại cuốn sách là về đúng chỗ (bản lưu trên máy dùng ngay, bản máy chủ nếu mới hơn).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, Bookmark, BookmarkPlus, ChevronLeft, ChevronRight, Languages, List, Loader2, Minus, Plus,
  Sun, Moon, Coffee, MonitorSmartphone, Trash2, X, MoveHorizontal, CheckCircle2,
} from 'lucide-react';
import { collectBookBlockRefs, type BookBlockRef } from '@/lib/bookBlocks';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { CSS_TRINH_DOC, taiBanDich, taiSach, toMauMa, type SachDaChuan } from './noiDungSach';
import {
  docTuyChon, ghiNhip, layTongQuan, luuTuyChon, sachTheoSlug,
  type CheDoNgonNgu, type DauTrang, type NenDoc, type TuyChonDoc,
} from './sachApi';

const NHIP_MS = 30_000;
const NGHI_SAU_MS = 120_000;
const viTriMay = (slug: string) => `ct-sach-vi-tri:${slug}`;

type Chuong = { el: HTMLElement; ten: string };

export function DocSach({ slug }: { slug: string }) {
  const { api, userId } = useSession();
  const { navigate, resolvedTheme } = useAppState();
  const meta = sachTheoSlug(slug);
  const [sach, setSach] = useState<SachDaChuan | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [tuyChon, setTuyChonState] = useState<TuyChonDoc>(docTuyChon);
  const [mucLucMo, setMucLucMo] = useState(() => window.innerWidth > 1100);
  const [theMucLuc, setTheMucLuc] = useState<'chuong' | 'dau'>('chuong');
  const [chuongs, setChuongs] = useState<Chuong[]>([]);
  const [dangO, setDangO] = useState(0);
  const [phanTram, setPhanTram] = useState(0);
  const [dauTrang, setDauTrang] = useState<DauTrang[]>([]);
  const [dangDich, setDangDich] = useState(false);
  const [bangNen, setBangNen] = useState(false);
  const [baoXong, setBaoXong] = useState(false);
  const [thongBao, setThongBao] = useState<string | null>(null);
  const [lanTai, setLanTai] = useState(0);

  const cuonRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const khoiRef = useRef<BookBlockRef[]>([]);
  const banDichRef = useRef<Map<string, string> | null>(null);
  const daBocRef = useRef<WeakSet<HTMLElement>>(new WeakSet());
  const viTriRef = useRef({ chapter: 0, percent: 0 });
  const tuongTacRef = useRef(Date.now());
  const giayChoRef = useRef(0);
  const dauTrangRef = useRef<DauTrang[]>([]);
  const daXongRef = useRef(false);

  const datTuyChon = (t: Partial<TuyChonDoc>) => setTuyChonState((cu) => { const moi = { ...cu, ...t }; luuTuyChon(moi); return moi; });
  const bao = (s: string) => { setThongBao(s); window.setTimeout(() => setThongBao(null), 2400); };

  /* ── Nạp sách ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (userId === null) return;
    let con = true;
    setSach(null); setLoi(null);
    taiSach(userId, slug).then((s) => { if (con) setSach(s); }, () => {
      if (con) setLoi(navigator.onLine ? 'Chưa tải được nội dung sách từ máy chủ.' : 'Bạn đang ngoại tuyến và cuốn này chưa từng mở trên máy — cần mạng cho lần đọc đầu tiên.');
    });
    return () => { con = false; };
  }, [userId, slug, lanTai]);

  /* ── Dựng nội dung vào shadow root ────────────────────────────────── */
  useEffect(() => {
    const host = hostRef.current;
    if (!sach || !host) return;
    const goc = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    goc.innerHTML = `<style>${sach.css}</style><style>${CSS_TRINH_DOC}</style><div class="cts-body">${sach.than}</div>`;
    // Khối văn xuôi + hash TRƯỚC khi đụng gì vào DOM — cùng hàm web dùng để dịch offline.
    khoiRef.current = collectBookBlockRefs(goc as unknown as Document);
    banDichRef.current = null;
    daBocRef.current = new WeakSet();
    toMauMa(goc);
    const ds = Array.from(goc.querySelectorAll<HTMLElement>('.chap-open')).map((el, i) => {
      const h2 = el.querySelector('h2, h1')?.textContent?.replace(/\s+/g, ' ').trim();
      return { el, ten: sach.mucLuc[i]?.ten || h2 || `Chương ${i + 1}` };
    });
    setChuongs(ds);

    // Link trong sách: ra ngoài thì mở trình duyệt, neo nội bộ thì cuộn trong khung đọc.
    const bam = (e: Event) => {
      const a = (e.composedPath().find((n) => (n as HTMLElement).tagName === 'A') as HTMLAnchorElement | undefined);
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      if (!href) return;
      e.preventDefault();
      if (href.startsWith('#')) goc.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      else if (/^https?:/.test(href)) void window.cuongthai?.app.openExternal(href);
    };
    goc.addEventListener('click', bam);

    // Về đúng chỗ đang đọc: bản trên máy dùng NGAY, bản máy chủ nếu mới hơn.
    let viTri = 0;
    try { viTri = Number(JSON.parse(localStorage.getItem(viTriMay(slug)) ?? '{}').p) || 0; } catch { /* bỏ qua */ }
    const ve = (p: number) => {
      const c = cuonRef.current;
      if (!c) return;
      c.scrollTop = (p / 100) * Math.max(0, c.scrollHeight - c.clientHeight);
    };
    requestAnimationFrame(() => requestAnimationFrame(() => ve(viTri)));
    if (api) {
      void layTongQuan(api).then((tq) => {
        const t = tq.sach.find((x) => x.slug === slug);
        if (!t) return;
        setDauTrang(t.bookmarks); dauTrangRef.current = t.bookmarks;
        daXongRef.current = !!t.finishedAt;
        if (Math.abs(t.percent - viTri) > 0.5 && viTri < 0.5) ve(t.percent);
      }).catch(() => undefined);
    }
    return () => goc.removeEventListener('click', bam);
  }, [sach, slug, api]);

  /* ── Nền, cỡ chữ, độ rộng, ngôn ngữ → thuộc tính của host ─────────── */
  const nenThat: 'light' | 'dark' = tuyChon.nen === 'toi' ? 'dark' : tuyChon.nen === 'tu-dong' ? resolvedTheme : 'light';
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.dataset.theme = nenThat;
    if (tuyChon.nen === 'giay') host.dataset.giay = ''; else delete host.dataset.giay;
    host.style.setProperty('--cts-co', String(tuyChon.co));
    host.style.setProperty('--cts-cot', tuyChon.rong === 'rong' ? '96ch' : '74ch');
    host.dataset.lang = sach?.ngonNgu === 'vi' ? 'en' : tuyChon.ngonNgu;
  }, [nenThat, tuyChon, sach]);

  /* ── Song ngữ: nạp bản dịch khi cần, bọc từng khối EN + chèn VI ───── */
  const apBanDich = useCallback(() => {
    const goc = hostRef.current?.shadowRoot;
    const map = banDichRef.current;
    if (!goc || !map) return;
    for (const { el, hash } of khoiRef.current) {
      const vi = map.get(hash);
      if (!vi || daBocRef.current.has(el)) continue;
      if (!el.querySelector(':scope > .ctsEn')) {
        const en = document.createElement('span');
        en.className = 'ctsEn';
        while (el.firstChild) en.appendChild(el.firstChild);
        el.appendChild(en);
      }
      const v = document.createElement('span');
      v.className = 'ctsVi';
      v.innerHTML = vi;
      el.appendChild(v);
      daBocRef.current.add(el);
    }
  }, []);
  useEffect(() => {
    if (!sach || sach.ngonNgu === 'vi' || tuyChon.ngonNgu === 'en' || userId === null) return;
    if (banDichRef.current) { apBanDich(); return; }
    let con = true;
    setDangDich(true);
    taiBanDich(userId, slug)
      .then((m) => { if (!con) return; banDichRef.current = m; apBanDich(); if (!m.size) bao('Cuốn này chưa có bản dịch tiếng Việt.'); })
      .catch(() => { if (con) bao('Chưa tải được bản dịch — kiểm tra mạng rồi thử lại.'); })
      .finally(() => { if (con) setDangDich(false); });
    return () => { con = false; };
  }, [sach, tuyChon.ngonNgu, userId, slug, apBanDich]);

  /* ── Cuộn: % đọc + chương đang đọc ────────────────────────────────── */
  useEffect(() => {
    const c = cuonRef.current;
    if (!c || !chuongs.length) return;
    let raf = 0;
    const tinh = () => {
      raf = 0;
      const max = c.scrollHeight - c.clientHeight;
      const p = max > 0 ? Math.min(100, Math.max(0, (c.scrollTop / max) * 100)) : 0;
      const nguong = c.getBoundingClientRect().top + c.clientHeight * 0.28;
      let i = 0;
      for (let k = 0; k < chuongs.length; k++) { if (chuongs[k]!.el.getBoundingClientRect().top <= nguong) i = k; else break; }
      setPhanTram(p); setDangO(i);
      viTriRef.current = { chapter: i, percent: p };
      try { localStorage.setItem(viTriMay(slug), JSON.stringify({ p, c: i })); } catch { /* bỏ qua */ }
      if (p >= 98 && !daXongRef.current) { daXongRef.current = true; setBaoXong(true); }
    };
    const khiCuon = () => { tuongTacRef.current = Date.now(); if (!raf) raf = requestAnimationFrame(tinh); };
    c.addEventListener('scroll', khiCuon, { passive: true });
    tinh();
    return () => { c.removeEventListener('scroll', khiCuon); if (raf) cancelAnimationFrame(raf); };
  }, [chuongs, slug]);

  /* ── Nhịp lưu tiến độ + đếm giây đọc thật ─────────────────────────── */
  useEffect(() => {
    if (!api || !sach) return;
    const tuongTac = () => { tuongTacRef.current = Date.now(); };
    window.addEventListener('mousemove', tuongTac, { passive: true });
    window.addEventListener('keydown', tuongTac);
    let truoc = Date.now();
    const dem = window.setInterval(() => {
      const bay = Date.now();
      const dangDoc = document.visibilityState === 'visible' && document.hasFocus() && bay - tuongTacRef.current < NGHI_SAU_MS;
      if (dangDoc) giayChoRef.current += Math.min(5, Math.round((bay - truoc) / 1000));
      truoc = bay;
    }, 5000);
    const gui = () => {
      const giay = Math.min(90, giayChoRef.current);
      giayChoRef.current -= giay;
      void ghiNhip(api, slug, { ...viTriRef.current, giay }).catch(() => { giayChoRef.current += giay; });
    };
    const nhip = window.setInterval(gui, NHIP_MS);
    return () => {
      window.removeEventListener('mousemove', tuongTac);
      window.removeEventListener('keydown', tuongTac);
      window.clearInterval(dem); window.clearInterval(nhip);
      gui(); // rời trang: lưu vị trí cuối + giây còn lại
    };
  }, [api, sach, slug]);

  /* ── Điều hướng chương + phím tắt ─────────────────────────────────── */
  const toiChuong = useCallback((i: number) => {
    const ch = chuongs[Math.max(0, Math.min(chuongs.length - 1, i))];
    ch?.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [chuongs]);
  useEffect(() => {
    const phim = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight' || e.key === ']') { e.preventDefault(); toiChuong(dangO + 1); }
      else if (e.key === 'ArrowLeft' || e.key === '[') { e.preventDefault(); toiChuong(dangO - 1); }
      else if (e.key === 'm') setMucLucMo((v) => !v);
      else if (e.key === 'b') themDauTrang();
      else if (e.key === '=' || e.key === '+') datTuyChon({ co: Math.min(1.5, +(tuyChon.co + 0.1).toFixed(2)) });
      else if (e.key === '-') datTuyChon({ co: Math.max(0.8, +(tuyChon.co - 0.1).toFixed(2)) });
    };
    window.addEventListener('keydown', phim);
    return () => window.removeEventListener('keydown', phim);
  });

  /* ── Dấu trang ────────────────────────────────────────────────────── */
  const luuDauTrang = (ds: DauTrang[]) => {
    setDauTrang(ds); dauTrangRef.current = ds;
    if (api) void ghiNhip(api, slug, { ...viTriRef.current, giay: 0, bookmarks: ds }).catch(() => bao('Chưa lưu được dấu trang lên máy chủ.'));
  };
  function themDauTrang() {
    const { chapter, percent } = viTriRef.current;
    if (dauTrangRef.current.some((d) => Math.abs(d.p - percent) < 0.3)) { bao('Chỗ này đã có dấu trang.'); return; }
    const moi = [...dauTrangRef.current, { p: +percent.toFixed(2), c: chapter, t: chuongs[chapter]?.ten ?? '', at: new Date().toISOString() }].sort((a, b) => a.p - b.p);
    luuDauTrang(moi);
    bao('Đã thêm dấu trang.');
  }
  const toiDauTrang = (d: DauTrang) => {
    const c = cuonRef.current;
    if (c) c.scrollTo({ top: (d.p / 100) * (c.scrollHeight - c.clientHeight), behavior: 'smooth' });
  };

  const chuongHienTai = chuongs[dangO]?.ten ?? '';
  const sachEn = sach?.ngonNgu === 'en';
  const nenIcon = useMemo(() => ({ 'tu-dong': <MonitorSmartphone size={15} />, sang: <Sun size={15} />, giay: <Coffee size={15} />, toi: <Moon size={15} /> }), []);

  return (
    <div className="sd" data-nen={tuyChon.nen === 'giay' ? 'giay' : nenThat}>
      <header className="sd-thanh">
        <button type="button" className="sd-nut" onClick={() => navigate('/books')} aria-label="Về thư viện" title="Về thư viện"><ArrowLeft size={17} /></button>
        <button type="button" className="sd-nut" data-bat={mucLucMo || undefined} onClick={() => setMucLucMo((v) => !v)} aria-label="Mục lục" title="Mục lục (M)"><List size={17} /></button>
        <div className="sd-ten">
          <b>{meta?.title ?? sach?.tieuDe ?? slug}</b>
          <small>{chuongHienTai || (sach ? 'Bìa & lời mở đầu' : 'Đang mở sách…')}</small>
        </div>
        <div className="sd-cong-cu">
          <span className="sd-pt">{Math.round(phanTram)}%</span>
          <div className="sd-nhom" role="group" aria-label="Cỡ chữ">
            <button type="button" onClick={() => datTuyChon({ co: Math.max(0.8, +(tuyChon.co - 0.1).toFixed(2)) })} aria-label="Chữ nhỏ hơn" title="Chữ nhỏ hơn (−)"><Minus size={14} /></button>
            <span>{Math.round(tuyChon.co * 100)}%</span>
            <button type="button" onClick={() => datTuyChon({ co: Math.min(1.5, +(tuyChon.co + 0.1).toFixed(2)) })} aria-label="Chữ to hơn" title="Chữ to hơn (+)"><Plus size={14} /></button>
          </div>
          <button type="button" className="sd-nut" data-bat={tuyChon.rong === 'rong' || undefined} onClick={() => datTuyChon({ rong: tuyChon.rong === 'rong' ? 'vua' : 'rong' })} title={tuyChon.rong === 'rong' ? 'Cột đọc vừa' : 'Cột đọc rộng'} aria-label="Độ rộng cột"><MoveHorizontal size={16} /></button>
          <div className="sd-bao-nen">
            <button type="button" className="sd-nut" onClick={() => setBangNen((v) => !v)} aria-label="Nền trang" title="Nền trang">{nenIcon[tuyChon.nen]}</button>
            {bangNen && (
              <div className="sd-bang-nen" onMouseLeave={() => setBangNen(false)}>
                {(['tu-dong', 'sang', 'giay', 'toi'] as NenDoc[]).map((n) => (
                  <button key={n} type="button" data-chon={tuyChon.nen === n || undefined} onClick={() => { datTuyChon({ nen: n }); setBangNen(false); }}>
                    <span className="sd-mau" data-nen={n} />{nenIcon[n]} {{ 'tu-dong': 'Theo app', sang: 'Sáng', giay: 'Giấy ngà', toi: 'Tối' }[n]}
                  </button>
                ))}
              </div>
            )}
          </div>
          {sachEn && (
            <div className="sd-nhom sd-ngon" role="group" aria-label="Ngôn ngữ">
              <Languages size={14} />
              {(['en', 'bi', 'vi'] as CheDoNgonNgu[]).map((l) => (
                <button key={l} type="button" data-chon={tuyChon.ngonNgu === l || undefined} onClick={() => datTuyChon({ ngonNgu: l })}>{{ en: 'EN', bi: 'Song ngữ', vi: 'VI' }[l]}</button>
              ))}
              {dangDich && <Loader2 size={13} className="ct-spin" />}
            </div>
          )}
          <button type="button" className="sd-nut sd-nut-chinh" onClick={themDauTrang} aria-label="Thêm dấu trang" title="Thêm dấu trang (B)"><BookmarkPlus size={16} /></button>
        </div>
      </header>
      <div className="sd-vach"><i style={{ width: `${phanTram}%` }} /></div>

      <div className="sd-than">
        {mucLucMo && (
          <aside className="sd-muc-luc">
            <div className="sd-the">
              <button type="button" data-chon={theMucLuc === 'chuong' || undefined} onClick={() => setTheMucLuc('chuong')}>Chương <small>{chuongs.length}</small></button>
              <button type="button" data-chon={theMucLuc === 'dau' || undefined} onClick={() => setTheMucLuc('dau')}>Dấu trang <small>{dauTrang.length}</small></button>
            </div>
            {theMucLuc === 'chuong' ? (
              <ol className="sd-ds">
                {chuongs.map((c, i) => (
                  <li key={i}>
                    <button type="button" data-dang={i === dangO || undefined} data-qua={i < dangO || undefined} onClick={() => toiChuong(i)}>
                      <span className="sd-so">{i < dangO ? <CheckCircle2 size={13} /> : i + 1}</span>
                      <span className="sd-ds-ten">{c.ten}</span>
                    </button>
                  </li>
                ))}
              </ol>
            ) : dauTrang.length === 0 ? (
              <p className="sd-trong"><Bookmark size={22} /><br />Chưa có dấu trang. Bấm <BookmarkPlus size={13} /> hoặc phím <kbd>B</kbd> để đánh dấu chỗ đang đọc.</p>
            ) : (
              <ul className="sd-ds">
                {dauTrang.map((d) => (
                  <li key={d.at} className="sd-dau">
                    <button type="button" onClick={() => toiDauTrang(d)}>
                      <span className="sd-so"><Bookmark size={13} /></span>
                      <span className="sd-ds-ten">{d.t || 'Bìa & mở đầu'}<small>{Math.round(d.p)}% · {new Date(d.at).toLocaleDateString('vi-VN')}</small></span>
                    </button>
                    <button type="button" className="sd-xoa" onClick={() => luuDauTrang(dauTrang.filter((x) => x.at !== d.at))} aria-label="Xoá dấu trang"><Trash2 size={13} /></button>
                  </li>
                ))}
              </ul>
            )}
            <p className="sd-meo">Phím tắt: <kbd>←</kbd> <kbd>→</kbd> chương · <kbd>M</kbd> mục lục · <kbd>B</kbd> dấu trang · <kbd>+</kbd> <kbd>−</kbd> cỡ chữ</p>
          </aside>
        )}
        <div className="sd-cuon" ref={cuonRef}>
          {loi ? (
            <div className="sd-loi">
              <p>{loi}</p>
              <div className="sd-xong-nut">
                <button type="button" className="sd-nut-chu sd-nut-chinh" onClick={() => setLanTai((n) => n + 1)}>Thử lại</button>
                <button type="button" className="sd-nut-chu" onClick={() => navigate('/books')}>Về thư viện</button>
              </div>
            </div>
          ) : !sach ? (
            <div className="sd-cho"><Loader2 size={22} className="ct-spin" /><span>Đang mở “{meta?.title ?? slug}”…</span></div>
          ) : null}
          <div ref={hostRef} className="sd-host" hidden={!sach} />
          {sach && chuongs.length > 0 && (
            <nav className="sd-chuyen">
              <button type="button" disabled={dangO === 0} onClick={() => toiChuong(dangO - 1)}><ChevronLeft size={16} /> Chương trước</button>
              <button type="button" disabled={dangO >= chuongs.length - 1} onClick={() => toiChuong(dangO + 1)}>Chương sau <ChevronRight size={16} /></button>
            </nav>
          )}
        </div>
      </div>

      {thongBao && <div className="sd-bao" role="status">{thongBao}</div>}
      {baoXong && (
        <div className="sd-xong" role="dialog" aria-label="Đọc xong">
          <div>
            <span className="sd-xong-icon">🎉</span>
            <b>Bạn đã đọc xong “{meta?.title ?? sach?.tieuDe}”!</b>
            <p>Một cuốn sách nữa trong thư viện của bạn. Ghé lại chương bạn thích bất cứ lúc nào qua mục lục và dấu trang.</p>
            <div className="sd-xong-nut">
              <button type="button" className="sd-nut-chu" onClick={() => setBaoXong(false)}>Đọc tiếp</button>
              <button type="button" className="sd-nut-chu sd-nut-chinh" onClick={() => navigate('/books')}>Chọn cuốn tiếp theo</button>
            </div>
          </div>
          <button type="button" className="sd-xong-dong" onClick={() => setBaoXong(false)} aria-label="Đóng"><X size={16} /></button>
        </div>
      )}
    </div>
  );
}
