'use client';

/**
 * Ôn thẻ đến hạn (ôn lặp SM-2) trên web — cùng bộ thẻ với app CT Language (sổ "Học từ vựng" / mọi sổ), 24/11/2026.
 * Lật thẻ ⇒ chấm Quên · Khó · Nhớ · Dễ (như app `LichOn.cham`) ⇒ ghi lên tài khoản ngay: điện thoại thấy lịch ôn mới.
 * Phím: Space lật · 1–4 chấm · Esc thoát.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { GIONG_MAC_DINH, NutNghe, css as s, phat } from './chung';
import { chamOnThe } from '@/lib/ctlanguage/dongBo';
import { CHAM_ON, chamThe, moTaCham, type ChamOn, type NnCTL, type TheTuCTL } from '@/lib/ctlanguage/soTu';

const MAU: Record<ChamOn, string> = { quen: '#dc2626', kho: '#d97706', nho: '#2563eb', de: '#16a34a' };

export function OnThe({ nn, the, dong, tuDoc }: { nn: NnCTL; the: TheTuCTL[]; dong: () => void; tuDoc: boolean }) {
  const [hang, setHang] = useState(the);
  const [i, setI] = useState(0);
  const [lat, setLat] = useState(false);
  const [dem, setDem] = useState<Record<ChamOn, number>>({ quen: 0, kho: 0, nho: 0, de: 0 });
  const daLapLai = useRef(new Set<string>());
  const t = hang[i];

  useEffect(() => { if (t && tuDoc) void phat({ text: t.muc.chu, voice: GIONG_MAC_DINH[nn] }); }, [t, nn, tuDoc]);

  const cham = (c: ChamOn) => {
    if (!t || !lat) return;
    chamOnThe(t, c);
    setDem((d) => ({ ...d, [c]: d[c] + 1 }));
    // Quên ⇒ gặp lại cuối lượt (một lần) — như ôn lặp trên app (hẹn 10 phút).
    const k = `${t.nn}-${t.muc.id}`;
    if (c === 'quen' && !daLapLai.current.has(k)) { daLapLai.current.add(k); setHang((h) => [...h, chamThe(t, 'quen', new Date())]); }
    setLat(false);
    setI((x) => x + 1);
  };

  const phimRef = useRef<(e: KeyboardEvent) => void>(() => {});
  useEffect(() => {
    phimRef.current = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { dong(); return; }
      if (!t) return;
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setLat(true); return; }
      const n = Number(e.key);
      if (lat && n >= 1 && n <= 4) cham(CHAM_ON[n - 1]!.ma);
    };
  });
  useEffect(() => {
    const f = (e: KeyboardEvent) => phimRef.current(e);
    window.addEventListener('keydown', f);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', f); document.body.style.overflow = ''; };
  }, []);

  const bayGio = new Date();
  return (
    <div className={s.root} style={{ paddingTop: 0 }}>
      <div className={s.phien} role="dialog" aria-modal="true" aria-label="Ôn thẻ đến hạn">
        <div className={s.phienTop}>
          <button type="button" className={s.icoBtn} style={{ '--c': 'var(--lh-ink-3)' } as CSSProperties} onClick={dong} aria-label="Thoát"><X size={18} /></button>
          <div className={s.phienThanh}><i style={{ width: `${(Math.min(i, hang.length) / Math.max(1, hang.length)) * 100}%` }} /></div>
          <span className={s.note}>{Math.min(i + 1, hang.length)}/{hang.length}</span>
        </div>
        <div className={s.phienNoi}>
          <div className={s.phienNoiIn}>
            {t ? (
              <>
                <div className={`${s.theTu} ${s.lat}`} onClick={() => setLat(true)} role="button" tabIndex={0} aria-label={lat ? 'Mặt sau' : 'Lật thẻ'}>
                  <div className={s.dangLabel}>Ôn lặp · {lat ? 'bạn nhớ tới đâu?' : 'nhớ nghĩa rồi lật thẻ'}</div>
                  <div className={s.theChu}>{t.muc.chu}</div>
                  <div onClick={(e) => e.stopPropagation()}><NutNghe chu={t.muc.chu} nn={nn} /></div>
                  {lat ? (
                    <>
                      {t.muc.doc && t.muc.doc !== t.muc.chu ? <div className={s.theDoc}>{t.muc.doc.replace(/[『』]/g, '')}{t.muc.hanViet ? ` · ${t.muc.hanViet}` : ''}</div> : null}
                      <div className={s.theNghia}>{t.muc.nghiaVi || t.muc.nghiaEn || '—'}</div>
                    </>
                  ) : <div className={s.note}><RotateCcw size={13} style={{ display: 'inline' }} /> Bấm thẻ hoặc phím Space để lật</div>}
                </div>
                {lat ? (
                  <div className={s.cham}>
                    {CHAM_ON.map((c, j) => (
                      <button key={c.ma} type="button" className={s.chamBtn} style={{ '--c': MAU[c.ma] } as CSSProperties} onClick={() => cham(c.ma)}>
                        {c.nhan}<small>{moTaCham(t, c.ma, bayGio)} · {j + 1}</small>
                      </button>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <div className={s.tongKet}>
                <div style={{ fontSize: 54 }}>🌱</div>
                <h2 className={s.h2}>Ôn xong lượt này!</h2>
                <p className={s.lede} style={{ margin: '8px auto 0' }}>
                  Quên {dem.quen} · Khó {dem.kho} · Nhớ {dem.nho} · Dễ {dem.de}. Lịch ôn mới đã lưu lên tài khoản — app trên điện thoại sẽ nhắc đúng hẹn.
                </p>
                <button type="button" className={`${s.btn} ${s.btnLon}`} style={{ marginTop: 20 }} onClick={dong}>Xong</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
