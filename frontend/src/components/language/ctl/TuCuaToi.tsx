'use client';

/**
 * "Từ của tôi" — quản lý từ đã học / đã biết / khó (app `TuCuaToiHTVView`, HocTuVungCTL.swift), 24/11/2026.
 * Lọc Tất cả · Đang học · Đã thuộc · Khó, tìm theo chữ / nghĩa / cách đọc, ôn lại cả nhóm đang lọc (≤ 20 từ đầu), từng từ:
 * nghe · đánh dấu khó / bỏ khó · đánh dấu đã thuộc · bỏ đánh dấu (học lại như từ mới).
 * Từ học trên điện thoại (chỉ có trong sổ "Học từ vựng" của tài khoản) cũng hiện ở đây; đánh dấu lần đầu ⇒ nhận vào trình
 * duyệt (`nhanTu`, như app `nhanTuSoOn`). "Bỏ đánh dấu" chỉ gỡ trạng thái TRÊN TRÌNH DUYỆT (app cũng chỉ gỡ trên máy) — thẻ ôn
 * lặp của tài khoản giữ nguyên, nên từ đã có thẻ vẫn tính là "đã gặp".
 */
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { AlertTriangle, BadgeCheck, RotateCcw, Search, Undo2, X } from 'lucide-react';
import { NutNghe, css as s } from './chung';
import { boDanhDau, datKho, datThuoc, docHien, locTuCuaToi, nhanTu, type LocTuCuaToi, type TuHoc } from '@/lib/ctlanguage/hocTuVung';
import { khoHtv } from '@/lib/ctlanguage/khoTrinhDuyet';
import type { NnCTL } from '@/lib/ctlanguage/soTu';

export interface MucTuCuaToi extends TuHoc {
  thuoc: boolean;
  kho?: boolean;
  daBiet?: boolean;
  /** Chỉ có trong sổ ôn lặp của tài khoản (chưa có bản ghi trên trình duyệt). */
  chiTaiKhoan?: boolean;
  /** Có thẻ ôn lặp trong sổ "Học từ vựng" của tài khoản. */
  coThe?: boolean;
  hocLuc: string;
}

const LOC: { ma: LocTuCuaToi; ten: string }[] = [
  { ma: 'tatCa', ten: 'Tất cả' }, { ma: 'dangHoc', ten: 'Đang học' }, { ma: 'thuoc', ten: 'Đã thuộc' }, { ma: 'kho', ten: 'Khó' },
];

export function TuCuaToi({ nn, ds, dong, onLai }: { nn: NnCTL; ds: MucTuCuaToi[]; dong: () => void; onLai: (ten: string, ds: TuHoc[]) => void }) {
  const [loc, setLoc] = useState<LocTuCuaToi>('tatCa');
  const [tim, setTim] = useState('');
  const hien = useMemo(() => locTuCuaToi(ds, loc, tim).sort((a, b) => b.hocLuc.localeCompare(a.hocLuc)), [ds, loc, tim]);
  const tenLoc = LOC.find((x) => x.ma === loc)!.ten;

  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape' && !document.querySelector('[data-ctl-phat-am]')) dong(); };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [dong]);

  /** Thao tác trên một từ: từ chỉ có ở tài khoản ⇒ nhận vào trình duyệt trước. */
  const sua = (t: MucTuCuaToi, f: (k: ReturnType<typeof khoHtv.lay>) => ReturnType<typeof khoHtv.lay>) =>
    khoHtv.dat((k) => f(t.chiTaiKhoan ? nhanTu(k, t, nn, t.hocLuc) : k));

  return (
    <div className={s.mo} onClick={dong} role="dialog" aria-modal="true" aria-label="Từ của tôi">
      <div className={s.moHop} style={{ width: 'min(100%, 40rem)', maxHeight: 'min(88vh, 860px)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 className={s.h2} style={{ flex: 1, fontSize: 22 }}>Từ của tôi</h2>
          <button type="button" className={s.icoBtn} style={{ '--c': 'var(--lh-ink-3)' } as CSSProperties} onClick={dong} aria-label="Đóng"><X size={16} /></button>
        </div>
        <div className={s.seg} style={{ marginTop: 12 }} role="tablist" aria-label="Lọc">
          {LOC.map((x) => (
            <button key={x.ma} type="button" role="tab" aria-selected={loc === x.ma} className={s.segBtn} data-on={loc === x.ma || undefined} onClick={() => setLoc(x.ma)}>
              {x.ten} <span className={s.chipSo}>{locTuCuaToi(ds, x.ma, '').length}</span>
            </button>
          ))}
        </div>
        <label className={s.chip} style={{ display: 'flex', marginTop: 10 }}>
          <Search size={14} />
          <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm từ hoặc nghĩa" aria-label="Tìm từ"
            style={{ background: 'transparent', outline: 'none', border: 0, flex: 1, minWidth: 0, color: 'var(--lh-ink)' }} />
        </label>
        {hien.length >= 2 ? (
          <button type="button" className={`${s.btn} ${s.btnLon}`} style={{ width: '100%', marginTop: 12 }}
            onClick={() => onLai(`Ôn lại · ${tenLoc}`, hien.slice(0, 20))}>
            <RotateCcw size={17} /> {hien.length > 20 ? 'Ôn lại 20 từ đầu của nhóm này' : `Ôn lại ${hien.length} từ của nhóm này`}
          </button>
        ) : null}
        {!hien.length ? (
          <div className={s.trong} style={{ padding: '36px 8px' }}>
            {tim ? 'Không tìm thấy — thử từ khoá khác.' : 'Chưa có từ nào ở mục này. Học một bài ở trang Học từ vựng — từ đã học / đã biết sẽ hiện ở đây.'}
          </div>
        ) : (
          <>
            <p className={s.note} style={{ marginTop: 12 }}>{hien.length} từ</p>
            <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
              {hien.map((t) => {
                const d = docHien(t);
                return (
                  <div key={t.k} className={s.card} style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div className={s.minh}>
                      <div style={{ fontSize: nn === 'en' ? 17 : 20, fontWeight: 800 }}>{t.chu}</div>
                      {d ? <div style={{ fontSize: 13, color: 'var(--lh-accent)' }}>{d}</div> : null}
                      <div className={s.vocabNghia}>{t.nghia}</div>
                      <div className={s.chips} style={{ marginTop: 8, gap: 6 }}>
                        <span className={`${s.chip} ${s.chipNho}`} style={{ color: t.thuoc ? 'var(--lh-ok)' : 'var(--lh-accent)', borderColor: 'transparent', background: t.thuoc ? 'var(--lh-ok-soft)' : 'var(--lh-accent-soft)' }}>
                          {t.daBiet ? 'Đã biết' : t.thuoc ? 'Đã thuộc' : 'Đang học'}
                        </span>
                        {t.kho ? <span className={`${s.chip} ${s.chipNho}`} style={{ color: 'var(--lh-bad)', borderColor: 'transparent', background: 'var(--lh-bad-soft)' }}>Khó</span> : null}
                        {t.chiTaiKhoan ? <span className={`${s.chip} ${s.chipNho}`} title="Học trên app điện thoại — có trong sổ ôn lặp của tài khoản">📱 từ app</span> : null}
                      </div>
                      <div className={s.chips} style={{ marginTop: 8, gap: 6 }}>
                        <button type="button" className={`${s.chip} ${s.chipNho}`} onClick={() => sua(t, (k) => datKho(k, nn, t.k, !t.kho))}>
                          <AlertTriangle size={13} /> {t.kho ? 'Bỏ đánh dấu khó' : 'Đánh dấu khó'}
                        </button>
                        {!t.thuoc ? (
                          <button type="button" className={`${s.chip} ${s.chipNho}`} onClick={() => sua(t, (k) => datThuoc(k, nn, t.k))}>
                            <BadgeCheck size={13} /> Đánh dấu đã thuộc
                          </button>
                        ) : null}
                        {!t.chiTaiKhoan ? (
                          <button type="button" className={`${s.chip} ${s.chipNho}`}
                            title={t.coThe ? 'Gỡ trạng thái trên trình duyệt này; thẻ ôn lặp của tài khoản vẫn giữ' : 'Từ quay lại thành từ mới ở bài của nó'}
                            onClick={() => { if (window.confirm(`Bỏ đánh dấu “${t.chu}” và học lại như từ mới?${t.coThe ? '\n(Thẻ ôn lặp trong tài khoản vẫn giữ.)' : ''}`)) khoHtv.dat((k) => boDanhDau(k, nn, t.k)); }}>
                            <Undo2 size={13} /> Bỏ đánh dấu · học lại
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <NutNghe chu={t.chu} nn={nn} />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
