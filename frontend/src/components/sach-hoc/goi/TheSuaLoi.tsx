'use client';

/**
 * 📝 Thẻ sau mỗi lượt trò chuyện (19/10/2026): câu của bạn → câu tự nhiên hơn → vì sao
 * (kèm furigana/pinyin), từ mới đáng học — bấm là lưu vào Sổ lỗi để ôn giãn cách.
 * Bản dịch tiếng Việt lời CuongMini hiện khi bật "Phụ đề".
 */
import { useState } from 'react';
import { bam, luuSoOn, type MetaLuot, type NgonNguGoi } from './apiCuongMini';
import { c, ngonNguUI } from './chu';
import s from '../course.module.css';

const TEN: Record<NgonNguGoi, string> = { en: 'tiếng Anh', ja: 'tiếng Nhật', zh: 'tiếng Trung' };

export default function TheSuaLoi({ meta, nn, phuDe, onDaLuu }: { meta: MetaLuot; nn: NgonNguGoi; phuDe: boolean; onDaLuu?: (loai: 'sua' | 'tu') => void }) {
  const ui = ngonNguUI();
  const [daLuu, setDaLuu] = useState<Record<string, 'dang' | 'xong' | 'loi'>>({});
  const luu = async (khoa: string, loai: 'sua' | 'tu', muc: Parameters<typeof luuSoOn>[0][number]) => {
    if (daLuu[khoa] === 'dang' || daLuu[khoa] === 'xong') return;
    setDaLuu((x) => ({ ...x, [khoa]: 'dang' }));
    try { await luuSoOn([muc]); setDaLuu((x) => ({ ...x, [khoa]: 'xong' })); onDaLuu?.(loai); } catch { setDaLuu((x) => ({ ...x, [khoa]: 'loi' })); }
  };
  const nut = (khoa: string) => (daLuu[khoa] === 'xong' ? c('daLuu', ui) : daLuu[khoa] === 'loi' ? '⚠️' : c('luuSoOn', ui));
  const sua = meta.sua;
  if (!sua && !meta.tu.length && !(phuDe && meta.dich)) return null;
  return (
    <div className={s.goiThe}>
      {phuDe && meta.dich && <div className={s.goiDich}>🇻🇳 {meta.dich}</div>}
      {sua && (
        <div className={s.goiSua}>
          <div className={s.goiSuaDong}><span className={s.goiSuaNhan}>{c('cauCuaBan', ui)}</span><s lang={nn}>{sua.ban}</s></div>
          <div className={s.goiSuaDong}>
            <span className={s.goiSuaNhan}>{c('cauDung', ui)}</span>
            <b lang={nn}>{sua.dung}</b>
          </div>
          {sua.doc && <div className={s.goiSuaDoc} lang={nn === 'en' ? undefined : nn}>{sua.doc}</div>}
          {sua.viSao && <div className={s.goiSuaVi}>💡 {sua.viSao}</div>}
          <button
            type="button" className={s.goiLuuNut}
            onClick={() => void luu(`s:${sua.ban}`, 'sua', {
              nguon: `cm:${nn}:sua:${bam(sua.ban)}`, kyNang: 'noi', dang: `Nói — CuongMini (${TEN[nn]})`,
              cauHoi: `Nói lại cho tự nhiên: “${sua.ban}”`, daChon: sua.ban, dapAn: sua.dung,
              giaiThich: [sua.viSao, sua.doc].filter(Boolean).join(' · '),
            })}
          >{nut(`s:${sua.ban}`)}</button>
        </div>
      )}
      {meta.tu.length > 0 && (
        <div className={s.goiTuMoi}>
          <span className={s.goiSuaNhan}>✨ {c('tuMoi', ui)}</span>
          {meta.tu.map((t) => (
            <button
              key={t.tu} type="button" className={s.goiTuChip} title={c('luuSoOn', ui)}
              onClick={() => void luu(`t:${t.tu}`, 'tu', {
                nguon: `cm:${nn}:tu:${bam(t.tu)}`, kyNang: 'tuvung', dang: `Từ mới — CuongMini (${TEN[nn]})`,
                cauHoi: `Từ ${TEN[nn]} nghĩa là “${t.nghia}”${t.doc ? ` (đọc: ${t.doc})` : ''}`, daChon: '', dapAn: t.tu,
                ...(nn === 'en' ? { duLieu: { loai: 'tu', tu: t.tu } } : {}),
              })}
            >
              <b lang={nn}>{t.tu}</b>{t.doc && <small>{t.doc}</small>}<span>{t.nghia}</span>
              <i>{daLuu[`t:${t.tu}`] === 'xong' ? '✓' : '+'}</i>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
