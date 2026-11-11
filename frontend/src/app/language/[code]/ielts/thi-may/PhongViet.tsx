'use client';

/**
 * WRITING kiểu thi trên máy tính (nâng cấp 12/11/2026): toàn màn hình, thanh trên chung (thí sinh · "34 minutes left" ·
 * Settings · Help · Hide), cột trái đề + hình Task 1 (`figure`/`figure2` vẽ bằng FigureView của kho luyện, bọc biến màu;
 * `bieuDo` cũ vẫn vẽ bằng HinhSvg), cột phải ô viết có ĐẾM TỪ trực tiếp (dưới tối thiểu ⇒ đỏ) + nút Cut / Copy / Paste,
 * thanh dưới Task 1 | Task 2, đồng hồ 60′ (gợi ý 20′ + 40′). Không kiểm chính tả của trình duyệt (thi thật không có).
 */
import { useEffect, useRef, useState } from 'react';
import type { DeViet } from './de/types';
import { BieuDoSvg } from './HinhSvg';
import { ChuDam } from './Nhom';
import { ThanhThi, HopThoai, HelpNoiDung, useDongHo } from './ThanhThi';
import { useHienThi } from '../chung/MenuTren';
import FigureView from '@/app/tech-trends/ielts/FigureView';
import s from '../chung/cdt.module.css';

export type TrangThaiViet = { bai: Record<number, string>; batDau: number; hetLuc: number | null };
export const demTuViet = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);

export function PhongViet({ de, cheDo, taskChon, tt, setTt, buocBo, onNop, onThoat }: {
  de: DeViet; cheDo: 'practice' | 'full'; taskChon: number[];
  tt: TrangThaiViet; setTt: (f: (cu: TrangThaiViet) => TrangThaiViet) => void;
  buocBo?: string;
  onNop: () => void; onThoat: () => void;
}) {
  const { tc, doi, thuocTinh } = useHienThi();
  const tasks = de.task.filter((t) => taskChon.includes(t.so));
  const [dang, setDang] = useState(tasks[0]?.so ?? 1);
  const [hoi, setHoi] = useState(false);
  const [canh, setCanh] = useState<string | null>(null);
  const [chia, setChia] = useState(45);
  const [tab, setTab] = useState<'de' | 'viet'>('de');
  const [thongBao, setThongBao] = useState('');
  const chiaRef = useRef<HTMLDivElement>(null);
  const oRef = useRef<HTMLTextAreaElement>(null);
  const nopRef = useRef(onNop);
  nopRef.current = onNop;
  const daCanh = useRef(new Set<number>());

  const { con, daQua } = useDongHo(tt.batDau, tt.hetLuc, false, () => nopRef.current());
  useEffect(() => {
    if (con == null) return;
    for (const m of [600, 300, 60]) {
      if (con <= m && con > m - 5 && !daCanh.current.has(m)) {
        daCanh.current.add(m);
        setCanh(`${m / 60} minute${m > 60 ? 's' : ''} left`);
        setTimeout(() => setCanh(null), 6000);
      }
    }
  }, [con]);

  const t = tasks.find((x) => x.so === dang) ?? tasks[0];
  const bai = tt.bai[t.so] ?? '';
  const soTu = demTuViet(bai);
  // Gợi ý chia giờ: Task 1 ~20′ đầu, Task 2 ~40′ sau (chỉ là gợi ý, không khoá).
  const goiYGio = tasks.length === 2 ? (daQua < 20 * 60 ? 'Suggested: Task 1 (first 20 min)' : 'Suggested: Task 2 (last 40 min)') : `About ${t.phut} min`;

  const keo = (e: React.PointerEvent<HTMLButtonElement>) => {
    const box = chiaRef.current?.getBoundingClientRect();
    if (!box) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => setChia(Math.min(70, Math.max(25, ((ev.clientX - box.left) / box.width) * 100)));
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const ghi = (v: string) => setTt((cu) => ({ ...cu, bai: { ...cu.bai, [t.so]: v } }));
  const baoNhanh = (m: string) => { setThongBao(m); setTimeout(() => setThongBao(''), 1800); };
  /* Cut / Copy / Paste trên ô viết — dùng Clipboard API; thiếu quyền thì báo dùng phím tắt. */
  const chon = () => { const o = oRef.current; if (!o) return null; return { o, a: o.selectionStart, b: o.selectionEnd }; };
  const copy = async (cat: boolean) => {
    const c = chon();
    if (!c) return;
    const doan = c.a === c.b ? c.o.value : c.o.value.slice(c.a, c.b);
    try { await navigator.clipboard.writeText(doan); baoNhanh(cat ? 'Cut' : 'Copied'); } catch { baoNhanh('Dùng Ctrl/⌘+C'); return; }
    if (cat && c.a !== c.b) { ghi(c.o.value.slice(0, c.a) + c.o.value.slice(c.b)); requestAnimationFrame(() => { c.o.focus(); c.o.setSelectionRange(c.a, c.a); }); }
    else c.o.focus();
  };
  const paste = async () => {
    const c = chon();
    if (!c) return;
    try {
      const chu = await navigator.clipboard.readText();
      ghi(c.o.value.slice(0, c.a) + chu + c.o.value.slice(c.b));
      requestAnimationFrame(() => { c.o.focus(); c.o.setSelectionRange(c.a + chu.length, c.a + chu.length); });
      baoNhanh('Pasted');
    } catch { baoNhanh('Dùng Ctrl/⌘+V'); c.o.focus(); }
  };

  return (
    <div className={`${s.goc} ${s.thi}`} {...thuocTinh}>
      <ThanhThi tenBai={de.ten} kyNang="Writing" cheDo={`${cheDo === 'full' ? 'Full test' : 'Practice'}${buocBo ? ` · ${buocBo}` : ''}`} con={con} daQua={daQua}
        tc={tc} doi={doi} onThoat={onThoat} onNop={() => setHoi(true)} phu={goiYGio} help={<HelpNoiDung kyNang="viet" />} />
      {canh && <div className={s.canhBao} role="alert">⏰ {canh}</div>}
      {hoi && (
        <HopThoai tieuDe="Submit — nộp bài viết?" dong={() => setHoi(false)}>
          <ul style={{ margin: '0 0 10px', paddingLeft: 18, fontSize: 14.5 }}>
            {tasks.map((x) => { const n = demTuViet(tt.bai[x.so] ?? ''); return <li key={x.so}>Task {x.so}: <b style={{ color: n < x.minTu ? 'var(--c-red)' : 'var(--c-ok)' }}>{n}</b> / {x.minTu} từ{n < x.minTu ? ' — dưới mức tối thiểu, sẽ bị trừ TA/TR' : ' ✓'}</li>; })}
          </ul>
          <p className={s.mo} style={{ margin: '0 0 12px' }}>Sau khi nộp, nhờ AI chấm theo 4 tiêu chí (band ước tính).</p>
          <div className={s.hangNut}>
            <button type="button" className={s.nutPhu} onClick={() => setHoi(false)}>Viết tiếp</button>
            <button type="button" className={s.nop} onClick={() => { setHoi(false); onNop(); }}>Submit</button>
          </div>
        </HopThoai>
      )}
      <div className={s.tabHep} role="tablist">
        <button type="button" className={tab === 'de' ? s.tabHepOn : ''} onClick={() => setTab('de')}>Task</button>
        <button type="button" className={tab === 'viet' ? s.tabHepOn : ''} onClick={() => setTab('viet')}>Your answer ({soTu})</button>
      </div>
      <div className={s.chia} ref={chiaRef}>
        <div className={`${s.cot} ${s.cotDoc} ${tab === 'viet' ? s.anHep : ''}`} style={{ width: `${chia}%`, flex: '0 0 auto' }}>
          <h2 className={s.tieuDeDoc}>WRITING TASK {t.so}</h2>
          <p className={s.gioiThieu}>You should spend about {t.phut} minutes on this task. Write at least {t.minTu} words.</p>
          {t.de.split('\n\n').map((d, i) => <p key={i} style={{ margin: '0 0 10px', fontWeight: i === 0 ? 600 : 400 }}><ChuDam t={d} /></p>)}
          {t.figure && <div className={s.fig}><FigureView figure={t.figure} /></div>}
          {t.figure2 && <div className={s.fig}><FigureView figure={t.figure2} /></div>}
          {!t.figure && t.bieuDo && <div style={{ margin: '12px 0' }}><BieuDoSvg bd={t.bieuDo} /></div>}
        </div>
        <button type="button" className={s.thanh} aria-label="Kéo để đổi độ rộng hai cột" onPointerDown={keo}
          onKeyDown={(e) => { if (e.key === 'ArrowLeft') setChia((v) => Math.max(25, v - 2)); if (e.key === 'ArrowRight') setChia((v) => Math.min(70, v + 2)); }} />
        <div className={`${s.cot} ${s.cotHoi} ${tab === 'de' ? s.anHep : ''}`}>
          <div className={s.vietCongCu}>
            <button type="button" className={s.iconBtn} onClick={() => copy(true)}>✂ Cut</button>
            <button type="button" className={s.iconBtn} onClick={() => copy(false)}>⎘ Copy</button>
            <button type="button" className={s.iconBtn} onClick={paste}>📋 Paste</button>
            {thongBao && <span className={s.mo}>{thongBao}</span>}
            <span className={`${s.demTuSo} ${soTu < t.minTu ? s.demTuThieu : s.demTuDu}`} aria-live="polite">Word count: {soTu}{soTu < t.minTu ? ` (min ${t.minTu})` : ' ✓'}</span>
          </div>
          <textarea
            ref={oRef}
            className={s.vietO} value={bai} spellCheck={false} autoCorrect="off" autoCapitalize="off" aria-label={`Bài viết Task ${t.so}`}
            placeholder={`Type your answer for Task ${t.so} here (at least ${t.minTu} words)…`}
            onChange={(e) => ghi(e.target.value)}
          />
          <div className={s.demTu}>
            <span>{soTu < t.minTu ? <span style={{ color: 'var(--c-red)' }}>⚠ Còn thiếu {t.minTu - soTu} từ so với mức tối thiểu.</span> : 'Đủ số từ tối thiểu.'}</span>
            <span>No spell-checker — như phòng thi thật.</span>
          </div>
        </div>
      </div>
      <footer className={s.thiDuoi}>
        {tasks.map((x) => (
          x.so === dang
            ? <span key={x.so} className={s.phanNav}><span className={s.phanTen}>Task {x.so}</span><span className={`${s.oSo} ${s.oSoDang}`} style={{ display: 'inline-grid', placeItems: 'center' }}>{x.so}</span><span className={s.mo}>{demTuViet(tt.bai[x.so] ?? '')} words</span></span>
            : <button key={x.so} type="button" className={s.phanTat} onClick={() => { setDang(x.so); setTab('viet'); }}><b>Task {x.so}</b>{demTuViet(tt.bai[x.so] ?? '')} words</button>
        ))}
        <div className={s.duoiPhai}>
          <button type="button" className={s.iconBtn} disabled={dang === tasks[0].so} onClick={() => setDang(tasks[0].so)} aria-label="Task trước">◀</button>
          <button type="button" className={s.iconBtn} disabled={dang === tasks[tasks.length - 1].so} onClick={() => setDang(tasks[tasks.length - 1].so)} aria-label="Task sau">▶</button>
        </div>
      </footer>
    </div>
  );
}
