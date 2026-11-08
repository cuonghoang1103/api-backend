'use client';

/**
 * Khối có HÌNH cho bài học (09/11/2026 — người học: "nhớ làm slide, sách… có hình ảnh (con vật, đồ vật,
 * hội thoại…) để học từ vựng, chuyên nghiệp"):
 *   - `hinh`   thẻ từ có hình — chạm để nghe, "Che nghĩa"/"Che chữ" để tự kiểm tra.
 *   - `canh`   cảnh minh hoạ (vài hình + lời dẫn) mở đầu hội thoại / 言ってみよう.
 *   - `slides` bộ slide kiểu bài giảng trên lớp: ←/→, toàn màn hình, in cả bộ (mỗi slide một trang).
 * Hình = Microsoft Fluent Emoji (MIT), phục vụ từ media.cuongthai.com (scripts/hinh/len-r2.mts).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Printer, Eye, EyeOff, Volume2 } from 'lucide-react';
import type { Block, Slide } from './types';
import { Inline } from './Blocks';
import { play } from './audio';
import { inKhung } from './inKhung';
import s from './course.module.css';
import h from './hinh.module.css';

/** Tên hình → URL ảnh. URL https đi thẳng; tên thì lấy bản WebP trên CDN của web. */
export function anhUrl(anh: string): string {
  return /^https?:\/\//.test(anh) ? anh : `https://media.cuongthai.com/hoc/hinh/${encodeURIComponent(anh)}.webp`;
}

/** Bỏ cú pháp {漢字|かな} → chữ đọc được để đưa vào giọng đọc. */
const doc = (t: string) => t.replace(/\{([^|}]+)\|([^}]+)\}/g, '$1').replace(/\*\*|==|~~/g, '');

function Anh({ anh, alt, className }: { anh: string; alt: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- ảnh tĩnh nhỏ trên CDN, không qua tối ưu ảnh của Next
  return <img src={anhUrl(anh)} alt={alt} className={className} loading="lazy" decoding="async" draggable={false} />;
}

export function HinhTu({ b }: { b: Extract<Block, { t: 'hinh' }> }) {
  const [che, setChe] = useState<'' | 'nghia' | 'chu'>('');
  return (
    <div className={h.khung}>
      <div className={h.dau}>
        <div className={s.quizTitle}>🖼️ {b.title ?? 'Từ vựng bằng hình'}</div>
        <div className={h.nutNhom}>
          <button type="button" className={`${s.btnGhost} ${che === 'nghia' ? h.bat : ''}`} onClick={() => setChe(che === 'nghia' ? '' : 'nghia')}>
            {che === 'nghia' ? <Eye size={14} /> : <EyeOff size={14} />} Che nghĩa
          </button>
          <button type="button" className={`${s.btnGhost} ${che === 'chu' ? h.bat : ''}`} onClick={() => setChe(che === 'chu' ? '' : 'chu')}>
            {che === 'chu' ? <Eye size={14} /> : <EyeOff size={14} />} Che chữ Nhật
          </button>
        </div>
      </div>
      <div className={h.luoi}>
        {b.items.map((x, i) => (
          <button key={i} type="button" className={h.the} onClick={() => play({ text: doc(x.w) })} title="Chạm để nghe">
            <Anh anh={x.anh} alt={x.vi} className={h.anhThe} />
            <span className={`${h.chuNhat} ${che === 'chu' ? h.che : ''}`}><Inline text={x.w} /></span>
            <span className={`${s.ro} ${h.ro} ${che === 'chu' ? h.che : ''}`}>{x.ro}</span>
            <span className={`${h.nghia} ${che === 'nghia' ? h.che : ''}`}>{x.vi}</span>
            <Volume2 size={13} className={h.loa} aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}

export function Canh({ b }: { b: Extract<Block, { t: 'canh' }> }) {
  return (
    <figure className={h.canh}>
      <div className={h.canhHinh}>
        {b.anh.map((a, i) => <Anh key={i} anh={a} alt="" className={h.anhCanh} />)}
      </div>
      <figcaption className={h.canhChu}><Inline text={b.caption} /></figcaption>
    </figure>
  );
}

function MotSlide({ sl, so, tong, tieuDeBo }: { sl: Slide; so: number; tong: number; tieuDeBo: string }) {
  const [moDap, setMoDap] = useState(false);
  useEffect(() => setMoDap(false), [sl]);
  const nhieuHinh = (sl.anh?.length ?? 0) > 0;
  return (
    <div className={h.slide}>
      <div className={h.slideTieuDe}><Inline text={sl.tieuDe} /></div>
      <div className={`${h.slideThan} ${nhieuHinh && (sl.dong?.length || sl.bang) ? h.slideHai : ''}`}>
        {nhieuHinh && (
          <div className={h.slideHinh} data-so={sl.anh!.length}>
            {sl.anh!.map((a, i) => (
              <div key={i} className={h.slideO}>
                <Anh anh={a} alt={sl.nhan?.[i] ? doc(sl.nhan[i]) : ''} className={h.anhSlide} />
                {sl.nhan?.[i] && (
                  <button type="button" className={h.slideNhan} onClick={() => play({ text: doc(sl.nhan![i]) })}>
                    <Inline text={sl.nhan[i]} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {(sl.dong?.length || sl.bang) && (
          <div className={h.slideChu}>
            {sl.dong?.map((d, i) => (
              <div key={i} className={h.slideDong}>
                <div><Inline text={d} /></div>
                {sl.ro?.[i] && <div className={`${s.ro} ${h.slideRo}`}>{sl.ro[i]}</div>}
              </div>
            ))}
            {sl.bang && (
              <table className={h.slideBang}>
                <thead><tr>{sl.bang.head.map((c, i) => <th key={i}><Inline text={c} /></th>)}</tr></thead>
                <tbody>{sl.bang.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><Inline text={c} /></td>)}</tr>)}</tbody>
              </table>
            )}
          </div>
        )}
      </div>
      {sl.hoi && (
        <div className={h.slideHoi}>
          <span className={h.hoiNhan}>❓</span>
          <span className={h.hoiChu}><Inline text={sl.hoi} /></span>
          {sl.dap && (moDap
            ? <span className={h.dap}><Inline text={sl.dap} /></span>
            : <button type="button" className={h.nutDap} onClick={() => setMoDap(true)}>Xem đáp án</button>)}
        </div>
      )}
      <div className={h.slideChan}><span>{tieuDeBo}</span><span>{so}/{tong}</span></div>
    </div>
  );
}

export function BoSlide({ b }: { b: Extract<Block, { t: 'slides' }> }) {
  const [i, setI] = useState(0);
  const [toan, setToan] = useState(false);
  const goc = useRef<HTMLDivElement>(null);
  const tong = b.slides.length;
  const toi = useCallback((d: number) => setI((x) => Math.min(tong - 1, Math.max(0, x + d))), [tong]);

  useEffect(() => {
    const el = goc.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement) && !toan) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); toi(1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); toi(-1); }
      else if (e.key === 'Escape' && toan) setToan(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toi, toan]);

  const banInRef = useRef<HTMLDivElement>(null);
  // In cả bộ: mỗi slide một trang A4 ngang, trong iframe riêng (inKhung.ts) — không dính giao diện trang.
  const inSlide = () => { if (banInRef.current) inKhung(banInRef.current, { trangNgang: true, tieuDe: b.title }); };

  const sl = b.slides[i];
  return (
    <div ref={goc} className={`${h.boSlide} ${toan ? h.toanMan : ''}`} tabIndex={0} aria-roledescription="bộ slide" aria-label={b.title}>
      <div className={h.boDau}>
        <div className={s.quizTitle}>📽️ {b.title}</div>
        <div className={h.nutNhom}>
          <button type="button" className={s.btnGhost} onClick={inSlide} title="In / lưu PDF cả bộ slide"><Printer size={14} /> In slide</button>
          <button type="button" className={s.btnGhost} onClick={() => setToan(!toan)}>
            {toan ? <Minimize2 size={14} /> : <Maximize2 size={14} />} {toan ? 'Thu nhỏ' : 'Toàn màn hình'}
          </button>
        </div>
      </div>
      <div className={h.manChieu}>
        <MotSlide key={i} sl={sl} so={i + 1} tong={tong} tieuDeBo={b.title} />
      </div>
      {sl.ghi && <div className={h.ghiGiang}><b>🧑‍🏫 Giảng:</b> <Inline text={sl.ghi} /></div>}
      <div className={h.dieuKhien}>
        <button type="button" className={s.btnGhost} onClick={() => toi(-1)} disabled={i === 0}><ChevronLeft size={16} /> Trước</button>
        <div className={h.cham} role="tablist" aria-label="Chọn slide">
          {b.slides.map((_, k) => (
            <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={`Slide ${k + 1}`} className={`${h.chamNut} ${k === i ? h.chamBat : ''}`} onClick={() => setI(k)} />
          ))}
        </div>
        <button type="button" className={s.btn} onClick={() => toi(1)} disabled={i === tong - 1}>Sau <ChevronRight size={16} /></button>
      </div>
      {/* Bản in: mọi slide, mỗi slide một trang ngang — chỉ hiện khi đang in bộ này. */}
      <div ref={banInRef} className={h.banIn} aria-hidden>
        {b.slides.map((x, k) => (
          <div key={k} className={h.trangIn}><MotSlide sl={x} so={k + 1} tong={tong} tieuDeBo={b.title} /></div>
        ))}
      </div>
    </div>
  );
}
