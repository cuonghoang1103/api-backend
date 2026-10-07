'use client';

/**
 * MÀN LÀM BÀI kiểu thi trên máy tính (Reading + Listening) — cũng là màn XEM LẠI.
 * ─────────────────────────────────────────────────────────────────────────
 *  Trên:  đồng hồ đỏ 00:59:58 (cảnh báo 10′/5′, ẩn được) · tên đề · Full Test/Practice · nút Nộp.
 *  Giữa:  Reading = 2 cột bài đọc | câu hỏi, kéo thanh giữa đổi độ rộng, mỗi cột cuộn riêng.
 *         Listening = cột câu hỏi (xem lại thì thêm cột lời thoại).
 *  Dưới:  "Part 1" + ô số câu (đã làm / đang ở / cờ xem lại) · "Passage 2 0/13" · ◀ ▶.
 *  Phím:  Alt+→ / Alt+← câu sau/trước · Alt+F cắm cờ · Esc đóng menu.
 *
 * Listening thi thật: bấm "Bắt đầu" một lần, cả 4 part phát liền (có thời gian đọc câu hỏi
 * trước mỗi part), KHÔNG dừng/tua; hết băng → 2 phút kiểm tra → tự nộp. Chế độ luyện:
 * phát từng part, tua câu trước/sau, chỉnh tốc độ.
 *
 * Tải lại trang giữa chừng không mất bài: trạng thái nằm trong sessionStorage (ThiMay.tsx).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DeDoc, DeNghe, Nhom, PhanDoc, PhanNghe } from './de/types';
import { chamNhom, cauTheoSo, dinhDangGio, type KetQuaCau } from './cham';
import { NhomCau } from './Nhom';
import { BaiDoc, LoiThoai, type ToSang } from './BaiDoc';
import { NutHienThi, useHienThi } from '../chung/MenuTren';
import { play, stopAudio, setRate, getRate, type Clip } from '@/components/sach-hoc/audio';
import s from '../chung/cdt.module.css';

export type TrangThaiLam = {
  ans: Record<number, string>;
  co: number[];
  hl: Record<number, ToSang[]>;
  batDau: number;
  hetLuc: number | null;
  daNghe?: boolean;
};

type Props = {
  de: DeDoc | DeNghe;
  cheDo: 'practice' | 'full';
  phanChon: number[];
  tt: TrangThaiLam;
  setTt: (f: (cu: TrangThaiLam) => TrangThaiLam) => void;
  /** Xem lại: có kết quả chấm ⇒ chỉ đọc. */
  kq?: KetQuaCau[];
  onNop?: () => void;
  onThoat: () => void;
};

const KHOA_CHIA = 'ielts-cdt:chia';
const KIEM_TRA_GIAY = 120;

export function PhongLam({ de, cheDo, phanChon, tt, setTt, kq, onNop, onThoat }: Props) {
  const xem = !!kq;
  const { tc, doi, thuocTinh } = useHienThi();
  const phan = useMemo(() => (de.phan as (PhanDoc | PhanNghe)[]).filter((p) => phanChon.includes(p.so)), [de, phanChon]);
  const nhomTheoPhan = useMemo(() => new Map(phan.map((p) => [p.so, p.nhom as Nhom[]])), [phan]);
  const tatCaNhom = useMemo(() => phan.flatMap((p) => p.nhom as Nhom[]), [phan]);
  const cacSo = useMemo(() => tatCaNhom.flatMap((g) => Array.from({ length: g.den - g.tu + 1 }, (_, i) => g.tu + i)), [tatCaNhom]);
  const phanCuaCau = useMemo(() => {
    const m = new Map<number, number>();
    for (const p of phan) for (const g of p.nhom as Nhom[]) for (let n = g.tu; n <= g.den; n++) m.set(n, p.so);
    return m;
  }, [phan]);
  const kqMap = useMemo(() => new Map((kq ?? []).map((k) => [k.n, k])), [kq]);
  const co = useMemo(() => new Set(tt.co), [tt.co]);

  const [phanDang, setPhanDang] = useState(phan[0]?.so ?? 1);
  const [cauDang, setCauDang] = useState<number | null>(cacSo[0] ?? null);
  const [evN, setEvN] = useState<number | null>(null);
  const [tab, setTab] = useState<'doc' | 'hoi'>('doc');
  const [chia, setChia] = useState(50);
  const [anGio, setAnGio] = useState(false);
  const [hoiNop, setHoiNop] = useState(false);
  const [moNote, setMoNote] = useState(false);
  const [canh, setCanh] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const chiaRef = useRef<HTMLDivElement>(null);
  const focusCho = useRef<number | null>(null);

  useEffect(() => { try { const v = Number(localStorage.getItem(KHOA_CHIA)); if (v >= 25 && v <= 75) setChia(v); } catch { /* bỏ qua */ } }, []);
  // Xem lại: đồng hồ đứng yên ở thời gian đã làm (batDau = lúc nộp − số giây đã làm).
  useEffect(() => { if (xem) return; const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [xem]);

  /* ── Đồng hồ + cảnh báo 10′/5′ + hết giờ tự nộp ── */
  const con = tt.hetLuc ? Math.max(0, Math.round((tt.hetLuc - now) / 1000)) : null;
  const daQua = Math.round((now - tt.batDau) / 1000);
  const daCanh = useRef<Set<number>>(new Set());
  const nopRef = useRef(onNop);
  nopRef.current = onNop;
  useEffect(() => {
    if (xem || con == null) return;
    for (const m of [600, 300]) {
      if (con <= m && con > m - 5 && !daCanh.current.has(m)) {
        daCanh.current.add(m);
        setCanh(`Còn ${m / 60} phút`);
        setTimeout(() => setCanh(null), 6000);
      }
    }
    if (con === 0) nopRef.current?.();
  }, [con, xem]);

  /* ── Trả lời / cờ ── */
  const set = useCallback((n: number, v: string) => setTt((cu) => ({ ...cu, ans: { ...cu.ans, [n]: v } })), [setTt]);
  const datCo = useCallback((n: number) => setTt((cu) => ({ ...cu, co: cu.co.includes(n) ? cu.co.filter((x) => x !== n) : [...cu.co, n] })), [setTt]);
  const setHl = useCallback((so: number) => (f: (cu: ToSang[]) => ToSang[]) => setTt((cu) => ({ ...cu, hl: { ...cu.hl, [so]: f(cu.hl[so] ?? []) } })), [setTt]);

  /* ── Đi tới câu n (đổi part nếu cần, rồi focus) ── */
  const toiCau = useCallback((n: number) => {
    const p = phanCuaCau.get(n);
    if (p == null) return;
    setCauDang(n);
    setTab('hoi');
    if (p !== phanDang) { setPhanDang(p); focusCho.current = n; return; }
    const el = document.getElementById(`q-${n}`) as HTMLElement | null;
    (document.getElementById(`cau-${n}`) ?? el)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    el?.focus({ preventScroll: true });
  }, [phanCuaCau, phanDang]);
  useEffect(() => {
    if (focusCho.current == null) return;
    const n = focusCho.current;
    focusCho.current = null;
    requestAnimationFrame(() => {
      const el = document.getElementById(`q-${n}`) as HTMLElement | null;
      (document.getElementById(`cau-${n}`) ?? el)?.scrollIntoView({ block: 'center' });
      el?.focus({ preventScroll: true });
    });
  }, [phanDang]);

  const buoc = useCallback((d: 1 | -1) => {
    const i = cacSo.indexOf(cauDang ?? cacSo[0]);
    const j = Math.min(cacSo.length - 1, Math.max(0, i + d));
    toiCau(cacSo[j]);
  }, [cacSo, cauDang, toiCau]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); buoc(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); buoc(-1); }
      else if (e.code === 'KeyF' && cauDang != null && !xem) { e.preventDefault(); datCo(cauDang); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [buoc, cauDang, datCo, xem]);

  /* ── Kéo thanh giữa ── */
  const keo = (e: React.PointerEvent<HTMLButtonElement>) => {
    const box = chiaRef.current?.getBoundingClientRect();
    if (!box) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const v = Math.min(75, Math.max(25, ((ev.clientX - box.left) / box.width) * 100));
      setChia(v);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      setChia((v) => { try { localStorage.setItem(KHOA_CHIA, String(Math.round(v))); } catch { /* bỏ qua */ } return v; });
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  /* ── Listening: phát băng ── */
  const laNghe = de.kyNang === 'nghe';
  const [nghe, setNghe] = useState<{ dang: boolean; phan: number | null; dong: number }>({ dang: false, phan: null, dong: -1 });
  const dungClip = useCallback((p: PhanNghe, tuDong = 0, coDan = true): { clips: Clip[]; viTri: { phan: number; dong: number }[] } => {
    const clips: Clip[] = [];
    const viTri: { phan: number; dong: number }[] = [];
    if (coDan) {
      clips.push({ text: p.dan, voice: 'dan' }); viTri.push({ phan: p.so, dong: -1 });
      clips.push({ text: '', pauseMs: p.docTruoc * 1000 }); viTri.push({ phan: p.so, dong: -1 });
    }
    p.loi.slice(tuDong).forEach((l, i) => { clips.push({ text: l.s, voice: l.giong }); viTri.push({ phan: p.so, dong: tuDong + i }); });
    if (coDan) { clips.push({ text: `That is the end of Part ${p.so}.`, voice: 'dan' }); viTri.push({ phan: p.so, dong: -1 }); }
    return { clips, viTri };
  }, []);

  const phatToanBo = () => {
    // Thi thật: phát MỘT lần, liền 4 part. Bấm lần đầu là cú bấm mở khoá âm thanh của trình duyệt.
    const all: Clip[] = [];
    const viTri: { phan: number; dong: number }[] = [];
    for (const p of phan as PhanNghe[]) { const r = dungClip(p); all.push(...r.clips); viTri.push(...r.viTri); }
    setTt((cu) => ({ ...cu, daNghe: true }));
    // Chỉ tự lật sang part mới khi BĂNG chuyển part — người học vẫn tự xem part khác được.
    let phanDangPhat = -1;
    play(all, () => {
      setNghe({ dang: false, phan: null, dong: -1 });
      // Hết băng ⇒ 2 phút kiểm tra rồi tự nộp.
      setTt((cu) => (cu.hetLuc ? cu : { ...cu, hetLuc: Date.now() + KIEM_TRA_GIAY * 1000 }));
    }, {
      onClip: (i) => {
        const v = viTri[i];
        setNghe({ dang: true, phan: v.phan, dong: v.dong });
        if (v.phan !== phanDangPhat) { phanDangPhat = v.phan; setPhanDang(v.phan); }
      },
    });
    setNghe({ dang: true, phan: phan[0].so, dong: -1 });
  };
  const phatPhan = (so: number, tuDong = 0, coDan = tuDong === 0) => {
    const p = (phan as PhanNghe[]).find((x) => x.so === so);
    if (!p) return;
    const r = dungClip(p, tuDong, coDan);
    play(r.clips, () => setNghe({ dang: false, phan: null, dong: -1 }), { onClip: (i) => setNghe({ dang: true, phan: r.viTri[i].phan, dong: r.viTri[i].dong }) });
    setNghe({ dang: true, phan: so, dong: tuDong });
  };
  useEffect(() => () => stopAudio(), []);
  const [toc, setToc] = useState(1);
  useEffect(() => { setToc(getRate()); }, []);

  /* ── Thanh dưới: số câu đã làm theo part ── */
  const daLam = (so: number) => {
    const ns = (nhomTheoPhan.get(so) ?? []).flatMap((g) => Array.from({ length: g.den - g.tu + 1 }, (_, i) => g.tu + i));
    return { lam: ns.filter((n) => (tt.ans[n] ?? '').trim()).length, tong: ns.length, ns };
  };
  const tenPhan = laNghe ? 'Part' : 'Passage';
  const chuaLam = cacSo.filter((n) => !(tt.ans[n] ?? '').trim()).length;

  const phanHien = phan.find((p) => p.so === phanDang) ?? phan[0];
  const nhomHien = (phanHien?.nhom ?? []) as Nhom[];
  const evCau = evN != null ? de.dapAn[evN]?.ev ?? null : null;
  const evHien = evN != null && phanCuaCau.get(evN) === phanHien?.so ? evCau : null;

  // Tiêu đề người học đã chọn cho từng đoạn (matching headings) — hiện trên đầu đoạn văn.
  const tieuDeChen = useMemo(() => {
    const m: Record<string, string> = {};
    for (const g of nhomHien) {
      if (g.dang !== 'heading' || !g.hop) continue;
      for (const c of g.cau ?? []) {
        const k = tt.ans[c.n];
        const nhan = /Paragraph ([A-Z])/.exec(c.s)?.[1];
        const o = g.hop.ds.find((x) => x.k === k);
        if (nhan && o) m[nhan] = `${c.n}. ${o.k} — ${o.t}`;
      }
    }
    return m;
  }, [nhomHien, tt.ans]);

  const theNotes = Object.entries(tt.hl).flatMap(([so, ds]) => ds.filter((h) => h.note).map((h) => ({ so: Number(so), h })));
  const cotTrai = !laNghe || xem;

  const hoiProps = {
    dapAn: de.dapAn, ans: tt.ans, set, xem, kq: kqMap, co, datCo, dang: cauDang,
    onFocus: (n: number) => setCauDang(n),
    onViTri: (n: number) => { const p = phanCuaCau.get(n); if (p != null && p !== phanDang) setPhanDang(p); setEvN(n); setTab('doc'); },
  };

  return (
    <div className={`${s.goc} ${s.thi}`} {...thuocTinh}>
      {/* ── Thanh trên ── */}
      <header className={s.thiTren}>
        <div>
          <div className={`${s.dongHo} ${anGio ? s.dongHoAn : ''} ${con != null && con <= 300 && !anGio ? s.dongHoGap : ''}`} role="timer" aria-live="off">
            {anGio ? '••:••:••' : con != null ? dinhDangGio(con) : dinhDangGio(daQua)}
            {!xem && <button type="button" className={s.nutNho} onClick={() => setAnGio((v) => !v)}>{anGio ? 'Hiện giờ' : 'Ẩn giờ'}</button>}
            {laNghe && !xem && con != null && <span className={s.mo}>· 2 phút kiểm tra lại đáp án</span>}
            {con == null && !xem && <span className={s.mo}>· {laNghe ? (nghe.dang ? `đang phát Part ${nghe.phan}` : 'đã trôi qua') : 'không giới hạn'}</span>}
          </div>
          <div className={s.tenThi}>IELTS Test {laNghe ? 'Listening' : 'Reading'} - {de.boDe} · {de.ten.replace(/^.*—\s*/, '')}</div>
          <div className={s.cheDoThi}>{xem ? 'Xem lại' : cheDo === 'full' ? 'Full Test' : 'Practice'}{xem && kq ? ` · đúng ${kq.filter((k) => k.dung).length}/${kq.length}` : ''}</div>
        </div>
        <div className={s.thiDieuKhien}>
          <span className={s.anHep}><NutHienThi tc={tc} doi={doi} /></span>
          {!laNghe && <button type="button" className={s.iconBtn} onClick={() => setMoNote((v) => !v)} aria-expanded={moNote} title="Ghi chú đã tô">📝 {theNotes.length || ''}</button>}
          {xem ? (
            <button type="button" className={s.nop} onClick={onThoat}>Đóng xem lại</button>
          ) : (
            <>
              <button type="button" className={s.iconBtn} onClick={onThoat} title="Thoát (bài vẫn được giữ để làm tiếp)">Thoát</button>
              <button type="button" className={s.nop} onClick={() => setHoiNop(true)}>Nộp bài</button>
            </>
          )}
        </div>
      </header>
      {canh && <div className={s.canhBao} role="alert">⏰ {canh}</div>}
      {moNote && (
        <ul className={s.dsNote} aria-label="Ghi chú">
          <li style={{ fontWeight: 700 }}>Ghi chú ({theNotes.length}) — chọn chữ trong bài đọc → 📝 Ghi chú</li>
          {theNotes.length === 0 && <li className={s.mo}>Chưa có ghi chú nào.</li>}
          {theNotes.map(({ so, h }) => {
            const p = (phan as PhanDoc[]).find((x) => x.so === so);
            return (
              <li key={h.id}>
                <button type="button" className={s.nutViTri} onClick={() => { setPhanDang(so); setMoNote(false); setTab('doc'); }}>{tenPhan} {so}</button>
                <div style={{ fontStyle: 'italic', margin: '2px 0' }}>“{p?.doan[h.p]?.s.slice(h.s, h.e)}”</div>
                <div>{h.note}</div>
              </li>
            );
          })}
        </ul>
      )}
      {hoiNop && (
        <div className={s.oNote} style={{ left: '50%', top: 72, transform: 'translateX(-50%)' }} role="dialog" aria-label="Xác nhận nộp bài">
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Nộp bài?</p>
          <p className={s.mo} style={{ margin: '0 0 10px' }}>{chuaLam ? `Còn ${chuaLam} câu chưa trả lời. ` : 'Bạn đã trả lời đủ. '}{co.size ? `${co.size} câu đang cắm cờ xem lại. ` : ''}Nộp rồi không sửa được.</p>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            <button type="button" className={s.nutPhu} onClick={() => setHoiNop(false)}>Làm tiếp</button>
            <button type="button" className={s.nop} onClick={() => { setHoiNop(false); stopAudio(); onNop?.(); }}>Nộp bài</button>
          </div>
        </div>
      )}

      {/* ── Giữa ── */}
      {cotTrai && (
        <div className={s.tabHep} role="tablist">
          <button type="button" className={tab === 'doc' ? s.tabHepOn : ''} onClick={() => setTab('doc')}>{laNghe ? 'Lời thoại' : 'Bài đọc'}</button>
          <button type="button" className={tab === 'hoi' ? s.tabHepOn : ''} onClick={() => setTab('hoi')}>Câu hỏi</button>
        </div>
      )}
      <div className={s.chia} ref={chiaRef}>
        {cotTrai && (
          <div className={`${s.cot} ${s.cotDoc} ${tab === 'hoi' ? s.anHep : ''}`} style={{ width: `${chia}%`, flex: '0 0 auto' }}>
            {laNghe ? (
              <>
                <h2 className={s.tieuDeDoc}>Part {phanHien.so} — {phanHien.tieuDe}</h2>
                <p className={s.gioiThieu}>{(phanHien as PhanNghe).boiCanh}</p>
                <button type="button" className={s.nutPhu} style={{ marginBottom: 10 }} onClick={() => phatPhan(phanHien.so, 0, false)}>▶ Nghe lại Part {phanHien.so}</button>
                <LoiThoai loi={(phanHien as PhanNghe).loi} ev={evHien} />
              </>
            ) : (
              <BaiDoc
                key={phanHien.so}
                tieuDe={`READING PASSAGE ${phanHien.so} — ${phanHien.tieuDe}`}
                phuDe={(phanHien as PhanDoc).phuDe}
                gioiThieu={(phanHien as PhanDoc).gioiThieu}
                doan={(phanHien as PhanDoc).doan}
                hl={tt.hl[phanHien.so] ?? []}
                setHl={setHl(phanHien.so)}
                ev={evHien}
                tieuDeChen={tieuDeChen}
              />
            )}
          </div>
        )}
        {cotTrai && (
          <button type="button" className={s.thanh} aria-label="Kéo để đổi độ rộng hai cột (hoặc dùng phím ← →)" onPointerDown={keo}
            onKeyDown={(e) => { if (e.key === 'ArrowLeft') setChia((v) => Math.max(25, v - 2)); if (e.key === 'ArrowRight') setChia((v) => Math.min(75, v + 2)); }} />
        )}
        <div className={`${s.cot} ${s.cotHoi} ${cotTrai && tab === 'doc' ? s.anHep : ''}`} style={laNghe && !xem ? { maxWidth: 980, margin: '0 auto' } : undefined}>
          {laNghe && !xem && (
            <div className={s.ngheThanh}>
              {cheDo === 'full' ? (
                tt.daNghe ? (
                  <span>{nghe.dang ? <>🔊 Đang phát <b>Part {nghe.phan}</b>{nghe.dong === -1 ? ' — thời gian đọc câu hỏi / lời dẫn' : ''}. Như thi thật: không dừng, không nghe lại.</> : con != null ? <>Băng đã hết. Kiểm tra lại đáp án — tự nộp sau <b>{dinhDangGio(con)}</b>.</> : 'Băng đã phát (tải lại trang giữa chừng thì không phát lại được — như thi thật).'}</span>
                ) : (
                  <>
                    <button type="button" className={s.batDau} onClick={phatToanBo}>▶ Bắt đầu phần nghe</button>
                    <span className={s.mo}>Phát liền {phan.length} part, mỗi part có thời gian đọc câu hỏi trước. Chỉ nghe <b>một lần</b>. Đeo tai nghe.</span>
                  </>
                )
              ) : (
                <>
                  <button type="button" className={s.nutPhu} onClick={() => phatPhan(phanHien.so)}>▶ Phát Part {phanHien.so}</button>
                  <button type="button" className={s.nutPhu} disabled={!nghe.dang || nghe.dong <= 0} onClick={() => phatPhan(nghe.phan ?? phanHien.so, Math.max(0, nghe.dong - 1), false)} title="Câu trước">⏮</button>
                  <button type="button" className={s.nutPhu} disabled={!nghe.dang || nghe.dong < 0} onClick={() => phatPhan(nghe.phan ?? phanHien.so, nghe.dong + 1, false)} title="Câu sau">⏭</button>
                  <button type="button" className={s.nutPhu} disabled={!nghe.dang} onClick={() => stopAudio()}>■ Dừng</button>
                  <label className={s.mo}>Tốc độ{' '}
                    <select value={toc} onChange={(e) => { const v = Number(e.target.value); setRate(v); setToc(v); }} style={{ height: 30 }}>
                      {[0.75, 0.9, 1, 1.15, 1.25].map((v) => <option key={v} value={v}>{v}×</option>)}
                    </select>
                  </label>
                  <span className={s.mo}>{nghe.dang ? `Đang phát Part ${nghe.phan}${nghe.dong >= 0 ? ` · câu thoại ${nghe.dong + 1}` : ''}` : 'Chế độ luyện: nghe lại, tua từng câu thoại.'}</span>
                </>
              )}
            </div>
          )}
          {laNghe && <h2 className={s.tieuDeDoc} style={{ marginBottom: 12 }}>PART {phanHien.so}</h2>}
          {nhomHien.map((g) => <NhomCau key={g.id} g={g} {...hoiProps} />)}
        </div>
      </div>

      {/* ── Thanh dưới ── */}
      <footer className={s.thiDuoi}>
        {phan.map((p) => {
          const { lam, tong, ns } = daLam(p.so);
          if (p.so !== phanHien.so) {
            const dung = xem ? ns.filter((n) => kqMap.get(n)?.dung).length : null;
            return (
              <button key={p.so} type="button" className={s.phanTat} onClick={() => { setPhanDang(p.so); setCauDang(ns[0]); }}>
                <b>{tenPhan} {p.so}</b>{xem ? `${dung}/${tong} đúng` : `${lam}/${tong}`}
              </button>
            );
          }
          return (
            <div key={p.so} className={s.phanNav}>
              <span className={s.phanTen}>Part {p.so}</span>
              {ns.map((n) => {
                const k = kqMap.get(n);
                const cls = [s.oSo, xem ? (k?.dung ? s.oSoDung : s.oSoSai) : (tt.ans[n] ?? '').trim() ? s.oSoLam : '', cauDang === n ? s.oSoDang : '', co.has(n) ? s.oSoCo : ''].join(' ');
                return (
                  <button key={n} type="button" className={cls} onClick={() => toiCau(n)}
                    aria-label={`Câu ${n}${(tt.ans[n] ?? '').trim() ? ', đã trả lời' : ', chưa trả lời'}${co.has(n) ? ', có cờ' : ''}`}>{n}</button>
                );
              })}
            </div>
          );
        })}
        <div className={s.duoiPhai}>
          {!xem && cauDang != null && (
            <button type="button" className={`${s.iconBtn} ${co.has(cauDang) ? s.coOn : ''}`} onClick={() => datCo(cauDang)} aria-pressed={co.has(cauDang)} title="Cắm cờ xem lại câu đang làm (Alt+F)">⚑ Review</button>
          )}
          <button type="button" className={s.iconBtn} onClick={() => buoc(-1)} aria-label="Câu trước (Alt+←)">◀</button>
          <button type="button" className={s.iconBtn} onClick={() => buoc(1)} aria-label="Câu sau (Alt+→)">▶</button>
        </div>
      </footer>
    </div>
  );
}

/** Chấm một lượt (dùng ở ThiMay khi nộp). */
export function chamLuot(de: DeDoc | DeNghe, phanChon: number[], ans: Record<number, string>) {
  const nhom = (de.phan as (PhanDoc | PhanNghe)[]).filter((p) => phanChon.includes(p.so)).flatMap((p) => p.nhom as Nhom[]);
  return { kq: chamNhom(nhom, de.dapAn, ans), nhom, theoSo: cauTheoSo(nhom) };
}
