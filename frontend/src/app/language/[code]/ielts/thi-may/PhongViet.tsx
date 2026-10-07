'use client';

/**
 * WRITING kiểu thi trên máy tính: cột trái đề (+ biểu đồ Task 1), cột phải khung soạn có đếm từ,
 * thanh dưới "Part 1 | Part 2" (Task 1/Task 2), đồng hồ 60′ (gợi ý 20′ + 40′).
 * Không kiểm chính tả của trình duyệt (thi thật không có).
 */
import { useEffect, useRef, useState } from 'react';
import type { DeViet } from './de/types';
import { dinhDangGio } from './cham';
import { BieuDoSvg } from './HinhSvg';
import { ChuDam } from './Nhom';
import { NutHienThi, useHienThi } from '../chung/MenuTren';
import s from '../chung/cdt.module.css';

export type TrangThaiViet = { bai: Record<number, string>; batDau: number; hetLuc: number | null };
export const demTuViet = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);

export function PhongViet({ de, cheDo, taskChon, tt, setTt, onNop, onThoat }: {
  de: DeViet; cheDo: 'practice' | 'full'; taskChon: number[];
  tt: TrangThaiViet; setTt: (f: (cu: TrangThaiViet) => TrangThaiViet) => void;
  onNop: () => void; onThoat: () => void;
}) {
  const { tc, doi, thuocTinh } = useHienThi();
  const tasks = de.task.filter((t) => taskChon.includes(t.so));
  const [dang, setDang] = useState(tasks[0]?.so ?? 1);
  const [now, setNow] = useState(() => Date.now());
  const [anGio, setAnGio] = useState(false);
  const [hoi, setHoi] = useState(false);
  const [canh, setCanh] = useState<string | null>(null);
  const [chia, setChia] = useState(45);
  const [tab, setTab] = useState<'de' | 'viet'>('de');
  const chiaRef = useRef<HTMLDivElement>(null);
  const nopRef = useRef(onNop);
  nopRef.current = onNop;
  const daCanh = useRef(new Set<number>());

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const con = tt.hetLuc ? Math.max(0, Math.round((tt.hetLuc - now) / 1000)) : null;
  const daQua = Math.round((now - tt.batDau) / 1000);
  useEffect(() => {
    if (con == null) return;
    for (const m of [600, 300]) if (con <= m && con > m - 5 && !daCanh.current.has(m)) { daCanh.current.add(m); setCanh(`Còn ${m / 60} phút`); setTimeout(() => setCanh(null), 6000); }
    if (con === 0) nopRef.current();
  }, [con]);

  const t = tasks.find((x) => x.so === dang) ?? tasks[0];
  const bai = tt.bai[t.so] ?? '';
  const soTu = demTuViet(bai);
  // Gợi ý chia giờ: Task 1 ~20′ đầu, Task 2 ~40′ sau (chỉ là gợi ý, không khoá).
  const goiYGio = tasks.length === 2 ? (daQua < 20 * 60 ? 'Gợi ý: đang trong 20′ đầu — làm Task 1' : 'Gợi ý: đã qua 20′ — chuyển sang Task 2') : `Gợi ý ${t.phut}′`;

  const keo = (e: React.PointerEvent<HTMLButtonElement>) => {
    const box = chiaRef.current?.getBoundingClientRect();
    if (!box) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => setChia(Math.min(70, Math.max(25, ((ev.clientX - box.left) / box.width) * 100)));
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <div className={`${s.goc} ${s.thi}`} {...thuocTinh}>
      <header className={s.thiTren}>
        <div>
          <div className={`${s.dongHo} ${anGio ? s.dongHoAn : ''} ${con != null && con <= 300 && !anGio ? s.dongHoGap : ''}`} role="timer">
            {anGio ? '••:••:••' : dinhDangGio(con ?? daQua)}
            <button type="button" className={s.nutNho} onClick={() => setAnGio((v) => !v)}>{anGio ? 'Hiện giờ' : 'Ẩn giờ'}</button>
            <span className={s.mo}>· {goiYGio}</span>
          </div>
          <div className={s.tenThi}>IELTS Test Writing - {de.boDe} · {de.ten.replace(/^.*—\s*/, '')}</div>
          <div className={s.cheDoThi}>{cheDo === 'full' ? 'Full Test' : 'Practice'}</div>
        </div>
        <div className={s.thiDieuKhien}>
          <span className={s.anHep}><NutHienThi tc={tc} doi={doi} /></span>
          <button type="button" className={s.iconBtn} onClick={onThoat}>Thoát</button>
          <button type="button" className={s.nop} onClick={() => setHoi(true)}>Nộp bài</button>
        </div>
      </header>
      {canh && <div className={s.canhBao} role="alert">⏰ {canh}</div>}
      {hoi && (
        <div className={s.oNote} style={{ left: '50%', top: 72, transform: 'translateX(-50%)' }} role="dialog" aria-label="Xác nhận nộp">
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Nộp bài viết?</p>
          <p className={s.mo} style={{ margin: '0 0 10px' }}>
            {tasks.map((x) => `Task ${x.so}: ${demTuViet(tt.bai[x.so] ?? '')}/${x.minTu} từ`).join(' · ')}. Sau khi nộp, nhờ AI chấm theo 4 tiêu chí.
          </p>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            <button type="button" className={s.nutPhu} onClick={() => setHoi(false)}>Viết tiếp</button>
            <button type="button" className={s.nop} onClick={() => { setHoi(false); onNop(); }}>Nộp bài</button>
          </div>
        </div>
      )}
      <div className={s.tabHep} role="tablist">
        <button type="button" className={tab === 'de' ? s.tabHepOn : ''} onClick={() => setTab('de')}>Đề bài</button>
        <button type="button" className={tab === 'viet' ? s.tabHepOn : ''} onClick={() => setTab('viet')}>Bài viết ({soTu})</button>
      </div>
      <div className={s.chia} ref={chiaRef}>
        <div className={`${s.cot} ${s.cotDoc} ${tab === 'viet' ? s.anHep : ''}`} style={{ width: `${chia}%`, flex: '0 0 auto' }}>
          <h2 className={s.tieuDeDoc}>WRITING TASK {t.so}</h2>
          <p className={s.gioiThieu}>You should spend about {t.phut} minutes on this task.</p>
          {t.de.split('\n\n').map((d, i) => <p key={i} style={{ margin: '0 0 10px', fontWeight: i === 0 ? 600 : 400 }}><ChuDam t={d} /></p>)}
          {t.bieuDo && <div style={{ margin: '12px 0' }}><BieuDoSvg bd={t.bieuDo} /></div>}
        </div>
        <button type="button" className={s.thanh} aria-label="Kéo để đổi độ rộng hai cột" onPointerDown={keo}
          onKeyDown={(e) => { if (e.key === 'ArrowLeft') setChia((v) => Math.max(25, v - 2)); if (e.key === 'ArrowRight') setChia((v) => Math.min(70, v + 2)); }} />
        <div className={`${s.cot} ${s.cotHoi} ${tab === 'de' ? s.anHep : ''}`}>
          <textarea
            className={s.vietO} value={bai} spellCheck={false} autoCorrect="off" autoCapitalize="off" aria-label={`Bài viết Task ${t.so}`}
            placeholder={`Viết Task ${t.so} ở đây (ít nhất ${t.minTu} từ)…`}
            onChange={(e) => { const v = e.target.value; setTt((cu) => ({ ...cu, bai: { ...cu.bai, [t.so]: v } })); }}
          />
          <div className={s.demTu}>
            <span style={{ color: soTu >= t.minTu ? 'var(--c-ok)' : undefined, fontWeight: 600 }}>Word count: {soTu}{soTu < t.minTu ? ` / ít nhất ${t.minTu}` : ' ✓'}</span>
            <span>Không có kiểm tra chính tả — như phòng thi thật.</span>
          </div>
        </div>
      </div>
      <footer className={s.thiDuoi}>
        {tasks.map((x) => (
          x.so === dang
            ? <span key={x.so} className={s.phanNav}><span className={s.phanTen}>Part {x.so}</span><span className={`${s.oSo} ${s.oSoDang}`} style={{ display: 'inline-grid', placeItems: 'center' }}>{x.so}</span><span className={s.mo}>{demTuViet(tt.bai[x.so] ?? '')} từ</span></span>
            : <button key={x.so} type="button" className={s.phanTat} onClick={() => { setDang(x.so); setTab('viet'); }}><b>Part {x.so}</b>{demTuViet(tt.bai[x.so] ?? '')} từ</button>
        ))}
        <div className={s.duoiPhai}>
          <button type="button" className={s.iconBtn} disabled={dang === tasks[0].so} onClick={() => setDang(tasks[0].so)}>◀</button>
          <button type="button" className={s.iconBtn} disabled={dang === tasks[tasks.length - 1].so} onClick={() => setDang(tasks[tasks.length - 1].so)}>▶</button>
        </div>
      </footer>
    </div>
  );
}
