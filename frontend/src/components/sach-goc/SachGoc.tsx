'use client';

/**
 * 📷 Sách gốc — xem từng trang sách できる日本語 (ảnh scan thật), cạnh mỗi
 * trang là hướng dẫn học trang đó + gia sư AI nhìn đúng ảnh trang.
 *
 * CHỈ tài khoản được phép (SACH_RIENG_USER_IDS / ADMIN — xem
 * src/services/sachRieng/). Người khác vào thẳng URL thì thấy lời báo, còn API
 * trả 403. Mọi mục cũ của khoá (Theo sách viết lại, hội thoại SVG…) giữ nguyên;
 * đây là phần THÊM.
 *
 * URL: `?trang=17` · `?bai=1&muc=hoi-thoai` · `&tu=<id bài>` để nút quay lại
 * về đúng bài đang học.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ChevronLeft, ChevronRight, List, X, ZoomIn, ZoomOut, Maximize, MoveHorizontal, Sparkles, BookOpen, Contrast,
} from 'lucide-react';
import api from '@/lib/api';
import { useLangUser } from '@/components/language/primitives';
import { GiaSu, type Turn } from '@/components/sach-hoc/GiaSu';
import { AI_TIMEOUT, setDefaultVoice } from '@/components/sach-hoc/audio';
import type { TutorAsk } from '@/components/sach-hoc/tutorContext';
import cs from '@/components/sach-hoc/course.module.css';
import { TrangAnh } from './TrangAnh';
import { AnhNho } from './AnhNho';
import { HuongDanPanel } from './HuongDanPanel';
import {
  TEN_MUC, layHuongDan, layMucLuc, nhanMuc, timTrang, useQuyenSachRieng, type HuongDan, type LoaiMuc, type MucLuc,
} from './useSachRieng';
import st from './sachGoc.module.css';

const NHO_KEY = 'sachgoc:dekiru:trang';
const SO_TRANG = 304;

function tenPhan(ml: MucLuc | null, p: number): string {
  if (!ml) return '';
  const b = ml.bai.find((x) => p >= x.tu && p <= x.den);
  if (b) return `Bài ${b.n}`;
  return ml.phan.find((x) => p >= x.tu && p <= x.den)?.ten ?? '';
}

export default function SachGoc() {
  const { isAuthenticated } = useLangUser();
  const coQuyen = useQuyenSachRieng();
  const [ml, setMl] = useState<MucLuc | null>(null);
  const [p, setP] = useState<number | null>(null);
  const [tu, setTu] = useState<string | null>(null);
  const [fit, setFit] = useState<'man' | 'ngang'>('man');
  const [z, setZ] = useState(1);
  const [daoMau, setDaoMau] = useState(false);
  const [tab, setTab] = useState<'hd' | 'ai'>('hd');
  const [tocMo, setTocMo] = useState(false);
  const [hd, setHd] = useState<HuongDan | null>(null);
  const [hdTai, setHdTai] = useState(true);
  const [hdLoi, setHdLoi] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [asking, setAsking] = useState(false);
  const [selection, setSelection] = useState('');
  const benRef = useRef<HTMLElement>(null);

  useEffect(() => { setDefaultVoice('ja-nu'); }, []);
  // Điện thoại: vừa ngang dễ đọc hơn vừa màn (trang dọc trên màn hẹp bé tí).
  useEffect(() => { if (window.innerWidth < 900) setFit('ngang'); }, []);

  useEffect(() => {
    if (!coQuyen) return;
    layMucLuc().then(setMl).catch(() => setMl(null));
  }, [coQuyen]);

  // Trang mở đầu: ?trang= → ?bai=&muc= → trang đọc dở lần trước → trang 15 (Bài 1).
  useEffect(() => {
    if (!ml || p !== null) return;
    const q = new URLSearchParams(window.location.search);
    setTu(q.get('tu'));
    const t = Number(q.get('trang'));
    const bai = Number(q.get('bai'));
    let dau = 15;
    if (t >= 1 && t <= SO_TRANG) dau = t;
    else if (bai >= 1 && bai <= 15) dau = timTrang(ml, bai, (q.get('muc') as LoaiMuc) || undefined);
    else {
      try { const v = Number(localStorage.getItem(NHO_KEY)); if (v >= 1 && v <= SO_TRANG) dau = v; } catch { /* riêng tư */ }
    }
    setP(dau);
  }, [ml, p]);

  const den = useCallback((q: number) => {
    const n = Math.min(SO_TRANG, Math.max(1, Math.round(q)));
    setP(n);
    setZ(1);
    setTocMo(false);
    setTurns([]);
    setSelection('');
  }, []);
  const truoc = useCallback(() => p && p > 1 && den(p - 1), [p, den]);
  const sau = useCallback(() => p && p < SO_TRANG && den(p + 1), [p, den]);

  // Đồng bộ URL + nhớ trang (tiện riêng máy này).
  useEffect(() => {
    if (!p) return;
    const url = new URL(window.location.href);
    ['bai', 'muc'].forEach((k) => url.searchParams.delete(k));
    url.searchParams.set('trang', String(p));
    window.history.replaceState(null, '', url);
    try { localStorage.setItem(NHO_KEY, String(p)); } catch { /* riêng tư */ }
  }, [p]);

  useEffect(() => {
    if (!p || !coQuyen) return;
    let live = true;
    setHdTai(true);
    setHdLoi(false);
    layHuongDan(p).then(
      (h) => { if (live) { setHd(h); setHdTai(false); } },
      () => { if (live) { setHdLoi(true); setHdTai(false); } },
    );
    return () => { live = false; };
  }, [p, coQuyen]);

  // Phím: ← → lật, + − phóng.
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowLeft') truoc();
      else if (e.key === 'ArrowRight') sau();
      else if (e.key === '+' || e.key === '=') setZ((v) => Math.min(4, v * 1.25));
      else if (e.key === '-') setZ((v) => Math.max(1, v / 1.25));
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [truoc, sau]);

  // Chữ bôi đen trong khung hướng dẫn → gia sư hỏi đúng chỗ đó.
  useEffect(() => {
    const on = () => {
      const s = window.getSelection();
      const t = s?.toString().trim() ?? '';
      if (t && s?.anchorNode && benRef.current?.contains(s.anchorNode)) setSelection(t.slice(0, 400));
    };
    document.addEventListener('selectionchange', on);
    return () => document.removeEventListener('selectionchange', on);
  }, []);

  const ask = useCallback(async (a: TutorAsk) => {
    if (!p) return;
    setTab('ai');
    const q = selection && !a.chu ? `${a.label} — “${selection.slice(0, 60)}${selection.length > 60 ? '…' : ''}”` : a.label;
    setAsking(true);
    setTurns((t) => [...t, { q, a: null }]);
    const finish = (patch: Partial<Turn>) => setTurns((t) => t.map((x, i) => (i === t.length - 1 ? { ...x, ...patch } : x)));
    try {
      const res = await api.post('/sach-rieng/dekiru/hoi', {
        trang: p,
        ...(a.y ? { y: a.y } : {}),
        ...(a.cauHoi ? { cauHoi: a.cauHoi.slice(0, 500) } : {}),
        ...(selection ? { chu: selection } : {}),
        lichSu: turns.filter((x) => x.a).slice(-3).map((x) => ({ q: x.q, a: x.a })),
      }, AI_TIMEOUT);
      const d = res.data?.data as { traLoi: string | null; lyDo?: string } | undefined;
      if (d?.traLoi) finish({ a: d.traLoi });
      else finish({ err: d?.lyDo === 'ai_unavailable' ? 'Gia sư AI đang tạm tắt. Bạn thử lại sau nhé.' : 'Gia sư chưa trả lời được. Thử hỏi lại nhé.' });
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      finish({ err: msg || 'Không kết nối được tới gia sư. Kiểm tra mạng rồi thử lại.' });
    } finally {
      setAsking(false);
      setSelection('');
    }
  }, [p, selection, turns]);

  const baiHienTai = ml && p ? ml.bai.find((b) => p >= b.tu && p <= b.den) ?? null : null;
  const baiCuaPoint = useCallback((n: number) => ml?.bai.find((b) => n >= b.point[0] && n <= b.point[1])?.n ?? null, [ml]);

  /** Mục lục của phần đang mở: mỗi trang một dòng, kèm các mục trên trang. */
  const dongMucLuc = useMemo(() => {
    if (!ml || !p) return [];
    const khoang = baiHienTai ?? ml.phan.find((x) => p >= x.tu && p <= x.den) ?? { tu: 1, den: 14 };
    return ml.trang.filter((t) => t.p >= khoang.tu && t.p <= khoang.den);
  }, [ml, p, baiHienTai]);

  const veBai = tu ? `/language/ja/dekiru?bai=${encodeURIComponent(tu)}` : '/language/ja/dekiru';

  if (coQuyen === false || (!isAuthenticated && coQuyen !== null)) {
    return (
      <div className={`${cs.root} ${st.chan}`}>
        <div className={st.chanHop}>
          <BookOpen size={28} />
          <h1>Mục này không mở cho tài khoản của bạn</h1>
          <p>Khoá học vẫn đầy đủ ở trang chính: hội thoại, từ vựng, ngữ pháp, 📖 Theo sách…</p>
          <Link href="/language/ja/dekiru" className={cs.btn}>Về khoá できる日本語</Link>
        </div>
      </div>
    );
  }

  const tocNode = (
    <>
      <div className={st.tocDau}>
        <b>Mục lục sách</b>
        <button type="button" className={`${cs.iconBtn} ${st.chiDienThoai}`} onClick={() => setTocMo(false)} aria-label="Đóng"><X size={18} /></button>
      </div>
      <div className={st.dsBai}>
        {ml?.bai.map((b) => (
          <button key={b.n} type="button" className={`${st.baiChip} ${baiHienTai?.n === b.n ? st.baiOn : ''}`} onClick={() => den(b.tu)}>
            {b.n}
          </button>
        ))}
      </div>
      <div className={st.dsPhan}>
        {ml?.phan.map((x) => (
          <button key={x.ten} type="button" className={st.phanBtn} onClick={() => den(x.tu)}>{x.ten} <small>p.{x.tu}</small></button>
        ))}
      </div>
      <div className={st.tocNhan}>{tenPhan(ml, p ?? 15)} · trang {dongMucLuc[0]?.p}–{dongMucLuc[dongMucLuc.length - 1]?.p}</div>
      <ul className={st.dsTrang}>
        {dongMucLuc.map((t) => (
          <li key={t.p}>
            <button type="button" className={`${st.dongTrang} ${t.p === p ? st.dongOn : ''}`} onClick={() => den(t.p)}>
              <span className={st.soTrang}>{t.p}</span>
              <span className={st.dongMuc}>
                {t.muc.length ? t.muc.map((m, i) => (
                  <span key={i} className={st.mucNho} style={{ '--m': TEN_MUC[m.loai]?.mau } as CSSProperties}>
                    {nhanMuc(m)}{m.topic ? ` ${m.topic}` : ''}
                  </span>
                )) : <span className={st.mucTrong}>—</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className={st.tocGhi}>Mục của từng trang do AI đọc từ ảnh; nhãn có thể lệch ở trang nối tiếp.</p>
    </>
  );

  return (
    <div className={`${cs.root} ${cs.ja} ${st.goc}`}>
      <div className={st.thanh}>
        <div className={st.thanhTrong}>
          <Link href={veBai} className={cs.iconBtn} aria-label="Về bài học"><ArrowLeft size={18} /></Link>
          <div className={st.tieuDe}>
            <span>📷 Sách gốc</span>
            <small>{tenPhan(ml, p ?? 15)}</small>
          </div>
          <div className={st.lat}>
            <button type="button" className={cs.iconBtn} onClick={truoc} disabled={!p || p <= 1} aria-label="Trang trước"><ChevronLeft size={20} /></button>
            <label className={st.oTrang}>
              <span className={cs.btnLabel}>Trang</span>
              <input
                key={p ?? 0}
                type="number"
                inputMode="numeric"
                min={1}
                max={SO_TRANG}
                defaultValue={p ?? ''}
                onKeyDown={(e) => { if (e.key === 'Enter') den(Number((e.target as HTMLInputElement).value)); }}
                onBlur={(e) => { const v = Number(e.target.value); if (v && v !== p) den(v); }}
                aria-label="Số trang"
              />
              <span className={st.tong}>/ {SO_TRANG}</span>
            </label>
            <button type="button" className={cs.iconBtn} onClick={sau} disabled={!p || p >= SO_TRANG} aria-label="Trang sau"><ChevronRight size={20} /></button>
          </div>
          <div className={st.congCu}>
            <button type="button" className={cs.iconBtn} onClick={() => setZ((v) => Math.max(1, v / 1.25))} disabled={z <= 1} aria-label="Thu nhỏ"><ZoomOut size={17} /></button>
            <span className={st.phanTram}>{Math.round(z * 100)}%</span>
            <button type="button" className={cs.iconBtn} onClick={() => setZ((v) => Math.min(4, v * 1.25))} disabled={z >= 4} aria-label="Phóng to"><ZoomIn size={17} /></button>
            <button
              type="button"
              className={cs.iconBtn}
              onClick={() => { setFit(fit === 'man' ? 'ngang' : 'man'); setZ(1); }}
              title={fit === 'man' ? 'Đang: vừa màn — bấm để vừa chiều ngang' : 'Đang: vừa chiều ngang — bấm để vừa màn'}
            >
              {fit === 'man' ? <MoveHorizontal size={17} /> : <Maximize size={16} />}
              <span className={cs.btnLabel}>{fit === 'man' ? 'Vừa ngang' : 'Vừa màn'}</span>
            </button>
            <button type="button" className={cs.iconBtn} onClick={() => setDaoMau(!daoMau)} aria-pressed={daoMau} title="Đảo màu trang (đọc ban đêm)">
              <Contrast size={16} />
            </button>
            <button type="button" className={`${cs.iconBtn} ${st.nutToc}`} onClick={() => setTocMo(true)}>
              <List size={17} /><span className={cs.btnLabel}>Mục lục</span>
            </button>
          </div>
        </div>
      </div>

      <div className={st.luoi}>
        <nav className={tocMo ? st.tocMo : st.toc} aria-label="Mục lục trang sách">{tocNode}</nav>
        {tocMo && <div className={st.man} onClick={() => setTocMo(false)} />}

        <main className={st.giua}>
          {p ? (
            <TrangAnh p={p} fit={fit} z={z} setZ={setZ} onPrev={truoc} onNext={sau} daoMau={daoMau} />
          ) : (
            <div className={st.trong} aria-busy="true">{coQuyen === null ? 'Đang kiểm tra quyền xem…' : 'Đang mở sách…'}</div>
          )}
          {baiHienTai && p && (
            <div className={st.dai} aria-label="Các trang của bài">
              {Array.from({ length: baiHienTai.den - baiHienTai.tu + 1 }, (_, i) => baiHienTai.tu + i).map((q) => (
                <button key={q} type="button" className={`${st.thumb} ${q === p ? st.thumbOn : ''}`} onClick={() => den(q)} aria-label={`Trang ${q}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- ảnh riêng tư qua API */}
                  <AnhNho p={q} rong={120} cao={169} />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          )}
          <p className={st.meo}>Vuốt ngang để lật · chụm hai ngón hoặc chạm đúp để phóng · ← → trên bàn phím</p>
        </main>

        <aside ref={benRef} className={st.ben}>
          <div className={st.tabs} role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'hd'} className={tab === 'hd' ? st.tabOn : st.tab} onClick={() => setTab('hd')}>
              📘 Hướng dẫn trang {p ?? ''}
            </button>
            <button type="button" role="tab" aria-selected={tab === 'ai'} className={tab === 'ai' ? st.tabOn : st.tab} onClick={() => setTab('ai')}>
              <Sparkles size={14} /> Gia sư{turns.length ? ` · ${turns.length}` : ''}
            </button>
          </div>
          <div className={st.benThan}>
            {tab === 'hd' ? (
              p ? (
                <HuongDanPanel
                  p={p}
                  hd={hd}
                  dangTai={hdTai}
                  loi={hdLoi}
                  baiCuaPoint={baiCuaPoint}
                  onHoi={() => ask({ label: `Giảng trang ${p} cho tôi`, y: 'giang' })}
                />
              ) : null
            ) : (
              <div className={st.giaSu}>
                <GiaSu
                  name="Gia sư theo trang sách"
                  lessonTitle={`Trang ${p ?? ''} · ${tenPhan(ml, p ?? 15)}`}
                  turns={turns}
                  asking={asking}
                  loggedIn={isAuthenticated}
                  selection={selection}
                  onAsk={ask}
                  onClear={() => setTurns([])}
                />
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
