'use client';

/**
 * Trình nghe một tập podcast — bản web của `TapPodcastCTL` (app CT Language), 24/11/2026.
 * Nghe cả bài (tô câu đang đọc + tự cuộn) · chạm từ ⇒ tra nhanh + lưu sổ · Song ngữ / Chỉ tiếng gốc / Nghe trước (che chữ)
 * · cách đọc (ja/zh) · nghe lại một câu, nghe chậm, lặp câu, nghe từ câu này · cách nói khác · ngữ pháp trong câu
 * · mẹo · từ vựng của tập · điều đáng nhớ · câu hỏi hiểu bài ⇒ đánh dấu đã nghe (lưu trên trình duyệt)
 * · NÓI THEO + chấm phát âm từng câu / từng cách nói khác (micro — `LuyenPhatAm.tsx`, cùng tuyến chấm với app).
 * Phím tắt (máy tính): Space = nghe / dừng, ← → = câu trước / sau.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeftRight, CheckCircle2, Eye, EyeOff, Heart, Lightbulb, ListChecks, Pause, Play, PlayCircle, Puzzle, Repeat1, SkipBack,
  SkipForward, Snail, Square, TextQuote, Users, XCircle,
} from 'lucide-react';
import { getRate, onRate, setRate, stopAudio, type Clip, type Voice } from '@/components/sach-hoc/audio';
import { CauBamDuoc, GIONG_MAC_DINH, KhungCTL, NutLuu, NutNghe, TraNhanh, capCss, css as s, idMucSan, moTaCap, phat as phatTieng } from '@/components/language/ctl/chung';
import { NutPhatAm } from '@/components/language/ctl/LuyenPhatAm';
import { apiPodcast, loiMang, nnTuCode, type TapPodcast } from '@/lib/ctlanguage/api';
import { ghiXongPodcast, khoPodcast } from '@/lib/ctlanguage/khoTrinhDuyet';

type CheDo = 'songNgu' | 'goc' | 'ngheTruoc';
const CHE_DO: { ma: CheDo; ten: string }[] = [{ ma: 'songNgu', ten: 'Song ngữ' }, { ma: 'goc', ten: 'Chỉ tiếng gốc' }, { ma: 'ngheTruoc', ten: 'Nghe trước' }];
const TOC = [0.6, 0.75, 0.9, 1, 1.15, 1.3];
const MAU_NGUOI = ['var(--lh-accent)', '#ed7a45', '#5c9e6b'];
const KHOA_CHE_DO = 'ctl:podcast:che-do';
const KHOA_CACH_DOC = 'ctl:podcast:cach-doc';

type Phat = { kieu: 'ca'; tu: number } | { kieu: 'cau'; ma: string } | null;

export default function TapPodcastPage() {
  const p = useParams();
  const code = String(p.code);
  const id = String(p.id);
  const nn = nnTuCode(code);
  const [tap, setTap] = useState<TapPodcast | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [cheDo, setCheDo] = useState<CheDo>('songNgu');
  const [cachDoc, setCachDoc] = useState(true);
  const [hienChu, setHienChu] = useState<Set<number>>(new Set());
  const [moKhac, setMoKhac] = useState<Set<number>>(new Set());
  const [moNp, setMoNp] = useState<Set<number>>(new Set());
  const [phat, setPhat] = useState<Phat>(null);
  const [dongDoc, setDongDoc] = useState<number | null>(null);
  const [batDau, setBatDau] = useState(0);
  const [lapCau, setLapCau] = useState<number | null>(null);
  const [traLoi, setTraLoi] = useState<Record<number, number>>({});
  const [tra, setTra] = useState<string | null>(null);
  const [toc, setToc] = useState(1);
  const td = khoPodcast.useGiaTri();
  const lapRef = useRef<number | null>(null);
  const luot = useRef(0);
  const phatRef = useRef<Phat>(null);
  useEffect(() => { lapRef.current = lapCau; }, [lapCau]);
  useEffect(() => { phatRef.current = phat; }, [phat]);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KHOA_CHE_DO) as CheDo | null;
      if (v && CHE_DO.some((c) => c.ma === v)) setCheDo(v);
      if (localStorage.getItem(KHOA_CACH_DOC) === '0') setCachDoc(false);
    } catch { /* bỏ qua */ }
    setToc(getRate());
    return onRate(setToc);
  }, []);

  useEffect(() => {
    if (!nn) return;
    let song = true;
    apiPodcast.tap(nn, id).then((t) => song && setTap(t)).catch((e) => song && setLoi(loiMang(e)));
    return () => { song = false; stopAudio(); };
  }, [nn, id]);

  const giongCua = useCallback((ai: string): Voice => (tap?.nguoi.find((n) => n.ma === ai)?.giong as Voice | undefined) ?? GIONG_MAC_DINH[nn ?? 'en'], [tap, nn]);
  const clip = useCallback((i: number, cham = false): Clip => ({ text: tap!.loi[i]!.t, voice: giongCua(tap!.loi[i]!.ai), toc: cham ? 0.7 : undefined }), [tap, giongCua]);

  const phatTu = useCallback((i0: number) => {
    if (!tap) return;
    const i = Math.max(0, Math.min(i0, tap.loi.length - 1));
    const my = ++luot.current;
    setLapCau(null);
    void phatTieng(tap.loi.slice(i).map((_, j) => clip(i + j)), () => {
      if (luot.current !== my) return;
      phatRef.current = null;
      setPhat(null);
      setDongDoc(null);
    }, { onClip: (j) => { if (luot.current === my) setDongDoc(i + j); }, gapMs: 380 });
    setBatDau(i);
    phatRef.current = { kieu: 'ca', tu: i };
    setPhat({ kieu: 'ca', tu: i });
    setDongDoc(i);
  }, [tap, clip]);

  const docCau = useCallback((i: number, cham = false) => {
    if (!tap) return;
    const ma = `${i}-${cham ? 'c' : 'n'}`;
    const dang = phatRef.current;
    if (dang?.kieu === 'cau' && dang.ma === ma) { stopAudio(); return; }
    const my = ++luot.current;
    void phatTieng(clip(i, cham), () => {
      if (luot.current !== my) return;
      phatRef.current = null;
      setPhat(null);
      setDongDoc(null);
      // Lặp câu: một câu vừa đọc xong ⇒ đọc lại.
      if (lapRef.current === i) setTimeout(() => { if (lapRef.current === i && luot.current === my) docCauRef.current(i); }, 600);
    });
    phatRef.current = { kieu: 'cau', ma };
    setPhat({ kieu: 'cau', ma });
    setDongDoc(i);
  }, [tap, clip]);
  const docCauRef = useRef(docCau);
  useEffect(() => { docCauRef.current = docCau; }, [docCau]);

  // Tự cuộn tới câu đang đọc.
  useEffect(() => {
    if (dongDoc == null) return;
    document.getElementById(`dong-${dongDoc}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [dongDoc]);

  const dangCaBai = phat?.kieu === 'ca';
  const hien = dongDoc ?? batDau;

  // Phím tắt.
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (!tap || tra || document.querySelector('[data-ctl-phat-am]') || (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable))) return;
      if (e.key === ' ') { e.preventDefault(); if (dangCaBai) stopAudio(); else phatTu(hien); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); phatTu(hien + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); phatTu(hien - 1); }
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [tap, tra, dangCaBai, hien, phatTu]);

  const nguoiTen = useMemo(() => Object.fromEntries((tap?.nguoi ?? []).map((n) => [n.ten, n.vai ?? 'nhân vật'])), [tap]);
  const san = useMemo(() => tap?.tuVung.map((w) => ({ chu: w.chu, doc: w.doc, nghia: w.nghia, vd: w.vd })) ?? [], [tap]);
  const daLam = tap ? Object.keys(traLoi).length === tap.cauHoi.length : false;
  const soDung = tap ? tap.cauHoi.filter((c, i) => traLoi[i] === c.dung).length : 0;

  const chonTraLoi = (i: number, j: number) => {
    if (!tap || traLoi[i] != null) return;
    const moi = { ...traLoi, [i]: j };
    setTraLoi(moi);
    if (Object.keys(moi).length === tap.cauHoi.length) {
      const dung = tap.cauHoi.filter((c, k) => moi[k] === c.dung).length;
      ghiXongPodcast(tap.id, Math.round((dung / Math.max(1, tap.cauHoi.length)) * 100));
    }
  };

  if (!nn) return <KhungCTL code={code} dangO="podcast" tieuDe="Podcast"><div className={s.trong}>Podcast có cho tiếng Anh, tiếng Nhật và tiếng Trung.</div></KhungCTL>;

  const cap = tap?.cap ?? '';
  const mauNguoi = (ai: string) => MAU_NGUOI[Math.max(0, tap?.nguoi.findIndex((n) => n.ma === ai) ?? 0) % 3]!;

  return (
    <KhungCTL code={code} dangO="podcast" quayVe={`/language/${code}/podcast`} tieuDe={tap ? `Tập ${tap.so} · ${tap.cap}` : 'Podcast'}>
      {loi ? <div className={s.loi}>{loi} <Link href={`/language/${code}/podcast`} style={{ textDecoration: 'underline' }}>Về danh sách</Link></div> : null}
      {!tap && !loi ? <div className={s.trong}>Đang mở tập…</div> : null}
      {tap ? (
        <div className={s.playerLayout} style={capCss(cap)}>
          <div className={s.minh}>
            <div className={s.hero}>
              <span className={`${s.bia} ${s.biaLon}`}><PlayCircle size={34} /><span className={s.biaCap}>{tap.cap}</span></span>
              <div className={s.minh}>
                <div className={s.heroCap}>{tap.cap} · {moTaCap(tap.cap)} · {tap.chuDe}</div>
                <h1 className={s.heroTitle}>{tap.tieuDe}</h1>
                <div className={s.epViet}>{tap.tieuDeViet}</div>
                <div className={s.epMeta}>
                  <span><TextQuote size={13} /> {tap.loi.length} câu</span>
                  <span><Users size={13} /> {tap.nguoi.map((n) => n.ten).join(', ')}</span>
                  {td.xong.includes(tap.id) ? <span className={s.xong}><CheckCircle2 size={13} /> Đã nghe xong{td.diem[tap.id] != null ? ` · ${td.diem[tap.id]}%` : ''}</span> : null}
                </div>
                {tap.moTa ? <p className={s.note} style={{ marginTop: 8, fontSize: 14 }}>{tap.moTa}</p> : null}
              </div>
            </div>

            <div className={s.toolbar}>
              <div className={s.seg} role="tablist" aria-label="Chế độ">
                {CHE_DO.map((c) => (
                  <button key={c.ma} type="button" role="tab" aria-selected={cheDo === c.ma} className={s.segBtn} data-on={cheDo === c.ma || undefined}
                    onClick={() => { setCheDo(c.ma); try { localStorage.setItem(KHOA_CHE_DO, c.ma); } catch { /* bỏ qua */ } }}>{c.ten}</button>
                ))}
              </div>
              {nn !== 'en' ? (
                <button type="button" className={s.chip} data-on={cachDoc || undefined}
                  onClick={() => { setCachDoc(!cachDoc); try { localStorage.setItem(KHOA_CACH_DOC, cachDoc ? '0' : '1'); } catch { /* bỏ qua */ } }}>
                  {cachDoc ? <Eye size={14} /> : <EyeOff size={14} />} Cách đọc
                </button>
              ) : null}
              <label className={s.note} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Tốc độ
                <select className={s.select} value={toc} onChange={(e) => setRate(Number(e.target.value))}>
                  {TOC.map((v) => <option key={v} value={v}>{String(v).replace('.', ',')}×</option>)}
                </select>
              </label>
            </div>
            <p className={s.note} style={{ marginBottom: 12 }}>
              {cheDo === 'ngheTruoc' ? 'Nghe trước, đoán ý — bấm vào ô để hiện chữ.' : 'Bấm vào một từ để xem nghĩa, cách đọc và lưu vào sổ.'} Phím: Space nghe / dừng · ← → đổi câu.
            </p>

            <div className={s.lines}>
              {tap.loi.map((d, i) => {
                const mau = mauNguoi(d.ai);
                const che = cheDo === 'ngheTruoc' && !hienChu.has(i);
                const nguoi = tap.nguoi.find((n) => n.ma === d.ai);
                const dangDocCau = phat?.kieu === 'cau' && (phat.ma === `${i}-n` || phat.ma === `${i}-c`);
                return (
                  <div key={i} id={`dong-${i}`} className={s.line} data-doc={dongDoc === i || undefined} style={{ '--c': mau } as CSSProperties}>
                    <div className={s.lineHead}>
                      <span className={s.dot} />
                      <span className={s.who}>{nguoi?.ten ?? d.ai}</span>
                      <button type="button" className={s.icoBtn} style={{ '--c': mau } as CSSProperties} data-on={(dangDocCau && phat?.kieu === 'cau' && phat.ma === `${i}-n`) || undefined}
                        onClick={() => docCau(i)} aria-label="Nghe câu này" title="Nghe câu này">
                        {phat?.kieu === 'cau' && phat.ma === `${i}-n` ? <Square size={11} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
                      </button>
                      <button type="button" className={s.icoBtn} style={{ '--c': mau } as CSSProperties} data-on={(phat?.kieu === 'cau' && phat.ma === `${i}-c`) || undefined}
                        onClick={() => docCau(i, true)} aria-label="Nghe chậm" title="Nghe chậm"><Snail size={14} /></button>
                      <button type="button" className={s.icoBtn} style={{ '--c': lapCau === i ? mau : 'var(--lh-ink-3)' } as CSSProperties} data-on={lapCau === i || undefined}
                        onClick={() => { const moi = lapCau === i ? null : i; setLapCau(moi); lapRef.current = moi; if (moi === i) docCau(i); }}
                        aria-label="Lặp câu" title="Lặp câu này"><Repeat1 size={14} /></button>
                      <NutPhatAm gon cau={d.t} doc={d.doc} nghia={d.v} nn={nn} mauNut={mau} />
                    </div>
                    {che ? (
                      <button type="button" className={s.che} onClick={() => setHienChu(new Set(hienChu).add(i))}><EyeOff size={16} /> Bấm để hiện chữ</button>
                    ) : (
                      <>
                        <CauBamDuoc chu={d.t} nn={nn} onTu={setTra} className={s.lineText} />
                        {cachDoc && nn !== 'en' && d.doc && d.doc !== d.t ? <div className={s.lineDoc}>{d.doc}</div> : null}
                        {cheDo === 'songNgu' || (cheDo === 'ngheTruoc' && hienChu.has(i)) ? <div className={s.lineViet}>{d.v}</div> : null}
                        <div className={s.lineTools}>
                          <button type="button" className={`${s.chip} ${s.chipNho}`} onClick={() => phatTu(i)}><PlayCircle size={13} /> Nghe từ câu này</button>
                          {d.khac?.length ? (
                            <button type="button" className={`${s.chip} ${s.chipNho}`} data-on={moKhac.has(i) || undefined}
                              onClick={() => { const n = new Set(moKhac); if (n.has(i)) n.delete(i); else n.add(i); setMoKhac(n); }}>
                              <ArrowLeftRight size={13} /> Cách nói khác · {d.khac.length}
                            </button>
                          ) : null}
                          {d.np?.length ? (
                            <button type="button" className={`${s.chip} ${s.chipNho}`} data-on={moNp.has(i) || undefined}
                              onClick={() => { const n = new Set(moNp); if (n.has(i)) n.delete(i); else n.add(i); setMoNp(n); }}>
                              <Puzzle size={13} /> Ngữ pháp · {d.np.length}
                            </button>
                          ) : null}
                        </div>
                        {moKhac.has(i) && d.khac?.length ? (
                          <div className={s.box}>
                            {d.khac.map((k, j) => (
                              <div key={j} className={s.boxItem}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span className={s.kieu} style={{ flex: 1 }}>{k.kieu}</span>
                                  <NutNghe chu={k.t} nn={nn} giong={giongCua(d.ai)} mau={mau} />
                                  <NutPhatAm gon cau={k.t} doc={k.doc} nghia={k.v} nn={nn} mauNut={mau} />
                                </div>
                                <CauBamDuoc chu={k.t} nn={nn} onTu={setTra} className={s.vocabChu} />
                                {cachDoc && nn !== 'en' && k.doc && k.doc !== k.t ? <div className={s.lineDoc}>{k.doc}</div> : null}
                                <div className={s.vocabNghia}>{k.v}</div>
                                {k.ghiChu ? <div className={s.note} style={{ marginTop: 3 }}>ⓘ {k.ghiChu}</div> : null}
                              </div>
                            ))}
                          </div>
                        ) : null}
                        {moNp.has(i) && d.np?.length ? (
                          <div className={s.box} style={{ '--c': '#7c3aed' } as CSSProperties}>
                            {d.np.map((g, j) => (
                              <div key={j} className={s.boxItem}>
                                <div className={s.npMau}>{g.mau}</div>
                                <div style={{ fontSize: 14, marginTop: 4, lineHeight: 1.55 }}>{g.giai}</div>
                                {g.vd ? (
                                  <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'flex-start' }}>
                                    <div className={s.minh}>
                                      <div style={{ fontWeight: 600 }}>{g.vd}</div>
                                      {nn !== 'en' && g.vdDoc && g.vdDoc !== g.vd ? <div className={s.lineDoc}>{g.vdDoc}</div> : null}
                                      {g.vdV ? <div className={s.vocabNghia}>{g.vdV}</div> : null}
                                    </div>
                                    <NutNghe chu={g.vd} nn={nn} mau="#7c3aed" />
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={s.playBar}>
              <button type="button" className={s.playSide} onClick={() => phatTu(hien - 1)} disabled={hien <= 0} aria-label="Câu trước"><SkipBack size={20} /></button>
              <button type="button" className={s.playMain} onClick={() => (dangCaBai ? stopAudio() : phatTu(hien))} aria-label={dangCaBai ? 'Tạm dừng' : 'Nghe cả bài'}>
                {dangCaBai ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </button>
              <button type="button" className={s.playSide} onClick={() => phatTu(hien + 1)} disabled={hien >= tap.loi.length - 1} aria-label="Câu sau"><SkipForward size={20} /></button>
              <div className={s.playInfo}>
                <div className={s.playTitle}>{dangCaBai ? `Đang nghe câu ${hien + 1}/${tap.loi.length}` : 'Nghe cả bài'}</div>
                <div className={s.thanh}><i style={{ width: `${((hien + (dangCaBai ? 1 : 0)) / Math.max(1, tap.loi.length)) * 100}%` }} /></div>
                <div className={s.toc}>{String(toc).replace('.', ',')}× · đổi tốc độ ở thanh trên</div>
              </div>
            </div>
          </div>

          <aside className={s.side}>
            <div style={{ display: 'grid', gap: 14 }}>
              {tap.meo?.length ? (
                <div className={`${s.card} ${s.cardPad}`}>
                  <div className={s.h3} style={{ color: '#ea7a0c', display: 'flex', gap: 6, alignItems: 'center' }}><Lightbulb size={17} /> Mẹo dùng tiếng</div>
                  <ul style={{ marginTop: 8, display: 'grid', gap: 6, paddingLeft: 18, listStyle: 'disc', fontSize: 14, lineHeight: 1.55 }}>
                    {tap.meo.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
              ) : null}
              <div className={`${s.card} ${s.cardPad}`}>
                <div className={s.h3} style={{ display: 'flex', gap: 6, alignItems: 'center' }}><TextQuote size={17} /> Từ vựng trong tập ({tap.tuVung.length})</div>
                <div style={{ marginTop: 4 }}>
                  {tap.tuVung.map((w, i) => (
                    <div key={i} className={s.vocabRow}>
                      <div className={s.minh}>
                        <div><span className={s.vocabChu}>{w.chu}</span>{w.doc ? <span className={s.vocabDoc}>{w.doc}</span> : null}</div>
                        <div className={s.vocabNghia}>{w.nghia}</div>
                        {w.vd ? <div className={s.vocabVd}>{w.vd}</div> : null}
                      </div>
                      <NutNghe chu={w.chu} nn={nn} />
                      <NutLuu nho nn={nn} muc={{ id: idMucSan(nn, w.chu), chu: w.chu, doc: w.doc ?? null, nghiaVi: w.nghia }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${s.card} ${s.cardPad}`}>
                <div className={s.h3} style={{ color: '#db2777', display: 'flex', gap: 6, alignItems: 'center' }}><Heart size={17} /> Điều đáng nhớ</div>
                <p style={{ marginTop: 8, fontSize: 14.5, lineHeight: 1.6 }}>{tap.yNghia}</p>
              </div>
              <div className={`${s.card} ${s.cardPad}`}>
                <div className={s.h3} style={{ color: 'var(--lh-ok)', display: 'flex', gap: 6, alignItems: 'center' }}><ListChecks size={17} /> Kiểm tra hiểu bài</div>
                {tap.cauHoi.map((c, i) => (
                  <div key={i} style={{ marginTop: 14 }}>
                    <div style={{ fontWeight: 650, fontSize: 14.5, lineHeight: 1.45 }}>{i + 1}. {c.hoi}</div>
                    <div className={s.qOpts}>
                      {c.chon.map((ch, j) => {
                        const chon = traLoi[i];
                        const kq = chon == null ? undefined : j === c.dung ? 'dung' : chon === j ? 'sai' : undefined;
                        return (
                          <button key={j} type="button" className={s.qOpt} data-kq={kq} disabled={chon != null} onClick={() => chonTraLoi(i, j)}>
                            <span className={s.minh}>{ch}</span>
                            {kq === 'dung' ? <CheckCircle2 size={17} color="var(--lh-ok)" /> : kq === 'sai' ? <XCircle size={17} color="var(--lh-bad)" /> : null}
                          </button>
                        );
                      })}
                    </div>
                    {traLoi[i] != null && c.giai ? <p className={s.note} style={{ marginTop: 6 }}>{c.giai}</p> : null}
                  </div>
                ))}
                {daLam ? (
                  <div className={s.bao} style={{ marginTop: 14 }}>
                    <b>Đúng {soDung}/{tap.cauHoi.length} — đã đánh dấu nghe xong tập này.</b>{' '}
                    {soDung === tap.cauHoi.length ? 'Xuất sắc! Thử nói theo vài câu khó nhé.' : 'Nghe lại đoạn liên quan rồi làm lại nhé.'}{' '}
                    <button type="button" style={{ color: 'var(--lh-accent)', fontWeight: 700 }} onClick={() => setTraLoi({})}>Làm lại</button>
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      ) : null}
      {tra && nn ? <TraNhanh chu={tra} nn={nn} san={san} ngoaiTru={nguoiTen} dong={() => setTra(null)} /> : null}
    </KhungCTL>
  );
}
