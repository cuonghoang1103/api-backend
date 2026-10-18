'use client';

/**
 * 🏁 Tổng kết buổi luyện (19/10/2026): thời lượng, thời gian BẠN nói, số lượt, lỗi được
 * sửa / điểm phát âm, từ mới, chuỗi ngày — và (trò chuyện) ước lượng band IELTS theo 4
 * tiêu chí hoặc trình độ JLPT/HSK cho cả buổi. Ghi "hôm nay có học" khi ≥ 3 lượt.
 */
import { useEffect, useState } from 'react';
import { chamBuoi, ghiNgayHoc, layChuoi, type KetQuaCham, type NgonNguGoi, type TuMoi } from './apiCuongMini';
import { c, ngonNguUI } from './chu';
import s from '../course.module.css';

export interface ThongKeBuoi {
  batDau: number;
  giayNoi: number;
  soLuot: number;
  soLoi: number;
  diem: number[];
  tuMoi: TuMoi[];
}

const phut = (giay: number, en: boolean) => {
  const g = Math.max(0, Math.round(giay));
  const m = Math.floor(g / 60);
  return m ? `${m}${en ? ' min ' : ' phút '}${g % 60}${en ? 's' : ' giây'}` : `${g}${en ? 's' : ' giây'}`;
};

export default function TongKetBuoi({ tk, cheDo, nn, stage, chuDeId, tenBai, luot, onDong, onOLai, daGhiChuoi }: {
  tk: ThongKeBuoi;
  cheDo: 'tro-chuyen' | 'phat-am';
  nn: NgonNguGoi;
  stage?: string;
  chuDeId: string;
  tenBai: string;
  luot: { ai: boolean; text: string }[];
  onDong: () => void;
  onOLai: () => void;
  /** Đánh dấu đã ghi ngày học (để khi đóng phòng không ghi lần hai). */
  daGhiChuoi: () => void;
}) {
  const ui = ngonNguUI();
  const en = ui === 'en';
  const [chuoi, setChuoi] = useState<number | null>(null);
  const [cham, setCham] = useState<KetQuaCham | null>(null);
  const [dangCham, setDangCham] = useState(false);
  const [loiCham, setLoiCham] = useState('');

  useEffect(() => {
    if (!stage) return;
    let song = true;
    (async () => {
      try {
        if (tk.soLuot >= 3) { await ghiNgayHoc(stage); daGhiChuoi(); }
        const r = await layChuoi(stage);
        if (song) setChuoi(r?.chuoi ?? null);
      } catch { /* chưa đăng nhập / mất mạng: bỏ ô chuỗi */ }
    })();
    return () => { song = false; };
    // Chạy MỘT lần lúc mở tổng kết.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uocLuong = async () => {
    setDangCham(true); setLoiCham('');
    try {
      const r = await chamBuoi({ ngonNgu: nn, chuDeId, tenBai, luot: luot.slice(-30) });
      if (r && 'tong' in r) setCham(r);
      else setLoiCham(r && 'lyDo' in r && r.lyDo === 'it_luot' ? (en ? 'Speak at least 2 turns first.' : 'Cần ít nhất 2 lượt bạn nói.') : (en ? 'Could not score this time.' : 'Chưa chấm được, thử lại sau nhé.'));
    } catch { setLoiCham(en ? 'Network error.' : 'Mạng chập chờn, thử lại nhé.'); } finally { setDangCham(false); }
  };

  const diemTb = tk.diem.length ? Math.round(tk.diem.reduce((a, b) => a + b, 0) / tk.diem.length) : null;
  const o = (nhan: string, giaTri: string | number, em: string) => (
    <div className={s.goiTkO}><span>{em}</span><b>{giaTri}</b><small>{nhan}</small></div>
  );
  return (
    <div className={s.goiTkNen} role="dialog" aria-modal="true" aria-label={c('tongKet', ui)}>
      <div className={s.goiTk}>
        <h2>🏁 {c('tongKet', ui)}</h2>
        <div className={s.goiTkLuoi}>
          {o(c('thoiLuong', ui), phut((Date.now() - tk.batDau) / 1000, en), '⏱️')}
          {o(c('banNoi', ui), phut(tk.giayNoi, en), '🎙️')}
          {o(c('soLuot', ui), tk.soLuot, '💬')}
          {cheDo === 'tro-chuyen' ? o(c('soLoi', ui), tk.soLoi, '🛠️') : o(c('diemTb', ui), diemTb ?? '—', '🎯')}
          {chuoi !== null && o(c('chuoiNgay', ui), `${chuoi} ${c('ngay', ui)}`, '🔥')}
        </div>
        {tk.tuMoi.length > 0 && (
          <div className={s.goiTkTu}>
            <b>✨ {c('tuMoi', ui)}:</b> {tk.tuMoi.slice(0, 12).map((t) => <span key={t.tu} lang={nn}>{t.tu} <small>{t.nghia}</small></span>)}
          </div>
        )}
        {cheDo === 'tro-chuyen' && (
          <div className={s.goiTkCham}>
            {!cham && (
              <button type="button" className={s.goiNutChinh} onClick={() => void uocLuong()} disabled={dangCham}>
                {dangCham ? c('dangCham', ui) : nn === 'en' ? `📊 ${c('uocBand', ui)}` : `📊 ${c('uocTrinhDo', ui)}`}
              </button>
            )}
            {loiCham && <div className={s.goiLoiNho}>{loiCham}</div>}
            {cham && (
              <>
                <div className={s.goiBand}><span>{cham.thang === 'band' ? 'Band' : en ? 'Score' : 'Điểm'}</span><b>{cham.tong}</b></div>
                <div className={s.goiTieuChi}>
                  {cham.tieuChi.map((t) => (
                    <div key={t.ma}><b>{t.ten || t.ma} · {t.diem}</b><span>{t.nhanXet}</span></div>
                  ))}
                </div>
                {cham.nhanXet && <p>{cham.nhanXet}</p>}
                {cham.goiY.length > 0 && <ul>{cham.goiY.map((g) => <li key={g}>{g}</li>)}</ul>}
                <small className={s.goiTkGhiChu}>{c('uocLuongGhiChu', ui)}</small>
              </>
            )}
          </div>
        )}
        <div className={s.goiTkNut}>
          <button type="button" className={s.goiNutMo} onClick={onOLai}>{c('oLai', ui)}</button>
          <button type="button" className={s.goiKetThuc} onClick={onDong}>{c('dong', ui)}</button>
        </div>
      </div>
    </div>
  );
}
