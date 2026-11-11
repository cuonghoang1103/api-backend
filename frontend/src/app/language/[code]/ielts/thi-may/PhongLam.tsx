'use client';

/**
 * MÀN LÀM BÀI kiểu thi trên máy tính (Reading + Listening) — cũng là màn XEM LẠI. Nâng cấp 12/11/2026 giống CDT thật.
 * ─────────────────────────────────────────────────────────────────────────
 *  Toàn màn hình (không menu web). Trên: 👤 thí sinh · đồng hồ giữa "34 minutes left" (≤5′ đổi màu, ≤1′ nhấp nháy)
 *         · Settings (cỡ chữ / bảng màu) · Help · Hide · Thoát (xác nhận) · Submit (liệt kê câu chưa làm + cờ).
 *  Giữa:  Reading = 2 cột bài đọc | câu hỏi, kéo thanh giữa, mỗi cột cuộn riêng; chuột phải trên bài đọc ⇒
 *         Highlight / Note / Clear. Listening = cột câu hỏi + thanh 🔊 âm lượng (xem lại thêm cột lời thoại, nghe lại từng đoạn).
 *  Dưới:  "Part 1" + ô số câu (đã làm / đang ở / cờ Review) · "Passage 2 0/13" · ⚑ Review · ◀ ▶.
 *  Phím:  ←/→ câu trước/sau (ngoài ô nhập; trong ô nhập dùng Alt+←/→) · Alt+F cờ · Esc đóng hộp thoại · Tab/Enter tự nhiên.
 *
 * Listening thi thật: băng tự chạy khi vào phòng (đã kiểm tai nghe ở màn trước), 4 part liền, KHÔNG dừng/tua;
 * hết băng → 2 phút kiểm tra (đồng hồ riêng) → tự nộp. Chế độ luyện: phát từng part, tua câu, chỉnh tốc độ.
 *
 * Bài đang làm tự lưu localStorage (luuBai.ts — ThiMay.tsx ghi mỗi lần đổi).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DeDoc, DeNghe, Nhom, PhanDoc, PhanNghe } from './de/types';
import { chamNhom, cauTheoSo, dinhDangGio, type KetQuaCau } from './cham';
import { NhomCau } from './Nhom';
import { BaiDoc, LoiThoai, type ToSang } from './BaiDoc';
import { ThanhThi, HoiNop, HelpNoiDung, useDongHo } from './ThanhThi';
import { useHienThi } from '../chung/MenuTren';
import { play, stopAudio, setRate, getRate, getVolume, setVolume, type Clip } from '@/components/sach-hoc/audio';
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
  /** Xem lại: mở sẵn câu này + tô bằng chứng (nút "Locate" ở phiếu điểm). */
  cauMo?: number | null;
  /** Bước trong bộ đề ("Phần 2/4 · Reading"). */
  buocBo?: string;
  onNop?: () => void;
  onThoat: () => void;
};

const KHOA_CHIA = 'ielts-cdt:chia';
const KIEM_TRA_GIAY = 120;

export function PhongLam({ de, cheDo, phanChon, tt, setTt, kq, cauMo, buocBo, onNop, onThoat }: Props) {
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

  const [phanDang, setPhanDang] = useState(() => (cauMo != null && phanCuaCau.get(cauMo)) || phan[0]?.so || 1);
  const [cauDang, setCauDang] = useState<number | null>(cauMo ?? cacSo[0] ?? null);
  const [evN, setEvN] = useState<number | null>(cauMo ?? null);
  const [tab, setTab] = useState<'doc' | 'hoi'>(cauMo != null ? 'doc' : 'doc');
  const [chia, setChia] = useState(50);
  const [hoiNop, setHoiNop] = useState(false);
  const [moNote, setMoNote] = useState(false);
  const [canh, setCanh] = useState<string | null>(null);
  const chiaRef = useRef<HTMLDivElement>(null);
  const focusCho = useRef<number | null>(cauMo ?? null);

  useEffect(() => { try { const v = Number(localStorage.getItem(KHOA_CHIA)); if (v >= 25 && v <= 75) setChia(v); } catch { /* bỏ qua */ } }, []);

  /* ── Đồng hồ + cảnh báo 10′/5′/1′ + hết giờ tự nộp ── */
  const nopRef = useRef(onNop);
  nopRef.current = onNop;
  const { con, daQua } = useDongHo(tt.batDau, tt.hetLuc, xem, () => { stopAudio(); nopRef.current?.(); });
  const daCanh = useRef<Set<number>>(new Set());
  useEffect(() => {
    if (xem || con == null) return;
    for (const m of [600, 300, 60]) {
      if (con <= m && con > m - 5 && !daCanh.current.has(m)) {
        daCanh.current.add(m);
        setCanh(m >= 60 ? `${m / 60} minute${m > 60 ? 's' : ''} left` : '');
        setTimeout(() => setCanh(null), 6000);
      }
    }
  }, [con, xem]);

  /* ── Trả lời / cờ / tô ── */
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
      if (!xem) el?.focus({ preventScroll: true });
    });
  }, [phanDang, xem]);

  const buoc = useCallback((d: 1 | -1) => {
    const i = cacSo.indexOf(cauDang ?? cacSo[0]);
    const j = Math.min(cacSo.length - 1, Math.max(0, i + d));
    toiCau(cacSo[j]);
  }, [cacSo, cauDang, toiCau]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const trongO = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
      const radio = !!t && t.tagName === 'INPUT' && (t as HTMLInputElement).type !== 'text';
      // Trong ô gõ chữ: ←/→ di chuyển con trỏ ⇒ cần Alt. Ngoài ô (hoặc radio/checkbox) thì ←/→ thẳng.
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (trongO && !radio && !e.altKey) return;
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault(); buoc(e.key === 'ArrowRight' ? 1 : -1);
      } else if (e.altKey && e.code === 'KeyF' && cauDang != null && !xem) { e.preventDefault(); datCo(cauDang); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [buoc, cauDang, datCo, xem]);

  /* ── Kéo thanh giữa ── */
  const keo = (e: React.PointerEvent<HTMLButtonElement>) => {
    const box = chiaRef.current?.getBoundingClientRect();
    if (!box) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => setChia(Math.min(75, Math.max(25, ((ev.clientX - box.left) / box.width) * 100)));
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
  const [vol, setVol] = useState(1);
  useEffect(() => { setVol(getVolume()); }, []);
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

  const phatToanBo = useCallback(() => {
    // Thi thật: phát MỘT lần, liền 4 part. Âm thanh đã mở khoá ở màn kiểm tai nghe.
    const all: Clip[] = [];
    const viTri: { phan: number; dong: number }[] = [];
    for (const p of phan as PhanNghe[]) { const r = dungClip(p); all.push(...r.clips); viTri.push(...r.viTri); }
    setTt((cu) => ({ ...cu, daNghe: true }));
    let phanDangPhat = -1;
    play(all, () => {
      setNghe({ dang: false, phan: null, dong: -1 });
      // Hết băng ⇒ 2 phút kiểm tra rồi tự nộp.
      setTt((cu) => (cu.hetLuc ? cu : { ...cu, hetLuc: Date.now() + KIEM_TRA_GIAY * 1000 }));
      setCanh('End of the recording — 2 minutes to check your answers');
      setTimeout(() => setCanh(null), 7000);
    }, {
      onClip: (i) => {
        const v = viTri[i];
        setNghe({ dang: true, phan: v.phan, dong: v.dong });
        if (v.phan !== phanDangPhat) { phanDangPhat = v.phan; setPhanDang(v.phan); }
      },
    });
    setNghe({ dang: true, phan: phan[0].so, dong: -1 });
  }, [phan, dungClip, setTt]);
  // Vào phòng thi Listening (chế độ thi, chưa phát) ⇒ băng tự chạy sau 0,6 s — như máy thi thật.
  const tuPhat = laNghe && !xem && cheDo === 'full' && !tt.daNghe;
  useEffect(() => {
    if (!tuPhat) return;
    const t = setTimeout(phatToanBo, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuPhat]);

  const phatPhan = (so: number, tuDong = 0, coDan = tuDong === 0) => {
    const p = (phan as PhanNghe[]).find((x) => x.so === so);
    if (!p) return;
    const r = dungClip(p, tuDong, coDan);
    play(r.clips, () => setNghe({ dang: false, phan: null, dong: -1 }), { onClip: (i) => setNghe({ dang: true, phan: r.viTri[i].phan, dong: r.viTri[i].dong }) });
    setNghe({ dang: true, phan: so, dong: tuDong });
  };
  /** Xem lại: nghe lại MỘT câu thoại (không lời dẫn). */
  const phatDong = (so: number, dong: number) => {
    const p = (phan as PhanNghe[]).find((x) => x.so === so);
    const l = p?.loi[dong];
    if (!p || !l) return;
    play([{ text: l.s, voice: l.giong }], () => setNghe({ dang: false, phan: null, dong: -1 }));
    setNghe({ dang: true, phan: so, dong });
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
  const chuaLam = cacSo.filter((n) => !(tt.ans[n] ?? '').trim());

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
  const soTo = Object.values(tt.hl).reduce((n, ds) => n + ds.length, 0);
  const cotTrai = !laNghe || xem;

  const hoiProps = {
    dapAn: de.dapAn, ans: tt.ans, set, xem, kq: kqMap, co, datCo, dang: cauDang,
    onFocus: (n: number) => setCauDang(n),
    onViTri: (n: number) => { const p = phanCuaCau.get(n); if (p != null && p !== phanDang) setPhanDang(p); setEvN(n); setTab('doc'); },
  };

  const cheDoChu = xem ? `Review · ${kq!.filter((k) => k.dung).length}/${kq!.length} correct` : `${cheDo === 'full' ? 'Full test' : 'Practice'}${buocBo ? ` · ${buocBo}` : ''}`;
  const phuDongHo = laNghe && !xem
    ? (nghe.dang ? `Playing Part ${nghe.phan}` : con != null ? 'Check your answers' : tt.daNghe ? 'Recording finished' : null)
    : con == null && !xem ? 'No time limit' : null;

  return (
    <div className={`${s.goc} ${s.thi}`} {...thuocTinh}>
      <ThanhThi
        tenBai={de.ten} kyNang={laNghe ? 'Listening' : 'Reading'} cheDo={cheDoChu} con={con} daQua={daQua} xem={xem}
        tc={tc} doi={doi} onThoat={() => { stopAudio(); onThoat(); }} onNop={xem ? undefined : () => setHoiNop(true)}
        phu={phuDongHo} help={<HelpNoiDung kyNang={laNghe ? 'nghe' : 'doc'} />}
        them={(
          <>
            {laNghe && (
              <label className={s.amLuong} title="Âm lượng">
                🔊<input type="range" min={0} max={1} step={0.05} value={vol} aria-label="Âm lượng" onChange={(e) => { const v = Number(e.target.value); setVol(v); setVolume(v); }} />
              </label>
            )}
            {!laNghe && <button type="button" className={s.iconBtn} onClick={() => setMoNote((v) => !v)} aria-expanded={moNote} title="Tô sáng & ghi chú">📝 {theNotes.length || ''}</button>}
          </>
        )}
      />
      {canh && <div className={s.canhBao} role="alert">⏰ {canh}</div>}
      {moNote && (
        <div className={s.dsNote} aria-label="Ghi chú">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <b>Notes ({theNotes.length}) · Highlights ({soTo})</b>
            {!xem && soTo > 0 && <button type="button" className={s.nutNho} onClick={() => setHl(phanHien.so)(() => [])}>Clear all ({tenPhan} {phanHien.so})</button>}
          </div>
          {theNotes.length === 0 && <p className={s.mo} style={{ margin: 0 }}>Chọn chữ trong bài đọc → chuột phải → <b>Note</b>.</p>}
          <ul style={{ margin: 0, padding: 0 }}>
            {theNotes.map(({ so, h }) => {
              const p = (phan as PhanDoc[]).find((x) => x.so === so);
              return (
                <li key={h.id}>
                  <button type="button" className={s.nutViTri} style={{ marginLeft: 0 }} onClick={() => { setPhanDang(so); setMoNote(false); setTab('doc'); }}>{tenPhan} {so}</button>
                  <div style={{ fontStyle: 'italic', margin: '2px 0' }}>“{p?.doan[h.p]?.s.slice(h.s, h.e)}”</div>
                  <div>{h.note}</div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {hoiNop && (
        <HoiNop chuaLam={chuaLam} co={tt.co.filter((n) => cacSo.includes(n)).sort((a, b) => a - b)} tong={cacSo.length} toiCau={toiCau}
          dong={() => setHoiNop(false)} nop={() => { setHoiNop(false); stopAudio(); onNop?.(); }}
          dongThem={laNghe && nghe.dang ? <p className={s.loi} style={{ marginTop: 0 }}>Băng đang phát — nộp bây giờ là bỏ phần còn lại.</p> : undefined} />
      )}

      {/* ── Giữa ── */}
      {cotTrai && (
        <div className={s.tabHep} role="tablist">
          <button type="button" className={tab === 'doc' ? s.tabHepOn : ''} onClick={() => setTab('doc')}>{laNghe ? 'Transcript' : 'Passage'}</button>
          <button type="button" className={tab === 'hoi' ? s.tabHepOn : ''} onClick={() => setTab('hoi')}>Questions</button>
        </div>
      )}
      <div className={s.chia} ref={chiaRef}>
        {cotTrai && (
          <div className={`${s.cot} ${s.cotDoc} ${tab === 'hoi' ? s.anHep : ''}`} style={{ width: `${chia}%`, flex: '0 0 auto' }}>
            {laNghe ? (
              <>
                <h2 className={s.tieuDeDoc}>Part {phanHien.so} — {phanHien.tieuDe}</h2>
                <p className={s.gioiThieu}>{(phanHien as PhanNghe).boiCanh}</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                  <button type="button" className={s.nutPhu} onClick={() => phatPhan(phanHien.so, 0, false)}>▶ Nghe lại cả Part {phanHien.so}</button>
                  {nghe.dang && <button type="button" className={s.nutPhu} onClick={() => stopAudio()}>■ Dừng</button>}
                  <span className={s.mo}>Bấm ▶ ở từng câu thoại để nghe lại đúng đoạn đó.</span>
                </div>
                <LoiThoai loi={(phanHien as PhanNghe).loi} ev={evHien} dangDong={nghe.phan === phanHien.so ? nghe.dong : -1} onPhat={(i) => phatDong(phanHien.so, i)} />
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
                chiDoc={xem}
              />
            )}
          </div>
        )}
        {cotTrai && (
          <button type="button" className={s.thanh} aria-label="Kéo để đổi độ rộng hai cột (hoặc dùng phím ← →)" onPointerDown={keo}
            onKeyDown={(e) => { if (e.key === 'ArrowLeft') { e.stopPropagation(); setChia((v) => Math.max(25, v - 2)); } if (e.key === 'ArrowRight') { e.stopPropagation(); setChia((v) => Math.min(75, v + 2)); } }} />
        )}
        <div className={`${s.cot} ${s.cotHoi} ${cotTrai && tab === 'doc' ? s.anHep : ''}`} style={laNghe && !xem ? { maxWidth: 980, margin: '0 auto' } : undefined}>
          {laNghe && !xem && (
            <div className={s.ngheThanh}>
              {cheDo === 'full' ? (
                tt.daNghe ? (
                  <span>{nghe.dang ? <>🔊 Now playing <b>Part {nghe.phan}</b>{nghe.dong === -1 ? ' — time to read the questions' : ''}. Băng phát một lần, không dừng, không tua.</> : con != null ? <>Băng đã hết. Kiểm tra lại đáp án — tự nộp sau <b>{dinhDangGio(con)}</b>.</> : 'Băng đã phát (tải lại trang giữa chừng thì không phát lại được — như thi thật). Bấm Submit khi xong.'}</span>
                ) : (
                  <>
                    <button type="button" className={s.batDau} onClick={phatToanBo}>▶ Phát băng</button>
                    <span className={s.mo}>Băng sẽ tự chạy. Nếu không nghe thấy, bấm nút này.</span>
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
                  <span className={s.mo}>{nghe.dang ? `Đang phát Part ${nghe.phan}${nghe.dong >= 0 ? ` · câu thoại ${nghe.dong + 1}` : ''}` : 'Practice: nghe lại, tua từng câu thoại.'}</span>
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
                <b>{tenPhan} {p.so}</b>{xem ? `${dung}/${tong} correct` : `${lam} of ${tong}`}
              </button>
            );
          }
          return (
            <div key={p.so} className={s.phanNav}>
              <span className={s.phanTen}>{tenPhan} {p.so}</span>
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
          <button type="button" className={s.iconBtn} onClick={() => buoc(-1)} aria-label="Câu trước (←)">◀</button>
          <button type="button" className={s.iconBtn} onClick={() => buoc(1)} aria-label="Câu sau (→)">▶</button>
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
